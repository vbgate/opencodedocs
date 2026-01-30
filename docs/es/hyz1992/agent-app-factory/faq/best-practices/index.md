---
title: "AI App Factory: Guía de Mejores Prácticas - Descripción del Producto, Checkpoints, Alcance e Iteración | Tutorial"
sidebarTitle: "Mejores Prácticas"
subtitle: "Mejores Prácticas: Descripciones Claras, Uso de Checkpoints, Control de Alcance y Técnicas de Iteración"
description: "Domina las mejores prácticas de AI App Factory para mejorar la calidad y eficiencia de las aplicaciones generadas por IA. Aprende a escribir descripciones de productos claras, utilizar checkpoints para controlar la calidad, definir objetivos negativos para evitar el alcance excesivo, validar ideas mediante iteración gradual, ahorrar tokens con sesiones separadas y gestionar fallos y reintentos. Este tutorial cubre seis técnicas: calidad de entrada, confirmación de checkpoints, control de MVP, desarrollo iterativo, optimización de contexto y gestión de fallos."
tags:
  - "Mejores Prácticas"
  - "MVP"
  - "Desarrollo Iterativo"
prerequisite:
  - "start-getting-started"
  - "start-pipeline-overview"
order: 200
---

# Mejores Prácticas: Descripciones Claras, Uso de Checkpoints, Control de Alcance y Técnicas de Iteración

## Qué Podrás Hacer Después de Este Curso

Al completar este curso, dominarás:
- Cómo escribir descripciones de productos de alta calidad para que la IA entienda tus ideas
- Cómo utilizar el mecanismo de checkpoints para controlar la calidad de salida de cada etapa
- Cómo establecer límites de alcance mediante objetivos negativos para evitar la expansión del proyecto
- Cómo validar ideas rápidamente mediante iteración gradual y optimización continua

## Tu Dilema Actual

¿Te encuentras en alguna de estas situaciones?
- "Lo expliqué muy claramente, ¿por qué lo generado no es lo que quería?"
- "Un detalle incorrecto hace que todo lo demás esté mal, corregirlo es muy doloroso"
- "Durante el desarrollo, las funciones se acumulan y es imposible finalizar"
- "Quise hacer todas las funciones a la vez, pero al final no hice nada"

## Cuándo Utilizar Estas Técnicas

Ya sea que sea tu primera vez usando AI App Factory o que ya tengas experiencia, estas mejores prácticas te ayudarán a:
- **Mejorar la calidad de salida**: que las aplicaciones generadas cumplan con tus expectativas
- **Ahorrar tiempo de modificación**: evitar la acumulación de errores, detectar problemas temprano
- **Controlar el tamaño del proyecto**: enfocarse en el MVP y entregar rápidamente
- **Reducir los costos de desarrollo**: validar por etapas para evitar inversiones ineficaces

## 🎒 Preparativos Previos

::: warning Requisitos Previos
- Lee la [Introducción Rápida](../../start/getting-started/) para entender los conceptos básicos de AI App Factory
- Lee la [Visión General de la Línea de 7 Etapas](../../start/pipeline-overview/) para comprender el proceso completo
- Has completado al menos una ejecución completa de la línea (para tener una percepción intuitiva de la salida de cada etapa)
:::

## Ideas Clave

Las mejores prácticas de AI App Factory giran en torno a cuatro principios fundamentales:

1. **La calidad de entrada determina la calidad de salida**: una descripción de producto clara y detallada es el primer paso para el éxito
2. **Los checkpoints son líneas de defensa de calidad**: confirma cuidadosamente después de cada etapa para evitar la acumulación de errores
3. **Enfoque MVP**: define objetivos negativos, controla el alcance y entrega rápidamente las funciones principales
4. **Iteración continua**: valida primero la idea central y luego expande las funciones gradualmente

Estos principios provienen de la síntesis del código fuente y la experiencia práctica; seguirlos puede multiplicar tu eficiencia de desarrollo por varias veces.

## Sigue los Pasos

### Técnica 1: Proporcionar una Descripción Clara del Producto

#### Por Qué

Cuando la IA entiende tu idea, solo puede depender de la información textual que proporcionas. Cuanto más clara sea la descripción, más se ajustará el resultado generado a tus expectativas.

#### Cómo Hacerlo

