---
title: "常见问题: 故障排除与安全 | opencode-mystatus"
sidebarTitle: "遇到问题怎么办"
subtitle: "常见问题: 故障排除与安全"
description: "学习 opencode-mystatus 的故障排除和安全机制。解决认证文件读取、Token 过期、API 请求失败等问题，了解隐私保护。"
order: 4
---

# 常见问题

本章节收集了使用 opencode-mystatus 时的常见问题和解决方案。

## 问题分类

### [故障排除](./troubleshooting/)

解决各种查询失败的问题：

- 无法读取认证文件
- Token 过期或权限不足
- API 请求失败或超时
- 各平台特定的错误处理

### [安全与隐私](./security/)

了解插件的安全机制：

- 本地文件只读访问
- API Key 自动脱敏
- 仅调用官方接口
- 无数据上传或存储

## 快速定位

根据错误信息快速找到解决方案：

| 错误关键词 | 可能原因 | 解决方案 |
|--- | --- | ---|
| `auth.json not found` | 认证文件不存在 | [故障排除](./troubleshooting/) |
| `Token expired` | Token 已过期 | [故障排除](./troubleshooting/) |
| `Permission denied` | 权限不足 | [Copilot 认证配置](../advanced/copilot-auth/) |
| `project_id missing` | Google Cloud 配置不完整 | [Google Cloud 配置](../advanced/google-setup/) |
| `Request timeout` | 网络问题 | [故障排除](./troubleshooting/) |

## 获取帮助

如果本章节没有解决你的问题：

- 提交 [Issue](https://github.com/vbgate/opencode-mystatus/issues) - 报告 Bug 或请求新功能
- 查看 [GitHub 仓库](https://github.com/vbgate/opencode-mystatus) - 获取最新版本和源码
