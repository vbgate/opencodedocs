---
title: "AGENTS.md-Format: Skill-Spezifikation | openskills"
sidebarTitle: "KI auf Ihre Skills aufmerksam machen"
subtitle: "AGENTS.md-Format-Spezifikation"
description: "Lernen Sie die XML-Tag-Struktur und die Skill-Listen-Definition der AGENTS.md-Datei kennen. Verstehen Sie Feldbedeutungen, Generierungsmechanismen und Best Practices, und beherrschen Sie die Funktionsweise des Skill-Systems."
tags:
  - "appendix"
  - "reference"
  - "format"
prerequisite:
  - "sync-to-agents"
order: 2
---

# AGENTS.md-Format-Spezifikation

**AGENTS.md** ist eine von OpenSkills generierte Skill-Beschreibungsdatei, die KI-Agenten (wie Claude Code, Cursor, Windsurf usw.) mitteilt, welche Skills verfügbar sind und wie diese aufgerufen werden.

## Was Sie nach diesem Kurs können

- Die XML-Struktur von AGENTS.md und die Bedeutung der einzelnen Tags verstehen
- Die Felddefinitionen und Nutzungseinschränkungen der Skill-Liste nachvollziehen
- Wissen, wie man AGENTS.md manuell bearbeitet (nicht empfohlen, aber manchmal nötig)
- Verstehen, wie OpenSkills diese Datei generiert und aktualisiert

## Vollständiges Format-Beispiel

Hier ist ein vollständiges Beispiel einer AGENTS.md-Datei:

```xml
# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
- For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>open-source-maintainer</name>
<description>End-to-end GitHub repository maintenance for open-source projects. Use when asked to triage issues, review PRs, analyze contributor activity, generate maintenance reports, or maintain a repository.</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

## Detaillierte Tag-Struktur

### Äußerer Container: `<skills_system>`

```xml
<skills_system priority="1">
  <!-- Skill-Inhalt -->
</skills_system>
```

- **priority**: Prioritätsmarkierung (fest auf `"1"`), teilt KI-Agenten den Wichtigkeitsgrad dieses Skill-Systems mit

::: tip Hinweis
Das `priority`-Attribut ist derzeit für zukünftige Erweiterungen reserviert, alle AGENTS.md-Dateien verwenden den festen Wert `"1"`.
:::

### Nutzungsanweisung: `<usage>`

Das `<usage>`-Tag enthält Anleitungen, wie KI-Agenten Skills verwenden sollten:

```xml
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>
```

**Wichtige Punkte**:
- **Auslösebedingung**: Prüfen, ob die Aufgabe des Benutzers mit einem Skill effizienter erledigt werden kann
- **Aufrufmethode**: Verwenden des Befehls `npx openskills read <skill-name>`
- **Batch-Aufruf**: Unterstützung für mehrere Skill-Namen, durch Kommas getrennt
- **Basisverzeichnis**: Die Ausgabe enthält ein `base_dir`-Feld zur Auflösung von Referenzdateien im Skill (z. B. `references/`, `scripts/`, `assets/`)
- **Nutzungseinschränkungen**:
  - Nur Skills verwenden, die in `<available_skills>` aufgelistet sind
  - Keinen Skill erneut laden, der bereits im Kontext vorhanden ist
  - Jeder Skill-Aufruf ist zustandslos

### Skill-Liste: `<available_skills>`

`<available_skills>` enthält die Liste aller verfügbaren Skills, jeder Skill wird mit einem `<skill>`-Tag definiert:

```xml
<available_skills>

<skill>
<name>skill-name</name>
<description>Skill-Beschreibung...</description>
<location>project</location>
</skill>

<skill>
<name>another-skill</name>
<description>Eine andere Skill-Beschreibung...</description>
<location>global</location>
</skill>

