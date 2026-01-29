---
title: "URL Sharing: Serverless Collaboration | Plannotator"
subtitle: "URL Sharing: Serverless Plan Collaboration"
sidebarTitle: "URL Sharing"
description: "Learn serverless team collaboration via shareable URLs with deflate compression and Base64 encoding in Plannotator."
tags:
  - "URL Sharing"
  - "Team Collaboration"
  - "Serverless"
  - "Deflate Compression"
  - "Base64 Encoding"
  - "Security"
prerequisite:
  - "start-getting-started"
  - "platforms-plan-review-basics"
order: 1
---

# URL Sharing: Serverless Plan Collaboration

## What You'll Learn

- ✅ Share plans and annotations via URL without login or server deployment
- ✅ Understand how deflate compression and Base64 encoding embed data in URL hash
- ✅ Distinguish between sharing mode (read-only) and local mode (editable)
- ✅ Configure `PLANNOTATOR_SHARE` environment variable to control sharing
- ✅ Handle URL length limits and sharing failures

## Your Current Challenges

**Challenge 1**: Want team members to review AI-generated plans but lack a collaboration platform.

**Challenge 2**: Sharing review content via screenshots or copied text prevents collaborators from seeing your annotations directly.

**Challenge 3**: Deploying online collaboration servers is costly, or company security policies prohibit it.

**Challenge 4**: Need a quick and simple sharing method but unsure how to ensure data privacy.

**Plannotator Helps You**:
- No backend server required—all data compressed in the URL
- Shareable links contain complete plans and annotations for collaborators to view
- Data never leaves local devices—privacy secured
- Generated URLs can be copied to any communication tool

## When to Use This Feature

**Use Cases**:
- Need team members to review AI-generated implementation plans
- Want to share code review results with colleagues
- Need to save review content to notes (combined with Obsidian/Bear integration)
- Quickly get feedback on plans from others

**Not Suitable For**:
- Real-time collaborative editing (Plannotator sharing is read-only)
- Plan content exceeds URL length limit (typically thousands of lines)
- Sharing sensitive information (URLs themselves are not encrypted)

::: warning Security Note
Shared URLs contain complete plans and annotations. Never share content with sensitive information (such as API keys, passwords, etc.). Anyone with the shared URL can access it, and it does not expire automatically.
:::

## Core Concepts

### What is URL Sharing

**URL Sharing** is Plannotator's serverless collaboration method that achieves sharing without a server by compressing plans and annotations into the URL hash.

