---
title: "Inicio Rápido: Instalación y Configuración | opencode-supermemory"
sidebarTitle: "Inicio Rápido"
subtitle: "Inicio Rápido: Instalación y Configuración"
description: "Aprende a instalar opencode-supermemory y configurar la API Key. En minutos, obtén memoria persistente para tu Agent."
tags:
  - "instalación"
  - "configuración"
  - "introducción"
prerequisite:
  - ""
order: 1
---

# Inicio Rápido: Instalación y Configuración

## Lo que podrás hacer al terminar

En esta lección, aprenderás a:
1.  Instalar el plugin **opencode-supermemory** en tu entorno de OpenCode.
2.  Configurar la Supermemory API Key para conectar con la base de datos en la nube.
3.  Verificar que el plugin se haya cargado correctamente.
4.  Resolver conflictos potenciales con otros plugins (como Oh My OpenCode).

Al completar, tu Agent tendrá la capacidad básica de conectarse a la base de datos de memoria en la nube.

## Tu situación actual

Es posible que ya hayas descubierto que, aunque el Agent de OpenCode es inteligente, es muy olvidadizo:
- Cada vez que inicias una nueva sesión, parece tener amnesia, olvidando tus preferencias anteriores.
- Enseñaste normas de arquitectura en el proyecto A, pero en el proyecto B las olvidó.
- En sesiones largas, la información clave del inicio se "empuja" fuera del contexto.

Necesitas un cerebro externo para ayudar al Agent a recordar estas cosas.

## Cuándo usar este método

- **Primera vez**: Cuando te acercas por primera vez a opencode-supermemory.
- **Reinstalación de entorno**: Cuando migras a una nueva computadora o restableces la configuración de OpenCode.
- **Solución de problemas**: Cuando sospechas que el plugin no está bien instalado o hay problemas con la conexión API.

---

## 🎒 Preparación previa

Antes de comenzar, asegúrate de haber:

1.  **Instalado OpenCode**: Asegúrate de que el comando `opencode` esté disponible en la terminal.
2.  **Obtenido una API Key**:
    - Visita [Supermemory Console](https://console.supermemory.ai)
    - Regístrate/inicia sesión
    - Crea una nueva API Key (comienza con `sm_`)

::: info ¿Qué es Supermemory?
Supermemory es una capa de memoria en la nube diseñada específicamente para AI Agent. No solo puede almacenar datos, sino también ayudar al Agent a recordar las cosas correctas en el momento adecuado mediante búsqueda semántica.
:::

---

## Idea Central

El proceso de instalación es muy simple, esencialmente son tres pasos:

1.  **Instalar plugin**: Ejecuta el script de instalación, registra el plugin en OpenCode.
2.  **Configurar clave**: Dile al plugin cuál es tu API Key.
3.  **Verificar conexión**: Reinicia OpenCode, confirma que el Agent pueda ver las nuevas herramientas.

---

## Sígueme

### Paso 1: Instalar el plugin

Ofrecemos dos métodos de instalación, elige el que te convenga.

::: code-group

```bash [Soy humano (instalación interactiva)]
# Recomendado: habrá guía interactiva para ayudarte a manejar la configuración automáticamente
bunx opencode-supermemory@latest install
```

```bash [Soy Agent (instalación automática)]
# Si haces que un Agent te ayude a instalar, usa este comando (salta confirmación interactiva y resuelve conflictos automáticamente)
bunx opencode-supermemory@latest install --no-tui --disable-context-recovery
```

:::

**Deberías ver**:
La terminal muestra `✓ Setup complete!`, indicando que el plugin se ha registrado exitosamente en `~/.config/opencode/opencode.jsonc`.

### Paso 2: Configurar la API Key

El plugin necesita una API Key para leer y escribir tu memoria en la nube. Tienes dos formas de configuración:

#### Método A: Variables de entorno (recomendado)

Agrega directamente en tu archivo de configuración de Shell (como `.zshrc` o `.bashrc`):

```bash
export SUPERMEMORY_API_KEY="sm_tu_clave..."
```

#### Método B: Archivo de configuración

O crea un archivo de configuración dedicado `~/.config/opencode/supermemory.jsonc`:

```json
{
  "apiKey": "sm_tu_clave..."
}
```

**Por qué**: Las variables de entorno son más seguras y no se comprometen accidentalmente en el repositorio de código; el archivo de configuración es más conveniente para gestionar múltiples configuraciones.

### Paso 3: Resolver conflictos (si usas Oh My OpenCode)

Si instalaste [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode), su función integrada de gestión de contexto puede entrar en conflicto con Supermemory.

**Método de verificación**:
El script de instalación usualmente detectará automáticamente y te pedirá desactivar los hooks conflictivos. Si no, verifica manualmente `~/.config/opencode/oh-my-opencode.json`:

```json
{
  "disabled_hooks": [
    "anthropic-context-window-limit-recovery"  // ✅ Asegúrate de que esta línea exista
  ]
}
```

**Por qué**: Supermemory proporciona una "compresión preventiva" más inteligente. Si dos plugins intentan gestionar el contexto simultáneamente, causará confusión.

### Paso 4: Verificar instalación

Reinicia OpenCode, luego ejecuta el comando de verificación:

```bash
opencode -c
```

O directamente entra al modo interactivo de OpenCode y verifica la lista de herramientas.

**Deberías ver**:
En la lista de herramientas (Tools), aparece la herramienta `supermemory`.

```
Available Tools:
- supermemory (add, search, profile, list, forget)
...
```

---

## Punto de Control ✅

Verifica los siguientes elementos por tu cuenta para asegurar que todo esté listo:

- [ ] Ejecuta `cat ~/.config/opencode/opencode.jsonc`, puedes ver `"opencode-supermemory"` en la lista de `plugin`.
- [ ] La variable de entorno `SUPERMEMORY_API_KEY` ha entrado en vigor (puedes verificar con `echo $SUPERMEMORY_API_KEY`).
- [ ] Después de ejecutar `opencode`, el Agent no muestra mensajes de error.

---

## Advertencias de errores comunes

::: warning Error común: API Key no entró en vigor
Si configuraste la variable de entorno pero el plugin indica que no está autenticado, verifica:
1. ¿Reiniciaste la terminal? (Después de modificar `.zshrc` necesitas `source ~/.zshrc` o reiniciar)
2. ¿Reiniciaste OpenCode? (El proceso de OpenCode necesita reiniciar para leer nuevas variables)
:::

::: warning Error común: Error de formato JSON
Si modificas manualmente `opencode.jsonc`, asegúrate de que el formato JSON sea correcto (especialmente las comas). El script de instalación maneja esto automáticamente, pero la modificación manual es propensa a errores.
:::

---

## Resumen de esta lección

¡Felicidades! Has instalado exitosamente el "hipocampo" en OpenCode. Ahora, tu Agent está listo para comenzar a recordar.

- Instalamos el plugin `opencode-supermemory`.
- Configuramos las credenciales de conexión a la nube.
- Excluimos conflictos potenciales de plugins.

## Próxima lección

> En la siguiente lección aprenderemos **[Inicialización del Proyecto: Creando la Primera Impresión](../initialization/index.md)**.
>
> Aprenderás:
> - Cómo hacer que el Agent explore profundamente todo el proyecto con un solo comando.
> - Cómo hacer que el Agent recuerde la arquitectura, el stack tecnológico y las reglas implícitas del proyecto.
> - Cómo ver exactamente qué recuerda el Agent.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Lógica del script de instalación | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L327-L410) | 327-410 |
| Lógica de registro del plugin | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L195-L248) | 195-248 |
| Lógica de detección de conflictos | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L273-L320) | 273-320 |
| Carga del archivo de configuración | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts) | - |

</details>
