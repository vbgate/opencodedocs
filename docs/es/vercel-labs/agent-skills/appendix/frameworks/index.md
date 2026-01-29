---
title: "Marcos compatibles: 40+ soluciones | Agent Skills"
sidebarTitle: "Marcos"
subtitle: "Marcos compatibles: 40+ soluciones"
description: "Descubre los 40+ marcos compatibles con Vercel Deploy de Agent Skills. Cubre React, Vue, Svelte, Angular y principios de detección."
tags:
  - "Marcos"
  - "Implementación"
  - "Compatibilidad"
  - "Referencia"
prerequisite: []
---

# Lista de marcos compatibles

## Lo que podrás hacer al terminar

- Conocer la lista completa de marcos compatibles con Vercel Deploy (45+ tipos)
- Entender cómo funciona la detección de marcos
- Determinar si tu proyecto admite implementación con un clic
- Ver las reglas de prioridad de detección de marcos

## Tu situación actual

Deseas usar la función de implementación con un clic de Agent Skills, pero no estás seguro si el marco de tu proyecto es compatible, o quieres entender cómo funciona la lógica de detección.

## Idea central

La habilidad Vercel Deploy escanea el archivo `package.json` del proyecto, verifica las dependencias `dependencies` y `devDependencies`, y detecta los nombres de paquetes de características de marcos predefinidos para determinar el marco utilizado por el proyecto.

**Detección por orden de prioridad**: desde los marcos más específicos a los más generales, para evitar identificaciones incorrectas. Por ejemplo:
1. Detecta `next` → coincide con Next.js
2. Incluso si hay `react` al mismo tiempo, se identificará prioritariamente como Next.js

::: tip Alcance de detección

La detección verifica simultáneamente `dependencies` y `devDependencies`, por lo que incluso si el marco está instalado solo como dependencia de desarrollo, puede ser reconocido.

:::

## Lista completa de marcos

### Ecosistema React

| Marco | Dependencia de detección | Valor de retorno |
|------|---------|--------|
| **Next.js** | `next` | `nextjs` |
| **Gatsby** | `gatsby` | `gatsby` |
| **Remix** | `@remix-run/` | `remix` |
| **React Router** | `@react-router/` | `react-router` |
| **Blitz** | `blitz` | `blitzjs` |
| **Create React App** | `react-scripts` | `create-react-app` |
| **Ionic React** | `@ionic/react` | `ionic-react` |
| **Preact** | `preact` | `preact` |

### Ecosistema Vue

| Marco | Dependencia de detección | Valor de retorno |
|------|---------|--------|
| **Nuxt** | `nuxt` | `nuxtjs` |
| **VitePress** | `vitepress` | `vitepress` |
| **VuePress** | `vuepress` | `vuepress` |
| **Gridsome** | `gridsome` | `gridsome` |

### Ecosistema Svelte

| Marco | Dependencia de detección | Valor de retorno |
|------|---------|--------|
| **SvelteKit** | `@sveltejs/kit` | `sveltekit-1` |
| **Svelte** | `svelte` | `svelte` |
| **Sapper** (legacy) | `sapper` | `sapper` |

### Angular

| Marco | Dependencia de detección | Valor de retorno |
|------|---------|--------|
| **Angular** | `@angular/core` | `angular` |
| **Ionic Angular** | `@ionic/angular` | `ionic-angular` |

### Generadores de sitios estáticos

| Marco | Dependencia de detección | Valor de retorno |
|------|---------|--------|
| **Astro** | `astro` | `astro` |
| **Docusaurus** | `@docusaurus/core` | `docusaurus-2` |
| **Hexo** | `hexo` | `hexo` |
| **Eleventy** | `@11ty/eleventy` | `eleventy` |
| **RedwoodJS** | `@redwoodjs/` | `redwoodjs` |

### Marcos de back-end Node.js

| Marco | Dependencia de detección | Valor de retorno |
|------|---------|--------|
| **Express** | `express` | `express` |
| **NestJS** | `@nestjs/core` | `nestjs` |
| **Hono** | `hono` | `hono` |
| **Fastify** | `fastify` | `fastify` |
| **Elysia** | `elysia` | `elysia` |
| **h3** | `h3` | `h3` |
| **Nitro** | `nitropack` | `nitro` |

