---
title: "Ferramentas de Automação do Navegador: Controle Web e Automação de UI | Tutorial do Clawdbot"
sidebarTitle: "Controle do Navegador em 5 Minutos"
subtitle: "Ferramentas de Automação do Navegador: Controle Web e Automação de UI | Tutorial do Clawdbot"
description: "Aprenda a usar as ferramentas do navegador do Clawdbot para automação web, capturas de tela, manipulação de formulários e controle de UI. Este tutorial cobre inicialização do navegador, instantâneos de página, interação UI (click/type/drag, etc.), upload de arquivos, gerenciamento de diálogos e controle remoto do navegador. Domine o fluxo de trabalho completo, incluindo modo de retransmissão de extensão do Chrome e configuração de navegador independente, bem como execução de operações do navegador em nós iOS/Android."
tags:
  - "browser"
  - "automation"
  - "ui"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 210
---

# Ferramentas de Automação do Navegador: Controle Web e Automação de UI

## O que você poderá fazer após completar

- Iniciar e controlar navegadores gerenciados pelo Clawdbot
- Usar a retransmissão de extensão do Chrome para assumir o controle de suas abas do Chrome existentes
- Capturar instantâneos de página (formato AI/ARIA) e capturas de tela (PNG/JPEG)
- Executar operações de automação de UI: clique, digitação de texto, arrastar, seleção, preenchimento de formulário
- Gerenciar upload de arquivos e diálogos (alert/confirm/prompt)
- Operar navegadores distribuídos através do servidor de controle remoto do navegador
- Executar operações do navegador em dispositivos iOS/Android usando o proxy do nó

## Sua situação atual

Você já executou o Gateway e configurou os modelos de IA, mas ainda tem dúvidas sobre o uso das ferramentas do navegador:

- A IA não pode acessar o conteúdo da página web e você precisa descrever a estrutura da página?
- Você quer que a IA preencha formulários automaticamente e clique em botões, mas não sabe como fazer?
- Você quer tirar capturas de tela ou salvar páginas web, mas precisa fazer manualmente toda vez?
- Você quer usar suas próprias abas do Chrome (com sessão conectada) em vez de iniciar um novo navegador?
- Você quer executar operações do navegador em dispositivos remotos como nós iOS/Android?

## Quando usar

**Cenários de uso das ferramentas do navegador**:

| Cenário | Action | Exemplo |
|--- | --- | ---|
| Automação de formulário | `act` + `fill` | Preencher formulários de registro, enviar pedidos |
| Web scraping | `snapshot` | Extrair estrutura de página, coletar dados |
| Salvar capturas de tela | `screenshot` | Salvar capturas de tela de páginas, salvar evidências |
| Upload de arquivos | `upload` | Fazer upload de currículo, upload de anexos |
| Gerenciamento de diálogos | `dialog` | Aceitar/rejeitar alert/confirm |
| Usar sessão existente | `profile="chrome"` | Operar em abas do Chrome conectadas |
| Controle remoto | `target="node"` | Executar em nós iOS/Android |

## 🎒 Preparativos antes de começar

::: warning Verificação prévia

Antes de usar as ferramentas do navegador, certifique-se de:

1. ✅ Gateway está iniciado (`clawdbot gateway start`)
2. ✅ Os modelos de IA estão configurados (Anthropic / OpenAI / OpenRouter, etc.)
3. ✅ As ferramentas do navegador estão habilitadas (`browser.enabled=true`)
4. ✅ Você entende o target que vai usar (sandbox/host/custom/node)
5. ✅ Se estiver usando a retransmissão de extensão do Chrome, você instalou e habilitou a extensão

:::

## Conceito central

**O que são as ferramentas do navegador?**

As ferramentas do navegador são ferramentas de automação integradas ao Clawdbot que permitem à IA controlar navegadores através de CDP (Chrome DevTools Protocol):

