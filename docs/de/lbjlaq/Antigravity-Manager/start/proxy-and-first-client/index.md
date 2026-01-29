---
title: "Proxy-Start: Reverse-Proxy und Client-Verbindung | Antigravity-Manager"
sidebarTitle: "Reverse-Proxy in 5 Minuten"
subtitle: "Lokalen Reverse-Proxy starten und ersten Client verbinden (/healthz + SDK-Konfiguration)"
description: "Lernen Sie den Antigravity-Reverse-Proxy-Start und Client-Verbindung: Port- und Authentifizierungseinstellungen, Verbindungsprüfung mit /healthz, erstes SDK-Call abgeschlossen."
tags:
  - "API Proxy"
  - "healthz"
  - "OpenAI SDK"
  - "Anthropic SDK"
  - "Gemini SDK"
  - "Base URL"
prerequisite:
  - "start-installation"
  - "start-add-account"
duration: 18
order: 6
---

# Lokalen Reverse-Proxy starten und ersten Client verbinden (/healthz + SDK-Konfiguration)

In dieser Lektion bringen wir den lokalen Reverse-Proxy (API Proxy) mit Antigravity Tools zum Laufen: Starten des Dienstes, Verbindungsprüfung mit `/healthz`, dann Verbindung eines SDK für die erste Anfrage.

## Was Sie nach dieser Lektion können

- Starten/Stoppen des lokalen Reverse-Proxy-Dienstes auf der API Proxy-Seite von Antigravity Tools
- Verbindungsprüfung mit `GET /healthz` durchführen, um "Port richtig, Dienst läuft tatsächlich" zu bestätigen
- Das Verhältnis zwischen `auth_mode` und API Key verstehen: welche Pfade Authentifizierung benötigen, welcher Header mitgeführt werden muss
- Wählen Sie einen Client (OpenAI / Anthropic / Gemini SDK) und führen Sie die erste echte Anfrage aus

## Ihre aktuelle Herausforderung

- Sie haben Antigravity Tools bereits installiert und Konten hinzugefügt, wissen aber nicht, ob der Reverse-Proxy tatsächlich erfolgreich gestartet wurde
- Bei der Client-Verbindung treten oft `401` (kein key mitgeführt) oder `404` (Base URL falsch zusammengesetzt/überlappende Pfade) auf
- Sie möchten nicht raten, sondern den kürzesten geschlossenen Kreislauf: Start → Verbindungsprüfung → erste erfolgreiche Anfrage

## Wann verwenden Sie diese Methode

- Sie haben gerade installiert und möchten bestätigen, dass das lokale Gateway extern arbeiten kann
- Sie haben den Port geändert, LAN-Zugriff aktiviert oder den Authentifizierungsmodus geändert und möchten schnell überprüfen, ob die Konfiguration nicht fehlerhaft ist
- Sie möchten einen neuen Client / neues SDK verbinden und möchten zuerst mit einem minimalen Beispiel zum Laufen bringen

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen
- Sie haben die Installation abgeschlossen und können Antigravity Tools normal öffnen.
- Sie haben mindestens ein verfügbares Konto; sonst wird beim Starten des Reverse-Proxys ein Fehler zurückgegeben `"Kein verfügbares Konto, bitte zuerst Konto hinzufügen"` (nur wenn z.ai-Verteilung auch nicht aktiviert ist).
:::

::: info Begriffe, die in dieser Lektion immer wieder auftreten
- **Base URL**: Die "Dienst-Root-Adresse", die der Client anfragt. Die Zusammensetzung unterscheidet sich je nach SDK, manche benötigen `/v1`, andere nicht.
- **Verbindungsprüfung (Health Check)**: Bestätigen Sie die Erreichbarkeit des Dienstes mit einer minimalen Anfrage. Der Verbindungsprüfungsendpunkt dieses Projekts ist `GET /healthz`, Rückgabe `{"status":"ok"}`.
:::

## Kernkonzept

1. Wenn Antigravity Tools den Reverse-Proxy startet, wird die Überwachungsadresse und der Port basierend auf der Konfiguration gebunden:
   - Bei `allow_lan_access=false` wird `127.0.0.1` gebunden
   - Bei `allow_lan_access=true` wird `0.0.0.0` gebunden
