---
title: "Guia Completo de Configuração do Canal Slack: Modo Socket/HTTP, Configurações de Segurança | Tutorial Clawdbot"
sidebarTitle: "Slack com IA"
subtitle: "Guia Completo de Configuração do Canal Slack | Tutorial Clawdbot"
description: "Aprenda como configurar e usar o canal Slack no Clawdbot. Este tutorial cobre os dois métodos de conexão Socket Mode e HTTP Mode, etapas de obtenção de Token, configuração de segurança de DM, estratégias de gerenciamento de grupos e uso das ferramentas Slack Actions."
tags:
  - "platforms"
  - "slack"
  - "configuração"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 90
---

# Guia Completo de Configuração do Canal Slack

## O Que Você Vai Aprender

- ✅ Interagir com o Clawdbot no Slack, usando o assistente de IA para realizar tarefas
- ✅ Configurar políticas de segurança de DM, protegendo a privacidade pessoal
- ✅ Integrar o Clawdbot em grupos, respondendo intelligentemente a menções @ e comandos
- ✅ Usar ferramentas Slack Actions (enviar mensagens, gerenciar Pins, visualizar informações de membros, etc.)
- ✅ Escolher entre Socket Mode ou HTTP Mode como método de conexão

## Seu Desafio Atual

O Slack é uma ferramenta central de colaboração em equipe, mas você pode enfrentar os seguintes problemas:

- Discussões de equipe dispersas em múltiplos canais, perdendo informações importantes
- Necessidade de consultar rapidamente mensagens históricas, Pins ou informações de membros, mas a interface do Slack não é conveniente
- Deseja usar capacidades de IA diretamente no Slack, sem precisar alternar para outros aplicativos
- Preocupação de que habilitar o assistente de IA em grupos cause spam de mensagens ou vazamento de privacidade

## Quando Usar Esta Abordagem

- **Comunicação diária da equipe**: O Slack é a principal ferramenta de comunicação da sua equipe
- **Necessidade de integração nativa com Slack**: Aproveitar funcionalidades como Reaction, Pin, Thread, etc.
- **Múltiplas contas**: Precisa conectar múltiplos Slack Workspace
- **Cenários de implantação remota**: Usar HTTP Mode para conectar ao Gateway remoto

## 🎒 Preparação

::: warning Verificação Prévia
Antes de começar, confirme:
- Já completou [Introdução Rápida](../../start/getting-started/)
- O Gateway está iniciado e em execução
- Possui permissões de administrador do Slack Workspace (para criar App)
::

