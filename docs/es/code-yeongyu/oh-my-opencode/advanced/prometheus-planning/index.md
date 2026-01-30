---
title: "Planificación Prometheus: Recolección de Requisitos Basada en Entrevistas | oh-my-opencode"
sidebarTitle: "Generar Planes de Trabajo de Alta Calidad"
subtitle: "Planificación Prometheus: Recolección de Requisitos Basada en Entrevistas"
description: "Aprende el sistema de planificación basado en entrevistas de Prometheus, que genera planes de trabajo de alta calidad mediante la recolección estructurada de requisitos, consultas con Metis y validación por Momus, logrando la perfecta separación entre planificación y ejecución."
tags:
  - "planning"
  - "prometheus"
  - "interview"
prerequisite:
  - "start-sisyphus-orchestrator"
  - "advanced-ai-agents-overview"
order: 70
---

# Planificación Prometheus: Recolección de Requisitos Basada en Entrevistas

## Lo que Aprenderás

- Iniciar sesiones de planificación Prometheus para clarificar requisitos de proyecto mediante el modo de entrevista
- Entender el principio fundamental de Prometheus: "Planificar, no Implementar"
- Colaborar con Metis y Momus para generar planes de trabajo de alta calidad sin omisiones
- Usar el comando `/start-work` para delegar la ejecución del plan a Atlas

## Tu Situación Actual

Imagina que le das una tarea compleja a una IA: "Ayúdame a refactorizar el sistema de autenticación".

**5 minutos después**, la IA comienza a escribir código. Estás contento, crees que ahorraste tiempo.

**30 minutos después**, te das cuenta:
- La IA no te preguntó qué biblioteca de autenticación usar (¿JWT? ¿NextAuth? ¿Session?)
- La IA asumió muchos requisitos (por ejemplo, "debe soportar OAuth", cuando en realidad no lo necesitas)
- El código está a medio escribir, la dirección es incorrecta, todo debe rehacerse
- Durante las pruebas descubres que la lógica central no es compatible con el sistema existente

Este es el típico problema de "mezclar planificación y ejecución": la IA comienza a trabajar antes de que los requisitos estén claros, lo que causa mucha retrabajo.

## Cuándo Usar Prometheus

::: tip Momento de Uso
**Escenarios adecuados para Prometheus**:
- Desarrollo de funcionalidades complejas (como "agregar un sistema de autenticación de usuarios")
- Refactorizaciones a gran escala (como "refactorizar toda la capa de acceso a datos")
- Diseño de arquitectura (como "diseñar una arquitectura de microservicios")
- Tareas que requieren garantía de calidad estricta

**Escenarios para delegar directamente a Sisyphus**:
- Corrección simple de errores (como "corregir un error de ortografía en el botón de inicio de sesión")
- Funcionalidades pequeñas y claras (como "agregar un formulario con 3 campos de entrada")
:::

## 🎒 Preparación Antes de Comenzar

Asegúrate de haber completado la siguiente configuración:

- [ ] Prometheus Agent está habilitado (habilitado por defecto)
- [ ] Se ha configurado al menos un AI Provider (Anthropic, OpenAI, etc.)
- [ ] Comprendes los conceptos básicos de agentes (has completado "[Equipo de Agentes de IA: Introducción a 10 Expertos](../ai-agents-overview/)")

**Verificar que Prometheus está disponible**:

```bash
# Escribe en el cuadro de chat de OpenCode
@prometheus

# Deberías ver el mensaje de Prometheus:
# "Hola, soy Prometheus - Asesor de Planificación Estratégica..."
```

## Idea Central

### Restricciones de Identidad Central de Prometheus

¿Cuál es la característica más importante de Prometheus? **Nunca escribe código**.

| Función | Prometheus | Sisyphus | Atlas |
|---|---|---|---|
| Recolección de Requisitos | ✅ | ❌ | ❌ |
| Generación de Plan de Trabajo | ✅ | ❌ | ❌ |
| Implementación de Código | ❌ | ✅ | ✅ (delegado) |
| Ejecución de Tareas | ❌ | ✅ | ✅ (delegado) |

