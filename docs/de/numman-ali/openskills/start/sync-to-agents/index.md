---
title: "Skill-Synchronisation: AGENTS.md Generieren | openskills"
sidebarTitle: "KI über Skills Informieren"
subtitle: "Skill-Synchronisation: AGENTS.md Generieren"
description: "Lernen Sie, den openskills sync Befehl zu verwenden, um die AGENTS.md Datei zu generieren und KI-Agenten (Claude Code, Cursor) über installierte Skills zu informieren. Meistern Sie die Skill-Auswahl und Synchronisation, um die KI-Kontextnutzung zu optimieren."
tags:
  - "Einstiegstutorial"
  - "Skill-Synchronisation"
  - "AGENTS.md"
prerequisite:
  - "start-first-skill"
order: 5
---

# Skills zu AGENTS.md Synchronisieren

## Was Sie Nach Diesem Tutorial Können

- `openskills sync` verwenden, um die AGENTS.md Datei zu generieren
- Verstehen, wie KI-Agenten über AGENTS.md verfügbare Skills kennenlernen
- Skills zur Steuerung der KI-Kontextgröße auswählen
- Benutzerdefinierte Ausgabepfade zur Integration in bestehende Dokumentation verwenden
- Das AGENTS.md XML-Format und dessen Verwendung verstehen

::: info Voraussetzungen

Dieses Tutorial setzt voraus, dass Sie bereits [Ihren ersten Skill installiert](../first-skill/) haben. Wenn Sie noch keine Skills installiert haben, führen Sie bitte zuerst die Installation durch.

:::

---

## Ihr Aktuelles Dilemma

Möglicherweise haben Sie bereits einige Skills installiert, aber:

- **KI-Agenten wissen nicht, dass Skills verfügbar sind**: Die Skills sind installiert, aber KI-Agenten (wie Claude Code) wissen nichts von ihrer Existenz
- **Sie wissen nicht, wie Sie die KI informieren können**: Sie haben von `AGENTS.md` gehört, wissen aber nicht, was es ist oder wie man es erstellt
- **Sie befürchten, dass zu viele Skills den Kontext überladen**: Sie haben viele Skills installiert und möchten selektiv synchronisieren, ohne alle gleichzeitig der KI mitzuteilen

Die Wurzel dieser Probleme ist: **Skill-Installation und Skill-Verfügbarkeit sind zwei verschiedene Dinge**. Die Installation legt nur die Dateien ab, damit die KI davon erfährt, müssen sie zu AGENTS.md synchronisiert werden.

---

## Wann Diese Methode Verwendet Wird

**Skills zu AGENTS.md synchronisieren** eignet sich für folgende Szenarien:

- Nach der Installation von Skills, um KI-Agenten von deren Existenz zu informieren
- Nach dem Hinzufügen neuer Skills, um die Liste der verfügbaren Skills zu aktualisieren
- Nach dem Löschen von Skills, um sie aus AGENTS.md zu entfernen
- Selektive Synchronisation von Skills zur Steuerung der KI-Kontextgröße
- Multi-Agent-Umgebungen, die eine einheitliche Skill-Liste benötigen

::: tip Empfohlene Vorgehensweise

Führen Sie `openskills sync` jedes Mal aus, wenn Sie Skills installieren, aktualisieren oder löschen, um AGENTS.md mit den tatsächlichen Skills synchron zu halten.

:::

---

## 🎒 Vorbereitungen Vor Dem Start

Bevor Sie beginnen, stellen Sie bitte sicher:

- [ ] Sie haben [mindestens einen Skill installiert](../first-skill/)
- [ ] Sie befinden sich in Ihrem Projektverzeichnis
- [ ] Sie kennen den Installationsort der Skills (project oder global)

::: warning Vorab-Überprüfung

Wenn Sie noch keine Skills installiert haben, führen Sie zuerst aus:

```bash
npx openskills install anthropics/skills
```

:::

---

## Kernkonzept: Skill-Installation ≠ KI-Verfügbarkeit

Das Skill-Management von OpenSkills ist in zwei Phasen unterteilt:

