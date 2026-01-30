---
title: "Benutzerdefinierte Rules: Projektstandards erstellen | Everything Claude Code"
subtitle: "Benutzerdefinierte Rules: Projektstandards erstellen"
sidebarTitle: "Claude nach deinen Regeln"
description: "Erfahren Sie, wie Sie benutzerdefinierte Rules-Dateien erstellen. Beherrschen Sie Rule-Formate, Checklisten, Sicherheitsregeln und Git-Workflow-Integration, damit Claude automatisch Teamstandards einhält."
tags:
  - "custom-rules"
  - "project-standards"
  - "code-quality"
prerequisite:
  - "start-quick-start"
order: 130
---

# Benutzerdefinierte Rules: Projektspezifische Standards erstellen

## Was Sie lernen werden

- Benutzerdefinierte Rules-Dateien erstellen, um projektspezifische Coding-Standards zu definieren
- Checklisten verwenden, um konsistente Codequalität sicherzustellen
- Teamstandards in den Claude Code Workflow integrieren
- Verschiedene Regeltypen je nach Projektanforderungen anpassen

## Ihre aktuelle Herausforderung

Kennen Sie diese Probleme?

- Inkonsistenter Codestil im Team, dieselben Probleme werden bei Reviews immer wieder angesprochen
- Das Projekt hat spezielle Sicherheitsanforderungen, die Claude nicht kennt
- Bei jedem Code-Schreiben muss manuell geprüft werden, ob Teamstandards eingehalten wurden
- Sie wünschen sich, dass Claude automatisch an projektspezifische Best Practices erinnert

## Wann Sie diese Technik einsetzen

- **Bei der Initialisierung neuer Projekte** - Projektspezifische Coding-Standards und Sicherheitsrichtlinien definieren
- **Bei der Teamarbeit** - Codestil und Qualitätsstandards vereinheitlichen
- **Nach häufigen Code-Review-Problemen** - Wiederkehrende Probleme als Regeln festschreiben
- **Bei speziellen Projektanforderungen** - Branchenstandards oder technologiespezifische Regeln integrieren

## Kernkonzept

Rules sind die Durchsetzungsebene für Projektstandards und sorgen dafür, dass Claude automatisch Ihre definierten Standards einhält.

### Wie Rules funktionieren

Rules-Dateien befinden sich im `rules/`-Verzeichnis. Claude Code lädt alle Regeln automatisch beim Sitzungsstart. Bei jeder Codegenerierung oder Überprüfung prüft Claude anhand dieser Regeln.

::: info Unterschied zwischen Rules und Skills

- **Rules**: Verbindliche Checklisten, die für alle Operationen gelten (z.B. Sicherheitsprüfungen, Codestil)
- **Skills**: Workflow-Definitionen und Fachwissen für spezifische Aufgaben (z.B. TDD-Prozess, Architekturdesign)

Rules sind "muss eingehalten werden"-Einschränkungen, Skills sind "wie man es macht"-Anleitungen.
:::

### Dateistruktur von Rules

Jede Rule-Datei folgt einem Standardformat:

```markdown
# Regeltitel

## Regelkategorie
Regelbeschreibung...

### Checkliste
- [ ] Prüfpunkt 1
- [ ] Prüfpunkt 2

### Codebeispiele
Vergleich von korrektem/falschem Code...
```

## Schritt für Schritt

### Schritt 1: Integrierte Regeltypen kennenlernen

Everything Claude Code bietet 8 integrierte Regelsets. Lernen Sie zunächst deren Funktionen kennen.

**Warum**

Das Verständnis der integrierten Regeln hilft Ihnen zu bestimmen, was angepasst werden muss, und vermeidet doppelte Arbeit.

**Integrierte Regeln anzeigen**

Schauen Sie im `rules/`-Verzeichnis des Quellcodes:

```bash
ls rules/
```

Sie sehen die folgenden 8 Regeldateien:

| Regeldatei | Zweck | Anwendungsfall |
| --- | --- | --- |
| `security.md` | Sicherheitsprüfungen | API-Schlüssel, Benutzereingaben, Datenbankoperationen |
| `coding-style.md` | Codestil | Funktionsgröße, Dateiorganisation, Immutability-Muster |
| `testing.md` | Testanforderungen | Testabdeckung, TDD-Prozess, Testtypen |
| `performance.md` | Performance-Optimierung | Modellauswahl, Kontextmanagement, Komprimierungsstrategien |
| `agents.md` | Agent-Nutzung | Wann welcher Agent verwendet wird, parallele Ausführung |
| `git-workflow.md` | Git-Workflow | Commit-Format, PR-Prozess, Branch-Management |
| `patterns.md` | Design Patterns | Repository-Muster, API-Antwortformate, Skeleton-Projekte |
| `hooks.md` | Hooks-System | Hook-Typen, Auto-Accept-Berechtigungen, TodoWrite |

