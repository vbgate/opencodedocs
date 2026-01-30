---
title: "Compatibilidade: Integração com Claude Code | oh-my-opencode"
sidebarTitle: "Reutilizar Configurações do Claude Code"
subtitle: "Compatibilidade com Claude Code: Suporte Completo para Commands, Skills, Agents, MCPs e Hooks"
description: "Aprenda sobre a camada de compatibilidade do oh-my-opencode com Claude Code. Domine o carregamento de configurações, regras de prioridade e opções de desativação para uma migração suave para o OpenCode."
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Compatibilidade com Claude Code: Suporte Completo para Commands, Skills, Agents, MCPs e Hooks

## O Que Você Vai Aprender

- Usar configurações e plugins existentes do Claude Code no OpenCode
- Entender as regras de prioridade de diferentes fontes de configuração
- Controlar o carregamento de recursos de compatibilidade do Claude Code através de opções de configuração
- Migrar suavemente do Claude Code para o OpenCode

## Seu Desafio Atual

Se você está migrando do Claude Code para o OpenCode, provavelmente já configurou muitos Commands personalizados, Skills e servidores MCP no diretório `~/.claude/`. Reconfigurar tudo isso é trabalhoso, e você gostaria de reutilizar essas configurações diretamente no OpenCode.

O Oh My OpenCode oferece uma camada de compatibilidade completa com o Claude Code, permitindo usar suas configurações e plugins existentes sem nenhuma modificação.

## Conceito Principal

O Oh My OpenCode é compatível com o formato de configuração do Claude Code através de um **mecanismo de carregamento automático**. O sistema escaneia automaticamente os diretórios de configuração padrão do Claude Code na inicialização, converte esses recursos para um formato reconhecível pelo OpenCode e os registra no sistema.

A compatibilidade abrange os seguintes recursos:

| Recurso | Status de Compatibilidade | Descrição |
| --- | --- | --- |
| **Commands** | ✅ Suporte completo | Carrega comandos slash de `~/.claude/commands/` e `.claude/commands/` |
| **Skills** | ✅ Suporte completo | Carrega habilidades especializadas de `~/.claude/skills/` e `.claude/skills/` |
| **Agents** | ⚠️ Reservado | Interface reservada, atualmente suporta apenas Agents integrados |
| **MCPs** | ✅ Suporte completo | Carrega configurações de servidor MCP de `.mcp.json` e `~/.claude/.mcp.json` |
| **Hooks** | ✅ Suporte completo | Carrega hooks de ciclo de vida personalizados de `settings.json` |
| **Plugins** | ✅ Suporte completo | Carrega plugins do Marketplace de `installed_plugins.json` |

---

## Prioridade de Carregamento de Configurações

O Oh My OpenCode suporta o carregamento de configurações de múltiplas localizações, mesclando-as em uma ordem de prioridade fixa. **Configurações de maior prioridade sobrescrevem as de menor prioridade**.

### Prioridade de Carregamento de Commands

Os Commands são carregados na seguinte ordem (da maior para a menor prioridade):

1. `.opencode/command/` (nível de projeto, maior prioridade)
2. `~/.config/opencode/command/` (nível de usuário)
3. `.claude/commands/` (compatibilidade Claude Code nível de projeto)
4. `~/.claude/commands/` (compatibilidade Claude Code nível de usuário)

