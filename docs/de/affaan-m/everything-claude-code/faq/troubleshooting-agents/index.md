---
title: "Agent-Fehlerbehebung: Diagnose und Reparatur | Everything Claude Code"
sidebarTitle: "Was tun, wenn der Agent nicht funktioniert"
subtitle: "Agent-Fehlerbehebung: Diagnose und Reparatur"
description: "Lernen Sie, wie Sie Fehler bei Everything Claude Code Agent-Aufrufen beheben. Behandelt häufige Probleme wie nicht geladene Agents, Konfigurationsfehler, unzureichende Tool-Berechtigungen und Timeout-Fehler mit systematischen Debugging-Techniken."
tags:
  - "agents"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "platforms-agents-overview"
order: 170
---

# Fehlerbehebung bei Agent-Aufrufen

## Das Problem, das Sie haben

Haben Sie Schwierigkeiten bei der Verwendung von Agents? Sie könnten auf folgende Situationen stoßen:

- Sie geben `/plan` oder andere Befehle ein, aber der Agent wird nicht aufgerufen
- Sie sehen die Fehlermeldung: "Agent not found"
- Der Agent läuft in einen Timeout oder bleibt hängen
- Die Agent-Ausgabe entspricht nicht den Erwartungen
- Der Agent arbeitet nicht nach den Regeln

Keine Sorge, diese Probleme haben in der Regel klare Lösungen. Diese Lektion hilft Ihnen, Agent-bezogene Probleme systematisch zu diagnostizieren und zu beheben.

## 🎒 Vorbereitung

::: warning Voraussetzungen prüfen
Stellen Sie sicher, dass Sie:
1. ✅ Die [Installation](../../start/installation/) von Everything Claude Code abgeschlossen haben
2. ✅ Das [Agents-Konzept](../../platforms/agents-overview/) und die 9 spezialisierten Sub-Agents verstehen
3. ✅ Bereits versucht haben, einen Agent aufzurufen (z.B. `/plan`, `/tdd`, `/code-review`)
:::

---

## Häufiges Problem 1: Agent wird überhaupt nicht aufgerufen

### Symptome
Sie geben `/plan` oder andere Befehle ein, aber der Agent wird nicht ausgelöst – es bleibt ein normaler Chat.

### Mögliche Ursachen

#### Ursache A: Falscher Agent-Dateipfad

**Problem**: Die Agent-Datei befindet sich nicht am richtigen Ort, Claude Code kann sie nicht finden.

**Lösung**:

Überprüfen Sie, ob die Agent-Datei am richtigen Ort liegt:

```bash
# Sollte an einem der folgenden Orte sein:
~/.claude/agents/              # Benutzerebene (global)
.claude/agents/                 # Projektebene
```

**Überprüfungsmethode**:

```bash
# Benutzerebene-Konfiguration anzeigen
ls -la ~/.claude/agents/

# Projektebene-Konfiguration anzeigen
ls -la .claude/agents/
```

**Sie sollten 9 Agent-Dateien sehen**:
- `planner.md`
- `architect.md`
- `tdd-guide.md`
- `code-reviewer.md`
- `security-reviewer.md`
- `build-error-resolver.md`
- `e2e-runner.md`
- `refactor-cleaner.md`
- `doc-updater.md`

**Falls die Dateien nicht existieren**, kopieren Sie sie aus dem Everything Claude Code Plugin-Verzeichnis:

```bash
# Angenommen, das Plugin ist in ~/.claude-plugins/ installiert
cp ~/.claude-plugins/everything-claude-code/agents/*.md ~/.claude/agents/

# Oder aus dem geklonten Repository kopieren
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

#### Ursache B: Command-Datei fehlt oder falscher Pfad

**Problem**: Die Command-Datei (z.B. `plan.md` für `/plan`) existiert nicht oder der Pfad ist falsch.

**Lösung**:

Überprüfen Sie den Speicherort der Command-Datei:

```bash
# Commands sollten an einem der folgenden Orte sein:
~/.claude/commands/             # Benutzerebene (global)
.claude/commands/                # Projektebene
```

**Überprüfungsmethode**:

```bash
# Benutzerebene-Konfiguration anzeigen
ls -la ~/.claude/commands/

