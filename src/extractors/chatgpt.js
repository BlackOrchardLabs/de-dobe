// ChatGPT conversation extractor
window.DeDobeExtractors = window.DeDobeExtractors || {};

window.DeDobeExtractors.chatgpt = async function() {
  const messages = [];
  const meta = {
    platform: 'chatgpt',
    url: window.location.href,
    timestamp: new Date().toISOString(),
    title: document.title
  };

  try {
    // ChatGPT uses data-message-author-role attribute
    const messageElements = document.querySelectorAll('[data-message-author-role]');

    messageElements.forEach(elem => {
      const role = elem.getAttribute('data-message-author-role');
      const contentDiv = elem.querySelector('[class*="markdown"], [class*="prose"]') || elem;
      const content = (contentDiv.innerText || contentDiv.textContent || '').trim();

      if (content.length > 0) {
        messages.push({ role, content });
      }
    });

    // Fallback: try alternative selectors
    if (messages.length === 0) {
      const alternativeMessages = document.querySelectorAll('.text-message, [class*="conversation"] > div');
      alternativeMessages.forEach((msg, index) => {
        const content = (msg.innerText || msg.textContent || '').trim();
        if (content.length > 0) {
          const role = index % 2 === 0 ? 'user' : 'assistant';
          messages.push({ role, content });
        }
      });
    }

  } catch (error) {
    console.error('ChatGPT extraction error:', error);
  }

  return { platform: 'chatgpt', messages, meta };
};
