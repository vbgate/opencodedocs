---
title: "404 Pfad-Inkompatibilität: Base URL-Konfiguration | Antigravity-Manager"
sidebarTitle: "404 Pfad beheben"
subtitle: "404/Pfad-Inkompatibilität: Base URL, /v1-Präfix und Path-Stapelung"
description: "Lernen Sie, 404-Pfad-Inkompatibilitätsprobleme bei der Integration von Antigravity Tools zu lösen. Beherrschen Sie die korrekte Base URL-Konfiguration, vermeiden Sie /v1-Präfix-Duplikate und verarbeiten Sie Pfad-Stapelungen mit umfassenden Szenarien."
tags:
  - "faq"
  - "base-url"
  - "404"
  - "openai"
  - "anthropic"
  - "gemini"
prerequisite:
  - "start-proxy-and-first-client"
  - "faq-auth-401"
order: 4
---

# 404/Pfad-Inkompatibilität: Base URL, /v1-Präfix und Path-Stapelung

## Was Sie lernen werden

- Erkennen Sie, ob ein 404-Fehler auf ein "Base URL-Konkatenationsproblem" oder auf "Authentifizierung/Dienst nicht gestartet" zurückzuführen ist
- Wählen Sie die richtige Base URL für Ihren Client-Typ (mit oder ohne `/v1`)
- Identifizieren Sie zwei häufige Fehler: doppelte Präfixe (`/v1/v1/...`) und Pfad-Stapelungen (`/v1/chat/completions/responses`)

## Ihr aktuelles Problem

Bei der Integration externer Clients treten `404 Not Found`-Fehler auf. Nach längerer Untersuchung stellen Sie fest, dass es sich um ein Base URL-Konfigurationsproblem handelt:

- Kilo Code-Aufrufe schlagen fehl, die Protokolle zeigen, dass `/v1/chat/completions/responses` nicht gefunden wird
- Claude Code kann zwar verbinden, meldet aber immer wieder Pfad-Inkompatibilität
- Python OpenAI SDK meldet `404`, obwohl der Dienst bereits gestartet ist

Die Wurzel dieser Probleme ist nicht das Kontingent oder die Authentifizierung, sondern dass der Client seinen eigenen Pfad an die von Ihnen angegebene Base URL angehängt hat, wodurch der Pfad falsch wird.

## Wann Sie diesen Ansatz anwenden

- Sie haben bestätigt, dass der Reverse-Proxy läuft, aber alle API-Aufrufe geben 404 zurück
- Sie haben die Base URL mit einem Pfad angegeben (z. B. `/v1/...`), wissen aber nicht, ob der Client den Pfad erneut anhängt
- Der Client hat "eigene Pfad-Konkatenationslogik" und die resultierenden Pfade sehen nicht wie Standard OpenAI/Anthropic/Gemini aus

## 🎒 Vorbereitung

Schließen Sie "Dienst nicht gestartet/Authentifizierung fehlgeschlagen" aus, sonst werden Sie in die falsche Richtung gelenkt.

