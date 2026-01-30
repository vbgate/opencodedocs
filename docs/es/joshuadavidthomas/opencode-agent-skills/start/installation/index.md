---
title: "Instalación: Plugin Agent Skills | opencode-agent-skills"
sidebarTitle: "Instalar en 5 minutos"
subtitle: "Instalación: Plugin Agent Skills | opencode-agent-skills"
description: "Aprende las tres formas de instalar opencode-agent-skills. Incluye instalación básica, versión fija y desarrollo local, adecuadas para diferentes escenarios de uso."
tags:
  - "Instalación"
  - "Plugin"
  - "Inicio Rápido"
prerequisite: []
order: 2
---

# Instalación de OpenCode Agent Skills

## Qué podrás hacer después de completar este tutorial

- Instalar el plugin Agent Skills de tres formas diferentes
- Verificar que el plugin se ha instalado correctamente
- Entender la diferencia entre versiones fijas y la última versión

## Tu situación actual

Quieres que tu AI Agent aprenda a reutilizar habilidades, pero no sabes cómo habilitar esta función en OpenCode. El sistema de plugins de OpenCode parece un poco complejo y te preocupa cometer errores de configuración.

## Cuándo usar esta técnica

**Necesitas esta capacidad cuando tu AI Agent deba**:
- Reutilizar habilidades entre diferentes proyectos (como convenciones de código, plantillas de pruebas)
- Cargar la biblioteca de habilidades de Claude Code
- Hacer que la AI siga flujos de trabajo específicos

## 🎒 Preparativos antes de comenzar

::: warning Verificación previa

Antes de comenzar, confirma que:

- Tienes instalado [OpenCode](https://opencode.ai/) v1.0.110 o superior
- Puedes acceder al archivo de configuración `~/.config/opencode/opencode.json` (archivo de configuración de OpenCode)

:::

## Concepto central

OpenCode Agent Skills es un plugin publicado a través de npm. La instalación es muy sencilla: declara el nombre del plugin en el archivo de configuración y OpenCode lo descargará y cargará automáticamente al iniciar.

**Escenarios de aplicación de los tres métodos de instalación**:

| Método | Escenario de aplicación | Ventajas y desventajas |
|--- | --- | ---|
| **Instalación básica** | Usar siempre la última versión al iniciar | ✅ Actualizaciones automáticas convenientes<br>❌ Puede encontrar actualizaciones con cambios importantes |
| **Versión fija** | Entornos de producción que requieren estabilidad | ✅ Control de versión<br>❌ Requiere actualización manual |
| **Desarrollo local** | Plugins personalizados o contribución de código | ✅ Modificaciones flexibles<br>❌ Requiere gestión manual de dependencias |

---

## Paso a paso

### Método 1: Instalación básica (recomendado)

Esta es la forma más sencilla. Cada vez que OpenCode se inicia, verificará y descargará la última versión.

**Por qué**
Adecuado para la mayoría de usuarios, garantiza que siempre uses las últimas funciones y correcciones de errores.

**Pasos**

1. Abre el archivo de configuración de OpenCode

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json

# Windows (usa el Bloc de notas)
notepad %APPDATA%\opencode\opencode.json
```

2. Añade el nombre del plugin en el archivo de configuración

```json
{
  "plugin": ["opencode-agent-skills"]
}
```

Si el archivo ya tiene otros plugins, simplemente añádelo al array `plugin`:

```json
{
  "plugin": ["other-plugin", "opencode-agent-skills"]
}
```

3. Guarda el archivo y reinicia OpenCode

**Deberías ver**:
- OpenCode se reinicia y muestra en el log de inicio que el plugin se ha cargado correctamente
- Puedes usar herramientas como `get_available_skills` en la conversación con la AI

### Método 2: Instalación de versión fija (adecuada para entornos de producción)

Si deseas bloquear la versión del plugin y evitar actualizaciones automáticas inesperadas, usa este método.

**Por qué**
Los entornos de producción normalmente requieren control de versiones. Las versiones fijas garantizan que el equipo use la misma versión del plugin.

**Pasos**

1. Abre el archivo de configuración de OpenCode

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json
```

2. Añade el nombre del plugin con el número de versión en el archivo de configuración

```json
{
  "plugin": ["opencode-agent-skills@0.6.4"]
}
```

3. Guarda el archivo y reinicia OpenCode

**Deberías ver**:
- OpenCode se inicia usando la versión fija v0.6.4
- El plugin se guarda en caché local, no requiere descargar cada vez

::: tip Gestión de versiones

Los plugins de versión fija se almacenan en caché local de OpenCode. Cuando actualizas la versión, debes modificar manualmente el número de versión en el archivo de configuración y reiniciar. Consulta la [última versión](https://www.npmjs.com/package/opencode-agent-skills) para actualizar.

:::

### Método 3: Instalación de desarrollo local (para contribuidores)

Si deseas personalizar el plugin o participar en el desarrollo, usa este método.

**Por qué**
Durante el desarrollo, puedes ver inmediatamente los efectos de las modificaciones de código sin esperar a que se publique en npm.

**Pasos**

1. Clona el repositorio al directorio de configuración de OpenCode

```bash
git clone https://github.com/joshuadavidthomas/opencode-agent-skills ~/.config/opencode/opencode-agent-skills
```

2. Entra al directorio del proyecto e instala las dependencias

```bash
cd ~/.config/opencode/opencode-agent-skills
bun install
```

::: info Por qué usar Bun

El proyecto usa Bun como runtime y gestor de paquetes. Según el campo `engines` de package.json, requiere Bun >= 1.0.0.

:::

3. Crea el enlace simbólico del plugin

```bash
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/opencode-agent-skills/src/plugin.ts ~/.config/opencode/plugin/skills.ts
```

**Deberías ver**:
- `~/.config/opencode/plugin/skills.ts` apunta a tu código de plugin local
- Después de modificar el código, reinicia OpenCode para que surta efecto

---

## Punto de verificación ✅

Después de completar la instalación, verifica con los siguientes métodos:

**Método 1: Ver lista de herramientas**

Pregunta a la AI en OpenCode:

```
Por favor, enumera todas las herramientas disponibles y dime si hay herramientas relacionadas con habilidades.
```

Deberías ver que incluye las siguientes herramientas:
- `use_skill` - Cargar habilidad
- `read_skill_file` - Leer archivo de habilidad
- `run_skill_script` - Ejecutar script de habilidad
- `get_available_skills` - Obtener lista de habilidades disponibles

**Método 2: Invocar herramienta**

```
Por favor, invoca get_available_skills para ver qué habilidades están disponibles actualmente.
```

Deberías ver la lista de habilidades (puede estar vacía, pero la invocación fue exitosa).

**Método 3: Ver log de inicio**

Verifica el log de inicio de OpenCode, debería haber algo similar a:

```
[plugin] Loaded plugin: opencode-agent-skills
```

---

## Avisos de problemas comunes

### Problema 1: Las herramientas no aparecen después de iniciar OpenCode

**Posibles causas**:
- Error de formato JSON en el archivo de configuración (falta coma, comillas, etc.)
- Versión de OpenCode demasiado baja (requiere >= v1.0.110)
- Error de ortografía en el nombre del plugin

**Soluciones**:
1. Usa una herramienta de validación JSON para verificar la sintaxis del archivo de configuración
2. Ejecuta `opencode --version` para confirmar la versión
3. Asegúrate de que el nombre del plugin sea `opencode-agent-skills` (atención a los guiones)

### Problema 2: La actualización de versión fija no surte efecto

**Causa**: Los plugins de versión fija se guardan en caché local; después de actualizar el número de versión, es necesario borrar el caché.

**Soluciones**:
1. Modifica el número de versión en el archivo de configuración
2. Reinicia OpenCode
3. Si aún no surte efecto, borra el caché de plugins de OpenCode (la ubicación depende de tu sistema)

### Problema 3: Las modificaciones en la instalación de desarrollo local no surten efecto

**Causa**: Error en el enlace simbólico o dependencias de Bun no instaladas.

**Soluciones**:
1. Verifica que el enlace simbólico sea correcto:
   ```bash
   ls -la ~/.config/opencode/plugin/skills.ts
   ```
   Debería apuntar a `~/.config/opencode/opencode-agent-skills/src/plugin.ts`

2. Confirma que las dependencias estén instaladas:
   ```bash
   cd ~/.config/opencode/opencode-agent-skills
   bun install
   ```

---

## Resumen de esta lección

En esta lección aprendimos tres métodos de instalación:

- **Instalación básica**: Añadir `opencode-agent-skills` en el archivo de configuración, adecuado para la mayoría de usuarios
- **Instalación de versión fija**: Añadir `opencode-agent-skills@versión`, adecuado para entornos de producción
- **Instalación de desarrollo local**: Clonar el repositorio y crear enlace simbólico, adecuado para desarrolladores

Después de la instalación, puedes verificar mediante la lista de herramientas, invocación de herramientas o log de inicio.

---

## Avance de la próxima lección

> En la próxima lección aprenderemos **[Crear tu primera habilidad](../creating-your-first-skill/)**.
>
> Aprenderás:
> - Estructura del directorio de habilidades
> - Formato YAML frontmatter de SKILL.md
> - Cómo escribir contenido de habilidades

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Definición de entrada del plugin | [`package.json:18`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L18) | 18 |
| Archivo principal del plugin | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts) | Archivo completo |
| Configuración de dependencias | [`package.json:27-32`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L27-L32) | 27-32 |
| Requisitos de versión | [`package.json:39-41`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L39-L41) | 39-41 |

**Configuraciones clave**:
- `main: "src/plugin.ts"`: Archivo de entrada del plugin
- `engines.bun: ">=1.0.0"`: Requisito de versión del runtime

**Dependencias clave**:
- `@opencode-ai/plugin ^1.0.115`: SDK de plugins de OpenCode
- `@huggingface/transformers ^3.8.1`: Modelo de coincidencia semántica
- `zod ^4.1.13`: Validación de Schema
- `yaml ^2.8.2`: Análisis YAML

</details>
