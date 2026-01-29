---
title: "Optimización React: 57 reglas | Agent Skills"
sidebarTitle: "Optimización React"
subtitle: "Mejores prácticas de rendimiento de React/Next.js"
description: "Aprende optimización de React y Next.js con 57 reglas de Vercel. Elimina cascadas, optimiza paquetes, reduce re-render, mejora rendimiento."
tags:
  - "React"
  - "Next.js"
  - "Optimización de rendimiento"
  - "Revisión de código"
prerequisite:
  - "start-getting-started"
---

# Mejores prácticas de optimización de rendimiento de React/Next.js

## Lo que podrás hacer al terminar

- 🎯 Hacer que la IA detecte automáticamente problemas de rendimiento en código React y dé sugerencias de optimización
- ⚡ Eliminar cascadas, acelerar la carga de páginas 2-10 veces
- 📦 Optimizar el tamaño del paquete, reducir el tiempo de carga inicial
- 🔄 Reducir re-render, mejorar la velocidad de respuesta de la página
- 🏗️ Aplicar mejores prácticas de nivel de producción del equipo de ingeniería de Vercel
# Mejores prácticas de optimización de rendimiento de React/Next.js

## Lo que podrás hacer al terminar

- 🎯 Hacer que la IA detecte automáticamente problemas de rendimiento en código React y dé sugerencias de optimización
- ⚡ Eliminar cascadas, acelerar la carga de páginas 2-10 veces
- 📦 Optimizar el tamaño del paquete, reducir el tiempo de carga inicial
- 🔄 Reducir re-render, mejorar la velocidad de respuesta de la página
- 🏗️ Aplicar mejores prácticas de nivel de producción del equipo de ingeniería de Vercel

## Tu situación actual

Escribiste código de React, pero siempre sientes que algo no está bien:

- La página carga lentamente, no ves el problema en Developer Tools
- El código generado por la IA funciona, pero no sabes si cumple con las mejores prácticas de rendimiento
- Ves que las aplicaciones Next.js de otros son rápidas, la tuya se siente lenta
- Conoces algunos trucos de optimización (como `useMemo`, `useCallback`), pero no sabes cuándo usarlos
- Cada revisión de código requiere verificar manualmente problemas de rendimiento, baja eficiencia

## Cuándo usar esta técnica

Usar la habilidad de mejores prácticas de React en escenarios típicos:

- ❌ **No aplicable**: páginas estáticas simples, componentes sin interacción compleja
- ✅ **Aplicable**:
  - Escribir nuevos componentes de React o páginas de Next.js
  - Implementar obtención de datos del lado del cliente o del servidor
  - Revisar o refactorizar código existente
  - Optimizar el tamaño del paquete o el tiempo de carga
  - Los usuarios reportan que la página se siente lenta

## Idea central

La optimización de rendimiento de React no se trata solo de usar algunos Hooks, sino resolver problemas desde el nivel de **arquitectura**. Las 57 reglas de Vercel se dividen en 8 categorías por prioridad:

| Prioridad | Categoría | Enfoque | Beneficio típico |
| ------ | ---- | ---- | ---- |
| **CRITICAL** | Eliminar cascadas | Evitar operaciones async seriales | 2-10× mejora |
| **CRITICAL** | Optimizar paquetes | Reducir tamaño del paquete inicial | Mejora significativa de TTI/LCP |
| **HIGH** | Rendimiento del servidor | Optimizar obtención de datos y caché | Reducir carga del servidor |
| **MEDIUM-HIGH** | Obtención de datos del cliente | Evitar solicitudes duplicadas | Reducir tráfico de red |
| **MEDIUM** | Optimización de re-render | Reducir re-renders innecesarios | Mejorar velocidad de respuesta de interacción |

## Siguientes pasos

Ver [Auditoría de guías de diseño de interfaz web](../web-design-guidelines/) para aprender más.
