---
title: "Google Search: Permite a Gemini Buscar en Internet | Antigravity"
sidebarTitle: "Permite a Gemini Buscar en Internet"
subtitle: "Google Search Grounding: Permite a Gemini Buscar Información en la Web"
description: "Aprende a habilitar Google Search Grounding para Gemini, permitiendo al modelo buscar información web en tiempo real. Domina la configuración y las técnicas de ajuste de umbrales para equilibrar precisión y velocidad de respuesta."
tags:
  - "gemini"
  - "google-search"
  - "grounding"
  - "configuración"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# Google Search Grounding: Permite a Gemini Buscar Información en la Web

## Qué Podrás Hacer Después de Completar Esto

- Habilitar Google Search para el modelo Gemini, permitiendo que la IA busque información web en tiempo real
- Ajustar el umbral de búsqueda para controlar la frecuencia con la que el modelo realiza búsquedas
- Comprender cómo funciona Google Search Grounding y sus casos de uso apropiados
- Seleccionar la configuración adecuada según los requisitos de la tarea

## Tu Situación Actual

::: info ¿Qué es Google Search Grounding?

**Google Search Grounding** es una función de Gemini que permite al modelo buscar automáticamente en Google cuando sea necesario, obteniendo información en tiempo real (como noticias, estadísticas, precios de productos, etc.) en lugar de depender completamente de los datos de entrenamiento.

:::

Cuando le preguntas a Gemini "¿Cómo está el clima hoy?" o "¿Cuál es el número de versión más reciente de VS Code?", el modelo puede no poder responder porque sus datos de entrenamiento están desactualizados. Después de habilitar Google Search Grounding, el modelo puede buscar las respuestas en Internet por sí mismo, igual que cuando usas un navegador.

## Cuándo Usar Esto

| Escenario | ¿Necesita Habilitar? | Razón |
|---|---|---|
| Generación de código, problemas de programación | ❌ No necesario | El conocimiento de programación es relativamente estable, los datos de entrenamiento son suficientes |
| Obtener las últimas noticias (noticias, precios, versiones) | ✅ Altamente recomendado | Se necesitan datos en tiempo real |
| Verificación de hechos (fechas específicas, estadísticas) | ✅ Recomendado | Evita que el modelo invente información |
| Escritura creativa, lluvia de ideas | ❌ No necesario | No se requiere precisión factual |
| Consulta de documentación técnica | ✅ Recomendado | Busca documentación API más reciente |

## Concepto Central

El núcleo de Google Search Grounding es permitir que el modelo busque automáticamente **cuando sea necesario**, en lugar de buscar cada vez. El complemento inyecta la herramienta `googleSearchRetrieval`, permitiendo que Gemini pueda llamar a la API de búsqueda de Google.

::: tip Conceptos Clave

- **Modo Auto**: El modelo decide por sí mismo si buscar (según el umbral)
- **Umbral (grounding_threshold)**: Controla el "nivel de entrada" para que el modelo busque. Valores más pequeños significan búsquedas más frecuentes

:::

## 🎒 Preparativos Antes de Comenzar

::: warning Comprobación Previas

Antes de comenzar, por favor confirma:

- [ ] Has completado [Instalación Rápida](../../start/quick-install/)
- [ ] Has agregado al menos una cuenta de Google
- [ ] Has realizado exitosamente la primera solicitud (consulta [Primera Solicitud](../../start/first-request/))

:::

## Sígueme

### Paso 1: Verificar la Ubicación del Archivo de Configuración

El archivo de configuración del complemento se encuentra en:

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

Si el archivo no existe, créalo primero:

```bash
# macOS/Linux
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell
# Windows
@"
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\antigravity.json" -Encoding utf8
```

**Deberías ver**: El archivo de configuración ha sido creado, contiene el campo `$schema`

### Paso 2: Habilitar Google Search

