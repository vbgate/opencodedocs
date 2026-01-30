---
title: "Scripts API: Node.js-Skripte | Everything Claude Code"
sidebarTitle: "Hook-Skripte schreiben"
subtitle: "Scripts API: Node.js-Skripte"
description: "Lernen Sie die Scripts API von Everything Claude Code. Beherrschen Sie Plattformerkennung, Dateioperationen, Paketmanager-API und Hook-Skripte."
tags:
  - "scripts-api"
  - "api"
  - "nodejs"
  - "utils"
  - "package-manager"
  - "hooks"
prerequisite:
  - "start-package-manager-setup"
order: 215
---

# Scripts API Referenz: Node.js-Skript-Schnittstelle

## Was Sie lernen werden

- Vollständiges Verständnis der Scripts API von Everything Claude Code
- Verwendung von Plattformerkennung und plattformübergreifenden Hilfsfunktionen
- Konfiguration und Nutzung der automatischen Paketmanager-Erkennung
- Erstellung benutzerdefinierter Hook-Skripte zur Erweiterung der Automatisierung
- Debugging und Anpassung bestehender Skript-Implementierungen

## Ihre aktuelle Herausforderung

Sie wissen bereits, dass Everything Claude Code viele Automatisierungsskripte enthält, stoßen aber auf folgende Fragen:

- "Welche APIs bieten diese Node.js-Skripte konkret?"
- "Wie kann ich Hook-Skripte anpassen?"
- "Welche Priorität hat die Paketmanager-Erkennung?"
- "Wie erreiche ich plattformübergreifende Kompatibilität in Skripten?"

Dieses Tutorial gibt Ihnen eine vollständige Scripts API Referenz.

## Kernkonzept

Das Skriptsystem von Everything Claude Code gliedert sich in zwei Kategorien:

1. **Gemeinsame Bibliotheken** (`scripts/lib/`) - Bieten plattformübergreifende Funktionen und APIs
2. **Hook-Skripte** (`scripts/hooks/`) - Automatisierungslogik, die bei bestimmten Ereignissen ausgelöst wird

Alle Skripte unterstützen **Windows, macOS und Linux** und sind mit nativen Node.js-Modulen implementiert.

### Skriptstruktur

```
scripts/
├── lib/
│   ├── utils.js              # Allgemeine Hilfsfunktionen
│   └── package-manager.js    # Paketmanager-Erkennung
├── hooks/
│   ├── session-start.js       # SessionStart Hook
│   ├── session-end.js         # SessionEnd Hook
│   ├── pre-compact.js        # PreCompact Hook
│   ├── suggest-compact.js     # PreToolUse Hook
│   └── evaluate-session.js   # Stop Hook
└── setup-package-manager.js   # Paketmanager-Setup-Skript
```

## lib/utils.js - Allgemeine Hilfsfunktionen

Dieses Modul bietet plattformübergreifende Hilfsfunktionen, einschließlich Plattformerkennung, Dateioperationen und Systembefehle.

### Plattformerkennung

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| Funktion | Typ | Rückgabewert | Beschreibung |
| --- | --- | --- | --- |
| `isWindows` | boolean | `true/false` | Ob die aktuelle Plattform Windows ist |
| `isMacOS` | boolean | `true/false` | Ob die aktuelle Plattform macOS ist |
| `isLinux` | boolean | `true/false` | Ob die aktuelle Plattform Linux ist |

**Implementierungsprinzip**: Basiert auf `process.platform`

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### Verzeichnis-Hilfsfunktionen

```javascript
const {
  getHomeDir,
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  getTempDir,
  ensureDir
} = require('./lib/utils');
```

#### getHomeDir()

Gibt das Benutzer-Home-Verzeichnis zurück (plattformübergreifend kompatibel)

**Rückgabewert**: `string` - Pfad zum Home-Verzeichnis

**Beispiel**:
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

Gibt das Claude Code Konfigurationsverzeichnis zurück

**Rückgabewert**: `string` - Pfad zum `~/.claude` Verzeichnis

**Beispiel**:
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

Gibt das Sitzungsdatei-Verzeichnis zurück

