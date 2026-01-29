---
title: "Interpretar salida: barras y cuentas | opencode-mystatus"
sidebarTitle: "Interpretar salida"
subtitle: "Interpretar salida: barras de progreso, tiempos de restablecimiento y múltiples cuentas"
description: "Aprende a interpretar la salida de opencode-mystatus. Comprende las barras de progreso, tiempos de restablecimiento y diferencias entre OpenAI, Zhipu AI, Copilot y Google Cloud."
tags:
  - "formato de salida"
  - "barra de progreso"
  - "tiempo de restablecimiento"
  - "múltiples cuentas"
prerequisite:
  - "start-quick-start"
order: 3
---

# Interpretar la salida: barras de progreso, tiempos de restablecimiento y múltiples cuentas

## Lo que aprenderás

- Comprender cada elemento de información en la salida de mystatus
- Entender el significado de la barra de progreso (sólido vs hueco)
- Conocer los ciclos de límite de diferentes plataformas (3 horas, 5 horas, mensual)
- Identificar diferencias en las cuotas de múltiples cuentas

## Tu situación actual

Ejecutaste `/mystatus` y viste barras de progreso, porcentajes y cuentas regresivas, pero no comprendes:

- ¿Es mejor que la barra de progreso esté llena o vacía?
- ¿Qué significa "Resets in: 2h 30m"?
- ¿Por qué algunas plataformas muestran dos barras de progreso y otras solo una?
- ¿Por qué Google Cloud tiene varias cuentas?

Esta lección te ayudará a desglosar cada información.

## Enfoque central

La salida de mystatus tiene un formato unificado, pero hay diferencias entre plataformas:

**Elementos unificados**:
- Barra de progreso: `█` (sólido) indica restante, `░` (hueco) indica usado
- Porcentaje: Calculado como porcentaje restante basado en el uso
- Tiempo de restablecimiento: Cuenta regresiva hasta la siguiente renovación de cuota

**Diferencias por plataforma**:
| Plataforma | Ciclo de límite | Características |
| -------------- | --------------------------- | ----------------------- |
| OpenAI | 3 horas / 24 horas | Puede mostrar dos ventanas |
| Zhipu AI / Z.ai | Token de 5 horas / cuota mensual de MCP | Dos tipos diferentes de límite |
| GitHub Copilot | Mensual | Muestra valores numéricos específicos (229/300) |
| Google Cloud | Por modelo | Cada cuenta muestra 4 modelos |

## Análisis de la estructura de salida

### Ejemplo de salida completa

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
████████░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

## GitHub Copilot Account Quota

Account:        GitHub Copilot (individual)

Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)

## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

### Significado de cada parte

#### 1. Línea de información de cuenta

```
Account:        user@example.com (team)
```

- **OpenAI / Copilot**: Muestra correo + tipo de suscripción
- **Zhipu AI / Z.ai**: Muestra API Key enmascarada + tipo de cuenta (Coding Plan)
- **Google Cloud**: Muestra correo, múltiples cuentas separadas por `###`

#### 2. Barra de progreso

```
███████████████████████████ 85% remaining
```

- `█` (bloque sólido): Cuota **restante**
- `░` (bloque hueco): Cuota **usada**
- **Porcentaje**: Porcentaje restante (cuanto mayor mejor)

::: tip Memoria técnica
Cuanto más llena la barra sólida, más restante → continúa usando con confianza
Cuanto más llena la barra hueca, más has usado → ahorra un poco
:::

#### 3. Cuenta regresiva de tiempo de restablecimiento

```
Resets in: 2h 30m
```

Indica cuánto tiempo falta hasta la próxima renovación de la cuota.

**Ciclos de restablecimiento**:
- **OpenAI**: Ventana de 3 horas / ventana de 24 horas
- **Zhipu AI / Z.ai**: Límite de token de 5 horas / cuota mensual de MCP
- **GitHub Copilot**: Mensual (muestra fecha específica)
- **Google Cloud**: Cada modelo tiene tiempo de restablecimiento independiente

#### 4. Detalles numéricos (algunas plataformas)

Zhipu AI y Copilot muestran valores numéricos específicos:

```
Used: 0.5M / 10.0M              # Zhipu AI: usado / total (unidad: millones de tokens)
Premium        24% (229/300)     # Copilot: porcentaje restante (usado / cuota total)
```

## Explicación detallada de diferencias por plataforma

### OpenAI: Límite de doble ventana

OpenAI puede mostrar dos barras de progreso:

```
3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
████████░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m
```

- **3-hour limit**: Ventana deslizante de 3 horas, adecuada para uso de alta frecuencia
- **24-hour limit**: Ventana deslizante de 24 horas, adecuada para planificación a largo plazo

**Cuentas de equipo** (Team):
- Tienen dos límites de cuota: ventana principal y ventana secundaria
- Diferentes miembros comparten la misma cuota de Team

**Cuentas personales** (Plus):
- Generalmente solo muestran la ventana de 3 horas

### Zhipu AI / Z.ai: Dos tipos de límite

