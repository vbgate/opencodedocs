---
title: "CI/CD：非互動式整合 | OpenSkills"
sidebarTitle: "一鍵搞定 CI/CD"
subtitle: "CI/CD：非互動式整合 | OpenSkills"
description: "學習 OpenSkills CI/CD 整合，掌握 -y 標誌實現非互動式安裝和同步。包含 GitHub Actions、Docker 實戰範例，自動化技能管理。"
tags:
  - "進階"
  - "CI/CD"
  - "自動化"
  - "部署"
prerequisite:
  - "start-first-skill"
  - "start-sync-to-agents"
  - "platforms-cli-commands"
order: 6
---

# CI/CD 整合

## 學完你能做什麼

- 理解 CI/CD 環境為什麼需要非互動式模式
- 掌握 `--yes/-y` 標誌在 `install` 和 `sync` 命令中的使用
- 學會在 GitHub Actions、GitLab CI 等 CI 平台整合 OpenSkills
- 了解 Docker 容器中的技能自動化安裝流程
- 掌握 CI/CD 環境下的技能更新和同步策略
- 避免 CI/CD 流程中的互動式提示導致的失敗

::: info 前置知識

本教程假設你已經了解了 [安裝第一個技能](../../start/first-skill/) 和 [同步技能到 AGENTS.md](../../start/sync-to-agents/)，以及基本的 [命令詳解](../../platforms/cli-commands/)。

:::

---

## 你現在的困境

你可能在本地環境已經熟練使用 OpenSkills，但在 CI/CD 環境中遇到了問題：

- **互動式提示導致失敗**：CI 流程中彈出選擇介面，無法繼續執行
- **自動化部署時需要安裝技能**：每次建置都需要重新安裝技能，但無法自動確認
- **多環境設定不同步**：開發環境、測試環境、生產環境的技能設定不一致
- **AGENTS.md 產生不自動化**：每次部署後需要手動執行 sync 命令
- **Docker 映像檔建置時缺少技能**：容器啟動後需要手動安裝技能

其實 OpenSkills 提供了 `--yes/-y` 標誌，專門用於非互動式環境，讓你在 CI/CD 流程中自動化完成所有操作。

---

## 什麼時候用這一招

**CI/CD 整合的適用場景**：

| 場景 | 是否需要非互動式模式 | 範例 |
|--- | --- | ---|
| **GitHub Actions** | ✅ 是 | 每次 PR 或 push 時自動安裝技能 |
| **GitLab CI** | ✅ 是 | 合併請求時自動同步 AGENTS.md |
| **Docker 建置** | ✅ 是 | 映像檔建置時自動安裝技能到容器 |
| **Jenkins 流水線** | ✅ 是 | 持續整合時自動更新技能 |
| **開發環境初始化腳本** | ✅ 是 | 新人拉程式碼後一鍵設定環境 |
| **生產環境部署** | ✅ 是 | 部署時自動同步最新的技能 |

::: tip 推薦做法

- **本地開發用互動式**：手動操作時可以仔細選擇要安裝的技能
- **CI/CD 用非互動式**：自動化流程中必須使用 `-y` 標誌跳過所有提示
- **環境區分策略**：不同環境使用不同的技能來源（如私有儲存庫）

:::

---

## 核心思路：非互動式模式

OpenSkills 的 `install` 和 `sync` 命令都支援 `--yes/-y` 標誌，用於跳過所有互動式提示：

**install 命令的非互動式行為**（原始碼 `install.ts:424-427`）：

```typescript
// Interactive selection (unless -y flag or single skill)
let skillsToInstall = skillInfos;

if (!options.yes && skillInfos.length > 1) {
  // 進入互動式選擇流程
  // ...
}
```

**非互動式模式特點**：

1. **跳過技能選擇**：安裝所有找到的技能
2. **自動覆蓋**：遇到已存在的技能直接覆蓋（顯示 `Overwriting: <skill-name>`）
3. **跳過衝突確認**：不詢問是否覆蓋，直接執行
4. **相容 headless 環境**：在沒有 TTY 的 CI 環境中正常運作

