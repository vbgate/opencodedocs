---
title: "Início Rápido: Instalação do Plugin | everything-claude-code"
sidebarTitle: "Início em 5 Minutos"
subtitle: "Início Rápido: Instalação do Plugin everything-claude-code"
description: "Aprenda o método de instalação e recursos principais do everything-claude-code. Instale o plugin em 5 minutos e use os comandos /plan, /tdd, /code-review para melhorar sua eficiência de desenvolvimento."
tags:
  - "início-rápido"
  - "instalação"
  - "primeiros-passos"
prerequisite: []
order: 10
---

# Início Rápido: Comece com Everything Claude Code em 5 Minutos

## O Que Você Será Capaz de Fazer

**Everything Claude Code** é um plugin do Claude Code que fornece agents, commands, rules e hooks profissionais para ajudá-lo a melhorar a qualidade do código e a eficiência de desenvolvimento. Este tutorial ajuda você a:

- ✅ Instalar Everything Claude Code em 5 minutos
- ✅ Usar o comando `/plan` para criar planos de implementação
- ✅ Usar o comando `/tdd` para desenvolvimento orientado a testes
- ✅ Usar `/code-review` para revisão de código
- ✅ Entender os componentes principais do plugin

## Seu Dilema Atual

Você quer tornar o Claude Code mais poderoso, mas:
- ❌ Tem que explicar padrões de codificação e melhores práticas repetidamente
- ❌ Cobertura de testes baixa, bugs frequentes
- ❌ Revisões de código sempre perdem problemas de segurança
- ❌ Quer TDD mas não sabe como começar
- ❌ Deseja agentes especializados para tarefas específicas

**Everything Claude Code** resolve esses problemas:
- 9 agentes especializados (planner, tdd-guide, code-reviewer, security-reviewer, etc.)
- 14 comandos de barra (/plan, /tdd, /code-review, etc.)
- 8 conjuntos de regras obrigatórias (security, coding-style, testing, etc.)
- 15+ hooks automatizados
- 11 skills de workflow

## Ideia Central

**Everything Claude Code** é um plugin do Claude Code que fornece:
- **Agents**: Sub-agentes especializados que lidam com tarefas de domínio específico (como TDD, revisão de código, auditoria de segurança)
- **Commands**: Comandos de barra para iniciar workflows rapidamente (como `/plan`, `/tdd`)
- **Rules**: Regras obrigatórias para garantir qualidade e segurança do código (como 80%+ de cobertura, proibir console.log)
- **Skills**: Definições de workflow para reutilizar melhores práticas
- **Hooks**: Hooks automatizados que são acionados em eventos específicos (como persistência de sessão, aviso de console.log)

::: tip O que é um Plugin do Claude Code?
Plugins do Claude Code estendem as capacidades do Claude Code, assim como plugins do VS Code estendem as funcionalidades do editor. Após a instalação, você pode usar todos os agents, commands, skills e hooks fornecidos pelo plugin.
:::

## 🎒 Preparação Antes de Começar

**O que você precisa**:
- Claude Code já instalado
- Conhecimento básico de comandos de terminal
- Um diretório de projeto (para testes)

**O que você não precisa**:
- Não precisa de conhecimento especial de linguagem de programação
- Não precisa configurar nada antecipadamente

---

## Siga-me: Instalação em 5 Minutos

### Passo 1: Abra o Claude Code

Inicie o Claude Code e abra um diretório de projeto.

**O que você deve ver**: A interface de linha de comando do Claude Code pronta para uso.

---

### Passo 2: Adicione o Marketplace

No Claude Code, execute o seguinte comando para adicionar o marketplace:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**Por que**
Adiciona Everything Claude Code como fonte de plugin do Claude Code, permitindo instalar plugins a partir dele.

**O que você deve ver**:
```
✓ Successfully added marketplace: everything-claude-code
```

---

### Passo 3: Instale o Plugin

Execute o seguinte comando para instalar o plugin:

```bash
/plugin install everything-claude-code@everything-claude-code
```

**Por que**
Instala o plugin Everything Claude Code para que você possa usar todos os recursos que ele fornece.

**O que você deve ver**:
```
✓ Successfully installed plugin: everything-claude-code@everything-claude-code
```

---

### Passo 4: Verifique a Instalação

Execute o seguinte comando para ver os plugins instalados:

```bash
/plugin list
```

**O que você deve ver**:
```
Installed Plugins:
  everything-claude-code@everything-claude-code
```

✅ Instalação bem-sucedida!

---

## Siga-me: Experimente os Recursos Principais

### Passo 5: Use /plan para Criar um Plano de Implementação

Suponha que você queira adicionar funcionalidade de autenticação de usuário, execute:

```bash
/plan I need to add user authentication with email and password
```

**Por que**
Use o agente planner para criar um plano de implementação detalhado, evitando etapas críticas perdidas.

**O que você deve ver**:
```
# Implementation Plan: User Authentication with Email and Password

## Requirements Restatement
- User registration with email and password
- User login with email and password
- Password hashing with bcrypt
- JWT token generation
- Session management

## Implementation Phases
[Etapas de implementação detalhadas...]

## Risks
- HIGH: Password security (use bcrypt, salt rounds)
- MEDIUM: JWT token expiration
- LOW: Email uniqueness validation

## Estimated Complexity: MEDIUM
**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

Digite `yes` para confirmar o plano, então o planner começará a implementar.

---

### Passo 6: Use /tdd para Desenvolvimento Orientado a Testes

Ao implementar recursos, execute:

```bash
/tdd I need to implement a function to validate email format
```

**Por que**
Use o agente tdd-guide para forçar o fluxo TDD, garantindo escrever testes primeiro, depois implementar código, alcançando 80%+ de cobertura.

**O que você deve ver**:
```
# TDD Session: Email Format Validator

