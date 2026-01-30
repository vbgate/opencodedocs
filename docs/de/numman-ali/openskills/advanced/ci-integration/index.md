---
title: "CI/CD: Nicht-interaktive Integration | OpenSkills"
sidebarTitle: "CI/CD automatisieren"
subtitle: "CI/CD: Nicht-interaktive Integration | OpenSkills"
description: "Erfahren Sie, wie Sie OpenSkills in CI/CD-Pipelines integrieren. Beherrschen Sie das -y Flag für nicht-interaktive Installation und Synchronisation. Mit praktischen Beispielen für GitHub Actions und Docker."
tags:
  - "Fortgeschritten"
  - "CI/CD"
  - "Automatisierung"
  - "Bereitstellung"
prerequisite:
  - "start-first-skill"
  - "start-sync-to-agents"
  - "platforms-cli-commands"
order: 6
---

# CI/CD-Integration

## Lernziele

- Verstehen, warum CI/CD-Umgebungen den nicht-interaktiven Modus benötigen
- Beherrschen der Verwendung des `--yes/-y` Flags in den Befehlen `install` und `sync`
- Integration von OpenSkills in CI-Plattformen wie GitHub Actions, GitLab CI
- Verständnis des automatisierten Skill-Installationsprozesses in Docker-Containern
- Beherrschung von Aktualisierungs- und Synchronisationsstrategien in CI/CD-Umgebungen
- Vermeidung von Fehlern durch interaktive Eingabeaufforderungen in CI/CD-Workflows

::: info Voraussetzungen

Dieses Tutorial setzt voraus, dass Sie bereits [Ihren ersten Skill installieren](../../start/first-skill/) und [Skills zu AGENTS.md synchronisieren](../../start/sync-to-agents/) sowie die [Befehlsreferenz](../../platforms/cli-commands/) kennen.

:::

---

## Ihr aktuelles Problem

Sie verwenden OpenSkills bereits erfolgreich in Ihrer lokalen Umgebung, stoßen aber in CI/CD-Umgebungen auf Probleme:

- **Fehler durch interaktive Eingabeaufforderungen**: Das CI-Workflow zeigt ein Auswahlmenü, das nicht automatisch fortgesetzt werden kann
- **Automatisierte Bereitstellung erfordert Skill-Installation**: Bei jedem Build müssen Skills neu installiert werden, aber dies kann nicht automatisch bestätigt werden
- **Nicht synchronisierte Multi-Umgebung-Konfiguration**: Die Skill-Konfigurationen in Entwicklungs-, Test- und Produktionsumgebungen sind inkonsistent
- **Nicht automatisierte AGENTS.md-Generierung**: Nach jeder Bereitstellung muss der sync-Befehl manuell ausgeführt werden
- **Fehlende Skills in Docker-Images**: Skills müssen nach Container-Start manuell installiert werden

Tatsächlich bietet OpenSkills das Flag `--yes/-y`, das speziell für nicht-interaktive Umgebungen entwickelt wurde und Ihnen ermöglicht, alle Vorgänge in CI/CD-Workflows zu automatisieren.

---

## Wann verwenden Sie diesen Ansatz

**Anwendungsszenarien für die CI/CD-Integration**:

| Szenario | Nicht-interaktiver Modus erforderlich? | Beispiel |
|--- | --- | ---|
| **GitHub Actions** | ✅ Ja | Automatische Skill-Installation bei jedem PR oder Push |
| **GitLab CI** | ✅ Ja | Automatische Synchronisation von AGENTS.md bei Merge Requests |
| **Docker-Build** | ✅ Ja | Automatische Installation von Skills in Container während Image-Build |
| **Jenkins-Pipelines** | ✅ Ja | Automatische Aktualisierung von Skills bei Continuous Integration |
| **Entwicklungsumgebungs-Initialisierungsskripte** | ✅ Ja | Ein-Klick-Konfiguration für neue Entwickler nach Code-Pull |
| **Produktionsumgebungsbereitstellung** | ✅ Ja | Automatische Synchronisation der neuesten Skills bei Bereitstellung |

::: tip Empfohlene Vorgehensweise