**Rückgabewert**: `string` - Pfad zum `~/.claude/sessions` Verzeichnis

**Beispiel**:
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

Gibt das Verzeichnis für erlernte Skills zurück

**Rückgabewert**: `string` - Pfad zum `~/.claude/skills/learned` Verzeichnis

**Beispiel**:
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

Gibt das System-Temp-Verzeichnis zurück (plattformübergreifend)

**Rückgabewert**: `string` - Pfad zum Temp-Verzeichnis

**Beispiel**:
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

Stellt sicher, dass ein Verzeichnis existiert; erstellt es, falls nicht vorhanden

**Parameter**:
- `dirPath` (string) - Verzeichnispfad

**Rückgabewert**: `string` - Verzeichnispfad

**Beispiel**:
```javascript
const dir = ensureDir('/path/to/new/dir');
// Falls das Verzeichnis nicht existiert, wird es rekursiv erstellt
```

### Datum/Zeit-Hilfsfunktionen

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

Gibt das aktuelle Datum zurück (Format: YYYY-MM-DD)

**Rückgabewert**: `string` - Datumsstring

**Beispiel**:
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

Gibt die aktuelle Uhrzeit zurück (Format: HH:MM)

**Rückgabewert**: `string` - Zeitstring

**Beispiel**:
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

Gibt aktuelles Datum und Uhrzeit zurück (Format: YYYY-MM-DD HH:MM:SS)

**Rückgabewert**: `string` - Datum-Zeit-String

**Beispiel**:
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### Dateioperationen

```javascript
const {
  findFiles,
  readFile,
  writeFile,
  appendFile,
  replaceInFile,
  countInFile,
  grepFile
} = require('./lib/utils');
```

#### findFiles(dir, pattern, options)

Findet Dateien in einem Verzeichnis, die einem Muster entsprechen (plattformübergreifende Alternative zu `find`)

**Parameter**:
- `dir` (string) - Zu durchsuchendes Verzeichnis
- `pattern` (string) - Dateimuster (z.B. `"*.tmp"`, `"*.md"`)
- `options` (object, optional) - Optionen
  - `maxAge` (number) - Maximales Dateialter in Tagen
  - `recursive` (boolean) - Ob rekursiv gesucht werden soll

**Rückgabewert**: `Array<{path: string, mtime: number}>` - Liste der übereinstimmenden Dateien, sortiert nach Änderungszeit (absteigend)

**Beispiel**:
```javascript
// Finde .tmp-Dateien der letzten 7 Tage
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// Rekursiv alle .md-Dateien finden
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip Plattformübergreifende Kompatibilität
Diese Funktion bietet plattformübergreifende Dateisuche ohne Abhängigkeit vom Unix `find`-Befehl und funktioniert daher auch unter Windows.
:::

#### readFile(filePath)

Liest eine Textdatei sicher

**Parameter**:
- `filePath` (string) - Dateipfad

**Rückgabewert**: `string | null` - Dateiinhalt, bei Fehler `null`

**Beispiel**:
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

Schreibt eine Textdatei

**Parameter**:
- `filePath` (string) - Dateipfad
- `content` (string) - Dateiinhalt

**Rückgabewert**: keiner

**Beispiel**:
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// Falls das Verzeichnis nicht existiert, wird es automatisch erstellt
```

#### appendFile(filePath, content)

Hängt Inhalt an eine Textdatei an

**Parameter**:
- `filePath` (string) - Dateipfad
- `content` (string) - Anzuhängender Inhalt

**Rückgabewert**: keiner

**Beispiel**:
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

Ersetzt Text in einer Datei (plattformübergreifende Alternative zu `sed`)

**Parameter**:
- `filePath` (string) - Dateipfad
- `search` (string | RegExp) - Zu suchender Inhalt
- `replace` (string) - Ersetzungsinhalt

**Rückgabewert**: `boolean` - Ob die Ersetzung erfolgreich war

