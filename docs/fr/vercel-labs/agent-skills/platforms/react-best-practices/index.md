---
title: "Optimisation React : 57 règles Vercel | Agent Skills"
sidebarTitle: "Optimisation React"
subtitle: "Meilleures pratiques d'optimisation des performances React/Next.js"
description: "Apprenez à optimiser React/Next.js avec les 57 règles Vercel. Éliminez les cascades, optimisez les bundles et réduisez les re-renders."
tags:
  - "React"
  - "Next.js"
  - "Optimisation des performances"
  - "Audition de code"
prerequisite:
  - "start-getting-started"
---

# Meilleures pratiques d'optimisation des performances React/Next.js

## Ce que vous pourrez faire après ce cours

- 🎯 Laissez l'IA détecter automatiquement les problèmes de performance du code React et fournir des suggestions d'optimisation
- ⚡ Éliminer les cascades, accélérer le chargement des pages 2-10 fois
- 📦 Optimiser la taille des bundles, réduire le temps de chargement initial
- 🔄 Réduire les re-renders, améliorer la vitesse de réponse de la page
- 🏗️ Appliquer les meilleures pratiques de production de l'équipe d'ingénierie Vercel

## Votre problème actuel

Vous avez écrit du code React, mais vous sentez que quelque chose ne va pas :

- Les pages se chargent lentement, vous ne voyez pas de problème dans Developer Tools
- Le code généré par l'IA fonctionne, mais vous ne savez pas s'il respecte les meilleures pratiques de performance
- Vous voyez les applications Next.js des autres rapides, alors que la vôtre est lente
- Vous connaissez quelques techniques d'optimisation (comme `useMemo`, `useCallback`), mais vous ne savez pas quand les utiliser
- Chaque audition de code nécessite une vérification manuelle des problèmes de performance, ce qui est inefficace

En réalité, l'équipe d'ingénierie Vercel a résumé un ensemble de **57 règles** de performance éprouvées, couvrant tous les scénarios de « élimination des cascades » aux « modes avancés ». Maintenant, ces règles ont été empaquetées dans Agent Skills, et vous pouvez laisser l'IA vérifier et optimiser votre code automatiquement.

::: info Qu'est-ce qu'« Agent Skills »
Agent Skills est un pack de compétences extensibles pour les agents d'encodage IA (comme Claude, Cursor, Copilot). Une fois installé, l'IA appliquera automatiquement ces règles dans les tâches pertinentes, comme si vous équipiez l'IA avec le cerveau d'un ingénieur Vercel.
:::

## Quand utiliser cette technique

Scénarios typiques d'utilisation des compétences de meilleures pratiques React :

- ❌ **Non adapté** : pages statiques simples, composants sans interactions complexes
- ✅ **Adapté** :
  - Écriture de nouveaux composants React ou pages Next.js
  - Implémentation de la récupération de données côté client ou serveur
  - Audition ou refactoring de code existant
  - Optimisation de la taille des bundles ou des temps de chargement
  - Les utilisateurs se plaignent de lenteur de la page

## 🎒 Avant de commencer

::: warning Vérification préalable
Avant de commencer, assurez-vous de :
1. Avoir installé Agent Skills (voir [Guide d'installation](../../start/installation/))
2. Comprendre les fondamentaux de React et Next.js
3. Avoir un projet React/Next.js à optimiser
:::

## L'idée centrale

L'optimisation des performances React ne consiste pas seulement à utiliser quelques hooks, mais à résoudre les problèmes au **niveau architecture**. Les 57 règles de Vercel sont classées en 8 catégories par priorité :

| Priorité | Catégorie | Focus | Bénéfice typique |
| ------ | ---- | ---- | ---- |
| **CRITICAL** | Élimination des cascades | Éviter les opérations async sérielles | 2-10× amélioration |
| **CRITICAL** | Optimisation des bundles | Réduire la taille du bundle initial | Amélioration significative TTI/LCP |
| **HIGH** | Performance serveur | Optimiser la récupération de données et le cache | Réduire la charge serveur |
| **MEDIUM-HIGH** | Récupération de données client | Éviter les requêtes dupliquées | Réduire le trafic réseau |
| **MEDIUM** | Optimisation des re-renders | Réduire les re-renders inutiles | Améliorer la vitesse de réponse interactionnelle |
| **MEDIUM** | Performance de rendu | Optimiser l'exécution CSS et JS | Améliorer le frame rate |
| **LOW-MEDIUM** | Performance JavaScript | Micro-optimiser l'exécution du code | 5-20% amélioration |
| **LOW** | Modes avancés | Optimiser des scénarios spéciaux | Cas limites |

**Principes clés** :
1. **Prioriser les problèmes de niveau CRITICAL et HIGH** - ces modifications offrent le plus grand bénéfice
2. **Commencer par le flux de données** - optimiser d'abord les opérations asynchrones et la récupération de données
3. **Puis optimiser le rendu** - considérer enfin `useMemo`, `useCallback`, etc.

## Suivez-moi

### Étape 1 : déclencher l'audit de performance IA

Ouvrez votre projet React/Next.js, dans Claude ou Cursor, saisissez :

```
Review this React component for performance issues
```

Ou

```
Apply React best practices to optimize this code
```

**Vous devriez voir** : L'IA activera la compétence `vercel-react-best-practices` et commencera à appliquer les règles pour vérifier le code.

### Étape 2 : détection automatique des problèmes par l'IA

L'IA vérifiera le code ligne par ligne, détectera les problèmes et fournira des suggestions de correction. Par exemple :

```typescript
// ❌ Votre code original (problème présent)
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <div>...</div>
}
```

**Feedback de l'IA** :
```
⚠️ async-parallel : 3 requêtes indépendantes exécutées en série, causant une cascade
Impact : CRITICAL (amélioration 2-10×)

Suggestion :
Utilisez Promise.all() pour exécuter en parallèle les requêtes indépendantes, réduisant les 3 allers-retours réseau à 1.
```

**Code d'optimisation fourni par l'IA** :
```typescript
// ✅ Optimisé (récupération en parallèle)
async function UserProfile({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId),
  ])

  return <div>...</div>
}
```

### Étape 3 : exemples de problèmes courants

Voici quelques problèmes de performance typiques et leurs solutions :

#### Problème 1 : composant volumineux causant un bundle initial trop grand

```typescript
// ❌ Incorrect : l'éditeur Monaco se charge avec le bundle principal (~300KB)
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

```typescript
// ✅ Correct : importation dynamique, chargement à la demande
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Règle** : `bundle-dynamic-imports` (CRITICAL)

#### Problème 2 : re-renders inutiles

```typescript
// ❌ Incorrect : chaque mise à jour du composant parent re-rend ExpensiveList
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

```typescript
// ✅ Correct : envelopper avec React.memo, éviter les re-renders inutiles
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  // ...
})

