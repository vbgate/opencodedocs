---
title: "Ejecutar scripts: Ejecutar en el directorio de habilidades | opencode-agent-skills"
sidebarTitle: "Ejecutar scripts de automatización"
subtitle: "Ejecutar scripts: Ejecutar en el directorio de habilidades"
description: "Domina los métodos de ejecución de scripts de habilidades. Aprende a ejecutar scripts en el contexto del directorio de habilidades, pasar argumentos, manejar errores y configurar permisos, mejorando la eficiencia laboral mediante capacidades de automatización."
tags:
  - "ejecución de scripts"
  - "automatización"
  - "uso de herramientas"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: 5
---

# Ejecutar scripts de habilidades

## Lo que podrás hacer después de completar esta lección

- Utilizar la herramienta `run_skill_script` para ejecutar scripts ejecutables en el directorio de habilidades
- Pasar argumentos de línea de comandos a scripts
- Comprender el contexto del directorio de trabajo de la ejecución de scripts
- Manejar errores de ejecución de scripts y códigos de salida
- Dominar la configuración de permisos de scripts y mecanismos de seguridad

## Tu situación actual

Deseas que la IA ejecute un script de automatización de alguna habilidad, como construir un proyecto, ejecutar pruebas o desplegar una aplicación. Pero no estás seguro de cómo invocar el script, o encuentras problemas como errores de permisos o incapacidad para encontrar el script durante la ejecución.

## Cuándo usar esta técnica

- **Construcción automatizada**: Ejecutar `build.sh` o `build.py` de la habilidad para construir el proyecto
- **Ejecutar pruebas**: Activar la suite de pruebas de la habilidad para generar un reporte de cobertura
- **Proceso de despliegue**: Ejecutar scripts de despliegue para publicar la aplicación al entorno de producción
- **Procesamiento de datos**: Ejecutar scripts para procesar archivos o transformar formatos de datos
- **Instalación de dependencias**: Ejecutar scripts para instalar las dependencias requeridas por la habilidad

## Idea central

La herramienta `run_skill_script` te permite ejecutar scripts ejecutables en el contexto del directorio de habilidades. Los beneficios de hacer esto son:

- **Entorno de ejecución correcto**: El script se ejecuta en el directorio de la habilidad, pudiendo acceder a la configuración y recursos de la habilidad
- **Flujo de trabajo automatizado**: La habilidad puede contener un conjunto de scripts automatizados, reduciendo operaciones repetitivas
- **Verificación de permisos**: Solo se ejecutan archivos con permisos ejecutables, previniendo la ejecución errónea de archivos de texto normales
- **Captura de errores**: Captura el código de salida y la salida del script, facilitando la depuración

::: info Reglas de descubrimiento de scripts
El complemento busca recursivamente archivos ejecutables en el directorio de habilidades (profundidad máxima de 10 niveles):
- **Directorios omitidos**: Directorios ocultos (que comienzan con `.`), `node_modules`, `__pycache__`, `.git`, `.venv`, etc.
- **Verificación de ejecutable**: Solo los archivos con permisos ejecutables (mode & 0o111) se incluirán en la lista de scripts
- **Rutas relativas**: Las rutas de los scripts son relativas al directorio de la habilidad, como `tools/build.sh`
:::

::: tip Consulta primero los scripts disponibles
Antes de ejecutar, usa `get_available_skills` para ver la lista de scripts de la habilidad:
```
docker-helper (project)
  Guía de contenedorización y despliegue con Docker [scripts: build.sh, deploy.sh]
```
:::

## Sígueme

### Paso 1: Ejecutar scripts de habilidades

Supongamos que tienes una habilidad `docker-helper` que contiene el script `build.sh`:

```
Entrada del usuario:
Ejecutar el script build.sh de docker-helper

Respuesta del sistema:
Building Docker image...
Successfully built abc123def456
Tagged as myapp:latest
```

**Lo que deberías ver**: El contenido de la salida del script se muestra en la respuesta.

Durante la ejecución del script, el directorio de trabajo se ha cambiado al directorio de la habilidad, por lo que `build.sh` puede acceder correctamente a recursos como `Dockerfile` de la habilidad.

### Paso 2: Pasar argumentos de línea de comandos

Muchos scripts admiten argumentos, por ejemplo `deploy.sh` podría necesitar especificar el entorno:

```
Entrada del usuario:
Ejecutar deploy.sh de docker-helper, el parámetro es production

Respuesta del sistema:
Deploying to production environment...
Uploading image to registry...
Deployment successful: https://myapp.example.com
```

También puedes pasar múltiples argumentos:

```
Entrada del usuario:
Usar deploy.sh para desplegar, los parámetros son staging y --force

Respuesta del sistema:
Deploying to staging environment (--force mode)...
Skipping validation...
Deployment successful
```

