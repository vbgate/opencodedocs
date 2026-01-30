---
title: "Beitragsleitfaden: Konfigurationen einreichen | Everything Claude Code"
sidebarTitle: "Deine erste Konfiguration einreichen"
subtitle: "Beitragsleitfaden: Konfigurationen einreichen"
description: "Lerne den standardisierten Prozess zur Einreichung von Konfigurationen bei Everything Claude Code. Beherrsche die Schritte: Projekt forken, Branch erstellen, Formatvorgaben befolgen, lokal testen und PR einreichen."
tags:
  - "contributing"
  - "agents"
  - "skills"
  - "commands"
  - "hooks"
  - "rules"
  - "mcp"
  - "github"
prerequisite:
  - "start-installation"
  - "start-quickstart"
order: 230
---

# Beitragsleitfaden: So trägst du Konfigurationen, Agents und Skills zum Projekt bei

## Was du nach diesem Tutorial kannst

- Den Beitragsprozess und die Richtlinien des Projekts verstehen
- Agents, Skills, Commands, Hooks, Rules und MCP-Konfigurationen korrekt einreichen
- Code-Stil und Namenskonventionen einhalten
- Häufige Beitragsfehler vermeiden
- Effizient mit der Community über Pull Requests zusammenarbeiten

## Deine aktuelle Herausforderung

Du möchtest zu Everything Claude Code beitragen, stößt aber auf diese Probleme:
- „Ich weiß nicht, welche Beiträge wertvoll sind"
- „Ich weiß nicht, wie ich meinen ersten PR starten soll"
- „Mir sind die Dateiformate und Namenskonventionen unklar"
- „Ich befürchte, dass mein Beitrag die Anforderungen nicht erfüllt"

Dieses Tutorial gibt dir einen vollständigen Beitragsleitfaden – von der Philosophie bis zur Praxis.

## Kernkonzept

Everything Claude Code ist eine **Community-Ressource**, kein Ein-Personen-Projekt. Der Wert dieses Repositories liegt in:

1. **Praxiserprobt** - Alle Konfigurationen wurden über 10+ Monate in Produktionsumgebungen eingesetzt
2. **Modulares Design** - Jeder Agent, Skill und Command ist eine unabhängig wiederverwendbare Komponente
3. **Qualität zuerst** - Code-Reviews und Sicherheitsaudits gewährleisten die Beitragsqualität
4. **Offene Zusammenarbeit** - MIT-Lizenz, Beiträge und Anpassungen sind willkommen

::: tip Warum Beiträge wertvoll sind
- **Wissensaustausch**: Deine Erfahrung kann anderen Entwicklern helfen
- **Reichweite**: Konfigurationen, die von Hunderten/Tausenden genutzt werden
- **Kompetenzentwicklung**: Projektstruktur und Community-Zusammenarbeit lernen
- **Netzwerkaufbau**: Verbindung zur Anthropic- und Claude Code-Community
:::

## Was wir suchen

### Agents

Spezialisierte Sub-Agents für komplexe Aufgaben in bestimmten Bereichen:

| Typ | Beispiele |
| --- | --- |
| Sprachexperten | Python, Go, Rust Code-Review |
| Framework-Experten | Django, Rails, Laravel, Spring |
| DevOps-Experten | Kubernetes, Terraform, CI/CD |
| Domänenexperten | ML-Pipelines, Data Engineering, Mobile |

### Skills

Workflow-Definitionen und Domänenwissensbasen:

| Typ | Beispiele |
| --- | --- |
| Sprach-Best-Practices | Python, Go, Rust Coding-Standards |
| Framework-Patterns | Django, Rails, Laravel Architekturmuster |
| Teststrategien | Unit-Tests, Integrationstests, E2E-Tests |
| Architektur-Leitfäden | Microservices, Event-Driven, CQRS |
| Domänenwissen | ML, Datenanalyse, Mobile-Entwicklung |

### Commands

Slash-Befehle für schnellen Workflow-Zugang:

| Typ | Beispiele |
| --- | --- |
| Deployment-Befehle | Deployment auf Vercel, Railway, AWS |
| Test-Befehle | Unit-Tests, E2E-Tests, Coverage-Analyse ausführen |
| Dokumentations-Befehle | API-Dokumentation generieren, README aktualisieren |
| Code-Generierungs-Befehle | Typen generieren, CRUD-Templates erstellen |

### Hooks

Automatisierungs-Hooks, die bei bestimmten Events ausgelöst werden:

| Typ | Beispiele |
| --- | --- |
| Linting/Formatting | Code-Formatierung, Lint-Prüfungen |
| Sicherheitsprüfungen | Erkennung sensibler Daten, Schwachstellen-Scans |
| Validierungs-Hooks | Git-Commit-Validierung, PR-Prüfungen |
| Benachrichtigungs-Hooks | Slack/E-Mail-Benachrichtigungen |

### Rules

Verbindliche Regeln zur Sicherstellung von Code-Qualität und Sicherheitsstandards:

| Typ | Beispiele |
| --- | --- |
| Sicherheitsregeln | Keine hartcodierten Schlüssel, OWASP-Prüfungen |
| Code-Stil | Immutable Patterns, Dateigrößenbeschränkungen |
| Testanforderungen | 80%+ Coverage, TDD-Workflow |
| Namenskonventionen | Variablenbenennung, Dateibenennung |

### MCP Configurations

MCP-Server-Konfigurationen zur Erweiterung externer Service-Integrationen:

| Typ | Beispiele |
| --- | --- |
| Datenbank-Integration | PostgreSQL, MongoDB, ClickHouse |
| Cloud-Anbieter | AWS, GCP, Azure |
| Monitoring-Tools | Datadog, New Relic, Sentry |
| Kommunikations-Tools | Slack, Discord, E-Mail |

## So trägst du bei

### Schritt 1: Projekt forken

**Warum**: Du brauchst deine eigene Kopie für Änderungen, ohne das Original-Repository zu beeinflussen.

```bash
# 1. Besuche https://github.com/affaan-m/everything-claude-code
# 2. Klicke oben rechts auf "Fork"
# 3. Clone deinen Fork
git clone https://github.com/YOUR_USERNAME/everything-claude-code.git
cd everything-claude-code

# 4. Upstream-Repository hinzufügen (für spätere Synchronisation)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
```

**Erwartetes Ergebnis**: Ein lokales `everything-claude-code`-Verzeichnis mit allen Projektdateien.

### Schritt 2: Feature-Branch erstellen

**Warum**: Branches isolieren deine Änderungen und erleichtern Verwaltung und Merging.

```bash
# Beschreibenden Branch-Namen erstellen
git checkout -b add-python-reviewer

# Oder spezifischere Benennung verwenden
git checkout -b feature/django-pattern-skill
git checkout -b fix/hook-tmux-reminder
```

**Branch-Namenskonventionen**:
- `feature/` - Neue Features
- `fix/` - Bugfixes
- `docs/` - Dokumentations-Updates
- `refactor/` - Code-Refactoring

### Schritt 3: Deinen Beitrag hinzufügen

**Warum**: Dateien im richtigen Verzeichnis platzieren, damit Claude Code sie korrekt laden kann.

```bash
# Verzeichnis je nach Beitragstyp wählen
agents/           # Neue Agents
skills/           # Neue Skills (einzelne .md oder Verzeichnis)
commands/         # Neue Slash-Befehle
rules/            # Neue Regeldateien
hooks/            # Hook-Konfiguration (hooks/hooks.json bearbeiten)
mcp-configs/      # MCP-Server-Konfiguration (mcp-configs/mcp-servers.json bearbeiten)
```

::: tip Verzeichnisstruktur
- **Einzelne Datei**: Direkt im Verzeichnis ablegen, z.B. `agents/python-reviewer.md`
- **Komplexe Komponenten**: Unterverzeichnis erstellen, z.B. `skills/coding-standards/` (mit mehreren Dateien)
:::

### Schritt 4: Formatvorgaben einhalten

#### Agent-Format

**Warum**: Front Matter definiert die Metadaten des Agents, Claude Code benötigt diese Informationen zum Laden.

```markdown
---
name: python-reviewer
description: Reviews Python code for PEP 8 compliance, type hints, and best practices
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---

You are a senior Python code reviewer...

Your review should cover:
- PEP 8 style compliance
- Type hints usage
- Docstring completeness
- Security best practices
- Performance optimizations
```

**Pflichtfelder**:
- `name`: Agent-Identifier (Kleinbuchstaben mit Bindestrichen)
- `description`: Funktionsbeschreibung
- `tools`: Liste erlaubter Tools (kommagetrennt)
- `model`: Bevorzugtes Modell (`opus` oder `sonnet`)

#### Skill-Format

**Warum**: Klare Skill-Definitionen sind leichter wiederverwendbar und verständlich.

