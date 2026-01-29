---
title: "Configuración Avanzada | opencode-supermemory"
sidebarTitle: "Configuración"
subtitle: "Explicación de Configuración Profunda: Personaliza tu Motor de Memoria"
description: "Domina la configuración avanzada de opencode-supermemory. Aprende a personalizar palabras clave, ajustar inyección de contexto y gestionar variables de entorno."
tags:
  - "configuración"
  - "avanzado"
  - "personalización"
prerequisite:
  - "start-getting-started"
order: 2
---

# Explicación de Configuración Profunda: Personaliza tu Motor de Memoria

## Lo que podrás hacer al terminar

- **Personalizar palabras clave de activación**: Hacer que el Agent entienda tus instrucciones exclusivas (ej: "anota", "mark").
- **Ajustar capacidad de memoria**: Controlar la cantidad de memorias inyectadas en el contexto, equilibrando consumo de Token y volumen de información.
- **Optimizar estrategia de compresión**: Ajustar el momento de activación de compresión preventiva según la escala del proyecto.
- **Gestión multi-entorno**: Cambiar flexiblemente API Key a través de variables de entorno.

## Ubicación del archivo de configuración

opencode-supermemory buscará los siguientes archivos de configuración en orden, **el primero que encuentre se usa**:

1. `~/.config/opencode/supermemory.jsonc` (recomendado, soporta comentarios)
2. `~/.config/opencode/supermemory.json`

::: tip ¿Por qué recomendar .jsonc?
El formato `.jsonc` permite escribir comentarios (`//`) en JSON, muy adecuado para explicar el propósito de los elementos de configuración.
:::

## Explicación detallada de configuración principal

A continuación se muestra un ejemplo completo de configuración, que incluye todas las opciones disponibles y sus valores predeterminados.

### Configuración básica

```jsonc
// ~/.config/opencode/supermemory.jsonc
{
  // Supermemory API Key
  // Prioridad: archivo de configuración > variable de entorno SUPERMEMORY_API_KEY
  "apiKey": "your-api-key-here",

  // Umbral de similitud para búsqueda semántica (0.0 - 1.0)
  // Valor más alto, resultados de recuperación más precisos pero menos cantidad; valor más bajo, resultados más dispersos
  "similarityThreshold": 0.6
}
```

### Control de inyección de contexto

Estas configuraciones determinan cuántas memorias el Agent leerá automáticamente e inyectará en el Prompt al iniciar la sesión.

```jsonc
{
  // Si inyectar perfil de usuario (User Profile)
  // Configurar en false puede ahorrar Tokens, pero el Agent puede olvidar tus preferencias básicas
  "injectProfile": true,

  // Número máximo de ítems del perfil de usuario a inyectar
  "maxProfileItems": 5,

  // Número máximo de memorias de nivel de usuario (User Scope) a inyectar
  // Estas son memorias generales compartidas entre proyectos
  "maxMemories": 5,

  // Número máximo de memorias de nivel de proyecto (Project Scope) a inyectar
  // Estas son memorias específicas del proyecto actual
  "maxProjectMemories": 10
}
```

### Palabras clave personalizadas

Puedes agregar expresiones regulares personalizadas, permitiendo que el Agent reconozca instrucciones específicas y guarde memoria automáticamente.

```jsonc
{
  // Lista de palabras clave personalizadas (soporta expresiones regulares)
  // Estas palabras se combinarán con las palabras clave predeterminadas integradas para tener efecto
  "keywordPatterns": [
    "anota",           // Coincidencia simple
    "mark\\s+this",     // Coincidencia regex: mark this
    "importante[:：]",         // Coincide "importante:" o "importante："
    "TODO\\(memory\\)"  // Coincide marca específica
  ]
}
```

::: details Ver palabras clave predeterminadas integradas
El plugin incorpora las siguientes palabras clave, no necesitan configuración para usar:
- `remember`, `memorize`
- `save this`, `note this`
- `keep in mind`, `don't forget`
- `learn this`, `store this`
- `record this`, `make a note`
- `take note`, `jot down`
- `commit to memory`
- `remember that`
- `never forget`, `always remember`
:::

### Compresión Preventiva (Preemptive Compaction)

Cuando la sesión del contexto es demasiado larga, el plugin activará automáticamente el mecanismo de compresión.

```jsonc
{
  // Umbral de activación de compresión (0.0 - 1.0)
  // Cuando la tasa de uso de Token excede esta proporción se activa la compresión
  // Predeterminado 0.80 (80%)
  "compactionThreshold": 0.80
}
```

