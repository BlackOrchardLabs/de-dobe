// De:dobe v3.0.0 Background Script
// Cross-browser compatibility
const browser = globalThis.browser || globalThis.chrome;

// Import decay engine for persistence
import { DecayV3 } from './plugins/decay-v3.js';

console.log('[De:dobe v3.0.0 Background] Service worker loaded');

let latestConversation = null;

// Initialize decay engine and run nightly decay once per session
const decay = new DecayV3({ tier: 'temper', startHeat: 50, cooling: 5 });

// Run decay on initialization (once per browser session)
(async () => {
  try {
    await decay.nightlyDecay();
    const stats = await decay.getStats();
    console.log('[De:dobe v3.0.0 Background] Nightly decay complete:', stats);
  } catch (error) {
    console.error('[De:dobe v3.0.0 Background] Decay error:', error);
  }
})();

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('[De:dobe Background] Message received:', msg.type, 'from:', sender.tab ? `tab ${sender.tab.id}` : 'popup');

  if (msg.type === "ORCHARD_LOOM_CONVO") {
    latestConversation = msg.payload;
    console.log('[De:dobe Background] Stored conversation data:', {
      platform: latestConversation?.platform,
      messageCount: latestConversation?.messages?.length || 0
    });
    return false; // Synchronous response, no need to keep channel open
  }

  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_EXTRACT") {
    console.log('[De:dobe Background] Popup requesting extraction');

    // Handle async operation and send response when done
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        console.log('[De:dobe Background] Sending extract request to tab:', tabs[0]?.id);
        if (tabs[0]) {
          return browser.tabs.sendMessage(tabs[0].id, { type: "ORCHARD_LOOM_REQUEST_EXTRACT" });
        }
      })
      .then(() => {
        console.log('[De:dobe Background] Extract request sent successfully');
        sendResponse({ success: true });
      })
      .catch(err => {
        console.error('[De:dobe Background] Error sending message to tab:', err);
        sendResponse({ success: false, error: err.message });
      });

    return true; // Keep message channel open for async response
  }

  if (msg.type === "ORCHARD_LOOM_POPUP_REQUEST_DATA") {
    console.log('[De:dobe Background] Popup requesting data, returning:', latestConversation ? 'data' : 'null');
    sendResponse(latestConversation);
    return false; // Synchronous response
  }
});

// NO telemetry in v3.0.0 - bone 2 removed for clean Chrome review
