(async () => {
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

    browser.runtime.sendMessage({
      type: "ORCHARD_LOOM_CONVO",
      payload: data
    });
  }

  browser.runtime.onMessage.addListener((msg) => {
    if (msg.type === "ORCHARD_LOOM_REQUEST_EXTRACT") extractConversation();
  });
})();
