---
title: "Cloudflared: Exponer API Local a Internet | Antigravity-Manager"
sidebarTitle: "Permitir Acceso Remoto a API Local"
subtitle: "Túnel One-Click de Cloudflared: expone tu API local de forma segura a internet (no es seguro por defecto)"
description: "Aprende el túnel one-click de Cloudflared de Antigravity Tools: ejecuta ambos modos Quick/Auth, entiende cuándo se muestra la URL, cómo copiarla y probarla, y usa proxy.auth_mode + API Key fuerte para exposición mínima. Incluye ubicación de instalación, errores comunes y estrategias de solución de problemas para que dispositivos remotos puedan invocar el gateway local de forma estable."
tags:
  - "Cloudflared"
  - "Tunneling de Intranet"
  - "Acceso Público"
  - "Tunnel"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 7
---
# Túnel One-Click de Cloudflared: Exponer API Local de Forma Segura a Internet (No Es Seguro por Defecto)

Usarás **el túnel one-click de Cloudflared** para exponer el gateway de API de Antigravity Tools localmente a internet (solo cuando lo actives explícitamente), permitiendo que dispositivos remotos también puedan invocarlo, mientras entiendes las diferencias de comportamiento y los límites de riesgo de los dos modos: Quick y Auth.

## Lo Que Podrás Hacer Al Final

- Instalar y ejecutar el túnel de Cloudflared con un clic
- Elegir entre modo Quick (URL temporal) o modo Auth (túnel con nombre)
- Copiar la URL pública para que dispositivos remotos accedan a tu API local
- Entender los riesgos de seguridad del túnel y adoptar estrategias de exposición mínima

## Tu Dilema Actual

Ya tienes el gateway de API de Antigravity Tools ejecutándose localmente, pero solo tu máquina o tu red local pueden acceder a él. Quieres que servidores remotos, dispositivos móviles o servicios en la nube también puedan invocar este gateway, pero no tienes una IP pública y no quieres complicarte con soluciones de despliegue de servidor complejas.

## Cuándo Usar Esta Estrategia

- No tienes IP pública, pero necesitas que dispositivos remotos accedan a tu API local
- Estás en fase de prueba/desarrollo y quieres exponer rápidamente el servicio externamente
- No quieres comprar un servidor para desplegar, solo usar la máquina existente

::: warning Advertencia de Seguridad
Exponer a internet tiene riesgos. Asegúrate de:
1. Configurar una API Key fuerte (`proxy.auth_mode=strict/all_except_health`)
2. Activar el túnel solo cuando sea necesario, cerrarlo después de usarlo
3. Revisar regularmente los registros de Monitor y detenerlo inmediatamente si detectas anomalías
:::

## 🎒 Preparativos Antes de Comenzar

::: warning Requisitos Previos
- Ya has iniciado el servicio de proxy inverso local (el interruptor en la página "API Proxy" está encendido)
- Ya has agregado al menos una cuenta disponible
:::

## ¿Qué Es Cloudflared?

**Cloudflared** es el cliente de túnel proporcionado por Cloudflare que establece un canal cifrado entre tu máquina y Cloudflare, mapeando tu servicio HTTP local a una URL accesible desde internet. Antigravity Tools ha convertido la instalación, inicio, detención y copia de URL en operaciones de UI para que puedas completar rápidamente el ciclo de verificación.

### Plataformas Soportadas

La lógica de "descarga automática + instalación" integrada en el proyecto solo cubre las siguientes combinaciones de SO/arquitectura (otras plataformas mostrarán `Unsupported platform`).

| Sistema Operativo | Arquitectura | Estado de Soporte |
|--- | --- | ---|
| macOS | Apple Silicon (arm64) | ✅ |
| macOS | Intel (x86_64) | ✅ |
| Linux | x86_64 | ✅ |
| Linux | ARM64 | ✅ |
| Windows | x86_64 | ✅ |

### Comparación de Dos Modos

| Característica | Modo Quick | Modo Auth |
|--- | --- | ---|
| **Tipo de URL** | `https://xxx.trycloudflare.com` (URL temporal extraída de los registros) | La aplicación puede no extraer automáticamente la URL (depende de los registros de cloudflared); el dominio de entrada depende de tu configuración en Cloudflare |
| **Requiere Token** | ❌ No | ✅ Sí (obtenido desde la consola de Cloudflare) |
| **Estabilidad** | La URL puede cambiar al reiniciar el proceso | Depende de cómo lo configures en Cloudflare (la aplicación solo se encarga de iniciar el proceso) |
| **Escenario Adecuado** | Pruebas temporales, verificación rápida | Servicios estables a largo plazo, entorno de producción |
| **Recomendación** | ⭐⭐⭐ Para pruebas | ⭐⭐⭐⭐⭐ Para producción |

