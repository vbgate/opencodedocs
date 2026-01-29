---
title: "Configuração e Uso do Canal LINE | Tutorial Clawdbot"
sidebarTitle: "Usar AI no LINE"
subtitle: "Guia de Configuração e Uso do Canal LINE"
description: "Aprenda como configurar e usar o canal LINE no Clawdbot. Este tutorial cobre integração com LINE Messaging API, configuração de Webhook, controle de acesso, mensagens rich media (modelos Flex, respostas rápidas, Rich Menu) e técnicas de solução de problemas comuns."
tags:
  - "LINE"
  - "Messaging API"
  - "Configuração de Canal"
prerequisite:
  - "start-gateway-startup"
order: 140
---

# Configuração e Uso do Canal LINE

## O Que Você Vai Aprender

Após completar este tutorial, você será capaz de:

- ✅ Criar um canal LINE Messaging API e obter credenciais
- ✅ Configurar o plugin LINE do Clawdbot e Webhook
- ✅ Configurar pareamento DM, controle de acesso de grupo e limites de mídia
- ✅ Enviar mensagens rich media (cards Flex, respostas rápidas, informações de localização)
- ✅ Solucionar problemas comuns do canal LINE

## Seu Problema Atual

Você pode estar pensando:

- "Quero conversar com o assistente de IA pelo LINE, como integrar?"
- "Como configurar o Webhook do LINE Messaging API?"
- "O LINE suporta mensagens Flex e respostas rápidas?"
- "Como controlar quem pode acessar meu assistente de IA pelo LINE?"

A boa notícia é: **O Clawdbot oferece um plugin LINE completo que suporta todos os recursos principais do Messaging API**.

## Quando Usar Esta Solução

Quando você precisa:

- 📱 **Conversar com o assistente de IA** no LINE
- 🎨 **Usar mensagens rich media** (cards Flex, respostas rápidas, Rich Menu)
- 🔒 **Controlar permissões de acesso** (pareamento DM, lista de permissões de grupo)
- 🌐 **Integrar o LINE** aos fluxos de trabalho existentes

## Ideia Central

O canal LINE se integra através do **LINE Messaging API**, usando Webhook para receber eventos e enviar mensagens.

```
Usuário LINE
    │
    ▼ (enviar mensagem)
┌──────────────────┐
│  LINE Platform  │
│  (Messaging API)│
└────────┬─────────┘
         │ (Webhook POST)
         ▼
┌──────────────────┐
│  Clawdbot       │
│  Gateway        │
│  /line/webhook   │
└────────┬─────────┘
         │ (chamar AI)
         ▼
    ┌────────┐
    │ Agent  │
    └───┬────┘
        │ (resposta)
        ▼
    Usuário LINE
```

**Conceitos Chave**:

| Conceito | Função |
|--- | ---|
| **Channel Access Token** | Token de autenticação para enviar mensagens |
| **Channel Secret** | Chave secreta para verificar assinatura de Webhook |
| **Webhook URL** | Endpoint onde o Clawdbot recebe eventos do LINE (deve ser HTTPS) |
| **DM Policy** | Política de acesso para remetentes desconhecidos (pairing/allowlist/open/disabled) |
| **Rich Menu** | Menu fixo do LINE, usuários podem clicar para acionar ações rapidamente |

## 🎒 Preparativos Antes de Começar

### Contas e Ferramentas Necessárias

| Item | Requisito | Como Obter |
|--- | --- | ---|
| **Conta LINE Developers** | Registro gratuito | https://developers.line.biz/console/ |
| **LINE Provider** | Criar Provider e canal Messaging API | LINE Console |
| **Servidor HTTPS** | Webhook deve ser HTTPS | ngrok, Cloudflare Tunnel, Tailscale Serve/Funnel |

