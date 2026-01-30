---
title: "Estructura de directorios explicada: Estructura completa del proyecto Factory y usos de archivos | Tutorial de AI App Factory"
sidebarTitle: "Estructura de directorios"
subtitle: "Estructura de directorios explicada: Guía completa del proyecto Factory"
description: "Aprende la estructura completa de directorios y los usos de archivos del proyecto AI App Factory. Este tutorial explica en detalle los roles de directorios principales como agents, skills, policies, artifacts y las funciones de los archivos, ayudándote a comprender profundamente los principios de funcionamiento del proyecto Factory, localizar y modificar rápidamente archivos de configuración, así como depurar problemas de la tubería."
tags:
  - "apéndice"
  - "estructura de directorios"
  - "arquitectura del proyecto"
prerequisite:
  - "start-init-project"
order: 220
---

# Estructura de directorios explicada: Guía completa del proyecto Factory

## Lo que aprenderás

- ✅ Entender la estructura completa de directorios del proyecto Factory
- ✅ Conocer el propósito de cada directorio y archivo
- ✅ Comprender el método de almacenamiento de los artefactos
- ✅ Dominar el rol de los archivos de configuración y cómo modificarlos

## Enfoque central

El proyecto Factory adopta una estructura clara de directorios en capas, separando configuración, código, artefactos y documentación. Comprender estas estructuras de directorios te ayudará a localizar rápidamente archivos, modificar configuraciones y depurar problemas.

El proyecto Factory tiene dos formas:

**Forma 1: Repositorio de código fuente** (el que clonas de GitHub)
**Forma 2: Proyecto inicializado** (generado por `factory init`)

Este tutorial se centra en explicar la **Forma 2**—la estructura del proyecto Factory inicializado, ya que es el directorio en el que trabajarás diariamente.

---

## Estructura completa del proyecto Factory

```
my-app/                          # Directorio raíz de tu proyecto Factory
├── .factory/                    # Directorio de configuración central de Factory (no modificar manualmente)
│   ├── pipeline.yaml             # Definición de tubería (7 etapas)
│   ├── config.yaml               # Archivo de configuración del proyecto (stack tecnológico, restricciones MVP, etc.)
│   ├── state.json                # Estado de ejecución de la tubería (etapa actual, etapas completadas)
│   ├── agents/                   # Definiciones de Agent (descripción de tareas de los asistentes de IA)
│   ├── skills/                   # Módulos de habilidades (conocimiento reutilizable)
│   ├── policies/                 # Documentos de políticas (permisos, manejo de fallos, estándares de código)
│   └── templates/                # Plantillas de configuración (CI/CD, Git Hooks)
├── .claude/                      # Directorio de configuración de Claude Code (generado automáticamente)
│   └── settings.local.json       # Configuración de permisos de Claude Code
├── input/                        # Directorio de entrada del usuario
│   └── idea.md                   # Idea de producto estructurada (generada por Bootstrap)
└── artifacts/                    # Directorio de artefactos de la tubería (salidas de las 7 etapas)
    ├── prd/                      # Artefactos PRD
    │   └── prd.md                # Documento de requisitos del producto
    ├── ui/                       # Artefactos UI
    │   ├── ui.schema.yaml        # Definición de estructura UI
    │   └── preview.web/          # Prototipo HTML previsualizable
    │       └── index.html
    ├── tech/                     # Artefactos Tech
    │   └── tech.md               # Documento de arquitectura técnica
    ├── backend/                  # Código backend (Express + Prisma)
    │   ├── src/                  # Código fuente
    │   ├── prisma/               # Configuración de base de datos
    │   │   ├── schema.prisma     # Modelo de datos Prisma
    │   │   └── seed.ts           # Datos semilla
    │   ├── tests/                # Pruebas
    │   ├── docs/                 # Documentación API
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    ├── client/                   # Código frontend (React Native)
    │   ├── src/                  # Código fuente
    │   ├── __tests__/            # Pruebas
    │   ├── app.json
    │   ├── package.json
    │   └── README.md
    ├── validation/               # Artefactos de validación
    │   └── report.md             # Informe de validación de calidad de código
    ├── preview/                  # Artefactos Preview
    │   ├── README.md             # Guía de implementación y ejecución
    │   └── GETTING_STARTED.md    # Guía de inicio rápido
    ├── _failed/                  # Archivo de artefactos fallidos
    │   └── <stage-id>/           # Artefactos de etapas fallidas
    └── _untrusted/               # Aislamiento de artefactos con exceso de privilegios
        └── <stage-id>/           # Archivos escritos por Agent no autorizados
```

---

## Directorio .factory/ explicado

