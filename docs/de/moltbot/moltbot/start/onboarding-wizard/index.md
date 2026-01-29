---
title: "Assistentenbasierte Konfiguration: Alles-in-einem-Einrichtung von Clawdbot | Clawdbot-Tutorial"
sidebarTitle: "Ein-Klick-Konfiguration"
subtitle: "Assistentenbasierte Konfiguration: Alles-in-einem-Einrichtung von Clawdbot"
description: "Lernen Sie, wie Sie Clawdbot mithilfe eines interaktiven Assistenten vollständig konfigurieren können, einschließlich Gateway-Netzwerkeinstellungen, AI-Modell-Authentifizierung (unterstützt Setup-Token und API-Key), Kommunikationskanäle (WhatsApp, Telegram, Slack usw.) und Initialisierung des Skillsystems."
tags:
  - "Einstieg"
  - "Konfiguration"
  - "Assistent"
  - "Gateway"
prerequisite:
  - "getting-started"
order: 20
---

# Assistentenbasierte Konfiguration: Alles-in-einem-Einrichtung von Clawdbot

## Was du nach diesem Tutorial können wirst

Durch dieses Tutorial wirst du:

- ✅ Die vollständige Konfiguration von Clawdbot mit einem interaktiven Assistenten abschließen
- ✅ Den Unterschied zwischen den Modi QuickStart und Manual verstehen
- ✅ Gateway-Netzwerk- und Authentifizierungsoptionen konfigurieren
- ✅ AI-Modellanbieter einrichten (Setup-Token und API-Key)
- ✅ Kommunikationskanäle aktivieren (WhatsApp, Telegram usw.)
- ✅ Skill-Pakete installieren und verwalten

Nach Abschluss des Assistenten läuft der Clawdbot-Gateway im Hintergrund, und du kannst über die konfigurierten Kanäle mit dem AI-Assistenten kommunizieren.

## Dein aktuelles Dilemma

Manuelle Konfigurationsdateien zu bearbeiten ist mühsam:

- Du weißt nicht, was die Konfigurationsoptionen bedeuten und welche Standardwerte sie haben
- Es ist leicht, wichtige Einstellungen zu übersehen, was zu Startproblemen führt
- AI-Modell-Authentifizierungsmethoden sind vielfältig (OAuth, API-Key) – du weißt nicht, welche du wählen sollst
- Die Kanalkonfiguration ist komplex, und jede Plattform hat andere Authentifizierungsmethoden
- Du weißt nicht, welche Skills du im Skillsystem installieren sollst

Die assistentenbasierte Konfiguration löst diese Probleme. Sie führt dich durch interaktive Fragen durch alle Konfigurationsschritte und bietet sinnvolle Standardwerte.

## Wann du diese Methode verwenden solltest

- **Erstinstallation**: Neue Benutzer, die Clawdbot zum ersten Mal verwenden
- **Neukonfiguration**: Änderung von Gateway-Einstellungen, Wechsel des AI-Modells oder Hinzufügen neuer Kanäle
- **Schnelle Validierung**: Du möchtest schnell die Grundfunktionen testen, ohne dich tief mit Konfigurationsdateien zu beschäftigen
- **Fehlerbehebung**: Nach Konfigurationsfehlern den Assistenten zur erneuten Initialisierung verwenden

::: tip Hinweis
Der Assistent erkennt vorhandene Konfigurationen und ermöglicht es dir, diese zu behalten, zu ändern oder zurückzusetzen.
:::

## Kernkonzept

### Zwei Modi

Der Assistent bietet zwei Konfigurationsmodi:

**QuickStart-Modus** (empfohlen für Anfänger)
- Verwendet sichere Standardwerte: Gateway bindet an Loopback (127.0.0.1), Port 18789, Token-Authentifizierung
- Überspringt die meisten detaillierten Konfigurationsoptionen
- Geeignet für Einzelplatznutzung und schnellen Einstieg

**Manual-Modus** (geeignet für fortgeschrittene Benutzer)
- Manuelle Konfiguration aller Optionen
- Unterstützt LAN-Bindung, Tailscale-Fernzugriff, benutzerdefinierte Authentifizierungsmethoden
- Geeignet für Multi-Maschinen-Deployment, Fernzugriff oder spezielle Netzwerkumgebungen

