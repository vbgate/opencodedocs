---
title: "Configuração de Nó iOS: Conectar Gateway com Câmera, Canvas e Voice Wake | Tutorial Clawdbot"
sidebarTitle: "Deixar o AI Usar iPhone"
subtitle: "Guia de Configuração de Nó iOS"
description: "Aprenda como configurar um nó iOS para conectar ao Gateway, usar câmera para tirar fotos, interface de visualização Canvas, Voice Wake de ativação de voz, Talk Mode de conversa contínua, obtenção de localização e outras funções de operação local do dispositivo, descoberta automática via Bonjour e Tailscale, após emparelhamento e autenticação e controle de segurança para alcançar colaboração AI multi-dispositivo, suporta primeiro plano e segundo plano e gerenciamento de permissões."
tags:
  - "Nó iOS"
  - "Nó de Dispositivo"
  - "Canvas"
  - "Voice Wake"
prerequisite:
  - "/pt/moltbot/moltbot/start/start-gateway-startup/"
order: 170
---

# Guia de Configuração de Nó iOS

## O Que Você Poderá Fazer

Depois de configurar o nó iOS, você poderá:

- ✅ Fazer com que o assistente AI chame a câmera do dispositivo iOS para tirar fotos ou gravar vídeos
- ✅ Renderizar interface de visualização Canvas no dispositivo iOS
- ✅ Usar Voice Wake e Talk Mode para interação por voz
- ✅ Obter informações de localização do dispositivo iOS
- ✅ Gerenciar vários nós de dispositivos através do Gateway de forma unificada

## Seu Problema Atual

Você deseja expandir as capacidades do assistente AI em seu dispositivo iOS para que ele possa:

- **Chamar câmera para tirar fotos ou gravar vídeos**: Quando você diz "tire uma foto", o AI pode usar o iPhone automaticamente para tirar fotos
- **Exibir interface de visualização**: Mostrar gráficos, formulários ou painéis de controle gerados pelo AI no iPhone
- **Ativação por voz e conversa contínua**: Sem usar as mãos, basta dizer "Clawd" para despertar o assistente e começar a conversar
- **Obter informações do dispositivo**: Fazer com que o AI saiba sua localização, status da tela e outras informações

## Quando Usar Este Método

- **Cenários móveis**: Você deseja que o AI possa usar capacidades como câmera e tela do iPhone
- **Colaboração multi-dispositivo**: Gateway está rodando no servidor, mas precisa chamar funções de dispositivos locais
- **Interação por voz**: Você quer usar o iPhone como um terminal de assistente por voz portátil

::: info O que é um nó iOS?
O nó iOS é um aplicativo Companion que roda em iPhone/iPad, conectando-se ao Clawdbot Gateway via WebSocket. Não é o Gateway em si, mas funciona como um "periférico" fornecendo capacidades de operação local do dispositivo.

**Diferença para o Gateway**:
- **Gateway**: Roda em servidor/macOS, responsável pelo roteamento de mensagens, chamada de modelos de AI, distribuição de ferramentas
- **Nó iOS**: Roda no iPhone, responsável por executar operações locais do dispositivo (câmera, Canvas, localização, etc.)
:::

---

## 🎒 Preparativos Antes de Começar

::: warning Requisitos Prévios

Antes de começar, confirme:

1. **Gateway iniciado e rodando**
   - Garanta que o Gateway está rodando em outro dispositivo (macOS, Linux ou Windows via WSL2)
   - Gateway vinculado a um endereço de rede acessível (LAN ou Tailscale)

2. **Conectividade de rede**
   - Dispositivo iOS e Gateway na mesma rede local (recomendado), ou conectado via Tailscale
   - Dispositivo iOS consegue acessar o endereço IP e porta do Gateway (padrão 18789)

3. **Obter aplicativo iOS**
   - O aplicativo iOS atualmente é **versão de prévia interna**, não distribuído publicamente
   - Necessário construir a partir do código-fonte ou obter versão de teste TestFlight
