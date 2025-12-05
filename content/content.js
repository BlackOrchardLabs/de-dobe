// De:dobe v3.0.0 - Content script with router integration
// Cross-browser compatibility
const browser = globalThis.browser || globalThis.chrome;

// Platform detection function
function detectPlatform(url) {
  const host = url || window.location.href;
  if (host.includes('gemini.google.com')) return 'gemini';
  if (host.includes('chat.openai.com') || host.includes('chatgpt.com')) return 'chatgpt';
  if (host.includes('claude.ai')) return 'claude';
  if (host.includes('grok.com') || host.includes('x.com/i/grok') || host.includes('grok.x.ai') || host.includes('chat.x.ai')) return 'grok';
  return 'generic';
}

// Route to appropriate extractor
async function route(platform) {
  // Return the appropriate extractor function from global namespace
  if (window.DeDobeExtractors && window.DeDobeExtractors[platform]) {
    return await window.DeDobeExtractors[platform]();
  }

  // Fallback to generic
  if (window.DeDobeExtractors && window.DeDobeExtractors.generic) {
    return await window.DeDobeExtractors.generic();
  }

  // No extractors available
  return { platform, messages: [], meta: {} };
}

// Simple memory chunking (in-memory for v3.0.0)
const memoryChunks = new Map();

async function chunkMessage(text, role, timestamp = Date.now()) {
  const key = await sha256(text + timestamp);
  const sentiment = simpleSentiment(text);
  const chunk = {
    text,
    role,
    sentiment,
    heat: 50,
    tier: 'temper',
    created_at: timestamp
  };
  memoryChunks.set(key, chunk);
  return chunk;
}

function simpleSentiment(text) {
  const positive = /\b(love|happy|great|thanks|thank you|wonderful|amazing|awesome|excellent|good|nice|appreciate)\b/i;
  const negative = /\b(hate|sad|angry|frustrated|terrible|awful|bad|wrong|sorry|unfortunately|problem|issue)\b/i;

  const posMatches = (text.match(positive) || []).length;
  const negMatches = (text.match(negative) || []).length;

  if (posMatches > negMatches) return 1;
  if (negMatches > posMatches) return -1;
  return 0;
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

(async () => {
  const host = window.location.hostname;
  const detectedPlatform = detectPlatform(window.location.href);

  console.log('[De:dobe v3.0.0] Script loaded on:', host);
  console.log('[De:dobe v3.0.0] Detected platform:', detectedPlatform);
  console.log('[De:dobe v3.0.0] DeDobeExtractors available:', !!window.DeDobeExtractors);
  if (window.DeDobeExtractors) {
    console.log('[De:dobe v3.0.0] Available extractors:', Object.keys(window.DeDobeExtractors));
  }

  async function handleExport() {
    const platform = detectPlatform(window.location.href);
    console.log('[De:dobe v3.0.0] Export requested for platform:', platform);

    const data = await route(platform);
    console.log('[De:dobe v3.0.0] Extractor returned:', data.messages?.length || 0, 'messages');

    // Chunk each message for memory
    for (const msg of data.messages || []) {
      await chunkMessage(msg.content || msg.text || '', msg.role);
    }

    // Build export blob with chunks
    const exportData = {
      platform,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      messages: data.messages || [],
      meta: data.meta || {},
      chunks: Array.from(memoryChunks.values())
    };

    console.log('[De:dobe v3.0.0] Sending to background with', exportData.chunks.length, 'chunks');
    browser.runtime.sendMessage({
      type: "ORCHARD_LOOM_CONVO",
      payload: exportData
    });

    return exportData;
  }

  async function getData() {
    const platform = detectPlatform(window.location.href);
    return await route(platform);
  }

  browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('[De:dobe v3.0.0] Message received:', msg.type);

    if (msg.type === "ORCHARD_LOOM_REQUEST_EXTRACT") {
      console.log('[De:dobe v3.0.0] Starting extraction...');
      handleExport().then(() => {
        sendResponse({ ok: true });
      }).catch(err => {
        console.error('[De:dobe v3.0.0] Export error:', err);
        sendResponse({ error: err.message });
      });
      return true; // Chrome async response
    }

    if (msg.action === 'extract') {
      handleExport().then(sendResponse).catch(err => {
        sendResponse({ error: err.message });
      });
      return true;
    }

    if (msg.action === 'getData') {
      getData().then(sendResponse).catch(err => {
        sendResponse({ error: err.message });
      });
      return true;
    }
  });

  console.log('[De:dobe v3.0.0] Content script initialized and ready');
})();
