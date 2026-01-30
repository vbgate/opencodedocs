---
title: "Exemplos de Configuração: Configurações de Projeto e Usuário | Everything Claude Code"
sidebarTitle: "Configuração Rápida de Projeto"
subtitle: "Exemplos de Configuração: Configurações de Projeto e Usuário"
description: "Aprenda a usar arquivos de configuração do Everything Claude Code. Domine configurações de CLAUDE.md a nível de projeto e usuário, hierarquia de configurações, campos-chave e personalização da barra de status para projetos frontend, backend e full-stack."
tags:
  - "examples"
  - "CLAUDE.md"
  - "statusline"
  - "configuration"
prerequisite:
  - "start-quickstart"
order: 240
---

# Exemplos de Configuração: Configurações de Projeto e Usuário

## O Que Você Vai Aprender

- Configurar rapidamente o arquivo CLAUDE.md para seu projeto
- Definir configurações globais a nível de usuário para aumentar a produtividade
- Personalizar a barra de status para exibir informações importantes
- Adaptar templates de configuração às necessidades do seu projeto

## Seus Desafios Atuais

Ao lidar com arquivos de configuração do Everything Claude Code, você pode:

- **Não saber por onde começar**: Qual a diferença entre configurações de projeto e usuário? Onde cada uma fica?
- **Achar os arquivos muito longos**: O que incluir no CLAUDE.md? O que é obrigatório?
- **Precisar de mais na barra de status**: Como personalizar para mostrar mais informações úteis?
- **Não saber como customizar**: Como adaptar os exemplos às necessidades do projeto?

Este documento fornece exemplos completos de configuração para você começar rapidamente com o Everything Claude Code.

---

## Visão Geral da Hierarquia de Configuração

O Everything Claude Code suporta dois níveis de configuração:

| Tipo de Configuração | Localização | Escopo | Uso Típico |
| --- | --- | --- | --- |
| **Nível de Projeto** | `CLAUDE.md` na raiz do projeto | Apenas o projeto atual | Regras específicas do projeto, stack tecnológico, estrutura de arquivos |
| **Nível de Usuário** | `~/.claude/CLAUDE.md` | Todos os projetos | Preferências pessoais de código, regras universais, configurações do editor |

::: tip Prioridade de Configuração

Quando ambas as configurações existem:
- **Regras se acumulam**: Ambos os conjuntos de regras são aplicados
- **Resolução de conflitos**: Configuração de projeto tem prioridade sobre a de usuário
- **Prática recomendada**: Coloque regras universais na configuração de usuário e regras específicas na de projeto
:::

---

## 1. Exemplo de Configuração de Projeto

### 1.1 Localização do Arquivo

Salve o seguinte conteúdo no arquivo `CLAUDE.md` na raiz do seu projeto:

```markdown
# Nome do Projeto CLAUDE.md

## Project Overview

[Descreva brevemente o projeto: o que faz, stack tecnológico utilizado]

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
|---|
|---|
|---|
|---|
|---|
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

### 1.2 Descrição dos Campos-Chave

#### Project Overview

Descreva brevemente o projeto para ajudar o Claude Code a entender o contexto:

```markdown
## Project Overview

 Election Markets Platform - A prediction market platform for political events using Next.js, Supabase, and OpenAI embeddings for semantic search.
```

#### Critical Rules

Esta é a parte mais importante, definindo as regras obrigatórias do projeto:

| Categoria | Descrição | Obrigatório |
| --- | --- | --- |
| Code Organization | Princípios de organização de arquivos | Sim |
| Code Style | Estilo de codificação | Sim |
| Testing | Requisitos de teste | Sim |
| Security | Normas de segurança | Sim |

#### Key Patterns

Defina padrões comuns do projeto que o Claude Code aplicará automaticamente:

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

[Código de exemplo]
```

---

## 2. Exemplo de Configuração de Usuário

### 2.1 Localização do Arquivo

Salve o seguinte conteúdo em `~/.claude/CLAUDE.md`:

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
| --- | --- |
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

### 2.2 Módulos de Configuração Principais

#### Core Philosophy

Defina sua filosofia de colaboração com o Claude Code:

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

Link para arquivos de regras modulares, mantendo a configuração concisa:

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

Informe ao Claude Code qual editor e atalhos você usa:

```markdown
## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled
```

---

