---
title: "Preguntas Frecuentes: Solución de Problemas | opencode-dcp"
sidebarTitle: "¿Qué hacer si tienes problemas?"
subtitle: "Preguntas frecuentes y solución de problemas"
description: "Aprende a resolver problemas comunes en el uso de OpenCode DCP, incluida la corrección de errores de configuración, la habilitación de métodos de depuración, las razones por las que los Token no se reducen y otras técnicas de solución de problemas."
tags:
  - "FAQ"
  - "solución de problemas"
  - "configuración"
  - "depuración"
prerequisite:
  - "start-getting-started"
order: 1
---

# Preguntas frecuentes y solución de problemas

## Problemas relacionados con la configuración

### ¿Por qué mi configuración no surte efecto?

Los archivos de configuración de DCP se fusionan por prioridad: **valores predeterminados < global < variables de entorno < proyecto**. La configuración a nivel de proyecto tiene la prioridad más alta.

**Pasos de verificación**:

1. **Confirmar la ubicación del archivo de configuración**:
   ```bash
   # macOS/Linux
   ls -la ~/.config/opencode/dcp.jsonc
   ls -la ~/.config/opencode/dcp.json

   # O en el directorio raíz del proyecto
   ls -la .opencode/dcp.jsonc
   ```

2. **Verificar la configuración aplicada**:
   Después de habilitar el modo de depuración, DCP generará la información de configuración en el archivo de registro al cargar la configuración por primera vez.

3. **Reiniciar OpenCode**:
   Después de modificar la configuración, es necesario reiniciar OpenCode para que surta efecto.

::: tip Prioridad de configuración
Si tienes múltiples archivos de configuración, la configuración a nivel de proyecto (`.opencode/dcp.jsonc`) sobrescribirá la configuración global.
:::

### ¿Qué hacer si el archivo de configuración tiene errores?

DCP mostrará una advertencia Toast cuando detecte errores de configuración (se mostrará después de 7 segundos) y degradará al uso de valores predeterminados.

**Tipos de errores comunes**:

| Tipo de error | Descripción del problema | Método de solución |
|--- | --- | ---|
| Error de tipo | `pruneNotification` debe ser `"off" | "minimal" | "detailed"` | Verificar la ortografía de valores de enumeración |
| Error de matriz | `protectedFilePatterns` debe ser una matriz de cadenas | Asegurarse de usar el formato `["patrón1", "patrón2"]` |
| Clave desconocida | El archivo de configuración contiene claves no admitidas | Eliminar o comentar las claves desconocidas |

**Habilitar registro de depuración para ver errores detallados**:

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true  // Habilitar registro de depuración
}
```

Ubicación del archivo de registro: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`

---

## Problemas relacionados con la funcionalidad

### ¿Por qué el uso de Token no se reduce?

DCP solo poda el contenido de **llamadas a herramientas**, si tu conversación no utiliza herramientas, o todas las herramientas utilizadas están protegidas, los Token no se reducirán.

**Posibles causas**:

1. **Herramientas protegidas**
   Las herramientas protegidas por defecto incluyen: `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

2. **Protección de turnos no ha expirado**
   Si `turnProtection` está habilitado, las herramientas no serán podadas durante el período de protección.

3. **No hay contenido duplicado o podable en la conversación**
   La estrategia automática de DCP solo se aplica a:
   - Llamadas a herramientas duplicadas (deduplicación)
   - Operaciones de escritura sobrescritas por lecturas (sobrescritura)
   - Entradas de herramientas erróneas expiradas (limpieza de errores)

**Método de verificación**:

```bash
# Ingresa en OpenCode
/dcp context
```

Verifica el campo `Pruned` en la salida para conocer el número de herramientas podadas y los Token ahorrados.

::: info Poda manual
Si la estrategia automática no se activa, puedes usar `/dcp sweep` para podar herramientas manualmente.
:::

### ¿Por qué las sesiones de subagentes no se podan?

**Este es el comportamiento esperado**. DCP está completamente deshabilitado en sesiones de subagentes.

**Razón**: El objetivo de diseño de los subagentes es devolver un resumen de descubrimientos conciso, no optimizar el uso de Token. La poda de DCP podría interferir con el comportamiento de resumen de los subagentes.

**Cómo juzgar si es una sesión de subagente**:
- Verifica el campo `parentID` en los metadatos de la sesión
- Después de habilitar el registro de depuración, verás una marca `isSubAgent: true`

---

## Depuración y registros

### ¿Cómo habilitar el registro de depuración?

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true
}
```

**Ubicación de los archivos de registro**:
- **Registro diario**: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`
- **Instantáneas de contexto**: `~/.config/opencode/logs/dcp/context/{sessionId}/{timestamp}.json`

::: warning Impacto en el rendimiento
Los registros de depuración escribirán en archivos de disco, lo que puede afectar el rendimiento. Se recomienda deshabilitarlos en producción.
:::

### ¿Cómo ver la distribución de Token de la sesión actual?

```bash
# Ingresa en OpenCode
/dcp context
```

**Ejemplo de salida**:

```
╭───────────────────────────────────────────────────────────╮
│                  Análisis de Contexto DCP                  │
╰───────────────────────────────────────────────────────────╯

