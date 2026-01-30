---
title: "Cargar Skills: Inyección de Contenido XML | opencode-agent-skills"
sidebarTitle: "Hacer que la IA use tus skills"
subtitle: "Cargar skills al contexto de la sesión"
description: "Domina la herramienta use_skill para cargar skills en el contexto de la sesión. Comprende la inyección XML y el mecanismo de Synthetic Message Injection, aprende la gestión de metadatos de skills."
tags:
  - "Carga de skills"
  - "Inyección XML"
  - "Gestión de contexto"
prerequisite:
  - "start-creating-your-first-skill"
  - "platforms-listing-available-skills"
order: 3
---

# Cargar skills al contexto de la sesión

## Qué podrás hacer después de aprender esto

- Usar la herramienta `use_skill` para cargar skills en la sesión actual
- Comprender cómo el contenido del skill se inyecta en el contexto en formato XML
- Dominar el mecanismo de Synthetic Message Injection (inyección de mensajes sintéticos)
- Entender la estructura de metadatos de skills (fuente, directorio, scripts, archivos)
- Saber cómo los skills permanecen disponibles después de la compresión de la sesión

## Tu situación actual

Has creado un skill, pero la IA parece no poder acceder a su contenido. O en una conversación larga, la guía del skill desaparece repentinamente y la IA olvida las reglas anteriores. Todo esto está relacionado con el mecanismo de carga de skills.

## Cuándo usar esta técnica

- **Carga manual de skills**: Cuando la recomendación automática de la IA no es adecuada, especifica directamente el skill necesario
- **Persistencia en sesiones largas**: Asegura que el contenido del skill siga siendo accesible después de la compresión del contexto
- **Compatibilidad con Claude Code**: Carga skills en formato Claude para obtener mapeo de herramientas
- **Control preciso**: Necesitas cargar una versión específica del skill (a través del namespace)

## Concepto central

La herramienta `use_skill` inyecta el contenido del SKILL.md del skill en el contexto de la sesión, permitiendo que la IA pueda seguir las reglas y flujos de trabajo definidos en el skill.

### Inyección de contenido XML

El contenido del skill se inyecta en un formato XML estructurado, que contiene tres partes:

```xml
<skill name="skill-name">
  <metadata>
    <source>Etiqueta de fuente del skill</source>
    <directory>Ruta del directorio del skill</directory>
    <scripts>
      <script>tools/script1.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
    </files>
  </metadata>

  <tool-mapping>
    <!-- Mapeo de herramientas de Claude Code -->
  </tool-mapping>

  <content>
    Contenido completo del SKILL.md
  </content>
</skill>
```

### Synthetic Message Injection

El plugin utiliza el método `session.prompt()` del SDK de OpenCode para inyectar el contenido del skill, configurando dos flags clave:

::: info Synthetic Message Injection
- `noReply: true` - La IA no responderá a esta inyección en sí misma
- `synthetic: true` - Marca el mensaje como generado por el sistema (oculto para el usuario, no cuenta como entrada del usuario)
:::

Esto significa:
- **Invisible para el usuario**: La inyección del skill no se muestra en el historial de conversación
- **No consume entrada**: No cuenta en el contador de mensajes del usuario
- **Disponible persistentemente**: Incluso si la sesión se comprime, el contenido del skill sigue en el contexto

### Ciclo de vida de la sesión

1. **En el primer mensaje**: El plugin inyecta automáticamente la lista `<available-skills>`, mostrando todos los skills disponibles
2. **Al usar `use_skill`**: Inyecta el contenido XML del skill seleccionado en el contexto
3. **Después de la compresión de la sesión**: El plugin escucha el evento `session.compacted` y reinyecta la lista de skills

## Sígueme paso a paso

### Paso 1: Cargar un skill básico

En OpenCode, haz que la IA cargue un skill:

```
Entrada del usuario:
Cargar el skill brainstorming

Respuesta del sistema:
Skill "brainstorming" loaded.
```

**Deberías ver**: La IA devuelve un mensaje de carga exitosa, el contenido del skill ha sido inyectado en el contexto.

Ahora puedes probar si la IA sigue las reglas del skill:

```
Entrada del usuario:
Ayúdame a escribir una descripción de producto

Respuesta del sistema:
(La IA generará contenido siguiendo las reglas del skill brainstorming, siguiendo las técnicas y flujos definidos en él)
```

### Paso 2: Ver los recursos disponibles después de cargar

Al cargar un skill, el sistema devuelve una lista de scripts y archivos disponibles:

```
Entrada del usuario:
Cargar git-helper

Respuesta del sistema:
Skill "git-helper" loaded.
Available scripts: tools/branch.sh, tools/commit.sh
Available files: docs/usage.md, examples/workflow.md
```

Esta información te indica qué recursos hay disponibles en el directorio del skill:
- **Scripts**: Se pueden ejecutar con la herramienta `run_skill_script`
- **Archivos**: Se pueden leer con la herramienta `read_skill_file`

**Deberías ver**: Un mensaje de carga exitosa, seguido de una lista opcional de scripts y archivos.

