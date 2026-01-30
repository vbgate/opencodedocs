---
title: "Solução de Problemas: Diagnóstico de Erros Comuns | Plannotator"
sidebarTitle: "Diagnóstico Rápido"
subtitle: "Solução de Problemas: Diagnóstico de Erros Comuns"
description: "Aprenda métodos de solução de problemas do Plannotator, incluindo visualização de logs, conflitos de porta, depuração de Hook events, problemas de navegador, status do repositório Git e tratamento de erros de integração."
tags:
  - "Solução de Problemas"
  - "Depuração"
  - "Erros Comuns"
  - "Visualização de Logs"
prerequisite:
  - "start-getting-started"
order: 2
---

# Solução de Problemas do Plannotator

## O Que Você Vai Aprender

Ao encontrar problemas, você será capaz de:

- Identificar rapidamente a origem do problema (conflito de porta, parsing de Hook event, configuração do Git, etc.)
- Diagnosticar erros através da saída de logs
- Aplicar a solução correta para diferentes tipos de erro
- Depurar problemas de conexão em modo remoto/Devcontainer

## Seu Problema Atual

O Plannotator parou de funcionar repentinamente, o navegador não abre, ou o Hook está exibindo mensagens de erro. Você não sabe como visualizar os logs e não tem certeza de qual etapa está com problema. Talvez você tenha tentado reiniciar, mas o problema persiste.

## Quando Usar Este Guia

A solução de problemas é necessária nas seguintes situações:

- O navegador não abre automaticamente
- O Hook exibe mensagens de erro
- Conflito de porta impede a inicialização
- A página de plano ou revisão de código exibe anomalias
- Falha na integração com Obsidian/Bear
- Git diff aparece vazio

---

## Conceito Central

Os problemas do Plannotator geralmente se dividem em três categorias:

1. **Problemas de Ambiente**: conflito de porta, configuração incorreta de variáveis de ambiente, problema no caminho do navegador
2. **Problemas de Dados**: falha no parsing do Hook event, conteúdo do plano vazio, status anormal do repositório Git
3. **Problemas de Integração**: falha ao salvar no Obsidian/Bear, problemas de conexão em modo remoto

O núcleo da depuração é **visualizar a saída de logs**. O Plannotator usa `console.error` para enviar erros para stderr e `console.log` para enviar informações normais para stdout. Distinguir entre esses dois ajuda a identificar rapidamente o tipo de problema.

---

## 🎒 Preparação Antes de Começar

- ✅ Plannotator instalado (plugin Claude Code ou OpenCode)
- ✅ Familiaridade com operações básicas de linha de comando
- ✅ Conhecimento do diretório do seu projeto e status do repositório Git

---

## Siga Comigo

### Passo 1: Verificar a Saída de Logs

**Por quê**

Todos os erros do Plannotator são enviados para stderr. Visualizar os logs é o primeiro passo para diagnosticar problemas.

**Como Fazer**

#### No Claude Code

Quando o Hook aciona o Plannotator, as mensagens de erro aparecem na saída do terminal do Claude Code:

```bash
# Exemplo de erro que você pode ver
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

#### No OpenCode

O OpenCode captura o stderr do CLI e exibe na interface:

```
[stderr] Failed to parse hook event from stdin
[stderr] No plan content in hook event
```

**O que você deve ver**:

- Se não houver erros, stderr deve estar vazio ou conter apenas mensagens esperadas
- Se houver erros, incluirá o tipo de erro (como EADDRINUSE), mensagem de erro e stack trace (se houver)

---

### Passo 2: Resolver Conflitos de Porta

**Por quê**

O Plannotator inicia o servidor em uma porta aleatória por padrão. Se uma porta fixa estiver ocupada, o servidor tentará novamente 5 vezes (com delay de 500ms cada), e reportará erro após falhar.

**Mensagem de Erro**:

```
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

**Solução**

#### Opção A: Deixar o Plannotator escolher a porta automaticamente (Recomendado)

Não defina a variável de ambiente `PLANNOTATOR_PORT`, e o Plannotator escolherá automaticamente uma porta disponível.

#### Opção B: Usar porta fixa e resolver o conflito

Se você precisar usar uma porta fixa (como em modo remoto), resolva o conflito de porta:

```bash
# macOS/Linux
lsof -ti:54321 | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 54321 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Em seguida, redefina a porta:

```bash
# macOS/Linux/WSL
export PLANNOTATOR_PORT=54322

