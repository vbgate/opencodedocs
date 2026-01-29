---
title: "Configuración avanzada: Guía detallada de funciones avanzadas | Antigravity-Manager"
order: 300
sidebarTitle: "Actualiza el sistema al nivel de producción"
subtitle: "Configuración avanzada: Guía detallada de funciones avanzadas"
description: "Aprende los métodos de configuración avanzada de Antigravity-Manager. Domina funciones avanzadas como programación de cuentas, enrutamiento de modelos, gestión de cuotas y estadísticas de monitoreo."
---

# Configuración avanzada

En este capítulo se explican en profundidad las funciones avanzadas de Antigravity Tools: gestión de configuración, políticas de seguridad, programación de cuentas, enrutamiento de modelos, gestión de cuotas, estadísticas de monitoreo y soluciones de despliegue en servidor. Tras dominar estos contenidos, podrás elevar Antigravity Tools de "funcional" a "fácil de usar, estable y operable".

## Contenido de este capítulo

| Tutorial | Descripción |
|---------|-------------|
| [Configuración completa](./config/) | Campos completos de AppConfig/ProxyConfig, ubicación de persistencia y semántica de actualización en caliente |
| [Seguridad y privacidad](./security/) | `auth_mode`, `allow_lan_access` y diseño de línea base de seguridad |
| [Programación de alta disponibilidad](./scheduling/) | Rotación, cuentas fijas, sesiones pegajosas y mecanismo de reintento en caso de fallo |
| [Enrutamiento de modelos](./model-router/) | Mapeo personalizado, prioridad de comodines y estrategias preestablecidas |
| [Gestión de cuotas](./quota/) | Estrategias combinadas de Quota Protection + Smart Warmup |
| [Proxy Monitor](./monitoring/) | Registros de solicitudes, filtrado, restauración de detalles y exportación |
| [Estadísticas de Token](./token-stats/) | Métricas de estadísticas desde la perspectiva de costos e interpretación de gráficos |
| [Estabilidad de sesiones largas](./context-compression/) | Compresión de contexto, almacenamiento en caché de firmas y compresión de resultados de herramientas |
| [Capacidades del sistema](./system/) | Multiidioma/temas/actualizaciones/inicio automático/HTTP API Server |
| [Despliegue en servidor](./deployment/) | Selección y operaciones de Docker noVNC vs Headless Xvfb |

## Ruta de aprendizaje recomendada

::: tip Orden recomendado
Este capítulo es bastante extenso, se recomienda aprender por módulos en el siguiente orden:
:::

**Primera fase: Configuración y seguridad (obligatorio)**

```
Configuración completa → Seguridad y privacidad
config      security
```

Primero entiende el sistema de configuración (qué requiere reinicio, qué admite actualización en caliente), luego aprende las configuraciones de seguridad (especialmente cuando se exponga a LAN/Internet).

**Segunda fase: Programación y enrutamiento (recomendado)**

```
Programación de alta disponibilidad → Enrutamiento de modelos
scheduling    model-router
```

Aprende a obtener la máxima estabilidad con el número mínimo de cuentas, luego usa el enrutamiento de modelos para aislar cambios en el proveedor.

**Tercera fase: Cuotas y monitoreo (según necesidad)**

```
Gestión de cuotas → Proxy Monitor → Estadísticas de Token
quota        monitoring      token-stats
```

Evita el agotamiento silencioso de cuotas, convierte las llamadas de caja negra en sistema observable, optimiza costos mediante cuantificación.

**Cuarta fase: Estabilidad y despliegue (avanzado)**

```
Estabilidad de sesiones largas → Capacidades del sistema → Despliegue en servidor
context-compression  system    deployment
```

Resuelve problemas latentes en sesiones largas, haz que el cliente sea más como un producto, finalmente aprende el despliegue en servidor.

**Selección rápida**:

| Tu escenario | Empieza con |
|-------------|-------------|
| La rotación de múltiples cuentas es inestable | [Programación de alta disponibilidad](./scheduling/) |
| Quieres fijar un nombre de modelo específico | [Enrutamiento de modelos](./model-router/) |
| Las cuotas siempre se agotan | [Gestión de cuotas](./quota/) |
| Quieres ver registros de solicitudes | [Proxy Monitor](./monitoring/) |
| Quieres estadísticas de consumo de Token | [Estadísticas de Token](./token-stats/) |
| Las conversaciones largas a menudo fallan | [Estabilidad de sesiones largas](./context-compression/) |
| Necesitas exponer a LAN | [Seguridad y privacidad](./security/) |
| Necesitas desplegar en servidor | [Despliegue en servidor](./deployment/) |

## Requisitos previos

::: warning Antes de comenzar, confirma que
- Has completado el capítulo [Inicio rápido](../start/) (al menos completar instalación, agregar cuenta, iniciar proxy inverso)
- Has completado al menos un protocolo en [Plataformas e integraciones](../platforms/) (como OpenAI o Anthropic)
- El proxy inverso local puede responder solicitudes normalmente
:::

## Siguientes pasos

Después de completar este capítulo, puedes continuar con:

- [Preguntas frecuentes](../faq/): Guía de solución de problemas cuando encuentres errores como 401/404/429/interrupción en streaming
- [Apéndice](../appendix/): Materiales de referencia como tabla rápida de endpoints, modelos de datos, límites de capacidad de z.ai, etc.
