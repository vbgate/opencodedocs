---
title: "Signal-Konfiguration: Sichere KI-Assistent-Integration mit signal-cli | Clawdbot-Tutorial"
sidebarTitle: "Privater Signal-KI-Assistent"
subtitle: "Signal-Konfiguration: Sichere KI-Assistent-Integration mit signal-cli | Clawdbot-Tutorial"
description: "Lernen Sie, wie Sie den Signal-Kanal in Clawdbot konfigurieren, einschließlich signal-cli-Installation, Kontoverknüpfung, Multi-Account-Unterstützung, DM-Pairing-Mechanismus, Gruppennachrichten und Zugriffskontrolle. Dieses Tutorial erklärt den kompletten Prozess von der Installation bis zur Nutzung."
tags:
  - "Signal"
  - "signal-cli"
  - "Kanalkonfiguration"
  - "Messaging-Plattform"
prerequisite:
  - "start-getting-started"
order: 120
---

# Signal-Konfiguration: KI-Assistent mit signal-cli verbinden | Clawdbot-Tutorial

## Was Sie lernen können

Nach Abschluss dieser Lektion können Sie:

- ✅ signal-cli installieren und konfigurieren
- ✅ Den Signal-Kanal in Clawdbot einrichten
- ✅ Mit dem KI-Assistenten über Direktnachrichten und Gruppen interagieren
- ✅ Den DM-Pairing-Mechanismus zum Schutz Ihres Kontos verwenden
- ✅ Multi-Account-Signal-Unterstützung konfigurieren
- ✅ Signal-Tippindikatoren, Lesebestätigungen und Reactions nutzen

## Ihr aktuelles Problem

Sie möchten einen KI-Assistenten auf Signal verwenden, stoßen aber auf folgende Probleme:

- ❌ Sie wissen nicht, wie Sie Signal und Clawdbot verbinden
- ❌ Sie sorgen sich um Datenschutz und möchten keine Daten in die Cloud hochladen
- ❌ Sie sind unsicher, wie Sie steuern können, wer dem KI-Assistenten Nachrichten senden darf
- ❌ Sie müssen zwischen mehreren Signal-Konten wechseln

::: info Warum Signal?
Signal ist ein Ende-zu-Ende verschlüsseltes Messaging-Dienst, bei dem alle Kommunikation verschlüsselt ist und nur Sender und Empfänger Nachrichten lesen können. Clawdbot integriert über signal-cli, sodass Sie KI-Assistent-Funktionen nutzen können, während Ihre Privatsphäre geschützt bleibt.
:::

## Wann diese Methode verwenden

**Szenarien, die für den Signal-Kanal geeignet sind**:

- Sie benötigen einen datenschutzorientierten Kommunikationskanal
- Ihr Team oder Ihre Freundesgruppe nutzt Signal
- Sie möchten den KI-Assistenten auf einem persönlichen Gerät ausführen (lokal bevorzugt)
- Sie müssen den Zugriff über einen geschützten DM-Pairing-Mechanismus steuern

::: tip Unabhängiges Signal-Konto
Es wird empfohlen, eine **unabhängige Signal-Nummer** als Bot-Konto zu verwenden, nicht Ihre persönliche Nummer. Dadurch vermeiden Sie Nachrichtenschleifen (der Bot ignoriert seine eigenen Nachrichten) und halten Arbeits- und persönliche Kommunikation getrennt.
:::

## Vorbereitungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie folgende Schritte abgeschlossen haben:

::: warning Voraussetzungen
- ✅ Das Tutorial [Schnellstart](../../start/getting-started/) wurde abgeschlossen
- ✅ Clawdbot ist installiert und funktionsfähig
- ✅ Mindestens ein KI-Modell-Anbieter ist konfiguriert (Anthropic, OpenAI, OpenRouter usw.)
- ✅ Java ist installiert (erforderlich für signal-cli)
:::

## Kernkonzept

