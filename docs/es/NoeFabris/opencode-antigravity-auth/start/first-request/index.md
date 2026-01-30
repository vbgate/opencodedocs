---
title: "Primera Solicitud: Verificar la Instalación de Antigravity | opencode-antigravity-auth"
sidebarTitle: "Enviar la Primera Solicitud"
description: "Aprende a enviar tu primera solicitud a un modelo Antigravity para verificar que la autenticación OAuth y la configuración son correctas. Domina la selección de modelos, el uso del parámetro variant y la resolución de errores comunes."
subtitle: "Primera Solicitud: Verificar que la Instalación fue Exitosa"
tags:
  - "Verificación de Instalación"
  - "Solicitud de Modelo"
  - "Inicio Rápido"
prerequisite:
  - "start-quick-install"
order: 4
---

# Primera Solicitud: Verificar que la Instalación fue Exitosa

## Qué Aprenderás

- Enviar tu primera solicitud a un modelo Antigravity
- Entender el propósito de los parámetros `--model` y `--variant`
- Elegir el modelo y la configuración de pensamiento adecuados según tus necesidades
- Diagnosticar errores comunes en las solicitudes de modelos

## Tu Situación Actual

Acabas de instalar el plugin, completaste la autenticación OAuth y configuraste las definiciones de modelos, pero ahora no estás seguro de:
- ¿El plugin realmente funciona correctamente?
- ¿Qué modelo debería usar para empezar a probar?
- ¿Cómo se usa el parámetro `--variant`?
- Si la solicitud falla, ¿cómo sé qué paso salió mal?

## Cuándo Usar Este Tutorial

Utiliza el método de verificación de esta lección en los siguientes escenarios:
- **Después de la primera instalación** — Confirmar que la autenticación, configuración y modelos funcionan correctamente
- **Después de añadir una nueva cuenta** — Verificar que la nueva cuenta está disponible
- **Después de cambiar la configuración del modelo** — Confirmar que la nueva configuración del modelo es correcta
- **Antes de encontrar problemas** — Establecer una línea base para facilitar comparaciones posteriores

## 🎒 Preparación Antes de Comenzar

::: warning Verificación Previa

Antes de continuar, por favor confirma:

- ✅ Has completado la [Instalación Rápida](/es/NoeFabris/opencode-antigravity-auth/start/quick-install/)
- ✅ Has ejecutado `opencode auth login` para completar la autenticación OAuth
- ✅ Has añadido las definiciones de modelos en `~/.config/opencode/opencode.json`
- ✅ La terminal de OpenCode o CLI está disponible

:::

## Idea Principal

### Por Qué Necesitas Verificar Primero

El plugin involucra la colaboración de múltiples componentes:
1. **Autenticación OAuth** — Obtener el token de acceso
2. **Gestión de Cuentas** — Seleccionar una cuenta disponible
3. **Transformación de Solicitudes** — Convertir el formato de OpenCode al formato de Antigravity
4. **Respuesta en Streaming** — Procesar la respuesta SSE y convertirla de vuelta al formato de OpenCode

Enviar la primera solicitud te permite verificar que toda la cadena funciona correctamente. Si tiene éxito, significa que todos los componentes funcionan normalmente; si falla, puedes localizar el problema según el mensaje de error.

### La Relación entre Model y Variant

En el plugin Antigravity, **el modelo y el variant son dos conceptos independientes**:

| Concepto | Función | Ejemplo |
| --- | --- | --- |
| **Model (Modelo)** | Selecciona el modelo de IA específico | `antigravity-claude-sonnet-4-5-thinking` |
| **Variant (Variante)** | Configura el presupuesto o modo de pensamiento del modelo | `low` (pensamiento ligero), `max` (pensamiento máximo) |

::: info ¿Qué es el Presupuesto de Pensamiento?

El presupuesto de pensamiento (thinking budget) se refiere a la cantidad de tokens que el modelo puede usar para "pensar" antes de generar una respuesta. Un presupuesto más alto significa que el modelo tiene más tiempo para razonar, pero también aumenta el tiempo de respuesta y el costo.

- **Modelos Claude Thinking**: Se configura con `thinkingConfig.thinkingBudget` (unidad: tokens)
- **Modelos Gemini 3**: Se configura con `thinkingLevel` (niveles de cadena: minimal/low/medium/high)

