---
title: "Guia Completo do Aplicativo macOS: Menu Bar, Voice Wake, Talk Mode e Modo Nó | Tutorial Clawdbot"
sidebarTitle: "Mac se Torna Assistente de IA"
subtitle: "Guia Completo do Aplicativo macOS: Menu Bar, Voice Wake, Talk Mode e Modo Nó"
description: "Aprenda todas as funcionalidades do aplicativo macOS do Clawdbot, incluindo gerenciamento de status da menu bar, janela WebChat incorporada, Voice Wake, Talk Mode, modo nó, Exec Approvals e configuração de acesso remoto SSH/Tailscale. Domine as melhores práticas de alternância entre modo local vs remoto e gerenciamento de permissões."
tags:
  - "macOS"
  - "Aplicativo de Menu Bar"
  - "Voice Wake"
  - "Talk Mode"
  - "Modo Nó"
prerequisite:
  - "/pt/clawdbot/clawdbot/start/getting-started/"
order: 160
---

# Aplicativo macOS: Controle de Menu Bar e Interação por Voz

## O Que Você Vai Aprender

Após completar este tutorial, você será capaz de:

- ✅ Entender as funcionalidades principais do aplicativo macOS do Clawdbot como plano de controle da menu bar
- ✅ Dominar o uso do Voice Wake e do Talk Mode para conversas contínuas
- ✅ Entender as capacidades como `system.run`, Canvas e Camera no modo nó
- ✅ Configurar modo local vs remoto para diferentes cenários de implantação
- ✅ Gerenciar o mecanismo de aprovação Exec Approvals para controlar permissões de execução de comandos
- ✅ Usar deep links para acionar rapidamente o assistente de IA
- ✅ Acessar e controlar remotamente o Gateway via SSH/Tailscale

## Seu Problema Atual

Você pode estar pensando:

- "O que exatamente faz o aplicativo macOS? É o próprio Gateway?"
- "Como usar Voice Wake e Talk Mode? Precisa de hardware adicional?"
- "Qual é a diferença entre modo nó e modo normal? Quando usar cada um?"
- "Como gerenciar permissões e configurações de segurança no macOS?"
- "Posso executar o Gateway em outra máquina?"

A boa notícia é: **o aplicativo macOS do Clawdbot é o plano de controle gráfico do Gateway**, ele não executa o serviço Gateway, mas conecta, gerencia e monitora. Ao mesmo tempo, também atua como nó, expondo funcionalidades específicas do macOS (como `system.run`, Canvas, Camera) para o Gateway remoto.

## Quando Usar Este Recurso

Quando você precisar de:

- 🖥️ **Gerenciamento Gráfico do macOS** - Status e controle da menu bar, mais intuitivo que a linha de comando
- 🎙️ **Interação por Voz** - Voice Wake + Talk Mode para conversas contínuas
- 💻 **Execução Local de Comandos** - Executar comandos como `system.run` no nó macOS
- 🎨 **Visualização Canvas** - Renderizar interfaces visuais impulsionadas por IA no macOS
- 📷 **Funcionalidades do Dispositivo** - Câmera para fotos, vídeos e gravação de tela
- 🌐 **Acesso Remoto** - Controlar Gateway remoto via SSH/Tailscale

::: info Diferença entre Nó e Gateway
- **Gateway**: Executa modelos de IA, gerencia sessões, processa mensagens (pode executar em qualquer máquina)
- **Nó (Node)**: Exibe funcionalidades locais do dispositivo (Canvas, Camera, system.run) para o Gateway
- **Aplicativo macOS**: Pode ser cliente Gateway e atuar como nó
:::

---

## Ideia Principal

O aplicativo macOS do Clawdbot é um sistema com **papel duplo**:

```
┌──────────────────────────────────────────┐
│     Clawdbot.app (macOS App)           │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Plano de Controle da      │      │
│   │  Menu Bar                  │      │
│   │  • Gerenciamento de        │◄────► Gateway WebSocket
│   │    Conexão Gateway         │      │
│   │  • Janela WebChat          │      │
│   │  • Configurações           │      │
│   │  • Voice Wake/Talk Mode    │      │
│   └────────────────────────────┘      │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Serviço Nó               │      │
│   │  • system.run              │◄────► Protocolo Nó Gateway
│   │  • Canvas                 │      │
│   │  • Camera/Screen          │      │
│   └────────────────────────────┘      │
└──────────────────────────────────────────┘
```

