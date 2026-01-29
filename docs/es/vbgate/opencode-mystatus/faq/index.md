---
title: "FAQ: Soluciones | opencode-mystatus"
sidebarTitle: "FAQ"
subtitle: "FAQ: Soluciones"
description: "Resuelve problemas comunes de opencode-mystatus. Encuentra soluciones para autenticación, permisos, errores de API y seguridad."
order: 4
---

# Preguntas frecuentes

Este capítulo recopila las preguntas frecuentes y soluciones al usar opencode-mystatus.

## Clasificación de problemas

### [Solución de problemas](./troubleshooting/)

Resuelve varios problemas de falla en la consulta:

- No se puede leer el archivo de autenticación
- Token expirado o permisos insuficientes
- Fallo en solicitud de API o tiempo de espera agotado
- Manejo de errores específicos por plataforma

### [Seguridad y privacidad](./security/)

Conoce el mecanismo de seguridad del plugin:

- Acceso de solo lectura a archivos locales
- Enmascaramiento automático de API Key
- Solo llama a interfaces oficiales
- Sin subida ni almacenamiento de datos

## Localización rápida

Encuentra rápidamente la solución según el mensaje de error:

| Palabra clave de error | Causa posible | Solución |
|-----------|---------|---------|
| `auth.json not found` | El archivo de autenticación no existe | [Solución de problemas](./troubleshooting/) |
| `Token expired` | El token ha expirado | [Solución de problemas](./troubleshooting/) |
| `Permission denied` | Permisos insuficientes | [Configuración de autenticación de Copilot](../advanced/copilot-auth/) |
| `project_id missing` | Configuración incompleta de Google Cloud | [Configuración de Google Cloud](../advanced/google-setup/) |
| `Request timeout` | Problemas de red | [Solución de problemas](./troubleshooting/) |

## Obtener ayuda

Si este capítulo no resuelve tu problema:

- Envía un [Issue](https://github.com/vbgate/opencode-mystatus/issues) - Reporta un bug o solicita nuevas funciones
- Consulta el [repositorio de GitHub](https://github.com/vbgate/opencode-mystatus) - Obtén la versión más reciente y el código fuente