Die Signal-Integration von Clawdbot basiert auf **signal-cli** und funktioniert auf folgende Weise:

1. **Daemon-Modus**: signal-cli läuft als Hintergrund-Daemon und bietet eine HTTP JSON-RPC-Schnittstelle
2. **Ereignisstrom (SSE)**: Clawdbot empfängt Signal-Ereignisse über Server-Sent Events (SSE)
3. **Standardisierte Nachrichten**: Signal-Nachrichten werden in ein einheitliches internes Format konvertiert und dann an den KI-Agenten weitergeleitet
4. **Deterministisches Routing**: Alle Antworten werden an den ursprünglichen Absender oder die Gruppe zurückgesendet

**Wichtige Designprinzipien**:

- **Lokal bevorzugt**: signal-cli läuft auf Ihrem Gerät, alle Kommunikation ist verschlüsselt
- **Multi-Account-Unterstützung**: Mehrere Signal-Konten können konfiguriert werden
- **Zugriffskontrolle**: DM-Pairing-Mechanismus ist standardmäßig aktiviert, Fremde benötigen eine Genehmigung
- **Kontextisolierung**: Gruppennachrichten haben einen unabhängigen Gesprächskontext und werden nicht mit Direktnachrichten vermischt

## Schritt-für-Schritt-Anleitung

### Schritt 1: signal-cli installieren

**Warum**
signal-cli ist die Kommandozeilenschnittstelle von Signal. Clawdbot kommuniziert über sie mit dem Signal-Netzwerk.

**Installationsmethoden**

::: code-group

```bash [macOS (Homebrew)]
brew install signal-cli
```

```bash [Linux (Ubuntu/Debian)]
# Besuchen Sie https://github.com/AsamK/signal-cli/releases für die neueste Version
# Laden Sie das neueste signal-cli-Release herunter (ersetzen Sie VERSION durch die tatsächliche Versionsnummer)
wget https://github.com/AsamK/signal-cli/releases/download/vVERSION/signal-cli-VERSION.tar.gz

# Entpacken Sie in das Verzeichnis /opt
sudo tar -xvf signal-cli-VERSION.tar.gz -C /opt/

# Erstellen Sie einen symbolischen Link (optional)
sudo ln -s /opt/signal-cli-VERSION/bin/signal-cli /usr/local/bin/signal-cli
```

```bash [Windows (WSL2)]
# Verwenden Sie die Linux-Installationsmethode in WSL2
# Hinweis: Windows verwendet WSL2, die Installation von signal-cli folgt dem Linux-Prozess
```

:::

**Installation überprüfen**

```bash
signal-cli --version
# Sie sollten sehen: signal-cli-Versionsnummer (z. B. 0.13.x oder höher)
```

**Sie sollten sehen**: Die Versionsnummer von signal-cli.

::: danger Java-Anforderung
signal-cli benötigt eine Java-Laufzeitumgebung (normalerweise Java 11 oder höher). Stellen Sie sicher, dass Java installiert und konfiguriert ist:

```bash
java -version
# Sie sollten sehen: openjdk version "11.x.x" oder höher
```

