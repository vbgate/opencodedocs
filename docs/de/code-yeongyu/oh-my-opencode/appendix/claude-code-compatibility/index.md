---
title: "Kompatibilität: Claude Code Integration | oh-my-opencode"
sidebarTitle: "Claude Code Konfiguration wiederverwenden"
subtitle: "Claude Code Kompatibilität: Vollständige Unterstützung für Commands, Skills, Agents, MCPs und Hooks"
description: "Lernen Sie die Claude Code Kompatibilitätsschicht von oh-my-opencode kennen. Meistern Sie Konfigurationsladen, Prioritätsregeln und Deaktivierungsschalter für eine reibungslose Migration zu OpenCode."
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Claude Code Kompatibilität: Vollständige Unterstützung für Commands, Skills, Agents, MCPs und Hooks

## Was Sie nach diesem Tutorial können

- Bestehende Konfigurationen und Plugins von Claude Code in OpenCode verwenden
- Die Prioritätsregeln verschiedener Konfigurationsquellen verstehen
- Claude Code Kompatibilitätsfunktionen über Konfigurationsschalter steuern
- Reibungslos von Claude Code zu OpenCode migrieren

## Ihre aktuelle Herausforderung

Wenn Sie von Claude Code zu OpenCode migrieren, haben Sie möglicherweise bereits viele benutzerdefinierte Commands, Skills und MCP-Server im Verzeichnis `~/.claude/` konfiguriert. Diese Konfigurationen erneut einzurichten ist mühsam – Sie möchten diese bestehenden Konfigurationen direkt in OpenCode wiederverwenden können.

Oh My OpenCode bietet eine vollständige Claude Code Kompatibilitätsschicht, die es Ihnen ermöglicht, Ihre bestehenden Claude Code Konfigurationen und Plugins ohne jegliche Änderungen zu nutzen.

## Kernkonzept

Oh My OpenCode ist durch einen **automatischen Lademechanismus** mit dem Konfigurationsformat von Claude Code kompatibel. Das System scannt beim Start automatisch die Standard-Konfigurationsverzeichnisse von Claude Code, konvertiert diese Ressourcen in ein von OpenCode erkennbares Format und registriert sie im System.

Die Kompatibilität umfasst folgende Funktionen:

| Funktion | Kompatibilitätsstatus | Beschreibung |
| --- | --- | --- |
| **Commands** | ✅ Vollständig unterstützt | Lädt Slash-Commands aus `~/.claude/commands/` und `.claude/commands/` |
| **Skills** | ✅ Vollständig unterstützt | Lädt spezialisierte Skills aus `~/.claude/skills/` und `.claude/skills/` |
| **Agents** | ⚠️ Reserviert | Schnittstelle reserviert, derzeit nur eingebaute Agents unterstützt |
| **MCPs** | ✅ Vollständig unterstützt | Lädt MCP-Server-Konfigurationen aus `.mcp.json` und `~/.claude/.mcp.json` |
| **Hooks** | ✅ Vollständig unterstützt | Lädt benutzerdefinierte Lifecycle-Hooks aus `settings.json` |
| **Plugins** | ✅ Vollständig unterstützt | Lädt Marketplace-Plugins aus `installed_plugins.json` |

---

## Priorität beim Laden von Konfigurationen

Oh My OpenCode unterstützt das Laden von Konfigurationen aus mehreren Speicherorten und führt diese nach einer festen Prioritätsreihenfolge zusammen. **Konfigurationen mit höherer Priorität überschreiben Konfigurationen mit niedrigerer Priorität**.

### Priorität beim Laden von Commands

Commands werden in folgender Reihenfolge geladen (von hoch nach niedrig):

1. `.opencode/command/` (Projektebene, höchste Priorität)
2. `~/.config/opencode/command/` (Benutzerebene)
3. `.claude/commands/` (Projektebene Claude Code Kompatibilität)
4. `~/.claude/commands/` (Benutzerebene Claude Code Kompatibilität)

