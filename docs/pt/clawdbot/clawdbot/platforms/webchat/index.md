---
title: "Interface WebChat: Assistente de IA no Navegador | Tutorial Clawdbot"
sidebarTitle: "Experimente o WebChat"
subtitle: "Interface WebChat: Assistente de IA no Navegador"
description: "Aprenda como usar a interface WebChat integrada do Clawdbot para conversar com seu assistente de IA. Este tutorial cobre métodos de acesso ao WebChat, funcionalidades principais (gerenciamento de sessões, upload de anexos, suporte a Markdown) e configuração de acesso remoto (túnel SSH, Tailscale), sem necessidade de portas adicionais ou configuração separada."
tags:
  - "WebChat"
  - "Interface do navegador"
  - "Chat"
prerequisite:
  - "start-gateway-startup"
order: 150
---

# Interface WebChat: Assistente de IA no Navegador

## O Que Você Vai Aprender

Após concluir este tutorial, você será capaz de:

- ✅ Acessar a interface WebChat através do navegador
- ✅ Enviar mensagens no WebChat e receber respostas da IA
- ✅ Gerenciar histórico de sessões e alternar entre sessões
- ✅ Fazer upload de anexos (imagens, áudio, vídeo)
- ✅ Configurar acesso remoto (Tailscale/túnel SSH)
- ✅ Entender as diferenças entre WebChat e outros canais

## O Seu Desafio Atual

Você provavelmente já iniciou o Gateway, mas gostaria de ter uma interface gráfica mais intuitiva para conversar com o assistente de IA, em vez de usar apenas a linha de comando.

Você pode estar se perguntando:

- "Existe alguma interface web semelhante ao ChatGPT?"
- "Qual é a diferença entre WebChat e os canais WhatsApp/Telegram?"
- "WebChat requer configuração separada?"
- "Como usar o WebChat em um servidor remoto?"

A boa notícia é: **WebChat é uma interface de chat integrada ao Clawdbot**, não requer instalação ou configuração separada e está pronta para uso assim que o Gateway for iniciado.

## Quando Usar Esta Solução

Quando você precisar:

- 🖥️ **Interface gráfica de chat**: Prefere a experiência de chat no navegador em vez da linha de comando
- 📊 **Gerenciamento de sessões**: Visualizar histórico e alternar entre diferentes sessões
- 🌐 **Acesso local**: Conversar com a IA no mesmo dispositivo
- 🔄 **Acesso remoto**: Acessar o Gateway remoto através de túneis SSH/Tailscale
- 💬 **Interação de texto rico**: Suporta formatação Markdown e anexos

---

## 🎒 Preparação Antes de Começar

Antes de usar o WebChat, verifique:

### Requisitos Obrigatórios

| Condição                      | Como Verificar                                        |
|--- | ---|
| **Gateway iniciado**         | `clawdbot gateway status` ou verifique se o processo está em execução |
| **Porta acessível**          | Confirme que a porta 18789 (ou porta personalizada) não está em uso |
| **Modelos de IA configurados** | `clawdbot models list` para verificar se há modelos disponíveis |

::: warning Pré-requisitos do curso
Este tutorial assume que você já completou:
- [Início Rápido](../../start/getting-started/) - Instalação, configuração e inicialização do Clawdbot
- [Iniciando o Gateway](../../start/gateway-startup/) - Entenda os diferentes modos de inicialização do Gateway

Se ainda não completou, por favor, retorne a esses cursos.
:::

### Opcional: Configurar Autenticação

O WebChat requer autenticação por padrão (mesmo para acesso local), para proteger seu assistente de IA.

Verificação rápida:

```bash
## Verificar configuração atual de autenticação
clawdbot config get gateway.auth.mode
clawdbot config get gateway.auth.token
```

Se não estiver configurado, recomendamos configurar:

```bash
## Configurar autenticação por token (recomendado)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here
```

Mais detalhes: [Configuração de Autenticação do Gateway](../../advanced/security-sandbox/).

---

## Conceitos Principais

### O Que É o WebChat

**WebChat** é uma interface de chat integrada ao Clawdbot que interage diretamente com o assistente de IA através do WebSocket do Gateway.

**Características Principais**:

```
┌─────────────────────────────────────────────────────┐
│              Arquitetura do WebChat                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Navegador/Cliente                                  │
│      │                                              │
│      ▼                                              │
│  Gateway WebSocket (ws://127.0.0.1:18789)          │
│      │                                              │
│      ├─ chat.send → Agent → Processar mensagem      │
│      ├─ chat.history → Retornar histórico           │
│      ├─ chat.inject → Adicionar nota do sistema     │
│      └─ Eventos → Atualização em tempo real         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Diferenças em relação a outros canais**:

| Característica | WebChat                          | WhatsApp/Telegram e outros        |
|--- | --- | ---|
| **Método de acesso** | Acesso direto ao Gateway através do navegador | Requer aplicativo de terceiros e login |
| **Requisitos de configuração** | Sem configuração separada, reutiliza a porta do Gateway | Requer API Key/Token específico do canal |
| **Roteamento de respostas** | Roteamento determinístico de volta ao WebChat | Roteamento para o canal correspondente |
| **Acesso remoto** | Através de túneis SSH/Tailscale | Acesso remoto fornecido pela plataforma do canal |
| **Modelo de sessão** | Usa gerenciamento de sessões do Gateway | Usa gerenciamento de sessões do Gateway |

### Como o WebChat Funciona

O WebChat não requer um servidor HTTP separado ou configuração de porta, ele usa diretamente o serviço WebSocket do Gateway.

**Pontos principais**:
- **Porta compartilhada**: O WebChat usa a mesma porta que o Gateway (padrão 18789)
- **Sem configuração adicional**: Não há bloco de configuração `webchat.*` dedicado
- **Sincronização em tempo real**: O histórico é obtido do Gateway em tempo real, sem cache local
- **Modo somente leitura**: Se o Gateway não estiver acessível, o WebChat torna-se somente leitura

::: info WebChat vs Interface de Controle
O WebChat foca na experiência de chat, enquanto a **Interface de Controle** fornece um painel de controle completo do Gateway (configuração, gerenciamento de sessões, gerenciamento de habilidades, etc.).

- WebChat: `http://localhost:18789/chat` ou visualização de chat no app macOS
- Interface de Controle: `http://localhost:18789/` painel de controle completo
:::

---

## Siga os Passos

### Passo 1: Acessar o WebChat

**Por que**
O WebChat é uma interface de chat integrada ao Gateway, não requer instalação de software adicional.

#### Método 1: Acesso através do navegador

Abra o navegador e acesse:

```bash
## Endereço padrão (usando porta padrão 18789)
http://localhost:18789

## Ou usando o endereço de loopback (mais confiável)
http://127.0.0.1:18789
```

**Você deve ver**:
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat                     │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  [Lista de Sessões]  [Configurar] │   │
│  └───────────────────────────────────┘   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  Olá! Sou seu assistente de IA.  │   │
│  │  Como posso ajudar você?         │   │
│  └───────────────────────────────────┘   │
│                                             │
│  [Digite sua mensagem...]         [Enviar] │
└─────────────────────────────────────────────┘
```

#### Método 2: Aplicativo macOS

Se você instalou o aplicativo da barra de menus do Clawdbot para macOS:

1. Clique no ícone da barra de menus
2. Selecione "Open WebChat" ou clique no ícone de chat
3. O WebChat abrirá em uma janela independente

**Vantagens**:
- Experiência nativa do macOS
- Suporte a atalhos de teclado
- Integração com Voice Wake e Talk Mode

#### Método 3: Atalho de linha de comando

```bash
## Abrir navegador automaticamente para o WebChat
clawdbot web
```

**Você deve ver**: O navegador padrão abre automaticamente e navega para `http://localhost:18789`

---

### Passo 2: Enviar a Primeira Mensagem

**Por que**
Verificar se a conexão entre WebChat e Gateway está funcionando corretamente e se o assistente de IA está respondendo adequadamente.

1. Digite sua primeira mensagem no campo de entrada
2. Clique no botão "Enviar" ou pressione `Enter`
3. Observe a resposta na interface de chat

**Exemplo de mensagem**:
```
Hello! I'm testing WebChat. Can you introduce yourself?
```

**Você deve ver**:
```
┌─────────────────────────────────────────────┐
│  Você → IA: Hello! I'm testing...          │
│                                             │
│  IA → Você: Olá! Sou o assistente de IA    │
│  do Clawdbot. Posso ajudar você a          │
│  responder perguntas, escrever código,     │
│  gerenciar tarefas, etc.                   │
│  Como posso ajudar você?                   │
│                                             │
│  [Digite sua mensagem...]         [Enviar] │
└─────────────────────────────────────────────┘
```

::: tip Dica de autenticação
Se o Gateway estiver configurado com autenticação, ao acessar o WebChat será solicitado que você insira o token ou senha:

```
┌─────────────────────────────────────────────┐
│          Autenticação do Gateway           │
│                                             │
│  Por favor, insira o Token:                │
│  [•••••••••••••]              │
│                                             │
│              [Cancelar]  [Entrar]          │
└─────────────────────────────────────────────┘
```

