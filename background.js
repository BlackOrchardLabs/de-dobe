// Cross-browser compatibility
const browser = globalThis.browser || globalThis.chrome;

console.log('[De:dobe Background] Background script loaded');

let latestConversation = null;

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('[De:dobe Background] Message received:', msg.type, 'from:', sender.tab ? `tab ${sender.tab.id}` : 'popup');

  if (msg.type === "ORCHARD_LOOM_CONVO") {
    latestConversation = msg.payload;
    console.log('[De:dobe Background] Stored conversation data:', {
      platform: latestConversation?.platform,
      messageCount: latestConversation?.messages?.length || 0
    });
    return false; // Synchronous response, no need to keep channel open
  }

  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_EXTRACT") {
    console.log('[De:dobe Background] Popup requesting extraction');

    // Handle async operation and send response when done
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        console.log('[De:dobe Background] Sending extract request to tab:', tabs[0]?.id);
        if (tabs[0]) {
          return browser.tabs.sendMessage(tabs[0].id, { type: "ORCHARD_LOOM_REQUEST_EXTRACT" });
        }
      })
      .then(() => {
        console.log('[De:dobe Background] Extract request sent successfully');
        sendResponse({ success: true });
      })
      .catch(err => {
        console.error('[De:dobe Background] Error sending message to tab:', err);
        sendResponse({ success: false, error: err.message });
      });

    return true; // Keep message channel open for async response
  }

  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_DATA") {
    console.log('[De:dobe Background] Popup requesting data, returning:', latestConversation ? 'data' : 'null');
    sendResponse(latestConversation);
    return false; // Synchronous response
  }
});