**Dois Modos de Execução**:

| Modo | Localização do Gateway | Serviço Nó | Cenário de Uso |
| ----- | -------------- | --------- | -------- |
| **Modo Local** (padrão) | Local (daemon launchd) | Não inicia | Gateway executa neste Mac |
| **Modo Remoto** | Máquina remota (via SSH/Tailscale) | Inicia | Gateway executa em outra máquina |

**Módulos de Funcionalidades Principais**:

1. **Controle de Menu Bar** - Status de conexão Gateway, WebChat, configurações, gerenciamento de sessões
2. **Voice Wake** - Escuta global de palavra de ativação por voz
3. **Talk Mode** - Loop de conversa contínua por voz (entrada de voz → resposta IA → reprodução TTS)
4. **Modo Nó** - Exibe comandos específicos do macOS (`system.run`, `canvas.*`, `camera.*`)
5. **Exec Approvals** - Aprovação de execução e controle de segurança para comandos `system.run`
6. **Deep Links** - Protocolo `clawdbot://` para acionamento rápido de funcionalidades

---

## Siga-me

### Passo 1: Instalação e Inicialização do Aplicativo macOS

**Por que**
Você precisa instalar o aplicativo macOS do Clawdbot para obter controle de menu bar e funcionalidades de voz.

**Métodos de Instalação**:

::: code-group

```bash [Instalar via Homebrew]
brew install --cask clawdbot
```

```bash [Baixar manualmente .dmg]
# Baixar o Clawdbot.app.dmg mais recente de https://github.com/clawdbot/clawdbot/releases
# Arrastar para a pasta Applications
```

:::

**Primeira Execução**:

```bash
open /Applications/Clawdbot.app
```

**Você Deve Ver**:
- Ícone 🦞 na menu bar superior do macOS
- Clicar no ícone expande o menu suspenso
- Sistema exibe diálogo de solicitação de permissão TCC

::: tip Solicitações de Permissão na Primeira Execução
O aplicativo macOS requer as seguintes permissões (o sistema exibirá automaticamente prompts):
- **Permissão de Notificações** - Exibir notificações do sistema
- **Permissão de Acessibilidade** - Para Voice Wake e operações do sistema
- **Permissão de Microfone** - Necessário para Voice Wake e Talk Mode
- **Permissão de Gravação de Tela** - Funcionalidades Canvas e gravação de tela
- **Permissão de Reconhecimento de Voz** - Entrada de voz para Voice Wake
- **Permissão de Automação** - Controle AppleScript (se necessário)

Todas essas permissões são usadas **completamente localmente** e não são enviadas para nenhum servidor.
:::

---

### Passo 2: Configurar Modo de Conexão (Local vs Remoto)

**Por que**
Escolha modo local ou remoto de acordo com suas necessidades de implantação.

#### Modo A: Modo Local (Padrão)

Cenário de uso: Gateway e aplicativo macOS executando na mesma máquina.

**Etapas de Configuração**:

1. Certifique-se de que o aplicativo da menu bar exibe o modo **Local**
2. Se o Gateway não estiver executando, o aplicativo iniciará automaticamente o serviço launchd `com.clawdbot.gateway`
3. O aplicativo conectará a `ws://127.0.0.1:18789`

**Você Deve Ver**:
- Ícone da menu bar exibe verde (estado conectado)
- Cartão de status do Gateway exibe "Local"
- Serviço nó **não iniciado** (modo nó só é necessário no modo remoto)

#### Modo B: Modo Remoto

Cenário de uso: Gateway executa em outra máquina (como servidor ou VPS Linux), você quer controlá-lo via Mac.

**Etapas de Configuração**:

1. Alternar para o modo **Remote** no aplicativo da menu bar
2. Inserir o endereço WebSocket do Gateway remoto (ex: `ws://your-server:18789`)
3. Selecionar método de autenticação (Token ou Password)
4. O aplicativo estabelecerá automaticamente um túnel SSH para conectar ao Gateway remoto

**Você Deve Ver**:
- Ícone da menu bar exibe status de conexão (amarelo/verde/vermelho)
- Cartão de status do Gateway exibe endereço do servidor remoto
- Serviço nó **iniciado automaticamente** (para que Gateway remoto possa chamar funcionalidades locais)