- **Servidor de controle**: `http://127.0.0.1:18791` (padrão)
- **Automação de UI**: Localização e manipulação de elementos baseada em Playwright
- **Mecanismo de instantâneo**: Formato AI ou ARIA, retorna estrutura de página e referências de elementos
- **Suporte multi-target**: sandbox (padrão), host (retransmissão do Chrome), custom (remoto), node (nó de dispositivo)

**Dois modos de navegador**:

| Modo | Profile | Driver | Descrição |
|--- | --- | --- | ---|
| **Navegador independente** | `clawd` (padrão) | clawd | Clawdbot inicia uma instância independente do Chrome/Chromium |
| **Retransmissão do Chrome** | `chrome` | extension | Assume o controle de suas abas do Chrome existentes (requer instalação da extensão) |

**Fluxo de trabalho**:

```
1. Iniciar navegador (start)
   ↓
2. Abrir aba (open)
   ↓
3. Obter instantâneo de página (snapshot) → obter referências de elementos (ref)
   ↓
4. Executar operações UI (act: click/type/fill/drag)
   ↓
5. Verificar resultados (screenshot/snapshot)
```

## Siga os passos

### Passo 1: Iniciar o navegador

**Por que**

Na primeira vez que usar as ferramentas do navegador, você precisa iniciar o servidor de controle do navegador.

```bash
# No chat, peça à IA para iniciar o navegador
Por favor, inicie o navegador

# Ou use a ferramenta do navegador
action: start
profile: clawd  # ou chrome (retransmissão de extensão do Chrome)
target: sandbox
```

**Você deverá ver**:

```
✓ Browser control server: http://127.0.0.1:18791
✓ Profile: clawd
✓ CDP endpoint: http://127.0.0.1:18792
✓ Headless: false
✓ Color: #FF4500
```

::: tip Ponto de verificação

- Ver `Browser control server` indica que a inicialização foi bem-sucedida
- Por padrão, usa o profile `clawd` (navegador independente)
- Se precisar usar a retransmissão de extensão do Chrome, use `profile="chrome"`
- A janela do navegador abrirá automaticamente (modo não headless)

:::

### Passo 2: Abrir página web

**Por que**

Abra a página web alvo para preparar a automação.

```bash
# No chat
Por favor, abra https://example.com

# Ou use a ferramenta do navegador
action: open
targetUrl: https://example.com
profile: clawd
target: sandbox
```

**Você deverá ver**:

```
✓ Tab opened: https://example.com
targetId: tab_abc123
url: https://example.com
```

::: tip Referência de elemento (targetId)

Toda vez que você abre ou foca uma aba, um `targetId` é retornado. Este ID é usado para operações posteriores (snapshot/act/screenshot).

:::

### Passo 3: Obter instantâneo de página

**Por que**

O instantâneo permite que a IA entenda a estrutura da página e retorna referências de elementos acionáveis (ref).

```bash
# Obter instantâneo no formato AI (padrão)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: ai
refs: aria  # Usa Playwright aria-ref ids (estável entre chamadas)

# Ou obter instantâneo no formato ARIA (saída estruturada)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: aria
```

**Você deverá ver** (formato AI):

```
Page snapshot:

[header]
  Logo [aria-label="Example Logo"]
  Navigation [role="navigation"]
    Home [href="/"] [ref="e1"]
    About [href="/about"] [ref="e2"]
    Contact [href="/contact"] [ref="e3"]

[main]
  Hero section
    Title: "Welcome to Example" [ref="e4"]
    Button: "Get Started" [ref="e5"] [type="primary"]

[form section]
  Login form
    Input: Email [type="email"] [ref="e6"]
    Input: Password [type="password"] [ref="e7"]
    Button: "Sign In" [ref="e8"]
```

::: tip Escolha do formato de instantâneo

| Formato | Uso | Características |
|--- | --- | ---|
| `ai` | Padrão, para IA | Boa legibilidade, adequado para análise de IA |
| `aria` | Saída estruturada | Adequado para cenários que exigem estrutura precisa |
| `refs="aria"` | Estável entre chamadas | Recomendado para operações de múltiplos passos (snapshot → act) |

