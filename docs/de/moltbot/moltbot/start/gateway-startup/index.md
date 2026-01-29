---
title: "Gateway starten: Daemon und Ausführungsmodi | Clawdbot Tutorial"
sidebarTitle: "Gateway immer verfügbar"
subtitle: "Gateway starten: Daemon und Ausführungsmodi"
description: "Lernen Sie, wie Sie den Clawdbot Gateway Daemon starten, verstehen Sie die Unterschiede zwischen Entwicklungs- und Produktionsmodus und beherrschen Sie gängige Startbefehle und Parameterkonfigurationen."
tags:
  - "gateway"
  - "daemon"
  - "startup"
prerequisite:
  - "start-onboarding-wizard"
order: 30
---

# Gateway starten: Daemon und Ausführungsmodi

## Was Sie nach dieser Lektion können

- Gateway im Vordergrund über die Befehlszeile starten
- Gateway als Hintergrund-Daemon konfigurieren (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- Unterschiedliche Bindungsmodi (loopback / LAN / Tailnet) und Authentifizierungsmethoden verstehen
- zwischen Entwicklungs- und Produktionsmodus wechseln
- `--force` verwenden, um belegte Ports freizugeben

## Ihr aktuelles Problem

Sie haben die Einrichtung im Assistenten abgeschlossen und die Grundeinstellungen für Gateway sind bereit. Aber:

- Müssen Sie Gateway jedes Mal manuell im Terminal starten, wenn Sie es verwenden möchten?
- Stoppt Gateway, wenn Sie das Terminalfenster schließen, und Ihr Assistent geht "offline"?
- Möchten Sie Gateway im lokalen Netzwerk oder im Tailscale-Netzwerk zugreifen, wissen aber nicht, wie Sie es konfigurieren?
- Startet Gateway nicht, und Sie wissen nicht, ob es ein Konfigurations- oder Port-Konflikt ist?

## Wann Sie diesen Ansatz verwenden

**Empfohlene Startmethoden**:

| Szenario                  | Befehl                               | Beschreibung                                   |
|--- | --- | ---|
| Tägliche Nutzung                | `clawdbot gateway install` + `clawdbot gateway start` | Automatisch als Hintergrunddienst starten                  |
| Entwicklung und Debugging                | `clawdbot gateway --dev`                     | Entwicklungskonfiguration erstellen, automatisches Neuladen                  |
| Vorübergehendes Testen                | `clawdbot gateway`                           | Im Vordergrund ausführen, Protokolle direkt im Terminal ausgeben            |
| Port-Konflikt                | `clawdbot gateway --force`                   | Port freigeben und starten                    |
|--- | --- | ---|
|--- | --- | ---|

## 🎒 Vorbereitungen

::: warning Vorprüfung

Bevor Sie Gateway starten, stellen Sie sicher:

1. ✅ Die Einrichtung im Assistenten wurde abgeschlossen (`clawdbot onboard`) oder `gateway.mode=local` wurde manuell festgelegt
2. ✅ AI-Modell ist konfiguriert (Anthropic / OpenAI / OpenRouter usw.)
3. ✅ Authentifizierungsmethode ist konfiguriert, wenn externer Netzwerkzugriff erforderlich ist (LAN / Tailnet)
4. ✅ Ihr Nutzungsszenario ist bekannt (lokale Entwicklung vs. Produktionsbetrieb)

:::

## Kernkonzept

**Was ist Gateway?**

Gateway ist das WebSocket-Kontrolleben von Clawdbot. Es ist verantwortlich für:

- **Sitzungsverwaltung**: Verwaltet den Status aller AI-Konversationssitzungen
- **Kanalverbindung**: Verbindet mit WhatsApp, Telegram, Slack und 12+ weiteren Nachrichtenchannels
- **Tool-Aufrufe**: Koordiniert die Ausführung von Tools wie Browser-Automatisierung, Dateioperationen, geplante Aufgaben
- **Knotenverwaltung**: Verwaltet macOS / iOS / Android-Geräteknoten
- **Ereignisverteilung**: Sendet Echtzeitereignisse wie AI-Entwicklungsfortschritt, Tool-Aufrufergebnisse

**Warum wird ein Daemon benötigt?**

Als Hintergrunddienst ausgeführter Gateway bietet folgende Vorteile:

- **Dauerhaft verfügbar**: Auch wenn das Terminal geschlossen ist, bleibt Ihr AI-Assistent verfügbar
- **Automatischer Start**: Der Dienst wird nach einem Systemneustart automatisch wiederhergestellt (macOS LaunchAgent / Linux systemd)
- **Einheitliche Verwaltung**: Lebenszyklus über `start` / `stop` / `restart` Befehle steuern
- **Zentralisierte Protokollierung**: Systemweite Protokollsammlung, erleichtert die Fehlerbehebung

## Folgen Sie mir

### Schritt 1: Gateway starten (Vordergrundmodus)

**Warum**

Der Vordergrundmodus ist für Entwicklung und Testen geeignet. Protokolle werden direkt im Terminal ausgegeben,便于实时查看 Gateway 状态。

```bash
# Mit Standardkonfiguration starten (lauscht auf 127.0.0.1:18789)
clawdbot gateway

# Mit angegebenem Port starten
clawdbot gateway --port 19001

# Ausführliche Protokollierung aktivieren
clawdbot gateway --verbose
```

**Was Sie sehen sollten**:

```bash
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
✓ log file: /Users/you/.clawdbot/logs/gateway.log
```

::: tip Prüfpunkt

- Wenn Sie `listening on ws://...` sehen, ist der Start erfolgreich
- Merken Sie sich die angezeigte PID (Prozess-ID) für weitere Debugging
- Der Standardport ist 18789, kann mit `--port` geändert werden

:::

### Schritt 2: Bindungsmodus konfigurieren

**Warum**

Standardmäßig lauscht Gateway nur auf der lokalen Loopback-Adresse (`127.0.0.1`), was bedeutet, dass nur der lokale Computer verbinden kann. Wenn Sie Gateway im lokalen Netzwerk oder im Tailscale-Netzwerk zugreifen möchten, müssen Sie den Bindungsmodus anpassen.

```bash
# Nur lokaler Loopback (Standard, am sichersten)
clawdbot gateway --bind loopback

# LAN-Zugriff (erfordert Authentifizierung)
clawdbot gateway --bind lan --token "your-token"

# Tailscale-Netzwerkzugriff
clawdbot gateway --bind tailnet --token "your-token"

# Automatische Erkennung (lokal + LAN)
clawdbot gateway --bind auto
```

**Was Sie sehen sollten**:

```bash
# loopback-Modus
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# lan-Modus
✓ listening on ws://192.168.1.100:18789 (PID 12345)
✓ listening on ws://10.0.0.5:18789
```

::: warning Sicherheitshinweis

⚠️ **Wenn Gateway an eine nicht-loopback-Adresse bindet, ist Authentifizierung erforderlich!**

- Wenn Sie `--bind lan` / `--bind tailnet` verwenden, müssen Sie `--token` oder `--password` übergeben
- Andernfalls verweigert Gateway den Start mit dem Fehler: `Refusing to bind gateway to lan without auth`
- Das Authentifizierungstoken wird über die Konfiguration `gateway.auth.token` oder den Parameter `--token` übergeben

:::

### Schritt 3: Als Daemon installieren (macOS / Linux / Windows)

**Warum**

Ein Daemon lässt Gateway im Hintergrund laufen, ohne vom Schließen des Terminalfensters beeinflusst zu werden. Nach einem Systemneustart startet Gateway automatisch, sodass Ihr AI-Assistent immer verfügbar ist.

```bash
# Als Systemdienst installieren (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
clawdbot gateway install

# Dienst starten
clawdbot gateway start

# Dienststatus anzeigen
clawdbot gateway status

# Dienst neu starten
clawdbot gateway restart

# Dienst stoppen
clawdbot gateway stop
```

**Was Sie sehen sollten**:

```bash
# macOS
✓ LaunchAgent loaded
✓ service runtime: active

# Linux
✓ systemd service enabled
✓ service runtime: active

# Windows
✓ Scheduled Task registered
✓ service runtime: running
```

::: tip Prüfpunkt

- Führen Sie `clawdbot gateway status` aus, um zu bestätigen, dass der Dienststatus `active` / `running` ist
- Wenn der Dienst `loaded` anzeigt, aber `runtime: inactive`, führen Sie `clawdbot gateway start` aus
- Daemon-Protokolle werden in `~/.clawdbot/logs/gateway.log` geschrieben

:::

### Schritt 4: Port-Konflikte behandeln (--force)

**Warum**

Der Standardport 18789 kann bereits von einem anderen Prozess belegt sein (z. B. eine vorherige Gateway-Instanz). Mit `--force` kann der Port automatisch freigegeben werden.

```bash
# Port zwangsweise freigeben und Gateway starten
clawdbot gateway --force
```

**Was Sie sehen sollten**:

```bash
✓ force: killed pid 9876 (node) on port 18789
✓ force: waited 1200ms for port 18789 to free
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: info Funktionsweise

`--force` führt folgende Schritte in dieser Reihenfolge aus:

1. Versucht, den Prozess mit SIGTERM ordnungsgemäß zu beenden (wartet 700ms)
2. Falls nicht beendet, SIGKILL zum erzwingen des Beendens verwenden
3. Wartet, bis der Port freigegeben ist (maximal 2 Sekunden)
4. Startet einen neuen Gateway-Prozess

:::

### Schritt 5: Entwicklungsmodus (--dev)

**Warum**

Der Entwicklungsmodus verwendet eine separate Konfigurationsdatei und ein separates Verzeichnis, um die Produktionsumgebung nicht zu beeinflussen. Unterstützt TypeScript Hot-Reload, Gateway wird nach Codeänderungen automatisch neu gestartet.

```bash
# Entwicklungsmodus starten (Entwicklungsprofil und Arbeitsbereich erstellen)
clawdbot gateway --dev

# Entwicklungskonfiguration zurücksetzen (Berechtigungen + Sitzungen + Arbeitsbereich löschen)
clawdbot gateway --dev --reset
```

**Was Sie sehen sollten**:

```bash
✓ dev config created at ~/.clawdbot-dev/clawdbot.json
✓ dev workspace initialized at ~/clawd-dev
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Entwicklungsmodus-Merkmale

- Konfigurationsdatei: `~/.clawdbot-dev/clawdbot.json` (unabhängig von Produktionskonfiguration)
- Arbeitsbereichsverzeichnis: `~/clawd-dev`
- Ausführung von `BOOT.md`-Skripten überspringen
- Standardmäßig loopback binden, keine Authentifizierung erforderlich

:::

### Schritt 6: Tailscale-Integration

**Warum**

Tailscale ermöglicht es Ihnen, Gateway über ein sicheres privates Netzwerk von fern zugreifen zu können, ohne öffentliche IP oder Port-Forwarding.

```bash
# Tailscale Serve-Modus (empfohlen)
clawdbot gateway --tailscale serve

# Tailscale Funnel-Modus (erfordert zusätzliche Authentifizierung)
clawdbot gateway --tailscale funnel --auth password
```

**Was Sie sehen sollten**:

```bash
# serve-Modus
✓ Tailscale identity detected
✓ advertising gateway via Tailscale Serve
✓ MagicDNS: https://your-tailnet.ts.net
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# funnel-Modus
✓ Tailscale Funnel enabled
✓ Funnel URL: https://your-tailnet.ts.net:18789
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Authentifizierung konfigurieren

Die Tailscale-Integration unterstützt zwei Authentifizierungsmethoden:

1. **Identity Headers** (empfohlen): Setzen Sie `gateway.auth.allowTailscale=true`, Tailscale-Identität erfüllt Authentifizierung automatisch
2. **Token / Password**: Traditionelle Authentifizierungsmethode, muss `--token` oder `--password` manuell übergeben werden

:::

### Schritt 7: Gateway-Status verifizieren

**Warum**

Bestätigen Sie, dass Gateway ordnungsgemäß läuft und das RPC-Protokoll zugänglich ist.

```bash
# Vollständigen Status anzeigen (Dienst + RPC-Erkennung)
clawdbot gateway status

# RPC-Erkennung überspringen (nur Dienststatus)
clawdbot gateway status --no-probe

# Gesundheitsprüfung
clawdbot gateway health

# Alle erreichbaren Gateways erkunden
clawdbot gateway probe
```

**Was Sie sehen sollten**:

```bash
# status-Befehlsausgabe
Gateway service status
┌──────────────────────────────────────┐
│ Service: LaunchAgent (loaded)      │
│ Runtime: running (PID 12345)       │
│ Port: 18789                       │
│ Last gateway error: none            │
└──────────────────────────────────────┘

RPC probe
┌──────────────────────────────────────┐
│ Target: ws://127.0.0.1:18789 │
│ Status: ✓ connected                │
│ Latency: 12ms                    │
└──────────────────────────────────────┘

# health-Befehlsausgabe
✓ Gateway is healthy
✓ WebSocket connection: OK
✓ RPC methods: available
```

::: tip Fehlerbehebung

Wenn `status` `Runtime: running` anzeigt, aber `RPC probe: failed`:

1. Prüfen Sie, ob der Port korrekt ist: `clawdbot gateway status`
2. Prüfen Sie die Authentifizierungskonfiguration: Ist Gateway an LAN / Tailnet gebunden, aber ohne Authentifizierung?
3. Prüfen Sie die Protokolle: `cat ~/.clawdbot/logs/gateway.log`
4. Führen Sie `clawdbot doctor` aus für eine detaillierte Diagnose

:::

## Häufige Fehler

### ❌ Fehler: Gateway startet nicht

**Fehlermeldung**:
```
Gateway start blocked: set gateway.mode=local (current: unset) or pass --allow-unconfigured.
```

**Ursache**: `gateway.mode` ist nicht auf `local` gesetzt

**Lösung**:

```bash
# Methode 1: Einrichtungsassistent ausführen
clawdbot onboard

# Methode 2: Konfigurationsdatei manuell bearbeiten
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "mode": "local"
  }
}