**Lo que deberías ver**: El script recibe los argumentos y ejecuta las operaciones correspondientes.

### Paso 3: Ejecutar scripts en directorios anidados

Los scripts pueden estar en subdirectorios de la habilidad, como `tools/setup.sh`:

```
Entrada del usuario:
Ejecutar tools/setup.sh de docker-helper

Respuesta del sistema:
Setting up Docker environment...
✓ Docker network created
✓ Volume mounted
✓ Environment configured
```

La ruta relativa siempre es relativa al directorio de la habilidad, sin importar qué tan profunda sea la ubicación real del script.

**Lo que deberías ver**: Los scripts en directorios anidados también se ejecutan correctamente.

### Paso 4: Manejar el error de habilidad inexistente

Si ingresas un nombre de habilidad incorrecto:

```
Entrada del usuario:
Ejecutar build.sh de docker-asistant

Respuesta del sistema:
Skill "docker-asistant" not found. Did you mean "docker-helper"?
```

El complemento sugerirá el nombre correcto de la habilidad basado en coincidencia aproximada. Puedes llamar primero a `get_available_skills` para ver las habilidades disponibles.

**Lo que deberías ver**: Mensaje de error y el nombre correcto sugerido.

### Paso 5: Manejar el error de script inexistente

Si el script no está en la lista de scripts de la habilidad:

```
Entrada del usuario:
Ejecutar run.sh de docker-helper

Respuesta del sistema:
Script "run.sh" not found in skill "docker-helper". Did you mean "build.sh"?
Available scripts: build.sh, deploy.sh
```

El complemento listará todos los scripts disponibles, facilitando que elijas el nombre de script correcto.

**Lo que deberías ver**: Mensaje de error y lista de scripts disponibles.

### Paso 6: Comprender el fallo de ejecución del script

Si el script falla durante la ejecución (código de salida no 0), el complemento devolverá información de error:

```
Entrada del usuario:
Ejecutar build.sh de docker-helper

Respuesta del sistema:
Script failed (exit 1): Dockerfile not found in /path/to/skill
```

La información de error incluye:
- **Código de salida**: `exit 1` indica que el script salió con un estado no cero
- **Salida de error**: Contenido del stderr o stdout del script
- **Causa del fallo**: Información específica del error del script

**Lo que deberías ver**: Información detallada del error para ayudarte a localizar el problema.

## Punto de control ✅

- [ ] ¿Puedes ejecutar scripts ejecutables en el directorio de habilidades?
- [ ] ¿Puedes pasar argumentos de línea de comandos a scripts?
- [ ] ¿Puedes comprender el contexto del directorio de trabajo de la ejecución de scripts?
- [ ] ¿Puedes identificar y manejar errores de ejecución de scripts?
- [ ] ¿Sabes cómo verificar la configuración de permisos de scripts?

## Advertencias sobre trampas

### Trampa 1: El script no tiene permisos ejecutables

Si creas un nuevo script pero olvidas establecer permisos ejecutables, no aparecerá en la lista de scripts.

**Manifestación del error**:
```
Available scripts: build.sh  # Tu nuevo script new-script.sh no está en la lista
```

**Causa**: El archivo no tiene permisos ejecutables (mode & 0o111 es false).

**Solución**: Establecer permisos ejecutables en la terminal:
```bash
chmod +x .opencode/skills/my-skill/new-script.sh
```

**Verificación**: Vuelve a llamar a `get_available_skills` para ver la lista de scripts.

### Trampa 2: Ruta de script incorrecta

La ruta del script debe ser una ruta relativa al directorio de habilidades, no se pueden usar rutas absolutas ni referencias al directorio padre.

**Ejemplo incorrecto**:

```bash
# ❌ Error: usar ruta absoluta
Ejecutar /path/to/skill/build.sh de docker-helper

# ❌ Error: intentar acceder al directorio padre (aunque pasará la verificación de seguridad, la ruta es incorrecta)
Ejecutar ../build.sh de docker-helper
```

**Ejemplo correcto**:

```bash
# ✅ Correcto: usar ruta relativa
Ejecutar build.sh de docker-helper
Ejecutar tools/deploy.sh de docker-helper
```

**Causa**: El complemento verificará la seguridad de la ruta, previniendo ataques de salto de directorio, y la ruta relativa está basada en el directorio de habilidades.

### Trampa 3: El script depende del directorio de trabajo

Si el script asume que el directorio actual es el directorio raíz del proyecto en lugar del directorio de habilidades, podría fallar.

**Ejemplo incorrecto**:
```bash
# build.sh en el directorio de habilidades
#!/bin/bash
# ❌ Error: asume que el directorio actual es el directorio raíz del proyecto
docker build -t myapp .
```

