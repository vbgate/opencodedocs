---
title: "CLI-Befehlsreferenz: Vollständige Befehlsliste und Parameter | Agent App Factory Tutorial"
sidebarTitle: "CLI-Befehlsübersicht"
subtitle: "CLI-Befehlsreferenz: Vollständige Befehlsliste und Parameterbeschreibung"
description: "Vollständige Referenz der Agent App Factory CLI-Befehle, einschließlich der Parameterbeschreibungen und Verwendungsbeispiele für die sechs Befehle init, run, continue, status, list und reset, damit du die Befehlszeilentools schnell beherrschst."
tags:
  - "CLI"
  - "Befehlszeile"
  - "Referenz"
order: 210
---

# CLI-Befehlsreferenz: Vollständige Befehlsliste und Parameterbeschreibung

Dieses Kapitel bietet eine vollständige Befehlsreferenz für die CLI-Tools der Agent App Factory.

## Befehlsübersicht

| Befehl | Funktion | Anwendungsszenario |
| --- | --- | --- |
| `factory init` | Factory-Projekt initialisieren | Neues Projekt starten |
| `factory run [stage]` | Pipeline ausführen | Pipeline ausführen oder fortsetzen |
| `factory continue` | Neue Sitzung fortsetzen | Token sparen, sitzungsbasierte Ausführung |
| `factory status` | Projektstatus anzeigen | Aktuellen Fortschritt anzeigen |
| `factory list` | Alle Projekte auflisten | Mehrere Projekte verwalten |
| `factory reset` | Projektstatus zurücksetzen | Pipeline neu starten |

---

## factory init

Initialisiert das aktuelle Verzeichnis als Factory-Projekt.

### Syntax

```bash
factory init [options]
```

### Parameter

| Parameter | Kurzform | Typ | Pflicht | Beschreibung |
| --- | --- | --- | --- | --- |
| `--name` | `-n` | string | Nein | Projektname |
| `--description` | `-d` | string | Nein | Projektbeschreibung |

### Funktionsbeschreibung

Nach der Ausführung des Befehls `factory init` werden folgende Schritte durchgeführt:

1. Verzeichnissicherheitsprüfung (nur Konfigurationsdateien wie `.git`, `.gitignore`, `README.md` zulässig)
2. `.factory/`-Verzeichnis erstellen
3. Folgende Dateien in `.factory/` kopieren:
   - `agents/` - Agent-Definitionsdateien
   - `skills/` - Fertigkeitsmodule
   - `policies/` - Richtliniendokumente
   - `templates/` - Konfigurationsvorlagen
   - `pipeline.yaml` - Pipeline-Definition
4. `config.yaml` und `state.json` generieren
5. `.claude/settings.local.json` generieren (Claude Code-Berechtigungskonfiguration)
6. Versuchen, erforderliche Plugins zu installieren:
   - superpowers (wird für die Bootstrap-Phase benötigt)
   - ui-ux-pro-max-skill (wird für die UI-Phase benötigt)
7. KI-Assistent automatisch starten (Claude Code oder OpenCode)

### Beispiele

**Projekt initialisieren und Name und Beschreibung angeben**:

```bash
factory init --name "Todo App" --description "Eine einfache Todo-Anwendung"
```

**Projekt im aktuellen Verzeichnis initialisieren**:

```bash
factory init
```

### Hinweise

- Das Verzeichnis muss leer sein oder nur Konfigurationsdateien enthalten (`.git`, `.gitignore`, `README.md`)
- Wenn bereits ein `.factory/`-Verzeichnis existiert, wird aufgefordert, `factory reset` zum Zurücksetzen zu verwenden

---

## factory run

Führt die Pipeline ab der aktuellen Phase oder der angegebenen Phase aus.

### Syntax

```bash
factory run [stage] [options]
```

### Parameter

| Parameter | Kurzform | Typ | Pflicht | Beschreibung |
| --- | --- | --- | --- | --- |
| `stage` | - | string | Nein | Phasenname der Pipeline (bootstrap/prd/ui/tech/code/validation/preview) |

### Optionen

| Option | Kurzform | Typ | Beschreibung |
| --- | --- | --- | --- |
| `--force` | `-f` | flag | Bestätigungsaufforderung überspringen |

### Funktionsbeschreibung

Nach der Ausführung des Befehls `factory run` werden folgende Schritte durchgeführt:

1. Überprüfen, ob es sich um ein Factory-Projekt handelt
2. `config.yaml` und `state.json` lesen
3. Aktuellen Pipeline-Status anzeigen
4. Zielphase bestimmen (durch Parameter angegeben oder aktuelle Phase)
5. KI-Assistent-Typ erkennen (Claude Code / Cursor / OpenCode)
6. Ausführungsbefehle für den entsprechenden Assistenten generieren
7. Verfügbare Phasenliste und Fortschritt anzeigen

### Beispiele

**Pipeline ab der bootstrap-Phase starten**:

```bash
factory run bootstrap
```

**Ab der aktuellen Phase fortsetzen**:

```bash
factory run
```

**Ohne Bestätigung direkt ausführen**:

```bash
factory run bootstrap --force
```

### Ausgabebispiel

