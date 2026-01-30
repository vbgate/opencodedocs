---
title: "Instalación: Despliegue Rápido | OpenSkills"
sidebarTitle: "Listo en 5 Minutos"
subtitle: "Instalación: Despliegue Rápido | OpenSkills"
description: "Aprende a instalar OpenSkills. Configura tu entorno en 5 minutos con soporte para npx y instalación global, incluyendo verificación y solución de problemas."
tags:
  - "Instalación"
  - "Configuración"
  - "Node.js"
  - "Git"
prerequisite:
  - "Conocimientos básicos de terminal"
duration: 3
order: 3
---

# Instalación de OpenSkills

## Qué Aprenderás

Al completar esta lección, podrás:

- Verificar y configurar los entornos de Node.js y Git
- Usar OpenSkills mediante `npx` o instalación global
- Verificar que OpenSkills está instalado y disponible correctamente
- Resolver problemas comunes de instalación (incompatibilidad de versiones, problemas de red, etc.)

## Tu Situación Actual

Es posible que te encuentres con estos problemas:

- **Requisitos del sistema inciertos**: No sabes qué versiones de Node.js y Git necesitas
- **No sabes cómo instalar**: OpenSkills es un paquete npm, pero no está claro si usar npx o instalación global
- **Error de instalación**: Encontraste incompatibilidad de versiones o problemas de red
- **Problemas de permisos**: Error EACCES durante la instalación global

Esta lección te ayudará a resolver estos problemas paso a paso.

## Cuándo Usar Este Enfoque

Cuando necesites:

- Usar OpenSkills por primera vez
- Actualizar a una nueva versión
- Configurar el entorno de desarrollo en una nueva máquina
- Solucionar problemas relacionados con la instalación

## 🎒 Preparativos Antes de Empezar

::: tip Requisitos del Sistema

OpenSkills tiene requisitos mínimos del sistema. No cumplir con estos requisitos provocará errores de instalación o comportamiento anormal.

:::

::: warning Verificación Previa

Antes de comenzar, confirma que has instalado los siguientes softwares:

1. **Node.js 20.6 o superior**
2. **Git** (para clonar habilidades desde repositorios)

:::

## Conceptos Fundamentales

OpenSkills es una herramienta CLI de Node.js con dos métodos de uso:

| Método | Comando | Ventajas | Desventajas | Casos de Uso |
|--- | --- | --- | --- | ---|
| **npx** | `npx openskills` | No requiere instalación, usa automáticamente la última versión | Descarga en cada ejecución (con caché) | Uso ocasional, probar nueva versión |
| **Instalación global** | `openskills` | Comando más corto, respuesta más rápida | Requiere actualización manual | Uso frecuente, versión fija |

**Se recomienda usar npx**, a menos que uses OpenSkills con mucha frecuencia.

---

## Sigue los Pasos

### Paso 1: Verificar la Versión de Node.js

Primero, verifica si Node.js está instalado en el sistema y si la versión cumple los requisitos:

```bash
node --version
```

**Por Qué**

OpenSkills requiere Node.js 20.6 o superior. Versiones inferiores provocarán errores de ejecución.

**Deberías Ver**:

```bash
v20.6.0
```

O una versión superior (como `v22.0.0`).

::: danger Versión Demasiado Baja

Si ves `v18.x.x` o una versión inferior (como `v16.x.x`), necesitas actualizar Node.js.

:::

**Si la versión es demasiado baja**:

Se recomienda usar [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) para instalar y gestionar Node.js:

::: code-group

```bash [macOS/Linux]
# Instalar nvm (si no está instalado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recargar la configuración del terminal
source ~/.bashrc  # o source ~/.zshrc

# Instalar Node.js 20 LTS
nvm install 20
nvm use 20

# Verificar versión
node --version
```

```powershell [Windows]
# Descargar e instalar nvm-windows
# Visita: https://github.com/coreybutler/nvm-windows/releases

# Después de instalar, ejecuta en PowerShell:
nvm install 20
nvm use 20

# Verificar versión
node --version
```

:::

