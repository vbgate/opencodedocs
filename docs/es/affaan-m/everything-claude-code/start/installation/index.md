---
title: "Instalación: Plugin vs Manual | Everything Claude Code"
sidebarTitle: "Instalación en 5 minutos"
subtitle: "Instalación: Plugin vs Manual"
description: "Aprende las dos formas de instalar Everything Claude Code. Instalación con un clic desde el marketplace de plugins para mayor rapidez, o instalación manual para configurar componentes con precisión."
tags:
  - "instalación"
  - "plugin"
  - "configuración"
prerequisite:
  - "start-quickstart"
order: 20
---

# Guía de Instalación: Marketplace de Plugins vs Manual

## Lo que aprenderás

Al completar este tutorial, serás capaz de:

- Instalar Everything Claude Code con un solo clic desde el marketplace de plugins
- Realizar instalaciones manuales con configuraciones detalladas de componentes
- Configurar correctamente servidores MCP y Hooks
- Verificar que la instalación se ha completado exitosamente

## Tu situación actual

Quieres empezar rápidamente con Everything Claude Code, pero no sabes si:

- Instalar con un clic desde el marketplace, o controlar manualmente cada componente
- Cómo evitar errores de configuración que impidan el funcionamiento
- Qué archivos copiar y a qué ubicaciones al instalar manualmente

## Cuándo usar cada método

| Escenario | Método recomendado | Razón |
|---|---|---|
| Primera vez usando | Instalación desde marketplace | La forma más simple, lista en 5 minutos |
| Quieres probar funcionalidades específicas | Instalación desde marketplace | Experiencia completa antes de decidir |
| Tienes necesidades específicas | Instalación manual | Control preciso de cada componente |
| Ya tienes configuraciones personalizadas | Instalación manual | Evita sobrescribir configuraciones existentes |

## Conceptos clave

Everything Claude Code ofrece dos métodos de instalación:

1. **Instalación desde marketplace** (recomendado)
   - Adecuado para la mayoría de usuarios
   - Maneja automáticamente todas las dependencias
   - Instalación con un solo comando

2. **Instalación manual**
   - Adecuado para usuarios con necesidades específicas
   - Control preciso de qué componentes instalar
   - Requiere configuración manual

Independientemente del método elegido, los archivos de configuración se copiarán al directorio `~/.claude/`, permitiendo que Claude Code reconozca y utilice estos componentes.

## 🎒 Preparativos previos

::: warning Prerrequisitos

Antes de comenzar, asegúrate de:
- [ ] Tener Claude Code instalado
- [ ] Tener conexión de red a GitHub
- [ ] Conocer operaciones básicas de línea de comandos (si eliges instalación manual)

:::

---

## Instrucciones paso a paso

### Método 1: Instalación desde marketplace (recomendado)

Este es el método más simple, adecuado para usuarios que quieren empezar rápidamente o para primera vez.

#### Paso 1: Agregar el marketplace

**Por qué**
Registra el repositorio de GitHub como marketplace de plugins de Claude Code para poder instalar sus plugins.

En Claude Code, ingresa:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**Deberías ver**:
```
Successfully added marketplace affaan-m/everything-claude-code
```

#### Paso 2: Instalar el plugin

**Por qué**
Instala el plugin Everything Claude Code desde el marketplace recién agregado.

En Claude Code, ingresa:

```bash
/plugin install everything-claude-code@everything-claude-code
```

**Deberías ver**:
```
Successfully installed everything-claude-code@everything-claude-code
```

::: tip Punto de verificación ✅

Verifica que el plugin esté instalado:

```bash
/plugin list
```

Deberías ver `everything-claude-code@everything-claude-code` en la salida.

:::

#### Paso 3 (opcional): Configurar settings.json directamente

**Por qué**
Si quieres omitir la línea de comandos y modificar directamente el archivo de configuración.

Abre `~/.claude/settings.json` y agrega el siguiente contenido:

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  },
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Deberías ver**:
- Después de actualizar el archivo de configuración, Claude Code cargará automáticamente el plugin
- Todos los agents, skills, commands y hooks estarán disponibles inmediatamente

---

### Método 2: Instalación manual

Adecuado para usuarios que quieren controlar exactamente qué componentes instalar.

#### Paso 1: Clonar el repositorio

