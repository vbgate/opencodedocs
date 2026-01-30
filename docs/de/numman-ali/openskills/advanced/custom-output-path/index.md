---
title: "Benutzerdefinierter Ausgabepfad: Flexible Skill-Verwaltung | openskills"
sidebarTitle: "Skills an beliebiger Stelle speichern"
subtitle: "Benutzerdefinierter Ausgabepfad: Flexible Skill-Verwaltung | openskills"
description: "Lernen Sie den openskills sync -o Befehl kennen, um Skills flexibel an beliebige Orte zu synchronisieren. Unterstützt automatische Verzeichniserstellung in Multi-Tool-Umgebungen für flexible Integrationsanforderungen."
tags:
  - "Erweiterte Funktionen"
  - "Benutzerdefinierte Ausgabe"
  - "Skill-Synchronisierung"
  - "-o Flag"
prerequisite:
  - "start-sync-to-agents"
order: 2
---

# Benutzerdefinierter Ausgabepfad

## Was Sie nach diesem Tutorial können

- Mit dem `-o` oder `--output` Flag Skills als `.md`-Datei an beliebige Orte synchronisieren
- Verstehen, wie Tools automatisch nicht existierende Dateien und Verzeichnisse erstellen
- Verschiedene AGENTS.md für verschiedene Tools (Windsurf, Cursor usw.) konfigurieren
- Skill-Listen in Multi-Datei-Umgebungen verwalten
- Die Standard-`AGENTS.md` überspringen und in bestehende Dokumentationssysteme integrieren

::: info Voraussetzungen

Dieses Tutorial setzt voraus, dass Sie bereits die Grundlagen der [Skill-Synchronisierung](../../start/sync-to-agents/) beherrschen. Wenn Sie noch keine Skills installiert oder AGENTS.md synchronisiert haben, absolvieren Sie bitte zuerst das Vorkurs-Tutorial.

:::

---

## Ihre aktuelle Situation

Sie sind möglicherweise bereits mit der Standard-Generierung von `AGENTS.md` durch `openskills sync` vertraut, stoßen aber auf folgende Probleme:

- **Tool-spezifische Pfade erforderlich**: Einige KI-Tools (wie Windsurf) erwarten AGENTS.md in einem bestimmten Verzeichnis (z.B. `.ruler/`), nicht im Projektstammverzeichnis
- **Multi-Tool-Konflikte**: Bei gleichzeitiger Verwendung mehrerer Coding-Tools erwarten diese möglicherweise AGENTS.md an verschiedenen Orten
- **Integration in bestehende Dokumentation**: Sie haben bereits ein Skill-Listen-Dokument und möchten OpenSkills-Skills integrieren, anstatt eine neue Datei zu erstellen
- **Nicht existierende Verzeichnisse**: Sie möchten in ein verschachteltes Verzeichnis ausgeben (z.B. `docs/ai-skills.md`), aber das Verzeichnis existiert noch nicht

Die Wurzel dieser Probleme liegt darin: **Der Standard-Ausgabepfad kann nicht alle Szenarien abdecken**. Sie benötigen eine flexiblere Ausgabesteuerung.

---

## Wann diese Funktion verwenden

**Benutzerdefinierter Ausgabepfad** ist für diese Szenarien geeignet:

- **Multi-Tool-Umgebungen**: Unabhängige AGENTS.md für verschiedene KI-Tools konfigurieren (z.B. `.ruler/AGENTS.md` vs `AGENTS.md`)
- **Verzeichnisstruktur-Anforderungen**: Tools erwarten AGENTS.md in einem bestimmten Verzeichnis (z.B. Windsurfs `.ruler/`)
- **Integration in bestehende Dokumentation**: Skill-Listen in bestehende Dokumentationssysteme integrieren, anstatt neue AGENTS.md zu erstellen
- **Organisierte Verwaltung**: Skill-Listen nach Projekt oder Funktion kategorisiert speichern (z.B. `docs/ai-skills.md`)
- **CI/CD-Umgebungen**: In automatisierten Prozessen mit festem Ausgabepfad verwenden

