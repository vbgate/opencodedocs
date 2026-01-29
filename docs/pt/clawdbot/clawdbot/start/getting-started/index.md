---
title: "Início Rápido: Instalar e Iniciar o Clawdbot | Tutorial"
sidebarTitle: "Rodar em 5 Minutos"
subtitle: "Início Rápido: Instalar, Configurar e Iniciar o Clawdbot"
description: "Aprenda a instalar o Clawdbot, configurar modelos de IA, iniciar o Gateway e enviar a primeira mensagem via WhatsApp/Telegram/Slack e outros canais."
tags:
  - "Primeiros Passos"
  - "Instalação"
  - "Configuração"
  - "Gateway"
prerequisite: []
order: 10
---

# Início Rápido: Instalar, Configurar e Iniciar o Clawdbot

## O Que Você Será Capaz de Fazer

Após concluir este tutorial, você será capaz de:

- ✅ Instalar o Clawdbot em seu dispositivo
- ✅ Configurar autenticação de modelos de IA (Anthropic / OpenAI / outros provedores)
- ✅ Iniciar o daemon Gateway
- ✅ Enviar a primeira mensagem via WebChat ou canais configurados

## Sua Situação Atual

Você pode estar pensando:

- "Assistentes de IA locais parecem complicados, por onde começar?"
- "Tenho vários dispositivos (celular, computador), como gerenciá-los de forma unificada?"
- "Conheço bem WhatsApp/Telegram/Slack, posso usá-los para conversar com a IA?"

A boa notícia é: **O Clawdbot foi projetado exatamente para resolver esses problemas**.

## Quando Usar Este Guia

Quando você precisar:

- 🚀 **Configurar pela primeira vez** seu assistente de IA pessoal
- 🔧 **Configurar múltiplos canais** (WhatsApp, Telegram, Slack, Discord, etc.)
- 🤖 **Conectar modelos de IA** (Anthropic Claude, OpenAI GPT, etc.)
- 📱 **Colaboração entre dispositivos** (nós macOS, iOS, Android)

::: tip Por que recomendamos o modo Gateway?
O Gateway é o plano de controle do Clawdbot, ele:
- Gerencia de forma unificada todas as sessões, canais, ferramentas e eventos
- Suporta conexões concorrentes de múltiplos clientes
- Permite que nós de dispositivos executem operações locais
:::

## 🎒 Pré-requisitos

### Requisitos de Sistema

| Componente | Requisito |
| ----------- | ----------- |
| **Node.js** | ≥ 22.12.0 |
| **Sistema Operacional** | macOS / Linux / Windows (WSL2) |
| **Gerenciador de Pacotes** | npm / pnpm / bun |

::: warning Atenção Usuários Windows
No Windows, **WSL2** é altamente recomendado, pois:
- Muitos canais dependem de binários locais
- Daemons (launchd/systemd) não estão disponíveis no Windows
:::

### Modelos de IA Recomendados

Embora qualquer modelo seja suportado, recomendamos fortemente:

| Provedor | Modelo Recomendado | Motivo |
| ---------- | ---------------- | ------------------------------ |
| Anthropic | Claude Opus 4.5 | Vantagem de contexto longo, maior resistência a injeção de prompts |
| OpenAI | GPT-5.2 + Codex | Forte capacidade de programação, suporte multimodal |

---

## Conceito Central

A arquitetura do Clawdbot é simples: **um Gateway, múltiplos canais, um assistente de IA**.

```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat
                │
                ▼
        ┌──────────────────┐
        │   Gateway       │  ← Plano de Controle (Daemon)
        │   127.0.0.1:18789 │
        └────────┬─────────┘
                 │
                 ├→ AI Agent (pi-mono RPC)
                 ├→ CLI (clawdbot ...)
                 ├→ WebChat UI
                 └→ Nós macOS / iOS / Android
```

**Conceitos-chave**:

| Conceito | Função |
| -------- | ----------------------- |
| **Gateway** | Daemon responsável por gerenciamento de sessões, conexões de canais, chamadas de ferramentas |
| **Channel** | Canais de mensagens (WhatsApp, Telegram, Slack, etc.) |
| **Agent** | Runtime de IA (modo RPC baseado em pi-mono) |
| **Node** | Nós de dispositivos (macOS/iOS/Android) que executam operações locais do dispositivo |

---

## Siga Comigo

### Passo 1: Instalar o Clawdbot

**Por quê**
Após a instalação global, o comando `clawdbot` pode ser usado em qualquer lugar.

#### Método A: Usando npm (Recomendado)

```bash
npm install -g clawdbot@latest
```

#### Método B: Usando pnpm