:::

### Combinaciones Recomendadas para Principiantes

Combinaciones recomendadas de modelo y variant para diferentes necesidades:

| Necesidad | Modelo | Variant | Características |
| --- | --- | --- | --- |
| **Prueba rápida** | `antigravity-gemini-3-flash` | `minimal` | Respuesta más rápida, ideal para verificación |
| **Desarrollo diario** | `antigravity-claude-sonnet-4-5-thinking` | `low` | Equilibrio entre velocidad y calidad |
| **Razonamiento complejo** | `antigravity-claude-opus-4-5-thinking` | `max` | Máxima capacidad de razonamiento |
| **Tareas visuales** | `antigravity-gemini-3-pro` | `high` | Soporte multimodal (imágenes/PDF) |

## Vamos a Hacerlo

### Paso 1: Enviar la Solicitud de Prueba Más Simple

Primero usa el comando más simple para probar si la conexión básica funciona.

**Por qué**
Esta solicitud no usa la función de pensamiento, responde muy rápido y es ideal para verificar rápidamente la autenticación y el estado de la cuenta.

**Ejecuta el comando**

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5
```

**Deberías ver**

```
Hello! I'm Claude Sonnet 4.5, an AI assistant...
```

::: tip Señal de Éxito

Si ves la respuesta de la IA, significa que:
- ✅ La autenticación OAuth fue exitosa
- ✅ La cuenta tiene permisos de acceso
- ✅ La transformación de solicitudes funciona correctamente
- ✅ La respuesta en streaming se analiza correctamente

:::

### Paso 2: Usar un Modelo Thinking con Variant

Ahora prueba el flujo completo de pensamiento, incluyendo el parámetro variant.

**Por qué**
Los modelos Thinking requieren lógica adicional de transformación de solicitudes, esta es una de las funciones principales del plugin.

**Ejecuta el comando**

```bash
opencode run "Explica qué es un closure, usando una analogía simple" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**Deberías ver**

1. **Salida de pensamiento en streaming**: Verás que el modelo primero muestra el proceso de pensamiento (con la etiqueta `<thinking>`)
2. **Proceso de pensamiento**: El modelo analizará en detalle cómo organizar la respuesta
3. **Respuesta final**: Después de completar el pensamiento, muestra el contenido final

::: details Ver un ejemplo de respuesta completa

```
<thinking>
El usuario pregunta qué es un closure, necesito explicarlo con una analogía simple.

El concepto de closure:
1. Una función puede acceder a variables de su ámbito externo
2. Incluso después de que la función externa haya terminado de ejecutarse
3. Esta capacidad es como una "mochila"

Ideas para la analogía:
- Puedo usar la analogía de la "mochila"
- La función se lleva algunas variables cuando retorna
- Es como salir de casa con cosas de tu hogar en la mochila
</thinking>

Un closure es como una "mochila" de la función.

Cuando se crea una función, "empaca" las variables externas a las que puede acceder, como empacar las cosas que necesitas de casa antes de salir. Incluso cuando la función deja el lugar donde fue creada (la función externa termina de ejecutarse), todavía puede acceder a esas variables a través de esta "mochila".

Por ejemplo:
```javascript
function createCounter() {
  let count = 0;  // Esta variable se guarda en la "mochila"
  return function() {
    count++;  // Todavía puede acceder a la variable en la mochila
    return count;
  };
}
```
```

:::

**Punto de Control ✅**

- [ ] Viste el bloque `<thinking>` (si configuraste `keep_thinking: true`)
- [ ] El contenido de la respuesta es razonable y lógico
- [ ] El tiempo de respuesta está dentro de un rango aceptable (generalmente 2-10 segundos)

### Paso 3: Probar los Modelos Gemini 3

Prueba los diferentes niveles de pensamiento de Gemini 3 Pro.

**Por qué**
Gemini 3 usa `thinkingLevel` con niveles de cadena, esto verifica el soporte para diferentes familias de modelos.

**Ejecuta los comandos**

```bash
# Probar Gemini 3 Flash (respuesta rápida)
opencode run "Escribe un algoritmo de ordenamiento burbuja" --model=google/antigravity-gemini-3-flash --variant=low

# Probar Gemini 3 Pro (pensamiento profundo)
opencode run "Analiza la complejidad temporal del ordenamiento burbuja" --model=google/antigravity-gemini-3-pro --variant=high
```

