---
title: "Referência de Comandos CLI: lista completa de comandos e parâmetros | Tutorial do Agent App Factory"
sidebarTitle: "Lista Completa de Comandos CLI"
subtitle: "Referência de Comandos CLI: lista completa de comandos e descrições de parâmetros"
description: "Referência completa de comandos CLI do Agent App Factory, incluindo descrições de parâmetros e exemplos de uso para seis comandos: init, run, continue, status, list e reset, ajudando você a dominar rapidamente a ferramenta de linha de comando."
tags:
  - "CLI"
  - "Linha de comando"
  - "Referência"
order: 210
---

# Referência de Comandos CLI: lista completa de comandos e descrições de parâmetros

Este capítulo fornece a referência completa de comandos da ferramenta CLI do Agent App Factory.

## Visão Geral dos Comandos

| Comando | Função | Cenário de Uso |
| ----- | ---- | ---- |
| `factory init` | Inicializar projeto Factory | Começar novo projeto |
| `factory run [stage]` | Executar pipeline | Executar ou continuar pipeline |
| `factory continue` | Continuar em nova sessão | Economizar Token, executar em múltiplas sessões |
| `factory status` | Ver status do projeto | Entender progresso atual |
| `factory list` | Listar todos os projetos | Gerenciar múltiplos projetos |
| `factory reset` | Redefinir status do projeto | Recomeçar pipeline |

---

## factory init

Inicializa o diretório atual como um projeto Factory.

### Sintaxe

```bash
factory init [options]
```

### Parâmetros

| Parâmetro | Abreviação | Tipo | Obrigatório | Descrição |
| ---- | ----- | ---- | ---- | ---- |
| `--name` | `-n` | string | Não | Nome do projeto |
| `--description` | `-d` | string | Não | Descrição do projeto |

### Descrição da Função

Após executar o comando `factory init`, o seguinte será realizado:

1. Verificar segurança do diretório (apenas permite arquivos de configuração como `.git`, `.gitignore`, `README.md`)
2. Criar diretório `.factory/`
3. Copiar os seguintes arquivos para `.factory/`:
   - `agents/` - Arquivos de definição de agentes
   - `skills/` - Módulos de habilidades
   - `policies/` - Documentos de políticas
   - `templates/` - Modelos de configuração
   - `pipeline.yaml` - Definição do pipeline
4. Gerar `config.yaml` e `state.json`
5. Gerar `.claude/settings.local.json` (configuração de permissões do Claude Code)
6. Tentar instalar plugins obrigatórios:
   - superpowers (necessário para a fase Bootstrap)
   - ui-ux-pro-max-skill (necessário para a fase UI)
7. Iniciar automaticamente o assistente de IA (Claude Code ou OpenCode)

### Exemplos

**Inicializar projeto especificando nome e descrição**:

```bash
factory init --name "Todo App" --description "Um aplicativo simples de tarefas"
```

**Inicializar projeto no diretório atual**:

```bash
factory init
```

### Observações

- O diretório deve estar vazio ou conter apenas arquivos de configuração (`.git`, `.gitignore`, `README.md`)
- Se já existir um diretório `.factory/`, será solicitado usar `factory reset` para redefinir

---

## factory run

Executa o pipeline, começando a partir da fase atual ou da fase especificada.

### Sintaxe

```bash
factory run [stage] [options]
```

### Parâmetros

| Parâmetro | Abreviação | Tipo | Obrigatório | Descrição |
| ---- | ----- | ---- | ---- | ---- |
| `stage` | - | string | Não | Nome da fase do pipeline (bootstrap/prd/ui/tech/code/validation/preview) |

### Opções

| Opção | Abreviação | Tipo | Descrição |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | Ignorar prompts de confirmação |

### Descrição da Função

Após executar o comando `factory run`, o seguinte será realizado:

1. Verificar se é um projeto Factory
2. Ler `config.yaml` e `state.json`
3. Exibir status atual do pipeline
4. Determinar a fase de destino (especificada por parâmetro ou fase atual)
5. Detectar tipo de assistente de IA (Claude Code / Cursor / OpenCode)
6. Gerar instruções de execução correspondentes ao assistente
7. Exibir lista de fases disponíveis e progresso

### Exemplos

**Executar pipeline começando pela fase bootstrap**:

```bash
factory run bootstrap
```

**Continuar execução a partir da fase atual**:

```bash
factory run
```

**Ignorar confirmação e executar diretamente**:

```bash
factory run bootstrap --force
```

### Exemplo de Saída

```
Agent Factory - Pipeline Runner

Pipeline Status:
────────────────────────────────────────
Project: Todo App
Status: Running
Current Stage: bootstrap
Completed: 

🤖 Claude Code Instructions:
─────────────────────────
This is an Agent Factory project. To execute the pipeline:

1. Read pipeline definition:
   Read(/path/to/.factory/pipeline.yaml)

2. Read orchestrator agent:
   Read(/path/to/.factory/agents/orchestrator.checkpoint.md)

3. Read project config:
   Read(/path/to/.factory/config.yaml)

Then execute the pipeline starting from: bootstrap

────────────────────────────────────────
Available stages:
  ○ bootstrap
  ○ prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

────────────────────────────────────────
Ready! Follow instructions above to continue.
```

---

## factory continue

Cria uma nova sessão para continuar executando o pipeline, economizando Token.

### Sintaxe

```bash
factory continue
```

### Descrição da Função

