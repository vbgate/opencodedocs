---
title: "Verfügbare Modelle: Claude- & Gemini-Konfigurationsleitfaden | Antigravity Auth"
sidebarTitle: "Richtiges KI-Modell wählen"
subtitle: "Alle verfügbaren Modelle und deren Variantenkonfigurationen verstehen"
description: "Lernen Sie die Modellkonfiguration von Antigravity Auth kennen. Verstehen Sie die Nutzung von Claude Opus 4.5, Sonnet 4.5 und Gemini 3 Pro/Flash mit Thinking-Varianten."
tags:
  - "Plattform"
  - "Modell"
  - "Claude"
  - "Gemini"
  - "Thinking"
prerequisite:
  - "start-what-is-antigravity-auth"
  - "start-quick-install"
order: 1
---

# Alle verfügbaren Modelle und deren Variantenkonfigurationen verstehen

## Was Sie nach diesem Tutorial können werden

- Das Claude- oder Gemini-Modell auswählen, das am besten zu Ihren Bedürfnissen passt
- Die verschiedenen Thinking-Modus-Stufen verstehen (low/max bzw. minimal/low/medium/high)
- Die zwei unabhängigen Kontingentpools von Antigravity und Gemini CLI verstehen
- Mit dem `--variant`-Parameter dynamisch das Thinking-Budget anpassen

## Ihr aktuelles Dilemma

Sie haben das Plugin gerade installiert und stehen vor einer langen Liste von Modellnamen, ohne zu wissen, welches Sie wählen sollen:
- Was ist der Unterschied zwischen `antigravity-gemini-3-pro` und `gemini-3-pro-preview`?
- Was bedeutet `--variant=max`? Was passiert, wenn ich es nicht angebe?
- Ist Claudes Thinking-Modus derselbe wie Geminis Thinking-Modus?

## Kernkonzept

Antigravity Auth unterstützt zwei Hauptkategorien von Modellen, jede mit einem unabhängigen Kontingentpool:

1. **Antigravity-Kontingent**: Zugriff über die Google Antigravity API, einschließlich Claude und Gemini 3
2. **Gemini CLI-Kontingent**: Zugriff über die Gemini CLI API, einschließlich Gemini 2.5 und Gemini 3 Preview

::: info Variant-System
Das Variant-System von OpenCode ermöglicht es Ihnen, nicht für jedes Thinking-Level ein eigenes Modell zu definieren, sondern die Konfiguration zur Laufzeit über den `--variant`-Parameter anzugeben. So bleibt der Modell-Selektor übersichtlich und die Konfiguration flexibel.
:::

## Antigravity-Kontingent-Modelle

Diese Modelle werden über das `antigravity-`-Präfix aufgerufen und verwenden den Antigravity-API-Kontingentpool.

### Gemini 3 Serie

#### Gemini 3 Pro
| Modellname | Varianten | Thinking-Stufen | Beschreibung |
| --- | --- | --- | --- |
| `antigravity-gemini-3-pro` | low, high | low, high | Ausgewogen zwischen Qualität und Geschwindigkeit |

**Varianten-Konfigurationsbeispiel**:
```bash
# Niedriges Thinking-Level (schneller)
opencode run "Schnelle Antwort" --model=google/antigravity-gemini-3-pro --variant=low

# Hohes Thinking-Level (tiefergehend)
opencode run "Komplexes Schließen" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash
| Modellname | Varianten | Thinking-Stufen | Beschreibung |
| --- | --- | --- | --- |
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | Blitzschnelle Antworten, unterstützt 4 Thinking-Stufen |

**Varianten-Konfigurationsbeispiel**:
```bash
# Minimales Thinking (am schnellsten)
opencode run "Einfache Aufgabe" --model=google/antigravity-gemini-3-flash --variant=minimal

# Ausgewogenes Thinking (Standard)
opencode run "Reguläre Aufgabe" --model=google/antigravity-gemini-3-flash --variant=medium

