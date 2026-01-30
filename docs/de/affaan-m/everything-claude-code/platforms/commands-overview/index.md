---
title: "Befehle: 15 Slash-Befehle | Everything Claude Code"
sidebarTitle: "Mit 15 Befehlen Entwicklung meistern"
subtitle: "Befehle: 15 Slash-Befehle | Everything Claude Code"
description: "Lernen Sie die 15 Slash-Befehle von Everything Claude Code kennen. Meistern Sie die Verwendung der Kernbefehle /plan, /tdd, /code-review, /e2e, /verify und steigern Sie Ihre Entwicklungseffizienz."
tags:
  - "befehle"
  - "slash-befehle"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# Kernelemente der Befehle: Ein vollständiger Leitfaden für 15 Slash-Befehle

## Was Sie nach diesem Kurs können werden

- Schnellen TDD-Entwicklungsprozess starten und qualitativ hochwertigen Code implementieren
- Systematische Implementierungspläne erstellen, um kritische Schritte nicht zu übersehen
- Umfassende Code-Reviews und Sicherheitsaudits durchführen
- End-to-End-Tests generieren und kritische Benutzerabläufe verifizieren
- Build-Fehler automatisch beheben und Debugging-Zeit sparen
- Toten Code sicher bereinigen und die Codebasis schlank halten
- Muster extrahieren und wiederverwenden, um bereits gelöste Probleme zu lösen
- Arbeitsstatus und Checkpoints verwalten
- Umfassende Validierung durchführen, um sicherzustellen, dass der Code bereit ist

## Ihre aktuelle Herausforderung

Während der Entwicklung könnten Sie auf diese Probleme stoßen:

- **Wissen nicht, wo anfangen** — Angesichts neuer Anforderungen, wie soll man die Implementierungsschritte aufschlüsseln?
- **Niedrige Testabdeckung** — Viel Code geschrieben, aber nicht genug Tests, Qualität schwer zu gewährleisten
- **Build-Fehler häufen sich** — Nach Code-Änderungen tauchen Typfehler nacheinander auf, nicht klar, wo repariert werden muss
- **Code-Review nicht systematisch** — Visuelle Prüfung lässt leicht Sicherheitsprobleme übersehen
- **Gleiche Probleme wiederholt lösen** — Bekannte Fallen, in die man immer wieder hineinfällt

Die 15 Slash-Befehle von Everything Claude Code wurden entwickelt, um diese Schmerzpunkte zu lösen.

## Grundkonzept

**Befehle sind Einstiegspunkte in den Workflow**. Jeder Befehl kapselt einen kompletten Entwicklungsprozess ab, ruft den entsprechenden Agent oder Skill auf und hilft Ihnen bei der Erledigung bestimmter Aufgaben.

::: tip Befehl vs Agent vs Skill

- **Befehl**: Direkt eingegebener Shortcut in Claude Code (z.B. `/tdd`, `/plan`)
- **Agent**: Vom Befehl aufgerufener spezialisierter Sub-Agent, verantwortlich für die konkrete Ausführung
- **Skill**: Workflow-Definitionen und Domänenwissen, auf die Agents zugreifen können

Ein Befehl ruft normalerweise einen oder mehrere Agents auf, und Agents können relevante Skills referenzieren.

:::

## Befehlsübersicht

15 Befehle nach Funktion kategorisiert:

| Kategorie | Befehl | Verwendung |
|---|---|---|
| **Entwicklungsprozess** | `/plan` | Implementierungsplan erstellen |
| | `/tdd` | Test-Driven Development durchführen |
| | `/orchestrate` | Mehrere Agents sequentiell ausführen |
| **Code-Qualität** | `/code-review` | Code-Review |
| | `/build-fix` | Build-Fehler beheben |
| | `/refactor-clean` | Toten Code bereinigen |
| | `/verify` | Umfassende Validierung |
| **Tests** | `/e2e` | End-to-End-Tests |
| | `/test-coverage` | Testabdeckung analysieren |
| | `/eval` | Eval-Driven Development verwalten |
| **Dokumentation & Architektur** | `/update-docs` | Dokumentation synchronisieren |
| | `/update-codemaps` | Architekturdokumentation aktualisieren |
| **Statusverwaltung** | `/checkpoint` | Arbeitsstatus speichern |
| **Lernen & Optimierung** | `/learn` | Wiederverwendbare Muster extrahieren |
| **Konfiguration** | `/setup-pm` | Paketmanager konfigurieren |

## Entwicklungsprozess-Befehle

### /plan: Komplexe Funktionen planen

**Verwendung**: Erstellen Sie vor dem Codieren einen detaillierten Implementierungsplan.

**Anwendungsszenarien**:
- Neue Funktionsentwicklung starten
- Wichtige Architekturänderungen vornehmen
- Anforderungen unklar oder vage
- Multi-Datei/Multi-Komponenten-Änderungen

**Arbeitsablauf**:

```
1. Anforderungen wiederholen
   ↓
2. Risiken und Abhängigkeiten identifizieren
   ↓
3. In konkrete Phasen aufschlüsseln
   ↓
4. Warten auf Ihre Bestätigung
```

::: warning Wichtige Eigenschaft

Der Planer-Agent **schreibt keinen Code**, bis Sie den Plan ausdrücklich bestätigt haben.

:::

**Beispiel**:

```
Sie: /plan Ich muss eine Echtzeit-Benachrichtigungsfunktion hinzufügen

Claude:
# Implementierungsplan: Echtzeit-Benachrichtigungen bei Marktabschluss

## Anforderungswiederholung
- Benachrichtigungen senden, wenn Märkte abgeschlossen werden
- Mehrere Kanäle unterstützen (In-App, E-Mail, Webhook)
- Zuverlässige Zustellung gewährleisten
- Marktergebnis und Position des Benutzers einschließen

## Implementierungsphasen
### Phase 1: Datenbankschema
- Benachrichtigungstabelle hinzufügen
- Benutzerbenachrichtigungseinstellungen-Tabelle hinzufügen
- Indizes erstellen

### Phase 2: Benachrichtigungsdienst
- Benachrichtigungswarteschlange mit BullMQ/Redis erstellen
- Retry-Logik implementieren
- Benachrichtigungsvorlagen erstellen

...

WARTET AUF BESTÄTIGUNG: Mit diesem Plan fortfahren? (ja/nein/ändern)
```