**Mecanismo de Túnel do Modo Remoto**:

```
Aplicativo macOS                   Gateway Remoto
    │                                  │
    ├── Túnel SSH ───────────────────► ws://remote:18789
    │                                  │
    └── Serviço Nó ◄──────────────────── node.invoke
```

::: tip Vantagens do Modo Remoto
- **Gerenciamento Centralizado**: Executar Gateway em uma máquina poderosa, múltiplos clientes acessam
- **Otimização de Recursos**: Mac pode permanecer leve, Gateway executa em servidor de alto desempenho
- **Localização de Dispositivo**: Funcionalidades como Canvas e Camera ainda executam localmente no Mac
:::

---

### Passo 3: Usar Plano de Controle da Menu Bar

**Por que**
O aplicativo da menu bar fornece interface de acesso rápido a todas as funcionalidades principais.

**Itens de Menu Principais**:

Após clicar no ícone da menu bar, você verá:

1. **Cartão de Status**
   - Status de conexão Gateway (conectado/desconectando/conectado)
   - Modo atual (Local/Remote)
   - Lista de canais executando (WhatsApp, Telegram, etc.)

2. **Ações Rápidas**
   - **Agent** - Abrir janela de conversa IA (chama Gateway)
   - **WebChat** - Abrir interface WebChat incorporada
   - **Canvas** - Abrir janela de visualização Canvas
   - **Settings** - Abrir interface de configurações

3. **Alternâncias de Funcionalidade**
   - **Talk** - Habilitar/desabilitar Talk Mode
   - **Voice Wake** - Habilitar/desabilitar Voice Wake

4. **Menu de Informações**
   - **Usage** - Ver estatísticas de uso e custos
   - **Sessions** - Gerenciar lista de sessões
   - **Channels** - Ver status dos canais
   - **Skills** - Gerenciar pacotes de habilidades

**Você Deve Ver**:
- Indicadores de status atualizados em tempo real (verde = normal, vermelho = desconectado)
- Informações detalhadas de conexão ao passar o mouse
- Clicar em qualquer item de menu abre rapidamente a funcionalidade correspondente

---

### Passo 4: Configurar e Usar Voice Wake

**Por que**
Voice Wake permite acionar o assistente de IA via palavra de ativação por voz, sem precisar clicar ou digitar.

**Como Funciona o Voice Wake**:

```
┌──────────────────────────────────┐
│   Runtime Voice Wake         │
│                              │
│   Monitorar Microfone ──►     │
│   Detectar Palavra de        │
│   Ativação                   │
│                              │
│   Palavra de Ativação        │
│   Coincide?                  │
│       │                       │
│       ├─ Sim ──► Acionar Agent│
│       │                       │
│       └─ Não ──► Continuar  │
│         Monitorar            │
└──────────────────────────────────┘
```

**Configurar Voice Wake**:

1. Abrir **Settings** → **Voice Wake**
2. Inserir palavra de ativação (padrão: `clawd`, `claude`, `computer`)
3. Pode adicionar múltiplas palavras de ativação (separadas por vírgula)
4. Habilitar alternância **Enable Voice Wake**

**Regras de Palavra de Ativação**:
- Palavras de ativação armazenadas no Gateway: `~/.clawdbot/settings/voicewake.json`
- Todos os nós compartilham **a mesma lista global de palavras de ativação**
- As alterações são transmitidas para todos os dispositivos conectados (macOS, iOS, Android)

**Fluxo de Uso**:

1. Garantir que permissão de microfone foi concedida
2. Habilitar Voice Wake na menu bar
3. Falar a palavra de ativação no microfone (ex: "Hey clawd")
4. Aguardar ouvir som de "ding" (indica ativação bem-sucedida)
5. Falar seu comando ou pergunta

**Você Deve Ver**:
- Sobreposição Voice Wake aparecer no centro da tela
- Forma de onda de volume do microfone exibida
- Texto de status "Listening" exibido
- IA começa processar sua entrada de voz