# Projektebene-Konfiguration anzeigen
ls -la .claude/commands/
```

**Sie sollten 14 Command-Dateien sehen**:
- `plan.md` → ruft `planner` Agent auf
- `tdd.md` → ruft `tdd-guide` Agent auf
- `code-review.md` → ruft `code-reviewer` Agent auf
- `build-fix.md` → ruft `build-error-resolver` Agent auf
- `e2e.md` → ruft `e2e-runner` Agent auf
- usw...

**Falls die Dateien nicht existieren**, kopieren Sie die Command-Dateien:

```bash
cp ~/.claude-plugins/everything-claude-code/commands/*.md ~/.claude/commands/
```

#### Ursache C: Plugin nicht korrekt geladen

**Problem**: Über den Plugin-Marktplatz installiert, aber das Plugin wurde nicht korrekt geladen.

**Lösung**:

Überprüfen Sie die Plugin-Konfiguration in `~/.claude/settings.json`:

```bash
# Plugin-Konfiguration anzeigen
cat ~/.claude/settings.json | jq '.enabledPlugins'
```

**Sie sollten sehen**:

```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Falls nicht aktiviert**, manuell hinzufügen:

```bash
# settings.json bearbeiten
nano ~/.claude/settings.json

# enabledPlugins-Feld hinzufügen oder ändern
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Starten Sie Claude Code neu, damit die Konfiguration wirksam wird**.

---

## Häufiges Problem 2: Agent-Aufruf meldet "Agent not found"

### Symptome
Nach Eingabe eines Befehls sehen Sie die Fehlermeldung: "Agent not found" oder "Could not find agent: xxx".

### Mögliche Ursachen

#### Ursache A: Agent-Name in der Command-Datei stimmt nicht überein

**Problem**: Das `invokes`-Feld in der Command-Datei stimmt nicht mit dem Agent-Dateinamen überein.

**Lösung**:

Überprüfen Sie das `invokes`-Feld in der Command-Datei:

```bash
# Eine Command-Datei anzeigen
cat ~/.claude/commands/plan.md | grep -A 5 "invokes"
```

**Command-Dateistruktur** (am Beispiel von `plan.md`):

```markdown
---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes **planner** agent...
```

**Überprüfen Sie, ob die Agent-Datei existiert**:

Der in der Command-Datei genannte Agent-Name (z.B. `planner`) muss einer Datei entsprechen: `planner.md`

```bash
# Überprüfen, ob die Agent-Datei existiert
ls -la ~/.claude/agents/planner.md

# Falls nicht vorhanden, nach ähnlichen Dateinamen suchen
ls -la ~/.claude/agents/ | grep -i plan
```

**Häufige Nichtübereinstimmungen**:

| Command invokes | Tatsächlicher Agent-Dateiname | Problem |
| --- | --- | --- |
| `planner` | `planner.md` | ✅ Korrekt |
| `planner` | `Planner.md` | ❌ Groß-/Kleinschreibung stimmt nicht (Unix-Systeme unterscheiden) |
| `planner` | `planner.md.backup` | ❌ Falsche Dateierweiterung |
| `tdd-guide` | `tdd_guide.md` | ❌ Bindestrich vs. Unterstrich |

#### Ursache B: Falscher Agent-Dateiname

**Problem**: Der Agent-Dateiname entspricht nicht den Erwartungen.

**Lösung**:

Überprüfen Sie alle Agent-Dateinamen:

```bash
# Alle Agent-Dateien auflisten
ls -la ~/.claude/agents/

# Erwartete 9 Agent-Dateien
# planner.md
# architect.md
# tdd-guide.md
# code-reviewer.md
# security-reviewer.md
# build-error-resolver.md
# e2e-runner.md
# refactor-cleaner.md
# doc-updater.md
```

**Falls der Dateiname nicht korrekt ist**, benennen Sie die Datei um:

```bash
# Beispiel: Dateinamen korrigieren
cd ~/.claude/agents/
mv Planner.md planner.md
mv tdd_guide.md tdd-guide.md
```

---

## Häufiges Problem 3: Fehler im Agent Front Matter Format

### Symptome
Der Agent wird aufgerufen, aber Sie sehen die Fehlermeldung: "Invalid agent metadata" oder ähnliche Formatfehler.

### Mögliche Ursachen

#### Ursache A: Fehlende Pflichtfelder

**Problem**: Im Agent Front Matter fehlen Pflichtfelder (`name`, `description`, `tools`).

**Lösung**:

Überprüfen Sie das Agent Front Matter Format:

```bash
# Kopfbereich einer Agent-Datei anzeigen
head -20 ~/.claude/agents/planner.md
```

**Korrektes Front Matter Format**:

```markdown
---
name: planner
description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.
tools: Read, Grep, Glob
model: opus
---
```

**Pflichtfelder**:
- `name`: Agent-Name (muss mit dem Dateinamen ohne Erweiterung übereinstimmen)
- `description`: Agent-Beschreibung (zur Erklärung der Agent-Aufgaben)
- `tools`: Liste der erlaubten Tools (kommagetrennt)

**Optionale Felder**:
- `model`: Bevorzugtes Modell (`opus` oder `sonnet`)

#### Ursache B: Fehler im Tools-Feld

**Problem**: Das `tools`-Feld verwendet falsche Tool-Namen oder falsches Format.

**Lösung**:

Überprüfen Sie das `tools`-Feld:

```bash
# tools-Feld extrahieren
grep "^tools:" ~/.claude/agents/*.md
```

**Erlaubte Tool-Namen** (Groß-/Kleinschreibung beachten):
- `Read`
- `Write`
- `Edit`
- `Bash`
- `Grep`
- `Glob`

**Häufige Fehler**:

| Falsche Schreibweise | Korrekte Schreibweise | Problem |
| --- | --- | --- |
| `tools: read, grep, glob` | `tools: Read, Grep, Glob` | ❌ Falsche Groß-/Kleinschreibung |
| `tools: Read, Grep, Glob,` | `tools: Read, Grep, Glob` | ❌ Abschließendes Komma (YAML-Syntaxfehler) |
| `tools: "Read, Grep, Glob"` | `tools: Read, Grep, Glob` | ❌ Anführungszeichen nicht erforderlich |
| `tools: Read Grep Glob` | `tools: Read, Grep, Glob` | ❌ Fehlende Kommatrennung |

#### Ursache C: YAML-Syntaxfehler

**Problem**: Front Matter YAML-Formatfehler (z.B. Einrückung, Anführungszeichen, Sonderzeichen).

**Lösung**:

YAML-Format validieren:

```bash
# Mit Python YAML validieren
python3 -c "import yaml; yaml.safe_load(open('~/.claude/agents/planner.md'))"

# Oder yamllint verwenden (muss installiert werden)
pip install yamllint
yamllint ~/.claude/agents/*.md
```

**Häufige YAML-Fehler**:
- Inkonsistente Einrückung (YAML ist einrückungssensitiv)
- Fehlendes Leerzeichen nach Doppelpunkt: `name:planner` → `name: planner`
- Nicht-escapte Sonderzeichen in Strings (wie Doppelpunkte, Rauten)
- Tab-Einrückung verwendet (YAML akzeptiert nur Leerzeichen)

---

## Häufiges Problem 4: Agent-Timeout oder Hängenbleiben

### Symptome
Der Agent beginnt mit der Ausführung, reagiert aber lange nicht oder bleibt hängen.

### Mögliche Ursachen

#### Ursache A: Zu hohe Aufgabenkomplexität

**Problem**: Die angeforderte Aufgabe ist zu komplex und übersteigt die Verarbeitungskapazität des Agents.

**Lösung**:

**Aufgabe in kleinere Schritte aufteilen**:

```
❌ Falsch: Agent soll das gesamte Projekt auf einmal bearbeiten
"Hilf mir, das gesamte Benutzerauthentifizierungssystem zu refaktorieren, einschließlich aller Tests und Dokumentation"

✅ Richtig: Schrittweise ausführen
Schritt 1: /plan Refaktorierung des Benutzerauthentifizierungssystems
Schritt 2: /tdd Implementierung von Schritt 1 (Login-API)
Schritt 3: /tdd Implementierung von Schritt 2 (Registrierungs-API)
...
```

**Zuerst `/plan`-Befehl zur Planung verwenden**:

```
Benutzer: /plan Ich muss das Benutzerauthentifizierungssystem refaktorieren

Agent (planner):
# Implementation Plan: Refactor User Authentication System

## Phase 1: Audit Current Implementation
- Review existing auth code
- Identify security issues
- List dependencies

## Phase 2: Design New System
- Define authentication flow
- Choose auth method (JWT, OAuth, etc.)
- Design API endpoints

## Phase 3: Implement Core Features
[Detaillierte Schritte...]

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

#### Ursache B: Ungeeignete Modellauswahl

**Problem**: Hohe Aufgabenkomplexität, aber ein schwächeres Modell wird verwendet (z.B. `sonnet` statt `opus`).

**Lösung**:

Überprüfen Sie das `model`-Feld des Agents:

```bash
# Verwendete Modelle aller Agents anzeigen
grep "^model:" ~/.claude/agents/*.md
```

**Empfohlene Konfiguration**:
- **Reasoning-intensive Aufgaben** (wie `planner`, `architect`): `opus` verwenden
- **Code-Generierung/-Modifikation** (wie `tdd-guide`, `code-reviewer`): `opus` verwenden
- **Einfache Aufgaben** (wie `refactor-cleaner`): kann `sonnet` verwenden

**Modellkonfiguration ändern**:

Agent-Datei bearbeiten:

```markdown
---
name: my-custom-agent
description: Custom agent for...
tools: Read, Write, Edit, Bash, Grep
model: opus  # opus für bessere Leistung bei komplexen Aufgaben verwenden
---
```

#### Ursache C: Zu viele Dateien gelesen

**Problem**: Der Agent liest zu viele Dateien und überschreitet das Token-Limit.

**Lösung**:

**Dateibereich für den Agent einschränken**:

```
❌ Falsch: Agent soll das gesamte Projekt lesen
"Lies alle Dateien im Projekt und analysiere dann die Architektur"

✅ Richtig: Relevante Dateien angeben
"Lies die Dateien im Verzeichnis src/auth/ und analysiere die Authentifizierungssystemarchitektur"
```

**Glob-Muster für präzise Übereinstimmung verwenden**:

```
Benutzer: Bitte hilf mir, die Leistung zu optimieren

Agent sollte:
# Glob verwenden, um leistungskritische Dateien zu finden
Glob pattern="**/*.{ts,tsx}" path="src/api"

