---
title: "Testsuite: Ausführung und Anpassung | everything-claude-code"
sidebarTitle: "Alle Tests ausführen"
subtitle: "Testsuite: Ausführung und Anpassung"
description: "Lernen Sie, wie Sie die Testsuite von everything-claude-code ausführen. Umfasst 56 Testfälle für utils-, package-manager- und hooks-Module mit plattformübergreifenden Tests, Framework-Nutzung und benutzerdefinierten Testschritten."
tags:
  - "testing"
  - "test-suite"
  - "qa"
prerequisite:
  - "start-installation"
order: 220
---

# Testsuite: Ausführung und Anpassung

Everything Claude Code enthält eine vollständige Testsuite zur Überprüfung der Korrektheit von Skripten und Hilfsfunktionen. Dieser Artikel erklärt die Ausführungsmethode der Testsuite, den Abdeckungsumfang und das Hinzufügen benutzerdefinierter Tests.

## Was ist eine Testsuite?

Eine **Testsuite** ist eine Sammlung von automatisierten Testskripten und Testfällen zur Verifizierung der funktionalen Korrektheit von Software. Die Testsuite von Everything Claude Code enthält 56 Testfälle, die plattformübergreifende Hilfsfunktionen, Paketmanager-Erkennung und Hook-Skripte abdecken und sicherstellen, dass alles auf verschiedenen Betriebssystemen einwandfrei funktioniert.

::: info Warum wird eine Testsuite benötigt?

Die Testsuite stellt sicher, dass beim Hinzufügen neuer Funktionen oder beim Ändern von vorhandenem Code nicht versehentlich bestehende Funktionen beschädigt werden. Besonders für plattformübergreifende Node.js-Skripte können Tests die Konsistenz des Verhaltens auf verschiedenen Betriebssystemen verifizieren.

:::

---

## Überblick über die Testsuite

Die Testsuite befindet sich im Verzeichnis `tests/` und enthält die folgende Struktur:

```
tests/
├── lib/                          # Bibliothekstests
│   ├── utils.test.js              # Plattformübergreifende Hilfsfunktionen-Tests (21 Tests)
│   └── package-manager.test.js    # Paketmanager-Erkennungs-Tests (21 Tests)
├── hooks/                        # Hook-Skript-Tests
│   └── hooks.test.js             # Hook-Skript-Tests (14 Tests)
└── run-all.js                    # Haupttest-Runner
```

**Testabdeckung**:

| Modul | Anzahl Tests | Abgedeckter Inhalt |
|--- | --- | ---|
| `utils.js` | 21 | Plattform-Erkennung, Verzeichnisoperationen, Dateioperationen, Datum/Uhrzeit, Systembefehle |
| `package-manager.js` | 21 | Paketmanager-Erkennung, Befehlsgenerierung, Prioritätslogik |
| Hook-Skripte | 14 | Session-Lebenszyklus, Komprimierungsvorschläge, Session-Bewertung, hooks.json-Validierung |
| **Gesamt** | **56** | Vollständige Funktionsverifizierung |

---

## Tests ausführen

### Alle Tests ausführen

Führen Sie im Stammverzeichnis des Plugins Folgendes aus:

```bash
node tests/run-all.js
```

**Sie sollten sehen**:

```
╔════════════════════════════════════════════════════════╗
║           Everything Claude Code - Test Suite            ║
╚════════════════════════════════════════════════════════╝

━━━━ Running lib/utils.test.js ━━━

=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ✓ getTempDir returns valid temp directory
  ✓ ensureDir creates directory

...

=== Test Results ===
Passed: 21
Failed: 0
Total:  21

╔════════════════════════════════════════════════════════╗
║                     Final Results                        ║
╠════════════════════════════════════════════════════════╣
║  Total Tests:   56                                      ║
║  Passed:       56  ✓                                   ║
║  Failed:        0                                       ║
╚════════════════════════════════════════════════════════╝
```

### Einzelne Testdatei ausführen

Wenn Sie nur ein bestimmtes Modul testen möchten, können Sie die Testdatei separat ausführen:

```bash
# utils.js testen
node tests/lib/utils.test.js

# package-manager.js testen
node tests/lib/package-manager.test.js

# Hook-Skripte testen
node tests/hooks/hooks.test.js
```

**Sie sollten sehen** (am Beispiel von utils.test.js):

```
=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ...

File Operations:
  ✓ readFile returns null for non-existent file
  ✓ writeFile and readFile work together
  ✓ appendFile adds content to file
  ✓ replaceInFile replaces text
  ✓ countInFile counts occurrences
  ✓ grepFile finds matching lines

System Functions:
  ✓ commandExists finds node
  ✓ commandExists returns false for fake command
  ✓ runCommand executes simple command
  ✓ runCommand handles failed command

=== Test Results ===
Passed: 21
Failed: 0
Total:  21
```

---

## Testframework-Erklärung

Die Testsuite verwendet ein benutzerdefiniertes, leichtgewichtiges Testframework ohne externe Abhängigkeiten. Jede Testdatei enthält die folgenden Komponenten:

### Hilfsfunktionen für Tests

```javascript
// Synchroner Hilfsfunktion für Tests
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

// Asynchroner Hilfsfunktion für Tests
async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}
```

### Test-Assertions

Verwenden Sie das integrierte `assert`-Modul von Node.js für Assertions:

```javascript
const assert = require('assert');

// Gleichheits-Assertion
assert.strictEqual(actual, expected, 'message');

// Boolesche Assertion
assert.ok(condition, 'message');

// Array/Objekt-Einschluss
assert.ok(array.includes(item), 'message');

// Regex-Match
assert.ok(regex.test(string), 'message');
```

---

## Detaillierte Erklärung der Testmodule

### lib/utils.test.js

Testet die plattformübergreifenden Hilfsfunktionen von `scripts/lib/utils.js`.

**Testkategorien**:

| Kategorie | Anzahl Tests | Abgedeckte Funktionen |
|--- | --- | ---|
| Plattform-Erkennung | 2 | `isWindows`, `isMacOS`, `isLinux` |
| Verzeichnisfunktionen | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| Datum/Uhrzeit | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| Dateioperationen | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| Systemfunktionen | 5 | `commandExists`, `runCommand` |

**Wichtiges Testbeispiel**:

```javascript
// Dateioperationen testen
test('writeFile and readFile work together', () => {
  const testFile = path.join(utils.getTempDir(), `utils-test-${Date.now()}.txt`);
  const testContent = 'Hello, World!';
  try {
    utils.writeFile(testFile, testContent);
    const read = utils.readFile(testFile);
    assert.strictEqual(read, testContent);
  } finally {
    fs.unlinkSync(testFile);
  }
});
```

### lib/package-manager.test.js

Testet die Erkennungs- und Auswahllogik für Paketmanager von `scripts/lib/package-manager.js`.

**Testkategorien**:

| Kategorie | Anzahl Tests | Abgedeckte Funktionen |
|--- | --- | ---|
| Paketmanager-Konstanten | 2 | `PACKAGE_MANAGERS`, Eigenschaften-Vollständigkeit |
| Lock file-Erkennung | 5 | npm, pnpm, yarn, bun lock file-Erkennung |
| package.json-Erkennung | 4 | `packageManager`-Feld-Parsing |
| Verfügbare Paketmanager | 1 | System-Paketmanager-Erkennung |
| Paketmanager-Auswahl | 3 | Umgebungsvariable, lock file, Projektkonfiguration-Priorität |
| Befehlsgenerierung | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**Wichtiges Testbeispiel**:

```javascript
// Erkennungspriorität testen
test('respects environment variable', () => {
  const originalEnv = process.env.CLAUDE_PACKAGE_MANAGER;
  try {
    process.env.CLAUDE_PACKAGE_MANAGER = 'yarn';
    const result = pm.getPackageManager();
    assert.strictEqual(result.name, 'yarn');
    assert.strictEqual(result.source, 'environment');
  } finally {
    if (originalEnv !== undefined) {
      process.env.CLAUDE_PACKAGE_MANAGER = originalEnv;
    } else {
      delete process.env.CLAUDE_PACKAGE_MANAGER;
    }
  }
});
```