El directorio `.factory/` es el núcleo del proyecto Factory, contiene definiciones de tubería, configuraciones de Agent y documentos de políticas. Este directorio se crea automáticamente mediante el comando `factory init` y generalmente no requiere modificación manual.

### pipeline.yaml - Definición de tubería

**Propósito**: Define el orden de ejecución de las 7 etapas, entradas, salidas y condiciones de salida.

**Contenido clave**:
- 7 etapas: bootstrap, prd, ui, tech, code, validation, preview
- Agent, archivos de entrada, archivos de salida de cada etapa
- Condiciones de salida (exit_criteria): estándares de verificación de finalización de etapa

**Ejemplo**:
```yaml
stages:
  - id: bootstrap
    description: Inicializar idea del proyecto
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs:
      - input/idea.md
    exit_criteria:
      - idea.md existe
      - idea.md describe una idea de producto coherente
```

**Cuándo modificar**: Generalmente no es necesario modificar, a menos que quieras personalizar el flujo de la tubería.

### config.yaml - Archivo de configuración del proyecto

**Propósito**: Configura el stack tecnológico, restricciones MVP, preferencias de UI y otras configuraciones globales.

**Elementos de configuración principales**:
- `preferences`: Preferencias de stack tecnológico (lenguaje backend, base de datos, framework frontend, etc.)
- `mvp_constraints`: Control de alcance MVP (número máximo de páginas, número máximo de modelos, etc.)
- `ui_preferences`: Preferencias de diseño UI (dirección estética, esquema de colores)
- `pipeline`: Comportamiento de la tubería (modo punto de control, manejo de fallos)
- `advanced`: Opciones avanzadas (tiempo de espera de Agent, control de concurrencia)

**Ejemplo**:
```yaml
preferences:
  backend:
    language: typescript
    framework: express
    database: sqlite
  mvp_constraints:
    max_pages: 3
    enable_auth: false
```

**Cuándo modificar**: Cuando quieras ajustar el stack tecnológico o cambiar el alcance del MVP.

### state.json - Estado de la tubería

**Propósito**: Registra el estado de ejecución de la tubería, soporta reanudación desde puntos de control.

**Contenido clave**:
- `status`: Estado actual (idle/running/waiting_for_confirmation/paused/failed)
- `current_stage`: Etapa actual de ejecución
- `completed_stages`: Lista de etapas completadas
- `last_updated`: Hora de última actualización

**Cuándo modificar**: Se actualiza automáticamente, no modificar manualmente.

### agents/ - Directorio de definiciones de Agent

**Propósito**: Define las responsabilidades, entradas, salidas y restricciones de ejecución de cada Agent.

**Lista de archivos**:
| Archivo | Descripción |
|---------|-------------|
| `orchestrator.checkpoint.md` | Definición central del orquestador (coordinación de tubería) |
| `orchestrator-implementation.md` | Guía de implementación del orquestador (referencia de desarrollo) |
| `bootstrap.agent.md` | Bootstrap Agent (estructura idea de producto) |
| `prd.agent.md` | PRD Agent (genera documento de requisitos) |
| `ui.agent.md` | UI Agent (diseña prototipo UI) |
| `tech.agent.md` | Tech Agent (diseña arquitectura técnica) |
| `code.agent.md` | Code Agent (genera código) |
| `validation.agent.md` | Validation Agent (valida calidad de código) |
| `preview.agent.md` | Preview Agent (genera guía de implementación) |

**Cuándo modificar**: Generalmente no es necesario modificar, a menos que quieras personalizar el comportamiento de un Agent específico.

### skills/ - Directorio de módulos de habilidades

**Propósito**: Módulos de conocimiento reutilizables, cada Agent carga sus archivos Skill correspondientes.

**Estructura de directorios**:
```
skills/
├── bootstrap/skill.md         # Estructuración de idea de producto
├── prd/skill.md               # Generación de PRD
├── ui/skill.md                # Diseño UI
├── tech/skill.md              # Arquitectura técnica + migraciones de base de datos
├── code/skill.md              # Generación de código + pruebas + registros
│   └── references/            # Plantillas de referencia de generación de código
│       ├── backend-template.md   # Plantilla backend lista para producción
│       └── frontend-template.md  # Plantilla frontend lista para producción
└── preview/skill.md           # Configuración de implementación + guía de inicio rápido
```

**Cuándo modificar**: Generalmente no es necesario modificar, a menos que quieras extender las capacidades de un Skill específico.

### policies/ - Directorio de documentos de políticas

**Propósito**: Define permisos, manejo de fallos, estándares de código y otras políticas.

