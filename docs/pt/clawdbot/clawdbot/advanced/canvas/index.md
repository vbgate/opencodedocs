---
title: "Interface visual Canvas e A2UI | Tutorial Clawdbot"
sidebarTitle: "Criar interfaces visuais para IA"
subtitle: "Interface visual Canvas e A2UI"
description: "Aprenda a usar a interface visual Canvas do Clawdbot, entenda o mecanismo de push A2UI, a configuração de Canvas Host e as operações Canvas em nós, e crie interfaces interativas para assistentes de IA. Este tutorial cobre dois métodos: HTML estático e A2UI dinâmico, incluindo a referência completa de comandos da ferramenta canvas, mecanismos de segurança, opções de configuração e dicas de solução de problemas."
tags:
  - "Canvas"
  - "A2UI"
  - "Interface visual"
  - "Nós"
prerequisite:
  - "start-getting-started"
  - "platforms-ios-node"
  - "platforms-android-node"
order: 240
---

# Interface visual Canvas e A2UI

## O que você poderá fazer após esta lição

Ao concluir esta lição, você será capaz de:

- Configurar Canvas Host e implantar interfaces personalizadas de HTML/CSS/JS
- Usar a ferramenta `canvas` para controlar Canvas em nós (mostrar, ocultar, navegar, executar JS)
- Dominar o protocolo A2UI para permitir que a IA envie atualizações de UI dinamicamente
- Capturar capturas de tela do Canvas para o contexto da IA
- Entender os mecanismos de segurança e controle de acesso do Canvas

## Sua situação atual

Você tem um assistente de IA, mas ele só pode interagir com você por texto. Você deseja:

- Que a IA exiba interfaces visuais, como tabelas, gráficos, formulários
- Ver interfaces dinâmicas geradas por Agentes em dispositivos móveis
- Criar uma experiência interativa do tipo "aplicativo" sem desenvolver independentemente

## Quando usar esta técnica

**Canvas + A2UI é adequado para estes cenários**:

| Cenário | Exemplo |
|--- | ---|
| **Visualização de dados** | Exibir gráficos estatísticos, barras de progresso, linhas do tempo |
| **Formulários interativos** | Pedir ao usuário para confirmar ações, selecionar opções |
| **Painéis de status** | Exibir o progresso de tarefas em tempo real, status do sistema |
| **Jogos e entretenimento** | Mini jogos simples, demonstrações interativas |

::: tip A2UI vs HTML estático
- **A2UI**(Agent-to-UI): A IA gera e atualiza a UI dinamicamente, adequado para dados em tempo real
- **HTML estático**: Interfaces predefinidas, adequado para layouts fixos e interações complexas
:::

## 🎒 Preparativos

Antes de começar, certifique-se de ter completado:

- [ ] **Gateway iniciado**: Canvas Host é iniciado automaticamente com o Gateway por padrão (porta 18793)
- [ ] **Nós pareados**: Nós macOS/iOS/Android conectados ao Gateway
- [ ] **Nós compatíveis com Canvas**: Confirme que o nó tem capacidade `canvas` (`clawdbot nodes list`)

::: warning Conhecimentos prévios
Este tutorial assume que você já conhece:
- [Emparelhamento básico de nós](../../platforms/android-node/)
- [Mecanismo de chamadas de ferramentas de IA](../tools-browser/)
:::

## Conceitos chave

O sistema Canvas inclui três componentes principais:

```
┌─────────────────┐
│   Canvas Host  │ ────▶ Servidor HTTP (porta 18793)
│   (Gateway)   │        └── Serve arquivos ~/clawd/canvas/
└─────────────────┘
        │
        │ Comunicação WebSocket
        │
┌─────────────────┐
│    Node App   │ ────▶ WKWebView renderiza Canvas
│ (iOS/Android) │        └── Recebe pushes via A2UI
└─────────────────┘
        │
        │ Eventos userAction
        │
┌─────────────────┐
│   AI Agent    │ ────▶ Chamadas à ferramenta canvas
│  (pi-mono)   │        └── Envia atualizações A2UI
└─────────────────┘
```

**Conceitos chave**:

1. **Canvas Host**(lado Gateway)
   - Fornece serviço de arquivos estáticos: `http://<gateway-host>:18793/__clawdbot__/canvas/`
   - Hospeda host A2UI: `http://<gateway-host>:18793/__clawdbot__/a2ui/`
   - Suporta recarregamento a quente: atualização automática após modificar arquivos

2. **Canvas Panel**(lado nó)
   - Nós macOS/iOS/Android incorporam WKWebView
   - Conectam ao Gateway via WebSocket (recarregamento em tempo real, comunicação A2UI)
   - Suportam `eval` para executar JS, `snapshot` para capturar tela

3. **Protocolo A2UI**(v0.8)
   - O Agente envia atualizações de UI via WebSocket
   - Suporta: `beginRendering`, `surfaceUpdate`, `dataModelUpdate`, `deleteSurface`

## Siga os passos

### Passo 1: Verificar o status do Canvas Host

**Por que**
Garantir que o Canvas Host esteja em execução para que os nós possam carregar o conteúdo Canvas.

```bash
# Verificar se a porta 18793 está em escuta
lsof -i :18793
```

**Você deve ver**:

```text
COMMAND   PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
node     12345  user   16u  IPv6  0x1234      0t0  TCP *:18793 (LISTEN)
```

::: info Caminhos de configuração
- **Diretório raiz Canvas**: `~/clawd/canvas/`(modificável por `canvasHost.root`)
- **Porta**: `18793` = `gateway.port + 4`(modificável por `canvasHost.port`)
- **Recarregamento a quente**: Ativado por padrão(desativável por `canvasHost.liveReload: false`)
:::

### Passo 2: Criar a primeira página Canvas

**Por que**
Criar uma interface HTML personalizada para exibir seu conteúdo no nó.

```bash
# Criar diretório raiz Canvas (se não existir)
mkdir -p ~/clawd/canvas

# Criar arquivo HTML simples
cat > ~/clawd/canvas/hello.html <<'EOF'
<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hello Canvas</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    padding: 20px;
    background: #000;
    color: #fff;
    text-align: center;
  }
  h1 { color: #24e08a; }
</style>
<h1>🎉 Hello from Canvas!</h1>
<p>Esta é sua primeira página Canvas.</p>
<button onclick="alert('Botão clicado!')">Clique aqui</button>
EOF
```

**Você deve ver**:

```text
Arquivo criado: ~/clawd/canvas/hello.html
```

### Passo 3: Exibir Canvas no nó

**Por que**
Fazer com que o nó carregue e exiba a página que você acabou de criar.

Primeiro encontre o ID do seu nó:

```bash
clawdbot nodes list
```

**Você deve ver**:

```text
ID                                  Name          Type       Capabilities
──────────────────────────────────────────────────────────────────────────
abc123-def456-ghi789               iOS Phone     canvas, camera, screen
jkl012-mno345-pqr678               Android Tab   canvas, camera
```

Em seguida, exiba o Canvas (usando o nó iOS como exemplo):

```bash
# Método 1: Via comando CLI
clawdbot nodes canvas present --node abc123-def456-ghi789 --target http://127.0.0.1:18793/__clawdbot__/canvas/hello.html
```

**Você deve ver**:

- Um painel sem bordas emerge no dispositivo iOS exibindo seu conteúdo HTML
- O painel aparece perto da barra de menus ou posição do mouse
- O conteúdo está centralizado com um título verde e um botão

**Exemplo de chamada de IA**:

```
IA: Abri um painel Canvas no seu dispositivo iOS exibindo a página de boas-vindas.
```

::: tip Formato de URL Canvas
- **Arquivo local**: `http://<gateway-host>:18793/__clawdbot__/canvas/hello.html`
- **URL externa**: `https://example.com`(requer permissões de rede do nó)
- **Voltar ao padrão**: `/` ou string vazia, exibe a página de scaffolding integrada
:::

### Passo 4: Usar A2UI para enviar UI dinâmica

**Por que**
A IA pode enviar atualizações de UI diretamente para o Canvas sem modificar arquivos, adequado para dados em tempo real e interação.

