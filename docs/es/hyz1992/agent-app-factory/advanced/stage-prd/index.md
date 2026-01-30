---
title: "Fase 2: PRD - Generación de Documento de Requisitos del Producto | Tutorial de Agent App Factory"
sidebarTitle: "Generar Documento de Requisitos del Producto"
subtitle: "Fase 2: PRD - Generación de Documento de Requisitos del Producto"
description: "Aprenda cómo la fase PRD transforma ideas de productos estructuradas en documentos de requisitos a nivel MVP. Este tutorial explica en profundidad los límites de responsabilidad del PRD Agent, el uso de skills/prd/skill.md, la estructura estándar de prd.md y el framework de prioridad MoSCoW, ayudándole a definir rápidamente el alcance y la prioridad del MVP y a escribir de forma independiente historias de usuario comprobables y criterios de aceptación."
tags:
  - "Pipeline"
  - "PRD"
  - "Requisitos del Producto"
prerequisite:
  - "start-pipeline-overview"
  - "advanced-stage-bootstrap"
order: 90
---

# Fase 2: PRD - Generación de Documento de Requisitos del Producto

La fase PRD es la segunda fase del pipeline de Agent App Factory, responsable de transformar `input/idea.md` en un documento completo de requisitos del producto orientado a MVP (Producto Mínimo Viable). Esta fase definirá los usuarios objetivo, las funciones principales, el alcance del MVP y los no objetivos, proporcionando una guía clara para el diseño de UI y la arquitectura técnica posterior.

## Qué Podrás Hacer al Finalizar

- Transformar `input/idea.md` en un documento `artifacts/prd/prd.md` que cumpla con la plantilla estándar
- Comprender los límites de responsabilidad del PRD Agent (solo define requisitos, no involucra implementación técnica)
- Dominar el framework de prioridad de funcionalidad MoSCoW, asegurando que el MVP se centre en el valor principal
- Ser capaz de escribir historias de usuario de alta calidad y criterios de aceptación verificables
- Saber qué contenido debe estar en el PRD y qué debe dejarse para fases posteriores

## Tu Dificultad Actual

Es posible que tengas una idea clara de producto (la fase Bootstrap ya está completa), pero encuentras dificultades al transformarla en un documento de requisitos:

- "No sé qué funcionalidades incluir, preocupado por omisiones o sobrediseño"
- "Hay muchas funciones, pero no sé cuáles son esenciales para el MVP"
- "Las historias de usuario no están claras, el equipo de desarrollo no puede entenderlas"
- "Accidentalmente mezclo detalles de implementación técnica con los requisitos, causando expansión del alcance"

Este PRD poco claro hará que el diseño de UI y el desarrollo de código posteriores carezcan de una guía clara, y la aplicación generada podría desviarse de tus expectativas o incluir complejidad innecesaria.

## Cuándo Usar Esta Técnica

Cuando la fase Bootstrap está completa y se cumplen las siguientes condiciones:

1. **Se ha completado la estructuración de idea.md** (salida de la fase Bootstrap)
2. **No se ha iniciado el diseño de UI ni la arquitectura técnica** (estas se harán en fases posteriores)
3. **Se desea definir claramente el alcance del MVP** (evitar sobrediseño de funcionalidades)
4. **Se necesita proporcionar una guía clara para desarrollo y diseño** (historias de usuario, criterios de aceptación)

## 🎒 Preparación Antes de Empezar

::: warning Requisitos Previos
Antes de iniciar la fase PRD, asegúrese de:

- ✅ Se ha [inicializado el proyecto](../../start/init-project/)
- ✅ Se ha [entendido la visión general del pipeline de 7 fases](../../start/pipeline-overview/)
- ✅ Se ha [completado la fase Bootstrap](../stage-bootstrap/), generando `input/idea.md`
- ✅ Se ha instalado y configurado el asistente de IA (se recomienda Claude Code)
:::

## Idea Central

### ¿Qué es la Fase PRD?

El núcleo de responsabilidad de la fase **PRD** (Product Requirements Document - Documento de Requisitos del Producto) es **definir qué hacer, no cómo hacerlo**.

