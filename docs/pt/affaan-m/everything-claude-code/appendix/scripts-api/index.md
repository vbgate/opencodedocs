---
title: "Scripts API: Scripts Node.js | Everything Claude Code"
sidebarTitle: "Escrevendo seus Scripts de Hook"
subtitle: "Scripts API: Scripts Node.js"
description: "Aprenda a API de Scripts do Everything Claude Code. Domine detecção de plataforma, operações de arquivo, API de gerenciador de pacotes e uso de scripts de Hook."
tags:
  - "scripts-api"
  - "api"
  - "nodejs"
  - "utils"
  - "package-manager"
  - "hooks"
prerequisite:
  - "start-package-manager-setup"
order: 215
---

# Referência da Scripts API: Interface de Scripts Node.js

## O que você será capaz de fazer

- Compreender completamente a interface de API de scripts do Everything Claude Code
- Usar detecção de plataforma e funções utilitárias multiplataforma
- Configurar e usar o mecanismo de detecção automática de gerenciador de pacotes
- Escrever scripts de Hook personalizados para estender capacidades de automação
- Depurar e modificar implementações de scripts existentes

## Seu desafio atual

Você já sabe que o Everything Claude Code tem muitos scripts de automação, mas enfrenta estes problemas:

- "Quais APIs exatamente esses scripts Node.js fornecem?"
- "Como personalizar scripts de Hook?"
- "Qual é a prioridade de detecção do gerenciador de pacotes?"
- "Como implementar compatibilidade multiplataforma nos scripts?"

Este tutorial fornecerá um manual de referência completo da Scripts API.

## Conceito central

O sistema de scripts do Everything Claude Code divide-se em duas categorias:

1. **Biblioteca de utilitários compartilhados** (`scripts/lib/`) - Fornece funções e APIs multiplataforma
2. **Scripts de Hook** (`scripts/hooks/`) - Lógica de automação acionada em eventos específicos

Todos os scripts suportam **Windows, macOS e Linux**, implementados usando módulos nativos do Node.js.

### Estrutura de scripts

```
scripts/
├── lib/
│   ├── utils.js              # Funções utilitárias gerais
│   └── package-manager.js    # Detecção de gerenciador de pacotes
├── hooks/
│   ├── session-start.js       # Hook SessionStart
│   ├── session-end.js         # Hook SessionEnd
│   ├── pre-compact.js        # Hook PreCompact
│   ├── suggest-compact.js     # Hook PreToolUse
│   └── evaluate-session.js   # Hook Stop
└── setup-package-manager.js   # Script de configuração do gerenciador de pacotes
```

## lib/utils.js - Funções utilitárias gerais

Este módulo fornece funções utilitárias multiplataforma, incluindo detecção de plataforma, operações de arquivo, comandos do sistema, etc.

### Detecção de plataforma

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| Função | Tipo | Retorno | Descrição |
| --- | --- | --- | --- |
| `isWindows` | boolean | `true/false` | Se a plataforma atual é Windows |
| `isMacOS` | boolean | `true/false` | Se a plataforma atual é macOS |
| `isLinux` | boolean | `true/false` | Se a plataforma atual é Linux |

**Princípio de implementação**: Baseado em `process.platform`

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### Utilitários de diretório

```javascript
const {
  getHomeDir,
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  getTempDir,
  ensureDir
} = require('./lib/utils');
```

#### getHomeDir()

Obtém o diretório home do usuário (compatível multiplataforma)

**Retorno**: `string` - Caminho do diretório home do usuário

**Exemplo**:
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

Obtém o diretório de configuração do Claude Code

**Retorno**: `string` - Caminho do diretório `~/.claude`

**Exemplo**:
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

Obtém o diretório de arquivos de sessão

**Retorno**: `string` - Caminho do diretório `~/.claude/sessions`

**Exemplo**:
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

Obtém o diretório de habilidades aprendidas

**Retorno**: `string` - Caminho do diretório `~/.claude/skills/learned`

**Exemplo**:
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

Obtém o diretório temporário do sistema (multiplataforma)

**Retorno**: `string` - Caminho do diretório temporário

**Exemplo**:
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

Garante que o diretório existe, criando-o se não existir

**Parâmetros**:
- `dirPath` (string) - Caminho do diretório

**Retorno**: `string` - Caminho do diretório

