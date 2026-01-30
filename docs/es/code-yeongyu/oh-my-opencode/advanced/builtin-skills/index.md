---
title: "Skills Incorporados: Automatización de Navegador y Git | oh-my-opencode"
sidebarTitle: "4 Skills Navaja Suiza"
subtitle: "Skills Incorporados: Automatización de Navegador, Diseño UI/UX y Experto en Git"
description: "Aprende los 4 Skills incorporados de oh-my-opencode: playwright, frontend-ui-ux, git-master, dev-browser. Domina la automatización de navegador, diseño UI y operaciones Git."
tags:
  - "skills"
  - "browser-automation"
  - "git"
  - "ui-ux"
prerequisite:
  - "categories-skills"
order: 110
---

# Skills Incorporados: Automatización de Navegador, Diseño UI/UX y Experto en Git

## Lo Que Aprenderás

En esta lección, aprenderás a:
- Usar `playwright` o `agent-browser` para pruebas de automatización de navegador y extracción de datos
- Hacer que el agente adopte la perspectiva de un diseñador para crear interfaces UI/UX exquisitas
- Automatizar operaciones Git, incluyendo commits atómicos, búsqueda de historial y rebase
- Usar `dev-browser` para el desarrollo de automatización de navegador con estado persistente

## Tu Situación Actual

¿Te has encontrado con estas situaciones?
- Quieres probar páginas frontend, pero hacer clic manualmente es demasiado lento y no sabes escribir scripts de Playwright
- Después de escribir código, los mensajes de commit son un desastre y el historial está hecho un lío
- Necesitas diseñar interfaces UI pero no sabes por dónde empezar, y las interfaces que creas carecen de estética
- Necesitas automatizar operaciones del navegador, pero cada vez tienes que volver a iniciar sesión y autenticarte

Los **Skills Incorporados** son las navajas suizas que hemos preparado para ti: cada Skill es un experto en un dominio específico que te ayuda a resolver rápidamente estos puntos problemáticos.

## Cuándo Usar Esta Técnica

| Escenario | Skill Recomendado | Por Qué |
| --- | --- | --- |
| La interfaz UI frontend necesita un diseño estético | `frontend-ui-ux` | Perspectiva de diseñador, atención a tipografía, color y animación |
| Pruebas de navegador, capturas de pantalla, extracción de datos | `playwright` o `agent-browser` | Capacidad completa de automatización de navegador |
| Commit de Git, búsqueda de historial, gestión de ramas | `git-master` | Detección automática de estilo de commits, generación de commits atómicos |
| Se necesitan múltiples operaciones del navegador (mantener estado de sesión) | `dev-browser` | Estado de página persistente, soporte para reutilización |

## Conceptos Fundamentales

**¿Qué es un Skill?**

El Skill es un mecanismo para inyectar **conocimiento profesional** y **herramientas dedicadas** al agente. Cuando usas `delegate_task` y especificas el parámetro `load_skills`, el sistema:
1. Carga el `template` del Skill como parte del prompt del sistema
2. Inyecta el servidor MCP configurado del Skill (si existe)
3. Limita el alcance de herramientas disponibles (si hay `allowedTools`)

**Skills Incorporados vs Personalizados**

- **Skills Incorporados**: Listos para usar, con prompts y herramientas preconfigurados
- **Skills Personalizados**: Puedes crear tu propio SKILL.md en el directorio `.opencode/skills/` o `~/.claude/skills/`

Esta lección se enfoca en 4 Skills incorporados que cubren los escenarios de desarrollo más comunes.

## 🎒 Preparativos

Antes de comenzar a usar los Skills incorporados, asegúrate de:
- [ ] Haber completado la lección [Categories y Skills](../categories-skills/)
- [ ] Comprender el uso básico de la herramienta `delegate_task`
- [ ] Los Skills de automatización de navegador requieren iniciar primero el servidor correspondiente (Playwright MCP o agent-browser)

---

## Skill 1: playwright (Automatización de Navegador)

### Descripción General

El Skill `playwright` usa el servidor MCP de Playwright para proporcionar capacidades completas de automatización de navegador:
- Navegación e interacción de páginas
- Localización y operación de elementos (clic, llenado de formularios)
- Capturas de pantalla y exportación a PDF
- Intercepción y simulación de solicitudes de red

**Escenarios Aplicables**: Verificación de UI, pruebas E2E, capturas de páginas web, extracción de datos

