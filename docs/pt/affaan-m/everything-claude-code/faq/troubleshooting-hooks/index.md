---
title: "Solução de Problemas: Hooks | everything-claude-code"
sidebarTitle: "Correção de Hooks em 5 Minutos"
subtitle: "Solução de Problemas: Hooks | everything-claude-code"
description: "Aprenda a diagnosticar problemas com Hooks. Resolva sistematicamente questões de variáveis de ambiente, permissões e sintaxe JSON para garantir o funcionamento correto de SessionStart/End e PreToolUse."
tags:
  - "hooks"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "advanced-hooks-automation"
order: 150
---

# O Que Fazer Quando os Hooks Não Funcionam

## O Problema Que Você Está Enfrentando

Configurou os Hooks, mas descobriu que eles não estão funcionando como esperado? Você pode estar enfrentando as seguintes situações:

- O Dev server não está sendo bloqueado fora do tmux
- Não está vendo logs de SessionStart ou SessionEnd
- A formatação automática do Prettier não está funcionando
- A verificação do TypeScript não está sendo executada
- Está vendo mensagens de erro estranhas

Não se preocupe, esses problemas geralmente têm soluções claras. Esta lição ajudará você a diagnosticar e corrigir problemas relacionados aos Hooks de forma sistemática.

## 🎒 Preparação Antes de Começar

::: warning Verificação Prévia
Certifique-se de que você:
1. ✅ Completou a [instalação](../../start/installation/) do Everything Claude Code
2. ✅ Entende os conceitos básicos de [Automação com Hooks](../../advanced/hooks-automation/)
3. ✅ Leu as instruções de configuração de Hooks no README do projeto
:::

---

## Problema Comum 1: Hooks Não São Acionados

### Sintomas
Após executar comandos, você não vê nenhuma saída de log `[Hook]`, e os Hooks parecem não estar sendo chamados.

### Possíveis Causas

#### Causa A: Caminho do hooks.json Incorreto

**Problema**: O `hooks.json` não está no local correto, e o Claude Code não consegue encontrar o arquivo de configuração.

**Solução**:

Verifique se o `hooks.json` está no local correto:

```bash
# Deve estar em um dos seguintes locais:
~/.claude/hooks/hooks.json              # Configuração de usuário (global)
.claude/hooks/hooks.json                 # Configuração de projeto
```

**Como verificar**:

```bash
# Ver configuração de usuário
ls -la ~/.claude/hooks/hooks.json

# Ver configuração de projeto
ls -la .claude/hooks/hooks.json
```

**Se o arquivo não existir**, copie do diretório do plugin Everything Claude Code:

```bash
# Assumindo que o plugin está instalado em ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/hooks/hooks.json ~/.claude/hooks/
```

#### Causa B: Erro de Sintaxe JSON

**Problema**: O `hooks.json` tem erros de sintaxe, impedindo que o Claude Code o analise.

**Solução**:

Valide o formato JSON:

```bash
# Use jq ou Python para validar a sintaxe JSON
jq empty ~/.claude/hooks/hooks.json
# ou
python3 -m json.tool ~/.claude/hooks/hooks.json > /dev/null
```

**Erros de sintaxe comuns**:
- Vírgula faltando
- Aspas não fechadas
- Uso de aspas simples (deve usar aspas duplas)
- Formato de comentário incorreto (JSON não suporta comentários `//`)

#### Causa C: Variável de Ambiente CLAUDE_PLUGIN_ROOT Não Definida

**Problema**: O script do Hook usa `${CLAUDE_PLUGIN_ROOT}` para referenciar caminhos, mas a variável de ambiente não está definida.

**Solução**:

Verifique se o caminho de instalação do plugin está correto:

```bash
# Ver caminhos dos plugins instalados
ls -la ~/.claude-plugins/
```

Certifique-se de que o plugin Everything Claude Code está instalado corretamente:

```bash
# Você deve ver um diretório como este
~/.claude-plugins/everything-claude-code/
├── scripts/
├── hooks/
├── agents/
└── ...
```

**Se instalado via marketplace de plugins**, reinicie o Claude Code e a variável de ambiente será definida automaticamente.

**Se instalado manualmente**, verifique o caminho do plugin em `~/.claude/settings.json`:

```json
{
  "plugins": [
    {
      "name": "everything-claude-code",
      "path": "/path/to/everything-claude-code"
    }
  ]
}
```

---

## Problema Comum 2: Hook Específico Não É Acionado

### Sintomas
Alguns Hooks funcionam (como SessionStart), mas outros não são acionados (como a formatação do PreToolUse).

