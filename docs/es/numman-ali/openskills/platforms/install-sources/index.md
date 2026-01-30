---
title: "Fuentes de Instalación: Múltiples Formas de Instalar Skills | openskills"
sidebarTitle: "Tres Fuentes Disponibles"
subtitle: "Guía Detallada de Fuentes de Instalación"
description: "Aprende tres formas de instalar skills en OpenSkills. Domina los métodos de instalación desde repositorios de GitHub, rutas locales y repositorios Git privados, incluyendo autenticación SSH/HTTPS y configuración de subrutas."
tags:
  - "Integración de Plataformas"
  - "Gestión de Skills"
  - "Configuración de Instalación"
prerequisite:
  - "start-first-skill"
order: 2
---

# Guía Detallada de Fuentes de Instalación

## Lo Que Aprenderás en Esta Lección

- Usar tres métodos para instalar skills: repositorios de GitHub, rutas locales y repositorios Git privados
- Elegir la fuente de instalación más apropiada según el escenario
- Comprender las ventajas y desventajas de cada fuente y sus consideraciones
- Dominar la sintaxis de GitHub shorthand, rutas relativas y URLs de repositorios privados

::: info Conocimientos Previos

Este tutorial asume que ya has completado [Instalar Tu Primer Skill](../../start/first-skill/) y conoces el flujo de instalación básico.

:::

---

## Tu Situación Actual

Quizás ya has aprendido a instalar skills desde el repositorio oficial, pero:

- **¿Solo se puede usar GitHub?**: Quieres usar el repositorio interno de GitLab de tu empresa, pero no sabes cómo configurarlo
- **¿Cómo instalo skills en desarrollo local?**: Estás desarrollando tu propio skill y quieres probarlo primero en tu máquina
- **Quiero especificar un skill directamente**: El repositorio tiene muchos skills y no quiero seleccionar a través de la interfaz interactiva cada vez
- **¿Cómo accedo a repositorios privados?**: El repositorio de skills de la empresa es privado y no sé cómo autenticarme

En realidad, OpenSkills admite múltiples fuentes de instalación. Veamos una por una.

---

## Cuándo Usar Este Método

**Escenarios de aplicación para diferentes fuentes de instalación**:

| Fuente de Instalación | Escenario Aplicable | Ejemplo |
| --- | --- | --- |
| **Repositorio de GitHub** | Usar skills de la comunidad open source | `openskills install anthropics/skills` |
| **Ruta Local** | Desarrollar y probar tus propios skills | `openskills install ./my-skill` |
| **Repositorio Git Privado** | Usar skills internos de la empresa | `openskills install git@github.com:my-org/private-skills.git` |

::: tip Mejores Prácticas Recomendadas

- **Skills Open Source**: Prioriza la instalación desde repositorios de GitHub para facilitar actualizaciones
- **Fase de Desarrollo**: Instala desde rutas locales para probar modificaciones en tiempo real
- **Colaboración en Equipo**: Usa repositorios Git privados para gestionar skills internos de manera unificada

:::

---

## Idea Central: Tres Fuentes, Un Mismo Mecanismo

Aunque las fuentes de instalación son diferentes, el mecanismo subyacente de OpenSkills es el mismo:

```
[Identificar Tipo de Fuente] → [Obtener Archivos del Skill] → [Copiar a .claude/skills/]
```

**Lógica de Identificación de Fuente** (código fuente `install.ts:25-45`):

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**Prioridad de Evaluación**:
1. Primero verifica si es una ruta local (`isLocalPath`)
2. Luego verifica si es una URL de Git (`isGitUrl`)
3. Finalmente, lo trata como GitHub shorthand (`owner/repo`)

---

## Sígueme Paso a Paso

### Método 1: Instalar desde Repositorio de GitHub

**Escenario de Aplicación**: Instalar skills de la comunidad open source, como el repositorio oficial de Anthropic o paquetes de skills de terceros.

#### Uso Básico: Instalar Todo el Repositorio

```bash
npx openskills install owner/repo
```

**Ejemplo**: Instalar skills desde el repositorio oficial de Anthropic

```bash
npx openskills install anthropics/skills
```

**Deberías ver**:

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### Uso Avanzado: Especificar Subruta (Instalar un Skill Directamente)

Si el repositorio contiene muchos skills, puedes especificar directamente la subruta del skill que deseas instalar, omitiendo la selección interactiva:

```bash
npx openskills install owner/repo/skill-name
```

**Ejemplo**: Instalar directamente el skill de procesamiento de PDF

```bash
npx openskills install anthropics/skills/pdf
```

**Deberías ver**:

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
   Location: /path/to/project/.claude/skills/pdf
