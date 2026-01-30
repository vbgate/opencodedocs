---
title: "Historique des Versions : Suivez l'Évolution de DCP | opencode-dynamic-context-pruning"
sidebarTitle: "Voir les Nouveautés"
subtitle: "Historique des Versions : Suivez l'Évolution de DCP"
description: "Découvrez toutes les mises à jour d'OpenCode DCP de la v1.0.1 à la v1.2.7 : nouvelles fonctionnalités, corrections et optimisations pour économiser vos tokens."
tags:
  - "Historique des Versions"
  - "Journal des Modifications"
  - "DCP"
prerequisite: []
order: 1
---

# Historique des Versions DCP

Ce document regroupe l'intégralité des mises à jour du plugin OpenCode Dynamic Context Pruning (DCP).

---

## [v1.2.7] - 22/01/2026

**Nouvelles Fonctionnalités**
- ✨ Affichage du nombre de tokens du contenu extrait (dans la notification de pruning)
- 🛡️ Amélioration de la protection contre l'injection de contexte (ajout de vérifications de tableaux)
- 📝 Optimisation : injection du contexte en tant que message utilisateur quand le dernier message est un message utilisateur
- ⚙️ Simplification de la configuration par défaut (inclusion uniquement de l'URL du schéma)

---

## [v1.2.6] - 21/01/2026

**Nouvelles Fonctionnalités**
- ✨ Ajout de la commande `/dcp sweep` pour un pruning manuel du contexte

**Détails des Commandes**
- `/dcp sweep` - Prune tous les outils après le dernier message utilisateur
- `/dcp sweep N` - Prune les N derniers outils

---

## [v1.2.5] - 20/01/2026

**Nouvelles Fonctionnalités**
- ✨ Affichage du nombre d'outils dans la commande `/dcp context`
- ✨ Amélioration de l'interface de la commande `/dcp context` :
  - Affichage du nombre d'outils élagués
  - Amélioration de la précision de la barre de progression

**Optimisation des Performances**
- 🚀 Optimisation du calcul des tokens dans la commande context

---

## [v1.2.4] - 20/01/2026

**Nouvelles Fonctionnalités**
- ✨ Unification des commandes DCP en une seule commande `/dcp` (structure de sous-commandes) :
  - `/dcp` - Affiche l'aide
  - `/dcp context` - Analyse du contexte
  - `/dcp stats` - Statistiques
- ✨ Ajout de la section de configuration `commands` :
  - Possibilité d'activer/désactiver les commandes slash
  - Support pour la configuration de la liste des outils protégés

**Améliorations**
- 📝 Simplification de l'interface de la commande context
- 📝 Mise à jour de la documentation : clarification du mécanisme d'injection de l'outil context_info

**Corrections**
- 🐛 Correction du traitement des erreurs de pruning des outils (lève une erreur en cas d'échec au lieu de retourner une chaîne)

**Documentation**
- 📚 Ajout des statistiques de taux de réussite du cache au README

---

## [v1.2.3] - 16/01/2026

**Nouvelles Fonctionnalités**
- ✨ Simplification du chargement des prompts (déplacement des prompts vers les fichiers TS)

**Améliorations**
- 🔧 Compatibilité Gemini : utilisation de `thoughtSignature` pour contourner la vérification de l'injection de la section tool

---

## [v1.2.2] - 15/01/2026

**Corrections**
- 🐛 Simplification du moment d'injection (attente du tour de l'assistant)
- 🐛 Correction de compatibilité Gemini : utilisation de l'injection de texte pour éviter les erreurs de signature de pensée

---

## [v1.2.1] - 14/01/2026

**Corrections**
- 🐛 Modèles Anthropic : demande d'un bloc de raisonnement avant l'injection de contexte
- 🐛 GitHub Copilot : saut de l'injection de messages synthétiques avec rôle utilisateur

---

## [v1.2.0] - 13/01/2026

**Nouvelles Fonctionnalités**
- ✨ Ajout de `plan_enter` et `plan_exit` à la liste des outils protégés par défaut
- ✨ Support de l'outil question pour le pruning

**Améliorations**
- 🔧 Unification du mécanisme d'injection (avec vérification isAnthropic)
- 🔧 Aplatissement de la structure du répertoire des prompts
- 🔧 Simplification et unification de l'ordre des vérifications dans prune.ts
- 🔧 Extraction du gestionnaire de prompts système vers hooks.ts

**Corrections**
- 🐛 Saut de l'injection de prompts système pour les sessions de sous-agent
- 🐛 GitHub Copilot : saut de l'injection quand le dernier message est de rôle utilisateur

---

## [v1.1.6] - 12/01/2026

**Corrections**
- 🐛 **Correction critique pour les utilisateurs GitHub Copilot** : utilisation de l'injection de messages assistant complétés et de parties d'outils pour injecter la liste des outils prunables

**Impact**
- Cette correction résout un problème critique rencontré par les utilisateurs de GitHub Copilot lors de l'utilisation de DCP

---

## [v1.1.5] - 10/01/2026

**Nouvelles Fonctionnalités**
- ✨ Ajout du support JSON Schema pour l'autocomplétion de configuration
- ✨ Ajout de la configuration des patterns de fichiers protégés (protectedFilePatterns)
- ✨ Support de la protection des opérations de fichiers via les patterns glob

**Améliorations**
- 📝 Documentation : documentation des limitations des sous-agents

**Corrections**
- 🐛 Correction de l'URL du schéma pour utiliser la branche master
- 🐛 Ajout de `$schema` à la liste des clés de configuration valides

---

## [v1.1.4] - 06/01/2026

**Corrections**
- 🐛 Suppression du flag `isInternalAgent` (en raison d'une condition de concurrence dans l'ordre des hooks)

**Améliorations**
- 🔧 Optimisation de la logique de détection des agents internes

---

## [v1.1.3] - 05/01/2026

**Corrections**
- 🐛 Saut de l'injection DCP pour les agents internes (title, summary, compaction)
- 🐛 Désactivation du pruning des outils write/edit

**Améliorations**
- 🔧 Amélioration de la détection des restrictions des sous-agents

---

## [v1.1.2] - 26/12/2025

**Améliorations**
- 🔧 Fusion de la distillation en une notification unique
- 🔧 Simplification de l'interface de distillation

---

## [v1.1.1] - 25/12/2025

**Nouvelles Fonctionnalités**
- ✨ Ajout de la stratégie purge errors, pour élaguer les entrées après un appel d'outil échoué
- ✨ Ajout du support de l'outil skill à `extractParameterKey`

**Améliorations**
- 📝 Amélioration du texte de remplacement pour l'élagage des erreurs
- 📝 Documentation : mise à jour des notes sur le context poisoning et OAuth

---

## [v1.1.0] - 24/12/2025

**Nouvelles Fonctionnalités**
- ✨ Mise à jour majeure de fonctionnalités
- ✨ Ajout de stratégies d'élagage automatique :
  - Stratégie de déduplication
  - Stratégie d'écrasement
  - Stratégie de purge des erreurs

**Nouveaux Outils**
- ✨ Outils d'élagage pilotés par LLM :
  - `discard` - Supprime le contenu de l'outil
  - `extract` - Extrait les découvertes clés

**Système de Configuration**
- ✨ Support de configuration multi-niveaux (global/variable d'environnement/projet)
- ✨ Fonctionnalité de protection des tours
- ✨ Configuration des outils protégés

---

## [v1.0.4] - 18/12/2025

**Corrections**
- 🐛 Ne pas élaguer les entrées des outils en attente ou en cours d'exécution

**Améliorations**
- 🔧 Optimisation de la logique de détection de l'état des outils

---

## [v1.0.3] - 18/12/2025

**Nouvelles Fonctionnalités**
- ✅ Détection de compression basée sur les messages

**Améliorations**
- 🔧 Vérification du timestamp de compression lors de l'initialisation de la session

---

## [v1.0.2] - 17/12/2025

**Nouvelles Fonctionnalités**
- ✅ Détection de compression basée sur les messages

**Améliorations**
- 🔧 Nettoyage de la structure du code

---

## [v1.0.1] - 16/12/2025

**Version Initiale**

- ✅ Implémentation des fonctionnalités de base
- ✅ Intégration du plugin OpenCode
- ✅ Capacités basiques d'élagage de contexte

---

## Règles de Nommage des Versions

- **Numéro de version majeure** (ex. 1.x) - Mises à jour majeures incompatibles
- **Numéro de version mineure** (ex. 1.2.x) - Ajouts de fonctionnalités rétrocompatibles
- **Numéro de révision** (ex. 1.2.7) - Corrections de bugs rétrocompatibles

---

## Obtenir la Dernière Version

Nous recommandons d'utiliser le tag `@latest` dans votre configuration OpenCode pour garantir la récupération automatique de la dernière version :

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

Consultez les dernières versions publiées : [package npm](https://www.npmjs.com/package/@tarquinen/opencode-dcp)
