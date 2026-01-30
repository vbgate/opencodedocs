---
title: "Claude Code-Integration: Berechtigungen konfigurieren für Pipeline-Ausführung | AI App Factory Tutorial"
sidebarTitle: "Claude Code in 5 Minuten konfigurieren"
subtitle: "Claude Code-Integration: Berechtigungen konfigurieren für Pipeline-Ausführung | AI App Factory Tutorial"
description: "Lernen Sie, wie Sie Claude Code-Berechtigungen konfigurieren, um AI App Factory-Pipelines sicher auszuführen. Verstehen Sie die automatisch generierte settings.local.json, Whitelist-Mechanismen und Cross-Platform-Berechtigungskonfigurationsbest Practices, ohne den gefährlichen Parameter --dangerously-skip-permissions zu verwenden. Dieses Tutorial deckt Windows/macOS/Linux-Pfadbehandlung und die Behebung häufiger Berechtigungsfehler ab."
tags:
  - "Claude Code"
  - "Berechtigungskonfiguration"
  - "KI-Assistent"
prerequisite:
  - "start-installation"
  - "start-init-project"
order: 50
---

# Claude Code-Integration: Berechtigungen konfigurieren für Pipeline-Ausführung | AI App Factory Tutorial

## Was Sie nach diesem Tutorial können

- Claude Code-Sicherheitsberechtigungen konfigurieren, ohne `--dangerously-skip-permissions` zu verwenden
- Die automatisch von Factory generierte Berechtigungs-Whitelist verstehen
- Die vollständige 7-Phasen-Pipeline in Claude Code ausführen
- Cross-Platform-Berechtigungskonfiguration beherrschen (Windows/macOS/Linux)

## Ihre aktuelle Herausforderung

Bei der ersten Verwendung von Factory können folgende Probleme auftreten:

- **Berechtigungen blockiert**: Claude Code zeigt "Keine Berechtigung zum Lesen der Datei"
- **Verwendung gefährlicher Parameter**: Gezwungen, `--dangerously-skip-permissions` hinzuzufügen, um Sicherheitsprüfungen zu umgehen
- **Manuelle Konfiguration umständlich**: Unklarheit darüber, welche Aktionen erlaubt werden sollten
- **Cross-Platform-Probleme**: Inkonsistente Berechtigungen für Windows- und Unix-Pfade

Tatsächlich **generiert Factory automatisch** eine vollständige Berechtigungskonfiguration. Sie müssen diese nur korrekt verwenden.

## Wann Sie diese Methode verwenden sollten

Wenn Sie Factory-Pipelines in Claude Code ausführen müssen:

- Nach der Initialisierung des Projekts mit `factory init` (automatischer Start)
- Bei Verwendung von `factory run` zur Fortsetzung der Pipeline
- Bei manuellem Start von Claude Code

::: info Warum wird Claude Code empfohlen?
Claude Code ist der offizielle AI-Programmierassistent von Anthropic und tief in das Berechtigungssystem von Factory integriert. Im Vergleich zu anderen AI-Assistenten ist die Berechtigungsverwaltung von Claude Code präziser und sicherer.
:::

## Grundkonzept

Die Berechtigungskonfiguration von Factory verwendet einen **Whitelist-Mechanismus**: Nur explizit erlaubte Aktionen werden gestattet, alle anderen werden abgelehnt.

### Kategorien der Berechtigungs-Whitelist

| Kategorie | Erlaubte Aktionen | Verwendungszweck |
| --- | --- | --- |
| **Dateioperationen** | Read/Write/Edit/Glob | Lesen und Ändern von Projektdateien |
| **Git-Operationen** | git add/commit/push usw. | Versionskontrolle |
| **Verzeichnisoperationen** | ls/cd/tree/pwd | Durchsuchen der Verzeichnisstruktur |
| **Build-Tools** | npm/yarn/pnpm | Abhängigkeiten installieren, Skripte ausführen |
| **TypeScript** | tsc/npx tsc | Typprüfung |
| **Datenbanken** | npx prisma | Datenbankmigrationen und -verwaltung |
| **Python** | python/pip | UI-Designsystem |
| **Tests** | vitest/jest/test | Tests ausführen |
| **Factory CLI** | factory init/run/continue | Pipeline-Befehle |
| **Docker** | docker compose | Container-Deployment |
| **Web-Operationen** | WebFetch(domain:...) | API-Dokumentation abrufen |
| **Skills** | superpowers/ui-ux-pro-max | Plugin-Skills |

### Warum nicht `--dangerously-skip-permissions` verwenden?