**Best Practices**:
- ✅ Komplexe Funktionen zuerst planen, dann implementieren
- ✅ Risiken und Abhängigkeiten sorgfältig prüfen
- ✅ Phase für Phase ausführen, jede Phase validieren
- ❌ Planung nicht einfach überspringen

---

### /tdd: Test-Driven Development

**Verwendung**: Erzwingt den TDD-Prozess, um eine Testabdeckung ≥ 80% sicherzustellen.

**Anwendungsszenarien**:
- Neue Funktion implementieren
- Bug beheben (zuerst einen Test schreiben, der den Bug reproduziert)
- Vorhandenen Code refactoren
- Kerngeschäftslogik schreiben

**TDD-Zyklus**:

```
RED → GREEN → REFACTOR → REPEAT

RED:      Einen fehlschlagenden Test schreiben
GREEN:    Minimalen Code schreiben, um den Test zu bestehen
REFACTOR: Code verbessern, Test bestehen lassen
REPEAT:   Nächste Funktion/Szenario
```

::: warning Zwingende Anforderung

**Zuerst Tests schreiben, dann Code**. Die RED-Phase nicht überspringen.

:::

**Beispiel**:

```
Sie: /tdd Ich brauche eine Funktion zur Berechnung der Marktliquiditätsbewertung

Claude (tdd-guide agent):
## Schritt 1: Schnittstelle definieren (SCAFFOLD)
```typescript
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}
```

## Schritt 2: Fehlschlagenden Test schreiben (RED)
```typescript
test('sollte hohe Bewertung für liquiden Markt zurückgeben', () => {
  const market = { ... }
  expect(calculateLiquidityScore(market)).toBeGreaterThan(80)
})
```

## Schritt 3: Tests ausführen - Fehlschlag verifizieren
```bash
npm test lib/liquidity.test.ts
FAIL ✕ sollte hohe Bewertung für liquiden Markt zurückgeben
  Error: Nicht implementiert
```

## Schritt 4: Minimalen Code implementieren (GREEN)
```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Implementierung...
}
```

## Schritt 5: Tests ausführen - Bestehen verifizieren
```bash
npm test lib/liquidity.test.ts
PASS ✓ sollte hohe Bewertung für liquiden Markt zurückgeben
```

## Schritt 6: Refactoren (IMPROVE)
// Code-Struktur verbessern...

## Schritt 7: Verifizieren, dass Tests noch bestehen
```bash
npm test lib/liquidity.test.ts
PASS ✓ alle Tests bestehen
```

## Schritt 8: Abdeckung prüfen
Abdeckung: 100% ✅ (Ziel: 80%)
```

**Best Practices**:
- ✅ Zuerst Schnittstellendefinition schreiben
- ✅ Implementieren nach Testfehler
- ✅ Sofort testen, nachdem eine Funktion fertig ist
- ✅ Vor und nach Refactoring verifizieren, dass Tests bestehen
- ✅ Abdeckung ≥ 80% (kritischer Code 100%)
- ❌ Nicht zu viel Code schreiben, bevor getestet wird
- ❌ RED-Phase nicht überspringen
- ❌ Implementierungsdetails nicht testen

---

### /orchestrate: Agents sequentiell ausführen

**Verwendung**: Automatisierte Ausführung von mehreren Agents in einer sequentiellen Workflow-Reihenfolge.

**Anwendungsszenarien**:
- Komplette Funktionsentwicklung (planner → tdd-guide → code-reviewer → security-reviewer)
- Bug-Fix-Workflow (explorer → tdd-guide → code-reviewer)
- Sicherheitsaudit (security-reviewer → code-reviewer → architect)

**Workflow-Typen**:

| Workflow-Typ | Agent-Sequenz |
|---|---|
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**Beispiel**:

```
Sie: /orchestrate feature "Benutzerauthentifizierungsfunktion hinzufügen"

Claude:
### ORCHESTRATION-BERICHT
Workflow: feature
Aufgabe: Benutzerauthentifizierungsfunktion hinzufügen
Agents: planner → tdd-guide → code-reviewer → security-reviewer

ZUSAMMENFASSUNG
---------------
Benutzerauthentifizierungsfunktion erfolgreich implementiert, einschließlich Registrierung, Login, Sitzungsverwaltung.

AGENT-AUSGABEN
--------------
Planner: 4-Phasen-Implementierungsplan erstellt
TDD Guide: Authentifizierungsdienst implementiert, Abdeckung 95%
Code Reviewer: 3 hoch priorisierte Probleme gefunden, behoben
Security Reviewer: Sicherheitsaudit bestanden, keine Schwachstellen

GEÄNDERTE DATEIEN
-----------------
- src/services/auth.ts
- src/api/auth/route.ts
- tests/auth.test.ts
- ...

TESTERGEBNISSE
--------------
PASS: 24/24 Tests (100%)

SICHERHEITSSTATUS
-----------------
✅ Keine Schwachstellen gefunden

EMPFEHLUNG
----------
✅ SHIP - Bereit für Produktion
```

**Best Practices**:
- ✅ Orchestrate für komplexe Funktionen verwenden
- ✅ Klare Übergabedokumente zwischen jedem Agent
- ✅ Unabhängige Prüfungen parallel ausführen (code-reviewer und security-reviewer)
- ❌ Orchestrate nicht für einfache Aufgaben verwenden

---

## Code-Qualitäts-Befehle

### /code-review: Code-Review

**Verwendung**: Umfassende Prüfung nicht committeter Änderungen auf Sicherheitsprobleme und Code-Qualität.

**Anwendungsszenarien**:
- Vor dem Code-Commit
- Vor dem Merge eines PR
- Nach Abschluss der Funktionsentwicklung

