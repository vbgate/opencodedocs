---
title: "版本更新日誌：了解新功能、改進和破壞性變更 | Clawdbot 教程"
sidebarTitle: "新版本有什麼"
subtitle: "版本更新日誌：了解新功能、改進和破壞性變更"
description: "學習 Clawdbot 的版本更新歷史，了解各版本的新功能、改進、修復和破壞性變更。本教程幫助用戶追蹤功能演進，保持系統更新以獲得最新特性和安全修復。"
tags:
  - "更新日誌"
  - "版本歷史"
  - "changelog"
prerequisite: []
order: 380
---

# 版本更新日誌：了解新功能、改進和破壞性變更

Clawdbot 持續迭代更新，每個版本都帶來新功能效能改進和安全增強。本日誌幫你快速了解版本演進，決定何時升級以及升級時需要注意什麼。

## 學完你能做什麼

- 了解最新版本的新功能和亮點
- 掌握各版本的破壞性變更，避免升級中斷
- 查看問題修復列表，確認你的問題是否已解決
- 追蹤功能演進路線，規劃使用新特性

::: tip 版本號說明
版本號格式：`YYYY.M.D`（年份.月.日）

- **主版本**：年份或月份數字變化通常代表重大功能更新
- **修補版本**：`-1`, `-2`, `-3` 代表修復版本，僅包含 bug 修復
:::

---

## 2026.1.25

**狀態**：未發布

### 亮點（Highlights）

暫無

### 改進（Changes）