::: tip Empfohlene Vorgehensweise

Wenn Ihr Projekt nur ein KI-Tool verwendet und dieses AGENTS.md im Projektstammverzeichnis unterstützt, verwenden Sie einfach den Standardpfad. Verwenden Sie den benutzerdefinierten Ausgabepfad nur bei Bedarf für Multi-Datei-Verwaltung oder tool-spezifische Pfadanforderungen.

:::

---

## 🎒 Vorbereitung

Bevor Sie beginnen, überprüfen Sie bitte:

- [ ] Mindestens einen Skill installiert ([Skill-Installation](../../start/first-skill/))
- [ ] Sie befinden sich in Ihrem Projektverzeichnis
- [ ] Sie kennen die Grundlagen der `openskills sync` Verwendung

::: warning Voraussetzungsprüfung

Überprüfen Sie, ob Sie installierte Skills haben:

```bash
npx openskills list
```

Wenn die Liste leer ist, installieren Sie zuerst einen Skill:

```bash
npx openskills install anthropics/skills
```

:::

---

## Kernkonzept: Flexible Ausgabesteuerung

Die OpenSkills-Synchronisierungsfunktion gibt standardmäßig nach `AGENTS.md` aus, aber Sie können mit dem `-o` oder `--output` Flag einen benutzerdefinierten Ausgabepfad festlegen.

```
[Standardverhalten]                    [Benutzerdefinierte Ausgabe]
openskills sync      →      AGENTS.md (Projektstammverzeichnis)
openskills sync -o custom.md →  custom.md (Projektstammverzeichnis)
openskills sync -o .ruler/AGENTS.md →  .ruler/AGENTS.md (Verschachteltes Verzeichnis)
```

**Wichtige Funktionen**:

1. **Beliebiger Pfad**: Sie können jeden `.md`-Dateipfad angeben (relativ oder absolut)
2. **Automatische Dateierstellung**: Wenn die Datei nicht existiert, erstellt das Tool sie automatisch
3. **Automatische Verzeichniserstellung**: Wenn das Verzeichnis der Datei nicht existiert, erstellt das Tool es rekursiv
4. **Intelligente Titel**: Beim Erstellen der Datei wird automatisch ein Titel basierend auf dem Dateinamen hinzugefügt (z.B. `# AGENTS`)
5. **Formatvalidierung**: Muss mit `.md` enden, sonst wird ein Fehler ausgegeben

**Warum wird diese Funktion benötigt?**

Verschiedene KI-Tools können unterschiedliche erwartete Pfade haben:

| Tool        | Erwarteter Pfad           | Standardpfad verfügbar |
| --- | --- | --- |
| Claude Code | `AGENTS.md`        | ✅ Verfügbar          |
| Cursor     | `AGENTS.md`        | ✅ Verfügbar          |
| Windsurf   | `.ruler/AGENTS.md` | ❌ Nicht verfügbar       |
| Aider      | `.aider/agents.md` | ❌ Nicht verfügbar       |

Mit dem `-o` Flag können Sie für jedes Tool den korrekten Pfad konfigurieren.

---

## Schritt-für-Schritt-Anleitung

### Schritt 1: Grundlegende Verwendung - Ausgabe ins aktuelle Verzeichnis

Versuchen Sie zuerst, Skills in eine benutzerdefinierte Datei im aktuellen Verzeichnis zu synchronisieren:

```bash
npx openskills sync -o my-skills.md
```

**Warum**

Mit `-o my-skills.md` teilen Sie dem Tool mit, dass es nach `my-skills.md` anstelle der Standard-`AGENTS.md` ausgeben soll.

**Sie sollten sehen**:

Wenn `my-skills.md` nicht existiert, erstellt das Tool sie:

```
Created my-skills.md
```

Dann startet die interaktive Auswahl:

```
Found 2 skill(s)

? Select skills to sync to my-skills.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...

<Space> Auswählen  <a> Alle auswählen  <i> Auswahl umkehren  <Enter> Bestätigen
```

Nach der Skill-Auswahl sehen Sie:

```
✅ Synced 2 skill(s) to my-skills.md
```

::: tip Überprüfung der generierten Datei

Zeigen Sie den Inhalt der generierten Datei an:

```bash
cat my-skills.md
```

Sie werden sehen:

```markdown
<!-- Dateititel: # my-skills -->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help...
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

Beachten Sie, dass die erste Zeile `# my-skills` ist - dies ist der automatisch generierte Titel basierend auf dem Dateinamen.

:::

---

### Schritt 2: Ausgabe in verschachteltes Verzeichnis

Versuchen Sie nun, Skills in ein nicht existierendes verschachteltes Verzeichnis zu synchronisieren:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**Warum**

Einige Tools (wie Windsurf) erwarten AGENTS.md im `.ruler/` Verzeichnis. Wenn das Verzeichnis nicht existiert, erstellt das Tool es automatisch.

**Sie sollten sehen**:

Wenn das `.ruler/` Verzeichnis nicht existiert, erstellt das Tool das Verzeichnis und die Datei:

```
Created .ruler/AGENTS.md
```

Dann startet die interaktive Auswahl (wie im vorherigen Schritt).

**Bedienungsanleitung**:

```
┌─────────────────────────────────────────────────────────────┐
│  Automatische Verzeichniserstellung                          │
│                                                             │
│  Eingegebener Befehl: openskills sync -o .ruler/AGENTS.md   │
│                                                             │
│  Tool-Ausführung:                                            │
│  1. Prüfen, ob .ruler Verzeichnis existiert  →  Existiert nicht │
│  2. .ruler Verzeichnis rekursiv erstellen   →  mkdir .ruler │
│  3. .ruler/AGENTS.md erstellen  →  # AGENTS Titel schreiben │
│  4. Skill-Inhalt synchronisieren  →  XML-Format Skill-Liste │
│                                                             │
│  Ergebnis: .ruler/AGENTS.md Datei erstellt, Skills synchronisiert │
└─────────────────────────────────────────────────────────────┘
```

::: tip Rekursive Erstellung

Das Tool erstellt rekursiv alle nicht existierenden übergeordneten Verzeichnisse. Zum Beispiel:

- `docs/ai/skills.md` - Wenn `docs` und `docs/ai` nicht existieren, werden beide erstellt
- `.config/agents.md` - Das versteckte Verzeichnis `.config` wird erstellt

:::

---

### Schritt 3: Multi-Datei-Verwaltung - Für verschiedene Tools konfigurieren

Angenommen, Sie verwenden gleichzeitig Windsurf und Cursor und müssen verschiedene AGENTS.md für sie konfigurieren:

```bash
<!-- Für Windsurf konfigurieren (erwartet .ruler/AGENTS.md) -->
npx openskills sync -o .ruler/AGENTS.md

<!-- Für Cursor konfigurieren (verwendet AGENTS.md im Projektstammverzeichnis) -->
npx openskills sync
```

**Warum**

Verschiedene Tools können AGENTS.md an verschiedenen Orten erwarten. Mit `-o` können Sie für jedes Tool den korrekten Pfad konfigurieren und Konflikte vermeiden.

**Sie sollten sehen**:

Beide Dateien werden separat generiert:

```bash
<!-- Windsurfs AGENTS.md anzeigen -->
cat .ruler/AGENTS.md

<!-- Cursors AGENTS.md anzeigen -->
cat AGENTS.md
```

::: tip Datei-Unabhängigkeit

