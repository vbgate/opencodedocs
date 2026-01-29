---
title: "Emparejamiento DM y control de acceso: protege tu asistente AI | Tutorial de Clawdbot"
sidebarTitle: "Gestionar acceso de extraños"
subtitle: "Emparejamiento DM y control de acceso: protege tu asistente AI"
description: "Conoce el mecanismo de protección por emparejamiento DM de Clawdbot. Aprende cómo aprobar solicitudes de emparejamiento de remitentes desconocidos mediante CLI, listar solicitudes pendientes y gestionar la lista de permitidos. Este tutorial presenta el flujo de emparejamiento, uso de comandos CLI, configuración de políticas de acceso y mejores prácticas de seguridad, incluida solución de errores y comando doctor."
tags:
  - "Introducción"
  - "Seguridad"
  - "Emparejamiento"
  - "Control de acceso"
prerequisite:
  - "start-gateway-startup"
order: 50
---

# Emparejamiento DM y control de acceso: protege tu asistente AI

## Lo que lograrás al finalizar

Al completar este tutorial, podrás:

- ✅ Comprender el mecanismo de protección por emparejamiento DM predeterminado
- ✅ Aprobar solicitudes de emparejamiento de remitentes desconocidos
- ✅ Listar y gestionar solicitudes de emparejamiento pendientes
- ✅ Configurar diferentes políticas de acceso DM (pairing/allowlist/open)
- ✅ Ejecutar doctor para verificar la configuración de seguridad

## Tu desafío actual

Es posible que hayas configurado el canal de WhatsApp o Telegram y desees conversar con el asistente AI, pero te encuentras con los siguientes problemas:

- "¿Por qué Clawdbot no responde cuando un extraño me envía un mensaje?"
- "Recibí un código de emparejamiento, no sé qué significa"
- "Quiero aprobar la solicitud de alguien, pero no sé qué comando usar"
- "¿Cómo puedo confirmar quiénes están esperando aprobación?"

La buena noticia es: **Clawdbot habilita el emparejamiento DM de forma predeterminada**, para garantizar que solo los remitentes que autorices puedan conversar con el asistente AI.

## Cuándo usar esta técnica

Cuando necesites:

- 🛡 **Proteger tu privacidad**: garantizar que solo personas de confianza puedan conversar con el asistente AI
- ✅ **Aprobar extraños**: permitir que nuevos remitentes accedan a tu asistente AI
- 🔒 **Control de acceso estricto**: restringir los permisos de usuarios específicos
- 📋 **Gestión por lotes**: ver y gestionar todas las solicitudes de emparejamiento pendientes

---

## Conceptos clave

### ¿Qué es el emparejamiento DM?

Clawdbot se conecta a plataformas de mensajería reales (WhatsApp, Telegram, Slack, etc.). En estas plataformas, **los mensajes privados (DM) se consideran entradas no confiables por defecto**.

Para proteger tu asistente AI, Clawdbot proporciona un **mecanismo de emparejamiento**:

::: info Flujo de emparejamiento
1. Un remitente desconocido te envía un mensaje
2. Clawdbot detecta que este remitente no está autorizado
3. Clawdbot devuelve un **código de emparejamiento** (8 caracteres)
4. El remitente debe proporcionarte el código de emparejamiento
5. Aprobas el código mediante CLI
6. El ID del remitente se agrega a la lista de permitidos
7. El remitente puede conversar normalmente con el asistente AI
:::

### Política DM predeterminada

**Todos los canales utilizan `dmPolicy="pairing"` de forma predeterminada**, lo que significa:

| Política | Comportamiento |
|--- | ---|
| `pairing` | Los remitentes desconocidos reciben un código de emparejamiento, el mensaje no se procesa (predeterminado) |
| `allowlist` | Solo permite remitentes de la lista `allowFrom` |
| `open` | Permite todos los remitentes (requiere configuración explícita `"*"`) |
| `disabled` | Desactiva completamente la función DM |

::: warning Advertencia de seguridad
El modo `pairing` predeterminado es la opción más segura. No cambies al modo `open` a menos que tengas necesidades especiales.
:::

---

## 🎒 Preparativos antes de comenzar