- **Interaktiv für lokale Entwicklung**: Manuelle Vorgänge ermöglichen sorgfältige Auswahl zu installierender Skills
- **Nicht-interaktiv für CI/CD**: In automatisierten Workflows muss das `-y` Flag verwendet werden, um alle Eingabeaufforderungen zu überspringen
- **Umgebungstrennungsstrategie**: Verwenden Sie verschiedene Skill-Quellen für verschiedene Umgebungen (z. B. private Repositorys)

:::

---

## Kernkonzept: Nicht-interaktiver Modus

Die Befehle `install` und `sync` von OpenSkills unterstützen das Flag `--yes/-y`, um alle interaktiven Eingabeaufforderungen zu überspringen:

**Nicht-interaktives Verhalten des install-Befehls** (Quellcode `install.ts:424-427`):

```typescript
// Interactive selection (unless -y flag or single skill)
let skillsToInstall = skillInfos;

if (!options.yes && skillInfos.length > 1) {
  // 进入交互式选择流程
  // ...
}
```

**Eigenschaften des nicht-interaktiven Modus**:

1. **Überspringen der Skill-Auswahl**: Installation aller gefundenen Skills
2. **Automatisches Überschreiben**: Bei bereits vorhandenen Skills wird direkt überschrieben (Zeigt `Overwriting: <skill-name>`)
3. **Überspringen von Konfliktbestätigungen**: Keine Rückfrage zum Überschreiben, direkte Ausführung
4. **Headless-Umgebungskompatibilität**: Funktioniert in CI-Umgebungen ohne TTY normal

**Verhalten der warnIfConflict-Funktion** (Quellcode `install.ts:524-527`):

```typescript
if (skipPrompt) {
  // Auto-overwrite in non-interactive mode
  console.log(chalk.dim(`Overwriting: ${skillName}`));
  return true;
}
```

::: important Wichtiges Konzept

**Nicht-interaktiver Modus**: Verwenden Sie das Flag `--yes/-y`, um alle interaktiven Eingabeaufforderungen zu überspringen. Dadurch können Befehle in CI/CD, Skripten und Umgebungen ohne TTY automatisch ausgeführt werden, ohne auf Benutzereingaben angewiesen zu sein.

:::

---

## Praxis

### Schritt 1: Nicht-interaktive Installation erleben

**Warum**
Erleben Sie zuerst das Verhalten des nicht-interaktiven Modus lokal und verstehen Sie den Unterschied zum interaktiven Modus.

Öffnen Sie Ihr Terminal und führen Sie aus:

```bash
# Nicht-interaktive Installation (Installation aller gefundenen Skills)
npx openskills install anthropics/skills --yes

# oder Kurzschrift
npx openskills install anthropics/skills -y
```

**Sie sollten sehen**:

```
Cloning into '/tmp/openskills-temp-...'...
...
Found 3 skill(s)

Overwriting: codebase-reviewer
Overwriting: file-writer
Overwriting: git-helper

✅ Installed 3 skill(s)

Next: Run 'openskills sync' to generate AGENTS.md
```

**Erklärung**:
- Nach Verwendung des `-y` Flags wird das Skill-Auswahlmenü übersprungen
- Alle gefundenen Skills werden automatisch installiert
- Wenn ein Skill bereits vorhanden ist, wird `Overwriting: <skill-name>` angezeigt und direkt überschrieben
- Es werden keine Bestätigungsdialoge angezeigt

---

### Schritt 2: Interaktiven vs. nicht-interaktiven Modus vergleichen

**Warum**
Durch den Vergleich verstehen Sie klarer die Unterschiede und Anwendungsszenarien der beiden Modi.

Führen Sie die folgenden Befehle aus, um die beiden Modi zu vergleichen:

```bash
# Vorhandene Skills löschen (zum Testen)
rm -rf .claude/skills

# Interaktive Installation (zeigt Auswahlmenü)
echo "=== Interaktive Installation ==="
npx openskills install anthropics/skills

# Vorhandene Skills löschen
rm -rf .claude/skills

# Nicht-interaktive Installation (automatische Installation aller Skills)
echo "=== Nicht-interaktive Installation ==="
npx openskills install anthropics/skills -y
```

**Sie sollten sehen**:

**Interaktiver Modus**:
- Zeigt eine Skill-Liste und ermöglicht Auswahl mit Leertaste
- Erfordert Bestätigung mit Enter
- Ermöglicht selektive Installation eines Teils der Skills

**Nicht-interaktiver Modus**:
- Zeigt den Installationsprozess direkt an
- Installiert alle Skills automatisch
- Erfordert keine Benutzereingabe

