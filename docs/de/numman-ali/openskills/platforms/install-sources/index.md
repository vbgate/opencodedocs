---
title: "Installationsquellen: Verschiedene Möglichkeiten zur Installation von Skills | openskills"
sidebarTitle: "Drei Quellen nach Wahl"
subtitle: "Erklärung der Installationsquellen"
description: "Lernen Sie die drei Installationsmöglichkeiten für OpenSkills-Skills kennen. Beherrschen Sie die Installation von Skills aus GitHub-Repositories, lokalen Pfaden und privaten Git-Repositories, einschließlich SSH/HTTPS-Authentifizierung und Unterpfad-Konfiguration."
tags:
  - "Plattform-Integration"
  - "Skill-Verwaltung"
  - "Installationskonfiguration"
prerequisite:
  - "../../start/first-skill/"
order: 2
---

# Erklärung der Installationsquellen

## Was Sie nach dieser Lektion können

- Skills auf drei Arten installieren: GitHub-Repository, lokaler Pfad, privates Git-Repository
- Die für Ihr Szenario am besten geeignete Installationsquelle auswählen
- Vor- und Nachteile sowie Überlegungen für verschiedene Quellen verstehen
- GitHub shorthand, relative Pfade, private Repository-URLs und andere Formate beherrschen

::: info Voraussetzungen

Dieses Tutorial setzt voraus, dass Sie bereits [Den ersten Skill installieren](../../start/first-skill/) abgeschlossen haben und den grundlegenden Installationsprozess kennen.

:::

---

## Ihr aktuelles Problem

Sie haben wahrscheinlich bereits gelernt, wie Sie Skills aus dem offiziellen Repository installieren, aber:

- **Kann man nur GitHub verwenden?**: Sie möchten GitLab-Repositories Ihres Unternehmens verwenden, wissen aber nicht, wie Sie es konfigurieren
- **Wie installiert man lokal entwickelte Skills?**: Sie entwickeln gerade Ihre eigenen Skills und möchten diese zuerst lokal testen
- **Einen bestimmten Skill direkt angeben**: Das Repository enthält viele Skills, und Sie möchten nicht jedes Mal über die interaktive Oberfläche auswählen
- **Wie greift man auf private Repositories zu?**: Das Skill-Repository Ihres Unternehmens ist privat, und Sie wissen nicht, wie Sie sich authentifizieren

Tatsächlich unterstützt OpenSkills verschiedene Installationsquellen. Schauen wir uns diese nacheinander an.

---

## Wann Sie diesen Ansatz verwenden

**Anwendungsszenarien für verschiedene Installationsquellen**:

| Installationsquelle | Anwendungsszenario | Beispiel |
|--- | --- | ---|
| **GitHub-Repository** | Verwendung von Skills aus der Open-Source-Community | `openskills install anthropics/skills` |
| **Lokaler Pfad** | Entwicklung und Test eigener Skills | `openskills install ./my-skill` |
| **Privates Git-Repository** | Verwendung interner Skills des Unternehmens | `openskills install git@github.com:my-org/private-skills.git` |

::: tip Empfohlene Vorgehensweise

- **Open-Source-Skills**: Installieren Sie vorzugsweise aus GitHub-Repositories, um Updates einfach durchzuführen
- **Entwicklungsphase**: Installieren Sie aus lokalen Pfaden, um Änderungen in Echtzeit zu testen
- **Team-Zusammenarbeit**: Verwenden Sie private Git-Repositories, um interne Skills zentral zu verwalten

:::

---

## Kernkonzept: Drei Quellen, derselbe Mechanismus

Obwohl die Installationsquellen unterschiedlich sind, ist der zugrunde liegende Mechanismus von OpenSkills derselbe:

```
[Quellentyp erkennen] → [Skill-Dateien abrufen] → [In .claude/skills/ kopieren]
```

**Quellenerkennungslogik** (Quellcode `install.ts:25-45`):

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**Erkennungspriorität**:
1. Zuerst prüfen, ob es sich um einen lokalen Pfad handelt (`isLocalPath`)
2. Dann prüfen, ob es sich um eine Git-URL handelt (`isGitUrl`)
3. Zuletzt als GitHub shorthand behandeln (`owner/repo`)