**Localização no código-fonte**: `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// Carrega Commands de 4 diretórios, mesclando por prioridade
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**Exemplo**: Se existir um comando com o mesmo nome em `.opencode/command/refactor.md` e `~/.claude/commands/refactor.md`, o comando em `.opencode/` terá precedência.

### Prioridade de Carregamento de Skills

As Skills são carregadas na seguinte ordem (da maior para a menor prioridade):

1. `.opencode/skills/*/SKILL.md` (nível de projeto, maior prioridade)
2. `~/.config/opencode/skills/*/SKILL.md` (nível de usuário)
3. `.claude/skills/*/SKILL.md` (compatibilidade Claude Code nível de projeto)
4. `~/.claude/skills/*/SKILL.md` (compatibilidade Claude Code nível de usuário)

**Localização no código-fonte**: `src/features/opencode-skill-loader/loader.ts:206-215`

**Exemplo**: Skills de nível de projeto sobrescrevem Skills de nível de usuário, garantindo que as necessidades específicas de cada projeto tenham prioridade.

### Prioridade de Carregamento de MCPs

As configurações MCP são carregadas na seguinte ordem (da maior para a menor prioridade):

1. `.claude/.mcp.json` (nível de projeto, maior prioridade)
2. `.mcp.json` (nível de projeto)
3. `~/.claude/.mcp.json` (nível de usuário)

**Localização no código-fonte**: `src/features/claude-code-mcp-loader/loader.ts:18-27`

**Característica**: As configurações MCP suportam expansão de variáveis de ambiente (como `${OPENAI_API_KEY}`), resolvidas automaticamente através de `env-expander.ts`.

**Localização no código-fonte**: `src/features/claude-code-mcp-loader/env-expander.ts`

### Prioridade de Carregamento de Hooks

Os Hooks são carregados do campo `hooks` em `settings.json`, suportando os seguintes caminhos (por prioridade):

1. `.claude/settings.local.json` (configuração local, maior prioridade)
2. `.claude/settings.json` (nível de projeto)
3. `~/.claude/settings.json` (nível de usuário)

**Localização no código-fonte**: `src/hooks/claude-code-hooks/config.ts:46-59`

**Característica**: Os Hooks de múltiplos arquivos de configuração são mesclados automaticamente, em vez de se sobrescreverem.

---

## Opções de Desativação de Configuração

Se você não quiser carregar certas configurações do Claude Code, pode controlá-las de forma granular através do campo `claude_code` em `oh-my-opencode.json`.

### Desativar Completamente a Compatibilidade

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### Desativação Parcial

Você também pode desativar apenas recursos específicos:

```jsonc
{
  "claude_code": {
    "mcp": false,         // Desativa arquivos .mcp.json (mas mantém MCPs integrados)
    "commands": false,     // Desativa ~/.claude/commands/ e .claude/commands/
    "skills": false,       // Desativa ~/.claude/skills/ e .claude/skills/
    "agents": false,       // Desativa ~/.claude/agents/ (mantém Agents integrados)
    "hooks": false,        // Desativa hooks do settings.json
    "plugins": false       // Desativa plugins do Marketplace do Claude Code
  }
}
```

**Descrição das opções**:

| Opção | O Que é Desativado | O Que é Mantido |
| --- | --- | --- |
| `mcp` | Arquivos `.mcp.json` | MCPs integrados (websearch, context7, grep_app) |
| `commands` | `~/.claude/commands/`, `.claude/commands/` | Commands nativos do OpenCode |
| `skills` | `~/.claude/skills/`, `.claude/skills/` | Skills nativas do OpenCode |
| `agents` | `~/.claude/agents/` | Agents integrados (Sisyphus, Oracle, Librarian, etc.) |
| `hooks` | Hooks do `settings.json` | Hooks integrados do Oh My OpenCode |
| `plugins` | Plugins do Marketplace do Claude Code | Funcionalidades de plugins integrados |

### Desativar Plugins Específicos

Use `plugins_override` para desativar plugins específicos do Marketplace do Claude Code:

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Desativa o plugin claude-mem
    }
  }
}
```

**Localização no código-fonte**: `src/config/schema.ts:143`

---

## Compatibilidade de Armazenamento de Dados

O Oh My OpenCode é compatível com o formato de armazenamento de dados do Claude Code, garantindo a persistência e migração de dados de sessão e tarefas.

### Armazenamento de Todos

- **Localização**: `~/.claude/todos/`
- **Formato**: Formato JSON compatível com Claude Code
- **Uso**: Armazena listas de tarefas e itens pendentes

