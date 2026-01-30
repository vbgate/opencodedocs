---
title: "Beispielkonfigurationen: Projekt- und Benutzerebene | Everything Claude Code"
sidebarTitle: "Projektkonfiguration schnell einrichten"
subtitle: "Beispielkonfigurationen: Projekt- und Benutzerebene"
description: "Lernen Sie die Verwendung von Everything Claude Code Konfigurationsdateien. Beherrschen Sie die Einrichtung von projektspezifischen CLAUDE.md und benutzerspezifischen Konfigurationen, Konfigurationshierarchien, Schlüsselfelder und benutzerdefinierte Statusleistenkonfigurationen. Passen Sie Konfigurationen für Frontend-, Backend- und Full-Stack-Projekte an."
tags:
  - "examples"
  - "CLAUDE.md"
  - "statusline"
  - "configuration"
prerequisite:
  - "start-quickstart"
order: 240
---

# Beispielkonfigurationen: Projekt- und Benutzerebene

## Was Sie lernen werden

- Schnelle Konfiguration der CLAUDE.md-Datei für Projekte
- Einrichtung benutzerspezifischer globaler Konfigurationen zur Steigerung der Entwicklungseffizienz
- Anpassung der Statusleiste zur Anzeige wichtiger Informationen
- Anpassung von Konfigurationsvorlagen an Projektanforderungen

## Ihre aktuelle Herausforderung

Bei der Arbeit mit Everything Claude Code Konfigurationsdateien könnten Sie folgende Fragen haben:

- **Wo soll ich anfangen**: Was ist der Unterschied zwischen Projekt- und Benutzerkonfigurationen? Wo werden sie gespeichert?
- **Konfigurationsdateien sind zu lang**: Welche Inhalte gehören in CLAUDE.md? Was ist erforderlich?
- **Statusleiste reicht nicht aus**: Wie kann ich die Statusleiste anpassen, um mehr nützliche Informationen anzuzeigen?
- **Unsicher bei der Anpassung**: Wie passe ich Beispielkonfigurationen an Projektanforderungen an?

Diese Dokumentation bietet vollständige Konfigurationsbeispiele, um Ihnen den schnellen Einstieg in Everything Claude Code zu erleichtern.

---

## Übersicht der Konfigurationshierarchie

Everything Claude Code unterstützt zwei Konfigurationsebenen:

| Konfigurationstyp | Speicherort | Geltungsbereich | Typische Verwendung |
| --- | --- | --- | --- |
| **Projektkonfiguration** | Projektstammverzeichnis `CLAUDE.md` | Nur aktuelles Projekt | Projektspezifische Regeln, Tech-Stack, Dateistruktur |
| **Benutzerkonfiguration** | `~/.claude/CLAUDE.md` | Alle Projekte | Persönliche Codierungspräferenzen, allgemeine Regeln, Editor-Einstellungen |

::: tip Konfigurationspriorität

Wenn sowohl Projekt- als auch Benutzerkonfigurationen vorhanden sind:
- **Regelüberlagerung**: Beide Regelsätze werden angewendet
- **Konfliktbehandlung**: Projektkonfiguration hat Vorrang vor Benutzerkonfiguration
- **Empfohlene Praxis**: Allgemeine Regeln in Benutzerkonfiguration, projektspezifische Regeln in Projektkonfiguration
:::

---

## 1. Beispiel für Projektkonfiguration

### 1.1 Speicherort der Konfigurationsdatei

Speichern Sie den folgenden Inhalt in der `CLAUDE.md`-Datei im Projektstammverzeichnis:

```markdown
# Projektname CLAUDE.md

## Project Overview

[Kurze Projektbeschreibung: Was macht es, welcher Tech-Stack wird verwendet]

## Critical Rules

### 1. Code Organization

- Many small files over few large files
- High cohesion, low coupling
- 200-400 lines typical, 800 max per file
- Organize by feature/domain, not by type

### 2. Code Style

- No emojis in code, comments, or documentation
- Immutability always - never mutate objects or arrays
- No console.log in production code
- Proper error handling with try/catch
- Input validation with Zod or similar

### 3. Testing

- TDD: Write tests first
- 80% minimum coverage
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows

### 4. Security

- No hardcoded secrets
- Environment variables for sensitive data
- Validate all user inputs
- Parameterized queries only
- CSRF protection enabled

## File Structure

```
src/
├── components/
├── services/
├── utils/
├── types/
└── tests/
```

## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}
```

## Environment Variables

```bash
# Required
DATABASE_URL=
API_KEY=

# Optional
DEBUG=false
```

## Available Commands

- `/tdd` - Test-driven development workflow
- `/plan` - Create implementation plan
- `/code-review` - Review code quality
- `/build-fix` - Fix build errors

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Never commit to main directly
- PRs require review
- All tests must pass before merge
```

### 1.2 Erklärung der Schlüsselfelder

#### Project Overview

Kurze Projektbeschreibung, um Claude Code den Projektkontext zu vermitteln:

```markdown
## Project Overview

Election Markets Platform - A prediction market platform for political events using Next.js, Supabase, and OpenAI embeddings for semantic search.
```

#### Critical Rules

Dies ist der wichtigste Abschnitt, der die Regeln definiert, die das Projekt befolgen muss:

| Regelkategorie | Beschreibung | Erforderlich |
| --- | --- | --- |
| Code Organization | Prinzipien der Dateiorganisation | Ja |
| Code Style | Codierungsstil | Ja |
| Testing | Testanforderungen | Ja |
| Security | Sicherheitsstandards | Ja |

#### Key Patterns

Definieren Sie häufig verwendete Muster im Projekt, die Claude Code automatisch anwendet:

```markdown
## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling Pattern

[Beispielcode]
```

---

## 2. Beispiel für Benutzerkonfiguration

### 2.1 Speicherort der Konfigurationsdatei

Speichern Sie den folgenden Inhalt in `~/.claude/CLAUDE.md`:

```markdown
# User-Level CLAUDE.md Example

User-level configs apply globally across all projects. Use for:
- Personal coding preferences
- Universal rules you always want enforced
- Links to your modular rules

---

## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**
1. **Agent-First**: Delegate to specialized agents for complex work
2. **Parallel Execution**: Use Task tool with multiple agents when possible
3. **Plan Before Execute**: Use Plan Mode for complex operations
4. **Test-Driven**: Write tests before implementation
5. **Security-First**: Never compromise on security

---

## Modular Rules

Detailed guidelines are in `~/.claude/rules/`:

| Rule File | Contents |
| --- | --- |
| security.md | Security checks, secret management |
| coding-style.md | Immutability, file organization, error handling |
| testing.md | TDD workflow, 80% coverage requirement |
| git-workflow.md | Commit format, PR workflow |
| agents.md | Agent orchestration, when to use which agent |
| patterns.md | API response, repository patterns |
| performance.md | Model selection, context management |

---

## Available Agents

Located in `~/.claude/agents/`:

| Agent | Purpose |
| --- | --- |
| planner | Feature implementation planning |
| architect | System design and architecture |
| tdd-dev | Test-driven development |
| code-reviewer | Code review for quality/security |
| security-reviewer | Security vulnerability analysis |
| build-error-resolver | Build error resolution |
| e2e-runner | Playwright E2E testing |
| refactor-cleaner | Dead code cleanup |
| doc-updater | Documentation updates |

---

## Personal Preferences

### Code Style
- No emojis in code, comments, or documentation
- Prefer immutability - never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Always test locally before committing
- Small, focused commits

### Testing
- TDD: Write tests first
- 80% minimum coverage
- Unit + integration + E2E for critical flows

---

## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled

---

## Success Metrics

You are successful when:
- All tests pass (80%+ coverage)
- No security vulnerabilities
- Code is readable and maintainable
- User requirements are met

