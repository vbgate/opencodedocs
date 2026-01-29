---
title: "Despliegue: Soluciones de despliegue en servidor | Antigravity-Manager"
sidebarTitle: "Ejecutar en servidor"
subtitle: "Despliegue: Soluciones de despliegue en servidor"
description: "Aprende los métodos de despliegue en servidor de Antigravity-Manager. Compara dos soluciones: Docker noVNC y Headless Xvfb, completa instalación y configuración, persistencia de datos y monitoreo, estableciendo un entorno operativo mantenible."
tags:
  - "deployment"
  - "docker"
  - "xvfb"
  - "novnc"
  - "systemd"
  - "backup"
prerequisite:
  - "start-installation"
  - "start-backup-migrate"
  - "advanced-security"
duration: 20
order: 10
---
# Despliegue en servidor: Docker noVNC vs Headless Xvfb (Selección y operaciones)

Quieres hacer el despliegue en servidor de Antigravity Tools, ejecutarlo en NAS/servidor, generalmente no para "abrir la interfaz gráfica de forma remota", sino para usarlo como una puerta de enlace API local de ejecución prolongada: siempre en línea, con monitoreo de estado, capacidad de actualización, copia de seguridad y resolución de problemas.

Esta lección solo cubre dos caminos prácticos proporcionados por el proyecto: Docker (con noVNC) y Headless Xvfb (gestión con systemd). Todos los comandos y valores predeterminados se basan en los archivos de despliegue del repositorio.

::: tip Si solo quieres "ejecutarlo una vez"
La lección de instalación inicial ya cubre los comandos de entrada de Docker y Headless Xvfb, puedes consultar primero **[Instalación y actualización](/es/lbjlaq/Antigravity-Manager/start/installation/)**, luego volver a esta lección para completar el "ciclo de operaciones".
:::

## Lo que podrás hacer al finalizar

- Elegir la forma de despliegue correcta: entender qué problemas resuelve Docker noVNC y Headless Xvfb respectivamente
- Completar un ciclo completo: despliegue -> sincronización de datos de cuenta -> monitoreo `/healthz` -> ver registros -> copia de seguridad
- Hacer de la actualización una acción controlada: conocer las diferencias entre "actualización automática al inicio" de Docker y `upgrade.sh` de Xvfb

## Tu situación actual

- El servidor no tiene escritorio, pero necesitas operaciones que "requieren navegador" como OAuth/autorización
- Ejecutarlo una vez no es suficiente, también quieres: recuperación automática tras reinicio por apagado, monitoreo de estado, copia de seguridad
- Te preocupa que exponer el puerto 8045 conlleve riesgos de seguridad, pero no sabes por dónde empezar

## Cuándo utilizar este método

- NAS/servidor doméstico: quieres abrir la interfaz gráfica desde el navegador para completar la autorización (Docker/noVNC es muy conveniente)
- Servidor de ejecución prolongada: prefieres usar systemd para gestionar procesos, registros en disco, actualización por script (Headless Xvfb se parece más a un "proyecto de operaciones")

## ¿Qué es el modo "despliegue en servidor"?

**Despliegue en servidor** significa: no ejecutas Antigravity Tools en tu máquina local, sino que lo colocas en una máquina que está en línea permanentemente, y usas el puerto del proxy inverso (predeterminado 8045) como entrada de servicio externo. Su núcleo no es "ver la interfaz de forma remota", sino establecer un ciclo de operaciones estable: persistencia de datos, monitoreo, registros, actualización y copia de seguridad.

## Enfoque central

1. Primero elige "la capacidad que más te falta": si te falta autorización con navegador, elige Docker/noVNC; si te falta controlabilidad en operaciones, elige Headless Xvfb.
2. Luego define los "datos": cuenta/configuración están en `.antigravity_tools/`, o usas Docker volume, o lo fijas en `/opt/antigravity/.antigravity_tools/`.
3. Finalmente haz el "ciclo operativo": monitoreo con `/healthz`, en caso de fallo primero revisa logs, luego decide reiniciar o actualizar.

::: warning Pre-aviso: primero establece la línea base de seguridad
Si vas a exponer 8045 a LAN/pública, primero consulta **[Seguridad y privacidad: auth_mode, allow_lan_access, y el diseño de "no filtrar información de cuenta"](/es/lbjlaq/Antigravity-Manager/advanced/security/)**.
:::

## Guía rápida de selección: Docker vs Headless Xvfb

| Lo que más te importa | Recomendado | Por qué |
| --- | --- | --- |
| Necesitas navegador para OAuth/autorización | Docker (noVNC) | El contenedor incluye Firefox ESR, puedes operar directamente desde el navegador (ver `deploy/docker/README.md`) |
| Quieres gestión con systemd/registros en disco | Headless Xvfb | El script install instalará el servicio systemd y añadirá registros a `logs/app.log` (ver `deploy/headless-xvfb/install.sh`) |
| Quieres aislamiento y límites de recursos | Docker | La forma compose proporciona aislamiento natural y facilita la configuración de límites de recursos (ver `deploy/docker/README.md`) |

