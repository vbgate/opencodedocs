---
title: "Kernkonzepte: Einheitliches Skill-Ökosystem | OpenSkills"
sidebarTitle: "KI-Tools teilen Skills"
subtitle: "Kernkonzepte: Einheitliches Skill-Ökosystem | OpenSkills"
description: "Lernen Sie die Kernkonzepte und Funktionsweise von OpenSkills kennen. Als universeller Skill-Loader unterstützt es Multi-Agent-Skill-Sharing und ermöglicht inkrementelles Laden."
tags:
  - "Konzept-Einführung"
  - "Kernkonzepte"
prerequisite: []
order: 2
---

# Was ist OpenSkills?

## Was Sie nach diesem Tutorial können

- Die Kernwerte und Funktionsweise von OpenSkills verstehen
- Die Beziehung zwischen OpenSkills und Claude Code kennen
- Beurteilen, wann OpenSkills statt des integrierten Skill-Systems verwendet werden sollte
- Verstehen, wie mehrere KI-Coding-Agenten ein Skill-Ökosystem teilen können

::: info Voraussetzungen
Dieses Tutorial setzt voraus, dass Sie grundlegende KI-Coding-Tools (wie Claude Code, Cursor usw.) kennen, erfordert aber keine Vorkenntnisse über OpenSkills.
:::

---

## Ihre aktuelle Situation

Möglicherweise stoßen Sie auf diese Szenarien:

- **Skills, die in Claude Code gut funktionieren, sind in anderen KI-Tools nicht verfügbar**: Zum Beispiel die PDF-Verarbeitungs-Skills in Claude Code, die in Cursor nicht verfügbar sind
- **Wiederholte Installation von Skills in verschiedenen Tools**: Jeder KI-Tool muss separat konfiguriert werden, was hohe Verwaltungskosten verursacht
- **Private Skills können nicht über den offiziellen Marketplace geteilt werden**: Interne oder selbst entwickelte Skills können nicht einfach mit dem Team geteilt werden

Diese Probleme haben im Wesentlichen eine gemeinsame Ursache: **Nicht einheitliche Skill-Formate, die eine plattformübergreifende Nutzung verhindern**.

---

## Kernidee: Einheitliches Skill-Format

Die Kernidee von OpenSkills ist einfach: **Das Skill-System von Claude Code in einen universellen Skill-Loader verwandeln**.

### Was es ist

**OpenSkills** ist ein universeller Loader für das Skill-System von Anthropic, der es jedem KI-Coding-Agenten (Claude Code, Cursor, Windsurf, Aider usw.) ermöglicht, Skills im standardisierten SKILL.md-Format zu verwenden.

Einfach gesagt: **Ein Installer für alle KI-Coding-Tools**.

### Welche Probleme es löst

| Problem | Lösung |
| --- | --- |
| Nicht einheitliche Skill-Formate | Verwendung des standardisierten SKILL.md-Formats von Claude Code |
| Skills können nicht plattformübergreifend geteilt werden | Generierung einer einheitlichen AGENTS.md, die alle Tools lesen können |
| Verteilte Skill-Verwaltung | Einheitliche Befehle für Installation, Aktualisierung und Deinstallation |
| Schwierige Verteilung privater Skills | Unterstützung für lokale Pfade und private Git-Repositories |

---

## Kernwerte

OpenSkills bietet folgende Kernwerte:

### 1. Einheitlicher Standard

Alle Agenten verwenden das gleiche Skill-Format und die gleiche AGENTS.md-Beschreibung, ohne neue Formate lernen zu müssen.

- **Vollständige Kompatibilität mit Claude Code**: Gleiches Prompt-Format, gleicher Marketplace, gleiche Ordnerstruktur
- **Standardisiertes SKILL.md**: Klare Skill-Definition, einfach zu entwickeln und zu warten

### 2. Inkrementelles Laden

Laden Sie Skills bei Bedarf, um den KI-Kontext schlank zu halten.

- Nicht alle Skills müssen auf einmal geladen werden
- KI-Agenten laden relevante Skills dynamisch basierend auf Aufgabenanforderungen
- Vermeidung von Kontext-Explosion, Verbesserung der Antwortqualität

### 3. Multi-Agent-Unterstützung

Ein Skill-Set für mehrere Agenten, keine wiederholte Installation erforderlich.

- Claude Code, Cursor, Windsurf, Aider teilen denselben Skill-Satz
- Einheitliche Skill-Verwaltungsoberfläche
- Reduzierte Konfigurations- und Wartungskosten

### 4. Open-Source-freundlich

Unterstützung für lokale Pfade und private Git-Repositories, ideal für Teamarbeit.

- Installation von Skills aus dem lokalen Dateisystem (in Entwicklung)
- Installation aus privaten Git-Repositories (interne Unternehmensfreigabe)
- Skills können zusammen mit dem Projekt versioniert werden

### 5. Lokale Ausführung

Kein Daten-Upload, Datenschutz und Sicherheit.

- Alle Skill-Dateien werden lokal gespeichert
- Keine Abhängigkeit von Cloud-Diensten, kein Datenleckage-Risiko
- Geeignet für sensible Projekte und Unternehmensumgebungen

---

## Funktionsweise

Der Arbeitsablauf von OpenSkills ist einfach und besteht aus drei Schritten:

### Schritt 1: Skill installieren

Installieren Sie Skills aus GitHub, lokalen Pfaden oder privaten Git-Repositories in Ihr Projekt.

```bash
# Von Anthropic-Repository installieren
openskills install anthropics/skills

# Von lokalem Pfad installieren
openskills install ./my-skills
```