```
[Installationsphase]            [Synchronisationsphase]
Skill → .claude/skills/  →  AGENTS.md
   ↓                        ↓
Datei existiert         KI-Agent liest
   ↓                        ↓
Lokal verfügbar         KI kennt und kann nutzen
```

**Wichtige Punkte**:

1. **Installationsphase**: Mit `openskills install` wird der Skill in das Verzeichnis `.claude/skills/` kopiert
2. **Synchronisationsphase**: Mit `openskills sync` werden die Skill-Informationen in `AGENTS.md` geschrieben
3. **KI liest**: Der KI-Agent liest `AGENTS.md` und erfährt, welche Skills verfügbar sind
4. **Bedarfsgesteuertes Laden**: Die KI lädt bei Bedarf den spezifischen Skill mit `openskills read <skill>`

**Warum wird AGENTS.md benötigt?**

KI-Agenten (wie Claude Code, Cursor) scannen nicht aktiv das Dateisystem. Sie benötigen eine klare "Skill-Liste", die ihnen mitteilt, welche Tools sie verwenden können. Diese Liste ist `AGENTS.md`.

---

## Schritt-für-Schritt-Anleitung

### Schritt 1: In das Projektverzeichnis Wechseln

Wechseln Sie zunächst in das Projektverzeichnis, in dem Sie Skills installiert haben:

```bash
cd /pfad/zu/ihrem/projekt
```

**Warum**

`openskills sync` sucht standardmäßig im aktuellen Verzeichnis nach installierten Skills und erstellt oder aktualisiert im aktuellen Verzeichnis die `AGENTS.md`.

**Sie sollten sehen**:

Ihr Projektverzeichnis sollte das Verzeichnis `.claude/skills/` enthalten (falls Sie Skills installiert haben):

```bash
ls -la
# Beispielausgabe:
drwxr-xr-x  5 user  staff  .claude
drwxr-xr-x  5 user  staff  .claude/skills/
-rw-r--r--  1 user  staff  package.json
```

---

### Schritt 2: Skills Synchronisieren

Verwenden Sie den folgenden Befehl, um installierte Skills mit AGENTS.md zu synchronisieren:

```bash
npx openskills sync
```

**Warum**

Der `sync` Befehl findet alle installierten Skills, generiert eine XML-formatierte Skill-Liste und schreibt sie in die Datei `AGENTS.md`.

**Sie sollten sehen**:

Der Befehl startet eine interaktive Auswahl:

```
Found 2 skill(s)

? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...
  ◯ check-branch-first          (global)   Git workflow: Always check current branch...

<Space> Select  <a> Select All  <i> Invert  <Enter> Confirm
```

**Bedienungsanleitung**:

```
┌─────────────────────────────────────────────────────────────┐
│  Bedienungsanleitung                                        │
│                                                             │
│  Schritt 1      Schritt 2        Schritt 3                  │
│  Cursor    →   Leertaste     →   Eingabe drücken           │
│  bewegen       zum Auswählen    zum Bestätigen              │
│                                                             │
│  ○ Nicht ausgewählt      ◉ Ausgewählt                     │
│                                                             │
│  (project)        Projektskill, blau hervorgehoben          │
│  (global)         Globaler Skill, grau angezeigt            │
└─────────────────────────────────────────────────────────────┘

Sie sollten sehen:
- Der Cursor kann sich nach oben und unten bewegen
- Drücken Sie die Leertaste, um den Auswahlstatus zu wechseln (○ ↔ ◉)
- Projektskills werden blau, globale Skills grau angezeigt
- Drücken Sie Eingabe, um die Synchronisation zu bestätigen
```

::: tip Intelligente Vorauswahl

Bei der ersten Synchronisation wählt das Tool standardmäßig alle **Projektskills** aus. Bei der Aktualisierung einer bestehenden AGENTS.md werden die **im Dokument bereits aktivierten Skills** vorausgewählt.

:::

---

### Schritt 3: Skills Auswählen

Wählen Sie in der interaktiven Oberfläche die Skills aus, die der KI-Agent kennen soll.

**Beispiel**:

Angenommen, Sie möchten alle installierten Skills synchronisieren:

```
? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)
  ◉ git-workflow                (project)
  ◯ check-branch-first          (global)   ← Diesen globalen Skill nicht auswählen
```