**Prüfpunkte**:

| Kategorie | Prüfinhalt | Schweregrad |
|---|---|---|
| **Sicherheit** | Hardcodierte Schlüssel, SQL-Injection, XSS, fehlende Eingabevalidierung | CRITICAL |
| **Code-Qualität** | Funktion > 50 Zeilen, Datei > 800 Zeilen, Verschachtelungstiefe > 4 | HIGH |
| **Best Practices** | Mutation-Muster, console.log, fehlende Tests, TODO/FIXME | MEDIUM |

**Beispiel**:

```
Sie: /code-review

Claude (code-reviewer agent):
# Code-Review-Bericht

## Sicherheitsprobleme (CRITICAL)
🔴 [HIGH] Hardcodierter API-Schlüssel
Datei: src/api/github.ts:15
Problem: GitHub-Token ist hardcodiert
Fix: In Umgebungsvariable verschieben

## Code-Qualität (HIGH)
🟡 [MEDIUM] Funktion überschreitet 50 Zeilen
Datei: src/utils/formatter.ts:62
Zeilen: 78
Problem: FormatLargeData-Funktion ist zu lang
Fix: In kleinere Funktionen aufteilen

## Best Practices (MEDIUM)
🟢 [LOW] TODO-Kommentar
Datei: src/services/user.ts:45
Problem: TODO: Ratenbegrenzung hinzufügen
Fix: Implementieren oder Kommentar entfernen

ZUSAMMENFASSUNG
---------------
CRITICAL: 1 (Muss vor dem Commit behoben werden)
HIGH: 2 (Sollte behoben werden)
MEDIUM: 3 (Optional)

❌ BLOCKIERT - Kritische Sicherheitsprobleme gefunden
```

::: danger Blockierungsregel

Wenn **CRITICAL** oder **HIGH** Stufe Probleme gefunden werden, wird der Commit blockiert.

:::

---

### /build-fix: Build-Fehler beheben

**Verwendung**: TypeScript- und Build-Fehler einzeln beheben.

**Anwendungsszenarien**:
- `npm run build` schlägt fehl
- TypeScript-Typfehler
- Kompilierungsfehler

**Arbeitsablauf**:

```
1. Build ausführen
   ↓
2. Fehlerausgabe parsen, nach Schweregrad sortieren
   ↓
3. Einzeln beheben:
   - Fehlerkontext anzeigen
   - Problem erklären
   - Behebungsvorschlag machen
   - Fix anwenden
   - Build neu ausführen
   ↓
4. Behebungszusammenfassung generieren
```

**Beispiel**:

```
Sie: /build-fix

Claude (build-error-resolver agent):
# Build-Fehler beheben

Build ausführen: npm run build
5 Fehler gefunden

## Fehler 1: Typ 'string' ist nicht zuweisbar zu Typ 'number'
Datei: src/calculator.ts:15
```typescript
const result = add("10", "20")  // Fehler
```
Problem: add-Funktion erwartet Zahlen, erhält Strings
Fix: In Zahlen konvertieren
```typescript
const result = add(Number("10"), Number("20"))
```
✅ Behoben. Build wird neu ausgeführt...

## Fehler 2: Modul './utils' kann nicht gefunden werden
Datei: src/index.ts:3
Problem: Importpfad ist falsch
Fix: Ändern zu './utils/helper'
```typescript
import { helper } from './utils/helper'
```
✅ Behoben. Build wird neu ausgeführt...

...

ZUSAMMENFASSUNG
---------------
Behobene Fehler: 5
Verbleibende Fehler: 0
Build-Status: ✅ BESTANDEN
```

::: tip Sicherheit zuerst

Nur einen Fehler auf einmal beheben, um neue Probleme zu vermeiden.

:::

---

### /refactor-clean: Toten Code bereinigen

**Verwendung**: Sicheres Identifizieren und Entfernen nicht verwendeten Codes.

**Anwendungsszenarien**:
- Codebasis hat viele ungenutzte Dateien und Exports
- Wartungsaufwand reduzieren
- Code-Lesbarkeit verbessern

**Arbeitsablauf**:

```
1. Tool zur toten Code-Analyse ausführen
   - knip: Ungenutzte Exports und Dateien finden
   - depcheck: Ungenutzte Abhängigkeiten finden
   - ts-prune: Ungenutzte TypeScript-Exports finden
   ↓
2. Umfassenden Bericht generieren
   ↓
3. Nach Schweregrad klassifizieren
   - SAFE: Testdateien, ungenutzte Hilfsfunktionen
   - CAUTION: API-Routen, Komponenten
   - DANGER: Konfigurationsdateien, Einstiegsdateien
   ↓
4. Einzeln löschen (zuerst testen)
   ↓
5. Bereinigungszusammenfassung generieren
```

**Beispiel**:

```
Sie: /refactor-clean

Claude (refactor-cleaner agent):
# Analyse des toten Codes

## Ausgeführte Tools
- ✅ knip: 12 ungenutzte Exports gefunden
- ✅ depcheck: 5 ungenutzte Abhängigkeiten gefunden
- ✅ ts-prune: 8 ungenutzte TypeScript-Exports gefunden

## Klassifizierung

### SAFE (Kann gelöscht werden)
- `src/utils/old-helper.ts` - Ungenutzte Hilfsfunktion
- `src/components/Button.tsx` - Nirgends verwendet
- `lodash` - Ungenutzte Abhängigkeit

### CAUTION (Zuerst prüfen)
- `src/api/users.ts` - Nur in Tests verwendet
- `@types/node` - Wird möglicherweise in Build-Skripten verwendet

### DANGER (Nicht löschen)
- `src/index.ts` - Haupteinstiegspunkt
- `tsconfig.json` - Konfigurationsdatei

## Löschplan

Zuerst vollständige Testsuite ausführen:
✅ Tests bestehen (98% Abdeckung)

SAFE-Elemente löschen...

1. src/utils/old-helper.ts entfernen
   ✅ Tests bestehen weiterhin

2. src/components/Button.tsx entfernen
   ✅ Tests bestehen weiterhin

3. lodash aus package.json entfernen
   ✅ Tests bestehen weiterhin

ZUSAMMENFASSUNG
---------------
Gelöschte Dateien: 12
Entfernte Abhängigkeiten: 5
Tests bestehen weiterhin: ✅
```

