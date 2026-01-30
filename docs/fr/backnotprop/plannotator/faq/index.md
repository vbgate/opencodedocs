---
title: "FAQ : Résoudre les Problèmes d'Utilisation | opencode-plannotator"
sidebarTitle: "Que faire en cas de problème"
subtitle: "FAQ : Résoudre les Problèmes d'Utilisation"
description: "Apprenez à résoudre les problèmes courants de Plannotator. Maîtrisez les techniques de diagnostic rapide pour les problèmes de port occupé, navigateur non ouvert, échec d'intégration, etc."
order: 4
---

# FAQ

Ce chapitre vous aide à résoudre divers problèmes rencontrés lors de l'utilisation de Plannotator. Qu'il s'agisse de ports occupés, de navigateurs non ouverts ou d'échecs d'intégration, vous trouverez ici les solutions correspondantes et les techniques de débogage.

## Contenu du Chapitre

<div class="grid-cards">

<a href="./common-problems/" class="card">
  <h3>🔧 Problèmes Courants</h3>
  <p>Résolvez les problèmes fréquents rencontrés lors de l'utilisation, notamment les ports occupés, navigateurs non ouverts, plans non affichés, erreurs Git, échecs de téléchargement d'images, problèmes d'intégration Obsidian/Bear, etc.</p>
</a>

<a href="./troubleshooting/" class="card">
  <h3>🔍 Diagnostic</h3>
  <p>Maîtrisez les méthodes de base de diagnostic, notamment la consultation des journaux, la gestion des erreurs et les techniques de débogage. Apprenez à localiser rapidement la source des problèmes via les sorties de journal.</p>
</a>

</div>

## Parcours d'Apprentissage

```
Problèmes Courants → Diagnostic
       ↓              ↓
   Résolution Rapide  Débogage Approfondi
```

**Ordre recommandé** :

1. **Consultez d'abord les Problèmes Courants** : La plupart des problèmes trouvent une solution ici
2. **Ensuite, apprenez le Diagnostic** : Si les problèmes courants ne couvrent pas votre cas, apprenez à diagnostiquer par vous-même via les journaux et les techniques de débogage

::: tip Recommandations en cas de problème
Recherchez d'abord des mots-clés dans « Problèmes Courants » (comme "port", "navigateur", "Obsidian") pour trouver la solution correspondante. Si le problème est complexe ou non listé, référez-vous à « Diagnostic » pour apprendre les méthodes de débogage.
:::

## Conditions Préalables

Avant d'étudier ce chapitre, il est recommandé d'avoir terminé :

- ✅ [Démarrage Rapide](../start/getting-started/) - Comprendre les concepts de base de Plannotator
- ✅ Installé Claude Code ou le plugin OpenCode (au choix) :
  - [Installer le plugin Claude Code](../start/installation-claude-code/)
  - [Installer le plugin OpenCode](../start/installation-opencode/)

## Étapes Suivantes

Après avoir terminé ce chapitre, vous pouvez continuer à apprendre :

- [Référence API](../appendix/api-reference/) - Comprendre tous les points de terminaison API et les formats de requête/réponse
- [Modèles de Données](../appendix/data-models/) - Comprendre les structures de données utilisées par Plannotator
- [Configuration des Variables d'Environnement](../advanced/environment-variables/) - Approfondir toutes les variables d'environnement disponibles

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dark .grid-cards .card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