```bash
pnpm add -g clawdbot@latest
```

#### Método C: Usando bun

```bash
bun install -g clawdbot@latest
```

**Você deveria ver**:
```
added 1 package, and audited 1 package in 3s
```

::: tip Opção para Desenvolvedores
Se você pretende desenvolver ou contribuir a partir do código-fonte, vá para [Apêndice: Compilar a Partir do Código-Fonte](#compilar-a-partir-do-codigo-fonte).
:::

---

### Passo 2: Executar o Assistente de Onboarding

**Por quê**
O assistente guiará você por todas as configurações necessárias: Gateway, canais, habilidades.

#### Iniciar o Assistente (Recomendado)

```bash
clawdbot onboard --install-daemon
```

**O que o assistente perguntará**:

| Passo | Pergunta | Descrição |
| --------- | --------------------------------- | ------------------ |
| 1 | Escolher método de autenticação do modelo de IA | OAuth / API Key |
| 2 | Configurar Gateway (porta, autenticação) | Padrão: 127.0.0.1:18789 |
| 3 | Configurar canais (WhatsApp, Telegram, etc.) | Pode pular, configurar depois |
| 4 | Configurar habilidades (opcional) | Pode pular |

**Você deveria ver**:
```
✓ Gateway configured
✓ Workspace initialized: ~/clawd
✓ Channels configured
✓ Skills installed

To start the gateway, run:
  clawdbot gateway
```

::: info O que é Daemon?
`--install-daemon` instalará o daemon Gateway:
- **macOS**: Serviço launchd (nível de usuário)
- **Linux**: Serviço de usuário systemd

Assim, o Gateway será executado automaticamente em segundo plano, sem necessidade de iniciar manualmente.
:::

---

### Passo 3: Iniciar o Gateway

**Por quê**
O Gateway é o plano de controle do Clawdbot, ele deve ser iniciado primeiro.

#### Iniciar em Primeiro Plano (Para Depuração)

```bash
clawdbot gateway --port 18789 --verbose
```

**Você deveria ver**:
```
[clawdbot] Gateway started
[clawdbot] Listening on ws://127.0.0.1:18789
[clawdbot] Ready to accept connections
```

#### Iniciar em Segundo Plano (Recomendado)

Se você usou `--install-daemon` no assistente, o Gateway iniciará automaticamente.

Verificar status:

```bash
clawdbot gateway status
```

**Você deveria ver**:
```
Gateway is running
PID: 12345
Port: 18789
```

::: tip Opções Comuns
- `--port 18789`: Especifica a porta do Gateway (padrão 18789)
- `--verbose`: Habilita logs detalhados (útil para depuração)
- `--reset`: Reinicia o Gateway (limpa sessões)
:::

---

### Passo 4: Enviar a Primeira Mensagem

**Por quê**
Verificar se a instalação foi bem-sucedida e experimentar a resposta do assistente de IA.

#### Método A: Conversar Diretamente via CLI

```bash
clawdbot agent --message "Ship checklist" --thinking high
```

**Você deveria ver**:
```
[clawdbot] Agent is thinking...
[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

#### Método B: Enviar Mensagem Através de Canais

Se você configurou canais no assistente (como WhatsApp, Telegram), pode enviar mensagens diretamente para seu assistente de IA no aplicativo correspondente.

**Exemplo WhatsApp**:

1. Abra o WhatsApp
2. Procure pelo número do seu Clawdbot
3. Envie a mensagem: `Hello, I'm testing Clawdbot!`

**Você deveria ver**:
- O assistente de IA responde à sua mensagem

::: info Proteção de Emparelhamento DM
Por padrão, o Clawdbot habilita **Proteção de Emparelhamento DM**:
- Remetentes desconhecidos receberão um código de emparelhamento
- A mensagem não será processada até que você aprove o emparelhamento

Mais detalhes: [Emparelhamento DM e Controle de Acesso](../pairing-approval/)
:::

---

## Checkpoint ✅

Após concluir os passos acima, você deve ser capaz de:

- [ ] Executar `clawdbot --version` e ver o número da versão
- [ ] Executar `clawdbot gateway status` e ver o Gateway em execução
- [ ] Enviar mensagem via CLI e receber resposta da IA
- [ ] (Opcional) Enviar mensagem em canais configurados e receber resposta da IA

::: tip Problemas Comuns
**P: Gateway falhou ao iniciar?**
R: Verifique se a porta está em uso:
```bash
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows
```

**P: IA não responde?**
R: Verifique se a API Key está configurada corretamente:
```bash
clawdbot models list
```

**P: Como ver logs detalhados?**
R: Adicione `--verbose` ao iniciar:
```bash
clawdbot gateway --verbose
```
:::

---

## Avisos de Armadilhas

### ❌ Esquecer de Instalar o Daemon

**Abordagem Errada**:
```bash
clawdbot onboard  # esqueceu --install-daemon
```

**Abordagem Correta**:
```bash
clawdbot onboard --install-daemon
```

::: warning Primeiro Plano vs Segundo Plano
- Primeiro Plano: adequado para depuração, fecha quando o terminal é encerrado
- Segundo Plano: adequado para ambiente de produção, reinicia automaticamente
:::

### ❌ Versão do Node.js Muito Baixa

**Abordagem Errada**:
```bash
node --version
# v20.x.x  # muito antiga
```

**Abordagem Correta**:
```bash
node --version
# v22.12.0 ou superior
```

### ❌ Caminho do Arquivo de Configuração Incorreto

Local padrão do arquivo de configuração do Clawdbot:

| Sistema Operacional | Caminho de Configuração |
| -------- | --------------------------- |
| macOS/Linux | `~/.clawdbot/clawdbot.json` |
| Windows (WSL2) | `~/.clawdbot/clawdbot.json` |

Se você editar manualmente o arquivo de configuração, certifique-se de que o caminho esteja correto.

---

## Resumo da Lição

Nesta lição você aprendeu:

1. ✅ **Instalar o Clawdbot**: Instalação global via npm/pnpm/bun
2. ✅ **Executar o Assistente**: `clawdbot onboard --install-daemon` para concluir a configuração
3. ✅ **Iniciar o Gateway**: `clawdbot gateway` ou daemon inicia automaticamente
4. ✅ **Enviar Mensagens**: Conversar com a IA via CLI ou canais configurados

**Próximos Passos**:

- Aprender [Configuração Guiada](../onboarding-wizard/), conhecer mais opções do assistente
- Conhecer [Iniciar Gateway](../gateway-startup/), aprender diferentes modos de inicialização (dev/produção)
- Aprender [Enviar Primeira Mensagem](../first-message/), explorar mais formatos de mensagens e formas de interação

---

## Prévia da Próxima Lição

> Na próxima lição aprenderemos **[Configuração Guiada](../onboarding-wizard/)**.
>
> Você aprenderá:
> - Como usar o assistente interativo para configurar o Gateway
> - Como configurar múltiplos canais (WhatsApp, Telegram, Slack, etc.)
> - Como gerenciar habilidades e autenticação de modelos de IA

---

## Apêndice: Compilar a Partir do Código-Fonte

Se você pretende desenvolver ou contribuir a partir do código-fonte, pode:

### 1. Clonar o Repositório

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Compilar UI (Primeira Execução)

```bash
pnpm ui:build  # Instala automaticamente as dependências da UI
```

### 4. Compilar TypeScript

```bash
pnpm build
```

### 5. Executar Onboarding

```bash
pnpm clawdbot onboard --install-daemon
```

### 6. Ciclo de Desenvolvimento (Recarga Automática)

```bash
pnpm gateway:watch  # Recarrega automaticamente quando arquivos TS são alterados
```

::: info Modo de Desenvolvimento vs Modo de Produção
- `pnpm clawdbot ...`: Executa TypeScript diretamente (modo de desenvolvimento)
- Após `pnpm build`: Gera o diretório `dist/` (modo de produção)
:::

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linhas |
| --------------- | -------------------------------------------------------------------------------------------- | ------- |
| Entrada CLI | [`src/cli/run-main.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/run-main.ts) | 26-60 |
| Comando Onboarding | [`src/cli/program/register.onboard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.onboard.ts) | 34-100 |
| Instalação do Daemon | [`src/cli/daemon-cli/install.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/daemon-cli/install.ts) | 15-100 |
| Serviço Gateway | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | Todo arquivo |
| Verificação de Runtime | [`src/infra/runtime-guard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/runtime-guard.ts) | Todo arquivo |

**Constantes-chave**:
- `DEFAULT_GATEWAY_DAEMON_RUNTIME = "node"`: Runtime padrão do daemon (de `src/commands/daemon-runtime.ts`)
- `DEFAULT_GATEWAY_PORT = 18789`: Porta padrão do Gateway (da configuração)

**Funções-chave**:
- `runCli()`: Entrada principal da CLI, processa análise de argumentos e roteamento de comandos (`src/cli/run-main.ts`)
- `runDaemonInstall()`: Instala o daemon Gateway (`src/cli/daemon-cli/install.ts`)
- `onboardCommand()`: Comando de assistente interativo (`src/commands/onboard.ts`)

</details>