### Konfigurationsablauf

```
1. Sicherheitswarnung bestätigen
2. Modusauswahl (QuickStart / Manual)
3. Gateway-Konfiguration (Port, Bindung, Authentifizierung, Tailscale)
4. AI-Modell-Authentifizierung (Setup-Token / API-Key)
5. Arbeitsbereich-Einstellungen (Standard ~/clawd)
6. Kanalkonfiguration (WhatsApp / Telegram / Slack usw.)
7. Skill-Installation (optional)
8. Abschluss (Gateway starten)
```

### Sicherheitshinweis

Zu Beginn des Assistenten wird eine Sicherheitswarnung angezeigt. Du musst folgende Punkte bestätigen:

- Clawdbot ist ein Hobby-Projekt und befindet sich noch in der Beta-Phase
- Nach Aktivierung der Tools kann die AI Dateien lesen und Aktionen ausführen
- Schädliche Prompts können die AI zu unsicheren Aktionen verleiten
- Empfohlen wird die Verwendung von Pairing/Whitelist + Tools mit minimalen Berechtigungen
- Führe regelmäßig Sicherheitsaudits durch

::: danger Wichtig
Wenn du die grundlegenden Sicherheits- und Zugriffskontrollmechanismen nicht verstehst, aktiviere keine Tools und stelle den Gateway nicht im Internet zur Verfügung. Es wird empfohlen, eine erfahrene Person um Hilfe bei der Konfiguration zu bitten.
:::

---

## 🎒 Vorbereitung vor dem Start

Bevor du den Assistenten startest, überprüfe bitte:

- **Clawdbot ist installiert**: Siehe [Schnellstart](../getting-started/) für die Installation
- **Node.js-Version**: Stelle sicher, dass Node.js ≥ 22 ist (prüfe mit `node -v`)
- **AI-Modell-Konto** (empfohlen):
  - Anthropic Claude-Konto (Pro/Max-Abonnement), unterstützt OAuth-Flow
  - Oder API-Key eines Anbieters wie OpenAI/DeepSearch vorbereitet
- **Kanalkonto** (optional): Wenn du WhatsApp, Telegram usw. verwenden möchtest, registriere dich zuerst bei den entsprechenden Diensten
- **Netzwerkberechtigungen**: Wenn du Tailscale verwenden möchtest, stelle sicher, dass der Tailscale-Client installiert ist

---

## Schritt für Schritt

### Schritt 1: Assistenten starten

Öffne das Terminal und führe den folgenden Befehl aus:

```bash
clawdbot onboard
```

**Warum**
Startet den interaktiven Konfigurationsassistenten, der dich durch alle notwendigen Einstellungen führt.

**Du solltest folgendes sehen**:
```
  ┌─────────────────────────────────────────────────────┐
  │                                                   │
  │   Clawdbot onboarding                              │
  │                                                   │
  └─────────────────────────────────────────────────────┘
```

### Schritt 2: Sicherheitswarnung bestätigen

Der Assistent zeigt zuerst die Sicherheitswarnung an (wie im Abschnitt "Kernkonzept" beschrieben).

**Warum**
Stellt sicher, dass Benutzer die potenziellen Risiken verstehen und vermeidet Missbrauch, der zu Sicherheitsproblemen führt.

**Aktion**:
- Lies den Inhalt der Sicherheitswarnung
- Gib `y` ein oder wähle `Yes`, um die Risiken zu bestätigen
- Wenn du die Risiken nicht akzeptierst, wird der Assistent beendet

**Du solltest folgendes sehen**:
```
Security warning — please read.

Clawdbot is a hobby project and still in beta. Expect sharp edges.
...

I understand this is powerful and inherently risky. Continue? (y/N)
```

### Schritt 3: Konfigurationsmodus auswählen

::: code-group

```bash [QuickStart-Modus]
Empfohlen für Anfänger, verwendet sichere Standardwerte:
- Gateway-Port: 18789
- Bindungsadresse: Loopback (127.0.0.1)
- Authentifizierungsmethode: Token (automatisch generiert)
- Tailscale: Deaktiviert
```

