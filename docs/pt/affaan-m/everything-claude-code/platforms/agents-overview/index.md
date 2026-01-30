---
title: "Agents: 9 Agentes Especializados | Everything Claude Code"
sidebarTitle: "Use o Agente Certo, Dobre a Eficiência"
subtitle: "Agents: 9 Agentes Especializados | Everything Claude Code"
description: "Aprenda sobre os 9 agentes especializados do Everything Claude Code, domine como chamá-los em diferentes cenários e melhore a eficiência e qualidade do desenvolvimento assistido por IA."
tags:
  - "agents"
  - "ai-assistant"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 60
---

# Guia Detalhado dos Agents Principais: 9 Sub-Agentes Especializados

## O que você aprenderá neste tutorial

- Entender as responsabilidades e cenários de uso dos 9 agentes especializados
- Saber qual agent chamar para diferentes tarefas de desenvolvimento
- Dominar a colaboração entre agents para construir fluxos de trabalho eficientes
- Evitar as limitações da "IA genérica" e utilizar agents especializados para aumentar a produtividade

## Os desafios que você enfrenta agora

- Frequentemente pede ao Claude para executar tarefas, mas as respostas não são profissionais ou profundas o suficiente
- Não tem certeza de quando usar os comandos `/plan`, `/tdd`, `/code-review`, etc.
- Sente que os conselhos da IA são muito genéricos e carecem de especificidade
- Quer um fluxo de trabalho de desenvolvimento sistematizado, mas não sabe como organizá-lo

## Quando usar esta técnica

Este tutorial ajudará quando você precisar realizar as seguintes tarefas:
- Planejamento antes do desenvolvimento de funcionalidades complexas
- Escrita de novas funcionalidades ou correção de bugs
- Revisão de código e auditoria de segurança
- Correção de erros de build
- Testes end-to-end
- Refatoração e limpeza de código
- Atualização de documentação

## Conceito central

O Everything Claude Code fornece 9 agentes especializados, cada um focado em um domínio específico. Assim como você buscaria especialistas de diferentes papéis em uma equipe real, diferentes tarefas de desenvolvimento devem chamar diferentes agents.

::: info Agente vs Comando
- **Agent**: Assistente de IA profissional com conhecimento específico do domínio e ferramentas
- **Comando**: Atalho para chamar rapidamente um agente ou executar uma operação específica

Por exemplo: o comando `/tdd` chama o agente `tdd-guide` para executar o fluxo de desenvolvimento orientado a testes.
:::

### Visão Geral dos 9 Agents

| Agente | Papel | Cenários Típicos | Capacidades Principais |
| --- | --- | --- | --- |
| **planner** | Especialista em Planejamento | Criação de planos antes do desenvolvimento de funcionalidades complexas | Análise de requisitos, revisão de arquitetura, decomposição de passos |
| **architect** | Arquiteto | Design de sistemas e decisões técnicas | Avaliação de arquitetura, recomendação de padrões, análise de trade-offs |
| **tdd-guide** | Mentor TDD | Escrita de testes e implementação de funcionalidades | Fluxo Red-Green-Refactor, garantia de cobertura |
| **code-reviewer** | Revisor de Código | Revisão da qualidade do código | Verificação de qualidade, segurança e manutenibilidade |
| **security-reviewer** | Auditor de Segurança | Detecção de vulnerabilidades de segurança | OWASP Top 10, vazamento de chaves, proteção contra injeção |
| **build-error-resolver** | Solucionador de Erros de Build | Correção de erros TypeScript/build | Correções mínimas, inferência de tipos |
| **e2e-runner** | Especialista em Testes E2E | Gerenciamento de testes end-to-end | Testes Playwright, gerenciamento de flaky, artefatos |
| **refactor-cleaner** | Especialista em Refatoração | Remoção de código morto e duplicado | Análise de dependências, exclusão segura, documentação |
| **doc-updater** | Atualizador de Documentação | Geração e atualização de documentação | Geração de codemap, análise AST |

## Introdução Detalhada

### 1. Planner - Especialista em Planejamento

**Quando usar**: Ao implementar funcionalidades complexas, mudanças de arquitetura ou grandes refatorações.

::: tip Melhor Prática
Antes de começar a escrever código, use `/plan` para criar um plano de implementação. Isso ajuda a evitar esquecer dependências, descobrir riscos potenciais e estabelecer uma sequência de implementação razoável.
:::

**Capacidades Principais**:
- Análise e esclarecimento de requisitos
- Revisão de arquitetura e identificação de dependências
- Decomposição detalhada dos passos de implementação
- Identificação de riscos e planos de mitigação
- Planejamento da estratégia de testes

**Formato de Saída**:
```markdown
# Implementation Plan: [Nome da Funcionalidade]

## Overview
[Resumo em 2-3 frases]

## Requirements
- [Requisito 1]
- [Requisito 2]

## Architecture Changes
- [Mudança 1: caminho do arquivo e descrição]
- [Mudança 2: caminho do arquivo e descrição]

## Implementation Steps

### Phase 1: [Nome da Fase]
1. **[Nome do Passo]** (File: path/to/file.ts)
   - Action: operação específica
   - Why: razão
   - Dependencies: None / Requires step X
   - Risk: Low/Medium/High

## Testing Strategy
- Unit tests: [arquivos a testar]
- Integration tests: [fluxos a testar]
- E2E tests: [jornadas de usuário a testar]

## Risks & Mitigations
- **Risk**: [descrição]
  - Mitigation: [como resolver]

## Success Criteria
- [ ] Critério 1
- [ ] Critério 2
```