Jede `.md`-Datei ist unabhängig und enthält ihre eigene Skill-Liste. Sie können in verschiedenen Dateien verschiedene Skills auswählen:

- `.ruler/AGENTS.md` - Für Windsurf ausgewählte Skills
- `AGENTS.md` - Für Cursor ausgewählte Skills
- `docs/ai-skills.md` - Skill-Liste in der Dokumentation

:::

---

### Schritt 4: Nicht-interaktive Synchronisierung in benutzerdefinierte Datei

In CI/CD-Umgebungen müssen Sie möglicherweise die interaktive Auswahl überspringen und alle Skills direkt in eine benutzerdefinierte Datei synchronisieren:

```bash
npx openskills sync -o .ruler/AGENTS.md -y
```

**Warum**

Das `-y` Flag überspringt die interaktive Auswahl und synchronisiert alle installierten Skills. Kombiniert mit dem `-o` Flag können Sie in automatisierten Prozessen in benutzerdefinierte Pfade ausgeben.

**Sie sollten sehen**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: info CI/CD-Anwendungsszenario

Verwendung in CI/CD-Skripten:

```bash
#!/bin/bash
<!-- Skills installieren -->
npx openskills install anthropics/skills -y

<!-- In benutzerdefinierte Datei synchronisieren (nicht-interaktiv) -->
npx openskills sync -o .ruler/AGENTS.md -y
```

:::

---

### Schritt 5: Ausgabedatei überprüfen

Überprüfen Sie abschließend, ob die Ausgabedatei korrekt generiert wurde:

```bash
<!-- Dateiinhalt anzeigen -->
cat .ruler/AGENTS.md

<!-- Überprüfen, ob Datei existiert -->
ls -l .ruler/AGENTS.md

<!-- Skill-Anzahl bestätigen -->
grep -c "<name>" .ruler/AGENTS.md
```

**Sie sollten sehen**:

1. Datei enthält korrekten Titel (z.B. `# AGENTS`)
2. Datei enthält `<skills_system>` XML-Tag
3. Datei enthält `<available_skills>` Skill-Liste
4. Jedes `<skill>` enthält `<name>`, `<description>`, `<location>`

::: tip Ausgabepfad überprüfen

Wenn Sie sich über das aktuelle Arbeitsverzeichnis nicht sicher sind, können Sie verwenden:

```bash
<!-- Aktuelles Verzeichnis anzeigen -->
pwd

<!-- Anzeigen, wohin der relative Pfad aufgelöst wird -->
realpath .ruler/AGENTS.md
```

:::

---

## Kontrollpunkt ✅

Nach Abschluss der obigen Schritte überprüfen Sie bitte:

- [ ] Erfolgreich mit `-o` Flag in benutzerdefinierte Datei ausgegeben
- [ ] Tool hat nicht existierende Datei automatisch erstellt
- [ ] Tool hat nicht existierende verschachtelte Verzeichnisse automatisch erstellt
- [ ] Generierte Datei enthält korrekten Titel (basierend auf Dateiname)
- [ ] Generierte Datei enthält `<skills_system>` XML-Tag
- [ ] Generierte Datei enthält vollständige Skill-Liste
- [ ] Verschiedene Ausgabepfade für verschiedene Tools konfigurierbar
- [ ] `-y` und `-o` Kombination in CI/CD-Umgebungen verwendbar

Wenn alle Kontrollpunkte bestanden sind, herzlichen Glückwunsch! Sie haben die Verwendung des benutzerdefinierten Ausgabepfads gemeistert und können Skills flexibel an beliebige Orte synchronisieren.

---

## Häufige Probleme

### Problem 1: Ausgabedatei ist keine Markdown-Datei

**Symptom**:

```
Error: Output file must be a markdown file (.md)
```

**Ursache**:

Bei Verwendung des `-o` Flags ist die angegebene Dateierweiterung nicht `.md`. Das Tool erzwingt die Ausgabe in eine Markdown-Datei, um sicherzustellen, dass KI-Tools sie korrekt parsen können.

