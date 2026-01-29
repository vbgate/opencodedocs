---
title: "Nó Android: Configuração de Operações Locais de Dispositivo | Tutorial do Clawdbot"
sidebarTitle: "Deixe a IA controlar seu celular"
subtitle: "Nó Android: Configuração de Operações Locais de Dispositivo | Tutorial do Clawdbot"
description: "Aprenda como configurar um nó Android para executar operações locais de dispositivo (Camera, Canvas, Screen). Este tutorial apresenta o fluxo de conexão do nó Android, mecanismo de emparelhamento e comandos disponíveis."
tags:
  - "Android"
  - "Nó"
  - "Camera"
  - "Canvas"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 180
---

# Nó Android: Configuração de Operações Locais de Dispositivo

## O Que Você Aprenderá

- Conectar um dispositivo Android ao Gateway como nó para executar operações locais de dispositivo
- Controlar a câmera do dispositivo Android por meio de um assistente de IA para tirar fotos e gravar vídeos
- Usar a interface de visualização Canvas para exibir conteúdo em tempo real no Android
- Gerenciar funções de gravação de tela, obtenção de localização e envio de SMS

## Seu Problema Atual

Você deseja que seu assistente de IA possa acessar seu dispositivo Android — tirar fotos, gravar vídeos, exibir a interface Canvas — mas não sabe como conectar o dispositivo ao Gateway com segurança.

Instalar o aplicativo Android diretamente pode não descobrir o Gateway, ou pode falhar no emparelhamento após a configuração. Você precisa de um fluxo de conexão claro.

## Quando Usar Esta Solução

- **Necessita de operações locais de dispositivo**: Você deseja que o dispositivo Android execute operações locais (tirar fotos, gravar vídeos, gravar tela) por meio do assistente de IA
- **Acesso entre redes**: O dispositivo Android e o Gateway estão em redes diferentes e precisam se conectar por meio do Tailscale
- **Visualização Canvas**: Você precisa exibir interfaces HTML/CSS/JS geradas por IA em tempo real no Android

## 🎒 Preparativos Antes de Começar

::: warning Pré-requisitos

Antes de começar, certifique-se de:

- ✅ **Gateway instalado e em execução**: Execute o Gateway no macOS, Linux ou Windows (WSL2)
- ✅ **Dispositivo Android disponível**: Dispositivo ou emulador Android 8.0+
- ✅ **Conexão de rede normal**: O dispositivo Android pode acessar a porta WebSocket do Gateway (padrão 18789)
- ✅ **CLI disponível**: O comando `clawdbot` pode ser usado no host do Gateway

:::

## Conceito Central

O **Nó Android** é um aplicativo complementar (companion app) que se conecta ao Gateway por meio de WebSocket e expõe capacidades de operações locais de dispositivo para uso pelo assistente de IA.

### Visão Geral da Arquitetura

```
Dispositivo Android (aplicativo do nó)
        ↓
    Conexão WebSocket
        ↓
    Gateway (plano de controle)
        ↓
    Assistente de IA + chamada de ferramentas
```

**Pontos chave**:
- O Android **não hospeda** o Gateway, apenas se conecta como nó a um Gateway já em execução
- Todos os comandos são roteados para o nó Android por meio do método `node.invoke` do Gateway
- O nó precisa ser emparelhado (pairing) para obter permissões de acesso

### Funcionalidades Suportadas

O nó Android suporta as seguintes operações locais de dispositivo:

| Funcionalidade | Comando | Descrição |
|--- | --- | ---|
| **Canvas** | `canvas.*` | Exibe interface de visualização em tempo real (A2UI) |
| **Camera** | `camera.*` | Tira fotos (JPG) e grava vídeos (MP4) |
| **Screen** | `screen.*` | Gravação de tela |
| **Location** | `location.*` | Obtém localização GPS |
| **SMS** | `sms.*` | Envia SMS |

::: tip Restrição de primeiro plano

Todas as operações locais de dispositivo (Canvas, Camera, Screen) exigem que o aplicativo Android esteja em **estado de primeiro plano**. Chamadas em segundo plano retornarão o erro `NODE_BACKGROUND_UNAVAILABLE`.

:::

## Siga Comigo

### Passo 1: Iniciar o Gateway

