---
title: "Referencia de Comandos: OpenSkills CLI | openskills"
sidebarTitle: "Domina los 7 Comandos"
subtitle: "Referencia de Comandos: OpenSkills CLI"
description: "Aprende los 7 comandos y parámetros de OpenSkills. Domina la referencia completa de install, list, read, update, sync, manage, remove para mejorar la eficiencia de la herramienta CLI."
tags:
  - "CLI"
  - "Referencia de comandos"
  - "Tabla rápida"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 1
---
# Referencia de Comandos: Tabla Rápida Completa de OpenSkills

## Qué podrás hacer después

- Utilizar competentemente los 7 comandos de OpenSkills
- Entender el propósito y los casos de uso de las opciones globales
- Buscar rápidamente el significado de parámetros y banderas de comandos
- Utilizar comandos no interactivos en scripts

## Resumen de Comandos

OpenSkills proporciona los siguientes 7 comandos:

| Comando | Propósito | Casos de uso |
|--- | --- | ---|
| `install` | Instalar habilidades | Instalar nuevas habilidades desde GitHub, ruta local o repositorio privado |
| `list` | Listar habilidades | Ver todas las habilidades instaladas y sus ubicaciones |
| `read` | Leer habilidades | Hacer que el agente de AI cargue el contenido de habilidades (generalmente llamado automáticamente por el agente) |
| `update` | Actualizar habilidades | Actualizar habilidades instaladas desde el repositorio de origen |
| `sync` | Sincronizar | Escribir la lista de habilidades en AGENTS.md |
| `manage` | Gestionar | Eliminar habilidades de forma interactiva |
| `remove` | Eliminar | Eliminar una habilidad específica (método para scripts) |

::: info Consejo
Usa `npx openskills --help` para ver una breve descripción de todos los comandos.
:::

## Opciones Globales

Algunos comandos soportan las siguientes opciones globales:

| Opción | Abreviatura | Propósito | Comandos aplicables |
|--- | --- | --- | ---|
| `--global` | `-g` | Instalar en el directorio global `~/.claude/skills/` | `install` |
| `universal` | `-u` | Instalar en el directorio universal `.agent/skills/` (entorno multi-agente) | `install` |
| `--yes` | `-y` | Saltar prompts interactivos, usar comportamiento predeterminado | `install`, `sync` |
| `--output <path>` | `-o <path>` | Especificar ruta del archivo de salida | `sync` |

## Detalle de Comandos

### install - Instalar Habilidades

Instala habilidades desde un repositorio de GitHub, ruta local o repositorio git privado.

```bash
openskills install <source> [options]
```

**Parámetros**:

| Parámetro | Requerido | Descripción |
|--- | --- | ---|
| `<source>` | ✅ | Fuente de habilidad (GitHub shorthand, URL git o ruta local) |

**Opciones**:

| Opción | Abreviatura | Predeterminado | Descripción |
|--- | --- | --- | ---|
| `--global` | `-g` | `false` | Instalar en directorio global `~/.claude/skills/` |
| `--universal` | `-u` | `false` | Instalar en directorio universal `.agent/skills/` |
| `--yes` | `-y` | `false` | Saltar selección interactiva, instalar todas las habilidades encontradas |

**Ejemplos del parámetro source**:

```bash
# GitHub shorthand (recomendado)
openskills install anthropics/skills

# Especificar rama
openskills install owner/repo@branch

# Repositorio privado
openskills install git@github.com:owner/repo.git

# Ruta local
openskills install ./path/to/skill

# URL git
openskills install https://github.com/owner/repo.git
```

**Descripción del comportamiento**:

- Durante la instalación se listan todas las habilidades encontradas para seleccionar
- Usar `--yes` para saltar la selección e instalar todas las habilidades
- Prioridad de ubicación de instalación: `--universal` → `--global` → directorio del proyecto predeterminado
- Después de la instalación se crea el archivo de metadatos `.openskills.json` en el directorio de habilidades

