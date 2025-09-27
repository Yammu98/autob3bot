document.getElementById('sendBtn').addEventListener('click', function() {
    const messages = document.getElementById('messageText').value.trim().split("\n").filter(msg => msg.trim() !== "");
    const speed = parseInt(document.getElementById('speed').value, 10) * 1000;
    const haterName = document.getElementById('HatersName').value.trim();

    // Send via background script
    chrome.runtime.sendMessage({
        startSending: true,
        messages: messages,
        speed: speed,
        haterName: haterName
    });
});

document.getElementById('stopBtn').addEventListener('click', function() {
    chrome.runtime.sendMessage({ stopSending: true });
});
