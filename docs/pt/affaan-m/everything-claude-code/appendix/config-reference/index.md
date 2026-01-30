---
title: "Referência Completa do Arquivo de Configuração: settings.json | Everything Claude Code"
sidebarTitle: "Personalizar Todas as Configurações"
subtitle: "Referência Completa do Arquivo de Configuração settings.json"
description: "Aprenda as opções completas de configuração do Everything Claude Code. Domine automação de Hooks, servidores MCP e configuração de plugins, resolva conflitos de configuração rapidamente."
tags:
  - "config"
  - "settings"
  - "json"
  - "hooks"
  - "mcp"
prerequisite:
  - "/pt/affaan-m/everything-claude-code/start/installation/"
  - "/pt/affaan-m/everything-claude-code/start/mcp-setup/"
order: 190
---

# Referência Completa do Arquivo de Configuração: settings.json

## O Que Você Vai Aprender

- Compreender completamente todas as opções de configuração do `~/.claude/settings.json`
- Personalizar fluxos de trabalho de automação com Hooks
- Configurar e gerenciar servidores MCP
- Modificar manifesto de plugins e configuração de caminhos
- Resolver conflitos de configuração e falhas

## O Dilema Atual

Você já está usando o Everything Claude Code, mas encontra estes problemas:
- "Por que um determinado Hook não está sendo acionado?"
- "Falha na conexão do servidor MCP, onde está o erro na configuração?"
- "Quero personalizar uma funcionalidade, qual arquivo de configuração devo modificar?"
- "Múltiplos arquivos de configuração se sobrepõem, qual é a prioridade?"

Este tutorial fornecerá um manual de referência completo de configuração.

## Conceito Central

O sistema de configuração do Claude Code é dividido em três níveis, com prioridade do mais alto para o mais baixo:

1. **Configuração em Nível de Projeto** (`.claude/settings.json`) - Efetivo apenas no projeto atual
2. **Configuração Global** (`~/.claude/settings.json`) - Efetivo em todos os projetos
3. **Configuração Integrada do Plugin** (Configuração padrão do Everything Claude Code)

::: tip Prioridade de Configuração
As configurações são **mescladas** em vez de sobrescritas. A configuração em nível de projeto sobrescreve opções com o mesmo nome na configuração global, mas mantém outras opções.
:::

O arquivo de configuração usa formato JSON, seguindo o Claude Code Settings Schema:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

Este schema fornece autocompletar e validação, recomenda-se sempre incluí-lo.

## Estrutura do Arquivo de Configuração

### Template de Configuração Completo

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",

  "mcpServers": {},

  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "SessionStart": [],
    "SessionEnd": [],
    "PreCompact": [],
    "Stop": []
  },

  "disabledMcpServers": [],

  "environmentVariables": {}
}
```

::: warning Regras de Sintaxe JSON
- Todos os nomes de chaves e valores de string devem ser envolvidos em **aspas duplas**
- Não adicione vírgula após o último par chave-valor
- Comentários não são sintaxe JSON padrão, use o campo `"_comments"` como alternativa
:::

## Configuração Detalhada de Hooks

Hooks são o mecanismo central de automação do Everything Claude Code, definindo scripts automatizados acionados em eventos específicos.

### Tipos de Hook e Momentos de Acionamento

| Tipo de Hook | Momento de Acionamento | Propósito |
| --- | --- | --- |
| `SessionStart` | Quando a sessão do Claude Code inicia | Carregar contexto, detectar gerenciador de pacotes |
| `SessionEnd` | Quando a sessão do Claude Code termina | Salvar estado da sessão, avaliar padrões de extração |
| `PreToolUse` | Antes da chamada de ferramenta | Validar comandos, bloquear operações perigosas |
| `PostToolUse` | Após a chamada de ferramenta | Formatar código, verificação de tipos |
| `PreCompact` | Antes da compactação de contexto | Salvar snapshot de estado |
| `Stop` | Ao final de cada resposta da IA | Verificar problemas como console.log |

### Estrutura de Configuração de Hook

Cada entrada de Hook contém os seguintes campos:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Hook triggered')\""
    }
  ],
  "description": "Descrição do Hook (opcional)"
}
```

