---
title: "Inicio Rápido: Domina en 5 Minutos | Plannotator"
sidebarTitle: "Domina en 5 minutos"
subtitle: "Inicio Rápido: Domina Plannotator en 5 minutos"
description: "Aprende a instalar y configurar Plannotator. Completa la instalación del CLI en 5 minutos, configura el plugin de Claude Code u OpenCode, domina el flujo de revisión de planes y revisión de código."
tags:
  - "quick-start"
  - "getting-started"
  - "installation"
  - "claude-code"
  - "opencode"
order: 1
---

# Inicio Rápido: Domina Plannotator en 5 minutos

## Lo que aprenderás

- ✅ Comprender las funciones principales y casos de uso de Plannotator
- ✅ Completar la instalación de Plannotator en 5 minutos
- ✅ Configurar la integración con Claude Code u OpenCode
- ✅ Realizar tu primera revisión de plan y revisión de código

## Tu situación actual

**Plannotator** es una herramienta de revisión interactiva diseñada para Claude Code y OpenCode, que te ayuda a resolver los siguientes problemas:

**Problema 1**: Los planes de implementación generados por IA se leen en la terminal, con gran cantidad de texto y estructura poco clara, lo que hace que la revisión sea agotadora.

**Problema 2**: Al dar feedback a la IA, solo puedes usar descripciones de texto como "eliminar el párrafo 3" o "modificar esta función", lo que genera un alto costo de comunicación.

**Problema 3**: Durante la revisión de código, necesitas abrir múltiples terminales o IDEs, alternando constantemente, lo que dificulta la concentración.

**Problema 4**: Los miembros del equipo quieren participar en la revisión, pero no saben cómo compartir el contenido del plan.

**Plannotator puede ayudarte**:
- Interfaz visual en lugar de lectura en terminal, con estructura clara
- Añade anotaciones (eliminar, reemplazar, comentar) seleccionando texto, feedback preciso
- Revisión visual de Git diff, con soporte para anotaciones a nivel de línea
- Función de compartir URL, colaboración en equipo sin necesidad de backend

## Cuándo usar esta técnica

**Casos de uso**:
- Usar Claude Code u OpenCode para desarrollo asistido por IA
- Necesitar revisar planes de implementación generados por IA
- Necesitar revisar cambios de código
- Necesitar compartir planes o resultados de revisión de código con miembros del equipo

**Casos no adecuados**:
- Código escrito completamente a mano (sin planes generados por IA)
- Ya tienes un flujo completo de revisión de código (como GitHub PR)
- No necesitas herramientas de revisión visual

## Concepto central

### Qué es Plannotator

**Plannotator** es una herramienta de revisión interactiva diseñada para AI Coding Agents (Claude Code, OpenCode), que proporciona principalmente dos funciones:

1. **Revisión de planes**: Revisión visual de planes de implementación generados por IA, con soporte para añadir anotaciones, aprobar o rechazar
2. **Revisión de código**: Revisión visual de Git diff, con soporte para anotaciones a nivel de línea y múltiples modos de vista

### Cómo funciona

```
┌─────────────────┐
│  AI Agent      │
│  (genera plan) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Plannotator   │  ← Servidor HTTP local
│  (UI visual)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Navegador     │
│  (revisión)    │
└─────────────────┘
```

**Flujo principal**:
1. AI Agent completa el plan o cambios de código
2. Plannotator inicia un servidor HTTP local y abre el navegador
3. El usuario revisa el plan/código en el navegador y añade anotaciones
4. El usuario aprueba o solicita cambios, Plannotator devuelve la decisión al AI Agent
5. AI Agent continúa la implementación o modifica según el feedback

### Seguridad

**Todos los datos se procesan localmente**, no se suben a la nube:
- El contenido del plan, código diff y anotaciones se almacenan en tu máquina local
- El servidor HTTP local usa un puerto aleatorio (o puerto fijo)
- La función de compartir URL se implementa comprimiendo datos en el hash de la URL, sin necesidad de backend

## 🎒 Preparación previa

**Requisitos del sistema**:
- Sistema operativo: macOS / Linux / Windows / WSL
- Runtime: Bun (el script de instalación lo maneja automáticamente)
- Entorno AI: Claude Code 2.1.7+ u OpenCode

**Selección del método de instalación**:
- Si usas Claude Code: necesitas instalar CLI + plugin
- Si usas OpenCode: necesitas configurar el plugin
- Si solo haces revisión de código: solo necesitas instalar el CLI