**Cenários de Exemplo**:
- Adicionar novos endpoints de API (requer migração de banco de dados, atualização de cache, documentação)
- Refatorar módulos centrais (afeta múltiplas dependências)
- Adicionar nova funcionalidade (envolve frontend, backend, banco de dados)

### 2. Architect - Arquiteto

**Quando usar**: Ao projetar arquitetura de sistema, avaliar soluções técnicas ou tomar decisões de arquitetura.

**Capacidades Principais**:
- Design de arquitetura de sistemas
- Análise de trade-offs técnicos
- Recomendação de padrões de design
- Planejamento de escalabilidade
- Considerações de segurança

**Princípios de Arquitetura**:
- **Modularidade**: responsabilidade única, alta coesão e baixo acoplamento
- **Escalabilidade**: escalabilidade horizontal, design stateless
- **Manutenibilidade**: estrutura clara, padrões consistentes
- **Segurança**: defesa em profundidade, privilégio mínimo
- **Performance**: algoritmos eficientes, requisições de rede mínimas

**Padrões Comuns**:

**Padrões Frontend**:
- Composição de componentes, padrão Container/Presenter, Hooks personalizados, Estado global com Context, Code splitting

**Padrões Backend**:
- Padrão Repository, Camada de Service, Padrão de Middleware, Arquitetura orientada a eventos, CQRS

**Padrões de Dados**:
- Banco de dados normalizado, Desnormalização para performance de leitura, Event sourcing, Camada de cache, Consistência eventual

**Formato de Registro de Decisão de Arquitetura (ADR)**:
```markdown
# ADR-001: Usar Redis para armazenar vetores de busca semântica

## Context
Precisamos armazenar e consultar vetores de embedding de 1536 dimensões para busca semântica no mercado.

## Decision
Usar a funcionalidade de busca vetorial do Redis Stack.

## Consequences

### Positive
- Busca rápida por similaridade vetorial (<10ms)
- Algoritmo KNN embutido
- Implantação simples
- Boa performance (até 10K vetores)

### Negative
- Armazenamento em memória (custo alto para grandes datasets)
- Ponto único de falha (sem cluster)
- Suporta apenas similaridade por cosseno

### Alternatives Considered
- **PostgreSQL pgvector**: Mais lento, mas armazenamento persistente
- **Pinecone**: Serviço gerenciado, custo mais alto
- **Weaviate**: Mais recursos, configuração mais complexa

## Status
Accepted

## Date
2025-01-15
```

### 3. TDD Guide - Mentor TDD

**Quando usar**: Ao escrever novas funcionalidades, corrigir bugs ou refatorar código.

::: warning Princípio Central
O TDD Guide exige que todo código deva ser **testado primeiro**, depois a funcionalidade implementada, garantindo 80%+ de cobertura de testes.
:::

**Fluxo de Trabalho TDD**:

**Step 1: Escreva os testes primeiro (RED)**
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

**Step 2: Execute os testes (verifique falha)**
```bash
npm test
# Test should fail - we haven't implemented yet
```

**Step 3: Escreva a implementação mínima (GREEN)**
```typescript
export async function searchMarkets(query: string) {
  const embedding = await generateEmbedding(query)
  const results = await vectorSearch(embedding)
  return results
}
```

**Step 4: Execute os testes (verifique passagem)**
```bash
npm test
# Test should now pass
```

**Step 5: Refatore (IMPROVE)**
- Remova código duplicado
- Melhore nomenclatura
- Otimize performance
- Melhore legibilidade

**Step 6: Verifique a cobertura**
```bash
npm run test:coverage
# Verify 80%+ coverage
```

**Tipos de Testes Obrigatórios**:

1. **Testes Unitários** (obrigatório): testam funções isoladas
2. **Testes de Integração** (obrigatório): testam endpoints de API e operações de banco de dados
3. **Testes E2E** (fluxos críticos): testam jornadas completas do usuário

**Casos de Borda que Devem ser Cobertos**:
- Null/Undefined: o que acontece se a entrada for null?
- Vazio: o que acontece se array/string estiver vazio?
- Tipos inválidos: o que acontece se passar tipo errado?
- Limites: valores mínimos/máximos
- Erros: falha de rede, erro de banco de dados
- Condições de corrida: operações concorrentes
- Grandes volumes: performance com 10k+ itens
- Caracteres especiais: Unicode, emoji, caracteres SQL

### 4. Code Reviewer - Revisor de Código

**Quando usar**: Imediatamente após escrever ou modificar código.

::: tip Uso Obrigatório
O Code Reviewer é um agent **obrigatório**; todas as alterações de código precisam passar por sua revisão.
:::

**Lista de Verificação da Revisão**:

**Verificação de Segurança (CRITICAL)**:
- Credenciais hardcoded (API keys, senhas, tokens)
- Riscos de injeção SQL (concatenação de strings em queries)
- Vulnerabilidades XSS (entrada de usuário sem escape)
- Validação de entrada ausente
- Dependências inseguras (desatualizadas, vulneráveis)
- Riscos de path traversal (caminhos de arquivo controlados por usuário)
- Vulnerabilidades CSRF
- Bypass de autenticação

**Qualidade de Código (HIGH)**:
- Funções grandes (>50 linhas)
- Arquivos grandes (>800 linhas)
- Aninhamento profundo (>4 níveis)
- Tratamento de erro ausente (try/catch)
- Instruções console.log
- Padrões de mudança
- Novo código sem testes

**Performance (MEDIUM)**:
- Algoritmos ineficientes (O(n²) quando O(n log n) é possível)
- Re-renderizações desnecessárias no React
- Memoização ausente
- Bundle size grande
- Imagens não otimizadas
- Cache ausente
- Consultas N+1

