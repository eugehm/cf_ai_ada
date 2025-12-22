/*
 * load.js
 *
 * Load previous messages if any.
 */

const chat = document.getElementById("chat")

// get or create session ID
let session = sessionStorage.getItem("session")
if (!session) {
    session = Math.random().toString(36).substring(2)
    sessionStorage.setItem("session", session)
}

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
            div.textContent = msg.content
            chat.appendChild(div)
        })

        scrollToBottom()
    } catch {
        console.error("Failed to load previous messages.")
    }
}

loadMsgs()