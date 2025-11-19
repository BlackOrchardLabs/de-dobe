// Claude conversation extractor
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
    // Claude uses specific message container structure
    const messageContainers = document.querySelectorAll('[class*="font-user"], [class*="font-claude"]');

    messageContainers.forEach(elem => {
      const isUser = elem.className.includes('user');
      const role = isUser ? 'user' : 'assistant';
      const content = (elem.innerText || elem.textContent || '').trim();

      if (content.length > 0) {
        messages.push({ role, content });
      }
    });

    // Alternative approach: look for data attributes or role attributes
    if (messages.length === 0) {
      const alternativeMessages = document.querySelectorAll('[data-is-user-message], [data-is-assistant-message]');
      alternativeMessages.forEach(msg => {
        const isUser = msg.hasAttribute('data-is-user-message');
        const role = isUser ? 'user' : 'assistant';
        const content = (msg.innerText || msg.textContent || '').trim();
        if (content.length > 0) {
          messages.push({ role, content });
        }
      });
    }

    // Fallback: generic message extraction
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
    console.error('Claude extraction error:', error);
  }

  return { platform: 'claude', messages, meta };
};
