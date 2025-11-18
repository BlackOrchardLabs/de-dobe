# Kimi Resilience Framework - Deployment Checklist

## Pre-Deployment Status

**Current Status:** Staged in `v1.1.0-resilience` branch
**Awaiting:** Chrome Web Store approval of v2.0.0 (permission fix)
**Target Deployment:** Immediately after Chrome approval

---

## Why Wait for Chrome Approval?

**Problem:** Chrome is currently reviewing v2.0.0 for the "unused scripting permission" fix (Violation ID: Purple Potassium).

**Risk:** Introducing architectural changes mid-review could:
- Reset the review process
- Trigger new compliance scrutiny
- Delay approval by weeks

**Solution:** Stage resilience framework NOW, deploy AFTER approval.

---

## Deployment Timeline

### Phase 1: Chrome Approval (Current)
- **Status:** Waiting
- **ETA:** 1-3 business days
- **Action:** Monitor Chrome Web Store Developer Dashboard

### Phase 2: Resilience Deployment (After Approval)
- **Trigger:** Chrome approves v2.0.0
- **Duration:** < 1 hour
- **Action:** Execute deployment checklist below

### Phase 3: User Updates
- **Chrome:** Auto-update within 24 hours
- **Firefox:** Auto-update within 1 hour (via GitHub channel)
- **Manual:** Users can force update immediately

---

## Deployment Checklist

Execute these steps **in order** after Chrome approves v2.0.0:

### Step 1: Verify Chrome Approval ✅