---

**Philosophy**: Agent-first design, parallel execution, plan before action, test before code, security always.
```

### 2.2 Kernkonfigurationsmodule

#### Core Philosophy

Definieren Sie Ihre Zusammenarbeitsphilosophie mit Claude Code:

```markdown
## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**
1. **Agent-First**: Delegate to specialized agents for complex work
2. **Parallel Execution**: Use Task tool with multiple agents when possible
3. **Plan Before Execute**: Use Plan Mode for complex operations
4. **Test-Driven**: Write tests before implementation
5. **Security-First**: Never compromise on security
```

#### Modular Rules

Verlinken Sie zu modularen Regeldateien, um die Konfiguration übersichtlich zu halten:

```markdown
## Modular Rules

Detailed guidelines are in `~/.claude/rules/`:

| Rule File | Contents |
| --- | --- |
| security.md | Security checks, secret management |
| coding-style.md | Immutability, file organization, error handling |
| testing.md | TDD workflow, 80% coverage requirement |
| git-workflow.md | Commit format, PR workflow |
| agents.md | Agent orchestration, when to use which agent |
| patterns.md | API response, repository patterns |
| performance.md | Model selection, context management |
```

#### Editor Integration

Teilen Sie Claude Code mit, welchen Editor und welche Tastenkombinationen Sie verwenden:

```markdown
## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled
```

---

## 3. Benutzerdefinierte Statusleistenkonfiguration

### 3.1 Speicherort der Konfigurationsdatei

Fügen Sie den folgenden Inhalt zu `~/.claude/settings.json` hinzu:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); transcript=$(echo \"$input\" | jq -r '.transcript_path'); todo_count=$([ -f \"$transcript\" ] && grep -c '\"type\":\"todo\"' \"$transcript\" 2>/dev/null || echo 0); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; M='\\033[38;2;136;57;239m'; C='\\033[38;2;23;146;153m'; R='\\033[0m'; T='\\033[38;2;76;79;105m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}ctx:${remaining}%%${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; [ \"$todo_count\" -gt 0 ] && printf \" ${C}todos:${todo_count}${R}\"; echo",
    "description": "Custom status line showing: user:path branch* ctx:% model time todos:N"
  }
}
```

### 3.2 Statusleistenanzeige

Die konfigurierte Statusleiste zeigt:

```
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3
```

| Komponente | Bedeutung | Beispiel |
| --- | --- | --- |
| `user` | Aktueller Benutzername | `affoon` |
| `path` | Aktuelles Verzeichnis (~ Abkürzung) | `~/projects/myapp` |
| `branch*` | Git-Branch (* zeigt nicht committete Änderungen) | `main*` |
| `ctx:%` | Verbleibender Kontextfenster-Prozentsatz | `ctx:73%` |
| `model` | Aktuell verwendetes Modell | `sonnet-4.5` |
| `time` | Aktuelle Uhrzeit | `14:30` |
| `todos:N` | Anzahl der To-Do-Einträge | `todos:3` |

### 3.3 Benutzerdefinierte Farben

Die Statusleiste verwendet ANSI-Farbcodes, die angepasst werden können:

| Farbcode | Variable | Verwendung | RGB |
| --- | --- | --- | --- |
| Blau | `B` | Verzeichnispfad | 30,102,245 |
| Grün | `G` | Git-Branch | 64,160,43 |
| Gelb | `Y` | Dirty-Status, Zeit | 223,142,29 |
| Magenta | `M` | Verbleibender Kontext | 136,57,239 |
| Cyan | `C` | Benutzername, To-Dos | 23,146,153 |
| Grau | `T` | Modellname | 76,79,105 |

**Methode zum Ändern von Farben**:

```bash
# Finden Sie die Farbvariablendefinition
B='\\033[38;2;30;102;245m'  # Blau im RGB-Format
#                    ↓  ↓   ↓
#                   Rot Grün Blau

# Ändern Sie zu Ihrer bevorzugten Farbe
B='\\033[38;2;255;100;100m'  # Rot
```