### Possíveis Causas

#### Causa A: Expressão Matcher Incorreta

**Problema**: A expressão `matcher` do Hook está incorreta, fazendo com que as condições de correspondência não sejam atendidas.

**Solução**:

Verifique a sintaxe do matcher no `hooks.json`:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\""
}
```

**Observações**:
- O nome da ferramenta deve estar entre aspas duplas: `"Edit"`, `"Bash"`
- Barras invertidas em expressões regulares precisam de escape duplo: `\\\\.` em vez de `\\.`
- A correspondência de caminho de arquivo usa a palavra-chave `matches`

**Testando o Matcher**:

Você pode testar manualmente a lógica de correspondência:

```bash
# Testar correspondência de caminho de arquivo
node -e "console.log(/\\\\.(ts|tsx)$/.test('src/index.ts'))"
# Deve retornar: true
```

#### Causa B: Falha na Execução do Comando

**Problema**: O próprio comando do Hook falha na execução, mas não há mensagem de erro.

**Solução**:

Execute manualmente o comando do Hook para testar:

```bash
# Entre no diretório do plugin
cd ~/.claude-plugins/everything-claude-code

# Execute manualmente um script de Hook
node scripts/hooks/session-start.js

# Verifique se há saída de erro
```

**Causas comuns de falha**:
- Versão do Node.js incompatível (requer Node.js 14+)
- Dependências faltando (como prettier, typescript não instalados)
- Problemas de permissão do script (veja abaixo)

---

## Problema Comum 3: Problemas de Permissão (Linux/macOS)

### Sintomas
Você vê um erro como este:

```
Permission denied: node scripts/hooks/session-start.js
```

### Solução

Adicione permissão de execução aos scripts de Hook:

```bash
# Entre no diretório do plugin
cd ~/.claude-plugins/everything-claude-code