## Paso a paso

### Paso 1: Instalar Plannotator CLI

**macOS / Linux / WSL**:

```bash
curl -fsSL https://plannotator.ai/install.sh | bash
```

**Windows PowerShell**:

```powershell
irm https://plannotator.ai/install.ps1 | iex
```

**Windows CMD**:

```cmd
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**Deberías ver**: El script de instalación descargará automáticamente Plannotator CLI y lo añadirá a la ruta del sistema, mostrando el número de versión (como "plannotator v0.6.7 installed to ...").

::: tip ¿Qué hace el script de instalación?
El script de instalación:
1. Descarga la última versión de Plannotator CLI
2. Lo añade a la ruta del sistema (PATH)
3. Limpia posibles versiones antiguas
4. Instala automáticamente el comando `/plannotator-review` (para revisión de código)
:::

### Paso 2: Configurar Claude Code (opcional)

Si usas Claude Code, necesitas instalar el plugin.

**Ejecuta en Claude Code**:

```
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**Importante**: Después de instalar el plugin, **debes reiniciar Claude Code** para que los hooks se activen.

**Deberías ver**: Después de instalar el plugin exitosamente, `plannotator` aparecerá en la lista de plugins de Claude Code.

::: info Método de configuración manual (opcional)
Si no quieres usar el sistema de plugins, puedes configurar el hook manualmente. Consulta el capítulo [Instalación del plugin de Claude Code](../installation-claude-code/).
:::

### Paso 3: Configurar OpenCode (opcional)

Si usas OpenCode, necesitas editar el archivo `opencode.json`.

**Edita `opencode.json`**:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**Reinicia OpenCode**.

**Deberías ver**: Después de reiniciar, OpenCode cargará automáticamente el plugin y la herramienta `submit_plan` estará disponible.

### Paso 4: Primera revisión de plan (ejemplo con Claude Code)

**Condición de activación**: Haz que Claude Code genere un plan de implementación y llame a `ExitPlanMode`.

**Ejemplo de diálogo**:

```
Usuario: Ayúdame a escribir un plan de implementación para un módulo de autenticación de usuarios

Claude: De acuerdo, este es el plan de implementación:
1. Crear modelo de usuario
2. Implementar API de registro
3. Implementar API de inicio de sesión
...
(llama a ExitPlanMode)
```

**Deberías ver**:
1. El navegador abre automáticamente la interfaz de Plannotator
2. Muestra el contenido del plan generado por IA
3. Puedes seleccionar texto del plan y añadir anotaciones (eliminar, reemplazar, comentar)
4. En la parte inferior hay botones "Approve" y "Request Changes"

**Operación**:
1. Revisa el plan en el navegador
2. Si el plan está bien, haz clic en **Approve** → IA continúa la implementación
3. Si necesitas modificaciones, selecciona el texto a cambiar, haz clic en **Delete**, **Replace** o **Comment** → haz clic en **Request Changes**

**Deberías ver**: Después de hacer clic, el navegador se cerrará automáticamente y Claude Code recibirá tu decisión y continuará ejecutando.

### Paso 5: Primera revisión de código

**Ejecuta en el directorio del proyecto**:

```bash
/plannotator-review
```

**Deberías ver**:
1. El navegador abre la página de revisión de código
2. Muestra el Git diff (por defecto son los cambios no confirmados)
3. A la izquierda está el árbol de archivos, a la derecha el visor de diff
4. Haz clic en los números de línea para seleccionar un rango de código y añadir anotaciones

**Operación**:
1. Navega por los cambios de código en el visor de diff
2. Haz clic en los números de línea para seleccionar el código a revisar
3. Añade anotaciones en el panel derecho (comment/suggestion/concern)
4. Haz clic en **Send Feedback** para enviar al agent, o haz clic en **LGTM** para aprobar

**Deberías ver**: Después de hacer clic en Send Feedback, el navegador se cerrará, la terminal mostrará el feedback formateado y el agent lo procesará automáticamente.

## Punto de verificación ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] El script de instalación muestra "plannotator vX.X.X installed to ..."
- [ ] Activar la revisión de plan en Claude Code, el navegador abre automáticamente la interfaz
- [ ] Seleccionar texto del plan en la interfaz y añadir anotaciones
- [ ] Hacer clic en Approve o Request Changes y ver que el navegador se cierra
- [ ] Ejecutar `/plannotator-review` y ver la interfaz de revisión de código
- [ ] Añadir anotaciones a nivel de línea en la revisión de código y hacer clic en Send Feedback