**Quellcode-Position**: `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// Lädt Commands aus 4 Verzeichnissen und führt sie nach Priorität zusammen
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**Beispiel**: Wenn sowohl in `.opencode/command/refactor.md` als auch in `~/.claude/commands/refactor.md` ein gleichnamiger Command existiert, wird der Command aus `.opencode/` verwendet.

### Priorität beim Laden von Skills

Skills werden in folgender Reihenfolge geladen (von hoch nach niedrig):

1. `.opencode/skills/*/SKILL.md` (Projektebene, höchste Priorität)
2. `~/.config/opencode/skills/*/SKILL.md` (Benutzerebene)
3. `.claude/skills/*/SKILL.md` (Projektebene Claude Code Kompatibilität)
4. `~/.claude/skills/*/SKILL.md` (Benutzerebene Claude Code Kompatibilität)

**Quellcode-Position**: `src/features/opencode-skill-loader/loader.ts:206-215`

**Beispiel**: Skills auf Projektebene überschreiben Skills auf Benutzerebene und stellen sicher, dass projektspezifische Anforderungen Vorrang haben.

### Priorität beim Laden von MCPs

MCP-Konfigurationen werden in folgender Reihenfolge geladen (von hoch nach niedrig):

1. `.claude/.mcp.json` (Projektebene, höchste Priorität)
2. `.mcp.json` (Projektebene)
3. `~/.claude/.mcp.json` (Benutzerebene)

**Quellcode-Position**: `src/features/claude-code-mcp-loader/loader.ts:18-27`

**Besonderheit**: MCP-Konfigurationen unterstützen Umgebungsvariablen-Expansion (z.B. `${OPENAI_API_KEY}`), die automatisch über `env-expander.ts` aufgelöst werden.

**Quellcode-Position**: `src/features/claude-code-mcp-loader/env-expander.ts`

### Priorität beim Laden von Hooks

Hooks werden aus dem `hooks`-Feld in `settings.json` geladen und unterstützen folgende Pfade (nach Priorität):

1. `.claude/settings.local.json` (lokale Konfiguration, höchste Priorität)
2. `.claude/settings.json` (Projektebene)
3. `~/.claude/settings.json` (Benutzerebene)

**Quellcode-Position**: `src/hooks/claude-code-hooks/config.ts:46-59`

**Besonderheit**: Hooks aus mehreren Konfigurationsdateien werden automatisch zusammengeführt, anstatt sich gegenseitig zu überschreiben.

---

## Deaktivierungsschalter für Konfigurationen

Wenn Sie bestimmte Claude Code Konfigurationen nicht laden möchten, können Sie über das `claude_code`-Feld in `oh-my-opencode.json` eine feinkörnige Steuerung vornehmen.

### Kompatibilität vollständig deaktivieren

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### Teilweise deaktivieren

Sie können auch nur bestimmte Funktionen deaktivieren:

```jsonc
{
  "claude_code": {
    "mcp": false,         // Deaktiviert .mcp.json-Dateien (behält aber eingebaute MCPs)
    "commands": false,     // Deaktiviert ~/.claude/commands/ und .claude/commands/
    "skills": false,       // Deaktiviert ~/.claude/skills/ und .claude/skills/
    "agents": false,       // Deaktiviert ~/.claude/agents/ (behält eingebaute Agents)
    "hooks": false,        // Deaktiviert settings.json hooks
    "plugins": false       // Deaktiviert Claude Code Marketplace Plugins
  }
}
```

**Schalter-Erklärung**:

| Schalter | Deaktivierter Inhalt | Beibehaltener Inhalt |
| --- | --- | --- |
| `mcp` | `.mcp.json`-Dateien | Eingebaute MCPs (websearch, context7, grep_app) |
| `commands` | `~/.claude/commands/`, `.claude/commands/` | Native OpenCode Commands |
| `skills` | `~/.claude/skills/`, `.claude/skills/` | Native OpenCode Skills |
| `agents` | `~/.claude/agents/` | Eingebaute Agents (Sisyphus, Oracle, Librarian usw.) |
| `hooks` | `settings.json` hooks | Oh My OpenCode eingebaute Hooks |
| `plugins` | Claude Code Marketplace Plugins | Eingebaute Plugin-Funktionen |

### Bestimmte Plugins deaktivieren

Verwenden Sie `plugins_override`, um bestimmte Claude Code Marketplace Plugins zu deaktivieren:

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Deaktiviert das claude-mem Plugin
    }
  }
}
```

**Quellcode-Position**: `src/config/schema.ts:143`

---

## Datenspeicher-Kompatibilität

Oh My OpenCode ist mit dem Datenspeicherformat von Claude Code kompatibel und gewährleistet die Persistenz und Migration von Sitzungs- und Aufgabendaten.

### Todos-Speicherung

- **Speicherort**: `~/.claude/todos/`
- **Format**: Claude Code kompatibles JSON-Format
- **Verwendung**: Speichert Aufgabenlisten und To-Do-Einträge

**Quellcode-Position**: `src/features/claude-code-session-state/index.ts`

