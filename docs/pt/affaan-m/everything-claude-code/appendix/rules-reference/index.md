---
title: "Rules: Guia Completo dos 8 Conjuntos de Regras | everything-claude-code"
sidebarTitle: "Referência de Regras"
subtitle: "Rules: Guia Completo dos 8 Conjuntos de Regras | everything-claude-code"
description: "Aprenda os 8 conjuntos de regras do everything-claude-code, incluindo segurança, estilo de código, testes, fluxo de trabalho Git, otimização de desempenho, uso de Agents, padrões de design e sistema de Hooks."
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

# Referência Completa de Rules: Guia dos 8 Conjuntos de Regras

## O Que Você Vai Aprender

- Encontrar e entender rapidamente todos os 8 conjuntos de regras obrigatórias
- Aplicar corretamente as normas de segurança, estilo de código, testes e outras durante o desenvolvimento
- Saber qual Agent usar para ajudar a seguir cada regra
- Compreender as estratégias de otimização de desempenho e como funciona o sistema de Hooks

## Seu Desafio Atual

Diante dos 8 conjuntos de regras do projeto, você pode estar:

- **Sem conseguir memorizar todas as regras**: security, coding-style, testing, git-workflow... quais são obrigatórias?
- **Sem saber como aplicá-las**: as regras mencionam padrões imutáveis, fluxo TDD, mas como fazer na prática?
- **Sem saber a quem recorrer**: qual Agent usar para problemas de segurança? E para revisão de código?
- **Equilibrando desempenho e segurança**: como otimizar a eficiência do desenvolvimento mantendo a qualidade do código?

Este documento de referência ajuda você a entender completamente o conteúdo, cenários de aplicação e ferramentas Agent correspondentes de cada conjunto de regras.

---

## Visão Geral das Rules

Everything Claude Code inclui 8 conjuntos de regras obrigatórias, cada um com objetivos e cenários de aplicação claros:

| Conjunto de Regras | Objetivo | Prioridade | Agent Correspondente |
| --- | --- | --- | --- |
| **Security** | Prevenir vulnerabilidades de segurança, vazamento de dados sensíveis | P0 | security-reviewer |
| **Coding Style** | Código legível, padrões imutáveis, arquivos pequenos | P0 | code-reviewer |
| **Testing** | 80%+ de cobertura de testes, fluxo TDD | P0 | tdd-guide |
| **Git Workflow** | Commits padronizados, fluxo de PR | P1 | code-reviewer |
| **Agents** | Uso correto de sub-agentes | P1 | N/A |
| **Performance** | Otimização de tokens, gerenciamento de contexto | P1 | N/A |
| **Patterns** | Padrões de design, melhores práticas de arquitetura | P2 | architect |
| **Hooks** | Entender e usar Hooks | P2 | N/A |

::: info Explicação das Prioridades

- **P0 (Crítica)**: Deve ser seguida rigorosamente; violações causam riscos de segurança ou degradação severa da qualidade do código
- **P1 (Importante)**: Deve ser seguida; afeta a eficiência do desenvolvimento e colaboração da equipe
- **P2 (Recomendada)**: Recomendado seguir; melhora a arquitetura e manutenibilidade do código
:::

---

## 1. Security (Regras de Segurança)

### Verificações de Segurança Obrigatórias

**Antes de qualquer commit**, as seguintes verificações devem ser concluídas:

- [ ] Sem chaves hardcoded (API keys, senhas, tokens)
- [ ] Todas as entradas do usuário validadas
- [ ] Prevenção de SQL injection (queries parametrizadas)
- [ ] Prevenção de XSS (sanitização de HTML)
- [ ] Proteção CSRF habilitada
- [ ] Autenticação/autorização verificadas
- [ ] Todos os endpoints com rate limiting
- [ ] Mensagens de erro não expõem dados sensíveis

### Gerenciamento de Chaves

**❌ Prática Incorreta**: Chaves hardcoded

```typescript
const apiKey = "sk-proj-xxxxx"
```

**✅ Prática Correta**: Usar variáveis de ambiente