### Otros marcos

| Marco | Dependencia de detección | Valor de retorno |
|------|---------|--------|
| **SolidStart** | `@solidjs/start` | `solidstart-1` |
| **Ember** | `ember-cli`, `ember-source` | `ember` |
| **Dojo** | `@dojo/framework` | `dojo` |
| **Polymer** | `@polymer/` | `polymer` |
| **Stencil** | `@stencil/core` | `stencil` |
| **UmiJS** | `umi` | `umijs` |
| **Saber** | `saber` | `saber` |
| **Sanity** | `sanity`, `@sanity/` | `sanity` o `sanity-v3` |
| **Storybook** | `@storybook/` | `storybook` |
| **Hydrogen** (Shopify) | `@shopify/hydrogen` | `hydrogen` |
| **TanStack Start** | `@tanstack/start` | `tanstack-start` |

### Herramientas de compilación

| Marco | Dependencia de detección | Valor de retorno |
|------|---------|--------|
| **Vite** | `vite` | `vite` |
| **Parcel** | `parcel` | `parcel` |

### Proyectos HTML estáticos

Si tu proyecto **no tiene** `package.json` (sitio web puramente estático), la detección de marcos devolverá `null`.

El script de implementación manejará automáticamente:
- Detectar automáticamente archivos `.html` en el directorio raíz
- Si solo hay un archivo `.html` y no es `index.html`, se renombrará automáticamente a `index.html`
- Alojar directamente como sitio estático en Vercel

**Escenario de ejemplo**:
```bash
my-static-site/
└── demo.html  # Se renombrará automáticamente a index.html
```

## Principios de detección de marcos

### Flujo de detección

```
Leer package.json
    ↓
Escanear dependencies y devDependencies
    ↓
Coincidir con nombres de paquetes predefinidos por orden de prioridad
    ↓
Encontrar la primera coincidencia → devolver identificador de marco correspondiente
    ↓
Sin coincidencia → devolver null (proyecto HTML estático)
```

### Orden de detección

La detección se ordena por especificidad del marco, **priorizando coincidencias con marcos más específicos**:

```bash
# Ejemplo: proyecto Next.js
dependencies:
  next: ^14.0.0        # Coincide con → nextjs
  react: ^18.0.0       # Omite (ya hay coincidencia de mayor prioridad)
  react-dom: ^18.0.0
```

**Orden de detección parcial**:
1. Next.js, Gatsby, Remix, Blitz (marcos específicos)
2. SvelteKit, Nuxt, Astro (meta-marcos)
3. React, Vue, Svelte (bibliotecas base)
4. Vite, Parcel (herramientas de compilación generales)

### Reglas de detección

- **Verificar simultáneamente** `dependencies` y `devDependencies`
- **Coincidir uno por uno**, devolver al encontrar el primero
- **Coincidencia de nombre de paquete**: coincidencia exacta o por prefijo
  - Coincidencia exacta: `"next"` → Next.js
  - Coincidencia por prefijo: `"@remix-run/"` → Remix

```bash
# lógica de detección shell (versión simplificada)
has_dep() {
    echo "$content" | grep -q "\"$1\""
}

if has_dep "next"; then
    echo "nextjs"
fi
```

## Cómo verificar el marco de tu proyecto

### Método 1: Ver package.json

Abre el `package.json` de tu proyecto, busca los nombres de paquetes en la lista anterior en `dependencies` o `devDependencies`.

```json
{
  "dependencies": {
    "next": "^14.0.0",  ← Next.js
    "react": "^18.0.0"
  }
}
```

### Método 2: Intentar implementar

Usa directamente la función Vercel Deploy:

```
Implementar mi aplicación en Vercel
```

Claude generará el marco detectado:

```
Marco detectado: nextjs
```

### Método 3: Ejecutar manualmente el script de detección

Si quieres probar por adelantado, puedes ejecutar:

```bash
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh
```

Devolverá la información del marco detectado (stderr).

## Advertencias sobre problemas comunes

### Problema 1: Detección de marco inexacta

**Síntoma**:
```
Marco detectado: vite
# Pero esperabas nextjs
```

