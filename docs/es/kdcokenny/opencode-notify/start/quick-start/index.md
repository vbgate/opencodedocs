---
title: "Inicio rápido: Configura opencode-notify en 5 minutos | Tutorial de opencode-notify"
sidebarTitle: "Recibe notificaciones en 5 minutos"
subtitle: "Inicio rápido: Configura opencode-notify en 5 minutos"
description: "Aprende a instalar el complemento opencode-notify, completa la configuración en 5 minutos y experimenta tu primera notificación de escritorio. Este tutorial cubre la instalación mediante el gestor de paquetes OCX y la instalación manual, compatible con macOS, Windows y Linux, para que recibas alertas oportunas cuando tus tareas de IA se completen."
tags:
  - "Inicio"
  - "Instalación"
  - "Guía rápida"
prerequisite: []
order: 10
---

# Inicio rápido: Configura opencode-notify en 5 minutos

## Lo que podrás hacer tras completar esta lección

- Completar la instalación del complemento opencode-notify en 3 minutos
- Activar tu primera notificación de escritorio y verificar que la instalación fue exitosa
- Comprender las diferencias entre los métodos de instalación y sus casos de uso

## Tu situación actual

Delegas una tarea a la IA y cambias a otra ventana para trabajar. Ahora te encuentras volviendo cada 30 segundos para verificar: ¿Terminó? ¿Hubo un error? ¿Está esperando permisos? opencode-notify fue creado precisamente para resolver este problema.

Este cambio constante interrumpe tu concentración y desperdicia tiempo.

## Cuándo usar esta técnica

**Activa opencode-notify en los siguientes escenarios**:
- Cambias frecuentemente a otras aplicaciones mientras la IA ejecuta tareas
- Quieres ser notificado inmediatamente cuando la IA te necesita
- Deseas mantener la concentración sin perderte eventos importantes

## Idea central

El funcionamiento de opencode-notify es simple: escucha los eventos de OpenCode y envía notificaciones nativas de escritorio en momentos clave.

**Te notificará cuando**:
- ✅ La tarea se complete (Session idle)
- ✅ Ocurra un error (Session error)
- ✅ Se requieran permisos (Permission updated)

**No te notificará por**:
- ❌ Cada subtarea completada (demasiado ruidoso)
- ❌ Cualquier evento cuando la terminal está enfocada (ya estás viendo la terminal, no necesitas notificaciones)

## 🎒 Preparación previa