::: warning Tests zuerst

**Vor dem Löschen von Code müssen Tests ausgeführt werden**, um sicherzustellen, dass keine bestehende Funktionalität beschädigt wird.

:::

---

### /verify: Umfassende Validierung

**Verwendung**: Vollständige Code-Validierungsprüfungen ausführen.

**Anwendungsszenarien**:
- Vor dem Code-Commit
- Vor dem Merge eines PR
- Bei der Vorbereitung eines Releases

**Prüfpunkte** (in Reihenfolge):

1. **Build-Prüfung** - Build-Befehl ausführen
2. **Typ-Prüfung** - TypeScript-Checker ausführen
3. **Lint-Prüfung** - Linter ausführen
4. **Testsuite** - Alle Tests ausführen, Abdeckung melden
5. **Console.log-Audit** - Quelldateien nach console.log durchsuchen
6. **Git-Status** - Nicht committierte Änderungen anzeigen

**Beispiel**:

```
Sie: /verify pre-pr

Claude:
# Validierungsbericht

VALIDIERUNG: ✅ BESTANDEN

Build:    ✅ OK
Types:    ✅ OK (0 Fehler)
Lint:     ✅ OK (0 Probleme)
Tests:    ✅ 142/145 bestanden, 98% Abdeckung
Secrets:  ✅ OK (0 gefunden)
Logs:     ⚠️ 3 console.logs gefunden

Console.log-Positionen:
- src/utils/logger.ts:15 (absichtlicher Logger)
- src/api/webhook.ts:42 (Debug, vor dem Commit entfernen)
- src/services/auth.ts:89 (Debug, vor dem Commit entfernen)

Bereit für PR: ⚠️ JA (Debug-Logs entfernen)

Dateien geändert seit letztem Commit:
- src/api/webhook.ts (neu)
- src/services/auth.ts (geändert)
- tests/auth.test.ts (geändert)
```

**Parameter**:
- `quick` - Nur Build + Typ-Prüfung
- `full` - Alle Prüfungen (Standard)
- `pre-commit` - Commit-bezogene Prüfungen
- `pre-pr` - Umfassende Prüfung + Sicherheitsscan

---

## Test-Befehle

### /e2e: End-to-End-Tests

**Verwendung**: Playwright verwenden, um End-to-End-Tests zu generieren und auszuführen.

**Anwendungsszenarien**:
- Kritische Benutzerabläufe testen (Login, Transaktion, Zahlung)
- End-to-End-Integration von Multi-Step-Abläufen verifizieren
- UI-Interaktionen und Navigation testen
- Vorbereitung für Produktionsdeployment

**Arbeitsablauf**:

```
1. Benutzerablauf analysieren, Testszenarien identifizieren
   ↓
2. Playwright-Tests generieren (mit Page Object Pattern)
   ↓
3. Tests über mehrere Browser ausführen (Chrome, Firefox, Safari)
   ↓
4. Screenshots, Videos, Traces bei Fehlschlag erfassen
   ↓
5. Bericht mit Ergebnissen und Artefakten generieren
   ↓
6. Instabile Tests identifizieren und Behebung vorschlagen
```

**Beispiel**:

```
Sie: /e2e Marktsuche und Anzeige-Ablauf testen

Claude (e2e-runner agent):
# E2E-Test-Generierung: Marktsuche und Anzeige-Ablauf

## Identifiziertes Testszenario
**Benutzerreise:** Marktsuche → Ergebnisse anzeigen → Markt klicken → Details anzeigen

## Generierter Test-Code
```typescript
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test('Benutzer kann Märkte suchen und Details anzeigen', async ({ page }) => {
  const marketsPage = new MarketsPage(page)
  await marketsPage.goto()

  // Suche durchführen
  await marketsPage.searchMarkets('election')
  await page.waitForResponse(resp =>
    resp.url().includes('/api/markets/search') && resp.status() === 200
  )

  // Ergebnisse verifizieren
  const marketCards = marketsPage.marketCards
  await expect(marketCards.first()).toBeVisible()

  // Erstes Ergebnis klicken
  await marketCards.first().click()

  // Verifizieren, dass Marktdetailseite lädt
  await expect(page).toHaveURL(/\/markets\/[a-z0-9-]+/)
  await expect(page.locator('[data-testid="market-name"]')).toBeVisible()
})
```

## Tests ausführen
```bash
npx playwright test tests/e2e/markets/search-and-view.spec.ts

✓ [chromium] Benutzer kann Märkte suchen und Details anzeigen (4.2s)
✓ [chromium] Suche ohne Ergebnisse zeigt leeren Zustand (1.8s)

2 bestanden (6.0s)

Generierte Artefakte:
- artifacts/search-results.png
- artifacts/market-details.png
- playwright-report/index.html
```

## Testbericht
╔══════════════════════════════════════════════════════╗
║ Status:     ✅ ALLE TESTS BESTANDEN                   ║
║ Gesamt:     2 Tests                                    ║
║ Bestanden:  2 (100%)                                   ║
║ Instabil:   0                                           ║
╚══════════════════════════════════════════════════════╝
```

**Schnellbefehle**:

```bash
# Alle E2E-Tests ausführen
npx playwright test

# Spezifische Testdatei ausführen
npx playwright test tests/e2e/markets/search.spec.ts

# Im Headed-Modus ausführen (Browser sichtbar)
npx playwright test --headed

# Test debuggen
npx playwright test --debug

# Bericht anzeigen
npx playwright show-report
```

