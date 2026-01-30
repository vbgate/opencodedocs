---
title: "Sicherheitsmechanismen: Pfadschutz und Validierung | opencode-agent-skills"
sidebarTitle: "Sicherheitsmechanismen"
subtitle: "Sicherheitsmechanismen: Pfadschutz und Validierung"
description: "Erfahren Sie mehr über die Sicherheitsmechanismen des OpenCode Agent Skills Plugins. Beherrschen Sie Pfadschutz, YAML-Parsing, Eingabevalidierung und Skriptausführungsschutz, um das Skills-Plugin sicher zu verwenden."
tags:
  - Sicherheit
  - Best Practices
  - FAQ
prerequisite: []
order: 2
---

# Sicherheitshinweise

## Was Sie nach diesem Lernabschnitt können werden

- Verstehen, wie das Plugin Ihr System vor Sicherheitsbedrohungen schützt
- Wissen, welchen Sicherheitsstandards Skill-Dateien entsprechen müssen
- Die Best Practices für die sichere Verwendung des Plugins beherrschen

## Grundlegende Überlegungen

Das OpenCode Agent Skills Plugin läuft in Ihrer lokalen Umgebung, führt Skripte aus, liest Dateien und parst Konfigurationen. Obwohl es leistungsfähig ist, können Skill-Dateien aus nicht vertrauenswürdigen Quellen auch Sicherheitsrisiken mit sich bringen.

Das Plugin wurde mit mehreren Sicherheitsebenen entwickelt, die wie Schutzschichten funktionieren – von Pfadzugriff, Dateiparsing bis zur Skriptausführung. Das Verständnis dieser Mechanismen hilft Ihnen, das Plugin sicherer zu nutzen.

## Detaillierte Sicherheitsmechanismen

### 1. Pfadsicherheitsprüfung: Verhinderung von Directory Traversal

**Problem**: Wenn Skill-Dateien böswillige Pfade enthalten (z.B. `../../etc/passwd`), könnte auf sensible Systemdateien zugegriffen werden.

**Schutzmaßnahmen**:

Das Plugin verwendet die Funktion `isPathSafe()` (`src/utils.ts:130-133`), um sicherzustellen, dass alle Dateizugriffe auf das Skill-Verzeichnis beschränkt sind:

```typescript
export function isPathSafe(basePath: string, requestedPath: string): boolean {
  const resolved = path.resolve(basePath, requestedPath);
  return resolved.startsWith(basePath + path.sep) || resolved === basePath;
}
```

**Funktionsweise**:
1. Der angeforderte Pfad wird in einen absoluten Pfad aufgelöst
2. Es wird geprüft, ob der aufgelöste Pfad mit dem Skill-Verzeichnis beginnt
3. Wenn der Pfad versucht, das Skill-Verzeichnis zu verlassen (mit `..`), wird er direkt abgelehnt

**Praktisches Beispiel**:

Wenn das Tool `read_skill_file` eine Datei liest (`src/tools.ts:101-103`), wird zuerst `isPathSafe` aufgerufen:

```typescript
// Security: ensure path doesn't escape skill directory
if (!isPathSafe(skill.path, args.filename)) {
  return `Invalid path: cannot access files outside skill directory.`;
}
```

Das bedeutet:
- ✅ `docs/guide.md` → Erlaubt (innerhalb des Skill-Verzeichnisses)
- ❌ `../../../etc/passwd` → Abgelehnt (versucht auf Systemdateien zuzugreifen)
- ❌ `/etc/passwd` → Abgelehnt (absoluter Pfad)

::: info Warum ist das wichtig
Directory Traversal-Angriffe sind häufige Schwachstellen in Web-Anwendungen. Auch wenn das Plugin lokal läuft, könnten nicht vertrauenswürdige Skills versuchen, auf Ihre SSH-Schlüssel, Projektkonfigurationen und andere sensible Dateien zuzugreifen.
:::

### 2. Sichere YAML-Analyse: Verhinderung von Codeausführung

**Problem**: YAML unterstützt benutzerdefinierte Tags und komplexe Objekte. Böswilliges YAML könnte durch Tags Code ausführen (z.B. `!!js/function`).