```
5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

MCP limit
███████████████████████████ 100% remaining
Used: 0 / 1000
```

- **5-hour token limit**: Límite de uso de tokens en 5 horas
- **MCP limit**: Cuota mensual de MCP (Model Context Protocol), usada para función de búsqueda

::: warning
La cuota de MCP es mensual, el tiempo de restablecimiento es largo. Si muestra lleno, necesitas esperar al próximo mes para recuperarse.
:::

### GitHub Copilot: Cuota mensual

```
Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)
```

- **Premium Requests**: Uso de funciones premium de Copilot
- Muestra valores numéricos específicos (usado / cuota total)
- Restablecimiento mensual, muestra fecha específica

**Diferencias por tipo de suscripción**:
| Tipo de suscripción | Cuota mensual | Descripción |
| ---------- | -------- | ---------------------- |
| Free | N/A | Sin límite de cuota, pero funciones limitadas |
| Pro | 300 | Versión personal estándar |
| Pro+ | Mayor | Versión mejorada |
| Business | Mayor | Versión empresarial |
| Enterprise | Ilimitado | Versión empresarial |

### Google Cloud: Múltiples cuentas + múltiples modelos

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

**Formato**: `Nombre del modelo | Tiempo de restablecimiento | Barra de progreso + porcentaje`

**Explicación de los 4 modelos**:
| Nombre del modelo | API Key correspondiente | Uso |
| -------- | ---------------------------------------------- | ----------- |
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Razonamiento avanzado |
| G3 Image | `gemini-3-pro-image` | Generación de imágenes |
| G3 Flash | `gemini-3-flash` | Generación rápida |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Modelo Claude |

**Visualización de múltiples cuentas**:
- Cada cuenta de Google se separa con `###`
- Cada cuenta muestra sus 4 modelos de cuota
- Puedes comparar el uso de cuotas de diferentes cuentas

## Advertencias de errores comunes

### Malentendidos comunes

| Malentendido | Realidad |
| ------------------------- | -------------------------------------- |
| Barra de progreso completamente sólida = no usado | Barra sólida llena = **más restante**, puedes usar con confianza |
| Tiempo de restablecimiento corto = cuota casi agotada | Tiempo de restablecimiento corto = se restablecerá pronto, puedes continuar usando |
| Porcentaje 100% = agotado | Porcentaje 100% = **completamente restante** |
| Zhipu AI solo muestra un límite | En realidad hay TOKENS_LIMIT y TIME_LIMIT, dos tipos |

### ¿Qué hacer cuando la cuota está llena?

Si la barra de progreso está completamente hueca (0% remaining):

1. **Límite a corto plazo** (como 3 horas, 5 horas): Espera a que termine la cuenta regresiva de restablecimiento
2. **Límite mensual** (como Copilot, MCP): Espera hasta el próximo mes
3. **Múltiples cuentas**: Cambia a otra cuenta (Google Cloud soporta múltiples cuentas)

::: info
mystatus es una herramienta **solo de lectura**, no consume tu cuota ni activa ninguna llamada API.
:::

## Resumen de esta lección

- **Barra de progreso**: Sólido `█` = restante, hueco `░` = usado
- **Tiempo de restablecimiento**: Cuenta regresiva hasta la próxima renovación de cuota
- **Diferencias por plataforma**: Diferentes plataformas tienen diferentes ciclos de límite (3h/5h/mensual)
- **Múltiples cuentas**: Google Cloud muestra múltiples cuentas para facilitar la gestión de cuotas

## Próxima lección

> En la siguiente lección aprenderemos **[Consulta de cuota de OpenAI](../../platforms/openai-usage/)**.
>
> Aprenderás:
> - Diferencias entre límites de 3 horas y 24 horas de OpenAI
> - Mecanismo de compartir cuota en cuentas de equipo
> - Cómo analizar el token JWT para obtener información de cuenta

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- | ------- |
| Generación de barra de progreso | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L40-L53) | 40-53 |
| Formato de tiempo | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L18-L29) | 18-29 |
| Cálculo de porcentaje restante | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L63-L65) | 63-65 |
| Formato de cantidad de tokens | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L70-L72) | 70-72 |
| Formato de salida de OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| Formato de salida de Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L115-L177) | 115-177 |
| Formato de salida de Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L395-L447) | 395-447 |
| Formato de salida de Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |

**Funciones clave**:
- `createProgressBar(percent, width)`: Genera barra de progreso, bloques sólidos indican restante
- `formatDuration(seconds)`: Convierte segundos a formato de tiempo legible para humanos (como "2h 30m")
- `calcRemainPercent(usedPercent)`: Calcula porcentaje restante (100 - porcentaje usado)
- `formatTokens(tokens)`: Formatea la cantidad de tokens en unidades de millones (como "0.5M")

**Constantes clave**:
- Ancho predeterminado de barra de progreso: 30 caracteres (modelos de Google Cloud usan 20 caracteres)
- Caracteres de barra de progreso: `█` (sólido), `░` (hueco)

</details>