**Vergleichstabelle**:

| Eigenschaft | Interaktiver Modus (Standard) | Nicht-interaktiver Modus (-y) |
|--- | --- | ---|
| **Skill-Auswahl** | Zeigt Auswahlmenü, manuelle Auswahl | Automatische Installation aller gefundenen Skills |
| **Überschreibungsbestätigung** | Rückfrage, ob bereits vorhandene Skills überschrieben werden sollen | Automatisches Überschreiben mit Meldung |
| **TTY-Anforderung** | Erfordert interaktives Terminal | Nicht erforderlich, kann in CI-Umgebung ausgeführt werden |
| **Anwendungsszenarien** | Lokale Entwicklung, manuelle Vorgänge | CI/CD, Skripte, automatisierte Workflows |
| **Eingabeanforderung** | Erfordert Benutzereingabe | Keine Eingabe, automatische Ausführung |

---

### Schritt 3: Nicht-interaktive Synchronisation von AGENTS.md

**Warum**
Lernen Sie, AGENTS.md in automatisierten Workflows zu generieren, damit KI-Agents immer die neueste Skill-Liste verwenden.

Führen Sie aus:

```bash
# Nicht-interaktive Synchronisation (Synchronisation aller Skills zu AGENTS.md)
npx openskills sync -y

# Anzeigen der generierten AGENTS.md
cat AGENTS.md | head -20
```

**Sie sollten sehen**:

```
✅ Synced 3 skill(s) to AGENTS.md
```

AGENTS.md-Inhalt:

```xml
<skills_system>
This project uses the OpenSkills system for AI agent extensibility.

Usage:
- Ask the AI agent to load specific skills using: "Use the <skill-name> skill"
- The agent will read the skill definition from .claude/skills/<skill-name>/SKILL.md
- Skills provide specialized capabilities like code review, file writing, etc.
</skills_system>

<available_skills>
  <skill name="codebase-reviewer">
    <description>Review code changes for issues...</description>
  </skill>
  <skill name="file-writer">
    <description>Write files with format...</description>
  </skill>
  <skill name="git-helper">
    <description>Git operations and utilities...</description>
  </skill>
</available_skills>
```

**Erklärung**:
- Das `-y` Flag überspringt das Skill-Auswahlmenü
- Alle installierten Skills werden zu AGENTS.md synchronisiert
- Es werden keine Bestätigungsdialoge angezeigt

---

### Schritt 4: GitHub Actions-Integration

**Warum**
Integration von OpenSkills in tatsächliche CI/CD-Workflows zur automatisierten Skill-Verwaltung.

Erstellen Sie die Datei `.github/workflows/setup-skills.yml` in Ihrem Projekt:

```yaml
name: Setup Skills

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills (non-interactive)
        run: openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: openskills sync -y

      - name: Verify AGENTS.md
        run: |
          echo "=== AGENTS.md generated ==="
          cat AGENTS.md

      - name: Upload AGENTS.md as artifact
        uses: actions/upload-artifact@v4
        with:
          name: agents-md
          path: AGENTS.md
```

Commiten und pushen Sie zu GitHub:

```bash
git add .github/workflows/setup-skills.yml
git commit -m "Add GitHub Actions workflow for OpenSkills"
git push
```

**Sie sollten sehen**: GitHub Actions läuft automatisch und installiert erfolgreich Skills und generiert AGENTS.md.

**Erklärung**:
- Automatisch bei jedem Push oder PR ausgelöst
- Verwenden Sie `openskills install anthropics/skills -y` für nicht-interaktive Skill-Installation
- Verwenden Sie `openskills sync -y` für nicht-interaktive Synchronisation von AGENTS.md
- Speichern Sie AGENTS.md als Artefakt zur einfachen Fehlersuche

---

### Schritt 5: Verwendung privater Repositorys

**Warum**
In Unternehmensumgebungen sind Skills meist in privaten Repositorys gehostet und benötigen SSH-Zugriff in CI/CD.

Konfigurieren Sie SSH in GitHub Actions:

```yaml
name: Setup Skills from Private Repo

on:
  push:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH key
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills from private repo
        run: openskills install git@github.com:your-org/private-skills.git -y

      - name: Sync to AGENTS.md
        run: openskills sync -y
```

