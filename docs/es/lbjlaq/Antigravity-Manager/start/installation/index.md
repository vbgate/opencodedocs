---
title: "Instalación: Homebrew y Deployments de Releases | Antigravity Manager"
sidebarTitle: "Instalado en 5 minutos"
subtitle: "Instalación y actualización: la mejor ruta de instalación de escritorio (brew / releases)"
description: "Aprende los métodos de instalación de Homebrew y Releases de Antigravity Tools. Completa el despliegue en 5 minutos, resuelve problemas comunes de macOS quarantine y 'aplicación dañada', y domina el proceso de actualización."
tags:
  - "Instalación"
  - "Actualización"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 2
---

# Instalación y actualización: la mejor ruta de instalación de escritorio (brew / releases)

Si quieres instalar Antigravity Tools rápidamente y ejecutar los cursos siguientes, esta lección solo hace una cosa: dejar claro "instalado + poder abrir + saber cómo actualizar".

## Qué puedes hacer al finalizar

- Elegir la ruta de instalación correcta: prioridad Homebrew, luego GitHub Releases
- Manejar bloqueos comunes de macOS (quarantine / "aplicación dañada")
- Instalar en entornos especiales: script Arch, Headless Xvfb, Docker
- Conocer los puntos de entrada de actualización y métodos de autoverificación para cada método de instalación

## Tu situación actual

- Demasiados métodos de instalación en la documentación, no sabes cuál elegir
- Descargaste en macOS pero no se puede abrir, mensaje "dañado/no se puede abrir"
- Ejecutas en NAS/servidor, no tienes escritorio ni es conveniente autorizar

## Cuándo usar este método

- Primera instalación de Antigravity Tools
- Restaurar el entorno después de cambiar de equipo o reinstalar el sistema
- Después de una actualización de versión, encuentras bloqueos del sistema o anomalías de inicio

::: warning Conocimientos previos
Si aún no estás seguro de qué problema resuelve Antigravity Tools, mira primero **[¿Qué es Antigravity Tools?](/es/lbjlaq/Antigravity-Manager/start/getting-started/)**, la instalación será más fluida cuando vuelvas.
:::

## Idea central

Te recomendamos elegir en el orden "primero escritorio, luego servidor":

1. Escritorio (macOS/Linux): instalar con Homebrew (más rápido, actualización más sencilla)
2. Escritorio (todas las plataformas): descargar desde GitHub Releases (adecuado si no quieres instalar brew o tienes restricciones de red)
3. Servidor/NAS: prioridad Docker; luego Headless Xvfb (más parecido a "ejecutar aplicaciones de escritorio en servidor")

## Sígueme

### Paso 1: Elige primero tu método de instalación

**Por qué**
El costo de "actualización/rollback/resolución de problemas" varía mucho entre diferentes métodos de instalación, elegir primero la ruta te ayuda a evitar desvíos.

**Recomendación**:

| Escenario | Método de instalación recomendado |
|--- | ---|
| Escritorio macOS / Linux | Homebrew (Opción A) |
| Escritorio Windows | GitHub Releases (Opción B) |
| Arch Linux | Script oficial (Opción Arch) |
| Servidor remoto sin escritorio | Docker (Opción D) o Headless Xvfb (Opción C-Headless) |

**Deberías ver**: Puedes identificar claramente en qué fila estás.

### Paso 2: Instalar con Homebrew (macOS / Linux)

**Por qué**
Homebrew es la ruta de "procesamiento automático de descarga e instalación", la actualización también es más manejable.

```bash
#1) Suscribirse al Tap de este repositorio
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

#2) Instalar la aplicación
brew install --cask antigravity-tools
```

::: tip Sugerencia de permisos de macOS
El README menciona: si encuentras problemas de permisos/cuarentena en macOS, puedes usar:

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**Deberías ver**: `brew` muestra instalación exitosa, y aparece la aplicación Antigravity Tools en el sistema.
### Paso 3: Instalación manual desde GitHub Releases (macOS / Windows / Linux)

**Por qué**
Cuando no usas Homebrew, o prefieres controlar la fuente del paquete de instalación, esta ruta es la más directa.

1. Abre la página de Releases del proyecto: `https://github.com/lbjlaq/Antigravity-Manager/releases`
2. Elige el paquete de instalación que coincida con tu sistema:
   - macOS: `.dmg` (Apple Silicon / Intel)
   - Windows: `.msi` o versión portátil `.zip`
   - Linux: `.deb` o `AppImage`
