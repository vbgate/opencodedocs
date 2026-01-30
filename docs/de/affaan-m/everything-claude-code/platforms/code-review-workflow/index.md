---
title: "Code-Review: /code-review Workflow | Everything Claude Code"
subtitle: "Code-Review: /code-review Workflow"
sidebarTitle: "Code vor Commit prüfen"
description: "Lernen Sie die Verwendung des /code-review Befehls. Meistern Sie Code-Qualitäts- und Sicherheitsprüfungen mit den code-reviewer und security-reviewer Agents, um Sicherheitslücken und Code-Probleme vor dem Commit zu erkennen."
tags:
  - "code-review"
  - "security"
  - "code-quality"
  - "owasp"
prerequisite:
  - "start-quickstart"
order: 80
---

# Code-Review Workflow: /code-review und Sicherheitsaudit

## Was Sie nach diesem Tutorial können

**Code-Review** ist der Schlüssel zur Sicherstellung von Code-Qualität und Sicherheit. Dieses Tutorial hilft Ihnen:

- ✅ Den `/code-review` Befehl zur automatischen Prüfung von Code-Änderungen zu verwenden
- ✅ Den Unterschied zwischen code-reviewer Agent und security-reviewer Agent zu verstehen
- ✅ Die Sicherheits-Checkliste (OWASP Top 10) zu beherrschen
- ✅ Häufige Sicherheitslücken zu erkennen und zu beheben (SQL-Injection, XSS, hartcodierte Schlüssel usw.)
- ✅ Code-Qualitätsstandards anzuwenden (Funktionsgröße, Dateilänge, Testabdeckung usw.)
- ✅ Die Freigabestandards zu verstehen (CRITICAL, HIGH, MEDIUM, LOW)

## Ihre aktuelle Situation

Sie haben Ihren Code geschrieben und möchten committen, aber:

- ❌ Sie wissen nicht, ob Sicherheitslücken im Code vorhanden sind
- ❌ Sie befürchten, Code-Qualitätsprobleme übersehen zu haben
- ❌ Sie sind sich nicht sicher, ob Sie Best Practices befolgt haben
- ❌ Manuelle Prüfungen sind zeitaufwendig und fehleranfällig
- ❌ Sie möchten Probleme vor dem Commit automatisch erkennen

**Everything Claude Code** löst diese Probleme mit dem Code-Review Workflow:

- **Automatisierte Prüfung**: Der `/code-review` Befehl analysiert automatisch alle Änderungen
- **Spezialisierte Reviews**: Der code-reviewer Agent konzentriert sich auf Code-Qualität, der security-reviewer Agent auf Sicherheit
- **Standardisierte Einstufung**: Probleme werden nach Schweregrad kategorisiert (CRITICAL, HIGH, MEDIUM, LOW)
- **Detaillierte Empfehlungen**: Jedes Problem enthält konkrete Behebungsempfehlungen

## Wann Sie diese Funktion verwenden sollten

**Vor jedem Code-Commit** sollte ein Code-Review durchgeführt werden:

- ✅ Nach Abschluss neuer Funktionen
- ✅ Nach der Behebung von Bugs
- ✅ Nach Code-Refactoring
- ✅ Bei Hinzufügen von API-Endpunkten (security-reviewer erforderlich)
- ✅ Bei Code, der Benutzereingaben verarbeitet (security-reviewer erforderlich)
- ✅ Bei Code mit Authentifizierung/Autorisierung (security-reviewer erforderlich)

::: tip Best Practice
Gewöhnen Sie sich an: Vor jedem `git commit` zuerst `/code-review` ausführen. Bei CRITICAL oder HIGH Problemen zuerst beheben, dann committen.
:::

## 🎒 Vorbereitung

**Was Sie benötigen**:
- Everything Claude Code ist installiert (falls noch nicht, siehe [Quick Start](../../start/quickstart/))
- Einige Code-Änderungen (Sie können zuerst mit `/tdd` etwas Code schreiben)
- Grundlegende Kenntnisse von Git

**Was Sie nicht benötigen**:
- Sie müssen kein Sicherheitsexperte sein (der Agent hilft Ihnen bei der Erkennung)
- Sie müssen sich nicht alle Sicherheits-Best Practices merken (der Agent erinnert Sie daran)

---

## Kernkonzept

Everything Claude Code bietet zwei spezialisierte Review Agents:

### code-reviewer Agent

**Fokus auf Code-Qualität und Best Practices**, prüft:

- **Code-Qualität**: Funktionsgröße (>50 Zeilen), Dateilänge (>800 Zeilen), Verschachtelungstiefe (>4 Ebenen)
- **Fehlerbehandlung**: Fehlende try/catch, console.log Anweisungen
- **Code-Konventionen**: Namenskonventionen, duplizierter Code, unveränderliche Muster
- **Best Practices**: Emoji-Verwendung, TODO/FIXME ohne Ticket, fehlende JSDoc
- **Testabdeckung**: Neue Code ohne Tests

**Anwendungsfall**: Alle Code-Änderungen sollten den code-reviewer durchlaufen.

### security-reviewer Agent

**Fokus auf Sicherheitslücken und Bedrohungen**, prüft:

- **OWASP Top 10**: SQL-Injection, XSS, CSRF, Authentifizierungsumgehung usw.
- **Schlüssellecks**: Hartcodierte API-Keys, Passwörter, Tokens
- **Eingabevalidierung**: Fehlende oder unzureichende Benutzereingabevalidierung
- **Authentifizierung und Autorisierung**: Unzureichende Authentifizierung und Berechtigungsprüfungen
- **Abhängigkeitssicherheit**: Veraltete oder bekannte anfällige Pakete

**Anwendungsfall**: Sicherheitskritischer Code (APIs, Authentifizierung, Zahlungen, Benutzereingaben) muss den security-reviewer durchlaufen.

### Schweregrade der Probleme

| Level | Bedeutung | Blockiert Commit? | Beispiel |
| --- | --- | --- | --- |
| **CRITICAL** | Kritische Sicherheitslücke oder schwerwiegendes Qualitätsproblem | ❌ Muss blockiert werden | Hartcodierter API-Key, SQL-Injection |
| **HIGH** | Wichtiges Sicherheits- oder Code-Qualitätsproblem | ❌ Muss blockiert werden | Fehlende Fehlerbehandlung, XSS-Lücke |
| **MEDIUM** | Mittlere Priorität | ⚠️ Vorsichtig committen möglich | Emoji-Verwendung, fehlende JSDoc |
| **LOW** | Geringfügiges Problem | ✓ Kann später behoben werden | Formatierungsinkonsistenzen, magische Zahlen |

---

## Schritt-für-Schritt: Ihr erstes Code-Review

### Schritt 1: Code-Änderungen erstellen

Verwenden Sie zuerst `/tdd`, um einen einfachen API-Endpunkt zu erstellen (mit einigen Sicherheitsrisiken):

```bash
/tdd
```

Lassen Sie Claude Code eine Benutzer-Login-API erstellen, etwa so:

```typescript
// src/api/login.ts
export async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`  // ❌ SQL-Injection Risiko
  const user = await db.query(query)
  
  if (user.password === password) {  // ❌ Klartext-Passwort-Vergleich
    const token = generateToken(user.id)
    console.log('User logged in:', { email, password })  // ❌ Passwort im Log
    return { token }
  }
}
```

**Warum**
Dieser Code enthält mehrere Sicherheitsrisiken und Code-Qualitätsprobleme, ideal zur Demonstration der Code-Review Funktion.

**Sie sollten sehen**: Die Codedatei wurde erstellt.

---

### Schritt 2: Code-Review ausführen

Führen Sie nun den `/code-review` Befehl aus:

```bash
/code-review
```

**Warum**
`/code-review` ruft automatisch den code-reviewer Agent auf, um alle uncommitteten Änderungen zu prüfen.

**Sie sollten sehen**: Der Agent beginnt mit der Code-Analyse und gibt dann den Review-Bericht aus.

---

### Schritt 3: Review-Bericht anzeigen

Der code-reviewer gibt einen Bericht ähnlich diesem aus:

```markdown
# Code Review Report

## Critical Issues (Fix Immediately)

### 1. [CRITICAL] Hardcoded credentials
**File:** src/api/login.ts:3
**Issue:** Password logging in console
**Fix:** Remove password from logs, only log user ID

```typescript
// ❌ Bad
console.log('User logged in:', { email, password })

// ✓ Good
console.log('User logged in:', { email, userId: user.id })
```

---

### 2. [CRITICAL] SQL injection vulnerability
**File:** src/api/login.ts:2
**Issue:** String concatenation in SQL query
**Fix:** Use parameterized queries

```typescript
// ❌ Bad
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✓ Good
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
```

---

