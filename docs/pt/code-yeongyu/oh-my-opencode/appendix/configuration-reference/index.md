---
title: "Referência de Configuração: Opções Completas | oh-my-opencode"
sidebarTitle: "Guia Completo de Configuração"
subtitle: "Referência de Configuração: Opções Completas"
description: "Aprenda todas as opções de configuração e definições de campos do oh-my-opencode. Cobre agentes, categorias, hooks, tarefas em segundo plano e todas as configurações para personalizar profundamente seu ambiente de desenvolvimento OpenCode e otimizar o fluxo de trabalho de codificação com IA."
tags:
  - "configuração"
  - "referência"
  - "schema"
prerequisite: []
order: 180
---

# Referência de Configuração: Explicação Completa do Schema do Arquivo de Configuração

Esta página fornece definições e explicações completas dos campos do arquivo de configuração do oh-my-opencode.

::: info Localização do Arquivo de Configuração
- Nível do projeto: `.opencode/oh-my-opencode.json`
- Nível do usuário (macOS/Linux): `~/.config/opencode/oh-my-opencode.json`
- Nível do usuário (Windows): `%APPDATA%\opencode\oh-my-opencode.json`

A configuração no nível do projeto tem prioridade sobre a configuração no nível do usuário.
:::

::: tip Habilitar Autocompletar
Adicione o campo `$schema` no topo do arquivo de configuração para obter autocompletar na IDE:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
}
```
:::

## Campos de Nível Raiz

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `$schema` | string | Não | - | Link do JSON Schema para autocompletar |
| `disabled_mcps` | string[] | Não | [] | Lista de MCPs desabilitados |
| `disabled_agents` | string[] | Não | [] | Lista de agentes desabilitados |
| `disabled_skills` | string[] | Não | [] | Lista de habilidades desabilitadas |
| `disabled_hooks` | string[] | Não | [] | Lista de hooks desabilitados |
| `disabled_commands` | string[] | Não | [] | Lista de comandos desabilitados |
| `agents` | object | Não | - | Configuração de substituição de agentes |
| `categories` | object | Não | - | Configuração personalizada de categorias |
| `claude_code` | object | Não | - | Configuração de compatibilidade com Claude Code |
| `sisyphus_agent` | object | Não | - | Configuração do agente Sisyphus |
| `comment_checker` | object | Não | - | Configuração do verificador de comentários |
| `experimental` | object | Não | - | Configuração de recursos experimentais |
| `auto_update` | boolean | Não | true | Verificação automática de atualizações |
| `skills` | object\|array | Não | - | Configuração de Skills |
| `ralph_loop` | object | Não | - | Configuração do Ralph Loop |
| `background_task` | object | Não | - | Configuração de concorrência de tarefas em segundo plano |
| `notification` | object | Não | - | Configuração de notificações |
| `git_master` | object | Não | - | Configuração da habilidade Git Master |
| `browser_automation_engine` | object | Não | - | Configuração do mecanismo de automação de navegador |
| `tmux` | object | Não | - | Configuração de gerenciamento de sessão Tmux |

## agents - Configuração de Agentes

Substitui as configurações dos agentes integrados. Cada agente suporta os seguintes campos:

### Campos Comuns de Agentes

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `model` | string | Não | Substitui o modelo usado pelo agente (obsoleto, recomenda-se usar category) |
| `variant` | string | Não | Variante do modelo |
| `category` | string | Não | Herda modelo e configuração da categoria |
| `skills` | string[] | Não | Lista de habilidades injetadas no prompt do agente |
| `temperature` | number | Não | 0-2, controla a aleatoriedade |
| `top_p` | number | Não | 0-1, parâmetro de amostragem nucleus |
| `prompt` | string | Não | Substitui completamente o prompt do sistema padrão |
| `prompt_append` | string | Não | Anexa ao prompt padrão |
| `tools` | object | Não | Substituição de permissões de ferramentas (`{toolName: boolean}`) |
| `disable` | boolean | Não | Desabilita este agente |
| `description` | string | Não | Descrição do agente |
| `mode` | enum | Não | `subagent` / `primary` / `all` |
| `color` | string | Não | Cor hexadecimal (ex: `#FF0000`) |
| `permission` | object | Não | Restrições de permissão do agente |