| Methode | Sicherheit | Empfohlen |
| --- | --- | --- |
| `--dangerously-skip-permissions` | ❌ Erlaubt Claude beliebige Aktionen (einschließlich Dateilöschung) | Nicht empfohlen |
| Whitelist-Konfiguration | ✅ Nur explizit erlaubte Aktionen, Fehlermeldung bei unzulässigem Zugriff | Empfohlen |

Die Whitelist-Konfiguration ist zwar initial komplexer in der Einrichtung, wird aber nach der einmaligen Generierung automatisch wiederverwendet und ist sicherer.

## 🎒 Vorbereitungen vor dem Start

Stellen Sie vor dem Start sicher, dass:

- [x] **Installation und Konfiguration** abgeschlossen ist ([start/installation/](../../start/installation/))
- [x] **Factory-Projekt initialisieren** abgeschlossen ist ([start/init-project/](../../start/init-project/))
- [x] Claude Code installiert ist: https://claude.ai/code
- [x] Projektverzeichnis initialisiert ist (Verzeichnis `.factory/` existiert)

::: warning Überprüfen Sie die Claude Code-Installation
Führen Sie im Terminal folgenden Befehl aus:

```bash
claude --version
```

Wenn "command not found" angezeigt wird, installieren Sie Claude Code zuerst.
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Projekt initialisieren (Berechtigungen werden automatisch generiert)

**Warum**: `factory init` generiert automatisch `.claude/settings.local.json` mit der vollständigen Berechtigungs-Whitelist.

Führen Sie im Projektverzeichnis aus:

```bash
# Neues Verzeichnis erstellen und hineinwechseln
mkdir my-factory-project && cd my-factory-project

# Factory-Projekt initialisieren
factory init
```

**Sie sollten sehen**:

```
✓ Factory project initialized!
✓ Claude Code is starting...
  (Please wait for window to open)
```

Das Claude Code-Fenster öffnet sich automatisch und zeigt folgende Aufforderung:

```
Bitte lesen Sie .factory/pipeline.yaml und .factory/agents/orchestrator.checkpoint.md,
starten Sie die Pipeline und helfen Sie mir, Produktideenfragmente in eine ausführbare Anwendung zu verwandeln,
als nächstes werde ich die Ideenfragmente eingeben. Hinweis: Agent-verwendete skills/ und policies/
Dateien müssen zuerst im .factory/-Verzeichnis gesucht werden, dann im Root-Verzeichnis.
```

**Was passierte**:

1. Verzeichnis `.factory/` erstellt, enthält Pipeline-Konfiguration
2. `.claude/settings.local.json` generiert (Berechtigungs-Whitelist)
3. Claude Code automatisch gestartet, Startaufforderung übergeben

### Schritt 2: Berechtigungskonfiguration überprüfen

**Warum**: Bestätigen, dass die Berechtigungsdatei korrekt generiert wurde, um Laufzeitberechtigungsprobleme zu vermeiden.

Überprüfen Sie die generierte Berechtigungsdatei:

```bash
# Inhalt der Berechtigungsdatei anzeigen
cat .claude/settings.local.json
```

**Sie sollten sehen** (Ausschnitt):

```json
{
  "permissions": {
    "allow": [
      "Read(/path/to/project/**)",
      "Write(/path/to/project/**)",
      "Glob(/path/to/project/**)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(npm install:*)",
      "Bash(npx prisma generate:*)",
      "Skill(superpowers:brainstorming)",
      "Skill(ui-ux-pro-max)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.org)"
    ]
  },
  "features": {
    "autoSave": true,
    "telemetry": false
  }
}
```

::: tip Pfad-Erklärung
Pfade in Berechtigungen werden je nach Betriebssystem automatisch angepasst:

- **Windows**: `Read(//c/Users/...)` (sowohl Klein- als auch Großbuchstaben für Laufwerk werden unterstützt)
- **macOS/Linux**: `Read(/Users/...)` (absolute Pfade)
:::

### Schritt 3: Pipeline in Claude Code starten

**Warum**: Claude Code ist mit Berechtigungen konfiguriert und kann direkt Agent-Definitionen und Skill-Dateien lesen.

Geben Sie im geöffneten Claude Code-Fenster Ihre Produktidee ein:

```
Ich möchte eine mobile Buchhaltungs-App erstellen, die jungen Menschen hilft,
 tägliche Ausgaben schnell zu erfassen,
 damit sie nicht am Monatsende über ihre Mittel kommen. Hauptfunktionen sind: Betrag erfassen, Kategorie auswählen (Essen, Transport, Unterhaltung, Sonstiges),
Gesamtausgaben des Monats anzeigen.
```

