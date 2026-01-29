---
title: "Actualizaciones v1.2.0-v1.2.4 | opencode-mystatus"
sidebarTitle: "v1.2.0-v1.2.4"
subtitle: "Actualizaciones v1.2.0-v1.2.4"
description: "Conoce las actualizaciones de v1.2.0 a v1.2.4 de opencode-mystatus, incluye soporte de GitHub Copilot, mejoras de documentación y correcciones."
tags:
  - "changelog"
  - "v1.2.0"
  - "v1.2.1"
  - "v1.2.2"
  - "Copilot"
order: 1
---

# v1.2.0 - v1.2.4: nuevo soporte de Copilot y mejoras de documentación

## Resumen de versión

Esta actualización (v1.2.0 - v1.2.4) trae mejoras importantes de funciones para opencode-mystatus, la más notable es **el nuevo soporte para la consulta de cuota de GitHub Copilot**. Al mismo tiempo, mejora la documentación de instalación, corrige errores de código lint.

**Cambios principales**:
- ✅ Nuevo soporte de consulta de cuota de GitHub Copilot
- ✅ Integración de la API interna de GitHub
- ✅ Actualización de documentación en chino e inglés
- ✅ Mejora de instrucciones de instalación, eliminación de restricciones de versión
- ✅ Corrección de errores de código lint

---

## [1.2.2] - 2026-01-14

### Mejoras de documentación

- **Actualización de instrucciones de instalación**: En `README.md` y `README.zh-CN.md` se eliminaron las restricciones de versión
- **Soporte de actualización automática**: Ahora los usuarios pueden recibir automáticamente la última versión, sin necesidad de modificar manualmente el número de versión

**Impacto**: Al instalar o actualizar el plugin, los usuarios ya no necesitan especificar una versión específica, pueden obtener la última versión a través de la etiqueta `@latest`.

---

## [1.2.1] - 2026-01-14

### Corrección de errores

- **Corrección de error de lint**: Se eliminó la importación no utilizada `maskString` en `copilot.ts`

**Impacto**: Mejora de la calidad del código, pasa la verificación de ESLint, sin cambios funcionales.

---

## [1.2.0] - 2026-01-14

### Nuevas funciones

#### Soporte de GitHub Copilot

Esta es la función principal de esta actualización:

- **Nueva consulta de cuota de Copilot**: Soporta consultar el uso de Premium Requests de GitHub Copilot
- **Integración de la API interna de GitHub**: Agregó el módulo `copilot.ts`, obtiene datos de cuota a través de la API de GitHub
- **Actualización de documentación**: Se agregó documentación relacionada con Copilot en `README.md` y `README.zh-CN.md`

**Métodos de autenticación soportados**:
1. **Fine-grained PAT** (recomendado): Fine-grained Personal Access Token creado por el usuario
2. **OAuth Token**: Token OAuth de OpenCode (requiere permisos de Copilot)

**Contenido de consulta**:
- Total y uso de Premium Requests
- Detalles de uso por modelo
- Identificación del tipo de suscripción (free、pro、pro+、business、enterprise)

**Ejemplo de uso**:

```bash
# Ejecutar comando mystatus
/mystatus

# Verás que la salida incluye la sección de GitHub Copilot
Account:        GitHub Copilot (@username)

  Premium Requests  ██████████░░░░░░░░░░ 75% (75/300)

  模型使用明细:
    gpt-4o: 150 Requests
    claude-3.5-sonnet: 75 Requests

  计费周期: 2026-01
```

---

## Guía de actualización

### Actualización automática (recomendada)

Dado que v1.2.2 actualizó las instrucciones de instalación, eliminando las restricciones de versión, ahora puedes:

```bash
# Usar la etiqueta latest para instalar
opencode plugin install vbgate/opencode-mystatus@latest
```

### Actualización manual

Si ya has instalado una versión anterior, puedes actualizar directamente:

```bash
# Desinstalar la versión anterior
opencode plugin uninstall vbgate/opencode-mystatus

# Instalar la nueva versión
opencode plugin install vbgate/opencode-mystatus@latest
```

### Configurar Copilot

Después de la actualización, puedes configurar la consulta de cuota de GitHub Copilot:

#### Método 1: Usar Fine-grained PAT (recomendado)

1. Crea un Fine-grained Personal Access Token en GitHub
2. Crea el archivo de configuración `~/.config/opencode/copilot-quota-token.json`:

```json
{
  "token": "ghp_your_fine_grained_pat_here",
  "username": "your-github-username",
  "tier": "pro"
}
```

3. Ejecuta `/mystatus` para consultar la cuota

#### Método 2: Usar Token OAuth de OpenCode

Asegúrate de que tu Token OAuth de OpenCode tenga permisos de Copilot, ejecuta directamente `/mystatus`.

::: tip Sugerencia
Para más detalles sobre la autenticación de Copilot, consulta el tutorial [Configuración de autenticación de Copilot](/es/vbgate/opencode-mystatus/advanced/copilot-auth/).
:::

---

## Problemas conocidos

### Problema de permisos de Copilot

Si tu Token OAuth de OpenCode no tiene permisos de Copilot, al consultar se mostrará un mensaje de advertencia. Solución:

1. Usa Fine-grained PAT (recomendado)
2. Re-autoriza OpenCode, asegurándote de marcar los permisos de Copilot

Para la solución detallada, consulta el tutorial [Configuración de autenticación de Copilot](/es/vbgate/opencode-mystatus/advanced/copilot-auth/).

---

## Planes futuros

Las versiones futuras pueden incluir las siguientes mejoras:

- [ ] Soportar más tipos de suscripción de GitHub Copilot
- [ ] Optimizar el formato de visualización de cuota de Copilot
- [ ] Agregar función de advertencia de cuota
- [ ] Soportar más plataformas de IA

---

## Documentación relacionada

- [Consulta de cuota de Copilot](/es/vbgate/opencode-mystatus/platforms/copilot-usage/)
- [Configuración de autenticación de Copilot](/es/vbgate/opencode-mystatus/advanced/copilot-auth/)
- [Solución de problemas de preguntas frecuentes](/es/vbgate/opencode-mystatus/faq/troubleshooting/)

---

## Registro completo de cambios

Para ver todos los cambios de versión, visita [GitHub Releases](https://github.com/vbgate/opencode-mystatus/releases).
