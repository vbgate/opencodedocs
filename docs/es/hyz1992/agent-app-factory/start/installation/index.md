---
title: "Instalación y Configuración | Tutorial de Agent App Factory"
sidebarTitle: "Instalación en 5 minutos"
subtitle: "Instalación y Configuración | Tutorial de Agent App Factory"
description: "Aprende a instalar la herramienta CLI de Agent App Factory, configurar Claude Code u OpenCode, e instalar los plugins necesarios. Este tutorial cubre los requisitos de Node.js, configuración del asistente de IA y pasos de instalación de plugins."
tags:
- "Instalación"
- "Configuración"
- "Claude Code"
- "OpenCode"
prerequisite:
- "start-getting-started"
order: 20
---

# Instalación y Configuración

## Lo que aprenderás

✅ Instalar la herramienta CLI de Agent App Factory y verificar la instalación
✅ Configurar Claude Code u OpenCode como motor de ejecución de IA
✅ Instalar los plugins necesarios para ejecutar el pipeline
✅ Completar la inicialización del proyecto y lanzar tu primer proyecto Factory

## Tu situación actual

Quieres usar AI App Factory para convertir tus ideas en aplicaciones, pero no sabes qué herramientas instalar ni qué entorno configurar. Temes omitir plugins esenciales y que el pipeline falle a mitad de camino.

## Cuándo usar esto

Cuando uses AI App Factory por primera vez, o al configurar el entorno de desarrollo en una nueva máquina, completa primero la instalación y configuración antes de comenzar a generar aplicaciones.

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos

Antes de comenzar la instalación, asegúrate de:

- **Node.js versión >= 16.0.0** - Este es el requisito mínimo para la herramienta CLI
- **npm o yarn** - Para instalar paquetes globalmente
- **Un asistente de IA** - Claude Code u OpenCode (se recomienda Claude Code)

:::

**Verificar la versión de Node.js**:

```bash
node --version
```

