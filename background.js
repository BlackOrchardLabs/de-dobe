// Cross-browser compatibility
const browser = globalThis.browser || globalThis.chrome;

let latestConversation = null;

browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "ORCHARD_LOOM_CONVO") {
    latestConversation = msg.payload;
  }
  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_EXTRACT") {
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      browser.tabs.sendMessage(tabs[0].id, { type: "ORCHARD_LOOM_REQUEST_EXTRACT" });
    });
  }
  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_DATA") {
    return Promise.resolve(latestConversation);
  }
});
