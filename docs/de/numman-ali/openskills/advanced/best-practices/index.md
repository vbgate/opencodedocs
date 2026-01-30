---
title: "Best Practices: Projektkonfiguration und Teamzusammenarbeit | OpenSkills"
sidebarTitle: "5 Minuten Team-Skills konfigurieren"
subtitle: "Best Practices: Projektkonfiguration und Teamzusammenarbeit"
description: "Lernen Sie die Best Practices von OpenSkills. Beherrschen Sie lokale vs. globale Installation, Universal-Modus-Konfiguration, SKILL.md-Schreibstandards und CI/CD-Integration zur Verbesserung der Teamzusammenarbeitseffizienz."
tags:
  - "advanced"
  - "best-practices"
  - "skills"
  - "team"
prerequisite:
  - "start-quick-start"
  - "start-installation"
  - "start-first-skill"
order: 8
---

# Best Practices

## Was Sie nach diesem Tutorial können

- Die passende Skill-Installationsmethode je nach Projektanforderungen auswählen (projekt-lokal vs. global vs. Universal)
- Konforme SKILL.md-Dateien erstellen (Benennung, Beschreibung, Anweisungen)
- Symbolische Links für effiziente lokale Entwicklung verwenden
- Skill-Versionen und Updates verwalten
- In Teamumgebungen mit Skills zusammenarbeiten
- OpenSkills in CI/CD-Prozesse integrieren

## Ihre aktuelle Situation

Sie haben bereits gelernt, wie man Skills installiert und verwendet, stoßen aber in praktischen Projekten auf folgende Probleme:

- Sollten Skills im Projektverzeichnis oder global installiert werden?
- Wie können mehrere KI-Agenten Skills gemeinsam nutzen?
- Die Skills wurden oft geschrieben, aber die KI merkt sie sich nicht
- Teammitglieder installieren Skills jeweils separat, Versionen sind inkonsistent
- Nach lokalen Änderungen an Skills ist die Neuinstallation bei jedem Mal zu umständlich

In dieser Lektion fassen wir die Best Practices von OpenSkills zusammen und helfen Ihnen, diese Probleme zu lösen.

## Wann sollten Sie diesen Ansatz verwenden

- **Projektkonfigurationsoptimierung**: Auswahl des passenden Skill-Installationsorts je nach Projekttyp
- **Multi-Agent-Umgebung**: Gleichzeitige Verwendung von Claude Code, Cursor, Windsurf und anderen Tools
- **Skill-Standardisierung**: Vereinheitlichung von Skill-Formaten und Schreibstandards im Team
- **Lokale Entwicklung**: Schnelle Iteration und Test von Skills
- **Teamzusammenarbeit**: Gemeinsame Nutzung von Skills, Versionskontrolle, CI/CD-Integration

## 🎒 Vorbereitungen vor dem Start

::: warning Vorprüfung

Bevor Sie beginnen, stellen Sie sicher:

- ✅ [Schnellstart](../../start/quick-start/) abgeschlossen
- ✅ Mindestens einen Skill installiert und mit AGENTS.md synchronisiert
- ✅ [Grundlegendes SKILL.md-Format](../../start/what-is-openskills/) verstanden

:::

## Best Practices für Projektkonfiguration

### 1. Projekt-lokal vs. global vs. Universal-Installation

Die Auswahl des passenden Installationsorts ist der erste Schritt der Projektkonfiguration.

#### Projekt-lokale Installation (Standard)

**Anwendungsszenario**: Projekt-spezifische Skills

```bash
# Installation in .claude/skills/
npx openskills install anthropics/skills
```

**Vorteile**:

- ✅ Skills werden mit dem Projekt versioniert
- ✅ Verschiedene Projekte verwenden verschiedene Skill-Versionen
- ✅ Keine globale Installation erforderlich, reduziert Abhängigkeiten

**Empfohlene Vorgehensweise**:

- Projekt-spezifische Skills (z. B. Build-Prozesse für bestimmte Frameworks)
- Intern entwickelte Business-Skills des Teams
- Skills, die von der Projektkonfiguration abhängen

