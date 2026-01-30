---
title: "Inicio rápido: de la idea a la aplicación | Tutorial de AI App Factory"
sidebarTitle: "Listo en 5 minutos"
subtitle: "Inicio rápido: de la idea a la aplicación"
description: "Descubre cómo AI App Factory convierte automáticamente ideas de productos en aplicaciones MVP ejecutables a través de una pipeline de 7 etapas. Este tutorial cubre valores principales, requisitos previos, inicialización de proyecto, inicio de pipeline y ejecución de código, ayudándote a comenzar con la generación de aplicaciones impulsadas por IA en 5 minutos. Automatización de extremo a extremo, mecanismo de puntos de control y lista para producción, incluye código de frontend y backend, pruebas, documentación y configuración de CI/CD."
tags:
  - "Inicio rápido"
  - "MVP"
  - "Generación por IA"
prerequisite: []
order: 10
---

# Inicio rápido: de la idea a la aplicación

## Lo que podrás hacer después de esta lección

Al terminar esta lección, podrás:

- Entender cómo AI App Factory te ayuda a convertir rápidamente ideas en aplicaciones ejecutables
- Completar la inicialización de tu primer proyecto Factory
- Iniciar la pipeline y seguir 7 etapas para generar tu primera aplicación MVP

## Tu situación actual

**"Tengo una idea de producto, pero no sé por dónde empezar"**

¿Te has encontrado en esta situación:
- Tienes una idea de producto, pero no sabes cómo descomponerla en requisitos ejecutables
- Frontend, backend, base de datos, pruebas, despliegue... cada una toma tiempo
- Quieres validar rápidamente la idea, pero configurar el entorno de desarrollo lleva días
- Escribes el código y luego descubres que entendiste mal los requisitos, tendrás que empezar de nuevo

AI App Factory fue creado exactamente para resolver estos problemas.

## Cuándo usar este enfoque

AI App Factory es adecuado para estos escenarios:

- ✅ **Validación rápida de ideas de producto**: Quieres probar si esta idea es viable
- ✅ **Fase 0-1 de proyectos startup**: Necesitas entregar rápidamente un prototipo demostrable
- ✅ **Herramientas internas y sistemas de gestión**: No necesitan permisos complejos, simple y práctico
- ✅ **Aprender mejores prácticas de desarrollo full-stack**: Ver cómo la IA genera código de producción

No es adecuado para estos escenarios:

- ❌ **Sistemas empresariales complejos**: Multi-tenant, sistemas de permisos, alta concurrencia
- ❌ **UI altamente personalizada**: Proyectos con sistemas de diseño únicos
- ❌ **Sistemas con requisitos de tiempo real extremadamente altos**: Juegos, videollamadas, etc.

## 🎯 Idea central

AI App Factory es un sistema inteligente de generación de aplicaciones basado en puntos de control, que a través de una pipeline colaborativa de múltiples Agentes, convierte automáticamente tu idea de producto en una aplicación completa y ejecutable que incluye código de frontend y backend, pruebas y documentación.

**Tres valores principales**:

### 1. Automatización de extremo a extremo

De la idea al código, completamente automático:
- Entrada: Describe tu idea de producto en una frase
- Salida: Aplicación completa de frontend y backend (Express + Prisma + React Native)
- Proceso intermedio: Análisis de requisitos, diseño de UI, arquitectura técnica, generación de código se completan automáticamente

### 2. Mecanismo de puntos de control

Pausa después de cada etapa, esperando tu confirmación:
- ✅ Evita acumulación de errores, asegura que cada paso cumpla las expectativas
- ✅ Puedes ajustar la dirección en cualquier momento, evitando descubrir al final que te desviaste
- ✅ Al fallar, retrocede automáticamente, no pierdes tiempo en código incorrecto

### 3. Lista para producción

No genera código de juguete, sino aplicaciones de nivel de producción listas para desplegar:
- ✅ Código completo de frontend y backend
- ✅ Pruebas unitarias y de integración (>60% de cobertura)
- ✅ Documentación de API (Swagger/OpenAPI)
- ✅ Datos de semilla de base de datos
- ✅ Configuración de despliegue Docker
- ✅ Pipeline CI/CD (GitHub Actions)
- ✅ Manejo de errores y monitoreo de registros
- ✅ Optimización de rendimiento y verificaciones de seguridad

**Pipeline de 7 etapas**:

```
Bootstrap → PRD → UI → Tech → Code → Validation → Preview
   ↓          ↓    ↓     ↓      ↓         ↓          ↓
Estructura  Producto  UI  Técnica   Código    Validación  Despliegue
想法      Requisitos Diseño Arquitectura  Generación  Calidad      Guía
```

## 🎒 Preparativos antes de comenzar

### Herramientas necesarias

**1. Node.js >= 16.0.0**

```bash
# Verificar versión de Node.js
node --version
```

Si no está instalado o la versión es demasiado antigua, descárgalo e instálalo desde [nodejs.org](https://nodejs.org/).

**2. Asistente de programación por IA (obligatorio)** ⚠️ Importante

Las definiciones de Agent y archivos Skill de AI App Factory son instrucciones de IA en formato Markdown, que deben ser interpretadas y ejecutadas a través de un asistente de IA. Los humanos no pueden ejecutar estas pipelines directamente.

Se recomienda usar una de las siguientes herramientas:

- **Claude Code** (https://claude.ai/code) - Recomendado ⭐
- **OpenCode** u otros asistentes de IA que admitan modo Agent

::: warning ¿Por qué es obligatorio usar un asistente de IA?
El núcleo de este proyecto es el sistema de AI Agent, cada etapa requiere el asistente de IA:
- Leer archivos `.agent.md` para entender su propia tarea
- Cargar los archivos Skill correspondientes para obtener conocimiento
- Generar código y documentación estrictamente siguiendo las instrucciones

Los humanos no pueden reemplazar este proceso, así como no puedes ejecutar código de Python con el Bloc de notas.
:::

**3. Instalación global de la herramienta CLI**

```bash
npm install -g agent-app-factory
```

Verificar instalación:

```bash
factory --version
```

Deberías ver la versión de salida.

### Preparar la idea del producto

Tómate 5 minutos para escribir tu idea de producto. Una descripción más detallada genera una aplicación más acorde a las expectativas.

**Ejemplo de buena descripción**:

> ✅ Una aplicación que ayuda a principiantes en fitness a registrar sus entrenamientos, admite registrar tipos de ejercicio (correr, nadar, gimnasio), duración, calorías quemadas, y ver estadísticas de entrenamiento de la semana. No necesita colaboración múltiple, no hace análisis de datos, se enfoca en el registro personal.

**Ejemplo de mala descripción**:

> ❌ Haz una aplicación de fitness.

## Sigue mis pasos

### Paso 1: Crear directorio del proyecto

Crea un directorio vacío en cualquier ubicación:

```bash
mkdir my-first-app && cd my-first-app
```

### Paso 2: Inicializar proyecto Factory

Ejecuta el comando de inicialización:

```bash
factory init
```

**Por qué**
Esto crea el directorio `.factory/` y copia todos los archivos necesarios de Agent, Skill, Policy, convirtiendo el directorio actual en un proyecto Factory.

**Deberías ver**:

```
✓ Se creó el directorio .factory/
✓ Se copiaron agents/, skills/, policies/, pipeline.yaml
✓ Se generaron archivos de configuración: config.yaml, state.json
✓ Se generó configuración de permisos de Claude Code: .claude/settings.local.json
✓ Se intentó instalar los plugins necesarios (superpowers, ui-ux-pro-max)
```

Si ves mensajes de error, verifica:
- Si el directorio está vacío (o solo contiene archivos de configuración)
- Si la versión de Node.js es >= 16.0.0
- Si se instaló globalmente agent-app-factory

::: tip Estructura de directorios
Después de la inicialización, tu estructura de directorios debería ser:

```
my-first-app/
├── .factory/
│   ├── agents/              # Archivos de definición de Agentes
│   ├── skills/              # Módulos de conocimiento reutilizables
│   ├── policies/            # Políticas y especificaciones
│   ├── pipeline.yaml        # Definición de pipeline
│   ├── config.yaml          # Configuración del proyecto
│   └── state.json          # Estado de pipeline
└── .claude/
    └── settings.local.json  # Configuración de permisos de Claude Code
```
:::

### Paso 3: Iniciar la pipeline

En el asistente de IA (se recomienda Claude Code), ejecuta la siguiente instrucción:

```
Por favor, lee pipeline.yaml y agents/orchestrator.checkpoint.md,
inicia la pipeline y ayúdame a convertir esta idea de producto en una aplicación ejecutable:

[Pega tu idea de producto]
```

**Por qué**
Esto hará que el planificador Sisyphus inicie la pipeline, comenzando desde la etapa Bootstrap, convirtiendo tu idea paso a paso en código.

**Deberías ver**:

El asistente de IA:
1. Leerá pipeline.yaml y orchestrator.checkpoint.md
2. Mostrará el estado actual (idle → running)
3. Iniciará el Agent Bootstrap, comenzando a estructurar tu idea de producto

### Paso 4: Seguir las 7 etapas

El sistema ejecutará las siguientes 7 etapas, **pausando después de cada etapa y solicitando tu confirmación**:

#### Etapa 1: Bootstrap - Estructurar la idea del producto

**Entrada**: Tu descripción del producto
**Salida**: `input/idea.md` (documento de producto estructurado)

**Contenido a confirmar**:
- Definición del problema: ¿Qué problema resuelve?
- Usuarios objetivo: ¿Quién encuentra este problema?
- Valor principal: ¿Por qué se necesita este producto?
- Suposiciones clave: ¿Cuáles son tus suposiciones?

**Deberías ver**:

El asistente de IA preguntará:

```
✓ Etapa Bootstrap completada
Documento generado: input/idea.md

Por favor confirma:
1. Continuar a la siguiente etapa
2. Reintentar la etapa actual (proporcionar sugerencias de modificación)
3. Pausar la pipeline
```

Lee cuidadosamente `input/idea.md`, si hay algo que no coincide, elige "Reintentar" y proporciona sugerencias de modificación.

#### Etapa 2: PRD - Generar documento de requisitos del producto

**Entrada**: `input/idea.md`
**Salida**: `artifacts/prd/prd.md`

**Contenido a confirmar**:
- Historias de usuario: ¿Cómo usarán los usuarios este producto?
- Lista de funcionalidades: ¿Qué funcionalidades principales se deben implementar?
- No objetivo: ¿Qué no se hará (para evitar la proliferación del alcance)?

#### Etapa 3: UI - Diseñar estructura y prototipo de UI

**Entrada**: `artifacts/prd/prd.md`
**Salida**: `artifacts/ui/ui.schema.yaml` + prototipo HTML previsualizable

**Contenido a confirmar**:
- Estructura de páginas: ¿Qué páginas hay?
- Flujo de interacción: ¿Cómo operan los usuarios?
- Diseño visual: esquema de colores, fuentes, diseño

**Característica**: Integración del sistema de diseño ui-ux-pro-max (67 estilos, 96 paletas de colores, 100 reglas de la industria)

#### Etapa 4: Tech - Diseñar arquitectura técnica

**Entrada**: `artifacts/prd/prd.md`
**Salida**: `artifacts/tech/tech.md` + `artifacts/backend/prisma/schema.prisma`

**Contenido a confirmar**:
- Stack técnico: ¿Qué tecnologías se usarán?
- Modelo de datos: ¿Qué tablas hay? ¿Qué campos?
- Diseño de API: ¿Qué endpoints de API hay?

#### Etapa 5: Code - Generar código completo

**Entrada**: UI Schema + Diseño Tech + Schema Prisma
**Salida**: `artifacts/backend/` + `artifacts/client/`

**Contenido a confirmar**:
- Código de backend: Express + Prisma + TypeScript
- Código de frontend: React Native + TypeScript
- Pruebas: Vitest (backend) + Jest (frontend)
- Archivos de configuración: package.json, tsconfig.json, etc.

#### Etapa 6: Validation - Validar calidad del código

**Entrada**: Código generado
**Salida**: `artifacts/validation/report.md`

**Contenido a confirmar**:
- Instalación de dependencias: ¿npm install fue exitoso?
- Verificación de tipos: ¿TypeScript compiló exitosamente?
- Verificación de Prisma: ¿El Schema de base de datos es correcto?

#### Etapa 7: Preview - Generar guía de despliegue

**Entrada**: Código completo
**Salida**: `artifacts/preview/README.md` + `GETTING_STARTED.md`

**Contenido a confirmar**:
- Instrucciones de ejecución local: ¿Cómo iniciar frontend y backend localmente?
- Despliegue Docker: ¿Cómo desplegar usando Docker?
- Configuración CI/CD: ¿Cómo configurar GitHub Actions?

### Punto de control ✅

Después de completar las 7 etapas, deberías ver:

```
✓ Se completaron todas las etapas de la pipeline
Artefactos finales:
- artifacts/prd/prd.md (documento de requisitos del producto)
- artifacts/ui/ui.schema.yaml (diseño de UI)
- artifacts/tech/tech.md (arquitectura técnica)
- artifacts/backend/ (código de backend)
- artifacts/client/ (código de frontend)
- artifacts/validation/report.md (informe de validación)
- artifacts/preview/GETTING_STARTED.md (guía de ejecución)

Siguiente paso: Ver artifacts/preview/GETTING_STARTED.md para comenzar a ejecutar la aplicación
```

¡Felicitaciones! Tu primera aplicación generada por IA está completa.

### Paso 5: Ejecutar la aplicación generada

Ejecuta la aplicación siguiendo la guía generada:

```bash
# Backend
cd artifacts/backend
npm install
npm run dev

# Abre una nueva ventana de terminal para ejecutar el frontend
cd artifacts/client
npm install
npm run web  # Versión Web
# o
npm run ios      # Simulador iOS
# o
npm run android  # Simulador Android
```

**Deberías ver**:
- Backend iniciado en `http://localhost:3000`
- Frontend iniciado en `http://localhost:8081` (versión Web) o abierto en el simulador

## Advertencias sobre problemas comunes

### ❌ Error 1: Directorio no vacío

**Mensaje de error**:

```
✗ Directorio no vacío, por favor límpialo y reintenta
```

**Causa**: Ya hay archivos en el directorio durante la inicialización

**Solución**:

```bash
# Método 1: Limpiar el directorio (solo mantener archivos de configuración ocultos)
ls -a    # Ver todos los archivos
rm -rf !(.*)

# Método 2: Crear nuevo directorio
mkdir new-app && cd new-app
factory init
```

### ❌ Error 2: El asistente de IA no puede entender las instrucciones

**Síntoma del error**: El asistente de IA reporta "no se puede encontrar la definición del Agent"

**Causa**: No se ejecutó en el directorio del proyecto Factory

**Solución**:

```bash
# Asegúrate de estar en el directorio raíz del proyecto que contiene .factory/
ls -la  # Deberías poder ver .factory/
pwd     # Confirmar el directorio actual
```

### ❌ Error 3: Claude CLI no instalado

**Mensaje de error**:

```
✗ Claude CLI no instalado, por favor visita https://claude.ai/code para descargar
```

**Solución**:

Descarga e instala Claude Code CLI desde https://claude.ai/code.

## Resumen de esta lección

En esta lección aprendiste:

- **Valores principales de AI App Factory**: Automatización de extremo a extremo + Mecanismo de puntos de control + Lista para producción
- **Pipeline de 7 etapas**: Bootstrap → PRD → UI → Tech → Code → Validation → Preview
- **Cómo inicializar un proyecto**: Comando `factory init`
- **Cómo iniciar la pipeline**: Ejecutar instrucciones en el asistente de IA
- **Cómo seguir la pipeline**: Confirmar después de cada etapa, asegurar que la salida cumpla las expectativas

**Puntos clave**:
- Debes usar junto con un asistente de IA (Claude Code recomendado)
- Proporciona una descripción clara y detallada del producto
- Confirma cuidadosamente en cada punto de control, evita acumulación de errores
- El código generado es de nivel de producción, se puede usar directamente

## Próxima lección

> En la siguiente lección aprenderemos **[Instalación y configuración](../installation/)**.
>
> Aprenderás:
> - Cómo instalar globalmente Agent Factory CLI
> - Cómo configurar el asistente de IA (Claude Code / OpenCode)
> - Cómo instalar los plugins necesarios (superpowers, ui-ux-pro-max)

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-29

| Función           | Ruta del archivo                                                                                      | Líneas   |
| ----------------- | --------------------------------------------------------------------------------------------- | --------- |
| Entrada CLI          | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)         | 1-123     |
| Implementación del comando init    | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | -         |
| Implementación del comando run     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js)    | -         |
| Implementación del comando continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | -         |
| Definición de pipeline        | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)              | -         |
| Definición del planificador        | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | -         |

**Configuración clave**:
- `pipeline.yaml`: Define el orden de la pipeline de 7 etapas y la entrada/salida de cada etapa
- `.factory/state.json`: Mantiene el estado de ejecución de la pipeline (idle/running/waiting_for_confirmation/paused/failed)

**Flujo principal**:
- `factory init` → Crear directorio `.factory/`, copiar archivos de Agent, Skill, Policy
- `factory run` → Leer `state.json`, detectar tipo de asistente de IA, generar instrucciones del asistente
- `factory continue` → Regenerar configuración de permisos de Claude Code, iniciar nueva sesión para continuar ejecutando

</details>
