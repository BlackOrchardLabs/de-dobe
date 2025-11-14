# Contributing to De:dobe

First off, thank you for considering contributing to De:dobe. Liberation technology thrives on collaboration.

## Philosophy

De:dobe exists to give people ownership of their AI conversations. When contributing, keep these principles in mind:

1. **Privacy first** - No tracking, no analytics, no data collection
2. **No paywalls** - All features remain free forever
3. **Accessibility** - Make it work for everyone
4. **Simplicity** - Straightforward UX, minimal complexity
5. **Liberation** - Your data belongs to you

## How You Can Help

### Code Contributions

**v1.0 (Current Focus):**
- Multiple export formats (Plain Text, JSON)
- Settings panel implementation
- Error handling improvements
- Cross-browser testing
- Accessibility enhancements

**v2.0 (Future):**
- DOM structure research for ChatGPT, Claude, DeepSeek, Gemini
- Multi-platform conversation extraction
- Universal export architecture

### Non-Code Contributions

- **Testing:** Try the extension on different browsers, OS versions, and edge cases
- **Documentation:** Improve README, add usage examples, create tutorials
- **Translations:** Help make De:dobe available in multiple languages
- **Design:** Purple brain icon iterations, UI/UX improvements
- **Research:** Document DOM structures of target platforms for v2.0

## Getting Started

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/de-dobe.git
   cd de-dobe
   ```

3. Load the extension in Firefox:
   - Open `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select `manifest.json`

4. Make your changes and test thoroughly

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
   - Follow existing code style
   - Keep it simple and readable
   - Comment complex logic
   - Test thoroughly

3. Commit your changes:
   ```bash
   git commit -m "Add: brief description of your changes"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request

### Pull Request Guidelines

**Good PR title examples:**
- `Add: JSON export format support`
- `Fix: Export fails on very long conversations`
- `Improve: Error handling for network issues`
- `Docs: Add Firefox installation guide`

**In your PR description, include:**
- What does this change do?
- Why is it needed?
- How did you test it?
- Any breaking changes or migration notes?

**Before submitting:**
- [ ] Code works in Firefox (primary target)
- [ ] No console errors
- [ ] Follows existing code style
- [ ] Comments added for complex logic
- [ ] Tested with actual Grok conversations

## Code Style

We keep it simple:

- **JavaScript:** Modern ES6+, no frameworks
- **Formatting:** 2 spaces for indentation
- **Naming:** Clear, descriptive variable/function names
- **Comments:** Explain the "why", not the "what"

Example:
```javascript
// Good
function exportConversation() {
  // Grok loads messages dynamically, so we need to query multiple selectors
  const selectors = ['[role="article"]', '[class*="message"]'];
  // ... rest of code
}

// Avoid
function exp() { // What does this do?
  const s = ['[role="article"]']; // No context provided
}
```

## Testing

**Manual testing checklist:**
- [ ] Extension loads without errors
- [ ] Icon appears on Grok pages
- [ ] Export button triggers download
- [ ] Downloaded file contains full conversation
- [ ] Formatting is clean and readable
- [ ] Works on both grok.com and x.com/i/grok
- [ ] No console errors during operation

**Test with:**
- Short conversations (< 10 messages)
- Medium conversations (10-50 messages)
- Long conversations (> 50 messages)
- Conversations with code blocks, images, formatting

## Reporting Bugs

**Before submitting a bug report:**
1. Check existing issues to avoid duplicates
2. Test in a clean Firefox profile (disable other extensions)
3. Try the latest version of the extension

**Bug reports should include:**
- **Browser:** Firefox version, OS
- **Steps to reproduce:** Detailed, step-by-step
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happens
- **Console errors:** Open F12, copy any errors
- **Screenshots:** If relevant

## Feature Requests

We love hearing ideas! Before requesting:

1. Check existing issues and discussions
2. Consider if it fits the De:dobe philosophy
3. Think about how it serves v1.0 or v2.0 goals

**Good feature requests include:**
- **Use case:** Why is this needed?
- **Proposed solution:** How might it work?
- **Alternatives considered:** Other approaches?
- **Priority:** Nice-to-have or critical?

## Community Standards

- Be kind and respectful
- Welcome newcomers
- Focus on ideas, not people
- Disagree constructively
- Help others learn and grow

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for full guidelines.

## Questions?

- **General questions:** GitHub Discussions
- **Bug reports:** GitHub Issues
- **Feature ideas:** GitHub Discussions
- **Quick questions:** Comment on relevant issues/PRs

## Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Eternal gratitude from everyone who uses De:dobe

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping build liberation technology.

**Fuck paywalls. Build the ladder.**
