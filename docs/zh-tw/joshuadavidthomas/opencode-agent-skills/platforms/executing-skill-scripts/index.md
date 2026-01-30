### 陷阱 4：腳本輸出過長

如果腳本輸出大量日誌信息（比如 npm install 的下載進度），可能會讓回復變得很長。

**表現**：

```bash
系統回覆：
npm WARN deprecated package...
npm notice created a lockfile...
added 500 packages in 2m
# 可能有數百行輸出
```

**建議**：腳本應該精簡輸出，只顯示關鍵信息：

```bash
#!/bin/bash
echo "Installing dependencies..."
npm install --silent
echo "✓ Dependencies installed (500 packages)"
```

## 本課小結

`run_skill_script` 工具讓你在技能目錄的上下文中執行可執行腳本，支持：

- **參數傳遞**：通過 `arguments` 數組傳遞命令行參數
- **工作目錄切換**：腳本執行時 CWD 切換到技能目錄
- **錯誤處理**：捕獲退出碼和錯誤輸出，方便調試
- **權限檢查**：只執行有可執行權限的檔案
- **路徑安全**：驗證腳本路徑，防止目錄穿越

腳本發現的規則：
- 遞歸掃描技能目錄，最大深度 10 層
- 跳過隱藏目錄和常見依賴目錄
- 只包含有可執行權限的檔案
- 路徑為相對於技能目錄的相對路徑

**最佳實踐**：
- 腳本輸出要精簡，只顯示關鍵信息
- 腳本不應假設當前目錄是專案根目錄
- 使用 `chmod +x` 設置新腳本的可執行權限
- 先用 `get_available_skills` 查看可用腳本

## 下一課預告

> 下一課我們學習 **[讀取技能檔案](../reading-skill-files/)**。
>
> 你會學到：
> - 使用 read_skill_file 工具訪問技能的文檔和配置
> - 理解路徑安全檢查機制，防止目錄穿越攻擊
> - 掌握檔案讀取和 XML 內容注入的格式
> - 學會在技能中組織支持檔案（文檔、示例、配置等）

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能        | 檔案路徑                                                                                    | 行號    |
|--- | --- | ---|
| RunSkillScript 工具定義 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| findScripts 函數 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L59-L99) | 59-99   |

**關鍵類型**：
- `Script = { relativePath: string; absolutePath: string }`：腳本元數據，包含相對路徑和絕對路徑

**關鍵常量**：
- 最大遞歸深度：`10`（`skills.ts:64`）- 腳本搜索深度限制
- 跳過目錄列表：`['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`（`skills.ts:61`）
- 可執行權限掩碼：`0o111`（`skills.ts:86`）- 檢查檔案是否可執行

**關鍵函數**：
- `RunSkillScript(skill: string, script: string, arguments?: string[])`：執行技能腳本，支持參數傳遞和工作目錄切換
- `findScripts(skillPath: string)`：遞歸查找技能目錄下的可執行檔案，按相對路徑排序返回

**業務規則**：
- 腳本執行時切換工作目錄到技能目錄（`tools.ts:180`）：`$.cwd(skill.path)`
- 只執行在技能的 scripts 列表中的腳本（`tools.ts:165-177`）
- 腳本不存在時返回可用腳本列表，支持模糊匹配建議（`tools.ts:168-176`）
- 執行失敗時返回退出碼和錯誤輸出（`tools.ts:184-195`）
- 跳過隱藏目錄（以 `.` 開頭）和常見依賴目錄（`skills.ts:70-71`）

</details>
