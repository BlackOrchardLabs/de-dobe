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
  // Handle incoming conversation data
  if (msg.type === "ORCHARD_LOOM_CONVO") {
    latestConversation = msg.payload;
    return false; // Synchronous, no response needed
  }

  // Handle extract request from popup
  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_EXTRACT") {
    if (isChrome) {
      // Chrome: wrap async in IIFE and resolve promise
      (async () => {
        try {
          const tabs = await api.tabs.query({ active: true, currentWindow: true });
          await api.tabs.sendMessage(tabs[0].id, { type: "ORCHARD_LOOM_REQUEST_EXTRACT" });
          sendResponse({ ok: true });
        } catch (e) {
          sendResponse({ error: e.message });
        }
      })();
      return true; // Tell Chrome we'll respond async
    } else {
      // Firefox: Promise-based
      return api.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        return api.tabs.sendMessage(tabs[0].id, { type: "ORCHARD_LOOM_REQUEST_EXTRACT" });
      });
    }
  }

  // Handle data request from popup
  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_DATA") {
    if (isChrome) {
      // Chrome: immediate sendResponse with return true
      sendResponse(latestConversation);
      return true; // Tell Chrome we responded
    } else {
      // Firefox: Promise-based
      return Promise.resolve(latestConversation);
    }
  }

  return false; // No async response for other messages
});
