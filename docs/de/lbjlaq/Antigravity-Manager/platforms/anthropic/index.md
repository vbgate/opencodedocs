---
title: "Anthropic: Kompatible API | Antigravity-Manager"
sidebarTitle: "Claude Code über lokales Gateway leiten"
subtitle: "Anthropic: Kompatible API"
description: "Lernen Sie die Anthropic-kompatible API von Antigravity-Manager. Konfigurieren Sie die Base URL für Claude Code, führen Sie Gespräche mit /v1/messages und verstehen Sie Authentifizierung und Warmup-Interception."
tags:
  - "anthropic"
  - "claude"
  - "claude-code"
  - "proxy"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---
# Anthropic-kompatible API: /v1/messages und die Schlüsselvereinbarung mit Claude Code

Wenn Sie Claude Code über das lokale Gateway leiten möchten, ohne die Anthropic-Protokollnutzung zu ändern, müssen Sie nur die Base URL auf Antigravity Tools umlenken und eine Anfrage mit `/v1/messages` erfolgreich ausführen.

## Was ist die Anthropic-kompatible API?

Die **Anthropic-kompatible API** bezeichnet den Anthropic Messages-Protokoll-Endpunkt, den Antigravity Tools bereitstellt. Sie empfängt `/v1/messages`-Anfragen, führt lokal eine Nachrichtenbereinigung, Streaming-Verpackung und eine Wiederholungsrotation durch und leitet die Anfrage dann an Upstream weiter, wo die echte Modellkapazität bereitgestellt wird.

## Was Sie nach diesem Kurs können

- Nutzen Sie den `/v1/messages`-Endpunkt von Antigravity Tools, um Claude Code (oder jeden Anthropic Messages-Client) auszuführen
- Klar verstehen, wie Base URL und Authentifizierungsheader konfiguriert werden, um 401/404-Fehler zu vermeiden
- Wenn Sie Streaming benötigen, erhalten Sie Standard-SSE; wenn nicht, erhalten Sie auch JSON
- Wissen, welche "Protokoll-Patches" der Proxy im Hintergrund durchführt (Warmup-Interception, Nachrichtenbereinigung, Signatur-Fallback)

## Ihr aktuelles Dilemma

Sie möchten Claude Code/Anthropic SDK verwenden, aber Netzwerk-, Konto-, Kontingent- und Ratenbegrenzungsprobleme machen die Gespräche sehr instabil; Sie haben Antigravity Tools bereits als lokales Gateway ausgeführt, stoßen aber häufig auf diese Arten von Problemen:

- Die Base URL wurde zu `.../v1` oder vom Client "Pfad gestapelt", was direkt zu 404 führt
- Proxy-Authentifizierung ist aktiviert, aber Sie wissen nicht, welchen Header der Client zur Übertragung des Keys verwendet, was zu 401 führt
- Hintergrund-Warmup-/Zusammenfassungsaufgaben von Claude Code verbrauchen das Kontingent stillschweigend

## Wann Sie diesen Ansatz verwenden

