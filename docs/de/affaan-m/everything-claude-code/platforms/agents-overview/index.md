---
title: "Agents: 9 Spezialisierte Agenten | Everything Claude Code"
sidebarTitle: "Richtigen Agent wählen, Effizienz verdoppeln"
subtitle: "Agents: 9 Spezialisierte Agenten | Everything Claude Code"
description: "Lernen Sie die 9 spezialisierten Agents von Everything Claude Code kennen, meistern Sie Aufrufmethoden für verschiedene Szenarien und steigern Sie Effizienz und Qualität der KI-unterstützten Entwicklung."
tags:
  - "agents"
  - "ki-assistent"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 60
---

# Kern-Agents im Detail: 9 Spezialisierte Sub-Agenten

## Was Sie nach dem Lernen tun können

- Verstehen der 9 spezialisierten Agents und ihrer Einsatzszenarien
- Wissen, welchen Agent für welche Entwicklungsaufgabe aufzurufen
- Beherrschen der Zusammenarbeit zwischen Agents und Aufbau effizienter Entwicklungsworkflows
- Vermeiden der Einschränkungen "generischer KI" durch Nutzung spezialisierter Agents

## Ihre aktuelle Herausforderung

- Lassen Claude oft Aufgaben erledigen, erhalten aber Antworten, die nicht professionell oder tiefgehend genug sind
- Unsicher, wann `/plan`, `/tdd`, `/code-review` etc. verwendet werden sollen
- Finden KI-Ratschläge zu allgemein, mangeln an Spezifität
- Wünschen sich einen systematisierten Entwicklungsworkflow, wissen aber nicht, wie er organisiert werden soll

## Wann Sie diese Technik verwenden sollten

Wenn Sie folgende Aufgaben erledigen müssen, wird Ihnen dieses Tutorial helfen:
- Planung vor komplexer Funktionsentwicklung
- Schreiben neuer Funktionen oder Beheben von Bugs
- Code-Review und Sicherheitsaudit
- Beheben von Build-Fehlern
- End-to-End-Tests
- Code-Refactoring und -Bereinigung
- Aktualisierung von Dokumentation

## Kernidee

Everything Claude Code bietet 9 spezialisierte Agents, jeder Agent konzentriert sich auf einen bestimmten Bereich. Genau wie Sie in einem echten Team verschiedene Rollen mit Spezialisten suchen, sollten verschiedene Entwicklungsaufgaben verschiedene Agents aufrufen.

::: info Agent vs Command
- **Agent**: Professioneller KI-Assistent mit domänenspezifischem Wissen und Tools
- **Command**: Shortcut zum schnellen Aufrufen eines Agents oder Ausführen einer bestimmten Aktion

Beispiel: `/tdd` ruft den `tdd-guide` Agent auf, um den Test-Driven Development Workflow auszuführen.
:::

### 9 Agents Übersicht

| Agent | Rolle | Typische Szenarien | Kernkompetenzen |
| --- | --- | --- | --- |
| **planner** | Planungsexperte | Planerstellung vor komplexer Funktionsentwicklung | Bedarfsanalyse, Architekturreview, Schrittzerlegung |
| **architect** | Architekt | Systemdesign und Technologieentscheidungen | Architekturevaluation, Pattern-Empfehlung, Trade-off-Analyse |
| **tdd-guide** | TDD-Mentor | Schreiben von Tests und Implementieren von Funktionen | Red-Green-Refactor-Workflow, Coverage-Garantie |
| **code-reviewer** | Code-Reviewer | Überprüfung der Codequalität | Qualitäts-, Sicherheits-, Wartbarkeitsprüfung |
| **security-reviewer** | Sicherheitsauditor | Erkennung von Sicherheitslücken | OWASP Top 10, Key-Leakage, Injection-Schutz |
| **build-error-resolver** | Build-Fehler-Beheber | Behebung von TypeScript/Build-Fehlern | Minimale Fixes, Typinferenz |
| **e2e-runner** | E2E-Test-Experte | End-to-End-Test-Management | Playwright-Tests, Flaky-Management, Artefakte |
| **refactor-cleaner** | Refactoring-Cleaner | Löschen von totem Code und Duplikaten | Abhängigkeitsanalyse, sicheres Löschen, Dokumentation |
| **doc-updater** | Dokumentations-Updater | Generieren und Aktualisieren von Dokumentation | Codemap-Generierung, AST-Analyse |

## Detaillierte Beschreibung

### 1. Planner - Planungsexperte

**Wann zu verwenden**: Wenn komplexe Funktionen, Architekturänderungen oder große Refactorings implementiert werden müssen.

::: tip Best Practice
Erstellen Sie vor dem Schreiben von Code mit `/plan` einen Implementierungsplan. Dies hilft, Abhängigkeiten zu vermeiden, potenzielle Risiken zu erkennen und eine angemessene Umsetzungsreihenfolge festzulegen.
:::

