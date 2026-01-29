---
title: "Error 404 de ruta incompatible: Configuración de Base URL | Antigravity-Manager"
sidebarTitle: "Arreglar error 404 de ruta"
subtitle: "404/Ruta incompatible: Base URL, prefijo /v1 y clientes de rutas superpuestas"
description: "Aprende a resolver problemas de incompatibilidad de rutas 404 al integrar Antigravity Tools. Domina la configuración correcta de Base URL, evita la duplicación del prefijo /v1 y gestiona clientes con rutas superpuestas, cubriendo escenarios comunes."
tags:
  - "faq"
  - "base-url"
  - "404"
  - "openai"
  - "anthropic"
  - "gemini"
prerequisite:
  - "start-proxy-and-first-client"
  - "faq-auth-401"
order: 4
---

# 404/Ruta incompatible: Base URL, prefijo /v1 y clientes de rutas superpuestas

## Lo que podrás hacer al finalizar

- Cuando veas un error 404, primero determina si es un "problema de concatenación de Base URL" o "fallo de autenticación/servicio no iniciado"
- Selecciona la Base URL correcta según el tipo de cliente (si debe incluir `/v1` o no)
- Identificar dos errores comunes de alta frecuencia: prefijos duplicados (`/v1/v1/...`) y rutas superpuestas (`/v1/chat/completions/responses`)

## Tu situación actual

Al integrar clientes externos, encuentras el error `404 Not Found` y tras investigar descubres que es un problema de configuración de Base URL:

- Kilo Code falla, el registro muestra que `/v1/chat/completions/responses` no se encuentra
- Claude Code puede conectarse, pero siempre indica incompatibilidad de rutas
- El SDK de OpenAI en Python reporta `404`, aunque el servicio está claramente iniciado

La raíz de estos problemas no es la cuota de cuenta ni la autenticación, sino que el cliente concatena "su propia ruta" a la Base URL que escribiste, lo que hace que la ruta sea incorrecta.

## Cuándo utilizar este método

- Confirmas que el proxy inverso está iniciado, pero todas las llamadas a la API devuelven 404
- Escribiste la Base URL con una ruta (por ejemplo `/v1/...`), pero no sabes si el cliente la volverá a concatenar
- El cliente que usas "tiene su propia lógica de concatenación de rutas" y las rutas solicitadas no parecen ser las estándar de OpenAI/Anthropic/Gemini

## 🎒 Preparativos previos

Primero descarta "servicio no iniciado/fallo de autenticación", de lo contrario te perderás cada vez más en la dirección equivocada.

### Paso 1: Confirmar que el proxy inverso está funcionando

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/healthz
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/healthz | Select-Object -ExpandProperty Content
```

:::

**Deberías ver**: HTTP 200, devuelve JSON (al menos debe contener `{"status":"ok"}`).

### Paso 2: Confirmar que te encuentras con un error 404 (no 401)

Si estás en modo `auth_mode=strict/all_except_health/auto(allow_lan_access=true)` y no proporcionaste una clave, es más probable que encuentres un 401. Primero mira el código de estado y, si es necesario, completa primero **[Solución de problemas de fallo de autenticación 401](../auth-401/)**.

## ¿Qué es Base URL?

**Base URL** es la "dirección raíz" desde la que el cliente envía solicitudes. Normalmente, el cliente concatena su ruta de API a la Base URL antes de realizar la solicitud, por lo que si la Base URL debe incluir `/v1` o no depende de qué ruta agregará el cliente. Siempre que alinees la ruta final de la solicitud con el enrutamiento de Antigravity Tools, no volverás a quedar bloqueado por un 404.

## Idea clave

Las rutas de proxy inverso de Antigravity Tools están "codificadas con rutas completas" (consulta `src-tauri/src/proxy/server.rs`), y los puntos de entrada comunes son:

| Protocolo | Ruta | Uso |
|--- | --- | ---|
| OpenAI | `/v1/models` | Listar modelos |
| OpenAI | `/v1/chat/completions` | Completado de chat |
| OpenAI | `/v1/responses` | Compatibilidad con Codex CLI |
| Anthropic | `/v1/messages` | API de mensajes de Claude |
| Gemini | `/v1beta/models` | Listar modelos |
| Gemini | `/v1beta/models/:model` | Generar contenido |
| Comprobación de estado | `/healthz` | Punto final de verificación de estado |

Lo que debes hacer: hacer que la "ruta final" concatenada por el cliente coincida exactamente con estas rutas.

---

## Sigue los pasos

### Paso 1: Usa curl para probar primero la "ruta correcta"

**Por qué**
Primero confirma que el "protocolo que quieres usar" realmente tiene una ruta correspondiente localmente, evitando confundir un 404 con un "problema de modelo/cuenta".

::: code-group

```bash [macOS/Linux]
 # Protocolo OpenAI: listar modelos
curl -i http://127.0.0.1:8045/v1/models

 # Protocolo Anthropic: interfaz de mensajes (aquí solo miramos 404/401, no necesariamente éxito)
curl -i http://127.0.0.1:8045/v1/messages

 # Protocolo Gemini: listar modelos
