---
title: "Compartir por URL: Colaboración sin Backend | Plannotator"
sidebarTitle: "Compartir con el equipo"
subtitle: "Compartir por URL: Colaboración sin Backend"
description: "Aprende la función de compartir por URL de Plannotator. Colabora sin backend mediante compresión deflate y codificación Base64, configura variables de entorno y resuelve problemas comunes."
tags:
  - "Compartir URL"
  - "Colaboración en equipo"
  - "Sin backend"
  - "Compresión deflate"
  - "Codificación Base64"
  - "Seguridad"
prerequisite:
  - "start-getting-started"
  - "platforms-plan-review-basics"
order: 1
---

# Compartir por URL: Colaboración de planes sin backend

## Lo que aprenderás

- ✅ Compartir planes y anotaciones mediante URL, sin necesidad de cuenta ni servidor
- ✅ Entender cómo la compresión deflate y la codificación Base64 incrustan datos en el hash de la URL
- ✅ Distinguir entre modo compartido (solo lectura) y modo local (editable)
- ✅ Configurar la variable de entorno `PLANNOTATOR_SHARE` para controlar la función de compartir
- ✅ Manejar límites de longitud de URL y fallos al compartir

## Tu situación actual

**Problema 1**: Quieres que tu equipo revise un plan generado por IA, pero no tienes una plataforma de colaboración.

**Problema 2**: Compartes capturas de pantalla o texto copiado, pero el destinatario no puede ver tus anotaciones directamente.

**Problema 3**: Desplegar un servidor de colaboración es costoso, o las políticas de seguridad de tu empresa no lo permiten.

**Problema 4**: Necesitas una forma rápida y sencilla de compartir, pero no sabes cómo garantizar la privacidad de los datos.

**Plannotator te ayuda**:
- Sin necesidad de servidor backend, todos los datos se comprimen en la URL
- El enlace compartido contiene el plan completo y las anotaciones, el destinatario puede verlo todo
- Los datos no salen de tu dispositivo local, garantizando privacidad
- La URL generada se puede copiar a cualquier herramienta de comunicación

## Cuándo usar esta técnica

**Casos de uso**:
- Necesitas que el equipo revise un plan de implementación generado por IA
- Quieres compartir resultados de revisión de código con colegas
- Necesitas guardar contenido de revisión en notas (integración con Obsidian/Bear)
- Obtener feedback rápido sobre un plan

**Casos no recomendados**:
- Necesitas colaboración en tiempo real (compartir en Plannotator es solo lectura)
- El contenido del plan excede el límite de longitud de URL (normalmente miles de líneas)
- El contenido compartido incluye información sensible (la URL no está cifrada)

::: warning Aviso de seguridad
La URL compartida contiene el plan completo y las anotaciones. No compartas contenido con información sensible (como claves API, contraseñas, etc.). La URL puede ser accedida por cualquiera y no expira automáticamente.
:::

## Concepto central

### ¿Qué es compartir por URL?

**Compartir por URL** es un método de colaboración sin backend que ofrece Plannotator, que comprime el plan y las anotaciones en el hash de la URL, permitiendo compartir sin necesidad de servidor.

::: info ¿Por qué se llama "sin backend"?
Las soluciones de colaboración tradicionales requieren un servidor backend para almacenar planes y anotaciones, y los usuarios acceden mediante ID o token. Compartir por URL en Plannotator no depende de ningún backend—todos los datos están en la URL, y el destinatario puede analizar el contenido simplemente abriendo el enlace. Esto garantiza privacidad (los datos no se suben) y simplicidad (no hay que desplegar servicios).
:::

### Cómo funciona

