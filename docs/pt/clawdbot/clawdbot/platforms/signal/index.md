---
title: "Configuração do Canal Signal: Integração de Assistente AI Seguro com signal-cli | Tutorial Clawdbot"
sidebarTitle: "Conecte seu Signal Privado"
subtitle: "Configuração do Canal Signal: Integração de Assistente AI Seguro com signal-cli | Tutorial Clawdbot"
description: "Aprenda a configurar o canal Signal no Clawdbot, incluindo instalação do signal-cli, vinculação de conta, suporte a múltiplas contas, mecanismo de pareamento DM, mensagens de grupo e controle de acesso. Este tutorial explica em detalhes o processo completo desde a instalação até o uso, ajudando você a criar rapidamente um assistente AI pessoal baseado no Signal."
tags:
  - "Signal"
  - "signal-cli"
  - "Configuração de Canal"
  - "Plataforma de Mensagens"
prerequisite:
  - "start-getting-started"
order: 120
---

# Configuração do Canal Signal: Conecte-se ao Assistente AI Pessoal com signal-cli | Tutorial Clawdbot

## O Que Você Poderá Fazer Após Concluir

Ao concluir esta lição, você será capaz de:

- ✅ Instalar e configurar o signal-cli
- ✅ Configurar o canal Signal no Clawdbot
- ✅ Interagir com o assistente AI por DM e grupos
- ✅ Usar o mecanismo de pareamento DM para proteger sua conta
- ✅ Configurar suporte a múltiplas contas Signal
- ✅ Usar indicadores de digitação, recibo de leitura e Reactions do Signal

## O Seu Problema Atual

Você deseja usar um assistente AI no Signal, mas encontrou estes problemas:

- ❌ Não sabe como conectar Signal e Clawdbot
- ❌ Preocupado com questões de privacidade, não quer fazer upload de dados para a nuvem
- ❌ Não sabe como controlar quem pode enviar mensagens para o assistente AI
- ❌ Precisa alternar entre múltiplas contas Signal

::: info Por que escolher Signal?
Signal é um aplicativo de mensagens instantâneas com criptografia de ponta a ponta. Todas as comunicações são criptografadas, apenas o remetente e o destinatário podem ler as mensagens. O Clawdbot se integra através do signal-cli, permitindo que você desfrute da funcionalidade do assistente AI mantendo sua privacidade.
:::

## Quando Usar Esta Técnica

**Cenários adequados para usar o canal Signal**:

- Você precisa de um canal de comunicação com privacidade como prioridade
- Sua equipe ou grupos de amigos usam Signal
- Você precisa executar o assistente AI em seu dispositivo pessoal (local primeiro)
- Você precisa controlar o acesso através do mecanismo de pareamento DM protegido

::: tip Número Signal independente
Recomenda-se usar um **número Signal independente** como conta do bot, em vez de seu número pessoal. Isso evita loops de mensagens (o bot ignora suas próprias mensagens) e mantém o trabalho e a comunicação pessoal separados.
:::

## 🎒 Preparativos Antes de Começar

Antes de começar, verifique se você concluiu as seguintes etapas:

::: warning Pré-requisitos
- ✅ Já completou o tutorial [Início Rápido](../../start/getting-started/)
- ✅ Clawdbot está instalado e funcionando normalmente
- ✅ Pelo menos um provedor de modelo de AI configurado (Anthropic, OpenAI, OpenRouter, etc.)
- ✅ Java instalado (necessário para o signal-cli)
:::

## Ideia Central

A integração Signal do Clawdbot é baseada no **signal-cli** e funciona da seguinte maneira:

1. **Modo Daemon**: O signal-cli é executado como um daemon de segundo plano, fornecendo uma interface HTTP JSON-RPC
2. **Event Stream (SSE)**: O Clawdbot recebe eventos de signal através de Server-Sent Events (SSE)
3. **Padronização de Mensagens**: As mensagens Signal são convertidas para um formato interno unificado e, em seguida, roteadas para o AI Agent
4. **Roteamento Determinístico**: Todas as respostas são enviadas de volta ao remetente ou grupo da mensagem original