**Schutzmaßnahmen**:

Das Plugin verwendet die Funktion `parseYamlFrontmatter()` (`src/utils.ts:41-49`) mit einer strengen YAML-Parsing-Strategie:

```typescript
export function parseYamlFrontmatter(text: string): Record<string, unknown> {
  try {
    const result = YAML.parse(text, {
      // Use core schema which only supports basic JSON-compatible types
      // This prevents custom tags that could execute code
      schema: "core",
      // Limit recursion depth to prevent DoS attacks
      maxAliasCount: 100,
    });
    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
```

**Wichtige Sicherheitseinstellungen**:

| Einstellung | Wirkung |
| --- | --- |
| `schema: "core"` | Unterstützt nur grundlegende JSON-Typen (String, Zahl, Boolean, Array, Objekte), deaktiviert benutzerdefinierte Tags |
| `maxAliasCount: 100` | Begrenzt die Rekursionstiefe von YAML-Aliassen, um DoS-Angriffe zu verhindern |

**Praktisches Beispiel**:

```yaml
# Böswilliges YAML-Beispiel (wird vom Core-Schema abgelehnt)
---
!!js/function >
function () { return "malicious code" }
---

# Korrektes sicheres Format
---
name: my-skill
description: A safe skill description
---
```

Wenn das YAML-Parsing fehlschlägt, ignoriert das Plugin den Skill stillschweigend und fährt mit der Erkennung anderer Skills fort (`src/skills.ts:142-145`):

```typescript
let frontmatterObj: unknown;
try {
  frontmatterObj = parseYamlFrontmatter(frontmatterText);
} catch {
  return null;  // Parsing fehlgeschlagen, überspringe diesen Skill
}
```

### 3. Eingabevalidierung: Strenge Zod-Schema-Prüfung

**Problem**: Die Frontmatter-Felder eines Skills könnten nicht der Spezifikation entsprechen, was zu abnormalem Plugin-Verhalten führen könnte.

**Schutzmaßnahmen**:

Das Plugin verwendet ein Zod-Schema (`src/skills.ts:105-114`) zur strengen Validierung des Frontmatters:

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

**Validierungsregeln**:

| Feld | Regel | Abgelehntes Beispiel |
| --- | --- | --- |
| `name` | Kleinbuchstaben, Zahlen, Bindestrich, darf nicht leer sein | `MySkill` (Großbuchstaben), `my skill` (Leerzeichen) |
| `description` | Darf nicht leer sein | `""` (leerer String) |
| `license` | Optionaler String | - |
| `allowed-tools` | Optionaler String-Array | `[123]` (kein String) |
| `metadata` | Optionaler Key-Value-Objekt (Werte sind Strings) | `{key: 123}` (Wert ist kein String) |

**Praktisches Beispiel**:

```yaml
# ❌ Fehler: name enthält Großbuchstaben
---
name: GitHelper
description: Git operations helper
---

# ✅ Korrekt: entspricht der Spezifikation
---
name: git-helper
description: Git operations helper
---
```

Wenn die Validierung fehlschlägt, überspringt das Plugin den Skill (`src/skills.ts:147-152`):

```typescript
let frontmatter: SkillFrontmatter;
try {
  frontmatter = SkillFrontmatterSchema.parse(frontmatterObj);
} catch (error) {
  return null;  // Validierung fehlgeschlagen, überspringe diesen Skill
}
```

### 4. Skriptausführungssicherheit: Nur ausführbare Dateien werden ausgeführt

**Problem**: Wenn das Plugin beliebige Dateien ausführt (z.B. Konfigurationsdateien, Dokumente), könnte dies zu unerwarteten Konsequenzen führen.

**Schutzmaßnahmen**:

Bei der Skripterkennung (`src/skills.ts:59-99`) sammelt das Plugin nur Dateien mit Ausführungsberechtigung:

```typescript
async function findScripts(skillPath: string, maxDepth: number = 10): Promise<Script[]> {
  const scripts: Script[] = [];
  const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);

  // ... Rekursive Traversierungslogik ...

  if (stats.isFile()) {
    // Wichtig: Nur Dateien mit Ausführungsbit sammeln
    if (stats.mode & 0o111) {
      scripts.push({
        relativePath: newRelPath,
        absolutePath: fullPath
      });
    }
  }
  // ...
}
```

**Sicherheitsmerkmale**:

| Prüfungsmechanismus | Wirkung |
| --- | --- |
| **Ausführungsbit-Prüfung** (`stats.mode & 0o111`) | Führt nur Dateien aus, die vom Benutzer explizit als ausführbar markiert wurden, verhindert versehentliche Ausführung von Dokumenten |
| **Überspringen versteckter Verzeichnisse** (`entry.name.startsWith('.')`) | Scannt keine `.git`-, `.vscode`-Verzeichnisse usw., vermeidet das Scannen zu vieler Dateien |
| **Überspringen von Abhängigkeitsverzeichnissen** (`skipDirs.has(entry.name)`) | Überspringt `node_modules`, `__pycache__` usw., vermeidet das Scannen von Drittanbieter-Abhängigkeiten |
| **Rekursionstiefenbegrenzung** (`maxDepth: 10`) | Begrenzt die Rekursionstiefe auf 10 Ebenen, verhindert Leistungsprobleme durch tief verschachtelte Verzeichnisse |

**Praktisches Beispiel**:

Im Skill-Verzeichnis:

```bash
my-skill/
├── SKILL.md
├── deploy.sh          # ✓ Ausführbar (als Skript erkannt)
├── build.sh           # ✓ Ausführbar (als Skript erkannt)
├── README.md          # ✗ Nicht ausführbar (wird nicht als Skript erkannt)
├── config.json        # ✗ Nicht ausführbar (wird nicht als Skript erkannt)
└── node_modules/      # ✗ Übersprungen (Abhängigkeitsverzeichnis)
    └── ...           # ✗ Übersprungen
```

Wenn `run_skill_script("my-skill", "README.md")` aufgerufen wird, wird README.md aufgrund fehlender Ausführungsberechtigung nicht als Skript erkannt (`src/skills.ts:86`), sodass ein "Nicht gefunden"-Fehler zurückgegeben wird (`src/tools.ts:165-177`).

## Best Practices für Sicherheit

### 1. Skills aus vertrauenswürdigen Quellen beziehen

- ✓ Verwenden Sie offizielle Skill-Repositories oder vertrauenswürdige Entwickler
- ✓ Überprüfen Sie die GitHub-Sterne-Anzahl und die Aktivität der Contributors eines Skills
- ✗ Laden Sie keine Skills aus unbekannten Quellen herunter und führen Sie diese nicht aus

### 2. Skill-Inhalte überprüfen

Bevor Sie einen neuen Skill laden, überprüfen Sie schnell die SKILL.md und die Skriptdateien:

```bash
# Skill-Beschreibung und Metadaten anzeigen
cat .opencode/skills/skill-name/SKILL.md

# Skriptinhalte überprüfen
cat .opencode/skills/skill-name/scripts/*.sh
```

Besonders beachten:
- Ob Skripte auf sensible Systempfade zugreifen (`/etc`, `~/.ssh`)
- Ob Skripte externe Abhängigkeiten installieren
- Ob Skripte Systemkonfigurationen ändern

### 3. Skriptberechtigungen korrekt setzen

Nur Dateien, die explizit ausgeführt werden müssen, sollten Ausführungsberechtigungen erhalten:

```bash
# Korrekt: Ausführungsberechtigung für Skript hinzufügen
chmod +x .opencode/skills/my-skill/tools/deploy.sh

# Korrekt: Dokumente behalten Standardberechtigungen (nicht ausführbar)
# README.md, config.json usw. müssen nicht ausgeführt werden
```

### 4. Sensible Dateien verbergen

Skill-Verzeichnisse sollten keine sensiblen Informationen enthalten:

- ✗ `.env`-Dateien (API-Schlüssel)
- ✗ `.pem`-Dateien (private Schlüssel)
- ✗ `credentials.json` (Anmeldeinformationen)
- ✓ Verwenden Sie Umgebungsvariablen oder externe Konfigurationen für sensible Daten