**Método A: Envio rápido de texto**

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --text "Hello from A2UI"
```

**Você deve ver**:

- Canvas exibe interface A2UI azul
- Texto centralizado exibindo: `Hello from A2UI`

**Método B: Envio completo JSONL**

Crie arquivo de definição A2UI:

```bash
cat > /tmp/a2ui-demo.jsonl <<'EOF'
{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","status","button"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"Demo A2UI"},"usageHint":"h1"}}},{"id":"status","component":{"Text":{"text":{"literalString":"Status do sistema: Executando"},"usageHint":"body"}}},{"id":"button","component":{"Button":{"label":{"literalString":"Botão de teste"},"onClick":{"action":{"name":"testAction","sourceComponentId":"demo.test"}}}}}]}
{"beginRendering":{"surfaceId":"main","root":"root"}}
EOF
```

Envie A2UI:

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --jsonl /tmp/a2ui-demo.jsonl
```

**Você deve ver**:

```
┌────────────────────────────┐
│     Demo A2UI         │
│                        │
│  Status do sistema: Executando  │
│                        │
│   [ Botão de teste ]          │
└────────────────────────────┘
```

::: details Explicação do formato JSONL A2UI
JSONL (JSON Lines) contém um objeto JSON por linha, adequado para atualizações em streaming:

```jsonl
{"surfaceUpdate":{...}}   // Atualizar componentes de superfície
{"beginRendering":{...}}   // Iniciar renderização
{"dataModelUpdate":{...}} // Atualizar modelo de dados
{"deleteSurface":{...}}   // Excluir superfície
```
:::

### Passo 5: Executar JavaScript Canvas

**Por que**
Executar JS personalizado no Canvas, como modificar DOM, ler estado.

```bash
clawdbot nodes canvas eval --node abc123-def456-ghi789 --js "document.title"
```

**Você deve ver**:

```text
"Hello from Canvas"
```

::: tip Exemplos de execução JS
- Ler elemento: `document.querySelector('h1').textContent`
- Modificar estilo: `document.body.style.background = '#333'`
- Calcular valor: `innerWidth + 'x' + innerHeight`
- Executar fechamento: `(() => { ... })()`
:::

### Passo 6: Capturar captura de tela Canvas

**Por que**
Permitir que a IA veja o estado atual do Canvas para compreensão de contexto.

```bash
# Formato padrão (JPEG)
clawdbot nodes canvas snapshot --node abc123-def456-ghi789

# Formato PNG + limite de largura máxima
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format png --max-width 1200

# JPEG de alta qualidade
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format jpg --quality 0.9
```

**Você deve ver**:

```text
Canvas snapshot saved to: /var/folders/.../canvas-snapshot.jpg
```

O caminho do arquivo é gerado automaticamente pelo sistema, geralmente no diretório temporário.

### Passo 7: Ocultar Canvas

**Por que**
Fechar o painel Canvas para liberar espaço na tela.

```bash
clawdbot nodes canvas hide --node abc123-def456-ghi789
```

**Você deve ver**:

- O painel Canvas no dispositivo iOS desaparece
- O estado do nó é recuperado (se estava ocupado anteriormente)

## Ponto de controle ✅

**Verificar se as funções do Canvas funcionam corretamente**:

| Elemento de verificação | Método de verificação |
|--- | ---|
| Canvas Host em execução | `lsof -i :18793` tem saída |
| Capacidade de nó Canvas | `clawdbot nodes list` exibe `canvas` |
| Página carregada com sucesso | O nó exibe conteúdo HTML |
| Envio A2UI bem-sucedido | Canvas exibe interface A2UI azul |
| Execução JS retorna resultado | O comando `eval` retorna valor |
| Captura de tela gerada | O diretório temporário tem arquivo `.jpg` ou `.png` |

## Avisos

::: warning Limitações primeiro plano/fundo
- **Nós iOS/Android**: Os comandos `canvas.*` e `camera.*` **devem ser executados em primeiro plano**
- Chamadas em segundo plano retornarão: `NODE_BACKGROUND_UNAVAILABLE`
- Solução: Despertar o dispositivo para o primeiro plano
:::

::: danger Precauções de segurança
- **Proteção contra percurso de diretório**: As URLs do Canvas proíbem `..` para acessar diretórios superiores
- **Scheme personalizado**: `clawdbot-canvas://` limitado apenas ao uso interno do nó
- **Restrições HTTPS**: As URLs HTTPS externas requerem permissões de rede do nó
- **Acesso a arquivos**: O Canvas Host permite apenas acessar arquivos sob `canvasHost.root`
:::

::: tip Dicas de depuração
- **Ver logs do Gateway**: `clawdbot gateway logs`
- **Ver logs do nó**: iOS Configurações → Debug Logs, Logs dentro do aplicativo Android
- **Testar URL**: Acesse diretamente no navegador `http://<gateway-host>:18793/__clawdbot__/canvas/`
:::

## Resumo da lição

Nesta lição, você aprendeu:

1. **Arquitetura Canvas**: Entender a relação entre Canvas Host, Node App e protocolo A2UI
2. **Configurar Canvas Host**: Ajustar diretório raiz, porta e configuração de recarregamento a quente
3. **Criar páginas personalizadas**: Escrever HTML/CSS/JS e implantar em nós
4. **Usar A2UI**: Enviar atualizações de UI dinâmica via JSONL
5. **Executar JavaScript**: Executar código no Canvas, ler e modificar estado
6. **Capturar capturas de tela**: Permitir que a IA veja o estado atual do Canvas

**Pontos chave**:

- Canvas Host é iniciado automaticamente com Gateway, não requer configuração adicional
- A2UI é adequado para dados em tempo real, HTML estático para interações complexas
- Os nós devem estar em primeiro plano para executar operações Canvas
- Usar `canvas snapshot` para passar o estado da UI para a IA

## Próxima lição

> Na próxima lição, aprenderemos **[Despertar por voz e texto para fala](../voice-tts/)**.
>
> Você aprenderá:
> - Configurar palavras-chave de despertar Voice Wake
> - Usar Talk Mode para conversas de voz contínuas
> - Integrar vários provedores TTS (Edge, Deepgram, ElevenLabs)

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-27

| Função | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Servidor Canvas Host | [`src/canvas-host/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/server.ts) | 372-441 |
| Processamento de protocolo A2UI | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 150-203 |
| Definição de ferramenta Canvas | [`src/agents/tools/canvas-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/canvas-tool.ts) | 52-179 |
| Constantes de caminho Canvas | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 8-10 |

**Constantes chave**:
- `A2UI_PATH = "/__clawdbot__/a2ui"`: Caminho do host A2UI
- `CANVAS_HOST_PATH = "/__clawdbot__/canvas"`: Caminho de arquivos Canvas
- `CANVAS_WS_PATH = "/__clawdbot__/ws"`: Caminho de recarregamento a quente WebSocket

**Funções chave**:
- `createCanvasHost()`: Iniciar servidor HTTP Canvas (porta 18793)
- `injectCanvasLiveReload()`: Injetar script de recarregamento a quente WebSocket em HTML
- `handleA2uiHttpRequest()`: Lidar com solicitações de recursos A2UI
- `createCanvasTool()`: Registrar ferramenta `canvas` (present/hide/navigate/eval/snapshot/a2ui_push/a2ui_reset)

**Ações Canvas suportadas**:
- `present`: Exibir Canvas (URL, posição, tamanho opcionais)
- `hide`: Ocultar Canvas
- `navigate`: Navegar para URL (caminho local/HTTP/file://)
- `eval`: Executar JavaScript
- `snapshot`: Capturar captura de tela (PNG/JPEG, maxWidth/quality opcionais)
- `a2ui_push`: Enviar atualizações A2UI (JSONL ou texto)
- `a2ui_reset`: Redefinir estado A2UI

**Schema de configuração**:
- `canvasHost.root`: Diretório raiz Canvas (padrão `~/clawd/canvas`)
- `canvasHost.port`: Porta HTTP (padrão 18793)
- `canvasHost.liveReload`: Ativar recarregamento a quente (padrão true)
- `canvasHost.enabled`: Ativar Canvas Host (padrão true)

**Mensagens suportadas pelo A2UI v0.8**:
- `beginRendering`: Iniciar renderização de superfície específica
- `surfaceUpdate`: Atualizar componentes de superfície (Column, Text, Button, etc.)
- `dataModelUpdate`: Atualizar modelo de dados
- `deleteSurface`: Excluir superfície específica

</details>