Agrega la configuración `web_search` en el archivo de configuración:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.3
  }
}
```

**Descripción de la Configuración**:

| Campo | Valor | Descripción |
|---|---|---|
| `web_search.default_mode` | `"auto"` o `"off"` | Habilitar o deshabilitar Google Search, predeterminado `"off"` |
| `web_search.grounding_threshold` | `0.0` - `1.0` | Umbral de búsqueda, predeterminado `0.3`, solo efectivo en modo `auto` |

**Deberías ver**: El archivo de configuración ha sido actualizado, contiene la configuración `web_search`

### Paso 3: Ajustar el Umbral de Búsqueda (Opcional)

El `grounding_threshold` controla la frecuencia con la que el modelo realiza búsquedas:

| Umbral | Comportamiento | Escenario Aplicable |
|---|---|---|
| `0.0 - 0.2` | Búsquedas frecuentes, casi busca cada vez que hay incertidumbre | Se necesitan datos en tiempo real altamente precisos |
| `0.3` (predeterminado) | Moderado, el modelo necesita estar bastante seguro para buscar | Uso diario, equilibrio entre precisión y velocidad |
| `0.7 - 1.0` | Rara vez busca, solo busca con alta confianza | Reducir el número de búsquedas, mejorar la velocidad |

::: tip Consejo de Experiencia

Comienza con el valor predeterminado `0.3`, si encuentras:
- **El modelo no busca** → Reduce el umbral (como `0.2`)
- **Búsqueda demasiado frecuente, respuesta lenta** → Aumenta el umbral (como `0.5`)

:::

**Deberías ver**: El umbral ha sido ajustado, se puede optimizar según la experiencia de uso real

### Paso 4: Verificar la Configuración

Reinicia OpenCode, o recarga la configuración (si es compatible), luego realiza una solicitud que requiera información en tiempo real:

```
Entrada del Usuario:
¿Cuál es la versión más reciente de VS Code?

Respuesta del Sistema (con Google Search habilitado):
La última versión estable de VS Code es 1.96.4 (a partir de enero de 2026)...

[citation:1] ← Marcador de fuente de referencia
```

**Deberías ver**:
- La respuesta del modelo incluye fuentes de referencia (`[citation:1]`, etc.)
- El contenido de la respuesta es el más reciente, no una versión antigua de los datos de entrenamiento

### Paso 5: Probar Diferentes Umbrales

Intenta ajustar el `grounding_threshold` y observa los cambios en el comportamiento del modelo:

```json
// Umbral bajo (búsquedas frecuentes)
"grounding_threshold": 0.1

