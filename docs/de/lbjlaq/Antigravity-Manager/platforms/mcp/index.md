---
title: "MCP-Endpunkte: Tools verfügbar machen | Antigravity-Manager"
sidebarTitle: "Claude Zugriff auf z.ai-Fähigkeiten geben"
subtitle: "MCP-Endpunkte: Web Search/Reader/Vision als aufrufbare Tools verfügbar machen"
description: "Lernen Sie die Konfiguration der MCP-Endpunkte von Antigravity Manager. Aktivieren Sie Web Search/Reader/Vision, verifizieren Sie Tool-Aufrufe, integrieren Sie externe Clients und beherrschen Sie die Fehlerbehebung."
tags:
  - "MCP"
  - "Web Search"
  - "Web Reader"
  - "Vision"
  - "z.ai"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 6
---

# MCP-Endpunkte: Web Search/Reader/Vision als aufrufbare Tools verfügbar machen

Mit diesen **MCP-Endpunkten** machen Sie die Such-, Les- und Sehfähigkeiten von z.ai für externe MCP-Clients verfügbar. Der Fokus liegt darauf, den Unterschied zwischen „Remote-Reverse-Proxy“ und „Integrierter Server“ zu verstehen und wie diese Endpunkte aktiviert und aufgerufen werden.

## Was Sie nach diesem Tutorial können

- Das Funktionsprinzip der drei MCP-Endpunkt-Typen verstehen (Remote-Reverse-Proxy vs. Integrierter Server)
- Web Search/Web Reader/Vision MCP-Endpunkte in Antigravity Tools aktivieren
- Externe MCP-Clients (wie Claude Desktop, Cursor) über das lokale Gateway diese Fähigkeiten aufrufen lassen
- Sitzungsverwaltung (Vision MCP) und Authentifizierungsmodell beherrschen

## Ihr aktuelles Problem

Viele KI-Tools unterstützen MCP (Model Context Protocol), erfordern aber die Konfiguration eines Upstream-API-Key und einer URL. Der MCP-Server von z.ai bietet ebenfalls leistungsstarke Fähigkeiten (Suche, Lesen, Visualanalyse), aber die direkte Konfiguration bedeutet, dass Sie den z.ai-Key in jedem Client offenlegen müssen.

Die Lösung von Antigravity Tools: Verwalten Sie den z.ai-Key auf der lokalen Gateway-Ebene einheitlich, machen Sie die MCP-Endpunkte verfügbar, und Clients müssen sich nur mit dem lokalen Gateway verbinden, ohne den z.ai-Key kennen zu müssen.

## Wann Sie diesen Ansatz verwenden sollten

- Sie haben mehrere MCP-Clients (Claude Desktop, Cursor, selbst entwickelte Tools) und möchten einheitlich einen einzigen z.ai-Key verwenden
- Sie möchten die Web Search/Web Reader/Vision-Fähigkeiten von z.ai als Tools für die KI verfügbar machen
- Sie möchten nicht an mehreren Orten den z.ai-Key konfigurieren und rotieren

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen
- Sie haben den Reverse-Proxy-Dienst auf der „API Proxy“-Seite von Antigravity Tools bereits gestartet
- Sie haben bereits einen z.ai-API-Key (aus der z.ai-Konsole)
- Sie kennen den Port des Reverse-Proxies (Standard `8045`)
:::

::: info Was ist MCP?
MCP (Model Context Protocol) ist ein offenes Protokoll, das KI-Clients ermöglicht, externe Tools/Datenquellen aufzurufen.

Typischer MCP-Interaktionsablauf:
1. Der Client (z. B. Claude Desktop) sendet eine `tools/list`-Anfrage an den MCP-Server, um die Liste der verfügbaren Tools abzurufen
2. Der Client wählt basierend auf dem Kontext ein Tool aus und sendet eine `tools/call`-Anfrage
3. Der MCP-Server führt das Tool aus und gibt das Ergebnis zurück (Text, Bilder, Daten usw.)