**Hinweis**: Die spezifische Java-Anforderung finden Sie in der [offiziellen signal-cli-Dokumentation](https://github.com/AsamK/signal-cli#readme).
:::

### Schritt 2: Signal-Konto verknüpfen

**Warum**
Nachdem das Konto verknüpft ist, kann signal-cli im Namen Ihrer Signal-Nummer Nachrichten senden und empfangen.

**Empfohlene Vorgehensweise**: Verwenden Sie eine unabhängige Signal-Nummer als Bot-Konto.

**Verknüpfungsschritte**

1. **Verknüpfungsbefehl generieren**:

```bash
signal-cli link -n "Clawdbot"
```

`-n "Clawdbot"` gibt den Gerätenamen als "Clawdbot" an (Sie können dies anpassen).

2. **QR-Code scannen**:

Nach dem Ausführen des Befehls zeigt das Terminal einen QR-Code:

```
tsconfig: 2369:35 - warning - *! is deprecated: Use .nonNull().
  (deprecated-non-null)

To link your device, navigate to
  Signal Settings > Linked Devices > (+) Link New Device
  on your phone and scan the QR code displayed below.

██████████████████████████████████████████████
██████████████████████████████████████████████
██████████████████████████████████████████████
██████████████████████████████████████████████
██████████████████████████████████████████████
...
```

3. **In der Signal-Handy-App**:

   - Öffnen Sie Signal-Einstellungen
   - Wählen Sie "Verknüpfte Geräte" (Linked Devices)
   - Tippen Sie auf "(+) Neues Gerät verknüpfen" (Link New Device)
   - Scannen Sie den QR-Code, der im Terminal angezeigt wird

**Sie sollten sehen**: Nach erfolgreicher Verknüpfung zeigt das Terminal eine Ausgabe ähnlich wie:

```
INFO  Account restored (Number: +15551234567)
INFO  Configuration created at: ~/.local/share/signal-cli/data
```

::: tip Multi-Geräte-Unterstützung
Signal ermöglicht die Verknüpfung von bis zu 4 Geräten. Clawdbot läuft als eines dieser Geräte. Sie können diese Geräte in der Signal-Handy-App unter "Verknüpfte Geräte" anzeigen und verwalten.
:::

### Schritt 3: Signal-Kanal in Clawdbot konfigurieren

**Warum**
Die Konfigurationsdatei gibt Clawdbot an, wie sie sich mit signal-cli verbindet und wie sie Nachrichten von Signal verarbeitet.

**Konfigurationsmethoden**

Es gibt drei Konfigurationsmethoden. Wählen Sie die für Sie geeignetste:

#### Methode 1: Schnellkonfiguration (Einzelkonto)

Dies ist die einfachste Methode, geeignet für Einzelkonto-Szenarien.

Bearbeiten Sie `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "account": "+15551234567",
      "cliPath": "signal-cli",
      "dmPolicy": "pairing",
      "allowFrom": ["+15557654321"]
    }
  }
}
```

**Konfigurationserklärung**:

| Feld | Wert | Beschreibung |
|--- | --- | ---|
| `enabled` | `true` | Signal-Kanal aktivieren |
| `account` | `"+15551234567"` | Ihre Signal-Nummer (E.164-Format) |
| `cliPath` | `"signal-cli"` | Pfad zum signal-cli-Befehl |
| `dmPolicy` | `"pairing"` | DM-Zugriffsrichtlinie (Standard: Pairing-Modus) |
| `allowFrom` | `["+15557654321"]` | Whitelist der Nummern, die DMs senden dürfen |

#### Methode 2: Multi-Account-Konfiguration

Wenn Sie mehrere Signal-Konten verwalten müssen, verwenden Sie das `accounts`-Objekt:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "accounts": {
        "work": {
          "account": "+15551234567",
          "name": "Work Bot",
          "httpPort": 8080,
          "dmPolicy": "pairing",
          "allowFrom": ["+15557654321"]
        },
        "personal": {
          "account": "+15559876543",
          "name": "Personal Bot",
          "httpPort": 8081,
          "dmPolicy": "allowlist",
          "allowFrom": ["*"]
        }
      }
    }
  }
}
```

**Konfigurationserklärung**:

- Jedes Konto hat eine eindeutige ID (z. B. `work`, `personal`)
- Jedes Konto kann unterschiedliche Ports, Richtlinien und Berechtigungen haben
- `name` ist ein optionaler Anzeigename für CLI/UI-Listen

#### Methode 3: Externer Daemon-Modus

Wenn Sie signal-cli selbst verwalten möchten (z. B. in einem Container oder mit gemeinsam genutzter CPU), deaktivieren Sie den automatischen Start:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "httpUrl": "http://127.0.0.1:8080",
      "autoStart": false
    }
  }
}
```

