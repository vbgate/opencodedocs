---
title: "Leer Archivos de Habilidades: Acceso a Recursos | opencode-agent-skills"
subtitle: "Leer Archivos de Habilidades: Acceso a Recursos | opencode-agent-skills"
sidebarTitle: "Acceder a Recursos Adicionales de Habilidades"
description: "Aprende a leer archivos de habilidades. Domina la verificación de seguridad de rutas y el mecanismo de inyección XML para acceder de forma segura a documentos y configuraciones en el directorio de habilidades."
tags:
  - "Archivos de Habilidades"
  - "Uso de Herramientas"
  - "Seguridad de Rutas"
prerequisite:
  - "/es/joshuadavidthomas/opencode-agent-skills/start/installation/"
  - "/es/joshuadavidthomas/opencode-agent-skills/platforms/listing-available-skills/"
order: 6
---

# Leer Archivos de Habilidades

## Lo Que Podrás Hacer

- Usar la herramienta `read_skill_file` para leer documentos, configuraciones y archivos de ejemplo en el directorio de habilidades
- Entender el mecanismo de seguridad de rutas para prevenir ataques de directory traversal
- Dominar el método de inyección de contenido de archivos en formato XML
- Manejar mensajes de error y listas de archivos disponibles cuando un archivo no existe

## Tu Problema Actual

El archivo SKILL.md de una habilidad solo contiene instrucciones centrales, pero muchas habilidades proporcionan archivos de soporte adicionales como documentación detallada, ejemplos de configuración, guías de uso, entre otros. Quieres acceder a estos archivos para obtener explicaciones más detalladas, pero no sabes cómo leer de forma segura los archivos en el directorio de habilidades.

## Cuándo Usar Este Método

- **Ver documentación detallada**: El directorio `docs/` de la habilidad contiene guías de uso detalladas
- **Ejemplos de configuración**: Necesitas consultar archivos de configuración de ejemplo en el directorio `config/`
- **Ejemplos de código**: El directorio `examples/` de la habilidad contiene ejemplos de código
- **Ayuda para depuración**: Ver el README u otros archivos explicativos de la habilidad
- **Entender la estructura de recursos**: Explorar qué archivos están disponibles en el directorio de la habilidad

## Idea Central

La herramienta `read_skill_file` te permite acceder de forma segura a los archivos de soporte en el directorio de habilidades. Garantiza seguridad y disponibilidad a través de los siguientes mecanismos:

::: info Mecanismo de Seguridad
El complemento verifica estrictamente la ruta del archivo para prevenir ataques de directory traversal:
- Prohíbe el uso de `..` para acceder a archivos fuera del directorio de habilidades
- Prohíbe el uso de rutas absolutas
- Solo permite acceder a archivos en el directorio de habilidades y sus subdirectorios
:::

Flujo de ejecución de la herramienta:
1. Verifica que el nombre de la habilidad existe (soporta espacios de nombres)
2. Comprueba si la ruta del archivo solicitado es segura
3. Lee el contenido del archivo
4. Lo empaqueta en formato XML y lo inyecta en el contexto de la sesión
5. Devuelve un mensaje de confirmación de carga exitosa

::: tip Persistencia del Contenido del Archivo
El contenido del archivo se inyecta con los indicadores `synthetic: true` y `noReply: true`, lo que significa:
- El contenido del archivo se convierte en parte del contexto de la sesión
- El contenido sigue siendo accesible incluso si la sesión se comprime
- La inyección no activa una respuesta directa de la IA
:::

## Sígueme Paso a Paso

### Paso 1: Leer Documentación de la Habilidad

Supongamos que el directorio de la habilidad tiene documentación de uso detallada:

```
Entrada del usuario:
Lee la documentación de git-helper

Llamada del sistema:
read_skill_file(skill="git-helper", filename="docs/usage-guide.md")

Respuesta del sistema:
File "docs/usage-guide.md" from skill "git-helper" loaded.
```

El contenido del archivo se inyecta en el contexto de la sesión en formato XML:

```xml
<skill-file skill="git-helper" file="docs/usage-guide.md">
  <metadata>
    <directory>/path/to/project/.opencode/skills/git-helper</directory>
  </metadata>

  <content>
# Git Helper Guía de Uso

Esta habilidad proporciona orientación sobre gestión de ramas Git, normas de commits y flujos de colaboración...

[El contenido del documento continúa]
  </content>
</skill-file>
```

**Lo que deberías ver**: Un mensaje de carga exitosa, con el contenido del archivo inyectado en el contexto de la sesión.

