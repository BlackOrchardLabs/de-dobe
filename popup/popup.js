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
  const sentiments = [];

  chunks.forEach(c => {
    const sentiment = c.sentiment || 0;
    sentiments.push(sentiment);
    if (sentiment === 1) sentimentCounts.positive++;
    else if (sentiment === -1) sentimentCounts.negative++;
    else sentimentCounts.neutral++;
  });

  // Calculate sentiment summary
  const openingSentiment = sentiments.length > 0 ? sentiments[0] : 0;
  const closingSentiment = sentiments.length > 0 ? sentiments[sentiments.length - 1] : 0;

  // Find peak positive and negative clusters (3-message windows)
  let peakPositiveIndex = 0;
  let peakNegativeIndex = 0;
  let maxPositiveCluster = -Infinity;
  let maxNegativeCluster = Infinity;

  for (let i = 0; i < sentiments.length - 2; i++) {
    const cluster = sentiments[i] + sentiments[i + 1] + sentiments[i + 2];
    if (cluster > maxPositiveCluster) {
      maxPositiveCluster = cluster;
      peakPositiveIndex = i + 1; // Center of cluster
    }
    if (cluster < maxNegativeCluster) {
      maxNegativeCluster = cluster;
      peakNegativeIndex = i + 1;
    }
  }

  // Calculate overall trend
  const midpoint = Math.floor(sentiments.length / 2);
  const firstHalf = sentiments.slice(0, midpoint);
  const secondHalf = sentiments.slice(midpoint);

  const firstAvg = firstHalf.length > 0
    ? firstHalf.reduce((sum, s) => sum + s, 0) / firstHalf.length
    : 0;
  const secondAvg = secondHalf.length > 0
    ? secondHalf.reduce((sum, s) => sum + s, 0) / secondHalf.length
    : 0;

  const trendDiff = secondAvg - firstAvg;

  // Calculate variance for volatility detection
  const mean = sentiments.reduce((sum, s) => sum + s, 0) / (sentiments.length || 1);
  const variance = sentiments.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / (sentiments.length || 1);

  let overallTrend;
  if (variance > 0.5) {
    overallTrend = "volatile";
  } else if (trendDiff > 0.2) {
    overallTrend = "rising";
  } else if (trendDiff < -0.2) {
    overallTrend = "falling";
  } else {
    overallTrend = "stable";
  }

  // Calculate ratios
  const total = chunks.length || 1;
  const positiveRatio = Math.round((sentimentCounts.positive / total) * 100) / 100;
  const negativeRatio = Math.round((sentimentCounts.negative / total) * 100) / 100;

  return {
    aeon_stub: {
      version: "0.1.0",
      heat_signature: {
        avg_chunk_heat: Math.round(avgHeat * 100) / 100,
        sentiment_distribution: sentimentCounts,
        sentiment_summary: {
          opening_sentiment: openingSentiment,
          closing_sentiment: closingSentiment,
          peak_positive_index: peakPositiveIndex,
          peak_negative_index: peakNegativeIndex,
          overall_trend: overallTrend,
          positive_ratio: positiveRatio,
          negative_ratio: negativeRatio
        }
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