- [ ] Log into [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [ ] Confirm De:dobe v2.0.0 status: **"Published"**
- [ ] Verify no new violations or review requests
- [ ] Test v2.0.0 live on Chrome to confirm it works

**If not approved:** STOP. Do not proceed. Wait for approval.

---

### Step 2: Merge Resilience Branch 🔀

```bash
cd C:\Hermes\projects\DeDobe

# Ensure main is up to date
git checkout main
git pull origin main

# Verify resilience branch is clean
git checkout v1.1.0-resilience
git status  # Should be clean

# Merge to main
git checkout main
git merge v1.1.0-resilience --no-ff -m "Merge Kimi resilience framework v1.1.0"

# Verify no conflicts
git status  # Should be clean
```

**Checkpoint:**
- [ ] Merge completed without conflicts
- [ ] All 8 patches are now in main
- [ ] No uncommitted changes

---

### Step 3: Tag Release 🏷️

```bash
# Create annotated tag
git tag -a v1.1.0 -m "De:dobe v1.1.0 - Kimi Resilience Framework

Self-healing architecture that prevents monthly breakage:
- DOM insulation with stable data-dedobe-id attributes
- Shadow DOM tunneling for Claude/Gemini
- Mutation batching with text-hash deduplication
- Auto-repair manifest with <all_urls>
- Service worker offloading for zero-jank exports
- GitHub update channel for emergency fixes
- Telemetry toggle for early breakage warnings
- Graceful degradation fallback

Credit: Kimi (Moonshot AI) - 2M token context analysis"

# Push tag to GitHub
git push origin v1.1.0
git push origin main
```

**Checkpoint:**
- [ ] Tag created successfully
- [ ] Tag pushed to GitHub
- [ ] GitHub releases page shows v1.1.0

---

### Step 4: Create GitHub Release 📦

1. Go to [De:dobe Releases](https://github.com/BlackOrchardLabs/de-dobe/releases)
2. Click **"Draft a new release"**
3. **Tag:** v1.1.0
4. **Title:** De:dobe v1.1.0 - Kimi Resilience Framework
5. **Description:**
   ```markdown
   ## 🛡️ Self-Healing Architecture

   De:dobe v1.1.0 introduces the **Kimi Resilience Framework** - transforming De:dobe from fragile DOM scraper to competitor-proof infrastructure.

   ### What's New

   #### 1. DOM Insulation
   - Stable `data-dedobe-id` attributes survive CSS changes
   - No more monthly breakage when platforms rename classes

   #### 2. Shadow DOM Tunneling
   - Pierce shadow roots to extract Claude/Gemini content
   - Reaches content competitors can't access

   #### 3. Mutation Batching
   - Text-hash deduplication prevents duplicate exports
   - 200ms debounce for faster response

   #### 4. Auto-Repair Manifest
   - `<all_urls>` with smart excludes
   - Works on future subdomains instantly

   #### 5. Service Worker Offloading
   - Turndown conversion in background thread
   - Zero UI jank, even for 400+ line conversations

   #### 6. GitHub Update Channel
   - Emergency fixes deploy in <1 hour
   - No more waiting 3-7 days for store approval

   #### 7. Telemetry Toggle
   - Opt-out analytics for early breakage warnings
   - Detects platform changes before users report issues

   #### 8. Graceful Degradation
   - Fallback interval if MutationObserver fails
   - Self-recovery from catastrophic failures

   ---

   ## 🚀 Installation

   ### Chrome
   - Extension will auto-update within 24 hours
   - Or force update: `chrome://extensions` → Details → Update

   ### Firefox
   - Extension will auto-update within 1 hour
   - Or force update: `about:addons` → Gear icon → Check for Updates

   ---

   ## 📖 Documentation

   - **Architecture:** [RESILIENCE_FRAMEWORK.md](./docs/RESILIENCE_FRAMEWORK.md)
   - **Patch Details:** [patches/README.md](./patches/README.md)

   ---

   ## 🙏 Credits

   **Kimi (Moonshot AI)** - 2M token context analysis delivered production-ready patches

   ---

   ## 🔗 Links

   - [Chrome Web Store](https://chrome.google.com/webstore/detail/dedobe-extractor)
   - [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/dedobe-extractor)
   - [Support Us](https://ko-fi.com/blackorchardlabs)
   ```
6. **Attach files:**
   - Build `DeDobe_Chrome_v1.1.0.zip` from src/
   - Build `DeDobe_Firefox_v1.1.0.xpi` from src/
7. **Set as latest release:** ✅
8. **Publish release**

**Checkpoint:**
- [ ] Release created on GitHub
- [ ] Release marked as "Latest"
- [ ] Download links work
- [ ] Release notes are accurate

---

### Step 5: Create Firefox Update Manifest 🦊

Create `updates.json` in repo root for Firefox GitHub update channel:

```json
{
  "addons": {
    "dedobe-extractor@blackorchard.local": {
      "updates": [
        {
          "version": "1.1.0",
          "update_link": "https://github.com/BlackOrchardLabs/de-dobe/releases/download/v1.1.0/DeDobe_Firefox_v1.1.0.xpi",
          "update_hash": "sha256:YOUR_HASH_HERE"
        }
      ]
    }
  }
}
```

Generate hash:
```bash
# Windows PowerShell
Get-FileHash -Algorithm SHA256 DeDobe_Firefox_v1.1.0.xpi

# Linux/Mac
shasum -a 256 DeDobe_Firefox_v1.1.0.xpi
```

Commit and push:
```bash
git add updates.json
git commit -m "Add Firefox update manifest for v1.1.0"
git push origin main
```

**Checkpoint:**
- [ ] updates.json created with correct hash
- [ ] Pushed to main
- [ ] Accessible at: `https://raw.githubusercontent.com/BlackOrchardLabs/de-dobe/main/updates.json`

---

### Step 6: Update Store Listings 🏪

#### Chrome Web Store

1. Go to [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click De:dobe
3. Click **"Package"** → **"Upload new package"**
4. Upload `DeDobe_Chrome_v1.1.0.zip`
5. Update **"Detailed description"** to include:
   ```
   🛡️ NEW in v1.1.0: Self-Healing Architecture

   De:dobe now features the Kimi Resilience Framework - preventing monthly
   breakage when LLM platforms update their interfaces. Includes Shadow DOM
   support, auto-repair manifest, and emergency update channel.
   ```
6. Save and submit for review

**Checkpoint:**
- [ ] New package uploaded
- [ ] Description updated
- [ ] Submitted for review
- [ ] Estimated review time: 1-3 days

#### Firefox Add-ons

1. Go to [Developer Hub](https://addons.mozilla.org/developers/)
2. Click De:dobe
3. Click **"Upload New Version"**
4. Upload `DeDobe_Firefox_v1.1.0.xpi`
5. Update **"Version Notes"** with release notes
6. Submit for review

**Checkpoint:**
- [ ] New version uploaded
- [ ] Version notes updated
- [ ] Submitted for review
- [ ] Estimated review time: 2-5 days

---

### Step 7: Monitor Telemetry 📊

**Setup:**
Configure telemetry endpoint at `https://telemetry.blackorchardlabs.com/dedobe`

**Monitor:**
- Export success rate by platform (ChatGPT, Claude, Gemini, Grok)
- Export size distribution
- Error rates
- Platform breakage alerts (40%+ traffic drop = DOM changed)

**Tools:**
- Simple HTTP logger (e.g., GoAccess, CloudWatch)
- Alert threshold: 40% traffic drop on any platform within 24 hours

**Checkpoint:**
- [ ] Telemetry endpoint configured
- [ ] Logging works
- [ ] Alerts configured
- [ ] Privacy policy updated (if needed)

---

### Step 8: Monitor User Feedback 💬

**Watch for:**
- Chrome Web Store reviews
- Firefox Add-ons reviews
- GitHub Issues
- Ko-fi messages

**Common issues to address:**
- "How do I opt out of telemetry?" → Add UI toggle in popup
- "Not working on [platform]" → Check telemetry, investigate DOM changes
- "Exports are slow" → Verify service worker offloading works

**Response time:** < 24 hours for critical issues

**Checkpoint:**
- [ ] Monitoring Chrome reviews
- [ ] Monitoring Firefox reviews
- [ ] Monitoring GitHub issues
- [ ] Response protocol established

---

### Step 9: Emergency Rollback (If Needed) ⚠️

**Trigger:** Critical bug discovered within 48 hours

**Action:**
```bash
# Revert to v2.0.0
git checkout main
git revert v1.1.0 --no-commit
git commit -m "Emergency rollback: revert v1.1.0 due to critical bug"
git tag -a v1.1.1 -m "Emergency rollback to v2.0.0 baseline"
git push origin main --tags

# Update store listings with v1.1.1 (identical to v2.0.0)
# Users will auto-downgrade via GitHub update channel
```

**Checkpoint:**
- [ ] Rollback executed within 2 hours of discovery
- [ ] Store listings updated
- [ ] Users notified via GitHub issue
- [ ] Postmortem scheduled

---

## Success Metrics

### Week 1
- [ ] 90%+ users updated to v1.1.0
- [ ] Zero critical bugs reported
- [ ] Telemetry shows successful exports across all platforms
- [ ] No platform breakage detected

### Month 1
- [ ] 100% user adoption
- [ ] At least 1 DOM change detected via telemetry
- [ ] Emergency fix deployed via GitHub channel (test)
- [ ] Zero monthly breakage incidents

### Quarter 1
- [ ] Competitors still breaking monthly (validation of advantage)
- [ ] De:dobe maintains 100% uptime
- [ ] Telemetry provides 48-hour advance warning of breakage
- [ ] GitHub update channel used for 2+ emergency fixes

---

## Communication Plan

### Announcement Channels
- [x] GitHub Release notes
- [ ] Ko-fi update post
- [ ] Reddit r/ChatGPT (if allowed)
- [ ] Twitter/X (if account exists)
- [ ] Discord/Slack (if community exists)

### Key Messages
1. **Self-healing architecture** - No more monthly breakage
2. **Competitor-proof** - Works when others fail
3. **Zero jank** - Faster, smoother exports
4. **Emergency updates** - Fixes in <1 hour, not days
5. **Opt-out telemetry** - Privacy-first, user-controlled

---

## Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Verify both Chrome + Firefox auto-updates work
- [ ] Monitor telemetry for first 24 hours
- [ ] Respond to any user reports

### Short-term (Week 1)
- [ ] Add telemetry opt-out UI toggle in popup
- [ ] Create user documentation for new features
- [ ] Test emergency update channel (simulate breakage)

### Long-term (Month 1)
- [ ] Analyze telemetry data for platform patterns
- [ ] Plan v1.2.0 features based on learnings
- [ ] Write case study: "How we made De:dobe unbreakable"

---

## Contacts & Resources

**GitHub Repo:** https://github.com/BlackOrchardLabs/de-dobe
**Chrome Dashboard:** https://chrome.google.com/webstore/devconsole
**Firefox Hub:** https://addons.mozilla.org/developers/
**Support:** https://ko-fi.com/blackorchardlabs
**Documentation:** `/docs/RESILIENCE_FRAMEWORK.md`

---

## Final Pre-Deployment Verification

Before executing this checklist, confirm:

- [x] All 8 patches created and tested
- [x] v1.1.0-resilience branch is clean
- [x] Documentation complete (RESILIENCE_FRAMEWORK.md, patches/README.md)
- [ ] Chrome has approved v2.0.0
- [ ] No outstanding merge conflicts
- [ ] Backup of current main branch created

**GO/NO-GO Decision:**
- **GO:** Chrome approval confirmed, all checks passed
- **NO-GO:** Any checkbox above is unchecked

---

**Status:** Ready to deploy on Chrome approval
**Owner:** Black Orchard Labs
**Created:** 2025-01-18
**Last Updated:** 2025-01-18
