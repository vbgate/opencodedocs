---
title: "Fase 1: Bootstrap - Estructuración de la Idea de Producto | Tutorial de Agent App Factory"
sidebarTitle: "Estructuración de la Idea de Producto"
subtitle: "Fase 1: Bootstrap - Estructuración de la Idea de Producto"
description: "Aprende cómo la fase Bootstrap transforma ideas de producto vagas en documentos input/idea.md claros y estructurados. Este tutorial explica las responsabilidades del Bootstrap Agent, el uso de la habilidad superpowers:brainstorm, la estructura estándar de idea.md y la lista de verificación de calidad."
tags:
  - "Pipeline"
  - "Bootstrap"
  - "Idea de Producto"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# Fase 1: Bootstrap - Estructuración de la Idea de Producto

Bootstrap es la primera fase del pipeline de Agent App Factory, responsable de organizar tu idea de producto vaga en un documento `input/idea.md` claro. Este es el punto de partida para todas las fases posteriores (PRD, UI, Tech, etc.), determinando la dirección y calidad de todo el proyecto.

## Qué podrás hacer después de aprender esto

- Organizar ideas de producto vagas en un documento `input/idea.md` que cumpla con la plantilla estándar
- Comprender los límites de responsabilidad del Bootstrap Agent (solo recopila información, no crea requisitos)
- Saber cómo usar la habilidad superpowers:brainstorm para profundizar en la idea del producto
- Ser capaz de determinar qué información debe incluirse en la fase Bootstrap y qué no

## Tu situación actual

Puede que tengas una idea de producto, pero la describes de manera vaga:

- "Quiero hacer una app de fitness" (demasiado general)
- "Hacer una aplicación como Xiaohongshu" (no menciona la diferenciación)
- "Los usuarios necesitan una mejor herramienta de gestión de tareas" (no menciona el problema específico)

Estas descripciones vagas harán que las fases posteriores (PRD, UI, Tech) carezcan de entradas claras, y la aplicación final generada puede desviarse completamente de tus expectativas.

## Cuándo usar esta técnica

Cuando estés listo para iniciar el pipeline y cumplas las siguientes condiciones:

1. **Tener una idea de producto preliminar** (aunque sea solo una frase)
2. **Aún no has comenzado a escribir el documento de requisitos** (PRD está en fases posteriores)
3. **Aún no has decidido el stack tecnológico o el estilo de UI** (estos están en fases posteriores)
4. **Deseas controlar el alcance del producto y evitar el sobre-diseño** (la fase Bootstrap definirá explícitamente los no-objetivos)

## 🎒 Preparación antes de comenzar

::: warning Prerrequisitos
Antes de comenzar la fase Bootstrap, asegúrate de:

- ✅ Haber completado la [Inicialización del Proyecto](../../start/init-project/)
- ✅ Haber comprendido la [Visión General del Pipeline de 7 Fases](../../start/pipeline-overview/)
- ✅ Tener instalado y configurado el asistente de IA (se recomienda Claude Code)
- ✅ Haber preparado tu idea de producto (aunque sea vaga)
:::

## Conceptos fundamentales

### ¿Qué es la fase Bootstrap?

**Bootstrap** es el punto de partida de todo el pipeline, y su única responsabilidad es **organizar las ideas de producto fragmentadas en un documento estructurado**.

::: info No es un Product Manager
El Bootstrap Agent no es un Product Manager, no creará requisitos ni diseñará funciones por ti. Su tarea es:
- Recopilar la información que ya has proporcionado
- Organizar y estructurar esta información
- Presentarla según la plantilla estándar

No decidirá "qué funciones debería tener", solo te ayudará a expresar claramente "qué es lo que quieres".
:::

### ¿Por qué estructurar?

Imagina que le dices a un chef: "Quiero comer algo rico"

- ❌ Descripción vaga: el chef solo puede adivinar, y podría preparar algo que no quieres comer en absoluto
- ✅ Descripción estructurada: "Quiero un plato picante de Sichuan, sin cilantro, que sea bueno para acompañar el arroz"

La fase Bootstrap transforma "quiero comer algo rico" en "plato picante de Sichuan sin cilantro".

### Estructura del documento de salida

La fase Bootstrap generará `input/idea.md`, que contiene los siguientes capítulos:

| Capítulo | Contenido | Ejemplo |
| --- | --- | --- |
| **Descripción breve** | Resumen del producto en 1-2 frases | "Una aplicación móvil de contabilidad que ayuda a los jóvenes a registrar rápidamente sus gastos diarios" |
| **Problema (Problem)** | El dolor central que experimentan los usuarios | "Los jóvenes descubren al final del mes que se han excedido del presupuesto, pero no saben en qué gastaron el dinero" |
| **Usuario objetivo (Target User)** | Per demográfico específico | "Jóvenes de 18-30 años recién incorporados al trabajo, con habilidades técnicas medias" |
| **Valor central (Core Value)** | Por qué tiene valor | "Contabilidad en 3 segundos, ahorrando un 80% del tiempo en comparación con la consulta manual" |
| **Hipótesis (Assumptions)** | 2-4 hipótesis verificables | "Los usuarios están dispuestos a dedicar 2 minutos a aprender la aplicación, si pueden controlar el presupuesto" |
| **No-objetivos (Non‑Goals)** | Qué no se hará explícitamente | "No se hará planificación de presupuesto ni asesoramiento financiero" |

