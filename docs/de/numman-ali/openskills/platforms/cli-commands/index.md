---
title: "Befehle im Detail: OpenSkills CLI Referenz | openskills"
sidebarTitle: "7 Befehle Meistern"
subtitle: "Befehle im Detail: OpenSkills CLI Referenz"
description: "Lernen Sie alle 7 OpenSkills-Befehle und ihre Parameter kennen. Umfassende Referenz zu install, list, read, update, sync, manage und remove für maximale CLI-Effizienz."
tags:
  - "CLI"
  - "Befehlsreferenz"
  - "Spickzettel"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 1
---

# Befehle im Detail: Vollständiger OpenSkills Befehlsspiegel

## Was Sie lernen werden

- Sicherer Umgang mit allen 7 OpenSkills-Befehlen
- Verständnis globaler Optionen und deren Anwendungsfälle
- Schnelles Nachschlagen von Befehlsparametern und Flags
- Verwendung nicht-interaktiver Befehle in Skripten

## Übersicht der Befehle

OpenSkills bietet die folgenden 7 Befehle:

| Befehl | Verwendung | Anwendungsfall |
| --- | --- | --- |
| `install` | Skill installieren | Neue Skills aus GitHub, lokalen Pfaden oder privaten Repos installieren |
| `list` | Skills auflisten | Alle installierten Skills und deren Speicherorte anzeigen |
| `read` | Skill lesen | Skill-Inhalte laden (normalerweise automatisch von Agenten aufgerufen) |
| `update` | Skill aktualisieren | Installierte Skills aus dem Quell-Repo aktualisieren |
| `sync` | Synchronisieren | Skill-Liste in AGENTS.md schreiben |
| `manage` | Verwalten | Interaktives Löschen von Skills |
| `remove` | Entfernen | Einzelne Skills löschen (skript-freundliche Methode) |

::: info Tipp
Verwenden Sie `npx openskills --help`, um eine Kurzübersicht aller Befehle anzuzeigen.
:::

## Globale Optionen

Einige Befehle unterstützen die folgenden globalen Optionen:

| Option | Kurzform | Zweck | Verwendung bei |
| --- | --- | --- | --- |
| `--global` | `-g` | In globalen Verzeichnis `~/.claude/skills/` installieren | `install` |
| `--universal` | `-u` | In universellen Verzeichnis `.agent/skills/` installieren (Multi-Agent-Umgebungen) | `install` |
| `--yes` | `-y` | Interaktive Prompts überspringen, Standardverhalten verwenden | `install`, `sync` |
| `--output <path>` | `-o <path>` | Benutzerdefinierten Ausgabedateipfad festlegen | `sync` |

## Befehlsdetails

### install - Skill installieren

Installiert Skills aus GitHub-Repos, lokalen Pfaden oder privaten git-Repos.

```bash
openskills install <source> [options]
```

**Parameter:**

| Parameter | Erforderlich | Beschreibung |
| --- | --- | --- |
| `<source>` | ✅ | Skill-Quelle (GitHub shorthand, git URL oder lokaler Pfad) |

**Optionen:**

| Option | Kurzform | Standard | Beschreibung |
| --- | --- | --- | --- |
| `--global` | `-g` | `false` | In globales Verzeichnis `~/.claude/skills/` installieren |
| `--universal` | `-u` | `false` | In universelles Verzeichnis `.agent/skills/` installieren |
| `--yes` | `-y` | `false` | Interaktive Auswahl überspringen, alle gefundenen Skills installieren |

**Beispiele für source-Parameter:**

```bash
# GitHub shorthand (empfohlen)
openskills install anthropics/skills

# Branch angeben
openskills install owner/repo@branch

# Privates Repo
openskills install git@github.com:owner/repo.git

# Lokaler Pfad
openskills install ./path/to/skill

# Git URL
openskills install https://github.com/owner/repo.git
```

**Verhaltensbeschreibung:**

- Bei der Installation werden alle gefundenen Skills zur Auswahl angezeigt
- Verwenden Sie `--yes`, um die Auswahl zu überspringen und alle Skills zu installieren
- Installationsort-Priorität: `--universal` → `--global` → Standard-Projektverzeichnis
- Nach der Installation wird eine `.openskills.json` Metadaten-Datei im Skill-Verzeichnis erstellt

---

