---
title: "Guía Completa del Sistema de Memoria y Búsqueda Vectorial | Tutorial de Clawdbot"
sidebarTitle: "Configurar búsqueda de memoria"
subtitle: "Guía Completa del Sistema de Memoria y Búsqueda Vectorial"
description: "Aprende cómo funciona el sistema de memoria de Clawdbot, incluyendo indexación vectorial, búsqueda de texto completo FTS5, recuperación híbrida y configuración de proveedores de Embedding. Domina la configuración y uso de la memoria a largo plazo de IA para mejorar la precisión de la búsqueda semántica."
tags:
  - "memory"
  - "vector-search"
  - "embedding"
  - "sqlite-vec"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 260
---

# Guía Completa del Sistema de Memoria y Búsqueda Vectorial

## Lo que podrás lograr

Al terminar esta lección, podrás:

- Comprender la estructura de archivos y el mecanismo de indexación del sistema de memoria de Clawdbot
- Configurar proveedores de búsqueda vectorial (OpenAI, Gemini, local)
- Utilizar búsqueda híbrida (BM25 + vectorial) para mejorar la precisión de recuperación
- Gestionar índices de memoria y búsqueda a través de CLI
- Ajustar el caché de Embedding y el rendimiento de indexación

## Tu dilema actual

Es posible que te encuentres en estas situaciones:

- La IA "olvida" el contenido de conversaciones anteriores en nuevas sesiones
- Quieres que la IA recuerde conocimientos persistentes y preferencias
- No sabes cómo hacer que la IA "aprenda" y recuerde información importante
- No puedes encontrar el contexto relevante al buscar conversaciones históricas

## Cuándo usar esta técnica

El **sistema de memoria** es adecuado para estos escenarios:

| Escenario | Ejemplo | Ubicación de almacenamiento |
|--- | --- | ---|
| Conocimiento persistente | "Soy vegetariano, recuerda esto" | MEMORY.md |
| Notas diarias | "Progreso de trabajo y tareas pendientes de hoy" | memory/YYYY-MM-DD.md |
| Recuperación de sesiones | "¿Cuál fue el endpoint de API discutido la última vez?" | Índice vectorial |
| Información de configuración | "Gateway se ejecuta en el puerto 18789" | MEMORY.md |

---

## Conceptos Centrales

### Estructura de dos capas del sistema de memoria

Clawdbot utiliza **dos capas de datos** para gestionar la memoria a largo plazo:

| Capa | Ruta del archivo | Propósito | Momento de carga |
|--- | --- | --- | ---|
| **Memoria a largo plazo** | `MEMORY.md` | Conocimientos seleccionados, preferencias, hechos importantes | Se carga al iniciar la sesión principal |
| **Registro diario** | `memory/YYYY-MM-DD.md` | Notas diarias, contexto de ejecución | Se carga el de hoy + el de ayer |

::: info ¿Por qué dos capas?
`MEMORY.md` es similar a una "base de conocimiento" y solo se carga en la sesión principal, asegurando que la información sensible no se filtre en conversaciones grupales. `memory/*.md` es un "diario" que registra el flujo diario para facilitar la retrospección.
:::

### Flujo de trabajo de la indexación vectorial

```mermaid
graph LR
    A[Memory Files] --> B[Chunking<br/>~400 tokens]
    B --> C[Embedding Provider]
    C --> D{Provider Type}
    D -->|OpenAI/Gemini| E[Remote API]
    D -->|Local| F[node-llama-cpp]
    E --> G[SQLite Index]
    F --> G
    G --> H[Vector Search]
    G --> I[FTS5 BM25]
    H --> J[Hybrid Merge]
    I --> J
    J --> K[Ranked Results]
```

### Búsqueda híbrida: BM25 + Vectorial

La búsqueda vectorial es buena en "coincidencia semántica", pero débil en "coincidencia exacta":

