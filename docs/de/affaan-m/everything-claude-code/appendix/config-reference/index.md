---
title: "Konfigurationsdatei im Detail: settings.json Vollständige Referenz | Everything Claude Code"
sidebarTitle: "Alle Konfigurationen anpassen"
subtitle: "Konfigurationsdatei im Detail: settings.json Vollständige Referenz"
description: "Lernen Sie die vollständigen Konfigurationsoptionen von Everything Claude Code kennen. Beherrschen Sie Hooks-Automatisierung, MCP-Server und Plugin-Konfiguration, lösen Sie Konfigurationskonflikte schnell."
tags:
  - "config"
  - "settings"
  - "json"
  - "hooks"
  - "mcp"
prerequisite:
  - "start-installation"
  - "start-mcp-setup"
order: 190
---

# Konfigurationsdatei im Detail: settings.json Vollständige Referenz

## Was Sie nach diesem Kapitel können

- Alle Konfigurationsoptionen von `~/.claude/settings.json` vollständig verstehen
- Hooks-Automatisierungs-Workflows anpassen
- MCP-Server konfigurieren und verwalten
- Plugin-Manifest und Pfadkonfigurationen ändern
- Konfigurationskonflikte und Fehler beheben

## Ihre aktuelle Herausforderung

Sie verwenden bereits Everything Claude Code, stoßen aber auf folgende Probleme:
- "Warum wird ein bestimmter Hook nicht ausgelöst?"
- "MCP-Server-Verbindung fehlgeschlagen, wo liegt der Konfigurationsfehler?"
- "Möchte eine Funktion anpassen, weiß aber nicht, welche Konfigurationsdatei zu ändern ist?"
- "Mehrere Konfigurationsdateien überschreiben sich gegenseitig, wie ist die Priorität?"

Dieses Tutorial gibt Ihnen ein vollständiges Konfigurationsreferenzhandbuch.

## Kernkonzept

Das Konfigurationssystem von Claude Code ist in drei Ebenen unterteilt, Priorität von hoch nach niedrig:

1. **Projektkonfiguration** (`.claude/settings.json`) - Gilt nur für das aktuelle Projekt
2. **Globale Konfiguration** (`~/.claude/settings.json`) - Gilt für alle Projekte
3. **Plugin-Standardkonfiguration** (Standardkonfiguration von Everything Claude Code)

::: tip Konfigurationspriorität
Konfigurationen werden **zusammengeführt**, nicht überschrieben. Projektkonfigurationen überschreiben gleichnamige Optionen in der globalen Konfiguration, behalten aber andere Optionen bei.
:::

Konfigurationsdateien verwenden das JSON-Format und folgen dem Claude Code Settings Schema:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

Dieses Schema bietet Autovervollständigung und Validierung, es wird empfohlen, es immer einzuschließen.

## Konfigurationsdateistruktur

### Vollständige Konfigurationsvorlage

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",

  "mcpServers": {},

  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "SessionStart": [],
    "SessionEnd": [],
    "PreCompact": [],
    "Stop": []
  },

  "disabledMcpServers": [],

  "environmentVariables": {}
}
```

::: warning JSON-Syntaxregeln
- Alle Schlüsselnamen und Zeichenkettenwerte müssen in **doppelte Anführungszeichen** gesetzt werden
- Nach dem letzten Schlüssel-Wert-Paar **kein Komma** setzen
- Kommentare sind keine Standard-JSON-Syntax, verwenden Sie stattdessen `"_comments"`-Felder
:::

## Hooks-Konfiguration im Detail

Hooks sind der Kern-Automatisierungsmechanismus von Everything Claude Code und definieren automatisierte Skripte, die bei bestimmten Ereignissen ausgelöst werden.

### Hook-Typen und Auslösezeitpunkte

| Hook-Typ | Auslösezeitpunkt | Verwendungszweck |
| --- | --- | --- |
| `SessionStart` | Beim Start einer Claude Code-Sitzung | Kontext laden, Paketmanager erkennen |
| `SessionEnd` | Beim Ende einer Claude Code-Sitzung | Sitzungsstatus speichern, Extraktionsmuster bewerten |
| `PreToolUse` | Vor Tool-Aufruf | Befehle validieren, gefährliche Operationen blockieren |
| `PostToolUse` | Nach Tool-Aufruf | Code formatieren, Typprüfung |
| `PreCompact` | Vor Kontextkomprimierung | Status-Snapshot speichern |
| `Stop` | Bei jedem Ende einer AI-Antwort | console.log und andere Probleme prüfen |

### Hook-Konfigurationsstruktur

Jeder Hook-Eintrag enthält folgende Felder:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Hook triggered')\""
    }
  ],
  "description": "Hook-Beschreibung (optional)"
}
```

