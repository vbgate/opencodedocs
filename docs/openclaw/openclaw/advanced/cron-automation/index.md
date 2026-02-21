---
title: "Cron Jobs and Automation Workflows | OpenClaw Tutorial"
sidebarTitle: "Cron Jobs"
subtitle: "Cron Jobs and Automation Workflows"
description: "Learn how to configure Cron jobs, schedule Agents to run tasks, design automation workflows, and achieve unattended AI automation."
tags:
  - "Cron"
  - "Scheduled Tasks"
  - "Automation"
order: 130
---

# Cron Jobs and Automation Workflows

## What You'll Learn

After completing this course, you will be able to:
- Configure Cron jobs to run tasks on a schedule
- Design automation workflows
- Manage task execution and status
- Set up session retention policies

## Core Concepts

OpenClaw's Cron system allows you to trigger Agents at scheduled intervals, enabling various automation scenarios: scheduled reports, data synchronization, monitoring alerts, and more.

```
┌─────────────────────────────────────────────────────────────┐
│                    Cron System Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              Cron Scheduler                         │  │
│   │  ┌───────────────────────────────────────────────┐  │  │
│   │  │  Cron Expression                              │  │  │
│   │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │  │  │
│   │  │  │0 9 * * *│ │*/5 * * *│ │0 0 * * 1│         │  │  │
│   │  │  │9 AM Daily│ │Every 5min│ │Monday   │         │  │  │
│   │  │  └────┬────┘ └────┬────┘ └────┬────┘         │  │  │
│   │  │       │           │           │               │  │  │
│   │  │       └───────────┴───────────┘               │  │  │
│   │  │                   │                           │  │  │
│   │  │                   ▼                           │  │  │
│   │  │         ┌─────────────────┐                  │  │  │
│   │  │         │  Job Queue      │                  │  │  │
│   │  │         │  (Priority Sorted)                  │  │  │
│   │  └─────────┴─────────────────┴──────────────────┘  │  │
│   │                        │                           │  │
│   │                        ▼                           │  │
│   │         ┌─────────────────────────┐               │  │
│   │         │   Job Executor          │               │  │
│   │         │   - Concurrency Control │               │  │
│   │         │   - Timeout Handling    │               │  │
│   │         │   - Retry Mechanism     │               │  │
│   │         └───────────┬─────────────┘               │  │
│   └─────────────────────┼─────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│              ┌────────────────────┐                     │
│              │   Agent Runner     │                     │
│              │   Execute Tasks    │                     │
│              └────────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cron Expression Format

OpenClaw uses standard Unix Cron format:

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6, 0=Sunday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Common Expression Examples**

| Expression | Description |
|------------|-------------|
| `0 9 * * *` | Every day at 9:00 AM |
| `*/5 * * * *` | Every 5 minutes |
| `0 */2 * * *` | Every 2 hours |
| `0 0 * * 1` | Every Monday at midnight |
| `0 0 1 * *` | 1st of every month |
| `0 0 * * *` | Every day at midnight |

## Follow Along

### Step 1: Enable Cron Service

**Why**  
The Cron service must be explicitly enabled to run scheduled tasks.

```bash
# Enable Cron service
openclaw config set cron.enabled true

# Configure max concurrent jobs (default: 3)
openclaw config set cron.maxConcurrentRuns 5

# Configure session retention time (default: 24h)
openclaw config set cron.sessionRetention "48h"

# Restart Gateway to apply changes
openclaw gateway restart
```

**Cron Configuration Types** (`src/config/types.cron.ts`)

```typescript
type CronConfig = {
  enabled?: boolean;              // Whether to enable
  store?: string;                 // Storage path
  maxConcurrentRuns?: number;     // Max concurrent jobs
  sessionRetention?: string | false;  // Session retention time
};
```

### Step 2: Create Scheduled Jobs

**Why**  
Define tasks to be executed on a schedule.

```bash
# Create a simple scheduled job
openclaw cron create \
  --name "daily-report" \
  --schedule "0 9 * * *" \
  --agent default \
  --message "Generate yesterday's data report"

# Create a job with parameters
openclaw cron create \
  --name "health-check" \
  --schedule "*/10 * * * *" \
  --agent monitor \
  --message "Check system health status" \
  --thinking low
```

**You should see**

```
✅ Cron job created successfully
   ID: cron_daily-report_20240214
   Name: daily-report
   Schedule: 0 9 * * *
   Next run: 2024-02-15 09:00:00
```

### Step 3: Manage Scheduled Jobs

**Why**  
View, edit, and delete existing scheduled jobs.

```bash
# List all scheduled jobs
openclaw cron list

# View job details
openclaw cron show daily-report

# Pause a job
openclaw cron pause daily-report

# Resume a job
openclaw cron resume daily-report

# Run a job immediately
openclaw cron run daily-report

# Delete a job
openclaw cron delete daily-report
```

### Step 4: Configure Job Output

**Why**  
Scheduled job outputs need to be logged and notified.

```bash
# Create a job with notifications
openclaw cron create \
  --name "backup-check" \
  --schedule "0 2 * * *" \
  --message "Check backup status" \
  --deliver-to "+86138xxxxxxxx" \
  --channel whatsapp

# Create a job that outputs to file
openclaw cron create \
  --name "log-cleanup" \
  --schedule "0 3 * * 0" \
  --message "Clean up old log files" \
  --output "/var/log/openclaw/cron.log"
```

### Step 5: Configure Advanced Job Options

**Why**  
Complex jobs may require additional control options.

```bash
# Job with timeout setting
openclaw cron create \
  --name "data-sync" \
  --schedule "0 */6 * * *" \
  --message "Sync database" \
  --timeout 1800

