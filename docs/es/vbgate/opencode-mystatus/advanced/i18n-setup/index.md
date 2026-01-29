---
title: "Soporte i18n: Cambio ZH/EN | opencode-mystatus"
subtitle: "Soporte multilingüe: cambio automático entre chino e inglés"
sidebarTitle: "Soporte i18n"
description: "Aprende i18n de opencode-mystatus. Detecta idioma automático, API Intl, variables de entorno, cambio de salida."
tags:
  - "i18n"
  - "internacionalización"
  - "detección de idioma"
  - "multilingüe"
prerequisite:
  - "start-quick-start"
order: 3
---

# Soporte multilingüe: cambio automático entre chino e inglés

## Lo que aprenderás

- Comprender cómo mystatus detecta automáticamente el idioma del sistema
- Saber cómo cambiar el idioma del sistema para cambiar el idioma de salida
- Entender la prioridad y el mecanismo de respaldo de la detección de idioma
- Dominar el principio de funcionamiento de la API Intl y las variables de entorno

## Tu situación actual

Podrías haber notado que el **soporte multilingüe** de mystatus a veces es chino, a veces inglés:

```
# Salida en chino
3小时限额
████████████████████████████ 剩余 85%
重置: 2小时30分钟后

# Salida en inglés
3-hour limit
████████████████████████████ 85% remaining
Resets in: 2h 30m
```

Pero no sabes:
- ¿Cómo sabe el plugin qué idioma usar?
- ¿Puedo cambiar manualmente a chino o inglés?
- ¿Qué sucede si la detección es incorrecta?

Esta lección te ayudará a comprender el mecanismo de detección de idioma.

## Enfoque central

El **soporte multilingüe** selecciona automáticamente chino o inglés según el entorno del idioma del sistema, sin necesidad de configuración manual. La prioridad de detección es: API Intl → variables de entorno → inglés predeterminado.

**Prioridad de detección** (de mayor a menor):

1. **API Intl** (recomendado) → `Intl.DateTimeFormat().resolvedOptions().locale`
2. **Variables de entorno** (respaldo) → `LANG`、`LC_ALL`、`LANGUAGE`
3. **Inglés predeterminado** (último recurso) → `"en"`

::: tip ¿Por qué no necesita configuración manual?
Porque la detección de idioma se basa en el entorno del sistema, el plugin se reconoce automáticamente al inicio, el usuario no necesita modificar ningún archivo de configuración.
:::

**Idiomas soportados**:
| Idioma | Código | Condición de detección |
|--- | --- | ---|
| Chino | `zh` | locale comienza con `zh` (como `zh-CN`、`zh-TW`) |
| Inglés | `en` | Otros casos |

**Cobertura de traducción**:
- Unidades de tiempo (días, horas, minutos)
| Artículos relacionados con límites (porcentaje restante, tiempo de restablecimiento) |
- Mensajes de error (fallo de autenticación, error de API, tiempo de espera agotado) |
- Títulos de plataforma (OpenAI, Zhipu AI, Z.ai, Google Cloud, GitHub Copilot)

## Sigue los pasos

### Paso 1: Ver el idioma actual del sistema

Primero confirma la configuración de idioma de tu sistema:

::: code-group

```bash [macOS/Linux]
echo $LANG
```

```powershell [Windows]
Get-ChildItem Env:LANG
```

:::

**Lo que deberías ver**:

- Sistema chino: `zh_CN.UTF-8`、`zh_TW.UTF-8` o similar
- Sistema inglés: `en_US.UTF-8`、`en_GB.UTF-8` o similar

### Paso 2: Prueba la detección de idioma

Ejecuta el comando `/mystatus`, observa el idioma de la salida:

```
/mystatus
```

**Lo que deberías ver**:

- Si el idioma del sistema es chino → La salida es en chino (como `3小时限额`、`重置: 2小时30分钟后`)
- Si el idioma del sistema es inglés → La salida es en inglés (como `3-hour limit`、`Resets in: 2h 30m`)

### Paso 3: Cambia temporalmente el idioma del sistema (para pruebas)

Si quieres probar los efectos de salida en diferentes idiomas, puedes modificar temporalmente las variables de entorno:

::: code-group

```bash [macOS/Linux (cambio temporal a inglés)]
LANG=en_US.UTF-8 /mystatus
```

```powershell [Windows (cambio temporal a inglés)]
$env:LANG="en_US.UTF-8"; /mystatus
```

:::

**Lo que deberías ver**:

Incluso si tu sistema es chino, la salida cambiará al formato en inglés.

::: warning
Esto es solo una prueba temporal, no cambiará permanentemente el idioma del sistema. Después de cerrar la terminal se restaurará la configuración original.
:::

### Paso 4: Comprende el mecanismo de detección de API Intl

La API Intl es una interfaz estándar de internacionalización proporcionada por navegadores y Node.js. El plugin usará preferiblemente esta API para detectar el idioma:

**Código de detección** (versión simplificada):

```javascript
// 1. Usar preferiblemente la API Intl
const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
if (intlLocale.startsWith("zh")) {
  return "zh";  // chino
}

// 2. Respaldo a variables de entorno
const lang = process.env.LANG || process.env.LC_ALL || "";
if (lang.startsWith("zh")) {
  return "zh";
}

// 3. Inglés predeterminado
return "en";
```