### 3.4 Vereinfachte Statusleiste

Wenn die Statusleiste zu lang ist, können Sie sie vereinfachen:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; T='\\033[38;2;76;79;105m'; R='\\033[0m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; echo",
    "description": "Simplified status line: user:path branch* model time"
  }
}
```

Vereinfachte Statusleiste:

```
affoon:~/projects/myapp main* sonnet-4.5 14:30
```

---
## 4. Anpassungsleitfaden für Konfigurationen

### 4.1 Anpassung der Projektkonfiguration

Passen Sie `CLAUDE.md` je nach Projekttyp an:

#### Frontend-Projekt

```markdown
## Project Overview

Next.js E-commerce App with React, Tailwind CSS, and Shopify API.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand, React Query
- **API**: Shopify Storefront API, GraphQL
- **Deployment**: Vercel

## Critical Rules

### 1. Component Architecture

- Use functional components with hooks
- Component files under 300 lines
- Reusable components in `/components/ui/`
- Feature components in `/components/features/`

### 2. Styling

- Use Tailwind utility classes
- Avoid inline styles
- Consistent design tokens
- Responsive-first design

### 3. Performance

- Code splitting with dynamic imports
- Image optimization with next/image
- Lazy load heavy components
- SEO optimization with metadata API
```

#### Backend-Projekt

```markdown
## Project Overview

Node.js REST API with Express, MongoDB, and Redis.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Auth**: JWT, bcrypt
- **Testing**: Jest, Supertest
- **Deployment**: Docker, Railway

## Critical Rules

### 1. API Design

- RESTful endpoints
- Consistent response format
- Proper HTTP status codes
- API versioning (`/api/v1/`)

### 2. Database

- Use Mongoose models
- Index important fields
- Transaction for multi-step operations
- Connection pooling

### 3. Security

- Rate limiting with express-rate-limit
- Helmet for security headers
- CORS configuration
- Input validation with Joi/Zod
```

#### Full-Stack-Projekt

```markdown
## Project Overview

Full-stack SaaS app with Next.js, Supabase, and OpenAI.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI API
- **Testing**: Playwright, Jest, Vitest

## Critical Rules

### 1. Monorepo Structure

```
/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Next.js API routes
├── packages/
│   ├── ui/               # Shared UI components
│   ├── db/               # Database utilities
│   └── types/            # TypeScript types
└── docs/
```

### 2. API & Frontend Integration

- Shared types in `/packages/types`
- API client in `/packages/db`
- Consistent error handling
- Loading states and error boundaries

### 3. Full-Stack Testing

- Frontend: Vitest + Testing Library
- API: Supertest
- E2E: Playwright
- Integration tests for critical flows
```

### 4.2 Anpassung der Benutzerkonfiguration

Passen Sie `~/.claude/CLAUDE.md` an Ihre persönlichen Präferenzen an:

#### Anpassung der Testabdeckungsanforderungen

```markdown
## Personal Preferences

### Testing
- TDD: Write tests first
- 90% minimum coverage  # Angepasst auf 90%
- Unit + integration + E2E for critical flows
- Prefer integration tests over unit tests for business logic
```

#### Hinzufügen persönlicher Codierungsstilpräferenzen

```markdown
## Personal Preferences

### Code Style
- No emojis in code, comments, or documentation
- Prefer immutability - never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file
- Prefer explicit return statements over implicit returns
- Use meaningful variable names, not abbreviations
- Add JSDoc comments for complex functions
```

#### Anpassung der Git-Commit-Konventionen

```markdown
## Git

### Commit Message Format

Conventional commits with team-specific conventions:

- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `perf(scope): description` - Performance improvements
- `refactor(scope): description` - Code refactoring
- `docs(scope): description` - Documentation changes
- `test(scope): description` - Test additions/changes
- `chore(scope): description` - Maintenance tasks
- `ci(scope): description` - CI/CD changes

