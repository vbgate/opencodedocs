---
title: "Herramientas de búsqueda y scraping web: Brave, Perplexity y extracción de contenido web | Tutorial de Clawdbot"
sidebarTitle: "Hacer que AI busque en la web"
subtitle: "Herramientas de búsqueda y scraping web"
description: "Aprende a configurar y usar las herramientas web_search y web_fetch de Clawdbot para permitir que el asistente de IA acceda a información web en tiempo real. Este tutorial cubre la configuración de Brave Search API y Perplexity Sonar, extracción de contenido web, mecanismo de caché y solución de problemas comunes. Incluye obtención de API Key, configuración de parámetros, configuración de región e idioma y configuración de respaldo de Firecrawl."
tags:
  - "advanced"
  - "tools"
  - "web"
  - "search"
  - "fetch"
prerequisite:
  - "start-getting-started"
order: 230
---

# Herramientas de búsqueda y scraping web

## Lo que podrás hacer después

- Configurar la herramienta **web_search** para permitir que el asistente de IA use Brave Search o Perplexity Sonar para búsquedas web
- Configurar la herramienta **web_fetch** para permitir que el asistente de IA realice scraping y extracción de contenido web
- Comprender la diferencia entre las dos herramientas y sus casos de uso
- Configurar API Key y parámetros avanzados (región, idioma, tiempo de caché, etc.)
- Solucionar problemas comunes (errores de API Key, fallas de scraping, problemas de caché, etc.)

## Tu problema actual

La base de conocimientos del asistente de IA es estática y no puede acceder a información web en tiempo real:

- La IA no conoce las noticias de hoy
- La IA no puede buscar los últimos documentos de API o blogs técnicos
- La IA no puede recuperar el contenido más reciente de sitios web específicos

Quieres que el asistente de IA "se conecte a internet" pero no sabes:

- ¿Debería usar Brave o Perplexity?
- ¿De dónde obtengo la API Key? ¿Cómo la configuro?
- ¿Cuál es la diferencia entre web_search y web_fetch?
- ¿Cómo manejo páginas web dinámicas o sitios que requieren inicio de sesión?

## Cuándo usar esta técnica

- **web_search**: Cuando necesitas buscar información rápidamente, buscar en varios sitios web, obtener datos en tiempo real (como noticias, precios, clima)
- **web_fetch**: Cuando necesitas extraer el contenido completo de una página web específica, leer páginas de documentación, analizar publicaciones de blog

::: tip Guía de selección de herramientas
| Escenario | Herramienta recomendada | Razón |
|------|----------|------|
| Buscar múltiples fuentes | web_search | Devuelve múltiples resultados en una sola consulta |
| Extraer contenido de una sola página | web_fetch | Obtiene texto completo, soporta markdown |
| Páginas dinámicas/requieren inicio de sesión | [browser](../tools-browser/) | Requiere ejecución de JavaScript |
| Páginas estáticas simples | web_fetch | Ligero y rápido |
:::

## 🎒 Preparativos previos

::: warning Requisitos previos
Este tutorial asume que has completado [Inicio rápido](../../start/getting-started/), has instalado e iniciado Gateway.
:::

- El demonio Gateway está ejecutándose
- La configuración de canales básica está completa (al menos un canal de comunicación disponible)
- API Key de al menos un proveedor de búsqueda preparada (Brave o Perplexity/OpenRouter)

::: info Nota
web_search y web_fetch son **herramientas ligeras** que no ejecutan JavaScript. Para sitios web que requieren inicio de sesión o páginas dinámicas complejas, usa la [herramienta browser](../tools-browser/).
:::

## Conceptos clave

### Diferencia entre las dos herramientas

**web_search**: Herramienta de búsqueda web
- Llama a motores de búsqueda (Brave o Perplexity) para devolver resultados de búsqueda
- **Brave**: Devuelve resultados estructurados (título, URL, descripción, fecha de publicación)
- **Perplexity**: Devuelve respuestas sintetizadas por IA con enlaces de citación

**web_fetch**: Herramienta de scraping de contenido web
- Realiza solicitudes HTTP GET a una URL específica
- Usa el algoritmo Readability para extraer el contenido principal (eliminando navegación, anuncios, etc.)
- Convierte HTML a Markdown o texto plano
- No ejecuta JavaScript