#### matcher-Feld

Definiert Auslösebedingungen, unterstützt folgende Variablen:

| Variable | Bedeutung | Beispielwert |
| --- | --- | --- |
| `tool` | Tool-Name | `"Bash"`, `"Write"`, `"Edit"` |
| `tool_input.command` | Bash-Befehlsinhalt | `"npm run dev"` |
| `tool_input.file_path` | Dateipfad für Write/Edit | `"/path/to/file.ts"` |

**Matching-Operatoren**:

```javascript
// Gleichheit
tool == "Bash"

// Regex-Matching
tool_input.command matches "npm run dev"
tool_input.file_path matches "\\\\.ts$"

// Logische Operationen
tool == "Edit" || tool == "Write"
tool == "Bash" && !(tool_input.command matches "git push")
```

#### hooks-Array

Definiert auszuführende Aktionen, unterstützt zwei Typen:

**Typ 1: command**

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
}
```

- `${CLAUDE_PLUGIN_ROOT}` Variable für das Plugin-Stammverzeichnis
- Befehl wird im Projektstammverzeichnis ausgeführt
- Standard-JSON-Formatausgabe wird an Claude Code übergeben

**Typ 2: prompt** (in dieser Konfiguration nicht verwendet)

```json
{
  "type": "prompt",
  "prompt": "Review the code before committing"
}
```

### Vollständige Hooks-Konfigurationsbeispiele

Everything Claude Code bietet 15+ vorkonfigurierte Hooks, hier ist die vollständige Konfigurationsbeschreibung:

#### PreToolUse Hooks

**1. Tmux Dev Server Block**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
    }
  ],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Verwendungszweck**: Erzwingt das Ausführen von Entwicklungsservern in tmux, um sicherzustellen, dass Logs zugänglich sind.

**Passende Befehle**:
- `npm run dev`
- `pnpm dev` / `pnpm run dev`
- `yarn dev`
- `bun run dev`

**2. Tmux Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"if(!process.env.TMUX){console.error('[Hook] Consider running in tmux for session persistence');console.error('[Hook] tmux new -s dev  |  tmux attach -t dev')}\""
    }
  ],
  "description": "Reminder to use tmux for long-running commands"
}
```

**Verwendungszweck**: Erinnert daran, tmux für lang laufende Befehle zu verwenden.

**Passende Befehle**:
- `npm install`, `npm test`
- `pnpm install`, `pnpm test`
- `cargo build`, `make`, `docker`
- `pytest`, `vitest`, `playwright`

**3. Git Push Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
    }
  ],
  "description": "Reminder before git push to review changes"
}
```

**Verwendungszweck**: Erinnert vor dem Push daran, Änderungen zu überprüfen.

**4. Block Random MD Files**

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.(md|txt)$/.test(p)&&!/(README|CLAUDE|AGENTS|CONTRIBUTING)\\.md$/.test(p)){console.error('[Hook] BLOCKED: Unnecessary documentation file creation');console.error('[Hook] File: '+p);console.error('[Hook] Use README.md for documentation instead');process.exit(1)}console.log(d)})\""
    }
  ],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Verwendungszweck**: Blockiert die Erstellung zufälliger .md-Dateien, hält Dokumentation konsolidiert.

**Erlaubte Dateien**:
- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`

**5. Suggest Compact**

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
    }
  ],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Verwendungszweck**: Schlägt manuelle Kontextkomprimierung in logischen Intervallen vor.

#### SessionStart Hook

