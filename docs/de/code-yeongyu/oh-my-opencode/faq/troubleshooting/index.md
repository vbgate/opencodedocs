---
title: "Fehlerbehebung: Doctor-Diagnose | oh-my-opencode"
sidebarTitle: "Probleme in 5 Minuten lokalisieren"
subtitle: "Fehlerbehebung: Doctor-Diagnose"
description: "Lernen Sie die Diagnosemethoden des Doctor-Befehls kennen, einschließlich 17+ Überprüfungen für Version, Plugins, Authentifizierung und Abhängigkeiten. Verwenden Sie die Optionen --verbose, --json, --category, um Konfigurationsprobleme schnell zu lokalisieren."
tags:
  - "Fehlerbehebung"
  - "Diagnose"
  - "Konfiguration"
prerequisite:
  - "/de/start-installation"
order: 150
---

# Konfigurationsdiagnose & Fehlerbehebung: Verwenden des Doctor-Befehls zum schnellen Lösen von Problemen

## Was Sie lernen werden

- Führen Sie `oh-my-opencode doctor` aus, um schnell 17+ Systemüberprüfungen zu diagnostizieren
- Lokalisieren und beheben Sie Probleme wie veraltete OpenCode-Version, nicht registrierte Plugins, Provider-Konfigurationsprobleme
- Verstehen Sie den Model-Auflösungsmechanismus und überprüfen Sie die Agent- und Kategorie-Modellzuweisungen
- Verwenden Sie den Verbose-Modus, um vollständige Informationen zur Problemdiagnose zu erhalten

## Ihre aktuelle Herausforderung

Nach der Installation von oh-my-opencode, was tun Sie, wenn Sie auf folgende Probleme stoßen:

- OpenCode meldet, dass das Plugin nicht geladen ist, aber die Konfigurationsdatei sieht gut aus
- Einige KI-Agenten geben immer den Fehler "Modell nicht gefunden" zurück
- Sie möchten überprüfen, ob alle Provider (Claude, OpenAI, Gemini) korrekt konfiguriert sind
- Sie sind unsicher, ob das Problem bei der Installation, Konfiguration oder Authentifizierung liegt

Die Fehlerbehebung einzeln ist zeitaufwendig. Sie benötigen ein **Diagnose-Tool mit einem Klick**.

## Kernkonzepte

**Der Doctor-Befehl ist das Systemüberprüfungssystem von oh-my-opencode**, ähnlich wie Macs Festplattendienstprogramm oder ein Diagnose-Scanner für Autos. Er überprüft systematisch Ihre Umgebung und teilt Ihnen mit, was funktioniert und was Probleme hat.

Die Überprüfungslogik des Doctor-Befehls stammt vollständig aus der Quellcode-Implementierung (`src/cli/doctor/checks/`), einschließlich:
- ✅ **Installation**: OpenCode-Version, Plugin-Registrierung
- ✅ **Konfiguration**: Konfigurationsdateiformat, Schema-Validierung
- ✅ **Authentifizierung**: Anthropic-, OpenAI-, Google-Authentifizierungs-Plugins
- ✅ **Abhängigkeiten**: Bun-, Node.js-, Git-Abhängigkeiten
- ✅ **Tools**: LSP- und MCP-Server-Status
- ✅ **Updates**: Versionsupdate-Kontrollen

## Schritt-für-Schritt-Anleitung

### Schritt 1: Grundlegende Diagnose ausführen

**Warum**
Führen Sie zuerst eine vollständige Überprüfung durch, um den allgemeinen Systemzustand zu verstehen.

```bash
bunx oh-my-opencode doctor
```

**Sie sollten sehen**:

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**Kontrollpunkt ✅**:
- [ ] Ergebnisse für 6 Kategorien sehen
- [ ] Jedes Element hat ein ✓ (bestanden), ⚠ (Warnung), ✗ (fehlgeschlagen) Markierung
- [ ] Zusammenfassungsstatistik unten

### Schritt 2: Häufige Probleme interpretieren

Basierend auf den Diagnoseergebnissen können Sie Probleme schnell lokalisieren. Hier sind häufige Fehler und Lösungen:

#### ✗ "OpenCode version too old"

**Problem**: Die OpenCode-Version ist unter 1.0.150 (Mindestanforderung)

**Ursache**: oh-my-opencode hängt von neuen OpenCode-Funktionen ab, die alte Versionen nicht unterstützen

**Lösung**:

```bash
# OpenCode aktualisieren
npm install -g opencode@latest
# Oder Bun verwenden
bun install -g opencode@latest
```