Aktionen:
1. **Cursor bewegen**: Verwenden Sie die Pfeiltasten nach oben/unten
2. **Auswählen/Abwählen**: Drücken Sie die **Leertaste**, um den Auswahlstatus zu wechseln (`○` ↔ `◉`)
3. **Synchronisation bestätigen**: Drücken Sie **Eingabe**, um die Synchronisation zu starten

**Sie sollten sehen**:

```
✅ Synced 2 skill(s) to AGENTS.md
```

::: tip Auswahlstrategie

- **Projektskills**: Skills speziell für dieses Projekt, empfohlen zur Synchronisation
- **Globale Skills**: Allgemeine Skills (z.B. Kodierungsrichtlinien), je nach Bedarf synchronisieren
- **Vermeiden Sie zu viele**: Zu viele Skills belegen KI-Kontext, empfohlen wird nur die Synchronisation häufig genutzter Skills

:::

---

### Schritt 4: AGENTS.md Anzeigen

Nach Abschluss der Synchronisation zeigen Sie die generierte AGENTS.md Datei an:

```bash
cat AGENTS.md
```

**Sie sollten sehen**:

```markdown
# AGENTS.md

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help complete the task more effectively.

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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms...</description>
<location>project</location>
</skill>

<skill>
<name>git-workflow</name>
<description>Git workflow: Best practices for commits, branches, and PRs, ensuring clean history and effective collaboration.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

**Erklärung der Schlüsselelemente**:

| Element | Funktion |
|---|---|
| `<skills_system>` | XML-Tag, der der KI mitteilt, dass dies eine Skill-Systemdefinition ist |
| `<usage>` | Verwendungshinweise, die der KI erklären, wie Skills aufgerufen werden |
| `<available_skills>` | Liste der verfügbaren Skills |
| `<skill>` | Definition eines einzelnen Skills |
| `<name>` | Skill-Name |
| `<description>` | Skill-Beschreibung |
| `<location>` | Skill-Standort |

::: info Warum das XML-Format?

Das XML-Format ist das Standardformat für KI-Agenten (insbesondere Claude Code), das eine einfache Analyse und Verarbeitung ermöglicht. Das Tool unterstützt auch das HTML-Kommentarformat als Alternative.

:::

---

### Schritt 5: KI-Lesevorgang Überprüfen

Lassen Sie nun den KI-Agenten AGENTS.md lesen, um zu überprüfen, ob er die verfügbaren Skills erkennt.

**Beispieldialog**:

```
Benutzer:
Ich möchte Tabellendaten aus einer PDF-Datei extrahieren

KI-Agent:
Ich kann den `pdf` Skill verwenden, um Ihnen beim Extrahieren von Tabellendaten zu helfen. Lassen Sie mich zunächst den detaillierten Inhalt dieses Skills laden.

KI führt aus:
npx openskills read pdf

Ausgabe:
Skill: pdf
Base Directory: /pfad/zum/projekt/.claude/skills/pdf

[Detaillierter Inhalt des PDF-Skills...]

