---
title: "Cloudflared: 公网暴露本地 API | Antigravity-Manager"
sidebarTitle: "让远程设备访问本地 API"
subtitle: "Cloudflared 一键隧道：把本地 API 安全暴露到公网（并非默认安全）"
description: "学习 Antigravity Tools 的 Cloudflared 一键隧道：跑通 Quick/Auth 两种启动方式，弄清 URL 何时会显示、如何复制与测试，并用 proxy.auth_mode + 强 API Key 做最小暴露。附带安装位置、常见报错与排查思路，让远程设备也能稳定调用本地网关。"
tags:
  - "Cloudflared"
  - "内网穿透"
  - "公网访问"
  - "Tunnel"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 7
---
# Cloudflared 一键隧道：把本地 API 安全暴露到公网（并非默认安全）

你会用 **Cloudflared 一键隧道**把本地的 Antigravity Tools API 网关暴露到公网（只在你明确开启时），让远程设备也能调用，同时弄清 Quick 和 Auth 两种模式的行为差异和风险边界。

## 学完你能做什么

- 一键安装和启动 Cloudflared 隧道
- 选择 Quick 模式（临时 URL）或 Auth 模式（命名隧道）
- 复制公网 URL 让远程设备访问本地 API
- 理解隧道安全风险并采取最小暴露策略

## 你现在的困境

你在本地跑好了 Antigravity Tools 的 API 网关，但只有本机或局域网能访问。想让远程服务器、移动设备或云服务也能调用这个网关，却没有公网 IP，也不想折腾复杂的服务器部署方案。

## 什么时候用这一招

- 你没有公网 IP，但需要远程设备访问本地 API
- 你在测试/开发阶段，想快速暴露服务给外部
- 你不想购买服务器部署，只想用现有机器

::: warning 安全警告
公网暴露有风险！请务必：
1. 配置强 API Key（`proxy.auth_mode=strict/all_except_health`）
2. 仅在必要时开启隧道，用完即关
3. 定期检查 Monitor 日志，发现异常立即停止
:::

## 🎒 开始前的准备

::: warning 前置条件
- 你已经启动了本地反代服务（"API Proxy" 页面的开关已打开）
- 你已经添加了至少一个可用账号
:::

## 什么是 Cloudflared？

**Cloudflared**是 Cloudflare 提供的隧道客户端，它会在你的机器和 Cloudflare 之间建立一条加密通道，把本地的 HTTP 服务映射成一个可从公网访问的 URL。Antigravity Tools 把安装、启动、停止和 URL 复制做成了 UI 操作，方便你快速跑通验证闭环。

### 支持的平台

项目内置的“自动下载 + 安装”逻辑只覆盖下面这些 OS/架构组合（其他平台会报 `Unsupported platform`）。

| 操作系统 | 架构 | 支持状态 |
|--- | --- | ---|
| macOS | Apple Silicon (arm64) | ✅ |
| macOS | Intel (x86_64) | ✅ |
| Linux | x86_64 | ✅ |
| Linux | ARM64 | ✅ |
| Windows | x86_64 | ✅ |

### 两种模式对比

| 特性 | Quick 模式 | Auth 模式 |
|--- | --- | ---|
| **URL 类型** | `https://xxx.trycloudflare.com`（从日志里提取的临时 URL） | 应用不一定能自动提取 URL（取决于 cloudflared 日志）；入口域名以你在 Cloudflare 侧配置为准 |
| **需要 Token** | ❌ 不需要 | ✅ 需要（从 Cloudflare 控制台获取） |
| **稳定性** | URL 可能随进程重启变化 | 取决于你在 Cloudflare 侧怎么配置（应用仅负责启动进程） |
| **适合场景** | 临时测试、快速验证 | 长期稳定服务、生产环境 |
| **推荐度** | ⭐⭐⭐ 测试用 | ⭐⭐⭐⭐⭐ 生产用 |

::: info Quick 模式 URL 的特性
Quick 模式的 URL 每次启动都可能变化，且是随机生成的 `*.trycloudflare.com` 子域名。如果你需要固定 URL，必须使用 Auth 模式并在 Cloudflare 控制台绑定域名。
:::

## 跟我做

### 第 1 步：打开 API Proxy 页面

**为什么**
找到 Cloudflared 配置入口。

1. 打开 Antigravity Tools
2. 点击左侧导航的 **"API Proxy"**（API 反代）
3. 找到 **"Public Access (Cloudflared)"** 卡片（页面下方，橙色图标）

**你应该看到**：一个可展开的卡片，显示"Cloudflared not installed"（未安装）或"Installed: xxx"（已安装）。

### 第 2 步：安装 Cloudflared

**为什么**
下载并安装 Cloudflared 二进制文件到数据目录的 `bin` 文件夹。

#### 如果未安装

1. 点击 **"Install"**（安装）按钮
2. 等待下载完成（根据网络速度，约 10-30 秒）

