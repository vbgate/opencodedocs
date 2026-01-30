---
title: "Best Practices: Skill-Entwicklung | opencode-agent-skills"
sidebarTitle: "Hochwertige Skills schreiben"
subtitle: "Best Practices: Skill-Entwicklung"
description: "Beherrschen Sie die Entwicklungsstandards für OpenCode Agent Skills. Lernen Sie Best Practices für Benennung, Beschreibung, Verzeichnisstruktur, Skripte und Frontmatter, um die Skill-Qualität und KI-Effizienz zu verbessern."
tags:
  - "Best Practices"
  - "Skill-Entwicklung"
  - "Standards"
  - "Anthropic Skills"
prerequisite:
  - "creating-your-first-skill"
order: 1
---

# Best Practices für die Skill-Entwicklung

## Was Sie lernen werden

Nach Abschluss dieses Tutorials werden Sie in der Lage sein:
- Skill-Namen zu schreiben, die den Namenskonventionen entsprechen
- Beschreibungen zu verfassen, die von der automatischen Empfehlung leicht erkannt werden
- Eine übersichtliche Skill-Verzeichnisstruktur zu organisieren
- Skriptfunktionen sinnvoll einzusetzen
- Häufige Frontmatter-Fehler zu vermeiden
- Die Auffindbarkeit und Nutzbarkeit von Skills zu verbessern

## Warum Best Practices wichtig sind

Das OpenCode Agent Skills Plugin speichert nicht nur Skills, sondern:
- **Automatische Erkennung**: Scannt Skill-Verzeichnisse aus mehreren Speicherorten
- **Semantisches Matching**: Empfiehlt Skills basierend auf der Ähnlichkeit zwischen Skill-Beschreibung und Benutzernachricht
- **Namespace-Verwaltung**: Unterstützt die Koexistenz von Skills aus mehreren Quellen
- **Skriptausführung**: Scannt und führt ausführbare Skripte automatisch aus

Die Einhaltung von Best Practices ermöglicht es Ihren Skills:
- ✅ Vom Plugin korrekt erkannt und geladen zu werden
- ✅ Beim semantischen Matching eine höhere Empfehlungspriorität zu erhalten
- ✅ Konflikte mit anderen Skills zu vermeiden
- ✅ Von Teammitgliedern leichter verstanden und verwendet zu werden

---

## Namenskonventionen

### Regeln für Skill-Namen

Skill-Namen müssen den folgenden Konventionen entsprechen:

::: tip Namensregeln
- ✅ Verwenden Sie Kleinbuchstaben, Zahlen und Bindestriche
- ✅ Beginnen Sie mit einem Buchstaben
- ✅ Trennen Sie Wörter mit Bindestrichen
- ❌ Verwenden Sie keine Großbuchstaben oder Unterstriche
- ❌ Verwenden Sie keine Leerzeichen oder Sonderzeichen
:::

**Beispiele**:

| ✅ Korrekte Beispiele | ❌ Falsche Beispiele | Grund |
| --- | --- | --- |
| `git-helper` | `GitHelper` | Enthält Großbuchstaben |
| `docker-build` | `docker_build` | Verwendet Unterstriche |
| `code-review` | `code review` | Enthält Leerzeichen |
| `test-utils` | `1-test` | Beginnt mit einer Zahl |

**Quellcode-Referenz**: `src/skills.ts:106-108`

```typescript
name: z.string()
  .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
  .min(1, { message: "Name cannot be empty" }),
```

### Beziehung zwischen Verzeichnisname und Frontmatter

Der Skill-Verzeichnisname und das `name`-Feld im Frontmatter können unterschiedlich sein:

```yaml
---
# Verzeichnis ist my-git-tools, aber name im Frontmatter ist git-helper
name: git-helper
description: Git-Assistent für häufige Operationen
---
```

**Empfohlene Vorgehensweise**:
- Halten Sie Verzeichnisname und `name`-Feld konsistent für einfachere Wartung
- Verwenden Sie kurze, einprägsame Bezeichner für Verzeichnisnamen
- Das `name`-Feld kann den Skill-Zweck genauer beschreiben

**Quellcode-Referenz**: `src/skills.ts:155-158`

---

## Tipps zum Schreiben von Beschreibungen

### Zweck der Beschreibung

