---
title: "Configuração Avançada: Agentes e Permissões | oh-my-opencode"
sidebarTitle: "Controle de Comportamento de Agentes"
subtitle: "Configuração Avançada: Agentes e Permissões | oh-my-opencode"
description: "Aprenda a configurar agentes, permissões, substituição de modelos e modificação de prompts no oh-my-opencode. Crie sua equipe de desenvolvimento de IA com controle preciso sobre o comportamento e capacidades de cada agente."
tags:
  - "configuração"
  - "agentes"
  - "permissões"
  - "personalização"
prerequisite:
  - "start-installation"
  - "platforms-provider-setup"
order: 140
---

# Configuração Personalizada em Profundidade: Gerenciamento de Agentes e Permissões

## O Que Você Vai Aprender

- Personalizar o modelo e parâmetros usados por cada agente
- Controlar precisamente as permissões dos agentes (edição de arquivos, execução Bash, requisições Web, etc.)
- Adicionar instruções extras aos agentes via `prompt_append`
- Criar Categories personalizadas para composição dinâmica de agentes
- Ativar/desativar agentes, Skills, Hooks e MCPs específicos

## Sua Situação Atual

**A configuração padrão funciona bem, mas não se ajusta perfeitamente às suas necessidades:**
- O Oracle usa GPT 5.2, que é caro demais; você quer um modelo mais barato
- O agente Explore não deveria ter permissão de escrita, apenas pesquisa
- Você quer que o Librarian pesquise documentação oficial em vez do GitHub
- Um determinado Hook está gerando falsos positivos e você quer desativá-lo temporariamente

**O que você precisa é "customização profunda"** — não apenas "funciona", mas "exatamente o que você precisa".

---

## 🎒 Antes de Começar

::: warning Pré-requisitos
Este tutorial assume que você já concluiu a [Instalação](../../start/installation/) e a [Configuração do Provider](../../platforms/provider-setup/).
:::

**Você precisa saber**:
- Localização do arquivo de configuração: `~/.config/opencode/oh-my-opencode.json` (nível de usuário) ou `.opencode/oh-my-opencode.json` (nível de projeto)
- Configuração de nível de usuário tem prioridade sobre a de nível de projeto

---

## Conceito Principal

**Prioridade de Configuração**: Configuração de nível de usuário > Configuração de nível de projeto > Configuração padrão

```
~/.config/opencode/oh-my-opencode.json (maior prioridade)
    ↓ sobrescreve
.opencode/oh-my-opencode.json (nível de projeto)
    ↓ sobrescreve
oh-my-opencode padrões internos (menor prioridade)
```

**Arquivo de configuração suporta JSONC**:
- Pode usar `//` para adicionar comentários
- Pode usar `/* */` para adicionar comentários em bloco
- Pode ter vírgulas finais

---

## Siga Comigo

### Etapa 1: Encontre o arquivo de configuração e habilite o autocompletar do Schema

**Por quê**
Habilitar o JSON Schema permite que seu editor sugira automaticamente todos os campos e tipos disponíveis, evitando erros de configuração.

**Operação**:

```jsonc
{
  // Adicione esta linha para habilitar o autocompletar
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  
  // Sua configuração...
}
```

**Você deve ver**:
- No VS Code / JetBrains, ao digitar `{`, todos os campos disponíveis serão sugeridos automaticamente
- Ao passar o mouse sobre um campo, a descrição e o tipo serão exibidos

---

### Etapa 2: Personalize o modelo do agente

**Por quê**
Diferentes tarefas requerem modelos diferentes:
- **Design de arquitetura**: Use o modelo mais forte (Claude Opus 4.5)
- **Exploração rápida**: Use o modelo mais rápido (Grok Code)
- **Design de UI**: Use modelo visual (Gemini 3 Pro)
- **Controle de custo**: Use modelos baratos para tarefas simples

