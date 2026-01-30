---
title: "TDD-Entwicklungsworkflow: Red-Green-Refactor | everything-claude-code"
sidebarTitle: "Erst testen, dann coden"
subtitle: "TDD-Entwicklungsworkflow: Red-Green-Refactor"
description: "Lernen Sie den TDD-Entwicklungsworkflow von Everything Claude Code. Beherrschen Sie die Befehle /plan, /tdd, /code-review und /verify für eine Testabdeckung von über 80%."
tags:
  - "tdd"
  - "test-driven-development"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 70
---

# TDD-Entwicklungsworkflow: Der vollständige Red-Green-Refactor-Zyklus von /plan bis /verify

## Was Sie nach diesem Tutorial können

- Mit dem `/plan`-Befehl systematische Implementierungspläne erstellen und Lücken vermeiden
- Mit dem `/tdd`-Befehl testgetriebene Entwicklung durchführen und den RED-GREEN-REFACTOR-Zyklus befolgen
- Mit `/code-review` Code-Sicherheit und -Qualität sicherstellen
- Mit `/verify` prüfen, ob der Code sicher committet werden kann
- Eine Testabdeckung von über 80% erreichen und eine zuverlässige Test-Suite aufbauen

## Ihre aktuelle Situation

Kennen Sie diese Situationen bei der Entwicklung neuer Features?

- Sie haben den Code fertig geschrieben und stellen dann fest, dass Sie die Anforderungen falsch verstanden haben – Nacharbeit ist nötig
- Niedrige Testabdeckung führt zu Bugs nach dem Release
- Beim Code-Review werden Sicherheitsprobleme entdeckt und der Code wird zurückgewiesen
- Nach dem Commit stellen Sie Typfehler oder Build-Fehler fest
- Sie wissen nicht, wann Sie Tests schreiben sollen, und die Tests sind unvollständig

All diese Probleme führen zu ineffizienter Entwicklung und schwer garantierbarer Code-Qualität.

## Wann Sie diese Methode anwenden sollten

Szenarien für den TDD-Entwicklungsworkflow:

- **Neue Features entwickeln**: Von den Anforderungen bis zur Implementierung – vollständige Funktionalität mit ausreichenden Tests
- **Bugs beheben**: Erst einen Test schreiben, der den Bug reproduziert, dann beheben – so werden keine neuen Probleme eingeführt
- **Code refactoren**: Mit Testschutz können Sie die Code-Struktur bedenkenlos optimieren
- **API-Endpunkte implementieren**: Integrationstests schreiben und die Korrektheit der Schnittstellen verifizieren
- **Kerngeschäftslogik entwickeln**: Finanzberechnungen, Authentifizierung und andere kritische Code-Bereiche erfordern 100% Testabdeckung

::: tip Kernprinzip
Testgetriebene Entwicklung ist nicht einfach nur „erst Tests schreiben". Es ist eine systematische Methode, die Code-Qualität sicherstellt und die Entwicklungseffizienz steigert. Jeder neue Code sollte durch den TDD-Workflow implementiert werden.
:::

## Kernkonzept

Der TDD-Entwicklungsworkflow besteht aus 4 Kernbefehlen, die einen vollständigen Entwicklungszyklus bilden:

```
1. /plan     → Planen: Anforderungen klären, Risiken identifizieren, phasenweise umsetzen
2. /tdd      → Implementieren: Tests zuerst, minimaler Code, kontinuierliches Refactoring
3. /code-review → Prüfen: Sicherheitschecks, Qualitätsbewertung, Best Practices
4. /verify   → Verifizieren: Build, Typen, Tests, Code-Audit
```

**Warum dieser Workflow funktioniert**:

- **Planung zuerst**: `/plan` stellt sicher, dass Sie die Anforderungen richtig verstehen und vermeidet falsche Richtungen
- **Testgetrieben**: `/tdd` erzwingt Tests zuerst und garantiert, dass jede Funktion durch Tests geschützt ist
- **Review als Qualitätskontrolle**: `/code-review` findet Sicherheitslücken und Code-Qualitätsprobleme
- **Verifikation zum Abschluss**: `/verify` stellt sicher, dass der Code sicher committet werden kann