```bash [Manual-Modus]
Geeignet für fortgeschrittene Benutzer, manuelle Konfiguration aller Optionen:
- Benutzerdefinierter Gateway-Port und Bindung
- Wahl zwischen Token- oder Passwort-Authentifizierung
- Konfiguration von Tailscale Serve/Funnel für Fernzugriff
- Detaillierte Konfiguration jedes Schritts
```

:::

**Warum**
Der QuickStart-Modus ermöglicht Anfängern einen schnellen Einstieg, der Manual-Modus gibt fortgeschrittenen Benutzern präzise Kontrolle.

**Aktion**:
- Verwende die Pfeiltasten, um `QuickStart` oder `Manual` auszuwählen
- Drücke Enter zur Bestätigung

**Du solltest folgendes sehen**:
```
? Onboarding mode
  QuickStart         Configure details later via clawdbot configure.
  Manual            Configure port, network, Tailscale, and auth options.
```

### Schritt 4: Bereitstellungsmodus auswählen (nur Manual-Modus)

Wenn du den Manual-Modus wählst, fragt der Assistent nach dem Gateway-Bereitstellungsstandort:

::: code-group

```bash [Lokaler Gateway (diese Maschine)]
Gateway läuft auf der aktuellen Maschine:
- Kann OAuth-Flow ausführen und lokale Anmeldedaten schreiben
- Der Assistent schließt die gesamte Konfiguration ab
- Geeignet für lokale Entwicklung oder Einzelplatz-Deployment
```

```bash [Remote-Gateway (nur Information)]
Gateway läuft auf einer anderen Maschine:
- Der Assistent konfiguriert nur Remote-URL und Authentifizierung
- OAuth-Flow wird nicht ausgeführt, Anmeldedaten müssen auf dem Remote-Host manuell eingerichtet werden
- Geeignet für Multi-Maschinen-Deployment-Szenarien
```

:::

**Warum**
Der Local-Modus unterstützt den vollständigen Konfigurationsablauf, der Remote-Modus konfiguriert nur Zugriffsinformationen.

**Aktion**:
- Wähle den Bereitstellungsmodus
- Im Remote-Modus gib die URL und den Token des Remote-Gateways ein

### Schritt 5: Gateway konfigurieren (nur Manual-Modus)

Wenn du den Manual-Modus wählst, fragt der Assistent nacheinander nach den Gateway-Konfigurationen:

#### Gateway-Port

```bash
? Gateway port (18789)
```

**Erklärung**:
- Standardwert 18789
- Wenn der Port belegt ist, gib einen anderen Port ein
- Stelle sicher, dass der Port nicht von der Firewall blockiert wird

#### Gateway-Bindungsadresse

```bash
? Gateway bind
  Loopback (127.0.0.1)
  LAN (0.0.0.0)
  Tailnet (Tailscale IP)
  Auto (Loopback → LAN)
  Custom IP
```

**Erklärung der Optionen**:
- **Loopback**: Nur lokaler Zugriff, am sichersten
- **LAN**: Geräte im lokalen Netzwerk können zugreifen
- **Tailnet**: Zugriff über das Tailscale-Virtuelle-Netzwerk
- **Auto**: Zuerst Loopback versuchen, bei Fehlschlag zu LAN wechseln
- **Custom IP**: Manuelle IP-Adressenangabe

::: tip Hinweis
Empfohlen wird die Verwendung von Loopback oder Tailnet, um direkte Exposition im lokalen Netzwerk zu vermeiden.
:::

#### Gateway-Authentifizierungsmethode

```bash
? Gateway auth
  Token              Recommended default (local + remote)
  Password
```

**Erklärung der Optionen**:
- **Token**: Empfohlene Option, automatisch generierter Zufallstoken, unterstützt Fernzugriff
- **Password**: Verwendung eines benutzerdefinierten Passworts, erforderlich für Tailscale-Funnel-Modus

#### Tailscale-Fernzugriff (optional)

```bash
? Tailscale exposure
  Off               No Tailscale exposure
  Serve             Private HTTPS for your tailnet (devices on Tailscale)
  Funnel            Public HTTPS via Tailscale Funnel (internet)
```