**Best Practices**:
- ✅ Page Object Model für bessere Wartbarkeit verwenden
- ✅ data-testid-Attribute als Selektoren verwenden
- ✅ Auf API-Antworten warten, nicht auf willkürliche Timeouts
- ✅ Kritische Benutzerabläufe testen
- ❌ Keine fragilen Selektoren verwenden (CSS-Klassen ändern sich)
- ❌ Keine Implementierungsdetails testen

---

### /test-coverage: Testabdeckung analysieren

**Verwendung**: Testabdeckung analysieren und fehlende Tests generieren.

**Anwendungsszenarien**:
- Abdeckung unter 80%
- Tests ergänzen müssen

**Arbeitsablauf**:

```
1. Tests mit Abdeckung ausführen
   ↓
2. Abdeckungsbericht analysieren (coverage/coverage-summary.json)
   ↓
3. Dateien identifizieren, die unter 80% Abdeckungsschwelle liegen
   ↓
4. Für jede unterabgedeckte Datei:
   - Nicht getestete Codepfade analysieren
   - Unit-Tests für Funktionen generieren
   - Integrationstests für APIs generieren
   ↓
5. Neue Tests verifizieren
   ↓
6. Vorherige/nachfolgende Abdeckungskennzahlen anzeigen
```

**Beispiel**:

```
Sie: /test-coverage

Claude:
# Testabdeckungsanalyse

Tests mit Abdeckung ausführen...
npm test --coverage

## Abdeckungsbericht

Datei                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   65    |   50     |   75    |   63  ⚠️
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   45    |   30     |   50    |   44  ⚠️

Gesamt                   |   78    |   72     |   85    |   76  ⚠️

Ziel: 80%
Aktuell: 76% ❌ Muss verbessert werden

## Fehlende Tests generieren

### Datei: src/utils/formatter.ts (65% Abdeckung)
Nicht getestete Pfade:
- FormatCurrency mit negativen Werten
- FormatDate mit benutzerdefiniertem Gebietsschema
- TruncateText mit langen Strings

Tests generieren...
```typescript
describe('formatter', () => {
  it('sollte negative Währung formatieren', () => {
    expect(formatCurrency(-100)).toBe('-$100.00')
  })

  it('sollte Datum mit benutzerdefiniertem Gebietsschema formatieren', () => {
    expect(formatDate(new Date(), 'ja-JP')).toMatch('2024年')
  })

  it('sollte langen Text kürzen', () => {
    expect(truncateText('a'.repeat(100), 10)).toBe('aaaaaaaaaa...')
  })
})
```

### Datei: src/components/Button.tsx (45% Abdeckung)
Nicht getestete Pfade:
- Deaktivierter Zustand
- Ladezustand
- onClick-Handler

Tests generieren...

## Nach Hinzufügen der Tests

Tests erneut ausführen...

Datei                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   100   |   95     |   100   |   99  ✅
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   95    |   90     |   100   |   94  ✅

Gesamt                   |   95    |   92     |   100   |   94  ✅

Ziel: 80%
Aktuell: 94% ✅ ÜBERTROFFEN

Zusammenfassung: +12 Tests hinzugefügt, Abdeckung: 76% → 94%
```

---

### /eval: Eval-Driven Development

**Verwendung**: Eval-Driven-Development-Workflow verwalten.

**Anwendungsszenarien**:
- Eval-Driven Development (EDD)
- Funktionsakzeptanztests
- Regressionstests

**Unterbefehle**:

- `define <name>` - Neue Eval-Definition erstellen
- `check <name>` - Evals ausführen und prüfen
- `report <name>` - Vollständigen Bericht generieren
- `list` - Alle Evals anzeigen

**Beispiel - Eval definieren**:

```
Sie: /eval define user-auth

Claude:
Eval-Definition erstellen...

.claude/evals/user-auth.md:

## EVAL: user-auth
Erstellt: 2026-01-25

### Capability Evals
- [ ] Benutzer kann sich mit E-Mail und Passwort registrieren
- [ ] Benutzer kann sich mit korrekten Anmeldedaten einloggen
- [ ] Benutzer kann sich nicht mit falschem Passwort einloggen
- [ ] Benutzer kann Passwort per E-Mail zurücksetzen

### Regression Evals
- [ ] Bestehende Benutzer können sich weiterhin einloggen
- [ ] Sitzungstokens funktionieren weiterhin
- [ ] OAuth-Login funktioniert weiterhin

### Erfolgskriterien
- pass@3 > 90% für Capability-Evals
- pass^3 = 100% für Regression-Evals

Bitte spezifische Bewertungskriterien eintragen...
```

**Beispiel - Eval prüfen**:

```
Sie: /eval check user-auth

Claude:
Evals ausführen...

EVAL-CHECK: user-auth
=======================
Capability: 2/4 bestanden
Regression: 2/3 bestanden
Status: IN BEARBEITUNG

Capability-Ergebnisse:
✅ Benutzer kann sich mit E-Mail und Passwort registrieren
✅ Benutzer kann sich mit korrekten Anmeldedaten einloggen
❌ Benutzer kann sich nicht mit falschem Passwort einloggen (fällt intermittierend aus)
❌ Benutzer kann Passwort per E-Mail zurücksetzen (nicht implementiert)

Regression-Ergebnisse:
✅ Bestehende Benutzer können sich weiterhin einloggen
✅ Sitzungstokens funktionieren weiterhin
❌ OAuth-Login funktioniert weiterhin (Test scheitert aufgrund von Ratenbegrenzung)

EMPFEHLUNG: BENÖTIGT ARBEIT - Passwortvalidierung beheben und Passwort-Zurücksetzung implementieren
```

**Beispiel - Eval-Bericht**:

```
Sie: /eval report user-auth

Claude:
Umfassenden Bericht generieren...

EVAL-BERICHT: user-auth
=========================
Generiert: 2026-01-25

CAPABILITY-EVALS
----------------
[register-email-pass]: PASS (pass@1)
[login-credentials-pass]: PASS (pass@2) - Retry erforderlich
[login-wrong-pass-fail]: FAIL - siehe Notizen
[password-reset-pass]: FAIL - nicht implementiert

REGRESSION-EVALS
----------------
[existing-users-login]: PASS
[session-tokens]: PASS
[oauth-login]: PASS

METRIKEN
-------
Capability pass@1: 50%
Capability pass@3: 100%
Regression pass^3: 100%

NOTIZEN
-------
Passwortvalidierungstest ist aufgrund eines Timing-Problems instabil.
Passwort-Zurücksetzungsablauf muss implementiert werden.

EMPFEHLUNG
----------
BENÖTIGT ARBEIT - Passwort-Zurücksetzungsimplementierung vervollständigen
```

---

## Dokumentations- und Architektur-Befehle

### /update-docs: Dokumentation synchronisieren

**Verwendung**: Dokumentation aus dem Quellcode synchronisieren.

**Anwendungsszenarien**:
- Dokumentation nach Code-Änderungen aktualisieren
- Dokumentation mit Code synchron halten

**Arbeitsablauf**:

```
1. package.json scripts-Bereich lesen
   - Skript-Referenztabelle generieren
   - Beschreibungen aus Kommentaren extrahieren
   ↓
2. .env.example lesen
   - Alle Umgebungsvariablen extrahieren
   - Verwendung und Format dokumentieren
   ↓
3. docs/CONTRIB.md generieren
   - Entwicklungsworkflow
   - Verfügbare Skripte
   - Umgebungseinrichtung
   - Testverfahren
   ↓
4. docs/RUNBOOK.md generieren
   - Deployment-Verfahren
   - Überwachung und Alarmierung
   - Häufige Probleme und Behebungen
   - Rollback-Verfahren
   ↓
5. Veraltete Dokumentation identifizieren
   - Dokumente finden, die 90+ Tage nicht geändert wurden
   - Zur manuellen Überprüfung auflisten
   ↓
6. Diff-Zusammenfassung anzeigen
```

::: tip Einzelne Quelle der Wahrheit

package.json und .env.example sind die einzigen Quellen der Wahrheit.

:::

---

### /update-codemaps: Architekturdokumentation aktualisieren

**Verwendung**: Codebasis-Struktur analysieren und Architekturdokumentation aktualisieren.

**Anwendungsszenarien**:
- Nach Änderungen der Code-Struktur
- Architekturdokumentation muss aktualisiert werden

**Arbeitsablauf**:

```
1. Alle Quelldateien auf Importe, Exporte und Abhängigkeiten scannen
   ↓
2. Kompakte Codemaps generieren:
   - codemaps/architecture.md - Gesamtarchitektur
   - codemaps/backend.md - Backend-Struktur
   - codemaps/frontend.md - Frontend-Struktur
   - codemaps/data.md - Datenmodelle und Schemas
   ↓
3. Diff-Prozentsatz zur vorherigen Version berechnen
   ↓
4. Wenn Änderung > 30%, Benutzerzustimmung einholen vor dem Update
   ↓
5. Zeitstempel der Aktualität zu jeder Codemap hinzufügen
   ↓
6. Bericht in .reports/codemap-diff.txt speichern
```

**Beispiel**:

```
Sie: /update-codemaps

Claude:
Codebasis-Struktur analysieren...

156 Dateien scannen...
89 Importe und 124 Exporte gefunden

## Codemap-Diff

Vorherige Version: 2026-01-20
Aktuelle Version: 2026-01-25
Diff: 12% (unter 30% Schwellenwert)

✅ Sicher zu aktualisieren

## Aktualisierte Codemaps

codemaps/architecture.md
- Modulabhängigkeiten aktualisiert
- Neue Dienste hinzugefügt: auth, notifications
- Veraltete Module entfernt: legacy-db

codemaps/backend.md
- API-Routenstruktur aktualisiert
- Middleware-Dokumentation hinzugefügt

codemaps/frontend.md
- Komponentenhierarchie aktualisiert
- Neue Seiten hinzugefügt: profile, settings

codemaps/data.md
- Datenbankschemas aktualisiert
- Neue Tabellen hinzugefügt: users, sessions

Zusammenfassung: 4 Codemaps aktualisiert, 12% Änderung
```

---

## Statusverwaltungs-Befehle

### /checkpoint: Arbeitsstatus speichern

**Verwendung**: Checkpoints im Workflow erstellen oder validieren.

**Anwendungsszenarien**:
- Wichtige Entwicklungsphasen speichern
- Rollback und Fortschrittsverfolgung unterstützen

**Unterbefehle**:

- `create <name>` - Benannten Checkpoint erstellen
- `verify <name>` - Checkpoint validieren
- `list` - Alle Checkpoints anzeigen
- `clear` - Alte Checkpoints entfernen (letzte 5 behalten)

**Beispiel**:

```
Sie: /checkpoint create feature-start

Claude:
# Checkpoint erstellen: feature-start

/verify quick ausführen...

Build: ✅ OK
Types: ✅ OK

Checkpoint erstellen...

✅ Checkpoint "feature-start" erstellt
├─ Zeitstempel: 2026-01-25-14:30
├─ Git SHA: abc1234
└─ Status: Clean (keine nicht committeten Änderungen)
```

```
Sie: /checkpoint verify feature-start

Claude:
CHECKPOINT-VERGLEICH: feature-start
===========================
Geänderte Dateien: 5
Tests: +3 bestanden / -0 fehlgeschlagen
Abdeckung: +5% / -0%
Build: PASS

Änderungen seit Checkpoint:
✅ src/services/auth.ts (geändert)
✅ tests/auth.test.ts (hinzugefügt)
✅ src/components/Login.tsx (hinzugefügt)
```

**Workflow**:

```
[Start] → /checkpoint create "feature-start"
   |
[Implementieren] → /checkpoint create "core-done"
   |
[Tests] → /checkpoint verify "core-done"
   |
[Refactoren] → /checkpoint create "refactor-done"
   |
[PR] → /checkpoint verify "feature-start"
```

---

## Lernen- und Optimierungs-Befehle

### /learn: Wiederverwendbare Muster extrahieren

**Verwendung**: Aktuelle Sitzung analysieren und als Skill speicherbare Muster extrahieren.

