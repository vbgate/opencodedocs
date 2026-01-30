---
title: "Fase UI: Diseño de Interfaz y Prototipo - Sistema de Diseño ui-ux-pro-max | Tutorial de Agent App Factory"
sidebarTitle: "Diseño de Interfaz y Prototipo"
subtitle: "Fase 3: UI - Diseño de Interfaz y Prototipo"
description: "Aprende cómo la fase UI genera UI Schema profesional y prototipos previsualizables basados en el PRD. Este tutorial explica las responsabilidades del UI Agent, el uso del sistema de diseño ui-ux-pro-max, la estructura estándar de ui.schema.yaml, principios de diseño y lista de verificación de entrega."
tags:
  - "Pipeline"
  - "UI/UX"
  - "Sistema de Diseño"
prerequisite:
  - "advanced-stage-prd"
order: 100
---

# Fase 3: UI - Diseño de Interfaz y Prototipo

UI es la tercera fase del pipeline de Agent App Factory, responsable de transformar las descripciones funcionales del PRD en una estructura de interfaz clara (UI Schema) y prototipos previsualizables. Esta fase determina la apariencia y la experiencia de interacción de la aplicación final, siendo el puente clave que conecta los requisitos del producto con la implementación técnica.

## Lo Que Podrás Hacer Después de Aprender

- Convertir el PRD en un archivo `ui.schema.yaml` que cumpla con los estándares
- Usar la skill ui-ux-pro-max para generar un sistema de diseño profesional (estilos, colores, tipografía)
- Crear prototipos previsualizables en el navegador (HTML + CSS + JS)
- Comprender los límites de responsabilidad del UI Agent (diseño visual, sin involucrar implementación técnica)
- Evitar trampas comunes del diseño con IA (como el uso excesivo de gradientes morados, fuente Inter)

## Tu Situación Actual

Es posible que tengas un PRD claro, pero no sepas cómo empezar a diseñar la interfaz:

- "El PRD está listo, pero no se me ocurre un estilo de UI adecuado" (falta de conocimiento de sistemas de diseño)
- "No sé qué colores, fuentes o diseños usar" (dependencia de la estética personal en lugar de estándares profesionales)
- "El prototipo diseñado no coincide con el PRD" (la estructura de la interfaz se desconecta de los requisitos funcionales)
- "Temo que el diseño sea demasiado feo o llamativo, no coincida con el posicionamiento del producto" (falta de experiencia en diseño de la industria)

Esta ceguera de diseño hará que la fase Code posterior carezca de especificaciones visuales claras, y la aplicación final generada puede tener una apariencia confusa e interacciones inconsistentes.

## Cuándo Usar Esta Técnica

Cuando tu PRD esté completo y cumpla las siguientes condiciones:

1. **Tener un documento PRD claro** (que incluya historias de usuario, lista de funciones, no-objetivos)
2. **Aún no has empezado a diseñar la interfaz** (UI es la primera fase de diseño)
3. **Aún no has decidido el stack tecnológico** (los detalles de implementación técnica están en la fase Tech)
4. **Deseas controlar el alcance del diseño, evitar el diseño excesivo** (la fase UI se limita a no más de 3 páginas)

## 🎒 Preparativos Antes de Empezar

::: warning Condiciones Previas
Antes de comenzar la fase UI, asegúrate de:

- ✅ Haber completado la [Fase PRD](../stage-prd/), `artifacts/prd/prd.md` ya generado
- ✅ Tener instalado el plugin ui-ux-pro-max (forma recomendada: ejecutar [factory init](../../start/installation/) lo instalará automáticamente)
- ✅ Conocer la [Visión General del Pipeline de 7 Fases](../../start/pipeline-overview/)
- ✅ Tener preparado un asistente de IA (se recomienda Claude Code)
:::

## Idea Central

### ¿Qué es la Fase UI?

**La fase UI** es el puente que conecta los requisitos del producto con la implementación técnica, y su única responsabilidad es **transformar las descripciones funcionales del PRD en estructura de interfaz y especificaciones visuales**.

