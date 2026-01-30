---
title: "Anotación de Imágenes: Tres Herramientas de Marcado | Plannotator"
sidebarTitle: "Marcar Imágenes con Tres Herramientas"
subtitle: "Anotación de Imágenes: Tres Herramientas de Marcado"
description: "Aprende las tres herramientas de anotación de imágenes de Plannotator. Adjunta imágenes en la revisión de planes, usa pincel, flecha y círculo para marcar, con soporte para ajuste de colores y atajos de teclado."
tags:
  - "Anotación de imágenes"
  - "Pincel"
  - "Flecha"
  - "Círculo"
  - "Atajos de teclado"
  - "Revisión de planes"
  - "Revisión de código"
prerequisite:
  - "platforms-plan-review-basics"
order: 3
---

# Agregar Anotaciones de Imagen: Marcar con Pincel, Flecha y Círculo

## Lo Que Aprenderás

- ✅ Adjuntar imágenes en la revisión de planes o código
- ✅ Usar la herramienta de pincel para dibujo libre
- ✅ Usar la herramienta de flecha para señalar áreas importantes
- ✅ Usar la herramienta de círculo para seleccionar regiones
- ✅ Ajustar el color y grosor del trazo
- ✅ Usar atajos de teclado para cambiar herramientas rápidamente

## Tu Situación Actual

**Problema 1**: Al revisar diseños de UI o diagramas de flujo, las descripciones textuales no son suficientemente claras y necesitas marcar las áreas problemáticas.

**Problema 2**: Quieres agregar capturas de pantalla con anotaciones a la revisión de código, pero solo puedes usar texto como "hay un problema aquí", sin poder marcar directamente en la imagen.

**Problema 3**: Recibes enlaces de imágenes compartidas por el equipo y quieres agregar comentarios rápidamente, pero no quieres descargarlas localmente para procesarlas con otras herramientas.

**Plannotator te ayuda**:
- Anota imágenes directamente en el navegador, sin necesidad de descargarlas
- Tres herramientas: pincel, flecha y círculo, cubriendo todos los escenarios de anotación
- Cinco colores y cinco tamaños de trazo para ajustar el efecto de las anotaciones
- Atajos de teclado para mejorar la eficiencia

## Cuándo Usar Esta Técnica

**Escenarios de uso**:
- Revisar diseños de UI, diagramas de flujo o arquitectura que requieren marcar problemas
- Agregar capturas de pantalla con anotaciones durante la revisión de código
- Compartir imágenes anotadas con miembros del equipo
- Seleccionar áreas importantes o agregar flechas indicativas en imágenes

## 🎒 Preparación Previa

::: warning Prerrequisitos

Este tutorial asume que ya has:

- ✅ Completado [Fundamentos de Revisión de Planes](../plan-review-basics/) o [Fundamentos de Revisión de Código](../code-review-basics/)
- ✅ Sabes cómo abrir la página de revisión de planes o código
- ✅ Conoces las operaciones básicas de anotación

:::

## Concepto Principal

**Las tres herramientas de anotación de imágenes**:

| Herramienta | Icono | Atajo | Uso |
| --- | --- | --- | --- |
| **Pincel** | 🖊️ | 1 | Dibujo libre, ideal para notas manuscritas o seleccionar formas arbitrarias |
| **Flecha** | ➡️ | 2 | Señalar áreas importantes o indicar dirección, ideal para marcado punto a punto |
| **Círculo** | ⭕ | 3 | Seleccionar regiones, ideal para resaltar elementos específicos |

**Flujo de trabajo**:
```
Subir imagen → Seleccionar herramienta → Ajustar color y tamaño → Dibujar en la imagen → Guardar
```

## Paso a Paso

### Paso 1: Abrir la Página de Revisión de Planes o Código

**Por qué**
La función de anotación de imágenes de Plannotator está integrada en la revisión de planes y código.

**Acción**

1. Inicia la revisión de planes (activada por Claude Code o llamando a submit_plan en OpenCode)
2. O ejecuta el comando `/plannotator-review` para iniciar la revisión de código

**Deberías ver**:
- El navegador abre la página de revisión
- En la esquina superior derecha hay un botón «Upload» o «Adjuntar»

### Paso 2: Subir una Imagen

**Por qué**
Necesitas subir una imagen antes de poder anotarla.

**Acción**

1. Haz clic en el botón «Upload» o «Adjuntar» en la esquina superior derecha
2. Selecciona la imagen a anotar (formatos soportados: PNG, JPEG, WebP)
3. Después de subir, la imagen aparecerá en la lista de anotaciones