**Por qué**
Obtiene todos los archivos fuente de Everything Claude Code.

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
```

**Deberías ver**:
```
Cloning into 'everything-claude-code'...
remote: Enumerating objects...
```

#### Paso 2: Copiar agents

**Por qué**
Copia los sub-agentes especializados al directorio de agents de Claude Code.

```bash
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

**Deberías ver**:
- 9 nuevos archivos de agent en el directorio `~/.claude/agents/`

::: tip Punto de verificación ✅

Verifica que los agents se hayan copiado:

```bash
ls ~/.claude/agents/
```

Deberías ver algo como:
```
planner.md architect.md tdd-guide.md code-reviewer.md ...
```

:::

#### Paso 3: Copiar rules

**Por qué**
Copia las reglas obligatorias al directorio de rules de Claude Code.

```bash
cp everything-claude-code/rules/*.md ~/.claude/rules/
```

**Deberías ver**:
- 8 nuevos archivos de reglas en el directorio `~/.claude/rules/`

#### Paso 4: Copiar commands

**Por qué**
Copia los comandos de barra inclinada al directorio de commands de Claude Code.

```bash
cp everything-claude-code/commands/*.md ~/.claude/commands/
```

**Deberías ver**:
- 14 nuevos archivos de comando en el directorio `~/.claude/commands/`

#### Paso 5: Copiar skills

**Por qué**
Copia las definiciones de flujo de trabajo y conocimientos de dominio al directorio de skills de Claude Code.

```bash
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

**Deberías ver**:
- 11 nuevos directorios de skills en `~/.claude/skills/`

#### Paso 6: Configurar hooks

**Por qué**
Agrega la configuración de hooks de automatización al settings.json de Claude Code.

Copia el contenido de `hooks/hooks.json` a tu `~/.claude/settings.json`:

```bash
cat everything-claude-code/hooks/hooks.json
```

Agrega el contenido de salida a tu `~/.claude/settings.json`, con el siguiente formato:

```json
{
  "hooks": [
    {
      "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
      "hooks": [
        {
          "type": "command",
          "command": "#!/bin/bash\ngrep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
        }
      ]
    }
  ]
}
```

**Deberías ver**:
- Cuando editas archivos TypeScript/JavaScript, aparecerá una advertencia si hay `console.log`

::: warning Recordatorio importante

Asegúrate de que el array `hooks` no sobrescriba la configuración existente en `~/.claude/settings.json`. Si ya hay hooks existentes, necesitarás fusionarlos.

:::

#### Paso 7: Configurar servidores MCP

**Por qué**
Extiende las capacidades de integración de servicios externos de Claude Code.

Selecciona los servidores MCP que necesites de `mcp-configs/mcp-servers.json` y agrégalos a `~/.claude.json`:

```bash
cat everything-claude-code/mcp-configs/mcp-servers.json
```

Copia la configuración necesaria a `~/.claude.json`, por ejemplo:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

::: danger Importante: Reemplaza los marcadores de posición

Debes reemplazar los marcadores `YOUR_*_HERE` con tus API Keys reales, de lo contrario los servidores MCP no funcionarán.

:::

::: tip Recomendación sobre MCP

**¡No habilites todos los MCP!** Demasiados MCP consumirán mucho espacio de contexto.

- Se recomienda configurar 20-30 servidores MCP
- Mantén menos de 10 habilitados por proyecto
- Mantén menos de 80 herramientas activas

Usa `disabledMcpServers` en la configuración del proyecto para deshabilitar MCP no necesarios:

```json
{
  "disabledMcpServers": ["firecrawl", "supabase"]
}
```

:::

---

## Punto de verificación ✅

### Verificar instalación desde marketplace

```bash
/plugin list
```

Deberías ver `everything-claude-code@everything-claude-code` habilitado.

### Verificar instalación manual

```bash
# Verificar agents
ls ~/.claude/agents/ | head -5

# Verificar rules
ls ~/.claude/rules/ | head -5

# Verificar commands
ls ~/.claude/commands/ | head -5