Si la versión es inferior a 16.0.0, descarga e instala la última versión LTS desde el [sitio oficial de Node.js](https://nodejs.org).

## Concepto central

La instalación de AI App Factory consta de 3 componentes clave:

1. **Herramienta CLI** - Proporciona la interfaz de línea de comandos para gestionar el estado del proyecto
2. **Asistente de IA** - El "cerebro" que ejecuta el pipeline, interpreta las instrucciones del Agent
3. **Plugins necesarios** - Paquetes de extensión que mejoran las capacidades de IA (Bootstrap brainstorming, sistema de diseño UI)

Flujo de instalación: Instalar CLI → Configurar asistente de IA → Inicializar proyecto (instalación automática de plugins)

## Sígueme

### Paso 1: Instalar la herramienta CLI

Instala globalmente Agent App Factory CLI para poder usar el comando `factory` en cualquier directorio.

```bash
npm install -g agent-app-factory
```

**Deberías ver**: Salida de instalación exitosa

```
added 1 package in Xs
```

**Verificar la instalación**:

```bash
factory --version
```

**Deberías ver**: Número de versión

```
1.0.0
```

Si no ves el número de versión, verifica si la instalación fue exitosa:

```bash
which factory # macOS/Linux
where factory # Windows
```

::: tip ¿Falló la instalación?

Si encuentras problemas de permiso (macOS/Linux), intenta:

```bash
sudo npm install -g agent-app-factory
```

O usa npx sin instalar globalmente (no recomendado, requiere descarga cada vez):

```bash
npx agent-app-factory init
```

:::

### Paso 2: Instalar el asistente de IA

AI App Factory debe usarse con un asistente de IA, porque las definiciones de Agent y los archivos Skill son instrucciones de IA en formato Markdown que necesitan ser interpretadas y ejecutadas por una IA.

#### Opción A: Claude Code (Recomendado)

Claude Code es el asistente de programación con IA oficial de Anthropic, profundamente integrado con AI App Factory.

**Método de instalación**:

1. Visita el [sitio oficial de Claude Code](https://claude.ai/code)
2. Descarga e instala la aplicación para tu plataforma
3. Después de la instalación, verifica que el comando esté disponible:

```bash
claude --version
```

**Deberías ver**: Número de versión

```
Claude Code 1.x.x
```

#### Opción B: OpenCode

OpenCode es otro asistente de programación con IA que admite el modo Agent.

**Método de instalación**:

1. Visita el [sitio oficial de OpenCode](https://opencode.sh)
2. Descarga e instala la aplicación para tu plataforma
3. Si no hay herramienta de línea de comandos, descárgala e instálala manualmente en:

- **Windows**: `%LOCALAPPDATA%\Programs\OpenCode\`
- **macOS**: `/Applications/OpenCode.app/`
- **Linux**: `/usr/bin/opencode` o `/usr/local/bin/opencode`

::: info ¿Por qué se recomienda Claude Code?

- Soporte oficial, mejor integración con el sistema de permisos de AI App Factory
- Instalación de plugins automatizada, `factory init` configurará automáticamente los plugins necesarios
- Mejor gestión de contexto, ahorra Tokens

:::

### Paso 3: Inicializar tu primer proyecto Factory

Ahora que tienes una fábrica limpia, inicialicemos el primer proyecto.

**Crear directorio del proyecto**:

```bash
mkdir my-first-app && cd my-first-app
```

**Inicializar proyecto Factory**:

```bash
factory init
```

**Deberías ver**:

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
.factory/
agents/
skills/
policies/
templates/
pipeline.yaml
config.yaml
state.json

✓ Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
(Please wait for window to open)
```

**Punto de control ✅**: Confirma que se han creado los siguientes archivos

```bash
ls -la .factory/
```

**Deberías ver**:

```
agents/
skills/
policies/
templates/
pipeline.yaml
config.yaml
state.json
```

Al mismo tiempo, la ventana de Claude Code debería abrirse automáticamente.

::: tip El directorio debe estar vacío

`factory init` solo puede ejecutarse en un directorio vacío o que solo contenga archivos de configuración como `.git`, `README.md`, etc.

Si hay otros archivos en el directorio, verás el error:

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

:::

### Paso 4: Plugins instalados automáticamente

`factory init` intentará instalar automáticamente dos plugins necesarios:

1. **superpowers** - Skill de brainstorming para la etapa Bootstrap
2. **ui-ux-pro-max-skill** - Sistema de diseño para la etapa UI (67 estilos, 96 paletas de colores, 100 reglas de la industria)

Si la instalación automática falla, verás una advertencia:

```
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

::: warning ¿Qué hacer si falla la instalación de plugins?

Si la instalación de plugins falla durante la inicialización, puedes instalarlos manualmente en Claude Code posteriormente:

1. En Claude Code, escribe:
```
/install superpowers
/install ui-ux-pro-max-skill
```

2. O visita el mercado de plugins para instalarlos manualmente

:::

### Paso 5: Verificar permisos del asistente de IA

`factory init` generará automáticamente el archivo `.claude/settings.local.json` para configurar los permisos necesarios.

**Verificar configuración de permisos**:

```bash
cat .claude/settings.local.json
```

**Deberías ver** (versión simplificada):

```json
{
"allowedCommands": [
"read",
"write",
"glob",
"bash"
],
"allowedPaths": [
".factory/**",
"input/**",
"artifacts/**"
]
}
```

Estos permisos aseguran que el asistente de IA pueda:
- Leer definiciones de Agent y archivos Skill
- Escribir productos en el directorio `artifacts/`
- Ejecutar scripts y pruebas necesarias

::: danger No uses --dangerously-skip-permissions

La configuración de permisos generada por AI App Factory ya es suficientemente segura, no uses `--dangerously-skip-permissions` en Claude Code, esto reducirá la seguridad y puede causar operaciones no autorizadas.

:::

## Advertencias de problemas comunes

### ❌ Versión de Node.js demasiado baja

**Error**: `npm install -g agent-app-factory` falla o muestra errores al ejecutar

**Causa**: La versión de Node.js es inferior a 16.0.0

**Solución**: Actualiza Node.js a la última versión LTS

```bash
# Actualizar usando nvm (recomendado)
nvm install --lts
nvm use --lts
```

### ❌ Claude Code no instalado correctamente

**Error**: `factory init` muestra "Claude CLI not found" después de ejecutarse

**Causa**: Claude Code no se agregó correctamente al PATH

**Solución**: Reinstala Claude Code, o agrega manualmente la ruta del archivo ejecutable a las variables de entorno

- **Windows**: Agrega el directorio de instalación de Claude Code al PATH
- **macOS/Linux**: Verifica si hay un archivo ejecutable `claude` en `/usr/local/bin/`

### ❌ Directorio no vacío

**Error**: `factory init` muestra "directory is not empty"

**Causa**: Hay otros archivos en el directorio (además de archivos de configuración como `.git`, `README.md`, etc.)

**Solución**: Inicializa en un nuevo directorio vacío, o limpia el directorio existente

```bash
# Limpiar archivos no de configuración del directorio
rm -rf * !(.git) !(README.md)
```

### ❌ Fallo en la instalación de plugins

**Error**: `factory init` muestra advertencia de fallo en la instalación de plugins

**Causa**: Problemas de red o el mercado de plugins de Claude Code temporalmente no disponible

**Solución**: Instala manualmente los plugins en Claude Code, o instálalos cuando se te solicite durante la ejecución del pipeline

```
/install superpowers
/install ui-ux-pro-max-skill
```

## Resumen de esta lección

Esta lección completó la instalación y configuración completa de AI App Factory:

1. ✅ **Herramienta CLI** - Instalación global mediante `npm install -g agent-app-factory`
2. ✅ **Asistente de IA** - Claude Code u OpenCode, se recomienda Claude Code
3. ✅ **Inicialización del proyecto** - `factory init` crea el directorio `.factory/` y configura automáticamente
4. ✅ **Plugins necesarios** - superpowers y ui-ux-pro-max-skill (instalación automática o manual)
5. ✅ **Configuración de permisos** - Generación automática del archivo de permisos de Claude Code

Ahora tienes un proyecto Factory funcional, la ventana de Claude Code está abierta y lista para ejecutar el pipeline.

## Próxima lección

> En la próxima lección aprenderemos **[Inicializar proyecto Factory](../init-project/)**.
>
> Aprenderás:
> - Comprender la estructura de directorios generada por `factory init`
> - Entender el propósito de cada archivo en el directorio `.factory/`
> - Dominar cómo modificar la configuración del proyecto
> - Aprender cómo ver el estado del proyecto

¿Listo para comenzar a generar tu primera aplicación? ¡Continúa!

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-29

| Función | Ruta del archivo | Línea |
| ------- | -------------------------------------------------------------------------------------------------- | ------- |
| Entrada CLI | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 1-123 |
| Comando de inicialización | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| Requisitos de Node.js | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json) | 41 |
| Inicio de Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| Inicio de OpenCode | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Verificación de instalación de plugins | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L360-L392) | 360-392 |
| Generación de configuración de permisos | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-275 |

**Constantes clave**:
- `NODE_VERSION_MIN = "16.0.0"`: Requisito mínimo de versión de Node.js (package.json:41)

**Funciones clave**:
- `getFactoryRoot()`: Obtiene el directorio raíz de instalación de Factory (factory.js:22-52)
- `init()`: Inicializa el proyecto Factory (init.js:220-456)
- `launchClaudeCode()`: Inicia Claude Code (init.js:119-147)
- `launchOpenCode()`: Inicia OpenCode (init.js:152-215)
- `generateClaudeSettings()`: Genera la configuración de permisos de Claude Code

</details>