# Methode 3: Prüfung vorübergehend überspringen (nicht empfohlen)
clawdbot gateway --allow-unconfigured
```

### ❌ Fehler: An LAN gebunden, aber keine Authentifizierung

**Fehlermeldung**:
```
Refusing to bind gateway to lan without auth.
Set gateway.auth.token/password (or CLAWDBOT_GATEWAY_TOKEN/CLAWDBOT_GATEWAY_PASSWORD) or pass --token/--password.
```

**Ursache**: Nicht-loopback-Bindung erfordert Authentifizierung (Sicherheitsbeschränkung)

**Lösung**:

```bash
# Authentifizierung über Konfigurationsdatei einrichten
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}

# Oder über Befehlszeile übergeben
clawdbot gateway --bind lan --token "your-secure-token"
```

### ❌ Fehler: Port bereits belegt

**Fehlermeldung**:
```
Error: listen EADDRINUSE: address already in use :::18789
```

**Ursache**: Eine andere Gateway-Instanz oder ein anderes Programm belegt den Port

**Lösung**:

```bash
# Methode 1: Port zwangsweise freigeben
clawdbot gateway --force

# Methode 2: Anderen Port verwenden
clawdbot gateway --port 19001

# Methode 3: Prozess manuell suchen und beenden
lsof -ti:18789 | xargs kill -9  # macOS / Linux
netstat -ano | findstr :18789               # Windows
```

### ❌ Fehler: dev-Modus reset erfordert --dev

**Fehlermeldung**:
```
Use --reset with --dev.
```

**Ursache**: `--reset` kann nur im Entwicklungsmodus verwendet werden, um versehentliches Löschen von Produktionsdaten zu vermeiden

**Lösung**:

```bash
# Richtiges Zurücksetzen der Entwicklungsumgebung
clawdbot gateway --dev --reset
```

### ❌ Fehler: Dienst bereits installiert, aber Vordergrundmodus wird verwendet

**Erscheinung**: Wenn Sie `clawdbot gateway` ausführen, wird die Meldung "Gateway already running locally" angezeigt

**Ursache**: Der Daemon läuft bereits im Hintergrund

**Lösung**:

```bash
# Hintergrunddienst stoppen
clawdbot gateway stop

