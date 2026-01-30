---
title: "Aprendizaje Continuo: Extracción Automática de Patrones | Everything Claude Code"
sidebarTitle: "Haz que Claude Code sea más inteligente"
subtitle: "Aprendizaje Continuo: Extracción Automática de Patrones Reutilizables"
description: "Domina el mecanismo de aprendizaje continuo de Everything Claude Code. Extrae patrones con /learn, configura evaluación automática y Stop hooks para que Claude Code acumule experiencia y potencie tu productividad."
tags:
  - "continuous-learning"
  - "knowledge-extraction"
  - "automation"
prerequisite:
  - "start-quick-start"
  - "platforms-commands-overview"
order: 100
---

# Mecanismo de Aprendizaje Continuo: Extracción Automática de Patrones Reutilizables

## Lo que aprenderás

- Usar el comando `/learn` para extraer manualmente patrones reutilizables de la sesión
- Configurar el skill continuous-learning para evaluación automática al finalizar sesiones
- Configurar Stop hooks para activar automáticamente la extracción de patrones
- Guardar patrones extraídos como learned skills para reutilizarlos en futuras sesiones
- Configurar parámetros como umbrales de extracción y requisitos de longitud de sesión

## Tu situación actual

Al desarrollar con Claude Code, ¿te has encontrado con estas situaciones?

- Resolviste un problema complejo, pero la próxima vez tienes que empezar desde cero
- Aprendiste técnicas de depuración de un framework, pero las olvidas con el tiempo
- Descubriste convenciones de código específicas del proyecto, pero no puedes documentarlas sistemáticamente
- Encontraste un workaround, pero no lo recuerdas cuando surge un problema similar

Estos problemas impiden que tu experiencia y conocimiento se acumulen efectivamente, obligándote a empezar desde cero cada vez.

## Cuándo usar esta técnica

Escenarios para usar el mecanismo de aprendizaje continuo:

- **Al resolver problemas complejos**: Depuraste un bug durante horas y necesitas recordar el enfoque de solución
- **Al aprender nuevos frameworks**: Descubriste peculiaridades o mejores prácticas del framework
- **A mitad del desarrollo del proyecto**: Vas descubriendo convenciones y patrones específicos del proyecto
- **Después de revisiones de código**: Aprendiste nuevos métodos de verificación de seguridad o estándares de codificación
- **Durante optimización de rendimiento**: Encontraste técnicas de optimización efectivas o combinaciones de herramientas

::: tip Valor fundamental
El mecanismo de aprendizaje continuo hace que Claude Code sea más inteligente con el uso. Actúa como un mentor experimentado que registra automáticamente patrones útiles mientras resuelves problemas, ofreciendo sugerencias en situaciones similares futuras.
:::

## Concepto central

El mecanismo de aprendizaje continuo consta de tres componentes principales:

```
1. Comando /learn        → Extracción manual: ejecutar en cualquier momento para guardar patrones valiosos
2. Continuous Learning Skill → Evaluación automática: activado por Stop hook, analiza la sesión
3. Learned Skills        → Base de conocimiento: guarda patrones, carga automáticamente en el futuro
```

**Cómo funciona**:

- **Extracción manual**: Después de resolver un problema no trivial, usas activamente `/learn` para extraer patrones
- **Evaluación automática**: Al finalizar la sesión, el script Stop hook verifica la longitud de la sesión y solicita a Claude que evalúe
- **Acumulación de conocimiento**: Los patrones extraídos se guardan como learned skills en el directorio `~/.claude/skills/learned/`
- **Reutilización futura**: Claude Code carga automáticamente estos skills en sesiones futuras

**Por qué elegir Stop hook**:

- **Ligero**: Solo se ejecuta una vez al finalizar la sesión, sin afectar la velocidad de respuesta interactiva
- **Contexto completo**: Puede acceder al registro completo de la sesión, facilitando encontrar patrones valiosos
- **No bloqueante**: No se ejecuta con cada mensaje enviado, sin añadir latencia

