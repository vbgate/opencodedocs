---
title: "Befehle: Überwachung & Bereinigung | opencode-dynamic-context-pruning"
sidebarTitle: "Token überwachen, manuell bereinigen"
subtitle: "DCP-Befehlsanleitung: Überwachung und manuelle Bereinigung"
description: "Lernen Sie die 4 DCP-Befehle zur Überwachung und manuellen Bereinigung. /dcp context zeigt die Sitzung, /dcp stats die Statistiken, /dcp sweep löst die manuelle Bereinigung aus."
tags:
  - "DCP-Befehle"
  - "Token-Überwachung"
  - "Manuelle Bereinigung"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 3
---

# DCP-Befehlsanleitung: Überwachung und manuelle Bereinigung

## Was Sie lernen werden

- Mit `/dcp context` die Token-Verteilung der aktuellen Sitzung anzeigen
- Mit `/dcp stats` die kumulierten Bereinigungsstatistiken einsehen
- Mit `/dcp sweep [n]` die manuelle Bereinigung auslösen
- Den Schutzmechanismus für geschützte Tools und Dateien verstehen
- Die Token-Berechnungsstrategie und Einspareffekte kennenlernen

## Ihre aktuelle Herausforderung

In langen Gesprächen steigt der Token-Verbrauch immer schneller, aber Sie wissen nicht:
- Wohin gehen die Token in der aktuellen Sitzung?
- Wie viel hat DCP tatsächlich eingespart?
- Wie können Sie Tool-Ausgaben manuell bereinigen, die nicht mehr benötigt werden?
- Welche Tools sind geschützt und werden nicht bereinigt?

Ohne diese Fragen zu klären, können Sie die Optimierungseffekte von DCP möglicherweise nicht voll ausschöpfen und könnten in kritischen Momenten wichtige Informationen versehentlich löschen.

## Wann Sie diese Technik anwenden sollten

Wenn Sie:
- Die Token-Zusammensetzung der aktuellen Sitzung verstehen möchten
- Den Gesprächsverlauf schnell bereinigen müssen
- Die Bereinigungseffekte von DCP überprüfen möchten
- Vor dem Start einer neuen Aufgabe eine Kontextbereinigung durchführen möchten

## Kernkonzept

DCP bietet 4 Slash-Befehle, um Token-Nutzung zu überwachen und zu steuern:

| Befehl | Zweck | Anwendungsfall |
| --- | --- | --- |
| `/dcp` | Hilfe anzeigen | Wenn Sie Befehle vergessen haben |
| `/dcp context` | Token-Verteilung der aktuellen Sitzung analysieren | Kontextzusammensetzung verstehen |
| `/dcp stats` | Kumulierte Bereinigungsstatistiken anzeigen | Langzeiteffekte überprüfen |
| `/dcp sweep [n]` | Tools manuell bereinigen | Kontextgröße schnell reduzieren |

**Schutzmechanismus**:

Alle Bereinigungsoperationen überspringen automatisch:
- **Geschützte Tools**: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- **Geschützte Dateien**: Dateipfade, die den konfigurierten `protectedFilePatterns` entsprechen

::: info
Die Einstellungen für geschützte Tools und Dateien können über die Konfigurationsdatei angepasst werden. Siehe [Vollständige Konfiguration](../../start/configuration/) für Details.
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Hilfeinformationen anzeigen

Geben Sie `/dcp` im OpenCode-Dialogfeld ein.

**Sie sollten sehen**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

**Checkpoint ✅**: Bestätigen Sie, dass Sie die Beschreibungen der 3 Unterbefehle sehen.

### Schritt 2: Token-Verteilung der aktuellen Sitzung analysieren

Geben Sie `/dcp context` ein, um die Token-Nutzung der aktuellen Sitzung anzuzeigen.

**Sie sollten sehen**:

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Token-Kategorien erklärt**:

| Kategorie | Berechnungsmethode | Beschreibung |
| --- | --- | --- |
| **System** | `firstAssistant.input + cache.read - tokenizer(firstUserMessage)` | System-Prompt |
| **Tools** | `tokenizer(toolInputs + toolOutputs) - prunedTokens` | Tool-Aufrufe (abzüglich bereinigter Teile) |
| **User** | `tokenizer(all user messages)` | Alle Benutzernachrichten |
| **Assistant** | `total - system - user - tools` | KI-Textausgabe + Reasoning-Token |

