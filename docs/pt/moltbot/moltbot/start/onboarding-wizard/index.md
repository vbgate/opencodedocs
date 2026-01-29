---
title: "Configuração Assistida: Configure o Clawdbot de Forma Completa | Tutorial Clawdbot"
sidebarTitle: "Configuração em Um Clique"
subtitle: "Configuração Assistida: Configure o Clawdbot de Forma Completa"
description: "Aprenda a usar o assistente interativo para completar a configuração completa do Clawdbot, incluindo configuração de rede Gateway, autenticação de modelos de IA (suporta setup-token e API Key), canais de comunicação (WhatsApp, Telegram, Slack, etc.) e inicialização do sistema de habilidades."
tags:
  - "Primeiros Passos"
  - "Configuração"
  - "Assistente"
  - "Gateway"
prerequisite:
  - "getting-started"
order: 20
---

# Configuração Assistida: Configure o Clawdbot de Forma Completa

## O Que Você Será Capaz de Fazer

Ao concluir este tutorial, você será capaz de:

- ✅ Completar a configuração completa do Clawdbot usando o assistente interativo
- ✅ Entender a diferença entre os modos QuickStart e Manual
- ✅ Configurar a rede Gateway e opções de autenticação
- ✅ Configurar provedores de modelos de IA (setup-token e API Key)
- ✅ Habilitar canais de comunicação (WhatsApp, Telegram, etc.)
- ✅ Instalar e gerenciar pacotes de habilidades

Após concluir o assistente, o Clawdbot Gateway será executado em segundo plano e você poderá conversar com o assistente de IA através dos canais configurados.

## Sua Situação Atual

Editar manualmente os arquivos de configuração é problemático:

- Não sabe o significado e os valores padrão das opções de configuração
- É fácil esquecer configurações importantes resultando em falha ao iniciar
- Os métodos de autenticação de modelos de IA são diversos (OAuth, API Key) e não sabe qual escolher
- A configuração de canais é complexa, cada plataforma tem métodos diferentes de autenticação
- Não sabe quais habilidades do sistema instalar

A configuração assistida resolve esses problemas, guiando você através de todas as configurações com perguntas interativas e fornecendo valores padrão razoáveis.

## Quando Usar Este Método

- **Primeira instalação**: Novos usuários usando o Clawdbot pela primeira vez
- **Reconfiguração**: Precisa modificar configurações do Gateway, alternar modelos de IA ou adicionar novos canais
- **Verificação rápida**: Quer experimentar funcionalidades básicas rapidamente sem estudar profundamente os arquivos de configuração
- **Solução de problemas**: Após erros de configuração, usar o assistente para reinicializar

::: tip Dica
O assistente detecta configurações existentes, permitindo escolher entre manter, modificar ou redefinir as configurações.
:::

## Conceitos Principais

### Dois Modos

O assistente oferece dois modos de configuração:

**Modo QuickStart** (recomendado para iniciantes)
- Usa valores padrão seguros: Gateway vinculado ao loopback (127.0.0.1), porta 18789, autenticação por token
- Pula a maioria das opções de configuração detalhadas
- Adequado para uso em máquina única, início rápido

**Modo Manual** (adequado para usuários avançados)
- Configura manualmente todas as opções
- Suporta vinculação LAN, acesso remoto Tailscale, métodos personalizados de autenticação
- Adequado para implantação multi-máquina, acesso remoto ou ambientes de rede especiais

### Fluxo de Configuração

```
1. Confirmação de aviso de segurança
2. Seleção de modo (QuickStart / Manual)
3. Configuração do Gateway (porta, vinculação, autenticação, Tailscale)
4. Autenticação do modelo de IA (setup-token / API Key)
5. Configuração do espaço de trabalho (padrão ~/clawd)
6. Configuração de canais (WhatsApp / Telegram / Slack, etc.)
7. Instalação de habilidades (opcional)
8. Conclusão (iniciar Gateway)
```

### Lembrete de Segurança

No início do assistente, um aviso de segurança é exibido e você precisa confirmar o seguinte:

- Clawdbot é um projeto de hobby, ainda em fase beta
- Quando as ferramentas são habilitadas, a IA pode ler arquivos e executar operações
- Prompts maliciosos podem induzir a IA a realizar operações inseguras
- Recomenda-se usar emparelhamento/whitelist + ferramentas com privilégios mínimos
- Execute auditorias de segurança regularmente

