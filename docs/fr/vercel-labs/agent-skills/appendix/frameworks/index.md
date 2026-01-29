---
title: "Frameworks supportés : 40+ solutions | Agent Skills"
sidebarTitle: "Frameworks"
subtitle: "Liste des frameworks supportés"
description: "Consultez la liste des 40+ frameworks supportés par Vercel Deploy. Couvre React, Vue, Svelte, Angular et les générateurs de sites statiques avec les principes de détection."
tags:
  - "Frameworks"
  - "Déploiement"
  - "Compatibilité"
  - "Référence"
prerequisite: []
---

# Liste des frameworks supportés

## Ce que vous pourrez faire après ce cours

- Comprendre la liste complète des frameworks supportés par la compétence Vercel Deploy (45+)
- Comprendre le principe de fonctionnement de la détection de frameworks
- Juger si votre projet supporte le déploiement en un clic
- Voir les règles de priorité de la détection de frameworks

## Votre problème actuel

Vous souhaitez utiliser la fonctionnalité de déploiement en un clic d'Agent Skills, mais vous n'êtes pas sûr si votre framework de projet est supporté, ou vous souhaitez comprendre comment fonctionne la logique de détection.

## L'idée centrale

La compétence Vercel Deploy détecte les frameworks en scannant les fichiers `package.json` du projet, en vérifiant les `dependencies` et `devDependencies` des noms de packages prédéfinis, pour juger le framework utilisé par le projet.

**La détection suit l'ordre de priorité** : du framework le plus spécifique au plus générique, pour éviter les erreurs de jugement. Par exemple :
1. Détecter `next` → correspond à Next.js
2. Même si `react` est présent, il sera prioritairement identifié comme Next.js

::: tip Portée de détection

La détection vérifie simultanément `dependencies` et `devDependencies`, donc même si le framework n'est installé que comme dépendance de développement, il peut être reconnu.

:::

## Liste complète des frameworks

### Écosystème React

| Framework | Dépendance de détection | Valeur renvoyée |
|------|---------|--------|
| **Next.js** | `next` | `nextjs` |
| **Gatsby** | `gatsby` | `gatsby` |
| **Remix** | `@remix-run/` | `remix` |
| **React Router** | `@react-router/` | `react-router` |
| **Blitz** | `blitz` | `blitzjs` |
| **Create React App** | `react-scripts` | `create-react-app` |
| **Ionic React** | `@ionic/react` | `ionic-react` |
| **Preact** | `preact` | `preact` |

### Écosystème Vue

| Framework | Dépendance de détection | Valeur renvoyée |
|------|---------|--------|
| **Nuxt** | `nuxt` | `nuxtjs` |
| **VitePress** | `vitepress` | `vitepress` |
| **VuePress** | `vuepress` | `vuepress` |
| **Gridsome** | `gridsome` | `gridsome` |

### Écosystème Svelte

| Framework | Dépendance de détection | Valeur renvoyée |
|------|---------|--------|
| **SvelteKit** | `@sveltejs/kit` | `sveltekit-1` |
| **Svelte** | `svelte` | `svelte` |
| **Sapper** (legacy) | `sapper` | `sapper` |

### Angular

| Framework | Dépendance de détection | Valeur renvoyée |
|------|---------|--------|
| **Angular** | `@angular/core` | `angular` |
| **Ionic Angular** | `@ionic/angular` | `ionic-angular` |

### Générateurs de sites statiques

| Framework | Dépendance de détection | Valeur renvoyée |
|------|---------|--------|
| **Astro** | `astro` | `astro` |
| **Docusaurus** | `@docusaurus/core` | `docusaurus-2` |
| **Hexo** | `hexo` | `hexo` |
| **Eleventy** | `@11ty/eleventy` | `eleventy` |
| **RedwoodJS** | `@redwoodjs/` | `redwoodjs` |

### Frameworks backend Node.js

| Framework | Dépendance de détection | Valeur renvoyée |
|------|---------|--------|
| **Express** | `express` | `express` |
| **NestJS** | `@nestjs/core` | `nestjs` |
| **Hono** | `hono` | `hono` |
| **Fastify** | `fastify` | `fastify` |
| **Elysia** | `elysia` | `elysia` |
| **h3** | `h3` | `h3` |
| **Nitro** | `nitropack` | `nitro` |

### Autres frameworks

