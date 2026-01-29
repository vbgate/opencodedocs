---
title: "部署: 服务器部署方案 | Antigravity-Manager"
sidebarTitle: "服务器上跑起来"
subtitle: "部署: 服务器部署方案"
description: "学习 Antigravity-Manager 的服务器部署方法。对比 Docker noVNC 与 Headless Xvfb 两种方案，完成安装配置、数据持久化和探活排障，建立可运维的服务器环境。"
tags:
  - "deployment"
  - "docker"
  - "xvfb"
  - "novnc"
  - "systemd"
  - "backup"
prerequisite:
  - "start-installation"
  - "start-backup-migrate"
  - "advanced-security"
duration: 20
order: 10
---
# 服务器部署：Docker noVNC vs Headless Xvfb（选型与运维）

你想做 Antigravity Tools 的服务器部署，把它跑在 NAS/服务器上，通常不是为了“把 GUI 远程打开看看”，而是为了把它当成一个长期运行的本地 API 网关：一直在线、能探活、能升级、能备份、出问题能定位。

这节课只讲两条项目里已经给出的可落地路径：Docker（带 noVNC）和 Headless Xvfb（systemd 管理）。所有命令和默认值都以仓库里的部署文件为准。

::: tip 如果你只想“先跑起来一次”
上手安装篇已经覆盖了 Docker 与 Headless Xvfb 的入口命令，你可以先看 **[安装与升级](/zh/lbjlaq/Antigravity-Manager/start/installation/)**，再回到这节课把“运维闭环”补齐。
:::

## 学完你能做什么

- 选对部署形态：知道 Docker noVNC 和 Headless Xvfb 各自解决什么问题
- 跑通一条闭环：部署 -> 同步账号数据 -> 探活 `/healthz` -> 看日志 -> 备份
- 把升级做成可控动作：知道 Docker“启动时自动更新”和 Xvfb `upgrade.sh` 的差异

## 你现在的困境

- 服务器没有桌面，但你又离不开 OAuth/授权这类“必须有浏览器”的操作
- 你只跑起来一次还不够，你更想要：断电重启后自动恢复、可探活、可备份
- 你担心把 8045 端口暴露出去会有安全风险，但又不知道该从哪里收口

## 什么时候用这一招

- NAS/家用服务器：希望用浏览器就能打开 GUI 完成授权（Docker/noVNC 很省心）
- 服务器长期运行：你更想用 systemd 管理进程、日志落盘、脚本升级（Headless Xvfb 更像“运维项目”）

## 什么是“服务器部署”模式？

**服务器部署**指的是：你不在本机桌面上运行 Antigravity Tools，而是把它放到一台长期在线的机器上运行，并把反代端口（默认 8045）作为对外服务入口。它的核心不是“远程看界面”，而是建立一套稳定的运维闭环：数据持久化、探活、日志、升级与备份。

## 核心思路

1. 先选“你最缺的能力”：缺浏览器授权就选 Docker/noVNC；缺运维可控性就选 Headless Xvfb。
2. 再把“数据”定下来：账号/配置都在 `.antigravity_tools/`，要么用 Docker volume，要么固定到 `/opt/antigravity/.antigravity_tools/`。
3. 最后做“可运维闭环”：探活用 `/healthz`，故障先看 logs，再决定重启或升级。

::: warning 前置提醒：先把安全基线定了
如果你会把 8045 暴露到局域网/公网，先看 **[安全与隐私：auth_mode、allow_lan_access，以及“不要泄露账号信息”的设计](/zh/lbjlaq/Antigravity-Manager/advanced/security/)**。
:::

## 选型速查：Docker vs Headless Xvfb

| 你最在意的点 | 更推荐 | 为什么 |
| --- | --- | --- |
| 需要浏览器做 OAuth/授权 | Docker（noVNC） | 容器内自带 Firefox ESR，可直接在浏览器里操作（见 `deploy/docker/README.md`） |
| 想要 systemd 管理/日志落盘 | Headless Xvfb | install 脚本会安装 systemd service，并把日志 append 到 `logs/app.log`（见 `deploy/headless-xvfb/install.sh`） |
| 想要隔离与资源限制 | Docker | compose 方式天然隔离、也更容易配资源限制（见 `deploy/docker/README.md`） |

