---
title: "Fase de Preview: Generación automática de guías de despliegue e instrucciones de ejecución | Tutorial de Agent App Factory"
sidebarTitle: "Generar guías de despliegue"
subtitle: "Generación de guías de despliegue: Guía completa de la fase de Preview"
description: "Aprende cómo la fase de Preview de AI App Factory genera automáticamente guías de ejecución y configuraciones de despliegue para aplicaciones generadas, cubriendo inicio local, contenedores Docker, construcción Expo EAS, pipelines de CI/CD y diseño de flujos de demostración."
tags:
  - "Guía de despliegue"
  - "Docker"
  - "CI/CD"
prerequisite:
  - "advanced-stage-validation"
order: 140
---

# Generación de guías de despliegue: Guía completa de la fase de Preview

## Lo que podrás hacer

Al completar esta lección, serás capaz de:

- Comprender cómo Preview Agent escribe guías de ejecución para aplicaciones generadas
- Dominar el método de generación de configuraciones de despliegue con Docker
- Entender el propósito de la configuración de construcción Expo EAS
- Aprender a diseñar flujos de demostración breves para MVP
- Comprender las mejores prácticas de configuración de CI/CD y Git Hooks

## Tu situación actual

El código ya se ha generado y validado, quieres mostrar rápidamente el MVP a tu equipo o cliente, pero no sabes:

- ¿Qué tipo de documentación de ejecución escribir?
- ¿Cómo permitir que otros inicien y ejecuten la aplicación rápidamente?
- ¿Qué funciones demostrar? ¿Qué problemas evitar?
- ¿Cómo desplegar en producción? ¿Docker o plataforma en la nube?
- ¿Cómo establecer integración continua y puertas de calidad de código?

La fase de Preview resuelve estos problemas: genera automáticamente instrucciones completas de ejecución y configuraciones de despliegue.

## Cuándo usar esta técnica

La fase de Preview es la séptima y última etapa del pipeline, inmediatamente después de la fase de Validation.

**Escenarios típicos de uso**:

| Escenario | Descripción |
| --------- | ----------- |
| Demostración de MVP | Necesitas mostrar la aplicación al equipo o cliente, requieres una guía de ejecución detallada |
| Colaboración en equipo | Nuevos miembros se unen al proyecto, necesitan ponerse al día rápidamente con el entorno de desarrollo |
| Despliegue en producción | Preparando el lanzamiento de la aplicación, necesitas configuración de Docker y pipeline de CI/CD |
| Publicación de aplicación móvil | Necesitas configurar Expo EAS, preparando envío a App Store y Google Play |

**Escenarios no aplicables**:

- Solo leer código sin ejecutarlo (la fase de Preview es obligatoria)
- El código no pasó la fase de Validation (corrige los problemas antes de ejecutar Preview)

## 🎒 Preparativos

::: warning Requisitos previos

Esta lección asume que ya has:

1. **Completado la fase de Validation**: `artifacts/validation/report.md` debe existir y pasar la validación
2. **Entendido la arquitectura de la aplicación**: Conoces claramente el stack tecnológico del backend y frontend, modelos de datos y endpoints de API
3. **Familiarizado con conceptos básicos**: Entiendes conceptos básicos de Docker, CI/CD, Git Hooks

:::

**Conceptos que necesitas conocer**:

::: info ¿Qué es Docker?

Docker es una plataforma de contenedores que puede empaquetar una aplicación y sus dependencias en un contenedor portátil.

**Ventajas principales**:

- **Consistencia del entorno**: Entornos de desarrollo, pruebas y producción son idénticos, evitando "funciona en mi máquina"
- **Despliegue rápido**: Un solo comando para iniciar toda la pila de aplicaciones
- **Aislamiento de recursos**: Los contenedores no se afectan entre sí, mejorando la seguridad

**Conceptos básicos**:

```
Dockerfile → Imagen (Image) → Contenedor (Container)
```

:::

::: info ¿Qué es CI/CD?