### Paso 3: Usar namespace para cargar skills con el mismo nombre

Supongamos que tienes el skill `build-helper` tanto a nivel de proyecto como de usuario:

```
Entrada del usuario:
Cargar build-helper

Respuesta del sistema:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh

Entrada del usuario:
(Verificar qué versión de build-helper se cargó)
```

Según la prioridad de descubrimiento de skills, por defecto se carga el skill a nivel de proyecto. Si necesitas el de nivel de usuario:

```
Entrada del usuario:
Cargar user:build-helper

Respuesta del sistema:
Skill "build-helper" loaded.
Available scripts: ci.sh, test.sh
Available files: README.md
```

**Deberías ver**: Cargar diferentes versiones de skills con el mismo nombre usando el formato `namespace:skill-name`.

### Paso 4: Experimentar el efecto de la guía del skill

Después de cargar un skill, el comportamiento de la IA debería seguir las reglas definidas en el skill. Tomando el skill brainstorming como ejemplo:

```
Entrada del usuario:
Cargar brainstorming
Ayúdame a idear el punto de venta principal de un producto de hogar inteligente

Respuesta del sistema:
(La IA usará las técnicas definidas en el skill brainstorming, como:
- Listar primero las direcciones posibles, luego explorar en profundidad
- Evitar juzgar las ideas prematuramente
- Usar "sí, y..." para expandir ideas
- Registrar todas las ideas antes de filtrar)

Primero listemos las direcciones posibles:
1. Control de conveniencia
2. Gestión de energía
3. Seguridad y protección
...
```

**Deberías ver**: El estilo y flujo de respuesta de la IA es consistente con lo definido en el skill.

### Paso 5: Comprender la persistencia del skill en sesiones largas

Realiza una conversación prolongada y observa si el skill permanece efectivo:

```
Entrada del usuario:
Cargar docker-helper
(Realizar múltiples rondas de conversación, involucrando construcción, despliegue, etc.)
...
(Supongamos que la conversación es muy larga y activa la compresión de contexto de OpenCode)
Entrada del usuario:
Continuar con el despliegue Docker anterior

Respuesta del sistema:
(La IA todavía puede acceder al contenido de docker-helper,
porque el plugin reinyecta la lista de skills después de la compresión)
```

::: tip Mecanismo de recuperación tras compresión
El plugin escucha el evento `session.compacted`, cuando la sesión se comprime reinyecta la lista de skills, asegurando que los skills cargados sigan siendo accesibles después de la compresión.
:::

**Deberías ver**: Incluso si la conversación es muy larga y el contexto se comprime, la IA todavía puede acceder al contenido del skill.

### Paso 6: Cargar skills en formato Claude Code

Si tienes skills de Claude Code, serán descubiertos automáticamente:

```
Entrada del usuario:
Listar todos los skills disponibles

Respuesta del sistema:
...
claude-code-superpowers (claude-plugins)
  Flujo de trabajo completo de desarrollo de software

Entrada del usuario:
Cargar claude-code-superpowers

Respuesta del sistema:
Skill "claude-code-superpowers" loaded.
```

Al cargar skills en formato Claude, se inyecta automáticamente el mapeo de herramientas (toolTranslation), que mapea los nombres de herramientas de Claude a las herramientas de OpenCode:

::: info Ejemplo de mapeo de herramientas
- `TodoWrite` de Claude → `todowrite` de OpenCode
- `Task` de Claude → `task` de OpenCode (subagente)
- `Bash` de Claude → `bash` de OpenCode
:::

**Deberías ver**: Carga exitosa del skill, la IA puede entender y usar flujos de trabajo en formato Claude.

## Punto de verificación ✅

- [ ] ¿Puedes usar `use_skill` para cargar skills?
- [ ] ¿Comprendes el mecanismo de inyección de contenido del skill en formato XML?
- [ ] ¿Puedes nombrar los dos flags clave de los mensajes sintéticos?
- [ ] ¿Puedes explicar por qué los skills siguen disponibles después de la compresión de la sesión?
- [ ] ¿Puedes usar namespace para cargar diferentes versiones de skills con el mismo nombre?

## Advertencias de trampas comunes

### Trampa 1: Error de ortografía en el nombre del skill

Si introduces un nombre de skill incorrecto:

```
Entrada del usuario:
Cargar brainstormig

Respuesta del sistema:
Skill "brainstormig" not found. Did you mean "brainstorming"?
```

El plugin proporcionará sugerencias de coincidencia aproximada basadas en la distancia de edición.

**Solución**: Revisa la ortografía o usa `get_available_skills` para ver el nombre correcto.

### Trampa 2: Confusión con skills del mismo nombre

Si hay skills con el mismo nombre a nivel de proyecto y de usuario, podrías cargar la versión incorrecta:

```
Entrada del usuario:
Cargar build-helper

Respuesta del sistema:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh  # Este es el de nivel de proyecto

El usuario esperaba cargar el de nivel de usuario, pero por defecto se carga el de nivel de proyecto
```

**Solución**: Usa el namespace para especificar claramente, como `user:build-helper`.

