---
title: "read-Befehl: Installierte Skills lesen | openskills"
sidebarTitle: "Installierte Skills lesen"
subtitle: "read-Befehl: Installierte Skills lesen"
description: "Lernen Sie, mit dem openskills read-Befehl den Inhalt installierter Skills zu lesen. Verstehen Sie die 4-stufige Prioritätsreihenfolge und den vollständigen Ladevorgang, unterstützt das Lesen mehrerer Skills und hilft KI-Agenten dabei, Skill-Definitionen schnell abzurufen und Aufgaben auszuführen."
tags:
  - "Einführungstutorial"
  - "Skill-Verwendung"
prerequisite:
  - "start-first-skill"
order: 6
---

# Skills verwenden

## Was Sie nach diesem Tutorial können

- Den Befehl `openskills read` verwenden, um den Inhalt installierter Skills zu lesen
- Verstehen, wie KI-Agenten diesen Befehl nutzen, um Skills in den Kontext zu laden
- Die 4-stufige Prioritätsreihenfolge für die Skill-Suche beherrschen
- Mehrere Skills gleichzeitig lesen (durch Kommata getrennt)

::: info Vorkenntnisse

Dieses Tutorial setzt voraus, dass Sie [mindestens einen Skill installiert haben](../first-skill/). Falls Sie noch keinen Skill installiert haben, führen Sie bitte zuerst die Installationsanweisungen durch.

:::

---

## Ihre aktuelle Situation

Möglicherweise haben Sie bereits Skills installiert, aber:

- **Wissen nicht, wie Sie die KI die Skills nutzen lassen**: Die Skills sind installiert, aber wie liest der KI-Agent sie?
- **Verstehen nicht die Funktion des read-Befehls**: Sie wissen, dass es einen `read`-Befehl gibt, aber nicht, was die Ausgabe bedeutet
- **Verstehen nicht die Skill-Suchreihenfolge**: Es gibt sowohl globale als auch projektspezifische Skills – welchen verwendet die KI?

Diese Fragen sind sehr verbreitet. Lassen Sie sie uns Schritt für Schritt lösen.

---

## Wann Sie diese Funktion verwenden sollten

**Skills verwenden (read-Befehl)** eignet sich für folgende Szenarien:

- **KI-Agent muss eine spezifische Aufgabe ausführen**: z. B. PDF verarbeiten, Git-Repository verwalten usw.
- **Überprüfen, ob der Skill-Inhalt korrekt ist**: Überprüfen, ob die Anweisungen in SKILL.md den Erwartungen entsprechen
- **Die vollständige Struktur des Skills verstehen**: Ansehen der Ressourcen wie references/, scripts/ usw.

::: tip Empfohlene Vorgehensweise

Normalerweise verwenden Sie den `read`-Befehl nicht direkt, sondern der KI-Agent ruft ihn automatisch auf. Aber die Kenntnis des Ausgabeformats hilft beim Debuggen und bei der Entwicklung benutzerdefinierter Skills.

:::

---

## 🎒 Vorbereitung vor dem Start

Bevor Sie beginnen, überprüfen Sie bitte:

- [ ] Sie haben [den ersten Skill installiert](../first-skill/)
- [ ] Sie haben mindestens einen Skill im Projektverzeichnis installiert
- [ ] Sie können das Verzeichnis `.claude/skills/` anzeigen

::: warning Voraussetzungsprüfung

Falls Sie noch keinen Skill installiert haben, können Sie schnell einen Test-Skill installieren:

```bash
npx openskills install anthropics/skills
# Wählen Sie im interaktiven Menü einen beliebigen Skill (z. B. pdf)
```

:::

---

## Kernkonzept: Nach Priorität suchen und Skill ausgeben

Der `read`-Befehl von OpenSkills funktioniert wie folgt:

```
[Skillname angeben] → [Nach Priorität suchen] → [Erste Übereinstimmung finden] → [SKILL.md lesen] → [Auf Standardausgabe ausgeben]
```

**Wichtige Punkte**:

- **4-stufige Suchpriorität**:
  1. `.agent/skills/` (Projekt universal)
  2. `~/.agent/skills/` (Global universal)
  3. `.claude/skills/` (Projekt claude)
  4. `~/.claude/skills/` (Global claude)