### ¿Por qué se necesitan dos herramientas?

```
┌─────────────────┐     web_search      ┌──────────────────┐
│  Usuario pregunta a IA│ ──────────────────→  │   API de motor de búsqueda   │
│ "Noticias más recientes"│                      │   (Brave/Perplexity) │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   IA obtiene 5 resultados                    Devuelve resultados de búsqueda
        ↓
┌─────────────────┐     web_fetch       ┌──────────────────┐
│  IA selecciona resultado  │ ──────────────────→  │   Página web objetivo   │
│ "Abrir enlace 1" │                      │   (HTTP/HTTPS)   │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   IA obtiene contenido completo                    Extrae Markdown
```

**Flujo de trabajo típico**:
1. La IA usa **web_search** para buscar información relevante
2. La IA selecciona enlaces apropiados de los resultados de búsqueda
3. La IA usa **web_fetch** para hacer scraping del contenido de la página específica
4. La IA responde la pregunta del usuario basándose en el contenido

### Mecanismo de caché

Ambas herramientas incluyen caché incorporada para reducir solicitudes duplicadas:

| Herramienta | Clave de caché | TTL predeterminado | Elemento de configuración |
|------|---------|----------|--------|
| web_search | `provider:query:count:country:search_lang:ui_lang:freshness` | 15 minutos | `tools.web.search.cacheTtlMinutes` |
| web_fetch | `fetch:url:extractMode:maxChars` | 15 minutos | `tools.web.fetch.cacheTtlMinutes` |

::: info Beneficios del caché
- Reduce el número de llamadas a API externas (ahorra costos)
- Acelera el tiempo de respuesta (misma consulta devuelve caché directamente)
- Evita limitación de frecuencia por solicitudes frecuentes
:::

## Sígueme

### Paso 1: Seleccionar proveedor de búsqueda

Clawdbot soporta dos proveedores de búsqueda:

| Proveedor | Ventajas | Desventajas | API Key |
|--------|------|--------|---------|
| **Brave** (predeterminado) | Rápido, resultados estructurados, capa gratuita | Resultados de búsqueda tradicionales | `BRAVE_API_KEY` |
| **Perplexity** | Respuestas sintetizadas por IA, citaciones, en tiempo real | Requiere acceso a Perplexity u OpenRouter | `OPENROUTER_API_KEY` o `PERPLEXITY_API_KEY` |

::: tip Selección recomendada
- **Principiantes**: Se recomienda usar Brave (la capa gratuita es suficiente para uso diario)
- **Necesitas resumen de IA**: Elige Perplexity (devuelve respuestas sintetizadas en lugar de resultados originales)
:::

### Paso 2: Obtener API Key de Brave Search

**Por qué usar Brave**: Capa gratuita generosa, rápido, resultados estructurados fáciles de analizar

#### 2.1 Registrarse en Brave Search API

1. Visita https://brave.com/search/api/
2. Crea una cuenta e inicia sesión
3. En Dashboard selecciona el plan **"Data for Search"** (no "Data for AI")
4. Genera API Key

#### 2.2 Configurar API Key

**Método A: Usar CLI (recomendado)**

```bash
# Ejecutar asistente de configuración interactivo
clawdbot configure --section web
```

CLI te pedirá que ingreses la API Key y la guardará en `~/.clawdbot/clawdbot.json`.

**Método B: Usar variables de entorno**

Agrega API Key a las variables de entorno del proceso Gateway:

```bash
# Agregar en ~/.clawdbot/.env
echo "BRAVE_API_KEY=tuAPIKey" >> ~/.clawdbot/.env

# Reiniciar Gateway para que las variables de entorno surtan efecto
clawdbot gateway restart
```

**Método C: Editar archivo de configuración directamente**

Edita `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "apiKey": "BRAVE_API_KEY_HERE",
        "provider": "brave"
      }
    }
  }
}
```

**Lo que deberías ver**:

- Después de guardar la configuración, reinicia Gateway
- En el canal configurado (como WhatsApp) envía mensaje: "Ayúdame a buscar las noticias más recientes de IA"
- La IA debería devolver resultados de búsqueda (título, URL, descripción)

