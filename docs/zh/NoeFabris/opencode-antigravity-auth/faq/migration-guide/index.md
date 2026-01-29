---
title: "账户迁移: 跨设备设置 | Antigravity Auth"
sidebarTitle: "换电脑继续用"
subtitle: "迁移账户：跨机器设置与版本升级"
description: "学习如何在 macOS/Linux/Windows 间迁移 Antigravity Auth 账户文件，理解存储格式自动升级机制，解决迁移后的认证问题。"
tags:
  - "迁移"
  - "跨机器"
  - "版本升级"
  - "账户管理"
prerequisite:
  - "quick-install"
order: 2
---

# 迁移账户：跨机器设置与版本升级

## 学完你能做什么

- ✅ 将账户从一台机器迁移到另一台机器
- ✅ 理解存储格式的版本变化（v1/v2/v3）
- ✅ 解决迁移后的认证问题（invalid_grant 错误）
- ✅ 在多台设备上共享同一个账户

## 你现在的困境

买了一台新电脑，需要在上面继续用 Antigravity Auth 访问 Claude 和 Gemini 3，但不想重新走一遍 OAuth 认证流程。或者升级插件版本后，发现原来的账户数据无法使用。

## 什么时候用这一招

- 📦 **换新设备**：从旧电脑迁移到新电脑
- 🔄 **多设备同步**：在台式机和笔记本间共享账户
- 🆙 **版本升级**：插件升级后存储格式变化
- 💾 **备份恢复**：定期备份账户数据

## 核心思路

**账户迁移**是将账户文件（antigravity-accounts.json）从一台机器复制到另一台机器的过程。插件会自动处理存储格式版本升级。

### 迁移机制概览

存储格式有版本控制（当前是 v3），插件会**自动处理版本迁移**：

| 版本 | 主要变化 | 当前状态 |
|--- | --- | ---|
| v1 → v2 | 速率限制状态结构化 | ✅ 自动迁移 |
| v2 → v3 | 支持双配额池（gemini-antigravity/gemini-cli） | ✅ 自动迁移 |

存储文件位置（跨平台）：

| 平台 | 路径 |
|--- | ---|
| macOS/Linux | `~/.config/opencode/antigravity-accounts.json` |
| Windows | `%APPDATA%\opencode\antigravity-accounts.json` |

::: tip 安全提醒
账户文件包含 OAuth refresh token，**相当于密码**。传输时请使用加密方式（如 SFTP、加密 ZIP）。
:::

## 🎒 开始前的准备

- [ ] 目标机器已安装 OpenCode
- [ ] 目标机器已安装 Antigravity Auth 插件：`opencode plugin add opencode-antigravity-auth@beta`
- [ ] 确保两台机器能安全传输文件（SSH、U 盘等）

## 跟我做

### 第 1 步：在源机器上找到账户文件

**为什么**
需要定位包含账户信息的 JSON 文件。

```bash
# macOS/Linux
ls -la ~/.config/opencode/antigravity-accounts.json

# Windows PowerShell
Get-ChildItem "$env:APPDATA\opencode\antigravity-accounts.json"
```

**你应该看到**：文件存在，包含类似内容：

```json
{
  "version": 3,
  "accounts": [...],
  "activeIndex": 0
}
```

如果文件不存在，说明还没添加账户，请先运行 `opencode auth login`。

### 第 2 步：复制账户文件到目标机器

**为什么**
将账户信息（refresh token 和 Project ID）传输到新设备。

::: code-group

```bash [macOS/Linux]
# 方法 1：使用 scp（通过 SSH）
scp ~/.config/opencode/antigravity-accounts.json user@new-machine:/tmp/

# 方法 2：使用 U 盘
cp ~/.config/opencode/antigravity-accounts.json /Volumes/USB/
```

```powershell [Windows]
# 方法 1：使用 PowerShell Copy-Item（通过 SMB）
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "\\new-machine\c$\Users\user\Downloads\"

# 方法 2：使用 U 盘
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "E:\"
```

:::