# Job with retries
openclaw cron create \
  --name "api-fetch" \
  --schedule "0 */2 * * *" \
  --message "Fetch API data" \
  --retries 3 \
  --retry-delay 60

# Use specific model
openclaw cron create \
  --name "complex-analysis" \
  --schedule "0 0 * * 1" \
  --message "Analyze weekly report data" \
  --model anthropic/claude-3-opus
```

### Step 6: Define Jobs Using Configuration File

**Why**  
Complex workflows can be managed through configuration files.

```json
{
  "cron": {
    "enabled": true,
    "maxConcurrentRuns": 5,
    "sessionRetention": "48h",
    "jobs": [
      {
        "id": "daily-report",
        "name": "Daily Report",
        "schedule": "0 9 * * *",
        "agent": "default",
        "message": "Generate yesterday's data report",
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
        "name": "Health Check",
        "schedule": "*/10 * * * *",
        "agent": "monitor",
        "message": "Check system health status",
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
        "name": "Weekly Cleanup",
        "schedule": "0 3 * * 0",
        "agent": "maintenance",
        "message": "Execute system maintenance tasks:\n1. Clean up temp files\n2. Compress logs\n3. Check disk space",
        "enabled": true
      }
    ]
  }
}
```

## Checkpoint ✅

Verify Cron configuration:

```bash
# Check Cron service status
openclaw cron status

# Expected output
┌─────────────────────────────────────────────────────────────┐
│  Cron Service Status                                        │
├─────────────────────────────────────────────────────────────┤
│  Status:           ✅ Running                               │
│  Max Concurrent:   5                                        │
│  Active Jobs:      3                                        │
│  Session Retention: 48h                                     │
└─────────────────────────────────────────────────────────────┘

# View upcoming jobs
openclaw cron upcoming

# Expected output
┌─────────────────────────────────────────────────────────────┐
│  Upcoming Jobs                                              │
├─────────────────────────────────────────────────────────────┤
│  09:00  daily-report       Generate yesterday's data report │
│  09:10  health-check       Check system health status       │
│  09:20  health-check       Check system health status       │
└─────────────────────────────────────────────────────────────┘
```

## Automation Workflow Examples

### Example 1: Daily Data Report

```bash
# Create daily report job
openclaw cron create \
  --name "daily-sales-report" \
  --schedule "0 9 * * *" \
  --agent "data-analyst" \
  --message "Please analyze yesterday's sales data and generate a report:\n\n1. Total sales\n2. Top 5 best-selling products\n3. Abnormal order analysis\n\nDatabase connection skill is enabled." \
  --thinking medium \
  --deliver-to "team@company.com"
```

### Example 2: Monitoring Alerts

```bash
# Create monitoring job
openclaw cron create \
  --name "server-monitor" \
  --schedule "*/5 * * * *" \
  --agent "monitor" \
  --message "Check server status:\n\n1. CPU usage\n2. Memory usage\n3. Disk space\n4. Critical service status\n\nAlert immediately if any metrics are abnormal." \
  --thinking low \
  --timeout 60 \
  --retries 2
```

### Example 3: Content Publishing

```bash
# Create content publishing job
openclaw cron create \
  --name "blog-publish" \
  --schedule "0 10 * * 1,3,5" \
  --agent "content-writer" \
  --message "Write a blog post based on the following topic and publish it:\n\n1. Read content-queue.md to get this week's topics\n2. Write an 800-1000 word article\n3. Use browser tool to publish to website\n4. Share on social media" \
  --thinking high \
  --model anthropic/claude-3-5-sonnet
```

## Pitfall Warnings

::: warning Common Issues
1. **Cron service not started**  
   Symptom: `Cron service is disabled`  
   Solution: Set `cron.enabled: true` and restart Gateway

2. **Jobs not executing**  
   Symptom: Job didn't run at scheduled time  
   Solution: Check `cron.enabled`, use `openclaw cron list` to verify job status

3. **Job overlap**  
   Symptom: Previous job hasn't finished when next one starts  
   Solution: Increase job interval, or adjust `maxConcurrentRuns`

4. **Timezone issues**  
   Symptom: Jobs run at wrong times  
   Solution: Ensure system timezone is set correctly, or explicitly specify timezone

5. **Session accumulation**  
   Symptom: Disk space keeps growing  
   Solution: Adjust `sessionRetention` settings, regularly clean up old sessions
:::

## Summary

In this course, you learned:

- ✅ Cron system architecture and how it works
- ✅ Cron expression format and common patterns
- ✅ Enable and configure Cron service
- ✅ Create, manage, and delete scheduled jobs
- ✅ Configure job output and notifications
- ✅ Use configuration files to define complex workflows
- ✅ Real-world automation workflow examples

## Next Lesson Preview

> Next lesson: **[Tailscale Remote Access](../tailscale-remote/)**.
>
> You'll learn:
> - Tailscale Serve/Funnel configuration
> - Secure remote access solutions
> - mDNS/Bonjour device discovery

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
|---------|-----------|--------------|
| Cron service implementation | [`src/cron/service.ts`](https://github.com/openclaw/openclaw/blob/main/src/cron/service.ts) | - |
| Gateway Cron scheduler | [`src/gateway/server-cron.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-cron.ts) | - |
| Cron config types | [`src/config/types.cron.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.cron.ts) | 1-12 |

**Cron Configuration Options**:
- `enabled`: Enable/disable Cron service
- `store`: Job storage path
- `maxConcurrentRuns`: Maximum concurrent jobs
- `sessionRetention`: Session retention time (e.g., "24h", "7d", "1h30m")

</details>
