---
title: "Gemini API: Lokales Gateway | Antigravity-Manager"
subtitle: "Gemini API Integration: Google SDK direkt mit lokalem Gateway verbinden"
sidebarTitle: "Lokales Gemini"
description: "Erfahren Sie, wie Sie Antigravity-Managers lokales Gateway für Gemini integrieren. Über den /v1beta/models-Endpunkt lernen Sie generateContent- und streamGenerateContent-Aufrufe und verifizieren mit cURL und Python."
tags:
  - "Gemini"
  - "Google SDK"
  - "API-Proxy"
  - "v1beta"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 3
---

# Gemini API Integration: Google SDK direkt mit lokalem Gateway verbinden

## Was Sie lernen können

- Nutzen Sie die nativen Gemini-Endpunkte (`/v1beta/models/*`), die von Antigravity Tools bereitgestellt werden, um Ihre Clients zu integrieren
- Rufen Sie das lokale Gateway über Google-kompatible `:generateContent` / `:streamGenerateContent`-Pfade auf
- Verstehen Sie, warum `x-goog-api-key` direkt funktioniert, wenn Proxy-Authentifizierung aktiviert ist

## Ihr aktuelles Problem

Sie haben den lokalen Reverse-Proxy bereits gestartet, stoßen aber bei Gemini auf Probleme:

- Das Google SDK ruft standardmäßig `generativelanguage.googleapis.com` auf – wie ändern Sie es zu `http://127.0.0.1:<port>`?
- Gemini-Pfade enthalten Doppelpunkte (`models/<model>:generateContent`), viele Clients erzeugen bei der Verkettung 404-Fehler
- Sie haben die Proxy-Authentifizierung aktiviert, aber Google-Clients senden kein `x-api-key`, daher erhalten Sie ständig 401

## Wann Sie diesen Ansatz nutzen

- Sie möchten das "nativen Gemini-Protokoll" anstelle der OpenAI/Anthropic-Kompatibilitätsschicht verwenden
- Sie haben bereits Google-/Third-Party-Clients im Gemini-Stil und möchten sie mit minimalen Aufwand zum lokalen Gateway migrieren

## 🎒 Vorbereitungen

::: warning Voraussetzungen
- Sie haben bereits mindestens ein Konto in der App hinzugefügt (andernfalls kann das Backend kein upstream Access Token abrufen)
- Sie haben den lokalen Reverse-Proxy-Dienst gestartet und kennen den überwachten Port (standardmäßig `8045`)
:::

## Kernkonzept

Antigravity Tools stellt native Gemini-Pfade auf dem lokalen Axum-Server bereit:

- Liste: `GET /v1beta/models`
- Aufruf: `POST /v1beta/models/<model>:generateContent`
- Streaming: `POST /v1beta/models/<model>:streamGenerateContent`

Das Backend umhüllt Ihren nativen Gemini-Request-Body mit einer v1internal-Struktur (injiziert `project`, `requestId`, `requestType` usw.) und leitet ihn an Googles v1internal-Upstream-Endpunkt weiter (mit dem Konten-Access Token).(Quellcode: `src-tauri/src/proxy/mappers/gemini/wrapper.rs`, `src-tauri/src/proxy/upstream/client.rs`)

::: info Warum empfiehlt das Tutorial die Verwendung von 127.0.0.1 als Base URL?
In den Schnellintegrationsbeispielen der App ist `127.0.0.1` fest codiert, um "IPv6-Auflösungsverzögerungen in bestimmten Umgebungen zu vermeiden".(Quellcode: `src/pages/ApiProxy.tsx`)
:::

## Lernen Sie Schritt für Schritt

### Schritt 1: Gateway-Status prüfen (/healthz)

**Warum**
Bestätigen Sie zuerst, dass der Dienst online ist, bevor Sie Protokoll-/Authentifizierungsprobleme untersuchen – das spart viel Zeit.

::: code-group

```bash [macOS/Linux]
curl -s "http://127.0.0.1:8045/healthz"
```