**Lista de archivos**:
| Archivo | Descripción |
|---------|-------------|
| `capability.matrix.md` | Matriz de límites de capacidades (permisos de lectura/escritura de Agent) |
| `failure.policy.md` | Política de manejo de fallos (reintento, reversión, intervención humana) |
| `context-isolation.md` | Política de aislamiento de contexto (ahorrar tokens) |
| `error-codes.md` | Normas de códigos de error unificados |
| `code-standards.md` | Estándares de código (estilo de codificación, estructura de archivos) |
| `pr-template.md` | Plantilla de PR y lista de revisión de código |
| `changelog.md` | Normas de generación de changelog |

**Cuándo modificar**: Generalmente no es necesario modificar, a menos que quieras ajustar políticas o estándares.

### templates/ - Directorio de plantillas de configuración

**Propósito**: Plantillas de configuración como CI/CD, Git Hooks, etc.

**Lista de archivos**:
| Archivo | Descripción |
|---------|-------------|
| `cicd-github-actions.md` | Configuración CI/CD (GitHub Actions) |
| `git-hooks-husky.md` | Configuración de Git Hooks (Husky) |

**Cuándo modificar**: Generalmente no es necesario modificar, a menos que quieras personalizar el flujo de CI/CD.

---

## Directorio .claude/ explicado

### settings.local.json - Configuración de permisos de Claude Code

**Propósito**: Define los directorios y permisos de operación a los que Claude Code puede acceder.

**Cuándo se genera**: Se genera automáticamente durante `factory init`.

**Cuándo modificar**: Generalmente no es necesario modificar, a menos que quieras ajustar el alcance de permisos.

---

## Directorio input/ explicado

### idea.md - Idea de producto estructurada

**Propósito**: Almacena la idea de producto estructurada, generada por Bootstrap Agent.

**Momento de generación**: Después de completar la etapa Bootstrap.

**Estructura de contenido**:
- Definición del problema (Problem)
- Usuarios objetivo (Target Users)
- Valor central (Core Value)
- Suposiciones (Assumptions)
- Fuera del alcance (Out of Scope)

**Cuándo modificar**: Si quieres ajustar la dirección del producto, puedes editar manualmente y luego volver a ejecutar Bootstrap o etapas posteriores.

---

## Directorio artifacts/ explicado

El directorio `artifacts/` es donde se almacenan los artefactos de la tubería, cada etapa escribirá sus artefactos en el subdirectorio correspondiente.

### prd/ - Directorio de artefactos PRD

**Archivos de artefactos**:
- `prd.md`: Documento de requisitos del producto

**Contenido**:
- Historias de usuario (User Stories)
- Lista de características (Features)
- Requisitos no funcionales (Non-functional Requirements)
- Fuera del alcance (Out of Scope)

**Momento de generación**: Después de completar la etapa PRD.

### ui/ - Directorio de artefactos UI

**Archivos de artefactos**:
- `ui.schema.yaml`: Definición de estructura UI (páginas, componentes, interacciones)
- `preview.web/index.html`: Prototipo HTML previsualizable

**Contenido**:
- Estructura de páginas (número de páginas, diseño)
- Definiciones de componentes (botones, formularios, listas, etc.)
- Flujos de interacción (navegación, transiciones)
- Sistema de diseño (paleta de colores, tipografía, espaciado)

**Momento de generación**: Después de completar la etapa UI.

**Método de vista previa**: Abre `preview.web/index.html` en el navegador.

### tech/ - Directorio de artefactos Tech

**Archivos de artefactos**:
- `tech.md`: Documento de arquitectura técnica

**Contenido**:
- Selección de stack tecnológico (backend, frontend, base de datos)
- Diseño de modelo de datos
- Diseño de endpoints API
- Estrategias de seguridad
- Recomendaciones de optimización de rendimiento

**Momento de generación**: Después de completar la etapa Tech.

### backend/ - Directorio de código backend