### Sígueme: Verifica la Funcionalidad del Sitio

**Escenario**: Necesitas verificar que la función de inicio de sesión funciona correctamente.

#### Paso 1: Activa el Skill playwright

En OpenCode, escribe:

```
Usa playwright para navegar a https://example.com/login y captura una pantalla mostrando el estado de la página
```

**Deberías ver**: El agente llamará automáticamente a las herramientas MCP de Playwright, abrirá el navegador y tomará una captura de pantalla.

#### Paso 2: Llena el Formulario y Envía

Continúa escribiendo:

```
Usa playwright para llenar los campos de nombre de usuario y contraseña (user@example.com / password123), luego haz clic en el botón de inicio de sesión y captura el resultado
```

**Deberías ver**: El agente localizará automáticamente los elementos del formulario, llenará los datos, hará clic en el botón y devolverá una captura de pantalla del resultado.

#### Paso 3: Verifica el Redireccionamiento

```
Espera a que la página se cargue completamente, luego verifica si la URL redirigió a /dashboard
```

**Deberías ver**: El agente reporta la URL actual para confirmar que el redireccionamiento fue exitoso.

### Puntos de Verificación ✅

- [ ] El navegador puede navegar exitosamente a la página objetivo
- [ ] Las operaciones de llenado de formulario y clic se ejecutan normalmente
- [ ] Las capturas de pantalla pueden mostrar claramente el estado de la página

::: tip Nota de Configuración
Por defecto, el motor de automatización de navegador usa `playwright`. Si deseas cambiar a `agent-browser`, configúralo en `oh-my-opencode.json`:

```json
{
  "browser_automation_engine": {
    "provider": "agent-browser"
  }
}
```
:::

---

## Skill 2: frontend-ui-ux (Perspectiva de Diseñador)

### Descripción General

El Skill `frontend-ui-ux` transforma al agente en un rol de "diseñador convertido en desarrollador":
- Se enfoca en **tipografía, color y animación** y otros detalles visuales
- Enfatiza **direcciones estéticas audaces** (minimalista, maximalista, retrofuturista, etc.)
- Proporciona **principios de diseño**: evitar fuentes genéricas (Inter, Roboto, Arial), crear esquemas de color únicos

**Escenarios Aplicables**: Diseño de componentes UI, embellecimiento de interfaces, construcción de sistemas visuales

### Sígueme: Diseña un Panel de Datos Elegante

**Escenario**: Necesitas diseñar un panel de estadísticas de datos, pero no tienes diseños.

#### Paso 1: Habilita el Skill frontend-ui-ux

```
Usa el skill frontend-ui-ux para diseñar una página de panel de estadísticas de datos
Requisitos: Incluye 3 tarjetas de datos (usuarios, ingresos, número de pedidos), usa un estilo de diseño moderno
```

**Deberías ver**: El agente primero realizará una "planificación de diseño", determinando el propósito, tono, restricciones y puntos de diferenciación.

#### Paso 2: Define la Dirección Estética

El agente te preguntará (o determinará internamente) el estilo de diseño. Por ejemplo:

```
**Selección de Dirección Estética**:
- Minimalismo (Minimalist)
- Maximalismo (Maximalist)
- Retrofuturismo (Retro-futuristic)
- Lujo/Refinado (Luxury/Refined)
```

Responde: **Minimalismo**

**Deberías ver**: El agente generará especificaciones de diseño (fuentes, colores, espaciado) basadas en la dirección elegida.

#### Paso 3: Genera el Código

```
Basándose en las especificaciones de diseño anteriores, implementa esta página de panel usando React + Tailwind CSS
```

**Deberías ver**:
- Diseño tipográfico y espaciado cuidadoso
- Esquema de color distintivo pero armonioso (no el degradado púrpura común)
- Efectos de animación y transición sutiles

### Puntos de Verificación ✅

- [ ] La página adopta un estilo de diseño único, no genérico "AI slop"
- [ ] La selección de fuentes tiene características distintivas, evitando Inter/Roboto/Arial
- [ ] El esquema de color es cohesivo, con jerarquía visual clara

::: tip Diferencia con Agentes Ordinarios
Los agentes ordinarios pueden escribir código con funcionalidad correcta, pero la interfaz carece de sentido estético. El valor principal del Skill `frontend-ui-ux` es:
- Enfatizar el proceso de diseño (planificación > codificación)
- Proporcionar orientación estética clara
- Advertir contra anti-patrones (diseño genérico, degradado púrpura)
:::

