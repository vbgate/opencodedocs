---
title: "Rules: Die 8 Regelwerke im Detail | everything-claude-code"
sidebarTitle: "Die 8 Regelwerke"
subtitle: "Rules: Die 8 Regelwerke im Detail | everything-claude-code"
description: "Lernen Sie die 8 Regelwerke von everything-claude-code: Sicherheit, Code-Stil, Testing, Git-Workflow, Performance, Agent-Nutzung, Design Patterns und Hooks-System."
tags:
  - "rules"
  - "security"
  - "coding-style"
  - "testing"
  - "git-workflow"
  - "performance"
prerequisite:
  - "start-quickstart"
order: 200
---

# Rules Vollständige Referenz: 8 Regelwerke im Detail

## Was Sie nach diesem Kapitel können

- Alle 8 verbindlichen Regelwerke schnell finden und verstehen
- Sicherheits-, Code-Stil-, Test- und andere Standards korrekt im Entwicklungsprozess anwenden
- Wissen, welcher Agent Ihnen bei der Einhaltung der Regeln hilft
- Performance-Optimierungsstrategien und die Funktionsweise des Hooks-Systems verstehen

## Ihre aktuelle Herausforderung

Angesichts der 8 Regelwerke im Projekt fragen Sie sich vielleicht:

- **Wie soll ich mir alle Regeln merken?**: security, coding-style, testing, git-workflow... Welche sind zwingend einzuhalten?
- **Wie wende ich sie an?**: Die Regeln erwähnen Immutability-Patterns und TDD-Prozesse, aber wie funktioniert das konkret?
- **Wen frage ich um Hilfe?**: Welchen Agent nutze ich bei Sicherheitsproblemen? Und wer ist für Code-Reviews zuständig?
- **Abwägung zwischen Performance und Sicherheit**: Wie optimiere ich die Entwicklungseffizienz bei gleichzeitiger Code-Qualität?

Diese Referenzdokumentation hilft Ihnen, den Inhalt, die Anwendungsszenarien und die zugehörigen Agent-Tools jedes Regelwerks vollständig zu verstehen.

---

## Regelwerke im Überblick

Everything Claude Code enthält 8 verbindliche Regelwerke, jedes mit klaren Zielen und Anwendungsszenarien:

| Regelwerk | Ziel | Priorität | Zugehöriger Agent |
| --- | --- | --- | --- |
| **Security** | Sicherheitslücken und Datenlecks verhindern | P0 | security-reviewer |
| **Coding Style** | Lesbarkeit, Immutability, kleine Dateien | P0 | code-reviewer |
| **Testing** | 80%+ Testabdeckung, TDD-Prozess | P0 | tdd-guide |
| **Git Workflow** | Standardisierte Commits, PR-Prozess | P1 | code-reviewer |
| **Agents** | Korrekte Nutzung von Sub-Agents | P1 | N/A |
| **Performance** | Token-Optimierung, Kontext-Management | P1 | N/A |
| **Patterns** | Design Patterns, Architektur-Best-Practices | P2 | architect |
| **Hooks** | Hooks verstehen und nutzen | P2 | N/A |

::: info Erklärung der Prioritätsstufen

- **P0 (Kritisch)**: Muss strikt eingehalten werden; Verstöße führen zu Sicherheitsrisiken oder erheblichem Qualitätsverlust
- **P1 (Wichtig)**: Sollte eingehalten werden; beeinflusst Entwicklungseffizienz und Teamzusammenarbeit
- **P2 (Empfohlen)**: Empfehlenswert; verbessert Code-Architektur und Wartbarkeit
:::

---

## 1. Security (Sicherheitsregeln)

### Verbindliche Sicherheitsprüfungen

**Vor jedem Commit** müssen folgende Prüfungen abgeschlossen sein:

- [ ] Keine hartcodierten Geheimnisse (API-Keys, Passwörter, Tokens)
- [ ] Alle Benutzereingaben validiert
- [ ] SQL-Injection-Prävention (parametrisierte Abfragen)
- [ ] XSS-Prävention (HTML-Sanitization)
- [ ] CSRF-Schutz aktiviert
- [ ] Authentifizierung/Autorisierung verifiziert
- [ ] Rate-Limiting für alle Endpunkte
- [ ] Fehlermeldungen geben keine sensiblen Daten preis

### Schlüsselverwaltung

**❌ Falsch**: Hartcodierte Geheimnisse

```typescript
const apiKey = "sk-proj-xxxxx"
```

**✅ Richtig**: Umgebungsvariablen verwenden