**Operação**:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle: Consultor estratégico, usa GPT 5.2
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1  // Temperatura baixa, mais determinístico
    },

    // Explore: Exploração rápida, usa modelo gratuito
    "explore": {
      "model": "opencode/gpt-5-nano",  // Gratuito
      "temperature": 0.3
    },

    // Librarian: Pesquisa de documentação, usa modelo com grande contexto
    "librarian": {
      "model": "anthropic/claude-sonnet-4-5"
    },

    // Multimodal Looker: Análise de mídia, usa Gemini
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

**Você deve ver**:
- Cada agente usando modelos diferentes, otimizados para as características da tarefa
- Após salvar a configuração, a próxima chamada ao agente correspondente usará o novo modelo

---

### Etapa 3: Configure as permissões do agente

**Por quê**
Certos agentes **não deveriam** ter todas as permissões:
- Oracle (Consultor estratégico): Somente leitura, não precisa escrever arquivos
- Librarian (Especialista em pesquisa): Somente leitura, não precisa executar Bash
- Explore (Exploração): Somente leitura, não precisa fazer requisições Web

**Operação**:

```jsonc
{
  "agents": {
    "explore": {
      // Proíbe escrita de arquivos e execução Bash, permite apenas pesquisa Web
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"
      }
    },

    "librarian": {
      // Permissão somente leitura
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Precisa pesquisar documentação
      }
    },

    "oracle": {
      // Permissão somente leitura
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Precisa consultar recursos
      }
    },

    // Sisyphus: Orquestrador principal, pode executar todas as operações
    "sisyphus": {
      "permission": {
        "edit": "allow",
        "bash": "allow",
        "webfetch": "allow"
      }
    }
  }
}
```

**Explicação das permissões**:

| Permissão      | Valor            | Descrição                                           |
| --- | --- | ---|
| `edit`         | `ask/allow/deny` | Permissão de edição de arquivos                                    |
| `bash`         | `ask/allow/deny` ou objeto | Permissão de execução Bash (pode ser refinada para comandos específicos)             |
| `webfetch`     | `ask/allow/deny` | Permissão de requisição Web                                  |
| `doom_loop`    | `ask/allow/deny` | Permitir que o agente substitua a detecção de loop infinito                   |
| `external_directory` | `ask/allow/deny` | Permissão de acesso a diretórios fora do projeto                         |

**Refinamento de permissão Bash**:

```jsonc
{
  "agents": {
    "explore": {
      "permission": {
        "bash": {
          "git": "allow",      // Permite executar comandos git
          "grep": "allow",     // Permite executar grep
          "rm": "deny",       // Proíbe deletar arquivos
          "mv": "deny"        // Proíbe mover arquivos
        }
      }
    }
  }
}
```

**Você deve ver**:
- Após configurar as permissões, quando um agente tentar executar uma operação proibida, ela será automaticamente negada
- No OpenCode, você verá uma notificação de permissão negada

---

### Etapa 4: Use prompt_append para adicionar instruções extras

**Por quê**
O prompt do sistema padrão já é muito bom, mas você pode ter **necessidades especiais**:
- Fazer o Librarian pesquisar documentação específica primeiro
- Fazer o Oracle seguir padrões arquiteturais específicos
- Fazer o Explore usar palavras-chave de pesquisa específicas

**Operação**:

```jsonc
{
  "agents": {
    "librarian": {
      // Anexado ao final do prompt padrão do sistema, não substitui
      "prompt_append": "Sempre use elisp-dev-mcp para pesquisas de documentação de Emacs Lisp. " +
                      "Ao pesquisar documentação, priorize documentação oficial sobre posts de blog."
    },

    "oracle": {
      "prompt_append": "Siga os princípios SOLID e padrões de Arquitetura Limpa. " +
                    "Sempre sugira tipos TypeScript para todas as assinaturas de função."
    },

    "explore": {
      "prompt_append": "Ao pesquisar código, priorize commits recentes e arquivos ativamente mantidos. " +
                    "Ignore arquivos de teste a menos que explicitamente solicitado."
    }
  }
}
```

