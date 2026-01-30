---
title: "Contextos Dinámicos: Inyección de Contexts | Everything Claude Code"
sidebarTitle: "Contextos Dinámicos"
subtitle: "Contextos Dinámicos: Inyección de Contexts"
description: "Aprende el mecanismo de inyección de contextos dinámicos en Claude Code. Domina el cambio entre los tres modos: dev, review y research para optimizar el comportamiento de la IA según el escenario y mejorar tu productividad."
tags:
  - "contexts"
  - "workflow-optimization"
  - "dynamic-prompts"
prerequisite:
  - "start-quick-start"
order: 140
---

# Inyección de Contextos Dinámicos: Uso de Contexts

## Lo que aprenderás

Después de dominar la inyección de contextos dinámicos, podrás:

- Cambiar la estrategia de comportamiento de la IA según tu modo de trabajo actual (desarrollo, revisión, investigación)
- Hacer que Claude siga diferentes prioridades y preferencias de herramientas en distintos escenarios
- Evitar confundir objetivos de trabajo en la misma sesión, mejorando la concentración
- Optimizar la eficiencia en diferentes fases (implementación rápida vs revisión profunda)

## Tu situación actual

¿Te has encontrado con estos problemas durante el desarrollo?

- **Cuando quieres desarrollar rápido**, Claude analiza demasiado y da demasiadas sugerencias, ralentizando el progreso
- **Durante la revisión de código**, Claude se apresura a modificar el código en lugar de leer cuidadosamente y encontrar problemas
- **Al investigar nuevos problemas**, Claude quiere escribir código sin entender bien, llevando a direcciones equivocadas
- **En la misma sesión**, alternas entre desarrollo y revisión, y el comportamiento de Claude se vuelve caótico

La raíz de estos problemas es: **Claude no tiene una señal clara de "modo de trabajo"**, no sabe qué debería priorizar en cada momento.

## Cuándo usar esta técnica

- **Fase de desarrollo**: Haz que la IA priorice implementar funcionalidades antes de discutir detalles
- **Revisión de código**: Haz que la IA entienda completamente antes de proponer mejoras
- **Investigación técnica**: Haz que la IA explore y aprenda antes de dar conclusiones
- **Al cambiar de modo de trabajo**: Indica claramente a la IA cuál es el objetivo actual

## Concepto central

El núcleo de la inyección de contextos dinámicos es **hacer que la IA tenga diferentes estrategias de comportamiento en diferentes modos de trabajo**.

### Tres modos de trabajo

Everything Claude Code proporciona tres contextos predefinidos:

| Modo | Archivo | Enfoque | Prioridad | Escenario de uso |
| --- | --- | --- | --- | --- |
| **dev** | `contexts/dev.md` | Implementar funcionalidades, iterar rápido | Primero que funcione, luego perfeccionar | Desarrollo diario, nuevas funcionalidades |
| **review** | `contexts/review.md` | Calidad del código, seguridad, mantenibilidad | Primero encontrar problemas, luego sugerir correcciones | Code Review, revisión de PR |
| **research** | `contexts/research.md` | Entender el problema, explorar soluciones | Primero entender, luego actuar | Investigación técnica, análisis de bugs, diseño de arquitectura |

### ¿Por qué necesitas contextos dinámicos?

::: info Contexto vs Prompt del sistema

El **prompt del sistema** son instrucciones fijas que se cargan al iniciar Claude Code (como el contenido en los directorios `agents/` y `rules/`), define el comportamiento base de la IA.

El **contexto** son instrucciones temporales que inyectas dinámicamente según tu modo de trabajo actual, sobrescribe o complementa el prompt del sistema, haciendo que la IA cambie su comportamiento en escenarios específicos.

El prompt del sistema es el "valor predeterminado global", el contexto es la "sobrescritura por escenario".
:::

### Comparación de modos de trabajo

La misma tarea, diferente comportamiento de la IA en diferentes modos:

```markdown
### Tarea: Corregir un bug que causa fallo en el login

#### Modo dev (corrección rápida)
- Localizar el problema rápidamente
- Modificar el código directamente
- Ejecutar tests para verificar
- Primero que funcione, luego optimizar

### Modo review (análisis profundo)
- Leer completamente el código relacionado
- Verificar casos límite y manejo de errores
- Evaluar el impacto de la solución propuesta
- Primero encontrar problemas, luego sugerir correcciones

### Modo research (investigación exhaustiva)
- Explorar todas las causas posibles
- Analizar logs y mensajes de error
- Verificar hipótesis
- Primero entender la causa raíz, luego proponer solución
```