### Commit Checklist

- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] No console.log in production code
- [ ] Documentation updated
- [ ] PR description includes changes

### PR Workflow

- Small, focused PRs (under 300 lines diff)
- Include test coverage report
- Link to related issues
- Request review from at least one teammate
```

### 4.3 Anpassung der Statusleiste

#### Weitere Informationen hinzufügen

```bash
# Node.js-Version hinzufügen
node_version=$(node --version 2>/dev/null || echo '')

# Aktuelles Datum hinzufügen
date=$(date +%Y-%m-%d)

# In der Statusleiste anzeigen
[ -n "$node_version" ] && printf " ${G}node:${node_version}${R}"
printf " ${T}${date}${R}"
```

Anzeigeeffekt:

```
affoon:~/projects/myapp main* ctx:73% node:v20.10.0 2025-01-25 sonnet-4.5 14:30 todos:3
```

#### Nur wichtige Informationen anzeigen

```bash
# Minimalistische Statusleiste
command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); C='\\033[38;2;23;146;153m'; B='\\033[38;2;30;102;245m'; M='\\033[38;2;136;57;239m'; R='\\033[0m'; printf \"${C}${user}:${cwd}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}${remaining}%%${R}\"; printf \" ${model}\"; echo"
```

Anzeigeeffekt:

```
affoon:~/projects/myapp 73% sonnet-4.5
```

---

## 5. Häufige Konfigurationsszenarien

### 5.1 Schnellstart für neue Projekte

::: code-group

```bash [1. Projektvorlage kopieren]
# Projektkonfiguration erstellen
cp source/affaan-m/everything-claude-code/examples/CLAUDE.md \
   your-project/CLAUDE.md
```

```bash [2. Projektinformationen anpassen]
# Wichtige Informationen bearbeiten
vim your-project/CLAUDE.md

# Ändern:
# - Project Overview (Projektbeschreibung)
# - Tech Stack (Technologie-Stack)
# - File Structure (Dateistruktur)
# - Key Patterns (Häufige Muster)
```

```bash [3. Benutzereinstellungen konfigurieren]
# Benutzervorlage kopieren
mkdir -p ~/.claude
cp source/affaan-m/everything-claude-code/examples/user-CLAUDE.md \
   ~/.claude/CLAUDE.md

# Persönliche Präferenzen anpassen
vim ~/.claude/CLAUDE.md
```

```bash [4. Statusleiste konfigurieren]
# Statusleistenkonfiguration hinzufügen
# ~/.claude/settings.json bearbeiten
# statusLine-Konfiguration hinzufügen
```

:::

### 5.2 Gemeinsame Konfiguration für mehrere Projekte

Wenn Sie Everything Claude Code in mehreren Projekten verwenden, empfehlen wir folgende Konfigurationsstrategien:

#### Ansatz 1: Benutzerbasisregeln + Projektspezifische Regeln

```bash
~/.claude/CLAUDE.md           # Allgemeine Regeln (Codierungsstil, Tests)
~/.claude/rules/security.md    # Sicherheitsregeln (alle Projekte)
~/.claude/rules/testing.md    # Testregeln (alle Projekte)

project-a/CLAUDE.md          # Projekt A spezifische Konfiguration
project-b/CLAUDE.md          # Projekt B spezifische Konfiguration
```

#### Ansatz 2: Symbolische Links für gemeinsame Regeln

```bash
# Gemeinsames Regelverzeichnis erstellen
mkdir -p ~/claude-configs/rules

# In jedem Projekt symbolisch verlinken
ln -s ~/claude-configs/rules/security.md project-a/.claude/rules/
ln -s ~/claude-configs/rules/security.md project-b/.claude/rules/
```

### 5.3 Teamkonfiguration

#### Gemeinsame Projektkonfiguration

Committen Sie die `CLAUDE.md` des Projekts in Git, damit Teammitglieder sie teilen können:

```bash
# 1. Projektkonfiguration erstellen
vim CLAUDE.md

