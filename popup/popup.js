// Cross-browser compatibility
const browser = globalThis.browser || globalThis.chrome;

console.log('[De:dobe Popup] Popup script loaded');

let currentConversation = null;

async function refresh() {
  console.log('[De:dobe Popup] Refresh called');
  document.getElementById("status").textContent = "Capturing...";

  try {
    console.log('[De:dobe Popup] Sending extract request');
    await browser.runtime.sendMessage({ type: "ORCHARD_LOOM_POPUP_REQUEST_EXTRACT" });

    // Add small delay to allow extraction to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('[De:dobe Popup] Requesting data');
    const data = await browser.runtime.sendMessage({ type: "ORCHARD_LOOM_POPUP_REQUEST_DATA" });
    console.log('[De:dobe Popup] Received data:', data);

    if (data && data.messages?.length) {
      currentConversation = data;
      console.log('[De:dobe Popup] Conversation set:', {
        platform: data.platform,
        messageCount: data.messages.length
      });
      document.getElementById("status").textContent =
        `Captured ${data.messages.length} messages from ${data.platform}`;
    } else {
      console.log('[De:dobe Popup] No messages found in data');
      document.getElementById("status").textContent = "No thread detected.";
    }
  } catch (error) {
    console.error('[De:dobe Popup] Error during refresh:', error);
    document.getElementById("status").textContent = "Error: " + error.message;
  }
}

function download(name, content, mime) {
  console.log('[De:dobe Popup] Starting download:', { name, mime, contentLength: content.length });
  try {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    console.log('[De:dobe Popup] Blob URL created:', url);

    // Create a hidden download link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.style.display = 'none';

    document.body.appendChild(a);
    console.log('[De:dobe Popup] Download link created, triggering click');
    a.click();

    // Cleanup after a delay
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('[De:dobe Popup] Download cleanup complete');
    }, 1000);

  } catch (error) {
    console.error('[De:dobe Popup] Error creating download:', error);
    alert('Error creating download: ' + error.message);
  }
}

function generateAEONStub(conversation) {
  const chunks = conversation.chunks || [];
  const messages = conversation.messages || [];

  // Calculate average heat
  const avgHeat = chunks.length > 0
    ? chunks.reduce((sum, c) => sum + (c.heat || 0), 0) / chunks.length
    : 0;

  // Count sentiment distribution
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  const sentimentTrend = [];

  chunks.forEach(c => {
    sentimentTrend.push(c.sentiment || 0);
    if (c.sentiment === 1) sentimentCounts.positive++;
    else if (c.sentiment === -1) sentimentCounts.negative++;
    else sentimentCounts.neutral++;
  });

  // Get opening and closing sentiment from messages
  const openingSentiment = chunks.length > 0 ? chunks[0].sentiment || 0 : 0;
  const closingSentiment = chunks.length > 0 ? chunks[chunks.length - 1].sentiment || 0 : 0;

  return {
    aeon_stub: {
      version: "0.1.0",
      heat_signature: {
        avg_chunk_heat: Math.round(avgHeat * 100) / 100,
        sentiment_distribution: sentimentCounts,
        sentiment_trend: sentimentTrend
      },
      emotional_arc: {
        opening_sentiment: openingSentiment,
        closing_sentiment: closingSentiment,
        message_count: messages.length,
        chunk_count: chunks.length
      },
      ready_for_eta_extraction: true,
      eta_schema_version: "1.0"
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  console.log('[De:dobe Popup] DOM loaded, starting refresh');
  refresh();

  document.getElementById("export-md").onclick = () => {
    console.log('[De:dobe Popup] Export MD clicked');
    if (!currentConversation) {
      console.log('[De:dobe Popup] No conversation to export');
      return;
    }

    const includeAEON = document.getElementById("include-aeon").checked;

    // Format as proper markdown
    let markdown = `# ${currentConversation.platform.toUpperCase()} Conversation Export\n\n`;
    markdown += `**Exported:** ${currentConversation.meta?.timestamp || new Date().toISOString()}\n\n`;
    if (currentConversation.meta?.url) {
      markdown += `**URL:** ${currentConversation.meta.url}\n\n`;
    }

    // Add AEON stub if enabled
    if (includeAEON && currentConversation.chunks) {
      const aeonStub = generateAEONStub(currentConversation);
      markdown += '## AEON Stub\n\n';
      markdown += '```json\n';
      markdown += JSON.stringify(aeonStub, null, 2);
      markdown += '\n```\n\n';
    }

    markdown += '---\n\n';

    currentConversation.messages.forEach((msg, index) => {
      const role = msg.role.charAt(0).toUpperCase() + msg.role.slice(1);
      markdown += `### ${role}\n\n`;
      markdown += `${msg.content}\n\n`;
      if (index < currentConversation.messages.length - 1) {
        markdown += '---\n\n';
      }
    });

    download("conversation.md", markdown, "text/markdown");
  };

  document.getElementById("export-json").onclick = () => {
    console.log('[De:dobe Popup] Export JSON clicked');
    if (!currentConversation) {
      console.log('[De:dobe Popup] No conversation to export');
      return;
    }

    const includeAEON = document.getElementById("include-aeon").checked;
    let exportData = { ...currentConversation };

    // Add AEON stub if enabled
    if (includeAEON && currentConversation.chunks) {
      const aeonStub = generateAEONStub(currentConversation);
      exportData = { ...exportData, ...aeonStub };
    }

    download("conversation.json", JSON.stringify(exportData, null, 2), "application/json");
  };

  document.getElementById("export-txt").onclick = () => {
    console.log('[De:dobe Popup] Export TXT clicked');
    if (!currentConversation) {
      console.log('[De:dobe Popup] No conversation to export');
      return;
    }

    const includeAEON = document.getElementById("include-aeon").checked;
    let txt = '';

    // Add AEON stub if enabled
    if (includeAEON && currentConversation.chunks) {
      const aeonStub = generateAEONStub(currentConversation);
      txt += '=== AEON STUB ===\n\n';
      txt += JSON.stringify(aeonStub, null, 2);
      txt += '\n\n=== CONVERSATION ===\n\n';
    }

    txt += currentConversation.messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    download("conversation.txt", txt, "text/plain");
  };
});