**Exemplo**:
```javascript
const dir = ensureDir('/path/to/new/dir');
// Se o diretório não existir, será criado recursivamente
```

### Utilitários de data e hora

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

Obtém a data atual (formato: YYYY-MM-DD)

**Retorno**: `string` - String de data

**Exemplo**:
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

Obtém a hora atual (formato: HH:MM)

**Retorno**: `string` - String de hora

**Exemplo**:
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

Obtém a data e hora atuais (formato: YYYY-MM-DD HH:MM:SS)

**Retorno**: `string` - String de data e hora

**Exemplo**:
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### Operações de arquivo

```javascript
const {
  findFiles,
  readFile,
  writeFile,
  appendFile,
  replaceInFile,
  countInFile,
  grepFile
} = require('./lib/utils');
```

#### findFiles(dir, pattern, options)

Encontra arquivos que correspondem a um padrão em um diretório (alternativa multiplataforma ao `find`)

**Parâmetros**:
- `dir` (string) - Diretório a pesquisar
- `pattern` (string) - Padrão de arquivo (ex: `"*.tmp"`, `"*.md"`)
- `options` (object, opcional) - Opções
  - `maxAge` (number) - Idade máxima do arquivo em dias
  - `recursive` (boolean) - Se deve pesquisar recursivamente

**Retorno**: `Array<{path: string, mtime: number}>` - Lista de arquivos correspondentes, ordenados por data de modificação decrescente

**Exemplo**:
```javascript
// Encontrar arquivos .tmp dos últimos 7 dias
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// Encontrar recursivamente todos os arquivos .md
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip Compatibilidade multiplataforma
Esta função fornece busca de arquivos multiplataforma, não depende do comando Unix `find`, portanto funciona normalmente no Windows.
:::

#### readFile(filePath)

Lê arquivo de texto com segurança

**Parâmetros**:
- `filePath` (string) - Caminho do arquivo

**Retorno**: `string | null` - Conteúdo do arquivo, retorna `null` se a leitura falhar

**Exemplo**:
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

Escreve arquivo de texto

**Parâmetros**:
- `filePath` (string) - Caminho do arquivo
- `content` (string) - Conteúdo do arquivo

**Retorno**: Nenhum

**Exemplo**:
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// Se o diretório não existir, será criado automaticamente
```

#### appendFile(filePath, content)

Adiciona conteúdo a um arquivo de texto

**Parâmetros**:
- `filePath` (string) - Caminho do arquivo
- `content` (string) - Conteúdo a adicionar

**Retorno**: Nenhum

**Exemplo**:
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

Substitui texto em um arquivo (alternativa multiplataforma ao `sed`)

**Parâmetros**:
- `filePath` (string) - Caminho do arquivo
- `search` (string | RegExp) - Conteúdo a encontrar
- `replace` (string) - Conteúdo de substituição

**Retorno**: `boolean` - Se a substituição foi bem-sucedida

**Exemplo**:
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: substituição bem-sucedida
// false: arquivo não existe ou falha na leitura
```

#### countInFile(filePath, pattern)

Conta ocorrências de um padrão em um arquivo

**Parâmetros**:
- `filePath` (string) - Caminho do arquivo
- `pattern` (string | RegExp) - Padrão a contar

**Retorno**: `number` - Número de correspondências

**Exemplo**:
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

Pesquisa um padrão em um arquivo e retorna linhas correspondentes com números de linha

**Parâmetros**:
- `filePath` (string) - Caminho do arquivo
- `pattern` (string | RegExp) - Padrão a pesquisar

**Retorno**: `Array<{lineNumber: number, content: string}>` - Lista de linhas correspondentes

**Exemplo**:
```javascript
const matches = grepFile('/path/to/file.txt', /function\s+\w+/);
// [{ lineNumber: 10, content: 'function test() {...}' }]
```

### Hook I/O

```javascript
const {
  readStdinJson,
  log,
  output
} = require('./lib/utils');
```

#### readStdinJson()

Lê dados JSON da entrada padrão (para entrada de Hook)

**Retorno**: `Promise<object>` - Objeto JSON analisado

**Exemplo**:
```javascript
async function main() {
  const hookInput = await readStdinJson();
  console.log(hookInput.tool);
  console.log(hookInput.tool_input);
}
```

::: tip Formato de entrada do Hook
O formato de entrada que o Claude Code passa para os Hooks é:
```json
{
  "tool": "Bash",
  "tool_input": { "command": "npm run dev" },
  "tool_output": { "output": "..." }
}
```
:::

#### log(message)

Registra log no stderr (visível para o usuário)

**Parâmetros**:
- `message` (string) - Mensagem de log

**Retorno**: Nenhum

**Exemplo**:
```javascript
log('[SessionStart] Loading context...');
// Saída para stderr, visível para o usuário no Claude Code
```

#### output(data)

Envia dados para stdout (retorna para o Claude Code)

**Parâmetros**:
- `data` (object | string) - Dados a enviar

**Retorno**: Nenhum

**Exemplo**:
```javascript
// Enviar objeto (serialização JSON automática)
output({ success: true, message: 'Completed' });