## 跟我做

### 第 1 步：先确认“数据目录”在哪里

**为什么**
部署成功但“没有账号/配置”，本质上就是数据目录没带过去或没持久化。

- Docker 方案会把数据挂载到容器内的 `/home/antigravity/.antigravity_tools`（compose volume）
- Headless Xvfb 方案会把数据放在 `/opt/antigravity/.antigravity_tools`（并通过 `HOME=$(pwd)` 固定写入位置）

**你应该看到**
- Docker：`docker volume ls` 能看到 `antigravity_data`
- Xvfb：`/opt/antigravity/.antigravity_tools/` 存在，并包含 `accounts/`、`gui_config.json`

### 第 2 步：Docker/noVNC 跑起来（适合需要浏览器授权）

**为什么**
Docker 方案把“虚拟显示器 + 窗口管理器 + noVNC + 应用 + 浏览器”打包进一个容器，省去了你在服务器上装一堆图形依赖。

在服务器上执行：

```bash
cd deploy/docker
docker compose up -d
```

打开 noVNC：

```text
http://<server-ip>:6080/vnc_lite.html
```

**你应该看到**
- `docker compose ps` 显示容器在运行
- 浏览器能打开 noVNC 页面

::: tip 关于 noVNC 端口（推荐保持默认）
`deploy/docker/README.md` 提到可以用 `NOVNC_PORT` 自定义端口，但当前实现中 `start.sh` 启动 `websockify` 时监听的是写死的 6080 端口。要修改端口需要同时调整 docker-compose 的端口映射和 start.sh 的监听端口。

为了避免配置不一致，推荐直接使用默认 6080。
:::

### 第 3 步：Docker 的持久化、探活与备份

**为什么**
容器的可用性靠两件事：进程健康（是否还在跑）和数据持久化（重启后账号还在）。

1) 确认持久化 volume 已挂载：

```bash
cd deploy/docker
docker compose ps
```

2) 备份 volume（项目 README 给了 tar 备份方式）：

```bash
docker run --rm -v antigravity_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/antigravity-backup.tar.gz /data
```

3) 容器健康检查（Dockerfile 有 HEALTHCHECK）：

```bash
docker inspect --format '{{json .State.Health}}' antigravity-manager | jq
```

**你应该看到**
- `.State.Health.Status` 为 `healthy`
- 当前目录生成 `antigravity-backup.tar.gz`

### 第 4 步：Headless Xvfb 一键安装（适合想要 systemd 运维）

**为什么**
Headless Xvfb 不是“纯后端模式”，而是用虚拟显示器把 GUI 程序跑在服务器上；但它换来了更熟悉的运维方式：systemd、固定目录、日志落盘。

在服务器上执行（项目提供的一键脚本）：

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

**你应该看到**
- 目录 `/opt/antigravity/` 存在
- `systemctl status antigravity` 显示服务 running

::: tip 更稳的做法：先审查脚本
`curl -O .../install.sh` 下载后先看一遍，再 `sudo bash install.sh`。
:::

### 第 5 步：把本机账号同步到服务器（Xvfb 方案必做）

**为什么**
Xvfb 安装只是把程序跑起来。要让反代真的能用，你需要把本机已有的账号/配置同步到服务器的数据目录。

项目提供了 `sync.sh`，会自动在你的机器上按优先级搜索数据目录（如 `~/.antigravity_tools`、`~/Library/Application Support/Antigravity Tools`），然后 rsync 到服务器：

```bash
curl -O https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/sync.sh
chmod +x sync.sh

./sync.sh root@your-server /opt/antigravity
```

**你应该看到**
- 终端输出类似：`同步: <local> -> root@your-server:/opt/antigravity/.antigravity_tools/`
- 远程服务被尝试重启（脚本会调用 `systemctl restart antigravity`）

### 第 6 步：探活与排障（两种方案通用）

**为什么**
部署后的第一件事不是“先接客户端”，而是先建立一个能快速判断健康状况的入口。