## High Issues (Fix Before Production)

### 3. [HIGH] Plaintext password comparison
**File:** src/api/login.ts:4
**Issue:** Password stored in plaintext
**Fix:** Use bcrypt to hash passwords

```typescript
// ❌ Bad
if (user.password === password) {

// ✓ Good
import bcrypt from 'bcrypt'
const isValid = await bcrypt.compare(password, user.password)
```

---

## Recommendations

1. Add input validation for email format
2. Add rate limiting to prevent brute force attacks
3. Use JWT tokens instead of generating custom tokens

## Approval Status

❌ BLOCKED - 2 CRITICAL issues found

Please fix all CRITICAL and HIGH issues before committing.
```

**Warum**
Der Bericht ist nach Schweregrad kategorisiert, jedes Problem enthält Position, Beschreibung, Behebungsempfehlung und Code-Beispiel.

**Sie sollten sehen**: Einen klaren Review-Bericht, der alle Probleme und Behebungsempfehlungen aufzeigt.

---

### Schritt 4: Probleme beheben

Beheben Sie die Probleme gemäß dem Bericht:

```typescript
// src/api/login.ts
import bcrypt from 'bcrypt'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function loginUser(input: unknown) {
  // Eingabevalidierung
  const validated = LoginSchema.parse(input)
  
  // Parametrisierte Abfrage (SQL-Injection verhindern)
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.email)
    .single()
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // Hash-Passwort-Vergleich
  const isValid = await bcrypt.compare(validated.password, user.password_hash)
  
  if (isValid) {
    const token = generateToken(user.id)
    console.log('User logged in:', { email: validated.email, userId: user.id })
    return { token }
  }
  
  throw new Error('Invalid credentials')
}
```

**Warum**
Alle CRITICAL und HIGH Probleme beheben, Eingabevalidierung und Hash-Passwort-Vergleich hinzufügen.

**Sie sollten sehen**: Der Code wurde aktualisiert, Sicherheitsrisiken wurden beseitigt.

---

### Schritt 5: Erneute Prüfung

Führen Sie `/code-review` erneut aus:

```bash
/code-review
```

**Warum**
Überprüfen, ob alle Probleme behoben wurden und der Code committet werden kann.

**Sie sollten sehen**: Einen Genehmigungsbericht ähnlich diesem:

```markdown
# Code Review Report

## Summary

- **Critical Issues:** 0 ✓
- **High Issues:** 0 ✓
- **Medium Issues:** 1 ⚠️
- **Low Issues:** 1 💡

## Medium Issues (Fix When Possible)

### 1. [MEDIUM] Missing JSDoc for public API
**File:** src/api/login.ts:9
**Issue:** loginUser function missing documentation
**Fix:** Add JSDoc comments

```typescript
/**
 * Authenticates a user with email and password
 * @param input - Login credentials (email, password)
 * @returns Object with JWT token
 * @throws Error if credentials invalid
 */
export async function loginUser(input: unknown) {
```

---

## Low Issues (Consider Fixing)

### 2. [LOW] Add rate limiting
**File:** src/api/login.ts:9
**Issue:** Login endpoint lacks rate limiting
**Fix:** Add express-rate-limit middleware

```typescript
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per window
})

app.post('/api/login', loginLimiter, loginUser)
```

---

## Approval Status

✅ APPROVED - No CRITICAL or HIGH issues