Insira o `gateway.auth.token` ou `gateway.auth.password` que você configurou.
:::

---

### Passo 3: Usar Funcionalidades do WebChat

**Por que**
O WebChat oferece funcionalidades ricas de interação, familiarizar-se com essas funcionalidades pode melhorar a experiência de uso.

#### Gerenciamento de Sessões

O WebChat suporta gerenciamento de múltiplas sessões, permitindo que você converse com a IA em diferentes contextos.

**Passos para usar**:

1. Clique na lista de sessões à esquerda (ou botão "Nova Sessão")
2. Selecione ou crie uma nova sessão
3. Continue a conversa na nova sessão

**Características das sessões**:
- ✅ Contexto independente: O histórico de mensagens de cada sessão é isolado
- ✅ Salvamento automático: Todas as sessões são gerenciadas pelo Gateway e armazenadas persistentemente
- ✅ Sincronização entre plataformas: Compartilha os mesmos dados de sessão com CLI, app macOS e nós iOS/Android

::: info Sessão principal
O WebChat usa por padrão a **chave de sessão principal** do Gateway (`main`), o que significa que todos os clientes (CLI, WebChat, app macOS, nós iOS/Android) compartilham o mesmo histórico da sessão principal.

Se você precisa de contexto isolado, pode definir diferentes chaves de sessão na configuração.
:::

#### Upload de Anexos

O WebChat suporta upload de imagens, áudio, vídeo e outros anexos.

**Passos para usar**:

1. Clique no ícone "Anexo" ao lado do campo de entrada (geralmente 📎 ou 📎️)
2. Selecione o arquivo para upload (ou arraste e solte o arquivo na área de chat)
3. Digite uma descrição de texto relacionada
4. Clique em "Enviar"

**Formatos suportados**:
- 📷 **Imagens**: JPEG, PNG, GIF
- 🎵 **Áudio**: MP3, WAV, M4A
- 🎬 **Vídeo**: MP4, MOV
- 📄 **Documentos**: PDF, TXT etc. (depende da configuração do Gateway)

**Você deve ver**:
```
┌─────────────────────────────────────────────┐
│  Você → IA: Por favor, analise esta imagem  │
│  [📎 photo.jpg]                             │
│                                             │
│  IA → Você: Vejo que esta é uma...          │
│  [Resultados da análise...]                 │
└─────────────────────────────────────────────┘
```

::: warning Limite de tamanho de arquivo
O WebChat e o Gateway têm limites para o tamanho de arquivos enviados (geralmente alguns MB). Se o upload falhar, verifique o tamanho do arquivo ou a configuração de mídia do Gateway.
:::

#### Suporte a Markdown

O WebChat suporta formatação Markdown, permitindo que você formate mensagens.

**Exemplo**:

```markdown
# Título
## Subtítulo
- Item da lista 1
- Item da lista 2

**Negrito** e *itálico*
`código`
```

**Pré-visualização**:
```
# Título
## Subtítulo
- Item da lista 1
- Item da lista 2

**Negrito** e *itálico*
`código`
```

#### Atalhos de Comando

O WebChat suporta comandos de barra para executar rapidamente ações específicas.

**Comandos comuns**:

| Comando             | Função                         |
|--- | ---|
| `/new`              | Criar nova sessão             |
| `/reset`            | Redefinir histórico da sessão atual |
| `/clear`            | Limpar todas as mensagens da sessão atual |
| `/status`           | Exibir status do Gateway e canais |
| `/models`           | Listar modelos de IA disponíveis |
| `/help`             | Exibir informações de ajuda |

**Exemplo de uso**:

```
/new
## Criar nova sessão

/reset
## Redefinir sessão atual
```

---

### Passo 4 (Opcional): Configurar Acesso Remoto

**Por que**
Se você está executando o Gateway em um servidor remoto ou deseja acessar o WebChat de outros dispositivos, precisa configurar o acesso remoto.

#### Acesso através de Túnel SSH

**Cenário de uso**: O Gateway está em um servidor remoto e você deseja acessar o WebChat a partir de sua máquina local.

**Passos para usar**:

1. Estabeleça um túnel SSH, mapeando a porta do Gateway remoto para a porta local:

```bash
## Mapear a porta remota 18789 para a porta local 18789
ssh -L 18789:localhost:18789 user@your-remote-server.com
```

2. Mantenha a conexão SSH aberta (ou use o parâmetro `-N` para não executar comandos remotos)

3. Acesse no navegador local: `http://localhost:18789`

