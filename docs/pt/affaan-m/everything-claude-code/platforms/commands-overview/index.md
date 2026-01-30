---
title: "Commands: 15 Comandos Slash | Everything Claude Code"
subtitle: "Commands: 15 Comandos Slash | Everything Claude Code"
sidebarTitle: "Domine o Desenvolvimento com 15 Comandos"
description: "Aprenda os 15 comandos slash do Everything Claude Code. Domine comandos essenciais como /plan, /tdd, /code-review, /e2e, /verify e aumente sua produtividade no desenvolvimento."
tags:
  - "commands"
  - "slash-commands"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# Guia Completo dos Commands: Dominando os 15 Comandos Slash

## O Que Você Vai Aprender

- Iniciar rapidamente fluxos de desenvolvimento TDD para código de alta qualidade
- Criar planos de implementação sistemáticos, evitando etapas críticas esquecidas
- Executar revisões de código abrangentes e auditorias de segurança
- Gerar testes end-to-end para validar fluxos críticos do usuário
- Automatizar correções de erros de build, economizando tempo de depuração
- Limpar código morto com segurança, mantendo a base de código enxuta
- Extrair e reutilizar padrões de problemas já resolvidos
- Gerenciar estados de trabalho e checkpoints
- Executar verificações completas para garantir que o código está pronto

## Seus Desafios Atuais

Durante o desenvolvimento, você pode enfrentar estes problemas:

- **Não saber por onde começar** — Diante de novos requisitos, como dividir as etapas de implementação?
- **Baixa cobertura de testes** — Muito código escrito, mas testes insuficientes, dificultando garantir a qualidade
- **Erros de build acumulados** — Após modificar o código, erros de tipo surgem um após o outro, sem saber por onde começar a corrigir
- **Revisão de código não sistemática** — Depender apenas da inspeção visual facilita perder problemas de segurança
- **Resolver os mesmos problemas repetidamente** — Cair nas mesmas armadilhas que já encontrou antes

Os 15 comandos slash do Everything Claude Code foram projetados para resolver exatamente esses pontos problemáticos.

## Conceito Central

**Comandos são pontos de entrada para fluxos de trabalho**. Cada comando encapsula um fluxo de desenvolvimento completo, invocando os agents ou skills correspondentes para ajudá-lo a completar tarefas específicas.

::: tip Comando vs Agent vs Skill

- **Comando**: Atalho que você digita diretamente no Claude Code (como `/tdd`, `/plan`)
- **Agent**: Sub-agente especializado invocado pelo comando, responsável pela execução específica
- **Skill**: Definições de fluxo de trabalho e conhecimento de domínio que os Agents podem referenciar

Um comando geralmente invoca um ou mais agents, e os agents podem referenciar skills relacionados.

:::

## Visão Geral dos Comandos

15 comandos categorizados por função:

| Categoria | Comando | Finalidade |
| --- | --- | --- |
| **Fluxo de Desenvolvimento** | `/plan` | Criar plano de implementação |
| | `/tdd` | Executar desenvolvimento orientado a testes |
| | `/orchestrate` | Executar múltiplos agents em sequência |
| **Qualidade de Código** | `/code-review` | Revisão de código |
| | `/build-fix` | Corrigir erros de build |
| | `/refactor-clean` | Limpar código morto |
| | `/verify` | Verificação completa |
| **Testes** | `/e2e` | Testes end-to-end |
| | `/test-coverage` | Analisar cobertura de testes |
| | `/eval` | Gerenciar desenvolvimento orientado a eval |
| **Documentação e Arquitetura** | `/update-docs` | Sincronizar documentação |
| | `/update-codemaps` | Atualizar documentação de arquitetura |
| **Gerenciamento de Estado** | `/checkpoint` | Salvar estado de trabalho |
| **Aprendizado e Otimização** | `/learn` | Extrair padrões reutilizáveis |
| **Configuração** | `/setup-pm` | Configurar gerenciador de pacotes |

## Comandos de Fluxo de Desenvolvimento

### /plan: Planejar Funcionalidades Complexas

**Finalidade**: Criar um plano de implementação detalhado antes de começar a codificar.

**Cenários de Uso**:
- Iniciar desenvolvimento de nova funcionalidade
- Realizar mudanças arquiteturais significativas
- Quando os requisitos são pouco claros ou ambíguos
- Modificações coordenadas em múltiplos arquivos/componentes

**Fluxo de Trabalho**:

```
1. Reformular requisitos
   ↓
2. Identificar riscos e dependências
   ↓
3. Dividir em fases específicas
   ↓
4. Aguardar sua confirmação
```

::: warning Característica Principal

O planner agent **não escreve nenhum código** até você confirmar explicitamente o plano.

:::

**Exemplo**:

```
Você: /plan Preciso adicionar funcionalidade de notificações em tempo real

Claude:
# Implementation Plan: Real-Time Market Resolution Notifications

## Requirements Restatement
- Send notifications when markets resolve
- Support multiple channels (in-app, email, webhook)
- Ensure reliable delivery
- Include market outcome and user's position result

## Implementation Phases
### Phase 1: Database Schema
- Add notifications table
- Add user_notification_preferences table
- Create indexes

### Phase 2: Notification Service
- Create notification queue using BullMQ/Redis
- Implement retry logic
- Create notification templates

...

WAITING FOR CONFIRMATION: Proceed with this plan? (yes/no/modify)
```

