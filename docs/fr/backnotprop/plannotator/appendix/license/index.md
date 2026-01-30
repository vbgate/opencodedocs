---
title: "Licence : Clause BSL expliquée | Plannotator"
sidebarTitle: "Comprendre les règles d'utilisation commerciale"
subtitle: "Licence : Clause BSL expliquée"
description: "Découvrez les clauses de la licence Business Source License 1.1 (BSL) de Plannotator et les restrictions d'utilisation commerciale. Apprenez les scénarios autorisés, les plans de changement futurs et la date de conversion vers Apache 2.0 en 2030."
tags:
  - "Licence"
  - "BSL-1.1"
  - "Utilisation commerciale"
prerequisite: []
order: 3
---

# Explication de la licence Plannotator

## Ce que vous pourrez faire après avoir terminé

- Comprendre le type de licence et les clauses principales utilisées par Plannotator
- Identifier quels scénarios d'utilisation sont autorisés et lesquels sont restreints
- Connaître le calendrier des futurs changements de licence
- Savoir comment obtenir une licence commerciale ou contacter le titulaire

## Ce que vous devez savoir maintenant

Plannotator utilise la **Business Source License 1.1 (BSL)** comme sa licence open source. Il s'agit d'une licence spéciale conçue pour protéger la valeur commerciale tout en permettant au projet de devenir complètement open source à terme.

## Clauses principales

### Type de licence

| Élément | Contenu |
|--- | ---|
| **Nom de la licence** | Business Source License 1.1 (BSL) |
| **Titulaire du droit d'auteur** | backnotprop (2025) |
| **Projet sous licence** | plannotator |
| **Date de changement** | 2030-01-01 |
| **Licence après changement** | Apache License, Version 2.0 |

::: info Qu'est-ce que la BSL ?
La Business Source License est une licence spéciale développée par MariaDB. Elle restreint temporairement certains usages commerciaux, mais s'engage à convertir le logiciel en une licence open source complète (comme Apache 2.0) à une date spécifique. Ce modèle permet aux projets open source d'obtenir des revenus durables pendant le processus de commercialisation, tout en garantissant une ouverture à long terme pour la communauté.
:::

### Utilisations autorisées

Selon les clauses de la BSL 1.1, vous pouvez :

- ✅ **Copier, modifier et créer des œuvres dérivées**
  - Vous pouvez effectuer un développement secondaire basé sur Plannotator
  - Vous pouvez modifier le code source pour l'adapter à vos besoins

- ✅ **Redistribuer**
  - Vous pouvez distribuer les versions originales ou modifiées
  - Vous devez conserver les déclarations de licence originales

- ✅ **Utilisation en environnement de non-production**
  - Développement interne, tests et évaluation
  - Apprentissage et recherche personnelle

::: tip Utilisation étendue par les particuliers et les entreprises
La BSL définit de manière large « l'utilisation en environnement de non-production », incluant divers scénarios pour les particuliers et les entreprises. Vous et les membres de votre équipe (y compris les entrepreneurs indépendants) pouvez librement utiliser Plannotator pour le développement, les tests et le déploiement.
:::

### Restrictions d'utilisation (important !)

**Restriction principale** : Il est interdit d'utiliser Plannotator pour un **service de planification, de contexte ou d'approbation (Planning, Context, or Approval Service)**.

#### Qu'est-ce qu'un « service de planification, de contexte ou d'approbation » ?

Tout produit commercial permettant à des **tiers** (autres que les employés et les entrepreneurs indépendants) d'accéder aux fonctionnalités de Plannotator par une opération directe ou indirecte constitue un service restreint. Cela inclut notamment :

- **Fournisseurs de services cloud**
  - Les plateformes SaaS fournissant les fonctionnalités de Plannotator comme partie de leurs services
  - Les fournisseurs de services hébergés fournissant Plannotator à leurs clients ou abonnés

- **Services d'infrastructure**
  - Fournisseurs de services de centres de données
  - Fournisseurs de plateformes de calcul cloud

- **Tiers fournissant des services similaires**
  - Y compris tous services fournis par les entités susmentionnées et leurs sociétés affiliées