**Você deve ver**: A mesma interface WebChat do acesso local

::: tip Manter o túnel SSH
O túnel SSH expira quando a conexão é encerrada. Se você precisa de acesso persistente:

- Use `autossh` para reconexão automática
- Configure `LocalForward` no SSH Config
- Use systemd/launchd para iniciar automaticamente o túnel
:::

#### Acesso através do Tailscale

**Cenário de uso**: Usar o Tailscale para criar uma rede privada, o Gateway e o cliente estão no mesmo tailnet.

**Passos de configuração**:

1. Ative o Tailscale Serve ou Funnel na máquina do Gateway:

```bash
## Editar arquivo de configuração
clawdbot config set gateway.tailscale.mode serve
## Ou
clawdbot config set gateway.tailscale.mode funnel
```

2. Reinicie o Gateway

```bash
## Reiniciar o Gateway para aplicar a configuração
clawdbot gateway restart
```

3. Obtenha o endereço Tailscale do Gateway

```bash
## Verificar status (mostrará a URL Tailscale)
clawdbot gateway status
```

4. Acesse no dispositivo cliente (mesmo tailnet):

```
http://<gateway-tailscale-name>.tailnet-<tailnet-id>.ts.net:18789
```

::: info Tailscale Serve vs Funnel
- **Serve**: Acessível apenas dentro do tailnet, mais seguro
- **Funnel**: Acessível publicamente na internet, requer proteção via `gateway.auth`

Recomendamos usar o modo Serve, a menos que você precise acessar pela internet pública.
:::

#### Autenticação de Acesso Remoto

Seja usando túnel SSH ou Tailscale, se o Gateway estiver configurado com autenticação, você ainda precisará fornecer o token ou senha.

**Verificar configuração de autenticação**:

```bash
## Verificar modo de autenticação
clawdbot config get gateway.auth.mode

## Se for modo token, confirmar se o token foi definido
clawdbot config get gateway.auth.token
```

---

## Ponto de Verificação ✅

Após concluir os passos acima, você deve ser capaz de:

- [ ] Acessar o WebChat no navegador (`http://localhost:18789`)
- [ ] Enviar mensagens e receber respostas da IA
- [ ] Usar funcionalidades de gerenciamento de sessões (criar, alternar, redefinir sessões)
- [ ] Fazer upload de anexos e solicitar análise pela IA
- [ ] (Opcional) Acessar o WebChat remotamente através de túnel SSH
- [ ] (Opcional) Acessar o WebChat através do Tailscale

::: tip Verificar conexão
Se o WebChat não estiver acessível ou o envio de mensagens falhar, verifique:

1. Se o Gateway está em execução: `clawdbot gateway status`
2. Se a porta está correta: Confirme que você está acessando `http://127.0.0.1:18789` (em vez de `localhost:18789`)
3. Se a autenticação está configurada: `clawdbot config get gateway.auth.*`
4. Ver logs detalhados: `clawdbot gateway --verbose`
:::

---

## Armadilhas Comuns

### ❌ Gateway Não Iniciado

**Abordagem incorreta**:
```
Acessar diretamente http://localhost:18789
## Resultado: Falha de conexão ou impossibilidade de carregar
```

**Abordagem correta**:
```bash
## Primeiro, inicie o Gateway
clawdbot gateway --port 18789

## Depois acesse o WebChat
open http://localhost:18789
```

::: warning O Gateway deve ser iniciado primeiro
O WebChat depende do serviço WebSocket do Gateway. Sem o Gateway em execução, o WebChat não funcionará corretamente.
:::

### ❌ Configuração Incorreta da Porta

**Abordagem incorreta**:
```
Acessar http://localhost:8888
## O Gateway está executando na porta 18789
## Resultado: Conexão recusada
```

**Abordagem correta**:
```bash
## 1. Verificar a porta real do Gateway
clawdbot config get gateway.port

## 2. Acessar usando a porta correta
open http://localhost:<gateway.port>
```

### ❌ Falta de Configuração de Autenticação

**Abordagem incorreta**:
```
Não configurar gateway.auth.mode ou token
## Resultado: O WebChat informa falha de autenticação
```

**Abordagem correta**:
```bash
## Configurar autenticação por token (recomendado)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here

## Reiniciar o Gateway
clawdbot gateway restart

## Inserir o token ao acessar o WebChat
```

### ❌ Acesso Remoto Não Configurado

**Abordagem incorreta**:
```
Acessar diretamente o IP do servidor remoto a partir da máquina local
http://remote-server-ip:18789
## Resultado: Timeout de conexão (bloqueado por firewall)
```

