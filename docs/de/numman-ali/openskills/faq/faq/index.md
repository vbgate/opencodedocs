---
title: "Häufig gestellte Fragen: Fehlerbehebungsleitfaden | OpenSkills"
subtitle: "Häufig gestellte Fragen: Fehlerbehebungsleitfaden"
sidebarTitle: "Problemlösung"
description: "Lernen Sie Lösungen für häufige OpenSkills-Probleme. Diagnose Sie schnell Installationsfehler, nicht geladene Skills, AGENTS.md-Synchronisationsprobleme und verbessern Sie die Skill-Verwaltungseffizienz."
tags:
  - "FAQ"
  - "Fehlerbehebung"
  - "Häufige Fragen"
prerequisite:
  - "start-quick-start"
order: 1
---

# Häufig gestellte Fragen

## Was Sie nach diesem Lernen können

Dieser Kurs beantwortet häufige Fragen zur Nutzung von OpenSkills und hilft Ihnen dabei:

- ✅ Schnelle Identifizierung und Lösung von Installationsfehlern
- ✅ Verständnis der Beziehung zwischen OpenSkills und Claude Code
- ✅ Lösung des Problems, dass Skills nicht in AGENTS.md erscheinen
- ✅ Bearbeitung von Fragen zu Skill-Updates und -löschung
- ✅ Konfiguration von Skills in Multi-Agenten-Umgebungen

## Ihre aktuellen Probleme

Bei der Nutzung von OpenSkills können Sie auf folgende Probleme stoßen:

- "Die Installation schlägt immer fehl, ich weiß nicht, was falsch ist"
- "Ich sehe den neu installierten Skill nicht in AGENTS.md"
- "Ich weiß nicht, wo Skills eigentlich installiert sind"
- "Ich möchte OpenSkills verwenden, habe aber Angst vor Konflikten mit Claude Code"

Dieser Kurs hilft Ihnen, schnell die Ursache und die Lösung für Probleme zu finden.

---

## Konzepte

### Was ist der Unterschied zwischen OpenSkills und Claude Code?

**Kurzantwort**: OpenSkills ist ein "Universal-Installer", Claude Code ist ein "offizieller Agent".

**Detaillierte Erklärung**:

| Vergleichsmerkmal | OpenSkills | Claude Code |
|--- | --- | ---|
| **Positionierung** | Universaler Skill-Loader | Offizieller AI-Coding-Agent von Anthropic |
| **Unterstützungsbereich** | Alle AI-Agenten (Cursor, Windsurf, Aider usw.) | Nur Claude Code |
| **Skill-Format** | Identisch mit Claude Code (`SKILL.md`) | Offizielle Spezifikation |
| **Installationsmethode** | Von GitHub, lokalen Pfaden, privaten Repositories installieren | Vom integrierten Marketplace installieren |
| **Skill-Speicherung** | `.claude/skills/` oder `.agent/skills/` | `.claude/skills/` |
| **Aufrufmethode** | `npx openskills read <name>` | Integriertes `Skill()`-Tool |

**Kernwert**: OpenSkills ermöglicht es anderen Agenten, das Anthropic-Skill-System zu nutzen, ohne dass jeder Agent es separat implementieren muss.

### Warum CLI und nicht MCP?

**Grundlegender Grund**: Skills sind statische Dateien, MCP ist ein dynamisches Tool – beide lösen unterschiedliche Probleme.

| Vergleichsdimension | MCP (Model Context Protocol) | OpenSkills (CLI) |
|--- | --- | ---|
| **Anwendungsfall** | Dynamische Tools, Echtzeit-API-Aufrufe | Statische Anweisungen, Dokumentationen, Skripte |
| **Laufzeitanforderung** | Erfordert MCP-Server | Kein Server erforderlich (nur Dateien) |
| **Agenten-Unterstützung** | Nur MCP-unterstützte Agenten | Alle Agenten, die `AGENTS.md` lesen können |
| **Komplexität** | Erfordert Server-Bereitstellung | Null-Konfiguration |

**Wichtige Punkte**:

- **Skills sind Dateien**: SKILL.md besteht aus statischen Anweisungen + Ressourcen (references/, scripts/, assets/), kein Server erforderlich
- **Keine Agenten-Unterstützung erforderlich**: Jeder Agent, der Shell-Befehle ausführen kann, kann es nutzen
- **Entspricht dem offiziellen Design**: Das Anthropic-Skill-System ist von Natur aus ein Dateisystemdesign, kein MCP-Design