Asegúrate de haber:

- [x] Completado el tutorial de [Inicio rápido](../getting-started/)
- [x] Completado el tutorial de [Iniciar Gateway](../gateway-startup/)
- [x] Configurado al menos un canal de mensajería (WhatsApp, Telegram, Slack, etc.)
- [x] Gateway está en ejecución

---

## Sigue conmigo

### Paso 1: Entender el origen del código de emparejamiento

Cuando un remitente desconocido envía un mensaje a tu Clawdbot, recibirá una respuesta similar a la siguiente:

```
Clawdbot: access not configured.

Telegram ID: 123456789

Pairing code: AB3D7X9K

Ask the bot owner to approve with:
clawdbot pairing approve telegram <code>
```

**Características clave del código de emparejamiento** (fuente: `src/pairing/pairing-store.ts`):

- **8 caracteres**: fácil de ingresar y recordar
- **Letras mayúsculas y números**: evita confusiones
- **Excluye caracteres confusos**: no contiene 0, O, 1, I
- **Validez de 1 hora**: expira automáticamente después del tiempo
- **Mantiene hasta 3 solicitudes pendientes**: las solicitudes más antiguas se limpian automáticamente al exceder

### Paso 2: Listar solicitudes de emparejamiento pendientes

Ejecuta el siguiente comando en la terminal:

```bash
clawdbot pairing list telegram
```

**Lo que deberías ver**:

```
Pairing requests (1)

┌──────────────────┬────────────────┬────────┬──────────────────────┐
│ Code            │ ID            │ Meta   │ Requested            │
├──────────────────┼────────────────┼────────┼──────────────────────┤
│ AB3D7X9K        │ 123456789      │        │ 2026-01-27T10:30:00Z │
└──────────────────┴────────────────┴────────┴──────────────────────┘
```

Si no hay solicitudes pendientes, verás:

```
No pending telegram pairing requests.
```

::: tip Canales admitidos
La función de emparejamiento admite los siguientes canales:
- telegram
- whatsapp
- slack
- discord
- signal
- imessage
- msteams
- googlechat
- bluebubbles
:::

### Paso 3: Aprobar solicitud de emparejamiento

Aproba el acceso usando el código de emparejamiento proporcionado por el remitente:

```bash
clawdbot pairing approve telegram AB3D7X9K
```

**Lo que deberías ver**:

```
✅ Approved telegram sender 123456789
```

::: info Efecto después de aprobar
Después de aprobar, el ID del remitente (123456789) se agregará automáticamente a la lista de permitidos de ese canal, almacenada en:
`~/.clawdbot/credentials/telegram-allowFrom.json`
:::

### Paso 4: Notificar al remitente (opcional)

Si deseas notificar automáticamente al remitente, puedes usar la bandera `--notify`:

```bash
clawdbot pairing approve telegram AB3D7X9K --notify
```

El remitente recibirá el siguiente mensaje (fuente: `src/channels/plugins/pairing-message.ts`):

```
✅ Clawdbot access approved. Send a message to start chatting.
```

**Nota**: la bandera `--notify` requiere que Clawdbot Gateway esté en ejecución y que el canal esté en estado activo.

### Paso 5: Verificar que el remitente puede conversar normalmente

Pide al remitente que envíe otro mensaje, el asistente AI debería responder normalmente.

---

## Punto de control ✅

Completa las siguientes verificaciones para confirmar que la configuración es correcta:

- [ ] Ejecutar `clawdbot pairing list <channel>` permite ver solicitudes pendientes
- [ ] Usar `clawdbot pairing approve <channel> <code>` permite aprobar con éxito
- [ ] El remitente aprobado puede conversar normalmente con el asistente AI
- [ ] El código de emparejamiento expira automáticamente después de 1 hora (puede verificarse enviando otro mensaje)

---

## Advertencias comunes

### Error 1: No se encuentra el código de emparejamiento

**Mensaje de error**:
```
No pending pairing request found for code: AB3D7X9K
```

**Posibles causas**:
- El código de emparejamiento ha expirado (más de 1 hora)
- El código de emparejamiento se ingresó incorrectamente (verifica mayúsculas/minúsculas)
- El remitente no envió realmente el mensaje (el código de emparejamiento solo se genera cuando se recibe el mensaje)