::: info No es Desarrollo Frontend
El UI Agent no es un ingeniero de desarrollo frontend, no escribirá componentes React ni código CSS. Su tarea es:
- Analizar los requisitos funcionales del PRD
- Determinar la arquitectura de información de la interfaz (páginas y componentes)
- Generar el sistema de diseño (colores, fuentes, espaciado, bordes redondeados)
- Crear prototipos previsualizables (HTML + CSS + JS)

No decidirá "con qué framework implementar", solo decidirá "cómo se ve".
:::

### ¿Por Qué Se Necesita un Sistema de Diseño?

Imagina la decoración de una casa sin sistema de diseño:

- ❌ Sin sistema de diseño: la sala usa estilo minimalista, el dormitorio estilo retro, la cocina estilo industrial, conjunto caótico
- ✅ Con sistema de diseño: toda la casa tiene tonos uniformes, estilo uniforme, materiales uniformes, coordinación armoniosa

La fase UI genera esta "guía de decoración integral" a través de la skill ui-ux-pro-max, asegurando que todas las interfaces generadas en la fase Code posterior sigan especificaciones visuales uniformes.

### Estructura de Archivos de Salida

La fase UI generará tres archivos:

| Archivo | Contenido | Función |
| --- | --- | --- |
| **ui.schema.yaml** | Configuración del sistema de diseño + Definición de estructura de páginas | La fase Tech lee este archivo para diseñar el modelo de datos, la fase Code lee este archivo para generar la interfaz |
| **preview.web/index.html** | Prototipo previsualizable en el navegador | Permite ver el efecto de la interfaz con anticipación, verificar si el diseño cumple las expectativas |
| **design-system.md** (opcional) | Documentación persistente del sistema de diseño | Registra las decisiones de diseño, facilita ajustes posteriores |

## Sígueme Paso a Paso

### Paso 1: Confirmar que el PRD Está Completo

Antes de iniciar la fase UI, asegúrate de que `artifacts/prd/prd.md` exista y tenga contenido completo.

**Puntos de Verificación ✅**:

1. **¿El usuario objetivo** está claro?
   - ✅ Tiene un perfil específico (edad/profesión/capacidad técnica)
   - ❌ Vago: "todos"

2. **¿Las funciones principales** están listadas?
   - ✅ Tiene 3-7 funciones clave
   - ❌ Demasiadas o muy pocas

3. **¿Los no-objetivos** son suficientes?
   - ✅ Al menos 3 funciones que no se harán
   - ❌ Faltantes o muy pocas

::: tip Si el PRD está incompleto
Vuelve primero a la [Fase PRD](../stage-prd/) para modificar, asegurando que el diseño tenga una entrada clara.
:::

### Paso 2: Iniciar el Pipeline hasta la Fase UI

Ejecuta en el directorio del proyecto Factory:

```bash
# Continuar desde la fase PRD (si la fase PRD acaba de terminar)
factory continue

# O especificar directamente iniciar desde ui
factory run ui
```

El CLI mostrará el estado actual y las fases disponibles.

### Paso 3: El Asistente de IA Lee la Definición del UI Agent

El asistente de IA (como Claude Code) leerá automáticamente `agents/ui.agent.md`, comprendiendo sus responsabilidades y restricciones.

::: info Responsabilidades del Agent
El UI Agent solo puede:
- Leer `artifacts/prd/prd.md`
- Escribir en `artifacts/ui/`
- Usar la skill ui-ux-pro-max para generar el sistema de diseño
- Crear prototipos de no más de 3 páginas

No puede:
- Leer otros archivos
- Escribir en otros directorios
- Decidir el stack tecnológico (esto está en la fase Tech)
- Usar el estilo predeterminado de IA (gradientes morados, fuente Inter)
:::

### Paso 4: Usar Obligatoriamente el Sistema de Diseño ui-ux-pro-max (Paso Clave)

Este es el paso central de la fase UI. El asistente de IA **debe** llamar primero a la skill `ui-ux-pro-max`, incluso si crees que la dirección de diseño es muy clara.

**Función de la skill ui-ux-pro-max**:

1. **Recomendar automáticamente el sistema de diseño**: según el tipo de producto, campo de la industria, empareja automáticamente el mejor estilo
2. **Proporcionar 67 estilos de UI**: desde minimalismo hasta neo-brutalismo
3. **Proporcionar 96 paletas de colores**: pre-diseñadas por industria y estilo
4. **Proporcionar 57 combinaciones de fuentes**: evita estilos comunes de IA (Inter, Roboto)
5. **Aplicar 100 reglas de razonamiento de la industria**: asegura que el diseño coincida con el posicionamiento del producto

**Lo que hará el asistente de IA**:
- Extraer información clave del PRD: tipo de producto, campo de la industria, usuario objetivo
- Llamar a la skill `ui-ux-pro-max` para obtener recomendaciones completas del sistema de diseño
- Aplicar el sistema de diseño recomendado a `ui.schema.yaml` y al prototipo

::: danger Saltar este paso será rechazado
El scheduler Sisyphus verificará si se usó la skill ui-ux-pro-max. Si no, los productos generados por el UI Agent serán rechazados y necesitarán re-ejecutarse.
:::

**¿Qué incluye el sistema de diseño**?

```yaml
design_system:
  style: "Glassmorphism"           # Estilo seleccionado (como glassmorphism, minimalismo)
  colors:
    primary: "#2563eb"             # Color principal (para acciones principales)
    secondary: "#64748b"           # Color secundario
    success: "#10b981"             # Color de éxito
    warning: "#f59e0b"             # Color de advertencia
    error: "#ef4444"               # Color de error
    background: "#ffffff"          # Color de fondo
    surface: "#f8fafc"            # Color de superficie
    text:
      primary: "#1e293b"           # Texto principal
      secondary: "#64748b"         # Texto secundario
  typography:
    font_family:
      headings: "DM Sans"          # Fuente de títulos (evitar Inter)
      body: "DM Sans"              # Fuente de cuerpo
    font_size:
      base: 16
      lg: 18
      xl: 20
      2xl: 24
  spacing:
    unit: 8                        # Unidad base de espaciado (grid de 8px)
  border_radius:
    md: 8
    lg: 12
  effects:
    hover_transition: "200ms"      # Tiempo de transición hover
    blur: "backdrop-blur-md"       # Efecto de vidrio esmerilado
```

### Paso 5: Diseñar la Estructura de la Interfaz

El asistente de IA diseñará la arquitectura de información de la interfaz (páginas y componentes) según los requisitos funcionales del PRD.

**Ejemplo de estructura de interfaz** (de `ui.schema.yaml`):

```yaml
pages:
  - id: home
    title: "Inicio"
    type: list
    description: "Muestra la lista de todos los proyectos"
    components:
      - type: header
        content: "Mi Aplicación"
      - type: list
        source: "api/items"
        item_layout:
          - type: text
            field: "title"
            style: "heading"
          - type: text
            field: "description"
            style: "body"
        actions:
          - type: "navigate"
            target: "detail"
            params: ["id"]

  - id: detail
    title: "Detalle"
    type: detail
    params:
      - name: "id"
        type: "number"

  - id: create
    title: "Crear"
    type: form
    fields:
      - name: "title"
        type: "text"
        label: "Título"
        required: true
    submit:
      action: "post"
      endpoint: "/api/items"
      on_success: "navigate:home"
```

**Tipos de página**:
- `list`: Página de lista (como inicio, resultados de búsqueda)
- `detail`: Página de detalle (como ver detalles del proyecto)
- `form`: Página de formulario (como crear, editar)

### Paso 6: Crear el Prototipo de Previsualización

El asistente de IA creará un prototipo previsualizable usando HTML + CSS + JS, mostrando los flujos de interacción clave.

**Características del prototipo**:
- Usa tecnología nativa (no depende de frameworks)
- Aplica los colores, fuentes y efectos recomendados por el sistema de diseño
- Todos los elementos clicables tienen estado hover y `cursor-pointer`
- Diseño mobile-first (responsive correcto en 375px y 768px)
- Usa iconos SVG (Heroicons/Lucide), no emoji

**Forma de previsualización**:
Abre `artifacts/ui/preview.web/index.html` en el navegador para ver el prototipo.

### Paso 7: Confirmar la Salida de UI

Después de que el UI Agent termine, necesitas verificar los archivos de salida.