</available_skills>
```

#### `<skill>`-Tag-Felder

Jedes `<skill>` enthält die folgenden Pflichtfelder:

| Feld | Typ | Optionale Werte | Beschreibung |
| --- | --- | --- | --- |
| `<name>` | string | - | Skill-Name (stimmt mit dem SKILL.md-Dateinamen oder dem `name` in YAML überein) |
| `<description>` | string | - | Skill-Beschreibung (aus dem YAML-Frontmatter von SKILL.md) |
| `<location>` | string | `project` \| `global` | Markierung für die Skill-Installationsposition (zum Verständnis der Skill-Quelle durch KI-Agenten) |

**Feldbeschreibungen**:

- **`<name>`**: Eindeutiger Bezeichner des Skills, über den KI-Agenten den Skill aufrufen
- **`<description>`**: Detaillierte Beschreibung der Skill-Funktionen und Nutzungsszenarien, hilft der KI zu beurteilen, ob dieser Skill benötigt wird
- **`<location>`**:
  - `project`: Lokal im Projekt installiert (`.claude/skills/` oder `.agent/skills/`)
  - `global`: Im globalen Verzeichnis installiert (`~/.claude/skills/`)

::: info Warum wird ein location-Marker benötigt?
Das `<location>`-Markierung hilft KI-Agenten, den Sichtbarkeitsbereich von Skills zu verstehen:
- `project`-Skills sind nur im aktuellen Projekt verfügbar
- `global`-Skills sind in allen Projekten verfügbar
Dies beeinflusst die Skill-Auswahlstrategie der KI-Agenten.
:::

## Markierungsmethoden

AGENTS.md unterstützt zwei Markierungsmethoden, OpenSkills erkennt diese automatisch:

### Methode 1: XML-Markierung (empfohlen)

```xml
<skills_system priority="1">
  <!-- Skill-Inhalt -->
</skills_system>
```

Dies ist die Standardmethode, die Standard-XML-Tags zur Markierung von Beginn und Ende des Skill-Systems verwendet.

### Methode 2: HTML-Kommentar-Markierung (Kompatibilitätsmodus)

```xml
<!-- SKILLS_TABLE_START -->

## Available Skills

<usage>
  <!-- Nutzungsanweisung -->
</usage>

<available_skills>
  <!-- Skill-Liste -->
</available_skills>

