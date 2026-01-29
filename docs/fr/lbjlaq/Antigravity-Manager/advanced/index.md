---
title: "Configuration avancée : Explication des fonctionnalités avancées | Antigravity-Manager"
order: 300
sidebarTitle: "Mettre à niveau le système vers le niveau de production"
subtitle: "Configuration avancée : Explication des fonctionnalités avancées"
description: "Apprenez les méthodes de configuration avancée d'Antigravity-Manager. Maîtrisez les fonctionnalités avancées telles que la planification de comptes, le routage de modèles, la gestion des quotas et les statistiques de surveillance."
---

# Configuration avancée

Ce chapitre explique en profondeur les fonctionnalités avancées d'Antigravity Tools : gestion de configuration, stratégies de sécurité, planification de comptes, routage de modèles, gouvernance des quotas, surveillance et statistiques, ainsi que les solutions de déploiement de serveurs. Après avoir maîtrisé ces contenus, vous pouvez faire passer Antigravity Tools de "utilisable" à "facile à utiliser, stable, et maintenable en production".

## Ce chapitre contient

| Tutoriel | Description |
|--- | ---|
| [Configuration complète](./config/) | Champs complets de AppConfig/ProxyConfig, emplacement de persistance et sémantique de mise à jour à chaud |
| [Sécurité et confidentialité](./security/) | `auth_mode`, `allow_lan_access` et conception de la ligne de base de sécurité |
| [Planification haute disponibilité](./scheduling/) | Rotation, compte fixe, session sticky et mécanisme de nouvelle tentative en cas d'échec |
| [Routage de modèles](./model-router/) | Mappage personnalisé, priorité de caractère générique et stratégies prédéfinies |
| [Gouvernance des quotas](./quota/) | Combinaison Quota Protection + Smart Warmup |
| [Proxy Monitor](./monitoring/) | Journaux de demandes, filtrage, restauration de détails et exportation |
| [Token Stats](./token-stats/) | Perspectives de statistiques de coûts et interprétation des graphiques |
| [Stabilité des sessions longues](./context-compression/) | Compression de contexte, cache de signatures et compression des résultats d'outils |
| [Capacités du système](./system/) | Multilingue/thème/mises à jour/démarrage automatique/serveur API HTTP |
| [Déploiement de serveur](./deployment/) | Choix entre Docker noVNC vs Headless Xvfb et exploitation |

## Recommandations de parcours d'apprentissage

::: tip Ordre recommandé
Ce chapitre contient beaucoup de contenu, il est recommandé d'apprendre par modules dans l'ordre suivant :
:::

**Première phase : Configuration et sécurité (obligatoire)**

```
Configuration complète → Sécurité et confidentialité
config           security
```

Comprenez d'abord le système de configuration (ce qui nécessite un redémarrage, ce qui peut être mis à jour à chaud), puis apprenez les paramètres de sécurité (surtout lors de l'exposition au réseau local/public).

**Deuxième phase : Planification et routage (recommandé)**

```
Planification haute disponibilité → Routage de modèles
scheduling                model-router
```

Apprenez à obtenir la stabilité maximale avec le nombre minimal de comptes, puis utilisez le routage de modèles pour masquer les changements amont.

**Troisième phase : Quotas et surveillance (selon les besoins)**

```
Gouvernance des quotas → Proxy Monitor → Token Stats
quota              monitoring      token-stats
```

Empêchez l'épuisement invisible des quotas, transformez l'appel de boîte noire en système observable, quantifiez l'optimisation des coûts.

**Quatrième phase : Stabilité et déploiement (avancé)**

```
Stabilité des sessions longues → Capacités du système → Déploiement de serveur
context-compression           system            deployment
```

Résolvez les problèmes invisibles des sessions longues, rendez le client plus comme un produit, et enfin apprenez le déploiement de serveur.

**Sélection rapide** :

| Votre scénario | Recommandé de lire d'abord |
|--- | ---|
| Rotation multi-comptes instable | [Planification haute disponibilité](./scheduling/) |
| Besoin de fixer un nom de modèle | [Routage de modèles](./model-router/) |
| Quotas toujours épuisés | [Gouvernance des quotas](./quota/) |
| Besoin de voir les journaux de demandes | [Proxy Monitor](./monitoring/) |
| Besoin de statistiques de consommation de Token | [Token Stats](./token-stats/) |
| Erreurs fréquentes dans les longues conversations | [Stabilité des sessions longues](./context-compression/) |
| Besoin d'exposition au réseau local | [Sécurité et confidentialité](./security/) |
| Besoin de déploiement sur serveur | [Déploiement de serveur](./deployment/) |

## Conditions préalables

::: warning Avant de commencer, veuillez confirmer
- Avez terminé le chapitre [Démarrage rapide](../start/) (au moins l'installation, l'ajout de comptes, le démarrage du proxy inverse)
- Avez terminé l'accès d'au moins un protocole dans [Plateformes et intégrations](../platforms/) (comme OpenAI ou Anthropic)
- Le proxy inverse local peut répondre normalement aux demandes
:::

## Prochaine étape

Après avoir terminé ce chapitre, vous pouvez continuer à apprendre :

- [Questions fréquentes](../faq/) : Guide de dépannage lors de problèmes 401/404/429/interruption de streaming
- [Annexe](../appendix/) : Référence rapide des points de terminaison, modèles de données, limites de capacités de z.ai et autres documents de référence