CI/CD (Integración Continua/Despliegue Continuo) es una práctica automatizada de desarrollo de software.

**CI (Integración Continua)**:
- Ejecuta pruebas y verificaciones automáticamente en cada commit
- Descubre problemas de código tempranamente
- Mejora la calidad del código

**CD (Despliegue Continuo)**:
- Construye y despliega la aplicación automáticamente
- Lleva nuevas características a producción rápidamente
- Reduce errores de operación manual

**GitHub Actions** es la plataforma CI/CD proporcionada por GitHub, definiendo flujos automatizados a través de archivos `.github/workflows/*.yml`.

:::

::: info ¿Qué son los Git Hooks?

Los Git Hooks son scripts que se ejecutan automáticamente en momentos específicos de operaciones de Git.

**Hooks comúnmente utilizados**:

- **pre-commit**: Ejecuta verificaciones de código y formateo antes del commit
- **commit-msg**: Valida el formato del mensaje de commit
- **pre-push**: Ejecuta pruebas completas antes del push

**Husky** es una herramienta popular de gestión de Git Hooks, utilizada para simplificar la configuración y mantenimiento de Hooks.

:::

## Idea central

El núcleo de la fase de Preview es **preparar documentación completa de uso y despliegue para la aplicación**, pero siguiendo el principio de "local-first, riesgos transparentes".

### Marco de pensamiento

Preview Agent sigue el siguiente marco de pensamiento:

| Principio | Descripción |
| --------- | ----------- |
| **Local primero** | Asegura que cualquiera con un entorno de desarrollo básico pueda iniciar localmente |
| **Listo para despliegue** | Proporciona todos los archivos de configuración necesarios para el despliegue en producción |
| **Historias de usuario** | Diseña flujos de demostración breves que muestren valor central |
| **Riesgos transparentes** | Lista activamente las limitaciones o problemas conocidos de la versión actual |

### Estructura de archivos de salida

Preview Agent generará dos tipos de archivos:

**Archivos obligatorios** (necesarios para cada proyecto):

| Archivo | Descripción | Ubicación |
| ------- | ----------- | --------- |
| `README.md` | Documento principal de instrucciones de ejecución | `artifacts/preview/README.md` |
| `Dockerfile` | Configuración de Docker del backend | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Docker Compose del entorno de desarrollo | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Plantilla de variables de entorno de producción | `artifacts/backend/.env.production.example` |
| `eas.json` | Configuración de construcción Expo EAS | `artifacts/client/eas.json` |

**Archivos recomendados** (necesarios para producción):

| Archivo | Descripción | Ubicación |
| ------- | ----------- | --------- |
| `DEPLOYMENT.md` | Guía detallada de despliegue | `artifacts/preview/DEPLOYMENT.md` |
| `docker-compose.production.yml` | Docker Compose del entorno de producción | Directorio raíz del proyecto |

### Estructura del documento README

`artifacts/preview/README.md` debe incluir los siguientes capítulos:

```markdown
# [Nombre del proyecto]

## Inicio rápido

### Requisitos del entorno
- Node.js >= 18
- npm >= 9
- [Otras dependencias]

### Inicio del backend
[Instalar dependencias, configurar entorno, inicializar base de datos, iniciar servicio]

### Inicio del frontend
[Instalar dependencias, configurar entorno, iniciar servidor de desarrollo]

### Verificación de instalación
[Comandos de prueba, verificaciones de salud]

---

## Flujo de demostración

### Preparación
### Pasos de demostración
### Notas de demostración

---

## Problemas conocidos y limitaciones

### Limitaciones de funcionalidad
### Deuda técnica
### Operaciones a evitar durante la demostración

---

## Preguntas frecuentes
```

## Flujo de trabajo de Preview Agent

Preview Agent es un AI Agent responsable de escribir guías de ejecución y configuraciones de despliegue para aplicaciones generadas. Su flujo de trabajo es el siguiente:

### Archivos de entrada

Preview Agent solo puede leer los siguientes archivos:

| Archivo | Descripción | Ubicación |
| ------- | ----------- | --------- |
| Código del backend | Aplicación del backend validada | `artifacts/backend/` |
| Código del frontend | Aplicación del frontend validada | `artifacts/client/` |

### Archivos de salida

Preview Agent debe generar los siguientes archivos:

| Archivo | Descripción | Ubicación |
| ------- | ----------- | --------- |
| `README.md` | Documento principal de instrucciones de ejecución | `artifacts/preview/README.md` |
| `Dockerfile` | Configuración de Docker del backend | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Docker Compose del entorno de desarrollo | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Plantilla de variables de entorno de producción | `artifacts/backend/.env.production.example` |
| `eas.json` | Configuración de construcción Expo EAS | `artifacts/client/eas.json` |

### Pasos de ejecución

1. **Explorar código**: Analizar los directorios del backend y frontend, determinar comandos de instalación de dependencias e inicio
2. **Escribir README**: Seguir la guía de `skills/preview/skill.md`, escribir instrucciones claras de instalación y ejecución
3. **Generar configuración de Docker**: Crear Dockerfile y docker-compose.yml
4. **Configurar EAS**: Generar configuración de construcción Expo EAS (aplicaciones móviles)
5. **Preparar flujo de demostración**: Diseñar descripciones breves de escenarios de demostración
6. **Listar problemas conocidos**: Listar activamente defectos o limitaciones de la versión actual

## Sígueme: Ejecutar la fase de Preview

### Paso 1: Confirmar que la fase de Validation está completada

**Por qué**

Preview Agent necesita leer `artifacts/backend/` y `artifacts/client/`, si el código no pasó la validación, los documentos generados por la fase de Preview pueden no ser precisos.

**Acción**

```bash
# Verificar reporte de validación
cat artifacts/validation/report.md
```

**Deberías ver**: El reporte de validación muestra que todas las verificaciones del backend y frontend pasaron.

```
✅ Backend Dependencies: OK
✅ Backend Type Check: OK
✅ Prisma Schema: OK
✅ Frontend Dependencies: OK
✅ Frontend Type Check: OK
```

### Paso 2: Ejecutar la fase de Preview

**Por qué**

Usar el asistente de AI para ejecutar Preview Agent, generando automáticamente guías de ejecución y configuraciones de despliegue.

**Acción**

```bash
# Usar Claude Code para ejecutar la fase de preview
factory run preview
```

**Deberías ver**:

```
✓ Fase actual: preview
✓ Cargar código backend: artifacts/backend/
✓ Cargar código frontend: artifacts/client/
✓ Iniciar Preview Agent

Preview Agent está generando guías de ejecución y configuraciones de despliegue...

[El asistente de AI realizará las siguientes operaciones]
1. Analizar la estructura del proyecto del backend y frontend
2. Generar README.md (instalación, ejecución, flujo de demostración)
3. Crear Dockerfile y docker-compose.yml
4. Configurar archivos de construcción Expo EAS
5. Preparar plantilla de variables de entorno de producción
6. Listar problemas conocidos y limitaciones

Esperando a que el Agent termine...
```

### Paso 3: Verificar el README generado

**Por qué**

Verificar si el README está completo, validar si los pasos de instalación y comandos de ejecución son claros.

**Acción**

```bash
# Ver guía de ejecución
cat artifacts/preview/README.md
```

**Deberías ver**: Una guía de ejecución completa con los siguientes capítulos

```markdown
# Asistente de recomendación de restaurantes con IA

## Inicio rápido

### Requisitos del entorno

- Node.js >= 18
- npm >= 9
- Docker (opcional, para despliegue en contenedores)

### Inicio del backend

```bash
# Entrar al directorio del backend
cd artifacts/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env para completar la configuración necesaria

# Inicializar base de datos
npx prisma migrate dev

# (Opcional) Llenar datos de prueba
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

