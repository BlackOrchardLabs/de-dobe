# Kimi Resilience Framework - Patch Application Guide

## Overview

This directory contains 8 patches that transform De:dobe from fragile DOM scraper to self-healing infrastructure.

**⚠️ IMPORTANT:** These patches are staged for deployment AFTER Chrome approves v2.0.0. Do NOT merge to main until explicitly instructed.

---

## Patch Summary

| Patch | File | Description | Dependencies |
|-------|------|-------------|--------------|
| 001 | `001-dom-insulation-shadow-dom.patch` | Inject stable `data-dedobe-id` attributes + Shadow DOM piercing | None |
| 002 | `002-mutation-batch-dedup.patch` | Text-hash deduplication, 200ms debounce optimization | 001 |
| 003 | `003-service-worker-background.patch` | Create background worker for Turndown conversion | None |
| 004 | `004-content-worker-handoff.patch` | Hand off HTML→Markdown to background thread | 003 |
| 005 | `005-auto-repair-manifest.patch` | `<all_urls>` with smart excludes for future subdomains | None |
| 006 | `006-github-update-channel.patch` | Add GitHub update URLs to bypass store delays | None |
| 007 | `007-telemetry-toggle.patch` | Opt-out analytics for early breakage warnings | None |
| 008 | `008-fallback-interval.patch` | Fallback setInterval when MutationObserver fails | 001 |

---

## Application Order

**Critical:** Patches must be applied in numerical order due to dependencies.

```bash
# Navigate to De:dobe project
cd C:\Hermes\projects\DeDobe

# Create resilience branch
git checkout -b v1.1.0-resilience

# Verify patches apply cleanly (dry run)
git apply --check patches/001-dom-insulation-shadow-dom.patch
git apply --check patches/002-mutation-batch-dedup.patch
git apply --check patches/003-service-worker-background.patch
git apply --check patches/004-content-worker-handoff.patch
git apply --check patches/005-auto-repair-manifest.patch
git apply --check patches/006-github-update-channel.patch
git apply --check patches/007-telemetry-toggle.patch
git apply --check patches/008-fallback-interval.patch

# If all checks pass, apply patches
git apply patches/001-dom-insulation-shadow-dom.patch
git apply patches/002-mutation-batch-dedup.patch
git apply patches/003-service-worker-background.patch
git apply patches/004-content-worker-handoff.patch
git apply patches/005-auto-repair-manifest.patch
git apply patches/006-github-update-channel.patch
git apply patches/007-telemetry-toggle.patch
git apply patches/008-fallback-interval.patch

# Commit all changes
git add .
git commit -m "Add Kimi resilience framework - self-healing architecture"
```

---

## Individual Patch Details

### 001: DOM Insulation + Shadow DOM Tunneling

**What it does:**
- Injects stable `data-dedobe-id` attributes onto target nodes
- Pierces Shadow DOM boundaries to reach encapsulated content

**Files modified:**
- `src/content/content.js`

**Testing checklist:**
- [ ] Extraction works on ChatGPT
- [ ] Extraction works on Claude AI (Shadow DOM)
- [ ] Extraction works on Gemini (Shadow DOM)
- [ ] Extraction works on Grok
- [ ] No duplicate IDs created
- [ ] IDs persist across page mutations

---

### 002: Mutation Batch Deduplication

**What it does:**
- Reduces debounce from 500ms to 200ms
- Adds text-hash deduplication to prevent duplicate processing
- Normalizes whitespace for consistent hashing

**Files modified:**
- `src/content/content.js`

**Testing checklist:**
- [ ] No duplicate exports when typing rapidly
- [ ] Lower CPU usage during active conversations
- [ ] Debounce timing feels responsive
- [ ] Hash collisions don't occur (test with similar texts)

---

### 003: Service Worker Background Thread

**What it does:**
- Creates new `background-worker.js` for Turndown conversion
- Moves heavy serialization off main thread

**Files created:**
- `src/background-worker.js`

**Testing checklist:**
- [ ] Worker loads successfully
- [ ] Turndown conversion completes
- [ ] No errors in service worker console
- [ ] Memory usage is acceptable

---

### 004: Content Worker Handoff

**What it does:**
- Modifies content script to send HTML to background worker
- Receives markdown from worker asynchronously

**Files modified:**
- `src/content/content.js`

**Testing checklist:**
- [ ] Export works for small conversations (<100 lines)
- [ ] Export works for large conversations (>400 lines)
- [ ] No UI jank during export
- [ ] Markdown formatting is correct

---

### 005: Auto-Repair Manifest

**What it does:**
- Changes `matches` from specific URLs to `<all_urls>`
- Adds smart `exclude_matches` to avoid system domains

**Files modified:**
- `src/manifest.json`