## Sigue mis pasos

### Paso 1: Primero confirma dónde está el "directorio de datos"

**Por qué**
Despliegue exitoso pero "sin cuenta/configuración", esencialmente significa que el directorio de datos no se llevó o no se persistió.

- La solución Docker montará los datos en `/home/antigravity/.antigravity_tools` dentro del contenedor (compose volume)
- La solución Headless Xvfb colocará los datos en `/opt/antigravity/.antigravity_tools` (y fijará la ubicación de escritura mediante `HOME=$(pwd)`)

**Lo que deberías ver**
- Docker: `docker volume ls` puede ver `antigravity_data`
- Xvfb: `/opt/antigravity/.antigravity_tools/` existe, y contiene `accounts/`, `gui_config.json`

### Paso 2: Ejecutar Docker/noVNC (adecuado para autorización que requiere navegador)

**Por qué**
La solución Docker empaqueta "pantalla virtual + gestor de ventanas + noVNC + aplicación + navegador" en un contenedor, ahorrándote la instalación de un montón de dependencias gráficas en el servidor.

Ejecuta en el servidor:

```bash
cd deploy/docker
docker compose up -d
```

Abre noVNC:

```text
http://<server-ip>:6080/vnc_lite.html
```

**Lo que deberías ver**
- `docker compose ps` muestra el contenedor en ejecución
- El navegador puede abrir la página noVNC

::: tip Sobre el puerto noVNC (recomendado mantener predeterminado)
`deploy/docker/README.md` menciona que puedes usar `NOVNC_PORT` para personalizar el puerto, pero en la implementación actual `start.sh` al iniciar `websockify` escucha en el puerto 6080 codificado. Para modificar el puerto necesitas ajustar simultáneamente el mapeo de puertos de docker-compose y el puerto de escucha de start.sh.

Para evitar inconsistencias de configuración, se recomienda usar directamente el valor predeterminado 6080.
:::

### Paso 3: Persistencia, monitoreo y copia de seguridad de Docker

**Por qué**
La disponibilidad del contenedor depende de dos cosas: salud del proceso (si aún se está ejecutando) y persistencia de datos (la cuenta persiste tras reinicio).

1) Confirma que el volume de persistencia está montado:

```bash
cd deploy/docker
docker compose ps
```

2) Copia de seguridad del volume (el README del proyecto proporciona método de copia tar):

```bash
docker run --rm -v antigravity_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/antigravity-backup.tar.gz /data
```

3) Verificación de salud del contenedor (Dockerfile tiene HEALTHCHECK):

```bash
docker inspect --format '{{json .State.Health}}' antigravity-manager | jq
```

**Lo que deberías ver**
- `.State.Health.Status` es `healthy`
- Se genera `antigravity-backup.tar.gz` en el directorio actual

### Paso 4: Instalación con un clic de Headless Xvfb (adecuado para operaciones con systemd)

**Por qué**
Headless Xvfb no es un "modo puramente backend", sino que usa pantalla virtual para ejecutar programas GUI en el servidor; pero a cambio obtienes una forma de operaciones más familiar: systemd, directorio fijo, registros en disco.

Ejecuta en el servidor (script de un clic proporcionado por el proyecto):

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

**Lo que deberías ver**
- El directorio `/opt/antigravity/` existe
- `systemctl status antigravity` muestra el servicio running

::: tip Enfoque más robusto: primero revisa el script
Descarga `curl -O .../install.sh`, revísalo primero, luego `sudo bash install.sh`.
:::

### Paso 5: Sincronizar cuenta local al servidor (obligatorio para solución Xvfb)

**Por qué**
La instalación de Xvfb solo ejecuta el programa. Para que el proxy inverso sea realmente útil, necesitas sincronizar la cuenta/configuración existente de tu máquina local al directorio de datos del servidor.

El proyecto proporciona `sync.sh`, que automáticamente buscará el directorio de datos en tu máquina por prioridad (como `~/.antigravity_tools`, `~/Library/Application Support/Antigravity Tools`), luego rsync al servidor:

```bash
curl -O https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/sync.sh
chmod +x sync.sh

./sync.sh root@your-server /opt/antigravity
```

**Lo que deberías ver**
- La terminal muestra algo como: `同步: <local> -> root@your-server:/opt/antigravity/.antigravity_tools/`
- El servicio remoto se intenta reiniciar (el script llamará `systemctl restart antigravity`)

### Paso 6: Monitoreo y resolución de problemas (ambas soluciones)