---

## Skill 3: git-master (Experto en Git)

### Descripción General

El Skill `git-master` es un experto en Git que integra tres capacidades profesionales:
1. **Arquitecto de Commits**: Commits atómicos, orden de dependencias, detección de estilo
2. **Cirujano de Rebase**: Reescritura de historial, resolución de conflictos, limpieza de ramas
3. **Arqueólogo de Historial**: Encontrar cuándo/dónde se introdujo un cambio específico

**Principio Central**: Por defecto crear **múltiples commits**, rechazando el comportamiento perezoso de "un commit contiene múltiples archivos".

**Escenarios Aplicables**: Commits de código, búsqueda de historial, gestión de ramas, operaciones de rebase

### Sígueme: Commits Inteligentes de Código

**Escenario**: Has modificado 5 archivos y necesitas hacer commit del código.

#### Paso 1: Activa el Skill git-master (recomienda usar la categoría quick)

```
Usa delegate_task(category='quick', load_skills=['git-master']) para hacer commit de los cambios de código actuales
```

**¿Por qué usar la categoría `quick`?**
- Las operaciones Git no requieren razonamiento complejo
- El modelo `claude-haiku-4-5` es lo suficientemente rápido para manejarlos
- Ahorra costos (Haiku es 10 veces más barato que Opus)

**Deberías ver**: El agente ejecuta análisis paralelo (Fase 0), incluyendo:
- `git status` y `git diff --stat`
- Registro de últimos 30 commits (para detección de estilo)
- Estado de la rama actual

#### Paso 2: Detección de Estilo (Fase 1)

El agente mostrará:

```
RESULTADO DE DETECCIÓN DE ESTILO
======================
Analizado: 30 commits del registro de git

Idioma: ESPAÑOL
  - Commits en español: 28 (93%)
  
Estilo: SEMÁNTICO
  - Semántico (feat:, fix:, etc.): 25 (83%)
  - Plano: 3 (10%)
  
Ejemplos de referencia del repositorio:
  1. "feat: agregar autenticación de usuarios"
  2. "fix: resolver problema de conexión a base de datos"
  3. "refactor: extraer lógica de validación"

Todos los commits seguirán: ESPAÑOL + SEMÁNTICO
```

**Deberías ver**: El agente te dice explícitamente qué estilo de commit e idioma usará.

#### Paso 3: Planificación de Commits Atómicos (Fase 3)

El agente analizará los cambios de archivos y mostrará:

```
PLAN DE COMMITS
===========
Archivos cambiados: 5
Commits mínimos requeridos: ceil(5/3) = 2
Commits planificados: 3
Estado: 3 >= 2 (APROBADO)

COMMIT 1: feat: agregar servicio de autenticación
  - src/services/auth.ts
  - src/types/auth.ts
  Justificación: implementación del servicio + sus definiciones de tipos

COMMIT 2: feat: implementar página de inicio de sesión
  - src/pages/login.tsx
  - src/components/login-form.tsx
  Justificación: página y sus componentes

COMMIT 3: feat: agregar endpoint de API
  - src/api/auth.ts
  - tests/auth.test.ts
  Justificación: endpoint de API + su prueba

Orden de ejecución: Commit 1 -> Commit 2 -> Commit 3
```

**Deberías ver**: El agente divide explícitamente los commits y explica por qué estos archivos deben estar juntos.

#### Paso 4: Ejecución de Commits (Fase 5)

El agente ejecutará automáticamente:
```bash
git add src/services/auth.ts src/types/auth.ts
git commit -m "feat: agregar servicio de autenticación"

git add src/pages/login.tsx src/components/login-form.tsx
git commit -m "feat: implementar página de inicio de sesión"

git add src/api/auth.ts tests/auth.test.ts
git commit -m "feat: agregar endpoint de API"
```

**Deberías ver**:
- 3 commits independientes, cada uno con un mensaje semántico claro
- El directorio de trabajo está limpio (`git status` no muestra archivos sin confirmar)

### Puntos de Verificación ✅

