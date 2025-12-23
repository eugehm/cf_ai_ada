# Ada - An AI-powered Chatbot

## Overview
Ada is an AI-powered application built on Cloudflare Workers and Llama 3.3. It features:
- **Chat interface** for user input
- **Memory management** with KV storage
- Streaming AI responses
- Deployed on Cloudflare Workers & Pages

## Demo
You can try the live app [here](https://cf-ai-ada.eugehm.workers.dev/).

## Features
- Real-time chat with AI
- Markdown formatting for AI responses via `marked`
- Persistent memory for last 20 turns
- Secure handling of user input

## Setup / Running Locally
1. Clone the repo:
```bash
git clone https://github.com/eugehm/cf_ai_ada.git
```
2. Go into the `cf-ai-ada` project folder:
```bash
cd cf-ai-ada
```
3. Configure environment variables/bindings in `wrangler.jsonc`. Make sure to create KV namespaces:
```bash
wrangler kv namespace create KV
wrangler kv namespace create KV --preview
```
And replace `<your-kv-namespace-id>` and `<your-kv-namespace-id-preview>` with your own IDs:
```json
{
	"name": "cf-ai-ada",
	"main": "src/index.ts",
	"compatibility_date": "2025-12-19",
	"ai": {
        "binding": "AI"
    },
	"kv_namespaces": [{
        "binding": "KV",
        "id": "<your-kv-namespace-id>",
        "preview_id": "<your-kv-namespace-id-preview>"
	}],
	"assets": {
        "binding": "ASSETS",
        "directory": "./public/"
    }
}
```
4. Install dependencies:
```bash
npm install
```
5. Run locally
```bash
npm start
```
6. Open the provided localhost link in your browser to test the app.