---
title: "Inicio rápido: Consulta cuotas IA | opencode-mystatus"
sidebarTitle: "Inicio rápido"
subtitle: "Inicio rápido: Consulta de todas las cuotas de plataformas de IA con un clic"
description: "Aprende a instalar opencode-mystatus y consultar cuotas de múltiples plataformas IA en 5 minutos. Soporta OpenAI, Zhipu AI, GitHub Copilot y Google Cloud."
tags:
  - "inicio rápido"
  - "instalación"
  - "configuración"
order: 1
---

# Inicio rápido: Consulta de todas las cuotas de plataformas de IA con un clic

## Lo que aprenderás

- Instalar el plugin opencode-mystatus en 5 minutos
- Configurar el comando de barra diagonal `/mystatus`
- Verificar la instalación exitosa y consultar la cuota de tu primera plataforma de IA

## Tu situación actual

Desarrollas usando múltiples plataformas de IA (OpenAI, Zhipu AI, GitHub Copilot, Google Cloud, etc.) y necesitas verificar frecuentemente las cuotas restantes de cada plataforma. Tener que iniciar sesión individualmente en cada plataforma para verificar consume demasiado tiempo.

## Cuándo usar esta técnica

- **Cuando recién comienzas a usar OpenCode**: Como principiante, este es el primer plugin que deberías instalar
- **Cuando necesitas gestionar cuotas de múltiples plataformas**: Usas simultáneamente OpenAI, Zhipu AI, GitHub Copilot y otras plataformas
- **Escenarios de colaboración en equipo**: Los miembros del equipo comparten múltiples cuentas de IA y necesitan ver las cuotas de manera unificada

## 🎒 Preparativos

Antes de comenzar, confirma que ya has:

::: info Prerrequisitos

