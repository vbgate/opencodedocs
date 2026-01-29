---
title: "版本历史: Antigravity Auth 更新日志 | opencode-antigravity-auth"
sidebarTitle: "新功能一览"
subtitle: "版本历史: Antigravity Auth 更新日志"
description: "了解 Antigravity Auth 插件的版本历史和重要变更记录。查看每个版本的新功能、bug 修复、性能改进，获取升级指南和兼容性说明。"
tags:
  - "版本历史"
  - "更新日志"
  - "变更记录"
order: 1
---

# 版本历史

本文档记录了 Antigravity Auth 插件的版本历史和重要变更。

::: tip 最新版本
当前最新稳定版本：**v1.3.0**（2026-01-17）
:::

## 版本说明

### 稳定版 (Stable)
- 经过充分测试，推荐生产环境使用
- 版本号格式：`vX.Y.Z`（如 v1.3.0）

### 测试版 (Beta)
- 包含最新功能，可能有不稳定因素
- 版本号格式：`vX.Y.Z-beta.N`（如 v1.3.1-beta.3）
- 适合早期体验和反馈

---

## v1.3.x 系列

### v1.3.1-beta.3
**发布时间**：2026-01-22

**变更**：
- 优化 `MODEL_CAPACITY_EXHAUSTED` 错误的退避算法，增加随机抖动范围

### v1.3.1-beta.2
**发布时间**：2026-01-22

**变更**：
- 移除未使用的 `googleSearch` 配置项
- 添加 ToS（服务条款）警告和使用建议到 README

### v1.3.1-beta.1
**发布时间**：2026-01-22

**变更**：
- 改进账户切换通知的防抖逻辑，减少重复提示

### v1.3.1-beta.0
**发布时间**：2026-01-20

**变更**：
- 移除子仓库追踪，恢复 tsconfig.json

### v1.3.0
**发布时间**：2026-01-17

**重要变更**：

**新增功能**：
- 使用 Zod v4 的原生 `toJSONSchema` 方法进行 schema 生成

**修复**：
- 修正 token 消耗测试，使用 `toBeCloseTo` 处理浮点数精度问题
- 改进测试覆盖率计算

**文档改进**：
- 增强负载均衡相关文档
- 添加格式化改进

---

## v1.2.x 系列

### v1.2.9-beta.10
**发布时间**：2026-01-17

**变更**：
- 修正 token 余额断言，使用浮点数精度匹配

### v1.2.9-beta.9
**发布时间**：2026-01-16

**变更**：
- 更新 token 消耗测试，使用 `toBeCloseTo` 处理浮点数精度
- 增强 Gemini 工具包装功能，添加包装函数数量统计

### v1.2.9-beta.8
**发布时间**：2026-01-16

**变更**：
- 添加新的 issue 模板（bug 报告和功能请求）
- 改进项目 onboarding 逻辑

### v1.2.9-beta.7
**发布时间**：2026-01-16

**变更**：
- 更新 issue 模板，要求提供描述性标题

### v1.2.9-beta.6
**发布时间**：2026-01-16

**变更**：
- 添加可配置的速率限制重试延迟
- 改进 hostname 检测，支持 OrbStack Docker 环境
- 智能 OAuth 回调服务器地址绑定
- 澄清 `thinkingLevel` 和 `thinkingBudget` 的优先级

### v1.2.9-beta.5
**发布时间**：2026-01-16

**变更**：
- 改进 Gemini 工具包装，支持 `functionDeclarations` 格式
- 确保 `normalizeGeminiTools` 中正确创建自定义函数包装器

### v1.2.9-beta.4
**发布时间**：2026-01-16

**变更**：
- 包装 Gemini 工具为 `functionDeclarations` 格式
- 在 `wrapToolsAsFunctionDeclarations` 中应用 `toGeminiSchema`

### v1.2.9-beta.3
**发布时间**：2026-01-14

**变更**：
- 更新文档和代码注释，说明 hybrid 策略实现
- 简化 antigravity 系统指令以用于测试

### v1.2.9-beta.2
**发布时间**：2026-01-12

**变更**：
- 修正 Gemini 3 模型解析逻辑，去重思考块处理
- 为显示的思考哈希添加 Gemini 3 模型检查

### v1.2.9-beta.1
**发布时间**：2026-01-08

**变更**：
- 更新插件安装说明中的 beta 版本
- 改进账户管理，确保当前认证被添加到存储账户

### v1.2.9-beta.0
**发布时间**：2026-01-08

**变更**：
- 更新 README，修正 Antigravity 插件 URL
- 更新 schema URL 到 NoeFabris 仓库