### Transcripts-Speicherung

- **Speicherort**: `~/.claude/transcripts/`
- **Format**: JSONL (ein JSON-Objekt pro Zeile)
- **Verwendung**: Speichert Sitzungsverläufe und Nachrichtenprotokolle

**Quellcode-Position**: `src/features/claude-code-session-state/index.ts`

**Vorteil**: Teilt dasselbe Datenverzeichnis mit Claude Code, sodass Sitzungsverläufe direkt migriert werden können.

---

## Claude Code Hooks Integration

Das `hooks`-Feld in der `settings.json` von Claude Code definiert benutzerdefinierte Skripte, die an bestimmten Ereignispunkten ausgeführt werden. Oh My OpenCode unterstützt diese Hooks vollständig.

### Hook-Ereignistypen

| Ereignis | Auslösezeitpunkt | Mögliche Aktionen |
| --- | --- | --- |
| **PreToolUse** | Vor Tool-Ausführung | Tool-Aufruf blockieren, Eingabeparameter ändern, Kontext einfügen |
| **PostToolUse** | Nach Tool-Ausführung | Warnungen hinzufügen, Ausgabe ändern, Nachrichten einfügen |
| **UserPromptSubmit** | Bei Benutzer-Prompt-Übermittlung | Prompt blockieren, Nachrichten einfügen, Prompt transformieren |
| **Stop** | Wenn Sitzung in Leerlauf geht | Folge-Prompts einfügen, automatisierte Aufgaben ausführen |

**Quellcode-Position**: `src/hooks/claude-code-hooks/index.ts`

### Hook-Konfigurationsbeispiel

Hier ist eine typische Claude Code Hooks-Konfiguration:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**Feldbeschreibung**:

- **matcher**: Tool-Namen-Matching-Muster (unterstützt Wildcard `*`)
- **type**: Hook-Typ (`command`, `inject` usw.)
- **command**: Auszuführender Shell-Befehl (unterstützt Variablen wie `$FILE`)
- **content**: Einzufügender Nachrichteninhalt

### Hook-Ausführungsmechanismus

Oh My OpenCode führt diese benutzerdefinierten Hooks automatisch über den `claude-code-hooks` Hook aus. Dieser Hook prüft und lädt die Claude Code Konfiguration an allen Ereignispunkten.

**Quellcode-Position**: `src/hooks/claude-code-hooks/index.ts:36-401`

**Ausführungsablauf**:

1. Lädt die `settings.json` von Claude Code
2. Parst das `hooks`-Feld und gleicht das aktuelle Ereignis ab
3. Führt übereinstimmende Hooks in Reihenfolge aus
4. Ändert das Agent-Verhalten basierend auf dem Rückgabeergebnis (blockieren, einfügen, warnen usw.)

**Beispiel**: Wenn ein PreToolUse Hook `deny` zurückgibt, wird der Tool-Aufruf blockiert und der Agent erhält eine Fehlermeldung.

---

## Häufige Anwendungsfälle

### Szenario 1: Migration von Claude Code Konfigurationen

Wenn Sie bereits Commands und Skills in Claude Code konfiguriert haben, können Sie diese direkt in OpenCode verwenden:

**Schritte**:

1. Stellen Sie sicher, dass das Verzeichnis `~/.claude/` existiert und Ihre Konfigurationen enthält
2. Starten Sie OpenCode – Oh My OpenCode lädt diese Konfigurationen automatisch
3. Geben Sie `/` im Chat ein, um die geladenen Commands anzuzeigen
4. Verwenden Sie Commands oder rufen Sie Skills auf

**Verifizierung**: Überprüfen Sie die Anzahl der geladenen Konfigurationen in den Startprotokollen von Oh My OpenCode.

### Szenario 2: Projektspezifische Konfigurationsüberschreibung

Sie möchten für ein bestimmtes Projekt andere Skills verwenden, ohne andere Projekte zu beeinflussen:

**Schritte**:

1. Erstellen Sie ein `.claude/skills/`-Verzeichnis im Projektstammverzeichnis
2. Fügen Sie projektspezifische Skills hinzu (z.B. `./.claude/skills/my-skill/SKILL.md`)
3. Starten Sie OpenCode neu
4. Skills auf Projektebene überschreiben automatisch Skills auf Benutzerebene

**Vorteil**: Jedes Projekt kann unabhängige Konfigurationen haben, die sich nicht gegenseitig beeinflussen.

### Szenario 3: Claude Code Kompatibilität deaktivieren

