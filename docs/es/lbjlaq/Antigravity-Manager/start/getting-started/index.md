---
title: "Introducción: Puerta de enlace de IA local | Antigravity Manager"
sidebarTitle: "¿Qué es la puerta de enlace de IA local?"
subtitle: "Qué es Antigravity Tools: convierte «cuentas + protocolos» en una puerta de enlace de IA local"
description: "Comprende el posicionamiento central de Antigravity Manager. Proporciona una aplicación de escritorio y una puerta de enlace HTTP local, admite múltiples puntos finales de protocolo y programación de pools de cuentas, y te ayuda a comenzar rápidamente con el proxy inverso local y evitar errores comunes de configuración."
tags:
  - "Primeros pasos"
  - "Conceptos"
  - "Puerta de enlace local"
  - "API Proxy"
prerequisite: []
order: 1
---

# Qué es Antigravity Tools: convierte «cuentas + protocolos» en una puerta de enlace de IA local

Muchos clientes/SDK de IA tienen una barrera de entrada que no radica en «saber llamar a la API», sino en «a qué protocolo conectar realmente, cómo gestionar múltiples cuentas y cómo lograr la recuperación automática ante fallos». Antigravity Tools intenta condensar estas tres cosas en una única puerta de enlace local.

## Qué es Antigravity Tools

**Antigravity Tools** es una aplicación de escritorio: gestionas cuentas y configuraciones en la GUI, inicia un servicio de proxy inverso HTTP en tu máquina local, reenvía de forma unificada las solicitudes de diferentes proveedores/protocolos al upstream y convierte las respuestas al formato familiar para el cliente.

## Qué puedes hacer al finalizar

- Explicar claramente qué problema resuelve Antigravity Tools (y qué no resuelve)
- Reconocer sus componentes principales: GUI, pool de cuentas, puerta de enlace de proxy inverso HTTP, adaptación de protocolos
- Conocer los límites de seguridad predeterminados (127.0.0.1, puerto, modo de autenticación) y cuándo cambiarlos
- Saber a qué capítulo ir a continuación: instalación, agregar cuenta, iniciar proxy inverso, conectar cliente
## Tu situación actual

Es posible que hayas encontrado estos problemas:

- El mismo cliente debe admitir tres protocolos: OpenAI/Anthropic/Gemini, y la configuración suele escribirse de forma desordenada
- Tienes múltiples cuentas, pero cambiarlas, rotarlas y reintentar ante límites depende de operaciones manuales
- Cuando falla una solicitud, solo puedes suponer mirando los registros si es «cuenta no válida» o «límite de upstream/capacidad agotada»

El objetivo de Antigravity Tools es integrar estas «tareas periféricas» en una puerta de enlace local, de modo que tu cliente/SDK solo tenga que preocuparse por una cosa: enviar la solicitud localmente.

## Idea central

Puedes entenderla como una «puerta de enlace de programación de IA» local compuesta por tres capas:

1) GUI (aplicación de escritorio)
- Te permite gestionar cuentas, configuraciones, monitorización y estadísticas.
- La página principal incluye: Dashboard, Accounts, API Proxy, Monitor, Token Stats, Settings.

2) Servicio de proxy inverso HTTP (Axum Server)
- Expone al exterior múltiples puntos finales de protocolos y reenvía las solicitudes al handler correspondiente.
- El servicio de proxy inverso montará capas de autenticación, monitorización de middleware, CORS, Trace, etc.

3) Pool de cuentas y programación (TokenManager, etc.)
- Selecciona cuentas disponibles del pool local, actualiza tokens cuando es necesario y realiza rotación y auto-recuperación.

::: info ¿Qué significa «puerta de enlace local»?
«Local» aquí tiene su significado literal: el servicio se ejecuta en tu propia máquina, tus clientes (Claude Code, OpenAI SDK, varios clientes de terceros) apuntan la Base URL a `http://127.0.0.1:<port>`, la solicitud primero llega a la máquina local, y luego Antigravity Tools la reenvía al upstream.
:::
## Qué puntos finales expone

El servicio de proxy inverso registra múltiples conjuntos de puntos finales de protocolo en un Router, puedes memorizar primero estas «entradas»:

- Compatible con OpenAI: `/v1/chat/completions`, `/v1/completions`, `/v1/responses`, `/v1/models`
- Compatible con Anthropic: `/v1/messages`, `/v1/messages/count_tokens`
- Gemini nativo: `/v1beta/models`, `/v1beta/models/:model`, `/v1beta/models/:model/countTokens`
- Verificación de estado: `GET /healthz`

Si tu cliente puede conectar cualquiera de estos protocolos, teóricamente puedes dirigir las solicitudes a esta puerta de enlace local mediante «cambiar Base URL».

## Límites de seguridad predeterminados (no te saltes esto)

El mayor problema de este tipo de «proxy inverso local» no suele ser falta de funcionalidad, sino que la expongas sin querer.

Primero recuerda algunos valores predeterminados (todos provienen de la configuración predeterminada):

