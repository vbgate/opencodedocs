---
title: "OpenCode und andere KI-Assistenten: 3 Methoden zum Ausführen der Pipeline | Agent App Factory Tutorial"
sidebarTitle: "3 Ausführungsmethoden"
subtitle: "OpenCode und andere KI-Assistenten: 3 Methoden zum Ausführen der Pipeline"
description: "Erfahren Sie, wie Sie OpenCode, Cursor und andere KI-Assistenten zum Ausführen der Agent App Factory Pipeline verwenden. Dieses Tutorial erklärt detailliert die verschiedenen Startmethoden, Befehlsformate, Anwendungsfälle und Fehlerbehebung für unterschiedliche KI-Assistenten. Es hilft Entwicklern, basierend auf ihren persönlichen Gewohnheiten und Projektanforderungen den optimalen KI-Assistenten auszuwählen und den gesamten Anwendungsgenerierungsprozess effizient durchzuführen."
tags:
  - "KI-Assistent"
  - "OpenCode"
  - "Cursor"
  - "Pipeline-Ausführung"
prerequisite:
  - "start-installation"
order: 60
---

# OpenCode und andere KI-Assistenten: 3 Methoden zum Ausführen der Pipeline

## Was Sie nach diesem Tutorial können

- ✅ Factory Pipeline mit OpenCode starten und ausführen
- ✅ Pipeline mit Cursor ausführen
- ✅ Die Befehlsformate verschiedener KI-Assistenten verstehen
- ✅ Den passenden KI-Assistenten für verschiedene Szenarien auswählen

## Ihre aktuelle Situation

Sie haben ein Factory Projekt initialisiert, wissen aber nicht, wie Sie die Pipeline mit anderen KI-Assistenten außer Claude Code ausführen können. OpenCode und Cursor sind beliebte KI-Programmierassistenten - können sie die Factory Pipeline ausführen? Welche Unterschiede gibt es bei den Startmethoden und Befehlsformaten?

## Wann Sie diese Anleitung verwenden

| KI-Assistent | Empfohlene Anwendungsszenarien | Vorteile |
| ------------ | ------------------------------ | -------- |
| **Claude Code** | Stabilste Agent-Modus-Erfahrung | Native Agent-Modus-Unterstützung, klares Befehlsformat |
| **OpenCode** | Multi-Plattform-Nutzer, flexible KI-Tools | Cross-Plattform, Agent-Modus-Unterstützung |
| **Cursor** | VS Code-Nutzer, VS Code-Ökosystem | Hohe Integration, nahtloser Wechsel |

::: tip Grundprinzip
Die Ausführungslogik aller KI-Assistenten ist identisch: **Agent-Definition lesen → Pipeline ausführen → Ausgabe generieren**. Der Unterschied liegt nur in der Startmethode und dem Befehlsformat.
:::

## Vorbereitung

Bevor Sie beginnen, stellen Sie sicher, dass:

- ✅ Die [Installation und Konfiguration](../../start/installation/) abgeschlossen ist
- ✅ Das Projekt mit `factory init` initialisiert wurde
- ✅ OpenCode oder Cursor (mindestens einer) installiert ist

## Grundkonzept: KI-Assistenten als Pipeline-Ausführungs-Engine

**KI-Assistenten** sind die Ausführungs-Engine der Pipeline und verantwortlich für das Interpretieren der Agent-Definitionen und das Generieren der Ausgabe. Der grundlegende Arbeitsablauf umfasst fünf Schritte: Zuerst `.factory/pipeline.yaml` lesen, um die Phasenreihenfolge zu verstehen, dann den Scheduler laden, um Ausführungsbeschränkungen und Berechtigungsprüfungsregeln zu verstehen, danach die entsprechende Agent-Definitionsdatei basierend auf dem aktuellen Status laden, anschließend die Agent-Anweisungen ausführen, um die Ausgabe zu generieren und die Exit-Bedingungen zu verifizieren, und schließlich auf die Benutzerbestätigung warten, um mit der nächsten Phase fortzufahren.

::: info Wichtig: KI-Assistenten müssen den Agent-Modus unterstützen
Factory Pipeline basiert auf der Fähigkeit von KI-Assistenten, komplexe Markdown-Anweisungen zu verstehen und auszuführen. Alle unterstützten KI-Assistenten (Claude Code, OpenCode, Cursor) verfügen über Agent-Modus-Fähigkeiten.
:::

## Anleitung

### Schritt 1: Pipeline mit OpenCode ausführen

