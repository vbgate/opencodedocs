---
title: "Modo Ultrawork: Activa Todas las Funciones | oh-my-opencode"
sidebarTitle: "Activa Todas las Funciones"
subtitle: "Modo Ultrawork: Activa Todas las Funciones"
description: "Aprende el modo Ultrawork de oh-my-opencode y sus características principales, incluyendo el uso de la palabra clave ultrawork, cambios de comportamiento al activar, mecanismo de exploración paralela, verificación de finalización forzada y colaboración de agentes, para activar rápidamente todas las funciones avanzadas."
tags:
  - "ultrawork"
  - "tareas en segundo plano"
  - "colaboración de agentes"
prerequisite:
  - "start-installation"
  - "start-sisyphus-orchestrator"
order: 30
---

# Modo Ultrawork: Activa Todas las Funciones

## Qué Aprenderás

- Activa todas las funciones avanzadas de oh-my-opencode con un solo comando
- Haz que múltiples agentes de IA trabajen en paralelo como un equipo real
- Evita configurar manualmente múltiples agentes y tareas en segundo plano
- Comprende la filosofía de diseño y las mejores prácticas del modo Ultrawork

## Tus Desafíos Actuales

Es posible que hayas encontrado estas situaciones durante el desarrollo:

- **Demasiadas funciones, no sabes cómo usarlas**: Tienes 10 agentes especializados, tareas en segundo plano, herramientas LSP, pero no sabes cómo activarlas rápidamente
- **Se requiere configuración manual**: Cada tarea compleja requiere especificar manualmente agentes, concurrencia en segundo plano y otras configuraciones
- **Colaboración de agentes ineficiente**: Llamando agentes en serie, desperdiciando tiempo y costos
- **Tareas atascadas a mitad de camino**: Los agentes no tienen suficiente motivación y restricciones para completar las tareas

Todo esto está afectando tu capacidad para desatar el verdadero poder de oh-my-opencode.

## Concepto Central

**Modo Ultrawork** es el mecanismo de "activar todo con un clic" de oh-my-opencode.

::: info ¿Qué es el Modo Ultrawork?
El Modo Ultrawork es un modo de trabajo especial activado por una palabra clave. Cuando tu prompt contiene `ultrawork` o su abreviatura `ulw`, el sistema activa automáticamente todas las funciones avanzadas: tareas en segundo plano paralelas, exploración profunda, finalización forzada, colaboración multi-agente y más.
:::

### Filosofía de Diseño

El modo Ultrawork se basa en los siguientes principios centrales (del [Ultrawork Manifesto](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md)):

| Principio | Descripción |
|--- | ---|
| **La intervención humana es una señal de fallo** | Si necesitas corregir constantemente la salida de la IA, significa que hay un problema con el diseño del sistema |
| **Código indistinguible** | El código escrito por la IA no debería distinguirse del código escrito por ingenieros senior |
| **Minimizar la carga cognitiva** | Solo necesitas decir "qué hacer", los agentes son responsables de "cómo hacerlo" |
| **Predecible, consistente, delegable** | Los agentes deberían ser tan estables y confiables como un compilador |

### Mecanismo de Activación

Cuando el sistema detecta la palabra clave `ultrawork` o `ulw`:

1. **Establecer modo de máxima precisión**: `message.variant = "max"`
2. **Mostrar notificación Toast**: "Ultrawork Mode Activated - Maximum precision engaged. All agents at your disposal."
3. **Inyectar instrucciones completas**: Inyectar 200+ líneas de instrucciones ULTRAWORK a los agentes, incluyendo:
   - Requerir 100% de certeza antes de comenzar la implementación
   - Requerir uso paralelo de tareas en segundo plano
   - Forzar el uso del sistema Category + Skills
   - Forzar verificación de finalización (flujo de trabajo TDD)
   - Prohibir cualquier excusa de "no puedo hacerlo"

## Sigue los Pasos

### Paso 1: Activar el Modo Ultrawork