## 🎒 Vorbereitung

Bevor Sie mit dem TDD-Entwicklungsworkflow beginnen, stellen Sie sicher:

- ✅ Everything Claude Code Plugin ist installiert
- ✅ Das Projekt hat ein Test-Framework konfiguriert (Jest, Vitest etc.)
- ✅ Das Projekt hat einen grundlegenden Build-Prozess (`npm run build`)
- ✅ Sie kennen die grundlegenden Befehle aus dem [Schnellstart](../../start/quickstart/)

::: warning Voraussetzungen
Dieses Tutorial setzt voraus, dass Sie mit den grundlegenden Operationen aus dem [Schnellstart](../../start/quickstart/) vertraut sind. Falls Sie die Installation noch nicht abgeschlossen haben, lesen Sie bitte zuerst die [Installationsanleitung](../../start/installation/).
:::

## Schritt für Schritt: Der vollständige TDD-Entwicklungsworkflow

Lernen wir den gesamten Workflow anhand eines praktischen Beispiels. Angenommen, Sie möchten einen „Marktliquiditäts-Score-Rechner" implementieren.

### Schritt 1: Mit /plan einen Implementierungsplan erstellen

**Warum**
Die Planungsphase stellt sicher, dass Sie die Anforderungen verstanden haben, potenzielle Risiken identifiziert haben und spätere Nacharbeit vermeiden.

**Aktion**
Geben Sie in Claude Code ein:

```
/plan Ich muss einen Marktliquiditäts-Score-Rechner implementieren, der basierend auf Handelsvolumen, Geld-Brief-Spanne, Anzahl aktiver Händler und letzter Handelszeit einen Score (0-100) berechnet
```

**Was Sie sehen sollten**
Der Planner-Agent generiert einen detaillierten Implementierungsplan:

```markdown
## Implementation Plan: Marktliquiditäts-Score-Rechner

## Requirements Restatement
- Berechnung eines Marktliquiditäts-Scores (0-100) basierend auf mehreren Indikatoren
- Höherer Score bedeutet bessere Marktliquidität
- Berücksichtigung von Handelsvolumen, Geld-Brief-Spanne, aktiven Händlern, letzter Handelszeit

## Implementation Phases

### Phase 1: Define Interface
- `MarketData`-Interface für Eingabedaten erstellen
- `calculateLiquidityScore`-Funktionssignatur definieren

### Phase 2: Write Tests
- Unit-Tests für verschiedene Szenarien schreiben
- Randbedingungen: Null-Volumen, Extremwerte
- Fehlerbehandlung: Fehlende Felder, ungültige Typen

### Phase 3: Implement Calculation
- Score-Algorithmus implementieren
- Gewichtete Berechnung der einzelnen Indikatoren
- Normalisierung auf den Bereich 0-100

### Phase 4: Integration
- Integration in bestehende API
- Endpunkt für die Berechnungsfunktion hinzufügen
- Verwendung dokumentieren

## Dependencies
- Keine externen Abhängigkeiten

## Risks
- MEDIUM: Score-Algorithmus erfordert möglicherweise Gewichtsanpassungen
- LOW: Behandlung von Randbedingungen

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

**Checkpoint ✅**
- Bestätigen Sie, dass die Anforderungen richtig verstanden wurden
- Bestätigen Sie, dass die Implementierungsschritte sinnvoll sind
- Prüfen Sie, ob Risiken übersehen wurden

**Nächster Schritt**
Wenn der Plan in Ordnung ist, antworten Sie mit `yes` oder `proceed`. Bei Änderungsbedarf beschreiben Sie die konkreten Anpassungen.

---

### Schritt 2: Mit /tdd testgetriebene Entwicklung durchführen

**Warum**
Der `/tdd`-Befehl erzwingt Tests zuerst und stellt sicher, dass jede Funktion durch Tests geschützt ist – so vermeiden Sie das mühsame Nachtesten.

**Aktion**
Nach Bestätigung des Plans geben Sie ein:

```
/tdd Implementiere den Marktliquiditäts-Score-Rechner gemäß Plan
```

**Was Sie sehen sollten**
Der TDD-Guide-Agent führt Sie durch den TDD-Prozess:

#### RED-Phase: Erst Tests schreiben

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: Implementierung
  throw new Error('Not implemented')
}
```