// Enviar string
output('Hello, Claude');
```

### Comandos do sistema

```javascript
const {
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
} = require('./lib/utils');
```

#### commandExists(cmd)

Verifica se um comando existe no PATH

**Parâmetros**:
- `cmd` (string) - Nome do comando

**Retorno**: `boolean` - Se o comando existe

**Exemplo**:
```javascript
if (commandExists('pnpm')) {
  console.log('pnpm is available');
}
```

::: warning Validação de segurança
Esta função valida o nome do comando com regex, permitindo apenas letras, números, sublinhados, pontos e hífens, prevenindo injeção de comandos.
:::

#### runCommand(cmd, options)

Executa um comando e retorna a saída

**Parâmetros**:
- `cmd` (string) - Comando a executar (deve ser um comando confiável e hardcoded)
- `options` (object, opcional) - Opções do `execSync`

**Retorno**: `{success: boolean, output: string}` - Resultado da execução

**Exemplo**:
```javascript
const result = runCommand('git status');
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.output);
}
```

::: danger Aviso de segurança
**Use esta função apenas para comandos confiáveis e hardcoded**. Não passe entrada controlada pelo usuário diretamente para esta função. Para entrada do usuário, use `spawnSync` com array de argumentos.
:::

#### isGitRepo()

Verifica se o diretório atual é um repositório Git

**Retorno**: `boolean` - Se é um repositório Git

**Exemplo**:
```javascript
if (isGitRepo()) {
  console.log('This is a Git repository');
}
```

#### getGitModifiedFiles(patterns = [])

Obtém lista de arquivos modificados no Git

**Parâmetros**:
- `patterns` (string[], opcional) - Array de padrões de filtro

**Retorno**: `string[]` - Lista de caminhos de arquivos modificados

**Exemplo**:
```javascript
// Obter todos os arquivos modificados
const allModified = getGitModifiedFiles();

// Obter apenas arquivos TypeScript
const tsModified = getGitModifiedFiles([/\.ts$/, /\.tsx$/]);
```

## lib/package-manager.js - API do Gerenciador de Pacotes

Este módulo fornece APIs de detecção automática e configuração de gerenciadores de pacotes.

### Gerenciadores de pacotes suportados

```javascript
const { PACKAGE_MANAGERS } = require('./lib/package-manager');
```

| Gerenciador | Arquivo lock | Comando install | Comando run | Comando exec |
| --- | --- | --- | --- | --- |
| `npm` | package-lock.json | `npm install` | `npm run` | `npx` |
| `pnpm` | pnpm-lock.yaml | `pnpm install` | `pnpm` | `pnpm dlx` |
| `yarn` | yarn.lock | `yarn` | `yarn` | `yarn dlx` |
| `bun` | bun.lockb | `bun install` | `bun run` | `bunx` |

### Prioridade de detecção

```javascript
const { DETECTION_PRIORITY } = require('./lib/package-manager');