**Beispiel**:
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: Ersetzung erfolgreich
// false: Datei existiert nicht oder Lesefehler
```

#### countInFile(filePath, pattern)

Zählt Vorkommen eines Musters in einer Datei

**Parameter**:
- `filePath` (string) - Dateipfad
- `pattern` (string | RegExp) - Zu zählendes Muster

**Rückgabewert**: `number` - Anzahl der Übereinstimmungen

**Beispiel**:
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

Sucht ein Muster in einer Datei und gibt übereinstimmende Zeilen mit Zeilennummern zurück

**Parameter**:
- `filePath` (string) - Dateipfad
- `pattern` (string | RegExp) - Zu suchendes Muster

**Rückgabewert**: `Array<{lineNumber: number, content: string}>` - Liste der übereinstimmenden Zeilen

**Beispiel**:
```javascript
const matches = grepFile('/path/to/file.txt', /function\s+\w+/);
// [{ lineNumber: 10, content: 'function test() {...}' }]
```

### Hook I/O

```javascript
const {
  readStdinJson,
  log,
  output
} = require('./lib/utils');
```

#### readStdinJson()

Liest JSON-Daten von der Standardeingabe (für Hook-Eingaben)

**Rückgabewert**: `Promise<object>` - Geparstes JSON-Objekt

**Beispiel**:
```javascript
async function main() {
  const hookInput = await readStdinJson();
  console.log(hookInput.tool);
  console.log(hookInput.tool_input);
}
```

::: tip Hook-Eingabeformat
Das von Claude Code an Hooks übergebene Eingabeformat ist:
```json
{
  "tool": "Bash",
  "tool_input": { "command": "npm run dev" },
  "tool_output": { "output": "..." }
}
```
:::

#### log(message)

Protokolliert eine Nachricht nach stderr (für Benutzer sichtbar)

**Parameter**:
- `message` (string) - Log-Nachricht

**Rückgabewert**: keiner

**Beispiel**:
```javascript
log('[SessionStart] Loading context...');
// Ausgabe nach stderr, für Benutzer in Claude Code sichtbar
```

#### output(data)

Gibt Daten nach stdout aus (Rückgabe an Claude Code)

**Parameter**:
- `data` (object | string) - Auszugebende Daten

**Rückgabewert**: keiner

**Beispiel**:
```javascript
// Objekt ausgeben (automatische JSON-Serialisierung)
output({ success: true, message: 'Completed' });

// String ausgeben
output('Hello, Claude');
```

### Systembefehle

```javascript
const {
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
} = require('./lib/utils');
```

#### commandExists(cmd)

Prüft, ob ein Befehl im PATH existiert

**Parameter**:
- `cmd` (string) - Befehlsname

**Rückgabewert**: `boolean` - Ob der Befehl existiert

**Beispiel**:
```javascript
if (commandExists('pnpm')) {
  console.log('pnpm is available');
}
```

::: warning Sicherheitsvalidierung
Diese Funktion validiert den Befehlsnamen mit einem regulären Ausdruck und erlaubt nur Buchstaben, Zahlen, Unterstriche, Punkte und Bindestriche, um Command Injection zu verhindern.
:::

#### runCommand(cmd, options)

Führt einen Befehl aus und gibt die Ausgabe zurück

**Parameter**:
- `cmd` (string) - Auszuführender Befehl (muss ein vertrauenswürdiger, hartcodierter Befehl sein)
- `options` (object, optional) - `execSync`-Optionen

**Rückgabewert**: `{success: boolean, output: string}` - Ausführungsergebnis

**Beispiel**:
```javascript
const result = runCommand('git status');
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.output);
}
```

::: danger Sicherheitswarnung
**Verwenden Sie diese Funktion nur für vertrauenswürdige, hartcodierte Befehle**. Übergeben Sie niemals benutzergesteuerte Eingaben direkt an diese Funktion. Für Benutzereingaben verwenden Sie `spawnSync` mit einem Argument-Array.
:::

#### isGitRepo()

Prüft, ob das aktuelle Verzeichnis ein Git-Repository ist

**Rückgabewert**: `boolean` - Ob es ein Git-Repository ist

**Beispiel**:
```javascript
if (isGitRepo()) {
  console.log('This is a Git repository');
}
```

#### getGitModifiedFiles(patterns = [])

Gibt eine Liste der von Git geänderten Dateien zurück

**Parameter**:
- `patterns` (string[], optional) - Array von Filtermustern

**Rückgabewert**: `string[]` - Liste der geänderten Dateipfade

**Beispiel**:
```javascript
// Alle geänderten Dateien abrufen
const allModified = getGitModifiedFiles();

