---
title: "Automatisches Pruning: Drei Strategien | opencode-dcp"
sidebarTitle: "Token sparen mit Strategien"
subtitle: "Automatisches Pruning: Drei Strategien | opencode-dcp"
description: "Lernen Sie die drei automatischen Pruning-Strategien von DCP: Deduplizierung, Überschreiben und Fehlerbereinigung. Detaillierte Erklärung der Funktionsweise, Anwendungsfälle und Konfiguration – für geringere Token-Kosten und bessere Dialogqualität. Alle Strategien ohne LLM-Kosten."
tags:
  - "Automatisches Pruning"
  - "Strategien"
  - "Deduplizierung"
  - "Überschreiben"
  - "Fehlerbereinigung"
prerequisite:
  - "start-getting-started"
  - "start-configuration"
order: 1
---

# Automatische Pruning-Strategien im Detail

## Was Sie nach diesem Tutorial können

- Die Funktionsweise der drei automatischen Pruning-Strategien verstehen
- Wissen, wann Sie welche Strategie aktivieren oder deaktivieren sollten
- Strategien durch Konfiguration optimieren

## Ihr aktuelles Problem

Mit zunehmender Konversationslänge häufen sich Tool-Aufrufe im Kontext:
- Die KI liest wiederholt dieselbe Datei und fügt jedes Mal den vollständigen Inhalt in den Kontext ein
- Nach dem Schreiben einer Datei wird sie erneut gelesen, während der ursprüngliche Schreibinhalt noch im Kontext „verstaubt"
- Nach fehlgeschlagenen Tool-Aufrufen belegen die umfangreichen Eingabeparameter weiterhin Platz

Diese Probleme lassen Ihre Token-Rechnung immer weiter ansteigen und können den Kontext „verschmutzen", was die Entscheidungsfähigkeit der KI beeinträchtigt.

## Kernkonzept

DCP bietet drei **automatische Pruning-Strategien**, die vor jeder Anfrage stillschweigend ausgeführt werden – **ohne LLM-Kosten**:

| Strategie | Standardstatus | Funktion |
| --- | --- | --- |
| Deduplizierung | ✅ Aktiviert | Erkennt doppelte Tool-Aufrufe, behält nur den neuesten |
| Überschreiben | ❌ Deaktiviert | Bereinigt Schreiboperationen, die durch Lesevorgänge überschrieben wurden |
| Fehlerbereinigung | ✅ Aktiviert | Bereinigt fehlerhafte Tool-Eingaben nach N Runden |

Alle Strategien folgen diesen Regeln:
- **Geschützte Tools überspringen**: Kritische Tools wie task, write, edit werden nicht beschnitten
- **Geschützte Dateien überspringen**: Durch konfigurierte Glob-Muster geschützte Dateipfade
- **Fehlermeldungen beibehalten**: Die Fehlerbereinigungsstrategie entfernt nur Eingabeparameter, Fehlermeldungen bleiben erhalten

---

## Deduplizierungsstrategie

### Funktionsweise

Die Deduplizierungsstrategie erkennt wiederholte Aufrufe mit **identischem Tool-Namen und Parametern** und behält nur den neuesten.

::: info Signatur-Matching-Mechanismus

DCP erkennt Duplikate anhand einer „Signatur":
- Identischer Tool-Name
- Identische Parameterwerte (null/undefined werden ignoriert, Schlüsselreihenfolge spielt keine Rolle)

Beispiel:
```json
// 1. Aufruf
{ "tool": "read", "path": "src/config.ts" }

// 2. Aufruf (identische Signatur)
{ "tool": "read", "path": "src/config.ts" }

// 3. Aufruf (unterschiedliche Signatur)
{ "tool": "read", "path": "src/utils.ts" }
```
:::

### Anwendungsfälle

**Empfohlen zu aktivieren** (standardmäßig aktiv):
- KI liest häufig dieselbe Datei für Code-Analyse
- Wiederholte Abfragen derselben Konfiguration in mehrstufigen Dialogen
- Szenarien, in denen der aktuelle Zustand wichtig ist und historische Ausgaben verworfen werden können

**Möglicherweise deaktivieren**:
- Wenn Sie den Kontext jedes Tool-Aufrufs beibehalten müssen (z.B. beim Debuggen von Tool-Ausgaben)

### Konfiguration

```json
// ~/.config/opencode/dcp.jsonc
{
  "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/main/dcp.schema.json",
  "strategies": {
    "deduplication": {
      "enabled": true  // true aktiviert, false deaktiviert
    }
  }
}
```

**Geschützte Tools** (standardmäßig nicht beschnitten):
- task, write, edit, batch, plan_enter, plan_exit
- todowrite, todoread (Aufgabenlisten-Tools)
- discard, extract (DCP-eigene Tools)