**Deberías ver**

- El modelo Flash responde más rápido (ideal para tareas simples)
- El modelo Pro piensa más profundamente (ideal para análisis complejos)
- Ambos modelos funcionan correctamente

### Paso 4: Probar la Capacidad Multimodal (Opcional)

Si tu configuración de modelo soporta entrada de imágenes, puedes probar la funcionalidad multimodal.

**Por qué**
Antigravity soporta entrada de imágenes/PDF, esta es una función necesaria en muchos escenarios.

**Prepara una imagen de prueba**: Cualquier archivo de imagen (como `test.png`)

**Ejecuta el comando**

```bash
opencode run "Describe el contenido de esta imagen" --model=google/antigravity-gemini-3-pro --image=test.png
```

**Deberías ver**

- El modelo describe con precisión el contenido de la imagen
- La respuesta incluye resultados del análisis visual

## Punto de Control ✅

Después de completar las pruebas anteriores, confirma la siguiente lista:

| Elemento a Verificar | Resultado Esperado | Estado |
| --- | --- | --- |
| **Conexión básica** | La solicitud simple del Paso 1 fue exitosa | ☐ |
| **Modelo Thinking** | Viste el proceso de pensamiento en el Paso 2 | ☐ |
| **Modelos Gemini 3** | Ambos modelos funcionan en el Paso 3 | ☐ |
| **Parámetro Variant** | Diferentes variants producen diferentes resultados | ☐ |
| **Salida en streaming** | La respuesta se muestra en tiempo real, sin interrupciones | ☐ |

::: tip ¿Todo Pasó?

Si todos los elementos de verificación pasaron, ¡felicidades! El plugin está completamente configurado y listo para usar.

Próximos pasos:
- [Explorar los modelos disponibles](/es/NoeFabris/opencode-antigravity-auth/platforms/available-models/)
- [Configurar balanceo de carga con múltiples cuentas](/es/NoeFabris/opencode-antigravity-auth/advanced/multi-account-setup/)
- [Habilitar Google Search](/es/NoeFabris/opencode-antigravity-auth/platforms/google-search-grounding/)

:::

## Advertencias de Errores Comunes

### Error 1: `Model not found`

**Mensaje de error**
```
Error: Model 'antigravity-claude-sonnet-4-5' not found
```

**Causa**
La definición del modelo no se añadió correctamente a `provider.google.models` en `opencode.json`.

**Solución**

Verifica el archivo de configuración:

```bash
cat ~/.config/opencode/opencode.json | grep -A 10 "models"
```

Confirma que el formato de la definición del modelo es correcto:

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: warning Atención a la Ortografía

El nombre del modelo debe coincidir exactamente con la clave en el archivo de configuración (distingue mayúsculas y minúsculas):

- ❌ Incorrecto: `--model=google/claude-sonnet-4-5`
- ✅ Correcto: `--model=google/antigravity-claude-sonnet-4-5`

:::

### Error 2: `403 Permission Denied`

**Mensaje de error**
```
403 Permission denied on resource '//cloudaicompanion.googleapis.com/...'
```

**Causa**
1. La autenticación OAuth no se completó
2. La cuenta no tiene permisos de acceso
3. Problema de configuración del Project ID (para modelos Gemini CLI)

**Solución**

1. **Verifica el estado de autenticación**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   Deberías ver al menos un registro de cuenta.

2. **Si la cuenta está vacía o la autenticación falló**:
   ```bash
   rm ~/.config/opencode/antigravity-accounts.json
   opencode auth login
   ```

3. **Si es un error de modelo Gemini CLI**:
   Necesitas configurar manualmente el Project ID (consulta [FAQ - 403 Permission Denied](/es/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/))

### Error 3: `Invalid variant 'max'`

**Mensaje de error**
```
Error: Invalid variant 'max' for model 'antigravity-gemini-3-pro'
```

**Causa**
Diferentes modelos soportan diferentes formatos de configuración de variant.

**Solución**

Verifica la definición de variant en la configuración del modelo:

| Tipo de Modelo | Formato de Variant | Valor de Ejemplo |
| --- | --- | --- |
| **Claude Thinking** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 32768 } }` |
| **Gemini 3** | `thinkingLevel` | `{ "thinkingLevel": "high" }` |
| **Gemini 2.5** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 8192 } }` |