**Melhores Práticas**:
- ✅ Planejar antes de implementar funcionalidades complexas
- ✅ Verificar cuidadosamente riscos e dependências
- ✅ Executar por fases, validando cada fase
- ❌ Não pular o planejamento

---

### /tdd: Desenvolvimento Orientado a Testes

**Finalidade**: Forçar a execução do fluxo TDD, garantindo cobertura de testes ≥ 80%.

**Cenários de Uso**:
- Implementar novas funcionalidades
- Corrigir bugs (primeiro escrever teste que reproduz o bug)
- Refatorar código existente
- Escrever lógica de negócio crítica

**Ciclo TDD**:

```
RED → GREEN → REFACTOR → REPEAT

RED:      Escrever um teste que falha
GREEN:    Escrever o mínimo de código para o teste passar
REFACTOR: Melhorar o código, mantendo os testes passando
REPEAT:   Próxima funcionalidade/cenário
```

::: warning Requisito Obrigatório

**Deve escrever o teste primeiro, depois o código**. Não pode pular a fase RED.

:::

**Exemplo**:

```
Você: /tdd Preciso de uma função para calcular pontuação de liquidez do mercado

Claude (tdd-guide agent):
## Step 1: Define Interface (SCAFFOLD)
```typescript
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}
```

## Step 2: Write Failing Test (RED)
```typescript
test('should return high score for liquid market', () => {
  const market = { ... }
  expect(calculateLiquidityScore(market)).toBeGreaterThan(80)
})
```

## Step 3: Run Tests - Verify FAIL
```bash
npm test lib/liquidity.test.ts
FAIL ✕ should return high score for liquid market
  Error: Not implemented
```

## Step 4: Implement Minimal Code (GREEN)
```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Código de implementação...
}
```

## Step 5: Run Tests - Verify PASS
```bash
npm test lib/liquidity.test.ts
PASS ✓ should return high score for liquid market
```

## Step 6: Refactor (IMPROVE)
// Melhorar estrutura do código...

## Step 7: Verify Tests Still Pass
```bash
npm test lib/liquidity.test.ts
PASS ✓ all tests passing
```

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)
```

**Melhores Práticas**:
- ✅ Definir interface primeiro
- ✅ Implementar após o teste falhar
- ✅ Testar imediatamente após completar cada funcionalidade
- ✅ Verificar testes antes e depois de refatorar
- ✅ Cobertura ≥ 80% (código crítico 100%)
- ❌ Não escrever muito código antes de testar
- ❌ Não pular a fase RED
- ❌ Não testar detalhes de implementação

---

### /orchestrate: Executar Agents em Sequência

**Finalidade**: Automatizar a execução de fluxos de trabalho sequenciais com múltiplos agents.

**Cenários de Uso**:
- Desenvolvimento completo de funcionalidade (planner → tdd-guide → code-reviewer → security-reviewer)
- Fluxo de correção de bugs (explorer → tdd-guide → code-reviewer)
- Auditoria de segurança (security-reviewer → code-reviewer → architect)

**Tipos de Fluxo de Trabalho**:

| Tipo de Fluxo | Sequência de Agents |
| --- | --- |
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**Exemplo**:

```
Você: /orchestrate feature "Adicionar funcionalidade de autenticação de usuário"

Claude:
### ORCHESTRATION REPORT
Workflow: feature
Task: Adicionar funcionalidade de autenticação de usuário
Agents: planner → tdd-guide → code-reviewer → security-reviewer

SUMMARY
-------
Funcionalidade de autenticação de usuário implementada com sucesso, incluindo registro, login e gerenciamento de sessão.

AGENT OUTPUTS
-------------
Planner: Criou plano de implementação em 4 fases
TDD Guide: Implementou serviço de autenticação, cobertura 95%
Code Reviewer: Encontrou 3 problemas de alta prioridade, corrigidos
Security Reviewer: Passou na auditoria de segurança, sem vulnerabilidades

FILES CHANGED
-------------
- src/services/auth.ts
- src/api/auth/route.ts
- tests/auth.test.ts
- ...

TEST RESULTS
------------
PASS: 24/24 tests (100%)

SECURITY STATUS
---------------
✅ No vulnerabilities found

RECOMMENDATION
--------------
✅ SHIP - Ready for production
```

**Melhores Práticas**:
- ✅ Usar orchestrate para funcionalidades complexas
- ✅ Documentação clara de handoff entre cada agent
- ✅ Executar verificações independentes em paralelo (code-reviewer e security-reviewer)
- ❌ Não usar orchestrate para tarefas simples

---

## Comandos de Qualidade de Código

### /code-review: Revisão de Código

**Finalidade**: Revisar completamente código não commitado, verificando problemas de segurança e qualidade de código.

**Cenários de Uso**:
- Antes de commitar código
- Antes de fazer merge de PR
- Após completar desenvolvimento de funcionalidade

