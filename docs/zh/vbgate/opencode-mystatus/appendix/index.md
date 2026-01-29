---
title: "附录: 数据模型与 API 接口汇总 | opencode-mystatus"
sidebarTitle: "附录"
subtitle: "附录: 数据模型与 API 接口汇总"
description: "掌握 opencode-mystatus 的数据模型和 API 接口。了解认证文件结构、各平台响应格式，方便排查问题和扩展新平台支持。"
order: 5
---

# 附录

本章节提供 opencode-mystatus 的技术参考资料，适合开发者和高级用户。

## 参考文档

### [数据模型](./data-models/)

了解插件的数据结构：

- 认证文件结构（`auth.json`、`antigravity-accounts.json`、`copilot-quota-token.json`）
- 各平台 API 响应格式
- 内部数据类型定义
- 如何扩展支持新平台

### [API 接口汇总](./api-endpoints/)

查看插件调用的所有官方 API：

- OpenAI 额度查询接口
- 智谱 AI / Z.ai 额度查询接口
- GitHub Copilot 额度查询接口
- Google Cloud Antigravity 额度查询接口
- 认证方式和请求格式

## 适用场景

| 场景 | 推荐文档 |
|--- | ---|
| 想了解插件如何工作 | [数据模型](./data-models/) |
| 想手动调用 API | [API 接口汇总](./api-endpoints/) |
| 想扩展支持新平台 | 两个文档都需要 |
| 排查数据格式问题 | [数据模型](./data-models/) |

## 相关链接

- [GitHub 仓库](https://github.com/vbgate/opencode-mystatus) - 完整源码
- [NPM 包](https://www.npmjs.com/package/opencode-mystatus) - 版本和依赖
- [更新日志](../changelog/) - 版本历史