## 3. Configuração Personalizada da Barra de Status

### 3.1 Localização do Arquivo

Adicione o seguinte conteúdo em `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); transcript=$(echo \"$input\" | jq -r '.transcript_path'); todo_count=$([ -f \"$transcript\" ] && grep -c '\"type\":\"todo\"' \"$transcript\" 2>/dev/null || echo 0); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; M='\\033[38;2;136;57;239m'; C='\\033[38;2;23;146;153m'; R='\\033[0m'; T='\\033[38;2;76;79;105m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}ctx:${remaining}%%${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; [ \"$todo_count\" -gt 0 ] && printf \" ${C}todos:${todo_count}${R}\"; echo",
    "description": "Custom status line showing: user:path branch* ctx:% model time todos:N"
  }
}
```

### 3.2 Conteúdo Exibido na Barra de Status

Após a configuração, a barra de status exibirá:

```
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3
```

| Componente | Significado | Exemplo |
| --- | --- | --- |
| `user` | Nome do usuário atual | `affoon` |
| `path` | Diretório atual (abreviado com ~) | `~/projects/myapp` |
| `branch*` | Branch Git (* indica alterações não commitadas) | `main*` |
| `ctx:%` | Porcentagem restante da janela de contexto | `ctx:73%` |
| `model` | Modelo em uso | `sonnet-4.5` |
| `time` | Hora atual | `14:30` |
| `todos:N` | Número de tarefas pendentes | `todos:3` |

### 3.3 Personalização de Cores

A barra de status usa códigos de cores ANSI, que podem ser personalizados:

| Código de Cor | Variável | Uso | RGB |
| --- | --- | --- | --- |
| Azul | `B` | Caminho do diretório | 30,102,245 |
| Verde | `G` | Branch Git | 64,160,43 |
| Amarelo | `Y` | Status dirty, hora | 223,142,29 |
| Magenta | `M` | Contexto restante | 136,57,239 |
| Ciano | `C` | Nome de usuário, tarefas | 23,146,153 |
| Cinza | `T` | Nome do modelo | 76,79,105 |

**Como modificar as cores**:

```bash
# Encontre a definição da variável de cor
B='\\033[38;2;30;102;245m'  # Formato RGB azul
#                    ↓  ↓   ↓
#                   R  G   B

# Modifique para a cor de sua preferência
B='\\033[38;2;255;100;100m'  # Vermelho
```

### 3.4 Barra de Status Simplificada

Se achar a barra de status muito longa, você pode simplificá-la:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; T='\\033[38;2;76;79;105m'; R='\\033[0m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; echo",
    "description": "Simplified status line: user:path branch* model time"
  }
}
```

Barra de status simplificada:

```
affoon:~/projects/myapp main* sonnet-4.5 14:30
```

---

## 4. Guia de Personalização de Configuração

### 4.1 Personalização de Configuração de Projeto

Ajuste o `CLAUDE.md` de acordo com o tipo de projeto:

#### Projeto Frontend

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

#### Projeto Backend

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

#### Projeto Full-Stack

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

### 4.2 Personalização de Configuração de Usuário

Ajuste `~/.claude/CLAUDE.md` de acordo com suas preferências pessoais:

#### Ajustar Requisito de Cobertura de Testes

```markdown
## Personal Preferences

### Testing
- TDD: Write tests first
- 90% minimum coverage  # Ajustado para 90%
- Unit + integration + E2E for critical flows
- Prefer integration tests over unit tests for business logic
```

#### Adicionar Preferências de Estilo de Código

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

#### Ajustar Convenções de Commit Git

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

### 4.3 Personalização da Barra de Status

#### Adicionar Mais Informações

```bash
# Adicionar versão do Node.js
node_version=$(node --version 2>/dev/null || echo '')

# Adicionar data atual
date=$(date +%Y-%m-%d)

