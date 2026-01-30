---
title: "Symlinks: Git Auto-Update | OpenSkills"
subtitle: "Symlinks: Git Auto-Update"
sidebarTitle: "Git Auto-Update Skills"
description: "Erfahren Sie, wie Sie die Symlink-Funktion von OpenSkills nutzen, um git-basierte automatische Skill-Updates und lokale Entwicklungs-Workflows zu implementieren, was die Effizienz erheblich verbessert."
tags:
  - "advanced"
  - "symlinks"
  - "local-development"
  - "skills-management"
prerequisite:
  - "platforms-install-sources"
  - "start-first-skill"
order: 3
---

# Symlink-Unterstützung

## Was Sie lernen werden

- Den Kernwert und die Anwendungsfälle von symbolischen Links verstehen
- Den Befehl `ln -s` zum Erstellen symbolischer Links beherrschen
- Verstehen, wie OpenSkills symbolische Links automatisch verarbeitet
- Git-basierte automatische Skill-Updates implementieren
- Lokale Skill-Entwicklung effizient durchführen
- Beschädigte symbolische Links behandeln

::: info Voraussetzungen

Dieses Tutorial setzt voraus, dass Sie [Installationsquellen im Detail](../../platforms/install-sources/) und [Den ersten Skill installieren](../../start/first-skill/) bereits verstehen und den grundlegenden Skill-Installationsprozess kennen.

:::

---

## Ihre aktuelle Situation

Sie haben wahrscheinlich bereits gelernt, wie Sie Skills installieren und aktualisieren, stoßen aber bei der Verwendung von **symbolischen Links** auf folgende Probleme:

- **Lokale Entwicklungs-Updates sind mühsam**: Nachdem Sie einen Skill geändert haben, müssen Sie ihn neu installieren oder Dateien manuell kopieren
- **Skills für mehrere Projekte zu teilen ist schwierig**: Wenn derselbe Skill in mehreren Projekten verwendet wird, muss bei jedem Update synchronisiert werden
- **Versionsmanagement ist chaotisch**: Skill-Dateien sind auf verschiedene Projekte verteilt und lassen sich nur schwer einheitlich mit git verwalten
- **Update-Prozess ist umständlich**: Um Skills aus einem git-Repository zu aktualisieren, muss das gesamte Repository neu installiert werden

Tatsächlich unterstützt OpenSkills symbolische Links, sodass Sie git-basierte automatische Skill-Updates und einen effizienten lokalen Entwicklungs-Workflow über Symlinks implementieren können.

---

## Wann Sie diese Methode verwenden sollten

**Anwendungsfälle für symbolische Links**:

| Szenario | Symlink erforderlich? | Beispiel |
|--- | --- | ---|
| **Lokale Skill-Entwicklung** | ✅ Ja | Entwicklung benutzerdefinierter Skills mit häufigen Änderungen und Tests |
| **Skills in mehreren Projekten teilen** | ✅ Ja | Team-Shared Skill-Repository, das von mehreren Projekten gleichzeitig verwendet wird |
| **Git-basierte automatische Updates** | ✅ Ja | Nach dem Update des Skill-Repository erhalten alle Projekte automatisch die neueste Version |
| **Einmal installieren, dauerhaft nutzen** | ❌ Nein | Nur installieren ohne Änderungen, einfach `install` verwenden |
| **Third-Party-Skills testen** | ❌ Nein | Vorübergehende Skill-Tests, kein Symlink erforderlich |

::: tip Empfohlene Vorgehensweise

- **Für die lokale Entwicklung Symlinks verwenden**: Verwenden Sie beim Entwickeln eigener Skills Symlinks, um wiederholtes Kopieren zu vermeiden
- **Für die Team-Freigabe Git + Symlink**: Team-Skill-Repositorys werden in Git gespeichert, Projekte teilen sie über Symlinks
- **Für die Produktionsumgebung normale Installation**: Verwenden Sie für stabile Deployments die normale `install`-Installation, um Abhängigkeiten von externen Verzeichnissen zu vermeiden

:::

---

## Kernkonzept: Verknüpfen statt Kopieren