| Tipo de consulta | Búsqueda vectorial | BM25 texto completo | Búsqueda híbrida |
|--- | --- | --- | ---|
| "Dirección IP del servidor" | ❌ Débil | ✅ Fuerte | ✅ Óptimo |
| "Cómo desplegar Gateway" | ✅ Fuerte | ⚠️ Medio | ✅ Óptimo |
| "Endpoint de API a828e60" | ❌ Débil | ✅ Fuerte | ✅ Óptimo |

**Fórmula de fusión**:
```javascript
finalScore = vectorWeight × vectorScore + textWeight × textScore
```

- `vectorWeight + textWeight` se normaliza automáticamente a 1.0
- Predeterminado: 70% vectorial + 30% palabras clave
- Se puede ajustar mediante `agents.defaults.memorySearch.query.hybrid.*`

---

## 🎒 Preparativos Antes de Empezar

Antes de comenzar, asegúrate de:

::: warning Verificación previa
- [ ] Gateway está en ejecución ( [Iniciar Gateway](../../start/gateway-startup/) )
- [ ] El modelo de IA está configurado ( [Configuración del modelo de IA](../models-auth/) )
- [ ] Sabes editar archivos Markdown básicos
:::

::: tip Configuración recomendada
- Usa preferiblemente embeddings de OpenAI o Gemini (rápidos y de alta calidad)
- Los embeddings locales requieren `pnpm rebuild node-llama-cpp`
- La primera indexación puede tomar unos minutos, pero las actualizaciones incrementales son rápidas después
:::

---

## Sigue los Pasos

### Paso 1: Crear archivos de memoria

**Por qué**: La IA solo indexa archivos existentes, primero crea el contenido de memoria

Crea archivos en el directorio de trabajo del agente (predeterminado `~/clawd`):

```bash
# Crear archivo de memoria a largo plazo
cat > ~/clawd/MEMORY.md << 'EOF'
# Preferencias personales

- Preferencias dietéticas: vegetariano, no como comida picante
- Horario de trabajo: 9 AM a 6 PM
- Comandos frecuentes: `clawdbot gateway status`

# Configuración importante

- Puerto Gateway: 18789
- Base de datos: PostgreSQL 15
EOF

# Crear registro de hoy
cat > ~/clawd/memory/$(date +%Y-%m-%d).md << 'EOF'
# Progreso de trabajo de hoy

- Completada la configuración de Gateway
- Aprendido el sistema de memoria
- Pendiente: leer documentación de autenticación de modelos
EOF
```

**Lo que deberías ver**:

```bash
# Ver estructura de archivos
tree ~/clawd/
# o
ls -la ~/clawd/
ls -la ~/clawd/memory/

# Ejemplo de salida
~/clawd/
├── MEMORY.md
└── memory/
    └── 2026-01-27.md
```

### Paso 2: Verificar el estado del sistema de memoria

**Por qué**: Confirmar el proveedor de Embedding y el estado del índice

```bash
# Verificación básica del estado
clawdbot memory status

# Verificación profunda (detectar disponibilidad del proveedor)
clawdbot memory status --deep

# Verificación profunda + reindexación forzada
clawdbot memory status --deep --index
```

**Lo que deberías ver**:

```bash
✓ Memory Search enabled
  Store: ~/.clawdbot/memory/main.sqlite
  Provider: openai
  Model: text-embedding-3-small
  Fallback: openai
  Hybrid: enabled (vectorWeight: 0.7, textWeight: 0.3)
  Cache: enabled (maxEntries: 50000)
  Sources: memory
  Indexed: 2 files, 5 chunks
```

::: tip Verificación profunda
- `--deep` detecta si los embeddings de OpenAI/Gemini/Local están disponibles
- `--index` reindexa automáticamente cuando detecta un índice "sucio"
- En la primera ejecución, la indexación puede tomar unos minutos
:::

### Paso 3: Activar la indexación manualmente

**Por qué**: Asegurar que los archivos de memoria recién creados sean indexados

```bash
# Activar indexación manualmente
clawdbot memory index

# Con registro detallado
clawdbot memory index --verbose

# Solo para un agente específico
clawdbot memory index --agent main
```

**Lo que deberías ver**:

```bash
Indexing memory for agent: main
  Provider: openai (text-embedding-3-small)
  Sources: memory
  - MEMORY.md (2 chunks)
  - memory/2026-01-27.md (3 chunks)
✓ Indexed 2 files, 5 chunks
```

### Paso 4: Probar la búsqueda semántica

**Por qué**: Verificar que la búsqueda vectorial y la búsqueda híbrida funcionen correctamente

```bash
# Búsqueda básica
clawdbot memory search "vegetariano"

# Búsqueda de coincidencia exacta (probar BM25)
clawdbot memory search "puerto Gateway"

# Búsqueda de semántica difusa (probar vectorial)
clawdbot memory search "qué me gusta comer"

# Ver resultados detallados
clawdbot memory search "Gateway" --verbose
```

**Lo que deberías ver**:

```bash
Searching memory for: "vegetariano"

Results (2):

[1] MEMORY.md:3-5 (score: 0.842)
  - Preferencias dietéticas: vegetariano, no como comida picante

[2] memory/2026-01-27.md:1-3 (score: 0.615)
  - Completada la configuración de Gateway
  - Aprendido el sistema de memoria
```

### Paso 5: Configurar el proveedor de Embedding

**Por qué**: Elegir el proveedor más adecuado según necesidades (remoto vs local)

#### Opción A: OpenAI embeddings (recomendado)

Edita el archivo de configuración `~/.clawdbot/clawdbot.json`:

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        "provider": "openai",
        "model": "text-embedding-3-small",
        "fallback": "openai",
        "remote": {
          "apiKey": "YOUR_OPENAI_API_KEY",
          "batch": {
            "enabled": true,
            "concurrency": 2
          }
        }
      }
    }
  }
}
```

**Ventajas**:
- Rápido y de alta calidad
- Soporta indexación por lotes (económico)
- Adecuado para relleno masivo

#### Opción B: Gemini embeddings

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "provider": "gemini",
        "model": "gemini-embedding-001",
        "remote": {
          "apiKey": "YOUR_GEMINI_API_KEY"
        },
        "fallback": "openai"
      }
    }
  }
}
```

#### Opción C: Embeddings locales (prioridad de privacidad)

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "provider": "local",
        "local": {
          "modelPath": "hf:ggml-org/embeddinggemma-300M-GGUF/embeddinggemma-300M-Q8_0.gguf",
          "modelCacheDir": "~/.cache/embeddings"
        },
        "fallback": "none"
      }
    }
  }
}
```

**Precauciones**:

```bash
# Primera vez que se usan embeddings locales requiere construcción
pnpm approve-builds
# Seleccionar node-llama-cpp
pnpm rebuild node-llama-cpp
```

**Lo que deberías ver**:

```bash
✓ node-llama-cpp installed
✓ Local embedding model ready
```

::: warning Embeddings locales
- La primera vez descargará automáticamente el modelo (~600MB)
- Requiere compilar node-llama-cpp (depende del entorno del sistema)
- Más lento que el remoto, pero completamente sin conexión y prioridad de privacidad
:::

### Paso 6: Configurar pesos de búsqueda híbrida

**Por qué**: Ajustar la proporción de pesos semánticos y de palabras clave según el caso de uso

Edita la configuración:

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "query": {
          "hybrid": {
            "enabled": true,
            "vectorWeight": 0.7,
            "textWeight": 0.3,
            "candidateMultiplier": 4
          }
        }
      }
    }
  }
}
```

**Descripción de parámetros**:

| Parámetro | Valor predeterminado | Descripción | Sugerencia de ajuste |
|--- | --- | --- | ---|
| `vectorWeight` | 0.7 | Peso de búsqueda semántica | Aumentar a 0.8 para consultas de "lenguaje natural" |
| `textWeight` | 0.3 | Peso de búsqueda de palabras clave | Aumentar a 0.5 para consultas de "código/ID" |
| `candidateMultiplier` | 4 | Multiplicador de candidatos | Aumentar a 6 para mejorar el recall |