## 🎒 Preparación previa

Antes de usar el mecanismo de aprendizaje continuo, confirma:

- ✅ Has instalado el plugin Everything Claude Code
- ✅ Conoces el comando `/learn` de [Comandos principales detallados](../../platforms/commands-overview/)
- ✅ Entiendes el concepto de Stop hook de [Automatización con Hooks](../hooks-automation/)

::: warning Requisitos previos
Este tutorial asume que estás familiarizado con las operaciones básicas de Claude Code y el concepto de hooks. Si aún no has completado la instalación, lee primero [Inicio rápido](../../start/quickstart/).
:::

## Sigue los pasos: Flujo completo de aprendizaje continuo

Aprendamos todo el proceso con un ejemplo práctico. Supongamos que estás depurando un error de tipos en TypeScript y finalmente encontraste la solución.

### Paso 1: Usar /learn para extraer patrones manualmente

**Por qué**
La extracción manual es ideal para problemas importantes recién resueltos, guardándolos inmediatamente para evitar olvidarlos.

**Acción**
En Claude Code, escribe:

```
/learn
```

**Lo que deberías ver**
Claude analizará la sesión actual y preguntará si encontró patrones extraíbles:

```markdown
He analizado la sesión actual y encontré los siguientes patrones extraíbles:

1. Error de tipos en TypeScript: resuelto mediante restricciones genéricas
   - Descripción del problema: Inferencia incorrecta de tipos en parámetros de función
   - Solución: Añadir restricción genérica explícita `<T extends ...>`
   - Escenarios aplicables: Inferencia de tipos complejos, funciones callback

¿Deseas extraer estos patrones? (yes/no/skip)
```

**Punto de verificación ✅**
- ¿Claude identificó el problema que resolviste?
- ¿La descripción del patrón extraído es precisa?
- ¿Los escenarios aplicables son razonables?

**Siguiente paso**
Si el patrón es correcto, responde `yes`. Si necesitas modificaciones, indica los cambios específicos.

---

### Paso 2: Guardar como learned skill

**Por qué**
Al guardarlo como archivo skill, las sesiones futuras pueden cargar automáticamente este conocimiento.

**Acción**
Si confirmas la extracción, Claude creará el archivo skill:

```markdown
Se guardará el patrón en: ~/.claude/skills/learned/typescript-generic-constraints.md

# TypeScript Generic Constraints

**Extracted:** 2026-01-25
**Context:** Resolver problemas de inferencia de tipos complejos

## Problem
La inferencia de tipos en parámetros de función TypeScript es incorrecta, causando errores de tipos.

## Solution
Añadir restricción genérica explícita `<T extends ...>` para clarificar las relaciones de tipos.

## Example
```typescript
// Before
function process(data) { ... }  // Falla la inferencia de tipos

// After
function process<T extends Record<string, unknown>>(data: T) { ... }
```

## When to Use
- Escenarios de inferencia de tipos complejos
- Definición de tipos para funciones callback
- Restricciones de parámetros en funciones genéricas
```

**Lo que deberías ver**
Claude indica que el archivo se ha guardado:

```markdown
✅ Skill guardado en: ~/.claude/skills/learned/typescript-generic-constraints.md

Cuando encuentres problemas de tipos similares en el futuro, Claude cargará automáticamente esta habilidad.
```

**Punto de verificación ✅**
- ¿Se creó el archivo correctamente?
- ¿La ruta del archivo está en el directorio `~/.claude/skills/learned/`?
- ¿El contenido del skill es preciso?

---

### Paso 3: Configurar el Continuous Learning Skill

**Por qué**
Con la evaluación automática configurada, Claude verificará automáticamente si hay patrones extraíbles al finalizar cada sesión.

**Acción**

Crea el archivo de configuración `~/.claude/skills/continuous-learning/config.json`:

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

**Explicación de la configuración**:

| Campo | Descripción | Valor recomendado |
| --- | --- | --- |
| `min_session_length` | Longitud mínima de sesión (número de mensajes del usuario) | 10 |
| `extraction_threshold` | Umbral de extracción | medium |
| `auto_approve` | Guardar automáticamente (se recomienda false) | false |
| `learned_skills_path` | Ruta de guardado de learned skills | `~/.claude/skills/learned/` |
| `patterns_to_detect` | Tipos de patrones a detectar | Ver arriba |
| `ignore_patterns` | Tipos de patrones a ignorar | Ver arriba |

**Lo que deberías ver**
El archivo de configuración se ha creado en `~/.claude/skills/continuous-learning/config.json`.

**Punto de verificación ✅**
- El formato del archivo de configuración es correcto (JSON válido)
- `learned_skills_path` contiene el símbolo `~` (se reemplazará por el directorio home real)
- `auto_approve` está configurado como `false` (recomendado)

---

### Paso 4: Configurar Stop Hook para activación automática

**Por qué**
El Stop hook se activa automáticamente al finalizar cada sesión, sin necesidad de ejecutar `/learn` manualmente.

**Acción**

Edita `~/.claude/settings.json` y añade el Stop hook:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**Explicación de rutas del script**:

| Plataforma | Ruta del script |
| --- | --- |
| macOS/Linux | `~/.claude/skills/continuous-learning/evaluate-session.sh` |
| Windows | `C:\Users\TuNombre\.claude\skills\continuous-learning\evaluate-session.cmd` |

**Lo que deberías ver**
El Stop hook se ha añadido a `~/.claude/settings.json`.

**Punto de verificación ✅**
- La estructura de hooks es correcta (Stop → matcher → hooks)
- La ruta del command apunta al script correcto
- El matcher está configurado como `"*"` (coincide con todas las sesiones)

---

### Paso 5: Verificar que el Stop Hook funciona correctamente

**Por qué**
Después de verificar que la configuración es correcta, puedes usar la función de extracción automática con confianza.

**Acción**
1. Abre una nueva sesión de Claude Code
2. Realiza algo de trabajo de desarrollo (envía al menos 10 mensajes)
3. Cierra la sesión

**Lo que deberías ver**
El script Stop hook muestra el log:

```
[ContinuousLearning] Session has 12 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/tunombre/.claude/skills/learned/
```

**Punto de verificación ✅**
- El log muestra número de mensajes de sesión ≥ 10
- El log muestra la ruta correcta de learned skills
- No hay mensajes de error

---

### Paso 6: Carga automática de learned skills en sesiones futuras

**Por qué**
Los skills guardados se cargan automáticamente en escenarios similares futuros, proporcionando contexto.

**Acción**
Cuando encuentres problemas similares en sesiones futuras, Claude cargará automáticamente los learned skills relevantes.

**Lo que deberías ver**
Claude indica que ha cargado los skills relevantes:

```markdown
Noto que este escenario es similar al problema de inferencia de tipos que resolvimos antes.

Según el saved skill (typescript-generic-constraints), recomiendo usar restricciones genéricas explícitas:

```typescript
function process<T extends Record<string, unknown>>(data: T) { ... }
```
```

**Punto de verificación ✅**
- Claude hace referencia al saved skill
- La solución sugerida es precisa
- Mejora la eficiencia en la resolución de problemas

## Punto de verificación ✅: Validar la configuración

Después de completar los pasos anteriores, ejecuta las siguientes verificaciones para confirmar que todo funciona correctamente:

1. **Verificar que existe el archivo de configuración**:
```bash
ls -la ~/.claude/skills/continuous-learning/config.json
```

2. **Verificar la configuración del Stop hook**:
```bash
cat ~/.claude/settings.json | grep -A 10 "Stop"
```

3. **Verificar el directorio de learned skills**:
```bash
ls -la ~/.claude/skills/learned/
```

4. **Probar manualmente el Stop hook**:
```bash
node ~/.claude/skills/continuous-learning/scripts/hooks/evaluate-session.js
```