---

### list - Listar Habilidades

Lista todas las habilidades instaladas.

```bash
openskills list
```

**Opciones**: Ninguna

**Formato de salida**:

```
Available Skills:

skill-name           [description]            (project/global)
```

**Descripción del comportamiento**:

- Ordenado por ubicación: habilidades del proyecto primero, luego habilidades globales
- Dentro de cada ubicación, ordenado alfabéticamente
- Muestra el nombre de habilidad, descripción y etiqueta de ubicación

---

### read - Leer Habilidades

Lee el contenido de una o más habilidades a la salida estándar. Este comando se usa principalmente para que los agentes de AI carguen habilidades bajo demanda.

```bash
openskills read <skill-names...>
```

**Parámetros**:

| Parámetro | Requerido | Descripción |
|--- | --- | ---|
| `<skill-names...>` | ✅ | Lista de nombres de habilidades (soporta múltiples, separados por espacio o coma) |

**Opciones**: Ninguna

**Ejemplos**:

```bash
# Leer una sola habilidad
openskills read pdf

# Leer múltiples habilidades
openskills read pdf git

# Separado por comas (también soportado)
openskills read "pdf,git,excel"
```

**Formato de salida**:

```
Skill: pdf
Base Directory: /path/to/.claude/skills/pdf

---SKILL.md contenido---

[SKILL.END]
```

**Descripción del comportamiento**:

- Busca habilidades siguiendo 4 niveles de prioridad de directorios
- Muestra el nombre de habilidad, ruta del directorio base y contenido completo de SKILL.md
- Las habilidades no encontradas muestran un mensaje de error

---

### update - Actualizar Habilidades

Actualiza habilidades instaladas desde las fuentes registradas. Si no se especifica el nombre de habilidad, se actualizan todas las habilidades instaladas.

```bash
openskills update [skill-names...]
```

**Parámetros**:

| Parámetro | Requerido | Descripción |
|--- | --- | ---|
| `[skill-names...]` | ❌ | Lista de nombres de habilidades a actualizar (predeterminado todas) |

**Opciones**: Ninguna

**Ejemplos**:

```bash
# Actualizar todas las habilidades
openskills update

# Actualizar habilidades específicas
openskills update pdf git

# Separado por comas (también soportado)
openskills update "pdf,git,excel"
```

**Descripción del comportamiento**:

- Solo actualiza habilidades con metadatos (es decir, instaladas vía install)
- Omite habilidades sin metadatos con un aviso
- Actualiza la marca de tiempo de instalación después de una actualización exitosa
- Usa shallow clone (`--depth 1`) al actualizar desde repositorios git

---

### sync - Sincronizar con AGENTS.md

Sincroniza las habilidades instaladas con AGENTS.md (u otro archivo personalizado), generando una lista de habilidades utilizable por agentes de AI.

```bash
openskills sync [options]
```

**Opciones**:

| Opción | Abreviatura | Predeterminado | Descripción |
|--- | --- | --- | ---|
| `--output <path>` | `-o <path>` | `AGENTS.md` | Ruta del archivo de salida |
| `--yes` | `-y` | `false` | Saltar selección interactiva, sincronizar todas las habilidades |

**Ejemplos**:

```bash
# Sincronizar con archivo predeterminado
openskills sync

# Sincronizar con archivo personalizado
openskills sync -o .ruler/AGENTS.md

# Saltar selección interactiva
openskills sync -y
```

**Descripción del comportamiento**:

- Analiza el archivo existente y preselecciona habilidades habilitadas
- En la primera sincronización, las habilidades del proyecto están seleccionadas por defecto
- Genera formato XML compatible con Claude Code
| Soporta reemplazar o agregar sección de habilidades en archivo existente

---

### manage - Gestionar Habilidades

Elimina habilidades instaladas de forma interactiva. Proporciona una interfaz amigable para eliminación.

```bash
openskills manage
```

**Opciones**: Ninguna

