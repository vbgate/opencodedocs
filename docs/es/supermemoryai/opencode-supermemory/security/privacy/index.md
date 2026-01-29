---
title: "Privacidad y Seguridad | opencode-supermemory"
subtitle: "Privacidad y Seguridad de Datos: Cómo Proteger tu Información Sensible"
sidebarTitle: "Privacidad"
description: "Comprende el mecanismo de protección de privacidad de opencode-supermemory. Aprende a usar etiquetas privadas para desensibilizar datos y configurar API Key de forma segura."
tags:
  - "privacidad"
  - "seguridad"
  - "configuración"
prerequisite:
  - "start-getting-started"
order: 1
---

# Privacidad y Seguridad de Datos: Cómo Proteger tu Información Sensible

## Lo que podrás hacer al terminar

*   **Entender a dónde van los datos**: Saber claramente qué datos se subirán a la nube y cuáles quedarán en local.
*   **Dominar técnicas de desensibilización**: Aprender a usar etiquetas `<private>` para evitar que información sensible (como contraseñas, claves) se suba.
*   **Gestionar claves de forma segura**: Aprender a configurar `SUPERMEMORY_API_KEY` de la manera más segura.

## Idea Central

Al usar opencode-supermemory, comprender el flujo de datos es crucial:

1.  **Almacenamiento en la nube**: Tus memorias (Memories) se almacenan en la base de datos en la nube de Supermemory, no en archivos locales. Esto significa que necesitas conexión de red para acceder a las memorias.
2.  **Desensibilización local**: Para proteger la privacidad, el plugin realiza desensibilización en local **antes** de enviar datos a la nube.
3.  **Control explícito**: El plugin no escanea automáticamente todos los archivos para subir, solo cuando el Agent llama explícitamente la herramienta `add` o se activa la compresión, el contenido relevante será procesado.

### Mecanismo de desensibilización

El plugin incorpora un filtro simple, especializado en identificar etiquetas `<private>`.

*   **Entrada**: `la contraseña de la base de datos aquí es <private>123456</private>`
*   **Procesamiento**: El plugin detecta la etiqueta, reemplaza el contenido con `[REDACTED]`.
*   **Carga**: `la contraseña de la base de datos aquí es [REDACTED]`

::: info Nota
Este proceso de procesamiento ocurre dentro del código del plugin, se completa antes de que los datos dejen tu computadora.
:::

## Sígueme

### Paso 1: Configurar API Key de forma segura

Aunque puedes escribir la API Key directamente en el archivo de configuración, para evitar fugas accidentales (ej: compartir accidentalmente el archivo de configuración con otros), recomendamos entender la lógica de prioridad.

**Regla de prioridad**:
1.  **Archivo de configuración** (`~/.config/opencode/supermemory.jsonc`): Prioridad más alta.
2.  **Variable de entorno** (`SUPERMEMORY_API_KEY`): Si no se configura en el archivo, se usa esta variable.

**Práctica recomendada**:
Si deseas cambiar flexiblemente o usar en entorno CI/CD, usa variables de entorno. Si eres desarrollador personal, configurar en el archivo JSONC del directorio de usuario también es seguro (porque no está en tu repositorio Git del proyecto).

### Paso 2: Usar etiquetas `<private>`

Cuando le dices al Agent en lenguaje natural que recuerde cierto contenido que contiene información sensible en la conversación, puedes usar etiquetas `<private>` para envolver las partes sensibles.

**Demostración de operación**:

Dile al Agent:
> Por favor recuerda, la IP de la base de datos en producción es 192.168.1.10, pero la contraseña de root es `<private>SuperSecretPwd!</private>`, no reveles la contraseña.

**Deberías ver**:
El Agent llamará la herramienta `supermemory` para guardar la memoria. Aunque la respuesta del Agent puede contener la contraseña (porque está en el contexto), la **memoria realmente guardada en la nube de Supermemory** ya está desensibilizada.

### Paso 3: Verificar resultado de desensibilización

Podemos verificar a través de búsqueda si la contraseña anterior realmente no se guardó.

**Operación**:
Deja que el Agent busque la memoria anterior:
> Busca la contraseña de la base de datos en producción.

**Resultado esperado**:
El contenido que el Agent recupera de Supermemory debería ser:
`la IP de la base de datos en producción es 192.168.1.10, pero la contraseña de root es [REDACTED]...`

Si el Agent te dice "la contraseña es [REDACTED]", significa que el mecanismo de desensibilización funciona correctamente.

## Errores comunes

::: warning Error 1: todo el código se subirá
**Hecho**: El plugin **no** subirá automáticamente todo tu repositorio de código. Solo cuando ejecutas `/supermemory-init` para realizar escaneo de inicialización, o el Agent decide explícitamente "recordar" cierta lógica de código, se subirá ese segmento específico.
:::

::: warning Error 2: archivos .env se cargan automáticamente
**Hecho**: El plugin lee `SUPERMEMORY_API_KEY` del entorno del proceso. Si pones un archivo `.env` en el directorio raíz del proyecto, el plugin **no** lo leerá automáticamente, a menos que la terminal o el programa principal OpenCode que uses lo cargue.
:::

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Lógica de desensibilización de privacidad | [`src/services/privacy.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/privacy.ts#L1-L13) | 1-13 |
| Carga de API Key | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |
| Llamada de plugin a desensibilización | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L282) | 282 |

**Funciones clave**:
- `stripPrivateContent(content)`: Ejecuta reemplazo regex, convierte contenido `<private>` en `[REDACTED]`.
- `loadConfig()`: Carga archivo de configuración local, prioridad mayor que variables de entorno.

</details>

## Próxima lección

> ¡Felicidades por completar el curso principal de opencode-supermemory!
>
> A continuación puedes:
> - Revisar [Configuración Avanzada](/es/supermemoryai/opencode-supermemory/advanced/configuration/) para más opciones de personalización.