::: info Características de la URL del Modo Quick
La URL del modo Quick puede cambiar cada vez que se inicia y es un subdominio `*.trycloudflare.com` generado aleatoriamente. Si necesitas una URL fija, debes usar el modo Auth y vincular un dominio en la consola de Cloudflare.
:::

## Sigue los Pasos

### Paso 1: Abre la Página API Proxy

**Por qué**
Encontrar la entrada de configuración de Cloudflared.

1. Abre Antigravity Tools
2. Haz clic en **"API Proxy"** en la navegación izquierda
3. Encuentra la tarjeta **"Public Access (Cloudflared)"** (parte inferior de la página, icono naranja)

**Lo que deberías ver**: una tarjeta expandible mostrando "Cloudflared not installed" (no instalado) o "Installed: xxx" (instalado).

### Paso 2: Instala Cloudflared

**Por qué**
Descargar e instalar el binario de Cloudflared en la carpeta `bin` del directorio de datos.

#### Si No Está Instalado

1. Haz clic en el botón **"Install"** (instalar)
2. Espera a que se complete la descarga (según la velocidad de red, unos 10-30 segundos)

**Lo que deberías ver**:
- El botón muestra animación de carga
- Al completar, mensaje "Cloudflared installed successfully"
- La tarjeta muestra "Installed: cloudflared version 202X.X.X"

#### Si Ya Está Instalado

Omite este paso y ve directamente al paso 3.

::: tip Ubicación de Instalación
El binario de Cloudflared se instalará en `bin/` del "directorio de datos" (el nombre del directorio de datos es `.antigravity_tools`).

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/bin/"
```

```powershell [Windows]
Get-ChildItem "$HOME\.antigravity_tools\bin\"
```

:::

Si aún no estás seguro de dónde está el directorio de datos, revisa primero **[Primer Inicio: Directorio de Datos, Registros, Bandeja y Auto-inicio](/es/lbjlaq/Antigravity-Manager/start/first-run-data/)**.
:::

### Paso 3: Elige el Modo de Túnel

**Por qué**
Elegir el modo apropiado según tu escenario de uso.

1. En la tarjeta, encuentra el área de selección de modo (dos botones grandes)
2. Haz clic para elegir:

| Modo | Descripción | Cuándo Elegir |
|--- | --- | ---|
| **Quick Tunnel** | Genera automáticamente URL temporal (`*.trycloudflare.com`) | Pruebas rápidas, acceso temporal |
| **Named Tunnel** | Usa cuenta de Cloudflare y dominio personalizado | Entorno de producción, necesidad de dominio fijo |

::: tip Recomendación
Si es tu primera vez, **elige primero el modo Quick** para verificar rápidamente si la funcionalidad cumple tus necesidades.
:::

### Paso 4: Configura los Parámetros

**Por qué**
Completar los parámetros necesarios y opciones según el modo.

#### Modo Quick

1. El puerto usará automáticamente tu puerto Proxy actual (por defecto `8045`, según tu configuración real)
2. Marca **"Use HTTP/2"** (marcado por defecto)

#### Modo Auth

1. Ingresa el **Tunnel Token** (obtenido desde la consola de Cloudflare)
2. El puerto también usa tu puerto Proxy actual (según tu configuración real)
3. Marca **"Use HTTP/2"** (marcado por defecto)

::: info ¿Cómo obtener el Tunnel Token?
1. Inicia sesión en la [Consola de Cloudflare Zero Trust](https://dash.cloudflare.com/sign-up-to-cloudflare-zero-trust)
2. Ve a **"Networks"** → **"Tunnels"**
3. Haz clic en **"Create a tunnel"** → **"Remote browser"** o **"Cloudflared"**
4. Copia el Token generado (cadena larga similar a `eyJhIjoiNj...`)
:::

#### Explicación de la Opción HTTP/2

`Use HTTP/2` hará que cloudflared se inicie con `--protocol http2`. El texto del proyecto lo describe como "más compatible (recomendado para usuarios de China continental)" y está activado por defecto.

::: tip Recomendación
**La opción HTTP/2 se recomienda marcar por defecto**, especialmente en entornos de red nacionales.
:::

### Paso 5: Inicia el Túnel

**Por qué**
Establecer el túnel cifrado de local a Cloudflare.

1. Haz clic en el interruptor en la esquina superior derecha de la tarjeta (o en el botón **"Start Tunnel"** al expandir)
2. Espera a que se inicie el túnel (unos 5-10 segundos)

**Lo que deberías ver**:
- Un punto verde en el lado derecho del título de la tarjeta
- Mensaje **"Tunnel Running"**
- URL pública mostrada (similar a `https://random-name.trycloudflare.com`)
- Botón de copia a la derecha: el botón solo muestra los primeros 20 caracteres de la URL, pero al hacer clic copia la URL completa