#### Campo matcher

Define condições de acionamento, suporta as seguintes variáveis:

| Variável | Significado | Valor de Exemplo |
| --- | --- | --- |
| `tool` | Nome da ferramenta | `"Bash"`, `"Write"`, `"Edit"` |
| `tool_input.command` | Conteúdo do comando Bash | `"npm run dev"` |
| `tool_input.file_path` | Caminho do arquivo Write/Edit | `"/path/to/file.ts"` |

**Operadores de Correspondência**:

```javascript
// Igualdade
tool == "Bash"

// Correspondência regex
tool_input.command matches "npm run dev"
tool_input.file_path matches "\\\\.ts$"

// Operações lógicas
tool == "Edit" || tool == "Write"
tool == "Bash" && !(tool_input.command matches "git push")
```

#### Array hooks

Define ações a executar, suporta dois tipos:

**Tipo 1: command**

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
}
```

- `${CLAUDE_PLUGIN_ROOT}` variável do diretório raiz do plugin
- O comando é executado no diretório raiz do projeto
- Saída em formato JSON padrão é passada para o Claude Code

**Tipo 2: prompt** (não usado nesta configuração)

```json
{
  "type": "prompt",
  "prompt": "Review the code before committing"
}
```

### Exemplos Completos de Configuração de Hooks

O Everything Claude Code fornece mais de 15 Hooks pré-configurados, aqui está a explicação completa da configuração:

#### Hooks PreToolUse

**1. Tmux Dev Server Block**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
    }
  ],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Propósito**: Forçar a execução do servidor de desenvolvimento no tmux, garantindo que os logs sejam acessíveis.

**Comandos Correspondentes**:
- `npm run dev`
- `pnpm dev` / `pnpm run dev`
- `yarn dev`
- `bun run dev`

**2. Tmux Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"if(!process.env.TMUX){console.error('[Hook] Consider running in tmux for session persistence');console.error('[Hook] tmux new -s dev  |  tmux attach -t dev')}\""
    }
  ],
  "description": "Reminder to use tmux for long-running commands"
}
```

**Propósito**: Lembrar de usar tmux para executar comandos de longa duração.

**Comandos Correspondentes**:
- `npm install`, `npm test`
- `pnpm install`, `pnpm test`
- `cargo build`, `make`, `docker`
- `pytest`, `vitest`, `playwright`

**3. Git Push Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
    }
  ],
  "description": "Reminder before git push to review changes"
}
```

**Propósito**: Lembrar de revisar alterações antes de fazer push.

**4. Block Random MD Files**

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.(md|txt)$/.test(p)&&!/(README|CLAUDE|AGENTS|CONTRIBUTING)\\.md$/.test(p)){console.error('[Hook] BLOCKED: Unnecessary documentation file creation');console.error('[Hook] File: '+p);console.error('[Hook] Use README.md for documentation instead');process.exit(1)}console.log(d)})\""
    }
  ],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Propósito**: Bloquear a criação de arquivos .md aleatórios, mantendo a documentação consolidada.

**Arquivos Permitidos**:
- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`

**5. Suggest Compact**

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
    }
  ],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Propósito**: Sugerir compactação manual de contexto em intervalos lógicos.

#### Hook SessionStart

