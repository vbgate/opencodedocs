---
title: "Token-Optimierung: Kontextfenster | Everything Claude Code"
sidebarTitle: "Was tun bei vollem Kontextfenster"
subtitle: "Token-Optimierung: Kontextfenster"
description: "Lernen Sie Token-Optimierungsstrategien für Claude Code. Beherrschen Sie Modellauswahl, strategische Komprimierung und MCP-Konfiguration, um die Effizienz des Kontextfensters zu maximieren und die Antwortqualität zu verbessern."
tags:
  - "token-optimization"
  - "context-management"
  - "performance"
prerequisite:
  - "start-quick-start"
order: 110
---

# Token-Optimierungsstrategien: Kontextfenster-Management

## Was Sie nach diesem Tutorial können

- Das passende Modell je nach Aufgabentyp auswählen und Kosten sowie Leistung ausbalancieren
- Strategische Komprimierung nutzen, um wichtigen Kontext an logischen Grenzen zu bewahren
- MCP-Server sinnvoll konfigurieren, um übermäßigen Kontextfenster-Verbrauch zu vermeiden
- Kontextfenster-Sättigung vermeiden und Antwortqualität aufrechterhalten

## Ihre aktuelle Herausforderung

Kennen Sie diese Probleme?

- Mitten im Gespräch wird der Kontext plötzlich komprimiert und wichtige Informationen gehen verloren
- Zu viele MCP-Server aktiviert, Kontextfenster sinkt von 200k auf 70k
- Bei großen Refactorings „vergisst" das Modell frühere Diskussionen
- Unsicherheit, wann komprimiert werden sollte und wann nicht

## Wann Sie diese Technik anwenden sollten

- **Bei komplexen Aufgaben** - Passendes Modell und Kontextmanagement-Strategie wählen
- **Wenn das Kontextfenster fast voll ist** - Strategische Komprimierung nutzen, um wichtige Informationen zu bewahren
- **Bei der MCP-Server-Konfiguration** - Balance zwischen Werkzeuganzahl und Kontextkapazität finden
- **Bei langen Sitzungen** - An logischen Grenzen komprimieren, um Informationsverlust durch automatische Komprimierung zu vermeiden

## Kernkonzept

Der Kern der Token-Optimierung ist nicht „weniger verwenden", sondern **wertvolle Informationen im entscheidenden Moment zu bewahren**.

### Die drei Säulen der Optimierung

1. **Modellauswahl-Strategie** - Verschiedene Modelle für verschiedene Aufgaben, vermeiden Sie „mit Kanonen auf Spatzen zu schießen"
2. **Strategische Komprimierung** - An logischen Grenzen komprimieren, nicht zu beliebigen Zeitpunkten
3. **MCP-Konfigurationsmanagement** - Anzahl der aktivierten Werkzeuge kontrollieren, Kontextfenster schützen

### Wichtige Konzepte

::: info Was ist ein Kontextfenster?

Das Kontextfenster ist die Länge des Gesprächsverlaufs, die Claude Code „im Gedächtnis behalten" kann. Aktuelle Modelle unterstützen etwa 200k Tokens, werden aber von folgenden Faktoren beeinflusst:

- **Aktivierte MCP-Server** - Jeder MCP verbraucht System-Prompt-Platz
- **Geladene Skills** - Skill-Definitionen belegen Kontext
- **Gesprächsverlauf** - Ihre Unterhaltung mit Claude

Wenn der Kontext fast voll ist, komprimiert Claude automatisch den Verlauf, wobei wichtige Informationen verloren gehen können.
:::

::: tip Warum ist manuelle Komprimierung besser?

Claudes automatische Komprimierung wird zu beliebigen Zeitpunkten ausgelöst und unterbricht oft den Arbeitsfluss mitten in einer Aufgabe. Strategische Komprimierung ermöglicht es Ihnen, an **logischen Grenzen** (z.B. nach Abschluss der Planung, vor dem Aufgabenwechsel) proaktiv zu komprimieren und wichtigen Kontext zu bewahren.
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Das passende Modell auswählen

