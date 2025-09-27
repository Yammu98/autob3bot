// Message relay between popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.startSending) {
        // Store settings in storage
        chrome.storage.local.set({
            messages: request.messages,
            speed: request.speed,
            haterName: request.haterName,
            isSending: true
        });
        
        // Send to active tab
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "startSending",
                    messages: request.messages,
                    speed: request.speed,
                    haterName: request.haterName
                });
            }
        });
    }
    
    if (request.stopSending) {
        chrome.storage.local.set({isSending: false});
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "stopSending"
                });
            }
        });
    }
});