**Você deve ver**:
- O comportamento do agente muda, mas mantém suas capacidades originais
- Por exemplo, pedindo ao Oracle para sempre sugerir tipos TypeScript

---

### Etapa 5: Configuração personalizada de Category

**Por quê**
Category é uma nova funcionalidade da v3.0 que permite **composição dinâmica de agentes**:
- Definir modelos e parâmetros para tipos de tarefas específicas
- Invocação rápida via `delegate_task(category="...")`
- Mais eficiente que "manualmente selecionar modelo + escrever prompt"

**Operação**:

```jsonc
{
  "categories": {
    // Personalizado: tarefas de ciência de dados
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "prompt_append": "Foque em análise de dados, pipelines de ML e métodos estatísticos. " +
                     "Use pandas/numpy para Python e dplyr/tidyr para R."
    },

    // Sobrescreve o padrão: tarefas de UI usando prompt personalizado
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "prompt_append": "Use componentes shadcn/ui e Tailwind CSS. " +
                     "Garanta design responsivo e acessibilidade."
    },

    // Sobrescreve o padrão: tarefas rápidas
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1,
      "prompt_append": "Seja conciso. Foque em correções simples e pesquisas rápidas."
    }
  }
}
```

**Campos de configuração de Category**:

| Campo              | Descrição                         | Exemplo                              |
| --- | --- | ---|
| `model`           | Modelo usado                   | `"anthropic/claude-sonnet-4-5"`    |
| `temperature`     | Temperatura (0-2)                 | `0.2` (determinístico) / `0.8` (criativo)    |
| `top_p`           | Nucleus sampling (0-1)               | `0.9`                              |
| `maxTokens`       | Número máximo de Tokens               | `4000`                             |
| `thinking`        | Configuração de Thinking               | `{"type": "enabled", "budgetTokens": 16000}` |
| `prompt_append`    | Prompt anexado                   | `"Use X for Y"`                    |
| `tools`           | Permissões de ferramentas                   | `{"bash": false}`                    |
| `is_unstable_agent` | Marcar como instável (força modo background) | `true`                              |

**Usando Category**:

```
// No OpenCode
delegate_task(category="data-science", prompt="Analise este dataset e gere visualizações")
delegate_task(category="visual-engineering", prompt="Crie componentes de dashboard responsivos")
delegate_task(category="quick", prompt="Procure a definição desta função")
```

**Você deve ver**:
- Diferentes tipos de tarefas automaticamente usando os modelos e configurações mais adequados
- Não precisa especificar manualmente modelo e parâmetros toda vez

---

### Etapa 6: Desabilite funcionalidades específicas

**Por quê**
Certas funcionalidades podem não ser adequadas para seu fluxo de trabalho:
- `comment-checker`: seu projeto permite comentários detalhados
- `agent-usage-reminder`: você sabe quando usar qual agente
- Algum MCP: você não precisa

**Operação**:

```jsonc
{
  // Desabilitar Hooks específicos
  "disabled_hooks": [
    "comment-checker",           // Não verificar comentários
    "agent-usage-reminder",       // Não sugerir uso de agentes
    "startup-toast"               // Não mostrar notificação de inicialização
  ],

  // Desabilitar Skills específicas
  "disabled_skills": [
    "playwright",                // Não usar Playwright
    "frontend-ui-ux"            // Não usar Skill frontend embutida
  ],

  // Desabilitar MCPs específicos
  "disabled_mcps": [
    "websearch",                // Não usar pesquisa Exa
    "context7",                // Não usar Context7
    "grep_app"                 // Não usar grep.app
  ],

  // Desabilitar agentes específicos
  "disabled_agents": [
    "multimodal-looker",        // Não usar Multimodal Looker
    "metis"                   // Não usar Metis para análise prévia
  ]
}
```

**Lista de Hooks disponíveis** (parcial):