**Una buena descripción de producto incluye los siguientes elementos**:
- **Usuarios objetivo**: ¿quién usará este producto?
- **Problema central**: ¿qué dificultades enfrentan los usuarios?
- **Solución**: ¿cómo resuelve el producto esta dificultad?
- **Funciones clave**: ¿qué funciones deben incluirse?
- **Escenarios de uso**: ¿en qué situaciones lo usarán los usuarios?
- **Condiciones de restricción**: ¿qué limitaciones o requisitos especiales hay?

#### Ejemplos Comparativos

| ❌ Mala Descripción | ✅ Buena Descripción |
| --- | --- |
| Haz una app de fitness | Aplicación para ayudar a principiantes en fitness a registrar entrenamientos, admite registro de tipo de ejercicio, duración, calorías quemadas y visualización de estadísticas de entrenamiento semanal. Los usuarios objetivo son jóvenes que comienzan en fitness, las funciones principales son registro rápido y visualización del progreso, no incluye compartir en redes sociales ni funciones de pago |
| Haz una app de contabilidad | Aplicación móvil de contabilidad para ayudar a jóvenes a registrar gastos diarios, las funciones principales son registrar importe, seleccionar categoría (alimentación, transporte, entretenimiento, otros), ver gasto total del mes y estadísticas por categoría. Admite uso sin conexión, los datos se guardan solo localmente |
| Haz una herramienta de gestión de tareas | Herramienta simple para ayudar a equipos pequeños a gestionar tareas, admite crear tareas, asignar miembros, establecer fechas de vencimiento y ver lista de tareas. Los miembros del equipo pueden compartir el estado de tareas. No necesita flujos de trabajo complejos ni gestión de permisos |

#### Checklist de Verificación ✅

- [ ] La descripción identifica claramente a los usuarios objetivo
- [ ] La descripción explica el problema central que enfrentan los usuarios
- [ ] La descripción enumera las funciones clave (no más de 5)
- [ ] La descripción incluye condiciones de restricción u objetivos negativos

---

### Técnica 2: Confirmar Cuidadosamente en los Checkpoints

#### Por Qué

Después de cada etapa de la línea, se pausa en un checkpoint esperando tu confirmación. Esta es una **línea de defensa de calidad** que te permite detectar problemas temprano y evitar que los errores se propaguen a etapas posteriores.

Si detectas un problema en esta etapa, solo necesitas volver a ejecutar la etapa actual; si esperas hasta el final para descubrirlo, es posible que necesites revertir múltiples etapas, desperdiciando mucho tiempo y tokens.

#### Cómo Hacerlo

**Al confirmar cada checkpoint, verifica lo siguiente**:

**Checkpoint de Bootstrap**:
- [ ] La definición del problema en `input/idea.md` es precisa
- [ ] El perfil de usuarios objetivo es claro y específico
- [ ] La propuesta de valor central es clara
- [ ] Las condiciones de suposición son razonables

**Checkpoint de PRD**:
- [ ] Las historias de usuario son claras e incluyen criterios de aceptación
- [ ] La lista de funciones no supera las 7 (principio MVP)
- [ ] Se enumeran claramente los objetivos negativos (Non-Goals)
- [ ] No contiene detalles técnicos (como React, API, base de datos)

**Checkpoint de UI**:
- [ ] La estructura de páginas es razonable, no más de 3 páginas
- [ ] Se puede previsualizar el prototipo en el navegador
- [ ] El flujo de interacción es claro
- [ ] El estilo estético es distintivo (evitar el estilo común de IA)

**Checkpoint de Tech**:
- [ ] La selección del stack tecnológico es razonable y cumple el principio MVP
- [ ] El diseño del modelo de datos es simple, no más de 10 tablas
- [ ] La lista de endpoints API está completa
- [ ] No introduce microservicios, caché u otros diseños excesivos

**Checkpoint de Code**:
- [ ] La estructura del código frontend y backend está completa
- [ ] Incluye casos de prueba
- [ ] No hay tipos `any` obvios
- [ ] Incluye README.md explicando cómo ejecutar

**Checkpoint de Validation**:
- [ ] El informe de validación no tiene problemas graves de seguridad
- [ ] Cobertura de pruebas > 60%
- [ ] La instalación de dependencias no tiene conflictos
- [ ] La verificación de tipos TypeScript pasa

