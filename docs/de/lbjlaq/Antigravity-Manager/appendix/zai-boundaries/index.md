---
title: "z.ai-Integration: Funktionsgrenzen erklärt | Antigravity-Manager"
sidebarTitle: "z.ai-Grenzen Schnellreferenz"
subtitle: "z.ai-Integration: Funktionsgrenzen erklärt"
description: "Beherrschen Sie die z.ai-Integrationsgrenzen von Antigravity Tools. Erfahren Sie mehr über Anforderungsrouting, dispatch_mode-Loadbalancing, Modellmapping, Header-Sicherheitsrichtlinien sowie MCP-Reverse-Proxy und Einschränkungen."
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "Funktionsgrenzen"
prerequisite:
  - "/de/lbjlaq/Antigravity-Manager/start/getting-started/"
  - "/de/lbjlaq/Antigravity-Manager/platforms/mcp/"
order: 3
---
# Funktionsgrenzen der z.ai-Integration (Implementiert vs. Explizit nicht implementiert)

Diese Dokumentation erklärt nur die „Grenzen" der z.ai-Integration in Antigravity Tools – nicht die „Anbindung". Wenn Sie feststellen, dass eine bestimmte Funktion nicht funktioniert, vergleichen Sie sie hier zuerst: Ist sie nicht aktiviert, nicht konfiguriert oder gar nicht implementiert?

## Was Sie nach diesem Kurs können

- Beurteilen, was Sie von z.ai erwarten können: was „implementiert" ist und was in der Dokumentation „explizit nicht gemacht" wurde
- Verstehen, welche Endpunkte von z.ai betroffen sind (und welche überhaupt nicht beeinflusst werden)
- Quellcode-/Dokumentationsnachweise für jede Schlussfolgerung mit GitHub-Zeilennummern-Links anzeigen –便于 eigene Überprüfung

## Ihre aktuelle Situation

Sie haben z.ai möglicherweise bereits in Antigravity Tools aktiviert, stoßen aber bei der Nutzung auf folgende Fragen:

- Warum werden einige Anforderungen über z.ai geleitet, andere überhaupt nicht?
- Können MCP-Endpunkte als „vollständiger MCP-Server" betrachtet werden?
- Entsprechen die im UI sichtbaren Schalter tatsächlich der tatsächlichen Implementierung?

## Was ist z.ai-Integration (in diesem Projekt)?

**z.ai-Integration** ist in Antigravity Tools ein optionaler „Upstream-Provider + MCP-Erweiterung". Sie übernimmt nur unter bestimmten Bedingungen Claude-Protokollanforderungen und bietet MCP Search/Reader Reverse-Proxy sowie einen minimalen Vision MCP integrierten Server; sie ist keine vollständige Protokoll- und vollständige Fähigkeitsersatzlösung.

::: info Ein Merksatz
Sie können z.ai als „optionalen Upstream für Claude-Anforderungen + eine Gruppe von schaltbaren MCP-Endpunkten" betrachten – nicht als „alle Fähigkeiten von z.ai vollständig übertragen".
:::

## Implementiert: Stabil verfügbar (basierend auf Quellcode)

### 1) Nur das Claude-Protokoll wird über z.ai geleitet (/v1/messages + /v1/messages/count_tokens)

Das Upstream-Forwarding von z.ai Anthropic erfolgt nur im z.ai-Zweig des Claude-Handlers:

- `POST /v1/messages`: Wenn `use_zai=true` ist, wird `forward_anthropic_json(...)` aufgerufen, um die JSON-Anforderung an den z.ai Anthropic-kompatiblen Endpunkt weiterzuleiten
- `POST /v1/messages/count_tokens`: Wenn z.ai aktiviert ist, wird ebenfalls weitergeleitet; andernfalls wird der Platzhalter `{input_tokens:0, output_tokens:0}` zurückgegeben

Nachweise:

- z.ai-Zweigauswahl und Forwarding-Einstieg: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- z.ai-Zweig für count_tokens und Platzhalter-Rückgabe: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- Implementierung des z.ai Anthropic-Forwarding: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip Wie ist „Antwort-Streaming" zu verstehen?
`forward_anthropic_json` leitet den Upstream-Antwortkörper als `bytes_stream()`-Stream an den Client weiter, ohne SSE zu parsen (siehe Response-Aufbau in `providers/zai_anthropic.rs`).
:::

