---
title: "Revisión de planes: Revisar visualmente planes de IA | Plannotator"
subtitle: "Fundamentos de revisión de planes: Revisar visualmente planes de IA"
description: "Aprende la función de revisión de planes de Plannotator. Usa la interfaz visual para revisar planes generados por IA, añade anotaciones para aprobar o rechazar, y domina la diferencia entre Approve y Request Changes."
sidebarTitle: "Aprende a revisar planes en 5 min"
tags:
  - "Revisión de planes"
  - "Revisión visual"
  - "Anotaciones"
  - "Aprobar"
  - "Rechazar"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 1
---

# Fundamentos de revisión de planes: Revisar visualmente planes de IA

## Lo que aprenderás

- ✅ Usar la interfaz visual de Plannotator para revisar planes generados por IA
- ✅ Seleccionar texto del plan y añadir diferentes tipos de anotaciones (eliminar, reemplazar, comentar)
- ✅ Aprobar planes para que la IA continúe con la implementación
- ✅ Rechazar planes y enviar anotaciones como retroalimentación a la IA
- ✅ Comprender los casos de uso y diferencias entre tipos de anotaciones

## Tu situación actual

**Problema 1**: Los planes de implementación generados por IA son difíciles de leer en la terminal—demasiado texto, estructura poco clara, revisar es agotador.

**Problema 2**: Cuando quieres dar retroalimentación a la IA, solo puedes describir con texto "elimina el párrafo 3", "modifica esta función"—alto costo de comunicación, y la IA puede malinterpretar.

**Problema 3**: Algunas partes del plan no necesitan cambios, otras necesitan reemplazo, otras necesitan comentarios, pero no tienes herramientas para estructurar esta retroalimentación.

**Problema 4**: No sabes cómo comunicar a la IA si aprobaste el plan o si necesita modificaciones.

**Plannotator te ayuda**:
- Interfaz visual en lugar de lectura en terminal, estructura clara
- Selecciona texto para añadir anotaciones (eliminar, reemplazar, comentar), retroalimentación precisa
- Las anotaciones se convierten automáticamente en datos estructurados, la IA entiende tu intención con precisión
- Aprueba o rechaza con un clic, la IA responde inmediatamente

## Cuándo usar esto

**Casos de uso**:
- El AI Agent completa un plan y llama a `ExitPlanMode` (Claude Code)
- El AI Agent llama a la herramienta `submit_plan` (OpenCode)
- Necesitas revisar un plan de implementación generado por IA
- Necesitas dar retroalimentación precisa sobre modificaciones al plan

**Casos no aplicables**:
- Dejar que la IA implemente código directamente (saltando la revisión del plan)
- Ya aprobaste el plan y necesitas revisar los cambios de código reales (usa la función de revisión de código)

## 🎒 Antes de empezar

**Requisitos previos**:
- ✅ Tener instalado Plannotator CLI (ver [Inicio rápido](../start/getting-started/))
- ✅ Tener configurado el plugin de Claude Code u OpenCode (ver la guía de instalación correspondiente)
- ✅ El AI Agent soporta revisión de planes (Claude Code 2.1.7+ u OpenCode)

**Cómo activarlo**:
- **Claude Code**: Después de que la IA completa el plan, llama automáticamente a `ExitPlanMode`, Plannotator se inicia automáticamente
- **OpenCode**: La IA llama a la herramienta `submit_plan`, Plannotator se inicia automáticamente

## Concepto principal

### Qué es la revisión de planes

**La revisión de planes** es la función principal de Plannotator, usada para revisar visualmente los planes de implementación generados por IA.

::: info ¿Por qué necesitas revisión de planes?
Después de que la IA genera un plan, normalmente pregunta "¿Este plan está bien?" o "¿Empiezo la implementación?". Sin herramientas visuales, solo puedes leer el plan en texto plano en la terminal, y luego responder con retroalimentación vaga como "sí", "no, modifica XX". Plannotator te permite ver el plan en una interfaz visual, seleccionar con precisión las partes que necesitan modificación, añadir anotaciones estructuradas, y la IA entiende tu intención más fácilmente.
:::

### Flujo de trabajo