## Sígueme paso a paso

### Paso 1: Prepara tu idea de producto

Antes de iniciar el pipeline, piensa bien en tu idea de producto. Puede ser una descripción completa o simplemente una idea básica.

**Ejemplo**:
```
Quiero hacer una aplicación de fitness que ayude a los principiantes a registrar sus entrenamientos, incluyendo tipo de ejercicio, duración, calorías, y también poder ver las estadísticas de la semana.
```

::: tip La idea puede ser muy básica
Incluso si es solo una frase, no importa. El Bootstrap Agent utilizará la habilidad superpowers:brainstorm para ayudarte a completar la información.
:::

### Paso 2: Inicia el pipeline en la fase Bootstrap

Ejecuta en el directorio del proyecto Factory:

```bash
# Iniciar el pipeline (si aún no está iniciado)
factory run

# O especificar directamente que comience desde bootstrap
factory run bootstrap
```

La CLI mostrará el estado actual y las fases disponibles.

### Paso 3: El asistente de IA lee la definición del Bootstrap Agent

El asistente de IA (como Claude Code) leerá automáticamente `agents/bootstrap.agent.md` para comprender sus responsabilidades y restricciones.

::: info Responsabilidades del Agent
El Bootstrap Agent solo puede:
- Leer la idea de producto proporcionada por el usuario en la conversación
- Escribir en `input/idea.md`

No puede:
- Leer otros archivos
- Escribir en otros directorios
- Crear nuevos requisitos
:::

### Paso 4: Uso obligatorio de la habilidad superpowers:brainstorm

Este es el paso clave de la fase Bootstrap. El asistente de IA **debe** llamar primero a la habilidad `superpowers:brainstorm`, incluso si crees que la información ya está completa.

**Función de la habilidad brainstorm**:
1. **Profundizar en la esencia del problema**: descubrir los puntos ciegos en tu descripción mediante preguntas estructuradas
2. **Clarificar el perfil del usuario objetivo**: ayudarte a pensar "a quién se lo vendes exactamente"
3. **Validar el valor central**: encontrar la diferenciación mediante la comparación con productos competidores
4. **Identificar hipótesis implícitas**: enumerar esas hipótesis que das por sentadas pero no has verificado
5. **Controlar el alcance del producto**: definir límites mediante los no-objetivos

**Qué hará el asistente de IA**:
- Llamar a la habilidad `superpowers:brainstorm`
- Proporcionar tu idea original
- Hacerte preguntas generadas por la habilidad
- Recopilar tus respuestas y perfeccionar la idea

::: danger Se rechazará si omites este paso
El planificador Sisyphus verificará si se utilizó la habilidad brainstorm. Si no es así, el producto generado por el Bootstrap Agent será rechazado y deberá reejecutarse.
:::

### Paso 5: Confirma el contenido de idea.md

Una vez que el Bootstrap Agent haya terminado, generará `input/idea.md`. Debes revisarlo cuidadosamente:

**Puntos de verificación ✅**:

1. ¿Está clara la **descripción breve**?
   - ✅ Incluye: qué se hace + para quién + qué problema se resuelve
   - ❌ Demasiado general: "una herramienta para mejorar la eficiencia"

2. ¿Es específica la **descripción del problema**?
   - ✅ Incluye: escenario + dificultad + resultado negativo
   - ❌ Vago: "la experiencia del usuario no es buena"

3. ¿Está claro el **usuario objetivo**?
   - ✅ Tiene un perfil específico (edad/profesión/habilidad técnica)
   - ❌ Vago: "todos"

4. ¿Es cuantificable el **valor central**?
   - ✅ Tiene beneficios específicos (ahorra un 80% del tiempo)
   - ❌ Vago: "mejora la eficiencia"

5. ¿Son **verificables las hipótesis**?
   - ✅ Pueden verificarse mediante investigación de usuarios
   - ❌ Juicio subjetivo: "a los usuarios les gustará"

6. ¿Son suficientes los **no-objetivos**?
   - ✅ Enumera al menos 3 funciones que no se harán
   - ❌ Faltan o son muy pocos

### Paso 6: Elige continuar, reintentar o pausar

Después de la confirmación, la CLI mostrará las opciones:

```bash
Selecciona una operación:
[1] Continuar (entrar en la fase PRD)
[2] Reintentar (regenerar idea.md)
[3] Pausar (continuar más tarde)
```

::: tip Se recomienda revisar primero en el editor de código
Antes de confirmar con el asistente de IA, abre primero `input/idea.md` en el editor de código y revisa palabra por palabra. Una vez que entres en la fase PRD, el costo de modificación será mayor.
:::

## Advertencias de errores comunes

### Error 1: Descripción de la idea demasiado vaga

**Ejemplo incorrecto**:
```
Quiero hacer una aplicación de fitness
```

