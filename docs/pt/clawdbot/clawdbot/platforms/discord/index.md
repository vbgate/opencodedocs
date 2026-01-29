---
title: "Configuração e Uso do Canal Discord | Tutorial Clawdbot"
sidebarTitle: "Conecte seu Discord Bot"
subtitle: "Configuração e Uso do Canal Discord"
description: "Aprenda a criar um Discord Bot e configurá-lo no Clawdbot. Este tutorial aborda a criação de Bot no Discord Developer Portal, configuração de permissões Gateway Intents, método de configuração de Bot Token, geração de URL de convite OAuth2, mecanismo de proteção de pareamento DM, configuração de lista branca de canais do servidor, gerenciamento de permissões de chamada de ferramentas Discord AI e etapas de solução de problemas comuns."
tags:
  - "Configuração de Canal"
  - "Discord"
  - "Bot"
prerequisite:
  - "start-getting-started"
order: 100
---

# Configuração e Uso do Canal Discord

## O Que Você Poderá Fazer Após Concluir

- Criar um Discord Bot e obter o Bot Token
- Configurar a integração do Clawdbot com o Discord Bot
- Usar o assistente AI em DMs e canais do servidor Discord
- Configurar controle de acesso (pareamento DM, lista branca de canais)
- Permitir que a AI chame ferramentas Discord (enviar mensagens, criar canais, gerenciar cargos, etc.)

## O Seu Problema Atual

Você já está usando Discord para se comunicar com amigos ou equipes e deseja conversar com um assistente AI diretamente no Discord sem precisar trocar de aplicativo. Você pode encontrar os seguintes problemas:

- Não sabe como criar um Discord Bot
- Não está claro quais permissões são necessárias para que o Bot funcione corretamente
- Quer controlar quem pode interagir com o Bot (evitar uso por desconhecidos)
- Deseja configurar comportamentos diferentes em canais diferentes do servidor

Este tutorial ensinará passo a passo como resolver esses problemas.

## Quando Usar Esta Técnica

O canal Discord é adequado para estes cenários:

- ✅ Você é um usuário intenso de Discord e a maioria das comunicações acontece lá
- ✅ Você deseja adicionar recursos de AI a um servidor Discord (como um assistente inteligente no canal `#help`)
- ✅ Você deseja interagir com a AI através de DMs no Discord (mais conveniente do que abrir o WebChat)
- ✅ Você precisa que a AI execute operações de gerenciamento no Discord (criar canais, enviar mensagens, etc.)

::: info O canal Discord é baseado em discord.js, suportando recursos completos da API de Bot.
:::

## 🎒 Preparativos Antes de Começar

**Pré-requisitos**:
- Já completou o [Início Rápido](../../start/getting-started/), Gateway pode ser executado
- Node.js ≥ 22
- Conta Discord (capaz de criar aplicativos)

**Informações necessárias**:
- Discord Bot Token (ensinarei como obter em breve)
- ID do servidor (opcional, usado para configurar canais específicos)
- ID do canal (opcional, usado para controle refinado)

## Ideia Central

### Como Funciona o Canal Discord

O canal Discord se comunica com o Discord através da **API oficial de Bot**:

```
Usuário Discord
     ↓
  Servidor Discord
     ↓
  Gateway do Discord Bot
     ↓ (WebSocket)
  Gateway do Clawdbot
     ↓
  AI Agent (Claude/GPT, etc.)
     ↓
  API do Discord Bot (enviar resposta)
     ↓
Servidor Discord
     ↓
Usuário Discord (vê a resposta)
```

**Pontos-chave**:
- O Bot recebe mensagens via WebSocket (Gateway → Bot)
- O Clawdbot encaminha mensagens para o AI Agent processar
- A AI pode chamar ferramentas `discord` para executar operações específicas do Discord
- Todas as respostas são enviadas de volta ao Discord através da API do Bot

### Diferença entre DM e Canais do Servidor