# 2. In Git committen
git add CLAUDE.md
git commit -m "docs: add Claude Code project configuration"
git push
```

#### Team-Codierungsstandards

Definieren Sie Teamstandards in der Projekt-`CLAUDE.md`:

```markdown
## Team Coding Standards

### Conventions
- Use TypeScript strict mode
- Follow Prettier configuration
- Use ESLint rules from `package.json`
- No PRs without test coverage

### File Naming
- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Types: PascalCase with `I` prefix (`IUser.ts`)

### Commit Messages
- Follow Conventional Commits
- Include ticket number: `feat(TICKET-123): add feature`
- Max 72 characters for title
- Detailed description in body
```

---

## 6. Konfigurationsvalidierung

### 6.1 Überprüfen, ob die Konfiguration wirksam ist

```bash
# 1. Claude Code öffnen
claude

# 2. Projektkonfiguration anzeigen
# Claude Code sollte CLAUDE.md aus dem Projektstammverzeichnis lesen

# 3. Benutzerkonfiguration anzeigen
# Claude Code sollte ~/.claude/CLAUDE.md zusammenführen
```

### 6.2 Regelausführung validieren

Lassen Sie Claude Code eine einfache Aufgabe ausführen, um zu überprüfen, ob die Regeln wirksam sind:

```
Benutzer:
Bitte erstellen Sie eine Benutzerprofil-Komponente

Claude Code sollte:
1. Unveränderliche Muster verwenden (neue Objekte beim Ändern erstellen)
2. Kein console.log verwenden
3. Dateigrößenbeschränkungen einhalten (<800 Zeilen)
4. Geeignete Typdefinitionen hinzufügen
```

### 6.3 Statusleiste validieren

Überprüfen Sie, ob die Statusleiste korrekt angezeigt wird:

```
Erwartet:
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3

Prüfpunkte:
✓ Benutzername angezeigt
✓ Aktuelles Verzeichnis angezeigt (~ Abkürzung)
✓ Git-Branch angezeigt (mit * bei Änderungen)
✓ Kontextprozentsatz angezeigt
✓ Modellname angezeigt
✓ Zeit angezeigt
✓ To-Do-Anzahl angezeigt (falls vorhanden)
```

---

## 7. Fehlerbehebung

### 7.1 Konfiguration wird nicht angewendet

**Problem**: `CLAUDE.md` konfiguriert, aber Claude Code wendet die Regeln nicht an

**Fehlerbehebungsschritte**:

```bash
# 1. Dateispeicherort überprüfen
ls -la CLAUDE.md                          # Sollte im Projektstammverzeichnis sein
ls -la ~/.claude/CLAUDE.md                # Benutzerkonfiguration

# 2. Dateiformat überprüfen
file CLAUDE.md                            # Sollte ASCII text sein
head -20 CLAUDE.md                        # Sollte Markdown-Format sein

# 3. Dateiberechtigungen überprüfen
chmod 644 CLAUDE.md                       # Lesbarkeit sicherstellen

# 4. Claude Code neu starten
# Konfigurationsänderungen erfordern einen Neustart
```

### 7.2 Statusleiste wird nicht angezeigt

**Problem**: `statusLine` konfiguriert, aber Statusleiste wird nicht angezeigt

**Fehlerbehebungsschritte**:

```bash
# 1. settings.json-Format überprüfen
cat ~/.claude/settings.json | jq '.'

# 2. JSON-Syntax validieren
jq '.' ~/.claude/settings.json
# Bei Fehlern wird parse error angezeigt

