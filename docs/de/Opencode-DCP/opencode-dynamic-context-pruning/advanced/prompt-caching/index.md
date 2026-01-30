---
title: "Cache-Auswirkungen: Abwägung zwischen Trefferquote und Einsparungen | opencode-dcp"
subtitle: "Prompt Caching: Wie DCP Cache-Trefferquote und Token-Einsparungen abwägt"
sidebarTitle: "Cache-Verlust = Kostensteigerung?"
description: "Verstehen Sie, wie DCP die Cache-Trefferquote und Token-Einsparungen beim Prompt Caching beeinflusst. Lernen Sie Best Practices für Anthropic, OpenAI und andere Anbieter, um Strategien dynamisch an Abrechnungsmodelle anzupassen."
tags:
  - "advanced"
  - "prompt-caching"
  - "token-optimization"
  - "cost-optimization"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
  - "platforms-llm-tools"
order: 3
---

# Prompt-Cache-Auswirkungen: Abwägung zwischen Trefferquote und Token-Einsparungen

## Was Sie lernen werden

- Verstehen, wie Prompt Caching bei LLM-Anbietern funktioniert
- Warum DCP-Pruning die Cache-Trefferquote beeinflusst
- Wie Sie Cache-Verluste gegen Token-Einsparungen abwägen
- Die optimale Strategie basierend auf Ihrem Anbieter und Abrechnungsmodell entwickeln

## Ihre aktuelle Herausforderung

Nach der Aktivierung von DCP haben Sie bemerkt, dass die Cache-Trefferquote von 85% auf 65% gesunken ist. Führt das möglicherweise zu höheren Kosten? Oder möchten Sie verstehen, ob DCP bei verschiedenen LLM-Anbietern (Anthropic, OpenAI, GitHub Copilot) unterschiedliche Auswirkungen hat?

DCP-Pruning verändert den Nachrichteninhalt, was das Prompt Caching beeinflusst. Aber lohnt sich dieser Kompromiss? Lassen Sie uns das genauer analysieren.

## Wann Sie diese Technik anwenden sollten

- Bei langen Sitzungen, wenn die Kontextaufblähung signifikant wird
- Bei Anbietern mit Abrechnung pro Anfrage (z.B. GitHub Copilot, Google Antigravity)
- Wenn Sie Kontextverschmutzung reduzieren und die Antwortqualität verbessern möchten
- Wenn der Wert der Token-Einsparungen den Verlust der Cache-Trefferquote überwiegt

## Kernkonzept

**Was ist Prompt Caching**

**Prompt Caching** ist eine Technologie, die LLM-Anbieter (wie Anthropic, OpenAI) zur Optimierung von Leistung und Kosten bereitstellen. Sie basiert auf **exakter Präfix-Übereinstimmung**, um bereits verarbeitete Prompts zu cachen – identische Prompt-Präfixe werden nicht erneut berechnet.

::: info Beispiel für den Cache-Mechanismus

Angenommen, Sie haben folgenden Gesprächsverlauf:

```
[System-Prompt]
[Benutzernachricht 1]
[KI-Antwort 1 + Tool-Aufruf A]
[Benutzernachricht 2]
[KI-Antwort 2 + Tool-Aufruf A]  ← Identischer Tool-Aufruf
[Benutzernachricht 3]
```

Ohne Caching müssten bei jeder Anfrage an das LLM alle Tokens neu berechnet werden. Mit Caching kann der Anbieter bei der zweiten Anfrage die vorherigen Berechnungsergebnisse wiederverwenden und muss nur den neuen Teil „Benutzernachricht 3" berechnen.

:::

**Wie DCP das Caching beeinflusst**

Wenn DCP Tool-Ausgaben bereinigt, ersetzt es den ursprünglichen Ausgabeinhalt durch einen Platzhaltertext: `"[Output removed to save context - information superseded or no longer needed]"`

Diese Operation verändert den exakten Nachrichteninhalt (von vollständiger Tool-Ausgabe zu Platzhalter), was zur **Cache-Invalidierung** führt – der Cache-Präfix ab diesem Punkt kann nicht mehr wiederverwendet werden.

**Kompromissanalyse**