### 2) Die „tatsächliche Bedeutung" des Dispatch-Modus (dispatch_mode)

`dispatch_mode` bestimmt, ob `/v1/messages` über z.ai geleitet wird:

| dispatch_mode | Was passiert | Nachweis |
| --- | --- | --- |
| `off` | z.ai niemals verwenden | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | Alle Claude-Anforderungen werden über z.ai geleitet | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Nur wenn der Google-Pool nicht verfügbar ist (0 Konten oder „keine verfügbaren Konten"), wird z.ai verwendet | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | z.ai als „zusätzlichen 1 Slot" in das Round-Robin einbeziehen (keine Garantie für Treffer) | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning Häufiges Missverständnis bei pooled
`pooled` bedeutet nicht „z.ai + Google-Kontenpool gemeinsam nutzen und stabil nach Gewicht splitten". Der Code schreibt explizit „no strict guarantees" – im Grunde ist es ein Round-Robin-Slot (nur wenn `slot == 0` wird z.ai verwendet).
:::

### 3) Modellzuordnung: Wie Claude-Modellnamen zu z.ai glm-* werden?

Vor dem Forwarding zu z.ai wird, wenn der Anforderungskörper ein `model`-Feld enthält, dieses umgeschrieben:

1. Exakte Übereinstimmung mit `proxy.zai.model_mapping` (unterstützt gleichzeitig Originalzeichenfolge und lower-case Key)
2. Präfix `zai:<model>`: Entferne `zai:` direkt
3. `glm-*`: Bleibt unverändert
4. Nicht `claude-*`: Bleibt unverändert
5. `claude-*` und enthält `opus/haiku`: Abbildung auf `proxy.zai.models.opus/haiku`; andernfalls standardmäßig `sonnet`

Nachweis: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37), [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) Header-Sicherheitsrichtlinien beim Forwarding (Vermeidung des Leaks lokaler Proxy-Keys)

Beim Upstream-Forwarding von z.ai werden nicht alle Header „ unverändert" mitgenommen, sondern zwei Schutzschichten implementiert:

- Nur eine kleine Auswahl von Header wird durchgelassen (z. B. `content-type`, `accept`, `anthropic-version`, `user-agent`)
- Der API-Key von z.ai wird in den Upstream injiziert (Priorisierung der vom Client verwendeten Authentifizierungsmethode: `x-api-key` oder `Authorization: Bearer ...`)

Nachweise:

- Header-Whitelist: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- Injektion von z.ai auth: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## Implementiert: MCP (Search/Reader Reverse-Proxy + Vision integriert)

### 1) MCP Search/Reader: Reverse-Proxy zum MCP-Endpunkt von z.ai

Lokale Endpunkte und Upstream-Adressen sind fest codiert:

| Lokaler Endpunkt | Upstream-Adresse | Schalter | Nachweis |
| --- | --- | --- | --- |
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404 ist kein „Netzwerkproblem"
Solange `proxy.zai.mcp.enabled=false` oder das entsprechende `web_search_enabled/web_reader_enabled=false`, geben diese Endpunkte direkt 404 zurück.
:::

Nachweise:

- MCP-Gesamtschalter und z.ai Key-Validierung: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- Routenregistrierung: [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)

### 2) Vision MCP: Ein „minimaler Streamable HTTP MCP" integrierter Server

Vision MCP ist kein Reverse-Proxy, sondern eine lokale integrierte Implementierung:

- Endpunkt: `/mcp/zai-mcp-server/mcp`
- `POST` unterstützt: `initialize`, `tools/list`, `tools/call`
- `GET` gibt SSE keepalive zurück (erfordert initialisierte Session)
- `DELETE` beendet Session

Nachweise:

- Handler-Haupteinstieg und Methoden-Dispatch: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- Implementierung von `initialize`, `tools/list`, `tools/call`: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Position des „minimalen Implementierung" von Vision MCP: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Vision MCP Werkzeugset (8 Stück) und Dateigrößenbegrenzung

