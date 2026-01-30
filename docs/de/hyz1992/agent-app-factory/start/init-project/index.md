---
title: "Factory-Initialisierung: 3-Minuten-Verzeichniskonfiguration | Agent Factory"
sidebarTitle: "3-Minuten-Projektinitialisierung"
subtitle: "Factory-Projekt initialisieren: 3-Minuten-Setup von Grund auf"
description: "Lernen Sie, wie Sie mit dem Befehl factory init schnell ein Agent App Factory-Projekt initialisieren. Das Tutorial behandelt Verzeichnisanforderungen, Dateistruktur, Berechtigungskonfiguration und den Start des KI-Assistenten."
tags:
  - "Projektinitialisierung"
  - "factory init"
  - "Verzeichnisstruktur"
prerequisite:
  - "start-installation"
order: 30
---

# Factory-Projekt initialisieren: 3-Minuten-Setup von Grund auf

## Was Sie lernen können

- Ein Factory-Projekt in einem beliebigen leeren Verzeichnis initialisieren
- Die generierte `.factory/`-Verzeichnisstruktur verstehen
- Projektparameter konfigurieren (Tech-Stack, UI-Präferenzen, MVP-Einschränkungen)
- Den KI-Assistenten automatisch starten und die Pipeline beginnen

## Ihr aktuelles Problem

Möchten Sie AI App Factory ausprobieren, wissen aber nicht, wo Sie anfangen sollen? Sie starren auf einen leeren Ordner und wissen nicht, welche Dateien Sie erstellen sollen? Oder Sie haben bereits einigen Code und sind sich nicht sicher, ob Sie ihn direkt verwenden können? Keine Sorge, der Befehl `factory init` erledigt alles für Sie.

## Wann Sie dies verwenden sollten

- Erstmalige Verwendung von AI App Factory
- Beginn einer neuen Produktidee
- Sie benötigen eine saubere Factory-Projektablage

## 🎒 Vorbereitungen

::: warning Vorprüfung

Bevor Sie beginnen, bestätigen Sie bitte:

- ✅ [Installation und Konfiguration](../installation/) abgeschlossen
- ✅ KI-Assistent installiert (Claude Code oder OpenCode)
- ✅ Ein **leeres Verzeichnis** oder ein Verzeichnis, das nur Git/Editor-Konfigurationen enthält

:::
## Kernkonzept

Der Kern des Befehls `factory init` ist **Selbstkonteniertheit**:

1. Kopieren aller notwendigen Dateien (agents, skills, policies, pipeline.yaml) in das `.factory/`-Verzeichnis des Projekts
2. Generieren von Projektkonfigurationsdateien (`config.yaml` und `state.json`)
3. Konfigurieren von Claude Code-Berechtigungen (`.claude/settings.local.json`)
4. Automatisches Installieren der erforderlichen Plugins (superpowers, ui-ux-pro-max)
5. Starten des KI-Assistenten und Beginnen der Pipeline

Auf diese Weise enthält jedes Factory-Projekt alles, was für den Betrieb erforderlich ist, ohne von einer globalen Installation abhängig zu sein.

::: tip Warum selbstkontenierend?

Die selbstkontenierende Designphilosophie bringt folgende Vorteile mit sich:

- **Versionsisolierung**: Verschiedene Projekte können unterschiedliche Versionen der Factory-Konfiguration verwenden
- **Portabilität**: Das `.factory/`-Verzeichnis kann direkt in Git committet werden, damit Teammitglieder es wiederverwenden können
- **Sicherheit**: Die Berechtigungskonfiguration gilt nur innerhalb des Projektverzeichnisses und beeinträchtigt nicht andere Projekte

:::

## Schritt für Schritt

### Schritt 1: In das Projektverzeichnis wechseln

**Warum**: Sie benötigen ein sauberes Arbeitsverzeichnis, um die generierte Anwendung zu speichern.

```bash
# Neues Verzeichnis erstellen
mkdir my-app && cd my-app

# Oder in ein bereits vorhandenes leeres Verzeichnis wechseln
cd /path/to/your/project
```

**Was Sie sehen sollten**: Das Verzeichnis ist leer oder enthält nur zulässige Dateien wie `.git/`, `.gitignore`, `README.md`.

### Schritt 2: Initialisierungsbefehl ausführen

**Warum**: `factory init` erstellt das `.factory/`-Verzeichnis und kopiert alle notwendigen Dateien.

```bash
factory init
```

**Was Sie sehen sollten**:

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
  .factory/
    agents/
    skills/
    templates/
    policies/
    pipeline.yaml
    config.yaml
    state.json

Checking and installing required Claude plugins...
Installing superpowers plugin... ✓
Installing ui-ux-pro-max-skill plugin... ✓
Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

### Schritt 3: Mit optionalen Parametern anpassen (optional)

**Warum**: Wenn Sie bestimmte Präferenzen für den Tech-Stack haben, können Sie diese bei der Initialisierung angeben.

