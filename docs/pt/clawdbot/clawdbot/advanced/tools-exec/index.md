---
title: "Guia Completo de Ferramentas de Execução de Comandos e Aprovações: Mecanismos de Segurança, Configuração e Resolução de Problemas | Tutorial do Clawdbot"
sidebarTitle: "Executar comandos com segurança usando IA"
subtitle: "Ferramentas de Execução de Comandos e Aprovações"
description: "Aprenda a configurar e usar a ferramenta exec do Clawdbot para executar comandos de Shell, entender os três modos de execução (sandbox/gateway/node), mecanismos de segurança de aprovações, configuração da lista de permissões e fluxo de aprovação. Este tutorial inclui exemplos práticos de configuração, comandos CLI e resolução de problemas para ajudá-lo a estender com segurança as capacidades do seu assistente de IA."
tags:
  - "advanced"
  - "tools"
  - "exec"
  - "security"
  - "approvals"
prerequisite:
  - "start-gateway-startup"
order: 220
---

# Ferramentas de Execução de Comandos e Aprovações

## O que você poderá fazer

- Configurar a ferramenta exec para executar em três modos (sandbox/gateway/node)
- Entender e configurar os mecanismos de segurança de aprovações (deny/allowlist/full)
- Gerenciar a lista de permissões (Allowlist) e bins seguros
- Aprovar solicitações exec por meio da UI ou canais de chat
- Resolução de problemas comuns e erros de segurança da ferramenta exec

## Seu dilema atual

A ferramenta exec permite que assistentes de IA executem comandos de Shell, o que é poderoso mas também perigoso：

- A IA vai excluir arquivos importantes no meu sistema?
- Como limitar a IA para executar apenas comandos seguros?
- Quais são as diferenças entre os diferentes modos de execução?
- Como funciona o fluxo de aprovação?
- Como a lista de permissões deve ser configurada?

## Quando usar essa abordagem

- Quando você precisa que a IA execute operações do sistema (gerenciamento de arquivos, compilação de código)
- Quando você quer que a IA chame scripts personalizados ou ferramentas
- Quando você precisa de controle granular das permissões de execução da IA
- Quando você precisa permitir comandos específicos com segurança

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
Este tutorial assume que você completou [Iniciar Gateway](../../start/gateway-startup/) e que o daemon do Gateway está em execução.
:::

- Certifique-se de que Node ≥22 está instalado
- O daemon do Gateway está em execução
- Conhecimento básico de comandos de Shell e sistema de arquivos Linux/Unix

## Conceitos Principais

### As Três Camadas de Segurança da Ferramenta exec

A ferramenta exec usa um mecanismo de segurança de três camadas para controlar as permissões de execução da IA, do nível grosseiro ao fino：

1. **Política de Ferramentas (Tool Policy)**：controla se a ferramenta `exec` é permitida em `tools.policy`
2. **Host de Execução (Host)**：comandos são executados em três ambientes sandbox/gateway/node
3. **Mecanismo de Aprovações (Approvals)**：nos modos gateway/node, restrições adicionais podem ser aplicadas via allowlist e prompts de aprovação

::: info Por que a proteção multicamada é necessária?
A proteção de uma única camada é fácil de contornar ou configurar incorretamente. A proteção multicamada garante que se uma camada falhar, as outras camadas possam fornecer proteção.
:::

### Comparação dos Três Modos de Execução

| Modo de Execução | Local de Execução | Nível de Segurança | Cenários Típicos | Requer Aprovação |
|--- | --- | --- | --- | ---|
| **sandbox** | Dentro de contêineres (ex. Docker) | Alto | Ambiente isolado, testes | Não |
| **gateway** | A máquina onde o daemon do Gateway está em execução | Médio | Desenvolvimento local, integração | Sim (allowlist + aprovação) |
| **node** | Nó do dispositivo emparelhado (macOS/iOS/Android) | Médio | Operações locais do dispositivo | Sim (allowlist + aprovação) |

**Diferenças Chave**：
- O modo sandbox por padrão **não requer aprovação** (mas pode estar limitado pelo Sandbox)
- Os modos gateway e node por padrão **requerem aprovação** (a menos que configurados como `full`)

## Siga-me

### Passo 1: Entender os parâmetros da ferramenta exec

**Por que**
Entender os parâmetros da ferramenta exec é a base da configuração de segurança.

A ferramenta exec suporta os seguintes parâmetros：

```json
{
  "tool": "exec",
  "command": "ls -la",
  "workdir": "/path/to/dir",
  "env": { "NODE_ENV": "production" },
  "yieldMs": 10000,
  "background": false,
  "timeout": 1800,
  "pty": false,
  "host": "sandbox",
  "security": "allowlist",
  "ask": "on-miss",
  "node": "mac-1"
}
```