::: danger Importante
Se você não entende os mecanismos básicos de segurança e controle de acesso, não habilite ferramentas ou exponha o Gateway à internet. Recomenda-se solicitar a alguém com experiência para ajudar na configuração antes de usar.
:::

---

## 🎒 Preparação Antes de Começar

Antes de executar o assistente, confirme:

- **Clawdbot instalado**: Consulte [Início Rápido](../getting-started/) para completar a instalação
- **Versão do Node.js**: Certifique-se de que Node.js ≥ 22 (use `node -v` para verificar)
- **Conta de modelo de IA** (recomendado):
  - Conta Anthropic Claude (assinatura Pro/Max), suporta processo OAuth
  - Ou prepare API Keys de provedores como OpenAI/DeepSeek
- **Contas de canais** (opcional): Se quiser usar WhatsApp, Telegram, etc., registre as contas correspondentes primeiro
- **Permissões de rede**: Se quiser usar Tailscale, certifique-se de que o cliente Tailscale está instalado

---

## Siga os Passos

### Passo 1: Iniciar o Assistente

Abra o terminal e execute o seguinte comando:

```bash
clawdbot onboard
```

**Por que**
Inicia o assistente de configuração interativo, guiando você através de todas as configurações necessárias.

**Você deve ver**:
```
  ┌─────────────────────────────────────────────────────┐
  │                                                   │
  │   Clawdbot onboarding                              │
  │                                                   │
  └─────────────────────────────────────────────────────┘
```

### Passo 2: Confirmar Aviso de Segurança

O assistente exibe primeiro o aviso de segurança (conforme descrito na seção "Conceitos Principais" acima).

**Por que**
Garante que os usuários entendam os riscos potenciais e evitem uso incorreto que cause problemas de segurança.

**Ação**:
- Leia o conteúdo do aviso de segurança
- Digite `y` ou selecione `Yes` para confirmar que entende os riscos
- Se não aceitar os riscos, o assistente será encerrado

**Você deve ver**:
```
Security warning — please read.

Clawdbot is a hobby project and still in beta. Expect sharp edges.
...

I understand this is powerful and inherently risky. Continue? (y/N)
```

### Passo 3: Selecionar Modo de Configuração

::: code-group

```bash [Modo QuickStart]
Recomendado para iniciantes, usa valores padrão seguros:
- Porta do Gateway: 18789
- Endereço de vinculação: Loopback (127.0.0.1)
- Método de autenticação: Token (gerado automaticamente)
- Tailscale: desativado
```

```bash [Modo Manual]
Adequado para usuários avançados, configura manualmente todas as opções:
- Porta e vinculação personalizadas do Gateway
- Escolha entre autenticação por Token ou Senha
- Configure acesso remoto Tailscale Serve/Funnel
- Configuração detalhada de cada etapa
```

:::

**Por que**
O modo QuickStart permite que iniciantes comecem rapidamente, o modo Manual permite que usuários avançados tenham controle preciso.

**Ação**:
- Use as teclas de seta para selecionar `QuickStart` ou `Manual`
- Pressione Enter para confirmar

**Você deve ver**:
```
? Onboarding mode
  QuickStart         Configure details later via clawdbot configure.
  Manual            Configure port, network, Tailscale, and auth options.
```

### Passo 4: Selecionar Modo de Implantação (apenas modo Manual)

Se selecionar o modo Manual, o assistente perguntará onde o Gateway está implantado:

::: code-group

```bash [Gateway local (esta máquina)]
O Gateway executa na máquina atual:
- Pode executar o processo OAuth e escrever credenciais localmente
- O assistente completará todas as configurações
- Adequado para desenvolvimento local ou implantação de máquina única
```

```bash [Gateway remoto (apenas informações)]
O Gateway executa em outra máquina:
- O assistente configura apenas a URL remota e autenticação
- Não executa o processo OAuth, precisa definir credenciais manualmente no host remoto
- Adequado para cenários de implantação multi-máquina
```

:::

**Por que**
O modo Local suporta o fluxo de configuração completo, o modo Remote configura apenas informações de acesso.

**Ação**:
- Selecione o modo de implantação
- Se for modo Remote, insira a URL e o token do Gateway remoto

