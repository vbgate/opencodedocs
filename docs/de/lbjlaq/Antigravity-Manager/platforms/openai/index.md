---
title: "OpenAI API: Einrichtung der Integration | Antigravity-Manager"
sidebarTitle: "In 5 Minuten das OpenAI SDK anschließen"
subtitle: "OpenAI API: Einrichtung der Integration"
description: "Lerne die Einrichtung der OpenAI-kompatiblen API. Meistere Routing-Konvertierung, base_url-Einstellungen und die Fehlerbehebung von 401/404/429, um Antigravity Tools schnell zu nutzen."
tags:
  - "OpenAI"
  - "API-Proxy"
  - "Chat Completions"
  - "Responses"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 1
---

# OpenAI-kompatible API: Umsetzungsstrategien für /v1/chat/completions und /v1/responses

Du wirst diese **OpenAI-kompatible API** verwenden, um vorhandene OpenAI SDKs/Clients direkt mit dem lokalen Gateway von Antigravity Tools zu verbinden. Der Fokus liegt auf der erfolgreichen Ausführung von `/v1/chat/completions` und `/v1/responses`, und du lernst, wie du mithilfe der Antwort-Header schnell Probleme beheben kannst.

## Was du nach diesem Tutorial kannst

- OpenAI SDKs (oder curl) direkt mit dem lokalen Gateway von Antigravity Tools verbinden
- `/v1/chat/completions` (inklusive `stream: true`) und `/v1/responses` erfolgreich ausführen
- Die Modellliste von `/v1/models` verstehen und den `X-Mapped-Model`-Header in den Antworten interpretieren
- Bei 401/404/429-Fehlern wissen, wo du zuerst suchen musst

## Dein aktuelles Problem

Viele Clients/SDKs erkennen nur das OpenAI-Interface-Format: feste URLs, feste JSON-Felder, festes SSE-Streaming-Format. Ziel von Antigravity Tools ist nicht, deinen Client zu ändern, sondern den Client glauben zu lassen, er würde OpenAI aufrufen – während die Anfragen tatsächlich in interne Upstream-Aufrufe konvertiert und die Ergebnisse zurück in das OpenAI-Format transformiert werden.

## Wann diese Methode verwenden

- Du hast bereits eine Reihe von Tools, die nur OpenAI unterstützen (IDE-Plugins, Skripte, Bots, SDKs) und möchtest nicht für jedes eine neue Integration schreiben
- Du möchtest über eine einheitliche `base_url` Anfragen an das lokale (oder LAN-)Gateway senden und das Gateway dann die Kontoverwaltung, Wiederholungen und Überwachung übernehmen

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen
- Du hast den Reverse-Proxy-Dienst auf der Seite "API Proxy" in Antigravity Tools gestartet und den Port notiert (z.B. `8045`)
- Du hast mindestens ein aktives Konto hinzugefügt, da der Reverse-Proxy sonst kein Upstream-Token erhalten kann
:::

::: info Wie wird die Authentifizierung übergeben?
Wenn du `proxy.auth_mode` aktiviert und `proxy.api_key` konfiguriert hast, müssen Anfragen einen API-Schlüssel enthalten.

Die Middleware von Antigravity Tools liest zuerst `Authorization`, ist aber auch kompatibel mit `x-api-key` und `x-goog-api-key`. (Siehe Implementierung in `src-tauri/src/proxy/middleware/auth.rs`)
:::

## Was ist eine OpenAI-kompatible API?

Eine **OpenAI-kompatible API** ist eine Gruppe von HTTP-Routen und JSON/SSE-Protokollen, die "wie OpenAI aussehen". Clients senden Anfragen im OpenAI-Anfrageformat an das lokale Gateway, das Gateway wandelt die Anfragen in interne Upstream-Aufrufe um und konvertiert die Upstream-Antworten zurück in die OpenAI-Antwortstruktur – damit vorhandene OpenAI-SDKs fast ohne Änderungen verwendet werden können.

### Schnellübersicht der kompatiblen Endpunkte (relevant für dieses Tutorial)