```
Agent Factory - Pipeline Runner

Pipeline Status:
───────────────────────────────────────
Project: Todo App
Status: Running
Current Stage: bootstrap
Completed: 

🤖 Claude Code Instructions:
─────────────────────────
This is an Agent Factory project. To execute the pipeline:

1. Read pipeline definition:
   Read(/path/to/.factory/pipeline.yaml)

2. Read orchestrator agent:
   Read(/path/to/.factory/agents/orchestrator.checkpoint.md)

3. Read project config:
   Read(/path/to/.factory/config.yaml)

Then execute the pipeline starting from: bootstrap

───────────────────────────────────────
Available stages:
  ○ bootstrap
  ○ prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

───────────────────────────────────────
Ready! Follow instructions above to continue.
```

---

## factory continue

Neue Sitzung starten, um die Pipeline weiter auszuführen, Token sparen.

### Syntax

```bash
factory continue
```

### Funktionsbeschreibung

Nach der Ausführung des Befehls `factory continue` werden folgende Schritte durchgeführt:

1. Überprüfen, ob es sich um ein Factory-Projekt handelt
2. `state.json` lesen, um den aktuellen Status zu erhalten
3. Claude Code-Berechtigungskonfiguration neu generieren
4. Neues Claude Code-Fenster starten
5. Ab der aktuellen Phase weiter ausführen

### Anwendungsszenarien

- Vermeidung von Token-Akkumulation nach Abschluss jeder Phase
- Jede Phase verfügt über einen sauberen Kontext
- Unterstützung der Unterbrechungswiederherstellung

### Beispiele

**Pipeline weiter ausführen**:

```bash
factory continue
```

### Hinweise

- Claude Code muss installiert sein
- Öffnet automatisch ein neues Claude Code-Fenster

---

## factory status

Zeigt den detaillierten Status des aktuellen Factory-Projekts an.

### Syntax

```bash
factory status
```

### Funktionsbeschreibung

Nach der Ausführung des Befehls `factory status` werden folgende Informationen angezeigt:

- Projektname, Beschreibung, Pfad, Erstellungszeit
- Pipeline-Status (idle/running/waiting_for_confirmation/paused/failed/completed)
- Aktuelle Phase
| Parameter | Kurzform | Typ | Pflicht | Beschreibung |
| --- | --- | --- | --- | --- |
| `--force` | `-f` | flag | Bestätigung überspringen |

### Funktionsbeschreibung

Nach der Ausführung des Befehls `factory reset` werden folgende Schritte durchgeführt:

1. Überprüfen, ob es sich um ein Factory-Projekt handelt
2. Aktuellen Status anzeigen
3. Bestätigung zum Zurücksetzen anfordern (außer mit `--force`)
4. `state.json` auf den Anfangszustand zurücksetzen
5. Pipeline-Abschnitt von `config.yaml` aktualisieren
6. Alle `artifacts/`-Artefakte beibehalten

### Anwendungsszenarien

- Neu ab der bootstrap-Phase beginnen
| Option | Kurzform | Typ | Beschreibung |
| --- | --- | --- | --- |
| `--force` | `-f` | flag | Bestätigung überspringen |

### Funktionsbeschreibung

Nach der Ausführung des Befehls `factory reset` werden folgende Schritte durchgeführt:

1. Überprüfen, ob es sich um ein Factory-Projekt handelt
2. Aktuellen Status anzeigen
3. Bestätigung zum Zurücksetzen anfordern (außer mit `--force`)
4. `state.json` auf den Anfangszustand zurücksetzen
5. Pipeline-Abschnitt von `config.yaml` aktualisieren
6. Alle `artifacts/`-Artefakte beibehalten

### Anwendungsszenarien

- Neu ab der bootstrap-Phase beginnen
- Statusfehler bereinigen
- Pipeline neu konfigurieren

### Beispiele

**Projektstatus zurücksetzen**:

```bash
factory reset
```

**Ohne Bestätigung direkt zurücksetzen**:

```bash
factory reset --force
```

### Hinweise

- Setzt nur den Pipeline-Status zurück, Artefakte werden nicht gelöscht
- Um das Projekt vollständig zu löschen, müssen die Verzeichnisse `.factory/` und `artifacts/` manuell gelöscht werden

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Letzte Aktualisierung: 2026-01-29

| Befehl | Dateipfad | Zeile |
| --- | --- | --- |
| CLI-Einstiegspunkt | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 17-122 |
| init-Befehl | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| run-Befehl | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-335 |
| continue-Befehl | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |
| status-Befehl | [`cli/commands/status.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/status.js) | 1-203 |
| list-Befehl | [`cli/commands/list.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/list.js) | 1-160 |
| reset-Befehl | [`cli/commands/reset.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/reset.js) | 1-100 |

**Schlüsselfunktionen**:
- `getFactoryRoot()` - Factory-Stammverzeichnis abrufen (factory.js:22-52)
- `isFactoryProject()` - Überprüfen, ob es sich um ein Factory-Projekt handelt (init.js:22-26)
- `generateConfig()` - Projektkonfiguration generieren (init.js:58-76)
- `launchClaudeCode()` - Claude Code starten (init.js:119-147)
- `launchOpenCode()` - OpenCode starten (init.js:152-215)
- `detectAIAssistant()` - KI-Assistent-Typ erkennen (run.js:105-124)
- `updateState()` - Pipeline-Status aktualisieren (run.js:94-100)

**Abhängigkeitsbibliotheken**:
- `commander` - CLI-Argument-Parsing
- `chalk` - Farbausgabe im Terminal
- `ora` - Ladeanimation
- `inquirer` - Interaktive Eingabeaufforderungen
- `yaml` - YAML-Datei-Parsing
- `fs-extra` - Dateisystemoperationen

</details>