KI:
Gut, ich habe den PDF-Skill geladen. Jetzt kann ich Ihnen beim Extrahieren der Tabellendaten helfen...
```

**Sie sollten sehen**:

- Der KI-Agent erkennt, dass der `pdf` Skill verwendet werden kann
- Die KI führt automatisch `npx openskills read pdf` aus, um den Skill-Inhalt zu laden
- Die KI führt die Aufgabe basierend auf den Skill-Anweisungen aus

---

### Schritt 6 (Optional): Benutzerdefinierter Ausgabepfad

Wenn Sie Skills in eine andere Datei (z.B. `.ruler/AGENTS.md`) synchronisieren möchten, verwenden Sie die Option `-o` oder `--output`:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**Warum**

Einige Tools (wie Windsurf) erwarten AGENTS.md möglicherweise in einem bestimmten Verzeichnis. Mit `-o` können Sie flexibel einen benutzerdefinierten Ausgabepfad festlegen.

**Sie sollten sehen**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: tip Nicht-Interaktive Synchronisation

In CI/CD-Umgebungen können Sie das Flag `-y` oder `--yes` verwenden, um die interaktive Auswahl zu überspringen und alle Skills zu synchronisieren:

```bash
npx openskills sync -y
```

:::

---

## Checkpoint ✅

Nach Abschluss der oben genannten Schritte überprüfen Sie bitte:

- [ ] Die Befehlszeile zeigt die interaktive Auswahloberfläche
- [ ] Mindestens ein Skill wurde erfolgreich ausgewählt (vor dem Namen steht `◉`)
- [ ] Die Synchronisation war erfolgreich, es wurde die Meldung `✅ Synced X skill(s) to AGENTS.md` angezeigt
- [ ] Die Datei `AGENTS.md` wurde erstellt oder aktualisiert
- [ ] Die Datei enthält das XML-Tag `<skills_system>`
- [ ] Die Datei enthält die Liste `<available_skills>`
- [ ] Jedes `<skill>` enthält `<name>`, `<description>`, `<location>`

Wenn alle diese Punkte erfüllt sind, herzlichen Glückwunsch! Die Skills wurden erfolgreich mit AGENTS.md synchronisiert, und der KI-Agent kann sie nun erkennen und verwenden.

---

## Fallstricke

### Problem 1: Keine Skills Gefunden

**Symptom**:

```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Ursache**:

- Im aktuellen Verzeichnis oder im globalen Verzeichnis sind keine Skills installiert

**Lösung**:

1. Überprüfen Sie, ob Skills installiert sind:

```bash
npx openskills list
```

2. Falls nicht, installieren Sie zunächst Skills:

```bash
npx openskills install anthropics/skills
```

---

### Problem 2: AGENTS.md Wird Nicht Aktualisiert

**Symptom**:

Nach dem Ausführen von `openskills sync` ändert sich der Inhalt von AGENTS.md nicht.

**Ursache**:

- Das Flag `-y` wurde verwendet, aber die Skill-Liste ist identisch mit der vorherigen
- AGENTS.md existiert bereits, aber es werden dieselben Skills synchronisiert

**Lösung**:

1. Überprüfen Sie, ob das Flag `-y` verwendet wurde

```bash
# Entfernen Sie -y, um in den interaktiven Modus zu wechseln und neu auszuwählen
npx openskills sync
```

2. Überprüfen Sie, ob Sie sich im richtigen Verzeichnis befinden

```bash
# Bestätigen Sie, dass Sie sich im Projektverzeichnis mit den installierten Skills befinden
pwd
ls .claude/skills/
```

---

### Problem 3: KI-Agent Kennt Die Skills Nicht

**Symptom**:

AGENTS.md wurde generiert, aber der KI-Agent weiß immer noch nicht, dass Skills verfügbar sind.

**Ursache**:

- Der KI-Agent hat AGENTS.md nicht gelesen
- Das AGENTS.md Format ist nicht korrekt
- Der KI-Agent unterstützt das Skill-System nicht

**Lösung**:

1. Stellen Sie sicher, dass AGENTS.md im Projektstammverzeichnis liegt
2. Überprüfen Sie, ob das AGENTS.md Format korrekt ist (enthält das Tag `<skills_system>`)
3. Überprüfen Sie, ob der KI-Agent AGENTS.md unterstützt (Claude Code unterstützt es, andere Tools erfordern möglicherweise Konfiguration)

---

### Problem 4: Ausgabedatei Ist Keine Markdown-Datei

**Symptom**:

```
Error: Output file must be a markdown file (.md)
```

**Ursache**:

- Die Option `-o` wurde verwendet, aber die angegebene Datei hat nicht die Erweiterung `.md`

**Lösung**:

1. Stellen Sie sicher, dass die Ausgabedatei mit `.md` endet

```bash
# ❌ Falsch
npx openskills sync -o skills.txt

# ✅ Richtig
npx openskills sync -o skills.md
```

---

### Problem 5: Alle Auswahlen Aufheben

**Symptom**:

In der interaktiven Oberfläche werden nach dem Aufheben aller Skill-Auswahlen die Skill-Abschnitte in AGENTS.md gelöscht.

**Ursache**:

Dies ist das normale Verhalten. Wenn alle Skills abgewählt werden, entfernt das Tool den Skill-Abschnitt aus AGENTS.md.

**Lösung**:

Wenn dies ein Versehen war, führen Sie `openskills sync` erneut aus und wählen Sie die zu synchronisierenden Skills aus.

---

## Lektionszusammenfassung

In dieser Lektion haben Sie gelernt:

- **`openskills sync` verwenden**, um die AGENTS.md Datei zu generieren
- **Den Skill-Synchronisationsfluss verstehen**: Installation → Synchronisation → KI liest → Bedarfsgesteuertes Laden
- **Interaktive Skill-Auswahl**, um die KI-Kontextgröße zu steuern
- **Benutzerdefinierte Ausgabepfade**, um in bestehende Dokumentationssysteme zu integrieren
- **Das AGENTS.md Format verstehen**, einschließlich `<skills_system>` XML-Tags und Skill-Listen

**Kernbefehle**:

| Befehl | Funktion |
|---|---|
| `npx openskills sync` | Skills interaktiv mit AGENTS.md synchronisieren |
| `npx openskills sync -y` | Alle Skills nicht-interaktiv synchronisieren |
| `npx openskills sync -o custom.md` | In benutzerdefinierte Datei synchronisieren |
| `cat AGENTS.md` | Den Inhalt der generierten AGENTS.md anzeigen |

**Wichtige AGENTS.md Formatpunkte**:

- Verwendet `<skills_system>` XML-Tags als Wrapper
- Enthält `<usage>` Verwendungshinweise
- Enthält `<available_skills>` Skill-Liste
- Jedes `<skill>` enthält `<name>`, `<description>`, `<location>`

---

## Vorschau Auf Die Nächste Lektion

> In der nächsten Lektion lernen wir **[Skills Verwenden](../read-skills/)**.
>
> Sie werden lernen:
> - Wie KI-Agenten den `openskills read` Befehl zum Laden von Skills verwenden
> - Den vollständigen Skill-Ladefluss
> - Wie mehrere Skills gelesen werden
> - Die Struktur und Zusammensetzung von Skill-Inhalten

Die Synchronisation von Skills macht der KI nur bekannt, welche Tools verfügbar sind. Bei der tatsächlichen Verwendung lädt die KI den spezifischen Skill-Inhalt über den Befehl `openskills read`.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie zum Anzeigen der Quellcode-Position</strong></summary>

> Aktualisierungszeit: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|---|---|---|
| sync Befehl Einstiegspunkt | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| Ausgabedatei-Validierung | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19-L26) | 19-26 |
| Nicht vorhandene Datei erstellen | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| Interaktive Auswahloberfläche | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| Vorhandene AGENTS.md parsen | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Skill-XML generieren | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| Skill-Abschnitt ersetzen | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| Skill-Abschnitt löschen | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L98-L122) | 98-122 |

**Wichtige Funktionen**:
- `syncAgentsMd()` - Synchronisiert Skills in die AGENTS.md Datei
- `parseCurrentSkills()` - Parst Skill-Namen aus der vorhandenen AGENTS.md
- `generateSkillsXml()` - Generiert eine XML-formatierte Skill-Liste
- `replaceSkillsSection()` - Ersetzt oder fügt den Skill-Abschnitt in die Datei ein
- `removeSkillsSection()` - Entfernt den Skill-Abschnitt aus der Datei

**Wichtige Konstanten**:
- `AGENTS.md` - Standard-Ausgabedateiname
- `<skills_system>` - XML-Tag zur Markierung der Skill-Systemdefinition
- `<available_skills>` - XML-Tag zur Markierung der verfügbaren Skill-Liste

**Wichtige Logik**:
- Standardmäßig werden die bereits im Dokument vorhandenen Skills vorausgewählt (inkrementelle Aktualisierung)
- Bei der ersten Synchronisation werden standardmäßig alle Projektskills ausgewählt
- Unterstützt zwei Markierungsformate: XML-Tags und HTML-Kommentare
- Bei Aufhebung aller Auswahlen wird der Skill-Abschnitt gelöscht, anstatt eine leere Liste beizubehalten

</details>