**Melhores Práticas (MEDIUM)**:
- Emojis no código/comentários
- TODO/FIXME sem ticket associado
- JSDoc ausente em APIs públicas
- Problemas de acessibilidade (labels ARIA ausentes, baixo contraste)
- Nomenclatura ruim de variáveis (x, tmp, data)
- Números mágicos não explicados
- Formatação inconsistente

**Formato de Saída da Revisão**:
```markdown
[CRITICAL] Hardcoded API key
File: src/api/client.ts:42
Issue: API key exposta no código fonte
Fix: Mover para variável de ambiente

const apiKey = "sk-abc123";  // ❌ Ruim
const apiKey = process.env.API_KEY;  // ✓ Bom
```

**Critérios de Aprovação**:
- ✅ Aprovado: sem problemas CRITICAL ou HIGH
- ⚠️ Aviso: apenas problemas MEDIUM (pode mesclar com cautela)
- ❌ Bloqueado: problemas CRITICAL ou HIGH encontrados

### 5. Security Reviewer - Auditor de Segurança

**Quando usar**: Após escrever código que processa entrada de usuário, autenticação, endpoints de API ou dados sensíveis.

::: danger Crítico
O Security Reviewer marca vazamentos de chaves, SSRF, injeção, criptografia insegura e vulnerabilidades OWASP Top 10. Problemas CRITICAL devem ser corrigidos imediatamente!
:::

**Responsabilidades Principais**:
1. **Detecção de Vulnerabilidades**: Identificar OWASP Top 10 e problemas de segurança comuns
2. **Detecção de Chaves**: Encontrar API keys, senhas e tokens hardcoded
3. **Validação de Entrada**: Garantir que toda entrada de usuário seja devidamente sanitizada
4. **Autenticação/Autorização**: Verificar controles de acesso apropriados
5. **Segurança de Dependências**: Verificar pacotes npm vulneráveis
6. **Melhores Práticas de Segurança**: Implantar padrões de codificação seguros

**Verificação OWASP Top 10**:

1. **Injeção** (SQL, NoSQL, Command)
   - As queries são parametrizadas?
   - A entrada do usuário é sanitizada?
   - O ORM é usado com segurança?

2. **Autenticação Quebrada**
   - As senhas são hasheadas (bcrypt, argon2)?
   - O JWT é validado corretamente?
   - As sessões são seguras?
   - Há MFA?

3. **Exposição de Dados Sensíveis**
   - HTTPS é forçado?
   - As chaves estão em variáveis de ambiente?
   - PII está criptografado em repouso?
   - Os logs são sanitizados?

4. **Entidades Externas XML (XXE)**
   - Os parsers XML estão configurados com segurança?
   - O processamento de entidades externas está desabilitado?

5. **Controle de Acesso Quebrado**
   - Cada rota verifica autorização?
   - As referências de objetos são indiretas?
   - O CORS está configurado corretamente?

6. **Configuração de Segurança Incorreta**
   - As credenciais padrão foram alteradas?
   - O tratamento de erro é seguro?
   - Os headers de segurança estão configurados?
   - O modo debug está desabilitado em produção?

7. **Cross-Site Scripting (XSS)**
   - A saída é escapada/sanitizada?
   - Content-Security-Policy está configurado?
   - O framework faz escape por padrão?

8. **Desserialização Insegura**
   - A entrada do usuário é desserializada com segurança?
   - A biblioteca de desserialização está atualizada?

9. **Uso de Componentes com Vulnerabilidades Conhecidas**
   - Todas as dependências estão atualizadas?
   - O npm audit está limpo?
   - CVEs estão sendo monitorados?

10. **Logging e Monitoramento Insuficientes**
    - Eventos de segurança são registrados?
    - Os logs são monitorados?
    - Alertas estão configurados?

**Padrões Comuns de Vulnerabilidades**:

**1. Chaves Hardcoded (CRITICAL)**
```javascript
// ❌ CRITICAL: Segredos hardcoded
const apiKey = "sk-proj-xxxxx"

// ✅ CORRETO: Variáveis de ambiente
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

**2. Injeção SQL (CRITICAL)**
```javascript
// ❌ CRITICAL: Vulnerabilidade de injeção SQL
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ CORRETO: Queries parametrizadas
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

**3. XSS (HIGH)**
```javascript
// ❌ HIGH: Vulnerabilidade XSS
element.innerHTML = userInput

// ✅ CORRETO: Use textContent ou sanitize
element.textContent = userInput
```

**Formato do Relatório de Revisão de Segurança**:
```markdown
# Security Review Report

**File/Component:** [path/to/file.ts]
**Reviewed:** YYYY-MM-DD
**Reviewer:** security-reviewer agent

## Summary
- **Critical Issues:** X
- **High Issues:** Y
- **Medium Issues:** Z
- **Low Issues:** W
- **Risk Level:** 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW

## Critical Issues (Fix Immediately)

### 1. [Título do Problema]
**Severity:** CRITICAL
**Category:** SQL Injection / XSS / Authentication / etc.
**Location:** `file.ts:123`

**Issue:**
[Descrição da vulnerabilidade]

**Impact:**
[O que acontece se for explorado]

**Proof of Concept:**
```javascript
// Exemplo de exploração
```

**Remediation:**
```javascript
// ✅ Implementação segura
```

**References:**
- OWASP: [link]
- CWE: [number]
```

### 6. Build Error Resolver - Solucionador de Erros de Build

**Quando usar**: Quando o build falhar ou houver erros de tipo.

::: tip Correção Mínima
O princípio central do Build Error Resolver é a **correção mínima**, apenas corrigindo o erro sem modificar a arquitetura ou refatorar.
:::