2. Sie müssen zuerst keinen Code schreiben. Verwenden Sie zuerst `GET /healthz` zur Verbindungsprüfung, um "Dienst läuft" zu bestätigen.
3. Wenn Sie Authentifizierung aktivieren:
   - `auth_mode=all_except_health` nimmt `/healthz` aus
   - `auth_mode=strict` erfordert API Key für alle Pfade

## Machen Sie mit

### Schritt 1: Port, LAN-Zugriff und Authentifizierungsmodus bestätigen

**Warum**
Sie müssen zuerst bestätigen "wohin der Client verbinden soll (host/port)" und "ob key mitgeführt werden muss", sonst sind 401/404 später schwer zu beheben.

Öffnen Sie die `API Proxy`-Seite in Antigravity Tools und achten Sie auf diese 4 Felder:

- `port`: Standard ist `8045`
- `allow_lan_access`: Standard deaktiviert (nur lokaler Zugriff)
- `auth_mode`: Wahlweise `off/strict/all_except_health/auto`
- `api_key`: Standard wird `sk-...` generiert, und die UI validiert, dass es mit `sk-` beginnen muss und mindestens 10 Zeichen lang ist

**Sie sollten sehen**
- Oben rechts auf der Seite befindet sich ein Start/Stop-Button (Starten/Stoppen des Reverse-Proxys), das Port-Eingabefeld wird deaktiviert, wenn der Dienst läuft

::: tip Empfohlene Konfiguration für Einsteiger (zuerst zum Laufen bringen, dann Sicherheit hinzufügen)
- Erstes Laufen: `allow_lan_access=false` + `auth_mode=off`
- Wenn LAN-Zugriff benötigt wird: zuerst `allow_lan_access=true` aktivieren, dann `auth_mode` auf `all_except_health` umschalten (zumindest nicht das gesamte LAN als "nackte API" freigeben)
:::

### Schritt 2: Reverse-Proxy-Dienst starten

**Warum**
Start in der GUI ruft das Backend-Kommando auf, um den Axum-Server zu starten und den Konto-Pool zu laden; dies ist die Voraussetzung dafür, "API nach außen bereitzustellen".

Klicken Sie oben rechts auf der Seite auf Start.

**Sie sollten sehen**
- Status ändert sich von stopped zu running
- Daneben wird die Anzahl der aktuell geladenen Konten angezeigt (active accounts)

::: warning Wenn der Start fehlschlägt, die häufigsten beiden Fehlerarten
- `"Kein verfügbares Konto, bitte zuerst Konto hinzufügen"`: Der Konto-Pool ist leer und z.ai-Verteilung ist nicht aktiviert.
- `"Starten des Axum-Servers fehlgeschlagen: Adresse <host:port> Bindung fehlgeschlagen: ..."`: Port belegt oder keine Berechtigung (anderen Port versuchen).
:::

### Schritt 3: Mit /healthz Verbindungsprüfung durchführen (kürzester geschlossener Kreislauf)

**Warum**
`/healthz` ist die stabilste "Erreichbarkeitsbestätigung". Es hängt nicht vom Modell, Konto oder Protokollkonvertierung ab, sondern validiert nur, ob der Dienst erreichbar ist.

Ersetzen Sie `<PORT>` durch den Port, den Sie in der UI sehen (Standard `8045`):

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**Sie sollten sehen**

```json
{"status":"ok"}
```

::: details Wie testen, wenn Authentifizierung erforderlich ist?
Wenn Sie `auth_mode` auf `strict` umschalten, benötigen alle Pfade einen key (einschließlich `/healthz`).

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```

Empfohlene Schreibweise des Authentifizierungs-Headers (kompatibel mit mehr Formen):
- `Authorization: Bearer <proxy.api_key>` oder `Authorization: <proxy.api_key>`
- `x-api-key: <proxy.api_key>`
- `x-goog-api-key: <proxy.api_key>`
:::

### Schritt 4: Ihren ersten Client verbinden (OpenAI / Anthropic / Gemini, wählen Sie eines aus)

**Warum**
`/healthz` zeigt nur "Dienst erreichbar"; die echte Verbindungserfolgserfolg basiert darauf, dass das SDK eine echte Anfrage startet.

::: code-group

```python [OpenAI SDK (Python)]
import openai

client = openai.OpenAI(
    api_key="<API_KEY>",
    base_url="http://127.0.0.1:8045/v1",
)

resp = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Hallo, bitte stellen Sie sich vor"}],
)

