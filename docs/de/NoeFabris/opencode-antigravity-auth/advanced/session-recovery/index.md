---
title: "Sitzungswiederherstellung: Automatische Behebung von Tool-Abbrüchen | Antigravity"
sidebarTitle: "Automatische Behebung von Tool-Abbrüchen"
subtitle: "Sitzungswiederherstellung: Automatische Verarbeitung von Tool-Aufruf-Fehlern und Abbrüchen"
description: "Lernen Sie den Sitzungswiederherstellungsmechanismus kennen, der Tool-Abbrüche und Fehler automatisch behebt. Beinhaltet Fehlererkennung, synthetische tool_result-Injection und auto_resume-Konfiguration."
tags:
  - "advanced"
  - "session-recovery"
  - "error-handling"
  - "auto-recovery"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 8
---

# Sitzungswiederherstellung: Automatische Verarbeitung von Tool-Aufruf-Fehlern und Abbrüchen

## Was Sie nach diesem Tutorial können werden

- Verstehen, wie der Sitzungswiederherstellungsmechanismus Tool-Ausführungsabbrüche automatisch verarbeitet
- Konfigurieren der Optionen session_recovery und auto_resume
- Fehler wie tool_result_missing und thinking_block_order diagnostizieren
- Verstehen, wie synthetische tool_results funktionieren

## Ihre aktuelle Situation

Bei der Nutzung von OpenCode können Sie auf diese Abbruchszenarien stoßen:

- Tool-Ausführung durch ESC unterbrechen, was zu eingefrorenen Sitzungen führt, die manuell neu gestartet werden müssen
- Denkblock-Reihenfolgefehler (thinking_block_order), bei dem die KI die Generierung nicht fortsetzen kann
- Fehlerhafte Nutzung der Denkfunktion in Nicht-Denkmodellen (thinking_disabled_violation)
- Zeitaufwendige manuelle Reparatur beschädigter Sitzungszustände

## Wann Sie diesen Ansatz verwenden sollten

Die Sitzungswiederherstellung eignet sich für folgende Szenarien:

| Szenario | Fehlertyp | Wiederherstellungsmethode |
| --- | --- | --- |
| Tool durch ESC unterbrechen | `tool_result_missing` | Automatisches Injizieren eines synthetischen tool_result |
| Denkblock-Reihenfolgefehler | `thinking_block_order` | Automatisches Voreinstellen leerer Denkblöcke |
| Denken im Nicht-Denkmodell | `thinking_disabled_violation` | Automatisches Entfernen aller Denkblöcke |
| Alle oben genannten Fehler | Allgemein | Automatische Reparatur + automatisches Fortfahren (falls aktiviert) |

::: warning Voraussetzungsprüfung
Bevor Sie mit diesem Tutorial beginnen, stellen Sie sicher, dass Sie:
- ✅ Das Plugin opencode-antigravity-auth installiert haben
- ✅ Anfragen mit dem Antigravity-Model senden können
- ✅ Die grundlegenden Konzepte von Tool-Aufrufen verstehen

[Tutorial zur schnellen Installation](../../start/quick-install/) | [Tutorial für die erste Anfrage](../../start/first-request/)
:::

## Kernkonzept

Der Kernmechanismus der Sitzungswiederherstellung:

1. **Fehlererkennung**: Automatische Identifizierung von drei wiederherstellbaren Fehlertypen
   - `tool_result_missing`: Fehlende Ergebnisdaten bei Tool-Ausführung
   - `thinking_block_order`: Fehler in der Denkblock-Reihenfolge
   - `thinking_disabled_violation`: Denken im Nicht-Denkmodell untersagt

2. **Automatische Reparatur**: Injizieren synthetischer Nachrichten basierend auf Fehlertyp
   - Injizieren eines synthetischen tool_result (Inhalt: "Operation cancelled by user (ESC pressed)")
   - Voreinstellen leerer Denkblöcke (Denkblöcke müssen am Nachrichtenanfang stehen)
   - Entfernen aller Denkblöcke (Nicht-Denkmodelle erlauben kein Denken)

3. **Automatisches Fortfahren**: Bei aktiviertem `auto_resume` automatisch eine Continue-Nachricht senden, um das Gespräch fortzusetzen

4. **Deduplikationsverarbeitung**: Verwenden von `Set`, um zu verhindern, dass derselbe Fehler mehrfach verarbeitet wird