**warnIfConflict 函式的行為**（原始碼 `install.ts:524-527`）：

```typescript
if (skipPrompt) {
  // Auto-overwrite in non-interactive mode
  console.log(chalk.dim(`Overwriting: ${skillName}`));
  return true;
}
```

::: important 重要概念

**非互動式模式**：使用 `--yes/-y` 標誌跳過所有互動式提示，讓命令在 CI/CD、腳本、無 TTY 環境中自動執行，不依賴使用者輸入。

:::

---

## 跟我做

### 第 1 步：體驗非互動式安裝

**為什麼**
先在本地體驗非互動式模式的行為，理解它與互動式的區別。

開啟終端機，執行：

```bash
# 非互動式安裝（安裝所有找到的技能）
npx openskills install anthropics/skills --yes

# 或使用簡寫
npx openskills install anthropics/skills -y
```

**你應該看到**：

```
Cloning into '/tmp/openskills-temp-...'...
...
Found 3 skill(s)

Overwriting: codebase-reviewer
Overwriting: file-writer
Overwriting: git-helper

✅ Installed 3 skill(s)

Next: Run 'openskills sync' to generate AGENTS.md
```

**解釋**：
- 使用 `-y` 標誌後，跳過了技能選擇介面
- 所有找到的技能都被自動安裝
- 如果技能已存在，顯示 `Overwriting: <skill-name>` 並直接覆蓋
- 不會彈出任何確認對話框

---

### 第 2 步：對比互動式與非互動式

**為什麼**
透過對比，更清楚地理解兩種模式的區別和適用場景。

執行以下命令，對比兩種模式：

```bash
# 清空現有技能（用於測試）
rm -rf .claude/skills

# 互動式安裝（會彈出選擇介面）
echo "=== 互動式安裝 ==="
npx openskills install anthropics/skills

# 清空現有技能
rm -rf .claude/skills

# 非互動式安裝（自動安裝所有技能）
echo "=== 非互動式安裝 ==="
npx openskills install anthropics/skills -y
```

**你應該看到**：

**互動式模式**：
- 顯示技能列表，讓你用空白鍵勾選
- 需要按 Enter 確認
- 可以選擇性地安裝部分技能

**非互動式模式**：
- 直接顯示安裝過程
- 自動安裝所有技能
- 不需要任何使用者輸入

**對比表格**：

| 特性 | 互動式模式（預設） | 非互動式模式（-y） |
|--- | --- | ---|
| **技能選擇** | 彈出選擇介面，手動勾選 | 自動安裝所有找到的技能 |
| **覆蓋確認** | 詢問是否覆蓋已存在的技能 | 自動覆蓋，顯示提示資訊 |
| **TTY 要求** | 需要互動式終端機 | 不需要，可在 CI 環境運作 |
| **適用場景** | 本地開發、手動操作 | CI/CD、腳本、自動化流程 |
| **輸入要求** | 需要使用者輸入 | 零輸入，自動執行 |

---

### 第 3 步：非互動式同步 AGENTS.md

**為什麼**
學會在自動化流程中產生 AGENTS.md，讓 AI 代理始終使用最新的技能列表。

執行：

```bash
# 非互動式同步（同步所有技能到 AGENTS.md）
npx openskills sync -y

# 查看產生的 AGENTS.md
cat AGENTS.md | head -20
```

**你應該看到**：

```
✅ Synced 3 skill(s) to AGENTS.md
```

AGENTS.md 內容：

```xml
<skills_system>
This project uses the OpenSkills system for AI agent extensibility.

Usage:
- Ask the AI agent to load specific skills using: "Use the <skill-name> skill"
- The agent will read the skill definition from .claude/skills/<skill-name>/SKILL.md
- Skills provide specialized capabilities like code review, file writing, etc.
</skills_system>

<available_skills>
  <skill name="codebase-reviewer">
    <description>Review code changes for issues...</description>
  </skill>
  <skill name="file-writer">
    <description>Write files with format...</description>
  </skill>
  <skill name="git-helper">
    <description>Git operations and utilities...</description>
  </skill>
</available_skills>
```

