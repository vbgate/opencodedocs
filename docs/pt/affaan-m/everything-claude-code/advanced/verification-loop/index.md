---
title: "Loop de Verificação: Checkpoint e Evals | Everything Claude Code"
subtitle: "Loop de Verificação: Checkpoint e Evals"
sidebarTitle: "Verificação Pré-PR Sem Erros"
description: "Aprenda o mecanismo de loop de verificação do Everything Claude Code. Domine o gerenciamento de Checkpoint, definição de Evals e verificação contínua, salvando estados com checkpoint e revertendo quando necessário, garantindo qualidade de código com evals."
tags:
  - "verification"
  - "checkpoint"
  - "evals"
  - "quality-gates"
prerequisite:
  - "platforms-tdd-workflow"
order: 120
---

# Loop de Verificação: Checkpoint e Evals

## O Que Você Vai Aprender

Após aprender o mecanismo de loop de verificação, você será capaz de:

- Usar `/checkpoint` para salvar e restaurar estados de trabalho
- Usar `/verify` para executar verificações abrangentes de qualidade de código
- Dominar o conceito de Eval-Driven Development (EDD), definindo e executando evals
- Estabelecer um loop de verificação contínua, mantendo a qualidade do código durante o desenvolvimento

## Seu Dilema Atual

Você acabou de concluir uma funcionalidade, mas não se atreve a enviar um PR porque:
- Não tem certeza se quebrou funcionalidades existentes
- Teme que a cobertura de testes tenha diminuído
- Esqueceu qual era o objetivo inicial e não sabe se desviou do caminho
- Quer reverter para um estado estável, mas não tem registro

Se houvesse um mecanismo que pudesse "tirar uma foto e salvar" em momentos críticos e verificar continuamente durante o desenvolvimento, esses problemas seriam resolvidos.

## Quando Usar Esta Técnica

- **Antes de iniciar uma nova funcionalidade**: Crie um checkpoint, registre o estado inicial
- **Após completar um marco**: Salve o progresso, facilitando reversão e comparação
- **Antes de enviar um PR**: Execute verificação completa, garantindo qualidade do código
- **Durante refatoração**: Verifique frequentemente, evitando quebrar funcionalidades existentes
- **Em colaboração em equipe**: Compartilhe checkpoints, sincronize estados de trabalho

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos

Este tutorial assume que você já:

- ✅ Completou o aprendizado do [Fluxo de Trabalho TDD](../../platforms/tdd-workflow/)
- ✅ Está familiarizado com operações básicas do Git
- ✅ Sabe como usar comandos básicos do Everything Claude Code

:::

---

## Conceito Central

O **Loop de Verificação** é um mecanismo de garantia de qualidade que transforma o ciclo "escrever código → testar → verificar" em um processo sistemático.

### Sistema de Verificação em Três Camadas

Everything Claude Code oferece três camadas de verificação:

| Nível | Mecanismo | Propósito | Quando Usar |
| --- | --- | --- | --- |
| **Verificação em Tempo Real** | PostToolUse Hooks | Capturar imediatamente erros de tipo, console.log, etc. | Após cada chamada de ferramenta |
| **Verificação Periódica** | Comando `/verify` | Verificação abrangente: build, tipos, testes, segurança | A cada 15 minutos ou após mudanças significativas |
| **Verificação de Marco** | `/checkpoint` | Comparar diferenças de estado, rastrear tendências de qualidade | Ao completar marcos, antes de enviar PR |

### Checkpoint: "Ponto de Salvamento" do Código

Checkpoint "tira uma foto e salva" em momentos críticos:

- Registra Git SHA
- Registra taxa de aprovação de testes
- Registra cobertura de código
- Registra timestamp

Durante a verificação, você pode comparar o estado atual com qualquer checkpoint.

### Evals: "Testes Unitários" para Desenvolvimento com IA

**Eval-Driven Development (EDD)** trata evals como testes unitários para desenvolvimento com IA:

1. **Primeiro defina critérios de sucesso** (escrever evals)
2. **Depois escreva código** (implementar funcionalidade)
3. **Execute evals continuamente** (verificar correção)
4. **Rastreie regressões** (garantir que não quebra funcionalidades existentes)

Isso é consistente com o conceito de TDD (Test-Driven Development), mas voltado para desenvolvimento assistido por IA.

---

## Siga Comigo: Usando Checkpoint

### Passo 1: Criar checkpoint inicial

Antes de iniciar uma nova funcionalidade, crie um checkpoint:

```bash
/checkpoint create "feature-start"
```

**Por quê**
Registrar o estado inicial, facilitando comparação posterior.

**O que você deve ver**:

```
VERIFICATION: Running quick checks...
Build:    OK
Types:    OK

CHECKPOINT CREATED: feature-start
Time:     2026-01-25-14:30
Git SHA:  abc1234
Logged to: .claude/checkpoints.log
```

O Checkpoint irá:
1. Primeiro executar `/verify quick` (verificar apenas build e tipos)
2. Criar git stash ou commit (nome: `checkpoint-feature-start`)
3. Registrar em `.claude/checkpoints.log`

### Passo 2: Implementar funcionalidade principal

Comece a escrever código, complete a lógica principal.

### Passo 3: Criar checkpoint de marco

Após completar a funcionalidade principal:

```bash
/checkpoint create "core-done"
```

**Por quê**
Registrar marco, facilitando reversão.

**O que você deve ver**:

```
CHECKPOINT CREATED: core-done
Time:     2026-01-25-16:45
Git SHA:  def5678
Logged to: .claude/checkpoints.log
```

### Passo 4: Verificar e comparar

Verificar se o estado atual desviou do objetivo:

```bash
/checkpoint verify "feature-start"
```

**Por quê**
Comparar mudanças nos indicadores de qualidade desde o início até agora.

**O que você deve ver**:

```
CHECKPOINT COMPARISON: feature-start
=====================================
Files changed: 12
Tests: +25 passed / -0 failed
Coverage: +15% / -2% (from 60% to 75%)
Build: PASS
Status: ✅ Quality improved
```

### Passo 5: Ver todos os checkpoints

Ver histórico de checkpoints:

```bash
/checkpoint list
```

**O que você deve ver**:

```
CHECKPOINTS HISTORY
===================
Name           | Time             | Git SHA  | Status
---------------|------------------|----------|--------
feature-start  | 2026-01-25-14:30 | abc1234  | behind
core-done      | 2026-01-25-16:45 | def5678  | current
```

**Ponto de Verificação ✅**: Validar compreensão

- Checkpoint executa automaticamente `/verify quick`? ✅ Sim
- Checkpoint é registrado em qual arquivo? ✅ `.claude/checkpoints.log`
- `/checkpoint verify` compara quais métricas? ✅ Mudanças de arquivos, taxa de aprovação de testes, cobertura

---

## Siga Comigo: Usando o Comando Verify

### Passo 1: Executar verificação rápida

Durante o desenvolvimento, execute verificação rápida frequentemente:

```bash
/verify quick
```

**Por quê**
Verifica apenas build e tipos, mais rápido.

**O que você deve ver**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK

Ready for next task: YES
```

### Passo 2: Executar verificação completa

Antes de preparar para enviar PR, execute verificação completa:

```bash
/verify full
```

**Por quê**
Verificação abrangente de todos os quality gates.

**O que você deve ver**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK (2 warnings)
Tests:    120/125 passed, 76% coverage
Secrets:  OK
Logs:     3 console.logs found in src/

Ready for PR: NO

Issues to Fix:
1. Remove console.log statements before PR
   Found in: src/utils/logger.ts:15, src/api/client.ts:23, src/ui/button.ts:8
2. Increase test coverage from 76% to 80% (target)
   Missing coverage in: src/components/Form.tsx
```

