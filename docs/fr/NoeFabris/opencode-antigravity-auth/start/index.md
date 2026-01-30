---
title: "Démarrage Rapide : Installation et Configuration d'Antigravity Auth | OpenCode"
sidebarTitle: "Opérationnel en 10 Minutes"
subtitle: "Démarrage Rapide : Installation et Configuration d'Antigravity Auth"
description: "Apprenez à installer et configurer le plugin Antigravity Auth. Effectuez l'authentification Google OAuth et envoyez votre première requête modèle en 10 minutes, en vérifiant l'accès aux modèles Claude et Gemini."
order: 1
---

# Démarrage Rapide

Ce chapitre vous guide depuis zéro jusqu'à l'utilisation du plugin Antigravity Auth. Vous découvrirez la valeur fondamentale du plugin, terminerez l'installation et l'authentification OAuth, et enverrez votre première requête modèle pour vérifier que la configuration fonctionne.

## Parcours d'Apprentissage

Suivez cet ordre d'apprentissage, chaque étape s'appuyant sur la précédente :

### 1. [Présentation du Plugin](./what-is-antigravity-auth/)

Découvrez la valeur fondamentale du plugin Antigravity Auth, ses cas d'usage et les avertissements sur les risques.

- Déterminez si le plugin correspond à votre cas d'usage
- Découvrez les modèles IA pris en charge (Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash)
- Comprenez clairement les risques et précautions d'utilisation

### 2. [Installation Rapide](./quick-install/)

Effectuez l'installation du plugin et la première authentification en 5 minutes.

- Deux méthodes d'installation (assistance IA / configuration manuelle)
- Configuration des définitions de modèles
- Exécution de l'authentification Google OAuth

### 3. [Authentification OAuth 2.0 PKCE](./first-auth-login/)

Comprenez le flux d'authentification OAuth 2.0 PKCE et terminez votre première connexion.

- Comprenez le mécanisme de sécurité PKCE
- Terminez votre première connexion pour obtenir les droits d'accès API
- Découvrez le traitement automatisé du rafraîchissement des tokens

### 4. [Première Requête](./first-request/)

Effectuez votre première requête modèle pour vérifier que l'installation réussit.

- Envoyez votre première requête modèle Antigravity
- Comprenez les paramètres `--model` et `--variant`
- Diagnostic des erreurs courantes de requêtes modèles

## Prérequis

Avant de commencer ce chapitre, assurez-vous que :

- ✅ OpenCode CLI est installé (la commande `opencode` est disponible)
- ✅ Vous disposez d'un compte Google (pour l'authentification OAuth)

## Prochaines Étapes

Après avoir terminé le démarrage rapide, vous pouvez :

- **[Découvrir les Modèles Disponibles](../platforms/available-models/)** — Explorez tous les modèles pris en charge et leurs configurations de variantes
- **[Configuration Multi-Comptes](../advanced/multi-account-setup/)** — Configurez plusieurs comptes Google pour le pool de quotas
- **[Problèmes d'Authentification Courants](../faq/common-auth-issues/)** — Consultez le guide de dépannage en cas de problèmes
