---
title: "安装: Homebrew 与 Releases 部署 | Antigravity Manager"
sidebarTitle: "5 分钟装起来"
subtitle: "安装与升级：桌面端最佳安装路径（brew / releases）"
description: "学习 Antigravity Tools 的 Homebrew 和 Releases 安装方法。在 5 分钟内完成部署，处理 macOS quarantine 问题和应用已损坏的常见错误，并掌握升级流程。"
tags:
  - "安装"
  - "升级"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 2
---

# 安装与升级：桌面端最佳安装路径（brew / releases）

如果你想快速把 Antigravity Tools 装起来并跑通后续课程，这一课只做一件事：把“装上 + 能打开 + 知道怎么升级”讲清楚。

## 学完你能做什么

- 选对安装路径：优先 Homebrew，其次 GitHub Releases
- 处理 macOS 常见拦截（quarantine / “应用已损坏”）
- 在特殊环境下安装：Arch 脚本、Headless Xvfb、Docker
- 知道每种安装方式的升级入口与自检方法

## 你现在的困境

- 文档里安装方式太多，不知道该选哪一个
- macOS 下载后打不开，提示“已损坏/无法打开”
- 你在 NAS/服务器上跑，既没有桌面，也不方便授权

## 什么时候用这一招

- 第一次安装 Antigravity Tools
- 换电脑/重装系统后恢复环境
- 版本升级后遇到系统拦截或启动异常

::: warning 前置知识
如果你还不确定 Antigravity Tools 解决什么问题，先看一眼 **[Antigravity Tools 是什么](/zh/lbjlaq/Antigravity-Manager/start/getting-started/)**，再回来安装会更顺。
:::

## 核心思路

推荐你按“桌面优先、服务器再说”的顺序选择：

1. 桌面端（macOS/Linux）：用 Homebrew 装（最快、升级也最省心）
2. 桌面端（全平台）：从 GitHub Releases 下载（适合不想装 brew 或网络受限）
3. 服务器/NAS：优先 Docker；其次 Headless Xvfb（更像“在服务器跑桌面应用”）

## 跟我做

### 第 1 步：先选你的安装方式

**为什么**
不同安装方式的“升级/回滚/排障”成本差很大，先选路径能少走弯路。

**推荐**：

| 场景 | 推荐安装方式 |
| --- | --- |
| macOS / Linux 桌面 | Homebrew（选项 A） |
| Windows 桌面 | GitHub Releases（选项 B） |
| Arch Linux | 官方脚本（Arch 选项） |
| 远程服务器无桌面 | Docker（选项 D）或 Headless Xvfb（选项 C-Headless） |

**你应该看到**：你能明确自己属于哪一行。

### 第 2 步：用 Homebrew 安装（macOS / Linux）

**为什么**
Homebrew 是“自动处理下载与安装”的路径，升级也最顺手。

```bash
#1) 订阅本仓库的 Tap
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

#2) 安装应用
brew install --cask antigravity-tools
```

::: tip macOS 权限提示
README 提到：如果你在 macOS 上遇到权限/隔离相关问题，可以改用：

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**你应该看到**：`brew` 输出安装成功，并且系统里出现 Antigravity Tools 应用。

### 第 3 步：从 GitHub Releases 手动安装（macOS / Windows / Linux）

**为什么**
当你不使用 Homebrew，或希望自己控制安装包来源时，这条路最直接。

1. 打开项目 Releases 页面：`https://github.com/lbjlaq/Antigravity-Manager/releases`
2. 选择与你系统匹配的安装包：
   - macOS：`.dmg`（Apple Silicon / Intel）
   - Windows：`.msi` 或便携版 `.zip`
   - Linux：`.deb` 或 `AppImage`
3. 按系统安装器提示完成安装

**你应该看到**：安装完成后，能在系统应用列表里找到 Antigravity Tools 并启动。

### 第 4 步：macOS “应用已损坏，无法打开” 的处理

**为什么**
README 明确给了这个场景的修复方式；如果你遇到同样提示，直接照做就行。

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**你应该看到**：再次启动应用时，不再出现“已损坏/无法打开”的拦截提示。

### 第 5 步：升级（按你的安装方式选择）

**为什么**
升级时最容易踩坑的是“装法变了”，导致你不知道该去哪里更新。

::: code-group

```bash [Homebrew]
#升级前先更新 tap 信息
brew update

#升级cask
brew upgrade --cask antigravity-tools
```

```text [Releases]
重新下载最新版本的安装包（.dmg/.msi/.deb/AppImage），按系统提示覆盖安装即可。
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

#README 说明容器启动时会尝试拉取最新 release；最简单的升级方式是重启容器
docker compose restart
```

:::

**你应该看到**：升级完成后应用仍能正常启动；如果你使用 Docker/Headless，也能继续访问探活端点。

## 其他安装方式（特定场景）

### Arch Linux：官方一键安装脚本

README 提供了 Arch 脚本入口：

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details 这个脚本做了什么？
它会通过 GitHub API 获取最新 release，下载 `.deb` 资产计算 SHA256，再生成 PKGBUILD 并用 `makepkg -si` 安装。
:::

### 远程服务器：Headless Xvfb

如果你需要在无界面的 Linux 服务器上跑 GUI 应用，项目提供了 Xvfb 部署：

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

安装完成后，文档给出的常用自检命令包括：

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/服务器：Docker（带浏览器 VNC）

Docker 部署会在浏览器里提供 noVNC（方便 OAuth/授权类操作），同时映射代理端口：

```bash
cd deploy/docker
docker compose up -d
```

你应该能访问：`http://localhost:6080/vnc_lite.html`。

## 踩坑提醒

- brew 安装失败：先确认你已安装 Homebrew，再重试 README 中的 `brew tap` / `brew install --cask`
- macOS 无法打开：优先尝试 `--no-quarantine`；已安装则用 `xattr` 清理 quarantine
- 服务器部署的局限：Headless Xvfb 本质是“用虚拟显示器跑桌面程序”，资源占用会高于纯后端服务

## 本课小结

- 桌面端最推荐：Homebrew（安装与升级都省心）
- 不用 brew：直接用 GitHub Releases
- 服务器/NAS：优先 Docker；需要 systemd 管理则用 Headless Xvfb

## 下一课预告

下一课我们把“能打开”往前推进一步：弄清楚 **[数据目录、日志、托盘与自动启动](/zh/lbjlaq/Antigravity-Manager/start/first-run-data/)**，这样你遇到问题才知道从哪里排。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 主题 | 文件路径 | 行号 |
| --- | --- | --- |
| Homebrew 安装（tap + cask） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L112-L127) | 112-127 |
| Releases 手动下载（各平台安装包） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
| Arch 一键安装脚本入口 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L134-L140) | 134-140 |
| Arch 安装脚本实现（GitHub API + makepkg） | [`deploy/arch/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/arch/install.sh#L1-L56) | 1-56 |
| Headless Xvfb 安装入口（curl | sudo bash） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
| Headless Xvfb 部署/升级/运维命令 | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L1-L99) | 1-99 |
| Headless Xvfb install.sh（systemd + 8045 默认配置） | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
| Docker 部署入口（docker compose up -d） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L150-L166) | 150-166 |
| Docker 部署说明（noVNC 6080 / 代理 8045） | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L1-L35) | 1-35 |
| Docker 端口/数据卷配置（8045 + antigravity_data） | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L25) | 1-25 |
| macOS “已损坏，无法打开”排障（xattr / --no-quarantine） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L171-L186) | 171-186 |

</details>