```bash
factory init --name "Meine Ausgaben-App" --description "Hilft jungen Menschen, ihre täglichen Ausgaben zu verfolgen"
```

Diese Parameter werden in `config.yaml` geschrieben und beeinflussen den später generierten Code.

### Schritt 4: Die generierte Verzeichnisstruktur überprüfen

**Warum**: Bestätigen Sie, dass alle Dateien korrekt generiert wurden.

```bash
ls -la
```

**Was Sie sehen sollten**:

```
.claude/              # Claude Code-Konfigurationsverzeichnis
  └── settings.local.json   # Berechtigungskonfiguration

.factory/            # Factory-Kernverzeichnis
  ├── agents/          # Agent-Definitionsdateien
  ├── skills/          # Skill-Module
  ├── templates/       # Konfigurationstemplates
  ├── policies/        # Richtlinien und Standards
  ├── pipeline.yaml    # Pipeline-Definition
  ├── config.yaml      # Projektkonfiguration
  └── state.json      # Pipeline-Status
```

## Checkpoint ✅

Stellen Sie sicher, dass die folgenden Dateien erstellt wurden:

- [ ] `.factory/pipeline.yaml` vorhanden
- [ ] `.factory/config.yaml` vorhanden
- [ ] `.factory/state.json` vorhanden
- [ ] `.claude/settings.local.json` vorhanden
- [ ] `.factory/agents/`-Verzeichnis enthält 7 `.agent.md`-Dateien
- [ ] `.factory/skills/`-Verzeichnis enthält 6 Skill-Module
- [ ] `.factory/policies/`-Verzeichnis enthält 7 Richtliniendokumente
## Detaillierte Erklärung der generierten Dateien

### config.yaml: Projektkonfiguration

`config.yaml` enthält die grundlegenden Informationen und den Pipeline-Status des Projekts:

```yaml
project:
  name: my-app                  # Projektname
  description: ""                # Projektbeschreibung
  created_at: "2026-01-30T00:00:00.000Z"  # Erstellungszeit
  updated_at: "2026-01-30T00:00:00.000Z"  # Aktualisierungszeit

pipeline:
  current_stage: null           # Aktuelle Ausführungsphase
  completed_stages: []          # Liste der abgeschlossenen Phasen
  last_checkpoint: null         # Letzter Checkpoint

settings:
  auto_save: true               # Automatisches Speichern
  backup_on_error: true        # Backup bei Fehlern
```

::: tip Konfiguration ändern

Sie können `config.yaml` direkt nach `factory init` bearbeiten, und die Änderungen werden automatisch während der Pipeline-Ausführung wirksam. Eine erneute Initialisierung ist nicht erforderlich.

:::

### state.json: Pipeline-Status

`state.json` zeichnet den Ausführungsfortschritt der Pipeline auf:

```json
{
  "version": 1,
  "status": "idle",
  "current_stage": null,
  "completed_stages": [],
  "started_at": null,
  "last_updated": "2026-01-30T00:00:00.000Z"
}
```

- `status`: Aktueller Status (bei Initialisierung `idle`, wechselt dynamisch zu `running`, `waiting_for_confirmation`, `paused`, `failed` während der Ausführung)
- `current_stage`: Die gerade ausgeführte Phase
- `completed_stages`: Liste der abgeschlossenen Phasen

::: info Status-Erklärung

Die Pipeline wird mit einem Zustandsautomat ausgeführt. Bei der Initialisierung ist der Status `idle`. Andere Statuswerte werden während der Pipeline-Ausführung dynamisch gesetzt:
- `idle`: Wartet auf Start
- `running`: Führt gerade eine Phase aus
- `waiting_for_confirmation`: Wartet auf manuelle Bestätigung zum Fortfahren, Wiederholen oder Pausieren
- `paused`: Manuelles Pausieren
- `failed`: Fehler erkannt, manuelles Eingreifen erforderlich

:::

::: warning Nicht manuell bearbeiten

`state.json` wird automatisch von der Pipeline verwaltet. Manuelles Bearbeiten kann zu inkonsistenten Zuständen führen. Verwenden Sie zum Zurücksetzen den Befehl `factory reset`.

:::

### pipeline.yaml: Pipeline-Definition

Definiert die Ausführungsreihenfolge und Abhängigkeiten der 7 Phasen:

```yaml
stages:
  - id: bootstrap
    description: Projektidee initialisieren
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs: [input/idea.md]

  - id: prd
    description: Produktanforderungsdokument erstellen
    agent: agents/prd.agent.md
    inputs: [input/idea.md]
    outputs: [artifacts/prd/prd.md]

  # ... andere Phasen
```

::: info Pipeline-Reihenfolge

Die Pipeline wird strikt sequenziell ausgeführt und kann nicht übersprungen werden. Nach Abschluss jeder Phase wird pausiert und auf Bestätigung gewartet.