**Deberías ver**:
- La miniatura de la imagen aparece en el área de anotaciones
- Al hacer clic en la miniatura se abre el editor de anotaciones

::: tip Fuentes de Imágenes
Puedes obtener imágenes de las siguientes formas:
- Captura de pantalla y pegar (Ctrl+V / Cmd+V)
- Seleccionar desde archivos locales
- Arrastrar y soltar imágenes en la página
:::

### Paso 3: Abrir el Editor de Anotaciones de Imagen

**Por qué**
El editor de anotaciones proporciona herramientas de dibujo y selección de colores.

**Acción**

1. Haz clic en la miniatura de la imagen subida
2. El editor de anotaciones se abrirá en una ventana emergente

**Deberías ver**:
- La imagen centrada en pantalla
- Una barra de herramientas en la parte superior
- La barra de herramientas de izquierda a derecha: selección de herramienta, tamaño de trazo, selección de color, deshacer, limpiar, guardar

### Paso 4: Usar la Herramienta de Pincel para Dibujo Libre

**Por qué**
La herramienta de pincel es ideal para notas manuscritas o seleccionar formas arbitrarias.

**Acción**

1. Asegúrate de que la herramienta de pincel esté seleccionada (icono 🖊️, seleccionada por defecto)
2. Mantén presionado el botón izquierdo del ratón y dibuja en la imagen
3. Suelta el ratón para completar el dibujo

**Deberías ver**:
- El trazo sigue el movimiento del ratón
- Al soltar el ratón, la forma dibujada queda fija en la imagen

::: info Características del Pincel
- Usa la biblioteca perfect-freehand para un efecto de dibujo suave
- Soporta sensibilidad a la presión (si tu dispositivo lo permite)
- Cuanto más grueso el trazo, más suave la línea
:::

### Paso 5: Usar la Herramienta de Flecha para Señalar Puntos Importantes

**Por qué**
Las flechas son ideales para marcado punto a punto, indicando claramente la ubicación del problema.

**Acción**

1. Haz clic en la herramienta de flecha (icono ➡️) o presiona el atajo `2`
2. Haz clic en la imagen para definir el punto de inicio de la flecha
3. Arrastra hasta la posición objetivo y suelta el ratón para completar la flecha

**Deberías ver**:
- Una línea recta desde el punto de inicio hasta el punto final
- Una punta de flecha en el punto final, apuntando hacia el objetivo

::: tip Consejos para Dibujar Flechas
- El **punto de inicio** es la cola de la flecha, el **punto final** es la cabeza
- Durante el arrastre puedes ver una vista previa en tiempo real de la dirección
- Ideal para marcar "hay un problema aquí" o "necesita modificación aquí"
:::

### Paso 6: Usar la Herramienta de Círculo para Seleccionar Regiones

**Por qué**
Los círculos son ideales para resaltar elementos específicos, con una selección clara del área.

**Acción**

1. Haz clic en la herramienta de círculo (icono ⭕) o presiona el atajo `3`
2. Haz clic en la imagen para definir un borde del círculo
3. Arrastra hasta el borde opuesto y suelta el ratón para completar el círculo

**Deberías ver**:
- Un círculo donde la línea entre el punto inicial y final es el diámetro
- El centro del círculo es el punto medio de la línea entre los dos puntos

::: details Principio de Dibujo del Círculo

La herramienta de círculo dibuja de borde a borde:
- **Primer clic**: Un borde del círculo
- **Arrastrar**: Define el diámetro del círculo
- **Soltar**: Completa el círculo

Implementación en código fuente (`utils.ts:95-124`):
```typescript
// El centro es el punto medio entre inicio y fin
const cx = (x1 + x2) / 2;
const cy = (y1 + y2) / 2;

// El radio es la mitad de la distancia entre los dos puntos
const radius = Math.hypot(x2 - x1, y2 - y1) / 2;
```

:::

### Paso 7: Ajustar el Color de las Anotaciones

**Por qué**
Diferentes colores pueden distinguir diferentes tipos de anotaciones (por ejemplo, rojo para errores, verde para sugerencias).

**Acción**

1. Haz clic en los puntos de color en la barra de herramientas
2. Colores disponibles: rojo, amarillo, verde, azul, blanco

**Deberías ver**:
- El punto del color seleccionado se muestra más grande
- Todas las nuevas anotaciones usarán el color actual

::: info Sugerencias de Uso de Colores
- **Rojo**: Errores, problemas, contenido a eliminar
- **Amarillo**: Advertencias, atención, puntos a confirmar
- **Verde**: Sugerencias, optimizaciones, mejoras
- **Azul**: Información adicional, notas
- **Blanco**: Adecuado para imágenes con fondo oscuro
:::