### v1.2.8
**发布时间**：2026-01-08

**重要变更**：

**新增功能**：
- Gemini 3 模型支持
- 思考块去重处理

**修复**：
- 修正 Gemini 3 模型解析逻辑
- 响应转换中的显示思考哈希处理

**文档改进**：
- 更新测试脚本输出重定向
- 更新模型测试选项

### v1.2.7
**发布时间**：2026-01-01

**重要变更**：

**新增功能**：
- 改进账户管理，确保当前认证被正确存储
- 通过 GitHub Actions 自动发布 npm 版本

**修复**：
- 修正 E2E 测试脚本中的输出重定向

**文档改进**：
- 更新仓库 URL 到 NoeFabris

---

## v1.2.6 - v1.2.0 系列

### v1.2.6
**发布时间**：2025-12-26

**变更**：
- 添加工作流自动重新发布 npm 版本

### v1.2.5
**发布时间**：2025-12-26

**变更**：
- 文档更新，版本号修正为 1.2.6

### v1.2.4 - v1.2.0
**发布时间**：2025 年 12 月

**变更**：
- 多账户负载均衡功能
- 双配额系统（Antigravity + Gemini CLI）
- 会话恢复机制
- OAuth 2.0 PKCE 认证
- Thinking 模型支持（Claude 和 Gemini 3）
- Google Search grounding

---

## v1.1.x 系列

### v1.1.0 及后续版本
**发布时间**：2025 年 11 月

**变更**：
- 优化认证流程
- 改进错误处理
- 添加更多配置选项

---

## v1.0.x 系列（早期版本）

### v1.0.4 - v1.0.0
**发布时间**：2025 年 10 月及更早

**初始功能**：
- 基础 Google OAuth 认证
- Antigravity API 访问
- 简单的模型支持

---

## 版本升级指南

### 从 v1.2.x 升级到 v1.3.x

**兼容性**：完全兼容，无需修改配置

**建议操作**：
```bash
# 更新插件
opencode plugin update opencode-antigravity-auth

# 验证安装
opencode auth status
```

### 从 v1.1.x 升级到 v1.2.x

**兼容性**：需要更新账户存储格式

**建议操作**：
```bash
# 备份现有账户
cp ~/.config/opencode/antigravity-accounts.json ~/.config/opencode/antigravity-accounts.json.bak

# 更新插件
opencode plugin update opencode-antigravity-auth@latest

# 重新登录（如有问题）
opencode auth login
```

### 从 v1.0.x 升级到 v1.2.x

**兼容性**：账户存储格式不兼容，需要重新认证

**建议操作**：
```bash
# 更新插件
opencode plugin update opencode-antigravity-auth@latest

# 重新登录
opencode auth login

# 按新版本要求添加模型配置
```

---

## Beta 版本说明

**Beta 版本的使用建议**：

| 使用场景 | 推荐版本 | 说明 |
|---------|---------|------|
| 生产环境 | 稳定版 (vX.Y.Z) | 经过充分测试，稳定性高 |
| 日常开发 | 最新稳定版 | 功能完整，bug 较少 |
| 早期体验 | 最新 Beta | 可体验最新功能，但可能不稳定 |

**安装 Beta 版本**：

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**升级到稳定版**：

```bash
opencode plugin update opencode-antigravity-auth@latest
```

---

## 版本号说明

版本号遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/) 规范：

- **主版本号 (X)**：不兼容的 API 修改
- **次版本号 (Y)**：向下兼容的功能性新增
- **修订号 (Z)**：向下兼容的问题修正

**示例**：
- `1.3.0` → 主版本 1，次版本 3，修订号 0
- `1.3.1-beta.3` → 1.3.1 的第 3 个 Beta 版本

---

## 获取更新通知

**自动更新**（默认启用）：

```json
{
  "auto_update": true
}
```

**手动检查更新**：

```bash
# 查看当前版本
opencode plugin list

# 更新插件
opencode plugin update opencode-antigravity-auth
```

---

## 下载地址

- **NPM 稳定版**：https://www.npmjs.com/package/opencode-antigravity-auth
- **GitHub Releases**：https://github.com/NoeFabris/opencode-antigravity-auth/releases

---

## 贡献反馈

如果遇到问题或有功能建议，请：

1. 查看 [故障排除指南](../../faq/common-auth-issues/)
2. 在 [GitHub Issues](https://github.com/NoeFabris/opencode-antigravity-auth/issues) 提交问题
3. 使用正确的 issue 模板（Bug Report / Feature Request）