**你应该看到**：
- 按钮显示加载动画
- 完成后提示 "Cloudflared installed successfully"
- 卡片显示 "Installed: cloudflared version 202X.X.X"

#### 如果已安装

跳过此步，直接进入第 3 步。

::: tip 安装位置
Cloudflared 二进制文件会安装到“数据目录”的 `bin/` 下（数据目录名是 `.antigravity_tools`）。

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/bin/"
```

```powershell [Windows]
Get-ChildItem "$HOME\.antigravity_tools\bin\"
```

:::

如果你还不确定数据目录在哪，先看一遍 **[首次启动必懂：数据目录、日志、托盘与自动启动](../../start/first-run-data/)**。
:::

### 第 3 步：选择隧道模式

**为什么**
根据你的使用场景选择合适的模式。

1. 在卡片中找到模式选择区域（两个大按钮）
2. 点击选择：

| 模式 | 描述 | 何时选择 |
|--- | --- | ---|
| **Quick Tunnel** | 自动生成临时 URL（`*.trycloudflare.com`） | 快速测试、临时访问 |
| **Named Tunnel** | 使用 Cloudflare 账号和自定义域名 | 生产环境、固定域名需求 |

::: tip 推荐选择
如果你第一次使用，**先选 Quick 模式**，快速验证功能是否满足需求。
:::

### 第 4 步：配置参数

**为什么**
根据模式填写必要参数和选项。

#### Quick 模式

1. 端口会自动使用你当前的 Proxy 端口（默认是 `8045`，以实际配置为准）
2. 勾选 **"Use HTTP/2"**（默认勾选）

#### Auth 模式

1. 填入 **Tunnel Token**（从 Cloudflare 控制台获取）
2. 端口同样使用当前的 Proxy 端口（以实际配置为准）
3. 勾选 **"Use HTTP/2"**（默认勾选）

::: info 如何获取 Tunnel Token？
1. 登录 [Cloudflare Zero Trust 控制台](https://dash.cloudflare.com/sign-up-to-cloudflare-zero-trust)
2. 进入 **"Networks"** → **"Tunnels"**
3. 点击 **"Create a tunnel"** → **"Remote browser"** 或 **"Cloudflared"**
4. 复制生成的 Token（类似 `eyJhIjoiNj...` 长字符串）
:::

#### HTTP/2 选项说明

`Use HTTP/2` 会让 cloudflared 以 `--protocol http2` 启动。项目内的文案把它描述为“更兼容（推荐中国大陆用户）”，并且默认开启。

::: tip 推荐勾选
**HTTP/2 选项推荐默认勾选**，尤其是在国内网络环境下。
:::

### 第 5 步：启动隧道

**为什么**
建立本地到 Cloudflare 的加密隧道。

1. 点击卡片右上角的开关（或展开后的 **"Start Tunnel"** 按钮）
2. 等待隧道启动（约 5-10 秒）

**你应该看到**：
- 卡片标题右侧显示绿色圆点
- 提示 **"Tunnel Running"**
- 显示公网 URL（类似 `https://random-name.trycloudflare.com`）
- 右侧有复制按钮：按钮上只展示 URL 的前 20 个字符，但点击会复制完整 URL

::: warning Auth 模式可能看不到 URL
当前应用只会从 cloudflared 的日志里提取 `*.trycloudflare.com` 这类 URL 来展示。Auth 模式通常不会输出这类域名，所以你可能只能看到“Running”，但看不到 URL。此时入口域名以你在 Cloudflare 侧配置为准。
:::

### 第 6 步：测试公网访问

**为什么**
验证隧道是否正常工作。

#### 健康检查

::: code-group

```bash [macOS/Linux]
#替换为你的实际隧道 URL
curl -s "https://your-url.trycloudflare.com/healthz"
```

```powershell [Windows]
Invoke-RestMethod "https://your-url.trycloudflare.com/healthz"
```

:::

**你应该看到**：`{"status":"ok"}`

#### 模型列表查询

::: code-group

```bash [macOS/Linux]
#如果你启用了鉴权，把 <proxy_api_key> 换成你的 key
curl -s \
  -H "Authorization: Bearer <proxy_api_key>" \
  "https://your-url.trycloudflare.com/v1/models"
```

```powershell [Windows]
Invoke-RestMethod \
  -Headers @{ Authorization = "Bearer <proxy_api_key>" } \
  "https://your-url.trycloudflare.com/v1/models"
```

:::

**你应该看到**：返回模型列表 JSON。

::: tip 注意 HTTPS
隧道 URL 是 HTTPS 协议，无需额外证书配置。
:::

#### 使用 OpenAI SDK 调用（示例）

```python
import openai

#使用公网 URL
client = openai.OpenAI(
    api_key="your-proxy-api-key",  # 如果开启了鉴权
    base_url="https://your-url.trycloudflare.com/v1"
)

#modelId 以 /v1/models 的实际返回为准

response = client.chat.completions.create(
    model="<modelId>",
    messages=[{"role": "user", "content": "你好"}]
)

print(response.choices[0].message.content)
```