::: warning Tailscale-Warnung
- Serve-Modus: Nur Geräte im Tailscale-Netzwerk können zugreifen
- Funnel-Modus: Exposition über öffentliches HTTPS (Passwort-Authentifizierung erforderlich)
- Stelle sicher, dass der Tailscale-Client installiert ist: https://tailscale.com/download/mac
:::

### Schritt 6: Arbeitsbereich einrichten

Der Assistent fragt nach dem Arbeitsbereich-Verzeichnis:

```bash
? Workspace directory (~/clawd)
```

**Erklärung**:
- Standardwert `~/clawd` (d.h. `/Users/dein-benutzername/clawd`)
- Der Arbeitsbereich speichert Sitzungsverlauf, Agent-Konfiguration, Skills und andere Daten
- Absolute oder relative Pfade können verwendet werden

::: info Unterstützung für mehrere Konfigurationsdateien (Profile)
Durch die Umgebungsvariable `CLAWDBOT_PROFILE` können unabhängige Konfigurationen für verschiedene Arbeitsumgebungen verwendet werden:

| Profile-Wert | Arbeitsbereich-Pfad | Konfigurationsdatei |
|--- | --- | ---|
| `default` oder nicht gesetzt | `~/clawd` | `~/.clawdbot/clawdbot.json` |
| `work` | `~/clawd-work` | `~/.clawdbot/clawdbot.json` (work profile) |
| `dev` | `~/clawd-dev` | `~/.clawdbot/clawdbot.json` (dev profile) |

Beispiel:
```bash
# Verwendung des work-Profils
export CLAWDBOT_PROFILE=work
clawdbot onboard
```
:::

**Du solltest folgendes sehen**:
```
Ensuring workspace directory: /Users/dein-benutzername/clawd
Creating sessions.json...
Creating agents directory...
```

### Schritt 7: AI-Modell-Authentifizierung konfigurieren

Der Assistent listet die unterstützten AI-Modellanbieter auf:

```bash
? Choose AI model provider
  Anthropic                    Claude Code CLI + API key
  OpenAI                       Codex OAuth + API key
  MiniMax                      M2.1 (recommended)
  Qwen                         OAuth
  Venice AI                     Privacy-focused (uncensored models)
  Google                       Gemini API key + OAuth
  Copilot                      GitHub + local proxy
  Vercel AI Gateway            API key
  Moonshot AI                  Kimi K2 + Kimi Code
  Z.AI (GLM 4.7)            API key
  OpenCode Zen                 API key
  OpenRouter                   API key
  Custom API Endpoint
  Skip for now
```

Nach Auswahl eines Anbieters zeigt der Assistent je nach Anbietertyp die entsprechende Authentifizierungsmethode an. Hier sind die Authentifizierungsoptionen der wichtigsten Anbieter:

**Anthropic** Authentifizierungsmethoden:
- `claude-cli`: Verwendet die bestehende Claude-Code-CLI-OAuth-Authentifizierung (Keychain-Zugriff erforderlich)
- `token`: Fügt das über `claude setup-token` generierte Setup-Token ein
- `apiKey`: Manuelle Eingabe des Anthropic API-Keys

::: info Anthropic Setup-Token-Methode (empfohlen)
Die Verwendung der Setup-Token-Methode wird empfohlen, aus folgenden Gründen:
- Keine manuelle Verwaltung des API-Keys notwendig
- Generiert langfristig gültige Tokens
- Geeignet für persönliche Pro/Max-Abonnenten

Ablauf:
1. Führe in einem anderen Terminal aus: `claude setup-token`
2. Dieser Befehl öffnet den Browser für die OAuth-Autorisierung
3. Kopiere das generierte Setup-Token
4. Wähle im Assistenten `Anthropic` → `token`
5. Füge das Setup-Token in den Assistenten ein
6. Anmeldedaten werden automatisch im Verzeichnis `~/.clawdbot/credentials/` gespeichert
:::

::: info API-Key-Methode
Wenn du API-Key wählst:
- Der Assistent fragt nach dem API-Key
- Anmeldedaten werden in `~/.clawdbot/credentials/` gespeichert
- Unterstützt mehrere Anbieter, jederzeit wechselbar