### Schritt 1: Bestätigen Sie, dass der Reverse-Proxy läuft

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/healthz
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/healthz | Select-Object -ExpandProperty Content
```

:::

**Sie sollten sehen**: HTTP 200 mit JSON-Rückgabe (mindestens `{"status":"ok"}`).

### Schritt 2: Bestätigen Sie, dass Sie auf 404 stoßen (nicht 401)

Wenn Sie im Modus `auth_mode=strict/all_except_health/auto(allow_lan_access=true)` keinen Schlüssel angeben, stoßen Sie eher auf 401. Überprüfen Sie den Statuscode und führen Sie bei Bedarf zuerst die **[401 Authentifizierungsfehler-Suche](../auth-401/)** durch.

## Was ist eine Base URL?

**Base URL** ist die "Root-Adresse", die Clients beim Senden von Anfragen verwenden. Clients hängen normalerweise ihre eigenen API-Pfade an die Base URL an, bevor sie die Anfrage senden. Ob Sie `/v1` in die Base URL aufnehmen müssen, hängt davon ab, welchen Pfad der Client anhängt. Solange Sie den endgültigen Anfrage-Pfad mit den Routen von Antigravity Tools abgleichen, werden Sie nicht mehr durch 404 blockiert.

## Kernkonzept

Die Reverse-Proxy-Routen von Antigravity Tools sind "vollständig hardcodiert" (siehe `src-tauri/src/proxy/server.rs`). Die häufigsten Einstiegspunkte sind:

| Protokoll | Pfad | Zweck |
| --- | --- | --- |
| OpenAI | `/v1/models` | Modelle auflisten |
| OpenAI | `/v1/chat/completions` | Chat-Vervollständigung |
| OpenAI | `/v1/responses` | Codex CLI-Kompatibilität |
| Anthropic | `/v1/messages` | Claude Nachrichten-API |
| Gemini | `/v1beta/models` | Modelle auflisten |
| Gemini | `/v1beta/models/:model` | Inhalte generieren |
| Gesundheitscheck | `/healthz` | Health-Check-Endpunkt |

Ihr Ziel: Der "endgültige Pfad", den der Client zusammensetzt, muss genau auf diese Routen fallen.

---

## Gehen Sie mit mir durch

### Schritt 1: Testen Sie zuerst den "korrekten Pfad" mit curl

**Warum**
Bestätigen Sie zuerst, dass das von Ihnen verwendete Protokoll tatsächlich über eine entsprechende Route lokal verfügt, um 404 nicht als "Modell/Konto-Problem" zu missdeuten.

::: code-group

```bash [macOS/Linux]
 # OpenAI-Protokoll: Modelle auflisten
curl -i http://127.0.0.1:8045/v1/models

 # Anthropic-Protokoll: Nachrichten-Interface (hier prüfen wir nur auf 404/401, kein Erfolg erforderlich)
curl -i http://127.0.0.1:8045/v1/messages

 # Gemini-Protokoll: Modelle auflisten
curl -i http://127.0.0.1:8045/v1beta/models
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/models | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/messages | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1beta/models | Select-Object -ExpandProperty StatusCode
```

:::

**Sie sollten sehen**: Diese Pfade sollten zumindest nicht 404 sein. Wenn 401 auftritt, konfigurieren Sie zuerst den Schlüssel gemäß **[401 Authentifizierungsfehler-Suche](../auth-401/)**.

### Schritt 2: Wählen Sie die Base URL basierend darauf, ob der Client "/v1" selbst anhängt

**Warum**
Das Problem bei Base URL besteht im Wesentlichen darin, dass der von Ihnen angegebene Pfad und der vom Client angehängte Pfad überlagert werden.

| Was Sie verwenden | Empfohlene Base URL | Die Route, auf die Sie abgleichen |
| --- | --- | --- |
| OpenAI SDK (Python/Node etc.) | `http://127.0.0.1:8045/v1` | `/v1/chat/completions`, `/v1/models` |
| Claude Code CLI (Anthropic) | `http://127.0.0.1:8045` | `/v1/messages` |
| Gemini SDK / Gemini-Modus-Clients | `http://127.0.0.1:8045` | `/v1beta/models/*` |

::: tip Merksatz
OpenAI SDK verlangt normalerweise, dass Sie `/v1` in die Base URL aufnehmen; bei Anthropic/Gemini ist es üblicher, nur host:port anzugeben.
:::

### Schritt 3: Behandeln Sie Clients mit "Pfad-Stapelung" wie Kilo Code

**Warum**
Antigravity Tools hat keine Route `/v1/chat/completions/responses`. Wenn ein Client diesen Pfad zusammensetzt, ist das garantiert 404.

Verwenden Sie die empfohlene Konfiguration aus der README:

1. Protokollauswahl: Bevorzugt **Gemini-Protokoll**
2. Base URL: Geben Sie `http://127.0.0.1:8045` ein

**Sie sollten sehen**: Die Anfrage geht über die Routen `/v1beta/models/...`, und `/v1/chat/completions/responses` tritt nicht mehr auf.

### Schritt 4: Schreiben Sie die Base URL nicht bis zum "konkreten Ressourcen-Pfad"

**Warum**
Die meisten SDKs hängen ihre eigenen Ressourcenpfade an die Base URL an. Wenn Sie die Base URL zu tief schreiben, entsteht schließlich ein "doppelter Pfad".

