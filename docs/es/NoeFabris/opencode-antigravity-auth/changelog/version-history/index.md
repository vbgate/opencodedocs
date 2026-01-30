---
title: "Historial de Versiones: Registro de Cambios de Antigravity Auth | opencode-antigravity-auth"
sidebarTitle: "Resumen de novedades"
subtitle: "Historial de Versiones: Registro de Cambios de Antigravity Auth"
description: "Consulta el historial de versiones y los cambios importantes del plugin Antigravity Auth. Descubre las nuevas funciones, correcciones de errores, mejoras de rendimiento, guías de actualización y notas de compatibilidad de cada versión."
tags:
  - "Historial de versiones"
  - "Registro de cambios"
  - "Changelog"
order: 1
---

# Historial de Versiones

Este documento registra el historial de versiones y los cambios importantes del plugin Antigravity Auth.

::: tip Última versión
Versión estable actual: **v1.3.0** (2026-01-17)
:::

## Descripción de Versiones

### Versión Estable (Stable)
- Probada exhaustivamente, recomendada para entornos de producción
- Formato de versión: `vX.Y.Z` (ej. v1.3.0)

### Versión Beta
- Incluye las últimas funciones, puede contener elementos inestables
- Formato de versión: `vX.Y.Z-beta.N` (ej. v1.3.1-beta.3)
- Ideal para pruebas anticipadas y retroalimentación

---

## Serie v1.3.x

### v1.3.1-beta.3
**Fecha de lanzamiento**: 2026-01-22

**Cambios**:
- Optimización del algoritmo de retroceso para el error `MODEL_CAPACITY_EXHAUSTED`, aumentando el rango de jitter aleatorio

### v1.3.1-beta.2
**Fecha de lanzamiento**: 2026-01-22

**Cambios**:
- Eliminación de la opción de configuración `googleSearch` no utilizada
- Adición de advertencia de ToS (Términos de Servicio) y recomendaciones de uso al README

### v1.3.1-beta.1
**Fecha de lanzamiento**: 2026-01-22

**Cambios**:
- Mejora de la lógica de debounce en las notificaciones de cambio de cuenta, reduciendo avisos duplicados

### v1.3.1-beta.0
**Fecha de lanzamiento**: 2026-01-20

**Cambios**:
- Eliminación del seguimiento de submódulos, restauración de tsconfig.json

### v1.3.0
**Fecha de lanzamiento**: 2026-01-17

**Cambios importantes**:

**Nuevas funciones**:
- Uso del método nativo `toJSONSchema` de Zod v4 para la generación de esquemas

**Correcciones**:
- Corrección de pruebas de consumo de tokens, usando `toBeCloseTo` para manejar la precisión de punto flotante
- Mejora del cálculo de cobertura de pruebas

**Mejoras de documentación**:
- Documentación mejorada sobre balanceo de carga
- Mejoras de formato añadidas

---

## Serie v1.2.x

### v1.2.9-beta.10
**Fecha de lanzamiento**: 2026-01-17

**Cambios**:
- Corrección de aserciones de saldo de tokens, usando coincidencia de precisión de punto flotante

### v1.2.9-beta.9
**Fecha de lanzamiento**: 2026-01-16

**Cambios**:
- Actualización de pruebas de consumo de tokens, usando `toBeCloseTo` para manejar la precisión de punto flotante
- Mejora del wrapper de herramientas Gemini, añadiendo estadísticas de cantidad de funciones envueltas

### v1.2.9-beta.8
**Fecha de lanzamiento**: 2026-01-16

**Cambios**:
- Adición de nuevas plantillas de issues (reporte de errores y solicitud de funciones)
- Mejora de la lógica de onboarding del proyecto

### v1.2.9-beta.7
**Fecha de lanzamiento**: 2026-01-16

**Cambios**:
- Actualización de plantillas de issues, requiriendo títulos descriptivos

### v1.2.9-beta.6
**Fecha de lanzamiento**: 2026-01-16

**Cambios**:
- Adición de retraso de reintento configurable para límite de tasa
- Mejora de detección de hostname, soporte para entorno Docker OrbStack
- Vinculación inteligente de dirección del servidor de callback OAuth
- Aclaración de la prioridad entre `thinkingLevel` y `thinkingBudget`

### v1.2.9-beta.5
**Fecha de lanzamiento**: 2026-01-16

**Cambios**:
- Mejora del wrapper de herramientas Gemini, soporte para formato `functionDeclarations`
- Asegurar la creación correcta de wrappers de funciones personalizadas en `normalizeGeminiTools`

### v1.2.9-beta.4
**Fecha de lanzamiento**: 2026-01-16

**Cambios**:
- Envolver herramientas Gemini en formato `functionDeclarations`
- Aplicar `toGeminiSchema` en `wrapToolsAsFunctionDeclarations`

### v1.2.9-beta.3
**Fecha de lanzamiento**: 2026-01-14

**Cambios**:
- Actualización de documentación y comentarios de código, explicando la implementación de la estrategia híbrida
- Simplificación de instrucciones del sistema antigravity para pruebas

### v1.2.9-beta.2
**Fecha de lanzamiento**: 2026-01-12

**Cambios**:
- Corrección de la lógica de análisis del modelo Gemini 3, deduplicación del procesamiento de bloques de pensamiento
- Adición de verificación del modelo Gemini 3 para los hashes de pensamiento mostrados

### v1.2.9-beta.1
**Fecha de lanzamiento**: 2026-01-08

**Cambios**:
- Actualización de la versión beta en las instrucciones de instalación del plugin
- Mejora de la gestión de cuentas, asegurando que la autenticación actual se añada a las cuentas almacenadas

### v1.2.9-beta.0
**Fecha de lanzamiento**: 2026-01-08

