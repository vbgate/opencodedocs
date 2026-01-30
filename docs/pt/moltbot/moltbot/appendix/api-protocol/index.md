---
title: "Guia Completo do Protocolo Gateway WebSocket API | Clawdbot Tutorial"
sidebarTitle: "Desenvolver Cliente Personalizado"
subtitle: "Guia Completo do Protocolo Gateway WebSocket API"
description: "Aprenda a especificação completa do protocolo Clawdbot Gateway WebSocket, incluindo handshake de conexão, formato de frames de mensagem, modelo de requisição/resposta, envio de eventos, sistema de permissões e todos os métodos disponíveis. Este tutorial fornece referência completa da API e exemplos de integração de clientes para ajudá-lo a implementar rapidamente a integração do cliente personalizado com o Gateway."
tags:
  - "API"
  - "WebSocket"
  - "Protocolo"
  - "Desenvolvedor"
prerequisite:
  - "start-gateway-startup"
  - "advanced-session-management"
order: 350
---

# Guia Completo do Protocolo Gateway WebSocket API

## O que você aprenderá

- 📡 Conectar-se com sucesso ao servidor Gateway WebSocket
- 🔄 Enviar requisições e processar respostas
- 📡 Receber eventos enviados pelo servidor
- 🔐 Entender o sistema de permissões e realizar autenticação
- 🛠️ Chamar todos os métodos Gateway disponíveis
- 📖 Compreender o formato de frames de mensagem e tratamento de erros

## Sua situação atual

Você pode estar desenvolvendo um cliente personalizado (como um aplicativo móvel, aplicativo web ou ferramenta de linha de comando) e precisa se comunicar com o Clawdbot Gateway. O protocolo WebSocket do Gateway parece complexo, e você precisa:

- Entender como estabelecer conexão e autenticação
- Compreender o formato de mensagens de requisição/resposta
- Saber os métodos disponíveis e seus parâmetros
- Tratar eventos enviados pelo servidor
- Entender o sistema de permissões

**Boa notícia**: O protocolo Gateway WebSocket API foi projetado de forma clara, e este tutorial fornece um guia de referência completo para você.

## Quando usar este recurso

::: info Cenários de uso
Use este protocolo quando precisar:
- Desenvolver clientes personalizados conectados ao Gateway
- Implementar WebChat ou aplicativos móveis
- Criar ferramentas de monitoramento ou gerenciamento
- Integrar o Gateway a sistemas existentes
- Depurar e testar funcionalidades do Gateway
:::

## Conceito principal

O Clawdbot Gateway usa o protocolo WebSocket para fornecer comunicação bidirecional em tempo real. O protocolo é baseado em frames de mensagens no formato JSON, divididos em três tipos:

1. **Frame de Requisição (Request Frame)**: Cliente envia requisições
2. **Frame de Resposta (Response Frame)**: Servidor retorna respostas
3. **Frame de Evento (Event Frame)**: Servidor envia eventos ativamente

::: tip Filosofia de design
O protocolo adota o modelo "requisição-resposta" + modo "envio de eventos":
- Cliente inicia requisições ativamente, servidor retorna respostas
- Servidor pode enviar eventos ativamente, sem necessidade de requisição do cliente
- Todas as operações são realizadas através de uma conexão WebSocket unificada
:::

## Handshake de conexão

### Etapa 1: Estabelecer conexão WebSocket

O Gateway escuta por padrão em `ws://127.0.0.1:18789` (pode ser modificado via configuração).

::: code-group

```javascript [JavaScript]
// Estabelecer conexão WebSocket
const ws = new WebSocket('ws://127.0.0.1:18789/v1/connect');

ws.onopen = () => {
  console.log('WebSocket conectado');
};
```

```python [Python]
import asyncio
import websockets

async def connect():
    uri = "ws://127.0.0.1:18789/v1/connect"
    async with websockets.connect(uri) as websocket:
        print("WebSocket conectado")
```

```bash [Bash]
# Usar ferramenta wscat para testar conexão
wscat -c ws://127.0.0.1:18789/v1/connect
```

:::

### Etapa 2: Enviar mensagem de handshake

Após estabelecer a conexão, o cliente precisa enviar uma mensagem de handshake para completar a autenticação e negociação de versão.