#### Globale Installation

**Anwendungsszenario**: Für alle Projekte gemeinsame Skills

```bash
# Installation in ~/.claude/skills/
npx openskills install anthropics/skills --global
```

**Vorteile**:

- ✅ Alle Projekte nutzen denselben Skill-Satz
- ✅ Keine separate Installation für jedes Projekt erforderlich
- ✅ Zentrale Verwaltung von Updates

**Empfohlene Vorgehensweise**:

- Offizielle Anthropic Skill-Bibliothek (anthropics/skills)
- Allgemeine Tool-Skills (z. B. PDF-Verarbeitung, Git-Operationen)
- Häufig verwendete persönliche Skills

#### Universal-Modus (Multi-Agent-Umgebung)

**Anwendungsszenario**: Gleichzeitige Verwendung mehrerer KI-Agenten

```bash
# Installation in .agent/skills/
npx openskills install anthropics/skills --universal
```

**Prioritätsreihenfolge** (von hoch nach niedrig):

1. `./.agent/skills/` (projekt-lokales Universal)
2. `~/.agent/skills/` (globales Universal)
3. `./.claude/skills/` (projekt-lokales Claude Code)
4. `~/.claude/skills/` (globales Claude Code)

**Empfohlene Vorgehensweise**:

- ✅ Verwendung bei mehreren Agenten (Claude Code + Cursor + Windsurf)
- ✅ Vermeidung von Konflikten mit Claude Code Marketplace
- ✅ Einheitliche Verwaltung aller Agenten-Skills

::: tip Wann sollte der Universal-Modus verwendet werden?

Wenn Ihre AGENTS.md von Claude Code und anderen Agenten gemeinsam genutzt wird, verwenden Sie `--universal`, um Skill-Konflikte zu vermeiden. Der Universal-Modus verwendet das Verzeichnis `.agent/skills/`, das vom `.claude/skills/` von Claude Code isoliert ist.

:::

### 2. Vorzug von npx statt globaler Installation

OpenSkills ist für die sofortige Verwendung konzipiert, es wird empfohlen, immer `npx` zu verwenden:

```bash
# ✅ Empfohlen: npx verwenden
npx openskills install anthropics/skills
npx openskills sync
npx openskills list

# ❌ Vermeiden: Direktes Aufrufen nach globaler Installation
openskills install anthropics/skills
```

**Vorteile**:

- ✅ Keine globale Installation erforderlich, Vermeidung von Versionskonflikten
- ✅ Immer die neueste Version verwenden (npx aktualisiert automatisch)
- ✅ Reduzierung von Systemabhängigkeiten

**Wann ist eine globale Installation erforderlich**:

- In CI/CD-Umgebungen (aus Leistungsgründen)
- Häufiges Aufrufen in Skripten (Reduzierung der npx-Startzeit)

```bash
# Globale Installation in CI/CD oder Skripten
npm install -g openskills
openskills install anthropics/skills -y
openskills sync -y
```

## Best Practices für Skill-Verwaltung

### 1. SKILL.md-Schreibstandards

#### Benennungskonvention: Bindestrich-Format

**Regeln**:

- ✅ Richtig: `pdf-editor`, `api-client`, `git-workflow`
- ❌ Falsch: `PDF Editor` (Leerzeichen), `pdf_editor` (Unterstrich), `PdfEditor` (CamelCase)

**Grund**: Das Bindestrich-Format ist ein URL-freundlicher Bezeichner, entspricht GitHub-Repository- und Dateisystem-Benennungskonventionen.

#### Beschreibungsschreiben: Dritte Person, 1-2 Sätze

**Regeln**:

- ✅ Richtig: `Use this skill for comprehensive PDF manipulation.`
- ❌ Falsch: `You should use this skill to manipulate PDFs.` (zweite Person)

**Beispielvergleich**:

| Szenario | ❌ Falsch (zweite Person) | ✅ Richtig (dritte Person) |
|--- | ---|---|
| PDF-Skill | You can use this to extract text from PDFs. | Extract text from PDFs with this skill. |
| Git-Skill | When you need to manage branches, use this. | Manage Git branches with this skill. |
| API-Skill | If you want to call the API, load this skill. | Call external APIs with this skill. |