**Traditionelle Installationsmethode**:

```
┌─────────────────┐
│  Git Repository │
│  ~/dev/skills/ │
│  └── my-skill/ │
└────────┬────────┘
         │ Kopieren
         ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/ │
│     └── Vollständige Kopie │
└─────────────────┘
```

**Problem**: Nach dem Update des Git-Repository werden die Skills in `.claude/skills/` nicht automatisch aktualisiert.

**Symlink-Methode**:

```
┌─────────────────┐
│  Git Repository │
│  ~/dev/skills/ │
│  └── my-skill/ │ ← Echte Dateien befinden sich hier
└────────┬────────┘
         │ Symbolischer Link (ln -s)
         ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/ │ → Zeigt auf ~/dev/skills/my-skill
└─────────────────┘
```

**Vorteil**: Nach dem Update des Git-Repository werden die Inhalte, auf die der Symlink zeigt, automatisch aktualisiert, ohne dass eine Neuinstallation erforderlich ist.

::: info Wichtiges Konzept

**Symbolischer Link (Symlink)**: Ein spezieller Dateityp, der auf eine andere Datei oder ein anderes Verzeichnis verweist. OpenSkills erkennt beim Suchen von Skills automatisch symbolische Links und folgt ihnen zu den tatsächlichen Inhalten. Beschädigte symbolische Links (die auf ein nicht vorhandenes Ziel verweisen) werden automatisch übersprungen und verursachen keine Abstürze.

:::

**Quellcode-Implementierung** (`src/utils/skills.ts:10-25`):

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync folgt Symlinks
      return stats.isDirectory();
    } catch {
      // Beschädigter Symlink oder Berechtigungsfehler
      return false;
    }
  }
  return false;
}
```

**Schlüsselfunktionen**:
- `entry.isSymbolicLink()` erkennt symbolische Links
- `statSync()` folgt automatisch symbolischen Links zum Ziel
- `try/catch` fängt beschädigte symbolische Links ab und gibt `false` zurück, um sie zu überspringen

---

## Schritt für Schritt

### Schritt 1: Skill-Repository erstellen

**Warum**
Erstellen Sie zunächst ein git-Repository für die Speicherung von Skills, um ein Team-Sharing-Szenario zu simulieren.

Öffnen Sie das Terminal und führen Sie Folgendes aus:

```bash
# Verzeichnis für Skill-Repository erstellen
mkdir -p ~/dev/my-skills
cd ~/dev/my-skills

# git-Repository initialisieren
git init

# Beispiel-Skill erstellen
mkdir -p my-first-skill
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: A sample skill for demonstrating symlink support
---

# My First Skill

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
EOF

# In git committen
git add .
git commit -m "Initial commit: Add my-first-skill"
```

**Sie sollten sehen**: Ein git-Repository wurde erfolgreich erstellt und der Skill committet.

**Erklärung**:
- Skills werden im Verzeichnis `~/dev/my-skills/` gespeichert
- Git-Versionskontrolle wird für die Team-Zusammenarbeit verwendet
- Dieses Verzeichnis ist der "echte Speicherort" der Skills

---

### Schritt 2: Symbolischen Link erstellen

**Warum**
Lernen Sie, wie Sie den Befehl `ln -s` zum Erstellen symbolischer Links verwenden.

Fahren Sie im Projektverzeichnis fort:

```bash
# In das Projekt-Root-Verzeichnis zurückkehren
cd ~/my-project

# Skill-Verzeichnis erstellen
mkdir -p .claude/skills

# Symbolischen Link erstellen
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Symbolischen Link anzeigen
ls -la .claude/skills/
```

**Sie sollten sehen**:

```
.claude/skills/
└── my-first-skill -> /Users/yourname/dev/my-skills/my-first-skill
```

**Erklärung**:
- `ln -s` erstellt einen symbolischen Link
- Nach `->` wird der tatsächliche Pfad angezeigt, auf den verlinkt wird
- Der symbolische Link selbst ist nur ein "Zeiger" und belegt keinen echten Platz

---

### Schritt 3: Überprüfen, ob der symbolische Link funktioniert

**Warum**
Bestätigen Sie, dass OpenSkills symbolische Links korrekt erkennen und lesen kann.

Führen Sie Folgendes aus:

```bash
# Skills auflisten
npx openskills list