**Puntos de Verificación ✅**:

1. **¿Existe ui.schema.yaml?**
   - ✅ El archivo está en el directorio `artifacts/ui/`
   - ❌ Faltante o ruta incorrecta

2. **¿El sistema de diseño usó la skill ui-ux-pro-max?**
   - ✅ Indicado explícitamente en la salida o schema
   - ❌ Sistema de diseño seleccionado por sí mismo

3. **¿El número de páginas no excede 3?**
   - ✅ 1-3 páginas (MVP enfocado en funciones principales)
   - ❌ Más de 3 páginas

4. **¿El prototipo se puede abrir en el navegador?**
   - ✅ Abrir `preview.web/index.html` en el navegador se muestra normalmente
   - ❌ No se puede abrir o muestra error

5. **¿Se evitó el estilo predeterminado de IA?**
   - ✅ Sin gradientes morados/rosas
   - ✅ Sin usar fuente Inter
   - ✅ Usa iconos SVG (no emoji)
   - ❌ Aparecen los estilos de IA mencionados

6. **¿Todos los elementos clicables tienen retroalimentación de interacción?**
   - ✅ Tiene `cursor-pointer` y estado hover
   - ✅ Transición suave (150-300ms)
   - ❌ Sin indicador de interacción o cambio instantáneo

### Paso 8: Elegir Continuar, Reintentar o Pausar

Después de la confirmación sin errores, el CLI mostrará opciones:

```bash
Por favor selecciona una operación:
[1] Continuar (entrar a la fase Tech)
[2] Reintentar (regenerar UI)
[3] Pausar (continuar más tarde)
```

::: tip Se recomienda previsualizar el prototipo primero
Antes de confirmar en el asistente de IA, abre primero el prototipo en el navegador para verificar si el diseño cumple las expectativas. Una vez que entres a la fase Tech, el costo de modificar el diseño será mayor.
:::

## Advertencias de Trampas

### Trampa 1: No Usar la Skill ui-ux-pro-max

**Ejemplo de error**:
```
El asistente de IA seleccionó por sí mismo el estilo glassmorphism, paleta de colores azul
```

**Consecuencia**: El scheduler Sisyphus rechazará los productos, solicitando re-ejecución.

**Recomendación**:
```
El asistente de IA debe llamar primero a la skill ui-ux-pro-max, obtener el sistema de diseño recomendado
```

### Trampa 2: Usar el Estilo Predeterminado de IA

**Ejemplo de error**:
- Fondo con gradientes morados/rosas
- Fuente Inter o Roboto
- Emoji como iconos de UI

**Consecuencia**: El diseño no es profesional, fácilmente reconocible como generado por IA, afecta la imagen del producto.

**Recomendación**:
- Seleccionar de las 57 combinaciones de fuentes recomendadas por ui-ux-pro-max
- Usar bibliotecas de iconos SVG (Heroicons/Lucide)
- Evitar el uso excesivo de gradientes y colores neón

### Trampa 3: Número de Páginas Excede 3

**Ejemplo de error**:
```
Se generaron 5 páginas: inicio, detalle, crear, editar, configuración
```

**Consecuencia**: El alcance del MVP se descontrola, aumenta significativamente el trabajo de las fases Tech y Code.

**Recomendación**: Controlar en 1-3 páginas, enfocarse en el flujo de uso principal.

### Trampa 4: Prototipo Sin Retroalimentación de Interacción

**Ejemplo de error**:
```
Los botones no tienen estado hover, los enlaces no tienen cursor-pointer
```

**Consecuencia**: Mala experiencia de usuario, prototipo poco realista.

**Recomendación**: Agregar `cursor-pointer` y estado hover a todos los elementos clicables (transición de 150-300ms).

### Trampa 5: Contraste Insuficiente en Modo Claro

**Ejemplo de error**:
```
Color de fondo de tarjeta de vidrio bg-white/10 (demasiado transparente), color de texto #94A3B8 (demasiado claro)
```

**Consecuencia**: En modo claro el contenido no es visible, no cumple con los estándares de accesibilidad.