Fügen Sie `SSH_PRIVATE_KEY` in **Settings → Secrets and variables → Actions** Ihres GitHub-Repositorys hinzu.

**Sie sollten sehen**: GitHub Actions installiert erfolgreich Skills aus dem privaten Repository.

**Erklärung**:
- Verwenden Sie Secrets zum Speichern privater Schlüssel, um Lecks zu vermeiden
- Konfigurieren Sie SSH-Zugriff für private Repositorys
- `openskills install git@github.com:your-org/private-skills.git -y` unterstützt die Installation aus privaten Repositorys

---

### Schritt 6: Docker-Szenario-Integration

**Warum**
Automatische Installation von Skills während Docker-Image-Builds, damit diese sofort nach Container-Start verfügbar sind.

Erstellen Sie eine `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install OpenSkills
RUN npm install -g openskills

# Install skills (nicht-interaktiv)
RUN openskills install anthropics/skills -y

# AGENTS.md synchronisieren
RUN openskills sync -y

# Anwendungscode kopieren
COPY . .

# Andere Build-Schritte...
RUN npm install
RUN npm run build

# Startbefehl
CMD ["node", "dist/index.js"]
```

Bauen und ausführen:

```bash
# Docker-Image bauen
docker build -t myapp:latest .

# Container ausführen
docker run -it --rm myapp:latest sh

# Verifizieren Sie installierte Skills im Container
ls -la .claude/skills/
cat AGENTS.md
```

**Sie sollten sehen**: Skills sind bereits im Container installiert und AGENTS.md wurde generiert.

**Erklärung**:
- Installation von Skills während Docker-Image-Build-Phase
- Verwenden Sie `RUN openskills install ... -y` für nicht-interaktive Installation
- Keine manuelle Skill-Installation nach Container-Start erforderlich
- Geeignet für Microservices, Serverless und andere Szenarien

---

### Schritt 7: Umgebungsvariablenkonfiguration

**Warum**
Flexible Konfiguration von Skill-Quellen über Umgebungsvariablen, verschiedene Umgebungen verwenden verschiedene Skill-Repositorys.

Erstellen Sie eine `.env.ci`-Datei:

```bash
# CI/CD-Umgebungskonfiguration
SKILLS_SOURCE=anthropics/skills
SKILLS_INSTALL_FLAGS=-y
SYNC_FLAGS=-y
```

Verwenden Sie in CI/CD-Skripten:

```bash
#!/bin/bash
# .github/scripts/setup-skills.sh

set -e

# Umgebungsvariablen laden
if [ -f .env.ci ]; then
  export $(cat .env.ci | grep -v '^#' | xargs)
fi

echo "Installing skills from: $SKILLS_SOURCE"
npx openskills install $SKILLS_SOURCE $SKILLS_INSTALL_FLAGS

echo "Syncing to AGENTS.md"
npx openskills sync $SYNC_FLAGS

echo "✅ Skills setup completed"
```

Aufruf in GitHub Actions:

```yaml
- name: Setup skills
  run: .github/scripts/setup-skills.sh
```

**Sie sollten sehen**: Das Skript konfiguriert automatisch Skill-Quellen und Flags basierend auf Umgebungsvariablen.

**Erklärung**:
- Flexible Konfiguration von Skill-Quellen über Umgebungsvariablen
- Verschiedene Umgebungen (Entwicklung, Test, Produktion) können verschiedene `.env`-Dateien verwenden
- Wartbarkeit der CI/CD-Konfiguration beibehalten

---

## Kontrollpunkte ✅

Führen Sie die folgenden Prüfungen durch, um sicherzustellen, dass Sie den Inhalt dieser Lektion beherrschen:

- [ ] Verständnis von Zweck und Eigenschaften des nicht-interaktiven Modus
- [ ] Fähigkeit zur nicht-interaktiven Installation mit dem `-y` Flag
- [ ] Fähigkeit zur nicht-interaktiven Synchronisation mit dem `-y` Flag
- [ ] Verständnis der Unterschiede zwischen interaktivem und nicht-interaktivem Modus
- [ ] Fähigkeit zur Integration von OpenSkills in GitHub Actions
- [ ] Fähigkeit zur Installation von Skills während Docker-Image-Builds
- [ ] Wissen über den Umgang mit privaten Repositorys in CI/CD
- [ ] Verständnis der Best Practices für Umgebungsvariablenkonfiguration

---

## Häufige Fehler