| Metrik | Ohne DCP | Mit DCP | Auswirkung |
| --- | --- | --- | --- |
| **Cache-Trefferquote** | ~85% | ~65% | ⬇️ 20% Reduktion |
| **Kontextgröße** | Wächst kontinuierlich | Kontrolliertes Pruning | ⬇️ Deutliche Reduktion |
| **Token-Einsparungen** | 0 | 10-40% | ⬆️ Deutliche Steigerung |
| **Antwortqualität** | Kann abnehmen | Stabiler | ⬆️ Verbesserung (weniger Kontextverschmutzung) |

::: tip Warum können die Kosten trotz sinkender Cache-Trefferquote niedriger sein?

Eine sinkende Cache-Trefferquote bedeutet nicht automatisch höhere Kosten. Die Gründe:

1. **Token-Einsparungen überwiegen oft den Cache-Verlust**: Bei langen Sitzungen übersteigen die durch DCP-Pruning eingesparten Tokens (10-40%) häufig die zusätzlichen Token-Berechnungen durch Cache-Invalidierung
2. **Weniger Kontextverschmutzung**: Nach Entfernung redundanter Inhalte kann sich das Modell besser auf die aktuelle Aufgabe konzentrieren, was zu höherer Antwortqualität führt
3. **Die absolute Cache-Trefferquote bleibt hoch**: Selbst bei 65% können noch fast 2/3 der Inhalte gecacht werden

Testdaten zeigen, dass in den meisten Fällen die Token-Einsparungen durch DCP deutlicher sind.
:::

## Auswirkungen verschiedener Abrechnungsmodelle

### Abrechnung pro Anfrage (GitHub Copilot, Google Antigravity)

**Optimaler Anwendungsfall** – keine negativen Auswirkungen.

Diese Anbieter berechnen nach Anzahl der Anfragen, nicht nach Token-Menge. Daher:

- ✅ Durch DCP-Pruning eingesparte Tokens beeinflussen die Kosten nicht direkt
- ✅ Reduzierte Kontextgröße kann die Antwortgeschwindigkeit verbessern
- ✅ Cache-Invalidierung verursacht keine zusätzlichen Kosten

::: info GitHub Copilot und Google Antigravity

Diese beiden Plattformen rechnen pro Anfrage ab. DCP ist eine **kostenlose Optimierung** – selbst wenn die Cache-Trefferquote sinkt, entstehen keine zusätzlichen Kosten, und die Leistung wird verbessert.

:::

### Abrechnung pro Token (Anthropic, OpenAI)

Hier müssen Cache-Verlust und Token-Einsparungen abgewogen werden.

**Berechnungsbeispiel**:

Angenommen, eine lange Sitzung mit 100 Nachrichten und insgesamt 100K Tokens:

| Szenario | Cache-Trefferquote | Cache-Einsparung Tokens | DCP-Pruning-Einsparung Tokens | Gesamteinsparung |
| --- | --- | --- | --- | --- |
| Ohne DCP | 85% | 85K × (1-0.85) = 12.75K | 0 | 12.75K |
| Mit DCP | 65% | 100K × (1-0.65) = 35K | 20K (geschätzt) | 35K + 20K - 12.75K = **42.25K** |

Obwohl die Cache-Trefferquote nach DCP-Pruning sinkt, ist die tatsächliche Gesamteinsparung höher, da der Kontext um 20K Tokens reduziert wurde.

::: warning Deutlicher Vorteil bei langen Sitzungen

Bei langen Sitzungen ist der Vorteil von DCP deutlicher:

- **Kurze Sitzungen** (< 10 Nachrichten): Cache-Invalidierung kann dominieren, begrenzter Nutzen
- **Lange Sitzungen** (> 30 Nachrichten): Starke Kontextaufblähung, DCP-Pruning spart weit mehr Tokens als der Cache-Verlust kostet

Empfehlung: Aktivieren Sie DCP bevorzugt bei langen Sitzungen; bei kurzen Sitzungen kann es deaktiviert werden.
:::

## Beobachtung und Validierung

### Schritt 1: Cache-Token-Nutzung beobachten

**Warum**
Verstehen Sie den Anteil der Cache-Tokens an den Gesamt-Tokens, um die Bedeutung des Cachings zu bewerten

```bash
# In OpenCode ausführen
/dcp context
```

**Erwartete Ausgabe**: Eine Token-Analyse wie diese

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Interpretation der Schlüsselmetriken**:

| Metrik | Bedeutung | Bewertung |
| --- | --- | --- |
| **Pruned** | Anzahl der bereinigten Tools und Tokens | Je höher, desto mehr spart DCP |
| **Current context** | Aktuelle Token-Gesamtzahl des Sitzungskontexts | Sollte deutlich kleiner sein als Without DCP |
| **Without DCP** | Kontextgröße ohne DCP | Zum Vergleich der Einsparungen |

