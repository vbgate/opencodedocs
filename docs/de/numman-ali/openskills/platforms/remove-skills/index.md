---
title: "Skills löschen: Interaktives und skriptbasiertes Entfernen von Skills | openskills"
sidebarTitle: "Veraltete Skills sicher entfernen"
subtitle: "Skills löschen: Interaktives und skriptbasiertes Entfernen"
description: "Lernen Sie die zwei Methoden zum Löschen von Skills in OpenSkills kennen: interaktives Manage und skriptbasiertes Remove. Erfahren Sie mehr über Anwendungsfälle, Positionsbestimmung und Fehlerbehebung, um Ihre Skill-Bibliothek sicher zu bereinigen."
tags:
  - "Skill-Management"
  - "Befehlsverwendung"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
  - "platforms-list-skills"
order: "6"
---
# Skills löschen

## Was Sie nach diesem Tutorial können

- `openskills manage` verwenden, um interaktiv mehrere Skills zu löschen
- `openskills remove` verwenden, um Skills skriptbasiert zu löschen
- Die Anwendungsfälle der beiden Löschmethoden verstehen
- Vor dem Löschen bestätigen, ob es sich um einen project- oder global-Speicherort handelt
- Nicht mehr benötigte Skills sicher bereinigen

## Ihre aktuelle Problemstellung

Mit zunehmender Anzahl installierter Skills könnten Sie auf folgende Probleme stoßen:

- "Einige Skills verwende ich nicht mehr und möchte sie löschen, aber das einzeln zu tun ist mühsam"
- "Ich möchte Skills automatisch in Skripten löschen, aber der manage-Befehl erfordert interaktive Auswahl"
- "Ich bin mir nicht sicher, ob ein Skill im project- oder global-Speicher installiert ist und möchte vor dem Löschen bestätigen"
- "Beim Batch-Löschen von Skills habe ich Angst, noch benötigte Skills versehentlich zu löschen"

OpenSkills bietet zwei Löschmethoden, um diese Probleme zu lösen: **interaktives manage** (für die manuelle Auswahl mehrerer Skills) und **skriptbasiertes remove** (für das präzise Löschen einzelner Skills).

## Wann Sie diese Methoden verwenden

| Szenario | Empfohlene Methode | Befehl |
| --- | --- | --- |
| Manuelles Löschen mehrerer Skills | Interaktive Auswahl | `openskills manage` |
| Skript- oder CI/CD-auto | Präzise Skill-Angabe | `openskills remove <name>` |
| Nur Skill-Name bekannt, schnelles Löschen gewünscht | Direktes Löschen | `openskills remove <name>` |
| Sehen, welche Skills gelöscht werden können | Erst auflisten, dann löschen | `openskills list` → `openskills manage` |

## Kernkonzepte

Die zwei Löschmethoden von OpenSkills sind für verschiedene Szenarien geeignet:

### Interaktives Löschen: `openskills manage`

- **Merkmale**: Zeigt alle installierten Skills an und lässt Sie auswählen, welche gelöscht werden sollen
- **Geeignet für**: Manuelle Skill-Bibliotheksverwaltung, einmaliges Löschen mehrerer Skills
- **Vorteil**: Kein versehentliches Löschen, alle Optionen vorher sichtbar
- **Standardverhalten**: **Keine Skills standardmäßig ausgewählt** (verhindert versehentliches Löschen)

### Skriptbasiertes Löschen: `openskills remove <name>`

- **Merkmale**: Löscht den angegebenen Skill direkt
- **Geeignet für**: Skripte, Automatisierung, präzises Löschen
- **Vorteil**: Schnell, keine Interaktion erforderlich
- **Risiko**: Bei falschem Skill-Namen gibt es einen Fehler, aber keine versehentliche Löschung anderer Skills

### Löschprinzip

Beide Methoden löschen den **gesamten Skill-Ordner** (einschließlich SKILL.md, references/, scripts/, assets/ und aller anderen Dateien), ohne Rückstände zu hinterlassen.

::: tip Löschung nicht rückgängig machbar
Das Löschen eines Skills löscht den gesamten Skill-Ordner und kann nicht rückgängig gemacht werden. Wir empfehlen, vor dem Löschen zu bestätigen, dass der Skill nicht mehr benötigt wird, oder dass er einfach neu installiert werden kann.
:::

## Anleitung

### Schritt 1: Interaktives Löschen mehrerer Skills

**Warum**
Wenn Sie mehrere Skills löschen müssen, ist die interaktive Auswahl sicherer und intuitiver

Führen Sie folgenden Befehl aus:

```bash
npx openskills manage
```

**Was Sie sehen sollten**

Zuerst sehen Sie eine Liste aller installierten Skills (sortiert nach project/global):

```
? Select skills to remove:
❯◯ pdf                         (project)
  ◯ code-analyzer                (project)
  ◯ email-reader                 (global)
  ◯ git-tools                    (global)
```