**¿Por qué es esto importante?**

- **Planificador ≠ Ejecutor**: Al igual que un Product Manager no escribe código, el trabajo de Prometheus es "cómo hacerlo", no "hacerlo"
- **Prevenir suposiciones**: Si Prometheus pudiera escribir código directamente, podría "adivinar y hacer" cuando los requisitos no están claros
- **Pensamiento forzoso**: Al estar prohibido escribir código, Prometheus debe preguntar todos los detalles con claridad

### Flujo de Trabajo de Tres Fases

```mermaid
flowchart LR
    A[Usuario ingresa requisitos] --> B[Fase 1: Modo Entrevista]
    B -->|¿Requisitos claros?| C[Fase 2: Generación de Plan]
    C --> D[Consulta Metis]
    D -->|¿Alta precisión requerida?| E[Ciclo de Validación Momus]
    E -->|Plan completado| F[Generar .sisyphus/plans/*.md]
    C -->|No requiere alta precisión| F
    F --> G[/start-work Ejecución]
```

**Responsabilidades de cada fase**:

- **Fase 1 - Modo Entrevista**: Recolectar requisitos, investigar el código base, actualizar continuamente el borrador
- **Fase 2 - Generación de Plan**: Consultar a Metis, generar plan completo, presentar resumen
- **Fase 3 - Ejecución**: Entregar a Atlas para ejecución mediante `/start-work`

## Sígueme

### Paso 1: Iniciar Sesión de Planificación Prometheus

**Por qué**
Activar Prometheus a través de palabras clave o comandos, entrando en el modo de entrevista.

**Operación**

Escribe en el cuadro de chat de OpenCode:

```
@prometheus Ayúdame a planificar un sistema de autenticación de usuarios
```

**Lo que deberías ver**:
- Prometheus confirma que ha entrado en el modo de entrevista
- Hace la primera pregunta (por ejemplo, "¿Qué stack tecnológico usa tu aplicación?")
- Crea el archivo borrador `.sisyphus/drafts/user-auth.md`

::: info Característica Clave: Archivos Borrador
Prometheus **actualiza continuamente** los archivos en `.sisyphus/drafts/`. Este es su "memoria externa":
- Registra las decisiones de cada discusión
- Guarda los patrones de código descubiertos en la investigación
- Marca límites claros (IN/OUT)

Puedes revisar el borrador en cualquier momento para verificar si Prometheus entiende correctamente.
:::

### Paso 2: Responder Preguntas para que Prometheus Recopile Contexto

**Por qué**
Prometheus necesita "entender" tu proyecto para generar un plan ejecutable. No adivina, sino que obtiene fundamentos investigando el código base y estudiando mejores prácticas.

**Operación**

Responde las preguntas de Prometheus, por ejemplo:

```
Entrada del usuario:
Mi aplicación es Next.js 14, App Router, actualmente sin autenticación.
Quiero soportar inicio de sesión con email/contraseña y GitHub OAuth.
```

**Lo que hará Prometheus**:

- Usar el agente `explore` para analizar la estructura existente del código
- Usar el agente `librarian` para buscar mejores prácticas de autenticación
- Actualizar las secciones "Requirements" y "Technical Decisions" del archivo borrador

**Lo que deberías ver**:

```
He iniciado el agente de exploración para analizar la estructura de tu proyecto...

1. explore: Buscar patrones de sesión existentes
2. librarian: Buscar mejores prácticas de NextAuth

Esperando resultados para continuar con las preguntas.
```

### Paso 3: Revisar el Archivo Borrador (Opcional)

**Por qué**
El borrador es la "memoria externa" de Prometheus, puedes verificar en cualquier momento si entiende correctamente.

**Operación**

```bash
# Ver el contenido del borrador en la terminal
cat .sisyphus/drafts/user-auth.md
```

**Deberías ver** contenido similar:

```markdown
# Borrador: user-auth

## Requirements (confirmado)
- Stack: Next.js 14, App Router
- Métodos de autenticación: Email/contraseña + GitHub OAuth
- Estado actual: Sin implementación de autenticación

## Technical Decisions
- Sin decisiones

## Research Findings
- Agente de exploración en ejecución...
```