Diese Tools können selbst in der Konfiguration nicht durch Deduplizierung beschnitten werden (hardcodierter Schutz).

---

## Überschreibungsstrategie

### Funktionsweise

Die Überschreibungsstrategie bereinigt **Schreiboperations-Eingaben, die durch nachfolgende Lesevorgänge überschrieben wurden**.

::: details Beispiel: Schreiben gefolgt von Lesen

```text
Schritt 1: Datei schreiben
KI ruft write("config.json", {...}) auf
↓
Schritt 2: Datei zur Bestätigung lesen
KI ruft read("config.json") auf → gibt aktuellen Inhalt zurück
↓
Überschreibungsstrategie erkennt
Die Eingabe von write (möglicherweise groß) wird redundant
da read bereits den aktuellen Dateizustand erfasst hat
↓
Pruning
Nur die Ausgabe von read wird behalten, die Eingabe von write wird entfernt
```

:::

### Anwendungsfälle

**Empfohlen zu aktivieren**:
- Häufige „Schreiben→Verifizieren→Ändern"-Iterationen in der Entwicklung
- Schreiboperationen mit umfangreichen Templates oder vollständigen Dateiinhalten

**Warum standardmäßig deaktiviert**:
- Einige Workflows benötigen „historische Schreibprotokolle" als Kontext
- Kann bestimmte versionskontrollbezogene Tool-Aufrufe beeinflussen

**Wann manuell aktivieren**:
```json
{
  "strategies": {
    "supersedeWrites": {
      "enabled": true
    }
  }
}
```

### Hinweise

Diese Strategie **beschneidet nur die Eingabe des write-Tools**, nicht die Ausgabe. Der Grund:
- Die Ausgabe von write ist normalerweise eine Bestätigungsmeldung (sehr klein)
- Die Eingabe von write kann vollständige Dateiinhalte enthalten (sehr groß)

---

## Fehlerbereinigungsstrategie

### Funktionsweise

Die Fehlerbereinigungsstrategie wartet nach einem fehlgeschlagenen Tool-Aufruf N Runden und entfernt dann die **Eingabeparameter** (Fehlermeldungen bleiben erhalten).

::: info Was ist eine Runde (Turn)?
In einer OpenCode-Konversation:
- Benutzer sendet Nachricht → KI antwortet = 1 Runde
- Tool-Aufrufe zählen nicht als separate Runden

Der Standardschwellenwert beträgt 4 Runden, d.h. die Eingabe eines fehlerhaften Tools wird nach 4 Runden automatisch bereinigt.
:::

### Anwendungsfälle

**Empfohlen zu aktivieren** (standardmäßig aktiv):
- Tool-Aufruf fehlgeschlagen und Eingabe ist groß (z.B. Lesen einer sehr großen Datei fehlgeschlagen)
- Fehlermeldung muss erhalten bleiben, aber Eingabeparameter sind nicht mehr wertvoll

**Möglicherweise deaktivieren**:
- Wenn Sie die vollständige Eingabe fehlgeschlagener Tools zum Debuggen benötigen
- Bei häufigen „intermittierenden" Fehlern, wenn Sie den Verlauf behalten möchten

### Konfiguration

```json
{
  "strategies": {
    "purgeErrors": {
      "enabled": true,   // Aktivierungsschalter
      "turns": 4        // Bereinigungsschwellenwert (Anzahl der Runden)
    }
  }
}
```

**Geschützte Tools** (standardmäßig nicht beschnitten):
- Dieselbe Liste geschützter Tools wie bei der Deduplizierungsstrategie

---

## Ausführungsreihenfolge der Strategien

Die drei Strategien werden in **fester Reihenfolge** ausgeführt:

```mermaid
graph LR
    A["Nachrichtenliste"] --> B["Tool-Cache synchronisieren"]
    B --> C["Deduplizierungsstrategie"]
    C --> D["Überschreibungsstrategie"]
    D --> E["Fehlerbereinigungsstrategie"]
    E --> F["Pruning-Inhalt ersetzen"]
```

Das bedeutet:
1. Zuerst Deduplizierung (Redundanz reduzieren)
2. Dann Überschreibung (ungültige Schreibvorgänge bereinigen)
3. Zuletzt Fehlerbereinigung (veraltete Fehlereingaben bereinigen)

Jede Strategie basiert auf dem Ergebnis der vorherigen und beschneidet dasselbe Tool nicht mehrfach.

---

## Häufige Fallstricke

### ❌ Irrtum 1: Annahme, dass alle Tools automatisch beschnitten werden

**Problem**: Warum werden task, write und andere Tools nicht beschnitten?