```

::: tip Mejor Práctica Recomendada

Cuando solo necesitas un skill del repositorio, usa el formato de subruta para omitir la selección interactiva, es más rápido.

:::

#### Reglas de GitHub Shorthand (código fuente `install.ts:131-143`)

| Formato | Ejemplo | Resultado de Conversión |
| --- | --- | --- |
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |

---

### Método 2: Instalar desde Ruta Local

**Escenario de Aplicación**: Estás desarrollando tu propio skill y quieres probarlo en tu máquina local antes de publicarlo en GitHub.

#### Usar Ruta Absoluta

```bash
npx openskills install /ruta/absoluta/al/skill
```

**Ejemplo**: Instalar desde el directorio de skills en el directorio home

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### Usar Ruta Relativa

```bash
npx openskills install ./skills-locales/my-skill
```

**Ejemplo**: Instalar desde el subdirectorio `local-skills/` en el directorio del proyecto

```bash
npx openskills install ./local-skills/web-scraper
```

**Deberías ver**:

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
   Location: /path/to/project/.claude/skills/web-scraper
```

::: warning Nota Importante

La instalación desde rutas locales copia los archivos del skill a `.claude/skills/`, las modificaciones posteriores al archivo fuente no se sincronizarán automáticamente. Para actualizar, debes reinstalar.

:::

#### Instalar Directorio Local que Contiene Múltiples Skills

Si la estructura de tu directorio local es así:

```
skills-locales/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

Puedes instalar todo el directorio directamente:

```bash
npx openskills install ./skills-locales
```

Esto iniciará la interfaz de selección interactiva para que elijas qué skills instalar.

#### Formatos de Ruta Local Soportados (código fuente `install.ts:25-32`)

| Formato | Descripción | Ejemplo |
| --- | --- | --- |
| `/ruta/absoluta` | Ruta absoluta | `/home/user/skills/my-skill` |
| `./ruta/relativa` | Ruta relativa al directorio actual | `./skills-locales/my-skill` |
| `../ruta/relativa` | Ruta relativa al directorio padre | `../skills-compartidos/common` |
| `~/ruta` | Ruta relativa al directorio home | `~/dev/my-skills` |

::: tip Consejo de Desarrollo

Usar el atajo `~` permite referenciar rápidamente skills bajo el directorio home, ideal para entornos de desarrollo personal.

:::

---

### Método 3: Instalar desde Repositorio Git Privado

**Escenario de Aplicación**: Usar repositorios GitLab/Bitbucket internos de la empresa, o repositorios privados de GitHub.

#### Método SSH (Recomendado)

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**Ejemplo**: Instalar desde un repositorio privado de GitHub

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**Deberías ver**:

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip Configuración de Autenticación

El método SSH requiere que ya tengas configuradas las claves SSH. Si la clonación falla, verifica:

```bash
# Probar conexión SSH
ssh -T git@github.com

# Si muestra "Hi username! You've successfully authenticated...", la configuración es correcta
```

:::

#### Método HTTPS (Requiere Credenciales)

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning Autenticación HTTPS

Al clonar repositorios privados mediante HTTPS, Git solicitará nombre de usuario y contraseña (o Personal Access Token). Si usas autenticación de dos factores, necesitarás usar un Personal Access Token en lugar de la contraseña de la cuenta.

:::

#### Otras Plataformas de Alojamiento Git

**GitLab (SSH)**:

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab (HTTPS)**:

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket (SSH)**:

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket (HTTPS)**:

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip Mejor Práctica Recomendada

Para skills internos del equipo, se recomienda usar repositorios Git privados porque:
- Todos los miembros pueden instalar desde la misma fuente
- Al actualizar skills, solo necesitas ejecutar `openskills update`
- Facilita la gestión de versiones y control de permisos

:::

#### Reglas de Reconocimiento de URL Git (código fuente `install.ts:37-45`)

| Prefijo/Sufijo | Descripción | Ejemplo |
| --- | --- | --- |
| `git@` | Protocolo SSH | `git@github.com:owner/repo.git` |
| `git://` | Protocolo Git | `git://github.com/owner/repo.git` |
| `http://` | Protocolo HTTP | `http://github.com/owner/repo.git` |
| `https://` | Protocolo HTTPS | `https://github.com/owner/repo.git` |
| sufijo `.git` | Repositorio Git (cualquier protocolo) | `owner/repo.git` |

---

## Punto de Verificación ✅

Después de completar esta lección, verifica que:

- [ ] Sabes cómo instalar skills desde repositorios de GitHub (formato `owner/repo`)
- [ ] Sabes cómo instalar directamente un skill específico del repositorio (formato `owner/repo/skill-name`)
- [ ] Sabes cómo instalar skills usando rutas locales (`./`, `~/`, etc.)
- [ ] Sabes cómo instalar skills desde repositorios Git privados (SSH/HTTPS)
- [ ] Comprendes los escenarios de aplicación para diferentes fuentes de instalación

