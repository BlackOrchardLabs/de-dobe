// Grok conversation extractor
window.DeDobeExtractors = window.DeDobeExtractors || {};

window.DeDobeExtractors.grok = async function() {
  const messages = [];
  const meta = {
    platform: 'grok',
    url: window.location.href,
    timestamp: new Date().toISOString(),
    title: document.title
  };

  try {
    const container = document.querySelector('main') || document.body;

    // Try multiple selectors to catch different message formats
    const selectors = [
      '[role="article"]',
      '[class*="message"]',
      '[class*="Message"]',
      '[data-testid*="message"]',
      'div[class*="flex"][class*="gap"]'
    ];

    let foundMessages = [];

    for (const selector of selectors) {
      const elements = container.querySelectorAll(selector);
      if (elements.length > 0) {
        foundMessages = Array.from(elements);
        break;
      }
    }

    // Extract messages with role detection
    foundMessages.forEach((msg, index) => {
      const text = (msg.innerText || msg.textContent || '').trim();
      if (text.length > 0) {
        // Try to detect role based on context or position
        const role = index % 2 === 0 ? 'user' : 'assistant';
        messages.push({ role, content: text });
      }
    });

    // Fallback: if no messages found, grab all text
    if (messages.length === 0) {
      const allText = container.innerText || container.textContent;
      if (allText && allText.trim().length > 0) {
        messages.push({ role: 'unknown', content: allText.trim() });
      }
    }

  } catch (error) {
    console.error('Grok extraction error:', error);
  }

  return { platform: 'grok', messages, meta };
};