Sie möchten nur native OpenCode Konfigurationen verwenden und keine alten Claude Code Konfigurationen laden:

**Schritte**:

1. Bearbeiten Sie `oh-my-opencode.json`
2. Fügen Sie folgende Konfiguration hinzu:

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. Starten Sie OpenCode neu

**Ergebnis**: Das System ignoriert alle Claude Code Konfigurationen und verwendet nur native OpenCode Konfigurationen.

---

## Häufige Stolpersteine

### ⚠️ Konfigurationskonflikte

**Problem**: Wenn gleichnamige Konfigurationen an mehreren Speicherorten existieren (z.B. derselbe Command-Name in `.opencode/command/` und `~/.claude/commands/`), kann dies zu unvorhersehbarem Verhalten führen.

**Lösung**: Verstehen Sie die Ladepriorität und platzieren Sie die wichtigste Konfiguration im Verzeichnis mit der höchsten Priorität.

### ⚠️ Unterschiede im MCP-Konfigurationsformat

**Problem**: Das MCP-Konfigurationsformat von Claude Code unterscheidet sich leicht von OpenCode – direktes Kopieren funktioniert möglicherweise nicht.

**Lösung**: Oh My OpenCode konvertiert das Format automatisch, aber es wird empfohlen, die offizielle Dokumentation zu konsultieren, um sicherzustellen, dass die Konfiguration korrekt ist.

**Quellcode-Position**: `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Performance-Auswirkungen durch Hooks

**Problem**: Zu viele Hooks oder komplexe Hook-Skripte können zu Performance-Einbußen führen.

**Lösung**: Begrenzen Sie die Anzahl der Hooks und behalten Sie nur notwendige Hooks. Sie können bestimmte Hooks über `disabled_hooks` deaktivieren.

---

## Zusammenfassung

Oh My OpenCode bietet eine vollständige Claude Code Kompatibilitätsschicht, die es Ihnen ermöglicht, bestehende Konfigurationen nahtlos zu migrieren und wiederzuverwenden:

- **Priorität beim Laden von Konfigurationen**: Konfigurationen werden in der Reihenfolge Projektebene > Benutzerebene > Claude Code Kompatibilität geladen
- **Kompatibilitätsschalter**: Präzise Steuerung, welche Funktionen über das `claude_code`-Feld geladen werden
- **Datenspeicher-Kompatibilität**: Teilt das `~/.claude/`-Verzeichnis und unterstützt Migration von Sitzungs- und Aufgabendaten
- **Hooks-Integration**: Vollständige Unterstützung für das Lifecycle-Hook-System von Claude Code

Wenn Sie von Claude Code migrieren, ermöglicht Ihnen diese Kompatibilitätsschicht, OpenCode ohne Konfiguration zu nutzen.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Konfigurationsreferenz](../configuration-reference/)**.
>
> Sie werden lernen:
> - Vollständige Beschreibung der `oh-my-opencode.json` Konfigurationsfelder
> - Typ, Standardwert und Einschränkungen für jedes Feld
> - Häufige Konfigurationsmuster und Best Practices

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-26

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Claude Code Hooks Haupteinstiegspunkt | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Hooks Konfigurationsladen | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| MCP Konfigurationslader | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Commands Lader | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Skills Lader | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Plugins Lader | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | Vollständig |
| Datenspeicher-Kompatibilität | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | Vollständig |
| MCP Konfigurationskonverter | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | Vollständig |
| Umgebungsvariablen-Expansion | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | Vollständig |

**Wichtige Funktionen**:

- `createClaudeCodeHooksHook()`: Erstellt den Claude Code Hooks Integrations-Hook, verarbeitet alle Ereignisse (PreToolUse, PostToolUse, UserPromptSubmit, Stop)
- `loadClaudeHooksConfig()`: Lädt die `settings.json` Konfiguration von Claude Code
- `loadMcpConfigs()`: Lädt MCP-Server-Konfigurationen, unterstützt Umgebungsvariablen-Expansion
- `loadAllCommands()`: Lädt Commands aus 4 Verzeichnissen und führt sie nach Priorität zusammen
- `discoverSkills()`: Lädt Skills aus 4 Verzeichnissen, unterstützt Claude Code kompatible Pfade
- `getClaudeConfigDir()`: Ruft den Claude Code Konfigurationsverzeichnispfad ab (plattformabhängig)

**Wichtige Konstanten**:

- Priorität beim Laden von Konfigurationen: `.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Hook-Ereignistypen: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `PreCompact`

</details>