Ingresa un prompt que contenga la palabra clave `ultrawork` o `ulw` en OpenCode:

```
ultrawork desarrollar una API REST
```

O más conciso:

```
ulw agregar autenticación de usuario
```

**Deberías ver**:
- Una notificación Toast aparece en la interfaz: "Ultrawork Mode Activated"
- La respuesta del agente comienza con "ULTRAWORK MODE ENABLED!"

### Paso 2: Observar Cambios en el Comportamiento del Agente

Después de activar el modo Ultrawork, los agentes:

1. **Exploración paralela del código base**
   ```
   delegate_task(agent="explore", prompt="encontrar patrones de API existentes", background=true)
   delegate_task(agent="explore", prompt="encontrar infraestructura de pruebas", background=true)
   delegate_task(agent="librarian", prompt="encontrar mejores prácticas de autenticación", background=true)
   ```

2. **Llamar al agente Plan para crear un plan de trabajo**
   ```
   delegate_task(subagent_type="plan", prompt="crear plan detallado basado en el contexto recopilado")
   ```

3. **Usar Category + Skills para ejecutar tareas**
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"], ...)
   ```

**Deberías ver**:
- Múltiples tareas en segundo plano ejecutándose simultáneamente
- Agentes llamando activamente a agentes especializados (Oracle, Librarian, Explore)
- Planes de pruebas completos y desglose de trabajo
- Tareas continúan ejecutándose hasta completar al 100%

### Paso 3: Verificar Finalización de Tareas

Después de que los agentes completen:

1. **Mostrar evidencia de verificación**: Salida real de ejecución de pruebas, descripciones de verificación manual
2. **Confirmar que todos los TODO están completos**: No declararán finalización anticipadamente
3. **Resumir el trabajo realizado**: Listar qué se hizo y por qué

**Deberías ver**:
- Resultados de pruebas claros (no "debería funcionar")
- Todos los problemas resueltos
- Sin lista de TODO incompleta

## Punto de Control ✅

Después de completar los pasos anteriores, confirma:

- [ ] Ves una notificación Toast después de ingresar `ulw`
- [ ] La respuesta del agente comienza con "ULTRAWORK MODE ENABLED!"
- [ ] Observas tareas en segundo plano paralelas ejecutándose
- [ ] Los agentes usan el sistema Category + Skills
- [ ] Hay evidencia de verificación después de completar la tarea

Si algún elemento falla, verifica:
- Si la palabra clave está escrita correctamente (`ultrawork` o `ulw`)
- Si estás en la sesión principal (las tareas en segundo plano no activarán el modo)
- Si el archivo de configuración tiene habilitadas las funciones relevantes

## Cuándo Usar Esta Técnica

| Escenario | Usar Ultrawork | Modo Normal |
|--- | --- | ---|
| **Funciones nuevas complejas** | ✅ Recomendado (requiere colaboración multi-agente) | ❌ Puede no ser lo suficientemente eficiente |
| **Correcciones urgentes** | ✅ Recomendado (necesita diagnóstico rápido y exploración) | ❌ Puede perder contexto |
| **Modificaciones simples** | ❌ Excesivo (desperdicia recursos) | ✅ Más adecuado |
| **Validación rápida de ideas** | ❌ Excesivo | ✅ Más adecuado |

**Regla general**:
- La tarea involucra múltiples módulos o sistemas → Usa `ulw`
- Necesitas investigación profunda del código base → Usa `ulw`
- Necesitas llamar a múltiples agentes especializados → Usa `ulw`
- Cambio pequeño en un solo archivo → No necesitas `ulw`

## Errores Comunes

::: warning Notas Importantes

**1. No uses `ulw` en cada prompt**

El modo Ultrawork inyecta una gran cantidad de instrucciones, lo cual es excesivo para tareas simples. Úsalo solo para tareas complejas que realmente requieran colaboración multi-agente, exploración paralela y análisis profundo.

**2. Las tareas en segundo plano no activarán el modo Ultrawork**

El detector de palabras clave omite las sesiones en segundo plano para evitar inyectar incorrectamente el modo en sub-agentes. El modo Ultrawork solo funciona en la sesión principal.

**3. Asegúrate de que la configuración del Provider sea correcta**

El modo Ultrawork depende de múltiples modelos de IA trabajando en paralelo. Si ciertos Providers no están configurados o no están disponibles, los agentes pueden no ser capaces de llamar a agentes especializados.
:::

## Resumen de la Lección

El modo Ultrawork logra el objetivo de diseño de "activar todas las funciones con un comando" a través de la activación por palabras clave:

- **Fácil de usar**: Solo ingresa `ulw` para activar
- **Colaboración automática**: Los agentes llaman automáticamente a otros agentes y ejecutan tareas en segundo plano en paralelo
- **Finalización forzada**: Mecanismo de verificación completo asegura finalización al 100%
- **Cero configuración**: No necesitas configurar manualmente prioridades de agentes, límites de concurrencia, etc.

Recuerda: El modo Ultrawork está diseñado para hacer que los agentes trabajen como un equipo real. Solo necesitas expresar la intención, los agentes son responsables de la ejecución.

## Vista Previa de la Siguiente Lección

> En la siguiente lección, aprenderemos **[Configuración de Provider](../../platforms/provider-setup/)**.
>
> Aprenderás:
> - Cómo configurar múltiples Providers como Anthropic, OpenAI, Google
> - Cómo la estrategia multi-modelo degrada automáticamente y selecciona modelos óptimos
> - Cómo probar conexiones de Provider y uso de cuota

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-26

| Función | Ruta del Archivo | Números de Línea |
|--- | --- | ---|
| Filosofía de diseño Ultrawork | [`docs/ultrawork-manifesto.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) | 1-198 |
| Hook detector de palabras clave | [`src/hooks/keyword-detector/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/index.ts) | 12-100 |
| Plantilla de instrucciones ULTRAWORK | [`src/hooks/keyword-detector/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/constants.ts) | 54-280 |
| Lógica de detección de palabras clave | [`src/hooks/keyword-detector/detector.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/detector.ts) | 26-53 |

**Constantes clave**:
- `KEYWORD_DETECTORS`: Configuración del detector de palabras clave, incluyendo tres modos: ultrawork, search, analyze
- `CODE_BLOCK_PATTERN`: Patrón regex de bloques de código, usado para filtrar palabras clave en bloques de código
- `INLINE_CODE_PATTERN`: Patrón regex de código en línea, usado para filtrar palabras clave en código en línea

**Funciones clave**:
- `createKeywordDetectorHook()`: Crea Hook detector de palabras clave, escucha evento UserPromptSubmit
- `detectKeywordsWithType()`: Detecta palabras clave en texto y devuelve tipo (ultrawork/search/analyze)
- `getUltraworkMessage()`: Genera instrucciones completas del modo ULTRAWORK (selecciona Planner o modo normal según el tipo de agente)
- `removeCodeBlocks()`: Elimina bloques de código del texto para evitar activar palabras clave en bloques de código

**Reglas de negocio**:
| ID de Regla | Descripción de la Regla | Etiqueta |
|--- | --- | ---|
| BR-4.8.4-1 | Activar modo Ultrawork cuando se detecta "ultrawork" o "ulw" | [Hecho] |
| BR-4.8.4-2 | El modo Ultrawork establece `message.variant = "max"` | [Hecho] |
| BR-4.8.4-3 | El modo Ultrawork muestra notificación Toast: "Ultrawork Mode Activated" | [Hecho] |
| BR-4.8.4-4 | Las sesiones de tareas en segundo plano omiten la detección de palabras clave para evitar inyección de modo | [Hecho] |
| BR-4.8.4-5 | Las sesiones no principales solo permiten la palabra clave ultrawork, bloqueando otras inyecciones de modo | [Hecho] |

</details>

