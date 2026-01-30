---
title: "Registro de cambios: Historial de versiones | Plannotator"
sidebarTitle: "Ver novedades"
subtitle: "Registro de cambios: Historial de versiones | Plannotator"
description: "Conoce el historial de versiones y las nuevas funciones de Plannotator. Consulta las actualizaciones principales, correcciones de errores y mejoras de rendimiento, incluyendo revisión de código, anotación de imágenes e integración con Obsidian."
tags:
  - "Registro de cambios"
  - "Historial de versiones"
  - "Nuevas funciones"
  - "Corrección de errores"
order: 1
---

# Registro de cambios: Historial de versiones y novedades de Plannotator

## Lo que aprenderás

- ✅ Conocer el historial de versiones y las nuevas funciones de Plannotator
- ✅ Dominar las principales actualizaciones y mejoras de cada versión
- ✅ Entender las correcciones de errores y optimizaciones de rendimiento

---

## Última versión

### v0.6.7 (2026-01-24)

**Nuevas funciones**:
- **Comment mode**: Añadido modo de comentarios, permite escribir comentarios directamente en el plan
- **Type-to-comment shortcut**: Añadido atajo de teclado para escribir comentarios directamente

**Mejoras**:
- Corregido el problema de sub-agent blocking en el plugin de OpenCode
- Corregida vulnerabilidad de seguridad de prompt injection (CVE)
- Mejorada la detección inteligente de agent switching en OpenCode

**Referencia del código fuente**:
- Comment mode: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Type-to-comment: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**Correcciones**:
- Corregida vulnerabilidad de seguridad CVE en el plugin de OpenCode
- Corregido problema de sub-agent blocking para prevenir prompt injection
- Mejorada la lógica de detección inteligente de agent switching