**Zusammenfassung**: MCP und das Skill-System lösen unterschiedliche Probleme. OpenSkills behält die Leichtgewichtigkeit und Universalität von Skills bei, ohne dass jeder Agent MCP unterstützen muss.

---

## Installation und Konfiguration

### Was tun, wenn die Installation fehlschlägt?

**Häufige Fehler und Lösungen**:

#### Fehler 1: Klonen fehlgeschlagen

```bash
Error: Git clone failed
```

**Mögliche Ursachen**:
- Netzwerkprobleme (kein Zugriff auf GitHub)
- Git nicht installiert oder zu alte Version
- Für private Repositories keine SSH-Schlüssel konfiguriert

**Lösung**:

1. Prüfen, ob Git installiert ist:
   ```bash
   git --version
   # Sollte anzeigen: git version 2.x.x
   ```

2. Netzwerkverbindung prüfen:
   ```bash
   # Testen, ob GitHub erreichbar ist
   ping github.com
   ```

3. Für private Repositories SSH konfigurieren:
   ```bash
   # SSH-Verbindung testen
   ssh -T git@github.com
   ```

#### Fehler 2: Pfad existiert nicht

```bash
Error: Path does not exist: ./nonexistent-path
```

**Lösung**:
- Bestätigen, dass der lokale Pfad korrekt ist
- Absoluten oder relativen Pfad verwenden:
   ```bash
   # Absoluter Pfad
   npx openskills install /Users/dev/my-skills

   # Relativer Pfad
   npx openskills install ./my-skills
   ```

#### Fehler 3: SKILL.md nicht gefunden

```bash
Error: No valid SKILL.md found
```

**Lösung**:

1. Skill-Verzeichnisstruktur prüfen:
   ```bash
   ls -la ./my-skill
   # Muss SKILL.md enthalten
   ```

2. Bestätigen, dass SKILL.md gültiges YAML-Frontmatter hat:
   ```markdown
   ---
   name: my-skill
   description: Skill description
   ---

   # Skill content
   ```

### In welchem Verzeichnis werden Skills installiert?

**Standard-Installationsort** (projektlokal):
```bash
.claude/skills/
```

**Globaler Installationsort** (mit `--global`):
```bash
~/.claude/skills/
```

**Universal-Modus** (mit `--universal`):
```bash
.agent/skills/
```

**Skill-Suchpriorität** (von hoch nach niedrig):
1. `./.agent/skills/` (projektlokal, Universal)
2. `~/.agent/skills/` (global, Universal)
3. `./.claude/skills/` (projektlokal, Standard)
4. `~/.claude/skills/` (global, Standard)

**Installierte Skills anzeigen**:
```bash
npx openskills list
# Ausgabe zeigt [project] oder [global]-Tag
```

### Wie kann ich mit dem Claude Code Marketplace koexistieren?

**Problem**: Ich möchte sowohl Claude Code als auch OpenSkills verwenden – wie vermeide ich Konflikte?

**Lösung**: Verwenden Sie den Universal-Modus

```bash
# Installieren nach .agent/skills/ statt .claude/skills/
npx openskills install anthropics/skills --universal
```

**Warum es funktioniert**:

| Verzeichnis | Wer nutzt es | Beschreibung |
|--- | --- | ---|
| `.claude/skills/` | Claude Code | Wird vom Claude Code Marketplace verwendet |
| `.agent/skills/` | OpenSkills | Wird von anderen Agenten (Cursor, Windsurf) verwendet |

**Konfliktwarnung**:

Bei der Installation aus dem offiziellen Repository warnt OpenSkills:
```
⚠️  Warning: These skills are also available in Claude Code Marketplace.
   Installing to .claude/skills/ may cause conflicts.
   Use --universal to install to .agent/skills/ instead.
```

---

## Nutzung

### Der Skill erscheint nicht in AGENTS.md?

**Symptom**: Nach der Installation des Skills ist dieser nicht in AGENTS.md vorhanden.

**Fehlerbehebungsschritte**:

#### 1. Sicherstellen, dass synchronisiert wurde

Nach der Installation eines Skills muss der `sync`-Befehl ausgeführt werden:

```bash
npx openskills install anthropics/skills
# Skills auswählen...

# Sync muss ausgeführt werden!
npx openskills sync
```

#### 2. AGENTS.md-Speicherort prüfen

```bash
# Standardmäßig AGENTS.md im Projektstammverzeichnis
cat AGENTS.md
```