# Anstatt
Glob pattern="**/*" path="."  # Alle Dateien lesen
```

---

## Häufiges Problem 5: Agent-Ausgabe entspricht nicht den Erwartungen

### Symptome
Der Agent wird aufgerufen und ausgeführt, aber die Ausgabe entspricht nicht den Erwartungen oder ist von geringer Qualität.

### Mögliche Ursachen

#### Ursache A: Unklare Aufgabenbeschreibung

**Problem**: Die Benutzeranfrage ist vage, der Agent kann die Anforderungen nicht genau verstehen.

**Lösung**:

**Klare, spezifische Aufgabenbeschreibung bereitstellen**:

```
❌ Falsch: Vage Anfrage
"Hilf mir, den Code zu optimieren"

✅ Richtig: Spezifische Anfrage
"Hilf mir, die searchMarkets-Funktion in src/api/markets.ts zu optimieren,
um die Abfrageleistung zu verbessern. Ziel ist es, die Antwortzeit von 500ms auf unter 100ms zu reduzieren"
```

**Folgende Informationen einbeziehen**:
- Spezifische Datei- oder Funktionsnamen
- Klare Ziele (Leistung, Sicherheit, Lesbarkeit usw.)
- Einschränkungen (bestehende Funktionalität nicht brechen, Kompatibilität wahren usw.)

#### Ursache B: Fehlender Kontext

**Problem**: Dem Agent fehlen notwendige Kontextinformationen, um richtige Entscheidungen zu treffen.

**Lösung**:

**Proaktiv Hintergrundinformationen bereitstellen**:

```
Benutzer: Bitte hilf mir, den fehlgeschlagenen Test zu beheben