::: info Was sind synthetische Nachrichten?
Synthetische Nachrichten sind "virtuelle" Nachrichten, die vom Plugin injiziert werden, um beschädigte Sitzungszustände zu reparieren. Wenn ein Tool abgebrochen wird, injiziert das Plugin ein synthetisches tool_result, das der KI sagt "Dieses Tool wurde abgebrochen", sodass die KI in der Lage ist, eine neue Antwort zu generieren.
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Sitzungswiederherstellung aktivieren (standardmäßig bereits aktiv)

**Warum**
Die Sitzungswiederherstellung ist standardmäßig aktiviert, muss aber neu aktiviert werden, wenn sie zuvor manuell deaktiviert wurde.

**Aktion**

Bearbeiten Sie die Plugin-Konfigurationsdatei:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Bestätigen Sie die folgende Konfiguration:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**Sie sollten sehen**:

1. `session_recovery` ist `true` (Standardwert)
2. `auto_resume` ist `false` (Empfohlene manuelle Fortsetzung zur Vermeidung von Fehlbedienung)
3. `quiet_mode` ist `false` (Toast-Benachrichtigungen anzeigen, um den Wiederherstellungsstatus zu verfolgen)

::: tip Konfigurationsoptionen-Erklärung
- `session_recovery`: Aktivieren/Deaktivieren der Sitzungswiederherstellungsfunktion
- `auto_resume`: Automatisches Senden einer "continue"-Nachricht (Vorsicht, kann zu unbeabsichtigter KI-Ausführung führen)
- `quiet_mode`: Toast-Benachrichtigungen ausblenden (für Debugging temporär deaktivieren)
:::

### Schritt 2: tool_result_missing-Wiederherstellung testen

**Warum**
Überprüfung, ob der Sitzungswiederherstellungsmechanismus normal funktioniert, wenn die Tool-Ausführung unterbrochen wird.

**Aktion**

1. Öffnen Sie OpenCode und wählen Sie ein Modell, das Tool-Aufrufe unterstützt (z.B. `google/antigravity-claude-sonnet-4-5`)
2. Geben Sie eine Aufgabe ein, die einen Tool-Aufruf erfordert (z.B. "Zeige mir die Dateien im aktuellen Verzeichnis")
3. Unterbrechen Sie während der Tool-Ausführung durch Drücken von `ESC`

**Sie sollten sehen**:

1. OpenCode stoppt die Tool-Ausführung sofort
2. Toast-Benachrichtigung erscheint: "Tool Crash Recovery - Injecting cancelled tool results..."
3. Die KI setzt die Generierung automatisch fort, ohne auf Tool-Ergebnisse zu warten

::: info tool_result_missing-Fehlerprinzip
Wenn Sie ESC drücken, unterbricht OpenCode die Tool-Ausführung, was zu einer Inkonsistenz in der Sitzung führt: es gibt `tool_use`, aber kein entsprechendes `tool_result`. Die Antigravity-API erkennt diese Inkonsistenz und gibt einen `tool_result_missing`-Fehler zurück. Das Plugin fängt diesen Fehler ab, injiziert ein synthetisches tool_result und stellt den konsistenten Zustand der Sitzung wieder her.
:::

### Schritt 3: thinking_block_order-Wiederherstellung testen

**Warum**
Überprüfung, ob der Sitzungswiederherstellungsmechanismus Denkblock-Reihenfolgefehler automatisch beheben kann.

**Aktion**

1. Öffnen Sie OpenCode und wählen Sie ein Denkmodell (z.B. `google/antigravity-claude-opus-4-5-thinking`)
2. Geben Sie eine Aufgabe ein, die tiefes Nachdenken erfordert
3. Wenn Sie auf den Fehler "Expected thinking but found text" oder "First block must be thinking" stoßen

**Sie sollten sehen**:

1. Toast-Benachrichtigung erscheint: "Thinking Block Recovery - Fixing message structure..."
2. Die Sitzung wird automatisch repariert, die KI kann die Generierung fortsetzen

::: tip thinking_block_order-Fehlerursache
Dieser Fehler wird normalerweise durch folgende Ursachen verursacht:
- Denkblöcke wurden versehentlich entfernt (z.B. durch andere Tools)
- Beschädigter Sitzungszustand (z.B. Festplattenschreibfehler)
- Formatinkompatibilität bei der Migration zwischen Modellen
:::