# Maximales Thinking (am tiefgehendsten)
opencode run "Komplexe Analyse" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro unterstützt nicht minimal/medium
`gemini-3-pro` unterstützt nur die beiden Stufen `low` und `high`. Wenn Sie versuchen, `--variant=minimal` oder `--variant=medium` zu verwenden, gibt die API einen Fehler zurück.
:::

### Claude Serie

#### Claude Sonnet 4.5 (nicht Thinking)
| Modellname | Varianten | Thinking-Budget | Beschreibung |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5` | — | — | Standardmodus, kein erweitertes Thinking |

**Nutzungsbeispiel**:
```bash
# Standardmodus
opencode run "Alltägliche Konversation" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking
| Modellname | Varianten | Thinking-Budget (Tokens) | Beschreibung |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Ausgewogener Modus |

**Varianten-Konfigurationsbeispiel**:
```bash
# Leichtes Thinking (schneller)
opencode run "Schnelles Schließen" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# Maximales Thinking (am tiefgehendsten)
opencode run "Tiefe Analyse" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking
| Modellname | Varianten | Thinking-Budget (Tokens) | Beschreibung |
| --- | --- | --- | --- |
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Stärkste Schließenfähigkeit |

**Varianten-Konfigurationsbeispiel**:
```bash
# Leichtes Thinking
opencode run "Qualitativ hochwertige Antwort" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# Maximales Thinking (für die komplexesten Aufgaben)
opencode run "Expertenanalyse" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Unterschied zwischen Claude- und Gemini-Thinking-Modus
- **Claude** verwendet eine numerische thinking budget (Tokens), wie 8192, 32768
- **Gemini 3** verwendet eine string-basierte thinking level (minimal/low/medium/high)
- Beide zeigen den Schließenprozess vor der Antwort an, aber die Konfigurationsweise ist unterschiedlich
:::

## Gemini CLI-Kontingent-Modelle

Diese Modelle haben kein `antigravity-`-Präfix und verwenden den unabhängigen Kontingentpool der Gemini CLI API. Sie unterstützen keinen Thinking-Modus.

| Modellname | Beschreibung |
| --- | ---|
| `gemini-2.5-flash` | Gemini 2.5 Flash (schnelle Antworten) |
| `gemini-2.5-pro` | Gemini 2.5 Pro (ausgewogen Qualität und Geschwindigkeit) |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview (Vorschauversion) |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview (Vorschauversion) |

**Nutzungsbeispiel**:
```bash
# Gemini 2.5 Pro (kein Thinking)
opencode run "Schnelle Aufgabe" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview (kein Thinking)
opencode run "Vorschau-Modell-Test" --model=google/gemini-3-pro-preview
```

::: info Preview-Modelle
`gemini-3-*-preview` Modelle sind offizielle Vorschauversionen von Google, die instabil sein oder jederzeit geändert werden können. Wenn Sie die Thinking-Funktion nutzen möchten, verwenden Sie bitte `antigravity-gemini-3-*` Modelle.
:::

## Modellvergleichsübersicht

| Eigenschaft | Claude 4.5 | Gemini 3 | Gemini 2.5 |
| --- | --- | --- | ---|
| **Thinking-Unterstützung** | ✅ (thinkingBudget) | ✅ (thinkingLevel) | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **Kontingentpool** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **Anwendungsszenario** | Komplexes Schließen, Programmierung | Allgemeine Aufgaben + Suche | Schnelle Antworten, einfache Aufgaben |

## 🎯 Wie man ein Modell auswählt

### Claude oder Gemini?

- **Wählen Sie Claude**: Wenn Sie stärkere logische Schließenfähigkeiten und stabilere Code-Generierung benötigen
- **Wählen Sie Gemini 3**: Wenn Sie Google Search und schnellere Antwortgeschwindigkeit benötigen

### Thinking-Modus oder Standardmodus?

- **Verwenden Sie Thinking**: Komplexes Schließen, mehrstufige Aufgaben, wenn Sie den Schließenprozess sehen müssen
- **Verwenden Sie Standardmodus**: Einfache Fragen und Antworten, schnelle Antworten, wenn keine Schließenpräsentation benötigt wird

### Welche Thinking-Stufe?

