---
title: "Schnellstart: Clawdbot installieren und starten | Tutorial"
sidebarTitle: "In 5 Minuten starten"
subtitle: "Schnellstart: Installation, Konfiguration und Start von Clawdbot"
description: "Lernen Sie, wie Sie Clawdbot installieren, AI-Modelle konfigurieren, den Gateway starten und Ihre erste Nachricht über WhatsApp/Telegram/Slack und andere Kanäle senden."
tags:
  - "Einsteiger"
  - "Installation"
  - "Konfiguration"
  - "Gateway"
prerequisite: []
order: 10
---

# Schnellstart: Installation, Konfiguration und Start von Clawdbot

## Was Sie nach diesem Tutorial können

Nach Abschluss dieses Tutorials können Sie:

- ✅ Clawdbot auf Ihrem Gerät installieren
- ✅ AI-Modell-Authentifizierung konfigurieren (Anthropic / OpenAI / andere Anbieter)
- ✅ Den Gateway-Daemon starten
- ✅ Ihre erste Nachricht über WebChat oder konfigurierte Kanäle senden

## Ihre aktuelle Situation

Vielleicht denken Sie gerade:

- "Lokale AI-Assistenten klingen kompliziert – wo fange ich an?"
- "Ich habe viele Geräte (Handy, Computer) – wie verwalte ich diese einheitlich?"
- "Ich kenne WhatsApp/Telegram/Slack – kann ich diese zum Chatten mit AI nutzen?"

Die gute Nachricht: **Clawdbot wurde genau für diese Probleme entwickelt**.

## Wann Sie diese Anleitung verwenden

Verwenden Sie sie, wenn Sie:

- 🚀 Ihren **persönlichen AI-Assistenten erstmalig einrichten** möchten
- 🔧 **Mehrere Kanäle** konfigurieren möchten (WhatsApp, Telegram, Slack, Discord usw.)
- 🤖 **AI-Modelle verbinden** möchten (Anthropic Claude, OpenAI GPT usw.)
- 📱 **Geräte übergreifend zusammenarbeiten** möchten (macOS-, iOS-, Android-Nodes)

::: tip Warum empfehlen wir den Gateway-Modus?
Der Gateway ist die Kontrollebene von Clawdbot und bietet:
- Zentrale Verwaltung aller Sitzungen, Kanäle, Tools und Ereignisse
- Unterstützung für mehrere gleichzeitige Client-Verbindungen
- Ermöglicht Geräte-Nodes zur Ausführung lokaler Operationen
:::

## 🎒 Vorbereitungen vor dem Start

### Systemanforderungen

| Komponente | Anforderung |
|--- | ---|
| **Node.js** | ≥ 22.12.0 |
| **Betriebssystem** | macOS / Linux / Windows (WSL2) |
| **Paketmanager** | npm / pnpm / bun |

::: warning Hinweis für Windows-Benutzer
Auf Windows wird dringend die Verwendung von **WSL2** empfohlen, da:
- Viele Kanäle auf lokale Binärdateien angewiesen sind
- Daemons (launchd/systemd) unter Windows nicht verfügbar sind
:::

### Empfohlene AI-Modelle

Obwohl jedes Modell unterstützt wird, empfehlen wir dringend:

| Anbieter | Empfohlenes Modell | Grund |
|--- | --- | ---|
| Anthropic | Claude Opus 4.5 | Vorteile bei langem Kontext, stärkere Resistenz gegen Prompt-Injection |
| OpenAI | GPT-5.2 + Codex | Starke Programmierfähigkeiten, Multimodal-Unterstützung |

---

## Kerngedanke

Die Architektur von Clawdbot ist einfach: **Ein Gateway, mehrere Kanäle, ein AI-Assistent**.

```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat
                │
                ▼
        ┌──────────────────┐
        │   Gateway       │  ← Kontrollebene (Daemon)
        │   127.0.0.1:18789 │
        └────────┬─────────┘
                 │
                 ├─→ AI-Agent (pi-mono RPC)
                 ├─→ CLI (clawdbot ...)
                 ├─→ WebChat UI
                 └─→ macOS / iOS / Android-Nodes
```

**Wichtige Konzepte**:

| Konzept | Funktion |
|--- | ---|
| **Gateway** | Daemon, verantwortlich für Sitzungsmanagement, Kanalverbindungen, Tool-Aufrufe |
| **Channel** | Nachrichtenkanal (WhatsApp, Telegram, Slack usw.) |
| **Agent** | AI-Laufzeit (RPC-Modus basierend auf pi-mono) |
| **Node** | Geräte-Node (macOS/iOS/Android), führt lokale Geräteoperationen aus |

---

## Schritt für Schritt

### Schritt 1: Clawdbot installieren

**Warum**
Nach globaler Installation kann der Befehl `clawdbot` überall verwendet werden.

#### Option A: Mit npm (empfohlen)

```bash
npm install -g clawdbot@latest
```

#### Option B: Mit pnpm

```bash
pnpm add -g clawdbot@latest
```

#### Option C: Mit bun

```bash
bun install -g clawdbot@latest
```

