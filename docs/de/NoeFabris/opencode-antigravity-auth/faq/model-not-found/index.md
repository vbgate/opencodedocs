---
title: "Modellfehler-Behebung: 400- und MCP-Probleme lösen | opencode-antigravity-auth"
sidebarTitle: "Was tun, wenn Modell nicht gefunden wird?"
subtitle: "Modell nicht gefunden und 400-Fehler beheben"
description: "Lernen Sie, Antigravity-Modellfehler zu beheben. Deckt Diagnose- und Reparaturabläufe für Model not found- und 400 Unknown name parameters-Fehler ab sowie die Fehlersuche und Lösung von MCP-Server-Kompatibilitätsproblemen, um Ihnen eine schnelle Problemlokalisierung zu ermöglichen."
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# Modell nicht gefunden und 400-Fehler beheben

## Probleme, die Sie haben

Bei der Verwendung von Antigravity-Modellen können die folgenden Fehler auftreten:

| Fehlermeldung | Typisches Symptom |
| --- | --- |
| `Model not found` | Modell nicht gefunden, Anfrage kann nicht gestartet werden |
| `Invalid JSON payload received. Unknown name "parameters"` | 400-Fehler, Tool-Aufruf fehlgeschlagen |
| MCP-Server-Aufruf-Fehler | Bestimmte MCP-Tools können nicht verwendet werden |

Diese Probleme hängen normalerweise mit der Konfiguration, MCP-Server-Kompatibilität oder Plugin-Version zusammen.

## Schnelle Diagnose

Bevor Sie mit der tieferen Fehlersuche beginnen, vergewissern Sie sich:

**macOS/Linux**:
```bash
# Plugin-Version prüfen
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# Konfigurationsdatei prüfen
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows**:
```powershell
# Plugin-Version prüfen
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# Konfigurationsdatei prüfen
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## Problem 1: Model not found

**Fehlersymptom**:

```
Model not found: antigravity-claude-sonnet-4-5
```

**Ursache**: Der Google-Provider in OpenCode fehlt das Feld `npm`.

**Lösung**:

Fügen Sie in Ihrer `~/.config/opencode/opencode.json` dem `google`-Provider das Feld `npm` hinzu:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

**Schritte zur Überprüfung**:

1. Bearbeiten Sie `~/.config/opencode/opencode.json`
2. Speichern Sie die Datei
3. Versuchen Sie in OpenCode erneut, das Modell aufzurufen
4. Prüfen Sie, ob weiterhin der Fehler "Model not found" auftritt

::: tip Tipp
Wenn Sie sich nicht sicher sind, wo sich die Konfigurationsdatei befindet, führen Sie aus:
```bash
opencode config path
```
:::

---

## Problem 2: 400-Fehler - Unknown name 'parameters'

**Fehlersymptom**:

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**Was ist das Problem?**

Gemini 3-Modelle verwenden eine **strenge Protobuf-Validierung**, und die Antigravity-API erfordert ein bestimmtes Format für Tool-Definitionen:

```json
// ❌ Falsches Format (wird abgelehnt)
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← Dieses Feld wird nicht akzeptiert
    }
  ]
}

// ✅ Richtiges Format
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← Innerhalb von functionDeclarations
        }
      ]
    }
  ]
}
```

Das Plugin konvertiert das Format automatisch, aber einige **MCP-Server geben Schemas zurück, die inkompatible Felder enthalten** (wie `const`, `$ref`, `$defs`), was zum Scheitern der Bereinigung führt.

### Lösung 1: Auf neueste Beta-Version aktualisieren

Die neueste Beta-Version enthält Schema-Bereinigungs-Fixes:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**macOS/Linux**:
```bash
npm install -g opencode-antigravity-auth@beta
```

**Windows**:
```powershell
npm install -g opencode-antigravity-auth@beta
```

### Lösung 2: MCP-Server einzeln deaktivieren und Fehlersuche betreiben

Einige MCP-Server geben Schemas im falschen Format zurück, das nicht mit Antigravity kompatibel ist.

**Schritte**:

1. Öffnen Sie `~/.config/opencode/opencode.json`
2. Finden Sie die `mcpServers`-Konfiguration
3. **Deaktivieren Sie alle MCP-Server** (auskommentieren oder löschen)
4. Versuchen Sie erneut, das Modell aufzurufen
5. Wenn es funktioniert, **aktivieren Sie die MCP-Server einzeln**, und testen Sie jedes Mal
6. Sobald Sie den MCP-Server gefunden haben, der den Fehler verursacht, deaktivieren Sie ihn oder melden Sie das Problem dem Projektverantwortlichen

**Beispielkonfiguration**:

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← Temporär deaktiviert
    // "github": { ... },       ← Temporär deaktiviert
    "brave-search": { ... }     ← Testen Sie erst diesen
  }
}
```

### Lösung 3: npm-Override hinzufügen

Wenn die obigen Methoden nicht funktionieren, erzwingen Sie die Verwendung von `@ai-sdk/google` in der `google`-Provider-Konfiguration:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google"
    }
  }
}
```

