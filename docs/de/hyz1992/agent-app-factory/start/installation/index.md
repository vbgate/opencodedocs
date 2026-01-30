---
title: "Installation & Konfiguration | Agent App Factory Tutorial"
sidebarTitle: "Installation in 5 Minuten"
subtitle: "Installation & Konfiguration | Agent App Factory Tutorial"
description: "Lernen Sie, wie Sie das Agent App Factory CLI-Tool installieren, Claude Code oder OpenCode konfigurieren und die erforderlichen Plugins installieren. Dieses Tutorial behandelt die Node.js-Umgebungsanforderungen, AI-Assistent-Setup und Plugin-Installationsschritte."
tags:
  - "Installation"
  - "Konfiguration"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 20
---

# Installation & Konfiguration

## Was Sie nach diesem Tutorial können

✅ Das Agent App Factory CLI-Tool installieren und die Installation überprüfen
✅ Claude Code oder OpenCode als AI-Ausführungs-Engine konfigurieren
✅ Die erforderlichen Plugins für die Pipeline-Ausführung installieren
✅ Die Projektinitialisierung abschließen und das erste Factory-Projekt starten

## Ihre aktuelle Situation

Sie möchten die AI App Factory nutzen, um Ihre Ideen in Anwendungen zu verwandeln, aber wissen nicht, welche Tools und Umgebungen installiert werden müssen. Nach der Installation befürchten Sie, dass erforderliche Plugins fehlen und die Pipeline mit Fehlern abbricht.

## Wann Sie diese Schritte verwenden

Verwenden Sie diese Schritte, wenn Sie die AI App Factory zum ersten Mal nutzen oder die Entwicklungsumgebung auf einem neuen Computer einrichten. Führen Sie zuerst die Installation und Konfiguration durch, bevor Sie mit der Anwendungsgenerierung beginnen.

## 🎒 Vorbereitung

::: warning Voraussetzungen

Stellen Sie vor der Installation sicher, dass:

- **Node.js Version >= 16.0.0** - Dies ist die Mindestanforderung für das CLI-Tool
- **npm oder yarn** - Zur globalen Installation von Paketen
- **Ein AI-Assistent** - Claude Code oder OpenCode (Claude Code wird empfohlen)

:::

**Node.js-Version überprüfen**:

```bash
node --version
```