#### Anweisungsschreiben: Imperativ/Infinitiv-Form

**Regeln**:

- ✅ Richtig: `"To accomplish X, execute Y"`
- ✅ Richtig: `"Load this skill when Z"`
- ❌ Falsch: `"You should do X"`
- ❌ Falsch: `"If you need Y"`

**Schreibmerksatz**:

1. **Verb am Anfang**: "Create" → "Use" → "Return"
2. **"You" weglassen**: Nicht "You should" sagen
3. **Klaren Pfad angeben**: Ressourcen mit `references/` am Anfang referenzieren

**Beispielvergleich**:

| ❌ Falsche Schreibweise | ✅ Richtige Schreibweise |
|--- |---|
| "You should create a file" | "Create a file" |
| "When you want to load this skill" | "Load this skill when" |
| "If you need to see the docs" | "See references/guide.md" |

::: tip Warum Imperativ/Infinitiv?

Dieser Schreibstil erleichtert es KI-Agenten, Anweisungen zu parsen und auszuführen. Die Imperativ- (Befehls-) und Infinitiv- (unbestimmte-)Form eliminieren das Subjekt "Sie" und machen Anweisungen direkter und klarer.

:::

### 2. Dateigrößenkontrolle

**SKILL.md-Dateigröße**:

- ✅ **Empfohlen**: Innerhalb von 5000 Wörtern
- ⚠️ **Warnung**: Über 8000 Wörter können zu Kontextbegrenzung führen
- ❌ **Verboten**: Über 10000 Wörter

**Kontrollmethode**:

Verschieben Sie ausführliche Dokumentation in das `references/`-Verzeichnis:

```markdown
# SKILL.md (Kernanweisungen)

## Instructions

To process data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format  # Ausführliche Dokumentation
3. Process the result

## Bundled Resources

For detailed API documentation, see:
- `references/api-docs.md`  # Wird nicht in den Kontext geladen, spart Token
- `references/examples.md`
```

**Dateigrößenvergleich**:

| Datei | Größenbeschränkung | In Kontext geladen |
|--- |---|---|
| `SKILL.md` | < 5000 Wörter | ✅ Ja |
| `references/` | Unbegrenzt | ❌ Nein (bei Bedarf geladen) |
| `scripts/` | Unbegrenzt | ❌ Nein (ausführbar) |
| `assets/` | Unbegrenzt | ❌ Nein (Vorlagendateien) |

### 3. Skill-Suchpriorität

OpenSkills sucht Skills nach folgender Priorität (von hoch nach niedrig):

```
1. ./.agent/skills/        # Universal projekt-lokal
2. ~/.agent/skills/        # Universal global
3. ./.claude/skills/      # Claude Code projekt-lokal
4. ~/.claude/skills/      # Claude Code global
```

**Deduplizierungsmechanismus**:

- Gleichnamige Skills geben nur den zuerst gefundenen zurück
- Projekt-lokale Skills haben Vorrang vor globalen Skills

**Beispielszenario**:

```
Projekt A:
- .claude/skills/pdf        # Projekt-lokale Version v1.0
- ~/.claude/skills/pdf     # Globale Version v2.0

# openskills read pdf lädt .claude/skills/pdf (v1.0)
```

**Empfehlung**:

- Skills mit speziellen Projektanforderungen werden projekt-lokal platziert
- Gemeinsame Skills werden global platziert
- Multi-Agent-Umgebungen verwenden den Universal-Modus

## Best Practices für lokale Entwicklung

### 1. Verwendung von symbolischen Links für iterative Entwicklung

**Problem**: Nach jeder Änderung an Skills muss eine Neuinstallation durchgeführt werden, die Entwicklungseffizienz ist gering.

**Lösung**: Verwendung von symbolischen Links (symlink)

