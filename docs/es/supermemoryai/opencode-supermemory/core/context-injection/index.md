---
title: "Inyección: Contexto Auto | opencode-supermemory"
sidebarTitle: "Inyección"
subtitle: "Inyección: Contexto Auto"
description: "Aprende inyección automática de contexto. El Agent obtiene perfil y proyecto al inicio de sesión, usa palabras clave para guardar memoria."
tags:
  - "contexto"
  - "inyección"
  - "prompt"
  - "memoria"
prerequisite:
  - "start-getting-started"
order: 1
---

# Inyección Automática de Contexto: Permite que el Agent "Se Anticipe"

## Lo que podrás hacer al terminar

Al terminar esta lección, podrás:
1.  **Entender** por qué el Agent ya conoce tus hábitos de codificación y la arquitectura del proyecto desde el principio.
2.  **Dominar** el "modelo tridimensional" de inyección de contexto (perfil de usuario, conocimiento del proyecto, memorias relevantes).
3.  **Aprender** a usar palabras clave (como "Remember this") para intervenir activamente en el comportamiento de memoria del Agent.
4.  **Configurar** la cantidad de ítems inyectados, equilibrando la longitud del contexto con la riqueza de información.

---

## Idea Central

Antes del plugin de memoria, cada vez que iniciabas una nueva sesión, el Agent era una página en blanco. Tenías que repetirle: "Uso TypeScript", "este proyecto usa Next.js".

**La inyección de contexto (Context Injection)** resuelve este problema. Es como insertar un "informe de misión" en el cerebro del Agent en el momento en que despierta.

### Momento de activación

opencode-supermemory es extremadamente disciplinado, solo activa la inyección automática en **el primer mensaje de la sesión**.

- **¿Por qué el primero?** Porque es el momento clave para establecer el tono de la sesión.
- **¿Qué pasa con los mensajes posteriores?** Los mensajes posteriores no se inyectan automáticamente para evitar interferir con el flujo de la conversación, a menos que actives manualmente (ver abajo "Activación por palabras clave").

### Modelo de inyección tridimensional

El plugin obtiene tres tipos de datos en paralelo, combinándolos en un bloque de prompt `[SUPERMEMORY]`:

| Dimensión de datos | Fuente | Función | Ejemplo |
|--- | --- | --- | ---|
| **1. Perfil de Usuario** (Profile) | `getProfile` | Tus preferencias a largo plazo | "El usuario prefiere programación funcional", "prefiere funciones flecha" |
| **2. Conocimiento del Proyecto** (Project) | `listMemories` | Conocimiento global del proyecto actual | "Este proyecto usa Clean Architecture", "API en src/api" |
| **3. Memorias Relevantes** (Relevant) | `searchMemories` | Experiencia previa relevante con tu primera frase | Preguntas "cómo arreglar este Bug", busca registros de soluciones anteriores similares |

---

## ¿Qué se inyecta?

Cuando envías el primer mensaje en OpenCode, el plugin silenciosamente inserta el siguiente contenido en el System Prompt en el fondo.

::: details Clic para ver la estructura real del contenido inyectado
```text
[SUPERMEMORY]

User Profile:
- User prefers concise responses
- User uses Zod for all validations

Recent Context:
- Working on auth module refactoring

Project Knowledge:
- [100%] Architecture follows MVC pattern
- [100%] Use 'npm run test' for testing

Relevant Memories:
- [85%] Previous fix for hydration error: use useEffect
```
:::

Después de que el Agent ve esta información, se comportará como un empleado veterano que ha trabajado en este proyecto durante mucho tiempo, en lugar de un nuevo pasante.

---

## Mecanismo de activación por palabras clave (Nudge)

Además de la inyección automática al inicio, también puedes "despertar" la función de memoria en cualquier momento durante la conversación.

El plugin incorpora un **detector de palabras clave**. Mientras tu mensaje contenga palabras de activación específicas, el plugin enviará una "pista invisible" (Nudge) al Agent, forzándolo a llamar la herramienta de guardado.

### Palabras clave predeterminadas

- `remember`
- `save this`
- `don't forget`
- `memorize`
- `take note`
- ... (ver código fuente para más)