:::

### Passo 4: Executar operações UI (act)

**Por que**

Use as referências de elementos (ref) retornadas no instantâneo para executar operações de automação.

```bash
# Clicar em botão
action: act
request: {
  kind: "click",
  ref: "e5",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Digitar texto
action: act
request: {
  kind: "type",
  ref: "e6",
  text: "user@example.com",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Preencher formulário (múltiplos campos)
action: act
request: {
  kind: "fill",
  fields: [
    { ref: "e6", value: "user@example.com" },
    { ref: "e7", value: "password123" }
  ],
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Clicar no botão de envio
action: act
request: {
  kind: "click",
  ref: "e8",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox
```

**Você deverá ver**:

```
✓ Clicked ref=e5
✓ Typed "user@example.com" into ref=e6
✓ Typed "password123" into ref=e7
✓ Clicked ref=e8
✓ Form submitted successfully
```

::: tip Operações UI comuns

| Operação | Kind | Parâmetros |
|--- | --- | ---|
| Clique | `click` | `ref`, `doubleClick`, `button`, `modifiers` |
| Digitação de texto | `type` | `ref`, `text`, `submit`, `slowly` |
| Pressionar tecla | `press` | `key`, `targetId` |
| Mouseover | `hover` | `ref`, `targetId` |
| Arrastar e soltar | `drag` | `startRef`, `endRef`, `targetId` |
| Seleção | `select` | `ref`, `values` |
| Preencher formulário | `fill` | `fields` (array) |
| Aguardar | `wait` | `timeMs`, `text`, `textGone`, `selector` |
| Executar JS | `evaluate` | `fn`, `ref`, `targetId` |

:::

### Passo 5: Capturar captura de tela da página web

**Por que**

Verificar resultados de operações ou salvar capturas de tela de páginas web.

```bash
# Capturar aba atual
action: screenshot
profile: clawd
targetId: tab_abc123
type: png

# Capturar página inteira
action: screenshot
profile: clawd
targetId: tab_abc123
fullPage: true
type: png

# Capturar elemento específico
action: screenshot
profile: clawd
targetId: tab_abc123
ref: "e4"  # Usa ref do instantâneo
type: jpeg
```

**Você deverá ver**:

```
📸 Screenshot saved: ~/.clawdbot/media/browser-screenshot-12345.png
```

::: tip Formatos de captura de tela

| Formato | Uso |
|--- | ---|
| `png` | Padrão, compressão sem perdas, adequado para documentos |
| `jpeg` | Compressão com perdas, arquivos menores, adequado para armazenamento |

:::

### Passo 6: Gerenciar upload de arquivos

**Por que**

Automatizar operações de upload de arquivos em formulários.

```bash
# Primeiro acionar o seletor de arquivos (clicar no botão de upload)
action: act
request: {
  kind: "click",
  ref: "upload_button"
}
profile: clawd
targetId: tab_abc123

# Depois fazer upload dos arquivos
action: upload
paths:
  - "/Users/you/Documents/resume.pdf"
  - "/Users/you/Documents/photo.jpg"
ref: "upload_button"  # Opcional: especificar ref do seletor de arquivos
targetId: tab_abc123
profile: clawd
```

**Você deverá ver**:

```
✓ Files uploaded: 2
  - /Users/you/Documents/resume.pdf
  - /Users/you/Documents/photo.jpg
```

::: warning Nota sobre caminhos de arquivos

- Use caminhos absolutos, caminhos relativos não são suportados
- Certifique-se de que os arquivos existam e tenham permissões de leitura
- Múltiplos arquivos são enviados na ordem do array

:::

### Passo 7: Gerenciar diálogos

**Por que**

Gerenciar automaticamente diálogos alert, confirm, prompt em páginas web.

