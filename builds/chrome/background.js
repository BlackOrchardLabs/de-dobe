// Runtime detection
const isChrome = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest;
const api = isChrome ? chrome : browser;

// Chrome service worker lifecycle (Chrome only)
if (isChrome) {
  self.addEventListener('install', () => self.skipWaiting());

  let storageReady = false;
  self.addEventListener('activate', async () => {
    await self.clients.claim();
    storageReady = true;
  });
}

let latestConversation = null;

api.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "ORCHARD_LOOM_CONVO") {
    latestConversation = msg.payload;
  }
  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_EXTRACT") {
    api.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      api.tabs.sendMessage(tabs[0].id, { type: "ORCHARD_LOOM_REQUEST_EXTRACT" });
    });
  }
  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_DATA") {
    if (isChrome) {
      sendResponse(latestConversation);
      return true; // Required for Chrome async response
    } else {
      return Promise.resolve(latestConversation);
    }
  }
});
