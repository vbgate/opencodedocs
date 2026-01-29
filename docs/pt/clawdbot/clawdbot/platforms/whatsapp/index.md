---
title: "Guia Completo de Configuração do Canal WhatsApp | Tutorial Clawdbot"
sidebarTitle: "Conectar ao WhatsApp em 5 Minutos"
subtitle: "Guia Completo de Configuração do Canal WhatsApp"
description: "Aprenda como configurar e usar o canal WhatsApp no Clawdbot (baseado em Baileys), incluindo login por QR code, gerenciamento de múltiplas contas, controle de acesso DM e suporte a grupos."
tags:
  - "whatsapp"
  - "configuração-de-canal"
  - "baileys"
  - "login-qr"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 70
---

# Guia Completo de Configuração do Canal WhatsApp

## O Que Você Vai Aprender

- Conectar contas WhatsApp ao Clawdbot através de QR code
- Configurar suporte para múltiplas contas WhatsApp
- Configurar controle de acesso DM (emparelhamento/whitelist/aberto)
- Habilitar e gerenciar suporte a grupos WhatsApp
- Configurar confirmação automática de mensagens e recibos de leitura

## O Seu Desafio Atual

O WhatsApp é a sua plataforma de mensagens mais usada, mas seu assistente de IA ainda não pode receber mensagens do WhatsApp. Você quer:

- Conversar diretamente com a IA no WhatsApp, sem trocar de aplicativos
- Controlar quem pode enviar mensagens ao seu assistente de IA
- Suportar múltiplas contas WhatsApp (trabalho/pessoal separados)

## Quando Usar Esta Abordagem

- Você precisa integrar um assistente de IA no WhatsApp
- Você precisa separar contas WhatsApp de trabalho/pessoal
- Você quer controlar precisamente quem pode enviar mensagens para a IA

::: info O que é Baileys?

O Baileys é uma biblioteca WhatsApp Web que permite que programas enviem e recebam mensagens através do protocolo WhatsApp Web. O Clawdbot usa Baileys para conectar ao WhatsApp, sem precisar da API do WhatsApp Business, sendo mais privado e flexível.

:::

## 🎒 Preparação

Antes de configurar o canal WhatsApp, confirme:

- [ ] Clawdbot Gateway instalado e em execução
- [ ] Concluiu o [Início Rápido](../../start/getting-started/)
- [ ] Tem um número de telefone disponível (recomendado número secundário)
- [ ] O celular com WhatsApp tem acesso à internet (para escanear o QR code)

::: warning Observações Importantes

- **Recomendado usar número dedicado**: SIM separado ou celular antigo, para evitar interferências no uso pessoal
- **Evite números virtuais**: TextNow, Google Voice e outros números virtuais serão bloqueados pelo WhatsApp
- **Runtime Node**: WhatsApp e Telegram são instáveis no Bun, use Node ≥22

:::

## Conceito Central

A arquitetura central do canal WhatsApp:

```
Seu celular WhatsApp ←--(QR code)--> Baileys ←--→ Clawdbot Gateway
                                                       ↓
                                                  AI Agent
                                                       ↓
                                                  Responder mensagem
```

**Conceitos-chave**:

1. **Sessão Baileys**: Conexão estabelecida através de Linked Devices do WhatsApp
2. **Política DM**: Controla quem pode enviar mensagens privadas para a IA
3. **Suporte a múltiplas contas**: Um Gateway gerencia múltiplas contas WhatsApp
4. **Confirmação de mensagens**: Envia automaticamente emojis/recibos de leitura para melhorar a experiência do usuário

## Siga os Passos

### Passo 1: Configurar Definições Básicas

**Por quê**
Configurar políticas de controle de acesso do WhatsApp para proteger seu assistente de IA contra uso indevido.

