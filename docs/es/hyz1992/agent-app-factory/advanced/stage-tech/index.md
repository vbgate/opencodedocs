---
title: "Diseñar la arquitectura técnica: Guía completa de la fase Tech | Tutorial de Agent App Factory"
sidebarTitle: "Diseñar la arquitectura técnica"
subtitle: "Diseñar la arquitectura técnica: Guía completa de la fase Tech"
description: "Aprende cómo la fase Tech de AI App Factory diseña la arquitectura técnica mínima viable y el modelo de datos Prisma basándose en PRD, incluyendo selección de stack tecnológico, diseño de modelo de datos, definición de API y estrategia de migración de base de datos."
tags:
  - "Arquitectura técnica"
  - "Modelo de datos"
  - "Prisma"
prerequisite:
  - "advanced-stage-prd"
order: 110
---

# Diseñar la arquitectura técnica: Guía completa de la fase Tech

## Lo que podrás hacer

Al completar esta lección, podrás:

- Comprender cómo Tech Agent diseña la arquitectura técnica basándose en PRD
- Dominar los métodos y restricciones de diseño de Prisma Schema
- Entender los principios de toma de decisiones para la selección del stack tecnológico
- Aprender a crear modelos de datos y diseños de API razonables para MVP
- Comprender la estrategia de migración entre entorno de desarrollo SQLite y entorno de producción PostgreSQL

## Tu situación actual

El PRD ya está escrito, sabes qué funciones implementar, pero no sabes:

- ¿Qué stack tecnológico elegir? ¿Node.js o Python?
- ¿Cómo diseñar las tablas de datos? ¿Cómo definir relaciones?
- ¿Qué endpoints de API debe haber? ¿Qué especificaciones seguir?
- ¿Cómo garantizar que el diseño permita una entrega rápida y soporte para futuras expansiones?

La fase Tech existe para resolver estos problemas: genera automáticamente la arquitectura técnica y el modelo de datos basándose en PRD.

## Cuándo usar esta técnica

La fase Tech es la cuarta fase de la línea de producción, después de la fase UI y antes de la fase Code.

**Escenarios de uso típicos**:

| Escenario | Descripción |
| ---- | ---- |
| Nuevo proyecto | Después de confirmar el PRD, es necesario diseñar la solución técnica |
| Prototipo rápido de MVP | Se necesita una arquitectura técnica mínima viable, evitando el sobre-diseño |
| Decisión de stack tecnológico | No está claro qué combinación tecnológica es la más adecuada |
| Diseño de modelo de datos | Es necesario definir relaciones y campos de entidades claros |

**Escenarios no aplicables**:

- Proyectos con arquitectura técnica ya definida (la fase Tech rediseñará)
- Solo se hace frontend o backend (la fase Tech diseña arquitectura full-stack)
- Se necesita arquitectura de microservicios (no recomendado en fase MVP)

## 🎒 Preparativos

::: warning Requisitos previos

Esta lección asume que ya has:

1. **Completado la fase PRD**: `artifacts/prd/prd.md` debe existir y pasar la validación
2. **Entendido los requisitos del producto**: Claro sobre las funciones principales, historias de usuario y el alcance del MVP
3. **Familiarizado con conceptos básicos**: Entendido los conceptos básicos de RESTful API, bases de datos relacionales y ORM

:::

**Conceptos necesarios**:

::: info ¿Qué es Prisma?

Prisma es una herramienta ORM moderna (mapeo objeto-relacional) para manipular bases de datos en TypeScript/Node.js.

**Ventajas principales**:

- **Seguridad de tipos**: Genera automáticamente tipos TypeScript, proporcionando sugerencias completas durante el desarrollo
- **Gestión de migraciones**: `prisma migrate dev` gestiona automáticamente los cambios en la base de datos
- **Experiencia de desarrollo**: Prisma Studio permite visualizar y editar datos

**Flujo de trabajo básico**:

```
Definir schema.prisma → Ejecutar migración → Generar Client → Usar en código
```

:::

::: info ¿Por qué usar SQLite para MVP y PostgreSQL para producción?

**SQLite (entorno de desarrollo)**:

- Configuración cero, base de datos basada en archivos (`dev.db`)
- Ligera y rápida, adecuada para desarrollo local y demostraciones
- No admite escritura concurrente

**PostgreSQL (entorno de producción)**:

- Funcionalidad completa, admite concurrencia y consultas complejas
- Excelente rendimiento, adecuado para despliegue en producción
- Migración sin problemas con Prisma: solo es necesario modificar `DATABASE_URL`