### permission - Permissões de Agentes

| Campo | Tipo | Obrigatório | Valor | Descrição |
| --- | --- | --- | --- | --- |
| `edit` | string | Não | `ask`/`allow`/`deny` | Permissão de edição de arquivos |
| `bash` | string/object | Não | `ask`/`allow`/`deny` ou por comando | Permissão de execução Bash |
| `webfetch` | string | Não | `ask`/`allow`/`deny` | Permissão de requisições web |
| `doom_loop` | string | Não | `ask`/`allow`/`deny` | Permissão de substituição de detecção de loop infinito |
| `external_directory` | string | Não | `ask`/`allow`/`deny` | Permissão de acesso a diretórios externos |

### Lista de Agentes Configuráveis

| Nome do Agente | Descrição |
| --- | --- |
| `sisyphus` | Agente orquestrador principal |
| `prometheus` | Agente planejador estratégico |
| `oracle` | Agente consultor estratégico |
| `librarian` | Agente especialista em pesquisa multi-repositório |
| `explore` | Agente especialista em exploração rápida de código |
| `multimodal-looker` | Agente especialista em análise de mídia |
| `metis` | Agente de análise pré-planejamento |
| `momus` | Agente revisor de planejamento |
| `atlas` | Agente orquestrador principal |
| `sisyphus-junior` | Agente executor de tarefas gerado por categoria |

### Exemplo de Configuração

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": ["git-master"]
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    },
    "multimodal-looker": {
      "disable": true
    }
  }
}
```

## categories - Configuração de Categorias

Define categorias (abstrações de modelos) para composição dinâmica de agentes.

### Campos de Categoria

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `description` | string | Não | Descrição do propósito da categoria (exibida no prompt delegate_task) |
| `model` | string | Não | Substitui o modelo usado pela categoria |
| `variant` | string | Não | Variante do modelo |
| `temperature` | number | Não | 0-2, temperatura |
| `top_p` | number | Não | 0-1, amostragem nucleus |
| `maxTokens` | number | Não | Número máximo de tokens |
| `thinking` | object | Não | Configuração de Thinking `{type, budgetTokens}` |
| `reasoningEffort` | enum | Não | `low` / `medium` / `high` / `xhigh` |
| `textVerbosity` | enum | Não | `low` / `medium` / `high` |
| `tools` | object | Não | Permissões de ferramentas |
| `prompt_append` | string | Não | Prompt anexado |
| `is_unstable_agent` | boolean | Não | Marca como agente instável (força modo em segundo plano) |

### Configuração de thinking

| Campo | Tipo | Obrigatório | Valor | Descrição |
| --- | --- | --- | --- | --- |
| `type` | string | Sim | `enabled`/`disabled` | Se habilita Thinking |
| `budgetTokens` | number | Não | - | Número de tokens de orçamento para Thinking |

### Categorias Integradas

| Categoria | Modelo Padrão | Temperature | Descrição |
| --- | --- | --- | --- |
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Tarefas de frontend, UI/UX, design |
| `ultrabrain` | `openai/gpt-5.2-codex` | 0.1 | Tarefas de raciocínio de alta inteligência |
| `artistry` | `google/gemini-3-pro` | 0.7 | Tarefas criativas e artísticas |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Tarefas rápidas e de baixo custo |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tarefas médias de tipo não especificado |
| `unspecified-high` | `anthropic/claude-opus-4-5` | 0.1 | Tarefas de alta qualidade de tipo não especificado |
| `writing` | `google/gemini-3-flash` | 0.1 | Tarefas de documentação e escrita |

### Exemplo de Configuração

```jsonc
{
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Data analysis and ML tasks"
    }
  }
}
```

## claude_code - Configuração de Compatibilidade com Claude Code

Controla vários recursos da camada de compatibilidade com Claude Code.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `mcp` | boolean | Não | - | Se carrega o arquivo `.mcp.json` |
| `commands` | boolean | Não | - | Se carrega Commands |
| `skills` | boolean | Não | - | Se carrega Skills |
| `agents` | boolean | Não | - | Se carrega Agents (reservado) |
| `hooks` | boolean | Não | - | Se carrega hooks do settings.json |
| `plugins` | boolean | Não | - | Se carrega plugins do Marketplace |
| `plugins_override` | object | Não | - | Desabilita plugins específicos (`{pluginName: boolean}`) |

### Exemplo de Configuração

```jsonc
{
  "claude_code": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "hooks": false,
    "plugins": true,
    "plugins_override": {
      "some-plugin": false
    }
  }
}
```

## sisyphus_agent - Configuração do Agente Sisyphus

Controla o comportamento do sistema de orquestração Sisyphus.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `disabled` | boolean | Não | false | Desabilita o sistema de orquestração Sisyphus |
| `default_builder_enabled` | boolean | Não | false | Habilita o agente OpenCode-Builder |
| `planner_enabled` | boolean | Não | true | Habilita o agente Prometheus (Planner) |
| `replace_plan` | boolean | Não | true | Rebaixa o agente plan padrão para subagent |

### Exemplo de Configuração

```jsonc
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