**Load Previous Context**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
    }
  ],
  "description": "Load previous context and detect package manager on new session"
}
```

**Verwendungszweck**: Lädt vorherigen Sitzungskontext und erkennt Paketmanager.

#### PostToolUse Hooks

**1. Log PR URL**

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';const m=out.match(/https:\\/\\/github.com\\/[^/]+\\/[^/]+\\/pull\\/\\d+/);if(m){console.error('[Hook] PR created: '+m[0]);const repo=m[0].replace(/https:\\/\\/github.com\\/([^/]+\\/[^/]+)\\/pull\\/\\d+/,'$1');const pr=m[0].replace(/.*\\/pull\\/(\\d+)/,'$1');console.error('[Hook] To review: gh pr review '+pr+' --repo '+repo)}}console.log(d)})\""
    }
  ],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Verwendungszweck**: Protokolliert PR-URL nach Erstellung und bietet Review-Befehl.

**2. Auto Format**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
    }
  ],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Verwendungszweck**: Formatiert JS/TS-Dateien automatisch mit Prettier.

**3. TypeScript Check**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');const path=require('path');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){let dir=path.dirname(p);while(dir!==path.dirname(dir)&&!fs.existsSync(path.join(dir,'tsconfig.json'))){dir=path.dirname(dir)}if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']});const lines=r.split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}catch(e){const lines=(e.stdout||'').split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}}}console.log(d)})\""
    }
  ],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Verwendungszweck**: Führt Typprüfung nach Bearbeitung von TypeScript-Dateien aus.

**4. Console.log Warning**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');const matches=[];lines.forEach((l,idx)=>{if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())});if(matches.length){console.error('[Hook] WARNING: console.log found in '+p);matches.slice(0,5).forEach(m=>console.error(m));console.error('[Hook] Remove console.log before committing')}}console.log(d)})\""
    }
  ],
  "description": "Warn about console.log statements after edits"
}
```

**Verwendungszweck**: Erkennt und warnt vor console.log-Anweisungen in Dateien.

#### Stop Hook

**Check Console.log in Modified Files**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{execSync('git rev-parse --git-dir',{stdio:'pipe'})}catch{console.log(d);process.exit(0)}try{const files=execSync('git diff --name-only HEAD',{encoding:'utf8',stdio:['pipe','pipe','pipe']}).split('\\n').filter(f=>/\\.(ts|tsx|js|jsx)$/.test(f)&&fs.existsSync(f));let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}if(hasConsole)console.error('[Hook] Remove console.log statements before committing')}catch(e){}console.log(d)})\""
    }
  ],
  "description": "Check for console.log in modified files after each response"
}
```

**Verwendungszweck**: Prüft modifizierte Dateien auf console.log.

#### PreCompact Hook

**Save State Before Compaction**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
    }
  ],
  "description": "Save state before context compaction"
}
```

**Verwendungszweck**: Speichert Status vor Kontextkomprimierung.

#### SessionEnd Hooks

**1. Persist Session State**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
    }
  ],
  "description": "Persist session state on end"
}
```

**Verwendungszweck**: Persistiert Sitzungsstatus.

**2. Evaluate Session**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
    }
  ],
  "description": "Evaluate session for extractable patterns"
}
```

**Verwendungszweck**: Bewertet Sitzung zur Extraktion wiederverwendbarer Muster.

### Hooks anpassen

Sie können Hooks auf folgende Weise anpassen:

#### Methode 1: settings.json ändern

```bash
# Globale Konfiguration bearbeiten
vim ~/.claude/settings.json
```

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Your custom hook')\""
          }
        ],
        "description": "Your custom hook"
      }
    ]
  }
}
```

#### Methode 2: Projektkonfiguration überschreiben

Erstellen Sie `.claude/settings.json` im Projektstammverzeichnis:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_custom_command\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Project-specific hook')\""
          }
        ]
      }
    ]
  }
}
```

::: tip Vorteile der Projektkonfiguration
- Beeinflusst nicht die globale Konfiguration
- Gilt nur für spezifisches Projekt
- Kann in Versionskontrolle eingecheckt werden
:::

## MCP-Server-Konfiguration im Detail

MCP (Model Context Protocol) Server erweitern die Fähigkeiten von Claude Code zur Integration externer Dienste.

### MCP-Konfigurationsstruktur

```json
{
  "mcpServers": {
    "server_name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "ENV_VAR": "your_value"
      },
      "description": "Server description"
    },
    "http_server": {
      "type": "http",
      "url": "https://example.com/mcp",
      "description": "HTTP server description"
    }
  }
}
```

### MCP-Server-Typen

#### Typ 1: npx

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    },
    "description": "GitHub operations - PRs, issues, repos"
  }
}
```

**Feldbeschreibung**:
- `command`: Ausführungsbefehl, normalerweise `npx`
- `args`: Parameter-Array, `-y` bestätigt Installation automatisch
- `env`: Umgebungsvariablen-Objekt
- `description`: Beschreibungstext

#### Typ 2: http

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Vercel deployments and projects"
  }
}
```