**Comparación de efectos**:

```bash
# Probar consulta semántica
clawdbot memory search "método para desplegar Gateway"
# vectorWeight: 0.7 → encuentra resultados semánticamente relevantes
# textWeight: 0.5 → encuentra palabras clave "desplegar", "Gateway"

# Probar consulta exacta
clawdbot memory search "endpoint de API a828e60"
# vectorWeight: 0.3 → ignora semántica, prioriza coincidencia
# textWeight: 0.7 → coincidencia exacta de "a828e60"
```

### Paso 7: Habilitar aceleración SQLite-vec

**Por qué**: Realizar pushdown de consultas vectoriales a SQLite, evitando cargar todos los embeddings

Edita la configuración:

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "store": {
          "vector": {
            "enabled": true,
            "extensionPath": "/path/to/sqlite-vec"
          }
        }
      }
    }
  }
}
```

**Verificar si sqlite-vec está disponible**:

```bash
# Ver estado del índice
clawdbot memory status --deep

# Si está disponible, verás
✓ SQLite-vec extension loaded
  Vector table: chunks_vec
```

::: info SQLite-vec
- Por defecto intenta cargar automáticamente
- Si la carga falla, retrocede automáticamente al cálculo JS (no afecta la funcionalidad)
- La ruta personalizada solo se usa para compilaciones especiales o instalaciones no estándar
:::

---

## Punto de Verificación ✅

Después de completar los pasos anteriores, verifica lo siguiente:

| Elemento a verificar | Método de verificación | Resultado esperado |
|--- | --- | ---|
| Archivos de memoria existen | `ls ~/clawd/` | MEMORY.md y el directorio memory/ existen |
| Índice creado | `clawdbot memory status` | Muestra Indexed > 0 chunks |
| Búsqueda funciona | `clawdbot memory search "..."` | Devuelve resultados relevantes |
| Provider funciona | `clawdbot memory status --deep` | Muestra el tipo de Provider |

---

## Problemas Comunes

### Problema 1: Fallo del proveedor de Embedding

**Síntoma**:

```bash
✗ Memory Search disabled
  Error: No API key found for provider
```

**Solución**:

```bash
# Verificar configuración
cat ~/.clawdbot/clawdbot.json | grep -A 5 "memorySearch"

# Confirmar que apiKey existe
# O establecer variables de entorno
export OPENAI_API_KEY="sk-..."
export GEMINI_API_KEY="..."
```

### Problema 2: No se pueden cargar embeddings locales

**Síntoma**:

```bash
✗ Local embedding provider failed
  Error: Cannot find module 'node-llama-cpp'
```

**Solución**:

```bash
# Aprobar construcción
pnpm approve-builds

# Reconstruir
pnpm rebuild node-llama-cpp
```

### Problema 3: El índice no se actualiza

**Síntoma**:

```bash
# Se modificó MEMORY.md
# Pero los resultados de búsqueda siguen siendo los antiguos
```

**Solución**:

```bash
# Método 1: Activar indexación manualmente
clawdbot memory index

# Método 2: Reiniciar Gateway (activa indexación onSessionStart)
clawdbot gateway restart