**Solución**:
- Pide al remitente que envíe otro mensaje para generar un nuevo código de emparejamiento
- Asegúrate de copiar el código de emparejamiento correctamente (presta atención a mayúsculas/minúsculas)

### Error 2: El canal no admite emparejamiento

**Mensaje de error**:
```
Channel xxx does not support pairing
```

**Posibles causas**:
- El nombre del canal está mal escrito
- El canal no admite la función de emparejamiento

**Solución**:
- Ejecuta `clawdbot pairing list` para ver la lista de canales admitidos
- Usa el nombre correcto del canal

### Error 3: Error al notificar

**Mensaje de error**:
```
Failed to notify requester: <error details>
```

**Posibles causas**:
- Gateway no está en ejecución
- La conexión del canal se ha desconectado
- Problema de red

**Solución**:
- Confirma que Gateway está en ejecución
- Verifica el estado de conexión del canal: `clawdbot channels status`
- No uses la bandera `--notify`, notifica manualmente al remitente

---

## Resumen de esta lección

Este tutorial presentó el mecanismo de protección por emparejamiento DM de Clawdbot:

- **Seguridad predeterminada**: todos los canales usan el modo `pairing` de forma predeterminada para proteger tu asistente AI
- **Flujo de emparejamiento**: los remitentes desconocidos reciben un código de emparejamiento de 8 caracteres, debes aprobarlo mediante CLI
- **Comandos de gestión**:
  - `clawdbot pairing list <channel>`: listar solicitudes pendientes
  - `clawdbot pairing approve <channel> <code>`: aprobar emparejamiento
- **Ubicación de almacenamiento**: la lista de permitidos se almacena en `~/.clawdbot/credentials/<channel>-allowFrom.json`
- **Expiración automática**: las solicitudes de emparejamiento caducan automáticamente después de 1 hora

Recuerda: **el mecanismo de emparejamiento es la base de seguridad de Clawdbot**, garantizando que solo las personas que autorices puedan conversar con el asistente AI.

---

## Próxima lección

> En la siguiente lección aprenderemos **[Solución de problemas: resolver problemas comunes](../../faq/troubleshooting/)**.
>
> Aprenderás:
> - Diagnóstico rápido y verificación del estado del sistema
> - Resolver problemas de inicio de Gateway, conexión de canales, errores de autenticación, etc.
> - Métodos de solución de problemas para fallos en llamadas de herramientas y optimización del rendimiento

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| Generación de código de emparejamiento (8 caracteres, excluye caracteres confusos) | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L173-L181) | 173-181 |
| Almacenamiento y TTL de solicitudes de emparejamiento (1 hora) | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L11-L14) | 11-14 |
| Comando de aprobación de emparejamiento | [`src/cli/pairing-cli.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/pairing-cli.ts#L107-L143) | 107-143 |
| Generación de mensaje de código de emparejamiento | [`src/pairing/pairing-messages.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-messages.ts#L4-L20) | 4-20 |
| Almacenamiento de lista de permitidos | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L457-L461) | 457-461 |
| Lista de canales que admiten `pairing` | [`src/channels/plugins/pairing.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/pairing.ts#L11-L16) | 11-16 |
| Política DM predeterminada (pairing) | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L93) | 93 |

**Constantes clave**:
- `PAIRING_CODE_LENGTH = 8`: longitud del código de emparejamiento
- `PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"`: conjunto de caracteres del código de emparejamiento (excluye 0O1I)
- `PAIRING_PENDING_TTL_MS = 60 * 60 * 1000`: validez de la solicitud de emparejamiento (1 hora)
- `PAIRING_PENDING_MAX = 3`: número máximo de solicitudes pendientes

**Funciones clave**:
- `approveChannelPairingCode()`: aprobar código de emparejamiento y agregar a la lista de permitidos
- `listChannelPairingRequests()`: listar solicitudes de emparejamiento pendientes
- `upsertChannelPairingRequest()`: crear o actualizar solicitud de emparejamiento
- `addChannelAllowFromStoreEntry()`: agregar remitente a la lista de permitidos

</details>