**Feldbeschreibung**:
- `type`: Muss `"http"` sein
- `url`: Server-URL
- `description`: Beschreibungstext

### Everything Claude Code vorkonfigurierte MCP-Server

Hier ist die Liste aller vorkonfigurierten MCP-Server:

| Servername | Typ | Beschreibung | Konfiguration erforderlich |
| --- | --- | --- | --- |
| `github` | npx | GitHub-Operationen (PR, Issues, Repos) | GitHub PAT |
| `firecrawl` | npx | Web-Scraping und Crawling | Firecrawl API Key |
| `supabase` | npx | Supabase-Datenbankoperationen | Project Ref |
| `memory` | npx | Sitzungsübergreifender persistenter Speicher | Nein |
| `sequential-thinking` | npx | Verkettetes Reasoning | Nein |
| `vercel` | http | Vercel-Deployments und Projektverwaltung | Nein |
| `railway` | npx | Railway-Deployments | Nein |
| `cloudflare-docs` | http | Cloudflare-Dokumentationssuche | Nein |
| `cloudflare-workers-builds` | http | Cloudflare Workers Builds | Nein |
| `cloudflare-workers-bindings` | http | Cloudflare Workers Bindings | Nein |
| `cloudflare-observability` | http | Cloudflare Logs und Monitoring | Nein |
| `clickhouse` | http | ClickHouse-Analyseabfragen | Nein |
| `context7` | npx | Echtzeit-Dokumentationssuche | Nein |
| `magic` | npx | Magic UI-Komponenten | Nein |
| `filesystem` | npx | Dateisystemoperationen | Pfadkonfiguration |

### MCP-Server hinzufügen

#### Aus vorkonfigurierten hinzufügen

1. Kopieren Sie die Serverkonfiguration aus `mcp-configs/mcp-servers.json`
2. Fügen Sie sie in Ihre `~/.claude/settings.json` ein

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

3. Ersetzen Sie `YOUR_*_HERE`-Platzhalter durch tatsächliche Werte

#### Benutzerdefinierten MCP-Server hinzufügen

```json
{
  "mcpServers": {
    "my_custom_server": {
      "command": "npx",
      "args": ["-y", "@your-org/your-server"],
      "env": {
        "API_KEY": "your_api_key"
      },
      "description": "Custom MCP server"
    }
  }
}
```

### MCP-Server deaktivieren

Verwenden Sie das `disabledMcpServers`-Array, um bestimmte Server zu deaktivieren:

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "firecrawl": { /* ... */ }
  },
  "disabledMcpServers": ["github", "firecrawl"]
}
```

::: warning Kontextfenster-Warnung
Zu viele aktivierte MCP-Server belegen viel Kontextfenster. Es wird empfohlen, **< 10 MCP-Server** zu aktivieren.
:::

## Plugin-Konfiguration im Detail

### plugin.json-Struktur

`.claude-plugin/plugin.json` ist die Plugin-Manifestdatei, die Plugin-Metadaten und Komponentenpfade definiert.

```json
{
  "name": "everything-claude-code",
  "description": "Complete collection of battle-tested Claude Code configs",
  "author": {
    "name": "Affaan Mustafa",
    "url": "https://x.com/affaanmustafa"
  },
  "homepage": "https://github.com/affaan-m/everything-claude-code",
  "repository": "https://github.com/affaan-m/everything-claude-code",
  "license": "MIT",
  "keywords": [
    "claude-code",
    "agents",
    "skills",
    "hooks",
    "commands",
    "rules",
    "tdd",
    "code-review",
    "security",
    "workflow",
    "automation",
    "best-practices"
  ],
  "commands": "./commands",
  "skills": "./skills"
}
```

### Feldbeschreibung

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `name` | string | J | Plugin-Name |
| `description` | string | J | Plugin-Beschreibung |
| `author.name` | string | J | Autorenname |
| `author.url` | string | N | Autoren-Homepage-URL |
| `homepage` | string | N | Plugin-Homepage |
| `repository` | string | N | Repository-URL |
| `license` | string | N | Lizenz |
| `keywords` | string[] | N | Schlüsselwort-Array |
| `commands` | string | J | Befehls-Verzeichnispfad |
| `skills` | string | J | Skill-Verzeichnispfad |

### Plugin-Pfade ändern

Wenn Sie Komponentenpfade anpassen müssen, ändern Sie `plugin.json`:

```json
{
  "name": "my-custom-claude-config",
  "commands": "./custom-commands",
  "skills": "./custom-skills"
}
```

## Andere Konfigurationsdateien

### package-manager.json

Paketmanager-Konfiguration, unterstützt Projekt- und globale Ebene:

```json
{
  "packageManager": "pnpm"
}
```

**Speicherorte**:
- Global: `~/.claude/package-manager.json`
- Projekt: `.claude/package-manager.json`

### marketplace.json

Plugin-Marketplace-Manifest, verwendet für `/plugin marketplace add`-Befehl:

```json
{
  "name": "everything-claude-code",
  "displayName": "Everything Claude Code",
  "description": "Complete collection of Claude Code configs",
  "url": "https://github.com/affaan-m/everything-claude-code"
}
```

### statusline.json

Statusleisten-Konfigurationsbeispiel:

```json
{
  "items": [
    {
      "type": "text",
      "text": "Everything Claude Code"
    }
  ]
}
```

## Konfigurationsdatei-Zusammenführung und Priorität

### Zusammenführungsstrategie

Konfigurationsdateien werden in folgender Reihenfolge zusammengeführt (spätere haben Vorrang):

1. Plugin-Standardkonfiguration
2. Globale Konfiguration (`~/.claude/settings.json`)
3. Projektkonfiguration (`.claude/settings.json`)

**Beispiel**:

```json
// Plugin-Standard
{
  "hooks": {
    "PreToolUse": [/* Hook A */]
  }
}

