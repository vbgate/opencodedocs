---
title: "Configuración: Sistema Multinivel de DCP | opencode-dcp"
sidebarTitle: "Personalizar DCP"
subtitle: "Configuración: Sistema Multinivel de DCP"
description: "Aprende el sistema de configuración multinivel de opencode-dcp. Domina las reglas de prioridad entre configuraciones globales, de entorno y de proyecto, estrategias de poda, mecanismos de protección y niveles de notificación."
tags:
  - "Configuración"
  - "DCP"
  - "Configuración de plugins"
prerequisite:
  - "start-getting-started"
order: 2
---

# Guía Completa de Configuración de DCP

## Lo que aprenderás

- Dominar el sistema de configuración de tres niveles de DCP (global, proyecto, variables de entorno)
- Entender las reglas de prioridad de configuración y saber cuál configuración prevalece
- Ajustar estrategias de poda y mecanismos de protección según tus necesidades
- Configurar niveles de notificación para controlar el detalle de los mensajes de poda

## Tu situación actual

DCP funciona con la configuración predeterminada después de la instalación, pero podrías enfrentar estos problemas:

- Quieres establecer diferentes estrategias de poda para distintos proyectos
- No deseas que ciertos archivos sean podados
- Las notificaciones de poda son demasiado frecuentes o detalladas
- Quieres desactivar alguna estrategia de poda automática

Es entonces cuando necesitas conocer el sistema de configuración de DCP.

## Cuándo usar esto

- **Personalización por proyecto**: Diferentes proyectos tienen diferentes necesidades de poda
- **Depuración de problemas**: Activar logs de debug para localizar problemas
- **Optimización de rendimiento**: Ajustar interruptores de estrategias y umbrales
- **Experiencia personalizada**: Modificar niveles de notificación, proteger herramientas críticas

## Concepto central

DCP utiliza un **sistema de configuración de tres niveles**, ordenados de menor a mayor prioridad:

```
Valores predeterminados (hardcoded) → Configuración global → Variables de entorno → Configuración de proyecto
          Prioridad más baja                                              Prioridad más alta
```

Cada nivel de configuración sobrescribe las opciones del mismo nombre del nivel anterior, por lo que la configuración de proyecto tiene la prioridad más alta.

::: info ¿Por qué se necesita configuración multinivel?

El propósito de este diseño es:
- **Configuración global**: Establecer comportamientos predeterminados comunes, aplicables a todos los proyectos
- **Configuración de proyecto**: Personalizar para proyectos específicos sin afectar otros proyectos
- **Variables de entorno**: Cambiar rápidamente la configuración en diferentes entornos (como CI/CD)

:::

## 🎒 Antes de empezar

Asegúrate de haber completado [Instalación y Inicio Rápido](../getting-started/), con el plugin DCP instalado correctamente y funcionando en OpenCode.

## Sigue los pasos

### Paso 1: Ver la configuración actual

**Por qué**
Primero conoce la configuración predeterminada, luego decide cómo ajustarla.

DCP crea automáticamente el archivo de configuración global en su primera ejecución.

```bash
# macOS/Linux
cat ~/.config/opencode/dcp.jsonc

# Windows PowerShell
Get-Content "$env:USERPROFILE\.config\opencode\dcp.jsonc"
```

**Deberías ver**: Una configuración predeterminada similar a esta

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    "enabled": true,
    "debug": false,
    "pruneNotification": "detailed",
    "commands": {
        "enabled": true,
        "protectedTools": []
    },
    "turnProtection": {
        "enabled": false,
        "turns": 4
    },
    "protectedFilePatterns": [],
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 10,
            "protectedTools": []
        },
        "discard": {
            "enabled": true
        },
        "extract": {
            "enabled": true,
            "showDistillation": false
        }
    },
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": []
        },
        "supersedeWrites": {
            "enabled": false
        },
        "purgeErrors": {
            "enabled": true,
            "turns": 4,
            "protectedTools": []
        }
    }
}
```

### Paso 2: Entender las ubicaciones de los archivos de configuración

DCP soporta archivos de configuración en tres niveles:

| Nivel | Ruta | Prioridad | Caso de uso |
| --- | --- | --- | --- |
| **Global** | `~/.config/opencode/dcp.jsonc` o `dcp.json` | 2 | Configuración predeterminada para todos los proyectos |
| **Variable de entorno** | `$OPENCODE_CONFIG_DIR/dcp.jsonc` o `dcp.json` | 3 | Configuración para entornos específicos |
| **Proyecto** | `<proyecto>/.opencode/dcp.jsonc` o `dcp.json` | 4 | Sobrescritura de configuración para un proyecto individual |

::: tip Formato del archivo de configuración

DCP soporta dos formatos: `.json` y `.jsonc`:
- `.json`: Formato JSON estándar, no permite comentarios
- `.jsonc`: Formato JSON con soporte para comentarios `//` (recomendado)

:::

### Paso 3: Configurar notificaciones de poda

**Por qué**
Controlar el nivel de detalle de las notificaciones de poda de DCP para evitar interrupciones excesivas.

