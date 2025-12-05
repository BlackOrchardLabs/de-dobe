// chrome-bones.js - Chrome compatibility wrapper (Bones 1 + 3 only)
// NO TELEMETRY - Bone 2 removed for clean Chrome review

// Bone 1: Chrome message resolution with proper promise handling
export function wrapChrome(extractorFn) {
  return async (input) => {
    try {
      const result = await chromePromise(extractorFn, input);
      return result;
    } catch (error) {
      console.error('[De:dobe Chrome-Bones] Extraction error:', error);
      return { platform: 'unknown', messages: [], meta: { error: error.message } };
    }
  };
}

async function chromePromise(fn, input) {
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    // Not in Chrome context, execute directly
    return await fn(input);
  }

  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) {
        // No active tab - execute directly instead
        fn(input).then(resolve).catch(reject);
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, { action: 'extract', input }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  });
}

// Bone 3: Anti-loop fallback guard
export function antiLoopGuard() {
  // Prevent infinite loops if selectors fail - 5 second fallback check
  setInterval(() => {
    const tagged = document.querySelectorAll('[data-dedobe-id]');
    if (tagged.length === 0) {
      // Re-tag any untagged message elements with stable IDs
      const messageSelectors = [
        '.message',
        '.conversation-turn',
        'user-query',
        'model-response',
        '[class*="message"]',
        '[class*="turn"]'
      ];

      messageSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(n => {
          if (!n.dataset.dedobeId) {
            n.dataset.dedobeId = crypto.randomUUID();
          }
        });
      });
    }
  }, 5000);
}

// Initialize anti-loop guard when module loads
if (typeof document !== 'undefined') {
  antiLoopGuard();
}