**Ursache**: Diese Tools stehen auf der **Liste geschützter Tools** und sind hardcodiert geschützt.

**Lösung**:
- Wenn Sie write wirklich beschneiden müssen, erwägen Sie die Aktivierung der Überschreibungsstrategie
- Wenn Sie task beschneiden müssen, können Sie dies indirekt über die Konfiguration geschützter Dateipfade steuern

### ❌ Irrtum 2: Überschreibungsstrategie führt zu unvollständigem Kontext

**Problem**: Nach Aktivierung der Überschreibung findet die KI frühere Schreibinhalte nicht mehr.

**Ursache**: Die Strategie bereinigt nur Schreiboperationen, die „durch Lesen überschrieben wurden". Wenn nach dem Schreiben nie gelesen wurde, wird nichts beschnitten.

**Lösung**:
- Prüfen Sie, ob die Datei wirklich gelesen wurde (`/dcp context` zeigt dies an)
- Wenn Sie Schreibprotokolle wirklich behalten müssen, deaktivieren Sie diese Strategie

### ❌ Irrtum 3: Fehlerbereinigungsstrategie bereinigt zu schnell

**Problem**: Fehlereingabe wurde gerade beschnitten, und die KI stößt sofort wieder auf denselben Fehler.

**Ursache**: Der `turns`-Schwellenwert ist zu niedrig eingestellt.

**Lösung**:
```json
{
  "strategies": {
    "purgeErrors": {
      "turns": 8  // Von Standard 4 auf 8 erhöhen
    }
  }
}
```

---

## Wann welche Strategie verwenden

| Szenario | Empfohlene Strategiekombination |
| --- | --- |
| Tägliche Entwicklung (mehr Lesen als Schreiben) | Deduplizierung + Fehlerbereinigung (Standardkonfiguration) |
| Häufiges Schreiben und Verifizieren | Alle aktivieren (Überschreibung manuell einschalten) |
| Debugging von Tool-Fehlern | Nur Deduplizierung (Fehlerbereinigung deaktivieren) |
| Vollständiger Kontextverlauf erforderlich | Alle deaktivieren |

---

## Zusammenfassung

- **Deduplizierungsstrategie**: Erkennt doppelte Tool-Aufrufe, behält den neuesten (standardmäßig aktiviert)
- **Überschreibungsstrategie**: Bereinigt Schreiboperations-Eingaben, die durch Lesen überschrieben wurden (standardmäßig deaktiviert)
- **Fehlerbereinigungsstrategie**: Bereinigt fehlerhafte Tool-Eingaben nach N Runden (standardmäßig aktiviert, Schwellenwert 4)
- Alle Strategien überspringen geschützte Tools und geschützte Dateipfade
- Strategien werden in fester Reihenfolge ausgeführt: Deduplizierung → Überschreibung → Fehlerbereinigung

---

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen Sie die **[LLM-gesteuerten Pruning-Tools](../llm-tools/)**.
>
> Sie werden lernen:
> - Wie die KI eigenständig discard- und extract-Tools aufruft
> - Implementierung der semantischen Kontextoptimierung
> - Best Practices für die Extraktion wichtiger Erkenntnisse

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Deduplizierungsstrategie-Implementierung | [`lib/strategies/deduplication.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/deduplication.ts) | 13-83 |
| Überschreibungsstrategie-Implementierung | [`lib/strategies/supersede-writes.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/supersede-writes.ts) | 16-105 |
| Fehlerbereinigungsstrategie-Implementierung | [`lib/strategies/purge-errors.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/purge-errors.ts) | 16-80 |
| Strategie-Einstiegspunkt-Export | [`lib/strategies/index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/index.ts) | 1-5 |
| Standardkonfiguration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 423-464 |
| Liste geschützter Tools | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 68-79 |

**Wichtige Funktionen**:
- `deduplicate()` - Hauptfunktion der Deduplizierungsstrategie
- `supersedeWrites()` - Hauptfunktion der Überschreibungsstrategie
- `purgeErrors()` - Hauptfunktion der Fehlerbereinigungsstrategie
- `createToolSignature()` - Erstellt Tool-Signatur für Duplikaterkennung
- `normalizeParameters()` - Parameter-Normalisierung (entfernt null/undefined)
- `sortObjectKeys()` - Parameter-Schlüssel-Sortierung (gewährleistet Signaturkonsistenz)

**Standardkonfigurationswerte**:
- `strategies.deduplication.enabled = true`
- `strategies.supersedeWrites.enabled = false`
- `strategies.purgeErrors.enabled = true`
- `strategies.purgeErrors.turns = 4`

**Geschützte Tools (standardmäßig nicht beschnitten)**:
- task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit

</details>
