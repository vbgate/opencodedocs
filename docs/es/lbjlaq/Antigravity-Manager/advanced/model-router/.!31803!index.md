---
title: "Enrutamiento de modelos: Mapeo personalizado | Antigravity-Manager"
sidebarTitle: "Enrutamiento personalizado de modelos"
subtitle: "Enrutamiento de modelos: Mapeo personalizado, prioridad de comodines y estrategias predefinidas"
description: "Aprende la configuración de enrutamiento de modelos de Antigravity Tools. Implementa mapeo de nombres de modelos mediante custom_mapping, entiende las reglas de coincidencia exacta y con comodines, usa preajustes para adaptarte a OpenAI/Claude, y valida el enrutamiento mediante X-Mapped-Model."
tags:
  - "Enrutamiento de modelos"
  - "custom_mapping"
  - "Comodines"
  - "Compatible con OpenAI"
  - "Compatible con Claude"
prerequisite:
  - "start-proxy-and-first-client"
  - "platforms-openai"
order: 4
---
# Enrutamiento de modelos: Mapeo personalizado, prioridad de comodines y estrategias predefinidas

El `model` que escribes en el cliente no es necesariamente igual al "modelo físico" que Antigravity Tools finalmente usa al solicitar al upstream. Lo que hace el **enrutamiento de modelos** es muy simple: mapear los "nombres de modelo estables externamente" a "modelos que realmente se usarán internamente", y poner el resultado en el encabezado de respuesta `X-Mapped-Model` para que puedas confirmar si has llegado a la ruta esperada.

## Lo que podrás hacer al finalizar

- Configurar `proxy.custom_mapping` en la UI (mapeo exacto + mapeo con comodines)
- Explicar claramente cómo se hace coincidir una regla (exacta > comodín > mapeo predeterminado)
- Aplicar reglas predefinidas con un clic para adaptarte rápidamente a clientes OpenAI/Claude
- Usar `curl -i` para verificar `X-Mapped-Model` y localizar "por qué no siguió la ruta que esperaba"

## Tu situación actual

- Quieres que el cliente siempre escriba `gpt-4o`, pero quieres que el upstream se estabilice en un modelo Gemini específico
- Tienes muchos nombres de modelos versionados (por ejemplo `gpt-4-xxxx`), y no quieres agregar mapeos manualmente cada vez
- Ves que la solicitud se realizó con éxito, pero no estás seguro de qué modelo físico se está ejecutando

## Cuándo utilizar este método

- Quieres proporcionar al equipo un "conjunto de modelos externos fijo" para blindar cambios de modelos upstream
- Quieres enrutar unificados múltiples nombres de modelos OpenAI/Claude a pocos modelos de alta rentabilidad
- Al solucionar problemas de 401/429/0 token, necesitas confirmar el modelo real después del mapeo

## 🎒 Preparativos previos

- Ya puedes iniciar el proxy inverso local y realizar solicitudes desde el exterior (se recomienda completar primero [Iniciar proxy inverso local y conectar el primer cliente (/healthz + configuración SDK)](/es/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/))
- Sabes cómo usar `curl -i` para ver los encabezados de respuesta (usaste `X-Mapped-Model` en la lección anterior)

::: info Dos palabras clave en esta lección
- **`custom_mapping`**: Tu "tabla de reglas personalizadas", la clave es el nombre del modelo pasado por el cliente (o patrón de comodín), el valor es el nombre del modelo final a usar (fuente: `src/types/config.ts`).
- **Comodín `*`**: Para coincidir nombres de modelos por lotes (por ejemplo `gpt-4*`), la implementación de coincidencia es **distinguible entre mayúsculas y minúsculas** (fuente: `src-tauri/src/proxy/common/model_mapping.rs`).
:::

## Enfoque central

Al procesar solicitudes, el backend primero calculará un `mapped_model`:

1. Primero verifica si `custom_mapping` tiene una **coincidencia exacta** (la clave es exactamente igual a `model`)
2. Luego intenta coincidir con comodín: elige la regla con "**más caracteres que no son `*`**" (las reglas más específicas tienen prioridad)
3. Si no hay coincidencia, usa el mapeo predeterminado del sistema (por ejemplo, algunos alias de modelos OpenAI/Claude mapeados a modelos internos)