**Por quê**
O nó Android precisa se conectar a um Gateway em execução para funcionar. O Gateway fornece o plano de controle WebSocket e o serviço de emparelhamento.

```bash
clawdbot gateway --port 18789 --verbose
```

**Você deve ver**:
```
listening on ws://0.0.0.0:18789
bonjour: advertising _clawdbot-gw._tcp on local...
```

::: tip Modo Tailscale (recomendado)

Se o Gateway e o dispositivo Android estiverem em redes diferentes mas conectados por Tailscale, vincule o Gateway ao IP do tailnet:

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: {
    bind: "tailnet"
  }
}
```

Após reiniciar o Gateway, o nó Android pode ser descoberto por Wide-Area Bonjour.

:::

### Passo 2: Verificar a Descoberta (opcional)

**Por quê**
Confirme que o serviço Bonjour/mDNS do Gateway está funcionando normalmente para facilitar a descoberta pelo aplicativo Android.

No host do Gateway, execute:

```bash
dns-sd -B _clawdbot-gw._tcp local.
```

**Você deve ver**:
```
Timestamp     A/R    IF  N/T   Target              Port
==========   ===   ===  ========               ====
12:34:56.123 Addr   10  _clawdbot-gw._tcp. 18789
```

Se você vir uma saída semelhante, significa que o Gateway está anunciando o serviço de descoberta.

::: details Depurar problemas do Bonjour

Se a descoberta falhar, possíveis causas:

- **mDNS bloqueado**: Algumas redes Wi-Fi desabilitam o mDNS
- **Firewall**: Bloqueia a porta UDP 5353
- **Isolamento de rede**: Dispositivos em VLANs ou sub-redes diferentes

Solução: Use Tailscale + Wide-Area Bonjour ou configure manualmente o endereço do Gateway.

:::

### Passo 3: Conectar pelo Android

**Por quê**
O aplicativo Android descobre o Gateway por meio de mDNS/NSD e estabelece uma conexão WebSocket.

No aplicativo Android:

1. Abra **Configurações** (Settings)
2. Selecione seu Gateway em **Discovered Gateways**
3. Clique em **Connect**

**Se o mDNS estiver bloqueado**:
- Vá para **Advanced → Manual Gateway**
- Insira o **nome do host e a porta** do Gateway (por exemplo, `192.168.1.100:18789`)
- Clique em **Connect (Manual)**

::: tip Reconexão automática

Após o emparelhamento bem-sucedido pela primeira vez, o aplicativo Android se reconectará automaticamente ao iniciar:
- Se um endpoint manual estiver habilitado, usa o endpoint manual
- Caso contrário, usa o último Gateway descoberto (melhor esforço)

:::

**Ponto de verificação ✅**
- O aplicativo Android exibe o status "Connected"
- O aplicativo exibe o nome de exibição do Gateway
- O aplicativo exibe o status de emparelhamento (Pending ou Paired)

### Passo 4: Aprovar o Emparelhamento (CLI)

**Por quê**
O Gateway precisa que você aprove a solicitação de emparelhamento do nó para conceder permissões de acesso.

No host do Gateway:

```bash
# Visualizar solicitações de emparelhamento pendentes
clawdbot nodes pending

# Aprovar o emparelhamento
clawdbot nodes approve <requestId>
```

::: details Fluxo de emparelhamento

Fluxo de trabalho do Gateway-owned pairing:

1. O nó Android conecta ao Gateway e solicita emparelhamento
2. O Gateway armazena a **solicitação pendente** e emite o evento `node.pair.requested`
3. Você aprova ou rejeita a solicitação por meio da CLI
4. Após a aprovação, o Gateway emite um novo **token de autenticação**
5. O nó Android usa o token para se reconectar e passa para o estado "paired"

As solicitações pendentes expiram automaticamente após **5 minutos**.

:::

**Você deve ver**:
```
✓ Node approved: android-node-abc123
Token issued: eyJhbGc...
```

O aplicativo Android se reconectará automaticamente e exibirá o status "Paired".

### Passo 5: Verificar se o Nó Está Conectado

**Por quê**
Confirme que o nó Android foi emparelhado com sucesso e conectado ao Gateway.

Verifique por meio da CLI:

```bash
clawdbot nodes status
```

**Você deve ver**:
```
Known: 1 · Paired: 1 · Connected: 1