#### Automatischer Start (empfohlen)

Wenn Sie OpenCode CLI global installiert haben:

```bash
# Im Projekt-Root-Verzeichnis ausführen
factory init
```

`factory init` erkennt und startet OpenCode automatisch und übergibt den folgenden Prompt:

```text
Bitte lesen Sie .factory/pipeline.yaml und .factory/agents/orchestrator.checkpoint.md, starten Sie die Pipeline und helfen Sie mir, Produktideen-Fragmente in eine ausführbare Anwendung zu transformieren. Ich werde gleich Produktideen-Fragmente eingeben. Hinweis: Die von Agenten referenzierten skills/ und policies/ Dateien müssen zuerst im .factory/ Verzeichnis gesucht werden, dann im Stammverzeichnis.
```

**Sie sollten sehen**:
- Im Terminal wird `Starting OpenCode...` angezeigt
- Das OpenCode-Fenster öffnet sich automatisch
- Der Prompt wurde automatisch in das Eingabefeld eingefügt

#### Manuelle Starts

Wenn der automatische Start fehlschlägt, können Sie manuell vorgehen:

1. Öffnen Sie die OpenCode-Anwendung
2. Öffnen Sie Ihr Factory Projektverzeichnis
3. Kopieren Sie den folgenden Prompt in das OpenCode-Eingabefeld:

```text
Bitte lesen Sie .factory/pipeline.yaml und .factory/agents/orchestrator.checkpoint.md, starten Sie die Pipeline und helfen Sie mir, Produktideen-Fragmente in eine ausführbare Anwendung zu transformieren. Ich werde gleich Produktideen-Fragmente eingeben. Hinweis: Die von Agenten referenzierten skills/ policies/ Dateien müssen zuerst im .factory/ Verzeichnis gesucht werden, dann im Stammverzeichnis.
```

4. Drücken Sie Enter zur Ausführung

#### Pipeline fortsetzen

Wenn die Pipeline bereits in einer bestimmten Phase läuft, können Sie den Befehl `factory run` verwenden, um fortzufahren:

```bash
# Aktuellen Status anzeigen und Befehle generieren
factory run

# Oder von einer bestimmten Phase starten
factory run prd
```

OpenCode zeigt ähnliche Anweisungen wie Claude Code an:

```
🤖 AI Assistant Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Please:

1. Read .factory/pipeline.yaml
2. Read .factory/agents/orchestrator.checkpoint.md
3. Read .factory/config.yaml
4. Execute pipeline from: bootstrap

Note: Check .factory/ first for skills/policies/ references, then root directory.
```

### Schritt 2: Pipeline mit Cursor ausführen

Cursor ist ein KI-Programmierassistent basierend auf VS Code, der die Composer-Funktion verwendet, um die Factory Pipeline auszuführen.

#### Cursor erkennen

Die Factory CLI erkennt automatisch die Cursor-Umgebung (über die Umgebungsvariablen `CURSOR` oder `CURSOR_API_KEY`).

#### Composer verwenden

1. Öffnen Sie Ihr Factory Projektverzeichnis in Cursor
2. Führen Sie den Befehl `factory run` aus:

```bash
factory run
```

3. Das Terminal zeigt Cursor-spezifische Anweisungen an:

```
🤖 Cursor Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Use Cursor Composer to:

1. @ReadFile .factory/pipeline.yaml
2. @ReadFile .factory/agents/orchestrator.checkpoint.md
3. @ReadFile .factory/config.yaml
   (Note: Check .factory/ first for skills/policies/ references)
4. Execute pipeline from: bootstrap
```

4. Kopieren Sie diese Anweisungen in das Cursor Composer-Eingabefeld
5. Führen Sie aus

#### Checkpoint ✅

- Das Cursor Composer-Fenster ist geöffnet
- Die Pipeline beginnt mit der Ausführung und zeigt die aktuelle Phase (z.B. `Running: bootstrap`)
- Die Ausgabe wird generiert (z.B. `input/idea.md`)

### Schritt 3: Die Befehlsformate verschiedener KI-Assistenten verstehen

Obwohl die Ausführungslogik identisch ist, unterscheiden sich die Befehlsformate der verschiedenen KI-Assistenten geringfügig:

| Operation | Claude Code Format | Cursor Format | Andere KI-Assistenten (OpenCode usw.) |
| --------- | ------------------ | ------------- | -------------------------------------- |
| Datei lesen | `Read(filePath)` | `@ReadFile filePath` | `Read filePath` |
| Mehrere Dateien lesen | `Read(file1)`, `Read(file2)` | `@ReadFile file1`, `@ReadFile file2` | - |
| Datei schreiben | `Write(filePath, content)` | Direktes Schreiben | - |
| Bash-Befehl ausführen | `Bash(command)` | Direkte Ausführung | - |

::: tip Factory CLI verarbeitet automatisch
Wenn Sie `factory run` ausführen, erkennt die CLI automatisch den aktuellen KI-Assistententyp und generiert das entsprechende Befehlsformat. Sie müssen nur kopieren und einfügen, keine manuelle Konvertierung erforderlich.
:::

### Schritt 4: Von einer bestimmten Phase fortsetzen

Wenn die Pipeline bereits einige Phasen abgeschlossen hat, können Sie von einer beliebigen Phase fortsetzen:

```bash
# Von der UI-Phase starten
factory run ui

# Von der Tech-Phase starten
factory run tech

# Von der Code-Phase starten
factory run code
```

Die Factory CLI zeigt den aktuellen Pipeline-Status an:

```
Pipeline Status:
───────────────────────
Project: my-app
Status: Running
Current Stage: ui
Completed: bootstrap, prd

Available stages:
  ✓ bootstrap
  ✓ prd
  → ui
  ○ tech
  ○ code
  ○ validation
  ○ preview
```

### Schritt 5: Token sparen mit factory continue (nur Claude Code)

::: warning Hinweis
Der Befehl `factory continue` unterstützt derzeit nur **Claude Code**. Wenn Sie OpenCode oder Cursor verwenden, starten Sie bitte direkt mit `factory run` eine neue Sitzung.
:::

Um Token zu sparen und eine Kontextansammlung zu vermeiden, unterstützt Claude Code die Ausführung in mehreren Sitzungen:

```bash
# Neues Terminal-Fenster öffnen, ausführen
factory continue
```

**Ausführungseffekt**:
- Aktuellen Status lesen (`.factory/state.json`)
- Automatisch ein neues Claude Code-Fenster öffnen
- Von der zuletzt pausierten Phase fortsetzen

**Anwendungsszenarien**:
- Bootstrap → PRD abgeschlossen, neue Sitzung für UI-Phase erstellen
- UI → Tech abgeschlossen, neue Sitzung für Code-Phase erstellen
- Jede Situation, in der eine lange Dialog-Historie vermieden werden soll

## Fallstricke und Hinweise

### Problem 1: OpenCode-Start fehlgeschlagen

**Symptom**: Nach Ausführung von `factory init` startet OpenCode nicht automatisch.

**Ursachen**:
- OpenCode CLI wurde nicht zum PATH hinzugefügt
- OpenCode ist nicht installiert

**Lösungen**:

```bash
# OpenCode manuell starten
# Windows
%LOCALAPPDATA%\Programs\OpenCode\OpenCode.exe

# macOS
/Applications/OpenCode.app

# Linux (nach Priorität suchen: zuerst /usr/bin/opencode, dann /usr/local/bin/opencode)
/usr/bin/opencode
# Wenn der obige Pfad nicht existiert, versuchen:
/usr/local/bin/opencode
```

Kopieren Sie dann manuell den Prompt und fügen Sie ihn in OpenCode ein.

### Problem 2: Cursor Composer erkennt Anweisungen nicht

**Symptom**: Die von `factory run` generierten Anweisungen wurden in Cursor Composer kopiert, aber es gibt keine Reaktion.

**Ursachen**:
- Die `@ReadFile`-Syntax von Cursor Composer muss exakt übereinstimmen
- Der Dateipfad könnte falsch sein

**Lösungen**:
1. Bestätigen Sie, dass Sie `@ReadFile` und nicht `Read` oder `ReadFile` verwenden
2. Bestätigen Sie, dass der Dateipfad relativ zum Projekt-Root-Verzeichnis ist
3. Versuchen Sie absolute Pfade

**Beispiele**:

```text
# ✅ Richtig
@ReadFile .factory/pipeline.yaml

# ❌ Falsch
Read(.factory/pipeline.yaml)
@readfile .factory/pipeline.yaml
```

### Problem 3: Agent kann Skill-Dateien nicht referenzieren

**Symptom**: Agent meldet, dass `skills/bootstrap/skill.md` oder `policies/failure.policy.md` nicht gefunden werden können.