- Sie möchten **Claude Code CLI** integrieren und hoffen, dass es "nach dem Anthropic-Protokoll" direkt mit dem lokalen Gateway verbunden wird
- Ihr verfügbarer Client unterstützt nur die Anthropic Messages API (`/v1/messages`) und Sie möchten den Code nicht ändern

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzung
Dieser Kurs setzt voraus, dass Sie bereits den grundlegenden Kreislauf des lokalen Reverse-Proxys erfolgreich ausgeführt haben (kann auf `/healthz` zugreifen, kennen den Proxy-Port und ob die Authentifizierung aktiviert ist). Wenn dies noch nicht funktioniert, lesen Sie zuerst **[Starten Sie den lokalen Reverse-Proxy und integrieren Sie den ersten Client](/de/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

Sie müssen drei Dinge vorbereiten:

1. Proxy-Adresse (Beispiel: `http://127.0.0.1:8045`)
2. Ob die Proxy-Authentifizierung aktiviert ist (und der entsprechende `proxy.api_key`)
3. Ein Client, der Anthropic Messages-Anfragen senden kann (Claude Code / curl sind beide geeignet)

## Kernidee

Die **Anthropic-kompatible API** entspricht in Antigravity Tools einer Gruppe fester Routen: `POST /v1/messages`, `POST /v1/messages/count_tokens`, `GET /v1/models/claude` (siehe Router-Definition in `src-tauri/src/proxy/server.rs`).

Dabei ist `/v1/messages` der "Haupteinstiegspunkt". Bevor der Proxy die eigentliche Upstream-Anfrage sendet, führt er eine Reihe von Kompatibilitätsbehandlungen durch:

- Bereinigen von Feldern in der Nachrichtenhistorie, die vom Protokoll nicht akzeptiert werden (z. B. `cache_control`)
- Zusammenführen aufeinanderfolgender Nachrichten derselben Rolle, um Validierungsfehler bei "Rollenwechsel" zu vermeiden
- Erkennen von Warmup-Nachrichten von Claude Code und direktes Zurückgeben einer simulierten Antwort, um Kontingentverschwendung zu reduzieren
- Durchführen von Wiederholungen und Kontenrotation basierend auf dem Fehlertyp (maximal 3 Versuche), um die Stabilität langer Sitzungen zu verbessern
## Gehen Sie mit mir durch

### Schritt 1: Stellen Sie sicher, dass die Base URL nur bis zum Port geschrieben ist

**Warum**
`/v1/messages` ist eine feste Route auf der Proxy-Seite. Wenn die Base URL zu `.../v1` geschrieben wird, kann sie leicht vom Client erneut mit `/v1/messages` verkettet werden, was schließlich zu `.../v1/v1/messages` führt.

Sie können die Erreichbarkeit zunächst direkt mit curl testen:

```bash
# Sie sollten sehen: {"status":"ok"}
curl -sS "http://127.0.0.1:8045/healthz"
```

### Schritt 2: Wenn Sie Authentifizierung aktiviert haben, merken Sie sich diese 3 Header

**Warum**
Die Authentifizierungs-Middleware des Proxys entnimmt den Key aus `Authorization`, `x-api-key`, `x-goog-api-key`; wenn die Authentifizierung aktiviert ist, aber der Header nicht übereinstimmt, erhalten Sie konsequent 401.

::: info Welche Authentifizierungsheader akzeptiert der Proxy?
`Authorization: Bearer <key>`, `x-api-key: <key>`, `x-goog-api-key: <key>` können alle verwendet werden (siehe `src-tauri/src/proxy/middleware/auth.rs`).
:::

### Schritt 3: Verbinden Sie Claude Code CLI direkt mit dem lokalen Gateway

**Warum**
Claude Code verwendet das Anthropic Messages-Protokoll; wenn Sie seine Base URL auf das lokale Gateway umlenken, können Sie den Vertrag `/v1/messages` wiederverwenden.

Konfigurieren Sie die Umgebungsvariablen nach dem Beispiel in der README:

```bash
export ANTHROPIC_API_KEY="sk-antigravity"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

**Sie sollten sehen**: Claude Code kann normal gestartet werden und nach dem Senden einer Nachricht eine Antwort erhalten.

### Schritt 4: Listen Sie zuerst die verfügbaren Modelle auf (für curl/SDK)

**Warum**
Verschiedene Clients übergeben `model` unverändert; wenn Sie die Modellliste zuerst zur Hand haben, wird die Fehlerbehebung viel schneller.

```bash
curl -sS "http://127.0.0.1:8045/v1/models/claude" | jq
```

**Sie sollten sehen**: Ein JSON mit `object: "list"` wird zurückgegeben, wobei `data[].id` die verfügbaren Modell-IDs sind.

### Schritt 5: Verwenden Sie curl, um `/v1/messages` aufzurufen (nicht-streaming)

**Warum**
Dies ist die minimale reproduzierbare Kette: ohne Claude Code können Sie auch bestätigen, wo "Routing + Authentifizierung + Anfragetext" genau fehlschlägt.

```bash
curl -i "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<wählen Sie eines aus /v1/models/claude>",
    "max_tokens": 128,
    "messages": [
      {"role": "user", "content": "Hallo, stellen Sie sich kurz vor"}
    ]
  }'