---

## Advertencias de Problemas Comunes

### Problema 1: La Ruta Local No Existe

**Síntoma**:

```
Error: Path does not exist: ./local-skills/my-skill
```

**Causa**:
- Error de escritura en la ruta
- Cálculo incorrecto de la ruta relativa

**Solución**:
1. Verifica que la ruta existe: `ls ./local-skills/my-skill`
2. Usa rutas absolutas para evitar confusiones con rutas relativas

---

### Problema 2: Fallo al Clonar Repositorio Privado

**Síntoma**:

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**Causa**:
- Claves SSH no configuradas
- Sin permisos de acceso al repositorio
- Dirección del repositorio incorrecta

**Solución**:
1. Prueba la conexión SSH: `ssh -T git@github.com`
2. Confirma que tienes permisos de acceso al repositorio
3. Verifica que la dirección del repositorio es correcta

::: tip Nota

Para repositorios privados, la herramienta mostrará el siguiente mensaje (código fuente `install.ts:167`):

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### Problema 3: No Se Encuentra SKILL.md en la Subruta

**Síntoma**:

```
Error: SKILL.md not found at skills/my-skill
```

**Causa**:
- Subruta incorrecta
- La estructura de directorios en el repositorio es diferente de lo esperado

**Solución**:
1. Primero instala todo el repositorio sin subruta: `npx openskills install owner/repo`
2. A través de la interfaz interactiva, verifica los skills disponibles
3. Reinstala usando la subruta correcta

---

### Problema 4: Error de Reconocimiento de GitHub Shorthand

**Síntoma**:

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**Causa**:
- El formato no coincide con ninguna regla
- Error de escritura (ej. `owner / repo` con espacios)

**Solución**:
- Verifica que el formato sea correcto (sin espacios, cantidad correcta de barras)
- Usa la URL completa de Git en lugar del shorthand

---

## Resumen de Esta Lección

A través de esta lección, has aprendido:

- **Tres fuentes de instalación**: Repositorios de GitHub, rutas locales y repositorios Git privados
- **GitHub shorthand**: Dos formatos `owner/repo` y `owner/repo/skill-name`
- **Formatos de ruta local**: Rutas absolutas, rutas relativas y atajos de directorio home
- **Instalación de repositorios privados**: Dos métodos SSH y HTTPS, sintaxis para diferentes plataformas
- **Lógica de identificación de fuentes**: Cómo la herramienta determina el tipo de fuente de instalación proporcionada

**Referencia Rápida de Comandos Clave**:

| Comando | Función |
| --- | --- |
| `npx openskills install owner/repo` | Instalar desde repositorio de GitHub (selección interactiva) |
| `npx openskills install owner/repo/skill-name` | Instalar directamente un skill específico del repositorio |
| `npx openskills install ./local-skills/skill` | Instalar desde ruta local |
| `npx openskills install ~/dev/my-skills` | Instalar desde directorio home |
| `npx openskills install git@github.com:owner/private-skills.git` | Instalar desde repositorio Git privado |

---

## Avance del Próximo Tema

> En la próxima lección aprenderemos **[Instalación Global vs Local del Proyecto](../global-vs-project/)**.
>
> Aprenderás:
> - El efecto del flag `--global` y la ubicación de instalación
> - La diferencia entre instalación global y local del proyecto
> - Cómo elegir la ubicación de instalación apropiada según el escenario
> - Mejores prácticas para compartir skills entre múltiples proyectos

Las fuentes de instalación son solo parte de la gestión de skills, a continuación necesitas comprender cómo la ubicación de instalación afecta al proyecto.

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Entrada del comando de instalación | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| Determinación de ruta local | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Determinación de URL de Git | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| Análisis de GitHub shorthand | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Instalación desde ruta local | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Clonación de repositorio Git | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Mensaje de error para repositorios privados | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**Funciones Clave**:
- `isLocalPath(source)` - Determina si es una ruta local (líneas 25-32)
- `isGitUrl(source)` - Determina si es una URL de Git (líneas 37-45)
- `installFromLocal()` - Instala skill desde ruta local (líneas 199-226)
- `installSpecificSkill()` - Instala skill de subruta especificada (líneas 272-316)
- `getRepoName()` - Extrae nombre del repositorio desde URL de Git (líneas 50-56)

**Lógica Clave**:
1. Prioridad de determinación de tipo de fuente: Ruta local → URL de Git → GitHub shorthand (líneas 111-143)
2. GitHub shorthand soporta dos formatos: `owner/repo` y `owner/repo/skill-name` (líneas 132-142)
3. Cuando falla la clonación de repositorio privado, sugiere configurar claves SSH o credenciales (línea 167)

</details>
