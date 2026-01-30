---
title: "Fonctionnalités Avancées : Gestion Multi-Comptes | Antigravity Auth"
sidebarTitle: "Gestion Multi-Comptes"
subtitle: "Fonctionnalités Avancées : Gestion Multi-Comptes"
description: "Maîtrisez les fonctionnalités avancées du plugin Antigravity Auth. Approfondissez l'équilibrage de charge multi-comptes, la sélection intelligente de comptes, la gestion des limites de débit, la récupération de session et les mécanismes de transformation de requêtes."
order: 3
---

# Fonctionnalités Avancées

Ce chapitre vous aide à maîtriser en profondeur les fonctionnalités avancées du plugin Antigravity Auth, notamment l'équilibrage de charge multi-comptes, la sélection intelligente de comptes, la gestion des limites de débit, la récupération de session et les mécanismes de transformation de requêtes. Que vous cherchiez à optimiser l'utilisation des quotas ou à résoudre des problèmes complexes, vous trouverez ici les réponses dont vous avez besoin.

## Conditions Préalables

::: warning Avant de commencer, assurez-vous de
- ✅ Avoir complété [l'Installation Rapide](../start/quick-install/) et ajouté votre premier compte avec succès
- ✅ Avoir complété [la Première Authentification](../start/first-auth-login/) et compris le flux OAuth
- ✅ Avoir complété [la Première Requête](../start/first-request/) et vérifié que le plugin fonctionne correctement
:::

## Parcours d'Apprentissage

### 1. [Configuration Multi-Comptes](./multi-account-setup/)

Configurez plusieurs comptes Google pour mettre en commun les quotas et équilibrer la charge.

- Ajoutez plusieurs comptes pour augmenter la limite globale de quota
- Comprenez le système de double quota (Antigravity + Gemini CLI)
- Choisissez le nombre approprié de comptes selon votre cas d'usage

### 2. [Stratégies de Sélection de Comptes](./account-selection-strategies/)

Maîtrisez les meilleures pratiques pour les trois stratégies de sélection de comptes : sticky, round-robin et hybrid.

- 1 compte → stratégie sticky pour conserver le cache de prompts
- 2-3 comptes → stratégie hybrid pour distribuer intelligemment les requêtes
- 4+ comptes → stratégie round-robin pour maximiser le débit

### 3. [Gestion des Limites de Débit](./rate-limit-handling/)

Comprenez la détection des limites de débit, les tentatives automatiques et les mécanismes de basculement de comptes.

- Distinguez 5 types différents d'erreurs 429
- Comprenez l'algorithme de backoff exponentiel pour les tentatives automatiques
- Maîtrisez la logique de basculement automatique dans les scénarios multi-comptes

### 4. [Récupération de Session](./session-recovery/)

Découvrez le mécanisme de récupération de session pour gérer automatiquement les échecs d'appels d'outils et les interruptions.

- Gérer automatiquement les erreurs tool_result_missing
- Corriger les problèmes thinking_block_order
- Configurer les options auto_resume et session_recovery

### 5. [Mécanisme de Transformation de Requêtes](./request-transformation/)

Comprenez en profondeur le mécanisme de transformation des requêtes pour assurer la compatibilité avec les différences de protocole entre différents modèles d'IA.

- Comprenez les différences de protocole entre les modèles Claude et Gemini
- Diagnostic des erreurs 400 causées par des incompatibilités de schéma
- Optimisez la configuration Thinking pour obtenir les meilleures performances

### 6. [Guide de Configuration](./configuration-guide/)

Maîtrisez toutes les options de configuration pour personnaliser le comportement du plugin selon vos besoins.

- Emplacement et priorité des fichiers de configuration
- Paramètres de comportement des modèles, rotation des comptes et comportement de l'application
- Configurations recommandées pour les scénarios à compte unique, multi-comptes et agents parallèles

### 7. [Optimisation pour Agents Parallèles](./parallel-agents/)

Optimisez l'allocation des comptes pour les scénarios d'agents parallèles en activant le décalage PID.

- Comprenez les conflits de comptes dans les scénarios d'agents parallèles
- Activez le décalage PID pour que différents processus sélectionnent en priorité des comptes différents
- Combinez avec la stratégie round-robin pour maximiser l'utilisation multi-comptes

### 8. [Journalisation de Débogage](./debug-logging/)

Activez la journalisation de débogage pour résoudre les problèmes et surveiller l'état de fonctionnement.

- Activez les journaux de débogage pour enregistrer des informations détaillées
- Comprenez les différents niveaux de journalisation et leurs scénarios d'application
- Interprétez le contenu des journaux pour localiser rapidement les problèmes

## Prochaines Étapes

Après avoir terminé l'apprentissage des fonctionnalités avancées, vous pouvez :

- 📖 Consulter la [FAQ](../faq/) pour résoudre les problèmes rencontrés
- 📚 Lire l'[Annexe](../appendix/) pour comprendre la conception de l'architecture et la référence de configuration complète
- 🔄 Suivre le [Journal des Modifications](../changelog/) pour connaître les dernières fonctionnalités et modifications
