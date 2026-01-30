---
title: "Dateistruktur: Verzeichnisorganisation | OpenSkills"
sidebarTitle: "Wo Skills gespeichert werden"
subtitle: "Dateistruktur: Verzeichnisorganisation | OpenSkills"
description: "Erfahren Sie mehr über die Verzeichnis- und Dateiorganisation von OpenSkills. Beherrschen Sie das Skill-Installationsverzeichnis, die Verzeichnisstruktur, das AGENTS.md-Format und die Suchpriorität."
tags:
  - "Anhang"
  - "Dateistruktur"
  - "Verzeichnisorganisation"
prerequisite: []
order: 3
---

# Dateistruktur

## Übersicht

Die Dateistruktur von OpenSkills ist in drei Kategorien unterteilt: **Skill-Installationsverzeichnis**, **Skill-Verzeichnisstruktur** und **AGENTS.md-Synchronisationsdatei**. Das Verständnis dieser Strukturen hilft Ihnen dabei, Skills besser zu verwalten und zu nutzen.

## Skill-Installationsverzeichnis

OpenSkills unterstützt 4 Skill-Installationsorte, die nach Priorität von hoch nach niedrig sortiert sind:

| Priorität | Speicherort | Beschreibung | Wann verwenden |
|--- | --- | --- | ---|
| 1 | `./.agent/skills/` | Projektlokal (Universal-Modus) | Multi-Agent-Umgebung, vermeidet Konflikte mit Claude Code |
| 2 | `~/.agent/skills/` | Global (Universal-Modus) | Multi-Agent-Umgebung + globale Installation |
| 3 | `./.claude/skills/` | Projektlokal (Standard) | Standardinstallation, projektspezifische Skills |
| 4 | `~/.claude/skills/` | Global | Skills, die von allen Projekten gemeinsam genutzt werden |

**Empfehlungen zur Auswahl**:
- Ein-Agent-Umgebung: Verwenden Sie das Standard-`.claude/skills/`
- Multi-Agent-Umgebung: Verwenden Sie `.agent/skills/` (`--universal`-Flag)
- Projektübergreifende Skills: Verwenden Sie die globale Installation (`--global`-Flag)

## Skill-Verzeichnisstruktur

Jeder Skill ist ein eigenständiges Verzeichnis, das die erforderlichen Dateien und optionale Ressourcen enthält:

```
skill-name/
├── SKILL.md              # Erforderlich: Hauptdatei des Skills
├── .openskills.json      # Erforderlich: Installationsmetadaten (automatisch generiert)
├── references/           # Optional: Referenzdokumentation
│   └── api-docs.md
├── scripts/             # Optional: Ausführbare Skripte
│   └── helper.py
└── assets/              # Optional: Vorlagen und Ausgabedateien
    └── template.json
```

### Dateibeschreibungen

#### SKILL.md (erforderlich)

Die Hauptdatei des Skills, die YAML-Frontmatter und Skill-Anweisungen enthält:

```yaml
---
name: my-skill
description: Skill-Beschreibung
---

## Skill-Titel

Skill-Anweisungsinhalte...
```

**Wichtige Punkte**:
- Der Dateiname muss `SKILL.md` lauten (Großschreibung)
- Das YAML-Frontmatter muss `name` und `description` enthalten
- Der Inhalt verwendet den Imperativ (imperative form)

#### .openskills.json (erforderlich, automatisch generiert)

Von OpenSkills automatisch erstellte Metadatendatei, die die Installationsquelle aufzeichnet:

```json
{
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2026-01-24T12:00:00.000Z"
}
```

**Verwendung**:
- Unterstützt Skill-Updates (`openskills update`)
- Zeichnet den Installationszeitstempel auf
- Verfolgt die Skill-Quelle

**Quellposition**:
- `src/utils/skill-metadata.ts:29-36` - Metadaten schreiben
- `src/utils/skill-metadata.ts:17-27` - Metadaten lesen

#### references/ (optional)

Speichert Referenzdokumentation und API-Spezifikationen:

```
references/
├── skill-format.md      # Skill-Format-Spezifikation
├── api-docs.md         # API-Dokumentation
└── best-practices.md   # Bewährte Praktiken
```

**Verwendungsszenarien**:
- Detaillierte technische Dokumentation (um SKILL.md übersichtlich zu halten)
- API-Referenzhandbücher
- Beispielcode und Vorlagen

#### scripts/ (optional)

Speichert ausführbare Skripte:

```
scripts/
├── extract_text.py      # Python-Skript
├── deploy.sh          # Shell-Skript
└── build.js          # Node.js-Skript
```

**Verwendungsszenarien**:
- Automatisierungsskripte, die bei der Skill-Ausführung ausgeführt werden müssen
- Datenverarbeitung und Konvertierungstools
- Deployment- und Build-Skripte

#### assets/ (optional)

Speichert Vorlagen und Ausgabedateien:

```
assets/
├── template.json      # JSON-Vorlage
├── config.yaml       # Konfigurationsdatei
└── output.md        # Beispielausgabe
```

**Verwendungsszenarien**:
- Vorlagen für Inhalte, die vom Skill generiert werden
- Beispiele für Konfigurationsdateien
- Beispiele für erwartete Ausgaben

## AGENTS.md-Struktur

Die vom Befehl `openskills sync` generierte AGENTS.md-Datei enthält eine Beschreibung des Skill-Systems und eine Liste der verfügbaren Skills:

### Vollständiges Format