**Descripción del comportamiento**:

- Muestra todas las habilidades instaladas para seleccionar
- Por defecto no selecciona ninguna habilidad
| Elimina inmediatamente después de seleccionar, sin confirmación secundaria

---

### remove - Eliminar Habilidades

Elimina una habilidad instalada específica (método para scripts). Más conveniente que `manage` cuando se usa en scripts.

```bash
openskills remove <skill-name>
```

**Parámetros**:

| Parámetro | Requerido | Descripción |
|--- | --- | ---|
| `<skill-name>` | ✅ | Nombre de la habilidad a eliminar |

**Opciones**: Ninguna

**Ejemplos**:

```bash
openskills remove pdf

# También se puede usar alias
openskills rm pdf
```

**Descripción del comportamiento**:

- Elimina el directorio completo de habilidades (incluyendo todos los archivos y subdirectorios)
- Muestra la ubicación de eliminación y fuente
- Muestra error y sale si no encuentra la habilidad

## Tabla Rápida de Operaciones

| Tarea | Comando |
|--- | ---|
| Ver todas las habilidades instaladas | `openskills list` |
| Instalar habilidades oficiales | `openskills install anthropics/skills` |
| Instalar desde ruta local | `openskills install ./my-skill` |
| Instalar habilidad globalmente | `openskills install owner/skill --global` |
| Actualizar todas las habilidades | `openskills update` |
| Actualizar habilidades específicas | `openskills update pdf git` |
| Eliminar habilidades de forma interactiva | `openskills manage` |
| Eliminar habilidad específica | `openskills remove pdf` |
| Sincronizar con AGENTS.md | `openskills sync` |
| Ruta de salida personalizada | `openskills sync -o custom.md` |

## Advertencias de Problemas Comunes

### 1. Comando no encontrado

**Problema**: Al ejecutar el comando se indica "command not found"

**Causas**:
- Node.js no instalado o versión muy antigua (requiere 20.6+)
- No se usa `npx` o no instalado globalmente

**Solución**:
```bash
# Usar npx (recomendado)
npx openskills list

# O instalar globalmente
npm install -g openskills
```

### 2. Habilidad no encontrada

**Problema**: `openskills read skill-name` indica "Skill not found"

**Causas**:
- Habilidad no instalada
- Nombre de habilidad mal escrito
- Ubicación de instalación de habilidad no está en la ruta de búsqueda

**Solución**:
```bash
# Verificar habilidades instaladas
openskills list

# Ver directorio de habilidades
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

### 3. Actualización fallida

**Problema**: `openskills update` indica "No metadata found"

**Causas**:
- Habilidad no instalada mediante comando `install`
- Archivo de metadatos `.openskills.json` eliminado

**Solución**: Reinstalar la habilidad
```bash
openskills install <original-source>
```

## Resumen de la Lección

OpenSkills proporciona una interfaz de línea de comandos completa, cubriendo instalación, listado, lectura, actualización, sincronización y gestión de habilidades. Dominar estos comandos es la base para usar OpenSkills eficientemente:

- `install` - Instalar nuevas habilidades (soporta GitHub, local, repositorio privado)
- `list` - Ver habilidades instaladas
- `read` - Leer contenido de habilidad (usado por agentes de AI)
- `update` - Actualizar habilidades instaladas
- `sync` - Sincronizar con AGENTS.md
- `manage` - Eliminar habilidades de forma interactiva
- `remove` - Eliminar habilidad específica

Recuerda el propósito de las opciones globales:
- `--global` / `--universal` - Controla ubicación de instalación
- `--yes` - Saltar prompts interactivos (adecuado para CI/CD)
- `--output` - Ruta de archivo de salida personalizada

## Próxima Lección

> En la próxima lección aprenderemos **[Detalles de Fuentes de Instalación](../install-sources/)**.
>
> Aprenderás:
> - Uso detallado de los tres métodos de instalación
> - Casos de uso de cada método
> - Configuración de repositorios privados
