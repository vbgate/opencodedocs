---
title: "OpenCode: Instalación del Plugin | Plannotator"
sidebarTitle: "Listo para usar"
subtitle: "Instalar el plugin de OpenCode"
description: "Aprende a instalar el plugin Plannotator en OpenCode. Configura opencode.json para añadir el plugin, ejecuta el script de instalación para obtener comandos slash, configura variables de entorno para modo remoto y verifica que el plugin funcione correctamente."
tags:
  - "Instalación"
  - "Configuración"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 3
---

# Instalar el plugin de OpenCode

## Lo que aprenderás

- Instalar el plugin Plannotator en OpenCode
- Configurar la herramienta `submit_plan` y el comando `/plannotator-review`
- Establecer variables de entorno (modo remoto, puerto, navegador, etc.)
- Verificar que la instalación del plugin sea exitosa

## Tu situación actual

Al usar AI Agent en OpenCode, la revisión de planes requiere leer texto plano en la terminal, lo que dificulta dar retroalimentación precisa. Quieres una interfaz visual para anotar planes, agregar comentarios y enviar automáticamente la retroalimentación estructurada de vuelta al Agent.

## Cuándo usar esto

**Obligatorio antes de usar Plannotator**: Si desarrollas en el entorno OpenCode y deseas una experiencia interactiva de revisión de planes.

## 🎒 Antes de empezar