:::

### .claude/settings.local.json: Berechtigungskonfiguration

Automatisch generierte Claude Code-Berechtigungskonfiguration, die Folgendes enthält:

- **Dateioperationen-Berechtigungen**: Read/Write/Glob/Edit für das Projektverzeichnis
- **Bash-Befehls-Berechtigungen**: git, npm, npx, docker usw.
- **Skills-Berechtigungen**: superpowers, ui-ux-pro-max und andere erforderliche Skills
- **WebFetch-Berechtigungen**: Erlaubt den Zugriff auf bestimmte Domains (GitHub, NPM usw.)

::: danger Sicherheit

Die Berechtigungskonfiguration gilt nur für das aktuelle Projektverzeichnis und beeinträchtigt keine anderen Positionen im System. Dies ist eines der Sicherheitskonzepte von Factory.

:::
## Häufige Probleme und Lösungen

### Verzeichnis ist nicht leer

**Fehlermeldung**:

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

**Ursache**: Das Verzeichnis enthält inkompatible Dateien oder Verzeichnisse (z. B. `artifacts/`, `input/` usw.)

**Lösung**:

1. Konfliktdateien bereinigen:
   ```bash
   rm -rf artifacts/ input/
   ```

2. Oder ein neues Verzeichnis verwenden:
   ```bash
   mkdir my-app-new && cd my-app-new
   factory init
   ```

### Bereits ein Factory-Projekt

**Fehlermeldung**:

```
This directory is already a Factory project:
  Name: my-app
  Created: 2026-01-29T13:00:00.000Z

To reset project, use: factory reset
```

**Ursache**: Das `.factory/`-Verzeichnis ist bereits vorhanden

**Lösung**:

```bash
# Projektstatus zurücksetzen (Artefakte behalten)
factory reset

# Oder vollständig neu initialisieren (alles löschen)
rm -rf .factory/
factory init
```

### Claude Code nicht installiert

**Fehlermeldung**:

```
Claude CLI not found - skipping plugin installation
Install Claude Code to enable plugins: https://claude.ai/code
```

**Ursache**: Claude Code CLI ist nicht installiert

**Lösung**:

1. Claude Code installieren: https://claude.ai/code
2. Oder die Pipeline manuell ausführen (siehe [Schnellstart](../getting-started/))

### Plugin-Installation fehlgeschlagen

**Fehlermeldung**:

```
Installing superpowers plugin... (failed)
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

**Ursache**: Netzwerkprobleme oder Claude Code-Konfigurationsprobleme

**Lösung**:

Ignorieren Sie die Warnung und fahren Sie fort. Die Bootstrap-Phase wird Sie auffordern, das Plugin manuell zu installieren.

## Zusammenfassung

In dieser Lektion haben Sie gelernt:

1. ✅ Verwendung des Befehls `factory init` zum Initialisieren eines Factory-Projekts
2. ✅ Verständnis der generierten `.factory/`-Verzeichnisstruktur
3. ✅ Kenntnis der Konfigurationsoptionen in `config.yaml`
4. ✅ Verständnis der Statusverwaltung in `state.json`
5. ✅ Kenntnis der Berechtigungskonfiguration in `.claude/settings.local.json`

Nach Abschluss der Initialisierung ist das Projekt bereit für die Pipeline-Ausführung. Im nächsten Schritt lernen wir die [Pipeline-Übersicht](../pipeline-overview/) kennen, um den vollständigen Prozess von der Idee zur Anwendung zu verstehen.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Pipeline-Übersicht](../pipeline-overview/)** kennen.
>
> Sie werden lernen:
> - Die Reihenfolge und Abhängigkeiten der 7 Phasen
> - Die Eingaben und Ausgaben jeder Phase
> - Wie der Checkpoint-Mechanismus die Qualität sicherstellt
> - Fehlerbehandlung und Wiederholungsstrategien

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-29

| Funktion        | Dateipfad                                                                                    | Zeilen  |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| init Hauptlogik | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 220-456  |
| Verzeichnis-Sicherheitsprüfung | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 32-53    |
| Konfigurationsgenerierung    | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 58-76    |
| Claude-Berechtigungskonfiguration | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 41-248   |
| Pipeline-Definition  | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)               | 7-111    |
| Projektkonfigurations-Template | [`config.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/config.yaml)                   | 1-102    |

**Wichtige Funktionen**:
- `isFactoryProject()`: Prüft, ob das Verzeichnis bereits ein Factory-Projekt ist (Zeilen 22-26)
- `isDirectorySafeToInit()`: Prüft, ob das Verzeichnis sicher initialisiert werden kann (Zeilen 32-53)
- `generateConfig()`: Generiert die Projektkonfiguration (Zeilen 58-76)
- `generateClaudeSettings()`: Generiert die Claude Code-Berechtigungskonfiguration (Zeilen 256-275)

</details>
