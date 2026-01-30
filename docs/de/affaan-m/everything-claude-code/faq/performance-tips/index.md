---
title: "Leistungsoptimierung: Modelle und Kontext | Everything Claude Code"
sidebarTitle: "Geheimnis für 10-fach schnellere Antworten"
subtitle: "Leistungsoptimierung: Antwortgeschwindigkeit steigern"
description: "Lernen Sie die Leistungsoptimierungsstrategien von Everything Claude Code kennen. Meistern Sie die Modellauswahl, Kontextfenster-Verwaltung, MCP-Konfiguration und strategische Komprimierung, um die Antwortgeschwindigkeit und Entwicklungseffizienz zu verbessern."
tags:
  - "performance"
  - "optimization"
  - "token-usage"
prerequisite:
  - "/de/affaan-m/everything-claude-code/start/quick-start/"
order: 180
---

# Leistungsoptimierung: Antwortgeschwindigkeit steigern

## Was Sie nach diesem Lernen können

- Wählen Sie das geeignete Modell basierend auf der Aufgabenkomplexität und balancieren Sie Kosten und Leistung
- Verwalten Sie effektiv das Kontextfenster und vermeiden Sie das Erreichen der Grenzen
- Konfigurieren Sie MCP-Server sinnvoll, um den verfügbaren Kontext zu maximieren
- Verwenden Sie strategische Komprimierung, um den Dialogzusammenhang logisch zu erhalten

## Ihre aktuelle Herausforderung

Claude Code reagiert langsam? Das Kontextfenster ist schnell voll? Unklar, wann Sie Haiku, Sonnet oder Opus verwenden sollen? Diese Probleme können die Entwicklungseffizienz erheblich beeinträchtigen.

## Kernprinzip

Das Kernstück der Leistungsoptimierung ist **das richtige Werkzeug zur richtigen Zeit**. Die Auswahl von Modellen, die Verwaltung von Kontext, die Konfiguration von MCP – all dies ist ein Trade-off: Geschwindigkeit vs. Intelligenz, Kosten vs. Qualität.

::: info Schlüsselkonzept

Das **Kontextfenster** ist die Länge des Dialogverlaufs, den Claude "erinnern" kann. Die aktuellen Modelle unterstützen ca. 200k Tokens, dies wird jedoch durch Faktoren wie die Anzahl der MCP-Server, die Häufigkeit der Werkzeugaufrufe usw. beeinflusst.

:::

## Häufige Leistungsprobleme

### Problem 1: Langsame Antwortgeschwindigkeit

**Symptome**: Auch einfache Aufgaben dauern lange

**Mögliche Ursachen**:
- Verwendung von Opus für einfache Aufgaben
- Zu langer Kontext, der viel Historie verarbeiten muss
- Zu viele MCP-Server aktiviert

**Lösungen**:
- Verwenden Sie Haiku für leichte Aufgaben
- Komprimieren Sie regelmäßig den Kontext
- Reduzieren Sie die Anzahl der aktivierten MCPs

### Problem 2: Kontextfenster schnell voll

**Symptome**: Nach kurzer Entwicklungszeit muss komprimiert oder die Sitzung neu gestartet werden

**Mögliche Ursachen**:
- Zu viele MCP-Server aktiviert (jeder MCP belegt Kontext)
- Dialoghistorie nicht rechtzeitig komprimiert
- Komplexe Werkzeugaufrufketten verwendet

**Lösungen**:
- Aktivieren Sie MCP bei Bedarf, deaktivieren Sie ungenutzte mit `disabledMcpServers`
- Verwenden Sie strategische Komprimierung, komprimieren Sie manuell an Aufgabengrenzen
- Vermeiden Sie unnötiges Dateilesen und -suchen

### Problem 3: Schneller Token-Verbrauch

**Symptome**: Kontingent schnell verbraucht, hohe Kosten

**Mögliche Ursachen**:
- Immer Opus für Aufgaben verwenden
- Wiederholtes Lesen großer Dateien
- Keine sinnvolle Nutzung von Komprimierung