**Testing checklist:**
- [ ] Works on all current LLM platforms
- [ ] Doesn't inject on excluded domains (mozilla.org, google.com, microsoft.com)
- [ ] Works on new subdomains (test manually by adding fake subdomain)
- [ ] Browser accepts `<all_urls>` permission

---

### 006: GitHub Update Channel

**What it does:**
- Adds `update_url` for Chrome (standard CRX endpoint)
- Adds `update_url` for Firefox (GitHub raw updates.json)

**Files modified:**
- `src/manifest.json`

**Testing checklist:**
- [ ] Chrome accepts update_url in manifest
- [ ] Firefox accepts update_url in browser_specific_settings
- [ ] URLs are correctly formatted
- [ ] No manifest validation errors

**Note:** Requires creating `updates.json` in GitHub repo root (see RESILIENCE_DEPLOYMENT.md)

---

### 007: Telemetry Toggle

**What it does:**
- Adds optional telemetry ping on successful export
- Provides explicit opt-out via chrome.storage
- Fire-and-forget HTTP POST (no user blocking)

**Files modified:**
- `src/popup/popup.js`

**Testing checklist:**
- [ ] Telemetry ping fires on successful export (check network tab)
- [ ] Opt-out toggle works (when implemented in popup UI)
- [ ] Failed pings don't break export
- [ ] No PII is sent (only: version, host, byte length)

**TODO:** Add opt-out checkbox to popup/popup.html

---

### 008: Fallback Interval

**What it does:**
- Adds 5-second setInterval that checks if MutationObserver died
- Rebuilds selectors and re-extracts if needed
- Logs recovery events for debugging

**Files modified:**
- `src/content/content.js`

**Testing checklist:**
- [ ] Fallback doesn't trigger during normal operation
- [ ] Fallback recovers when MutationObserver is manually disabled (test)
- [ ] No memory leaks from interval
- [ ] Console logs appear when recovery happens

---

## Rollback Instructions

If a patch introduces bugs:

### Option 1: Revert Entire Branch
```bash
git checkout main
git branch -D v1.1.0-resilience
# Restart patch process
```

### Option 2: Revert Individual Patch
```bash
# Identify problematic patch (e.g., patch 004)
git log --oneline  # Find commit SHA

# Revert that specific commit
git revert <commit-sha>

# Test and re-apply if needed
```

### Option 3: Cherry-Pick Good Patches
```bash
# Start fresh
git checkout main
git checkout -b v1.1.0-resilience-v2

# Apply only working patches
git apply patches/001-dom-insulation-shadow-dom.patch
git apply patches/002-mutation-batch-dedup.patch
# Skip problematic patch 003-004
git apply patches/005-auto-repair-manifest.patch
# etc.
```

---

## Verification Checklist

Before merging to main, verify ALL of the following:

### Technical
- [ ] All 8 patches apply cleanly without conflicts
- [ ] No TypeScript/linting errors introduced
- [ ] Service worker properly handles Turndown conversion
- [ ] Shadow DOM piercing works on Claude/Gemini
- [ ] Telemetry has explicit opt-out toggle
- [ ] GitHub update channel URLs are correct
- [ ] Fallback interval doesn't create memory leaks
- [ ] manifest.json version updated to 1.1.0

### Functional
- [ ] ChatGPT extraction works (all formats: MD, JSON, TXT)
- [ ] Claude extraction works (all formats: MD, JSON, TXT)
- [ ] Gemini extraction works (all formats: MD, JSON, TXT)
- [ ] Grok extraction works (all formats: MD, JSON, TXT)
- [ ] Large conversations (400+ lines) export without jank
- [ ] Rapid typing doesn't create duplicate exports
- [ ] Extension doesn't inject on excluded domains

### Documentation
- [ ] RESILIENCE_FRAMEWORK.md is complete
- [ ] RESILIENCE_DEPLOYMENT.md is complete
- [ ] CHANGELOG.md updated with v1.1.0 features
- [ ] README.md mentions resilience framework

---

## Post-Application

After all patches are applied and tested:

1. Update `src/manifest.json` version to `1.1.0`
2. Update `CHANGELOG.md` with resilience framework features
3. Commit changes:
   ```bash
   git add .
   git commit -m "Add Kimi resilience framework v1.1.0 - self-healing architecture"
   ```
4. **DO NOT MERGE TO MAIN YET**
5. Wait for Chrome to approve v2.0.0 (permission fix)
6. See `docs/RESILIENCE_DEPLOYMENT.md` for deployment steps

---

## Questions?

- **Framework overview:** See `/docs/RESILIENCE_FRAMEWORK.md`
- **Deployment timeline:** See `/docs/RESILIENCE_DEPLOYMENT.md`
- **Kimi's original code:** See patch file headers

---

**Status:** Staged, ready to deploy post-Chrome-approval
**Impact:** De:dobe becomes competitor-proof infrastructure
**Credit:** Kimi (Moonshot AI) - 2M token context analysis