**Was Sie sehen sollten**:
- Jede Regeldatei hat klare Titel und Kategorien
- Regeln enthalten Checklisten und Codebeispiele
- Regeln gelten für spezifische Szenarien und technische Anforderungen

### Schritt 2: Benutzerdefinierte Regeldatei erstellen

Erstellen Sie eine neue Regeldatei im `rules/`-Verzeichnis Ihres Projekts.

**Warum**

Benutzerdefinierte Regeln lösen projektspezifische Probleme und sorgen dafür, dass Claude Teamstandards einhält.

**Regeldatei erstellen**

Angenommen, Ihr Projekt verwendet Next.js und Tailwind CSS und benötigt Frontend-Komponentenstandards:

```bash
# Regeldatei erstellen
touch rules/frontend-conventions.md
```

**Regeldatei bearbeiten**

Öffnen Sie `rules/frontend-conventions.md` und fügen Sie folgenden Inhalt hinzu:

```markdown
# Frontend Conventions

## Component Design
ALL components must follow these conventions:

### Component Structure
- Export default function component
- Use TypeScript interfaces for props
- Keep components focused (<300 lines)
- Use Tailwind utility classes, not custom CSS

### Naming Conventions
- Component files: PascalCase (UserProfile.tsx)
- Component names: PascalCase
- Props interface: `<ComponentName>Props`
- Utility functions: camelCase

### Code Example

\`\`\`typescript
// CORRECT: Following conventions
interface UserProfileProps {
  name: string
  email: string
  avatar?: string
}

export default function UserProfile({ name, email, avatar }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {avatar && <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />}
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`typescript
// WRONG: Violating conventions
export const UserProfile = (props: any) => {
  return <div>...</div>  // Missing TypeScript, wrong export
}
\`\`\`

### Checklist
Before marking frontend work complete:
- [ ] Components follow PascalCase naming
- [ ] Props interfaces properly typed with TypeScript
- [ ] Components <300 lines
- [ ] Tailwind utility classes used (no custom CSS)
- [ ] Default export used
- [ ] Component file name matches component name
```