1) 探活（反代服务提供 `/healthz`）：

```bash
curl -i http://127.0.0.1:8045/healthz
```

2) 看日志：

```bash
## Docker
cd deploy/docker
docker compose logs -f

## Headless Xvfb
tail -f /opt/antigravity/logs/app.log
```

**你应该看到**
- `/healthz` 返回 200（具体响应体以实际为准）
- 日志里能看到反代服务启动信息

### 第 7 步：升级策略（不要把“自动更新”当成唯一方案）

**为什么**
升级是最容易“把系统升级到不可用”的动作。你需要知道每种方案的升级到底做了什么。

- Docker：容器启动时会尝试通过 GitHub API 拉取最新 `.deb` 并安装（如果限流或网络异常，会继续用缓存版本）。
- Headless Xvfb：用 `upgrade.sh` 拉取最新 AppImage，并在重启失败时回滚到备份。

Headless Xvfb 升级命令（项目 README）：

```bash
cd /opt/antigravity
sudo ./upgrade.sh
```

**你应该看到**
- 输出类似：`升级: v<current> -> v<latest>`
- 升级后服务仍是 active（脚本会 `systemctl restart antigravity` 并检查状态）

## 踩坑提醒

| 场景 | 常见错误（❌） | 推荐做法（✓） |
| --- | --- | --- |
| 账号/配置丢失 | ❌ 只关心“程序跑起来” | ✓ 先确认 `.antigravity_tools/` 是持久化的（volume 或 `/opt/antigravity`） |
| noVNC 端口改不生效 | ❌ 只改 `NOVNC_PORT` | ✓ 保持默认 6080；要改就同时核对 `start.sh` 里 `websockify` 端口 |
| 把 8045 暴露到公网 | ❌ 不设 `api_key`/不看 auth_mode | ✓ 先按 **[安全与隐私](/zh/lbjlaq/Antigravity-Manager/advanced/security/)** 做基线，再考虑隧道/反代 |

## 本课小结

- Docker/noVNC 解决“服务器没浏览器/没桌面但要授权”的问题，适合 NAS 场景
- Headless Xvfb 更像标准运维：固定目录、systemd 管理、脚本升级/回滚
- 无论哪种方案，把闭环先做对：数据 -> 探活 -> 日志 -> 备份 -> 升级

## 推荐继续看

- 你要把服务暴露到局域网/公网：**[安全与隐私：auth_mode、allow_lan_access](/zh/lbjlaq/Antigravity-Manager/advanced/security/)**
- 部署后遇到 401：**[401/鉴权失败：auth_mode、Header 兼容与客户端配置清单](/zh/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- 你想用隧道暴露服务：**[Cloudflared 一键隧道](/zh/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| Docker 部署入口与 noVNC URL | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L5-L13) | 5-13 |
| Docker 部署环境变量说明（VNC_PASSWORD/RESOLUTION/NOVNC_PORT） | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L32-L39) | 32-39 |
| Docker compose 端口映射与数据卷（antigravity_data） | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L21) | 1-21 |
| Docker 启动脚本：自动更新版本（GitHub rate limit） | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L27-L58) | 27-58 |
| Docker 启动脚本：启动 Xtigervnc/Openbox/noVNC/应用 | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L60-L78) | 60-78 |
| Docker 健康检查：确认 Xtigervnc/websockify/antigravity_tools 进程存在 | [`deploy/docker/Dockerfile`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/Dockerfile#L60-L79) | 60-79 |
| Headless Xvfb：目录结构与运维命令（systemctl/healthz） | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L19-L78) | 19-78 |
| Headless Xvfb：install.sh 安装依赖与初始化 gui_config.json（默认 8045） | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L16-L67) | 16-67 |
| Headless Xvfb：sync.sh 自动发现本地数据目录并 rsync 到服务器 | [`deploy/headless-xvfb/sync.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/sync.sh#L8-L32) | 8-32 |
| Headless Xvfb：upgrade.sh 下载新版本并在失败时回滚 | [`deploy/headless-xvfb/upgrade.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/upgrade.sh#L11-L51) | 11-51 |
| 反代服务探活端点 `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |

</details>
