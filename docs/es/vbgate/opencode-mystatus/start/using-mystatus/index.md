---
title: "Usar mystatus: Comandos y lenguaje | opencode-mystatus"
sidebarTitle: "Usar mystatus"
subtitle: "Usar mystatus: Comandos y lenguaje"
description: "Aprende a usar opencode-mystatus para consultar cuotas de IA. Domina el comando /mystatus y lenguaje natural, consulta múltiples plataformas con barras de progreso."
tags:
  - "inicio rápido"
  - "comando de barra diagonal"
  - "lenguaje natural"
prerequisite:
  - "start-quick-start"
order: 2
---
# Usar mystatus: comandos de barra diagonal y lenguaje natural

## Lo que aprenderás

- Usar el comando de barra diagonal `/mystatus` para consultar con un clic todas las cuotas de plataformas de IA
- Hacer preguntas en lenguaje natural para que OpenCode llame automáticamente a la herramienta mystatus
- Comprender las diferencias y escenarios de uso de ambos métodos de activación

## Tu situación actual

Desarrollas usando múltiples plataformas de IA (OpenAI, Zhipu AI, GitHub Copilot, etc.), quieres saber cuánta cuota le queda a cada plataforma, pero no quieres iniciar sesión individualmente en cada plataforma para verlo — es demasiado problemático.

## Cuándo usar esta técnica

- **Cuando necesitas ver rápidamente las cuotas de todas las plataformas**: Verifica antes de comenzar el desarrollo cada día, organiza el uso de manera razonable
- **Cuando quieres conocer la cuota específica de una plataforma**: Por ejemplo, quieres confirmar si OpenAI está casi agotado
- **Cuando quieres verificar si la configuración surtió efecto**: Acabas de configurar una nueva cuenta, verifica si puedes consultar normalmente

::: info Verificación previa

Este tutorial asume que has completado la [instalación del plugin opencode-mystatus](/es/vbgate/opencode-mystatus/start/quick-start/). Si aún no lo has instalado, completa primero los pasos de instalación.

:::

## Enfoque central

opencode-mystatus ofrece dos formas de activar la herramienta mystatus:

1. **Comando de barra diagonal `/mystatus`**: Rápido, directo, sin ambigüedad, adecuado para consultas frecuentes
2. **Preguntas en lenguaje natural**: Más flexible, adecuado para consultas combinadas con escenarios específicos

Ambos métodos llaman a la misma herramienta `mystatus`, la herramienta consulta paralelamente las cuotas de todas las plataformas de IA configuradas y devuelve resultados con barras de progreso, estadísticas de uso y cuentas regresivas de restablecimiento.

## Sigue los pasos

### Paso 1: Usa el comando de barra diagonal para consultar la cuota

En OpenCode, ingresa el siguiente comando:

```bash
/mystatus
```

**Por qué**
El comando de barra diagonal es un mecanismo de comando rápido de OpenCode, puede llamar rápidamente herramientas predefinidas. El comando `/mystatus` llama directamente a la herramienta mystatus, sin necesidad de parámetros adicionales.

**Lo que deberías ver**:
OpenCode devuelve la información de cuota de todas las plataformas configuradas, el formato es el siguiente:

```
## OpenAI 账号额度

Account:        user@example.com (team)

3小时限额
███████████████████████████ 剩余 85%
重置: 2h 30m后

## 智谱 AI 账号额度

Account:        9c89****AQVM (Coding Plan)

5小时 token 限额
███████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4小时后
```

Cada plataforma mostrará:
- Información de cuenta (correo o API Key enmascarada)
- Barra de progreso (visualiza la cuota restante)
- Cuenta regresiva de tiempo de restablecimiento
- Uso y uso total (algunas plataformas)

### Paso 2: Haz preguntas en lenguaje natural

Además del comando de barra diagonal, también puedes hacer preguntas en lenguaje natural, OpenCode reconocerá automáticamente tu intención y llamará a la herramienta mystatus.

Prueba estos métodos de pregunta:

```bash
Check my OpenAI quota
```

O

```bash
How much Codex quota do I have left?
```

O

```bash
Show my AI account status
```

**Por qué**
Las consultas en lenguaje natural se ajustan más a los hábitos de conversación diaria, adecuadas para plantear preguntas en escenarios específicos de desarrollo. OpenCode reconocerá a través de coincidencia semántica que quieres consultar cuotas y llamará automáticamente a la herramienta mystatus.

**Lo que deberías ver**:
El mismo resultado de salida que el comando de barra diagonal, solo que el método de activación es diferente.

### Paso 3: Comprende la configuración del comando de barra diagonal