**Lösungen**:
- Wählen Sie das Modell basierend auf der Aufgabenkomplexität
- Verwenden Sie `/compact` für aktive Komprimierung
- Nutzen Sie strategic-compact Hooks für intelligente Erinnerungen

## Strategien zur Modellauswahl

Die Wahl des passenden Modells basierend auf der Aufgabenkomplexität kann die Leistung erheblich steigern und die Kosten senken.

### Haiku 4.5 (90% Sonnet-Fähigkeiten, 3x Kosteneinsparung)

**Anwendungsszenarien**:
- Leichte Agenten, häufige Aufrufe
- Pair Programming und Code-Generierung
- Worker-Agents in Multi-Agent-Systemen

**Beispiel**:
```markdown
Einfache Code-Änderungen, Formatierung, Kommentar-Generierung
Verwenden Sie Haiku
```

### Sonnet 4.5 (Bestes Codierungsmodell)

**Anwendungsszenarien**:
- Hauptentwicklungsarbeit
- Koordination von Multi-Agent-Workflows
- Komplexe Codierungsaufgaben

**Beispiel**:
```markdown
Implementierung neuer Funktionen, Refactoring, Behebung komplexer Bugs
Verwenden Sie Sonnet
```

### Opus 4.5 (Stärkste Inferenzfähigkeit)

**Anwendungsszenarien**:
- Komplexe Architekturentscheidungen
- Aufgaben, die maximale Inferenztiefe erfordern
- Forschungs- und Analyseaufgaben

**Beispiel**:
```markdown
Systemdesign, Sicherheitsaudit, komplexe Problembehebung
Verwenden Sie Opus
```

::: Tipp Modellauswahl-Hinweis

Geben Sie das Modell in der Agenten-Konfiguration über das Feld `model` an:
```markdown
---
name: my-agent
model: haiku  # oder sonnet, opus
---
```

:::

## Verwaltung des Kontextfensters

Die zu intensive Nutzung des Kontextfensters kann die Leistung beeinträchtigen und sogar zum Scheitern von Aufgaben führen.

### Aufgaben, die die letzten 20% des Kontextfensters vermeiden sollten

Für diese Aufgaben wird empfohlen, zuerst den Kontext zu komprimieren:
- Großes Refactoring
- Funktionsimplementierung über mehrere Dateien
- Debugging komplexer Interaktionen

### Aufgaben mit geringerer Kontextabhängigkeit

Diese Aufgaben haben geringe Kontextanforderungen und können fortgesetzt werden, wenn die Grenze erreicht ist:
- Einzeldatei-Bearbeitung
- Erstellung unabhängiger Werkzeuge
- Dokumentationsupdates
- Einfache Bug-Behebungen

::: warning Wichtiger Hinweis

Das Kontextfenster wird von folgenden Faktoren beeinflusst:
- Anzahl der aktivierten MCP-Server
- Anzahl der Werkzeugaufrufe
- Länge der Dialoghistorie
- Dateioperationen in der aktuellen Sitzung

:::

## MCP-Konfigurationsoptimierung

MCP-Server sind eine wichtige Möglichkeit, die Fähigkeiten von Claude Code zu erweitern, aber jeder MCP belegt Kontext.

### Grundprinzipien

Gemäß den Empfehlungen der README:

```json
{
  "mcpServers": {
    "mcp-server-1": { ... },
    "mcp-server-2": { ... }
    // ... weitere Konfigurationen
  },
  "disabledMcpServers": [
    "mcp-server-3",
    "mcp-server-4"
    // Deaktivieren Sie ungenutzte MCPs
  ]
}
```

**Best Practices**:
- Sie können 20-30 MCP-Server konfigurieren
- Aktivieren Sie nicht mehr als 10 pro Projekt
- Halten Sie die Anzahl aktiver Werkzeuge unter 80

### MCP bei Bedarf aktivieren