::: info No es un Documento Técnico
El PRD Agent no es arquitecto ni diseñador de UI, no decidirá por ti:
- ❌ Qué stack tecnológico usar (React vs Vue, Express vs Koa)
- ❌ Cómo diseñar la base de datos (estructura de tablas, índices)
- ❌ Detalles de diseño y layout de UI (posición de botones, esquema de colores)

Su tarea es:
- ✅ Definir usuarios objetivo y sus puntos de dolor
- ✅ Listar funcionalidades principales y su prioridad
- ✅ Aclarar el alcance del MVP y los no objetivos
- ✅ Proporcionar historias de usuario verificables y criterios de aceptación
:::

### ¿Por Qué PRD?

Imagina que le dices al equipo de construcción: "Quiero construir una casa"

- ❌ Sin planos: El equipo de construcción solo puede adivinar, podría construir una casa que no quieres vivir en absoluto
- ✅ Con planos detallados: Definido número de habitaciones, distribución funcional, requisitos de materiales, el equipo construye según los planos

La fase PRD es convertir "Quiero construir una casa" en planos detallados de "tres habitaciones y dos salas, dormitorio principal orientado al sur, cocina abierta".

### Framework de Prioridad de Funcionalidad MoSCoW

La fase PRD usa el **framework MoSCoW** para clasificar las funcionalidades, asegurando que el MVP se centre en el valor principal:

| Categoría | Definición | Criterio de Juicio | Ejemplo |
|----------|------------|-------------------|---------|
| **Must Have** | Funcionalidades absolutamente necesarias para el MVP | Sin esto el producto no puede entregar valor principal | App de contabilidad: agregar registros de gastos, ver lista de gastos |
| **Should Have** | Funcionalidades importantes pero no bloqueantes | Los usuarios notarán claramente la ausencia, pero pueden usar soluciones temporales | App de contabilidad: exportar reportes, estadísticas por categoría |
| **Could Have** | Funcionalidades que mejoran la experiencia | No afectan la experiencia principal, los usuarios no notarán especialmente la ausencia | App de contabilidad: alertas de presupuesto, soporte multi-moneda |
| **Won't Have** | Funcionalidades explícitamente excluidas | Irrelevantes para el valor principal o complejidad técnica alta | App de contabilidad: compartir socialmente, consejos de inversión |

::: tip Core del MVP
Las funcionalidades Must Have deben controlarse dentro de 5-7 ítems, asegurando que el MVP se centre en el valor principal y evitando expansión del alcance.
:::

## Sigue la Operación

### Paso 1: Confirmar que la Fase Bootstrap Está Completa

Antes de iniciar la fase PRD, asegúrese de que `input/idea.md` existe y su contenido cumple con el estándar.

```bash
# Verificar si idea.md existe
cat input/idea.md
```

**Lo que deberías ver**: Un documento estructurado que contiene capítulos como descripción breve, problema, usuarios objetivo, valor principal, suposiciones, no objetivos, etc.

::: tip Si idea.md no cumple el estándar
Regresa a la [fase Bootstrap](../stage-bootstrap/) para regenerar, o edita manualmente para complementar información.
:::

### Paso 2: Iniciar el Pipeline hasta la Fase PRD

Ejecuta en el directorio del proyecto Factory:

```bash
# Si el pipeline ya está iniciado, continúa a la fase PRD
factory run prd

# O inicia el pipeline desde el principio
factory run
```

El CLI mostrará el estado actual y las fases disponibles, y generará instrucciones del asistente para el PRD Agent.

### Paso 3: El Asistente de IA Lee la Definición del PRD Agent

El asistente de IA (como Claude Code) leerá automáticamente `agents/prd.agent.md`, entendiendo sus responsabilidades y restricciones.

::: info Responsabilidades del PRD Agent
El PRD Agent solo puede:
- Leer `input/idea.md`
- Escribir `artifacts/prd/prd.md`
- Usar frameworks de pensamiento y principios de decisión de `skills/prd/skill.md`

No puede:
- Discutir cualquier detalle de implementación técnica o diseño de UI
- Leer otros archivos (incluidos productos upstream)
- Escribir en otros directorios
:::

