// Background script - handles browser action click
browser.browserAction.onClicked.addListener((tab) => {
  // Send message to content script to extract conversation
  browser.tabs.sendMessage(tab.id, { action: "export" });
});