::: warning Avertissement sur l'utilisation commerciale
Si vous prévoyez d'utiliser Plannotator comme partie d'un service commercial pour des tiers, vous devez obtenir une licence commerciale à l'avance. La violation de cette clause entraînera automatiquement la résiliation de vos droits d'utilisation de toutes les versions actuelles et futures de Plannotator.
:::

## Calendrier des changements de licence

| Période | Type de licence | Description |
|--- | --- | ---|
| **Actuel - 2030-01-01** | BSL 1.1 | Licence open source restreinte |
| **2030-01-01 et après** | Apache 2.0 | Open source complet, sans restriction commerciale |

### Que se passera-t-il après le changement ?

À partir du 1er janvier 2030, Plannotator sera automatiquement converti en **Apache License 2.0**. Cela signifie :

- ✅ Toutes les restrictions commerciales seront supprimées
- ✅ Libre utilisation pour tout but commercial
- ✅ Intégration possible dans tout service SaaS
- ✅ Conforme aux standards des licences open source permissives

## Licence commerciale

Si vous devez utiliser Plannotator sans respecter les restrictions de la BSL (par exemple pour un service de planification, de contexte ou d'approbation), vous pouvez :

1. **Acheter une licence commerciale**
   - Acheter auprès de backnotprop ou de ses distributeurs agréés
   - Obtenir des droits d'utilisation sans restrictions de la BSL

2. **Contacter le titulaire de la licence**
   - Envoyer un e-mail à : backnotprop
   - Expliquer vos scénarios d'utilisation et vos besoins

## Questions fréquentes

### Puis-je utiliser Plannotator au sein de mon entreprise ?

**Oui.** La BSL autorise explicitement vous, vos employés et vos entrepreneurs indépendants à utiliser Plannotator pour le développement interne, les tests et le déploiement. Les restrictions ne s'appliquent qu'aux scénarios de fourniture de services à des **tiers** (non employés ni entrepreneurs).

### Puis-je développer mon propre produit basé sur Plannotator ?

**Oui, avec conditions.** Si votre produit est :
- Outil interne : ✅ Autorisé
- Projet personnel : ✅ Autorisé
- Projet open source : ✅ Autorisé (conserver la licence BSL)
- Produit commercial : ❓ Doit être évalué pour déterminer s'il s'agit d'un « service de planification, de contexte ou d'approbation »

### Mon entreprise est un fournisseur SaaS, puis-je l'utiliser ?

**Une licence commerciale est requise.** Si votre produit SaaS fournit les fonctionnalités de Plannotator à vos clients (même en tant que fonctionnalité partielle), il s'agit d'un service commercial restreint et vous devez acheter une licence commerciale.

### Après 2030, pourrai-je utiliser Plannotator pour n'importe quel usage ?

**Oui.** À partir de la date de changement, Plannotator utilisera la licence Apache 2.0 et toutes les restrictions commerciales seront supprimées, vous pourrez l'utiliser librement pour n'importe quel usage.

## Texte complet de la licence

Pour le texte complet de la Business Source License 1.1, veuillez vous référer au fichier `LICENSE` dans le répertoire racine du projet.

## Coordonnées

Pour obtenir une licence commerciale ou pour toute autre question, veuillez contacter :
- **Titulaire de la licence** : backnotprop
- **Dépôt du projet** : [backnotprop/plannotator](https://github.com/backnotprop/plannotator)

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous consultons le **[journal des modifications](../../changelog/release-notes/)**.
>
> Vous verrez :
> - L'historique des versions de Plannotator
> - Les nouvelles fonctionnalités et améliorations de chaque version
> - Les corrections de bugs importantes

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonction | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
| Déclaration de licence | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L100-L104) | 100-104 |
| Texte complet de la licence | [`LICENSE`](https://github.com/backnotprop/plannotator/blob/main/LICENSE) | 1-115 |

**Informations clés** :
- Type de licence : Business Source License 1.1 (BSL)
- Titulaire du droit d'auteur : backnotprop (c) 2025
- Date de changement : 2030-01-01
- Licence après changement : Apache License, Version 2.0
- Restriction principale : Interdiction d'utilisation pour les services de planification, de contexte ou d'approbation

</details>
