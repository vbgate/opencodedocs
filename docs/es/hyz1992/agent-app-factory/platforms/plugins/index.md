---
title: "Instalación de Plugins Esenciales: superpowers y ui-ux-pro-max | Tutorial de AI App Factory"
sidebarTitle: "Instalar plugins en 5 minutos"
subtitle: "Instalación de Plugins Esenciales: superpowers y ui-ux-pro-max | Tutorial de AI App Factory"
description: "Aprende a instalar y verificar dos plugins esenciales para AI App Factory: superpowers (para el brainstorming Bootstrap) y ui-ux-pro-max (para el sistema de diseño de UI). Este tutorial cubre la instalación automática y manual, métodos de verificación y solución de problemas comunes, asegurando que la línea de ensamblaje funcione correctamente y genere aplicaciones de alta calidad y funcionales, evitando fallos causados por plugins faltantes."
tags:
  - "Instalación de plugins"
  - "Claude Code"
  - "superpowers"
  - "ui-ux-pro-max"
prerequisite:
  - "start-installation"
  - "start-init-project"
  - "platforms-claude-code"
order: 70
---

# Instalación de Plugins Esenciales: superpowers y ui-ux-pro-max | Tutorial de AI App Factory

## Qué Aprenderás

- Verificar si los plugins superpowers y ui-ux-pro-max están instalados
- Instalar manualmente estos dos plugins esenciales (si la instalación automática falla)
- Verificar que los plugins estén habilitados correctamente
- Comprender por qué estos dos plugins son requisitos previos para ejecutar la línea de ensamblaje
- Solucionar problemas comunes de instalación de plugins

## Tu Situación Actual

Al ejecutar la línea de ensamblaje de Factory, puedes encontrarte con:

- **Fase Bootstrap fallida**: Indica "No se utilizó la skill superpowers:brainstorm"
- **Fase UI fallida**: Indica "No se utilizó la skill ui-ux-pro-max"
- **Instalación automática fallida**: Error durante la instalación del plugin en `factory init`
- **Conflicto de plugins**: Ya existe un plugin con el mismo nombre pero versión incorrecta
- **Problema de permisos**: El plugin no se habilitó correctamente después de la instalación

En realidad, Factory **intenta instalar automáticamente** estos dos plugins durante la inicialización, pero si falla, necesitas manejarlo manualmente.

## Cuándo Usar Esto

Cuando ocurra alguna de las siguientes situaciones, necesitarás instalar los plugins manualmente:

- `factory init` indica que la instalación del plugin falló
- Bootstrap o UI fases detectan que no se utilizó una skill requerida
- Usas Factory por primera vez y necesitas asegurar que la línea de ensamblaje funcione normalmente
- La versión del plugin es antigua y necesita reinstalarse

## Por Qué Necesitas Estos Dos Plugins

La línea de ensamblaje de Factory depende de dos plugins clave de Claude Code:

| Plugin | Propósito | Fase de la línea | Skills proporcionadas |
| --- | --- | --- | --- |
| **superpowers** | Profundizar en ideas de producto | Bootstrap | `superpowers:brainstorm` - Brainstorming sistemático, analiza problemas, usuarios, valor e hipótesis |
| **ui-ux-pro-max** | Generar sistema de diseño profesional | UI | `ui-ux-pro-max` - 67 estilos, 96 paletas de colores, 100 reglas de industria |

::: warning Requisito Obligatorio
Según la definición en `agents/orchestrator.checkpoint.md`, estos dos plugins son **obligatorios**:
- **Fase Bootstrap**: Debe usar la skill `superpowers:brainstorm`, de lo contrario se rechaza el producto
- **Fase UI**: Debe usar la skill `ui-ux-pro-max`, de lo contrario se rechaza el producto

:::

## 🎒 Preparación Antes de Empezar

Antes de comenzar, asegúrate de:

- [ ] Claude CLI instalado (`claude --version` disponible)
- [ ] `factory init` completado para inicializar el proyecto
- [ ] Permisos de Claude Code configurados (consulta [Guía de Integración de Claude Code](../claude-code/))
- [ ] Conexión a Internet funcionando (necesaria para acceder al mercado de plugins de GitHub)

## Idea Central

La instalación de plugins sigue un flujo de cuatro pasos: **Verificar → Agregar mercado → Instalar → Verificar**:

1. **Verificar**: Revisar si el plugin ya está instalado
2. **Agregar mercado**: Agregar el repositorio del plugin al mercado de plugins de Claude Code
3. **Instalar**: Ejecutar el comando de instalación
4. **Verificar**: Confirmar que el plugin está habilitado

El script de instalación automática de Factory (`cli/scripts/check-and-install-*.js`) ejecuta automáticamente estos pasos, pero necesitas conocer el método manual para manejar situaciones de fallo.

## Hazlo Conmigo

### Paso 1: Verificar el Estado de los Plugins

**Por qué**
Primero confirma si están instalados, para evitar operaciones repetidas.