**Load Previous Context**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
    }
  ],
  "description": "Load previous context and detect package manager on new session"
}
```

**Propósito**: Carregar contexto da sessão anterior e detectar gerenciador de pacotes.

#### Hooks PostToolUse

**1. Log PR URL**

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';const m=out.match(/https:\\/\\/github.com\\/[^/]+\\/[^/]+\\/pull\\/\\d+/);if(m){console.error('[Hook] PR created: '+m[0]);const repo=m[0].replace(/https:\\/\\/github.com\\/([^/]+\\/[^/]+)\\/pull\\/\\d+/,'$1');const pr=m[0].replace(/.*\\/pull\\/(\\d+)/,'$1');console.error('[Hook] To review: gh pr review '+pr+' --repo '+repo)}}console.log(d)})\""
    }
  ],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Propósito**: Registrar URL do PR e fornecer comando de revisão após a criação do PR.

**2. Auto Format**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
    }
  ],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Propósito**: Formatar automaticamente arquivos JS/TS com Prettier.

**3. TypeScript Check**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');const path=require('path');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){let dir=path.dirname(p);while(dir!==path.dirname(dir)&&!fs.existsSync(path.join(dir,'tsconfig.json'))){dir=path.dirname(dir)}if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']});const lines=r.split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}catch(e){const lines=(e.stdout||'').split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}}}console.log(d)})\""
    }
  ],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Propósito**: Executar verificação de tipos após editar arquivos TypeScript.

**4. Console.log Warning**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');const matches=[];lines.forEach((l,idx)=>{if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())});if(matches.length){console.error('[Hook] WARNING: console.log found in '+p);matches.slice(0,5).forEach(m=>console.error(m));console.error('[Hook] Remove console.log before committing')}}console.log(d)})\""
    }
  ],
  "description": "Warn about console.log statements after edits"
}
```

**Propósito**: Detectar e avisar sobre declarações console.log no arquivo.

#### Hook Stop

**Check Console.log in Modified Files**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{execSync('git rev-parse --git-dir',{stdio:'pipe'})}catch{console.log(d);process.exit(0)}try{const files=execSync('git diff --name-only HEAD',{encoding:'utf8',stdio:['pipe','pipe','pipe']}).split('\\n').filter(f=>/\\.(ts|tsx|js|jsx)$/.test(f)&&fs.existsSync(f));let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}if(hasConsole)console.error('[Hook] Remove console.log statements before committing')}catch(e){}console.log(d)})\""
    }
  ],
  "description": "Check for console.log in modified files after each response"
}
```

**Propósito**: Verificar console.log em arquivos modificados.

#### Hook PreCompact

**Save State Before Compaction**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
    }
  ],
  "description": "Save state before context compaction"
}
```

**Propósito**: Salvar estado antes da compactação de contexto.

#### Hooks SessionEnd

**1. Persist Session State**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
    }
  ],
  "description": "Persist session state on end"
}
```

**Propósito**: Persistir estado da sessão.

**2. Evaluate Session**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
    }
  ],
  "description": "Evaluate session for extractable patterns"
}
```

**Propósito**: Avaliar sessão para extrair padrões reutilizáveis.

### Personalizar Hooks

Você pode personalizar Hooks das seguintes maneiras:

#### Método 1: Modificar settings.json

```bash
# Editar configuração global
vim ~/.claude/settings.json
```

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Your custom hook')\""
          }
        ],
        "description": "Your custom hook"
      }
    ]
  }
}
```

#### Método 2: Sobrescrever com Configuração em Nível de Projeto

Crie `.claude/settings.json` no diretório raiz do projeto:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_custom_command\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Project-specific hook')\""
          }
        ]
      }
    ]
  }
}
```

::: tip Vantagens da Configuração em Nível de Projeto
- Não afeta a configuração global
- Efetivo apenas no projeto específico
- Pode ser commitado no controle de versão
:::

## Configuração Detalhada de Servidores MCP

MCP (Model Context Protocol) servidores expandem as capacidades de integração com serviços externos do Claude Code.

### Estrutura de Configuração MCP

```json
{
  "mcpServers": {
    "server_name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "ENV_VAR": "your_value"
      },
      "description": "Server description"
    },
    "http_server": {
      "type": "http",
      "url": "https://example.com/mcp",
      "description": "HTTP server description"
    }
  }
}
```

### Tipos de Servidor MCP

#### Tipo 1: npx

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    },
    "description": "GitHub operations - PRs, issues, repos"
  }
}
```

**Descrição dos Campos**:
- `command`: Comando de execução, geralmente `npx`
- `args`: Array de argumentos, `-y` confirma instalação automaticamente
- `env`: Objeto de variáveis de ambiente
- `description`: Texto descritivo

#### Tipo 2: http

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Vercel deployments and projects"
  }
}
```