```
┌─────────────────┐
│  AI Agent      │
│  (genera plan) │
└────────┬────────┘
         │
         │ ExitPlanMode / submit_plan
         ▼
┌─────────────────┐
│ Plannotator UI  │  ← El navegador se abre automáticamente
│                 │
│ ┌───────────┐  │
│ │ Contenido  │  │
│ │ del plan   │  │
│ │ (Markdown) │  │
│ └───────────┘  │
│       │         │
│       │ Seleccionar texto
│       ▼         │
│ ┌───────────┐  │
│ │ Añadir     │  │
│ │ anotación  │  │
│ │ Delete/    │  │
│ │ Replace/   │  │
│ │ Comment    │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ Decisión   │  │
│ │ Approve/  │  │
│ │ Request   │  │
│ │ Changes   │  │
│ └───────────┘  │
└────────┬────────┘
         │
         │ {"behavior": "allow"} o
         │ {"behavior": "deny", "message": "..."}
         ▼
┌─────────────────┐
│  AI Agent      │
│  (continúa     │
│  implementación)│
└─────────────────┘
```

### Tipos de anotaciones

Plannotator soporta cuatro tipos de anotaciones, cada una con un propósito diferente:

| Tipo de anotación | Propósito | Retroalimentación que recibe la IA |
| --- | --- | --- |
| **Delete** | Eliminar contenido innecesario | "Eliminar: [texto seleccionado]" |
| **Replace** | Reemplazar con mejor contenido | "Reemplazar: [texto seleccionado] por [tu texto]" |
| **Comment** | Comentar una sección, sin requerir cambios | "Comentario: [texto seleccionado]. Nota: [tu comentario]" |
| **Global Comment** | Comentario global, no asociado a texto específico | "Comentario global: [tu comentario]" |

### Approve vs Request Changes

| Tipo de decisión | Acción | Retroalimentación que recibe la IA | Caso de uso |
| --- | --- | --- | --- |
| **Approve** | Clic en botón Approve | `{"behavior": "allow"}` | El plan está bien, aprobar directamente |
| **Request Changes** | Clic en botón Request Changes | `{"behavior": "deny", "message": "..."}` | Hay partes que necesitan modificación |

::: tip Diferencias entre Claude Code y OpenCode
- **Claude Code**: Al aprobar no se envían anotaciones (las anotaciones se ignoran)
- **OpenCode**: Al aprobar se pueden enviar anotaciones como notas (opcional)

**Al rechazar el plan**: En ambas plataformas, las anotaciones se envían a la IA
:::

## Paso a paso

### Paso 1: Activar la revisión de planes

**Ejemplo con Claude Code**:

En Claude Code, conversa con la IA para que genere un plan de implementación:

```
Usuario: Ayúdame a escribir un plan de implementación para un módulo de autenticación de usuarios

Claude: De acuerdo, aquí está el plan de implementación:
1. Crear modelo de usuario
2. Implementar API de registro
3. Implementar API de inicio de sesión
...
(La IA llama a ExitPlanMode)
```

**Ejemplo con OpenCode**:

En OpenCode, la IA llama automáticamente a la herramienta `submit_plan`.

**Deberías ver**:
1. El navegador se abre automáticamente con la UI de Plannotator
2. Se muestra el contenido del plan generado por la IA (formato Markdown)
3. En la parte inferior de la página hay botones "Approve" y "Request Changes"

### Paso 2: Revisar el contenido del plan

Revisa el plan en el navegador:

- El plan se renderiza en formato Markdown, incluyendo títulos, párrafos, listas, bloques de código
- Puedes desplazarte para ver todo el plan
- Soporta cambio de modo claro/oscuro (clic en el botón de cambio de tema en la esquina superior derecha)

### Paso 3: Seleccionar texto del plan y añadir anotaciones

**Añadir anotación Delete**:

1. Selecciona con el ratón el texto que necesitas eliminar del plan
2. En la barra de herramientas emergente, haz clic en el botón **Delete**
3. El texto se marcará con estilo de eliminación (tachado rojo)

**Añadir anotación Replace**:

1. Selecciona con el ratón el texto que necesitas reemplazar del plan
2. En la barra de herramientas emergente, haz clic en el botón **Replace**
3. En el cuadro de entrada emergente, escribe el contenido de reemplazo
4. Presiona Enter o haz clic en confirmar
5. El texto original se marcará con estilo de reemplazo (fondo amarillo), y el contenido de reemplazo se mostrará debajo

**Añadir anotación Comment**:

1. Selecciona con el ratón el texto que necesitas comentar del plan
2. En la barra de herramientas emergente, haz clic en el botón **Comment**
3. En el cuadro de entrada emergente, escribe el contenido del comentario
4. Presiona Enter o haz clic en confirmar
5. El texto se marcará con estilo de comentario (resaltado azul), y el comentario se mostrará en la barra lateral