**Responsabilidades Principais**:
1. **Correção de Erros TypeScript**: Corrigir erros de tipo, problemas de inferência, restrições genéricas
2. **Correção de Erros de Build**: Resolver falhas de compilação, resolução de módulos
3. **Problemas de Dependências**: Corrigir erros de importação, pacotes ausentes, conflitos de versão
4. **Erros de Configuração**: Resolver problemas em tsconfig.json, webpack, configuração do Next.js
5. **Diferença Mínima**: Fazer mudanças tão pequenas quanto possível para corrigir o erro
6. **Sem Mudanças de Arquitetura**: Apenas corrigir erros, não refatorar ou redesenhar

**Comandos de Diagnóstico**:
```bash
# Verificação de tipos TypeScript (sem saída)
npx tsc --noEmit

# TypeScript com saída formatada
npx tsc --noEmit --pretty

# Mostrar todos os erros (não parar no primeiro)
npx tsc --noEmit --pretty --incremental false

# Verificar arquivo específico
npx tsc --noEmit path/to/file.ts

# Verificação ESLint
npx eslint . --ext .ts,.tsx,.js,.jsx

# Build Next.js (produção)
npm run build
```

**Fluxo de Correção de Erros**:

**1. Coletar Todos os Erros**
```
a) Execute verificação completa de tipos
   - npx tsc --noEmit --pretty
   - Capture TODOS os erros, não apenas o primeiro

b) Categorize os erros por tipo
   - Falhas de inferência de tipo
   - Definições de tipo ausentes
   - Erros de importação/exportação
   - Erros de configuração
   - Problemas de dependência

c) Priorize por impacto
   - Bloqueiam build: corrigir primeiro
   - Erros de tipo: corrigir em ordem
   - Avisos: corrigir se houver tempo
```

**2. Estratégia de Correção (Mudanças Mínimas)**
```
Para cada erro:

1. Entenda o erro
   - Leia a mensagem de erro cuidadosamente
   - Verifique arquivo e número da linha
   - Entenda tipo esperado vs tipo real

2. Encontre a correção mínima
   - Adicione anotações de tipo ausentes
   - Corrija instruções de importação
   - Adicione verificações null
   - Use type assertion (último recurso)

3. Verifique se a correção não quebra outro código
   - Execute tsc após cada correção
   - Verifique arquivos relacionados
   - Garanta que não introduziu novos erros

4. Itere até o build passar
   - Corrija um erro de cada vez
   - Recompile após cada correção
   - Acompanhe o progresso (X/Y erros corrigidos)
```

**Padrões Comuns de Erros e Correções**:

**Padrão 1: Falha de Inferência de Tipo**
```typescript
// ❌ ERROR: Parameter 'x' implicitly has an 'any' type
function add(x, y) {
  return x + y
}

// ✅ FIX: Adicione anotações de tipo
function add(x: number, y: number): number {
  return x + y
}
```

**Padrão 2: Erros Null/Undefined**
```typescript
// ❌ ERROR: Object is possibly 'undefined'
const name = user.name.toUpperCase()

// ✅ FIX: Optional chaining
const name = user?.name?.toUpperCase()

// ✅ OR: Verificação null
const name = user && user.name ? user.name.toUpperCase() : ''
```

**Padrão 3: Erros de Importação**
```typescript
// ❌ ERROR: Cannot find module '@/lib/utils'
import { formatDate } from '@/lib/utils'

// ✅ FIX 1: Verifique se os paths do tsconfig estão corretos
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ✅ FIX 2: Use importação relativa
import { formatDate } from '../lib/utils'
```

**Estratégia de Diferença Mínima**:

**CRITICAL: Faça mudanças tão pequenas quanto possível**

**FAÇA:**
✅ Adicione anotações de tipo ausentes
✅ Adicione verificações null necessárias
✅ Corrija importações/exportações
✅ Adicione dependências ausentes
✅ Atualize definições de tipo
✅ Corrija arquivos de configuração

**NÃO FAÇA:**
❌ Refatore código não relacionado
❌ Mude a arquitetura
❌ Renomeie variáveis/funções (a menos que causem erro)
❌ Adicione novas funcionalidades
❌ Mude o fluxo de lógica (a menos que corrija erro)
❌ Otimize performance
❌ Melhore estilo de código

### 7. E2E Runner - Especialista em Testes E2E

**Quando usar**: Ao gerar, manter e executar testes E2E.

::: tip Valor dos Testes End-to-End
Testes E2E são a última linha de defesa antes da produção; eles capturam problemas de integração que testes unitários deixam passar.
:::

**Responsabilidades Principais**:
1. **Criação de Jornadas de Teste**: Escrever testes Playwright para fluxos de usuário
2. **Manutenção de Testes**: Manter testes sincronizados com mudanças na UI
3. **Gerenciamento de Testes Flaky**: Identificar e isolar testes instáveis
4. **Gerenciamento de Artefatos**: Capturar screenshots, vídeos, traces
5. **Integração CI/CD**: Garantir que testes rodem de forma confiável no pipeline
6. **Relatórios de Teste**: Gerar relatórios HTML e JUnit XML

**Comandos de Teste**:
```bash
# Executar todos os testes E2E
npx playwright test

# Executar arquivo de teste específico
npx playwright test tests/markets.spec.ts

# Executar testes em modo headed (ver o navegador)
npx playwright test --headed

# Depurar testes com inspector
npx playwright test --debug

# Gerar código de teste a partir de ações do navegador
npx playwright codegen http://localhost:3000

# Executar testes com trace
npx playwright test --trace on

# Mostrar relatório HTML
npx playwright show-report

# Atualizar snapshots
npx playwright test --update-snapshots

# Executar testes em navegador específico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Fluxo de Trabalho de Testes E2E**:

**1. Fase de Planejamento de Testes**
```
a) Identifique jornadas críticas de usuário
   - Fluxos de autenticação (login, logout, registro)
   - Funcionalidades centrais (criação de mercado, negociação, busca)
   - Fluxos de pagamento (depósito, saque)
   - Integridade de dados (operações CRUD)