// Nur TypeScript-Dateien abrufen
const tsModified = getGitModifiedFiles([/\.ts$/, /\.tsx$/]);
```

## lib/package-manager.js - Paketmanager-API

Dieses Modul bietet APIs zur automatischen Erkennung und Konfiguration von Paketmanagern.

### Unterstützte Paketmanager

```javascript
const { PACKAGE_MANAGERS } = require('./lib/package-manager');
```

| Paketmanager | Lock-Datei | Install-Befehl | Run-Befehl | Exec-Befehl |
| --- | --- | --- | --- | --- |
| `npm` | package-lock.json | `npm install` | `npm run` | `npx` |
| `pnpm` | pnpm-lock.yaml | `pnpm install` | `pnpm` | `pnpm dlx` |
| `yarn` | yarn.lock | `yarn` | `yarn` | `yarn dlx` |
| `bun` | bun.lockb | `bun install` | `bun run` | `bunx` |

### Erkennungspriorität

```javascript
const { DETECTION_PRIORITY } = require('./lib/package-manager');

// ['pnpm', 'bun', 'yarn', 'npm']
```

Die Paketmanager-Erkennung erfolgt nach folgender Priorität (von hoch nach niedrig):

1. Umgebungsvariable `CLAUDE_PACKAGE_MANAGER`
2. Projektebene-Konfiguration `.claude/package-manager.json`
3. `packageManager`-Feld in `package.json`
4. Lock-Datei-Erkennung
5. Globale Benutzereinstellung `~/.claude/package-manager.json`
6. Rückgabe des ersten verfügbaren Paketmanagers nach Priorität

### Kernfunktionen

```javascript
const {
  getPackageManager,
  setPreferredPackageManager,
  setProjectPackageManager,
  getAvailablePackageManagers,
  getRunCommand,
  getExecCommand,
  getCommandPattern
} = require('./lib/package-manager');
```

#### getPackageManager(options = {})

Ermittelt den für das aktuelle Projekt zu verwendenden Paketmanager

**Parameter**:
- `options` (object, optional)
  - `projectDir` (string) - Projektverzeichnispfad, Standard ist `process.cwd()`
  - `fallbackOrder` (string[]) - Fallback-Reihenfolge, Standard ist `['pnpm', 'bun', 'yarn', 'npm']`

**Rückgabewert**: `{name: string, config: object, source: string}`

- `name`: Name des Paketmanagers
- `config`: Konfigurationsobjekt des Paketmanagers
- `source`: Erkennungsquelle (`'environment' | 'project-config' | 'package.json' | 'lock-file' | 'global-config' | 'fallback' | 'default'`)

**Beispiel**:
```javascript
const pm = getPackageManager();
console.log(pm.name);        // 'pnpm'
console.log(pm.source);      // 'lock-file'
console.log(pm.config);      // { name: 'pnpm', lockFile: 'pnpm-lock.yaml', ... }
```

#### setPreferredPackageManager(pmName)

Setzt die globale Paketmanager-Präferenz

**Parameter**:
- `pmName` (string) - Name des Paketmanagers (`npm | pnpm | yarn | bun`)

**Rückgabewert**: `object` - Konfigurationsobjekt

**Beispiel**:
```javascript
const config = setPreferredPackageManager('pnpm');
// Gespeichert in ~/.claude/package-manager.json
// { packageManager: 'pnpm', setAt: '2026-01-25T...' }
```

#### setProjectPackageManager(pmName, projectDir)

Setzt die projektspezifische Paketmanager-Präferenz

**Parameter**:
- `pmName` (string) - Name des Paketmanagers
- `projectDir` (string) - Projektverzeichnispfad, Standard ist `process.cwd()`

**Rückgabewert**: `object` - Konfigurationsobjekt

**Beispiel**:
```javascript
const config = setProjectPackageManager('bun', '/path/to/project');
// Gespeichert in /path/to/project/.claude/package-manager.json
// { packageManager: 'bun', setAt: '2026-01-25T...' }
```

#### getAvailablePackageManagers()

Gibt eine Liste der auf dem System installierten Paketmanager zurück

**Rückgabewert**: `string[]` - Array der verfügbaren Paketmanager-Namen

**Beispiel**:
```javascript
const available = getAvailablePackageManagers();
// ['pnpm', 'npm']  // Falls nur pnpm und npm installiert sind
```

#### getRunCommand(script, options = {})

Gibt den Befehl zum Ausführen eines Skripts zurück

**Parameter**:
- `script` (string) - Skriptname (z.B. `"dev"`, `"build"`, `"test"`)
- `options` (object, optional) - Projektverzeichnis-Optionen

**Rückgabewert**: `string` - Vollständiger Ausführungsbefehl

**Beispiel**:
```javascript
const devCmd = getRunCommand('dev');
// 'npm run dev'  oder  'pnpm dev'  oder  'bun run dev'