- **Erste Übereinstimmung zurückgeben**: Sobald eine Übereinstimmung gefunden wird, wird die Suche gestoppt, es werden keine weiteren Verzeichnisse durchsucht
- **Basisverzeichnis ausgeben**: Der KI-Agent benötigt diesen Pfad, um relative Pfade in Skills aufzulösen

---

## Schritt-für-Schritt-Anleitung

### Schritt 1: Einzelnen Skill lesen

Versuchen Sie zuerst, einen installierten Skill zu lesen.

**Beispielbefehl**:

```bash
npx openskills read pdf
```

**Warum**

`pdf` ist der Name des Skills, den wir in der letzten Lektion installiert haben. Dieser Befehl sucht und gibt den vollständigen Inhalt des Skills aus.

**Sie sollten sehen**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit for extracting text and tables...
...

Skill read: pdf
```

**Ausgabestruktur-Analyse**:

| Teil | Inhalt | Funktion |
|---|---|---|
| `Reading: pdf` | Skillname | Identifiziert den zu lesenden Skill |
| `Base directory: ...` | Basisverzeichnis des Skills | Die KI verwendet diesen Pfad, um references/, scripts/ und andere Ressourcen aufzulösen |
| SKILL.md-Inhalt | Vollständige Skill-Definition | Enthält Anweisungen, Ressourcenverweise usw. |
| `Skill read: pdf` | Endmarkierung | Signalisiert, dass das Lesen abgeschlossen ist |

::: tip Hinweis

**Das Basisverzeichnis (Base directory)** ist sehr wichtig. Pfade wie `references/some-doc.md` im Skill werden relativ zu diesem Verzeichnis aufgelöst.

:::

---

### Schritt 2: Mehrere Skills lesen

OpenSkills unterstützt das gleichzeitige Lesen mehrerer Skills, getrennt durch Kommata.

**Beispielbefehl**:

```bash
npx openskills read pdf,git-workflow
```

**Warum**

Das Lesen mehrerer Skills auf einmal reduziert die Anzahl der Befehlsaufrufe und erhöht die Effizienz.

**Sie sollten sehen**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit...
...

Skill read: pdf

Reading: git-workflow
Base directory: /path/to/your/project/.claude/skills/git-workflow

---
name: git-workflow
description: Git workflow: Best practices...
...

Skill read: git-workflow
```

**Merkmale**:
- Die Ausgabe jedes Skills wird durch eine Leerzeile getrennt
- Jeder Skill hat seine eigenen `Reading:`- und `Skill read:`-Markierungen
- Skills werden in der in der Befehlszeile angegebenen Reihenfolge gelesen

::: tip Erweiterte Verwendung

Skillnamen können Leerzeichen enthalten, der `read`-Befehl verarbeitet diese automatisch:

```bash
npx openskills read pdf, git-workflow  # Leerzeichen werden ignoriert
```

:::

---

### Schritt 3: Suchpriorität überprüfen

Lassen Sie uns die 4-stufige Suchreihenfolge überprüfen.

**Umgebung vorbereiten**:

Installieren Sie zuerst Skills sowohl im Projektverzeichnis als auch im globalen Verzeichnis (mit unterschiedlichen Quellen):

```bash
# Projekt-lokale Installation (im aktuellen Projektverzeichnis)
npx openskills install anthropics/skills

# Globale Installation (mit --global)
npx openskills install anthropics/skills --global
```

**Priorität überprüfen**:

```bash
# Alle Skills auflisten
npx openskills list
```

**Sie sollten sehen**:

```
Available skills:

pdf (project)      /path/to/your/project/.claude/skills/pdf
pdf (global)       /home/user/.claude/skills/pdf

Total: 2 skills (1 project, 1 global)
```

**Skill lesen**:

```bash
npx openskills read pdf
```

