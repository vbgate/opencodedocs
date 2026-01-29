---
title: "Instalar Agent Skills: Configurar Claude | Agent Skills"
subtitle: "Instalar Agent Skills: Configurar Claude"
sidebarTitle: "Instalar"
description: "Aprende a instalar Agent Skills en Claude Code y claude.ai. Instala con npx o manualmente, configura permisos de red y soluciona errores comunes en 5 minutos."
tags:
  - "Instalación"
  - "Claude Code"
  - "claude.ai"
  - "Permisos de red"
prerequisite:
  - "start-getting-started"
---

# Instalar Agent Skills

## Lo que podrás hacer al terminar

- Instalar Agent Skills rápidamente con un solo comando (recomendado)
- Copiar manualmente las habilidades al directorio local de Claude Code
- Habilitar habilidades en claude.ai y configurar permisos de red
- Diagnosticar errores comunes durante la instalación

## Tu situación actual

Quieres usar Agent Skills para que Claude te ayude a implementar proyectos y revisar código, pero no sabes cómo instalarlo en Claude Code o claude.ai. O intentaste instalarlo, pero las habilidades no se activaron y la implementación muestra "Error de egreso de red".

## Cuándo usar esta técnica

- ✓ Primera vez que usas Agent Skills
- ✓ Usas Claude Code (herramienta de línea de comandos de terminal)
- ✓ Usas claude.ai (versión web de Claude)
- ✓ Necesitas que las habilidades puedan acceder a la red (función de implementación)

## 🎒 Preparación antes de comenzar

Antes de comenzar, confirma que ya has:
- [ ] Instalado Node.js versión 20+
- [ ] Tienes una cuenta activa de Claude Code o claude.ai

::: tip Sugerencia
Si aún no entiendes qué es Agent Skills, se recomienda leer primero [Introducción a Agent Skills](../getting-started/).
:::

## Idea central

La instalación de Agent Skills tiene dos formas:

1. **Instalación con npx (recomendado)**: instalación con un clic en Claude Code, automatiza todos los pasos
2. **Instalación manual**: copia archivos al directorio especificado, adecuado para claude.ai o cuando necesitas una ubicación de instalación personalizada

Después de la instalación, las habilidades se activarán automáticamente en Claude: solo necesitas activar palabras clave (como "Implementar mi aplicación"), y Claude invocará automáticamente la habilidad correspondiente.

## Método 1: Instalación rápida con npx (recomendado)

Esta es la forma más sencilla de instalación, adecuada para usuarios de Claude Code.

### Paso 1: Ejecutar comando de instalación

En la terminal, ejecuta:

```bash
npx add-skill vercel-labs/agent-skills
```

**¿Por qué**
`add-skill` es un paquete npm que descargará automáticamente Agent Skills y lo instalará en el directorio correcto.

**Deberías ver**:
```
Skills successfully installed.
```

### Paso 2: Verificar instalación

En Claude Code, ingresa:

```
List available skills
```

**Deberías ver**:
Claude devuelve una lista de habilidades que incluye:
- `react-best-practices`
- `web-design-guidelines`
- `vercel-deploy`

**Punto de verificación ✅**: si ves estas 3 habilidades, la instalación fue exitosa.

## Método 2: Instalación manual en Claude Code

Si no quieres usar npx, o necesitas controlar la ubicación de instalación, puedes usar la instalación manual.

### Paso 1: Clonar o descargar el proyecto

```bash
git clone https://github.com/vercel-labs/agent-skills.git
cd agent-skills
```

**¿Por qué**
La instalación manual requiere primero obtener el código fuente del proyecto.

### Paso 2: Copiar habilidades al directorio de Claude Code

```bash
cp -r skills/react-best-practices ~/.claude/skills/
cp -r skills/web-design-guidelines ~/.claude/skills/
cp -r skills/claude.ai/vercel-deploy-claimable ~/.claude/skills/vercel-deploy
```

**¿Por qué**
Las habilidades de Claude Code se almacenan en el directorio `~/.claude/skills/`. Después de copiar, Claude podrá reconocer estas habilidades.

**Deberías ver**:
Después de ejecutar el comando, no hay salida de error.

**Punto de verificación ✅**:
Usa `ls ~/.claude/skills/` para ver, deberías poder ver 3 directorios de habilidades: `react-best-practices`, `web-design-guidelines`, `vercel-deploy`.

### Paso 3: Reiniciar Claude Code

Cierra forzosamente Claude Code, luego ábrelo nuevamente.

**¿Por qué**
Claude Code solo carga la lista de habilidades al inicio, necesita reiniciar para reconocer las habilidades recién instaladas.

## Método 3: Usar habilidades en claude.ai

Si usas claude.ai (versión web de Claude), el método de instalación es diferente.

### Método 3.1: Agregar a la base de conocimientos del proyecto

#### Paso 1: Seleccionar archivos de habilidades

Empaqueta todos los archivos de los tres directorios `skills/react-best-practices`, `skills/web-design-guidelines`, `skills/claude.ai/vercel-deploy-claimable`.

**¿Por qué**
claude.ai necesita agregar archivos de habilidades a la "base de conocimientos" del proyecto.

#### Paso 2: Subir al proyecto

