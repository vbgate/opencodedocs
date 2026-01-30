---
title: "Hooks-Automatisierung: 15+ Hooks erklärt | Everything Claude Code"
sidebarTitle: "Claude automatisch arbeiten lassen"
subtitle: "Hooks-Automatisierung: 15+ Hooks im Detail"
description: "Lernen Sie die 15+ Automatisierungs-Hooks von Everything Claude Code. Dieses Tutorial erklärt 6 Hook-Typen, 14 Kernfunktionen und Node.js-Skript-Implementierungen."
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# Hooks-Automatisierung: 15+ Hooks im Detail

## Was Sie lernen werden

- Die 6 Hook-Typen von Claude Code und ihre Auslösemechanismen verstehen
- Die Funktionen und Konfigurationsmethoden der 14 integrierten Hooks beherrschen
- Node.js-Skripte zur Anpassung von Hooks verwenden lernen
- Kontext automatisch beim Sitzungsstart/-ende speichern und laden
- Automatisierungsfunktionen wie intelligente Komprimierungsvorschläge und automatische Code-Formatierung implementieren

## Ihre aktuelle Herausforderung

Sie möchten, dass Claude Code bei bestimmten Ereignissen automatisch Aktionen ausführt, zum Beispiel:
- Beim Sitzungsstart automatisch den vorherigen Kontext laden
- Nach jeder Code-Bearbeitung automatisch formatieren
- Vor dem Code-Push eine Erinnerung zur Überprüfung der Änderungen erhalten
- Zum richtigen Zeitpunkt eine Kontextkomprimierung vorschlagen

Diese Funktionen erfordern jedoch manuelles Auslösen, oder Sie müssen das Hooks-System von Claude Code tiefgehend verstehen, um sie zu implementieren. Diese Lektion hilft Ihnen, diese Automatisierungsfähigkeiten zu beherrschen.

## Wann Sie diese Technik anwenden sollten

- Wenn Sie Kontext und Arbeitsstatus zwischen Sitzungen beibehalten müssen
- Wenn Sie automatische Code-Qualitätsprüfungen wünschen (Formatierung, TypeScript-Prüfung)
- Wenn Sie vor bestimmten Operationen Erinnerungen erhalten möchten (z.B. Änderungen vor git push prüfen)
- Wenn Sie die Token-Nutzung optimieren und den Kontext zum richtigen Zeitpunkt komprimieren müssen
- Wenn Sie wiederverwendbare Muster aus Sitzungen automatisch extrahieren möchten

## Kernkonzept

**Was sind Hooks**

**Hooks** sind ein Automatisierungsmechanismus von Claude Code, der benutzerdefinierte Skripte bei bestimmten Ereignissen auslösen kann. Sie funktionieren wie ein „Event-Listener", der vordefinierte Aktionen automatisch ausführt, wenn Bedingungen erfüllt sind.

::: info Wie Hooks funktionieren

```
Benutzeraktion → Ereignis auslösen → Hook prüfen → Skript ausführen → Ergebnis zurückgeben
      ↓               ↓                 ↓              ↓                  ↓
  Tool verwenden   PreToolUse    Bedingung prüfen  Node.js-Skript    Ausgabe in Konsole
```

Wenn Sie beispielsweise das Bash-Tool verwenden, um `npm run dev` auszuführen:
1. Der PreToolUse-Hook erkennt das Befehlsmuster
2. Wenn nicht in tmux, wird automatisch blockiert und ein Hinweis angezeigt
3. Sie sehen den Hinweis und starten auf die richtige Weise

:::

**6 Hook-Typen**

Everything Claude Code verwendet 6 Hook-Typen:

| Hook-Typ | Auslösezeitpunkt | Anwendungsfall |
| --- | --- | --- |
| **PreToolUse** | Vor der Ausführung eines Tools | Befehle validieren, Operationen blockieren, Vorschläge anzeigen |
| **PostToolUse** | Nach der Ausführung eines Tools | Automatische Formatierung, Typprüfung, Protokollierung |
| **PreCompact** | Vor der Kontextkomprimierung | Status speichern, Komprimierungsereignis protokollieren |
| **SessionStart** | Beim Start einer neuen Sitzung | Kontext laden, Paketmanager erkennen |
| **SessionEnd** | Beim Beenden einer Sitzung | Status speichern, Sitzung auswerten, Muster extrahieren |
| **Stop** | Am Ende jeder Antwort | Geänderte Dateien prüfen, Aufräum-Erinnerung |

::: tip Ausführungsreihenfolge der Hooks

Während eines vollständigen Sitzungslebenszyklus werden Hooks in folgender Reihenfolge ausgeführt:

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

Dabei wird `[PreToolUse → PostToolUse]` bei jeder Tool-Verwendung wiederholt ausgeführt.

:::

**Matching-Regeln für Hooks**

Jeder Hook verwendet einen `matcher`-Ausdruck, um zu entscheiden, ob er ausgeführt wird. Claude Code verwendet JavaScript-Ausdrücke, die Folgendes prüfen können:

- Tool-Typ: `tool == "Bash"`, `tool == "Edit"`
- Befehlsinhalt: `tool_input.command matches "npm run dev"`
- Dateipfad: `tool_input.file_path matches "\\.ts$"`
- Kombinierte Bedingungen: `tool == "Bash" && tool_input.command matches "git push"`

**Warum Node.js-Skripte**

Alle Hooks in Everything Claude Code werden mit Node.js-Skripten implementiert, nicht mit Shell-Skripten. Die Gründe sind:

| Vorteil | Shell-Skript | Node.js-Skript |
| --- | --- | --- |
| **Plattformübergreifend** | ❌ Erfordert Windows/macOS/Linux-Verzweigungen | ✅ Automatisch plattformübergreifend |
| **JSON-Verarbeitung** | ❌ Erfordert zusätzliche Tools (jq) | ✅ Native Unterstützung |
| **Dateioperationen** | ⚠️ Komplexe Befehle | ✅ Einfache fs-API |
| **Fehlerbehandlung** | ❌ Manuelle Implementierung erforderlich | ✅ Native try/catch-Unterstützung |

## Schritt für Schritt

### Schritt 1: Aktuelle Hooks-Konfiguration anzeigen

**Warum**
Die vorhandene Hooks-Konfiguration verstehen und wissen, welche Automatisierungsfunktionen bereits aktiviert sind