```powershell [Windows]
Invoke-RestMethod "http://127.0.0.1:8045/healthz"
```

:::

**Was Sie sehen sollten**: Rückgabe-JSON mit `{"status":"ok"}` (Quellcode: `src-tauri/src/proxy/server.rs`).

### Schritt 2: Gemini-Modelle auflisten (/v1beta/models)

**Warum**
Sie müssen zuerst bestätigen, wie die "extern bereitgestellte Modell-ID" lautet – alle nachfolgenden `<model>`-Referenzen basieren darauf.

```bash
curl -s "http://127.0.0.1:8045/v1beta/models" | head
```

**Was Sie sehen sollten**: Die Antwort enthält ein `models`-Array, wobei jedes Element ein `name`-Feld ähnlich `models/<id>` hat (Quellcode: `src-tauri/src/proxy/handlers/gemini.rs`).

::: tip Wichtig
Welches Feld für die Modell-ID?
- ✅ Verwenden Sie das `displayName`-Feld (z. B. `gemini-2.0-flash`)
- ✅ Oder entfernen Sie das `models/`-Präfix aus dem `name`-Feld
- ❌ Kopieren Sie nicht den vollständigen Wert des `name`-Felds direkt (dies führt zu Pfadfehlern)

Wenn Sie das `name`-Feld kopieren (z. B. `models/gemini-2.0-flash`) und als Modell-ID verwenden, wird der Request-Pfad zu `/v1beta/models/models/gemini-2.0-flash:generateContent`, was falsch ist.(Quellcode: `src-tauri/src/proxy/common/model_mapping.rs`)
:::

::: warning Wichtig
Derzeit ist `/v1beta/models` eine Rückgabe, die "die lokale dynamische Modellliste als Gemini-Modellliste maskiert" – sie wird nicht in Echtzeit vom Upstream abgerufen.(Quellcode: `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Schritt 3: generateContent aufrufen (Pfad mit Doppelpunkt)

**Warum**
Der Schlüssel zur nativen Gemini-REST-API ist das "mit Doppelpunkt versehene Action" wie `:generateContent`. Das Backend analysiert `model:method` in derselben Route.(Quellcode: `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -s \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:generateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Hello"}]}
    ]
  }'
```

**Was Sie sehen sollten**: Die Antwort-JSON enthält `candidates` (oder äußerer Layer hat `response.candidates`, das Proxy entpackt es).

### Schritt 4: streamGenerateContent aufrufen (SSE)

**Warum**
Streaming ist für "lange Ausgabe/große Modelle" stabiler; das Proxy leitet den Upstream-SSE an Ihren Client weiter und setzt `Content-Type: text/event-stream`.(Quellcode: `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -N \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:streamGenerateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Erzähle mir eine kurze Geschichte"}]}
    ]
  }'
```

**Was Sie sehen sollten**: Das Terminal gibt kontinuierlich SSE-Zeilen in Form von `data: {...}` aus; normalerweise erscheint am Ende `data: [DONE]` (was das Streaming-Ende anzeigt).

::: tip Hinweis
`data: [DONE]` ist das Standard-Endemarkierung für SSE, aber es erscheint **nicht immer**:
- Wenn der Upstream normal beendet und `[DONE]` sendet, leitet das Proxy es weiter
- Wenn der Upstream abnormal getrennt wird, Zeitüberschreitung auftritt oder andere Endsignale sendet, sendet das Proxy kein zusätzliches `[DONE]`

Client-Code sollte nach SSE-Standard verarbeiten: Sowohl `data: [DONE]` als auch Verbindungsabbrüche sollten als Streaming-Ende betrachtet werden.(Quellcode: `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Schritt 5: Mit Python Google SDK direkt lokales Gateway verbinden

**Warum**
Dies ist der Pfad für das "Schnellintegrations"-Beispiel in der Projektoberfläche: Verwenden Sie das Google Generative AI Python-Paket, um `api_endpoint` auf Ihre Reverse-Proxy-Adresse zu verweisen.(Quellcode: `src/pages/ApiProxy.tsx`)