Edite `~/.clawdbot/clawdbot.json`, adicione a configuração do WhatsApp:

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "allowFrom": ["+15551234567"]
    }
  }
}
```

**Descrição dos campos**:

| Campo | Tipo | Padrão | Descrição |
|------|------|--------|------|
| `dmPolicy` | string | `"pairing"` | Política de acesso DM: `pairing` (emparelhamento), `allowlist` (whitelist), `open` (aberto), `disabled` (desativado) |
| `allowFrom` | string[] | `[]` | Lista de números de telefone de remetentes permitidos (formato E.164, como `+15551234567`) |

**Comparação de políticas DM**:

| Política | Comportamento | Cenário de uso |
|--------|------|----------|
| `pairing` | Remetentes desconhecidos recebem código de emparelhamento, precisa aprovação manual | **Recomendado**, equilibra segurança e conveniência |
| `allowlist` | Apenas números na lista `allowFrom` podem enviar | Controle estrito, usuários conhecidos |
| `open` | Qualquer pessoa pode enviar (precisa `allowFrom` conter `"*"`) | Testes públicos ou serviços comunitários |
| `disabled` | Ignora todas as mensagens WhatsApp | Desativar temporariamente o canal |

**Você deve ver**: Arquivo de configuração salvo com sucesso, sem erros de formato JSON.

### Passo 2: Fazer Login no WhatsApp

**Por quê**
Conectar a conta WhatsApp ao Clawdbot através de QR code, Baileys mantém o estado da sessão.

No terminal execute:

```bash
clawdbot channels login whatsapp
```

**Login com múltiplas contas**:

Login em conta específica:

```bash
clawdbot channels login whatsapp --account work
```

Login na conta padrão:

```bash
clawdbot channels login whatsapp
```

**Passos**:

1. O terminal exibirá o QR code (ou na interface CLI)
2. Abra o aplicativo WhatsApp no celular
3. Acesse **Settings → Linked Devices**
4. Clique em **Link a Device**
5. Escaneie o QR code exibido no terminal

**Você deve ver**:

```
✓ WhatsApp linked successfully!
Credentials stored: ~/.clawdbot/credentials/whatsapp/default/creds.json
```

::: tip Armazenamento de Credenciais

As credenciais de login do WhatsApp são salvas em `~/.clawdbot/credentials/whatsapp/<accountId>/creds.json`. Após o primeiro login, as sessões subsequentes serão restauradas automaticamente, sem precisar escanear o QR code novamente.

:::

### Passo 3: Iniciar o Gateway

**Por quê**
Iniciar o Gateway para o canal WhatsApp começar a receber e enviar mensagens.

```bash
clawdbot gateway
```

Ou use o modo daemon:

```bash
clawdbot gateway start
```

**Você deve ver**:

```
[WhatsApp] Connected to WhatsApp Web
[WhatsApp] Default account linked: +15551234567
Gateway listening on ws://127.0.0.1:18789
```

### Passo 4: Enviar Mensagem de Teste

**Por quê**
Verificar se a configuração do canal WhatsApp está correta, consegue enviar e receber mensagens normalmente.

Do seu celular WhatsApp, envie uma mensagem para o número conectado:

```
Olá
```

**Você deve ver**:
- Terminal exibe logs de mensagens recebidas
- WhatsApp recebe resposta da IA

**Checkpoint ✅**

- [ ] Logs do Gateway mostram `[WhatsApp] Received message from +15551234567`
- [ ] WhatsApp recebe resposta da IA
- [ ] Conteúdo da resposta é relevante para sua entrada

### Passo 5: Configurar Opções Avançadas (Opcional)

#### Habilitar Confirmação Automática de Mensagens

Adicione em `clawdbot.json`:

```json
{
  "channels": {
    "whatsapp": {
      "ackReaction": {
        "emoji": "👀",
        "direct": true,
        "group": "mentions"
      }
    }
  }
}
```

**Descrição dos campos**:

| Campo | Tipo | Padrão | Descrição |
|------|------|--------|------|
| `emoji` | string | - | Emoji de confirmação (como `"👀"`, `"✅"`), string vazia significa desativado |
| `direct` | boolean | `true` | Se envia confirmação em chat privado |
| `group` | string | `"mentions"` | Comportamento em grupo: `"always"` (todas mensagens), `"mentions"` (apenas menções @), `"never"` (nunca) |

#### Configurar Recibos de Leitura

Por padrão, Clawdbot marca mensagens como lidas automaticamente (check azul). Para desativar:

```json
{
  "channels": {
    "whatsapp": {
      "sendReadReceipts": false
    }
  }
}
```

#### Ajustar Limites de Mensagens

```json
{
  "channels": {
    "whatsapp": {
      "textChunkLimit": 4000,
      "mediaMaxMb": 50,
      "chunkMode": "length"
    }
  }
}
```

| Campo | Padrão | Descrição |
|------|--------|------|
| `textChunkLimit` | 4000 | Número máximo de caracteres por mensagem de texto |
| `mediaMaxMb` | 50 | Tamanho máximo de arquivos de mídia recebidos (MB) |
| `chunkMode` | `"length"` | Modo de chunk: `"length"` (por comprimento), `"newline"` (por parágrafo) |

**Você deve ver**: Após a configuração entrar em vigor, mensagens longas são divididas automaticamente, tamanho de arquivos de mídia é controlado.
## Problemas Comuns

### Problema 1: Falha ao Escanear QR Code

**Sintoma**: Após escanear o QR code, o terminal mostra falha de conexão ou timeout.

**Causa**: Problema de conexão de rede ou instabilidade do serviço WhatsApp.

**Solução**:

1. Verifique a conexão de rede do celular
2. Certifique-se de que o servidor Gateway tem acesso à internet
3. Faça logout e login novamente:
   ```bash
   clawdbot channels logout whatsapp
   clawdbot channels login whatsapp
   ```

### Problema 2: Mensagens Não Entregues ou Atrasadas

**Sintoma**: Após enviar mensagem, demora muito para receber resposta.

**Causa**: Gateway não está rodando ou conexão WhatsApp foi perdida.

**Solução**:

1. Verifique status do Gateway: `clawdbot gateway status`
2. Reinicie o Gateway: `clawdbot gateway restart`
3. Veja logs: `clawdbot logs --follow`

### Problema 3: Código de Emparelhamento Não Recebido

**Sintoma**: Após desconhecidos enviarem mensagem, não recebe código de emparelhamento.

**Causa**: `dmPolicy` não está configurado como `pairing`.

**Solução**:

Verifique configuração de `dmPolicy` em `clawdbot.json`:

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing"  // ← Certifique-se que é "pairing"
    }
  }
}
```