```
┌─────────────────────────────────────────────────────────┐
│  Usuario A (quien comparte)                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Revisa el plan, añade anotaciones                  │
│     ┌──────────────────────┐                           │
│     │ Plan: Plan de impl.  │                           │
│     │ Annotations: [       │                           │
│     │   {type: 'REPLACE'},│                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│              │                                         │
│              ▼                                         │
│  2. Clic en Export → Share                             │
│              │                                         │
│              ▼                                         │
│  3. Comprime los datos                                 │
│     JSON → deflate → Base64 → caracteres seguros URL    │
│     ↓                                                │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Copiar URL
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Usuario B (destinatario)                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Abre la URL compartida                             │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│              │                                         │
│              ▼                                         │
│  2. El navegador analiza el hash                       │
│     Caracteres URL → decodificar Base64 → descomprimir │
│     deflate → JSON                                     │
│              │                                         │
│              ▼                                         │
│  3. Restaura el plan y las anotaciones                 │
│     ┌──────────────────────┐                           │
│     │ Plan: Plan de impl.  │  ✅ Modo solo lectura    │
│     │ Annotations: [       │  (no puede enviar        │
│     │   {type: 'REPLACE'},│   decisiones)            │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Algoritmo de compresión en detalle

**Paso 1: Serialización JSON**
```json
{
  "p": "# Plan\n\nStep 1...",
  "a": [
    ["R", "old text", "new text", null, null],
    ["C", "context", "comment text", null, null]
  ],
  "g": ["image1.png", "image2.png"]
}
```

**Paso 2: Compresión Deflate-raw**
- Usa la API nativa `CompressionStream('deflate-raw')`
- Tasa de compresión típica del 60-80% (depende de la repetición del texto, no definido en el código fuente)
- Ubicación en el código: `packages/ui/utils/sharing.ts:34`

**Paso 3: Codificación Base64**
```typescript
const base64 = btoa(String.fromCharCode(...compressed));
```

**Paso 4: Reemplazo de caracteres seguros para URL**
```typescript
base64
  .replace(/\+/g, '-')   // + → -
  .replace(/\//g, '_')   // / → _
  .replace(/=/g, '');    // = → '' (eliminar relleno)
```

::: tip ¿Por qué reemplazar caracteres especiales?
Algunos caracteres tienen significado especial en URLs (como `+` representa espacio, `/` es separador de ruta). La codificación Base64 puede incluir estos caracteres, causando errores de análisis de URL. Al reemplazarlos por `-` y `_`, la URL se vuelve segura y copiable.
:::

### Optimización del formato de anotaciones

Para eficiencia de compresión, Plannotator usa un formato compacto de anotaciones (`ShareableAnnotation`):

| Annotation original | Formato compacto | Descripción |
| --- | --- | --- |
| `{type: 'DELETION', originalText: '...', text: undefined, ...}` | `['D', 'old text', null, images?]` | D = Deletion, null indica sin text |
| `{type: 'REPLACEMENT', originalText: '...', text: 'new...', ...}` | `['R', 'old text', 'new text', null, images?]` | R = Replacement |
| `{type: 'COMMENT', originalText: '...', text: 'comment...', ...}` | `['C', 'old text', 'comment text', null, images?]` | C = Comment |
| `{type: 'INSERTION', originalText: '...', text: 'new...', ...}` | `['I', 'context', 'new text', null, images?]` | I = Insertion |
| `{type: 'GLOBAL_COMMENT', text: '...', ...}` | `['G', 'comment text', null, images?]` | G = Global comment |

El orden de campos es fijo, se omiten nombres de claves, reduciendo significativamente el tamaño de datos. Ubicación en el código: `packages/ui/utils/sharing.ts:76`

### Estructura de la URL compartida

```
https://share.plannotator.ai/#<compressed_data>
                            ↑
                        parte hash
```

- **Dominio base**: `share.plannotator.ai` (página de compartir independiente)
- **Separador hash**: `#` (no se envía al servidor, analizado completamente por el frontend)
- **Datos comprimidos**: JSON comprimido codificado en Base64url

## 🎒 Preparación previa

**Requisitos previos**:
- ✅ Completado [Fundamentos de revisión de planes](../../platforms/plan-review-basics/), entiendes cómo añadir anotaciones
- ✅ Completado [Tutorial de anotaciones de planes](../../platforms/plan-review-annotations/), conoces los tipos de anotaciones
- ✅ Tu navegador soporta la API `CompressionStream` (todos los navegadores modernos la soportan)

**Verificar si la función de compartir está habilitada**:
```bash
# Habilitada por defecto
echo $PLANNOTATOR_SHARE

# Para deshabilitar (por ejemplo, política de seguridad empresarial)
export PLANNOTATOR_SHARE=disabled
```

::: info Explicación de la variable de entorno
`PLANNOTATOR_SHARE` controla el estado de la función de compartir:
- **No configurada o diferente de "disabled"**: función de compartir habilitada
- **Configurada como "disabled"**: función deshabilitada (Export Modal solo muestra la pestaña Raw Diff)

Ubicación en el código: `apps/hook/server/index.ts:44`, `apps/opencode-plugin/index.ts:50`
:::

**Verificar compatibilidad del navegador**:
```bash
# Ejecutar en la consola del navegador
const stream = new CompressionStream('deflate-raw');
console.log('CompressionStream supported');
```

Si muestra `CompressionStream supported`, tu navegador es compatible. Los navegadores modernos (Chrome 80+, Firefox 113+, Safari 16.4+) lo soportan.

## Paso a paso

### Paso 1: Completar la revisión del plan

**Por qué**
Antes de compartir, necesitas completar la revisión, incluyendo añadir anotaciones.

**Acciones**:
1. En Claude Code u OpenCode, activa la revisión del plan
2. Revisa el contenido del plan, selecciona el texto a modificar
3. Añade anotaciones (eliminar, reemplazar, comentar, etc.)
4. (Opcional) Sube imágenes adjuntas

**Deberías ver**:
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                                              │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│                    └─────────────────────┘               │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [Approve] [Request Changes] [Export]                   │
└─────────────────────────────────────────────────────────────┘
```

### Paso 2: Abrir el Export Modal

**Por qué**
El Export Modal proporciona el punto de entrada para generar la URL compartida.

**Acciones**:
1. Haz clic en el botón **Export** en la esquina superior derecha
2. Espera a que se abra el Export Modal

**Deberías ver**:
```
┌─────────────────────────────────────────────────────────────┐
│  Export                                     ×             │
│  1 annotation                          Share | Raw Diff   │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                              [Copy] │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                           │
│  This URL contains full plan and all annotations.          │
│  Anyone with this link can view and add to your annotations.│
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

::: tip Indicador de tamaño de URL
La esquina inferior derecha muestra el tamaño en bytes de la URL (ej. 3.2 KB). Si la URL es muy larga (más de 8 KB), considera reducir el número de anotaciones o imágenes adjuntas.
:::

### Paso 3: Copiar la URL compartida

**Por qué**
Después de copiar la URL, puedes pegarla en cualquier herramienta de comunicación (Slack, Email, WeChat, etc.).

**Acciones**:
1. Haz clic en el botón **Copy**
2. Espera a que el botón cambie a **Copied!**
3. La URL ya está en tu portapapeles

**Deberías ver**:
```
┌─────────────────────────────────────────────────────────────┐
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                    ✓ Copied         │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

::: tip Selección automática
Al hacer clic en el campo de URL se selecciona automáticamente todo el contenido, facilitando la copia manual (si no usas el botón Copy).
:::

### Paso 4: Compartir la URL con colaboradores

**Por qué**
Los colaboradores pueden ver el plan y las anotaciones abriendo la URL.

**Acciones**:
1. Pega la URL en tu herramienta de comunicación (Slack, Email, etc.)
2. Envíala a los miembros del equipo

**Mensaje de ejemplo**:
```
Hola @equipo,

Por favor revisen este plan de implementación:
https://share.plannotator.ai/#eJyrVkrLz1...

Añadí una anotación de reemplazo en la Fase 2, creo que JWT es demasiado complejo.

¡Agradezco sus comentarios!
```

### Paso 5: El colaborador abre la URL compartida (destinatario)

**Por qué**
El colaborador necesita abrir la URL en el navegador para ver el contenido.

**Acciones** (ejecutadas por el colaborador):
1. Haz clic en la URL compartida
2. Espera a que cargue la página

**Deberías ver** (perspectiva del colaborador):
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                               Read-only     │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│  │                  └─────────────────────┘               │
│  │ This annotation was shared by [Your Name]             │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [View Only Mode - Approve and Deny disabled]            │
└─────────────────────────────────────────────────────────────┘
```

::: warning Modo solo lectura
Cuando se abre una URL compartida, la interfaz muestra la etiqueta "Read-only" en la esquina superior derecha, y los botones Approve y Deny están deshabilitados. El colaborador puede ver el plan y las anotaciones, pero no puede enviar decisiones.
:::

::: info Proceso de descompresión
Cuando el colaborador abre la URL, el navegador ejecuta automáticamente los siguientes pasos (activados por el Hook `useSharing`):
1. Extrae los datos comprimidos de `window.location.hash`
2. Ejecuta en orden inverso: decodificación Base64 → descompresión deflate → análisis JSON
3. Restaura el plan y las anotaciones
4. Limpia el hash de la URL (evita recargar al refrescar)

Ubicación en el código: `packages/ui/hooks/useSharing.ts:67`
:::

### Punto de verificación ✅

**Verificar que la URL compartida funciona**:
1. Copia la URL compartida
2. Ábrela en una nueva pestaña o modo incógnito
3. Confirma que muestra el mismo plan y anotaciones

**Verificar el modo solo lectura**:
1. El colaborador abre la URL compartida
2. Verifica que hay una etiqueta "Read-only" en la esquina superior derecha
3. Confirma que los botones Approve y Deny están deshabilitados

**Verificar la longitud de la URL**:
1. Revisa el tamaño de la URL en el Export Modal
2. Confirma que no excede 8 KB (si lo hace, considera reducir anotaciones)

## Solución de problemas

### Problema 1: El botón de compartir URL no aparece

**Síntoma**: El Export Modal no tiene la pestaña Share, solo Raw Diff.

**Causa**: La variable de entorno `PLANNOTATOR_SHARE` está configurada como "disabled".

**Solución**:
```bash
# Verificar el valor actual
echo $PLANNOTATOR_SHARE

# Eliminar o establecer otro valor
unset PLANNOTATOR_SHARE
# o
export PLANNOTATOR_SHARE=enabled
```

Ubicación en el código: `apps/hook/server/index.ts:44`

### Problema 2: La URL compartida muestra una página en blanco

**Síntoma**: El colaborador abre la URL y la página está vacía.

**Causa**: El hash de la URL se perdió o truncó durante la copia.

**Solución**:
1. Asegúrate de copiar la URL completa (incluyendo `#` y todos los caracteres siguientes)
2. No uses servicios de acortamiento de URLs (pueden truncar el hash)
3. Usa el botón Copy del Export Modal en lugar de copiar manualmente

::: tip Longitud del hash de URL
La parte hash de la URL compartida normalmente tiene miles de caracteres, es fácil omitir algo al copiar manualmente. Se recomienda usar el botón Copy o verificar la integridad copiando y pegando dos veces.
:::

### Problema 3: La URL es demasiado larga para enviar

**Síntoma**: La URL excede el límite de caracteres de la herramienta de comunicación (como WeChat, Slack).

**Causa**: El contenido del plan es muy largo o hay demasiadas anotaciones.

**Solución**:
1. Elimina anotaciones innecesarias
2. Reduce las imágenes adjuntas
3. Considera exportar como Raw Diff y guardar como archivo
4. Usa la función de revisión de código (el modo diff tiene mejor tasa de compresión)

### Problema 4: El colaborador no puede ver mis imágenes

**Síntoma**: La URL compartida contiene rutas de imágenes, pero el colaborador ve "Image not found".

**Causa**: Las imágenes están guardadas en el directorio local `/tmp/plannotator/`, el colaborador no puede acceder.

**Solución**:
- Compartir por URL de Plannotator no soporta acceso a imágenes entre dispositivos
- Se recomienda usar la integración con Obsidian, las imágenes guardadas en el vault se pueden compartir
- O toma capturas de pantalla e inclúyelas en las anotaciones (descripción textual)

Ubicación en el código: `packages/server/index.ts:163` (ruta de guardado de imágenes)

### Problema 5: Modifiqué anotaciones después de compartir, pero la URL no se actualizó

**Síntoma**: Después de añadir nuevas anotaciones, la URL en el Export Modal no cambió.

**Causa**: El estado `shareUrl` no se actualizó automáticamente (caso raro, normalmente es un problema de actualización de estado de React).

**Solución**:
1. Cierra el Export Modal
2. Vuelve a abrir el Export Modal
3. La URL debería actualizarse automáticamente con el contenido más reciente

Ubicación en el código: `packages/ui/hooks/useSharing.ts:128` (función `refreshShareUrl`)

## Resumen de la lección

La **función de compartir por URL** te permite compartir planes y anotaciones sin necesidad de servidor backend:

- ✅ **Sin backend**: Los datos se comprimen en el hash de la URL, sin depender de servidor
- ✅ **Privacidad segura**: Los datos no se suben, solo se transfieren entre tú y el colaborador
- ✅ **Simple y eficiente**: Genera la URL con un clic, copia y pega para compartir
- ✅ **Modo solo lectura**: El colaborador puede ver y añadir anotaciones, pero no puede enviar decisiones

**Principios técnicos**:
1. **Compresión Deflate-raw**: Comprime los datos JSON aproximadamente 60-80%
2. **Codificación Base64**: Convierte datos binarios a texto
3. **Reemplazo de caracteres seguros para URL**: `+` → `-`, `/` → `_`, `=` → `''`
4. **Análisis del hash**: El frontend descomprime y restaura el contenido automáticamente

**Opciones de configuración**:
- `PLANNOTATOR_SHARE=disabled`: Deshabilita la función de compartir
- Por defecto habilitada: La función de compartir está disponible

## Próxima lección

> En la próxima lección aprenderemos sobre **[Integración con Obsidian](../obsidian-integration/)**.
>
> Aprenderás:
> - Detección automática de vaults de Obsidian
> - Guardar planes aprobados en Obsidian
> - Generación automática de frontmatter y etiquetas
> - Combinar compartir por URL con gestión de conocimiento en Obsidian

## Próxima lección

> En la próxima lección aprenderemos sobre **[Integración con Obsidian](../obsidian-integration/)**.
>
> Aprenderás:
> - Cómo configurar la integración con Obsidian para guardar planes automáticamente en el vault
> - Entender el mecanismo de generación de frontmatter y etiquetas
> - Usar backlinks para construir un grafo de conocimiento

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Función | Ruta del archivo | Líneas |
| --- | --- | --- |
| Comprimir datos (deflate + Base64) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L30-L48) | 30-48 |
| Descomprimir datos | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L53-L71) | 53-71 |
| Convertir formato de anotaciones (compacto) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| Restaurar formato de anotaciones | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| Generar URL compartida | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L162-L175) | 162-175 |
| Analizar hash de URL | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L181-L194) | 181-194 |
| Formatear tamaño de URL | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L199-L205) | 199-205 |
| Hook de compartir URL | [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts#L45-L155) | 45-155 |
| UI del Export Modal | [`packages/ui/components/ExportModal.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ExportModal.tsx#L1-L196) | 1-196 |
| Configuración del interruptor de compartir (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44) | 44 |
| Configuración del interruptor de compartir (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L50) | 50 |

**Constantes clave**:
- `SHARE_BASE_URL = 'https://share.plannotator.ai'`: Dominio base de la página de compartir

**Funciones clave**:
- `compress(payload: SharePayload): Promise<string>`: Comprime el payload a cadena base64url
- `decompress(b64: string): Promise<SharePayload>`: Descomprime cadena base64url a payload
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`: Convierte anotaciones completas a formato compacto
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`: Restaura formato compacto a anotaciones completas
- `generateShareUrl(markdown, annotations, attachments): Promise<string>`: Genera la URL compartida completa
- `parseShareHash(): Promise<SharePayload | null>`: Analiza el hash de la URL actual

**Tipos de datos**:
```typescript
interface SharePayload {
  p: string;  // plan markdown
  a: ShareableAnnotation[];
  g?: string[];  // global attachments
}

type ShareableAnnotation =
  | ['D', string, string | null, string[]?]  // Deletion
  | ['R', string, string, string | null, string[]?]  // Replacement
  | ['C', string, string, string | null, string[]?]  // Comment
  | ['I', string, string, string | null, string[]?]  // Insertion
  | ['G', string, string | null, string[]?];  // Global Comment
```

</details>