### Paso 8: Ajustar el Tamaño del Trazo

**Por qué**
Diferentes tamaños de trazo son adecuados para diferentes escenarios de anotación.

**Acción**

1. Haz clic en los botones `-` o `+` en la barra de herramientas
2. O observa la vista previa del tamaño actual del trazo (un punto)

**Deberías ver**:
- Tamaños de trazo disponibles: 3, 6, 10, 16, 24
- En el centro de la barra de herramientas se muestra un punto de vista previa del tamaño actual

::: tip Sugerencias de Tamaño de Trazo
- **3**: Anotación precisa de elementos pequeños (como botones, iconos)
- **6**: Anotación regular (valor predeterminado)
- **10**: Trazo grueso, adecuado para seleccionar áreas grandes
- **16**: Trazo muy grueso, adecuado para enfatizar puntos importantes
- **24**: Trazo máximo, adecuado para resaltar áreas muy grandes
:::

### Paso 9: Deshacer y Limpiar

**Por qué**
Es inevitable cometer errores durante la anotación, necesitas deshacer o empezar de nuevo.

**Acción**

1. **Deshacer el último paso**: Haz clic en el icono de deshacer (↩️) o presiona `Cmd+Z` / `Ctrl+Z`
2. **Limpiar todas las anotaciones**: Haz clic en el icono de limpiar (❌)

**Deberías ver**:
- Deshacer: La última anotación dibujada desaparece
- Limpiar: Todas las anotaciones se eliminan, volviendo a la imagen original

::: warning Aviso sobre Limpiar
La operación de limpiar no se puede deshacer, úsala con precaución. Se recomienda usar deshacer para retroceder paso a paso.
:::

### Paso 10: Guardar las Anotaciones

**Por qué**
Después de guardar, la imagen se fusionará con las anotaciones y podrá verse en la revisión.

**Acción**

1. Haz clic en el icono de guardar (✅) en el lado derecho de la barra de herramientas
2. O presiona las teclas `Esc` o `Enter`
3. O haz clic fuera de la ventana emergente

**Deberías ver**:
- La ventana emergente se cierra
- La miniatura de la imagen se actualiza con la versión anotada
- La imagen se adjunta a la anotación actual

::: tip Mecanismo de Guardado
- Si **no has dibujado ninguna anotación**, se guarda la imagen original directamente
- Si **hay anotaciones**, la imagen original y las anotaciones se fusionan en una nueva imagen
- La imagen fusionada se guarda en formato PNG, manteniendo alta calidad
:::

## Punto de Verificación ✅

**Verifica tu aprendizaje**:

- [ ] Puedes subir imágenes exitosamente a la página de revisión
- [ ] Puedes usar las tres herramientas (pincel, flecha, círculo) para dibujar anotaciones
- [ ] Puedes ajustar el color y tamaño del trazo de las anotaciones
- [ ] Puedes usar atajos de teclado (1/2/3, Cmd+Z, Esc) para operaciones rápidas
- [ ] Puedes deshacer anotaciones erróneas
- [ ] Puedes guardar imágenes anotadas

## Errores Comunes

### Problema 1: La Flecha Apunta en Dirección Incorrecta

**Síntoma**: La flecha apunta en la dirección equivocada.

**Causa**: La herramienta de flecha dibuja desde el punto de inicio (cola) hasta el punto final (cabeza).

**Solución**:
- Vuelve a dibujar, asegurándote de que el punto de inicio sea la cola y el punto final sea la cabeza
- Si ya dibujaste, deshaz y vuelve a dibujar

### Problema 2: El Círculo Está en Posición Incorrecta

**Síntoma**: El círculo no selecciona el área objetivo.

**Causa**: La herramienta de círculo dibuja de borde a borde, el centro es el punto medio entre los dos puntos.

**Solución**:
- El primer clic debe ser en el borde del área objetivo
- Arrastra hasta el borde opuesto, asegurándote de que el área objetivo esté dentro del círculo
- Puedes deshacer y volver a dibujar para ajustar

### Problema 3: El Trazo Es Demasiado Grueso o Fino

**Síntoma**: El efecto de la anotación no es ideal.

**Causa**: El tamaño del trazo no es adecuado para el escenario actual.

**Solución**:
- Usa los botones `-` o `+` en la barra de herramientas para ajustar el tamaño
- Usa 3-6 para elementos pequeños, 10-24 para áreas grandes

### Problema 4: El Color No Se Ve Bien

**Síntoma**: Usas un trazo oscuro en un fondo oscuro y la anotación no se ve.

**Causa**: Selección de color inadecuada.