**Sie sollten Folgendes sehen**:
```
added 1 package, and audited 1 package in 3s
```

::: tip Entwickleroption
Wenn Sie planen, aus dem Quellcode zu entwickeln oder beizutragen, springen Sie zu [Anhang: Aus dem Quellcode bauen](#aus-dem-quellcode-bauen).
:::

---

### Schritt 2: Den Onboarding-Assistenten ausführen

**Warum**
Der Assistent führt Sie durch alle notwendigen Konfigurationen: Gateway, Kanäle, Skills.

#### Assistenten starten (empfohlen)

```bash
clawdbot onboard --install-daemon
```

**Was der Assistent Sie fragt**:

| Schritt | Frage | Hinweis |
|--- | --- | ---|
| 1 | Wählen Sie die AI-Modell-Authentifizierungsmethode | OAuth / API-Schlüssel |
| 2 | Konfigurieren Sie den Gateway (Port, Authentifizierung) | Standard: 127.0.0.1:18789 |
| 3 | Konfigurieren Sie Kanäle (WhatsApp, Telegram usw.) | Überspringbar, später konfigurierbar |
| 4 | Konfigurieren Sie Skills (optional) | Überspringbar |

**Sie sollten Folgendes sehen**:
```
✓ Gateway configured
✓ Workspace initialized: ~/clawd
✓ Channels configured
✓ Skills installed

To start the gateway, run:
  clawdbot gateway
```

::: info Was ist ein Daemon?
`--install-daemon` installiert den Gateway-Daemon:
- **macOS**: launchd-Service (Benutzerebene)
- **Linux**: systemd-Benutzerservice

So läuft der Gateway automatisch im Hintergrund, ohne manuellen Start.
:::

---

### Schritt 3: Gateway starten

**Warum**
Der Gateway ist die Kontrollebene von Clawdbot und muss zuerst gestartet werden.

#### Im Vordergrund starten (zum Debuggen)

```bash
clawdbot gateway --port 18789 --verbose
```

**Sie sollten Folgendes sehen**:
```
[clawdbot] Gateway started
[clawdbot] Listening on ws://127.0.0.1:18789
[clawdbot] Ready to accept connections
```

#### Im Hintergrund starten (empfohlen)

Wenn Sie `--install-daemon` im Assistenten verwendet haben, startet der Gateway automatisch.

Status prüfen:

```bash
clawdbot gateway status
```

**Sie sollten Folgendes sehen**:
```
Gateway is running
PID: 12345
Port: 18789
```

::: tip Häufig verwendete Optionen
- `--port 18789`: Gibt den Gateway-Port an (Standard 18789)
- `--verbose`: Aktiviert ausführliche Protokolle (nützlich zum Debuggen)
- `--reset`: Startet den Gateway neu (löscht Sitzungen)
:::

---

### Schritt 4: Erste Nachricht senden

**Warum**
Überprüfen Sie, ob die Installation erfolgreich war, und erleben Sie die Antwort des AI-Assistenten.

#### Option A: Direkter Dialog über CLI

```bash
clawdbot agent --message "Ship checklist" --thinking high
```

**Sie sollten Folgendes sehen**:
```
[clawdbot] Agent is thinking...
[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

#### Option B: Nachricht über Kanal senden

Wenn Sie Kanäle im Assistenten konfiguriert haben (z. B. WhatsApp, Telegram), können Sie direkt in der entsprechenden App eine Nachricht an Ihren AI-Assistenten senden.

**WhatsApp-Beispiel**:

1. Öffnen Sie WhatsApp
2. Suchen Sie nach Ihrer Clawdbot-Nummer
3. Senden Sie die Nachricht: `Hello, I'm testing Clawdbot!`

**Sie sollten Folgendes sehen**:
- Der AI-Assistent antwortet auf Ihre Nachricht

::: info DM-Pairing-Schutz
Standardmäßig ist der **DM-Pairing-Schutz** in Clawdbot aktiviert:
- Unbekannte Absender erhalten einen Pairing-Code
- Nachrichten werden nicht verarbeitet, bis Sie das Pairing genehmigen

Weitere Details: [DM-Pairing und Zugriffskontrolle](../pairing-approval/)
:::

---

## Kontrollpunkt ✅

Nach Abschluss der obigen Schritte sollten Sie in der Lage sein:

- [ ] `clawdbot --version` auszuführen und die Versionsnummer zu sehen
- [ ] `clawdbot gateway status` auszuführen und zu sehen, dass der Gateway läuft
- [ ] Eine Nachricht über CLI zu senden und eine AI-Antwort zu erhalten
- [ ] (Optional) Eine Nachricht in konfigurierten Kanälen zu senden und eine AI-Antwort zu erhalten

::: tip Häufige Probleme
**F: Gateway startet nicht?**
A: Prüfen Sie, ob der Port belegt ist:
```bash
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows
```

**F: AI antwortet nicht?**
A: Prüfen Sie, ob der API-Schlüssel korrekt konfiguriert ist:
```bash
clawdbot models list
```

**F: Wie zeige ich ausführliche Protokolle an?**
A: Fügen Sie `--verbose` beim Start hinzu:
```bash
clawdbot gateway --verbose
```
:::

---

## Warnungen vor typischen Fehlern

### ❌ Daemon vergessen zu installieren

**Falsche Vorgehensweise**:
```bash
clawdbot onboard  # --install-daemon vergessen
```

**Richtige Vorgehensweise**:
```bash
clawdbot onboard --install-daemon
```

::: warning Vordergrund vs. Hintergrund
- Vordergrund: Geeignet zum Debuggen, Gateway stoppt beim Schließen des Terminals
- Hintergrund: Geeignet für Produktionsumgebungen, startet automatisch neu
:::

### ❌ Node.js-Version zu niedrig

**Falsche Vorgehensweise**:
```bash
node --version
# v20.x.x  # Zu alt
```

**Richtige Vorgehensweise**:
```bash
node --version
# v22.12.0 oder höher
```

### ❌ Falscher Pfad für Konfigurationsdatei

Standardmäßige Konfigurationsdateipfade für Clawdbot:

| Betriebssystem | Konfigurationspfad |
|--- | ---|
| macOS/Linux | `~/.clawdbot/clawdbot.json` |
| Windows (WSL2) | `~/.clawdbot/clawdbot.json` |

Wenn Sie die Konfigurationsdatei manuell bearbeiten, stellen Sie sicher, dass der Pfad korrekt ist.

---

## Zusammenfassung dieser Lektion

In dieser Lektion haben Sie gelernt:

1. ✅ **Clawdbot zu installieren**: Globale Installation mit npm/pnpm/bun
2. ✅ **Den Assistenten auszuführen**: `clawdbot onboard --install-daemon` zur Konfiguration
3. ✅ **Den Gateway zu starten**: `clawdbot gateway` oder automatischer Start durch Daemon
4. ✅ **Nachrichten zu senden**: Dialog mit AI über CLI oder konfigurierte Kanäle

**Nächste Schritte**:

- Lernen Sie mehr über den [Assistenten-basierten Konfigurationsprozess](../onboarding-wizard/) und die verschiedenen Optionen des Assistenten
- Erfahren Sie mehr über das [Starten des Gateways](../gateway-startup/) und verschiedene Startmodi (dev/production)
- Lernen Sie das [Senden der ersten Nachricht](../first-message/) und erkunden Sie weitere Nachrichtenformate und Interaktionsmethoden

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir den **[Assistenten-basierten Konfigurationsprozess](../onboarding-wizard/)**.
>
> Sie werden lernen:
> - Wie Sie den interaktiven Assistenten zur Gateway-Konfiguration verwenden
> - Wie Sie mehrere Kanäle konfigurieren (WhatsApp, Telegram, Slack usw.)
> - Wie Sie Skills und AI-Modell-Authentifizierung verwalten

---

## Anhang: Aus dem Quellcode bauen

Wenn Sie planen, aus dem Quellcode zu entwickeln oder beizutragen, können Sie:

### 1. Repository klonen

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

### 2. Abhängigkeiten installieren

```bash
pnpm install
```

### 3. UI bauen (erste Ausführung)

```bash
pnpm ui:build  # Installiert automatisch UI-Abhängigkeiten
```

### 4. TypeScript bauen

```bash
pnpm build
```

### 5. Onboarding ausführen

```bash
pnpm clawdbot onboard --install-daemon
```

### 6. Entwicklungszyklus (automatisches Neuladen)

```bash
pnpm gateway:watch  # Automatisches Neuladen bei Änderungen an TS-Dateien
```

::: info Entwicklungsmodus vs. Produktionsmodus
- `pnpm clawdbot ...`: Führt TypeScript direkt aus (Entwicklungsmodus)
- Nach `pnpm build`: Generiert `dist/`-Verzeichnis (Produktionsmodus)
:::

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Standorte anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
| Onboarding-Befehl | [`src/cli/program/register.onboard.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.onboard.ts) | 34-100 |
|--- | --- | ---|
| Gateway-Service | [`src/daemon/service.ts`](https://github.com/moltbot/moltbot/blob/main/src/daemon/service.ts) | Gesamte Datei |
| Laufzeitprüfung | [`src/infra/runtime-guard.ts`](https://github.com/moltbot/moltbot/blob/main/src/infra/runtime-guard.ts) | Gesamte Datei |

**Wichtige Konstanten**:
- `DEFAULT_GATEWAY_DAEMON_RUNTIME = "node"`: Standard-Daemon-Laufzeit (aus `src/commands/daemon-runtime.ts`)
- `DEFAULT_GATEWAY_PORT = 18789`: Standard-Gateway-Port (aus der Konfiguration)

**Wichtige Funktionen**:
- `runCli()`: CLI-Haupteingang, verarbeitet Argumentparsing und Befehlsrouting (`src/cli/run-main.ts`)
- `runDaemonInstall()`: Installiert den Gateway-Daemon (`src/cli/daemon-cli/install.ts`)
- `onboardCommand()`: Interaktiver Assistent-Befehl (`src/commands/onboard.ts`)

</details>