### Ejemplo de interacción

**Tú ingresas**:
> Aquí el formato de respuesta de la API cambió, **remember** de ahora en adelante usa `data.result` en lugar de `data.payload`.

**El plugin detecta "remember"**:
> (inyecta pista en el fondo): `[MEMORY TRIGGER DETECTED] The user wants you to remember something...`

**El Agent reacciona**:
> Recibido. Recordaré este cambio.
> *(llama `supermemory.add` en el fondo para guardar memoria)*

---

## Configuración profunda

Puedes ajustar el comportamiento de inyección modificando `~/.config/opencode/supermemory.jsonc`.

### Elementos de configuración comunes

```jsonc
{
  // Si inyectar el perfil de usuario (predeterminado true)
  "injectProfile": true,

  // Cuántas memorias del proyecto inyectar cada vez (predeterminado 10)
  // Aumentar permite que el Agent conozca mejor el proyecto, pero consume más Tokens
  "maxProjectMemories": 10,

  // Cuántos ítems del perfil de usuario inyectar cada vez (predeterminado 5)
  "maxProfileItems": 5,

  // Palabras clave personalizadas (soporta regex)
  "keywordPatterns": [
    "anota",
    "guardar permanentemente"
  ]
}
```

::: tip Nota
Después de modificar la configuración, necesitas reiniciar OpenCode o recargar el plugin para que tenga efecto.
:::

---

## Preguntas frecuentes

### Q: ¿La información inyectada ocupa muchos Tokens?
**A**: Ocupa una parte, pero usualmente controlable. En configuración predeterminada (10 memorias del proyecto + 5 del perfil), aproximadamente ocupa 500-1000 Tokens. Para modelos grandes modernos (como Claude 3.5 Sonnet) con contexto de 200k, esto es mínimo.

### Q: ¿Por qué dije "remember" y no reaccionó?
**A**:
1. Verifica si está escrito correctamente (soporta coincidencia regex).
2. Confirma si la API Key está configurada correctamente (si el plugin no está inicializado, no se activará).
3. El Agent puede decidir ignorar (aunque el plugin lo forzó con pista, el Agent tiene la decisión final).

### Q: ¿Cómo se buscan las "memorias relevantes"?
**A**: Se basa en búsqueda semántica del **contenido de tu primer mensaje**. Si tu primera frase solo dice "Hi", puede que no encuentre memorias relevantes útiles, pero el "conocimiento del proyecto" y el "perfil de usuario" seguirán siendo inyectados.

---

## Resumen de esta lección

- **Inyección automática** solo se activa en el primer mensaje de la sesión.
- **Modelo tridimensional** incluye perfil de usuario, conocimiento del proyecto y memorias relevantes.
- **Activación por palabras clave** te permite comandar al Agent para guardar memoria en cualquier momento.
- A través del **archivo de configuración** puedes controlar la cantidad de información inyectada.

## Próxima lección

> En la siguiente lección aprenderemos **[Explicación del Conjunto de Herramientas: Enseñar al Agent a Recordar](../tools/index.md)**.
>
> Aprenderás:
> - Cómo usar manualmente herramientas como `add`, `search`.
> - Cómo ver y eliminar memorias incorrectas.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Lógica de activación de inyección | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L125-L176) | 125-176 |
| Detección de palabras clave | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Formateo de Prompt | [`src/services/context.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/context.ts#L14-L64) | 14-64 |
| Configuración predeterminada | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |

**Funciones clave**:
- `formatContextForPrompt()`: Ensambla el bloque de texto `[SUPERMEMORY]`.
- `detectMemoryKeyword()`: Coincidencia regex de palabras clave en el mensaje del usuario.

</details>

## Próxima lección

> En la siguiente lección aprenderemos **[Explicación del Conjunto de Herramientas: Enseñar al Agent a Recordar](../tools/index.md)**.
>
> Aprenderás:
> - Dominar 5 modos de herramientas principales: `add`, `search`, `profile`, `list`, `forget`
> - Cómo intervenir y corregir manualmente la memoria del Agent
> - Usar instrucciones en lenguaje natural para activar el guardado de memoria