**Solución**:
- Usa blanco o amarillo en fondos oscuros
- Usa rojo, verde o azul en fondos claros

## Referencia Rápida de Atajos

| Atajo | Función |
| --- | --- |
| `1` | Cambiar a herramienta de pincel |
| `2` | Cambiar a herramienta de flecha |
| `3` | Cambiar a herramienta de círculo |
| `Cmd+Z` / `Ctrl+Z` | Deshacer último paso |
| `Esc` / `Enter` | Guardar anotaciones |

## Resumen de Esta Lección

En esta lección aprendiste:

1. **Subir imágenes**: A través del botón de subir o pegando en la página de revisión
2. **Tres herramientas de anotación**:
   - Pincel (1): Dibujo libre, ideal para notas manuscritas
   - Flecha (2): Marcado punto a punto, ideal para señalar puntos importantes
   - Círculo (3): Selección de regiones, ideal para resaltar elementos
3. **Ajustar estilos de anotación**: 5 colores, 5 tamaños de trazo
4. **Deshacer y limpiar**: Corregir anotaciones erróneas
5. **Guardar anotaciones**: Fusionar las anotaciones con la imagen

## Próxima Lección

> En la próxima lección aprenderemos **[Fundamentos de Revisión de Código](../code-review-basics/)**.
>
> Aprenderás:
> - Cómo usar el comando /plannotator-review para revisar git diff
> - Cambiar entre vistas side-by-side y unified
> - Hacer clic en números de línea para seleccionar rangos de código
> - Agregar comentarios a nivel de línea (comment/suggestion/concern)
> - Cambiar entre diferentes tipos de diff
> - Enviar feedback al AI Agent

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Definición de tipos de herramientas | [`packages/ui/components/ImageAnnotator/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/types.ts#L1-L40) | 1-40 |
| Funciones de renderizado | [`packages/ui/components/ImageAnnotator/utils.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/utils.ts#L1-L148) | 1-148 |
| Componente principal | [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx#L1-L233) | 1-233 |
| Componente de barra de herramientas | [`packages/ui/components/ImageAnnotator/Toolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/Toolbar.tsx#L1-L219) | 1-219 |
| Interfaz Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |

**Tipos clave**:

**Tool** (tipo de herramienta):
```typescript
export type Tool = 'pen' | 'arrow' | 'circle';
```

**Point** (punto de coordenadas):
```typescript
export interface Point {
  x: number;
  y: number;
  pressure?: number;
}
```

**Stroke** (trazo):
```typescript
export interface Stroke {
  id: string;
  tool: Tool;
  points: Point[];
  color: string;
  size: number;
}
```

**AnnotatorState** (estado del anotador):
```typescript
export interface AnnotatorState {
  tool: Tool;
  color: string;
  strokeSize: number;
  strokes: Stroke[];
  currentStroke: Stroke | null;
}
```

**COLORS** (array de colores):
```typescript
export const COLORS = [
  '#ef4444', // rojo
  '#eab308', // amarillo
  '#22c55e', // verde
  '#3b82f6', // azul
  '#ffffff', // blanco
] as const;
```

**STROKE_SIZES** (tamaños de trazo):
```typescript
const STROKE_SIZES = [3, 6, 10, 16, 24];
```

**Funciones clave**:

**renderPenStroke()** (renderizar trazo de pincel):
- Usa la biblioteca perfect-freehand para un efecto de dibujo suave
- Soporta sensibilidad a la presión (campo pressure)

**renderArrow()** (renderizar flecha):
- Dibuja una línea recta desde el punto de inicio hasta el punto final
- Dibuja la cabeza de la flecha en el punto final

**renderCircle()** (renderizar círculo):
- Calcula el punto medio de los dos puntos como centro
- Calcula la mitad de la distancia entre los dos puntos como radio

**renderStroke()** (renderizar según tipo de herramienta):
- Llama a la función de renderizado correspondiente según el campo tool
- Soporta escalado (parámetro scale)

**Annotation.imagePaths** (campo de imágenes adjuntas):
```typescript
export interface Annotation {
  // ...
  imagePaths?: string[]; // Imágenes adjuntas (rutas locales o URLs)
}
```

**Manejo de atajos de teclado** (index.tsx:33-59):
```typescript
// 1/2/3 para cambiar herramientas
if (e.key === '1') setState(s => ({ ...s, tool: 'pen' }));
if (e.key === '2') setState(s => ({ ...s, tool: 'arrow' }));
if (e.key === '3') setState(s => ({ ...s, tool: 'circle' }));

// Cmd+Z para deshacer
if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
  e.preventDefault();
  handleUndo();
}
```

</details>