# Skill-Inhalte lesen
npx openskills read my-first-skill
```

**Sie sollten sehen**:

```
  my-first-skill           (project)
    A sample skill for demonstrating symlink support

Summary: 1 project, 0 global (1 total)
```

Skill-Lese-Ausgabe:

```markdown
---
name: my-first-skill
description: A sample skill for demonstrating symlink support
---

# My First Skill

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
```

**Erklärung**:
- OpenSkills erkennt symbolische Links automatisch
- Symlink-Skills werden mit dem Tag `(project)` angezeigt
- Der gelesene Inhalt stammt aus den ursprünglichen Dateien, auf die der Symlink verweist

---

### Schritt 4: Git-basierte automatische Updates

**Warum**
Erleben Sie den größten Vorteil von symbolischen Links: Nach dem Update des git-Repository werden Skills automatisch synchronisiert.

Ändern Sie den Skill im Skill-Repository:

```bash
# In das Skill-Repository wechseln
cd ~/dev/my-skills

# Skill-Inhalt ändern
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: Updated version with new features
---

# My First Skill (Updated)

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
3. NEW: This feature was updated via git!
EOF

# Update committen
git add .
git commit -m "Update skill: Add new feature"
```

Überprüfen Sie nun im Projektverzeichnis das Update:

```bash
# In das Projektverzeichnis zurückkehren
cd ~/my-project

# Skill lesen (keine Neuinstallation erforderlich)
npx openskills read my-first-skill
```

**Sie sollten sehen**: Der Skill-Inhalt wurde automatisch aktualisiert und enthält die neuen Funktionsbeschreibungen.

**Erklärung**:
- Nachdem die Dateien, auf die der Symlink verweist, aktualisiert wurden, liest OpenSkills automatisch die neuesten Inhalte
- Keine erneute Ausführung von `openskills install` erforderlich
- Realisiert "einmal aktualisieren, überall wirksam"

---

### Schritt 5: Skills in mehreren Projekten teilen

**Warum**
Erleben Sie den Vorteil von symbolischen Links im Szenario mehrerer Projekte, um doppelte Skill-Installationen zu vermeiden.

Erstellen Sie ein zweites Projekt:

```bash
# Zweites Projekt erstellen
mkdir ~/my-second-project
cd ~/my-second-project

# Skill-Verzeichnis und symbolischen Link erstellen
mkdir -p .claude/skills
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Überprüfen, ob der Skill verfügbar ist
npx openskills list
```

**Sie sollten sehen**:

```
  my-first-skill           (project)
    Updated version with new features

Summary: 1 project, 0 global (1 total)
```

**Erklärung**:
- Mehrere Projekte können symbolische Links auf denselben Skill erstellen
- Nach dem Update des Skill-Repository erhalten alle Projekte automatisch die neueste Version
- Vermeidet doppelte Skill-Installationen und -Updates

---

### Schritt 6: Beschädigte symbolische Links behandeln

**Warum**
Verstehen Sie, wie OpenSkills beschädigte symbolische Links elegant behandelt.

Simulieren Sie einen beschädigten symbolischen Link:

```bash
# Skill-Repository löschen
rm -rf ~/dev/my-skills