**Kernkompetenzen**:
- Bedarfsanalyse und -klärung
- Architekturreview und Abhängigkeitserkennung
- Detaillierte Zerlegung von Implementierungsschritten
- Risikoerkennung und -minderung
- Teststrategieplanung

**Ausgabeformat**:
```markdown
# Implementierungsplan: [Feature-Name]

## Übersicht
[2-3 Sätze Zusammenfassung]

## Anforderungen
- [Anforderung 1]
- [Anforderung 2]

## Architekturänderungen
- [Änderung 1: Dateipfad und Beschreibung]
- [Änderung 2: Dateipfad und Beschreibung]

## Implementierungsschritte

### Phase 1: [Phasenname]
1. **[Schrittname]** (Datei: pfad/zu/datei.ts)
   - Aktion: Spezifische Operation
   - Warum: Grund
   - Abhängigkeiten: Keine / Benötigt Schritt X
   - Risiko: Niedrig/Mittel/Hoch

## Teststrategie
- Unit-Tests: [Zu testende Dateien]
- Integrationstests: [Zu testende Prozesse]
- E2E-Tests: [Zu testende User-Journeys]

## Risiken & Minderung
- **Risiko**: [Beschreibung]
  - Minderung: [Lösung]

## Erfolgskriterien
- [ ] Kriterium 1
- [ ] Kriterium 2
```

**Beispielszenarien**:
- Hinzufügen neuer API-Endpunkte (benötigt DB-Migration, Cache-Update, Dokumentation)
- Refactoring von Kernmodulen (beeinflusst mehrere Abhängigkeiten)
- Hinzufügen neuer Funktionen (umfasst Frontend, Backend, Datenbank)

### 2. Architect - Architekt

**Wann zu verwenden**: Wenn Systemarchitektur entworfen, Technologieoptionen evaluiert oder Architekturentscheidungen getroffen werden müssen.

**Kernkompetenzen**:
- Systemarchitektur-Design
- Technologie-Trade-off-Analyse
- Design Pattern-Empfehlungen
- Skalierbarkeitsplanung
- Sicherheitsaspekte

**Architekturprinzipien**:
- **Modularität**: Einzelverantwortung, hohe Kohäsion, lose Kopplung
- **Skalierbarkeit**: Horizontale Skalierung, zustandsloses Design
- **Wartbarkeit**: Klare Struktur, konsistente Muster
- **Sicherheit**: Verteidigung in Tiefe, minimaler Zugriff
- **Leistung**: Effiziente Algorithmen, minimale Netzwerkrequests

**Häufige Muster**:

**Frontend-Muster**:
- Komponentenkomposition, Container/Presenter-Muster, Custom Hooks, Context für globalen State, Code-Splitting

**Backend-Muster**:
- Repository-Pattern, Service-Layer, Middleware-Pattern, Event-Driven-Architektur, CQRS

**Daten-Muster**:
- Normalisierte Datenbank, Denormalisierung für Leseleistung, Event Sourcing, Cache-Layer, Eventual Consistency

**Architektur Decision Record (ADR) Format**:
```markdown
# ADR-001: Verwendung von Redis zur Speicherung semantischer Suchvektoren

## Kontext
Benötigt Speicherung und Abfrage von 1536-dimensionalen Embedding-Vektoren für semantische Marktsuche.

## Entscheidung
Verwendung der Vektorsuchfunktionalität von Redis Stack.

## Konsequenzen

### Positiv
- Schnelle Vektor-Ähnlichkeitssuche (<10ms)
- Integrierte KNN-Algorithmen
- Einfache Bereitstellung
- Gute Leistung (bis 10K Vektoren)

### Negativ
- Speicherbasiert (hohe Kosten bei großen Datensätzen)
- Single Point of Failure (kein Cluster)
- Nur Kosinus-Ähnlichkeit unterstützt

### Betrachtete Alternativen
- **PostgreSQL pgvector**: Langsamer, aber persistent
- **Pinecone**: Managed Service, höhere Kosten
- **Weaviate**: Mehr Features, komplexere Einrichtung

## Status
Angenommen

## Datum
2025-01-15
```

### 3. TDD Guide - TDD-Mentor

**Wann zu verwenden**: Beim Schreiben neuer Funktionen, Beheben von Bugs, Refactoring von Code.

::: warning Kernprinzip
TDD Guide verlangt, dass **zuerst Tests** geschrieben werden, dann die Funktionalität implementiert wird, um 80%+ Testabdeckung sicherzustellen.
:::

**TDD-Workflow**:

**Schritt 1: Test zuerst schreiben (RED)**
```typescript
describe('searchMarkets', () => {
  it('returns semantically similar markets', async () => {
    const results = await searchMarkets('election')

    expect(results).toHaveLength(5)
    expect(results[0].name).toContain('Trump')
    expect(results[1].name).toContain('Biden')
  })
})
```

