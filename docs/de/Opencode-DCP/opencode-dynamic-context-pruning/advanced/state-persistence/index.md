---
title: "Zustandspersistenz: Verlauf sitzungsübergreifend speichern | opencode-dynamic-context-pruning"
subtitle: "Zustandspersistenz: Verlauf sitzungsübergreifend speichern"
sidebarTitle: "Daten nach Neustart behalten"
description: "Lernen Sie den Persistenzmechanismus von opencode-dynamic-context-pruning kennen. Speichern Sie den Pruning-Verlauf sitzungsübergreifend und sehen Sie die kumulierten Token-Einsparungen mit /dcp stats."
tags:
  - "advanced"
  - "state-management"
  - "persistence"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 2
---

# Zustandspersistenz: Pruning-Verlauf sitzungsübergreifend speichern

## Was Sie lernen werden

- Verstehen, wie DCP den Pruning-Zustand über OpenCode-Neustarts hinweg erhält
- Den Speicherort und das Inhaltsformat der Persistenzdateien kennen
- Die Zustandsverwaltungslogik bei Sitzungswechseln und Kontextkomprimierung beherrschen
- Mit `/dcp stats` die kumulierten Token-Einsparungen aller Sitzungen anzeigen

## Ihr aktuelles Problem

Sie haben OpenCode geschlossen und nach dem Neustart festgestellt, dass Ihre vorherigen Pruning-Einträge verschwunden sind? Oder Sie fragen sich, woher die „kumulierten Einsparungen aller Sitzungen" in `/dcp stats` stammen?

Der Persistenzmechanismus von DCP speichert automatisch im Hintergrund Ihren Pruning-Verlauf und Ihre Statistikdaten, sodass diese auch nach einem Neustart sichtbar bleiben.

## Wann Sie diese Funktion nutzen sollten

- Wenn Sie Token-Einsparungen sitzungsübergreifend kumulieren möchten
- Wenn Sie den Pruning-Verlauf nach einem OpenCode-Neustart fortsetzen möchten
- Wenn Sie DCP langfristig nutzen und den Gesamteffekt sehen möchten

## Kernkonzept

**Was ist Zustandspersistenz?**

**Zustandspersistenz** bedeutet, dass DCP den Pruning-Verlauf und die Statistikdaten in Dateien auf der Festplatte speichert, um sicherzustellen, dass diese Informationen nach einem OpenCode-Neustart oder Sitzungswechsel nicht verloren gehen.

::: info Warum ist Persistenz notwendig?

Ohne Persistenz würde nach jedem Schließen von OpenCode Folgendes passieren:
- Die Liste der geprunten Tool-IDs geht verloren
- Die Token-Einsparungsstatistiken werden auf Null zurückgesetzt
- Die KI könnte dasselbe Tool erneut prunen

Mit Persistenz kann DCP:
- Sich merken, welche Tools bereits geprunt wurden
- Token-Einsparungen über alle Sitzungen kumulieren
- Nach einem Neustart die vorherige Arbeit fortsetzen
:::

**Die zwei Hauptbestandteile der persistierten Inhalte**

Der von DCP gespeicherte Zustand enthält zwei Arten von Informationen:

| Typ | Inhalt | Verwendungszweck |
| --- | --- | --- |
| **Pruning-Zustand** | Liste der IDs geprunter Tools | Vermeidung von Doppel-Pruning, sitzungsübergreifende Nachverfolgung |
| **Statistikdaten** | Anzahl eingesparter Token (aktuelle Sitzung + historisch kumuliert) | Darstellung des DCP-Effekts, Langzeit-Trendanalyse |

Diese Daten werden nach OpenCode-Sitzungs-ID getrennt gespeichert, wobei jede Sitzung einer JSON-Datei entspricht.

## Datenfluss