**Itens de Verificação**:

| Categoria | Conteúdo da Verificação | Severidade |
| --- | --- | --- |
| **Segurança** | Chaves hardcoded, SQL injection, XSS, validação de entrada ausente | CRITICAL |
| **Qualidade de Código** | Função > 50 linhas, arquivo > 800 linhas, profundidade de aninhamento > 4 | HIGH |
| **Melhores Práticas** | Padrões de mutação, console.log, testes ausentes, TODO/FIXME | MEDIUM |

**Exemplo**:

```
Você: /code-review

Claude (code-reviewer agent):
# Code Review Report

## Security Issues (CRITICAL)
🔴 [HIGH] Hardcoded API key
File: src/api/github.ts:15
Issue: GitHub token is hardcoded
Fix: Move to environment variable

## Code Quality (HIGH)
🟡 [MEDIUM] Function exceeds 50 lines
File: src/utils/formatter.ts:62
Lines: 78
Issue: FormatLargeData function is too long
Fix: Split into smaller functions

## Best Practices (MEDIUM)
🟢 [LOW] TODO comment
File: src/services/user.ts:45
Issue: TODO: Add rate limiting
Fix: Implement or remove comment

SUMMARY
--------
CRITICAL: 1 (Must fix before commit)
HIGH: 2 (Should fix)
MEDIUM: 3 (Nice to have)

❌ BLOCKED - Critical security issues found
```

::: danger Regra de Bloqueio de Commit

Se forem encontrados problemas de nível **CRITICAL** ou **HIGH**, o commit será bloqueado.

:::

---

### /build-fix: Corrigir Erros de Build

**Finalidade**: Corrigir erros de TypeScript e build um por um.

**Cenários de Uso**:
- Quando `npm run build` falha
- Erros de tipo TypeScript
- Erros de compilação

**Fluxo de Trabalho**:

```
1. Executar build
   ↓
2. Analisar saída de erros, ordenar por severidade
   ↓
3. Corrigir um por um:
   - Mostrar contexto do erro
   - Explicar o problema
   - Propor solução
   - Aplicar correção
   - Re-executar build
   ↓
4. Gerar resumo de correções
```

**Exemplo**:

```
Você: /build-fix

Claude (build-error-resolver agent):
# Fixing Build Errors

Running build: npm run build
Found 5 errors

## Error 1: Type 'string' is not assignable to type 'number'
File: src/calculator.ts:15
```typescript
const result = add("10", "20")  // Error
```
Issue: add function expects numbers, received strings
Fix: Convert to numbers
```typescript
const result = add(Number("10"), Number("20"))
```
✅ Fixed. Re-running build...

## Error 2: Cannot find module './utils'
File: src/index.ts:3
Issue: Import path is incorrect
Fix: Change to './utils/helper'
```typescript
import { helper } from './utils/helper'
```
✅ Fixed. Re-running build...

...

SUMMARY
-------
Errors Fixed: 5
Errors Remaining: 0
Build Status: ✅ PASS
```

::: tip Segurança em Primeiro Lugar

Corrigir apenas um erro por vez, prevenindo a introdução de novos problemas.

:::

---

### /refactor-clean: Limpar Código Morto

**Finalidade**: Identificar e remover código não utilizado com segurança.

**Cenários de Uso**:
- Base de código com muitos arquivos e exports não utilizados
- Reduzir carga de manutenção
- Melhorar legibilidade do código

**Fluxo de Trabalho**:

```
1. Executar ferramentas de análise de código morto
   - knip: Encontrar exports e arquivos não utilizados
   - depcheck: Encontrar dependências não utilizadas
   - ts-prune: Encontrar exports TypeScript não utilizados
   ↓
2. Gerar relatório abrangente
   ↓
3. Classificar por severidade
   - SAFE: Arquivos de teste, funções utilitárias não utilizadas
   - CAUTION: Rotas de API, componentes
   - DANGER: Arquivos de configuração, arquivos de entrada
   ↓
4. Deletar um por um (testar primeiro)
   ↓
5. Gerar resumo de limpeza
```

**Exemplo**:

```
Você: /refactor-clean

Claude (refactor-cleaner agent):
# Dead Code Analysis

## Tools Run
- ✅ knip: Found 12 unused exports
- ✅ depcheck: Found 5 unused dependencies
- ✅ ts-prune: Found 8 unused TypeScript exports

## Classification

### SAFE (Can delete)
- `src/utils/old-helper.ts` - Unused utility function
- `src/components/Button.tsx` - Not used anywhere
- `lodash` - Unused dependency

### CAUTION (Review first)
- `src/api/users.ts` - Only used in tests
- `@types/node` - May be used in build scripts

### DANGER (Do not delete)
- `src/index.ts` - Main entry point
- `tsconfig.json` - Configuration file

## Deletion Plan

Run full test suite first:
✅ Tests passing (98% coverage)

Deleting SAFE items...

1. Removing src/utils/old-helper.ts
   ✅ Tests still passing

2. Removing src/components/Button.tsx
   ✅ Tests still passing

3. Removing lodash from package.json
   ✅ Tests still passing

SUMMARY
-------
Files deleted: 12
Dependencies removed: 5
Tests still passing: ✅
```