Antigravity Tools bietet drei MCP-Endpunkte:
- **Remote-Reverse-Proxy**: Direkte Weiterleitung an den z.ai-MCP-Server (Web Search/Web Reader)
- **Integrierter Server**: Lokale Implementierung des JSON-RPC 2.0-Protokolls, verarbeitet Tool-Aufrufe (Vision)
:::

## Was sind MCP-Endpunkte?

**MCP-Endpunkte** sind eine Gruppe von HTTP-Routen, die Antigravity Tools verfügbar macht, damit externe MCP-Clients auf die Fähigkeiten von z.ai zugreifen können, während Antigravity Tools die Authentifizierung und Konfiguration einheitlich verwaltet.

### Endpunkt-Typen

| Endpunkt-Typ | Implementierungsart | Lokaler Pfad | Upstream-Ziel |
|--- | --- | --- | ---|
| **Web Search** | Remote-Reverse-Proxy | `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` |
| **Web Reader** | Remote-Reverse-Proxy | `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` |
| **Vision MCP** | Integrierter Server (JSON-RPC 2.0) | `/mcp/zai-mcp-server/mcp` | Interner Aufruf der z.ai PaaS API |

### Wichtige Unterschiede

::: info Remote-Reverse-Proxy vs. Integrierter Server
**Remote-Reverse-Proxy** (Web Search/Web Reader):
- Der Proxy behält einige Request-Header bei (`content-type`, `accept`, `user-agent`) und injiziert den `Authorization`-Header
- Der Proxy leitet den Upstream-Response-Body und Statuscode weiter, behält aber nur den `CONTENT_TYPE`-Response-Header
- Zustandslos, keine Sitzungsverwaltung erforderlich

**Integrierter Server** (Vision MCP):
- Vollständige Implementierung des JSON-RPC 2.0-Protokolls (`initialize`, `tools/list`, `tools/call`)
- Zustandsbehaftet: Erstellt eine Sitzung (`mcp-session-id`), GET-Endpunkt gibt SSE keepalive zurück
- Tool-Logik wird lokal implementiert, ruft z.ai PaaS API für die Visualanalyse auf
:::

## Kernkonzept

Die MCP-Endpunkte von Antigravity Tools folgen den folgenden Designprinzipien:

1. **Einheitliche Authentifizierung**: Antigravity verwaltet den z.ai-Key, Clients müssen ihn nicht konfigurieren
2. **Ein-/Ausschaltbar**: Die drei Endpunkte können unabhängig aktiviert/deaktiviert werden
3. **Sitzungsisolierung**: Vision MCP verwendet `mcp-session-id`, um verschiedene Clients zu isolieren
4. **Transparente Fehler**: Upstream-Response-Body und Statuscode werden unverändert weitergeleitet (Response-Header werden gefiltert)

### Authentifizierungsmodell

```
MCP-Client → Antigravity lokaler Proxy → z.ai Upstream
               ↓
           [Optional] proxy.auth_mode
               ↓
           [Automatisch] z.ai-Key injizieren
```

Die Proxy-Middleware von Antigravity Tools (`src-tauri/src/proxy/middleware/auth.rs`) prüft `proxy.auth_mode`. Wenn die Authentifizierung aktiviert ist, muss der Client einen API-Key mitbringen.

**Wichtig**: Unabhängig von `proxy.auth_mode` wird der z.ai-Key vom Proxy automatisch injiziert, Clients müssen ihn nicht konfigurieren.

## Schritt für Schritt

### Schritt 1: z.ai konfigurieren und MCP-Funktionen aktivieren

**Warum**
Stellen Sie zunächst sicher, dass die z.ai-Basiskonfiguration korrekt ist, und aktivieren Sie dann die MCP-Endpunkte einzeln.

