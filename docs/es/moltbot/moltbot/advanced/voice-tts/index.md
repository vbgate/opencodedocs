---
title: "Activación por voz y TTS: Voice Wake, Talk Mode y configuración de voz | Tutorial de Clawdbot"
sidebarTitle: "Despertar a la AI con una frase"
subtitle: "Activación por voz y texto a voz"
description: "Aprenda a configurar las funciones de voz de Clawdbot: Voice Wake activación por voz, Talk Mode modo de conversación continua y proveedores TTS de texto a voz (Edge, OpenAI, ElevenLabs). Este tutorial cubre configuración de palabras de activación por voz, conversación de voz continua, configuración TTS de múltiples proveedores y solución de problemas comunes."
tags:
  - "advanced"
  - "voice"
  - "tts"
  - "configuration"
prerequisite:
  - "start-getting-started"
order: 250
---

# Activación por voz y texto a voz

## Lo que podrás hacer después de aprender

- Configurar Voice Wake activación por voz, soporta nodos macOS/iOS/Android
- Usar Talk Mode para conversación de voz continua (entrada de voz → AI → salida de voz)
- Configurar múltiples proveedores TTS (Edge, OpenAI, ElevenLabs) y conmutación automática por fallos
- Personalizar palabras de activación por voz, voces TTS y parámetros de conversación
- Solucionar problemas comunes de funciones de voz (permisos, formatos de audio, errores de API)

## Su situación actual

La interacción por voz es conveniente, pero la configuración puede ser confusa:

- ¿Qué proveedor TTS debería usar? Edge es gratuito pero la calidad es promedio, ElevenLabs tiene alta calidad pero requiere pago
- ¿Cuál es la diferencia entre Voice Wake y Talk Mode? ¿Cuándo usar cada uno?
- ¿Cómo configurar palabras de activación personalizadas en lugar de "clawd" por defecto?
- ¿Cómo sincronizar la configuración de voz en diferentes dispositivos (macOS, iOS, Android)?
- ¿Por qué el formato de salida TTS es importante? ¿Por qué Telegram usa Opus mientras otros canales usan MP3?

## Cuándo usar esta función

- **Voice Wake**: Cuando necesites experiencia de asistente de voz manos libres. Por ejemplo, despertar a la AI hablando directamente en macOS o iOS/Android sin operaciones de teclado.
- **Talk Mode**: Cuando necesites conversación de voz continua. Por ejemplo, conversación de múltiples rondas con AI por voz mientras conducimos, cocinamos o caminamos.
- **Configuración TTS**: Cuando quieras que las respuestas de la AI se reproduzcan por voz. Por ejemplo, asistente de voz para personas mayores o con discapacidad visual, o experiencia personal de asistente de voz.
- **Voz personalizada**: Cuando no estés satisfecho con la voz predeterminada. Por ejemplo, ajustar velocidad, tono, estabilidad, o cambiar a modelos de voz en chino.

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos
Este tutorial asume que has completado [Inicio rápido](../../start/getting-started/), has instalado e iniciado Gateway.
::

- El demonio Gateway está en ejecución
- Al menos un proveedor de modelo AI está configurado (Anthropic u OpenAI)
- **Para Voice Wake**: Dispositivo macOS/iOS/Android instalado y conectado a Gateway
- **Para Talk Mode**: Nodo iOS o Android conectado (la aplicación de barra de menú de macOS solo soporta Voice Wake)
- **Para ElevenLabs TTS**: API Key de ElevenLabs preparada (si necesitas voz de alta calidad)
- **Para OpenAI TTS**: API Key de OpenAI preparada (opcional, Edge TTS es gratuito pero la calidad es promedio)

::: info Aviso de permisos
Voice Wake y Talk Mode requieren los siguientes permisos:
- **Permiso de micrófono**: Esencial para entrada de voz
- **Permiso de reconocimiento de voz** (Speech Recognition): Voz a texto
- **Permiso de accesibilidad** (macOS): Monitoreo de teclas de acceso global (como Cmd+Fn push-to-talk)
::