::: warning Testes Primeiro

**Deve executar testes antes de deletar código**, garantindo que funcionalidades existentes não sejam quebradas.

:::

---

### /verify: Verificação Completa

**Finalidade**: Executar verificações completas de validação de código.

**Cenários de Uso**:
- Antes de commitar código
- Antes de fazer merge de PR
- Ao preparar para release

**Itens de Verificação** (em ordem):

1. **Verificação de Build** - Executar comando de build
2. **Verificação de Tipos** - Executar verificador TypeScript
3. **Verificação de Lint** - Executar linter
4. **Suite de Testes** - Executar todos os testes, reportar cobertura
5. **Auditoria de Console.log** - Buscar console.log em arquivos fonte
6. **Status do Git** - Mostrar mudanças não commitadas

**Exemplo**:

```
Você: /verify pre-pr

Claude:
# Verification Report

VERIFICATION: ✅ PASS

Build:    ✅ OK
Types:    ✅ OK (0 errors)
Lint:     ✅ OK (0 issues)
Tests:    ✅ 142/145 passed, 98% coverage
Secrets:  ✅ OK (0 found)
Logs:     ⚠️ 3 console.logs found

Console.log locations:
- src/utils/logger.ts:15 (intentional logger)
- src/api/webhook.ts:42 (debug, remove before commit)
- src/services/auth.ts:89 (debug, remove before commit)

Ready for PR: ⚠️ YES (remove debug logs)

Files modified since last commit:
- src/api/webhook.ts (new)
- src/services/auth.ts (modified)
- tests/auth.test.ts (modified)
```

**Parâmetros**:
- `quick` - Apenas build + verificação de tipos
- `full` - Todas as verificações (padrão)
- `pre-commit` - Verificações relacionadas a commit
- `pre-pr` - Verificações completas + scan de segurança

---

## Comandos de Testes

### /e2e: Testes End-to-End

**Finalidade**: Gerar e executar testes end-to-end usando Playwright.

**Cenários de Uso**:
- Testar fluxos críticos do usuário (login, transações, pagamentos)
- Validar integração end-to-end de fluxos multi-etapas
- Testar interações de UI e navegação
- Preparar para deploy em produção

**Fluxo de Trabalho**:

```
1. Analisar fluxo do usuário, identificar cenários de teste
   ↓
2. Gerar testes Playwright (usando padrão Page Object)
   ↓
3. Executar testes em múltiplos navegadores (Chrome, Firefox, Safari)
   ↓
4. Capturar screenshots, vídeos, traces em caso de falha
   ↓
5. Gerar relatório com resultados e artefatos
   ↓
6. Identificar testes instáveis e sugerir correções
```

**Exemplo**:

```
Você: /e2e Testar fluxo de busca e visualização de mercado

Claude (e2e-runner agent):
# E2E Test Generation: Market Search and View Flow

## Test Scenario Identified
**User Journey:** Market Search → View Results → Click Market → View Details

## Generated Test Code
```typescript
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test('user can search markets and view details', async ({ page }) => {
  const marketsPage = new MarketsPage(page)
  await marketsPage.goto()

  // Perform search
  await marketsPage.searchMarkets('election')
  await page.waitForResponse(resp =>
    resp.url().includes('/api/markets/search') && resp.status() === 200
  )

  // Verify results
  const marketCards = marketsPage.marketCards
  await expect(marketCards.first()).toBeVisible()

  // Click on first result
  await marketCards.first().click()

  // Verify market details page loads
  await expect(page).toHaveURL(/\/markets\/[a-z0-9-]+/)
  await expect(page.locator('[data-testid="market-name"]')).toBeVisible()
})
```

## Running Tests
```bash
npx playwright test tests/e2e/markets/search-and-view.spec.ts

✓ [chromium] user can search markets and view details (4.2s)
✓ [chromium] search with no results shows empty state (1.8s)

2 passed (6.0s)

Artifacts generated:
- artifacts/search-results.png
- artifacts/market-details.png
- playwright-report/index.html
```

## Test Report
╔══════════════════════════════════════════════════════╗
║ Status:     ✅ ALL TESTS PASSED                       ║
║ Total:      2 tests                                    ║
║ Passed:     2 (100%)                                   ║
║ Flaky:      0                                           ║
╚══════════════════════════════════════════════════════╝
```

**Comandos Rápidos**:

```bash
# Executar todos os testes E2E
npx playwright test

# Executar arquivo de teste específico
npx playwright test tests/e2e/markets/search.spec.ts

# Executar em modo headed (ver o navegador)
npx playwright test --headed

# Depurar testes
npx playwright test --debug

# Ver relatório
npx playwright show-report
```

**Melhores Práticas**:
- ✅ Usar Page Object Model para melhor manutenibilidade
- ✅ Usar atributos data-testid como seletores
- ✅ Aguardar respostas de API, não timeouts arbitrários
- ✅ Testar fluxos críticos do usuário
- ❌ Não usar seletores frágeis (classes CSS mudam)
- ❌ Não testar detalhes de implementação