## 🎒 Antes de empezar

::: warning Requisitos previos

Este tutorial asume que ya has:

- ✅ Completado el tutorial de [Inicio Rápido](../../start/quickstart/)
- ✅ Instalado el plugin Everything Claude Code
- ✅ Entendido los conceptos básicos de gestión de sesiones

:::

---

## Sigue los pasos: Usando contextos dinámicos

### Paso 1: Entender cómo funcionan los tres contextos

Primero, familiarízate con la definición de cada contexto:

#### dev.md - Modo desarrollo

**Objetivo**: Implementar funcionalidades rápidamente, primero que funcione y luego perfeccionar

**Prioridades**:
1. Get it working (Que funcione)
2. Get it right (Que sea correcto)
3. Get it clean (Que sea limpio)

**Estrategia de comportamiento**:
- Write code first, explain after (Primero escribir código, luego explicar)
- Prefer working solutions over perfect solutions (Preferir soluciones funcionales sobre perfectas)
- Run tests after changes (Ejecutar tests después de cambios)
- Keep commits atomic (Mantener commits atómicos)

**Preferencia de herramientas**: Edit, Write (modificación de código), Bash (ejecutar tests/build), Grep/Glob (buscar código)

---

#### review.md - Modo revisión

**Objetivo**: Encontrar problemas de calidad de código, vulnerabilidades de seguridad y problemas de mantenibilidad

**Prioridades**: Critical (Crítico) > High (Alto) > Medium (Medio) > Low (Bajo)

**Estrategia de comportamiento**:
- Read thoroughly before commenting (Leer completamente antes de comentar)
- Prioritize issues by severity (Priorizar problemas por severidad)
- Suggest fixes, don't just point out problems (Sugerir correcciones, no solo señalar problemas)
- Check for security vulnerabilities (Verificar vulnerabilidades de seguridad)

**Lista de verificación**:
- [ ] Logic errors (Errores de lógica)
- [ ] Edge cases (Casos límite)
- [ ] Error handling (Manejo de errores)
- [ ] Security (injection, auth, secrets) (Seguridad)
- [ ] Performance (Rendimiento)
- [ ] Readability (Legibilidad)
- [ ] Test coverage (Cobertura de tests)

**Formato de salida**: Agrupado por archivo, priorizado por severidad

---

#### research.md - Modo investigación

**Objetivo**: Entender profundamente el problema, explorar posibles soluciones

**Proceso de investigación**:
1. Understand the question (Entender la pregunta)
2. Explore relevant code/docs (Explorar código/documentación relevante)
3. Form hypothesis (Formular hipótesis)
4. Verify with evidence (Verificar con evidencia)
5. Summarize findings (Resumir hallazgos)

**Estrategia de comportamiento**:
- Read widely before concluding (Leer ampliamente antes de concluir)
- Ask clarifying questions (Hacer preguntas de clarificación)
- Document findings as you go (Documentar hallazgos sobre la marcha)
- Don't write code until understanding is clear (No escribir código hasta tener claridad)

**Preferencia de herramientas**: Read (entender código), Grep/Glob (buscar patrones), WebSearch/WebFetch (documentación externa), Task with Explore agent (preguntas sobre el codebase)

**Formato de salida**: Primero hallazgos, luego recomendaciones

---

### Paso 2: Seleccionar y aplicar un contexto

Según tu escenario de trabajo actual, selecciona el contexto apropiado.

#### Escenario 1: Implementar una nueva funcionalidad

**Contexto aplicable**: `dev.md`

**Cómo aplicarlo**:

```markdown
@contexts/dev.md

Por favor, ayúdame a implementar la funcionalidad de autenticación de usuarios:
1. Soporte para login con email y contraseña
2. Generar token JWT
3. Implementar middleware para proteger rutas
```

**Cómo se comportará Claude**:
- Implementar la funcionalidad principal rápidamente
- No sobre-diseñar
- Ejecutar tests para verificar después de implementar
- Mantener commits atómicos (cada commit completa una pequeña funcionalidad)