---

## Mitmachen

### Methode 1: Aus GitHub-Repository installieren

**Anwendungsszenario**: Installation von Skills aus der Open-Source-Community, wie dem offiziellen Anthropic-Repository oder Skill-Paketen von Drittanbietern.

#### Grundlegende Verwendung: Ganzen Repository installieren

```bash
npx openskills install owner/repo
```

**Beispiel**: Skills aus dem offiziellen Anthropic-Repository installieren

```bash
npx openskills install anthropics/skills
```

**Sie sollten sehen**:

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### Erweiterte Verwendung: Unterpfad angeben (einen bestimmten Skill direkt installieren)

Wenn das Repository viele Skills enthält, können Sie direkt den Unterpfad des zu installierenden Skills angeben und die interaktive Auswahl überspringen:

```bash
npx openskills install owner/repo/skill-name
```

**Beispiel**: PDF-Verarbeitungsskill direkt installieren

```bash
npx openskills install anthropics/skills/pdf
```

**Sie sollten sehen**:

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
   Location: /path/to/project/.claude/skills/pdf
```

::: tip Empfohlene Vorgehensweise

Wenn Sie nur einen Skill aus einem Repository benötigen, können Sie das Unterpfad-Format verwenden, um die interaktive Auswahl zu überspringen und schneller zu arbeiten.

:::

#### GitHub shorthand-Regeln (Quellcode `install.ts:131-143`)

| Format | Beispiel | Konvertierungsergebnis |
|--- | --- | ---|
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |
|--- | --- | ---|

---

### Methode 2: Aus lokalem Pfad installieren

**Anwendungsszenario**: Sie entwickeln gerade Ihre eigenen Skills und möchten diese lokal testen, bevor Sie sie auf GitHub veröffentlichen.

#### Absoluten Pfad verwenden

```bash
npx openskills install /absolute/path/to/skill
```

**Beispiel**: Skills aus dem Skill-Verzeichnis im Home-Verzeichnis installieren

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### Relativen Pfad verwenden

```bash
npx openskills install ./local-skills/my-skill
```

**Beispiel**: Aus dem Unterverzeichnis `local-skills/` im Projektverzeichnis installieren

```bash
npx openskills install ./local-skills/web-scraper
```

**Sie sollten sehen**:

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
   Location: /path/to/project/.claude/skills/web-scraper
```

::: warning Wichtige Hinweise

Die Installation über lokale Pfade kopiert die Skill-Dateien in `.claude/skills/`. Spätere Änderungen an den Quelldateien werden nicht automatisch synchronisiert. Für Updates müssen Sie erneut installieren.

:::

#### Lokales Verzeichnis mit mehreren Skills installieren

Wenn Ihre lokale Verzeichnisstruktur so aussieht:

```
local-skills/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

Sie können das gesamte Verzeichnis direkt installieren:

```bash
npx openskills install ./local-skills
```

Dadurch wird eine interaktive Auswahl-Oberfläche gestartet, über die Sie die zu installierenden Skills auswählen können.

#### Unterstützte Formate für lokale Pfade (Quellcode `install.ts:25-32`)

| Format | Beschreibung | Beispiel |
|--- | --- | ---|
| `/absolute/path` | Absoluter Pfad | `/home/user/skills/my-skill` |
| `./relative/path` | Relativer Pfad zum aktuellen Verzeichnis | `./local-skills/my-skill` |
| `../relative/path` | Relativer Pfad zum übergeordneten Verzeichnis | `../shared-skills/common` |
| `~/path` | Relativer Pfad zum Home-Verzeichnis | `~/dev/my-skills` |

::: tip Entwickler-Tipp

Mit der `~`-Abkürzung können Sie schnell auf Skills im Home-Verzeichnis verweisen, was sich gut für persönliche Entwicklungsumgebungen eignet.

:::

---

### Methode 3: Aus privatem Git-Repository installieren

**Anwendungsszenario**: Verwendung interner GitLab/Bitbucket-Repositories oder privater GitHub-Repositories Ihres Unternehmens.

#### SSH-Methode (empfohlen)

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**Beispiel**: Aus privatem GitHub-Repository installieren

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**Sie sollten sehen**:

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip Authentifizierungskonfiguration

Die SSH-Methode erfordert, dass Sie bereits SSH-Schlüssel konfiguriert haben. Wenn das Klonen fehlschlägt, überprüfen Sie bitte:

```bash
# SSH-Verbindung testen
ssh -T git@github.com