::: tip Método Recomendado de Exposição
Se você está desenvolvendo localmente, pode usar:
- **ngrok**: `ngrok http 18789`
- **Tailscale Funnel**: `gateway.tailscale.mode = "funnel"`
- **Cloudflare Tunnel**: Gratuito e estável
:::

## Siga os Passos

### Passo 1: Instalar o Plugin LINE

**Por Que**
O canal LINE é implementado como plugin, precisa ser instalado primeiro.

```bash
clawdbot plugins install @clawdbot/line
```

**Você Deve Ver**:
```
✓ Installed @clawdbot/line plugin
```

::: tip Desenvolvimento Local
Se você está executando a partir do código fonte, pode usar instalação local:
```bash
clawdbot plugins install ./extensions/line
```
:::

### Passo 2: Criar um Canal LINE Messaging API

**Por Que**
Precisa obter `Channel Access Token` e `Channel Secret` para configurar o Clawdbot.

#### 2.1 Fazer Login no LINE Developers Console

Visite: https://developers.line.biz/console/

#### 2.2 Criar Provider (se ainda não tiver)

1. Clique em "Create new provider"
2. Insira o nome do Provider (ex: `Clawdbot`)
3. Clique em "Create"

#### 2.3 Adicionar Canal Messaging API

1. Abaixo do Provider, clique em "Add channel" → Selecione "Messaging API"
2. Configure as informações do canal:
   - Channel name: `Clawdbot AI Assistant`
   - Channel description: `Personal AI assistant powered by Clawdbot`
   - Category: `Communication`
   - Subcategory: `Bot`
3. Marque "Agree" → Clique em "Create"

#### 2.4 Habilitar Webhook

1. Na página de configuração do canal, encontre a aba "Messaging API"
2. Clique no interruptor "Use webhook" → Defina como ON
3. Copie as seguintes informações:

| Item | Localização | Exemplo |
|--- | --- | ---|
| **Channel Access Token** | Basic settings → Channel access token (long-lived) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Channel Secret** | Basic settings → Channel secret | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7` |

::: warning Salve as Credenciais com Cuidado!
Channel Access Token e Channel Secret são informações sensíveis. Guarde-as com cuidado e não as compartilhe em repositórios públicos.
:::

### Passo 3: Configurar o Canal LINE do Clawdbot

**Por Que**
Configurar o Gateway para usar o LINE Messaging API para enviar e receber mensagens.

#### Método A: Configurar via Linha de Comando

```bash
clawdbot configure
```

O assistente perguntará:
- Se deseja habilitar o canal LINE
- Channel Access Token
- Channel Secret
- Política DM (padrão `pairing`)

#### Método B: Editar Diretamente o Arquivo de Configuração

Edite `~/.clawdbot/clawdbot.json`:

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
      channelSecret: "YOUR_CHANNEL_SECRET",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    }
  }
}
```

::: tip Usar Variáveis de Ambiente
Você também pode configurar via variáveis de ambiente (aplicável apenas à conta padrão):
```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_token_here"
export LINE_CHANNEL_SECRET="your_secret_here"
```
:::

#### Método C: Usar Arquivo para Armazenar Credenciais

Uma maneira mais segura é armazenar as credenciais em arquivos separados:

```json5
{
  channels: {
    line: {
      enabled: true,
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
      dmPolicy: "pairing"
    }
  }
}
```

### Passo 4: Configurar o Webhook URL

**Por Que**
O LINE precisa do Webhook URL para enviar eventos de mensagens ao Clawdbot.

#### 4.1 Garantir que seu Gateway esteja Acessível da Internet

Se você está desenvolvendo localmente, precisa usar um serviço de túnel:

```bash
# Usar ngrok
ngrok http 18789

# A saída mostrará a URL HTTPS, ex:
# Forwarding: https://abc123.ngrok.io -> http://localhost:18789
```

#### 4.2 Configurar Webhook URL no LINE Console