### Passo 3: Executar verificação pré-PR

A verificação mais rigorosa, incluindo varredura de segurança:

```bash
/verify pre-pr
```

**O que você deve ver**:

```
VERIFICATION: FAIL

Build:    OK
Types:    OK (1 error)
Lint:     OK
Tests:    120/125 passed, 76% coverage
Secrets:  ❌ FOUND (2 API keys)
Logs:     3 console.logs

Security Issues Found:
1. Hardcoded API key in src/api/config.ts:10
2. Secret key in .env.example

Ready for PR: NO

Critical Issues:
1. Remove hardcoded secrets
2. Fix type error in src/components/Form.tsx:45
3. Remove console.logs
4. Increase coverage to 80%
```

### Passo 4: Reverificar após corrigir problemas

Após corrigir os problemas, execute a verificação novamente:

```bash
/verify full
```

**O que você deve ver**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK
Tests:    125/125 passed, 81% coverage
Secrets:  OK
Logs:     OK

Ready for PR: YES
```

**Ponto de Verificação ✅**: Validar compreensão

- `/verify quick` verifica apenas o quê? ✅ Build e tipos
- `/verify full` verifica quais itens? ✅ Build, tipos, Lint, testes, Secrets, Console.log, status Git
- Qual modo de verificação inclui varredura de segurança? ✅ `pre-pr`

---

## Siga Comigo: Usando Evals (Eval-Driven Development)

### Passo 1: Definir Evals (antes de escrever código)

**Antes de começar a codificar, primeiro defina critérios de sucesso**:

```markdown
## EVAL: user-authentication

### Capability Evals
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

### Regression Evals
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

**Por quê**
Definir critérios de sucesso primeiro força você a pensar "qual é o padrão de conclusão".

Salvar em: `.claude/evals/user-authentication.md`

### Passo 2: Implementar funcionalidade

Escrever código de acordo com os evals.

### Passo 3: Executar Capability Evals

Testar se a nova funcionalidade atende aos evals:

```markdown
[CERTAIN CAPABILITY EVAL: user-authentication]

Test 1: User can register with email/password
Task: Call registration API with valid credentials
Expected: User account created, token returned
Actual: PASS

Test 2: User can login with valid credentials
Task: Call login API with registered credentials
Expected: JWT token returned
Actual: PASS

Test 3: Invalid credentials rejected
Task: Call login API with wrong password
Expected: 401 Unauthorized with error message
Actual: PASS

Overall: 3/3 passed
```

### Passo 4: Executar Regression Evals

Garantir que não quebra funcionalidades existentes:

```bash
npm test -- --testPathPattern="existing"
```

**O que você deve ver**:

```
PASS  existing/auth.test.ts
PASS  existing/api.test.ts
PASS  existing/db.test.ts

All regression tests: 15/15 passed
```

### Passo 5: Gerar relatório de Eval

Consolidar resultados:

```markdown
EVAL REPORT: user-authentication
=================================

Capability Evals:
  register-user:       PASS (pass@1)
  login-user:          PASS (pass@2)
  reject-invalid:      PASS (pass@1)
  session-persistence: PASS (pass@1)
  logout-clears:       PASS (pass@1)
  Overall:             5/5 passed

Regression Evals:
  public-routes:       PASS
  api-responses:       PASS
  db-schema:           PASS
  Overall:             3/3 passed

Metrics:
  pass@1: 80% (4/5)
  pass@3: 100% (5/5)
  pass^3: 100% (3/3)

Status: READY FOR REVIEW
```

**Ponto de Verificação ✅**: Validar compreensão

- Evals devem ser definidos quando? ✅ Antes de escrever código
- Diferença entre capability evals e regression evals? ✅ O primeiro testa novas funcionalidades, o segundo garante que não quebra funcionalidades existentes
- Significado de pass@3? ✅ Probabilidade de sucesso dentro de 3 tentativas

---

## Armadilhas a Evitar

### Armadilha 1: Esquecer de criar checkpoint