Este `mapped_model` se escribirá en el encabezado de respuesta `X-Mapped-Model` (al menos el handler OpenAI lo hace), y puedes usarlo para confirmar "en qué se convirtió el model que escribí".

::: tip Semántica de recarga en caliente (sin reiniciar)
Cuando el servicio de proxy inverso está en ejecución, el frontend llama a `update_model_mapping` y el backend inmediatamente escribe `custom_mapping` en el `RwLock` en memoria, y también lo guarda en la configuración persistente (fuente: `src-tauri/src/commands/proxy.rs`; `src-tauri/src/proxy/server.rs`).
:::

## Sigue mis pasos

### Paso 1: Encontrar la tarjeta "Enrutamiento de modelos" en la página API Proxy

**Por qué**
La entrada de configuración de enrutamiento de modelos está en la UI; no necesitas editar archivos de configuración manualmente.

Abre Antigravity Tools -> página `API Proxy`, desplázate hacia abajo.

**Lo que deberías ver**: una tarjeta con un título similar a "Centro de enrutamiento de modelos", con dos botones en la esquina superior derecha: "Aplicar mapeo predefinido" y "Restablecer mapeo" (fuente: `src/pages/ApiProxy.tsx`).

### Paso 2: Agregar un "mapeo exacto" (el más controlable)

**Por qué**
El mapeo exacto tiene la prioridad más alta, adecuado para "quiero que este nombre de modelo vaya a este modelo físico".

En el área "Agregar mapeo":

- Original: escribe el nombre del modelo que quieres exponer externamente, por ejemplo `gpt-4o`
- Target: selecciona un modelo objetivo del menú desplegable, por ejemplo `gemini-3-flash`

Haz clic en Add.

**Lo que deberías ver**: aparece `gpt-4o -> gemini-3-flash` en la lista de mapeo, y aparece un mensaje de guardado exitoso.

### Paso 3: Agregar un "mapeo con comodín" (cobertura por lotes)

**Por qué**
Cuando tienes muchos nombres de modelos versionados (por ejemplo `gpt-4-turbo`, `gpt-4-1106-preview`), usar comodines te ahorra muchas configuraciones repetitivas.

Agrega otro mapeo:

- Original: `gpt-4*`
- Target: `gemini-3-pro-high`

**Lo que deberías ver**: aparece `gpt-4* -> gemini-3-pro-high` en la lista.

::: warning El "hueco" de prioridad de reglas
Cuando `gpt-4o` cumple tanto con la regla exacta `gpt-4o` como con la regla de comodín `gpt-4*`, el backend primero seguirá la coincidencia exacta (fuente: `src-tauri/src/proxy/common/model_mapping.rs`).
:::

### Paso 4: Aplicar reglas predefinidas con un clic (compatibilidad rápida)

**Por qué**
Si tu objetivo principal es "adaptarte rápidamente a nombres de modelos comunes OpenAI/Claude", los preajustes pueden llenar un lote de reglas de comodín por ti.

Haz clic en "Aplicar mapeo predefinido".

**Lo que deberías ver**: se agregan múltiples reglas nuevas a la lista, incluyendo las siguientes (fuente: `src/pages/ApiProxy.tsx`):

```json
{
  "gpt-4*": "gemini-3-pro-high",
  "gpt-4o*": "gemini-3-flash",
  "gpt-3.5*": "gemini-2.5-flash",
  "o1-*": "gemini-3-pro-high",
  "o3-*": "gemini-3-pro-high",
  "claude-3-5-sonnet-*": "claude-sonnet-4-5",
  "claude-3-opus-*": "claude-opus-4-5-thinking",
  "claude-opus-4-*": "claude-opus-4-5-thinking",
  "claude-haiku-*": "gemini-2.5-flash",
  "claude-3-haiku-*": "gemini-2.5-flash"
}
```

### Paso 5: Usar `X-Mapped-Model` para verificar si el enrutamiento está en vigor

**Por qué**
Quieres confirmar "la configuración se guardó", y aún más confirmar "la solicitud realmente siguió esta regla". La forma más fácil es mirar `X-Mapped-Model`.

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

```powershell [Windows]
$resp = Invoke-WebRequest "http://127.0.0.1:8045/v1/chat/completions" -Method Post -ContentType "application/json" -Body '{
  "model": "gpt-4o",
  "messages": [{"role": "user", "content": "hi"}]
}'
$resp.Headers["X-Mapped-Model"]
```