const buildCmd = getRunCommand('build');
// 'npm run build'  oder  'pnpm build'
```

**Eingebaute Skript-Shortcuts**:
- `install` → gibt `installCmd` zurück
- `test` → gibt `testCmd` zurück
- `build` → gibt `buildCmd` zurück
- `dev` → gibt `devCmd` zurück
- Andere → gibt `${runCmd} ${script}` zurück

#### getExecCommand(binary, args = '', options = {})

Gibt den Befehl zum Ausführen einer Paket-Binärdatei zurück

**Parameter**:
- `binary` (string) - Name der Binärdatei (z.B. `"prettier"`, `"eslint"`)
- `args` (string, optional) - Argument-String
- `options` (object, optional) - Projektverzeichnis-Optionen

**Rückgabewert**: `string` - Vollständiger Ausführungsbefehl

**Beispiel**:
```javascript
const cmd = getExecCommand('prettier', '--write file.js');
// 'npx prettier --write file.js'  oder  'pnpm dlx prettier --write file.js'

const eslintCmd = getExecCommand('eslint');
// 'npx eslint'  oder  'bunx eslint'
```

#### getCommandPattern(action)

Generiert ein Regex-Muster, das alle Paketmanager-Befehle abdeckt

**Parameter**:
- `action` (string) - Aktionstyp (`'dev' | 'install' | 'test' | 'build'` oder benutzerdefinierter Skriptname)

**Rückgabewert**: `string` - Regex-Muster

**Beispiel**:
```javascript
const devPattern = getCommandPattern('dev');
// (npm run dev|pnpm( run)? dev|yarn dev|bun run dev)

const installPattern = getCommandPattern('install');
// (npm install|pnpm install|yarn( install)?|bun install)
```

## setup-package-manager.js - Paketmanager-Setup-Skript

Dies ist ein ausführbares CLI-Skript zur interaktiven Konfiguration der Paketmanager-Präferenz.

### Verwendung

```bash
# Erkennen und aktuellen Paketmanager anzeigen
node scripts/setup-package-manager.js --detect

# Globale Präferenz setzen
node scripts/setup-package-manager.js --global pnpm

# Projektpräferenz setzen
node scripts/setup-package-manager.js --project bun

# Verfügbare Paketmanager auflisten
node scripts/setup-package-manager.js --list

# Hilfe anzeigen
node scripts/setup-package-manager.js --help
```

### Kommandozeilenparameter

| Parameter | Beschreibung |
| --- | --- |
| `--detect` | Erkennt und zeigt den aktuellen Paketmanager an |
| `--global <pm>` | Setzt die globale Präferenz |
| `--project <pm>` | Setzt die Projektpräferenz |
| `--list` | Listet alle verfügbaren Paketmanager auf |
| `--help` | Zeigt Hilfeinformationen an |

### Ausgabebeispiel

**--detect Ausgabe**:
```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ pnpm (current)
  ✓ npm
  ✗ yarn
  ✗ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

## Hook-Skripte im Detail

### session-start.js - Sitzungsstart-Hook

**Hook-Typ**: `SessionStart`

**Auslösezeitpunkt**: Beim Start einer Claude Code Sitzung

