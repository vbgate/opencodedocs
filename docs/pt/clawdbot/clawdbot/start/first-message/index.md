---
title: "Enviar a Primeira Mensagem: Conversar com IA via WebChat ou Canais | Tutorial Clawdbot"
sidebarTitle: "Conversando com a IA"
subtitle: "Enviar a Primeira Mensagem: Conversar com IA via WebChat ou Canais"
description: "Aprenda a enviar a primeira mensagem para o assistente de IA Clawdbot via WebChat ou canais configurados (WhatsApp/Telegram/Slack/Discord etc.). Este tutorial apresenta três métodos: comandos CLI, acesso ao WebChat e envio de mensagens via canal, incluindo resultados esperados e solução de problemas comuns."
tags:
  - "Primeiros Passos"
  - "WebChat"
  - "Canais"
  - "Mensagem"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 40
---

# Enviar a Primeira Mensagem: Conversar com IA via WebChat ou Canais

## O Que Você Será Capaz de Fazer

Após concluir este tutorial, você será capaz de:

- ✅ Conversar com o assistente de IA via CLI
- ✅ Enviar mensagens usando a interface WebChat
- ✅ Conversar com a IA em canais configurados (WhatsApp, Telegram, Slack, etc.)
- ✅ Entender os resultados esperados e códigos de status de envio de mensagens

## Sua Situação Atual

Você pode ter concluído a instalação e inicialização do Gateway do Clawdbot, mas não sabe como verificar se tudo está funcionando corretamente.

Você pode estar se perguntando:

- "O Gateway iniciou, como confirmar que ele pode responder mensagens?"
- "Além da linha de comando, existe uma interface gráfica que posso usar?"
- "Configurei o WhatsApp/Telegram, como conversar com a IA nessas plataformas?"

A boa notícia é: **O Clawdbot oferece várias maneiras de enviar a primeira mensagem**, sempre haverá uma que se adapta a você.

## Quando Usar Este Guia

Quando você precisar:

- 🧪 **Verificar instalação**: Confirmar que o Gateway e o assistente de IA estão funcionando corretamente
- 🌐 **Testar canais**: Verificar se a conexão dos canais WhatsApp/Telegram/Slack etc. está normal
- 💬 **Conversa rápida**: Conversar diretamente com a IA via CLI ou WebChat sem abrir o aplicativo do canal
- 🔄 **Entregar resposta**: Enviar a resposta da IA de volta a um canal ou contato específico

---

## 🎒 Pré-requisitos

Antes de enviar a primeira mensagem, verifique:

### Requisitos Obrigatórios

| Condição | Como Verificar |
|--- | ---|
| **Gateway iniciado** | `clawdbot gateway status` ou verificar se o processo está em execução |
| **Modelo de IA configurado** | `clawdbot models list` para ver se há modelos disponíveis |
| **Porta acessível** | Confirmar que a porta 18789 (ou porta personalizada) não está em uso |

::: warning Pré-requisitos do Curso
Este tutorial assume que você já completou:
- [Início Rápido](../getting-started/) - Instalação, configuração e inicialização do Clawdbot
- [Iniciar o Gateway](../gateway-startup/) - Entender os diferentes modos de inicialização do Gateway

Se ainda não completou, volte primeiro para esses cursos.
:::

### Opcional: Configurar Canais

Se você deseja enviar mensagens via WhatsApp/Telegram/Slack etc., primeiro configure os canais.

Verificação rápida:

```bash
## Listar canais configurados
clawdbot channels list
```

Se retornar uma lista vazia ou faltar o canal que você deseja usar, consulte o tutorial de configuração do canal correspondente (na seção `platforms/`).

---

## Conceito Central

O Clawdbot suporta três métodos principais de envio de mensagens:

```
┌─────────────────────────────────────────────────────────────┐
│              Métodos de Envio de Mensagens do Clawdbot       │
├─────────────────────────────────────────────────────────────┤
│                                                         │
│  Método 1: Conversa via CLI Agent                         │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → IA → Retornar resultado   │
│  │ agent       │                                       │
│  │ --message   │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Método 2: CLI envia mensagem diretamente para canal   │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → Canal → Enviar mensagem    │
│  │ message     │                                       │
│  │ send        │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Método 3: WebChat / Canais configurados               │
│  ┌─────────────┐               ┌──────────────┐   │
│  │ WebChat     │   ou         │ WhatsApp     │   │
│  │ Interface   │              │ Telegram     │ → Gateway → IA → Resposta do canal │
│  │ do navegador│              │ Slack        │   │
│  └─────────────┘               │ Discord      │   │
│                                 └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Diferenças-chave**:

| Método | Passa pela IA | Uso |
|--- | --- | ---|
| `clawdbot agent` | ✅ Sim | Conversar com IA, obter resposta e processo de pensamento |
| `clawdbot message send` | ❌ Não | Enviar mensagem diretamente para o canal, sem passar pela IA |
| WebChat / Canal | ✅ Sim | Conversar com IA via interface gráfica |

::: info Escolha o método apropriado
- **Verificar instalação**: Use `clawdbot agent` ou WebChat
- **Testar canal**: Use aplicativos de canal como WhatsApp/Telegram
- **Envio em lote**: Use `clawdbot message send` (sem passar pela IA)
:::

---

## Siga os Passos

### Passo 1: Conversar com IA via CLI

**Por que**
CLI é a forma mais rápida de verificação, não é necessário abrir navegador ou aplicativo do canal.

#### Conversação Básica

```bash
## Enviar mensagem simples para o assistente de IA
clawdbot agent --message "Hello, I'm testing Clawdbot!"
```

**Você deverá ver**:
```
[clawdbot] Thinking...
[clawdbot] Hello! I'm your AI assistant powered by Clawdbot. How can I help you today?
```

#### Usar Nível de Pensamento

O Clawdbot suporta diferentes níveis de pensamento, controlando a "transparência" da IA:

```bash
## Nível de pensamento alto (mostra processo de raciocínio completo)
clawdbot agent --message "Ship checklist" --thinking high

## Desativar pensamento (ver apenas resposta final)
clawdbot agent --message "What's 2+2?" --thinking off
```

**Você deverá ver** (nível de pensamento alto):
```
[clawdbot] I'll create a comprehensive ship checklist for you.

[THINKING]
Let me think about what needs to be checked for shipping:

1. Code readiness
   - All tests passing?
   - Code review completed?
   - Documentation updated?

2. Build configuration
   - Environment variables set correctly?
   - Build artifacts generated?

[THINKING END]