¿Cómo funciona el comando de barra diagonal `/mystatus`? Se define en el archivo de configuración de OpenCode.

Abre `~/.config/opencode/opencode.json`, encuentra la sección `command`:

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool to query quota usage. Return the result as-is without modification."
    }
  }
}
```

**Explicación de elementos de configuración clave**:

| Elemento de configuración | Valor | Función |
|--- | --- | ---|
| `description` | "Query quota usage for all AI accounts" | Descripción mostrada en la lista de comandos |
| `template` | "Use to mystatus tool..." | Indica a OpenCode cómo procesar este comando |

**Por qué es necesario el template**
El template es una "instrucción" para OpenCode, le indica: cuando el usuario ingresa `/mystatus`, llama a la herramienta mystatus y devuelve el resultado tal cual sin modificaciones.

## Punto de control ✅

Confirma que has dominado ambos métodos de uso:

| Habilidad | Método de verificación | Resultado esperado |
|--- | --- | ---|
| Consulta con comando de barra diagonal | Ingresa `/mystatus` | Muestra información de cuota de todas las plataformas |
| Consulta en lenguaje natural | Ingresa "Check my OpenAI quota" | Muestra información de cuota |
| Comprender la configuración | Ver opencode.json | Encuentra la configuración del comando mystatus |

## Advertencias de errores comunes

### Error común 1: El comando de barra diagonal no responde

**Síntoma**: Después de ingresar `/mystatus` no hay ninguna respuesta

**Causa**: El archivo de configuración de OpenCode no ha configurado correctamente el comando de barra diagonal

**Solución**:
1. Abre `~/.config/opencode/opencode.json`
2. Confirma que la sección `command` contiene la configuración `mystatus` (ver paso 3)
3. Reinicia OpenCode

### Error común 2: Las preguntas en lenguaje natural no activan la herramienta mystatus

**Síntoma**: Después de ingresar "Check my OpenAI quota", OpenCode no llama a la herramienta mystatus, sino que intenta responder por sí mismo

**Causa**: OpenCode no reconoció correctamente tu intención

**Solución**:
1. Intenta una expresión más clara: "Use mystatus tool to check my OpenAI quota"
2. O usa directamente el comando de barra diagonal `/mystatus`, es más confiable

### Error común 3: Muestra "未找到任何已配置的账号"

**Síntoma**: Después de ejecutar `/mystatus` muestra "未找到任何已配置的账号"

**Causa**: Aún no has configurado la información de autenticación de ninguna plataforma

**Solución**:
- Configura al menos la información de autenticación de una plataforma (OpenAI, Zhipu AI, Z.ai, GitHub Copilot o Google Cloud)
- Consulta las explicaciones de configuración en el [tutorial de inicio rápido](/es/vbgate/opencode-mystatus/start/quick-start/)

## Resumen de esta lección

La herramienta mystatus ofrece dos métodos de uso:
1. **Comando de barra diagonal `/mystatus`**: Rápido y directo, adecuado para consultas frecuentes
2. **Preguntas en lenguaje natural**: Más flexible, adecuado para combinarse con escenarios específicos

Ambos métodos consultan paralelamente las cuotas de todas las plataformas de IA configuradas y devuelven resultados con barras de progreso y cuentas regresivas de restablecimiento. La configuración del comando de barra diagonal se define en `~/.config/opencode/opencode.json`, a través del template se indica a OpenCode cómo llamar a la herramienta mystatus.

## Próxima lección

> En la siguiente lección aprenderemos **[Interpretar la salida: barras de progreso, tiempos de restablecimiento y múltiples cuentas](/es/vbgate/opencode-mystatus/start/understanding-output/)**.
>
> Aprenderás:
> - Cómo interpretar el significado de las barras de progreso
> - Cómo se calculan las cuentas regresivas de tiempo de restablecimiento
> - Formato de salida en escenarios con múltiples cuentas
> - Principios de generación de barras de progreso

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Definición de herramienta mystatus | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| Descripción de herramienta | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 30-31 |
| Configuración de comando de barra diagonal | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |
| Consulta paralela de todas las plataformas | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| Recopilación y resumen de resultados | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |

**Constantes clave**:
No hay (esta sección presenta principalmente el método de llamada, no involucra constantes específicas)

**Funciones clave**:
- `mystatus()`: Función principal de la herramienta mystatus, lee el archivo de autenticación y consulta paralelamente todas las plataformas (`plugin/mystatus.ts:29-33`)
- `collectResult()`: Recopila los resultados de consulta en los arrays results y errors (`plugin/mystatus.ts:100-116`)

</details>