# Exibir na barra de status
[ -n "$node_version" ] && printf " ${G}node:${node_version}${R}"
printf " ${T}${date}${R}"
```

Resultado:

```
affoon:~/projects/myapp main* ctx:73% node:v20.10.0 2025-01-25 sonnet-4.5 14:30 todos:3
```

#### Exibir Apenas Informações Essenciais

```bash
# Barra de status minimalista
command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); C='\\033[38;2;23;146;153m'; B='\\033[38;2;30;102;245m'; M='\\033[38;2;136;57;239m'; R='\\033[0m'; printf \"${C}${user}:${cwd}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}${remaining}%%${R}\"; printf \" ${model}\"; echo"
```

Resultado:

```
affoon:~/projects/myapp 73% sonnet-4.5
```

---

## 5. Cenários Comuns de Configuração

### 5.1 Início Rápido para Novo Projeto

::: code-group

```bash [1. Copiar template de projeto]
# Criar CLAUDE.md de projeto
cp source/affaan-m/everything-claude-code/examples/CLAUDE.md \
   your-project/CLAUDE.md
```

```bash [2. Personalizar informações do projeto]
# Editar informações principais
vim your-project/CLAUDE.md

# Modificar:
# - Project Overview (descrição do projeto)
# - Tech Stack (stack tecnológico)
# - File Structure (estrutura de arquivos)
# - Key Patterns (padrões comuns)
```

```bash [3. Configurar nível de usuário]
# Copiar template de usuário
mkdir -p ~/.claude
cp source/affaan-m/everything-claude-code/examples/user-CLAUDE.md \
   ~/.claude/CLAUDE.md

# Personalizar preferências
vim ~/.claude/CLAUDE.md
```

```bash [4. Configurar barra de status]
# Adicionar configuração da barra de status
# Editar ~/.claude/settings.json
# Adicionar configuração statusLine
```

:::

### 5.2 Compartilhamento de Configuração entre Múltiplos Projetos

Se você usa o Everything Claude Code em vários projetos, recomendamos a seguinte estratégia:

#### Opção 1: Regras Base de Usuário + Regras Específicas de Projeto

```bash
~/.claude/CLAUDE.md           # Regras universais (estilo de código, testes)
~/.claude/rules/security.md    # Regras de segurança (todos os projetos)
~/.claude/rules/testing.md    # Regras de teste (todos os projetos)

project-a/CLAUDE.md          # Configuração específica do Projeto A
project-b/CLAUDE.md          # Configuração específica do Projeto B
```

#### Opção 2: Links Simbólicos para Compartilhar Regras

```bash
# Criar diretório de regras compartilhadas
mkdir -p ~/claude-configs/rules

# Criar link simbólico em cada projeto
ln -s ~/claude-configs/rules/security.md project-a/.claude/rules/
ln -s ~/claude-configs/rules/security.md project-b/.claude/rules/
```

### 5.3 Configuração de Equipe

#### Compartilhar Configuração de Projeto

Faça commit do `CLAUDE.md` do projeto no Git para compartilhar com a equipe:

```bash
# 1. Criar configuração do projeto
vim CLAUDE.md

# 2. Fazer commit no Git
git add CLAUDE.md
git commit -m "docs: add Claude Code project configuration"
git push
```

#### Padrões de Código da Equipe

Defina os padrões da equipe no `CLAUDE.md` do projeto:

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

## 6. Validação de Configuração

### 6.1 Verificar se a Configuração Está Ativa

```bash
# 1. Abrir o Claude Code
claude

# 2. Verificar configuração do projeto
# O Claude Code deve ler o CLAUDE.md na raiz do projeto

# 3. Verificar configuração de usuário
# O Claude Code deve mesclar ~/.claude/CLAUDE.md
```

### 6.2 Validar Execução de Regras

Peça ao Claude Code para executar uma tarefa simples e verifique se as regras estão sendo aplicadas:

```
Usuário:
Por favor, crie um componente de perfil de usuário

O Claude Code deve:
1. Usar padrão imutável (criar novos objetos ao modificar)
2. Não usar console.log
3. Respeitar limite de tamanho de arquivo (<800 linhas)
4. Adicionar definições de tipo apropriadas
```

### 6.3 Validar Barra de Status

Verifique se a barra de status está exibindo corretamente:

```
Esperado:
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3

Itens de verificação:
✓ Nome de usuário exibido
✓ Diretório atual exibido (abreviado com ~)
✓ Branch Git exibido (* quando há alterações)
✓ Porcentagem de contexto exibida
✓ Nome do modelo exibido
✓ Hora exibida
✓ Número de tarefas exibido (se houver)
```

---

## 7. Solução de Problemas

### 7.1 Configuração Não Aplicada

**Problema**: Configurou o `CLAUDE.md` mas o Claude Code não está aplicando as regras

**Passos de diagnóstico**:

```bash
# 1. Verificar localização do arquivo
ls -la CLAUDE.md                          # Deve estar na raiz do projeto
ls -la ~/.claude/CLAUDE.md                # Configuração de usuário