**Archivos de artefactos**:
```
backend/
├── src/                      # Código fuente
│   ├── routes/               # Rutas API
│   ├── services/             # Lógica de negocio
│   ├── middleware/           # Middleware
│   └── utils/               # Funciones de utilidad
├── prisma/                   # Configuración Prisma
│   ├── schema.prisma         # Modelo de datos Prisma
│   └── seed.ts              # Datos semilla
├── tests/                    # Pruebas
│   ├── unit/                 # Pruebas unitarias
│   └── integration/          # Pruebas de integración
├── docs/                     # Documentación
│   └── api-spec.yaml        # Especificación API (Swagger)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

**Contenido**:
- Servidor backend Express
- ORM Prisma (SQLite/PostgreSQL)
- Framework de pruebas Vitest
- Documentación API Swagger

**Momento de generación**: Después de completar la etapa Code.

### client/ - Directorio de código frontend

**Archivos de artefactos**:
```
client/
├── src/                      # Código fuente
│   ├── screens/              # Pantallas
│   ├── components/           # Componentes
│   ├── navigation/           # Configuración de navegación
│   ├── services/             # Servicios API
│   └── utils/               # Funciones de utilidad
├── __tests__/               # Pruebas
│   └── components/          # Pruebas de componentes
├── assets/                  # Recursos estáticos
├── app.json                 # Configuración Expo
├── package.json
├── tsconfig.json
└── README.md
```

**Contenido**:
- React Native + Expo
- React Navigation
- Jest + React Testing Library
- TypeScript

**Momento de generación**: Después de completar la etapa Code.

### validation/ - Directorio de artefactos de validación

**Archivos de artefactos**:
- `report.md`: Informe de validación de calidad de código

**Contenido**:
- Verificación de instalación de dependencias
- Verificación de tipos TypeScript
- Verificación de esquema Prisma
- Cobertura de pruebas

**Momento de generación**: Después de completar la etapa Validation.

### preview/ - Directorio de artefactos Preview

**Archivos de artefactos**:
- `README.md`: Guía de implementación y ejecución
- `GETTING_STARTED.md`: Guía de inicio rápido

**Contenido**:
- Pasos de ejecución local
- Configuración de implementación Docker
- Tubería CI/CD
- Direcciones de acceso y demostración

**Momento de generación**: Después de completar la etapa Preview.

### _failed/ - Archivo de artefactos fallidos

**Propósito**: Almacena artefactos de etapas fallidas para facilitar la depuración.

**Estructura de directorios**:
```
_failed/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**Cuándo se genera**: Después de que una etapa falle dos veces consecutivas.

### _untrusted/ - Aislamiento de artefactos con exceso de privilegios

**Propósito**: Almacena archivos escritos por Agent con exceso de privilegios, evitando contaminar los artefactos principales.

**Estructura de directorios**:
```
_untrusted/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**Cuándo se genera**: Cuando un Agent intenta escribir en un directorio no autorizado.

---

## Preguntas frecuentes

### 1. ¿Puedo modificar manualmente los archivos en .factory/?

::: warning Modificar con precaución
**No se recomienda** modificar directamente los archivos bajo `.factory/`, a menos que estés muy seguro de lo que estás haciendo. Modificaciones incorrectas pueden hacer que la tubería no funcione correctamente.

Si necesitas personalizar la configuración, prioriza modificar el archivo `config.yaml`.
:::

### 2. ¿Puedo modificar manualmente los archivos en artifacts/?

**Sí**. Los archivos bajo `artifacts/` son artefactos de salida de la tubería, puedes:

- Modificar `input/idea.md` o `artifacts/prd/prd.md` para ajustar la dirección del producto
- Corregir manualmente el código en `artifacts/backend/` o `artifacts/client/`
- Ajustar estilos en `artifacts/ui/preview.web/index.html`

Después de modificar, puedes volver a ejecutar la tubería desde la etapa correspondiente.

### 3. ¿Cómo manejar los archivos en _failed/ y _untrusted/?

- **_failed/**: Verifica la causa del fallo, corrige el problema y vuelve a ejecutar esa etapa.
- **_untrusted/**: Confirma si el archivo debería existir, si es así, mueve el archivo al directorio correcto.

### 4. ¿Qué hacer si el archivo state.json está dañado?

Si `state.json` está dañado, puedes ejecutar el siguiente comando para restablecer:

```bash
factory reset
```

### 5. ¿Cómo ver el estado actual de la tubería?

Ejecuta el siguiente comando para ver el estado actual:

```bash
factory status
```

---

## Resumen de esta lección

En esta lección explicamos en detalle la estructura completa de directorios del proyecto Factory:

- ✅ `.factory/`: Configuración central de Factory (pipeline, agents, skills, policies)
- ✅ `.claude/`: Configuración de permisos de Claude Code
- ✅ `input/`: Entrada del usuario (idea.md)
- ✅ `artifacts/`: Artefactos de la tubería (prd, ui, tech, backend, client, validation, preview)
- ✅ `_failed/` y `_untrusted/`: Archivo de artefactos fallidos y con exceso de privilegios

Comprender estas estructuras de directorios te ayudará a localizar rápidamente archivos, modificar configuraciones y depurar problemas.

---

## Próxima lección

> En la siguiente lección aprenderemos **[Estándares de código](../code-standards/)**.
>
> Aprenderás:
> - Estándares de codificación TypeScript
> - Estructuras de archivos y convenciones de nombres
> - Requisitos de comentarios y documentación
> - Normas de mensajes de commit de Git