**Añadir Global Comment**:

1. Haz clic en el botón **Add Global Comment** en la esquina superior derecha de la página
2. En el cuadro de entrada emergente, escribe el contenido del comentario global
3. Presiona Enter o haz clic en confirmar
4. El comentario se mostrará en la sección "Global Comments" de la barra lateral

**Deberías ver**:
- Después de seleccionar texto, aparece inmediatamente una barra de herramientas (Delete, Replace, Comment)
- Después de añadir anotaciones, el texto muestra el estilo correspondiente (tachado, color de fondo, resaltado)
- La barra lateral muestra la lista de todas las anotaciones, puedes hacer clic para saltar a la posición correspondiente
- Puedes hacer clic en el botón **eliminar** junto a la anotación para quitarla

### Paso 4: Aprobar el plan

**Si el plan no tiene problemas**:

Haz clic en el botón **Approve** en la parte inferior de la página.

**Deberías ver**:
- El navegador se cierra automáticamente (retraso de 1.5 segundos)
- La terminal de Claude Code/OpenCode muestra que el plan fue aprobado
- La IA continúa implementando el plan

::: info Comportamiento de Approve
- **Claude Code**: Solo envía `{"behavior": "allow"}`, las anotaciones se ignoran
- **OpenCode**: Envía `{"behavior": "allow"}`, las anotaciones pueden enviarse como notas (opcional)
:::

### Paso 5: Rechazar el plan (Request Changes)

**Si el plan necesita modificaciones**:

1. Añade las anotaciones necesarias (Delete, Replace, Comment)
2. Haz clic en el botón **Request Changes** en la parte inferior de la página
3. El navegador mostrará un diálogo de confirmación

**Deberías ver**:
- El diálogo de confirmación muestra "Send X annotations to AI?"
- Después de confirmar, el navegador se cierra automáticamente
- La terminal de Claude Code/OpenCode muestra el contenido de la retroalimentación
- La IA modificará el plan según la retroalimentación

::: tip Comportamiento de Request Changes
- **Claude Code** y **OpenCode**: Ambos envían `{"behavior": "deny", "message": "..."}`
- Las anotaciones se convierten en texto Markdown estructurado
- La IA modificará el plan y llamará nuevamente a ExitPlanMode/submit_plan
:::

### Paso 6: Ver el contenido de la retroalimentación (opcional)

Si quieres ver el contenido de la retroalimentación que Plannotator envía a la IA, puedes verlo en la terminal:

**Claude Code**:
```
Plan rejected by user
Please modify the plan based on the following feedback:

[contenido estructurado de las anotaciones]
```

**OpenCode**:
```
<feedback>
[contenido estructurado de las anotaciones]
</feedback>
```

## Punto de verificación ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] Después de que la IA active la revisión de planes, el navegador abre automáticamente la UI de Plannotator
- [ ] Seleccionar texto del plan y añadir anotaciones Delete, Replace, Comment
- [ ] Añadir Global Comment
- [ ] Ver todas las anotaciones en la barra lateral y saltar a la posición correspondiente
- [ ] Hacer clic en Approve, el navegador se cierra, la IA continúa implementando
- [ ] Hacer clic en Request Changes, el navegador se cierra, la IA modifica el plan

**Si algún paso falla**, consulta:
- [Preguntas frecuentes](../../faq/common-problems/)
- [Guía de instalación de Claude Code](../../start/installation-claude-code/)
- [Guía de instalación de OpenCode](../../start/installation-opencode/)

## Errores comunes

**Error común 1**: Después de seleccionar texto, la barra de herramientas no aparece

**Causa**: Puede ser porque seleccionaste texto dentro de un bloque de código, o el texto seleccionado cruza múltiples elementos.

**Solución**:
- Intenta seleccionar texto dentro de un solo párrafo o elemento de lista
- Para bloques de código, puedes usar anotación Comment, no selecciones múltiples líneas

**Error común 2**: Después de añadir anotación Replace, el contenido de reemplazo no se muestra

**Causa**: El cuadro de entrada del contenido de reemplazo puede no haberse enviado correctamente.

**Solución**:
- Después de escribir el contenido de reemplazo, presiona Enter o haz clic en el botón de confirmar
- Verifica si el contenido de reemplazo se muestra en la barra lateral

**Error común 3**: Después de hacer clic en Approve o Request Changes, el navegador no se cierra