1. Öffnen Sie Antigravity Tools und gehen Sie zur Seite **API Proxy**
2. Finden Sie die Karte **z.ai-Konfiguration** und klicken Sie darauf, um sie zu erweitern
3. Konfigurieren Sie die folgenden Felder:

```yaml
 # z.ai-Konfiguration
base_url: "https://api.z.ai/api/anthropic"  # z.ai Anthropic-kompatibler Endpunkt
api_key: "ihr-z.ai-api-key"                 # Aus der z.ai-Konsole
enabled: true                               # z.ai aktivieren
```

4. Finden Sie die Unterkarte **MCP-Konfiguration** und konfigurieren Sie:

```yaml
 # MCP-Konfiguration
enabled: true                              # MCP-Hauptschalter aktivieren
web_search_enabled: true                    # Web Search aktivieren
web_reader_enabled: true                    # Web Reader aktivieren
vision_enabled: true                        # Vision MCP aktivieren
```

**Was Sie sehen sollten**: Nach dem Speichern der Konfiguration sollte unten auf der Seite eine Liste „Lokale MCP-Endpunkte“ erscheinen, die die vollständigen URLs der drei Endpunkte anzeigt.

### Schritt 2: Web Search-Endpunkt verifizieren

**Warum**
Web Search ist ein Remote-Reverse-Proxy, am einfachsten, eignet sich zur ersten Verifizierung der Basiskonfiguration.

```bash
 # 1) Zuerst die vom Web Search-Endpunkt bereitgestellten Tools auflisten (Tool-Name basierend auf tatsächlichem Rückgabewert)
curl -X POST http://127.0.0.1:8045/mcp/web_search_prime/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**Was Sie sehen sollten**: Eine JSON-Antwort, die eine `tools`-Liste enthält.

::: tip tools/call weiter verifizieren (optional)
Nachdem Sie `tools[].name` und `tools[].inputSchema` erhalten haben, können Sie die `tools/call`-Anfrage gemäß dem Schema zusammenstellen (Parameter basieren auf dem Schema, raten Sie nicht die Felder).
:::

::: tip Endpunkt nicht gefunden?
Wenn Sie `404 Not Found` erhalten, prüfen Sie:
1. Ob `proxy.zai.mcp.enabled` auf `true` gesetzt ist
2. Ob `proxy.zai.mcp.web_search_enabled` auf `true` gesetzt ist
3. Ob der Reverse-Proxy-Dienst läuft
:::

### Schritt 3: Web Reader-Endpunkt verifizieren

**Warum**
Web Reader ist ebenfalls ein Remote-Reverse-Proxy, aber mit unterschiedlichen Parametern und Rückgabeformaten. Verifizieren Sie, dass der Proxy verschiedene Endpunkte korrekt verarbeiten kann.

```bash
 # 2) Die vom Web Reader-Endpunkt bereitgestellten Tools auflisten
curl -X POST http://127.0.0.1:8045/mcp/web_reader/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**Was Sie sehen sollten**: Eine JSON-Antwort, die eine `tools`-Liste enthält.

### Schritt 4: Vision MCP-Endpunkt verifizieren (Sitzungsverwaltung)

**Warum**
Vision MCP ist ein integrierter Server mit Sitzungszustand. Zuerst muss `initialize` aufgerufen werden, dann können Tools aufgerufen werden.

#### 4.1 Sitzung initialisieren

```bash
 # 1) Initialize-Anfrage senden
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05"
    },
    "id": 1
  }'
```