```bash
# 1. Skill-Repository in Entwicklungsvzeichnis klonen
git clone git@github.com:your-org/my-skills.git ~/dev/my-skills

# 2. Skill-Verzeichnis erstellen
mkdir -p .claude/skills

# 3. Symbolischen Link erstellen
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill

# 4. Mit AGENTS.md synchronisieren
npx openskills sync
```

**Vorteile**:

- ✅ Änderungen an Quelldateien wirken sofort (keine Neuinstallation erforderlich)
- ✅ Unterstützung für git-basierte Updates (einfach Pull)
- ✅ Mehrere Projekte nutzen dieselbe Skill-Entwicklungsversion

**Symbolischen Link verifizieren**:

```bash
# Symbolischen Link anzeigen
ls -la .claude/skills/

# Beispielausgabe:
# my-skill -> /Users/yourname/dev/my-skills/my-skill
```

**Hinweise**:

- ✅ Symbolische Links werden von `openskills list` erkannt
- ✅ Defekte symbolische Links werden automatisch übersprungen (kein Absturz)
- ⚠️ Windows-Benutzer müssen Git Bash oder WSL verwenden (Windows unterstützt nativ keine symbolischen Links)

### 2. Mehrere Projekte teilen Skills

**Szenario**: Mehrere Projekte müssen denselben Skill-Satz des Teams verwenden.

**Methode 1: Globale Installation**

```bash
# Team-Skill-Repository global installieren
npx openskills install your-org/team-skills --global
```

**Methode 2: Symbolischer Link zu Entwicklungsvzeichnis**

```bash
# In jedem Projekt einen symbolischen Link erstellen
ln -s ~/dev/team-skills/my-skill .claude/skills/my-skill
```

**Methode 3: Git Submodule**

```bash
# Skill-Repository als Submodul hinzufügen
git submodule add git@github.com:your-org/team-skills.git .claude/skills

# Submodul aktualisieren
git submodule update --init --recursive
```

**Empfohlene Auswahl**:

| Methode | Anwendungsszenario | Vorteile | Nachteile |
|--- |---|---|---|
| Globale Installation | Alle Projekte teilen vereinheitlichte Skills | Zentrale Verwaltung, Updates einfach | Keine projektspezifische Anpassung möglich |
| Symbolischer Link | Lokale Entwicklung und Test | Änderungen wirken sofort | Manuelle Erstellung von Links erforderlich |
| Git Submodule | Teamzusammenarbeit, Versionskontrolle | Mit Projekt versioniert | Submodul-Verwaltung komplex

## Best Practices für Teamzusammenarbeit

### 1. Skill-Versionskontrolle

**Best Practice**: Skill-Repository unabhängig versionieren

```bash
# Team-Skill-Repository-Struktur
team-skills/
├── .git/
├── pdf-editor/
│   └── SKILL.md
├── api-client/
│   └── SKILL.md
└── git-workflow/
    └── SKILL.md
```

**Installationsmethode**:

```bash
# Skills aus Team-Repository installieren
npx openskills install git@github.com:your-org/team-skills.git
```

**Update-Prozess**:

```bash
# Alle Skills aktualisieren
npx openskills update

# Bestimmte Skills aktualisieren
npx openskills update pdf-editor,api-client
```

**Empfehlungen für Versionsverwaltung**:

- Git-Tags verwenden, um stabile Versionen zu markieren: `v1.0.0`, `v1.1.0`
- Skill-Version in AGENTS.md aufzeichnen: `<skill name="pdf-editor" version="1.0.0">`
- In CI/CD feste Verwendung stabiler Versionen

### 2. Skill-Benennungskonventionen

**Vereinheitlichte Team-Benennungskonventionen**:

| Skill-Typ | Benennungsmuster | Beispiel |
|--- |---|---|
| Allgemeine Tools | `<tool-name>` | `pdf`, `git`, `docker` |
| Framework-bezogen | `<framework>-<purpose>` | `react-component`, `django-model` |
| Workflows | `<workflow>` | `ci-cd`, `code-review` |
| Team-exklusiv | `<team>-<purpose>` | `team-api`, `company-deploy` |

**Beispiele**:

```bash
# ✅ Vereinheitlichte Benennung
team-skills/
├── pdf/                     # PDF-Verarbeitung
├── git-workflow/           # Git-Workflow
├── react-component/        # React-Komponentengenerierung
└── team-api/             # Team-API-Client
```

### 3. Skill-Dokumentationsstandards

**Vereinheitlichte Team-Dokumentationsstruktur**:

```markdown
---
name: <skill-name>
description: <1-2 Sätze, dritte Person>
author: <Team/Autor>
version: <Versionsnummer>
---

# <Skill-Titel>

## When to Use

Load this skill when:
- Szenario 1
- Szenario 2

## Instructions

To accomplish task:

1. Schritt 1
2. Schritt 2

## Bundled Resources

For detailed information:
- `references/api-docs.md`
- `scripts/helper.py`
```

**Prüfliste**:

- [ ] `name` verwendet Bindestrich-Format
- [ ] `description` ist 1-2 Sätze, dritte Person
- [ ] Anweisungen verwenden imperative/infinitive Form
- [ ] Enthält `author` und `version`-Felder (Team-Standard)
- [ ] Ausführliche `When to Use`-Erklärung

## Best Practices für CI/CD-Integration

### 1. Nicht-interaktive Installation und Synchronisation

**Szenario**: Automatisierte Skill-Verwaltung in CI/CD-Umgebungen

**Verwenden Sie das `-y`-Flag, um interaktive Eingabeaufforderungen zu überspringen**:

```bash
# CI/CD-Skript-Beispiel
#!/bin/bash

# Skills installieren (nicht-interaktiv)
npx openskills install anthropics/skills -y
npx openskills install git@github.com:your-org/team-skills.git -y

# Mit AGENTS.md synchronisieren (nicht-interaktiv)
npx openskills sync -y
```

**GitHub Actions-Beispiel**:

```yaml
name: Setup Skills

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install OpenSkills
        run: npx openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Verify Skills
        run: npx openskills list
```

### 2. Skill-Update-Automatisierung

**Zeitgesteuerte Skill-Updates**:

```yaml
# .github/workflows/update-skills.yml
name: Update Skills

on:
  schedule:
    - cron: '0 0 * * 0'  # Jeden Sonntag aktualisieren
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update Skills
        run: npx openskills update -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add AGENTS.md
          git diff --staged --quiet || git commit -m "Update skills"
          git push
```

### 3. Benutzerdefinierter Ausgabepfad

**Szenario**: Skills in benutzerdefinierte Datei synchronisieren (z. B. `.ruler/AGENTS.md`)

```bash
# Mit benutzerdefinierter Datei synchronisieren
npx openskills sync -o .ruler/AGENTS.md -y
```

**CI/CD-Beispiel**:

```yaml
# Verschiedene AGENTS.md für verschiedene KI-Agenten generieren
- name: Sync für Claude Code
  run: npx openskills sync -o AGENTS.md -y

- name: Sync für Cursor
  run: npx openskills sync -o .cursor/AGENTS.md -y

- name: Sync für Windsurf
  run: npx openskills sync -o .windsurf/AGENTS.md -y
```

## Häufige Probleme und Lösungen

### Problem 1: Skill nicht gefunden

**Symptome**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Fehlersuche**:

1. Prüfen, ob der Skill installiert ist:
   ```bash
   npx openskills list
   ```

2. Prüfen, ob der Skill-Name korrekt ist (Groß-/Kleinschreibung beachten):
   ```bash
   # ❌ Falsch
   npx openskills read My-Skill

   # ✅ Richtig
   npx openskills read my-skill
   ```

3. Prüfen, ob der Skill in einem Verzeichnis mit höherer Priorität überschrieben wurde:
   ```bash
   # Skill-Position anzeigen
   ls -la .claude/skills/my-skill
   ls -la ~/.claude/skills/my-skill
   ```

### Problem 2: Symbolischer Link kann nicht zugegriffen werden

**Symptome**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Lösung**:

- **macOS**: In den Systemeinstellungen symbolische Links erlauben
- **Windows**: Git Bash oder WSL verwenden (Windows unterstützt nativ keine symbolischen Links)
- **Linux**: Dateisystemberechtigungen prüfen

