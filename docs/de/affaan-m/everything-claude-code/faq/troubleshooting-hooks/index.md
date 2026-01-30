---
title: "Fehlerbehebung: Hooks-Probleme | Everything Claude Code"
sidebarTitle: "Hooks-Probleme in 5 Minuten beheben"
subtitle: "Fehlerbehebung: Hooks-Probleme | Everything Claude Code"
description: "Lernen Sie die systematische Fehlerbehebung für Hooks. Diagnostizieren Sie Umgebungsvariablen, Berechtigungen und JSON-Syntaxprobleme, um SessionStart/End und PreToolUse zuverlässig zum Laufen zu bringen."
tags:
  - "hooks"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "advanced-hooks-automation"
order: 150
---

# Was tun, wenn Hooks nicht funktionieren

## Das Problem, das Sie haben

Sie haben Hooks konfiguriert, aber sie funktionieren nicht wie erwartet? Möglicherweise erleben Sie folgende Situationen:

- Der Dev-Server wird nicht daran gehindert, außerhalb von tmux zu laufen
- Sie sehen keine Logs für SessionStart oder SessionEnd
- Die automatische Prettier-Formatierung funktioniert nicht
- TypeScript-Prüfungen werden nicht ausgeführt
- Sie sehen seltsame Fehlermeldungen

Keine Sorge, diese Probleme haben in der Regel klare Lösungen. Diese Lektion hilft Ihnen, Hooks-Probleme systematisch zu diagnostizieren und zu beheben.

## 🎒 Vorbereitung

::: warning Voraussetzungen prüfen
Stellen Sie sicher, dass Sie:
1. ✅ Die [Installation](../../start/installation/) von Everything Claude Code abgeschlossen haben
2. ✅ Die Grundkonzepte der [Hooks-Automatisierung](../../advanced/hooks-automation/) verstehen
3. ✅ Die Hooks-Konfigurationsanleitung in der Projekt-README gelesen haben
:::

---

## Häufiges Problem 1: Hooks werden überhaupt nicht ausgelöst

### Symptome
Nach der Befehlsausführung sehen Sie keine `[Hook]`-Logausgabe, Hooks scheinen überhaupt nicht aufgerufen zu werden.

### Mögliche Ursachen

#### Ursache A: Falscher hooks.json-Pfad

**Problem**: `hooks.json` befindet sich nicht am richtigen Ort, Claude Code kann die Konfigurationsdatei nicht finden.

**Lösung**:

Überprüfen Sie, ob `hooks.json` am richtigen Ort liegt:

```bash
# Sollte an einem der folgenden Orte sein:
~/.claude/hooks/hooks.json              # Benutzer-Konfiguration (global)
.claude/hooks/hooks.json                 # Projekt-Konfiguration
```

**Überprüfungsmethode**:

```bash
# Benutzer-Konfiguration anzeigen
ls -la ~/.claude/hooks/hooks.json

# Projekt-Konfiguration anzeigen
ls -la .claude/hooks/hooks.json
```

**Falls die Datei nicht existiert**, kopieren Sie sie aus dem Everything Claude Code Plugin-Verzeichnis:

```bash
# Angenommen, das Plugin ist in ~/.claude-plugins/ installiert
cp ~/.claude-plugins/everything-claude-code/hooks/hooks.json ~/.claude/hooks/
```

#### Ursache B: JSON-Syntaxfehler

**Problem**: `hooks.json` enthält Syntaxfehler, Claude Code kann die Datei nicht parsen.

**Lösung**:

JSON-Format validieren:

```bash
# JSON-Syntax mit jq oder Python validieren
jq empty ~/.claude/hooks/hooks.json
# oder
python3 -m json.tool ~/.claude/hooks/hooks.json > /dev/null
```

**Häufige Syntaxfehler**:
- Fehlende Kommas
- Nicht geschlossene Anführungszeichen
- Verwendung von einfachen Anführungszeichen (es müssen doppelte sein)
- Falsches Kommentarformat (JSON unterstützt keine `//`-Kommentare)

#### Ursache C: Umgebungsvariable CLAUDE_PLUGIN_ROOT nicht gesetzt

**Problem**: Hook-Skripte verwenden `${CLAUDE_PLUGIN_ROOT}` für Pfadreferenzen, aber die Umgebungsvariable ist nicht gesetzt.