**Estrategia de migración**: Prisma adapta automáticamente el proveedor de base de datos según `DATABASE_URL`, sin necesidad de modificar manualmente el Schema.

:::


## Idea central

El núcleo de la fase Tech es **convertir requisitos del producto en soluciones técnicas**, pero siguiendo el principio "MVP primero".

### Marco de pensamiento

Tech Agent sigue el siguiente marco de pensamiento:

| Principio | Descripción |
| ---- | ---- |
| **Correspondencia de objetivos** | La solución técnica debe servir al valor central del producto |
| **Simplicidad primero** | Elegir un stack tecnológico simple y maduro para entrega rápida |
| **Escalabilidad** | Reservar puntos de extensión en el diseño para soportar evolución futura |
| **Impulsado por datos** | Expresar entidades y relaciones a través de modelos de datos claros |

### Árbol de decisión de selección tecnológica

**Stack tecnológico de backend**:

| Componente | Recomendado | Alternativa | Descripción |
| ---- | ---- | ---- | ---- |
| **Runtime** | Node.js + TypeScript | Python + FastAPI | Ecosistema Node.js rico, frontend y backend unificados |
| **Framework web** | Express | Fastify | Express maduro y estable, middleware abundante |
| **ORM** | Prisma 5.x | TypeORM | Prisma seguro en tipos, excelente gestión de migraciones |
| **Base de datos** | SQLite (desarrollo) / PostgreSQL (producción) | - | SQLite configuración cero, PostgreSQL listo para producción |

**Stack tecnológico de frontend**:

| Escenario | Recomendado | Descripción |
| ---- | ---- | ---- |
| Solo móvil | React Native + Expo | Multiplataforma, actualizaciones en caliente |
| Móvil + Web | React Native Web | Un código ejecutable en múltiples plataformas |
| Solo Web | React + Vite | Excelente rendimiento, ecosistema maduro |

**Gestión de estado**:

| Complejidad | Recomendado | Descripción |
| ---- | ---- | ---- |
| Simple (< 5 estados globales) | React Context API | Sin dependencias, bajo costo de aprendizaje |
| Complejidad media | Zustand | Ligero, API simple, buen rendimiento |
| Aplicación compleja | Redux Toolkit | ⚠️ No recomendado en fase MVP, demasiado complejo |

### Principios de diseño del modelo de datos

**Identificación de entidades**:

1. Extraer sustantivos de las historias de usuario del PRD → entidades candidatas
2. Distinguir entre entidades principales (requeridas) y entidades auxiliares (opcionales)
3. Cada entidad debe tener un significado comercial claro

**Diseño de relaciones**:

| Tipo de relación | Ejemplo | Descripción |
| ---- | ---- | ---- |
| Uno a muchos (1:N) | User → Posts | Un usuario tiene múltiples artículos |
| Muchos a muchos (M:N) | Posts ↔ Tags | Artículos y etiquetas (a través de tabla intermedia) |
| Uno a uno (1:1) | User → UserProfile | ⚠️ Uso limitado, generalmente se puede fusionar |

**Principios de campos**:

- **Campos obligatorios**: `id`, `createdAt`, `updatedAt`
- **Evitar redundancia**: No almacenar campos que se pueden obtener mediante cálculo o asociación
- **Tipo apropiado**: String, Int, Float, Boolean, DateTime
- **Marcar campos sensibles**: Contraseñas, etc. no deben almacenarse directamente

### ⚠️ Restricciones de compatibilidad con SQLite

Al generar Prisma Schema, Tech Agent debe cumplir con los requisitos de compatibilidad de SQLite:

#### Prohibido usar Composite Types

SQLite no admite la definición `type` de Prisma, se debe usar `String` para almacenar cadenas JSON.

```prisma
// ❌ Error - SQLite no soporta
type UserProfile {
  identity String
  ageRange String
}

model User {
  id      Int        @id @default(autoincrement())
  profile UserProfile
}

// ✅ Correcto - usar String para almacenar JSON
model User {
  id      Int    @id @default(autoincrement())
  profile String // JSON: {"identity":"student","ageRange":"18-25"}
}
```

#### Normas de comentarios para campos JSON

En el Schema, usa comentarios para explicar la estructura JSON:

```prisma
model User {
  id      Int    @id @default(autoincrement())
  // Formato JSON: {"identity":"student","ageRange":"18-25"}
  profile String
}
```

Define interfaces correspondientes en código TypeScript:

```typescript
// src/types/index.ts
export interface UserProfile {
  identity: string;
  ageRange: string;
}
```