**Was Sie sehen sollten**: Die Antwort sollte den Header `mcp-session-id` enthalten. Speichern Sie diese ID.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "serverInfo": {
      "name": "zai-mcp-server",
      "version": "<app-version>"
    }
  },
  "id": 1
}
```

::: info Hinweis
`serverInfo.version` stammt aus dem Rust-Code `env!("CARGO_PKG_VERSION")` und richtet sich nach der tatsächlich auf Ihrem lokalen System installierten Version.
:::

Response-Header:
```
mcp-session-id: uuid-v4-string
```

#### 4.2 Tool-Liste abrufen

```bash
 # 2) tools/list-Anfrage senden (mit Sitzungs-ID)
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: Ihre-Sitzungs-ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**Was Sie sehen sollten**: Die Definitionen von 8 Tools (`ui_to_artifact`, `extract_text_from_screenshot`, `diagnose_error_screenshot` usw.).

#### 4.3 Tool aufrufen

```bash
 # 3) analyze_image-Tool aufrufen
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: Ihre-Sitzungs-ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "analyze_image",
      "arguments": {
        "image_source": "https://example.com/image.jpg",
        "prompt": "Beschreiben Sie den Inhalt dieses Bildes"
      }
    },
    "id": 3
  }'
```

**Was Sie sehen sollten**: Eine Textbeschreibung des Bildanalyseergebnisses.

::: danger Sitzungs-ID wichtig
Alle Anfragen von Vision MCP (außer `initialize`) müssen den Header `mcp-session-id` enthalten.

Die Sitzungs-ID wird in der `initialize`-Antwort zurückgegeben, nachfolgende Anfragen müssen dieselbe ID verwenden. Wenn die Sitzung verloren geht, muss erneut `initialize` aufgerufen werden.
:::

### Schritt 5: SSE keepalive testen (optional)

**Warum**
Der GET-Endpunkt von Vision MCP gibt einen SSE (Server-Sent Events) Stream zurück, um die Verbindung aktiv zu halten.

```bash
 # 4) GET-Endpunkt aufrufen (SSE-Stream abrufen)
curl -N http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "mcp-session-id: Ihre-Sitzungs-ID"
```

**Was Sie sehen sollten**: Alle 15 Sekunden eine `event: ping`-Nachricht im folgenden Format:

```
event: ping
data: keepalive

event: ping
data: keepalive
...
```

## Checkpoint ✅

### Konfigurationsprüfung

- [ ] `proxy.zai.enabled` ist `true`
- [ ] `proxy.zai.api_key` ist konfiguriert (nicht leer)
- [ ] `proxy.zai.mcp.enabled` ist `true`
- [ ] Mindestens ein MCP-Endpunkt ist aktiviert (`web_search_enabled` / `web_reader_enabled` / `vision_enabled`)
- [ ] Der Reverse-Proxy-Dienst läuft

### Funktionsverifizierung

- [ ] Der Web Search-Endpunkt gibt Suchergebnisse zurück
- [ ] Der Web Reader-Endpunkt gibt Web-Inhalte zurück
- [ ] Der Vision MCP-Endpunkt führt `initialize` erfolgreich aus und erhält `mcp-session-id`
- [ ] Der Vision MCP-Endpunkt gibt eine Tool-Liste zurück (8 Tools)
- [ ] Der Vision MCP-Endpunkt ruft ein Tool erfolgreich auf und gibt das Ergebnis zurück

## Vision MCP-Tools Schnellreferenz

| Tool-Name | Funktion | Erforderliche Parameter | Beispielszenario |
|--- | --- | --- | ---|
| `ui_to_artifact` | UI-Screenshot in Code/Prompt/Spec/Beschreibung konvertieren | `image_source`, `output_type`, `prompt` | Frontend-Code aus Designvorlage generieren |
| `extract_text_from_screenshot` | Text/Code aus Screenshot extrahieren (ähnlich OCR) | `image_source`, `prompt` | Fehlerlog-Screenshot lesen |
| `diagnose_error_screenshot` | Fehler-Screenshot diagnostizieren (Stack-Trace, Logs) | `image_source`, `prompt` | Laufzeitfehler analysieren |
| `understand_technical_diagram` | Architektur-/Ablauf-/UML-/ER-Diagramme analysieren | `image_source`, `prompt` | Systemarchitektur-Diagramm verstehen |
| `analyze_data_visualization` | Diagramme/Dashboards analysieren | `image_source`, `prompt` | Trends aus Dashboard extrahieren |
| `ui_diff_check` | Zwei UI-Screenshots vergleichen und Unterschiede melden | `expected_image_source`, `actual_image_source`, `prompt` | Visuelle Regressionstests |
| `analyze_image` | Allgemeine Bildanalyse | `image_source`, `prompt` | Bildinhalt beschreiben |
| `analyze_video` | Videoinhaltsanalyse | `video_source`, `prompt` | Videoszenen analysieren |