**解釋**：
- `-y` 標誌跳過了技能選擇介面
- 所有已安裝的技能都同步到 AGENTS.md
- 不會彈出任何確認對話框

---

### 第 4 步：GitHub Actions 整合

**為什麼**
在實際 CI/CD 流程中整合 OpenSkills，實現自動化技能管理。

在專案中建立 `.github/workflows/setup-skills.yml` 檔案：

```yaml
name: Setup Skills

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills (non-interactive)
        run: openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: openskills sync -y

      - name: Verify AGENTS.md
        run: |
          echo "=== AGENTS.md generated ==="
          cat AGENTS.md

      - name: Upload AGENTS.md as artifact
        uses: actions/upload-artifact@v4
        with:
          name: agents-md
          path: AGENTS.md
```

提交並推送到 GitHub：

```bash
git add .github/workflows/setup-skills.yml
git commit -m "Add GitHub Actions workflow for OpenSkills"
git push
```

**你應該看到**：GitHub Actions 自動執行，成功安裝技能並產生 AGENTS.md。

**解釋**：
- 每次 push 或 PR 時自動觸發
- 使用 `openskills install anthropics/skills -y` 非互動式安裝技能
- 使用 `openskills sync -y` 非互動式同步 AGENTS.md
- 將 AGENTS.md 作為 artifact 儲存，便於除錯

---

### 第 5 步：使用私有儲存庫

**為什麼**
在企業環境中，技能通常託管在私有儲存庫，需要在 CI/CD 中透過 SSH 存取。

在 GitHub Actions 中設定 SSH：

```yaml
name: Setup Skills from Private Repo

on:
  push:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH key
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills from private repo
        run: openskills install git@github.com:your-org/private-skills.git -y

      - name: Sync to AGENTS.md
        run: openskills sync -y
```

在 GitHub 儲存庫的 **Settings → Secrets and variables → Actions** 中新增 `SSH_PRIVATE_KEY`。

**你應該看到**：GitHub Actions 成功從私有儲存庫安裝技能。

**解釋**：
- 使用 Secrets 儲存私密金鑰，避免洩露
- 設定 SSH 存取私有儲存庫
- `openskills install git@github.com:your-org/private-skills.git -y` 支援從私有儲存庫安裝

---

### 第 6 步：Docker 場景整合

**為什麼**
在 Docker 映像檔建置時自動安裝技能，確保容器啟動後立即可用。

建立 `Dockerfile`：

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 安裝 OpenSkills
RUN npm install -g openskills

# 安裝技能（非互動式）
RUN openskills install anthropics/skills -y

# 同步 AGENTS.md
RUN openskills sync -y

# 複製應用程式碼
COPY . .

# 其他建置步驟...
RUN npm install
RUN npm run build

# 啟動命令
CMD ["node", "dist/index.js"]
```

建置並執行：

```bash
# 建置 Docker 映像檔
docker build -t myapp:latest .

# 執行容器
docker run -it --rm myapp:latest sh

# 在容器中驗證技能已安裝
ls -la .claude/skills/
cat AGENTS.md
```

**你應該看到**：容器中已經安裝好了技能並產生了 AGENTS.md。

**解釋**：
- 在 Docker 映像檔建置階段安裝技能
- 使用 `RUN openskills install ... -y` 非互動式安裝
- 容器啟動後無需手動安裝技能
- 適合微服務、Serverless 等場景

---

### 第 7 步：環境變數設定

**為什麼**
透過環境變數靈活設定技能來源，不同環境使用不同的技能儲存庫。

建立 `.env.ci` 檔案：

```bash
# CI/CD 環境設定
SKILLS_SOURCE=anthropics/skills
SKILLS_INSTALL_FLAGS=-y
SYNC_FLAGS=-y
```

在 CI/CD 腳本中使用：

```bash
#!/bin/bash
# .github/scripts/setup-skills.sh

set -e