**Recursos necessários**:
- [Console da API do Slack](https://api.slack.com/apps) - Criar e gerenciar Slack Apps
- Arquivo de configuração do Clawdbot - Geralmente localizado em `~/.clawdbot/clawdbot.json`

## Ideia Central

O canal Slack do Clawdbot é baseado no framework [Bolt](https://slack.dev/bolt-js), suportando dois modos de conexão:

| Modo | Cenário Aplicável | Vantagens | Desvantagens |
|--- | --- | --- | ---|
| **Socket Mode** | Gateway local, uso pessoal | Configuração simples (apenas Token) | Precisa manter conexão WebSocket constante |
| **HTTP Mode** | Implantação em servidor, acesso remoto | Pode passar por firewall, suporta balanceamento de carga | Precisa de IP público, configuração complexa |

**Padrão: Socket Mode**, adequado para a maioria dos usuários.

**Mecanismo de Autenticação**:
- **Bot Token** (`xoxb-...`) - Obrigatório, para chamadas de API
- **App Token** (`xapp-...`) - Obrigatório para Socket Mode, para conexão WebSocket
- **User Token** (`xoxp-...`) - Opcional, para operações somente leitura (histórico, Pins, Reactions)
- **Signing Secret** - Obrigatório para HTTP Mode, para verificar requisições Webhook

## Siga os Passos

### Passo 1: Criar Slack App

**Por que**
O Slack App é a ponte entre o Clawdbot e o Workspace, fornecendo autenticação e controle de permissões.

1. Acesse [Console da API do Slack](https://api.slack.com/apps)
2. Clique em **Create New App** → Selecione **From scratch**
3. Preencha as informações do App:
   - **App Name**: `Clawdbot` (ou o nome que preferir)
   - **Pick a workspace to develop your app in**: Selecione seu Workspace
4. Clique em **Create App**

**Você deve ver**:
App criado com sucesso, entrando na página de configuração básica.

### Passo 2: Configurar Socket Mode (Recomendado)

::: tip Dica
Se você usa um Gateway local, recomenda-se o Socket Mode, configuração mais simples.
::

**Por que**
O Socket Mode não precisa de IP público, conecta-se através do serviço WebSocket do Slack.

1. Na página de configuração do App, encontre **Socket Mode**, alterne para **On**
2. Role até **App-Level Tokens**, clique em **Generate Token and Scopes**
3. Na seção **Token**, selecione o scope:
   - Marque `connections:write`
4. Clique em **Generate Token**, copie o **App Token** gerado (começa com `xapp-`)

**Você deve ver**:
O Token gerado é semelhante a: `xapp-1-A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P`

::: danger Aviso de Segurança
App Token é informação sensível, mantenha-o seguro e não o exponha em repositórios públicos.
::

### Passo 3: Configurar Bot Token e Permissões

1. Role até **OAuth & Permissions** → **Bot Token Scopes**
2. Adicione os seguintes scopes (permissões):

**Bot Token Scopes (Obrigatório)**:

```yaml
    chat:write                    # Enviar/editar/excluir mensagens
    channels:history              # Ler histórico de canais
    channels:read                 # Obter informações de canais
    groups:history                # Ler histórico de grupos
    groups:read                   # Obter informações de grupos
    im:history                   # Ler histórico de DM
    im:read                      # Obter informações de DM
    im:write                     # Abrir sessões DM
    mpim:history                # Ler histórico de grupos DM
    mpim:read                   # Obter informações de grupos DM
    users:read                   # Consultar informações de usuário
    app_mentions:read            # Ler menções @
    reactions:read               # Ler Reactions
    reactions:write              # Adicionar/excluir Reactions
    pins:read                    # Ler lista de Pins
    pins:write                   # Adicionar/excluir Pins
    emoji:read                   # Ler Emojis personalizados
    commands                     # Processar comandos de barra
    files:read                   # Ler informações de arquivos
    files:write                  # Fazer upload de arquivos
```

::: info Nota
As permissões acima são **necessárias** para o Bot Token, garantindo que o Bot possa ler mensagens, enviar respostas, gerenciar Reactions e Pins normalmente.
::

3. Role para o topo da página, clique em **Install to Workspace**
4. Clique em **Allow** para autorizar o App a acessar seu Workspace
5. Copie o **Bot User OAuth Token** gerado (começa com `xoxb-`)

**Você deve ver**:
Token semelhante a: `xoxb-YOUR-BOT-TOKEN-HERE`

::: tip Dica
 Se você precisa do **User Token** (para operações somente leitura), role até **User Token Scopes**, adicione as seguintes permissões:
- `channels:history`, `groups:history`, `im:history`, `mpim:history`
- `channels:read`, `groups:read`, `im:read`, `mpim:read`
- `users:read`, `reactions:read`, `pins:read`, `emoji:read`
- `search:read`

Em seguida, na página **Install App**, copie o **User OAuth Token** (começa com `xoxp-`).

**User Token Scopes (Opcional, somente leitura)**:
- Usado apenas para ler histórico, Reactions, Pins, Emojis e buscar
- Operações de escrita ainda usam Bot Token (a menos que configure `userTokenReadOnly: false`)
::

### Passo 4: Configurar Assinatura de Eventos

1. Na página de configuração do App, encontre **Event Subscriptions**, habilite **Enable Events**
2. Em **Subscribe to bot events**, adicione os seguintes eventos:

```yaml
    app_mention                  # @ mencionar Bot
    message.channels              # Mensagens de canal
    message.groups               # Mensagens de grupo
    message.im                   # Mensagens de DM
    message.mpim                # Mensagens de grupo DM
    reaction_added               # Adicionar Reaction
    reaction_removed             # Remover Reaction
    member_joined_channel       # Membro entrar no canal
    member_left_channel          # Membro sair do canal
    channel_rename               # Renomear canal
    pin_added                   # Adicionar Pin
    pin_removed                 # Remover Pin
```

3. Clique em **Save Changes**

### Passo 5: Habilitar Funcionalidade DM

1. Na página de configuração do App, encontre **App Home**
2. Habilite **Messages Tab** → Ative **Enable Messages Tab**
3. Certifique-se de que mostra **Messages tab read-only disabled: No**

**Você deve ver**:
Messages Tab habilitada, usuários podem realizar conversas DM com o Bot.

### Passo 6: Configurar Clawdbot

**Por que**
Configurar o Slack Token no Clawdbot para estabelecer a conexão.

#### Método 1: Usar Variáveis de Ambiente (Recomendado)

```bash
    # Definir variáveis de ambiente
    export SLACK_BOT_TOKEN="xoxb-SeuBotToken"
    export SLACK_APP_TOKEN="xapp-SeuAppToken"

    # Reiniciar Gateway
    clawdbot gateway restart
```

**Você deve ver**:
Logs de inicialização do Gateway mostrando `Slack: connected`.

#### Método 2: Arquivo de Configuração

Edite `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-SeuBotToken",
      "appToken": "xapp-SeuAppToken"
    }
  }
}
```

**Se você tem User Token**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-SeuBotToken",
      "appToken": "xapp-SeuAppToken",
      "userToken": "xoxp-SeuUserToken",
      "userTokenReadOnly": true
    }
  }
}
```

**Você deve ver**:
Após reiniciar o Gateway, conexão Slack bem-sucedida.

### Passo 7: Convidar Bot para o Canal

1. No Slack, abra o canal onde deseja que o Bot entre
2. Digite `/invite @Clawdbot` (substitua pelo nome do seu Bot)
3. Clique em **Add to channel**

**Você deve ver**:
Bot entra com sucesso no canal, mostrando "Clawdbot has joined the channel".

### Passo 8: Configurar Política de Segurança de Grupo

**Por que**
Evitar que o Bot responda automaticamente em todos os canais, protegendo a privacidade.

Edite `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-SeuBotToken",
      "appToken": "xapp-SeuAppToken",
      "groupPolicy": "allowlist",
      "channels": {
        "C1234567890": {
          "allow": true,
          "requireMention": true
        },
        "#general": {
          "allow": true,
          "requireMention": true
        }
      }
    }
  }
}
```

**Descrição dos campos**:
- `groupPolicy`: Política de grupo
  - `"open"` - Permite todos os canais (não recomendado)
  - `"allowlist"` - Apenas permite canais listados (recomendado)
  - `"disabled"` - Proíbe todos os canais
- `channels`: Configuração de canais
  - `allow`: Permitir/recusar
  - `requireMention`: Se precisa de menção @ para o Bot responder (padrão `true`)
  - `users`: Lista de permissões de usuários adicionais
  - `skills`: Restringir habilidades usadas neste canal
  - `systemPrompt`: Prompt do sistema adicional

**Você deve ver**:
Bot responde apenas em canais configurados, e precisa de menção @.

### Passo 9: Configurar Política de Segurança de DM

**Por que**
Evitar que estranhos interajam com o Bot via DM, protegendo a privacidade.

Edite `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-SeuBotToken",
      "appToken": "xapp-SeuAppToken",
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["U1234567890", "@alice", "user@example.com"]
      }
    }
  }
}
```

**Descrição dos campos**:
- `dm.enabled`: Habilitar/desabilitar DM (padrão `true`)
- `dm.policy`: Política de DM
  - `"pairing"` - Estranhos recebem código de emparelhamento, precisam de aprovação (padrão)
  - `"open"` - Permite qualquer pessoa enviar DM
  - `"allowlist"` - Apenas permite usuários na lista branca
- `dm.allowFrom`: Lista branca
  - Suporta ID de usuário (`U1234567890`)
  - Suporta menção @ (`@alice`)
  - Suporta e-mail (`user@example.com`)

**Fluxo de Emparelhamento**:
1. Estranho envia DM para o Bot
2. Bot responde com código de emparelhamento (válido por 1 hora)
3. Usuário fornece código de emparelhamento ao administrador
4. Administrador executa: `clawdbot pairing approve slack <código>`
5. Usuário é adicionado à lista branca, pode usar normalmente

**Você deve ver**:
Remetentes desconhecidos recebem código de emparelhamento, Bot não processa suas mensagens.

### Passo 10: Testar Bot

1. Envie uma mensagem no canal configurado: `@Clawdbot Olá`
2. Ou envie DM para o Bot
3. Observe a resposta do Bot

**Você deve ver**:
Bot responde normalmente à sua mensagem.

### Ponto de Verificação ✅

- [ ] Slack App criado com sucesso
- [ ] Socket Mode habilitado
- [ ] Bot Token e App Token copiados
- [ ] Arquivo de configuração do Clawdbot atualizado
- [ ] Gateway reiniciado
- [ ] Bot convidado para o canal
- [ ] Política de segurança de grupo configurada
- [ ] Política de segurança de DM configurada
- [ ] Mensagens de teste receberam resposta

## Evite Armadilhas

### Erro Comum 1: Bot Sem Resposta

**Problema**: Após enviar mensagem, o Bot não responde.

**Possíveis causas**:
1. Bot não entrou no canal → Use `/invite @Clawdbot` para convidar
2. `requireMention` configurado como `true` → Ao enviar mensagem, precisa usar `@Clawdbot`
3. Token configurado incorretamente → Verifique se o Token em `clawdbot.json` está correto
4. Gateway não está rodando → Execute `clawdbot gateway status` para verificar o status

### Erro Comum 2: Falha na Conexão Socket Mode

**Problema**: Logs do Gateway mostram falha de conexão.

**Solução**:
1. Verifique se o App Token está correto (começa com `xapp-`)
2. Verifique se o Socket Mode está habilitado
3. Verifique a conexão de rede

### Erro Comum 3: Permissões Insuficientes do User Token

**Problema**: Algumas operações falham, mostrando erro de permissão.

**Solução**:
1. Certifique-se de que o User Token inclui as permissões necessárias (veja Passo 3)
2. Verifique a configuração `userTokenReadOnly` (padrão `true`, somente leitura)
3. Se precisar de operações de escrita, configure `"userTokenReadOnly": false`

### Erro Comum 4: Falha na Resolução de ID de Canal

**Problema**: O nome do canal configurado não pode ser resolvido para ID.

**Solução**:
1. Priorize o uso do ID do canal (como `C1234567890`) em vez do nome
2. Certifique-se de que o nome do canal começa com `#` (como `#general`)
3. Verifique se o Bot tem permissão para acessar o canal

