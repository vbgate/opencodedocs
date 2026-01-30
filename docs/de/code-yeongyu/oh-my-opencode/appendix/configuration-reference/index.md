## claude_code - Claude Code-Kompatibilitätskonfiguration

Steuert verschiedene Funktionen der Claude Code-Kompatibilitätsschicht.

### Felder

| Feld | Typ | Erforderlich | Standardwert | Beschreibung |
| --- | --- | --- | --- | --- |
| `mcp` | boolean | Nein | - | Ob `.mcp.json`-Dateien geladen werden sollen |
| `commands` | boolean | Nein | - | Ob Commands geladen werden sollen |
| `skills` | boolean | Nein | - | Ob Skills geladen werden sollen |
| `agents` | boolean | Nein | - | Ob Agents geladen werden sollen (reserviert) |
| `hooks` | boolean | Nein | - | Ob settings.json-Hooks geladen werden sollen |
| `plugins` | boolean | Nein | - | Ob Marketplace-Plugins geladen werden sollen |
| `plugins_override` | object | Nein | - | Bestimmte Plugins deaktivieren (`{pluginName: boolean}`) |

### Konfigurationsbeispiel

```jsonc
{
  "claude_code": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "hooks": false,
    "plugins": true,
    "plugins_override": {
      "some-plugin": false
    }
  }
}
```

## sisyphus_agent - Sisyphus-Agenten-Konfiguration

Steuert das Verhalten des Sisyphus-Orchestrierungssystems.

### Felder

| Feld | Typ | Erforderlich | Standardwert | Beschreibung |
| --- | --- | --- | --- | --- |
| `disabled` | boolean | Nein | false | Sisyphus-Orchestrierungssystem deaktivieren |
| `default_builder_enabled` | boolean | Nein | false | OpenCode-Builder-Agenten aktivieren |
| `planner_enabled` | boolean | Nein | true | Prometheus (Planner)-Agenten aktivieren |
| `replace_plan` | boolean | Nein | true | Standard-Plan-Agent auf Subagent herabstufen |

### Konfigurationsbeispiel

```jsonc
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

## background_task - Hintergrundaufgaben-Konfiguration

Steuert das Nebenläufigkeitsverhalten des Hintergrundagenten-Managementsystems.

### Felder

| Feld | Typ | Erforderlich | Standardwert | Beschreibung |
| --- | --- | --- | --- | --- |
| `defaultConcurrency` | number | Nein | - | Standardmäßige maximale Nebenläufigkeit |
| `providerConcurrency` | object | Nein | - | Provider-Level-Nebenläufigkeitslimit (`{providerName: number}`) |
| `modelConcurrency` | object | Nein | - | Model-Level-Nebenläufigkeitslimit (`{modelName: number}`) |
| `staleTimeoutMs` | number | Nein | 180000 | Zeitüberschreitung (Millisekunden), Minimum 60000 |

### Prioritätsreihenfolge

`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### Konfigurationsbeispiel

```jsonc
{
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,
      "google/gemini-3-flash": 10
    },
    "staleTimeoutMs": 180000
  }
}
```

## git_master - Git Master Skill-Konfiguration

Steuert das Verhalten des Git Master Skills.

### Felder

| Feld | Typ | Erforderlich | Standardwert | Beschreibung |
| --- | --- | --- | --- | --- |
| `commit_footer` | boolean | Nein | true | "Ultraworked with Sisyphus"-Footer in Commit-Nachricht hinzufügen |
| `include_co_authored_by` | boolean | Nein | true | "Co-authored-by: Sisyphus"-Trailer in Commit-Nachricht hinzufügen |

### Konfigurationsbeispiel

```jsonc
{
  "git_master": {
    "commit_footer": true,
    "include_co_authored_by": true
  }
}
```

## browser_automation_engine - Browser-Automatisierungskonfiguration

Wählt den Browser-Automatisierungs-Provider.

### Felder

| Feld | Typ | Erforderlich | Standardwert | Beschreibung |
| --- | --- | --- | --- | --- |
| `provider` | enum | Nein | `playwright` | Browser-Automatisierungs-Provider |

### provider-Optionen

| Wert | Beschreibung | Installationsanforderungen |
| --- | --- | --- |
| `playwright` | Verwendet Playwright MCP-Server | Automatische Installation |

### Konfigurationsbeispiel

```jsonc
{
  "browser_automation_engine": {
    "provider": "playwright"
  }
}
```

## tmux - Tmux-Sitzungskonfiguration

Steuert das Tmux-Sitzungsmanagement-Verhalten.

### Felder

| Feld | Typ | Erforderlich | Standardwert | Beschreibung |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Nein | false | Ob Tmux-Sitzungsmanagement aktiviert ist |
| `layout` | enum | Nein | `main-vertical` | Tmux-Layout |
| `main_pane_size` | number | Nein | 60 | Hauptfenstergröße (20-80) |
| `main_pane_min_width` | number | Nein | 120 | Mindestbreite des Hauptfensters |
| `agent_pane_min_width` | number | Nein | 40 | Mindestbreite des Agentenfensters |

### layout-Optionen

| Wert | Beschreibung |
| --- | --- |
| `main-horizontal` | Hauptfenster oben, Agentenfenster unten gestapelt |
| `main-vertical` | Hauptfenster links, Agentenfenster rechts gestapelt (Standard) |
| `tiled` | Gitter mit gleich großen Fenstern |
| `even-horizontal` | Alle Fenster horizontal angeordnet |
| `even-vertical` | Alle Fenster vertikal gestapelt |

### Konfigurationsbeispiel

```jsonc
{
  "tmux": {
    "enabled": false,
    "layout": "main-vertical",
    "main_pane_size": 60,
    "main_pane_min_width": 120,
    "agent_pane_min_width": 40
  }
}
```

