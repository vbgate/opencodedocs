---
title: "Vercel Deploy : déploiement en un clic | Agent Skills"
sidebarTitle: "Vercel Deploy"
subtitle: "Vercel Deploy : déploiement en un clic sans authentification"
description: "Apprenez à déployer vos projets vers Vercel en un clic. Détection automatique de 40+ frameworks, déploiement sans authentification et liens de prévisualisation."
tags:
  - "Vercel"
  - "Déploiement"
  - "Déploiement en un clic"
  - "Frameworks frontend"
prerequisite:
  - "start-installation"
---

# Déploiement en un clic Vercel : publication rapide d'application sans authentification

## Ce que vous pourrez faire après ce cours

- Laissez Claude déployer votre projet vers Vercel en une phrase, sans configuration manuelle
- Obtenir des liens de prévisualiation accessibles et des liens de transfert de propriété
- Détecter automatiquement le framework du projet (Next.js, React, Vue, Svelte, etc. 40+)
- Gérer les sites Web HTML statiques, supportant le renommage de fichiers uniques

## Votre problème actuel

Chaque fois que vous souhaitez partager votre projet avec d'autres, vous devez :

1. Connecter manuellement au site Web Vercel
2. Créer un nouveau projet
3. Connecter un dépôt Git
4. Attendre la fin de la construction
5. Mémoriser une longue URL à partager

Si vous souhaitez simplement afficher rapidement un demo ou un prototype, ces étapes sont trop fastidieuses.

## Quand utiliser cette technique

Convient aux scénarios suivants :

- 🚀 Créer rapidement une prévisualiation de projet à partager avec l'équipe
- 📦 Afficher un demo aux clients ou amis
- 🔄 Générer automatiquement des déploiements de prévisualiation dans CI/CD
- 🌐 Déployer des pages HTML statiques ou des applications monopages

## L'idée centrale

Le flux de travail de la compétence Vercel Deploy est très simple :

```
Votre parole → Claude détecte les mots-clés → active la compétence de déploiement
    ↓
          Détecte le type de framework (depuis package.json)
    ↓
          Empaquette le projet (exclut node_modules et .git)
    ↓
          Téléverse vers l'API Vercel
    ↓
          Renvoie deux liens (prévisualiation + transfert de propriété)
```

**Pourquoi deux liens ?**

- **URL de prévisualiation** : adresse de prévisualiation immédiatement accessible
- **URL de claim** : transférer ce déploiement vers votre compte Vercel

Le bénéfice de cette conception : le déploieur (Agent) n'a pas besoin de vos autorisations de compte, et vous pouvez obtenir la propriété ultérieurement via l'URL de claim.

## 🎒 Avant de commencer

::: warning Vérification préalable

- ✅ Avoir complété l'[Installation d'Agent Skills](../installation/)
- ✅ Structure de répertoire de projet complète (avec `package.json` ou projet HTML statique)
- ✅ Autorisations réseau claude.ai configurées (si vous utilisez claude.ai)

:::

::: info Rappel des autorisations réseau

Si vous utilisez **claude.ai** (version en ligne), vous devez permettre l'accès au domaine `*.vercel.com` :