## Configurações Avançadas

### Explicação de Permissões

::: info Bot Token vs User Token
- **Bot Token**: Obrigatório, para funcionalidades principais do Bot (enviar mensagens, ler histórico, gerenciar Pins/Reactions, etc.)
- **User Token**: Opcional, apenas para operações somente leitura (histórico, Reactions, Pins, Emojis, busca)
  - Padrão `userTokenReadOnly: true`, garantindo somente leitura
  - Operações de escrita (enviar mensagens, adicionar Reactions, etc.) ainda usam Bot Token
::

**Permissões que podem ser necessárias no futuro**:

As seguintes permissões não são obrigatórias na versão atual, mas podem ter suporte adicionado no futuro:

| Permissão | Propósito |
|--- | ---|
| `groups:write` | Gerenciamento de canais privados (criar, renomear, convidar, arquivar) |
| `mpim:write` | Gerenciamento de sessões de grupo DM |
| `chat:write.public` | Publicar mensagens em canais onde o Bot não entrou |
| `files:read` | Listar/ler metadados de arquivos |

Se precisar habilitar essas funcionalidades, adicione as permissões correspondentes em **Bot Token Scopes** do Slack App.

### HTTP Mode (Implantação em Servidor)

Se seu Gateway está implantado em servidor remoto, use HTTP Mode:

1. Crie Slack App, desabilite Socket Mode
2. Copie **Signing Secret** (página Basic Information)
3. Configure Event Subscriptions, defina **Request URL** como `https://seu-dominio/slack/events`
4. Configure Interactivity & Shortcuts, defina o mesmo **Request URL**
5. Configure Slash Commands, defina **Request URL**

**Arquivo de configuração**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "http",
      "botToken": "xoxb-SeuBotToken",
      "signingSecret": "SeuSigningSecret",
      "webhookPath": "/slack/events"
    }
  }
}
```

### Configuração de Múltiplas Contas

Suporta conectar múltiplos Slack Workspace:

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "workspace1": {
          "name": "Equipe A",
          "enabled": true,
          "botToken": "xoxb-Workspace1Token",
          "appToken": "xapp-Workspace1Token"
        },
        "workspace2": {
          "name": "Equipe B",
          "enabled": true,
          "botToken": "xoxb-Workspace2Token",
          "appToken": "xapp-Workspace2Token"
        }
      }
    }
  }
}
```

### Configurar Comandos de Barra

Habilite o comando `/clawd`:

1. Na página de configuração do App, encontre **Slash Commands**
2. Crie comando:
   - **Command**: `/clawd`
   - **Request URL**: Socket Mode não precisa (processado via WebSocket)
   - **Description**: `Send a message to Clawdbot`

