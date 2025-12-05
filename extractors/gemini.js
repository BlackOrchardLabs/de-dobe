// Gemini conversation extractor - v3.0.0
// Updated for Google's new Angular DOM structure (December 2025)
window.DeDobeExtractors = window.DeDobeExtractors || {};

window.DeDobeExtractors.gemini = async function() {
  const messages = [];
  const meta = {
    platform: 'gemini',
    url: window.location.href,
    timestamp: new Date().toISOString(),
    title: document.title
  };

  try {
    // Google rebuilt Gemini with Angular custom elements
    // Primary selectors: Angular custom elements
    const angularMessages = document.querySelectorAll('user-query, model-response');

    if (angularMessages.length > 0) {
      angularMessages.forEach(elem => {
        const role = elem.tagName.toLowerCase() === 'user-query' ? 'user' : 'assistant';
        const content = (elem.innerText || elem.textContent || '').trim();

        if (content.length > 0) {
          messages.push({ role, content });
        }
      });
    }

    // Fallback 1: Content-based selectors
    if (messages.length === 0) {
      const fallbackMessages = document.querySelectorAll('user-query-content, .query-text-line, .model-response-text');
      fallbackMessages.forEach((elem, index) => {
        const content = (elem.innerText || elem.textContent || '').trim();
        if (content.length > 0) {
          // Try to determine role from parent structure
          const parent = elem.closest('user-query, model-response');
          const role = parent
            ? (parent.tagName.toLowerCase() === 'user-query' ? 'user' : 'assistant')
            : (index % 2 === 0 ? 'user' : 'assistant');
          messages.push({ role, content });
        }
      });
    }

    // Fallback 2: Generic extraction (old structure compatibility)
    if (messages.length === 0) {
      const genericMessages = document.querySelectorAll('[class*="message-content"], [class*="conversation"] > div');
      genericMessages.forEach((msg, index) => {
        const content = (msg.innerText || msg.textContent || '').trim();
        if (content.length > 0) {
          const role = index % 2 === 0 ? 'user' : 'assistant';
          messages.push({ role, content });
        }
      });
    }

  } catch (error) {
    console.error('[De:dobe Gemini] Extraction error:', error);
  }

  return { platform: 'gemini', messages, meta };
};