**Konfigurationserklärung**:

- `httpUrl`: Vollständige Daemon-URL (überschreibt `httpHost` und `httpPort`)
- `autoStart`: Auf `false` setzen, um den automatischen Start von signal-cli zu deaktivieren
- Clawdbot stellt eine Verbindung zum bereits laufenden signal-cli-Daemon her

**Sie sollten sehen**: Nach dem Speichern der Konfigurationsdatei treten keine Syntaxfehler auf.

::: tip Konfigurationsüberprüfung
Clawdbot überprüft die Konfiguration beim Start. Wenn die Konfiguration fehlerhaft ist, werden detaillierte Fehlerinformationen im Protokoll angezeigt.
:::

### Schritt 4: Gateway starten

**Warum**
Nach dem Start des Gateways startet Clawdbot automatisch den signal-cli-Daemon (es sei denn, Sie haben `autoStart` deaktiviert) und beginnt mit dem Überwachen von Signal-Nachrichten.

**Startbefehl**

```bash
clawdbot gateway start
```

**Sie sollten sehen**: Eine Ausgabe ähnlich wie:

```
[INFO] Starting Clawdbot Gateway...
[INFO] Starting signal-cli daemon...
[INFO] signal-cli: INFO  Starting daemon...
[INFO] signal-cli: INFO  Daemon started on http://127.0.0.1:8080
[INFO] Signal channel ready (account: +15551234567)
[INFO] Gateway listening on ws://127.0.0.1:18789
[INFO] Clawdbot Gateway started successfully
```

**Channel-Status überprüfen**

```bash
clawdbot channels status
```

**Sie sollten sehen**: Eine Ausgabe ähnlich wie:

```
Signal Channels:
  ├─ +15551234567 (Work Bot)
  │   ├─ Status: Connected
  │   ├─ Daemon: http://127.0.0.1:8080
  │   └─ Mode: Auto-start
```

### Schritt 5: Erste Nachricht senden

**Warum**
Überprüfen Sie, ob die Konfiguration korrekt ist, und stellen Sie sicher, dass Clawdbot Signal-Nachrichten empfangen und verarbeiten kann.

**Nachricht senden**

1. **Senden Sie von Ihrer Signal-Handy-App** eine Nachricht an Ihre Bot-Nummer:

```
Hallo, Clawdbot!
```

2. **Erstnachrichtenverarbeitung**:

   Wenn `dmPolicy="pairing"` (Standard), erhalten Fremde einen Pairing-Code:

   ```
   ❌ Nicht autorisierter Absender

   Um fortzufahren, genehmigen Sie dieses Pairing mit dem folgenden Code:

   📝 Pairing-Code: ABC123

   Der Code läuft in 1 Stunde ab.

   Um zu genehmigen, führen Sie aus:
   clawdbot pairing approve signal ABC123
   ```

3. **Pairing genehmigen**:

   ```bash
   clawdbot pairing list signal
   ```

   Listet die ausstehenden Pairing-Anforderungen auf:

   ```
   Pending Pairings (Signal):
     ├─ ABC123
     │   ├─ Sender: +15557654321
     │   ├─ UUID: uuid:123e4567-e89b-12d3-a456-426614174000
     │   └─ Expires: 2026-01-27 12:00:00
   ```

   Pairing genehmigen:

   ```bash
   clawdbot pairing approve signal ABC123
   ```

4. **Zweite Nachricht senden**:

   Nach erfolgreichem Pairing senden Sie erneut eine Nachricht:

   ```
   Hallo, Clawdbot!
   ```

**Sie sollten sehen**:

- Die Signal-Handy-App empfängt die KI-Antwort:
  ```
  Hallo! Ich bin Clawdbot, Ihr persönlicher KI-Assistent. Wie kann ich Ihnen helfen?
  ```

- Gateway-Protokoll zeigt:
  ```
  [INFO] Received Signal message from +15557654321
  [INFO] Processing message through Agent...
  [INFO] Sending Signal response to +15557654321
  ```

