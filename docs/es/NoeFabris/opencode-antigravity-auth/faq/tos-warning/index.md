---
title: "Advertencia de TdS: Riesgos de Cuenta y Prácticas de Seguridad | Antigravity Auth"
sidebarTitle: "Evita que bloqueen tu cuenta"
subtitle: "Advertencia de TdS: Riesgos de Cuenta y Prácticas de Seguridad"
description: "Aprende sobre los riesgos de uso y las prácticas de seguridad de cuentas del plugin Antigravity Auth. Comprende escenarios de alto riesgo, mecanismos de shadow ban y la diferencia entre rate limits. Domina estrategias de múltiples cuentas, control de uso y métodos de calentamiento de cuentas."
tags:
  - FAQ
  - Advertencia de riesgos
  - Seguridad de cuentas
prerequisite:
  - start-quick-install
order: 5
---

# Advertencia de TdS

Al completar esta lección, comprenderás los riesgos potenciales de usar el plugin Antigravity Auth y cómo proteger la seguridad de tu cuenta de Google.

## Tu Situación Actual

Estás considerando usar el plugin Antigravity Auth para acceder a los modelos de IA de Google Antigravity, pero tienes algunas preocupaciones:

- Has visto informes en la comunidad sobre cuentas bloqueadas o con shadow ban
- Te preocupa que usar herramientas no oficiales viole los términos de servicio de Google
- No estás seguro de si usar una cuenta nueva o una existente
- Quieres saber cómo reducir los riesgos

Estas preocupaciones son válidas. Usar cualquier herramienta no oficial conlleva ciertos riesgos. Este artículo te ayudará a comprender los riesgos específicos y las estrategias de respuesta.

## Cuándo Necesitas Leer Esta Lección

- **Antes de instalar el plugin**: Comprende los riesgos antes de decidir si usarlo
- **Al elegir una cuenta**: Decide qué cuenta de Google usar para la autenticación
- **Cuando encuentres bloqueos**: Comprende las posibles causas y medidas preventivas
- **Al registrar nuevos usuarios**: Evita patrones de operación de alto riesgo

---

## Resumen de Riesgos Principales

::: danger Advertencia Importante

**El uso de este plugin puede violar los Términos de Servicio de Google.**

Algunos usuarios han reportado que sus cuentas de Google fueron bloqueadas o recibieron shadow ban (restricción de acceso sin notificación explícita).

**Al usar este plugin, aceptas la siguiente declaración:**
1. Esta es una herramienta no oficial, no aprobada ni respaldada por Google
2. Tu cuenta de Google puede ser suspendida o bloqueada permanentemente
3. Asumes todos los riesgos y consecuencias de usar este plugin

:::

### ¿Qué es el Shadow Ban?

**Shadow Ban** es una medida restrictiva que Google aplica a cuentas sospechosas. A diferencia del bloqueo directo, el shadow ban no muestra mensajes de error explícitos, sino que:
- Las solicitudes API devuelven errores 403 o 429
- La cuota muestra disponibilidad, pero en realidad no se puede llamar
- Otras cuentas funcionan normalmente, solo la cuenta marcada se ve afectada

El shadow ban generalmente dura varios días o semanas y no se puede recuperar mediante apelación.

---

## Escenarios de Alto Riesgo

Los siguientes escenarios aumentan significativamente el riesgo de que tu cuenta sea marcada o bloqueada:

### 🚨 Escenario 1: Cuentas de Google Completamente Nuevas

**Nivel de riesgo: Extremadamente alto**

Las cuentas de Google recién registradas que usan este plugin tienen una probabilidad muy alta de ser bloqueadas. Razones:
- Las nuevas cuentas carecen de datos históricos de comportamiento, lo que las hace susceptibles de ser marcadas por los sistemas de detección de abuso de Google
- Un gran número de llamadas API se considera comportamiento anormal en cuentas nuevas
- Google aplica una revisión más estricta a las cuentas nuevas

**Recomendación**: No crees cuentas nuevas específicamente para este plugin.

### 🚨 Escenario 2: Cuenta Nueva + Suscripción Pro/Ultra

**Nivel de riesgo: Extremadamente alto**

Las cuentas recién registradas que inmediatamente se suscriben a los servicios Pro o Ultra de Google frecuentemente son marcadas y bloqueadas. Razones:
- Los patrones de uso intensivo después de la suscripción en cuentas nuevas parecen abuso
- Google aplica una revisión más estricta a los nuevos usuarios de pago
- Este patrón difiere demasiado de la trayectoria de crecimiento de los usuarios normales