**Descrição dos Parâmetros**：

| Parâmetro | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `command` | string | Obrigatório | Comando de Shell a ser executado |
| `workdir` | string | Diretório de trabalho atual | Diretório de execução |
| `env` | object | Herdar ambiente | Sobrescrita de variáveis de ambiente |
| `yieldMs` | number | 10000 | Mudar automaticamente para plano de fundo após o tempo limite (milissegundos) |
| `background` | boolean | false | Executar imediatamente em plano de fundo |
| `timeout` | number | 1800 | Tempo limite de execução (segundos) |
| `pty` | boolean | false | Executar em um pseudo-terminal (suporte TTY) |
| `host` | string | sandbox | Host de execução：`sandbox` \| `gateway` \| `node` |
| `security` | string | deny/allowlist | Política de segurança：`deny` \| `allowlist` \| `full` |
| `ask` | string | on-miss | Política de aprovação：`off` \| `on-miss` \| `always` |
| `node` | string | - | ID ou nome do nó de destino no modo node |

**O que você deve ver**：A lista de parâmetros explica claramente os métodos de controle para cada modo de execução.

### Passo 2: Configurar o modo de execução padrão

**Por que**
Definir valores padrão globais através de arquivos de configuração evita especificar parâmetros em cada chamada exec.

Edite `~/.clawdbot/clawdbot.json`：

```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "security": "allowlist",
      "ask": "on-miss",
      "node": "mac-1",
      "notifyOnExit": true,
      "approvalRunningNoticeMs": 10000,
      "pathPrepend": ["~/bin", "/opt/homebrew/bin"],
      "safeBins": ["jq", "grep", "cut"]
    }
  }
}
```

**Descrição dos Elementos de Configuração**：

| Elemento de Configuração | Tipo | Valor Padrão | Descrição |
|--- | --- | --- | ---|
| `host` | string | sandbox | Host de execução padrão |
| `security` | string | deny (sandbox) / allowlist (gateway, node) | Política de segurança padrão |
| `ask` | string | on-miss | Política de aprovação padrão |
| `node` | string | - | Nó padrão no modo node |
| `notifyOnExit` | boolean | true | Enviar evento do sistema quando tarefas de segundo plano terminarem |
| `approvalRunningNoticeMs` | number | 10000 | Enviar notificação "em execução" após o tempo limite (0 para desativar) |
| `pathPrepend` | string[] | - | Lista de diretórios para adicionar ao PATH |
| `safeBins` | string[] | [Lista padrão] | Lista de bins seguros (apenas operações stdin) |

**O que você deve ver**：Depois de salvar a configuração, a ferramenta exec usa esses valores padrão.

### Passo 3: Usar a substituição de sessão `/exec`

**Por que**
A substituição de sessão permite ajustar temporariamente os parâmetros de execução sem editar o arquivo de configuração.

Envie no chat：

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

Ver os valores de substituição atuais：

```
/exec
```

**O que você deve ver**：Configuração dos parâmetros exec da sessão atual.

### Passo 4: Configurar a Allowlist (Lista de Permissões)

**Por que**
allowlist é o mecanismo de segurança central nos modos gateway/node, permitindo apenas a execução de comandos específicos.

#### Editar allowlist

**Editar via UI**：

1. Abra a UI de Controle
2. Vá para a aba **Nodes**
3. Encontre o cartão **Exec approvals**
4. Selecione o alvo (Gateway ou Node)
5. Selecione o Agente (ex. `main`)
6. Clique em **Add pattern** para adicionar um padrão de comando
7. Clique em **Save** para salvar

**Editar via CLI**：

```bash
clawdbot approvals
```

**Editar via arquivo JSON**：