Wählen Sie relevante MCPs basierend auf dem Projekttyp:

| Projekttyp | Empfohlene Aktivierung | Optional |
|--- | --- | ---|
| Frontend-Projekt | Vercel, Magic | Filesystem, GitHub |
| Backend-Projekt | Supabase, ClickHouse | GitHub, Railway |
| Full-Stack-Projekt | Alle | - |
| Tool-Bibliothek | GitHub | Filesystem |

::: Tipp Wie man MCP wechselt

Verwenden Sie in der Projektkonfiguration (`~/.claude/settings.json`) `disabledMcpServers`:
```json
{
  "disabledMcpServers": ["cloudflare-observability", "clickhouse-io"]
}
```

:::

## Strategische Komprimierung

Automatische Komprimierung kann jederzeit ausgelöst werden und möglicherweise die Aufgabenlogik unterbrechen. Strategische Komprimierung wird manuell an Aufgabengrenzen ausgeführt und erhält den logischen Zusammenhang.

### Warum strategische Komprimierung notwendig ist

**Probleme der automatischen Komprimierung**:
- Wird oft mitten in der Aufgabe ausgelöst, verliert wichtigen Kontext
- Kennt keine logischen Aufgabengrenzen
- Kann komplexe mehrstufige Operationen unterbrechen

**Vorteile der strategischen Komprimierung**:
- Komprimierung an Aufgabengrenzen, behält wichtige Informationen
- Klarere Logik
- Vermeidet Unterbrechung wichtiger Prozesse

### Beste Komprimierungszeitpunkte

1. **Nach der Erkundung, vor der Ausführung** - Komprimieren Sie den Forschungskontext, behalten Sie den Implementierungsplan
2. **Nach Abschluss eines Meilensteins** - Neustart für die nächste Phase
3. **Vor dem Aufgabenwechsel** - Bereinigen Sie den Erkundungskontext, bereiten Sie die neue Aufgabe vor

### Strategic Compact Hook

Dieses Plugin enthält die `strategic-compact` Skill, die Sie automatisch daran erinnert, wann Sie komprimieren sollten.

**Funktionsweise des Hooks**:
- Verfolgt die Anzahl der Werkzeugaufrufe
- Erinnert beim Erreichen des Schwellenwerts (standardmäßig 50 Aufrufe)
- Danach alle 25 Aufrufe erneut

**Schwellenwert konfigurieren**:
```bash
# Umgebungsvariable setzen
export COMPACT_THRESHOLD=40
```

**Hook-Konfiguration** (bereits in `hooks/hooks.json` enthalten):
```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }]
}
```

### Nutzungstipps

1. **Nach der Planung komprimieren** - Wenn der Plan feststeht, komprimieren und neu beginnen
2. **Nach dem Debugging komprimieren** - Bereinigen Sie den Fehlerlösungskontext, fahren Sie mit dem nächsten Schritt fort
3. **Nicht während der Implementierung komprimieren** - Behalten Sie den Kontext relevanter Änderungen bei
4. **Auf Erinnerungen achten** - Der Hook sagt Ihnen "wann", Sie entscheiden "ob komprimiert wird"

::: Tipp Aktuellen Status anzeigen

Mit dem Befehl `/checkpoint` können Sie den aktuellen Status speichern und dann die Sitzung komprimieren.

:::

## Leistungs-Checkliste

Überprüfen Sie im täglichen Gebrauch regelmäßig folgende Punkte:

### Modellnutzung
- [ ] Einfache Aufgaben mit Haiku statt Sonnet/Opus
- [ ] Komplexe Inferenz mit Opus statt Sonnet
- [ ] Geeignetes Modell in der Agenten-Konfiguration angegeben

### Kontextverwaltung
- [ ] Nicht mehr als 10 MCPs aktiviert
- [ ] Regelmäßige Komprimierung mit `/compact`
- [ ] Komprimierung an Aufgabengrenzen statt mitten in der Aufgabe