```json
{
  "minProtocol": 1,
  "maxProtocol": 3,
  "client": {
    "id": "my-app-v1",
    "displayName": "Meu Cliente Personalizado",
    "version": "1.0.0",
    "platform": "web",
    "mode": "operator",
    "instanceId": "unique-instance-id"
  },
  "caps": [],
  "commands": [],
  "auth": {
    "token": "your-token-here"
  }
}
```

**Por que**: A mensagem de handshake informa ao servidor:
- O intervalo de versões de protocolo suportadas pelo cliente
- Informações básicas do cliente
- Credenciais de autenticação (token ou password)

**Você deve ver**: O servidor retorna a mensagem `hello-ok`

```json
{
  "type": "hello-ok",
  "protocol": 3,
  "server": {
    "version": "v2026.1.24",
    "commit": "abc123",
    "host": "my-mac",
    "connId": "conn-123456"
  },
  "features": {
    "methods": ["agent", "send", "chat.send", ...],
    "events": ["agent.event", "chat.event", ...]
  },
  "snapshot": {
    "presence": [...],
    "health": {...},
    "stateVersion": {...},
    "uptimeMs": 12345678
  },
  "auth": {
    "deviceToken": "device-token-here",
    "role": "operator",
    "scopes": ["operator.read", "operator.write"]
  },
  "policy": {
    "maxPayload": 1048576,
    "maxBufferedBytes": 10485760,
    "tickIntervalMs": 30000
  }
}
```

::: info Descrição dos campos Hello-Ok
- `protocol`: Versão do protocolo usada pelo servidor
- `server.version`: Número da versão do Gateway
- `features.methods`: Lista de todos os métodos disponíveis
- `features.events`: Lista de todos os eventos que podem ser assinados
- `snapshot`: Snapshot do estado atual
- `auth.scopes`: Escopos de permissão concedidos ao cliente
- `policy.maxPayload`: Tamanho máximo de uma única mensagem
- `policy.tickIntervalMs`: Intervalo do heartbeat
:::

### Etapa 3: Verificar estado da conexão

Após o handshake bem-sucedido, você pode enviar uma requisição de health check para verificar a conexão:

```json
{
  "type": "req",
  "id": "req-1",
  "method": "health",
  "params": {}
}
```

**Você deve ver**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "status": "ok",
    "uptimeMs": 12345678
  }
}
```

## Formato de Frames de Mensagem

### Frame de Requisição (Request Frame)

Todas as requisições enviadas pelo cliente seguem o formato de frame de requisição:

```json
{
  "type": "req",
  "id": "unique-request-id",
  "method": "method.name",
  "params": {
    // Parâmetros do método
  }
}
```

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `type` | string | Sim | Valor fixo `"req"` |
| `id` | string | Sim | Identificador único da requisição, usado para corresponder respostas |
| `method` | string | Sim | Nome do método, como `"agent"`, `"send"` |
| `params` | object | Não | Parâmetros do método, formato específico depende do método |

::: warning Importância do ID da Requisição
Cada requisição deve ter um `id` único. O servidor usa o `id` para associar a resposta à requisição. Se múltiplas requisições usarem o mesmo `id`, as respostas não poderão ser corretamente correspondidas.
:::

### Frame de Resposta (Response Frame)

O servidor retorna um frame de resposta para cada requisição:

```json
{
  "type": "res",
  "id": "unique-request-id",
  "ok": true,
  "payload": {
    // Dados da resposta
  },
  "error": {
    // Informações de erro (apenas quando ok=false)
  }
}
```

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `type` | string | Sim | Valor fixo `"res"` |
| `id` | string | Sim | ID da requisição correspondente |
| `ok` | boolean | Sim | Se a requisição foi bem-sucedida |
| `payload` | any | Não | Dados da resposta em caso de sucesso |
| `error` | object | Não | Informações de erro em caso de falha |

**Exemplo de Resposta de Sucesso**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "agents": [
      { "id": "agent-1", "name": "Default Agent" }
    ]
  }
}
```

