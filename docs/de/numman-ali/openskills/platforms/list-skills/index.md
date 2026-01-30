---
title: "list-Befehl: Skills auflisten | OpenSkills"
sidebarTitle: "Installierte Skills auflisten"
subtitle: "list-Befehl: Skills auflisten"
description: "Lernen Sie die Verwendung des OpenSkills list-Befehls. Anzeigen aller installierten Skills, Verständnis der Unterschiede zwischen Projekt- und Global-Tags und Prioritätsregeln, schnelle Lokalisierung verfügbarer Skills."
tags:
  - "Skill-Verwaltung"
  - "Befehlsverwendung"
  - "CLI"
prerequisite:
  - "/de/numman-ali/openskills/start/installation/"
  - "/de/numman-ali/openskills/start/first-skill/"
order: 4
---

# Installierte Skills auflisten

## Was Sie lernen können

- Verwenden Sie `openskills list`, um alle installierten Skills anzuzeigen
- Verstehen Sie den Unterschied zwischen den Standort-Tags `(project)` und `(global)`
- Zählen Sie schnell die Anzahl der Projekt- und Global-Skills
- Bestimmen Sie, ob ein Skill erfolgreich installiert wurde

## Ihr aktuelles Problem

Nach der Installation einiger Skills können Sie auf folgende Probleme stoßen:

- "Welche Skills habe ich gerade installiert? Ich habe es vergessen"
- "Wurde dieser Skill im Projekt oder global installiert?"
- "Warum sind bestimmte Skills in Projekt A sichtbar, aber nicht in Projekt B?"
- "Ich möchte einige unbenutzte Skills löschen, kenne aber deren Namen nicht"

Der Befehl `openskills list` wurde entwickelt, um diese Fragen zu klären – er fungiert als "Verzeichnis" für Skills und zeigt Ihnen alle installierten Skills und deren Standorte auf einen Blick.

## Wann Sie diesen Befehl verwenden

| Szenario | Aktion |
|--- | ---|
| Nach der Installation eines Skills überprüfen, ob erfolgreich | Führen Sie `openskills list` aus, um zu prüfen, ob der Skill erscheint |
| Zu einem neuen Projekt wechseln, verfügbare Skills prüfen | Führen Sie `openskills list` aus, um zu sehen, welche Projekt-Skills vorhanden sind |
| Vor dem Bereinigen von Skills eine Bestandsaufnahme machen | Führen Sie `openskills list` aus, um alle Skills aufzulisten, und löschen Sie dann die nicht benötigten |
| Debuggen von Skill-Ladeproblemen | Bestätigen Sie, ob der Skillname und der Installationsort korrekt sind |

## Grundlegender Ansatz

OpenSkills unterstützt die Installation von Skills an **4 Orten** (nach Suchpriorität):

1. **project .agent/skills** - Projektweites Verzeichnis für generische Skills (Multi-Agent-Umgebung)
2. **global .agent/skills** - Globales Verzeichnis für generische Skills (Multi-Agent-Umgebung)
3. **project .claude/skills** - Projektweites Verzeichnis für Claude Code-Skills
4. **global .claude/skills** - Globales Verzeichnis für Claude Code-Skills

`openskills list` führt folgende Schritte aus:

1. Durchsucht diese 4 Verzeichnisse nach allen Skills
2. **Deduplizierung**: Der gleiche Skillname wird nur einmal angezeigt (projektbezogene Skills haben Vorrang)
3. **Sortierung**: Projekt-Skills zuerst, globale Skills danach; innerhalb desselben Standorts alphabetisch
4. **Standortmarkierung**: Unterscheidung durch die Tags `(project)` und `(global)`
5. **Zusammenfassung**: Zeigt die Anzahl der Projekt-Skills, der globalen Skills und die Gesamtanzahl an

::: info Warum ist Deduplizierung erforderlich?
Wenn Sie denselben Skill (z. B. `pdf`) sowohl im Projekt als auch global installieren, verwendet OpenSkills bevorzugt die Projektversion. Der list-Befehl zeigt ihn nur einmal an, um Verwirrung zu vermeiden.
:::

## Führen Sie dies mit mir aus

### Schritt 1: Alle installierten Skills auflisten

**Warum**
Schnelle Übersicht darüber, welche Skills in der aktuellen Umgebung verfügbar sind

Führen Sie den folgenden Befehl aus:

```bash
npx openskills list
```

**Was Sie sehen sollten**

Wenn keine Skills installiert sind, wird Folgendes angezeigt:

```
Available Skills:

No skills installed.

Install skills:
  npx openskills install anthropics/skills         # Project (default)
  npx openskills install owner/skill --global     # Global (advanced)
```

Wenn Skills installiert sind, sehen Sie etwas wie:

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text and tables...

  code-analyzer                (project)
    Static code analysis tool for identifying security vulnerabilities...

  email-reader                 (global)
    Read email content and attachments via IMAP protocol...

Summary: 2 project, 1 global (3 total)
```

### Schritt 2: Das Ausgabeformat verstehen

**Warum**
Nur wenn Sie verstehen, was jede Zeile bedeutet, können Sie die benötigten Informationen schnell finden

Erklärung des Ausgabeformats:

| Teil | Beschreibung |
|--- | ---|
| `pdf` | Skill-Name (aus dem Feld `name` in SKILL.md extrahiert) |
| `(project)` | Standort-Tag: Blau steht für projektbezogene Skills, Grau für globale Skills |
| `Comprehensive PDF...` | Skill-Beschreibung (aus dem Feld `description` in SKILL.md extrahiert) |
| `Summary: 2 project, 1 global (3 total)` | Zusammenfassung: Anzahl der Projekt-Skills, der globalen Skills und Gesamtzahl |

### Schritt 3: Die Standort-Tags überprüfen

**Warum**
Bestätigen Sie, dass der Skill am erwarteten Ort installiert wurde, um Verwirrung wie "Warum sehe ich diesen Skill in diesem Projekt nicht?" zu vermeiden

Versuchen Sie die folgenden Operationen, um die Standort-Tags zu verstehen:

```bash
# 1. Installieren Sie einen projektbezogenen Skill
npx openskills install anthropics/skills -y