**Lo que deberías ver**:
- Código funcional rápidamente
- Tests pasando
- Funcionalidad operativa, quizás no muy elegante

---

#### Escenario 2: Revisar el PR de un colega

**Contexto aplicable**: `review.md`

**Cómo aplicarlo**:

```markdown
@contexts/review.md

Por favor, revisa este PR: https://github.com/your-repo/pull/123

Enfócate en:
- Seguridad (inyección SQL, XSS, autenticación)
- Manejo de errores
- Problemas de rendimiento
```

**Cómo se comportará Claude**:
- Primero leer completamente todo el código relacionado
- Ordenar problemas por severidad
- Proporcionar sugerencias de corrección para cada problema
- No modificar código directamente, solo dar sugerencias

**Lo que deberías ver**:
- Informe de revisión estructurado (por archivo, por severidad)
- Cada problema con ubicación específica y sugerencia de corrección
- Problemas de nivel Critical marcados prioritariamente

---

#### Escenario 3: Investigar la integración de una nueva tecnología

**Contexto aplicable**: `research.md`

**Cómo aplicarlo**:

```markdown
@contexts/research.md

Quiero integrar ClickHouse como base de datos analítica en el proyecto, por favor investiga:

1. Ventajas y desventajas de ClickHouse
2. Cómo se integra con nuestra arquitectura PostgreSQL existente
3. Estrategia de migración y riesgos
4. Resultados de benchmarks de rendimiento

No escribas código, primero investiga bien la solución.
```

**Cómo se comportará Claude**:
- Primero buscar documentación oficial y mejores prácticas de ClickHouse
- Leer casos de migración relacionados
- Analizar compatibilidad con la arquitectura existente
- Documentar hallazgos mientras explora
- Finalmente dar recomendaciones integrales

**Lo que deberías ver**:
- Análisis técnico comparativo detallado
- Evaluación de riesgos y recomendaciones de migración
- Sin código, solo soluciones y conclusiones

---

### Paso 3: Cambiar contextos en la misma sesión

Puedes cambiar dinámicamente de contexto en la misma sesión, adaptándote a diferentes fases de trabajo.

**Ejemplo: Flujo de trabajo desarrollo + revisión**

```markdown
#### Paso 1: Implementar funcionalidad (modo dev)
@contexts/dev.md
Por favor, implementa la funcionalidad de login de usuario con autenticación por email y contraseña.
...
#### Claude implementa la funcionalidad rápidamente

#### Paso 2: Auto-revisión (modo review)
@contexts/review.md
Por favor, revisa el código de login que acabamos de implementar:
...
#### Claude cambia a modo revisión, analiza profundamente la calidad del código
#### Lista problemas y sugerencias de mejora por severidad

#### Paso 3: Mejorar según la revisión (modo dev)
@contexts/dev.md
Según los comentarios de la revisión anterior, corrige los problemas de nivel Critical y High.
...
#### Claude corrige los problemas rápidamente

#### Paso 4: Revisar de nuevo (modo review)
@contexts/review.md
Revisa nuevamente el código corregido.
...
#### Claude verifica si los problemas están resueltos
```

**Lo que deberías ver**:
- Enfoque claro en cada fase
- Iteración rápida en fase de desarrollo
- Análisis profundo en fase de revisión
- Evitar conflictos de comportamiento en el mismo modo

---

### Paso 4: Crear contextos personalizados (opcional)

Si los tres modos predefinidos no satisfacen tus necesidades, puedes crear contextos personalizados.

**Formato del archivo de contexto**:

```markdown
#### My Custom Context

Mode: [Nombre del modo]
Focus: [Enfoque]

## Behavior
- Regla de comportamiento 1
- Regla de comportamiento 2

## Priorities
1. Prioridad 1
2. Prioridad 2

## Tools to favor
- Herramientas recomendadas
```

**Ejemplo: `debug.md` - Modo depuración**

```markdown
#### Debug Context

Mode: Debugging and troubleshooting
Focus: Root cause analysis and fix

## Behavior
- Start by gathering evidence (logs, error messages, stack traces)
- Form hypothesis before proposing fixes
- Test fixes systematically (control variables)
- Document findings for future reference

## Debug Process
1. Reproduce the issue consistently
2. Gather diagnostic information
3. Narrow down potential causes
4. Test hypotheses
5. Verify the fix works

## Tools to favor
- Read for code inspection
- Bash for running tests and checking logs
- Grep for searching error patterns
```