| Tipo | Isolamento da Sessão | Comportamento Padrão | Cenários Aplicáveis |
|--- | --- | --- | ---|
| **DM (Mensagem Direta)** | Todos os DMs compartilham a sessão `agent:main:main` | Requer proteção de pareamento | Conversas pessoais, contexto continuado |
| **Canal do Servidor** | Cada canal tem uma sessão independente `agent:<agentId>:discord:channel:<channelId>` | Requer @menção para responder | Assistente inteligente do servidor, múltiplos canais em paralelo |

::: tip
As sessões dos canais do servidor são completamente isoladas e não interferem umas nas outras. Conversas no canal `#help` não aparecerão no `#general`.
:::

### Mecanismos de Segurança Padrão

O canal Discord habilita por padrão a **Proteção de Pareamento DM**:

```
Usuário desconhecido → Enviar DM → Clawdbot
                              ↓
                      Rejeitar processamento, retornar código de pareamento
                              ↓
                Usuário precisa executar `clawdbot pairing approve discord <code>`
                              ↓
                            Pareamento bem-sucedido, pode conversar
```

Isso evita que usuários desconhecidos interajam diretamente com seu assistente AI.

---

## Siga Comigo

### Passo 1: Criar Aplicativo e Bot do Discord

**Por que**
O Discord Bot precisa de uma "identidade" para se conectar ao servidor Discord. Essa identidade é o Bot Token.

#### 1.1 Criar Aplicativo Discord