```bash
# Aceitar diálogo (alert/confirm)
action: dialog
accept: true
targetId: tab_abc123
profile: clawd

# Rejeitar diálogo (confirm)
action: dialog
accept: false
targetId: tab_abc123
profile: clawd

# Responder ao diálogo prompt
action: dialog
accept: true
promptText: "Resposta do usuário"
targetId: tab_abc123
profile: clawd
```

**Você deverá ver**:

```
✓ Dialog handled: accepted (prompt: "Resposta do usuário")
```

## Problemas comuns

### ❌ Erro: Retransmissão de extensão do Chrome não conectada

**Mensagem de erro**:
```
No Chrome tabs are attached via Clawdbot Browser Relay extension. Click toolbar icon on tab you want to control (badge ON), then retry.
```

**Causa**: Você usou `profile="chrome"` mas não há abas anexadas

**Solução**:

1. Instale a extensão Clawdbot Browser Relay (Chrome Web Store)
2. Clique no ícone da extensão na aba que você quer controlar (badge ON)
3. Execute novamente `action: snapshot profile="chrome"`

### ❌ Erro: Referência de elemento expirada (stale targetId)

**Mensagem de erro**:
```
Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.
```

**Causa**: A aba foi fechada ou o targetId expirou

**Solução**:

```bash
# Obter novamente a lista de abas
action: tabs
profile: chrome

# Usar o novo targetId
action: snapshot
targetId: "novo_targetId"
profile: chrome
```

### ❌ Erro: Servidor de controle do navegador não iniciado

**Mensagem de erro**:
```
Browser control server not available. Run action=start first.
```

**Causa**: O servidor de controle do navegador não está iniciado

**Solução**:

```bash
# Iniciar navegador
action: start
profile: clawd
target: sandbox
```

### ❌ Erro: Timeout de conexão do navegador remoto

**Mensagem de erro**:
```
Remote CDP handshake timeout. Check remoteCdpTimeoutMs/remoteCdpHandshakeTimeoutMs.
```

**Causa**: Timeout de conexão do navegador remoto

**Solução**:

```bash
# Aumentar timeout no arquivo de configuração
# ~/.clawdbot/clawdbot.json
{
  "browser": {
    "remoteCdpTimeoutMs": 3000,
    "remoteCdpHandshakeTimeoutMs": 5000
  }
}
```

### ❌ Erro: Proxy do navegador do nó não disponível

**Mensagem de erro**:
```
Node browser proxy is disabled (gateway.nodes.browser.mode=off).
```

**Causa**: O proxy do navegador do nó está desabilitado

**Solução**:

```bash
# Habilitar navegador do nó no arquivo de configuração
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "nodes": {
      "browser": {
        "mode": "auto"  # ou "manual"
      }
    }
  }
}
```

## Resumo da lição

Nesta lição, você aprendeu:

✅ **Controle do navegador**: Iniciar/parar/verificar status
✅ **Gerenciamento de abas**: Abrir/focar/fechar abas
✅ **Instantâneos de página**: Formato AI/ARIA, obter referências de elementos
✅ **Automação de UI**: click/type/drag/fill/wait/evaluate
✅ **Capturas de tela**: Formato PNG/JPEG, capturas de página completa ou de elemento
✅ **Upload de arquivos**: Gerenciar seletores de arquivos, suporte a múltiplos arquivos
✅ **Gerenciamento de diálogos**: accept/reject/alert/confirm/prompt
✅ **Retransmissão do Chrome**: Use `profile="chrome"` para controlar abas existentes
✅ **Proxy do nó**: Execute em dispositivos através de `target="node"`

**Referência rápida de operações chave**:

| Operação | Action | Parâmetros chave |
|--- | --- | ---|
| Iniciar navegador | `start` | `profile` (clawd/chrome) |
| Abrir página web | `open` | `targetUrl` |
| Obter instantâneo | `snapshot` | `targetId`, `snapshotFormat`, `refs` |
| Operação UI | `act` | `request.kind`, `request.ref` |
| Captura de tela | `screenshot` | `targetId`, `fullPage`, `ref` |
| Upload de arquivos | `upload` | `paths`, `ref` |
| Diálogo | `dialog` | `accept`, `promptText` |

