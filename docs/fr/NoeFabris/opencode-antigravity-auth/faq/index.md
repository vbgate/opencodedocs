---
title: "FAQ : Dépannage OAuth & Modèles | Antigravity Auth"
sidebarTitle: "Échec d'authentification"
subtitle: "FAQ : Dépannage OAuth & Modèles"
description: "Découvrez les problèmes courants et leurs solutions pour le plugin Antigravity Auth. Guide pratique couvrant le dépannage OAuth, la gestion des erreurs de modèles introuvables et la configuration de compatibilité des plugins."
order: 4
---

# Questions Fréquentes

Cette section recense les problèmes les plus courants rencontrés lors de l'utilisation du plugin Antigravity Auth, ainsi que leurs solutions. Que vous rencontriez des échecs d'authentification OAuth, des erreurs de requêtes de modèles ou des problèmes de compatibilité, vous trouverez ici des guides de dépannage appropriés.

## Prérequis

::: warning Vérifiez avant de commencer
- ✅ [Installation Rapide](../start/quick-install/) terminée et compte ajouté avec succès
- ✅ [Première Authentification](../start/first-auth-login/) complétée et flux OAuth compris
:::

## Parcours d'Apprentissage

Selon le type de problème que vous rencontrez, sélectionnez le guide de dépannage approprié :

### 1. [Dépannage Échec OAuth](./common-auth-issues/)

Résolvez les problèmes courants liés à l'authentification OAuth, au rafraîchissement des jetons et aux comptes.

- L'autorisation du navigateur réussit mais le terminal indique « échec d'autorisation »
- Erreur soudaine « Permission Denied » ou « invalid_grant »
- Échec de rappel OAuth sur Safari
- Impossible de terminer l'authentification en environnement WSL2/Docker

### 2. [Migration de Compte](./migration-guide/)

Migrez des comptes entre machines et gérez les mises à jour de version.

- Migration de compte d'un ancien ordinateur vers un nouveau
- Comprendre les changements de format de stockage (v1/v2/v3)
- Résolution des erreurs invalid_grant après migration

### 3. [Dépannage Modèle Introuvable](./model-not-found/)

Résolvez les problèmes liés aux modèles, erreurs 400, etc.

- Dépannage de l'erreur « Model not found »
- Erreur 400 « Invalid JSON payload received. Unknown name \"parameters\" »
- Erreur d'appel du serveur MCP

### 4. [Compatibilité des Plugins](./plugin-compatibility/)

Résolvez les problèmes de compatibilité avec les plugins oh-my-opencode, DCP, etc.

- Configuration correcte de l'ordre de chargement des plugins
- Désactivation des méthodes d'authentification conflictuelles dans oh-my-opencode
- Activation du décalage PID pour les scénarios d'agents parallèles

### 5. [Avertissement ToS](./tos-warning/)

Comprenez les risques d'utilisation et évitez les bannissements de compte.

- Comprendre les restrictions des Conditions d'Utilisation de Google
- Identifier les scénarios à haut risque (nouveaux comptes, requêtes intenses)
- Maîtriser les meilleures pratiques pour éviter les bannissements

## Localisation Rapide des Problèmes

| Symptôme | Lecture Recommandée |
|---|---|
| Échec d'authentification, délai d'autorisation dépassé | [Dépannage Échec OAuth](./common-auth-issues/) |
| invalid_grant, Permission Denied | [Dépannage Échec OAuth](./common-auth-issues/) |
| Model not found, erreur 400 | [Dépannage Modèle Introuvable](./model-not-found/) |
| Conflit avec d'autres plugins | [Compatibilité des Plugins](./plugin-compatibility/) |
| Changement d'ordinateur, mise à jour de version | [Migration de Compte](./migration-guide/) |
| Préoccupations sur la sécurité du compte | [Avertissement ToS](./tos-warning/) |

## Prochaines Étapes

Une fois le problème résolu, vous pouvez :

- 📖 Lire [Fonctionnalités Avancées](../advanced/) pour maîtriser les fonctionnalités avancées comme le multi-compte et la récupération de session
- 📚 Consulter l'[Annexe](../appendix/) pour comprendre la conception de l'architecture et la référence complète de configuration
- 🔄 Suivre le [Journal des Modifications](../changelog/) pour obtenir les dernières fonctionnalités et changements