**Deberías Ver** (después de actualizar):

```bash
v20.6.0
```

---

### Paso 2: Verificar la Instalación de Git

OpenSkills necesita usar Git para clonar repositorios de habilidades:

```bash
git --version
```

**Por Qué**

Al instalar habilidades desde GitHub, OpenSkills usará el comando `git clone` para descargar el repositorio.

**Deberías Ver**:

```bash
git version 2.40.0
```

(El número de versión puede variar, cualquier salida es aceptable)

::: danger Git No Instalado

Si ves `command not found: git` o un error similar, necesitas instalar Git.

:::

**Si Git no está instalado**:

::: code-group

```bash [macOS]
# macOS generalmente tiene Git preinstalado, si no, usa Homebrew:
brew install git
```

```powershell [Windows]
# Descargar e instalar Git for Windows
# Visita: https://git-scm.com/download/win
```

```bash [Linux (Ubuntu/Debian)]
sudo apt update
sudo apt install git
```

```bash [Linux (CentOS/RHEL)]
sudo yum install git
```

:::

Después de instalar, ejecuta `git --version` nuevamente para verificar.

---

### Paso 3: Verificar el Entorno

Ahora verifica que tanto Node.js como Git estén disponibles:

```bash
node --version && git --version
```

**Deberías Ver**:

```bash
v20.6.0
git version 2.40.0
```

Si ambos comandos se ejecutan con éxito, el entorno está configurado correctamente.

---

### Paso 4: Usar el Método npx (Recomendado)

OpenSkills recomienda usar `npx` para ejecutar directamente, sin instalación adicional:

```bash
npx openskills --version
```

**Por Qué**

`npx` descarga y ejecuta automáticamente la última versión de OpenSkills, sin necesidad de instalación o actualización manual. En la primera ejecución, descarga el paquete a la caché local, y ejecuciones posteriores usarán la caché, lo que es muy rápido.

**Deberías Ver**:

```bash
1.5.0
```

(El número de versión puede variar)

::: tip Cómo Funciona npx

`npx` (Node Package eXecute) es una herramienta incluida con npm 5.2.0+:
- Primera ejecución: descarga el paquete desde npm a un directorio temporal
- Ejecuciones posteriores: usa la caché (expira después de 24 horas por defecto)
- Actualización: después de que expire la caché, descarga automáticamente la última versión

:::

**Probar el Comando de Instalación**:

```bash
npx openskills list
```

**Deberías Ver**:

```bash
Installed Skills:

No skills installed. Run: npx openskills install <source>
```

O una lista de habilidades instaladas.

---

### Paso 5: (Opcional) Instalación Global

Si usas OpenSkills con frecuencia, puedes optar por instalarlo globalmente:

```bash
npm install -g openskills
```

**Por Qué**

Después de la instalación global, puedes usar directamente el comando `openskills` sin tener que escribir `npx` cada vez, lo que es más rápido.

**Deberías Ver**:

```bash
added 4 packages in 3s
```

(La salida puede variar)

::: warning Problemas de Permisos

Si encuentras un error `EACCES` durante la instalación global, significa que no tienes permiso para escribir en el directorio global.

**Solución**:

```bash
# Método 1: usar sudo (macOS/Linux)
sudo npm install -g openskills

# Método 2: corregir permisos de npm (recomendado)
# Ver directorio de instalación global
npm config get prefix

# Establecer permisos correctos (reemplaza /usr/local con la ruta real)
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin
```

:::

**Verificar la Instalación Global**:

```bash
openskills --version
```

**Deberías Ver**:

```bash
1.5.0
```

::: tip Actualizar la Instalación Global

Si deseas actualizar OpenSkills instalado globalmente:

```bash
npm update -g openskills
```

:::

---

## Punto de Control ✅

Después de completar los pasos anteriores, deberías confirmar:

- [ ] La versión de Node.js es 20.6 o superior (`node --version`)
- [ ] Git está instalado (`git --version`)
- [ ] `npx openskills --version` o `openskills --version` puede mostrar correctamente el número de versión
- [ ] `npx openskills list` o `openskills list` puede ejecutarse normalmente