❌ Falsch: Kein Kontext
"npm test hat einen Fehler, bitte behebe ihn"

✅ Richtig: Vollständigen Kontext bereitstellen
"Beim Ausführen von npm test ist der searchMarkets-Test fehlgeschlagen.
Die Fehlermeldung lautet: Expected 5 but received 0.
Ich habe gerade die vectorSearch-Funktion geändert, das könnte damit zusammenhängen.
Bitte hilf mir, das Problem zu lokalisieren und zu beheben."
```

**Skills für Domänenwissen verwenden**:

Wenn das Projekt eine spezifische Skill-Bibliothek hat (`~/.claude/skills/`), lädt der Agent automatisch relevantes Wissen.

#### Ursache C: Agent-Fachgebiet passt nicht

**Problem**: Ein ungeeigneter Agent wird für die Aufgabe verwendet.

**Lösung**:

**Den richtigen Agent basierend auf dem Aufgabentyp auswählen**:

| Aufgabentyp | Empfohlener Agent | Command |
| --- | --- | --- |
| Neue Funktion implementieren | `tdd-guide` | `/tdd` |
| Komplexe Funktionsplanung | `planner` | `/plan` |
| Code-Review | `code-reviewer` | `/code-review` |
| Sicherheitsaudit | `security-reviewer` | Manueller Aufruf |
| Build-Fehler beheben | `build-error-resolver` | `/build-fix` |
| E2E-Tests | `e2e-runner` | `/e2e` |
| Toten Code bereinigen | `refactor-cleaner` | `/refactor-clean` |
| Dokumentation aktualisieren | `doc-updater` | `/update-docs` |
| Systemarchitektur-Design | `architect` | Manueller Aufruf |

**Siehe [Agent-Übersicht](../../platforms/agents-overview/) für die Verantwortlichkeiten jedes Agents**.

---

## Häufiges Problem 6: Unzureichende Agent-Tool-Berechtigungen

### Symptome
Der Agent versucht, ein Tool zu verwenden, wird aber abgelehnt. Sie sehen den Fehler: "Tool not available: xxx".

### Mögliche Ursachen

#### Ursache A: Tool fehlt im Tools-Feld

**Problem**: Das `tools`-Feld im Agent Front Matter enthält nicht das benötigte Tool.

**Lösung**:

Überprüfen Sie das `tools`-Feld des Agents:

```bash
# Erlaubte Tools des Agents anzeigen
grep -A 1 "^tools:" ~/.claude/agents/planner.md
```

**Falls ein Tool fehlt**, zum `tools`-Feld hinzufügen:

```markdown
---
name: my-custom-agent
description: Agent that needs to write code
tools: Read, Write, Edit, Grep, Glob  # Sicherstellen, dass Write und Edit enthalten sind
model: opus
---
```

**Tool-Anwendungsfälle**:
- `Read`: Dateiinhalte lesen (fast alle Agents benötigen dies)
- `Write`: Neue Dateien erstellen
- `Edit`: Bestehende Dateien bearbeiten
- `Bash`: Befehle ausführen (wie Tests, Builds)
- `Grep`: Dateiinhalte durchsuchen
- `Glob`: Dateipfade finden

#### Ursache B: Rechtschreibfehler im Tool-Namen

**Problem**: Das `tools`-Feld verwendet falsche Tool-Namen.

**Lösung**:

**Tool-Namen-Schreibweise überprüfen** (Groß-/Kleinschreibung beachten):

| ✅ Korrekt | ❌ Falsch |
| --- | --- |
| `Read` | `read`, `READ` |
| `Write` | `write`, `WRITE` |
| `Edit` | `edit`, `EDIT` |
| `Bash` | `bash`, `BASH` |
| `Grep` | `grep`, `GREP` |
| `Glob` | `glob`, `GLOB` |

---

## Häufiges Problem 7: Proaktiver Agent wird nicht automatisch ausgelöst

### Symptome
Bestimmte Agents sollten automatisch ausgelöst werden (z.B. `code-reviewer` nach Code-Änderungen), aber das passiert nicht.

### Mögliche Ursachen

#### Ursache A: Auslösebedingungen nicht erfüllt

**Problem**: Die Agent-Beschreibung enthält `Use PROACTIVELY`, aber die Auslösebedingungen sind nicht erfüllt.

**Lösung**:

Überprüfen Sie das `description`-Feld des Agents:

```bash
# Agent-Beschreibung anzeigen
grep "^description:" ~/.claude/agents/code-reviewer.md
```

**Beispiel (code-reviewer)**:

```markdown
description: Reviews code for quality, security, and maintainability. Use PROACTIVELY when users write or modify code.
```

**Proaktive Auslösebedingungen**:
- Benutzer fordert explizit Code-Review an
- Code wurde gerade geschrieben/geändert
- Vor dem Code-Commit

**Manueller Aufruf**:

Wenn die automatische Auslösung nicht funktioniert, können Sie manuell aufrufen:

```
Benutzer: Bitte überprüfe den Code, den ich gerade geschrieben habe

