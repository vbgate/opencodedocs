---
title: "Skill erstellen: SKILL.md schreiben | openskills"
sidebarTitle: "Einen Skill schreiben"
subtitle: "Skill erstellen: SKILL.md schreiben"
description: "Lernen Sie, wie Sie von Grund auf einen benutzerdefinierten Skill erstellen, das SKILL.md-Format und YAML-Frontmatter-Spezifikationen beherrschen. Mit vollständigen Beispielen und symbolischem Link-Entwicklungsworkflow können Sie schnell mit der Skill-Erstellung beginnen und sicherstellen, dass diese den Anthropic-Standards entspricht."
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "start-quick-start"
  - "start-first-skill"
order: 4
---

# Benutzerdefinierten Skill erstellen

## Was Sie lernen werden

- Eine vollständige SKILL.md-Skill-Datei von Grund auf erstellen
- YAML-Frontmatter entsprechend den Anthropic-Standards schreiben
- Eine sinnvolle Skill-Verzeichnisstruktur entwerfen (references/, scripts/, assets/)
- Symbolische Links für lokale Entwicklung und Iteration verwenden
- Benutzerdefinierte Skills mit dem Befehl `openskills` installieren und validieren

## Ihre aktuelle Situation

Sie möchten, dass ein KI-Agent ein spezifisches Problem für Sie löst, aber in der vorhandenen Skill-Bibliothek gibt es keine passende Lösung. Sie haben versucht, die Anforderungen im Dialog immer wieder zu beschreiben, aber die KI vergisst sie oder führt sie unvollständig aus. Sie brauchen eine Möglichkeit, **Fachwissen zu kapseln**, damit KI-Agenten es stabil und zuverlässig wiederverwenden können.

## Wann Sie diese Methode verwenden sollten

- **Workflows kapseln**: Wiederkehrende Arbeitsschritte als Skill schreiben, damit die KI sie auf einmal ausführt
- **Teamwissen dokumentieren**: Interne Richtlinien, API-Dokumentationen und Skripte als Skill bündeln und allen Teammitgliedern zur Verfügung stellen
- **Tool-Integration**: Spezielle Skills für bestimmte Tools (z. B. PDF-Verarbeitung, Datenbereinigung, Deployment-Prozesse) erstellen
- **Lokale Entwicklung**: Skills während der Entwicklung in Echtzeit modifizieren und testen, ohne sie wiederholt installieren zu müssen

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen prüfen

Bevor Sie beginnen, stellen Sie sicher, dass:

- ✅ [OpenSkills](/de/start/installation/) installiert ist
- ✅ Mindestens ein Skill installiert und synchronisiert wurde (Grundlagen des Workflows verstehen)
- ✅ Grundlegende Markdown-Syntax bekannt ist

:::

## Kernkonzept

### Was ist SKILL.md?

**SKILL.md** ist das Standardformat des Anthropic-Skill-Systems. Es verwendet YAML-Frontmatter zur Beschreibung der Skill-Metadaten und Markdown-Text für die Ausführungsanweisungen. Es hat drei Kernvorteile:

1. **Einheitliches Format** - Alle Agenten (Claude Code, Cursor, Windsurf usw.) verwenden dieselbe Skill-Beschreibung
2. **Progressives Laden** - Der vollständige Inhalt wird nur bei Bedarf geladen, um den KI-Kontext schlank zu halten
3. **Bündelbare Ressourcen** - Unterstützt drei Arten zusätzlicher Ressourcen: references/, scripts/ und assets/

### Minimal vs. vollständige Struktur

**Minimale Struktur** (geeignet für einfache Skills):
```
my-skill/
└── SKILL.md # Nur eine Datei
```

**Vollständige Struktur** (geeignet für komplexe Skills):
```
my-skill/
├── SKILL.md # Kernanweisungen (< 5000 Wörter)
├── references/ # Detaillierte Dokumentation (bei Bedarf laden)
│   └── api-docs.md
├── scripts/ # Ausführbare Skripte
│   └── helper.py
└── assets/ # Vorlagen und Ausgabedateien
    └── template.json
```

::: info Wann wird die vollständige Struktur verwendet?

