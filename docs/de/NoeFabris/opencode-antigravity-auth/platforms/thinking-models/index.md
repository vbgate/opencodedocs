---
title: "Thinking Modelle | opencode-antigravity-auth"
sidebarTitle: "KI zu tiefem Denken befähigen"
subtitle: "Thinking Modelle: Denkfähigkeiten von Claude und Gemini 3"
description: "Erfahren Sie, wie Sie Claude und Gemini 3 Thinking Modelle konfigurieren. Meistern Sie thinking budget, thinking level und variant Konfiguration."
tags:
  - "Thinking Modelle"
  - "Claude Opus 4.5"
  - "Claude Sonnet 4.5"
  - "Gemini 3 Pro"
  - "Gemini 3 Flash"
  - "Variant Konfiguration"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: "4"
---

# Thinking Modelle: Denkfähigkeiten von Claude und Gemini 3

## Was Sie nach diesem Tutorial können werden

- Thinking budget für Claude Opus 4.5 und Sonnet 4.5 Thinking Modelle konfigurieren
- Thinking level von Gemini 3 Pro/Flash verwenden (minimal/low/medium/high)
- Denkflexibilität durch das OpenCode Variant-System anpassen
- Interleaved Thinking verstehen (Denkmechanismus bei Tool-Aufrufen)
- Strategien zur Beibehaltung von Denkblöcken beherrschen (keep_thinking Konfiguration)

## Ihre aktuelle Situation

Sie möchten, dass KI-Modelle bei komplexen Aufgaben besser performen – zum Beispiel bei mehrstufigem Schlussfolgern, Code-Debugging oder Architekturdesign. Aber Sie wissen:

- Normale Modelle antworten zu schnell und denken nicht tief genug
- Claude schränkt die Thinking-Funktion offiziell ein, schwer zugänglich
- Gemini 3 thinking level Konfiguration ist unklar
- Unklar, wie viel Denken ausreichend ist (budget Einstellung)
- Signaturfehler beim Lesen von Denkblöcken

## Wann Sie diese Technik anwenden sollten

**Anwendungsfälle**:
- Komplexe Probleme, die mehrstufiges Schlussfolgern erfordern (Algorithmendesign, Systemarchitektur)
- Sorgfältiges Code-Review oder Debugging
- Tiefenanalyse von langen Dokumenten oder Codebasen
- Aufgaben mit intensiver Tool-Nutzung (benötigt interleaved thinking)

**Nicht geeignet für**:
- Einfache Fragen (verschwendet thinking quota)
- Schnelle Prototypenvalidierung (Geschwindigkeit hat Priorität)
- Tatsachenabfragen (kein Schlussfolgern erforderlich)

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungsprüfung

 1. **Plugin-Installation und Authentifizierung abgeschlossen**: Siehe [Schnellinstallation](../../start/quick-install/) und [Erste Authentifizierung](../../start/first-auth-login/)
 2. **Grundlegende Modellnutzung verstanden**: Siehe [Erste Anfrage](../../start/first-request/)
 3. **Verfügbare Thinking Modelle**: Stellen Sie sicher, dass Ihr Konto Zugriff auf Claude Opus 4.5/Sonnet 4.5 Thinking oder Gemini 3 Pro/Flash hat

:::

---

## Kernkonzepte

### Was sind Thinking Modelle

**Thinking Modelle** führen vor der Generierung der endgültigen Antwort zunächst internes Schlussfolgern durch (Denkblöcke). Diese Denkinhalte:

- **Werden nicht berechnet**: Thinking tokens zählen nicht zum normalen Output-Kontingent (genaue Berechnungsregeln laut Antigravity-Offiziell)
- **Verbessern die推理质量**: Mehr Denken → genauere, logischere Antworten
- **Kosten Zeit**: Thinking erhöht die Antwortlatenz, bringt aber bessere Ergebnisse

**Wichtige Unterschiede**:

| Normale Modelle | Thinking Modelle |
| --- | --- |
| Generieren Antworten direkt | Erst denken → dann Antwort generieren |
| Schnell aber möglicherweise oberflächlich | Langsam aber tiefer |
| Für einfache Aufgaben geeignet | Für komplexe Aufgaben geeignet |

### Zwei Thinking-Implementierungen

Das Antigravity Auth Plugin unterstützt zwei Thinking-Implementierungen:

#### Claude Thinking (Opus 4.5, Sonnet 4.5)

- **Token-basiertes Budget**: Zahlen zur Denkkontrolle (z.B. 8192, 32768)
- **Interleaved thinking**: Kann vor und nach Tool-Aufrufen denken
- **Snake_case keys**: Verwendung von `include_thoughts`, `thinking_budget`

#### Gemini 3 Thinking (Pro, Flash)

- **Level-basiert**: Zeichenketten zur Denkintensitätskontrolle (minimal/low/medium/high)
- **CamelCase keys**: Verwendung von `includeThoughts`, `thinkingLevel`
- **Modellunterschiede**: Flash unterstützt alle 4 Levels, Pro nur low/high

---

## Anleitung

### Schritt 1: Thinking Modelle über Variant konfigurieren

Das OpenCode Variant-System ermöglicht die direkte Auswahl der Denkintensität im Modell-Auswahlmenü, ohne komplexe Modellnamen merken zu müssen.

#### Bestehende Konfiguration überprüfen

Überprüfen Sie Ihre Modellkonfigurationsdatei (normalerweise in `.opencode/models.json` oder im Systemkonfigurationsverzeichnis):

```bash
## Modellkonfiguration anzeigen
cat ~/.opencode/models.json
```

#### Claude Thinking Modelle konfigurieren

