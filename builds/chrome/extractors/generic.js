// Generic fallback extractor for unknown platforms
window.DeDobeExtractors = window.DeDobeExtractors || {};

window.DeDobeExtractors.generic = async function() {
  const messages = [];
  const meta = {
    platform: 'generic',
    url: window.location.href,
    timestamp: new Date().toISOString(),
    title: document.title
  };

  try {
    // Try common message selectors
    const selectors = [
      '[role="article"]',
      '[class*="message"]',
      '[class*="chat"]',
      '[data-message]',
      'main [class*="content"]'
    ];

    let foundElements = [];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        foundElements = Array.from(elements);
        break;
      }
    }

    // Extract text content
    foundElements.forEach((elem, index) => {
      const content = (elem.innerText || elem.textContent || '').trim();
      if (content.length > 0) {
        // Alternate between user and assistant
        const role = index % 2 === 0 ? 'user' : 'assistant';
        messages.push({ role, content });
      }
    });

    // Ultimate fallback: grab all visible text from main content area
    if (messages.length === 0) {
      const mainContent = document.querySelector('main') || document.body;
      const allText = (mainContent.innerText || mainContent.textContent || '').trim();

      if (allText.length > 0) {
        messages.push({ role: 'unknown', content: allText });
      }
    }

  } catch (error) {
    console.error('Generic extraction error:', error);
  }

  return { platform: 'generic', messages, meta };
};