**Ventajas de la API Intl**:
- Más confiable, basado en la configuración real del sistema
- Soporta entornos de navegador y Node.js
- Proporciona información completa de locale (como `zh-CN`、`en-US`)

**Variables de entorno como respaldo**:
- Compatible con entornos que no soportan la API Intl
- Proporciona un método para controlar manualmente el idioma (mediante modificación de variables de entorno)

### Paso 5: Cambia permanentemente el idioma del sistema (si es necesario)

Si deseas que mystatus siempre use un idioma específico, puedes modificar la configuración de idioma del sistema:

::: info
Modificar el idioma del sistema afectará a todas las aplicaciones, no solo a mystatus.
:::

**macOS**:
1. Abre「Configuración del sistema」→「General」→「Idioma y región」
2. Agrega el idioma deseado y arrástralo a la parte superior
3. Reinicia OpenCode

**Linux**:
```bash
# Modifica ~/.bashrc o ~/.zshrc
export LANG=zh_CN.UTF-8

# Recarga la configuración
source ~/.bashrc
```

**Windows**:
1. Abre「Configuración」→「Hora e idioma」→「Idioma y región」
2. Agrega el idioma deseado y establécelo como predeterminado
3. Reinicia OpenCode

## Punto de control ✅

Verifica que la detección de idioma sea correcta:

| Elemento de prueba | Operación | Resultado esperado |
|--- | --- | ---|
| Sistema chino | Ejecuta `/mystatus` | Salida en chino (como `3小时限额`) |
| Sistema inglés | Ejecuta `/mystatus` | Salida en inglés (como `3-hour limit`) |
| Cambio temporal | Modifica la variable de entorno `LANG` y ejecuta el comando | El idioma de la salida cambia en consecuencia |

## Advertencias de errores comunes

### Problemas comunes

| Problema | Causa | Solución |
|--- | --- | ---|
| El idioma de la salida no coincide con lo esperado | Configuración incorrecta del idioma del sistema | Verifica la variable de entorno `LANG` o la configuración de idioma del sistema |
| La API Intl no está disponible | Versión de Node.js demasiado antigua o entorno no soportado | El plugin respaldará automáticamente a la detección por variables de entorno |
| El sistema chino muestra en inglés | La variable de entorno `LANG` no está establecida en `zh_*` | Establece el valor correcto de `LANG` (como `zh_CN.UTF-8`) |

### Explicación de la lógica de detección

**Cuándo usar la API Intl**:
- Node.js ≥ 0.12 (soporta la API Intl)
- Entorno de navegador (todos los navegadores modernos)

**Cuándo respaldar a variables de entorno**:
- La API Intl arroja una excepción
- El entorno no soporta la API Intl

**Cuándo usar el inglés predeterminado**:
- Las variables de entorno no están establecidas
- Las variables de entorno no comienzan con `zh`

::: tip
El plugin **detecta el idioma solo una vez** al cargar el módulo. Después de modificar el idioma del sistema necesitas reiniciar OpenCode para que surta efecto.
:::

## Resumen de esta lección

- **Detección automática**: mystatus detecta automáticamente el idioma del sistema, sin necesidad de configuración manual
- **Prioridad de detección**: API Intl → variables de entorno → inglés predeterminado
- **Idiomas soportados**: Chino (`zh`) e inglés (`en`)
- **Cobertura de traducción**: unidades de tiempo, artículos relacionados con límites, mensajes de error, títulos de plataforma
- **Cambiar idioma**: Modifica la configuración de idioma del sistema, reinicia OpenCode

## Próxima lección

> En la siguiente lección aprenderemos **[Preguntas frecuentes: no se puede consultar la cuota, token expirado, problemas de permisos](../../faq/troubleshooting/)**。
>
> Aprenderás:
> - Cómo solucionar problemas para leer el archivo de autenticación
> - Solución cuando el token expira
> - Recomendaciones de configuración cuando los permisos son insuficientes

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Función de detección de idioma | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L24-L40) | 24-40 |
| Definición de traducción en chino | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L46-L124) | 46-124 |
| Definición de traducción en inglés | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L125-L203) | 125-203 |
| Exportar idioma actual | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L210) | 210 |
| Exportar función de traducción | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L213) | 213 |

**Funciones clave**:
- `detectLanguage()`: Detecta el idioma del sistema del usuario, usa preferiblemente la API Intl, respalda a variables de entorno, inglés predeterminado
- `currentLang`: Idioma actual (detectado una vez al cargar el módulo)
- `t`: Función de traducción, devuelve el contenido de traducción correspondiente según el idioma actual

**Constantes clave**:
- `translations`: Diccionario de traducciones, contiene dos paquetes de idioma `zh` y `en`
- Tipos de traducción soportados: unidades de tiempo (days, hours, minutes), artículos relacionados con límites (hourLimit, dayLimit, remaining, resetIn), mensajes de error (authError, apiError, timeoutError), títulos de plataforma (openaiTitle, zhipuTitle, googleTitle, copilotTitle)

**Lógica de detección**:
1. Usar preferiblemente `Intl.DateTimeFormat().resolvedOptions().locale` para detectar el idioma
2. Si la API Intl no está disponible, respaldar a las variables de entorno `LANG`、`LC_ALL`、`LANGUAGE`
3. Si las variables de entorno tampoco existen o no comienzan con `zh`, usar inglés predeterminado

</details>