## Próxima lição

> Na próxima lição, aprenderemos **[Ferramentas de Execução de Comandos e Aprovação](../tools-exec/)**.
>
> Você aprenderá:
> - Configurar e usar a ferramenta exec
> - Entender o mecanismo de aprovação de segurança
> - Configurar allowlist para controlar comandos executáveis
> - Usar sandbox para isolar operações de risco

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-27

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Definição da ferramenta Browser | [`src/agents/tools/browser-tool.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/browser-tool.ts) | 269-791 |
| Browser Schema | [`src/agents/tools/browser-tool.schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/browser-tool.schema.ts) | 1-115 |
| Definição de tipos Action | [`src/browser/client-actions-core.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/client-actions-core.ts) | 18-86 |
| Análise de configuração do navegador | [`src/browser/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/config.ts) | 140-231 |
| Constantes do navegador | [`src/browser/constants.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/constants.ts) | 1-9 |
| Cliente CDP | [`src/browser/cdp.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/cdp.ts) | 1-500 |
| Detecção de executáveis do Chrome | [`src/browser/chrome.executables.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/chrome.executables.ts) | 1-500 |

**Constantes chave**:
- `DEFAULT_CLAWD_BROWSER_CONTROL_URL = "http://127.0.0.1:18791"`: Endereço do servidor de controle padrão (fonte: `src/browser/constants.ts:2`)
- `DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000`: Número máximo de caracteres padrão para instantâneos AI (fonte: `src/browser/constants.ts:6`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 10000`: Número máximo de caracteres no modo efficient (fonte: `src/browser/constants.ts:7`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH = 6`: Profundidade no modo efficient (fonte: `src/browser/constants.ts:8`)

**Funções chave**:
- `createBrowserTool()`: Cria a ferramenta do navegador, define todas as actions e processamento de parâmetros
- `browserSnapshot()`: Obtém instantâneo de página, suporta formato AI/ARIA
- `browserScreenshotAction()`: Executa operação de captura de tela, suporta capturas de página completa e de elemento
- `browserAct()`: Executa operações de automação de UI (click/type/drag/fill/wait/evaluate, etc.)
- `browserArmFileChooser()`: Gerencia upload de arquivos, aciona seletor de arquivos
- `browserArmDialog()`: Gerencia diálogos (alert/confirm/prompt)
- `resolveBrowserConfig()`: Analisa configuração do navegador, retorna endereço e porta do servidor de controle
- `resolveProfile()`: Analisa configuração de profile (clawd/chrome)

**Browser Actions Kind** (fonte: `src/agents/tools/browser-tool.schema.ts:5-17`):
- `click`: Clicar em elemento
- `type`: Digitar texto
- `press`: Pressionar tecla
- `hover`: Mouseover
- `drag`: Arrastar e soltar
- `select`: Selecionar opção suspensa
- `fill`: Preencher formulário (múltiplos campos)
- `resize`: Ajustar tamanho da janela
- `wait`: Aguardar
- `evaluate`: Executar JavaScript
- `close`: Fechar aba

**Browser Tool Actions** (fonte: `src/agents/tools/browser-tool.schema.ts:19-36`):
- `status`: Obter status do navegador
- `start`: Iniciar navegador
- `stop`: Parar navegador
- `profiles`: Listar todos os profiles
- `tabs`: Listar todas as abas
- `open`: Abrir nova aba
- `focus`: Focar aba
- `close`: Fechar aba
- `snapshot`: Obter instantâneo de página
- `screenshot`: Capturar captura de tela
- `navigate`: Navegar para URL específica
- `console`: Obter mensagens do console
- `pdf`: Salvar página como PDF
- `upload`: Fazer upload de arquivos
- `dialog`: Gerenciar diálogos
- `act`: Executar operações UI

</details>