# Verificar skills
ls ~/.claude/skills/ | head -5
```

Deberías ver:
- En el directorio agents: `planner.md`, `tdd-guide.md`, etc.
- En el directorio rules: `security.md`, `coding-style.md`, etc.
- En el directorio commands: `tdd.md`, `plan.md`, etc.
- En el directorio skills: `coding-standards`, `backend-patterns`, etc.

### Verificar funcionalidad disponible

En Claude Code, ingresa:

```bash
/tdd
```

Deberías ver que el agent TDD Guide comienza a trabajar.

---

## Solución de problemas

### Error común 1: El plugin no funciona después de instalar

**Síntoma**: Después de instalar el plugin, los comandos no funcionan.

**Causa**: El plugin no se cargó correctamente.

**Solución**:
```bash
# Verificar lista de plugins
/plugin list

# Si no está habilitado, habilitar manualmente
/plugin enable everything-claude-code@everything-claude-code
```

### Error común 2: Fallo de conexión al servidor MCP

**Síntoma**: La funcionalidad MCP no funciona, error de conexión.

**Causa**: La API Key no se reemplazó o el formato es incorrecto.

**Solución**:
- Verifica que todos los marcadores `YOUR_*_HERE` en `~/.claude.json` hayan sido reemplazados
- Verifica que la API Key sea válida
- Confirma que la ruta del comando del servidor MCP sea correcta

### Error común 3: Los hooks no se activan

**Síntoma**: No ves sugerencias de hooks al editar archivos.

**Causa**: La configuración de hooks en `~/.claude/settings.json` tiene formato incorrecto.

**Solución**:
- Verifica que el formato del array `hooks` sea correcto
- Asegúrate de que la sintaxis de la expresión `matcher` sea correcta
- Verifica que la ruta del comando hook sea ejecutable

### Error común 4: Problemas de permisos de archivos (instalación manual)

**Síntoma**: Error "Permission denied" al copiar archivos.

**Causa**: Permisos insuficientes en el directorio `~/.claude/`.

**Solución**:
```bash
# Asegurar que el directorio .claude existe y tiene permisos
mkdir -p ~/.claude/{agents,rules,commands,skills}

# Usar sudo (solo si es necesario)
sudo cp -r everything-claude-code/agents/*.md ~/.claude/agents/
```

---

## Resumen de la lección

**Comparación de los dos métodos de instalación**:

| Característica | Instalación desde marketplace | Instalación manual |
|---|---|---|
| Velocidad | ⚡ Rápida | 🐌 Lenta |
| Dificultad | 🟢 Simple | 🟡 Media |
| Flexibilidad | 🔒 Fija | 🔓 Personalizable |
| Escenario recomendado | Principiantes, experiencia rápida | Usuarios avanzados, necesidades específicas |

**Puntos clave**:
- La instalación desde marketplace es la forma más simple, un solo comando lo resuelve
- La instalación manual es adecuada para usuarios que necesitan control preciso de componentes
- Al configurar MCP, recuerda reemplazar los marcadores de posición y no habilitar demasiados
- Al verificar la instalación, revisa la estructura de directorios y la disponibilidad de comandos

---

## Próxima lección

> En la próxima lección aprenderemos **[Configuración del gestor de paquetes: detección automática y personalización](../package-manager-setup/)**.
>
> Aprenderás:
> - Cómo Everything Claude Code detecta automáticamente el gestor de paquetes
> - El mecanismo de prioridad de las 6 formas de detección
> - Cómo personalizar la configuración del gestor de paquetes a nivel de proyecto y usuario
> - Usar el comando `/setup-pm` para configurar rápidamente

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad | Ruta del archivo | Línea |
|---|---|---|
| Metadatos del plugin | [`source/affaan-m/everything-claude-code/.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Lista del marketplace | [`source/affaan-m/everything-claude-code/.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45 |
| Guía de instalación | [`source/affaan-m/everything-claude-code/README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 175-242 |
| Configuración de Hooks | [`source/affaan-m/everything-claude-code/hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-146 |
| Configuración MCP | [`source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-95 |

**Configuración clave**:
- Nombre del plugin: `everything-claude-code`
- Repositorio: `affaan-m/everything-claude-code`
- Licencia: MIT
- Soporta 9 agents, 14 commands, 8 sets de rules, 11 skills

**Formas de instalación**:
1. Instalación desde marketplace: `/plugin marketplace add` + `/plugin install`
2. Instalación manual: copiar agents, rules, commands, skills a `~/.claude/`

</details>