### hooks/hooks.test.js

Testet die Ausführung und Konfigurationsvalidierung von Hook-Skripten.

**Testkategorien**:

| Kategorie | Anzahl Tests | Abgedeckte Funktionen |
|--- | --- | ---|
| session-start.js | 2 | Ausführungserfolg, Ausgabeformat |
| session-end.js | 2 | Ausführungserfolg, Dateierstellung |
| pre-compact.js | 3 | Ausführungserfolg, Ausgabeformat, Protokollerstellung |
| suggest-compact.js | 3 | Ausführungserfolg, Zähler, Schwellenwert-Auslösung |
| evaluate-session.js | 3 | Kurze Session überspringen, lange Session behandeln, Nachrichtenzählung |
| hooks.json-Validierung | 4 | JSON-Gültigkeit, Ereignistypen, node-Präfix, Pfadvariablen |

**Wichtiges Testbeispiel**:

```javascript
// hooks.json-Konfiguration testen
test('all hook commands use node', () => {
  const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
  const hooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));

  const checkHooks = (hookArray) => {
    for (const entry of hookArray) {
      for (const hook of entry.hooks) {
        if (hook.type === 'command') {
          assert.ok(
            hook.command.startsWith('node'),
            `Hook command should start with 'node': ${hook.command.substring(0, 50)}...`
          );
        }
      }
    }
  };

  for (const [eventType, hookArray] of Object.entries(hooks.hooks)) {
    checkHooks(hookArray);
  }
});
```

---

## Neue Tests hinzufügen

### Testdatei erstellen

1. Erstellen Sie eine neue Testdatei im Verzeichnis `tests/`
2. Verwenden Sie die Hilfsfunktionen für Tests, um Testfälle zu verpacken
3. Verwenden Sie das `assert`-Modul für Assertions
4. Registrieren Sie die neue Testdatei in `run-all.js`

**Beispiel**: Erstellen einer neuen Testdatei `tests/lib/new-module.test.js`

```javascript
/**
 * Tests for scripts/lib/new-module.js
 *
 * Run with: node tests/lib/new-module.test.js
 */

const assert = require('assert');
const newModule = require('../../scripts/lib/new-module');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing new-module.js ===\n');

  let passed = 0;
  let failed = 0;

  // Ihre Testfälle
  if (test('basic functionality', () => {
    assert.strictEqual(newModule.test(), 'expected value');
  })) passed++; else failed++;

  // Zusammenfassung
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### In run-all.js registrieren

Fügen Sie die neue Testdatei in `tests/run-all.js` hinzu:

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // Diese Zeile hinzufügen
  'hooks/hooks.test.js'
];
```

---

## Best Practices für Tests

### 1. Try-finally zum Bereinigen von Ressourcen verwenden

Temporäre Dateien und Verzeichnisse, die während der Tests erstellt wurden, sollten bereinigt werden:

```javascript
✅ Korrekt:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // Testlogik
  } finally {
    fs.unlinkSync(testFile);  // Sicherstellen der Bereinigung
  }
});

❌ Falsch:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // Wenn der Test fehlschlägt, wird die Datei nicht bereinigt
  fs.unlinkSync(testFile);
});
```

### 2. Testumgebung isolieren

Jeder Test sollte einen eindeutigen temporären Dateinamen verwenden, um gegenseitige Störungen zu vermeiden:

```javascript
✅ Korrekt:
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ Falsch:
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. Beschreibende Testnamen verwenden

Testnamen sollten klar angeben, was getestet wird:

```javascript
✅ Korrekt:
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ Falsch:
test('test1', () => { ... });
```

### 4. Randbedingungen testen

Testen Sie nicht nur normale Fälle, sondern auch Grenzwerte und Fehlerfälle:

```javascript
// Normale Fälle testen
test('detects npm from package-lock.json', () => { ... });

// Leeres Verzeichnis testen
test('returns null when no lock file exists', () => { ... });

// Mehrere Lock-Dateien testen
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. Eingabesicherheit verifizieren