::: warning Es posible que el modo Auth no muestre la URL
La aplicación actual solo extrae URL del tipo `*.trycloudflare.com` de los registros de cloudflared para mostrar. El modo Auth generalmente no genera este tipo de dominio, por lo que solo puedes ver "Running" pero no la URL. En este caso, el dominio de entrada depende de tu configuración en Cloudflare.
:::

### Paso 6: Prueba el Acceso Público

**Por qué**
Verificar si el túnel funciona normalmente.

#### Verificación de Estado

::: code-group

```bash [macOS/Linux]
#Reemplaza con tu URL real del túnel
curl -s "https://your-url.trycloudflare.com/healthz"
```

```powershell [Windows]
Invoke-RestMethod "https://your-url.trycloudflare.com/healthz"
```

:::

**Lo que deberías ver**: `{"status":"ok"}`

#### Consulta de Lista de Modelos

::: code-group

```bash [macOS/Linux]
#Si habilitaste la autenticación, reemplaza <proxy_api_key> con tu key
curl -s \
  -H "Authorization: Bearer <proxy_api_key>" \
  "https://your-url.trycloudflare.com/v1/models"
```

```powershell [Windows]
Invoke-RestMethod \
  -Headers @{ Authorization = "Bearer <proxy_api_key>" } \
  "https://your-url.trycloudflare.com/v1/models"
```

:::

**Lo que deberías ver**: JSON de la lista de modelos devuelto.

::: tip Nota sobre HTTPS
La URL del túnel usa protocolo HTTPS, no requiere configuración adicional de certificados.
:::

#### Llamada usando OpenAI SDK (Ejemplo)

```python
import openai

#Usar URL pública
client = openai.OpenAI(
    api_key="your-proxy-api-key",  # Si habilitaste la autenticación
    base_url="https://your-url.trycloudflare.com/v1"
)

#modelId según el retorno real de /v1/models

response = client.chat.completions.create(
    model="<modelId>",
    messages=[{"role": "user", "content": "Hola"}]
)

print(response.choices[0].message.content)
```

::: warning Recordatorio de Autenticación
Si habilitaste la autenticación en la página "API Proxy" (`proxy.auth_mode=strict/all_except_health`), las solicitudes deben llevar API Key:
- Header: `Authorization: Bearer your-api-key`
- O: `x-api-key: your-api-key`
:::

### Paso 7: Detén el Túnel

**Por qué**
Cerrar inmediatamente después de usar, reducir el tiempo de exposición de seguridad.

1. Haz clic en el interruptor en la esquina superior derecha de la tarjeta (o en el botón **"Stop Tunnel"** al expandir)
2. Espera a que se detenga (unos 2 segundos)

**Lo que deberías ver**:
- El punto verde desaparece
- Mensaje **"Tunnel Stopped"**
- La URL pública desaparece

## Punto de Control ✅

Después de completar los pasos anteriores, deberías ser capaz de:

- [ ] Instalar el binario de Cloudflared
- [ ] Cambiar entre modo Quick y modo Auth
- [ ] Iniciar el túnel y obtener la URL pública
- [ ] Invocar la API local a través de la URL pública
- [ ] Detener el túnel

## Advertencias de Problemas Comunes

### Problema 1: Falla de Instalación (Tiempo de Descarga Excedido)

**Síntoma**: Después de hacer clic en "Install", no hay respuesta durante mucho tiempo o mensaje de descarga fallida.

**Causa**: Problemas de red (especialmente en China continental al acceder a GitHub Releases).

