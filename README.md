# De:dobe: Extractor – LLM Thread Extractor

[![Ko-fi](https://img.shields.io/badge/Support%20on-Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/blackorchardlabs)

**Your data belongs to you.**

De:dobe Extractor is a browser extension that exports your AI conversations from major LLM platforms to standard formats. No paywalls, no limits, no tracking. Just liberation technology.

**Version 2.0** - Now with multi-platform support!

---

## What This Does

Export your full AI conversations from multiple platforms to Markdown, JSON, or plain text with one click.

**Supported Platforms:**
- **ChatGPT** (chatgpt.com, chat.openai.com)
- **Claude** (claude.ai)
- **Gemini** (gemini.google.com)
- **Grok** (grok.x.ai, chat.x.ai, grok.com, x.com/i/grok)

**Features:**
- **No message limits** - Export conversations of any length
- **No paid tiers** - Completely free, forever
- **No tracking** - Zero analytics, everything happens locally
- **Your data** - Own your conversations, back them up, archive them
- **Multi-format export** - Markdown, JSON, and plain text

## Installation

### Firefox

**Minimum version required: Firefox 121.0+**

**Temporary Installation (for testing):**
1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the de-dobe folder
6. Extension will be active until Firefox restarts

**Permanent Installation:**
Coming soon to Firefox Add-ons store.

### Chrome / Edge

**Compatible with Manifest V3**

1. Download or clone this repository
2. Open `chrome://extensions` (or `edge://extensions`)
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the de-dobe folder
6. Extension is now installed

Chrome Web Store submission planned for v2.1.

**Note:** See [CROSS_BROWSER.md](CROSS_BROWSER.md) for technical details on cross-browser compatibility.

---

## Usage

1. Open any supported AI conversation (ChatGPT, Claude, Gemini, or Grok)
2. Click the De:dobe Extractor icon in your browser toolbar
3. Choose your export format:
   - **Export as Markdown** - Formatted conversation with headers
   - **Export as JSON** - Structured data with metadata
   - **Export as Text** - Simple plain text format
4. Your conversation downloads instantly

---

## Roadmap

### v2.0 (Current)
- [x] Multi-platform support (ChatGPT, Claude, Gemini, Grok)
- [x] Multiple export formats (Markdown, JSON, Plain Text)
- [x] Platform-specific extractors architecture
- [x] Manifest v3 support
- [x] Cross-browser compatibility (Firefox + Chrome)
- [ ] Enhanced error handling and user feedback
- [ ] Settings panel (file naming, save location preferences)
- [ ] AEON stub integration option
- [ ] Purple brain icon with rounded corners

### v2.1 (Planned)
- [ ] DeepSeek support
- [ ] Perplexity support
- [ ] Custom filename templates
- [ ] Batch export functionality
- [ ] Export history and favorites

### v3.0 (Future)
- [ ] Advanced filtering (date ranges, keyword search)
- [ ] Custom export templates
- [ ] API for integration with other tools
- [ ] Plugin system for community extractors

---

## Philosophy

**Liberation technology.** Your conversations with AI systems are yours. You should be able to export them, archive them, search them, and own them without barriers.

We don't monetize your data. We don't track your usage. We don't lock features behind paywalls.

If De:dobe Exporter helps you, consider [supporting the project](https://ko-fi.com/blackorchardlabs). But support is never required. The ladder is free for everyone.

---

## Support This Project

De:dobe Exporter is free and open source. If you find it useful, you can support development:

**[Buy us a coffee on Ko-fi](https://ko-fi.com/blackorchardlabs)**

Suggested tiers:
- $3 - Coffee (thank you!)
- $5 - Pizza (seriously, thank you!)
- $10+ - Build session sponsor (you're amazing)

Every contribution helps us build more liberation technology.

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Planned contributions needed:**
- Testing on different browsers and OS configurations
- DOM structure documentation for v2.0 platforms
- Accessibility improvements
- Translations
- Documentation

---

## Community

- **GitHub Discussions:** Ask questions, share ideas, request features
- **Issues:** Report bugs, suggest improvements
- **Pull Requests:** Contribute code and documentation

**Code of Conduct:** Be kind, be collaborative, be respectful. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## Technical Details

**Privacy:**
- No data collection
- No external servers
- No analytics or tracking
- Everything runs locally in your browser

**Technology:**
- Pure JavaScript (no frameworks)
- WebExtensions API (Manifest v3)
- Cross-browser compatible (Firefox 121+, Chrome, Edge)
- Modular extractor architecture
- Zero dependencies

**Architecture:**
```
de-dobe/
├── background.js           # Service worker for message handling
├── manifest.json          # Extension configuration (v3)
├── content/
│   └── content.js         # Main content script with platform detection
├── extractors/            # Platform-specific extraction modules
│   ├── chatgpt.js
│   ├── claude.js
│   ├── gemini.js
│   ├── grok.js
│   └── generic.js         # Fallback extractor
└── popup/                 # Extension popup UI
    ├── popup.html
    ├── popup.js
    └── popup.css
```

**License:** MIT - see [LICENSE](LICENSE)

---

## FAQ

**Q: Why "De:dobe"?**
A: A play on "decode" - liberating your data from encoded, walled platforms.

**Q: Is this really free?**
A: Yes. Completely free. Support is appreciated but never required.

**Q: Will you add [other AI platform]?**
A: We now support ChatGPT, Claude, Gemini, and Grok in v2.0! DeepSeek and Perplexity are planned for v2.1. Request other platforms via GitHub issues.

**Q: Can I modify this for my own use?**
A: Absolutely. MIT license. Fork it, modify it, use it however you want.

**Q: Does this violate terms of service?**
A: No. You're exporting your own conversations from your own browser. This is your data.

---

## Development Team

**Built by:** [Black Orchard Labs](https://github.com/BlackOrchardLabs)
**Mission:** Liberation technology for the AI age
**Motto:** Fuck paywalls. Build the ladder.

---

## Troubleshooting

**Extension icon doesn't appear:**
- Ensure you're on a supported platform (ChatGPT, Claude, Gemini, or Grok)
- Refresh the page after installing
- Check `about:debugging` (Firefox) or `chrome://extensions` (Chrome) to confirm extension is loaded

**Export seems incomplete:**
- Scroll through the entire conversation first (platforms load messages dynamically)
- Then trigger the export
- For very long conversations, allow a few seconds for extraction

**"No thread detected" message:**
- Ensure you're on a conversation page, not the home screen
- Try refreshing the page and opening the popup again
- Some platforms may have changed their DOM structure - report this via GitHub issues

**No download happens:**
- Check browser download permissions
- Check Downloads folder
- Open browser console (F12) for error messages
- Ensure pop-ups aren't blocked

**Platform not extracting correctly:**
Different platforms update their interfaces frequently. If extraction fails:
1. Check GitHub issues to see if it's a known problem
2. Open a new issue with the platform name and browser console errors
3. We'll update the extractor module ASAP

**Still having issues?**
Open an issue on GitHub with:
- Platform name (ChatGPT, Claude, Gemini, Grok)
- Browser and version
- Operating system
- Steps to reproduce the problem
- Console errors (if any)
- Screenshot of the conversation page (optional)

---

## Contributing Extractors

Want to add support for a new platform? The extractor architecture makes it easy:

1. Create a new file in `extractors/yourplatform.js`
2. Implement the extraction function:
   ```javascript
   window.DeDobeExtractors = window.DeDobeExtractors || {};

   window.DeDobeExtractors.yourplatform = async function() {
     return {
       platform: 'yourplatform',
       messages: [{ role: 'user|assistant', content: '...' }],
       meta: { url: window.location.href, timestamp: new Date().toISOString() }
     };
   };
   ```
3. Add platform detection in `content/content.js`
4. Update `manifest.json` with host permissions and content script matches
5. Submit a pull request!

See existing extractors for reference implementations.

---

**De:dobe: Extractor v2.0** - Your conversations, your data, your freedom.