::: tip Característica Global do Voice Wake
Palavras de ativação são **configuração global no nível do Gateway**, não limitadas a um único dispositivo. Isso significa:
- Após modificar palavras de ativação no macOS, dispositivos iOS e Android também sincronizam
- Todos os dispositivos usam o mesmo conjunto de palavras de ativação
- Mas cada dispositivo pode habilitar/desabilitar Voice Wake individualmente (baseado em permissões e preferências do usuário)
:::

---

### Passo 5: Usar Talk Mode para Conversas Contínuas

**Por que**
Talk Mode fornece experiência de conversa contínua por voz semelhante a Siri/Alexa, sem precisar ativar toda vez.

**Loop de Execução do Talk Mode**:

```
Monitorar ──► IA Processa ──► TTS Reproduz ──► Monitorar
  │                                              │
  └────────────────────────────────────────┘
```

**Habilitar Talk Mode**:

1. Clicar no botão **Talk** na menu bar
2. Ou usar atalho de teclado (padrão: nenhum, pode ser configurado em Settings)
3. Sobreposição Talk Mode aparece

**Estados da Interface do Talk Mode**:

| Estado | Exibição | Descrição |
| ----- | ---- | ---- |
| **Listening** | Animação de pulso de nuvem + volume de microfone | Aguardando você falar |
| **Thinking** | Animação de afundamento | IA está pensando |
| **Speaking** | Animação de anel de radiação + ondas | IA está respondendo (reproduzindo TTS) |

**Controles de Interação**:

- **Parar de Falar**: Clicar no ícone de nuvem para parar reprodução TTS
- **Sair do Talk Mode**: Clicar no botão X no canto superior direito
- **Interrupção de Voz**: Se você começar a falar enquanto IA fala, reprodução para automaticamente

**Configurar TTS**:

Talk Mode usa ElevenLabs para conversão de texto em fala. Localização de configuração: `~/.clawdbot/clawdbot.json`

```yaml
talk:
  voiceId: "elevenlabs_voice_id"  # ID de voz ElevenLabs
  modelId: "eleven_v3"            # Versão do modelo
  apiKey: "elevenlabs_api_key"     # Chave API (ou usar variável de ambiente)
  interruptOnSpeech: true           # Interrupção ao falar
  outputFormat: "mp3_44100_128"   # Formato de saída
```

::: tip Configuração ElevenLabs
Se não configurar chave API, Talk Mode tentará usar:
1. Variável de ambiente `ELEVENLABS_API_KEY`
2. Chave no shell profile do Gateway
3. Primeira voz ElevenLabs disponível como padrão
:::

---

### Passo 6: Usar Modo Nó

**Por que**
Modo nó permite aplicativo macOS expor capacidades locais para Gateway remoto,实现了 verdadeira colaboração entre dispositivos.

**Comandos Disponíveis no Modo Nó**:

| Categoria de Comando | Exemplo de Comando | Descrição da Funcionalidade |
| --------- | ---------- | -------- |
| **Canvas** | `canvas.present`, `canvas.navigate`, `canvas.eval` | Renderizar interfaces visuais no macOS |
| **Camera** | `camera.snap`, `camera.clip` | Tirar foto ou gravar vídeo |
| **Screen** | `screen.record` | Gravar tela |
| **System** | `system.run`, `system.notify` | Executar comandos Shell ou enviar notificações |

**Habilitar Modo Nó**:

Modo nó inicia **automaticamente no modo remoto**, pois Gateway remoto precisa chamar funcionalidades locais.

Você também pode iniciar manualmente o serviço nó:

```bash
clawdbot node run --display-name "My Mac"
```

**Gerenciamento de Permissões do Nó**:

Aplicativo macOS relata quais funcionalidades estão disponíveis através do sistema de permissões:

```json
{
  "canvas": true,
  "camera": true,
  "screen": true,
  "system": {
    "run": true,
    "notify": true
  }
}
```

IA selecionará automaticamente as ferramentas disponíveis com base nas permissões.

---

### Passo 7: Configurar Exec Approvals (Controle de Segurança `system.run`)

**Por que**
`system.run` pode executar comandos Shell arbitrários, portanto precisa de mecanismo de aprovação para prevenir operações erradas ou abuso.