### Trampa 3: El contenido del skill no surte efecto

A veces cargas un skill, pero la IA parece no seguir las reglas:

```
Entrada del usuario:
Cargar my-conventions
(Se espera que la IA siga las convenciones de código)
Entrada del usuario:
Escribe una función

Respuesta del sistema:
(El código escrito por la IA no cumple con las convenciones esperadas)
```

**Posibles causas**:
- El contenido del SKILL.md del skill no es lo suficientemente claro
- La descripción del skill no es lo suficientemente detallada, la IA tiene una comprensión sesgada
- En conversaciones largas el contexto se comprime, la lista de skills necesita ser reinyectada

**Solución**:
- Revisa si el frontmatter y el contenido del skill son claros
- Dile explícitamente a la IA que use reglas específicas: "Por favor usa las reglas del skill my-conventions"
- Vuelve a cargar el skill después de la compresión

### Trampa 4: Problemas de mapeo de herramientas en skills de Claude

Después de cargar un skill de Claude Code, la IA puede seguir usando nombres de herramientas incorrectos:

```
Entrada del usuario:
Cargar claude-code-superpowers
Usar la herramienta TodoWrite

Respuesta del sistema:
(La IA puede intentar usar el nombre de herramienta incorrecto, porque no se mapeó correctamente)
```

**Causa**: Al cargar el skill se inyecta automáticamente el mapeo de herramientas, pero la IA puede necesitar un recordatorio explícito.

**Solución**: Después de cargar el skill, dile explícitamente a la IA que use las herramientas mapeadas:

```
Entrada del usuario:
Cargar claude-code-superpowers
Ten en cuenta usar la herramienta todowrite (en lugar de TodoWrite)
```

## Resumen de esta lección

La herramienta `use_skill` inyecta el contenido del skill en el contexto de la sesión en formato XML, implementado a través del mecanismo de Synthetic Message Injection:

- **Inyección estructurada XML**: Incluye metadatos, mapeo de herramientas y contenido del skill
- **Mensaje sintético**: `noReply: true` y `synthetic: true` aseguran que el mensaje esté oculto para el usuario
- **Disponible persistentemente**: Incluso si el contexto se comprime, el contenido del skill sigue siendo accesible
- **Soporte de namespace**: El formato `namespace:skill-name` permite especificar claramente la fuente del skill
- **Compatibilidad con Claude**: Inyección automática de mapeo de herramientas, compatible con skills de Claude Code

La carga de skills es el mecanismo clave para que la IA siga flujos de trabajo y reglas específicas, a través de la inyección de contenido, la IA puede mantener un estilo de comportamiento consistente durante toda la conversación.

## Avance de la próxima lección

> En la próxima lección aprenderemos **[Recomendación automática de skills: Principios de coincidencia semántica](../automatic-skill-matching/)**.
>
> Aprenderás:
> - Cómo el plugin recomienda automáticamente skills relevantes basándose en similitud semántica
> - Los principios básicos del modelo de embeddings y el cálculo de similitud coseno
> - Técnicas de optimización de descripciones de skills para obtener mejores recomendaciones
> - Cómo el mecanismo de caché de embeddings mejora el rendimiento

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Definición de herramienta UseSkill | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| Función injectSyntheticContent | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| Función injectSkillsList | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L345-L370) | 345-370 |
| Función resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Función listSkillFiles | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |

**Constantes clave**:
- Ninguna

**Funciones clave**:
- `UseSkill()`: Acepta el parámetro `skill`, construye el contenido del skill en formato XML y lo inyecta en la sesión
- `injectSyntheticContent(client, sessionID, text, context)`: Inyecta mensajes sintéticos a través de `client.session.prompt()`, configurando `noReply: true` y `synthetic: true`
- `injectSkillsList()`: Inyecta la lista `<available-skills>` en el primer mensaje
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: Soporta resolución de skills en formato `namespace:skill-name`
- `listSkillFiles(skillPath: string, maxDepth: number)`: Lista recursivamente todos los archivos en el directorio del skill (excluyendo SKILL.md)

**Reglas de negocio**:
- El contenido del skill se inyecta en formato XML, incluyendo metadatos, mapeo de herramientas y contenido (`tools.ts:238-249`)
- El mensaje inyectado se marca como sintético, no cuenta como entrada del usuario (`utils.ts:159`)
- Los skills ya cargados no se recomiendan nuevamente en la sesión actual (`plugin.ts:128-132`)
- La lista de skills se inyecta automáticamente en el primer mensaje (`plugin.ts:70-105`)
- Después de la compresión de la sesión se reinyecta la lista de skills (`plugin.ts:145-151`)

**Formato de contenido XML**:
```xml
<skill name="${skill.name}">
  <metadata>
    <source>${skill.label}</source>
    <directory>${skill.path}</directory>
    <scripts>
      <script>${script.relativePath}</script>
    </scripts>
    <files>
      <file>${file}</file>
    </files>
  </metadata>

  ${toolTranslation}

  <content>
  ${skill.template}
  </content>
</skill>
```

</details>