- [ ] El agente realizó detección de estilo y lo informó claramente
- [ ] La cantidad de commits cumple con la regla de "commits mínimos" (número de archivos / 3, redondeado hacia arriba)
- [ ] Cada mensaje de commit coincide con el estilo detectado (semántico, descripción simple, etc.)
- [ ] Los archivos de prueba están en el mismo commit que los archivos de implementación

::: tip Función de Búsqueda de Historial
`git-master` también admite una poderosa búsqueda de historial:

- "cuándo se agregó X" → `git log -S` (búsqueda de pico)
- "quién escribió esta línea" → `git blame`
- "cuándo comenzó el error" → `git bisect`
- "encontrar commits cambiando el patrón X" → `git log -G` (búsqueda con regex)

Ejemplo: `Usa git-master para encontrar en qué commit se agregó la función 'calculate_discount'`
:::

::: warning Anti-patrón: Un Solo Commit Grande
La regla obligatoria de `git-master` es:

| Cantidad de Archivos | Commits Mínimos |
| --- | --- |
| 3+ archivos | 2+ commits |
| 5+ archivos | 3+ commits |
| 10+ archivos | 5+ commits |

Si el agente intenta 1 commit con múltiples archivos, fallará automáticamente y se replanificará.
:::

---

## Skill 4: dev-browser (Navegador para Desarrolladores)

### Descripción General

El Skill `dev-browser` proporciona capacidades de automatización de navegador con estado persistente:
- **Persistencia de Estado de Página**: Mantener el estado de inicio de sesión entre múltiples ejecuciones de scripts
- **ARIA Snapshot**: Descubrimiento automático de elementos de página, devolviendo una estructura de árbol con referencias (`@e1`, `@e2`)
- **Soporte de Modo Dual**:
  - **Modo Standalone**: Inicia un nuevo navegador Chromium
  - **Modo Extension**: Conecta al navegador Chrome existente del usuario

**Escenarios Aplicables**: Se necesitan múltiples operaciones de navegador (mantener estado de sesión), automatización de flujos de trabajo complejos

### Sígueme: Escribe un Script para Operaciones Posterior al Inicio de Sesión

**Escenario**: Necesitas automatizar una serie de operaciones después del inicio de sesión y mantener el estado de sesión.

#### Paso 1: Inicia el Servidor dev-browser

**macOS/Linux**:
```bash
cd skills/dev-browser && ./server.sh &
```

**Windows (PowerShell)**:
```powershell
cd skills/dev-browser
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"
```

**Deberías ver**: La consola muestra el mensaje `Ready`.

#### Paso 2: Escribe el Script de Inicio de Sesión

En OpenCode, escribe:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**Deberías ver**: El navegador abre la página de inicio de sesión y muestra el título de la página y la URL.

#### Paso 3: Agrega Operaciones de Llenado de Formulario

Modifica el script:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

// Obtiene ARIA snapshot
const snapshot = await client.getAISnapshot("login");
console.log(snapshot);

// Selecciona y llena el formulario (según ref en snapshot)
await client.fill("input[name='username']", "user@example.com");
await client.fill("input[name='password']", "password123");
await client.click("button[type='submit']");

await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url(),
  loggedIn: page.url().includes("/dashboard")
});