### Schritt 2: Vergleich mit aktiviertem/deaktiviertem DCP

**Warum**
Durch Vergleich den Unterschied zwischen Caching und Token-Einsparungen direkt erleben

```bash
# 1. DCP deaktivieren (in der Konfiguration enabled: false setzen)
# Oder temporär deaktivieren:
/dcp sweep 999  # Alle Tools bereinigen, Cache-Effekt beobachten

# 2. Einige Gespräche führen

# 3. Statistiken anzeigen
/dcp stats

# 4. DCP wieder aktivieren
# (Konfiguration ändern oder Standardwerte wiederherstellen)

# 5. Gespräch fortsetzen, Statistiken vergleichen
/dcp stats
```

**Erwartete Ergebnisse**:

Mit `/dcp context` die Änderungen der Schlüsselmetriken beobachten:

| Metrik | DCP deaktiviert | DCP aktiviert | Erklärung |
| --- | --- | --- | --- |
| **Pruned** | 0 tools | 5-20 tools | Anzahl der von DCP bereinigten Tools |
| **Current context** | Größer | Kleiner | Kontext nach DCP deutlich reduziert |
| **Without DCP** | Gleich wie Current | Größer als Current | Zeigt das Einsparpotenzial von DCP |

::: tip Empfehlungen für praktische Tests

Testen Sie in verschiedenen Sitzungstypen:

1. **Kurze Sitzungen** (5-10 Nachrichten): Beobachten Sie, ob Caching wichtiger ist
2. **Lange Sitzungen** (30+ Nachrichten): Beobachten Sie, ob DCP-Einsparungen deutlicher sind
3. **Wiederholtes Lesen**: Szenarien mit häufigem Lesen derselben Dateien

Dies hilft Ihnen, basierend auf Ihren tatsächlichen Nutzungsgewohnheiten die beste Wahl zu treffen.
:::

### Schritt 3: Auswirkungen der Kontextverschmutzung verstehen

**Warum**
DCP-Pruning spart nicht nur Tokens, sondern reduziert auch Kontextverschmutzung und verbessert die Antwortqualität

::: info Was ist Kontextverschmutzung?

**Kontextverschmutzung** bezeichnet das Übermaß an redundanten, irrelevanten oder veralteten Informationen im Gesprächsverlauf, was zu Folgendem führt:

- Die Aufmerksamkeit des Modells wird zerstreut, es kann sich schwer auf die aktuelle Aufgabe konzentrieren
- Möglicherweise werden alte Daten referenziert (z.B. bereits geänderte Dateiinhalte)
- Die Antwortqualität sinkt, mehr Tokens werden benötigt, um den Kontext zu „verstehen"

DCP reduziert diese Verschmutzung durch Entfernung abgeschlossener Tool-Ausgaben, wiederholter Lesevorgänge usw.
:::

**Praktischer Effektvergleich**:

| Szenario | Ohne DCP | Mit DCP |
| --- | --- | --- |
| Dieselbe Datei 3x lesen | Behält 3 vollständige Ausgaben (redundant) | Behält nur die neueste |
| Nach Dateischreibung erneut lesen | Alte Schreiboperation + neues Lesen | Behält nur das neue Lesen |
| Fehlerhafte Tool-Ausgabe | Behält vollständige fehlerhafte Eingabe | Behält nur die Fehlermeldung |

Nach Reduzierung der Kontextverschmutzung kann das Modell den aktuellen Zustand genauer verstehen und weniger „halluzinieren" oder veraltete Daten referenzieren.

## Best-Practice-Empfehlungen

### Strategie nach Anbieter wählen

| Anbieter | Abrechnungsmodell | Empfehlung | Begründung |
| --- | --- | --- | --- |
| **GitHub Copilot** | Pro Anfrage | ✅ Immer aktivieren | Kostenlose Optimierung, nur Leistungsverbesserung |
| **Google Antigravity** | Pro Anfrage | ✅ Immer aktivieren | Wie oben |
| **Anthropic** | Pro Token | ✅ Bei langen Sitzungen aktivieren<br>⚠️ Bei kurzen Sitzungen optional | Cache und Einsparungen abwägen |
| **OpenAI** | Pro Token | ✅ Bei langen Sitzungen aktivieren<br>⚠️ Bei kurzen Sitzungen optional | Wie oben |

