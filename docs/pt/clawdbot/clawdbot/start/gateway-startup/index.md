---
title: "Iniciando o Gateway: Daemon e Modos de Execução | Tutoriais Clawdbot"
sidebarTitle: "Gateway Sempre Online"
subtitle: "Iniciando o Gateway: Daemon e Modos de Execução"
description: "Aprenda a iniciar o daemon do Gateway Clawdbot, entenda a diferença entre modo de desenvolvimento e modo de produção, e domine os comandos de inicialização e configuração de parâmetros."
tags:
  - "gateway"
  - "daemon"
  - "startup"
prerequisite:
  - "start-onboarding-wizard"
order: 30
---

# Iniciando o Gateway: Daemon e Modos de Execução

## O Que Você Aprenderá

- Iniciar o processo em primeiro plano do Gateway via linha de comando
- Configurar o Gateway como daemon em segundo plano (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- Entender diferentes modos de vinculação (loopback / LAN / Tailnet) e métodos de autenticação
- Alternar entre modo de desenvolvimento e modo de produção
- Usar `--force` para liberar portas ocupadas

## Seu Problema Atual

Você já completou a configuração do assistente, as configurações básicas do Gateway estão prontas. Mas:

- Precisa executar o comando manualmente no terminal sempre que quer usar o Gateway?
- O Gateway para quando você fecha a janela do terminal, e o assistente AI fica "offline"?
- Quer acessar o Gateway via rede local ou Tailscale, mas não sabe como configurar?
- O Gateway falha ao iniciar, mas não sabe se é problema de configuração ou porta ocupada?

## Quando Usar Este Método

**Métodos de inicialização recomendados**:

| Cenário                  | Comando                               | Descrição                                   |
|--- | --- | ---|
| Uso diário                | `clawdbot gateway install` + `clawdbot gateway start` | Inicia automaticamente como serviço em segundo plano                  |
| Desenvolvimento e depuração                | `clawdbot gateway --dev`                     | Cria configuração de desenvolvimento, recarregamento automático                  |
| Teste temporário                | `clawdbot gateway`                           | Executa em primeiro plano, logs diretos no terminal            |
| Conflito de porta                | `clawdbot gateway --force`                   | Libera a porta à força e inicia                    |
| Acesso via rede local              | `clawdbot gateway --bind lan`                 | Permite conexão de dispositivos na rede local                   |
| Acesso remoto via Tailscale         | `clawdbot gateway --tailscale serve`          | Expose o Gateway via rede Tailscale          |

## 🎒 Preparativos Antes de Começar

::: warning Verificações Prévias

Antes de iniciar o Gateway, certifique-se de:

1. ✅ Completou a configuração do assistente (`clawdbot onboard`) ou definiu manualmente `gateway.mode=local`
2. ✅ Modelos AI configurados (Anthropic / OpenAI / OpenRouter, etc.)
3. ✅ Se necessário acessar redes externas (LAN / Tailnet), configurou o método de autenticação
4. ✅ Entende seu cenário de uso (desenvolvimento local vs. produção)

:::

## Conceito Central

**O que é o Gateway?**

O Gateway é o plano de controle WebSocket do Clawdbot, responsável por:

- **Gerenciamento de sessões**: mantém o estado de todas as sessões de conversa AI
- **Conexões de canais**: conecta a 12+ canais de mensagem como WhatsApp, Telegram, Slack
- **Chamadas de ferramentas**: coordena a execução de automação de navegador, operações de arquivos, tarefas agendadas
- **Gerenciamento de nós**: gerencia nós de dispositivos macOS / iOS / Android
- **Distribuição de eventos**: envia eventos em tempo real como progresso de pensamento AI e resultados de chamadas de ferramentas

**Por que precisa de um daemon?**

O Gateway executado como serviço em segundo plano tem essas vantagens:

- **Sempre online**: mesmo fechando o terminal, o assistente AI permanece disponível
- **Inicialização automática**: o serviço reinicia automaticamente após reboot do sistema (macOS LaunchAgent / Linux systemd)
- **Gerenciamento unificado**: controla o ciclo de vida através dos comandos `start` / `stop` / `restart`
- **Logs centralizados**: coleta de logs em nível de sistema, facilitando a solução de problemas

## Siga os Passos

### Passo 1: Iniciar o Gateway (Modo Primeiro Plano)

**Por que**

O modo primeiro plano é adequado para desenvolvimento e testes, logs são exibidos diretamente no terminal, facilitando a visualização em tempo real do estado do Gateway.

```bash
# Inicia com configuração padrão (escuta em 127.0.0.1:18789)
clawdbot gateway

# Inicia especificando porta
clawdbot gateway --port 19001

# Habilita logs detalhados
clawdbot gateway --verbose
```

**Você deve ver**:

```bash
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
✓ log file: /Users/you/.clawdbot/logs/gateway.log
```

::: tip Ponto de Verificação

- Ver `listening on ws://...` indica inicialização bem-sucedida
- Anote o PID (ID do processo) exibido, para depuração posterior
- A porta padrão é 18789, pode ser alterada via `--port`

:::

### Passo 2: Configurar Modo de Vinculação

**Por que**

Por padrão, o Gateway escuta apenas no endereço de loopback local (`127.0.0.1`), o que significa que apenas a máquina local pode conectar. Se você quiser acessar via rede local ou Tailscale, precisa ajustar o modo de vinculação.

```bash
# Apenas loopback local (padrão, mais seguro)
clawdbot gateway --bind loopback

# Acesso via rede local (requer autenticação)
clawdbot gateway --bind lan --token "your-token"

# Acesso via rede Tailscale
clawdbot gateway --bind tailnet --token "your-token"

# Detecção automática (local + LAN)
clawdbot gateway --bind auto
```

**Você deve ver**:

```bash
# modo loopback
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# modo lan
✓ listening on ws://192.168.1.100:18789 (PID 12345)
✓ listening on ws://10.0.0.5:18789
```

::: warning Aviso de Segurança

⚠️ **Vincular a endereço não-loopback requer configuração de autenticação!**

- Ao usar `--bind lan` / `--bind tailnet`, deve passar `--token` ou `--password`
- Caso contrário, o Gateway recusará iniciar, com erro: `Refusing to bind gateway to lan without auth`
- O token de autenticação é definido via configuração `gateway.auth.token` ou parâmetro `--token`

:::

### Passo 3: Instalar como Daemon (macOS / Linux / Windows)

**Por que**

O daemon permite que o Gateway execute em segundo plano, não sendo afetado pelo fechamento da janela do terminal. Inicia automaticamente após reboot do sistema, mantendo o assistente AI sempre online.

```bash
# Instalar como serviço do sistema (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
clawdbot gateway install

# Iniciar serviço
clawdbot gateway start

# Ver status do serviço
clawdbot gateway status

# Reiniciar serviço
clawdbot gateway restart

# Parar serviço
clawdbot gateway stop
```

**Você deve ver**:

```bash
# macOS
✓ LaunchAgent loaded
✓ service runtime: active

# Linux
✓ systemd service enabled
✓ service runtime: active

# Windows
✓ Scheduled Task registered
✓ service runtime: running
```

::: tip Ponto de Verificação

- Execute `clawdbot gateway status` para confirmar que o status do serviço é `active` / `running`
- Se o serviço exibe `loaded` mas `runtime: inactive`, execute `clawdbot gateway start`
- Logs do daemon são gravados em `~/.clawdbot/logs/gateway.log`

:::

### Passo 4: Lidar com Conflitos de Porta (--force)

**Por que**

A porta padrão 18789 pode estar ocupada por outro processo (como instância anterior do Gateway). Use `--force` para liberar a porta automaticamente.

```bash
# Libera a porta à força e inicia o Gateway
clawdbot gateway --force
```

**Você deve ver**:

```bash
✓ force: killed pid 9876 (node) on port 18789
✓ force: waited 1200ms for port 18789 to free
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: info Como Funciona

`--force` executa as seguintes operações em ordem:

1. Tenta SIGTERM para encerrar o processo gracefulmente (aguarda 700ms)
2. Se não encerrou, usa SIGKILL para forçar o encerramento
3. Aguarda a liberação da porta (até 2 segundos)
4. Inicia novo processo do Gateway

:::

### Passo 5: Modo de Desenvolvimento (--dev)

**Por que**

O modo de desenvolvimento usa arquivos e diretórios de configuração independentes, evitando poluir o ambiente de produção. Suporta hot reload de TypeScript, reiniciando o Gateway automaticamente após alterações no código.

```bash
# Inicia modo de desenvolvimento (cria profile dev + workspace)
clawdbot gateway --dev

# Reseta configuração de desenvolvimento (limpa credenciais + sessões + workspace)
clawdbot gateway --dev --reset
```

**Você deve ver**:

```bash
✓ dev config created at ~/.clawdbot-dev/clawdbot.json
✓ dev workspace initialized at ~/clawd-dev
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Características do Modo de Desenvolvimento

- Arquivo de configuração: `~/.clawdbot-dev/clawdbot.json` (independente da configuração de produção)
- Diretório de workspace: `~/clawd-dev`
- Ignora execução do script `BOOT.md`
- Vincula a loopback por padrão, sem autenticação

:::

### Passo 6: Integração com Tailscale

**Por que**

O Tailscale permite acessar o Gateway remoto via rede privada segura, sem necessidade de IP público ou port forwarding.

```bash
# Modo Tailscale Serve (recomendado)
clawdbot gateway --tailscale serve

# Modo Tailscale Funnel (requer autenticação adicional)
clawdbot gateway --tailscale funnel --auth password
```

**Você deve ver**:

```bash
# modo serve
✓ Tailscale identity detected
✓ advertising gateway via Tailscale Serve
✓ MagicDNS: https://your-tailnet.ts.net
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# modo funnel
✓ Tailscale Funnel enabled
✓ Funnel URL: https://your-tailnet.ts.net:18789
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Configurar Autenticação

A integração Tailscale suporta dois métodos de autenticação:

1. **Identity Headers** (recomendado): defina `gateway.auth.allowTailscale=true`, a identidade Tailscale satisfaz automaticamente a autenticação
2. **Token / Password**: método tradicional de autenticação, precisa passar manualmente `--token` ou `--password`

:::

### Passo 7: Verificar Status do Gateway

**Por que**

Confirmar que o Gateway está funcionando normalmente e que o protocolo RPC está acessível.

```bash
# Ver status completo (serviço + sondagem RPC)
clawdbot gateway status

# Pular sondagem RPC (apenas status do serviço)
clawdbot gateway status --no-probe

# Verificação de saúde
clawdbot gateway health

# Sondar todos os Gateways alcançáveis
clawdbot gateway probe
```

**Você deve ver**:

```bash
# saída do comando status
Gateway service status
┌──────────────────────────────────────┐
│ Service: LaunchAgent (loaded)      │
│ Runtime: running (PID 12345)       │
│ Port: 18789                       │
│ Last gateway error: none            │
└──────────────────────────────────────┘

RPC probe
┌──────────────────────────────────────┐
│ Target: ws://127.0.0.1:18789 │
│ Status: ✓ connected                │
│ Latency: 12ms                    │
└──────────────────────────────────────┘

# saída do comando health
✓ Gateway is healthy
✓ WebSocket connection: OK
✓ RPC methods: available
```

::: tip Solução de Problemas

Se `status` exibe `Runtime: running` mas `RPC probe: failed`:

1. Verifique se a porta está correta: `clawdbot gateway status`
2. Verifique a configuração de autenticação: vinculou a LAN / Tailnet mas não forneceu autenticação?
3. Veja os logs: `cat ~/.clawdbot/logs/gateway.log`
4. Execute `clawdbot doctor` para diagnóstico detalhado

:::

## Armadilhas Comuns

### ❌ Erro: Gateway Recusa Inicialização

**Mensagem de erro**:
```
Gateway start blocked: set gateway.mode=local (current: unset) or pass --allow-unconfigured.
```

**Causa**: `gateway.mode` não foi definido como `local`

**Solução**:

```bash
# Método 1: execute a configuração do assistente
clawdbot onboard

# Método 2: modifique manualmente o arquivo de configuração
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "mode": "local"
  }
}

