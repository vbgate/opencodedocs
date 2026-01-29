---
title: "工具集: 记忆控制 | opencode-supermemory"
sidebarTitle: "工具集"
subtitle: "工具集: 教 Agent 记住"
description: "掌握 supermemory 的 5 种工具模式，通过自然语言控制 Agent 的记忆行为。"
tags:
  - "uso de herramientas"
  - "gestión de memoria"
  - "funciones principales"
prerequisite:
  - "start-getting-started"
order: 2
---

# Explicación del Conjunto de Herramientas: Enseñar al Agent a Recordar

## Lo que podrás hacer al terminar

En esta lección, dominarás la forma de interacción principal del plugin `supermemory`. Aunque el Agent usualmente gestiona la memoria automáticamente, como desarrollador, a menudo necesitas intervenir manualmente.

Al terminar esta lección, podrás:
1.  Usar el modo `add` para guardar manualmente decisiones técnicas clave.
2.  Usar el modo `search` para verificar si el Agent recuerda tus preferencias.
3.  Usar `profile` para ver el "tú" en los ojos del Agent.
4.  Usar `list` y `forget` para limpiar memorias obsoletas o incorrectas.

## Idea Central

opencode-supermemory no es una caja negra, interactúa con el Agent a través del protocolo estándar de OpenCode Tool. Esto significa que puedes llamarlo como llamas una función, y también puedes comandar al Agent para que lo use en lenguaje natural.

El plugin registra una herramienta llamada `supermemory` con el Agent, es como una navaja suiza con 6 modos:

| Modo | Función | Escenario típico |
|--- | --- | ---|
| **add** | Agregar memoria | "Recuerda, este proyecto debe ejecutarse con Bun" |
| **search** | Buscar memoria | "¿Dije antes cómo manejar la autenticación?" |
| **profile** | Perfil de usuario | Ver los hábitos de codificación resumidos por el Agent sobre ti |
| **list** | Listar memorias | Auditoría de las 10 memorias guardadas recientemente |
| **forget** | Eliminar memoria | Eliminar un registro de configuración incorrecto |
| **help** | Guía de uso | Ver documentación de ayuda de la herramienta |

::: info Mecanismo de activación automática
Además de la llamada manual, el plugin también monitorea el contenido de tu chat. Cuando dices en lenguaje natural "Remember this" o "Save this", el plugin detectará automáticamente las palabras clave y forzará al Agent a llamar la herramienta `add`.
:::

## Sígueme: gestión manual de memoria

Aunque usualmente dejamos que el Agent opere automáticamente, al depurar o establecer memoria inicial, llamar herramientas manualmente es muy útil. Puedes dejar directamente en el cuadro de diálogo de OpenCode que el Agent ejecute estas operaciones en lenguaje natural.

### 1. Agregar memoria (Add)

Esta es la función más utilizada. Puedes especificar el contenido, tipo y alcance de la memoria.

**Operación**: Dile al Agent que guarde una memoria sobre la arquitectura del proyecto.

**Instrucción de entrada**:
```text
Usa la herramienta supermemory para guardar una memoria:
Contenido: "Todo el código de la capa de servicios de este proyecto debe estar en el directorio src/services"
Tipo: architecture
Alcance: project
```

**Comportamiento interno del Agent** (lógica del código fuente):
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "add",
    "content": "Todo el código de la capa de servicios de este proyecto debe estar en el directorio src/services",
    "type": "architecture",
    "scope": "project"
  }
}
```

**Deberías ver**:
El Agent devuelve un mensaje de confirmación similar a:
> ✅ Memory added to project scope (ID: mem_12345...)

::: tip Elección del tipo de memoria (Type)
Para hacer la recuperación más precisa, se recomienda usar tipos precisos:
- `project-config`: Stack tecnológico, configuración de cadena de herramientas
- `architecture`: Patrones de arquitectura, estructura de directorios
- `preference`: Tus preferencias personales de codificación (ej: "prefiere funciones flecha")
- `error-solution`: Solución específica para cierto error
- `learned-pattern`: Patrones de código observados por el Agent
:::

### 2. Buscar memoria (Search)

Cuando quieras confirmar si el Agent "sabe" algo, puedes usar la función de búsqueda.

**Operación**: Buscar memorias sobre "capa de servicios".

**Instrucción de entrada**:
```text
Consulta supermemory, la palabra clave es "services", el alcance es project
```

**Comportamiento interno del Agent**:
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "search",
    "query": "services",
    "scope": "project"
  }
}
```