---

### /test-coverage: Análise de Cobertura de Testes

**Finalidade**: Analisar cobertura de testes e gerar testes faltantes.

**Cenários de Uso**:
- Cobertura abaixo de 80%
- Necessidade de complementar testes

**Fluxo de Trabalho**:

```
1. Executar testes com cobertura
   ↓
2. Analisar relatório de cobertura (coverage/coverage-summary.json)
   ↓
3. Identificar arquivos abaixo do limite de 80%
   ↓
4. Para cada arquivo com cobertura insuficiente:
   - Analisar caminhos de código não testados
   - Gerar testes unitários para funções
   - Gerar testes de integração para APIs
   ↓
5. Verificar se novos testes passam
   ↓
6. Mostrar métricas de cobertura antes e depois
```

**Exemplo**:

```
Você: /test-coverage

Claude:
# Test Coverage Analysis

Running tests with coverage...
npm test --coverage

## Coverage Report

File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   65    |   50     |   75    |   63  ⚠️
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   45    |   30     |   50    |   44  ⚠️

Overall                   |   78    |   72     |   85    |   76  ⚠️

Target: 80%
Current: 76% ❌ Need to improve

## Generating Missing Tests

### File: src/utils/formatter.ts (65% coverage)
Untested paths:
- FormatCurrency with negative values
- FormatDate with custom locale
- TruncateText with long strings

Generating tests...
```typescript
describe('formatter', () => {
  it('should format negative currency', () => {
    expect(formatCurrency(-100)).toBe('-$100.00')
  })

  it('should format date with custom locale', () => {
    expect(formatDate(new Date(), 'ja-JP')).toMatch('2024年')
  })

  it('should truncate long text', () => {
    expect(truncateText('a'.repeat(100), 10)).toBe('aaaaaaaaaa...')
  })
})
```

### File: src/components/Button.tsx (45% coverage)
Untested paths:
- Disabled state
- Loading state
- onClick handler

Generating tests...

## After Adding Tests

Running tests again...

File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   100   |   95     |   100   |   99  ✅
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   95    |   90     |   100   |   94  ✅

Overall                   |   95    |   92     |   100   |   94  ✅

Target: 80%
Current: 94% ✅ EXCEEDED

Summary: +12 tests added, Coverage: 76% → 94%
```

---

### /eval: Desenvolvimento Orientado a Avaliação

**Finalidade**: Gerenciar fluxo de trabalho de desenvolvimento orientado a eval.

**Cenários de Uso**:
- Desenvolvimento orientado a avaliação (EDD)
- Testes de aceitação de funcionalidades
- Testes de regressão

**Subcomandos**:

- `define <name>` - Criar nova definição de eval
- `check <name>` - Executar e verificar evals
- `report <name>` - Gerar relatório completo
- `list` - Mostrar todos os evals

**Exemplo - Definir Eval**:

```
Você: /eval define user-auth

Claude:
Criando definição de eval...

.claude/evals/user-auth.md:

## EVAL: user-auth
Created: 2026-01-25

### Capability Evals
- [ ] User can register with email and password
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong password
- [ ] User can reset password via email

### Regression Evals
- [ ] Existing users can still login
- [ ] Session tokens still work
- [ ] OAuth login still works

### Success Criteria
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals

Por favor, preencha os critérios de avaliação específicos...
```

**Exemplo - Verificar Eval**:

```
Você: /eval check user-auth

Claude:
Executando evals...

EVAL CHECK: user-auth
=======================
Capability: 2/4 passing
Regression: 2/3 passing
Status: IN PROGRESS

Capability Results:
✅ User can register with email and password
✅ User can login with correct credentials
❌ User cannot login with wrong password (fails intermittently)
❌ User can reset password via email (not implemented)

Regression Results:
✅ Existing users can still login
✅ Session tokens still work
❌ OAuth login still works (test failing due to rate limit)

RECOMMENDATION: NEEDS WORK - Fix password validation and implement password reset
```

**Exemplo - Relatório de Eval**:

```
Você: /eval report user-auth

Claude:
Gerando relatório abrangente...

EVAL REPORT: user-auth
=========================
Generated: 2026-01-25

CAPABILITY EVALS
----------------
[register-email-pass]: PASS (pass@1)
[login-credentials-pass]: PASS (pass@2) - required retry
[login-wrong-pass-fail]: FAIL - see notes
[password-reset-pass]: FAIL - not implemented

REGRESSION EVALS
----------------
[existing-users-login]: PASS
[session-tokens]: PASS
[oauth-login]: PASS

METRICS
-------
Capability pass@1: 50%
Capability pass@3: 100%
Regression pass^3: 100%

NOTES
-----
Password validation test is flaky due to timing issue.
Need to implement password reset flow.

RECOMMENDATION
--------------
NEEDS WORK - Complete password reset implementation
```

---

## Comandos de Documentação e Arquitetura

### /update-docs: Sincronizar Documentação

**Finalidade**: Sincronizar documentação a partir do código fonte.

**Cenários de Uso**:
- Atualizar documentação após mudanças no código
- Manter documentação sincronizada com o código