**Consecuencia**: El Bootstrap Agent hará muchas preguntas a través de la habilidad brainstorm para completar la información.

**Recomendación**: Describe claramente desde el principio:
```
Quiero hacer una aplicación móvil de fitness que ayude a los principiantes a registrar sus entrenamientos, incluyendo tipo de ejercicio, duración, calorías, y también poder ver las estadísticas de la semana.
```

### Error 2: Incluir detalles de implementación técnica

**Ejemplo incorrecto**:
```
Espero usar React Native para el frontend, Express para el backend, Prisma para la base de datos...
```

**Consecuencia**: El Bootstrap Agent rechazará este contenido (solo recopila ideas de producto, el stack tecnológico se decide en la fase Tech).

**Recomendación**: Solo di "qué hacer", no "cómo hacerlo".

### Error 3: Descripción del usuario objetivo demasiado general

**Ejemplo incorrecto**:
```
Todas las personas que necesitan hacer ejercicio
```

**Consecuencia**: Las fases posteriores no podrán determinar una dirección de diseño clara.

**Recomendación**: Define claramente el perfil:
```
Principiantes de fitness de 18-30 años, recién comenzando el entrenamiento sistemático, con habilidades técnicas medias, que desean registrar y ver estadísticas de manera sencilla.
```

### Error 4: No-objetivos faltantes o insuficientes

**Ejemplo incorrecto**:
```
No-objetivos: ninguno
```

**Consecuencia**: Las fases posteriores de PRD y Code pueden sobre-diseñar, aumentando la complejidad técnica.

**Recomendación**: Enumera al menos 3 elementos:
```
No-objetivos:
- Funciones de colaboración en equipo y social (MVP se enfoca en el individuo)
- Análisis complejo de datos e informes
- Integración con dispositivos de fitness de terceros
```

### Error 5: Hipótesis no verificables

**Ejemplo incorrecto**:
```
Hipótesis: a los usuarios les gustará nuestro diseño
```

**Consecuencia**: No se puede verificar mediante investigación de usuarios, el MVP puede fallar.

**Recomendación**: Escribe hipótesis verificables:
```
Hipótesis: los usuarios están dispuestos a dedicar 5 minutos a aprender la aplicación, si puede ayudar a registrar sistemáticamente los entrenamientos.
```

## Resumen de esta lección

El núcleo de la fase Bootstrap es la **estructuración**:

1. **Entrada**: tu idea de producto vaga
2. **Proceso**: el asistente de IA profundiza mediante la habilidad superpowers:brainstorm
3. **Salida**: `input/idea.md` que cumple con la plantilla estándar
4. **Verificación**: verificar si la descripción es específica, el usuario está claro, el valor es cuantificable

::: tip Principio clave
- ❌ Qué no hacer: no crear requisitos, no diseñar funciones, no decidir el stack tecnológico
- ✅ Qué sí hacer: recopilar información, organizarla, presentarla según la plantilla
:::

## Avance de la próxima lección

> En la próxima lección aprenderemos **[Fase 2: PRD - Generación del Documento de Requisitos del Producto](../stage-prd/)**.
>
> Aprenderás:
> - Cómo transformar idea.md en un PRD de nivel MVP
> - Qué contiene el PRD (historias de usuario, lista de funciones, requisitos no funcionales)
> - Cómo definir el alcance y prioridades del MVP
> - Por qué el PRD no puede contener detalles técnicos

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-29

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Definición del Bootstrap Agent | [`agents/bootstrap.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/bootstrap.agent.md) | 1-93 |
| Bootstrap Skill | [`skills/bootstrap/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/bootstrap/skill.md) | 1-433 |
| Definición del pipeline (fase Bootstrap) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 8-18 |
| Definición del planificador | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Restricciones clave**:
- **Uso obligatorio de la habilidad brainstorm**: bootstrap.agent.md:70-71
- **Prohibido incluir detalles técnicos**: bootstrap.agent.md:47
- **Prohibido fusionar múltiples ideas**: bootstrap.agent.md:48
- **El archivo de salida debe guardarse en input/idea.md**: bootstrap.agent.md:50

**Condiciones de salida** (pipeline.yaml:15-18):
- idea.md existe
- idea.md describe una idea de producto coherente
- El Agent ha utilizado la habilidad `superpowers:brainstorm` para profundizar

**Marco de contenido de Skill**:
- **Marco de pensamiento**: extracción vs creación, prioridad del problema, concreción, verificación de hipótesis
- **Plantilla de preguntas**: sobre el problema, usuario objetivo, valor central, hipótesis del MVP, no-objetivos
- **Técnicas de extracción de información**: retroceder del problema desde la función, extraer requisitos de las quejas, identificar hipótesis implícitas
- **Lista de verificación de calidad**: integridad, especificidad, consistencia, elementos prohibidos
- **Principios de decisión**: priorizar preguntas, orientación al problema, lo concreto es mejor que lo abstracto, verificabilidad, control de alcance
- **Manejo de escenarios comunes**: el usuario solo proporciona una frase, describe muchas funciones, describe productos competidores, ideas contradictorias
- **Ejemplos comparativos**: idea.md deficiente vs idea.md buena

</details>