**Exemplo de Resposta de Falha**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: message",
    "retryable": false
  }
}
```

### Frame de Evento (Event Frame)

O servidor pode enviar eventos ativamente, sem necessidade de requisição do cliente:

```json
{
  "type": "event",
  "event": "event.name",
  "payload": {
    // Dados do evento
  },
  "seq": 123,
  "stateVersion": {
    "presence": 456,
    "health": 789
  }
}
```

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `type` | string | Sim | Valor fixo `"event"` |
| `event` | string | Sim | Nome do evento |
| `payload` | any | Não | Dados do evento |
| `seq` | number | Não | Número de sequência do evento |
| `stateVersion` | object | Não | Número de versão do estado |

**Exemplos comuns de eventos**:

```json
// Evento de heartbeat
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}

// Evento de Agent
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Pensando..."
    }
  }
}

// Evento de chat
{
  "type": "event",
  "event": "chat.event",
  "payload": {
    "runId": "run-123",
    "sessionKey": "main",
    "seq": 1,
    "state": "delta",
    "message": {
      "role": "assistant",
      "content": "Olá!"
    }
  }
}

// Evento de desligamento
{
  "type": "event",
  "event": "shutdown",
  "payload": {
    "reason": "Reinicialização do sistema",
    "restartExpectedMs": 5000
  }
}
```

## Autenticação e Permissões

### Métodos de autenticação

O Gateway suporta três métodos de autenticação:

#### 1. Autenticação por Token (recomendado)

Forneça o token na mensagem de handshake:

```json
{
  "auth": {
    "token": "your-security-token"
  }
}
```

O Token é definido no arquivo de configuração:

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secret-token-here"
    }
  }
}
```

#### 2. Autenticação por Senha

```json
{
  "auth": {
    "password": "your-password"
  }
}
```

A Senha é definida no arquivo de configuração:

```json
{
  "gateway": {
    "auth": {
      "mode": "password",
      "password": "your-password-here"
    }
  }
}
```

#### 3. Tailscale Identity (autenticação de rede)

Ao usar Tailscale Serve/Funnel, você pode autenticar através do Tailscale Identity:

```json
{
  "client": {
    "mode": "operator"
  },
  "device": {
    "id": "device-id",
    "publicKey": "public-key",
    "signature": "signature",
    "signedAt": 1706707200000
  }
}
```

### Escopos de Permissão (Scopes)

Após o handshake, o cliente obtém um conjunto de escopos de permissão, determinando quais métodos pode chamar:

| Escopo | Permissão | Métodos Disponíveis |
| --- | --- | --- |
| `operator.admin` | Administrador | Todos os métodos, incluindo modificação de configuração, Wizard, atualizações, etc. |
| `operator.write` | Escrita | Enviar mensagens, chamar Agent, modificar sessões, etc. |
| `operator.read` | Somente leitura | Consultar status, logs, configurações, etc. |
| `operator.approvals` | Aprovação | Métodos relacionados a aprovação Exec |
| `operator.pairing` | Emparelhamento | Métodos relacionados a emparelhamento de nós e dispositivos |

::: info Verificação de Permissões
O servidor verifica as permissões a cada requisição. Se o cliente não tiver a permissão necessária, a requisição será negada:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "missing scope: operator.admin"
  }
}
```
:::

### Sistema de Papéis

Além dos escopos, o protocolo também suporta um sistema de papéis:

| Papel | Descrição | Permissões Especiais |
| --- | --- | --- |
| `operator` | Operador | Pode chamar todos os métodos Operator |
| `node` | Nó de dispositivo | Somente pode chamar métodos exclusivos de Node |
| `device` | Dispositivo | Pode chamar métodos relacionados a dispositivos |

Os papéis de nó são atribuídos automaticamente durante o emparelhamento de dispositivos, usados para comunicação entre nós de dispositivos e o Gateway.

## Métodos Principais

### Métodos de Agent

#### `agent` - Enviar mensagem para o Agent

Envia uma mensagem para o AI Agent e obtém uma resposta em streaming.

```json
{
  "type": "req",
  "id": "req-1",
  "method": "agent",
  "params": {
    "message": "Olá, por favor, escreva um Hello World",
    "agentId": "default",
    "sessionId": "main",
    "idempotencyKey": "msg-123"
  }
}
```

**Descrição dos Parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `message` | string | Sim | Conteúdo da mensagem do usuário |
| `agentId` | string | Não | ID do Agent, usa o Agent padrão configurado por padrão |
| `sessionId` | string | Não | ID da sessão |
| `sessionKey` | string | Não | Chave da sessão |
| `to` | string | Não | Destino do envio (canal) |
| `channel` | string | Não | Nome do canal |
| `accountId` | string | Não | ID da conta |
| `thinking` | string | Não | Conteúdo do pensamento |
| `deliver` | boolean | Não | Se envia para o canal |
| `attachments` | array | Não | Lista de anexos |
| `timeout` | number | Não | Tempo de timeout (milissegundos) |
| `lane` | string | Não | Canal de agendamento |
| `extraSystemPrompt` | string | Não | Prompt de sistema extra |
| `idempotencyKey` | string | Sim | Chave de idempotência, evita duplicação |

**Resposta**:

A resposta do Agent é enviada em streaming através de frames de evento:

```json
// Evento de thinking
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Pensando..."
    }
  }
}