1. Na página de configuração do Messaging API, encontre "Webhook settings"
2. Insira o Webhook URL:
   ```
   https://your-gateway-host/line/webhook
   ```
   - Caminho padrão: `/line/webhook`
   - Pode ser personalizado via `channels.line.webhookPath`
3. Clique em "Verify" → Confirme que o LINE pode acessar seu Gateway

**Você Deve Ver**:
```
✓ Webhook URL verification succeeded
```

#### 4.3 Habilitar Tipos de Eventos Necessários

No Webhook settings, marque os seguintes eventos:

| Evento | Uso |
|--- | ---|
| **Message event** | Receber mensagens enviadas por usuários |
| **Follow event** | Usuários adicionam o Bot como amigo |
| **Unfollow event** | Usuários removem o Bot |
| **Join event** | Bot entra em um grupo |
| **Leave event** | Bot sai de um grupo |
| **Postback event** | Respostas rápidas e cliques de botão |

### Passo 5: Iniciar o Gateway

**Por Que**
O Gateway precisa estar rodando para receber eventos do Webhook do LINE.

```bash
clawdbot gateway --verbose
```

**Você Deve Ver**:
```
✓ Gateway listening on ws://127.0.0.1:18789
✓ LINE webhook server started on /line/webhook
✓ LINE plugin initialized
```

### Passo 6: Testar o Canal LINE

**Por Que**
Verificar se a configuração está correta e se o assistente de IA está respondendo normalmente.

#### 6.1 Adicionar o Bot como Amigo

1. No LINE Console → Messaging API → Channel settings
2. Copie o "Basic ID" ou "QR Code"
3. No LINE App, pesquise ou escaneie o QR Code, adicione o Bot como amigo

#### 6.2 Enviar Mensagem de Teste

Envie uma mensagem ao Bot no LINE:
```
Olá, por favor resuma o clima de hoje.
```

**Você Deve Ver**:
- Bot exibe status "typing" (se indicators de typing foram configurados)
- Assistente de IA retorna resposta em streaming
- Mensagem exibida corretamente no LINE

### Passo 7: Verificar Pareamento DM (Opcional)

**Por Que**
Se estiver usando o padrão `dmPolicy="pairing"`, remetentes desconhecidos precisam ser aprovados primeiro.

#### Listar Solicitações de Pareamento Pendentes

```bash
clawdbot pairing list line
```

**Você Deve Ver**:
```
Pending pairing requests for LINE:
  CODE: ABC123 - User ID: U1234567890abcdef1234567890ab
```

#### Aprovar Solicitação de Pareamento

```bash
clawdbot pairing approve line ABC123
```

**Você Deve Ver**:
```
✓ Approved pairing request for LINE user U1234567890abcdef1234567890ab
```

::: info Explicação da Política DM
- `pairing` (padrão): Remetentes desconhecidos recebem código de pareamento, mensagens são ignoradas até aprovação
- `allowlist`: Apenas usuários na lista de permissões podem enviar mensagens
- `open`: Qualquer um pode enviar mensagens (use com cautela)
- `disabled`: Desabilita mensagens privadas
:::

## Ponto de Verificação ✅

Verifique se sua configuração está correta:

| Item | Método de Verificação | Resultado Esperado |
|--- | --- | ---|
| **Plugin Instalado** | `clawdbot plugins list` | Ver `@clawdbot/line` |
| **Configuração Válida** | `clawdbot doctor` | Sem erros relacionados ao LINE |
| **Webhook Acessível** | Verificação no LINE Console | `✓ Verification succeeded` |
| **Bot Acessível** | Adicionar amigo no LINE e enviar mensagem | Assistente de IA responde normalmente |
| **Mecanismo de Pareamento** | Enviar DM com novo usuário | Receber código de pareamento (se usando política pairing) |

## Armadilhas Comuns

### Problema Comum 1: Falha na Verificação do Webhook

**Sintoma**:
```
Webhook URL verification failed
```