```python
# Installation erforderlich: pip install google-generativeai
import google.generativeai as genai

genai.configure(
    api_key="YOUR_PROXY_API_KEY",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

model = genai.GenerativeModel('<modelId>')
response = model.generate_content("Hello")
print(response.text)
```

**Was Sie sehen sollten**: Das Programm gibt einen Modellantwort-Text aus.

## Prüfpunkte ✅

- `/healthz` kann `{"status":"ok"}` zurückgeben
- `/v1beta/models` kann Modelle auflisten (mindestens 1)
- `:generateContent` kann `candidates` zurückgeben
- `:streamGenerateContent` gibt `Content-Type: text/event-stream` zurück und kann kontinuierlich streamen

## Häufige Stolpersteine

- **401-Fehler können nicht überwunden werden**: Wenn Sie Authentifizierung aktiviert haben, aber `proxy.api_key` leer ist, lehnt das Backend Request direkt ab.(Quellcode: `src-tauri/src/proxy/middleware/auth.rs`)
- **Welcher Header-Schlüssel**: Das Proxy erkennt gleichzeitig `Authorization`, `x-api-key`, `x-goog-api-key`. Daher funktioniert auch "Google-Style-Clients senden nur `x-goog-api-key`".(Quellcode: `src-tauri/src/proxy/middleware/auth.rs`)
- **countTokens-Ergebnis ist immer 0**: Derzeit gibt `POST /v1beta/models/<model>/countTokens` fest `{"totalTokens":0}` zurück, dies ist eine Platzhalter-Implementierung.(Quellcode: `src-tauri/src/proxy/handlers/gemini.rs`)

## Zusammenfassung

- Sie integrieren über `/v1beta/models/*`, nicht `/v1/*`
- Die Schlüsselpfad-Schreibweise ist `models/<modelId>:generateContent` / `:streamGenerateContent`
- Wenn Authentifizierung aktiviert ist, ist `x-goog-api-key` ein vom Proxy explizit unterstützter Request-Header

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Imagen 3 Bildgenerierung: Automatische Zuordnung von OpenAI Images-Parametern size/quality](../imagen/)**.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisierungsdatum: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Gemini-Routen-Registrierung (/v1beta/models/*) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L181) | 170-181 |
| Modell-ID-Analyse und Routing (warum `models/`-Präfix zu Routing-Fehlern führt) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L58-L77) | 58-77 |
| `model:method`-Analyse + generate/stream-Hauptlogik | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L14-L337) | 14-337 |
| SSE-Ausgabelogik (Weiterleitung von `[DONE]` statt automatisches Nachsenden) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L161-L183) | 161-183 |
| `/v1beta/models` Rückgabestruktur (dynamische Modelllisten-Maske) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L39-L71) | 39-71 |
| `countTokens` Platzhalter-Implementierung (fest 0) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L73-L79) | 73-79 |
| Authentifizierungs-Header-Kompatibilität (inkl. `x-goog-api-key`) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |
| Google SDK Python-Beispiel (`api_endpoint` auf lokales Gateway verweisen) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L692-L734) | 692-734 |
| Gemini-Sitzungs-Fingerprint (Sticky/Cache mit session_id) | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L121-L158) | 121-158 |
| Gemini-Request v1internal-Wrapper (Injection von project/requestId/requestType usw.) | [`src-tauri/src/proxy/mappers/gemini/wrapper.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/gemini/wrapper.rs#L5-L160) | 5-160 |
| Upstream v1internal-Endpunkt und Fallback | [`src-tauri/src/proxy/upstream/client.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/client.rs#L8-L182) | 8-182 |

**Wichtige Konstanten**:
- `MAX_RETRY_ATTEMPTS = 3`：Obere Grenze für maximale Gemini-Request-Rotationsanzahl (Quellcode: `src-tauri/src/proxy/handlers/gemini.rs`)

</details>