Beispiel:
```bash
? Enter API Key
sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
:::

### Schritt 8: Standardmodell auswählen

Nach erfolgreicher Authentifizierung zeigt der Assistent die Liste der verfügbaren Modelle an:

```bash
? Select default model
  anthropic/claude-sonnet-4-5      Anthropic Sonnet 4.5 (200k ctx)
  anthropic/claude-opus-4-5          Anthropic Opus 4.5 (200k ctx)
  openai/gpt-4-turbo                OpenAI GPT-4 Turbo
  deepseek/DeepSeek-V3                DeepSeek V3
  (Keep current selection)
```

**Empfehlung**:
- Empfohlen wird **Claude Sonnet 4.5** oder **Opus 4.5** (200k Kontext, stärkere Sicherheit)
- Wenn das Budget begrenzt ist, kann die Mini-Version gewählt werden
- Klicke auf `Keep current selection`, um die bestehende Konfiguration zu behalten

### Schritt 9: Kommunikationskanäle konfigurieren

Der Assistent listet alle verfügbaren Kommunikationskanal-Plugins auf:

```bash
? Select channels to enable
  ✓ whatsapp       WhatsApp (Baileys Web Client)
  ✓ telegram       Telegram (Bot Token)
  ✓ slack          Slack (Bot Token + App Token)
  ✓ discord        Discord (Bot Token)
  ✓ googlechat     Google Chat (OAuth)
  (Press Space to select, Enter to confirm)
```

**Aktion**:
- Verwende die Pfeiltasten zur Navigation
- Drücke **Leertaste**, um die Auswahl zu wechseln
- Drücke **Enter**, um die Auswahl zu bestätigen

::: tip QuickStart-Modus-Optimierung
Im QuickStart-Modus wählt der Assistent automatisch Kanäle aus, die schnell aktiviert werden können (z.B. WebChat), und überspringt die DM-Strategie-Konfiguration, verwendet sichere Standardwerte (Pairing-Modus).
:::

Nach Auswahl der Kanäle fragt der Assistent nacheinander nach der Konfiguration jedes Kanals:

#### WhatsApp-Konfiguration

```bash
? Configure WhatsApp
  Link new account     Open QR code in browser
  Skip
```

**Aktion**:
- Wähle `Link new account`
- Der Assistent zeigt einen QR-Code an
- Scanne den QR-Code mit WhatsApp, um dich anzumelden
- Nach erfolgreicher Anmeldung werden Sitzungsdaten in `~/.clawdbot/credentials/` gespeichert

#### Telegram-Konfiguration

```bash
? Configure Telegram
  Bot Token
  Skip
```

**Aktion**:
- Wähle `Bot Token`
- Gib den Bot-Token ein, den du von @BotFather erhalten hast
- Der Assistent testet, ob die Verbindung erfolgreich ist

::: tip Bot Token erhalten
1. Suche in Telegram nach @BotFather
2. Sende `/newbot`, um einen neuen Bot zu erstellen
3. Folge den Anweisungen, um Bot-Name und Benutzernamen festzulegen
4. Kopiere den generierten Bot-Token
:::

#### Slack-Konfiguration

```bash
? Configure Slack
  App Token         xapp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Bot Token         xoxb-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Signing Secret   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Skip
```

**Erklärung**:
Slack benötigt drei Anmeldedaten, die von den Slack-App-Einstellungen bezogen werden:
- **App Token**: Token auf Workspace-Ebene
- **Bot Token**: OAuth-Token des Bot-Benutzers
- **Signing Secret**: Zur Überprüfung der Request-Signatur

::: tip Slack-App erstellen
1. Besuche https://api.slack.com/apps
2. Erstelle eine neue App
3. Hole den Signing Secret auf der Seite "Basic Information"
4. Installiere die App im Workspace auf der Seite "OAuth & Permissions"
5. Erhalte Bot-Token und App-Token
:::

### Schritt 10: Skills konfigurieren (optional)

Der Assistent fragt, ob Skills installiert werden sollen:

```bash
? Install skills? (Y/n)
```

**Empfehlung**:
- Wähle `Y`, um empfohlene Skills zu installieren (z.B. bird Paketmanager, sherpa-onnx-tts lokale TTS)
- Wähle `n`, um zu überspringen, später kannst du Skills über den Befehl `clawdbot skills` verwalten

Wenn du die Installation wählst, listet der Assistent die verfügbaren Skills auf:

```bash
? Select skills to install
  ✓ bird           macOS Homebrew Paketinstallation
  ✓ sherpa-onnx-tts  Lokale TTS-Engine (Datenschutz priorisiert)
  (Press Space to select, Enter to confirm)