:::

**Lo que deberías ver**: el encabezado de respuesta contiene `X-Mapped-Model: ...`. Si en el paso 2 mapeaste exactamente `gpt-4o` a `gemini-3-flash`, aquí deberías poder ver el valor correspondiente (escritura del encabezado de respuesta en `src-tauri/src/proxy/handlers/openai.rs`).

### Paso 6: Cuando necesites volver a "mapeo puramente predeterminado", restablecer custom_mapping

**Por qué**
Al solucionar problemas, a menudo quieres primero excluir "el impacto de reglas personalizadas". Limpiar `custom_mapping` es el medio de retroceso más directo.

Haz clic en "Restablecer mapeo".

**Lo que deberías ver**: la lista de mapeo se limpia; después de hacer solicitudes, si no coincide con reglas personalizadas, seguirá el mapeo predeterminado del sistema (fuente: `src/pages/ApiProxy.tsx`; `src-tauri/src/proxy/common/model_mapping.rs`).

## Punto de verificación ✅

- [ ] Puedes agregar/eliminar reglas `custom_mapping` en la UI
- [ ] Puedes explicar claramente: por qué las reglas exactas tienen prioridad sobre las reglas de comodín
- [ ] Puedes leer `X-Mapped-Model` usando `curl -i` o PowerShell

## Recordatorio de errores comunes

| Escenario | Lo que podrías hacer (❌) | Recomendación (✓) |
|--- | --- | ---|
| El comodín no funciona | Escribes `GPT-4*` esperando coincidir con `gpt-4-turbo` | Usa minúsculas `gpt-4*`; la coincidencia de comodines del backend distingue mayúsculas y minúsculas |
| Dos comodines pueden coincidir | Escribes `gpt-*` y `gpt-4*` al mismo tiempo, no estás seguro de cuál se seguirá | Haz que la regla más específica sea más "larga", asegurando que tenga más caracteres que no son `*` |
| La regla parece correcta, pero no cambia | Solo miras el cuerpo de respuesta, no el encabezado de respuesta | Usa `curl -i` para confirmar `X-Mapped-Model` (este es el resultado explícitamente devuelto por el backend) |
| Dos reglas "igualmente específicas" | Escribes dos comodines, el número de caracteres que no son `*` es el mismo | Evita esta configuración; los comentarios del código fuente explican que en este caso el resultado depende del orden de recorrido de `HashMap`, puede ser inestable (fuente: `src-tauri/src/proxy/common/model_mapping.rs`) |

## Resumen de la lección

- `proxy.custom_mapping` es tu entrada principal para controlar "nombre de modelo externo → modelo físico"
- La prioridad de enrutamiento del backend es: coincidencia exacta > coincidencia de comodín (más específico tiene prioridad) > mapeo predeterminado del sistema
- `X-Mapped-Model` es el medio de verificación más confiable, priorízalo al solucionar problemas

## Vista previa de la próxima lección

> En la próxima lección continuaremos viendo **Gestión de cuotas: La combinación de Quota Protection + Smart Warmup** (capítulo correspondiente: `advanced-quota`).

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Campo de configuración: `proxy.custom_mapping` (tipo frontend) | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L6-L20) | 6-20 |
| UI: escribir/restablecer/preajuste (llamar a `update_model_mapping`) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L371-L475) | 371-475 |
| UI: tarjeta de enrutamiento de modelos (aplicar mapeo predefinido / restablecer mapeo / lista y formulario de agregar) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1762-L1931) | 1762-1931 |
| Comando backend: recarga en caliente y persistencia de `custom_mapping` | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L344-L365) | 344-365 |
| Estado del servidor: `custom_mapping` guardado con `RwLock<HashMap<..>>` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L16-L53) | 16-53 |
| Algoritmo de enrutamiento: exacto > comodín (más específico prioridad) > mapeo predeterminado | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
| Coincidencia de comodín: soporta múltiples `*`, y distingue mayúsculas y minúsculas | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L134-L178) | 134-178 |
| Calcular `mapped_model` en la solicitud (ejemplo: handler OpenAI) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L154-L159) | 154-159 |
|--- | --- | ---|

**Funciones clave**:
- `resolve_model_route(original_model, custom_mapping)`: entrada principal de enrutamiento de modelos (ver `src-tauri/src/proxy/common/model_mapping.rs`)

</details>