Die Skill-Beschreibung dient nicht nur der Benutzerinformation, sondern wird auch verwendet für:

1. **Semantisches Matching**: Das Plugin berechnet die Ähnlichkeit zwischen Beschreibung und Benutzernachricht
2. **Skill-Empfehlungen**: Empfiehlt automatisch relevante Skills basierend auf der Ähnlichkeit
3. **Fuzzy-Matching**: Empfiehlt ähnliche Skills bei Tippfehlern im Skill-Namen

### Gute vs. schlechte Beschreibungen

| ✅ Gute Beschreibung | ❌ Schlechte Beschreibung | Grund |
| --- | --- | --- |
| "Automatisiert Git-Branch-Management und Commit-Workflows, unterstützt automatische Generierung von Commit-Nachrichten" | "Git-Tool" | Zu vage, keine konkreten Funktionen |
| "Generiert typsicheren API-Client-Code für Node.js-Projekte" | "Ein nützliches Tool" | Kein Anwendungsszenario angegeben |
| "Übersetzt PDFs ins Chinesische unter Beibehaltung des Originallayouts" | "Übersetzungstool" | Keine besonderen Fähigkeiten erwähnt |

### Prinzipien für das Schreiben von Beschreibungen

::: tip Prinzipien für Beschreibungen
1. **Seien Sie spezifisch**: Beschreiben Sie den konkreten Zweck und die Anwendungsszenarien des Skills
2. **Fügen Sie Schlüsselwörter ein**: Verwenden Sie Schlüsselwörter, nach denen Benutzer suchen könnten (z.B. "Git", "Docker", "Übersetzung")
3. **Heben Sie den einzigartigen Wert hervor**: Erklären Sie die Vorteile dieses Skills gegenüber ähnlichen Skills
4. **Vermeiden Sie Redundanz**: Wiederholen Sie nicht den Skill-Namen
:::

**Beispiel**:

```markdown
---
name: pdf-translator
description: Übersetzt englische PDF-Dokumente ins Chinesische unter Beibehaltung des Originallayouts, der Bildpositionen und der Tabellenstruktur. Unterstützt Stapelübersetzung und benutzerdefinierte Glossare.
---
```

Diese Beschreibung enthält:
- ✅ Konkrete Funktionen (PDF-Übersetzung, Formaterhaltung)
- ✅ Anwendungsszenario (englische Dokumente)
- ✅ Einzigartiger Wert (Formaterhaltung, Stapelverarbeitung, Glossar)

**Quellcode-Referenz**: `src/skills.ts:109`

```typescript
description: z.string()
  .min(1, { message: "Description cannot be empty" }),
```

---

## Verzeichnisorganisation

### Grundstruktur

Ein Standard-Skill-Verzeichnis enthält:

```
my-skill/
├── SKILL.md              # Skill-Hauptdatei (erforderlich)
├── README.md             # Detaillierte Dokumentation (optional)
├── tools/                # Ausführbare Skripte (optional)
│   ├── setup.sh
│   └── run.sh
└── docs/                 # Unterstützende Dokumentation (optional)
    ├── guide.md
    └── examples.md
```

### Übersprungene Verzeichnisse

Das Plugin überspringt automatisch die folgenden Verzeichnisse (keine Skript-Scans):

::: warning Automatisch übersprungene Verzeichnisse
- `node_modules` - Node.js-Abhängigkeiten
- `__pycache__` - Python-Bytecode-Cache
- `.git` - Git-Versionskontrolle
- `.venv`, `venv` - Python-virtuelle Umgebungen
- `.tox`, `.nox` - Python-Testumgebungen
- Alle versteckten Verzeichnisse, die mit `.` beginnen
:::

**Quellcode-Referenz**: `src/skills.ts:61`

```typescript
const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);
```

### Empfohlene Verzeichnisnamen

| Zweck | Empfohlener Verzeichnisname | Beschreibung |
| --- | --- | --- |
| Skriptdateien | `tools/` oder `scripts/` | Speichert ausführbare Skripte |
| Dokumentation | `docs/` oder `examples/` | Speichert unterstützende Dokumentation |
| Konfiguration | `config/` | Speichert Konfigurationsdateien |
| Vorlagen | `templates/` | Speichert Vorlagendateien |

---

## Skriptverwendung

### Regeln für die Skripterkennung