**Causa**: La detección sigue el orden de prioridad. Vite se detecta después de Next.js, pero si el proyecto tiene tanto `vite` como `next`, podría coincidir con Vite.

**Impacto**: Generalmente no afecta la implementación, Vercel detectará automáticamente la configuración.

**Solución**:
- Verificar las dependencias en `package.json`
- Si no afecta la implementación, puede ignorarse
- La implementación aún puede funcionar normalmente, solo que usa una configuración diferente

### Problema 2: El proyecto no está en la lista

**Síntoma**: El marco de tu proyecto no está en la lista anterior.

**Posibles causas**:
- Es un marco muy nuevo o poco común
- El marco usa un nombre de paquete diferente
- El script de implementación aún no ha añadido soporte

**Solución**:
1. Verificar si el proyecto usa herramientas de compilación generales como **Vite** o **Parcel**
2. Intentar implementar, Vercel puede reconocerlo automáticamente
3. Si es un proyecto HTML estático, implementa directamente
4. Enviar PR a [agent-skills](https://github.com/vercel-labs/agent-skills) para agregar soporte de marcos

### Problema 3: Proyecto con múltiples marcos

**Síntoma**: El proyecto usa múltiples marcos al mismo tiempo (como Remix + Storybook).

**Comportamiento de detección**: Devuelve el primer marco coincidente por prioridad.

**Impacto**: Generalmente no afecta la implementación, el marco principal se reconocerá correctamente.

## Preguntas frecuentes

### P: ¿Mi marco no está en la lista, puedo implementar?

R: Puedes intentar. Si el proyecto usa herramientas de compilación generales como Vite o Parcel, puede ser reconocido como esas herramientas. Vercel también intentará detectar automáticamente la configuración.

### P: ¿El error de detección afecta la implementación?

R: Generalmente no. Vercel tiene un potente mecanismo de detección automática, incluso si el identificador del marco no es preciso, puede compilarse e implementarse normalmente.

### P: ¿Cómo agregar soporte para nuevos marcos?

R: Modificar la función `detect_framework()` en `deploy.sh`, agregar nuevas reglas de detección, luego enviar PR a [agent-skills](https://github.com/vercel-labs/agent-skills).

### P: ¿Los proyectos HTML estáticos necesitan package.json?

R: No. Los proyectos HTML estáticos (sin compilación JavaScript) pueden implementarse directamente, el script manejará automáticamente.

## Resumen de esta lección

La función Vercel Deploy de Agent Skills admite **45+ marcos**, cubriendo la pila de tecnología de front-end principal:

**Valor central**:
- ✅ Amplio soporte de marcos, cobertura completa de React/Vue/Svelte/Angular
- ✅ Detección inteligente de marcos,识别 automática del tipo de proyecto
- ✅ Soporta proyectos HTML estáticos, implementación sin dependencias
- ✅ Código abierto, extensible para agregar nuevos marcos

**Principios de detección**:
- Escanear `package.json` de `dependencies` y `devDependencies`
- Coincidir con nombres de paquetes de características de marcos predefinidos por orden de prioridad
- Devolver el identificador de marco correspondiente para uso de Vercel

**Siguientes pasos**:
Ver [Tutorial de implementación con un clic en Vercel](../../platforms/vercel-deploy/) para aprender a usar esta función.

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-25

| Función        | Ruta de archivo                                                                                             | Número de línea    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ----------------- |
| Lógica de detección de marcos | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 11-156  |
| Entrada del script de implementación | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250   |
| Manejo de HTML estático | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |

**Funciones clave**:
- `detect_framework()`: detecta 45+ marcos desde package.json (líneas 11-156)
- `has_dep()`: verifica si la dependencia existe (líneas 23-25)

**Orden de detección de marcos** (parcial):
1. Blitz (blitzjs)
2. Next.js (nextjs)
3. Gatsby (gatsby)
4. Remix (remix)
5. React Router (react-router)
6. TanStack Start (tanstack-start)
7. Astro (astro)
8. Hydrogen (hydrogen)
9. SvelteKit (sveltekit-1)
10. Svelte (svelte)
... (lista completa en líneas 11-156)

**Valores de retorno de ejemplo**:
- Next.js: `nextjs`
- Nuxt: `nuxtjs`
- HTML estático: `null`

</details>