### Paso 4: Cargar skills/prd/skill.md

El PRD Agent cargará `skills/prd/skill.md`, obteniendo la siguiente guía:

**Framework de Pensamiento**:
- Usuarios objetivo: ¿Quiénes lo usarán? ¿Cuál es su contexto, rol, puntos de dolor?
- Problema principal: ¿Qué problema fundamental resuelve el producto?
- Valor principal: ¿Por qué esta solución tiene valor? ¿Qué ventajas tiene sobre la competencia?
- Métricas de éxito: ¿Cómo se mide el éxito?

**Prioridad de Funcionalidad MoSCoW**:
- Must Have (Debe tener): Funcionalidades absolutamente necesarias para el MVP
- Should Have (Debería tener): Funcionalidades importantes pero no bloqueantes
- Could Have (Podría tener): Funcionalidades que mejoran la experiencia
- Won't Have (No tendrá): Funcionalidades explícitamente excluidas

**Guía de Escritura de Historias de Usuario**:
```
Como [rol/tipo de usuario]
Quiero [funcionalidad/operación]
Para que [valor de negocio/objetivo]
```

**Requisitos de Estructura del Documento PRD** (8 capítulos):
1. Resumen
2. Perfiles de Usuarios Objetivo
3. Propuesta de Valor Principal
4. Requisitos de Funcionalidad (clasificación MoSCoW)
5. Flujos de Usuario
6. No Objetivos (Won't Have)
7. Métricas de Éxito
8. Suposiciones y Riesgos

### Paso 5: Generar Documento PRD

El asistente de IA generará un documento PRD completo basado en el contenido de `input/idea.md`, usando el framework de pensamiento y principios de decisión de las habilidades.

**Lo que hará el PRD Agent**:
1. Leer `input/idea.md`, extrayendo elementos clave (usuarios objetivo, problema, valor principal, etc.)
2. Clasificar las funcionalidades según el framework MoSCoW
3. Escribir historias de usuario y criterios de aceptación para funcionalidades Must Have
4. Listar no objetivos, previniendo expansión del alcance
5. Proporcionar métricas de éxito cuantificables
6. Escribir el documento organizado en `artifacts/prd/prd.md`

::: tip Restricción Clave
El PRD Agent está prohibido de discutir detalles de implementación técnica o diseño de UI. Si encuentra estos contenidos, el PRD Agent se rehusará a escribirlos.
:::

### Paso 6: Confirmar Contenido de prd.md

Cuando el PRD Agent termine, generará `artifacts/prd/prd.md`. Debes verificar cuidadosamente:

**Puntos de Verificación ✅**:

1. **¿Los usuarios objetivo son específicos?**
   - ✅ Tienen perfiles específicos (edad/ocupación/capacidad técnica/escenario de uso/puntos de dolor)
   - ❌ Vagos: "Todos" o "personas que necesitan contabilidad"

2. **¿El problema principal es claro?**
   - ✅ Describe el problema que los usuarios encuentran en escenarios reales
   - ❌ General: "La experiencia de usuario es mala"

3. **¿El valor principal es cuantificable?**
   - ✅ Tiene beneficios específicos (ahorrar 80% de tiempo, mejorar 50% de eficiencia)
   - ❌ General: "Mejorar eficiencia", "mejor experiencia"

4. **¿Las funcionalidades Must Have están enfocadas?**
   - ✅ No más de 5-7 funcionalidades principales
   - ❌ Demasiadas funcionalidades o incluye funcionalidades secundarias

5. **¿Cada funcionalidad Must Have tiene historia de usuario?**
   - ✅ Usa formato estándar (Como... Quiero... Para que...)
   - ❌ Falta historia de usuario o formato incorrecto

6. **¿Los criterios de aceptación son verificables?**
   - ✅ Tienen criterios verificables específicos (puede ingresar monto, mostrar en lista)
   - ❌ Vagos ("amigable al usuario", "experiencia fluida")

7. **¿Should Have y Won't Have están claramente listados?**
   - ✅ Should Have marcado como "iteración futura" con explicación
   - ✅ Won't Have explica por qué se excluye
   - ❌ Faltan o muy pocos

8. **¿Las métricas de éxito son cuantificables?**
   - ✅ Tiene valores numéricos (tasa de retención > 30%, tiempo de tarea < 30 segundos)
   - ❌ Vagos ("a los usuarios les gusta", "buena experiencia")

9. **¿Las suposiciones son verificables?**
   - ✅ Pueden verificarse mediante investigación de usuarios
   - ❌ Juicios subjetivos ("a los usuarios les gustará")

10. **¿Incluye detalles de implementación técnica o diseño de UI?**
    - ✅ Sin detalles técnicos ni descripciones de UI
    - ❌ Incluye selección de stack, diseño de base de datos, layout de UI, etc.

### Paso 7: Elegir Continuar, Reintentar o Pausar

Después de confirmar sin errores, el CLI mostrará opciones:

```bash
Seleccione una acción:
[1] Continuar (entrar a fase UI)
[2] Reintentar (regenerar prd.md)
[3] Pausar (continuar después)
```

::: tip Sugerencia: Primero revisar en el editor de código
Antes de confirmar en el asistente de IA, abre `artifacts/prd/prd.md` en el editor de código y verifica palabra por palabra. Una vez que entras en la fase UI, el costo de modificación será mayor.
:::

## Advertencias de Errores Comunes

### Error 1: Demasiadas Funcionalidades Must Have

**Ejemplo Incorrecto**:
```
Must Have:
1. Agregar registro de gastos
2. Ver lista de gastos
3. Exportar reportes
4. Estadísticas por categoría
5. Alertas de presupuesto
6. Soporte multi-moneda
7. Compartir socialmente
8. Consejos de inversión
```

**Consecuencia**: Alcance del MVP demasiado grande, ciclo de desarrollo largo, alto riesgo.

**Sugerencia**: Controlar en 5-7 funcionalidades principales:
```
Must Have:
1. Agregar registro de gastos
2. Ver lista de gastos
3. Seleccionar categoría de gastos

Should Have (iteración futura):
4. Exportar reportes
5. Estadísticas por categoría

Won't Have (explícitamente excluido):
6. Compartir socialmente (irrelevante para el valor principal)
7. Consejos de inversión (requiere calificaciones profesionales, complejidad técnica alta)
```

### Error 2: Historias de Usuario Faltantes o Formato Incorrecto

**Ejemplo Incorrecto**:
```
Funcionalidad: Agregar registro de gastos
Descripción: Los usuarios pueden agregar registros de gastos
```

**Consecuencia**: El equipo de desarrollo no sabe para quién lo hace, qué problema resuelve.

**Sugerencia**: Usar formato estándar:
```
Funcionalidad: Agregar registro de gastos
Historia de usuario: Como un usuario con conciencia de presupuesto
Quiero registrar cada gasto
Para que pueda entender dónde va mi consumo y controlar mi presupuesto

Criterios de aceptación:
- Puede ingresar monto y descripción del gasto
- Puede seleccionar categoría de gastos
- El registro se muestra inmediatamente en la lista de gastos
- Muestra la fecha y hora actual
```

### Error 3: Criterios de Aceptación No Verificables

**Ejemplo Incorrecto**:
```
Criterios de aceptación:
- Interfaz de usuario amigable
- Operación fluida
- Buena experiencia
```

**Consecuencia**: No se puede probar, el equipo de desarrollo no sabe qué cuenta como "amigable", "fluida", "buena".

**Sugerencia**: Escribir criterios verificables específicos:
```
Criterios de aceptación:
- Puede ingresar monto y descripción del gasto
- Puede seleccionar de 10 categorías predefinidas
- El registro se muestra en la lista de gastos en menos de 1 segundo
- Registra automáticamente la fecha y hora actual
```

### Error 4: Descripción de Usuarios Objetivo Muy General

**Ejemplo Incorrecto**:
```
Usuarios objetivo: Todos los que necesitan contabilidad
```

**Consecuencia**: El diseño de UI y la arquitectura técnica posteriores no pueden definir una dirección clara.

**Sugerencia**: Definir perfiles claramente:
```
Principal grupo de usuarios:
- Rol: Jóvenes de 18-30 años que acaban de empezar a trabajar
- Edad: 18-30 años
- Capacidad técnica: Intermedio, familiarizado con aplicaciones móviles
- Escenario de uso: Registrar inmediatamente después de cada consumo diario, ver estadísticas al final del mes
- Puntos de dolor: Descubren sobregastos al final del mes pero no saben en qué se gastó el dinero, sin control de presupuesto
```

### Error 5: No Objetivos Faltantes o Demasiado Pocos

**Ejemplo Incorrecto**:
```
No objetivos: Ninguno
```

**Consecuencia**: Las fases PRD y Code posteriores podrían sobrediseñar, aumentando la complejidad técnica.

**Sugerencia**: Listar al menos 3 ítems:
```
No Objetivos (Out of Scope):
- Funcionalidad de compartir socialmente (el MVP se enfoca en contabilidad personal)
- Consejos financieros y análisis de inversión (requiere calificaciones profesionales, fuera del valor principal)
- Integración con sistemas financieros de terceros (complejidad técnica alta, no necesario para MVP)
- Análisis de datos complejos y reportes (Should Have, iteración futura)
```

### Error 6: Incluye Detalles de Implementación Técnica

**Ejemplo Incorrecto**:
```
Funcionalidad: Agregar registro de gastos
Implementación técnica: Usar React Hook Form para gestionar formularios, endpoint API POST /api/expenses
```

**Consecuencia**: El PRD Agent rechazará estos contenidos (solo define requisitos, no involucra implementación técnica).

**Sugerencia**: Solo decir "qué hacer", no "cómo hacerlo":
```
Funcionalidad: Agregar registro de gastos
Historia de usuario: Como un usuario con conciencia de presupuesto
Quiero registrar cada gasto
Para que pueda entender dónde va mi consumo y controlar mi presupuesto

Criterios de aceptación:
- Puede ingresar monto y descripción del gasto
- Puede seleccionar categoría de gastos
- El registro se muestra inmediatamente en la lista de gastos
- Muestra la fecha y hora actual
```

### Error 7: Métricas de Éxito No Cuantificables

**Ejemplo Incorrecto**:
```
Métricas de éxito:
- A los usuarios les gusta nuestra aplicación
- Experiencia fluida
- Alta retención de usuarios
```

**Consecuencia**: No se puede medir si el producto es exitoso.

**Sugerencia**: Escribir métricas cuantificables:
```
Métricas de éxito:
Objetivos del producto:
- Obtener 100 usuarios activos en el primer mes
- Los usuarios usan al menos 3 veces por semana
- Tasa de uso de funcionalidades principales (agregar registro de gastos) > 80%

KPIs clave:
- Tasa de retención de usuarios: retención de 7 días > 30%, retención de 30 días > 15%
- Tasa de uso de funcionalidades principales: uso de agregar registro de gastos > 80%
- Tiempo de completar tarea: agregar un gasto < 30 segundos

Método de verificación:
- Registrar comportamiento del usuario mediante logs de backend
- Usar pruebas A/B para verificar retención de usuarios
- Recopilar satisfacción mediante cuestionarios de feedback de usuarios
```

### Error 8: Suposiciones No Verificables

**Ejemplo Incorrecto**:
```
Suposición: A los usuarios les gustará nuestro diseño
```

**Consecuencia**: No se puede verificar mediante investigación de usuarios, el MVP podría fallar.

**Sugerencia**: Escribir suposiciones verificables:
```
Suposiciones:
Suposiciones de mercado:
- Los jóvenes (18-30 años) tienen el punto de dolor "no sé en qué se gastó el dinero"
- Las aplicaciones de contabilidad existentes son demasiado complejas, los jóvenes necesitan una solución más simple

Suposiciones de comportamiento de usuario:
- Los usuarios están dispuestos a gastar 2 minutos para registrar gastos después de cada consumo si ayuda a controlar el presupuesto
- Los usuarios prefieren UI minimalista, no necesitan gráficos y análisis complejos

Suposiciones de viabilidad técnica:
- Las aplicaciones móviles pueden implementar un flujo de contabilidad de 3 pasos rápido
- El almacenamiento offline puede satisfacer necesidades básicas
```

## Resumen de Esta Lección

El núcleo de la fase PRD es **definir requisitos, no implementación**:

1. **Entrada**: `input/idea.md` estructurado (salida de la fase Bootstrap)
2. **Proceso**: El asistente de IA usa el framework de pensamiento de `skills/prd/skill.md` y el framework de prioridad MoSCoW
3. **Salida**: Documento completo `artifacts/prd/prd.md`
4. **Verificación**: Verificar si los usuarios están claros, si el valor es cuantificable, si las funcionalidades están enfocadas, si incluye detalles técnicos

::: tip Principios Clave
- ❌ Qué no hacer: No discutir implementación técnica, no diseñar layout de UI, no decidir estructura de base de datos
- ✅ Qué hacer solo: Definir usuarios objetivo, listar funcionalidades principales, aclarar alcance del MVP, proporcionar historias de usuario comprobables
:::

## Próxima Lección

> En la próxima lección aprenderemos **[Fase 3: UI - Diseño de Interfaz y Prototipado](../stage-ui/)**.
>
> Aprenderás:
> - Cómo diseñar estructura de UI basada en el PRD
> - Cómo usar la habilidad ui-ux-pro-max para generar sistema de diseño
> - Cómo generar prototipos HTML visualizables
> - Archivos de salida y condiciones de salida de la fase UI

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haga clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-29

| Funcionalidad | Ruta de Archivo | Número de Línea |
|--------------|-----------------|-----------------|
| Definición del PRD Agent | [`agents/prd.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/prd.agent.md) | 1-33 |
| Habilidad PRD | [`skills/prd/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/prd/skill.md) | 1-325 |
| Definición del pipeline (Fase PRD) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 20-33 |
| Definición del scheduler | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Restricciones Clave**:
- **Prohibidos detalles de implementación técnica**: prd.agent.md:23
- **Prohibidas descripciones de diseño de UI**: prd.agent.md:23
- **Debe incluir usuarios objetivo**: pipeline.yaml:29
- **Debe definir alcance del MVP**: pipeline.yaml:30
- **Debe listar no objetivos**: pipeline.yaml:31
- **El archivo de salida debe guardarse en artifacts/prd/prd.md**: prd.agent.md:13

**Condiciones de Salida** (pipeline.yaml:28-32):
- El PRD incluye usuarios objetivo
- El PRD define alcance del MVP
- El PRD lista no objetivos (Out of Scope)
- El PRD no incluye ningún detalle de implementación técnica

**Framework de Contenido de Habilidad**:
- **Framework de pensamiento**: Usuarios objetivo, problema principal, valor principal, métricas de éxito
- **Framework de prioridad de funcionalidad MoSCoW**: Must Have, Should Have, Could Have, Won't Have
- **Guía de escritura de historias de usuario**: Formato estándar y ejemplos
- **Requisitos de estructura del documento PRD**: 8 capítulos obligatorios
- **Principios de decisión**: Centrado en usuario, enfoque en MVP, no objetivos claros, verificabilidad
- **Lista de verificación de calidad**: Usuarios y problema, alcance de funcionalidad, historias de usuario, integridad del documento, verificación de prohibidos
- **No hacer (NEVER)**: 7 comportamientos explícitamente prohibidos

**Capítulos Obligatorios del Documento PRD**:
1. Resumen (resumen del producto, contexto y objetivos)
2. Perfiles de usuarios objetivo (principal grupo de usuarios, grupo de usuarios secundario)
3. Propuesta de valor principal (problema resuelto, nuestra solución, ventajas diferenciadas)
4. Requisitos de funcionalidad (Must Have, Should Have, Could Have)
5. Flujos de usuario (descripción del flujo principal)
6. No objetivos (Won't Have)
7. Métricas de éxito (objetivos del producto, KPIs clave, método de verificación)
8. Suposiciones y riesgos (suposiciones de mercado, suposiciones de comportamiento de usuario, suposiciones de viabilidad técnica, tabla de riesgos)

</details>
