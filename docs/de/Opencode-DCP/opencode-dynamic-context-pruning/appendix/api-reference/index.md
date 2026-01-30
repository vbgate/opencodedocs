---
title: "API-Referenz: Plugin-Schnittstellendokumentation | opencode-dynamic-context-pruning"
sidebarTitle: "Plugin-API-Referenz"
subtitle: "DCP API-Referenz"
description: "Vollständige API-Referenzdokumentation für das OpenCode DCP-Plugin mit detaillierten Erläuterungen zu Plugin-Einstiegsfunktionen, Konfigurationsschnittstellen, Tool-Definitionen, Hook-Handlern und Session-Zustandsverwaltung."
tags:
  - "API"
  - "Plugin-Entwicklung"
  - "Schnittstellenreferenz"
prerequisite:
  - "start-configuration"
order: 3
---

# DCP API-Referenz

## Was Sie lernen werden

Dieser Abschnitt bietet Plugin-Entwicklern eine vollständige API-Referenz für DCP, mit der Sie:

- Den Plugin-Einstiegspunkt und Hook-Mechanismus von DCP verstehen
- Die Konfigurationsschnittstelle und alle Konfigurationsoptionen beherrschen
- Die Spezifikationen der discard- und extract-Tools kennenlernen
- Die Zustandsverwaltungs-API für Session-Zustandsoperationen nutzen

## Kernkonzepte

Das DCP-Plugin basiert auf dem OpenCode Plugin SDK und implementiert Context-Pruning-Funktionalität durch Registrierung von Hooks, Tools und Befehlen.

**Plugin-Lebenszyklus**:

```
1. OpenCode lädt das Plugin
    ↓
2. Plugin-Funktion wird ausgeführt
    ↓
3. Hooks, Tools, Befehle werden registriert
    ↓
4. OpenCode ruft Hooks zur Nachrichtenverarbeitung auf
    ↓
5. Plugin führt Pruning-Logik aus
    ↓
6. Modifizierte Nachrichten werden zurückgegeben
```

---

## Plugin-Einstiegs-API

### Plugin-Funktion

Die Haupteinstiegsfunktion von DCP, die ein Plugin-Konfigurationsobjekt zurückgibt.

**Signatur**:

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // Plugin-Initialisierungslogik
    return {
        // Registrierte Hooks, Tools, Befehle
    }) satisfies Plugin