Für Funktionen, die Eingaben akzeptieren, sollten Tests die Sicherheit verifizieren:

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## Häufig gestellte Fragen

### Was tun, wenn Tests fehlschlagen?

1. Überprüfen Sie die spezifische Fehlermeldung
2. Überprüfen Sie, ob die Testlogik korrekt ist
3. Verifizieren Sie, ob die getestete Funktion einen Bug enthält
4. Führen Sie die Tests auf verschiedenen Betriebssystemen aus (plattformübergreifende Kompatibilität)

### Warum gibt die Testdatei `Passed: X Failed: Y` mit einem Zeilenumbruch aus?

Dies ist für die Kompatibilität mit der Ergebnis-Parsing von `run-all.js`. Testdateien müssen ein bestimmtes Format ausgeben:

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### Können andere Testframeworks verwendet werden?

Ja, aber Sie müssen `run-all.js` ändern, um das Ausgabeformat des neuen Frameworks zu unterstützen. Derzeit wird ein benutzerdefiniertes, leichtgewichtiges Framework verwendet, das für einfache Testszenarien geeignet ist.

---

## Zusammenfassung

Die Testsuite ist ein wichtiger Bestandteil der Qualitätssicherung von Everything Claude Code. Durch das Ausführen von Tests können Sie sicherstellen:

- ✅ Plattformübergreifende Hilfsfunktionen funktionieren auf verschiedenen Betriebssystemen korrekt
- ✅ Paketmanager-Erkennungslogik verarbeitet alle Prioritäten korrekt
- ✅ Hook-Skripte erstellen und aktualisieren Dateien korrekt
- ✅ Konfigurationsdateien sind korrekt und vollständig formatiert

**Merkmale der Testsuite**:
- Leichtgewichtig: Keine externen Abhängigkeiten
- Vollständige Abdeckung: 56 Testfälle
- Plattformübergreifend: Unterstützt Windows, macOS, Linux
- Einfach zu erweitern: Hinzufügen neuer Tests erfordert nur wenige Zeilen Code

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir das **[Beitragshandbuch](../contributing/)** kennen.
>
> Sie werden lernen:
> - Wie Sie Konfigurationen, Agents und Skills zum Projekt beitragen
> - Best Practices für Code-Beiträge
> - Der Ablauf für das Einreichen von Pull Requests

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-25

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Test-Runner | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| utils-Tests | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
|--- | --- | ---|
| hooks-Tests | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| utils-Modul | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
|--- | --- | ---|

**Wichtige Funktionen**:

**run-all.js**:
- `execSync()`: Führt einen Unterprozess aus und erhält die Ausgabe (Zeile 8)
- Testdatei-Array: `testFiles` definiert alle Testdateipfade (Zeilen 13-17)
- Ergebnis-Parsing: Extrahiert `Passed`- und `Failed`-Zählungen aus der Ausgabe (Zeilen 46-62)

**Hilfsfunktionen für Tests**:
- `test()`: Synchroner Test-Wrapper, fängt Ausnahmen ab und gibt Ergebnisse aus
- `asyncTest()`: Asynchroner Test-Wrapper, unterstützt Promise-Tests

**utils.js**:
- Plattform-Erkennung: `isWindows`, `isMacOS`, `isLinux` (Zeilen 12-14)
- Verzeichnisfunktionen: `getHomeDir()`, `getClaudeDir()`, `getSessionsDir()` (Zeilen 19-35)
- Dateioperationen: `readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()` (Zeilen 200-343)
- Systemfunktionen: `commandExists()`, `runCommand()` (Zeilen 228-269)

**package-manager.js**:
- `PACKAGE_MANAGERS`: Paketmanager-Konfigurationskonstanten (Zeilen 13-54)
- `DETECTION_PRIORITY`: Reihenfolge der Erkennungspriorität (Zeile 57)
- `getPackageManager()`: Wählt den Paketmanager basierend auf Priorität (Zeilen 157-236)
- `getRunCommand()`: Generiert den Befehl zum Ausführen von Skripten (Zeilen 279-294)
- `getExecCommand()`: Generiert den Befehl zum Ausführen von Paketen (Zeilen 301-304)

</details>
