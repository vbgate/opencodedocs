---
title: "Preguntas Frecuentes y Solución de Problemas: Resolución Rápida de Diversos Problemas | Tutorial de AI App Factory"
sidebarTitle: "Qué hacer si encuentras problemas"
subtitle: "Preguntas frecuentes y solución de problemas"
description: "Aprende a localizar y resolver rápidamente problemas comunes al usar AI App Factory. Este tutorial explica en detalle los métodos de diagnóstico y los pasos de reparación para problemas como errores de inicialización de directorios, fallos al iniciar el asistente de IA, manejo de fallos de etapas, conflictos de versiones de dependencias y errores de exceso de privilegios, ayudándote a completar el desarrollo de aplicaciones de manera eficiente."
tags:
  - "Solución de problemas"
  - "FAQ"
  - "Depuración"
prerequisite:
  - "../../start/installation/"
  - "../../start/init-project/"
order: 190
---

# Preguntas Frecuentes y Solución de Problemas

## Lo que podrás hacer después de completar esta lección

- Localizar y resolver rápidamente problemas de directorio durante la inicialización
- Diagnosticar las causas de los fallos al iniciar el asistente de IA
- Comprender el proceso de manejo de fallos de etapas (reintentar/retroceder/intervención manual)
- Resolver problemas de instalación de dependencias y conflictos de versiones
- Manejar errores de exceso de privilegios del agente
- Usar `factory continue` para reanudar la ejecución en nuevas sesiones

## Tu situación actual

Es posible que estés encontrando estos problemas:

- ❌ Al ejecutar `factory init`, aparece el error "el directorio no está vacío"
- ❌ El asistente de IA no puede iniciar, no sabes cómo configurar los permisos
- ❌ La ejecución del pipeline falla repentinamente en alguna etapa, no sabes cómo continuar
- ❌ La instalación de dependencias reporta errores, conflictos de versiones graves
- ❌ Los productos generados por el agente están marcados como "no autorizados"
- ❌ No comprendes el mecanismo de puntos de control y reintentos

No te preocupes, todos estos problemas tienen soluciones claras. Este tutorial te ayudará a diagnosticar y reparar rápidamente varios tipos de fallos.

---

## 🎒 Preparativos antes de comenzar

::: warning Conocimientos previos

Antes de comenzar, asegúrate de haber:

- [ ] Completado [Instalación y configuración](../../start/installation/)
- [ ] Completado [Inicialización del proyecto Factory](../../start/init-project/)
- [ ] Comprendido [Visión general del pipeline de 7 etapas](../../start/pipeline-overview/)
- [ ] Sabido cómo usar [Integración con Claude Code](../../platforms/claude-code/)

:::

## Estrategia central

El manejo de fallos de AI App Factory sigue una estrategia estricta. Comprender este mecanismo te permitirá no sentirte perdido cuando encuentres problemas.

### Tres niveles de manejo de fallos

1. **Reintento automático**: cada etapa permite un reintento
2. **Archivado de reversión**: los productos fallidos se mueven a `_failed/`, se revierte al último punto de control exitoso
3. **Intervención manual**: tras dos fallos consecutivos, se pausa y requiere tu reparación manual

### Reglas de manejo de exceso de privilegios

- El agente escribe en un directorio no autorizado → se mueve a `_untrusted/`
- El pipeline se pausa, espera tu revisión
- Ajusta los permisos o modifica el comportamiento del agente según sea necesario

### Límites de permisos

Cada agente tiene un alcance estricto de permisos de lectura y escritura:

| Agente      | Puede leer                     | Puede escribir                       |
| ----------- | -------------------------- | ---------------------------- |
| bootstrap   | Ninguno                         | `input/`                     |
| prd         | `input/`                   | `artifacts/prd/`              |
| ui          | `artifacts/prd/`            | `artifacts/ui/`               |
| tech        | `artifacts/prd/`            | `artifacts/tech/`, `artifacts/backend/prisma/` |
| code        | `artifacts/ui/`, `artifacts/tech/`, `artifacts/backend/prisma/` | `artifacts/backend/`, `artifacts/client/` |
| validation  | `artifacts/backend/`, `artifacts/client/` | `artifacts/validation/`      |
| preview     | `artifacts/backend/`, `artifacts/client/` | `artifacts/preview/`         |

---

## Problemas de inicialización

### Problema 1: Error de directorio no vacío

**Síntomas**:

```bash
$ factory init
Error: Directory is not empty or contains conflicting files
```