---

## Problem 3: MCP-Server verursachen Tool-Aufruffehler

**Fehlersymptom**:

- Bestimmte Tools können nicht verwendet werden (wie WebFetch, Dateioperationen, etc.)
- Fehlermeldung bezieht sich auf Schema-bezogene Probleme
- Andere Tools funktionieren normal

**Ursache**: MCP-Server geben JSON Schemas zurück, die Felder enthalten, die von der Antigravity-API nicht unterstützt werden.

### Inkompatible Schema-Eigenschaften

Das Plugin bereinigt automatisch die folgenden inkompatiblen Eigenschaften (Quelle `src/plugin/request-helpers.ts:24-37`):

| Eigenschaft | Konvertierungsmethode | Beispiel |
| --- | --- | --- |
| `const` | Konvertiert zu `enum` | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | Konvertiert zu description hint | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "See: Foo" }` |
| `$defs` / `definitions` | Wird in Schema entfaltet | Referenzen werden nicht mehr verwendet |
| `minLength` / `maxLength` / `pattern` | Wird in description verschoben | Wird zu `description`-Hinweis hinzugefügt |
| `additionalProperties` | Wird in description verschoben | Wird zu `description`-Hinweis hinzugefügt |

Wenn die Schema-Struktur jedoch zu komplex ist (wie mehrschichtig verschachtelte `anyOf`/`oneOf`), kann die Bereinigung fehlschlagen.

### Fehlersuche-Workflow

```bash
# Debug-Logging aktivieren
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# OpenCode neu starten

# Schema-Konvertierungsfehler in Logs ansehen
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**Schlüsselwörter in Logs suchen**:

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### Problem melden

Wenn Sie festgestellt haben, dass ein MCP-Server das Problem verursacht, reichen Sie bitte ein [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues) ein, das folgendes enthält:

1. **MCP-Server-Name und -Version**
2. **Vollständiges Fehlerprotokoll** (aus `~/.config/opencode/antigravity-logs/`)
3. **Beispiel für das Problem verursachende Tool**
4. **Plugin-Version** (führen Sie `opencode --version` aus)

---

## Stolperfallen-Warnungen

::: warning Plugin-Deaktivierungsreihenfolge

Wenn Sie gleichzeitig `opencode-antigravity-auth` und `@tarquinen/opencode-dcp` verwenden, **platzieren Sie das Antigravity Auth Plugin davor**:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← Muss vor DCP sein
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

DCP erstellt Synthesenachrichten des Assistenten ohne Denkblöcke, was zu Signaturverifizierungsfehlern führen kann.
:::

::: warning Konfigurationsschlüsselfehler

Stellen Sie sicher, dass Sie `plugin` (Singular) und nicht `plugins` (Plural) verwenden:

```json
// ❌ Falsch
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ Richtig
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```
:::

---

## Wann Sie Hilfe suchen sollten

Wenn das Problem auch nach dem Ausprobieren aller oben genannten Methoden weiterhin besteht:

**Protokolldateien überprüfen**:
```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**Konto zurücksetzen** (alle Zustände löschen):
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**GitHub issue einreichen**, das enthält:
- Vollständige Fehlermeldung
- Plugin-Version (`opencode --version`)
- `~/.config/opencode/antigravity.json`-Konfiguration (**Entfernen Sie sensible Informationen wie refreshToken**)
- Debug-Protokoll (`~/.config/opencode/antigravity-logs/latest.log`)

---

## Verwandte Tutorials

- [Schnellinstallationsanleitung](/de/NoeFabris/opencode-antigravity-auth/start/quick-install/) - Grundkonfiguration
- [Plugin-Kompatibilität](/de/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) - Fehlerbehebung bei anderen Plugin-Konflikten
- [Debug-Logging](/de/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) - Detaillierte Protokollierung aktivieren

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Letzte Aktualisierung: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| JSON Schema Cleanup Hauptfunktion | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| const zu enum konvertieren | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| $ref zu hints konvertieren | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| anyOf/oneOf flach machen | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Gemini Tool-Format-Konvertierung | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**Wichtige Konstanten**:
- `UNSUPPORTED_KEYWORDS`: Entfernte Schema-Schlüsselwörter (`request-helpers.ts:33-37`)
- `UNSUPPORTED_CONSTRAINTS`: Beschränkungen, die in description verschoben wurden (`request-helpers.ts:24-28`)

**Wichtige Funktionen**:
- `cleanJSONSchemaForAntigravity(schema)`: Bereinigt inkompatible JSON Schemas
- `convertConstToEnum(schema)`: Konvertiert `const` zu `enum`
- `convertRefsToHints(schema)`: Konvertiert `$ref` zu description hints
- `flattenAnyOfOneOf(schema)`: Macht `anyOf`/`oneOf`-Strukturen flach

</details>