**Fluxo de Trabalho**:

```
1. Ler seção scripts do package.json
   - Gerar tabela de referência de scripts
   - Extrair descrições dos comentários
   ↓
2. Ler .env.example
   - Extrair todas as variáveis de ambiente
   - Documentar finalidade e formato
   ↓
3. Gerar docs/CONTRIB.md
   - Fluxo de trabalho de desenvolvimento
   - Scripts disponíveis
   - Configuração de ambiente
   - Procedimentos de teste
   ↓
4. Gerar docs/RUNBOOK.md
   - Procedimentos de deploy
   - Monitoramento e alertas
   - Problemas comuns e correções
   - Procedimentos de rollback
   ↓
5. Identificar documentação desatualizada
   - Encontrar documentos não modificados há 90+ dias
   - Listar para revisão manual
   ↓
6. Mostrar resumo de diff
```

::: tip Fonte Única da Verdade

package.json e .env.example são as únicas fontes da verdade.

:::

---

### /update-codemaps: Atualizar Documentação de Arquitetura

**Finalidade**: Analisar estrutura da base de código e atualizar documentação de arquitetura.

**Cenários de Uso**:
- Após mudanças na estrutura do código
- Quando precisa atualizar documentação de arquitetura

**Fluxo de Trabalho**:

```
1. Escanear todos os arquivos fonte para imports, exports e dependências
   ↓
2. Gerar codemaps concisos:
   - codemaps/architecture.md - Arquitetura geral
   - codemaps/backend.md - Estrutura do backend
   - codemaps/frontend.md - Estrutura do frontend
   - codemaps/data.md - Modelos de dados e schemas
   ↓
3. Calcular percentual de diff com versão anterior
   ↓
4. Se mudança > 30%, solicitar aprovação do usuário antes de atualizar
   ↓
5. Adicionar timestamp de atualização para cada codemap
   ↓
6. Salvar relatório em .reports/codemap-diff.txt
```

**Exemplo**:

```
Você: /update-codemaps

Claude:
Analisando estrutura da base de código...

Scanning 156 files...
Found 89 imports and 124 exports

## Codemap Diff

Previous version: 2026-01-20
Current version: 2026-01-25
Diff: 12% (under 30% threshold)

✅ Safe to update

## Updated Codemaps

codemaps/architecture.md
- Updated module dependencies
- Added new services: auth, notifications
- Removed deprecated modules: legacy-db

codemaps/backend.md
- Updated API routes structure
- Added middleware documentation

codemaps/frontend.md
- Updated component hierarchy
- Added new pages: profile, settings

codemaps/data.md
- Updated database schemas
- Added new tables: users, sessions

Summary: 4 codemaps updated, 12% change
```

---

## Comandos de Gerenciamento de Estado

### /checkpoint: Salvar Estado de Trabalho

**Finalidade**: Criar ou verificar checkpoints no fluxo de trabalho.

**Cenários de Uso**:
- Salvar estágios importantes de desenvolvimento
- Suportar rollback e rastreamento de progresso

**Subcomandos**:

- `create <name>` - Criar checkpoint nomeado
- `verify <name>` - Verificar checkpoint
- `list` - Mostrar todos os checkpoints
- `clear` - Remover checkpoints antigos (manter os 5 mais recentes)

**Exemplo**:

```
Você: /checkpoint create feature-start

Claude:
# Creating Checkpoint: feature-start

Running /verify quick...

Build: ✅ OK
Types: ✅ OK

Creating checkpoint...

✅ Checkpoint "feature-start" created
├─ Timestamp: 2026-01-25-14:30
├─ Git SHA: abc1234
└─ Status: Clean (no uncommitted changes)
```

```
Você: /checkpoint verify feature-start

Claude:
CHECKPOINT COMPARISON: feature-start
===========================
Files changed: 5
Tests: +3 passed / -0 failed
Coverage: +5% / -0%
Build: PASS

Changes since checkpoint:
✅ src/services/auth.ts (modified)
✅ tests/auth.test.ts (added)
✅ src/components/Login.tsx (added)
```

**Fluxo de Trabalho**:

```
[Início] → /checkpoint create "feature-start"
   |
[Implementação] → /checkpoint create "core-done"
   |
[Testes] → /checkpoint verify "core-done"
   |
[Refatoração] → /checkpoint create "refactor-done"
   |
[PR] → /checkpoint verify "feature-start"
```

---

## Comandos de Aprendizado e Otimização

### /learn: Extrair Padrões Reutilizáveis

**Finalidade**: Analisar a sessão atual e extrair padrões que podem ser salvos como skills.

**Cenários de Uso**:
- Após resolver problemas não triviais
- Descobrir padrões reutilizáveis de resolução de erros
- Documentar convenções específicas do projeto

**Conteúdo Extraído**:

1. **Padrões de Resolução de Erros**
   - Qual erro ocorreu?
   - Qual foi a causa raiz?
   - Como foi corrigido?
   - É reutilizável para erros similares?

2. **Técnicas de Depuração**
   - Passos de depuração não óbvios
   - Combinações eficazes de ferramentas
   - Padrões de diagnóstico