**Causa**: El directorio actual contiene archivos en conflicto (no son archivos permitidos como `.git`, `README.md`, etc.).

**Solución**:

1. **Verificar el contenido del directorio**:

```bash
ls -la
```

2. **Limpiar archivos en conflicto**:

```bash
# Método 1: eliminar archivos en conflicto
rm -rf <archivos-en-conflicto>

# Método 2: mover a un nuevo directorio
mkdir ../my-app && mv . ../my-app/
cd ../my-app
```

3. **Volver a inicializar**:

```bash
factory init
```

**Archivos permitidos**: `.git`, `.gitignore`, `README.md`, `.vscode/*`, `.idea/*`

### Problema 2: Ya existe un proyecto Factory

**Síntomas**:

```bash
$ factory init
Error: This is already a Factory project
```

**Causa**: El directorio ya contiene directorios `.factory/` o `artifacts/`.

**Solución**:

- Si es un nuevo proyecto, limpia primero y luego inicializa:

```bash
rm -rf .factory artifacts
factory init
```

- Si deseas recuperar el proyecto antiguo, ejecuta directamente `factory run`

### Problema 3: Fallo al iniciar el asistente de IA

**Síntomas**:

```bash
$ factory init
✓ Factory project initialized
Could not find Claude Code installation.
```

**Causa**: Claude Code no está instalado o no está configurado correctamente.

**Solución**:

1. **Instalar Claude Code**:

```bash
# macOS
brew install claude

# Linux (descargar desde el sitio web oficial)
# https://claude.ai/code
```

2. **Verificar la instalación**:

```bash
claude --version
```

3. **Iniciar manualmente**:

```bash
# En el directorio del proyecto Factory
claude "Por favor lee .factory/pipeline.yaml y .factory/agents/orchestrator.checkpoint.md, inicia el pipeline"
```

**Proceso de inicio manual**: 1. Leer `pipeline.yaml` → 2. Leer `orchestrator.checkpoint.md` → 3. Esperar la ejecución de la IA

---

## Problemas de ejecución del pipeline

### Problema 4: Error de directorio no válido

**Síntomas**:

```bash
$ factory run
Error: Not a Factory project. Run 'factory init' first.
```

**Causa**: El directorio actual no es un proyecto Factory (falta el directorio `.factory/`).

**Solución**:

1. **Verificar la estructura del proyecto**:

```bash
ls -la .factory/
```

2. **Cambiar al directorio correcto** o **reinicializar**:

```bash
# Cambiar al directorio del proyecto
cd /ruta/al/proyecto

# O reinicializar
factory init
```

### Problema 5: Archivo de Pipeline no encontrado

**Síntomas**:

```bash
$ factory run
Error: Pipeline configuration not found
```

**Causa**: El archivo `pipeline.yaml` falta o la ruta es incorrecta.

**Solución**:

1. **Verificar si el archivo existe**:

```bash
ls -la .factory/pipeline.yaml
ls -la pipeline.yaml
```

2. **Copiar manualmente** (si el archivo se perdió):

```bash
cp /ruta/a/factory/source/hyz1992/agent-app-factory/pipeline.yaml .factory/
```

3. **Reinicializar** (la opción más confiable):

```bash
rm -rf .factory
factory init
```

---

## Manejo de fallos de etapas

### Problema 6: Fallo en la etapa Bootstrap

**Síntomas**:

- `input/idea.md` no existe
- `idea.md` carece de secciones clave (usuarios objetivo, valor central, hipótesis)

**Causa**: Información de usuario insuficiente, o el agente no escribió el archivo correctamente.

**Proceso de manejo**:

```
1. Verificar si existe el directorio input/ → crear si no existe
2. Reintentar una vez, indicar al agente que use la plantilla correcta
3. Si aún falla, solicitar al usuario que proporcione una descripción más detallada del producto
```

**Reparación manual**:

1. **Verificar el directorio de productos**:

```bash
ls -la artifacts/_failed/bootstrap/
```