**Sie sollten sehen**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf  ← Gibt bevorzugt den Projekt-Skill zurück
...
```

**Fazit**: Da `.claude/skills/` (Projekt) eine höhere Priorität hat als `~/.claude/skills/` (Global), wird der projekt-lokale Skill gelesen.

::: tip Praktische Anwendung

Dieser Prioritätsmechanismus ermöglicht es Ihnen, globale Skills in Projekten zu überschreiben, ohne andere Projekte zu beeinflussen. Beispiel:
- Globale Installation häufig verwendeter Skills (von allen Projekten gemeinsam genutzt)
- Projekt-lokale Installation angepasster Versionen (überschreiben die globale Version)

:::

---

### Schritt 4: Vollständige Ressourcen des Skills anzeigen

Ein Skill enthält nicht nur SKILL.md, sondern möglicherweise auch Ressourcen wie references/, scripts/ usw.

**Verzeichnisstruktur des Skills anzeigen**:

```bash
ls -la .claude/skills/pdf/
```

**Sie sollten sehen**:

```
.claude/skills/pdf/
├── SKILL.md
├── .openskills.json
├── references/
│   ├── pdf-extraction.md
│   └── table-extraction.md
└── scripts/
    └── extract-pdf.js
```

**Skill lesen und Ausgabe beobachten**:

```bash
npx openskills read pdf
```

**Sie sollten sehen**:

Die SKILL.md enthält Verweise auf Ressourcen, wie:

```markdown
## References

See [PDF extraction guide](references/pdf-extraction.md) for details.

## Scripts

Run `node scripts/extract-pdf.js` to extract text from PDF.
```

::: info Wichtiger Hinweis

Wenn ein KI-Agent einen Skill liest, wird folgendes durchgeführt:
1. Der Pfad `Base directory` wird ermittelt
2. Relative Pfade in SKILL.md (z. B. `references/...`) werden mit dem Basisverzeichnis zusammengesetzt
3. Die tatsächlichen Ressourcendateien werden gelesen

Deshalb muss der `read`-Befehl das `Base directory` ausgeben.

:::

---

## Prüfpunkte ✅

Nach Abschluss der obigen Schritte bestätigen Sie bitte:

- [ ] Die vollständige SKILL.md des Skills wird in der Befehlszeile angezeigt
- [ ] Die Ausgabe enthält `Reading: <name>` und `Base directory: <path>`
- [ ] Am Ende der Ausgabe gibt es eine `Skill read: <name>`-Endmarkierung
- [ ] Beim Lesen mehrerer Skills werden diese durch Leerzeilen getrennt
- [ ] Projekt-lokale Skills werden gegenüber globalen bevorzugt gelesen

Wenn alle obigen Prüfpunkte bestanden sind, herzlichen Glückwunsch! Sie haben den Kernprozess des Skill-Lesens gemeistert.

---

## Fallstricke

### Problem 1: Skill nicht gefunden

**Phänomen**:

```
Error: Skill(s) not found: pdf

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Ursache**:
- Skill ist nicht installiert
- Skill-Name ist falsch geschrieben

**Lösung**:
1. Liste installierte Skills auf: `npx openskills list`
2. Überprüfen Sie, ob der Skill-Name korrekt ist
3. Falls nicht installiert, verwenden Sie `openskills install` zur Installation

---

### Problem 2: Falscher Skill wird gelesen

**Phänomen**:

Sie erwarten, den Projekt-Skill zu lesen, aber es wird der globale Skill gelesen.

**Ursache**:
- Das Projektverzeichnis ist nicht der richtige Ort (falsches Verzeichnis wurde verwendet)

**Lösung**:
1. Überprüfen Sie das aktuelle Arbeitsverzeichnis: `pwd`
2. Stellen Sie sicher, dass Sie sich im richtigen Projektverzeichnis befinden
3. Verwenden Sie `openskills list`, um das `location`-Label der Skills anzuzeigen

---

### Problem 3: Reihenfolge beim Lesen mehrerer Skills entspricht nicht den Erwartungen

**Phänomen**:

```bash
npx openskills read skill-a,skill-b
```

Sie erwarten, dass zuerst skill-b gelesen wird, aber tatsächlich wird zuerst skill-a gelesen.

**Ursache**:
- Der `read`-Befehl liest in der Reihenfolge, in der die Parameter angegeben wurden, und sortiert nicht automatisch