Finden Sie `antigravity-claude-sonnet-4-5-thinking` oder `antigravity-claude-opus-4-5-thinking` und fügen Sie Varianten hinzu:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "limit": { "context": 200000, "output": 64000 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "medium": { "thinkingConfig": { "thinkingBudget": 16384 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  }
}
```

**Konfigurationserklärung**:
- `low`: 8192 tokens - Leichtes Denken, geeignet für Aufgaben mittlerer Komplexität
- `medium`: 16384 tokens - Ausgewogenes Denken und Geschwindigkeit
- `max`: 32768 tokens - Maximales Denken, für die komplexesten Aufgaben

#### Gemini 3 Thinking Modelle konfigurieren

**Gemini 3 Pro** (nur low/high unterstützt):

```json
{
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro (Antigravity)",
    "limit": { "context": 1048576, "output": 65535 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Gemini 3 Flash** (alle 4 Levels unterstützt):

```json
{
  "antigravity-gemini-3-flash": {
    "name": "Gemini 3 Flash (Antigravity)",
    "limit": { "context": 1048576, "output": 65536 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "minimal": { "thinkingLevel": "minimal" },
      "low": { "thinkingLevel": "low" },
      "medium": { "thinkingLevel": "medium" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Konfigurationserklärung**:
- `minimal`: Minimales Denken, schnellste Antwort (nur Flash)
- `low`: Leichtes Denken
- `medium`: Ausgewogenes Denken (nur Flash)
- `high`: Maximales Denken (langsamste, aber tiefste)

**Erwartetes Ergebnis**: Im OpenCode Modell-Auswahlmenü sollte nach Auswahl eines Thinking-Modells ein Variant-Dropdown-Menü erscheinen.

### Schritt 2: Anfragen mit Thinking Modellen stellen

Nach der Konfiguration können Sie Modell und Variante in OpenCode auswählen:

```bash
## Claude Sonnet 4.5 Thinking verwenden (max)
opencode run "Entwerfen Sie die Architektur eines verteilten Caching-Systems" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max

## Gemini 3 Pro verwenden (high)
opencode run "Analysieren Sie die Performance-Engpässe in diesem Code" \
  --model=google/antigravity-gemini-3-pro \
  --variant=high

## Gemini 3 Flash verwenden (minimal - schnellste)
opencode run "Fassen Sie den Inhalt dieser Datei schnell zusammen" \
  --model=google/antigravity-gemini-3-flash \
  --variant=minimal
```

**Erwartetes Ergebnis**: Das Modell gibt zunächst Denkblöcke (Denkinhalte) aus und generiert dann die endgültige Antwort.

### Schritt 3: Interleaved Thinking verstehen

Interleaved Thinking ist eine besondere Fähigkeit von Claude-Modellen – es kann vor und nach Tool-Aufrufen denken.

**Beispiel-Szenario**: KI bei der Nutzung von Tools (z.B. Dateioperationen, Datenbankabfragen) bei der Aufgabenerfüllung:

```
Thinking: Ich muss zuerst die Konfigurationsdatei lesen und dann basierend auf dem Inhalt den nächsten Schritt entscheiden...

[Tool-Aufruf: read_file("config.json")]

Tool Result: { "port": 8080, "mode": "production" }

Thinking: Der Port ist 8080, Produktionsmodus. Ich muss überprüfen, ob die Konfiguration korrekt ist...

[Tool-Aufruf: validate_config({ "port": 8080, "mode": "production" })]

Tool Result: { "valid": true }

Thinking: Die Konfiguration ist gültig. Jetzt kann ich den Dienst starten.

[Endgültige Antwort generieren]
```

**Warum wichtig**:
- Denken vor und nach Tool-Aufrufen → Intelligentere Entscheidungen
- An Tool-Ergebnisse anpassen → Strategie dynamisch anpassen
- Blindes Ausführen vermeiden → Fehlerhafte Operationen reduzieren

::: tip Plugin verarbeitet automatisch

Sie müssen interleaved thinking nicht manuell konfigurieren. Das Antigravity Auth Plugin erkennt automatisch Claude Thinking Modelle und injiziert Systemanweisungen:
- "Interleaved thinking is enabled. You may think between tool calls and after receiving tool results before deciding on next action or final answer."

:::

### Schritt 4: Strategie zur Beibehaltung von Denkblöcken steuern

Standardmäßig **entfernt das Plugin Denkblöcker** zur Verbesserung der Zuverlässigkeit (um Signaturfehler zu vermeiden). Wenn Sie Denkinhalte lesen möchten, müssen Sie `keep_thinking` konfigurieren.

#### Warum standardmäßig entfernen?

**Signaturfehler-Probleme**:
- Thinking-Blöcke erfordern in mehrstufigen Gesprächen Signaturabgleich
- Wenn alle Denkblöcke beibehalten werden, können Signaturkonflikte auftreten
- Entfernen von Denkblöcken ist eine stabilere Lösung (verliert aber Denkinhalte)

#### Beibehaltung von Denkblöcken aktivieren

Erstellen oder bearbeiten Sie die Konfigurationsdatei:

**Linux/macOS**: `~/.config/opencode/antigravity.json`

**Windows**: `%APPDATA%\opencode\antigravity.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "keep_thinking": true
}
```

Oder über Umgebungsvariable:

```bash
export OPENCODE_ANTIGRAVITY_KEEP_THINKING=1
```

**Erwartetes Ergebnis**:
- `keep_thinking: false` (Standard): Nur endgültige Antwort sichtbar, Denkblöcke ausgeblendet
- `keep_thinking: true`: Vollständiger Denkprozess sichtbar (könnte in mehrstufigen Gesprächen Signaturfehler verursachen)

::: warning Empfohlene Vorgehensweise

- **Produktionsumgebung**: Standard `keep_thinking: false` verwenden, Stabilität sicherstellen
- **Debugging/Lernen**: Vorübergehend `keep_thinking: true` aktivieren, Denkprozess beobachten
- **Bei Signaturfehlern**: `keep_thinking` deaktivieren, Plugin stellt automatisch wieder her

:::

### Schritt 5: Max Output Tokens prüfen

Claude Thinking Modelle benötigen ein größeres Output-Token-Limit (maxOutputTokens), da sonst das thinking budget möglicherweise nicht vollständig genutzt werden kann.

**Plugin verarbeitet automatisch**:
- Wenn Sie thinking budget einstellen, passt das Plugin automatisch `maxOutputTokens` auf 64.000 an
- Quellposition: `src/plugin/transform/claude.ts:78-90`

**Manuelle Konfiguration (optional)**:

Wenn Sie `maxOutputTokens` manuell einstellen, stellen Sie sicher, dass es größer als das thinking budget ist:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "variants": {
      "max": {
        "thinkingConfig": { "thinkingBudget": 32768 },
        "maxOutputTokens": 64000  // Muss >= thinkingBudget sein
      }
    }
  }
}
```

**Erwartetes Ergebnis**:
- Wenn `maxOutputTokens` zu klein ist, passt das Plugin automatisch auf 64.000 an
- In Debug-Protokollen wird "Adjusted maxOutputTokens for thinking model" angezeigt

---

## Prüfpunkte ✅

Überprüfen Sie, ob Ihre Konfiguration korrekt ist:

### 1. Variant-Sichtbarkeit überprüfen

In OpenCode:

1. Modell-Auswahlmenü öffnen
2. `Claude Sonnet 4.5 Thinking` auswählen
3. Prüfen, ob Variant-Dropdown-Menü vorhanden ist (low/medium/max)

**Erwartetes Ergebnis**: 3 Variant-Optionen sichtbar.

### 2. Thinking-Inhaltsausgabe überprüfen

```bash
opencode run "Denken Sie 3 Schritte: 1+1=? Warum?" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max
```

**Erwartetes Ergebnis**:
- Wenn `keep_thinking: true`: Detaillierter Denkprozess sichtbar
- Wenn `keep_thinking: false` (Standard): Antwort "2" direkt sehen

### 3. Interleaved Thinking überprüfen (Tool-Aufruf erforderlich)

```bash
## Aufgaben verwenden, die Tool-Aufrufe erfordern
opencode run "Listen Sie die Dateien im aktuellen Verzeichnis auf und fassen Sie die Dateitypen zusammen" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=medium
```

**Erwartetes Ergebnis**:
- Denkinhalte vor und nach Tool-Aufrufen sichtbar
- KI passt Strategie basierend auf Tool-Ergebnissen an

---

## Häufige Fehler

### ❌ Fehler 1: Thinking Budget überschreitet Max Output Tokens

**Problem**: `thinkingBudget: 32768` eingestellt, aber `maxOutputTokens: 20000`

**Fehlermeldung**:
```
Invalid argument: max_output_tokens must be greater than or equal to thinking_budget
```

**Lösung**:
- Plugin automatisch handeln lassen (empfohlen)
- Oder manuell `maxOutputTokens >= thinkingBudget` einstellen

### ❌ Fehler 2: Gemini 3 Pro verwendet unsupported level

**Problem**: Gemini 3 Pro unterstützt nur low/high, aber Sie versuchen `minimal` zu verwenden

**Fehlermeldung**:
```
Invalid argument: thinking_level "minimal" not supported for gemini-3-pro
```

**Lösung**: Nur Levels verwenden, die Pro unterstützt (low/high)

### ❌ Fehler 3: Mehrstufiger Gesprächssignaturfehler (keep_thinking: true)

**Problem**: Nach Aktivierung von `keep_thinking: true` tritt in mehrstufigen Gesprächen ein Fehler auf

**Fehlermeldung**:
```
Signature mismatch in thinking blocks
```

**Lösung**:
- Vorübergehend `keep_thinking` deaktivieren: `export OPENCODE_ANTIGRAVITY_KEEP_THINKING=0`
- Oder Gespräch neu starten

### ❌ Fehler 4: Variant wird nicht angezeigt

**Problem**: Variants konfiguriert, aber in OpenCode Modell-Auswahlmenü nicht sichtbar

**Mögliche Ursachen**:
- Konfigurationsdateipfad falsch
- JSON-Syntaxfehler (fehlende Kommas, Anführungszeichen)
- Modell-ID stimmt nicht überein

**Lösung**:
1. Konfigurationsdateipfad prüfen: `~/.opencode/models.json` oder `~/.config/opencode/models.json`
2. JSON-Syntax validieren: `cat ~/.opencode/models.json | python -m json.tool`
3. Prüfen, ob Modell-ID mit Plugin-Return übereinstimmt

---

## Zusammenfassung

Thinking Modelle verbessern die Antwortqualität bei komplexen Aufgaben durch internes Schlussfolgern vor der Antwortgenerierung:

| Funktion | Claude Thinking | Gemini 3 Thinking |
| --- | --- | --- |
| **Konfigurationsmethode** | `thinkingBudget` (Zahl) | `thinkingLevel` (Zeichenkette) |
| **Levels** | Benutzerdefiniertes Budget | minimal/low/medium/high |
| **Keys** | snake_case (`include_thoughts`) | camelCase (`includeThoughts`) |
| **Interleaved** | ✅ Unterstützt | ❌ Nicht unterstützt |
| **Max Output** | Automatisch auf 64.000 angepasst | Standardwert verwenden |

**Wichtige Konfigurationen**:
- **Variant-System**: Konfiguration über `thinkingConfig.thinkingBudget` (Claude) oder `thinkingLevel` (Gemini 3)
- **keep_thinking**: Standard false (stabil), true (Denkinhalte lesbar)
- **Interleaved thinking**: Automatisch aktiviert, keine manuelle Konfiguration erforderlich

---

## Nächstes Tutorial

> Im nächsten Tutorial lernen wir **[Google Search Grounding](../google-search-grounding/)**.
>
> Sie werden lernen:
> - Google Search-Abruf für Gemini-Modelle aktivieren
> - Dynamische Abrufschwellenwerte konfigurieren
> - Faktenaccuracy verbessern, Halluzinationen reduzieren

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Positionen</strong></summary>

> Letzte Aktualisierung: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Claude Thinking Konfigurationsaufbau | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 62-72 |
| Gemini 3 Thinking Konfigurationsaufbau | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 163-171 |
| Gemini 2.5 Thinking Konfigurationsaufbau | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 176-184 |
| Claude Thinking Modell-Erkennung | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 34-37 |
| Gemini 3 Modell-Erkennung | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 137-139 |
| Interleaved Thinking Hint Injektion | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 96-138 |
| Max Output Tokens automatische Anpassung | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 78-90 |
| keep_thinking Konfiguration Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 78-87 |
| Claude Thinking Anwendungs-Transformation | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 324-366 |
| Gemini Thinking Anwendungs-Transformation | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 372-434 |

**Wichtige Konstanten**:
- `CLAUDE_THINKING_MAX_OUTPUT_TOKENS = 64_000`: Maximale Output-Token-Anzahl für Claude Thinking Modelle
- `CLAUDE_INTERLEAVED_THINKING_HINT`: Interleaved Thinking Hint, der in Systemanweisungen injiziert wird

**Wichtige Funktionen**:
- `buildClaudeThinkingConfig(includeThoughts, thinkingBudget)`: Claude Thinking Konfiguration aufbauen (snake_case keys)
- `buildGemini3ThinkingConfig(includeThoughts, thinkingLevel)`: Gemini 3 Thinking Konfiguration aufbauen (level string)
- `buildGemini25ThinkingConfig(includeThoughts, thinkingBudget)`: Gemini 2.5 Thinking Konfiguration aufbauen (numeric budget)
- `ensureClaudeMaxOutputTokens(generationConfig, thinkingBudget)`: Sicherstellen, dass maxOutputTokens groß genug ist
- `appendClaudeThinkingHint(payload, hint)`: Interleaved thinking hint injizieren
- `isClaudeThinkingModel(model)`: Erkennen, ob es sich um ein Claude Thinking Modell handelt
- `isGemini3Model(model)`: Erkennen, ob es sich um ein Gemini 3 Modell handelt

</details>
