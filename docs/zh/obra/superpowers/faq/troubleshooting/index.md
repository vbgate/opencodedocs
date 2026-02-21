---
title: "Superpowers 故障排除指南：Claude Code、OpenCode、Codex 常见问题解决 | 教程"
sidebarTitle: "故障排除指南"
subtitle: "Superpowers 常见问题与故障排除"
description: "学习如何排查和解决 Superpowers 的常见问题。本指南涵盖 Claude Code、OpenCode、Codex 三大平台的故障排除方法，包括插件加载失败、技能未找到、Windows 模块错误、Bootstrap 未出现等问题的快速解决方案，帮助你确保 AI 编码代理技能系统正常运行，提升开发效率。"
tags:
  - "故障排除"
  - "FAQ"
  - "常见问题"
prerequisite: []
order: 240
---

# Superpowers 常见问题与故障排除

::: info
本指南汇集了 Superpowers 在三大平台（Claude Code、OpenCode、Codex）上的常见问题及解决方案。如果你遇到的问题未在此处，请访问 [GitHub Issues](https://github.com/obra/superpowers/issues) 提交反馈。
:::

## 你现在可能遇到的问题

- 插件安装后不生效，命令无法使用
- 技能列表为空，AI 代理无法调用工作流
- Windows 平台上报错"模块未找到"
- Bootstrap 提示不出现，技能系统未初始化
- CLI 脚本无法执行，权限被拒绝

## OpenCode 平台常见问题

### 插件未加载

**症状**：OpenCode 启动后，Superpowers 技能不可用，`/help` 命令看不到技能相关选项。

**排查步骤**：

1. **检查插件文件是否存在**
   ```bash
   ls ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js
   ```

2. **检查符号链接是否正确**
   - **macOS/Linux**:
     ```bash
     ls -l ~/.config/opencode/plugins/
     # 应该看到 superpowers.js -> ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js
     ```
   - **Windows**:
     ```powershell
     dir /AL %USERPROFILE%\.config\opencode\plugins
     # 应该看到 superpowers.js 的目录链接
     ```

3. **查看 OpenCode 日志**
   ```bash
   opencode run "test" --print-logs --log-level DEBUG
   ```

4. **在日志中查找插件加载消息**
   - 成功加载会显示类似 `Plugin loaded: superpowers` 的消息
   - 如果有错误，会显示具体的失败原因

**你应该看到**：插件成功加载，技能列表可用的日志消息

---

### 技能未找到

**症状**：使用 Skill tool 时提示技能不存在，或技能列表为空。

**排查步骤**：

1. **验证技能符号链接**
   ```bash
   ls -l ~/.config/opencode/skills/superpowers
   # 应该指向 superpowers/skills/ 目录
   ```

2. **使用 OpenCode 的 skill 工具列出可用技能**
   - 如果技能正确加载，应该能看到所有 14 个 Superpowers 技能
   - 包括：brainstorming、writing-plans、test-driven-development 等

3. **检查技能文件结构**
   ```bash
   ls ~/.config/opencode/skills/superpowers/
   # 应该看到 brainstorming、writing-plans、test-driven-development 等目录
   ```

4. **验证每个技能的 SKILL.md 文件**
   - 每个技能目录下必须包含 `SKILL.md` 文件
   - SKILL.md 文件必须有有效的 YAML frontmatter

**你应该看到**：完整的技能列表，每个技能目录都有 SKILL.md 文件

---

### Windows：模块未找到错误

**症状**：在 Windows 上使用 OpenCode 时，报错 `Cannot find module` 或类似错误。

**原因**：Git Bash 的 `ln -sf` 命令在 Windows 上会复制文件而不是创建符号链接，导致插件无法正确加载。

**解决方案**：

使用 Windows 的目录连接（directory junction）代替符号链接。参考 [OpenCode 安装指南](../../platforms/opencode/) 中的 Windows 专用步骤，使用 `mklink /J` 命令创建目录连接。

**你应该看到**：插件和技能目录正确连接到 Superpowers 源码目录

---

### Bootstrap 未出现

**症状**：OpenCode 启动时没有显示 Superpowers 的引导提示，技能系统未初始化。

**排查步骤**：

1. **验证 using-superpowers 技能是否存在**
   ```bash
   ls ~/.config/opencode/superpowers/skills/using-superpowers/SKILL.md
   ```

2. **检查 OpenCode 版本是否支持 transform hook**
   - Superpowers 使用 `experimental.chat.system.transform` hook
   - 确保你的 OpenCode 版本支持此实验性功能
   - 查看 [OpenCode 更新日志](https://github.com/OpenCode/OpenCode/releases) 获取最新版本

3. **重启 OpenCode**
   - 插件更改后，必须完全重启 OpenCode 才能生效
   - 关闭 OpenCode，重新启动

**你应该看到**：OpenCode 启动时显示 Superpowers 的引导信息，技能系统已加载

---

## Codex 平台常见问题

### 技能未找到

**症状**：使用 Codex 的 `skill` 工具时提示技能不存在，或技能列表为空。

**排查步骤**：

1. **验证安装路径**
   ```bash
   ls ~/.codex/superpowers/skills
   # 应该看到 brainstorming、writing-plans、test-driven-development 等目录
   ```

2. **检查 CLI 工具是否正常工作**
   ```bash
   ~/.codex/superpowers/.codex/superpowers-codex find-skills
   # 应该输出 JSON 格式的技能列表
   ```

3. **验证技能文件**
   - 每个技能目录下必须包含 `SKILL.md` 文件
   - SKILL.md 文件必须有有效的 YAML frontmatter

**你应该看到**：完整的技能列表输出，JSON 格式包含所有技能信息

---

### CLI 脚本不可执行

**症状**：运行 Codex CLI 脚本时报错"权限被拒绝"（Permission denied）。

**解决方案**：

```bash
chmod +x ~/.codex/superpowers/.codex/superpowers-codex
```

**你应该看到**：CLI 脚本可以正常执行，不再报权限错误

---

### Node.js 错误

**症状**：运行 CLI 脚本时报 Node.js 相关错误，或提示 Node 版本过低。

**排查步骤**：

1. **检查 Node.js 版本**
   ```bash
   node --version
   ```

2. **验证版本要求**
   - Superpowers CLI 脚本要求 Node.js v14 或更高
   - 推荐使用 Node.js v18+ 以获得完整的 ES module 支持
   - 如果版本过低，请从 [Node.js 官网](https://nodejs.org/) 下载最新 LTS 版本

**你应该看到**：Node.js 版本 v18 或更高

---

## Claude Code 平台常见问题

### 插件安装后不生效

**症状**：通过 `/plugin install` 安装 Superpowers 后，命令无法使用。

**排查步骤**：

1. **验证插件是否已安装**
   ```bash
   /plugin list
   # 应该在列表中看到 superpowers
   ```

2. **检查命令是否已注册**
   ```bash
   /help
   # 应该看到以下命令：
   # /superpowers:brainstorm - Interactive design refinement
   # /superpowers:write-plan - Create implementation plan
   # /superpowers:execute-plan - Execute plan in batches
   ```

3. **重新加载插件**
   ```bash
   /plugin reload superpowers
   ```

**你应该看到**：三个 Superpowers 命令出现在帮助列表中

---

### 技能未触发

**症状**：与 Claude Code 对话时，技能流程未自动触发，AI 直接开始写代码。

**可能原因**：

1. **技能未正确加载**：检查插件是否成功安装（见上方"插件安装后不生效"）
2. **对话上下文不匹配**：某些技能只会在特定上下文下触发（如 `brainstorming` 只在"构建新功能"时触发）
3. **技能优先级问题**：如果有项目自定义技能，可能会覆盖 Superpowers 技能

**解决方案**：

手动调用技能命令：
```bash
/superpowers:brainstorm  # 开始设计流程
/superpowers:write-plan # 编写实施计划
```

**你应该看到**：AI 开始执行对应的技能流程

---

## 通用排查技巧

### 检查点 ✅

| 问题类型 | 检查命令 | 预期结果 |
| -------- | -------- | -------- |
| 插件加载 | `ls -l ~/.config/opencode/plugins/` | 正确的符号链接 |
| 技能文件 | `ls ~/.config/opencode/skills/superpowers/` | 14 个技能目录 |
| CLI 工具 | `~/.codex/superpowers/.codex/superpowers-codex find-skills` | JSON 格式技能列表 |
| Node 版本 | `node --version` | v18+ |
| Git Bash 符号链接 | `ls -l ~/.config/opencode/plugins/` | 目录连接（非文件复制） |

### 踩坑提醒

::: warning Windows 用户
- Git Bash 的 `ln -sf` 命令会**复制文件而不是创建符号链接**
- 必须使用 `mklink /J` 创建目录连接
- 参考平台特定的安装指南中的 Windows 专用步骤
:::

::: warning OpenCode 用户
- 插件更改后必须**完全重启** OpenCode
- 使用 `opencode run "test" --print-logs --log-level DEBUG` 查看详细日志
- 确保使用支持 `experimental.chat.system.transform` hook 的 OpenCode 版本
:::

::: warning Codex 用户
- 确保给 CLI 脚本添加可执行权限
- Node.js 版本过低会导致 ES module 支持问题
- 推荐 v18+ 以获得最佳兼容性
:::

---

## 本课小结

本课涵盖了 Superpowers 在三大平台上的常见问题及解决方案：

- **OpenCode**：插件加载、技能发现、Windows 符号链接、Bootstrap 问题
- **Codex**：技能发现、CLI 权限、Node.js 版本
- **Claude Code**：插件安装、技能触发

关键排查技巧：
- 使用 `ls -l` 检查符号链接
- 查看 `--print-logs --log-level DEBUG` 获取详细日志
- 验证 SKILL.md 文件和 frontmatter 格式
- Windows 用户特别注意使用 `mklink /J` 而非 `ln -sf`

如果遇到本指南未涵盖的问题，请访问 [GitHub Issues](https://github.com/obra/superpowers/issues) 提交反馈。

---

## 下一课预告

> 下一课我们学习 **[最佳实践与避坑指南](../best-practices/)**。
>
> 你会学到：
> - 如何最大化发挥 Superpowers 的效果
> - 常见的使用陷阱和避坑方法
> - 与 AI 编码代理协作的最佳实践
> - 保持代码质量的核心原则

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-01

| 功能        | 文件路径                                                                                    | 行号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| OpenCode 故障排除 | [`docs/README.opencode.md`](https://github.com/obra/superpowers/blob/main/docs/README.opencode.md#L282-L308) | 282-308 |
| Codex 故障排除 | [`docs/README.codex.md`](https://github.com/obra/superpowers/blob/main/docs/README.codex.md#L122-L145) | 122-145 |
| GitHub Issues | [`README.md`](https://github.com/obra/superpowers/blob/main/README.md#L158) | 158     |

**关键常量**：
- 技能数量：14 个技能（涵盖测试、调试、协作、元技能四大类）

**关键文件**：
- `docs/README.opencode.md`：OpenCode 平台完整文档，包含故障排除章节
- `docs/README.codex.md`：Codex 平台完整文档，包含故障排除章节

**GitHub Issues**：
- https://github.com/obra/superpowers/issues - 提交问题和反馈

</details>