**Si algún paso falla**, consulta:
- [Guía de instalación de Claude Code](../installation-claude-code/)
- [Guía de instalación de OpenCode](../installation-opencode/)
- [Preguntas frecuentes](../../faq/common-problems/)

## Advertencias sobre problemas comunes

**Error común 1**: Después de la instalación, ejecutar `plannotator` muestra "command not found"

**Causa**: La variable de entorno PATH no se actualizó, o necesitas reiniciar la terminal.

**Solución**:
- macOS/Linux: Ejecuta `source ~/.zshrc` o `source ~/.bashrc`, o reinicia la terminal
- Windows: Reinicia PowerShell o CMD

**Error común 2**: Después de instalar el plugin en Claude Code, la revisión de plan no se activa

**Causa**: No reiniciaste Claude Code, los hooks no se activaron.

**Solución**: Cierra completamente Claude Code (no solo cerrar la ventana), luego vuelve a abrirlo.

**Error común 3**: El navegador no se abre automáticamente

**Causa**: Puede ser modo remoto (como devcontainer, SSH), o el puerto está ocupado.

**Solución**:
- Verifica si configuraste la variable de entorno `PLANNOTATOR_REMOTE=1`
- Revisa la URL en la salida de la terminal y ábrela manualmente en el navegador
- Consulta [Modo Remoto/Devcontainer](../../advanced/remote-mode/)

**Error común 4**: La revisión de código muestra "No changes"

**Causa**: Actualmente no hay cambios git sin confirmar.

**Solución**:
- Primero ejecuta `git status` para confirmar que hay cambios
- O ejecuta `git add` para preparar algunos archivos
- O cambia a otro tipo de diff (como last commit)

## Resumen de la lección

Plannotator es una herramienta de revisión que se ejecuta localmente, mejorando la eficiencia de la revisión de planes y código mediante una interfaz visual:

**Funciones principales**:
- **Revisión de planes**: Revisión visual de planes generados por IA, con soporte para anotaciones precisas
- **Revisión de código**: Revisión visual de Git diff, con soporte para anotaciones a nivel de línea
- **Compartir URL**: Compartir contenido de revisión sin necesidad de backend
- **Integración con terceros**: Guardar automáticamente planes aprobados en Obsidian/Bear

**Ventajas principales**:
- Ejecución local, datos seguros
- Interfaz visual, mayor eficiencia
- Feedback preciso, menor costo de comunicación
- Colaboración en equipo, sin sistema de cuentas

## Próxima lección

> En la próxima lección aprenderemos sobre **[Instalación del plugin de Claude Code](../installation-claude-code/)**.
>
> Aprenderás:
> - Pasos detallados de instalación del plugin de Claude Code
> - Método de configuración manual de hooks
> - Cómo verificar que la instalación fue exitosa
> - Solución de problemas comunes de instalación

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Función | Ruta del archivo | Líneas |
| --- | --- | --- |
| Punto de entrada CLI (revisión de plan) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L1-L50) | 1-50 |
| Punto de entrada CLI (revisión de código) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84) | 46-84 |
| Servidor de revisión de plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L1-L200) | 1-200 |
| Servidor de revisión de código | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L150) | 1-150 |
| Herramientas Git | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L100) | 1-100 |
| UI de revisión de plan | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| UI de revisión de código | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L200) | 1-200 |

**Constantes clave**:
- `MAX_RETRIES = 5`: Número de reintentos de puerto (`packages/server/index.ts:80`)
- `RETRY_DELAY_MS = 500`: Retraso de reintento de puerto (`packages/server/index.ts:80`)

**Funciones clave**:
- `startPlannotatorServer()`: Inicia el servidor de revisión de plan (`packages/server/index.ts`)
- `startReviewServer()`: Inicia el servidor de revisión de código (`packages/server/review.ts`)
- `runGitDiff()`: Ejecuta el comando git diff (`packages/server/git.ts`)

**Variables de entorno**:
- `PLANNOTATOR_REMOTE`: Indicador de modo remoto (`apps/hook/server/index.ts:17`)
- `PLANNOTATOR_PORT`: Puerto fijo (`apps/hook/server/index.ts:18`)
- `PLANNOTATOR_BROWSER`: Navegador personalizado (`apps/hook/README.md:79`)
- `PLANNOTATOR_SHARE`: Interruptor de compartir URL (`apps/hook/server/index.ts:44`)

</details>