### Konfiguration nach Sitzungstyp anpassen

```jsonc
// ~/.config/opencode/dcp.jsonc oder Projektkonfiguration

{
  // Lange Sitzungen (> 30 Nachrichten): Alle Strategien aktivieren
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": true },  // Empfohlen
    "purgeErrors": { "enabled": true }
  },

  // Kurze Sitzungen (< 10 Nachrichten): Nur Deduplizierung aktivieren
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": false },
    "purgeErrors": { "enabled": false }
  }
}
```

**Strategieerklärung**:

- **deduplication (Deduplizierung)**: Geringe Auswirkung, immer empfohlen
- **supersedeWrites (Schreibvorgänge ersetzen)**: Mittlere Auswirkung, für lange Sitzungen empfohlen
- **purgeErrors (Fehler bereinigen)**: Geringe Auswirkung, empfohlen

### Strategie dynamisch anpassen

Verwenden Sie `/dcp context`, um Token-Zusammensetzung und Pruning-Effekt zu beobachten:

```bash
# Wenn der Pruned-Wert hoch ist, spart DCP aktiv Tokens
# Vergleichen Sie Current context und Without DCP, um die Einsparungen zu bewerten

/dcp context
```

## Checkpoint ✅

Bestätigen Sie, dass Sie folgende Punkte verstanden haben:

- [ ] Prompt Caching basiert auf exakter Präfix-Übereinstimmung; Änderungen am Nachrichteninhalt invalidieren den Cache
- [ ] DCP-Pruning ändert den Nachrichteninhalt und führt zu einer Reduktion der Cache-Trefferquote (ca. 20%)
- [ ] Bei langen Sitzungen überwiegen die Token-Einsparungen typischerweise den Cache-Verlust
- [ ] GitHub Copilot und Google Antigravity rechnen pro Anfrage ab; DCP ist eine kostenlose Optimierung
- [ ] Anthropic und OpenAI rechnen pro Token ab; Cache und Einsparungen müssen abgewogen werden
- [ ] Verwenden Sie `/dcp context`, um Token-Zusammensetzung und Pruning-Effekt zu beobachten
- [ ] Passen Sie die Strategiekonfiguration dynamisch an die Sitzungslänge an

## Häufige Fehler

### ❌ Annahme, dass sinkende Cache-Trefferquote gleich höhere Kosten bedeutet

**Problem**: Die Cache-Trefferquote sinkt von 85% auf 65%, und Sie denken, die Kosten steigen

**Ursache**: Fokus nur auf die Cache-Trefferquote, Ignorieren der Token-Einsparungen und Kontextreduktion

**Lösung**: Verwenden Sie `/dcp context`, um die tatsächlichen Daten zu sehen, mit Fokus auf:
1. Durch DCP-Pruning eingesparte Tokens (`Pruned`)
2. Aktuelle Kontextgröße (`Current context`)
3. Theoretische Größe ohne Pruning (`Without DCP`)

Durch Vergleich von `Without DCP` und `Current context` sehen Sie die tatsächlich durch DCP eingesparten Tokens.

### ❌ Zu aggressives Pruning bei kurzen Sitzungen

**Problem**: Bei Sitzungen mit 5-10 Nachrichten sind alle Strategien aktiviert, Cache-Invalidierung ist deutlich

**Ursache**: Bei kurzen Sitzungen ist die Kontextaufblähung nicht gravierend, aggressives Pruning bringt wenig Nutzen

**Lösung**:
- Bei kurzen Sitzungen nur `deduplication` und `purgeErrors` aktivieren
- `supersedeWrites`-Strategie deaktivieren
- Oder DCP komplett deaktivieren (`enabled: false`)

### ❌ Unterschiedliche Abrechnungsmodelle der Anbieter ignorieren

**Problem**: Bei GitHub Copilot Sorgen über Cache-Invalidierung und steigende Kosten

**Ursache**: Nicht beachtet, dass Copilot pro Anfrage abrechnet und Cache-Invalidierung keine zusätzlichen Kosten verursacht

**Lösung**:
- Copilot und Antigravity: DCP immer aktivieren
- Anthropic und OpenAI: Strategie nach Sitzungslänge anpassen

### ❌ Entscheidungen ohne Betrachtung der tatsächlichen Daten

**Problem**: Entscheidung über DCP-Aktivierung nach Gefühl