#### Bloqueo de versión Prisma

Se debe usar Prisma 5.x, no 7.x (problemas de compatibilidad):

```json
{
  "dependencies": {
    "@prisma/client": "5.22.0",
    "prisma": "5.22.0"
  }
}
```


## Flujo de trabajo de Tech Agent

Tech Agent es un agente de IA, responsable de diseñar la arquitectura técnica basándose en PRD. Su flujo de trabajo es el siguiente:

### Archivos de entrada

Tech Agent solo puede leer los siguientes archivos:

| Archivo | Descripción | Ubicación |
| ---- | ---- | ---- |
| `prd.md` | Documento de requisitos del producto | `artifacts/prd/prd.md` |

### Archivos de salida

Tech Agent debe generar los siguientes archivos:

| Archivo | Descripción | Ubicación |
| ---- | ---- | ---- |
| `tech.md` | Documento de solución técnica y arquitectura | `artifacts/tech/tech.md` |
| `schema.prisma` | Definición del modelo de datos | `artifacts/backend/prisma/schema.prisma` |

### Pasos de ejecución

1. **Leer PRD**: Identificar funciones principales, flujo de datos y restricciones
2. **Seleccionar stack tecnológico**: Según `skills/tech/skill.md`, seleccionar lenguaje, framework y base de datos
3. **Diseñar modelo de datos**: Definir entidades, atributos y relaciones, usar Prisma schema para expresar
4. **Escribir documentación técnica**: En `tech.md` explicar razones de selección, estrategia de extensión y objetivos no incluidos
5. **Generar archivos de salida**: Escribir el diseño en la ruta especificada, no modificar archivos upstream

### Condiciones de salida

El programador Sisyphus verificará si Tech Agent cumple con las siguientes condiciones:

- ✅ Stack tecnológico declarado claramente (backend, frontend, base de datos)
- ✅ Modelo de datos consistente con PRD (todas las entidades provienen del PRD)
- ✅ No se ha realizado optimización prematura o sobre-diseño

## Sigue los pasos: Ejecutar la fase Tech

### Paso 1: Confirmar que la fase PRD está completada

**Por qué**

Tech Agent necesita leer `artifacts/prd/prd.md`, si el archivo no existe, la fase Tech no se puede ejecutar.

**Operación**

```bash
# Verificar si el archivo PRD existe
cat artifacts/prd/prd.md
```

**Lo que deberías ver**: Un documento PRD estructurado, que incluya usuarios objetivo, lista de funciones, objetivos no incluidos, etc.

### Paso 2: Ejecutar la fase Tech

**Por qué**

Usa el asistente de IA para ejecutar Tech Agent, generando automáticamente arquitectura técnica y modelo de datos.

**Operación**

```bash
# Usar Claude Code para ejecutar la fase tech
factory run tech
```

**Lo que deberías ver**:

```
✓ Fase actual: tech
✓ Cargar documento PRD: artifacts/prd/prd.md
✓ Iniciar Tech Agent

Tech Agent está diseñando la arquitectura técnica...

[El asistente de AI ejecutará las siguientes operaciones]
1. Analizar PRD, extraer entidades y funciones
2. Seleccionar stack tecnológico (Node.js + Express + Prisma)
3. Diseñar modelo de datos (User, Post, etc.)
4. Definir endpoints de API
5. Generar tech.md y schema.prisma

Esperando a que el agente complete...
```


### Paso 3: Verificar la documentación técnica generada

**Por qué**

Verificar si la documentación técnica está completa y si el diseño es razonable.

**Operación**

```bash
# Ver documentación técnica
cat artifacts/tech/tech.md
```

**Lo que deberías ver**: Documentación técnica completa con los siguientes capítulos