**Princípios-chave de design**:

- **Local First**: O signal-cli é executado em seu dispositivo, todas as comunicações são criptografadas
- **Suporte a Múltiplas Contas**: Você pode configurar múltiplas contas Signal
- **Controle de Acesso**: O mecanismo de pareamento DM é ativado por padrão, estranhos precisam de aprovação para enviar mensagens
- **Isolamento de Contexto**: As mensagens de grupo têm contextos de sessão independentes, não são misturadas com DMs

## Siga-me

### Etapa 1: Instalar o signal-cli

**Por que**
signal-cli é a interface de linha de comando do Signal, através da qual o Clawdbot se comunica com a rede Signal.

**Métodos de Instalação**

::: code-group

```bash [macOS (Homebrew)]
brew install signal-cli
```

```bash [Linux (Ubuntu/Debian)]
# Visite https://github.com/AsamK/signal-cli/releases para ver a versão mais recente
# Baixe o pacote de lançamento signal-cli mais recente (substitua VERSION pelo número da versão real)
wget https://github.com/AsamK/signal-cli/releases/download/vVERSION/signal-cli-VERSION.tar.gz

# Extraia para o diretório /opt
sudo tar -xvf signal-cli-VERSION.tar.gz -C /opt/

# Crie um link simbólico (opcional)
sudo ln -s /opt/signal-cli-VERSION/bin/signal-cli /usr/local/bin/signal-cli
```

```bash [Windows (WSL2)]
# Use o método de instalação Linux no WSL2
# Nota: Windows usa WSL2, a instalação do signal-cli segue o fluxo Linux
```

:::

**Verificar Instalação**

```bash
signal-cli --version
# Você deve ver: número da versão do signal-cli (como 0.13.x ou superior)
```

**Você deve ver**: A saída do número da versão do signal-cli.

::: danger Requisito Java
signal-cli requer um tempo de execução Java (geralmente Java 11 ou superior). Certifique-se de ter instalado e configurado o Java:

```bash
java -version
# Você deve ver: openjdk version "11.x.x" ou superior
```