Abre la terminal y ejecuta en el directorio raíz del proyecto:

```bash
claude plugin list
```

**Deberías ver**: Lista de plugins instalados, si incluye lo siguiente significa que están instalados:

```
✅ superpowers (enabled)
✅ ui-ux-pro-max (enabled)
```

Si no ves estos dos plugins, o muestra `disabled`, entonces necesitas continuar con los pasos siguientes.

::: info Instalación Automática de factory init
El comando `factory init` ejecuta automáticamente la verificación de instalación de plugins (líneas 360-392 de `init.js`). Si tiene éxito, verás:

```
📦 Installing superpowers plugin... ✓
📦 Installing ui-ux-pro-max-skill plugin... ✓
✅ Plugins installed!
```
:::

### Paso 2: Instalar el Plugin superpowers

**Por qué**
La fase Bootstrap necesita usar la skill `superpowers:brainstorm` para el brainstorming.

#### Agregar al Mercado de Plugins

```bash
claude plugin marketplace add obra/superpowers-marketplace
```

**Deberías ver**:

```
✅ Plugin marketplace added successfully
```

::: tip Fallo al Agregar al Mercado
Si indica "el mercado de plugins ya existe", puedes ignorarlo y continuar con el paso de instalación.
:::

#### Instalar el Plugin

```bash
claude plugin install superpowers@superpowers-marketplace
```

**Deberías ver**:

```
✅ Plugin installed successfully
```

#### Verificar la Instalación

```bash
claude plugin list
```

**Deberías ver**: La lista incluye `superpowers (enabled)`.

### Paso 3: Instalar el Plugin ui-ux-pro-max

**Por qué**
La fase UI necesita usar la skill `ui-ux-pro-max` para generar el sistema de diseño.

#### Agregar al Mercado de Plugins

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

**Deberías ver**:

```
✅ Plugin marketplace added successfully
```

#### Instalar el Plugin

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**Deberías ver**:

```
✅ Plugin installed successfully
```

#### Verificar la Instalación

```bash
claude plugin list
```

**Deberías ver**: La lista incluye `ui-ux-pro-max (enabled)`.

### Paso 4: Verificar que Ambos Plugins Funcionan Correctamente

**Por qué**
Asegurar que la línea de ensamblaje puede invocar las skills de estos dos plugins normalmente.

#### Verificar superpowers

Ejecuta en Claude Code:

```
Por favor, usa la skill superpowers:brainstorm para ayudarme a analizar la siguiente idea de producto: [tu idea]
```

**Deberías ver**: Claude comienza a usar la skill brainstorm, analizando sistemáticamente problemas, usuarios, valor e hipótesis.

#### Verificar ui-ux-pro-max

Ejecuta en Claude Code:

```
Por favor, usa la skill ui-ux-pro-max para diseñar un esquema de colores para mi aplicación
```

**Deberías ver**: Claude devuelve una sugerencia de esquema de colores profesional con múltiples opciones de diseño.

## Puntos de Verificación ✅

Después de completar los pasos anteriores, confirma lo siguiente:

- [ ] Ejecutar `claude plugin list` muestra ambos plugins marcados como `enabled`
- [ ] En Claude Code se puede invocar la skill `superpowers:brainstorm`
- [ ] En Claude Code se puede invocar la skill `ui-ux-pro-max`
- [ ] Al ejecutar `factory run` ya no indica que faltan plugins

## Advertencias de Problemas Comunes

### ❌ Plugin Instalado pero no Habilitado

**Síntoma**: `claude plugin list` muestra que el plugin existe pero sin la etiqueta `enabled`.

**Solución**: Vuelve a ejecutar el comando de instalación:

```bash
claude plugin install <ID del plugin>
```

### ❌ Permisos Bloqueados

**Síntoma**: Indica "Permission denied: Skill(superpowers:brainstorming)"

**Causa**: La configuración de permisos de Claude Code no incluye el permiso `Skill`.

**Solución**: Verifica si `.claude/settings.local.json` contiene:

```json
{
  "permissions": [
    "Skill(superpowers:brainstorming)",
    "Skill(ui-ux-pro-max)"
  ]
}
```

::: info Configuración Completa de Permisos
Este es un ejemplo de configuración mínima de permisos. El comando `init` de Factory generará automáticamente un archivo de configuración de permisos completo (incluyendo `Skill(superpowers:brainstorm)` y otros permisos necesarios), generalmente no necesitas editarlo manualmente.

Si necesitas regenerar la configuración de permisos, puedes ejecutar en el directorio raíz del proyecto:
```bash
factory init --force-permissions
```
:::

Consulta la [Guía de Integración de Claude Code](../claude-code/) para regenerar la configuración de permisos.

### ❌ Fallo al Agregar al Mercado

**Síntoma**: `claude plugin marketplace add` falla, indica "not found" o error de red.

**Solución**:

1. Verifica la conexión a Internet
2. Confirma que la versión de Claude CLI sea la última: `npm update -g @anthropic-ai/claude-code`
3. Intenta instalar directamente: omite agregar al mercado y ejecuta directamente `claude plugin install <ID del plugin>`

### ❌ Conflicto de Versiones de Plugin

**Síntoma**: Ya está instalado un plugin con el mismo nombre, pero la versión es incorrecta causando fallos en la línea de ensamblaje.

**Solución**:

```bash
# Desinstalar versión antigua
claude plugin uninstall <nombre del plugin>

# Reinstalar
claude plugin install <ID del plugin>
```

### ❌ Problemas de Rutas en Windows

**Síntoma**: Al ejecutar scripts en Windows indica "comando no encontrado".

**Solución**:

Ejecuta los scripts de instalación directamente con Node.js:

```bash
node cli/scripts/check-and-install-superpowers.js
node cli/scripts/check-and-install-ui-skill.js
```

## Qué Hacer si la Instalación Automática Falla

Si la instalación automática falla durante `factory init`, puedes:

1. **Ver mensajes de error**: La terminal mostrará la causa específica del fallo
2. **Instalación manual**: Sigue los pasos anteriores para instalar manualmente los dos plugins
3. **Volver a ejecutar**: `factory run` detectará el estado del plugin, si ya está instalado continuará con la línea de ensamblaje

::: warning No Afecta el Inicio de la Línea de Ensamblaje
Incluso si la instalación del plugin falla, `factory init` completará la inicialización. Puedes instalar los plugins manualmente más tarde, sin afectar operaciones posteriores.
:::

## Rol de los Plugins en la Línea de Ensamblaje

### Fase Bootstrap (superpowers requerido)

- **Invocación de skill**: `superpowers:brainstorm`
- **Salida**: `input/idea.md` - Documento de idea de producto estructurado
- **Punto de verificación**: Verificar si el Agent indicó explícitamente el uso de esta skill (`orchestrator.checkpoint.md:60-70`)

### Fase UI (ui-ux-pro-max requerido)

- **Invocación de skill**: `ui-ux-pro-max`
- **Salida**: `artifacts/ui/ui.schema.yaml` - UI Schema que incluye el sistema de diseño
- **Punto de verificación**: Verificar si la configuración del sistema de diseño proviene de esta skill (`orchestrator.checkpoint.md:72-84`)

## Resumen de Esta Lección

- Factory depende de dos plugins obligatorios: `superpowers` y `ui-ux-pro-max`
- `factory init` intenta instalar automáticamente, pero requiere manejo manual si falla
- Flujo de instalación de plugins: Verificar → Agregar al mercado → Instalar → Verificar
- Asegúrate de que ambos plugins estén en estado `enabled` y la configuración de permisos sea correcta
- Las fases Bootstrap y UI de la línea de ensamblaje verifican obligatoriamente el uso de estos dos plugins

## Próxima Lección

> En la próxima lección aprenderemos **[Visión General de la Línea de Ensamblaje de 7 Fases](../../start/pipeline-overview/)**.
>
> Aprenderás:
> - El flujo de ejecución completo de la línea de ensamblaje
> - Las entradas, salidas y responsabilidades de cada fase
> - Cómo el mecanismo de puntos de verificación asegura la calidad
> - Cómo recuperarse de una fase fallida

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-29

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Script de verificación del plugin Superpowers | [`cli/scripts/check-and-install-superpowers.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-superpowers.js) | 1-208 |
| Script de verificación del plugin UI/UX Pro Max | [`cli/scripts/check-and-install-ui-skill.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-ui-skill.js) | 1-209 |
| Lógica de instalación automática de plugins | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 360-392 |
| Verificación de skill en fase Bootstrap | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 60-70 |
| Verificación de skill en fase UI | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 72-84 |

**Constantes Clave**:
- `PLUGIN_NAME = 'superpowers'`: Nombre del plugin superpowers
- `PLUGIN_ID = 'superpowers@superpowers-marketplace'`: ID completo de superpowers
- `PLUGIN_MARKETPLACE = 'obra/superpowers-marketplace'`: Repositorio del mercado de plugins
- `UI_PLUGIN_NAME = 'ui-ux-pro-max'`: Nombre del plugin UI
- `UI_PLUGIN_ID = 'ui-ux-pro-max@ui-ux-pro-max-skill'`: ID completo del plugin UI
- `UI_PLUGIN_MARKETPLACE = 'nextlevelbuilder/ui-ux-pro-max-skill'`: Repositorio del mercado del plugin UI

**Funciones Clave**:
- `isPluginInstalled()`: Verifica si el plugin está instalado (mediante la salida de `claude plugin list`)
- `addToMarketplace()`: Agrega el plugin al mercado (`claude plugin marketplace add`)
- `installPlugin()`: Instala el plugin (`claude plugin install`)
- `verifyPlugin()`: Verifica que el plugin esté instalado y habilitado
- `main()`: Función principal, ejecuta el flujo completo de verificar → agregar → instalar → verificar

</details>