// Globale Konfiguration
{
  "hooks": {
    "PreToolUse": [/* Hook B */]
  }
}

// Projektkonfiguration
{
  "hooks": {
    "PreToolUse": [/* Hook C */]
  }
}

// Endgültiges Zusammenführungsergebnis (Projektkonfiguration hat Vorrang)
{
  "hooks": {
    "PreToolUse": [/* Hook C */]  // Hook C überschreibt A und B
  }
}
```

::: warning Hinweise
- **Gleichnamige Arrays werden vollständig überschrieben**, nicht angehängt
- Es wird empfohlen, in der Projektkonfiguration nur die zu überschreibenden Teile zu definieren
- Verwenden Sie den `/debug config`-Befehl, um die vollständige Konfiguration anzuzeigen
:::

### Umgebungsvariablen-Konfiguration

Definieren Sie Umgebungsvariablen in `settings.json`:

```json
{
  "environmentVariables": {
    "CLAUDE_PACKAGE_MANAGER": "pnpm",
    "NODE_ENV": "development"
  }
}
```

::: tip Sicherheitshinweis
- Umgebungsvariablen werden in der Konfigurationsdatei offengelegt
- Speichern Sie keine sensiblen Informationen in Konfigurationsdateien
- Verwenden Sie System-Umgebungsvariablen oder `.env`-Dateien zur Verwaltung von Schlüsseln
:::

## Häufige Konfigurationsprobleme beheben

### Problem 1: Hook wird nicht ausgelöst

**Mögliche Ursachen**:
1. Matcher-Ausdruck fehlerhaft
2. Hook-Konfigurationsformat fehlerhaft
3. Konfigurationsdatei nicht korrekt gespeichert

**Fehlerbehebungsschritte**:

```bash
# Konfigurationssyntax prüfen
cat ~/.claude/settings.json | python -m json.tool

# Überprüfen, ob Hook geladen ist
# In Claude Code ausführen
/debug config
```

**Häufige Korrekturen**:

```json
// ❌ Falsch: Einfache Anführungszeichen
{
  "matcher": "tool == 'Bash'"
}

// ✅ Richtig: Doppelte Anführungszeichen
{
  "matcher": "tool == \"Bash\""
}
```

### Problem 2: MCP-Server-Verbindung fehlgeschlagen

**Mögliche Ursachen**:
1. Umgebungsvariablen nicht konfiguriert
2. Netzwerkprobleme
3. Server-URL fehlerhaft

**Fehlerbehebungsschritte**:

```bash
# MCP-Server testen
npx @modelcontextprotocol/server-github --help

# Umgebungsvariablen prüfen
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**Häufige Korrekturen**:

```json
// ❌ Falsch: Umgebungsvariablenname fehlerhaft
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxx"  // Sollte GITHUB_PERSONAL_ACCESS_TOKEN sein
  }
}

// ✅ Richtig
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
  }
}
```