::: info Why "Serverless"?
Traditional collaboration requires backend servers to store plans and annotations, accessed via IDs or tokens. Plannotator's URL sharing doesn't depend on any backend—all data is in the URL, and recipients simply open the link to parse the content. This ensures privacy (no data upload) and simplicity (no server deployment).
:::

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│  User A (Sharer)                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Review plan, add annotations                        │
│     ┌──────────────────────┐                           │
│     │ Plan: Implementation │                           │
│     │ Annotations: [       │                           │
│     │   {type: 'REPLACE'}, │                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│              │                                         │
│              ▼                                         │
│  2. Click Export → Share                              │
│              │                                         │
│              ▼                                         │
│  3. Compress data                                      │
│     JSON → deflate → Base64 → URL-safe characters      │
│     ↓                                                │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Copy URL
                          ▼
┌─────────────────────────────────────────────────────────┐
│  User B (Recipient)                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Open shared URL                                    │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│              │                                         │
│              ▼                                         │
│  2. Browser parses hash                               │
│     URL-safe chars → Base64 decode → deflate → JSON     │
│              │                                         │
│              ▼                                         │
│  3. Restore plan and annotations                         │
│     ┌──────────────────────┐                           │
│     │ Plan: Implementation │  ✅ Read-only mode       │
│     │ Annotations: [       │  (Cannot submit decisions)│
│     │   {type: 'REPLACE'}, │                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Compression Algorithm Explained

**Step 1: JSON Serialization**
```json
{
  "p": "# Plan\n\nStep 1...",
  "a": [
    ["R", "old text", "new text", null, null],
    ["C", "context", "comment text", null, null]
  ],
  "g": ["image1.png", "image2.png"]
}
```

**Step 2: Deflate-raw Compression**
- Uses native `CompressionStream('deflate-raw')` API
- Typical compression ratio: 60-80% (depends on text repetition, not source-defined)
- Source location: `packages/ui/utils/sharing.ts:34`

**Step 3: Base64 Encoding**
```typescript
const base64 = btoa(String.fromCharCode(...compressed));
```

**Step 4: URL-safe Character Replacement**
```typescript
base64
  .replace(/\+/g, '-')   // + → -
  .replace(/\//g, '_')   // / → _
  .replace(/=/g, '');    // = → '' (remove padding)
```

::: tip Why Replace Special Characters?
Certain characters have special meanings in URLs (e.g., `+` represents space, `/` is path separator). Base64 encoding may include these characters, causing URL parsing errors. After replacing with `-` and `_`, the URL becomes safe and copyable.
:::

### Annotation Format Optimization

For compression efficiency, Plannotator uses a compact annotation format (`ShareableAnnotation`):

| Original Annotation | Compact Format | Description |
| ------------------- | -------------- | ----------- |
| `{type: 'DELETION', originalText: '...', text: undefined, ...}` | `['D', 'old text', null, images?]` | D = Deletion, null means no text |
| `{type: 'REPLACEMENT', originalText: '...', text: 'new...', ...}` | `['R', 'old text', 'new text', null, images?]` | R = Replacement |
| `{type: 'COMMENT', originalText: '...', text: 'comment...', ...}` | `['C', 'old text', 'comment text', null, images?]` | C = Comment |
| `{type: 'INSERTION', originalText: '...', text: 'new...', ...}` | `['I', 'context', 'new text', null, images?]` | I = Insertion |
| `{type: 'GLOBAL_COMMENT', text: '...', ...}` | `['G', 'comment text', null, images?]` | G = Global comment |

Field order is fixed, key names omitted, significantly reducing data size. Source location: `packages/ui/utils/sharing.ts:76`

### Shared URL Structure

```
https://share.plannotator.ai/#<compressed_data>
                            ↑
                        hash part
```

- **Base domain**: `share.plannotator.ai` (independent sharing page)
- **Hash separator**: `#` (not sent to server, parsed entirely by frontend)
- **Compressed data**: Base64url-encoded compressed JSON

## 🎒 Prerequisites

**Requirements**:
- ✅ Completed [Plan Review Basics](../../platforms/plan-review-basics/), understand how to add annotations
- ✅ Completed [Plan Annotation Tutorial](../../platforms/plan-review-annotations/), understand annotation types
- ✅ Browser supports `CompressionStream` API (modern browsers all support it)

**Check if sharing is enabled**:
```bash
# Enabled by default
echo $PLANNOTATOR_SHARE

# To disable sharing (e.g., for enterprise security policies)
export PLANNOTATOR_SHARE=disabled
```

::: info Environment Variable
`PLANNOTATOR_SHARE` controls sharing feature status:
- **Not set or not "disabled"**: Sharing enabled
- **Set to "disabled"**: Sharing disabled (Export Modal only shows Raw Diff tab)

Source location: `apps/hook/server/index.ts:44`, `apps/opencode-plugin/index.ts:50`
:::

**Check browser compatibility**:
```bash
# Run in browser console
const stream = new CompressionStream('deflate-raw');
console.log('CompressionStream supported');
```

If output shows `CompressionStream supported`, your browser supports it. Modern browsers (Chrome 80+, Firefox 113+, Safari 16.4+) all support it.

## Follow Along

### Step 1: Complete Plan Review

**Why**
Before sharing, you need to complete the review, including adding annotations.

**Actions**:
1. Trigger plan review in Claude Code or OpenCode
2. Review the plan content, select text that needs modification
3. Add annotations (deletion, replacement, comment, etc.)
4. (Optional) Upload image attachments

**You should see**:
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                                              │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│                    └─────────────────────┘               │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [Approve] [Request Changes] [Export]                   │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Open Export Modal

**Why**
Export Modal provides the entry point for generating shareable URLs.

**Actions**:
1. Click the **Export** button in the top-right corner
2. Wait for the Export Modal to open

**You should see**:
```
┌─────────────────────────────────────────────────────────────┐
│  Export                                     ×             │
│  1 annotation                          Share | Raw Diff   │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                              [Copy] │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                           │
│  This URL contains full plan and all annotations.          │
│  Anyone with this link can view and add to your annotations.│
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

::: tip URL Size Indicator
The bottom-right corner displays the URL size in bytes (e.g., 3.2 KB). If the URL is too long (exceeds 8 KB), consider reducing the number of annotations or image attachments.
:::

### Step 3: Copy Shareable URL

**Why**
After copying the URL, you can paste it into any communication tool (Slack, Email, WeChat, etc.).

**Actions**:
1. Click the **Copy** button
2. Wait for the button to change to **Copied!**
3. The URL is now copied to your clipboard

**You should see**:
```
┌─────────────────────────────────────────────────────────────┐
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                    ✓ Copied         │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

::: tip Auto-Select
Clicking the URL input field automatically selects all content, making manual copying easier (if you're not using the Copy button).
:::

### Step 4: Share URL with Collaborators

**Why**
Collaborators can view the plan and annotations by opening the URL.

**Actions**:
1. Paste the URL into a communication tool (Slack, Email, etc.)
2. Send to team members

**Example Message**:
```
Hi @team,

Please help review this implementation plan:
https://share.plannotator.ai/#eJyrVkrLz1...

I added a replacement annotation in Phase 2, suggesting JWT is too complex.

Please provide your feedback. Thanks!
```

### Step 5: Collaborator Opens Shared URL (Recipient Side)

**Why**
Collaborators need to open the URL in a browser to view the content.

**Actions** (performed by collaborator):
1. Click the shared URL
2. Wait for the page to load

**You should see** (collaborator's perspective):
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                               Read-only     │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│  │                  └─────────────────────┘               │
│  │ This annotation was shared by [Your Name]             │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [View Only Mode - Approve and Deny disabled]            │
└─────────────────────────────────────────────────────────────┘
```

::: warning Read-Only Mode
When a shared URL is opened, the top-right corner shows a "Read-only" label, and Approve/Deny buttons are disabled. Collaborators can view the plan and annotations but cannot submit decisions.
:::

::: info Decompression Process
When a collaborator opens the URL, the browser automatically performs these steps (triggered by the `useSharing` Hook):
1. Extract compressed data from `window.location.hash`
2. Reverse: Base64 decode → deflate decompress → JSON parse
3. Restore plan and annotations
4. Clear URL hash (to avoid reloading on refresh)

Source location: `packages/ui/hooks/useSharing.ts:67`
:::

### Checkpoint ✅

**Verify shared URL is valid**:
1. Copy the shared URL
2. Open in a new tab or incognito mode
3. Confirm the same plan and annotations are displayed

**Verify read-only mode**:
1. Collaborator opens the shared URL
2. Check for "Read-only" label in the top-right corner
3. Confirm Approve and Deny buttons are disabled

**Verify URL length**:
1. Check the URL size in the Export Modal
2. Confirm it doesn't exceed 8 KB (if it does, consider reducing annotations)

## Troubleshooting

### Issue 1: URL Share Button Not Visible

**Symptom**: Export Modal doesn't show the Share tab, only Raw Diff.

**Cause**: `PLANNOTATOR_SHARE` environment variable is set to "disabled".

**Solution**:
```bash
# Check current value
echo $PLANNOTATOR_SHARE

# Remove or set to another value
unset PLANNOTATOR_SHARE
# or
export PLANNOTATOR_SHARE=enabled
```

Source location: `apps/hook/server/index.ts:44`

### Issue 2: Shared URL Opens to Blank Page

**Symptom**: Collaborator opens the URL, but page shows no content.

**Cause**: URL hash was lost or truncated during copying.

**Solution**:
1. Ensure you copy the complete URL (including `#` and all characters after it)
2. Don't use short link services (they might truncate the hash)
3. Use the Copy button in Export Modal instead of manual copying

::: tip URL Hash Length
The hash part of a shared URL typically contains thousands of characters, making manual copying prone to omissions. Recommend using the Copy button or copy → paste twice to verify completeness.
:::

### Issue 3: URL Too Long to Send

**Symptom**: URL exceeds character limits of communication tools (e.g., WeChat, Slack).

**Cause**: Plan content is too long or there are too many annotations.

**Solution**:
1. Delete unnecessary annotations
2. Reduce image attachments
3. Consider using Raw Diff export and save as a file
4. Use code review feature (diff mode has higher compression ratio)

### Issue 4: Collaborator Cannot See My Images

**Symptom**: Shared URL contains image paths, but collaborator sees "Image not found".

**Cause**: Images are saved in local `/tmp/plannotator/` directory, inaccessible to collaborators.

**Solution**:
- Plannotator's URL sharing doesn't support cross-device image access
- Recommend using Obsidian integration—images saved to vault can be shared
- Alternatively, take screenshots and embed in annotations (text description)

Source location: `packages/server/index.ts:163` (image save path)

### Issue 5: URL Not Updated After Modifying Annotations

**Symptom**: After adding new annotations, the URL in Export Modal hasn't changed.

**Cause**: `shareUrl` state not automatically refreshed (rare case, usually a React state update issue).

**Solution**:
1. Close Export Modal
2. Reopen Export Modal
3. URL should automatically update to latest content

Source location: `packages/ui/hooks/useSharing.ts:128` (`refreshShareUrl` function)

## Summary

**URL Sharing** allows you to share plans and annotations without a backend server:

- ✅ **Serverless**: Data compressed in URL hash, no server dependency
- ✅ **Privacy**: Data never uploaded, only transmitted between you and collaborators
- ✅ **Simple & Efficient**: One-click URL generation, copy-paste to share
- ✅ **Read-Only Mode**: Collaborators can view and add annotations but cannot submit decisions

**Technical Principles**:
1. **Deflate-raw Compression**: Compresses JSON data by ~60-80%
2. **Base64 Encoding**: Converts binary data to text
3. **URL-safe Character Replacement**: `+` → `-`, `/` → `_`, `=` → `''`
4. **Hash Parsing**: Frontend automatically decompresses and restores content

**Configuration Options**:
- `PLANNOTATOR_SHARE=disabled`: Disable sharing feature
- Default enabled: Sharing feature available

## Next Lesson Preview

> In the next lesson, we'll learn **[Obsidian Integration](../obsidian-integration/)**.
>
> You'll learn:
> - How to configure Obsidian integration to automatically save plans to vault
> - Understand frontmatter and tag generation mechanisms
> - Use backlinks to build knowledge graphs

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function | File Path | Lines |
| --- | --- | --- |
| Compress data (deflate + Base64) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L30-L48) | 30-48 |
| Decompress data | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L53-L71) | 53-71 |
| Convert annotation format (compact) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| Restore annotation format | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| Generate share URL | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L162-L175) | 162-175 |
| Parse URL hash | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L181-L194) | 181-194 |
| URL size formatting | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L199-L205) | 199-205 |
| URL sharing Hook | [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts#L45-L155) | 45-155 |
| Export Modal UI | [`packages/ui/components/ExportModal.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ExportModal.tsx#L1-L196) | 1-196 |
| Sharing toggle config (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44) | 44 |
| Sharing toggle config (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L50) | 50 |

**Key Constants**:
- `SHARE_BASE_URL = 'https://share.plannotator.ai'`: Sharing page base domain

**Key Functions**:
- `compress(payload: SharePayload): Promise<string>`: Compress payload to base64url string
- `decompress(b64: string): Promise<SharePayload>`: Decompress base64url string to payload
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`: Convert full annotations to compact format
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`: Restore compact format to full annotations
- `generateShareUrl(markdown, annotations, attachments): Promise<string>`: Generate complete share URL
- `parseShareHash(): Promise<SharePayload | null>`: Parse current URL's hash

**Data Types**:
```typescript
interface SharePayload {
  p: string;  // plan markdown
  a: ShareableAnnotation[];
  g?: string[];  // global attachments
}

type ShareableAnnotation =
  | ['D', string, string | null, string[]?]  // Deletion
  | ['R', string, string, string | null, string[]?]  // Replacement
  | ['C', string, string, string | null, string[]?]  // Comment
  | ['I', string, string, string | null, string[]?]  // Insertion
  | ['G', string, string | null, string[]?];  // Global Comment
```

</details>