```typescript
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### Sicherheits-Reaktionsprotokoll

Bei Entdeckung eines Sicherheitsproblems:

1. **Sofort stoppen** - aktuelle Arbeit unterbrechen
2. **security-reviewer** Agent für umfassende Analyse nutzen
3. CRITICAL-Probleme vor dem Fortfahren beheben
4. Kompromittierte Schlüssel rotieren
5. Gesamte Codebasis auf ähnliche Probleme prüfen

::: tip Nutzung des Security-Agents

Der Befehl `/code-review` löst automatisch eine security-reviewer-Prüfung aus und stellt sicher, dass der Code den Sicherheitsstandards entspricht.
:::

---

## 2. Coding Style (Code-Stil-Regeln)

### Immutability (KRITISCH)

**Immer neue Objekte erstellen, niemals bestehende modifizieren**:

**❌ Falsch**: Direkte Objektmodifikation

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ Richtig**: Neues Objekt erstellen

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### Dateiorganisation

**Viele kleine Dateien > wenige große Dateien**:

- **Hohe Kohäsion, lose Kopplung**
- **Typisch 200-400 Zeilen, maximal 800 Zeilen**
- Hilfsfunktionen aus großen Komponenten extrahieren
- Nach Funktion/Domäne organisieren, nicht nach Typ

### Fehlerbehandlung

**Fehler immer umfassend behandeln**:

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### Eingabevalidierung

**Benutzereingaben immer validieren**:

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### Code-Qualitäts-Checkliste

Vor dem Abschluss der Arbeit bestätigen:

- [ ] Code ist lesbar mit klarer Benennung
- [ ] Funktionen sind klein (< 50 Zeilen)
- [ ] Dateien sind fokussiert (< 800 Zeilen)
- [ ] Keine tiefe Verschachtelung (> 4 Ebenen)
- [ ] Korrekte Fehlerbehandlung
- [ ] Keine console.log-Anweisungen
- [ ] Keine hartcodierten Werte
- [ ] Keine direkten Mutationen (Immutability-Pattern verwenden)

---

## 3. Testing (Test-Regeln)

### Minimale Testabdeckung: 80%

**Alle Testtypen müssen enthalten sein**:

1. **Unit-Tests** - Einzelne Funktionen, Hilfsfunktionen, Komponenten
2. **Integrationstests** - API-Endpunkte, Datenbankoperationen
3. **E2E-Tests** - Kritische Benutzerflows (Playwright)

### Test-Driven Development (TDD)

**Verbindlicher Workflow**:

1. Zuerst Tests schreiben (RED)
2. Tests ausführen - sollten fehlschlagen
3. Minimale Implementierung schreiben (GREEN)
4. Tests ausführen - sollten bestehen
5. Refactoring (IMPROVE)
6. Abdeckung verifizieren (80%+)

### Test-Fehlerbehebung

1. **tdd-guide** Agent verwenden
2. Test-Isolation prüfen
3. Mocks auf Korrektheit verifizieren
4. Implementierung korrigieren, nicht den Test (es sei denn, der Test selbst ist fehlerhaft)

### Agent-Unterstützung

- **tdd-guide** - Proaktiv für neue Features nutzen, erzwingt Test-First-Ansatz
- **e2e-runner** - Playwright E2E-Test-Experte

::: tip TDD-Befehl verwenden

Der Befehl `/tdd` ruft automatisch den tdd-guide Agent auf und führt Sie durch den vollständigen TDD-Prozess.
:::

---

## 4. Git Workflow (Git-Workflow-Regeln)

### Commit-Nachrichtenformat

```
<type>: <description>