# Método 3: pule temporariamente a verificação (não recomendado)
clawdbot gateway --allow-unconfigured
```

### ❌ Erro: Vinculação a LAN Sem Autenticação

**Mensagem de erro**:
```
Refusing to bind gateway to lan without auth.
Set gateway.auth.token/password (or CLAWDBOT_GATEWAY_TOKEN/CLAWDBOT_GATEWAY_PASSWORD) or pass --token/--password.
```

**Causa**: vinculação não-loopback requer configuração de autenticação (restrição de segurança)

**Solução**:

```bash
# Definir autenticação via arquivo de configuração
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}

# Ou passar via linha de comando
clawdbot gateway --bind lan --token "your-secure-token"
```

### ❌ Erro: Porta Já em Uso

**Mensagem de erro**:
```
Error: listen EADDRINUSE: address already in use :::18789
```

**Causa**: outra instância do Gateway ou outro programa ocupa a porta

**Solução**:

```bash
# Método 1: libere a porta à força
clawdbot gateway --force

# Método 2: use porta diferente
clawdbot gateway --port 19001

# Método 3: encontre e termine o processo manualmente
lsof -ti:18789 | xargs kill -9  # macOS / Linux
netstat -ano | findstr :18789               # Windows
```

### ❌ Erro: Reset do Modo Dev Requer --dev

**Mensagem de erro**:
```
Use --reset with --dev.
```

**Causa**: `--reset` só pode ser usado no modo de desenvolvimento, evitando exclusão acidental de dados de produção

**Solução**:

```bash
# Comando correto para resetar ambiente de desenvolvimento
clawdbot gateway --dev --reset
```

### ❌ Erro: Serviço Instalado mas Ainda Usando Modo Primeiro Plano

**Sintoma**: ao executar `clawdbot gateway`, exibe "Gateway already running locally"

**Causa**: o daemon já está executando em segundo plano

**Solução**:

```bash
# Parar serviço em segundo plano
clawdbot gateway stop