En claude.ai:
1. Crea o abre un proyecto
2. Haz clic en "Conocimiento" → "Agregar archivos"
3. Sube los archivos de habilidades (o el directorio completo)

**Deberías ver**:
La base de conocimientos muestra la lista de archivos del proyecto.

### Método 3.2: Pegar contenido de SKILL.md

Si no quieres subir el directorio completo, puedes copiar directamente el contenido de `SKILL.md`.

#### Paso 1: Copiar definición de habilidad

Abre `skills/react-best-practices/SKILL.md` y copia todo el contenido.

**¿Por qué**
`SKILL.md` contiene la definición completa de la habilidad, Claude entenderá la función de la habilidad basándose en este archivo.

#### Paso 2: Pegar en el diálogo

Pega el contenido de `SKILL.md` en el diálogo de claude.ai, o agrégalo a las "Instrucciones" del proyecto.

**Deberías ver**:
Claude confirma que ha recibido la definición de la habilidad.

## Configurar permisos de red (importante)

Si usas la habilidad `vercel-deploy` para implementar proyectos, necesitas configurar permisos de red.

::: warning Importante
La habilidad `vercel-deploy` necesita acceder al dominio `*.vercel.com` para poder cargar implementaciones. ¡Saltar este paso provocará que la implementación falle!
:::

### Paso 1: Abrir configuración de capacidades de Claude

En el navegador, visita:
```
https://claude.ai/settings/capabilities
```

**¿Por qué**
Aquí se controla la lista de dominios a los que Claude puede acceder.

### Paso 2: Agregar dominio de Vercel

Haz clic en "Agregar dominio", ingresa:
```
*.vercel.com
```

Haz clic en "Guardar" para guardar.

**Deberías ver**:
El dominio `*.vercel.com` aparece en la lista de dominios.

**Punto de verificación ✅**: el dominio se ha agregado, ahora las habilidades pueden acceder a la red.

## Advertencias sobre problemas comunes

### Problema 1: La habilidad no se activa

**Síntoma**: ingresas "Implementar mi aplicación", pero Claude no sabe qué hacer.

**Posibles causas**:
- Claude Code no se reinició (instalación manual)
- La base de conocimientos del proyecto de claude.ai no cargó correctamente las habilidades

**Solución**:
- Claude Code: reinicia la aplicación
- claude.ai: confirma que los archivos de habilidades se han subido al Conocimiento del proyecto

### Problema 2: Falla la implementación (Error de egreso de red)

**Síntoma**:
```
Deployment failed due to network restrictions
```

**Solución**:
Verifica si se ha agregado `*.vercel.com` a los permisos de red:
```
Visita https://claude.ai/settings/capabilities
Verifica si contiene *.vercel.com
```

### Problema 3: No se encuentra el directorio `~/.claude/skills/`

**Síntoma**: durante la instalación manual se indica que el directorio no existe.

**Solución**:
```bash
mkdir -p ~/.claude/skills/
```

### Problema 4: Falla la instalación con npx

**Síntoma**:
```
npx: command not found
```

**Solución**:
```bash
# Confirma que Node.js y npm están instalados
node -v
npm -v

# Si no están instalados, instala la versión LTS desde https://nodejs.org/
```

## Resumen de esta lección

Esta lección presenta tres métodos de instalación de Agent Skills:
- **Instalación rápida con npx**: recomendado para Claude Code, se completa con un clic
- **Instalación manual**: copia archivos a `~/.claude/skills/`, adecuado cuando necesitas controlar la ubicación de instalación
- **Instalación en claude.ai**: subir archivos a la base de conocimientos del proyecto o pegar `SKILL.md`

Si usas la habilidad `vercel-deploy`, no olvides agregar el permiso de red `*.vercel.com` en `https://claude.ai/settings/capabilities`.

Después de completar la instalación, puedes hacer que Claude use automáticamente estas habilidades para revisión de código, verificación de accesibilidad e implementación de proyectos.

## Próxima lección

> En la próxima lección aprenderemos **[Mejores prácticas de rendimiento de React/Next.js](../../platforms/react-best-practices/)**.
>
> Aprenderás:
> - Cómo usar 57 reglas de optimización de rendimiento de React
> - Eliminar cascadas, optimizar el tamaño del paquete, reducir re-render
> - Dejar que la IA revise automáticamente el código y dé sugerencias de corrección

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-25

| Función          | Ruta de archivo                                                                                      | Número de línea    |
| ---------------- | ------------------------------------------------------------------------------------------------- | ----------------- |
| Método de instalación npx  | [`README.md:83-86`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L83-L86)  | 83-86   |
| Instalación manual en Claude Code | [`AGENTS.md:98-105`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L105) | 98-105  |
| Método de instalación en claude.ai | [`AGENTS.md:106-109`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L106-L109) | 106-109  |
| Configuración de permisos de red  | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md:104-112`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L104-L112) | 104-112  |

**Paquetes de habilidades clave**:
- `react-best-practices`: 57 reglas de optimización de rendimiento de React (número real de archivos de reglas)
- `web-design-guidelines`: 100+ reglas de guías de diseño web
- `vercel-deploy`: implementación con un clic en Vercel (soporte para 40+ marcos)

</details>