# 載入環境變數
if [ -f .env.ci ]; then
  export $(cat .env.ci | grep -v '^#' | xargs)
fi

echo "Installing skills from: $SKILLS_SOURCE"
npx openskills install $SKILLS_SOURCE $SKILLS_INSTALL_FLAGS

echo "Syncing to AGENTS.md"
npx openskills sync $SYNC_FLAGS

echo "✅ Skills setup completed"
```

在 GitHub Actions 中呼叫：

```yaml
- name: Setup skills
  run: .github/scripts/setup-skills.sh
```

**你應該看到**：腳本根據環境變數自動設定技能來源和標誌。

**解釋**：
- 透過環境變數靈活設定技能來源
- 不同環境（開發、測試、生產）可以使用不同的 `.env` 檔案
- 保持 CI/CD 設定的可維護性

---

## 檢查點 ✅

完成以下檢查，確認你掌握了本課內容：

- [ ] 理解非互動式模式的用途和特點
- [ ] 能夠使用 `-y` 標誌進行非互動式安裝
- [ ] 能夠使用 `-y` 標誌進行非互動式同步
- [ ] 理解互動式與非互動式的區別
- [ ] 能夠在 GitHub Actions 中整合 OpenSkills
- [ ] 能夠在 Docker 映像檔建置時安裝技能
- [ ] 知道如何在 CI/CD 中處理私有儲存庫
- [ ] 理解環境變數設定的最佳實踐

---

## 踩坑提醒

### 常見錯誤 1：忘記新增 -y 標誌

**錯誤場景**：在 GitHub Actions 中忘記使用 `-y` 標誌

```yaml
# ❌ 錯誤：忘記 -y 標誌
- name: Install skills
  run: openskills install anthropics/skills
```

**問題**：
- CI 環境沒有互動式終端機（TTY）
- 命令會等待使用者輸入，導致 workflow 逾時失敗
- 錯誤訊息可能不明顯

**正確做法**：

```yaml
# ✅ 正確：使用 -y 標誌
- name: Install skills
  run: openskills install anthropics/skills -y
```

---

### 常見錯誤 2：技能覆蓋導致設定遺失

**錯誤場景**：CI/CD 每次都覆蓋技能，導致本地設定遺失

```bash
# CI/CD 中安裝技能到全域目錄
openskills install anthropics/skills --global -y

# 本地使用者安裝到專案目錄，被全域覆蓋
```

**問題**：
- 全域安裝的技能優先順序低於專案本地
- CI/CD 和本地安裝位置不一致，導致混亂
- 可能覆蓋了本地使用者精心設定的技能

**正確做法**：

```bash
# 方案 1：CI/CD 和本地都使用專案安裝
openskills install anthropics/skills -y

# 方案 2：使用 Universal 模式避免衝突
openskills install anthropics/skills --universal -y

# 方案 3：CI/CD 使用專用目錄（透過自訂輸出路徑）
openskills install anthropics/skills -y
openskills sync -o .agents-md/AGENTS.md -y
```

---

### 常見錯誤 3：Git 存取權限不足

**錯誤場景**：從私有儲存庫安裝技能時，未設定 SSH 金鑰

```yaml
# ❌ 錯誤：未設定 SSH 金鑰
- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

**問題**：
- CI 環境無法存取私有儲存庫
- 錯誤訊息：`Permission denied (publickey)`
- 克隆失敗，workflow 失敗

**正確做法**：

```yaml
# ✅ 正確：設定 SSH 金鑰
- name: Setup SSH key
  env:
    SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts

- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

---

### 常見錯誤 4：Docker 映像檔過大

**錯誤場景**：Dockerfile 中安裝技能導致映像檔體積過大

```dockerfile
# ❌ 錯誤：每次都重新克隆和安裝
RUN openskills install anthropics/skills -y
```

**問題**：
- 每次建置都從 GitHub 克隆儲存庫
- 增加建置時間和映像檔體積
- 網路問題可能導致失敗

**正確做法**：

```dockerfile
# ✅ 正確：使用多階段建置和快取
FROM node:20-alpine AS skills-builder

