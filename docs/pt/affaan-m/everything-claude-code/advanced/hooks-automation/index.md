---
title: "Automação com Hooks: Análise de 15+ Hooks | Everything Claude Code"
sidebarTitle: "Deixe o Claude Trabalhar Automaticamente"
subtitle: "Automação com Hooks: Análise Profunda de 15+ Hooks"
description: "Aprenda o mecanismo de automação com 15+ hooks do Everything Claude Code. Tutorial explica 6 tipos de Hook, 14 funcionalidades principais e implementação com scripts Node.js."
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# Automação com Hooks: Análise Profunda de 15+ Hooks

## O Que Você Vai Aprender

- Entender os 6 tipos de Hook do Claude Code e seus mecanismos de acionamento
- Dominar as funcionalidades e métodos de configuração dos 14 Hooks integrados
- Aprender a personalizar Hooks usando scripts Node.js
- Salvar e carregar contexto automaticamente no início/fim de sessões
- Implementar funcionalidades de automação como sugestão inteligente de compactação e formatação automática de código

## Seu Desafio Atual

Você deseja que o Claude Code execute automaticamente algumas operações em eventos específicos, como:
- Carregar automaticamente o contexto anterior ao iniciar uma sessão
- Formatar automaticamente após cada edição de código
- Lembrá-lo de verificar alterações antes de fazer push
- Sugerir compactação de contexto em momentos apropriados

Mas essas funcionalidades precisam ser acionadas manualmente, ou você precisa entender profundamente o sistema de Hooks do Claude Code para implementá-las. Esta lição ajudará você a dominar essas capacidades de automação.

## Quando Usar Esta Técnica

- Precisa manter contexto e estado de trabalho entre sessões
- Deseja executar automaticamente verificações de qualidade de código (formatação, verificação TypeScript)
- Quer receber lembretes antes de operações específicas (como verificar alterações antes de git push)
- Precisa otimizar o uso de Tokens, compactando contexto em momentos apropriados
- Deseja extrair automaticamente padrões reutilizáveis das sessões

## Conceito Principal

**O Que São Hooks**

**Hooks** são mecanismos de automação fornecidos pelo Claude Code que podem acionar scripts personalizados quando eventos específicos ocorrem. Funcionam como "ouvintes de eventos", executando automaticamente operações predefinidas quando as condições são atendidas.

::: info Como os Hooks Funcionam

```
Ação do Usuário → Aciona Evento → Hook Verifica → Executa Script → Retorna Resultado
     ↓              ↓                ↓              ↓              ↓
  Usa Ferramenta  PreToolUse    Condição Match   Script Node.js  Saída no Console
```

Por exemplo, quando você usa a ferramenta Bash para executar `npm run dev`:
1. PreToolUse Hook detecta o padrão do comando
2. Se não estiver no tmux, bloqueia automaticamente e exibe aviso
3. Você vê o aviso e usa a forma correta para iniciar

:::

**6 Tipos de Hook**

Everything Claude Code usa 6 tipos de Hook:

| Tipo de Hook | Momento de Acionamento | Cenário de Uso |
| --- | --- | --- |
| **PreToolUse** | Antes de qualquer ferramenta ser executada | Validar comandos, bloquear operações, exibir sugestões |
| **PostToolUse** | Após qualquer ferramenta ser executada | Formatação automática, verificação de tipos, registro de logs |
| **PreCompact** | Antes da compactação de contexto | Salvar estado, registrar evento de compactação |
| **SessionStart** | Ao iniciar nova sessão | Carregar contexto, detectar gerenciador de pacotes |
| **SessionEnd** | Ao finalizar sessão | Salvar estado, avaliar sessão, extrair padrões |
| **Stop** | Ao final de cada resposta | Verificar arquivos modificados, lembrar limpeza |

::: tip Ordem de Execução dos Hooks

Em um ciclo de vida completo de sessão, os Hooks são executados na seguinte ordem:

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

Onde `[PreToolUse → PostToolUse]` se repete a cada uso de ferramenta.

:::

**Regras de Correspondência dos Hooks**

Cada Hook usa expressões `matcher` para decidir se deve ser executado. O Claude Code usa expressões JavaScript que podem verificar:

- Tipo de ferramenta: `tool == "Bash"`, `tool == "Edit"`
- Conteúdo do comando: `tool_input.command matches "npm run dev"`
- Caminho do arquivo: `tool_input.file_path matches "\\.ts$"`
- Condições combinadas: `tool == "Bash" && tool_input.command matches "git push"`

**Por Que Usar Scripts Node.js**

Todos os Hooks do Everything Claude Code são implementados usando scripts Node.js, não scripts Shell. As razões são:

| Vantagem | Scripts Shell | Scripts Node.js |
| --- | --- | --- |
| **Multiplataforma** | ❌ Precisa de ramificações Windows/macOS/Linux | ✅ Automaticamente multiplataforma |
| **Processamento JSON** | ❌ Precisa de ferramentas extras (jq) | ✅ Suporte nativo |
| **Operações de Arquivo** | ⚠️ Comandos complexos | ✅ API fs concisa |
| **Tratamento de Erros** | ❌ Precisa implementação manual | ✅ try/catch com suporte nativo |

## Siga Comigo

### Passo 1: Visualizar Configuração Atual dos Hooks

**Por Quê**
Entender a configuração existente dos Hooks, saber quais funcionalidades de automação já estão habilitadas

```bash
## Visualizar configuração hooks.json
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**Você deve ver**: Arquivo de configuração JSON contendo definições dos 6 tipos de Hook

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### Passo 2: Entender PreToolUse Hooks

**Por Quê**
PreToolUse é o tipo de Hook mais usado, pode bloquear operações ou fornecer avisos

Vamos ver os 5 PreToolUse Hooks no Everything Claude Code:

#### 1. Tmux Dev Server Block

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Funcionalidade**: Bloqueia inicialização de dev server fora do tmux

**Por que é necessário**: Executar dev server no tmux permite separar a sessão, possibilitando continuar visualizando logs mesmo após fechar o Claude Code

#### 2. Git Push Reminder

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**Funcionalidade**: Lembra você de verificar alterações antes de `git push`

**Por que é necessário**: Evita commits acidentais de código não revisado

#### 3. Block Random MD Files

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Funcionalidade**: Bloqueia criação de arquivos .md não documentais

**Por que é necessário**: Evita dispersão de documentação, mantém o projeto organizado

#### 4. Suggest Compact

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Funcionalidade**: Ao editar ou escrever arquivos, sugere compactação de contexto

**Por que é necessário**: Compactar manualmente em momentos apropriados mantém o contexto conciso

### Passo 3: Entender PostToolUse Hooks

**Por Quê**
PostToolUse executa automaticamente após operações, adequado para verificações automáticas de qualidade

Everything Claude Code tem 4 PostToolUse Hooks:

#### 1. Auto Format

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Funcionalidade**: Após editar arquivos .js/.ts/.jsx/.tsx, executa automaticamente formatação com Prettier

**Por que é necessário**: Mantém estilo de código consistente

#### 2. TypeScript Check

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Funcionalidade**: Após editar arquivos .ts/.tsx, executa automaticamente verificação de tipos TypeScript

**Por que é necessário**: Detecta erros de tipo precocemente

#### 3. Console.log Warning

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**Funcionalidade**: Após editar arquivos, verifica se há declarações console.log

**Por que é necessário**: Evita commits de código de depuração

#### 4. Log PR URL

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Funcionalidade**: Após criar PR, exibe automaticamente URL do PR e comando de revisão

**Por que é necessário**: Facilita acesso rápido ao PR recém-criado

### Passo 4: Entender Hooks de Ciclo de Vida de Sessão

**Por Quê**
SessionStart e SessionEnd Hook são usados para persistência de contexto entre sessões

#### SessionStart Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**Funcionalidade**:
- Verifica arquivos de sessão dos últimos 7 dias
- Verifica skills aprendidas
- Detecta gerenciador de pacotes
- Exibe informações de contexto carregáveis

**Lógica do Script** (`session-start.js`):

```javascript
// Verifica arquivos de sessão dos últimos 7 dias
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// Verifica skills aprendidas
const learnedSkills = findFiles(learnedDir, '*.md');