**Solución**:
1. Verificar la conexión de red
2. Usar VPN o proxy
3. Descarga manual: [Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases), selecciona la versión de plataforma correspondiente, colócala manualmente en la carpeta `bin` del directorio de datos y otorga permisos de ejecución (macOS/Linux).

### Problema 2: Falla al Iniciar el Túnel

**Síntoma**: Después de hacer clic en iniciar, la URL no se muestra o aparece un mensaje de error.

**Causa**:
- Token inválido en modo Auth
- Servicio de proxy inverso local no iniciado
- Puerto ocupado

**Solución**:
1. Modo Auth: verifica que el Token sea correcto y no haya expirado
2. Verifica que el interruptor de proxy inverso en la página "API Proxy" esté encendido
3. Verifica que el puerto `8045` no esté ocupado por otro programa

### Problema 3: URL Pública No Accesible

**Síntoma**: curl o SDK invocan la URL pública con tiempo de espera.

**Causa**:
- Proceso del túnel se cerró inesperadamente
- Problemas de red de Cloudflare
- Firewall local bloqueando

**Solución**:
1. Verifica si la tarjeta muestra "Tunnel Running"
2. Revisa si la tarjeta tiene mensajes de error (texto en rojo)
3. Verifica la configuración del firewall local
4. Intenta reiniciar el túnel

### Problema 4: Falla de Autenticación (401)

**Síntoma**: La solicitud devuelve error 401.

**Causa**: El proxy habilitó autenticación, pero la solicitud no lleva API Key.

**Solución**:
1. Verifica el modo de autenticación en la página "API Proxy"
2. Agrega el Header correcto en la solicitud:
    ```bash
    curl -H "Authorization: Bearer your-api-key" \
          https://your-url.trycloudflare.com/v1/models
    ```

## Resumen de Esta Lección

El túnel de Cloudflared es una herramienta poderosa para exponer rápidamente servicios locales. En esta lección aprendiste:

- **Instalación One-Click**: descarga e instalación automática de Cloudflared dentro de la UI
- **Dos Modos**: elección entre Quick (temporal) y Auth (con nombre)
- **Acceso Público**: copia de URL HTTPS, dispositivos remotos pueden invocar directamente
- **Conciencia de Seguridad**: habilitar autenticación, cerrar después de usar, revisar regularmente los registros

Recuerda: **el túnel es de doble filo**, usado bien es conveniente, usado mal tiene riesgos. Siempre sigue el principio de exposición mínima.

## Próximo Avance

En la siguiente lección aprenderemos **[Configuración Completa: AppConfig/ProxyConfig, Ubicación de Persistencia y Semántica de Actualización en Caliente](/es/lbjlaq/Antigravity-Manager/advanced/config/)**.

Aprenderás:
- Campos completos de AppConfig y ProxyConfig
- Ubicación de persistencia de archivos de configuración
- Qué configuración requiere reinicio, cuál puede actualizarse en caliente

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del Archivo | Líneas |
|--- | --- | ---|
| Nombre del directorio de datos (`.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Estructura de configuración y valores por defecto (`CloudflaredConfig`, `TunnelMode`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L16-L59) | 16-59 |
| Reglas de URL de descarga automática (SO/arquitectura soportados) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L70-L88) | 70-88 |
| Lógica de instalación (descarga/escritura/extracción/permisos) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L147-L211) | 147-211 |
|--- | --- | ---|
| Reglas de extracción de URL (solo identifica `*.trycloudflare.com`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L390-L413) | 390-413 |
| Interfaz de comandos Tauri (check/install/start/stop/get_status) | [`src-tauri/src/commands/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/cloudflared.rs#L6-L118) | 6-118 |
| Tarjeta UI (modo/Token/HTTP2/visualización y copia de URL) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1597-L1753) | 1597-1753 |
| Requiere Proxy Running antes de iniciar (toast + return) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L256-L306) | 256-306 |

**Constantes Clave**:
- `DATA_DIR = ".antigravity_tools"`: nombre del directorio de datos (fuente: `src-tauri/src/modules/account.rs`)

**Funciones Clave**:
- `get_download_url()`: construye la dirección de descarga de GitHub Releases (fuente: `src-tauri/src/modules/cloudflared.rs`)
- `extract_tunnel_url()`: extrae URL del modo Quick desde los registros (fuente: `src-tauri/src/modules/cloudflared.rs`)

</details>