### Paso 4: Continuar Respondiendo hasta que los Requisitos Estén Claros

**Por qué**
Prometheus tiene un "Clearance Checklist", solo después de marcar todo puede transicionar automáticamente a la generación del plan.

**Criterios de Evaluación de Prometheus**:

```
CLEARANCE CHECKLIST (TODOS deben ser SÍ para transición automática):
□ ¿El objetivo central está claro?
□ ¿Los límites de alcance están definidos (IN/OUT)?
□ ¿No hay ambigüedades críticas pendientes?
□ ¿El plan técnico está determinado?
□ ¿La estrategia de testing está confirmada (TDD/manual)?
□ ¿No hay bloqueos?
```

**Operación**

Continúa respondiendo las preguntas de Prometheus hasta que diga:

```
Todos los requisitos están claros. Consultando con Metis y generando el plan...
```

**Lo que deberías ver**:
- Prometheus invoca al agente Metis
- Metis analiza posibles problemas omitidos
- Prometheus ajusta su comprensión basándose en el feedback de Metis

### Paso 5: Revisar el Plan Generado

**Por qué**
El archivo de plan es la salida final de Prometheus, contiene todas las tareas, dependencias y criterios de aceptación.

**Operación**

```bash
# Ver el plan generado
cat .sisyphus/plans/user-auth.md
```

**Deberías ver** la estructura completa:

```markdown
# User Authentication System

## Context
[Descripción original del requisito]
[Resumen de la entrevista]
[Resultados del análisis de Metis]

## Work Objectives
- Objetivo central: Implementar login con email/contraseña y GitHub OAuth
- Entregables específicos: Página de login, endpoints API, gestión de sesiones
- Definición de completado: El usuario puede iniciar sesión y acceder a rutas protegidas

## Verification Strategy
- Infraestructura existe: YES
- El usuario quiere tests: TDD
- Framework: vitest

## TODOs
- [ ] 1. Instalar NextAuth.js y configurar
  - References:
    - https://next-auth.js.org/getting-started/installation
  - Acceptance Criteria:
    - [ ] npm run test → PASS (1 test)

- [ ] 2. Crear ruta API [...nextauth]/route.ts
  - References:
    - src/lib/session.ts:10-45 - Patrón de sesión existente
  - Acceptance Criteria:
    - [ ] curl http://localhost:3000/api/auth/... → 200

- [ ] 3. Implementar UI de página de login
  - References:
    - src/app/login/page.tsx - Estructura de página de login existente
  - Acceptance Criteria:
    - [ ] Verificación Playwright: formulario de login visible
    - [ ] Captura de pantalla guardada en .sisyphus/evidence/

...
```

### Paso 6: Seleccionar Método de Ejecución

**Por qué**
Prometheus te dará dos opciones: inicio rápido o revisión de alta precisión.

**Presentación de Prometheus** (usando la herramienta Question):

```
## Plan Generado: user-auth

**Decisiones Clave Tomadas:**
- Usar NextAuth.js (buena integración con Next.js App Router)
- Proveedor GitHub OAuth + email/contraseña

**Alcance:**
- IN: Funcionalidad de login, gestión de sesiones, protección de rutas
- OUT: Funcionalidad de registro, restablecimiento de contraseña, edición de perfil de usuario

**Guardrails Aplicados:**
- Debe seguir el patrón de sesión existente
- No modificar la lógica de negocio central

Plan guardado en: `.sisyphus/plans/user-auth.md`

---

**Siguiente Paso**

¿Cómo continuar?

1. **Start Work**: Ejecutar /start-work. El plan parece sólido.
2. **High Accuracy Review**: Dejar que Momus verifique estrictamente cada detalle. Aumenta los ciclos de revisión pero garantiza la precisión.
```

**Operación**

Selecciona una opción (haz clic en el botón o escribe el número de opción en OpenCode).

**Si seleccionas "Start Work"**:

- Prometheus elimina el archivo borrador
- Te indica ejecutar `/start-work`

**Si seleccionas "High Accuracy Review"**:

- Prometheus entra en el ciclo de Momus
- Continúa corrigiendo el feedback hasta que Momus diga "OKAY"
- Luego te indica ejecutar `/start-work`

### Paso 7: Ejecutar el Plan

**Por qué**
El plan es la salida de Prometheus, la ejecución es responsabilidad de Atlas.

**Operación**

```bash
# Escribe en OpenCode
/start-work
```

**Lo que deberías ver**:
- Atlas lee `.sisyphus/plans/user-auth.md`
- Crea el archivo de estado `boulder.json`
- Ejecuta cada TODO en orden
- Delega tareas a agentes especializados (por ejemplo, trabajos de UI delegados a Frontend)

**Punto de Verificación ✅**

- El archivo `boulder.json` ha sido creado
- Atlas ha comenzado a ejecutar la tarea 1
- Después de completar cada tarea, el estado se actualiza

## Advertencias de Errores Comunes

### Error 1: Decir Solo la Mitad de los Requisitos y Apresurarse a Pedir el Plan

**Problema**:
```
Usuario: @prometheus haz un sistema de autenticación de usuarios
Usuario: No me preguntes tanto, solo genera el plan
```

**Consecuencia**: El plan está lleno de suposiciones, necesita modificarse repetidamente durante la ejecución.

**Forma Correcta**:
```
Usuario: @prometheus haz un sistema de autenticación de usuarios
Prometheus: ¿Qué stack tecnológico usa tu aplicación? ¿Actualmente tienes autenticación?
Usuario: Next.js 14, App Router, sin autenticación
Prometheus: ¿Qué métodos de inicio de sesión necesitas soportar?
Usuario: Email/contraseña + GitHub OAuth
...
(Continúa respondiendo hasta que Prometheus haga la transición automática)
```

::: tip Recuerda Este Principio
**Tiempo de Planificación ≠ Tiempo Perdido**
- Gastar 5 minutos clarificando requisitos puede ahorrar 2 horas de retrabajo
- El modo de entrevista de Prometheus está "ahorrándote dinero" a tu yo futuro
:::

### Error 2: No Revisar el Archivo Borrador

**Problema**: Prometheus registra muchas decisiones y límites en el borrador, tú no lo revisas y le pides generar el plan directamente.

**Consecuencia**:
- El plan incluye comprensiones erróneas
- Durante la ejecución descubres "¿Cómo es que no pedí esto?"

**Forma Correcta**:
```
1. Después de iniciar la planificación, monitorea constantemente los archivos en .sisyphus/drafts/
2. Si descubres un malentendido, corrígelo inmediatamente: "No, no es OAuth lo que quiero, es JWT simple"
3. Después de corregir, continúa
```

### Error 3: Generar el Plan en Múltiples Partes

**Problema**:
```
Usuario: Este proyecto es muy grande, planifiquemos la primera fase primero
```

**Consecuencia**:
- El contexto entre la primera y segunda fase se rompe
- Las decisiones de arquitectura son inconsistentes
- Los requisitos se pierden en múltiples sesiones

**Forma Correcta**:
```
✅ Principio de Plan Único: Sin importar cuán grande sea la tarea, todos los TODOs están en un solo archivo .md en .sisyphus/plans/{name}.md
```

**¿Por qué?**
- Prometheus y Atlas pueden manejar planes grandes
- Un solo plan garantiza consistencia arquitectónica
- Evita la fragmentación del contexto

### Error 4: Olvidar el Papel de Metis

**Problema**:
```
Usuario: Ya dije los requisitos, genera el plan rápido
Prometheus: (Genera directamente, saltándose a Metis)
```

**Consecuencia**:
- El plan puede omitir límites clave
- No hay un "Must NOT Have" que defina claramente el alcance excluido
- Aparece AI slop (sobre-ingeniería) durante la ejecución

**Forma Correcta**:
```
✅ La consulta con Metis es obligatoria, no necesitas apresurarte
```