// Detecta gerenciador de pacotes
const pm = getPackageManager();

// Se usar valor padrão, solicita seleção
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### SessionEnd Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**Funcionalidade**:
- Cria ou atualiza arquivo de sessão
- Registra horários de início e término da sessão
- Gera template de sessão (Completed, In Progress, Notes)

**Template de Arquivo de Sessão** (`session-end.js`):

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
[relevant files]
```

Os placeholders `[Session context goes here]` e `[relevant files]` no template precisam ser preenchidos manualmente com o conteúdo real da sessão e arquivos relevantes.

### Passo 5: Entender Hooks Relacionados à Compactação

**Por Quê**
PreCompact e Stop Hook são usados para gerenciamento de contexto e decisões de compactação

#### PreCompact Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**Funcionalidade**:
- Registra evento de compactação no log
- Marca o horário de compactação no arquivo de sessão ativa

**Lógica do Script** (`pre-compact.js`):

```javascript
// Registra evento de compactação
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// Marca no arquivo de sessão
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Stop Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**Funcionalidade**: Verifica se há console.log em todos os arquivos modificados

**Por que é necessário**: Como última linha de defesa, evita commits de código de depuração

### Passo 6: Entender Hook de Aprendizado Contínuo

**Por Quê**
Evaluate Session Hook é usado para extrair padrões reutilizáveis das sessões

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**Funcionalidade**:
- Lê registro da sessão (transcript)
- Conta número de mensagens do usuário
- Se a sessão for longa o suficiente (padrão > 10 mensagens), sugere avaliar padrões extraíveis

**Lógica do Script** (`evaluate-session.js`):

```javascript
// Lê configuração
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// Conta mensagens do usuário
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// Pula sessões curtas
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// Sugere avaliação
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### Passo 7: Personalizar Hook

**Por Quê**
Criar suas próprias regras de automação de acordo com as necessidades do projeto

**Exemplo: Bloquear comandos perigosos em ambiente de produção**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**Passos de Configuração**:

1. Criar script de Hook personalizado:
   ```bash
   # Criar scripts/hooks/custom-hook.js
   vi scripts/hooks/custom-hook.js
   ```

2. Editar `~/.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. Reiniciar Claude Code

**Você deve ver**: Informações de saída quando o Hook for acionado

## Pontos de Verificação ✅

Confirme que você entendeu os seguintes pontos:

- [ ] Hook é um mecanismo de automação orientado a eventos
- [ ] Claude Code tem 6 tipos de Hook
- [ ] PreToolUse é acionado antes da execução de ferramentas, pode bloquear operações
- [ ] PostToolUse é acionado após execução de ferramentas, adequado para verificações automáticas
- [ ] SessionStart/SessionEnd são usados para persistência de contexto entre sessões
- [ ] Everything Claude Code usa scripts Node.js para implementar compatibilidade multiplataforma
- [ ] Pode personalizar Hooks modificando `~/.claude/settings.json`

## Alertas de Erros Comuns

### ❌ Erros em Scripts de Hook Causam Travamento de Sessão

**Problema**: Script de Hook lança exceção e não sai corretamente, fazendo Claude Code aguardar timeout

**Causa**: Erros em scripts Node.js não são capturados corretamente

**Solução**:
```javascript
// Exemplo errado
main();  // Se lançar exceção, causará problemas

// Exemplo correto
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // Sai normalmente mesmo com erro
});
```

### ❌ Usar Scripts Shell Causa Problemas Multiplataforma

**Problema**: Ao executar no Windows, scripts Shell falham

**Causa**: Comandos Shell não são compatíveis entre diferentes sistemas operacionais

**Solução**: Usar scripts Node.js em vez de scripts Shell

| Funcionalidade | Scripts Shell | Scripts Node.js |
| --- | --- | --- |
| Leitura de arquivo | `cat file.txt` | `fs.readFileSync('file.txt')` |
| Verificação de diretório | `[ -d dir ]` | `fs.existsSync(dir)` |
| Variável de ambiente | `$VAR` | `process.env.VAR` |

### ❌ Saída Excessiva de Hook Causa Expansão de Contexto

**Problema**: Cada operação gera muitas informações de depuração, causando rápida expansão do contexto