**你应该看到**：文件成功复制到目标机器的临时目录（如 `/tmp/` 或 `Downloads/`）。

### 第 3 步：在目标机器上安装插件

**为什么**
确保目标机器的插件版本兼容。

```bash
opencode plugin add opencode-antigravity-auth@beta
```

**你应该看到**：插件安装成功提示。

### 第 4 步：将文件放到正确位置

**为什么**
插件只会在固定路径查找账户文件。

::: code-group

```bash [macOS/Linux]
# 创建目录（如果不存在）
mkdir -p ~/.config/opencode

# 复制文件
cp /tmp/antigravity-accounts.json ~/.config/opencode/

# 验证权限
chmod 600 ~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
# 复制文件（目录会自动创建）
Copy-Item "$env:Downloads\antigravity-accounts.json" "$env:APPDATA\opencode\"

# 验证
Test-Path "$env:APPDATA\opencode\antigravity-accounts.json"
```

:::

**你应该看到**：文件存在于配置目录。

### 第 5 步：验证迁移结果

**为什么**
确认账户已正确加载。

```bash
# 列出账户（会触发插件加载账户文件）
opencode auth login

# 如果已有账户，会显示：
# 2 account(s) saved:
#   1. user1@gmail.com
#   2. user2@gmail.com
# (a)dd new account(s) or (f)resh start? [a/f]:
```

按 `Ctrl+C` 退出（不需要添加新账户）。

**你应该看到**：插件成功识别账户列表，包括迁移过来的账户邮箱。

### 第 6 步：测试首次请求

**为什么**
验证 refresh token 仍然有效。

```bash
# 在 OpenCode 中发起一个测试请求
# 选择：google/antigravity-gemini-3-flash
```

**你应该看到**：模型正常响应。

## 检查点 ✅

- [ ] 目标机器能列出迁移过来的账户
- [ ] 测试请求成功（无认证错误）
- [ ] 插件日志无错误提示

## 踩坑提醒

### 问题 1："API key missing" 错误

**现象**：迁移后请求报错 `API key missing`。

**原因**：refresh token 可能已过期或被 Google 撤销（如密码更改、安全事件）。

**解决方案**：

```bash
# 清除账户文件，重新认证
rm ~/.config/opencode/antigravity-accounts.json  # macOS/Linux
del "%APPDATA%\opencode\antigravity-accounts.json"  # Windows

opencode auth login
```

### 问题 2：插件版本不兼容

**现象**：迁移后账户文件无法加载，日志提示 `Unknown storage version`。

**原因**：目标机器的插件版本太旧，不支持当前存储格式。

**解决方案**：

```bash
# 升级到最新版本
opencode plugin add opencode-antigravity-auth@latest

# 重新测试
opencode auth login
```

### 问题 3：双配额池数据丢失

**现象**：迁移后 Gemini 模型只使用一个配额池，没有自动 fallback。

**原因**：迁移时只复制了 `antigravity-accounts.json`，但配置文件 `antigravity.json` 未迁移。

**解决方案**：

同时复制配置文件（如果启用了 `quota_fallback`）：

::: code-group

```bash [macOS/Linux]
# 复制配置文件
cp ~/.config/opencode/antigravity.json ~/.config/opencode/
```

```powershell [Windows]
# 复制配置文件
Copy-Item "$env:APPDATA\opencode\antigravity.json" "$env:APPDATA\opencode\"
```

:::

### 问题 4：文件权限错误

**现象**：macOS/Linux 上提示 `Permission denied`。

**原因**：文件权限不正确，插件无法读取。

**解决方案**：

```bash
# 修复权限
chmod 600 ~/.config/opencode/antigravity-accounts.json
chown $USER ~/.config/opencode/antigravity-accounts.json
```

## 存储格式自动迁移详解

插件加载账户时，会自动检测存储版本并迁移：

```
v1 (旧版本)
  ↓ migrateV1ToV2()
v2
  ↓ migrateV2ToV3()
v3 (当前版本)
```

