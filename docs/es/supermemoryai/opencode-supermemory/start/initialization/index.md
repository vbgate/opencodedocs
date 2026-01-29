---
title: "Inicialización: Proyecto | opencode-supermemory"
sidebarTitle: "Inicialización"
subtitle: "Inicialización del Proyecto: Creando la Primera Impresión"
description: "Aprende a usar /supermemory-init para explorar el repositorio, extraer arquitectura y normas, almacenándolas en memoria persistente."
tags:
  - "inicialización"
  - "generación de memoria"
  - "flujo de trabajo"
prerequisite:
  - "start-getting-started"
order: 2
---

# Inicialización del Proyecto: Creando la Primera Impresión

## Lo que podrás hacer al terminar

- **Familiarizarse con el proyecto en un solo paso**: Haz que el Agent explore y comprenda todo el repositorio de código activamente, como un nuevo empleado que se une.
- **Establecer memoria a largo plazo**: Extrae automáticamente el stack tecnológico, patrones de arquitectura y normas de codificación del proyecto, y almacénalos en Supermemory.
- **Eliminar explicaciones repetidas**: Nunca más necesites repetir "usamos Bun" o "todos los componentes deben tener pruebas" al comienzo de cada sesión.

## Tu situación actual

¿Alguna vez te has encontrado con estas situaciones:

- **Trabajo repetitivo**: Cada vez que inicias una nueva sesión, gastas mucho tiempo explicando al Agent la situación básica del proyecto.
- **Olvido del contexto**: El Agent frecuentemente olvida la estructura de directorios específica del proyecto, creando archivos en la ubicación incorrecta.
- **Normas inconsistentes**: El estilo de código escrito por el Agent es errático, a veces usando `interface` y otras veces `type`.

## Cuándo usar este método

- **Después de instalar el plugin**: Este es el primer paso para usar opencode-supermemory.
- **Al hacerse cargo de un nuevo proyecto**: Establece rápidamente la biblioteca de memoria de ese proyecto.
- **Después de una refactorización mayor**: Cuando la arquitectura del proyecto cambia, necesitas actualizar el conocimiento del Agent.

## 🎒 Preparación previa

::: warning Verificación previa
Asegúrate de haber completado los pasos de instalación y configuración en [Inicio Rápido](./../getting-started/index.md) y que `SUPERMEMORY_API_KEY` esté correctamente configurado.
:::

## Idea Central

El comando `/supermemory-init` esencialmente no es un programa binario, sino un **Prompt cuidadosamente diseñado**.

Cuando ejecutas este comando, envía al Agent una "guía de incorporación" detallada, indicando al Agent:

1.  **Investigación profunda**: Leer activamente `README.md`, `package.json`, registros de commits de Git, etc.
2.  **Análisis estructurado**: Identificar el stack tecnológico, patrones de arquitectura y convenciones implícitas del proyecto.
3.  **Almacenamiento persistente**: Usar la herramienta `supermemory` para almacenar estas percepciones en la base de datos en la nube.

::: info Alcance de la memoria
El proceso de inicialización distinguirá entre dos tipos de memoria:
- **Project Scope**: Solo efectivo para el proyecto actual (ej: comando de compilación, estructura de directorios).
- **User Scope**: Efectivo para todos tus proyectos (ej: tu estilo de codificación preferido).
:::

## Sígueme

### Paso 1: Ejecutar el comando de inicialización

En el cuadro de entrada de OpenCode, escribe el siguiente comando y envíalo:

```bash
/supermemory-init
```

**Por qué**
Esto carga el Prompt predefinido, iniciando el modo de exploración del Agent.

**Deberías ver**
El Agent comienza a responder, indicando que entiende la tarea y comienza a planear los pasos de investigación. Podría decir: "I will start by exploring the codebase structure and configuration files..."

### Paso 2: Observar el proceso de exploración del Agent

El Agent ejecutará automáticamente una serie de operaciones, solo necesitas observar. Usualmente:

1.  **Leer archivos de configuración**: Lee `package.json`, `tsconfig.json`, etc. para entender el stack tecnológico.
2.  **Verificar historial de Git**: Ejecuta `git log` para entender las convenciones de commit y contribuidores activos.
3.  **Explorar estructura de directorios**: Usa `ls` o `list_files` para ver el diseño del proyecto.

**Ejemplo de salida**:
```
[Agent] Reading package.json to identify dependencies...
[Agent] Running git log to understand commit conventions...
```

::: tip Nota de consumo
Este proceso es una investigación profunda y puede consumir muchos Tokens (usualmente hará 50+ llamadas a herramientas). Por favor sé paciente hasta que el Agent reporte la finalización.
:::

### Paso 3: Verificar la memoria generada

Cuando el Agent indica que la inicialización está completa, puedes verificar qué recordó exactamente. Escribe:

```bash
/ask Listar memorias del proyecto actual
```

O llama directamente a la herramienta (si quieres ver los datos crudos):

```
supermemory(mode: "list", scope: "project")
```

**Deberías ver**
El Agent enumera una serie de memorias estructuradas, por ejemplo:

| Tipo | Ejemplo de contenido |
| :--- | :--- |
| `project-config` | "Uses Bun runtime. Build command: bun run build" |
| `architecture` | "API routes are located in src/routes/, using Hono framework" |
| `preference` | "Strict TypeScript usage: no 'any' type allowed" |

### Paso 4: Complementar lo que falta (opcional)

Si el Agent omitió cierta información clave (como alguna regla especial acordada solo verbalmente), puedes complementar manualmente:

```
Por favor recuerda: en este proyecto, todo el procesamiento de fechas debe usar la librería dayjs, está prohibido usar Date nativo.
```

**Deberías ver**
El Agent responde confirmando y llama `supermemory(mode: "add")` para guardar esta nueva regla.

## Punto de Control ✅

- [ ] Después de ejecutar `/supermemory-init`, ¿ejecutó el Agent automáticamente la tarea de exploración?
- [ ] ¿Puedes ver las memorias recién generadas usando el comando `list`?
- [ ] ¿El contenido de la memoria refleja con precisión la situación real del proyecto actual?

## Advertencias de errores comunes

::: warning No ejecutes frecuentemente
La inicialización es un proceso que consume tiempo y Tokens. Usualmente cada proyecto solo necesita ejecutarse una vez. Solo necesita volver a ejecutarse cuando el proyecto sufre cambios masivos.
:::

::: danger Nota de privacidad
Aunque el plugin desensibilizará automáticamente el contenido de las etiquetas `<private>`, durante el proceso de inicialización, el Agent leerá muchos archivos. Asegúrate de que no haya claves sensibles codificadas en tu repositorio de código (como AWS Secret Key), de lo contrario podrían almacenarse como "configuración del proyecto" en la memoria.
:::

## Resumen de esta lección

A través de `/supermemory-init`, completamos la transición de "desconocido" a "trabajador experto". Ahora, el Agent ya recuerda la arquitectura y normas principales del proyecto, y en las siguientes tareas de codificación, utilizará automáticamente este contexto para brindarte asistencia más precisa.

## Próxima lección

> En la siguiente lección aprenderemos **[Mecanismo de Inyección Automática de Contexto](./../../core/context-injection/index.md)**.
>
> Aprenderás:
> - Cómo el Agent "recuerda" estas memorias al inicio de la sesión.
> - Cómo activar el recuerdo de memorias específicas mediante palabras clave.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| :--- | :--- | :--- |
| Definición del Prompt de inicialización | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L13-L163) | 13-163 |
| Implementación de herramientas de memoria | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |

**Constantes clave**:
- `SUPERMEMORY_INIT_COMMAND`: Define el contenido específico del Prompt del comando `/supermemory-init`, guiando al Agent sobre cómo realizar la investigación y la memoria.

</details>