```typescript
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### Protocolo de Resposta a Incidentes de Segurança

Se um problema de segurança for descoberto:

1. **Pare imediatamente** o trabalho atual
2. Use o agent **security-reviewer** para análise completa
3. Corrija problemas CRITICAL antes de continuar
4. Rotacione quaisquer chaves expostas
5. Verifique toda a base de código para problemas similares

::: tip Uso do Agent de Segurança

Usar o comando `/code-review` aciona automaticamente a verificação do security-reviewer, garantindo que o código esteja em conformidade com as normas de segurança.
:::

---

## 2. Coding Style (Regras de Estilo de Código)

### Imutabilidade (CRÍTICO)

**Sempre crie novos objetos, nunca modifique objetos existentes**:

**❌ Prática Incorreta**: Modificar objeto diretamente

```javascript
function updateUser(user, name) {
  user.name = name  // MUTAÇÃO!
  return user
}
```

**✅ Prática Correta**: Criar novo objeto

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### Organização de Arquivos

**Muitos arquivos pequenos > Poucos arquivos grandes**:

- **Alta coesão, baixo acoplamento**
- **Típico 200-400 linhas, máximo 800 linhas**
- Extraia funções utilitárias de componentes grandes
- Organize por funcionalidade/domínio, não por tipo

### Tratamento de Erros

**Sempre trate erros de forma abrangente**:

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### Validação de Entrada

**Sempre valide entrada do usuário**:

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### Checklist de Qualidade de Código

Antes de marcar o trabalho como concluído, confirme:

- [ ] Código legível com nomenclatura clara
- [ ] Funções pequenas (< 50 linhas)
- [ ] Arquivos focados (< 800 linhas)
- [ ] Sem aninhamento profundo (> 4 níveis)
- [ ] Tratamento de erros adequado
- [ ] Sem instruções console.log
- [ ] Sem valores hardcoded
- [ ] Sem modificações diretas (use padrões imutáveis)

---

## 3. Testing (Regras de Testes)

### Cobertura Mínima de Testes: 80%

**Deve incluir todos os tipos de teste**:

1. **Testes Unitários** - Funções isoladas, utilitários, componentes
2. **Testes de Integração** - Endpoints de API, operações de banco de dados
3. **Testes E2E** - Fluxos críticos do usuário (Playwright)

### Desenvolvimento Orientado a Testes (TDD)

**Fluxo de trabalho obrigatório**:

1. Escreva o teste primeiro (RED)
2. Execute o teste - deve falhar
3. Escreva a implementação mínima (GREEN)
4. Execute o teste - deve passar
5. Refatore (IMPROVE)
6. Verifique a cobertura (80%+)

### Solução de Problemas em Testes

1. Use o agent **tdd-guide**
2. Verifique o isolamento dos testes
3. Valide se os mocks estão corretos
4. Corrija a implementação, não o teste (a menos que o teste esteja errado)

### Suporte de Agents

- **tdd-guide** - Use proativamente para novas funcionalidades, força escrever testes primeiro
- **e2e-runner** - Especialista em testes E2E com Playwright

::: tip Usando o Comando TDD

Usar o comando `/tdd` aciona automaticamente o agent tdd-guide, guiando você através do fluxo TDD completo.
:::

---

## 4. Git Workflow (Regras de Fluxo de Trabalho Git)

### Formato de Mensagem de Commit

```
<type>: <description>