**Checkpoint de Preview**:
- [ ] README.md incluye instrucciones completas de ejecución
- [ ] La configuración Docker puede construirse normalmente
- [ ] Se pueden iniciar los servicios frontend y backend localmente
- [ ] Incluye instrucciones de configuración de variables de entorno

#### Flujo de Confirmación de Checkpoint

En cada checkpoint, el sistema proporcionará las siguientes opciones:
- **Continuar**: si la salida cumple con las expectativas, continuar a la siguiente etapa
- **Reintentar**: si la salida tiene problemas, proporcionar sugerencias de modificación y volver a ejecutar la etapa actual
- **Pausar**: si necesitas más información o quieres ajustar la idea, pausar la línea

**Principios de decisión**:
- ✅ **Continuar**: todos los elementos de verificación cumplen los requisitos
- ⚠️ **Reintentar**: problemas menores (formato, omisiones, detalles) que pueden corregirse inmediatamente
- 🛑 **Pausar**: problemas graves (dirección incorrecta, alcance descontrolado, no corregibles) que requieren replanificación

#### Advertencia de Errores Comunes

::: danger Error Común
**¡No saltes la confirmación de checkpoints para "terminar rápido"!**

La línea está diseñada como "pausar y confirmar en cada etapa" precisamente para que detectes problemas a tiempo. Si acostumbras hacer clic en "continuar" y descubres el problema al final, es posible que necesites:
- Revertir múltiples etapas
- Reejecutar mucho trabajo
- Desperdiciar muchos tokens

Recuerda: **el tiempo invertido en confirmar checkpoints es mucho menor que el costo de revertir y rehacer**.
:::

---

### Técnica 3: Utilizar Objetivos Negativos para Controlar el Alcance

#### Por Qué

**Los objetivos negativos (Non-Goals) son el arma central del desarrollo MVP**. Enumerar claramente "qué no hacer" puede prevenir eficazmente la expansión del alcance.

Muchos proyectos fallan no por tener pocas funciones, sino por tener demasiadas. Cada nueva función aumenta la complejidad, el tiempo de desarrollo y los costos de mantenimiento. Establecer límites claros y enfocarse en el valor central permite entregar rápidamente.

#### Cómo Hacerlo

**En la etapa Bootstrap, enumera claramente los objetivos negativos**:

```markdown
## Objetivos Negativos (Funciones no incluidas en esta versión)

1. No admite colaboración multiusuario
2. No admite sincronización en tiempo real
3. No admite integración con servicios de terceros (como pagos, mapas)
4. No proporciona funciones de análisis de datos o reportes
5. No incluye funciones para compartir en redes sociales
6. No requiere autenticación de usuario o funciones de inicio de sesión
```

**En la etapa PRD, incluye los objetivos negativos como sección independiente**:

```markdown
## Objetivos Negativos (Definitivamente no incluidos en esta versión)

Las siguientes funciones tienen valor, pero no están dentro del alcance de este MVP:

| Función | Razón | Plan Futuro |
| --- | --- | --- |
| Colaboración multiusuario | Enfocado en usuarios individuales | Considerar en v2.0 |
| Sincronización en tiempo real | Aumenta complejidad técnica | Considerar si hay fuerte feedback de usuarios |
| Integración de pagos | No es valor central | Considerar en v1.5 |
| Análisis de datos | MVP no lo necesita | Considerar en v2.0 |
```

#### Criterios para Determinar Objetivos Negativos

**Cómo determinar si algo debe ser un objetivo negativo**:
- ❌ Esta función no es necesaria para validar la idea central → como objetivo negativo
- ❌ Esta función aumenta significativamente la complejidad técnica → como objetivo negativo
- ❌ Esta función puede sustituirse manualmente → como objetivo negativo
- ✅ Esta función es la razón de ser del producto → debe incluirse

#### Advertencia de Trampa de Expansión de Alcance

::: warning Trampa de Expansión de Alcance
**Señales comunes de expansión de alcance**:

1. "Es muy simple, agregue uno más de paso..."
2. "Los competidores tienen esta función, nosotros también..."
3. "Los usuarios podrían necesitarlo, mejor hacerlo primero..."
4. "Esta función es interesante, puede mejorar el punto destacado del producto..."

**Cuando te encuentres con estas ideas, pregúntate tres cosas**:
1. ¿Esta función ayuda a validar la idea central?
2. ¿Sin esta función, el producto sigue siendo utilizable?
3. ¿Agregar esta función retrasará el tiempo de entrega?

