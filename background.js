// Cross-browser compatibility
const browser = globalThis.browser || globalThis.chrome;

console.log('[De:dobe Background] Background script loaded');

let latestConversation = null;

browser.runtime.onMessage.addListener((msg, sender) => {
  console.log('[De:dobe Background] Message received:', msg.type, 'from:', sender.tab ? `tab ${sender.tab.id}` : 'popup');

  if (msg.type === "ORCHARD_LOOM_CONVO") {
    latestConversation = msg.payload;
    console.log('[De:dobe Background] Stored conversation data:', {
      platform: latestConversation?.platform,
      messageCount: latestConversation?.messages?.length || 0
    });
  }

  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_EXTRACT") {
    console.log('[De:dobe Background] Popup requesting extraction');
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      console.log('[De:dobe Background] Sending extract request to tab:', tabs[0]?.id);
      if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { type: "ORCHARD_LOOM_REQUEST_EXTRACT" })
          .catch(err => console.error('[De:dobe Background] Error sending message to tab:', err));
      }
    });
  }

  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_DATA") {
    console.log('[De:dobe Background] Popup requesting data, returning:', latestConversation ? 'data' : 'null');
    return Promise.resolve(latestConversation);
  }
});