2. **Crear el directorio input/**:

```bash
mkdir -p input
```

3. **Proporcionar una descripción detallada del producto**:

Proporciona a la IA una idea de producto más clara y detallada, incluyendo:
- Quiénes son los usuarios objetivo (perfil específico)
- Cuál es el punto de dolor central
- Qué problema deseas resolver
- Ideas iniciales de funcionalidad

### Problema 7: Fallo en la etapa PRD

**Síntomas**:

- La PRD contiene detalles técnicos (viola los límites de responsabilidad)
- Funcionalidades Must Have > 7 (proliferación de alcance)
- Falta el objetivo negativo (límites no definidos claramente)

**Causa**: El agente se excedió en sus límites o el control del alcance no fue estricto.

**Proceso de manejo**:

```
1. Verificar que prd.md no contiene palabras clave técnicas
2. Verificar que el número de funcionalidades Must Have ≤ 7
3. Verificar que el usuario objetivo tiene un perfil específico
4. Al reintentar, proporcionar requisitos de corrección específicos
```

**Ejemplos de errores comunes**:

| Tipo de error | Ejemplo de error | Ejemplo correcto |
|---------|---------|---------|
| Contiene detalles técnicos | "Implementar usando React Native" | "Soportar plataformas iOS y Android" |
| Proliferación de alcance | "Incluir pago, social, mensajería y 10 funcionalidades más" | "No más de 7 funcionalidades principales" |
| Objetivo difuso | "Todos pueden usarlo" | "Trabajadores urbanos de 25-35 años" |

**Reparación manual**:

1. **Verificar la PRD fallida**:

```bash
cat artifacts/_failed/prd/prd.md
```

2. **Corregir el contenido**:

- Eliminar descripciones del stack técnico
- Simplificar la lista de funcionalidades a ≤ 7
- Completar la lista de objetivos negativos

3. **Mover manualmente a la ubicación correcta**:

```bash
mv artifacts/_failed/prd/prd.md artifacts/prd/prd.md
```

### Problema 8: Fallo en la etapa UI

**Síntomas**:

- Cantidad de páginas > 8 (proliferación de alcance)
- Archivo HTML de vista previa dañado
- Usa estilo de IA (fuente Inter + gradiente púrpura)
- Fallo en el análisis YAML

**Causa**: Alcance de UI demasiado grande o no seguir la guía de estética.

**Proceso de manejo**:

```
1. Contar la cantidad de páginas en ui.schema.yaml
2. Intentar abrir preview.web/index.html en el navegador
3. Verificar la sintaxis YAML
4. Verificar si se usan elementos de estilo de IA prohibidos
```

**Reparación manual**:

1. **Verificar la sintaxis YAML**:

```bash
npx js-yaml .factory/artifacts/ui/ui.schema.yaml
```

2. **Abrir la vista previa en el navegador**:

```bash
open artifacts/ui/preview.web/index.html  # macOS
xdg-open artifacts/ui/preview.web/index.html  # Linux
```

3. **Simplificar la cantidad de páginas**: verificar `ui.schema.yaml`, asegurar que la cantidad de páginas ≤ 8

### Problema 9: Fallo en la etapa Tech

**Síntomas**:

- Errores de sintaxis en el schema de Prisma
- Introduce microservicios, caché u otros diseños excesivos
- Demasiados modelos de datos (número de tablas > 10)
- Falta definición de API

**Causa**: Complejidad arquitectónica o problemas de diseño de base de datos.

**Proceso de manejo**:

```
1. Ejecutar npx prisma validate para verificar el schema
2. Verificar si tech.md contiene secciones necesarias
3. Contar la cantidad de modelos de datos
4. Verificar si se introdujeron tecnologías complejas innecesarias
```

**Reparación manual**:

1. **Verificar el Schema de Prisma**:

```bash
cd artifacts/backend/
npx prisma validate
```

2. **Simplificar la arquitectura**: verificar `artifacts/tech/tech.md`, eliminar tecnologías innecesarias (microservicios, caché, etc.)

3. **Completar la definición de API**: asegurar que `tech.md` contenga todos los endpoints API necesarios

### Problema 10: Fallo en la etapa Code

**Síntomas**:

- Fallo en la instalación de dependencias
- Errores de compilación de TypeScript
- Faltan archivos necesarios
- Fallos en pruebas
- API no se puede iniciar

**Causa**: Conflictos de versiones de dependencias, problemas de tipo o errores lógicos de código.

**Proceso de manejo**:

```
1. Ejecutar npm install --dry-run para verificar dependencias
2. Ejecutar npx tsc --noEmit para verificar tipos
3. Verificar la estructura del directorio contra la lista de archivos
4. Ejecutar npm test para verificar pruebas
5. Si todo lo anterior pasa, intentar iniciar el servicio
```

**Reparación de problemas comunes de dependencias**:

```bash
# Conflicto de versiones
rm -rf node_modules package-lock.json
npm install

# Desajuste de versión de Prisma
npm install @prisma/client@latest prisma@latest

# Problemas de dependencias de React Native
npx expo install --fix
```

**Manejo de errores de TypeScript**:

```bash
# Verificar errores de tipo
npx tsc --noEmit

# Verificar nuevamente después de reparar
npx tsc --noEmit
```

**Verificación de estructura de directorio**:

Asegúrate de incluir los siguientes archivos/directorios necesarios:

```
artifacts/backend/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── index.ts
│   ├── lib/
│   └── routes/
└── vitest.config.ts

artifacts/client/
├── package.json
├── tsconfig.json
├── app.json
└── src/
```

### Problema 11: Fallo en la etapa Validation

**Síntomas**:

- Reporte de validación incompleto
- Demasiados problemas graves (número de errores > 10)
- Problemas de seguridad (detectadas claves codificadas)

**Causa**: Calidad deficiente en la etapa Code o problemas de seguridad.

**Proceso de manejo**:

```
1. Analizar report.md para confirmar que todas las secciones existen
2. Contar la cantidad de problemas graves
3. Si los problemas graves > 10, sugerir revertir a la etapa Code
4. Verificar los resultados del escaneo de seguridad
```

**Reparación manual**:

1. **Ver el reporte de validación**:

```bash
cat artifacts/validation/report.md
```

2. **Reparar problemas graves**: reparar uno por uno según el reporte

3. **Revertir a la etapa Code** (si hay demasiados problemas):

```bash
factory run code  # Reiniciar desde la etapa Code
```

### Problema 12: Fallo en la etapa Preview

**Síntomas**:

- README incompleto (falta el paso de instalación)
- Fallo en la construcción de Docker
- Falta configuración de despliegue

**Causa**: Omisión de contenido o problemas de configuración.

**Proceso de manejo**:

```
1. Verificar que README.md contiene todas las secciones necesarias
2. Intentar docker build para verificar el Dockerfile
3. Verificar si existen archivos de configuración de despliegue
```

**Reparación manual**:

1. **Verificar la configuración de Docker**:

```bash
cd artifacts/preview/
docker build -t my-app .
```

2. **Verificar archivos de despliegue**:

Asegúrate de que existan los siguientes archivos:

```
artifacts/preview/
├── README.md
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml  # Configuración CI/CD
```

---

## Manejo de errores de exceso de privilegios

### Problema 13: Escritura no autorizada del agente

**Síntomas**:

```bash
Error: Unauthorized write to <path>
Artifacts moved to: artifacts/_untrusted/<stage-id>/
Pipeline paused. Manual intervention required.
```

**Causa**: El agente escribió contenido en un directorio o archivo no autorizado.

**Solución**:

1. **Verificar archivos no autorizados**:

```bash
ls -la artifacts/_untrusted/<stage-id>/
```

2. **Revisar la matriz de permisos**: confirmar el alcance de escritura del agente

3. **Elegir método de manejo**:

   - **Opción A: corregir el comportamiento del agente** (recomendado)

   Indica claramente al asistente de IA el problema de exceso de privilegios y pide que lo corrija.

   - **Opción B: mover el archivo a la ubicación correcta** (con precaución)

   Si estás seguro de que el archivo debería existir, muévelo manualmente:

   ```bash
   mv artifacts/_untrusted/<stage-id>/<archivo> artifacts/<etapa-objetivo>/
   ```

   - **Opción C: ajustar la matriz de permisos** (avanzado)

   Modifica `.factory/policies/capability.matrix.md` para aumentar los permisos de escritura del agente.

4. **Continuar la ejecución**:

```bash
factory continue
```

**Escenarios de ejemplo**:

- Code Agent intenta modificar `artifacts/prd/prd.md` (viola los límites de responsabilidad)
- UI Agent intenta crear el directorio `artifacts/backend/` (fuera del alcance de permisos)
- Tech Agent intenta escribir en el directorio `artifacts/ui/` (exceso de límites)

---

## Problemas de ejecución en sesiones separadas

### Problema 14: Tokens insuficientes o acumulación de contexto

**Síntomas**:

- Las respuestas de la IA se vuelven más lentas
- El contexto demasiado largo provoca degradación del rendimiento del modelo
- Consumo excesivo de tokens

**Causa**: Se ha acumulado demasiado historial de conversación en la misma sesión.

**Solución: usar `factory continue`**

El comando `factory continue` te permite:

1. **Guardar el estado actual** en `.factory/state.json`
2. **Iniciar una nueva ventana de Claude Code**
3. **Continuar la ejecución desde la etapa actual**

**Pasos de ejecución**:

1. **Ver el estado actual**:

```bash
factory status
```

Ejemplo de salida:

```bash
Pipeline Status:
───────────────────────────────────────
Project: my-app
Status: Waiting
Current Stage: tech
Completed: bootstrap, prd, ui
```

2. **Continuar en una nueva sesión**:

```bash
factory continue
```

**Efectos**:

- Cada etapa disfruta de un contexto limpio
- Evita la acumulación de tokens
- Permite la recuperación de interrupciones

**Inicio manual de nueva sesión** (si `factory continue` falla):

```bash
# Regenerar configuración de permisos
claude "Por favor regenera .claude/settings.local.json, permitiendo operaciones Read/Write/Glob/Bash"

# Iniciar manualmente nueva sesión
claude "Por favor continúa ejecutando el pipeline, la etapa actual es tech"
```

---

## Problemas de entorno y permisos

### Problema 15: Versión de Node.js demasiado baja

**Síntomas**:

```bash
Error: Node.js version must be >= 16.0.0
```

**Causa**: La versión de Node.js no cumple los requisitos.

**Solución**:

1. **Verificar la versión**:

```bash
node --version
```

2. **Actualizar Node.js**:

```bash
# macOS
brew install node@18
brew link --overwrite node@18

# Linux (usando nvm)
nvm install 18
nvm use 18

# Windows (descargar desde el sitio web oficial)
# https://nodejs.org/
```

### Problema 16: Problemas de permisos de Claude Code

**Síntomas**:

- La IA indica "sin permisos de lectura/escritura"
- La IA no puede acceder al directorio `.factory/`

**Causa**: La configuración de permisos en `.claude/settings.local.json` es incorrecta.

**Solución**:

1. **Verificar el archivo de permisos**:

```bash
cat .claude/settings.local.json
```

2. **Regenerar permisos**:

```bash
factory continue  # Regenera automáticamente
```

O ejecutar manualmente:

```bash
node -e "
const { generateClaudeSettings } = require('./cli/utils/claude-settings');
generateClaudeSettings(process.cwd());
"
```

3. **Ejemplo de configuración de permisos correcta**:

```json
{
  "allowedCommands": ["npm", "npx", "node", "git"],
  "allowedPaths": [
    "/ruta/absoluta/al/proyecto/.factory",
    "/ruta/absoluta/al/proyecto/artifacts",
    "/ruta/absoluta/al/proyecto/input",
    "/ruta/absoluta/al/proyecto/node_modules"
  ]
}
```

### Problema 17: Problemas de red provocan fallo en la instalación de dependencias

**Síntomas**:

```bash
Error: Network request failed
npm ERR! code ECONNREFUSED
```

**Causa**: Problemas de conexión de red o fallo al acceder a la fuente npm.

**Solución**:

1. **Verificar la conexión de red**:

```bash
ping registry.npmjs.org
```

2. **Cambiar la fuente npm**:

```bash
# Usar espejo de Taobao
npm config set registry https://registry.npmmirror.com

# Verificar
npm config get registry
```

3. **Reinstalar dependencias**:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Árbol de decisiones de intervención manual

```
Stage falló
    │
    ▼
¿Es el primer fallo?
    ├─ Yes → Reintento automático
    │         │
    │         ▼
    │     ¿Reintento exitoso? → Yes → Continuar proceso
    │            │
    │            No → Segundo fallo
    │
    └─ No → Analizar causa del fallo
              │
              ▼
          ¿Es un problema de entrada?
              ├─ Yes → Modificar archivo de entrada
              │         └─ Revertir a Stage anterior
              │
              └─ No → Solicitar intervención manual
```

**Puntos de decisión**:

- **Primer fallo**: permitir reintento automático, observar si el error desaparece
- **Segundo fallo**: detener el procesamiento automático, requiere tu revisión manual
- **Problema de entrada**: modificar `input/idea.md` o productos anteriores
- **Problema técnico**: verificar dependencias, configuración o lógica de código
- **Problema de exceso de privilegios**: revisar la matriz de permisos o el comportamiento del agente

---

## Recordatorios de trampas comunes

### ❌ Errores comunes

1. **Modificar directamente productos anteriores**

   Enfoque incorrecto: modificar `input/idea.md` durante la etapa PRD
   
   Enfoque correcto: revertir a la etapa Bootstrap

2. **Ignorar la confirmación de puntos de control**

   Enfoque incorrecto: saltar rápidamente todos los puntos de control
   
   Enfoque correcto: verificar cuidadosamente si los productos de cada etapa cumplen con las expectativas

3. **Eliminar manualmente productos fallidos**

   Enfoque incorrecto: eliminar el directorio `_failed/`
   
   Enfoque correcto: conservar los productos fallidos para análisis comparativo

4. **No regenerar permisos después de modificaciones**

   Enfoque incorrecto: no actualizar `.claude/settings.local.json` después de modificar la estructura del proyecto
   
   Enfoque correcto: ejecutar `factory continue` para actualizar permisos automáticamente

### ✅ Mejores prácticas

1. **Fallo temprano**: detectar problemas lo antes posible para evitar perder tiempo en etapas posteriores

2. **Registro detallado**: conservar registros completos de errores para facilitar la solución de problemas

3. **Operaciones atómicas**: la salida de cada etapa debe ser atómica para facilitar la reversión

4. **Conservar evidencia**: archivar productos fallidos antes de reintentar para facilitar el análisis comparativo

5. **Reintento progresivo**: proporcionar instrucciones más específicas al reintentar, en lugar de simplemente repetir

---

## Resumen de esta lección

Este curso cubre varios problemas comunes al usar AI App Factory:

| Categoría | Número de problemas | Método principal de solución |
|-----|--------|-------------|
| Inicialización | 3 | Limpiar directorios, instalar asistente de IA, inicio manual |
| Ejecución del pipeline | 2 | Verificar estructura del proyecto, verificar archivos de configuración |
| Fallos de etapas | 7 | Reintentar, revertir, reparar y volver a ejecutar |
| Manejo de exceso de privilegios | 1 | Revisar matriz de permisos, mover archivos o ajustar permisos |
| Ejecución en sesiones separadas | 1 | Usar `factory continue` para iniciar nueva sesión |
| Entorno y permisos | 3 | Actualizar Node.js, regenerar permisos, cambiar fuente npm |

**Puntos clave**:

- Cada etapa permite **un reintento automático**
- Tras dos fallos consecutivos se requiere **intervención manual**
- Los productos fallidos se archivan automáticamente en `_failed/`
- Los archivos no autorizados se mueven a `_untrusted/`
- Usa `factory continue` para ahorrar tokens

**Recuerda**:

No entres en pánico cuando encuentres problemas. Primero revisa los registros de error, luego verifica el directorio de productos correspondiente, y usa las soluciones de este curso para diagnosticar paso a paso. La mayoría de los problemas se pueden resolver mediante reintentos, reversión o reparación de archivos de entrada.

## Próxima lección

> En la próxima lección aprenderemos **[Mejores prácticas](../best-practices/)**.
>
> Aprenderás:
> - Cómo proporcionar una descripción clara del producto
> - Cómo aprovechar el mecanismo de puntos de control
> - Cómo controlar el alcance del proyecto
> - Cómo iterar y optimizar gradualmente

**Lecturas relacionadas**:

- [Manejo de fallos y reversión](../../advanced/failure-handling/) - comprensión profunda de la estrategia de manejo de fallos
- [Permisos y mecanismos de seguridad](../../advanced/security-permissions/) - comprender la matriz de límites de capacidad
- [Optimización de contexto](../../advanced/context-optimization/) - técnicas para ahorrar tokens

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Click para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-29

| Funcionalidad | Ruta del archivo | Número de línea |
|------|----------|------|
| Verificación de directorio de inicialización | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 32-53 |
| Inicio del asistente de IA | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| Definición de estrategia de fallos | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-276 |
| Especificación de códigos de error | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |
| Matriz de límites de capacidad | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-23 |
| Configuración del pipeline | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | Texto completo |
| Núcleo del programador | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Comando Continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |

**Constantes clave**:
- Cantidad permitida de funcionalidades Must Have: ≤ 7
- Cantidad permitida de páginas UI: ≤ 8
- Cantidad permitida de modelos de datos: ≤ 10
- Número de reintentos: cada etapa permite un reintento

**Funciones clave**:
- `isFactoryProject(dir)` - verifica si es un proyecto Factory
- `isDirectorySafeToInit(dir)` - verifica si el directorio se puede inicializar
- `generateClaudeSettings(projectDir)` - genera configuración de permisos de Claude Code
- `factory continue` - continúa la ejecución del pipeline en una nueva sesión

</details>