### Passo 5: Configurar o Gateway (apenas modo Manual)

Se selecionar o modo Manual, o assistente perguntará sobre cada configuração do Gateway:

#### Porta do Gateway

```bash
? Gateway port (18789)
```

**Explicação**:
- Valor padrão 18789
- Se a porta estiver ocupada, insira outra porta
- Certifique-se de que a porta não esteja bloqueada pelo firewall

#### Endereço de Vinculação do Gateway

```bash
? Gateway bind
  Loopback (127.0.0.1)
  LAN (0.0.0.0)
  Tailnet (Tailscale IP)
  Auto (Loopback → LAN)
  Custom IP
```

**Explicação das opções**:
- **Loopback**: Apenas acesso local, mais seguro
- **LAN**: Dispositivos na rede local podem acessar
- **Tailnet**: Acesso através da rede virtual Tailscale
- **Auto**: Tenta loopback primeiro, muda para LAN se falhar
- **Custom IP**: Especifica manualmente o endereço IP

::: tip Dica
Recomenda-se usar Loopback ou Tailnet, evitando exposição direta à rede local.
:::

#### Método de Autenticação do Gateway

```bash
? Gateway auth
  Token              Recommended default (local + remote)
  Password
```

**Explicação das opções**:
- **Token**: Opção recomendada, gera automaticamente um token aleatório, suporta acesso remoto
- **Password**: Usa senha personalizada, necessário para o modo Tailscale Funnel

#### Acesso Remoto Tailscale (opcional)

```bash
? Tailscale exposure
  Off               No Tailscale exposure
  Serve             Private HTTPS for your tailnet (devices on Tailscale)
  Funnel            Public HTTPS via Tailscale Funnel (internet)
```

::: warning Aviso Tailscale
- Modo Serve: Apenas dispositivos na rede Tailscale podem acessar
- Modo Funnel: Expor através de HTTPS público (requer autenticação por senha)
- Certifique-se de que o cliente Tailscale está instalado: https://tailscale.com/download/mac
:::

### Passo 6: Configurar o Espaço de Trabalho

O assistente perguntará pelo diretório do espaço de trabalho:

```bash
? Workspace directory (~/clawd)
```

**Explicação**:
- Valor padrão `~/clawd` (ou seja, `/Users/seu-usuário/clawd`)
- O espaço de trabalho armazena histórico de sessões, configuração de agentes, habilidades e outros dados
- Pode usar caminhos absolutos ou relativos

::: info Suporte a múltiplos arquivos de configuração (Profile)
Ao definir a variável de ambiente `CLAWDBOT_PROFILE`, você pode usar configurações independentes para diferentes ambientes de trabalho:

| Valor do Profile | Caminho do Espaço de Trabalho | Arquivo de Configuração |
|--- | --- | ---|
| `default` ou não definido | `~/clawd` | `~/.clawdbot/clawdbot.json` |
| `work` | `~/clawd-work` | `~/.clawdbot/clawdbot.json` (work profile) |
| `dev` | `~/clawd-dev` | `~/.clawdbot/clawdbot.json` (dev profile) |

Exemplo:
```bash
# Usar work profile
export CLAWDBOT_PROFILE=work
clawdbot onboard
```
:::

**Você deve ver**:
```
Ensuring workspace directory: /Users/seu-usuário/clawd
Creating sessions.json...
Creating agents directory...
```

### Passo 7: Configurar Autenticação de Modelos de IA

O assistente listará os provedores de modelos de IA suportados:

```bash
? Choose AI model provider
  Anthropic                    Claude Code CLI + API key
  OpenAI                       Codex OAuth + API key
  MiniMax                      M2.1 (recommended)
  Qwen                         OAuth
  Venice AI                     Privacy-focused (uncensored models)
  Google                       Gemini API key + OAuth
  Copilot                      GitHub + local proxy
  Vercel AI Gateway            API key
  Moonshot AI                  Kimi K2 + Kimi Code
  Z.AI (GLM 4.7)            API key
  OpenCode Zen                 API key
  OpenRouter                   API key
  Custom API Endpoint
  Skip for now
```

Após selecionar o provedor, o assistente exibirá métodos de autenticação específicos com base no tipo de provedor. A seguir estão as opções de autenticação para os principais provedores:

**Métodos de autenticação Anthropic**:
- `claude-cli`: Usa a autenticação OAuth existente do Claude Code CLI (requer acesso ao Keychain)
- `token`: Cola o setup-token gerado através de `claude setup-token`
- `apiKey`: Insere manualmente a API Key Anthropic

::: info Método setup-token Anthropic (recomendado)
Recomenda-se usar o método setup-token, razões:
- Não precisa gerenciar API Key manualmente
- Gera token com validade prolongada
- Adequado para usuários de assinatura pessoal Pro/Max

Fluxo:
1. Primeiro execute em outro terminal: `claude setup-token`
2. Este comando abrirá o navegador para autorização OAuth
3. Copie o setup-token gerado
4. No assistente, selecione `Anthropic` → `token`
5. Cole o setup-token no assistente
6. As credenciais são salvas automaticamente no diretório `~/.clawdbot/credentials/`
:::

::: info Método API Key
Se escolher API Key:
- O assistente pedirá para inserir a API Key
- As credenciais são salvas no diretório `~/.clawdbot/credentials/`
- Suporta múltiplos provedores, pode alternar a qualquer momento

Exemplo:
```bash
? Enter API Key
sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
:::

### Passo 8: Selecionar Modelo Padrão

Após autenticação bem-sucedida, o assistente exibirá a lista de modelos disponíveis:

```bash
? Select default model
  anthropic/claude-sonnet-4-5      Anthropic Sonnet 4.5 (200k ctx)
  anthropic/claude-opus-4-5          Anthropic Opus 4.5 (200k ctx)
  openai/gpt-4-turbo                OpenAI GPT-4 Turbo
  deepseek/DeepSeek-V3                DeepSeek V3
  (Keep current selection)
```

**Recomendação**:
- Recomenda-se usar **Claude Sonnet 4.5** ou **Opus 4.5** (200k de contexto, maior segurança)
- Se o orçamento for limitado, pode escolher a versão Mini
- Clique em `Keep current selection` para manter a configuração existente

### Passo 9: Configurar Canais de Comunicação

O assistente listará todos os plug-ins de canais de comunicação disponíveis:

```bash
? Select channels to enable
  ✓ whatsapp       WhatsApp (Baileys Web Client)
  ✓ telegram       Telegram (Bot Token)
  ✓ slack          Slack (Bot Token + App Token)
  ✓ discord        Discord (Bot Token)
  ✓ googlechat     Google Chat (OAuth)
  (Press Space to select, Enter to confirm)
```

**Ação**:
- Use as teclas de seta para navegar
- Pressione **Barra de Espaço** para alternar o estado selecionado
- Pressione **Enter** para confirmar a seleção

::: tip Otimização do modo QuickStart
No modo QuickStart, o assistente selecionará automaticamente canais que suportam ativação rápida (como WebChat) e pulará a configuração de política DM, usando valores padrão seguros (modo de emparelhamento).
:::

Após selecionar os canais, o assistente perguntará sobre a configuração de cada canal individualmente:

#### Configuração WhatsApp

```bash
? Configure WhatsApp
  Link new account     Open QR code in browser
  Skip
```

**Ação**:
- Selecione `Link new account`
- O assistente exibirá um código QR
- Use o WhatsApp para escanear o código QR para login
- Após login bem-sucedido, os dados da sessão são salvos em `~/.clawdbot/credentials/`

#### Configuração Telegram

```bash
? Configure Telegram
  Bot Token
  Skip
```

**Ação**:
- Selecione `Bot Token`
- Insira o Bot Token obtido de @BotFather
- O assistente testará se a conexão foi bem-sucedida

::: tip Obtenção de Bot Token
1. Pesquise @BotFather no Telegram
2. Envie `/newbot` para criar um novo bot
3. Defina o nome e o nome de usuário do bot conforme solicitado
4. Copie o Bot Token gerado
:::

#### Configuração Slack

```bash
? Configure Slack
  App Token         xapp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Bot Token         xoxb-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Signing Secret   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Skip