<!-- SKILLS_TABLE_END -->
```

Dieses Format entfernt den äußeren `<skills_system>`-Container und verwendet nur HTML-Kommentare zur Markierung von Beginn und Ende des Skill-Bereichs.

::: tip OpenSkills-Verarbeitungslogik
Die `replaceSkillsSection()`-Funktion (`src/utils/agents-md.ts:67-93`) sucht nach Markierungen in folgender Priorität:
1. Zuerst nach `<skills_system>`-XML-Markierung suchen
2. Wenn nicht gefunden, nach `<!-- SKILLS_TABLE_START -->`-HTML-Kommentar suchen
3. Wenn beides nicht gefunden, Inhalt an das Dateiende anhängen
:::

## Wie OpenSkills AGENTS.md generiert

Bei Ausführung von `openskills sync` führt OpenSkills folgende Schritte aus:

1. **Alle installierten Skills suchen** (`findAllSkills()`)
2. **Interaktive Skill-Auswahl** (es sei denn, das Flag `-y` wird verwendet)
3. **XML-Inhalt generieren** (`generateSkillsXml()`)
   - `<usage>`-Nutzungsanweisung erstellen
   - Für jeden Skill ein `<skill>`-Tag generieren
4. **Skill-Bereich in der Datei ersetzen** (`replaceSkillsSection()`)
   - Vorhandene Markierung suchen (XML oder HTML-Kommentar)
   - Inhalt zwischen den Markierungen ersetzen
   - Wenn keine Markierung vorhanden, an das Dateiende anhängen

### Quellcode-Positionen

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| XML generieren | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| Skill-Bereich ersetzen | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| Vorhandene Skills parsen | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |

## Hinweise zur manuellen Bearbeitung

::: warning Manuelle Bearbeitung nicht empfohlen
Obwohl AGENTS.md manuell bearbeitet werden kann, wird empfohlen:
1. Den Befehl `openskills sync` zum Generieren und Aktualisieren verwenden
2. Manuell bearbeitete Inhalte werden beim nächsten `sync` überschrieben
3. Für benutzerdefinierte Skill-Listen die interaktive Auswahl verwenden (ohne `-y`-Flag)
:::

Wenn eine manuelle Bearbeitung dennoch erforderlich ist, beachten Sie:

1. **XML-Syntax korrekt halten**: Stellen Sie sicher, dass alle Tags korrekt geschlossen sind
2. **Markierungen nicht ändern**: Bewahren Sie `<skills_system>` oder `<!-- SKILLS_TABLE_START -->` usw. bei
3. **Felder vollständig**: Jedes `<skill>` muss die drei Felder `<name>`, `<description>`, `<location>` enthalten
4. **Keine doppelten Skills**: Fügen Sie nicht denselben Skill mehrmals hinzu

## Häufig gestellte Fragen

### F1: Warum hat AGENTS.md manchmal kein `<skills_system>`-Tag?

**A**: Dies ist der Kompatibilitätsmodus. Wenn Ihre Datei HTML-Kommentar-Markierungen (`<!-- SKILLS_TABLE_START -->`) verwendet, erkennt OpenSkills dies ebenfalls. Beim nächsten `sync` wird automatisch in XML-Markierung konvertiert.

### F2: Wie lösche ich alle Skills?

**A**: Führen Sie `openskills sync` aus und deaktivieren Sie in der interaktiven Oberfläche alle Skills, oder führen Sie aus:

```bash
openskills sync -y --output /dev/null
```

Dies leert den Skill-Bereich in AGENTS.md (behält aber die Markierungen bei).

### F3: Hat das location-Feld tatsächlich Auswirkungen auf KI-Agenten?

**A**: Dies hängt von der konkreten Implementierung des KI-Agenten ab. Im Allgemeinen:
- `location="project"` bedeutet, dass der Skill nur im aktuellen Projektkontext sinnvoll ist
- `location="global"` bedeutet, dass der Skill ein universelles Werkzeug ist, das in jedem Projekt verwendet werden kann

KI-Agenten könnten ihre Skill-Ladestrategie basierend auf dieser Markierung anpassen, aber die meisten Agenten (wie Claude Code) ignorieren dieses Feld und rufen direkt `openskills read` auf.

### F4: Wie lang sollte die Skill-Beschreibung sein?

**A**: Die Skill-Beschreibung sollte:
- **Prägnant aber vollständig**: Die Kernfunktion und Haupteinsatzszenarien des Skills erklären
- **Nicht zu kurz**: Einzeilige Beschreibungen machen es der KI schwer zu verstehen, wann der Skill verwendet werden soll
- **Nicht zu lang**: Zu lange Beschreibungen verschwenden Kontext, die KI liest sie nicht sorgfältig

Empfohlene Länge: **50-150 Wörter**.

## Best Practices

1. **sync-Befehl verwenden**: Verwenden Sie immer `openskills sync`, um AGENTS.md zu generieren, anstatt manuell zu bearbeiten
2. **Regelmäßig aktualisieren**: Führen Sie `openskills sync` aus, nachdem Sie Skills installiert oder aktualisiert haben
3. **Geeignete Skills auswählen**: Nicht alle installierten Skills müssen in AGENTS.md aufgeführt werden, wählen Sie basierend auf Projektanforderungen
4. **Format prüfen**: Wenn KI-Agenten Skills nicht erkennen können, prüfen Sie, ob die XML-Tags in AGENTS.md korrekt sind

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Dateistruktur](../file-structure/)** kennen.
>
> Sie werden lernen:
> - Die von OpenSkills generierte Verzeichnis- und Dateistruktur
> - Die Funktion und Position der einzelnen Dateien
> - Wie man Skill-Verzeichnisse versteht und verwaltet

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Skill-XML generieren | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| Skill-Bereich ersetzen | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| Vorhandene Skills parsen | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Skill-Typ-Definition | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |

**Wichtige Konstanten**:
- `priority="1"`: Prioritätsmarkierung des Skill-Systems (fester Wert)

**Wichtige Funktionen**:
- `generateSkillsXml(skills: Skill[])`: Generiert eine XML-formatierte Skill-Liste
- `replaceSkillsSection(content: string, newSection: string)`: Ersetzt oder fügt den Skill-Bereich hinzu
- `parseCurrentSkills(content: string)`: Parst aktivierte Skill-Namen aus AGENTS.md

</details>
