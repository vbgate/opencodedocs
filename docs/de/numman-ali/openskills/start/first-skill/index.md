## Mitmachen

### Schritt 1: In das Projektverzeichnis wechseln

Wechseln Sie zunächst in das Projektverzeichnis, an dem Sie gerade arbeiten:

```bash
cd /pfad/zu/ihrem/projekt
```

**Warum**

OpenSkills installiert Skills standardmäßig im Verzeichnis `.claude/skills/` des Projekts, damit die Skills versionskontrolliert und von Teammitgliedern gemeinsam genutzt werden können.

**Sie sollten sehen**:

Ihr Projektverzeichnis sollte eines der folgenden enthalten:

- `.git/` (Git-Repository)
- `package.json` (Node.js-Projekt)
- andere Projektdateien

::: tip Empfohlene Vorgehensweise

Selbst bei einem neuen Projekt wird empfohlen, zunächst ein Git-Repository zu initialisieren, damit die Skill-Dateien besser verwaltet werden können.

:::

---

### Schritt 2: Skill installieren

Verwenden Sie den folgenden Befehl, um Skills aus dem offiziellen Anthropic-Skill-Repository zu installieren:

```bash
npx openskills install anthropics/skills
```

**Warum**

`anthropics/skills` ist das offiziell von Anthropic gepflegte Skill-Repository. Es enthält hochwertige Skill-Beispiele und eignet sich ideal für die erste Erfahrung.

**Sie sollten sehen**:

Der Befehl startet eine interaktive Auswahl-Oberfläche:

```
Installing from: anthropics/skills
Location: project (.claude/skills)
Default install is project-local (./.claude/skills). Use --global for ~/.claude/skills.

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)    Comprehensive PDF manipulation toolkit for extracting text and tables...
  ◯ git-workflow (12 KB)   Git workflow: Best practices for commits, branches, and PRs...
  ◯ check-branch-first (8 KB)    Git workflow: Always check current branch before making changes...
  ◯ skill-creator (16 KB)   Guide for creating effective skills...

<Space> 选择  <a> 全选  <i> 反选  <Enter> 确认
```

**Bedienungsanleitung**:

```
┌─────────────────────────────────────────────────────────────┐
│  Bedienungsanleitung                                        │
│                                                             │
│  Schritt 1      Schritt 2       Schritt 3                 │
│  Cursor bewegen → Leertaste wählen → Enter bestätigen     │
│                                                             │
│  ○ Nicht ausgewählt     ◉ Ausgewählt                      │
└─────────────────────────────────────────────────────────────┘

Sie sollten sehen:
- Der Cursor kann nach oben und unten bewegt werden
- Leertaste schaltet den Auswahlzustand um (○ ↔ ◉)
- Enter-Taste bestätigt die Installation
```

---

### Schritt 3: Skill auswählen

Wählen Sie in der interaktiven Oberfläche den Skill aus, den Sie installieren möchten.

**Beispiel**:

Angenommen, Sie möchten den PDF-Verarbeitungsskill installieren:

```
? Select skills to install:
❯ ◉ pdf (24 KB)    ← Wählen Sie diesen
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

Vorgang:
1. **Cursor bewegen**: Verwenden Sie die Pfeiltasten nach oben/unten, um zur Zeile `pdf` zu gelangen
2. **Skill auswählen**: Drücken Sie die **Leertaste**, um sicherzustellen, dass vorne ein `◉` und nicht `◯` steht
3. **Installation bestätigen**: Drücken Sie die **Enter-Taste**, um die Installation zu starten

**Sie sollten sehen**:

```
✅ Installed: pdf
   Location: /path/to/your/project/.claude/skills/pdf

Skills installed to: /path/to/your/project/.claude/skills/

Next steps:
  → Run openskills sync to generate AGENTS.md with your installed skills
  → Run openskills list to see all installed skills
```

::: tip Erweiterte Bedienung

Wenn Sie mehrere Skills gleichzeitig installieren möchten:
- Drücken Sie die Leertaste, um jeden benötigten Skill auszuwählen (mehrere `◉`)
- Drücken Sie `<a>`, um alle Skills auszuwählen
- Drücken Sie `<i>`, um die aktuelle Auswahl umzukehren

:::

---

### Schritt 4: Installation überprüfen

Überprüfen Sie nach der Installation, ob der Skill erfolgreich im Projektverzeichnis installiert wurde.

**Verzeichnisstruktur prüfen**:

```bash
ls -la .claude/skills/
```

**Sie sollten sehen**:

```
.claude/skills/
└── pdf/
    ├── SKILL.md
    ├── .openskills.json
    ├── references/
    │   ├── pdf-extraction.md
    │   └── table-extraction.md
    └── scripts/
        └── extract-pdf.js