// Umbral alto (pocas búsquedas)
"grounding_threshold": 0.7
```

Después de cada ajuste, prueba con la misma pregunta y observa:
- Si busca (comprueba si hay referencias en la respuesta)
- El número de búsquedas (múltiples `citation`)
- La velocidad de respuesta

**Deberías ver**:
- Umbral bajo: búsquedas más frecuentes, pero respuesta ligeramente más lenta
- Umbral alto: menos búsquedas, pero posiblemente respuestas imprecisas

## Punto de Verificación ✅

::: details Haz Clic para Expandir la Lista de Verificación

Completa las siguientes comprobaciones para confirmar que la configuración es correcta:

- [ ] El archivo de configuración contiene la configuración `web_search`
- [ ] `default_mode` está configurado como `"auto"`
- [ ] `grounding_threshold` está entre `0.0` y `1.0`
- [ ] Realiza una solicitud que requiera información en tiempo real, el modelo devuelve referencias
- [ ] Después de ajustar el umbral, el comportamiento de búsqueda del modelo cambia

Si todos pasan, ¡significa que Google Search Grounding está habilitado correctamente!

:::

## Advertencias de Errores Comunes

### Problema 1: El modelo no busca

**Síntoma**: Después de habilitar el modo `auto`, el modelo todavía no busca, ni tampoco hay fuentes de referencia.

**Causa**:
- El umbral es demasiado alto (como `0.9`), el modelo necesita una confianza muy alta para buscar
- La pregunta en sí misma no requiere búsqueda (como problemas de programación)

**Solución**:
- Reduce `grounding_threshold` a `0.2` o menor
- Prueba con preguntas que claramente requieren información en tiempo real (como "¿Cómo está el clima hoy?", "Últimas noticias")

### Problema 2: Búsquedas demasiado frecuentes, respuesta lenta

**Síntoma**: Cada pregunta se busca, el tiempo de respuesta aumenta significativamente.

**Causa**:
- El umbral es demasiado bajo (como `0.1`), el modelo activa búsquedas con demasiada frecuencia
- El tipo de pregunta en sí misma requiere información en tiempo real (como precios de acciones, noticias)

**Solución**:
- Aumenta `grounding_threshold` a `0.5` o mayor
- Si la tarea no requiere información en tiempo real, cambia `default_mode` a `"off"`

### Problema 3: Error de formato del archivo de configuración

**Síntoma**: El complemento informa un error, no puede cargar la configuración.

**Causa**: Error de formato JSON (como comas extra, comillas que no coinciden).

**Solución**: Usa una herramienta de validación JSON para verificar el archivo de configuración, asegúrate de que el formato sea correcto.

```bash
# Validar formato JSON
cat ~/.config/opencode/antigravity.json | python3 -m json.tool
```

## Resumen de la Lección

- **Google Search Grounding** permite a los modelos Gemini buscar información web en tiempo real
- A través de `web_search.default_mode: "auto"` para habilitar, `"off"` para deshabilitar
- `grounding_threshold` controla la frecuencia de búsqueda: valores más pequeños significan búsquedas más frecuentes
- El umbral predeterminado `0.3` es adecuado para la mayoría de los escenarios, se puede ajustar según la experiencia real de uso
- El modelo citará fuentes en la respuesta, marcado como `[citation:1]`, etc.

## Avance de la Próxima Lección

> En la próxima lección aprenderemos sobre el **[Sistema de Cuota Dual](../dual-quota-system/)**.
>
> Aprenderás:
> - Cómo funcionan los dos grupos de cuota independientes de Antigravity y Gemini CLI
> - Cómo cambiar entre grupos de cuota para maximizar la utilización
> - Mejores prácticas para la agrupación de cuotas

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Número de Línea |
|---|---|---|
| Esquema de Configuración de Google Search | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 303-319 |
| Definición de Tipos de Google Search | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 85-88 |
| Lógica de Inyección de Google Search | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 402-419 |
| Carga de Configuración de Google Search | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 173-184 |
| Aplicación de Configuración de Google Search | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts) | 1194-1196 |

**Elementos de Configuración Clave**:

- `web_search.default_mode`: `"auto"` o `"off"`, predeterminado `"off"`
- `web_search.grounding_threshold`: `0.0` - `1.0`, predeterminado `0.3`

**Funciones Clave**:

- `applyGeminiTransforms()`: Aplica todas las transformaciones de Gemini, incluyendo la inyección de Google Search
- `normalizeGeminiTools()`: Normaliza el formato de las herramientas, preservando la herramienta `googleSearchRetrieval`
- `wrapToolsAsFunctionDeclarations()`: Envuelve las herramientas en formato `functionDeclarations`

**Principio de Funcionamiento**:

1. El complemento lee `web_search.default_mode` y `web_search.grounding_threshold` desde el archivo de configuración
2. Cuando `mode === "auto"`, inyecta la herramienta `googleSearchRetrieval` en el array `tools` de la solicitud:
   ```json
   {
     "googleSearchRetrieval": {
       "dynamicRetrievalConfig": {
         "mode": "MODE_DYNAMIC",
         "dynamicThreshold": 0.3  // grounding_threshold
       }
     }
   }
   ```
3. El modelo Gemini decide si invocar la herramienta de búsqueda según el umbral
4. Los resultados de búsqueda se incluyen en la respuesta y marcan la fuente de referencia (`[citation:1]`, etc.)

</details>