// Evento de mensagem
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 1,
    "stream": "message",
    "ts": 1706707200000,
    "data": {
      "role": "assistant",
      "content": "Olá! Este é um Hello World..."
    }
  }
}
```

#### `agent.wait` - Aguardar conclusão do Agent

Aguarda a conclusão da tarefa do Agent.

```json
{
  "type": "req",
  "id": "req-2",
  "method": "agent.wait",
  "params": {
    "runId": "run-123",
    "timeoutMs": 30000
  }
}
```

### Métodos de Send

#### `send` - Enviar mensagem para o canal

Envia uma mensagem para o canal especificado.

```json
{
  "type": "req",
  "id": "req-3",
  "method": "send",
  "params": {
    "to": "+1234567890",
    "message": "Olá do Clawdbot!",
    "channel": "whatsapp",
    "idempotencyKey": "send-123"
  }
}
```

**Descrição dos Parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `to` | string | Sim | Identificador do destinatário (número de telefone, ID de usuário, etc.) |
| `message` | string | Sim | Conteúdo da mensagem |
| `mediaUrl` | string | Não | URL da mídia |
| `mediaUrls` | array | Não | Lista de URLs de mídia |
| `channel` | string | Não | Nome do canal |
| `accountId` | string | Não | ID da conta |
| `sessionKey` | string | Não | Chave da sessão (usada para espelhar saída) |
| `idempotencyKey` | string | Sim | Chave de idempotência |

### Métodos de Poll

#### `poll` - Criar Enquete

Cria uma enquete e envia para o canal.

```json
{
  "type": "req",
  "id": "req-4",
  "method": "poll",
  "params": {
    "to": "+1234567890",
    "question": "Qual é sua linguagem de programação favorita?",
    "options": ["Python", "JavaScript", "Go", "Rust"],
    "maxSelections": 1,
    "durationHours": 24,
    "channel": "telegram",
    "idempotencyKey": "poll-123"
  }
}
```

### Métodos de Sessions

#### `sessions.list` - Listar Sessões

Lista todas as sessões ativas.

```json
{
  "type": "req",
  "id": "req-5",
  "method": "sessions.list",
  "params": {
    "limit": 50,
    "activeMinutes": 60,
    "includeDerivedTitles": true,
    "includeLastMessage": true
  }
}
```

**Descrição dos Parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `limit` | number | Não | Quantidade máxima de retornos |
| `activeMinutes` | number | Não | Filtrar sessões ativas recentemente (minutos) |
| `includeGlobal` | boolean | Não | Incluir sessões globais |
| `includeUnknown` | boolean | Não | Incluir sessões desconhecidas |
| `includeDerivedTitles` | boolean | Não | Derivar títulos da primeira linha da mensagem |
| `includeLastMessage` | boolean | Não | Incluir preview da última mensagem |
| `label` | string | Não | Filtrar por etiqueta |
| `agentId` | string | Não | Filtrar por ID do Agent |
| `search` | string | Não | Palavra-chave de busca |

#### `sessions.patch` - Modificar Configuração da Sessão

Modifica os parâmetros de configuração da sessão.

```json
{
  "type": "req",
  "id": "req-6",
  "method": "sessions.patch",
  "params": {
    "key": "main",
    "label": "Sessão Principal",
    "thinkingLevel": "minimal",
    "responseUsage": "tokens",
    "model": "claude-sonnet-4-20250514"
  }
}
```

#### `sessions.reset` - Reiniciar Sessão

Limpa o histórico da sessão.

```json
{
  "type": "req",
  "id": "req-7",
  "method": "sessions.reset",
  "params": {
    "key": "main"
  }
}
```

#### `sessions.delete` - Excluir Sessão

Exclui a sessão e seu histórico.

```json
{
  "type": "req",
  "id": "req-8",
  "method": "sessions.delete",
  "params": {
    "key": "session-123",
    "deleteTranscript": true
  }
}
```

#### `sessions.compact` - Compactar Histórico da Sessão

Compacta o histórico da sessão para reduzir o tamanho do contexto.

```json
{
  "type": "req",
  "id": "req-9",
  "method": "sessions.compact",
  "params": {
    "key": "main",
    "maxLines": 100
  }
}
```

### Métodos de Config

#### `config.get` - Obter Configuração

Obtém a configuração atual.

```json
{
  "type": "req",
  "id": "req-10",
  "method": "config.get",
  "params": {}
}
```

#### `config.set` - Definir Configuração

Define uma nova configuração.

```json
{
  "type": "req",
  "id": "req-11",
  "method": "config.set",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash"
  }
}
```

#### `config.apply` - Aplicar Configuração e Reiniciar

Aplica a configuração e reinicia o Gateway.

```json
{
  "type": "req",
  "id": "req-12",
  "method": "config.apply",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash",
    "restartDelayMs": 1000
  }
}
```

#### `config.schema` - Obter Schema de Configuração

Obtém a definição do Schema de configuração.

```json
{
  "type": "req",
  "id": "req-13",
  "method": "config.schema",
  "params": {}
}
```

### Métodos de Channels

#### `channels.status` - Obter Status dos Canais

Obtém o status de todos os canais.

```json
{
  "type": "req",
  "id": "req-14",
  "method": "channels.status",
  "params": {
    "probe": true,
    "timeoutMs": 5000
  }
}
```

**Exemplo de Resposta**:

```json
{
  "type": "res",
  "id": "req-14",
  "ok": true,
  "payload": {
    "ts": 1706707200000,
    "channelOrder": ["whatsapp", "telegram", "slack"],
    "channelLabels": {
      "whatsapp": "WhatsApp",
      "telegram": "Telegram",
      "slack": "Slack"
    },
    "channelAccounts": {
      "whatsapp": [
        {
          "accountId": "wa-123",
          "enabled": true,
          "linked": true,
          "connected": true,
          "lastConnectedAt": 1706707200000
        }
      ]
    }
  }
}
```

#### `channels.logout` - Fazer Logout do Canal

Faz logout do canal especificado.

```json
{
  "type": "req",
  "id": "req-15",
  "method": "channels.logout",
  "params": {
    "channel": "whatsapp",
    "accountId": "wa-123"
  }
}
```

### Métodos de Models

#### `models.list` - Listar Modelos Disponíveis

Lista todos os modelos de IA disponíveis.

```json
{
  "type": "req",
  "id": "req-16",
  "method": "models.list",
  "params": {}
}
```

**Exemplo de Resposta**:

```json
{
  "type": "res",
  "id": "req-16",
  "ok": true,
  "payload": {
    "models": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "provider": "anthropic",
        "contextWindow": 200000,
        "reasoning": true
      },
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "provider": "openai",
        "contextWindow": 128000,
        "reasoning": false
      }
    ]
  }
}
```

### Métodos de Agents

#### `agents.list` - Listar Todos os Agents

Lista todos os Agents disponíveis.

```json
{
  "type": "req",
  "id": "req-17",
  "method": "agents.list",
  "params": {}
}
```

**Exemplo de Resposta**:

```json
{
  "type": "res",
  "id": "req-17",
  "ok": true,
  "payload": {
    "defaultId": "default",
    "mainKey": "main",
    "scope": "per-sender",
    "agents": [
      {
        "id": "default",
        "name": "Default Agent",
        "identity": {
          "name": "Clawdbot",
          "theme": "default",
          "emoji": "🤖"
        }
      }
    ]
  }
}
```