# Ou reiniciar serviço
clawdbot gateway restart

# Depois iniciar em primeiro plano (se necessário para depuração)
clawdbot gateway --port 19001  # use porta diferente
```

## Resumo da Lição

Nesta lição você aprendeu:

✅ **Métodos de inicialização**: modo primeiro plano vs daemon
✅ **Modos de vinculação**: loopback / LAN / Tailnet / Auto
✅ **Métodos de autenticação**: Token / Password / Tailscale Identity
✅ **Modo de desenvolvimento**: configuração independente, hot reload, --reset para resetar
✅ **Solução de problemas**: comandos `status` / `health` / `probe`
✅ **Gerenciamento de serviço**: `install` / `start` / `stop` / `restart` / `uninstall`

**Referência Rápida de Comandos Chave**:

| Cenário                   | Comando                                        |
|--- | ---|
| Uso diário (serviço)       | `clawdbot gateway install && clawdbot gateway start` |
| Desenvolvimento e depuração              | `clawdbot gateway --dev`                     |
| Teste temporário              | `clawdbot gateway`                           |
| Liberar porta à força          | `clawdbot gateway --force`                   |
| Acesso via rede local           | `clawdbot gateway --bind lan --token "xxx"`   |
| Acesso remoto via Tailscale       | `clawdbot gateway --tailscale serve`          |
| Ver status              | `clawdbot gateway status`                     |
| Verificação de saúde              | `clawdbot gateway health`                     |

## Próxima Lição

> Na próxima lição aprenderemos **[Enviar a Primeira Mensagem](../first-message/)**.
>
> Você aprenderá:
> - Enviar a primeira mensagem via WebChat
> - Conversar com o assistente AI via canais configurados (WhatsApp/Telegram, etc.)
> - Entender roteamento de mensagens e fluxo de resposta

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade                        | Caminho do Arquivo                                                                                   | Linha     |
|--- | --- | ---|
| Entrada de inicialização do Gateway            | [`src/cli/gateway-cli/run.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/run.ts) | 55-310   |
| Abstração de serviço de daemon         | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | 66-155    |
| Inicializar serviço de sidebar           | [`src/gateway/server-startup.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup.ts) | 26-160    |
| Implementação do servidor Gateway         | [`src/gateway/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server.ts) | 1-500     |
| Parse de argumentos do programa             | [`src/daemon/program-args.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/program-args.ts) | 1-250     |
| Saída de log de inicialização              | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 7-40      |
| Configuração do modo de desenvolvimento             | [`src/cli/gateway-cli/dev.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/dev.ts) | 1-100     |
| Lógica de liberação de porta             | [`src/cli/ports.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/ports.ts) | 1-80      |

**Constantes principais**:
- Porta padrão: `18789` (fonte: `src/gateway/server.ts`)
- Vinculação padrão: `loopback` (fonte: `src/cli/gateway-cli/run.ts:175`)
- Caminho de configuração do modo de desenvolvimento: `~/.clawdbot-dev/` (fonte: `src/cli/gateway-cli/dev.ts`)

**Funções principais**:
- `runGatewayCommand()`: entrada principal do CLI do Gateway, processa argumentos de linha de comando e lógica de inicialização
- `startGatewayServer()`: inicia servidor WebSocket, escuta na porta especificada
- `forceFreePortAndWait()`: libera porta à força e aguarda
- `resolveGatewayService()`: retorna implementação de daemon correspondente por plataforma (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- `logGatewayStartup()`: exibe informações de inicialização do Gateway (modelo, endereço de escuta, arquivo de log)

</details>
