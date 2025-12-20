import { Ai } from '@cloudflare/ai'
import { Hono } from 'hono'

export interface Env {
	AI: any
}

const app = new Hono<{ Bindings: Env }>()

app.get("/", async c => {
	const ai = new Ai(c.env.AI)

	const messages = [
		{
			role: "system",
			content: "You are a friendly assistant."
		},
		{
			role: "user",
			content: "What is the origin of the phrase Hello, World?",
		}
	];

	const response = await ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast" as unknown as Parameters<typeof ai.run>[0], { messages })

	return c.json(response)
})

export default app