**Referencia del código fuente**:
- OpenCode plugin: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Agent switching: [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**Mejoras**:
- **Aumento del timeout de Hook**: Incrementado el timeout de hook del valor predeterminado a 4 días, adaptándose a planes de IA de larga duración
- **Corrección de la función de copia**: Preservados los saltos de línea en las operaciones de copia
- **Nuevo atajo Cmd+C**: Añadido soporte para el atajo Cmd+C

**Referencia del código fuente**:
- Hook timeout: [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Copy newlines: [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**Nuevas funciones**:
- **Atajo Cmd+Enter**: Soporte para usar Cmd+Enter (Windows: Ctrl+Enter) para enviar aprobación o feedback

**Mejoras**:
- Optimizada la experiencia de operación con teclado

**Referencia del código fuente**:
- Keyboard shortcuts: [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
  (La función del atajo Cmd+Enter está implementada directamente en cada componente)

---

### v0.6.3 (2026-01-05)

**Correcciones**:
- Corregido el problema de skip-title-generation-prompt

**Referencia del código fuente**:
- Skip title: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**Correcciones**:
- Corregido el problema de archivos HTML no incluidos en el paquete npm del plugin de OpenCode

**Referencia del código fuente**:
- OpenCode plugin build: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**Nuevas funciones**:
- **Integración con Bear**: Soporte para guardar automáticamente los planes aprobados en la aplicación de notas Bear

**Mejoras**:
- Mejorada la lógica de generación de etiquetas en la integración con Obsidian
- Optimizado el mecanismo de detección de vault de Obsidian

**Referencia del código fuente**:
- Integración con Bear: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Integración con Obsidian: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## Lanzamientos de funciones importantes

### Función de revisión de código (2026-01)

**Nuevas funciones**:
- **Herramienta de revisión de código**: Ejecuta el comando `/plannotator-review` para revisar visualmente los Git diff
- **Comentarios a nivel de línea**: Haz clic en los números de línea para seleccionar rangos de código y añadir anotaciones de tipo comment/suggestion/concern
- **Múltiples vistas de diff**: Soporte para cambiar entre diferentes tipos de diff como uncommitted/staged/last-commit/branch
- **Integración con Agent**: Envía feedback estructurado al agente de IA con soporte para respuesta automática

**Cómo usar**:
```bash
# Ejecutar en el directorio del proyecto
/plannotator-review
```

**Tutoriales relacionados**:
- [Fundamentos de revisión de código](../../platforms/code-review-basics/)
- [Añadir anotaciones de código](../../platforms/code-review-annotations/)
- [Cambiar vistas de Diff](../../platforms/code-review-diff-types/)

**Referencia del código fuente**:
- Code review server: [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Code review UI: [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Herramienta Git diff: [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### Función de anotación de imágenes (2026-01)

**Nuevas funciones**:
- **Subir imágenes**: Sube archivos de imagen adjuntos en planes y revisiones de código
- **Herramientas de anotación**: Proporciona tres herramientas de anotación: pincel, flecha y círculo
- **Anotación visual**: Anota directamente sobre las imágenes para mejorar el feedback de revisión

**Tutoriales relacionados**:
- [Añadir anotaciones de imagen](../../platforms/plan-review-images/)

**Referencia del código fuente**:
- Image annotator: [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- Upload API: [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Integración con Obsidian (2025-12)

**Nuevas funciones**:
- **Detección automática de vaults**: Detecta automáticamente la ruta del archivo de configuración del vault de Obsidian
- **Guardado automático de planes**: Los planes aprobados se guardan automáticamente en Obsidian
- **Generación de frontmatter**: Incluye automáticamente frontmatter con created, source, tags, etc.
- **Extracción inteligente de etiquetas**: Extrae palabras clave del contenido del plan como etiquetas

**Configuración**:
No se requiere configuración adicional, Plannotator detecta automáticamente la ruta de instalación de Obsidian.

**Tutoriales relacionados**:
- [Integración con Obsidian](../../advanced/obsidian-integration/)

**Referencia del código fuente**:
- Detección de Obsidian: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Guardado en Obsidian: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Generación de Frontmatter: [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### Función de compartir por URL (2025-11)

**Nuevas funciones**:
- **Compartir sin backend**: Comprime el plan y las anotaciones en el hash de la URL, sin necesidad de servidor backend
- **Compartir con un clic**: Haz clic en Export → Share as URL para generar un enlace para compartir
- **Modo de solo lectura**: Los colaboradores pueden ver pero no pueden enviar decisiones al abrir la URL

**Implementación técnica**:
- Usa el algoritmo de compresión Deflate
- Codificación Base64 + reemplazo de caracteres seguros para URL
- Soporta un payload máximo de aproximadamente 7 etiquetas

**Tutoriales relacionados**:
- [Compartir por URL](../../advanced/url-sharing/)

**Referencia del código fuente**:
- Sharing utils: [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Share hook: [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### Modo remoto/Devcontainer (2025-10)

**Nuevas funciones**:
- **Soporte para modo remoto**: Usa Plannotator en entornos remotos como SSH, devcontainer, WSL
- **Puerto fijo**: Establece un puerto fijo mediante variables de entorno
- **Reenvío de puertos**: Muestra automáticamente la URL para que el usuario abra el navegador manualmente
- **Control del navegador**: Controla si se abre el navegador mediante la variable de entorno `PLANNOTATOR_BROWSER`

**Variables de entorno**:
- `PLANNOTATOR_REMOTE=1`: Habilita el modo remoto
- `PLANNOTATOR_PORT=3000`: Establece un puerto fijo
- `PLANNOTATOR_BROWSER=disabled`: Deshabilita la apertura automática del navegador

**Tutoriales relacionados**:
- [Modo remoto/Devcontainer](../../advanced/remote-mode/)
- [Configuración de variables de entorno](../../advanced/environment-variables/)

**Referencia del código fuente**:
- Remote mode: [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Browser control: [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## Compatibilidad de versiones

| Versión de Plannotator | Claude Code | OpenCode | Versión mínima de Bun |
| --- | --- | --- | --- |
| v0.6.x | 2.1.7+ | 1.0+ | 1.0+ |
| v0.5.x | 2.1.0+ | 0.9+ | 0.7+ |

**Recomendaciones de actualización**:
- Mantén Plannotator en la última versión para obtener las funciones más recientes y correcciones de seguridad
- Claude Code y OpenCode también deben mantenerse actualizados

---

## Cambios de licencia

**Versión actual (v0.6.7+)**: Business Source License 1.1 (BSL-1.1)

**Detalles de la licencia**:
- Permitido: uso personal, uso comercial interno
- Restringido: proporcionar servicios de hosting, productos SaaS
- Más detalles en [LICENSE](https://github.com/backnotprop/plannotator/blob/main/LICENSE)

---

## Feedback y soporte

**Reportar problemas**:
- GitHub Issues: https://github.com/backnotprop/plannotator/issues

**Sugerencias de funciones**:
- Envía una solicitud de función en GitHub Issues

**Vulnerabilidades de seguridad**:
- Por favor, reporta las vulnerabilidades de seguridad a través de canales privados

---

## Próxima lección

> Ya conoces el historial de versiones y las nuevas funciones de Plannotator.
>
> A continuación puedes:
> - Volver a [Inicio rápido](../../start/getting-started/) para aprender a instalar y usar
> - Consultar [Preguntas frecuentes](../../faq/common-problems/) para resolver problemas de uso
> - Leer la [Referencia de API](../../appendix/api-reference/) para conocer todos los endpoints de API