RUN npm install -g openskills
RUN openskills install anthropics/skills -y
RUN openskills sync -y

# 主映像檔
FROM node:20-alpine

WORKDIR /app

# 複製已安裝的技能
COPY --from=skills-builder ~/.claude /root/.claude
COPY --from=skills-builder /app/AGENTS.md /app/

# 複製應用程式碼
COPY . .

# 其他建置步驟...
```

---

### 常見錯誤 5：忘記更新技能

**錯誤場景**：CI/CD 每次都安裝舊版本的技能

```yaml
# ❌ 錯誤：只安裝，不更新
- name: Install skills
  run: openskills install anthropics/skills -y
```

**問題**：
- 技能儲存庫可能已經更新
- CI/CD 安裝的技能版本不是最新的
- 可能導致功能遺失或 bug

**正確做法**：

```yaml
# ✅ 正確：先更新再同步
- name: Update skills
  run: openskills update -y

- name: Sync to AGENTS.md
  run: openskills sync -y

# 或在 install 時使用更新策略
- name: Install or update skills
  run: |
    openskills install anthropics/skills -y || openskills update -y
```

---

## 本課小結

**核心要點**：

1. **非互動式模式適用於 CI/CD**：使用 `-y` 標誌跳過所有互動式提示
2. **install 命令的 -y 標誌**：自動安裝所有找到的技能，覆蓋已存在的技能
3. **sync 命令的 -y 標誌**：自動同步所有技能到 AGENTS.md
4. **GitHub Actions 整合**：在 workflow 中使用非互動式命令自動化技能管理
5. **Docker 場景**：在映像檔建置階段安裝技能，確保容器啟動後立即可用
6. **私有儲存庫存取**：透過 SSH 金鑰設定存取私有技能儲存庫
7. **環境變數設定**：透過環境變數靈活設定技能來源和安裝參數

**決策流程**：

```
[需要在 CI/CD 中使用 OpenSkills] → [安裝技能]
                                    ↓
                            [使用 -y 標誌跳過互動]
                                    ↓
                            [產生 AGENTS.md]
                                    ↓
                            [使用 -y 標誌跳過互動]
                                    ↓
                            [驗證技能已正確安裝]
```

**記憶口訣**：

- **CI/CD 記得加 -y**：非互動式是關鍵
- **GitHub Actions 用 SSH**：私有儲存庫要配金鑰
- **Docker 建置早安裝**：映像檔體積要注意
- **環境變數設定好**：不同環境要區分

---

## 下一課預告

> 下一課我們學習 **[安全性說明](../security/)**。
>
> 你會學到：
> - OpenSkills 的安全特性和防護機制
> - 路徑遍歷防護的工作原理
> - 符號連結的安全處理方式
> - YAML 解析的安全措施
> - 權限管理最佳實踐

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能              | 檔案路徑                                                                                                    | 行號    |
|--- | --- | ---|
| 非互動式安裝      | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L424-L455) | 424-455 |
| 衝突檢測與覆蓋    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L521-L550) | 521-550 |
| 非互動式同步      | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93)   | 46-93   |
| 命令列參數定義    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L49)                          | 49      |
| 命令列參數定義    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L65)                          | 65      |

**關鍵常量**：
- `-y, --yes`：跳過互動式選擇的命令列標誌

**關鍵函式**：
- `warnIfConflict(skillName, targetPath, isProject, skipPrompt)`：檢測技能衝突並決定是否覆蓋
- `installFromRepo()`：從儲存庫安裝技能（支援非互動式模式）
- `syncAgentsMd()`：同步技能到 AGENTS.md（支援非互動式模式）

**業務規則**：
- 使用 `-y` 標誌時，跳過所有互動式提示
- 技能已存在時，非互動式模式自動覆蓋（顯示 `Overwriting: <skill-name>`）
- 非互動式模式在 headless 環境（無 TTY）中正常運作
- `install` 和 `sync` 命令都支援 `-y` 標誌

</details>