### Problema 4: Problemas com Runtime Bun

**Sintoma**: WhatsApp e Telegram desconectam frequentemente ou falham no login.

**Causa**: Baileys e Telegram SDK são instáveis no Bun.

**Solução**:

Use Node ≥22 para rodar o Gateway:

Verifique runtime atual:

```bash
node --version
```

Se precisar mudar, use Node para rodar o Gateway:

```bash
clawdbot gateway --runtime node
```

::: tip Runtime Recomendado

Canais WhatsApp e Telegram recomendam fortemente usar runtime Node, Bun pode causar instabilidade na conexão.

:::
## Resumo da Lição

Pontos-chave da configuração do canal WhatsApp:

1. **Configuração básica**: `dmPolicy` + `allowFrom` controlam o acesso
2. **Fluxo de login**: `clawdbot channels login whatsapp` escanear QR code
3. **Múltiplas contas**: Use parâmetro `--account` para gerenciar múltiplas contas WhatsApp
4. **Opções avançadas**: Confirmação automática de mensagens, recibos de leitura, limites de mensagens
5. **Solução de problemas**: Verifique status do Gateway, logs e runtime

## Próxima Lição

> Na próxima lição vamos aprender a configuração do **[Canal Telegram](../telegram/)**.
>
> Você vai aprender:
> - Usar Bot Token para configurar Telegram Bot
> - Configurar comandos e consultas inline
> - Gerenciar políticas de segurança específicas do Telegram
---

## Apêndice: Referência de Código-fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linhas |
|------|----------|------|
| Definições de tipo de configuração WhatsApp | [`src/config/types.whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.whatsapp.ts) | 1-160 |
| Schema de configuração WhatsApp | [`src/config/zod-schema.providers-whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-whatsapp.ts) | 13-100 |
| Configuração de onboarding WhatsApp | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 1-341 |
| Documentação WhatsApp | [`docs/channels/whatsapp.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/whatsapp.md) | 1-363 |
| Ferramenta de login WhatsApp | [`src/channels/plugins/agent-tools/whatsapp-login.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/agent-tools/whatsapp-login.ts) | 1-72 |
| Ferramenta WhatsApp Actions | [`src/agents/tools/whatsapp-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/whatsapp-actions.ts) | 1-42 |

**Itens de configuração-chave**:
- `dmPolicy`: Política de acesso DM (`pairing`/`allowlist`/`open`/`disabled`)
- `allowFrom`: Lista de remetentes permitidos (números de telefone formato E.164)
- `ackReaction`: Configuração de confirmação automática de mensagens (`{emoji, direct, group}`)
- `sendReadReceipts`: Se envia recibos de leitura (padrão `true`)
- `textChunkLimit`: Limite de chunk de texto (padrão 4000 caracteres)
- `mediaMaxMb`: Limite de tamanho de arquivo de mídia (padrão 50 MB)

**Funções-chave**:
- `loginWeb()`: Executa login WhatsApp por QR code
- `startWebLoginWithQr()`: Inicia processo de geração de QR code
- `sendReactionWhatsApp()`: Envia reação de emoji WhatsApp
- `handleWhatsAppAction()`: Processa ações específicas do WhatsApp (como reações)

**Constantes-chave**:
- `DEFAULT_ACCOUNT_ID`: ID de conta padrão (`"default"`)
- `creds.json`: Caminho de armazenamento de credenciais de autenticação WhatsApp

</details>
