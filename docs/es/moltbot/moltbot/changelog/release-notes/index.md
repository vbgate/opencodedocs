---
title: "Registro de Cambios: Nuevas Funciones, Mejoras y Cambios Rupturistas | Tutorial de Clawdbot"
sidebarTitle: "Novedades en la Nueva Versión"
subtitle: "Registro de Cambios: Nuevas Funciones, Mejoras y Cambios Rupturistas"
description: "Aprende el historial de actualizaciones de versiones de Clawdbot, conociendo las nuevas funciones, mejoras, correcciones y cambios rupturistas de cada versión. Este tutorial ayuda a los usuarios a rastrear la evolución de funcionalidades y mantener el sistema actualizado para obtener las últimas características y correcciones de seguridad."
tags:
  - "Registro de cambios"
  - "Historial de versiones"
  - "changelog"
prerequisite: []
order: 380
---

# Registro de Cambios: Nuevas Funciones, Mejoras y Cambios Rupturistas

Clawdbot se actualiza continuamente, y cada versión trae nuevas funciones, mejoras de rendimiento y mejoras de seguridad. Este registro te ayuda a comprender rápidamente la evolución de versiones, decidir cuándo actualizar y qué tener en cuenta durante la actualización.

## Qué Aprenderás

- Conocer las nuevas funciones y puntos destacados de la última versión
- Dominar los cambios rupturistas de cada versión para evitar interrupciones en la actualización
- Consultar la lista de correcciones de problemas para confirmar si tu problema ha sido resuelto
- Rastrear la hoja de ruta de evolución de funcionalidades y planificar el uso de nuevas características

::: tip Nota sobre Números de Versión
Formato de versión: `YYYY.M.D` (año.mes.día)

- **Versión principal**: Los cambios en los números de año o mes generalmente representan actualizaciones importantes de funciones
- **Versión de parche**: `-1`, `-2`, `-3` representan versiones de corrección que solo incluyen arreglos de errores
:::

---

## 2026.1.25
**Estado**: No publicado

### Destacados (Highlights)

Por el momento, no hay novedades

### Mejoras (Changes)