```bash
## hooks.json-Konfiguration anzeigen
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**Sie sollten sehen**: Eine JSON-Konfigurationsdatei mit Definitionen für 6 Hook-Typen

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### Schritt 2: PreToolUse-Hooks verstehen

**Warum**
PreToolUse ist der am häufigsten verwendete Hook-Typ und kann Operationen blockieren oder Hinweise geben

Schauen wir uns die 5 PreToolUse-Hooks in Everything Claude Code an:

#### 1. Tmux Dev Server Block

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Funktion**: Blockiert das Starten eines Dev-Servers außerhalb von tmux

**Warum nötig**: Das Ausführen des Dev-Servers in tmux ermöglicht das Trennen der Sitzung, sodass Sie Logs auch nach dem Schließen von Claude Code weiter einsehen können

#### 2. Git Push Reminder

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**Funktion**: Erinnert Sie vor `git push`, die Änderungen zu überprüfen

**Warum nötig**: Vermeidet versehentliches Committen von nicht überprüftem Code

#### 3. Block Random MD Files

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Funktion**: Blockiert die Erstellung von nicht-dokumentationsbezogenen .md-Dateien

**Warum nötig**: Vermeidet verstreute Dokumentation und hält das Projekt ordentlich

#### 4. Suggest Compact

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Funktion**: Schlägt beim Bearbeiten oder Schreiben von Dateien eine Kontextkomprimierung vor

**Warum nötig**: Manuelle Komprimierung zum richtigen Zeitpunkt, um den Kontext schlank zu halten

### Schritt 3: PostToolUse-Hooks verstehen

**Warum**
PostToolUse wird nach Abschluss einer Operation automatisch ausgeführt und eignet sich für automatisierte Qualitätsprüfungen

Everything Claude Code hat 4 PostToolUse-Hooks:

#### 1. Auto Format

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Funktion**: Führt nach dem Bearbeiten von .js/.ts/.jsx/.tsx-Dateien automatisch Prettier-Formatierung aus

**Warum nötig**: Hält den Code-Stil konsistent

#### 2. TypeScript Check

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Funktion**: Führt nach dem Bearbeiten von .ts/.tsx-Dateien automatisch TypeScript-Typprüfung aus

**Warum nötig**: Erkennt Typfehler frühzeitig

#### 3. Console.log Warning

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**Funktion**: Prüft nach dem Bearbeiten von Dateien auf console.log-Anweisungen

**Warum nötig**: Vermeidet das Committen von Debug-Code

#### 4. Log PR URL

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Funktion**: Gibt nach der PR-Erstellung automatisch die PR-URL und den Review-Befehl aus

**Warum nötig**: Ermöglicht schnellen Zugriff auf neu erstellte PRs

### Schritt 4: Sitzungslebenszyklus-Hooks verstehen

**Warum**
SessionStart- und SessionEnd-Hooks werden für die Kontextpersistenz zwischen Sitzungen verwendet

#### SessionStart-Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**Funktion**:
- Prüft Sitzungsdateien der letzten 7 Tage
- Prüft gelernte Skills
- Erkennt den Paketmanager
- Gibt ladbare Kontextinformationen aus

**Skriptlogik** (`session-start.js`):

```javascript
// Sitzungsdateien der letzten 7 Tage prüfen
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// Gelernte Skills prüfen
const learnedSkills = findFiles(learnedDir, '*.md');

// Paketmanager erkennen
const pm = getPackageManager();

// Bei Standardwert zur Auswahl auffordern
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### SessionEnd-Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**Funktion**:
- Erstellt oder aktualisiert Sitzungsdateien
- Zeichnet Start- und Endzeit der Sitzung auf
- Generiert Sitzungsvorlagen (Completed, In Progress, Notes)

**Sitzungsdateivorlage** (`session-end.js`):

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

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
[relevant files]
```

Die Platzhalter `[Session context goes here]` und `[relevant files]` in der Vorlage müssen manuell mit dem tatsächlichen Sitzungsinhalt und relevanten Dateien ausgefüllt werden.

### Schritt 5: Komprimierungsbezogene Hooks verstehen

**Warum**
PreCompact- und Stop-Hooks werden für Kontextmanagement und Komprimierungsentscheidungen verwendet

#### PreCompact-Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**Funktion**:
- Protokolliert Komprimierungsereignisse im Log
- Markiert den Zeitpunkt der Komprimierung in der aktiven Sitzungsdatei

**Skriptlogik** (`pre-compact.js`):

```javascript
// Komprimierungsereignis protokollieren
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// In Sitzungsdatei markieren
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Stop-Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**Funktion**: Prüft alle geänderten Dateien auf console.log

**Warum nötig**: Als letzte Verteidigungslinie, um das Committen von Debug-Code zu vermeiden

### Schritt 6: Kontinuierliches Lernen-Hook verstehen

**Warum**
Der Evaluate Session-Hook wird verwendet, um wiederverwendbare Muster aus Sitzungen zu extrahieren

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**Funktion**:
- Liest das Sitzungsprotokoll (Transcript)
- Zählt die Anzahl der Benutzernachrichten
- Wenn die Sitzung lang genug ist (Standard > 10 Nachrichten), wird zur Auswertung extrahierbarer Muster aufgefordert

**Skriptlogik** (`evaluate-session.js`):