```typescript
// lib/liquidity.test.ts
import { calculateLiquidityScore } from './liquidity'

describe('calculateLiquidityScore', () => {
  it('should return high score for liquid market', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('should return low score for illiquid market', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // 1 Tag her
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('should handle edge case: zero volume', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBe(0)
  })
})
```

```bash
npm test lib/liquidity.test.ts

## Sie sollten sehen, dass die Tests fehlschlagen
FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market
    Error: Not implemented
```

✅ **Test fehlgeschlagen, wie erwartet**

#### GREEN-Phase: Minimalen Code implementieren

```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Behandlung des Randfalls Null-Volumen
  if (market.totalVolume === 0) {
    return 0
  }

  // Berechnung der Komponenten-Scores (Skala 0-100)
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // Bonus für aktuelle Aktivität
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // Gewichteter Durchschnitt
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // Auf 0-100 begrenzen
}
```

```bash
npm test lib/liquidity.test.ts

## Sie sollten sehen, dass die Tests bestehen
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **Alle Tests bestanden**

#### REFACTOR-Phase: Code verbessern

```typescript
// lib/liquidity.ts - Nach Refactoring
const WEIGHTS = {
  VOLUME: 0.4,
  SPREAD: 0.3,
  TRADERS: 0.2,
  RECENCY: 0.1,
} as const

const SCALE_FACTORS = {
  VOLUME: 1000,
  SPREAD: 1000,
  TRADERS: 10,
  RECENCY_PENALTY: 10,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) return 0

  const volumeScore = Math.min(market.totalVolume / SCALE_FACTORS.VOLUME, 100)
  const spreadScore = clamp(100 - (market.bidAskSpread * SCALE_FACTORS.SPREAD), 0, 100)
  const traderScore = Math.min(market.activeTraders / SCALE_FACTORS.TRADERS, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = clamp(100 - (hoursSinceLastTrade * SCALE_FACTORS.RECENCY_PENALTY), 0, 100)

  const weightedScore =
    volumeScore * WEIGHTS.VOLUME +
    spreadScore * WEIGHTS.SPREAD +
    traderScore * WEIGHTS.TRADERS +
    recencyScore * WEIGHTS.RECENCY

  return clamp(weightedScore, 0, 100)
}
```

```bash
npm test lib/liquidity.test.ts

## Sie sollten sehen, dass die Tests weiterhin bestehen
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **Refactoring abgeschlossen, Tests bestehen weiterhin**

#### Abdeckung prüfen

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Ziel: 80%)
```

✅ **TDD-Workflow abgeschlossen, Abdeckung erreicht**

**Checkpoint ✅**
- Tests wurden vor dem Code geschrieben (RED)
- Nach Testfehlschlag wurde implementiert (GREEN)
- Nach bestandenen Tests wurde refactored (REFACTOR)
- Abdeckung liegt über 80%

---

### Schritt 3: Mit /code-review den Code prüfen

**Warum**
Code-Review kann Sicherheitsprobleme, Code-Qualität und Best-Practice-Verstöße aufdecken und sicherstellen, dass der Code sicher gemergt werden kann.

**Aktion**
Geben Sie ein:

```
/code-review
```

**Was Sie sehen sollten**
Der Code-Reviewer-Agent prüft:

```markdown
## Code Review Report

## Security Issues (CRITICAL)
- ✅ No hardcoded credentials found
- ✅ No SQL injection vulnerabilities
- ✅ No XSS vulnerabilities

## Code Quality (HIGH)
- ✅ Functions under 50 lines (current: 8 lines max)
- ✅ Files under 800 lines (current: 25 lines)
- ✅ No missing error handling
- ⚠️ Found 1 console.log statement at lib/liquidity.ts:15
  - **Suggestion**: Remove or replace with proper logging