**Ursache**: `/dcp context` und `/dcp stats` nicht verwendet, um die tatsächlichen Effekte zu beobachten

**Lösung**:
- Daten in verschiedenen Sitzungen sammeln
- Unterschiede zwischen aktiviertem/deaktiviertem DCP vergleichen
- Basierend auf Ihren Nutzungsgewohnheiten entscheiden

## Zusammenfassung

**Kernmechanismus des Prompt Caching**:

- LLM-Anbieter cachen Prompts basierend auf **exakter Präfix-Übereinstimmung**
- DCP-Pruning ändert den Nachrichteninhalt und führt zur Cache-Invalidierung
- Die Cache-Trefferquote sinkt (ca. 20%), aber die Token-Einsparungen sind deutlicher

**Entscheidungsmatrix für Kompromisse**:

| Szenario | Empfohlene Konfiguration | Begründung |
| --- | --- | --- |
| GitHub Copilot/Google Antigravity | ✅ Immer aktivieren | Abrechnung pro Anfrage, kostenlose Optimierung |
| Anthropic/OpenAI lange Sitzungen | ✅ Alle Strategien aktivieren | Token-Einsparungen > Cache-Verlust |
| Anthropic/OpenAI kurze Sitzungen | ⚠️ Nur Deduplizierung + Fehlerbereinigung | Caching ist wichtiger |

**Kernpunkte**:

1. **Sinkende Cache-Trefferquote bedeutet nicht höhere Kosten**: Betrachten Sie die Gesamt-Token-Einsparungen
2. **Abrechnungsmodelle der Anbieter beeinflussen die Strategie**: Pro Anfrage vs. pro Token
3. **Dynamische Anpassung nach Sitzungslänge**: Lange Sitzungen profitieren mehr
4. **Tools zur Datenbeobachtung nutzen**: `/dcp context` und `/dcp stats`

**Best-Practice-Zusammenfassung**:

```
1. Bestätigen Sie Ihren Anbieter und das Abrechnungsmodell
2. Passen Sie die Strategiekonfiguration nach Sitzungslänge an
3. Beobachten Sie regelmäßig die Effekte mit /dcp context
4. Priorisieren Sie Token-Einsparungen bei langen Sitzungen
5. Priorisieren Sie Cache-Trefferquote bei kurzen Sitzungen
```

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie **[Sub-Agent-Behandlung](/de/Opencode-DCP/opencode-dynamic-context-pruning/advanced/subagent-handling/)**.
>
> Sie werden lernen:
> - Wie DCP Sub-Agent-Sitzungen erkennt
> - Warum Sub-Agents nicht am Pruning teilnehmen
> - Wie Pruning-Ergebnisse in Sub-Agents an den Haupt-Agent übertragen werden

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeile |
| --- | --- | --- |
| Prompt Caching Erklärung | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 46-52 |
| Token-Berechnung (inkl. Cache) | [`lib/messages/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/utils.ts) | 66-78 |
| Kontextanalyse-Befehl | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174 |
| Cache-Token-Berechnung | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 106-107 |
| Cache-Token-Protokollierung | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts) | 141 |
| Pruning-Platzhalter-Definition | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 6-7 |
| Tool-Ausgabe-Pruning | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 22-46 |

**Wichtige Konstanten**:
- Keine

**Wichtige Funktionen**:
- `calculateTokens(messages, tokenizer)`: Berechnet die Token-Anzahl von Nachrichten, einschließlich cache.read und cache.write
- `buildSessionContext(messages)`: Erstellt die Sitzungskontextanalyse, unterscheidet System/User/Assistant/Tools
- `formatContextAnalysis(analysis)`: Formatiert die Kontextanalyse-Ausgabe

**Wichtige Typen**:
- `TokenCounts`: Token-Zählstruktur, enthält input/output/reasoning/cache

**Cache-Mechanismus-Erklärung** (aus README):
- Anthropic und OpenAI cachen Prompts basierend auf exakter Präfix-Übereinstimmung
- DCP-Pruning ändert den Nachrichteninhalt und führt zur Cache-Invalidierung
- Mit DCP liegt die Cache-Trefferquote bei ca. 65%, ohne DCP bei ca. 85%
- Optimaler Anwendungsfall: Anbieter mit Abrechnung pro Anfrage (GitHub Copilot, Google Antigravity) haben keine negativen Auswirkungen

</details>
