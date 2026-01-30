---
title: "Configuración de Modelos Thinking | opencode-antigravity-auth"
sidebarTitle: "Hacer que la IA Piense Profundamente"
subtitle: "Modelos Thinking: Capacidades de Razonamiento de Claude y Gemini 3"
description: "Aprende a configurar los modelos Thinking de Claude y Gemini 3. Domina thinking budget, thinking level y configuración de variantes."
tags:
  - "Modelos Thinking"
  - "Claude Opus 4.5"
  - "Claude Sonnet 4.5"
  - "Gemini 3 Pro"
  - "Gemini 3 Flash"
  - "Configuración de variantes"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 4
---

# Modelos Thinking: Capacidades de Razonamiento de Claude y Gemini 3

## Lo que Podrás Hacer al Terminar

- Configurar el thinking budget de los modelos Thinking de Claude Opus 4.5 y Sonnet 4.5
- Usar thinking level (minimal/low/medium/high) de Gemini 3 Pro/Flash
- Ajustar la intensidad de razonamiento de forma flexible con el sistema de variantes de OpenCode
- Entender interleaved thinking (mecanismo de razonamiento durante llamadas a herramientas)
- Dominar la estrategia de retención de bloques de thinking (configuración keep_thinking)

## Tu Dilema Actual

Quieres que los modelos de IA funcionen mejor en tareas complejas, como el razonamiento de múltiples pasos, la depuración de código o el diseño de arquitectura. Pero sabes que:

- Los modelos normales responden demasiado rápido, sin pensar con suficiente profundidad
- Claude limita oficialmente la función thinking, siendo difícil acceder a ella
- La configuración de thinking level de Gemini 3 no está clara
- No está claro cuánto thinking es suficiente (cuánto debería ser el budget)
- Al leer el contenido de los bloques de thinking encuentras errores de firma

## Cuándo Usar Esta Técnica

**Escenarios aplicables**:
- Problemas complejos que requieren razonamiento de múltiples pasos (diseño de algoritmos, arquitectura de sistemas)
- Revisión de código o depuración que requiere pensamiento cuidadoso
- Documentos largos o bases de código que requieren análisis profundo
- Tareas intensivas en llamadas a herramientas (requiere interleaved thinking)

**Escenarios no aplicables**:
- Preguntas y respuestas simples (desperdicia cuota de thinking)
- Validación rápida de prototipos (la velocidad es prioridad)
- Consultas de hechos (no requieren razonamiento)

## 🎒 Preparativos Antes de Empezar

::: warning Verificación previa

 1. **Instalación del complemento y autenticación completadas**: Consulta [Instalación Rápida](../../start/quick-install/) y [Primera Autenticación](../../start/first-auth-login/)
 2. **Conocimiento básico del uso de modelos**: Consulta [Primera Solicitud](../../start/first-request/)
3. **Tener modelos Thinking disponibles**: Asegúrate de que tu cuenta tenga permiso para acceder a Claude Opus 4.5/Sonnet 4.5 Thinking o Gemini 3 Pro/Flash

:::

---

## Idea Central

### Qué Son los Modelos Thinking

Los **modelos Thinking** realizan razonamiento interno (thinking blocks) antes de generar la respuesta final. Este contenido de pensamiento:

- **No se cobra**: Los tokens de thinking no se cuentan en la cuota de salida estándar (las reglas de facturación específicas están sujetas a la política oficial de Antigravity)
- **Mejora la calidad del razonamiento**: Más thinking → respuestas más precisas y lógicas
- **Consume tiempo**: El thinking aumenta la latencia de respuesta, pero a cambio obtienes mejores resultados

**Diferencias clave**:

| Modelo Normal | Modelo Thinking |
|--- | ---|
| Genera la respuesta directamente | Primero piensa → Luego genera la respuesta |
| Rápido pero posiblemente superficial | Lento pero más profundo |
| Adecuado para tareas simples | Adecuado para tareas complejas |

### Dos Implementaciones de Thinking

El complemento Antigravity Auth admite dos implementaciones de Thinking:

#### Claude Thinking (Opus 4.5, Sonnet 4.5)

- **Budget basado en tokens**: Controla la cantidad de thinking con números (como 8192, 32768)
- **Thinking entrelazado**: Puede pensar antes y después de las llamadas a herramientas
- **Claves snake_case**: Usa `include_thoughts`, `thinking_budget`

#### Gemini 3 Thinking (Pro, Flash)