1. Abra o [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em **New Application** (Novo Aplicativo)
3. Digite o nome do aplicativo (por exemplo, `Clawdbot AI`)
4. Clique em **Create** (Criar)

#### 1.2 Adicionar Usuário Bot

1. Na barra de navegação à esquerda, clique em **Bot** (Robô)
2. Clique em **Add Bot** → **Reset Token** → **Reset Token** (Redefinir Token)
3. **Importante**: Copie imediatamente o Bot Token (é exibido apenas uma vez!)

```
Formato do Bot Token: MTAwOTk1MDk5NjQ5NTExNjUy.Gm9...
(Muda a cada redefinição, guarde com cuidado!)
```

#### 1.3 Habilitar Gateway Intents Necessários

O Discord não permite que o Bot leia o conteúdo das mensagens por padrão, é necessário habilitar manualmente.

Em **Bot → Privileged Gateway Intents** (Intenções de Gateway Privilegiados), habilite:

| Intent | Obrigatório | Descrição |
|--- | --- | ---|
| **Message Content Intent** | ✅ **Obrigatório** | Ler o conteúdo de texto da mensagem (sem isso, o Bot não consegue ver mensagens) |
| **Server Members Intent** | ⚠️ **Recomendado** | Usado para pesquisa de membros e resolução de nomes de usuário |

::: danger Proibição
Não habilite **Presence Intent** (Intenção de Presença), a menos que você realmente precise do status online dos usuários.
:::

**Você deve ver**: ambos os interruptores ficarem verdes (ON).

---

### Passo 2: Gerar URL de Convite e Adicionar ao Servidor

**Por que**
O Bot precisa de permissões para ler e enviar mensagens no servidor.

1. Na barra de navegação à esquerda, clique em **OAuth2 → URL Generator**
2. Em **Scopes** (Escopos), selecione:
   - ✅ **bot**
   - ✅ **applications.commands** (para comandos nativos)

3. Em **Bot Permissions** (Permissões do Bot), selecione no mínimo:

| Permissão | Descrição |
|--- | ---|
| **View Channels** | Ver canais |
| **Send Messages** | Enviar mensagens |
| **Read Message History** | Ler histórico de mensagens |
| **Embed Links** | Incorporar links |
| **Attach Files** | Upload de arquivos |

Permissões opcionais (adicione conforme necessário):
- **Add Reactions** (Adicionar reações de emoji)
- **Use External Emojis** (Usar emojis personalizados)

::: warning Aviso de Segurança
Evite conceder a permissão **Administrator** (Administrador), a menos que você esteja depurando e confie completamente no Bot.
:::

4. Copie a URL gerada
5. Abra a URL no navegador
6. Selecione seu servidor, clique em **Authorize** (Autorizar)

**Você deve ver**: O Bot entra com sucesso no servidor, exibindo como online em verde.

---

### Passo 3: Obter IDs Necessários (Servidor, Canal, Usuário)

**Por que**
A configuração do Clawdbot prefere usar IDs (números), pois IDs não mudam.

#### 3.1 Habilitar Modo de Desenvolvedor do Discord

1. Discord desktop/web → **User Settings** (Configurações do Usuário)
2. **Advanced** (Avançado) → Habilitar **Developer Mode** (Modo de Desenvolvedor)

#### 3.2 Copiar ID

| Tipo | Operação |
|--- | ---|
| **ID do Servidor** | Clique com o botão direito no nome do servidor → **Copy Server ID** |
| **ID do Canal** | Clique com o botão direito no canal (como `#general`) → **Copy Channel ID** |
| **ID do Usuário** | Clique com o botão direito no avatar do usuário → **Copy User ID** |

::: tip ID vs Nome
Priorize o uso de IDs na configuração. Nomes podem mudar, mas IDs nunca mudam.
:::

**Você deve ver**: O ID foi copiado para a área de transferência (formato: `123456789012345678`).

---

### Passo 4: Configurar o Clawdbot para Conectar ao Discord

**Por que**
Dizer ao Clawdbot como conectar ao seu Discord Bot.

#### Método 1: Através de Variáveis de Ambiente (Recomendado, adequado para servidores)

```bash
export DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"

clawdbot gateway --port 18789
```

#### Método 2: Através de Arquivo de Configuração

Edite `~/.clawdbot/clawdbot.json`:

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "YOUR_BOT_TOKEN"  // Token copiado no Passo 1
    }
  }
}
```

::: tip Prioridade de Variáveis de Ambiente
Se tanto variáveis de ambiente quanto arquivo de configuração estiverem definidos, **o arquivo de configuração tem prioridade**.
:::

**Você deve ver**: Após iniciar o Gateway, o Discord Bot exibe como online.

---

### Passo 5: Verificar Conexão e Testar

**Por que**
Garantir que a configuração está correta e que o Bot pode receber e enviar mensagens normalmente.

1. Inicie o Gateway (se ainda não iniciou):

```bash
clawdbot gateway --port 18789 --verbose
```

2. Verifique o status do Discord Bot:
   - O Bot deve exibir como **online verde** na lista de membros do servidor
   - Se estiver offline cinza, verifique se o Token está correto

3. Enviar mensagem de teste:

No Discord:
- **DM**: Envie uma mensagem diretamente ao Bot (você receberá um código de pareamento, veja a próxima seção)
- **Canal do Servidor**: @mencione o Bot, como `@ClawdbotAI hello`

**Você deve ver**: O Bot responde com uma mensagem (o conteúdo depende do seu modelo de AI).

::: tip Teste falhou?
Se o Bot não responder, verifique a seção [Solução de Problemas](#solução-de-problemas).
:::

---

## Ponto de Verificação ✅

Antes de continuar, confirme o seguinte:

- [ ] Bot Token configurado corretamente
- [ ] Bot entrou com sucesso no servidor
- [ ] Message Content Intent habilitado
- [ ] Gateway está em execução
- [ ] Bot exibe como online no Discord
- [ ] @mencionar o Bot recebe resposta

---

## Configurações Avançadas

### Controle de Acesso DM

A estratégia padrão é `pairing` (modo de pareamento), adequado para uso pessoal. Você pode ajustar conforme necessário:

| Estratégia | Descrição | Exemplo de Configuração |
|--- | --- | ---|
| **pairing** (padrão) | Desconhecidos recebem código de pareamento, aprovação manual necessária | `"dm": { "policy": "pairing" }` |
| **allowlist** | Permite apenas usuários na lista | `"dm": { "policy": "allowlist", "allowFrom": ["123456", "alice"] }` |
| **open** | Permite todos (requer `allowFrom` contendo `"*"`) | `"dm": { "policy": "open", "allowFrom": ["*"] }` |
| **disabled** | Desabilita todos os DMs | `"dm": { "enabled": false }` |

#### Exemplo de Configuração: Permitir Usuários Específicos

```json5
{
  channels: {
    discord: {
      dm: {
        enabled: true,
        policy: "allowlist",
        allowFrom: [
          "123456789012345678",  // ID do usuário
          "@alice",                   // Nome de usuário (será resolvido para ID)
          "alice#1234"              // Nome de usuário completo
        ]
      }
    }
  }
}
```

#### Aprovar Solicitação de Pareamento

Quando um usuário desconhecido enviar DM pela primeira vez, ele receberá um código de pareamento. Método de aprovação:

```bash
clawdbot pairing approve discord <código_de_pareamento>
```

### Configuração de Canais do Servidor

#### Configuração Básica: Permitir Apenas Canais Específicos

```json5
{
  channels: {
    discord: {
      groupPolicy: "allowlist",  // Modo de lista branca (padrão)
      guilds: {
        "123456789012345678": {
          requireMention: true,  // Requer @menção para responder
          channels: {
            help: { allow: true },    // Permitir #help
            general: { allow: true } // Permitir #general
          }
        }
      }
    }
  }
}
```

::: tip
`requireMention: true` é uma configuração recomendada, evita que o Bot seja "esperto demais" em canais públicos.
:::

#### Configuração Avançada: Comportamento Exclusivo do Canal

```json5
{
  channels: {
    discord: {
      guilds: {
        "123456789012345678": {
          slug: "my-server",              // Nome de exibição (opcional)
          reactionNotifications: "own",      // Apenas reações às próprias mensagens do Bot acionam eventos
          channels: {
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"], // Apenas usuários específicos podem acionar
              skills: ["search", "docs"],    // Limitar habilidades disponíveis
              systemPrompt: "Mantenha respostas abaixo de 50 palavras."  // Prompt de sistema adicional
            }
          }
        }
      }
    }
  }
}
```

### Operações de Ferramentas Discord

O AI Agent pode chamar ferramentas `discord` para executar operações específicas do Discord. Controle permissões através de `channels.discord.actions`:

| Categoria de Operação | Estado Padrão | Descrição |
|--- | --- | ---|
| **reactions** | ✅ Habilitado | Adicionar/ler reações de emoji |
| **messages** | ✅ Habilitado | Ler/enviar/editar/excluir mensagens |
| **threads** | ✅ Habilitado | Criar/responder threads |
| **channels** | ✅ Habilitado | Criar/editar/excluir canais |
| **pins** | ✅ Habilitado | Fixar/desfixar mensagens |
| **search** | ✅ Habilitado | Pesquisar mensagens |
| **memberInfo** | ✅ Habilitado | Consultar informações de membros |
| **roleInfo** | ✅ Habilitado | Consultar lista de cargos |
| **roles** | ❌ **Desabilitado** | Adicionar/remover cargos |
| **moderation** | ❌ **Desabilitado** | Banir/expulsar/timeout |

#### Desabilitar Operações Específicas

```json5
{
  channels: {
    discord: {
      actions: {
        channels: false,      // Desabilitar gerenciamento de canais
        moderation: false,   // Desabilitar operações de moderação
        roles: false         // Desabilitar gerenciamento de cargos
      }
    }
  }
}
```

::: danger Aviso de Segurança
Ao habilitar operações de `moderation` e `roles`, certifique-se de que a AI tenha prompts estritos e controle de acesso, evitando banimentos incorretos de usuários.
:::

### Outras Opções de Configuração

| Item de Configuração | Descrição | Valor Padrão |
|--- | --- | ---|
| `historyLimit` | Número de mensagens históricas no contexto do canal do servidor | 20 |
| `dmHistoryLimit` | Número de mensagens históricas na sessão DM | Sem limite |
| `textChunkLimit` | Número máximo de caracteres por mensagem | 2000 |
| `maxLinesPerMessage` | Número máximo de linhas por mensagem | 17 |
| `mediaMaxMb` | Tamanho máximo de arquivos de mídia (MB) | 8 |
| `chunkMode` | Modo de divisão de mensagens (`length`/`newline`) | `length` |

---

## Cuidados com Armadilhas

### ❌ Erro "Used disallowed intents"

**Causa**: **Message Content Intent** não habilitado.

**Solução**:
1. Volte ao Discord Developer Portal
2. Bot → Privileged Gateway Intents
3. Habilite **Message Content Intent**
4. Reinicie o Gateway

### ❌ Bot Conecta Mas Não Responde

**Possíveis causas**:
1. Falta **Message Content Intent**
2. Bot não tem permissões de canal
3. Configuração exige @menção mas você não mencionou
4. Canal não está na lista branca

**Etapas de solução**:
```bash
# Execute ferramenta de diagnóstico
clawdbot doctor