**Überprüfung**: Führen Sie `bunx oh-my-opencode doctor` erneut aus

#### ✗ "Plugin not registered"

**Problem**: Das Plugin ist nicht im `plugin`-Array von `opencode.json` registriert

**Ursache**: Installationsprozess unterbrochen oder Konfigurationsdatei manuell bearbeitet

**Lösung**:

```bash
# Installationsprogramm erneut ausführen
bunx oh-my-opencode install
```

**Quellcode-Basis** (`src/cli/doctor/checks/plugin.ts:79-117`):
- Überprüft, ob das Plugin im `plugin`-Array von `opencode.json` vorhanden ist
- Unterstützt Formate: `oh-my-opencode` oder `oh-my-opencode@version` oder `file://` Pfad

#### ✗ "Configuration has validation errors"

**Problem**: Die Konfigurationsdatei entspricht nicht der Schema-Definition

**Ursache**: Fehler während der manuellen Bearbeitung eingeführt (wie Tippfehler, Typenfehler)

**Lösung**:

1. Verwenden Sie `--verbose`, um detaillierte Fehlerinformationen anzuzeigen:

```bash
bunx oh-my-opencode doctor --verbose
```

2. Häufige Fehlertypen (aus `src/config/schema.ts`):

| Fehlermeldung | Ursache | Korrektur |
|--------------|-------|-----|
| `agents.sisyphus.mode: Invalid enum value` | `mode` kann nur `subagent`/`primary`/`all` sein | Ändern Sie zu `primary` |
| `categories.quick.model: Expected string` | `model` muss ein String sein | Fügen Sie Anführungszeichen hinzu: `"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | Gleichzeitigkeit muss eine Zahl sein | Ändern Sie zu Zahl: `3` |

3. Verweisen Sie auf die [Konfigurationsreferenz](../../appendix/configuration-reference/), um Felddefinitionen zu überprüfen

#### ⚠ "Auth plugin not installed"

**Problem**: Das Authentifizierungs-Plugin für den Provider ist nicht installiert

**Ursache**: Provider während der Installation übersprungen oder Plugin manuell deinstalliert

**Lösung**:

```bash
# Neu installieren und fehlenden Provider auswählen
bunx oh-my-opencode install
```

**Quellcode-Basis** (`src/cli/doctor/checks/auth.ts:11-15`):

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### Schritt 3: Model-Auflösung überprüfen

Die Model-Auflösung ist der Kernmechanismus von oh-my-opencode, der überprüft, ob die Agent- und Kategorie-Modellzuweisungen korrekt sind.

```bash
bunx oh-my-opencode doctor --category configuration
```

**Sie sollten sehen**:

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══

    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15
    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh

  ═══ Configured Models ═══

  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...

  Categories:
    ○ visual: google/gemini-3-pro
    ○ quick: openai/gpt-5.2-codex
    ...

  ○ = provider fallback
```

**Kontrollpunkt ✅**:
- [ ] Agent- und Kategorien-Modellzuweisungen sehen
- [ ] `○` bedeutet, dass der Provider-Fallback-Mechanismus verwendet wird (nicht manuell überschrieben)
- [ ] `●` bedeutet, dass der Benutzer das Standardmodell in der Konfiguration überschrieben hat

**Häufige Probleme**:

| Problem | Ursache | Lösung |
|-------|-------|----------|
| `unknown` Modell | Die Provider-Fallback-Kette ist leer | Stellen Sie sicher, dass mindestens ein Provider verfügbar ist |
| Modell nicht verwendet | Provider nicht verbunden | Führen Sie `opencode` aus, um den Provider zu verbinden |
| Modell überschreiben möchten | Standardmodell verwenden | Setzen Sie `agents.<name>.model` in `oh-my-opencode.json` |

**Quellcode-Basis** (`src/cli/doctor/checks/model-resolution.ts:129-148`):
- Liest verfügbare Modelle aus `~/.cache/opencode/models.json`
- Agent-Modellanforderungen: `AGENT_MODEL_REQUIREMENTS` (`src/shared/model-requirements.ts`)
- Kategorie-Modellanforderungen: `CATEGORY_MODEL_REQUIREMENTS`

### Schritt 4: JSON-Ausgabe verwenden (Skripting)

Wenn Sie die Diagnose in CI/CD automatisieren möchten, verwenden Sie das JSON-Format:

```bash
bunx oh-my-opencode doctor --json
```

**Sie sollten sehen**:

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**Anwendungsfälle**:

```bash
# Diagnosebericht in Datei speichern
bunx oh-my-opencode doctor --json > doctor-report.json

# Systemzustand in CI/CD überprüfen
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "Alle Überprüfungen bestanden"
else
  echo "Einige Überprüfungen fehlgeschlagen"
  exit 1
fi
```