Wählen Sie das Modell basierend auf der Aufgabenkomplexität, um Kosten und Kontext zu sparen.

**Warum**

Verschiedene Modelle unterscheiden sich stark in Reasoning-Fähigkeit und Kosten. Die richtige Wahl kann viele Tokens sparen.

**Modellauswahl-Leitfaden**

| Modell | Anwendungsfall | Kosten | Reasoning-Fähigkeit |
| --- | --- | --- | --- |
| **Haiku 4.5** | Leichtgewichtige Agents, häufige Aufrufe, Code-Generierung | Niedrig (1/3 von Sonnet) | 90% der Sonnet-Fähigkeit |
| **Sonnet 4.5** | Hauptentwicklungsarbeit, komplexe Coding-Aufgaben, Orchestrierung | Mittel | Bestes Coding-Modell |
| **Opus 4.5** | Architekturentscheidungen, tiefes Reasoning, Forschungsanalyse | Hoch | Stärkste Reasoning-Fähigkeit |

**Konfigurationsmethode**

In der Agent-Datei im `agents/`-Verzeichnis festlegen:

```markdown
---
name: planner
description: Plant Implementierungsschritte für komplexe Features
model: opus
---

Du bist ein erfahrener Planer...
```

**Erwartetes Ergebnis**:
- Aufgaben mit hohem Reasoning-Bedarf (z.B. Architekturdesign) nutzen Opus für höhere Qualität
- Coding-Aufgaben nutzen Sonnet für das beste Preis-Leistungs-Verhältnis
- Häufig aufgerufene Worker-Agents nutzen Haiku zur Kosteneinsparung

### Schritt 2: Strategische Komprimierungs-Hooks aktivieren

Konfigurieren Sie Hooks, die Sie an logischen Grenzen zur Kontextkomprimierung auffordern.

**Warum**

Automatische Komprimierung wird zu beliebigen Zeitpunkten ausgelöst und kann wichtige Informationen verlieren. Strategische Komprimierung gibt Ihnen die Kontrolle über den Zeitpunkt.

**Konfigurationsschritte**

Stellen Sie sicher, dass `hooks/hooks.json` PreToolUse- und PreCompact-Konfigurationen enthält:

```json
{
  "hooks": {
    "PreToolUse": [
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
    ],
    "PreCompact": [
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
    ]
  }
}
```

**Schwellenwert anpassen**

Setzen Sie die Umgebungsvariable `COMPACT_THRESHOLD`, um die Vorschlagshäufigkeit zu steuern (Standard: 50 Werkzeugaufrufe):

```json
// In ~/.claude/settings.json hinzufügen
{
  "env": {
    "COMPACT_THRESHOLD": "50"  // Erster Vorschlag nach 50 Werkzeugaufrufen
  }
}
```

**Erwartetes Ergebnis**:
- Nach jeder Dateibearbeitung oder -erstellung zählt der Hook die Werkzeugaufrufe
- Nach Erreichen des Schwellenwerts (Standard: 50) erscheint die Meldung:
  ```
  [StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
  ```
- Danach alle 25 Werkzeugaufrufe erscheint die Meldung:
  ```
  [StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
  ```

### Schritt 3: An logischen Grenzen komprimieren

Komprimieren Sie basierend auf den Hook-Hinweisen zum richtigen Zeitpunkt manuell.

**Warum**

Komprimierung nach Aufgabenwechseln oder abgeschlossenen Meilensteinen bewahrt wichtigen Kontext und entfernt redundante Informationen.

**Leitfaden für Komprimierungszeitpunkte**

✅ **Empfohlene Zeitpunkte für Komprimierung**:
- Nach Abschluss der Planung, vor Beginn der Implementierung
- Nach Abschluss eines Feature-Meilensteins, vor dem nächsten
- Nach Abschluss des Debuggings, vor Fortsetzung der Entwicklung
- Beim Wechsel zu einem anderen Aufgabentyp