**Lösung**:

Überprüfen Sie, ob der Plugin-Installationspfad korrekt ist:

```bash
# Installierte Plugin-Pfade anzeigen
ls -la ~/.claude-plugins/
```

Stellen Sie sicher, dass das Everything Claude Code Plugin korrekt installiert ist:

```bash
# Sie sollten ein Verzeichnis wie dieses sehen
~/.claude-plugins/everything-claude-code/
├── scripts/
├── hooks/
├── agents/
└── ...
```

**Bei Installation über den Plugin-Marktplatz** wird die Umgebungsvariable nach dem Neustart von Claude Code automatisch gesetzt.

**Bei manueller Installation** überprüfen Sie den Plugin-Pfad in `~/.claude/settings.json`:

```json
{
  "plugins": [
    {
      "name": "everything-claude-code",
      "path": "/path/to/everything-claude-code"
    }
  ]
}
```

---

## Häufiges Problem 2: Bestimmte Hooks werden nicht ausgelöst

### Symptome
Einige Hooks funktionieren (z.B. SessionStart), aber andere werden nicht ausgelöst (z.B. PreToolUse-Formatierung).

### Mögliche Ursachen

#### Ursache A: Falscher Matcher-Ausdruck

**Problem**: Der `matcher`-Ausdruck des Hooks ist fehlerhaft, die Übereinstimmungsbedingung wird nicht erfüllt.

**Lösung**:

Überprüfen Sie die Matcher-Syntax in `hooks.json`:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\""
}
```

**Hinweise**:
- Werkzeugnamen müssen in doppelten Anführungszeichen stehen: `"Edit"`, `"Bash"`
- Backslashes in regulären Ausdrücken müssen doppelt escaped werden: `\\\\.` statt `\\.`
- Dateipfad-Matching verwendet das Schlüsselwort `matches`

**Matcher testen**:

Sie können die Matching-Logik manuell testen:

```bash
# Dateipfad-Matching testen
node -e "console.log(/\\\\.(ts|tsx)$/.test('src/index.ts'))"
# Sollte ausgeben: true
```

#### Ursache B: Befehlsausführung fehlgeschlagen

**Problem**: Der Hook-Befehl selbst schlägt fehl, aber es gibt keine Fehlermeldung.

**Lösung**:

Hook-Befehl manuell zum Testen ausführen:

```bash
# In das Plugin-Verzeichnis wechseln
cd ~/.claude-plugins/everything-claude-code

# Ein Hook-Skript manuell ausführen
node scripts/hooks/session-start.js

# Auf Fehlerausgabe prüfen
```

**Häufige Fehlerursachen**:
- Inkompatible Node.js-Version (Node.js 14+ erforderlich)
- Fehlende Abhängigkeiten (z.B. prettier, typescript nicht installiert)
- Skript-Berechtigungsprobleme (siehe unten)

---

## Häufiges Problem 3: Berechtigungsprobleme (Linux/macOS)

### Symptome
Sie sehen einen Fehler wie diesen:

```
Permission denied: node scripts/hooks/session-start.js
```

### Lösung

Ausführungsberechtigungen für Hook-Skripte hinzufügen:

```bash
# In das Plugin-Verzeichnis wechseln
cd ~/.claude-plugins/everything-claude-code