**Causas**:
- Webhook URL não é HTTPS
- Gateway não está rodando ou porta incorreta
- Firewall bloqueando conexões de entrada

**Solução**:
1. Garanta o uso de HTTPS: `https://your-gateway-host/line/webhook`
2. Verifique se o Gateway está rodando: `clawdbot gateway status`
3. Verifique a porta: `netstat -an | grep 18789`
4. Use serviço de túnel (ngrok/Tailscale/Cloudflare)

### Problema Comum 2: Não é Possível Receber Mensagens

**Sintoma**:
- Verificação do Webhook bem-sucedida
- Mas enviar mensagem ao Bot não há resposta

**Causas**:
- Caminho do Webhook configurado incorretamente
- Tipo de evento não habilitado
- `channelSecret` no arquivo de configuração não corresponde

**Solução**:
1. Verifique se `channels.line.webhookPath` é consistente com o LINE Console
2. Garanta que "Message event" esteja habilitado no LINE Console
3. Verifique se `channelSecret` foi copiado corretamente (sem espaços extras)

### Problema Comum 3: Falha no Download de Mídia

**Sintoma**:
```
Error downloading LINE media: size limit exceeded
```

**Causas**:
- Arquivo de mídia excede o limite padrão (10MB)

**Solução**:
Aumente o limite na configuração:
```json5
{
  channels: {
    line: {
      mediaMaxMb: 25  // Limite oficial do LINE 25MB
    }
  }
}
```

### Problema Comum 4: Sem Resposta em Mensagens de Grupo

**Sintoma**:
- DM funciona normalmente
- Enviar mensagem em grupo sem resposta

**Causas**:
- Padrão `groupPolicy="allowlist"`, grupo não está na lista de permissões
- Não mencionou o Bot no grupo

**Solução**:
1. Adicione o ID do grupo à lista de permissões na configuração:
```json5
{
  channels: {
    line: {
      groupAllowFrom: ["C1234567890abcdef1234567890ab"]
    }
  }
}
```

2. Ou @mencionar o Bot no grupo: `@Clawdbot me ajude com esta tarefa`

## Recursos Avançados

### Mensagens Rich Media (Modelos Flex e Respostas Rápidas)

O Clawdbot suporta mensagens rich media do LINE, incluindo cards Flex, respostas rápidas, informações de localização, etc.

#### Enviar Respostas Rápidas

```json5
{
  text: "O que posso fazer por você hoje?",
  channelData: {
    line: {
      quickReplies: ["Consultar clima", "Definir lembrete", "Gerar código"]
    }
  }
}
```

#### Enviar Card Flex

```json5
{
  text: "Card de Status",
  channelData: {
    line: {
      flexMessage: {
        altText: "Status do Servidor",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            contents: [
              {
                type: "text",
                text: "CPU: 45%"
              },
              {
                type: "text",
                text: "Memória: 2.1GB"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### Enviar Informações de Localização

```json5
{
  text: "Esta é a localização do meu escritório",
  channelData: {
    line: {
      location: {
        title: "Office",
        address: "123 Main St, San Francisco",
        latitude: 37.7749,
        longitude: -122.4194
      }
    }
  }
}
```

### Rich Menu (Menu Fixo)

Rich Menu é um menu fixo do LINE, usuários podem clicar para acionar ações rapidamente.

```bash
# Criar Rich Menu
clawdbot line rich-menu create

# Fazer upload da imagem do menu
clawdbot line rich-menu upload --image /path/to/menu.png