::: info Parameter-Erklärung
- `image_source`: Lokaler Dateipfad (z. B. `/tmp/screenshot.png`) oder Remote-URL (z. B. `https://example.com/image.jpg`)
- `video_source`: Lokaler Dateipfad oder Remote-URL (unterstützt MP4, MOV, M4V)
- `output_type` (für `ui_to_artifact`): `code` / `prompt` / `spec` / `description`
:::

## Häufige Fehler

### 404 Not Found

**Symptom**: Aufruf eines MCP-Endpunkts gibt `404 Not Found` zurück.

**Ursache**:
1. Endpunkt ist nicht aktiviert (entsprechendes `*_enabled` ist `false`)
2. Reverse-Proxy-Dienst ist nicht gestartet
3. URL-Pfad ist falsch (achten Sie auf das Präfix `/mcp/`)

**Lösung**:
1. Prüfen Sie die Konfiguration `proxy.zai.mcp.enabled` und das entsprechende `*_enabled`
2. Prüfen Sie den Status des Reverse-Proxy-Dienstes
3. Bestätigen Sie das URL-Pfad-Format (z. B. `/mcp/web_search_prime/mcp`)

### 400 Bad Request: Missing Mcp-Session-Id

**Symptom**: Aufruf von Vision MCP (außer `initialize`) gibt `400 Bad Request` zurück.

- GET-Endpunkt: Gibt reinen Text `Missing Mcp-Session-Id` zurück
- POST-Endpunkt: Gibt JSON-RPC-Fehler `{"error":{"code":-32000,"message":"Bad Request: missing Mcp-Session-Id"}}` zurück

**Ursache**: Dem Request-Header fehlt `mcp-session-id` oder die ID ist ungültig.

**Lösung**:
1. Stellen Sie sicher, dass die `initialize`-Anfrage erfolgreich ist und Sie `mcp-session-id` aus dem Response-Header erhalten
2. Nachfolgende Anfragen (`tools/list`, `tools/call` sowie SSE keepalive) müssen diesen Header enthalten
3. Wenn die Sitzung verloren geht (z. B. Neustart des Dienstes), muss erneut `initialize` aufgerufen werden

### z.ai is not configured

**Symptom**: Gibt `400 Bad Request` zurück mit Hinweis `z.ai is not configured`.

**Ursache**: `proxy.zai.enabled` ist `false` oder `api_key` ist leer.

**Lösung**:
1. Stellen Sie sicher, dass `proxy.zai.enabled` auf `true` gesetzt ist
2. Stellen Sie sicher, dass `proxy.zai.api_key` konfiguriert ist (nicht leer)

### Upstream-Anfrage fehlgeschlagen

**Symptom**: Gibt `502 Bad Gateway` oder internen Fehler zurück.

**Ursache**:
1. z.ai-API-Key ist ungültig oder abgelaufen
2. Netzwerkverbindungsprobleme (Upstream-Proxy erforderlich)
3. Serverseitiger Fehler von z.ai

**Lösung**:
1. Überprüfen Sie, ob der z.ai-API-Key korrekt ist
2. Prüfen Sie die Konfiguration `proxy.upstream_proxy` (wenn ein Proxy für den Zugriff auf z.ai erforderlich ist)
3. Sehen Sie in den Logs, um detaillierte Fehlerinformationen zu erhalten