::: warning Recomendación de configuración de umbral
- **No configures demasiado alto** (ej: > 0.95): Puede causar agotamiento de la ventana de contexto antes de completar la compresión.
- **No configures demasiado bajo** (ej: < 0.50): Causará compresión frecuente, interrumpiendo el flujo y desperdiciando Tokens.
- **Valor recomendado**: Entre 0.70 - 0.85.
:::

## Soporte de variables de entorno

Además del archivo de configuración, también puedes usar variables de entorno para gestionar información sensible o sobrescribir el comportamiento predeterminado.

| Variable de entorno | Descripción | Prioridad |
| :--- | :--- | :--- |
| `SUPERMEMORY_API_KEY` | Clave de API de Supermemory | Inferior al archivo de configuración |
| `USER` o `USERNAME` | Identificador usado para generar Hash de ámbito de usuario | Predeterminado del sistema |

### Escenario de uso: cambio multi-entorno

Si usas diferentes cuentas de Supermemory en proyectos de la empresa y personales, puedes aprovechar las variables de entorno:

::: code-group

```bash [macOS/Linux]
# En .zshrc o .bashrc configura la Key predeterminada
export SUPERMEMORY_API_KEY="key_personal"

# En directorio de proyecto de empresa, sobrescribe temporalmente la Key
export SUPERMEMORY_API_KEY="key_work" && opencode
```

```powershell [Windows]
# Configurar variable de entorno
$env:SUPERMEMORY_API_KEY="key_work"
opencode
```

:::

## Sígueme: personaliza tu configuración exclusiva

Creemos una configuración optimizada adecuada para la mayoría de desarrolladores.

### Paso 1: Crear archivo de configuración

Si el archivo no existe, créalo.

```bash
mkdir -p ~/.config/opencode
touch ~/.config/opencode/supermemory.jsonc
```

### Paso 2: Escribir configuración optimizada

Copia el siguiente contenido en `supermemory.jsonc`. Esta configuración aumenta el peso de memorias del proyecto y agrega palabras clave en español.

```jsonc
{
  // Mantener similitud predeterminada
  "similarityThreshold": 0.6,

  // Aumentar cantidad de memorias del proyecto, reducir memorias generales, más adecuado para desarrollo profundo
  "maxMemories": 3,
  "maxProjectMemories": 15,

  // Agregar palabras clave de hábitos en español
  "keywordPatterns": [
    "anota",
    "recuerda",
    "guardar memoria",
    "no olvides"
  ],

  // Activar compresión un poco antes, reservar más espacio de seguridad
  "compactionThreshold": 0.75
}
```

### Paso 3: Verificar configuración

Reinicia OpenCode, prueba usar las nuevas palabras clave definidas en la conversación:

```
Entrada del usuario:
anota: la ruta base de la API de este proyecto es /api/v2

Respuesta del sistema (esperada):
(Agent llama herramienta supermemory para guardar memoria)
Memoria guardada: la ruta base de la API de este proyecto es /api/v2
```

## Preguntas frecuentes

### Q: ¿Necesito reiniciar después de modificar la configuración?
**A: Sí.** El plugin carga la configuración al inicio, después de modificar `supermemory.jsonc` debes reiniciar OpenCode para que surta efecto.

### Q: ¿`keywordPatterns` soporta regex en español?
**A: Soporta.** El nivel inferior usa `new RegExp()` de JavaScript, totalmente soporta caracteres Unicode.

### Q: ¿Qué pasa si el archivo de configuración tiene formato incorrecto?
**A: El plugin retrocede a valores predeterminados.** Si el formato JSON es inválido (ej: comas extra), el plugin capturará el error y usará los `DEFAULTS` integrados, no causará que OpenCode falle.

## Próxima lección

> En la siguiente lección aprenderemos **[Privacidad y Seguridad de Datos](../../security/privacy/)**.
>
> Aprenderás:
> - Mecanismo de desensibilización automática de datos sensibles
> - Cómo usar etiquetas `<private>` para proteger la privacidad
> - Fronteras de seguridad de almacenamiento de datos

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| :--- | :--- | :--- |
| Definición de interfaz de configuración | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L12-L23) | 12-23 |
| Definición de valores predeterminados | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |
| Palabras clave predeterminadas | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L25-L42) | 25-42 |
| Carga de archivo de configuración | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L73-L86) | 73-86 |
| Lectura de variables de entorno | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |

</details>