b) Defina cenários de teste
   - Happy path (tudo funciona)
   - Edge cases (estados vazios, limites)
   - Casos de erro (falha de rede, validação)

c) Priorize por risco
   - HIGH: transações financeiras, autenticação
   - MEDIUM: busca, filtros, navegação
   - LOW: polimento de UI, animações, estilos
```

**2. Fase de Criação de Testes**
```
Para cada jornada de usuário:

1. Escreva o teste no Playwright
   - Use o padrão Page Object Model (POM)
   - Adicione descrições significativas aos testes
   - Adicione asserções em passos críticos
   - Adicione screenshots em pontos-chave

2. Torne o teste resiliente
   - Use localizadores apropriados (data-testid preferido)
   - Adicione esperas para conteúdo dinâmico
   - Trate condições de corrida
   - Implemente lógica de retry

3. Adicione captura de artefatos
   - Screenshot em caso de falha
   - Gravação de vídeo
   - Trace para debugging
   - Logs de rede quando necessário
```

**Estrutura de Testes Playwright**:

**Organização de Arquivos de Teste**:
```
tests/
├── e2e/                       # Jornadas de usuário end-to-end
│   ├── auth/                  # Fluxos de autenticação
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── markets/               # Funcionalidades de mercado
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   ├── create.spec.ts
│   │   └── trade.spec.ts
│   ├── wallet/                # Operações de carteira
│   │   ├── connect.spec.ts
│   │   └── transactions.spec.ts
│   └── api/                   # Testes de endpoints API
│       ├── markets-api.spec.ts
│       └── search-api.spec.ts
├── fixtures/                  # Dados de teste e helpers
│   ├── auth.ts                # Fixtures de autenticação
│   ├── markets.ts             # Dados de teste de mercado
│   └── wallets.ts             # Fixtures de carteira
└── playwright.config.ts       # Configuração Playwright
```

**Padrão Page Object Model**:
```typescript
// pages/MarketsPage.ts
import { Page, Locator } from '@playwright/test'

export class MarketsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly marketCards: Locator
  readonly createMarketButton: Locator
  readonly filterDropdown: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.marketCards = page.locator('[data-testid="market-card"]')
    this.createMarketButton = page.locator('[data-testid="create-market-btn"]')
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]')
  }

  async goto() {
    await this.page.goto('/markets')
    await this.page.waitForLoadState('networkidle')
  }

  async searchMarkets(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp => resp.url().includes('/api/markets/search'))
    await this.page.waitForLoadState('networkidle')
  }

  async getMarketCount() {
    return await this.marketCards.count()
  }

  async clickMarket(index: number) {
    await this.marketCards.nth(index).click()
  }

  async filterByStatus(status: string) {
    await this.filterDropdown.selectOption(status)
    await this.page.waitForLoadState('networkidle')
  }
}
```

**Exemplo de Teste com Melhores Práticas**:
```typescript
// tests/e2e/markets/search.spec.ts
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test.describe('Market Search', () => {
  let marketsPage: MarketsPage

  test.beforeEach(async ({ page }) => {
    marketsPage = new MarketsPage(page)
    await marketsPage.goto()
  })

  test('should search markets by keyword', async ({ page }) => {
    // Arrange
    await expect(page).toHaveTitle(/Markets/)

    // Act
    await marketsPage.searchMarkets('trump')

    // Assert
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBeGreaterThan(0)

    // Verify first result contains search term
    const firstMarket = marketsPage.marketCards.first()
    await expect(firstMarket).toContainText(/trump/i)

    // Take screenshot for verification
    await page.screenshot({ path: 'artifacts/search-results.png' })
  })

  test('should handle no results gracefully', async ({ page }) => {
    // Act
    await marketsPage.searchMarkets('xyznonexistentmarket123')

    // Assert
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBe(0)
  })
})
```

**Gerenciamento de Testes Flaky**:

**Identificar Testes Flaky**:
```bash
# Execute testes múltiplas vezes para verificar estabilidade
npx playwright test tests/markets/search.spec.ts --repeat-each=10

# Execute teste específico com retries
npx playwright test tests/markets/search.spec.ts --retries=3
```

**Modo de Isolamento**:
```typescript
// Marque testes flaky para isolamento
test('flaky: market search with complex query', async ({ page }) => {
  test.fixme(true, 'Test is flaky - Issue #123')

  // Test code here...
})

// Ou use skip condicional
test('market search with complex query', async ({ page }) => {
  test.skip(process.env.CI, 'Test is flaky in CI - Issue #123')

  // Test code here...
})
```

**Causas Comuns de Flakiness e Correções**:

**1. Condições de Corrida**
```typescript
// ❌ FLAKY: Não assuma que o elemento está pronto
await page.click('[data-testid="button"]')

// ✅ STABLE: Aguarde o elemento estar pronto
await page.locator('[data-testid="button"]').click() // Auto-wait embutido
```

**2. Timing de Rede**
```typescript
// ❌ FLAKY: Timeout arbitrário
await page.waitForTimeout(5000)

// ✅ STABLE: Aguarde condição específica
await page.waitForResponse(resp => resp.url().includes('/api/markets'))
```

**3. Timing de Animações**
```typescript
// ❌ FLAKY: Clique durante animação
await page.click('[data-testid="menu-item"]')