**Kontrollpunkt ✅**:

- [ ] signal-cli-Daemon läuft
- [ ] Channel-Status zeigt "Connected"
- [ ] Nach dem Senden einer Nachricht erhalten Sie eine KI-Antwort
- [ ] Gateway-Protokoll enthält keine Fehlerinformationen

::: danger Eigene Nachrichten werden ignoriert
Wenn Sie den Bot auf Ihrer persönlichen Signal-Nummer ausführen, ignoriert der Bot Nachrichten, die Sie selbst senden (Schleifenschutz). Es wird empfohlen, eine unabhängige Bot-Nummer zu verwenden.
:::

## Häufige Probleme

### Problem 1: signal-cli startet nicht

**Problem**: signal-cli-Daemon kann nicht gestartet werden

**Mögliche Ursachen**:

1. Java ist nicht installiert oder Version zu niedrig
2. Port wird bereits verwendet
3. signal-cli-Pfad ist falsch

**Lösung**:

```bash
# Java-Version überprüfen
java -version

# Portbelegung überprüfen
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows (PowerShell)

# signal-cli-Pfad überprüfen
which signal-cli
```

### Problem 2: Pairing-Code abgelaufen

**Problem**: Pairing-Code läuft nach 1 Stunde ab

**Lösung**:

Senden Sie die Nachricht erneut, um einen neuen Pairing-Code zu erhalten, und genehmigen Sie ihn innerhalb einer Stunde.

### Problem 3: Gruppennachrichten werden nicht beantwortet

**Problem**: Sie erwähnen den Bot mit @ in einer Signal-Gruppe, aber es erfolgt keine Antwort

**Mögliche Ursachen**:

- `groupPolicy` ist auf `allowlist` eingestellt, aber Sie sind nicht in `groupAllowFrom` enthalten
- Signal unterstützt keine nativen @-Erwähnungen (im Gegensatz zu Discord/Slack)

**Lösung**:

Konfigurieren Sie die Gruppenrichtlinie:

```json
{
  "channels": {
    "signal": {
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["+15557654321"]
    }
  }
}
```

Oder verwenden Sie einen Befehlstrigger (falls `commands.config: true` konfiguriert ist):

```
@clawdbot help
```

### Problem 4: Mediendatei-Download fehlschlägt

**Problem**: Bilder oder Anhänge in Signal-Nachrichten können nicht verarbeitet werden

**Mögliche Ursachen**:

- Dateigröße überschreitet `mediaMaxMb`-Limit (standardmäßig 8 MB)
- `ignoreAttachments` ist auf `true` eingestellt

**Lösung**:

```json
{
  "channels": {
    "signal": {
      "mediaMaxMb": 20,
      "ignoreAttachments": false
    }
  }
}
```

### Problem 5: Lange Nachrichten werden abgeschnitten

**Problem**: Gesendete Nachrichten werden in mehrere Teile aufgeteilt

**Ursache**: Signal hat eine Nachrichtenlängenbegrenzung (standardmäßig 4000 Zeichen), Clawdbot chunkt automatisch

**Lösung**:

Passen Sie die Chunking-Konfiguration an:

```json
{
  "channels": {
    "signal": {
      "textChunkLimit": 2000,
      "chunkMode": "newline"
    }
  }
}
```

`chunkMode`-Optionen:
- `length` (Standard): Nach Länge aufteilen
- `newline`: Zuerst nach leeren Zeilen aufteilen (Absatzgrenzen), dann nach Länge

## Zusammenfassung

In dieser Lektion haben wir die Konfiguration und Nutzung des Signal-Kanals abgeschlossen:

**Kernkonzepte**:
- Der Signal-Kanal basiert auf signal-cli und kommuniziert über HTTP JSON-RPC + SSE
- Es wird empfohlen, eine unabhängige Bot-Nummer zu verwenden, um Nachrichtenschleifen zu vermeiden
- DM-Pairing-Mechanismus ist standardmäßig aktiviert, um Ihr Konto zu schützen

