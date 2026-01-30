---
title: "Verifikationszyklus: Checkpoints und Evals | Everything Claude Code"
subtitle: "Verifikationszyklus: Checkpoints und Evals"
sidebarTitle: "PR-Checks vor dem Commit"
description: "Lernen Sie den Verifikationszyklus-Mechanismus von Everything Claude Code. Meistern Sie das Checkpoint-Management, die Evals-Definition und kontinuierliche Verifikation, speichern Sie den Status mit Checkpoints und nutzen Sie Evals zur Sicherstellung der Codequalität."
tags:
  - "verification"
  - "checkpoint"
  - "evals"
  - "quality-gates"
prerequisite:
  - "platforms-tdd-workflow"
order: 120
---

# Verifikationszyklus: Checkpoints und Evals

## Was Sie nach diesem Tutorial können

Nach dem Erlernen des Verifikationszyklus können Sie:

- Mit `/checkpoint` Arbeitszustände speichern und wiederherstellen
- Mit `/verify` umfassende Codequalitätsprüfungen durchführen
- Das Eval-Driven Development (EDD)-Konzept beherrschen, Evals definieren und ausführen
- Einen kontinuierlichen Verifikationszyklus etablieren, um die Codequalität während der Entwicklung zu gewährleisten

## Ihre aktuelle Problematik

Sie haben gerade eine Funktion abgeschlossen, aber Sie scheuen sich, einen PR einzureichen, weil:

- Sie nicht sicher sind, ob Sie bestehende Funktionen beschädigt haben
- Sie befürchten, dass die Testabdeckung gesunken ist
- Sie vergessen haben, was das ursprüngliche Ziel war, und nicht wissen, ob Sie vom Kurs abgewichen sind
- Sie zu einem stabilen Zustand zurückkehren möchten, aber keine Aufzeichnung haben

Wenn es einen Mechanismus gäbe, der an kritischen Punkten „Fotos macht" und während der Entwicklung kontinuierlich verifiziert, wären diese Probleme gelöst.

## Wann Sie diesen Ansatz verwenden

- **Vor dem Start einer neuen Funktion**: Checkpoint erstellen, Ausgangszustand erfassen
- **Nach Abschluss eines Meilensteins**: Fortschritt speichern, für Rollback und Vergleich
- **Vor dem Einreichen eines PR**: Umfassende Verifikation durchführen, Codequalität sicherstellen
- **Beim Refactoring**: Häufig verifizieren, um bestehende Funktionen nicht zu beschädigen
- **Bei Teamarbeit**: Checkpoints teilen, Arbeitszustände synchronisieren

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen

Dieses Tutorial setzt voraus, dass Sie:

- ✅ Das Tutorial [TDD-Workflow](../../platforms/tdd-workflow/) abgeschlossen haben
- ✅ Grundlegende Git-Operationen beherrschen
- ✅ Wissen, wie man die grundlegenden Befehle von Everything Claude Code verwendet

:::

---

## Kernkonzept

Der **Verifikationszyklus** ist ein Qualitätssicherungsmechanismus, der den Zyklus „Code schreiben → Testen → Verifizieren" in einen systematischen Prozess verwandelt.

### Dreistufiges Verifikationssystem

Everything Claude Code bietet drei Verifikationsstufen:

| Stufe | Mechanismus | Zweck | Wann verwenden |
| --- | --- | --- | --- |
| **Echtzeit-Verifikation** | PostToolUse Hooks | Sofortiges Erkennen von Typfehlern, console.log usw. | Nach jedem Tool-Aufruf |
| **Periodische Verifikation** | `/verify`-Befehl | Umfassende Prüfung: Build, Typen, Tests, Sicherheit | Alle 15 Minuten oder nach größeren Änderungen |
| **Meilenstein-Verifikation** | `/checkpoint` | Zustandsdifferenzen vergleichen, Qualitätstrends verfolgen | Nach Meilensteinen, vor PR-Einreichung |

### Checkpoint: Der „Speicherpunkt" des Codes

Checkpoint macht an kritischen Punkten „Fotos":

- Git SHA aufzeichnen
- Testdurchlaufquote erfassen
- Codeabdeckung aufzeichnen
- Zeitstempel speichern

Bei der Verifikation können Sie den aktuellen Zustand mit einem beliebigen Checkpoint vergleichen.

### Evals: Die „Unit-Tests" der KI-Entwicklung