### list - Skills auflisten

Listet alle installierten Skills auf.

```bash
openskills list
```

**Optionen:** Keine

**Ausgabeformat:**

```
Available Skills:

skill-name           [description]            (project/global)
```

**Verhaltensbeschreibung:**

- Sortierung nach Standort: Projekt-Skills zuerst, globale Skills danach
- Innerhalb desselben Standorts alphabetisch sortiert
- Anzeige von Skill-Name, Beschreibung und Standort-Label

---

### read - Skill lesen

Liest den Inhalt eines oder mehrerer Skills in die Standardausgabe. Dieser Befehl wird hauptsächlich von AI-Agenten verwendet, um Skills bei Bedarf zu laden.

```bash
openskills read <skill-names...>
```

**Parameter:**

| Parameter | Erforderlich | Beschreibung |
| --- | --- | --- |
| `<skill-names...>` | ✅ | Liste der Skill-Namen (mehrere, durch Leerzeichen oder Komma getrennt) |

**Optionen:** Keine

**Beispiele:**

```bash
# Einzelnen Skill lesen
openskills read pdf

# Mehrere Skills lesen
openskills read pdf git

# Komma-getrennt (auch unterstützt)
openskills read "pdf,git,excel"
```

**Ausgabeformat:**

```
Skill: pdf
Base Directory: /path/to/.claude/skills/pdf

---SKILL.md Inhalt---

[SKILL.END]
```

**Verhaltensbeschreibung:**

- Skills werden in 4 Verzeichnissen nach Priorität gesucht
- Ausgabe von Skill-Name, Basis-Verzeichnispfad und vollständigem SKILL.md Inhalt
- Für nicht gefundene Skills wird eine Fehlermeldung angezeigt

---

### update - Skills aktualisieren

Aktualisiert installierte Skills aus dem erfassten Quell-Repo. Wenn kein Skill-Name angegeben wird, werden alle installierten Skills aktualisiert.

```bash
openskills update [skill-names...]
```

**Parameter:**

| Parameter | Erforderlich | Beschreibung |
| --- | --- | --- |
| `[skill-names...]` | ❌ | Liste der zu aktualisierenden Skill-Namen (Standard: alle) |

**Optionen:** Keine

**Beispiele:**

```bash
# Alle Skills aktualisieren
openskills update

# Bestimmte Skills aktualisieren
openskills update pdf git

# Komma-getrennt (auch unterstützt)
openskills update "pdf,git,excel"
```

**Verhaltensbeschreibung:**

- Nur Skills mit Metadaten werden aktualisiert (d.h. durch install installiert)
- Skills ohne Metadaten werden übersprungen und entsprechend benachrichtigt
- Nach erfolgreicher Aktualisierung wird der Installationszeitstempel aktualisiert
- Bei der Aktualisierung aus git-Repos wird ein flacher Klon verwendet (`--depth 1`)

---

### sync - In AGENTS.md synchronisieren

Schreibt die Liste der installierten Skills in AGENTS.md (oder eine andere benutzerdefinierte Datei), um eine AI-Agenten-kompatible Skill-Liste zu erstellen.

```bash
openskills sync [options]
```

**Optionen:**

| Option | Kurzform | Standard | Beschreibung |
| --- | --- | --- | --- |
| `--output <path>` | `-o <path>` | `AGENTS.md` | Ausgabedateipfad |
| `--yes` | `-y` | `false` | Interaktive Auswahl überspringen, alle Skills synchronisieren |

**Beispiele:**

```bash
# In Standard-Datei synchronisieren
openskills sync

# In benutzerdefinierte Datei synchronisieren
openskills sync -o .ruler/AGENTS.md

# Interaktive Auswahl überspringen
openskills sync -y
```

**Verhaltensbeschreibung:**

- Vorhandene Dateien werden geparst und bereits aktivierte Skills vorausgewählt
- Bei erster Synchronisierung werden standardmäßig Projekt-Skills ausgewählt
- Generiert Claude Code kompatibles XML-Format
- Unterstützt Ersetzen oder Anhängen des Skills-Abschnitts in vorhandenen Dateien

---

### manage - Skills verwalten

Interaktives Löschen installierter Skills. Bietet eine benutzerfreundliche Lösch-Oberfläche.

```bash
openskills manage
```

**Optionen:** Keine