**Recomendación**: Permite que la cuenta "crezca naturalmente" durante un tiempo (al menos varios meses) antes de considerar una suscripción.

### 🟡 Escenario 3: Gran Cantidad de Solicitudes en Corto Tiempo

**Nivel de riesgo: Alto**

Iniciar un gran número de solicitudes API en un período corto, o usar frecuentemente proxies paralelos/sesiones múltiples, activará límites de velocidad y detección de abuso. Razones:
- Los patrones de solicitud de OpenCode son más intensivos que las aplicaciones nativas (llamadas de herramientas, reintentos, transmisión, etc.)
- Las solicitudes de alta concurrencia activan los mecanismos de protección de Google

**Recomendación**:
- Controla la frecuencia de solicitudes y el número de concurrentes
- Evita iniciar múltiples agentes paralelos simultáneamente
- Usa rotación de cuentas múltiples para dispersar solicitudes

### 🟡 Escenario 4: Usar la Única Cuenta de Google

**Nivel de riesgo: Medio**

Si solo tienes una cuenta de Google y dependes de ella para acceder a servicios críticos (Gmail, Drive, etc.), el riesgo es mayor. Razones:
- El bloqueo de la cuenta afectará tu trabajo diario
- No se puede recuperar mediante apelación
- Falta de plan de respaldo

**Recomendación**: Usa una cuenta independiente que no dependa de servicios críticos.

---

## Mejores Prácticas Recomendadas

### ✅ Prácticas Recomendadas

**1. Usa una Cuenta de Google Establecida**

Prioriza cuentas de Google que hayan estado en uso durante algún tiempo (se recomienda 6 meses o más):
- Tienen historial de uso normal de servicios de Google (Gmail, Drive, Google Search, etc.)
- Sin historial de violaciones
- La cuenta está vinculada a un número de teléfono y ha completado la verificación

**2. Configura Múltiples Cuentas**

Agrega varias cuentas de Google para dispersar solicitudes mediante rotación:
- Configura al menos 2-3 cuentas
- Usa la estrategia `account_selection_strategy: "hybrid"` (predeterminada)
- Cambia automáticamente de cuenta cuando se encuentren límites de velocidad

**3. Controla el Uso**

- Evita solicitudes intensivas en cortos períodos de tiempo
- Reduce el número de agentes paralelos
- Establece `max_rate_limit_wait_seconds: 0` en `antigravity.json` para fallar rápidamente en lugar de reintentar

**4. Monitorea el Estado de las Cuentas**

Verifica regularmente el estado de las cuentas:
- Revisa `rateLimitResetTimes` en `~/.config/opencode/antigravity-accounts.json`
- Habilita logs de depuración: `OPENCODE_ANTIGRAVITY_DEBUG=1 opencode`
- Pausa el uso durante 24-48 horas cuando encuentres errores 403/429

**5. "Calienta" Primero en la Interfaz Oficial**