Wenn die Version unter 16.0.0 liegt, laden Sie die neueste LTS-Version von der [Node.js-Website](https://nodejs.org) herunter und installieren Sie diese.

## Kernkonzept

Die Installation der AI App Factory umfasst 3 wesentliche Teile:

1. **CLI-Tool** - Bietet eine Befehlszeilenschnittstelle zur Verwaltung des Projektstatus
2. **AI-Assistent** - Das "Gehirn" zur Ausführung der Pipeline, das Agent-Anweisungen interpretiert
3. **Erforderliche Plugins** - Erweiterungen zur Verbesserung der AI-Fähigkeiten (Bootstrap Brainstorming, UI-Design-System)

Installationsablauf: CLI installieren → AI-Assistent konfigurieren → Projekt initialisieren (Plugins werden automatisch installiert)

## Schritt-für-Schritt-Anleitung

### Schritt 1: CLI-Tool installieren

Installieren Sie das Agent App Factory CLI global, damit Sie den Befehl `factory` in jedem Verzeichnis verwenden können.

```bash
npm install -g agent-app-factory
```

**Erwartete Ausgabe**: Erfolgreiche Installationsmeldung

```
added 1 package in Xs
```

**Installation überprüfen**:

```bash
factory --version
```

**Erwartete Ausgabe**: Versionsnummer

```
1.0.0
```

Wenn keine Versionsnummer angezeigt wird, überprüfen Sie die Installation:

```bash
which factory  # macOS/Linux
where factory  # Windows
```

::: tip Installation fehlgeschlagen?

Bei Berechtigungsproblemen (macOS/Linux) versuchen Sie:

```bash
sudo npm install -g agent-app-factory
```

Oder verwenden Sie npx ohne globale Installation (nicht empfohlen, da bei jeder Verwendung heruntergeladen werden muss):

```bash
npx agent-app-factory init
```

:::

### Schritt 2: AI-Assistent installieren

Die AI App Factory muss mit einem AI-Assistenten verwendet werden, da Agent-Definitionen und Skill-Dateien Markdown-Format AI-Anweisungen sind, die von der AI interpretiert und ausgeführt werden müssen.

#### Option A: Claude Code (empfohlen)

Claude Code ist der offizielle AI-Programmierassistent von Anthropic und tief mit der AI App Factory integriert.

**Installationsmethode**:

1. Besuchen Sie die [Claude Code-Website](https://claude.ai/code)
2. Laden Sie die Anwendung für Ihre Plattform herunter und installieren Sie sie
3. Überprüfen Sie nach der Installation, ob der Befehl verfügbar ist:

```bash
claude --version
```

**Erwartete Ausgabe**: Versionsnummer

```
Claude Code 1.x.x
```

#### Option B: OpenCode

OpenCode ist ein weiterer AI-Programmierassistent, der den Agent-Modus unterstützt.

**Installationsmethode**:

1. Besuchen Sie die [OpenCode-Website](https://opencode.sh)
2. Laden Sie die Anwendung für Ihre Plattform herunter und installieren Sie sie
3. Wenn kein Befehlszeilentool vorhanden ist, laden Sie es manuell herunter und installieren Sie es unter:

- **Windows**: `%LOCALAPPDATA%\Programs\OpenCode\`
- **macOS**: `/Applications/OpenCode.app/`
- **Linux**: `/usr/bin/opencode` oder `/usr/local/bin/opencode`

::: info Warum Claude Code empfohlen?

- Offizielle Unterstützung mit der besten Integration in die Berechtigungssysteme der AI App Factory
- Automatisierte Plugin-Installation, `factory init` konfiguriert die erforderlichen Plugins automatisch
- Bessere Kontextverwaltung, spart Token

:::

### Schritt 3: Erstes Factory-Projekt initialisieren

Jetzt haben Sie eine saubere Factory, lassen Sie uns das erste Projekt initialisieren.

**Projektverzeichnis erstellen**:

```bash
mkdir my-first-app && cd my-first-app
```

**Factory-Projekt initialisieren**:

```bash
factory init
```

**Erwartete Ausgabe**:

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
  .factory/
    agents/
    skills/
    policies/
    templates/
    pipeline.yaml
    config.yaml
    state.json

✓ Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

**Kontrollpunkt ✅**: Bestätigen Sie, dass die folgenden Dateien erstellt wurden

```bash
ls -la .factory/
```

**Erwartete Ausgabe**:

```
agents/
skills/
policies/
templates/
pipeline.yaml
config.yaml
state.json
```

Gleichzeitig sollte sich das Claude Code-Fenster automatisch öffnen.

::: tip Verzeichnis muss leer sein

`factory init` kann nur in einem leeren Verzeichnis oder einem Verzeichnis, das nur `.git`, `README.md` und ähnliche Konfigurationsdateien enthält, ausgeführt werden.

Wenn sich andere Dateien im Verzeichnis befinden, erhalten Sie einen Fehler:

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

:::

### Schritt 4: Automatisch installierte Plugins

`factory init` versucht, zwei erforderliche Plugins automatisch zu installieren:

1. **superpowers** - Brainstorming-Skill für die Bootstrap-Phase
2. **ui-ux-pro-max-skill** - Designsystem für die UI-Phase (67 Stile, 96 Farbpaletten, 100 Branchenregeln)

Wenn die automatische Installation fehlschlägt, sehen Sie eine Warnung:

```
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

::: warning Was tun bei fehlgeschlagener Plugin-Installation?

Wenn die Installation während der Initialisierung fehlschlägt, können Sie die Plugins später in Claude Code manuell installieren:

1. Geben Sie in Claude Code ein:
   ```
   /install superpowers
   /install ui-ux-pro-max-skill
   ```

2. Oder besuchen Sie den Plugin-Markt für manuelle Installation

:::

### Schritt 5: AI-Assistent-Berechtigungen überprüfen

`factory init` generiert automatisch die Datei `.claude/settings.local.json`, um die erforderlichen Berechtigungen zu konfigurieren.

**Berechtigungskonfiguration überprüfen**:

```bash
cat .claude/settings.local.json
```

**Erwartete Ausgabe** (vereinfacht):

```json
{
  "allowedCommands": [
    "read",
    "write",
    "glob",
    "bash"
  ],
  "allowedPaths": [
    ".factory/**",
    "input/**",
    "artifacts/**"
  ]
}
```

Diese Berechtigungen stellen sicher, dass der AI-Assistent:
- Agent-Definitionen und Skill-Dateien lesen kann
- Artefakte in das Verzeichnis `artifacts/` schreiben kann
- Notwendige Skripte und Tests ausführen kann

::: danger --dangerously-skip-permissions nicht verwenden

Die von der AI App Factory generierte Berechtigungskonfiguration ist bereits ausreichend sicher. Verwenden Sie nicht `--dangerously-skip-permissions` in Claude Code, da dies die Sicherheit verringern und zu unbefugten Operationen führen kann.

:::

## Fallen und Lösungen

### ❌ Node.js-Version zu niedrig

**Fehler**: `npm install -g agent-app-factory` schlägt fehl oder gibt bei der Ausführung einen Fehler aus

**Ursache**: Node.js-Version unter 16.0.0

**Lösung**: Upgrade von Node.js auf die neueste LTS-Version

```bash
# Mit nvm upgraden (empfohlen)
nvm install --lts
nvm use --lts
```

### ❌ Claude Code nicht korrekt installiert

**Fehler**: `factory init` zeigt nach der Ausführung "Claude CLI not found" an

**Ursache**: Claude Code wurde nicht korrekt zum PATH hinzugefügt

**Lösung**: Claude Code neu installieren oder den Pfad zur ausführbaren Datei manuell zu den Umgebungsvariablen hinzufügen

- **Windows**: Claude Code-Installationsverzeichnis zum PATH hinzufügen
- **macOS/Linux**: Überprüfen, ob die ausführbare Datei `claude` in `/usr/local/bin/` vorhanden ist

### ❌ Verzeichnis nicht leer

**Fehler**: `factory init` zeigt "directory is not empty" an

**Ursache**: Das Verzeichnis enthält bereits andere Dateien (außer `.git`, `README.md` und ähnlichen Konfigurationsdateien)

**Lösung**: In einem neuen leeren Verzeichnis initialisieren oder das bestehende Verzeichnis bereinigen

```bash
# Nicht-Konfigurationsdateien aus dem Verzeichnis entfernen
rm -rf * !(.git) !(README.md)
```

### ❌ Plugin-Installation fehlgeschlagen

**Fehler**: `factory init` zeigt eine Warnung für fehlgeschlagene Plugin-Installation an

**Ursache**: Netzwerkprobleme oder der Claude Code-Plugin-Markt ist vorübergehend nicht verfügbar

**Lösung**: Plugins manuell in Claude Code installieren oder bei der nachfolgenden Pipeline-Ausführung bei entsprechender Aufforderung installieren

```
/install superpowers
/install ui-ux-pro-max-skill
```

## Lektionszusammenfassung

Diese Lektion hat die vollständige Installation und Konfiguration der AI App Factory abgeschlossen:

1. ✅ **CLI-Tool** - Global über `npm install -g agent-app-factory` installiert
2. ✅ **AI-Assistent** - Claude Code oder OpenCode, Claude Code wird empfohlen
3. ✅ **Projektinitialisierung** - `factory init` erstellt das `.factory/`-Verzeichnis und konfiguriert automatisch
4. ✅ **Erforderliche Plugins** - superpowers und ui-ux-pro-max-skill (automatisch oder manuell installiert)
5. ✅ **Berechtigungskonfiguration** - Claude Code-Berechtigungsdatei wird automatisch generiert

Jetzt haben Sie ein funktionsfähiges Factory-Projekt, das Claude Code-Fenster ist geöffnet und bereit, die Pipeline auszuführen.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie die **[Initialisierung des Factory-Projekts](../init-project/)**.
>
> Sie werden lernen:
> - Die Verzeichnisstruktur zu verstehen, die `factory init` generiert
> - Den Zweck jeder Datei im `.factory/`-Verzeichnis zu verstehen
> - Wie man die Projektkonfiguration ändert
> - Wie man den Projektstatus anzeigt

Sind Sie bereit, Ihre erste Anwendung zu generieren? Lassen Sie uns fortfahren!

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um den Quellcode-Standort anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-29

| Funktion | Dateipfad | Zeile |
| --- | --- | --- |
| CLI-Einstieg | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 1-123 |
| Initialisierungsbefehl | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| Node.js-Anforderung | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json) | 41 |
| Claude Code-Start | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| OpenCode-Start | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Plugin-Installationsprüfung | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L360-L392) | 360-392 |
| Berechtigungskonfigurationsgenerierung | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-275 |

**Wichtige Konstanten**:
- `NODE_VERSION_MIN = "16.0.0"`: Minimale Node.js-Versionsanforderung (package.json:41)

**Wichtige Funktionen**:
- `getFactoryRoot()`: Ruft das Factory-Installationsstammverzeichnis ab (factory.js:22-52)
- `init()`: Initialisiert das Factory-Projekt (init.js:220-456)
- `launchClaudeCode()`: Startet Claude Code (init.js:119-147)
- `launchOpenCode()`: Startet OpenCode (init.js:152-215)
- `generateClaudeSettings()`: Generiert die Claude Code-Berechtigungskonfiguration

</details>