function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

**Règle** : `rerender-memo` (MEDIUM)

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vérifiez si vous avez maîtrisé :

- [ ] Savoir comment déclencher l'audit de performance React par l'IA
- [ ] Comprendre l'importance d'« éliminer les cascades » (niveau CRITICAL)
- [ ] Savoir quand utiliser `Promise.all()` pour les requêtes en parallèle
- [ ] Comprendre le rôle de l'importation dynamique (`next/dynamic`)
- [ ] Savoir comment réduire les re-renders inutiles
- [ ] Comprendre le rôle de React.cache côté serveur
- [ ] Être capable d'identifier les problèmes de performance dans le code

## Mises en garde

### Erreur 1 : sur-optimisation

::: warning Ne pas optimiser trop tôt
Optimisez uniquement lorsqu'il existe des problèmes de performance réels. L'utilisation prématurée de `useMemo`, `useCallback` peut rendre le code plus difficile à lire et peut avoir des bénéfices négatifs.

**Rappelez-vous** :
- Mesurez d'abord avec React DevTools Profiler
- Priorisez les problèmes de niveau CRITICAL et HIGH
- N'utilisez `useMemo` que lorsque « le coût de calcul lors du rendu est élevé »
:::

## Résumé de ce cours

Principes clés de l'optimisation des performances React :

1. **Éliminer les cascades** : pour les opérations indépendantes, utiliser `Promise.all()` pour l'exécution en parallèle
2. **Réduire la taille des bundles** : pour les composants volumineux, utiliser l'importation dynamique `next/dynamic`
3. **Réduire les re-renders** : envelopper les composants purs avec `React.memo`, éviter les Effects inutiles
4. **Prioriser l'optimisation serveur** : `React.cache` et la récupération en parallèle de Next.js offrent les plus grands bénéfices
5. **Automatiser l'audit avec l'IA** : laissez Agent Skills découvrir et résoudre les problèmes

Les 57 règles de Vercel couvrent tous les scénarios, de l'architecture aux micro-optimisations. Apprendre à déclencher l'application de ces règles par l'IA améliorera considérablement la qualité de votre code.

## Aperçu du cours suivant

Ensuite, nous apprendrons **[Audit des directives de conception Web](../web-design-guidelines/)**.

Vous apprendrez :
- Comment auditer l'accessibilité (a11y) avec 100+ règles
- Vérifier les performances d'animation et les états de focus
- Auditer la validation de formulaires et le support du mode sombre

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour :2026-01-25

| Fonctionnalité | Chemin de fichier | Ligne |
| ---- | -------- | ---- |
| Définition de la compétence Meilleures pratiques React | [`skills/react-best-practices/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | Tout |
| Documentation complète des règles | [`skills/react-best-practices/AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md) | Tout |
| 57 fichiers de règles | [`skills/react-best-practices/rules/*.md`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules) | - |
| Modèle de règles | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | Tout |
| Métadonnées | [`skills/react-best-practices/metadata.json`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/metadata.json) | Tout |
| Aperçu README | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md) | 9-27 |

**Fichiers clés (exemples de règles de niveau CRITICAL)** :

| Règle | Chemin de fichier | Description |
| ---- | -------- | ---- |
| Requêtes en parallèle Promise.all() | [`async-parallel.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md) | Éliminer les cascades |
| Importations dynamiques de composants volumineux | [`bundle-dynamic-imports.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md) | Réduire la taille des bundles |
| Defer await | [`async-defer-await.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md) | Différer l'exécution d'opérations asynchrones |

**Constantes clés** :
- `version = "1.0.0"` : numéro de version de la base de règles (metadata.json)
- `organization = "Vercel Engineering"` : organisation de maintenance

**8 catégories de règles** :
- `async-` (élimination des cascades, 5 règles, CRITICAL)
- `bundle-` (optimisation des bundles, 5 règles, CRITICAL)
- `server-` (performance serveur, 7 règles, HIGH)
- `client-` (récupération de données client, 4 règles, MEDIUM-HIGH)
- `rerender-` (optimisation des re-renders, 12 règles, MEDIUM)
- `rendering-` (performance de rendu, 9 règles, MEDIUM)
- `js-` (performance JavaScript, 12 règles, LOW-MEDIUM)
- `advanced-` (modes avancés, 3 règles, LOW)

</details>