**Lösung**:
- Wenn eine bestimmte Reihenfolge benötigt wird, geben Sie die Skill-Namen in dieser Reihenfolge im Befehl an

---

### Problem 4: SKILL.md-Inhalt wird abgeschnitten

**Phänomen**:

Der ausgegebene SKILL.md-Inhalt ist unvollständig, der Endteil fehlt.

**Ursache**:
- Skill-Datei ist beschädigt oder hat Formatierungsfehler
- Dateikodierungsproblem

**Lösung**:
1. Überprüfen Sie die SKILL.md-Datei: `cat .claude/skills/<name>/SKILL.md`
2. Stellen Sie sicher, dass die Datei vollständig und korrekt formatiert ist (muss YAML-Frontmatter haben)
3. Installieren Sie den Skill erneut: `openskills update <name>`

---

## Lektionszusammenfassung

In dieser Lektion haben Sie gelernt:

- **`openskills read <name>` verwenden**, um den Inhalt installierter Skills zu lesen
- **Die 4-stufige Suchpriorität verstehen**: Projekt universal > Global universal > Projekt claude > Global claude
- **Mehrere Skills gleichzeitig lesen**: Skill-Namen durch Kommata trennen
- **Ausgabeformat**: Enthält `Reading:`, `Base directory`, Skill-Inhalt, `Skill read:`-Markierung

**Kernkonzepte**:

| Konzept | Erklärung |
|---|---|
| **Suchpriorität** | 4 Verzeichnisse werden der Reihe nach durchsucht, die erste Übereinstimmung wird zurückgegeben |
| **Basisverzeichnis** | Referenzverzeichnis, das der KI-Agent zum Auflösen relativer Pfade im Skill verwendet |
| **Mehrere Skills lesen** | Durch Kommata getrennt, in der angegebenen Reihenfolge gelesen |

**Kernbefehle**:

| Befehl | Funktion |
|---|---|
| `npx openskills read <name>` | Einzelnen Skill lesen |
| `npx openskills read name1,name2` | Mehrere Skills lesen |
| `npx openskills list` | Installierte Skills und deren Speicherort anzeigen |

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Befehle im Detail](../../platforms/cli-commands/)**.
>
> Sie werden lernen:
> - Die vollständige Liste aller OpenSkills-Befehle und deren Parameter
> - Die Verwendung und Funktion von Befehlszeilen-Flags
> - Eine Schnellreferenz für häufig verwendete Befehle

Nachdem Sie gelernt haben, Skills zu verwenden, müssen Sie als Nächstes alle Befehle verstehen, die OpenSkills bietet, und deren Funktionen.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Zum Anzeigen der Quellcode-Positionen klicken</strong></summary>

> Letzte Aktualisierung: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|---|---|---|
| read-Befehlseingang | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L8-L48) | 8-48 |
| Skill-Suche (findSkill) | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84) | 69-84 |
| Skill-Namen-Normalisierung | [`src/utils/skill-names.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-names.ts) | 1-8 |
| Suchverzeichnisse abrufen | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L18-L25) | 18-25 |
| CLI-Befehlsdefinition | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L52-L55) | 52-55 |

**Wichtige Funktionen**:
- `readSkill(skillNames)` - Liest Skills in die Standardausgabe, unterstützt mehrere Skill-Namen
- `findSkill(skillName)` - Sucht nach einem Skill nach 4-stufiger Priorität, gibt die erste Übereinstimmung zurück
- `normalizeSkillNames(input)` - Normalisiert die Liste der Skill-Namen, unterstützt Komma-Trennung und Deduplizierung
- `getSearchDirs()` - Gibt 4 Suchverzeichnisse zurück, sortiert nach Priorität

**Wichtige Typen**:
- `SkillLocation` - Informationen zur Skill-Position, enthält path, baseDir, source

**Verzeichnisprioritäten** (aus dirs.ts:18-24):
```typescript
[
  process.cwd() + '/.agent/skills',   // 1. Projekt universal
  homedir() + '/.agent/skills',       // 2. Global universal
  process.cwd() + '/.claude/skills',  // 3. Projekt claude
  homedir() + '/.claude/skills',      // 4. Global claude
]
```

</details>
