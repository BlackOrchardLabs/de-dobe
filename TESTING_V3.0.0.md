# De:dobe v3.0.0 Testing Guide

## Quick Start: Load Unpacked Extension (No Build Needed)

For testing, you can load the extension directly without building zip files.

---

## Chrome Testing

### 1. Prepare Chrome Manifest
```bash
cd C:\Hermes\projects\black_orchard\de-dobe
copy manifest-chrome.json manifest.json
```

### 2. Load Extension
1. Open **Chrome**
2. Navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the folder: `C:\Hermes\projects\black_orchard\de-dobe`
6. The De:dobe icon should appear in your toolbar

### 3. Test Platforms
Test exports on these platforms:

#### ✅ Gemini (Primary Test - This Was Broken)
- Go to https://gemini.google.com
- Start or open a conversation
- Click the De:dobe icon
- Click "Export MD" or "Export JSON"
- **Expected:** Should see chunks in export with Angular selectors working

#### ✅ ChatGPT (Regression Test)
- Go to https://chatgpt.com
- Open any conversation
- Click De:dobe icon → Export
- **Expected:** Should work as before, chunks included

#### ✅ Claude (Regression Test)
- Go to https://claude.ai
- Open any conversation
- Click De:dobe icon → Export
- **Expected:** Should work as before, chunks included

#### ✅ Grok (Regression Test)
- Go to https://x.com/i/grok
- Open any conversation
- Click De:dobe icon → Export
- **Expected:** Should work as before, chunks included

### 4. Check Console Logs
Open DevTools (F12) and check for:
```
[De:dobe v3.0.0] Script loaded on: [hostname]
[De:dobe v3.0.0] Detected platform: gemini
[De:dobe v3.0.0] Export requested for platform: gemini
[De:dobe v3.0.0] Extractor returned: X messages
[De:dobe v3.0.0] Sending to background with X chunks
```

### 5. Verify Export JSON Structure
Open the exported JSON and check for:
```json
{
  "platform": "gemini",
  "url": "https://gemini.google.com/...",
  "timestamp": "2025-12-05T...",
  "messages": [
    {
      "role": "user",
      "content": "..."
    }
  ],
  "chunks": [
    {
      "text": "...",
      "role": "user",
      "sentiment": 0,
      "heat": 50,
      "tier": "temper",
      "created_at": 1733430000000
    }
  ]
}
```

---

## Firefox Testing

### 1. Prepare Firefox Manifest
```bash
cd C:\Hermes\projects\black_orchard\de-dobe
copy manifest-firefox.json manifest.json
```

### 2. Load Extension
1. Open **Firefox**
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click **"Load Temporary Add-on..."**
4. Navigate to `C:\Hermes\projects\black_orchard\de-dobe`
5. Select **any file** in the folder (e.g., `manifest.json`)
6. The De:dobe icon should appear in your toolbar

### 3. Test Same Platforms as Chrome
Repeat the same 4 platform tests:
- Gemini (primary)
- ChatGPT
- Claude
- Grok

---

## What to Look For

### ✅ Success Indicators
- [ ] Gemini exports messages successfully (Angular selectors work)
- [ ] Export JSON includes `chunks` array
- [ ] Each chunk has `heat`, `tier`, `sentiment` fields
- [ ] Console shows "v3.0.0" logs with chunk count
- [ ] No errors in browser console
- [ ] All 4 platforms export successfully

### ❌ Failure Indicators
- Gemini returns 0 messages (Angular selectors failed)
- Export JSON missing `chunks` field
- Console shows errors about missing extractors
- Extension icon doesn't appear
- Exports are empty

---

## Common Issues

### Issue: "No messages found"
**Fix:** Check console for extractor errors. The selectors may have changed again.

### Issue: Extension won't load
**Fix:**
- Make sure `manifest.json` matches your browser (Chrome or Firefox)
- Check for syntax errors in console

### Issue: Chunks are empty
**Fix:** This means messages were extracted but chunking failed. Check console for SHA-256 errors.

---

## After Testing

### If All Tests Pass ✅
1. Restore default manifest:
   ```bash
   git checkout manifest.json
   ```
2. Ready to build production zips for store submission

### If Tests Fail ❌
1. Document which platform failed
2. Check browser console for errors
3. Report findings before building production zips

---

## Production Builds (After Testing)

### Chrome Build
```bash
build-chrome.bat
```
Creates: `builds/de-dobe-v3.0.0-chrome.zip`

### Firefox Build
```bash
build-firefox.bat
```
Creates: `builds/de-dobe-v3.0.0-firefox.zip`

---

## Notes

- **Important:** Always restore `manifest.json` after testing:
  ```bash
  git checkout manifest.json
  ```
- Firefox temporary extensions are removed when browser closes
- Chrome unpacked extensions persist across restarts
- Check for CSP errors in Gemini (Google has strict CSP)

---

**Testing Priority:** Gemini is the critical test since that's what broke.