## Best Practices (MEDIUM)
- ✅ Using immutable patterns
- ✅ No TODO/FIXME comments
- ✅ All new code has tests
- ✅ JSDoc for public API present

## Summary
- Critical: 0 issues
- High: 1 issue (console.log)
- Medium: 0 issues

**Recommendation**: Fix console.log issue, then ready for commit.
```

**Nächster Schritt**
Beheben Sie die Probleme basierend auf dem Review-Ergebnis:

```typescript
// console.log entfernen
// console.log(`Calculated score: ${score}`)  // Gelöscht
return clamp(weightedScore, 0, 100)
```

**Checkpoint ✅**
- Alle CRITICAL-Probleme behoben
- HIGH-Probleme behoben oder begründet
- Code-Qualität entspricht den Standards

---

### Schritt 4: Mit /verify den Code verifizieren

**Warum**
Der Verify-Befehl stellt sicher, dass der Code sicher committet werden kann – Build, Typen und Tests bestehen, keine offenen Probleme.

**Aktion**
Geben Sie ein:

```
/verify
```

**Was Sie sehen sollten**
Einen vollständigen Verifikationsbericht:

```markdown
VERIFICATION: PASS

Build:    OK
Types:    OK (0 errors)
Lint:     OK (0 issues)
Tests:    3/3 passed, 100% coverage
Secrets:  OK (0 found)
Logs:      OK (0 console.logs)

Ready for PR: YES ✅
```

Bei Problemen werden diese detailliert aufgelistet:

```markdown
VERIFICATION: FAIL

Build:    OK
Types:    ❌ 2 errors
  - lib/liquidity.ts:15:25 - Type 'string' is not assignable to type 'number'
  - lib/utils.ts:8:10 - Property 'toFixed' does not exist on type 'unknown'
Lint:     ⚠️ 2 warnings
  - lib/liquidity.ts:10:1 - Missing JSDoc for WEIGHTS constant
Tests:    ✅ 3/3 passed, 100% coverage
Secrets:  OK
Logs:      OK

Ready for PR: NO ❌

Fix these issues before committing.
```

**Checkpoint ✅**
- Build bestanden
- Typprüfung bestanden
- Lint bestanden (oder nur Warnungen)
- Alle Tests bestanden
- Abdeckung bei 80%+
- Keine console.log
- Keine hartcodierten Secrets

---

### Schritt 5: Code committen

**Warum**
Nach bestandener Verifikation ist der Code bereit zum Commit und kann bedenkenlos ins Remote-Repository gepusht werden.

**Aktion**
```bash
git add lib/liquidity.ts lib/liquidity.test.ts
git commit -m "feat: add market liquidity score calculator

- Calculate 0-100 score based on volume, spread, traders, recency
- 100% test coverage with unit tests
- Edge cases handled (zero volume, illiquid markets)
- Refactored with constants and helper functions