await client.disconnect();
EOF
```

**Deberías ver**:
- Muestra ARIA Snapshot (muestra elementos de página y referencias)
- El formulario se llena y envía automáticamente
- La página salta al dashboard (verifica que el inicio de sesión fue exitoso)

#### Paso 4: Reutiliza el Estado de Inicio de Sesión

Ahora escribe un segundo script para operar páginas que requieren inicio de sesión:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();

// Reutiliza la página "login" creada anteriormente (la sesión ya está guardada)
const page = await client.page("login");

// Accede directamente a la página que requiere inicio de sesión
await page.goto("https://example.com/settings");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**Deberías ver**: La página salta directamente a la página de configuración, sin necesidad de volver a iniciar sesión (porque el estado de la sesión ya está guardado).

### Puntos de Verificación ✅

- [ ] El servidor dev-browser se inicia exitosamente y muestra `Ready`
- [ ] ARIA Snapshot puede descubrir correctamente los elementos de la página
- [ ] El estado de sesión posterior al inicio de sesión puede reutilizarse entre scripts
- [ ] No es necesario volver a iniciar sesión entre múltiples ejecuciones de scripts

::: tip Diferencia entre playwright y dev-browser

| Característica | playwright | dev-browser |
| --- | --- | --- |
| **Persistencia de Sesión** | ❌ Nueva sesión cada vez | ✅ Guardada entre scripts |
| **ARIA Snapshot** | ❌ Usa API de Playwright | ✅ Referencias generadas automáticamente |
| **Modo Extension** | ❌ No soportado | ✅ Conecta al navegador del usuario |
| **Escenarios Aplicables** | Operación única, prueba | Múltiples operaciones, flujo complejo |
:::

---

## Mejores Prácticas

### 1. Selecciona el Skill Adecuado

Selecciona Skills según el tipo de tarea:

| Tipo de Tarea | Combinación Recomendada |
| --- | --- |
| Commit rápido de Git | `delegate_task(category='quick', load_skills=['git-master'])` |
| Diseño de interfaz UI | `delegate_task(category='visual-engineering', load_skills=['frontend-ui-ux'])` |
| Verificación de navegador | `delegate_task(category='quick', load_skills=['playwright'])` |
| Flujo de trabajo complejo de navegador | `delegate_task(category='quick', load_skills=['dev-browser'])` |

### 2. Combina Múltiples Skills

Puedes cargar múltiples Skills simultáneamente:

```typescript
delegate_task(
  category="quick",
  load_skills=["git-master", "playwright"],
  prompt="Prueba la función de inicio de sesión, luego haz commit del código"
)
```

### 3. Evita Errores Comunes

::: warning Advertencia

- ❌ **Error**: Especificar manualmente el mensaje de commit al usar `git-master`
  - ✅ **Correcto**: Deja que `git-master` detecte automáticamente y genere mensajes de commit que coincidan con el estilo del proyecto

- ❌ **Error**: Pedir "lo normal está bien" al usar `frontend-ui-ux`
  - ✅ **Correcto**: Deja que el agente dé rienda suelta a sus capacidades de diseñador, creando diseños únicos

- ❌ **Error**: Usar anotaciones de tipo TypeScript en scripts `dev-browser`
  - ✅ **Correcto**: Usa JavaScript puro en `page.evaluate()` (el navegador no reconoce sintaxis TS)
:::

---

## Resumen de la Lección

Esta lección presentó 4 Skills incorporados:

| Skill | Valor Principal | Escenarios Típicos |
| --- | --- | --- |
| **playwright** | Automatización completa de navegador | Pruebas UI, capturas de pantalla, web scraping |
| **frontend-ui-ux** | Perspectiva de diseñador, estética primero | Diseño de componentes UI, embellecimiento de interfaces |
| **git-master** | Operaciones Git automatizadas, commits atómicos | Commits de código, búsqueda de historial |
| **dev-browser** | Sesión persistente, flujos de trabajo complejos | Múltiples operaciones de navegador |

**Puntos Clave**:
1. **Skill = Conocimiento Profesional + Herramientas**: Inyecta al agente mejores prácticas de dominios específicos
2. **Uso Combinado**: `delegate_task(category=..., load_skills=[...])` para lograr coincidencia precisa
3. **Optimización de Costos**: Usa la categoría `quick` para tareas simples, evita usar modelos costosos
4. **Advertencia de Anti-patrón**: Cada Skill tiene guía clara de "qué no hacer"

---

## Avance de la Próxima Lección

> En la próxima lección aprenderemos **[Lifecycle Hooks](../lifecycle-hooks/)**.
>
> Aprenderás:
> - El propósito y orden de ejecución de los 32 Lifecycle Hooks
> - Cómo automatizar la inyección de contexto y la recuperación de errores
> - Métodos de configuración de hooks comunes (todo-continuation-enforcer, keyword-detector, etc.)

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Tiempo de actualización: 2026-01-26

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Definición del Skill playwright | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 4-16 |
| Función createBuiltinSkills | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 1723-1729 |
| Definición del tipo BuiltinSkill | [`src/features/builtin-skills/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/types.ts) | 3-16 |
| Lógica de carga de Skills incorporados | [`src/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/index.ts) | 51, 311-319 |
| Configuración del motor de navegador | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | - |

**Configuraciones Clave**:
- `browser_automation_engine.provider`: Motor de automatización de navegador (por defecto `playwright`, opcional `agent-browser`)
- `disabled_skills`: Lista de Skills deshabilitados

**Funciones Clave**:
- `createBuiltinSkills(options)`: Devuelve el array de Skills correspondiente según la configuración del motor de navegador

</details>