### Paso 3: Configurar parámetros avanzados de web_search

Puedes configurar más parámetros en `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,           // Si está habilitado (predeterminado true)
        "provider": "brave",       // Proveedor de búsqueda
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 5,          // Número de resultados a devolver (1-10, predeterminado 5)
        "timeoutSeconds": 30,       // Tiempo de espera (predeterminado 30)
        "cacheTtlMinutes": 15      // Tiempo de caché (predeterminado 15 minutos)
      }
    }
  }
}
```

#### 3.1 Configurar región e idioma

Haz que los resultados de búsqueda sean más precisos:

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 10,
        // Opcional: La IA puede anular estos valores al llamar
        "defaultCountry": "US",   // País predeterminado (código de 2 caracteres)
        "defaultSearchLang": "en",  // Idioma de resultados de búsqueda
        "defaultUiLang": "en"      // Idioma de elementos UI
      }
    }
  }
}
```

**Códigos de país comunes**: `US` (EE.UU.), `DE` (Alemania), `FR` (Francia), `CN` (China), `JP` (Japón), `ALL` (Global)

**Códigos de idioma comunes**: `en` (inglés), `zh` (chino), `fr` (francés), `de` (alemán), `es` (español)

#### 3.2 Configurar filtro de tiempo (exclusivo de Brave)

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        // Opcional: La IA puede anular al llamar
        "defaultFreshness": "pw"  // Filtrar resultados de la última semana
      }
    }
  }
}
```

**Valores de Freshness**:
- `pd`: Últimas 24 horas
- `pw`: Última semana
- `pm`: Último mes
- `py`: Último año
- `YYYY-MM-DDtoYYYY-MM-DD`: Rango de fechas personalizado (ej: `2024-01-01to2024-12-31`)

### Paso 4: Configurar Perplexity Sonar (opcional)

Si prefieres respuestas sintetizadas por IA, puedes usar Perplexity.

#### 4.1 Obtener API Key

**Método A: Conexión directa a Perplexity**

1. Visita https://www.perplexity.ai/
2. Crea una cuenta y suscríbete
3. Genera API Key en Settings (comienza con `pplx-`)

**Método B: A través de OpenRouter (no requiere tarjeta de crédito)**

1. Visita https://openrouter.ai/
2. Crea una cuenta y recarga (soporta criptomoneda o prepago)
3. Genera API Key (comienza con `sk-or-v1-`)

#### 4.2 Configurar Perplexity

Edita `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "perplexity",
        "perplexity": {
          // API Key (opcional, también se puede configurar mediante variables de entorno)
          "apiKey": "sk-or-v1-...",  // o "pplx-..."
          // Base URL (opcional, Clawdbot inferirá automáticamente según API Key)
          "baseUrl": "https://openrouter.ai/api/v1",  // o "https://api.perplexity.ai"
          // Modelo (predeterminado perplexity/sonar-pro)
          "model": "perplexity/sonar-pro"
        }
      }
    }
  }
}
```

::: info Inferencia automática de Base URL
Si omites `baseUrl`, Clawdbot seleccionará automáticamente según el prefijo de API Key:
- `pplx-...` → `https://api.perplexity.ai`
- `sk-or-...` → `https://openrouter.ai/api/v1`
:::

#### 4.3 Seleccionar modelo de Perplexity

| Modelo | Descripción | Caso de uso |
|------|------|----------|
| `perplexity/sonar` | Respuestas rápidas + búsqueda web | Consultas simples, búsqueda rápida |
| `perplexity/sonar-pro` (predeterminado) | Razonamiento de múltiples pasos + búsqueda web | Problemas complejos, requiere razonamiento |
| `perplexity/sonar-reasoning-pro` | Análisis de cadena de pensamiento | Investigación profunda, requiere proceso de razonamiento |

### Paso 5: Configurar herramienta web_fetch