**Causa**: Script de Hook usa muitos console.log

**Solução**:
- Exibir apenas informações necessárias
- Usar `console.error` para avisos importantes (será destacado pelo Claude Code)
- Usar saída condicional, imprimir apenas quando necessário

```javascript
// Exemplo errado
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // Saída excessiva

// Exemplo correto
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ PreToolUse Hook Bloqueia Operações Necessárias

**Problema**: Regras de correspondência do Hook são muito amplas, bloqueando erroneamente operações normais

**Causa**: Expressão matcher não corresponde precisamente ao cenário

**Solução**:
- Testar precisão da expressão matcher
- Adicionar mais condições para limitar escopo de acionamento
- Fornecer mensagens de erro claras e sugestões de solução

```json
// Exemplo errado: corresponde a todos os comandos npm
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// Exemplo correto: corresponde apenas ao comando dev
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## Resumo da Lição

**Resumo dos 6 Tipos de Hook**:

| Tipo de Hook | Momento de Acionamento | Uso Típico | Quantidade no Everything Claude Code |
| --- | --- | --- | --- |
| PreToolUse | Antes da execução de ferramenta | Validar, bloquear, avisar | 5 |
| PostToolUse | Após execução de ferramenta | Formatar, verificar, registrar | 4 |
| PreCompact | Antes da compactação de contexto | Salvar estado | 1 |
| SessionStart | Início de nova sessão | Carregar contexto, detectar PM | 1 |
| SessionEnd | Fim de sessão | Salvar estado, avaliar sessão | 2 |
| Stop | Fim de resposta | Verificar modificações | 1 |

**Pontos-Chave**:

1. **Hook é orientado a eventos**: Executa automaticamente em eventos específicos
2. **Matcher decide acionamento**: Usa expressões JavaScript para corresponder condições
3. **Implementação com scripts Node.js**: Compatibilidade multiplataforma, evita scripts Shell
4. **Tratamento de erros é importante**: Script deve sair normalmente mesmo com erro
5. **Saída deve ser concisa**: Evitar muitos logs causando expansão de contexto
6. **Configuração em settings.json**: Adicionar Hooks personalizados modificando `~/.claude/settings.json`

**Melhores Práticas**:

```
1. Usar PreToolUse para validar operações perigosas
2. Usar PostToolUse para verificações automáticas de qualidade
3. Usar SessionStart/End para persistir contexto
4. Testar expressão matcher antes de personalizar Hook
5. Usar try/catch e process.exit(0) em scripts
6. Exibir apenas informações necessárias, evitar expansão de contexto
```

## Prévia da Próxima Lição

> Na próxima lição vamos aprender **[Mecanismo de Aprendizado Contínuo](../continuous-learning/)**.
>
> Você vai aprender:
> - Como o Continuous Learning extrai automaticamente padrões reutilizáveis
> - Usar o comando `/learn` para extrair padrões manualmente
> - Configurar duração mínima de sessão para avaliação
> - Gerenciar diretório de learned skills

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Configuração principal de Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Script SessionStart | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| Script SessionEnd | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| Script PreCompact | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Script Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Script Evaluate Session | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Biblioteca de utilitários | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| Detecção de gerenciador de pacotes | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**Constantes-Chave**:
- Nenhuma (configuração carregada dinamicamente)

**Funções-Chave**:
- `getSessionsDir()`: Obtém caminho do diretório de sessões
- `getLearnedSkillsDir()`: Obtém caminho do diretório de learned skills
- `findFiles(dir, pattern, options)`: Busca arquivos, suporta filtro por tempo
- `ensureDir(path)`: Garante que diretório existe, cria se não existir
- `getPackageManager()`: Detecta gerenciador de pacotes (suporta 6 prioridades)
- `log(message)`: Exibe informações de log do Hook

**Configurações-Chave**:
- `min_session_length`: Número mínimo de mensagens para avaliação de sessão (padrão 10)
- `COMPACT_THRESHOLD`: Limiar de chamadas de ferramenta para sugerir compactação (padrão 50)
- `CLAUDE_PLUGIN_ROOT`: Variável de ambiente do diretório raiz do plugin

**14 Hooks Principais**:
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>