Bei Verwendung eines benutzerdefinierten Ausgabepfads bestätigen Sie den Pfad:
```bash
npx openskills sync -o custom-path/AGENTS.md
```

#### 3. Prüfen, ob der Skill ausgewählt wurde

Der `sync`-Befehl ist interaktiv – stellen Sie sicher, dass Sie die zu synchronisierenden Skills ausgewählt haben:

```bash
npx openskills sync

? Select skills to sync:
  ◉ pdf                  [Ausgewählt]
  ◯ check-branch-first   [Nicht ausgewählt]
```

#### 4. AGENTS.md-Inhalt prüfen

Bestätigen Sie, dass die XML-Tags korrekt sind:

```xml
<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
```

### Wie aktualisiere ich Skills?

**Alle Skills aktualisieren**:
```bash
npx openskills update
```

**Bestimmte Skills aktualisieren** (durch Kommas getrennt):
```bash
npx openskills update pdf,git-workflow
```

**Häufige Probleme**:

#### Skill wurde nicht aktualisiert

**Symptom**: Nach dem Ausführen von `update` wird "skipped" angezeigt

**Ursache**: Bei der Installation des Skills wurden keine Quellinformationen gespeichert (Verhalten alter Versionen)

**Lösung**:
```bash
# Neuinstallieren, um Quellinformationen zu speichern
npx openskills install anthropics/skills
```

#### Lokale Skills können nicht aktualisiert werden

**Symptom**: Aus einem lokalen Pfad installierter Skills, Update schlägt fehl

**Ursache**: Lokale Pfad-Skills müssen manuell aktualisiert werden

**Lösung**:
```bash
# Neu aus dem lokalen Pfad installieren
npx openskills install ./my-skill
```

### Wie lösche ich Skills?

**Methode 1: Interaktives Löschen**

```bash
npx openskills manage
```

Wählen Sie den zu löschenden Skill, drücken Sie die Leertaste zum Auswählen und Enter zum Bestätigen.

**Methode 2: Direktes Löschen**

```bash
npx openskills remove <skill-name>
```

**Nach dem Löschen**: Führen Sie `sync` aus, um AGENTS.md zu aktualisieren:
```bash
npx openskills sync
```

**Häufige Probleme**:

#### Skill versehentlich gelöscht

**Wiederherstellung**:
```bash
# Neu aus der Quelle installieren
npx openskills install anthropics/skills
# Versehentlich gelöschten Skill auswählen
```

#### Skill wird nach dem Löschen immer noch in AGENTS.md angezeigt

**Lösung**: Neu synchronisieren
```bash
npx openskills sync
```

---

## Fortgeschrittene Themen

### Wie werden Skills in mehreren Projekten gemeinsam genutzt?

**Szenario**: Mehrere Projekte benötigen denselben Satz an Skills, ohne dass sie erneut installiert werden müssen.

**Lösung 1: Globale Installation**

```bash
# Einmal global installieren
npx openskills install anthropics/skills --global

# Alle Projekte können sie nutzen
cd project-a
npx openskills read pdf

cd project-b
npx openskills read pdf
```

**Vorteile**:
- Einmal installiert, überall verfügbar
- Geringerer Speicherverbrauch

**Nachteile**:
- Skills nicht im Projekt, nicht in der Versionsverwaltung enthalten

**Lösung 2: Symbolische Links**

```bash
# 1. Skills global installieren
npx openskills install anthropics/skills --global

# 2. Im Projekt symbolischen Links erstellen
cd project-a
ln -s ~/.claude/skills/pdf .claude/skills/pdf

# 3. Bei Sync wird als [project]-Speicherort erkannt
npx openskills sync
```

**Vorteile**:
- Skills im Projekt (`[project]`-Tag)
- Versionsverwaltung kann symbolische Links enthalten
- Einmal installiert, mehrfach nutzbar

**Nachteile**:
- Symbolische Links erfordern auf bestimmten Systemen Berechtigungen

**Lösung 3: Git Submodule**

```bash
# Skill-Repository im Projekt als Submodule hinzufügen
cd project-a
git submodule add https://github.com/anthropics/skills.git .claude/skills-repo

# Skills aus dem Submodule installieren
npx openskills install .claude/skills-repo/pdf
```

**Vorteile**:
- Vollständige Versionsverwaltung
- Spezifische Skill-Versionen können angegeben werden

**Nachteile**:
- Komplexere Konfiguration

### Symbolische Links können nicht aufgerufen werden?