# 2. Verificar formato do arquivo
file CLAUDE.md                            # Deve ser ASCII text
head -20 CLAUDE.md                        # Deve ser formato Markdown

# 3. Verificar permissões
chmod 644 CLAUDE.md                       # Garantir que é legível

# 4. Reiniciar o Claude Code
# Alterações de configuração requerem reinício
```

### 7.2 Barra de Status Não Exibida

**Problema**: Configurou `statusLine` mas a barra de status não aparece

**Passos de diagnóstico**:

```bash
# 1. Verificar formato do settings.json
cat ~/.claude/settings.json | jq '.'

# 2. Validar sintaxe JSON
jq '.' ~/.claude/settings.json
# Se houver erro, mostrará parse error

# 3. Testar comando
# Executar manualmente o comando statusLine
input=$(cat ...)  # Copiar comando completo
echo "$input" | jq -r '.workspace.current_dir'
```

### 7.3 Conflito entre Configurações de Projeto e Usuário

**Problema**: Há conflito entre configurações de projeto e usuário, não sabe qual prevalece

**Solução**:

- **Regras se acumulam**: Ambos os conjuntos de regras são aplicados
- **Resolução de conflitos**: Configuração de projeto tem prioridade sobre a de usuário
- **Prática recomendada**:
  - Configuração de usuário: Regras universais (estilo de código, testes)
  - Configuração de projeto: Regras específicas do projeto (arquitetura, design de API)

---

## 8. Melhores Práticas

### 8.1 Manutenção de Arquivos de Configuração

#### Manter Conciso

```markdown
❌ Má prática:
CLAUDE.md contém todos os detalhes, exemplos, links de tutoriais

✅ Boa prática:
CLAUDE.md contém apenas regras e padrões essenciais
Informações detalhadas em outros arquivos referenciados por links
```

#### Controle de Versão

```bash
# Configuração de projeto: commit no Git
git add CLAUDE.md
git commit -m "docs: update Claude Code configuration"

# Configuração de usuário: não fazer commit no Git
echo ".claude/" >> .gitignore  # Prevenir commit de configuração de usuário
```

#### Revisão Periódica

```markdown
## Last Updated: 2025-01-25

## Next Review: 2025-04-25

## Changelog

- 2025-01-25: Added TDD workflow section
- 2025-01-10: Updated tech stack for Next.js 14
- 2024-12-20: Added security review checklist
```

### 8.2 Colaboração em Equipe

#### Documentar Alterações de Configuração

Explique o motivo das alterações de configuração no Pull Request:

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

#### Revisão de Configuração

Alterações de configuração da equipe requerem code review:

```markdown
## CLAUDE.md Changes

- [ ] Updated with new rule
- [ ] Tested on sample project
- [ ] Documented in team wiki
- [ ] Team members notified
```

---

## Resumo da Lição

Esta lição apresentou três tipos principais de configuração do Everything Claude Code:

1. **Configuração de Projeto**: `CLAUDE.md` - Regras e padrões específicos do projeto
2. **Configuração de Usuário**: `~/.claude/CLAUDE.md` - Preferências pessoais de código e regras universais
3. **Barra de Status Personalizada**: `settings.json` - Exibição em tempo real de informações importantes

**Pontos-chave**:

- Arquivos de configuração usam formato Markdown, fáceis de editar e manter
- Configuração de projeto tem prioridade sobre configuração de usuário
- A barra de status usa códigos de cores ANSI, totalmente personalizável
- Projetos de equipe devem fazer commit do `CLAUDE.md` no Git

**Próximos passos**:

- Personalize o `CLAUDE.md` de acordo com o tipo do seu projeto
- Configure preferências de usuário e preferências pessoais
- Personalize a barra de status para exibir as informações que você precisa
- Faça commit da configuração no controle de versão (configuração de projeto)

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Changelog: Histórico de Versões e Alterações](../release-notes/)**.
>
> Você aprenderá:
> - Como visualizar o histórico de versões do Everything Claude Code
> - Entender alterações importantes e novos recursos
> - Como fazer upgrade de versão e migração