3. Completa la instalación siguiendo las instrucciones del instalador del sistema

**Deberías ver**: Después de completar la instalación, puedes encontrar y lanzar Antigravity Tools en la lista de aplicaciones del sistema.

### Paso 4: Manejo de macOS "aplicación dañada, no se puede abrir"

**Por qué**
El README proporciona claramente el método de reparación para este escenario; si encuentras el mismo mensaje, simplemente sigue las instrucciones.

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**Deberías ver**: Al iniciar la aplicación nuevamente, ya no aparece el mensaje de bloqueo "dañado/no se puede abrir".
### Paso 5: Actualización (elige según tu método de instalación)

**Por qué**
Lo más fácil al actualizar es "el método de instalación cambió", lo que hace que no sepas dónde actualizar.

::: code-group

```bash [Homebrew]
# Primero actualizar la información de tap antes de actualizar
brew update

# Actualizar cask
brew upgrade --cask antigravity-tools
```

```text [Releases]
Vuelve a descargar el paquete de instalación de la última versión (.dmg/.msi/.deb/AppImage) y sigue las instrucciones del sistema para sobrescribir la instalación.
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

# El README indica que el contenedor intentará descargar el último release al iniciar; la forma más sencilla de actualizar es reiniciar el contenedor
docker compose restart
```

:::

**Deberías ver**: Después de completar la actualización, la aplicación aún puede iniciarse normalmente; si usas Docker/Headless, también puedes seguir accediendo al endpoint de verificación de salud.
## Otros métodos de instalación (escenarios específicos)

### Arch Linux: script oficial de instalación en un clic

El README proporciona el punto de entrada al script de Arch:

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details ¿Qué hace este script?
Obtiene el último release a través de la API de GitHub, descarga el activo `.deb`, calcula el SHA256, genera PKGBUILD y lo instala con `makepkg -si`.
:::

### Servidor remoto: Headless Xvfb

Si necesitas ejecutar aplicaciones GUI en un servidor Linux sin interfaz, el proyecto proporciona el despliegue Xvfb:

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

Después de completar la instalación, los comandos comunes de autoverificación proporcionados por la documentación incluyen:

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/Servidor: Docker (con navegador VNC)

El despliegue Docker proporcionará noVNC en el navegador (conveniente para operaciones OAuth/autorización), mientras mapea puertos de proxy:

```bash
cd deploy/docker
docker compose up -d
```

Deberías poder acceder: `http://localhost:6080/vnc_lite.html`.
## Recordatorios de problemas comunes

- Fallo de instalación con brew: primero confirma que has instalado Homebrew, luego reintenta `brew tap` / `brew install --cask` del README
- macOS no se puede abrir: intenta primero `--no-quarantine`; si ya está instalado, usa `xattr` para limpiar la cuarentena
- Limitaciones del despliegue en servidor: Headless Xvfb esencialmente "ejecuta programas de escritorio con una pantalla virtual", el uso de recursos será mayor que un servicio puro de backend

## Resumen de esta lección

- Lo más recomendado para escritorio: Homebrew (instalación y actualización sencillas)
- Sin brew: usa directamente GitHub Releases
- Servidor/NAS: prioridad Docker; si necesitas gestión systemd, usa Headless Xvfb

## Próxima lección

En la siguiente lección llevaremos "poder abrir" un paso más allá: aclarar **[directorio de datos, registros, bandeja del sistema y autoinicio](/es/lbjlaq/Antigravity-Manager/start/first-run-data/)**, para que sepas por dónde empezar cuando encuentres problemas.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Tema | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Instalación de Homebrew (tap + cask) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L112-L127) | 112-127 |
| Descarga manual de Releases (paquetes para cada plataforma) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
| Punto de entrada al script de instalación en un clic de Arch | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L134-L140) | 134-140 |
| Implementación del script de instalación de Arch (API de GitHub + makepkg) | [`deploy/arch/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/arch/install.sh#L1-L56) | 1-56 |
| Punto de entrada a la instalación de Headless Xvfb (curl | sudo bash) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
| Comandos de despliegue/actualización/mantenimiento de Headless Xvfb | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L1-L99) | 1-99 |
| Headless Xvfb install.sh (systemd + configuración predeterminada 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
|--- | --- | ---|
| Descripción del despliegue Docker (noVNC 6080 / proxy 8045) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L1-L35) | 1-35 |
| Configuración de puertos/volúmenes de datos Docker (8045 + antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L25) | 1-25 |
|--- | --- | ---|

</details>