**Symptom**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Lösung nach System**:

#### macOS

1. Öffnen Sie "Systemeinstellungen"
2. Gehen Sie zu "Sicherheit & Datenschutz"
3. Gewähren Sie im Abschnitt "Volldatenträgerzugriff" Ihrem Terminal-Anwendung Zugriff

#### Windows

Windows unterstützt keine symbolischen Links nativ – empfohlene Lösungen:
- **Git Bash verwenden**: Integrierte Unterstützung für symbolische Links
- **WSL verwenden**: Linux-Subsystem unterstützt symbolische Links
- **Entwicklermodus aktivieren**: Einstellungen → Update und Sicherheit → Entwicklermodus

```bash
# Symbolischen Links in Git Bash erstellen
ln -s /c/dev/my-skills/my-skill .claude/skills/my-skill
```

#### Linux

Dateisystemberechtigungen prüfen:

```bash
# Verzeichnisberechtigungen prüfen
ls -la .claude/

# Schreibberechtigung hinzufügen
chmod +w .claude/
```

### Skill nicht gefunden?

**Symptom**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Fehlerbehebungsschritte**:

#### 1. Bestätigen, dass der Skill installiert ist

```bash
npx openskills list
```

#### 2. Groß-/Kleinschreibung des Skill-Namens prüfen

```bash
# ❌ Fehler (Großschreibung)
npx openskills read My-Skill

# ✅ Korrekt (Kleinschreibung)
npx openskills read my-skill
```

#### 3. Prüfen, ob der Skill von einem höher priorisierten Skill überschrieben wird

```bash
# Alle Skill-Speicherorte anzeigen
ls -la .claude/skills/my-skill
ls -la ~/.claude/skills/my-skill
ls -la .agent/skills/my-skill
ls -la ~/.agent/skills/my-skill
```

**Skill-Suchregel**: Der Speicherort mit der höchsten Priorität überschreibt Skills mit demselben Namen an anderen Speicherorten.

---

## Zusammenfassung

Kernpunkte zu häufigen OpenSkills-Fragen:

### Kernkonzepte

- ✅ OpenSkills ist ein Universal-Installer, Claude Code ist ein offizieller Agent
- ✅ CLI ist besser für das Skill-System geeignet als MCP (statische Dateien)

### Installation und Konfiguration

- ✅ Skills werden standardmäßig in `.claude/skills/` installiert
- ✅ Verwenden Sie `--universal`, um Konflikte mit Claude Code zu vermeiden
- ✅ Installationsfehler sind meist Netzwerk-, Git- oder Pfadprobleme

### Nutzungstipps

- ✅ Nach der Installation muss `sync` ausgeführt werden, damit Skills in AGENTS.md erscheinen
- ✅ Der `update`-Befehl aktualisiert nur Skills mit Quellinformationen
- ✅ Nach dem Löschen von Skills nicht vergessen, `sync` auszuführen

### Fortgeschrittene Szenarien

- ✅ Multi-Projekt-Skill-Freigabe: Globale Installation, symbolische Links, Git Submodule
- ✅ Probleme mit symbolischen Links: Berechtigungen pro System konfigurieren
- ✅ Skill nicht gefunden: Namen prüfen, Prioritäten anzeigen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Fehlerbehebung](../troubleshooting/)**.
>
> Sie werden lernen:
> - Schnelle Diagnose- und Lösungsmethoden für häufige Fehler
> - Umgang mit Pfadfehlern, Klonfehlern, ungültiger SKILL.md usw.
> - Fehlersuchtechniken für Berechtigungsprobleme und symbolische Links

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Speicherorte anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-24

| Funktion | Dateipfad                                                                                                   | Zeile    |
|--- | --- | ---|
| Installationsbefehl | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts)              | 1-424   |
| Synchronisationsbefehl | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)                  | 1-99    |
| Update-Befehl | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts)              | 1-113   |
| Löschbefehl | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts)              | 1-30    |
| Skill-Suche | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts)                    | 1-50    |
| Verzeichnispriorität | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts)                      | 14-25   |
| AGENTS.md-Generierung | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts)            | 23-93   |

**Wichtige Funktionen**:
- `findAllSkills()`: Alle Skills finden (nach Priorität sortiert)
- `findSkill(name)`: Bestimmten Skill finden
- `generateSkillsXml()`: AGENTS.md im XML-Format generieren
- `updateSkillFromDir()`: Skill aus Verzeichnis aktualisieren

</details>