```

### Schritt 11: Konfiguration abschließen

Der Assistent fasst alle Konfigurationen zusammen und schreibt sie in die Konfigurationsdatei:

```bash
✓ Writing config to ~/.clawdbot/clawdbot.json
✓ Workspace initialized at ~/clawd
✓ Channels configured: whatsapp, telegram, slack
✓ Skills installed: bird, sherpa-onnx-tts

────────────────────────────────────────────────────

Configuration complete!

Next steps:
  1. Start Gateway:
     clawdbot gateway --daemon

  2. Test connection:
     clawdbot message send --to +1234567890 --message "Hello!"

  3. Manage configuration:
     clawdbot configure

Docs: https://docs.clawd.bot/start/onboarding
────────────────────────────────────────────────────
```

## Checkpoint ✅

Nach Abschluss des Assistenten überprüfe bitte folgende Punkte:

- [ ] Konfigurationsdatei wurde erstellt: `~/.clawdbot/clawdbot.json`
- [ ] Arbeitsbereich wurde initialisiert: Verzeichnis `~/clawd/` existiert
- [ ] AI-Modell-Anmeldedaten wurden gespeichert: Überprüfe `~/.clawdbot/credentials/`
- [ ] Kanäle wurden konfiguriert: Siehe `channels`-Knoten in `clawdbot.json`
- [ ] Skills wurden installiert (falls ausgewählt): Siehe `skills`-Knoten in `clawdbot.json`

**Überprüfungsbefehle**:

```bash
## Konfigurationszusammenfassung anzeigen
clawdbot doctor

## Gateway-Status anzeigen
clawdbot gateway status

## Verfügbare Kanäle anzeigen
clawdbot channels list
```

## Häufige Fehler und Lösungen

### Häufiger Fehler 1: Port ist belegt

**Fehlermeldung**:
```
Error: Port 18789 is already in use
```

**Lösung**:
1. Finde den belegenden Prozess: `lsof -i :18789` (macOS/Linux) oder `netstat -ano | findstr 18789` (Windows)
2. Beende den konfliktverursachenden Prozess oder verwende einen anderen Port

### Häufiger Fehler 2: OAuth-Flow fehlgeschlagen

**Fehlermeldung**:
```
Error: OAuth exchange failed
```

**Mögliche Ursachen**:
- Netzwerkprobleme verhindern den Zugriff auf Anthropic-Server
- OAuth-Code ist abgelaufen oder hat falsches Format
- Browser wurde blockiert und konnte nicht geöffnet werden

**Lösung**:
1. Überprüfe die Netzwerkverbindung
2. Führe `clawdbot onboard` erneut aus, um OAuth zu wiederholen
3. Oder verwende die API-Key-Methode

### Häufiger Fehler 3: Kanalkonfiguration fehlgeschlagen

**Fehlermeldung**:
```
Error: WhatsApp authentication failed
```

**Mögliche Ursachen**:
- QR-Code ist abgelaufen
- Konto wurde von WhatsApp eingeschränkt
- Abhängigkeiten nicht installiert (z.B. signal-cli)

**Lösung**:
1. WhatsApp: QR-Code erneut scannen
2. Signal: Stelle sicher, dass signal-cli installiert ist (siehe kanalspezifische Dokumentation)
3. Bot Token: Bestätige, dass das Token-Format korrekt ist und nicht abgelaufen

### Häufiger Fehler 4: Tailscale-Konfiguration fehlgeschlagen

**Fehlermeldung**:
```
Error: Tailscale binary not found in PATH or /Applications.
```

**Lösung**:
1. Installiere Tailscale: https://tailscale.com/download/mac
2. Stelle sicher, dass es zum PATH hinzugefügt wurde oder in `/Applications` installiert ist
3. Oder überspringe die Tailscale-Konfiguration und richte sie später manuell ein

### Häufiger Fehler 5: Konfigurationsdatei-Formatfehler

**Fehlermeldung**:
```
Error: Invalid config at ~/.clawdbot/clawdbot.json
```

**Lösung**:
```bash
# Konfiguration reparieren
clawdbot doctor

