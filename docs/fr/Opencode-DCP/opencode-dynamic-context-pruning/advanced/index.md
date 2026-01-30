---
title: "Fonctionnalités avancées : Analyse approfondie | opencode-dcp"
sidebarTitle: "Éviter la suppression accidentelle de contenu critique"
subtitle: "Fonctionnalités avancées : Analyse approfondie"
description: "Apprenez les mécanismes de protection, la persistance d'état et autres fonctionnalités avancées de DCP. Maîtrisez les techniques d'utilisation dans des scénarios complexes, évitez d'élaguer accidentellement du contenu critique et optimisez le taux de réussite du cache."
order: 30
---

# Fonctionnalités avancées

Ce chapitre approfondit les fonctionnalités avancées de DCP, vous aidant à comprendre les mécanismes internes du plugin et à utiliser DCP correctement dans des scénarios complexes.

::: warning Prérequis
Avant d'étudier ce chapitre, assurez-vous d'avoir complété :
- [Installation et démarrage rapide](../start/getting-started/) - Comprendre l'installation et l'utilisation de base de DCP
- [Guide complet de configuration](../start/configuration/) - Vous familiariser avec le système de configuration de DCP
- [Stratégies d'élagage automatique expliquées](../platforms/auto-pruning/) - Comprendre les stratégies d'élagage principales de DCP
:::

## Contenu du chapitre

| Cours | Description | Scenarios |
|--- | --- | ---|
| [Mécanismes de protection](./protection/) | Protection de tours, outils protégés et modes de fichiers protégés | Éviter d'élaguer accidentellement du contenu critique |
| [Persistance d'état](./state-persistence/) | Comment DCP conserve les états d'élagage et les statistiques à travers les sessions | Comprendre le mécanisme de stockage des données |
| [Impact sur la mise en cache des prompts](./prompt-caching/) | Impact de l'élagage DCP sur la mise en cache des prompts | Optimiser le taux de réussite du cache |
| [Gestion des sous-agents](./subagent-handling/) | Comportement et limitations de DCP dans les sessions de sous-agents | Lors de l'utilisation de l'outil Task |

## Recommandations pour le parcours d'apprentissage

```
Mécanismes de protection → Persistance d'état → Impact sur le cache → Gestion des sous-agents
   ↓              ↓                      ↓                    ↓
  Obligatoire    Au besoin         Pour optimiser    Quand utilisez des sous-agents
```

**Ordre recommandé** :

1. **Mécanismes de protection** (obligatoire) - Il s'agit de la fonctionnalité avancée la plus importante. Sa compréhension vous permet d'éviter que DCP ne supprime accidentellement du contenu critique.
2. **Persistance d'état** (au besoin) - Si vous souhaitez comprendre comment DCP enregistre les statistiques, ou si vous devez déboguer des problèmes liés à l'état.
3. **Impact sur la mise en cache des prompts** (pour l'optimisation des performances) - Lorsque vous vous souciez de l'optimisation des coûts de l'API, vous devez équilibrer la relation entre l'élagage et la mise en cache.
4. **Gestion des sous-agents** (lorsque vous utilisez des sous-agents) - Si vous utilisez l'outil Task d'OpenCode pour distribuer des sous-tâches, vous devez connaître les limitations de DCP.

## Prochaines étapes

Après avoir terminé ce chapitre, vous pouvez :

- Consulter [Questions fréquentes et dépannage](../faq/troubleshooting/) pour résoudre les problèmes rencontrés lors de l'utilisation
- Lire [Meilleures pratiques](../faq/best-practices/) pour savoir comment maximiser les économies de tokens
- Approfondir [Aperçu de l'architecture](../appendix/architecture/) pour comprendre l'implémentation interne de DCP