**Funktionen**:
- Prüft aktuelle Sitzungsdateien (letzte 7 Tage)
- Prüft erlernte Skill-Dateien
- Erkennt und meldet den Paketmanager
- Zeigt Auswahlhinweis an, wenn der Paketmanager per Fallback erkannt wurde

**Ausgabebeispiel**:
```
[SessionStart] Found 3 recent session(s)
[SessionStart] Latest: /Users/username/.claude/sessions/2026-01-25-session.tmp
[SessionStart] 5 learned skill(s) available in /Users/username/.claude/skills/learned
[SessionStart] Package manager: pnpm (lock-file)
```

### session-end.js - Sitzungsende-Hook

**Hook-Typ**: `SessionEnd`

**Auslösezeitpunkt**: Beim Beenden einer Claude Code Sitzung

**Funktionen**:
- Erstellt oder aktualisiert die Sitzungsdatei des Tages
- Zeichnet Start- und Endzeit der Sitzung auf
- Stellt Sitzungsstatus-Vorlage bereit (Abgeschlossen, In Bearbeitung, Notizen)

**Sitzungsdatei-Vorlage**:
```markdown
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 14:30
**Last Updated:** 15:45

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
```
[relevant files]
```
```

### pre-compact.js - Pre-Compact-Hook

**Hook-Typ**: `PreCompact`

**Auslösezeitpunkt**: Vor der Kontextkomprimierung durch Claude Code

**Funktionen**:
- Protokolliert Komprimierungsereignisse in einer Logdatei
- Markiert den Komprimierungszeitpunkt in der aktiven Sitzungsdatei

**Ausgabebeispiel**:
```
[PreCompact] State saved before compaction
```

**Logdatei**: `~/.claude/sessions/compaction-log.txt`

### suggest-compact.js - Komprimierungsvorschlags-Hook

**Hook-Typ**: `PreToolUse`

**Auslösezeitpunkt**: Nach jedem Tool-Aufruf (typischerweise Edit oder Write)

**Funktionen**:
- Verfolgt die Anzahl der Tool-Aufrufe
- Schlägt manuelle Komprimierung vor, wenn der Schwellenwert erreicht ist
- Gibt regelmäßige Hinweise zum Komprimierungszeitpunkt

**Umgebungsvariablen**:
- `COMPACT_THRESHOLD` - Komprimierungsschwellenwert (Standard: 50)
- `CLAUDE_SESSION_ID` - Sitzungs-ID

**Ausgabebeispiel**:
```
[StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
[StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
```

::: tip Manuelle vs. automatische Komprimierung
Warum wird manuelle Komprimierung empfohlen?
- Automatische Komprimierung wird oft mitten in einer Aufgabe ausgelöst und führt zu Kontextverlust
- Manuelle Komprimierung kann wichtige Informationen beim Wechsel logischer Phasen bewahren
- Komprimierungszeitpunkte: Ende der Explorationsphase, Beginn der Ausführungsphase, Abschluss von Meilensteinen
:::

### evaluate-session.js - Sitzungsbewertungs-Hook

**Hook-Typ**: `Stop`

**Auslösezeitpunkt**: Am Ende jeder KI-Antwort

**Funktionen**:
- Prüft die Sitzungslänge (basierend auf der Anzahl der Benutzernachrichten)
- Bewertet, ob die Sitzung extrahierbare Muster enthält
- Fordert zum Speichern erlernter Skills auf

**Konfigurationsdatei**: `skills/continuous-learning/config.json`

**Umgebungsvariablen**:
- `CLAUDE_TRANSCRIPT_PATH` - Pfad zur Sitzungsaufzeichnungsdatei

**Ausgabebeispiel**:
```
[ContinuousLearning] Session has 25 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/username/.claude/skills/learned
```

::: tip Warum Stop statt UserPromptSubmit?
- Stop wird nur einmal pro Antwort ausgelöst (leichtgewichtig)
- UserPromptSubmit wird bei jeder Nachricht ausgelöst (hohe Latenz)
:::

## Benutzerdefinierte Hook-Skripte

### Erstellen eines benutzerdefinierten Hooks

1. **Skript im Verzeichnis `scripts/hooks/` erstellen**

