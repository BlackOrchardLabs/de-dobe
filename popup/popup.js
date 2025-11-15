// Cross-browser compatibility
const browser = globalThis.browser || globalThis.chrome;

let currentConversation = null;

async function refresh() {
  document.getElementById("status").textContent = "Capturing...";
  await browser.runtime.sendMessage({ type: "ORCHARD_LOOM_POPUP_REQUEST_EXTRACT" });
  const data = await browser.runtime.sendMessage({ type: "ORCHARD_LOOM_POPUP_REQUEST_DATA" });

  if (data && data.messages?.length) {
    currentConversation = data;
    document.getElementById("status").textContent =
      `Captured ${data.messages.length} messages from ${data.platform}`;
  } else {
    document.getElementById("status").textContent = "No thread detected.";
  }
}

function download(name, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  browser.downloads.download({ url, filename: name, saveAs: true });
}

document.addEventListener("DOMContentLoaded", () => {
  refresh();

  document.getElementById("export-md").onclick = () => {
    if (!currentConversation) return;

    // Format as proper markdown
    let markdown = `# ${currentConversation.platform.toUpperCase()} Conversation Export\n\n`;
    markdown += `**Exported:** ${currentConversation.meta?.timestamp || new Date().toISOString()}\n\n`;
    if (currentConversation.meta?.url) {
      markdown += `**URL:** ${currentConversation.meta.url}\n\n`;
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
    if (!currentConversation) return;
    download("conversation.json", JSON.stringify(currentConversation, null, 2), "application/json");
  };

  document.getElementById("export-txt").onclick = () => {
    if (!currentConversation) return;
    const txt = currentConversation.messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");
    download("conversation.txt", txt, "text/plain");
  };
});