3. **Workarounds**
   - Peculiaridades de bibliotecas
   - Limitações de APIs
   - Correções específicas de versão

4. **Padrões Específicos do Projeto**
   - Convenções da base de código descobertas
   - Decisões arquiteturais tomadas
   - Padrões de integração

**Exemplo**:

```
Você: /learn

Claude:
# Extracting Patterns from Session

Reviewing session history...

Found 3 extractable patterns:

## Pattern 1: Supabase Auth Session Recovery
**Type:** Error Resolution
**Reusability:** High (affects all auth endpoints)

### Problem
After user logs in, subsequent API calls fail with 401 Unauthorized.

### Root Cause
Supabase session cookie is not being sent to backend API due to CORS configuration.

### Solution
```typescript
// Configure Supabase with correct URL
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

### When to Use
Trigger: Auth endpoints returning 401 unexpectedly

---

## Pattern 2: Playwright Test Flakiness Fix
**Type:** Debugging Technique
**Reusability:** Medium (affects async UI tests)

### Problem
Test "user can click submit button" fails intermittently with timeout.

### Root Cause
Button is disabled initially due to async validation, but test doesn't wait.

### Solution
```typescript
// Use explicit wait with predicate
await page.waitForSelector('[data-testid="submit-btn"]:not(:disabled)', {
  timeout: 10000
})

// Then click
await page.locator('[data-testid="submit-btn"]').click()
```

### When to Use
Trigger: Test timing issues with async UI state

---

Do you want to save these patterns? (yes/no/modify)
```

::: tip Princípio de Foco

Extrair um padrão por vez, mantendo os skills focados.

:::

---

## Comandos de Configuração

### /setup-pm: Configurar Gerenciador de Pacotes

**Finalidade**: Configurar o gerenciador de pacotes preferido para o projeto ou globalmente.

**Cenários de Uso**:
- Detectar o gerenciador de pacotes atual
- Definir preferência global ou por projeto

**Prioridade de Detecção**:

1. Variável de ambiente: `CLAUDE_PACKAGE_MANAGER`
2. Configuração do projeto: `.claude/package-manager.json`
3. package.json: campo `packageManager`
4. Arquivos de lock: package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb
5. Configuração global: `~/.claude/package-manager.json`
6. Fallback: primeiro gerenciador de pacotes disponível

**Prioridade de Gerenciadores de Pacotes Suportados**: pnpm > bun > yarn > npm

**Exemplo**:

```bash
# Detectar gerenciador de pacotes atual
node scripts/setup-package-manager.js --detect

# Definir preferência global
node scripts/setup-package-manager.js --global pnpm

# Definir preferência do projeto
node scripts/setup-package-manager.js --project bun

# Listar gerenciadores de pacotes disponíveis
node scripts/setup-package-manager.js --list
```

**Arquivos de Configuração**:

Configuração global (`~/.claude/package-manager.json`):
```json
{
  "packageManager": "pnpm"
}
```

Configuração do projeto (`.claude/package-manager.json`):
```json
{
  "packageManager": "bun"
}
```

Variável de ambiente sobrescreve todos os métodos de detecção:
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

---

## Fluxos de Trabalho Combinados

### Fluxo Completo de Desenvolvimento de Funcionalidade

```
1. /plan "Adicionar funcionalidade de autenticação de usuário"
   ↓ Criar plano de implementação
2. /tdd "Implementar serviço de autenticação"
   ↓ Desenvolvimento TDD
3. /test-coverage
   ↓ Garantir cobertura ≥ 80%
4. /code-review
   ↓ Revisão de código
5. /verify pre-pr
   ↓ Verificação completa
6. /checkpoint create "auth-feature-done"
   ↓ Salvar checkpoint
7. /update-docs
   ↓ Atualizar documentação
8. /update-codemaps
   ↓ Atualizar documentação de arquitetura
```

### Fluxo de Correção de Bug

```
1. /checkpoint create "bug-start"
   ↓ Salvar estado atual
2. /orchestrate bugfix "Corrigir erro de login"
   ↓ Fluxo automatizado de correção de bug
3. /test-coverage
   ↓ Garantir cobertura de testes
4. /verify quick
   ↓ Verificar correção
5. /checkpoint verify "bug-start"
   ↓ Comparar com checkpoint
```

### Fluxo de Auditoria de Segurança

```
1. /orchestrate security "Auditar fluxo de pagamento"
   ↓ Fluxo de revisão com prioridade em segurança
2. /e2e "Testar fluxo de pagamento"
   ↓ Testes end-to-end
3. /code-review
   ↓ Revisão de código
4. /verify pre-pr
   ↓ Verificação completa
