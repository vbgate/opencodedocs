---
title: "高级功能: 多账户管理 | Antigravity Auth"
sidebarTitle: "搞定多账户"
subtitle: "高级功能: 多账户管理"
description: "掌握 Antigravity Auth 插件的高级特性。深入学习多账户负载均衡、智能账户选择、速率限制处理、会话恢复和请求转换等核心机制。"
order: 3
---

# 高级功能

本章节帮助你深入掌握 Antigravity Auth 插件的高级特性，包括多账户负载均衡、智能账户选择、速率限制处理、会话恢复、请求转换等核心机制。无论是优化配额利用率，还是排查复杂问题，这里都有你需要的答案。

## 前置条件

::: warning 开始前请确保
- ✅ 已完成 [快速安装](../start/quick-install/) 并成功添加第一个账户
- ✅ 已完成 [首次认证](../start/first-auth-login/) 并理解 OAuth 流程
- ✅ 已完成 [首次请求](../start/first-request/) 并验证插件正常工作
:::

## 学习路径

### 1. [多账户设置](./multi-account-setup/)

配置多个 Google 账户，实现配额池化和负载均衡。

- 添加多个账户，提升总体配额上限
- 理解双配额系统（Antigravity + Gemini CLI）
- 根据场景选择合适的账户数量

### 2. [账户选择策略](./account-selection-strategies/)

掌握 sticky、round-robin、hybrid 三种账户选择策略的最佳实践。

- 1 个账户 → sticky 策略保留 prompt 缓存
- 2-3 个账户 → hybrid 策略智能分布请求
- 4+ 个账户 → round-robin 策略最大化吞吐量

### 3. [速率限制处理](./rate-limit-handling/)

理解速率限制检测、自动重试和账户切换机制。

- 区分 5 种不同类型的 429 错误
- 理解自动重试的指数退避算法
- 掌握多账户场景下的自动切换逻辑

### 4. [会话恢复](./session-recovery/)

了解会话恢复机制，自动处理工具调用失败和中断。

- 自动处理 tool_result_missing 错误
- 修复 thinking_block_order 问题
- 配置 auto_resume 和 session_recovery 选项

### 5. [请求转换机制](./request-transformation/)

深入理解请求转换机制，如何兼容不同 AI 模型的协议差异。

- 理解 Claude 和 Gemini 模型的协议差异
- 排查 Schema 不兼容导致的 400 错误
- 优化 Thinking 配置以获得最佳性能

### 6. [配置指南](./configuration-guide/)

掌握所有配置选项，按需定制插件行为。

- 配置文件位置和优先级
- 模型行为、账户轮换、应用行为设置
- 单账户/多账户/并行代理场景推荐配置

### 7. [并行代理优化](./parallel-agents/)

为并行代理场景优化账户分配，启用 PID 偏移。

- 理解并行代理场景下的账户冲突问题
- 启用 PID 偏移让不同进程优先选择不同账户
- 配合 round-robin 策略最大化多账户利用率

### 8. [调试日志](./debug-logging/)

启用调试日志，排查问题和监控运行状态。

- 启用调试日志记录详细信息
- 理解不同日志级别和适用场景
- 解读日志内容快速定位问题

## 下一步

完成高级功能学习后，你可以：

- 📖 查阅 [常见问题](../faq/) 解决使用中遇到的问题
- 📚 阅读 [附录](../appendix/) 了解架构设计和完整配置参考
- 🔄 关注 [更新日志](../changelog/) 获取最新功能和变更