# Adicione permissão de execução a todos os scripts de hooks
chmod +x scripts/hooks/*.js

# Verifique as permissões
ls -la scripts/hooks/
# Você deve ver algo como: -rwxr-xr-x  session-start.js
```

**Correção em lote para todos os scripts**:

```bash
# Corrija todos os arquivos .js em scripts
find ~/.claude-plugins/everything-claude-code/scripts -name "*.js" -exec chmod +x {} \;
```

---

## Problema Comum 4: Problemas de Compatibilidade Entre Plataformas

### Sintomas
Funciona corretamente no Windows, mas falha no macOS/Linux; ou vice-versa.

### Possíveis Causas

#### Causa A: Separador de Caminho

**Problema**: Windows usa barra invertida `\`, Unix usa barra normal `/`.

**Solução**:

Os scripts do Everything Claude Code já tratam a compatibilidade entre plataformas (usando o módulo `path` do Node.js), mas se você personalizou um Hook, preste atenção:

**Forma incorreta**:
```json
{
  "command": "node scripts/hooks\\session-start.js"  // Estilo Windows
}
```

**Forma correta**:
```json
{
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\"  // Use variável de ambiente e barra normal
}
```

#### Causa B: Diferenças em Comandos Shell

**Problema**: Diferentes plataformas têm sintaxe de comando diferente (como `which` vs `where`).

**Solução**:

O `scripts/lib/utils.js` do Everything Claude Code já trata essas diferenças. Ao personalizar Hooks, consulte as funções multiplataforma nesse arquivo:

```javascript
// Detecção de comando multiplataforma em utils.js
function commandExists(cmd) {
  if (isWindows) {
    spawnSync('where', [cmd], { stdio: 'pipe' });
  } else {
    spawnSync('which', [cmd], { stdio: 'pipe' });
  }
}
```

---

## Problema Comum 5: Formatação Automática Não Funciona

### Sintomas
Após editar arquivos TypeScript, o Prettier não formata automaticamente o código.

### Possíveis Causas

#### Causa A: Prettier Não Instalado

**Problema**: O Hook PostToolUse chama `npx prettier`, mas não está instalado no projeto.

**Solução**:

```bash
# Instale o Prettier (nível de projeto)
npm install --save-dev prettier
# ou
pnpm add -D prettier

# Ou instale globalmente
npm install -g prettier
```

#### Causa B: Configuração do Prettier Ausente

**Problema**: O Prettier não encontra o arquivo de configuração e usa regras de formatação padrão.

**Solução**:

Crie um arquivo de configuração do Prettier:

```bash
# Crie .prettierrc no diretório raiz do projeto
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
```

#### Causa C: Tipo de Arquivo Não Corresponde

**Problema**: A extensão do arquivo editado não está nas regras de correspondência do Hook.

**Regra de correspondência atual** (`hooks.json` L92-97):

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Se precisar suportar outros tipos de arquivo** (como `.vue`), modifique a configuração:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx|vue)$\""
}
```

---

## Problema Comum 6: Verificação TypeScript Não Funciona

### Sintomas
Após editar arquivos `.ts`, você não vê a saída de erros de verificação de tipos.

### Possíveis Causas

#### Causa A: tsconfig.json Ausente

**Problema**: O script do Hook procura o arquivo `tsconfig.json` nos diretórios superiores, mas não o encontra.

**Solução**:

Certifique-se de que há um `tsconfig.json` no diretório raiz do projeto ou em um diretório pai:

```bash
# Procure tsconfig.json
find . -name "tsconfig.json" -type f

# Se não existir, crie uma configuração básica
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF
```

#### Causa B: TypeScript Não Instalado

**Problema**: O Hook chama `npx tsc`, mas o TypeScript não está instalado.

**Solução**:

```bash
npm install --save-dev typescript
# ou
pnpm add -D typescript
```

---

## Problema Comum 7: SessionStart/SessionEnd Não São Acionados

### Sintomas
Ao iniciar ou encerrar uma sessão, você não vê logs `[SessionStart]` ou `[SessionEnd]`.

### Possíveis Causas

#### Causa A: Diretório de Arquivos de Sessão Não Existe

**Problema**: O diretório `~/.claude/sessions/` não existe, e o script do Hook não consegue criar arquivos de sessão.

**Solução**:

Crie o diretório manualmente:

```bash
# macOS/Linux
mkdir -p ~/.claude/sessions

# Windows PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\sessions"
```

#### Causa B: Caminho do Script Incorreto

**Problema**: O caminho do script referenciado no `hooks.json` está incorreto.

**Como verificar**:

```bash
# Verifique se os scripts existem
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-start.js
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-end.js
```

**Se não existirem**, verifique se o plugin foi instalado completamente:

```bash
# Veja a estrutura do diretório do plugin
ls -la ~/.claude-plugins/everything-claude-code/
```

---

## Problema Comum 8: Bloqueio do Dev Server Não Funciona

### Sintomas
Executar `npm run dev` diretamente não é bloqueado, e o dev server pode ser iniciado.

### Possíveis Causas

#### Causa A: Expressão Regular Não Corresponde

**Problema**: Seu comando de dev server não está nas regras de correspondência do Hook.

**Regra de correspondência atual** (`hooks.json` L6):

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\""
}
```

**Teste a correspondência**:

```bash
# Teste se seu comando corresponde
node -e "console.log(/(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)/.test('npm run dev'))"
```

**Se precisar suportar outros comandos** (como `npm start`), modifique o `hooks.json`:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (run dev|start)|pnpm( run)? (dev|start)|yarn (dev|start)|bun run (dev|start))\""
}
```

#### Causa B: Não Está no tmux Mas Não Foi Bloqueado

**Problema**: O Hook deveria bloquear o dev server fora do tmux, mas não está funcionando.

**Pontos de verificação**:

1. Confirme que o comando do Hook é executado com sucesso:
```bash
# Simule o comando do Hook
node -e "console.error('[Hook] BLOCKED: Dev server must run in tmux');process.exit(1)"
# Você deve ver a saída de erro e código de saída 1
```

2. Verifique se `process.exit(1)` está bloqueando corretamente o comando:
- O `process.exit(1)` no comando do Hook deve impedir a execução de comandos subsequentes

3. Se ainda não funcionar, pode ser necessário atualizar a versão do Claude Code (o suporte a Hooks pode exigir a versão mais recente)

---

## Ferramentas e Técnicas de Diagnóstico

### Habilitar Logs Detalhados

Veja os logs detalhados do Claude Code para entender a execução dos Hooks:

```bash
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait -Tail 50
```

### Testar Hooks Manualmente

Execute scripts de Hook manualmente no terminal para verificar sua funcionalidade:

```bash
# Testar SessionStart
cd ~/.claude-plugins/everything-claude-code
node scripts/hooks/session-start.js

# Testar Suggest Compact
node scripts/hooks/suggest-compact.js

# Testar PreCompact
node scripts/hooks/pre-compact.js
```

### Verificar Variáveis de Ambiente

Veja as variáveis de ambiente do Claude Code:

```bash
# Adicione saída de depuração no script do Hook
node -e "console.log('CLAUDE_PLUGIN_ROOT:', process.env.CLAUDE_PLUGIN_ROOT); console.log('COMPACT_THRESHOLD:', process.env.COMPACT_THRESHOLD)"
```

---

## Lista de Verificação ✅

Verifique cada item da seguinte lista:

- [ ] `hooks.json` está no local correto (`~/.claude/hooks/` ou `.claude/hooks/`)
- [ ] Formato JSON do `hooks.json` está correto (validado com `jq`)
- [ ] Caminho do plugin está correto (`${CLAUDE_PLUGIN_ROOT}` está definido)
- [ ] Todos os scripts têm permissão de execução (Linux/macOS)
- [ ] Ferramentas de dependência estão instaladas (Node.js, Prettier, TypeScript)
- [ ] Diretório de sessões existe (`~/.claude/sessions/`)
- [ ] Expressões Matcher estão corretas (escape de regex, aspas)
- [ ] Compatibilidade entre plataformas (usando módulo `path`, variáveis de ambiente)

---

## Quando Buscar Ajuda

Se os métodos acima não resolverem o problema:

1. **Colete informações de diagnóstico**:
   ```bash
   # Exiba as seguintes informações
   echo "Node version: $(node -v)"
   echo "Claude Code version: $(claude-code --version)"
   echo "Plugin path: $(ls -la ~/.claude-plugins/everything-claude-code)"
   echo "Hooks config: $(cat ~/.claude/hooks/hooks.json | jq -c .)"
   ```

2. **Verifique as Issues do GitHub**:
   - Visite [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - Procure por problemas semelhantes

3. **Abra uma Issue**:
   - Inclua logs de erro completos
   - Forneça informações do sistema operacional e versão
   - Anexe o conteúdo do `hooks.json` (oculte informações sensíveis)

---

## Resumo da Lição

Hooks que não funcionam geralmente têm as seguintes categorias de causas:

| Tipo de Problema | Causas Comuns | Diagnóstico Rápido |
| --- | --- | --- |
| **Não aciona de forma alguma** | Caminho do hooks.json incorreto, erro de sintaxe JSON | Verifique localização do arquivo, valide formato JSON |
| **Hook específico não aciona** | Expressão Matcher incorreta, falha na execução do comando | Verifique sintaxe regex, execute script manualmente |
| **Problemas de permissão** | Script sem permissão de execução (Linux/macOS) | `chmod +x scripts/hooks/*.js` |
| **Compatibilidade entre plataformas** | Separador de caminho, diferenças em comandos Shell | Use módulo `path`, consulte utils.js |
| **Funcionalidade não funciona** | Ferramentas de dependência não instaladas (Prettier, TypeScript) | Instale as ferramentas correspondentes, verifique arquivos de configuração |

Lembre-se: a maioria dos problemas pode ser resolvida verificando caminhos de arquivo, validando formato JSON e confirmando instalação de dependências.

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Solução de Problemas de Conexão MCP](../troubleshooting-mcp/)**.
>
> Você aprenderá:
> - Erros comuns de configuração do servidor MCP
> - Como depurar problemas de conexão MCP
> - Configuração de variáveis de ambiente e placeholders do MCP

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Configuração principal dos Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Hook SessionStart | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| Hook SessionEnd | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| Hook PreCompact | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Hook Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Funções utilitárias multiplataforma | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |

**Funções principais**:
- `getHomeDir()` / `getClaudeDir()` / `getSessionsDir()`: Obtém caminhos de diretórios de configuração (utils.js 19-34)
- `ensureDir(dirPath)`: Garante que o diretório existe, cria se não existir (utils.js 54-59)
- `log(message)`: Exibe log para stderr (visível no Claude Code) (utils.js 182-184)
- `findFiles(dir, pattern, options)`: Busca de arquivos multiplataforma (utils.js 102-149)
- `commandExists(cmd)`: Verifica se o comando existe (compatível com múltiplas plataformas) (utils.js 228-246)

**Expressões regulares principais**:
- Bloqueio de Dev server: `npm run dev|pnpm( run)? dev|yarn dev|bun run dev` (hooks.json 6)
- Correspondência de edição de arquivo: `\\.(ts|tsx|js|jsx)$` (hooks.json 92)
- Arquivos TypeScript: `\\.(ts|tsx)$` (hooks.json 102)

**Variáveis de ambiente**:
- `${CLAUDE_PLUGIN_ROOT}`: Caminho do diretório raiz do plugin
- `CLAUD_SESSION_ID`: Identificador da sessão
- `COMPACT_THRESHOLD`: Limite de sugestão de compactação (padrão 50)

</details>