- **Agents**：在 exec allowlist 檢查中遵守 `tools.exec.safeBins` (#2281)
- **Docs**：收緊 Fly 私有部署步驟 (#2289) - 感謝 @dguido
- **Gateway**：對通過查詢參數傳遞的 hook token 發出警告；文檔化首選 header 認證方式 (#2200) - 感謝 @YuriNachos
- **Gateway**：添加危險的 Control UI 設備認證繞過標誌 + 審計警告 (#2248)
- **Doctor**：在無認證的 gateway 暴露時發出警告 (#2016) - 感謝 @Alex-Alaniz
- **Discord**：添加可配置的特權 gateway intents（presences/members）(#2266) - 感謝 @kentaro
- **Docs**：在 providers 側邊欄添加 Vercel AI Gateway (#1901) - 感謝 @jerilynzheng
- **Agents**：擴展 cron 工具描述，包含完整的 schema 文檔 (#1988) - 感謝 @tomascupr
- **Skills**：添加 GitHub、Notion、Slack、Discord 的缺失依賴元數據 (#1995) - 感謝 @jackheuberger
- **Docs**：添加 Render 部署指南 (#1975) - 感謝 @anurag
- **Docs**：添加 Claude Max API 代理指南 (#1875) - 感謝 @atalovesyou
- **Docs**：添加 DigitalOcean 部署指南 (#1870) - 感謝 @0xJonHoldsCrypto
- **Docs**：添加 Raspberry Pi 安裝指南 (#1871) - 感謝 @0xJonHoldsCrypto
- **Docs**：添加 GCP Compute Engine 部署指南 (#1848) - 感謝 @hougangdev
- **Docs**：添加 LINE 渠道指南 - 感謝 @thewilloftheshadow
- **Docs**：為 Control UI 刷新歸功兩位貢獻者 (#1852) - 感謝 @EnzeD
- **Onboarding**：將 Venice API key 添加到非互動式流程 (#1893) - 感謝 @jonisjongithub
- **Onboarding**：加強 beta 版安全警告文案 + 訪問控制預期
- **Tlon**：將執行緒回覆 ID 格式化為 `@ud` (#1837) - 感謝 @wca4a
- **Gateway**：合併儲存時優先使用最新的對話元數據 (#1823) - 感謝 @emanuelst
- **Web UI**：在 WebChat 中保持子 agent 通告回覆可見 (#1977) - 感謝 @andrescardonas7
- **CI**：增加 macOS 檢查的 Node 堆大小 (#1890) - 感謝 @realZachi
- **macOS**：通過升級 Textual 到 0.3.1 避免渲染程式碼區塊時崩潰 (#2033) - 感謝 @garricn
- **Browser**：回退到 URL 匹配用於擴展中繼目標解析 (#1999) - 感謝 @jonit-dev
- **Update**：在髒檢查中忽略 dist/control-ui 並在 UI 構建後恢復 (#1976) - 感謝 @Glucksberg
- **Telegram**：允許媒體發送時使用 caption 參數 (#1888) - 感謝 @mguellsegarra
- **Telegram**：支援擴充套件 sendPayload channelData（媒體/按鈕）並驗證擴充套件命令 (#1917) - 感謝 @JoshuaLelon
- **Telegram**：當串流傳輸被禁用時避免區塊回覆 (#1885) - 感謝 @ivancasco
- **Auth**：在 ASCII 提示後顯示可複製的 Google auth URL (#1787) - 感謝 @robbyczgw-cla
- **Routing**：預編譯對話鍵正規表示式 (#1697) - 感謝 @Ray0907
- **TUI**：避免渲染選擇清單時寬度溢位 (#1686) - 感謝 @mossein
- **Telegram**：在重啟哨兵通知中保留主題 ID (#1807) - 感謝 @hsrvc
- **Config**：在 `${VAR}` 替換之前應用 `config.env` (#1813) - 感謝 @spanishflu-est1918
- **Slack**：在串流回覆後清除 ack 反應 (#2044) - 感謝 @fancyboi999
- **macOS**：在遠程目標中保持自定義 SSH 使用者名稱 (#2046) - 感謝 @algal

### 修復（Fixes）

- **Telegram**：每行包裝 reasoning 斜體以避免原始底線 (#2181) - 感謝 @YuriNachos
- **Voice Call**：對 ngrok URL 強制執行 Twilio webhook 簽名驗證；預設禁用 ngrok 免費層繞過
- **Security**：通過在信任 headers 之前驗證本地 tailscaled 的身份來強化 Tailscale Serve 認證
- **Build**：使 memory-core 對等依賴與鎖定檔案對齊
- **Security**：添加 mDNS 發現模式，預設最小化以減少資訊洩露 (#1882) - 感謝 @orlyjamie
- **Security**：通過 DNS pinning 強化 URL 獲取以減少重新綁定風險 - 感謝 Chris Zheng
- **Web UI**：改進 WebChat 圖片貼上預覽並允許僅發送圖片 (#1925) - 感謝 @smartprogrammer93
- **Security**：預設用 per-hook 退出選項包裝外部 hook 內容 (#1827) - 感謝 @mertcicekci0
- **Gateway**：預設認證現在失敗關閉（需要 token/password；Tailscale Serve 身份仍然允許）
- **Onboarding**：從 onboarding/configure 流程和 CLI 標誌中移除不支援的 gateway auth "off" 選擇

---

## 2026.1.24-3

### 修復（Fixes）

- **Slack**：修復由於跨域重新導向時缺少 Authorization header 導致的圖片下載失敗 (#1936) - 感謝 @sanderhelgesen
- **Gateway**：強化本地用戶端檢測和未認證代理連接的反向代理處理 (#1795) - 感謝 @orlyjamie
- **Security audit**：將禁用認證的 loopback Control UI 標記為關鍵 (#1795) - 感謝 @orlyjamie
- **CLI**：恢復 claude-cli 對話並將 CLI 回覆串流傳輸到 TUI 用戶端 (#1921) - 感謝 @rmorse

---

## 2026.1.24-2

### 修復（Fixes）

- **Packaging**：在 npm tarball 中包含 dist/link-understanding 輸出（修復安裝時缺失 apply.js 匯入）

---

## 2026.1.24-1

### 修復（Fixes）

- **Packaging**：在 npm tarball 中包含 dist/shared 輸出（修復安裝時缺失 reasoning-tags 匯入）

---

## 2026.1.24

### 亮點（Highlights）

- **Providers**：Ollama 發現 + 文檔；Venice 指南升級 + 交叉連結 (#1606) - 感謝 @abhaymundhara
- **Channels**：LINE 擴充套件（Messaging API）支援富回覆 + 快速回覆 (#1630) - 感謝 @plum-dawg
- **TTS**：Edge 回退（無 key）+ `/tts` 自動模式 (#1668, #1667) - 感謝 @steipete, @sebslight
- **Exec approvals**：通過 `/approve` 在所有渠道中（包括擴充套件）進行聊天內審批 (#1621) - 感謝 @czekaj
- **Telegram**：DM 主題作為獨立對話 + 出站連結預覽切換 (#1597, #1700) - 感謝 @rohannagpal, @zerone0x

### 改進（Changes）

- **Channels**：添加 LINE 擴充套件（Messaging API），支援富回覆、快速回覆和擴充套件 HTTP 登錄檔 (#1630) - 感謝 @plum-dawg
- **TTS**：添加 Edge TTS 提供者回退，預設為無 key 的 Edge，格式失敗時重試 MP3 (#1668) - 感謝 @steipete
- **TTS**：添加自動模式枚舉（off/always/inbound/tagged），支援每對話 `/tts` 覆蓋 (#1667) - 感謝 @sebslight
- **Telegram**：將 DM 主題視為獨立對話，並使用執行緒後綴保持 DM 歷史限制穩定 (#1597) - 感謝 @rohannagpal
- **Telegram**：添加 `channels.telegram.linkPreview` 切換出站連結預覽 (#1700) - 感謝 @zerone0x
- **Web search**：為時間限定結果添加 Brave 新鮮度過濾器參數 (#1688) - 感謝 @JonUleis
- **UI**：刷新 Control UI 儀表板設計系統（顏色、圖示、排版）(#1745, #1786) - 感謝 @EnzeD, @mousberg
- **Exec approvals**：將審批提示轉發到聊天，通過 `/approve` 支援所有渠道（包括擴充套件）(#1621) - 感謝 @czekaj
- **Gateway**：在 gateway 工具中暴露 `config.patch`，支援安全部分更新 + 重啟哨兵 (#1653) - 感謝 @Glucksberg
- **Diagnostics**：添加診斷標誌用於定向除錯日誌（config + env 覆蓋）
- **Docs**：擴展 FAQ（遷移、調度、並發、模型推薦、OpenAI 訂閱認證、Pi 大小、可黑安裝、docs SSL 變通方案）
- **Docs**：添加詳細的安裝程式故障排除指南
- **Docs**：添加 macOS VM 指南，包含本地/托管選項 + VPS/節點指導 (#1693) - 感謝 @f-trycua
- **Docs**：添加 Bedrock EC2 執行個體角色設置 + IAM 步驟 (#1625) - 感謝 @sergical
- **Docs**：更新 Fly.io 指南說明
- **Dev**：添加 prek pre-commit hooks + 依賴的每週更新配置 (#1720) - 感謝 @dguido

### 修復（Fixes）

- **Web UI**：修復 config/debug 佈局溢位、滾動和程式碼區塊大小 (#1715) - 感謝 @saipreetham589
- **Web UI**：在活動執行期間顯示停止按鈕，空閒時切換回新對話 (#1664) - 感謝 @ndbroadbent
- **Web UI**：在重新連接時清除過時的斷開橫幅；允許儲存不支援 schema 路徑的表單但阻止缺失 schema (#1707) - 感謝 @Glucksberg
- **Web UI**：在聊天氣泡中隱藏內部 `message_id` 提示
- **Gateway**：允許 Control UI 僅 token 認證跳過設備配對，即使設備身份存在（`gateway.controlUi.allowInsecureAuth`）(#1679) - 感謝 @steipete
- **Matrix**：使用預檢大小保護解密 E2EE 媒體附件 (#1744) - 感謝 @araa47
- **BlueBubbles**：將電話號碼目標路由到 DM，避免洩露路由 ID，並自動創建缺失的 DM（需要 Private API）(#1751) - 感謝 @tyler6204
- **BlueBubbles**：當短 ID 缺失時，在回覆標籤中保留 part-index GUID
- **iMessage**：不區分大小寫地標準化 chat_id/chat_guid/chat_identifier 前綴，並保持服務前綴句柄穩定 (#1708) - 感謝 @aaronn
- **Signal**：修復 reaction 發送（group/UUID 目標 + CLI author 標誌）(#1651) - 感謝 @vilkasdev
- **Signal**：添加可配置的 signal-cli 啟動逾時 + 外部守護程序模式文檔 (#1677)
- **Telegram**：在 Node 22 上為上傳設置 fetch duplex="half" 以避免 sendPhoto 失敗 (#1684) - 感謝 @commdata2338
- **Telegram**：在 Node 上使用包裝的 fetch 進行長輪詢以標準化 AbortSignal 處理 (#1639)
- **Telegram**：為出站 API 調用遵守每帳戶代理 (#1774) - 感謝 @radek-paclt
- **Telegram**：當語音筆記被隱私設置阻止時回退到文字 (#1725) - 感謝 @foeken
- **Voice Call**：在初始 Twilio webhook 時返回串流 TwiML 用於出站對話調用 (#1634)
- **Voice Call**：序列化 Twilio TTS 播放並在插話時取消以防止重疊 (#1713) - 感謝 @dguido
- **Google Chat**：收緊郵箱 allowlist 匹配、清理輸入、媒體上限和 onboarding/docs/tests (#1635) - 感謝 @iHildy
- **Google Chat**：標準化不帶雙 `spaces/` 前綴的空間目標
- **Agents**：在上下文溢位提示錯誤時自動壓縮 (#1627) - 感謝 @rodrigouroz
- **Agents**：使用活動 auth 配置文件進行自動壓縮恢復
- **Media understanding**：當主模型已支援視覺時跳過圖像理解 (#1747) - 感謝 @tyler6204
- **Models**：預設缺失的自定義提供商字段，以便接受最小配置
- **Messaging**：保持換行區塊分割對跨渠道的圍欄 markdown 區塊安全
- **Messaging**：將換行區塊處理為段落感知（空行分割），以保持列表和標題在一起 (#1726) - 感謝 @tyler6204
- **TUI**：在 gateway 重新連接後重新載入歷史以恢復對話狀態 (#1663)
- **Heartbeat**：標準化目標識別符以保持路由一致
- **Exec**：對於提升的 ask 保持審批，除非是完全模式 (#1616) - 感謝 @ivancasco
- **Exec**：將 Windows 平台標籤視為 Windows 用於節點 shell 選擇 (#1760) - 感謝 @ymat19
- **Gateway**：在服務安裝環境中包含內聯配置 env 變量 (#1735) - 感謝 @Seredeep
- **Gateway**：當 tailscale.mode 為 off 時跳過 Tailscale DNS 探測 (#1671)
- **Gateway**：減少延遲調用 + 遠程節點探測的日誌噪音；去抖動技能刷新 (#1607) - 感謝 @petter-b
- **Gateway**：闡明缺少 token 的 Control UI/WebChat 認證錯誤提示 (#1690)
- **Gateway**：當綁定到 127.0.0.1 時監聽 IPv6 loopback，以便 localhost webhooks 工作
- **Gateway**：將鎖定檔案儲存在臨時目錄中以避免持久卷上的陳舊鎖 (#1676)
- **macOS**：直接傳輸 `ws://` URL 預設到連接埠 18789；文檔化 `gateway.remote.transport` (#1603) - 感謝 @ngutman
- **Tests**：在 CI macOS 上限制 Vitest worker 以減少超時 (#1597) - 感謝 @rohannagpal
- **Tests**：在嵌入式執行器流模擬中避免 fake-timer 依賴以減少 CI 不穩定 (#1597) - 感謝 @rohannagpal
- **Tests**：增加嵌入式執行器排序測試超時以減少 CI 不穩定 (#1597) - 感謝 @rohannagpal

---

## 2026.1.23-1

### 修復（Fixes）

- **Packaging**：在 npm tarball 中包含 dist/tts 輸出（修復缺失 dist/tts/tts.js）

---

## 2026.1.23

### 亮點（Highlights）

- **TTS**：將 Telegram TTS 移至核心 + 預設啟用模型驅動的 TTS 標籤以支援表達性音頻回覆 (#1559) - 感謝 @Glucksberg
- **Gateway**：添加 `/tools/invoke` HTTP 端點用於直接工具調用（強制執行認證 + 工具策略）(#1575) - 感謝 @vignesh07
- **Heartbeat**：每渠道可見性控制（OK/alerts/indicator）(#1452) - 感謝 @dlauer
- **Deploy**：添加 Fly.io 部署支援 + 指南 (#1570)
- **Channels**：添加 Tlon/Urbit 渠道擴充套件（DM、群組提及、執行緒回覆）(#1544) - 感謝 @wca4a

### 改進（Changes）

- **Channels**：在內建 + 擴充套件渠道中允許每組工具允許/拒絕策略 (#1546) - 感謝 @adam91holt
- **Agents**：添加 Bedrock 自動發現預設值 + 配置覆蓋 (#1553) - 感謝 @fal3
- **CLI**：添加 `clawdbot system` 用於系統事件 + 心跳控制；移除獨立的 `wake`
- **CLI**：向 `clawdbot models status` 添加即時認證探測以進行每配置文件驗證
- **CLI**：在 `clawdbot update` 後預設重啟 gateway；添加 `--no-restart` 跳過
- **Browser**：為遠程閘道添加節點主機代理自動路由（每個 gateway/node 可配置）
- **Plugins**：為工作流添加可選的 `llm-task` JSON-only 工具 (#1498) - 感謝 @vignesh07
- **Markdown**：添加每渠道表轉換（Signal/WhatsApp 使用項目符號，其他使用程式碼區塊）(#1495) - 感謝 @odysseus0
- **Agents**：保持系統提示詞僅時區並將當前時間移動到 `session_status` 以獲得更好的快取命中
- **Agents**：從工具註冊/顯示中移除冗餘的 bash 工具別名 (#1571) - 感謝 @Takhoffman
- **Docs**：添加 cron vs heartbeat 決策指南（包含 Lobster 工作流筆記）(#1533) - 感謝 @JustYannicc
- **Docs**：闡明空 HEARTBEAT.md 檔案跳過心跳，缺失檔案仍會執行 (#1535) - 感謝 @JustYannicc

### 修復（Fixes）

- **Sessions**：接受非 UUID sessionIds 用於歷史/發送/狀態，同時保留 agent 範圍
- **Heartbeat**：接受擴充套件 channel ids 用於心跳目標驗證 + UI 提示
- **Messaging/Sessions**：將出站發送鏡像到目標對話鍵（執行緒 + dmScope），創建發送時的對話條目，並標準化對話鍵大小寫 (#1520)
- **Sessions**：拒絕數組支援的對話儲存以防止靜默擦除 (#1469)
- **Gateway**：比較 Linux 程式啟動時間以避免 PID 回收鎖循環；除非陳舊，否則保持鎖 (#1572) - 感謝 @steipete
- **Gateway**：在 exec 審批請求中接受 null 可選字段 (#1511) - 感謝 @pvoo
- **Exec approvals**：持久化 allowlist 條目 id 以保持 macOS allowlist 行穩定 (#1521) - 感謝 @ngutman
- **Exec**：遵守 tools.exec ask/security 預設值用於提升的審批（避免不需要的提示）
- **Daemon**：在構建最小服務路徑時使用平台 PATH 分隔符
- **Linux**：在 systemd PATH 中包含 env 配置的使用者 bin 根目錄並對齊 PATH 審核 (#1512) - 感謝 @robbyczgw-cla
- **Tailscale**：僅在權限錯誤時使用 sudo 重試 serve/funnel 並保持原始失敗詳情 (#1551) - 感謝 @sweepies
- **Docker**：更新 docker-compose 和 Hetzner 指南中的 gateway 命令 (#1514)
- **Agents**：當最後一個助手回合僅調用工具時顯示工具錯誤回退（防止靜默停止）
- **Agents**：解析身份時忽略 IDENTITY.md 模板佔位符 (#1556)
- **Agents**：在模型切換時刪除孤立的 OpenAI Responses reasoning 區塊 (#1562) - 感謝 @roshanasingh4
- **Agents**：在「agent 在回覆前失敗」消息中添加 CLI 日誌提示 (#1550) - 感謝 @sweepies
- **Agents**：警告並忽略僅引用未知或未加載擴充套件工具的工具 allowlists (#1566)
- **Agents**：將僅擴充套件工具 allowlists 視為選擇性加入；保持核心工具啟用 (#1467)
- **Agents**：遵守嵌入式執行的 enqueue 覆蓋以避免測試中的對列死鎖
- **Slack**：遵守開放 groupPolicy 用於消息 + slash gate 中的未列出頻道 (#1563) - 感謝 @itsjaydesu
- **Discord**：將自動執行緒提及繞過限制為 bot 擁有的執行緒；保持 ack 反應提及門控 (#1511) - 感謝 @pvoo
- **Discord**：重試速率限制的 allowlist 解析 + 命令部署以避免 gateway 崩潰
- **Mentions**：在群組聊天中當存在另一個明確提及時忽略 mentionPattern 匹配（Slack/Discord/Telegram/WhatsApp）
- **Telegram**：在媒體標題中渲染 markdown (#1478)
- **MS Teams**：從 Graph 作用域和 Bot Framework 探測作用域中移除 `.default` 後綴 (#1507, #1574) - 感謝 @Evizero
- **Browser**：當擴充套件在切換標籤頁後重用對話 id 時保持擴充套件中繼標籤可控制 (#1160)
- **Voice wake**：在模糊/提交時跨 iOS/Android 自動儲存喚醒詞並與 macOS 對齊限制
- **UI**：滾動長頁面時保持 Control UI 側邊欄可見 (#1515) - 感謝 @pookNast
- **UI**：快取 Control UI markdown 渲染 + 記憶化聊天文字提取以減少 Safari 輸入抖動
- **TUI**：轉發未知斜線命令，在自動完成中包含 Gateway 命令，並將斜線回覆渲染為系統輸出
- **CLI**：認證探測輸出潤色（表格輸出、內聯錯誤、減少噪音和 `clawdbot models status` 中的換行修復）
- **Media**：僅在它們以行開頭時解析 `MEDIA:` 標籤，以避免剝離散文提及 (#1206)
- **Media**：盡可能保留 PNG alpha；當仍超過大小上限時回退到 JPEG (#1491) - 感謝 @robbyczgw-cla
- **Skills**：將 bird Homebrew 安裝門控到 macOS (#1569) - 感謝 @bradleypriest

---

## 更新建議

### 升級前檢查

在升級到新版本之前，建議：

1. **閱讀破壞性變更**：檢查是否有破壞性變更會影響你的配置
2. **備份配置**：備份 `~/.clawdbot/clawdbot.json`
3. **運行診斷**：`clawdbot doctor` 確保當前系統狀態健康
4. **檢查依賴**：確保 Node.js 版本符合要求（≥22）

### 升級後驗證

升級完成後，執行以下驗證：

```bash
# 1. 檢查版本
clawdbot --version

# 2. 檢查狀態
clawdbot status

# 3. 驗證渠道連接
clawdbot channels status

# 4. 測試消息發送
clawdbot message "Hello" --target=<your-channel>
```

### 查看完整更新日誌

要查看更詳細的版本歷史和 issue 連結，請訪問：

- **GitHub Releases**：https://github.com/moltbot/moltbot/releases
- **官方文檔**：https://docs.clawd.bot

---

## 歷史版本

查看更早的版本更新，請訪問 [GitHub Releases](https://github.com/moltbot/moltbot/releases) 或專案根目錄的 [CHANGELOG.md](https://github.com/moltbot/moltbot/blob/main/CHANGELOG.md)。

::: tip 參與貢獻
如果你發現了 bug 或有功能建議，歡迎在 [GitHub Issues](https://github.com/moltbot/moltbot/issues) 中提交。
:::