| Endpunkt | Verwendung | Code-Nachweis |
|--- | --- | ---|
| `POST /v1/chat/completions` | Chat Completions (inkl. Streaming) | Routenregistrierung in `src-tauri/src/proxy/server.rs`; `src-tauri/src/proxy/handlers/openai.rs` |
| `POST /v1/completions` | Legacy Completions (wiederverwendet denselben Handler) | Routenregistrierung in `src-tauri/src/proxy/server.rs` |
| `POST /v1/responses` | Responses/Codex CLI-Kompatibilität (wiederverwendet denselben Handler) | Routenregistrierung in `src-tauri/src/proxy/server.rs` (Kommentar: kompatibel mit Codex CLI) |
| `GET /v1/models` | Gibt Modellliste zurück (inkl. benutzerdefinierte Zuordnung + dynamische Generierung) | `src-tauri/src/proxy/handlers/openai.rs` + `src-tauri/src/proxy/common/model_mapping.rs` |

## Folge mir

### Schritt 1: Überprüfe mit curl, ob der Dienst läuft (/healthz + /v1/models)

**Warum**
Erst grundlegende Probleme ausschließen wie "Dienst nicht gestartet/Port falsch/durch Firewall blockiert".

```bash
 # 1) Gesundheitscheck
curl -s http://127.0.0.1:8045/healthz

 # 2) Modellliste abrufen
curl -s http://127.0.0.1:8045/v1/models
```

**Du solltest sehen**: `/healthz` gibt etwa `{"status":"ok"}` zurück; `/v1/models` gibt `{"object":"list","data":[...]}` zurück.

### Schritt 2: Rufe /v1/chat/completions mit dem OpenAI Python SDK auf

**Warum**
Dieser Schritt beweist, dass die gesamte Kette "OpenAI SDK → lokales Gateway → Upstream → OpenAI-Antwortkonvertierung" funktioniert.

```python
import openai

client = openai.OpenAI(
    api_key="sk-antigravity",
    base_url="http://127.0.0.1:8045/v1",
)

response = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Hallo, stelle dich bitte kurz vor"}],
)

print(response.choices[0].message.content)
```

**Du solltest sehen**: Das Terminal gibt einen Text mit der Modellantwort aus.

### Schritt 3: Aktiviere Streaming und bestätige die SSE-Streaming-Rückgabe

**Warum**
Viele Clients verlassen sich auf das SSE-Protokoll von OpenAI (`Content-Type: text/event-stream`). Dieser Schritt bestätigt, dass die Streaming-Verbindung und das Ereignisformat verfügbar sind.

```bash
curl -N http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "stream": true,
    "messages": [
      {"role": "user", "content": "Erkläre in drei Sätzen, was ein lokaler Reverse-Proxy-Gateway ist"}
    ]
  }'
```

**Du solltest sehen**: Das Terminal gibt kontinuierlich Zeilen aus, die mit `data: { ... }` beginnen und mit `data: [DONE]` enden.

### Schritt 4: Führe eine Anfrage mit /v1/responses (Codex/Responses-Stil) erfolgreich aus

**Warum**
Einige Tools verwenden `/v1/responses` oder Felder wie `instructions` und `input` im Anfragekörper. Dieses Projekt "normalisiert" solche Anfragen zu `messages` und verwendet dann dieselbe Konvertierungslogik. (Handler siehe `src-tauri/src/proxy/handlers/openai.rs`)

```bash
curl -s http://127.0.0.1:8045/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "instructions": "Du bist ein strenger Code-Prüfer.",
    "input": "Bitte weise auf den wahrscheinlichsten Bug im folgenden Code hin:\n\nfunction add(a, b) { return a - b }"
  }'
```

**Du solltest sehen**: Die Antwort ist ein OpenAI-ähnliches Antwortobjekt (dieses Projekt konvertiert Gemini-Antworten zu OpenAI `choices[].message.content`).

### Schritt 5: Bestätige, dass das Modell-Routing funktioniert (siehe X-Mapped-Model Antwort-Header)

**Warum**
Das `model`, das du im Client schreibst, ist nicht unbedingt das tatsächlich aufgerufene "physikalische Modell". Das Gateway führt zuerst eine Modellzuordnung durch (inkl. benutzerdefinierte Zuordnung/Platzhalter, siehe [Modell-Routing: Benutzerdefinierte Zuordnung, Platzhalter-Priorität und voreingestellte Strategien](/de/lbjlaq/Antigravity-Manager/advanced/model-router/)) und platziert das Endergebnis in den Antwort-Headern, damit du Fehler beheben kannst.

