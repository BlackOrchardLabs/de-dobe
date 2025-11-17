# De:dobe: Extractor – LLM Thread Extractor

A browser extension that extracts and exports conversations from major LLM platforms into Markdown, JSON, and text formats.

## Supported Platforms

- ChatGPT (chatgpt.com, chat.openai.com)
- Claude AI (claude.ai)
- Google Gemini (gemini.google.com)
- Grok (grok.x.ai, chat.x.ai)

## Features

- Extract full conversation threads from LLM web interfaces
- Export to multiple formats: Markdown, JSON, and plain text
- Privacy-focused: All processing happens locally (no external servers)
- Cross-browser support: Firefox and Chrome

## Project Structure

```
DeDobe/
├── src/                    # Source code
│   ├── manifest.json       # Extension manifest (Manifest V3)
│   ├── background.js       # Background service worker
│   ├── content/            # Content scripts for each platform
│   │   └── content.js
│   └── popup/              # Extension popup UI
│       ├── popup.html
│       ├── popup.js
│       └── popup.css
├── builds/                 # Distribution packages
│   └── *.zip              # Submission packages for browser stores
└── docs/                   # Documentation
    └── CHROME_SUBMISSION_NOTES.md
```

## Development

### Making Changes

1. Edit files in `src/`
2. Test locally by loading the extension in developer mode
3. When ready to submit, create a new build

### Creating a Build

From the project root:

```bash
cd src
# For Chrome
powershell -Command "Compress-Archive -Path manifest.json,background.js,content,popup -DestinationPath ../builds/DeDobe_Chrome_v[VERSION].zip -Force"
```

### Version Updates

When releasing a new version:
1. Update `version` in `src/manifest.json`
2. Create a git tag: `git tag v0.1.1`
3. Build and submit to stores

## Browser Store Status

- **Firefox Add-ons**: ✅ Approved and published
- **Chrome Web Store**: 🔄 Resubmission in progress (addressed "unused scripting permission" violation)

## Installation

### From Source (Developer Mode)

**Chrome:**
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `src/` folder

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file in the `src/` folder

### From Browser Stores

- **Firefox**: [Coming soon - add link when published]
- **Chrome**: [Pending approval]

## Usage

1. Navigate to a supported LLM platform
2. Open a conversation thread
3. Click the De:dobe extension icon
4. Choose your export format (Markdown, JSON, or Text)
5. Download the extracted conversation

## Permissions Explained

- `activeTab`: Communicate with the current tab when you click the extension
- `downloads`: Save exported conversation files to your computer
- `storage`: Remember your export format preferences
- `host_permissions`: Access the LLM platform pages to extract conversations

## Contributing

This is a personal project, but suggestions and bug reports are welcome!

## License

[Add license information]

## Developer

Black Orchard

---

**Note for Artists with Squirrel-Level Organization:** This repo is now your single source of truth! No more dated desktop folders. 🐿️✨