**Anwendungsszenarien**:
- Nach Lösung eines nichttrivialen Problems
- Wiederverwendbare Fehlerbehebungsmuster entdeckt
- Projektspezifische Konventionen dokumentieren

**Extrahierter Inhalt**:

1. **Fehlerbehebungsmuster**
   - Welcher Fehler ist aufgetreten?
   - Was ist die Wurzelursache?
   - Wie wurde es behoben?
   - Ist es auf ähnliche Fehler anwendbar?

2. **Debugging-Techniken**
   - Nicht offensichtliche Debugging-Schritte
   - Effektive Werkzeugkombinationen
   - Diagnosemuster

3. **Workarounds**
   - Eigenheiten von Bibliotheken
   - API-Einschränkungen
   - Versionsspezifische Fixes

4. **Projektspezifische Muster**
   - Entdeckte Codebasis-Konventionen
   - Getroffene Architekturentscheidungen
   - Integrationsmuster

**Beispiel**:

```
Sie: /learn

Claude:
# Muster aus Sitzung extrahieren

Sitzungsverlauf durchsuchen...

3 extrahierbare Muster gefunden:

## Muster 1: Supabase Auth Session Recovery
**Typ:** Fehlerbehebung
**Wiederverwendbarkeit:** Hoch (betrifft alle Auth-Endpunkte)

### Problem
Nach dem Login des Benutzers schlagen nachfolgende API-Aufrufe mit 401 Unauthorized fehl.

### Wurzelursache
Supabase-Sitzungscookie wird aufgrund von CORS-Konfiguration nicht an Backend-API gesendet.

### Lösung
```typescript
// Supabase mit korrekter URL konfigurieren
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storageKey: 'my-app-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
```

### Wann zu verwenden
Trigger: Auth-Endpunkte geben unerwartet 401 zurück

---

## Muster 2: Playwright Test Flakiness Fix
**Typ:** Debugging-Technik
**Wiederverwendbarkeit:** Mittel (betrifft asynchrone UI-Tests)

### Problem
Test "Benutzer kann auf Absenden-Button klicken" fällt intermittierend mit Timeout aus.

### Wurzelursache
Button ist aufgrund asynchroner Validierung initial deaktiviert, aber Test wartet nicht.

### Lösung
```typescript
// Explizites Warten mit Prädikat verwenden
await page.waitForSelector('[data-testid="submit-btn"]:not(:disabled)', {
  timeout: 10000
})

// Dann klicken
await page.locator('[data-testid="submit-btn"]').click()
```

### Wann zu verwenden
Trigger: Test-Timing-Probleme mit asynchronem UI-Zustand

---

Möchten Sie diese Muster speichern? (ja/nein/ändern)
```

::: tip Fokus-Prinzip

Ein Muster auf einmal extrahieren, Skills fokussiert halten.

:::

---

## Konfigurations-Befehle

### /setup-pm: Paketmanager konfigurieren

**Verwendung**: Bevorzugten Paketmanager für Projekt oder global konfigurieren.

**Anwendungsszenarien**:
- Aktuell verwendeten Paketmanager erkennen
- Globale oder Projekt-Präferenz setzen

**Erkennungspriorität**:

1. Umgebungsvariable: `CLAUDE_PACKAGE_MANAGER`
2. Projekt-Konfiguration: `.claude/package-manager.json`
3. package.json: `packageManager` Feld
4. Lock-Dateien: package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb
5. Globale Konfiguration: `~/.claude/package-manager.json`
6. Fallback: Erster verfügbarer Paketmanager

**Unterstützte Paketmanager-Priorität**: pnpm > bun > yarn > npm

**Beispiel**:

```bash
# Aktuellen Paketmanager erkennen
node scripts/setup-package-manager.js --detect

# Globale Präferenz setzen
node scripts/setup-package-manager.js --global pnpm

# Projekt-Präferenz setzen
node scripts/setup-package-manager.js --project bun

# Verfügbare Paketmanager auflisten
node scripts/setup-package-manager.js --list
```

**Konfigurationsdateien**:

Globale Konfiguration (`~/.claude/package-manager.json`):
```json
{
  "packageManager": "pnpm"
}
```

Projekt-Konfiguration (`.claude/package-manager.json`):
```json
{
  "packageManager": "bun"
}
```

Umgebungsvariable überschreibt alle Erkennungsmethoden:
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

---

## Befehlskombinations-Workflows

### Kompletter Funktionsentwicklungsprozess

```
1. /plan "Benutzerauthentifizierungsfunktion hinzufügen"
   ↓ Implementierungsplan erstellen
2. /tdd "Authentifizierungsdienst implementieren"
   ↓ TDD-Entwicklung
3. /test-coverage
   ↓ Abdeckung ≥ 80% sicherstellen
4. /code-review
   ↓ Code-Review
5. /verify pre-pr
   ↓ Umfassende Validierung
6. /checkpoint create "auth-feature-done"
   ↓ Checkpoint speichern
7. /update-docs
   ↓ Dokumentation aktualisieren
8. /update-codemaps
   ↓ Architekturdokumentation aktualisieren
```

### Bug-Fix-Workflow

```
1. /checkpoint create "bug-start"
   ↓ Aktuellen Status speichern
2. /orchestrate bugfix "Login-Fehler beheben"
   ↓ Automatisierter Bug-Fix-Workflow
3. /test-coverage
   ↓ Testabdeckung sicherstellen
4. /verify quick
   ↓ Fix verifizieren
5. /checkpoint verify "bug-start"
   ↓ Mit Checkpoint vergleichen
```

### Sicherheitsaudit-Workflow

```
1. /orchestrate security "Zahlungsablauf überprüfen"
   ↓ Sicherheitsorientierter Review-Workflow
2. /e2e "Zahlungsablauf testen"
   ↓ End-to-End-Tests
3. /code-review
   ↓ Code-Review
4. /verify pre-pr
   ↓ Umfassende Validierung
```

---

## Befehlsvergleichs-Schnellreferenz