## Häufige Fallstricke

### ❌ Fehler 1: Warnmeldungen ignorieren

**Problem**: Sie sehen `⚠` Markierungen und denken, sie sind "optional", obwohl sie tatsächlich wichtige Hinweise sein können

**Lösung**:
- Zum Beispiel: Die Warnung "using default model" bedeutet, dass Sie keine Kategorienmodelle konfiguriert haben, was möglicherweise nicht optimal ist
- Verwenden Sie `--verbose`, um detaillierte Informationen anzuzeigen und zu entscheiden, ob Maßnahmen erforderlich sind

### ❌ Fehler 2: opencode.json manuell bearbeiten

**Problem**: Direktes Ändern von `opencode.json` von OpenCode, wodurch die Plugin-Registrierung beschädigt wird

**Lösung**:
- Verwenden Sie `bunx oh-my-opencode install`, um erneut zu registrieren
- Oder bearbeiten Sie nur `oh-my-opencode.json`, berühren Sie nicht die Konfigurationsdatei von OpenCode

### ❌ Fehler 3: Cache nicht aktualisiert

**Problem**: Die Model-Auflösung zeigt "cache not found", aber der Provider ist konfiguriert

**Lösung**:

```bash
# OpenCode starten, um den Modell-Cache zu aktualisieren
opencode

# Oder manuell aktualisieren (falls der Befehl opencode models existiert)
opencode models --refresh
```

## Zusammenfassung

Der Doctor-Befehl ist das Schweizer Taschenmesser von oh-my-opencode, das Ihnen hilft, Probleme schnell zu lokalisieren:

| Befehl | Zweck | Wann verwenden |
|---------|---------|-------------|
| `bunx oh-my-opencode doctor` | Vollständige Diagnose | Nach der ersten Installation, bei Problemen |
| `--verbose` | Detaillierte Informationen | Wenn Sie Fehlerdetails anzeigen möchten |
| `--json` | JSON-Ausgabe | CI/CD, Skript-Automatisierung |
| `--category <name>` | Einzelkategorie-Überprüfung | Wenn Sie nur einen bestimmten Aspekt überprüfen möchten |

**Denken Sie daran**: Wann immer Sie auf ein Problem stoßen, führen Sie zuerst `doctor` aus und verstehen Sie den Fehler klar, bevor Sie Maßnahmen ergreifen.

## Nächste Schritte

> In der nächsten Lektion lernen wir **[Häufig gestellte Fragen](../faq/)**.
>
> Sie werden lernen:
> - Unterschiede zwischen oh-my-opencode und anderen KI-Tools
> - Wie Sie die Modellkosten optimieren
> - Best Practices für die Parallelitätssteuerung von Hintergrundaufgaben

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Speicherorte zu erweitern</strong></summary>

> Aktualisiert: 2026-01-26

| Funktion | Dateipfad | Zeilennummern |
|---------|-----------|-------------|
| Doctor-Befehlseinstieg | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| Alle Überprüfungsregistrierungen | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| Plugin-Registrierungsüberprüfung | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| Konfigurationsvalidierungsüberprüfung | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| Authentifizierungsüberprüfung | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| Model-Auflösungsüberprüfung | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| Konfigurations-Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| Modellanforderungsdefinition | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | Gesamte Datei |

**Wichtige Konstanten**:
- `MIN_OPENCODE_VERSION = "1.0.150"`: Mindestversionsanforderung für OpenCode
- `AUTH_PLUGINS`: Authentifizierungs-Plugin-Zuordnung (Anthropic=built-in, OpenAI/GitHub=Plugins)
- `AGENT_MODEL_REQUIREMENTS`: Agent-Modellanforderungen (Prioritätskette jedes Agents)
- `CATEGORY_MODEL_REQUIREMENTS`: Kategorie-Modellanforderungen (visual, quick, usw.)

**Wichtige Funktionen**:
- `doctor(options)`: Diagnose-Befehl ausführen, gibt Exit-Code zurück
- `getAllCheckDefinitions()`: Alle 17+ Überprüfungs-Item-Definitionen abrufen
- `checkPluginRegistration()`: Überprüfen, ob Plugin in opencode.json registriert ist
- `validateConfig(configPath)`: Konfigurationsdatei gegen Schema validieren
- `checkAuthProvider(providerId)`: Provider-Authentifizierungs-Plugin-Status überprüfen
- `checkModelResolution()`: Model-Auflösung und Zuweisung überprüfen

</details>