Si todas las verificaciones pasan, ¡felicitaciones! OpenSkills se ha instalado correctamente.

---

## Problemas Comunes

### Problema 1: Versión de Node.js Demasiado Baja

**Mensaje de Error**:

```bash
Error: The module was compiled against a different Node.js version
```

**Causa**: La versión de Node.js es inferior a 20.6

**Solución**:

Usa nvm para instalar Node.js 20 o superior:

```bash
nvm install 20
nvm use 20
```

---

### Problema 2: Comando npx No Encontrado

**Mensaje de Error**:

```bash
command not found: npx
```

**Causa**: La versión de npm es demasiado baja (npx requiere npm 5.2.0+)

**Solución**:

```bash
# Actualizar npm
npm install -g npm@latest

# Verificar versión
npx --version
```

---

### Problema 3: Tiempo de Agotamiento de Red o Fallo de Descarga

**Mensaje de Error**:

```bash
Error: network timeout
```

**Causa**: Acceso limitado al repositorio npm

**Solución**:

```bash
# Usar un espejo npm (como el espejo de Taobao)
npm config set registry https://registry.npmmirror.com

# Reintentar
npx openskills --version
```

Para restaurar el origen por defecto:

```bash
npm config set registry https://registry.npmjs.org
```

---

### Problema 4: Error de Permisos en Instalación Global

**Mensaje de Error**:

```bash
Error: EACCES: permission denied
```

**Causa**: Sin permiso para escribir en el directorio de instalación global

**Solución**:

Consulta el método de corrección de permisos en el "Paso 5", o usa `sudo` (no recomendado).

---

### Problema 5: Fallo en Clonación de Git

**Mensaje de Error**:

```bash
Error: git clone failed
```

**Causa**: Claves SSH no configuradas o problemas de red

**Solución**:

```bash
# Probar conexión Git
git ls-remote https://github.com/numman-ali/openskills.git

# Si falla, verificar la red o configurar un proxy
git config --global http.proxy http://proxy.example.com:8080
```

---

## Resumen de la Lección

En esta lección aprendimos:

1. **Requisitos del entorno**: Node.js 20.6+ y Git
2. **Método recomendado**: `npx openskills` (sin instalación)
3. **Instalación global opcional**: `npm install -g openskills` (para uso frecuente)
4. **Verificación del entorno**: verificar números de versión y disponibilidad de comandos
5. **Problemas comunes**: incompatibilidad de versiones, problemas de permisos, problemas de red

Ahora has completado la instalación de OpenSkills. En la próxima lección, aprenderemos cómo instalar la primera habilidad.

---

## Próxima Lección

> En la próxima lección aprenderemos **[Instalar la Primera Habilidad](../first-skill/)**
>
> Aprenderás:
> - Cómo instalar habilidades desde el repositorio oficial de Anthropic
> - Técnicas para seleccionar habilidades de forma interactiva
> - La estructura de directorios de habilidades
> - Verificar que la habilidad está instalada correctamente

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Click para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

### Configuración Central

| Elemento de Configuración | Ruta del Archivo                                                                                       | Número de Línea      |
|--- | --- | ---|
| Requisito de versión de Node.js | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 45-47     |
| Información del paquete         | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 1-9       |
| Punto de entrada CLI       | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)             | 39-80     |

### Constantes Clave

- **Requisito de Node.js**: `>=20.6.0` (package.json:46)
- **Nombre del paquete**: `openskills` (package.json:2)
- **Versión**: `1.5.0` (package.json:3)
- **Comando CLI**: `openskills` (package.json:8)

### Descripción de Dependencias

**Dependencias de ejecución** (package.json:48-53):
- `@inquirer/prompts`: selección interactiva
- `chalk`: salida en color en terminal
- `commander`: análisis de parámetros CLI
- `ora`: animación de carga

**Dependencias de desarrollo** (package.json:54-59):
- `typescript`: compilación TypeScript
- `vitest`: pruebas unitarias
- `tsup`: herramienta de empaquetado

</details>