```mermaid
graph TD
    subgraph "Pruning-Operationen"
        A1[KI ruft discard/extract auf]
        A2[Benutzer führt /dcp sweep aus]
    end

    subgraph "Speicherzustand"
        B1[SessionState.prune.toolIds]
        B2[SessionState.stats]
    end

    subgraph "Persistenter Speicher"
        C1[~/.local/share/opencode/storage/plugin/dcp/]
        C2[{sessionId}.json]
    end

    A1 --> B1
    A2 --> B1
    B1 -->|Asynchrones Speichern| C1
    B2 -->|Asynchrones Speichern| C1
    C1 --> C2

    C2 -->|Laden bei Sitzungswechsel| B1
    C2 -->|Laden bei Sitzungswechsel| B2

    D[OpenCode summary-Nachricht] -->|Cache leeren| B1
```

## Schritt-für-Schritt-Anleitung

### Schritt 1: Den Speicherort der Persistenz verstehen

**Warum**
Wenn Sie wissen, wo die Daten gespeichert sind, können Sie sie bei Bedarf manuell überprüfen oder löschen.

DCP speichert den Zustand im lokalen Dateisystem und lädt nichts in die Cloud hoch.

```bash
# Speicherort des Persistenzverzeichnisses
~/.local/share/opencode/storage/plugin/dcp/

# Jede Sitzung hat eine JSON-Datei im Format: {sessionId}.json
```

**Was Sie sehen sollten**: Im Verzeichnis befinden sich möglicherweise mehrere `.json`-Dateien, die jeweils einer OpenCode-Sitzung entsprechen.

::: tip Datenschutz

DCP speichert nur den Pruning-Zustand und Statistikdaten lokal, ohne sensible Informationen. Die Persistenzdateien enthalten:
- Tool-ID-Listen (numerische Kennungen)
- Anzahl eingesparter Token (Statistikdaten)
- Zeitpunkt der letzten Aktualisierung (Zeitstempel)

Sie enthalten keine Gesprächsinhalte, Tool-Ausgaben oder Benutzereingaben.
:::

### Schritt 2: Das Format der Persistenzdateien verstehen

**Warum**
Das Verständnis der Dateistruktur ermöglicht manuelle Überprüfung oder Fehlerbehebung.

```bash
# Alle Persistenzdateien auflisten
ls -la ~/.local/share/opencode/storage/plugin/dcp/

# Inhalt einer bestimmten Sitzung anzeigen
cat ~/.local/share/opencode/storage/plugin/dcp/{sessionId}.json
```

**Was Sie sehen sollten**: Eine JSON-Struktur wie diese:

```json
{
  "sessionName": "Mein Sitzungsname",
  "prune": {
    "toolIds": ["12345", "12346", "12347"]
  },
  "stats": {
    "pruneTokenCounter": 0,
    "totalPruneTokens": 15420
  },
  "lastUpdated": "2026-01-23T10:30:45.123Z"
}
```

**Feldbeschreibungen**:

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| `sessionName` | string (optional) | Sitzungsname zur einfachen Identifikation |
| `prune.toolIds` | string[] | Liste der IDs geprunter Tools |
| `stats.pruneTokenCounter` | number | In der aktuellen Sitzung eingesparte Token (nicht archiviert) |
| `stats.totalPruneTokens` | number | Historisch kumulierte eingesparte Token |
| `lastUpdated` | string | Zeitpunkt der letzten Aktualisierung im ISO 8601-Format |

### Schritt 3: Kumulierte Statistiken anzeigen

**Warum**
Um den kumulierten Effekt aller Sitzungen zu verstehen und den langfristigen Wert von DCP zu bewerten.

```bash
# In OpenCode ausführen
/dcp stats
```

**Was Sie sehen sollten**: Ein Statistik-Panel

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.4K
  Tools pruned:   3

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~154.2K
  Tools pruned:   47
  Sessions:       12
