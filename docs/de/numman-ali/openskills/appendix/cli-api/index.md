---
title: "CLI API: Befehlsreferenz | OpenSkills"
subtitle: "CLI API: Befehlsreferenz | OpenSkills"
sidebarTitle: "Befehle verstehen"
description: "Lernen Sie die vollständige Kommandozeilen-API von OpenSkills kennen. Finden Sie alle Befehle, Parameter, Optionen und Verwendungsbeispiele, um die Befehlsnutzung schnell zu beherrschen."
tags:
  - "API"
  - "CLI"
  - "Befehlsreferenz"
  - "Optionsbeschreibung"
prerequisite: []
order: 1
---

# OpenSkills CLI API Referenz

## Was Sie nach dem Lernen tun können

- Die vollständige Verwendung aller OpenSkills-Befehle verstehen
- Parameter und Optionen jedes Befehls beherrschen
- Wissen, wie Befehle kombiniert werden, um Aufgaben zu erledigen

## Was ist das

Die OpenSkills CLI API Referenz bietet vollständige Dokumentation für alle Befehle, einschließlich Parameter, Optionen und Verwendungsbeispielen. Dies ist das Handbuch, das Sie konsultieren, wenn Sie einen bestimmten Befehl im Detail verstehen müssen.

---

## Übersicht

OpenSkills CLI bietet die folgenden Befehle:

```bash
openskills install <source>   # Skill installieren
openskills list                # Installierte Skills auflisten
openskills read <name>         # Skill-Inhalt lesen
openskills sync                # Mit AGENTS.md synchronisieren
openskills update [name...]    # Skills aktualisieren
openskills manage              # Skills interaktiv verwalten
openskills remove <name>       # Skill entfernen
```

---

## install Befehl

Installiert Skills von GitHub, lokalen Pfaden oder privaten Git-Repositories.

### Syntax

```bash
openskills install <source> [options]
```

### Parameter

| Parameter | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `<source>` | string | Ja | Skill-Quelle (siehe Quellformate unten) |

### Optionen

| Option | Kurzform | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- | --- |
| `--global` | `-g` | flag | false | Global in `~/.claude/skills/` installieren |
| `--universal` | `-u` | flag | false | In `.agent/skills/` installieren (Multi-Agent-Umgebung) |
| `--yes` | `-y` | flag | false | Interaktive Auswahl überspringen, alle gefundenen Skills installieren |

### Quellformate

| Format | Beispiel | Beschreibung |
| --- | --- | --- |
| GitHub Kurzschreibweise | `anthropics/skills` | Aus öffentlichem GitHub-Repository installieren |
| Git URL | `https://github.com/owner/repo.git` | Vollständige Git URL |
| SSH Git URL | `git@github.com:owner/repo.git` | SSH privates Repository |
| Lokaler Pfad | `./my-skill` oder `~/dev/skills` | Aus lokalem Verzeichnis installieren |

### Beispiele

```bash
# Von GitHub installieren (interaktiv)
openskills install anthropics/skills

# Von GitHub installieren (nicht-interaktiv)
openskills install anthropics/skills -y

# Global installieren
openskills install anthropics/skills --global

# Für Multi-Agent-Umgebung installieren
openskills install anthropics/skills --universal

# Von lokalem Pfad installieren
openskills install ./my-custom-skill

# Von privatem Repository installieren
openskills install git@github.com:your-org/private-skills.git
```

### Ausgabe

Nach erfolgreicher Installation wird angezeigt:
- Liste der installierten Skills
- Installationsort (project/global)
- Hinweis, `openskills sync` auszuführen

---

## list Befehl

Listet alle installierten Skills auf.

### Syntax

```bash
openskills list
```

### Parameter

Keine.

### Optionen

Keine.

### Beispiel

```bash
openskills list
```

### Ausgabe

```
Installierte Skills:

┌────────────────────┬────────────────────────────────────┬──────────┐
│ Skill-Name         │ Beschreibung                       │ Ort      │
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit           │ project  │
│ git-workflow       │ Git workflow automation            │ global   │
│ skill-creator      │ Guide for creating effective skills│ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

Statistik: 3 Skills (2 projektweit, 1 global)
```

### Erläuterung zur Skill-Position

- **project**: Installiert in `.claude/skills/` oder `.agent/skills/`
- **global**: Installiert in `~/.claude/skills/` oder `~/.agent/skills/`

---

## read Befehl

Liest Skill-Inhalt in die Standardausgabe (für KI-Agents).

### Syntax

```bash
openskills read <skill-names...>
```

### Parameter

| Parameter | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `<skill-names...>` | string | Ja | Skill-Namen (komma-getrennte Liste unterstützt) |

### Optionen

Keine.

### Beispiele

```bash
# Einzelnen Skill lesen
openskills read pdf

# Mehrere Skills lesen (komma-getrennt)
openskills read pdf,git-workflow

# Mehrere Skills lesen (Leerzeichen-getrennt)
openskills read pdf git-workflow
```

### Ausgabe

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### Verwendungszweck

Dieser Befehl wird hauptsächlich von KI-Agents verwendet, um Skill-Inhalte zu laden. Benutzer können ihn auch verwenden, um detaillierte Skill-Anleitungen anzuzeigen.

---

## sync Befehl

Synchronisiert installierte Skills mit AGENTS.md (oder einer anderen Datei).

### Syntax

```bash
openskills sync [options]
```

### Parameter

Keine.

### Optionen

| Option | Kurzform | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- | --- |
| `--output <path>` | `-o` | string | `AGENTS.md` | Ausgabedateipfad |
| `--yes` | `-y` | flag | false | Interaktive Auswahl überspringen, alle Skills synchronisieren |