**Schritt 2: Test ausführen (Verifizieren des Scheiterns)**
```bash
npm test
# Test sollte fehlschlagen - wir haben noch nicht implementiert
```

**Schritt 3: Minimale Implementierung schreiben (GREEN)**
```typescript
export async function searchMarkets(query: string) {
  const embedding = await generateEmbedding(query)
  const results = await vectorSearch(embedding)
  return results
}
```

**Schritt 4: Test ausführen (Verifizieren des Erfolgs)**
```bash
npm test
# Test sollte jetzt bestehen
```

**Schritt 5: Refactoring (IMPROVE)**
- Doppelten Code entfernen
- Benennung verbessern
- Leistung optimieren
- Lesbarkeit erhöhen

**Schritt 6: Abdeckung verifizieren**
```bash
npm run test:coverage
# 80%+ Abdeckung verifizieren
```

**Erforderliche Testtypen**:

1. **Unit-Tests** (Pflicht): Einzelne Funktionen testen
2. **Integrationstests** (Pflicht): API-Endpunkte und Datenbankoperationen testen
3. **E2E-Tests** (Kritische Prozesse): Vollständige User-Journeys testen

**Zu deckende Grenzfälle**:
- Null/Undefined: Was passiert bei null-Eingabe?
- Leer: Was bei leerem Array/String?
- Ungültiger Typ: Was bei falschem Typ?
- Grenzen: Min/Max-Werte
- Fehler: Netzwerkfehler, Datenbankfehler
- Race Conditions: Gleichzeitige Operationen
- Große Daten: Leistung bei 10k+ Elementen
- Spezialzeichen: Unicode, Emoji, SQL-Zeichen

### 4. Code Reviewer - Code-Reviewer

**Wann zu verwenden**: Sofort nach dem Schreiben oder Ändern von Code.

::: tip Pflichtverwendung
Code Reviewer ist ein **zwingend zu verwendender** Agent, alle Code-Änderungen müssen durch seine Überprüfung.
:::

**Review-Checkliste**:

**Sicherheitsprüfung (KRITISCH)**:
- Hartkodierte Credentials (API-Keys, Passwörter, Tokens)
- SQL-Injection-Risiken (String-Verkettung in Queries)
- XSS-Schwachstellen (nicht-escapede Benutzereingaben)
- Fehlende Eingabevalidierung
- Unsichere Abhängigkeiten (veraltet, verwundbar)
- Pfad-Traversal-Risiken (benutzerkontrollierte Dateipfade)
- CSRF-Schwachstellen
- Authentifizierungsumgehung

**Codequalität (HOCH)**:
- Große Funktionen (>50 Zeilen)
- Große Dateien (>800 Zeilen)
- Tiefe Verschachtelung (>4 Ebenen)
- Fehlende Fehlerbehandlung (try/catch)
- console.log-Anweisungen
- Änderungsmuster
- Fehlende Tests für neuen Code

**Leistung (MITTEL)**:
- Ineffiziente Algorithmen (O(n²) wenn O(n log n) möglich)
- Unnötige Re-Renderings in React
- Fehlende Memoization
- Große Bundle-Größen
- Unoptimierte Bilder
- Fehlende Caching
- N+1 Queries

**Best Practices (MITTEL)**:
- Emoji in Code/Kommentaren
- TODO/FIXME ohne verknüpftes Ticket
- Fehlende JSDoc für öffentliche APIs
- Barrierefreiheitsprobleme (fehlende ARIA-Labels, schlechter Kontrast)
- Schlechte Variablenbenennung (x, tmp, data)
- Unkommentierte Magic Numbers
- Inkonsistente Formatierung

**Review-Ausgabeformat**:
```markdown
[KRITISCH] Hartkodierter API-Key
Datei: src/api/client.ts:42
Problem: API-Key im Quellcode exponiert
Fix: In Umgebungsvariable verschieben

const apiKey = "sk-abc123";  // ❌ Schlecht
const apiKey = process.env.API_KEY;  // ✓ Gut
```

**Genehmigungskriterien**:
- ✅ Genehmigt: Keine KRITISCHEN oder HOCHEN Probleme
- ⚠️ Warnung: Nur MITTELERE Probleme (kann mit Vorsicht gemerged werden)
- ❌ Blockiert: KRITISCHE oder HOHE Probleme gefunden

### 5. Security Reviewer - Sicherheitsauditor

**Wann zu verwenden**: Nach dem Schreiben von Code, der Benutzereingaben, Authentifizierung, API-Endpunkte oder sensible Daten verarbeitet.

