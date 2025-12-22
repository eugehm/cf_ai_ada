/*
 * load.js
 *
 * Load previous messages if any.
 */

const chat = document.getElementById("chat")

// helper function to scroll chat to bottom
function scrollToBottom() {
    chat.scrollTop = chat.scrollHeight;
}

async function loadMsgs() {
    try {
        const res = await fetch(`/session?session=${session}`)
        if (!res.ok) return

        const data = await res.json()
        if (!data.messages) return

        data.messages.forEach(msg => {
            const div = document.createElement("div")
            div.className = "message " + (msg.role == "user" ? "user-message" : "ai-message")
            
            if (msg.role === "user") {
                div.textContent = msg.content
            } else {
                const dirty = marked.parse(msg.content)
                const clean = DOMPurify.sanitize(dirty)
                div.innerHTML = clean
            }
            chat.appendChild(div)
        })

        scrollToBottom()
    } catch {
        console.error("Failed to load previous messages.")
    }
}

loadMsgs()