// Popup script for De:dobe
document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('exportBtn');

  exportBtn.addEventListener('click', () => {
    // Get the active tab and send export message
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      browser.tabs.sendMessage(tabs[0].id, { action: 'export' });
      window.close(); // Close popup after triggering export
    });
  });
});