### 5. Projekt-Level-Skills überschreiben Benutzer-Level-Skills

Skill-Erkennungspriorität (`src/skills.ts:241-246`):

1. `.opencode/skills/` (Projekt-Level)
2. `.claude/skills/` (Projekt-Level, Claude)
3. `~/.config/opencode/skills/` (Benutzer-Level)
4. `~/.claude/skills/` (Benutzer-Level, Claude)
5. `~/.claude/plugins/cache/` (Plugin-Cache)
6. `~/.claude/plugins/marketplaces/` (Plugin-Marktplatz)

**Best Practices**:

- Projektspezifische Skills in `.opencode/skills/` ablegen, überschreiben automatisch gleichnamige Benutzer-Level-Skills
- Generische Skills in `~/.config/opencode/skills/` ablegen, für alle Projekte verfügbar
- Globale Installation von Skills aus nicht vertrauenswürdigen Quellen wird nicht empfohlen

## Zusammenfassung dieser Lektion

Das OpenCode Agent Skills Plugin verfügt über mehrere Sicherheitsebenen:

| Sicherheitsmechanismus | Schutzziel | Code-Position |
| --- | --- | --- |
| Pfadsicherheitsprüfung | Directory Traversal verhindern, Dateizugriffsbereich einschränken | `utils.ts:130-133` |
| Sichere YAML-Analyse | Böswilliges YAML an der Codeausführung hindern | `utils.ts:41-49` |
| Zod-Schema-Validierung | Sicherstellen, dass Skill-Frontmatter der Spezifikation entspricht | `skills.ts:105-114` |
| Skript-Ausführbarkeitsprüfung | Nur Dateien ausführen, die vom Benutzer explizit als ausführbar markiert wurden | `skills.ts:86` |
| Verzeichnis-Überspringlogik | Vermeiden des Scannens versteckter Verzeichnisse und Abhängigkeitsverzeichnisse | `skills.ts:61, 70` |

Denken Sie daran: Sicherheit ist eine gemeinsame Verantwortung. Das Plugin bietet Schutzmechanismen, aber die endgültige Entscheidung liegt bei Ihnen – verwenden Sie nur Skills aus vertrauenswürdigen Quellen und gewöhnen Sie sich an, Code zu überprüfen.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Best Practices für die Skill-Entwicklung](../../appendix/best-practices/)**.
>
> Sie werden sehen:
> - Namenskonventionen und Beschreibungsschreibtechniken
> - Verzeichnisorganisation und Skriptverwendung
> - Frontmatter-Best Practices
> - Methoden zur Vermeidung häufiger Fehler

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Positionen</strong></summary>

> Letzte Aktualisierung: 2026-01-24

| Sicherheitsmechanismus | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Pfadsicherheitsprüfung | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| Sichere YAML-Analyse | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L56) | 41-56 |
| Zod-Schema-Validierung | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Skript-Ausführbarkeitsprüfung | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| Verzeichnis-Überspringlogik | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61-L70) | 61, 70 |
| Pfadsicherheit in Tools | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L101-L103) | 101-103 |

**Wichtige Funktionen**:
- `isPathSafe(basePath, requestedPath)`: Validiert, ob ein Pfad sicher ist, verhindert Directory Traversal
- `parseYamlFrontmatter(text)`: Parst YAML sicher, verwendet Core-Schema und Rekursionsbegrenzung
- `SkillFrontmatterSchema`: Zod-Schema, validiert Skill-Frontmatter-Felder
- `findScripts(skillPath, maxDepth)`: Rekursiv nach ausführbaren Skripten suchen, überspringt versteckte und Abhängigkeitsverzeichnisse

**Wichtige Konstanten**:
- `maxAliasCount: 100`: Maximale Anzahl von Aliasen beim YAML-Parsing, verhindert DoS-Angriffe
- `maxDepth: 10`: Maximale Rekursionstiefe bei der Skripterkennung
- `0o111`: Ausführungsbit-Maske (prüft, ob eine Datei ausführbar ist)

</details>