**Problema**: Após desenvolver por um tempo, quer reverter para um estado, mas não tem registro.

**Solução**: Antes de iniciar cada nova funcionalidade, crie um checkpoint:

```bash
# Bom hábito: antes de iniciar nova funcionalidade
/checkpoint create "feature-name-start"

# Bom hábito: a cada marco
/checkpoint create "phase-1-done"
/checkpoint create "phase-2-done"
```

### Armadilha 2: Definição de Evals muito vaga

**Problema**: Evals escritos de forma muito vaga, impossível de verificar.

**Exemplo errado**:
```markdown
- [ ] Usuário pode fazer login
```

**Exemplo correto**:
```markdown
- [ ] User can login with valid credentials
  Task: POST /api/login with email="test@example.com", password="Test123!"
  Expected: HTTP 200 with JWT token in response body
  Actual: ___________
```

### Armadilha 3: Executar verificação apenas antes de enviar PR

**Problema**: Descobrir problemas apenas antes do PR, alto custo de correção.

**Solução**: Estabelecer hábito de verificação contínua:

```
A cada 15 minutos executar: /verify quick
Cada funcionalidade completa: /checkpoint create "milestone"
Antes de enviar PR:          /verify pre-pr
```

### Armadilha 4: Evals não são atualizados

**Problema**: Após mudança de requisitos, Evals ainda são antigos, causando falha na verificação.

**Solução**: Evals são "código de primeira classe", atualizar sincronizadamente quando requisitos mudarem:

```bash
# Mudança de requisitos → Atualizar Evals → Atualizar código
1. Modificar .claude/evals/feature-name.md
2. Modificar código de acordo com novos evals
3. Executar evals novamente
```

---

## Resumo da Lição

O loop de verificação é um método sistemático para manter a qualidade do código:

| Mecanismo | Função | Frequência de Uso |
| --- | --- | --- |
| **PostToolUse Hooks** | Capturar erros em tempo real | A cada chamada de ferramenta |
| **`/verify`** | Verificação abrangente periódica | A cada 15 minutos |
| **`/checkpoint`** | Registro e comparação de marcos | A cada fase de funcionalidade |
| **Evals** | Verificação de funcionalidade e teste de regressão | A cada nova funcionalidade |

Princípios centrais:
1. **Primeiro definir, depois implementar** (Evals)
2. **Verificar frequentemente, melhorar continuamente** (`/verify`)
3. **Registrar marcos, facilitar reversão** (`/checkpoint`)

---

## Prévia da Próxima Lição

> Na próxima lição aprenderemos **[Custom Rules: Construindo Especificações Específicas do Projeto](../custom-rules/)**.
>
> Você aprenderá:
> - Como criar arquivos de Rules personalizados
> - Formato de arquivo de Rule e escrita de checklist
> - Definir regras de segurança específicas do projeto
> - Integrar especificações da equipe no fluxo de revisão de código

---

## Apêndice: Referência de Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Última atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Definição do comando Checkpoint | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Definição do comando Verify | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Verification Loop Skill | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| Eval Harness Skill | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |

**Fluxos-chave**:
- Fluxo de criação de Checkpoint: primeiro executar `/verify quick` → criar git stash/commit → registrar em `.claude/checkpoints.log`
- Fluxo de verificação Verify: Build Check → Type Check → Lint Check → Test Suite → Console.log Audit → Git Status
- Fluxo de trabalho Eval: Define (definir evals) → Implement (implementar código) → Evaluate (executar evals) → Report (gerar relatório)

**Parâmetros-chave**:
- `/checkpoint [create\|verify\|list] [name]` - Operações de Checkpoint
- `/verify [quick\|full\|pre-commit\|pre-pr]` - Modos de verificação
- pass@3 - Objetivo de sucesso dentro de 3 tentativas (>90%)
- pass^3 - 3 sucessos consecutivos (100%, usado para caminhos críticos)

</details>