```

**Explicação**:
Slack precisa de três credenciais, obtidas das configurações do Slack App:
- **App Token**: Token de nível Workspace
- **Bot Token**: Token OAuth do usuário Bot
- **Signing Secret**: Usado para verificar a assinatura das solicitações

::: tip Criação de Slack App
1. Visite https://api.slack.com/apps
2. Crie um novo App
3. Na página Basic Information, obtenha o Signing Secret
4. Na página OAuth & Permissions, instale o App no Workspace
5. Obtenha o Bot Token e App Token
:::

### Passo 10: Configurar Habilidades (opcional)

O assistente perguntará se deseja instalar habilidades:

```bash
? Install skills? (Y/n)
```

**Recomendação**:
- Selecione `Y` para instalar habilidades recomendadas (como gerenciador de pacotes bird, sherpa-onnx-tts TTS local)
- Selecione `n` para pular, posteriormente pode gerenciar através do comando `clawdbot skills`

Se optar por instalar, o assistente listará as habilidades disponíveis:

```bash
? Select skills to install
  ✓ bird           macOS Homebrew package installation
  ✓ sherpa-onnx-tts  Local TTS engine (privacy-first)
  (Press Space to select, Enter to confirm)
```

### Passo 11: Concluir Configuração

O assistente resumirá todas as configurações e gravará no arquivo de configuração:

```bash
✓ Writing config to ~/.clawdbot/clawdbot.json
✓ Workspace initialized at ~/clawd
✓ Channels configured: whatsapp, telegram, slack
✓ Skills installed: bird, sherpa-onnx-tts

────────────────────────────────────────────────────

Configuration complete!

Next steps:
  1. Start Gateway:
     clawdbot gateway --daemon

  2. Test connection:
     clawdbot message send --to +1234567890 --message "Hello!"

  3. Manage configuration:
     clawdbot configure

Docs: https://docs.clawd.bot/start/onboarding
────────────────────────────────────────────────────
```

## Ponto de Verificação ✅

Após concluir o assistente, confirme o seguinte:

- [ ] Arquivo de configuração criado: `~/.clawdbot/clawdbot.json`
- [ ] Espaço de trabalho inicializado: diretório `~/clawd/` existe
- [ ] Credenciais de modelo de IA salvas: verifique `~/.clawdbot/credentials/`
- [ ] Canais configurados: veja o nó `channels` em `clawdbot.json`
- [ ] Habilidades instaladas (se selecionado): veja o nó `skills` em `clawdbot.json`

**Comandos de verificação**:

## Ver resumo da configuração
```bash
clawdbot doctor
```

## Ver status do Gateway
```bash
clawdbot gateway status
```

## Ver canais disponíveis
```bash
clawdbot channels list
```

## Avisos de Erros Comuns

### Erro Comum 1: Porta Ocupada

**Mensagem de erro**:
```
Error: Port 18789 is already in use
```

**Solução**:
1. Encontre o processo ocupando: `lsof -i :18789` (macOS/Linux) ou `netstat -ano | findstr 18789` (Windows)
2. Pare o processo conflitante ou use outra porta

### Erro Comum 2: Falha no Processo OAuth

**Mensagem de erro**:
```
Error: OAuth exchange failed
```

**Possíveis causas**:
- Problemas de rede impedindo o acesso aos servidores Anthropic
- Código OAuth expirado ou formato incorreto
- Navegador bloqueado impedindo abertura

**Solução**:
1. Verifique a conexão de rede
2. Execute novamente `clawdbot onboard` para tentar OAuth novamente
3. Ou use o método API Key

### Erro Comum 3: Falha na Configuração de Canal

**Mensagem de erro**:
```
Error: WhatsApp authentication failed
```

**Possíveis causas**:
- Código QR expirou
- Conta restrita pelo WhatsApp
- Dependências não instaladas (como signal-cli)

**Solução**:
1. WhatsApp: Escaneie o código QR novamente
2. Signal: Certifique-se de que signal-cli está instalado (veja documentação específica do canal)
3. Bot Token: Confirme que o formato do token está correto e não expirou

### Erro Comum 4: Falha na Configuração Tailscale

**Mensagem de erro**:
```
Error: Tailscale binary not found in PATH or /Applications.
```

**Solução**:
1. Instale Tailscale: https://tailscale.com/download/mac
2. Certifique-se de que está no PATH ou instalado em `/Applications`
3. Ou pule a configuração Tailscale, configure manualmente depois

### Erro Comum 5: Erro de Formato de Arquivo de Configuração

**Mensagem de erro**:
```
Error: Invalid config at ~/.clawdbot/clawdbot.json
```

**Solução**:
```bash
# Reparar configuração
clawdbot doctor