**Eval-Driven Development (EDD)** behandelt Evals als Unit-Tests für die KI-gestützte Entwicklung:

1. **Erfolgsstandards zuerst definieren** (Evals schreiben)
2. **Dann Code schreiben** (Funktion implementieren)
3. **Evals kontinuierlich ausführen** (Richtigkeit verifizieren)
4. **Regression verfolgen** (Sicherstellen, dass bestehende Funktionen nicht beschädigt werden)

Dies entspricht dem TDD-Konzept (Test-Driven Development), ist jedoch auf die KI-gestützte Entwicklung ausgerichtet.

---

## Anleitung: Checkpoint verwenden

### Schritt 1: Initialen Checkpoint erstellen

Vor dem Start einer neuen Funktion zuerst einen Checkpoint erstellen:

```bash
/checkpoint create "feature-start"
```

**Warum**
Ausgangszustand erfassen, um später vergleichen zu können.

**Sie sollten sehen**:

```
VERIFICATION: Running quick checks...
Build:    OK
Types:    OK

CHECKPOINT CREATED: feature-start
Time:     2026-01-25-14:30
Git SHA:  abc1234
Logged to: .claude/checkpoints.log
```

Checkpoint wird:
1. Zuerst `/verify quick` ausführen (nur Build und Typen prüfen)
2. Ein Git-Stash oder -Commit erstellen (benannt: `checkpoint-feature-start`)
3. In `.claude/checkpoints.log` aufzeichnen

### Schritt 2: Kernfunktion implementieren

Mit dem Schreiben von Code beginnen und die Kernlogik implementieren.

### Schritt 3: Meilenstein-Checkpoint erstellen

Nach Abschluss der Kernfunktion:

```bash
/checkpoint create "core-done"
```

**Warum**
Meilenstein erfassen, für Rollback.

**Sie sollten sehen**:

```
CHECKPOINT CREATED: core-done
Time:     2026-01-25-16:45
Git SHA:  def5678
Logged to: .claude/checkpoints.log
```

### Schritt 4: Verifizieren und vergleichen

Verifizieren, ob der aktuelle Zustand vom Ziel abgewichen ist:

```bash
/checkpoint verify "feature-start"
```

**Warum**
Die Änderung der Qualitätsindikatoren vom Anfang bis jetzt vergleichen.

**Sie sollten sehen**:

```
CHECKPOINT COMPARISON: feature-start
=====================================
Files changed: 12
Tests: +25 passed / -0 failed
Coverage: +15% / -2% (from 60% to 75%)
Build: PASS
Status: ✅ Quality improved
```

### Schritt 5: Alle Checkpoints anzeigen

Verlauf der Checkpoints anzeigen:

```bash
/checkpoint list
```

**Sie sollten sehen**:

```
CHECKPOINTS HISTORY
==================
Name           | Time             | Git SHA  | Status
---------------|------------------|----------|--------
feature-start  | 2026-01-25-14:30 | abc1234  | behind
core-done      | 2026-01-25-16:45 | def5678  | current
```

**Checkpunkt ✅**: Verständnis verifizieren

- Führt Checkpoint automatisch `/verify quick` aus? ✅ Ja
- In welcher Datei wird Checkpoint aufgezeichnet? ✅ `.claude/checkpoints.log`
- Was vergleicht `/checkpoint verify`? ✅ Dateiänderungen, Testdurchlaufquote, Abdeckung

---

## Anleitung: Verify-Befehl verwenden

### Schritt 1: Schnellverifikation ausführen

Während der Entwicklung häufig Schnellverifikation ausführen:

```bash
/verify quick
```

**Warum**
Nur Build und Typen prüfen, schnellste Geschwindigkeit.

**Sie sollten sehen**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK

Ready for next task: YES
```

### Schritt 2: Vollständige Verifikation ausführen

Vor dem Einreichen eines PR vollständige Prüfung durchführen:

```bash
/verify full
```

**Warum**
Alle Qualitätsgates umfassend prüfen.

**Sie sollten sehen**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK (2 warnings)
Tests:    120/125 passed, 76% coverage
Secrets:  OK
Logs:     3 console.logs found in src/

Ready for PR: NO

Issues to Fix:
1. Remove console.log statements before PR
    Found in: src/utils/logger.ts:15, src/api/client.ts:23, src/ui/button.ts:8
2. Increase test coverage from 76% to 80% (target)
    Missing coverage in: src/components/Form.tsx
```