Das Plugin scannt automatisch ausführbare Dateien im Skill-Verzeichnis:

::: tip Regeln für die Skripterkennung
- ✅ Skripte müssen Ausführungsrechte haben (`chmod +x script.sh`)
- ✅ Maximale Rekursionstiefe beträgt 10 Ebenen
- ✅ Versteckte Verzeichnisse und Abhängigkeitsverzeichnisse werden übersprungen
- ❌ Nicht ausführbare Dateien werden nicht als Skripte erkannt
:::

**Quellcode-Referenz**: `src/skills.ts:86`

```typescript
if (stats.mode & 0o111) {
  scripts.push({
    relativePath: newRelPath,
    absolutePath: fullPath
  });
}
```

### Skriptberechtigungen setzen

**Bash-Skripte**:
```bash
chmod +x tools/setup.sh
chmod +x tools/run.sh
```

**Python-Skripte**:
```bash
chmod +x tools/scan.py
```

Und fügen Sie am Anfang der Datei einen Shebang hinzu:
```python
#!/usr/bin/env python3
import sys
# ...
```

### Beispiel für Skriptaufrufe

Wenn ein Skill geladen wird, sieht die KI eine Liste der verfügbaren Skripte:

```
Available scripts:
- tools/setup.sh: Entwicklungsumgebung initialisieren
- tools/build.sh: Projekt bauen
- tools/deploy.sh: In Produktionsumgebung deployen
```

Die KI kann diese Skripte über das `run_skill_script`-Tool aufrufen:

```javascript
run_skill_script({
  skill: "project-builder",
  script: "tools/build.sh",
  arguments: ["--release", "--verbose"]
})
```

---

## Best Practices für Frontmatter

### Erforderliche Felder

**name**: Eindeutiger Skill-Bezeichner
- Kleinbuchstaben, Zahlen und Bindestriche
- Kurz, aber aussagekräftig
- Vermeiden Sie generische Namen (wie `helper`, `tool`)

**description**: Skill-Beschreibung
- Beschreiben Sie die Funktionen konkret
- Geben Sie Anwendungsszenarien an
- Angemessene Länge (1-2 Sätze)

### Optionale Felder

**license**: Lizenzinformationen
```yaml
license: MIT
```

**allowed-tools**: Beschränkt die vom Skill verwendbaren Tools
```yaml
allowed-tools:
  - read
  - write
  - bash
```

**metadata**: Benutzerdefinierte Metadaten
```yaml
metadata:
  author: "Ihr Name"
  version: "1.0.0"
  category: "development"
```

**Quellcode-Referenz**: `src/skills.ts:105-114`

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

### Vollständiges Beispiel

```markdown
---
name: docker-deploy
description: Automatisiert Docker-Image-Build und Deployment-Workflows, unterstützt Multi-Umgebungs-Konfiguration, Health-Checks und Rollbacks
license: MIT
allowed-tools:
  - read
  - write
  - bash
metadata:
  version: "2.1.0"
  author: "DevOps Team"
  category: "deployment"
---

# Docker Auto-Deployment

Dieser Skill hilft Ihnen, Docker-Image-Build, Push und Deployment-Workflows zu automatisieren.

## Verwendung

...
```

---

## Häufige Fehler vermeiden

### Fehler 1: Name entspricht nicht den Konventionen

**Falsches Beispiel**:
```yaml
name: MyAwesomeSkill  # ❌ Großbuchstaben
```

**Korrektur**:
```yaml
name: my-awesome-skill  # ✅ Kleinbuchstaben + Bindestriche
```

### Fehler 2: Beschreibung zu vage

**Falsches Beispiel**:
```yaml
description: "Ein nützliches Tool"  # ❌ Zu vage
```

**Korrektur**:
```yaml
description: "Automatisiert Git-Commit-Workflows, generiert automatisch standardkonforme Commit-Nachrichten"  # ✅ Konkret und klar
```

### Fehler 3: Skript hat keine Ausführungsrechte

**Problem**: Skript wird nicht als ausführbares Skript erkannt

**Lösung**:
```bash
chmod +x tools/setup.sh
```

**Überprüfung**:
```bash
ls -l tools/setup.sh
# Sollte anzeigen: -rwxr-xr-x (hat x-Berechtigung)
```