// ['pnpm', 'bun', 'yarn', 'npm']
```

A detecção do gerenciador de pacotes segue a seguinte prioridade (da mais alta para a mais baixa):

1. Variável de ambiente `CLAUDE_PACKAGE_MANAGER`
2. Configuração de projeto `.claude/package-manager.json`
3. Campo `packageManager` no `package.json`
4. Detecção de arquivo lock
5. Preferência global do usuário `~/.claude/package-manager.json`
6. Retorna o primeiro gerenciador de pacotes disponível por prioridade

### Funções principais

```javascript
const {
  getPackageManager,
  setPreferredPackageManager,
  setProjectPackageManager,
  getAvailablePackageManagers,
  getRunCommand,
  getExecCommand,
  getCommandPattern
} = require('./lib/package-manager');
```

#### getPackageManager(options = {})

Obtém o gerenciador de pacotes que deve ser usado no projeto atual

**Parâmetros**:
- `options` (object, opcional)
  - `projectDir` (string) - Caminho do diretório do projeto, padrão é `process.cwd()`
  - `fallbackOrder` (string[]) - Ordem de fallback, padrão é `['pnpm', 'bun', 'yarn', 'npm']`

**Retorno**: `{name: string, config: object, source: string}`

- `name`: Nome do gerenciador de pacotes
- `config`: Objeto de configuração do gerenciador de pacotes
- `source`: Fonte de detecção (`'environment' | 'project-config' | 'package.json' | 'lock-file' | 'global-config' | 'fallback' | 'default'`)

**Exemplo**:
```javascript
const pm = getPackageManager();
console.log(pm.name);        // 'pnpm'
console.log(pm.source);      // 'lock-file'
console.log(pm.config);      // { name: 'pnpm', lockFile: 'pnpm-lock.yaml', ... }
```

#### setPreferredPackageManager(pmName)

Define a preferência global de gerenciador de pacotes

**Parâmetros**:
- `pmName` (string) - Nome do gerenciador de pacotes (`npm | pnpm | yarn | bun`)

**Retorno**: `object` - Objeto de configuração

**Exemplo**:
```javascript
const config = setPreferredPackageManager('pnpm');
// Salvo em ~/.claude/package-manager.json
// { packageManager: 'pnpm', setAt: '2026-01-25T...' }
```

#### setProjectPackageManager(pmName, projectDir)

Define a preferência de gerenciador de pacotes no nível do projeto

**Parâmetros**:
- `pmName` (string) - Nome do gerenciador de pacotes
- `projectDir` (string) - Caminho do diretório do projeto, padrão é `process.cwd()`

**Retorno**: `object` - Objeto de configuração

**Exemplo**:
```javascript
const config = setProjectPackageManager('bun', '/path/to/project');
// Salvo em /path/to/project/.claude/package-manager.json
// { packageManager: 'bun', setAt: '2026-01-25T...' }
```

#### getAvailablePackageManagers()

Obtém a lista de gerenciadores de pacotes instalados no sistema

**Retorno**: `string[]` - Array de nomes de gerenciadores de pacotes disponíveis

**Exemplo**:
```javascript
const available = getAvailablePackageManagers();
// ['pnpm', 'npm']  // Se apenas pnpm e npm estiverem instalados
```

#### getRunCommand(script, options = {})

Obtém o comando para executar um script

**Parâmetros**:
- `script` (string) - Nome do script (ex: `"dev"`, `"build"`, `"test"`)
- `options` (object, opcional) - Opções de diretório do projeto

**Retorno**: `string` - Comando de execução completo

**Exemplo**:
```javascript
const devCmd = getRunCommand('dev');
// 'npm run dev'  ou  'pnpm dev'  ou  'bun run dev'

const buildCmd = getRunCommand('build');
// 'npm run build'  ou  'pnpm build'
```

**Atalhos de scripts integrados**:
- `install` → Retorna `installCmd`
- `test` → Retorna `testCmd`
- `build` → Retorna `buildCmd`
- `dev` → Retorna `devCmd`
- Outros → Retorna `${runCmd} ${script}`

#### getExecCommand(binary, args = '', options = {})

Obtém o comando para executar um binário de pacote

**Parâmetros**:
- `binary` (string) - Nome do binário (ex: `"prettier"`, `"eslint"`)
- `args` (string, opcional) - String de argumentos
- `options` (object, opcional) - Opções de diretório do projeto

**Retorno**: `string` - Comando de execução completo

**Exemplo**:
```javascript
const cmd = getExecCommand('prettier', '--write file.js');
// 'npx prettier --write file.js'  ou  'pnpm dlx prettier --write file.js'

const eslintCmd = getExecCommand('eslint');
// 'npx eslint'  ou  'bunx eslint'
```

#### getCommandPattern(action)

Gera um padrão de expressão regular que corresponde a comandos de todos os gerenciadores de pacotes

**Parâmetros**:
- `action` (string) - Tipo de ação (`'dev' | 'install' | 'test' | 'build'` ou nome de script personalizado)

**Retorno**: `string` - Padrão de expressão regular

**Exemplo**:
```javascript
const devPattern = getCommandPattern('dev');
// (npm run dev|pnpm( run)? dev|yarn dev|bun run dev)