Backend ejecutándose en: http://localhost:3000
Verificación de salud: http://localhost:3000/health
Documentación de API: http://localhost:3000/api-docs

### Inicio del frontend

```bash
# Entrar al directorio del frontend
cd artifacts/client

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar API_URL para apuntar a la dirección del backend

# Iniciar servidor de desarrollo
npm start
```

- Simulador iOS: Presiona `i`
- Simulador Android: Presiona `a`
- Navegador web: Presiona `w`

### Verificación de instalación

Ejecuta los siguientes comandos para verificar si la instalación fue exitosa:

```bash
# Pruebas del backend
cd artifacts/backend && npm test

# Pruebas del frontend
cd artifacts/client && npm test

# Verificación de salud de API
curl http://localhost:3000/health
```

---

## Flujo de demostración

### Preparación

1. Asegura que el backend y frontend estén iniciados
2. Limpia o restablece los datos de demostración (opcional)

### Pasos de demostración

1. **Introducción al escenario** (30 segundos)
   - Presentar usuarios objetivo: usuarios que quieren probar nuevos restaurantes
   - Presentar problema central: dificultad de elección, no saber qué comer

2. **Demostración de funcionalidad** (3-5 minutos)
   - Paso 1: Usuario ingresa preferencias (tipo de cocina, sabor, presupuesto)
   - Paso 2: IA recomienda restaurantes basándose en preferencias
   - Paso 3: Usuario ve resultados y selecciona

3. **Puntos técnicos destacados** (opcional, 1 minuto)
   - Recomendaciones de IA en tiempo real (llamando a API de OpenAI)
   - Diseño responsivo móvil
   - Persistencia en base de datos local

### Notas de demostración

- Asegura que la conexión de red sea normal (las recomendaciones de IA requieren llamar a la API)
- Evita ingresar preferencias demasiado largas o vagas (puede causar recomendaciones inexactas)
- No modifiques la base de datos durante la demostración (puede afectar el efecto de la demostración)

---

## Problemas conocidos y limitaciones

### Limitaciones de funcionalidad

- [ ] Todavía no soporta registro y login de usuarios
- [ ] Todavía no soporta favoritos e historial
- [ ] Las recomendaciones de IA solo soportan entrada de texto, todavía no soporta voz o imágenes

### Deuda técnica

- [ ] El manejo de errores del frontend no es lo suficientemente completo
- [ ] El registro de logs del backend necesita optimización
- [ ] Los índices de base de datos no están optimizados (sin impacto en volúmenes de datos pequeños)

### Operaciones a evitar durante la demostración

- Intentar registrar o iniciar sesión en cuenta - puede causar interrupción de la demostración
- Ingresar caracteres especiales o texto extremadamente largo - puede desencadenar errores
- Solicitudes rápidas continuas - puede desencadenar limitación de API

---

## Preguntas frecuentes

### P: ¿Qué hacer si el puerto está ocupado?

R: Modifica la variable `PORT` en `.env`, o termina el proceso que ocupa el puerto primero.

### P: ¿Qué hacer si falla la conexión a la base de datos?

R: Verifica si la configuración `DATABASE_URL` en `.env` es correcta, asegura que la base de datos esté iniciada.

### P: ¿Qué hacer si las recomendaciones de IA no responden?

R: Verifica si `OPENAI_API_KEY` en `.env` es válido, si la conexión de red es normal.
```

### Paso 4: Verificar la configuración de Docker generada

**Por qué**

Verificar si la configuración de Docker es correcta, asegurar que se pueda construir y ejecutar contenedores sin problemas.

**Acción**

```bash
# Ver Dockerfile
cat artifacts/backend/Dockerfile

# Ver docker-compose.yml
cat artifacts/backend/docker-compose.yml
```

**Deberías ver**: Archivos de configuración que sigan las mejores prácticas de Docker

**Ejemplo de Dockerfile**:

```dockerfile
# Imagen base
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Construir
RUN npm run build

# Imagen de producción
FROM node:20-alpine AS production

WORKDIR /app