## Errores comunes

### Error 1: Sesión demasiado corta no activa la extracción

**Problema**:
El script Stop hook verifica la longitud de la sesión y omite si es menor que `min_session_length`.

**Causa**:
El valor predeterminado `min_session_length: 10` hace que las sesiones cortas no activen la evaluación.

**Solución**:
```json
{
  "min_session_length": 5  // Reducir el umbral
}
```

::: warning Nota
No lo configures demasiado bajo (como < 5), de lo contrario se extraerán muchos patrones sin sentido (como correcciones simples de errores de sintaxis).
:::

---

### Error 2: `auto_approve: true` guarda patrones de baja calidad automáticamente

**Problema**:
En modo de guardado automático, Claude puede guardar patrones de baja calidad.

**Causa**:
`auto_approve: true` omite el paso de confirmación manual.

**Solución**:
```json
{
  "auto_approve": false  // Mantener siempre en false
}
```

**Práctica recomendada**:
Siempre confirma manualmente los patrones extraídos para garantizar la calidad.

---

### Error 3: El directorio de learned skills no existe y falla el guardado

**Problema**:
El Stop hook se ejecuta correctamente, pero el archivo skill no se crea.

**Causa**:
El directorio al que apunta `learned_skills_path` no existe.

**Solución**:
```bash
# Crear el directorio manualmente
mkdir -p ~/.claude/skills/learned/

# O usar una ruta absoluta en la configuración
{
  "learned_skills_path": "/ruta/absoluta/a/learned/"
}
```

---

### Error 4: Ruta incorrecta del script Stop hook (Windows)

**Problema**:
El Stop hook no se activa en Windows.

**Causa**:
El archivo de configuración usa rutas estilo Unix (`~/.claude/...`), pero la ruta real en Windows es diferente.

**Solución**:
```json
{
  "command": "C:\\Users\\TuNombre\\.claude\\skills\\continuous-learning\\evaluate-session.cmd"
}
```

**Práctica recomendada**:
Usa scripts Node.js (multiplataforma) en lugar de scripts Shell.

---

### Error 5: Patrones extraídos demasiado genéricos, baja reutilización

**Problema**:
Las descripciones de patrones extraídos son demasiado genéricas (como "corregir error de tipos"), sin contexto específico.

**Causa**:
No se incluyó suficiente información de contexto durante la extracción (mensaje de error, ejemplo de código, escenarios aplicables).

**Solución**:
Proporciona más contexto detallado al usar `/learn`:

```
/learn Resolví un error de tipos en TypeScript: Property 'xxx' does not exist on type 'yyy'. Lo resolví temporalmente usando type assertion con as, pero el mejor método es usar restricciones genéricas.
```

**Lista de verificación**:
- [ ] Descripción específica del problema (incluye mensaje de error)
- [ ] Solución detallada (incluye ejemplo de código)
- [ ] Escenarios aplicables claros (cuándo usar este patrón)
- [ ] Nombre específico (como "typescript-generic-constraints" en lugar de "type-fix")

---

### Error 6: Demasiados learned skills, difícil de gestionar

**Problema**:
Con el tiempo, el directorio `learned/` acumula muchos skills, difíciles de encontrar y gestionar.

**Causa**:
No se limpian regularmente los skills de baja calidad u obsoletos.

**Solución**:

1. **Revisión periódica**: Revisa los learned skills una vez al mes
```bash
# Listar todos los skills
ls -la ~/.claude/skills/learned/

# Ver contenido del skill
cat ~/.claude/skills/learned/nombre-patron.md
```

2. **Marcar skills de baja calidad**: Añade el prefijo `deprecated-` al nombre del archivo
```bash
mv ~/.claude/skills/learned/patron-antiguo.md \
   ~/.claude/skills/learned/deprecated-patron-antiguo.md
```

