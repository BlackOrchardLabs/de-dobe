// Grok conversation extractor
window.DeDobeExtractors = window.DeDobeExtractors || {};

console.log('[De:dobe Grok] Extractor loaded');

window.DeDobeExtractors.grok = async function() {
  console.log('[De:dobe Grok] Extractor function called');

  const messages = [];
  const meta = {
    platform: 'grok',
    url: window.location.href,
    timestamp: new Date().toISOString(),
    title: document.title
  };

  console.log('[De:dobe Grok] Meta:', meta);

  try {
    const container = document.querySelector('main') || document.body;
    console.log('[De:dobe Grok] Container found:', container ? container.tagName : 'none');

    // Try multiple selectors to catch different message formats
    const selectors = [
      '[role="article"]',
      '[class*="message"]',
      '[class*="Message"]',
      '[data-testid*="message"]',
      'div[class*="flex"][class*="gap"]'
    ];

    let foundMessages = [];
    let usedSelector = null;

    for (const selector of selectors) {
      const elements = container.querySelectorAll(selector);
      console.log(`[De:dobe Grok] Selector "${selector}" found ${elements.length} elements`);
      if (elements.length > 0) {
        foundMessages = Array.from(elements);
        usedSelector = selector;
        console.log('[De:dobe Grok] Using selector:', selector);
        break;
      }
    }

    console.log('[De:dobe Grok] Total elements found:', foundMessages.length);

    // Extract messages with role detection
    foundMessages.forEach((msg, index) => {
      const text = (msg.innerText || msg.textContent || '').trim();
      console.log(`[De:dobe Grok] Element ${index} text length:`, text.length);
      if (text.length > 0) {
        // Try to detect role based on context or position
        const role = index % 2 === 0 ? 'user' : 'assistant';
        messages.push({ role, content: text });
        console.log(`[De:dobe Grok] Added message ${index} as ${role}, preview:`, text.substring(0, 100));
      }
    });

    // Fallback: if no messages found, grab all text
    if (messages.length === 0) {
      console.log('[De:dobe Grok] No messages found, using fallback');
      const allText = container.innerText || container.textContent;
      console.log('[De:dobe Grok] Fallback text length:', allText?.length || 0);
      if (allText && allText.trim().length > 0) {
        messages.push({ role: 'unknown', content: allText.trim() });
        console.log('[De:dobe Grok] Added fallback message');
      }
    }

  } catch (error) {
    console.error('[De:dobe Grok] Extraction error:', error);
  }

  console.log('[De:dobe Grok] Final extraction result:', { platform: 'grok', messageCount: messages.length });
  return { platform: 'grok', messages, meta };
};
