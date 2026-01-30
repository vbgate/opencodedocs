---
title: "Journal des modifications d'opencode-notify : Historique des versions et changements de fonctionnalités"
sidebarTitle: "Nouveautés"
subtitle: "Journal des modifications"
description: "Consultez l'historique des versions et les changements importants du plugin opencode-notify. Découvrez les mises à jour de fonctionnalités, corrections de bugs et améliorations de configuration de chaque version."
tags:
  - "Journal des modifications"
  - "Historique des versions"
order: 150
---

# Journal des modifications

## Notes de version

Ce plugin est publié via OCX et n'a pas de numéro de version traditionnel. Les modifications importantes sont enregistrées ci-dessous par ordre chronologique inverse.

---

## 2026-01-23

**Type de modification** : Mise à jour synchronisée

- Maintien de la synchronisation avec le dépôt principal kdcokenny/ocx

---

## 2026-01-22

**Type de modification** : Mise à jour synchronisée

- Maintien de la synchronisation avec le dépôt principal kdcokenny/ocx

---

## 2026-01-13

**Type de modification** : Mise à jour synchronisée

- Maintien de la synchronisation avec le dépôt principal kdcokenny/ocx

---

## 2026-01-12

**Type de modification** : Mise à jour synchronisée

- Maintien de la synchronisation avec le dépôt principal kdcokenny/ocx

---

## 2026-01-08

**Type de modification** : Mise à jour synchronisée

- Maintien de la synchronisation avec le dépôt principal kdcokenny/ocx

---

## 2026-01-07

**Type de modification** : Mise à jour synchronisée

- Mise à jour depuis ocx@30a9af5
- Saut de la construction CI

---

## 2026-01-01

### Correction : Syntaxe de namespace de style Cargo

**Contenu de la modification** :
- Mise à jour de la syntaxe de namespace : `ocx add kdco-notify` → `ocx add kdco/notify`
- Mise à jour de la syntaxe de namespace : `ocx add kdco-workspace` → `ocx add kdco/workspace`
- Renommage du fichier source : `kdco-notify.ts` → `notify.ts`

**Impact** :
- La commande d'installation passe de `ocx add kdco-notify` à `ocx add kdco/notify`
- Structure des fichiers source plus claire, conforme au style de nommage Cargo

---

### Optimisation : Documentation README

**Contenu de la modification** :
- Optimisation de la documentation README, ajout des explications de la proposition de valeur
- Nouvelle section FAQ pour répondre aux questions courantes
- Amélioration des textes explicatifs relatifs aux "notifications intelligentes"
- Simplification des explications des étapes d'installation

**Contenu ajouté** :
- Tableau de proposition de valeur (événements, notification, effets sonores, raisons)
- FAQ : ajout de contexte, réception de notifications indésirables, désactivation temporaire

---

## 2025-12-31

### Documentation : Simplification du README

**Contenu de la modification** :
- Suppression des icônes invalides et des références au mode sombre
- Simplification de la documentation README, concentration sur les explications des fonctionnalités principales

### Suppression : Support des icônes

**Contenu de la modification** :
- Suppression du support des icônes OpenCode (détection du mode sombre multiplateforme)
- Simplification du processus de notification, suppression des fonctionnalités d'icônes instables
- Nettoyage du répertoire `src/plugin/assets/`

**Fichiers supprimés** :
- `src/plugin/assets/opencode-icon-dark.png`
- `src/plugin/assets/opencode-icon-light.png`

**Impact** :
- Les notifications n'affichent plus d'icônes personnalisées
- Le processus de notification est plus stable, réduction des problèmes de compatibilité de plateforme

### Ajout : Icône OpenCode (supprimé)

**Contenu de la modification** :
- Ajout du support des icônes OpenCode
- Implémentation de la détection du mode sombre multiplateforme

::: info
Cette fonctionnalité a été supprimée dans les versions ultérieures, voir "Suppression : Support des icônes" du 2025-12-31.
:::

### Ajout : Détection de terminal et perception du focus

**Contenu de la modification** :
- Ajout de la fonction de détection automatique de terminal (support de 37+ terminaux)
- Ajout de la fonction de détection de focus (macOS uniquement)
- Ajout de la fonction de clic pour le focus (macOS uniquement)

**Nouvelles fonctionnalités** :
- Identification automatique des émulateurs de terminal
- Suppression des notifications lorsque le terminal est au premier plan
- Clic sur la notification pour mettre la fenêtre du terminal au premier plan (macOS)

**Détails techniques** :
- Utilisation de la bibliothèque `detect-terminal` pour détecter le type de terminal
- Obtention de l'application au premier plan via macOS osascript
- Implémentation du focus par clic via l'option activate de node-notifier

### Ajout : Version initiale

**Contenu de la modification** :
- Commit initial : plugin kdco-notify
- Fonctionnalité de notifications natives de base
- Système de configuration de base

**Fonctionnalités principales** :
- Notifications d'événement session.idle (tâche terminée)
- Notifications d'événement session.error (erreur)
- Notifications d'événement permission.updated (demande d'autorisation)
- Intégration node-notifier (notifications natives multiplateforme)

**Fichiers initiaux** :
- `LICENSE` - Licence MIT
- `README.md` - Documentation du projet
- `registry.json` - Configuration d'enregistrement OCX
- `src/plugin/kdco-notify.ts` - Code du plugin principal

---

## Ressources connexes

- **Dépôt GitHub** : https://github.com/kdcokenny/ocx/tree/main/registry/src/kdco/notify
- **Historique des commits** : https://github.com/kdcokenny/ocx/commits/main/registry/src/kdco/notify
- **Documentation OCX** : https://github.com/kdcokenny/ocx

---

## Stratégie de version

Ce plugin, faisant partie de l'écosystème OCX, adopte la stratégie de version suivante :

- **Pas de numéro de version** : Suivi des modifications via l'historique des commits Git
- **Livraison continue** : Mises à jour synchronisées avec le dépôt principal OCX
- **Compatibilité ascendante** : Maintien de la compatibilité ascendante du format de configuration et de l'API

En cas de modifications destructrices, elles seront clairement indiquées dans le journal des modifications.

---

**Dernière mise à jour** : 2026-01-27