```markdown
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### Komponentenbeschreibung

| Komponente | Beschreibung |
|--- | ---|
| `<skills_system>` | XML-Tag, markiert den Skill-System-Abschnitt |
| `<usage>` | Anweisungen zur Skill-Nutzung (weist die AI an, wie Skills aufgerufen werden) |
| `<available_skills>` | Liste der verfügbaren Skills (ein `<skill>`-Tag pro Skill) |
| `<skill>` | Informationen zu einem einzelnen Skill (name, description, location) |
| `<!-- SKILLS_TABLE_START -->` | Startmarke (für die Positionierung bei der Synchronisation) |
| `<!-- SKILLS_TABLE_END -->` | Endmarke (für die Positionierung bei der Synchronisation) |

**location-Feld**:
- `project` - Projektlokale Skills (`.claude/skills/` oder `.agent/skills/`)
- `global` - Globale Skills (`~/.claude/skills/` oder `~/.agent/skills/`)

## Verzeichnissuchpriorität

OpenSkills durchsucht beim Suchen von Skills die Verzeichnisse in folgender Priorität:

```typescript
// Quellposition: src/utils/dirs.ts:18-25
[
  join(process.cwd(), '.agent/skills'),   // 1. Projekt Universal
  join(homedir(), '.agent/skills'),        // 2. Global Universal
  join(process.cwd(), '.claude/skills'),  // 3. Projekt Claude
  join(homedir(), '.claude/skills'),       // 4. Global Claude
]
```

**Regeln**:
- Die Suche wird sofort gestoppt, sobald der erste passende Skill gefunden wurde
- Projektlokale Skills haben Vorrang vor globalen Skills
- Universal-Modus hat Vorrang vor Standardmodus

**Quellposition**: `src/utils/skills.ts:30-64` - Implementierung der Suche nach allen Skills

## Beispiel: Vollständige Projektstruktur

Eine typische Projektstruktur unter Verwendung von OpenSkills:

```
my-project/
├── AGENTS.md                    # Synchronisierte Skill-Liste
├── .claude/                     # Claude Code-Konfiguration
│   └── skills/                  # Skill-Installationsverzeichnis
│       ├── pdf/
│       │   ├── SKILL.md
│       │   ├── .openskills.json
│       │   ├── references/
│       │   ├── scripts/
│       │   └── assets/
│       └── git-workflow/
│           ├── SKILL.md
│           └── .openskills.json
├── .agent/                      # Universal-Modus-Verzeichnis (optional)
│   └── skills/
│       └── my-custom-skill/
│           ├── SKILL.md
│           └── .openskills.json
├── src/                         # Projekt-Quellcode
├── package.json
└── README.md
```

## Bewährte Praktiken

### 1. Verzeichnisauswahl

| Szenario | Empfohlenes Verzeichnis | Befehl |
|--- | --- | ---|
| Projektspezifische Skills | `.claude/skills/` | `openskills install repo` |
| Multi-Agent-Gemeinsam genutzt | `.agent/skills/` | `openskills install repo --universal` |
| Projektübergreifende Nutzung | `~/.claude/skills/` | `openskills install repo --global` |

### 2. Skill-Organisation

- **Einzel-Skill-Repository**: `SKILL.md` im Stammverzeichnis
- **Mehrere-Skill-Repository**: Unterverzeichnisse enthalten jeweils `SKILL.md`
- **Symbolische Links**: Verwenden Sie während der Entwicklung Symlinks zum lokalen Repository (siehe [Symbolische Link-Unterstützung](../../advanced/symlink-support/))

### 3. AGENTS.md-Versionskontrolle

- **Empfohlen zu committen**: Fügen Sie `AGENTS.md` der Versionskontrolle hinzu
- **CI-Synchronisation**: Führen Sie `openskills sync -y` in CI/CD aus (siehe [CI/CD-Integration](../../advanced/ci-integration/))
- **Teamzusammenarbeit**: Teammitglieder führen `openskills sync` synchron aus, um Konsistenz zu gewährleisten

## Zusammenfassung

Die Dateistruktur von OpenSkills ist einfach und klar gestaltet:

- **4 Installationsverzeichnisse**: Unterstützt projektlokale, globale und Universal-Modus
- **Skill-Verzeichnis**: Erforderliche SKILL.md + automatisch generiertes .openskills.json + optionale resources/scripts/assets
- **AGENTS.md**: Synchronisierte Skill-Liste, die dem Claude Code-Format entspricht

Das Verständnis dieser Strukturen hilft Ihnen, Skills effizienter zu verwalten und zu nutzen.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir das **[Glossar](../glossary/)**.
>
> Sie werden lernen:
> - Schlüsselbegriffe in OpenSkills und KI-Skill-Systemen
> - Genaue Definitionen professioneller Konzepte
> - Die Bedeutung häufiger Abkürzungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Verzeichnispfad-Tools | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 1-25 |
| Skill-Suche | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-84 |
| Metadatenverwaltung | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts) | 1-36 |

**Wichtige Funktionen**:
- `getSkillsDir(projectLocal, universal)` - Ruft den Pfad zum Skill-Verzeichnis ab
- `getSearchDirs()` - Ruft die 4 Suchverzeichnisse ab (nach Priorität)
- `findAllSkills()` - Findet alle installierten Skills
- `findSkill(skillName)` - Findet den angegebenen Skill
- `readSkillMetadata(skillDir)` - Liest Skill-Metadaten
- `writeSkillMetadata(skillDir, metadata)` - Schreibt Skill-Metadaten

</details>
