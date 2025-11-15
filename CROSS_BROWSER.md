# Cross-Browser Compatibility Guide

## Manifest V3 Background Scripts

De:dobe Extractor uses a cross-browser compatible approach for background scripts in Manifest V3.

### The Challenge

- **Chrome**: Requires `service_worker` for Manifest V3 background scripts
- **Firefox**: Does NOT support `service_worker` (see [Firefox bug 1573659](https://bugzilla.mozilla.org/show_bug.cgi?id=1573659))
- **Firefox**: Uses `scripts` or `page` for background scripts in MV3

### Our Solution

The manifest.json includes **both** properties:

```json
{
  "background": {
    "scripts": ["background.js"],
    "service_worker": "background.js"
  }
}
```

### How It Works

- **Chrome (MV3)**: Uses `service_worker`, ignores `scripts` property
- **Firefox 121+**: Uses `scripts` array, ignores unsupported `service_worker`
- **Safari**: Uses `scripts` by default unless `preferred_environment` targets service workers

### Firefox Version Requirements

**Minimum version: Firefox 121.0**

Before Firefox 121, the browser would not start the background page if `service_worker` was present in the manifest. From Firefox 121 onwards, Firefox properly handles manifests with both properties and starts the background page as expected.

### Browser API Compatibility

All scripts use cross-browser API compatibility:

```javascript
// Cross-browser compatibility shim
const browser = globalThis.browser || globalThis.chrome;
```

This ensures:
- Firefox uses the native `browser` API
- Chrome/Edge use `chrome` API (aliased to `browser` for consistency)

### Testing

**Firefox:**
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `manifest.json`

**Chrome:**
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the de-dobe folder

### Known Limitations

**Firefox:**
- No service worker support (traditional background scripts only)
- Background scripts are non-persistent (Event Pages)
- Must handle potential script restarts

**Chrome:**
- Service workers have stricter limitations than background pages
- No DOM access in service workers
- All state must be stored or recreated

### Future Considerations

If Firefox eventually adds service worker support, we can:
1. Keep both properties for backward compatibility
2. Use feature detection if needed
3. Migrate to service-worker-only when minimum versions allow

### References

- [MDN: background manifest key](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background)
- [Firefox MV3 Migration Guide](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/)
- [Chrome Extension MV3](https://developer.chrome.com/docs/extensions/mv3/intro/)