Após executar o comando `factory continue`, o seguinte será realizado:

1. Verificar se é um projeto Factory
2. Ler `state.json` para obter o status atual
3. Regenerar configuração de permissões do Claude Code
4. Iniciar nova janela do Claude Code
5. Continuar executando a partir da fase atual

### Cenários de Uso

- Evitar acúmulo de Token após cada fase concluída
- Cada fase desfruta de contexto limpo
- Suporta recuperação após interrupção

### Exemplos

**Continuar executando o pipeline**:

```bash
factory continue
```

### Observações

- É necessário ter o Claude Code instalado
- Nova janela do Claude Code será iniciada automaticamente

---

## factory status

Exibe o status detalhado do projeto Factory atual.

### Sintaxe

```bash
factory status
```

### Descrição da Função

Após executar o comando `factory status`, será exibido:

- Nome, descrição, caminho e horário de criação do projeto
- Status do pipeline (idle/running/waiting_for_confirmation/paused/failed/completed)
- Fase atual
- Lista de fases concluídas
- Progresso de cada fase
- Status do arquivo de entrada (input/idea.md)
- Status do diretório de artefatos (artifacts/)
- Quantidade e tamanho dos arquivos de artefatos

### Exemplos

```bash
factory status
```

### Exemplo de Saída

```
Agent Factory - Project Status

Project:
  Name: Todo App
  Description: Um aplicativo simples de tarefas
  Path: /Users/user/Projects/todo-app
  Created: 2026-01-29T10:00:00.000Z

Pipeline:
  Status: Running
  Current Stage: prd
  Completed: bootstrap

Progress:
  ✓ bootstrap
  → prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

Input:
  File: input/idea.md
  Lines: 25
  Preview:
    # Todo App

    Um aplicativo simples de tarefas...

Artifacts:
  ✓ prd (3 files, 12.5 KB)

────────────────────────────────────────
Commands:
  factory run     - Run pipeline
  factory run <stage> - Run from stage
  factory reset  - Reset pipeline state
```

---

## factory list

Lista todos os projetos Factory.

### Sintaxe

```bash
factory list
```

### Descrição da Função

Após executar o comando `factory list`, o seguinte será realizado:

1. Pesquisar diretórios de projeto comuns (`~/Projects`, `~/Desktop`, `~/Documents`, `~`)
2. Pesquisar diretório atual e diretórios pai (até 3 níveis)
3. Listar todos os projetos contendo o diretório `.factory/`
4. Exibir status dos projetos (ordenados por: em execução, aguardando, falha, concluído)

### Exemplos

```bash
factory list
```

### Exemplo de Saída

```
Agent Factory - Projects

Found 2 project(s):

◉ Todo App
  Um aplicativo simples de tarefas
  Path: /Users/user/Projects/todo-app
  Stage: prd

○ Blog System
  Sistema de blog
  Path: /Users/user/Projects/blog
  Completed: bootstrap

────────────────────────────────────────
Work on a project: cd <path> && factory run
```

---

## factory reset

Redefine o status do pipeline do projeto atual, preservando os artefatos.

### Sintaxe

```bash
factory reset [options]
```

### Opções

| Opção | Abreviação | Tipo | Descrição |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | Ignorar confirmação |

### Descrição da Função

Após executar o comando `factory reset`, o seguinte será realizado:

1. Verificar se é um projeto Factory
2. Exibir status atual
3. Confirmar redefinição (exceto ao usar `--force`)
4. Redefinir `state.json` para o estado inicial
5. Atualizar a seção pipeline do `config.yaml`
6. Preservar todos os artefatos em `artifacts/`

### Cenários de Uso

- Recomeçar a partir da fase bootstrap
- Limpar erros de estado
- Reconfigurar o pipeline

### Exemplos

**Redefinir status do projeto**:

```bash
factory reset
```

**Ignorar confirmação e redefinir diretamente**:

```bash
factory reset --force
```

### Observações

- Apenas o status do pipeline é redefinido, os artefatos não são excluídos
- Para excluir completamente o projeto, é necessário excluir manualmente os diretórios `.factory/` e `artifacts/`

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-29

| Comando | Caminho do Arquivo | Linhas |
| ----- | --------- | ---- |
| Entrada CLI | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 17-122 |
| comando init | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| comando run | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-335 |
| comando continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |
| comando status | [`cli/commands/status.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/status.js) | 1-203 |
| comando list | [`cli/commands/list.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/list.js) | 1-160 |
| comando reset | [`cli/commands/reset.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/reset.js) | 1-100 |

**Funções Principais**:
- `getFactoryRoot()` - Obter diretório raiz do Factory (factory.js:22-52)
- `isFactoryProject()` - Verificar se é um projeto Factory (init.js:22-26)
- `generateConfig()` - Gerar configuração do projeto (init.js:58-76)
- `launchClaudeCode()` - Iniciar Claude Code (init.js:119-147)
- `launchOpenCode()` - Iniciar OpenCode (init.js:152-215)
- `detectAIAssistant()` - Detectar tipo de assistente de IA (run.js:105-124)
- `updateState()` - Atualizar status do pipeline (run.js:94-100)

**Bibliotecas Dependentes**:
- `commander` - Análise de parâmetros CLI
- `chalk` - Saída colorida no terminal
- `ora` - Animação de carregamento
- `inquirer` - Prompts interativos
- `yaml` - Análise de arquivos YAML
- `fs-extra` - Operações de sistema de arquivos

</details>