## Integration mit externen MCP-Clients

### Konfigurationsbeispiel für Claude Desktop

Die MCP-Client-Konfigurationsdatei von Claude Desktop (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "antigravity-vision": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/zai-mcp-server/mcp"
      ]
    },
    "antigravity-web-search": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/web_search_prime/mcp"
      ]
    }
  }
}
```

::: tip Einschränkungen von Claude Desktop
Der MCP-Client von Claude Desktop benötigt Kommunikation über `stdio`. Wenn Sie HTTP-Endpunkte direkt verwenden, müssen Sie ein Wrapper-Skript schreiben, das `stdio` in HTTP-Anfragen umwandelt.

Alternativ können Sie einen Client verwenden, der HTTP MCP unterstützt (z. B. Cursor).
:::

### HTTP MCP-Clients (wie Cursor)

Wenn der Client HTTP MCP unterstützt, können Sie einfach die Endpunkt-URL konfigurieren:

```yaml
 # Cursor MCP-Konfiguration
mcpServers:
  - name: antigravity-vision
    url: http://127.0.0.1:8045/mcp/zai-mcp-server/mcp
  - name: antigravity-web-search
    url: http://127.0.0.1:8045/mcp/web_search_prime/mcp
```

## Zusammenfassung

Die MCP-Endpunkte von Antigravity Tools machen die Fähigkeiten von z.ai als aufrufbare Tools verfügbar, unterteilt in zwei Kategorien:
- **Remote-Reverse-Proxy** (Web Search/Web Reader): Einfache Weiterleitung, zustandslos
- **Integrierter Server** (Vision MCP): Vollständige Implementierung von JSON-RPC 2.0, mit Sitzungsverwaltung

Wichtige Punkte:
1. Einheitliche Authentifizierung: z.ai-Key wird von Antigravity verwaltet, Clients müssen ihn nicht konfigurieren
2. Ein-/Ausschaltbar: Die drei Endpunkte können unabhängig aktiviert/deaktiviert werden
3. Sitzungsisolierung: Vision MCP verwendet `mcp-session-id`, um Clients zu isolieren
4. Flexible Integration: Unterstützt jeden MCP-protokollkompatiblen Client

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir den **[Cloudflared Ein-Klick-Tunnel](/de/lbjlaq/Antigravity-Manager/platforms/cloudflared/)** kennen.
>
> Sie werden lernen:
> - Wie Sie Cloudflared-Tunnel mit einem Klick installieren und starten
> - Den Unterschied zwischen Quick-Modus und Auth-Modus
> - Wie Sie die lokale API sicher im öffentlichen Internet verfügbar machen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Dokumentation im Repository | [`docs/zai/mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/mcp.md#L1-L57) | 1-57 |

**Wichtige Konstanten**:
- `ZAI_PAAZ_CHAT_COMPLETIONS_URL = "https://api.z.ai/api/paas/v4/chat/completions"`: z.ai PaaS API-Endpunkt (wird für Vision-Tool-Aufrufe verwendet)

**Wichtige Funktionen**:
- `handle_web_search_prime()`: Verarbeitet den Remote-Reverse-Proxy für den Web Search-Endpunkt
- `handle_web_reader()`: Verarbeitet den Remote-Reverse-Proxy für den Web Reader-Endpunkt
- `handle_zai_mcp_server()`: Verarbeitet alle Methoden (GET/POST/DELETE) für den Vision MCP-Endpunkt
- `mcp_session_id()`: Extrahiert `mcp-session-id` aus dem Request-Header
- `forward_mcp()`: Allgemeine MCP-Weiterleitungsfunktion (injiziert Authentifizierung und leitet an den Upstream weiter)
- `tool_specs()`: Gibt die Liste der Tool-Definitionen für Vision MCP zurück
- `call_tool()`: Fühft das angegebene Vision MCP-Tool aus

</details>