::: warning 鉴权提醒
如果你在 "API Proxy" 页面开启了鉴权（`proxy.auth_mode=strict/all_except_health`），请求必须携带 API Key：
- Header: `Authorization: Bearer your-api-key`
- 或: `x-api-key: your-api-key`
:::

### 第 7 步：停止隧道

**为什么**
用完即关，减少安全暴露时间。

1. 点击卡片右上角的开关（或展开后的 **"Stop Tunnel"** 按钮）
2. 等待停止完成（约 2 秒）

**你应该看到**：
- 绿色圆点消失
- 提示 **"Tunnel Stopped"**
- 公网 URL 消失

## 检查点 ✅

完成上述步骤后，你应该能够：

- [ ] 安装 Cloudflared 二进制文件
- [ ] 在 Quick 和 Auth 模式间切换
- [ ] 启动隧道并获取公网 URL
- [ ] 通过公网 URL 调用本地 API
- [ ] 停止隧道

## 踩坑提醒

### 问题 1：安装失败（下载超时）

**症状**：点击 "Install" 后长时间无响应或提示下载失败。

**原因**：网络问题（尤其是国内访问 GitHub Releases）。

**解决**：
1. 检查网络连接
2. 使用 VPN 或代理
3. 手动下载：[Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases)，选择对应平台版本，手动放到数据目录的 `bin` 文件夹，并赋予执行权限（macOS/Linux）。

### 问题 2：启动隧道失败

**症状**：点击启动后，URL 没有显示或提示错误。

**原因**：
- Auth 模式下 Token 无效
- 本地反代服务未启动
- 端口被占用

**解决**：
1. Auth 模式：检查 Token 是否正确，是否已过期
2. 检查 "API Proxy" 页面的反代开关是否打开
3. 检查端口 `8045` 是否被其他程序占用

### 问题 3：公网 URL 无法访问

**症状**：curl 或 SDK 调用公网 URL 超时。

**原因**：
- 隧道进程意外退出
- Cloudflare 网络问题
- 本地防火墙拦截

**解决**：
1. 检查卡片是否显示 "Tunnel Running"
2. 查看卡片是否有错误提示（红色文字）
3. 检查本地防火墙设置
4. 尝试重启隧道

### 问题 4：鉴权失败（401）

**症状**：请求返回 401 错误。

**原因**：代理开启了鉴权，但请求未携带 API Key。

**解决**：
1. 检查 "API Proxy" 页面的鉴权模式
2. 在请求中添加正确的 Header：
   ```bash
   curl -H "Authorization: Bearer your-api-key" \
         https://your-url.trycloudflare.com/v1/models
   ```

## 本课小结

Cloudflared 隧道是快速暴露本地服务的利器。通过本课，你学会了：

- **一键安装**：UI 内自动下载和安装 Cloudflared
- **两种模式**：Quick（临时）和 Auth（命名）的选择
- **公网访问**：复制 HTTPS URL，远程设备可直接调用
- **安全意识**：开启鉴权、用完即关、定期检查日志

记住：**隧道是双刃剑**，用好了方便，用错了有风险。始终遵循最小暴露原则。

## 下一课预告

下一课我们学习 **[配置全解：AppConfig/ProxyConfig、落盘位置与热更新语义](/zh/lbjlaq/Antigravity-Manager/advanced/config/)**。

你会学到：
- AppConfig 和 ProxyConfig 的完整字段
- 配置文件的落盘位置
- 哪些配置需要重启，哪些可以热更新

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 数据目录名（`.antigravity_tools`） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| 配置结构与默认值（`CloudflaredConfig`、`TunnelMode`） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L16-L59) | 16-59 |
| 自动下载 URL 规则（支持的 OS/架构） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L70-L88) | 70-88 |
| 安装逻辑（下载/写入/解压/权限） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L147-L211) | 147-211 |
|--- | --- | ---|
| URL 提取规则（仅识别 `*.trycloudflare.com`） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L390-L413) | 390-413 |
| Tauri 命令接口（check/install/start/stop/get_status） | [`src-tauri/src/commands/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/cloudflared.rs#L6-L118) | 6-118 |
| UI 卡片（模式/Token/HTTP2/URL 展示与复制） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1597-L1753) | 1597-1753 |
| 启动前必须 Proxy Running（toast + return） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L256-L306) | 256-306 |

**关键常量**：
- `DATA_DIR = ".antigravity_tools"`：数据目录名（源码：`src-tauri/src/modules/account.rs`）

**关键函数**：
- `get_download_url()`：拼出 GitHub Releases 的下载地址（源码：`src-tauri/src/modules/cloudflared.rs`）
- `extract_tunnel_url()`：从日志中提取 Quick 模式 URL（源码：`src-tauri/src/modules/cloudflared.rs`）

</details>
