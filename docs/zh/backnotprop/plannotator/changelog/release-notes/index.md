---
title: "更新日志: 版本历史 | Plannotator"
sidebarTitle: "看看新功能"
subtitle: "更新日志: 版本历史 | Plannotator"
description: "了解 Plannotator 版本历史和新功能。查看主要更新、bug 修复和性能改进，掌握代码评审、图像标注、Obsidian 集成等新特性。"
tags:
  - "更新日志"
  - "版本历史"
  - "新功能"
  - "bug 修复"
order: 1
---

# 更新日志：Plannotator 版本历史和新功能

## 学完你能做什么

- ✅ 了解 Plannotator 的版本历史和新功能
- ✅ 掌握每个版本的主要更新和改进
- ✅ 了解 bug 修复和性能优化

---

## 最新版本

### v0.6.7 (2026-01-24)

**新增功能**：
- **Comment mode**：添加 Comment 模式，支持在计划中直接输入评论
- **Type-to-comment shortcut**：添加快捷键支持，直接输入评论内容

**改进**：
- 修复 OpenCode 插件的 sub-agent blocking 问题
- 修复 prompt injection 安全漏洞（CVE）
- 改进 OpenCode 中的 agent switching 智能检测

**源码参考**：
- Comment mode: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Type-to-comment: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**修复**：
- 修复 OpenCode plugin 的 CVE 安全漏洞
- 修复 sub-agent blocking 问题，防止 prompt injection
- 改进 agent switching 的智能检测逻辑

**源码参考**：
- OpenCode plugin: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Agent switching: [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**改进**：
- **Hook timeout 增加**：将 hook timeout 从默认值增加到 4 天，适应长时间运行的 AI 计划
- **修复 copy 功能**：保留 copy 操作中的 newlines
- **新增 Cmd+C 快捷键**：添加 Cmd+C 快捷键支持

**源码参考**：
- Hook timeout: [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Copy newlines: [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**新增功能**：
- **Cmd+Enter 快捷键**：支持使用 Cmd+Enter（Windows: Ctrl+Enter）提交审批或反馈

**改进**：
- 优化键盘操作体验

**源码参考**：
- Keyboard shortcuts: [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
  (Cmd+Enter 快捷键功能在各组件中直接实现)

---

### v0.6.3 (2026-01-05)

**修复**：
- 修复 skip-title-generation-prompt 问题

**源码参考**：
- Skip title: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**修复**：
- 修复 OpenCode 插件中 HTML 文件未包含在 npm 包中的问题

**源码参考**：
- OpenCode plugin build: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**新增功能**：
- **Bear 集成**：支持将批准的计划自动保存到 Bear 笔记应用

**改进**：
- 改进 Obsidian 集成的标签生成逻辑
- 优化 Obsidian vault 检测机制

**源码参考**：
- Bear 集成: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Obsidian 集成: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## 重大功能发布

### Code Review 功能 (2026-01)

**新增功能**：
- **代码评审工具**：运行 `/plannotator-review` 命令，可视化评审 Git diff
- **行级注释**：点击行号选择代码范围，添加 comment/suggestion/concern 类型的注释
- **多种 diff 视图**：支持切换 uncommitted/staged/last-commit/branch 等不同的 diff 类型
- **Agent 集成**：发送结构化反馈给 AI agent，支持自动响应

**使用方法**：
```bash
# 在项目目录中运行
/plannotator-review
```

**相关教程**：
- [代码评审基础](../../platforms/code-review-basics/)
- [添加代码注释](../../platforms/code-review-annotations/)
- [切换 Diff 视图](../../platforms/code-review-diff-types/)

**源码参考**：
- Code review server: [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Code review UI: [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Git diff 工具: [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### 图像标注功能 (2026-01)

**新增功能**：
- **上传图片**：在计划和代码评审中上传图片附件
- **标注工具**：提供画笔、箭头、圆形三种标注工具
- **可视化标注**：在图片上直接标注，增强评审反馈效果

**相关教程**：
- [添加图像标注](../../platforms/plan-review-images/)

**源码参考**：
- Image annotator: [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- Upload API: [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Obsidian 集成 (2025-12)

**新增功能**：
- **自动检测 vaults**：自动检测 Obsidian vault 配置文件路径
- **自动保存计划**：批准的计划自动保存到 Obsidian
- **生成 frontmatter**：自动包含 created、source、tags 等 frontmatter
- **智能标签提取**：从计划内容中提取关键词作为标签

**配置方式**：
无需额外配置，Plannotator 会自动检测 Obsidian 安装路径。

**相关教程**：
- [Obsidian 集成](../../advanced/obsidian-integration/)

**源码参考**：
- Obsidian 检测: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Obsidian 保存: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Frontmatter 生成: [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### URL 分享功能 (2025-11)

**新增功能**：
- **无后端分享**：将计划和注释压缩到 URL hash 中，无需后端服务器
- **一键分享**：点击 Export → Share as URL，生成分享链接
- **只读模式**：协作者打开 URL 后查看但无法提交决策

**技术实现**：
- 使用 Deflate 压缩算法
- Base64 编码 + URL 安全字符替换
- 支持最大 payload 约 7 个标签

**相关教程**：
- [URL 分享](../../advanced/url-sharing/)

**源码参考**：
- Sharing utils: [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Share hook: [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### 远程/Devcontainer 模式 (2025-10)

**新增功能**：
- **远程模式支持**：在 SSH、devcontainer、WSL 等远程环境中使用 Plannotator
- **固定端口**：通过环境变量设置固定端口
- **端口转发**：自动输出 URL 供用户手动打开浏览器
- **浏览器控制**：通过 `PLANNOTATOR_BROWSER` 环境变量控制是否打开浏览器

**环境变量**：
- `PLANNOTATOR_REMOTE=1`：启用远程模式
- `PLANNOTATOR_PORT=3000`：设置固定端口
- `PLANNOTATOR_BROWSER=disabled`：禁用自动打开浏览器

**相关教程**：
- [远程/Devcontainer 模式](../../advanced/remote-mode/)
- [环境变量配置](../../advanced/environment-variables/)

**源码参考**：
- Remote mode: [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Browser control: [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## 版本兼容性

| Plannotator 版本 | Claude Code | OpenCode | Bun 最低版本 |
|--- | --- | --- | ---|
| v0.6.x           | 2.1.7+      | 1.0+     | 1.0+         |
| v0.5.x           | 2.1.0+      | 0.9+     | 0.7+         |

**升级建议**：
- 保持 Plannotator 为最新版本，以获得最新功能和安全修复
- Claude Code 和 OpenCode 也应保持最新版本

---

## 许可证变更

**当前版本（v0.6.7+）**：Business Source License 1.1 (BSL-1.1)

**许可证详情**：
- 允许：个人使用、内部商业使用
- 限制：提供托管服务、SaaS 产品
- 详情见 [LICENSE](https://github.com/backnotprop/plannotator/blob/main/LICENSE)

---

## 反馈与支持

**报告问题**：
- GitHub Issues: https://github.com/backnotprop/plannotator/issues

**功能建议**：
- 在 GitHub Issues 中提交 feature request

**安全漏洞**：
- 请通过私密渠道报告安全漏洞

---

## 下一课预告

> 你已经了解了 Plannotator 的版本历史和新功能。
>
> 接下来可以：
> - 返回 [快速开始](../../start/getting-started/) 学习如何安装和使用
> - 查看 [常见问题](../../faq/common-problems/) 解决使用中的问题
> - 阅读 [API 参考](../../appendix/api-reference/) 了解所有 API 端点