## background_task - Configuração de Tarefas em Segundo Plano

Controla o comportamento de concorrência do sistema de gerenciamento de agentes em segundo plano.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `defaultConcurrency` | number | Não | - | Número máximo de concorrência padrão |
| `providerConcurrency` | object | Não | - | Limite de concorrência no nível do provedor (`{providerName: number}`) |
| `modelConcurrency` | object | Não | - | Limite de concorrência no nível do modelo (`{modelName: number}`) |
| `staleTimeoutMs` | number | Não | 180000 | Tempo de timeout (milissegundos), mínimo 60000 |

### Ordem de Prioridade

`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### Exemplo de Configuração

```jsonc
{
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,
      "google/gemini-3-flash": 10
    },
    "staleTimeoutMs": 180000
  }
}
```

## git_master - Configuração da Habilidade Git Master

Controla o comportamento da habilidade Git Master.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `commit_footer` | boolean | Não | true | Adiciona rodapé "Ultraworked with Sisyphus" na mensagem de commit |
| `include_co_authored_by` | boolean | Não | true | Adiciona trailer "Co-authored-by: Sisyphus" na mensagem de commit |

### Exemplo de Configuração

```jsonc
{
  "git_master": {
    "commit_footer": true,
    "include_co_authored_by": true
  }
}
```

## browser_automation_engine - Configuração de Automação de Navegador

Seleciona o provedor de automação de navegador.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `provider` | enum | Não | `playwright` | Provedor de automação de navegador |

### Valores Possíveis para provider

| Valor | Descrição | Requisitos de Instalação |
| --- | --- | --- |
| `playwright` | Usa servidor MCP Playwright | Instalação automática |

### Exemplo de Configuração

```jsonc
{
  "browser_automation_engine": {
    "provider": "playwright"
  }
}
```

## tmux - Configuração de Sessão Tmux

Controla o comportamento do gerenciamento de sessão Tmux.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Não | false | Se habilita o gerenciamento de sessão Tmux |
| `layout` | enum | Não | `main-vertical` | Layout do Tmux |
| `main_pane_size` | number | Não | 60 | Tamanho do painel principal (20-80) |
| `main_pane_min_width` | number | Não | 120 | Largura mínima do painel principal |
| `agent_pane_min_width` | number | Não | 40 | Largura mínima do painel do agente |

### Valores Possíveis para layout

| Valor | Descrição |
| --- | --- |
| `main-horizontal` | Painel principal no topo, painéis de agente empilhados embaixo |
| `main-vertical` | Painel principal à esquerda, painéis de agente empilhados à direita (padrão) |
| `tiled` | Grade com todos os painéis do mesmo tamanho |
| `even-horizontal` | Todos os painéis dispostos horizontalmente |
| `even-vertical` | Todos os painéis empilhados verticalmente |

### Exemplo de Configuração

```jsonc
{
  "tmux": {
    "enabled": false,
    "layout": "main-vertical",
    "main_pane_size": 60,
    "main_pane_min_width": 120,
    "agent_pane_min_width": 40
  }
}
```

## ralph_loop - Configuração do Ralph Loop

Controla o comportamento do fluxo de trabalho em loop Ralph Loop.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Não | false | Se habilita a funcionalidade Ralph Loop |
| `default_max_iterations` | number | Não | 100 | Número máximo de iterações padrão (1-1000) |
| `state_dir` | string | Não | - | Diretório personalizado de arquivos de estado (relativo à raiz do projeto) |

### Exemplo de Configuração

```jsonc
{
  "ralph_loop": {
    "enabled": false,
    "default_max_iterations": 100,
    "state_dir": ".opencode/"
  }
}
```

## notification - Configuração de Notificações

Controla o comportamento das notificações do sistema.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `force_enable` | boolean | Não | false | Força a habilitação de session-notification, mesmo se detectar plugin de notificação externo |

### Exemplo de Configuração

```jsonc
{
  "notification": {
    "force_enable": false
  }
}
```

## comment_checker - Configuração do Verificador de Comentários

Controla o comportamento do verificador de comentários.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `custom_prompt` | string | Não | - | Prompt personalizado, substitui a mensagem de aviso padrão. Use o placeholder `{{comments}}` para representar o XML de comentários detectados |

### Exemplo de Configuração

```jsonc
{
  "comment_checker": {
    "custom_prompt": "Please review these redundant comments: {{comments}}"
  }
}
```

## experimental - Configuração de Recursos Experimentais

Controla a habilitação de recursos experimentais.

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `aggressive_truncation` | boolean | Não | - | Habilita comportamento de truncamento mais agressivo |
| `auto_resume` | boolean | Não | - | Habilita retomada automática (recupera de erros de bloco de pensamento ou violações de desabilitação de pensamento) |
| `truncate_all_tool_outputs` | boolean | Não | false | Trunca todas as saídas de ferramentas, não apenas ferramentas da lista branca |
| `dynamic_context_pruning` | object | Não | - | Configuração de poda dinâmica de contexto |

### Configuração de dynamic_context_pruning

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Não | false | Habilita poda dinâmica de contexto |
| `notification` | enum | Não | `detailed` | Nível de notificação: `off` / `minimal` / `detailed` |
| `turn_protection` | object | Não | - | Configuração de proteção de turno |
| `protected_tools` | string[] | Não | - | Lista de ferramentas que nunca são podadas |
| `strategies` | object | Não | - | Configuração de estratégias de poda |

### Configuração de turn_protection

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Não | true | Habilita proteção de turno |
| `turns` | number | Não | 3 | Protege saídas de ferramentas dos últimos N turnos (1-10) |

### Configuração de strategies

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `deduplication` | object | Não | - | Configuração de estratégia de deduplicação |
| `supersede_writes` | object | Não | - | Configuração de estratégia de substituição de escritas |
| `purge_errors` | object | Não | - | Configuração de estratégia de limpeza de erros |

### Configuração de deduplication

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Não | true | Remove chamadas de ferramentas duplicadas (mesma ferramenta + mesmos parâmetros) |

### Configuração de supersede_writes

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Não | true | Poda entradas de escrita em leituras subsequentes |
| `aggressive` | boolean | Não | false | Modo agressivo: poda QUALQUER escrita se houver QUALQUER leitura subsequente |

### Configuração de purge_errors

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Não | true | Poda entradas de ferramentas com erro após N turnos |
| `turns` | number | Não | 5 | Número de turnos para podar entradas de ferramentas com erro (1-20) |

### Exemplo de Configuração

```jsonc
{
  "experimental": {
    "aggressive_truncation": true,
    "auto_resume": true,
    "truncate_all_tool_outputs": false,
    "dynamic_context_pruning": {
      "enabled": false,
      "notification": "detailed",
      "turn_protection": {
        "enabled": true,
        "turns": 3
      },
      "protected_tools": [
        "task",
        "todowrite",
        "todoread",
        "lsp_rename",
        "session_read",
        "session_write",
        "session_search"
      ],
      "strategies": {
        "deduplication": {
          "enabled": true
        },
        "supersede_writes": {
          "enabled": true,
          "aggressive": false
        },
        "purge_errors": {
          "enabled": true,
          "turns": 5
        }
      }
    }
  }
}
```

## skills - Configuração de Skills

Configura o carregamento e comportamento de Skills (habilidades especializadas).

### Formato de Configuração

Skills suporta dois formatos:

**Formato 1: Array Simples**

```jsonc
{
  "skills": ["skill1", "skill2", "skill3"]
}
```

**Formato 2: Configuração de Objeto**

```jsonc
{
  "skills": {
    "sources": [
      "path/to/skills",
      {
        "path": "another/path",
        "recursive": true,
        "glob": "*.md"
      }
    ],
    "enable": ["skill1", "skill2"],
    "disable": ["skill3"]
  }
}
```

### Campos de Definição de Skill

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `description` | string | Não | Descrição da Skill |
| `template` | string | Não | Template da Skill |
| `from` | string | Não | Origem |
| `model` | string | Não | Modelo usado |
| `agent` | string | Não | Agente usado |
| `subtask` | boolean | Não | Se é uma subtarefa |
| `argument-hint` | string | Não | Dica de argumento |
| `license` | string | Não | Licença |
| `compatibility` | string | Não | Compatibilidade |
| `metadata` | object | Não | Metadados |
| `allowed-tools` | string[] | Não | Lista de ferramentas permitidas |
| `disable` | boolean | Não | Desabilita esta Skill |

### Skills Integradas

| Skill | Descrição |
| --- | --- |
| `playwright` | Automação de navegador (padrão) |
| `agent-browser` | Automação de navegador (Vercel CLI) |
| `frontend-ui-ux` | Design de UI/UX frontend |
| `git-master` | Especialista em Git |

## Listas de Desabilitação

Os seguintes campos são usados para desabilitar módulos de funcionalidade específicos.

### disabled_mcps - Lista de MCPs Desabilitados

```jsonc
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