[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

**Opções de nível de pensamento**:

| Nível | Descrição | Cenário de Uso |
|--- | --- | ---|
| `off` | Não mostrar processo de pensamento | Perguntas simples, resposta rápida |
| `minimal` | Minimizar saída de pensamento | Depuração, verificar fluxo |
| `low` | Baixo detalhamento | Conversas diárias |
| `medium` | Detalhamento médio | Tarefas complexas |
| `high` | Alto detalhamento (inclui processo de raciocínio completo) | Aprendizado, geração de código |

#### Especificar Canal de Resposta

Você pode fazer a IA enviar a resposta para um canal específico (em vez do canal padrão):

```bash
## Fazer IA enviar resposta para Telegram
clawdbot agent --message "Send me a weather update" --deliver --reply-channel telegram
```

::: tip Parâmetros comuns
- `--to <número>`: Especificar número E.164 do destinatário (usado para criar sessão específica)
- `--agent <id>`: Usar ID de Agent específico (em vez de main padrão)
- `--session-id <id>`: Continuar sessão existente, em vez de criar nova sessão
- `--verbose on`: Habilitar saída de log detalhada
- `--json`: Saída em formato JSON (adequado para análise de scripts)
:::

---

### Passo 2: Enviar Mensagem via Interface WebChat

**Por que**
O WebChat fornece uma interface gráfica no navegador, mais intuitiva, suporta rich text e anexos.

#### Acessar WebChat

O WebChat usa o serviço WebSocket do Gateway, **não precisa de configuração separada ou porta adicional**.

**Métodos de acesso**:

1. **Abrir navegador, acessar**: `http://localhost:18789`
2. **Ou executar no terminal**: `clawdbot dashboard` (abre navegador automaticamente)

::: info Porta do WebChat
O WebChat usa a mesma porta que o Gateway (padrão 18789). Se você modificou a porta do Gateway, o WebChat também usará a mesma porta.
:::

**Você deverá ver**:
```
┌─────────────────────────────────────────────┐
│          WebChat do Clawdbot              │
│  ┌───────────────────────────────────┐   │
│  │  Olá! Sou seu assistente de IA.  │   │
│  │  Como posso ajudá-lo hoje?      │   │
│  └───────────────────────────────────┘   │
│  [Campo de entrada...                │   │
│  [Enviar]                            │   │
└─────────────────────────────────────────────┘
```

#### Enviar Mensagem

1. Digite sua mensagem no campo de entrada
2. Clique em "Enviar" ou pressione `Enter`
3. Aguarde a resposta da IA

**Você deverá ver**:
- A resposta da IA é exibida na interface de chat
- Se o nível de pensamento estiver ativado, o marcador `[THINKING]` será exibido

**Funcionalidades do WebChat**:

| Funcionalidade | Descrição |
|--- | ---|
| Rich text | Suporta formato Markdown |
| Anexos | Suporta upload de imagens, áudio, vídeo |
| Histórico | Salva automaticamente histórico de sessões |
| Alternar sessão | Alternar entre diferentes sessões no painel esquerdo |

::: tip Aplicativo da barra de menu do macOS
Se você instalou o aplicativo Clawdbot para macOS, também pode abrir o WebChat diretamente pelo botão "Open WebChat" na barra de menu.
:::

---

### Passo 3: Enviar Mensagem via Canais Configurados

**Por que**
Verificar se a conexão dos canais (WhatsApp, Telegram, Slack etc.) está normal e experimentar conversa multiplataforma real.

#### Exemplo WhatsApp

Se você configurou o WhatsApp no onboarding ou configuração:

1. **Abrir aplicativo do WhatsApp** (celular ou desktop)
2. **Pesquisar seu número do Clawdbot** (ou contato salvo)
3. **Enviar mensagem**: `Hello from WhatsApp!`

**Você deverá ver**:
```
[WhatsApp]
Você → Clawdbot: Hello from WhatsApp!

Clawdbot → Você: Hello! I received your message via WhatsApp.
How can I help you today?
```

#### Exemplo Telegram

Se você configurou o Bot do Telegram:

1. **Abrir aplicativo do Telegram**
2. **Pesquisar seu Bot** (usando nome de usuário)
3. **Enviar mensagem**: `/start` ou `Hello from Telegram!`

**Você deverá ver**:
```
[Telegram]
Você → @your_bot: /start

@your_bot → Você: Welcome! I'm Clawdbot's AI assistant.
You can talk to me here, and I'll respond via AI.
```

#### Exemplo Slack/Discord

Para Slack ou Discord:

1. **Abrir aplicativo correspondente**
2. **Encontrar o canal ou servidor onde o Bot está**
3. **Enviar mensagem**: `Hello from Slack!`

**Você deverá ver**:
- Bot responde sua mensagem
- Pode exibir tag "AI Assistant" antes da mensagem

::: info Proteção de Emparelhamento DM
Por padrão, o Clawdbot habilita a **Proteção de Emparelhamento DM**:
- Remetentes desconhecidos recebem um código de emparelhamento
- A mensagem não é processada até que você aprove o emparelhamento

Se você está enviando mensagem pela primeira vez de um canal, pode precisar:
```bash
## Listar solicitações de emparelhamento pendentes
clawdbot pairing list

## Aprovar solicitação de emparelhamento (substitua <channel> e <code> pelos valores reais)
clawdbot pairing approve <channel> <code>
```

Explicação detalhada: [Emparelhamento DM e Controle de Acesso](../pairing-approval/)
:::

---

### Passo 4 (Opcional): Enviar Mensagem Diretamente para o Canal

**Por que**
Enviar mensagem diretamente para o canal sem passar pela IA. Adequado para notificações em lote, mensagens push etc.

#### Enviar Mensagem de Texto

```bash
## Enviar mensagem de texto para WhatsApp
clawdbot message send --target +15555550123 --message "Hello from CLI!"
```

#### Enviar Mensagem com Anexo

```bash
## Enviar imagem
clawdbot message send --target +15555550123 \
  --message "Check out this photo" \
  --media ~/Desktop/photo.jpg

## Enviar imagem de URL
clawdbot message send --target +15555550123 \
  --message "Here's a link" \
  --media https://example.com/image.png
```

**Você deverá ver**:
```
[clawdbot] Message sent successfully
[clawdbot] Message ID: 3EB0A1234567890
```

::: tip Parâmetros comuns do message send
- `--channel`: Especificar canal (padrão: whatsapp)
- `--reply-to <id>`: Responder a mensagem específica
- `--thread-id <id>`: ID de tópico do Telegram
- `--buttons <json>`: Botões embutidos do Telegram (formato JSON)
- `--card <json>`: Adaptive Card (canais suportados)
:::

---

## Ponto de Verificação ✅

Após concluir os passos acima, você deve ser capaz de:

- [ ] Enviar mensagem via CLI e receber resposta da IA
- [ ] Enviar mensagem na interface WebChat e ver resposta
- [ ] (Opcional) Enviar mensagem em canais configurados e receber resposta da IA
- [ ] (Opcional) Usar `clawdbot message send` para enviar mensagem diretamente para o canal

::: tip Perguntas Frequentes

**P: A IA não está respondendo minha mensagem?**

R: Verifique os seguintes pontos:
1. Se o Gateway está em execução: `clawdbot gateway status`
2. Se o modelo de IA está configurado: `clawdbot models list`
3. Ver logs detalhados: `clawdbot agent --message "test" --verbose on`

**P: O WebChat não está abrindo?**

R: Verifique:
1. Se o Gateway está em execução
2. Se a porta está correta: padrão 18789
3. Se o navegador está acessando `http://127.0.0.1:18789` (em vez de `localhost`)

**P: Falha no envio de mensagem do canal?**

R: Verifique:
1. Se o canal está conectado: `clawdbot channels status`
2. Se a conexão de rede está normal
3. Ver logs de erro específicos do canal: `clawdbot gateway --verbose`
:::

---

## Cuidados

### ❌ Gateway Não Iniciado

**Abordagem incorreta**:
```bash
clawdbot agent --message "Hello"
## Erro: Gateway connection failed
```

**Abordagem correta**:
```bash
## Iniciar o Gateway primeiro
clawdbot gateway --port 18789

## Enviar mensagem
clawdbot agent --message "Hello"
```

::: warning O Gateway deve ser iniciado primeiro
Todos os métodos de envio de mensagens (CLI, WebChat, canais) dependem do serviço WebSocket do Gateway. Garantir que o Gateway está em execução é o primeiro passo.
:::

### ❌ Canal Não Conectado

**Abordagem incorreta**:
```bash
## Enviar mensagem sem conectar WhatsApp
clawdbot message send --target +15555550123 --message "Hi"
## Erro: WhatsApp not authenticated
```

**Abordagem correta**:
```bash
## Conectar o canal primeiro
clawdbot channels login whatsapp

## Confirmar status
clawdbot channels status

## Enviar mensagem
clawdbot message send --target +15555550123 --message "Hi"
```

### ❌ Esquecer Emparelhamento DM

**Abordagem incorreta**:
```bash
## Primeiro envio de mensagem do Telegram, mas não aprovou emparelhamento
## Resultado: Bot recebe mensagem mas não processa
```

**Abordagem correta**:
```bash
## 1. Listar solicitações de emparelhamento pendentes
clawdbot pairing list

## 2. Aprovar emparelhamento
clawdbot pairing approve telegram ABC123
## 3. Enviar mensagem novamente

### Agora a mensagem será processada e receberá resposta da IA
```

### ❌ Confundir agent e message send

**Abordagem incorreta**:
```bash
## Quer conversar com IA, mas usou message send
clawdbot message send --target +15555550123 --message "Help me write code"
## Resultado: Mensagem enviada diretamente para o canal, IA não processa
```

**Abordagem correta**:
```bash
## Conversar com IA: usar agent
clawdbot agent --message "Help me write code" --to +15555550123

## Enviar mensagem diretamente: usar message send (sem passar pela IA)
clawdbot message send --target +15555550123 --message "Meeting at 3pm"
```

---

## Resumo da Lição

Nesta lição você aprendeu:

1. ✅ **Conversa via CLI Agent**: `clawdbot agent --message` conversar com IA, suporta controle de nível de pensamento
2. ✅ **Interface WebChat**: Acesse `http://localhost:18789` usar interface gráfica para enviar mensagens
3. ✅ **Mensagem de Canal**: Conversar com IA em canais configurados como WhatsApp, Telegram, Slack etc.
4. ✅ **Envio Direto**: `clawdbot message send` enviar mensagem diretamente para o canal sem passar pela IA
5. ✅ **Solução de Problemas**: Entender causas comuns de falha e soluções

**Próximos Passos**:

- Aprender [Emparelhamento DM e Controle de Acesso](../pairing-approval/), entender como gerenciar remetentes desconhecidos com segurança
- Explorar [Visão Geral do Sistema de Múltiplos Canais](../../platforms/channels-overview/), entender todos os canais suportados e suas configurações
- Configurar mais canais (WhatsApp, Telegram, Slack, Discord etc.) para experimentar assistente de IA multiplataforma

---

## Próxima Lição

> Na próxima lição, aprenderemos **[Emparelhamento DM e Controle de Acesso](../pairing-approval/)**.
>
> Você aprenderá:
> - Entender o mecanismo de proteção de emparelhamento DM padrão
> - Como aprovar solicitações de emparelhamento de remetentes desconhecidos
> - Configurar allowlist e políticas de segurança

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Registro de comando CLI Agent | [`src/cli/program/register.agent.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.agent.ts) | 20-82 |
| Execução do CLI Agent | [`src/commands/agent-via-gateway.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/agent-via-gateway.ts) | 82-184 |
| Registro de CLI message send | [`src/cli/program/message/register.send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/message/register.send.ts) | 1-30 |
| Método Gateway chat.send | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380 |
| Processamento de mensagens internas do WebChat | [`src/gateway/server-chat.gateway-server-chat.e2e.test.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-chat.gateway-server-chat.e2e.test.ts) | 50-290 |
| Definição de tipo de canal de mensagem | [`src/gateway/protocol/client-info.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/client-info.ts) | 2-23 |
| Registro de canais | [`src/channels/registry.js`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.js) | Arquivo completo |

**Constantes-chave**:
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`: Canal de mensagem padrão (de `src/channels/registry.js`)
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: Canal de mensagem interna do WebChat (de `src/utils/message-channel.ts`)

**Funções-chave**:
- `agentViaGatewayCommand()`: Chamar método agent via Gateway WebSocket (`src/commands/agent-via-gateway.ts`)
- `agentCliCommand()`: Entrada de comando CLI agent, suporta modos local e Gateway (`src/commands/agent-via-gateway.ts`)
- `registerMessageSendCommand()`: Registrar comando `message send` (`src/cli/program/message/register.send.ts`)
- `chat.send`: Método WebSocket do Gateway, processa solicitação de envio de mensagem (`src/gateway/server-methods/chat.ts`)

</details>