<optional body>
```

**Typen**: feat, fix, refactor, docs, test, chore, perf, ci

::: info Commit-Nachrichten

Die Attribution in Commit-Nachrichten wurde global über `~/.claude/settings.json` deaktiviert.
:::

### Pull-Request-Workflow

Beim Erstellen eines PR:

1. Vollständige Commit-Historie analysieren (nicht nur den letzten Commit)
2. `git diff [base-branch]...HEAD` verwenden, um alle Änderungen zu sehen
3. Umfassende PR-Zusammenfassung erstellen
4. Testplan und TODOs einschließen
5. Bei neuem Branch mit `-u` Flag pushen

### Feature-Implementierungs-Workflow

#### 1. Planung zuerst

- **planner** Agent für Implementierungsplan nutzen
- Abhängigkeiten und Risiken identifizieren
- In mehrere Phasen aufteilen

#### 2. TDD-Ansatz

- **tdd-guide** Agent verwenden
- Zuerst Tests schreiben (RED)
- Implementieren, um Tests zu bestehen (GREEN)
- Refactoring (IMPROVE)
- 80%+ Abdeckung verifizieren

#### 3. Code-Review

- **code-reviewer** Agent direkt nach dem Schreiben von Code nutzen
- CRITICAL- und HIGH-Probleme beheben
- MEDIUM-Probleme nach Möglichkeit beheben

#### 4. Commit und Push

- Detaillierte Commit-Nachrichten
- Conventional Commits Format einhalten

---

## 5. Agents (Agent-Regeln)

### Verfügbare Agents

Befinden sich in `~/.claude/agents/`:

| Agent | Zweck | Wann verwenden |
| --- | --- | --- |
| planner | Implementierungsplanung | Komplexe Features, Refactoring |
| architect | Systemdesign | Architekturentscheidungen |
| tdd-guide | Test-Driven Development | Neue Features, Bugfixes |
| code-reviewer | Code-Review | Nach dem Schreiben von Code |
| security-reviewer | Sicherheitsanalyse | Vor dem Commit |
| build-error-resolver | Build-Fehler beheben | Bei Build-Fehlern |
| e2e-runner | E2E-Tests | Kritische Benutzerflows |
| refactor-cleaner | Dead-Code-Bereinigung | Code-Wartung |
| doc-updater | Dokumentationsaktualisierung | Dokumentation aktualisieren |

### Agents sofort verwenden

**Ohne Benutzeraufforderung**:

1. Komplexe Feature-Anfrage - **planner** Agent verwenden
2. Code gerade geschrieben/geändert - **code-reviewer** Agent verwenden
3. Bugfix oder neues Feature - **tdd-guide** Agent verwenden
4. Architekturentscheidung - **architect** Agent verwenden

### Parallele Taskausführung

**Immer parallele Taskausführung für unabhängige Operationen verwenden**:

| Methode | Beschreibung |
| --- | --- |
| ✅ Gut: Parallel ausführen | 3 Agents parallel starten: Agent 1 (auth.ts Sicherheitsanalyse), Agent 2 (Cache-System Performance-Review), Agent 3 (utils.ts Typprüfung) |
| ❌ Schlecht: Sequentiell ausführen | Erst Agent 1, dann Agent 2, dann Agent 3 |

### Multi-Perspektiven-Analyse

Für komplexe Probleme rollenbasierte Sub-Agents verwenden:

- Faktenprüfer
- Senior Engineer
- Sicherheitsexperte
- Konsistenzprüfer
- Redundanzprüfer

---

## 6. Performance (Performance-Optimierungsregeln)

### Modellauswahlstrategie

**Haiku 4.5** (90% der Sonnet-Fähigkeiten, 3x Kostenersparnis):

- Leichtgewichtige Agents, häufige Aufrufe
- Pair Programming und Code-Generierung
- Worker-Agents in Multi-Agent-Systemen

**Sonnet 4.5** (Bestes Coding-Modell):

- Hauptentwicklungsarbeit
- Koordination von Multi-Agent-Workflows
- Komplexe Coding-Aufgaben

**Opus 4.5** (Tiefste Reasoning-Fähigkeiten):

- Komplexe Architekturentscheidungen
- Maximale Reasoning-Anforderungen
- Recherche- und Analyseaufgaben

### Kontextfenster-Management

**Die letzten 20% des Kontextfensters vermeiden**:

- Großflächiges Refactoring
- Feature-Implementierung über mehrere Dateien
- Debugging komplexer Interaktionen

**Aufgaben mit geringer Kontextsensitivität**:

- Einzeldatei-Bearbeitung
- Erstellung eigenständiger Tools
- Dokumentationsaktualisierungen
- Einfache Bugfixes

### Ultrathink + Plan Mode

Für komplexe Aufgaben, die tiefes Reasoning erfordern:

1. `ultrathink` für erweitertes Denken verwenden
2. **Plan Mode** für strukturierten Ansatz aktivieren
3. "Engine neu starten" für mehrere Kritikrunden
4. Rollenbasierte Sub-Agents für vielfältige Analyse verwenden

### Build-Fehlerbehebung

Bei Build-Fehlern:

1. **build-error-resolver** Agent verwenden
2. Fehlermeldungen analysieren
3. Schrittweise beheben
4. Nach jeder Korrektur verifizieren

---

## 7. Patterns (Gängige Muster-Regeln)

### API-Antwortformat

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### Custom Hooks Pattern

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Repository Pattern

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### Skeleton-Projekte

Bei der Implementierung neuer Features:

1. Nach bewährten Skeleton-Projekten suchen
2. Optionen mit parallelen Agents bewerten:
   - Sicherheitsbewertung
   - Skalierbarkeitsanalyse
   - Relevanzbewertung
   - Implementierungsplanung
3. Beste Übereinstimmung als Basis klonen
4. Innerhalb der validierten Struktur iterieren

---

## 8. Hooks (Hooks-System-Regeln)

### Hook-Typen

- **PreToolUse**: Vor Tool-Ausführung (Validierung, Parametermodifikation)
- **PostToolUse**: Nach Tool-Ausführung (automatische Formatierung, Prüfungen)
- **Stop**: Bei Sitzungsende (finale Validierung)

### Aktuelle Hooks (in ~/.claude/settings.json)

#### PreToolUse

- **tmux-Erinnerung**: Empfiehlt tmux für lang laufende Befehle (npm, pnpm, yarn, cargo usw.)
- **git push Review**: Öffnet Review in Zed vor dem Push
- **Dokumentationsblocker**: Verhindert Erstellung unnötiger .md/.txt-Dateien

#### PostToolUse

- **PR-Erstellung**: Protokolliert PR-URL und GitHub Actions Status
- **Prettier**: Automatische Formatierung von JS/TS-Dateien nach Bearbeitung
- **TypeScript-Prüfung**: Führt tsc nach Bearbeitung von .ts/.tsx-Dateien aus
- **console.log-Warnung**: Warnt vor console.log in bearbeiteten Dateien

#### Stop

- **console.log-Audit**: Prüft alle modifizierten Dateien auf console.log vor Sitzungsende

### Auto-Accept-Berechtigungen

**Mit Vorsicht verwenden**:

- Für vertrauenswürdige, klar definierte Pläne aktivieren
- Bei explorativer Arbeit deaktivieren
- Niemals das dangerously-skip-permissions Flag verwenden
- Stattdessen `allowedTools` in `~/.claude.json` konfigurieren

### TodoWrite Best Practices

TodoWrite-Tool verwenden für:

- Fortschrittsverfolgung bei mehrstufigen Aufgaben
- Verständnisvalidierung von Anweisungen
- Echtzeit-Steuerung ermöglichen
- Feinkörnige Implementierungsschritte anzeigen

Todo-Listen zeigen:

- Falsch geordnete Schritte
- Fehlende Elemente
- Zusätzliche unnötige Elemente
- Falsche Granularität
- Missverstandene Anforderungen

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Skills Vollständige Referenz](../skills-reference/)**.
>
> Sie werden lernen:
> - Vollständige Referenz der 11 Skill-Bibliotheken
> - Coding-Standards, Backend-/Frontend-Patterns, kontinuierliches Lernen und weitere Skills
> - Wie Sie den richtigen Skill für verschiedene Aufgaben auswählen

---

## Zusammenfassung dieser Lektion

Die 8 Regelwerke von Everything Claude Code bieten umfassende Anleitung für den Entwicklungsprozess:

1. **Security** - Verhindert Sicherheitslücken und sensible Datenlecks
2. **Coding Style** - Stellt Lesbarkeit, Immutability und kleine Dateien sicher
3. **Testing** - Erzwingt 80%+ Abdeckung und TDD-Prozess
4. **Git Workflow** - Standardisiert Commits und PR-Prozess
5. **Agents** - Leitet die korrekte Nutzung der 9 spezialisierten Sub-Agents
6. **Performance** - Optimiert Token-Nutzung und Kontext-Management
7. **Patterns** - Bietet gängige Design Patterns und Best Practices
8. **Hooks** - Erklärt die Funktionsweise des automatisierten Hook-Systems

Denken Sie daran: Diese Regeln sind keine Einschränkungen, sondern Leitlinien, die Ihnen helfen, qualitativ hochwertigen, sicheren und wartbaren Code zu schreiben. Die entsprechenden Agents (wie code-reviewer, security-reviewer) helfen Ihnen, diese Regeln automatisch einzuhalten.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Security-Regeln | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Coding Style-Regeln | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Testing-Regeln | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Git Workflow-Regeln | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Agents-Regeln | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Performance-Regeln | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Patterns-Regeln | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks-Regeln | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |

**Wichtige Regeln**:
- **Security**: Keine hartcodierten Geheimnisse, OWASP Top 10 Prüfung
- **Coding Style**: Immutability-Pattern, Dateien < 800 Zeilen, Funktionen < 50 Zeilen
- **Testing**: 80%+ Testabdeckung, TDD-Prozess verbindlich
- **Performance**: Modellauswahlstrategie, Kontextfenster-Management

**Zugehörige Agents**:
- **security-reviewer**: Erkennung von Sicherheitslücken
- **code-reviewer**: Code-Qualität und Stil-Review
- **tdd-guide**: TDD-Prozessanleitung
- **planner**: Implementierungsplanung

</details>
