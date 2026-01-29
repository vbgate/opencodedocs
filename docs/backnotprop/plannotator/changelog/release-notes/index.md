---
title: "Version History: Updates & Fixes | Plannotator"
sidebarTitle: "Changelog"
subtitle: "Plannotator Version History & New Features"
description: "Learn about version updates, bug fixes, and new features including code review, image annotation, integrations, and remote mode support in each release."
tags:
  - "Changelog"
  - "Version History"
  - "New Features"
  - "Bug Fixes"
order: 1
---

# Changelog: Plannotator Version History & New Features

## What You'll Learn

- ✅ Understand Plannotator's version history and new features
- ✅ Master major updates and improvements in each release
- ✅ Learn about bug fixes and performance optimizations

---

## Latest Versions

### v0.6.7 (2026-01-24)

**New Features**:
- **Comment mode**: Added Comment mode, supporting direct comment input in plans
- **Type-to-comment shortcut**: Added shortcut support for direct comment input

**Improvements**:
- Fixed OpenCode plugin sub-agent blocking issue
- Fixed prompt injection security vulnerability (CVE)
- Improved agent switching intelligent detection in OpenCode

**Source Reference**:
- Comment mode: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Type-to-comment: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**Fixes**:
- Fixed CVE security vulnerability in OpenCode plugin
- Fixed sub-agent blocking issue to prevent prompt injection
- Improved agent switching intelligent detection logic

**Source Reference**:
- OpenCode plugin: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Agent switching: [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**Improvements**:
- **Hook timeout increased**: Increased hook timeout from default to 4 days to accommodate long-running AI plans
- **Fixed copy functionality**: Preserve newlines in copy operations
- **Added Cmd+C shortcut**: Added Cmd+C shortcut support

**Source Reference**:
- Hook timeout: [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Copy newlines: [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**New Features**:
- **Cmd+Enter shortcut**: Support using Cmd+Enter (Windows: Ctrl+Enter) to submit approval or feedback

**Improvements**:
- Optimized keyboard operation experience

**Source Reference**:
- Keyboard shortcuts: [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
  (Cmd+Enter shortcut functionality implemented directly in each component)

---

### v0.6.3 (2026-01-05)

**Fixes**:
- Fixed skip-title-generation-prompt issue

**Source Reference**:
- Skip title: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**Fixes**:
- Fixed issue where HTML files were not included in npm package for OpenCode plugin

**Source Reference**:
- OpenCode plugin build: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**New Features**:
- **Bear integration**: Support automatic saving of approved plans to Bear note app

**Improvements**:
- Improved tag generation logic for Obsidian integration
- Optimized Obsidian vault detection mechanism

**Source Reference**:
- Bear integration: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Obsidian integration: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## Major Feature Releases

### Code Review Feature (2026-01)

**New Features**:
- **Code review tool**: Run `/plannotator-review` command to visually review Git diffs
- **Line-level comments**: Click line numbers to select code ranges and add comment/suggestion/concern type annotations
- **Multiple diff views**: Support switching between uncommitted/staged/last-commit/branch and other diff types
- **Agent integration**: Send structured feedback to AI agent, supporting automatic responses

**How to Use**:
```bash
# Run in project directory
/plannotator-review
```

**Related Tutorials**:
- [Code Review Basics](../../platforms/code-review-basics/)
- [Adding Code Annotations](../../platforms/code-review-annotations/)
- [Switching Diff Views](../../platforms/code-review-diff-types/)

**Source Reference**:
- Code review server: [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Code review UI: [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Git diff tools: [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### Image Annotation Feature (2026-01)

**New Features**:
- **Upload images**: Upload image attachments in plans and code reviews
- **Annotation tools**: Provide three annotation tools: brush, arrow, and circle
- **Visual annotation**: Annotate directly on images to enhance review feedback

**Related Tutorials**:
- [Adding Image Annotations](../../platforms/plan-review-images/)

**Source Reference**:
- Image annotator: [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- Upload API: [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Obsidian Integration (2025-12)

**New Features**:
- **Auto-detect vaults**: Automatically detect Obsidian vault configuration file paths
- **Auto-save plans**: Approved plans automatically save to Obsidian
- **Generate frontmatter**: Automatically include frontmatter like created, source, tags
- **Smart tag extraction**: Extract keywords from plan content as tags

**Configuration**:
No additional configuration needed. Plannotator automatically detects Obsidian installation path.

**Related Tutorials**:
- [Obsidian Integration](../../advanced/obsidian-integration/)

**Source Reference**:
- Obsidian detection: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Obsidian save: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Frontmatter generation: [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### URL Sharing Feature (2025-11)

**New Features**:
- **Backend-free sharing**: Compress plans and annotations into URL hash, no backend server needed
- **One-click sharing**: Click Export → Share as URL to generate sharing link
- **Read-only mode**: Collaborators can view but cannot submit decisions when opening URL

**Technical Implementation**:
- Uses Deflate compression algorithm
- Base64 encoding + URL-safe character replacement
- Supports maximum payload of approximately 7 tags

**Related Tutorials**:
- [URL Sharing](../../advanced/url-sharing/)

**Source Reference**:
- Sharing utils: [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Share hook: [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### Remote/Devcontainer Mode (2025-10)

**New Features**:
- **Remote mode support**: Use Plannotator in SSH, devcontainer, WSL, and other remote environments
- **Fixed port**: Set fixed port via environment variable
- **Port forwarding**: Automatically output URL for users to manually open in browser
- **Browser control**: Control whether to open browser via `PLANNOTATOR_BROWSER` environment variable

**Environment Variables**:
- `PLANNOTATOR_REMOTE=1`: Enable remote mode
- `PLANNOTATOR_PORT=3000`: Set fixed port
- `PLANNOTATOR_BROWSER=disabled`: Disable automatic browser opening

**Related Tutorials**:
- [Remote/Devcontainer Mode](../../advanced/remote-mode/)
- [Environment Variables Configuration](../../advanced/environment-variables/)

**Source Reference**:
- Remote mode: [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Browser control: [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## Version Compatibility

| Plannotator Version | Claude Code | OpenCode | Minimum Bun Version |
|--- | --- | --- | ---|
| v0.6.x              | 2.1.7+      | 1.0+     | 1.0+                |
| v0.5.x              | 2.1.0+      | 0.9+     | 0.7+                |

**Upgrade Recommendations**:
- Keep Plannotator updated to latest version for new features and security fixes
- Claude Code and OpenCode should also be kept at latest versions

---

## License Changes

**Current Version (v0.6.7+)**: Business Source License 1.1 (BSL-1.1)

**License Details**:
- Allowed: Personal use, internal commercial use
- Restricted: Providing hosting services, SaaS products
- See [LICENSE](https://github.com/backnotprop/plannotator/blob/main/LICENSE) for details

---

## Feedback & Support

**Report Issues**:
- GitHub Issues: https://github.com/backnotprop/plannotator/issues

**Feature Requests**:
- Submit feature requests in GitHub Issues

**Security Vulnerabilities**:
- Please report security vulnerabilities through private channels

---

## Next Up

> You've learned about Plannotator's version history and new features.
>
> Next steps:
> - Return to [Quick Start](../../start/getting-started/) to learn how to install and use
> - Check [Common Problems](../../faq/common-problems/) to resolve usage issues
> - Read [API Reference](../../appendix/api-reference/) to learn about all API endpoints