**Cambios**:
- Actualización del README, corrección de la URL del plugin Antigravity
- Actualización de la URL del esquema al repositorio NoeFabris

### v1.2.8
**Fecha de lanzamiento**: 2026-01-08

**Cambios importantes**:

**Nuevas funciones**:
- Soporte para modelo Gemini 3
- Procesamiento de deduplicación de bloques de pensamiento

**Correcciones**:
- Corrección de la lógica de análisis del modelo Gemini 3
- Manejo de hash de pensamiento mostrado en la transformación de respuestas

**Mejoras de documentación**:
- Actualización de la redirección de salida del script de pruebas
- Actualización de opciones de prueba de modelos

### v1.2.7
**Fecha de lanzamiento**: 2026-01-01

**Cambios importantes**:

**Nuevas funciones**:
- Mejora de la gestión de cuentas, asegurando que la autenticación actual se almacene correctamente
- Publicación automática de versiones npm a través de GitHub Actions

**Correcciones**:
- Corrección de la redirección de salida en scripts de pruebas E2E

**Mejoras de documentación**:
- Actualización de la URL del repositorio a NoeFabris

---

## Serie v1.2.6 - v1.2.0

### v1.2.6
**Fecha de lanzamiento**: 2025-12-26

**Cambios**:
- Adición de workflow para republicación automática de versiones npm

### v1.2.5
**Fecha de lanzamiento**: 2025-12-26

**Cambios**:
- Actualización de documentación, corrección del número de versión a 1.2.6

### v1.2.4 - v1.2.0
**Fecha de lanzamiento**: Diciembre 2025

**Cambios**:
- Función de balanceo de carga multi-cuenta
- Sistema de cuota dual (Antigravity + Gemini CLI)
- Mecanismo de recuperación de sesión
- Autenticación OAuth 2.0 PKCE
- Soporte para modelos Thinking (Claude y Gemini 3)
- Google Search grounding

---

## Serie v1.1.x

### v1.1.0 y versiones posteriores
**Fecha de lanzamiento**: Noviembre 2025

**Cambios**:
- Optimización del flujo de autenticación
- Mejora del manejo de errores
- Adición de más opciones de configuración

---

## Serie v1.0.x (Versiones tempranas)

### v1.0.4 - v1.0.0
**Fecha de lanzamiento**: Octubre 2025 y anteriores

**Funciones iniciales**:
- Autenticación básica de Google OAuth
- Acceso a la API de Antigravity
- Soporte básico de modelos

---

## Guía de Actualización de Versiones

### De v1.2.x a v1.3.x

**Compatibilidad**: Totalmente compatible, no requiere modificación de configuración

**Acciones recomendadas**:
```bash
# Actualizar plugin
opencode plugin update opencode-antigravity-auth

# Verificar instalación
opencode auth status
```

### De v1.1.x a v1.2.x

**Compatibilidad**: Requiere actualización del formato de almacenamiento de cuentas

**Acciones recomendadas**:
```bash
# Hacer copia de seguridad de cuentas existentes
cp ~/.config/opencode/antigravity-accounts.json ~/.config/opencode/antigravity-accounts.json.bak

# Actualizar plugin
opencode plugin update opencode-antigravity-auth@latest

# Volver a iniciar sesión (si hay problemas)
opencode auth login
```

### De v1.0.x a v1.2.x

**Compatibilidad**: Formato de almacenamiento de cuentas incompatible, requiere reautenticación

**Acciones recomendadas**:
```bash
# Actualizar plugin
opencode plugin update opencode-antigravity-auth@latest

# Volver a iniciar sesión
opencode auth login

# Añadir configuración de modelo según los requisitos de la nueva versión
```

---

## Notas sobre Versiones Beta

**Recomendaciones de uso de versiones Beta**:

| Escenario | Versión recomendada | Descripción |
| --- | --- | --- |
| Producción | Estable (vX.Y.Z) | Probada exhaustivamente, alta estabilidad |
| Desarrollo diario | Última estable | Funciones completas, menos errores |
| Pruebas anticipadas | Última Beta | Acceso a las últimas funciones, puede ser inestable |

**Instalar versión Beta**:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Actualizar a versión estable**:

```bash
opencode plugin update opencode-antigravity-auth@latest
```

---

## Explicación del Número de Versión

El número de versión sigue la especificación [Versionado Semántico 2.0.0](https://semver.org/lang/es/):

- **Versión mayor (X)**: Cambios de API incompatibles
- **Versión menor (Y)**: Nuevas funciones compatibles con versiones anteriores
- **Parche (Z)**: Correcciones de errores compatibles con versiones anteriores

**Ejemplos**:
- `1.3.0` → Versión mayor 1, versión menor 3, parche 0
- `1.3.1-beta.3` → Tercera versión Beta de 1.3.1

---

## Recibir Notificaciones de Actualización

**Actualización automática** (habilitada por defecto):

```json
{
  "auto_update": true
}
```

**Verificar actualizaciones manualmente**:

```bash
# Ver versión actual
opencode plugin list

# Actualizar plugin
opencode plugin update opencode-antigravity-auth
```

---

## Enlaces de Descarga

- **NPM versión estable**: https://www.npmjs.com/package/opencode-antigravity-auth
- **GitHub Releases**: https://github.com/NoeFabris/opencode-antigravity-auth/releases

---

## Contribuir y Reportar

Si encuentras problemas o tienes sugerencias de funciones:

1. Consulta la [Guía de Solución de Problemas](../../faq/common-auth-issues/)
2. Envía un issue en [GitHub Issues](https://github.com/NoeFabris/opencode-antigravity-auth/issues)
3. Usa la plantilla de issue correcta (Bug Report / Feature Request)