✅ Empfohlen (OpenAI SDK):

```text
http://127.0.0.1:8045/v1
```

❌ Häufiger Fehler:

```text
http://127.0.0.1:8045
http://127.0.0.1:8045/v1/chat/completions
```

**Sie sollten sehen**: Nachdem Sie die Base URL flacher gemacht haben, kehren die Anfragepfade zu `/v1/...` oder `/v1beta/...` zurück, und 404 verschwindet.

---

## Kontrollpunkte ✅

Verwenden Sie diese Tabelle, um schnell zu überprüfen, ob Ihr "endgültiger Anfrage-Pfad" Antigravity Tools treffen kann:

| Pfad, den Sie in den Protokollen sehen | Fazit |
| --- | --- |
| Beginnt mit `/v1/` (z. B. `/v1/models`, `/v1/chat/completions`) | Geht über OpenAI/Anthropic-kompatible Routen |
| Beginnt mit `/v1beta/` (z. B. `/v1beta/models/...`) | Geht über native Gemini-Routen |
| `/v1/v1/` tritt auf | Base URL enthält `/v1`, Client hat es erneut angehängt |
| `/v1/chat/completions/responses` tritt auf | Client stapelt Pfade, aktuelle Routing-Tabelle wird nicht unterstützt |

---

## Häufige Fehler

### Fehler 1: Doppelter /v1-Präfix

**Fehlererscheinung**: Der Pfad wird zu `/v1/v1/chat/completions`

**Ursache**: Base URL enthält bereits `/v1`, Client hat es erneut angehängt.

**Lösung**: Ändern Sie die Base URL so, dass sie nur bis `/v1` reicht, und schreiben Sie keine konkreten Ressourcenpfade weiter.

### Fehler 2: Client mit Pfad-Stapelung

**Fehlererscheinung**: Der Pfad wird zu `/v1/chat/completions/responses`

**Ursache**: Der Client hat zusätzlich zum OpenAI-Protokoll-Pfad einen Geschäftspfad angehängt.

**Lösung**: Wechseln Sie vorzugsweise zu einem anderen Protokollmodus dieses Clients (z. B. Kilo Code mit Gemini).

### Fehler 3: Falscher Port

**Fehlererscheinung**: `Connection refused` oder Timeout

**Lösung**: Bestätigen Sie auf der Seite "API Reverse-Proxy" in Antigravity Tools den aktuellen Überwachungs-Port (Standard 8045). Der Base URL-Port muss übereinstimmen.

---

## Zusammenfassung

| Phänomen | Häufigste Ursache | Was Sie ändern sollten |
| --- | --- | --- |
| Immer 404 | Base URL-Konkatenation falsch | Verifizieren Sie zuerst mit curl, dass `/v1/models`/`/v1beta/models` nicht 404 sind |
| `/v1/v1/...` | `/v1` doppelt | Bei OpenAI SDK die Base URL auf `/v1` enden lassen |
| `/v1/chat/completions/responses` | Client stapelt Pfade | Wechseln Sie zu Gemini-Protokoll oder führen Sie Pfad-Umschreibung durch (nicht für Anfänger empfohlen) |

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Streaming-Unterbrechung und 0-Token-Problem](../streaming-0token/)**
>
> Sie werden lernen:
> - Warum Streaming-Antworten unerwartet unterbrochen werden
> - Diagnosemethoden für 0-Token-Fehler
> - Der automatische Fallback-Mechanismus von Antigravity

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Reverse-Proxy-Routen-Definition (vollständige Routing-Tabelle) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| `AxumServer::start()` (Routing-Erstellungseinstieg) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L79-L216) | 79-216 |
| `health_check_handler()` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| README: Empfohlene Base URL für Claude Code | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L204) | 197-204 |
| README: Erklärung der Pfad-Stapelung bei Kilo Code und empfohlenes Protokoll | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L206-L211) | 206-211 |
| README: Beispiel für base_url von Python OpenAI SDK | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L213-L227) | 213-227 |

**Wichtige Funktionen**:
- `AxumServer::start()`: Startet den Axum Reverse-Proxy-Server und registriert alle externen Routen
- `health_check_handler()`: Health-Check-Handler (`GET /healthz`)

</details>