```

---

## Tabela de Referência Rápida de Comandos

| Comando | Finalidade Principal | Agent Acionado | Saída |
| --- | --- | --- | --- |
| `/plan` | Criar plano de implementação | planner | Plano em fases |
| `/tdd` | Desenvolvimento TDD | tdd-guide | Testes + Implementação + Cobertura |
| `/orchestrate` | Executar agents em sequência | múltiplos agents | Relatório abrangente |
| `/code-review` | Revisão de código | code-reviewer, security-reviewer | Relatório de segurança e qualidade |
| `/build-fix` | Corrigir erros de build | build-error-resolver | Resumo de correções |
| `/refactor-clean` | Limpar código morto | refactor-cleaner | Resumo de limpeza |
| `/verify` | Verificação completa | Bash | Relatório de verificação |
| `/e2e` | Testes end-to-end | e2e-runner | Testes Playwright + Artefatos |
| `/test-coverage` | Analisar cobertura | Bash | Relatório de cobertura + Testes faltantes |
| `/eval` | Desenvolvimento orientado a avaliação | Bash | Relatório de status de eval |
| `/checkpoint` | Salvar estado | Bash + Git | Relatório de checkpoint |
| `/learn` | Extrair padrões | continuous-learning skill | Arquivo de skill |
| `/update-docs` | Sincronizar documentação | doc-updater agent | Atualização de documentação |
| `/update-codemaps` | Atualizar arquitetura | doc-updater agent | Atualização de codemap |
| `/setup-pm` | Configurar gerenciador de pacotes | Script Node.js | Detecção de gerenciador de pacotes |

---

## Armadilhas a Evitar

### ❌ Não Pule a Fase de Planejamento

Para funcionalidades complexas, começar a codificar diretamente leva a:
- Dependências importantes esquecidas
- Arquitetura inconsistente
- Desvio na compreensão dos requisitos

**✅ Abordagem Correta**: Use `/plan` para criar um plano detalhado, aguarde confirmação antes de implementar.

---

### ❌ Não Pule a Fase RED no TDD

Escrever código antes dos testes não é TDD.

**✅ Abordagem Correta**: Execute rigorosamente o ciclo RED → GREEN → REFACTOR.

---

### ❌ Não Ignore Problemas CRITICAL do /code-review

Vulnerabilidades de segurança podem levar a vazamento de dados, perdas financeiras e outras consequências graves.

**✅ Abordagem Correta**: Corrija todos os problemas de nível CRITICAL e HIGH antes de commitar.

---

### ❌ Não Delete Código Sem Testar Primeiro

A análise de código morto pode ter falsos positivos, deletar diretamente pode quebrar funcionalidades.

**✅ Abordagem Correta**: Execute testes antes de cada deleção, garantindo que funcionalidades existentes não sejam quebradas.

---

### ❌ Não Esqueça de Usar /learn

Não extrair padrões após resolver problemas não triviais significa resolver o mesmo problema do zero na próxima vez.

**✅ Abordagem Correta**: Use `/learn` regularmente para extrair padrões reutilizáveis e acumular conhecimento.

---

## Resumo da Lição

Os 15 comandos slash do Everything Claude Code fornecem suporte completo ao fluxo de trabalho de desenvolvimento:

- **Fluxo de Desenvolvimento**: `/plan` → `/tdd` → `/orchestrate`
- **Qualidade de Código**: `/code-review` → `/build-fix` → `/refactor-clean` → `/verify`
- **Testes**: `/e2e` → `/test-coverage` → `/eval`
- **Documentação e Arquitetura**: `/update-docs` → `/update-codemaps`
- **Gerenciamento de Estado**: `/checkpoint`
- **Aprendizado e Otimização**: `/learn`
- **Configuração**: `/setup-pm`

Dominando esses comandos, você pode completar seu trabalho de desenvolvimento de forma eficiente, segura e com qualidade.

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Guia Detalhado dos Agents Principais](../agents-overview/)**.
>
> Você aprenderá:
> - Responsabilidades e cenários de uso dos 9 agents especializados
> - Quando invocar qual agent
> - Como os agents colaboram entre si
> - Como personalizar configurações de agents

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Comando TDD | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Comando Plan | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Comando Code Review | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| Comando E2E | [`commands/e2e.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/e2e.md) | 1-364 |
| Comando Build Fix | [`commands/build-fix.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/build-fix.md) | 1-30 |
| Comando Refactor Clean | [`commands/refactor-clean.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/refactor-clean.md) | 1-29 |
| Comando Learn | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Comando Checkpoint | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Comando Verify | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Comando Test Coverage | [`commands/test-coverage.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/test-coverage.md) | 1-28 |
| Comando Setup PM | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md) | 1-81 |
| Comando Update Docs | [`commands/update-docs.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-docs.md) | 1-32 |
| Comando Orchestrate | [`commands/orchestrate.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/orchestrate.md) | 1-173 |
| Comando Update Codemaps | [`commands/update-codemaps.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-codemaps.md) | 1-18 |
| Comando Eval | [`commands/eval.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/eval.md) | 1-121 |
| Definição do Plugin | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |

**Constantes Principais**:
- Meta de cobertura TDD: 80% (código crítico 100%) - `commands/tdd.md:293-300`

**Funções Principais**:
- Ciclo TDD: RED → GREEN → REFACTOR - `commands/tdd.md:40-47`
- Mecanismo de aguardar confirmação do Plan - `commands/plan.md:96`
- Níveis de severidade do Code Review: CRITICAL, HIGH, MEDIUM - `commands/code-review.md:33`

</details>