# Instalar dependencias de producción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Exponer puerto
EXPOSE 3000

# Verificación de salud
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["npm", "start"]
```

**Ejemplo de docker-compose.yml**:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./dev.db
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### Paso 5: Verificar configuración de EAS

**Por qué**

Verificar si la configuración de Expo EAS es correcta, asegurar que se pueda construir y publicar la aplicación móvil sin problemas.

**Acción**

```bash
# Ver configuración de EAS
cat artifacts/client/eas.json
```

**Deberías ver**: Configuración que incluye tres entornos: development, preview, production

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "http://localhost:3000"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api-staging.your-domain.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.your-domain.com"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Paso 6: Verificar condiciones de salida

**Por qué**

Sisyphus verificará si Preview Agent cumple con las condiciones de salida, si no las cumple, requerirá re-ejecución.

**Lista de verificación**

| Verificación | Descripción | Aprobado/Fallido |
| ------------ | ----------- | ---------------- |
| README incluye pasos de instalación | Lista claramente los comandos de instalación de dependencias necesarias para backend y frontend | [ ] |
| README incluye comandos de ejecución | Proporciona comandos para iniciar backend y frontend respectivamente | [ ] |
| README lista direcciones de acceso y flujo de demostración | Explica las direcciones y puertos que necesitan ser accedidos durante la demostración | [ ] |
| Configuración de Docker puede construir normalmente | Dockerfile y docker-compose.yml no tienen errores de sintaxis | [ ] |
| Plantilla de variables de entorno de producción completa | .env.production.example incluye toda la configuración necesaria | [ ] |

**Si falla**:

```bash
# Re-ejecutar fase de Preview
factory run preview
```

## Punto de control ✅

**Confirma que has completado**:

- [ ] Fase de Preview ejecutada exitosamente
- [ ] Archivo `artifacts/preview/README.md` existe y está completo
- [ ] Archivo `artifacts/backend/Dockerfile` existe y puede construirse
- [ ] Archivo `artifacts/backend/docker-compose.yml` existe
- [ ] Archivo `artifacts/backend/.env.production.example` existe
- [ ] Archivo `artifacts/client/eas.json` existe (aplicación móvil)
- [ ] README incluye pasos claros de instalación y comandos de ejecución
- [ ] README incluye flujo de demostración y problemas conocidos

## Alertas de trampas comunes

### ⚠️ Trampa 1: Ignorar pasos de instalación de dependencias

**Problema**: README solo dice "iniciar servicio", no explica cómo instalar dependencias.

**Síntoma**: Nuevos miembros siguen README, al ejecutar `npm run dev` obtienen error "módulo no encontrado".

**Solución**: Preview Agent restringe "README debe incluir pasos de instalación", asegurar que cada paso tenga comandos claros.

**Ejemplo correcto**:

```bash
# ❌ Incorrecto - Falta paso de instalación
npm run dev

# ✅ Correcto - Incluye pasos completos
npm install
npm run dev
```

### ⚠️ Trampa 2: Configuración de Docker usa etiqueta latest

**Problema**: Dockerfile usa `FROM node:latest` o `FROM node:alpine`.

**Síntoma**: Cada construcción puede usar diferentes versiones de Node.js, causando inconsistencia de entorno.

**Solución**: Preview Agent restringe "NUNCA usar latest como etiqueta de imagen Docker, debe usar número de versión específico".

**Ejemplo correcto**:

```dockerfile
# ❌ Incorrecto - Usa latest
FROM node:latest

# ❌ Incorrecto - No especifica versión específica
FROM node:alpine

# ✅ Correcto - Usa versión específica
FROM node:20-alpine
```

### ⚠️ Trampa 3: Variables de entorno codificadas (hardcoded)

**Problema**: Codificar información sensible (contraseñas, API Keys, etc.) en configuración de Docker o EAS.

**Síntoma**: Información sensible filtrada al repositorio de código, riesgo de seguridad.

**Solución**: Preview Agent restringe "NUNCA codificar información sensible en configuración de despliegue", usar plantillas de variables de entorno.

**Ejemplo correcto**:

```yaml
# ❌ Incorrecto - Contraseña de base de datos codificada
DATABASE_URL=postgresql://user:password123@host:5432/database