// ✅ STABLE: Aguarde animação completar
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.click('[data-testid="menu-item"]')
```

### 8. Refactor Cleaner - Especialista em Refatoração

**Quando usar**: Ao precisar deletar código não utilizado, código duplicado e realizar refatoração.

::: warning Ação Cuidadosa
O Refactor Cleaner executa ferramentas de análise (knip, depcheck, ts-prune) para identificar código morto e removê-lo com segurança. Verifique bem antes de deletar!
:::

**Responsabilidades Principais**:
1. **Detecção de Código Morto**: Encontrar código não utilizado, exports, dependências
2. **Eliminação de Duplicados**: Identificar e mesclar código duplicado
3. **Limpeza de Dependências**: Remover pacotes e imports não utilizados
4. **Refatoração Segura**: Garantir que mudanças não quebrem funcionalidade
5. **Documentação**: Rastrear todas as exclusões em `DELETION_LOG.md`

**Ferramentas de Detecção**:
- **knip**: Encontrar arquivos não utilizados, exports, dependências, tipos
- **depcheck**: Identificar dependências npm não utilizadas
- **ts-prune**: Encontrar exports TypeScript não utilizados
- **eslint**: Verificar diretivas disable não utilizadas e variáveis

**Comandos de Análise**:
```bash
# Execute knip para encontrar exports/arquivos/dependências não utilizados
npx knip

# Verifique dependências não utilizadas
npx depcheck

# Encontre exports TypeScript não utilizados
npx ts-prune

# Verifique diretivas disable não utilizadas
npx eslint . --report-unused-disable-directives
```

**Fluxo de Trabalho de Refatoração**:

**1. Fase de Análise**
```
a) Execute ferramentas de detecção em paralelo
b) Colete todas as descobertas
c) Classifique por nível de risco:
   - SAFE: exports não utilizados, dependências não utilizadas
   - CAREFUL: possivelmente usados via importação dinâmica
   - RISKY: APIs públicas, utilitários compartilhados
```

**2. Avaliação de Risco**
```
Para cada item a ser deletado:
- Verifique se é importado em algum lugar (grep search)
- Verifique se não há imports dinâmicos (grep padrões de string)
- Verifique se faz parte de uma API pública
- Veja o histórico para contexto
- Teste o impacto no build/testes
```

**3. Processo de Exclusão Segura**
```
a) Comece apenas com itens SAFE
b) Delete uma categoria de cada vez:
   1. Dependências npm não utilizadas
   2. Exports internos não utilizados
   3. Arquivos não utilizados
   4. Código duplicado
c) Execute testes após cada lote
d) Crie git commit para cada lote
```

**4. Mesclagem de Duplicados**
```
a) Encontre componentes/utilitários duplicados
b) Escolha a melhor implementação:
   - Maior funcionalidade
   - Melhor testada
   - Mais recentemente usada
c) Atualize todos os imports para usar a versão escolhida
d) Delete o duplicado
e) Verifique se os testes ainda passam
```

**Formato do Log de Exclusão**:

Crie/atualize `docs/DELETION_LOG.md` com a seguinte estrutura:
```markdown
# Code Deletion Log

## [YYYY-MM-DD] Refactor Session

### Unused Dependencies Removed
- package-name@version - Last used: never, Size: XX KB
- another-package@version - Replaced by: better-package

### Unused Files Deleted
- src/old-component.tsx - Replaced by: src/new-component.tsx
- lib/deprecated-util.ts - Functionality moved to: lib/utils.ts

### Duplicate Code Consolidated
- src/components/Button1.tsx + Button2.tsx → Button.tsx
- Reason: Both implementations were identical

### Unused Exports Removed
- src/utils/helpers.ts - Functions: foo(), bar()
- Reason: No references found in codebase

### Impact
- Files deleted: 15
- Dependencies removed: 5
- Lines of code removed: 2,300
- Bundle size reduction: ~45 KB

### Testing
- All unit tests passing: ✓
- All integration tests passing: ✓
- Manual testing completed: ✓
```

**Lista de Verificação de Segurança**:

**Antes de deletar qualquer coisa:**
- [ ] Execute ferramentas de detecção
- [ ] Faça grep de todas as referências
- [ ] Verifique imports dinâmicos
- [ ] Veja o histórico
- [ ] Verifique se é API pública
- [ ] Execute todos os testes
- [ ] Crie branch de backup
- [ ] Documente em DELETION_LOG.md

**Após cada exclusão:**
- [ ] Build bem-sucedido
- [ ] Testes passam
- [ ] Sem erros no console
- [ ] Commite as mudanças
- [ ] Atualize DELETION_LOG.md

**Padrões Comuns para Excluir**:

**1. Imports Não Utilizados**
```typescript
// ❌ Remova imports não utilizados
import { useState, useEffect, useMemo } from 'react' // Apenas useState é usado

// ✅ Mantenha apenas o que é usado
import { useState } from 'react'
```

**2. Branches de Código Morto**
```typescript
// ❌ Remova código inalcançável
if (false) {
  // Isso nunca executa
  doSomething()
}

// ❌ Remova funções não utilizadas
export function unusedHelper() {
  // Sem referências no codebase
}
```

**3. Componentes Duplicados**
```typescript
// ❌ Múltiplos componentes similares
components/Button.tsx
components/PrimaryButton.tsx
components/NewButton.tsx

