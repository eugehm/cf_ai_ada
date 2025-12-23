# Prompts

The following were ChatGPT prompts I used to complete this project.

## Prompt 1
**Prompt:** Is there a way to combine streaming AI responses with KV in a Cloudflare Worker chat app? Simply passing the response into the KV value doesn’t work.

**Response:** Explained how to integrate `TransformStream` streaming with KV storage: read chunks from the AI stream, forward them to the browser as they arrive, and append the full message to KV at the end.

## Prompt 2
**Prompt:** Is there a way to implement persistent chat sessions in the browser using cookies and KV?

**Response:** Described how to store a session ID in a cookie and use it to associate user messages with KV storage. Provided code for creating and setting the cookie.

## Prompt 3
**Prompt:** What libraries can I use to ensure AI responses are rendered with proper formatting in the chat while preventing malicious HTML input?

**Response:** Recommended using `marked` to parse markdown and `DOMPurify` to sanitize HTML. Provided example code for safely streaming formatted AI responses to the browser.