**Note:** Medium and Low issues can be fixed in follow-up commits.
```

**Sie sollten sehen**: Das Review wurde genehmigt, der Code kann committet werden.

---

### Schritt 6: Sicherheits-Spezialreview (optional)

Wenn Ihr Code API-Endpunkte, Authentifizierung, Zahlungen oder andere sicherheitskritische Funktionen enthält, können Sie speziell den security-reviewer aufrufen:

```bash
/security-reviewer
```

**Warum**
Der security-reviewer führt eine tiefere OWASP Top 10 Analyse durch und prüft weitere Sicherheitslücken-Muster.

**Sie sollten sehen**: Einen detaillierten Sicherheits-Review-Bericht, einschließlich OWASP-Analyse, Abhängigkeitslücken-Prüfung, Sicherheits-Tool-Empfehlungen usw.

---

## Checkliste ✅

Nach Abschluss der obigen Schritte sollten Sie:

- ✅ Den `/code-review` Befehl ausführen können
- ✅ Die Struktur und den Inhalt des Review-Berichts verstehen
- ✅ Code-Probleme gemäß dem Bericht beheben können
- ✅ Wissen, dass CRITICAL und HIGH Probleme behoben werden müssen
- ✅ Den Unterschied zwischen code-reviewer und security-reviewer verstehen
- ✅ Die Gewohnheit entwickelt haben, vor dem Commit zu reviewen

---

## Häufige Fehler

### Häufiger Fehler 1: Code-Review überspringen

**Problem**: Denken, der Code ist einfach, direkt committen, ohne Review.

**Konsequenz**: Sicherheitslücken können übersehen werden, CI/CD verweigert oder Produktionsprobleme verursachen.

**Richtige Vorgehensweise**: Gewöhnen Sie sich an, vor jedem Commit `/code-review` auszuführen.

---

### Häufiger Fehler 2: MEDIUM Probleme ignorieren

**Problem**: MEDIUM Probleme sehen und ignorieren, sich ansammeln lassen.

**Konsequenz**: Code-Qualität sinkt, technische Schulden akkumulieren, später schwer zu warten.

**Richtige Vorgehensweise**: Obwohl MEDIUM Probleme den Commit nicht blockieren, sollten sie in angemessener Zeit behoben werden.

---

### Häufiger Fehler 3: SQL-Injection manuell beheben

**Problem**: Eigene String-Escaping schreiben, statt parametrisierte Abfragen zu verwenden.

**Konsequenz**: Escaping unvollständig, weiterhin SQL-Injection Risiko.

**Richtige Vorgehensweise**: Immer ORM oder parametrisierte Abfragen verwenden, niemals SQL manuell zusammensetzen.

---

### Häufiger Fehler 4: Beide Reviewer verwechseln

**Problem**: Für allen Code nur code-reviewer ausführen, security-reviewer ignorieren.

**Konsequenz**: Sicherheitslücken können übersehen werden, besonders bei APIs, Authentifizierung, Zahlungen.

**Richtige Vorgehensweise**:
- Normaler Code: code-reviewer ausreichend
- Sicherheitskritischer Code: Muss zusätzlich security-reviewer durchlaufen

---

## Zusammenfassung

**Der Code-Review Workflow** ist eine der Kernfunktionen von Everything Claude Code:

| Funktion | Agent | Prüfinhalt | Schweregrad |
| --- | --- | --- | --- |
| **Code-Qualitäts-Review** | code-reviewer | Funktionsgröße, Fehlerbehandlung, Best Practices | HIGH/MEDIUM/LOW |
| **Sicherheits-Review** | security-reviewer | OWASP Top 10, Schlüssellecks, Injection-Lücken | CRITICAL/HIGH/MEDIUM |

**Wichtige Punkte**:

1. **Vor jedem Commit** `/code-review` ausführen
2. **CRITICAL/HIGH Probleme** müssen vor dem Commit behoben werden
3. **Sicherheitskritischer Code** muss den security-reviewer durchlaufen
4. **Review-Bericht** enthält detaillierte Positionen und Behebungsempfehlungen
5. **Gewohnheit entwickeln**: Review → Beheben → Erneutes Review → Commit

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Hooks Automation](../../advanced/hooks-automation/)**.
>
> Sie werden lernen:
> - Was Hooks sind und wie Entwicklungsprozesse automatisiert werden
> - Die Verwendung von 15+ Automatisierungs-Hooks
> - Wie Hooks an Projektanforderungen angepasst werden
> - Anwendungsszenarien für SessionStart, SessionEnd, PreToolUse usw.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Position</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**Wichtige Konstanten**:
- Funktionsgrößenlimit: 50 Zeilen (code-reviewer.md:47)
- Dateigrößenlimit: 800 Zeilen (code-reviewer.md:48)
- Verschachtelungstiefenlimit: 4 Ebenen (code-reviewer.md:49)

**Wichtige Funktionen**:
- `/code-review`: Ruft code-reviewer Agent für Code-Qualitäts-Review auf
- `/security-reviewer`: Ruft security-reviewer Agent für Sicherheitsaudit auf
- `git diff --name-only HEAD`: Ruft uncommittete Änderungsdateien ab (code-review.md:5)

**Freigabestandards** (code-reviewer.md:90-92):
- ✅ Approve: Keine CRITICAL oder HIGH Probleme
- ⚠️ Warning: Nur MEDIUM Probleme (vorsichtig mergen möglich)
- ❌ Block: CRITICAL oder HIGH Probleme gefunden

</details>
