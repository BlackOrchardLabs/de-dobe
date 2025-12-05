// platform-router.js - v3.0.0 platform detection and routing
// Cross-browser compatibility
const browser = globalThis.browser || globalThis.chrome;

export function detectPlatform(url) {
  const host = url || window.location.href;
  if (host.includes('gemini.google.com')) return 'gemini';
  if (host.includes('chat.openai.com') || host.includes('chatgpt.com')) return 'chatgpt';
  if (host.includes('claude.ai')) return 'claude';
  if (host.includes('grok.com') || host.includes('x.com/i/grok') || host.includes('grok.x.ai') || host.includes('chat.x.ai')) return 'grok';
  return 'generic';
}

export async function route(platform) {
  const extractor = getExtractor(platform);

  // Check if Chrome needs wrapping (v3.0.0: simplified - extractors handle their own chrome compat)
  if (extractor && typeof extractor === 'function') {
    return await extractor();
  }

  // Fallback: return empty structure
  return { platform, messages: [], meta: {} };
}

function getExtractor(platform) {
  // Return the appropriate extractor function from global namespace
  // These are registered by individual extractor modules
  if (window.DeDobeExtractors && window.DeDobeExtractors[platform]) {
    return window.DeDobeExtractors[platform];
  }

  // Fallback to generic
  if (window.DeDobeExtractors && window.DeDobeExtractors.generic) {
    return window.DeDobeExtractors.generic;
  }

  return null;
}