**迁移规则**：
- v1 → v2：将 `rateLimitResetTime` 拆分为 `claude` 和 `gemini` 两个字段
- v2 → v3：将 `gemini` 拆分为 `gemini-antigravity` 和 `gemini-cli`（支持双配额池）
- 自动清理：过期的速率限制时间会被过滤掉（`> Date.now()`）

::: info 自动去重
加载账户时，插件会根据邮箱自动去重，保留最新的账户（按 `lastUsed` 和 `addedAt` 排序）。
:::

## 本课小结

迁移账户的核心步骤：

1. **定位文件**：在源机器找到 `antigravity-accounts.json`
2. **复制传输**：安全传输到目标机器
3. **正确放置**：放到配置目录（`~/.config/opencode/` 或 `%APPDATA%\opencode\`）
4. **验证测试**：运行 `opencode auth login` 确认识别

插件会**自动处理版本迁移**，无需手动修改存储文件格式。但如果遇到 `invalid_grant` 错误，只能重新认证。

## 下一课预告

> 下一课我们学习 **[ToS 警告](../tos-warning/)**。
>
> 你会学到：
> - 使用 Antigravity Auth 可能面临的风险
> - 如何避免账户被封禁
> - Google 的服务条款限制

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能        | 文件路径                                                                                               | 行号    |
|--- | --- | ---|
| 存储格式定义 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L128-L198)         | 128-198 |
| v1→v2 迁移 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L366-L395)         | 366-395 |
| v2→v3 迁移 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L397-L431)         | 397-431 |
| 账户加载（含自动迁移） | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L433-L518) | 433-518 |
| 配置目录路径 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L202-L213)         | 202-213 |
| 文件去重逻辑 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L301-L364)         | 301-364 |

**关键接口**：

- `AccountStorageV3`（v3 存储格式）：
  ```typescript
  interface AccountStorageV3 {
    version: 3;
    accounts: AccountMetadataV3[];
    activeIndex: number;
    activeIndexByFamily?: { claude?: number; gemini?: number; };
  }
  ```

- `AccountMetadataV3`（账户元数据）：
  ```typescript
  interface AccountMetadataV3 {
    email?: string;                    // Google 账户邮箱
    refreshToken: string;              // OAuth refresh token（核心）
    projectId?: string;                // GCP 项目 ID
    managedProjectId?: string;         // 托管项目 ID
    addedAt: number;                   // 添加时间戳
    lastUsed: number;                  // 最后使用时间
    lastSwitchReason?: "rate-limit" | "initial" | "rotation";
    rateLimitResetTimes?: RateLimitStateV3;  // 速率限制重置时间（v3 支持双配额池）
    coolingDownUntil?: number;          // 冷却结束时间
    cooldownReason?: CooldownReason;   // 冷却原因
  }
  ```

- `RateLimitStateV3`（v3 速率限制状态）：
  ```typescript
  interface RateLimitStateV3 {
    claude?: number;                  // Claude 配额重置时间
    "gemini-antigravity"?: number;    // Gemini Antigravity 配额重置时间
    "gemini-cli"?: number;            // Gemini CLI 配额重置时间
  }
  ```

**关键函数**：
- `loadAccounts()`：加载账户文件，自动检测版本并迁移（storage.ts:433）
- `migrateV1ToV2()`：将 v1 格式迁移到 v2（storage.ts:366）
- `migrateV2ToV3()`：将 v2 格式迁移到 v3（storage.ts:397）
- `deduplicateAccountsByEmail()`：根据邮箱去重，保留最新账户（storage.ts:301）
- `getStoragePath()`：获取存储文件路径，跨平台兼容（storage.ts:215）

**迁移逻辑**：
- 检测 `data.version` 字段（storage.ts:446）
- v1：先迁移到 v2，再迁移到 v3（storage.ts:447-457）
- v2：直接迁移到 v3（storage.ts:458-468）
- v3：无需迁移，直接加载（storage.ts:469-470）
- 自动清理过期的速率限制时间（storage.ts:404-410）

</details>