# Versuchen, Skills aufzulisten
npx openskills list
```

**Sie sollten sehen**: Beschädigte symbolische Links werden automatisch übersprungen und verursachen keinen Fehler.

```
Summary: 0 project, 0 global (0 total)
```

**Erklärung**:
- Das `try/catch` im Quellcode fängt beschädigte symbolische Links ab
- OpenSkills überspringt beschädigte Links und sucht weiter nach anderen Skills
- Verursacht keinen Absturz des `openskills`-Befehls

---

## Checkpunkt ✅

Führen Sie die folgenden Überprüfungen durch, um zu bestätigen, dass Sie den Inhalt dieser Lektion beherrschen:

- [ ] Den Kernwert von symbolischen Links verstehen
- [ ] Die Verwendung des Befehls `ln -s` beherrschen
- [ ] Den Unterschied zwischen symbolischen Links und kopierten Dateien verstehen
- [ ] Ein git-basiertes Skill-Repository erstellen können
- [ ] Automatische Skill-Updates implementieren können
- [ ] Wissen, wie man Skills in mehreren Projekten teilt
- [ ] Den Behandlungsmechanismus für beschädigte symbolische Links verstehen

---

## Fallstricke

### Häufiger Fehler 1: Falscher Symlink-Pfad

**Fehlerszenario**: Verwenden Sie relative Pfade zum Erstellen symbolischer Links, die nach dem Verschieben des Projekts ungültig werden.

```bash
# ❌ Fehler: Relativer Pfad verwendet
cd ~/my-project
ln -s ../dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Symlink nach dem Verschieben des Projekts ungültig
mv ~/my-project ~/new-location/project
npx openskills list  # ❌ Skill nicht gefunden
```

**Problem**:
- Relative Pfade hängen vom aktuellen Arbeitsverzeichnis ab
- Relative Pfade werden nach dem Verschieben des Projekts ungültig
- Der symbolische Link verweist auf einen falschen Ort

**Richtige Vorgehensweise**:

```bash
# ✅ Korrekt: Absoluter Pfad verwendet
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Nach dem Verschieben des Projekts immer noch gültig
mv ~/my-project ~/new-location/project
npx openskills list  # ✅ Skill immer noch auffindbar
```

---

### Häufiger Fehler 2: Verwechslung von Hard Links und symbolischen Links

**Fehlerszenario**: Verwenden Sie Hard Links statt symbolischer Links.

```bash
# ❌ Fehler: Hard Link verwendet (ohne -s Parameter)
ln ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Hard Links sind ein weiterer Einstieg in die Datei, kein Zeiger
# "Einmal aktualisieren, überall wirksam" kann nicht implementiert werden
```

**Problem**:
- Ein Hard Link ist ein weiterer Name für die Datei
- Wenn Sie einen Hard Link ändern, werden auch andere Hard Links aktualisiert
- Aber nach dem Löschen der Quelldatei existiert der Hard Link weiterhin, was zu Verwirrung führt
- Kann nicht über Dateisystemgrenzen hinweg verwendet werden

**Richtige Vorgehensweise**:

```bash
# ✅ Korrekt: Symbolischer Link verwendet (mit -s Parameter)
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Symbolischer Links sind Zeiger
# Nach dem Löschen der Quelldatei wird der symbolische Link ungültig (OpenSkills überspringt ihn)
```

---

### Häufiger Fehler 3: Symlink verweist auf falsche Position

**Fehlerszenario**: Der symbolische Link verweist auf das übergeordnete Verzeichnis des Skills, nicht auf das Skill-Verzeichnis selbst.

```bash
# ❌ Fehler: Verweist auf übergeordnetes Verzeichnis
ln -s ~/dev/my-skills .claude/skills/my-skills-link

# OpenSkills sucht unter .claude/skills/my-skills-link/ nach SKILL.md
# Aber SKILL.md befindet sich tatsächlich unter ~/dev/my-skills/my-first-skill/SKILL.md
```

**Problem**:
- OpenSkills sucht nach `<link>/SKILL.md`
- Aber der tatsächliche Skill befindet sich unter `<link>/my-first-skill/SKILL.md`
- Führt dazu, dass die Skill-Datei nicht gefunden wird

**Richtige Vorgehensweise**:

```bash
# ✅ Korrekt: Direkt auf das Skill-Verzeichnis verweisen
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# OpenSkills sucht nach .claude/skills/my-first-skill/SKILL.md
# Das Verzeichnis, auf das der symbolische Link verweist, enthält SKILL.md
```

---

### Häufiger Fehler 4: Vergessen, AGENTS.md zu synchronisieren

**Fehlerszenario**: Nach dem Erstellen eines symbolischen Links vergessen Sie, AGENTS.md zu synchronisieren.

```bash
# Symbolischen Link erstellen
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ❌ Fehler: Vergessen, AGENTS.md zu synchronisieren
# KI-Agenten wissen nicht, dass ein neuer Skill verfügbar ist
```

**Problem**:
- Der symbolische Link wurde erstellt, aber AGENTS.md wurde nicht aktualisiert
- KI-Agenten wissen nicht, dass ein neuer Skill verfügbar ist
- Der neue Skill kann nicht aufgerufen werden

**Richtige Vorgehensweise**:

```bash
# Symbolischen Link erstellen
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ✅ Korrekt: AGENTS.md synchronisieren
npx openskills sync