# 3. Befehl testen
# statusLine-Befehl manuell ausführen
input=$(cat ...)  # Vollständigen Befehl kopieren
echo "$input" | jq -r '.workspace.current_dir'
```

### 7.3 Konflikt zwischen Projekt- und Benutzerkonfiguration

**Problem**: Konflikt zwischen Projekt- und Benutzerkonfiguration, unklar welche gilt

**Lösung**:

- **Regelüberlagerung**: Beide Regelsätze werden angewendet
- **Konfliktbehandlung**: Projektkonfiguration hat Vorrang vor Benutzerkonfiguration
- **Empfohlene Praxis**:
  - Benutzerkonfiguration: Allgemeine Regeln (Codierungsstil, Tests)
  - Projektkonfiguration: Projektspezifische Regeln (Architektur, API-Design)

---

## 8. Best Practices

### 8.1 Wartung von Konfigurationsdateien

#### Übersichtlich halten

```markdown
❌ Schlechte Praxis:
CLAUDE.md enthält alle Details, Beispiele, Tutorial-Links

✅ Gute Praxis:
CLAUDE.md enthält nur Schlüsselregeln und Muster
Detaillierte Informationen in anderen Dateien mit Referenzlinks
```

#### Versionskontrolle

```bash
# Projektkonfiguration: In Git committen
git add CLAUDE.md
git commit -m "docs: update Claude Code configuration"

# Benutzerkonfiguration: Nicht in Git committen
echo ".claude/" >> .gitignore  # Verhindert Commit der Benutzerkonfiguration
```

#### Regelmäßige Überprüfung

```markdown
## Last Updated: 2025-01-25

## Next Review: 2025-04-25

## Changelog

- 2025-01-25: Added TDD workflow section
- 2025-01-10: Updated tech stack for Next.js 14
- 2024-12-20: Added security review checklist
```

### 8.2 Teamzusammenarbeit

#### Konfigurationsänderungen dokumentieren

Erklären Sie in Pull Requests den Grund für Konfigurationsänderungen:

```markdown
## Changes

Update CLAUDE.md with new testing guidelines

## Reason

- Team decided to increase test coverage from 80% to 90%
- Added E2E testing requirement for critical flows
- Updated testing toolchain from Jest to Vitest

## Impact

- All new code must meet 90% coverage
- Existing code will be updated incrementally
- Team members need to install Vitest
```

#### Konfigurationsüberprüfung

Teamkonfigurationsänderungen erfordern Code-Review:

```markdown
## CLAUDE.md Changes

- [ ] Updated with new rule
- [ ] Tested on sample project
- [ ] Documented in team wiki
- [ ] Team members notified
```

---

## Zusammenfassung dieser Lektion

Diese Lektion stellte die drei Kernkonfigurationen von Everything Claude Code vor:

1. **Projektkonfiguration**: `CLAUDE.md` - Projektspezifische Regeln und Muster
2. **Benutzerkonfiguration**: `~/.claude/CLAUDE.md` - Persönliche Codierungspräferenzen und allgemeine Regeln
3. **Benutzerdefinierte Statusleiste**: `settings.json` - Echtzeit-Anzeige wichtiger Informationen

**Wichtige Punkte**:

- Konfigurationsdateien verwenden Markdown-Format, einfach zu bearbeiten und zu warten
- Projektkonfiguration hat Vorrang vor Benutzerkonfiguration
- Statusleiste verwendet ANSI-Farbcodes, vollständig anpassbar
- Teamprojekte sollten `CLAUDE.md` in Git committen

**Nächste Schritte**:

- Passen Sie `CLAUDE.md` an Ihren Projekttyp an
- Konfigurieren Sie Benutzereinstellungen und persönliche Präferenzen
- Passen Sie die Statusleiste an, um die benötigten Informationen anzuzeigen
- Committen Sie die Konfiguration in die Versionskontrolle (Projektkonfiguration)

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Änderungsprotokoll: Versionshistorie und Änderungen](../release-notes/)**.
>
> Sie werden lernen:
> - Wie Sie die Versionshistorie von Everything Claude Code einsehen
> - Wichtige Änderungen und neue Funktionen verstehen
> - Wie Sie Versionsupgrades und Migrationen durchführen