- **Blau** `(project)`: Projekt-Level-Skills
- **Grau** `(global)`: Global-Level-Skills
- **Leertaste**: Auswahl/Aufheben der Auswahl
- **Enter**: Bestätigen des Löschens

Angenommen, Sie wählen `pdf` und `git-tools` aus und drücken Enter:

**Was Sie sehen sollten**

```
✅ Removed: pdf (project)
✅ Removed: git-tools (global)

✅ Removed 2 skill(s)
```

::: info Standardmäßig nicht ausgewählt
Der manage-Befehl wählt standardmäßig **keine Skills aus**, um versehentliches Löschen zu verhindern. Sie müssen die zu löschenden Skills manuell mit der Leertaste auswählen.
:::

### Schritt 2: Skriptbasiertes Löschen eines einzelnen Skills

**Warum**
Wenn Sie den Skill-Namen kennen und ihn schnell löschen möchten

Führen Sie folgenden Befehl aus:

```bash
npx openskills remove pdf
```

**Was Sie sehen sollten**

```
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)
```

Wenn der Skill nicht existiert:

```
Error: Skill 'pdf' not found
```

Das Programm wird beendet und gibt den Fehlercode 1 zurück (geeignet für Skript-Entscheidungen).

### Schritt 3: Löschposition bestätigen

**Warum**
Vor dem Löschen den Skill-Speicherort (project vs. global) bestätigen, um versehentliches Löschen zu vermeiden

Beim Löschen eines Skills zeigt der Befehl die Löschposition an:

```bash
# Skriptbasiertes Löschen zeigt detaillierte Position an
npx openskills remove pdf
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)

# Interaktives Löschen zeigt auch die Position jedes Skills an
npx openskills manage
# Nach Auswahl und Enter
✅ Removed: pdf (project)
✅ Removed: git-tools (global)
```

**Entscheidungsregeln**:
- Wenn der Pfad das aktuelle Projektverzeichnis enthält → `(project)`
- Wenn der Pfad das Home-Verzeichnis enthält → `(global)`

### Schritt 4: Löschung verifizieren

**Warum**
Löschen bestätigen, um sicherzustellen, dass nichts vergessen wurde

Verwenden Sie nach dem Löschen eines Skills den list-Befehl zur Verifizierung:

```bash
npx openskills list
```

**Was Sie sehen sollten**

Gelöschte Skills sollten nicht mehr in der Liste erscheinen.

## Checkliste ✅

Bestätigen Sie Folgendes:

- [ ] Ausführung von `openskills manage` zeigt die Skill-Liste an
- [ ] Sie können Skills mit der Leertaste auswählen/abwählen
- [ ] Standardmäßig keine Skills ausgewählt (verhindert versehentliches Löschen)
- [ ] Ausführung von `openskills remove <name>` löscht den angegebenen Skill
- [ ] Beim Löschen wird angezeigt, ob es sich um project- oder global-Speicherort handelt
- [ ] Nach dem Löschen mit `openskills list` verifizieren, dass der Skill entfernt wurde

## Fallstricke und Hinweise

### Häufiges Problem 1: Versehentliches Löschen eines noch benötigten Skills

**Symptom**: Nach dem Löschen wird festgestellt, dass der Skill noch verwendet wird

**Lösung**:

Einfach neu installieren:

```bash
# Wenn von GitHub installiert
npx openskills install anthropics/skills

# Wenn von lokalem Pfad installiert
npx openskills install ./path/to/skill
```

OpenSkills zeichnet die Installationsquelle auf (in der `.openskills.json`-Datei), sodass beim erneuten Installieren die ursprünglichen Pfadinformationen nicht verloren gehen.

### Häufiges Problem 2: manage-Befehl zeigt "No skills installed"

**Symptom**: Ausführung von `openskills manage` zeigt an, dass keine Skills installiert sind

**Ursache**: Im aktuellen Verzeichnis sind tatsächlich keine Skills vorhanden

**Fehlerbehebungsschritte**:

1. Überprüfen, ob Sie sich im richtigen Projektverzeichnis befinden
2. Bestätigen, ob globale Skills installiert sind (`openskills list --global`)
3. Wechseln Sie zu dem Verzeichnis, in dem die Skills installiert sind, und versuchen Sie es erneut

```bash
# Zum Projektverzeichnis wechseln
cd /path/to/your/project

# Erneut versuchen
npx openskills manage
```

### Häufiges Problem 3: remove-Befehl meldet "Skill not found"

**Symptom**: Ausführung von `openskills remove <name>` meldet, dass der Skill nicht existiert

**Ursache**: Skill-Name ist falsch geschrieben oder der Skill wurde bereits gelöscht

**Fehlerbehebungsschritte**:

1. Zuerst mit dem list-Befehl den korrekten Skill-Namen anzeigen:

```bash
npx openskills list
```

2. Skill-Namen überprüfen (auf Groß-/Kleinschreibung und Bindestriche achten)

3. Bestätigen, ob es sich um project oder global handelt (in verschiedenen Verzeichnissen suchen)

```bash
# Projekt-Skills anzeigen
ls -la .claude/skills/

# Globale Skills anzeigen
ls -la ~/.claude/skills/
```

### Häufiges Problem 4: Gelöschter Skill noch in AGENTS.md vorhanden

**Symptom**: Nach dem Löschen eines Skills ist dieser noch in AGENTS.md referenziert

**Ursache**: Das Löschen eines Skills aktualisiert AGENTS.md nicht automatisch

**Lösung**:

Führen Sie den sync-Befehl erneut aus:

```bash
npx openskills sync
```

sync scannt die installierten Skills neu und aktualisiert AGENTS.md, sodass gelöschte Skills automatisch aus der Liste entfernt werden.

## Zusammenfassung dieser Lektion

OpenSkills bietet zwei Methoden zum Löschen von Skills:

### Interaktives Löschen: `openskills manage`

- 🎯 **Anwendungsfall**: Manuelle Skill-Bibliotheksverwaltung, Löschen mehrerer Skills
- ✅ **Vorteil**: Intuitiv, kein versehentliches Löschen, Vorschau möglich
- ⚠️ **Hinweis**: Standardmäßig keine Skills ausgewählt, müssen manuell ausgewählt werden

### Skriptbasiertes Löschen: `openskills remove <name>`

- 🎯 **Anwendungsfall**: Skripte, Automatisierung, präzises Löschen
- ✅ **Vorteil**: Schnell, keine Interaktion erforderlich
- ⚠️ **Hinweis**: Bei falschem Skill-Namen gibt es einen Fehler

**Kernpunkte**:

1. Beide Methoden löschen den gesamten Skill-Ordner (nicht rückgängig machbar)
2. Beim Löschen wird angezeigt, ob es sich um project- oder global-Speicherort handelt
3. Nach dem Löschen mit `openskills list` verifizieren
4. Denken Sie daran, `openskills sync` auszuführen, um AGENTS.md zu aktualisieren

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir das **[Universal-Modus: Multi-Agent-Umgebung](../../advanced/universal-mode/)**.
>
> Sie werden lernen:
> - Wie Sie das `--universal`-Flag verwenden, um Konflikte mit Claude Code zu vermeiden
> - Einheitliche Skill-Verwaltung in Multi-Agent-Umgebungen
> - Die Funktion des `.agent/skills`-Verzeichnisses

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Letzte Aktualisierung: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| manage-Befehl-Implementierung | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 10-62 |
| remove-Befehl-Implementierung | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 8-21 |
| Alle Skills finden | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Bestimmten Skill finden | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 66-90 |

**Wichtige Funktionen**:
- `manageSkills()`: Interaktives Löschen von Skills, verwendet inquirer checkbox zur Benutzerauswahl
- `removeSkill(skillName)`: Skriptbasiertes Löschen des angegebenen Skills, gibt Fehler aus und beendet das Programm, wenn nicht gefunden
- `findAllSkills()`: Durchsucht 4 Suchverzeichnisse und sammelt alle Skills
- `findSkill(skillName)`: Findet den angegebenen Skill und gibt ein Skill-Objekt zurück

**Wichtige Konstanten**:
- Keine (alle Pfade und Konfigurationen werden dynamisch berechnet)

**Kernlogik**:

1. **manage-Befehl** (src/commands/manage.ts):
   - Ruft `findAllSkills()` auf, um alle Skills zu erhalten (Zeile 11)
   - Sortiert nach project/global (Zeilen 20-25)
   - Verwendet inquirer `checkbox` zur Benutzerauswahl (Zeilen 33-37)
   - Standardmäßig `checked: false`, keine Skills ausgewählt (Zeile 30)
   - Iteriert durch ausgewählte Skills und ruft `rmSync` zum Löschen auf (Zeilen 45-52)

2. **remove-Befehl** (src/commands/remove.ts):
   - Ruft `findSkill(skillName)` auf, um den Skill zu finden (Zeile 9)
   - Gibt bei nicht gefundenem Skill einen Fehler aus und `process.exit(1)` (Zeilen 12-14)
   - Ruft `rmSync` auf, um den gesamten Skill-Ordner zu löschen (Zeile 16)
   - Bestimmt über `homedir()`, ob es sich um project oder global handelt (Zeile 18)

3. **Löschvorgang**:
   - Verwendet `rmSync(baseDir, { recursive: true, force: true })` zum Löschen des gesamten Skill-Ordners
   - `recursive: true`: Rekursives Löschen aller Unterdateien und Unterordner
   - `force: true`: Ignoriert Fehler, wenn Dateien nicht existieren

</details>