**Usar el contexto personalizado**:

```markdown
@contexts/debug.md

Encontré este problema en producción:
[Mensaje de error]
[Logs relacionados]

Por favor, ayúdame a depurar.
```

---

## Punto de verificación ✅

Después de completar los pasos anteriores, deberías:

- [ ] Entender cómo funcionan los tres contextos predefinidos y sus escenarios de uso
- [ ] Poder seleccionar el contexto apropiado según el escenario de trabajo
- [ ] Saber cambiar dinámicamente de contexto en una sesión
- [ ] Saber cómo crear contextos personalizados
- [ ] Experimentar la diferencia notable en el comportamiento de la IA con diferentes contextos

---

## Errores comunes a evitar

### ❌ Error 1: No cambiar de contexto y esperar que la IA se adapte automáticamente

**Problema**: En la misma sesión, alternas entre desarrollo y revisión sin indicar a la IA el objetivo actual.

**Síntoma**: El comportamiento de Claude es caótico, a veces analiza demasiado, a veces modifica código apresuradamente.

**Solución correcta**:
- Cambiar explícitamente de contexto: `@contexts/dev.md` o `@contexts/review.md`
- Declarar el objetivo actual al inicio de cada fase
- Usar `## Paso X: [Objetivo]` para marcar claramente las fases

---

### ❌ Error 2: Usar modo research para desarrollo rápido

**Problema**: Necesitas implementar una funcionalidad en 30 minutos, pero usas `@contexts/research.md`.

**Síntoma**: Claude pasa mucho tiempo investigando, discutiendo, analizando, y tarda en escribir código.

**Solución correcta**:
- Desarrollo rápido usa modo `dev`
- Investigación profunda usa modo `research`
- Selecciona el modo según la presión de tiempo y complejidad de la tarea

---

### ❌ Error 3: Usar modo dev para revisar código crítico

**Problema**: Revisas código crítico relacionado con seguridad, dinero o privacidad, pero usas `@contexts/dev.md`.

**Síntoma**: Claude hace una revisión superficial y puede pasar por alto vulnerabilidades de seguridad graves.

**Solución correcta**:
- La revisión de código crítico debe usar modo `review`
- La revisión de PR normales usa modo `review`
- Solo usa modo `dev` para iteración rápida personal

---

## Resumen de la lección

La inyección de contextos dinámicos optimiza la estrategia de comportamiento de la IA al indicar claramente el modo de trabajo actual:

**Tres modos predefinidos**:
- **dev**: Implementación rápida, primero que funcione y luego perfeccionar
- **review**: Revisión profunda, encontrar problemas y sugerir correcciones
- **research**: Investigación completa, entender antes de concluir

**Puntos clave de uso**:
1. Cambiar de contexto según la fase de trabajo
2. Usar `@contexts/xxx.md` para cargar explícitamente el contexto
3. Puedes cambiar múltiples veces en la misma sesión
4. Puedes crear contextos personalizados para necesidades específicas

**Valor principal**: Evitar comportamiento caótico de la IA, mejorar la concentración y eficiencia en diferentes fases.

---

## Próxima lección

> En la próxima lección aprenderemos **[Referencia completa de configuración: settings.json](../../appendix/config-reference/)**.
>
> Aprenderás:
> - Todas las opciones de configuración de settings.json
> - Cómo personalizar la configuración de Hooks
> - Estrategias para habilitar y deshabilitar servidores MCP
> - Prioridad entre configuración a nivel de proyecto y global

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-25

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Definición del contexto dev | [`contexts/dev.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/dev.md) | 1-21 |
| Definición del contexto review | [`contexts/review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/review.md) | 1-23 |
| Definición del contexto research | [`contexts/research.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/research.md) | 1-27 |

**Archivos de contexto clave**:
- `dev.md`: Contexto de modo desarrollo, prioriza implementación rápida de funcionalidades
- `review.md`: Contexto de modo revisión, prioriza encontrar problemas de calidad de código
- `research.md`: Contexto de modo investigación, prioriza entender profundamente el problema

</details>
