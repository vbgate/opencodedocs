---
title: "FAQ : Dépannage et solutions | Antigravity-Manager"
sidebarTitle: "En cas d'erreur"
subtitle: "FAQ : Dépannage et solutions"
description: "Maîtrisez les méthodes de dépannage pour les problèmes courants des Antigravity Tools. Inclut la localisation rapide et les solutions pour les scénarios tels que la désactivation de compte, les échecs d'authentification, les erreurs de limitation, etc."
order: 4
---

# Questions fréquentes

Ce chapitre recense les codes d'erreur et les scénarios d'exception les plus courants rencontrés lors de l'utilisation des Antigravity Tools, vous aidant à identifier rapidement la cause racine du problème et à trouver des solutions.

## Contenu de ce chapitre

| Type de problème | Page | Description |
|--- | --- | ---|
| Compte désactivé | [invalid_grant et désactivation automatique du compte](./invalid-grant/) | Compte soudainement indisponible ? Comprenez les causes de l'expiration du jeton OAuth et le processus de récupération |
| Échec d'authentification | [401/Échec d'authentification](./auth-401/) | Requête rejetée ? Vérifiez la configuration auth_mode et le format des en-têtes |
| Erreur de limitation | [429/Erreur de capacité](./429-rotation/) | 429 fréquent ? Distinguez le quota insuffisant de la limitation amont, utilisez la stratégie de rotation pour réduire l'impact |
| Erreur de chemin | [404/Incompatibilité de chemin](./404-base-url/) | API 404 ? Résolvez les problèmes de concaténation entre l'URL de base et le préfixe /v1 |
| Exception de flux | [Interruption de flux/0 Token/Signature expirée](./streaming-0token/) | Réponse interrompue ou vide ? Comprenez le mécanisme d'auto-réparation du proxy et le chemin de dépannage |

## Recommandations de parcours

**Par code d'erreur** : En cas d'erreur spécifique, accédez directement à la page correspondante.

**Apprentissage systématique** : Si vous souhaitez comprendre de manière exhaustive les problèmes potentiels, nous vous recommandons de lire dans l'ordre suivant :

1. **[404/Incompatibilité de chemin](./404-base-url/)** — Le problème d'intégration le plus courant, généralement le premier obstacle
2. **[401/Échec d'authentification](./auth-401/)** — Le chemin est correct mais la requête est rejetée, vérifiez la configuration d'authentification
3. **[invalid_grant et désactivation automatique du compte](./invalid-grant/)** — Problèmes au niveau du compte
4. **[429/Erreur de capacité](./429-rotation/)** — La requête réussit mais est limitée
5. **[Interruption de flux/0 Token/Signature expirée](./streaming-0token/)** — Problèmes avancés, impliquant les réponses en flux et le mécanisme de signature

## Conditions préalables

::: warning Recommandation : complétez d'abord
- [Démarrer le proxy local et connecter le premier client](../start/proxy-and-first-client/) — Assurez-vous que l'environnement de base fonctionne
- [Ajouter un compte](../start/add-account/) — Comprenez la bonne façon d'ajouter des comptes
:::

## Étapes suivantes

Une fois le problème résolu, vous pouvez continuer l'apprentissage approfondi :

- **[Ordonnancement haute disponibilité](../advanced/scheduling/)** — Utilisez les stratégies de rotation et de réessai pour réduire les erreurs
- **[Proxy Monitor](../advanced/monitoring/)** — Utilisez le système de journalisation pour suivre les détails des requêtes
- **[Complément de configuration](../advanced/config/)** — Comprenez le rôle de tous les éléments de configuration