**Modelo de Três Camadas de Segurança do Exec Approvals**:

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",          // Política padrão: negar
    "ask": "on-miss"           // Perguntar quando comando não está na whitelist
  },
  "agents": {
    "main": {
      "security": "allowlist",    // Sessão principal: apenas permitir whitelist
      "ask": "on-miss",
      "allowlist": [
        { "pattern": "/usr/bin/git" },
        { "pattern": "/opt/homebrew/*/rg" }
      ]
    }
  }
}
```

**Tipos de Política de Segurança**:

| Política | Comportamento | Cenário de Uso |
| ----- | ---- | -------- |
| `deny` | Recusar todas as chamadas `system.run` | Alta segurança, desabilitar todos os comandos |
| `allowlist` | Permitir apenas comandos na whitelist | Equilibrar segurança e conveniência |
| `ask` | Pedir aprovação do usuário quando não está na whitelist | Flexível mas requer confirmação |

**Fluxo de Aprovação**:

Quando IA tenta executar comando não autorizado:

1. Aplicativo macOS exibe diálogo de aprovação
2. Exibe caminho completo do comando e parâmetros
3. Fornece três opções:
   - **Allow Once** - Permitir apenas esta vez
   - **Always Allow** - Adicionar à whitelist
   - **Deny** - Recusar execução

**Você Deve Ver**:
- Diálogo de aprovação exibe detalhes do comando (ex: `/usr/bin/ls -la ~`)
- Após selecionar "Always Allow", não perguntará novamente
- Após selecionar "Deny", execução do comando falha e retorna erro para IA

**Localização de Configuração**:

Exec Approvals armazenado localmente no macOS:
- Arquivo: `~/.clawdbot/exec-approvals.json`
- Histórico de aprovações: Ver todos comandos aprovados/recusados no aplicativo

---

### Passo 8: Usar Deep Links

**Por que**
Deep Links fornecem capacidade de acionar rapidamente funcionalidades do Clawdbot de outros aplicativos.

**Protocolos de Deep Links Suportados**: `clawdbot://`

#### `clawdbot://agent`

Aciona solicitação `agent` Gateway, equivalente a executar `clawdbot agent` no terminal.

**Parâmetros**:

| Parâmetro | Descrição | Exemplo |
| ----- | ---- | ---- |
| `message` (obrigatório) | Mensagem para enviar à IA | `message=Hello%20from%20deep%20link` |
| `sessionKey` (opcional) | Chave da sessão alvo, padrão `main` | `sessionKey=main` |
| `thinking` (opcional) | Nível de pensamento: off\|minimal\|low\|medium\|high\|xhigh | `thinking=high` |
| `deliver`/`to`/`channel` (opcional) | Canal de entrega | `channel=telegram` |
| `timeoutSeconds` (opcional) | Tempo limite | `timeoutSeconds=30` |
| `key` (opcional) | Chave sem confirmação, para automação | `key=your-secret-key` |

**Exemplos**:

```bash
# Básico: enviar mensagem
open 'clawdbot://agent?message=Hello%20from%20deep%20link'

# Avançado: enviar para Telegram, nível de pensamento alto, tempo limite 30 segundos
open 'clawdbot://agent?message=Summarize%20my%20day&to=telegram&thinking=high&timeoutSeconds=30'

# Automação: usar chave para pular confirmação (apenas uso seguro em seus scripts)
open 'clawdbot://agent?message=Automated%20task&key=secure-random-string'
```

**Você Deve Ver**:
- Aplicativo macOS do Clawdbot abre automaticamente (se não estiver executando)
- Janela Agent aparece e exibe mensagem
- IA começa processar e retorna resposta

::: warning Segurança dos Deep Links
- Sem parâmetro `key`, aplicativo exibe diálogo de confirmação
- Com `key` válido, solicitação executa silenciosamente (para scripts de automação)
- Nunca use deep links de fontes não confiáveis
:::

---

## Ponto de Verificação ✅

Após completar as etapas acima, verifique o seguinte:

### Instalação e Conexão

- [ ] Aplicativo macOS instalado com sucesso e aparece na pasta Applications
- [ ] Todas as permissões necessárias concedidas na primeira execução
- [ ] Ícone da menu bar exibido normalmente
- [ ] Pode conectar ao Gateway em modo local (Local)
- [ ] Pode conectar ao Gateway em modo remoto (Remote)

### Voice Wake e Talk Mode