export default plugin
```

**Parameter**:

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| ctx | `PluginInput` | OpenCode-Plugin-Kontext mit client, directory und weiteren Informationen |

**Rückgabewert**:

Plugin-Konfigurationsobjekt mit folgenden Feldern:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `experimental.chat.system.transform` | `Handler` | System-Prompt-Injektions-Hook |
| `experimental.chat.messages.transform` | `Handler` | Nachrichtentransformations-Hook |
| `chat.message` | `Handler` | Nachrichtenerfassungs-Hook |
| `command.execute.before` | `Handler` | Befehlsausführungs-Hook |
| `tool` | `Record<string, Tool>` | Registrierte Tool-Zuordnung |
| `config` | `ConfigHandler` | Konfigurationsmutations-Hook |

**Quellcode-Position**: [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## Konfigurations-API

### PluginConfig-Schnittstelle

Vollständige Konfigurationstypdefinition für DCP.

```typescript
export interface PluginConfig {
    enabled: boolean
    debug: boolean
    pruneNotification: "off" | "minimal" | "detailed"
    commands: Commands
    turnProtection: TurnProtection
    protectedFilePatterns: string[]
    tools: Tools
    strategies: {
        deduplication: Deduplication
        supersedeWrites: SupersedeWrites
        purgeErrors: PurgeErrors
    }
}
```

**Quellcode-Position**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### Konfigurationsoptionen im Detail

#### Konfiguration auf oberster Ebene

| Option | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Ob das Plugin aktiviert ist |
| `debug` | `boolean` | `false` | Ob Debug-Logging aktiviert ist, Logs werden nach `~/.config/opencode/logs/dcp/` geschrieben |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | Benachrichtigungsanzeigemodus |
| `protectedFilePatterns` | `string[]` | `[]` | Liste der Dateischutz-Glob-Muster, übereinstimmende Dateien werden nicht bereinigt |

#### Commands-Konfiguration

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Ob der `/dcp`-Befehl aktiviert ist |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Liste der befehlsgeschützten Tools, diese werden nicht durch `/dcp sweep` bereinigt |

#### TurnProtection-Konfiguration

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Ob Rundenschutz aktiviert ist |
| `turns` | `number` | `4` | Anzahl der geschützten Runden, Tools der letzten N Runden werden nicht bereinigt |

#### Tools-Konfiguration

```typescript
export interface Tools {
    settings: ToolSettings
    discard: DiscardTool
    extract: ExtractTool
}
```

**ToolSettings**:

```typescript
export interface ToolSettings {
    nudgeEnabled: boolean
    nudgeFrequency: number
    protectedTools: string[]
}
```

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `nudgeEnabled` | `boolean` | `true` | Ob KI-Erinnerungen aktiviert sind |
| `nudgeFrequency` | `number` | `10` | Erinnerungsfrequenz, erinnert die KI alle N Tool-Ergebnisse an die Verwendung von Pruning-Tools |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Liste der geschützten Tools |

**DiscardTool**:

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Ob das discard-Tool aktiviert ist |

**ExtractTool**:

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Ob das extract-Tool aktiviert ist |
| `showDistillation` | `boolean` | `false` | Ob extrahierte Inhalte in Benachrichtigungen angezeigt werden |

#### Strategies-Konfiguration

**Deduplication**:

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Ob die Deduplizierungsstrategie aktiviert ist |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Liste der Tools, die nicht dedupliziert werden |

**SupersedeWrites**:

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Ob die Überschreibungsstrategie aktiviert ist |

**PurgeErrors**:

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Ob die Fehlerbereinigungsstrategie aktiviert ist |
| `turns` | `number` | `4` | Schwellenwert für Fehlerbereinigung (Rundenanzahl) |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Liste der Tools, die nicht bereinigt werden |

### getConfig-Funktion

Lädt und führt mehrstufige Konfigurationen zusammen.

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**Parameter**:

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| ctx | `PluginInput` | OpenCode-Plugin-Kontext |

**Rückgabewert**:

Zusammengeführtes Konfigurationsobjekt, Priorität von hoch nach niedrig:

1. Projektkonfiguration (`.opencode/dcp.jsonc`)
2. Umgebungsvariablen-Konfiguration (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. Globale Konfiguration (`~/.config/opencode/dcp.jsonc`)
4. Standardkonfiguration (im Code definiert)

**Quellcode-Position**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## Tool-API

### createDiscardTool

Erstellt das discard-Tool zum Entfernen abgeschlossener Aufgaben oder verrauschter Tool-Ausgaben.

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Parameter**:

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| ctx | `PruneToolContext` | Tool-Kontext mit client, state, logger, config, workingDirectory |

**Tool-Spezifikation**:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `ids` | `string[]` | Erstes Element ist der Grund (`'completion'` oder `'noise'`), gefolgt von numerischen IDs |

**Quellcode-Position**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

Erstellt das extract-Tool zum Extrahieren wichtiger Erkenntnisse und anschließendem Löschen der ursprünglichen Tool-Ausgabe.

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Parameter**:

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| ctx | `PruneToolContext` | Tool-Kontext mit client, state, logger, config, workingDirectory |

**Tool-Spezifikation**:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `ids` | `string[]` | Array numerischer IDs |
| `distillation` | `string[]` | Array extrahierter Inhalte, Länge entspricht ids |

**Quellcode-Position**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## Zustands-API

### SessionState-Schnittstelle

Session-Zustandsobjekt zur Verwaltung des Laufzeitzustands einer einzelnen Session.

```typescript
export interface SessionState {
    sessionId: string | null
    isSubAgent: boolean
    prune: Prune
    stats: SessionStats
    toolParameters: Map<string, ToolParameterEntry>
    nudgeCounter: number
    lastToolPrune: boolean
    lastCompaction: number
    currentTurn: number
    variant: string | undefined
}
```

**Feldbeschreibungen**:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `sessionId` | `string \| null` | OpenCode-Session-ID |
| `isSubAgent` | `boolean` | Ob es sich um eine Sub-Agent-Session handelt |
| `prune` | `Prune` | Pruning-Zustand |
| `stats` | `SessionStats` | Statistikdaten |
| `toolParameters` | `Map<string, ToolParameterEntry>` | Tool-Aufruf-Cache (callID → Metadaten) |
| `nudgeCounter` | `number` | Kumulierte Tool-Aufrufanzahl (zum Auslösen von Erinnerungen) |
| `lastToolPrune` | `boolean` | Ob die letzte Operation ein Pruning-Tool war |
| `lastCompaction` | `number` | Zeitstempel der letzten Kontextkomprimierung |
| `currentTurn` | `number` | Aktuelle Rundennummer |
| `variant` | `string \| undefined` | Modellvariante (z.B. claude-3.5-sonnet) |

**Quellcode-Position**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### SessionStats-Schnittstelle

Token-Pruning-Statistiken auf Session-Ebene.

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**Feldbeschreibungen**:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `pruneTokenCounter` | `number` | Anzahl der in der aktuellen Session bereinigten Tokens (kumuliert) |
| `totalPruneTokens` | `number` | Historisch kumulierte Anzahl bereinigter Tokens |

**Quellcode-Position**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Prune-Schnittstelle

Pruning-Zustandsobjekt.

```typescript
export interface Prune {
    toolIds: string[]
}
```

**Feldbeschreibungen**:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `toolIds` | `string[]` | Liste der zum Pruning markierten Tool-Aufruf-IDs |

**Quellcode-Position**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### ToolParameterEntry-Schnittstelle

Metadaten-Cache für einen einzelnen Tool-Aufruf.

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**Feldbeschreibungen**:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `tool` | `string` | Tool-Name |
| `parameters` | `any` | Tool-Parameter |
| `status` | `ToolStatus \| undefined` | Tool-Ausführungsstatus |
| `error` | `string \| undefined` | Fehlermeldung (falls vorhanden) |
| `turn` | `number` | Rundennummer, in der dieser Aufruf erstellt wurde |

**ToolStatus-Enumeration**:

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**Quellcode-Position**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

Erstellt ein neues Session-Zustandsobjekt.

```typescript
export function createSessionState(): SessionState
```

**Rückgabewert**: Initialisiertes SessionState-Objekt

---

## Hook-API

### createSystemPromptHandler

Erstellt einen Hook-Handler für die System-Prompt-Injektion.

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Parameter**:

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| state | `SessionState` | Session-Zustandsobjekt |
| logger | `Logger` | Logging-System-Instanz |
| config | `PluginConfig` | Konfigurationsobjekt |

**Verhalten**:

- Prüft, ob es sich um eine Sub-Agent-Session handelt, und überspringt diese
- Prüft, ob es sich um einen internen Agenten handelt (z.B. Zusammenfassungsgenerator), und überspringt diesen
- Lädt basierend auf der Konfiguration die entsprechende Prompt-Vorlage (both/discard/extract)
- Injiziert Pruning-Tool-Anweisungen in den System-Prompt

**Quellcode-Position**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

Erstellt einen Hook-Handler für die Nachrichtentransformation, der die automatische Pruning-Logik ausführt.

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Parameter**:

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| client | `any` | OpenCode-Client-Instanz |
| state | `SessionState` | Session-Zustandsobjekt |
| logger | `Logger` | Logging-System-Instanz |
| config | `PluginConfig` | Konfigurationsobjekt |

**Verarbeitungsablauf**:

1. Prüft den Session-Zustand (ob Sub-Agent)
2. Synchronisiert den Tool-Cache
3. Führt automatische Strategien aus (Deduplizierung, Überschreibung, Fehlerbereinigung)
4. Prunt markierte Tool-Inhalte
5. Injiziert die `<prunable-tools>`-Liste
6. Speichert Kontext-Snapshot (falls konfiguriert)

**Quellcode-Position**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

Erstellt einen Hook-Handler für die Befehlsausführung, der `/dcp`-Befehle verarbeitet.

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**Parameter**:

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| client | `any` | OpenCode-Client-Instanz |
| state | `SessionState` | Session-Zustandsobjekt |
| logger | `Logger` | Logging-System-Instanz |
| config | `PluginConfig` | Konfigurationsobjekt |
| workingDirectory | `string` | Arbeitsverzeichnispfad |

**Unterstützte Befehle**:

- `/dcp` - Zeigt Hilfeinformationen an
- `/dcp context` - Zeigt Token-Nutzungsanalyse der aktuellen Session
- `/dcp stats` - Zeigt kumulierte Pruning-Statistiken
- `/dcp sweep [n]` - Manuelles Tool-Pruning (optional mit Anzahlangabe)

**Quellcode-Position**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## Zusammenfassung

Dieser Abschnitt bietet eine vollständige API-Referenz für das DCP-Plugin, einschließlich:

- Plugin-Einstiegsfunktion und Hook-Registrierungsmechanismus
- Konfigurationsschnittstelle und detaillierte Beschreibung aller Konfigurationsoptionen
- Spezifikationen und Erstellungsmethoden für discard- und extract-Tools
- Typdefinitionen für Session-Zustand, Statistikdaten und Tool-Cache
- Hook-Handler für System-Prompt, Nachrichtentransformation und Befehlsausführung

Wenn Sie die internen Implementierungsdetails von DCP vertiefen möchten, empfehlen wir die Lektüre der [Architekturübersicht](/de/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/) und der [Token-Berechnungsprinzipien](/de/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/).

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Plugin-Einstiegsfunktion | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102) | 12-102 |
| Konfigurationsschnittstellen-Definition | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66 |
| getConfig-Funktion | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| discard-Tool-Erstellung | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181 |
| extract-Tool-Erstellung | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Zustandstyp-Definition | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39 |
| System-Prompt-Hook | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53 |
| Nachrichtentransformations-Hook | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82) | 55-82 |
| Befehlsausführungs-Hook | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156 |

**Wichtige Typen**:
- `Plugin`: OpenCode-Plugin-Funktionssignatur
- `PluginConfig`: DCP-Konfigurationsschnittstelle
- `SessionState`: Session-Zustandsschnittstelle
- `ToolStatus`: Tool-Status-Enumeration (pending | running | completed | error)

**Wichtige Funktionen**:
- `plugin()`: Plugin-Einstiegsfunktion
- `getConfig()`: Lädt und führt Konfigurationen zusammen
- `createDiscardTool()`: Erstellt das discard-Tool
- `createExtractTool()`: Erstellt das extract-Tool
- `createSessionState()`: Erstellt den Session-Zustand

</details>
