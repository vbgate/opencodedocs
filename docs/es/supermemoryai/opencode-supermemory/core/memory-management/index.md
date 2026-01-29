---
title: "Gestión de Memoria | opencode-supermemory"
sidebarTitle: "Gestión"
subtitle: "Alcance y Ciclo de Vida de la Memoria: Gestión de tu Cerebro Digital"
description: "Aprende a gestionar la memoria con opencode-supermemory. Comprende alcances User y Project, domina operaciones CRUD y logra reutilización de experiencia entre proyectos."
tags:
  - "gestión de memoria"
  - "alcance"
  - "crud"
prerequisite:
  - "core-tools"
order: 3
---

# Alcance y Ciclo de Vida de la Memoria: Gestión de tu Cerebro Digital

## Lo que podrás hacer al terminar

- **Distinguir alcances**: Entender qué memorias son "que te siguen" (entre proyectos) y cuáles son "que siguen al proyecto" (específicas del proyecto).
- **Gestionar memoria**: Aprender a ver manualmente, agregar y eliminar memorias, manteniendo la cognición del Agent limpia.
- **Depurar el Agent**: Cuando el Agent "recuerda" incorrectamente, saber dónde corregir.

## Idea Central

opencode-supermemory divide la memoria en dos **alcances (Scope)** aislados, similar a las variables globales y locales en lenguajes de programación.

### 1. Dos alcances

| Alcance | Identificador (Scope ID) | Ciclo de vida | Caso de uso típico |
|--- | --- | --- | ---|
| **User Scope**<br>(Alcance de usuario) | `user` | **Te sigue permanentemente**<br>Compartido entre todos los proyectos | • Preferencias de estilo de codificación (ej: "prefiere TypeScript")<br>• Hábitos personales (ej: "siempre escribe comentarios")<br>• Conocimiento general |
| **Project Scope**<br>(Alcance del proyecto) | `project` | **Solo para el proyecto actual**<br>Deja de funcionar al cambiar de directorio | • Diseño de arquitectura del proyecto<br>• Explicación de lógica de negocio<br>• Solución para Bug específico |

::: info ¿Cómo se generan los alcances?
El plugin genera automáticamente etiquetas únicas a través de `src/services/tags.ts`:
- **User Scope**: Basado en hash de tu correo de Git (`opencode_user_{hash}`).
- **Project Scope**: Basado en hash de la ruta del proyecto actual (`opencode_project_{hash}`).
:::

### 2. Ciclo de vida de la memoria

1.  **Crear (Add)**: Escrito a través de inicialización CLI o conversación con Agent (`Remember this...`).
2.  **Activar (Inject)**: Al iniciar cada nueva sesión, el plugin extrae automáticamente memorias User y Project relevantes y las inyecta en el contexto.
3.  **Buscar (Search)**: El Agent puede buscar activamente memorias específicas durante la conversación.
4.  **Olvidar (Forget)**: Cuando la memoria está obsoleta o es incorrecta, elimínala por ID.

---

## Sígueme: gestiona tu memoria

A través de la conversación con el Agent, gestionaremos manualmente memorias de ambos alcances.

### Paso 1: Ver memorias existentes

Primero, ve qué recuerda el Agent ahora.

**Operación**: En el cuadro de chat de OpenCode, ingresa:

```text
Por favor lista todas las memorias del proyecto actual (List memories in project scope)
```

**Deberías ver**:
El Agent llama al modo `list` de la herramienta `supermemory` y devuelve una lista:

```json
// Ejemplo de salida
{
  "success": true,
  "scope": "project",
  "count": 3,
  "memories": [
    {
      "id": "mem_123456",
      "content": "El proyecto usa arquitectura MVC, la capa Service es responsable de la lógica de negocio",
      "createdAt": "2023-10-01T10:00:00Z"
    }
    // ...
  ]
}
```

### Paso 2: Agregar memoria entre proyectos (User Scope)

Supongamos que deseas que el Agent responda en chino en **todos** los proyectos. Esta es una memoria adecuada para User Scope.

**Operación**: Ingresa la siguiente instrucción:

```text
Por favor recuerda mi preferencia personal: sin importar en qué proyecto, siempre respóndeme en chino.
Por favor guárdalo en User Scope.
```

