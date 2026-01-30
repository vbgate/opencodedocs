---
title: "Subagent-Behandlung: Automatischer Deaktivierungsmechanismus | opencode-dynamic-context-pruning"
subtitle: "Subagent-Behandlung: Automatischer Deaktivierungsmechanismus"
sidebarTitle: "Subagent wird nicht gekürzt? So funktioniert's"
description: "Lernen Sie das Verhalten und die Einschränkungen von DCP in Subagent-Sitzungen kennen. Verstehen Sie, warum DCP das Pruning von Subagenten automatisch deaktiviert und wie sich die Token-Nutzungsstrategien von Subagenten und Haupt-Agenten unterscheiden."
tags:
  - "Subagent"
  - "Sitzungsverwaltung"
  - "Nutzungseinschränkungen"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 4
---

# Subagent-Behandlung

## Was Sie lernen werden

- Verstehen, warum DCP in Subagent-Sitzungen automatisch deaktiviert wird
- Die unterschiedlichen Token-Nutzungsstrategien von Subagenten und Haupt-Agenten kennenlernen
- Probleme vermeiden, die durch die Verwendung von DCP-Funktionen in Subagenten entstehen

## Ihr aktuelles Dilemma

Ihnen ist vielleicht aufgefallen: In manchen OpenCode-Konversationen scheint die Pruning-Funktion von DCP „nicht zu funktionieren" – Tool-Aufrufe werden nicht bereinigt, und die Token-Einsparungsstatistik ändert sich nicht. Dies kann passieren, wenn Sie bestimmte OpenCode-Funktionen verwenden, wie z.B. Code-Reviews, Tiefenanalysen usw.

Das ist kein Fehler von DCP, sondern diese Funktionen nutzen den **Subagent (Subagent)**-Mechanismus, und DCP behandelt Subagenten speziell.

## Was ist ein Subagent

::: info Was ist ein Subagent?

Ein **Subagent** ist OpenCodes interner KI-Agent-Mechanismus. Der Haupt-Agent delegiert komplexe Aufgaben an einen Subagent, der nach Abschluss die Ergebnisse in Form einer Zusammenfassung zurückgibt.

**Typische Anwendungsszenarien**:
- Code-Review: Der Haupt-Agent startet einen Subagent, der mehrere Dateien sorgfältig liest, Probleme analysiert und dann eine übersichtliche Problemliste zurückgibt
- Tiefenanalyse: Der Haupt-Agent startet einen Subagent, der umfangreiche Tool-Aufrufe und Schlussfolgerungen durchführt und schließlich die Kernbefunde zurückgibt

Technisch gesehen hat eine Subagent-Sitzung eine `parentID`-Eigenschaft, die auf ihre Eltern-Sitzung verweist.
:::

## DCP-Verhalten bei Subagenten

DCP **deaktiviert automatisch alle Pruning-Funktionen** in Subagent-Sitzungen.

### Warum kürzt DCP Subagenten nicht?

Dahinter steckt ein wichtiges Design-Konzept:

| Rolle | Token-Nutzungsstrategie | Hauptziel |
| --- | --- | --- |
| **Haupt-Agent** | Effiziente Token-Nutzung erforderlich | Kontext in langen Gesprächen beibehalten, Kosten senken |
| **Subagent** | Kann Token frei nutzen | Umfangreiche Informationen generieren, um Zusammenfassung durch Haupt-Agenten zu erleichtern |

**Der Wert eines Subagenten** liegt darin, „Token gegen Informationsqualität" einzutauschen – durch zahlreiche Tool-Aufrufe und detaillierte Analysen liefert er dem Eltern-Agenten qualitativ hochwertige Informationszusammenfassungen. Wenn DCP in einem Subagent die Tool-Aufrufe kürzen würde, könnte dies zu folgenden Problemen führen:

1. **Informationsverlust**: Der detaillierte Analyseprozess des Subagenten wird gelöscht, sodass keine vollständige Zusammenfassung generiert werden kann
2. **Verminderte Qualität der Zusammenfassung**: Der Haupt-Agent erhält eine unvollständige Zusammenfassung, was die endgültige Entscheidung beeinflusst
3. **Verstoß gegen das Designziel**: Subagenten sind genau für „Qualität um jeden Token-Preis" konzipiert

**Fazit**: Subagenten benötigen kein Pruning, da sie schließlich nur eine prägnante Zusammenfassung an den Eltern-Agenten zurückgeben.