```

**Erläuterung der Schlüsseldateien**:

| Datei | Verwendungszweck |
| --- | ---|
| `SKILL.md` | Hauptinhalt und Anweisungen des Skills |
| `.openskills.json` | Installationsmetadaten (aufgezeichnete Quelle, für Updates) |
| `references/` | Referenzdokumentation und detaillierte Beschreibungen |
| `scripts/` | Ausführbare Skripte |

**Skill-Metadaten anzeigen**:

```bash
cat .claude/skills/pdf/.openskills.json
```

**Sie sollten sehen**:

```json
{
  "source": "anthropics/skills",
  "sourceType": "git",
  "repoUrl": "https://github.com/anthropics/skills",
  "subpath": "pdf",
  "installedAt": "2026-01-24T10:30:00.000Z"
}
```

Diese Metadatendatei zeichnet die Quellinformationen des Skills auf und wird bei späterer Verwendung von `openskills update` benötigt.

---

## Checkpoint ✅

Nach Abschluss der oben genannten Schritte bestätigen Sie bitte:

- [ ] Die Kommandozeile zeigt die interaktive Auswahl-Oberfläche an
- [ ] Mindestens ein Skill wurde erfolgreich ausgewählt (vorne steht `◉`)
- [ ] Die Installation war erfolgreich, die Meldung `✅ Installed:` wird angezeigt
- [ ] Das Verzeichnis `.claude/skills/` wurde erstellt
- [ ] Das Skill-Verzeichnis enthält die Datei `SKILL.md`
- [ ] Das Skill-Verzeichnis enthält die Metadatendatei `.openskills.json`

Wenn alle oben genannten Prüfpunkte bestanden sind, herzlichen Glückwunsch! Die erste Skill-Installation war erfolgreich.

---

## Warnhinweise

### Problem 1: Klonen des Repositories fehlgeschlagen

**Phänomen**:

```
✗ Failed to clone repository
fatal: repository 'https://github.com/anthropics/skills' not found
```

**Ursache**:
- Netzwerkverbindungsproblem
- Falscher GitHub-Repository-Link

**Lösung**:
1. Überprüfen Sie die Netzwerkverbindung: `ping github.com`
2. Bestätigen Sie, ob die Repository-Adresse korrekt ist (Format `owner/repo`)

---

### Problem 2: Keine interaktive Auswahl-Oberfläche

**Phänomen**:

Der Befehl hat alle Skills direkt installiert, ohne dass eine Auswahl-Oberfläche erschien.

**Ursache**:
- Im Repository gibt es nur eine `SKILL.md`-Datei (Single-Skill-Repository)
- Die Flag `-y` oder `--yes` wurde verwendet (Auswahl überspringen)

**Lösung**:
- Bei Single-Skill-Repositories ist dies normales Verhalten
- Wenn Sie eine Auswahl benötigen, entfernen Sie die Flag `-y`

---

### Problem 3: Berechtigungsfehler

**Phänomen**:

```
Error: EACCES: permission denied, mkdir '.claude/skills'
```

**Ursache**:
- Das aktuelle Verzeichnis hat keine Schreibberechtigung

**Lösung**:
1. Überprüfen Sie die Verzeichnisberechtigungen: `ls -la`
2. Verwenden Sie `sudo` oder wechseln Sie in ein Verzeichnis mit Berechtigungen

---

### Problem 4: SKILL.md nicht gefunden

**Phänomen**:

```
Error: No SKILL.md files found in repository
```

**Ursache**:
- Im Repository gibt es keine Skill-Dateien im richtigen Format

**Lösung**:
1. Bestätigen Sie, ob das Repository ein Skill-Repository ist
2. Überprüfen Sie die Verzeichnisstruktur des Repositories

---

## Zusammenfassung der Lektion

In dieser Lektion haben Sie gelernt:

- **Verwendung von `openskills install anthropics/skills`**, um Skills aus dem offiziellen Repository zu installieren
- **Auswahl von Skills in der interaktiven Oberfläche**, Leertaste zum Auswählen, Enter zum Bestätigen
- **Skills werden in `.claude/skills/` installiert**, Verzeichnis enthält `SKILL.md` und Metadaten
- **Überprüfung erfolgreicher Installation**, Überprüfung der Verzeichnisstruktur und Dateiinhalte

**Kernbefehle**:

| Befehl | Funktion |
| --- | ---|
| `npx openskills install anthropics/skills` | Skills aus dem offiziellen Repository installieren |
| `ls .claude/skills/` | Installierte Skills anzeigen |
| `cat .claude/skills/<name>/.openskills.json` | Skill-Metadaten anzeigen |

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Skills verwenden](../read-skills/)**.
>
> Sie werden lernen:
> - Verwendung des Befehls `openskills read`, um Skill-Inhalte zu lesen
> - Verständnis, wie KI-Agenten Skills in den Kontext laden
> - Beherrschung der 4-stufigen Prioritätsreihenfolge für die Skill-Suche

Die Installation von Skills ist nur der erste Schritt, als nächstes müssen wir verstehen, wie KI-Agenten diese Skills verwenden.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um den Quellcode-Standort anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | ---|
| Installationsbefehl-Einstieg | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L183) | 83-183 |
| Installationsort-Bestimmung (project vs global) | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| GitHub-Kurzschreibweise-Parsing | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Repository-Klonen | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Rekursive Skill-Suche | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L358-L373) | 358-373 |
| Interaktive Auswahl-Oberfläche | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L427-L455) | 427-455 |
| Skill-Kopieren und Installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L461-L486) | 461-486 |
| Offizielle Skill-Liste (Konfliktwarnung) | [`src/utils/marketplace-skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/marketplace-skills.ts) | 1-25 |

**Wichtige Funktionen**:
- `installFromRepo()` - Installiert Skills aus einem Repository, unterstützt interaktive Auswahl
- `installSpecificSkill()` - Installiert einen Skill am angegebenen Unterpfad
- `installFromLocal()` - Installiert Skills aus einem lokalen Pfad
- `warnIfConflict()` - Überprüft und warnt vor Skill-Konflikten

**Wichtige Konstanten**:
- `ANTHROPIC_MARKETPLACE_SKILLS` - Liste der Skills im Anthropic Marketplace, verwendet für Konfliktwarnungen

</details>