print(resp.choices[0].message.content)
```

```bash [Claude Code / Anthropic CLI]
export ANTHROPIC_API_KEY="<API_KEY>"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

```python [Gemini SDK (Python)]
import google.generativeai as genai

genai.configure(
    api_key="<API_KEY>",
    transport="rest",
    client_options={"api_endpoint": "http://127.0.0.1:8045"},
)

model = genai.GenerativeModel("gemini-3-flash")
resp = model.generate_content("Hello")
print(resp.text)
```

:::

**Sie sollten sehen**
- Der Client kann eine nicht-leere Textantwort erhalten
- Wenn Sie Proxy Monitor aktiviert haben, sehen Sie auch diesen Anfragedatensatz in der Überwachung

## Prüfpunkt ✅

- `GET /healthz` gibt `{"status":"ok"} zurück
- API Proxy-Seite zeigt running
- Eines der SDK-Beispiele, die Sie gewählt haben, kann Inhalte zurückgeben (nicht 401/404, auch keine leere Antwort)

## Warnung vor häufigen Problemen

::: warning 401: Meistens Authentifizierung nicht abgestimmt
- Sie haben `auth_mode` aktiviert, aber der Client hat keinen key mitgeführt.
- Sie haben key mitgeführt, aber der Header-Name ist falsch: Dieses Projekt ist gleichzeitig kompatibel mit `Authorization` / `x-api-key` / `x-goog-api-key`.
:::

::: warning 404: Meistens Base URL falsch zusammengesetzt oder "überlappende Pfade"
- OpenAI SDK benötigt normalerweise `base_url=.../v1`; während die Beispiele von Anthropic/Gemini ohne `/v1` sind.
- Manche Clients fügen Pfade doppelt zu ähnlich wie `/v1/chat/completions/responses`, was zu 404 führt (im Projekt README wurde das Problem der überlappenden Pfade im OpenAI-Modus von Kilo Code speziell erwähnt).
:::

::: warning LAN-Zugriff ist nicht "einschalten, fertig"
Wenn Sie `allow_lan_access=true` aktivieren, bindet der Dienst an `0.0.0.0`. Das bedeutet, dass andere Geräte im selben LAN über Ihre Maschinen-IP + Port zugreifen können.

Wenn Sie dies so verwenden möchten, aktivieren Sie mindestens `auth_mode` und setzen Sie einen starken `api_key`.
:::

## Zusammenfassung dieser Lektion

- Nach dem Starten des Reverse-Proxys, zuerst mit `/healthz` Verbindungsprüfung durchführen, dann SDK konfigurieren
- `auth_mode` bestimmt, welche Pfade einen key benötigen; `all_except_health` nimmt `/healthz` aus
- Bei der SDK-Verbindung ist das am leichtesten falsch zu machen, ob die Base URL `/v1` benötigt

## Vorschau auf die nächste Lektion

> In der nächsten Lektion klären wir die Details der OpenAI-kompatiblen API: einschließlich der Kompatibilitätsgrenze von `/v1/chat/completions` und `/v1/responses`.
>
> Gehen Sie zu **[OpenAI-kompatible API: Implementierungsstrategie für /v1/chat/completions und /v1/responses](/de/lbjlaq/Antigravity-Manager/platforms/openai/)**.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Thema | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Reverse-Proxy-Dienst starten/stoppen/Status | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L178) | 42-178 |
| Konto-Pool-Prüfung vor dem Start (Fehlerbedingung bei keinem Konto) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L81-L91) | 81-91 |
| Routen-Registrierung (einschließlich `/healthz`) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| `/healthz` Rückgabewert | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Proxy-Authentifizierungs-Middleware (Header-Kompatibilität und `/healthz`-Ausnahme) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| Tatsächliche Analyse-Logik von `auth_mode=auto` | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L19-L30) | 19-30 |
| ProxyConfig-Standardwerte (Port 8045, standardmäßig nur lokaler Zugriff) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| Bindungsadresse-Ableitung (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L291) | 281-291 |
| UI Starten/Stoppen-Button ruft `start_proxy_service/stop_proxy_service` auf | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L624-L639) | 624-639 |
| UI Port/LAN/Authentifizierung/API key-Konfigurationsbereich | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L868-L1121) | 868-1121 |
| README Claude Code / Python Verbindungsbeispiele | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L227) | 197-227 |

</details>