**Deberías ver**:
El Agent enumera fragmentos de memoria relevantes y su similitud (Similarity).

### 3. Ver perfil de usuario (Profile)

Supermemory mantiene automáticamente un "perfil de usuario", que contiene tus preferencias a largo plazo.

**Operación**: Ver tu perfil.

**Instrucción de entrada**:
```text
Llama al modo profile de la herramienta supermemory, para ver qué sabes sobre mí
```

**Deberías ver**:
Devuelve dos tipos de información:
- **Static**: Hechos estáticos (ej: "el usuario es ingeniero full-stack")
- **Dynamic**: Preferencias dinámicas (ej: "el usuario últimamente está interesado en Rust")

### 4. Auditoría y olvido (List & Forget)

Si el Agent recuerda información incorrecta (ej: una API Key obsoleta), necesitas eliminarla.

**Paso 1: Listar memorias recientes**
```text
Lista las 5 memorias del proyecto más recientes
```
*(El Agent llama `mode: "list", limit: 5`)*

**Paso 2: Obtener ID y eliminar**
Supongamos que ves una memoria incorrecta con ID `mem_abc123`.

```text
Elimina el registro de memoria con ID mem_abc123
```
*(El Agent llama `mode: "forget", memoryId: "mem_abc123"`)*

**Deberías ver**:
> ✅ Memory mem_abc123 removed from project scope

## Avanzado: activación por lenguaje natural

No necesitas describir en detalle los parámetros de la herramienta cada vez. El plugin incorpora un mecanismo de detección de palabras clave.

**Pruébalo**:
En la conversación, di directamente:
> **Remember this**: todo el procesamiento de fechas debe usar la librería date-fns, está prohibido usar moment.js.

**¿Qué pasó?**
1.  El hook `chat.message` del plugin detecta la palabra clave "Remember this".
2.  El plugin inyecta un aviso de sistema al Agent: `[MEMORY TRIGGER DETECTED]`.
3.  El Agent recibe la instrucción: "You MUST use the supermemory tool with mode: 'add'...".
4.  El Agent extrae automáticamente el contenido y llama la herramienta.

Este es un método de interacción muy natural, permitiéndote "solidificar" conocimiento en cualquier momento durante el proceso de codificación.

## Preguntas frecuentes (FAQ)

**Q: ¿Cuál es el valor predeterminado de `scope`?**
A: El valor predeterminado es `project`. Si quieres guardar preferencias comunes a todos los proyectos (ej: "siempre uso TypeScript"), especifica explícitamente `scope: "user"`.

**Q: ¿Por qué la memoria que agregué no entró en vigor inmediatamente?**
A: La operación `add` es asíncrona. Usualmente el Agent "sabrá" inmediatamente de la nueva memoria después de una llamada de herramienta exitosa, pero en algunos casos de latencia extrema de red puede tomar algunos segundos.

**Q: ¿La información sensible se subirá?**
A: El plugin desensibilizará automáticamente el contenido dentro de las etiquetas `<private>`. Pero por seguridad, se recomienda no poner contraseñas o API Keys en la memoria.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Definición de herramientas | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| Detección de palabras clave | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Prompt de activación | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L20-L28) | 20-28 |
| Implementación del cliente | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | Texto completo |

**Definiciones de tipos clave**:
- `MemoryType`: Definido en [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)
- `MemoryScope`: Definido en [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)

</details>

## Próxima lección

> En la siguiente lección aprenderemos **[Alcance y Ciclo de Vida de la Memoria](../memory-management/index.md)**.
>
> Aprenderás:
> - Mecanismo de aislamiento subyacente entre User Scope y Project Scope
> - Cómo diseñar una estrategia eficiente de partición de memoria
> - Gestión del ciclo de vida de la memoria