**Lösung**:

Stellen Sie sicher, dass die Ausgabedatei mit `.md` endet:

```bash
<!-- ❌ Falsch -->
npx openskills sync -o skills.txt

<!-- ✅ Richtig -->
npx openskills sync -o skills.md
```

---

### Problem 2: Berechtigungsfehler bei Verzeichniserstellung

**Symptom**:

```
Error: EACCES: permission denied, mkdir '.ruler'
```

**Ursache**:

Beim Versuch, ein Verzeichnis zu erstellen, hat der aktuelle Benutzer keine Schreibberechtigung für das übergeordnete Verzeichnis.

**Lösung**:

1. Überprüfen Sie die Berechtigungen des übergeordneten Verzeichnisses:

```bash
ls -ld .
```

2. Wenn die Berechtigungen unzureichend sind, kontaktieren Sie den Administrator oder verwenden Sie ein Verzeichnis mit Berechtigungen:

```bash
<!-- Projektverzeichnis verwenden -->
cd ~/projects/my-project
npx openskills sync -o .ruler/AGENTS.md
```

---

### Problem 3: Ausgabepfad zu lang

**Symptom**:

Der Dateipfad ist sehr lang, was die Lesbarkeit und Wartbarkeit des Befehls erschwert:

```bash
npx openskills sync -o docs/ai/skills/v2/internal/agents.md
```

**Ursache**:

Zu tiefe Verschachtelung der Verzeichnisse führt zu schwer verwaltbaren Pfaden.

**Lösung**:

1. Verwenden Sie relative Pfade (beginnend im Projektstammverzeichnis)
2. Vereinfachen Sie die Verzeichnisstruktur
3. Erwägen Sie die Verwendung von symbolischen Links (siehe [Symbolische Link-Unterstützung](../symlink-support/))

```bash
<!-- Empfohlene Vorgehensweise: Flache Verzeichnisstruktur -->
npx openskills sync -o docs/agents.md
```

---

### Problem 4: Vergessen, das -o Flag zu verwenden

**Symptom**:

Sie erwarten die Ausgabe in eine benutzerdefinierte Datei, aber das Tool gibt weiterhin in die Standard-`AGENTS.md` aus.

**Ursache**:

Vergessen, das `-o` Flag zu verwenden, oder falsch geschrieben.

**Lösung**:

1. Überprüfen Sie, ob der Befehl `-o` oder `--output` enthält:

```bash
<!-- ❌ Falsch: -o Flag vergessen -->
npx openskills sync

<!-- ✅ Richtig: -o Flag verwenden -->
npx openskills sync -o .ruler/AGENTS.md
```

2. Verwenden Sie die vollständige Form `--output` (klarer):

```bash
npx openskills sync --output .ruler/AGENTS.md
```

---

### Problem 5: Dateiname enthält Sonderzeichen

**Symptom**:

Der Dateiname enthält Leerzeichen oder Sonderzeichen, was zu Pfad-Parsing-Fehlern führt:

```bash
npx openskills sync -o "my skills.md"
```

**Ursache**:

Verschiedene Shells behandeln Sonderzeichen unterschiedlich, was zu Pfadfehlern führen kann.

**Lösung**:

1. Vermeiden Sie Leerzeichen und Sonderzeichen
2. Wenn unbedingt erforderlich, verwenden Sie Anführungszeichen:

```bash
<!-- Nicht empfohlen -->
npx openskills sync -o "my skills.md"

<!-- Empfohlen -->
npx openskills sync -o my-skills.md
```

---

## Zusammenfassung

In dieser Lektion haben Sie gelernt:

- **Verwendung des `-o` oder `--output` Flags**, um Skills in benutzerdefinierte `.md`-Dateien zu synchronisieren
- **Mechanismus der automatischen Datei- und Verzeichniserstellung**, ohne manuelle Vorbereitung der Verzeichnisstruktur
- **Konfiguration verschiedener AGENTS.md für verschiedene Tools**, um Multi-Tool-Konflikte zu vermeiden
- **Multi-Datei-Verwaltungstechniken**, Skill-Listen nach Tool oder Funktion kategorisiert zu speichern
- **CI/CD-Umgebungsanwendung**, `-y` und `-o` Kombination für automatisierte Synchronisierung

**Kernbefehle**:

| Befehl | Funktion |
| --- | --- |
| `npx openskills sync -o custom.md` | In `custom.md` im Projektstammverzeichnis synchronisieren |
| `npx openskills sync -o .ruler/AGENTS.md` | In `.ruler/AGENTS.md` synchronisieren (Verzeichnis automatisch erstellen) |
| `npx openskills sync -o path/to/file.md` | In beliebigen Pfad synchronisieren (Verschachtelte Verzeichnisse automatisch erstellen) |
| `npx openskills sync -o custom.md -y` | Nicht-interaktiv in benutzerdefinierte Datei synchronisieren |

**Wichtige Punkte**:

- Ausgabedatei muss mit `.md` enden
- Tool erstellt automatisch nicht existierende Dateien und Verzeichnisse
- Beim Erstellen der Datei wird automatisch ein Titel basierend auf dem Dateinamen hinzugefügt
- Jede `.md`-Datei ist unabhängig und enthält ihre eigene Skill-Liste
- Geeignet für Multi-Tool-Umgebungen, Verzeichnisstruktur-Anforderungen, Integration in bestehende Dokumentation usw.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Symbolische Link-Unterstützung](../symlink-support/)** kennen.
>
> Sie werden lernen:
> - Wie symbolische Links für git-basierte Skill-Updates verwendet werden
> - Vorteile und Anwendungsszenarien symbolischer Links
> - Wie Skills in lokaler Entwicklung verwaltet werden
> - Erkennungs- und Verarbeitungsmechanismen symbolischer Links

Der benutzerdefinierte Ausgabepfad ermöglicht Ihnen die flexible Steuerung der Skill-Listenposition, während symbolische Links eine erweiterte Skill-Verwaltungsmethode bieten, die besonders für lokale Entwicklungsszenarien geeignet ist.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Quellcode-Positionen anzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| sync Befehlseingang | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| CLI-Optionsdefinition | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 66 |
| Ausgabepfad-Abruf | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19) | 19 |
| Ausgabedatei-Validierung | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 22-26 |
| Erstellung nicht existierender Dateien | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| Rekursive Verzeichniserstellung | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L31-L32) | 31-32 |
| Automatische Titelgenerierung | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L34) | 34 |
| Interaktive Eingabeaufforderung mit Ausgabedateiname | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L70) | 70 |

**Wichtige Funktionen**:
- `syncAgentsMd(options: SyncOptions)` - Synchronisiert Skills in die angegebene Ausgabedatei
- `options.output` - Benutzerdefinierter Ausgabepfad (optional, Standard 'AGENTS.md')

**Wichtige Konstanten**:
- `'AGENTS.md'` - Standard-Ausgabedateiname
- `'.md'` - Erzwungene Dateierweiterung

**Wichtige Logik**:
- Ausgabedatei muss mit `.md` enden, sonst Fehler und Beenden (sync.ts:23-26)
- Wenn Datei nicht existiert, übergeordnete Verzeichnisse (rekursiv) und Datei automatisch erstellen (sync.ts:28-36)
- Beim Erstellen der Datei Titel basierend auf Dateinamen schreiben: `# ${outputName.replace('.md', '')}` (sync.ts:34)
- Ausgabedateiname in interaktiver Eingabeaufforderung anzeigen (sync.ts:70)
- Ausgabedateiname in Erfolgsmeldung anzeigen (sync.ts:105, 107)

</details>