```bash
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hallo"}]
  }'
```

**Du solltest sehen**: Die Antwort-Header enthalten `X-Mapped-Model: ...` (z.B. zugeordnet zu `gemini-2.5-flash`) und möglicherweise auch `X-Account-Email: ...`.

## Checkpoint ✅

- `GET /healthz` gibt `{"status":"ok"}` (oder äquivalentes JSON) zurück
- `GET /v1/models` gibt `object=list` zurück und `data` ist ein Array
- Nicht-streaming-Anfragen an `/v1/chat/completions` erhalten `choices[0].message.content`
- Bei `stream: true` werden SSE-Nachrichten empfangen und mit `[DONE]` beendet
- `curl -i` zeigt den `X-Mapped-Model` Antwort-Header

## Häufige Fehler

### 1) Falsche Base URL führt zu 404 (am häufigsten)

- In OpenAI SDK-Beispielen muss `base_url` mit `/v1` enden (siehe Python-Beispiel im Projekt-README).
- Manche Clients "stapeln Pfade". Das README weist beispielsweise explizit darauf hin, dass Kilo Code im OpenAI-Modus möglicherweise nicht-standardisierte Pfade wie `/v1/chat/completions/responses` bilden kann, was zu 404 führt.

### 2) 401: Nicht der Downstream ist ausgefallen, sondern du hast keinen Key übergeben oder der Modus ist falsch

Wenn der "aktive Modus" der Authentifizierungsstrategie nicht `off` ist, validiert die Middleware die Header: `Authorization: Bearer <proxy.api_key>`, ist aber auch kompatibel mit `x-api-key` und `x-goog-api-key`. (Siehe Implementierung in `src-tauri/src/proxy/middleware/auth.rs`)

::: tip Hinweis zum Authentifizierungsmodus
Bei `auth_mode = auto` wird basierend auf `allow_lan_access` automatisch entschieden:
- `allow_lan_access = true` → aktiver Modus ist `all_except_health` (außer `/healthz` ist Authentifizierung erforderlich)
- `allow_lan_access = false` → aktiver Modus ist `off` (lokaler Zugriff ohne Authentifizierung)
:::

### 3) 429/503/529: Der Proxy wiederholt und rotiert Konten, aber möglicherweise ist der "Pool erschöpft"

Der OpenAI-Handler führt maximal 3 Versuche durch (begrenzt durch die Größe des Konten-Pools) und wartet/rotiert bei bestimmten Fehlern. (Siehe Implementierung in `src-tauri/src/proxy/handlers/openai.rs`)

## Zusammenfassung dieser Lektion

- `/v1/chat/completions` ist der universellste Endpunkt; `stream: true` verwendet SSE
- `/v1/responses` und `/v1/completions` verwenden denselben Kompatibilitäts-Handler; der Kern besteht darin, Anfragen zuerst zu `messages` zu normalisieren
- `X-Mapped-Model` hilft dir, das Zuordnungsergebnis "Client-Modellname → endgültiges physikalisches Modell" zu bestätigen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion werden wir uns **Anthropic-kompatible API: /v1/messages und Schlüsselkontrakte von Claude Code** ansehen (entsprechendes Kapitel: `platforms-anthropic`).

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicke hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Rückgabe von /v1/models (dynamische Modellliste) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1082-L1102) | 1082-1102 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Konstanten**:
- `MAX_RETRY_ATTEMPTS = 3`: Maximale Anzahl von Versuchen für das OpenAI-Protokoll (inkl. Rotation) (siehe `src-tauri/src/proxy/handlers/openai.rs`)

**Wichtige Funktionen**:
- `transform_openai_request(...)`: Konvertiert OpenAI-Anfragekörper in interne Upstream-Anfrage (siehe `src-tauri/src/proxy/mappers/openai/request.rs`)
- `transform_openai_response(...)`: Konvertiert Upstream-Antworten zu OpenAI `choices`/`usage` (siehe `src-tauri/src/proxy/mappers/openai/response.rs`)

</details>