**Arquivo de configuração**:

```json
{
  "channels": {
    "slack": {
      "slashCommand": {
        "enabled": true,
        "name": "clawd",
        "ephemeral": true
      }
    }
  }
}
```

### Configuração de Resposta em Thread

Controla como o Bot responde em canais:

```json
{
  "channels": {
    "slack": {
      "replyToMode": "off",
      "replyToModeByChatType": {
        "direct": "all",
        "group": "first"
      }
    }
  }
}
```

| Modo | Comportamento |
|--- | ---|
| `off` | Padrão, responde no canal principal |
| `first` | Primeira resposta entra em thread, respostas subsequentes no canal principal |
| `all` | Todas as respostas estão em thread |

### Habilitar Ferramentas Slack Actions

Permite que o Agent chame operações específicas do Slack:

```json
{
  "channels": {
    "slack": {
      "actions": {
        "reactions": true,
        "messages": true,
        "pins": true,
        "memberInfo": true,
        "emojiList": true
      }
    }
  }
}
```

**Operações disponíveis**:
- `sendMessage` - Enviar mensagem
- `editMessage` - Editar mensagem
- `deleteMessage` - Excluir mensagem
- `readMessages` - Ler mensagens históricas
- `react` - Adicionar Reaction
- `reactions` - Listar Reactions
- `pinMessage` - Fixar mensagem (Pin)
- `unpinMessage` - Desafixar mensagem (unpin)
- `listPins` - Listar Pins
- `memberInfo` - Obter informações de membro
- `emojiList` - Listar Emojis personalizados

## Resumo da Lição

- O canal Slack suporta dois métodos de conexão: Socket Mode e HTTP Mode
- Socket Mode tem configuração simples, recomendado para uso local
- Política de segurança de DM padrão é `pairing`, estranhos precisam de aprovação
- Política de segurança de grupo suporta lista branca e filtro de menção @
- Ferramentas Slack Actions fornecem capacidades operacionais ricas
- Suporte a múltiplas contas para conectar múltiplos Workspace

## Próxima Lição

> Na próxima lição, aprenderemos **[Canal Discord](../discord/)**.
>
> Você aprenderá:
> - Métodos de configuração do Discord Bot
> - Obtenção de Token e configuração de permissões
> - Políticas de segurança de grupos e DM
> - Uso de ferramentas específicas do Discord

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade            | Caminho do Arquivo                                                                                               | Linhas       |
|--- | --- | ---|
| Tipos de Configuração Slack | [`src/config/types.slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.slack.ts) | 1-150      |
| Lógica de onboarding Slack  | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 1-539      |
| Ferramentas Slack Actions | [`src/agents/tools/slack-actions.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/slack-actions.ts) | 1-301      |
| Documentação Oficial Slack | [`docs/channels/slack.md`](https://github.com/moltbot/moltbot/blob/main/docs/channels/slack.md) | 1-508      |

**Definições de tipos principais**:
- `SlackConfig`: Tipo principal de configuração do canal Slack
- `SlackAccountConfig`: Configuração de conta única (suporta modos socket/http)
- `SlackChannelConfig`: Configuração de canal (lista branca, política de menção, etc.)
- `SlackDmConfig`: Configuração de DM (pairing, allowlist, etc.)
- `SlackActionConfig`: Controle de permissões das ferramentas Actions

**Funções principais**:
- `handleSlackAction()`: Processa chamadas das ferramentas Slack Actions
- `resolveThreadTsFromContext()`: Resolve ID de thread com base em replyToMode
- `buildSlackManifest()`: Gera manifesto do Slack App

</details>