# Oder Konfiguration zurücksetzen
clawdbot onboard --mode reset
```

---

## Zusammenfassung dieser Lektion

Die assistentenbasierte Konfiguration ist die empfohlene Methode zur Konfiguration von Clawdbot. Sie führt dich durch interaktive Fragen durch alle notwendigen Einstellungen:

**Wichtige Punkte zur Wiederholung**:
- ✅ Unterstützt **QuickStart** und **Manual** zwei Modi
- ✅ Sicherheitswarnung weist auf potenzielle Risiken hin
- ✅ Erkennt automatisch vorhandene Konfigurationen, kann behalten/geändert/zurückgesetzt werden
- ✅ Unterstützt **Anthropic Setup-Token**-Flow (empfohlen) und API-Key-Methode
- ✅ Unterstützt **CLAWDBOT_PROFILE** Mehrfachkonfigurationsdateien-Umgebung
- ✅ Automatische Konfiguration von Kanälen und Skills
- ✅ Generiert sichere Standardwerte (Loopback-Bindung, Token-Authentifizierung)

**Empfohlener Workflow**:
1. Erstverwendung: `clawdbot onboard --install-daemon`
2. Konfiguration ändern: `clawdbot configure`
3. Fehlerbehebung: `clawdbot doctor`
4. Fernzugriff: Konfiguration von Tailscale Serve/Funnel

**Nächste Schritte**:
- [Gateway starten](../gateway-startup/): Gateway im Hintergrund laufen lassen
- [Erste Nachricht senden](../first-message/): Mit dem AI-Assistenten beginnen zu kommunizieren
- [DM-Pairing verstehen](../pairing-approval/): Sicherheitskontrolle für unbekannte Absender

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Gateway starten](../gateway-startup/)**.
>
> Du wirst lernen:
> - Wie man den Gateway-Daemon startet
> - Den Unterschied zwischen Entwicklungs- und Produktionsmodus
> - Wie man den Gateway-Status überwacht
> - Automatischer Start mit launchd/systemd

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion           | Dateipfad                                                                                                  | Zeilennummer      |
|--- | --- | ---|
| Hauptassistentenablauf     | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 87-452    |
| Sicherheitswarnungsbestätigung   | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 46-85     |
|--- | --- | ---|
| Assistenten-Schnittstellendefinition   | [`src/wizard/prompts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/prompts.ts) | 36-52     |
| Kanalkonfiguration     | [`src/commands/onboard-channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/onboard-channels.ts) | -         |
|--- | --- | ---|
| Assistenten-Typdefinition   | [`src/wizard/onboarding.types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.types.ts) | 1-26      |
| Konfigurationsdatei Schema | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | -         |

**Wichtige Typen**:
- `WizardFlow`: `"quickstart" | "advanced"` - Assistentenmodus-Typ
- `QuickstartGatewayDefaults`: Gateway-Standardkonfiguration für QuickStart-Modus
- `GatewayWizardSettings`: Gateway-Konfigurationseinstellungen
- `WizardPrompter`: Assistenten-Interaktionsschnittstelle

**Wichtige Funktionen**:
- `runOnboardingWizard()`: Hauptassistentenablauf
- `configureGatewayForOnboarding()`: Konfiguration von Gateway-Netzwerk und Authentifizierung
- `requireRiskAcknowledgement()`: Anzeigen und Bestätigen der Sicherheitswarnung

**Standardkonfigurationswerte** (QuickStart-Modus):
- Gateway-Port: 18789
- Bindungsadresse: loopback (127.0.0.1)
- Authentifizierungsmethode: token (automatisch generierter Zufallstoken)
- Tailscale: off
- Arbeitsbereich: `~/clawd`

**Konfigurationsdatei-Positionen**:
- Hauptkonfiguration: `~/.clawdbot/clawdbot.json`
- OAuth-Anmeldedaten: `~/.clawdbot/credentials/oauth.json`
- API-Key-Anmeldedaten: `~/.clawdbot/credentials/`
- Sitzungsdaten: `~/clawd/sessions.json`

</details>