- **Agents**: Respetar `tools.exec.safeBins` en la verificación de lista de permitidos de ejecución (#2281)
- **Docs**: Refinar los pasos de despliegue privado en Fly (#2289) - Gracias @dguido
- **Gateway**: Advertir sobre tokens de hook pasados por parámetros de consulta; documentar el método de autenticación preferido por header (#2200) - Gracias @YuriNachos
- **Gateway**: Agregar bandera de bypass de autenticación de dispositivos de Control UI peligrosa + advertencia de auditoría (#2248)
- **Doctor**: Advertir cuando el gateway se expone sin autenticación (#2016) - Gracias @Alex-Alaniz
- **Discord**: Agregar intents privilegiados configurables de gateway (presencias/miembros) (#2266) - Gracias @kentaro
- **Docs**: Agregar Vercel AI Gateway a la barra lateral de proveedores (#1901) - Gracias @jerilynzheng
- **Agents**: Ampliar descripción de herramienta cron para incluir documentación completa de esquema (#1988) - Gracias @tomascupr
- **Skills**: Agregar metadatos de dependencias faltantes para GitHub, Notion, Slack, Discord (#1995) - Gracias @jackheuberger
- **Docs**: Agregar guía de despliegue en Render (#1975) - Gracias @anurag
- **Docs**: Agregar guía de proxy de API Claude Max (#1875) - Gracias @atalovesyou
- **Docs**: Agregar guía de despliegue en DigitalOcean (#1870) - Gracias @0xJonHoldsCrypto
- **Docs**: Agregar guía de instalación en Raspberry Pi (#1871) - Gracias @0xJonHoldsCrypto
- **Docs**: Agregar guía de despliegue en GCP Compute Engine (#1848) - Gracias @hougangdev
- **Docs**: Agregar guía de canal LINE - Gracias @thewilloftheshadow
- **Docs**: Dar crédito a dos colaboradores por la actualización de Control UI (#1852) - Gracias @EnzeD
- **Onboarding**: Agregar clave API de Venice al flujo no interactivo (#1893) - Gracias @jonisjongithub
- **Onboarding**: Fortalecer el mensaje de advertencia de seguridad de la versión beta + expectativas de control de acceso
- **Tlon**: Formatear IDs de respuesta de hilos como `@ud` (#1837) - Gracias @wca4a
- **Gateway**: Priorizar los metadatos de sesión más recientes al combinar almacenamiento (#1823) - Gracias @emanuelst
- **Web UI**: Mantener visibles las respuestas de anuncio de sub-agente en WebChat (#1977) - Gracias @andrescardonas7
- **CI**: Aumentar el tamaño del heap de Node para verificaciones de macOS (#1890) - Gracias @realZachi
- **macOS**: Evitar bloqueos al renderizar bloques de código actualizando Textual a 0.3.1 (#2033) - Gracias @garricn
- **Browser**: Volver a coincidencia de URL para resolución de objetivo de relé de extensión (#1999) - Gracias @jonit-dev
- **Update**: Ignorar dist/control-ui en verificación de estado sucio y restaurar después de construcción de UI (#1976) - Gracias @Glucksberg
- **Telegram**: Permitir parámetro caption al enviar medios (#1888) - Gracias @mguellsegarra
- **Telegram**: Soportar channelData de sendPayload de plugin (medios/botones) y validar comandos de plugin (#1917) - Gracias @JoshuaLelon
- **Telegram**: Evitar respuestas en bloque cuando el streaming está deshabilitado (#1885) - Gracias @ivancasco
- **Auth**: Mostrar URL de autenticación de Google copiable después de prompt ASCII (#1787) - Gracias @robbyczgw-cla
- **Routing**: Precompilar expresiones regulares de claves de sesión (#1697) - Gracias @Ray0907
- **TUI**: Evitar desbordamiento de ancho al renderizar lista de selección (#1686) - Gracias @mossein
- **Telegram**: Preservar ID de tema en notificación de reinicio de sentinela (#1807) - Gracias @hsrvc
- **Config**: Aplicar `config.env` antes de la sustitución de `${VAR}` (#1813) - Gracias @spanishflu-est1918
- **Slack**: Limpiar reacción de ack después de respuesta en streaming (#2044) - Gracias @fancyboi999
- **macOS**: Mantener nombre de usuario SSH personalizado en objetivos remotos (#2046) - Gracias @algal

### Correcciones (Fixes)

- **Telegram**: Envolver razonamiento en cursiva por línea para evitar guiones bajos crudos (#2181) - Gracias @YuriNachos
- **Voice Call**: Forzar verificación de firma de webhook de Twilio para URLs de ngrok; deshabilitar bypass de capa gratuita de ngrok por defecto
- **Security**: Fortalecer autenticación de Tailscale Serve verificando identidad de tailscaled local antes de confiar en headers
- **Build**: Alinear dependencia par de memory-core con archivo de bloqueo
- **Security**: Agregar modo de descubrimiento mDNS, minimizado por defecto para reducir filtración de información (#1882) - Gracias @orlyjamie
- **Security**: Fortalecer obtención de URL mediante DNS pinning para reducir riesgo de rebinding - Gracias a Chris Zheng
- **Web UI**: Mejorar vista previa de pegado de imágenes en WebChat y permitir enviar solo imágenes (#1925) - Gracias @smartprogrammer93
- **Security**: Envolver contenido de hook externo con opción de salida por hook por defecto (#1827) - Gracias @mertcicekci0
- **Gateway**: La autenticación por defecto ahora falla cerrada (requiere token/contraseña; identidad de Tailscale Serve aún permite)
- **Onboarding**: Eliminar selección de auth de gateway "off" no soportada del flujo onboarding/configure y flags de CLI

---

## 2026.1.24-3

### Correcciones (Fixes)

- **Slack**: Corregir falla de descarga de imágenes debido a falta de header Authorization en redirección entre dominios (#1936) - Gracias @sanderhelgesen
- **Gateway**: Fortalecer detección de cliente local y manejo de proxy inverso para conexiones proxy no autenticadas (#1795) - Gracias @orlyjamie
- **Security audit**: Marcar Control UI de loopback con autenticación deshabilitada como crítico (#1795) - Gracias @orlyjamie
- **CLI**: Restaurar sesión de claude-cli y transmitir respuestas de CLI al cliente TUI (#1921) - Gracias @rmorse

---

## 2026.1.24-2

### Correcciones (Fixes)

- **Packaging**: Incluir salida de dist/link-understanding en tarball de npm (corrige importación faltante de apply.js durante instalación)

---

## 2026.1.24-1

### Correcciones (Fixes)

- **Packaging**: Incluir salida de dist/shared en tarball de npm (corrige importación faltante de reasoning-tags durante instalación)

---

## 2026.1.24

### Destacados (Highlights)

- **Providers**: Descubrimiento de Ollama + documentación; guía de Venice mejorada + enlaces cruzados (#1606) - Gracias @abhaymundhara
- **Channels**: Plugin de LINE (Messaging API) con soporte para respuestas enriquecidas + respuestas rápidas (#1630) - Gracias @plum-dawg
- **TTS**: Fallback de Edge (sin clave) + modo automático `/tts` (#1668, #1667) - Gracias @steipete, @sebslight
- **Exec approvals**: Aprobación dentro del chat a través de `/approve` en todos los canales (incluyendo plugins) (#1621) - Gracias @czekaj
- **Telegram**: Temas de DM como sesiones independientes + interruptor de vista previa de enlaces salientes (#1597, #1700) - Gracias @rohannagpal, @zerone0x

### Mejoras (Changes)

- **Channels**: Agregar plugin de LINE (Messaging API) con soporte para respuestas enriquecidas, respuestas rápidas y registro HTTP de plugins (#1630) - Gracias @plum-dawg
- **TTS**: Agregar fallback de proveedor Edge TTS, Edge por defecto sin clave, reintentar MP3 cuando falla el formato (#1668) - Gracias @steipete
- **TTS**: Agregar enumeración de modo automático (off/always/inbound/tagged) con soporte de sobrescritura `/tts` por sesión (#1667) - Gracias @sebslight
- **Telegram**: Tratar temas de DM como sesiones independientes y mantener límites de historial de DM estables usando sufijo de hilo (#1597) - Gracias @rohannagpal
- **Telegram**: Agregar `channels.telegram.linkPreview` para alternar vista previa de enlaces salientes (#1700) - Gracias @zerone0x
- **Web search**: Agregar parámetro de filtro de frescura de Brave para resultados con límite de tiempo (#1688) - Gracias @JonUleis
- **UI**: Actualizar sistema de diseño del panel de Control UI (colores, iconos, tipografía) (#1745, #1786) - Gracias @EnzeD, @mousberg
- **Exec approvals**: Reenviar prompt de aprobación al chat con soporte `/approve` en todos los canales (incluyendo plugins) (#1621) - Gracias @czekaj
- **Gateway**: Exponer `config.patch` en herramientas de gateway con soporte para actualizaciones parciales seguras + sentinela de reinicio (#1653) - Gracias @Glucksberg
- **Diagnostics**: Agregar bandera de diagnóstico para registros de depuración dirigidos (sobrescritura de config + env)
- **Docs**: Ampliar FAQ (migración, programación, concurrencia, recomendaciones de modelos, autenticación de suscripción OpenAI, tamaño de Pi, instalación en hakchi, solución SSL de docs)
- **Docs**: Agregar guía detallada de solución de problemas del instalador
- **Docs**: Agregar guía de VM de macOS con opciones locales/alojadas + orientación de VPS/nodo (#1693) - Gracias @f-trycua
- **Docs**: Agregar configuración de rol de instancia EC2 de Bedrock + pasos de IAM (#1625) - Gracias @sergical
- **Docs**: Actualizar notas de guía de Fly.io
- **Dev**: Agregar hooks de pre-commit de prek + configuración de actualización semanal de dependencias (#1720) - Gracias @dguido

### Correcciones (Fixes)

- **Web UI**: Corregir desbordamiento de layout de config/debug, desplazamiento y tamaño de bloques de código (#1715) - Gracias @saipreetham589
- **Web UI**: Mostrar botón de detener durante ejecución activa, cambiar a nueva sesión cuando está inactivo (#1664) - Gracias @ndbroadbent
- **Web UI**: Limpiar banner de desconexión obsoleto al reconectar; permitir guardar formularios con rutas de esquema no soportadas pero bloquear esquemas faltantes (#1707) - Gracias @Glucksberg
- **Web UI**: Ocultar sugerencia interna de `message_id` en burbujas de chat
- **Gateway**: Permitir que la autenticación solo por token de Control UI omita el emparejamiento de dispositivos incluso cuando existe identidad de dispositivo (`gateway.controlUi.allowInsecureAuth`) (#1679) - Gracias @steipete
- **Matrix**: Proteger adjuntos de medios E2EE descifrados usando tamaño de pre-verificación (#1744) - Gracias @araa47
- **BlueBubbles**: Enrutar objetivos de número de teléfono a DM, evitar filtración de ID de enrutamiento, y crear automáticamente DM faltantes (requiere Private API) (#1751) - Gracias @tyler6204
- **BlueBubbles**: Preservar GUID de índice de parte en etiqueta de respuesta cuando falta ID corto
- **iMessage**: Normalizar prefijos de chat_id/chat_guid/chat_identifier sin distinguir mayúsculas/minúsculas y mantener prefijos de servicio estables (#1708) - Gracias @aaronn
- **Signal**: Corregir envío de reacciones (objetivos de grupo/UUID + flag de autor de CLI) (#1651) - Gracias @vilkasdev
- **Signal**: Agregar tiempo de espera de inicio de signal-cli configurable + documentación de modo de demonio externo (#1677)
- **Telegram**: Establecer fetch duplex="half" para cargas en Node 22 para evitar fallas de sendPhoto (#1684) - Gracias @commdata2338
- **Telegram**: Usar fetch envuelto para sondeo largo en Node para normalizar manejo de AbortSignal (#1639)
- **Telegram**: Respetar proxy por cuenta para llamadas de API salientes (#1774) - Gracias @radek-paclt
- **Telegram**: Volver a texto cuando las notas de voz están bloqueadas por configuración de privacidad (#1725) - Gracias @foeken
- **Voice Call**: Devolver TwiML de streaming para llamadas de sesión salientes en webhook inicial de Twilio (#1634)
- **Voice Call**: Serializar reproducción de TTS de Twilio y cancelar en interrupción para evitar superposición (#1713) - Gracias @dguido
- **Google Chat**: Ajustar coincidencia de lista de permitidos de buzón, limpiar entrada, límites de medios y onboarding/docs/tests (#1635) - Gracias @iHildy
- **Google Chat**: Normalizar objetivos de espacio sin prefijo doble `spaces/`
- **Agents**: Comprimir automáticamente cuando el error de solicitud excede contexto (#1627) - Gracias @rodrigouroz
- **Agents**: Usar perfil de auth activo para recuperación de compresión automática
- **Media understanding**: Omitir comprensión de imagen cuando el modelo principal ya soporta visión (#1747) - Gracias @tyler6204
- **Models**: Establecer por defecto campos de proveedor personalizado faltantes para aceptar configuración mínima
- **Messaging**: Mantener división de bloques de nueva línea segura para bloques de markdown de cerca entre canales
- **Messaging**: Tratar procesamiento de nueva línea como consciente de párrafo (división por línea vacía) para mantener listas y encabezados juntos (#1726) - Gracias @tyler6204
- **TUI**: Recargar historial después de reconexión de gateway para restaurar estado de sesión (#1663)
- **Heartbeat**: Normalizar identificadores de objetivo para mantener enrutamiento consistente
- **Exec**: Mantener aprobación para preguntas elevadas a menos que sea modo completo (#1616) - Gracias @ivancasco
- **Exec**: Tratar etiqueta de plataforma Windows como Windows para selección de shell de nodo (#1760) - Gracias @ymat19
- **Gateway**: Incluir variables de entorno de configuración en línea en entorno de instalación de servicio (#1735) - Gracias @Seredeep
- **Gateway**: Omitir sonda de DNS de Tailscale cuando tailscale.mode está apagado (#1671)
- **Gateway**: Reducir ruido de registro para llamadas de latencia + sondas de nodo remoto; debounce de actualización de skills (#1607) - Gracias @petter-b
- **Gateway**: Clarificar mensajes de error de autenticación de Control UI/WebChat cuando falta token (#1690)
- **Gateway**: Escuchar loopback IPv6 cuando se vincula a 127.0.0.1 para que webhooks de localhost funcionen
- **Gateway**: Almacenar archivo de bloqueo en directorio temporal para evitar bloqueos obsoletos en volúmenes persistentes (#1676)
- **macOS**: Transportar URLs `ws://` directamente al puerto 18789 por defecto; documentar `gateway.remote.transport` (#1603) - Gracias @ngutman
- **Tests**: Limitar trabajador de Vitest en CI macOS para reducir tiempo de espera (#1597) - Gracias @rohannagpal
- **Tests**: Evitar dependencia de fake-timer en simulación de flujo de runner integrado para reduciones de CI (#1597) - Gracias @rohannagpal
- **Tests**: Aumentar tiempo de espera de prueba de ordenamiento de runner integrado para reducir inestabilidad de CI (#1597) - Gracias @rohannagpal

---

## 2026.1.23-1

### Correcciones (Fixes)

- **Packaging**: Incluir salida de dist/tts en tarball de npm (corrige dist/tts/tts.js faltante)

---

## 2026.1.23

### Destacados (Highlights)

- **TTS**: Mover TTS de Telegram al núcleo + habilitar por defecto etiquetas de TTS impulsadas por modelo para respuestas de audio expresivas (#1559) - Gracias @Glucksberg
- **Gateway**: Agregar endpoint HTTP `/tools/invoke` para invocación directa de herramientas (aplica autenticación + política de herramientas) (#1575) - Gracias @vignesh07
- **Heartbeat**: Control de visibilidad por canal (OK/alertas/indicador) (#1452) - Gracias @dlauer
- **Deploy**: Agregar soporte de despliegue en Fly.io + guía (#1570)
- **Channels**: Agregar plugin de canal Tlon/Urbit (DM, menciones de grupo, respuestas de hilo) (#1544) - Gracias @wca4a

### Mejoras (Changes)

- **Channels**: Permitir política de permitir/rechazar herramientas por grupo en canales integrados + plugins (#1546) - Gracias @adam91holt
- **Agents**: Agregar valores por defecto de descubrimiento automático de Bedrock + sobrescritura de configuración (#1553) - Gracias @fal3
- **CLI**: Agregar `clawdbot system` para eventos de sistema + control de heartbeat; eliminar `wake` independiente
- **CLI**: Agregar sondeo de autenticación en vivo a `clawdbot models status` para validación por perfil
- **CLI**: Reiniciar gateway por defecto después de `clawdbot update`; agregar `--no-restart` para omitir
- **Browser**: Agregar enrutamiento automático de proxy de host de nodo para gateways remotos (configurable por gateway/nodo)
- **Plugins**: Agregar herramienta `llm-task` JSON-only opcional para flujos de trabajo (#1498) - Gracias @vignesh07
- **Markdown**: Agregar conversión de tabla por canal (Signal/WhatsApp usa viñetas, otros usan bloques de código) (#1495) - Gracias @odysseus0
- **Agents**: Mantener zona horaria solo en prompt de sistema y mover hora actual a `session_status` para mejor caché
- **Agents**: Eliminar alias de herramienta bash redundantes del registro/visualización de herramientas (#1571) - Gracias @Takhoffman
- **Docs**: Agregar guía de decisión cron vs heartbeat (con notas de flujo de trabajo de Lobster) (#1533) - Gracias @JustYannicc
- **Docs**: Clarificar que archivos HEARTBEAT.md vacíos omiten heartbeat, archivos faltantes aún se ejecutan (#1535) - Gracias @JustYannicc

### Correcciones (Fixes)

- **Sessions**: Aceptar sessionIds no UUID para historial/enviar/estado mientras se mantiene el alcance del agente
- **Heartbeat**: Aceptar ids de canal de plugin para validación de objetivos de heartbeat + sugerencias de UI
- **Messaging/Sessions**: Reflejar envíos salientes a claves de sesión de objetivo (hilo + dmScope), crear entradas de sesión al enviar, y normalizar mayúsculas/minúsculas de claves de sesión (#1520)
- **Sessions**: Rechazar almacenamiento de sesiones respaldado por arreglos para evitar borrado silencioso (#1469)
- **Gateway**: Comparar tiempo de inicio de proceso de Linux para evitar bucles de bloqueo de reciclaje de PID; mantener bloqueo a menos que esté obsoleto (#1572) - Gracias @steipete
- **Gateway**: Aceptar campos opcionales nulos en solicitudes de aprobación de ejecución (#1511) - Gracias @pvoo
- **Exec approvals**: Persistir id de entrada de lista de permitidos para mantener líneas de lista de permitidos de macOS estables (#1521) - Gracias @ngutman
- **Exec**: Respetar valores por defecto de ask/seguridad de tools.exec para aprobaciones elevadas (evitar prompts no deseados)
- **Daemon**: Usar separador de PATH de plataforma al construir ruta de servicio mínima
- **Linux**: Incluir raíz de bin de usuario de configuración de env en PATH de systemd y alinear auditoría de PATH (#1512) - Gracias @robbyczgw-cla
- **Tailscale**: Reintentar serve/funnel con sudo solo en errores de permisos y mantener detalles de falla originales (#1551) - Gracias @sweepies
- **Docker**: Actualizar comando de gateway en docker-compose y guías de Hetzner (#1514)
- **Agents**: Mostrar fallback de error de herramienta cuando la última ronda de asistente solo invoca herramientas (evitar parada silenciosa)
- **Agents**: Ignorar marcadores de plantilla de IDENTITY.md al analizar identidad (#1556)
- **Agents**: Eliminar bloques de razonamiento de OpenAI Responses huérfanos al cambiar de modelo (#1562) - Gracias @roshanasingh4
- **Agents**: Agregar sugerencia de registro de CLI al mensaje "agent falló antes de responder" (#1550) - Gracias @sweepies
- **Agents**: Advertir e ignorar listas de permitidos de herramientas que solo hacen referencia a herramientas de plugin desconocidas o no cargadas (#1566)
- **Agents**: Tratar listas de permitidos de solo herramientas de plugin como de adhesión voluntaria; mantener herramientas principales habilitadas (#1467)
- **Agents**: Respetar sobrescritura de enqueue para ejecuciones integradas para evitar bloqueos de cola en pruebas
- **Slack**: Respetar groupPolicy abierta para canal no listado en puerta de mensajes + slash (#1563) - Gracias @itsjaydesu
- **Discord**: Limitar bypass de límite de menciones de hilo automático a hilos propiedad del bot; mantener reacción de ack con puerta de menciones (#1511) - Gracias @pvoo
- **Discord**: Reintentar análisis de lista de permitidos limitado por tasa + despliegue de comandos para evitar bloqueo de gateway
- **Mentions**: Ignorar coincidencia de mentionPattern cuando existe otra mención explícita en chat de grupo (Slack/Discord/Telegram/WhatsApp)
- **Telegram**: Renderizar markdown en títulos de medios (#1478)
- **MS Teams**: Eliminar sufijo `.default` de ámbitos de Graph y ámbitos de sonda de Bot Framework (#1507, #1574) - Gracias @Evizero
- **Browser**: Mantener pestaña de relé de extensión controlable cuando la extensión reutiliza id de sesión después de cambiar de pestaña (#1160)
- **Voice wake**: Guardar automáticamente palabra de activación en iOS/Android al enviar/confirmar y alinear límites con macOS
- **UI**: Mantener barra lateral de Control UI visible al desplazarse páginas largas (#1515) - Gracias @pookNast
- **UI**: Caché de renderizado de markdown de Control UI + extracción de texto de chat memorizada para reducir tartamudeo de entrada en Safari
- **TUI**: Reenviar comandos de barra desconocidos, incluir comandos de Gateway en autocompletar, y renderizar respuestas de barra como salida de sistema
- **CLI**: Pulido de salida de sonda de autenticación (salida de tabla, errores en línea, reducir ruido y corrección de salto de línea en `clawdbot models status`)
- **Media**: Analizar etiquetas `MEDIA:` solo cuando comiencen línea para evitar eliminar menciones en prosa (#1206)
- **Media**: Preservar alfa de PNG cuando sea posible; volver a JPEG cuando aún exceda límite de tamaño (#1491) - Gracias @robbyczgw-cla
- **Skills**: Puerta instalación de bird Homebrew a macOS (#1569) - Gracias @bradleypriest

---

## Recomendaciones de Actualización

### Verificación Pre-actualización

Antes de actualizar a una nueva versión, se recomienda:

1. **Leer cambios rupturistas**: Verificar si hay cambios rupturistas que afecten tu configuración
2. **Respaldar configuración**: Respaldar `~/.clawdbot/clawdbot.json`
3. **Ejecutar diagnóstico**: `clawdbot doctor` para asegurar que el estado actual del sistema sea saludable
4. **Verificar dependencias**: Asegurar que la versión de Node.js cumpla con los requisitos (≥22)

### Verificación Post-actualización

Después de completar la actualización, ejecuta las siguientes verificaciones:

```bash
# 1. Verificar versión
clawdbot --version

# 2. Verificar estado
clawdbot status

# 3. Verificar conexión de canales
clawdbot channels status

# 4. Probar envío de mensajes
clawdbot message "Hola" --target=<tu-canal>
```

### Ver Registro de Cambios Completo

Para ver un historial de versiones más detallado con enlaces a issues, visita:

- **GitHub Releases**: https://github.com/moltbot/moltbot/releases
- **Documentación Oficial**: https://docs.clawd.bot

---

## Versiones Históricas

Para ver actualizaciones de versiones anteriores, visita [GitHub Releases](https://github.com/moltbot/moltbot/releases) o el [CHANGELOG.md](https://github.com/moltbot/moltbot/blob/main/CHANGELOG.md) en el directorio raíz del proyecto.

::: tip Contribuir
Si descubres un error o tienes sugerencias de funciones, te invitamos a enviarlas en [GitHub Issues](https://github.com/moltbot/moltbot/issues).
:::