Oder mit Command:
Benutzer: /code-review
```

---

## Diagnosetools und Tipps

### Agent-Ladestatus überprüfen

Prüfen Sie, ob Claude Code alle Agents korrekt geladen hat:

```bash
# Claude Code Logs anzeigen (falls verfügbar)
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log | grep -i agent

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait | Select-String "agent"
```

### Agent manuell testen

Agent-Aufruf in Claude Code manuell testen:

```
Benutzer: Bitte rufe den planner Agent auf, um mir bei der Planung einer neuen Funktion zu helfen

# Beobachten Sie, ob der Agent korrekt aufgerufen wird
# Prüfen Sie, ob die Ausgabe den Erwartungen entspricht
```

### Front Matter Format validieren

Alle Agent Front Matter mit Python validieren:

```bash
#!/bin/bash

for file in ~/.claude/agents/*.md; do
    echo "Validating $file..."
    python3 << EOF
import yaml
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        # Extract front matter (between ---)
        start = content.find('---')
        end = content.find('---', start + 3)
        if start == -1 or end == -1:
            print("Error: No front matter found")
            sys.exit(1)
        
        front_matter = content[start + 3:end].strip()
        metadata = yaml.safe_load(front_matter)
        
        # Check required fields
        required = ['name', 'description', 'tools']
        for field in required:
            if field not in metadata:
                print(f"Error: Missing required field '{field}'")
                sys.exit(1)
        
        print("✅ Valid")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF
done
```

Als `validate-agents.sh` speichern und ausführen:

```bash
chmod +x validate-agents.sh
./validate-agents.sh
```

---

## Checkliste ✅

Prüfen Sie die folgende Liste Punkt für Punkt:

- [ ] Agent-Dateien am richtigen Ort (`~/.claude/agents/` oder `.claude/agents/`)
- [ ] Command-Dateien am richtigen Ort (`~/.claude/commands/` oder `.claude/commands/`)
- [ ] Agent Front Matter Format korrekt (enthält name, description, tools)
- [ ] Tools-Feld verwendet korrekte Tool-Namen (Groß-/Kleinschreibung beachten)
- [ ] Command `invokes`-Feld stimmt mit Agent-Dateiname überein
- [ ] Plugin in `~/.claude/settings.json` korrekt aktiviert
- [ ] Aufgabenbeschreibung klar und spezifisch
- [ ] Geeigneter Agent für die Aufgabe ausgewählt

---

## Wann Sie Hilfe benötigen

Wenn keine der oben genannten Methoden das Problem löst:

1. **Diagnoseinformationen sammeln**:
   ```bash
   # Folgende Informationen ausgeben
   echo "Claude Code version: $(claude-code --version 2>/dev/null || echo 'N/A')"
   echo "Agent files:"
   ls -la ~/.claude/agents/
   echo "Command files:"
   ls -la ~/.claude/commands/
   echo "Plugin config:"
   cat ~/.claude/settings.json | jq '.enabledPlugins'
   ```

2. **GitHub Issues durchsuchen**:
   - Besuchen Sie [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - Nach ähnlichen Problemen suchen

3. **Issue erstellen**:
   - Vollständige Fehlermeldung beifügen
   - Betriebssystem und Version angeben
   - Relevante Agent- und Command-Dateiinhalte anhängen

---

## Zusammenfassung dieser Lektion

Agent-Aufruffehler haben in der Regel folgende Ursachen:

| Problemtyp | Häufige Ursache | Schnelle Diagnose |
| --- | --- | --- |
| **Wird überhaupt nicht aufgerufen** | Agent/Command-Dateipfad falsch, Plugin nicht geladen | Dateispeicherort prüfen, Plugin-Konfiguration verifizieren |
| **Agent not found** | Namenskonflikt (Command invokes vs. Dateiname) | Dateiname und invokes-Feld verifizieren |
| **Formatfehler** | Front Matter fehlen Felder, YAML-Syntaxfehler | Pflichtfelder prüfen, YAML-Format validieren |
| **Timeout** | Hohe Aufgabenkomplexität, ungeeignete Modellauswahl | Aufgabe aufteilen, opus-Modell verwenden |
| **Ausgabe entspricht nicht Erwartungen** | Unklare Aufgabenbeschreibung, fehlender Kontext, falscher Agent | Spezifische Aufgabe angeben, richtigen Agent wählen |
| **Unzureichende Tool-Berechtigungen** | Tools-Feld fehlt Tool, Rechtschreibfehler im Namen | tools-Feld prüfen, Tool-Namen verifizieren |

Merken Sie sich: Die meisten Probleme können durch Überprüfung der Dateipfade, Validierung des Front Matter Formats und Auswahl des richtigen Agents gelöst werden.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Tipps zur Leistungsoptimierung](../performance-tips/)**.
>
> Sie werden lernen:
> - Wie Sie die Token-Nutzung optimieren
> - Die Antwortgeschwindigkeit von Claude Code verbessern
> - Strategien zur Kontextfenster-Verwaltung

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Plugin-Manifest-Konfiguration | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Planner Agent | [`agents/planner.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| TDD Guide Agent | [`agents/tdd-guide.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-281 |
| Plan Command | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| TDD Command | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-281 |
| Agent-Nutzungsregeln | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |

**Front Matter Pflichtfelder** (alle Agent-Dateien):
- `name`: Agent-Identifikator (muss mit Dateiname ohne `.md`-Erweiterung übereinstimmen)
- `description`: Agent-Funktionsbeschreibung (enthält Auslösebedingungen)
- `tools`: Liste der erlaubten Tools (kommagetrennt: `Read, Grep, Glob`)
- `model`: Bevorzugtes Modell (`opus` oder `sonnet`, optional)

**Erlaubte Tool-Namen** (Groß-/Kleinschreibung beachten):
- `Read`: Dateiinhalte lesen
- `Write`: Neue Dateien erstellen
- `Edit`: Bestehende Dateien bearbeiten
- `Bash`: Befehle ausführen
- `Grep`: Dateiinhalte durchsuchen
- `Glob`: Dateipfade finden

**Wichtige Konfigurationspfade**:
- Benutzerebene Agents: `~/.claude/agents/`
- Benutzerebene Commands: `~/.claude/commands/`
- Benutzerebene Settings: `~/.claude/settings.json`
- Projektebene Agents: `.claude/agents/`
- Projektebene Commands: `.claude/commands/`

**Plugin-Ladekonfiguration** (`~/.claude/settings.json`):
```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

</details>
