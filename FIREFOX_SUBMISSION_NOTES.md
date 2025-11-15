# Firefox Add-ons Submission Notes - De:dobe v2.0.0

## Submission Package
**File:** `de-dobe-v2.0.0-firefox.zip`
**Size:** ~25KB (compressed)
**Files:** 15 total

### Contents:
```
manifest.json          - Extension configuration (Manifest v3)
background.js          - Service worker/background script
LICENSE               - MIT License
content/
  └── content.js      - Main content script
extractors/
  ├── chatgpt.js      - ChatGPT extractor
  ├── claude.js       - Claude extractor
  ├── gemini.js       - Gemini extractor
  ├── grok.js         - Grok extractor
  └── generic.js      - Generic fallback extractor
popup/
  ├── popup.html      - Extension popup UI
  ├── popup.js        - Popup logic
  └── popup.css       - Popup styles
icons/
  ├── icon-16.png     - 16x16 toolbar icon
  ├── icon-48.png     - 48x48 management icon
  └── icon-128.png    - 128x128 store listing icon
```

---

## Extension Details for Submission Form

### Basic Information
- **Name:** De:dobe: Extractor – LLM Thread Extractor
- **Version:** 2.0.0
- **Summary (250 chars):** Export AI conversations from ChatGPT, Claude, Gemini & Grok. Your data belongs to you. No paywalls, no limits, no tracking. Multi-format export (Markdown, JSON, Text). Privacy-first, runs locally.

### Categories
- Primary: **Productivity**
- Secondary: **Privacy & Security**

### Tags/Keywords
`AI, ChatGPT, Claude, Gemini, Grok, export, conversation, backup, data liberation, privacy, open source, markdown, JSON, LLM`

### License
**MIT License** (included in package)

---

## Technical Details

### Minimum Firefox Version
**121.0** (Required for Manifest v3 background scripts compatibility)

### Data Collection Declaration
**`data_collection_permissions.required: ["none"]`**

De:dobe declares that it collects **NO data**. This is required by Firefox's built-in consent system (mandatory for all extensions from November 3, 2025).

### Permissions Requested
1. **`activeTab`** - To access the current conversation page for extraction
2. **`downloads`** - To save exported conversation files
3. **`storage`** - To remember user preferences (currently unused, reserved for future)
4. **`scripting`** - To inject content scripts on supported platforms

### Host Permissions
- `https://chatgpt.com/*`
- `https://chat.openai.com/*`
- `https://claude.ai/*`
- `https://gemini.google.com/*`
- `https://grok.x.ai/*`
- `https://chat.x.ai/*`
- `https://grok.com/*`
- `https://x.com/i/grok*`

**Why needed:** Content scripts must run on these domains to extract conversation data from the DOM.

---

## Privacy Policy

### Data Collection
**NONE.** Zero data collection.

### Analytics
**NONE.** No analytics or tracking of any kind.

### External Servers
**NONE.** Everything runs locally in the user's browser.

### Data Processing
- All conversation extraction happens locally
- Exported files are created client-side as Blob URLs
- No data is ever sent to external servers
- No network requests made by the extension (except opening Ko-fi link if user clicks support)

### Permissions Usage
- **activeTab:** Only used to read conversation content from the current tab
- **downloads:** Only used to save user-requested exports
- **storage:** Reserved for future use (user preferences)
- **scripting:** Only used to inject extractors on supported platforms

**User Data:** Remains entirely on the user's device. We never see, store, or transmit any user conversations.

---

## Source Code

- **GitHub:** https://github.com/BlackOrchardLabs/de-dobe
- **License:** MIT
- **Open Source:** Yes, fully open source

All code is publicly available and auditable.

---

## Testing Instructions for Reviewers

### Test on Grok (Easiest)
1. Install the extension in Firefox 121+
2. Go to https://grok.com
3. Start or open a conversation
4. Click the De:dobe Extractor icon in toolbar
5. Click "Export as Markdown" (or JSON/Text)
6. File should download with conversation content

### Test on ChatGPT
1. Go to https://chatgpt.com
2. Open any conversation
3. Click extension icon → Export
4. Verify download

### Test on Claude
1. Go to https://claude.ai
2. Open any conversation
3. Click extension icon → Export
4. Verify download

### Test on Gemini
1. Go to https://gemini.google.com
2. Open any conversation
3. Click extension icon → Export
4. Verify download

### Expected Behavior
- Extension icon appears in toolbar when on supported platforms
- Popup shows "Captured X messages from [platform]"
- Export buttons download files immediately
- Files contain conversation text in chosen format
- No errors in browser console

### Console Logs
The extension includes debug logging prefixed with `[De:dobe ...]` for troubleshooting. These can be viewed in the browser console (F12).

---

## Support & Contact

- **GitHub Issues:** https://github.com/BlackOrchardLabs/de-dobe/issues
- **Documentation:** https://github.com/BlackOrchardLabs/de-dobe#readme
- **Support:** https://ko-fi.com/blackorchardlabs (optional, never required)

---

## Additional Notes

### Why This Extension?

De:dobe ("decode") is liberation technology. Many AI platforms limit conversation exports or lock them behind paywalls. This extension ensures users can always access and export their own conversations, which are their data and their intellectual property.

### Manifest V3 Compatibility

This extension uses Manifest V3 with special Firefox compatibility:
- `background.scripts` for Firefox (non-persistent background page)
- `service_worker` for Chrome (ignored by Firefox)

Both are included in manifest.json for cross-browser compatibility.

**Note about service_worker warning:** Firefox will show a warning about `background.service_worker` being present. This is **expected and harmless**. Firefox ignores this field (it only uses `background.scripts`), while Chrome ignores `background.scripts` and uses `service_worker`. This is the documented cross-browser approach per MDN and Chrome Extension docs.

**Why both fields are needed:**
- Chrome MV3: Requires `service_worker`, ignores `scripts`
- Firefox MV3: Requires `scripts`, ignores `service_worker`
- This allows one codebase to work in both browsers

### No External Dependencies

The extension is pure JavaScript with zero dependencies. All code is self-contained and auditable.

### Future Plans

- v2.1: Add DeepSeek and Perplexity support
- v3.0: Advanced filtering and custom templates
- Community extractor plugins

---

## Reviewer Quick Start

1. **Load extension** in Firefox 121+
2. **Go to grok.com** and start a chat
3. **Click extension icon** - should show message count
4. **Click "Export as Markdown"** - file downloads
5. **Open downloaded file** - should contain conversation

**That's it!** The extension works the same on all 4 platforms.

---

**Built by Black Orchard Labs**
*Liberation technology for the AI age.*

Fuck paywalls. Build the ladder.