# Ou redefinir configuração
clawdbot onboard --mode reset
```

---

## Resumo da Lição

A configuração assistida é a forma recomendada de configurar o Clawdbot, guiando você através de todas as configurações necessárias com perguntas interativas:

**Revisão dos pontos principais**:
- ✅ Suporta dois modos **QuickStart** e **Manual**
- ✅ Aviso de segurança alerta sobre riscos potenciais
- ✅ Detecta automaticamente configurações existentes, pode manter/modificar/redefinir
- ✅ Suporta o processo **Anthropic setup-token** (recomendado) e método API Key
- ✅ Suporta ambiente de múltiplos arquivos de configuração **CLAWDBOT_PROFILE**
- ✅ Configura automaticamente canais e habilidades
- ✅ Gera valores padrão seguros (vinculação loopback, autenticação por token)

**Fluxo de trabalho recomendado**:
1. Primeiro uso: `clawdbot onboard --install-daemon`
2. Modificar configuração: `clawdbot configure`
3. Solução de problemas: `clawdbot doctor`
4. Acesso remoto: Configure Tailscale Serve/Funnel

**Próximos passos**:
- [Iniciar o Gateway](../gateway-startup/): Deixe o Gateway executar em segundo plano
- [Enviar a primeira mensagem](../first-message/): Comece a conversar com o assistente de IA
- [Entender emparelhamento DM](../pairing-approval/): Controle de segurança para remetentes desconhecidos

---

## Próxima Lição

> Na próxima lição, aprenderemos **[Iniciar o Gateway](../gateway-startup/)**.
>
> Você aprenderá:
> - Como iniciar o daemon Gateway
> - Diferença entre modo de desenvolvimento e modo de produção
> - Como monitorar o status do Gateway
> - Usar launchd/systemd para iniciar automaticamente

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade           | Caminho do Arquivo                                                                                                  | Número de Linha      |
|--- | --- | ---|
| Fluxo principal do assistente     | [`src/wizard/onboarding.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.ts) | 87-452    |
| Confirmação de aviso de segurança   | [`src/wizard/onboarding.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.ts) | 46-85     |
| Configuração do Gateway   | [`src/wizard/onboarding.gateway-config.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.gateway-config.ts) | 28-249    |
| Definição de interface do assistente   | [`src/wizard/prompts.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/prompts.ts) | 36-52     |
| Configuração de canais     | [`src/commands/onboard-channels.ts`](https://github.com/moltbot/moltbot/blob/main/src/commands/onboard-channels.ts) | -         |
| Configuração de habilidades     | [`src/commands/onboard-skills.ts`](https://github.com/moltbot/moltbot/blob/main/src/commands/onboard-skills.ts) | -         |
| Definição de tipos do assistente   | [`src/wizard/onboarding.types.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.types.ts) | 1-26      |
| Schema do arquivo de configuração | [`src/config/zod-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.ts) | -         |

**Tipos principais**:
- `WizardFlow`: `"quickstart" | "advanced"` - Tipo de modo do assistente
- `QuickstartGatewayDefaults`: Configuração padrão do Gateway no modo QuickStart
- `GatewayWizardSettings`: Configurações do Gateway
- `WizardPrompter`: Interface de interação do assistente

**Funções principais**:
- `runOnboardingWizard()`: Fluxo principal do assistente
- `configureGatewayForOnboarding()`: Configurar rede e autenticação do Gateway
- `requireRiskAcknowledgement()`: Exibir e confirmar aviso de segurança

**Valores de configuração padrão** (modo QuickStart):
- Porta do Gateway: 18789
- Endereço de vinculação: loopback (127.0.0.1)
- Método de autenticação: token (gera automaticamente token aleatório)
- Tailscale: off
- Espaço de trabalho: `~/clawd`

**Localização dos arquivos de configuração**:
- Configuração principal: `~/.clawdbot/clawdbot.json`
- Credenciais OAuth: `~/.clawdbot/credentials/oauth.json`
- Credenciais de API Key: `~/.clawdbot/credentials/`
- Dados de sessão: `~/clawd/sessions.json`

</details>