**Descrição dos Campos**:
- `type`: Deve ser `"http"`
- `url`: URL do servidor
- `description`: Texto descritivo

### Servidores MCP Pré-configurados do Everything Claude Code

A seguir está a lista de todos os servidores MCP pré-configurados:

| Nome do Servidor | Tipo | Descrição | Requer Configuração |
| --- | --- | --- | --- |
| `github` | npx | Operações GitHub (PR, Issues, Repos) | GitHub PAT |
| `firecrawl` | npx | Web scraping e crawling | Firecrawl API Key |
| `supabase` | npx | Operações de banco de dados Supabase | Project Ref |
| `memory` | npx | Memória persistente entre sessões | Não |
| `sequential-thinking` | npx | Raciocínio em cadeia | Não |
| `vercel` | http | Gerenciamento de deploys e projetos Vercel | Não |
| `railway` | npx | Deploys Railway | Não |
| `cloudflare-docs` | http | Busca de documentação Cloudflare | Não |
| `cloudflare-workers-builds` | http | Builds Cloudflare Workers | Não |
| `cloudflare-workers-bindings` | http | Bindings Cloudflare Workers | Não |
| `cloudflare-observability` | http | Logs e monitoramento Cloudflare | Não |
| `clickhouse` | http | Consultas analíticas ClickHouse | Não |
| `context7` | npx | Busca de documentação em tempo real | Não |
| `magic` | npx | Componentes Magic UI | Não |
| `filesystem` | npx | Operações de sistema de arquivos | Configuração de caminho |

### Adicionar Servidores MCP

#### Adicionar a Partir de Pré-configurados

1. Copie a configuração do servidor de `mcp-configs/mcp-servers.json`
2. Cole no seu `~/.claude/settings.json`

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

3. Substitua os placeholders `YOUR_*_HERE` pelos valores reais

#### Adicionar Servidor MCP Personalizado

```json
{
  "mcpServers": {
    "my_custom_server": {
      "command": "npx",
      "args": ["-y", "@your-org/your-server"],
      "env": {
        "API_KEY": "your_api_key"
      },
      "description": "Custom MCP server"
    }
  }
}
```

### Desabilitar Servidores MCP

Use o array `disabledMcpServers` para desabilitar servidores específicos:

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "firecrawl": { /* ... */ }
  },
  "disabledMcpServers": ["github", "firecrawl"]
}
```

::: warning Aviso sobre Janela de Contexto
Habilitar muitos servidores MCP ocupará grande parte da janela de contexto. Recomenda-se habilitar **< 10** servidores MCP.
:::

## Configuração Detalhada de Plugins

### Estrutura do plugin.json

`.claude-plugin/plugin.json` é o arquivo de manifesto do plugin, definindo metadados e caminhos de componentes.

```json
{
  "name": "everything-claude-code",
  "description": "Complete collection of battle-tested Claude Code configs",
  "author": {
    "name": "Affaan Mustafa",
    "url": "https://x.com/affaanmustafa"
  },
  "homepage": "https://github.com/affaan-m/everything-claude-code",
  "repository": "https://github.com/affaan-m/everything-claude-code",
  "license": "MIT",
  "keywords": [
    "claude-code",
    "agents",
    "skills",
    "hooks",
    "commands",
    "rules",
    "tdd",
    "code-review",
    "security",
    "workflow",
    "automation",
    "best-practices"
  ],
  "commands": "./commands",
  "skills": "./skills"
}
```

### Descrição dos Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `name` | string | S | Nome do plugin |
| `description` | string | S | Descrição do plugin |
| `author.name` | string | S | Nome do autor |
| `author.url` | string | N | URL da página do autor |
| `homepage` | string | N | Página inicial do plugin |
| `repository` | string | N | URL do repositório |
| `license` | string | N | Licença |
| `keywords` | string[] | N | Array de palavras-chave |
| `commands` | string | S | Caminho do diretório de comandos |
| `skills` | string | S | Caminho do diretório de skills |

### Modificar Caminhos do Plugin

Se você precisa personalizar caminhos de componentes, modifique `plugin.json`:

```json
{
  "name": "my-custom-claude-config",
  "commands": "./custom-commands",
  "skills": "./custom-skills"
}
```

## Outros Arquivos de Configuração

### package-manager.json

Configuração do gerenciador de pacotes, suporta nível de projeto e global:

```json
{
  "packageManager": "pnpm"
}
```

**Localização**:
- Global: `~/.claude/package-manager.json`
- Projeto: `.claude/package-manager.json`

### marketplace.json

Manifesto do marketplace de plugins, usado para o comando `/plugin marketplace add`:

```json
{
  "name": "everything-claude-code",
  "displayName": "Everything Claude Code",
  "description": "Complete collection of Claude Code configs",
  "url": "https://github.com/affaan-m/everything-claude-code"
}
```

### statusline.json

Exemplo de configuração da barra de status:

```json
{
  "items": [
    {
      "type": "text",
      "text": "Everything Claude Code"
    }
  ]
}
```

## Mesclagem e Prioridade de Arquivos de Configuração

### Estratégia de Mesclagem

Os arquivos de configuração são mesclados na seguinte ordem (posterior tem prioridade):

1. Configuração integrada do plugin
2. Configuração global (`~/.claude/settings.json`)
3. Configuração do projeto (`.claude/settings.json`)

**Exemplo**:

```json
// Configuração integrada do plugin
{
  "hooks": {
    "PreToolUse": [/* Hook A */]
  }
}