**Was Sie sehen sollten**:
- Regeldatei verwendet Standard-Markdown-Format
- Klare Titel und Kategorien (##)
- Codebeispiele im Vergleich (CORRECT vs WRONG)
- Checkliste (Checkbox)
- Prägnante Regelbeschreibungen

### Schritt 3: Sicherheitsbezogene benutzerdefinierte Regeln definieren

Wenn Ihr Projekt spezielle Sicherheitsanforderungen hat, erstellen Sie dedizierte Sicherheitsregeln.

**Warum**

Die integrierte `security.md` enthält allgemeine Sicherheitsprüfungen, aber Ihr Projekt kann spezifische Sicherheitsanforderungen haben.

**Projektsicherheitsregeln erstellen**

Erstellen Sie `rules/project-security.md`:

```markdown
# Project Security Requirements

## API Authentication
ALL API calls must include authentication:

### JWT Token Management
- Store JWT in httpOnly cookies (not localStorage)
- Validate token expiration on each request
- Refresh tokens automatically before expiration
- Include CSRF protection headers

// CORRECT: JWT in httpOnly cookie
const response = await fetch('/api/users', {
  credentials: 'include',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
})

// WRONG: JWT in localStorage (vulnerable to XSS)
const token = localStorage.getItem('jwt')
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

## Data Validation
ALL user inputs must be validated server-side:

import { z } from 'zod'
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(18, 'Must be 18 or older')
})
const validatedData = CreateUserSchema.parse(req.body)

## Checklist
Before marking security work complete:
- [ ] API calls use httpOnly cookies for JWT
- [ ] CSRF protection enabled
- [ ] All user inputs validated server-side
- [ ] Sensitive data never logged
- [ ] Rate limiting configured on all endpoints
- [ ] Error messages don't leak sensitive information
```

**Was Sie sehen sollten**:
- Regeln sind auf den projektspezifischen Tech-Stack zugeschnitten (JWT, Zod)
- Codebeispiele zeigen korrekte und falsche Implementierungen
- Checkliste deckt alle Sicherheitsprüfpunkte ab

### Schritt 4: Projektspezifische Git-Workflow-Regeln definieren

Wenn Ihr Team spezielle Git-Commit-Konventionen hat, können Sie `git-workflow.md` erweitern oder benutzerdefinierte Regeln erstellen.

**Warum**

Die integrierte `git-workflow.md` enthält grundlegende Commit-Formate, aber Ihr Team kann zusätzliche Anforderungen haben.

**Git-Regeln erstellen**

Erstellen Sie `rules/team-git-workflow.md`:

```markdown
# Team Git Workflow

## Commit Message Format
Follow Conventional Commits with team-specific conventions:

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `docs`: Documentation changes
- `test`: Test updates
- `chore`: Maintenance tasks
- `team` (custom): Team-specific changes (onboarding, meetings)

### Commit Scope (REQUIRED)
Must include scope in brackets after type:

Format: 

Examples:
- feat(auth): add OAuth2 login
- fix(api): handle 404 errors
- docs(readme): update installation guide
- team(onboarding): add Claude Code setup guide

### Commit Body (Required for breaking changes)

feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses

## Pull Request Requirements

### PR Checklist
Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist
Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated
```


Examples:
feat(auth): add OAuth2 login
fix(api): handle 404 errors
docs(readme): update installation guide
team(onboarding): add Claude Code setup guide
```

### Commit Body (Required for breaking changes)

```
feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses
```

## Pull Request Requirements

### PR Checklist

Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist

Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated

## Checklist

Before marking Git work complete:
- [ ] Commit message includes type and scope
- [ ] Breaking changes documented in commit body
- [ ] PR title follows conventional commits format
- [ ] Test plan included in PR description
- [ ] Related issues linked to PR
```

**Was Sie sehen sollten**:
- Git-Commit-Format enthält teamspezifische Typen (`team`)
- Commit-Scope ist verpflichtend
- PRs haben klare Checklisten
- Regeln sind auf den Team-Collaboration-Workflow zugeschnitten

### Schritt 5: Rules-Laden verifizieren

Nach dem Erstellen der Regeln überprüfen Sie, ob Claude Code sie korrekt lädt.

**Warum**

Stellen Sie sicher, dass das Regeldateiformat korrekt ist und Claude die Regeln lesen und anwenden kann.

**Verifizierungsmethode**

1. Starten Sie eine neue Claude Code Sitzung
2. Lassen Sie Claude die geladenen Regeln prüfen:
   ```
   Welche Rules-Dateien sind geladen?
   ```

3. Testen Sie, ob die Regeln wirksam sind:
   ```
   Erstelle eine React-Komponente gemäß den frontend-conventions Regeln
   ```

**Was Sie sehen sollten**:
- Claude listet alle geladenen Rules auf (einschließlich benutzerdefinierter Regeln)
- Der generierte Code folgt Ihren definierten Standards
- Bei Regelverstößen weist Claude auf Korrekturen hin

### Schritt 6: In den Code-Review-Prozess integrieren

Lassen Sie benutzerdefinierte Regeln automatisch bei Code-Reviews prüfen.

**Warum**

Automatische Regelanwendung bei Code-Reviews stellt sicher, dass der gesamte Code den Standards entspricht.

**Code-Reviewer für Regelreferenz konfigurieren**

Stellen Sie sicher, dass `agents/code-reviewer.md` die relevanten Regeln referenziert:

```markdown
---
name: code-reviewer
description: Review code for quality, security, and adherence to standards
---

When reviewing code, check these rules:

1. **Security checks** (rules/security.md)
   - No hardcoded secrets
   - All inputs validated
   - SQL injection prevention
   - XSS prevention

2. **Coding style** (rules/coding-style.md)
   - Immutability
   - File organization
   - Error handling
   - Input validation

3. **Project-specific rules**
   - Frontend conventions (rules/frontend-conventions.md)
   - Project security (rules/project-security.md)
   - Team Git workflow (rules/team-git-workflow.md)

Report findings in this format:
- CRITICAL: Must fix before merge
- HIGH: Should fix before merge
- MEDIUM: Consider fixing
- LOW: Nice to have
```

**Was Sie sehen sollten**:
- Der code-reviewer Agent prüft alle relevanten Regeln bei Reviews
- Berichte sind nach Schweregrad kategorisiert
- Projektspezifische Standards sind im Review-Prozess integriert

## Checkpoint ✅

- [ ] Mindestens eine benutzerdefinierte Regeldatei erstellt
- [ ] Regeldatei folgt dem Standardformat (Titel, Kategorien, Codebeispiele, Checkliste)
- [ ] Regeln enthalten Vergleichsbeispiele (korrekt/falsch)
- [ ] Regeldatei befindet sich im `rules/`-Verzeichnis
- [ ] Verifiziert, dass Claude Code die Regeln korrekt lädt
- [ ] code-reviewer Agent referenziert benutzerdefinierte Regeln

## Häufige Fehler vermeiden

### ❌ Häufiger Fehler 1: Nicht-standardkonforme Dateinamen

**Problem**: Regeldateinamen enthalten Leerzeichen oder Sonderzeichen, wodurch Claude sie nicht laden kann.

**Lösung**:
- ✅ Korrekt: `frontend-conventions.md`, `project-security.md`
- ❌ Falsch: `Frontend Conventions.md`, `project-security(v2).md`

Verwenden Sie Kleinbuchstaben und Bindestriche, vermeiden Sie Leerzeichen und Klammern.

### ❌ Häufiger Fehler 2: Zu vage Regeln

**Problem**: Regelbeschreibungen sind unscharf und es ist nicht klar erkennbar, ob Code konform ist.

**Lösung**: Konkrete Checklisten und Codebeispiele bereitstellen:

```markdown
❌ Vage Regel: Komponenten sollten übersichtlich und lesbar sein

✅ Konkrete Regel:
- Komponenten müssen <300 Zeilen haben
- Funktionen müssen <50 Zeilen haben
- Verschachtelung über 4 Ebenen ist verboten
```

### ❌ Häufiger Fehler 3: Fehlende Codebeispiele

**Problem**: Nur Textbeschreibungen, keine Demonstration von korrekten und falschen Implementierungen.

**Lösung**: Immer Codebeispiele im Vergleich einschließen:

```markdown
CORRECT: Folgt den Konventionen
function example() { ... }

WRONG: Verstößt gegen Konventionen
function example() { ... }
```

### ❌ Häufiger Fehler 4: Unvollständige Checklisten

**Problem**: Checklisten lassen wichtige Prüfpunkte aus, wodurch Regeln nicht vollständig durchgesetzt werden können.

**Lösung**: Alle Aspekte der Regelbeschreibung abdecken:

```markdown
Checkliste:
- [ ] Prüfpunkt 1
- [ ] Prüfpunkt 2
- [ ] ... (alle Regelaspekte abdecken)
```

## Zusammenfassung

Benutzerdefinierte Rules sind der Schlüssel zur Projektstandardisierung:

1. **Integrierte Regeln verstehen** - 8 Standardregelsets decken gängige Szenarien ab
2. **Regeldateien erstellen** - Standard-Markdown-Format verwenden
3. **Projektstandards definieren** - Auf Tech-Stack und Teamanforderungen zuschneiden
4. **Laden verifizieren** - Sicherstellen, dass Claude die Regeln korrekt liest
5. **In Review-Prozess integrieren** - code-reviewer automatisch Regeln prüfen lassen

Mit benutzerdefinierten Rules sorgen Sie dafür, dass Claude automatisch Projektstandards einhält, reduzieren den Code-Review-Aufwand und verbessern die Konsistenz der Codequalität.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Dynamische Kontextinjektion: Verwendung von Contexts](../dynamic-contexts/)**.
>
> Sie werden lernen:
> - Definition und Zweck von Contexts
> - Wie man benutzerdefinierte Contexts erstellt
> - Contexts in verschiedenen Arbeitsmodi wechseln
> - Unterschied zwischen Contexts und Rules

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-25

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Sicherheitsregeln | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Codestil-Regeln | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Test-Regeln | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Performance-Regeln | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Agent-Nutzungsregeln | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Git-Workflow-Regeln | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Design-Pattern-Regeln | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks-System-Regeln | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |
| Code Reviewer | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-200 |

**Wichtige Konstanten**:
- `MIN_TEST_COVERAGE = 80`: Mindestanforderung für Testabdeckung
- `MAX_FILE_SIZE = 800`: Maximale Dateizeilenzahl
- `MAX_FUNCTION_SIZE = 50`: Maximale Funktionszeilenzahl
- `MAX_NESTING_LEVEL = 4`: Maximale Verschachtelungstiefe

**Wichtige Regeln**:
- **Immutability (CRITICAL)**: Direkte Objektmodifikation verboten, Spread-Operator verwenden
- **Secret Management**: Hardcodierte Schlüssel verboten, Umgebungsvariablen verwenden
- **TDD Workflow**: Erst Tests schreiben, dann implementieren, dann refactoren
- **Model Selection**: Modell je nach Aufgabenkomplexität wählen (Haiku/Sonnet/Opus)

</details>
