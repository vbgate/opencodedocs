---
title: "Fluxo de Desenvolvimento TDD: Red-Green-Refactor | everything-claude-code"
sidebarTitle: "Teste Primeiro, Código Depois"
subtitle: "Fluxo de Desenvolvimento TDD: Red-Green-Refactor"
description: "Aprenda o fluxo de desenvolvimento TDD do Everything Claude Code. Domine os comandos /plan, /tdd, /code-review, /verify para alcançar 80%+ de cobertura de testes."
tags:
  - "tdd"
  - "test-driven-development"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 70
---

# Fluxo de Desenvolvimento TDD: Ciclo Completo Red-Green-Refactor de /plan a /verify

## O Que Você Será Capaz de Fazer

- Usar o comando `/plan` para criar planos de implementação sistemáticos, evitando omissões
- Aplicar o comando `/tdd` para executar desenvolvimento orientado a testes, seguindo o ciclo RED-GREEN-REFACTOR
- Garantir segurança e qualidade do código através do `/code-review`
- Usar `/verify` para validar se o código pode ser commitado com segurança
- Alcançar 80%+ de cobertura de testes, estabelecendo uma suíte de testes confiável

## Seu Dilema Atual

Ao desenvolver novos recursos, você já enfrentou estas situações:

- Descobrir que entendeu mal os requisitos após escrever o código, tendo que refazer tudo
- Baixa cobertura de testes, descobrindo bugs após o deploy
- Problemas de segurança encontrados na revisão de código, sendo rejeitado
- Descobrir erros de tipo ou falhas de build após o commit
- Não saber quando escrever testes, resultando em testes incompletos

Esses problemas levam a baixa eficiência de desenvolvimento e dificuldade em garantir qualidade do código.

## Quando Usar Esta Técnica

Cenários para usar o fluxo de desenvolvimento TDD:

- **Desenvolver novos recursos**: Da necessidade à implementação, garantindo funcionalidade completa e testes adequados
- **Corrigir bugs**: Escrever testes para reproduzir o bug primeiro, depois corrigir, garantindo que não introduza novos problemas
- **Refatorar código**: Com proteção de testes, refatore a estrutura do código com confiança
- **Implementar endpoints de API**: Escrever testes de integração para verificar a correção da interface
- **Desenvolver lógica de negócio central**: Cálculos financeiros, autenticação e outros códigos críticos precisam de 100% de cobertura de testes

::: tip Princípio Central
Desenvolvimento orientado a testes não é apenas um fluxo simples de escrever testes primeiro, mas um método sistemático para garantir qualidade de código e melhorar eficiência de desenvolvimento. Todo código novo deve ser implementado através do fluxo TDD.
:::

## Ideia Central

O fluxo de desenvolvimento TDD consiste em 4 comandos principais, formando um ciclo completo de desenvolvimento:

```
1. /plan     → Planejamento: Clarificar requisitos, identificar riscos, implementação em fases
2. /tdd      → Implementação: Testes primeiro, código mínimo, refatoração contínua
3. /code-review → Revisão: Verificação de segurança, avaliação de qualidade, melhores práticas
4. /verify   → Validação: Build, tipos, testes, auditoria de código
```

**Por que este fluxo funciona**:

- **Planejamento primeiro**: `/plan` garante compreensão correta, evitando direção errada
- **Orientado a testes**: `/tdd` força testes primeiro, garantindo que cada funcionalidade tenha proteção de testes
- **Revisão como controle**: `/code-review` descobre vulnerabilidades de segurança e problemas de qualidade de código
- **Validação final**: `/verify` garante que o código pode ser commitado com segurança

## 🎒 Preparação Antes de Começar

Antes de iniciar o fluxo de desenvolvimento TDD, confirme:

- ✅ Plugin Everything Claude Code já instalado
- ✅ Projeto configurado com framework de testes (Jest, Vitest, etc.)
- ✅ Projeto tem fluxo básico de build (`npm run build`)
- ✅ Familiarizado com o uso básico de comandos no [Início Rápido](../../start/quickstart/)

::: warning Pré-requisitos
Este tutorial assume que você já está familiarizado com as operações básicas do [Início Rápido](../../start/quickstart/). Se ainda não completou a instalação, leia primeiro o [Guia de Instalação](../../start/installation/).
:::

## Mãos à Obra: Fluxo Completo de Desenvolvimento TDD

Vamos aprender todo o fluxo através de um exemplo prático. Suponha que você precise implementar um recurso de "Calculadora de Pontuação de Liquidez de Mercado".

### Passo 1: Usar /plan para Criar Plano de Implementação

**Por quê**
A fase de planejamento garante que você entendeu os requisitos, identificou riscos potenciais e evitou retrabalho posterior.

**Operação**
No Claude Code, digite:

```
/plan Preciso implementar uma calculadora de pontuação de liquidez de mercado que calcule uma pontuação (0-100) baseada em volume de negociação, spread bid-ask, número de traders ativos e tempo da última negociação
```

**O que você deve ver**
O planner agent gerará um plano de implementação detalhado:

```markdown
## Implementation Plan: Calculadora de Pontuação de Liquidez de Mercado

## Requirements Restatement
- Calcular pontuação de liquidez de mercado (0-100) baseada em múltiplos indicadores
- Pontuação mais alta indica melhor liquidez de mercado
- Considerar volume de negociação, spread bid-ask, traders ativos, tempo da última negociação

## Implementation Phases

### Phase 1: Define Interface
- Criar interface `MarketData` definindo dados de entrada
- Definir assinatura da função `calculateLiquidityScore`

### Phase 2: Write Tests
- Escrever testes unitários cobrindo vários cenários
- Condições de borda: volume zero, valores extremos
- Tratamento de erros: campos ausentes, tipos inválidos

### Phase 3: Implement Calculation
- Implementar algoritmo de pontuação
- Cálculo ponderado de cada indicador
- Normalizar para faixa 0-100

### Phase 4: Integration
- Integrar à API existente
- Adicionar endpoint expondo funcionalidade de cálculo
- Documentar método de uso

## Dependencies
- Sem dependências externas

## Risks
- MEDIUM: Algoritmo de pontuação pode precisar ajuste de pesos
- LOW: Tratamento de condições de borda

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

**Checkpoint ✅**
- Confirmar compreensão correta dos requisitos
- Confirmar que as etapas de implementação são razoáveis
- Verificar se há riscos omitidos

**Próximo passo**
Se o plano estiver correto, responda `yes` ou `proceed`. Se precisar de modificações, explique as mudanças específicas.

---

### Passo 2: Usar /tdd para Executar Desenvolvimento Orientado a Testes

**Por quê**
O comando `/tdd` força testes primeiro, garantindo que cada funcionalidade tenha proteção de testes, evitando a dor de adicionar testes posteriormente.

**Operação**
Após confirmar o plano, digite:

```
/tdd Implementar calculadora de pontuação de liquidez de mercado conforme o plano
```

**O que você deve ver**
O tdd-guide agent guiará você através do fluxo TDD:

#### Fase RED: Escrever Testes Primeiro

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: Implementation
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
      lastTradeTime: new Date(Date.now() - 86400000) // 1 dia atrás
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

## Você deve ver os testes falhando
FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market
    Error: Not implemented
```

✅ **Testes falhando, conforme esperado**

#### Fase GREEN: Implementar Código Mínimo

```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Tratar caso de borda de volume zero
  if (market.totalVolume === 0) {
    return 0
  }

  // Calcular pontuações de componentes (escala 0-100)
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // Bônus de atividade recente
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // Média ponderada
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // Limitar a 0-100
}
```

```bash
npm test lib/liquidity.test.ts

## Você deve ver os testes passando
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **Todos os testes passando**

#### Fase REFACTOR: Melhorar o Código

```typescript
// lib/liquidity.ts - Após refatoração
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

## Você deve ver os testes ainda passando
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **Refatoração completa, testes ainda passando**

