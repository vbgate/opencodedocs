---
title: "Solución de problemas | Agent Skills"
sidebarTitle: "Solución de problemas"
subtitle: "Solución de problemas | Agent Skills"
description: "Resuelve errores de red, habilidades no activadas y fallos de verificación. Aprende métodos de diagnóstico y pasos de reparación para solucionar problemas comunes."
tags:
  - "FAQ"
  - "Solución de problemas"
  - "Depuración"
  - "Configuración de red"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Solución de problemas comunes

## Lo que podrás hacer al terminar

- Diagnosticar y resolver rápidamente errores de red durante la implementación
- Reparar problemas de habilidades no activadas
- Manejar errores de verificación de reglas fallida
- Identificar las causas de detección inexacta de marcos

## Problemas de implementación

### Error de egreso de red (Network Egress Error)

**Problema**: Al implementar en Vercel aparece un error de red, indicando que no se puede acceder a la red externa.

**Causa**: En el entorno claude.ai, el acceso a la red está limitado por defecto. La habilidad `vercel-deploy-claimable` necesita acceder al dominio `*.vercel.com` para poder cargar archivos.

**Solución**:

::: tip Configurar permisos de red en claude.ai

1. Visita [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. En "Dominios permitidos" agrega `*.vercel.com`
3. Guarda la configuración y reintenta la implementación

:::