### disabled_agents - Lista de Agentes Desabilitados

```jsonc
{
  "disabled_agents": ["oracle", "multimodal-looker"]
}
```

### disabled_skills - Lista de Habilidades Desabilitadas

```jsonc
{
  "disabled_skills": ["playwright"]
}
```

### disabled_hooks - Lista de Hooks Desabilitados

```jsonc
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

### disabled_commands - Lista de Comandos Desabilitados

```jsonc
{
  "disabled_commands": ["init-deep", "start-work"]
}
```

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir locais do código fonte</strong></summary>

> Atualizado: 2026-01-26

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Definição do Schema de Configuração | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-378 |
| JSON Schema | [`assets/oh-my-opencode.schema.json`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/assets/oh-my-opencode.schema.json) | 1-51200 |
| Documentação de Configuração | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/docs/configurations.md) | 1-595 |

**Tipos Principais**:
- `OhMyOpenCodeConfig`: Tipo de configuração principal
- `AgentOverrideConfig`: Tipo de configuração de substituição de agente
- `CategoryConfig`: Tipo de configuração de categoria
- `BackgroundTaskConfig`: Tipo de configuração de tarefa em segundo plano
- `PermissionValue`: Tipo de valor de permissão (`ask`/`allow`/`deny`)

**Enumerações Principais**:
- `BuiltinAgentNameSchema`: Enumeração de nomes de agentes integrados
- `BuiltinSkillNameSchema`: Enumeração de nomes de habilidades integradas
- `BuiltinCategoryNameSchema`: Enumeração de nomes de categorias integradas
- `HookNameSchema`: Enumeração de nomes de hooks
- `BrowserAutomationProviderSchema`: Enumeração de provedores de automação de navegador

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Servidores MCP Integrados](../builtin-mcps/)**.
>
> Você aprenderá:
> - Funcionalidades e métodos de uso dos 3 servidores MCP integrados
> - Configuração e melhores práticas do Exa Websearch, Context7 e grep.app
> - Como usar MCP para pesquisar documentação e código

</details>