```javascript
// Konfiguration lesen
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// Benutzernachrichten zählen
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// Kurze Sitzungen überspringen
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// Zur Auswertung auffordern
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### Schritt 7: Benutzerdefinierte Hooks

**Warum**
Erstellen Sie eigene Automatisierungsregeln basierend auf Projektanforderungen

**Beispiel: Gefährliche Befehle in Produktionsumgebung blockieren**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**Konfigurationsschritte**:

1. Benutzerdefiniertes Hook-Skript erstellen:
   ```bash
   # scripts/hooks/custom-hook.js erstellen
   vi scripts/hooks/custom-hook.js
   ```

2. `~/.claude/settings.json` bearbeiten:
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. Claude Code neu starten

**Sie sollten sehen**: Ausgabeinformationen bei Hook-Auslösung

## Checkliste ✅

Bestätigen Sie, dass Sie folgende Punkte verstanden haben:

- [ ] Hooks sind ein ereignisgesteuerter Automatisierungsmechanismus
- [ ] Claude Code hat 6 Hook-Typen
- [ ] PreToolUse wird vor der Tool-Ausführung ausgelöst und kann Operationen blockieren
- [ ] PostToolUse wird nach der Tool-Ausführung ausgelöst und eignet sich für automatisierte Prüfungen
- [ ] SessionStart/SessionEnd werden für die Kontextpersistenz zwischen Sitzungen verwendet
- [ ] Everything Claude Code verwendet Node.js-Skripte für plattformübergreifende Kompatibilität
- [ ] Benutzerdefinierte Hooks können durch Bearbeiten von `~/.claude/settings.json` hinzugefügt werden

## Häufige Fehler

### ❌ Fehler im Hook-Skript führt zum Einfrieren der Sitzung

**Problem**: Das Hook-Skript wirft eine Ausnahme und beendet sich nicht korrekt, was dazu führt, dass Claude Code auf einen Timeout wartet

**Ursache**: Fehler im Node.js-Skript werden nicht korrekt abgefangen

**Lösung**:
```javascript
// Fehlerbeispiel
main();  // Wenn eine Ausnahme geworfen wird, verursacht dies Probleme

// Korrektes Beispiel
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // Auch bei Fehlern normal beenden
});
```

### ❌ Shell-Skripte verursachen plattformübergreifende Probleme

**Problem**: Bei der Ausführung unter Windows schlagen Shell-Skripte fehl

**Ursache**: Shell-Befehle sind auf verschiedenen Betriebssystemen nicht kompatibel

**Lösung**: Verwenden Sie Node.js-Skripte anstelle von Shell-Skripten

| Funktion | Shell-Skript | Node.js-Skript |
| --- | --- | --- |
| Datei lesen | `cat file.txt` | `fs.readFileSync('file.txt')` |
| Verzeichnis prüfen | `[ -d dir ]` | `fs.existsSync(dir)` |
| Umgebungsvariable | `$VAR` | `process.env.VAR` |

### ❌ Zu viel Hook-Ausgabe führt zur Kontextaufblähung

**Problem**: Jede Operation gibt große Mengen an Debug-Informationen aus, was zu einer schnellen Kontextaufblähung führt

**Ursache**: Das Hook-Skript verwendet zu viele console.log-Aufrufe

**Lösung**:
- Nur notwendige Informationen ausgeben
- `console.error` für wichtige Hinweise verwenden (wird von Claude Code hervorgehoben)
- Bedingte Ausgabe verwenden, nur bei Bedarf drucken

```javascript
// Fehlerbeispiel
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // Zu viel Ausgabe

// Korrektes Beispiel
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ PreToolUse-Hook blockiert notwendige Operationen

**Problem**: Die Matching-Regeln des Hooks sind zu breit gefasst und blockieren versehentlich normale Operationen

**Ursache**: Der Matcher-Ausdruck passt nicht genau zum Szenario

**Lösung**:
- Die Genauigkeit des Matcher-Ausdrucks testen
- Weitere Bedingungen hinzufügen, um den Auslösebereich einzuschränken
- Klare Fehlermeldungen und Lösungsvorschläge bereitstellen