```markdown
## Stack tecnológico

**Backend**
- Runtime: Node.js 20+
- Lenguaje: TypeScript 5+
- Framework: Express 4.x
- ORM: Prisma 5.x
- Base de datos: SQLite (desarrollo) / PostgreSQL (producción)

**Frontend**
- Framework: React Native + Expo
- Lenguaje: TypeScript
- Navegación: React Navigation 6
- Gestión de estado: React Context API
- Cliente HTTP: Axios

## Diseño de arquitectura

**Estructura en capas**
- Capa de rutas (routes/): Define endpoints de API
- Capa de controladores (controllers/): Maneja solicitudes y respuestas
- Capa de servicios (services/): Lógica de negocio
- Capa de acceso a datos: Prisma ORM

**Flujo de datos**
Client → API Gateway → Controller → Service → Prisma → Database

## Diseño de endpoints de API

| Endpoint | Método | Descripción | Cuerpo de solicitud | Respuesta |
|------|------|------|--------|------|
| /api/items | GET | Obtener lista | - | Item[] |
| /api/items/:id | GET | Obtener detalles | - | Item |
| /api/items | POST | Crear | CreateItemDto | Item |
| /api/items/:id | PUT | Actualizar | UpdateItemDto | Item |
| /api/items/:id | DELETE | Eliminar | - | { deleted: true } |

## Modelo de datos

### User
- id: Clave primaria
- email: Correo electrónico (obligatorio)
- name: Nombre (obligatorio)
- createdAt: Hora de creación
- updatedAt: Hora de actualización

**Relaciones**:
- posts: Uno a muchos (un usuario tiene múltiples artículos)

## Variables de entorno

**Backend (.env)**
- PORT: Puerto del servicio (predeterminado 3000)
- DATABASE_URL: Cadena de conexión a la base de datos
- NODE_ENV: Entorno (development/production)
- CORS_ORIGINS: Orígenes de CORS permitidos

**Frontend (.env)**
- EXPO_PUBLIC_API_URL: Dirección del API backend

## Puntos de extensión futura

**Corto plazo (v1.1)**
- Agregar paginación y filtros
- Implementar función de exportación de datos

**Mediano plazo (v2.0)**
- Migrar a PostgreSQL
- Agregar autenticación de usuario

**Largo plazo**
- Dividir en microservicios
- Agregar capa de caché (Redis)
```

### Paso 4: Verificar el Prisma Schema generado

**Por qué**

Verificar si el modelo de datos cumple con el PRD y si sigue las restricciones de compatibilidad de SQLite.

**Operación**

```bash
# Ver Prisma Schema
cat artifacts/backend/prisma/schema.prisma
```

**Lo que deberías ver**: Schema sintácticamente correcto según Prisma 5.x, que incluya definiciones completas de entidades y relaciones

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // Entorno de desarrollo
  url      = "file:./dev.db"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User     @relation(fields: [authorId], references: [id])
}
```


### Paso 5: Verificar condiciones de salida

**Por qué**

Sisyphus verificará si Tech Agent cumple con las condiciones de salida; si no se cumplen, se solicitará re-ejecución.

**Lista de verificación**

| Elemento | Descripción | Pasar/Fallar |
| ---- | ---- | ---- |
| Stack tecnológico declarado claramente | Backend, frontend y base de datos claramente definidos | [ ] |
| Modelo de datos consistente con PRD | Todas las entidades provienen del PRD, sin campos adicionales | [ ] |
| Sin optimización prematura o sobre-diseño | Cumple con el alcance de MVP, sin funciones no verificadas | [ ] |

**Si falla**:

```bash
# Re-ejecutar la fase Tech
factory run tech
```

## Punto de verificación ✅

**Confirma que has completado**:

- [ ] Fase Tech ejecutada con éxito
- [ ] Archivo `artifacts/tech/tech.md` existe con contenido completo
- [ ] Archivo `artifacts/backend/prisma/schema.prisma` existe con sintaxis correcta
- [ ] Selección de stack tecnológico razonable (Node.js + Express + Prisma)
- [ ] Modelo de datos consistente con PRD, sin campos adicionales
- [ ] Schema sigue restricciones de compatibilidad de SQLite (sin Composite Types)

## Advertencias de problemas comunes

### ⚠️ Trampa 1: Sobre-diseño

**Problema**: Introducir microservicios, cachés complejos o funciones avanzadas en la fase MVP.

**Síntomas**: `tech.md` contiene "arquitectura de microservicios", "caché Redis", "cola de mensajes", etc.

**Solución**: Tech Agent tiene una lista `NEVER` que prohíbe explícitamente el sobre-diseño. Si ves estos contenidos, re-ejecuta.

```markdown
## No hacer (NEVER)
* **NEVER** sobre-diseñar, como introducir microservicios, colas de mensajes complejas o cachés de alto rendimiento en la fase MVP
* **NEVER** escribir código redundante para escenarios aún no determinados
```

### ⚠️ Trampa 2: Error de compatibilidad con SQLite

**Problema**: Prisma Schema usa características no compatibles con SQLite.

**Síntomas**: Error en fase de Validación, o `npx prisma generate` falla.

**Errores comunes**:

```prisma
// ❌ Error - SQLite no soporta Composite Types
type UserProfile {
  identity String
  ageRange String
}

model User {
  profile UserProfile
}

