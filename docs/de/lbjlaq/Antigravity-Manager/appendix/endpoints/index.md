---
title: "Endpunkte-Schnellreferenz: HTTP-Routen-Übersicht | Antigravity-Manager"
sidebarTitle: "Alle Routen schnell finden"
subtitle: "Endpunkte-Schnellreferenz: Externe HTTP-Routen-Übersicht"
description: "Erfahren Sie mehr über die HTTP-Endpunkte des Antigravity-Gateways. Beherrschen Sie Authentifizierungsmodi und API-Key-Header durch Tabellenvergleiche mit OpenAI/Anthropic/Gemini/MCP-Routen."
tags:
  - "Endpunkte-Schnellreferenz"
  - "API-Referenz"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 1
---
# Endpunkte-Schnellreferenz: Externe HTTP-Routen-Übersicht

## Was Sie nach diesem Tutorial können

- Gewünschte Endpunkte schnell finden
- Die Endpunktverteilung verschiedener Protokolle verstehen
- Authentifizierungsmodi und Sonderregeln für Gesundheitsprüfungen kennenlernen

## Endpunkte-Übersicht

Der lokale Reverse-Proxy-Dienst von Antigravity Tools bietet folgende Endpunkttypen:

| Protokollkategorie | Verwendung | Typische Clients |
| --- | --- | --- |
| **OpenAI-Protokoll** | Kompatibilität mit generischen KI-Anwendungen | OpenAI SDK / Kompatible Clients |
| **Anthropic-Protokoll** | Aufrufe der Claude-Reihe | Claude Code / Anthropic SDK |
| **Gemini-Protokoll** | Offizielle Google-SDKs | Google Gemini SDK |
| **MCP-Endpunkte** | Erweiterung der Werkzeugaufrufe | MCP-Clients |
| **Intern/Hilfsfunktionen** | Gesundheitsprüfung, Abfang/interne Fähigkeiten | Automatisierungsskripte / Monitoring-Prüfpunkte |

---

## OpenAI-Protokoll-Endpunkte

Diese Endpunkte sind mit dem OpenAI-API-Format kompatibel und eignen sich für die meisten OpenAI-SDK-kompatiblen Clients.

| Methode | Pfad | Routing-Einstieg (Rust-Handler) | Hinweis |
| --- | --- | --- | --- |
| GET | `/v1/models` | `handlers::openai::handle_list_models` | OpenAI-kompatibel: Modellliste |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | OpenAI-kompatibel: Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | OpenAI-kompatibel: Legacy Completions |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | OpenAI-kompatibel: Codex CLI-Anfragen (gleicher Handler wie `/v1/completions`) |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | OpenAI-kompatibel: Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | OpenAI-kompatibel: Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | OpenAI-kompatibel: Audio Transcriptions |

::: tip Kompatibilitätshinweis
Der Endpunkt `/v1/responses` ist speziell für Codex CLI konzipiert und verwendet tatsächlich dieselbe Verarbeitungslogik wie `/v1/completions`.
:::

---

## Anthropic-Protokoll-Endpunkte

Diese Endpunkte sind nach den Pfaden und Anfrageformaten der Anthropic-API organisiert und können von Claude Code / Anthropic SDK aufgerufen werden.

| Methode | Pfad | Routing-Einstieg (Rust-Handler) | Hinweis |
| --- | --- | --- | --- |
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Anthropic-kompatibel: Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Anthropic-kompatibel: count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Anthropic-kompatibel: Modellliste |

---

## Gemini-Protokoll-Endpunkte

Diese Endpunkte sind mit dem Google Gemini API-Format kompatibel und können direkt mit den offiziellen Google SDKs verwendet werden.

| Methode | Pfad | Routing-Einstieg (Rust-Handler) | Hinweis |
| --- | --- | --- | --- |
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Gemini-nativ: Modellliste |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Gemini-nativ: GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Gemini-nativ: generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Gemini-nativ: countTokens |

::: warning Pfadbeschreibung
Für `/v1beta/models/:model` sind sowohl GET als auch POST im gleichen Pfad registriert (siehe Routing-Definition).
:::

---

## MCP-Endpunkte

MCP (Model Context Protocol) Endpunkte dienen dazu, „Werkzeugaufruf“-Schnittstellen nach außen verfügbar zu machen (verarbeitet durch `handlers::mcp::*`). Ob sie aktiviert sind und ihr spezifisches Verhalten richtet sich nach der Konfiguration; Details siehe [MCP-Endpunkte](../../platforms/mcp/).

| Methode | Pfad | Routing-Einstieg (Rust-Handler) | Hinweis |
| --- | --- | --- | --- |
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP: Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP: Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP: z.ai MCP Server |