# Ausführungsberechtigungen für alle Hooks-Skripte hinzufügen
chmod +x scripts/hooks/*.js

# Berechtigungen überprüfen
ls -la scripts/hooks/
# Sie sollten etwas wie: -rwxr-xr-x  session-start.js sehen
```

**Alle Skripte auf einmal reparieren**:

```bash
# Alle .js-Dateien unter scripts reparieren
find ~/.claude-plugins/everything-claude-code/scripts -name "*.js" -exec chmod +x {} \;
```

---

## Häufiges Problem 4: Plattformübergreifende Kompatibilitätsprobleme

### Symptome
Funktioniert unter Windows, aber nicht unter macOS/Linux; oder umgekehrt.

### Mögliche Ursachen

#### Ursache A: Pfadtrennzeichen

**Problem**: Windows verwendet Backslash `\`, Unix verwendet Forward-Slash `/`.

**Lösung**:

Die Skripte von Everything Claude Code sind bereits plattformübergreifend kompatibel (verwenden das Node.js `path`-Modul), aber wenn Sie eigene Hooks erstellen, beachten Sie:

**Falsche Schreibweise**:
```json
{
  "command": "node scripts/hooks\\session-start.js"  // Windows-Stil
}
```

**Richtige Schreibweise**:
```json
{
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\"  // Umgebungsvariable und Forward-Slash verwenden
}
```

#### Ursache B: Shell-Befehlsunterschiede

**Problem**: Verschiedene Plattformen haben unterschiedliche Befehlssyntax (z.B. `which` vs `where`).

**Lösung**:

Die `scripts/lib/utils.js` von Everything Claude Code behandelt diese Unterschiede bereits. Wenn Sie eigene Hooks erstellen, orientieren Sie sich an den plattformübergreifenden Funktionen in dieser Datei:

```javascript
// Plattformübergreifende Befehlserkennung in utils.js
function commandExists(cmd) {
  if (isWindows) {
    spawnSync('where', [cmd], { stdio: 'pipe' });
  } else {
    spawnSync('which', [cmd], { stdio: 'pipe' });
  }
}
```

---

## Häufiges Problem 5: Automatische Formatierung funktioniert nicht

### Symptome
Nach dem Bearbeiten von TypeScript-Dateien formatiert Prettier den Code nicht automatisch.

### Mögliche Ursachen

#### Ursache A: Prettier nicht installiert

**Problem**: Der PostToolUse-Hook ruft `npx prettier` auf, aber es ist im Projekt nicht installiert.

**Lösung**:

```bash
# Prettier installieren (projektbezogen)
npm install --save-dev prettier
# oder
pnpm add -D prettier

# Oder global installieren
npm install -g prettier
```

#### Ursache B: Prettier-Konfiguration fehlt

**Problem**: Prettier findet keine Konfigurationsdatei und verwendet Standard-Formatierungsregeln.

**Lösung**:

Prettier-Konfigurationsdatei erstellen:

```bash
# .prettierrc im Projektstammverzeichnis erstellen
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
```

#### Ursache C: Dateityp stimmt nicht überein

**Problem**: Die Dateierweiterung der bearbeiteten Datei ist nicht in den Matching-Regeln des Hooks enthalten.

**Aktuelle Matching-Regel** (`hooks.json` Z92-97):

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Wenn Sie andere Dateitypen unterstützen möchten** (z.B. `.vue`), müssen Sie die Konfiguration ändern:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx|vue)$\""
}
```

---

## Häufiges Problem 6: TypeScript-Prüfung funktioniert nicht

### Symptome
Nach dem Bearbeiten von `.ts`-Dateien sehen Sie keine Typprüfungs-Fehlerausgabe.

### Mögliche Ursachen

#### Ursache A: tsconfig.json fehlt

**Problem**: Das Hook-Skript sucht aufwärts nach einer `tsconfig.json`-Datei, findet aber keine.

**Lösung**:

Stellen Sie sicher, dass im Projektstammverzeichnis oder einem übergeordneten Verzeichnis eine `tsconfig.json` existiert:

```bash
# tsconfig.json suchen
find . -name "tsconfig.json" -type f

# Falls nicht vorhanden, Basiskonfiguration erstellen
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF
```

#### Ursache B: TypeScript nicht installiert

**Problem**: Der Hook ruft `npx tsc` auf, aber TypeScript ist nicht installiert.

**Lösung**:

```bash
npm install --save-dev typescript
# oder
pnpm add -D typescript
```

---

## Häufiges Problem 7: SessionStart/SessionEnd werden nicht ausgelöst

### Symptome
Beim Starten oder Beenden einer Sitzung sehen Sie keine `[SessionStart]`- oder `[SessionEnd]`-Logs.

### Mögliche Ursachen

#### Ursache A: Sitzungsdatei-Verzeichnis existiert nicht

**Problem**: Das Verzeichnis `~/.claude/sessions/` existiert nicht, das Hook-Skript kann keine Sitzungsdateien erstellen.

**Lösung**:

Verzeichnis manuell erstellen:

```bash
# macOS/Linux
mkdir -p ~/.claude/sessions

# Windows PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\sessions"
```

#### Ursache B: Falscher Skriptpfad

**Problem**: Der in `hooks.json` referenzierte Skriptpfad ist falsch.

**Überprüfungsmethode**:

```bash
# Überprüfen, ob die Skripte existieren
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-start.js
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-end.js
```

**Falls nicht vorhanden**, überprüfen Sie, ob das Plugin vollständig installiert ist:

```bash
# Plugin-Verzeichnisstruktur anzeigen
ls -la ~/.claude-plugins/everything-claude-code/
```

---

## Häufiges Problem 8: Dev-Server-Blockierung funktioniert nicht

### Symptome
Das direkte Ausführen von `npm run dev` wird nicht blockiert, der Dev-Server kann gestartet werden.

### Mögliche Ursachen

#### Ursache A: Regulärer Ausdruck stimmt nicht überein

**Problem**: Ihr Dev-Server-Befehl ist nicht in den Matching-Regeln des Hooks enthalten.

**Aktuelle Matching-Regel** (`hooks.json` Z6):

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\""
}
```

**Matching testen**:

```bash
# Testen, ob Ihr Befehl übereinstimmt
node -e "console.log(/(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)/.test('npm run dev'))"
```

**Wenn Sie andere Befehle unterstützen möchten** (z.B. `npm start`), ändern Sie `hooks.json`:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (run dev|start)|pnpm( run)? (dev|start)|yarn (dev|start)|bun run (dev|start))\""
}
```

#### Ursache B: Nicht in tmux, aber nicht blockiert

**Problem**: Der Hook sollte den Dev-Server außerhalb von tmux blockieren, aber es funktioniert nicht.

**Prüfpunkte**:

1. Bestätigen Sie, dass der Hook-Befehl erfolgreich ausgeführt wird:
```bash
# Hook-Befehl simulieren
node -e "console.error('[Hook] BLOCKED: Dev server must run in tmux');process.exit(1)"
# Sie sollten eine Fehlerausgabe sehen und der Exit-Code sollte 1 sein
```

2. Überprüfen Sie, ob `process.exit(1)` den Befehl korrekt blockiert:
- `process.exit(1)` im Hook-Befehl sollte die Ausführung nachfolgender Befehle verhindern

3. Falls es immer noch nicht funktioniert, müssen Sie möglicherweise die Claude Code-Version aktualisieren (Hooks-Unterstützung erfordert möglicherweise die neueste Version)

---

## Diagnosetools und Tipps

### Detaillierte Logs aktivieren

Sehen Sie sich die detaillierten Logs von Claude Code an, um die Hook-Ausführung zu verstehen:

```bash
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait -Tail 50
```

### Hook manuell testen

Führen Sie Hook-Skripte manuell im Terminal aus, um ihre Funktionalität zu überprüfen:

```bash
# SessionStart testen
cd ~/.claude-plugins/everything-claude-code
node scripts/hooks/session-start.js

# Suggest Compact testen
node scripts/hooks/suggest-compact.js

# PreCompact testen
node scripts/hooks/pre-compact.js
```

### Umgebungsvariablen überprüfen

Umgebungsvariablen von Claude Code anzeigen:

```bash
# Debug-Ausgabe im Hook-Skript hinzufügen
node -e "console.log('CLAUDE_PLUGIN_ROOT:', process.env.CLAUDE_PLUGIN_ROOT); console.log('COMPACT_THRESHOLD:', process.env.COMPACT_THRESHOLD)"
```

---

## Checkliste ✅

Überprüfen Sie die folgenden Punkte nacheinander:

- [ ] `hooks.json` befindet sich am richtigen Ort (`~/.claude/hooks/` oder `.claude/hooks/`)
- [ ] `hooks.json` hat korrektes JSON-Format (mit `jq` validiert)
- [ ] Plugin-Pfad ist korrekt (`${CLAUDE_PLUGIN_ROOT}` ist gesetzt)
- [ ] Alle Skripte haben Ausführungsberechtigungen (Linux/macOS)
- [ ] Abhängige Tools sind installiert (Node.js, Prettier, TypeScript)
- [ ] Sitzungsverzeichnis existiert (`~/.claude/sessions/`)
- [ ] Matcher-Ausdrücke sind korrekt (Regex-Escaping, Anführungszeichen)
- [ ] Plattformübergreifende Kompatibilität (Verwendung des `path`-Moduls, Umgebungsvariablen)

---

## Wann Sie Hilfe benötigen

Wenn keine der oben genannten Methoden das Problem löst:

1. **Diagnoseinformationen sammeln**:
   ```bash
   # Folgende Informationen ausgeben
   echo "Node version: $(node -v)"
   echo "Claude Code version: $(claude-code --version)"
   echo "Plugin path: $(ls -la ~/.claude-plugins/everything-claude-code)"
   echo "Hooks config: $(cat ~/.claude/hooks/hooks.json | jq -c .)"
   ```

2. **GitHub Issues durchsuchen**:
   - Besuchen Sie [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - Suchen Sie nach ähnlichen Problemen

3. **Issue erstellen**:
   - Vollständige Fehlerlogs beifügen
   - Betriebssystem und Versionsinformationen angeben
   - `hooks.json`-Inhalt anhängen (sensible Informationen ausblenden)

---

## Zusammenfassung

Wenn Hooks nicht funktionieren, gibt es in der Regel folgende Ursachenkategorien:

| Problemtyp | Häufige Ursachen | Schnelle Diagnose |
| --- | --- | --- |
| **Überhaupt nicht ausgelöst** | Falscher hooks.json-Pfad, JSON-Syntaxfehler | Dateispeicherort prüfen, JSON-Format validieren |
| **Bestimmter Hook nicht ausgelöst** | Falscher Matcher-Ausdruck, Befehlsausführung fehlgeschlagen | Regex-Syntax prüfen, Skript manuell ausführen |
| **Berechtigungsprobleme** | Skripte haben keine Ausführungsberechtigungen (Linux/macOS) | `chmod +x scripts/hooks/*.js` |
| **Plattformübergreifende Kompatibilität** | Pfadtrennzeichen, Shell-Befehlsunterschiede | `path`-Modul verwenden, utils.js als Referenz |
| **Funktion funktioniert nicht** | Abhängige Tools nicht installiert (Prettier, TypeScript) | Entsprechende Tools installieren, Konfigurationsdateien prüfen |

Denken Sie daran: Die meisten Probleme lassen sich durch Überprüfung der Dateipfade, Validierung des JSON-Formats und Bestätigung der installierten Abhängigkeiten lösen.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[MCP-Verbindungsfehler beheben](../troubleshooting-mcp/)**.
>
> Sie werden lernen:
> - Häufige Fehler bei der MCP-Server-Konfiguration
> - Wie man MCP-Verbindungsprobleme debuggt
> - MCP-Umgebungsvariablen und Platzhalter-Einstellungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisiert am: 2026-01-25

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Hooks-Hauptkonfiguration | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Plattformübergreifende Hilfsfunktionen | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |

**Wichtige Funktionen**:
- `getHomeDir()` / `getClaudeDir()` / `getSessionsDir()`: Konfigurationsverzeichnispfade abrufen (utils.js 19-34)
- `ensureDir(dirPath)`: Sicherstellen, dass Verzeichnis existiert, bei Bedarf erstellen (utils.js 54-59)
- `log(message)`: Log an stderr ausgeben (sichtbar in Claude Code) (utils.js 182-184)
- `findFiles(dir, pattern, options)`: Plattformübergreifende Dateisuche (utils.js 102-149)
- `commandExists(cmd)`: Prüfen, ob Befehl existiert (plattformübergreifend kompatibel) (utils.js 228-246)

**Wichtige reguläre Ausdrücke**:
- Dev-Server-Blockierung: `npm run dev|pnpm( run)? dev|yarn dev|bun run dev` (hooks.json 6)
- Dateibearbeitungs-Matching: `\\.(ts|tsx|js|jsx)$` (hooks.json 92)
- TypeScript-Dateien: `\\.(ts|tsx)$` (hooks.json 102)

**Umgebungsvariablen**:
- `${CLAUDE_PLUGIN_ROOT}`: Plugin-Stammverzeichnispfad
- `CLAUD_SESSION_ID`: Sitzungskennung
- `COMPACT_THRESHOLD`: Schwellenwert für Komprimierungsvorschläge (Standard: 50)

</details>
