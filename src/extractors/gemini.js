// Gemini conversation extractor
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
    // Gemini uses message-content class structure
    const userMessages = document.querySelectorAll('[data-test-id="user-message"], .user-message');
    const modelMessages = document.querySelectorAll('[data-test-id="model-message"], .model-message');

    // Combine and sort by DOM order
    const allMessages = [...userMessages, ...modelMessages].sort((a, b) => {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    allMessages.forEach(elem => {
      const isUser = elem.matches('[data-test-id="user-message"], .user-message');
      const role = isUser ? 'user' : 'assistant';
      const content = (elem.innerText || elem.textContent || '').trim();

      if (content.length > 0) {
        messages.push({ role, content });
      }
    });

    // Fallback: generic extraction
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
    console.error('Gemini extraction error:', error);
  }

  return { platform: 'gemini', messages, meta };
};
