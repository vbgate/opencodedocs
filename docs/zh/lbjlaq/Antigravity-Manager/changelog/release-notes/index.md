---
title: "发布说明: 版本演进 | Antigravity-Manager"
sidebarTitle: "3 分钟看懂版本更新"
subtitle: "版本演进：以 README 内嵌 Changelog 为准"
description: "了解 Antigravity-Manager 的版本演进方法。在 Settings 页确认版本并检查更新，通过 README Changelog 查看修复与提醒，用 /healthz 验证升级后可用性。"
tags:
  - "changelog"
  - "release"
  - "upgrade"
  - "troubleshooting"
prerequisite:
  - "start-installation"
  - "start-proxy-and-first-client"
order: 1
---

# 版本演进：以 README 内嵌 Changelog 为准

你准备升级 Antigravity Tools，最怕的不是“没更新到”，而是“更新了才发现有兼容性变化”。这页把 **Antigravity Tools Changelog（版本演进）** 的阅读方法讲清楚，让你能在升级前就判断：这次更新会影响你什么。

## 学完你能做什么

- 在 Settings 的 About 页快速确认当前版本、检查更新并拿到下载入口
- 在 README 的 Changelog 里只读对你有影响的版本段落（而不是从头翻到尾）
- 升级前先做一件事：确认是否有“需要你手动改配置/改模型映射”的提醒
- 升级后跑一遍最小验证（`/healthz`）确认代理还能用

## 什么是 Changelog？

**Changelog** 是按版本记录“这次改了什么”的清单。Antigravity Tools 把它直接写在 README 的“版本演进”里，每个版本都会标出日期与关键变更。升级前先看 Changelog，能减少踩到兼容性变化或回归问题的概率。

## 什么时候用这一页

- 你准备从旧版本升级到新版本，想先确认风险点
- 你遇到某个问题（比如 429/0 Token/Cloudflared），想确认它是否在近期版本被修复
- 你在团队里维护统一版本，需要给同事一个“按版本读变化”的方法

## 🎒 开始前的准备

::: warning 建议先把升级路径准备好
安装/升级方式很多（brew、Releases 手动下载、应用内更新）。如果你还没确定自己用哪条路，先看 **[安装与升级：桌面端最佳安装路径（brew / releases）](/zh/lbjlaq/Antigravity-Manager/start/installation/)**。
:::

## 跟我做

### 第 1 步：在 About 页确认你正在用的版本

**为什么**
Changelog 是按版本组织的。你先知道自己当前版本，才知道“要从哪里开始看”。

操作路径：**Settings** → **About**。

**你应该看到**：页面标题区显示应用名与版本号（例如 `v3.3.49`）。

### 第 2 步：点“检查更新”，拿到最新版本与下载入口

**为什么**
你需要先知道“最新版本号是什么”，再去 Changelog 里挑出中间跨过的版本段落。

在 About 页点击“检查更新”。

**你应该看到**：
- 若有更新：提示“new version available”，并出现一个下载按钮（打开 `download_url`）
- 若已是最新：提示“latest version”

### 第 3 步：去 README 的 Changelog 只看你跨过的版本

**为什么**
你只需要关心“从你当前版本到最新版本之间”的变化，其他历史版本可以先跳过。

打开 README，定位到 **“版本演进 (Changelog)”**，从最新版本开始往下看，直到看到你当前版本为止。

**你应该看到**：版本按 `vX.Y.Z (YYYY-MM-DD)` 的格式列出，并且每个版本都有分组说明（如核心修复/功能增强）。

### 第 4 步：升级后做一次最小验证

**为什么**
升级后的第一件事不是“跑复杂场景”，而是先确认代理还能正常启动、能被客户端探活。

按 **[启动本地反代并接入第一个客户端（/healthz + SDK 配置）](/zh/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** 的流程，至少验证一次 `GET /healthz`。

**你应该看到**：`/healthz` 返回成功（用于确认服务可用）。

## 近期版本摘要（摘自 README）

| 版本 | 日期 | 你需要关注的点 |
| --- | --- | --- |
| `v3.3.49` | 2026-01-22 | Thinking 中断与 0 Token 防御；移除 `gemini-2.5-flash-lite` 并提醒你手动替换自定义映射；语言/主题等设置即时生效；监控看板增强；OAuth 兼容性提升 |
| `v3.3.48` | 2026-01-21 | Windows 平台后台进程静默运行（修复控制台闪烁） |
| `v3.3.47` | 2026-01-21 | 图片生成参数映射增强（`size`/`quality`）；Cloudflared 隧道支持；修复合并冲突导致的启动失败；三层渐进式上下文压缩 |

::: tip 怎么快速判断“这次更新会不会影响我”
优先找这两类句子：

- **用户提醒/你需要修改**：比如明确点名某个默认模型被移除，要求你手动调整自定义映射
- **核心修复/兼容性修复**：比如 0 Token、429、Windows 闪烁、启动失败这类“会让你用不了”的问题
:::

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 内容 | 文件路径 | 行号 |
| --- | --- | --- |
| README 内嵌 Changelog（版本演进） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L324-L455) | 324-455 |
| About 页展示版本号与“检查更新”按钮 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L821-L954) | 821-954 |
| About 页“检查更新”命令返回结构 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L187-L215) | 187-215 |
| 自动更新通知（下载并重启） | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L33-L96) | 33-96 |
| 当前版本号（构建元数据） | [`package.json`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/package.json#L1-L4) | 1-4 |

</details>