- [ ] Instalado [OpenCode](https://opencode.ai)
- [ ] Configurado al menos la información de autenticación de una plataforma de IA (OpenAI, Zhipu AI, Z.ai, GitHub Copilot o Google Cloud)

:::

Si aún no has configurado ninguna plataforma de IA, se recomienda completar primero al menos un inicio de sesión en OpenCode y luego instalar este plugin.

## Enfoque central

opencode-mystatus es un plugin de OpenCode, su valor central es:

1. **Lectura automática de archivos de autenticación**: Lee toda la información de cuentas configuradas desde el almacenamiento oficial de autenticación de OpenCode
2. **Consulta paralela de plataformas**: Llama simultáneamente a las API oficiales de OpenAI, Zhipu AI, Z.ai, GitHub Copilot y Google Cloud
3. **Visualización intuitiva**: Muestra las cuotas restantes mediante barras de progreso y cuentas regresivas

El proceso de instalación es simple:
1. Agrega el plugin y el comando de barra diagonal en el archivo de configuración de OpenCode
2. Reinicia OpenCode
3. Ingresa `/mystatus` para consultar la cuota

## Sigue los pasos

### Paso 1: Selecciona el método de instalación

opencode-mystatus ofrece tres métodos de instalación, elige uno según tu preferencia:

::: code-group

```bash [Dejar que la IA te ayude (recomendado)]
Pega el siguiente contenido en cualquier agente de IA (Claude Code, OpenCode, Cursor, etc.):

Install opencode-mystatus plugin by following: https://raw.githubusercontent.com/vbgate/opencode-mystatus/main/README.md
```

```bash [Instalación manual]
Abre ~/.config/opencode/opencode.json, edita la configuración según el paso 2
```

```bash [Instalación desde archivo local]
Copia los archivos del plugin al directorio ~/.config/opencode/plugin/ (consulta el paso 4)
```

:::

**¿Por qué se recomienda que la IA instale**: El agente de IA ejecutará automáticamente todos los pasos de configuración, tú solo necesitas confirmar, es el método más rápido y conveniente.

---

### Paso 2: Configuración de instalación manual (obligatorio para instalación manual)

Si eliges la instalación manual, necesitas editar el archivo de configuración de OpenCode.

#### 2.1 Abre el archivo de configuración

```bash
# macOS/Linux
code ~/.config/opencode/opencode.json

# Windows
code %APPDATA%\opencode\opencode.json
```

#### 2.2 Agrega el plugin y el comando de barra diagonal

Agrega el siguiente contenido al archivo de configuración (mantén las configuraciones originales de `plugin` y `command`, agrega los nuevos elementos de configuración):

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

**Por qué configurar así**:

| Elemento de configuración | Valor | Función |
|--- | --- | ---|
| `plugin` array | `["opencode-mystatus"]` | Indica a OpenCode que cargue este plugin |
| `description` | "Query quota usage for all AI accounts" | Descripción mostrada en la lista de comandos de barra diagonal |
| `template` | "Use the mystatus tool..." | Indica a OpenCode cómo llamar a la herramienta mystatus |

**Lo que deberías ver**: El archivo de configuración contiene los campos `plugin` y `command` completos con el formato correcto (nota las comas y comillas de JSON).

---

### Paso 3: Instalación desde archivo local (obligatorio para instalación local)

Si eliges la instalación desde archivo local, necesitas copiar manualmente los archivos del plugin.

#### 3.1 Copia los archivos del plugin

```bash
# Asumiendo que ya has clonado el código fuente de opencode-mystatus en ~/opencode-mystatus/

# Copia el plugin principal y archivos de biblioteca
cp -r ~/opencode-mystatus/plugin/mystatus.ts ~/.config/opencode/plugin/
cp -r ~/opencode-mystatus/plugin/lib/ ~/.config/opencode/plugin/

# Copia la configuración del comando de barra diagonal
cp ~/opencode-mystatus/command/mystatus.md ~/.config/opencode/command/
```

**Por qué es necesario copiar estos archivos**:

- `mystatus.ts`: Archivo de entrada principal del plugin, contiene la definición de la herramienta mystatus
- `lib/` directorio: Contiene la lógica de consulta para OpenAI, Zhipu AI, Z.ai, GitHub Copilot y Google Cloud
- `mystatus.md`: Descripción de configuración del comando de barra diagonal

**Lo que deberías ver**: En el directorio `~/.config/opencode/plugin/` hay `mystatus.ts` y el subdirectorio `lib/`, en el directorio `~/.config/opencode/command/` hay `mystatus.md`.

---

### Paso 4: Reinicia OpenCode

Independientemente del método de instalación que elijas, el último paso es reiniciar OpenCode.

**Por qué es necesario reiniciar**: OpenCode solo lee el archivo de configuración al inicio, después de modificar la configuración necesitas reiniciar para que surta efecto.

**Lo que deberías ver**: Después de que OpenCode se reinicie, puede usarse normalmente.

---

### Paso 5: Verifica la instalación

Ahora verifica si la instalación fue exitosa.

#### 5.1 Prueba el comando de barra diagonal

En OpenCode, ingresa:

```bash
/mystatus
```

**Lo que deberías ver**:

Si has configurado al menos la información de autenticación de una plataforma de IA, verás una salida similar a esta (ejemplo con OpenAI):

::: code-group

```markdown [Salida en chino]
## OpenAI 账号额度

Account:        user@example.com (team)

3小时限额
███████████████████████████ 剩余 85%
重置: 2h 30m后
```

```markdown [Salida en inglés]
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m
```

:::

::: tip Explicación del idioma de salida
El plugin detecta automáticamente el idioma de tu sistema (chino muestra en chino, inglés muestra en inglés), ambas salidas anteriores son correctas.
:::

Si aún no has configurado ninguna cuenta, verás:

::: code-group

```markdown [Salida en chino]
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

```markdown [Salida en inglés]
No configured accounts found.

Supported account types:
- OpenAI (Plus/Team/Pro subscribers)
- Zhipu AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

:::

#### 5.2 Comprende el significado de la salida

| Elemento (versión en chino) | Elemento (versión en inglés) | Significado |
|--- | --- | ---|
| `## OpenAI 账号额度` | `## OpenAI Account Quota` | Título de plataforma |
| `user@example.com (team)` | `user@example.com (team)` | Información de cuenta (correo o equipo) |
| `3小时限额` | `3-hour limit` | Tipo de límite (límite de 3 horas) |
| `剩余 85%` | `85% remaining` | Porcentaje restante |
| `重置: 2h 30m后` | `Resets in: 2h 30m` | Cuenta regresiva de tiempo de restablecimiento |

**Por qué la API Key no se muestra completamente**: Para proteger tu privacidad, el plugin oculta automáticamente partes sensibles (como `9c89****AQVM`).

## Punto de control ✅

Confirma que has completado los siguientes pasos:

| Paso | Método de verificación | Resultado esperado |
|--- | --- | ---|
| Instalar plugin | Ver `~/.config/opencode/opencode.json` | El array `plugin` contiene `"opencode-mystatus"` |
| Configurar comando de barra diagonal | Ver el mismo archivo | El objeto `command` contiene la configuración `mystatus` |
| Reiniciar OpenCode | Ver el proceso de OpenCode | Se ha reiniciado |
| Probar comando | Ingresa `/mystatus` | Muestra información de cuota o "未找到任何已配置的账号" |

## Advertencias de errores comunes

### Error común 1: Error de formato JSON

**Síntoma**: OpenCode falla al iniciar, indica error de formato JSON

**Causa**: El archivo de configuración tiene comas o comillas adicionales o faltantes

**Solución**:

Usa una herramienta de validación JSON en línea para verificar el formato, por ejemplo:

```json
// ❌ Error: coma adicional en el último elemento
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }  // ← aquí no debería haber coma
}

// ✅ Correcto
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }
}
```

---

### Error común 2: Olvidar reiniciar OpenCode

**Síntoma**: Después de completar la configuración, al ingresar `/mystatus` indica "comando no encontrado"

**Causa**: OpenCode no ha recargado el archivo de configuración

**Solución**:

1. Sal completamente de OpenCode (no minimizar)
2. Reinicia OpenCode
3. Intenta el comando `/mystatus` nuevamente

---

### Error común 3: Muestra "未找到任何已配置的账号"

**Síntoma**: Después de ejecutar `/mystatus` muestra "未找到任何已配置的账号"

**Causa**: Aún no has iniciado sesión en ninguna plataforma de IA en OpenCode

**Solución**:

1. Inicia sesión en al menos una plataforma de IA en OpenCode (OpenAI, Zhipu AI, Z.ai, GitHub Copilot o Google Cloud)
2. La información de autenticación se guardará automáticamente en `~/.local/share/opencode/auth.json`
3. Ejecuta `/mystatus` nuevamente

---

### Error común 4: Fallo en la consulta de cuota de Google Cloud

**Síntoma**: Todas las demás plataformas consultan normalmente, pero Google Cloud muestra error

**Causa**: Google Cloud requiere un plugin de autenticación adicional

**Solución**:

Primero instala el plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) para completar la autenticación de cuenta de Google.