**Sie sollten sehen**:

Claude Code führt folgende Schritte aus (automatisch abgeschlossen):

1. Liest `.factory/pipeline.yaml`
2. Liest `.factory/agents/orchestrator.checkpoint.md`
3. Startet die **Bootstrap-Phase**, strukturiert Ihre Idee in `input/idea.md`
4. Pausiert nach Abschluss, wartet auf Ihre Bestätigung

**Checkpoint ✅**: Bootstrap-Phase abgeschlossen bestätigen

```bash
# Generierte strukturierte Idee anzeigen
cat input/idea.md
```

### Schritt 4: Pipeline fortsetzen

**Warum**: Jede Phase muss nach Abschluss manuell bestätigt werden, um Fehlerakkumulation zu vermeiden.

Antworten Sie in Claude Code:

```
Fortfahren
```

Claude Code wechselt automatisch in die nächste Phase (PRD) und wiederholt den "Ausführen→Pausieren→Bestätigen"-Ablauf, bis alle 7 Phasen abgeschlossen sind.

::: tip Verwenden Sie `factory run` zum Neustarten
Wenn das Claude Code-Fenster geschlossen wurde, können Sie im Terminal ausführen:

```bash
factory run
```

Dadurch werden die Claude Code-Ausführungsanweisungen erneut angezeigt.
:::

### Schritt 5: Plattformübergreifende Berechtigungsbehandlung (Windows-Benutzer)

**Warum**: Windows-Pfadberechtigungen erfordern eine spezielle Behandlung, um sicherzustellen, dass Claude Code korrekt auf Projektdaten zugreifen kann.

Wenn Sie Windows verwenden, generiert `factory init` automatisch Berechtigungen mit Laufwerksunterstützung:

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Read(//C/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)",
      "Write(//C/Users/yourname/project/**)"
    ]
  }
}
```

**Checkpoint ✅**: Windows-Benutzer überprüfen Berechtigungen

```powershell
# PowerShell
Get-Content .claude\settings.local.json | Select-String -Pattern "Read|Write"
```

Wenn sowohl `//c/` als auch `//C/` Pfadformate angezeigt werden, ist die Konfiguration korrekt.

## Checkpoint ✅

Nach Abschluss der obigen Schritte sollten Sie in der Lage sein:

- [x] Die Datei `.claude/settings.local.json` zu finden
- [x] Die vollständige Berechtigungs-Whitelist zu sehen (enthält Read/Write/Bash/Skill/WebFetch)
- [x] Die Bootstrap-Phase erfolgreich in Claude Code zu starten
- [x] `input/idea.md` zu überprüfen und zu bestätigen, dass die Idee strukturiert wurde
- [x] Die Pipeline in die nächste Phase fortzusetzen

Wenn Berechtigungsfehler auftreten, lesen Sie den Abschnitt "Häufige Fehler" unten.

## Häufige Fehler

### Problem 1: Berechtigungen blockiert

**Fehlermeldung**:
```
Permission denied: Read(path/to/file)
```

**Ursache**:
- Berechtigungsdatei konnte nicht generiert werden oder Pfad ist falsch
- Claude Code verwendet alte Berechtigungs-Cache

**Lösung**:

1. Überprüfen Sie, ob die Berechtigungsdatei existiert:

```bash
ls -la .claude/settings.local.json
```

2. Berechtigungen neu generieren:

```bash
# Alte Berechtigungsdatei löschen
rm .claude/settings.local.json

# Neu initialisieren (wird neu generiert)
factory init --force
```

3. Claude Code neu starten, um den Cache zu leeren.

### Problem 2: `--dangerously-skip-permissions` Warnung

**Fehlermeldung**:
```
Using --dangerously-skip-permissions is not recommended.
```

**Ursache**:
- `.claude/settings.local.json` wurde nicht gefunden
- Berechtigungsdatei hat falsches Format

**Lösung**:

Überprüfen Sie das Format der Berechtigungsdatei (JSON-Syntax):

```bash
# JSON-Format validieren
python -m json.tool .claude/settings.local.json
```

Wenn ein Syntaxfehler angezeigt wird, löschen Sie die Datei und führen Sie `factory init` erneut aus.

### Problem 3: Windows-Pfadberechtigungen funktionieren nicht

**Fehlermeldung**:
```
Permission denied: Read(C:\Users\yourname\project\file.js)
```

**Ursache**:
- Berechtigungskonfiguration fehlt Laufwerkspfad
- Pfadformat ist falsch (Windows erfordert `//c/` Format)