### Fehler 4: Verzeichnisnamenskonflikt

**Problem**: Mehrere Skills verwenden denselben Namen

**Lösung**:
- Verwenden Sie Namespaces (über Plugin-Konfiguration oder Verzeichnisstruktur)
- Oder verwenden Sie aussagekräftigere Namen

**Quellcode-Referenz**: `src/skills.ts:258-259`

```typescript
// Skills mit gleichem Namen: nur der erste wird behalten, nachfolgende werden ignoriert
if (skillsByName.has(skill.name)) {
  continue;
}
```

---

## Auffindbarkeit verbessern

### 1. Beschreibungs-Schlüsselwörter optimieren

Fügen Sie Schlüsselwörter in die Beschreibung ein, nach denen Benutzer suchen könnten:

```yaml
---
name: code-reviewer
description: Automatisiertes Code-Review-Tool, prüft Codequalität, potenzielle Bugs, Sicherheitslücken und Performance-Probleme. Unterstützt JavaScript, TypeScript, Python und viele weitere Sprachen.
---
```

Schlüsselwörter: Code-Review, Codequalität, Bug, Sicherheitslücke, Performance-Problem, JavaScript, TypeScript, Python

### 2. Standard-Skill-Speicherorte verwenden

Das Plugin erkennt Skills in folgender Prioritätsreihenfolge:

1. `.opencode/skills/` - Projektebene (höchste Priorität)
2. `.claude/skills/` - Projektebene Claude
3. `~/.config/opencode/skills/` - Benutzerebene
4. `~/.claude/skills/` - Benutzerebene Claude

**Empfohlene Vorgehensweise**:
- Projektspezifische Skills → auf Projektebene platzieren
- Allgemeine Skills → auf Benutzerebene platzieren

### 3. Detaillierte Dokumentation bereitstellen

Neben SKILL.md können Sie auch bereitstellen:
- `README.md` - Detaillierte Erklärungen und Anwendungsbeispiele
- `docs/guide.md` - Vollständige Benutzeranleitung
- `docs/examples.md` - Praxisbeispiele

---

## Zusammenfassung

Dieses Tutorial hat die Best Practices für die Skill-Entwicklung vorgestellt:

- **Namenskonventionen**: Verwenden Sie Kleinbuchstaben, Zahlen und Bindestriche
- **Beschreibungen schreiben**: Seien Sie spezifisch, fügen Sie Schlüsselwörter ein, heben Sie den einzigartigen Wert hervor
- **Verzeichnisorganisation**: Klare Struktur, unnötige Verzeichnisse überspringen
- **Skriptverwendung**: Ausführungsrechte setzen, Tiefenbeschränkung beachten
- **Frontmatter-Standards**: Erforderliche und optionale Felder korrekt ausfüllen
- **Fehler vermeiden**: Häufige Probleme und deren Lösungen

Die Einhaltung dieser Best Practices ermöglicht es Ihren Skills:
- ✅ Vom Plugin korrekt erkannt und geladen zu werden
- ✅ Beim semantischen Matching eine höhere Empfehlungspriorität zu erhalten
- ✅ Konflikte mit anderen Skills zu vermeiden
- ✅ Von Teammitgliedern leichter verstanden und verwendet zu werden

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[API-Tool-Referenz](../api-reference/)**.
>
> Sie werden sehen:
> - Detaillierte Parameterbeschreibungen für alle verfügbaren Tools
> - Tool-Aufrufbeispiele und Rückgabewertformate
> - Fortgeschrittene Verwendung und Hinweise

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Skill-Namensvalidierung | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L106-L108) | 106-108 |
| Skill-Beschreibungsvalidierung | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L109-L110) | 109-110 |
| Frontmatter-Schema-Definition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Liste der übersprungenen Verzeichnisse | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61) | 61 |
| Prüfung der Skript-Ausführungsrechte | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| Deduplizierungslogik für gleichnamige Skills | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |

**Wichtige Konstanten**:
- Übersprungene Verzeichnisse: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`

**Wichtige Funktionen**:
- `findScripts(skillPath: string, maxDepth: number = 10)`: Sucht rekursiv nach ausführbaren Skripten im Skill-Verzeichnis
- `parseSkillFile(skillPath: string)`: Parst SKILL.md und validiert das Frontmatter

</details>