Edita el archivo de configuración global:

```jsonc
{
    "pruneNotification": "detailed"  // Valores posibles: "off", "minimal", "detailed"
}
```

**Descripción de niveles de notificación**:

| Nivel | Comportamiento | Caso de uso |
| --- | --- | --- |
| **off** | No mostrar notificaciones de poda | Desarrollo enfocado, sin necesidad de feedback |
| **minimal** | Solo mostrar estadísticas resumidas (tokens ahorrados) | Necesitas feedback simple sin demasiada información |
| **detailed** | Mostrar información detallada de poda (nombre de herramienta, razón) | Entender el comportamiento de poda, depurar configuración |

**Deberías ver**: Después de modificar la configuración, la próxima vez que se active la poda, las notificaciones se mostrarán según el nuevo nivel.

### Paso 4: Configurar estrategias de poda automática

**Por qué**
DCP ofrece tres estrategias de poda automática que puedes activar o desactivar según tus necesidades.

Edita el archivo de configuración:

```jsonc
{
    "strategies": {
        // Estrategia de deduplicación: elimina llamadas de herramientas duplicadas
        "deduplication": {
            "enabled": true,           // Activar/desactivar
            "protectedTools": []         // Herramientas adicionales a proteger
        },

        // Estrategia de sobrescritura: limpia operaciones de escritura que han sido sobrescritas por lecturas
        "supersedeWrites": {
            "enabled": false          // Desactivado por defecto
        },

        // Estrategia de limpieza de errores: limpia entradas de herramientas con errores antiguos
        "purgeErrors": {
            "enabled": true,           // Activar/desactivar
            "turns": 4,               // Después de cuántos turnos limpiar errores
            "protectedTools": []         // Herramientas adicionales a proteger
        }
    }
}
```

**Explicación de estrategias**:

- **deduplication (deduplicación)**: Activada por defecto. Detecta llamadas con la misma herramienta y parámetros, conservando solo la más reciente.
- **supersedeWrites (sobrescritura de escrituras)**: Desactivada por defecto. Si una operación de escritura tiene una lectura posterior, limpia la entrada de esa escritura.
- **purgeErrors (limpieza de errores)**: Activada por defecto. Las herramientas con errores que superen el número de turnos especificado serán podadas (conservando solo el mensaje de error, eliminando los parámetros de entrada potencialmente grandes).

### Paso 5: Configurar mecanismos de protección

**Por qué**
Evitar la poda accidental de contenido crítico (como archivos importantes, herramientas esenciales).

DCP ofrece tres mecanismos de protección:

#### 1. Protección por turnos (Turn Protection)

Protege las salidas de herramientas de los turnos más recientes, dando a la IA tiempo suficiente para referenciarlas.

```jsonc
{
    "turnProtection": {
        "enabled": false,   // Al activar, protege los últimos 4 turnos
        "turns": 4          // Número de turnos a proteger
    }
}
```

**Caso de uso**: Cuando notes que la IA pierde contexto frecuentemente, puedes activar esta opción.

#### 2. Herramientas protegidas (Protected Tools)

Ciertas herramientas nunca serán podadas por defecto:

```
task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
```

Puedes agregar herramientas adicionales que necesites proteger:

```jsonc
{
    "tools": {
        "settings": {
            "protectedTools": [
                "myCustomTool",   // Agregar herramienta personalizada
                "databaseQuery"    // Agregar herramienta que necesita protección
            ]
        }
    },
    "strategies": {
        "deduplication": {
            "protectedTools": ["databaseQuery"]  // Proteger herramienta para estrategia específica
        }
    }
}
```

#### 3. Patrones de archivos protegidos (Protected File Patterns)

Usa patrones glob para proteger archivos específicos:

```jsonc
{
    "protectedFilePatterns": [
        "**/*.config.ts",           // Proteger todos los archivos .config.ts
        "**/secrets/**",           // Proteger todos los archivos en el directorio secrets
        "**/*.env",                // Proteger archivos de variables de entorno
        "**/critical/*.json"        // Proteger archivos JSON en el directorio critical
    ]
}
```

::: warning Nota
protectedFilePatterns coincide con `tool.parameters.filePath`, no con la ruta real del archivo. Esto significa que solo aplica a herramientas que tienen el parámetro `filePath` (como read, write, edit).

:::

### Paso 6: Crear configuración a nivel de proyecto

**Por qué**
Diferentes proyectos pueden necesitar diferentes estrategias de poda.

Crea el directorio `.opencode` en la raíz del proyecto (si no existe), luego crea `dcp.jsonc`:

```bash
# Ejecutar en la raíz del proyecto
mkdir -p .opencode
cat > .opencode/dcp.jsonc << 'EOF'
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    // Configuración específica para este proyecto
    "strategies": {
        "supersedeWrites": {
            "enabled": true   // Activar estrategia de sobrescritura para este proyecto
        }
    },
    "protectedFilePatterns": [
        "**/config/**/*.ts"   // Proteger archivos de configuración de este proyecto
    ]
}
EOF
```