```javascript
#!/usr/bin/env node
/**
 * Custom Hook - Your Description
 *
 * Cross-platform (Windows, macOS, Linux)
 */

const { log, output } = require('../lib/utils');

async function main() {
  // Ihre Logik
  log('[CustomHook] Processing...');
  
  // Ergebnis ausgeben
  output({ success: true });
  
  process.exit(0);
}

main().catch(err => {
  console.error('[CustomHook] Error:', err.message);
  process.exit(0); // Sitzung nicht blockieren
});
```

2. **Hook in `hooks/hooks.json` konfigurieren**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/your-hook.js\""
    }
  ],
  "description": "Your custom hook description"
}
```

3. **Hook testen**

```bash
# Bedingung in Claude Code auslösen und Ausgabe prüfen
```

### Best Practices

#### 1. Fehlerbehandlung

```javascript
main().catch(err => {
  console.error('[HookName] Error:', err.message);
  process.exit(0); // Sitzung nicht blockieren
});
```

#### 2. Bibliotheksfunktionen verwenden

```javascript
const {
  log,
  readFile,
  writeFile,
  ensureDir
} = require('../lib/utils');
```

#### 3. Plattformübergreifende Pfade

```javascript
const path = require('path');
const filePath = path.join(getHomeDir(), '.claude', 'config.json');
```

#### 4. Umgebungsvariablen

```javascript
const sessionId = process.env.CLAUDE_SESSION_ID || 'default';
const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
```

## Skripte testen

### Hilfsfunktionen testen

```javascript
const { findFiles, readFile, writeFile } = require('./lib/utils');

// Dateisuche testen
const files = findFiles('/tmp', '*.tmp', { maxAge: 7 });
console.log('Found files:', files);

// Datei lesen/schreiben testen
writeFile('/tmp/test.txt', 'Hello, World!');
const content = readFile('/tmp/test.txt');
console.log('Content:', content);
```

### Paketmanager-Erkennung testen

```javascript
const { getPackageManager, getRunCommand } = require('./lib/package-manager');

const pm = getPackageManager();
console.log('Package manager:', pm.name);
console.log('Source:', pm.source);
console.log('Dev command:', getRunCommand('dev'));
```

### Hook-Skripte testen

```bash
# Hook-Skript direkt ausführen (Umgebungsvariablen erforderlich)
CLAUDE_SESSION_ID=test CLAUDE_TRANSCRIPT_PATH=/tmp/transcript.json \
  node scripts/hooks/session-start.js
```

## Debugging-Tipps

### 1. Log-Ausgabe verwenden

```javascript
const { log } = require('../lib/utils');

log('[Debug] Current value:', value);
```

### 2. Fehler abfangen

```javascript
try {
  // Potenziell fehlerhafter Code
} catch (err) {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
}
```

### 3. Dateipfade verifizieren

```javascript
const path = require('path');
const { existsSync } = require('fs');

const filePath = path.join(getHomeDir(), '.claude', 'config.json');
console.log('Config path:', filePath);
console.log('Exists:', existsSync(filePath));
```

### 4. Hook-Ausführungsprotokolle anzeigen

```bash
# In Claude Code wird die stderr-Ausgabe des Hooks in der Antwort angezeigt
# Suchen Sie nach Protokollen mit dem Präfix [HookName]
```

## Häufige Fragen

### F1: Hook-Skript wird nicht ausgeführt?

**Mögliche Ursachen**:
1. Matcher-Konfiguration in `hooks/hooks.json` ist fehlerhaft
2. Skriptpfad ist falsch
3. Skript hat keine Ausführungsberechtigung

**Fehlerbehebungsschritte**:
```bash
# Skriptpfad prüfen
ls -la scripts/hooks/

# Skript manuell zum Testen ausführen
node scripts/hooks/session-start.js

# hooks.json-Syntax verifizieren
cat hooks/hooks.json | jq '.'
```

### F2: Pfadfehler unter Windows?

**Ursache**: Windows verwendet Backslashes, während Unix Forward-Slashes verwendet

**Lösung**:
```javascript
// ❌ Falsch: Hartcodierter Pfadtrenner
const path = 'C:\\Users\\username\\.claude';

