---
title: "Auditoría de diseño: 100 prácticas | Agent Skills"
sidebarTitle: "Auditoría de diseño"
subtitle: "Auditoría de guías de diseño de interfaz web"
description: "Aprende a aplicar 100 mejores prácticas de diseño web. Verifica accesibilidad WCAG, rendimiento de animaciones y modo oscuro, mejorando la calidad de interfaz."
tags:
  - "Accesibilidad"
  - "UX"
  - "Revisión de código"
  - "Diseño web"
prerequisite:
  - "start-getting-started"
---

# Auditoría de guías de diseño de interfaz web

## Lo que podrás hacer al terminar

- 🎯 Hacer que la IA audite automáticamente el código de UI, descubriendo problemas de accesibilidad, rendimiento y UX
- ♿ Aplicar mejores prácticas de accesibilidad web (WCAG), mejorando la accesibilidad del sitio
- ⚡ Optimizar el rendimiento de animaciones y la carga de imágenes, mejorando la experiencia de usuario
- 🎨 Asegurar la implementación correcta del modo oscuro y el diseño responsivo
- 🔍 Reparar anti-patrones comunes de UI (como `transition: all`, falta de aria-labels, etc.)

## Tu situación actual

Escribiste componentes de UI, pero siempre sientes que algo no está bien:

- El sitio pasa las pruebas funcionales, pero no sabes si cumple con los estándares de accesibilidad
- El rendimiento de las animaciones es malo, los usuarios reportan que la página se siente lenta
- Algunos elementos no se ven claramente en modo oscuro
- El código generado por la IA funciona, pero le faltan aria-labels necesarios o HTML semántico
- Cada revisión de código requiere verificar manualmente 17 categorías de reglas, baja eficiencia
- No sabes cuándo usar propiedades CSS como `prefers-reduced-motion`, `tabular-nums`

## Idea central

Las guías de diseño de interfaz web cubren **17 categorías**, agrupadas en tres bloques principales por prioridad:

| Bloque de categorías | Enfoque | Beneficio típico |
|--- | --- | ---|
| **Accesibilidad** | Asegurar que todos los usuarios puedan usar (incluyendo lectores de pantalla, usuarios de teclado) | Cumplir con estándares WCAG, ampliar base de usuarios |
| **Rendimiento y UX** | Optimizar velocidad de carga, fluidez de animaciones, experiencia de interacción | Mejorar retención de usuarios, reducir tasa de rebote |
| **Integridad y detalles** | Modo oscuro, diseño responsivo, validación de formularios, manejo de errores | Reducir quejas de usuarios, mejorar imagen de marca |

## Cuándo usar esta técnica

Usar la habilidad de guías de diseño web en escenarios típicos:

- ❌ **No aplicable**: lógica puramente de back-end, páginas de prototipo simples (sin interacción de usuario)
- ✅ **Aplicable**:
  - Escribir nuevos componentes de UI (botones, formularios, tarjetas, etc.)
  - Implementar funciones de interacción (modales, menús desplegables, arrastrar y soltar, etc.)
  - Revisar o refactorizar componentes de UI
  - Verificación de calidad de UI antes del lanzamiento
  - Reparar problemas de accesibilidad o rendimiento reportados por usuarios

## Próximos pasos

Ver [Implementación con un clic en Vercel](../vercel-deploy/) para aprender a usar funciones de implementación.