- **Basado en niveles**: Controla la intensidad de thinking con cadenas (minimal/low/medium/high)
- **Claves camelCase**: Usa `includeThoughts`, `thinkingLevel`
- **Diferencias de modelo**: Flash admite los 4 niveles, Pro solo admite low/high

---

## Sígueme

### Paso 1: Configurar Modelos Thinking mediante Variantes

El sistema de variantes de OpenCode te permite seleccionar la intensidad de thinking directamente en el selector de modelos, sin necesidad de recordar nombres de modelos complejos.

#### Verificar la Configuración Existente

Revisa tu archivo de configuración de modelos (generalmente en `.opencode/models.json` o en el directorio de configuración del sistema):

```bash
## Ver configuración de modelos
cat ~/.opencode/models.json
```

#### Configurar Modelos Thinking de Claude

Encuentra `antigravity-claude-sonnet-4-5-thinking` o `antigravity-claude-opus-4-5-thinking`, agrega variantes:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "limit": { "context": 200000, "output": 64000 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "medium": { "thinkingConfig": { "thinkingBudget": 16384 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  }
}
```

**Descripción de la configuración**:
- `low`: 8192 tokens - Thinking ligero, adecuado para tareas de complejidad media
- `medium`: 16384 tokens - Equilibrio entre thinking y velocidad
- `max`: 32768 tokens - Máximo thinking, adecuado para las tareas más complejas

#### Configurar Modelos Thinking de Gemini 3

**Gemini 3 Pro** (solo admite low/high):

```json
{
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro (Antigravity)",
    "limit": { "context": 1048576, "output": 65535 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Gemini 3 Flash** (admite los 4 niveles):

```json
{
  "antigravity-gemini-3-flash": {
    "name": "Gemini 3 Flash (Antigravity)",
    "limit": { "context": 1048576, "output": 65536 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "minimal": { "thinkingLevel": "minimal" },
      "low": { "thinkingLevel": "low" },
      "medium": { "thinkingLevel": "medium" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Descripción de la configuración**:
- `minimal`: Mínimo thinking, respuesta más rápida (solo Flash)
- `low`: Thinking ligero
- `medium`: Thinking equilibrado (solo Flash)
- `high`: Máximo thinking (más lento pero más profundo)

**Lo que deberías ver**: En el selector de modelos de OpenCode, después de seleccionar un modelo Thinking, deberías ver un menú desplegable de variantes.

### Paso 2: Usar Modelos Thinking para Realizar Solicitudes

Una vez completada la configuración, puedes seleccionar el modelo y la variante a través de OpenCode:

```bash
## Usar Claude Sonnet 4.5 Thinking (max)
opencode run "Ayúdame a diseñar la arquitectura de un sistema de caché distribuido" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max

## Usar Gemini 3 Pro (high)
opencode run "Analiza los cuellos de botella de rendimiento de este código" \
  --model=google/antigravity-gemini-3-pro \
  --variant=high

## Usar Gemini 3 Flash (minimal - el más rápido)
opencode run "Resume rápidamente el contenido de este archivo" \
  --model=google/antigravity-gemini-3-flash \
  --variant=minimal
```

**Lo que deberías ver**: El modelo primero mostrará thinking blocks (contenido de pensamiento), luego generará la respuesta final.

### Paso 3: Entender el Interleaved Thinking

El interleaved thinking es una capacidad especial de los modelos de Claude: puede pensar antes y después de las llamadas a herramientas.

**Ejemplo de escenario**: Cuando pides a la IA que use herramientas (como operaciones de archivos, consultas a base de datos) para completar tareas:

```
Thinking: Necesito leer primero el archivo de configuración, luego decidir el siguiente paso según el contenido...

[Llamada a herramienta: read_file("config.json")]

Tool Result: { "port": 8080, "mode": "production" }

Thinking: El puerto es 8080, modo de producción. Necesito verificar si la configuración es correcta...

[Llamada a herramienta: validate_config({ "port": 8080, "mode": "production" })]

Tool Result: { "valid": true }

Thinking: La configuración es válida. Ahora puedo iniciar el servicio.

[Generación de respuesta final]
```

**Por qué es importante**:
- Hay pensamiento antes y después de las llamadas a herramientas → decisiones más inteligentes
- Se adapta a los resultados devueltos por herramientas → ajusta estrategias dinámicamente
- Evita ejecutar ciegamente → reduce errores operativos

::: tip Manejo automático del complemento

No necesitas configurar manualmente el interleaved thinking. El complemento Antigravity Auth detectará automáticamente los modelos Thinking de Claude e inyectará instrucciones del sistema:
- "Interleaved thinking is enabled. You may think between tool calls and after receiving tool results before deciding on next action or final answer."

:::

### Paso 4: Controlar la Estrategia de Retención de Bloques de Thinking

Por defecto, el complemento **elimina los bloques de thinking** para mejorar la confiabilidad (evitar errores de firma). Si quieres leer el contenido de thinking, necesitas configurar `keep_thinking`.

#### ¿Por Qué Se Eliminan por Defecto?

**Problema de errores de firma**:
- Los thinking blocks necesitan coincidencia de firma en conversaciones de múltiples rondas
- Si se conservan todos los bloques de thinking, puede causar conflictos de firma
- Eliminar los bloques de thinking es una solución más estable (pero pierdes el contenido de thinking)

#### Habilitar la Retención de Bloques de Thinking

Crea o edita el archivo de configuración:

**Linux/macOS**: `~/.config/opencode/antigravity.json`

**Windows**: `%APPDATA%\opencode\antigravity.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "keep_thinking": true
}
```

O usa variables de entorno:

```bash
export OPENCODE_ANTIGRAVITY_KEEP_THINKING=1
```

**Lo que deberías ver**:
- `keep_thinking: false` (predeterminado): solo ves la respuesta final, los bloques de thinking están ocultos
- `keep_thinking: true`: ves el proceso completo de thinking (puedes encontrar errores de firma en algunas conversaciones de múltiples rondas)

::: warning Prácticas recomendadas

- **Entorno de producción**: Usa `keep_thinking: false` predeterminado para asegurar estabilidad
- **Depuración/aprendizaje**: Habilita temporalmente `keep_thinking: true` para observar el proceso de thinking
- **Si encuentras errores de firma**: Deshabilita `keep_thinking`, el complemento se recuperará automáticamente

:::

### Paso 5: Verificar Max Output Tokens

Los modelos Thinking de Claude necesitan un límite mayor de tokens de salida (maxOutputTokens), de lo contrario el thinking budget podría no usarse completamente.

**Manejo automático del complemento**:
- Si configuras thinking budget, el complemento ajustará automáticamente `maxOutputTokens` a 64,000
- Ubicación del código fuente: `src/plugin/transform/claude.ts:78-90`

**Configuración manual (opcional)**:

Si configuras manualmente `maxOutputTokens`, asegúrate de que sea mayor que el thinking budget:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "variants": {
      "max": {
        "thinkingConfig": { "thinkingBudget": 32768 },
        "maxOutputTokens": 64000  // Debe ser >= thinkingBudget
      }
    }
  }
}
```

**Lo que deberías ver**:
- Si `maxOutputTokens` es demasiado pequeño, el complemento lo ajustará automáticamente a 64,000
- En los registros de depuración se mostrará "Adjusted maxOutputTokens for thinking model"

---

## Puntos de Control ✅

Verifica que tu configuración sea correcta:

### 1. Verificar Visibilidad de Variantes

En OpenCode:

1. Abre el selector de modelos
2. Selecciona `Claude Sonnet 4.5 Thinking`
3. Verifica si hay un menú desplegable de variantes (low/medium/max)

**Resultado esperado**: Deberías ver 3 opciones de variantes.

### 2. Verificar Salida de Contenido de Thinking

```bash
opencode run "Piensa en 3 pasos: 1+1=¿? ¿Por qué?" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max
```

**Resultado esperado**:
- Si `keep_thinking: true`: ves el proceso detallado de thinking
- Si `keep_thinking: false` (predeterminado): ves directamente la respuesta "2"

### 3. Verificar Interleaved Thinking (requiere llamadas a herramientas)

```bash
## Usa una tarea que requiere llamadas a herramientas
opencode run "Lee la lista de archivos del directorio actual, luego resume los tipos de archivos" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=medium
```

**Resultado esperado**:
- Ves contenido de thinking antes y después de las llamadas a herramientas
- La IA ajustará su estrategia según los resultados devueltos por las herramientas

---

## Advertencias de Errores Comunes

### ❌ Error 1: Thinking Budget Excede Max Output Tokens

**Problema**: Configuraste `thinkingBudget: 32768`, pero `maxOutputTokens: 20000`

**Mensaje de error**:
```
Invalid argument: max_output_tokens must be greater than or equal to thinking_budget
```

**Solución**:
- Deja que el complemento lo maneje automáticamente (recomendado)
- O configura manualmente `maxOutputTokens >= thinkingBudget`

### ❌ Error 2: Gemini 3 Pro Usa Nivel No Soportado

**Problema**: Gemini 3 Pro solo admite low/high, pero intentas usar `minimal`

**Mensaje de error**:
```
Invalid argument: thinking_level "minimal" not supported for gemini-3-pro
```

**Solución**: Solo usa los niveles que admite Pro (low/high)

### ❌ Error 3: Error de Firma en Conversaciones de Múltiples Rondas (keep_thinking: true)

**Problema**: Después de habilitar `keep_thinking: true`, encuentras errores en conversaciones de múltiples rondas

**Mensaje de error**:
```
Signature mismatch in thinking blocks
```

**Solución**:
- Deshabilita temporalmente `keep_thinking`: `export OPENCODE_ANTIGRAVITY_KEEP_THINKING=0`
- O reinicia la sesión

### ❌ Error 4: Las Variantes No Se Muestran

**Problema**: Configuraste variantes, pero no las ves en el selector de modelos de OpenCode

**Posibles causas**:
- Ruta incorrecta del archivo de configuración
- Error de sintaxis JSON (falta de comas, comillas)
- ID de modelo no coincidente

**Solución**:
1. Verifica la ruta del archivo de configuración: `~/.opencode/models.json` o `~/.config/opencode/models.json`
2. Valida la sintaxis JSON: `cat ~/.opencode/models.json | python -m json.tool`
3. Verifica si el ID del modelo coincide con lo que devuelve el complemento

---

## Resumen de Esta Lección

Los modelos Thinking mejoran la calidad de respuesta en tareas complejas al realizar razonamiento interno antes de generar respuestas:

| Función | Claude Thinking | Gemini 3 Thinking |
|--- | --- | ---|
| **Método de configuración** | `thinkingBudget` (número) | `thinkingLevel` (cadena) |
| **Niveles** | Budget personalizado | minimal/low/medium/high |
| **Claves** | snake_case (`include_thoughts`) | camelCase (`includeThoughts`) |
| **Interleaved** | ✅ Admite | ❌ No admite |
| **Max Output** | Ajustado automáticamente a 64,000 | Usa valores predeterminados |

**Configuraciones clave**:
- **Sistema de variantes**: Configura mediante `thinkingConfig.thinkingBudget` (Claude) o `thinkingLevel` (Gemini 3)
- **keep_thinking**: false predeterminado (estable), true (legible contenido de thinking)
- **Thinking entrelazado**: Habilitado automáticamente, no requiere configuración manual

---

## Próxima Lección

> En la próxima lección aprenderemos **[Google Search Grounding](../google-search-grounding/)**.
>
> Aprenderás:
> - Habilitar la recuperación de Google Search para modelos Gemini
> - Configurar umbrales de recuperación dinámica
> - Mejorar la precisión factual, reducir alucinaciones

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| Construcción de configuración Claude Thinking | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 62-72 |
| Construcción de configuración Gemini 3 Thinking | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 163-171 |
| Construcción de configuración Gemini 2.5 Thinking | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 176-184 |
| Detección de modelo Claude Thinking | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 34-37 |
| Detección de modelo Gemini 3 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 137-139 |
| Inyección de Hint de Interleaved Thinking | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 96-138 |
| Ajuste automático de Max Output Tokens | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 78-90 |
| Schema de configuración keep_thinking | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 78-87 |
| Aplicación de transformación Claude Thinking | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 324-366 |
| Aplicación de transformación Gemini Thinking | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 372-434 |

**Constantes clave**:
- `CLAUDE_THINKING_MAX_OUTPUT_TOKENS = 64_000`: Número máximo de tokens de salida para modelos Claude Thinking
- `CLAUDE_INTERLEAVED_THINKING_HINT`: Hint de interleaved thinking inyectado en las instrucciones del sistema

**Funciones clave**:
- `buildClaudeThinkingConfig(includeThoughts, thinkingBudget)`: Construye configuración Claude Thinking (claves snake_case)
- `buildGemini3ThinkingConfig(includeThoughts, thinkingLevel)`: Construye configuración Gemini 3 Thinking (cadena de nivel)
- `buildGemini25ThinkingConfig(includeThoughts, thinkingBudget)`: Construye configuración Gemini 2.5 Thinking (budget numérico)
- `ensureClaudeMaxOutputTokens(generationConfig, thinkingBudget)`: Asegura que maxOutputTokens sea lo suficientemente grande
- `appendClaudeThinkingHint(payload, hint)`: Inyecta hint de interleaved thinking
- `isClaudeThinkingModel(model)`: Detecta si es un modelo Claude Thinking
- `isGemini3Model(model)`: Detecta si es un modelo Gemini 3

</details>