#### Verificar Cobertura

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 80%)
```

✅ **Fluxo TDD completo, cobertura atende aos requisitos**

**Checkpoint ✅**
- Testes escritos antes do código (RED)
- Implementação após falha dos testes (GREEN)
- Refatoração após código passar (REFACTOR)
- Cobertura acima de 80%

---

### Passo 3: Usar /code-review para Revisar o Código

**Por quê**
A revisão de código pode descobrir problemas de segurança, qualidade de código e melhores práticas, garantindo que o código possa ser mesclado com segurança.

**Operação**
Digite:

```
/code-review
```

**O que você deve ver**
O code-reviewer agent verificará:

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

**Próximo passo**
Corrigir problemas conforme o relatório de revisão:

```typescript
// Remover console.log
// console.log(`Calculated score: ${score}`)  // Removido
return clamp(weightedScore, 0, 100)
```

**Checkpoint ✅**
- Corrigir todos os problemas de nível CRITICAL
- Corrigir ou explicar problemas de nível HIGH
- Verificar se a qualidade do código atende aos padrões

---

### Passo 4: Usar /verify para Validar o Código

**Por quê**
O comando de verificação garante que o código pode ser commitado com segurança, com build, tipos e testes passando, sem problemas pendentes.

**Operação**
Digite:

```
/verify
```

**O que você deve ver**
Relatório completo de verificação:

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

Se houver problemas, serão listados em detalhes:

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
- Build passou
- Verificação de tipos passou
- Lint passou (ou apenas avisos)
- Todos os testes passaram
- Cobertura atingiu 80%+
- Sem console.log
- Sem chaves hardcoded

---

### Passo 5: Commitar o Código

**Por quê**
Após a verificação passar, o código está pronto para commit e pode ser enviado ao repositório remoto com confiança.

**Operação**
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

## Avisos Sobre Armadilhas

### Armadilha 1: Pular a Fase RED e Escrever Código Diretamente

**Abordagem errada**:
```
Implementar função calculateLiquidityScore primeiro
Depois escrever testes
```

**Consequências**:
- Testes podem apenas "verificar implementação existente", não verificar comportamento real
- Fácil omitir casos de borda e tratamento de erros
- Falta de segurança ao refatorar

**Abordagem correta**:
```
1. Escrever testes primeiro (devem falhar)
2. Executar testes para confirmar falha (RED)
3. Implementar código para fazer testes passarem (GREEN)
4. Refatorar mantendo testes passando (REFACTOR)
```

---

### Armadilha 2: Cobertura de Testes Insuficiente

**Abordagem errada**:
```
Escrever apenas um teste, cobertura de apenas 40%
```

**Consequências**:
- Grande quantidade de código sem proteção de testes
- Fácil introduzir bugs ao refatorar
- Será rejeitado na revisão de código

**Abordagem correta**:
```
Garantir 80%+ de cobertura:
- Testes unitários: Cobrir todas as funções e branches
- Testes de integração: Cobrir endpoints de API
- Testes E2E: Cobrir fluxos críticos de usuário
```

---

### Armadilha 3: Ignorar Sugestões do code-review

**Abordagem errada**:
```
Ver problemas CRITICAL e ainda assim commitar
```

**Consequências**:
- Vulnerabilidades de segurança chegam ao ambiente de produção
- Baixa qualidade de código, difícil de manter
- Rejeitado por revisores de PR

**Abordagem correta**:
```
- Problemas CRITICAL devem ser corrigidos
- Problemas HIGH devem ser corrigidos ou justificados
- Problemas MEDIUM/LOW podem ser otimizados posteriormente
```

---

### Armadilha 4: Não Executar /verify Antes de Commitar

**Abordagem errada**:
```
Escrever código e fazer git commit diretamente, pulando verificação
```

**Consequências**:
- Falha de build, desperdiçando recursos de CI
- Erros de tipo causando erros em runtime
- Testes não passam, estado anormal do branch principal

**Abordagem correta**:
```
Sempre executar /verify antes de commitar:
/verify
# Só commitar após ver "Ready for PR: YES"
```

---

### Armadilha 5: Testar Detalhes de Implementação em Vez de Comportamento

**Abordagem errada**:
```typescript
// Testar estado interno
expect(component.state.count).toBe(5)
```

**Consequências**:
- Testes frágeis, muitas falhas ao refatorar
- Testes não refletem o que o usuário realmente vê

**Abordagem correta**:
```typescript
// Testar comportamento visível ao usuário
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

## Resumo da Lição

Pontos-chave do fluxo de desenvolvimento TDD:

1. **Planejamento primeiro**: Use `/plan` para garantir compreensão correta, evitando direção errada
2. **Orientado a testes**: Use `/tdd` para forçar testes primeiro, seguindo RED-GREEN-REFACTOR
3. **Revisão de código**: Use `/code-review` para descobrir problemas de segurança e qualidade
4. **Validação completa**: Use `/verify` para garantir que o código pode ser commitado com segurança
5. **Requisito de cobertura**: Garantir 80%+ de cobertura de testes, código crítico 100%

Esses quatro comandos formam um ciclo completo de desenvolvimento, garantindo qualidade de código e eficiência de desenvolvimento.

::: tip Lembre-se Deste Fluxo
```
Requisito → /plan → /tdd → /code-review → /verify → Commit
```

Cada novo recurso deve seguir este fluxo.
:::

## Prévia da Próxima Lição

> Na próxima lição aprenderemos sobre **[Fluxo de Revisão de Código: /code-review e Auditoria de Segurança](../code-review-workflow/)**.
>
> Você vai aprender:
> - Compreender profundamente a lógica de verificação do code-reviewer agent
> - Dominar a checklist de auditoria de segurança
> - Aprender a corrigir vulnerabilidades de segurança comuns
> - Entender como configurar regras de revisão personalizadas

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Comando /plan | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Comando /tdd | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Comando /verify | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**Funções Importantes**:
- `plan` chama o planner agent, criando plano de implementação
- `tdd` chama o tdd-guide agent, executando fluxo RED-GREEN-REFACTOR
- `verify` executa verificação completa (build, tipos, lint, testes)
- `code-review` verifica vulnerabilidades de segurança, qualidade de código, melhores práticas

**Requisitos de Cobertura**:
- Mínimo de 80% de cobertura de código (branches, functions, lines, statements)
- Cálculos financeiros, lógica de autenticação, código crítico de segurança requerem 100% de cobertura

</details>
