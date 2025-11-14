// Content script - runs on grok.com pages
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "export") {
    exportConversation();
  }
});

function exportConversation() {
  try {
    // Find the main conversation container
    // Grok's structure: look for message divs
    const container = document.querySelector('main') || document.body;
    
    // Get all text content from the conversation
    // This is a broad approach that captures everything
    const messages = [];
    
    // Try multiple selectors to catch different message formats
    const selectors = [
      '[role="article"]',
      '[class*="message"]',
      '[class*="Message"]',
      '[data-testid*="message"]',
      'div[class*="flex"][class*="gap"]' // Common Grok message pattern
    ];
    
    let foundMessages = [];
    
    for (const selector of selectors) {
      const elements = container.querySelectorAll(selector);
      if (elements.length > 0) {
        foundMessages = Array.from(elements);
        break;
      }
    }
    
    // If no messages found with selectors, fall back to getting all text
    if (foundMessages.length === 0) {
      const allText = container.innerText || container.textContent;
      downloadMarkdown(allText, 'grok_conversation_fallback.md');
      return;
    }
    
    // Build markdown output
    let output = '# Grok Conversation Export\n\n';
    output += `**Exported:** ${new Date().toLocaleString()}\n\n`;
    output += `**URL:** ${window.location.href}\n\n`;
    output += '---\n\n';
    
    foundMessages.forEach((msg, index) => {
      const text = msg.innerText || msg.textContent;
      if (text && text.trim().length > 0) {
        // Clean up the text
        const cleaned = text.trim();
        output += cleaned + '\n\n';
        
        // Add separator between messages
        if (index < foundMessages.length - 1) {
          output += '---\n\n';
        }
      }
    });
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `grok_conversation_${timestamp}.md`;
    
    downloadMarkdown(output, filename);
    
    // Show success notification
    showNotification(`Exported ${foundMessages.length} messages to ${filename}`);
    
  } catch (error) {
    console.error('Export failed:', error);
    showNotification('Export failed. Check console for details.', true);
  }
}

function downloadMarkdown(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isError ? '#ef4444' : '#10b981'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transition = 'opacity 0.3s';
    notification.style.opacity = '0';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

console.log('De:dobe Exporter loaded');
