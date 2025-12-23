/*
 * script.js
 *
 * Stream AI response to browser.
 */

const input = document.getElementById("user-input")
const button = document.getElementById("ask-button")

// handle sending response
let isFetching = false
function sendResp() {
    // let query finish running before running a new one
    if (isFetching) return
    isFetching = true

    // get user's question
    const question = input.value.trim()
    if (!question) {
        isFetching = false
        return
    }

    // add user message to conversation
    const userMsg = document.createElement("div")
    userMsg.className = "message user-message"
    userMsg.textContent = question
    chat.appendChild(userMsg)
    scrollToBottom()

    // clear input
    input.value = ""

    // add AI message placeholder
    const aiMsg = document.createElement("div")
    aiMsg.className = "message ai-message"
    chat.appendChild(aiMsg)
    scrollToBottom()

    // stream AI response
    const url = `/stream?query=${encodeURIComponent(question)}&session=${session}`
    const source = new EventSource(url)
    let buf = ""
    source.onmessage = (event) => {
        // stop if done streaming
        if (event.data === "[DONE]") {
            source.close()
            isFetching = false
            scrollToBottom()
            return
        }

        // print markdown response to browser as it's streamed
        try {
            const data = JSON.parse(event.data)
            if (typeof data.response == "string") {
                buf += data.response
                const dirty = marked.parse(buf)
                const clean = DOMPurify.sanitize(dirty)
                aiMsg.innerHTML = clean
                scrollToBottom()
            }
        } catch {
            console.error("Invalid data.", event.data)
        }
    }
}

// event listener for ask button
button.addEventListener("click", sendResp)
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        sendResp()
    }
})