Método reportado como efectivo por usuarios de la comunidad:
1. Inicia sesión en [Antigravity IDE](https://idx.google.com/) en tu navegador
2. Ejecuta algunos prompts simples (como "hola", "¿cuánto es 2+2?")
3. Después de 5-10 llamadas exitosas, comienza a usar el plugin

**Principio**: Usar la cuenta a través de la interfaz oficial hace que Google considere que se trata de comportamiento de usuario normal, reduciendo el riesgo de ser marcado.

### ❌ Prácticas a Evitar

- ❌ Crear cuentas de Google completamente nuevas específicamente para este plugin
- ❌ Suscribirte inmediatamente a Pro/Ultra en una cuenta recién registrada
- ❌ Usar tu única cuenta de servicios críticos (como correo de trabajo)
- ❌ Reintentar repetidamente después de activar el límite 429
- ❌ Iniciar una gran cantidad de agentes paralelos simultáneamente
- ❌ Enviar `antigravity-accounts.json` al control de versiones

---

## Preguntas Frecuentes

### P: Mi cuenta fue bloqueada, ¿puedo apelar?

**R: No.**

Si el bloqueo o shadow ban fue activado por la detección de abuso de Google a través de este plugin, generalmente no se puede recuperar mediante apelación. Razones:
- El bloqueo se activa automáticamente basado en patrones de uso de la API
- Google mantiene una actitud estricta hacia el uso de herramientas no oficiales
- Al apelar, necesitas explicar el propósito de la herramienta, pero este plugin en sí puede ser considerado una violación

**Recomendación**:
- Usa otras cuentas no afectadas
- Si todas las cuentas están bloqueadas, usa directamente [Antigravity IDE](https://idx.google.com/)
- Evita continuar intentando en cuentas bloqueadas

### P: ¿El uso de este plugin definitivamente resultará en un bloqueo?

**R: No necesariamente.**

La mayoría de los usuarios no han encontrado problemas al usar este plugin. El riesgo depende de:
- Edad de la cuenta e historial de comportamiento
- Frecuencia de uso y patrones de solicitud
- Si se siguen las mejores prácticas

**Evaluación de riesgo**:
- Cuenta antigua + uso moderado + rotación de cuentas → Bajo riesgo
- Cuenta nueva + solicitudes intensivas + cuenta única → Alto riesgo

### P: ¿Cuál es la diferencia entre shadow ban y rate limit?

**R: Fundamentalmente diferentes, formas de recuperación también diferentes.**

| Característica | Shadow Ban | Rate Limit (429) |
|---|---|---|
| Causa de activación | Detección de abuso, marcado como sospechoso | Frecuencia de solicitud excede la cuota |
| Código de error | 403 o falla silenciosa | 429 Too Many Requests |
| Duración | Días a semanas | Horas a un día |
| Método de recuperación | No se puede recuperar, necesitas otra cuenta | Esperar reinicio o cambiar de cuenta |
| ¿Prevenible? | Reducir riesgo siguiendo mejores prácticas | Controlar frecuencia de solicitudes |

### P: ¿Se pueden usar cuentas de Google empresariales?

**R: No se recomienda.**

Las cuentas empresariales generalmente están vinculadas a servicios y datos críticos, y el impacto del bloqueo es más severo. Además:
- Las cuentas empresariales tienen revisiones más estrictas
- Puede violar las políticas de TI de la empresa
- El riesgo es asumido por el individuo, pero afecta al equipo

**Recomendación**: Usa cuentas personales.

### P: ¿Las cuentas múltiples pueden evitar completamente el bloqueo?

**R: No pueden evitarlo completamente, pero pueden reducir el impacto.**

El rol de las cuentas múltiples:
- Dispersar solicitudes, reducir la probabilidad de que una cuenta única active límites
- Si una cuenta es bloqueada, otras cuentas siguen disponibles
- Cambiar automáticamente cuando se encuentran límites, mejorar disponibilidad

**Pero las cuentas múltiples no son un "amuleto"**:
- Si todas las cuentas activan la detección de abuso, pueden ser bloqueadas todas
- No abuses de cuentas múltiples para solicitudes intensivas
- Cada cuenta aún debe seguir las mejores prácticas

---

## Puntos de Verificación ✅

Después de leer esta lección, deberías saber:
- [ ] El uso de este plugin puede violar los TdS de Google, asumes el riesgo
- [ ] Cuenta nueva + suscripción Pro/Ultra es un escenario de alto riesgo
- [ ] Se recomienda usar cuentas de Google establecidas
- [ ] Configurar múltiples cuentas puede dispersar el riesgo
- [ ] Las cuentas bloqueadas no pueden recuperarse mediante apelación
- [ ] Controlar la frecuencia de solicitudes y el uso es muy importante

---

## Resumen de la Lección

Esta lección introdujo los riesgos potenciales de usar el plugin Antigravity Auth:

1. **Riesgo principal**: Puede violar los TdS de Google, la cuenta puede ser bloqueada o recibir shadow ban
2. **Escenarios de alto riesgo**: Cuentas nuevas, cuenta nueva + suscripción, solicitudes intensivas, cuenta única crítica
3. **Mejores prácticas**: Usar cuenta antigua, configurar múltiples cuentas, controlar uso, monitorear estado, "calentar" primero
4. **Preguntas frecuentes**: No se puede apelar, el riesgo varía según la persona, múltiples cuentas pueden reducir el impacto

Antes de usar este plugin, evalúa cuidadosamente los riesgos. Si no puedes aceptar las consecuencias de que la cuenta pueda ser bloqueada, se recomienda usar directamente [Antigravity IDE](https://idx.google.com/).

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

El contenido de esta lección se basa en la sección de advertencia de riesgos del README del proyecto (README.md:23-40), no involucra implementación de código específica.

| Función | Ruta del archivo | Línea |
|---|---|---|
| Declaración de advertencia de TdS | [`README.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L23-L40) | 23-40 |

</details>