```

**Bedeutung der Statistikdaten**:

| Statistik | Quelle | Beschreibung |
| --- | --- | --- |
| **Session** | Aktueller Speicherzustand | Pruning-Effekt der aktuellen Sitzung |
| **All-time** | Alle Persistenzdateien | Kumulierter Effekt aller historischen Sitzungen |

::: info Wie die All-time-Statistik berechnet wird

DCP durchläuft alle JSON-Dateien im Verzeichnis `~/.local/share/opencode/storage/plugin/dcp/` und summiert:
- `totalPruneTokens`: Gesamtzahl der in allen Sitzungen eingesparten Token
- `toolIds.length`: Gesamtzahl der in allen Sitzungen geprunten Tools
- Dateianzahl: Gesamtzahl der Sitzungen

So können Sie den Gesamteffekt von DCP bei langfristiger Nutzung sehen.
:::

### Schritt 4: Den automatischen Speichermechanismus verstehen

**Warum**
Wenn Sie wissen, wann DCP den Zustand speichert, vermeiden Sie versehentlichen Datenverlust.

DCP speichert den Zustand automatisch auf der Festplatte zu folgenden Zeitpunkten:

| Auslöser | Gespeicherter Inhalt | Aufrufstelle |
| --- | --- | --- |
| Nach KI-Aufruf von `discard`/`extract`-Tools | Aktualisierter Pruning-Zustand + Statistiken | `lib/strategies/tools.ts:148-150` |
| Nach Benutzerausführung von `/dcp sweep` | Aktualisierter Pruning-Zustand + Statistiken | `lib/commands/sweep.ts:234-236` |
| Nach Abschluss einer Pruning-Operation | Asynchrones Speichern, blockiert nicht den Hauptprozess | `saveSessionState()` |

**Speicherablauf**:

```typescript
// 1. Speicherzustand aktualisieren
state.stats.totalPruneTokens += state.stats.pruneTokenCounter
state.stats.pruneTokenCounter = 0

// 2. Asynchron auf Festplatte speichern
await saveSessionState(state, logger)
```

::: tip Vorteile des asynchronen Speicherns

DCP verwendet einen asynchronen Speichermechanismus, um sicherzustellen, dass Pruning-Operationen nicht durch Festplatten-I/O blockiert werden. Selbst wenn das Speichern fehlschlägt (z.B. bei unzureichendem Speicherplatz), wird der Pruning-Effekt der aktuellen Sitzung nicht beeinträchtigt.

Bei Fehlern wird eine Warnung in `~/.config/opencode/logs/dcp/` protokolliert.
:::

### Schritt 5: Den automatischen Lademechanismus verstehen

**Warum**
Wenn Sie wissen, wann DCP den persistierten Zustand lädt, verstehen Sie das Verhalten bei Sitzungswechseln.

DCP lädt den persistierten Zustand automatisch zu folgenden Zeitpunkten:

| Auslöser | Geladener Inhalt | Aufrufstelle |
| --- | --- | --- |
| Beim Start von OpenCode oder Sitzungswechsel | Historischer Pruning-Zustand + Statistiken dieser Sitzung | `lib/state/state.ts:104` (innerhalb der Funktion `ensureSessionInitialized`) |

**Ladeablauf**:

```typescript
// 1. Änderung der Sitzungs-ID erkennen
if (state.sessionId !== lastSessionId) {
    await ensureSessionInitialized(client, state, lastSessionId, logger, messages)
}

// 2. Speicherzustand zurücksetzen
resetSessionState(state)
state.sessionId = lastSessionId