**Abordagem correta**:
```bash
## Usar túnel SSH
ssh -L 18789:localhost:18789 user@remote-server.com

## Ou usar Tailscale Serve
clawdbot config set gateway.tailscale.mode serve
clawdbot gateway restart

## Acessar no navegador local
http://localhost:18789
```

---

## Resumo da Lição

Nesta lição você aprendeu:

1. ✅ **Introdução ao WebChat**: Interface de chat integrada baseada no WebSocket do Gateway, sem configuração separada
2. ✅ **Métodos de acesso**: Acesso através do navegador, aplicativo macOS, atalho de linha de comando
3. ✅ **Funcionalidades principais**: Gerenciamento de sessões, upload de anexos, suporte a Markdown, comandos de barra
4. ✅ **Acesso remoto**: Acessar o Gateway remoto através de túnel SSH ou Tailscale
5. ✅ **Configuração de autenticação**: Entender os modos de autenticação do Gateway (token/password/Tailscale)
6. ✅ **Solução de problemas**: Problemas comuns e soluções

**Revisão de Conceitos Principais**:

- O WebChat usa a mesma porta que o Gateway, não requer servidor HTTP separado
- O histórico é gerenciado pelo Gateway, sincronizado em tempo real, sem cache local
- Se o Gateway não estiver acessível, o WebChat torna-se modo somente leitura
- As respostas são roteadas deterministicamente de volta ao WebChat, diferente de outros canais

**Próximos Passos**:

- Explore o [Aplicativo macOS](../macos-app/), aprenda sobre controle da barra de menus e funcionalidades Voice Wake
- Aprenda sobre o [Nó iOS](../ios-node/), configure dispositivos móveis para executar operações locais
- Conheça a [Interface de Visualização Canvas](../../advanced/canvas/), experimente o espaço de trabalho visual orientado por IA

---

## Próxima Lição

> Na próxima lição, aprenderemos sobre o **[Aplicativo macOS](../macos-app/)**.
>
> Você aprenderá:
> - Funcionalidades e layout do aplicativo da barra de menus do macOS
> - Uso do Voice Wake e Talk Mode
> - Integração entre WebChat e o aplicativo macOS
> - Ferramentas de depuração e controle remoto do Gateway

---

## Apêndice: Referência de Código

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-27

| Funcionalidade                  | Caminho do Arquivo                                                                                    | Linhas  |
|--- | --- | ---|
| Explicação do WebChat     | [`docs/web/webchat.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/web/webchat.md) | Arquivo completo   |
| API WebSocket do Gateway | [`src/gateway/protocol/`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/) | Diretório completo   |
| Método chat.send        | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380  |
| Método chat.history     | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 1-295    |
| Método chat.inject      | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 381-450  |
| Ponto de entrada da Web UI         | [`ui/index.html`](https://github.com/clawdbot/clawdbot/blob/main/ui/index.html) | 1-15     |
| Configuração de autenticação do Gateway     | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-100    |
| Integração Tailscale       | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | Arquivo completo   |
| Integração WebChat do macOS  | [`apps/macos/`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/) | Diretório completo   |

**Constantes principais**:
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: Identificador do canal de mensagens interno do WebChat (de `src/utils/message-channel.ts:17`)

**Itens de configuração principais**:
- `gateway.port`: Porta WebSocket (padrão 18789)
- `gateway.auth.mode`: Modo de autenticação (token/password/tailscale)
- `gateway.auth.token`: Valor do token para autenticação por token
- `gateway.auth.password`: Valor da senha para autenticação por senha
- `gateway.tailscale.mode`: Modo Tailscale (serve/funnel/disabled)
- `gateway.remote.url`: Endereço WebSocket do Gateway remoto
- `gateway.remote.token`: Token de autenticação do Gateway remoto
- `gateway.remote.password`: Senha de autenticação do Gateway remoto

**Métodos WebSocket principais**:
- `chat.send(message)`: Enviar mensagem para o Agent (de `src/gateway/server-methods/chat.ts`)
- `chat.history(sessionId)`: Obter histórico da sessão (de `src/gateway/server-methods/chat.ts`)
- `chat.inject(message)`: Injetar nota do sistema diretamente na sessão, sem passar pelo Agent (de `src/gateway/server-methods/chat.ts`)

**Características da arquitetura**:
- O WebChat não requer servidor HTTP separado ou configuração de porta
- Usa a mesma porta que o Gateway (padrão 18789)
- O histórico é obtido do Gateway em tempo real, sem cache local
- As respostas são roteadas deterministicamente de volta ao WebChat (diferente de outros canais)

</details>