```

**Sie sollten sehen**:

- HTTP 200
- Die Antwortheader können `X-Account-Email` und `X-Mapped-Model` enthalten (zur Fehlerbehebung)
- Der Antwortkörper ist ein JSON im Anthropic Messages-Stil (`type: "message"`)
### Schritt 6: Wenn Sie Streaming benötigen, öffnen Sie `stream: true`

**Warum**
Claude Code verwendet SSE; Sie können SSE auch selbst mit curl ausführen, um zu bestätigen, dass es keine Proxy-/Pufferprobleme gibt.

```bash
curl -N "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<wählen Sie eines aus /v1/models/claude>",
    "max_tokens": 128,
    "stream": true,
    "messages": [
      {"role": "user", "content": "Erklären Sie in 3 Sätzen, was ein lokaler Reverse-Proxy ist"}
    ]
  }'
```

**Sie sollten sehen**: Zeile für Zeile SSE-Ereignisse (`event: message_start`, `event: content_block_delta` usw.).

## Checkpoint ✅

- `GET /healthz` gibt `{"status":"ok"} zurück`
- `GET /v1/models/claude` kann `data[].id` erhalten
- `POST /v1/messages` kann mit 200 zurückgeben (nicht-streaming JSON oder streaming SSE, wählen Sie eines)

## Warnungen vor Fallstricken

### 1) Schreiben Sie die Base URL nicht zu `.../v1`

Das Beispiel von Claude Code ist `ANTHROPIC_BASE_URL="http://127.0.0.1:8045"`, da die Router-Route auf der Proxy-Seite bereits `/v1/messages` enthält.

### 2) Wenn die Authentifizierung aktiviert ist, aber `proxy.api_key` leer ist, wird direkt abgelehnt

Wenn die Proxy-Authentifizierung aktiviert ist, aber `api_key` leer ist, gibt die Middleware direkt 401 zurück (siehe Schutzlogik in `src-tauri/src/proxy/middleware/auth.rs`).

### 3) `/v1/messages/count_tokens` ist unter dem Standardpfad eine Platzhalter-Implementierung

Wenn die z.ai-Weiterleitung nicht aktiviert ist, gibt dieser Endpunkt direkt `input_tokens: 0, output_tokens: 0` zurück (siehe `handle_count_tokens`). Verwenden Sie ihn nicht, um echte Tokens zu bestimmen.

### 4) Sie haben Streaming explizit nicht aktiviert, sehen aber, dass der Server "intern SSE verwendet"

Der Proxy hat eine Kompatibilitätsstrategie für `/v1/messages`: Wenn der Client kein Streaming anfordert, verwendet der Server möglicherweise **intern erzwungenes Streaming** und sammelt dann die Ergebnisse zu JSON zurück (siehe Logik von `force_stream_internally` in `handle_messages`).

## Zusammenfassung des Kurses

- Damit Claude Code/Anthropic-Clients funktionieren, sind es im Grunde 3 Dinge: Base URL, Authentifizierungsheader, `/v1/messages`-Anfragetext
- Damit "das Protokoll funktioniert + lange Sitzungen stabil sind", bereinigt der Proxy die Nachrichtenhistorie, fängt Warmup ab und wiederholt/rotiert Konten bei Fehlern
- `count_tokens` kann derzeit nicht als echter Maßstab verwendet werden (es sei denn, Sie haben den entsprechenden Weiterleitungspfad aktiviert)
## Vorschau auf den nächsten Kurs

> Im nächsten Kurs lernen wir **[Gemini native API: /v1beta/models und Endpunktintegration für Google SDK](/de/lbjlaq/Antigravity-Manager/platforms/gemini/)**.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilen |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| `count_tokens` (gibt 0 zurück, wenn z.ai nicht aktiviert ist) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1210) | 1186-1210 |
|--- | --- | ---|
|--- | --- | ---|
| Anfragebereinigung: Entfernen von `cache_control` | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L68-L148) | 68-148 |
| Anfragebereinigung: Zusammenführen aufeinanderfolgender Nachrichten derselben Rolle | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L253-L296) | 253-296 |
|--- | --- | ---|

**Wichtige Konstanten**:
- `MAX_RETRY_ATTEMPTS = 3`: Maximale Anzahl von Wiederholungen für `/v1/messages`

</details>
