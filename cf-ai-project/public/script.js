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
    if (isFetching) return
    isFetching = true

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

    source.onmessage = (event) => {
        if (event.data === "[DONE]") {
            source.close()
            isFetching = false
            scrollToBottom()
            return
        }

        try {
            const data = JSON.parse(event.data)
            if (typeof data.response == "string") {
                aiMsg.textContent += data.response
                scrollToBottom()
            }
        } catch {
            console.error("Invalid data.", event.data)
        }
    }
}

// event listener for button
button.addEventListener("click", sendResp)
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        sendResp()
    }
})