// Claude conversation extractor - v3.0.0
// Updated for current Claude DOM structure (December 2025)
window.DeDobeExtractors = window.DeDobeExtractors || {};

window.DeDobeExtractors.claude = async function() {
  const messages = [];
  const meta = {
    platform: 'claude',
    url: window.location.href,
    timestamp: new Date().toISOString(),
    title: document.title
  };

  try {
    // Primary selectors: Current Claude DOM structure
    const userMessages = document.querySelectorAll('[data-testid="user-message"]');
    const assistantMessages = document.querySelectorAll('.standard-markdown');

    // Process user messages
    userMessages.forEach(elem => {
      const content = (elem.innerText || elem.textContent || '').trim();
      if (content.length > 0) {
        messages.push({ role: 'user', content });
      }
    });

    // Process assistant messages
    assistantMessages.forEach(elem => {
      const content = (elem.innerText || elem.textContent || '').trim();
      if (content.length > 0) {
        messages.push({ role: 'assistant', content });
      }
    });

    // Alternative: Try .font-claude-response-body if standard-markdown fails
    if (messages.filter(m => m.role === 'assistant').length === 0) {
      const altAssistant = document.querySelectorAll('.font-claude-response-body');
      altAssistant.forEach(elem => {
        const content = (elem.innerText || elem.textContent || '').trim();
        if (content.length > 0) {
          messages.push({ role: 'assistant', content });
        }
      });
    }

    // Fallback 1: Legacy selectors
    if (messages.length === 0) {
      const legacyMessages = document.querySelectorAll('[class*="font-user"], [class*="font-claude"]');
      legacyMessages.forEach(elem => {
        const isUser = elem.className.includes('user');
        const role = isUser ? 'user' : 'assistant';
        const content = (elem.innerText || elem.textContent || '').trim();
        if (content.length > 0) {
          messages.push({ role, content });
        }
      });
    }

    // Fallback 2: Generic message extraction
    if (messages.length === 0) {
      const genericMessages = document.querySelectorAll('main [class*="message"]');
      genericMessages.forEach((msg, index) => {
        const content = (msg.innerText || msg.textContent || '').trim();
        if (content.length > 0) {
          const role = index % 2 === 0 ? 'user' : 'assistant';
          messages.push({ role, content });
        }
      });
    }

  } catch (error) {
    console.error('[De:dobe Claude] Extraction error:', error);
  }

  return { platform: 'claude', messages, meta };
};