# Wenn die Meldung "Hi username! You've successfully authenticated..." angezeigt wird, ist die Konfiguration korrekt
```

:::

#### HTTPS-Methode (Anmeldeinformationen erforderlich)

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning HTTPS-Authentifizierung

Beim Klonen privater Repositories über HTTPS fordert Git zur Eingabe von Benutzername und Passwort (oder Personal Access Token) auf. Wenn Sie Zwei-Faktor-Authentifizierung verwenden, müssen Sie einen Personal Access Token statt des Kontopassworts verwenden.

:::

#### Andere Git-Hosting-Plattformen

**GitLab (SSH)**:

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab (HTTPS)**:

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket (SSH)**:

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket (HTTPS)**:

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip Empfohlene Vorgehensweise

Für interne Team-Skills wird empfohlen, private Git-Repositories zu verwenden. Dies hat folgende Vorteile:
- Alle Teammitglieder können aus derselben Quelle installieren
- Zum Aktualisieren von Skills仅需 `openskills update`
- Einfache Versionsverwaltung und Berechtigungssteuerung

:::

#### Git-URL-Erkennungsregeln (Quellcode `install.ts:37-45`)

| Präfix/Suffix | Beschreibung | Beispiel |
|--- | --- | ---|
| `git@` | SSH-Protokoll | `git@github.com:owner/repo.git` |
| `git://` | Git-Protokoll | `git://github.com:owner/repo.git` |
| `http://` | HTTP-Protokoll | `http://github.com/owner/repo.git` |
| `https://` | HTTPS-Protokoll | `https://github.com/owner/repo.git` |
| `.git`-Suffix | Git-Repository (beliebiges Protokoll) | `owner/repo.git` |

---

## Checkpoint ✅

Nach Abschluss dieser Lektion bestätigen Sie bitte:

- [ ] Sie wissen, wie Sie Skills aus GitHub-Repositories installieren (`owner/repo`-Format)
- [ ] Sie wissen, wie Sie einen bestimmten Skill aus einem Repository direkt installieren (`owner/repo/skill-name`)
- [ ] Sie wissen, wie Sie Skills aus lokalen Pfaden installieren (`./`, `~/` usw.)
- [ ] Sie wissen, wie Sie Skills aus privaten Git-Repositories installieren (SSH/HTTPS)
- [ ] Sie verstehen die Anwendungsszenarien für verschiedene Installationsquellen

---

## Warnhinweise zu Fallstricken

### Problem 1: Lokaler Pfad existiert nicht

**Phänomen**:

```
Error: Path does not exist: ./local-skills/my-skill
```

**Ursache**:
- Tippfehler im Pfad
- Falsche Berechnung des relativen Pfads

**Lösung**:
1. Prüfen Sie, ob der Pfad existiert: `ls ./local-skills/my-skill`
2. Verwenden Sie einen absoluten Pfad, um Verwirrung mit relativen Pfaden zu vermeiden

---

### Problem 2: Klonen privaten Repository fehlgeschlagen

**Phänomen**:

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**Ursache**:
- SSH-Schlüssel nicht konfiguriert
- Keine Zugriffsberechtigung für das Repository
- Falsche Repository-Adresse

**Lösung**:
1. SSH-Verbindung testen: `ssh -T git@github.com`
2. Bestätigen Sie, dass Sie Zugriff auf das Repository haben
3. Überprüfen Sie, ob die Repository-Adresse korrekt ist

::: tip Hinweis

Für private Repositories zeigt das Tool den folgenden Hinweis an (Quellcode `install.ts:167`):

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### Problem 3: SKILL.md im Unterpfad nicht gefunden

**Phänomen**:

```
Error: SKILL.md not found at skills/my-skill
```