**Verhaltensbeschreibung:**

- Zeigt alle installierten Skills zur Auswahl an
- Standardmäßig ist kein Skill ausgewählt
- Löschung erfolgt sofort nach Auswahl, keine weitere Bestätigung erforderlich

---

### remove - Skill entfernen

Löscht einen bestimmten installierten Skill (skript-freundliche Methode). In Skripten bequemer als `manage`.

```bash
openskills remove <skill-name>
```

**Parameter:**

| Parameter | Erforderlich | Beschreibung |
| --- | --- | --- |
| `<skill-name>` | ✅ | Name des zu löschenden Skills |

**Optionen:** Keine

**Beispiele:**

```bash
openskills remove pdf

# Alias verwenden
openskills rm pdf
```

**Verhaltensbeschreibung:**

- Löscht das gesamte Skill-Verzeichnis (alle Dateien und Unterverzeichnisse)
- Zeigt den Löschort und die Quelle an
- Zeigt bei nicht gefundenem Skill einen Fehler an und bricht ab

## Schnell-Referenz für häufige Operationen

| Aufgabe | Befehl |
| --- | --- |
| Alle installierten Skills anzeigen | `openskills list` |
| Offiziellen Skill installieren | `openskills install anthropics/skills` |
| Aus lokalem Pfad installieren | `openskills install ./my-skill` |
| Global installieren | `openskills install owner/skill --global` |
| Alle Skills aktualisieren | `openskills update` |
| Bestimmte Skills aktualisieren | `openskills update pdf git` |
| Interaktives Löschen | `openskills manage` |
| Bestimmten Skill löschen | `openskills remove pdf` |
| In AGENTS.md synchronisieren | `openskills sync` |
| Benutzerdefinierten Ausgabepfad | `openskills sync -o custom.md` |

## Bekannte Probleme und Lösungen

### 1. Befehl nicht gefunden

**Problem**: Fehlermeldung "command not found" beim Ausführen des Befehls

**Ursachen**:
- Node.js nicht installiert oder Version zu alt (benötigt 20.6+)
- Nicht mit `npx` verwendet oder nicht global installiert

**Lösung**:
```bash
# Mit npx verwenden (empfohlen)
npx openskills list

# Oder global installieren
npm install -g openskills
```

### 2. Skill nicht gefunden

**Problem**: `openskills read skill-name` zeigt "Skill not found"

**Ursachen**:
- Skill nicht installiert
- Falscher Skill-Name eingegeben
- Skill-Installationsort nicht im Suchpfad

**Lösung**:
```bash
# Installierte Skills prüfen
openskills list

# Skill-Verzeichnisse anzeigen
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

### 3. Aktualisierung fehlgeschlagen

**Problem**: `openskills update` zeigt "No metadata found"

**Ursachen**:
- Skill nicht mit `install` Befehl installiert
- Metadaten-Datei `.openskills.json` gelöscht

**Lösung**: Skill neu installieren
```bash
openskills install <original-source>
```

## Zusammenfassung

OpenSkills bietet eine vollständige Befehlszeilenschnittstelle, die Installation, Auflistung, Lesen, Aktualisierung, Synchronisierung und Verwaltung von Skills abdeckt. Die Beherrschung dieser Befehle ist die Grundlage für die effiziente Nutzung von OpenSkills:

- `install` - Neue Skills installieren (unterstützt GitHub, lokal, private Repos)
- `list` - Installierte Skills anzeigen
- `read` - Skill-Inhalte lesen (für AI-Agenten)
- `update` - Installierte Skills aktualisieren
- `sync` - In AGENTS.md synchronisieren
- `manage` - Interaktives Löschen von Skills
- `remove` - Bestimmte Skills löschen

Merken Sie sich die Verwendung globaler Optionen:
- `--global` / `--universal` - Installationsort steuern
- `--yes` - Interaktive Prompts überspringen (geeignet für CI/CD)
- `--output` - Benutzerdefinierten Ausgabedateipfad festlegen

## Nächste Lektion

> In der nächsten Lektion lernen wir **[Installationsquellen im Detail](../install-sources/)**.
>
> Sie werden lernen:
> - Detaillierte Verwendung von drei Installationsmethoden
> - Anwendungsfälle für jede Methode
> - Konfigurationsmethoden für private Repositories
