/*
 * session.js
 *
 * Handle session ID creation and persistence through cookies.
 */

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
}

function setCookie(name, value, days) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`
}

// get or create session ID with cookies
let session = getCookie("session")
if (!session) {
    session = Math.random().toString(36).substring(2)
    setCookie("session", session, 30)
}