# Windows PowerShell
$env:PLANNOTATOR_PORT = "54322"
```

**Checkpoint ✅**:

- Acione o Plannotator novamente, o navegador deve abrir normalmente
- Se ainda houver erro, tente um número de porta diferente

---

### Passo 3: Depurar Falha no Parsing do Hook Event

**Por quê**

O Hook event são dados JSON lidos do stdin. Se o parsing falhar, o Plannotator não pode continuar.

**Mensagem de Erro**:

```
Failed to parse hook event from stdin
No plan content in hook event
```

**Possíveis Causas**:

1. O Hook event não é um JSON válido
2. O Hook event não possui o campo `tool_input.plan`
3. Versão do Hook incompatível

**Método de Depuração**

#### Visualizar o conteúdo do Hook event

Antes de iniciar o servidor Hook, imprima o conteúdo do stdin:

```bash
# Modifique temporariamente hook/server/index.ts
# Adicione após a linha 91:
console.error("[DEBUG] Hook event:", eventJson);
```

**O que você deve ver**:

```json
{
  "tool_input": {
    "plan": "# Implementation Plan\n\n## Task 1\n..."
  },
  "permission_mode": "default"
}
```

**Solução**:

- Se `tool_input.plan` estiver vazio ou ausente, verifique se o AI Agent gerou o plano corretamente
- Se o formato JSON estiver incorreto, verifique se a configuração do Hook está correta
- Se a versão do Hook for incompatível, atualize o Plannotator para a versão mais recente

---

### Passo 4: Resolver Problema do Navegador Não Abrindo

**Por quê**

O Plannotator usa a função `openBrowser` para abrir o navegador automaticamente. Se falhar, pode ser um problema de compatibilidade entre plataformas ou caminho do navegador incorreto.

**Possíveis Causas**:

1. Navegador padrão do sistema não configurado
2. Caminho personalizado do navegador inválido
3. Problema de tratamento especial em ambiente WSL
4. Em modo remoto, o navegador não abre automaticamente (isso é normal)

**Método de Depuração**

#### Verificar se está em modo remoto

```bash
# Verificar variável de ambiente
echo $PLANNOTATOR_REMOTE

# Windows PowerShell
echo $env:PLANNOTATOR_REMOTE
```

Se a saída for `1` ou `true`, significa que está em modo remoto, e o navegador não abrirá automaticamente — este é o comportamento esperado.

#### Testar abertura manual do navegador

```bash
# macOS
open "http://localhost:54321"

# Linux
xdg-open "http://localhost:54321"

# Windows
start http://localhost:54321
```

**O que você deve ver**:

- Se a abertura manual funcionar, significa que o servidor Plannotator está funcionando normalmente, e o problema está na lógica de abertura automática
- Se a abertura manual falhar, verifique se a URL está correta (a porta pode ser diferente)

**Solução**:

#### Opção A: Definir navegador personalizado (macOS)

```bash
export PLANNOTATOR_BROWSER="Google Chrome"

# Ou usar caminho completo
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

#### Opção B: Definir navegador personalizado (Linux)

```bash
export PLANNOTATOR_BROWSER="/usr/bin/firefox"
```

#### Opção C: Abertura manual em modo remoto (Devcontainer/SSH)

```bash
# O Plannotator exibirá informações de URL e porta
# Copie a URL e abra no navegador local
# Ou use port forwarding:
ssh -L 19432:localhost:19432 user@remote
```

---

### Passo 5: Verificar Status do Repositório Git (Revisão de Código)

**Por quê**

A funcionalidade de revisão de código depende de comandos Git. Se o status do repositório Git estiver anormal (como sem commits, Detached HEAD), o diff aparecerá vazio ou com erro.

**Mensagem de Erro**:

```
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Método de Depuração**

#### Verificar repositório Git

```bash
# Verificar se está em um repositório Git
git status

# Verificar branch atual
git branch

# Verificar se há commits
git log --oneline -1
```

**O que você deve ver**:

- Se a saída for `fatal: not a git repository`, significa que o diretório atual não é um repositório Git
- Se a saída for `HEAD detached at <commit>`, significa que está em estado Detached HEAD
- Se a saída for `fatal: your current branch 'main' has no commits yet`, significa que ainda não há nenhum commit

**Solução**:

#### Problema A: Não está em um repositório Git

```bash
# Inicializar repositório Git
git init
git add .
git commit -m "Initial commit"
```

#### Problema B: Estado Detached HEAD

```bash
# Mudar para uma branch
git checkout main
# Ou criar nova branch
git checkout -b feature-branch
```

#### Problema C: Sem commits

```bash
# É necessário pelo menos um commit para visualizar o diff
git add .
git commit -m "Initial commit"
```

#### Problema D: Diff vazio (sem alterações)

```bash
# Criar algumas alterações
echo "test" >> test.txt
git add test.txt

# Executar /plannotator-review novamente
```

**Checkpoint ✅**:

- Execute `/plannotator-review` novamente, o diff deve aparecer normalmente
- Se ainda estiver vazio, verifique se há alterações não staged ou não commitadas

---

### Passo 6: Depurar Falha na Integração Obsidian/Bear

**Por quê**

Falha na integração Obsidian/Bear não impede a aprovação do plano, mas causa falha ao salvar. Os erros são enviados para stderr.

**Mensagem de Erro**:

```
[Obsidian] Save failed: Vault not found
[Bear] Save failed: Failed to open Bear
```

**Método de Depuração**

#### Verificar configuração do Obsidian

**macOS**:
```bash
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