| Framework | Dépendance de détection | Valeur renvoyée |
|------|---------|--------|
| **SolidStart** | `@solidjs/start` | `solidstart-1` |
| **Ember** | `ember-cli`, `ember-source` | `ember` |
| **Dojo** | `@dojo/framework` | `dojo` |
| **Polymer** | `@polymer/` | `polymer` |
| **Stencil** | `@stencil/core` | `stencil` |
| **UmiJS** | `umi` | `umijs` |
| **Saber** | `saber` | `saber` |
| **Sanity** | `sanity`, `@sanity/` | `sanity` ou `sanity-v3` |
| **Storybook** | `@storybook/` | `storybook` |
| **Hydrogen** (Shopify) | `@shopify/hydrogen` | `hydrogen` |
| **TanStack Start** | `@tanstack/start` | `tanstack-start` |

### Outils de construction

| Framework | Dépendance de détection | Valeur renvoyée |
|------|---------|--------|
| **Vite** | `vite` | `vite` |
| **Parcel** | `parcel` | `parcel` |

### Projets HTML statiques

Si votre projet **n'a pas** `package.json` (site Web purement statique), la détection de framework renverra `null`.

Le script de déploiement le gérera intelligemment :
- Détecter automatiquement les fichiers `.html` dans le répertoire racine
- S'il n'y a qu'un seul fichier `.html` et que ce n'est pas `index.html`, il sera automatiquement renommé en `index.html`
- Héberger directement comme site statique vers Vercel

**Scénario d'exemple** :
```bash
my-static-site/
└── demo.html  # sera automatiquement renommé en index.html
```

## Principe de détection des frameworks

### Flux de détection

```
Lire package.json
    ↓
Scanner dependencies et devDependencies
    ↓
Faire correspondre les noms de packages prédéfinis par ordre de priorité
    ↓
Trouver la première correspondance → renvoyer l'identifiant de framework correspondant
    ↓
Aucune correspondance trouvée → renvoyer null (projet HTML statique)
```

### Ordre de détection

La détection est classée selon le degré de spécificité du framework, **priorisant la correspondance avec les frameworks plus spécifiques** :

```bash
# Exemple : projet Next.js
dependencies:
  next: ^14.0.0        # correspond à → nextjs
  react: ^18.0.0       # sauté (déjà une correspondance de priorité supérieure)
  react-dom: ^18.0.0
```

**Ordre partiel de détection** :
1. Next.js, Gatsby, Remix, Blitz (frameworks spécifiques)
2. SvelteKit, Nuxt, Astro (meta-frameworks)
3. React, Vue, Svelte (bibliothèques de base)
4. Vite, Parcel (outils de construction génériques)

---

## Résumé de ce cours

La fonctionnalité Vercel Deploy d'Agent Skills supporte **45+ frameworks**, couvrant les principaux stacks technologiques frontend :

**Valeur centrale** :
- ✅ Support large de frameworks, couverture complète React/Vue/Svelte/Angular
- ✅ Détection intelligente de frameworks, identification automatique du type de projet
- ✅ Support des projets HTML statiques, déploiement sans dépendance
- ✅ Open source, extensible pour ajouter de nouveaux frameworks

**Principe de détection** :
- Scanner les `dependencies` et `devDependencies` de package.json
- Faire correspondre les noms de packages de framework prédéfinis par ordre de priorité
- Renvoyer l'identifiant de framework correspondant pour l'utilisation par Vercel

**Étape suivante** :
Voir le tutoriel [Déploiement en un clic Vercel](../../platforms/vercel-deploy/) pour apprendre à utiliser cette fonctionnalité.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour :2026-01-25

| Fonctionnalité | Chemin de fichier | Ligne |
| ----------- | -------------------------------------------- | ----- |
| Logique de détection de frameworks | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 11-156 |
| Entrée du script de déploiement | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250 |
| Gestion HTML statique | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |

**Fonctions clés** :
- `detect_framework()` : détecter 45+ frameworks depuis package.json (lignes 11-156)
- `has_dep()` : vérifier si une dépendance existe (lignes 23-25)

**Ordre de détection de frameworks** (partiel) :
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
... (liste complète voir lignes 11-156)

**Exemples de valeurs renvoyées** :
- Next.js: `nextjs`
- Nuxt: `nuxtjs`
- HTML statique: `null`

</details>