::: details MCP-bezogene Hinweise
Informationen zum Umfang und den Grenzen von MCP finden Sie unter [Grenzen der z.ai-Integration (implementiert vs. explizit nicht implementiert)](../zai-boundaries/).
:::

---

## Interne und Hilfs-Endpunkte

Diese Endpunkte dienen für interne Systemfunktionen und externe Überwachung.

| Methode | Pfad | Routing-Einstieg (Rust-Handler) | Hinweis |
| --- | --- | --- | --- |
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | Interner Warmup-Endpunkt |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | Telemetrie-Protokoll-Abfang: Gibt direkt 200 zurück |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | Telemetrie-Protokoll-Abfang: Gibt direkt 200 zurück |
| GET | `/healthz` | `health_check_handler` | Gesundheitsprüfung: Gibt `{"status":"ok"}` zurück |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | Automatische Modellerkennung |

::: tip Stumme Verarbeitung
Ereignisprotokoll-Endpunkte geben direkt `200 OK` zurück, ohne tatsächliche Verarbeitung, um die Telemetrieberichterstattung von Clients abzufangen.
:::

::: warning Benötigen diese Endpunkte einen API-Key?
Mit Ausnahme von `GET /healthz`, das möglicherweise ausgenommen ist, hängt davon ab, ob andere Routen einen Key mitführen müssen, vom „gültigen Modus“ von `proxy.auth_mode` ab (siehe unten „Authentifizierungsmodus“ und `auth_middleware` im Quellcode).
:::

---

## Authentifizierungsmodi

Der Zugriff auf alle Endpunkte wird durch `proxy.auth_mode` gesteuert:

| Modus | Beschreibung | Erfordert `/healthz` Authentifizierung? | Andere Endpunkte erfordern Authentifizierung? |
| --- | --- | --- | --- |
| `off` | Vollständig offen | ❌ Nein | ❌ Nein |
| `strict` | Alle erfordern Authentifizierung | ✅ Ja | ✅ Ja |
| `all_except_health` | Nur Gesundheitsprüfung offen | ❌ Nein | ✅ Ja |
| `auto` | Automatische Entscheidung (Standard) | ❌ Nein | Hängt von `allow_lan_access` ab |

::: info auto-Modus-Logik
`auto` ist keine eigenständige Strategie, sondern wird aus der Konfiguration abgeleitet: Wenn `proxy.allow_lan_access=true`, ist es äquivalent zu `all_except_health`, andernfalls zu `off` (siehe `docs/proxy/auth.md`).
:::

**Format der Authentifizierungsanfrage**:

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (OpenAI-Stil)
curl -H "x-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (Gemini-Stil)
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (OpenAI-Stil)
curl.exe -H "x-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (Gemini-Stil)
curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## Zusammenfassung

Antigravity Tools bietet einen vollständigen Satz an Multi-Protokoll-kompatiblen Endpunkten, die die drei gängigsten API-Formate OpenAI, Anthropic und Gemini sowie MCP-Werkzeugaufrufe unterstützen.

- **Schnelle Integration**: Bevorzugt OpenAI-Protokoll-Endpunkte für maximale Kompatibilität
- **Native Funktionen**: Verwenden Sie Anthropic-Protokoll-Endpunkte, wenn Sie die volle Funktionalität von Claude Code benötigen
- **Google-Ökosystem**: Wählen Sie Gemini-Protokoll-Endpunkte bei Verwendung der offiziellen Google SDKs
- **Sicherheitskonfiguration**: Wählen Sie je nach Verwendungsszenario (lokal/LAN/öffentlich) den geeigneten Authentifizierungsmodus

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Daten und Modelle](../storage-models/)**.
>
> Sie werden lernen:
> - Die Speicherstruktur von Kontodateien
> - Die Tabellenstruktur der SQLite-Statistikdatenbank
> - Schlüsselfelddefinitionen und Backup-Strategien

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Routing-Registrierung (alle Endpunkte) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Authentifizierungs-Middleware (Header-Kompatibilität + `/healthz`-Ausnahme + OPTIONS-Freigabe) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| auth_mode-Modi und auto-Ableitungsregeln | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| `/healthz`-Rückgabewert | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Telemetrie-Protokoll-Abfang (silent 200) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**Wichtige Funktionen**:
- `AxumServer::start()`: Startet den Axum-Server und registriert Routen (Zeilen 79-254)
- `health_check_handler()`: Gesundheitsprüfungsbehandlung (Zeilen 266-272)
- `silent_ok_handler()`: Stumme Erfolgsbehandlung (Zeilen 274-277)

</details>