Si la respuesta es "no necesario", "sí puede usarse", "retrasará", entonces clasifícalo como objetivo negativo.
:::

---

### Técnica 4: Iterar Gradualmente, Validar Rápidamente

#### Por Qué

**La idea central del MVP (Producto Mínimo Viable) es validar ideas rápidamente**, no hacerlo perfecto de una sola vez.

Mediante el desarrollo iterativo, puedes:
- Obtener feedback de usuarios temprano
- Ajustar el dirección a tiempo
- Reducir los costos hundidos
- Mantener el impulso de desarrollo

#### Cómo Hacerlo

**Pasos del desarrollo iterativo**:

**Primera ronda: Validación de funciones centrales**
1. Usa AI App Factory para generar la primera versión de la aplicación
2. Incluye solo las 3-5 funciones principales
3. Ejecuta y prueba rápidamente
4. Muestra el prototipo a usuarios reales y recopila feedback

**Segunda ronda: Optimización basada en feedback**
1. Según el feedback de usuarios, determina los puntos de mejora de mayor prioridad
2. Modifica `input/idea.md` o `artifacts/prd/prd.md`
3. Usa `factory run <stage>` para reejecutar desde la etapa correspondiente
4. Genera nueva versión y prueba

**Tercera ronda: Expansión de funciones**
1. Evalúa si se han alcanzado los objetivos centrales
2. Selecciona 2-3 funciones de alto valor
3. Genera e integra a través de la línea
4. Itera continuamente, mejora gradualmente

#### Ejemplo Práctico de Iteración

**Escenario**: quieres hacer una aplicación de gestión de tareas

**Primera ronda MVP**:
- Funciones centrales: crear tarea, ver lista, marcar completada
- Objetivos negativos: gestión de miembros, control de permisos, notificaciones de recordatorio
- Tiempo de entrega: 1 día

**Segunda ronda optimización** (basada en feedback):
- Feedback de usuarios: quieren añadir etiquetas a tareas
- Modificar PRD, añadir función de "clasificación por etiquetas"
- Reejecutar la línea desde la etapa UI
- Tiempo de entrega: medio día

**Tercera ronda expansión** (después de validación exitosa):
- Añadir función de gestión de miembros
- Añadir recordatorios de fecha de vencimiento
- Añadir función de comentarios en tareas
- Tiempo de entrega: 2 días

#### Checklist de Verificación ✅

Antes de cada iteración, verifica:
- [ ] La nueva función es consistente con el objetivo central
- [ ] La nueva función tiene respaldo de demanda de usuarios
- [ ] La nueva función aumentará significativamente la complejidad
- [ ] Hay criterios de aceptación claros

---

## Técnicas Avanzadas

### Técnica 5: Utilizar Sesiones Separadas para Ahorrar Tokens

#### Por Qué

Ejecutar la línea durante mucho tiempo provoca acumulación de contexto, consumiendo muchos tokens. **Ejecución con sesiones separadas** permite que cada etapa disfrute de un contexto limpio, reduciendo significativamente los costos de uso.

#### Cómo Hacerlo

**En cada checkpoint, elige "continuar en nueva sesión"**:

```bash
# Ejecutar en nueva ventana de línea de comandos
factory continue
```

El sistema automáticamente:
1. Lee `.factory/state.json` para restaurar el estado
2. Inicia nueva ventana de Claude Code
3. Continúa desde la siguiente etapa pendiente de ejecución
4. Solo carga los archivos de entrada necesarios para esa etapa

**Comparación**:

| Método | Ventajas | Desventajas |
| --- | --- | --- |
| Continuar en misma sesión | Simple, no hay que cambiar ventana | Contexto acumulado, gran consumo de tokens |
| Continuar en nueva sesión | Cada etapa disfruta de contexto limpio, ahorra tokens | Necesita cambiar de ventana |

::: tip Práctica Recomendada
**Para proyectos grandes o con presupuesto de tokens limitado, se recomienda encarecidamente usar "continuar en nueva sesión"**.

Para más detalles, consulta el tutorial [Optimización de Contexto](../../advanced/context-optimization/).
:::

---

### Técnica 6: Gestionar Fallos y Reintentos

#### Por Qué

Durante la ejecución de la línea pueden encontrarse fallos (entrada insuficiente, problemas de permisos, errores de código, etc.). Entender cómo manejar fallos te permite recuperar el progreso más rápidamente.