web_fetch está habilitado por defecto y se puede usar sin configuración adicional. Pero puedes ajustar parámetros:

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "enabled": true,           // Si está habilitado (predeterminado true)
        "maxChars": 50000,        // Número máximo de caracteres (predeterminado 50000)
        "timeoutSeconds": 30,       // Tiempo de espera (predeterminado 30)
        "cacheTtlMinutes": 15,     // Tiempo de caché (predeterminado 15 minutos)
        "maxRedirects": 3,         // Número máximo de redirecciones (predeterminado 3)
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "readability": true         // Si habilitar Readability (predeterminado true)
      }
    }
  }
}
```

#### 5.1 Configurar respaldo de Firecrawl (opcional)

Si la extracción de Readability falla, puedes usar Firecrawl como respaldo (requiere API Key):

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "readability": true,
        "firecrawl": {
          "enabled": true,
          "apiKey": "FIRECRAWL_API_KEY_HERE",  // o establecer variable de entorno FIRECRAWL_API_KEY
          "baseUrl": "https://api.firecrawl.dev",
          "onlyMainContent": true,  // Solo extraer contenido principal
          "maxAgeMs": 86400000,    // Tiempo de caché (milisegundos, predeterminado 1 día)
          "timeoutSeconds": 60
        }
      }
    }
  }
}
```

::: tip Ventajas de Firecrawl
- Soporta renderizado de JavaScript (requiere habilitación)
- Mayor capacidad para evitar anti-scraping
- Soporta sitios web complejos (SPA, aplicaciones de una sola página)
:::

**Obtener API Key de Firecrawl**:
1. Visita https://www.firecrawl.dev/
2. Crea una cuenta y genera API Key
3. Configura en configuración o usa variable de entorno `FIRECRAWL_API_KEY`

### Paso 6: Verificar configuración

**Verificar web_search**:

Envía mensaje en el canal configurado (como WebChat):

```
Ayúdame a buscar las nuevas características de TypeScript 5.0
```

**Lo que deberías ver**:
- La IA devuelve 5 resultados de búsqueda (título, URL, descripción)
- Si usas Perplexity, devuelve respuestas resumidas por IA + enlaces de citación

**Verificar web_fetch**:

Envía mensaje:

```
Ayúdame a obtener el contenido de https://www.typescriptlang.org/docs/handbook/intro.html
```

**Lo que deberías ver**:
- La IA devuelve el contenido en formato Markdown de esa página
- El contenido ya tiene navegación, anuncios y otros elementos irrelevantes eliminados

### Paso 7: Probar funciones avanzadas

**Probar filtro de región**:

```
Busca cursos de entrenamiento de TypeScript en Alemania
```

La IA puede usar el parámetro `country: "DE"` para búsqueda específica de región.

**Probar filtro de tiempo**:

```
Busca noticias del campo de IA de la última semana
```

La IA puede usar el parámetro `freshness: "pw"` para filtrar resultados de la última semana.

**Probar modo de extracción**:

```
Obtén https://example.com y devuélvelo en formato de texto plano
```

La IA puede usar el parámetro `extractMode: "text"` para obtener texto plano en lugar de Markdown.

## Punto de verificación ✅

Asegúrate de que la siguiente configuración sea correcta:

- [ ] Gateway está ejecutándose
- [ ] Al menos un proveedor de búsqueda configurado (Brave o Perplexity)
- [ ] API Key guardada correctamente (vía CLI o variables de entorno)
- [ ] Prueba de web_search exitosa (devuelve resultados de búsqueda)
- [ ] Prueba de web_fetch exitosa (devuelve contenido de página)
- [ ] Configuración de caché razonable (evitar solicitudes excesivas)

::: tip Comandos de verificación rápida
```bash
# Ver configuración de Gateway
clawdbot configure --show

# Ver logs de Gateway
clawdbot gateway logs --tail 50
```
:::

## Evitar trampas

### Error común 1: API Key no configurada

**Mensaje de error**:

```json
{
  "error": "missing_brave_api_key",
  "message": "web_search needs a Brave Search API key. Run `clawdbot configure --section web` to store it, or set BRAVE_API_KEY in Gateway environment."
}
```

**Solución**:

1. Ejecuta `clawdbot configure --section web`
2. Ingresa API Key
3. Reinicia Gateway: `clawdbot gateway restart`

### Error común 2: Falla de scraping (páginas web dinámicas)

**Problema**: web_fetch no puede extraer contenido que requiere JavaScript.

