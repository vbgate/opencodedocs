---
title: "浏览器控制 - 自动化 Chrome/Chromium | OpenClaw 教程"
sidebarTitle: "浏览器控制"
subtitle: "浏览器控制 - 自动化 Chrome/Chromium"
description: "学习如何配置浏览器控制、理解 CDP 协议、自动化网页操作，让 AI 助手能够浏览和操作网页。"
tags:
  - "浏览器"
  - "自动化"
  - "CDP"
  - "Playwright"
order: 110
---

# 浏览器控制 - 自动化 Chrome/Chromium

## 学完你能做什么

完成本课程后，你将能够：
- 配置浏览器控制和 CDP 连接
- 使用 AI 助手自动化网页操作
- 设置浏览器安全策略
- 管理多个浏览器配置文件

## 核心思路

OpenClaw 使用 **Playwright** 和 **Chrome DevTools Protocol (CDP)** 来控制浏览器，让 AI 助手能够浏览网页、执行操作、提取信息。

```
┌─────────────────────────────────────────────────────────────┐
│                  浏览器控制架构                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   AI 助手请求                                                │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────┐              │
│   │      OpenClaw Browser Service          │              │
│   │         (Express HTTP Server)          │              │
│   └───────────────┬─────────────────────────┘              │
│                   │                                         │
│       ┌───────────┴───────────┐                            │
│       │                       │                            │
│       ▼                       ▼                            │
│   ┌──────────┐           ┌──────────┐                     │
│   │Playwright│           │  CDP     │                     │
│   │ 控制层   │           │ 协议层   │                     │
│   └────┬─────┘           └────┬─────┘                     │
│        │                       │                           │
│        └───────────┬───────────┘                           │
│                    │                                       │
│                    ▼                                       │
│        ┌──────────────────────┐                           │
│        │  Chrome/Chromium     │                           │
│        │  ┌────────────────┐  │                           │
│        │  │ Profile: default│ │                           │
│        │  │ Profile: work   │ │                           │
│        │  └────────────────┘  │                           │
│        └──────────────────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 浏览器控制功能

| 功能 | 说明 | 使用场景 |
|------|------|----------|
| **页面导航** | 打开、刷新、前进、后退 | 浏览网页、获取信息 |
| **元素操作** | 点击、输入、滚动 | 表单填写、按钮点击 |
| **截图** | 全页、元素、视口截图 | 视觉反馈、调试 |
| **PDF 生成** | 页面转 PDF | 保存网页内容 |
| **下载管理** | 文件下载、保存 | 获取资源文件 |
| **Cookie/存储** | 读写 localStorage、Cookie | 状态管理 |
| **执行 JS** | 运行自定义 JavaScript | 复杂操作 |

## 跟我做

### 第 1 步：启用浏览器控制

**为什么**  
浏览器控制默认可能未启用，需要显式开启。

```bash
# 启用浏览器控制
openclaw config set browser.enabled true

# 配置默认使用 headless 模式（可选）
openclaw config set browser.headless false

# 验证配置
openclaw config get browser
```

### 第 2 步：配置浏览器路径

**为什么**  
需要指定 Chrome/Chromium 可执行文件位置。

```bash
# macOS
openclaw config set browser.executablePath "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
openclaw config set browser.executablePath "/usr/bin/google-chrome"

# Windows
openclaw config set browser.executablePath "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

# 或者使用 Chromium
openclaw config set browser.executablePath "/usr/bin/chromium"
```

**自动检测**  
如果不配置 `executablePath`，OpenClaw 会尝试自动检测已安装的 Chrome/Chromium。

### 第 3 步：配置浏览器配置文件

**为什么**  
多配置文件可以隔离不同任务的浏览器状态（Cookie、登录状态等）。

```bash
# 创建新配置文件
openclaw browser profile create work

# 配置配置文件专用 CDP 端口
openclaw config set browser.profiles.work.cdpPort 9223

# 配置配置文件颜色（UI 显示）
openclaw config set browser.profiles.work.color "#FF5733"

# 使用 extension 驱动（需要 Chrome 扩展）
openclaw config set browser.profiles.extension.driver "extension"
openclaw config set browser.profiles.extension.cdpUrl "ws://localhost:9222/devtools/browser/..."
```

**配置文件配置示例** (`src/config/types.browser.ts`)

```typescript
type BrowserProfileConfig = {
  cdpPort?: number;      // CDP 端口
  cdpUrl?: string;       // CDP URL（用于远程浏览器）
  driver?: "openclaw" | "extension";  // 驱动类型
  color: string;         // 配置文件颜色
};
```

### 第 4 步：启动浏览器服务

**为什么**  
浏览器服务需要与 Gateway 一起运行。

```bash
# 启动 Gateway（浏览器服务自动启动）
openclaw gateway run

# 检查浏览器服务状态
openclaw status
```

**你应该看到**

```
┌─────────────────────────────────────┐
│  OpenClaw Gateway Status            │
├─────────────────────────────────────┤
│  Gateway:    ✅ Running (port 18789)│
│  Browser:    ✅ Running (port 18790)│
│  Auth:       token                  │
└─────────────────────────────────────┘
```

### 第 5 步：使用浏览器工具

**为什么**  
AI 助手可以通过工具调用控制浏览器。

浏览器工具端点（默认端口 18790）：

```bash
# 获取浏览器状态
curl http://localhost:18790/status

