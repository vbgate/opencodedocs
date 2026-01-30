---
title: "CI/CD: Integración no interactiva | OpenSkills"
sidebarTitle: "Configurar CI/CD de un solo paso"
subtitle: "CI/CD: Integración no interactiva | OpenSkills"
description: "Aprende la integración CI/CD de OpenSkills, domina el flag -y para lograr una instalación y sincronización no interactiva. Incluye ejemplos prácticos de GitHub Actions y Docker, automatización de la gestión de habilidades."
tags:
  - "Avanzado"
  - "CI/CD"
  - "Automatización"
  - "Despliegue"
prerequisite:
  - "start-first-skill"
  - "start-sync-to-agents"
  - "platforms-cli-commands"
order: 6
---

# Integración CI/CD

## Qué podrás hacer después de este tutorial

- Entender por qué el entorno CI/CD necesita el modo no interactiva
- Dominar el uso del flag `--yes/-y` en los comandos `install` y `sync`
- Aprender a integrar OpenSkills en plataformas CI como GitHub Actions y GitLab CI
- Conocer el flujo de instalación automatizada de habilidades en contenedores Docker
- Dominar estrategias de actualización y sincronización de habilidades en entornos CI/CD
- Evitar fallos causados por indicaciones interactivas en el flujo CI/CD

::: info Conocimientos previos

Este tutorial asume que ya conoces [Instalar la primera habilidad](../../start/first-skill/) y [Sincronizar habilidades a AGENTS.md](../../start/sync-to-agents/), así como el [Detalle de comandos](../../platforms/cli-commands/) básico.

:::

---

## Tu dilema actual

Es posible que ya seas competente usando OpenSkills en tu entorno local, pero hayas encontrado problemas en el entorno CI/CD:

- **Las indicaciones interactivas causan fallos**: El flujo CI muestra una interfaz de selección y no puede continuar la ejecución
- **Es necesario instalar habilidades durante el despliegue automatizado**: Cada construcción necesita reinstalar habilidades, pero no se puede confirmar automáticamente
- **Las configuraciones de múltiples entornos no se sincronizan**: Las configuraciones de habilidades de los entornos de desarrollo, prueba y producción son inconsistentes
- **La generación de AGENTS.md no está automatizada**: Después de cada despliegue es necesario ejecutar manualmente el comando sync
- **Faltan habilidades al construir la imagen Docker**: Es necesario instalar habilidades manualmente después de iniciar el contenedor

En realidad, OpenSkills proporciona el flag `--yes/-y`, diseñado específicamente para entornos no interactivos, permitiéndote completar automáticamente todas las operaciones en el flujo CI/CD.

---

## Cuándo usar esta técnica

**Escenarios aplicables para la integración CI/CD**:

| Escenario | ¿Necesita el modo no interactiva? | Ejemplo |
|--- | --- | ---|
| **GitHub Actions** | ✅ Sí | Instalar automáticamente habilidades en cada PR o push |
| **GitLab CI** | ✅ Sí | Sincronizar automáticamente AGENTS.md al fusionar solicitudes de fusión |
| **Construcción Docker** | ✅ Sí | Instalar automáticamente habilidades en el contenedor al construir la imagen |
| **Pipeline Jenkins** | ✅ Sí | Actualizar automáticamente habilidades durante la integración continua |
| **Script de inicialización del entorno de desarrollo** | ✅ Sí | Configurar el entorno de un solo paso para nuevos desarrolladores después de clonar el código |
| **Despliegue en entorno de producción** | ✅ Sí | Sincronizar automáticamente las últimas habilidades al desplegar |

::: tip Práctica recomendada

- **Usar interactivo para desarrollo local**: Al operar manualmente, puedes seleccionar cuidadosamente las habilidades a instalar
- **Usar no interactiva para CI/CD**: En flujos automatizados se debe usar el flag `-y` para omitir todas las indicaciones
- **Estrategia de distinción de entornos**: Usar diferentes fuentes de habilidades para diferentes entornos (como repositorios privados)

:::

---

## Idea central: Modo no interactiva

Los comandos `install` y `sync` de OpenSkills admiten el flag `--yes/-y`, utilizado para omitir todas las indicaciones interactivas:

**Comportamiento no interactiva del comando install** (código fuente `install.ts:424-427`):

```typescript
// Selección interactiva (a menos que se use el flag -y o haya una sola habilidad)
let skillsToInstall = skillInfos;

if (!options.yes && skillInfos.length > 1) {
  // Entrar en el flujo de selección interactiva
  // ...
}
```

**Características del modo no interactiva**:

1. **Omitir selección de habilidades**: Instalar todas las habilidades encontradas
2. **Sobrescritura automática**: Cuando se encuentra una habilidad existente, sobrescribirla directamente (mostrar `Overwriting: <skill-name>`)
3. **Omitir confirmación de conflictos**: No preguntar si se debe sobrescribir, ejecutar directamente
4. **Compatible con entornos headless**: Funciona normalmente en entornos CI sin TTY

**Comportamiento de la función warnIfConflict** (código fuente `install.ts:524-527`):

```typescript
if (skipPrompt) {
  // Sobrescritura automática en modo no interactiva
  console.log(chalk.dim(`Overwriting: ${skillName}`));
  return true;
}
```

::: important Concepto importante

**Modo no interactiva**: Usa el flag `--yes/-y` para omitir todas las indicaciones interactivas, permitiendo que el comando se ejecute automáticamente en CI/CD, scripts y entornos sin TTY, sin depender de la entrada del usuario.

:::

---

## Sígueme paso a paso

### Paso 1: Experimentar la instalación no interactiva

**Por qué**
Primero experimenta el comportamiento del modo no interactiva en tu entorno local para entender las diferencias con el modo interactivo.

Abre la terminal y ejecuta:

```bash
# Instalación no interactiva (instala todas las habilidades encontradas)
npx openskills install anthropics/skills --yes

# O usa la forma abreviada
npx openskills install anthropics/skills -y
```

**Deberías ver**:

```
Cloning into '/tmp/openskills-temp-...'...
...
Found 3 skill(s)

Overwriting: codebase-reviewer
Overwriting: file-writer
Overwriting: git-helper

✅ Installed 3 skill(s)

Next: Run 'openskills sync' to generate AGENTS.md
```

**Explicación**:
- Después de usar el flag `-y`, se omite la interfaz de selección de habilidades
- Todas las habilidades encontradas se instalan automáticamente
- Si la habilidad ya existe, muestra `Overwriting: <skill-name>` y la sobrescribe directamente
- No aparece ningún cuadro de diálogo de confirmación

---

### Paso 2: Comparar interactiva y no interactiva

**Por qué**
A través de la comparación, entenderás más claramente las diferencias entre los dos modos y sus escenarios aplicables.

Ejecuta los siguientes comandos para comparar ambos modos:

```bash
# Limpiar habilidades existentes (para pruebas)
rm -rf .claude/skills

# Instalación interactiva (muestra la interfaz de selección)
echo "=== Instalación interactiva ==="
npx openskills install anthropics/skills

# Limpiar habilidades existentes
rm -rf .claude/skills

# Instalación no interactiva (instala automáticamente todas las habilidades)
echo "=== Instalación no interactiva ==="
npx openskills install anthropics/skills -y
```

**Deberías ver**:

**Modo interactiva**:
- Muestra la lista de habilidades, permitiéndote seleccionar con espacio
- Necesita presionar Enter para confirmar
- Puedes instalar selectivamente solo algunas habilidades

**Modo no interactiva**:
- Muestra directamente el proceso de instalación
- Instala automáticamente todas las habilidades
- No requiere ninguna entrada del usuario

**Tabla comparativa**:

| Característica | Modo interactiva (predeterminado) | Modo no interactiva (-y) |
|--- | --- | ---|
| **Selección de habilidades** | Muestra la interfaz de selección, marcado manual | Instala automáticamente todas las habilidades encontradas |
| **Confirmación de sobrescritura** | Pregunta si se debe sobrescribir habilidades existentes | Sobrescribe automáticamente, muestra información de advertencia |
| **Requisito TTY** | Requiere terminal interactiva | No se necesita, puede ejecutarse en entornos CI |
| **Escenarios aplicables** | Desarrollo local, operación manual | CI/CD, scripts, flujos automatizados |
| **Requisito de entrada** | Requiere entrada del usuario | Cero entrada, ejecución automática |

---

### Paso 3: Sincronización no interactiva de AGENTS.md

**Por qué**
Aprende a generar AGENTS.md en flujos automatizados, para que los agentes de IA siempre usen la lista de habilidades más reciente.

Ejecuta:

```bash
# Sincronización no interactiva (sincroniza todas las habilidades a AGENTS.md)
npx openskills sync -y

# Ver el AGENTS.md generado
cat AGENTS.md | head -20
```

**Deberías ver**:

```
✅ Synced 3 skill(s) to AGENTS.md
```

Contenido de AGENTS.md:

```xml
<skills_system>
This project uses the OpenSkills system for AI agent extensibility.

Usage:
- Ask the AI agent to load specific skills using: "Use the <skill-name> skill"
- The agent will read the skill definition from .claude/skills/<skill-name>/SKILL.md
- Skills provide specialized capabilities like code review, file writing, etc.
</skills_system>

<available_skills>
  <skill name="codebase-reviewer">
    <description>Review code changes for issues...</description>
  </skill>
  <skill name="file-writer">
    <description>Write files with format...</description>
  </skill>
  <skill name="git-helper">
    <description>Git operations and utilities...</description>
  </skill>
</available_skills>
```

**Explicación**:
- El flag `-y` omite la interfaz de selección de habilidades
- Todas las habilidades instaladas se sincronizan a AGENTS.md
- No aparece ningún cuadro de diálogo de confirmación

---

### Paso 4: Integración con GitHub Actions

**Por qué**
Integra OpenSkills en el flujo CI/CD real para lograr la gestión automatizada de habilidades.

Crea el archivo `.github/workflows/setup-skills.yml` en tu proyecto:

```yaml
name: Setup Skills

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills (non-interactive)
        run: openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: openskills sync -y

      - name: Verify AGENTS.md
        run: |
          echo "=== AGENTS.md generated ==="
          cat AGENTS.md

      - name: Upload AGENTS.md as artifact
        uses: actions/upload-artifact@v4
        with:
          name: agents-md
          path: AGENTS.md
```

Confirma y envía a GitHub:

```bash
git add .github/workflows/setup-skills.yml
git commit -m "Add GitHub Actions workflow for OpenSkills"
git push
```

**Deberías ver**: GitHub Actions se ejecuta automáticamente, instala las habilidades con éxito y genera AGENTS.md.

**Explicación**:
- Se activa automáticamente en cada push o PR
- Usa `openskills install anthropics/skills -y` para instalar habilidades de forma no interactiva
- Usa `openskills sync -y` para sincronizar AGENTS.md de forma no interactiva
- Guarda AGENTS.md como un artifact para facilitar la depuración

---

### Paso 5: Usar repositorios privados

**Por qué**
En entornos empresariales, las habilidades generalmente se alojan en repositorios privados y necesitan ser accedidas mediante SSH en CI/CD.

Configura SSH en GitHub Actions:

```yaml
name: Setup Skills from Private Repo

on:
  push:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH key
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills from private repo
        run: openskills install git@github.com:your-org/private-skills.git -y

      - name: Sync to AGENTS.md
        run: openskills sync -y
```

Agrega `SSH_PRIVATE_KEY` en **Settings → Secrets and variables → Actions** del repositorio de GitHub.

**Deberías ver**: GitHub Actions instala habilidades exitosamente desde el repositorio privado.

**Explicación**:
- Usa Secrets para almacenar la clave privada, evitando filtraciones
- Configura el acceso SSH al repositorio privado
- `openskills install git@github.com:your-org/private-skills.git -y` admite la instalación desde repositorios privados

---

### Paso 6: Integración en escenarios Docker

**Por qué**
Instalar habilidades automáticamente al construir la imagen Docker, asegurando que estén disponibles inmediatamente después de que el contenedor se inicie.

Crea `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar OpenSkills
RUN npm install -g openskills

# Instalar habilidades (no interactiva)
RUN openskills install anthropics/skills -y

# Sincronizar AGENTS.md
RUN openskills sync -y

# Copiar el código de la aplicación
COPY . .

# Otros pasos de construcción...
RUN npm install
RUN npm run build

# Comando de inicio
CMD ["node", "dist/index.js"]
```

Construir y ejecutar:

```bash
# Construir la imagen Docker
docker build -t myapp:latest .

# Ejecutar el contenedor
docker run -it --rm myapp:latest sh

# Verificar en el contenedor que las habilidades están instaladas
ls -la .claude/skills/
cat AGENTS.md
```

**Deberías ver**: El contenedor ya tiene las habilidades instaladas y AGENTS.md generado.

**Explicación**:
- Instalar habilidades durante la fase de construcción de la imagen Docker
- Usar `RUN openskills install ... -y` para la instalación no interactiva
- No es necesario instalar habilidades manualmente después de que el contenedor se inicie
- Adecuado para escenarios como microservicios, Serverless, etc.

---

### Paso 7: Configuración de variables de entorno

**Por qué**
Configurar de manera flexible las fuentes de habilidades a través de variables de entorno, usando diferentes repositorios de habilidades para diferentes entornos.

Crea el archivo `.env.ci`:

```bash
# Configuración del entorno CI/CD
SKILLS_SOURCE=anthropics/skills
SKILLS_INSTALL_FLAGS=-y
SYNC_FLAGS=-y
```