:::

## Ideia Central

Fluxo de trabalho do nó iOS:

```
[Gateway] ←→ [Nó iOS]
      ↓            ↓
   [AI Modelo]   [Capacidades Dispositivo]
      ↓            ↓
   [Decisão Execução]   [Câmera/Canvas/Voz]
```

**Pontos técnicos principais**:

1. **Descoberta automática**: Descobrir automaticamente o Gateway via Bonjour (rede local) ou Tailscale (entre redes)
2. **Emparelhamento e autenticação**: Primeira conexão precisa de aprovação manual no lado do Gateway para estabelecer relação de confiança
3. **Comunicação por protocolo**: Usar protocolo WebSocket (`node.invoke`) para enviar comandos
4. **Controle de permissões**: Comandos locais do dispositivo precisam de autorização do usuário (câmera, localização, etc.)

**Características da arquitetura**:

- **Segurança**: Todas as operações do dispositivo precisam de autorização explícita do usuário no lado iOS
- **Isolamento**: O nó não roda o Gateway, apenas executa operações locais
- **Flexibilidade**: Suporta primeiro plano, segundo plano, remoto e vários outros cenários de uso

---

## Siga comigo

### Passo 1: Iniciar Gateway

Inicie o serviço no host do Gateway:

```bash
clawdbot gateway --port 18789
```

**Você deve ver**:

```
✅ Gateway running on ws://0.0.0.0:18789
✅ Bonjour advertisement active: _clawdbot._tcp
```

::: tip Acesso entre redes
Se Gateway e dispositivo iOS não estão na mesma rede local, use **Tailscale Serve/Funnel**:

```bash
clawdbot gateway --port 18789 --tailscale funnel
```

O dispositivo iOS descobrirá automaticamente o Gateway via Tailscale.
:::

### Passo 2: Conexão do Aplicativo iOS

No aplicativo iOS:

1. Abra **Settings** (Configurações)
2. Encontre a seção **Gateway**
3. Selecione um Gateway descoberto automaticamente (ou habilite **Manual Host** abaixo para inserir host e porta manualmente)

**Você deve ver**:

- Aplicativo tentando conectar ao Gateway
- Status mostrando "Connected" (Conectado) ou "Pairing pending" (Emparelhamento pendente)

::: details Configurar host manualmente

Se a descoberta automática falhar, insira o endereço do Gateway manualmente:

1. Habilite **Manual Host**
2. Insira o host do Gateway (ex: `192.168.1.100`)
3. Insira a porta (padrão `18789`)
4. Clique em "Connect" (Conectar)

:::

### Passo 3: Aprovar Solicitação de Emparelhamento

**No host do Gateway**, aprove a solicitação de emparelhamento do nó iOS:

```bash
# Ver nós pendentes de aprovação
clawdbot nodes pending

# Aprovar nó específico (substitua <requestId>)
clawdbot nodes approve <requestId>
```

**Você deve ver**:

```
✅ Node paired successfully
Node: iPhone (iOS)
ID: node-abc123
```

::: tip Rejeitar emparelhamento
Se quiser rejeitar a solicitação de conexão de um nó:

```bash
clawdbot nodes reject <requestId>
```

:::

**Ponto de verificação ✅**: Verifique o status do nó no Gateway

```bash
clawdbot nodes status
```

Você deve ver seu nó iOS mostrando status `paired` (emparelhado).

### Passo 4: Testar Conexão do Nó

**Testar comunicação com o nó a partir do Gateway**:

```bash
# Chamar comando do nó através do Gateway
clawdbot gateway call node.list --params "{}"
```

**Você deve ver**:

```json
{
  "result": [
    {
      "id": "node-abc123",
      "displayName": "iPhone (iOS)",
      "platform": "ios",
      "capabilities": ["camera", "canvas", "location", "screen", "voicewake"]
    }
  ]
}
```

---

## Usar Funcionalidades do Nó