# 打开新标签页
curl -X POST http://localhost:18790/tabs \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# 截图
curl -X POST http://localhost:18790/screenshot \
  -H "Content-Type: application/json" \
  -d '{"selector": "body", "fullPage": true}'
```

### 第 6 步：配置浏览器安全

**为什么**  
浏览器控制涉及执行 JavaScript，需要安全限制。

```bash
# 禁用任意 JavaScript 执行（仅允许白名单操作）
openclaw config set browser.evaluateEnabled false

# 启用沙箱模式（Linux 容器环境）
openclaw config set browser.noSandbox false

# 配置远程 CDP 超时
openclaw config set browser.remoteCdpTimeoutMs 1500
```

**安全配置选项**

```json
{
  "browser": {
    "enabled": true,
    "evaluateEnabled": false,
    "noSandbox": false,
    "headless": true,
    "remoteCdpTimeoutMs": 1500,
    "remoteCdpHandshakeTimeoutMs": 3000
  }
}
```

### 第 7 步：连接到远程浏览器

**为什么**  
可以连接已运行的 Chrome 实例，或使用远程浏览器服务。

```bash
# 配置远程 CDP URL
openclaw config set browser.cdpUrl "ws://remote-server:9222/devtools/browser/..."

# 或者配置配置文件的远程 URL
openclaw config set browser.profiles.remote.cdpUrl "ws://browserless:3000"
```

**启动 Chrome 并启用 CDP**

```bash
# macOS
/Applications/Google\\ Chrome.app/Contents/MacOS/Google Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-dev-profile

# Linux
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-dev-profile
```

## 检查点 ✅

验证浏览器控制：

```bash
# 检查浏览器状态
openclaw browser status

# 预期输出
┌─────────────────────────────────────┐
│  Browser Control Status             │
├─────────────────────────────────────┤
│  Status:     ✅ Running              │
│  Port:       18790                   │
│  Auth:       token                   │
│  Profiles:   default, work           │
└─────────────────────────────────────┘

# 列出打开的页面
openclaw browser tabs list
```

## 踩坑提醒

::: warning 常见问题
1. **Chrome 未找到**  
   症状：`Chrome executable not found`  
   解决：安装 Chrome 或 Chromium，或配置正确的 `executablePath`

2. **CDP 端口被占用**  
   症状：`Port already in use`  
   解决：更改 `cdpPort` 配置，或关闭占用端口的进程

3. **浏览器启动失败**  
   症状：`Failed to launch browser`  
   解决：在 Linux 容器中使用 `noSandbox: true`，检查权限

4. **截图失败**  
   症状：`Screenshot timeout`  
   解决：增加超时时间，检查页面是否完全加载

5. **JS 执行被拒绝**  
   症状：`evaluate is disabled`  
   解决：设置 `evaluateEnabled: true`（注意安全风险）
:::

## 浏览器配置文件管理

### 常用命令

```bash
# 列出所有配置文件
openclaw browser profile list

# 创建新配置文件
openclaw browser profile create shopping

# 删除配置文件
openclaw browser profile delete shopping

# 重置配置文件
openclaw browser profile reset default
```

### 配置文件使用场景

| 配置文件 | 用途 | 配置 |
|----------|------|------|
| `default` | 一般浏览 | 默认设置 |
| `work` | 工作相关 | 已登录工作账号 |
| `personal` | 个人使用 | 已登录个人账号 |
| `incognito` | 隐私浏览 | 无痕模式 |

## 与 AI 集成

### AI 工具调用示例

当 AI 助手需要浏览网页时，会调用浏览器工具：

```json
{
  "tool": "browser_navigate",
  "params": {
    "url": "https://www.example.com",
    "profile": "default"
  }
}

{
  "tool": "browser_screenshot",
  "params": {
    "selector": "#main-content",
    "fullPage": false
  }
}

{
  "tool": "browser_click",
  "params": {
    "selector": "button[type=submit]"
  }
}
```

## 本课小结

在本课程中，你学习了：

- ✅ 浏览器控制的架构和工作原理
- ✅ 启用和配置浏览器控制
- ✅ 管理多个浏览器配置文件
- ✅ 配置浏览器安全策略
- ✅ 连接到远程浏览器
- ✅ 使用浏览器工具端点
- ✅ 与 AI 助手的集成方式

## 下一课预告

> 下一课我们学习 **[技能系统](../skills-system/)**。
>
> 你会学到：
> - 技能系统架构
> - 安装和创建自定义技能
> - 技能开发和发布

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| 浏览器实现 | [`src/browser/`](https://github.com/openclaw/openclaw/blob/main/src/browser/) | - |
| 浏览器服务 | [`src/browser/server.ts`](https://github.com/openclaw/openclaw/blob/main/src/browser/server.ts) | 1-200 |
| 浏览器配置类型 | [`src/config/types.browser.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.browser.ts) | 1-42 |
| Gateway 浏览器服务 | [`src/gateway/server-browser.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-browser.ts) | - |
| Playwright 工具 | [`src/browser/pw-tools-core.ts`](https://github.com/openclaw/openclaw/blob/main/src/browser/pw-tools-core.ts) | - |
| Chrome 启动 | [`src/browser/chrome.ts`](https://github.com/openclaw/openclaw/blob/main/src/browser/chrome.ts) | - |

**关键依赖**：
- `playwright`: 浏览器自动化
- `express`: HTTP 服务端
- CDP: Chrome DevTools Protocol

</details>