**Checkpoint ✅**: Bestätigen Sie, dass Sie die Token-Anteile und -Mengen für jede Kategorie sehen.

### Schritt 3: Kumulierte Bereinigungsstatistiken anzeigen

Geben Sie `/dcp stats` ein, um die historisch kumulierten Bereinigungseffekte anzuzeigen.

**Sie sollten sehen**:

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.2K
  Tools pruned:   12

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~284.5K
  Tools pruned:   156
  Sessions:       8
```

**Statistik-Erklärung**:
- **Session**: Bereinigungsdaten der aktuellen Sitzung (im Speicher)
- **All-time**: Kumulierte Daten aller historischen Sitzungen (auf Festplatte persistiert)

**Checkpoint ✅**: Bestätigen Sie, dass Sie die Bereinigungsstatistiken für die aktuelle Sitzung und die historische Gesamtsumme sehen.

### Schritt 4: Tools manuell bereinigen

Es gibt zwei Möglichkeiten, `/dcp sweep` zu verwenden:

#### Methode 1: Alle Tools seit der letzten Benutzernachricht bereinigen

Geben Sie `/dcp sweep` (ohne Parameter) ein.

**Sie sollten sehen**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept 8 tool(s) since previous user message.
Tokens saved: ~12,345

  • Read: src/config.ts
  • Read: src/utils.ts
  • Bash: npm test
  • Read: package.json
  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
```

#### Methode 2: Die letzten N Tools bereinigen

Geben Sie `/dcp sweep 5` ein, um die letzten 5 Tools zu bereinigen.

**Sie sollten sehen**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept last 5 tool(s).
Tokens saved: ~7,892

  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
  • Bash: npm run build