### Schritt 3: Pre-PR-Verifikation ausführen

Strengste Prüfung, einschließlich Sicherheitsscan:

```bash
/verify pre-pr
```

**Sie sollten sehen**:

```
VERIFICATION: FAIL

Build:    OK
Types:    OK (1 error)
Lint:     OK
Tests:    120/125 passed, 76% coverage
Secrets:  ❌ FOUND (2 API keys)
Logs:     3 console.logs

Security Issues Found:
1. Hardcoded API key in src/api/config.ts:10
2. Secret key in .env.example

Ready for PR: NO

Critical Issues:
1. Remove hardcoded secrets
2. Fix type error in src/components/Form.tsx:45
3. Remove console.logs
4. Increase coverage to 80%
```

### Schritt 4: Nach dem Beheben von Problemen erneut verifizieren

Nach dem Beheben von Problemen Verifikation erneut ausführen:

```bash
/verify full
```

**Sie sollten sehen**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK
Tests:    125/125 passed, 81% coverage
Secrets:  OK
Logs:     OK

Ready for PR: YES
```

**Checkpunkt ✅**: Verständnis verifizieren

- Was prüft `/verify quick` nur? ✅ Build und Typen
- Was prüft `/verify full`? ✅ Build, Typen, Lint, Tests, Secrets, Console.log, Git-Status
- Welcher Verifikationsmodus enthält Sicherheitsscan? ✅ `pre-pr`

---

## Anleitung: Evals verwenden (Eval-Driven Development)

### Schritt 1: Evals definieren (vor dem Schreiben von Code)

**Bevor Sie mit dem Coden beginnen, Erfolgsstandards definieren**:

```markdown
## EVAL: user-authentication

### Capability Evals
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

### Regression Evals
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

**Warum**
Erfolgsstandards zuerst definieren, zwingt zum Nachdenken darüber, was „Fertig" bedeutet.

Speichern unter: `.claude/evals/user-authentication.md`

### Schritt 2: Funktion implementieren

Entsprechend der Evals Code schreiben.

### Schritt 3: Capability Evals ausführen

Testen, ob die neue Funktion den Evals entspricht:

```markdown
[CERTAIN CAPABILITY EVAL: user-authentication]

Test 1: User can register with email/password
Task: Call registration API with valid credentials
Expected: User account created, token returned
Actual: PASS

Test 2: User can login with valid credentials
Task: Call login API with registered credentials
Expected: JWT token returned
Actual: PASS

Test 3: Invalid credentials rejected
Task: Call login API with wrong password
Expected: 401 Unauthorized with error message
Actual: PASS

Overall: 3/3 passed
```

### Schritt 4: Regression Evals ausführen

Sicherstellen, dass bestehende Funktionen nicht beschädigt werden:

```bash
npm test -- --testPathPattern="existing"
```

**Sie sollten sehen**:

```
PASS  existing/auth.test.ts
PASS  existing/api.test.ts
PASS  existing/db.test.ts

All regression tests: 15/15 passed
```

### Schritt 5: Eval-Bericht erstellen

Ergebnisse zusammenfassen:

```markdown
EVAL REPORT: user-authentication
=================================

Capability Evals:
  register-user:       PASS (pass@1)
  login-user:          PASS (pass@2)
  reject-invalid:      PASS (pass@1)
  session-persistence: PASS (pass@1)
  logout-clears:       PASS (pass@1)
  Overall:             5/5 passed

Regression Evals:
  public-routes:       PASS
  api-responses:       PASS
  db-schema:           PASS
  Overall:             3/3 passed

Metrics:
  pass@1: 80% (4/5)
  pass@3: 100% (5/5)
  pass^3: 100% (3/3)

Status: READY FOR REVIEW
```

**Checkpunkt ✅**: Verständnis verifizieren

- Wann sollten Evals definiert werden? ✅ Vor dem Schreiben von Code
- Was ist der Unterschied zwischen Capability Evals und Regression Evals? ✅ Erstere testen neue Funktionen, letztere stellen sicher, dass bestehende Funktionen nicht beschädigt werden
- Was bedeutet pass@3? ✅ Erfolgswahrscheinlichkeit innerhalb von 3 Versuchen

---

## Fallstricke und Hinweise

### Fallstrick 1: Checkpoint erstellen vergessen