// 3. Persistierten Zustand von der Festplatte laden
const persisted = await loadSessionState(sessionId, logger)
if (persisted) {
    state.prune = { toolIds: persisted.prune.toolIds }
    state.stats = {
        pruneTokenCounter: persisted.stats.pruneTokenCounter,
        totalPruneTokens: persisted.stats.totalPruneTokens
    }
}
```

**Was Sie sehen sollten**: Nach dem Wechsel zu einer früheren Sitzung bleiben die in `/dcp stats` angezeigten historischen Statistikdaten unverändert.

### Schritt 6: Die Zustandsbereinigung bei Kontextkomprimierung verstehen

**Warum**
Um zu verstehen, wie DCP den Zustand behandelt, wenn OpenCode den Kontext automatisch komprimiert.

Wenn OpenCode erkennt, dass ein Gespräch zu lang wird, generiert es automatisch eine summary-Nachricht zur Kontextkomprimierung. DCP erkennt diese Komprimierung und bereinigt den entsprechenden Zustand.

```typescript
// Behandlung bei Erkennung einer summary-Nachricht
if (lastCompactionTimestamp > state.lastCompaction) {
    state.lastCompaction = lastCompactionTimestamp
    state.toolParameters.clear()  // Tool-Cache leeren
    state.prune.toolIds = []       // Pruning-Zustand leeren
    logger.info("Detected compaction from messages - cleared tool cache")
}
```

::: info Warum ist das Leeren notwendig?

Die summary-Nachricht von OpenCode komprimiert den gesamten Gesprächsverlauf. Zu diesem Zeitpunkt:
- Alte Tool-Aufrufe wurden in die Zusammenfassung integriert
- Das Beibehalten der Tool-ID-Liste ist bedeutungslos (die Tools existieren nicht mehr)
- Das Leeren des Zustands vermeidet Verweise auf ungültige Tool-IDs

Dies ist ein Design-Kompromiss: Ein Teil des Pruning-Verlaufs wird geopfert, um die Zustandskonsistenz zu gewährleisten.
:::

## Checkliste ✅

Bestätigen Sie, dass Sie die folgenden Punkte verstanden haben:

- [ ] Die Persistenzdateien von DCP werden in `~/.local/share/opencode/storage/plugin/dcp/` gespeichert
- [ ] Jede Sitzung entspricht einer `{sessionId}.json`-Datei
- [ ] Der persistierte Inhalt umfasst den Pruning-Zustand (toolIds) und Statistikdaten (totalPruneTokens)
- [ ] Die „All-time"-Statistik in `/dcp stats` stammt aus der Summe aller Persistenzdateien
- [ ] Nach Pruning-Operationen wird automatisch asynchron gespeichert, ohne den Hauptprozess zu blockieren
- [ ] Bei Sitzungswechseln wird der historische Zustand dieser Sitzung automatisch geladen
- [ ] Bei Erkennung einer OpenCode summary-Nachricht werden Tool-Cache und Pruning-Zustand geleert

## Häufige Fehler

### ❌ Versehentliches Löschen von Persistenzdateien

**Problem**: Sie haben Dateien im Verzeichnis `~/.local/share/opencode/storage/plugin/dcp/` manuell gelöscht.

**Folgen**:
- Der historische Pruning-Zustand geht verloren
- Die kumulierten Statistiken werden auf Null zurückgesetzt
- Die Pruning-Funktion der aktuellen Sitzung ist jedoch nicht betroffen

**Lösung**: Beginnen Sie einfach neu. DCP erstellt automatisch neue Persistenzdateien.

### ❌ Sub-Agent-Zustand nicht sichtbar

**Problem**: Sie haben Tools in einem Sub-Agent geprunt, aber nach der Rückkehr zum Haupt-Agent sind diese Pruning-Einträge nicht sichtbar.

**Ursache**: Sub-Agents haben eine eigene `sessionId`, und der Pruning-Zustand wird in einer separaten Datei persistiert. Beim Wechsel zurück zum Haupt-Agent wird der persistierte Zustand des Sub-Agents nicht geladen, da die `sessionId` des Haupt-Agents unterschiedlich ist.

**Lösung**: Dies ist beabsichtigtes Verhalten. Der Zustand von Sub-Agent-Sitzungen ist unabhängig und wird nicht mit dem Haupt-Agent geteilt. Wenn Sie alle Pruning-Einträge (einschließlich Sub-Agents) statistisch erfassen möchten, verwenden Sie die „All-time"-Statistik in `/dcp stats` (sie summiert die Daten aller Persistenzdateien).

### ❌ Speicherfehler durch unzureichenden Festplattenspeicher

**Problem**: Die „All-time"-Statistik in `/dcp stats` wächst nicht.

**Ursache**: Möglicherweise ist der Festplattenspeicher unzureichend und das Speichern ist fehlgeschlagen.

**Lösung**: Überprüfen Sie die Protokolldateien in `~/.config/opencode/logs/dcp/` auf Fehler wie „Failed to save session state".

## Zusammenfassung

**Der Kernwert der Zustandspersistenz**:

1. **Sitzungsübergreifendes Gedächtnis**: Merkt sich, welche Tools bereits geprunt wurden, und vermeidet doppelte Arbeit
2. **Kumulierte Statistiken**: Langfristige Verfolgung der Token-Einsparungen durch DCP
3. **Wiederherstellung nach Neustart**: Fortsetzung der vorherigen Arbeit nach einem OpenCode-Neustart

**Zusammenfassung des Datenflusses**:

```
Pruning-Operation → Speicherzustand aktualisieren → Asynchron auf Festplatte speichern
                ↑