```markdown
# Python Best Practices

## When to Use

Use this skill when:
- Writing new Python code
- Reviewing Python code
- Refactoring Python modules

## How It Works

Follow these principles:

1. **Type Hints**: Always include type hints for function parameters and return values
2. **Docstrings**: Use Google style docstrings for all public functions
3. **PEP 8**: Follow PEP 8 style guide
4. **Immutability**: Prefer immutable data structures

## Examples

### Good
```python
def process_user_data(user_id: str) -> dict:
    """Process user data and return result.

    Args:
        user_id: The user ID to process

    Returns:
        A dictionary with processed data
    """
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```

### Bad
```python
def process_user_data(user_id):
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```
```

**Empfohlene Abschnitte**:
- `When to Use`: Anwendungsfälle
- `How It Works`: Funktionsweise
- `Examples`: Beispiele (Good vs Bad)
- `References`: Weiterführende Ressourcen (optional)

#### Command-Format

**Warum**: Klare Befehlsbeschreibungen helfen Nutzern, die Funktionalität zu verstehen.

Front Matter (Pflicht):

```markdown
---
description: Run Python tests with coverage report
---
```

Hauptinhalt (optional):

```markdown
# Test

Run tests for the current project:

Coverage requirements:
- Minimum 80% line coverage
- 100% coverage for critical paths
```

Befehlsbeispiele (optional):

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

**Pflichtfelder**:
- `description`: Kurze Funktionsbeschreibung

#### Hook-Format