Closes #123"
```

```bash
git push origin feature/liquidity-score
```

## Häufige Fallstricke

### Fallstrick 1: RED-Phase überspringen und direkt Code schreiben

**Falscher Ansatz**:
```
Erst calculateLiquidityScore-Funktion implementieren
Dann Tests schreiben
```

**Konsequenzen**:
- Tests „verifizieren nur die bestehende Implementierung", prüfen nicht wirklich das Verhalten
- Randfälle und Fehlerbehandlung werden leicht übersehen
- Beim Refactoring fehlt die Sicherheit

**Richtiger Ansatz**:
```
1. Erst Tests schreiben (sollten fehlschlagen)
2. Tests ausführen und Fehlschlag bestätigen (RED)
3. Code implementieren, damit Tests bestehen (GREEN)
4. Refactoren und Tests weiterhin bestehen lassen (REFACTOR)
```

---

### Fallstrick 2: Testabdeckung nicht erreicht

**Falscher Ansatz**:
```
Nur einen Test schreiben, Abdeckung nur 40%
```

**Konsequenzen**:
- Große Teile des Codes ohne Testschutz
- Beim Refactoring werden leicht Bugs eingeführt
- Code-Review führt zu Rückweisungen

**Richtiger Ansatz**:
```
Mindestens 80%+ Abdeckung sicherstellen:
- Unit-Tests: Alle Funktionen und Branches abdecken
- Integrationstests: API-Endpunkte abdecken
- E2E-Tests: Kritische User-Flows abdecken
```

---

### Fallstrick 3: Code-Review-Empfehlungen ignorieren

**Falscher Ansatz**:
```
CRITICAL-Probleme sehen und trotzdem committen
```

**Konsequenzen**:
- Sicherheitslücken gelangen in die Produktion
- Niedrige Code-Qualität, schwer wartbar
- PR-Reviewer weisen zurück

**Richtiger Ansatz**:
```
- CRITICAL-Probleme müssen behoben werden
- HIGH-Probleme möglichst beheben oder begründen
- MEDIUM/LOW-Probleme können später optimiert werden
```

---

### Fallstrick 4: Ohne /verify direkt committen

**Falscher Ansatz**:
```
Code fertig, direkt git commit, Verifikation überspringen
```

**Konsequenzen**:
- Build schlägt fehl, CI-Ressourcen verschwendet
- Typfehler führen zu Laufzeitfehlern
- Tests schlagen fehl, Main-Branch in schlechtem Zustand

**Richtiger Ansatz**:
```
Vor dem Commit immer /verify ausführen:
/verify
# Erst bei "Ready for PR: YES" committen
```

---

### Fallstrick 5: Implementierungsdetails statt Verhalten testen

**Falscher Ansatz**:
```typescript
// Internen Zustand testen
expect(component.state.count).toBe(5)
```

**Konsequenzen**:
- Fragile Tests, viele Fehlschläge beim Refactoring
- Tests spiegeln nicht wider, was der Benutzer tatsächlich sieht

**Richtiger Ansatz**:
```typescript
// Sichtbares Verhalten testen
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

## Zusammenfassung

Die Kernpunkte des TDD-Entwicklungsworkflows:

1. **Planung zuerst**: Mit `/plan` sicherstellen, dass Anforderungen richtig verstanden werden und falsche Richtungen vermieden werden
2. **Testgetrieben**: Mit `/tdd` Tests zuerst erzwingen und RED-GREEN-REFACTOR befolgen
3. **Code-Review**: Mit `/code-review` Sicherheits- und Qualitätsprobleme finden
4. **Vollständige Verifikation**: Mit `/verify` sicherstellen, dass der Code sicher committet werden kann
5. **Abdeckungsanforderung**: Mindestens 80% Testabdeckung, kritischer Code 100%

Diese vier Befehle bilden einen vollständigen Entwicklungszyklus, der Code-Qualität und Entwicklungseffizienz sicherstellt.

::: tip Merken Sie sich diesen Workflow
```
Anforderung → /plan → /tdd → /code-review → /verify → Commit
```

Jedes neue Feature sollte diesem Workflow folgen.
:::

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir den **[Code-Review-Workflow: /code-review und Sicherheitsaudit](../code-review-workflow/)**.
>
> Sie werden lernen:
> - Die Prüflogik des Code-Reviewer-Agents im Detail verstehen
> - Die Checkliste für Sicherheitsaudits beherrschen
> - Häufige Sicherheitslücken beheben
> - Benutzerdefinierte Review-Regeln konfigurieren

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| /plan-Befehl | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| /tdd-Befehl | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| /verify-Befehl | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**Schlüsselfunktionen**:
- `plan` ruft den Planner-Agent auf und erstellt einen Implementierungsplan
- `tdd` ruft den TDD-Guide-Agent auf und führt den RED-GREEN-REFACTOR-Workflow aus
- `verify` führt eine vollständige Verifikation durch (Build, Typen, Lint, Tests)
- `code-review` prüft auf Sicherheitslücken, Code-Qualität und Best Practices

**Abdeckungsanforderungen**:
- Mindestens 80% Code-Abdeckung (Branches, Functions, Lines, Statements)
- Finanzberechnungen, Authentifizierungslogik und sicherheitskritischer Code erfordern 100% Abdeckung

</details>