**Causa**: Puede ser un error del servidor o problema de red.

**Solución**:
- Verifica si hay mensajes de error en la terminal
- Cierra el navegador manualmente
- Si el problema persiste, consulta [Solución de problemas](../../faq/troubleshooting/)

**Error común 4**: La IA recibe la retroalimentación pero no modifica según las anotaciones

**Causa**: La IA puede no haber entendido correctamente la intención de las anotaciones.

**Solución**:
- Intenta usar anotaciones más explícitas (Replace es más explícito que Comment)
- Usa Comment para añadir explicaciones detalladas
- Si el problema persiste, puedes rechazar el plan nuevamente y ajustar el contenido de las anotaciones

**Error común 5**: Después de añadir múltiples anotaciones Delete, la IA solo eliminó parte del contenido

**Causa**: Puede haber superposición o conflicto entre múltiples anotaciones Delete.

**Solución**:
- Asegúrate de que el rango de texto de cada anotación Delete no se superponga
- Si necesitas eliminar una sección grande, selecciona todo el párrafo y elimínalo de una vez

## Resumen de la lección

La revisión de planes es la función principal de Plannotator, permitiéndote revisar visualmente los planes generados por IA:

**Operaciones principales**:
1. **Activar**: La IA llama a `ExitPlanMode` o `submit_plan`, el navegador abre automáticamente la UI
2. **Revisar**: Ver el contenido del plan en la interfaz visual (formato Markdown)
3. **Anotar**: Seleccionar texto, añadir Delete, Replace, Comment o Global Comment
4. **Decidir**: Hacer clic en Approve (aprobar) o Request Changes (rechazar)
5. **Retroalimentación**: Las anotaciones se convierten en datos estructurados, la IA continúa o modifica el plan según la retroalimentación

**Tipos de anotaciones**:
- **Delete**: Eliminar contenido innecesario
- **Replace**: Reemplazar con mejor contenido
- **Comment**: Comentar una sección, sin requerir cambios
- **Global Comment**: Comentario global, no asociado a texto específico

**Tipos de decisión**:
- **Approve**: El plan está bien, aprobar directamente (Claude Code ignora las anotaciones)
- **Request Changes**: Hay partes que necesitan modificación, las anotaciones se envían a la IA

## Próxima lección

> En la próxima lección aprenderemos **[Añadir anotaciones al plan](../plan-review-annotations/)**.
>
> Aprenderás:
> - Cómo usar con precisión las anotaciones Delete, Replace, Comment
> - Cómo añadir anotaciones de imagen
> - Cómo editar y eliminar anotaciones
> - Mejores prácticas y escenarios comunes de anotaciones

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| UI de revisión de planes | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| Definición de tipos de anotación | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L70) | 1-70 |
| Servidor de revisión de planes | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L310) | 91-310 |
| API: Obtener contenido del plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| API: Aprobar plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L201-L277) | 201-277 |
| API: Rechazar plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L280-L309) | 280-309 |
| Componente Viewer | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L1-L100) | 1-100 |
| Componente AnnotationPanel | [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L1-L50) | 1-50 |

**Tipos clave**:
- `AnnotationType`: Enumeración de tipos de anotación (DELETION, INSERTION, REPLACEMENT, COMMENT, GLOBAL_COMMENT) (`packages/ui/types.ts:1-7`)
- `Annotation`: Interfaz de anotación (`packages/ui/types.ts:11-33`)
- `Block`: Interfaz de bloque de plan (`packages/ui/types.ts:35-44`)

**Funciones clave**:
- `startPlannotatorServer()`: Inicia el servidor de revisión de planes (`packages/server/index.ts:91`)
- `parseMarkdownToBlocks()`: Parsea Markdown a Blocks (`packages/ui/utils/parser.ts`)

**Rutas de API**:
- `GET /api/plan`: Obtener contenido del plan (`packages/server/index.ts:132`)
- `POST /api/approve`: Aprobar plan (`packages/server/index.ts:201`)
- `POST /api/deny`: Rechazar plan (`packages/server/index.ts:280`)

**Reglas de negocio**:
- Claude Code no envía anotaciones al aprobar (`apps/hook/server/index.ts:132`)
- OpenCode puede enviar anotaciones como notas al aprobar (`apps/opencode-plugin/index.ts:270`)
- Al rechazar el plan, las anotaciones siempre se envían (`apps/hook/server/index.ts:154`)

</details>
