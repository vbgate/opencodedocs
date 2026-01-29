---
title: "Changelog v1.0.0-v1.0.1 | opencode-mystatus"
sidebarTitle: "v1.0.0-v1.0.1"
description: "Conoce las nuevas funciones de la versión inicial de opencode-mystatus: consulta de cuota de múltiples plataformas, visualización de barras de progreso, soporte multilingüe y corrección de comandos de barra diagonal."
subtitle: "v1.0.0 - v1.0.1: versión inicial y corrección de comandos de barra diagonal"
tags:
  - "versión"
  - "registro de cambios"
  - "v1.0.0"
  - "v1.0.1"
order: 2
---

# v1.0.0 - v1.0.1: versión inicial y corrección de comandos de barra diagonal

## Resumen de versión

**v1.0.0** (2026-01-11) es la versión inicial de opencode-mystatus, traendo las funciones principales de consulta de cuotas de múltiples plataformas.

**v1.0.1** (2026-01-11) siguió inmediatamente, corrigiendo un problema clave de soporte de comandos de barra diagonal.

---

## v1.0.1 - Corrección de comandos de barra diagonal

### Corrección de problema

**Incluir el directorio `command/` en el paquete npm**

- **Descripción del problema**: Después de la versión v1.0.0, se descubrió que el comando de barra diagonal `/mystatus` no funcionaba normalmente
- **Análisis de causa**: El empaquetado npm olvidó el directorio `command/`, haciendo que OpenCode no pudiera reconocer el comando de barra diagonal
- **Solución**: Actualizar el campo `files` en `package.json`, asegurando que el directorio `command/` se incluya en el paquete de distribución
- **Alcance de afectación**: Solo afecta a usuarios que instalan a través de npm, la instalación manual no se ve afectada

### Recomendación de actualización

Si ya has instalado v1.0.0, se recomienda actualizar inmediatamente a v1.0.1 para obtener soporte completo de comandos de barra diagonal:

```bash
## Actualizar a la última versión
npm update @vbgate/opencode-mystatus
```

---

## v1.0.0 - Versión inicial

### Nuevas funciones

**1. Consulta de cuota de múltiples plataformas**

Soporta la consulta con un clic del uso de cuotas de las siguientes plataformas:

| Plataforma | Tipos de suscripción soportados | Tipos de cuota |
|--- | --- | ---|
| OpenAI | Plus/Team/Pro | Límite de 3 horas, límite de 24 horas |
| Zhipu AI | Coding Plan | Límite de token de 5 horas, cuota mensual de MCP |
| Google Cloud | Antigravity | G3 Pro, G3 Image, G3 Flash, Claude |

**2. Visualización de barras de progreso**

Muestra intuitivamente el uso de cuotas:

```
OpenAI (user@example.com)
━━━━━━━━━━━━━━━━━━━ 75%
已用 750 / 1000 次请求
```

**3. Soporte multilingüe**

- Chino (simplificado)
- Inglés

Detección automática de idioma, sin necesidad de cambio manual.

**4. Enmascaramiento de seguridad de API Key**

Toda la información sensible (API Key, OAuth Token) se muestra automáticamente enmascarada:

```
Zhipu AI (zhipuai-coding-plan)
API Key: sk-a1b2****xyz
```

---

## Modos de uso

### Comando de barra diagonal (recomendado)

En OpenCode, ingresa:

```
/mystatus
```

### Lenguaje natural

También puedes preguntar en lenguaje natural:

```
查看我的所有 AI 平台额度
```

---

## Guía de actualización

### Actualizar de v1.0.0 a v1.0.1

```bash
npm update @vbgate/opencode-mystatus
```

Después de la actualización, reinicia OpenCode para usar el comando de barra diagonal `/mystatus`.

### Primera instalación

```bash
npm install -g @vbgate/opencode-mystatus
```

Después de completar la instalación, puedes consultar las cuotas de todas las plataformas ingresando `/mystatus` en OpenCode.

---

## Limitaciones conocidas

- v1.0.0 no soporta GitHub Copilot (agregado en v1.2.0)
- v1.0.0 no soporta Z.ai (agregado en v1.1.0)

Si necesitas estas funciones, actualiza a la última versión.

---

## Siguientes pasos

Consulta el [registro de cambios de v1.2.0 - v1.2.4](../v120-v124/) para conocer nuevas funciones como el soporte de GitHub Copilot.