// ✅ Richtig: path.join() verwenden
const path = require('path');
const claudePath = path.join(getHomeDir(), '.claude');
```

### F3: Wie debugge ich Hook-Eingaben?

**Methode**: Hook-Eingabe in temporäre Datei schreiben

```javascript
const { writeFileSync } = require('fs');
const path = require('path');

async function main() {
  const hookInput = await readStdinJson();
  
  // In Debug-Datei schreiben
  const debugPath = path.join(getTempDir(), 'hook-debug.json');
  writeFileSync(debugPath, JSON.stringify(hookInput, null, 2));
  
  console.error('[Debug] Input saved to:', debugPath);
}
```

## Zusammenfassung

Dieses Tutorial hat die Scripts API von Everything Claude Code systematisch erklärt:

**Kernmodule**:
- `lib/utils.js`: Plattformübergreifende Hilfsfunktionen (Plattformerkennung, Dateioperationen, Systembefehle)
- `lib/package-manager.js`: Paketmanager-Erkennung und Konfigurations-API
- `setup-package-manager.js`: CLI-Konfigurationstool

**Hook-Skripte**:
- `session-start.js`: Lädt Kontext beim Sitzungsstart
- `session-end.js`: Speichert Status beim Sitzungsende
- `pre-compact.js`: Speichert Status vor der Komprimierung
- `suggest-compact.js`: Schlägt manuelle Komprimierungszeitpunkte vor
- `evaluate-session.js`: Bewertet Sitzung zur Musterextraktion

**Best Practices**:
- Bibliotheksfunktionen für plattformübergreifende Kompatibilität verwenden
- Hook-Skripte blockieren die Sitzung nicht (Exit-Code 0 bei Fehlern)
- `log()` für Debug-Ausgaben verwenden
- `process.env` zum Lesen von Umgebungsvariablen verwenden

**Debugging-Tipps**:
- Skripte direkt zum Testen ausführen
- Temporäre Dateien für Debug-Daten verwenden
- Matcher-Konfiguration und Skriptpfade prüfen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Test-Suite: Ausführung und Anpassung](../test-suite/)**.
>
> Sie werden lernen:
> - Wie man die Test-Suite ausführt
> - Wie man Unit-Tests für Hilfsfunktionen schreibt
> - Wie man Integrationstests für Hook-Skripte schreibt
> - Wie man benutzerdefinierte Testfälle hinzufügt

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktionsmodul | Dateipfad | Zeilen |
| --- | --- | --- |
| Allgemeine Hilfsfunktionen | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| Paketmanager-API | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-391 |
| Paketmanager-Setup-Skript | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js) | 1-207 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |

**Wichtige Konstanten**:
- `DETECTION_PRIORITY = ['pnpm', 'bun', 'yarn', 'npm']`: Paketmanager-Erkennungspriorität (`scripts/lib/package-manager.js:57`)
- `COMPACT_THRESHOLD`: Komprimierungsvorschlags-Schwellenwert (Standard 50, über Umgebungsvariable überschreibbar)

**Wichtige Funktionen**:
- `getPackageManager()`: Erkennt und wählt Paketmanager (`scripts/lib/package-manager.js:157`)
- `findFiles()`: Plattformübergreifende Dateisuche (`scripts/lib/utils.js:102`)
- `readStdinJson()`: Liest Hook-Eingabe (`scripts/lib/utils.js:154`)
- `commandExists()`: Prüft, ob Befehl existiert (`scripts/lib/utils.js:228`)

**Umgebungsvariablen**:
- `CLAUDE_PACKAGE_MANAGER`: Erzwingt bestimmten Paketmanager
- `CLAUDE_SESSION_ID`: Sitzungs-ID
- `CLAUDE_TRANSCRIPT_PATH`: Pfad zur Sitzungsaufzeichnungsdatei
- `COMPACT_THRESHOLD`: Komprimierungsvorschlags-Schwellenwert

**Plattformerkennung**:
- `process.platform === 'win32'`: Windows
- `process.platform === 'darwin'`: macOS
- `process.platform === 'linux'`: Linux

</details>
