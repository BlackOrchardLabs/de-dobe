# Chrome Web Store Submission Notes - De:dobe Extractor

## Addressing Violation ID: Purple Potassium (Unused Scripting Permission)

### Issue Resolution
The previous submission was rejected for "unused scripting permission". This has been **fully resolved** in this updated submission.

### Changes Made
1. **Added explicit `content_scripts` declaration** in manifest.json (lines 21-34)
   - Properly declares content script injection for all supported LLM platforms
   - Uses static content script registration (the recommended approach for Manifest V3)

2. **Removed `scripting` permission** from the permissions array
   - This permission was incorrectly included in the previous version
   - Content scripts declared via `content_scripts` do NOT require the `scripting` permission
   - The `scripting` permission is only needed for dynamic script injection using `chrome.scripting.executeScript()`, which this extension does not use

### How Content Scripts Are Used

**Purpose**: De:dobe extracts conversation threads from LLM web interfaces (ChatGPT, Claude, Gemini, Grok) and exports them to Markdown/JSON/text formats.

**Content Script Injection**:
- **File**: `content/content.js`
- **Injection Method**: Static declaration via `content_scripts` in manifest.json
- **Platforms**: ChatGPT, Claude AI, Google Gemini, Grok (see `host_permissions` and `content_scripts.matches`)
- **Functionality**:
  - Detects which LLM platform is active
  - Extracts conversation DOM elements specific to each platform
  - Sends extracted data to background script for processing
  - Listens for extraction requests from the popup UI

**Why Content Scripts Are Essential**:
- Each LLM platform has a different DOM structure for conversations
- Content scripts run in the page context to access and parse these platform-specific elements
- Cannot be done via the popup or background script alone due to same-origin policy
- Firefox has already approved this exact functionality

### Permissions Justification

| Permission | Purpose |
|------------|---------|
| `activeTab` | Allows communication with the current tab when user clicks the extension icon |
| `downloads` | Enables exporting extracted conversations as downloadable files (MD, JSON, TXT) |
| `storage` | Stores user preferences and settings |
| `host_permissions` | Required to inject content scripts on supported LLM platforms |

**Note**: The `content_scripts` declaration is **not a permission** but a manifest field that registers scripts to run on specific URLs.

### Cross-Browser Compatibility
- ✅ **Firefox**: Approved and published (same codebase)
- ✅ **Chrome**: Updated to comply with stricter Manifest V3 validation

### Testing
This extension has been tested on:
- Chrome 131+
- Firefox 109+
- All supported platforms (ChatGPT, Claude, Gemini, Grok)

### Additional Notes for Reviewers
- This is a productivity tool for researchers, developers, and users who need to archive LLM conversations
- No data is sent to external servers (all processing is local)
- Content scripts are read-only and do not modify page content
- The extension only activates when the user clicks the icon and requests an extraction

---

**Previous Rejection Reference**: Violation ID Purple Potassium
**Submission Date**: November 2025
**Developer**: Black Orchard