**Solución**:

1. Confirma si el sitio web es SPA (aplicación de una sola página)
2. Si es así, usa [herramienta browser](../tools-browser/)
3. O configura respaldo de Firecrawl (requiere API Key)

### Error común 3: Contenido caducado por caché

**Problema**: Los resultados de búsqueda o contenido extraído son antiguos.

**Solución**:

1. Ajusta la configuración `cacheTtlMinutes`
2. O solicita explícitamente "no usar caché" en el diálogo con IA
3. Reinicia Gateway para borrar caché en memoria

### Error común 4: Tiempo de espera de solicitud agotado

**Problema**: Tiempo de espera al hacer scraping de páginas grandes o sitios web lentos.

**Solución**:

```json5
{
  "tools": {
    "web": {
      "search": {
        "timeoutSeconds": 60
      },
      "fetch": {
        "timeoutSeconds": 60
      }
    }
  }
}
```

### Error común 5: IP de red interna bloqueada por SSRF

**Problema**: El scraping a direcciones de red interna (como `http://localhost:8080`) está bloqueado.

**Solución**:

web_fetch por defecto bloquea IPs de red interna para evitar ataques SSRF. Si realmente necesitas acceder a red interna:

1. Usa [herramienta browser](../tools-browser/) (más flexible)
2. O edita configuración para permitir hosts específicos (requiere modificar código fuente)

## Resumen de esta lección

- **web_search**: Herramienta de búsqueda web, soporta Brave (resultados estructurados) y Perplexity (respuestas sintetizadas por IA)
- **web_fetch**: Herramienta de scraping de contenido web, usa Readability para extraer contenido principal (HTML → Markdown/text)
- Ambas incluyen caché incorporada (predeterminado 15 minutos), reducen solicitudes duplicadas
- API Key de Brave se puede configurar vía CLI, variables de entorno o archivo de configuración
- Perplexity soporta dos métodos: conexión directa y OpenRouter
- Para sitios web que requieren JavaScript, usa [herramienta browser](../tools-browser/)
- Parámetros de configuración incluyen: número de resultados, tiempo de espera, región, idioma, filtro de tiempo, etc.

## Vista previa de la próxima lección

> En la próxima lección aprenderemos **[Canvas interfaz visual y A2UI](../canvas/)**.
>
> Aprenderás:
> - Mecanismo de push de Canvas A2UI
> - Operación de interfaz visual
> - Cómo hacer que el asistente de IA controle elementos de Canvas

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función | Ruta de archivo | Número de línea |
|------|----------|------|
| Definición de herramienta web_search | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 409-483 |
| Definición de herramienta web_fetch | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 572-624 |
| Llamada a API de Brave Search | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 309-407 |
| Llamada a API de Perplexity | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 268-307 |
| Extracción de contenido Readability | [`src/agents/tools/web-fetch-utils.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch-utils.ts) | - |
| Integración de Firecrawl | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 257-330 |
| Implementación de caché | [`src/agents/tools/web-shared.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-shared.ts) | - |
| Protección SSRF | [`src/infra/net/ssrf.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/net/ssrf.ts) | - |
| Schema de configuración | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**Constantes clave**:

- `DEFAULT_SEARCH_COUNT = 5`: Número predeterminado de resultados de búsqueda
- `MAX_SEARCH_COUNT = 10`: Número máximo de resultados de búsqueda
- `DEFAULT_CACHE_TTL_MINUTES = 15`: Tiempo predeterminado de caché (minutos)
- `DEFAULT_TIMEOUT_SECONDS = 30`: Tiempo predeterminado de espera (segundos)
- `DEFAULT_FETCH_MAX_CHARS = 50_000`: Número máximo de caracteres de scraping predeterminado

**Funciones clave**:

- `createWebSearchTool()`: Crea instancia de herramienta web_search
- `createWebFetchTool()`: Crea instancia de herramienta web_fetch
- `runWebSearch()`: Ejecuta búsqueda y devuelve resultados
- `runWebFetch()`: Ejecuta scraping y extrae contenido
- `normalizeFreshness()`: Normaliza parámetros de filtro de tiempo
- `extractReadableContent()`: Extrae contenido usando Readability

</details>