**Windows**:
```powershell
cat $env:APPDATA\obsidian\obsidian.json
```

**O que você deve ver**:

```json
{
  "vaults": {
    "/path/to/vault": {
      "path": "/path/to/vault",
      "ts": 1234567890
    }
  }
}
```

#### Verificar disponibilidade do Bear (macOS)

```bash
# Testar URL scheme do Bear
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**O que você deve ver**:

- O aplicativo Bear abre e cria uma nova nota
- Se nada acontecer, significa que o Bear não está instalado corretamente

**Solução**:

#### Falha ao salvar no Obsidian

- Certifique-se de que o Obsidian está em execução
- Verifique se o caminho do vault está correto
- Tente criar uma nota manualmente no Obsidian para verificar permissões

#### Falha ao salvar no Bear

- Certifique-se de que o Bear está instalado corretamente
- Teste se `bear://x-callback-url` está disponível
- Verifique se x-callback-url está habilitado nas configurações do Bear

---

### Passo 7: Visualizar Logs de Erro Detalhados (Modo de Depuração)

**Por quê**

Às vezes as mensagens de erro não são detalhadas o suficiente, e você precisa ver o stack trace completo e o contexto.

**Como Fazer**

#### Habilitar modo de depuração do Bun

```bash
export DEBUG="*"
plannotator review

# Windows PowerShell
$env:DEBUG = "*"
plannotator review
```

#### Visualizar logs do servidor Plannotator

Erros internos do servidor são enviados via `console.error`. Localizações importantes dos logs:

- `packages/server/index.ts:260` - Logs de erro de integração
- `packages/server/git.ts:141` - Logs de erro do Git diff
- `apps/hook/server/index.ts:100-106` - Erros de parsing do Hook event

**O que você deve ver**:

```bash
# Salvo com sucesso no Obsidian
[Obsidian] Saved plan to: /path/to/vault/Plan - 2026-01-24.md

# Falha ao salvar
[Obsidian] Save failed: Cannot write to directory
[Bear] Save failed: Failed to open Bear

# Erro do Git diff
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Checkpoint ✅**:

- Os logs de erro contêm informações suficientes para localizar o problema
- Aplique a solução correspondente com base no tipo de erro

---

## Armadilhas Comuns

### ❌ Ignorar a saída stderr

**Abordagem Incorreta**:

```bash
# Focar apenas no stdout, ignorando stderr
plannotator review 2>/dev/null
```

**Abordagem Correta**:

```bash
# Visualizar stdout e stderr simultaneamente
plannotator review
# Ou separar os logs
plannotator review 2>error.log
```

### ❌ Reiniciar o servidor às cegas

**Abordagem Incorreta**:

- Reiniciar ao encontrar problemas sem verificar a causa do erro

**Abordagem Correta**:

- Primeiro visualize os logs de erro para determinar o tipo de problema
- Aplique a solução correspondente com base no tipo de erro
- Reiniciar é apenas o último recurso

### ❌ Esperar que o navegador abra automaticamente em modo remoto

**Abordagem Incorreta**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Esperar que o navegador abra automaticamente (não vai acontecer)
```

**Abordagem Correta**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Anote a URL exibida e abra manualmente no navegador
# Ou use port forwarding
```

---

## Resumo da Lição

- O Plannotator usa `console.error` para enviar erros para stderr e `console.log` para enviar informações normais para stdout
- Problemas comuns incluem: conflito de porta, falha no parsing do Hook event, navegador não abrindo, status anormal do repositório Git, falha na integração
- O núcleo da depuração é: visualizar logs → identificar tipo de problema → aplicar solução correspondente
- Em modo remoto, o navegador não abre automaticamente; você precisa abrir a URL manualmente ou configurar port forwarding

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Problemas Comuns](../common-problems/)**.
>
> Você aprenderá:
> - Como resolver problemas de instalação e configuração
> - Equívocos comuns de uso e precauções
> - Sugestões de otimização de desempenho

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver as localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Mecanismo de retry de porta | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L80) | 79-80 |
| Tratamento de erro EADDRINUSE | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L320-L334) | 320-334 |
| Parsing do Hook event | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L91-L107) | 91-107 |
| Abertura do navegador | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Tratamento de erro do Git diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L139-L144) | 139-144 |
| Log de salvamento no Obsidian | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L242-L246) | 242-246 |
| Log de salvamento no Bear | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L252-L256) | 252-256 |

**Constantes Importantes**:
- `MAX_RETRIES = 5`: Número máximo de tentativas de porta
- `RETRY_DELAY_MS = 500`: Delay entre tentativas de porta (milissegundos)

**Funções Importantes**:
- `startPlannotatorServer()`: Inicia o servidor de revisão de planos
- `startReviewServer()`: Inicia o servidor de revisão de código
- `openBrowser()`: Abertura de navegador multiplataforma
- `runGitDiff()`: Executa comando Git diff
- `saveToObsidian()`: Salva plano no Obsidian
- `saveToBear()`: Salva plano no Bear

</details>
