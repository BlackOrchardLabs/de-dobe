// Runtime detection
const isChrome = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest;
const api = isChrome ? chrome : browser;

let currentConversation = null;

async function refresh() {
  document.getElementById("status").textContent = "Capturing...";
  await api.runtime.sendMessage({ type: "ORCHARD_LOOM_POPUP_REQUEST_EXTRACT" });
  const data = await api.runtime.sendMessage({ type: "ORCHARD_LOOM_POPUP_REQUEST_DATA" });

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

  // Chrome-safe blob handling - ensure non-empty
  if (isChrome && (!blob || blob.size === 0)) {
    blob = new Blob(['\n'], { type: mime });
  }

  const url = URL.createObjectURL(blob);
  api.downloads.download({ url, filename: name, saveAs: true });
}

document.addEventListener("DOMContentLoaded", () => {
  refresh();

  document.getElementById("export-md").onclick = () => {
    if (!currentConversation) return;
    download("conversation.md", JSON.stringify(currentConversation, null, 2), "text/markdown");
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