- [ ] Configuração de palavra de ativação Voice Wake bem-sucedida (ex: "clawd", "claude")
- [ ] Ao falar palavra de ativação, assistente IA é acionado
- [ ] Sobreposição Talk Mode abre e fecha normalmente
- [ ] Reprodução TTS clara (requer chave API ElevenLabs)
- [ ] Interrupção de voz funciona normalmente (para reprodução ao falar)

### Modo Nó e Exec Approvals

- [ ] Serviço nó inicia automaticamente no modo remoto
- [ ] Comandos `system.run` executam e retornam resultados
- [ ] Diálogo Exec Approvals aparece normalmente
- [ ] "Always Allow" adiciona corretamente à whitelist
- [ ] "Deny" recusa corretamente execução de comando

### Funcionalidades Avançadas

- [ ] Deep Links podem ser acionados do terminal ou outros aplicativos
- [ ] Interface de configurações salva configurações corretamente
- [ ] Janela WebChat incorporada abre normalmente
- [ ] Janela Canvas exibe conteúdo visual gerado por IA

---

## Armadilhas Comuns

### ❌ Permissões Recusadas ou Não Concedidas

**Problema**:
- Voice Wake não pode monitorar microfone
- Canvas não pode exibir conteúdo
- Execução de comandos `system.run` falha

**Solução**:
1. Abrir **Configurações do Sistema** → **Privacidade e Segurança**
2. Encontrar **Clawdbot** ou **Clawdbot.app**
3. Garantir que **Microfone**, **Acessibilidade**, **Gravação de Tela**, **Automação** e outras permissões estejam habilitadas
4. Reiniciar aplicativo Clawdbot

::: tip Solução de Problemas de Permissões TCC
Se alternância de permissão não habilita ou fecha imediatamente:
- Verificar se alguma ferramenta de segurança está habilitada (como Little Snitch)
- Tentar desinstalar completamente e reinstalar aplicativo
- Ver logs de recusa TCC no Console.app
:::

### ❌ Falha de Conexão Gateway

**Problema**:
- Ícone da menu bar exibe vermelho (estado desconectado)
- Cartão de status exibe "Connection Failed"
- WebChat não pode abrir

**Possíveis Causas e Soluções**:

| Causa | Método de Verificação | Solução |
| ----- | -------- | -------- |
| Gateway não iniciado | Executar `clawdbot gateway status` | Iniciar serviço Gateway |
| Endereço errado | Verificar URL WebSocket | Confirmar `ws://127.0.0.1:18789` ou endereço remoto correto |
| Porta ocupada | Executar `lsof -i :18789` | Fechar processo ocupando porta |
| Falha de autenticação | Verificar Token/Password | Confirmar credenciais de autenticação corretas |

### ❌ Talk Mode Não Funciona

**Problema**:
- Nenhuma reação após habilitar Talk Mode
- TTS não reproduz
- Microfone não pode entrar

**Solução**:

1. **Verificar Configuração ElevenLabs**:
   - Confirmar chave API configurada
   - Testar se chave é válida: visitar console ElevenLabs

2. **Verificar Conexão de Rede**:
   - TTS requer conexão com internet
   - Verificar se firewall bloqueia solicitações API

3. **Verificar Saída de Áudio**:
   - Confirmar volume do sistema aberto
   - Verificar se dispositivo de saída padrão está correto

### ❌ Nó Não Conecta no Modo Remoto

**Problema**:
- Gateway remoto não pode chamar comandos como `system.run` no macOS
- Logs de erro exibem "Node not found" ou "Node offline"

**Solução**:

1. **Confirmar Serviço Nó Executando**:
   ```bash
   clawdbot nodes list
   # Deve ver nó macOS exibido como "paired"
   ```

2. **Verificar Túnel SSH**:
   - Verificar status de conexão SSH nas configurações do aplicativo macOS
   - Confirmar pode SSH manualmente para Gateway remoto

3. **Reiniciar Serviço Nó**:
   ```bash
   # No macOS
   clawdbot node restart
   ```

---

## Resumo da Lição

Nesta lição você aprendeu:

1. ✅ **Arquitetura do Aplicativo macOS** - Papel duplo como plano de controle Gateway e nó
2. ✅ **Modo Local vs Remoto** - Como configurar para diferentes cenários de implantação
3. ✅ **Funcionalidades da Menu Bar** - Acesso rápido para gerenciamento de status, WebChat, Canvas, configurações, etc.
4. ✅ **Voice Wake** - Acionar assistente IA via palavra de ativação
5. ✅ **Talk Mode** - Experiência de conversa contínua por voz
6. ✅ **Modo Nó** - Expor capacidades específicas do macOS (`system.run`, Canvas, Camera)
7. ✅ **Exec Approvals** - Mecanismo de controle de segurança de três camadas para `system.run`
8. ✅ **Deep Links** - Protocolo `clawdbot://` para acionamento rápido de funcionalidades

**Melhores Práticas**:
- 🚀 Implantação Local: Usar modo Local padrão
- 🌐 Implantação Remota: Configurar SSH/Tailscale para gerenciamento centralizado
- 🔐 Segurança em Primeiro Lugar: Configurar política de whitelist razoável para `system.run`
- 🎙️ Interação por Voz: Usar ElevenLabs para melhor experiência TTS

---

## Próxima Lição

> Próxima lição: **[Nó iOS](../ios-node/)**.
>
> Você aprenderá:
> - Como configurar nó iOS para conectar ao Gateway
> - Funcionalidades do nó iOS (Canvas, Camera, Location, Voice Wake)
> - Como emparelhar dispositivos iOS via Gateway
> - Gerenciamento de permissões e controle de segurança do nó iOS
> - Descoberta Bonjour e conexão remota Tailscale

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir ver locais do código fonte</strong></summary>

> Atualizado em: 2026-01-27

| Funcionalidade        | Caminho do Arquivo                                                                                    | Linha    |
| ----------- | --------------------------------------------------------------------------------------- | ------- |
| Ponto de Entrada do Aplicativo     | [`apps/macos/Sources/Clawdbot/ClawdbotApp.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/ClawdbotApp.swift) | Arquivo completo   |
| Conexão Gateway | [`apps/macos/Sources/Clawdbot/GatewayConnection.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/GatewayConnection.swift) | 1-500   |
| Runtime Voice Wake | [`apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift) | Arquivo completo   |
| Tipos Talk Mode | [`apps/macos/Sources/Clawdbot/TalkModeTypes.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/TalkModeTypes.swift) | Arquivo completo   |
| Sobreposição Voice Wake | [`apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift) | Arquivo completo   |
| Coordenador Modo Nó | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift) | Arquivo completo   |
| Runtime Nó | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift) | Arquivo completo   |
| Gerenciador de Permissões | [`apps/macos/Sources/Clawdbot/PermissionManager.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/PermissionManager.swift) | Arquivo completo   |
| Exec Approvals | [`apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift) | Arquivo completo   |
| Menu Bar | [`apps/macos/Sources/Clawdbot/MenuBar.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/MenuBar.swift) | Arquivo completo   |
| Injetor de Menu | [`apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift) | Arquivo completo   |

**Constantes Principais**:
- `GatewayConnection.shared`: Gerenciador singleton de conexão Gateway (`GatewayConnection.swift:48`)
- `VoiceWakeRuntime`: Runtime principal do Voice Wake (singleton)
- `MacNodeModeCoordinator`: Coordenador do modo nó, gerencia inicialização de serviços locais

**Tipos Principais**:
- `GatewayAgentChannel`: Enumeração de canais de agente Gateway (`GatewayConnection.swift:9-30`)
- `GatewayAgentInvocation`: Estrutura de invocação de agente Gateway (`GatewayConnection.swift:32-41`)
- `ExecApprovalsConfig`: Estrutura de configuração Exec Approvals (JSON Schema)
- `VoiceWakeSettings`: Estrutura de configuração Voice Wake

**Funções Principais**:
- `GatewayConnection.sendAgent()`: Enviar solicitação agente ao Gateway
- `GatewayConnection.setVoiceWakeTriggers()`: Atualizar lista global de palavras de ativação
- `PermissionManager.checkPermission()`: Verificar status de permissões TCC
- `ExecApprovalsGatewayPrompter.prompt()`: Exibir diálogo de aprovação

**Localizações de Documentação**:
- [Documentação do Aplicativo macOS](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/macos.md)
- [Documentação Voice Wake](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/voicewake.md)
- [Documentação Talk Mode](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/talk.md)
- [Documentação de Nós](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/index.md)

</details>