### Paso 2: Leer Ejemplos de Configuración

Ver la configuración de ejemplo de la habilidad:

```
Entrada del usuario:
Muestra los ejemplos de configuración de docker-helper

Llamada del sistema:
read_skill_file(skill="docker-helper", filename="config/docker-compose.yml.example")

Respuesta del sistema:
File "config/docker-compose.yml.example" from skill "docker-helper" loaded.
```

**Lo que deberías ver**: El contenido del archivo de configuración se inyecta, y la IA puede referirse al ejemplo para generarte una configuración real.

### Paso 3: Leer Archivos Usando Espacio de Nombres

Si existen habilidades con el mismo nombre a nivel de proyecto y de usuario:

```
Entrada del usuario:
Lee los scripts de compilación de project:build-helper

Llamada del sistema:
read_skill_file(skill="project:build-helper", filename="scripts/build.sh")

Respuesta del sistema:
File "scripts/build.sh" from skill "build-helper" loaded.
```

**Lo que deberías ver**: Se especifica claramente el origen de la habilidad mediante el espacio de nombres.

### Paso 4: Manejar Archivos que No Existen

Si intentas leer un archivo que no existe:

```
Entrada del usuario:
Lee api-docs.md de git-helper

Llamada del sistema:
read_skill_file(skill="git-helper", filename="api-docs.md")

Respuesta del sistema:
File "api-docs.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md, SKILL.md
```

La herramienta listará todos los archivos disponibles en el directorio de habilidades para ayudarte a encontrar el nombre de archivo correcto.

**Lo que deberías ver**: Un mensaje de error y la lista de archivos disponibles.

### Paso 5: Experimentar la Protección de Seguridad de Rutas

Intenta acceder a archivos fuera del directorio de habilidades:

```
Entrada del usuario:
Lee los archivos del directorio padre de git-helper

Llamada del sistema:
read_skill_file(skill="git-helper", filename="../secrets.txt")

Respuesta del sistema:
Invalid path: cannot access files outside skill directory.
```

La herramienta rechazará cualquier intento de acceder fuera del directorio de habilidades.

**Lo que deberías ver**: Un mensaje de error de seguridad de ruta.

## Puntos de Verificación ✅

- [ ] ¿Puedes usar `read_skill_file` para leer archivos de habilidades?
- [ ] ¿Puedes entender el propósito del mecanismo de seguridad de rutas?
- [ ] ¿Puedes identificar el formato XML de inyección de contenido de archivos?
- [ ] ¿Puedes encontrar la lista de archivos disponibles a partir del mensaje de error?
- [ ] ¿Puedes usar espacios de nombres para ubicar habilidades con precisión?

## Advertencias sobre Trampas Comunes

### Trampa 1: Ruta de Archivo Incorrecta

Si olvidas que el archivo está en un subdirectorio:

```
Entrada del usuario:
Lee usage-guide.md de git-helper

Respuesta del sistema:
File "usage-guide.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md
```

**Causa**: El archivo puede estar en un subdirectorio, necesitas especificar la ruta relativa.

**Solución**: Usa la ruta completa, como `docs/usage-guide.md`.

### Trampa 2: Ignorar Conflictos de Espacios de Nombres

Cuando existen habilidades con el mismo nombre en múltiples espacios de nombres:

```
Entrada del usuario:
Lee el README de build-helper

Respuesta del sistema:
File "README.md" from skill "build-helper" loaded.
```

Es posible que estés leyendo la habilidad a nivel de proyecto, pero esperas la habilidad a nivel de usuario.

**Solución**: Especifica claramente usando el espacio de nombres, como `read_skill_file(skill="user:build-helper", filename="README.md")`.

### Trampa 3: Intento de Directory Traversal

Intenta usar `..` para acceder al directorio superior:

```
Entrada del usuario:
Lee archivos fuera del directorio de habilidades

Llamada del sistema:
read_skill_file(skill="my-skill", filename="../../../etc/passwd")

Respuesta del sistema:
Invalid path: cannot access files outside skill directory.
```

**Causa**: Esta es una restricción de seguridad para prevenir ataques de directory traversal.

**Solución**: Solo puedes acceder a archivos dentro del directorio de habilidades. Para otros archivos, deja que la IA use directamente la herramienta `Read`.

### Trampa 4: El Archivo Ya Existe en el Contexto de la Sesión

Si ya has cargado la habilidad, el contenido del archivo puede estar en el SKILL.md u otro contenido ya inyectado:

```
Entrada del usuario:
Lee la documentación central de la habilidad

Llamada del sistema:
read_skill_file(skill="my-skill", filename="core-guide.md")
```

Pero esto puede ser innecesario porque el contenido central generalmente está en SKILL.md.

**Solución**: Primero verifica el contenido de la habilidad cargada para confirmar si necesitas archivos adicionales.

## Resumen de la Lección

La herramienta `read_skill_file` te permite acceder de forma segura a los archivos de soporte en el directorio de habilidades:

- **Verificación de Seguridad de Rutas**: Previene directory traversal, solo permite acceder a archivos dentro del directorio de habilidades
- **Mecanismo de Inyección XML**: El contenido del archivo se empaqueta en etiquetas XML `<skill-file>`, incluyendo metadatos
- **Errores Amigables**: Cuando un archivo no existe, lista los archivos disponibles para ayudarte a encontrar la ruta correcta
- **Soporte de Espacios de Nombres**: Puedes usar `namespace:skill-name` para ubicar habilidades con el mismo nombre con precisión
- **Persistencia del Contexto**: A través del indicador `synthetic: true`, el contenido del archivo sigue siendo accesible después de la compresión de la sesión

Esta herramienta es perfecta para leer:
- Documentación detallada (directorio `docs/`)
- Ejemplos de configuración (directorio `config/`)
- Ejemplos de código (directorio `examples/`)
- README y archivos explicativos
- Código fuente de scripts (si necesitas ver la implementación)

## Próxima Lección

> En la próxima lección aprenderemos **[Compatibilidad de Habilidades de Claude Code](../../advanced/claude-code-compatibility/)**.
>
> Aprenderás:
> - Entender cómo el complemento es compatible con el sistema de habilidades y complementos de Claude Code
> - Entender el mecanismo de mapeo de herramientas (conversión de herramientas de Claude Code a herramientas de OpenCode)
> - Dominar el método para descubrir habilidades desde la ubicación de instalación de Claude Code

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función        | Ruta del Archivo                                                                                    | Líneas    |
|--- | --- | ---|
| Definición de la herramienta ReadSkillFile | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135)         | 74-135   |
| Verificación de seguridad de ruta | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133)    | 130-133  |
| Listar archivos de habilidades | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316  |
| Función resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283  |
| Función injectSyntheticContent | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162)    | 147-162  |

**Tipos Clave**:
- `Skill`: Interfaz de metadatos de habilidad (`skills.ts:43-52`)
- `OpencodeClient`: Tipo de cliente del SDK de OpenCode (`utils.ts:140`)
- `SessionContext`: Contexto de sesión, incluye información de model y agent (`utils.ts:142-145`)

**Funciones Clave**:
- `ReadSkillFile(directory: string, client: OpencodeClient)`: Devuelve la definición de la herramienta, maneja la lectura de archivos de habilidades
- `isPathSafe(basePath: string, requestedPath: string): boolean`: Verifica si la ruta está dentro del directorio base, previene directory traversal
- `listSkillFiles(skillPath: string, maxDepth: number = 3): Promise<string[]>`: Lista todos los archivos en el directorio de habilidades (excluye SKILL.md)
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>): Skill | null`: Soporta resolución de habilidades en formato `namespace:skill-name`
- `injectSyntheticContent(client, sessionID, text, context)`: Inyecta contenido en la sesión a través de `noReply: true` y `synthetic: true`

**Reglas de Negocio**:
- La verificación de seguridad de ruta usa `path.resolve()` para verificar, asegurando que la ruta resuelta comience con el directorio base (`utils.ts:131-132`)
- Cuando el archivo no existe, intenta usar `fs.readdir()` para listar archivos disponibles, proporcionando un mensaje de error amigable (`tools.ts:126-131`)
- El contenido del archivo se empaqueta en formato XML, incluye atributos `skill`, `file` y etiquetas `<metadata>`, `<content>` (`tools.ts:111-119`)
- Al inyectar, obtiene el contexto de model y agent de la sesión actual, asegurando que el contenido se inyecte en el contexto correcto (`tools.ts:121-122`)

**Mecanismos de Seguridad**:
- Protección contra directory traversal: `isPathSafe()` verifica si la ruta está dentro del directorio base (`utils.ts:130-133`)
- Cuando la habilidad no existe, proporciona sugerencias de coincidencia aproximada (`tools.ts:90-95`)
- Cuando el archivo no existe, lista los archivos disponibles para ayudar al usuario a encontrar la ruta correcta (`tools.ts:126-131`)

</details>
