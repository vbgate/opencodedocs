---
title: "定时任务 - Cron 与自动化工作流 | OpenClaw 教程"
sidebarTitle: "定时任务"
subtitle: "定时任务 - Cron 与自动化工作流"
description: "学习如何配置 Cron 作业、定时触发 Agent 执行任务、设计自动化工作流，实现无人值守的 AI 自动化。"
tags:
  - "Cron"
  - "定时任务"
  - "自动化"
order: 130
---

# 定时任务 - Cron 与自动化工作流

## 学完你能做什么

完成本课程后，你将能够：
- 配置 Cron 作业定时执行任务
- 设计自动化工作流
- 管理定时任务的执行和状态
- 设置任务保留策略

## 核心思路

OpenClaw 的 Cron 系统允许你定时触发 Agent 执行任务，实现各种自动化场景：定时报告、数据同步、监控告警等。

```
┌─────────────────────────────────────────────────────────────┐
│                    Cron 系统架构                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              Cron Scheduler                         │  │
│   │  ┌───────────────────────────────────────────────┐  │  │
│   │  │  Cron Expression                              │  │  │
│   │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │  │  │
│   │  │  │0 9 * * *│ │*/5 * * *│ │0 0 * * 1│         │  │  │
│   │  │  │每天 9点 │ │每5分钟 │ │每周一   │         │  │  │
│   │  │  └────┬────┘ └────┬────┘ └────┬────┘         │  │  │
│   │  │       │           │           │               │  │  │
│   │  │       └───────────┴───────────┘               │  │  │
│   │  │                   │                           │  │  │
│   │  │                   ▼                           │  │  │
│   │  │         ┌─────────────────┐                  │  │  │
│   │  │         │  Job Queue      │                  │  │  │
│   │  │         │  (优先级排序)    │                  │  │  │
│   │  └─────────┴─────────────────┴──────────────────┘  │  │
│   │                        │                           │  │
│   │                        ▼                           │  │
│   │         ┌─────────────────────────┐               │  │
│   │         │   Job Executor          │               │  │
│   │         │   - 并发控制            │               │  │
│   │         │   - 超时处理            │               │  │
│   │         │   - 重试机制            │               │  │
│   │         └───────────┬─────────────┘               │  │
│   └─────────────────────┼─────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│              ┌────────────────────┐                     │
│              │   Agent Runner     │                     │
│              │   执行具体任务     │                     │
│              └────────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cron 表达式格式

OpenClaw 使用标准 Unix Cron 格式：

```
┌───────────── 分钟 (0 - 59)
│ ┌───────────── 小时 (0 - 23)
│ │ ┌───────────── 日期 (1 - 31)
│ │ │ ┌───────────── 月份 (1 - 12)
│ │ │ │ ┌───────────── 星期 (0 - 6, 0=周日)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**常用表达式示例**

| 表达式 | 说明 |
|--------|------|
| `0 9 * * *` | 每天上午 9:00 |
| `*/5 * * * *` | 每 5 分钟 |
| `0 */2 * * *` | 每 2 小时 |
| `0 0 * * 1` | 每周一凌晨 |
| `0 0 1 * *` | 每月 1 号 |
| `0 0 * * *` | 每天午夜 |

## 跟我做

### 第 1 步：启用 Cron 服务

**为什么**  
Cron 服务需要显式启用才能运行定时任务。

```bash
# 启用 Cron 服务
openclaw config set cron.enabled true

# 配置最大并发数（默认 3）
openclaw config set cron.maxConcurrentRuns 5

# 配置会话保留时间（默认 24h）
openclaw config set cron.sessionRetention "48h"

# 重启 Gateway 生效
openclaw gateway restart
```

**Cron 配置类型** (`src/config/types.cron.ts`)

```typescript
type CronConfig = {
  enabled?: boolean;              // 是否启用
  store?: string;                 // 存储路径
  maxConcurrentRuns?: number;     // 最大并发数
  sessionRetention?: string | false;  // 会话保留时间
};
```