**¿Qué hará Metis?**
- Identificar preguntas que Prometheus debería hacer pero no hizo
- Plantear límites que necesitan clarificación
- Prevenir la sobre-ingeniería de la IA

### Error 5: Ignorar la Decisión de Estrategia de Testing

**Problema**: Prometheus pregunta "¿Necesitas tests?", tú respondes "me da igual" o lo omites.

**Consecuencia**:
- Si hay infraestructura de testing pero no se aprovecha TDD, se pierde una oportunidad
- Si no hay tests, y tampoco hay pasos detallados de verificación manual, la tasa de fallos en la ejecución es alta

**Forma Correcta**:
```
Prometheus: Veo que tienes el framework de testing vitest. ¿El trabajo debe incluir tests?
Usuario: SÍ (TDD)
```

**Impacto**:
- Prometheus estructurará cada tarea como: RED → GREEN → REFACTOR
- Los Criterios de Aceptación de TODO incluirán explícitamente comandos de testing
- Atlas ejecutará siguiendo el flujo de trabajo TDD

## Resumen de la Lección

**Valor Central de Prometheus**:
- **Separar planificación de ejecución**: A través de la restricción forzosa de "no escribir código", asegura que los requisitos estén claros
- **Modo de entrevista**: Preguntar continuamente, investigar el código base, actualizar el borrador
- **Garantía de calidad**: Consulta con Metis, validación por Momus, principio de plan único

**Flujo de Trabajo Típico**:
1. Escribe `@prometheus [requisito]` para iniciar la planificación
2. Responde preguntas, revisa el borrador en `.sisyphus/drafts/`
3. Espera la transición automática de Prometheus (Clearance Checklist completamente marcado)
4. Revisa el `.sisyphus/plans/{name}.md` generado
5. Selecciona "Start Work" o "High Accuracy Review"
6. Ejecuta `/start-work` para delegar la ejecución a Atlas

**Mejores Prácticas**:
- Tómate tiempo para entender los requisitos, no te apresures a pedir el plan
- Revisa continuamente el archivo borrador, corrige malentendidos a tiempo
- Sigue el principio de plan único, no dividas tareas grandes
- Clarifica la estrategia de testing, afecta la estructura completa del plan

## Próxima Lección

> En la próxima lección aprenderemos **[Tareas en Segundo Plano: Trabajar como un Equipo](../background-tasks/)**.
>
> Aprenderás:
> - Cómo hacer que múltiples agentes trabajen en paralelo para mejorar significativamente la eficiencia
> - Configurar límites de concurrencia para evitar rate limits de API
> - Gestionar tareas en segundo plano, obtener resultados y cancelar operaciones
> - Coordinar múltiples agentes expertos como un "equipo real"

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-26

| Función | Ruta del Archivo | Número de Línea |
|---|---|---|
| Prompt del Sistema Prometheus | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 19-1184 |
| Configuración de Permisos Prometheus | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1187-1197 |
| Agente Metis | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | - |
| Agente Momus | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | - |
| Documento de Guía de Orquestación | [`docs/orchestration-guide.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/orchestration-guide.md) | 67-90 |

**Constantes Principales**:
- `PROMETHEUS_SYSTEM_PROMPT`: Prompt del sistema completo, define la identidad, flujo de trabajo y restricciones de Prometheus

**Funciones/Herramientas Clave**:
- `PROMETHEUS_PERMISSION`: Define los permisos de herramientas de Prometheus (solo permite edición de archivos .md)

**Reglas de Negocio**:
- Modo predeterminado de Prometheus: INTERVIEW MODE (Modo Entrevista)
- Condición de transición automática: Clearance Checklist completamente SÍ
- Consulta Metis: Obligatoria, ejecutada antes de generar el plan
- Ciclo Momus: Modo de alta precisión opcional, ciclo hasta "OKAY"
- Principio de Plan Único: Sin importar el tamaño de la tarea, todos los TODOs en un solo archivo `.md`
- Gestión de Borradores: Actualizar continuamente `.sisyphus/drafts/{name}.md`, eliminar después de completar el plan
</details>