**Localização no código-fonte**: `src/features/claude-code-session-state/index.ts`

### Armazenamento de Transcrições

- **Localização**: `~/.claude/transcripts/`
- **Formato**: JSONL (um objeto JSON por linha)
- **Uso**: Armazena histórico de sessões e registros de mensagens

**Localização no código-fonte**: `src/features/claude-code-session-state/index.ts`

**Vantagem**: Compartilha o mesmo diretório de dados com o Claude Code, permitindo migração direta do histórico de sessões.

---

## Integração de Hooks do Claude Code

O campo `hooks` no `settings.json` do Claude Code define scripts personalizados executados em pontos específicos de eventos. O Oh My OpenCode suporta completamente esses Hooks.

### Tipos de Eventos de Hook

| Evento | Momento de Disparo | Operações Possíveis |
| --- | --- | --- |
| **PreToolUse** | Antes da execução da ferramenta | Bloquear chamada de ferramenta, modificar parâmetros de entrada, injetar contexto |
| **PostToolUse** | Após a execução da ferramenta | Adicionar avisos, modificar saída, injetar mensagens |
| **UserPromptSubmit** | Quando o usuário envia um prompt | Bloquear prompt, injetar mensagens, transformar prompt |
| **Stop** | Quando a sessão fica ociosa | Injetar prompts de acompanhamento, executar tarefas automatizadas |

**Localização no código-fonte**: `src/hooks/claude-code-hooks/index.ts`

### Exemplo de Configuração de Hook

Aqui está uma configuração típica de Hooks do Claude Code:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**Descrição dos campos**:

- **matcher**: Padrão de correspondência de nome de ferramenta (suporta curinga `*`)
- **type**: Tipo de Hook (`command`, `inject`, etc.)
- **command**: Comando shell a ser executado (suporta variáveis como `$FILE`)
- **content**: Conteúdo da mensagem a ser injetada

### Mecanismo de Execução de Hooks

O Oh My OpenCode executa automaticamente esses Hooks personalizados através do Hook `claude-code-hooks`. Este Hook verifica e carrega a configuração do Claude Code em todos os pontos de evento.

**Localização no código-fonte**: `src/hooks/claude-code-hooks/index.ts:36-401`

**Fluxo de execução**:

1. Carrega o `settings.json` do Claude Code
2. Analisa o campo `hooks` e corresponde ao evento atual
3. Executa os Hooks correspondentes em sequência
4. Modifica o comportamento do agente com base no resultado retornado (bloquear, injetar, avisar, etc.)

**Exemplo**: Se um Hook PreToolUse retornar `deny`, a chamada da ferramenta será bloqueada e o agente receberá uma mensagem de erro.

---

## Cenários de Uso Comuns

### Cenário 1: Migrar Configurações do Claude Code

Se você já configurou Commands e Skills no Claude Code, pode usá-los diretamente no OpenCode:

**Passos**:

1. Certifique-se de que o diretório `~/.claude/` existe e contém suas configurações
2. Inicie o OpenCode, o Oh My OpenCode carregará automaticamente essas configurações
3. Digite `/` no chat para ver os Commands carregados
4. Use Commands ou invoque Skills

**Verificação**: Verifique a quantidade de configurações carregadas nos logs de inicialização do Oh My OpenCode.

### Cenário 2: Sobrescrita de Configuração em Nível de Projeto

Você quer usar Skills diferentes para um projeto específico, sem afetar outros projetos:

**Passos**:

1. Crie o diretório `.claude/skills/` na raiz do projeto
2. Adicione a Skill específica do projeto (ex: `./.claude/skills/my-skill/SKILL.md`)
3. Reinicie o OpenCode
4. A Skill de nível de projeto sobrescreverá automaticamente a Skill de nível de usuário

**Vantagem**: Cada projeto pode ter configurações independentes, sem interferência mútua.

### Cenário 3: Desativar Compatibilidade com Claude Code