**Lösung**:

Bearbeiten Sie `.claude\settings.local.json` manuell und fügen Sie Laufwerkspfade hinzu:

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)"
    ]
  }
}
```

Beachten Sie, dass sowohl Klein- als auch Großbuchstaben für das Laufwerk unterstützt werden müssen (`//c/` und `//C/`).

### Problem 4: Skills-Berechtigungen blockiert

**Fehlermeldung**:
```
Permission denied: Skill(superpowers:brainstorming)
```

**Ursache**:
- Erforderliche Claude Code-Plugins nicht installiert (superpowers, ui-ux-pro-max)
- Plugin-Version nicht kompatibel

**Lösung**:

1. Plugin-Marktplatz hinzufügen:

```bash
# superpowers Plugin-Marktplatz hinzufügen
claude plugin marketplace add obra/superpowers-marketplace
```

2. superpowers-Plugin installieren:

```bash
claude plugin install superpowers@superpowers-marketplace
```

3. ui-ux-pro-max Plugin-Marktplatz hinzufügen:

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

4. ui-ux-pro-max-Plugin installieren:

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

5. Pipeline erneut ausführen.

::: info Factory versucht automatisch, Plugins zu installieren
Der Befehl `factory init` versucht automatisch, diese Plugins zu installieren. Wenn dies fehlschlägt, installieren Sie sie bitte manuell.
:::

## Zusammenfassung dieser Lektion

- **Berechtigungs-Whitelist** ist sicherer als `--dangerously-skip-permissions`
- **`factory init`** generiert automatisch `.claude/settings.local.json`
- Die Berechtigungskonfiguration umfasst **Dateioperationen, Git, Build-Tools, Datenbanken, Web-Operationen** und mehr
- **Cross-Platform-Unterstützung**: Windows verwendet `//c/`-Pfade, Unix verwendet absolute Pfade
- **Manuelle Plugin-Installation**: Wenn die automatische Installation fehlschlägt, müssen superpowers und ui-ux-pro-max manuell in Claude Code installiert werden

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[OpenCode und andere KI-Assistenten](../other-ai-assistants/)** kennen.
>
> Sie werden lernen:
> - Wie man Factory-Pipelines in OpenCode ausführt
> - Integrationsmethoden für andere KI-Assistenten wie Cursor und GitHub Copilot
> - Unterschiede in der Berechtigungskonfiguration zwischen verschiedenen Assistenten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um den Quellcode-Standort anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-29

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Berechtigungskonfigurationsgenerierung | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-292 |
| Automatischer Start von Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| KI-Assistentenerkennung | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 105-124 |
| Claude Code-Anweisungsgenerierung | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 138-156 |
| Cross-Platform-Pfadbehandlung | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 14-67 |

**Wichtige Funktionen**:
- `generatePermissions(projectDir)`: Generiert die vollständige Berechtigungs-Whitelist, einschließlich Read/Write/Bash/Skill/WebFetch usw.
- `generateClaudeSettings(projectDir)`: Generiert und schreibt die Datei `.claude/settings.local.json`
- `launchClaudeCode(projectDir)`: Startet das Claude Code-Fenster und übergibt die Startaufforderung
- `detectAIAssistant()`: Erkennt den aktuell ausgeführten KI-Assistententyp (Claude Code/Cursor/OpenCode)

**Wichtige Konstanten**:
- Windows-Pfadmodus: `Read(//c/**)`, `Write(//c/**)` (unterstützt sowohl Klein- als auch Großbuchstaben für Laufwerke)
- Unix-Pfadmodus: `Read(/path/to/project/**)`, `Write(/path/to/project/**)`
- Skills-Berechtigungen: `'Skill(superpowers:brainstorming)'`, `'Skill(ui-ux-pro-max)'`

**Whitelist-Kategorien**:
- **Dateioperationen**: Read/Write/Glob (unterstützt Wildcards)
- **Git-Operationen**: git add/commit/push/pull usw. (vollständiger Git-Befehlssatz)
- **Build-Tools**: npm/yarn/pnpm install/build/test/dev
- **TypeScript**: tsc/npx tsc/npx type-check
- **Datenbanken**: npx prisma validate/generate/migrate/push
- **Python**: python/pip install (für ui-ux-pro-max)
- **Tests**: vitest/jest/test
- **Factory CLI**: factory init/run/continue/status/reset
- **Docker**: docker compose/ps/build/run
- **Web-Operationen**: WebFetch(domain:github.com) usw. (spezifische Domain-Whitelist)

</details>