// ❌ Error - se usó versión 7.x
{
  "prisma": "^7.0.0"
}
```

**Solución**: Verifica el Schema, asegúrate de usar String para almacenar JSON, bloquea la versión de Prisma a 5.x.

### ⚠️ Trampa 3: Modelo de datos fuera del alcance de MVP

**Problema**: Schema incluye entidades o campos no definidos en el PRD.

**Síntomas**: El número de entidades en `tech.md` es significativamente mayor que las entidades principales en el PRD.

**Solución**: Tech Agent está restringido a "el modelo de datos debe cubrir todas las entidades y relaciones necesarias para las funciones del MVP, no agregar campos no verificados por adelantado". Si se descubren campos adicionales, elimínalos o márcalos como "punto de extensión futura".

### ⚠️ Trampa 4: Error en diseño de relaciones

**Problema**: La definición de relaciones no coincide con la lógica comercial real.

**Síntomas**: Uno a muchos escrito como muchos a muchos, o faltan relaciones necesarias.

**Ejemplo de error**:

```prisma
// ❌ Error - usuario y artículo deberían ser uno a muchos, no uno a uno
model User {
  id   Int    @id @default(autoincrement())
  post Post?  // Relación uno a uno
}

model Post {
  id      Int    @id @default(autoincrement())
  author  User?  // Debería usar @relation
}
```

**Escritura correcta**:

```prisma
// ✅ Correcto - relación uno a muchos
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```


## Resumen de esta lección

La fase Tech es el puente entre "requisitos del producto" e "implementación de código" en la línea de producción. Diseña automáticamente basándose en PRD:

- **Stack tecnológico**: Node.js + Express + Prisma (backend), React Native + Expo (frontend)
- **Modelo de datos**: Prisma Schema que cumple con los requisitos de compatibilidad de SQLite
- **Diseño de arquitectura**: Estructura en capas (rutas → controladores → servicios → datos)
- **Definición de API**: Endpoints RESTful y flujo de datos

**Principios clave**:

1. **MVP primero**: Diseñar solo las funciones centrales necesarias, evitar el sobre-diseño
2. **Simplicidad primero**: Elegir un stack tecnológico maduro y estable
3. **Impulsado por datos**: Expresar entidades y relaciones a través de modelos de datos claros
4. **Escalabilidad**: Marcar puntos de extensión futura en la documentación, pero no implementarlos por adelantado

Al completar la fase Tech, obtendrás:

- ✅ Documentación de solución técnica completa (`tech.md`)
- ✅ Modelo de datos que cumple con la especificación de Prisma 5.x (`schema.prisma`)
- ✅ Diseño de API claro y configuración de entorno

## Próxima lección

> En la próxima lección aprenderemos **[Fase Code: Generación de código ejecutable](../stage-code/)**.
>
> Aprenderás:
> - Cómo Code Agent genera código de frontend y backend basándose en UI Schema y diseño Tech
> - Qué funciones incluye la aplicación generada (pruebas, documentación, CI/CD)
> - Cómo verificar la calidad del código generado
> - Requisitos especiales y especificaciones de salida de Code Agent

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-29

| Función | Ruta del archivo | Línea |
| ---- | ---- | ---- |
| Definición de Tech Agent | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 1-63 |
| Guía de habilidades Tech | [`source/hyz1992/agent-app-factory/skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) | 1-942 |
| Configuración de Pipeline | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 49-62 |
| Restricciones de compatibilidad de SQLite | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 28-56 |

**Restricciones clave**:
- **Prohibido usar Composite Types**: SQLite no lo admite, se debe usar String para almacenar JSON
- **Bloqueo de versión Prisma**: Se debe usar 5.x, no 7.x
- **Alcance de MVP**: El modelo de datos debe cubrir todas las entidades necesarias para las funciones del MVP, no agregar campos no verificados por adelantado

**Principios de decisión de stack tecnológico**:
- Priorizar lenguajes y frameworks con comunidad activa y documentación completa
- En la fase MVP, elegir base de datos ligera (SQLite), migrable a PostgreSQL más tarde
- El sistema en capas sigue capa de rutas → capa de lógica de negocio → capa de acceso a datos

**No hacer (NEVER)**:
- NEVER sobre-diseñar, como introducir microservicios, colas de mensajes complejas o cachés de alto rendimiento en la fase MVP
- NEVER elegir tecnologías de nicho o con mantenimiento deficiente
- NEVER agregar campos o relaciones no verificados por el producto en el modelo de datos
- NEVER incluir implementaciones de código específicas en la documentación técnica

</details>