**Wichtige Konfigurationen**:
- `account`: Signal-Nummer (E.164-Format)
- `cliPath`: signal-cli-Pfad
- `dmPolicy`: DM-Zugriffsrichtlinie (Standard `pairing`)
- `allowFrom`: DM-Whitelist
- `groupPolicy` / `groupAllowFrom`: Gruppenrichtlinie

**Nützliche Funktionen**:
- Multi-Account-Unterstützung
- Gruppennachrichten (unabhängiger Kontext)
- Tippindikatoren
- Lesebestätigungen
- Reactions (Emoji-Reaktionen)

**Fehlerbehebung**:
- Verwenden Sie `clawdbot channels status`, um den Channel-Status zu überprüfen
- Verwenden Sie `clawdbot pairing list signal`, um ausstehende Pairing-Anforderungen anzuzeigen
- Überprüfen Sie das Gateway-Protokoll für detaillierte Fehlerinformationen

## Nächste Lektion

> In der nächsten Lektion lernen wir **[iMessage-Kanal](../imessage/)**.
>
> Sie werden lernen:
> - Wie Sie den iMessage-Kanal auf macOS konfigurieren
> - BlueBubbles-Erweiterungsunterstützung verwenden
> - Spezielle iMessage-Funktionen (Lesebestätigungen, Tippindikatoren usw.)
> - iOS-Knoten-Integration (Camera, Canvas, Voice Wake)

Entdecken Sie weiter die leistungsstarken Funktionen von Clawdbot! 🚀

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Erweitern der Quellcode-Positionen</strong></summary>

> Aktualisiert: 2026-01-27

| Funktion        | Dateipfad                                                                                    | Zeilen  |
|--- | --- | ---|
| Signal-RPC-Client | [`src/signal/client.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/client.ts)         | 1-186   |
| Signal-Daemon-Verwaltung | [`src/signal/daemon.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/daemon.ts)         | 1-85    |
| Multi-Account-Unterstützung | [`src/signal/accounts.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/accounts.ts)       | 1-84    |
| Signal-Monitoring und Ereignisverarbeitung | [`src/signal/monitor.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/monitor.ts)       | -       |
| Nachrichtensendung | [`src/signal/send.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send.ts)             | -       |
| Reactions senden | [`src/signal/send-reactions.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send-reactions.ts) | -       |
|--- | --- | ---|

**Konfigurationstypdefinitionen**:
- `SignalAccountConfig`: [`src/config/types.signal.ts:13-87`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L13-L87)
- `SignalConfig`: [`src/config/types.signal.ts:89-93`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L89-L93)

**Wichtige Konstanten**:
- `DEFAULT_TIMEOUT_MS = 10_000`: Standard-Timeout für Signal-RPC-Anforderungen (10 Sekunden) Quelle: `src/signal/client.ts:29`
- Standard-HTTP-Port: `8080` Quelle: `src/signal/accounts.ts:59`
- Standard-Text-Chunking-Größe: `4000` Zeichen Quelle: `docs/channels/signal.md:113`

**Wichtige Funktionen**:
- `signalRpcRequest<T>()`: Sendet JSON-RPC-Anforderungen an signal-cli Quelle: `src/signal/client.ts:54-90`
- `streamSignalEvents()`: Abonniert Signal-Ereignisse über SSE Quelle: `src/signal/client.ts:112-185`
- `spawnSignalDaemon()`: Startet signal-cli-Daemon Quelle: `src/signal/daemon.ts:50-84`
- `resolveSignalAccount()`: Löst Signal-Kontokonfiguration auf Quelle: `src/signal/accounts.ts:49-77`
- `listEnabledSignalAccounts()`: Listet aktivierte Signal-Konten auf Quelle: `src/signal/accounts.ts:79-83`

</details>