| Nome do Hook                | Função                           |
| --- | ---|
| `todo-continuation-enforcer` | Forçar conclusão da lista de TODO              |
| `comment-checker`          | Detectar comentários redundantes                  |
| `tool-output-truncator`     | Truncar saída de ferramentas para economizar contexto        |
| `keyword-detector`         | Detectar palavras-chave como ultrawork          |
| `agent-usage-reminder`     | Sugerir qual agente usar           |
| `session-notification`      | Notificação de fim de sessão                  |
| `background-notification`    | Notificação de tarefa em background concluída              |

**Você deve ver**:
- Funcionalidades desabilitadas não serão mais executadas
- Ao reativar, a funcionalidade será restaurada

---

### Etapa 7: Configurar controle de concorrência de tarefas em background

**Por quê**
Tarefas em background paralelas precisam de **controle de concorrência**:
- Evitar limitação de taxa da API
- Controlar custos (modelos caros não podem ter muita concorrência)
- Respeitar cotas do Provider

**Operação**:

```jsonc
{
  "background_task": {
    // Concorrência máxima padrão
    "defaultConcurrency": 5,

    // Limites de concorrência por Provider
    "providerConcurrency": {
      "anthropic": 3,      // API Anthropic máximo 3 concorrentes
      "openai": 5,         // API OpenAI máximo 5 concorrentes
      "google": 10          // API Gemini máximo 10 concorrentes
    },

    // Limites de concorrência por modelo (maior prioridade)
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,     // Opus é caro, limitado a 2 concorrentes
      "google/gemini-3-flash": 10,          // Flash é barato, permite 10 concorrentes
      "anthropic/claude-haiku-4-5": 15      // Haiku é mais barato, permite 15 concorrentes
    }
  }
}
```

**Ordem de prioridade**:
```
modelConcurrency > providerConcurrency > defaultConcurrency
```

**Você deve ver**:
- Tarefas em background que excedem o limite de concorrência serão enfileiradas
- Concorrência de modelos caros é limitada, economizando custos

---

### Etapa 8: Habilitar funcionalidades experimentais

**Por quê**
Funcionalidades experimentais fornecem **capacidades extras**, mas podem ser instáveis:
- `aggressive_truncation`: Truncagem de contexto mais agressiva
- `auto_resume`: Recuperação automática de falhas
- `truncate_all_tool_outputs`: Truncar todas as saídas de ferramentas

::: danger Aviso
Funcionalidades experimentais podem ser removidas ou ter seu comportamento alterado em versões futuras. Teste bem antes de habilitar.
:::

**Operação**:

```jsonc
{
  "experimental": {
    // Habilitar truncagem agressiva de saídas de ferramentas
    "aggressive_truncation": true,

    // Recuperação automática de erros de thinking block
    "auto_resume": true,

    // Truncar todas as saídas de ferramentas (não apenas Grep/Glob/LSP/AST-Grep)
    "truncate_all_tool_outputs": false
  }
}
```

**Você deve ver**:
- Em modo agressivo, as saídas de ferramentas são truncadas mais estritamente para economizar contexto
- Com `auto_resume` habilitado, o agente continuará trabalhando automaticamente após encontrar erros

---

## Ponto de Verificação ✅

**Verifique se a configuração está funcionando**:

```bash
# Execute o comando de diagnóstico
bunx oh-my-opencode doctor --verbose
```

**Você deve ver**:
- Resultado de resolução de modelo para cada agente
- Suas substituições de configuração estão ativas
- Funcionalidades desabilitadas estão sendo reconhecidas corretamente

---

## Armadilhas Comuns

### 1. Erro de formato do arquivo de configuração

**Problema**:
- Erro de sintaxe JSON (vírgula faltando, vírgula extra)
- Nome de campo digitado incorretamente (`temperature` escrito como `temparature`)