**Warum**: Hooks benötigen klare Matching-Regeln und Ausführungsaktionen.

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(py)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Python file edited')\""
    }
  ],
  "description": "Triggered when Python files are edited"
}
```

**Pflichtfelder**:
- `matcher`: Auslösebedingungsausdruck
- `hooks`: Array der auszuführenden Aktionen
- `description`: Hook-Funktionsbeschreibung

### Schritt 5: Deinen Beitrag testen

**Warum**: Sicherstellen, dass die Konfiguration in der Praxis funktioniert.

::: warning Wichtig
Vor dem Einreichen eines PRs **unbedingt** die Konfiguration in deiner lokalen Umgebung testen.
:::

**Testschritte**:

```bash
# 1. In deine Claude Code-Konfiguration kopieren
cp agents/python-reviewer.md ~/.claude/agents/
cp skills/python-patterns/* ~/.claude/skills/

# 2. In Claude Code testen
# Claude Code starten und neue Konfiguration verwenden

# 3. Funktionalität verifizieren
# - Kann der Agent korrekt aufgerufen werden?
# - Wird der Command korrekt ausgeführt?
# - Wird der Hook zum richtigen Zeitpunkt ausgelöst?
```

**Erwartetes Ergebnis**: Die Konfiguration funktioniert in Claude Code ohne Fehler oder Anomalien.

### Schritt 6: PR einreichen

**Warum**: Pull Requests sind der Standard für Community-Zusammenarbeit.

```bash
# Alle Änderungen hinzufügen
git add .

# Commit (mit klarer Commit-Nachricht)
git commit -m "Add Python code reviewer agent

- Implements PEP 8 compliance checks
- Adds type hints validation
- Includes security best practices
- Tested on real Python projects"

# Zu deinem Fork pushen
git push origin add-python-reviewer
```

**Dann auf GitHub den PR erstellen**:

1. Dein Fork-Repository besuchen
2. Auf "Compare & pull request" klicken
3. PR-Template ausfüllen:

```markdown
## What you added
- [ ] Description of what you added

## Why it's useful
- [ ] Why this contribution is valuable

## How you tested it
- [ ] Testing steps you performed

## Related issues
- [ ] Link to any related issues
```

**Erwartetes Ergebnis**: PR erfolgreich erstellt, wartet auf Maintainer-Review.

## Leitprinzipien

### Do (Solltest du tun)

✅ **Konfigurationen fokussiert und modular halten**
- Jeder Agent/Skill macht nur eine Sache
- Funktionsvermischung vermeiden

✅ **Klare Beschreibungen einschließen**
- Front Matter-Beschreibungen präzise
- Hilfreiche Code-Kommentare

✅ **Vor dem Einreichen testen**
- Konfiguration lokal verifizieren
- Sicherstellen, dass keine Fehler auftreten

✅ **Bestehenden Mustern folgen**
- Format bestehender Dateien als Referenz
- Konsistenten Code-Stil beibehalten

✅ **Abhängigkeiten dokumentieren**
- Externe Abhängigkeiten auflisten
- Installationsanforderungen angeben

### Don't (Solltest du nicht tun)

❌ **Sensible Daten einschließen**
- API-Keys, Tokens
- Hartcodierte Pfade
- Persönliche Anmeldedaten

❌ **Übermäßig komplexe oder Nischen-Konfigurationen hinzufügen**
- Allgemeine Anwendbarkeit priorisieren
- Over-Engineering vermeiden

❌ **Ungetestete Konfigurationen einreichen**
- Testen ist Pflicht
- Testing Steps bereitstellen

❌ **Doppelte Funktionalität erstellen**
- Bestehende Konfigurationen durchsuchen
- Das Rad nicht neu erfinden

❌ **Konfigurationen hinzufügen, die von kostenpflichtigen Diensten abhängen**
- Kostenlose Alternativen anbieten
- Oder Open-Source-Tools verwenden

## Dateibenennungskonventionen

**Warum**: Einheitliche Namenskonventionen machen das Projekt wartbarer.

### Benennungsregeln

| Regel | Beispiel |
| --- | --- |
| Kleinbuchstaben verwenden | `python-reviewer.md` |
| Bindestriche als Trenner | `tdd-workflow.md` |
| Beschreibende Benennung | `django-pattern-skill.md` |
| Vage Namen vermeiden | ❌ `workflow.md` → ✅ `tdd-workflow.md` |

### Übereinstimmungsprinzip

Dateinamen sollten mit Agent/Skill/Command-Namen übereinstimmen:

```bash
# Agent
agents/python-reviewer.md          # name: python-reviewer

# Skill
skills/django-patterns/SKILL.md    # # Django Patterns

# Command
commands/test.md                   # # Test
```

::: tip Benennungstipps
- Branchenbegriffe verwenden (wie "PEP 8", "TDD", "REST")
- Abkürzungen vermeiden (außer Standardabkürzungen)
- Prägnant aber beschreibend bleiben
:::

## Beitrags-Checkliste

Vor dem Einreichen eines PRs sicherstellen, dass folgende Bedingungen erfüllt sind:

### Code-Qualität
- [ ] Bestehenden Code-Stil eingehalten
- [ ] Notwendiges Front Matter enthalten
- [ ] Klare Beschreibungen und Dokumentation
- [ ] Lokale Tests bestanden

### Dateispezifikationen
- [ ] Dateiname entspricht Namenskonventionen
- [ ] Datei im richtigen Verzeichnis
- [ ] JSON-Format korrekt (falls vorhanden)
- [ ] Keine sensiblen Daten

### PR-Qualität
- [ ] PR-Titel beschreibt Änderungen klar
- [ ] PR-Beschreibung enthält "What", "Why", "How"
- [ ] Verwandte Issues verlinkt (falls vorhanden)
- [ ] Testing Steps bereitgestellt

### Community-Standards
- [ ] Keine doppelte Funktionalität
- [ ] Alternativen angeboten (bei kostenpflichtigen Diensten)
- [ ] Auf Review-Kommentare reagiert
- [ ] Freundliche und konstruktive Diskussion

## Häufige Fragen

### F: Wie weiß ich, welche Beiträge wertvoll sind?

**A**: Beginne mit deinen eigenen Bedürfnissen:
- Welches Problem hattest du kürzlich?
- Welche Lösung hast du verwendet?
- Ist diese Lösung wiederverwendbar?

Du kannst auch die Projekt-Issues durchsehen:
- Offene Feature Requests
- Enhancement Suggestions
- Bug Reports

### F: Kann mein Beitrag abgelehnt werden?

**A**: Möglich, aber das ist normal. Häufige Gründe:
- Funktionalität existiert bereits
- Konfiguration entspricht nicht den Vorgaben
- Tests fehlen
- Sicherheits- oder Datenschutzprobleme

Maintainer geben detailliertes Feedback, du kannst nach Anpassungen erneut einreichen.

### F: Wie verfolge ich den PR-Status?

**A**: 
1. Status auf der GitHub PR-Seite prüfen
2. Review-Kommentare beachten
3. Auf Maintainer-Feedback reagieren
4. PR bei Bedarf aktualisieren

### F: Kann ich Bugfixes beitragen?

**A**: Natürlich! Bugfixes sind einer der wertvollsten Beiträge:
1. In Issues suchen oder neues Issue erstellen
2. Projekt forken und Bug beheben
3. Tests hinzufügen (falls nötig)
4. PR einreichen, Issue in der Beschreibung referenzieren

### F: Wie halte ich meinen Fork mit Upstream synchron?

**A**:

```bash
# 1. Upstream-Repository hinzufügen (falls noch nicht geschehen)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git

# 2. Upstream-Updates abrufen
git fetch upstream

# 3. Upstream-Updates in deinen main-Branch mergen
git checkout main
git merge upstream/main

# 4. Updates zu deinem Fork pushen
git push origin main

# 5. Auf neuesten main-Branch rebasen
git checkout your-feature-branch
git rebase main
```

## Kontakt

Bei Fragen oder wenn du Hilfe brauchst:

- **Issue öffnen**: [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)
- **Twitter**: [@affaanmustafa](https://x.com/affaanmustafa)
- **E-Mail**: Kontakt über GitHub

::: tip Tipps für Fragen
- Zuerst bestehende Issues und Discussions durchsuchen
- Klaren Kontext und Reproduktionsschritte angeben
- Höflich und konstruktiv bleiben
:::

## Zusammenfassung

Dieses Tutorial hat den Beitragsprozess und die Richtlinien von Everything Claude Code systematisch erklärt:

**Kernphilosophie**:
- Community-Ressource, gemeinsam aufgebaut
- Praxiserprobt, Qualität zuerst
- Modulares Design, leicht wiederverwendbar
- Offene Zusammenarbeit, Wissensaustausch

**Beitragstypen**:
- **Agents**: Spezialisierte Sub-Agents (Sprache, Framework, DevOps, Domänenexperten)
- **Skills**: Workflow-Definitionen und Domänenwissensbasen
- **Commands**: Slash-Befehle (Deployment, Tests, Dokumentation, Code-Generierung)
- **Hooks**: Automatisierungs-Hooks (Linting, Sicherheitsprüfungen, Validierung, Benachrichtigungen)
- **Rules**: Verbindliche Regeln (Sicherheit, Code-Stil, Tests, Benennung)
- **MCP Configurations**: MCP-Server-Konfigurationen (Datenbank, Cloud, Monitoring, Kommunikation)

**Beitragsprozess**:
1. Projekt forken
2. Feature-Branch erstellen
3. Beitrag hinzufügen
4. Formatvorgaben einhalten
5. Lokal testen
6. PR einreichen

**Formatvorgaben**:
- Agent: Front Matter + Beschreibung + Anweisungen
- Skill: When to Use + How It Works + Examples
- Command: Description + Verwendungsbeispiele
- Hook: Matcher + Hooks + Description

**Leitprinzipien**:
- **Do**: Fokussiert, klar, getestet, Mustern folgen, dokumentiert
- **Don't**: Sensible Daten, komplex/Nische, ungetestet, Duplikate, kostenpflichtige Abhängigkeiten

**Dateibenennung**:
- Kleinbuchstaben + Bindestriche
- Beschreibende Benennung
- Übereinstimmung mit Agent/Skill/Command-Namen

**Checkliste**:
- Code-Qualität, Dateispezifikationen, PR-Qualität, Community-Standards

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen wir **[Beispielkonfigurationen: Projekt- und Benutzerebene](../examples/)**.
>
> Du wirst lernen:
> - Best Practices für Projektkonfigurationen
> - Personalisierte Einstellungen auf Benutzerebene
> - Wie du Konfigurationen für spezifische Projekte anpasst
> - Konfigurationsbeispiele aus echten Projekten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Pfade</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Beitragsleitfaden | [`CONTRIBUTING.md`](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) | 1-192 |
| Agent-Beispiel | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | - |
| Skill-Beispiel | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | - |
| Command-Beispiel | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | - |
| Hook-Konfiguration | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Rule-Beispiel | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | - |
| MCP-Konfigurationsbeispiel | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Beispielkonfiguration | [`examples/CLAUDE.md`](https://github.com/affaan-m/everything-claude-code/blob/main/examples/CLAUDE.md) | - |

**Wichtige Front Matter-Felder**:
- `name`: Agent/Skill/Command-Identifier
- `description`: Funktionsbeschreibung
- `tools`: Erlaubte Tools (Agent)
- `model`: Bevorzugtes Modell (Agent, optional)

**Wichtige Verzeichnisstruktur**:
- `agents/`: 9 spezialisierte Sub-Agents
- `skills/`: 11 Workflow-Definitionen
- `commands/`: 14 Slash-Befehle
- `rules/`: 8 Regelsets
- `hooks/`: Automatisierungs-Hook-Konfiguration
- `mcp-configs/`: MCP-Server-Konfiguration
- `examples/`: Beispielkonfigurationsdateien

**Beitragsbezogene Links**:
- GitHub Issues: https://github.com/affaan-m/everything-claude-code/issues
- Twitter: https://x.com/affaanmustafa

</details>