- **references/**: Wenn API-Dokumentationen, Datenbank-Schemas oder detaillierte Anleitungen 5000 Wörter überschreiten
- **scripts/**: Wenn deterministische, wiederholbare Aufgaben ausgeführt werden müssen (z. B. Datentransformation, Formatierung)
- **assets/**: Wenn Ausgabevorlagen, Bilder oder Boilerplate-Code benötigt werden

:::

## Schritt für Schritt

### Schritt 1: Skill-Verzeichnis erstellen

**Warum**: Ein unabhängiges Verzeichnis zur Organisation der Skill-Dateien erstellen

```bash
mkdir my-skill
cd my-skill
```

**Sie sollten sehen**: Das aktuelle Verzeichnis ist leer

---

### Schritt 2: SKILL.md-Kernstruktur schreiben

**Warum**: SKILL.md muss mit YAML-Frontmatter beginnen, um die Skill-Metadaten zu definieren

Erstellen Sie die Datei `SKILL.md`:

```markdown
---
name: my-skill # Erforderlich: Bezeichner im Bindestrich-Format
description: When to use this skill. # Erforderlich: 1-2 Sätze, dritte Person
---

# Skill-Titel

Detaillierte Beschreibung des Skills.
```

**Validierungspunkte**:

- ✅ Die erste Zeile ist `---`
- ✅ Enthält das Feld `name` (Bindestrich-Format, z. B. `pdf-editor`, `api-client`)
- ✅ Enthält das Feld `description` (1-2 Sätze, dritte Person)
- ✅ Nach dem YAML-Block erneut `---` verwenden

::: danger Häufige Fehler

| Fehlerbeispiel | Korrektur |
|---|---|
| `name: My Skill` (Leerzeichen) | Ändern zu `name: my-skill` (Bindestrich) |
| `description: You should use this for...` (zweite Person) | Ändern zu `description: Use this skill for...` (dritte Person) |
| `description` zu lang (mehr als 100 Wörter) | Auf 1-2 Sätze zusammenfassen |

:::

---

### Schritt 3: Anweisungsinhalt schreiben

**Warum**: Anweisungen sagen dem KI-Agenten, wie eine Aufgabe ausgeführt werden soll. Sie müssen die imperative/Infinitiv-Form verwenden

Bearbeiten Sie `SKILL.md` weiter:

```markdown
---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill

## When to Use

Load this skill when:
- Demonstrating instruction writing patterns
- Understanding imperative/infinitive form
- Learning SKILL.md format

## Instructions

To execute this skill:

1. Read the user's input
2. Process the data
3. Return the result

For detailed information, see references/guide.md
```

**Schreibrichtlinien**:

| ✅ Korrekte Schreibweise (imperativ/Infinitiv) | ❌ Falsche Schreibweise (zweite Person) |
|---|---|
| "To accomplish X, execute Y" | "You should do X" |
| "Load this skill when Z" | "If you need Y" |
| "See references/guide.md" | "When you want Z" |

::: tip Merksatz

**Drei Prinzipien für Anweisungen**:
1. **Verb am Anfang**: "Create" → "Use" → "Return"
2. **"You" weglassen**: Nicht "You should" sagen
3. **Klare Pfade**: Ressourcen mit `references/` am Anfang referenzieren

:::

---

### Schritt 4: Bundled Resources hinzufügen (optional)

**Warum**: Wenn ein Skill umfangreiche detaillierte Dokumentation oder ausführbare Skripte benötigt, verwenden Sie bundled resources, um SKILL.md übersichtlich zu halten

#### 4.1 references/ hinzufügen

```bash
mkdir references
```

Erstellen Sie `references/api-docs.md`:

```markdown
# API Documentation

## Overview

This section provides detailed API information...

## Endpoints

### GET /api/data

Returns processed data.

Response:
```json
{
  "status": "success",
  "data": [...]
}
```
```

In `SKILL.md` referenzieren:

```markdown
## Instructions

To fetch data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format
3. Process the result
```

#### 4.2 scripts/ hinzufügen

```bash
mkdir scripts
```

Erstellen Sie `scripts/process.py`:

```python
#!/usr/bin/env python3
import sys

def main():
    # Processing logic
    print("Processing complete")

if __name__ == "__main__":
    main()
```

In `SKILL.md` referenzieren:

```markdown
## Instructions

To process data:

1. Execute the script:
```bash
python scripts/process.py
```
2. Review the output
```

::: info Vorteile von scripts/

- **Nicht in Kontext laden**: Spart Token, geeignet für große Dateien
- **Unabhängig ausführbar**: KI-Agenten können sie direkt aufrufen, ohne den Inhalt zuerst zu laden
- **Geeignet für deterministische Aufgaben**: Datentransformation, Formatierung, Generierung usw.

:::

#### 4.3 assets/ hinzufügen

```bash
mkdir assets
```

Vorlagendatei `assets/template.json` hinzufügen:

```json
{
  "title": "{{ title }}",
  "content": "{{ content }}"
}
```

In `SKILL.md` referenzieren:

```markdown
## Instructions

To generate output:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
```

---

### Schritt 5: SKILL.md-Format validieren

**Warum**: Vor der Installation das Format validieren, um Installationsfehler zu vermeiden

```bash
npx openskills install ./my-skill
```

**Sie sollten sehen**:

```
✔ Found skill: my-skill
Description: Use this skill to demonstrate how to write proper instructions.
Size: 1.2 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

Wählen Sie den Skill aus und drücken Sie Enter, Sie sollten sehen:

```
✔ Installing my-skill...
✔ Skill installed successfully to .claude/skills/my-skill

Next steps:
Run: npx openskills sync
Then: Ask your AI agent to use the skill
```

::: tip Validierungs-Checkliste

Vor der Installation folgende Punkte prüfen:

- [ ] SKILL.md beginnt mit `---`
- [ ] Enthält die Felder `name` und `description`
- [ ] `name` verwendet Bindestrich-Format (`my-skill` statt `my_skill`)
- [ ] `description` ist eine Zusammenfassung in 1-2 Sätzen
- [ ] Anweisungen verwenden die imperative/Infinitiv-Form
- [ ] Alle `references/`, `scripts/`, `assets/`-Referenzpfade sind korrekt

:::

---

### Schritt 6: Mit AGENTS.md synchronisieren

**Warum**: Dem KI-Agenten mitteilen, dass dieser Skill verfügbar ist

```bash
npx openskills sync
```

**Sie sollten sehen**:

```
✔ Found 1 skill:
☑ my-skill

✔ Syncing to AGENTS.md...
✔ Updated AGENTS.md successfully
```

Überprüfen Sie die generierte `AGENTS.md`:

```markdown
<!-- SKILLS_SYSTEM_START -->
...
<available_skills>
<skill name="my-skill">Use this skill to demonstrate how to write proper instructions.</skill>
</available_skills>
...
<!-- SKILLS_SYSTEM_END -->
```

---

### Schritt 7: Skill-Laden testen

**Warum**: Validieren, dass der Skill korrekt in den KI-Kontext geladen werden kann

```bash
npx openskills read my-skill
```

**Sie sollten sehen**:

```
Loading skill: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill
... (vollständiger SKILL.md-Inhalt)
```

## Checkpunkt ✅

Nach Abschluss der obigen Schritte sollten Sie:

- ✅ Ein Skill-Verzeichnis mit SKILL.md erstellt haben
- ✅ SKILL.md enthält korrektes YAML-Frontmatter und Markdown-Inhalt
- ✅ Skill erfolgreich in `.claude/skills/` installiert
- ✅ Skill mit AGENTS.md synchronisiert
- ✅ Mit `openskills read` den Skill-Inhalt laden können

## Fallstricke

### Problem 1: "Invalid SKILL.md (missing YAML frontmatter)" bei Installation

**Ursache**: SKILL.md beginnt nicht mit `---`

**Lösung**: Prüfen, ob die erste Zeile `---` ist, nicht `# My Skill` oder anderer Inhalt

---

### Problem 2: KI-Agent erkennt Skill nicht

**Ursache**: `openskills sync` nicht ausgeführt oder AGENTS.md nicht aktualisiert

**Lösung**: Führen Sie `npx openskills sync` aus und prüfen Sie, ob AGENTS.md den Skill-Eintrag enthält

---

### Problem 3: Ressourcenpfad-Auflösungsfehler

**Ursache**: In SKILL.md wurde ein absoluter Pfad oder falscher relativer Pfad verwendet

**Lösung**:
- ✅ Korrekt: `references/api-docs.md` (relativer Pfad)
- ❌ Falsch: `/path/to/skill/references/api-docs.md` (absoluter Pfad)
- ❌ Falsch: `../other-skill/references/api-docs.md` (Skill-übergreifende Referenz)

---

### Problem 4: SKILL.md zu lang, Token-Limit überschritten

**Ursache**: SKILL.md überschreitet 5000 Wörter oder enthält umfangreiche detaillierte Dokumentation

**Lösung**: Detaillierte Inhalte in das Verzeichnis `references/` verschieben und in SKILL.md referenzieren

## Lektionszusammenfassung

Kernschritte zum Erstellen eines benutzerdefinierten Skills:

1. **Verzeichnisstruktur erstellen**: Minimale Struktur (nur SKILL.md) oder vollständige Struktur (mit references/, scripts/, assets/)
2. **YAML-Frontmatter schreiben**: Erforderliche Felder `name` (Bindestrich-Format) und `description` (1-2 Sätze)
3. **Anweisungsinhalt schreiben**: Imperative/Infinitiv-Form verwenden, zweite Person vermeiden
4. **Ressourcen hinzufügen** (optional): references/, scripts/, assets/
5. **Format validieren**: Mit `openskills install ./my-skill` validieren
6. **Mit AGENTS.md synchronisieren**: `openskills sync` ausführen, damit der KI-Agent informiert ist
7. **Laden testen**: Mit `openskills read my-skill` das Laden validieren

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Skill-Struktur im Detail](../skill-structure/)**.
>
> Sie werden lernen:
> - Vollständige Feldbeschreibung von SKILL.md
> - Best Practices für references/, scripts/, assets/
> - Wie man Lesbarkeit und Wartbarkeit von Skills optimiert

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Position anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|---|---|---|
| YAML-Frontmatter-Validierung | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14 |
| YAML-Feldextraktion | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Formatvalidierung bei Installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |
| Skill-Namenextraktion | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 344-345 |

**Beispiel-Skill-Dateien**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Beispiel für minimale Struktur
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Format-Spezifikationsreferenz

**Schlüsselfunktionen**:
- `hasValidFrontmatter(content: string): boolean` - Validieren, ob SKILL.md mit `---` beginnt
- `extractYamlField(content: string, field: string): string` - YAML-Feldwert extrahieren (nicht-gierige Übereinstimmung)

</details>
