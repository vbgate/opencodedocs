---
title: "Erste Nachricht senden: Mit AI über WebChat oder Kanäle chatten | Clawdbot Tutorial"
sidebarTitle: "Mit AI sprechen"
subtitle: "Erste Nachricht senden: Mit AI über WebChat oder Kanäle chatten"
description: "Lernen Sie, wie Sie Ihre erste Nachricht an den Clawdbot AI-Assistenten über die WebChat-Oberfläche oder konfigurierte Kanäle (WhatsApp/Telegram/Slack/Discord usw.) senden. Dieses Tutorial behandelt drei Methoden: CLI-Befehle, WebChat-Zugriff und Kanalnachrichten, inklusive erwarteten Ergebnissen und Fehlerbehebung."
tags:
  - "Einsteiger"
  - "WebChat"
  - "Kanäle"
  - "Nachrichten"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 40
---

# Erste Nachricht senden: Mit AI über WebChat oder Kanäle chatten

## Was Sie nach diesem Tutorial können

Nach Abschluss dieses Tutorials können Sie:

- ✅ Mit dem AI-Assistenten über CLI chatten
- ✅ Nachrichten über die WebChat-Oberfläche senden
- ✅ Mit AI auf konfigurierten Kanälen (WhatsApp, Telegram, Slack usw.) chatten
- ✅ Die erwarteten Ergebnisse und Statuscodes beim Senden von Nachrichten verstehen

## Ihre aktuelle Situation

Vielleicht haben Sie gerade die Installation von Clawdbot und den Start des Gateway abgeschlossen, wissen aber nicht, wie Sie überprüfen können, ob alles ordnungsgemäß funktioniert.

Vielleicht fragen Sie sich:

- "Der Gateway ist gestartet, wie bestätige ich, dass er auf Nachrichten reagiert?"
- "Gibt es neben der Befehlszeile eine grafische Oberfläche?"
- "Ich habe WhatsApp/Telegram konfiguriert – wie chate ich mit AI auf diesen Plattformen?"

Die gute Nachricht: **Clawdbot bietet mehrere Möglichkeiten, die erste Nachricht zu senden**, und eine davon wird für Sie geeignet sein.

## Wann Sie diese Methode verwenden

Verwenden Sie sie, wenn Sie:

- 🧪 **Installation überprüfen**: Bestätigen, dass Gateway und AI-Assistent ordnungsgemäß funktionieren
- 🌐 **Kanäle testen**: Überprüfen, ob die Verbindung zu WhatsApp/Telegram/Slack usw. funktioniert
- 💬 **Schnell chatten**: Ohne Öffnen von Kanal-Apps direkt über CLI oder WebChat mit AI kommunizieren
- 🔄 **Antworten übermitteln**: AI-Antworten an bestimmte Kanäle oder Kontakte senden

---

## 🎒 Vorbereitungen vor dem Start

Bevor Sie Ihre erste Nachricht senden, bestätigen Sie bitte:

### Erforderliche Voraussetzungen

| Voraussetzung                   | Überprüfung                                          |
|--- | ---|
| **Gateway ist gestartet**      | `clawdbot gateway status` oder prüfen, ob der Prozess läuft |
| **AI-Modell ist konfiguriert** | `clawdbot models list` prüfen, ob Modelle verfügbar sind |
| **Port ist erreichbar**        | Bestätigen, dass Port 18789 (oder benutzerdefinierter Port) nicht belegt ist |

::: warning Vorausgesetzte Tutorials
Dieses Tutorial setzt voraus, dass Sie bereits Folgendes abgeschlossen haben:
- [Schnellstart](../getting-started/) - Installation, Konfiguration und Start von Clawdbot
- [Gateway starten](../gateway-startup/) - Verstehen der verschiedenen Gateway-Startmodi

Wenn nicht, kehren Sie bitte zuerst zu diesen Tutorials zurück.
:::

### Optional: Kanäle konfigurieren

Wenn Sie Nachrichten über WhatsApp/Telegram/Slack usw. senden möchten, müssen Sie zuerst die Kanäle konfigurieren.

Schnellprüfung:

```bash
## Konfigurierte Kanäle anzeigen
clawdbot channels list
```

Wenn eine leere Liste zurückgegeben wird oder der gewünschte Kanal fehlt, konsultieren Sie das entsprechende Kanalkonfigurations-Tutorial (im Kapitel `platforms/`).

---

## Kerngedanke

Clawdbot unterstützt drei Hauptmethoden zum Senden von Nachrichten:

```
┌─────────────────────────────────────────────────────────────┐
│              Methoden zum Senden von Nachrichten        │
├─────────────────────────────────────────────────────────────┤
│                                                         │
│  Methode 1: CLI-Agent-Chat                                │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → AI → Ergebnisse zurück     │
│  │ agent        │                                       │
│  │ --message    │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Methode 2: Direktes Senden von Nachrichten an Kanal via CLI │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → Kanal → Nachricht senden   │
│  │ message send │                                       │
│  │ --target     │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Methode 3: WebChat / Konfigurierte Kanäle                │
│  ┌─────────────┐               ┌──────────────┐   │
│  │ WebChat     │   oder         │ WhatsApp    │   │
│  │ Browser-Oberfläche │           │ Telegram    │ → Gateway → AI → Kanal-Antwort │
│  └─────────────┘               │ Slack       │   │
│                                 │ Discord     │   │
│                                 └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Wichtige Unterschiede**:

| Methode                       | Durchläuft AI? | Zweck                              |
|--- | --- | ---|
| `clawdbot agent`             | ✅ Ja           | Mit AI chatten, Antworten und Denkprozess erhalten |
| `clawdbot message send`      | ❌ Nein         | Nachrichten direkt an Kanal senden, ohne AI   |
| WebChat / Kanäle             | ✅ Ja           | Mit AI über grafische Oberfläche chatten      |

::: info Geeignete Methode wählen
- **Installation überprüfen**: Verwenden Sie `clawdbot agent` oder WebChat
- **Kanäle testen**: Verwenden Sie WhatsApp/Telegram usw. Apps
- **Massenversand**: Verwenden Sie `clawdbot message send` (ohne AI)
:::

---

## Lernen Sie mit

### Schritt 1: Über CLI mit AI chatten

**Warum**
CLI ist die schnellste Überprüfungsmethode, kein Öffnen von Browser oder Kanal-Apps erforderlich.

#### Grundlegender Chat

```bash
## Einfache Nachricht an AI-Assistent senden
clawdbot agent --message "Hello, I'm testing Clawdbot!"
```

**Was Sie sehen sollten**:
```
[clawdbot] Thinking...
[clawdbot] Hello! I'm your AI assistant powered by Clawdbot. How can I help you today?
```

#### Denkstufe verwenden

Clawdbot unterstützt verschiedene Denkstufen, die die "Transparenz" der AI steuern:

```bash
## Hohe Denkstufe (vollständiger Denkprozess angezeigt)
clawdbot agent --message "Ship checklist" --thinking high

## Denken deaktivieren (nur endgültige Antwort anzeigen)
clawdbot agent --message "What's 2+2?" --thinking off
```

**Was Sie sehen sollten** (hohe Denkstufe):
```
[clawdbot] I'll create a comprehensive ship checklist for you.

[THINKING]
Let me think about what needs to be checked for shipping:

1. Code readiness
   - All tests passing?
   - Code review completed?
   - Documentation updated?

2. Build configuration
   - Environment variables set correctly?
   - Build artifacts generated?

[THINKING END]

