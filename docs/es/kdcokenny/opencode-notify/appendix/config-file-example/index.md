---
title: "Ejemplo de archivo de configuración: notifyChildSessions y sounds | Tutorial de opencode-notify"
sidebarTitle: "Archivo de configuración personalizado"
subtitle: "Ejemplo de archivo de configuración: notifyChildSessions y sounds"
description: "Consulta el ejemplo completo de configuración de opencode-notify. Aprende sobre notifyChildSessions, sounds, quietHours, terminal y todos los campos de configuración con comentarios detallados, valores predeterminados, configuración mínima, lista completa de sonidos de macOS y cómo desactivar el plugin."
tags:
  - "Configuración"
  - "Ejemplo"
  - "Apéndice"
order: 140
---

# Ejemplo de archivo de configuración

## Ejemplo de configuración completa

Guarda el siguiente contenido en `~/.config/opencode/kdco-notify.json`:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "Ghostty"
}
```

## Descripción de los campos

### notifyChildSessions

- **Tipo**: boolean
- **Valor predeterminado**: `false`
- **Descripción**: Indica si se notifican las sesiones secundarias (subtareas)

Por defecto, el plugin solo notifica las sesiones principales, evitando el ruido de notificaciones de las subtareas. Si necesitas rastrear el estado de finalización de todas las subtareas, configúralo como `true`.

```json
{
  "notifyChildSessions": false  // Solo notifica sesiones principales (recomendado)
}
```

### sounds

Configuración de sonidos, solo funciona en la plataforma macOS.

#### sounds.idle

- **Tipo**: string
- **Valor predeterminado**: `"Glass"`
- **Descripción**: Sonido cuando se completa una tarea

Se reproduce cuando la sesión de IA entra en estado inactivo (tarea completada).

#### sounds.error

- **Tipo**: string
- **Valor predeterminado**: `"Basso"`
- **Descripción**: Sonido cuando ocurre un error

Se reproduce cuando la sesión de IA encuentra un error durante la ejecución.

#### sounds.permission

- **Tipo**: string
- **Valor predeterminado**: `"Submarine"`
- **Descripción**: Sonido cuando se solicita permiso

Se reproduce cuando la IA necesita autorización del usuario para ejecutar una operación.

#### sounds.question

- **Tipo**: string (opcional)
- **Valor predeterminado**: No configurado (usa el sonido de permission)
- **Descripción**: Sonido cuando se hace una pregunta

Se reproduce cuando la IA hace una pregunta al usuario. Si no se configura, se usa el sonido de `permission`.

### quietHours

Configuración del horario silencioso, para evitar interrupciones de notificaciones durante períodos específicos.

#### quietHours.enabled

- **Tipo**: boolean
- **Valor predeterminado**: `false`
- **Descripción**: Indica si se activa el horario silencioso

#### quietHours.start

- **Tipo**: string
- **Valor predeterminado**: `"22:00"`
- **Descripción**: Hora de inicio del período silencioso (formato 24 horas, HH:MM)

#### quietHours.end

- **Tipo**: string
- **Valor predeterminado**: `"08:00"`
- **Descripción**: Hora de fin del período silencioso (formato 24 horas, HH:MM)

Soporta períodos que cruzan la medianoche. Por ejemplo, `"22:00"` a `"08:00"` significa que no se enviarán notificaciones desde las 10 de la noche hasta las 8 de la mañana del día siguiente.

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### terminal

- **Tipo**: string (opcional)
- **Valor predeterminado**: No configurado (detección automática)
- **Descripción**: Especifica manualmente el tipo de terminal, anulando la detección automática

Si la detección automática falla o necesitas especificarlo manualmente, puedes configurar el nombre de tu terminal.

```json
{
  "terminal": "Ghostty"  // O "iTerm", "Kitty", "WezTerm", etc.
}
```

## Lista de sonidos disponibles en macOS

Los siguientes son los sonidos de notificación integrados en el sistema macOS, disponibles para la configuración de `sounds`:

- Basso
- Blow
- Bottle
- Frog
- Funk
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## Ejemplo de configuración mínima

Si solo deseas modificar algunas configuraciones, puedes incluir únicamente los campos que necesitas cambiar; los demás campos usarán los valores predeterminados:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## Desactivar el plugin

Para desactivar temporalmente el plugin, simplemente elimina el archivo de configuración y el plugin volverá a la configuración predeterminada.

## Próxima lección

> En la próxima lección aprenderemos sobre el **[Registro de cambios](../changelog/release-notes/)**.
>
> Conocerás:
> - Historial de versiones y cambios importantes
> - Registro de nuevas funcionalidades y mejoras