# Jetzt können KI-Agenten den neuen Skill sehen
```

---

## Lektionszusammenfassung

**Kernpunkte**:

1. **Symbolische Links sind Zeiger**: Verwenden Sie `ln -s`, um sie zu erstellen. Sie verweisen auf echte Dateien oder Verzeichnisse
2. **Automatisches Folgen von Links**: OpenSkills verwendet `statSync()`, um automatisch symbolischen Links zu folgen
3. **Beschädigte Links werden automatisch übersprungen**: `try/catch` fängt Ausnahmen ab und verhindert Abstürze
4. **Git-basierte automatische Updates**: Nach dem Update des git-Repository werden Skills automatisch synchronisiert
5. **Mehrere Projekte teilen**: Mehrere Projekte können symbolische Links auf denselben Skill erstellen

**Entscheidungsprozess**:

```
[Skill verwenden] → [Häufige Änderungen erforderlich?]
                         ↓ Ja
                 [Symlink verwenden (lokale Entwicklung)]
                         ↓ Nein
                 [Mehrere Projekte teilen?]
                         ↓ Ja
                 [Git + Symlink verwenden]
                         ↓ Nein
                 [Normale Installation verwenden]
```

**Merksatz**:

- **Für lokale Entwicklung Symlink verwenden**: Häufige Änderungen, wiederholtes Kopieren vermeiden
- **Für die Team-Freigabe Git + Link**: Einmal aktualisieren, überall wirksam
- **Absoluter Pfad für Stabilität**: Vermeiden, dass relative Pfade ungültig werden
- **Beschädigte Links werden übersprungen**: OpenSkills behandelt sie automatisch

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Benutzerdefinierte Skills erstellen](../create-skills/)**.
>
> Sie werden lernen:
> - Wie Sie von Grund auf einen eigenen Skill erstellen
> - Das SKILL.md-Format und YAML-Frontmatter verstehen
> - Wie Sie die Skill-Verzeichnisstruktur organisieren (references/, scripts/, assets/)
> - Wie Sie hochwertige Skill-Beschreibungen schreiben

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Position anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion            | Dateipfad                                                                                              | Zeilennummer |
|--- | --- | ---|
| Symlink-Erkennung    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)      | 10-25   |
| Skills suchen        | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L30-L64)      | 30-64   |
| Einzelnen Skill suchen    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84)      | 69-84   |

**Schlüsselfunktionen**:

- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`: Prüft, ob ein Verzeichniseintrag ein echtes Verzeichnis oder ein symbolischer Link auf ein Verzeichnis ist
  - Verwendet `entry.isSymbolicLink()` zum Erkennen symbolischer Links
  - Verwendet `statSync()`, um automatisch symbolischen Links zum Ziel zu folgen
  - `try/catch` fängt beschädigte symbolische Links ab und gibt `false` zurück

- `findAllSkills()`: Sucht alle installierten Skills
  - Durchläuft 4 Suchverzeichnisse
  - Ruft `isDirectoryOrSymlinkToDirectory` auf, um symbolische Links zu erkennen
  - Überspringt automatisch beschädigte symbolische Links

**Geschäftsregeln**:

- Symbolische Links werden automatisch als Skill-Verzeichnisse erkannt
- Beschädigte symbolische Links werden elegant übersprungen und verursachen keine Abstürze
- Die Suchpriorität von symbolischen Links und echten Verzeichnissen ist gleich

</details>