3. **Gestión por categorías**: Usa subdirectorios para clasificar
```bash
mkdir -p ~/.claude/skills/learned/{types,debugging,testing}
mv ~/.claude/skills/learned/*types*.md ~/.claude/skills/learned/types/
```

**Práctica recomendada**:
Limpia trimestralmente para mantener los learned skills concisos y efectivos.

---

## Resumen de la lección

El mecanismo de aprendizaje continuo funciona a través de tres componentes principales:

1. **Comando `/learn`**: Extrae manualmente patrones reutilizables de la sesión
2. **Continuous Learning Skill**: Configura parámetros de evaluación automática (longitud de sesión, umbral de extracción)
3. **Stop Hook**: Activa automáticamente la evaluación al finalizar la sesión

**Puntos clave**:

- ✅ La extracción manual es ideal para problemas importantes recién resueltos
- ✅ La evaluación automática se activa mediante Stop hook al finalizar la sesión
- ✅ Los patrones extraídos se guardan como learned skills en el directorio `~/.claude/skills/learned/`
- ✅ Configura `min_session_length` para controlar la longitud mínima de sesión (recomendado 10)
- ✅ Mantén siempre `auto_approve: false` para confirmar manualmente la calidad de extracción
- ✅ Limpia regularmente los learned skills de baja calidad u obsoletos

**Mejores prácticas**:

- Después de resolver problemas no triviales, usa inmediatamente `/learn` para extraer patrones
- Proporciona contexto detallado (descripción del problema, solución, ejemplo de código, escenarios aplicables)
- Usa nombres específicos para los skills (como "typescript-generic-constraints" en lugar de "type-fix")
- Revisa y limpia regularmente los learned skills para mantener una base de conocimiento concisa

## Próxima lección

> En la próxima lección aprenderemos **[Estrategias de Optimización de Tokens](../token-optimization/)**.
>
> Aprenderás:
> - Cómo optimizar el uso de tokens para maximizar la eficiencia de la ventana de contexto
> - Configuración y uso del skill strategic-compact
> - Automatización con hooks PreCompact y PostToolUse
> - Elegir el modelo adecuado (opus vs sonnet) equilibrando costo y calidad

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Definición del comando /learn | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Continuous Learning Skill | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81 |
| Script Stop Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Comando Checkpoint | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |

**Constantes clave**:
- `min_session_length = 10`: Longitud mínima de sesión predeterminada (número de mensajes del usuario)
- `CLAUDE_TRANSCRIPT_PATH`: Variable de entorno, ruta del registro de sesión
- `learned_skills_path`: Ruta de guardado de learned skills, predeterminado `~/.claude/skills/learned/`

**Funciones clave**:
- `main()`: Función principal de evaluate-session.js, lee configuración, verifica longitud de sesión, genera logs
- `getLearnedSkillsDir()`: Obtiene la ruta del directorio de learned skills (maneja expansión de `~`)
- `countInFile()`: Cuenta ocurrencias de un patrón en un archivo

**Opciones de configuración**:
| Opción | Tipo | Valor predeterminado | Descripción |
| --- | --- | --- | --- |
| `min_session_length` | number | 10 | Longitud mínima de sesión (número de mensajes del usuario) |
| `extraction_threshold` | string | "medium" | Umbral de extracción |
| `auto_approve` | boolean | false | Guardar automáticamente (se recomienda false) |
| `learned_skills_path` | string | "~/.claude/skills/learned/" | Ruta de guardado de learned skills |
| `patterns_to_detect` | array | Ver código fuente | Tipos de patrones a detectar |
| `ignore_patterns` | array | Ver código fuente | Tipos de patrones a ignorar |

**Tipos de patrones**:
- `error_resolution`: Patrones de resolución de errores
- `user_corrections`: Patrones de corrección del usuario
- `workarounds`: Soluciones alternativas
- `debugging_techniques`: Técnicas de depuración
- `project_specific`: Patrones específicos del proyecto

**Tipos de Hook**:
- Stop: Se ejecuta al finalizar la sesión (evaluate-session.js)

</details>