**Recomendación**:
- Las tarjetas de vidrio en modo claro usan `bg-white/80` o mayor
- Contraste de texto >= 4.5:1 (estándar WCAG AA)

### Trampa 6: Inconsistencia Entre Prototipo y Schema

**Ejemplo de error**:
```
El schema define 2 páginas, pero el prototipo muestra 3 páginas
```

**Consecuencia**: Las fases Tech y Code se confundirán, sin saber cuál tomar como referencia.

**Recomendación**: Asegurar que el prototipo y el schema sean completamente consistentes, el número de páginas y la estructura de componentes deben corresponder.

## Resumen de Esta Lección

El núcleo de la fase UI es el **sistema de diseño**:

1. **Entrada**: Documento PRD claro (`artifacts/prd/prd.md`)
2. **Proceso**: El asistente de IA genera un sistema de diseño profesional a través de la skill ui-ux-pro-max
3. **Salida**: `ui.schema.yaml` (sistema de diseño + estructura de interfaz) + `preview.web/index.html` (prototipo previsualizable)
4. **Verificación**: Verificar si el sistema de diseño es profesional, si el prototipo es previsualizable, si se evitó el estilo predeterminado de IA

::: tip Principios Clave
- ❌ Qué no hacer: No decidir stack tecnológico, no escribir código frontend, no usar estilo predeterminado de IA
- ✅ Qué sí hacer: Generar sistema de diseño, diseñar estructura de interfaz, crear prototipo previsualizable
:::

## Avance de la Próxima Lección

> La próxima lección aprenderemos **[Fase 4: Tech - Diseño de Arquitectura Técnica](../stage-tech/)**.
>
> Aprenderás:
> - Cómo diseñar la arquitectura técnica según el PRD y UI Schema
> - Cómo seleccionar el stack tecnológico adecuado (Express + Prisma + React Native)
> - Cómo diseñar el modelo de datos mínimo viable (Prisma Schema)
> - Por qué la fase Tech no puede involucrar detalles de implementación de UI

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-29

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Definición del UI Agent | [`agents/ui.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/ui.agent.md) | 1-98 |
| UI Skill | [`skills/ui/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/ui/skill.md) | 1-430 |
| Definición del Pipeline (Fase UI) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 34-47 |
| Definición del Scheduler | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Restricciones Clave**:
- **Uso obligatorio de la skill ui-ux-pro-max**: ui.agent.md:33, 53-54
- **Prohibida la paleta de colores de estilo IA**: ui.agent.md:36
- **Prohibidos los iconos emoji**: ui.agent.md:37
- **Debe agregar cursor-pointer y estado hover**: ui.agent.md:38
- **Prototipo no excede 3 páginas**: ui.agent.md:34
- **Usar HTML/CSS/JS nativo**: ui.agent.md:35

**Condiciones de Salida** (pipeline.yaml:43-47):
- ui.schema.yaml existe
- Número de páginas no excede 3
- Página de previsualización se puede abrir en el navegador
- El Agent ha usado la skill `ui-ux-pro-max` para generar el sistema de diseño

**Marco de Contenido de la UI Skill**:
- **Marco de Pensamiento**: Propósito, Tono, Diferenciación, Arquitectura de Información
- **Flujo de Trabajo de Generación del Sistema de Diseño**: Analizar requisitos → Generar sistema de diseño → Búsqueda complementaria → Obtener guía del stack tecnológico
- **67 Estilos de UI**: Minimalismo, Neumorfismo, Glassmorphism, Brutalismo, etc.
- **Reglas de Razonamiento de la Industria**: 100 reglas, recomendación automática del sistema de diseño según tipo de producto
- **Guía del Sistema de Diseño**: Sistema de colores, Sistema de tipografía, Sistema de espaciado, Especificaciones de componentes
- **Lista de Verificación Pre-entrega**: Calidad visual, Interacción, Modo claro/oscuro, Diseño, Accesibilidad
- **Principios de Decisión**: Orientado al propósito, Mobile-first, Accesibilidad, Simplicidad limitada, Consistencia de previsualización, Prioridad de herramientas
- **NO HACER (NEVER)**: Fuentes/paletas de estilo IA, iconos emoji, bajo contraste, más de 3 páginas, etc.

</details>