### Beispiele

```bash
# Mit Standard-AGENTS.md synchronisieren (interaktiv)
openskills sync

# Mit benutzerdefiniertem Pfad synchronisieren
openskills sync -o .ruler/AGENTS.md

# Nicht-interaktive Synchronisation (CI/CD)
openskills sync -y

# Nicht-interaktive Synchronisation mit benutzerdefiniertem Pfad
openskills sync -y -o .ruler/AGENTS.md
```

### Ausgabe

Nach Abschluss der Synchronisation wird folgender Inhalt in der angegebenen Datei generiert:

```xml
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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## update Befehl

Aktualisiert installierte Skills aus der Quelle.

### Syntax

```bash
openskills update [skill-names...]
```

### Parameter

| Parameter | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `[skill-names...]` | string | Nein | Skill-Namen (komma-getrennt), standardmäßig alle |

### Optionen

Keine.

### Beispiele

```bash
# Alle installierten Skills aktualisieren
openskills update

# Bestimmte Skills aktualisieren
openskills update pdf,git-workflow

# Einzelnen Skill aktualisieren
openskills update pdf
```

### Ausgabe

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### Aktualisierungsregeln

- Nur Skills mit Metadaten-Datensatz werden aktualisiert
- Lokaler Pfad-Skill: Direkt aus Quellpfad kopieren
- Git-Repository-Skill: Neu klonen und kopieren
- Skills ohne Metadaten: Überspringen und Neuinstallation empfehlen

---

## manage Befehl

Interaktives Verwalten (Löschen) installierter Skills.

### Syntax

```bash
openskills manage
```

### Parameter

Keine.

### Optionen

Keine.

### Beispiel

```bash
openskills manage
```

### Interaktive Oberfläche

```
Wählen Sie die zu löschenden Skills:

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

Aktionen: [↑/↓] Auswählen [Leertaste] Umschalten [Enter] Bestätigen [Esc] Abbrechen
```

### Ausgabe

```
1 Skill gelöscht:
- skill-creator (project)
```

---

## remove Befehl

Löscht einen bestimmten installierten Skill (Skript-freundliche Methode).

### Syntax

```bash
openskills remove <skill-name>
```

### Alias

`rm`

### Parameter

| Parameter | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `<skill-name>` | string | Ja | Skill-Name |

### Optionen

Keine.

### Beispiele

```bash
# Skill löschen
openskills remove pdf

# Alias verwenden
openskills rm pdf
```

### Ausgabe

```
Skill gelöscht: pdf (project)
Pfad: /path/to/.claude/skills/pdf
Quelle: anthropics/skills
```

---

## Globale Optionen

Die folgenden Optionen gelten für alle Befehle:

| Option | Kurzform | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- | --- |
| `--version` | `-V` | flag | - | Versionsnummer anzeigen |
| `--help` | `-h` | flag | - | Hilfeinformationen anzeigen |

### Beispiele

```bash
# Version anzeigen
openskills --version

# Globale Hilfe anzeigen
openskills --help

# Spezifische Befehlshilfe anzeigen
openskills install --help
```

---

## Skill-Suchpriorität

Wenn mehrere Installationsorte existieren, werden Skills in folgender Prioritätsreihenfolge gesucht (von hoch zu niedrig):

1. `./.agent/skills/` - Projektebene universal
2. `~/.agent/skills/` - Globalebene universal
3. `./.claude/skills/` - Projektebene
4. `~/.claude/skills/` - Globalebene

**Wichtig**: Nur der erste gefundene passende Skill (höchste Priorität) wird zurückgegeben.

---

## Exit-Codes

| Exit-Code | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| 1 | Fehler (Parameterfehler, Befehlsfehler usw.) |

---

## Umgebungsvariablen

Die aktuelle Version unterstützt keine Umgebungsvariablen-Konfiguration.

---

## Konfigurationsdateien

OpenSkills verwendet die folgenden Konfigurationsdateien:

- **Skill-Metadaten**: `.claude/skills/<skill-name>/.openskills.json`
  - Zeichnet Installationsquelle, Zeitstempel usw. auf
  - Wird für den `update` Befehl zum Aktualisieren von Skills verwendet

### Metadaten-Beispiel

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir das **[AGENTS.md Format](../agents-md-format/)** kennen.
>
> Sie werden lernen:
> - Die XML-Tag-Struktur von AGENTS.md und die Bedeutung jedes Tags
> - Die Felddefinitionen und Nutzungseinschränkungen der Skill-Liste
> - Wie OpenSkills AGENTS.md generiert und aktualisiert
> - Markierungsmethoden (XML-Markierung und HTML-Kommentar-Markierung)

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisiert: 2026-01-24

| Befehl | Dateipfad | Zeile |
| --- | --- | --- |
| CLI Eingang | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 13-80 |
| install Befehl | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562 |
| list Befehl | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 1-50 |
| read Befehl | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| sync Befehl | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 1-101 |
| update Befehl | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173 |
| manage Befehl | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50 |
| remove Befehl | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30 |
| Typdefinitionen | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-25 |

**Wichtige Konstanten**:
- Keine globalen Konstanten

**Wichtige Typen**:
- `Skill`: Skill-Informationen Interface (name, description, location, path)
- `SkillLocation`: Skill-Position Interface (path, baseDir, source)
- `InstallOptions`: Installationsoptionen Interface (global, universal, yes)

**Wichtige Funktionen**:
- `program.command()`: Befehl definieren (commander.js)
- `program.option()`: Option definieren (commander.js)
- `program.action()`: Befehlsverarbeitungsfunktion definieren (commander.js)

</details>