### Problem 3: Skill-Update hat keine Wirkung

**Symptome**:

```bash
npx openskills update
# ✅ Skills updated successfully

npx openskills read my-skill
# Inhalt ist immer noch die alte Version
```

**Ursache**: Der KI-Agent hat alte Skill-Inhalte zwischengespeichert.

**Lösung**:

1. AGENTS.md erneut synchronisieren:
   ```bash
   npx openskills sync
   ```

2. Zeitstempel der Skill-Datei prüfen:
   ```bash
   ls -la .claude/skills/my-skill/SKILL.md
   ```

3. Wenn symbolische Links verwendet werden, Skill neu laden:
   ```bash
   npx openskills read my-skill
   ```

## Zusammenfassung dieser Lektion

Kernpunkte der OpenSkills-Best Practices:

### Projektkonfiguration

- ✅ Projekt-lokale Installation: Projekt-spezifische Skills
- ✅ Globale Installation: Für alle Projekte gemeinsame Skills
- ✅ Universal-Modus: Multi-Agent-Umgebung teilt Skills
- ✅ Vorzug von `npx` statt globaler Installation

### Skill-Verwaltung

- ✅ SKILL.md-Schreibstandards: Bindestrich-Benennung, Beschreibung in dritter Person, imperative Anweisungen
- ✅ Dateigrößenkontrolle: SKILL.md < 5000 Wörter, ausführliche Dokumentation in `references/`
- ✅ Skill-Suchpriorität: Verständnis der 4 Verzeichnisprioritäten und Deduplizierungsmechanismus

### Lokale Entwicklung

- ✅ Verwendung von symbolischen Links für iterative Entwicklung
- ✅ Mehrere Projekte teilen Skills: Globale Installation, symbolische Links, Git Submodule

### Teamzusammenarbeit

- ✅ Skill-Versionskontrolle: Unabhängiges Repository, Git-Tags
- ✅ Vereinheitlichte Benennungskonventionen: Tools, Frameworks, Workflows
- ✅ Vereinheitlichte Dokumentationsstandards: author, version, When to Use

### CI/CD-Integration

- ✅ Nicht-interaktive Installation und Synchronisation: `-y`-Flag
- ✅ Automatisierte Updates: Zeitgesteuerte Aufgaben, workflow_dispatch
- ✅ Benutzerdefinierter Ausgabepfad: `-o`-Flag

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Häufig gestellte Fragen](../faq/faq/)**.
>
> Sie werden lernen:
> - Schnelle Antworten auf häufig gestellte Fragen zu OpenSkills
> - Fehlersuche bei Installationsfehlern, Skills nicht geladen usw.
> - Konfigurationstipps für die Koexistenz mit Claude Code

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Position</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|--- |---|---|
| Skill-Suchpriorität | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| Skill-Deduplizierungsmechanismus | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 42-43, 57 |
| Verwaltung symbolischer Links | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 10-25 |
| YAML-Feldextraktion | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Pfad-Durchlauf-Schutz | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 71-78 |
| Nicht-interaktive Installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 424 |
| Benutzerdefinierter Ausgabepfad | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 19-36 |

**Wichtige Konstanten**:
- 4 Skill-Suchverzeichnisse: `./.agent/skills/`, `~/.agent/skills/`, `./.claude/skills/`, `~/.claude/skills/`

**Wichtige Funktionen**:
- `getSearchDirs(): string[]` - Gibt nach Priorität sortierte Skill-Suchverzeichnisse zurück
- `isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean` - Prüft, ob es sich um ein Verzeichnis oder einen symbolischen Link zu einem Verzeichnis handelt
- `extractYamlField(content: string, field: string): string` - Extrahiert YAML-Feldwert (nicht gieriger Abgleich)
- `isPathInside(path: string, targetDir: string): boolean` - Überprüft, ob Pfad im Zielverzeichnis liegt (verhindert Pfad-Durchlauf)

**Beispiel-Skill-Dateien**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Minimales Strukturbeispiel
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Formatstandard-Referenz

</details>
