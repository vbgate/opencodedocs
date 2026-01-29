---
title: "Ativação por voz e TTS: Voice Wake, Talk Mode e configuração de voz | Tutorial do Clawdbot"
sidebarTitle: "Acordar a IA com uma frase"
subtitle: "Ativação por voz e texto para voz"
description: "Aprenda a configurar as funções de voz do Clawdbot: Voice Wake ativação por voz, Talk Mode modo de conversa contínua e provedores TTS de texto para voz (Edge, OpenAI, ElevenLabs). Este tutorial cobre configuração de palavras de ativação por voz, conversa por voz contínua, configuração TTS de múltiplos provedores e solução de problemas comuns."
tags:
  - "advanced"
  - "voice"
  - "tts"
  - "configuration"
prerequisite:
  - "start-getting-started"
order: 250
---

# Ativação por voz e texto para voz

## O que você poderá fazer após aprender

- Configurar Voice Wake ativação por voz, suporta nós macOS/iOS/Android
- Usar Talk Mode para conversa por voz contínua (entrada de voz → IA → saída de voz)
- Configurar múltiplos provedores TTS (Edge, OpenAI, ElevenLabs) e failover automático
- Personalizar palavras de ativação por voz, vozes TTS e parâmetros de conversa
- Solucionar problemas comuns de funções de voz (permissões, formatos de áudio, erros de API)

## Sua situação atual

A interação por voz é conveniente, mas a configuração pode ser confusa:

- Qual provedor TTS você deve usar? Edge é gratuito mas a qualidade é média, ElevenLabs tem alta qualidade mas é pago
- Qual é a diferença entre Voice Wake e Talk Mode? Quando usar cada um?
- Como configurar palavras de ativação personalizadas em vez de "clawd" padrão?
- Como sincronizar a configuração de voz em diferentes dispositivos (macOS, iOS, Android)?
- Por que o formato de saída TTS é importante? Por que o Telegram usa Opus enquanto outros canais usam MP3?

## Quando usar esta função

- **Voice Wake**: Quando você precisa de experiência de assistente por voz mãos livres. Por exemplo, acordar a IA falando diretamente no macOS ou iOS/Android sem operações de teclado.
- **Talk Mode**: Quando você precisa de conversa por voz contínua. Por exemplo, conversa de múltiplas rodadas com IA por voz enquanto dirige, cozinha ou caminha.
- **Configuração TTS**: Quando você quer que as respostas da IA sejam reproduzidas por voz. Por exemplo, assistente por voz para pessoas idosas ou com deficiência visual, ou experiência pessoal de assistente por voz.
- **Voz personalizada**: Quando você não está satisfeito com a voz padrão. Por exemplo, ajustar velocidade, tom, estabilidade, ou mudar para modelos de voz em chinês.

## 🎒 Preparativos antes de começar

::: warning Pré-requisitos
Este tutorial assume que você completou [Início rápido](../../start/getting-started/), instalou e iniciou o Gateway.
::

- O daemon Gateway está em execução
- Pelo menos um provedor de modelo IA está configurado (Anthropic ou OpenAI)
- **Para Voice Wake**: Dispositivo macOS/iOS/Android instalado e conectado ao Gateway
- **Para Talk Mode**: Nó iOS ou Android conectado (aplicativo de barra de menu do macOS só suporta Voice Wake)
- **Para ElevenLabs TTS**: API Key do ElevenLabs preparada (se você precisa de voz de alta qualidade)
- **Para OpenAI TTS**: API Key do OpenAI preparada (opcional, Edge TTS é gratuito mas a qualidade é média)

::: info Aviso de permissões
Voice Wake e Talk Mode requerem as seguintes permissões:
- **Permissão de microfone**: Essencial para entrada de voz
- **Permissão de reconhecimento de voz** (Speech Recognition): Voz para texto
- **Permissão de acessibilidade** (macOS): Monitoramento de atalhos globais (como Cmd+Fn push-to-talk)
::

## Conceitos chave

Clawdbot possui três módulos de funções de voz que trabalham juntos: Voice Wake (ativação), Talk Mode (conversa contínua), TTS (texto para voz).

### Voice Wake: Sistema global de palavras de ativação

As palavras de ativação são uma configuração global do Gateway.

### Talk Mode: Loop de conversa por voz

Loop de conversa por voz contínua com transições de estado Listening → Thinking → Speaking.

### TTS: Failover automático entre múltiplos provedores

Suporta três provedores TTS (Edge, OpenAI, ElevenLabs) com failover automático.

## Siga-me

### Passo 1: Configurar TTS básico

Editar `~/.clawdbot/clawdbot.json`:

```yaml
messages:
  tts:
    auto: "always"
    provider: "edge"
    edge:
      enabled: true
      voice: "zh-CN-XiaoxiaoNeural"
      lang: "zh-CN"
      outputFormat: "audio-24khz-48kbitrate-mono-mp3"
```

```bash
clawdbot gateway restart
```

### Passo 2: Configurar ElevenLabs TTS

Gerar API Key no [console ElevenLabs](https://elevenlabs.io/app).

Variáveis de ambiente:

```bash
export ELEVENLABS_API_KEY="xi_..."
```

Ou arquivo de configuração:

```yaml
messages:
  tts:
    provider: "elevenlabs"
    elevenlabs:
      voiceId: "pMsXgVXv3BLzUgSXRplE"
      modelId: "eleven_multilingual_v2"
```

### Passo 3: Configurar OpenAI TTS como backup

```yaml
messages:
  tts:
    provider: "elevenlabs"
    openai:
      model: "gpt-4o-mini-tts"
      voice: "alloy"
```

### Passo 4: Configurar palavras de ativação Voice Wake

No aplicativo macOS, vá em Settings → Voice Wake para editar palavras de ativação.

Ou usando RPC:

```bash
clawdbot gateway rpc voicewake.set '{"triggers":["助手","小助"]}'
```

### Passo 5: Usar Talk Mode (iOS/Android)

Toque no botão Talk no aplicativo iOS/Android para ativar.

## Ponto de verificação ✅

- [ ] Configuração básica TTS concluída
- [ ] Resposta de voz IA recebida em pelo menos um canal
- [ ] Palavras de ativação Voice Wake personalizadas
- [ ] Talk Mode iOS/Android pode iniciar e manter conversa
- [ ] Função de interrupção TTS funciona corretamente
- [ ] Pode mudar provedor com comando `/tts`
- [ ] Sem erros TTS nos logs do Gateway

## Resumo

- As funções de voz do Clawdbot consistem em três módulos: Voice Wake, Talk Mode, TTS
- TTS suporta três provedores: Edge (grátis), OpenAI (estável), ElevenLabs (alta qualidade)
- Voice Wake usa configuração global de palavras de ativação
- Talk Mode só suporta iOS/Android
- O formato de saída TTS é determinado pelo canal
- Configuração recomendada: ElevenLabs principal, OpenAI backup, Edge TTS para emergências

## Próxima lição

> Na próxima lição aprenderemos **[Sistema de memória e busca vetorial](../memory-system/)**.

---

## Apêndice: Referências de código fonte

<details>
<summary><strong>Clique para mostrar localizações do código fonte</strong></summary>

> Atualizado: 2026-01-27

| Função | Caminho do arquivo | Número de linha |
|--- | --- | ---|
| Lógica principal TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 1-1472 |
| ElevenLabs TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 916-991 |
| OpenAI TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 993-1037 |
| Edge TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 1050-1069 |
| Gerenciamento de configuração Voice Wake | [`src/infra/voicewake.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/voicewake.ts) | 1-91 |

</details>