**Deberías ver**:
El Agent llama la herramienta `add`, parámetro `scope: "user"`:

```json
{
  "mode": "add",
  "content": "User prefers responses in Chinese across all projects",
  "scope": "user",
  "type": "preference"
}
```

El sistema confirma que la memoria se agregó y devuelve un `id`.

### Paso 3: Agregar memoria específica del proyecto (Project Scope)

Ahora, agreguemos una regla específica para el **proyecto actual**.

**Operación**: Ingresa la siguiente instrucción:

```text
Por favor recuerda: en este proyecto, todos los formatos de fecha deben ser YYYY-MM-DD.
Guardar en Project Scope.
```

**Deberías ver**:
El Agent llama la herramienta `add`, parámetro `scope: "project"` (este es el valor predeterminado, el Agent puede omitirlo):

```json
{
  "mode": "add",
  "content": "Date format must be YYYY-MM-DD in this project",
  "scope": "project",
  "type": "project-config"
}
```

### Paso 4: Verificar aislamiento

Para verificar si el alcance está en efecto, podemos intentar buscar.

**Operación**: Ingresa:

```text
Buscar memorias sobre "formato de fecha"
```

**Deberías ver**:
El Agent llama la herramienta `search`. Si especifica `scope: "project"` o realiza búsqueda mixta, debería poder encontrar esa memoria.

::: tip Verificar capacidad entre proyectos
Si abres una nueva ventana de terminal, entras a un directorio de proyecto diferente, y preguntas nuevamente sobre "formato de fecha", el Agent debería **no encontrar** esa memoria (porque está aislada en el Project Scope del proyecto original). Pero si preguntas "qué idioma prefiero para respuestas", debería poder recuperar la preferencia "responder en chino" del User Scope.
:::

### Paso 5: Eliminar memoria obsoleta

Si las normas del proyecto cambian, necesitamos eliminar la memoria antigua.

**Operación**:
1. Primero ejecuta el **Paso 1** para obtener el ID de la memoria (ej: `mem_987654`).
2. Ingresa la instrucción:

```text
Por favor olvida la memoria con ID mem_987654 sobre el formato de fecha.
```

**Deberías ver**:
El Agent llama la herramienta `forget`:

```json
{
  "mode": "forget",
  "memoryId": "mem_987654"
}
```

El sistema devuelve `success: true`.

---

## Preguntas frecuentes (FAQ)

### Q: Si cambio de computadora, ¿las memorias de User Scope siguen ahí?
**A: Depende de tu configuración de Git.**
User Scope se genera basado en `git config user.email`. Si usas el mismo correo de Git en dos computadoras y te conectas a la misma cuenta de Supermemory (usando la misma API Key), entonces las memorias están **sincronizadas**.

### Q: ¿Por qué no puedo ver la memoria que acabo de agregar?
**A: Puede ser caché o retraso de indexación.**
La indexación vectorial de Supermemory suele ser de nivel de segundo, pero puede haber un breve retraso en fluctuaciones de red. Además, el contexto que el Agent inyecta al inicio de la sesión es **estático** (instantánea), las memorias recién agregadas pueden necesitar reiniciar la sesión (`/clear` o reiniciar OpenCode) para entrar en vigor en "inyección automática", pero se pueden encontrar inmediatamente a través de la herramienta `search`.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Lógica de generación de Scope | [`src/services/tags.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/tags.ts#L18-L36) | 18-36 |
| Definición de herramientas de memoria | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| Definición de tipos de memoria | [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) | - |
| Implementación del cliente | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 23-182 |

**Funciones clave**:
- `getUserTag()`: Genera etiqueta de usuario basada en correo de Git
- `getProjectTag()`: Genera etiqueta de proyecto basada en ruta de directorio
- `supermemoryClient.addMemory()`: Llamada API para agregar memoria
- `supermemoryClient.deleteMemory()`: Llamada API para eliminar memoria

</details>

## Próxima lección

> En la siguiente lección aprenderemos **[Principio de Compresión Preventiva](../../advanced/compaction/index.md)**.
>
> Aprenderás:
> - Por qué el Agent "pierde memoria" (desbordamiento de contexto)
> - Cómo el plugin detecta automáticamente la tasa de uso de Tokens
> - Cómo comprimir sesiones sin perder información clave