# ✅ Correcto - Usa variables de entorno
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}
```

### ⚠️ Trampa 4: Problemas conocidos ocultos no listados

**Problema**: README no lista problemas conocidos y limitaciones, exagerando capacidades del producto.

**Síntoma**: Ocurren accidentes durante la demostración, causando vergüenza y pérdida de confianza.

**Solución**: Preview Agent restringe "NUNCA exagerar funcionalidad u ocultar defectos", listar activamente problemas existentes en la versión actual.

**Ejemplo correcto**:

```markdown
## Problemas conocidos y limitaciones

### Limitaciones de funcionalidad
- [ ] Todavía no soporta registro y login de usuarios
- [ ] Las recomendaciones de IA pueden no ser precisas (dependen de resultados de API de OpenAI)
```

### ⚠️ Trampa 5: Flujo de demostración demasiado complejo

**Problema**: Flujo de demostración incluye 10+ pasos, requiere más de 10 minutos.

**Síntoma**: El presentador no recuerda los pasos, la audiencia pierde paciencia.

**Solución**: Preview Agent restringe "flujo de demostración debe controlarse en 3-5 minutos, no más de 5 pasos".

**Ejemplo correcto**:

```markdown
### Pasos de demostración

1. **Introducción al escenario** (30 segundos)
   - Presentar usuarios objetivo y problema central

2. **Demostración de funcionalidad** (3-5 minutos)
   - Paso 1: Usuario ingresa preferencias
   - Paso 2: IA recomienda basándose en preferencias
   - Paso 3: Usuario ve resultados

3. **Puntos técnicos destacados** (opcional, 1 minuto)
   - Recomendaciones de IA en tiempo real
   - Diseño responsivo móvil
```

## Plantilla de configuración CI/CD

Preview Agent puede referirse a `templates/cicd-github-actions.md` para generar configuración CI/CD, incluyendo:

### Pipeline de CI del backend

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run linter
        working-directory: backend
        run: npm run lint

      - name: Run type check
        working-directory: backend
        run: npx tsc --noEmit

      - name: Validate Prisma schema
        working-directory: backend
        run: npx prisma validate

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Run tests
        working-directory: backend
        run: npm test
```

### Pipeline de CI del frontend

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'client/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'client/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: client/package-lock.json

      - name: Install dependencies
        working-directory: client
        run: npm ci

      - name: Run linter
        working-directory: client
        run: npm run lint

      - name: Run type check
        working-directory: client
        run: npx tsc --noEmit

      - name: Run tests
        working-directory: client
        run: npm test -- --coverage
```

## Plantilla de configuración Git Hooks

Preview Agent puede referirse a `templates/git-hooks-husky.md` para generar configuración Git Hooks, incluyendo:

### Hook pre-commit

Ejecuta verificaciones de código y formateo antes del commit.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Ejecutar lint-staged
npx lint-staged

# Verificar tipos TypeScript
echo "📝 Type checking..."
npm run type-check

echo "✅ Pre-commit checks passed!"
```

### Hook commit-msg

Valida el formato del mensaje de commit.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📋 Validating commit message..."

npx --no -- commitlint --edit "$1"