#### Cómo Hacerlo

**Mejores prácticas de manejo de fallos** (referencia `failure.policy.md:267-274`):

1. **Fallo temprano**: detectar problemas temprano para evitar desperdiciar tiempo en etapas posteriores
2. **Registros detallados**: registrar suficiente información de contexto para facilitar la resolución de problemas
3. **Operaciones atómicas**: la salida de cada etapa debe ser atómica para facilitar revertir
4. **Conservar evidencia**: archivar productos fallidos antes de reintentar para facilitar análisis comparativos
5. **Reintento gradual**: proporcionar orientación más específica al reintentar, no simplemente repetir

**Escenarios comunes de fallos**:

| Tipo de Fallo | Síntoma | Solución |
| --- | --- | --- |
| Salida faltante | `input/idea.md` no existe | Reintentar, verificar ruta de escritura |
| Expansión de alcance | Cantidad de funciones > 7 | Reintentar, pedir simplificar a MVP |
| Error técnico | Fallo de compilación TypeScript | Verificar definiciones de tipos, reintentar |
| Problema de permisos | Agent escribe en directorio no autorizado | Verificar matriz de límites de capacidades |

**Checklist de recuperación de fallos**:
- [ ] La causa del fallo está clara
- [ ] La solución de reparación se ha implementado
- [ ] La configuración relacionada se ha actualizado
- [ ] Reanudar desde la etapa donde falló

::: tip Los Fallos son Normales
**¡No tengas miedo de los fallos!** AI App Factory tiene diseñados mecanismos completos de manejo de fallos:
- Cada etapa permite un reintento automático
- Los productos fallidos se archivan automáticamente en `artifacts/_failed/`
- Puede revertir al último checkpoint exitoso

Cuando encuentres un fallo, analiza la causa con calma y procesa según la estrategia de fallo.
:::

---

## Resumen del Curso

Este curso presentó las seis mejores prácticas de AI App Factory:

1. **Descripciones claras del producto**: describir en detalle usuarios objetivo, problema central, funciones clave y condiciones de restricción
2. **Confirmar cuidadosamente en checkpoints**: verificar la calidad de salida después de cada etapa para evitar la acumulación de errores
3. **Utilizar objetivos negativos para controlar el alcance**: enumerar claramente las funciones que no se harán para evitar la expansión del alcance
4. **Iterar gradualmente**: validar primero la idea central y luego expandir gradualmente basándose en el feedback de usuarios
5. **Sesiones separadas para ahorrar tokens**: crear nueva sesión en cada checkpoint para reducir los costos de uso
6. **Manejar correctamente los fallos**: utilizar los mecanismos de manejo de fallos para recuperar el progreso rápidamente

Seguir estas mejores prácticas hará que tu experiencia con AI App Factory sea más fluida, que la calidad de las aplicaciones generadas sea mayor y que tu eficiencia de desarrollo se multiplique por varias veces.

---

## Próximo Curso

> En el próximo curso aprenderemos la **[Referencia de Comandos CLI](../../appendix/cli-commands/)**.
>
> Aprenderás:
> - Todos los parámetros y opciones del comando factory init
> - Cómo el comando factory run comienza desde una etapa específica
> - Cómo el comando factory continue continúa en nueva sesión
> - Cómo factory status y factory list muestran información del proyecto
> - Cómo factory reset restablece el estado del proyecto

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-29

| Función | Ruta del Archivo | Número de Líneas |
| --- | --- | --- |
| Técnicas de descripción del producto | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L186-L210) | 186-210 |
| Mecanismo de checkpoints | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md#L98-L112) | 98-112 |
| Control de objetivos negativos | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L199-L203) | 199-203 |
| Estrategia de manejo de fallos | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md#L267-L274) | 267-274 |
| Aislamiento de contexto | [`policies/context-isolation.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/context-isolation.md#L10-L42) | 10-42 |
| Estándares de código | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | Todo el documento |

**Constantes clave**:
- `MAX_RETRY_COUNT = 1`: cada etapa permite un reintento automático por defecto

**Reglas clave**:
- Cantidad de funciones Must Have ≤ 7 (principio MVP)
- Cantidad de páginas ≤ 3 (etapa UI)
- Cantidad de modelos de datos ≤ 10 (etapa Tech)
- Cobertura de pruebas > 60% (etapa Validation)

</details>