const installPattern = getCommandPattern('install');
// (npm install|pnpm install|yarn( install)?|bun install)
```

## setup-package-manager.js - Script de Configuração do Gerenciador de Pacotes

Este é um script CLI executável para configuração interativa de preferências de gerenciador de pacotes.

### Uso

```bash
# Detectar e exibir o gerenciador de pacotes atual
node scripts/setup-package-manager.js --detect

# Definir preferência global
node scripts/setup-package-manager.js --global pnpm

# Definir preferência do projeto
node scripts/setup-package-manager.js --project bun

# Listar gerenciadores de pacotes disponíveis
node scripts/setup-package-manager.js --list

# Exibir ajuda
node scripts/setup-package-manager.js --help
```

### Argumentos de linha de comando

| Argumento | Descrição |
| --- | --- |
| `--detect` | Detectar e exibir o gerenciador de pacotes atual |
| `--global <pm>` | Definir preferência global de gerenciador de pacotes |
| `--project <pm>` | Definir preferência de gerenciador de pacotes do projeto |
| `--list` | Listar todos os gerenciadores de pacotes disponíveis |
| `--help` | Exibir informações de ajuda |

### Exemplo de saída

**Saída de --detect**:
```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ pnpm (current)
  ✓ npm
  ✗ yarn
  ✗ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

## Detalhes dos Scripts de Hook

### session-start.js - Hook de Início de Sessão

**Tipo de Hook**: `SessionStart`

**Momento de acionamento**: Quando uma sessão do Claude Code inicia

**Funcionalidades**:
- Verifica arquivos de sessão recentes (últimos 7 dias)
- Verifica arquivos de habilidades aprendidas
- Detecta e reporta o gerenciador de pacotes
- Se o gerenciador de pacotes foi detectado via fallback, exibe prompt de seleção

**Exemplo de saída**:
```
[SessionStart] Found 3 recent session(s)
[SessionStart] Latest: /Users/username/.claude/sessions/2026-01-25-session.tmp
[SessionStart] 5 learned skill(s) available in /Users/username/.claude/skills/learned
[SessionStart] Package manager: pnpm (lock-file)
```

### session-end.js - Hook de Fim de Sessão

**Tipo de Hook**: `SessionEnd`

**Momento de acionamento**: Quando uma sessão do Claude Code termina

**Funcionalidades**:
- Cria ou atualiza o arquivo de sessão do dia
- Registra horários de início e fim da sessão
- Fornece template de status da sessão (concluído, em progresso, notas)

**Template do arquivo de sessão**:
```markdown
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 14:30
**Last Updated:** 15:45

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
```
[relevant files]
```
```

### pre-compact.js - Hook Pré-Compactação

**Tipo de Hook**: `PreCompact`

**Momento de acionamento**: Antes do Claude Code compactar o contexto

**Funcionalidades**:
- Registra evento de compactação no arquivo de log
- Marca o momento da compactação no arquivo de sessão ativo

**Exemplo de saída**:
```
[PreCompact] State saved before compaction
```

**Arquivo de log**: `~/.claude/sessions/compaction-log.txt`

### suggest-compact.js - Hook de Sugestão de Compactação

**Tipo de Hook**: `PreToolUse`

**Momento de acionamento**: Após cada chamada de ferramenta (geralmente Edit ou Write)

**Funcionalidades**:
- Rastreia contagem de chamadas de ferramentas
- Sugere compactação manual ao atingir o limite
- Lembra periodicamente sobre o momento de compactar

**Variáveis de ambiente**:
- `COMPACT_THRESHOLD` - Limite de compactação (padrão: 50)
- `CLAUDE_SESSION_ID` - ID da sessão

**Exemplo de saída**:
```
[StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
[StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
```

::: tip Compactação manual vs automática
Por que a compactação manual é recomendada?
- A compactação automática geralmente é acionada no meio de uma tarefa, causando perda de contexto
- A compactação manual pode preservar informações importantes durante transições de fase lógica
- Momentos para compactar: fim da fase de exploração, início da fase de execução, conclusão de marcos
:::

### evaluate-session.js - Hook de Avaliação de Sessão

**Tipo de Hook**: `Stop`

**Momento de acionamento**: Ao final de cada resposta da IA