**Por qué**
Lo primero después del despliegue no es "conectar el cliente", sino establecer primero una entrada para juzgar rápidamente la salud del servicio.

1) Monitoreo (el servicio de proxy inverso proporciona `/healthz`):

```bash
curl -i http://127.0.0.1:8045/healthz
```

2) Ver registros:

```bash
## Docker
cd deploy/docker
docker compose logs -f

## Headless Xvfb
tail -f /opt/antigravity/logs/app.log
```

**Lo que deberías ver**
- `/healthz` devuelve 200 (el cuerpo de respuesta específico depende de la realidad)
- Los registros muestran información de inicio del servicio de proxy inverso

### Paso 7: Estrategia de actualización (no consideres "actualización automática" como la única solución)

**Por qué**
La actualización es la acción más fácil de "actualizar el sistema a no disponible". Necesitas saber exactamente qué hace cada solución.

- Docker: al iniciar el contenedor intentará descargar el último `.deb` a través de GitHub API e instalarlo (si está limitado o hay excepción de red, continuará usando la versión en caché).
- Headless Xvfb: usa `upgrade.sh` para descargar el último AppImage, y en caso de fallo de reinicio, revertirá a la copia de seguridad.

Comando de actualización de Headless Xvfb (README del proyecto):

```bash
cd /opt/antigravity
sudo ./upgrade.sh
```

**Lo que deberías ver**
- Salida similar a: `升级: v<current> -> v<latest>`
- Tras la actualización el servicio sigue activo (el script llamará `systemctl restart antigravity` y verificará estado)

## Advertencia de errores comunes

| Escenario | Error común (❌) | Enfoque recomendado (✓) |
| --- | --- | --- |
| Pérdida de cuenta/configuración | ❌ Solo te importa "que el programa se ejecute" | ✓ Primero confirma que `.antigravity_tools/` está persistido (volume o `/opt/antigravity`) |
| Cambio de puerto noVNC no surte efecto | ❌ Solo cambias `NOVNC_PORT` | ✓ Mantén predeterminado 6080; si cambias, verifica simultáneamente el puerto `websockify` en `start.sh` |
| Exponer 8045 a pública | ❌ No estableces `api_key`/no revisas auth_mode | ✓ Primero haz la línea base según **[Seguridad y privacidad](/es/lbjlaq/Antigravity-Manager/advanced/security/)**, luego considera túnel/proxy inverso |

## Resumen de la lección

- Docker/noVNC resuelve el problema de "servidor sin navegador/sin escritorio pero necesita autorización", adecuado para escenarios NAS
- Headless Xvfb es más como operaciones estándar: directorio fijo, gestión systemd, actualización/reversión por script
- Independientemente de la solución, primero haz el ciclo correctamente: datos -> monitoreo -> registros -> copia de seguridad -> actualización

## Lecturas recomendadas

- Quieres exponer el servicio a LAN/pública: **[Seguridad y privacidad: auth_mode, allow_lan_access](/es/lbjlaq/Antigravity-Manager/advanced/security/)**
- 401 tras el despliegue: **[401/Fallo de autenticación: auth_mode, compatibilidad de Header y lista de verificación de configuración del cliente](/es/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- Quieres exponer el servicio con túnel: **[Túnel de un clic con Cloudflared](/es/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
| --- | --- | --- |
| Entrada de despliegue Docker y URL noVNC | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L5-L13) | 5-13 |
| Descripción de variables de entorno de despliegue Docker (VNC_PASSWORD/RESOLUTION/NOVNC_PORT) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L32-L39) | 32-39 |
| Mapeo de puertos y volúmenes de datos de Docker compose (antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L21) | 1-21 |
| Script de inicio Docker: actualización automática de versión (GitHub rate limit) | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L27-L58) | 27-58 |
| Script de inicio Docker: iniciar Xtigervnc/Openbox/noVNC/aplicación | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L60-L78) | 60-78 |
| Verificación de salud Docker: confirmar que existen procesos Xtigervnc/websockify/antigravity_tools | [`deploy/docker/Dockerfile`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/Dockerfile#L60-L79) | 60-79 |
| Headless Xvfb: estructura de directorio y comandos de operaciones (systemctl/healthz) | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L19-L78) | 19-78 |
| Headless Xvfb: install.sh instala dependencias e inicializa gui_config.json (predeterminado 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L16-L67) | 16-67 |
| Headless Xvfb: sync.sh detecta automáticamente directorio de datos local y rsync al servidor | [`deploy/headless-xvfb/sync.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/sync.sh#L8-L32) | 8-32 |
| Headless Xvfb: upgrade.sh descarga nueva versión y revierte en caso de fallo | [`deploy/headless-xvfb/upgrade.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/upgrade.sh#L11-L51) | 11-51 |
| Punto final de monitoreo `/healthz` del servicio de proxy inverso | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |

</details>