# Método 3: Verificar monitoreo de archivos
clawdbot memory status --verbose
# Verificar "Watch: true"
```

### Problema 4: Resultados de búsqueda irrelevantes

**Síntoma**: Buscar "Gateway" pero devuelve "progreso de trabajo"

**Causas posibles**:

1. **Pesos híbridos inapropiados**:
   - Consulta semántica ("cómo desplegar") → aumentar `vectorWeight`
   - Consulta de palabras clave ("endpoint de API") → aumentar `textWeight`

2. **Índice no completamente actualizado**:
   ```bash
   # Reindexación forzada
   rm ~/.clawdbot/memory/main.sqlite
   clawdbot memory index
   ```

3. **Problema de granularidad de chunk**:
   - Predeterminado 400 tokens, puede cortar el contexto
   - Ajustar `agents.defaults.memorySearch.chunking.tokens`

---

## Resumen de la Lección

En esta lección aprendimos:

1. **Arquitectura del sistema de memoria**
   - Estructura de datos de dos capas (MEMORY.md + memory/*.md)
   - Índice vectorial + búsqueda de texto completo FTS5
   - Recuperación híbrida (BM25 + vectorial)

2. **Configuración del proveedor de Embedding**
   - Tres opciones: OpenAI/Gemini/local
   - Aceleración de indexación por lotes
   - Mecanismo de fallback

3. **Uso de herramientas CLI**
   - `clawdbot memory status` verificar estado
   - `clawdbot memory index` activar indexación
   - `clawdbot memory search` probar búsqueda

4. **Optimización de rendimiento**
   - Aceleración vectorial SQLite-vec
   - Caché de Embedding
   - Ajuste de pesos híbridos

---

## Próxima Lección

> En la próxima lección aprenderemos sobre **[Seguridad y Aislamiento de Sandbox](../security-sandbox/)**.
>
> Aprenderás:
> - Control de permisos de herramientas y allowlist
> - Aislamiento de sesiones de Sandbox
> - Mecanismo de aprobación Exec
> - Despliegue Dockerizado
> - Autenticación Tailscale

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Actualizado: 2026-01-27

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Gestor de memoria | [`src/memory/manager.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/manager.ts) | 1-200 |
| Búsqueda híbrida | [`src/memory/hybrid.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/hybrid.ts) | 1-112 |
| Proveedor de Embedding | [`src/memory/embeddings.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/embeddings.ts) | 1-80 |
| OpenAI embeddings | [`src/memory/embeddings-openai.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/embeddings-openai.ts) | Todo el archivo |
| Gemini embeddings | [`src/memory/embeddings-gemini.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/embeddings-gemini.ts) | Todo el archivo |
| Embeddings locales | [`src/memory/node-llama.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/node-llama.ts) | Todo el archivo |
| SQLite-vec | [`src/memory/sqlite-vec.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/sqlite-vec.ts) | Todo el archivo |
| Indexación por lotes (OpenAI) | [`src/memory/batch-openai.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/batch-openai.ts) | Todo el archivo |
| Indexación por lotes (Gemini) | [`src/memory/batch-gemini.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/batch-gemini.ts) | Todo el archivo |
| Gestor de búsqueda | [`src/memory/manager-search.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/manager-search.ts) | Todo el archivo |
| Memory Schema | [`src/memory/memory-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/memory/memory-schema.ts) | Todo el archivo |

**Configuraciones clave**:
- `agents.defaults.memorySearch.enabled`: habilitar/deshabilitar búsqueda de memoria
- `agents.defaults.memorySearch.provider`: proveedor de Embedding ("openai", "gemini", "local")
- `agents.defaults.memorySearch.query.hybrid.vectorWeight`: peso de búsqueda vectorial (predeterminado 0.7)
- `agents.defaults.memorySearch.query.hybrid.textWeight`: peso de búsqueda BM25 (predeterminado 0.3)
- `agents.defaults.memorySearch.cache.enabled`: caché de Embedding (predeterminado true)
- `agents.defaults.memorySearch.store.vector.enabled`: aceleración SQLite-vec (predeterminado true)

**Funciones clave**:
- `mergeHybridResults()`: fusionar resultados vectoriales + BM25 (`src/memory/hybrid.ts:39-111`)
- `bm25RankToScore()`: convertir ranking BM25 a puntuación (`src/memory/hybrid.ts:34-37`)
- `createEmbeddingProvider()`: crear proveedor de Embedding (`src/memory/embeddings.ts`)
- `getMemorySearchManager()`: obtener gestor de búsqueda de memoria (`src/memory/search-manager.ts`)

**Comandos CLI**:
- `clawdbot memory status`: verificar estado (`src/cli/commands/memory-cli.ts`)
- `clawdbot memory index`: activar indexación (`src/cli/commands/memory-cli.ts`)
- `clawdbot memory search`: buscar memoria (`src/cli/commands/memory-cli.ts`)

</details>