// ✅ Consolidado em um
components/Button.tsx (com prop variant)
```

### 9. Doc Updater - Atualizador de Documentação

**Quando usar**: Ao atualizar codemaps e documentação.

::: tip Sincronização de Documentação e Código
O Doc Updater executa `/update-codemaps` e `/update-docs`, gera `docs/CODEMAPS/*`, atualiza READMEs e guias.
:::

**Responsabilidades Principais**:
1. **Geração de Codemap**: Criar mapeamentos de arquitetura a partir da estrutura do codebase
2. **Atualização de Documentação**: Atualizar READMEs e guias a partir do código
3. **Análise AST**: Usar TypeScript Compiler API para entender a estrutura
4. **Mapeamento de Dependências**: Rastrear imports/exports entre módulos
5. **Qualidade da Documentação**: Garantir que a documentação corresponda ao código real

**Ferramentas de Análise**:
- **ts-morph**: Análise e manipulação AST TypeScript
- **TypeScript Compiler API**: Análise profunda da estrutura do código
- **madge**: Visualização do grafo de dependências
- **jsdoc-to-markdown**: Geração de documentação a partir de comentários JSDoc

**Comandos de Análise**:
```bash
# Analise a estrutura do projeto TypeScript (execute script customizado com ts-morph)
npx tsx scripts/codemaps/generate.ts

# Gere grafo de dependências
npx madge --image graph.svg src/

# Extraia comentários JSDoc
npx jsdoc2md src/**/*.ts
```

**Fluxo de Trabalho de Geração de Codemap**:

**1. Análise da Estrutura do Repositório**
```
a) Identifique todos os workspaces/packages
b) Mapeie a estrutura de diretórios
c) Encontre entry points (apps/*, packages/*, services/*)
d) Detecte padrões de framework (Next.js, Node.js, etc.)
```

**2. Análise de Módulos**
```
Para cada módulo:
- Extraia exports (API pública)
- Mapeie imports (dependências)
- Identifique rotas (rotas de API, páginas)
- Encontre modelos de banco de dados (Supabase, Prisma)
- Localize módulos queue/worker
```

**3. Gerar Codemaps**
```
Estrutura:
docs/CODEMAPS/
├── INDEX.md              # Visão geral de todas as áreas
├── frontend.md           # Estrutura frontend
├── backend.md            # Estrutura Backend/API
├── database.md           # Schema do banco de dados
├── integrations.md       # Serviços externos
└── workers.md            # Tarefas em background
```

**Formato do Codemap**:
```markdown
# [Área] Codemap

**Last Updated:** YYYY-MM-DD
**Entry Points:** lista dos principais arquivos

## Architecture

[Diagrama ASCII das relações de componentes]

## Key Modules

| Module | Purpose | Exports | Dependencies |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## Data Flow

[Descreva como os dados fluem nesta área]

## External Dependencies

- package-name - Purpose, Version
- ...

## Related Areas

Links para outros codemaps que interagem com esta área
```

**Fluxo de Trabalho de Atualização de Documentação**:

**1. Extração de Documentação do Código**
```
- Leia comentários JSDoc/TSDoc
- Extraia seções do README do package.json
- Parse variáveis de ambiente do .env.example
- Colete definições de endpoints de API
```

**2. Atualização dos Arquivos de Documentação**
```
Arquivos a atualizar:
- README.md - Visão geral do projeto, instruções de setup
- docs/GUIDES/*.md - Guias de funcionalidades, tutoriais
- package.json - Descrição, documentação de scripts
- API documentation - Especificações de endpoints
```

**3. Validação da Documentação**
```
- Verifique se todos os arquivos mencionados existem
- Verifique se todos os links são válidos
- Garanta que os exemplos sejam executáveis
- Verifique se os snippets de código compilam
```

**Exemplos de Codemaps Específicos de Projetos**:

**Codemap Frontend (docs/CODEMAPS/frontend.md)**:
```markdown
# Frontend Architecture

**Last Updated:** YYYY-MM-DD
**Framework:** Next.js 15.1.4 (App Router)
**Entry Point:** website/src/app/layout.tsx

## Structure

website/src/
├── app/                # Next.js App Router
│   ├── api/           # Rotas de API
│   ├── markets/       # Páginas de mercado
│   ├── bot/           # Interação com bot
│   └── creator-dashboard/
├── components/        # Componentes React
├── hooks/             # Hooks personalizados
└── lib/               # Utilitários

## Key Components

| Component | Purpose | Location |
| --- | --- | --- |
| HeaderWallet | Conexão de carteira | components/HeaderWallet.tsx |
| MarketsClient | Listagem de mercados | app/markets/MarketsClient.js |
| SemanticSearchBar | UI de busca | components/SemanticSearchBar.js |

## Data Flow

User → Markets Page → API Route → Supabase → Redis (optional) → Response

## External Dependencies

- Next.js 15.1.4 - Framework
- React 19.0.0 - UI library
- Privy - Authentication
- Tailwind CSS 3.4.1 - Styling
```

**Codemap Backend (docs/CODEMAPS/backend.md)**:
```markdown
# Backend Architecture

**Last Updated:** YYYY-MM-DD
**Runtime:** Next.js API Routes
**Entry Point:** website/src/app/api/

## API Routes

| Route | Method | Purpose |
| --- | --- | --- |
| /api/markets | GET | Listar todos os mercados |
| /api/markets/search | GET | Busca semântica |
| /api/market/[slug] | GET | Mercado individual |
| /api/market-price | GET | Preços em tempo real |

## Data Flow

API Route → Supabase Query → Redis (cache) → Response

## External Services

- Supabase - Banco de dados PostgreSQL
- Redis Stack - Busca vetorial
- OpenAI - Embeddings
```

**Template de Atualização de README**:

Ao atualizar o README.md:
```markdown
# Project Name

Brief description

## Setup
\`\`\`bash
# Instalação
npm install

# Variáveis de ambiente
cp .env.example .env.local
# Preencha: OPENAI_API_KEY, REDIS_URL, etc.

# Desenvolvimento
npm run dev

# Build
npm run build
\`\`\`

## Architecture

Veja [docs/CODEMAPS/INDEX.md](docs/CODEMAPS/INDEX.md) para arquitetura detalhada.

### Key Directories

- `src/app` - Páginas e rotas de API do Next.js App Router
- `src/components` - Componentes React reutilizáveis
- `src/lib` - Bibliotecas utilitárias e clientes

## Features

- [Feature 1] - Descrição
- [Feature 2] - Descrição

## Documentation

- [Setup Guide](docs/GUIDES/setup.md)
- [API Reference](docs/GUIDES/api.md)
- [Architecture](docs/CODEMAPS/INDEX.md)

## Contributing

Veja [CONTRIBUTING.md](CONTRIBUTING.md)
```

## Quando Chamar Qual Agente

Com base no tipo de tarefa, escolha o agente apropriado:

| Tipo de Tarefa | Chamada Recomendada | Alternativa |
| --- | --- | --- |
| **Planejar nova funcionalidade** | `/plan` → planner agent | Chamar planner agent manualmente |
| **Design de arquitetura de sistema** | Chamar architect agent manualmente | `/orchestrate` → chamar agents em sequência |
| **Escrever nova funcionalidade** | `/tdd` → tdd-guide agent | planner → tdd-guide |
| **Corrigir bug** | `/tdd` → tdd-guide agent | build-error-resolver (se erro de tipo) |
| **Revisão de código** | `/code-review` → code-reviewer agent | Chamar code-reviewer agent manualmente |
| **Auditoria de segurança** | Chamar security-reviewer agent manualmente | code-reviewer (cobertura parcial) |
| **Falha de build** | `/build-fix` → build-error-resolver agent | Correção manual |
| **Testes E2E** | `/e2e` → e2e-runner agent | Escrever testes Playwright manualmente |
| **Limpeza de código morto** | `/refactor-clean` → refactor-cleaner agent | Deleção manual |
| **Atualizar documentação** | `/update-docs` → doc-updater agent | `/update-codemaps` → doc-updater agent |

## Exemplos de Colaboração entre Agents

### Cenário 1: Desenvolvendo uma Nova Funcionalidade do Zero

```
1. /plan (planner agent)
   - Crie plano de implementação
   - Identifique dependências e riscos

2. /tdd (tdd-guide agent)
   - Escreva testes de acordo com o plano
   - Implemente a funcionalidade
   - Garanta cobertura

3. /code-review (code-reviewer agent)
   - Revisar qualidade do código
   - Verificar vulnerabilidades de segurança

4. /verify (comando)
   - Execute build, verificação de tipos, testes
   - Verifique console.log, status do git
```

### Cenário 2: Corrigindo Erro de Build

```
1. /build-fix (build-error-resolver agent)
   - Corrigir erros TypeScript
   - Garantir que build passe

2. /test-coverage (comando)
   - Verificar se cobertura atinge meta

3. /code-review (code-reviewer agent)
   - Revisar código corrigido
```

### Cenário 3: Limpeza de Código

```
1. /refactor-clean (refactor-cleaner agent)
   - Execute ferramentas de detecção
   - Delete código morto
   - Mescle código duplicado

2. /update-docs (doc-updater agent)
   - Atualize codemaps
   - Atualize documentação

3. /verify (comando)
   - Execute todas as verificações
```

## Resumo desta Aula

O Everything Claude Code fornece 9 agents especializados, cada um focado em um domínio específico:

1. **planner** - Planejamento de funcionalidades complexas
2. **architect** - Design de arquitetura de sistemas
3. **tdd-guide** - Execução do fluxo TDD
4. **code-reviewer** - Revisão de qualidade de código
5. **security-reviewer** - Detecção de vulnerabilidades de segurança
6. **build-error-resolver** - Correção de erros de build
7. **e2e-runner** - Gerenciamento de testes end-to-end
8. **refactor-cleaner** - Limpeza de código morto
9. **doc-updater** - Atualização de documentação e codemaps

**Princípios Centrais**:
- Escolha o agente apropriado de acordo com o tipo de tarefa
- Utilize a colaboração entre agents para construir fluxos de trabalho eficientes
- Tarefas complexas podem chamar múltiplos agents em sequência
- Sempre faça code review após alterações de código

## Próxima Aula

> Na próxima aula aprenderemos **[Fluxo de Trabalho TDD](../tdd-workflow/)**.
>
> Você aprenderá:
> - Como usar `/plan` para criar planos de implementação
> - Como usar `/tdd` para executar o ciclo Red-Green-Refactor
> - Como garantir 80%+ de cobertura de testes
> - Como usar `/verify` para executar validação completa

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Planner Agent | [agents/planner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| Architect Agent | [agents/architect.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/architect.md) | 1-212 |
| TDD Guide Agent | [agents/tdd-guide.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [agents/code-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| Security Reviewer Agent | [agents/security-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| Build Error Resolver Agent | [agents/build-error-resolver.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/build-error-resolver.md) | 1-533 |
| E2E Runner Agent | [agents/e2e-runner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/e2e-runner.md) | 1-709 |
| Refactor Cleaner Agent | [agents/refactor-cleaner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/refactor-cleaner.md) | 1-307 |
| Doc Updater Agent | [agents/doc-updater.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/doc-updater.md) | 1-453 |

**Constantes Principais**:
- Nenhuma

**Funções Principais**:
- Nenhuma

</details>