::: warning Requisitos previos
- Tener instalado [OpenCode](https://github.com/sst/opencode)
- Disponer de una terminal (macOS Terminal, iTerm2, Windows Terminal, etc.)
- Sistema operativo macOS/Windows/Linux (los tres son compatibles)
:::

## Manos a la obra

### Paso 1: Elige el método de instalación

opencode-notify ofrece dos métodos de instalación:

| Método | Caso de uso | Ventajas | Desventajas |
| --- | --- | --- | --- |
| **Gestor de paquetes OCX** | La mayoría de usuarios | Instalación con un comando, actualizaciones automáticas, gestión completa de dependencias | Requiere instalar OCX primero |
| **Instalación manual** | Necesidades especiales | Control total, sin necesidad de OCX | Requiere gestionar dependencias y actualizaciones manualmente |

**Recomendación**: Usa la instalación con OCX, es más sencilla.

### Paso 2: Instalación mediante OCX (Recomendado)

#### 2.1 Instalar el gestor de paquetes OCX

OCX es el gestor oficial de complementos de OpenCode, que permite instalar, actualizar y gestionar complementos fácilmente.

**Instalar OCX**:

```bash
curl -fsSL https://ocx.kdco.dev/install.sh | sh
```

**Deberías ver**: El script de instalación muestra el progreso y finalmente indica que la instalación fue exitosa.

#### 2.2 Agregar el Registry de KDCO

El Registry de KDCO es un repositorio de complementos que incluye opencode-notify y otros complementos útiles.

**Agregar el registry**:

```bash
ocx registry add https://registry.kdco.dev --name kdco
```

**Deberías ver**: Un mensaje como "Registry added successfully" o similar.

::: tip Opcional: Configuración global
Si deseas usar el mismo registry en todos tus proyectos, agrega el parámetro `--global`:

```bash
ocx registry add https://registry.kdco.dev --name kdco --global
```
:::

#### 2.3 Instalar opencode-notify

**Instalar el complemento**:

```bash
ocx add kdco/notify
```

**Deberías ver**:
```
✓ Added kdco/notify to your OpenCode workspace
```

### Paso 3: Instalación completa del workspace (Opcional)

Si deseas una experiencia completa, puedes instalar el workspace de KDCO, que incluye:

- opencode-notify (notificaciones de escritorio)
- Agentes en segundo plano (Background Agents)
- Agentes especializados (Specialist Agents)
- Herramientas de planificación (Planning Tools)

**Instalar el workspace**:

```bash
ocx add kdco/workspace
```

**Deberías ver**: Un mensaje indicando que múltiples componentes fueron agregados exitosamente.

### Paso 4: Verificar la instalación

Una vez completada la instalación, necesitamos activar una notificación para verificar que la configuración es correcta.

**Método de verificación 1: Hacer que la IA complete una tarea**

En OpenCode, escribe:

```
Por favor calcula la suma de 1 a 10, luego espera 5 segundos y dime el resultado.
```

Cambia a otra ventana y trabaja unos segundos; deberías ver aparecer una notificación de escritorio.

**Método de verificación 2: Comprobar el archivo de configuración**

Verifica si existe el archivo de configuración:

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
type $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**Deberías ver**:
- Si el archivo no existe → Significa que se usa la configuración por defecto (normal)
- Si el archivo existe → Muestra tu configuración personalizada

### Paso 5: Instalación manual (Alternativa)

Si no deseas usar OCX, puedes instalar manualmente.

#### 5.1 Copiar el código fuente

Copia el código fuente de opencode-notify al directorio de complementos de OpenCode:

```bash
# Copiar desde el código fuente a un directorio independiente
mkdir -p ~/.opencode/plugin/kdco-notify
cp src/notify.ts ~/.opencode/plugin/kdco-notify/
cp -r src/plugin/kdco-primitives ~/.opencode/plugin/kdco-notify/
```

#### 5.2 Instalar dependencias

Instala manualmente las dependencias necesarias:

```bash
cd ~/.opencode/plugin/
npm install node-notifier detect-terminal @opencode-ai/plugin @opencode-ai/sdk
```

::: warning Consideraciones
- **Gestión de dependencias**: Necesitas instalar y actualizar manualmente `node-notifier` y `detect-terminal`
- **Actualizaciones difíciles**: Cada actualización requiere copiar manualmente el código fuente
- **No recomendado**: A menos que tengas necesidades especiales, se recomienda usar la instalación con OCX
:::

### Punto de verificación ✅

Después de completar los pasos anteriores, confirma:

- [ ] OCX instalado correctamente (`ocx --version` muestra el número de versión)
- [ ] Registry de KDCO agregado (`ocx registry list` muestra kdco)
- [ ] opencode-notify instalado (`ocx list` muestra kdco/notify)
- [ ] Recibiste tu primera notificación de escritorio
- [ ] La notificación muestra el título correcto de la tarea

**Si algún paso falla**:
- Consulta [Solución de problemas](../../faq/troubleshooting/) para obtener ayuda
- Verifica que OpenCode esté funcionando correctamente
- Confirma que tu sistema soporta notificaciones de escritorio

## Errores comunes

### Problema común 1: Las notificaciones no aparecen

**Causas**:
- macOS: Las notificaciones del sistema están desactivadas
- Windows: No se han otorgado permisos de notificación
- Linux: notify-send no está instalado

**Solución**:

| Plataforma | Solución |
| --- | --- |
| macOS | Ajustes del Sistema → Notificaciones → OpenCode → Permitir notificaciones |
| Windows | Configuración → Sistema → Notificaciones → Activar notificaciones |
| Linux | Instalar libnotify-bin: `sudo apt install libnotify-bin` |

### Problema común 2: La instalación de OCX falla

**Causas**: Problemas de red o permisos insuficientes

**Solución**:
1. Verifica la conexión a internet
2. Usa sudo para instalar (requiere permisos de administrador)
3. Descarga manualmente el script de instalación y ejecútalo

### Problema común 3: La instalación de dependencias falla

**Causas**: Versión de Node.js incompatible

**Solución**:
- Usa Node.js 18 o superior
- Limpia la caché de npm: `npm cache clean --force`

## Resumen de esta lección

En esta lección completamos:
- ✅ Instalación del gestor de paquetes OCX
- ✅ Agregar el Registry de KDCO
- ✅ Instalación del complemento opencode-notify
- ✅ Activación de la primera notificación de escritorio
- ✅ Comprensión del método de instalación manual

**Puntos clave**:
1. opencode-notify usa notificaciones nativas de escritorio, sin necesidad de cambiar de ventana constantemente
2. OCX es el método de instalación recomendado, gestiona automáticamente dependencias y actualizaciones
3. Por defecto solo notifica sesiones padre, evitando el ruido de subtareas
4. Las notificaciones se suprimen automáticamente cuando la terminal está enfocada

## Avance de la próxima lección

> En la próxima lección aprenderemos **[Cómo funciona](../how-it-works/)**.
>
> Aprenderás:
> - Cómo el complemento escucha los eventos de OpenCode
> - El flujo de trabajo del mecanismo de filtrado inteligente
> - Los principios de detección de terminal y percepción de enfoque
> - Las diferencias funcionales entre plataformas

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Entrada principal del complemento | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L1-L407) | 1-407 |
| Carga de configuración | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Envío de notificación | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L280-L308) | 280-308 |
| Detección de terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Verificación de horario silencioso | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Configuración por defecto | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |

**Constantes clave**:
- `DEFAULT_CONFIG.sounds.idle = "Glass"`: Sonido por defecto de tarea completada
- `DEFAULT_CONFIG.sounds.error = "Basso"`: Sonido por defecto de error
- `DEFAULT_CONFIG.sounds.permission = "Submarine"`: Sonido por defecto de solicitud de permiso
- `DEFAULT_CONFIG.notifyChildSessions = false`: Por defecto solo notifica sesiones padre

**Funciones clave**:
- `NotifyPlugin()`: Función de entrada del complemento, devuelve manejadores de eventos
- `loadConfig()`: Carga el archivo de configuración, fusiona con valores por defecto
- `sendNotification()`: Envía notificación nativa de escritorio
- `detectTerminalInfo()`: Detecta el tipo de terminal y Bundle ID
- `isQuietHours()`: Verifica si la hora actual está en horario silencioso
- `isParentSession()`: Determina si es una sesión padre
- `isTerminalFocused()`: Detecta si la terminal es la ventana activa

</details>