### Tirar Fotos com Câmera

O nó iOS suporta tirar fotos e gravar vídeos com a câmera:

```bash
# Tirar foto (câmera frontal padrão)
clawdbot nodes camera snap --node "iPhone (iOS)"

# Tirar foto (câmera traseira, resolução personalizada)
clawdbot nodes camera snap --node "iPhone (iOS)" --facing back --max-width 1920

# Gravar vídeo (5 segundos)
clawdbot nodes camera clip --node "iPhone (iOS)" --duration 5000
```

**Você deve ver**:

```
MEDIA:/tmp/clawdbot-camera-snap-abc123.jpg
```

::: warning Requisito de primeiro plano
Comandos de câmera exigem que o aplicativo iOS esteja em **primeiro plano**. Se o aplicativo estiver em segundo plano, retornará erro `NODE_BACKGROUND_UNAVAILABLE`.

:::

**Parâmetros da câmera iOS**:

| Parâmetro | Tipo | Padrão | Descrição |
|--- | --- | --- | ---|
| `facing` | `front\|back` | `front` | Orientação da câmera |
| `maxWidth` | number | `1600` | Largura máxima (pixels) |
| `quality` | `0..1` | `0.9` | Qualidade JPEG (0-1) |
| `durationMs` | number | `3000` | Duração do vídeo (milissegundos) |
| `includeAudio` | boolean | `true` | Incluir áudio |

### Interface de Visualização Canvas

O nó iOS pode exibir interface de visualização Canvas:

```bash
# Navegar para URL
clawdbot nodes canvas navigate --node "iPhone (iOS)" --target "https://example.com"

# Executar JavaScript
clawdbot nodes canvas eval --node "iPhone (iOS)" --js "document.title"

# Capturar tela (salvar como JPEG)
clawdbot nodes canvas snapshot --node "iPhone (iOS)" --format jpeg --max-width 900
```

**Você deve ver**:

```
MEDIA:/tmp/clawdbot-canvas-snap-abc123.jpg
```

::: tip Push automático A2UI
Se o Gateway estiver configurado com `canvasHost`, o nó iOS navegará automaticamente para a interface A2UI ao conectar.
:::

### Voice Wake Ativação de Voz

Habilite Voice Wake em **Settings** do aplicativo iOS:

1. Ative o interruptor **Voice Wake**
2. Configure a palavra de ativação (padrão: "clawd", "claude", "computer")
3. Garanta que o iOS autorizou permissão de microfone

::: info Palavra de ativação global
A palavra de ativação do Clawdbot é **configuração global**, gerenciada pelo Gateway. Todos os nós (iOS, Android, macOS) usam a mesma lista de palavras de ativação.

Modificar a palavra de ativação sincroniza automaticamente para todos os dispositivos.
:::

### Talk Mode Conversa Contínua

Após habilitar Talk Mode, o AI continuará lendo respostas via TTS e monitorando continuamente entrada de voz:

1. Habilite **Talk Mode** em **Settings** do aplicativo iOS
2. Quando o AI responder, lerá automaticamente
3. Pode conversar continuamente por voz, sem precisar clicar manualmente

::: warning Limitações de segundo plano
iOS pode suspender áudio em segundo plano. Quando o aplicativo não está em primeiro plano, as funções de voz são **melhor esforço** (best-effort).
:::

---

## Perguntas Frequentes

### Prompt de emparelhamento nunca aparece

**Problema**: Aplicativo iOS mostra "Connected", mas o Gateway não exibe prompt de emparelhamento.

**Solução**:

```bash
# 1. Ver manualmente nós pendentes de aprovação
clawdbot nodes pending

# 2. Aprovar nó
clawdbot nodes approve <requestId>

# 3. Verificar conexão
clawdbot nodes status
```

### Falha na conexão (após reinstalação)

**Problema**: Após reinstalar o aplicativo iOS, não é possível conectar ao Gateway.

**Causa**: O token de emparelhamento no Keychain foi limpo.

