let isSending = false;
let currentIndex = 0;
let messages = [];
let speed = 0;
let haterName = "";

// Background message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received:", request);
    
    if (request.action === "startSending") {
        startSending(request.messages, request.speed, request.haterName);
    }
    
    if (request.action === "stopSending") {
        stopSending();
    }
});

// Check if we need to resume sending when page becomes visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && isSending) {
        // Page is visible again, resume sending
        sendNextMessage();
    }
});

function startSending(messageList, delay, name) {
    messages = messageList;
    speed = delay;
    haterName = name;
    currentIndex = 0;
    isSending = true;
    
    sendNextMessage();
}

function stopSending() {
    isSending = false;
    console.log("Message sending stopped");
}

function sendNextMessage() {
    if (!isSending || messages.length === 0) return;
    
    // Check if page is visible
    if (document.hidden) {
        // If page is hidden, try again after a shorter delay
        setTimeout(sendNextMessage, 1000);
        return;
    }
    
    const messageWithHaterName = `${haterName}: ${messages[currentIndex]}`;
    console.log("Sending message:", messageWithHaterName);

    const inputBox = document.querySelector('[contenteditable="true"]');
    if (inputBox) {
        inputBox.focus();
        inputBox.innerHTML = messageWithHaterName;
        
        // Trigger input event
        const inputEvent = new Event('input', { bubbles: true });
        inputBox.dispatchEvent(inputEvent);
        
        // Send message
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
        });
        inputBox.dispatchEvent(event);

        console.log("Message sent successfully:", messageWithHaterName);

        currentIndex++;
        if (currentIndex >= messages.length) {
            currentIndex = 0;
        }
        
        // Continue sending
        if (isSending) {
            setTimeout(sendNextMessage, speed);
        }
    } else {
        console.log("Input box not found. Retrying...");
        setTimeout(sendNextMessage, 1000);
    }
}

// Recovery mechanism - check every 10 seconds if sending should continue
setInterval(() => {
    if (isSending && document.hidden) {
        console.log("Background check - still sending messages");
    }
}, 10000);