# Definir como menu padrão
clawdbot line rich-menu set-default --rich-menu-id <MENU_ID>
```

::: info Limitações do Rich Menu
- Dimensões da imagem: 2500x1686 ou 2500x843 pixels
- Formato da imagem: PNG ou JPEG
- Máximo 10 itens de menu
:::

### Conversão de Markdown

O Clawdbot converte automaticamente o formato Markdown para o formato suportado pelo LINE:

| Markdown | Resultado da Conversão LINE |
|--- | ---|
| Blocos de código | Card Flex |
| Tabelas | Card Flex |
| Links | Detectado automaticamente e convertido para Card Flex |
| Negrito/Itálico | Removidos (LINE não suporta) |

::: tip Preservar Formato
O LINE não suporta formato Markdown, o Clawdbot tentará converter para cards Flex. Se você deseja texto puro, pode desabilitar a conversão automática na configuração.
:::

## Resumo da Aula

Este tutorial cobriu:

1. ✅ Instalar plugin LINE
2. ✅ Criar canal LINE Messaging API
3. ✅ Configurar Webhook e credenciais
4. ✅ Configurar controle de acesso (pareamento DM, lista de permissões de grupo)
5. ✅ Enviar mensagens rich media (Flex, respostas rápidas, localização)
6. ✅ Usar Rich Menu
7. ✅ Solucionar problemas comuns

O canal LINE oferece tipos de mensagens ricos e métodos de interação, muito adequado para construir experiências personalizadas de assistente de IA no LINE.

---

## Próxima Aula

> Na próxima aula, aprenderemos a **[Interface WebChat](../webchat/)**.
>
> Você aprenderá:
> - Como acessar a interface WebChat através do navegador
> - Recursos principais do WebChat (gerenciamento de sessões, upload de anexos, suporte Markdown)
> - Configurar acesso remoto (túnel SSH, Tailscale)
> - Entender as diferenças entre WebChat e outros canais

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-27

| Recurso | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Implementação principal do LINE Bot | [`src/line/bot.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot.ts) | 27-83 |
| Definição de Schema de Configuração | [`src/line/config-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/config-schema.ts) | 1-54 |
| Manipulador de Eventos Webhook | [`src/line/bot-handlers.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot-handlers.ts) | 1-100 |
| Função de Envio de Mensagens | [`src/line/send.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/send.ts) | - |
| Geração de Modelos Flex | [`src/line/flex-templates.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/flex-templates.ts) | - |
| Operações do Rich Menu | [`src/line/rich-menu.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/rich-menu.ts) | - |
| Mensagens de Template | [`src/line/template-messages.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/template-messages.ts) | - |
| Converter Markdown para LINE | [`src/line/markdown-to-line.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/markdown-to-line.ts) | - |
| Servidor Webhook | [`src/line/webhook.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/webhook.ts) | - |

**Campos de Configuração Principais**:
- `channelAccessToken`: LINE Channel Access Token (`config-schema.ts:19`)
- `channelSecret`: LINE Channel Secret (`config-schema.ts:20`)
- `dmPolicy`: Política de acesso DM (`config-schema.ts:26`)
- `groupPolicy`: Política de acesso de grupo (`config-schema.ts:27`)
- `mediaMaxMb`: Limite de tamanho de mídia (`config-schema.ts:28`)
- `webhookPath`: Caminho personalizado do Webhook (`config-schema.ts:29`)

**Funções Principais**:
- `createLineBot()`: Criar instância do LINE Bot (`bot.ts:27`)
- `handleLineWebhookEvents()`: Manipular eventos do Webhook do LINE (`bot-handlers.ts:100`)
- `sendMessageLine()`: Enviar mensagem LINE (`send.ts`)
- `createFlexMessage()`: Criar mensagem Flex (`send.ts:20`)
- `createQuickReplyItems()`: Criar respostas rápidas (`send.ts:21`)

**Políticas DM Suportadas**:
- `open`: Acesso aberto
- `allowlist`: Modo lista de permissões
- `pairing`: Modo pareamento (padrão)
- `disabled`: Desabilitado

**Políticas de Grupo Suportadas**:
- `open`: Acesso aberto
- `allowlist`: Modo lista de permissões (padrão)
- `disabled`: Desabilitado

</details>