echo "✅ Commit message is valid!"
```

## Resumen de la lección

La fase de Preview es el último eslabón del pipeline, responsable de preparar documentación completa de uso y despliegue para aplicaciones generadas. Genera automáticamente:

- **Guía de ejecución**: Pasos claros de instalación, comandos de inicio y flujos de demostración
- **Configuración de Docker**: Dockerfile y docker-compose.yml, soportando despliegue en contenedores
- **Configuración de EAS**: Configuración de construcción Expo EAS, soportando publicación de aplicaciones móviles
- **Configuración CI/CD**: Pipelines de GitHub Actions, soportando integración continua y despliegue
- **Git Hooks**: Configuración de Husky, soportando verificaciones antes del commit

**Principios clave**:

1. **Local primero**: Asegura que cualquiera con un entorno de desarrollo básico pueda iniciar localmente
2. **Listo para despliegue**: Proporciona todos los archivos de configuración necesarios para el despliegue en producción
3. **Historias de usuario**: Diseña flujos de demostración breves que muestren valor central
4. **Riesgos transparentes**: Lista activamente las limitaciones o problemas conocidos de la versión actual

Después de completar la fase de Preview, obtendrás:

- ✅ Guía completa de ejecución (`README.md`)
- ✅ Configuración de contenedores Docker (`Dockerfile`, `docker-compose.yml`)
- ✅ Plantilla de variables de entorno de producción (`.env.production.example`)
- ✅ Configuración de construcción Expo EAS (`eas.json`)
- ✅ Opcional: guía detallada de despliegue (`DEPLOYMENT.md`)

## Próxima lección

> ¡Felicitaciones! Has completado todas las 7 fases de AI App Factory.
>
> Si quieres entender profundamente el mecanismo de coordinación del pipeline, puedes aprender **[Detalles del programador Sisyphus](../orchestrator/)**.
>
> Aprenderás:
> - Cómo el programador coordina la ejecución del pipeline
> - Mecanismo de verificación de permisos y manejo de exceso de autoridad
> - Manejo de fallas y estrategia de reversión
> - Optimización de contexto y técnicas de ahorro de tokens

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Clic para expandir ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-29

| Funcionalidad | Ruta de archivo | Número de línea |
| ------------- | --------------- | --------------- |
| Definición de Preview Agent | [`source/hyz1992/agent-app-factory/agents/preview.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/preview.agent.md) | 1-33 |
| Guía de habilidades de Preview | [`source/hyz1992/agent-app-factory/skills/preview/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/preview/skill.md) | 1-583 |
| Configuración de Pipeline | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 98-111 |
| Plantilla de configuración CI/CD | [`source/hyz1992/agent-app-factory/templates/cicd-github-actions.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/cicd-github-actions.md) | 1-617 |
| Plantilla de configuración Git Hooks | [`source/hyz1992/agent-app-factory/templates/git-hooks-husky.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/git-hooks-husky.md) | 1-530 |

**Restricciones clave**:
- **Local primero**: Asegura que cualquiera con un entorno de desarrollo básico pueda iniciar localmente
- **Listo para despliegue**: Proporciona todos los archivos de configuración necesarios para el despliegue en producción
- **Riesgos transparentes**: Lista activamente las limitaciones o problemas conocidos de la versión actual

**Archivos que deben generarse**:
- `artifacts/preview/README.md` - Documento principal de instrucciones de ejecución
- `artifacts/backend/Dockerfile` - Configuración de Docker del backend
- `artifacts/backend/docker-compose.yml` - Docker Compose del entorno de desarrollo
- `artifacts/backend/.env.production.example` - Plantilla de variables de entorno de producción
- `artifacts/client/eas.json` - Configuración de construcción Expo EAS

**NO hacer (NEVER)**:
- NUNCA ignorar instalación de dependencias o pasos de configuración, de lo contrario la ejecución o despliegue probablemente fallará
- NUNCA proporcionar instrucciones adicionales o lenguaje de marketing no relacionado con la aplicación
- NUNCA exagerar capacidades del producto, ocultar defectos o limitaciones
- NUNCA codificar información sensible en configuración de despliegue (contraseñas, API Keys, etc.)
- NUNCA ignorar configuración de verificación de salud, esto es crítico para monitoreo en producción
- NUNCA omitir explicación de migración de base de datos, este es un paso clave para el lanzamiento
- NUNCA usar `latest` como etiqueta de imagen Docker, debe usar número de versión específico
- NUNCA usar SQLite en producción (debe migrar a PostgreSQL)

</details>