1. Visiter [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Ajouter `*.vercel.com` à la liste blanche
3. Enregistrer les paramètres et réessayer

Si votre déploiement échoue avec une erreur réseau, vérifiez ce paramètre.

:::

## Suivez-moi

### Étape 1 : changer vers le répertoire du projet

```bash
# Entrer dans le répertoire de votre projet
cd /path/to/your/project
```

**Pourquoi**
Le script de déploiement doit trouver `package.json` et les fichiers source du projet, la localisation du répertoire est importante.

### Étape 2 : dire à Claude de déployer

Dans la conversation Claude, saisissez :

```
Deploy my app to Vercel
```

Vous pouvez aussi essayer ces mots déclencheurs :

- "Deploy this to production"
- "Deploy and give me the link"
- "Push this live"
- "Create a preview deployment"

### Étape 3 : observer le processus de déploiement

Vous verrez une sortie similaire :

```
Preparing deployment...
Detected framework: nextjs
Creating deployment package...
Deploying...
✓ Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...

View your site at the Preview URL.
To transfer this deployment to your Vercel account, visit the Claim URL.
```

Simultanément, Claude affichera également le format JSON (pratique pour l'analyse par script) :

```json
{
  "previewUrl": "https://skill-deploy-abc123.vercel.app",
  "claimUrl": "https://vercel.com/claim-deployment?code=...",
  "deploymentId": "dpl_...",
  "projectId": "prj_..."
}
```

**Vous devriez voir** :
- Message de succès du déploiement ✓
- Deux URL (preview et claim)
- Si c'est un projet de code, le nom du framework détecté sera également affiché

### Étape 4 : accéder au lien de prévisualiation

**Cliquez sur l'URL de prévisualiation**, vous verrez le site en ligne !

Si c'est un demo ou une affichage temporaire, la tâche est terminée.

### Étape 5 : (optionnel) transférer la propriété

Si vous souhaitez gérer ce déploiement à long terme :

1. Cliquez sur **l'URL de claim**
2. Connectez-vous à votre compte Vercel
3. Confirmez le transfert
4. Le déploiement appartient maintenant à votre compte, vous pouvez continuer à éditer et gérer

**Vous devriez voir** :
- Le déploiement apparaît sous votre compte Vercel
- Vous pouvez consulter les journaux, redéployer, etc. dans le tableau de bord Vercel

## Point de contrôle ✅

Après le déploiement, confirmez :

- [ ] L'URL de prévisualiation est accessible dans le navigateur
- [ ] La page s'affiche normalement (sans 404 ni erreur de construction)
- [ ] Si c'est un projet de code, la détection de framework est correcte (Next.js, Vite, etc.)
- [ ] Si une gestion à long terme est nécessaire, le transfert de propriété a été effectué via l'URL de claim

## Frameworks supportés

La compétence Vercel Deploy peut détecter automatiquement **40+ frameworks** :

| Catégorie | Frameworks (exemples partiels) |
|--- | ---|
| **React** | Next.js, Gatsby, Create React App, Remix |
| **Vue** | Nuxt, Vitepress, Vuepress |
| **Svelte** | SvelteKit, Svelte |
| **Angular** | Angular, Ionic Angular |
| **Backend Node.js** | Express, Hono, Fastify, NestJS |
| **Outils de construction** | Vite, Parcel |
| **Autres** | Astro, Solid Start, Ember, Astro, Hexo, Eleventy |

::: tip Principe de détection des frameworks

Le script lit votre `package.json` et vérifie les noms de packages dans `dependencies` et `devDependencies`.

Si plusieurs correspondances existent, le script choisira le framework le plus spécifique selon la priorité (par exemple, Next.js a priorité sur React générique).

:::

## Projets HTML statiques

Si votre projet **n'a pas** `package.json` (site Web purement statique), la compétence de déploiement le gère intelligemment :

- **Détection automatique** : identifier les fichiers `.html` dans le répertoire racine
- **Renommage** : s'il n'y a qu'un seul fichier `.html` et que ce n'est pas `index.html`, le renommer automatiquement en `index.html`
- **Déploiement direct** : héberger comme site statique vers Vercel

**Scénario d'exemple** :
```bash
my-static-site/
└── demo.html  # sera automatiquement renommé en index.html
```

Après déploiement, l'accès au lien de prévisualiation affichera le contenu de `demo.html`.

## Résumé de ce cours

La compétence Vercel Deploy simplifie le déploiement comme jamais auparavant :

**Valeur centrale** :
- ✅ Déploiement en une phrase, sans configuration manuelle
- ✅ Détection automatique de framework, supporte 40+ stacks technologiques
- ✅ Déploiement sans authentification, haute sécurité
- ✅ Renvoie le lien de prévisualiation + le lien de transfert de propriété

**Scénarios d'utilisation** :
- 🚀 Partager rapidement des demos ou prototypes
- 📦 Prévisualiation interne équipe
- 🔄 Flux de travail CI/CD automatisé
- 🌐 Hébergement de sites Web statiques

## Aperçu du cours suivant

> Dans le cours suivant, nous apprendrons **[Meilleures pratiques d'optimisation des performances React/Next.js](../react-best-practices/)**.
>
> Vous apprendrez :
> - 57 règles d'optimisation des performances React
> - Comment éliminer les cascades et optimiser la taille des bundles
> - Comment l'agent vérifie automatiquement le code et fournit des suggestions de correction

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour :2026-01-25

| Fonctionnalité | Chemin de fichier | Ligne |
|--- | --- | ---|
| Entrée du script de déploiement | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250 |
| Logique de détection de framework | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156 |
| Empaquetage et téléversement vers l'API | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 208-222 |
| Renommage HTML statique | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |
| Document de définition de compétence | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 1-113 |
| Dépannage d'erreur réseau | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 102-112 |

**Constantes clés** :
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"` : point de terminaison API de déploiement Vercel

**Fonctions clés** :
- `detect_framework()` : détecte 40+ frameworks depuis package.json

**Détection des frameworks supportés** (classés par priorité) :
- React : Next.js, Gatsby, Remix, React Router
- Vue : Nuxt, Vitepress, Vuepress
- Svelte : SvelteKit, Svelte
- Autres : Astro, Angular, Express, Hono, Vite, Parcel, etc.

</details>