Die Werkzeugliste stammt aus `tool_specs()`:

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

Nachweis: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270), [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

Lokale Dateien werden ausgelesen und als `data:<mime>;base64,...` codiert, gleichzeitig gibt es harte Begrenzungen:

- Bild上限 5 MB (`image_source_to_content(..., 5)`)
- Video上限 8 MB (`video_source_to_content(..., 8)`)

Nachweis: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## Explizit nicht implementiert / Nicht zu erwarten (basierend auf Dokumentationsangaben und Implementierungsdetails)

### 1) z.ai Usage/Budget-Überwachung (usage/budget) nicht implementiert

`docs/zai/implementation.md` schreibt explizit „not implemented yet". Das bedeutet:

- Sie können nicht erwarten, dass Antigravity Tools Usage/Budget-Abfragen oder Warnungen für z.ai bereitstellt
- Quota-Protection wird auch nicht automatisch Budget/Usage-Daten von z.ai lesen

Nachweis: [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP ist kein vollständiger MCP-Server

Vision MCP ist derzeit als „nur ausreichend für Werkzeugaufrufe" minimale Implementierung positioniert: prompts/resources, resumability, streamed tool output usw. sind noch nicht implementiert.

Nachweis: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36), [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude` spiegelt nicht die echte Modellliste von z.ai

Die von diesem Endpunkt zurückgegebene Modellliste stammt aus lokaler integrierter Zuordnung und benutzerdefinierter Zuordnung (`get_all_dynamic_models`), ohne `/v1/models` des z.ai-Upstreams abzurufen.

Nachweise:

- Handler: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- Logik der Listengenerierung: [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## Konfigurationsfelder Schnellreferenz (z.ai-bezogen)

Die z.ai-Konfiguration befindet sich unter `ProxyConfig.zai` und umfasst folgende Felder:

- `enabled` / `base_url` / `api_key`
- `dispatch_mode` (`off/exclusive/pooled/fallback`)
- `model_mapping` (exakte Übereinstimmungsüberschreibungen)
- `models.{opus,sonnet,haiku}` (Claude-Familie Standardzuordnung)
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

Standardwerte (base_url / Standardmodelle) befinden sich ebenfalls in derselben Datei:

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

Nachweis: [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116), [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)

---

## Zusammenfassung

- z.ai übernimmt derzeit nur Claude-Protokoll (`/v1/messages` + `count_tokens`); andere Protokollendpunkte sind nicht „automatisch über z.ai"
- MCP Search/Reader ist Reverse-Proxy; Vision MCP ist lokale minimale Implementierung, kein vollständiger MCP-Server
- Die Modellliste von `/v1/models/claude` stammt aus lokaler Zuordnung und repräsentiert nicht die echten Modelle des z.ai-Upstreams

---

## Nächster Kurs

> Im nächsten Kurs lernen wir **[Versionsverlauf](../../changelog/release-notes/)**.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Erweitern, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| z.ai Integrationsumfang (Claude-Protokoll + MCP + Vision MCP) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| z.ai Dispatch-Modus und Modellstandardwerte | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| z.ai Standard base_url / Standardmodelle | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| `/v1/messages` Wahllogik, ob über z.ai geleitet wird | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| `/v1/messages/count_tokens` z.ai Forwarding und Platzhalter-Rückgabe | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| z.ai Anthropic Upstream-Forwarding (JSON-Forwarding + Antwort-Streaming) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| z.ai Modellzuordnungsregeln (map_model_for_zai) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Header-Whitelist + Injektion von z.ai auth | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| MCP Search/Reader Reverse-Proxy und Schalter | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
| Vision MCP integrierter Server (GET/POST/DELETE + JSON-RPC) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L190-L397) | 190-397 |
| Vision MCP minimale Implementierung-Position (kein vollständiger MCP-Server) | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Vision Werkzeugliste und Einschränkungen (tool_specs + Dateigröße + stream=false) | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| `/v1/models/claude` Modelllistenquelle (lokale Zuordnung, kein Upstream-Check) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| Usage/Budget-Überwachung nicht implementiert (Dokumentationsangabe) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