## Conceptos clave

Clawdbot tiene tres módulos de funciones de voz que trabajan juntos: Voice Wake (activación), Talk Mode (conversación continua), TTS (texto a voz).

### Voice Wake: Sistema de palabras de activación global

Las palabras de activación son una configuración global de Gateway.

### Talk Mode: Bucle de conversación por voz

Bucle de conversación de voz continua con transiciones de estado Listening → Thinking → Speaking.

### TTS: Conmutación automática por fallos entre múltiples proveedores

Soporta tres proveedores TTS (Edge, OpenAI, ElevenLabs) con conmutación automática por fallos.

## Sígueme

### Paso 1: Configurar TTS básico

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

### Paso 2: Configurar ElevenLabs TTS

Generar API Key en [consola de ElevenLabs](https://elevenlabs.io/app).

Variables de entorno:

```bash
export ELEVENLABS_API_KEY="xi_..."
```

O archivo de configuración:

```yaml
messages:
  tts:
    provider: "elevenlabs"
    elevenlabs:
      voiceId: "pMsXgVXv3BLzUgSXRplE"
      modelId: "eleven_multilingual_v2"
```

### Paso 3: Configurar OpenAI TTS como respaldo

```yaml
messages:
  tts:
    provider: "elevenlabs"
    openai:
      model: "gpt-4o-mini-tts"
      voice: "alloy"
```

### Paso 4: Configurar palabras de activación Voice Wake

En la aplicación macOS, ve a Settings → Voice Wake para editar palabras de activación.

O usando RPC:

```bash
clawdbot gateway rpc voicewake.set '{"triggers":["助手","小助"]}'
```

### Paso 5: Usar Talk Mode (iOS/Android)

Toca el botón Talk en la aplicación iOS/Android para activar.

## Punto de control ✅

- [ ] Configuración básica de TTS completada
- [ ] Respuesta de voz AI recibida en al menos un canal
- [ ] Palabras de activación Voice Wake personalizadas
- [ ] Talk Mode iOS/Android puede iniciar y mantener conversación
- [ ] Función de interrupción TTS funciona correctamente
- [ ] Puede cambiar proveedor con comando `/tts`
- [ ] Sin errores TTS en registros de Gateway

## Resumen

- Las funciones de voz de Clawdbot consisten en tres módulos: Voice Wake, Talk Mode, TTS
- TTS soporta tres proveedores: Edge (gratis), OpenAI (estable), ElevenLabs (alta calidad)
- Voice Wake usa configuración global de palabras de activación
- Talk Mode solo soporta iOS/Android
- El formato de salida TTS está determinado por el canal
- Configuración recomendada: ElevenLabs principal, OpenAI respaldo, Edge TTS para emergencias

## Próxima lección

> En la próxima lección aprenderemos **[Sistema de memoria y búsqueda vectorial](../memory-system/)**.

---

## Apéndice: Referencias de código fuente

<details>
<summary><strong>Haz clic para mostrar ubicaciones de código fuente</strong></summary>

> Actualizado: 2026-01-27

| Función | Ruta de archivo | Número de línea |
|--- | --- | ---|
| Lógica central de TTS | [`src/tts/tts.ts`](https://github.com/moltbot/moltbot/blob/main/src/tts/tts.ts) | 1-1472 |
| ElevenLabs TTS | [`src/tts/tts.ts`](https://github.com/moltbot/moltbot/blob/main/src/tts/tts.ts) | 916-991 |
| OpenAI TTS | [`src/tts/tts.ts`](https://github.com/moltbot/moltbot/blob/main/src/tts/tts.ts) | 993-1037 |
| Edge TTS | [`src/tts/tts.ts`](https://github.com/moltbot/moltbot/blob/main/src/tts/tts.ts) | 1050-1069 |
| Gestión de configuración Voice Wake | [`src/infra/voicewake.ts`](https://github.com/moltbot/moltbot/blob/main/src/infra/voicewake.ts) | 1-91 |

</details>