┌──────────────────────────────────────────────┐
│ Name: My Samsung Tab                     │
│ Device: Android                          │
│ Model: Samsung SM-X926B                 │
│ IP: 192.168.0.99                      │
│ Status: paired, connected                 │
│ Caps: camera, canvas, screen, location, sms │
└──────────────────────────────────────────────┘
```

Ou por meio da API do Gateway:

```bash
clawdbot gateway call node.list --params '{}'
```

### Passo 6: Testar a Funcionalidade da Camera

**Por quê**
Verifique se os comandos da Camera do nó Android estão funcionando normalmente e as permissões foram concedidas.

Teste tirar fotos por meio da CLI:

```bash
# Tirar foto (câmera frontal padrão)
clawdbot nodes camera snap --node "android-node"

# Especificar câmera traseira
clawdbot nodes camera snap --node "android-node" --facing back

# Gravar vídeo (3 segundos)
clawdbot nodes camera clip --node "android-node" --duration 3000
```

**Você deve ver**:
```
MEDIA: /tmp/clawdbot-camera-snap-123456.jpg
```

::: tip Permissões da Camera

O nó Android precisa das seguintes permissões de execução:

- **CAMERA**: Para `camera.snap` e `camera.clip`
- **RECORD_AUDIO**: Para `camera.clip` (quando `includeAudio=true`)

Ao chamar comandos da Camera pela primeira vez, o aplicativo solicitará que você conceda as permissões. Se recusado, os comandos retornarão o erro `CAMERA_PERMISSION_REQUIRED` ou `AUDIO_PERMISSION_REQUIRED`.

:::

### Passo 7: Testar a Funcionalidade Canvas

**Por quê**
Verifique se a interface de visualização Canvas pode ser exibida no dispositivo Android.

::: info Canvas Host

O Canvas precisa de um servidor HTTP para fornecer conteúdo HTML/CSS/JS. Por padrão, o Gateway executa o Canvas Host na porta 18793.

:::

Crie o arquivo Canvas no host do Gateway:

```bash
mkdir -p ~/clawd/canvas
echo '<h1>Hello from AI!</h1>' > ~/clawd/canvas/index.html
```

Navegue até o Canvas no aplicativo Android:

```bash
clawdbot nodes invoke --node "android-node" \
  --command canvas.navigate \
  --params '{"url":"http://<gateway-hostname>.local:18793/__clawdbot__/canvas/"}'
```

**Você deve ver**:
A página "Hello from AI!" é exibida no aplicativo Android.

::: tip Ambiente Tailscale

Se o dispositivo Android e o Gateway estiverem ambos na rede Tailscale, use o nome MagicDNS ou o IP do tailnet em vez de `.local`:

```json
{"url":"http://<gateway-magicdns>:18793/__clawdbot__/canvas/"}
```

:::

### Passo 8: Testar as Funcionalidades Screen e Location

**Por quê**
Verifique se as funções de gravação de tela e obtenção de localização estão funcionando normalmente.

Gravação de tela:

```bash
# Gravar tela por 10 segundos
clawdbot nodes screen record --node "android-node" --duration 10s --fps 15
```

**Você deve ver**:
```
MEDIA: /tmp/clawdbot-screen-record-123456.mp4
```

Obtenção de localização:

```bash
clawdbot nodes invoke --node "android-node" --command location.get
```

**Você deve ver**:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 10,
  "timestamp": 1706345678000
}
```

::: warning Requisitos de permissão

A gravação de tela requer a permissão **RECORD_AUDIO** do Android (se o áudio estiver habilitado) e acesso de primeiro plano. A obtenção de localização requer a permissão **LOCATION**.

Ao chamar pela primeira vez, o aplicativo solicitará que você conceda as permissões.

:::

## Cuidados Comuns

### Problema 1: Não é possível descobrir o Gateway

**Sintoma**: O Gateway não é visível no aplicativo Android

**Possíveis causas**:
- O Gateway não foi iniciado ou está vinculado ao loopback
- O mDNS está bloqueado na rede
- O firewall está bloqueando a porta UDP 5353

**Soluções**:
1. Verifique se o Gateway está em execução: `clawdbot nodes status`
2. Use um endereço manual do Gateway: insira o IP e a porta do Gateway no aplicativo Android
3. Configure Tailscale + Wide-Area Bonjour (recomendado)

### Problema 2: Falha na conexão após o emparelhamento

