---
title: "Annexe : Détails techniques et limitations | opencode-md-table-formatter"
sidebarTitle: "Comprendre les limitations et principes"
subtitle: "Annexe : Détails techniques et limitations"
description: "Découvrez les limites techniques et les stratégies d'optimisation des performances de opencode-md-table-formatter. Comprenez les limitations connues, le mécanisme de cache et les détails de conception."
tags:
  - "Annexe"
  - "Limitations connues"
  - "Détails techniques"
prerequisite:
  - "start-features"
order: 4
---

# Annexe : Détails techniques et limitations

Cette section contient la documentation de référence et les détails techniques du plugin, vous aidant à comprendre en profondeur la conception, les limites et les stratégies d'optimisation des performances.

::: info Ce que vous apprendrez
- Comprendre les limitations connues et les scénarios d'utilisation du plugin
- Maîtriser le mécanisme de cache et les stratégies d'optimisation des performances
- Comprendre les limites techniques et les compromis de conception
:::

## Contenu de cette section

### 📚 [Limitations connues : Quelles sont les frontières du plugin](./limitations/)

Découvrez les fonctionnalités non prises en charge et les limitations techniques du plugin, pour éviter de l'utiliser dans des scénarios non supportés. Inclut :
- Pas de prise en charge des tableaux HTML, des cellules multilignes, des tableaux sans lignes de séparation
- Pas de fusion de cellules ni d'options de configuration
- Performances non vérifiées pour les très grands tableaux

**Public cible** : Utilisateurs souhaitant savoir ce que le plugin peut et ne peut pas faire

### 🔧 [Détails techniques : Mécanisme de cache et optimisation des performances](./tech-details/)

Comprenez en profondeur l'implémentation interne du plugin, y compris le mécanisme de cache, les stratégies d'optimisation des performances et la structure du code. Inclut :
- Structure de données widthCache et processus de recherche dans le cache
- Mécanisme de nettoyage automatique et seuils de cache
- Analyse des effets d'optimisation des performances

**Public cible** : Développeurs intéressés par les principes d'implémentation du plugin

## Recommandations de parcours d'apprentissage

Les deux sous-pages de cette section sont relativement indépendantes et peuvent être lues selon vos besoins :

1. **Utilisateurs rapides** : Il est recommandé de lire d'abord « Limitations connues », puis de s'arrêter après avoir compris les frontières du plugin
2. **Apprenants approfondis** : Lire dans l'ordre → « Limitations connues » → « Détails techniques »
3. **Développeurs** : Lecture complète recommandée, utile pour comprendre la conception du plugin et les extensions futures

## Conditions préalables

::: warning Préparation avant l'apprentissage

Avant de commencer cette section, il est recommandé d'avoir terminé :
- [ ] [Aperçu des fonctionnalités : La magie du formatage automatique](../../start/features/) - Comprendre les fonctionnalités principales du plugin

Cela vous permettra de mieux comprendre les détails techniques et les limitations de cette section.
:::

## Prochaines étapes

Après avoir terminé cette section, vous pouvez continuer à apprendre :

- [Journal des modifications : Historique des versions et enregistrement des modifications](../../changelog/release-notes/) - Suivre l'évolution des versions du plugin et les nouvelles fonctionnalités

Ou revenir à la section précédente :
- [Questions fréquentes : Que faire si le tableau n'est pas formaté](../../faq/troubleshooting/) - Localiser et résoudre rapidement les problèmes courants