**Funcionalidades**:
- Verifica o comprimento da sessão (baseado no número de mensagens do usuário)
- Avalia se a sessão contém padrões extraíveis
- Sugere salvar habilidades aprendidas

**Arquivo de configuração**: `skills/continuous-learning/config.json`

**Variáveis de ambiente**:
- `CLAUDE_TRANSCRIPT_PATH` - Caminho do arquivo de transcrição da sessão

**Exemplo de saída**:
```
[ContinuousLearning] Session has 25 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/username/.claude/skills/learned
```

::: tip Por que usar Stop em vez de UserPromptSubmit?
- Stop é acionado apenas uma vez por resposta (leve)
- UserPromptSubmit é acionado para cada mensagem (alta latência)
:::

## Scripts de Hook Personalizados

### Criando um Hook personalizado

1. **Crie o script no diretório `scripts/hooks/`**

```javascript
#!/usr/bin/env node
/**
 * Custom Hook - Your Description
 *
 * Cross-platform (Windows, macOS, Linux)
 */

const { log, output } = require('../lib/utils');

async function main() {
  // Sua lógica
  log('[CustomHook] Processing...');
  
  // Saída do resultado
  output({ success: true });
  
  process.exit(0);
}

main().catch(err => {
  console.error('[CustomHook] Error:', err.message);
  process.exit(0); // Não bloqueia a sessão
});
```

2. **Configure o Hook em `hooks/hooks.json`**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/your-hook.js\""
    }
  ],
  "description": "Your custom hook description"
}
```

3. **Teste o Hook**

```bash
# Acione a condição no Claude Code e verifique a saída
```

### Melhores práticas

#### 1. Tratamento de erros

```javascript
main().catch(err => {
  console.error('[HookName] Error:', err.message);
  process.exit(0); // Não bloqueia a sessão
});
```

#### 2. Use a biblioteca de utilitários

```javascript
const {
  log,
  readFile,
  writeFile,
  ensureDir
} = require('../lib/utils');
```

#### 3. Caminhos multiplataforma

```javascript
const path = require('path');
const filePath = path.join(getHomeDir(), '.claude', 'config.json');
```

#### 4. Variáveis de ambiente

```javascript
const sessionId = process.env.CLAUDE_SESSION_ID || 'default';
const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
```

## Testando scripts

### Testando funções utilitárias

```javascript
const { findFiles, readFile, writeFile } = require('./lib/utils');

// Testar busca de arquivos
const files = findFiles('/tmp', '*.tmp', { maxAge: 7 });
console.log('Found files:', files);

// Testar leitura/escrita de arquivos
writeFile('/tmp/test.txt', 'Hello, World!');
const content = readFile('/tmp/test.txt');
console.log('Content:', content);
```

### Testando detecção de gerenciador de pacotes

```javascript
const { getPackageManager, getRunCommand } = require('./lib/package-manager');

const pm = getPackageManager();
console.log('Package manager:', pm.name);
console.log('Source:', pm.source);
console.log('Dev command:', getRunCommand('dev'));
```

### Testando scripts de Hook

```bash
# Executar script de Hook diretamente (requer variáveis de ambiente)
CLAUDE_SESSION_ID=test CLAUDE_TRANSCRIPT_PATH=/tmp/transcript.json \
  node scripts/hooks/session-start.js
```

## Dicas de depuração

### 1. Use saída de log

```javascript
const { log } = require('../lib/utils');

log('[Debug] Current value:', value);
```

### 2. Capture erros

```javascript
try {
  // Código que pode falhar
} catch (err) {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
}
```

### 3. Verifique caminhos de arquivo

```javascript
const path = require('path');
const { existsSync } = require('fs');

const filePath = path.join(getHomeDir(), '.claude', 'config.json');
console.log('Config path:', filePath);
console.log('Exists:', existsSync(filePath));
```

### 4. Visualize logs de execução do Hook

```bash
# No Claude Code, a saída stderr do Hook aparece na resposta
# Procure logs com prefixo [HookName]
```

## Perguntas frequentes

### Q1: O script de Hook não está executando?

**Possíveis causas**:
1. Configuração do matcher em `hooks/hooks.json` está incorreta
2. Caminho do script está errado
3. Script não tem permissão de execução

**Passos de diagnóstico**:
```bash
# Verificar caminho do script
ls -la scripts/hooks/