::: danger Kritisch
Security Reviewer markiert Key-Leaks, SSRF, Injection, unsichere Verschlüsselung und OWASP Top 10 Schwachstellen. Gefundene KRITISCHE Probleme müssen sofort behoben werden!
:::

**Kernaufgaben**:
1. **Schwachstellenerkennung**: Identifizierung von OWASP Top 10 und häufigen Sicherheitsproblemen
2. **Key-Erkennung**: Suche nach hartkodierten API-Keys, Passwörtern, Tokens
3. **Eingabevalidierung**: Sicherstellung, dass alle Benutzereingaben angemessen bereinigt werden
4. **Authentifizierung/Autorisierung**: Überprüfung angemessener Zugriffskontrolle
5. **Abhängigkeitssicherheit**: Überprüfung verwundbarer npm-Pakete
6. **Sicherheits-Best-Practices**: Durchsetzung sicherer Codemuster

**OWASP Top 10 Prüfung**:

1. **Injection** (SQL, NoSQL, Command)
   - Sind Queries parametrisiert?
   - Werden Benutzereingaben bereinigt?
   - Wird ORM sicher verwendet?

2. **Kaputte Authentifizierung**
   - Sind Passwörter gehasht (bcrypt, argon2)?
   - Wird JWT korrekt validiert?
   - Sind Sessions sicher?
   - Gibt es MFA?

3. **Preisgabe sensibler Daten**
   - Ist HTTPS erzwungen?
   - Sind Keys in Umgebungsvariablen?
   - Ist PII verschlüsselt im Ruhezustand?
   - Werden Logs bereinigt?

4. **XML External Entities (XXE)**
   - Ist XML-Parser sicher konfiguriert?
   - Ist externe Entity-Verarbeitung deaktiviert?

5. **Kaputte Zugriffskontrolle**
   - Wird jede Route auf Autorisierung geprüft?
   - Sind Objektreferenzen indirekt?
   - Ist CORS korrekt konfiguriert?

6. **Sicherheitsfehlkonfiguration**
   - Wurden Standard-Credentials geändert?
   - Ist Fehlerbehandlung sicher?
   - Sind Security-Header gesetzt?
   - Ist Debug-Modus in Produktion deaktiviert?

7. **Cross-Site Scripting (XSS)**
   - Wird Output escaped/bereinigt?
   - Ist Content-Security-Policy gesetzt?
   - Escaped Framework standardmäßig?

8. **Unsichere Deserialisierung**
   - Werden Benutzereingaben sicher deserialisiert?
   - Ist Deserialisierungsbibliothekt auf dem neuesten Stand?

9. **Verwendung von Komponenten mit bekannten Schwachstellen**
   - Sind alle Abhängigkeiten auf dem neuesten Stand?
   - Ist npm audit sauber?
   - Werden CVEs überwacht?

10. **Unzureichende Logging und Monitoring**
    - Werden Sicherheitsereignisse geloggt?
    - Werden Logs überwacht?
    - Sind Warnungen konfiguriert?

**Häufige Schwachstellen-Muster**:

**1. Hartkodierte Keys (KRITISCH)**
```javascript
// ❌ KRITISCH: Hartkodierte Secrets
const apiKey = "sk-proj-xxxxx"

// ✅ KORREKT: Umgebungsvariablen
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

**2. SQL-Injection (KRITISCH)**
```javascript
// ❌ KRITISCH: SQL-Injection-Schwachstelle
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ KORREKT: Parametrisierte Queries
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

**3. XSS (HOCH)**
```javascript
// ❌ HOCH: XSS-Schwachstelle
element.innerHTML = userInput

// ✅ KORREKT: textContent verwenden oder bereinigen
element.textContent = userInput
```

**Sicherheitsüberprüfungsbericht-Format**:
```markdown
# Sicherheitsüberprüfungsbericht

**Datei/Komponente:** [pfad/zu/datei.ts]
**Überprüft:** YYYY-MM-DD
**Prüfer:** security-reviewer agent

## Zusammenfassung
- **Kritische Probleme:** X
- **Hohe Probleme:** Y
- **Mittlere Probleme:** Z
- **Niedrige Probleme:** W
- **Risikostufe:** 🔴 HOCH / 🟡 MITTEL / 🟢 NIEDRIG

## Kritische Probleme (Sofort beheben)

### 1. [Problemtitel]
**Schweregrad:** KRITISCH
**Kategorie:** SQL Injection / XSS / Authentication / etc.
**Ort:** `datei.ts:123`

**Problem:**
[Beschreibung der Schwachstelle]

**Auswirkung:**
[Was passiert, wenn ausgenutzt]

**Proof of Concept:**
```javascript
// Beispiel für Schwachstellen-Ausnutzung
```

**Behebung:**
```javascript
// ✅ Sichere Implementierung
```

**Referenzen:**
- OWASP: [Link]
- CWE: [Nummer]
```