## Step 1: Define Interface (SCAFFOLD)
```typescript
// lib/email-validator.ts
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)
[Código de teste...]

## Step 3: Run Tests - Verify FAIL
[Testes falhando...]

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)
[Código de implementação...]

## Step 5: Run Tests - Verify PASS
[Testes passando...]

## Step 6: Refactor (IMPROVE)
[Código de refatoração...]

## Step 7: Verify Tests Still Pass
[Testes ainda passando...]

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)

✅ TDD session complete!
```

---

### Passo 7: Use /code-review para Revisar o Código

Antes de fazer commit do código, execute:

```bash
/code-review
```

**Por que**
Use o agente code-reviewer para verificar qualidade de código, segurança e melhores práticas.

**O que você deve ver**:
```
# Code Review Report

## Overview
- Files reviewed: 3
- Total lines: 150
- Issues found: 2

## Issues Found

### 1. [CRITICAL] Hardcoded JWT Secret
**Location**: `lib/auth.ts:15`
**Issue**: JWT secret is hardcoded in source code
**Fix**: Move to environment variable
**Impact**: Security vulnerability - secret exposed in code

### 2. [MEDIUM] Missing Error Handling
**Location**: `lib/email-validator.ts:23`
**Issue**: No error handling for null/undefined input
**Fix**: Add null check at function start
**Impact**: Potential runtime errors

## Recommendations
✓ Tests are well written
✓ Code is readable
✓ Follows TypeScript best practices

**Action Required**: Fix CRITICAL issues before commit.
```

Após corrigir os problemas, execute `/code-review` novamente para confirmar que todos os problemas foram resolvidos.

---

## Ponto de Verificação ✅

Confirme que você completou com sucesso as seguintes etapas:

- [ ] Adicionou o marketplace com sucesso
- [ ] Instalou o plugin everything-claude-code com sucesso
- [ ] Usou `/plan` para criar um plano de implementação
- [ ] Usou `/tdd` para desenvolvimento TDD
- [ ] Usou `/code-review` para revisão de código

Se encontrar problemas, consulte [Solução de Problemas](../../faq/troubleshooting-hooks/) ou verifique [Falha de Conexão MCP](../../faq/troubleshooting-mcp/).

---

## Avisos Sobre Armadilhas

::: warning Falha na Instalação
Se `/plugin marketplace add` falhar, certifique-se de:
1. Você está usando a versão mais recente do Claude Code
2. A conexão de rede está normal
3. O acesso ao GitHub está normal (pode ser necessário um proxy)
:::

::: warning Comandos Não Disponíveis
Se os comandos `/plan` ou `/tdd` não estiverem disponíveis:
1. Execute `/plugin list` para confirmar que o plugin está instalado
2. Verifique se o status do plugin está habilitado
3. Reinicie o Claude Code
:::

::: tip Usuários Windows
Everything Claude Code suporta completamente o Windows. Todos os hooks e scripts são reescritos usando Node.js, garantindo compatibilidade entre plataformas.
:::

---

## Resumo da Lição

✅ Você:
1. Instalou com sucesso o plugin Everything Claude Code
2. Entendeu os conceitos principais: agents, commands, rules, skills, hooks
3. Experimentou os três comandos principais `/plan`, `/tdd`, `/code-review`
4. Dominou o fluxo básico de desenvolvimento TDD

**Lembre-se**:
- Agents são sub-agentes especializados que lidam com tarefas específicas
- Commands são pontos de entrada para iniciar workflows rapidamente
- Rules são regras obrigatórias que garantem qualidade e segurança do código
- Comece com recursos com os quais você se identifica, expandindo gradualmente
- Não habilite todos os MCPs, mantenha menos de 10

---

## Próxima Lição

> Na próxima lição, aprenderemos **[Guia de Instalação: Plugin Marketplace vs Instalação Manual](../installation/)**.
>
> Você aprenderá:
> - Etapas detalhadas de instalação via marketplace
> - Fluxo completo de instalação manual
> - Como copiar apenas os componentes necessários
> - Método de configuração de servidor MCP

Continue aprendendo para entender melhor a instalação completa e configuração do Everything Claude Code.

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo                                                                                    | Linhas  |
|--- | --- | ---|
| Lista de Plugin       | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28  |
| Configuração do Marketplace | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45  |
| Instruções de Instalação       | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                        | 175-242 |
| Comando /plan      | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114 |
| Comando /tdd      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)            | 1-327 |
|--- | --- | ---|

**Constantes Chave**:
- Nome do Plugin: `everything-claude-code`
- Repositório Marketplace: `affaan-m/everything-claude-code`

**Arquivos Chave**:
- `plugin.json`: Metadados do plugin e caminhos de componentes
- `commands/*.md`: 14 definições de comandos de barra
- `agents/*.md`: 9 sub-agentes especializados
- `rules/*.md`: 8 conjuntos de regras obrigatórias
- `hooks/hooks.json`: 15+ configurações de hooks automatizados

</details>