### Wie erkennt DCP Subagenten?

DCP erkennt, ob die aktuelle Sitzung ein Subagent ist, durch folgende Schritte:

```typescript
// lib/state/utils.ts:1-8
export async function isSubAgentSession(client: any, sessionID: string): Promise<boolean> {
    try {
        const result = await client.session.get({ path: { id: sessionID } })
        return !!result.data?.parentID  // Wenn parentID vorhanden ist, handelt es sich um einen Subagenten
    } catch (error: any) {
        return false
    }
}
```

**Erkennungszeitpunkt**:
- Beim Sitzungs-Initialisieren (`ensureSessionInitialized()`)
- Vor jeder Nachrichtentransformation (`createChatMessageTransformHandler()`)

### DCP-Verhalten in Subagent-Sitzungen

Nach der Erkennung eines Subagenten überspringt DCP folgende Funktionen:

| Funktion | Normale Sitzung | Subagent-Sitzung | Überspring-Position |
| --- | --- | --- | --- |
| System-Prompt-Injektion | ✅ Ausgeführt | ❌ Übersprungen | `hooks.ts:26-28` |
| Automatische Pruning-Strategie | ✅ Ausgeführt | ❌ Übersprungen | `hooks.ts:64-66` |
| Tool-Listen-Injektion | ✅ Ausgeführt | ❌ Übersprungen | `hooks.ts:64-66` |

**Code-Implementierung** (`lib/hooks.ts`):

```typescript
// System-Prompt-Handler
export function createSystemPromptHandler(state: SessionState, ...) {
    return async (_input: unknown, output: { system: string[] }) => {
        if (state.isSubAgent) {  // ← Subagent-Erkennung
            return               // ← Direkt zurückkehren, keine Pruning-Tool-Beschreibung injizieren
        }
        // ... Normale Logik
    }
}

// Nachrichtentransformations-Handler
export function createChatMessageTransformHandler(...) {
    return async (input: {}, output: { messages: WithParts[] }) => {
        await checkSession(client, state, logger, output.messages)

        if (state.isSubAgent) {  // ← Subagent-Erkennung
            return               // ← Direkt zurückkehren, kein Pruning durchführen
        }

        // ... Normale Logik: Duplikate entfernen, Überschreiben, Fehler löschen, Tool-Listen injizieren usw.
    }
}
```

## Praktische Fallvergleiche

### Fall 1: Haupt-Agent-Sitzung

**Szenario**: Sie sprechen mit dem Haupt-Agenten und bitten ihn um Code-Analyse

**DCP-Verhalten**:
```
Benutzereingabe: "Analysiere die Tool-Funktionen in src/utils.ts"
    ↓
[Haupt-Agent] Liest src/utils.ts
    ↓
[Haupt-Agent] Analysiert Code
    ↓
Benutzereingabe: "Prüfe auch src/helpers.ts"
    ↓
DCP erkennt wiederholtes Lese-Muster
    ↓
DCP markiert erstes src/utils.ts-Lesen als kürzbar ✅
    ↓
Beim Senden des Kontexts an LLM wird erster Leseinhalt durch Platzhalter ersetzt
    ↓
✅ Token-Einsparung
```

### Fall 2: Subagent-Sitzung

**Szenario**: Der Haupt-Agent startet einen Subagenten für eine tiefgreifende Code-Überprüfung

**DCP-Verhalten**:
```
Benutzereingabe: "Tiefenüberprüfung aller Dateien unter src/"
    ↓
[Haupt-Agent] Erkennt komplexe Aufgabe, startet Subagenten
    ↓
[Subagent] Liest src/utils.ts
    ↓
[Subagent] Liest src/helpers.ts
    ↓
[Subagent] Liest src/config.ts
    ↓
[Subagent] Liest weitere Dateien...
    ↓
DCP erkennt Subagent-Sitzung
    ↓
DCP überspringt alle Pruning-Operationen ❌
    ↓
[Subagent] Generiert detailliertes Überprüfungsergebnis
    ↓
[Subagent] Gibt prägnante Zusammenfassung an Haupt-Agenten zurück
    ↓
[Haupt-Agent] Generiert endgültige Antwort basierend auf Zusammenfassung
```

## Häufig gestellte Fragen

### F: Wie kann ich bestätigen, dass die aktuelle Sitzung ein Subagent ist?

**A**: Sie können dies auf folgende Weise bestätigen:

1. **DCP-Protokolle anzeigen** (wenn Debug-Modus aktiviert):
   ```
   2026-01-23T10:30:45.123Z INFO state: session ID = abc-123
   2026-01-23T10:30:45.124Z INFO state: isSubAgent = true
   ```

2. **Gesprächsmerkmale beobachten**:
   - Subagenten werden normalerweise bei komplexen Aufgaben gestartet (z.B. Tiefenanalyse, Code-Review)
   - Der Haupt-Agent zeigt Meldungen wie „Subagent wird gestartet" oder ähnliches an

3. **`/dcp stats` Befehl verwenden**:
   - In Subagent-Sitzungen werden Tool-Aufrufe nicht gekürzt
   - In der Token-Statistik ist die Anzahl „Gekürzt" 0

### F: Werden keine Token verschwendet, wenn in Subagenten überhaupt nicht gekürzt wird?

**A**: Nein. Die Gründe:

1. **Subagenten sind kurzlebig**: Nach Abschluss der Aufgabe endet der Subagent, im Gegensatz zu langen Gesprächen mit dem Haupt-Agenten
2. **Subagenten geben Zusammenfassungen zurück**: Was schließlich an den Haupt-Agenten übertragen wird, ist eine prägnante Zusammenfassung, die die Kontextlast des Haupt-Agenten nicht erhöht
3. **Unterschiedliche Designziele**: Subagenten dienen dem Zweck „Qualität mit Token zu kaufen", nicht „Token zu sparen"

### F: Kann DCP-Pruning für Subagenten erzwungen werden?

**A**: **Nein, und das sollte auch nicht geschehen**. DCP ist so konzipiert, dass Subagenten den vollständigen Kontext behalten können, um qualitativ hochwertige Zusammenfassungen zu generieren. Wenn Pruning erzwungen würde, könnte dies:

- Zu unvollständigen Zusammenfassungsinformationen führen
- Die Entscheidungsqualität des Haupt-Agenten beeinträchtigen
- Gegen das Subagent-Designkonzept von OpenCode verstoßen

### F: Werden Token-Nutzungen in Subagent-Sitzungen erfasst?

**A**: Subagent-Sitzungen selbst werden nicht von DCP erfasst. Die DCP-Statistik verfolgt nur Token-Einsparungen in Haupt-Agent-Sitzungen.

## Zusammenfassung dieser Lektion

- **Subagent-Erkennung**: DCP erkennt Subagent-Sitzungen durch Überprüfung von `session.parentID`
- **Automatische Deaktivierung**: In Subagent-Sitzungen überspringt DCP automatisch alle Pruning-Funktionen
- **Designgrund**: Subagenten benötigen den vollständigen Kontext, um qualitativ hochwertige Zusammenfassungen zu generieren; Pruning würde diesen Prozess stören
- **Nutzungsgrenzen**: Subagenten zielen nicht auf Token-Effizienz ab, sondern auf Informationsqualität – ein anderes Ziel als beim Haupt-Agenten

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Häufige Probleme und Fehlerbehebung](/de/Opencode-DCP/opencode-dynamic-context-pruning/faq/troubleshooting/)** kennen.
>
> Sie werden lernen:
> - Wie Konfigurationsfehler behoben werden
> - Wie Debug-Protokolle aktiviert werden
> - Häufige Gründe, warum Token nicht reduziert werden
> - Einschränkungen von Subagent-Sitzungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Zum Anzeigen der Quellcode-Positionen klicken</strong></summary>

> Letzte Aktualisierung: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Subagent-Erkennungsfunktion | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts) | 1-8 |
| Sitzungsstatus-Initialisierung | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| System-Prompt-Handler (überspringt Subagenten) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts) | 26-28 |
| Nachrichtentransformations-Handler (überspringt Subagenten) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts) | 64-66 |
| SessionState-Typdefinition | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts) | 27-38 |

**Wichtige Funktionen**:
- `isSubAgentSession()`: Erkennt Subagenten durch `session.parentID`
- `ensureSessionInitialized()`: Erkennt Subagenten beim Initialisieren des Sitzungsstatus
- `createSystemPromptHandler()`: Überspringt System-Prompt-Injektion in Subagent-Sitzungen
- `createChatMessageTransformHandler()`: Überspringt alle Pruning-Operationen in Subagent-Sitzungen

**Wichtige Konstanten**:
- `state.isSubAgent`: Subagent-Flag im Sitzungsstatus

</details>