## Resumen de esta lección

Esta lección completó la instalación y verificación inicial de opencode-mystatus:

1. **Tres métodos de instalación**: Que la IA te ayude (recomendado), instalación manual, instalación desde archivo local
2. **Ubicación del archivo de configuración**: `~/.config/opencode/opencode.json`
3. **Elementos de configuración clave**:
   - Array `plugin`: Agrega `"opencode-mystatus"`
   - Objeto `command`: Configura el comando de barra diagonal `mystatus`
4. **Método de verificación**: Después de reiniciar OpenCode, ingresa `/mystatus`
5. **Lectura automática de autenticación**: El plugin lee automáticamente la información de cuentas configuradas desde `~/.local/share/opencode/auth.json`

Después de completar la instalación, puedes usar el comando `/mystatus` o consultas en lenguaje natural en OpenCode para consultar las cuotas de todas las plataformas de IA.

## Próxima lección

> En la siguiente lección aprenderemos **[Usar mystatus: comandos de barra diagonal y lenguaje natural](/es/vbgate/opencode-mystatus/start/using-mystatus/)**.
>
> Aprenderás:
> - Uso detallado del comando de barra diagonal `/mystatus`
> - Cómo activar la herramienta mystatus con lenguaje natural
> - Diferencias y escenarios de uso de ambos métodos
> - Principios de configuración de comandos de barra diagonal

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Entrada del plugin | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 26-94 |
| Definición de herramienta mystatus | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| Leer archivo de autenticación | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 35-46 |
| Consulta paralela de todas las plataformas | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| Recopilación y resumen de resultados | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| Configuración de comando de barra diagonal | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |

**Constantes clave**:
- Ruta del archivo de autenticación: `~/.local/share/opencode/auth.json` (`plugin/mystatus.ts:35`)

**Funciones clave**:
- `mystatus()`: Función principal de la herramienta mystatus, lee el archivo de autenticación y consulta paralelamente todas las plataformas (`plugin/mystatus.ts:29-33`)
- `collectResult()`: Recopila los resultados de consulta en los arrays results y errors (`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()`: Consulta la cuota de OpenAI (`plugin/lib/openai.ts`)
- `queryZhipuUsage()`: Consulta la cuota de Zhipu AI (`plugin/lib/zhipu.ts`)
- `queryZaiUsage()`: Consulta la cuota de Z.ai (`plugin/lib/zhipu.ts`)
- `queryGoogleUsage()`: Consulta la cuota de Google Cloud (`plugin/lib/google.ts`)
- `queryCopilotUsage()`: Consulta la cuota de GitHub Copilot (`plugin/lib/copilot.ts`)

**Formato del archivo de configuración**:
La configuración del plugin y el comando de barra diagonal en el archivo de configuración de OpenCode `~/.config/opencode/opencode.json` se refiere a [`README.zh-CN.md`](https://github.com/vbgate/opencode-mystatus/blob/main/README.zh-CN.md#安装) líneas 33-82.

</details>