### MCP-Konfiguration
- [ ] Projekt aktiviert nur benötigte MCPs
- [ ] `disabledMcpServers` zum Verwalten ungenutzter MCPs verwenden
- [ ] Regelmäßige Überprüfung der Anzahl aktiver Werkzeuge (empfohlen < 80)

## Häufig gestellte Fragen

### F: Wann sollte man Haiku, Sonnet oder Opus verwenden?

**A**: Basierend auf der Aufgabenkomplexität:
- **Haiku**: Leichte Aufgaben, häufige Aufrufe (z.B. Code-Formatierung, Kommentar-Generierung)
- **Sonnet**: Hauptentwicklungsarbeit, Agenten-Koordination (z.B. Funktionsimplementierung, Refactoring)
- **Opus**: Komplexe Inferenz, Architekturentscheidungen (z.B. Systemdesign, Sicherheitsaudit)

### F: Was tun, wenn das Kontextfenster voll ist?

**A**: Verwenden Sie sofort `/compact` zum Komprimieren der Sitzung. Wenn der strategic-compact Hook aktiviert ist, wird er Sie zum richtigen Zeitpunkt erinnern. Vor der Komprimierung können Sie mit `/checkpoint` wichtige Status speichern.

### F: Wie erfahre ich, wie viele MCPs aktiviert sind?

**A**: Überprüfen Sie die Konfigurationen `mcpServers` und `disabledMcpServers` in `~/.claude/settings.json`. Anzahl der aktiven MCPs = Gesamtzahl - Anzahl in `disabledMcpServers`.

### F: Warum sind meine Antworten besonders langsam?

**A**: Überprüfen Sie folgende Punkte:
1. Verwenden Sie Opus für einfache Aufgaben?
2. Ist das Kontextfenster fast voll?
3. Zu viele MCP-Server aktiviert?
4. Führen Sie umfangreiche Dateioperationen durch?

## Zusammenfassung

Das Kernstück der Leistungsoptimierung ist "das richtige Werkzeug zur richtigen Zeit":

- **Modellauswahl**: Wählen Sie Haiku/Sonnet/Opus basierend auf der Aufgabenkomplexität
- **Kontextverwaltung**: Vermeiden Sie die letzten 20% des Fensters, komprimieren Sie rechtzeitig
- **MCP-Konfiguration**: Aktivieren Sie bei Bedarf, nicht mehr als 10
- **Strategische Komprimierung**: Manuelle Komprimierung an Aufgabengrenzen, logischer Zusammenhang erhalten

## Verwandte Kurse

- [Token-Optimierungsstrategien](../../advanced/token-optimization/) - Vertiefte Kenntnisse der Kontextfenster-Verwaltung
- [Hooks-Automatisierung](../../advanced/hooks-automation/) - Konfiguration des strategic-compact Hooks
- [MCP-Server-Konfiguration](../../start/mcp-setup/) - So konfigurieren Sie MCP-Server

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisiert am: 2026-01-25

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Leistungsoptimierungsregeln | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Strategische Komprimierung Skill | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Hooks-Konfiguration | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Strategic Compact Hook | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json#L46-L54) | 46-54 |
| Suggest Compact Skript | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | - |
| MCP-Konfigurationsbeispiel | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | - |

**Wichtige Regeln**:
- **Modellauswahl**: Haiku (leichte Aufgaben), Sonnet (Hauptentwicklung), Opus (komplexe Inferenz)
- **Kontextfenster**: Vermeiden Sie die Nutzung der letzten 20%, komprimieren Sie rechtzeitig
- **MCP-Konfiguration**: Aktivieren Sie nicht mehr als 10 pro Projekt, aktive Werkzeuge < 80
- **Strategische Komprimierung**: Manuelle Komprimierung an Aufgabengrenzen, vermeiden Sie Unterbrechungen durch automatische Komprimierung

**Wichtige Umgebungsvariablen**:
- `COMPACT_THRESHOLD`: Schwellenwert für Werkzeugaufrufe (Standard: 50)

</details>