| Stufe | Claude (Tokens) | Gemini 3 | Anwendungsszenario |
| --- | --- | --- | ---|
| **minimal** | — | Flash exklusiv | Ultrageschwindigkeitsaufgaben, wie Übersetzung, Zusammenfassung |
| **low** | 8192 | Pro/Flash | Ausgewogen Qualität und Geschwindigkeit, geeignet für die meisten Aufgaben |
| **medium** | — | Flash exklusiv | Aufgaben mittlerer Komplexität |
| **high/max** | 32768 | Pro/Flash | Komplexeste Aufgaben, wie Systemdesign, tiefe Analyse |

::: tip Empfohlene Konfiguration
- **Tägliche Entwicklung**: `antigravity-claude-sonnet-4-5-thinking --variant=low`
- **Komplexes Schließen**: `antigravity-claude-opus-4-5-thinking --variant=max`
- **Schnelle Fragen und Antworten + Suche**: `antigravity-gemini-3-flash --variant=low` + Google Search aktiviert
:::

## Vollständiges Konfigurationsbeispiel

Fügen Sie die folgende Konfiguration zu `~/.config/opencode/opencode.json` hinzu:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
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
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: details Konfiguration kopieren
Klicken Sie oben rechts im Codeblock auf die Kopieren-Schaltfläche und fügen Sie die Konfiguration in Ihre Datei `~/.config/opencode/opencode.json` ein.
:::

## Checkpoint ✅

Bestätigen Sie die folgenden Schritte, um sicherzustellen, dass Sie die Modellauswahl beherrschen:

- [ ] Die zwei unabhängigen Kontingentpools von Antigravity und Gemini CLI verstehen
- [ ] Wissen, dass Claude thinkingBudget (Tokens) und Gemini 3 thinkingLevel (Zeichenkette) verwenden
- [ ] Eine passende Variante je nach Aufgabenkomplexität auswählen können
- [ ] Die vollständige Konfiguration zu `opencode.json` hinzugefügt haben

## Zusammenfassung dieser Lektion

Antigravity Auth bietet eine reichhaltige Modellauswahl und flexible Variantenkonfiguration:

- **Antigravity-Kontingent**: Unterstützt Claude 4.5 und Gemini 3 mit Thinking-Fähigkeit
- **Gemini CLI-Kontingent**: Unterstützt Gemini 2.5 und Gemini 3 Preview ohne Thinking-Fähigkeit
- **Varianten-System**: Über den `--variant`-Parameter kann die Thinking-Stufe dynamisch angepasst werden, ohne mehrere Modelle zu definieren

Bei der Modellauswahl sollten Sie Ihre Aufgabenart (Schließen vs. Suche), Komplexität (einfach vs. komplex) und Anforderungen an die Antwortgeschwindigkeit berücksichtigen.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Thinking-Modelle im Detail](../../thinking-models/)** kennen.
>
> Sie werden lernen:
> - Das Prinzip des Claude- und Gemini-Thinking-Modus
> - Wie man ein benutzerdefiniertes Thinking-Budget konfiguriert
> - Techniken zum Beibehalten von Thinking-Blöcken (Signature Caching)

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | ---|
| Modellauflösung und Tier-Extraktion | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Thinking-Tier-Budget-Definition | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Gemini 3 Thinking-Level-Definition | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| Modell-Alias-Zuordnung | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Variantenkonfigurationsauflösung | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| Typendefinitionen | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**Wichtige Konstanten**:
- `THINKING_TIER_BUDGETS`: Zuordnung der Thinking-Budgets für Claude und Gemini 2.5 (low/medium/high → Tokens)
- `GEMINI_3_THINKING_LEVELS`: Unterstützte Thinking-Levels für Gemini 3 (minimal/low/medium/high)

**Wichtige Funktionen**:
- `resolveModelWithTier(requestedModel)`: Löst den Modellnamen und die Thinking-Konfiguration auf
- `resolveModelWithVariant(requestedModel, variantConfig)`: Löst das Modell aus der Variantenkonfiguration auf
- `budgetToGemini3Level(budget)`: Ordnet das Token-Budget dem Gemini 3-Level zu

</details>
