// Cross-browser compatibility
const browser = globalThis.browser || globalThis.chrome;

(async () => {
  const host = window.location.hostname;

  console.log('[De:dobe Content] Script loaded on:', host);
  console.log('[De:dobe Content] Full URL:', window.location.href);

  function detectPlatform() {
    if (host.includes("chatgpt.com") || host.includes("openai.com")) return "chatgpt";
    if (host.includes("claude.ai")) return "claude";
    if (host.includes("gemini.google.com")) return "gemini";
    if (host.includes("grok.x.ai") || host.includes("chat.x.ai") || host.includes("grok.com") || (host.includes("x.com") && window.location.pathname.includes("grok"))) return "grok";
    return "generic";
  }

  const detectedPlatform = detectPlatform();
  console.log('[De:dobe Content] Detected platform:', detectedPlatform);
  console.log('[De:dobe Content] DeDobeExtractors available:', !!window.DeDobeExtractors);
  if (window.DeDobeExtractors) {
    console.log('[De:dobe Content] Available extractors:', Object.keys(window.DeDobeExtractors));
  }

  async function extractConversation() {
    const platform = detectPlatform();
    console.log('[De:dobe Content] Extract requested for platform:', platform);

    let data = { platform, messages: [], meta: {} };

    try {
      if (window.DeDobeExtractors && window.DeDobeExtractors[platform]) {
        console.log('[De:dobe Content] Calling extractor for:', platform);
        data = await window.DeDobeExtractors[platform]();
        console.log('[De:dobe Content] Extractor returned:', data);
        console.log('[De:dobe Content] Messages found:', data.messages?.length || 0);
      } else if (window.DeDobeExtractors && window.DeDobeExtractors.generic) {
        console.log('[De:dobe Content] Falling back to generic extractor');
        data = await window.DeDobeExtractors.generic();
        console.log('[De:dobe Content] Generic extractor returned:', data);
      } else {
        console.error('[De:dobe Content] No extractors available!');
      }
    } catch (e) {
      console.error('[De:dobe Content] Extractor error:', e);
    }

    console.log('[De:dobe Content] Sending message to background:', data);
    browser.runtime.sendMessage({
      type: "ORCHARD_LOOM_CONVO",
      payload: data
    });
  }

  browser.runtime.onMessage.addListener((msg) => {
    console.log('[De:dobe Content] Message received:', msg);
    if (msg.type === "ORCHARD_LOOM_REQUEST_EXTRACT") {
      console.log('[De:dobe Content] Starting extraction...');
      extractConversation();
    }
  });

  console.log('[De:dobe Content] Content script initialized and ready');
})();