### Häufiger Fehler 1: Vergessen des `-y` Flags

**Fehlerszenario**: Vergessen des `-y` Flags in GitHub Actions

```yaml
# ❌ Fehler: -y Flag vergessen
- name: Install skills
  run: openskills install anthropics/skills
```

**Problem**:
- CI-Umgebung hat kein interaktives Terminal (TTY)
- Der Befehl wartet auf Benutzereingabe, führt zum Timeout des Workflows
- Fehlermeldung möglicherweise nicht offensichtlich

**Richtige Vorgehensweise**:

```yaml
# ✅ Richtig: Verwenden des -y Flags
- name: Install skills
  run: openskills install anthropics/skills -y
```

---

### Häufiger Fehler 2: Verlust der Konfiguration durch Skill-Überschreibung

**Fehlerszenario**: CI/CD überschreibt bei jedem Lauf Skills, was zum Verlust lokaler Konfigurationen führt

```bash
# Installation von Skills in globales Verzeichnis in CI/CD
openskills install anthropics/skills --global -y

# Lokaler Benutzer installiert in Projektverzeichnis, wird durch global überschrieben
```

**Problem**:
- Global installierte Skills haben niedrigere Priorität als lokale Projekt-Skills
- Inkonsistente Installationsorte zwischen CI/CD und lokal führen zu Verwirrung
- Kann sorgfältig konfigurierte lokale Benutzer-Skills überschreiben

**Richtige Vorgehensweise**:

```bash
# Option 1: CI/CD und lokal verwenden beide Projekt-Installation
openskills install anthropics/skills -y

# Option 2: Universal-Modus verwenden, um Konflikte zu vermeiden
openskills install anthropics/skills --universal -y

# Option 3: CI/CD verwendet dediziertes Verzeichnis (über benutzerdefinierten Ausgabepfad)
openskills install anthropics/skills -y
openskills sync -o .agents-md/AGENTS.md -y
```

---

### Häufiger Fehler 3: Unzureichende Git-Zugriffsrechte

**Fehlerszenario**: Installation von Skills aus privaten Repositorys ohne Konfiguration von SSH-Schlüsseln

```yaml
# ❌ Fehler: SSH-Schlüssel nicht konfiguriert
- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

**Problem**:
- CI-Umgebung kann nicht auf privates Repository zugreifen
- Fehlermeldung: `Permission denied (publickey)`
- Klonen schlägt fehl, Workflow schlägt fehl

**Richtige Vorgehensweise**:

```yaml
# ✅ Richtig: SSH-Schlüssel konfigurieren
- name: Setup SSH key
  env:
    SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts

- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

---

### Häufiger Fehler 4: Zu große Docker-Images

**Fehlerszenario**: Installation von Skills im Dockerfile führt zu übermäßigem Image-Volumen

```dockerfile
# ❌ Fehler: Jedes Mal neu klonen und installieren
RUN openskills install anthropics/skills -y
```

**Problem**:
- Bei jedem Build wird Repository von GitHub geklont
- Erhöht Build-Zeit und Image-Volumen
- Netzwerkprobleme können zu Fehlern führen

**Richtige Vorgehensweise**:

```dockerfile
# ✅ Richtig: Multi-Stage-Build und Caching verwenden
FROM node:20-alpine AS skills-builder

RUN npm install -g openskills
RUN openskills install anthropics/skills -y
RUN openskills sync -y

# Haupt-Image
FROM node:20-alpine

WORKDIR /app

# Installierte Skills kopieren
COPY --from=skills-builder ~/.claude /root/.claude
COPY --from=skills-builder /app/AGENTS.md /app/

# Anwendungscode kopieren
COPY . .

# Andere Build-Schritte...
```

---

### Häufiger Fehler 5: Vergessen der Skill-Aktualisierung

**Fehlerszenario**: CI/CD installiert bei jedem Lauf alte Skill-Versionen

```yaml
# ❌ Fehler: Nur Installation, keine Aktualisierung
- name: Install skills
  run: openskills install anthropics/skills -y
```

**Problem**:
- Skill-Repository möglicherweise bereits aktualisiert
- Von CI/CD installierte Skill-Version nicht aktuell
- Kann zu fehlenden Funktionen oder Bugs führen

**Richtige Vorgehensweise**:

```yaml
# ✅ Richtig: Zuerst aktualisieren, dann synchronisieren
- name: Update skills
  run: openskills update -y

- name: Sync to AGENTS.md
  run: openskills sync -y

# oder Aktualisierungsstrategie bei Installation verwenden
- name: Install or update skills
  run: |
    openskills install anthropics/skills -y || openskills update -y
```

---

## Zusammenfassung

**Kernpunkte**:

1. **Nicht-interaktiver Modus für CI/CD**: Verwenden Sie das `-y` Flag, um alle interaktiven Eingabeaufforderungen zu überspringen
2. **Das `-y` Flag des install-Befehls**: Automatische Installation aller gefundenen Skills, Überschreiben vorhandener Skills
3. **Das `-y` Flag des sync-Befehls**: Automatische Synchronisation aller Skills zu AGENTS.md
4. **GitHub Actions-Integration**: Verwenden Sie nicht-interaktive Befehle im Workflow zur automatisierten Skill-Verwaltung
5. **Docker-Szenario**: Installieren Sie Skills während Image-Build-Phase, stellen Sie sofortige Verfügbarkeit nach Container-Start sicher
6. **Privates Repository-Zugriff**: Konfigurieren Sie Zugriff auf private Skill-Repositorys über SSH-Schlüssel
7. **Umgebungsvariablenkonfiguration**: Flexible Konfiguration von Skill-Quellen und Installationsparametern über Umgebungsvariablen

**Entscheidungsprozess**:

```
[OpenSkills in CI/CD verwenden] → [Skills installieren]
                                    ↓
                            [Verwenden Sie -y Flag zum Überspringen von Interaktionen]
                                    ↓
                            [AGENTS.md generieren]
                                    ↓
                            [Verwenden Sie -y Flag zum Überspringen von Interaktionen]
                                    ↓
                            [Verifizieren, dass Skills korrekt installiert sind]
```

**Merkhilfen**:

- **Bei CI/CD -y nicht vergessen**: Nicht-interaktiv ist der Schlüssel
- **GitHub Actions mit SSH**: Private Repositorys benötigen Schlüsselkonfiguration
- **Docker-Build frühzeitig installieren**: Auf Image-Volumen achten
- **Umgebungsvariablen konfigurieren**: Verschiedene Umgebungen unterscheiden

---

## Vorschau auf nächste Lektion

> In der nächsten Lektion lernen wir **[Sicherheitshinweise](../security/)**.
>
> Sie werden lernen:
> - Sicherheitsmerkmale und Schutzmechanismen von OpenSkills
> - Funktionsweise des Pfadtraversal-Schutzes
> - Sichere Verarbeitung von symbolischen Links
> - Sicherheitsmaßnahmen für YAML-Parsing
> - Best Practices für Berechtigungsverwaltung

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen von Quellcodepositionen</strong></summary>

> Aktualisierungsdatum: 2026-01-24

| Funktion              | Dateipfad                                                                                                    | Zeilen  |
|--- | --- | ---|
| Nicht-interaktive Installation      | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L424-L455) | 424-455 |
| Konflikterkennung und Überschreibung    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L521-L550) | 521-550 |
| Nicht-interaktive Synchronisation      | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93)   | 46-93   |
| Kommandozeilenparameter-Definition    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L49)                          | 49      |
| Kommandozeilenparameter-Definition    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L65)                          | 65      |

**Wichtige Konstanten**:
- `-y, --yes`: Kommandozeilenflag zum Überspringen interaktiver Auswahl

**Wichtige Funktionen**:
- `warnIfConflict(skillName, targetPath, isProject, skipPrompt)`: Erkennen von Skill-Konflikten und Entscheidung über Überschreibung
- `installFromRepo()`: Installation von Skills aus Repository (unterstützt nicht-interaktiven Modus)
- `syncAgentsMd()`: Synchronisation von Skills zu AGENTS.md (unterstützt nicht-interaktiven Modus)

**Geschäftsregeln**:
- Bei Verwendung des `-y` Flags werden alle interaktiven Eingabeaufforderungen übersprungen
- Wenn ein Skill bereits vorhanden ist, überschreibt der nicht-interaktive Modus automatisch (zeigt `Overwriting: <skill-name>`)
- Nicht-interaktiver Modus funktioniert in headless-Umgebungen (ohne TTY)
- Die Befehle `install` und `sync` unterstützen beide das `-y` Flag

</details>
