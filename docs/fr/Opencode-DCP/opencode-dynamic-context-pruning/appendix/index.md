---
title: "Annexe : Références techniques | opencode-dynamic-context-pruning"
sidebarTitle: "Comprendre en profondeur les principes"
subtitle: "Annexe : Références techniques | opencode-dynamic-context-pruning"
description: "Découvrez les références techniques de DCP, y compris la conception de l'architecture interne, les principes de calcul des tokens et la documentation API complète. Destiné aux utilisateurs souhaitant approfondir leur compréhension ou effectuer un développement secondaire."
order: 5
---

# Annexe

Ce chapitre fournit les références techniques de DCP, y compris la conception de l'architecture interne, les principes de calcul des tokens et la documentation API complète. Ces contenus s'adressent aux utilisateurs qui souhaitent approfondir leur compréhension du fonctionnement de DCP ou effectuer un développement secondaire.

## Contenu de ce chapitre

| Document | Description | Pour qui |
| --- | --- | --- |
| [Vue d'ensemble de l'architecture](./architecture/) | Comprendre l'architecture interne de DCP, les dépendances des modules et la chaîne d'appels | Utilisateurs souhaitant comprendre le fonctionnement de DCP |
| [Principes de calcul des tokens](./token-calculation/) | Comprendre comment DCP calcule l'utilisation des tokens et les statistiques d'économie | Utilisateurs souhaitant évaluer précisément les économies réalisées |
| [Référence API](./api-reference/) | Documentation API complète, incluant les interfaces de configuration, les spécifications des outils et la gestion des états | Développeurs de plugins |

## Parcours d'apprentissage

```
Vue d'ensemble de l'architecture → Principes de calcul des tokens → Référence API
↓                              ↓                           ↓
Comprendre la conception       Comprendre les statistiques  Développer des extensions
```

**Ordre recommandé** :

1. **Vue d'ensemble de l'architecture** : Établissez d'abord une compréhension globale, comprenez la division des modules de DCP et la chaîne d'appels
2. **Principes de calcul des tokens** : Comprenez la logique de calcul de la sortie `/dcp context`, apprenez à analyser la distribution des tokens
3. **Référence API** : Si vous avez besoin de développer des plugins ou d'effectuer un développement secondaire, consultez la documentation complète des interfaces

::: tip Lecture selon les besoins
Si vous souhaitez simplement bien utiliser DCP, vous pouvez sauter ce chapitre. Ces contenus s'adressent principalement aux utilisateurs souhaitant approfondir leur compréhension des principes ou effectuer du développement.
:::

## Prérequis

Avant de lire ce chapitre, il est recommandé d'avoir préalablement consulté :

- [Installation et démarrage rapide](../start/getting-started/) : Assurez-vous que DCP fonctionne correctement
- [Guide complet de configuration](../start/configuration/) : Comprenez les concepts de base du système de configuration
- [Utilisation des commandes Slash](../platforms/commands/) : Familiarisez-vous avec les commandes `/dcp context` et `/dcp stats`

## Prochaines étapes

Après avoir terminé ce chapitre, vous pouvez :

- Consulter [FAQ et dépannage](../faq/troubleshooting/) : Résoudre les problèmes rencontrés lors de l'utilisation
- Consulter [Bonnes pratiques](../faq/best-practices/) : Apprendre comment maximiser les économies de tokens
- Consulter [Historique des versions](../changelog/version-history/) : Découvrir les mises à jour de DCP