### Problem 3: Konfigurationskonflikt

**Symptom**: Einige Konfigurationsoptionen werden nicht wirksam

**Ursache**: Projektkonfiguration überschreibt globale Konfiguration

**Lösung**:

```bash
# Projektkonfiguration anzeigen
cat .claude/settings.json

# Globale Konfiguration anzeigen
cat ~/.claude/settings.json

# Projektkonfiguration löschen (falls nicht benötigt)
rm .claude/settings.json
```

### Problem 4: JSON-Formatfehler

**Symptom**: Claude Code kann Konfiguration nicht lesen

**Fehlerbehebungstools**:

```bash
# Mit jq validieren
cat ~/.claude/settings.json | jq '.'

# Mit Python validieren
cat ~/.claude/settings.json | python -m json.tool

# Online-Tool verwenden
# https://jsonlint.com/
```

**Häufige Fehler**:

```json
// ❌ Falsch: Abschließendes Komma
{
  "hooks": {
    "PreToolUse": []
  },
}

// ❌ Falsch: Einfache Anführungszeichen
{
  "description": 'Hooks configuration'
}

// ❌ Falsch: Kommentare
{
  "hooks": {
    // This is a comment
  }
}

// ✅ Richtig
{
  "hooks": {
    "PreToolUse": []
  }
}
```

## Zusammenfassung dieser Lektion

Diese Lektion hat das vollständige Konfigurationssystem von Everything Claude Code systematisch erklärt:

**Kernkonzepte**:
- Konfiguration ist in drei Ebenen unterteilt: Projekt, Global, Plugin
- Konfigurationspriorität: Projekt > Global > Plugin
- JSON-Format ist strikt, achten Sie auf doppelte Anführungszeichen und Syntax

**Hooks-Konfiguration**:
- 6 Hook-Typen, 15+ vorkonfigurierte Hooks
- Matcher-Ausdrücke definieren Auslösebedingungen
- Unterstützt benutzerdefinierte Hooks und Projekt-Überschreibung

**MCP-Server**:
- Zwei Typen: npx und http
- 15+ vorkonfigurierte Server
- Unterstützt Deaktivierung und Anpassung

**Plugin-Konfiguration**:
- plugin.json definiert Plugin-Metadaten
- Unterstützt benutzerdefinierte Komponentenpfade
- marketplace.json für Plugin-Marketplace

**Andere Konfigurationen**:
- package-manager.json: Paketmanager-Konfiguration
- statusline.json: Statusleisten-Konfiguration
- environmentVariables: Umgebungsvariablen-Definition

**Häufige Probleme**:
- Hook wird nicht ausgelöst → Matcher und JSON-Format prüfen
- MCP-Verbindung fehlgeschlagen → Umgebungsvariablen und Netzwerk prüfen
- Konfigurationskonflikt → Projekt- und globale Konfiguration anzeigen
- JSON-Formatfehler → jq oder Online-Tools zur Validierung verwenden

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Rules Vollständige Referenz: 8 Regelwerke im Detail](../rules-reference/)**.
>
> Sie werden lernen:
> - Security-Regeln: Verhindern von sensiblen Datenlecks
> - Coding Style-Regeln: Code-Stil und Best Practices
> - Testing-Regeln: Testabdeckung und TDD-Anforderungen
> - Git Workflow-Regeln: Commit-Standards und PR-Prozess
> - Wie Sie Regelwerke an Projektanforderungen anpassen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Hooks-Konfiguration | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Plugin-Manifest | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| MCP-Server-Konfiguration | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Plugin-Marketplace-Manifest | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | - |

**Wichtige Hook-Skripte**:
- `session-start.js`: Lädt Kontext beim Sitzungsstart
- `session-end.js`: Speichert Status beim Sitzungsende
- `suggest-compact.js`: Schlägt manuelle Kontextkomprimierung vor
- `pre-compact.js`: Speichert Status vor Komprimierung
- `evaluate-session.js`: Bewertet Sitzung zur Musterextraktion

**Wichtige Umgebungsvariablen**:
- `CLAUDE_PLUGIN_ROOT`: Plugin-Stammverzeichnis
- `GITHUB_PERSONAL_ACCESS_TOKEN`: GitHub API-Authentifizierung
- `FIRECRAWL_API_KEY`: Firecrawl API-Authentifizierung

</details>