Sitzungswechsel → Von Festplatte laden → Speicherzustand wiederherstellen
                ↑
Kontextkomprimierung → Speicherzustand leeren (Festplattendatei wird nicht gelöscht)
```

**Wichtige Punkte**:

- Persistenz ist eine lokale Dateioperation und beeinträchtigt nicht die Pruning-Leistung
- „All-time" in `/dcp stats` stammt aus der Summe aller historischen Sitzungen
- Sub-Agent-Sitzungen werden nicht persistiert – dies ist beabsichtigtes Verhalten
- Bei Kontextkomprimierung wird der Cache geleert, um die Zustandskonsistenz zu gewährleisten

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Auswirkungen auf Prompt-Caching](/de/Opencode-DCP/opencode-dynamic-context-pruning/advanced/prompt-caching/)**.
>
> Sie werden lernen:
> - Wie DCP-Pruning das Prompt-Caching beeinflusst
> - Wie Sie Cache-Trefferquote und Token-Einsparungen abwägen
> - Den Caching-Abrechnungsmechanismus von Anthropic verstehen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Definition der Persistenzschnittstelle | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 14-19 |
| Sitzungszustand speichern | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 33-66 |
| Sitzungszustand laden | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 68-101 |
| Statistiken aller Sitzungen laden | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 109-146 |
| Speicherverzeichnis-Konstante | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 21 |
| Sitzungszustand-Initialisierung | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| Kontextkomprimierung erkennen | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 118-126 |
| Statistikbefehl-Verarbeitung | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| Pruning-Tool Zustand speichern | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts) | 144-150 |

**Wichtige Konstanten**:
- `STORAGE_DIR = ~/.local/share/opencode/storage/plugin/dcp`: Stammverzeichnis für Persistenzdateien

**Wichtige Funktionen**:
- `saveSessionState(state, logger)`: Speichert den Sitzungszustand asynchron auf der Festplatte
- `loadSessionState(sessionId, logger)`: Lädt den Zustand einer bestimmten Sitzung von der Festplatte
- `loadAllSessionStats(logger)`: Aggregiert die Statistikdaten aller Sitzungen
- `ensureSessionInitialized(client, state, sessionId, logger, messages)`: Stellt sicher, dass die Sitzung initialisiert ist und lädt den persistierten Zustand

**Wichtige Schnittstellen**:
- `PersistedSessionState`: Strukturdefinition des persistierten Zustands
- `AggregatedStats`: Strukturdefinition der kumulierten Statistikdaten

</details>
