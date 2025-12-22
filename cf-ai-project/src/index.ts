/*
 * index.ts
 *
 * Entry point for Cloudflare Worker.
 */

import { Ai  } from '@cloudflare/ai'
import { Hono } from 'hono'
import index from './index.html'

export interface Env {
	AI: any,
	KV: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()

// regular index endpoint
app.get("/", c => {
	return c.html(index)
})

// endpoint for loading stored messages
app.get("/session", async c => {
	const session = c.req.query("session") || "default"
	const prevMsgsRaw = await c.env.KV.get(session)
	const prevMsgs = prevMsgsRaw ? JSON.parse(prevMsgsRaw) : []
	return c.json({ messages : prevMsgs })
})

// endpoint for calling the AI
app.get("/stream", async c => {
	const ai = new Ai(c.env.AI)

	// get query and session ID
	const question = c.req.query("query") || "Hello!"
	const session = c.req.query("session") || "default"

	// get previous response if any
	const prevMsgsRaw = await c.env.KV.get(session)
	const prevMsgs = prevMsgsRaw ? JSON.parse(prevMsgsRaw) : []

	// compose prompt
	const messages = [
		{ role: "system", content: "You are a helpful assistant, and your name is Ada, inspired by Ada Lovelace." },
		...prevMsgs,
		{ role: "user", content: question }
	]

	// create stream components
	const { readable, writable } = new TransformStream()
	const writer = writable.getWriter()
	const encoder = new TextEncoder()
	const decoder = new TextDecoder()
	let assistContent = ""

	// call AI
	const stream = await ai.run(
		"@cf/meta/llama-3.3-70b-instruct-fp8-fast" as unknown as Parameters<typeof ai.run>[0],
		{ messages, stream: true }
	) as ReadableStream

	// get response from stream
	c.executionCtx.waitUntil(
		(async () => {
			const reader = stream.getReader()
			let buffer = ""

			while (true) {
				const { value, done } = await reader.read()
				if (done) break

				// decode chunk and forward to browser
				const chunk = decoder.decode(value)
				await writer.write(encoder.encode(chunk))

				// add chunk to buffer
				buffer += chunk

				// process complete lines in buffer
				let newlineIndex: number
				while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
					const line = buffer.slice(0, newlineIndex)
					buffer = buffer.slice(newlineIndex + 1)

					if (!line.startsWith("data: ")) continue
					const data = line.slice(6)
					if (data === "[DONE]") continue

					try {
						const json = JSON.parse(data)
						if (typeof json.response === "string") {
							assistContent += json.response
						}
					} catch {
						console.error("Invalid data.", data)
					}
				}
			}

			// append new turn to previous
			let updatedMsgs = [
				...prevMsgs,
				{ role: "user", content: question },
				{ role: "assistant", content: assistContent }
			]

			// cap to last 10 turns
			if (updatedMsgs.length > 20) {
				updatedMsgs = updatedMsgs.slice(updatedMsgs.length - 20)
			}

			// save to KV
			await c.env.KV.put(session, JSON.stringify(updatedMsgs))
			writer.close()
		})()
	)

	// return readable stream
	return new Response(readable as any, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			"Connection": "keep-alive"
		}
	})
})

export default app