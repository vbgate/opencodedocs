---
title: "Démarrage rapide : Installation et Configuration | opencode-dynamic-context-pruning"
sidebarTitle: "Démarrage en 5 minutes"
subtitle: "Démarrage rapide : Installation et Configuration"
description: "Apprenez à installer et configurer le plugin OpenCode DCP. Installez le plugin en 5 minutes, découvrez les économies de Token et maîtrisez le système de configuration à trois niveaux."
order: 1
---

# Démarrage rapide

Ce chapitre vous aide à utiliser le plugin DCP à partir de zéro. Vous apprendrez à installer le plugin, à vérifier son efficacité et à personnaliser la configuration selon vos besoins.

## Contenu de ce chapitre

<div class="vp-card-container">

<a href="./getting-started/" class="vp-card">
  <h3>Installation et démarrage rapide</h3>
  <p>Installez le plugin DCP en 5 minutes et découvrez immédiatement les économies de Token. Apprenez à utiliser la commande /dcp pour surveiller les statistiques d'élagage.</p>
</a>

<a href="./configuration/" class="vp-card">
  <h3>Guide de configuration complet</h3>
  <p>Maîtrisez le système de configuration à trois niveaux (global, variables d'environnement, niveau projet), comprenez la priorité des configurations et ajustez les stratégies d'élagage et les mécanismes de protection selon vos besoins.</p>
</a>

</div>

## Parcours d'apprentissage

```
Installation et démarrage rapide → Guide de configuration complet
           ↓                              ↓
      Le plugin fonctionne         Vous savez comment l'ajuster
```

**Ordre recommandé** :

1. **D'abord compléter [Installation et démarrage rapide](./getting-started/)** : Assurez-vous que le plugin fonctionne correctement et découvrez les effets d'élagage par défaut
2. **Ensuite apprendre [Guide de configuration complet](./configuration/)** : Personnalisez les stratégies d'élagage selon les besoins de votre projet

::: tip Conseil pour les débutants
Si vous utilisez DCP pour la première fois, il est recommandé de l'utiliser avec la configuration par défaut pendant un certain temps, d'observer les effets d'élagage, puis d'ajuster la configuration.
:::

## Conditions préalables

Avant de commencer ce chapitre, veuillez confirmer :

- [x] **OpenCode** est installé (version supportant les fonctionnalités de plugin)
- [x] Vous connaissez la syntaxe de base **JSONC** (JSON avec support des commentaires)
- [x] Vous savez comment modifier les **fichiers de configuration OpenCode**

## Prochaines étapes

Après avoir terminé ce chapitre, vous pouvez continuer à apprendre :

- **[Détails des stratégies d'élagage automatique](../platforms/auto-pruning/)** : Comprendre en profondeur les principes de fonctionnement des trois stratégies : déduplication, écriture en remplacement et suppression des erreurs
- **[Outils d'élagage pilotés par LLM](../platforms/llm-tools/)** : Découvrez comment l'IA appelle activement les outils discard et extract pour optimiser le contexte
- **[Utilisation des commandes Slash](../platforms/commands/)** : Maîtrisez l'utilisation des commandes /dcp context, /dcp stats, /dcp sweep, etc.

<style>
.vp-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.vp-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.vp-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vp-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vp-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
