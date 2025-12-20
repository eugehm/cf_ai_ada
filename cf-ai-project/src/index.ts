/*
 * index.ts
 *
 * Entry point for Cloudflare Worker.
 */

import { Ai  } from '@cloudflare/ai'
import { Hono } from 'hono'
import template from './template.html'

export interface Env {
	AI: any
}

const app = new Hono<{ Bindings: Env }>()

app.get("/", c => {
	return c.html(template)
})

app.get("/stream", async c => {
	const ai = new Ai(c.env.AI)

	const query = c.req.query("query");
	const question = query || "Hello!"

	const messages = [
		{ role: "system", content: "You are a helpful assistant." },
		{ role: "user", content: question }
	]

	const response = await ai.run(
		"@cf/meta/llama-3.3-70b-instruct-fp8-fast" as unknown as Parameters<typeof ai.run>[0],
		{ messages, stream: true }
	)

	return new Response(response as any, {
		headers: {
			"Content-Type": "text/event-stream"
		}
	})
})

export default app