- [ ] Tener instalado [OpenCode](https://opencode.ai/)
- [ ] Conocer la configuración básica de `opencode.json` (sistema de plugins de OpenCode)

::: warning Conocimientos previos
Si aún no conoces las operaciones básicas de OpenCode, te recomendamos leer primero la [documentación oficial de OpenCode](https://opencode.ai/docs).
:::

## Concepto principal

Plannotator proporciona dos funcionalidades principales para OpenCode:

1. **Herramienta `submit_plan`** - Se invoca cuando el Agent completa un plan, abriendo el navegador para revisión interactiva
2. **Comando `/plannotator-review`** - Activa manualmente la revisión de código con Git diff

El proceso de instalación tiene dos pasos:
1. Añadir la configuración del plugin en `opencode.json` (habilita la herramienta `submit_plan`)
2. Ejecutar el script de instalación (obtiene el comando `/plannotator-review`)

## Paso a paso

### Paso 1: Instalar el plugin mediante opencode.json

Encuentra tu archivo de configuración de OpenCode (generalmente en el directorio raíz del proyecto o en el directorio de configuración del usuario), y añade Plannotator al array `plugin`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**Por qué**
`opencode.json` es el archivo de configuración de plugins de OpenCode. Al añadir el nombre del plugin, OpenCode descargará y cargará automáticamente el plugin desde el repositorio npm.

Deberías ver: Al iniciar OpenCode, aparecerá el mensaje "Loading plugin: @plannotator/opencode...".

---

### Paso 2: Reiniciar OpenCode

**Por qué**
Los cambios en la configuración del plugin requieren reiniciar para aplicarse.

Deberías ver: OpenCode recargando todos los plugins.

---

### Paso 3: Ejecutar el script de instalación para obtener comandos slash

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

:::

**Por qué**
Este script:
1. Descarga la herramienta CLI `plannotator` en tu sistema
2. Instala el comando slash `/plannotator-review` en OpenCode
3. Limpia cualquier versión del plugin en caché

Deberías ver: Un mensaje de éxito similar a "Plannotator installed successfully!"

---

### Paso 4: Verificar la instalación

Comprueba en OpenCode si el plugin funciona correctamente:

**Verificar si la herramienta `submit_plan` está disponible**:
- En la conversación, pregunta al Agent "Por favor usa submit_plan para enviar el plan"
- Si el plugin funciona correctamente, el Agent debería poder ver e invocar esta herramienta

**Verificar si el comando `/plannotator-review` está disponible**:
- En el campo de entrada, escribe `/plannotator-review`
- Si el plugin funciona correctamente, deberías ver la sugerencia del comando

Deberías ver: Ambas funcionalidades funcionando correctamente, sin mensajes de error.

---

### Paso 5: Configurar variables de entorno (opcional)

Plannotator soporta las siguientes variables de entorno, configúralas según tus necesidades:

::: details Descripción de variables de entorno

| Variable de entorno | Propósito | Valor por defecto | Ejemplo |
| --- | --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Habilitar modo remoto (devcontainer/SSH) | No establecido | `export PLANNOTATOR_REMOTE=1` |
| `PLANNOTATOR_PORT` | Puerto fijo (obligatorio en modo remoto) | Aleatorio local, 19432 remoto | `export PLANNOTATOR_PORT=9999` |
| `PLANNOTATOR_BROWSER` | Ruta personalizada del navegador | Predeterminado del sistema | `export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"` |
| `PLANNOTATOR_SHARE` | Deshabilitar compartir URL | Habilitado | `export PLANNOTATOR_SHARE=disabled` |

:::

**Ejemplo de configuración en modo remoto** (devcontainer/SSH):

En `.devcontainer/devcontainer.json`:

```json
{
  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },
  "forwardPorts": [9999]
}
```

**Por qué**
- Modo remoto: Al ejecutar OpenCode en un contenedor o máquina remota, usa un puerto fijo y abre automáticamente el navegador
- Reenvío de puertos: Permite que la máquina host acceda al servicio dentro del contenedor

Deberías ver: Cuando el Agent invoca `submit_plan`, la consola mostrará la URL del servidor (en lugar de abrir automáticamente el navegador), por ejemplo:
```
Plannotator server running at http://localhost:9999
```

---

### Paso 6: Reiniciar OpenCode (si modificaste variables de entorno)

Si configuraste variables de entorno en el paso 5, necesitas reiniciar OpenCode nuevamente para que la configuración surta efecto.

---

## Punto de verificación ✅

Después de completar la instalación, confirma lo siguiente:

- [ ] `@plannotator/opencode@latest` añadido en `opencode.json`
- [ ] Sin errores de carga de plugins después de reiniciar OpenCode
- [ ] Al escribir `/plannotator-review` aparece la sugerencia del comando
- [ ] (Opcional) Variables de entorno configuradas correctamente

## Errores comunes

### Error común 1: Fallo al cargar el plugin

**Síntoma**: Al iniciar OpenCode aparece "Failed to load plugin @plannotator/opencode"

**Posibles causas**:
- Problemas de red que impiden la descarga desde npm
- Caché de npm corrupta

**Solución**:
1. Verificar la conexión de red
2. Ejecutar el script de instalación (limpia la caché del plugin)
3. Limpiar manualmente la caché de npm: `npm cache clean --force`

---

### Error común 2: Comando slash no disponible

**Síntoma**: Al escribir `/plannotator-review` no aparece la sugerencia del comando

**Posible causa**: El script de instalación no se ejecutó correctamente

**Solución**: Volver a ejecutar el script de instalación (paso 3)

---

### Error común 3: El navegador no se abre en modo remoto

**Síntoma**: Al invocar `submit_plan` en devcontainer, el navegador no se abre

**Posibles causas**:
- No se estableció `PLANNOTATOR_REMOTE=1`
- No se configuró el reenvío de puertos

**Solución**:
1. Confirmar que `PLANNOTATOR_REMOTE=1` está establecido
2. Verificar que `forwardPorts` en `.devcontainer/devcontainer.json` incluye el puerto configurado
3. Acceder manualmente a la URL mostrada: `http://localhost:9999`

---

### Error común 4: Puerto ocupado

**Síntoma**: El servidor no inicia, muestra "Port already in use"

**Posible causa**: El servidor anterior no se cerró correctamente

**Solución**:
1. Cambiar `PLANNOTATOR_PORT` a otro puerto
2. O cerrar manualmente el proceso que ocupa el puerto (macOS/Linux: `lsof -ti:9999 | xargs kill`)

---

## Resumen de la lección

Esta lección explicó cómo instalar y configurar el plugin Plannotator en OpenCode:

1. **Añadir el plugin mediante `opencode.json`** - Habilita la herramienta `submit_plan`
2. **Ejecutar el script de instalación** - Obtiene el comando slash `/plannotator-review`
3. **Configurar variables de entorno** - Adapta el modo remoto y necesidades personalizadas
4. **Verificar la instalación** - Confirma que el plugin funciona correctamente

Después de completar la instalación, puedes:
- Hacer que el Agent use `submit_plan` para enviar planes para revisión interactiva
- Usar `/plannotator-review` para revisar manualmente Git diff

## Próxima lección

> En la próxima lección aprenderemos **[Fundamentos de revisión de planes](../../platforms/plan-review-basics/)**.
>
> Aprenderás:
> - Cómo ver los planes generados por IA
> - Añadir diferentes tipos de anotaciones (eliminar, reemplazar, insertar, comentar)
> - Aprobar o rechazar planes

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Definición de entrada del plugin | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 34-280 |
| Definición de herramienta `submit_plan` | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 209-252 |
| Inyección de configuración del plugin (opencode.json) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 55-63 |
| Lectura de variables de entorno | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |
| Inicio del servidor de revisión de planes | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts) | Completo |
| Inicio del servidor de revisión de código | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts) | Completo |
| Detección de modo remoto | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | Completo |

**Constantes clave**:
- `PLANNOTATOR_REMOTE`: Indicador de modo remoto (establecer a "1" o "true" para habilitar)
- `PLANNOTATOR_PORT`: Número de puerto fijo (aleatorio por defecto en local, 19432 por defecto en remoto)

**Funciones clave**:
- `startPlannotatorServer()`: Inicia el servidor de revisión de planes
- `startReviewServer()`: Inicia el servidor de revisión de código
- `getSharingEnabled()`: Obtiene el estado del interruptor de compartir URL (desde la configuración de OpenCode o variables de entorno)

</details>