### 第 2 步：创建定时任务

**为什么**  
定义要定时执行的任务。

```bash
# 创建简单的定时任务
openclaw cron create \
  --name "daily-report" \
  --schedule "0 9 * * *" \
  --agent default \
  --message "生成昨日数据报告"

# 创建带参数的任务
openclaw cron create \
  --name "health-check" \
  --schedule "*/10 * * * *" \
  --agent monitor \
  --message "检查系统健康状态" \
  --thinking low
```

**你应该看到**

```
✅ Cron job created successfully
   ID: cron_daily-report_20240214
   Name: daily-report
   Schedule: 0 9 * * *
   Next run: 2024-02-15 09:00:00
```

### 第 3 步：管理定时任务

**为什么**  
查看、编辑和删除已创建的定时任务。

```bash
# 列出所有定时任务
openclaw cron list

# 查看任务详情
openclaw cron show daily-report

# 暂停任务
openclaw cron pause daily-report

# 恢复任务
openclaw cron resume daily-report

# 立即运行一次
openclaw cron run daily-report

# 删除任务
openclaw cron delete daily-report
```

### 第 4 步：配置任务输出

**为什么**  
定时任务的输出需要被记录和通知。

```bash
# 创建带通知的任务
openclaw cron create \
  --name "backup-check" \
  --schedule "0 2 * * *" \
  --message "检查备份状态" \
  --deliver-to "+86138xxxxxxxx" \
  --channel whatsapp

# 创建输出到文件的任务
openclaw cron create \
  --name "log-cleanup" \
  --schedule "0 3 * * 0" \
  --message "清理旧日志文件" \
  --output "/var/log/openclaw/cron.log"
```

### 第 5 步：配置高级任务选项

**为什么**  
复杂任务可能需要更多控制选项。

```bash
# 带超时设置的任务
openclaw cron create \
  --name "data-sync" \
  --schedule "0 */6 * * *" \
  --message "同步数据库" \
  --timeout 1800

# 带重试的任务
openclaw cron create \
  --name "api-fetch" \
  --schedule "0 */2 * * *" \
  --message "获取 API 数据" \
  --retries 3 \
  --retry-delay 60

# 使用特定模型
openclaw cron create \
  --name "complex-analysis" \
  --schedule "0 0 * * 1" \
  --message "分析周报数据" \
  --model anthropic/claude-3-opus
```

### 第 6 步：使用配置文件定义任务

**为什么**  
复杂的工作流可以通过配置文件管理。

```json
{
  "cron": {
    "enabled": true,
    "maxConcurrentRuns": 5,
    "sessionRetention": "48h",
    "jobs": [
      {
        "id": "daily-report",
        "name": "每日报告",
        "schedule": "0 9 * * *",
        "agent": "default",
        "message": "生成昨日数据报告",
        "options": {
          "thinking": "medium",
          "timeout": 300
        },
        "delivery": {
          "enabled": true,
          "channel": "telegram",
          "to": "@myusername"
        }
      },
      {
        "id": "health-check",
        "name": "健康检查",
        "schedule": "*/10 * * * *",
        "agent": "monitor",
        "message": "检查系统健康状态",
        "options": {
          "thinking": "low"
        },
        "onFailure": {
          "retry": 3,
          "notify": true
        }
      },
      {
        "id": "weekly-cleanup",
        "name": "每周清理",
        "schedule": "0 3 * * 0",
        "agent": "maintenance",
        "message": "执行系统维护任务：\n1. 清理临时文件\n2. 压缩日志\n3. 检查磁盘空间",
        "enabled": true
      }
    ]
  }
}
```

## 检查点 ✅

验证 Cron 配置：