// Configuração global
{
  "hooks": {
    "PreToolUse": [/* Hook B */]
  }
}

// Configuração do projeto
{
  "hooks": {
    "PreToolUse": [/* Hook C */]
  }
}

// Resultado final da mesclagem (configuração do projeto tem prioridade)
{
  "hooks": {
    "PreToolUse": [/* Hook C */]  // Hook C sobrescreve A e B
  }
}
```

::: warning Observações
- **Arrays com o mesmo nome são completamente sobrescritos**, não são anexados
- Recomenda-se definir apenas as partes que precisam ser sobrescritas na configuração do projeto
- Use o comando `/debug config` para visualizar a configuração completa
:::

### Configuração de Variáveis de Ambiente

Defina variáveis de ambiente em `settings.json`:

```json
{
  "environmentVariables": {
    "CLAUDE_PACKAGE_MANAGER": "pnpm",
    "NODE_ENV": "development"
  }
}
```

::: tip Lembrete de Segurança
- Variáveis de ambiente são expostas no arquivo de configuração
- Não armazene informações sensíveis no arquivo de configuração
- Use variáveis de ambiente do sistema ou arquivos `.env` para gerenciar chaves
:::

## Solução de Problemas Comuns de Configuração

### Problema 1: Hook Não Dispara

**Possíveis Causas**:
1. Expressão matcher incorreta
2. Formato de configuração do Hook incorreto
3. Arquivo de configuração não salvo corretamente

**Passos de Diagnóstico**:

```bash
# Verificar sintaxe da configuração
cat ~/.claude/settings.json | python -m json.tool

# Verificar se o Hook foi carregado
# Execute no Claude Code
/debug config
```

**Correções Comuns**:

```json
// ❌ Erro: aspas simples
{
  "matcher": "tool == 'Bash'"
}

// ✅ Correto: aspas duplas
{
  "matcher": "tool == \"Bash\""
}
```

### Problema 2: Falha na Conexão do Servidor MCP

**Possíveis Causas**:
1. Variáveis de ambiente não configuradas
2. Problemas de rede
3. URL do servidor incorreta

**Passos de Diagnóstico**:

```bash
# Testar servidor MCP
npx @modelcontextprotocol/server-github --help

# Verificar variáveis de ambiente
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**Correções Comuns**:

```json
// ❌ Erro: nome da variável de ambiente incorreto
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxx"  // Deveria ser GITHUB_PERSONAL_ACCESS_TOKEN
  }
}

// ✅ Correto
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
  }
}
```