### Schritt 4: thinking_disabled_violation-Wiederherstellung testen

**Warum**
Überprüfung, ob die Sitzungswiederherstellung Denkblöcke automatisch entfernt, wenn die Denkfunktion in einem Nicht-Denkmodell fälschlicherweise verwendet wird.

**Aktion**

1. Öffnen Sie OpenCode und wählen Sie ein Nicht-Denkmodell (z.B. `google/antigravity-claude-sonnet-4-5`)
2. Wenn die Verlaufsnachrichten Denkblöcke enthalten

**Sie sollten sehen**:

1. Toast-Benachrichtigung erscheint: "Thinking Strip Recovery - Stripping thinking blocks..."
2. Alle Denkblöcke werden automatisch entfernt
3. Die KI kann die Generierung fortsetzen

::: warning Denkblockverlust
Das Entfernen von Denkblöcken führt zum Verlust des Denkinhalts der KI, was möglicherweise die Qualität der Antwort beeinträchtigt. Bitte stellen Sie sicher, dass Sie die Denkfunktion in Denkmodellen verwenden.
:::

### Schritt 5: auto_resume konfigurieren (optional)

**Warum**
Nach Aktivierung von auto_resume wird nach Abschluss der Sitzungswiederherstellung automatisch "continue" gesendet, ohne manuelle Eingabe erforderlich.

**Aktion**

Setzen Sie in `antigravity.json`:

```json
{
  "auto_resume": true
}
```

Speichern Sie die Datei und starten Sie OpenCode neu.

**Sie sollten sehen**:

1. Nach Abschluss der Sitzungswiederherstellung setzt die KI die Generierung automatisch fort
2. Keine manuelle Eingabe von "continue" erforderlich

::: danger auto_resume-Risiko
Automatisches Continue kann dazu führen, dass die KI Tool-Aufrufe unerwartet ausführt. Wenn Sie Bedenken bezüglich der Sicherheit von Tool-Aufrufen haben, empfehlen wir, `auto_resume: false` zu belassen und den Wiederherstellungszeitpunkt manuell zu steuern.
:::

## Checkpoint ✅

Nach Abschluss der oben genannten Schritte sollten Sie in der Lage sein:

- [ ] Die session_recovery-Konfiguration in `antigravity.json` zu sehen
- [ ] Die "Tool Crash Recovery"-Benachrichtigung beim Drücken von ESC zur Tool-Unterbrechung zu sehen
- [ ] Die Sitzung automatisch wiederherzustellen, ohne manuell wiederholen zu müssen
- [ ] Zu verstehen, wie synthetische tool_results funktionieren
- [ ] Zu wissen, wann auto_resume aktiviert/deaktiviert werden sollte

## Häufige Fallstricke

### Sitzungswiederherstellung wurde nicht ausgelöst

**Symptom**: Fehler aufgetreten, aber keine automatische Wiederherstellung

**Ursache**: `session_recovery` deaktiviert oder Fehlertyp stimmt nicht überein

**Lösung**:

1. Bestätigen Sie, dass `session_recovery: true` gesetzt ist:

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. Überprüfen Sie, ob der Fehlertyp wiederherstellbar ist:

```bash
# Aktivieren Sie Debug-Logs für detaillierte Fehlerinformationen
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. Überprüfen Sie die Konsole auf Fehlerprotokolle:

```bash
# Protokollspeicherort
~/.config/opencode/antigravity-logs/session-recovery.log
```

### Synthetisches tool_result wurde nicht injiziert

**Symptom**: Nach Tool-Unterbrechung wartet die KI immer noch auf Tool-Ergebnisse

**Ursache**: OpenCode-Speicherpfad falsch konfiguriert

**Lösung**:

1. Bestätigen Sie, dass der OpenCode-Speicherpfad korrekt ist:

```bash
# Zeigen Sie die OpenCode-Konfiguration an
cat ~/.config/opencode/opencode.json | grep storage
```

2. Überprüfen Sie, ob die Nachrichten- und Part-Speicherverzeichnisse existieren:

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. Wenn die Verzeichnisse nicht existieren, überprüfen Sie die OpenCode-Konfiguration

### Auto Resume unerwartet ausgelöst

**Symptom**: Die KI setzt zur unpassenden Zeit automatisch fort

**Ursache**: `auto_resume` auf `true` gesetzt

**Lösung**:

1. Deaktivieren Sie auto_resume:

```json
{
  "auto_resume": false
}
```

2. Steuern Sie den Wiederherstellungszeitpunkt manuell

### Toast-Benachrichtigungen zu häufig

**Symptom**: Häufige Wiederherstellungsbenachrichtigungen beeinträchtigen die Nutzererfahrung

**Ursache**: `quiet_mode` nicht aktiviert

**Lösung**:

1. Aktivieren Sie quiet_mode:

```json
{
  "quiet_mode": true
}
```

2. Deaktivieren Sie bei Bedarf vorübergehend für das Debugging

## Zusammenfassung dieser Lektion

- Der Sitzungswiederherstellungsmechanismus behebt automatisch drei wiederherstellbare Fehlertypen: tool_result_missing, thinking_block_order, thinking_disabled_violation
- Synthetische tool_results sind der Schlüssel zur Reparatur des Sitzungszustands, der Injektionsinhalt ist "Operation cancelled by user (ESC pressed)"
- session_recovery ist standardmäßig aktiviert, auto_resume standardmäßig deaktiviert (manuelle Steuerung empfohlen)
- Die Denkblock-Wiederherstellung (thinking_block_order) stellt leere Denkblöcke vorab ein, damit die KI Denkinhalte neu generieren kann
- Das Denkblock-Entfernen (thinking_disabled_violation) führt zum Verlust des Denkinhalts. Bitte stellen Sie sicher, dass Sie die Denkfunktion in Denkmodellen verwenden

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Anforderungstransformationsmechanismus](../request-transformation/)** kennen.
>
> Sie werden lernen:
> - Unterschiede zwischen Claude- und Gemini-Anforderungsformaten
> - Tool Schema-Bereinigung und Transformationsregeln
> - Denkblock-Signatur-Injektionsmechanismus
> - Google Search Grounding-Konfigurationsmethode

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Position anzuzeigen</strong></summary>

> Letzte Aktualisierung: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Hauptlogik der Sitzungswiederherstellung | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | Vollständig |
| Fehlertypenerkennung | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110 |
| tool_result_missing-Wiederherstellung | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| thinking_block_order-Wiederherstellung | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| thinking_disabled_violation-Wiederherstellung | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| Speicherhilfsfunktionen | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | Vollständig |
| Nachrichtenlesen | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78 |
| Part-Lesen | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104 |
| Denkblock voreinstellen | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| Denkblöcke entfernen | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| Typdefinitionen | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | Vollständig |

**Wichtige Konstanten**:

| Konstantenname | Wert | Beschreibung |
| --- | --- | --- |
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Beim Auto Resume gesendeter Wiederherstellungstext |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | Denkblocktypsammlung |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | Metadatentypensammlung |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | Inhaltstypensammlung |

**Wichtige Funktionen**:

- `detectErrorType(error: unknown): RecoveryErrorType`: Erkennt Fehlertypen, gibt `"tool_result_missing"`, `"thinking_block_order"`, `"thinking_disabled_violation"` oder `null` zurück
- `isRecoverableError(error: unknown): boolean`: Bewertet, ob ein Fehler wiederherstellbar ist
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null`: Erstellt einen Sitzungswiederherstellungs-Hook
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>`: Stellt tool_result_missing-Fehler wieder her
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>`: Stellt thinking_block_order-Fehler wieder her
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>`: Stellt thinking_disabled_violation-Fehler wieder her
- `readMessages(sessionID): StoredMessageMeta[]`: Liest alle Nachrichten einer Sitzung
- `readParts(messageID): StoredPart[]`: Liest alle Parts einer Nachricht
- `prependThinkingPart(sessionID, messageID): boolean`: Stellt leere Denkblöcke am Nachrichtenanfang vorab ein
- `stripThinkingParts(messageID): boolean`: Entfernt alle Denkblöcke aus einer Nachricht

**Konfigurationsoptionen** (aus schema.ts):

| Konfigurationsoption | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `session_recovery` | boolean | `true` | Sitzungswiederherstellungsfunktion aktivieren |
| `auto_resume` | boolean | `false` | Automatisches Senden einer "continue"-Nachricht |
| `quiet_mode` | boolean | `false` | Toast-Benachrichtigungen ausblenden |

</details>