**Sintoma**: Exibe "Paired" mas não é possível conectar

**Possíveis causas**:
- Token expirado (o token gira após cada emparelhamento)
- O Gateway foi reiniciado, mas o nó não se reconectou
- Alteração de rede

**Soluções**:
1. Clique manualmente em "Reconnect" no aplicativo Android
2. Verifique os logs do Gateway: `bonjour: client disconnected ...`
3. Emparelhe novamente: exclua o nó e aprove novamente

### Problema 3: Comandos da Camera retornam erro de permissão

**Sintoma**: `camera.snap` retorna `CAMERA_PERMISSION_REQUIRED`

**Possíveis causas**:
- O usuário negou a permissão
- A permissão está desabilitada pela política do sistema

**Soluções**:
1. Procure o aplicativo "Clawdbot" nas configurações do Android
2. Vá para "Permissions"
3. Conceda permissões de Câmera e Microfone
4. Tente os comandos da Camera novamente

### Problema 4: Falha na chamada em segundo plano

**Sintoma**: Chamadas em segundo plano retornam `NODE_BACKGROUND_UNAVAILABLE`

**Causa**: O nó Android permite apenas chamadas de comandos locais de dispositivo em primeiro plano

**Soluções**:
1. Certifique-se de que o aplicativo está em execução em primeiro plano (abra o aplicativo)
2. Verifique se o aplicativo está sendo otimizado pelo sistema (otimização de bateria)
3. Desabilite as restrições de "modo de economia de energia" para o aplicativo

## Resumo da Lição

Esta lição apresentou como configurar um nó Android para executar operações locais de dispositivo:

- **Fluxo de conexão**: Conecte o nó Android ao Gateway por meio de mDNS/NSD ou configuração manual
- **Mecanismo de emparelhamento**: Use o Gateway-owned pairing para aprovar permissões de acesso ao nó
- **Funcionalidades disponíveis**: Camera, Canvas, Screen, Location, SMS
- **Ferramentas CLI**: Use comandos `clawdbot nodes` para gerenciar nós e chamar funcionalidades
- **Requisitos de permissão**: O aplicativo Android precisa de permissões de execução, como Camera, Audio, Location

**Pontos chave**:
- O nó Android é um aplicativo complementar e não hospeda o Gateway
- Todas as operações locais de dispositivo exigem que o aplicativo esteja em execução em primeiro plano
- As solicitações de emparelhamento expiram automaticamente após 5 minutos
- Suporta descoberta Wide-Area Bonjour para redes Tailscale

## Próxima Lição

> Na próxima lição, aprenderemos sobre **[Interface de visualização Canvas e A2UI](../../advanced/canvas/)**.
>
> Você aprenderá:
> - Mecanismo de push A2UI Canvas
> - Como exibir conteúdo em tempo real no Canvas
> - Lista completa de comandos Canvas

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade        | Caminho do arquivo                                                                                    | Número de linhas    |
|--- | --- | ---|
| Política de comandos de nó | [`src/gateway/node-command-policy.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/node-command-policy.ts) | 1-112   |
| Schema do protocolo de nó | [`src/gateway/protocol/schema/nodes.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/schema/nodes.ts) | 1-103   |
| Documentação do Android  | [`docs/platforms/android.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/android.md) | 1-142   |
| CLI de nó  | [`docs/cli/nodes.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/nodes.md) | 1-69    |

**Constantes principais**:
- `PLATFORM_DEFAULTS`: Define a lista de comandos suportados por cada plataforma (`node-command-policy.ts:32-58`)
- Comandos suportados pelo Android: Canvas, Camera, Screen, Location, SMS (`node-command-policy.ts:34-40`)

**Funções principais**:
- `resolveNodeCommandAllowlist()`: Resolve a lista de comandos permitidos com base na plataforma (`node-command-policy.ts:77-91`)
- `normalizePlatformId()`: Normaliza o ID da plataforma (`node-command-policy.ts:60-75`)

**Características do nó Android**:
- ID do cliente: `clawdbot-android` (`gateway/protocol/client-info.ts:9`)
- Detecção de família de dispositivos: Identifica o Android por meio do campo `deviceFamily` (`node-command-policy.ts:70`)
- Funcionalidades Canvas e Camera habilitadas por padrão (`docs/platforms/android.md`)

</details>