```

**Hinweis zu geschützten Tools**:

Wenn geschützte Tools übersprungen wurden, zeigt die Ausgabe:

```
Swept 5 tool(s).
Tokens saved: ~7,892
(2 protected tool(s) skipped)
```

::: warning
Geschützte Tools (wie `write`, `edit`) und geschützte Dateipfade werden automatisch übersprungen und nicht bereinigt.
:::

**Checkpoint ✅**: Bestätigen Sie, dass Sie die Liste der bereinigten Tools und die Anzahl der eingesparten Token sehen.

### Schritt 5: Bereinigungseffekte erneut überprüfen

Geben Sie nach der Bereinigung erneut `/dcp context` ein, um die neue Token-Verteilung anzuzeigen.

**Sie sollten sehen**:
- Der Anteil der `Tools`-Kategorie ist gesunken
- Die `Summary` zeigt eine erhöhte Anzahl bereinigter Tools
- Die `Current context`-Gesamtzahl ist gesunken

**Checkpoint ✅**: Bestätigen Sie, dass die Token-Nutzung deutlich gesunken ist.

## Häufige Fehler vermeiden

### ❌ Fehler: Wichtige Tools versehentlich löschen

**Szenario**: Sie haben gerade mit dem `write`-Tool eine wichtige Datei erstellt und führen dann `/dcp sweep` aus.

**Falsches Ergebnis**: Das `write`-Tool wird bereinigt, und die KI weiß möglicherweise nicht, dass die Datei erstellt wurde.

**Richtige Vorgehensweise**:
- `write`, `edit` und ähnliche Tools sind standardmäßig geschützt
- Ändern Sie die `protectedTools`-Konfiguration nicht manuell, um diese Tools zu entfernen
- Warten Sie nach Abschluss kritischer Aufgaben einige Runden, bevor Sie bereinigen

### ❌ Fehler: Falscher Bereinigungszeitpunkt

**Szenario**: Das Gespräch hat gerade begonnen, es gibt nur wenige Tool-Aufrufe, und Sie führen `/dcp sweep` aus.

**Falsches Ergebnis**: Es werden nur wenige Token eingespart, und die Kontextkohärenz könnte beeinträchtigt werden.

**Richtige Vorgehensweise**:
- Warten Sie, bis das Gespräch einen gewissen Umfang erreicht hat (z.B. 10+ Tool-Aufrufe), bevor Sie bereinigen
- Bereinigen Sie Tool-Ausgaben der vorherigen Runde, bevor Sie eine neue Aufgabe beginnen
- Verwenden Sie `/dcp context`, um zu beurteilen, ob eine Bereinigung sinnvoll ist

### ❌ Fehler: Übermäßige Abhängigkeit von manueller Bereinigung

**Szenario**: Sie führen bei jedem Gespräch manuell `/dcp sweep` aus.

**Falsches Ergebnis**:
- Automatische Bereinigungsstrategien (Deduplizierung, Überschreiben, Fehlerbereinigung) werden verschwendet
- Erhöhter Arbeitsaufwand

**Richtige Vorgehensweise**:
- Aktivieren Sie standardmäßig automatische Bereinigungsstrategien (Konfiguration: `strategies.*.enabled`)
- Verwenden Sie manuelle Bereinigung als Ergänzung, wenn nötig
- Überprüfen Sie die Effekte der automatischen Bereinigung mit `/dcp stats`

## Zusammenfassung

Die 4 DCP-Befehle helfen Ihnen, die Token-Nutzung zu überwachen und zu steuern:

| Befehl | Kernfunktion |
| --- | --- |
| `/dcp` | Hilfeinformationen anzeigen |
| `/dcp context` | Token-Verteilung der aktuellen Sitzung analysieren |
| `/dcp stats` | Kumulierte Bereinigungsstatistiken anzeigen |
| `/dcp sweep [n]` | Tools manuell bereinigen |

**Token-Berechnungsstrategie**:
- System: System-Prompt (aus der ersten Antwort abgeleitet)
- Tools: Tool-Ein- und -Ausgaben (abzüglich bereinigter Teile)
- User: Alle Benutzernachrichten (geschätzt)
- Assistant: KI-Ausgabe + Reasoning-Token (Residuum)

**Schutzmechanismus**:
- Geschützte Tools: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- Geschützte Dateien: Konfigurierte Glob-Muster
- Alle Bereinigungsoperationen überspringen diese Inhalte automatisch

**Best Practices**:
- Überprüfen Sie regelmäßig `/dcp context`, um die Token-Zusammensetzung zu verstehen
- Führen Sie `/dcp sweep` vor neuen Aufgaben aus, um den Verlauf zu bereinigen
- Verlassen Sie sich auf automatische Bereinigung, manuelle Bereinigung als Ergänzung
- Überprüfen Sie Langzeiteffekte mit `/dcp stats`

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir den **[Schutzmechanismus](../../advanced/protection/)**.
>
> Sie werden lernen:
> - Wie der Rundenschutz versehentliche Bereinigung verhindert
> - Wie Sie die Liste der geschützten Tools anpassen
> - Wie Sie geschützte Dateimuster konfigurieren
> - Spezielle Behandlung von Sub-Agent-Sitzungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeile |
| --- | --- | --- |
| /dcp Hilfebefehl | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 19-32 |
| /dcp context Befehl | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 238-247 |
| Token-Berechnungsstrategie | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 5-38 |
| /dcp stats Befehl | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| /dcp sweep Befehl | [`lib/commands/sweep.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/sweep.ts) | 123-259 |
| Konfiguration geschützter Tools | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 461 |
| Standard-Liste geschützter Tools | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 150-151 |

**Wichtige Konstanten**:
- `DEFAULT_PROTECTED_TOOLS`: Standard-Liste der geschützten Tools

**Wichtige Funktionen**:
- `handleHelpCommand()`: Verarbeitet den /dcp Hilfebefehl
- `handleContextCommand()`: Verarbeitet den /dcp context Befehl
- `analyzeTokens()`: Berechnet die Token-Anzahl für jede Kategorie
- `handleStatsCommand()`: Verarbeitet den /dcp stats Befehl
- `handleSweepCommand()`: Verarbeitet den /dcp sweep Befehl
- `buildToolIdList()`: Erstellt die Tool-ID-Liste

</details>