# Verifique status e permissões do canal
clawdbot channels status --probe
```

### ❌ Código de Pareamento DM Expirou

**Causa**: O código de pareamento é válido por **1 hora**.

**Solução**: Peça ao usuário para enviar DM novamente, obter novo código de pareamento e aprovar.

### ❌ Grupo DM Ignorado

**Causa**: Padrão `dm.groupEnabled: false`.

**Solução**:

```json5
{
  channels: {
    discord: {
      dm: {
        groupEnabled: true,
        groupChannels: ["clawd-dm"]  // Opcional: permitir apenas grupos DM específicos
      }
    }
  }
}
```

---

## Solução de Problemas

### Diagnóstico de Problemas Comuns

```bash
# 1. Verificar se o Gateway está em execução
clawdbot gateway status

# 2. Verificar status de conexão do canal
clawdbot channels status

# 3. Executar diagnóstico completo (Recomendado!)
clawdbot doctor
```

### Depuração de Logs

Use `--verbose` ao iniciar o Gateway para ver logs detalhados:

```bash
clawdbot gateway --port 18789 --verbose
```

**Foque nestes logs**:
- `Discord channel connected: ...` → Conexão bem-sucedida
- `Message received from ...` → Mensagem recebida
- `ERROR: ...` → Informações de erro

---

## Resumo desta Lição

- O canal Discord se conecta através do **discord.js**, suportando DMs e canais do servidor
- Criar um Bot requer quatro etapas: **aplicativo, usuário Bot, Gateway Intents, URL de convite**
- **Message Content Intent** é obrigatório, caso contrário o Bot não consegue ler mensagens
- **Proteção de Pareamento DM** é habilitada por padrão, desconhecidos precisam parear para conversar
- Canais do servidor podem ser configurados via `guilds.<id>.channels` para lista branca e comportamentos
- A AI pode chamar ferramentas Discord para executar operações de gerenciamento (controlável via `actions`)

---

## Próxima Aula

> Na próxima aula, aprenderemos sobre **[Canal Google Chat](../googlechat/)**.
>
> Você aprenderá:
> - Como configurar autenticação OAuth do Google Chat
> - Roteamento de mensagens no Google Chat Space
> - Limitações do uso da API do Google Chat

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Número da Linha |
|--- | --- | ---|
| Schema de Configuração do Discord Bot | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L320-L427) | 320-427 |
| Assistente de Onboarding do Discord | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 1-485 |
| Operações de Ferramentas do Discord | [`src/agents/tools/discord-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions.ts) | 1-72 |
| Operações de Mensagens do Discord | [`src/agents/tools/discord-actions-messaging.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-messaging.ts) | - |
| Operações de Servidor do Discord | [`src/agents/tools/discord-actions-guild.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-guild.ts) | - |
| Documentação Oficial do Discord | [`docs/channels/discord.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/discord.md) | 1-400 |

**Campos Schema Principais**:
- `DiscordAccountSchema`: Configuração da conta Discord (token, guilds, dm, actions, etc.)
- `DiscordDmSchema`: Configuração DM (enabled, policy, allowFrom, groupEnabled)
- `DiscordGuildSchema`: Configuração do servidor (slug, requireMention, reactionNotifications, channels)
- `DiscordGuildChannelSchema`: Configuração do canal (allow, requireMention, skills, systemPrompt)

**Funções Principais**:
- `handleDiscordAction()`: Ponto de entrada para processamento de operações de ferramentas Discord
- `discordOnboardingAdapter.configure()`: Fluxo de configuração assistida

</details>