**Problema**: Durante la ejecución, el directorio actual es el directorio de habilidades (`.opencode/skills/docker-helper`), no el directorio raíz del proyecto.

**Solución**: El script debería usar rutas absolutas o ubicar dinámicamente el directorio raíz del proyecto:
```bash
# ✅ Correcto: usar ruta relativa para ubicar el directorio raíz del proyecto
docker build -t myapp ../../..

# O: usar variables de entorno o archivos de configuración
PROJECT_ROOT="${SKILL_DIR}/../../.."
docker build -t myapp "$PROJECT_ROOT"
```

**Explicación**: Es posible que el directorio de habilidades no tenga el `Dockerfile` del proyecto, por lo que el script debe ubicar los archivos de recursos por sí mismo.

### Trampa 4: Salida del script demasiado larga

Si el script genera mucha información de registro (como el progreso de descarga de npm install), la respuesta podría volverse muy larga.

**Manifestación**:

```bash
Respuesta del sistema:
npm WARN deprecated package...
npm notice created a lockfile...
added 500 packages in 2m
# Posiblemente cientos de líneas de salida
```

**Recomendación**: El script debería simplificar la salida, mostrando solo información clave:

```bash
#!/bin/bash
echo "Installing dependencies..."
npm install --silent
echo "✓ Dependencies installed (500 packages)"
```

## Resumen de esta lección

La herramienta `run_skill_script` te permite ejecutar scripts ejecutables en el contexto del directorio de habilidades, soportando:

- **Paso de argumentos**: Pasar argumentos de línea de comandos mediante el array `arguments`
- **Cambio de directorio de trabajo**: El CWD se cambia al directorio de habilidades durante la ejecución del script
- **Manejo de errores**: Capturar código de salida y salida de error, facilitando la depuración
- **Verificación de permisos**: Solo ejecutar archivos con permisos ejecutables
- **Seguridad de rutas**: Verificar las rutas de scripts, previniendo saltos de directorio

Reglas de descubrimiento de scripts:
- Escanear recursivamente el directorio de habilidades, profundidad máxima de 10 niveles
- Omitir directorios ocultos y directorios comunes de dependencias
- Incluir solo archivos con permisos ejecutables
- Las rutas son rutas relativas al directorio de habilidades

**Mejores prácticas**:
- La salida del script debe ser concisa, mostrando solo información clave
- El script no debe asumir que el directorio actual es el directorio raíz del proyecto
- Usa `chmod +x` para establecer permisos ejecutables para nuevos scripts
- Consulta primero `get_available_skills` para ver los scripts disponibles

## Próxima lección

> En la próxima lección aprenderemos **[Leer archivos de habilidades](../reading-skill-files/)**.
>
> Aprenderás:
> - Usar la herramienta read_skill_file para acceder a documentos y configuraciones de habilidades
> - Comprender el mecanismo de verificación de seguridad de rutas, previniendo ataques de salto de directorio
> - Dominar el formato de lectura de archivos e inyección de contenido XML
> - Aprender a organizar archivos de soporte en habilidades (documentos, ejemplos, configuraciones, etc.)

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo                                                                                    | Línea    |
|--- | --- | ---|
| Definición de la herramienta RunSkillScript | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| Función findScripts | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L59-L99) | 59-99   |

**Tipos clave**:
- `Script = { relativePath: string; absolutePath: string }`: Metadatos del script, que contiene la ruta relativa y la ruta absoluta

**Constantes clave**:
- Profundidad máxima de recursión: `10` (`skills.ts:64`) - Límite de profundidad de búsqueda de scripts
- Lista de directorios omitidos: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']` (`skills.ts:61`)
- Máscara de permiso ejecutable: `0o111` (`skills.ts:86`) - Verificar si el archivo es ejecutable

**Funciones clave**:
- `RunSkillScript(skill: string, script: string, arguments?: string[])`: Ejecutar scripts de habilidades, soporta paso de argumentos y cambio de directorio de trabajo
- `findScripts(skillPath: string)`: Buscar recursivamente archivos ejecutables en el directorio de habilidades, retornar ordenados por ruta relativa

**Reglas de negocio**:
- Cambiar el directorio de trabajo al directorio de habilidades durante la ejecución del script (`tools.ts:180`): `$.cwd(skill.path)`
- Solo ejecutar scripts que están en la lista de scripts de la habilidad (`tools.ts:165-177`)
- Cuando el script no existe, devolver lista de scripts disponibles, soportar sugerencias de coincidencia aproximada (`tools.ts:168-176`)
- Cuando falla la ejecución, devolver código de salida y salida de error (`tools.ts:184-195`)
- Omitir directorios ocultos (comienzan con `.`) y directorios comunes de dependencias (`skills.ts:70-71`)

</details>