Skills werden im `.claude/skills/`-Verzeichnis des Projekts (Standard) oder im `.agent/skills/`-Verzeichnis (bei Verwendung von `--universal`) installiert.

### Schritt 2: Mit AGENTS.md synchronisieren

Synchronisieren Sie installierte Skills in die AGENTS.md-Datei und generieren Sie eine Skill-Liste, die KI-Agenten lesen können.

```bash
openskills sync
```

AGENTS.md enthält XML ähnlich wie folgt:

```xml
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>
</available_skills>
```

### Schritt 3: KI-Agent lädt Skill

Wenn ein KI-Agent einen Skill verwenden muss, laden Sie den Skill-Inhalt mit folgendem Befehl:

```bash
openskills read <skill-name>
```

Der KI-Agent lädt den Skill-Inhalt dynamisch in den Kontext und führt die Aufgabe aus.

---

## Beziehung zu Claude Code

OpenSkills und Claude Code ergänzen sich, sie ersetzen sich nicht gegenseitig.

### Vollständige Format-Kompatibilität

| Aspekt | Claude Code | OpenSkills |
| --- | --- | --- |
| **Prompt-Format** | `<available_skills>` XML | Gleiches XML |
| **Skill-Speicher** | `.claude/skills/` | `.claude/skills/` (Standard) |
| **Skill-Aufruf** | `Skill("name")` Tool | `npx openskills read <name>` |
| **Marketplace** | Anthropic Marketplace | GitHub (anthropics/skills) |
| **Inkrementelles Laden** | ✅ | ✅ |

### Anwendungsszenario-Vergleich

| Szenario | Empfohlenes Tool | Grund |
| --- | --- | --- |
| Nur Claude Code verwenden | Claude Code integriert | Keine zusätzliche Installation erforderlich, offizieller Support |
| Mehrere KI-Tools gemischt verwenden | OpenSkills | Einheitliche Verwaltung, Vermeidung von Duplikaten |
| Private Skills benötigt | OpenSkills | Unterstützung für lokale und private Repositories |
| Teamarbeit | OpenSkills | Skills können versioniert und einfach geteilt werden |

---

## Installationsort-Erklärung

OpenSkills unterstützt drei Installationsorte:

| Installationsort | Befehl | Anwendungsszenario |
| --- | --- | --- |
| **Projekt-lokal** | Standard | Einzelprojekt-Nutzung, Skills werden mit dem Projekt versioniert |
| **Global installiert** | `--global` | Alle Projekte teilen häufig verwendete Skills |
| **Universal-Modus** | `--universal` | Multi-Agent-Umgebung, Vermeidung von Konflikten mit Claude Code |

::: tip Wann sollte der Universal-Modus verwendet werden?
Wenn Sie gleichzeitig Claude Code und andere KI-Coding-Agenten (wie Cursor, Windsurf) verwenden, verwenden Sie `--universal` zur Installation in `.agent/skills/`, damit mehrere Agenten denselben Skill-Satz teilen können und Konflikte vermieden werden.
:::

---

## Skill-Ökosystem

OpenSkills verwendet dasselbe Skill-Ökosystem wie Claude Code:

### Offizielle Skill-Bibliothek

Offiziell von Anthropic gepflegtes Skill-Repository: [anthropics/skills](https://github.com/anthropics/skills)

Enthält häufig verwendete Skills:
- PDF-Verarbeitung
- Bildgenerierung
- Datenanalyse
- Und mehr...

### Community-Skills

Jedes GitHub-Repository kann als Skill-Quelle dienen, solange es eine SKILL.md-Datei enthält.

### Benutzerdefinierte Skills

Sie können Ihre eigenen Skills erstellen, das Standardformat verwenden und mit Ihrem Team teilen.

---

## Zusammenfassung dieser Lektion

Die Kernidee von OpenSkills ist:

1. **Einheitlicher Standard**: Verwendung des SKILL.md-Formats von Claude Code
2. **Multi-Agent-Unterstützung**: Alle KI-Coding-Tools teilen das Skill-Ökosystem
3. **Inkrementelles Laden**: Bei Bedarf laden, Kontext schlank halten
4. **Lokale Ausführung**: Kein Daten-Upload, Datenschutz und Sicherheit
5. **Open-Source-freundlich**: Unterstützung für lokale und private Repositories

Mit OpenSkills können Sie:
- Nahtlos zwischen verschiedenen KI-Tools wechseln
- Alle Skills einheitlich verwalten
- Private Skills verwenden und teilen
- Die Entwicklungseffizienz steigern

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[OpenSkills-Tool installieren](../installation/)**
>
> Sie werden lernen:
> - Wie Sie Node.js- und Git-Umgebung überprüfen
> - OpenSkills mit npx oder global installieren
> - Die Installation erfolgreich verifizieren
> - Häufige Installationsprobleme lösen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Zum Anzeigen der Quellcode-Position klicken</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Kern-Typdefinitionen | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L24) | 1-24 |
| Skill-Interface (Skill) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |
| Skill-Standort-Interface (SkillLocation) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L8-L12) | 8-12 |
| Installationsoptionen-Interface (InstallOptions) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L14-L18) | 14-18 |
| Skill-Metadaten-Interface (SkillMetadata) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L20-L24) | 20-24 |

**Wichtige Interfaces**:
- `Skill`: Informationen über installierte Skills (name, description, location, path)
- `SkillLocation`: Informationen zum Skill-Suchstandort (path, baseDir, source)
- `InstallOptions`: Installationsbefehlsoptionen (global, universal, yes)
- `SkillMetadata`: Skill-Metadaten (name, description, context)

**Quelle der Kernkonzepte**:
- README.md:22-86 - Kapitel "What Is OpenSkills?"

</details>