Você quer usar apenas configurações nativas do OpenCode, sem carregar configurações antigas do Claude Code:

**Passos**:

1. Edite `oh-my-opencode.json`
2. Adicione a seguinte configuração:

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. Reinicie o OpenCode

**Resultado**: O sistema ignorará todas as configurações do Claude Code, usando apenas configurações nativas do OpenCode.

---

## Armadilhas Comuns

### ⚠️ Conflitos de Configuração

**Problema**: Se houver configurações com o mesmo nome em múltiplas localizações (como o mesmo nome de Command aparecendo em `.opencode/command/` e `~/.claude/commands/`), pode causar comportamento imprevisível.

**Solução**: Entenda a prioridade de carregamento e coloque a configuração de maior prioridade no diretório de maior prioridade.

### ⚠️ Diferenças no Formato de Configuração MCP

**Problema**: O formato de configuração MCP do Claude Code é ligeiramente diferente do OpenCode, copiar diretamente pode não funcionar.

**Solução**: O Oh My OpenCode converte automaticamente o formato, mas é recomendável consultar a documentação oficial para garantir que a configuração esteja correta.

**Localização no código-fonte**: `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Impacto de Hooks no Desempenho

**Problema**: Muitos Hooks ou scripts de Hook complexos podem causar degradação de desempenho.

**Solução**: Limite o número de Hooks, mantendo apenas os necessários. Você pode desativar Hooks específicos através de `disabled_hooks`.

---

## Resumo da Lição

O Oh My OpenCode oferece uma camada de compatibilidade completa com o Claude Code, permitindo migrar e reutilizar configurações existentes sem problemas:

- **Prioridade de carregamento de configurações**: Carrega configurações na ordem nível de projeto > nível de usuário > compatibilidade Claude Code
- **Opções de compatibilidade**: Controle precisamente quais recursos carregar através do campo `claude_code`
- **Compatibilidade de armazenamento de dados**: Compartilha o diretório `~/.claude/`, suportando migração de dados de sessão e tarefas
- **Integração de Hooks**: Suporte completo ao sistema de hooks de ciclo de vida do Claude Code

Se você está migrando do Claude Code, esta camada de compatibilidade permite começar a usar o OpenCode sem nenhuma configuração adicional.

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Referência de Configuração](../configuration-reference/)**.
>
> Você aprenderá:
> - Descrição completa dos campos de configuração do `oh-my-opencode.json`
> - Tipo, valor padrão e restrições de cada campo
> - Padrões de configuração comuns e melhores práticas

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver as localizações no código-fonte</strong></summary>

> Data de atualização: 2026-01-26

| Recurso | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Entrada principal dos Hooks do Claude Code | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Carregamento de configuração de Hooks | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| Carregador de configuração MCP | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Carregador de Commands | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Carregador de Skills | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Carregador de Plugins | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | Completo |
| Compatibilidade de armazenamento de dados | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | Completo |
| Transformador de configuração MCP | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | Completo |
| Expansão de variáveis de ambiente | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | Completo |

**Funções principais**:

- `createClaudeCodeHooksHook()`: Cria o Hook de integração de Hooks do Claude Code, processando todos os eventos (PreToolUse, PostToolUse, UserPromptSubmit, Stop)
- `loadClaudeHooksConfig()`: Carrega a configuração `settings.json` do Claude Code
- `loadMcpConfigs()`: Carrega configurações de servidor MCP, suportando expansão de variáveis de ambiente
- `loadAllCommands()`: Carrega Commands de 4 diretórios, mesclando por prioridade
- `discoverSkills()`: Carrega Skills de 4 diretórios, suportando caminhos de compatibilidade do Claude Code
- `getClaudeConfigDir()`: Obtém o caminho do diretório de configuração do Claude Code (dependente da plataforma)

**Constantes principais**:

- Prioridade de carregamento de configuração: `.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Tipos de eventos de Hook: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `PreCompact`

</details>