**Deberías ver**:
- La configuración de proyecto sobrescribe las opciones del mismo nombre de la configuración global
- Las opciones no sobrescritas continúan usando la configuración global

### Paso 7: Activar logs de depuración

**Por qué**
Cuando encuentres problemas, revisa los logs detallados de depuración.

Edita el archivo de configuración:

```jsonc
{
    "debug": true
}
```

**Ubicación de logs**:
```
~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log
```

**Deberías ver**: El archivo de log contiene información detallada sobre operaciones de poda, carga de configuración, etc.

::: info Recomendación para producción
Después de depurar, recuerda cambiar `debug` de vuelta a `false` para evitar que los archivos de log crezcan demasiado rápido.

:::

## Punto de verificación ✅

Después de completar los pasos anteriores, confirma lo siguiente:

- [ ] Conoces los tres niveles de archivos de configuración y sus prioridades
- [ ] Puedes modificar el nivel de notificación y ver el efecto
- [ ] Entiendes la función de las tres estrategias de poda automática
- [ ] Sabes configurar mecanismos de protección (turnos, herramientas, archivos)
- [ ] Puedes crear configuración de proyecto para sobrescribir la configuración global

## Errores comunes

### Los cambios de configuración no surten efecto

**Problema**: Después de modificar el archivo de configuración, OpenCode no reacciona.

**Causa**: OpenCode no recarga automáticamente los archivos de configuración.

**Solución**: Después de modificar la configuración, necesitas **reiniciar OpenCode**.

### Error de sintaxis en el archivo de configuración

**Problema**: El archivo de configuración tiene errores de sintaxis, DCP no puede analizarlo.

**Síntoma**: OpenCode muestra una advertencia Toast "Invalid config".

**Solución**: Verifica la sintaxis JSON, especialmente:
- Si las comillas, comas y corchetes coinciden
- Si hay comas extra (como una coma después del último elemento)
- Los valores booleanos usan `true`/`false`, no uses comillas

**Práctica recomendada**: Usa un editor con soporte JSONC (como VS Code + plugin JSONC).

### Las herramientas protegidas no funcionan

**Problema**: Agregaste `protectedTools`, pero la herramienta sigue siendo podada.

**Causas**:
1. Error de ortografía en el nombre de la herramienta
2. Agregaste al array `protectedTools` incorrecto (por ejemplo, `tools.settings.protectedTools` vs `strategies.deduplication.protectedTools`)
3. La llamada de herramienta está dentro del período de protección por turnos (si está activada)

**Solución**:
1. Confirma que el nombre de la herramienta esté escrito correctamente
2. Verifica que lo hayas agregado en la ubicación correcta
3. Revisa los logs de debug para entender la razón de la poda

## Resumen de la lección

Puntos clave del sistema de configuración de DCP:

- **Tres niveles de configuración**: Valores predeterminados → Global → Variables de entorno → Proyecto, prioridad ascendente
- **Sobrescritura flexible**: La configuración de proyecto puede sobrescribir la configuración global
- **Mecanismos de protección**: Protección por turnos, herramientas protegidas, patrones de archivos protegidos, para evitar poda accidental
- **Estrategias automáticas**: Deduplicación, sobrescritura de escrituras, limpieza de errores, actívalas según necesites
- **Reinicio para aplicar**: Después de modificar la configuración, recuerda reiniciar OpenCode

## Próxima lección

> En la próxima lección aprenderemos **[Estrategias de Poda Automática en Detalle](../../platforms/auto-pruning/)**.
>
> Aprenderás:
> - Cómo la estrategia de deduplicación detecta llamadas de herramientas duplicadas
> - El principio de funcionamiento de la estrategia de sobrescritura de escrituras
> - Las condiciones de activación de la estrategia de limpieza de errores
> - Cómo monitorear el efecto de las estrategias

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Núcleo de gestión de configuración | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 1-798 |
| Schema de configuración | [`dcp.schema.json`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/dcp.schema.json) | 1-232 |
| Configuración predeterminada | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L423-L464) | 423-464 |
| Prioridad de configuración | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| Validación de configuración | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-L375) | 147-375 |
| Rutas de archivos de configuración | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L484-L526) | 484-526 |
| Herramientas protegidas por defecto | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-L79) | 68-79 |
| Fusión de configuración de estrategias | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L565-L595) | 565-595 |
| Fusión de configuración de herramientas | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L597-L622) | 597-622 |

**Constantes clave**:
- `DEFAULT_PROTECTED_TOOLS`: Lista de nombres de herramientas protegidas por defecto (`lib/config.ts:68-79`)

**Funciones clave**:
- `getConfig()`: Carga y fusiona configuraciones de todos los niveles (`lib/config.ts:669-797`)
- `getInvalidConfigKeys()`: Valida claves inválidas en el archivo de configuración (`lib/config.ts:135-138`)
- `validateConfigTypes()`: Valida los tipos de valores de configuración (`lib/config.ts:147-375`)
- `getConfigPaths()`: Obtiene las rutas de todos los archivos de configuración (`lib/config.ts:484-526`)

</details>