❌ **Zeitpunkte, die Sie vermeiden sollten**:
- Während der Feature-Implementierung
- Mitten im Debugging
- Während der Bearbeitung mehrerer zusammenhängender Dateien

**Vorgehensweise**

Wenn Sie den Hook-Hinweis sehen:

1. Bewerten Sie die aktuelle Aufgabenphase
2. Wenn Komprimierung angemessen ist, führen Sie aus:
   ```bash
   /compact
   ```
3. Warten Sie, bis Claude den Kontext zusammenfasst
4. Überprüfen Sie, ob wichtige Informationen erhalten geblieben sind

**Erwartetes Ergebnis**:
- Nach der Komprimierung wird viel Platz im Kontextfenster freigegeben
- Wichtige Informationen (wie Implementierungspläne, abgeschlossene Features) bleiben erhalten
- Neue Interaktionen starten mit einem schlanken Kontext

### Schritt 4: MCP-Konfiguration optimieren

Kontrollieren Sie die Anzahl der aktivierten MCP-Server, um das Kontextfenster zu schützen.

**Warum**

Jeder MCP-Server verbraucht System-Prompt-Platz. Zu viele aktivierte Server reduzieren das Kontextfenster erheblich.

**Konfigurationsprinzipien**

Basierend auf den Erfahrungen aus der README:

```json
{
  "mcpServers": {
    // Sie können 20-30 MCPs konfigurieren...
    "github": { ... },
    "supabase": { ... },
    // ...weitere Konfigurationen
  },
  "disabledMcpServers": [
    "firecrawl",       // Selten genutzte MCPs deaktivieren
    "clickhouse",
    // ...je nach Projektanforderungen deaktivieren
  ]
}
```

**Best Practices**:

- **Alle MCPs konfigurieren** (20-30), flexibel zwischen Projekten wechseln
- **Weniger als 10 MCPs aktivieren**, aktive Werkzeuge unter 80 halten
- **Je nach Projekt auswählen**: Bei Backend-Entwicklung datenbankbezogene aktivieren, bei Frontend buildbezogene

**Überprüfungsmethode**

Werkzeuganzahl prüfen:

```bash
// Claude Code zeigt die aktuell aktivierten Werkzeuge an
/tool list
```

**Erwartetes Ergebnis**:
- Gesamtzahl der Werkzeuge < 80
- Kontextfenster bleibt bei 180k+ (vermeiden Sie einen Abfall unter 70k)
- Aktivierungsliste dynamisch an Projektanforderungen anpassen

### Schritt 5: Mit Memory Persistence kombinieren

Nutzen Sie Hooks, um wichtige Zustände nach der Komprimierung zu bewahren.

**Warum**

Strategische Komprimierung verliert Kontext, aber wichtige Zustände (wie Implementierungspläne, Checkpoints) müssen erhalten bleiben.

**Hooks konfigurieren**

Stellen Sie sicher, dass folgende Hooks aktiviert sind:

```json
{
  "hooks": {
    "SessionStart": [
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
    ],
    "SessionEnd": [
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
    ]
  }
}
```

**Arbeitsablauf**:

1. Nach Abschluss einer Aufgabe mit `/checkpoint` den Zustand speichern
2. Vor der Kontextkomprimierung speichert der PreCompact-Hook automatisch
3. Bei Beginn einer neuen Sitzung lädt der SessionStart-Hook automatisch
4. Wichtige Informationen (Pläne, Zustände) werden persistent gespeichert, unabhängig von der Komprimierung

**Erwartetes Ergebnis**:
- Nach der Komprimierung sind wichtige Zustände weiterhin verfügbar
- Neue Sitzungen stellen automatisch den vorherigen Kontext wieder her
- Wichtige Entscheidungen und Implementierungspläne gehen nicht verloren

## Checkliste ✅