Desglose de Contexto de Sesión:
────────────────────────────────────────────────────────────

Sistema         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
Usuario           5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Asistente        35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Herramientas (45)     43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Resumen:
  Podadas:          12 herramientas (~15.2K tokens)
  Contexto actual: ~165.3K tokens
  Sin DCP:          ~180.5K tokens
```

### ¿Cómo ver las estadísticas acumuladas de poda?

```bash
# Ingresa en OpenCode
/dcp stats
```

Esto mostrará el número acumulado de Token podados de todas las sesiones históricas.

---

## Relacionado con Prompt Caching

### ¿DCP afecta a Prompt Caching?

**Sí**, pero después de sopesar, generalmente hay beneficios positivos.

Los proveedores de LLM (como Anthropic, OpenAI) almacenan en caché los prompts basándose en **coincidencia de prefijo exacta**. Cuando DCP poda la salida de herramientas, cambia el contenido del mensaje, la caché falla desde ese punto hacia adelante.

**Resultados de pruebas reales**:
- Sin DCP: tasa de aciertos de caché aproximadamente 85%
- Con DCP habilitado: tasa de aciertos de caché aproximadamente 65%

**Pero el ahorro de Token generalmente excede la pérdida de caché**, especialmente en conversaciones largas.

**Mejores escenarios de uso**:
- Al usar servicios con facturación por solicitud (como GitHub Copilot, Google Antigravity), la pérdida de caché no tiene un impacto negativo

---

## Configuración avanzada

### ¿Cómo proteger archivos específicos de la poda?

Use patrones glob con `protectedFilePatterns`:

```jsonc
{
    "protectedFilePatterns": [
        "src/config/*",     // Proteger el directorio config
        "*.env",           // Proteger todos los archivos .env
        "**/secrets/**"    // Proteger el directorio secrets
    ]
}
```

Los patrones coinciden con el campo `filePath` en los argumentos de herramientas (como herramientas `read`, `write`, `edit`).

### ¿Cómo personalizar las herramientas protegidas?

Cada estrategia y configuración de herramientas tiene una matriz `protectedTools`:

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_tool"]  // Herramientas adicionales protegidas
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["another_tool"]
        }
    },
    "commands": {
        "protectedTools": ["sweep_protected"]
    }
}
```

Estas configuraciones se **acumulan** a la lista predeterminada de herramientas protegidas.

---

## Escenarios de errores comunes

### Error: DCP no se cargó

**Posibles causas**:
1. El plugin no está registrado en `opencode.jsonc`
2. Falló la instalación del plugin
3. Versión de OpenCode incompatible

**Método de solución**:
1. Verificar que `opencode.jsonc` contenga `"plugin": ["@tarquinen/opencode-dcp@latest"]`
2. Reiniciar OpenCode
3. Verificar el archivo de registro para confirmar el estado de carga

### Error: Archivo de configuración JSON inválido

**Posibles causas**:
- Falta de comas
- Comas extra
- Cadenas sin comillas dobles
- Formato de comentarios JSONC incorrecto

**Método de solución**:
Usa un editor que admita JSONC (como VS Code) para editar, o usa herramientas de validación JSON en línea para verificar la sintaxis.

### Error: comando /dcp no responde

**Posibles causas**:
- `commands.enabled` establecido en `false`
- El plugin no se cargó correctamente

**Método de solución**:
1. Verificar que `"commands.enabled"` en el archivo de configuración sea `true`
2. Confirmar que el plugin se haya cargado (verificar el registro)

---

## Obtener ayuda

Si los métodos anteriores no resuelven el problema:

1. **Habilitar el registro de depuración** y reproducir el problema
2. **Ver las instantáneas de contexto**: `~/.config/opencode/logs/dcp/context/{sessionId}/`
3. **Enviar un Issue en GitHub**:
   - Adjuntar archivos de registro (eliminar información sensible)
   - Describir los pasos para reproducir
   - Explicar el comportamiento esperado y el comportamiento real

---

## Próxima lección

> En la próxima lección aprenderemos **[Prácticas recomendadas de DCP](../best-practices/)**.
>
> Aprenderás:
> - La relación de equilibrio entre Prompt Caching y ahorro de Token
> - Reglas de prioridad de configuración y estrategias de uso
> - Selección y configuración de mecanismos de protección
> - Consejos de uso de comandos y sugerencias de optimización

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad        | Ruta del archivo                                                                                      | Número de línea        |
|--- | --- | ---|
| Validación de configuración     | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375)  | 147-375    |
| Manejo de errores de configuración | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L391-421)  | 391-421    |
| Sistema de registro     | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L6-109)      | 6-109      |
| Instantáneas de contexto   | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L196-210)    | 196-210    |
| Detección de subagentes   | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8)      | 1-8        |
| Herramientas protegidas   | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79)   | 68-79      |

**Funciones clave**:
- `validateConfigTypes()`: Valida los tipos de elementos de configuración
- `getInvalidConfigKeys()`: Detecta claves desconocidas en el archivo de configuración
- `Logger.saveContext()`: Guarda instantáneas de contexto para depuración
- `isSubAgentSession()`: Detecta sesiones de subagentes

</details>