```bash
# 检查 Cron 服务状态
openclaw cron status

# 预期输出
┌─────────────────────────────────────────────────────────────┐
│  Cron Service Status                                        │
├─────────────────────────────────────────────────────────────┤
│  Status:           ✅ Running                               │
│  Max Concurrent:   5                                        │
│  Active Jobs:      3                                        │
│  Session Retention: 48h                                     │
└─────────────────────────────────────────────────────────────┘

# 查看即将执行的任务
openclaw cron upcoming

# 预期输出
┌─────────────────────────────────────────────────────────────┐
│  Upcoming Jobs                                              │
├─────────────────────────────────────────────────────────────┤
│  09:00  daily-report       生成昨日数据报告                │
│  09:10  health-check       检查系统健康状态                │
│  09:20  health-check       检查系统健康状态                │
└─────────────────────────────────────────────────────────────┘
```

## 自动化工作流示例

### 示例 1：每日数据报告

```bash
# 创建日报任务
openclaw cron create \
  --name "daily-sales-report" \
  --schedule "0 9 * * *" \
  --agent "data-analyst" \
  --message "请分析昨日销售数据并生成报告：\n\n1. 总销售额\n2. 热销产品 TOP 5\n3. 异常订单分析\n\n数据库连接技能已启用。" \
  --thinking medium \
  --deliver-to "team@company.com"
```

### 示例 2：监控告警

```bash
# 创建监控任务
openclaw cron create \
  --name "server-monitor" \
  --schedule "*/5 * * * *" \
  --agent "monitor" \
  --message "检查服务器状态：\n\n1. CPU 使用率\n2. 内存使用率\n3. 磁盘空间\n4. 关键服务状态\n\n如果任何指标异常，立即告警。" \
  --thinking low \
  --timeout 60 \
  --retries 2
```

### 示例 3：内容发布

```bash
# 创建内容发布任务
openclaw cron create \
  --name "blog-publish" \
  --schedule "0 10 * * 1,3,5" \
  --agent "content-writer" \
  --message "基于以下主题撰写博客文章并发布：\n\n1. 读取 content-queue.md 获取本周主题\n2. 撰写 800-1000 字文章\n3. 使用浏览器工具发布到网站\n4. 在社交媒体分享" \
  --thinking high \
  --model anthropic/claude-3-5-sonnet
```

## 踩坑提醒

::: warning 常见问题
1. **Cron 服务未启动**  
   症状：`Cron service is disabled`  
   解决：设置 `cron.enabled: true` 并重启 Gateway

2. **任务不执行**  
   症状：到时间了任务没运行  
   解决：检查 `cron.enabled`，查看 `openclaw cron list` 确认任务状态

3. **任务重叠**  
   症状：前一个任务没完成，下一个又开始  
   解决：增加任务间隔，或调整 `maxConcurrentRuns`

4. **时区问题**  
   症状：任务在错误时间执行  
   解决：确保系统时区设置正确，或明确指定时区

5. **会话堆积**  
   症状：磁盘空间不断增长  
   解决：调整 `sessionRetention` 设置，定期清理旧会话
:::

## 本课小结

在本课程中，你学习了：

- ✅ Cron 系统的架构和工作原理
- ✅ Cron 表达式格式和常用模式
- ✅ 启用和配置 Cron 服务
- ✅ 创建、管理和删除定时任务
- ✅ 配置任务输出和通知
- ✅ 使用配置文件定义复杂工作流
- ✅ 实际自动化工作流示例

## 下一课预告

> 下一课我们学习 **[Tailscale 远程访问](../tailscale-remote/)**。
>
> 你会学到：
> - Tailscale Serve/Funnel 配置
> - 安全的远程访问方案
> - mDNS/Bonjour 设备发现

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Cron 服务实现 | [`src/cron/service.ts`](https://github.com/openclaw/openclaw/blob/main/src/cron/service.ts) | - |
| Gateway Cron 调度 | [`src/gateway/server-cron.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-cron.ts) | - |
| Cron 配置类型 | [`src/config/types.cron.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.cron.ts) | 1-12 |

**Cron 配置选项**：
- `enabled`: 启用/禁用 Cron 服务
- `store`: 任务存储路径
- `maxConcurrentRuns`: 最大并发任务数
- `sessionRetention`: 会话保留时间（如 "24h", "7d", "1h30m"）

</details>