# Oder Dienst neu starten
clawdbot gateway restart

# Dann Vordergrund starten (für Debugging)
clawdbot gateway --port 19001  # anderen Port verwenden
```

## Lektion zusammenfassend

In dieser Lektion haben Sie gelernt:

✅ **Startmethoden**: Vordergrundmodus vs. Daemon
✅ **Bindungsmodi**: loopback / LAN / Tailnet / Auto
✅ **Authentifizierungsmethoden**: Token / Password / Tailscale Identity
✅ **Entwicklungsmodus**: Separate Konfiguration, Hot-Reload, --reset zurücksetzen
✅ **Fehlerbehebung**: `status` / `health` / `probe` Befehle
✅ **Dienstverwaltung**: `install` / `start` / `stop` / `restart` / `uninstall`

**Schnellreferenz der wichtigsten Befehle**:

| Szenario                   | Befehl                                        |
|--- | ---|
| Tägliche Nutzung (Dienst)       | `clawdbot gateway install && clawdbot gateway start` |
| Entwicklung und Debugging              | `clawdbot gateway --dev`                     |
| Vorübergehendes Testen              | `clawdbot gateway`                           |
| Port zwangsweise freigeben          | `clawdbot gateway --force`                   |
|--- | ---|
|--- | ---|
| Status anzeigen              | `clawdbot gateway status`                     |
| Gesundheitsprüfung              | `clawdbot gateway health`                     |

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Die erste Nachricht senden](../first-message/)**.
>
> Sie werden lernen:
> - Die erste Nachricht über WebChat senden
> - Mit dem AI-Assistenten über konfigurierte Channels (WhatsApp/Telegram usw.) chatten
> - Nachrichtenweiterleitung und Antwortfluss verstehen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion                        | Dateipfad                                                                                   | Zeilennummer     |
|--- | --- | ---|
|--- | --- | ---|
| Daemon-Dienst-Abstraktion         | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | 66-155    |
|--- | --- | ---|
| Gateway-Server-Implementierung         | [`src/gateway/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server.ts) | 1-500     |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Port-Freigabe-Logik             | [`src/cli/ports.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/ports.ts) | 1-80      |

**Wichtige Konstanten**:
- Standardport: `18789` (Quelle: `src/gateway/server.ts`)
- Standardbindung: `loopback` (Quelle: `src/cli/gateway-cli/run.ts:175`)
- Entwicklungskonfigurationspfad: `~/.clawdbot-dev/` (Quelle: `src/cli/gateway-cli/dev.ts`)

**Wichtige Funktionen**:
- `runGatewayCommand()`: Haupteinstieg für Gateway-CLI, verarbeitet Kommandozeilenargumente und Startlogik
- `startGatewayServer()`: Startet WebSocket-Server, lauscht auf angegebenen Port
- `forceFreePortAndWait()`: Port zwangsweise freigeben und warten
- `resolveGatewayService()`: Geeignete Daemon-Implementierung nach Plattform zurückgeben (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- `logGatewayStartup()`: Gateway-Startinformationen ausgeben (Modell, Listening-Adresse, Protokolldatei)

</details>