### Problema 3: Conflito de Configuração

**Sintoma**: Algumas opções de configuração não têm efeito

**Causa**: Configuração em nível de projeto sobrescreveu a configuração global

**Solução**:

```bash
# Visualizar configuração do projeto
cat .claude/settings.json

# Visualizar configuração global
cat ~/.claude/settings.json

# Excluir configuração do projeto (se não for necessária)
rm .claude/settings.json
```

### Problema 4: Erro de Formato JSON

**Sintoma**: Claude Code não consegue ler a configuração

**Ferramentas de Diagnóstico**:

```bash
# Usar jq para validar
cat ~/.claude/settings.json | jq '.'

# Usar Python para validar
cat ~/.claude/settings.json | python -m json.tool

# Usar ferramenta online
# https://jsonlint.com/
```

**Erros Comuns**:

```json
// ❌ Erro: vírgula no final
{
  "hooks": {
    "PreToolUse": []
  },
}

// ❌ Erro: aspas simples
{
  "description": 'Hooks configuration'
}

// ❌ Erro: comentário
{
  "hooks": {
    // This is a comment
  }
}

// ✅ Correto
{
  "hooks": {
    "PreToolUse": []
  }
}
```

## Resumo da Lição

Esta lição explicou sistematicamente o sistema completo de configuração do Everything Claude Code:

**Conceitos Centrais**:
- Configuração dividida em três níveis: projeto, global, plugin
- Prioridade de configuração: projeto > global > plugin
- Formato JSON estrito, atenção a aspas duplas e sintaxe

**Configuração de Hooks**:
- 6 tipos de Hook, mais de 15 Hooks pré-configurados
- Expressão matcher define condições de acionamento
- Suporta Hooks personalizados e sobrescrita em nível de projeto

**Servidores MCP**:
- Dois tipos: npx e http
- Mais de 15 servidores pré-configurados
- Suporta desabilitação e personalização

**Configuração de Plugins**:
- plugin.json define metadados do plugin
- Suporta caminhos de componentes personalizados
- marketplace.json usado para marketplace de plugins

**Outras Configurações**:
- package-manager.json: configuração do gerenciador de pacotes
- statusline.json: configuração da barra de status
- environmentVariables: definição de variáveis de ambiente

**Problemas Comuns**:
- Hook não dispara → Verificar matcher e formato JSON
- Falha na conexão MCP → Verificar variáveis de ambiente e rede
- Conflito de configuração → Visualizar configurações em nível de projeto e global
- Erro de formato JSON → Usar jq ou ferramentas online para validar

## Prévia da Próxima Lição

> Na próxima lição vamos aprender **[Referência Completa de Rules: Explicação Detalhada de 8 Conjuntos de Regras](../rules-reference/)**.
>
> Você vai aprender:
> - Regras de Security: Prevenir vazamento de dados sensíveis
> - Regras de Coding Style: Estilo de código e melhores práticas
> - Regras de Testing: Cobertura de testes e requisitos de TDD
> - Regras de Git Workflow: Padrões de commit e fluxo de PR
> - Como personalizar conjuntos de regras para atender às necessidades do projeto

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Configuração de Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Manifesto do plugin | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Configuração de servidores MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Manifesto do marketplace | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | - |

**Scripts de Hook Principais**:
- `session-start.js`: Carregar contexto ao iniciar sessão
- `session-end.js`: Salvar estado ao terminar sessão
- `suggest-compact.js`: Sugerir compactação manual de contexto
- `pre-compact.js`: Salvar estado antes da compactação
- `evaluate-session.js`: Avaliar sessão para extrair padrões

**Variáveis de Ambiente Principais**:
- `CLAUDE_PLUGIN_ROOT`: Diretório raiz do plugin
- `GITHUB_PERSONAL_ACCESS_TOKEN`: Autenticação da API GitHub
- `FIRECRAWL_API_KEY`: Autenticação da API Firecrawl

</details>
