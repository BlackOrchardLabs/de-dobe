# Chrome Build Testing Guide

## 🧪 Quick Testing Checklist

Follow these steps to verify the Chrome build works before submitting to Chrome Web Store.

---

## Step 1: Load Extension in Chrome

1. Open Chrome browser
2. Navigate to: `chrome://extensions`
3. Enable **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"** button
5. Navigate to: `C:\Hermes\projects\DeDobe\builds\chrome`
6. Click **"Select Folder"**

**Expected Result:**
- ✅ De:dobe extension appears in extensions list
- ✅ No errors shown
- ✅ Extension icon appears in Chrome toolbar

---

## Step 2: Test on ChatGPT

1. Open new tab: https://chatgpt.com
2. Log in if needed
3. Start a **new conversation**
4. Send one test message (e.g., "Hello, test message")
5. Wait for ChatGPT to respond
6. Click De:dobe extension icon in toolbar
7. Popup should appear showing "Capturing..."
8. Click **"Export Markdown"** button

**Expected Result:**
- ✅ Popup shows: "Captured 2 messages from chatgpt"
- ✅ File downloads automatically
- ✅ File contains your conversation
- ✅ No errors in browser console (F12)

---

## Step 3: Test on Claude

1. Open new tab: https://claude.ai
2. Log in if needed
3. Start a **new conversation**
4. Send one test message
5. Wait for Claude to respond
6. Click De:dobe extension icon
7. Click **"Export JSON"** button

**Expected Result:**
- ✅ Popup shows: "Captured X messages from claude"
- ✅ File downloads successfully
- ✅ JSON file is valid and contains messages

---

## Step 4: Check Service Worker

1. Navigate to: `chrome://serviceworker-internals/`
2. Find "De:dobe: Extractor" in the list
3. Check status

**Expected Result:**
- ✅ Service worker status: "ACTIVATED"
- ✅ No errors listed
- ✅ "Start" time shows recent activation

---

## Step 5: Check Console for Errors

1. Open any LLM site (ChatGPT, Claude, etc.)
2. Press **F12** to open DevTools
3. Click **"Console"** tab
4. Look for any red error messages

**Expected Result:**
- ✅ No "404 Not Found" errors
- ✅ No "CSP violation" errors
- ✅ No "Failed to load resource" errors
- ✅ Extension loads silently without errors

---

## 🚨 Troubleshooting

### "Service worker registration failed"
**Cause:** Manifest syntax error
**Fix:**
1. Check `builds/chrome/manifest.json` for syntax errors
2. Validate JSON at jsonlint.com
3. Rebuild: `bash build-chrome.sh`

### "Cannot read properties of undefined"
**Cause:** Content script running before DOM ready
**Fix:** Already implemented in content.js - if this occurs, report as bug

### Downloads not working
**Cause:** Missing downloads permission
**Fix:**
1. Verify `manifest.json` has `"downloads"` in permissions
2. Rebuild if missing

### "Extension context invalidated"
**Cause:** Extension reloaded during testing
**Fix:**
1. Refresh the page you're testing on
2. Try export again

---

## ✅ All Tests Passed?

If all tests pass:
1. ✅ Service worker activates
2. ✅ Content scripts inject on LLM sites
3. ✅ Popup opens and shows status
4. ✅ Downloads work on all platforms
5. ✅ No console errors

**You're ready to submit to Chrome Web Store!**

Proceed to: `CHROME_RESUBMISSION_NOTES.md` → Section "🚀 Resubmission Steps"

---

## 🔬 Advanced Testing (Optional)

### Test All Supported Platforms
- [ ] ChatGPT (chatgpt.com)
- [ ] Claude (claude.ai)
- [ ] Gemini (gemini.google.com)
- [ ] Grok (grok.x.ai or chat.x.ai)

### Test All Export Formats
- [ ] Markdown export (.md)
- [ ] JSON export (.json)
- [ ] Text export (.txt)

### Test Edge Cases
- [ ] Empty conversation (should not crash)
- [ ] Very long conversation (100+ messages)
- [ ] Special characters in messages (emoji, code blocks)
- [ ] Multiple tabs open simultaneously

---

## 📊 Performance Check

Open Chrome Task Manager (Shift + Esc) and verify:
- Memory usage: <50MB
- CPU usage: <5% when idle
- No memory leaks after multiple exports

---

**Last Updated:** 2025-11-19
**Chrome Build Version:** 0.1.0
**Testing Time:** ~10 minutes