**Ursache**:
- Unterpfad falsch
- Die Verzeichnisstruktur im Repository entspricht nicht Ihren Erwartungen

**Lösung**:
1. Installieren Sie zunächst das gesamte Repository ohne Unterpfad: `npx openskills install owner/repo`
2. Überprüfen Sie über die interaktive Oberfläche die verfügbaren Skills
3. Installieren Sie erneut mit dem korrekten Unterpfad

---

### Problem 4: GitHub shorthand-Erkennungsfehler

**Phänomen**:

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**Ursache**:
- Format entspricht keiner Regel
- Tippfehler (z. B. Leerzeichen in `owner / repo`)

**Lösung**:
- Prüfen Sie, ob das Format korrekt ist (keine Leerzeichen, korrekte Anzahl von Schrägstrichen)
- Verwenden Sie die vollständige Git-URL anstatt des shorthand

---

## Zusammenfassung der Lektion

In dieser Lektion haben Sie gelernt:

- **Drei Installationsquellen**: GitHub-Repository, lokaler Pfad, privates Git-Repository
- **GitHub shorthand**: Zwei Formate: `owner/repo` und `owner/repo/skill-name`
- **Lokale Pfadformate**: Absoluter Pfad, relativer Pfad, Home-Verzeichnis-Abkürzung
- **Installation privater Repositories**: SSH- und HTTPS-Methoden, Formatierung für verschiedene Plattformen
- **Quellenerkennungslogik**: Wie das Tool erkennt, welchen Installationsquellentyp Sie angeben

**Schnellreferenz für Kernbefehle**:

| Befehl | Funktion |
|--- | ---|
| `npx openskills install owner/repo` | Aus GitHub-Repository installieren (interaktive Auswahl) |
| `npx openskills install owner/repo/skill-name` | Einen bestimmten Skill aus dem Repository direkt installieren |
| `npx openskills install ./local-skills/skill` | Aus lokalem Pfad installieren |
| `npx openskills install ~/dev/my-skills` | Aus Home-Verzeichnis installieren |
| `npx openskills install git@github.com:owner/private-skills.git` | Aus privatem Git-Repository installieren |

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Globale Installation vs. projektlokale Installation](../global-vs-project/)**.
>
> Sie werden lernen:
> - Die Funktion des Flags `--global` und der Installationsort
> - Den Unterschied zwischen globaler Installation und projektlokaler Installation
> - Die Wahl des geeigneten Installationsorts je nach Szenario
> - Best Practices für die gemeinsame Nutzung von Skills über mehrere Projekte

Installationsquellen sind nur ein Teil der Skill-Verwaltung. Als Nächstes müssen wir verstehen, wie der Installationsort von Skills Auswirkungen auf das Projekt hat.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um den Quellcode-Standort anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Installationsbefehl-Einstieg | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| Lokaler Pfad-Erkennung | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Git-URL-Erkennung | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| GitHub shorthand-Parsing | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Lokaler Pfad-Installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Git-Repository-Klonen | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Fehlermeldung privates Repository | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**Wichtige Funktionen**:
- `isLocalPath(source)` - Prüft, ob es sich um einen lokalen Pfad handelt (Zeilen 25-32)
- `isGitUrl(source)` - Prüft, ob es sich um eine Git-URL handelt (Zeilen 37-45)
- `installFromLocal()` - Installiert Skills aus einem lokalen Pfad (Zeilen 199-226)
- `installSpecificSkill()` - Installiert einen Skill am angegebenen Unterpfad (Zeilen 272-316)
- `getRepoName()` - Extrahiert den Repository-Namen aus einer Git-URL (Zeilen 50-56)

**Wichtige Logik**:
1. Priorität bei der Erkennung von Quellentypen: lokaler Pfad → Git-URL → GitHub shorthand (Zeilen 111-143)
2. GitHub shorthand unterstützt zwei Formate: `owner/repo` und `owner/repo/skill-name` (Zeilen 132-142)
3. Bei Fehlschlagen des Klonens privater Repositories wird zur Konfiguration von SSH-Schlüsseln oder Anmeldeinformationen aufgefordert (Zeile 167)

</details>