**Ursachen**:
- Falsche Suchreihenfolge für Pfade
- Sowohl `.factory/` als auch Root-Verzeichnis `skills/`, `policies/` existieren im Projekt

**Lösungen**:
Alle KI-Assistenten folgen der gleichen Suchreihenfolge:

1. **Priorität** `.factory/skills/` und `.factory/policies/`
2. **Fallback** auf Root-Verzeichnis `skills/` und `policies/`

Stellen Sie sicher, dass:
- Nach der Factory-Projektinitialisierung `skills/` und `policies/` nach `.factory/` kopiert wurden
- Die Agent-Definition explizit darauf hinweist: "Zuerst `.factory/` Verzeichnis suchen, dann das Stammverzeichnis"

### Problem 4: Pipeline-Status nicht synchronisiert

**Symptom**: Der KI-Assistent zeigt eine abgeschlossene Phase an, aber `factory run` zeigt immer noch den Status `running`.

**Ursachen**:
- Der KI-Assistent hat `state.json` aktualisiert, aber der CLI-Status ist inkonsistent
- Möglicherweise haben mehrere Fenster gleichzeitig die Statusdatei geändert

**Lösungen**:
```bash
# Projektstatus zurücksetzen
factory reset

# Pipeline neu ausführen
factory run
```

::: tip Best Practice
Vermeiden Sie es, die Pipeline desselben Projekts gleichzeitig in mehreren KI-Assistenten-Fenstern auszuführen. Dies führt zu Statuskonflikten und Ausgabeüberschreibungen.
:::

## Zusammenfassung

In diesem Tutorial haben Sie gelernt, wie Sie OpenCode, Cursor und andere KI-Assistenten zum Ausführen der Factory Pipeline verwenden:

**Kernpunkte**:
- ✅ Factory unterstützt verschiedene KI-Assistenten (Claude Code, OpenCode, Cursor)
- ✅ `factory init` erkennt und startet automatisch den verfügbaren KI-Assistenten
- ✅ `factory run` generiert entsprechende Befehle basierend auf dem aktuellen KI-Assistenten
- ✅ `factory continue` (nur Claude Code) unterstützt die Ausführung in mehreren Sitzungen und spart Token
- ✅ Alle KI-Assistenten folgen derselben Ausführungslogik, nur die Befehlsformate unterscheiden sich

**Wichtige Dateien**:
- `.factory/pipeline.yaml` —— Pipeline-Definition
- `.factory/agents/orchestrator.checkpoint.md` —— Scheduler-Regeln
- `.factory/state.json` —— Pipeline-Status

**Empfehlungen**:
- Claude Code: Stabilste Agent-Modus-Erfahrung (empfohlen)
- OpenCode: Bevorzugt für Cross-Plattform-Nutzer
- Cursor: Für VS Code-Nutzer

## Nächstes Tutorial

> Im nächsten Tutorial lernen wir die **[Installation der erforderlichen Plugins](../plugins/)**.
>
> Sie werden lernen:
> - Warum superpowers und ui-ux-pro-max Plugins installiert werden müssen
> - Wie Plugins automatisch oder manuell installiert werden
> - Was bei fehlgeschlagener Plugin-Installation zu tun ist

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisierungsdatum: 2026-01-29

| Funktion | Dateipfad | Zeilennummern |
| -------- | --------- | ------------- |
| OpenCode-Start | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Claude Code-Start | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| KI-Assistenten-Erkennung | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L105-L124) | 105-124 |
| Befehlsgenerierung | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L130-L183) | 130-183 |

**Wichtige Konstanten**:
- `CLAUDE_CODE` / `ANTHROPIC_API_KEY`: Claude Code Umgebungsvariablen-Erkennung (run.js:109-110)
- `CURSOR` / `CURSOR_API_KEY`: Cursor Umgebungsvariablen-Erkennung (run.js:114-115)
- `OPENCODE` / `OPENCODE_VERSION`: OpenCode Umgebungsvariablen-Erkennung (run.js:119-120)

**Wichtige Funktionen**:
- `launchClaudeCode(projectDir)`: Claude Code starten und Prompt übergeben (init.js:119-147)
- `launchOpenCode(projectDir)`: OpenCode starten, unterstützt CLI und ausführbare Dateien (init.js:152-215)
- `detectAIAssistant()`: Aktuellen KI-Assistententyp durch Umgebungsvariablen erkennen (run.js:105-124)
- `getAssistantInstructions(assistant, ...)`: Entsprechende Befehle basierend auf KI-Assistententyp generieren (run.js:130-183)

</details>