curl -i http://127.0.0.1:8045/v1beta/models
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/models | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/messages | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1beta/models | Select-Object -ExpandProperty StatusCode
```

:::

**Deberías ver**: Estas rutas al menos no deberían ser 404. Si aparece 401, primero configura la clave siguiendo **[Solución de problemas de fallo de autenticación 401](../auth-401/)**.

### Paso 2: Selecciona la Base URL según si el cliente "concatena /v1 por sí mismo"

**Por qué**
El problema de Base URL es esencialmente que "la ruta que escribiste" y "la ruta que agrega el cliente" se superponen.

| Lo que estás usando | Recomendación de Base URL | Ruta con la que te alineas |
|--- | --- | ---|
| SDK de OpenAI (Python/Node, etc.) | `http://127.0.0.1:8045/v1` | `/v1/chat/completions`, `/v1/models` |
| Claude Code CLI (Anthropic) | `http://127.0.0.1:8045` | `/v1/messages` |
| SDK de Gemini / cliente en modo Gemini | `http://127.0.0.1:8045` | `/v1beta/models/*` |

::: tip Regla mnemotécnica
El SDK de OpenAI generalmente requiere que coloques `/v1` en la Base URL; para Anthropic/Gemini es más común escribir solo hasta host:port.
:::

### Paso 3: Manejar clientes de "rutas superpuestas" como Kilo Code

**Por qué**
Antigravity Tools no tiene la ruta `/v1/chat/completions/responses`. Si el cliente concatena esta ruta, siempre dará 404.

Sigue la configuración recomendada en el README:

1. Selección de protocolo: prioriza el **protocolo Gemini**
2. Base URL: escribe `http://127.0.0.1:8045`

**Deberías ver**: Las solicitudes seguirán la ruta `/v1beta/models/...` y ya no aparecerá `/v1/chat/completions/responses`.

### Paso 4: No escribas la Base URL en una "ruta de recursos específica"

**Por qué**
La mayoría de los SDK concatenan su ruta de recursos después de la Base URL. Si escribes la Base URL demasiado profunda, finalmente se convertirá en una "ruta de doble capa".

✅ Recomendado (SDK de OpenAI):

```text
http://127.0.0.1:8045/v1
```

❌ Error común:

```text
http://127.0.0.1:8045
http://127.0.0.1:8045/v1/chat/completions
```

**Deberías ver**: Después de hacer la Base URL más superficial, la ruta de solicitud vuelve a `/v1/...` o `/v1beta/...` y el 404 desaparece.

---

## Punto de verificación ✅

Puedes usar esta tabla para verificar rápidamente si tu "ruta de solicitud final" puede coincidir con las rutas de Antigravity Tools:

| Ruta que ves en los registros | Conclusión |
|--- | ---|
| Empieza con `/v1/` (por ejemplo `/v1/models`, `/v1/chat/completions`) | Usa rutas compatibles con OpenAI/Anthropic |
| Empieza con `/v1beta/` (por ejemplo `/v1beta/models/...`) | Usa rutas nativas de Gemini |
| Aparece `/v1/v1/` | La Base URL incluye `/v1` y el cliente la concatenó nuevamente |
| Aparece `/v1/chat/completions/responses` | Cliente de rutas superpuestas, la tabla de rutas actual no lo soporta |

---

## Advertencia sobre errores comunes

### Error 1: Prefijo /v1 duplicado

**Síntoma**: La ruta se convierte en `/v1/v1/chat/completions`

**Causa**: La Base URL ya incluye `/v1`, y el cliente la concatenó nuevamente.

**Solución**: Cambia la Base URL para que termine en `/v1`, no sigas escribiendo rutas de recursos específicas después.

### Error 2: Cliente de rutas superpuestas

**Síntoma**: La ruta se convierte en `/v1/chat/completions/responses`

**Causa**: El cliente agregó una ruta de negocio sobre la ruta del protocolo OpenAI.

**Solución**: Prioriza cambiar a otros modos de protocolo del cliente (por ejemplo, Kilo Code usando Gemini).

### Error 3: Puerto incorrecto

**Síntoma**: `Connection refused` o tiempo de espera agotado

**Solución**: En la página "Proxy inverso de API" de Antigravity Tools, confirma el puerto de escucha actual (predeterminado 8045), el puerto de la Base URL debe ser coherente.

---

## Resumen de esta lección

| Síntoma | Causa más común | Cómo corregirlo |
|--- | --- | ---|
| Siempre 404 | Concatenación incorrecta de Base URL | Primero usa curl para verificar que `/v1/models`/`/v1beta/models` no son 404 |
| `/v1/v1/...` | `/v1` duplicado | La Base URL del SDK de OpenAI debe terminar en `/v1` |
| `/v1/chat/completions/responses` | Cliente de rutas superpuestas | Cambia al protocolo Gemini o haz reescritura de rutas (no recomendado para principiantes) |

---

## Próxima lección

> En la siguiente lección aprenderemos **[Interrupción de flujo y problema de 0 Token](../streaming-0token/)**
>
> Aprenderás:
> - Por qué las respuestas de flujo se interrumpen inesperadamente
> - Cómo solucionar errores de 0 Token
> - El mecanismo de respaldo automático de Antigravity

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Actualizado: 2026-01-23

| Función | Ruta del archivo | Líneas |
|--- | --- | ---|
| Definición de rutas de proxy inverso (tabla de rutas completa) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| `AxumServer::start()` (entrada de construcción de rutas) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L79-L216) | 79-216 |
| `health_check_handler()` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| README: Recomendación de Base URL para Claude Code | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L204) | 197-204 |
| README: Explicación de rutas superpuestas de Kilo Code y protocolo recomendado | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L206-L211) | 206-211 |
| README: Ejemplo de base_url para Python OpenAI SDK | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L213-L227) | 213-227 |

**Funciones clave**:
- `AxumServer::start()`: Inicia el servidor de proxy inverso Axum y registra todas las rutas externas
- `health_check_handler()`: Manejador de verificación de estado (`GET /healthz`)

</details>