[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

**Denkstufen-Optionen**:

| Stufe   | Beschreibung                              | Anwendungsfall      |
|--- | --- | ---|
| `off`    | Kein Denkprozess anzeigen                | Einfache Fragen, schnelle Antworten |
| `minimal` | Minimale Denkausgabe                     | Debugging, Prozessüberprüfung |
| `low`     | Geringe Detailgenauigkeit                 | Alltagsgespräche |
| `medium`  | Mittlere Detailgenauigkeit                | Komplexe Aufgaben |
| `high`    | Hohe Detailgenauigkeit (vollständiger Denkprozess) | Lernen, Codegenerierung |

#### Empfangskanal angeben

Sie können AI veranlassen, Antworten an einen bestimmten Kanal zu senden (statt an den Standardkanal):

```bash
## AI-Antwort an Telegram senden lassen
clawdbot agent --message "Send me a weather update" --deliver --reply-channel telegram
```

::: tip Häufige Parameter
- `--to <Nummer>`: E.164-Nummer des Empfängers angeben (zum Erstellen einer bestimmten Sitzung)
- `--agent <id>`: Bestimmte Agent-ID verwenden (statt Standard main)
- `--session-id <id>`: Bestehende Sitzung fortsetzen, statt neue Sitzung zu erstellen
- `--verbose on`: Ausführliche Protokollausgabe aktivieren
- `--json`: JSON-Format ausgeben (geeignet für Skriptanalyse)
:::

---

### Schritt 2: Über WebChat-Oberfläche Nachrichten senden

**Warum**
WebChat bietet eine grafische Oberfläche im Browser, ist intuitiver und unterstützt Rich Text und Anhänge.

#### WebChat aufrufen

WebChat verwendet den WebSocket-Dienst des Gateway, **keine separate Konfiguration oder zusätzlichen Ports erforderlich**.

**Zugriffsmöglichkeiten**:

1. **Browser öffnen, aufrufen**: `http://localhost:18789`
2. **Oder im Terminal ausführen**: `clawdbot dashboard` (öffnet Browser automatisch)

::: info WebChat-Port
WebChat verwendet denselben Port wie der Gateway (Standard 18789). Wenn Sie den Gateway-Port geändert haben, verwendet WebChat denselben Port.
:::

**Was Sie sehen sollten**:
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│  ┌───────────────────────────────────┐   │
│  │  Hallo! Ich bin Ihr AI-Assistent.       │   │
│  │  Wie kann ich Ihnen helfen?        │   │
│  └───────────────────────────────────┘   │
│  [Eingabefeld...                       │   │
│  [Senden]                            │   │
└─────────────────────────────────────────────┘
```

#### Nachricht senden

1. Geben Sie Ihre Nachricht im Eingabefeld ein
2. Klicken Sie auf "Senden" oder drücken Sie `Enter`
3. Warten Sie auf AI-Antwort

**Was Sie sehen sollten**:
- AI-Antwort wird im Chat-Fenster angezeigt
- Wenn Denkstufen aktiviert sind, wird `[THINKING]`-Markierung angezeigt

**WebChat-Funktionen**:

| Funktion   | Beschreibung                              |
|--- | ---|
| Rich Text   | Markdown-Format unterstützt                |
| Anhänge     | Hochladen von Bildern, Audio, Videos    |
| Verlauf     | Sitzungsverlauf automatisch gespeichert |
| Sitzungswechsel | Verschiedene Sitzungen im linken Panel wechseln |

::: tip macOS-Menüleisten-App
Wenn Sie die Clawdbot macOS-App installiert haben, können Sie WebChat auch direkt über die Schaltfläche "Open WebChat" in der Menüleiste öffnen.
:::

---

### Schritt 3: Über konfigurierte Kanäle Nachrichten senden

**Warum**
Überprüfen Sie, ob die Verbindung zu Kanälen (WhatsApp, Telegram, Slack usw.) ordnungsgemäß funktioniert, und erleben Sie echte plattformübergreifende Gespräche.

#### WhatsApp-Beispiel

Wenn Sie WhatsApp im Onboarding oder in der Konfiguration eingerichtet haben:

1. **WhatsApp APP öffnen** (Handy oder Desktop)
2. **Ihre Clawdbot-Nummer suchen** (oder gespeicherten Kontakt)
3. **Nachricht senden**: `Hello from WhatsApp!`

**Was Sie sehen sollten**:
```
[WhatsApp]
Sie → Clawdbot: Hello from WhatsApp!

Clawdbot → Sie: Hello! I received your message via WhatsApp.
How can I help you today?
```

#### Telegram-Beispiel

Wenn Sie den Telegram-Bot konfiguriert haben:

1. **Telegram APP öffnen**
2. **Ihren Bot suchen** (Benutzername verwenden)
3. **Nachricht senden**: `/start` oder `Hello from Telegram!`

**Was Sie sehen sollten**:
```
[Telegram]
Sie → @your_bot: /start

@your_bot → Sie: Welcome! I'm Clawdbot's AI assistant.
You can talk to me here, and I'll respond via AI.
```

#### Slack/Discord-Beispiel

Für Slack oder Discord:

1. **Entsprechende APP öffnen**
2. **Kanal oder Server finden, in dem der Bot ist**
3. **Nachricht senden**: `Hello from Slack!`

**Was Sie sehen sollten**:
- Bot antwortet auf Ihre Nachricht
- Möglicherweise wird "AI Assistant"-Label vor der Nachricht angezeigt

::: info DM-Pairing-Schutz
Standardmäßig aktiviert Clawdbot den **DM-Pairing-Schutz**:
- Unbekannte Absender erhalten einen Pairing-Code
- Nachrichten werden nicht verarbeitet, bis Sie das Pairing genehmigen

Wenn Sie zum ersten Mal Nachrichten von einem Kanal senden, müssen Sie möglicherweise:
```bash
## Ausstehende Pairing-Anfragen anzeigen
clawdbot pairing list

## Pairing-Anfrage genehmigen (<channel> und <code> durch tatsächliche Werte ersetzen)
clawdbot pairing approve <channel> <code>
```

Detaillierte Erklärung: [DM-Pairing und Zugriffskontrolle](../pairing-approval/)
:::

---

### Schritt 4 (Optional): Direktes Senden von Nachrichten an Kanäle

**Warum**
Direktes Senden von Nachrichten an Kanäle ohne AI-Durchlauf. Geeignet für Massenbenachrichtigungen, Push-Nachrichten usw.

#### Textnachricht senden

```bash
## Textnachricht an WhatsApp senden
clawdbot message send --target +15555550123 --message "Hello from CLI!"
```

#### Nachricht mit Anhang senden

```bash
## Bild senden
clawdbot message send --target +15555550123 \
  --message "Check out this photo" \
  --media ~/Desktop/photo.jpg

## URL-Bild senden
clawdbot message send --target +15555550123 \
  --message "Here's a link" \
  --media https://example.com/image.png
```

**Was Sie sehen sollten**:
```
[clawdbot] Message sent successfully
[clawdbot] Message ID: 3EB0A1234567890
```

::: tip Häufige Parameter für message send
- `--channel`: Kanal angeben (Standard: whatsapp)
- `--reply-to <id>`: Auf bestimmte Nachricht antworten
- `--thread-id <id>`: Telegram-Thread-ID
- `--buttons <json>`: Telegram-Inlinen-Buttons (JSON-Format)
- `--card <json>`: Adaptive Card (unterstützte Kanäle)
:::

---

## Checkpoint ✅

Nach Abschluss der obigen Schritte sollten Sie in der Lage sein:

- [ ] Nachrichten über CLI zu senden und AI-Antworten zu erhalten
- [ ] Nachrichten in der WebChat-Oberfläche zu senden und Antworten zu sehen
- [ ] (Optional) Nachrichten in konfigurierten Kanälen zu senden und AI-Antworten zu erhalten
- [ ] (Optional) `clawdbot message send` verwenden, um Nachrichten direkt an Kanäle zu senden

::: tip Häufige Fragen

**F: AI antwortet nicht auf meine Nachrichten?**

A: Überprüfen Sie Folgendes:
1. Läuft der Gateway: `clawdbot gateway status`
2. Ist AI-Modell konfiguriert: `clawdbot models list`
3. Ausführliche Protokolle anzeigen: `clawdbot agent --message "test" --verbose on`

**F: WebChat kann nicht geöffnet werden?**

A: Überprüfen Sie:
1. Läuft der Gateway
2. Port korrekt: Standard 18789
3. Browser-Zugriff auf `http://127.0.0.1:18789` (nicht `localhost`)

**F: Senden von Kanalnachrichten schlägt fehl?**

A: Überprüfen Sie:
1. Kanal angemeldet: `clawdbot channels status`
2. Netzwerkverbindung ordnungsgemäß
3. Kanalspezifische Fehlerprotokolle anzeigen: `clawdbot gateway --verbose`
:::

---

## Fallen vermeiden

### ❌ Gateway nicht gestartet

**Falscher Ansatz**:
```bash
clawdbot agent --message "Hello"
## Fehler: Gateway connection failed
```

**Richtiger Ansatz**:
```bash
## Zuerst Gateway starten
clawdbot gateway --port 18789

## Dann Nachricht senden
clawdbot agent --message "Hello"
```

::: warning Gateway muss zuerst gestartet werden
Alle Methoden zum Senden von Nachrichten (CLI, WebChat, Kanäle) hängen vom WebSocket-Dienst des Gateway ab. Sicherzustellen, dass der Gateway läuft, ist der erste Schritt.
:::

### ❌ Kanal nicht angemeldet

**Falscher Ansatz**:
```bash
## Nachricht senden, ohne WhatsApp angemeldet zu haben
clawdbot message send --target +15555550123 --message "Hi"
## Fehler: WhatsApp not authenticated
```

**Richtiger Ansatz**:
```bash
## Zuerst Kanal anmelden
clawdbot channels login whatsapp

## Status bestätigen
clawdbot channels status

## Dann Nachricht senden
clawdbot message send --target +15555550123 --message "Hi"
```

### ❌ DM-Pairing vergessen

**Falscher Ansatz**:
```bash
## Erste Nachricht von Telegram senden, aber Pairing nicht genehmigt
## Ergebnis: Bot empfängt Nachricht, verarbeitet sie aber nicht
```

**Richtiger Ansatz**:
```bash
## 1. Ausstehende Pairing-Anfragen anzeigen
clawdbot pairing list

## 2. Pairing genehmigen
clawdbot pairing approve telegram ABC123
## 3. Nachricht erneut senden

### Jetzt wird Nachricht verarbeitet und AI-Antwort erhalten
```

### ❌ Verwechslung von agent und message send

**Falscher Ansatz**:
```bash
## Mit AI chatten, aber message send verwendet
clawdbot message send --target +15555550123 --message "Help me write code"
## Ergebnis: Nachricht direkt an Kanal gesendet, AI verarbeitet sie nicht
```

**Richtiger Ansatz**:
```bash
## Mit AI chatten: agent verwenden
clawdbot agent --message "Help me write code" --to +15555550123

## Nachricht direkt senden: message send verwenden (ohne AI)
clawdbot message send --target +15555550123 --message "Meeting at 3pm"
```

---

## Zusammenfassung

In dieser Lektion haben Sie gelernt:

1. ✅ **CLI-Agent-Chat**: `clawdbot agent --message` mit AI kommunizieren, unterstützt Denkstufensteuerung
2. ✅ **WebChat-Oberfläche**: Zugriff auf `http://localhost:18789` für grafische Oberfläche zum Senden von Nachrichten
3. ✅ **Kanalnachrichten**: Mit AI auf konfigurierten Kanälen (WhatsApp, Telegram, Slack usw.) chatten
4. ✅ **Direktes Senden**: `clawdbot message send` zum direkten Senden von Nachrichten an Kanäle, AI umgehen
5. ✅ **Fehlerbehebung**: Häufige Fehlerursachen und Lösungen verstehen

**Nächste Schritte**:

- Lernen Sie [DM-Pairing und Zugriffskontrolle](../pairing-approval/), um zu erfahren, wie Sie sicher mit unbekannten Absendern umgehen
- Erkunden Sie [Übersicht über das Mehrkanalsystem](../../platforms/channels-overview/), um alle unterstützten Kanäle und deren Konfiguration zu verstehen
- Konfigurieren Sie mehr Kanäle (WhatsApp, Telegram, Slack, Discord usw.), um plattformübergreifende AI-Assistenten zu erleben

---

## Vorschau auf nächste Lektion

> In der nächsten Lektion lernen wir **[DM-Pairing und Zugriffskontrolle](../pairing-approval/)**.
>
> Sie werden lernen:
> > - Den standardmäßigen DM-Pairing-Schutzmechanismus verstehen
> > - Pairing-Anfragen von unbekannten Absendern genehmigen
> > - Allowlists und Sicherheitsrichtlinien konfigurieren

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion                  | Dateipfad                                                                                             | Zeilennummer    |
|--- | --- | ---|
| CLI-Agent-Befehlsregistrierung  | [`src/cli/program/register.agent.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.agent.ts) | 20-82    |
|--- | --- | ---|
| CLI message send-Registrierung | [`src/cli/program/message/register.send.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/message/register.send.ts) | 1-30     |
|--- | --- | ---|
|--- | --- | ---|
| Nachrichtenkanaltypendefinition   | [`src/gateway/protocol/client-info.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/protocol/client-info.ts) | 2-23     |
| Kanalregistrierung         | [`src/channels/registry.js`](https://github.com/moltbot/moltbot/blob/main/src/channels/registry.js) | Gesamte Datei   |

**Wichtige Konstanten**:
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`: Standardnachrichtenkanal (aus `src/channels/registry.js`)
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: WebChat-interner Nachrichtenkanal (aus `src/utils/message-channel.ts`)

**Wichtige Funktionen**:
- `agentViaGatewayCommand()`: Agent-Methode über Gateway WebSocket aufrufen (`src/commands/agent-via-gateway.ts`)
- `agentCliCommand()`: CLI-Agent-Befehlseinstieg, unterstützt lokale und Gateway-Modi (`src/commands/agent-via-gateway.ts`)
- `registerMessageSendCommand()`: Befehl `message send` registrieren (`src/cli/program/message/register.send.ts`)
- `chat.send`: Gateway WebSocket-Methode, verarbeitet Nachrichtensendeanforderungen (`src/gateway/server-methods/chat.ts`)

</details>