```json
// Fehlerbeispiel: Passt auf alle npm-Befehle
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// Korrektes Beispiel: Passt nur auf dev-Befehl
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## Zusammenfassung

**Übersicht der 6 Hook-Typen**:

| Hook-Typ | Auslösezeitpunkt | Typische Verwendung | Anzahl in Everything Claude Code |
| --- | --- | --- | --- |
| PreToolUse | Vor Tool-Ausführung | Validieren, Blockieren, Hinweisen | 5 |
| PostToolUse | Nach Tool-Ausführung | Formatieren, Prüfen, Protokollieren | 4 |
| PreCompact | Vor Kontextkomprimierung | Status speichern | 1 |
| SessionStart | Bei Sitzungsstart | Kontext laden, PM erkennen | 1 |
| SessionEnd | Bei Sitzungsende | Status speichern, Sitzung auswerten | 2 |
| Stop | Bei Antwortende | Änderungen prüfen | 1 |

**Kernpunkte**:

1. **Hooks sind ereignisgesteuert**: Automatische Ausführung bei bestimmten Ereignissen
2. **Matcher bestimmt Auslösung**: JavaScript-Ausdrücke für Bedingungsabgleich
3. **Node.js-Skript-Implementierung**: Plattformübergreifende Kompatibilität, Shell-Skripte vermeiden
4. **Fehlerbehandlung ist wichtig**: Skripte müssen auch bei Fehlern normal beenden
5. **Ausgabe minimieren**: Zu viele Logs vermeiden, um Kontextaufblähung zu verhindern
6. **Konfiguration in settings.json**: Benutzerdefinierte Hooks durch Bearbeiten von `~/.claude/settings.json` hinzufügen

**Best Practices**:

```
1. PreToolUse zur Validierung gefährlicher Operationen verwenden
2. PostToolUse für automatisierte Qualitätsprüfungen verwenden
3. SessionStart/End für Kontextpersistenz verwenden
4. Bei benutzerdefinierten Hooks zuerst den Matcher-Ausdruck testen
5. try/catch und process.exit(0) in Skripten verwenden
6. Nur notwendige Informationen ausgeben, Kontextaufblähung vermeiden
```

## Vorschau der nächsten Lektion

> In der nächsten Lektion lernen wir den **[Kontinuierlichen Lernmechanismus](../continuous-learning/)**.
>
> Sie werden lernen:
> - Wie Continuous Learning automatisch wiederverwendbare Muster extrahiert
> - Den `/learn`-Befehl zur manuellen Musterextraktion verwenden
> - Die Mindestlänge für Sitzungsauswertung konfigurieren
> - Das Verzeichnis für gelernte Skills verwalten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Hooks-Hauptkonfiguration | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| SessionStart-Skript | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd-Skript | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact-Skript | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact-Skript | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session-Skript | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Hilfsbibliothek | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| Paketmanager-Erkennung | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**Wichtige Konstanten**:
- Keine (Konfiguration wird dynamisch geladen)

**Wichtige Funktionen**:
- `getSessionsDir()`: Gibt den Pfad zum Sitzungsverzeichnis zurück
- `getLearnedSkillsDir()`: Gibt den Pfad zum Verzeichnis für gelernte Skills zurück
- `findFiles(dir, pattern, options)`: Findet Dateien, unterstützt Zeitfilterung
- `ensureDir(path)`: Stellt sicher, dass das Verzeichnis existiert, erstellt es bei Bedarf
- `getPackageManager()`: Erkennt den Paketmanager (unterstützt 6 Prioritätsstufen)
- `log(message)`: Gibt Hook-Protokollnachrichten aus

**Wichtige Konfigurationen**:
- `min_session_length`: Mindestanzahl an Nachrichten für Sitzungsauswertung (Standard 10)
- `COMPACT_THRESHOLD`: Schwellenwert für Tool-Aufrufe zur Komprimierungsempfehlung (Standard 50)
- `CLAUDE_PLUGIN_ROOT`: Umgebungsvariable für das Plugin-Stammverzeichnis

**14 Kern-Hooks**:
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>