# 2. Zeigen Sie die Liste an (sollte das project-Tag anzeigen)
npx openskills list

# 3. Installieren Sie einen globalen Skill
npx openskills install anthropics/skills --global -y

# 4. Zeigen Sie die Liste erneut an (zwei pdf-Skills, aber nur einmal angezeigt, Tag ist project)
npx openskills list
```

**Was Sie sehen sollten**

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text...

Summary: 1 project, 0 global (1 total)
```

Auch wenn derselbe Skill sowohl global als auch im Projekt installiert ist, zeigt der list-Befehl ihn nur einmal an, da die Projektversion eine höhere Priorität hat.

## Kontrollpunkt ✅

Bestätigen Sie folgende Punkte:

- [ ] Durch Ausführen von `openskills list` wird die Liste der installierten Skills angezeigt
- [ ] Sie können die Tags `(project)` und `(global)` unterscheiden (unterschiedliche Farben: Blau vs. Grau)
- [ ] Die Zusammenfassungsstatistik ist korrekt (Projekt-Skills + globale Skills = Gesamtzahl)
- [ ] Sie verstehen die Regel, dass Skills mit demselben Namen nur einmal angezeigt werden

## Häufige Fallstricke

### Häufiges Problem 1: Gerade installierter Skill nicht gefunden

**Phänomen**: Der `install`-Befehl war erfolgreich, aber `list` zeigt ihn nicht an

**Fehlerbehebung**:

1. Überprüfen Sie, ob Sie im richtigen Projektverzeichnis sind (projektbezogene Skills sind nur für das aktuelle Projekt sichtbar)
2. Bestätigen Sie, ob die Installation global erfolgte (mit dem Flag `--global`)
3. Überprüfen Sie den Installationsort:

```bash
# Überprüfen des Projektverzeichnisses
ls -la .claude/skills/

# Überprüfen des globalen Verzeichnisses
ls -la ~/.claude/skills/
```

### Häufiges Problem 2: Unerwarteter Skillname angezeigt

**Phänomen**: Der Skillname entspricht nicht Ihren Erwartungen (z. B. Ordnername vs. `name` in SKILL.md)

**Ursache**: OpenSkills verwendet das Feld `name` aus SKILL.md als Skillnamen, nicht den Ordnernamen

**Lösung**: Überprüfen Sie das Frontmatter von SKILL.md:

```yaml
---
name: pdf  # Dies ist der Name, der vom list-Befehl angezeigt wird
description: Comprehensive PDF manipulation toolkit...
---
```

### Häufiges Problem 3: Beschreibung nicht vollständig angezeigt

**Phänomen**: Die Skill-Beschreibung ist abgeschnitten

**Ursache**: Dies liegt an der Begrenzung der Terminalbreite und beeinträchtigt nicht den Skill-Inhalt

**Lösung**: Sehen Sie sich die Datei SKILL.md direkt an, um die vollständige Beschreibung zu erhalten

## Zusammenfassung dieser Lektion

`openskills list` ist der "Verzeichnis"-Befehl für die Skill-Verwaltung, der Ihnen hilft:

- 📋 **Alle Skills anzeigen**: Übersichtliche Anzeige aller installierten Skills
- 🏷️ **Standort-Tags unterscheiden**: `(project)` steht für projektspezifisch, `(global)` für global
- 📊 **Zusammenfassung**: Schnelles Verständnis der Anzahl der Projekt- und Global-Skills
- 🔍 **Fehlerbehebung**: Bestätigen, ob ein Skill erfolgreich installiert wurde, und den Skill-Standort lokalisieren

Grundlegende Regeln:

1. Skills mit demselben Namen werden nur einmal angezeigt (Projekt hat Vorrang)
2. Projekt-Skills zuerst, dann globale Skills
3. Innerhalb desselben Standorts alphabetisch sortiert

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Skills aktualisieren](../update-skills/)**.
>
> Sie werden lernen:
> - Wie Sie installierte Skills aus dem Quell-Repository aktualisieren
> - Massenaktualisierung aller Skills
> - Umgang mit alten Skills ohne Metadaten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Orte anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeile |
|--- | --- | ---|
| Implementierung des list-Befehls | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 7-43 |
| Alle Skills finden | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Konfiguration der Suchverzeichnisse | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 18-25 |
| Skill-Typ-Definition | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-6 |

**Wichtige Funktionen**:
- `listSkills()`: Listet alle installierten Skills auf und formatiert die Ausgabe
- `findAllSkills()`: Durchläuft 4 Suchverzeichnisse und sammelt alle Skills
- `getSearchDirs()`: Gibt die Pfade der 4 Suchverzeichnisse zurück (nach Priorität)

**Wichtige Konstanten**:
- Keine (Suchverzeichnispfade werden dynamisch berechnet)

**Kernlogik**:
1. **Deduplizierungsmechanismus**: Verwendet `Set`, um bereits verarbeitete Skillnamen zu verfolgen (skills.ts:32-33, 43, 57)
2. **Standortbestimmung**: Bestimmt, ob es sich um ein Projektverzeichnis handelt, durch `dir.includes(process.cwd())` (skills.ts:48)
3. **Sortierungsregeln**: Projekt hat Vorrang, alphabetisch innerhalb desselben Standorts (list.ts:21-26)

</details>