| Befehl | Hauptverwendung | Auslösender Agent | Ausgabe |
|---|---|---|---|
| `/plan` | Implementierungsplan erstellen | planner | Phasenplan |
| `/tdd` | TDD-Entwicklung | tdd-guide | Tests + Implementierung + Abdeckung |
| `/orchestrate` | Agents sequentiell ausführen | Mehrere Agents | Umfassender Bericht |
| `/code-review` | Code-Review | code-reviewer, security-reviewer | Sicherheits- und Qualitätsbericht |
| `/build-fix` | Build-Fehler beheben | build-error-resolver | Behebungszusammenfassung |
| `/refactor-clean` | Toten Code bereinigen | refactor-cleaner | Bereinigungszusammenfassung |
| `/verify` | Umfassende Validierung | Bash | Validierungsbericht |
| `/e2e` | End-to-End-Tests | e2e-runner | Playwright-Tests + Artefakte |
| `/test-coverage` | Abdeckung analysieren | Bash | Abdeckungsbericht + fehlende Tests |
| `/eval` | Eval-Driven Development | Bash | Eval-Statusbericht |
| `/checkpoint` | Status speichern | Bash + Git | Checkpoint-Bericht |
| `/learn` | Muster extrahieren | continuous-learning skill | Skill-Datei |
| `/update-docs` | Dokumentation synchronisieren | doc-updater agent | Dokumentationsupdate |
| `/update-codemaps` | Architektur aktualisieren | doc-updater agent | Codemap-Update |
| `/setup-pm` | Paketmanager konfigurieren | Node.js-Skript | Paketmanager-Erkennung |

---

## Fallstrick-Warnungen

### ❌ Planungsphase nicht überspringen

Bei komplexen Funktionen führt direktes Codieren zu:
- Wichtige Abhängigkeiten übersehen
- Architektur-Inkonsistenzen
- Anforderungsmissverständnissen

**✅ Richtige Vorgehensweise**: Detaillierten Plan mit `/plan` erstellen, Bestätigung abwarten vor der Implementierung.

---

### ❌ RED-Phase im TDD nicht überspringen

Code zuerst schreiben, dann Tests, ist kein TDD.

**✅ Richtige Vorgehensweise**: RED → GREEN → REFACTOR Zyklus strikt einhalten.

---

### ❌ CRITICAL-Probleme bei /code-review nicht ignorieren

Sicherheitslücken können zu Datenlecks, finanziellen Verlusten und anderen schwerwiegenden Folgen führen.

**✅ Richtige Vorgehensweise**: Alle CRITICAL und HIGH Probleme vor dem Commit beheben.

---

### ❌ Vor dem Löschen von Code nicht testen

Tote Code-Analyse kann Fehlalarme geben, direktes Löschen kann Funktionalität beschädigen.

**✅ Richtige Vorgehensweise**: Vor jedem Löschen Tests ausführen, um bestehende Funktionalität nicht zu beschädigen.

---

### ❌ /learn nicht vergessen

Nach Lösung nichttrivialer Probleme Muster nicht extrahieren, beim nächsten gleichen Problem wieder von vorne anfangen.

**✅ Richtige Vorgehensweise**: Regelmäßig `/learn` verwenden, um wiederverwendbare Muster zu extrahieren und Wissen zu sammeln.

---

## Zusammenfassung dieser Lektion

Die 15 Slash-Befehle von Everything Claude Code bieten umfassende Unterstützung für den Entwicklungsworkflow:

- **Entwicklungsprozess**: `/plan` → `/tdd` → `/orchestrate`
- **Code-Qualität**: `/code-review` → `/build-fix` → `/refactor-clean` → `/verify`
- **Tests**: `/e2e` → `/test-coverage` → `/eval`
- **Dokumentation & Architektur**: `/update-docs` → `/update-codemaps`
- **Statusverwaltung**: `/checkpoint`
- **Lernen & Optimierung**: `/learn`
- **Konfiguration**: `/setup-pm`

Diese Befehle zu beherrschen ermöglicht es Ihnen, Entwicklungsarbeit effizient, sicher und qualitativ hochwertig zu erledigen.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Kernelemente der Agents](../agents-overview/)** kennen.
>
> Sie werden lernen:
> - Verantwortungsbereiche und Anwendungsszenarien von 9 spezialisierten Agents
> - Wann welchen Agent aufrufen
> - Wie Agents zusammenarbeiten
> - Wie Agent-Konfigurationen angepasst werden

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeile |
|---|---|---|
| TDD-Befehl | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Plan-Befehl | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Code Review-Befehl | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| E2E-Befehl | [`commands/e2e.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/e2e.md) | 1-364 |
| Build Fix-Befehl | [`commands/build-fix.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/build-fix.md) | 1-30 |
| Refactor Clean-Befehl | [`commands/refactor-clean.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/refactor-clean.md) | 1-29 |
| Learn-Befehl | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Checkpoint-Befehl | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify-Befehl | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Test Coverage-Befehl | [`commands/test-coverage.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/test-coverage.md) | 1-28 |
| Setup PM-Befehl | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md) | 1-81 |
| Update Docs-Befehl | [`commands/update-docs.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-docs.md) | 1-32 |
| Orchestrate-Befehl | [`commands/orchestrate.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/orchestrate.md) | 1-173 |
| Update Codemaps-Befehl | [`commands/update-codemaps.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-codemaps.md) | 1-18 |
| Eval-Befehl | [`commands/eval.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/eval.md) | 1-121 |
| Plugin-Definition | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |

**Wichtige Konstanten**:
- TDD-Abdeckungsziel: 80% (kritischer Code 100%) - `commands/tdd.md:293-300`

**Wichtige Funktionen**:
- TDD-Zyklus: RED → GREEN → REFACTOR - `commands/tdd.md:40-47`
- Plan-Bestätigungsmechanismus - `commands/plan.md:96`
- Code Review-Schweregrade: CRITICAL, HIGH, MEDIUM - `commands/code-review.md:33`

</details>