- [ ] `strategic-compact` Hook konfiguriert
- [ ] Passendes Modell je nach Aufgabe gewählt (Haiku/Sonnet/Opus)
- [ ] Aktivierte MCPs < 10, Gesamtzahl der Werkzeuge < 80
- [ ] An logischen Grenzen komprimiert (nach Planung/Meilensteinen)
- [ ] Memory Persistence Hooks aktiviert, wichtige Zustände werden bewahrt

## Häufige Fehler

### ❌ Häufiger Fehler 1: Opus für alle Aufgaben verwenden

**Problem**: Opus ist zwar am leistungsstärksten, kostet aber das 10-fache von Sonnet und das 30-fache von Haiku.

**Lösung**: Modell je nach Aufgabentyp wählen:
- Häufig aufgerufene Agents (wie Code-Review, Formatierung) nutzen Haiku
- Hauptentwicklungsarbeit nutzt Sonnet
- Architekturentscheidungen, tiefes Reasoning nutzen Opus

### ❌ Häufiger Fehler 2: Hook-Komprimierungshinweise ignorieren

**Problem**: Nach dem `[StrategicCompact]`-Hinweis weiterarbeiten, bis der Kontext automatisch komprimiert wird und wichtige Informationen verloren gehen.

**Lösung**: Aufgabenphase bewerten und zum richtigen Zeitpunkt auf den Hinweis reagieren und `/compact` ausführen.

### ❌ Häufiger Fehler 3: Alle MCP-Server aktivieren

**Problem**: 20+ MCPs konfiguriert und alle aktiviert, Kontextfenster sinkt von 200k auf 70k.

**Lösung**: `disabledMcpServers` verwenden, um selten genutzte MCPs zu deaktivieren, weniger als 10 aktive MCPs beibehalten.

### ❌ Häufiger Fehler 4: Während der Implementierung komprimieren

**Problem**: Kontext während der Feature-Implementierung komprimiert, Modell „vergisst" frühere Diskussionen.

**Lösung**: Nur an logischen Grenzen komprimieren (nach Planung, Aufgabenwechsel, Meilenstein-Abschluss).

## Zusammenfassung

Der Kern der Token-Optimierung ist **wertvolle Informationen im entscheidenden Moment zu bewahren**:

1. **Modellauswahl** - Haiku/Sonnet/Opus haben jeweils passende Anwendungsfälle, kluge Auswahl spart Kosten
2. **Strategische Komprimierung** - An logischen Grenzen manuell komprimieren, automatischen Informationsverlust vermeiden
3. **MCP-Management** - Aktivierte Anzahl kontrollieren, Kontextfenster schützen
4. **Memory Persistence** - Wichtige Zustände auch nach Komprimierung verfügbar halten

Wenn Sie diese Strategien befolgen, können Sie die Kontexteffizienz von Claude Code maximieren und Qualitätsverlust durch Kontextsättigung vermeiden.

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen wir **[Validierungsschleifen: Checkpoints und Evals](../verification-loop/)**.
>
> Sie werden lernen:
> - Wie Sie mit Checkpoints Arbeitszustände speichern und wiederherstellen
> - Die Eval-Harness-Methode für kontinuierliche Validierung
> - Grader-Typen und Pass@K-Metriken
> - Anwendung von Validierungsschleifen in TDD

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Strategische Komprimierung Skill | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Komprimierungsvorschlag Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Pre-Compact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Performance-Regeln | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Hooks-Konfiguration | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Kontextfenster-Erklärung | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 349-359 |

**Wichtige Konstanten**:
- `COMPACT_THRESHOLD = 50`: Werkzeugaufruf-Schwellenwert (Standardwert)
- `MCP_LIMIT = 10`: Empfohlene Obergrenze für aktivierte MCPs
- `TOOL_LIMIT = 80`: Empfohlene Obergrenze für Gesamtzahl der Werkzeuge

**Wichtige Funktionen**:
- `suggest-compact.js:main()`: Zählt Werkzeugaufrufe und schlägt Komprimierung vor
- `pre-compact.js:main()`: Speichert Sitzungszustand vor der Komprimierung

</details>