**Ejemplo de configuración correcta**:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  },
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro",
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

### Error 4: Tiempo de Espera Agotado o Sin Respuesta

**Síntoma**
Después de ejecutar el comando, no hay salida durante mucho tiempo, o finalmente se agota el tiempo de espera.

**Posibles causas**
1. Problema de conexión de red
2. El servidor responde lentamente
3. Todas las cuentas están en estado de límite de velocidad

**Solución**

1. **Verifica la conexión de red**:
   ```bash
   ping cloudaicompanion.googleapis.com
   ```

2. **Revisa los logs de depuración**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=1 opencode run "test" --model=google/antigravity-claude-sonnet-4-5
   ```

3. **Verifica el estado de las cuentas**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   Si ves que todas las cuentas tienen una marca de tiempo `rateLimit`, significa que todas están limitadas y necesitas esperar a que se reinicie.

### Error 5: Interrupción de la Salida en Streaming SSE

**Síntoma**
La respuesta se detiene a mitad de camino, o solo ves contenido parcial.

**Posibles causas**
1. Red inestable
2. El token de la cuenta expiró durante la solicitud
3. Error del servidor

**Solución**

1. **Habilita los logs de depuración para ver información detallada**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "test"
   ```

2. **Revisa el archivo de log**:
   ```bash
   tail -f ~/.config/opencode/antigravity-logs/latest.log
   ```

3. **Si las interrupciones son frecuentes**:
   - Intenta cambiar a un entorno de red más estable
   - Usa un modelo sin Thinking para reducir el tiempo de solicitud
   - Verifica si la cuenta está cerca del límite de cuota

## Resumen de Esta Lección

Enviar la primera solicitud es el paso clave para verificar que la instalación fue exitosa. En esta lección aprendiste:

- **Solicitud básica**: Usar `opencode run --model` para enviar solicitudes
- **Uso de Variant**: Configurar el presupuesto de pensamiento con `--variant`
- **Selección de modelo**: Elegir modelos Claude o Gemini según tus necesidades
- **Resolución de problemas**: Localizar y resolver problemas según los mensajes de error

::: tip Práctica Recomendada

En el desarrollo diario:

1. **Comienza con pruebas simples**: Después de cada cambio de configuración, primero envía una solicitud simple para verificar
2. **Aumenta la complejidad gradualmente**: De sin thinking → low thinking → max thinking
3. **Registra la línea base de respuesta**: Recuerda el tiempo de respuesta en condiciones normales para facilitar comparaciones
4. **Usa los logs de depuración**: Cuando encuentres problemas, habilita `OPENCODE_ANTIGRAVITY_DEBUG=2`

---

## Avance de la Siguiente Lección

> En la siguiente lección aprenderemos **[Vista General de Modelos Disponibles](/es/NoeFabris/opencode-antigravity-auth/platforms/available-models/)**.
>
> Aprenderás:
> - Lista completa de todos los modelos disponibles y sus características
> - Guía de selección entre modelos Claude y Gemini
> - Comparación de límites de contexto y salida
> - Mejores escenarios de uso para modelos Thinking

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Entrada de transformación de solicitudes | [`src/plugin/request.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts) | 1-100 |
| Selección de cuenta y gestión de tokens | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-50 |
| Transformación de modelos Claude | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | Completo |
| Transformación de modelos Gemini | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | Completo |
| Procesamiento de respuesta en streaming | [`src/plugin/core/streaming/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/core/streaming/index.ts) | Completo |
| Sistema de logs de depuración | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | Completo |

**Funciones clave**:
- `prepareAntigravityRequest()`: Convierte la solicitud de OpenCode al formato de Antigravity (`request.ts`)
- `createStreamingTransformer()`: Crea el transformador de respuesta en streaming (`core/streaming/`)
- `resolveModelWithVariant()`: Resuelve la configuración del modelo y variant (`transform/model-resolver.ts`)
- `getCurrentOrNextForFamily()`: Selecciona la cuenta para la solicitud (`accounts.ts`)

**Ejemplos de configuración**:
- Formato de configuración de modelos: [`README.md#models`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L110)
- Descripción detallada de Variants: [`docs/MODEL-VARIANTS.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MODEL-VARIANTS.md)

</details>