<optional body>
```

**Tipos**: feat, fix, refactor, docs, test, chore, perf, ci

::: info Mensagens de Commit

A atribuição nas mensagens de commit foi desabilitada globalmente via `~/.claude/settings.json`.
:::

### Fluxo de Trabalho de Pull Request

Ao criar um PR:

1. Analise o histórico completo de commits (não apenas o mais recente)
2. Use `git diff [base-branch]...HEAD` para ver todas as alterações
3. Elabore um resumo abrangente do PR
4. Inclua plano de testes e TODOs
5. Se for um novo branch, use a flag `-u` ao fazer push

### Fluxo de Trabalho de Implementação de Funcionalidades

#### 1. Planejamento Primeiro

- Use o agent **planner** para criar um plano de implementação
- Identifique dependências e riscos
- Divida em múltiplas fases

#### 2. Abordagem TDD

- Use o agent **tdd-guide**
- Escreva testes primeiro (RED)
- Implemente para passar nos testes (GREEN)
- Refatore (IMPROVE)
- Verifique cobertura de 80%+

#### 3. Revisão de Código

- Use o agent **code-reviewer** imediatamente após escrever código
- Corrija problemas CRITICAL e HIGH
- Corrija problemas MEDIUM quando possível

#### 4. Commit e Push

- Mensagens de commit detalhadas
- Siga o formato de conventional commits

---

## 5. Agents (Regras de Agents)

### Agents Disponíveis

Localizados em `~/.claude/agents/`:

| Agent | Propósito | Quando Usar |
| --- | --- | --- |
| planner | Planejamento de implementação | Funcionalidades complexas, refatoração |
| architect | Design de sistema | Decisões de arquitetura |
| tdd-guide | Desenvolvimento orientado a testes | Novas funcionalidades, correção de bugs |
| code-reviewer | Revisão de código | Após escrever código |
| security-reviewer | Análise de segurança | Antes de commits |
| build-error-resolver | Correção de erros de build | Quando o build falha |
| e2e-runner | Testes E2E | Fluxos críticos do usuário |
| refactor-cleaner | Limpeza de código morto | Manutenção de código |
| doc-updater | Atualização de documentação | Atualizar documentação |

### Use Agents Imediatamente

**Sem necessidade de prompt do usuário**:

1. Requisição de funcionalidade complexa - Use o agent **planner**
2. Código recém-escrito/modificado - Use o agent **code-reviewer**
3. Correção de bug ou nova funcionalidade - Use o agent **tdd-guide**
4. Decisões de arquitetura - Use o agent **architect**

### Execução Paralela de Tarefas

**Sempre use execução paralela de tarefas para operações independentes**:

| Abordagem | Descrição |
| --- | --- |
| ✅ Bom: Execução paralela | Inicie 3 agents em paralelo: Agent 1 (análise de segurança de auth.ts), Agent 2 (revisão de desempenho do sistema de cache), Agent 3 (verificação de tipos de utils.ts) |
| ❌ Ruim: Execução sequencial | Execute agent 1 primeiro, depois agent 2, depois agent 3 |

### Análise Multi-Perspectiva

Para problemas complexos, use sub-agentes com papéis específicos:

- Verificador de fatos
- Engenheiro sênior
- Especialista em segurança
- Revisor de consistência
- Verificador de redundância

---

## 6. Performance (Regras de Otimização de Desempenho)

### Estratégia de Seleção de Modelo

**Haiku 4.5** (90% da capacidade do Sonnet, 3x economia de custo):

- Agents leves, chamadas frequentes
- Pair programming e geração de código
- Worker agents em sistemas multi-agente

**Sonnet 4.5** (Melhor modelo de codificação):

- Trabalho de desenvolvimento principal
- Coordenação de fluxos de trabalho multi-agente
- Tarefas de codificação complexas

**Opus 4.5** (Raciocínio mais profundo):

- Decisões de arquitetura complexas
- Necessidades máximas de raciocínio
- Tarefas de pesquisa e análise

### Gerenciamento da Janela de Contexto

**Evite usar os últimos 20% da janela de contexto**:

- Refatorações em larga escala
- Implementação de funcionalidades em múltiplos arquivos
- Debugging de interações complexas

**Tarefas com baixa sensibilidade ao contexto**:

- Edições em arquivo único
- Criação de ferramentas independentes
- Atualizações de documentação
- Correções simples de bugs

### Ultrathink + Plan Mode

Para tarefas complexas que requerem raciocínio profundo:

1. Use `ultrathink` para pensamento aprimorado
2. Habilite **Plan Mode** para abordagem estruturada
3. "Reinicie o motor" para múltiplas rodadas de crítica
4. Use sub-agentes com papéis específicos para análise diversificada

### Solução de Problemas de Build

Se o build falhar:

1. Use o agent **build-error-resolver**
2. Analise as mensagens de erro
3. Corrija passo a passo
4. Verifique após cada correção

---

## 7. Patterns (Regras de Padrões Comuns)

### Formato de Resposta de API

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

### Padrão de Custom Hooks

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

### Padrão Repository

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### Projetos Esqueleto

Ao implementar novas funcionalidades:

1. Busque projetos esqueleto testados em produção
2. Use agents paralelos para avaliar opções:
   - Avaliação de segurança
   - Análise de escalabilidade
   - Pontuação de relevância
   - Planejamento de implementação
3. Clone a melhor correspondência como base
4. Itere dentro da estrutura validada

---

## 8. Hooks (Regras do Sistema de Hooks)

### Tipos de Hook

- **PreToolUse**: Antes da execução da ferramenta (validação, modificação de parâmetros)
- **PostToolUse**: Após a execução da ferramenta (formatação automática, verificações)
- **Stop**: No final da sessão (validação final)

### Hooks Atuais (em ~/.claude/settings.json)

#### PreToolUse

- **Lembrete tmux**: Sugere usar tmux para comandos de longa duração (npm, pnpm, yarn, cargo, etc.)
- **Revisão de git push**: Abre revisão no Zed antes do push
- **Bloqueador de documentação**: Bloqueia criação de arquivos .md/.txt desnecessários

#### PostToolUse

- **Criação de PR**: Registra URL do PR e status do GitHub Actions
- **Prettier**: Formata automaticamente arquivos JS/TS após edição
- **Verificação TypeScript**: Executa tsc após editar arquivos .ts/.tsx
- **Aviso de console.log**: Alerta sobre console.log em arquivos editados

#### Stop

- **Auditoria de console.log**: Verifica console.log em todos os arquivos modificados antes do fim da sessão

### Permissões de Aceitação Automática

**Use com cautela**:

- Habilite para planos confiáveis e bem definidos
- Desabilite para trabalho exploratório
- Nunca use a flag dangerously-skip-permissions
- Em vez disso, configure `allowedTools` em `~/.claude.json`

### Melhores Práticas do TodoWrite

Use a ferramenta TodoWrite para:

- Acompanhar progresso de tarefas multi-etapas
- Validar entendimento das instruções
- Habilitar orientação em tempo real
- Mostrar etapas de implementação granulares

A lista de Todo revela:

- Etapas fora de ordem
- Itens faltando
- Itens extras desnecessários
- Granularidade incorreta
- Requisitos mal interpretados

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos **[Referência Completa de Skills](../skills-reference/)**.
>
> Você aprenderá:
> - Referência completa das 11 bibliotecas de skills
> - Padrões de codificação, padrões backend/frontend, aprendizado contínuo e outras skills
> - Como escolher a skill certa para diferentes tarefas

---

## Resumo da Lição

Os 8 conjuntos de regras do Everything Claude Code fornecem orientação abrangente para o processo de desenvolvimento:

1. **Security** - Previne vulnerabilidades de segurança e vazamento de dados sensíveis
2. **Coding Style** - Garante código legível, imutável e arquivos pequenos
3. **Testing** - Exige 80%+ de cobertura e fluxo TDD
4. **Git Workflow** - Padroniza commits e fluxo de PR
5. **Agents** - Orienta o uso correto dos 9 sub-agentes especializados
6. **Performance** - Otimiza uso de tokens e gerenciamento de contexto
7. **Patterns** - Fornece padrões de design comuns e melhores práticas
8. **Hooks** - Explica como funciona o sistema de hooks automatizado

Lembre-se, essas regras não são restrições, mas guias para ajudá-lo a escrever código de alta qualidade, seguro e manutenível. Usar os Agents correspondentes (como code-reviewer, security-reviewer) pode ajudá-lo a seguir essas regras automaticamente.

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Regras de Security | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Regras de Coding Style | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Regras de Testing | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Regras de Git Workflow | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Regras de Agents | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Regras de Performance | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Regras de Patterns | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Regras de Hooks | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |

**Regras Principais**:
- **Security**: Sem segredos hardcoded, verificação OWASP Top 10
- **Coding Style**: Padrões imutáveis, arquivos < 800 linhas, funções < 50 linhas
- **Testing**: 80%+ de cobertura de testes, fluxo TDD obrigatório
- **Performance**: Estratégia de seleção de modelo, gerenciamento de janela de contexto

**Agents Relacionados**:
- **security-reviewer**: Detecção de vulnerabilidades de segurança
- **code-reviewer**: Revisão de qualidade e estilo de código
- **tdd-guide**: Orientação do fluxo TDD
- **planner**: Planejamento de implementação

</details>