# Executar script manualmente para testar
node scripts/hooks/session-start.js

# Validar sintaxe do hooks.json
cat hooks/hooks.json | jq '.'
```

### Q2: Erro de caminho no Windows?

**Causa**: Windows usa barras invertidas, enquanto Unix usa barras normais

**Solução**:
```javascript
// ❌ Errado: separador de caminho hardcoded
const path = 'C:\\Users\\username\\.claude';

// ✅ Correto: usar path.join()
const path = require('path');
const claudePath = path.join(getHomeDir(), '.claude');
```

### Q3: Como depurar entrada do Hook?

**Método**: Escrever entrada do Hook em arquivo temporário

```javascript
const { writeFileSync } = require('fs');
const path = require('path');

async function main() {
  const hookInput = await readStdinJson();
  
  // Escrever arquivo de depuração
  const debugPath = path.join(getTempDir(), 'hook-debug.json');
  writeFileSync(debugPath, JSON.stringify(hookInput, null, 2));
  
  console.error('[Debug] Input saved to:', debugPath);
}
```

## Resumo da lição

Esta lição explicou sistematicamente a Scripts API do Everything Claude Code:

**Módulos principais**:
- `lib/utils.js`: Funções utilitárias multiplataforma (detecção de plataforma, operações de arquivo, comandos do sistema)
- `lib/package-manager.js`: API de detecção e configuração de gerenciador de pacotes
- `setup-package-manager.js`: Ferramenta de configuração CLI

**Scripts de Hook**:
- `session-start.js`: Carrega contexto no início da sessão
- `session-end.js`: Salva estado no fim da sessão
- `pre-compact.js`: Salva estado antes da compactação
- `suggest-compact.js`: Sugere momento para compactação manual
- `evaluate-session.js`: Avalia sessão para extração de padrões

**Melhores práticas**:
- Use funções da biblioteca de utilitários para garantir compatibilidade multiplataforma
- Scripts de Hook não devem bloquear a sessão (código de saída 0 em caso de erro)
- Use `log()` para saída de informações de depuração
- Use `process.env` para ler variáveis de ambiente

**Dicas de depuração**:
- Execute scripts diretamente para testar
- Use arquivos temporários para salvar dados de depuração
- Verifique configuração do matcher e caminhos dos scripts

## Prévia da próxima lição

> Na próxima lição, aprenderemos **[Suíte de Testes: Execução e Personalização](../test-suite/)**.
>
> Você aprenderá:
> - Como executar a suíte de testes
> - Como escrever testes unitários para funções utilitárias
> - Como escrever testes de integração para scripts de Hook
> - Como adicionar casos de teste personalizados

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Módulo funcional | Caminho do arquivo | Linhas |
| --- | --- | --- |
| Funções utilitárias gerais | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| API do gerenciador de pacotes | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-391 |
| Script de configuração do gerenciador de pacotes | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js) | 1-207 |
| Hook SessionStart | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| Hook SessionEnd | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| Hook PreCompact | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Hook Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Hook Evaluate Session | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |

**Constantes principais**:
- `DETECTION_PRIORITY = ['pnpm', 'bun', 'yarn', 'npm']`: Prioridade de detecção do gerenciador de pacotes (`scripts/lib/package-manager.js:57`)
- `COMPACT_THRESHOLD`: Limite de sugestão de compactação (padrão 50, pode ser sobrescrito via variável de ambiente)

**Funções principais**:
- `getPackageManager()`: Detecta e seleciona gerenciador de pacotes (`scripts/lib/package-manager.js:157`)
- `findFiles()`: Busca de arquivos multiplataforma (`scripts/lib/utils.js:102`)
- `readStdinJson()`: Lê entrada do Hook (`scripts/lib/utils.js:154`)
- `commandExists()`: Verifica se comando existe (`scripts/lib/utils.js:228`)

**Variáveis de ambiente**:
- `CLAUDE_PACKAGE_MANAGER`: Força gerenciador de pacotes específico
- `CLAUDE_SESSION_ID`: ID da sessão
- `CLAUDE_TRANSCRIPT_PATH`: Caminho do arquivo de transcrição da sessão
- `COMPACT_THRESHOLD`: Limite de sugestão de compactação

**Detecção de plataforma**:
- `process.platform === 'win32'`: Windows
- `process.platform === 'darwin'`: macOS
- `process.platform === 'linux'`: Linux

</details>