Usa en scripts CI/CD:

```bash
#!/bin/bash
# .github/scripts/setup-skills.sh

set -e

# Cargar variables de entorno
if [ -f .env.ci ]; then
  export $(cat .env.ci | grep -v '^#' | xargs)
fi

echo "Installing skills from: $SKILLS_SOURCE"
npx openskills install $SKILLS_SOURCE $SKILLS_INSTALL_FLAGS

echo "Syncing to AGENTS.md"
npx openskills sync $SYNC_FLAGS

echo "✅ Skills setup completed"
```

Llama desde GitHub Actions:

```yaml
- name: Setup skills
  run: .github/scripts/setup-skills.sh
```

**Deberías ver**: El script configura automáticamente la fuente y los flags de habilidades según las variables de entorno.

**Explicación**:
- Configurar de manera flexible la fuente de habilidades a través de variables de entorno
- Diferentes entornos (desarrollo, prueba, producción) pueden usar diferentes archivos `.env`
- Mantener la mantenibilidad de la configuración CI/CD

---

## Punto de control ✅

Completa las siguientes verificaciones para confirmar que has dominado el contenido de esta lección:

- [ ] Entiendes el propósito y las características del modo no interactiva
- [ ] Puedes usar el flag `-y` para realizar instalación no interactiva
- [ ] Puedes usar el flag `-y` para realizar sincronización no interactiva
- [ ] Entiendes las diferencias entre el modo interactiva y no interactiva
- [ ] Puedes integrar OpenSkills en GitHub Actions
- [ ] Puedes instalar habilidades al construir imágenes Docker
- [ ] Sabes cómo manejar repositorios privados en CI/CD
- [ ] Entiendes las mejores prácticas de configuración de variables de entorno

---

## Advertencias de errores comunes

### Error común 1: Olvidar agregar el flag -y

**Escenario del error**: Olvidar usar el flag `-y` en GitHub Actions

```yaml
# ❌ Error: olvidar el flag -y
- name: Install skills
  run: openskills install anthropics/skills
```

**Problema**:
- El entorno CI no tiene terminal interactiva (TTY)
- El comando esperará la entrada del usuario, causando que el workflow falle por tiempo de espera
- El mensaje de error puede no ser obvio

**Enfoque correcto**:

```yaml
# ✅ Correcto: usar el flag -y
- name: Install skills
  run: openskills install anthropics/skills -y
```

---

### Error común 2: La sobrescritura de habilidades causa pérdida de configuración

**Escenario del error**: CI/CD sobrescribe habilidades cada vez, causando que la configuración local se pierda

```bash
# CI/CD instala habilidades en el directorio global
openskills install anthropics/skills --global -y

# El usuario local instala en el directorio del proyecto, siendo sobrescrito por el global
```

**Problema**:
- La prioridad de las habilidades instaladas globalmente es menor que la del proyecto local
- CI/CD y la instalación local tienen ubicaciones inconsistentes, causando confusión
- Puede sobrescribir las habilidades cuidadosamente configuradas por el usuario local

**Enfoque correcto**:

```bash
# Opción 1: CI/CD y local usan instalación de proyecto
openskills install anthropics/skills -y

# Opción 2: Usar el modo Universal para evitar conflictos
openskills install anthropics/skills --universal -y

# Opción 3: CI/CD usa un directorio dedicado (a través de ruta de salida personalizada)
openskills install anthropics/skills -y
openskills sync -o .agents-md/AGENTS.md -y
```

---

### Error común 3: Permisos de acceso a Git insuficientes

**Escenario del error**: Al instalar habilidades desde un repositorio privado, no se configuró la clave SSH

```yaml
# ❌ Error: no se configuró la clave SSH
- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

**Problema**:
- El entorno CI no puede acceder al repositorio privado
- Mensaje de error: `Permission denied (publickey)`
- Clonación fallida, workflow fallido

**Enfoque correcto**:

```yaml
# ✅ Correcto: configurar la clave SSH
- name: Setup SSH key
  env:
    SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts

- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

---

### Error común 4: Imagen Docker demasiado grande

**Escenario del error**: Instalar habilidades en el Dockerfile causa que el tamaño de la imagen sea demasiado grande

```dockerfile
# ❌ Error: clonar e instalar cada vez
RUN openskills install anthropics/skills -y
```

**Problema**:
- Clona el repositorio desde GitHub cada vez que se construye
- Aumenta el tiempo de construcción y el tamaño de la imagen
- Los problemas de red pueden causar fallos

**Enfoque correcto**:

```dockerfile
# ✅ Correcto: usar construcción de múltiples etapas y caché
FROM node:20-alpine AS skills-builder

RUN npm install -g openskills
RUN openskills install anthropics/skills -y
RUN openskills sync -y

# Imagen principal
FROM node:20-alpine

WORKDIR /app

# Copiar las habilidades instaladas
COPY --from=skills-builder ~/.claude /root/.claude
COPY --from=skills-builder /app/AGENTS.md /app/

# Copiar el código de la aplicación
COPY . .

# Otros pasos de construcción...
```

---

### Error común 5: Olvidar actualizar habilidades

**Escenario del error**: CI/CD instala versiones antiguas de habilidades cada vez

```yaml
# ❌ Error: solo instala, no actualiza
- name: Install skills
  run: openskills install anthropics/skills -y
```

**Problema**:
- El repositorio de habilidades puede haberse actualizado
- La versión de habilidades instalada por CI/CD no es la más reciente
- Puede causar falta de funciones o bugs

**Enfoque correcto**:

```yaml
# ✅ Correcto: actualizar primero, luego sincronizar
- name: Update skills
  run: openskills update -y

- name: Sync to AGENTS.md
  run: openskills sync -y

# O usar la estrategia de actualización al instalar
- name: Install or update skills
  run: |
    openskills install anthropics/skills -y || openskills update -y
```

---

## Resumen de esta lección

**Puntos clave**:

1. **El modo no interactiva es adecuado para CI/CD**: Usa el flag `-y` para omitir todas las indicaciones interactivas
2. **Flag -y del comando install**: Instala automáticamente todas las habilidades encontradas, sobrescribiendo las habilidades existentes
3. **Flag -y del comando sync**: Sincroniza automáticamente todas las habilidades a AGENTS.md
4. **Integración con GitHub Actions**: Usa comandos no interactivos en el workflow para automatizar la gestión de habilidades
5. **Escenarios Docker**: Instala habilidades durante la fase de construcción de la imagen, asegurando que estén disponibles inmediatamente después de iniciar el contenedor
6. **Acceso a repositorios privados**: Configura el acceso a repositorios de habilidades privados mediante claves SSH
7. **Configuración de variables de entorno**: Configura de manera flexible la fuente de habilidades y los parámetros de instalación a través de variables de entorno

**Flujo de toma de decisiones**:

```
[Necesidad de usar OpenSkills en CI/CD] → [Instalar habilidades]
                                    ↓
                            [Usar flag -y para omitir interactividad]
                                    ↓
                            [Generar AGENTS.md]
                                    ↓
                            [Usar flag -y para omitir interactividad]
                                    ↓
                            [Verificar que las habilidades están instaladas correctamente]
```

**Fórmula mnemotécnica**:

- **CI/CD recuerda agregar -y**: El modo no interactiva es clave
- **GitHub Actions usa SSH**: Los repositorios privados necesitan configurar claves
- **Docker construye e instala temprano**: Presta atención al tamaño de la imagen
- **Variables de entorno bien configuradas**: Diferentes entornos deben distinguirse

---

## Próxima lección

> En la próxima lección aprenderemos **[Notas de seguridad](../security/)**.
>
> Aprenderás:
> - Las características de seguridad y los mecanismos de protección de OpenSkills
> - Cómo funciona la protección contra el recorrido de rutas
> - Cómo se manejan de manera segura los enlaces simbólicos
> - Las medidas de seguridad en el análisis YAML
> - Las mejores prácticas de gestión de permisos

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| Instalación no interactiva | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L424-L455) | 424-455 |
| Detección y sobrescritura de conflictos | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L521-L550) | 521-550 |
| Sincronización no interactiva | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| Definición de argumentos de línea de comandos | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L49) | 49 |
| Definición de argumentos de línea de comandos | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L65) | 65 |

**Constantes clave**:
- `-y, --yes`: Flag de línea de comandos para omitir la selección interactiva

**Funciones clave**:
- `warnIfConflict(skillName, targetPath, isProject, skipPrompt)`: Detecta conflictos de habilidades y decide si sobrescribir
- `installFromRepo()`: Instala habilidades desde un repositorio (admite modo no interactiva)
- `syncAgentsMd()`: Sincroniza habilidades a AGENTS.md (admite modo no interactiva)

**Reglas de negocio**:
- Al usar el flag `-y`, se omiten todas las indicaciones interactivas
- Cuando la habilidad ya existe, el modo no interactiva la sobrescribe automáticamente (muestra `Overwriting: <skill-name>`)
- El modo no interactiva funciona normalmente en entornos headless (sin TTY)
- Los comandos `install` y `sync` admiten el flag `-y`

</details>