Edite `~/.clawdbot/exec-approvals.json`：

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss",
    "askFallback": "deny",
    "autoAllowSkills": false
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "askFallback": "deny",
      "autoAllowSkills": true,
      "allowlist": [
        {
          "id": "B0C8C0B3-2C2D-4F8A-9A3C-5A4B3C2D1E0F",
          "pattern": "~/Projects/**/bin/*",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg -n TODO",
          "lastResolvedPath": "/Users/user/Projects/bin/rg"
        },
        {
          "id": "C1D9D1C4-3D3E-5F9B-0B4D-6B5C4D3E2F1G",
          "pattern": "/opt/homebrew/bin/rg",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg test",
          "lastResolvedPath": "/opt/homebrew/bin/rg"
        }
      ]
    }
  }
}
```

**Descrição do Modo Allowlist**：

allowlist usa **correspondência de padrões glob** (insensível a maiúsculas/minúsculas)：

| Padrão | Correspondência | Descrição |
|--- | --- | ---|
| `~/Projects/**/bin/*` | `/Users/user/Projects/any/bin/rg` | Corresponde a todos os subdiretórios |
| `~/.local/bin/*` | `/Users/user/.local/bin/jq` | Corresponde ao bin local |
| `/opt/homebrew/bin/rg` | `/opt/homebrew/bin/rg` | Correspondência de caminho absoluto |

::: warning Regras Importantes
- **Corresponde apenas ao caminho binário resolvido**, não suporta correspondência de nome base (ex. `rg`)
- Encadeamentos de Shell (`&&`, `||`, `;`) requerem que cada segmento satisfaça allowlist
- Redirecionamentos (`>`, `<`) não são suportados no modo allowlist
:::

**O que você deve ver**：Depois de configurar allowlist, apenas comandos correspondentes podem ser executados.

### Passo 5: Entender bins seguros (Safe Bins)

**Por que**
safe bins é um conjunto de binários seguros que suportam apenas operações stdin, que podem ser executados no modo allowlist sem allowlist explícito.

**Bins seguros padrão**：

`jq`, `grep`, `cut`, `sort`, `uniq`, `head`, `tail`, `tr`, `wc`

**Características de segurança de bins seguros**：

- Rejeita argumentos de arquivo de posição
- Rejeita flags tipo caminho
- Só pode operar no fluxo passado (stdin)

**Configurar bins seguros personalizados**：

```json
{
  "tools": {
    "exec": {
      "safeBins": ["jq", "grep", "my-safe-tool"]
    }
  }
}
```

**O que você deve ver**：Comandos de bins seguros podem ser executados diretamente no modo allowlist.

### Passo 6: Aprovar solicitações exec via canais de chat

**Por que**
Quando a UI não está disponível, você pode aprovar solicitações exec através de qualquer canal de chat (WhatsApp, Telegram, Slack, etc.).

#### Habilitar encaminhamento de aprovações

Edite `~/.clawdbot/clawdbot.json`：

```json
{
  "approvals": {
    "exec": {
      "enabled": true,
      "mode": "session",
      "agentFilter": ["main"],
      "sessionFilter": ["discord"],
      "targets": [
        { "channel": "slack", "to": "U12345678" },
        { "channel": "telegram", "to": "123456789" }
      ]
    }
  }
}
```

**Descrição dos Elementos de Configuração**：

| Elemento de Configuração | Descrição |
|--- | ---|
| `enabled` | Se deve habilitar o encaminhamento de aprovações exec |
| `mode` | `"session"` \| `"targets"` \| `"both"` - modo de alvos de aprovação |
| `agentFilter` | Processar apenas solicitações de aprovação de agentes específicos |
| `sessionFilter` | Filtro de sessão (substring ou regex) |
| `targets` | Lista de canais de destino (`channel` + `to`) |

#### Aprovar solicitações

Quando a ferramenta exec precisa de aprovação, você receberá uma mensagem com as seguintes informações：

```
Exec approval request (id: abc-123)
Command: ls -la
CWD: /home/user
Agent: main
Resolved: /usr/bin/ls
Host: gateway
Security: allowlist
```

**Opções de aprovação**：

```
/approve abc-123 allow-once     # Permitir uma vez
/approve abc-123 allow-always    # Sempre permitir (adicionar à allowlist)
/approve abc-123 deny           # Negar
```

**O que você deve ver**：Depois de aprovar, o comando é executado ou rejeitado.

## Ponto de Verificação ✅

- [ ] Você entende as diferenças entre os três modos de execução (sandbox/gateway/node)
- [ ] Você configurou os parâmetros padrão globais exec
- [ ] Você pode usar a substituição de sessão do comando `/exec`
- [ ] Você configurou allowlist (pelo menos um padrão)
- [ ] Você entende as características de segurança de bins seguros
- [ ] Você pode aprovar solicitações exec via canais de chat

## Armadilhas Comuns

### Erros Comuns

| Erro | Causa | Solução |
|--- | --- | ---|
| `Command not allowed by exec policy` | `security=deny` ou allowlist não corresponde | Verifique `tools.exec.security` e configuração allowlist |
| `Approval timeout` | UI não disponível, `askFallback=deny` | Defina `askFallback=allowlist` ou habilite a UI |
| `Pattern does not resolve to binary` | Uso de nome base no modo allowlist | Use o caminho completo (ex. `/opt/homebrew/bin/rg`) |
| `Unsupported shell token` | Uso de `>` ou `&&` no modo allowlist | Divida comandos ou use `security=full` |
| `Node not found` | Nó não emparelhado no modo node | Complete primeiro o emparelhamento de nós |

### Encadeamentos e Redirecionamentos de Shell

::: danger Aviso
No modo `security=allowlist`, os seguintes recursos do Shell **não são suportados**：
- Pipes：`|` (mas `||` é suportado)
- Redirecionamentos：`>`, `<`, `>>`
- Substituição de comandos：`$()`, `` ` ` ``
- Plano de fundo：`&`, `;`
:::

**Soluções**：
- Use `security=full` (com cuidado)
- Divida em várias chamadas exec
- Escreva scripts de wrapper e adicione o caminho do script à allowlist

### Variáveis de Ambiente PATH

Os diferentes modos de execução processam PATH de maneiras diferentes：

| Modo de Execução | Processamento de PATH | Descrição |
|--- | --- | ---|
| `sandbox` | Herda shell login, pode ser redefinido por `/etc/profile` | `pathPrepend` é aplicado após o profile |
| `gateway` | Mescla login shell PATH ao ambiente exec | O daemon mantém PATH mínimo, mas exec herda PATH do usuário |
| `node` | Usa apenas sobrescritas de variáveis de ambiente passadas | Nós macOS descartam sobrescritas de `PATH`, nós headless suportam prepend |

**O que você deve ver**：A configuração correta de PATH afeta a busca de comandos.

## Resumo

A ferramenta exec permite que assistentes de IA executem comandos de Shell com segurança através de um mecanismo de três camadas (política de ferramentas, host de execução, aprovações)：

- **Modos de execução**：sandbox (isolamento de contêiner), gateway (execução local), node (operações de dispositivo)
- **Políticas de segurança**：deny (proibição completa), allowlist (lista branca), full (permissão completa)
- **Mecanismo de aprovações**：off (sem prompt), on-miss (prompt quando não corresponde), always (sempre prompt)
- **Allowlist**：correspondência de padrões glob do caminho binário resolvido
- **Bins seguros**：binários que fazem apenas operações stdin são isentos de aprovação no modo allowlist

## Próxima Lição

> Na próxima lição aprenderemos **[Ferramentas de Pesquisa e Extração Web](../tools-web/)**
>
> Você aprenderá：
> - Como usar a ferramenta `web_search` para pesquisa na web
> - Como usar a ferramenta `web_fetch` para extrair conteúdo de páginas da web
> - Como configurar provedores de mecanismos de busca (Brave, Perplexity)
> - Como lidar com resultados de pesquisa e erros de extração web

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código fonte</strong></summary>

> Última atualização：2026-01-27

| Funcionalidade | Caminho do Arquivo | Número da Linha |
|--- | --- | ---|
| Definição da ferramenta exec | [`src/agents/bash-tools.exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/bash-tools.exec.ts) | 1-500+ |
| Lógica de aprovação exec | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1-1268 |
| Análise de comandos Shell | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 500-1100 |
| Correspondência de Allowlist | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 507-521 |
| Validação de Safe bins | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 836-873 |
| Comunicação Socket de Aprovações | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1210-1267 |
| Execução de Processos | [`src/process/exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/process/exec.ts) | 1-125 |
| Schema de Configuração de Ferramentas | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**Tipos Chave**：
- `ExecHost`: `"sandbox" \| "gateway" \| "node"` - Tipo de host de execução
- `ExecSecurity`: `"deny" \| "allowlist" \| "full"` - Política de segurança
- `ExecAsk`: `"off" \| "on-miss" \| "always"` - Política de aprovação
- `ExecAllowlistEntry`: Tipo de entrada allowlist (contém `pattern`, `lastUsedAt`, etc.)

**Constantes Chave**：
- `DEFAULT_SECURITY = "deny"` - Política de segurança padrão
- `DEFAULT_ASK = "on-miss"` - Política de aprovação padrão
- `DEFAULT_SAFE_BINS = ["jq", "grep", "cut", "sort", "uniq", "head", "tail", "tr", "wc"]` - Bins seguros padrão

**Funções Chave**：
- `resolveExecApprovals()`: Resolve configuração exec-approvals.json
- `evaluateShellAllowlist()`: Avalia se o comando Shell satisfaz allowlist
- `matchAllowlist()`: Verifica se o caminho do comando corresponde ao padrão allowlist
- `isSafeBinUsage()`: Valida se o comando é um uso de bin seguro
- `requestExecApprovalViaSocket()`: Solicita aprovação através do socket Unix

</details>