**Solução**:
```bash
# Verifique o formato JSON
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

### 2. Configuração de permissão muito restritiva

**Problema**:
- Certos agentes foram completamente desabilitados (`edit: "deny"`, `bash: "deny"`)
- Isso impede que o agente execute seu trabalho normal

**Solução**:
- Agentes somente leitura (Oracle, Librarian) podem desabilitar `edit` e `bash`
- O orquestrador principal (Sisyphus) precisa de permissões completas

### 3. Configuração de Category não está funcionando

**Problema**:
- Nome de Category digitado incorretamente (`visual-engineering` escrito como `visual-engineering`)
- `delegate_task` não especificou o parâmetro `category`

**Solução**:
- Verifique se o nome em `delegate_task(category="...")` corresponde à configuração
- Use `doctor --verbose` para verificar o resultado de resolução de Category

### 4. Limite de concorrência muito baixo

**Problema**:
- `modelConcurrency` definido muito baixo (como `1`)
- Tarefas em background executam quase sequencialmente, perdendo a vantagem do paralelismo

**Solução**:
- Defina de forma razoável de acordo com orçamento e cota de API
- Modelos caros (Opus) limite a 2-3, modelos baratos (Haiku) podem ter 10+

---

## Resumo da Lição

**Configuração personalizada em profundidade = Controle preciso**:

| Item de configuração           | Propósito                          | Cenários comuns                         |
| --- | --- | ---|
| `agents.model`    | Substituir modelo do agente                  | Otimização de custo, adaptação de tarefas             |
| `agents.permission` | Controlar permissões do agente                | Isolamento de segurança, modo somente leitura           |
| `agents.prompt_append` | Anexar instruções extras                | Seguir especificações de arquitetura, otimizar estratégia de pesquisa |
| `categories`      | Composição dinâmica de agentes                  | Invocar rapidamente tipos específicos de tarefas           |
| `background_task` | Controle de concorrência                     | Controle de custo, cota de API           |
| `disabled_*`      | Desabilitar funcionalidades específicas                 | Remover funcionalidades raramente usadas               |

**Lembre-se**:
- Configuração de nível de usuário (`~/.config/opencode/oh-my-opencode.json`) tem prioridade sobre a de nível de projeto
- Use JSONC para tornar a configuração mais legível
- Execute `oh-my-opencode doctor --verbose` para verificar a configuração

---

## Próxima Lição

> Na próxima lição, aprenderemos **[Diagnóstico e Resolução de Problemas](../../faq/troubleshooting/)**.
>
> Você vai aprender:
> - Usar o comando doctor para verificação de saúde
> - Diagnosticar problemas de versão do OpenCode, registro de plugins, configuração de Provider
> - Entender mecanismo de resolução de modelos e configuração de Categories
> - Usar saída JSON para diagnóstico automatizado

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-26

| Funcionalidade                | Caminho do arquivo                                                                 | Linhas    |
| --- | --- | ---|
| Definição do Schema de configuração    | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378   |
| AgentOverrideConfig | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 98-119   |
| CategoryConfig      | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172  |
| AgentPermissionSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 11-17    |
| OhMyOpenCodeConfigSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 329-350  |
| Documentação de configuração          | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 1-595   |

**Constantes importantes**:
- `PermissionValue = z.enum(["ask", "allow", "deny"])`: Enumeração de valores de permissão

**Tipos importantes**:
- `AgentOverrideConfig`: Configuração de substituição de agente (modelo, temperatura, prompt, etc.)
- `CategoryConfig`: Configuração de Category (modelo, temperatura, prompt, etc.)
- `AgentPermissionSchema`: Configuração de permissão de agente (edit, bash, webfetch, etc.)
- `BackgroundTaskConfig`: Configuração de concorrência de tarefas em background

**Enumeração de agentes embutidos** (`BuiltinAgentNameSchema`):
- `sisyphus`, `prometheus`, `oracle`, `librarian`, `explore`, `multimodal-looker`, `metis`, `momus`, `atlas`

**Enumeração de Skills embutidas** (`BuiltinSkillNameSchema`):
- `playwright`, `agent-browser`, `frontend-ui-ux`, `git-master`

**Enumeração de Categories embutidas** (`BuiltinCategoryNameSchema`):
- `visual-engineering`, `ultrabrain`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`

</details>