- Puerto predeterminado: `8045`
- Solo acceso local predeterminado: `allow_lan_access=false`, dirección de escucha `127.0.0.1`
- Modo de autenticación predeterminado: `auth_mode=off` (no requiere que el cliente lleve key)
- De forma predeterminada se generará un `api_key` de forma `sk-...` (para que lo actives cuando necesites autenticación)

::: warning ¿Cuándo es obligatorio activar la autenticación?
Siempre que habilites el acceso a la red de área local (`allow_lan_access=true`, la dirección de escucha cambia a `0.0.0.0`), debes activar la autenticación al mismo tiempo y gestionar la API Key como una contraseña.
:::
## Cuándo usar Antigravity Tools

Es más adecuado para estos escenarios:

- Tienes múltiples clientes/SDK de IA y quieres que pasen por un único Base URL
- Necesitas converger diferentes protocolos (OpenAI/Anthropic/Gemini) en el mismo conjunto de «salida local»
- Tienes múltiples cuentas y quieres que el sistema se encargue de la rotación y el manejo de estabilidad

Si solo quieres «escribir dos líneas de código y llamar directamente a la API oficial», y las cuentas/protocolos son muy fijos, puede que sea un poco pesado.

## Sígueme: primero establece un orden de uso correcto

Esta lección no te enseña la configuración detallada, solo alinea el orden principal para evitar que te quedes atascado por saltar pasos:

### Paso 1: Primero instala y luego inicia

**Por qué**
El lado de escritorio se encarga de la gestión de cuentas e iniciar el servicio de proxy inverso; sin él, no se puede hablar del OAuth/proxy inverso posterior.

Ve al siguiente capítulo y completa la instalación según el método de README.

**Deberías ver**: Puedes abrir Antigravity Tools y ver la página Dashboard.
### Paso 2: Agrega al menos una cuenta

**Por qué**
El servicio de proxy inverso necesita obtener una identidad disponible del pool de cuentas para enviar solicitudes al upstream; sin cuentas, la puerta de enlace tampoco puede «llamar en tu nombre».

Ve al capítulo «Agregar cuenta» y añade la cuenta mediante el flujo OAuth o Refresh Token.

**Deberías ver**: Tu cuenta aparece en la página Accounts, y puedes ver información de cuota/estado.

### Paso 3: Inicia API Proxy y haz una verificación mínima con /healthz

**Por qué**
Primero usa `GET /healthz` para verificar «el servicio local está ejecutándose», y luego conecta el cliente, lo que facilitará mucho la solución de problemas.

Ve al capítulo «Iniciar proxy inverso local y conectar el primer cliente» para completar el ciclo cerrado.

**Deberías ver**: Tu cliente/SDK puede obtener con éxito una respuesta a través de la Base URL local.
## Advertencias sobre problemas comunes

| Escenario | Qué podrías hacer (❌) | Enfoque recomendado (✓) |
|--- | --- | ---|
| Permitir que el teléfono/otra computadora acceda | Habilitar directamente `allow_lan_access=true` sin establecer autenticación | Habilitar la autenticación al mismo tiempo, y primero verificar `GET /healthz` en la red de área local |
| El cliente informa 404 | Solo cambiar host/port, sin importar cómo el cliente concatena `/v1` | Primero confirmar la estrategia de concatenación base_url del cliente, luego decidir si es necesario llevar el prefijo `/v1` |
| Empiezas directamente a depurar con Claude Code | Conectar directamente un cliente complejo, sin saber dónde verificar cuando falla | Primero ejecutar el ciclo cerrado mínimo: iniciar Proxy -> `GET /healthz` -> luego conectar el cliente |

## Resumen de esta lección

- El posicionamiento de Antigravity Tools es «lado de escritorio + puerta de enlace de proxy inverso HTTP local»: gestión mediante GUI, Axum proporciona múltiples puntos finales de protocolo
- Necesitas tratarlo como una infraestructura local: primero instala, luego agrega cuentas, luego inicia Proxy, finalmente conecta el cliente
- Por defecto solo escucha en `127.0.0.1:8045`, si necesitas exponer a la red de área local, asegúrate de activar la autenticación

## Próximo capítulo

> En el siguiente capítulo completaremos el paso de instalación: **[Instalación y actualización: la mejor ruta de instalación de escritorio](/es/lbjlaq/Antigravity-Manager/start/installation/)**.
>
> Aprenderás:
> - Los varios métodos de instalación listados en README (y su prioridad)
> - El punto de entrada de actualización y cómo manejar las intercepciones comunes del sistema
---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| Posicionamiento del producto (estación de transferencia de IA local / brecha de protocolos) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L35-L77) | 35-77 |
| Visión general de puntos finales del Router (OpenAI/Claude/Gemini/healthz) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Lógica de puerto predeterminado / solo local predeterminado / key predeterminado y bind address | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L291) | 174-291 |
|--- | --- | ---|
| Estructura de enrutamiento de páginas GUI (Dashboard/Accounts/API Proxy/Monitor/Token Stats/Settings) | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L19-L48) | 19-48 |

**Valores predeterminados clave**:
- `ProxyConfig.port = 8045`: puerto predeterminado del servicio de proxy inverso
- `ProxyConfig.allow_lan_access = false`: acceso solo local predeterminado
- `ProxyAuthMode::default() = off`: no requiere autenticación por defecto

</details>
