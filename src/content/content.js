// Runtime detection
const isChrome = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest;
const api = isChrome ? chrome : browser;

// Chrome-safe DOM readiness
function whenReady() {
  if (!isChrome) return Promise.resolve(); // Firefox path unchanged

  return new Promise(resolve => {
    if (document.body) return resolve();
    const observer = new MutationObserver(() => {
      if (document.body) {
        resolve();
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {childList: true});
  });
}

// Wrap existing initialization
(async () => {
  await whenReady(); // Only waits on Chrome

  const host = window.location.hostname;

  function detectPlatform() {
    if (host.includes("chatgpt.com") || host.includes("openai.com")) return "chatgpt";
    if (host.includes("claude.ai")) return "claude";
    if (host.includes("gemini.google.com")) return "gemini";
    if (host.includes("grok.x.ai") || host.includes("chat.x.ai")) return "grok";
    return "generic";
  }

  async function extractConversation() {
    const platform = detectPlatform();
    let data = { platform, messages: [], meta: {} };

    try {
      if (window.DeDobeExtractors && window.DeDobeExtractors[platform]) {
        data = await window.DeDobeExtractors[platform]();
      } else {
        data = await window.DeDobeExtractors.generic();
      }
    } catch (e) {
      console.error("Extractor error:", e);
    }

    // Send extracted data to background
    if (isChrome) {
      // Chrome: use callback-based sendMessage
      api.runtime.sendMessage({
        type: "ORCHARD_LOOM_CONVO",
        payload: data
      }, (response) => {
        // Response received (if any)
      });
    } else {
      // Firefox: Promise-based
      api.runtime.sendMessage({
        type: "ORCHARD_LOOM_CONVO",
        payload: data
      });
    }

    return data;
  }

  api.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "ORCHARD_LOOM_REQUEST_EXTRACT") {
      if (isChrome) {
        // Chrome: wrap async extraction in IIFE and resolve promise
        (async () => {
          try {
            const data = await extractConversation();
            sendResponse({ ok: true, data: data });
          } catch (e) {
            sendResponse({ error: e.message });
          }
        })();
        return true; // Tell Chrome we'll respond async
      } else {
        // Firefox: Promise-based
        return extractConversation();
      }
    }
    return false; // No async response for other messages
  });
})();