**Solução**: Execute novamente o processo de emparelhamento (passo 3).

### A2UI_HOST_NOT_CONFIGURED

**Problema**: Comandos de Canvas falham, mostrando `A2UI_HOST_NOT_CONFIGURED`.

**Causa**: Gateway não configurou URL `canvasHost`.

**Solução**:

Configure o host Canvas na configuração do Gateway:

```bash
clawdbot config set canvasHost "http://<gateway-host>:18793/__clawdbot__/canvas/"
```

### NODE_BACKGROUND_UNAVAILABLE

**Problema**: Comandos de câmera/Canvas falham, retornando `NODE_BACKGROUND_UNAVAILABLE`.

**Causa**: Aplicativo iOS não está em primeiro plano.

**Solução**: Mude o aplicativo iOS para primeiro plano e tente o comando novamente.

---

## Resumo da Lição

Nesta lição, você aprendeu:

✅ Conceito e arquitetura do nó iOS
✅ Como descobrir automaticamente e conectar ao Gateway
✅ Fluxo de emparelhamento e autenticação
✅ Usar funcionalidades como câmera, Canvas, Voice Wake
✅ Métodos de troubleshooting para problemas comuns

**Pontos principais**:

- O nó iOS é provedor de capacidades de operação local do dispositivo, não o Gateway
- Todas as operações do dispositivo precisam de autorização do usuário e status de primeiro plano
- Emparelhamento é passo necessário para segurança, apenas confia em nós aprovados
- Voice Wake e Talk Mode precisam de permissão de microfone

## Próxima Lição

> Na próxima lição aprenderemos **[Configuração de Nó Android](../android-node/)**.
>
> Você aprenderá:
> - Como configurar nó Android para conectar ao Gateway
> - Usar funcionalidades de câmera, gravação de tela, Canvas do dispositivo Android
> - Tratar problemas de permissões e compatibilidade específicos do Android

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linha |
|--- | --- | ---|
| Entrada do aplicativo iOS | [`apps/ios/Sources/ClawdbotApp.swift`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/ClawdbotApp.swift) | 1-30 |
| Renderização Canvas | [`apps/ios/Sources/RootCanvas.swift`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/RootCanvas.swift) | 1-250 |
| Conexão Gateway | [`apps/ios/Sources/Gateway/`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/Gateway/) | - |
| Runner de protocolo de nó | [`src/node-host/runner.ts`](https://github.com/moltbot/moltbot/blob/main/src/node-host/runner.ts) | 1-1100 |
| Configuração de nó | [`src/node-host/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/node-host/config.ts) | 1-50 |
| Documentação da plataforma iOS | [`docs/platforms/ios.md`](https://github.com/moltbot/moltbot/blob/main/docs/platforms/ios.md) | 1-105 |
| Documentação do sistema de nós | [`docs/nodes/index.md`](https://github.com/moltbot/moltbot/blob/main/docs/nodes/index.md) | 1-306 |

**Constantes principais**:
- `GATEWAY_DEFAULT_PORT = 18789`: Porta padrão do Gateway
- `NODE_ROLE = "node"`: Identificador de papel de conexão do nó

**Comandos principais**:
- `clawdbot nodes pending`: Listar nós pendentes de aprovação
- `clawdbot nodes approve <requestId>`: Aprovar emparelhamento do nó
- `clawdbot nodes invoke --node <id> --command <cmd>`: Chamar comando do nó
- `clawdbot nodes camera snap --node <id>`: Tirar foto
- `clawdbot nodes canvas navigate --node <id> --target <url>`: Navegar Canvas

**Métodos de protocolo**:
- `node.invoke.request`: Solicitação de chamada de comando do nó
- `node.invoke.result`: Resultado de execução do comando do nó
- `voicewake.get`: Obter lista de palavras de ativação
- `voicewake.set`: Definir lista de palavras de ativação
- `voicewake.changed`: Evento de mudança de palavra de ativação

</details>