**Problem**: Nach einiger Entwicklung möchten Sie zu einem Zustand zurückkehren, aber es gibt keine Aufzeichnung.

**Lösung**: Vor dem Start jeder neuen Funktion einen Checkpoint erstellen:

```bash
# Gute Gewohnheit: Vor dem Start einer neuen Funktion
/checkpoint create "feature-name-start"

# Gute Gewohnheit: Jeder Meilenstein
/checkpoint create "phase-1-done"
/checkpoint create "phase-2-done"
```

### Fallstrick 2: Evals-Definition zu vage

**Problem**: Evals sind zu vage geschrieben, um zu verifizieren.

**Falsches Beispiel**:
```markdown
- [ ] Benutzer kann sich anmelden
```

**Richtiges Beispiel**:
```markdown
- [ ] User can login with valid credentials
  Task: POST /api/login with email="test@example.com", password="Test123!"
  Expected: HTTP 200 with JWT token in response body
  Actual: ___________
```

### Fallstrick 3: Verifikation nur vor dem PR-Einreichen ausführen

**Problem**: Probleme werden erst vor dem PR entdeckt, Behebung ist teuer.

**Lösung**: Kontinuierliche Verifikationsgewohnheit etablieren:

```
Alle 15 Minuten ausführen: /verify quick
Nach jeder Funktionsfertigstellung: /checkpoint create "milestone"
Vor dem PR: /verify pre-pr
```

### Fallstrick 4: Evals werden nicht aktualisiert

**Problem**: Nach Änderungen der Anforderungen sind Evals veraltet, Verifikation ist unwirksam.

**Lösung**: Evals sind „Code erster Klasse", bei Anforderungsänderungen同步 aktualisieren:

```bash
# Anforderungsänderung → Evals aktualisieren → Code aktualisieren
1. .claude/evals/feature-name.md ändern
2. Code gemäß neuen Evals ändern
3. Evals erneut ausführen
```

---

## Zusammenfassung dieser Lektion

Der Verifikationszyklus ist eine systematische Methode zur Aufrechterhaltung der Codequalität:

| Mechanismus | Funktion | Verwendungshäufigkeit |
| --- | --- | --- |
| **PostToolUse Hooks** | Echtzeit-Fehlererkennung | Nach jedem Tool-Aufruf |
| **`/verify`** | Periodische umfassende Prüfung | Alle 15 Minuten |
| **`/checkpoint`** | Meilensteinaufzeichnung und -vergleich | Jede Funktionsphase |
| **Evals** | Funktionsverifikation und Regressionstests | Jede neue Funktion |

Kernprinzipien:
1. **Zuerst definieren, dann implementieren** (Evals)
2. **Häufig verifizieren, kontinuierlich verbessern** (`/verify`)
3. **Meilensteine aufzeichnen, für Rollback** (`/checkpoint`)

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Benutzerdefinierte Rules: Projektspezifische Standards erstellen](../custom-rules/)**.
>
> Sie werden lernen:
> - Wie man benutzerdefinierte Rules-Dateien erstellt
> - Rule-Dateiformat und Checklisten-Schreibweise
> - Projektspezifische Sicherheitsregeln definieren
> - Teamstandards in den Code-Review-Prozess integrieren

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Position</strong></summary>

> Aktualisierungsdatum: 2026-01-25

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Checkpoint-Befehlsdefinition | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify-Befehlsdefinition | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Verification Loop Skill | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| Eval Harness Skill | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |

**Wichtige Prozesse**:
- Checkpoint-Erstellungsprozess: Zuerst `/verify quick` ausführen → Git-Stash/-Commit erstellen → In `.claude/checkpoints.log` aufzeichnen
- Verify-Verifikationsprozess: Build Check → Type Check → Lint Check → Test Suite → Console.log Audit → Git Status
- Eval-Workflow: Define (Evals definieren) → Implement (Code implementieren) → Evaluate (Evals ausführen) → Report (Bericht erstellen)

**Wichtige Parameter**:
- `/checkpoint [create|verify|list] [name]` - Checkpoint-Operation
- `/verify [quick|full|pre-commit|pre-pr]` - Verifikationsmodus
- pass@3 - Ziel für Erfolg innerhalb von 3 Versuchen (>90%)
- pass^3 - 3 aufeinanderfolgende Erfolge (100%, für kritische Pfade)

</details>