**Nota**: Para requisitos específicos de versão do Java, consulte a [documentação oficial do signal-cli](https://github.com/AsamK/signal-cli#readme).
:::

### Etapa 2: Vincular a Conta Signal

**Por que**
Depois de vincular a conta, o signal-cli pode enviar e receber mensagens em nome de seu número Signal.

**Recomendação**: Use um número Signal independente como conta do bot.

**Etapas de Vinculação**

1. **Gerar comando de vinculação**:

```bash
signal-cli link -n "Clawdbot"
```

`-n "Clawdbot"` especifica o nome do dispositivo como "Clawdbot" (você pode personalizar).

2. **Escaneie o QR Code**:

Após executar o comando, o terminal exibirá um QR code:

```
tsconfig: 2369:35 - warning - *! is deprecated: Use .nonNull().
  (deprecated-non-null)

To link your device, navigate to
  Signal Settings > Linked Devices > (+) Link New Device
  on your phone and scan the QR code displayed below.

██████████████████████████████████████████████
██████████████████████████████████████████████
██████████████████████████████████████████████
██████████████████████████████████████████████
██████████████████████████████████████████████
...
```

3. **No aplicativo Signal do celular**:

   - Abra as configurações do Signal
   - Selecione "Dispositivos Vinculados" (Linked Devices)
   - Clique em "(+) Vincular Novo Dispositivo" (Link New Device)
   - Escaneie o QR code exibido no terminal

**Você deve ver**: Após a vinculação bem-sucedida, o terminal exibirá uma saída semelhante a esta:

```
INFO  Account restored (Number: +15551234567)
INFO  Configuration created at: ~/.local/share/signal-cli/data
```

::: tip Suporte a múltiplos dispositivos
Signal permite vincular até 4 dispositivos. O Clawdbot será executado como um desses dispositivos. Você pode visualizar e gerenciar esses dispositivos em "Dispositivos Vinculados" no aplicativo Signal do celular.
:::

### Etapa 3: Configurar o Canal Signal do Clawdbot

**Por que**
O arquivo de configuração diz ao Clawdbot como se conectar ao signal-cli e como processar mensagens do Signal.

**Métodos de Configuração**

Existem três métodos de configuração, escolha o mais adequado para você:

#### Método 1: Configuração Rápida (Conta Única)

Este é o método mais simples, adequado para cenários de conta única.

Edite `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "account": "+15551234567",
      "cliPath": "signal-cli",
      "dmPolicy": "pairing",
      "allowFrom": ["+15557654321"]
    }
  }
}
```

**Descrição da Configuração**:

| Campo | Valor | Descrição |
|-------|-------|-----------|
| `enabled` | `true` | Ativar o canal Signal |
| `account` | `"+15551234567"` | Sua conta Signal (formato E.164) |
| `cliPath` | `"signal-cli"` | Caminho do comando signal-cli |
| `dmPolicy` | `"pairing"` | Política de acesso DM (modo de pareamento padrão) |
| `allowFrom` | `["+15557654321"]` | Lista branca de números permitidos para enviar DM |

#### Método 2: Configuração de Múltiplas Contas

Se você precisa gerenciar múltiplas contas Signal, use o objeto `accounts`:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "accounts": {
        "work": {
          "account": "+15551234567",
          "name": "Work Bot",
          "httpPort": 8080,
          "dmPolicy": "pairing",
          "allowFrom": ["+15557654321"]
        },
        "personal": {
          "account": "+15559876543",
          "name": "Personal Bot",
          "httpPort": 8081,
          "dmPolicy": "allowlist",
          "allowFrom": ["*"]
        }
      }
    }
  }
}
```

**Descrição da Configuração**:

- Cada conta tem um ID único (como `work`, `personal`)
- Cada conta pode ter diferentes portas, políticas e permissões
- `name` é um nome de exibição opcional, usado para listas CLI/UI

#### Método 3: Modo Daemon Externo

Se você deseja gerenciar o signal-cli você mesmo (por exemplo, em um contêiner ou CPU compartilhada), desative a inicialização automática:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "httpUrl": "http://127.0.0.1:8080",
      "autoStart": false
    }
  }
}
```

**Descrição da Configuração**:

- `httpUrl`: URL completa do daemon (substitui `httpHost` e `httpPort`)
- `autoStart`: Defina como `false` para desativar a inicialização automática do signal-cli
- O Clawdbot se conectará ao daemon signal-cli já em execução

**Você deve ver**: Após salvar o arquivo de configuração, sem erros de sintaxe.

::: tip Validação de Configuração
O Clawdbot validará a configuração na inicialização. Se houver erros na configuração, informações detalhadas de erro serão exibidas nos logs.
:::

### Etapa 4: Iniciar o Gateway

**Por que**
Após iniciar o Gateway, o Clawdbot iniciará automaticamente o daemon signal-cli (a menos que você tenha desativado `autoStart`) e começará a ouvir mensagens do Signal.

**Comando de Inicialização**

```bash
clawdbot gateway start
```

**Você deve ver**: Uma saída semelhante a esta:

```
[INFO] Starting Clawdbot Gateway...
[INFO] Starting signal-cli daemon...
[INFO] signal-cli: INFO  Starting daemon...
[INFO] signal-cli: INFO  Daemon started on http://127.0.0.1:8080
[INFO] Signal channel ready (account: +15551234567)
[INFO] Gateway listening on ws://127.0.0.1:18789
[INFO] Clawdbot Gateway started successfully
```

**Verificar Status do Canal**

```bash
clawdbot channels status
```

**Você deve ver**: Uma saída semelhante a esta:

```
Signal Channels:
  ├─ +15551234567 (Work Bot)
  │   ├─ Status: Connected
  │   ├─ Daemon: http://127.0.0.1:8080
  │   └─ Mode: Auto-start
```

### Etapa 5: Enviar a Primeira Mensagem

**Por que**
Verificar se a configuração está correta, garantindo que o Clawdbot possa receber e processar mensagens do Signal.

**Enviar Mensagem**

1. **Do seu aplicativo Signal do celular**, envie uma mensagem para o número do bot:

```
你好，Clawdbot！
```

2. **Tratamento da primeira mensagem**:

   Se `dmPolicy="pairing"` (padrão), estranhos receberão um código de pareamento:

   ```
   ❌ Remetente não autorizado

   Para continuar, aprove este pareamento usando o seguinte código:

   📝 Código de Pareamento: ABC123

   O código expirará em 1 hora.

   Para aprovar, execute:
   clawdbot pairing approve signal ABC123
   ```

3. **Aprovar pareamento**:

   ```bash
   clawdbot pairing list signal
   ```

   Liste solicitações de pareamento pendentes:

   ```
   Pending Pairings (Signal):
     ├─ ABC123
     │   ├─ Sender: +15557654321
     │   ├─ UUID: uuid:123e4567-e89b-12d3-a456-426614174000
     │   └─ Expires: 2026-01-27 12:00:00
   ```

   Aprovar pareamento:

   ```bash
   clawdbot pairing approve signal ABC123
   ```

4. **Enviar a segunda mensagem**:

   Após o pareamento bem-sucedido, envie a mensagem novamente:

   ```
   你好，Clawdbot！
   ```

**Você deve ver**:

- O aplicativo Signal do celular recebe a resposta da AI:
  ```
  你好！我是 Clawdbot，你的个人 AI 助手。有什么可以帮助你的吗？
  ```

- Logs do Gateway exibidos:
  ```
  [INFO] Received Signal message from +15557654321
  [INFO] Processing message through Agent...
  [INFO] Sending Signal response to +15557654321
  ```

**Ponto de Verificação ✅**:

- [ ] Daemon signal-cli em execução
- [ ] Status do canal exibe "Connected"
- [ ] Recebeu resposta da AI após enviar mensagem
- [ ] Logs do Gateway sem informações de erro

::: danger Suas próprias mensagens serão ignoradas
Se você executar o bot em seu número Signal pessoal, o bot ignorará as mensagens que você mesmo envia (proteção de loop). Recomenda-se usar um número de bot independente.
:::

## Aviso de Armadilhas

### Armadilha 1: Falha ao iniciar o signal-cli

**Problema**: O daemon signal-cli não pode ser iniciado

**Possíveis Causas**:

1. Java não instalado ou versão muito baixa
2. Porta já em uso
3. Caminho do signal-cli incorreto

**Solução**:

```bash
# Verificar versão do Java
java -version

# Verificar uso da porta
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows (PowerShell)

# Verificar caminho do signal-cli
which signal-cli
```

### Armadilha 2: Código de pareamento expirou

**Problema**: O código de pareamento expira após 1 hora

**Solução**:

Envie a mensagem novamente, obtenha um novo código de pareamento e aprove dentro de 1 hora.

### Armadilha 3: Mensagens de grupo não respondem

**Problema**: @mencionar o bot em um grupo Signal, mas sem resposta

**Possíveis Causas**:

- `groupPolicy` está definido como `allowlist`, mas você não está em `groupAllowFrom`
- Signal não suporta @menção nativa (ao contrário do Discord/Slack)

**Solução**:

Configure a política de grupo:

```json
{
  "channels": {
    "signal": {
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["+15557654321"]
    }
  }
}
```

Ou use disparo de comando (se `commands.config: true` estiver configurado):

```
@clawdbot help
```

### Armadilha 4: Falha ao baixar arquivos de mídia

**Problema**: Imagens ou anexos em mensagens Signal não podem ser processados

**Possíveis Causas**:

- Tamanho do arquivo excede o limite `mediaMaxMb` (padrão 8MB)
- `ignoreAttachments` está definido como `true`

**Solução**:

```json
{
  "channels": {
    "signal": {
      "mediaMaxMb": 20,
      "ignoreAttachments": false
    }
  }
}
```

### Armadilha 5: Mensagens longas são truncadas

**Problema**: As mensagens enviadas são divididas em vários segmentos

**Causa**: O Signal tem um limite de comprimento de mensagem (padrão 4000 caracteres), o Clawdbot divide automaticamente em blocos

**Solução**:

Ajuste a configuração de divisão em blocos:

```json
{
  "channels": {
    "signal": {
      "textChunkLimit": 2000,
      "chunkMode": "newline"
    }
  }
}
```

Opções `chunkMode`:
- `length` (padrão): Dividir por comprimento
- `newline`: Dividir primeiro por linhas em branco (limites de parágrafo), depois por comprimento

## Resumo da Lição

Nesta lição, completamos a configuração e o uso do canal Signal:

**Conceitos-chave**:
- O canal Signal é baseado no signal-cli, comunicando-se através de HTTP JSON-RPC + SSE
- Recomenda-se usar um número de bot independente para evitar loops de mensagens
- O mecanismo de pareamento DM é ativado por padrão para proteger a segurança da sua conta

**Configurações-chave**:
- `account`: Conta Signal (formato E.164)
- `cliPath`: Caminho do signal-cli
- `dmPolicy`: Política de acesso DM (padrão `pairing`)
- `allowFrom`: Lista branca DM
- `groupPolicy` / `groupAllowFrom`: Política de grupo

**Funcionalidades Práticas**:
- Suporte a múltiplas contas
- Mensagens de grupo (contexto independente)
- Indicadores de digitação
- Recibo de leitura
- Reactions (reações emoji)

**Solução de Problemas**:
- Use `clawdbot channels status` para verificar o status do canal
- Use `clawdbot pairing list signal` para ver solicitações de pareamento pendentes
- Verifique os logs do Gateway para informações detalhadas de erro

## Próximo Passo

> Na próxima lição, aprenderemos sobre o **[Canal iMessage](../imessage/)**.
>
> Você aprenderá:
> - Como configurar o canal iMessage no macOS
> - Usar suporte de extensão BlueBubbles
> - Funcionalidades especiais do iMessage (recibo de leitura, indicadores de digitação, etc.)
> - Integração de nós iOS (Camera, Canvas, Voice Wake)

Continue explorando as poderosas funcionalidades do Clawdbot! 🚀

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade        | Caminho do Arquivo                                                                                    | Linha    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| Cliente RPC Signal | [`src/signal/client.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/client.ts)         | 1-186   |
| Gerenciamento de Daemon Signal | [`src/signal/daemon.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/daemon.ts)         | 1-85    |
| Suporte a múltiplas contas | [`src/signal/accounts.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/accounts.ts)       | 1-84    |
| Monitoramento e tratamento de eventos Signal | [`src/signal/monitor.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/monitor.ts)       | -       |
| Envio de mensagens | [`src/signal/send.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send.ts)             | -       |
| Envio de Reactions | [`src/signal/send-reactions.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send-reactions.ts) | -       |
| Configuração de nível de Reaction | [`src/signal/reaction-level.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/reaction-level.ts) | -       |

**Definições de tipos de configuração**:
- `SignalAccountConfig`: [`src/config/types.signal.ts:13-87`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L13-L87)
- `SignalConfig`: [`src/config/types.signal.ts:89-93`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L89-L93)

**Constantes-chave**:
- `DEFAULT_TIMEOUT_MS = 10_000`: Tempo limite padrão de requisições RPC Signal (10 segundos) Fonte: `src/signal/client.ts:29`
- Porta HTTP padrão: `8080` Fonte: `src/signal/accounts.ts:59`
- Tamanho padrão de divisão de texto: `4000` caracteres Fonte: `docs/channels/signal.md:113`

**Funções-chave**:
- `signalRpcRequest<T>()`: Enviar requisição JSON-RPC para signal-cli Fonte: `src/signal/client.ts:54-90`
- `streamSignalEvents()`: Assinar eventos Signal via SSE Fonte: `src/signal/client.ts:112-185`
- `spawnSignalDaemon()`: Iniciar daemon signal-cli Fonte: `src/signal/daemon.ts:50-84`
- `resolveSignalAccount()`: Resolver configuração de conta Signal Fonte: `src/signal/accounts.ts:49-77`
- `listEnabledSignalAccounts()`: Listar contas Signal habilitadas Fonte: `src/signal/accounts.ts:79-83`

</details>
