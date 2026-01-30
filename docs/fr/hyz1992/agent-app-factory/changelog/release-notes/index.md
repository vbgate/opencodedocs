---
title: "Journal des modifications : historique des versions et changements de fonctionnalités | Agent App Factory"
sidebarTitle: "Journal des modifications"
subtitle: "Journal des modifications : historique des versions et changements de fonctionnalités | Agent App Factory"
description: "Découvrez l'historique des versions, les changements de fonctionnalités, les corrections de bugs et les améliorations majeures d'Agent App Factory. Cette page détaille l'historique complet des modifications depuis la version 1.0.0, incluant le système de pipeline à 7 étapes, le planificateur Sisyphus, la gestion des permissions, l'optimisation du contexte et les stratégies de gestion des échecs."
tags:
  - "Journal des modifications"
  - "Historique des versions"
prerequisite: []
order: 250
---

# Journal des modifications

Cette page enregistre l'historique des versions d'Agent App Factory, incluant les nouvelles fonctionnalités, les améliorations, les corrections de bugs et les changements destructifs.

Le format respecte la norme [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) et les numéros de version suivent [Semantic Versioning](https://semver.org/lang/zh-CN/).

## [1.0.0] - 2024-01-29

### Nouveautés

**Fonctionnalités principales**
- **Système de pipeline à 7 étapes** : processus automatisé complet de l'idée à l'application fonctionnelle
  - Bootstrap - structure l'idée de produit (input/idea.md)
  - PRD - génère le document de spécification du produit (artifacts/prd/prd.md)
  - UI - conçoit la structure de l'interface et des prototypes prévisualisables (artifacts/ui/)
  - Tech - conçoit l'architecture technique et le modèle de données Prisma (artifacts/tech/)
  - Code - génère le code frontend et backend (artifacts/backend/, artifacts/client/)
  - Validation - valide la qualité du code (artifacts/validation/report.md)
  - Preview - génère le guide de déploiement (artifacts/preview/README.md)

- **Planificateur Sisyphus** : composant de contrôle principal du pipeline
  - Exécute séquentiellement chaque Stage défini dans pipeline.yaml
  - Vérifie les entrées/sorties et les critères de sortie de chaque étape
  - Maintient l'état du pipeline (.factory/state.json)
  - Effectue des vérifications de permission pour empêcher les agents de lire/écrire hors de leurs droits
  - Gère les situations anormales selon la stratégie de gestion des échecs
  - Suspend à chaque point de contrôle, attendant confirmation humaine avant de continuer

**Outils CLI**
- `factory init` - Initialise un projet Factory
- `factory run [stage]` - Exécute le pipeline (depuis l'étape actuelle ou spécifiée)
- `factory continue` - Continue l'exécution dans une nouvelle session (économise des tokens)
- `factory status` - Vérifie l'état du projet actuel
- `factory list` - Liste tous les projets Factory
- `factory reset` - Réinitialise l'état du projet actuel

**Permissions et sécurité**
- **Matrice des capacités** (capability.matrix.md) : définit des autorisations de lecture/écriture strictes pour chaque agent
  - Chaque agent ne peut accéder qu'aux répertoires autorisés
  - Les fichiers écrits sans autorisation sont déplacés vers artifacts/_untrusted/
  - Suspend automatiquement le pipeline après échec, attendant intervention humaine

**Optimisation du contexte**
- **Exécution par sous-session** : chaque étape s'exécute dans une nouvelle session
  - Évite l'accumulation de contexte, économise des tokens
  - Supporte la reprise après interruption
  - Compatible avec tous les assistants IA (Claude Code, OpenCode, Cursor)

**Stratégies de gestion des échecs**
- Mécanisme de réessai automatique : chaque étape autorise une tentative de réessai
- Archivage des échecs : les artefacts échoués sont déplacés vers artifacts/_failed/
- Mécanisme de rollback : retour au dernier point de contrôle réussi
- Intervention humaine : suspension après deux échecs consécutifs

**Assurance qualité**
- **Normes de code** (code-standards.md)
  - Conventions de codage TypeScript et meilleures pratiques
  - Structure des fichiers et conventions de nommage
  - Exigences de commentaires et de documentation
  - Convention des messages de commit Git (Conventional Commits)

- **Convention des codes d'erreur** (error-codes.md)
  - Structure unifiée des codes d'erreur : [MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - Types d'erreur standard : VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - Mapping des codes d'erreur frontend/backend et messages utilisateurs conviviaux

**Gestion du Changelog**
- Respecte le format Keep a Changelog
- Intégré avec Conventional Commits
- Support d'outils automatisés : conventional-changelog-cli, release-it

**Modèles de configuration**
- Configuration CI/CD (GitHub Actions)
- Configuration Git Hooks (Husky)

**Caractéristiques des applications générées**
- Code frontend et backend complet (Express + Prisma + React Native)
- Tests unitaires et tests d'intégration (Vitest + Jest)
- Documentation API (Swagger/OpenAPI)
- Données de seed de base de données
- Configuration de déploiement Docker
- Gestion des erreurs et surveillance des logs
- Optimisation des performances et vérifications de sécurité

### Améliorations

**Focus MVP**
- Liste explicite des Non-Goals pour éviter l'expansion de la portée
- Nombre de pages limité à 3 maximum
- Concentration sur les fonctionnalités principales, éviter la sur-conception

**Séparation des responsabilités**
- Chaque agent est responsable uniquement de son domaine, ne dépasse pas les limites
- La PRD ne contient pas de détails techniques, Tech n'implique pas la conception UI
- L'agent Code implémente strictement selon le schéma UI et la conception Tech

**Vérifiabilité**
- Chaque étape définit des exit_criteria clairs
- Toutes les fonctionnalités sont testables et exécutables localement
- Les artefacts doivent être structurés et consommables en aval

### Stack technique

**Outils CLI**
- Node.js >= 16.0.0
- Commander.js - Framework de ligne de commande
- Chalk - Sortie terminal en couleur
- Ora - Indicateur de progression
- Inquirer - Ligne de commande interactive
- fs-extra - Opérations système de fichiers
- YAML - Parsing YAML

**Applications générées**
- Backend : Node.js + Express + Prisma + TypeScript + Vitest
- Frontend : React Native + Expo + TypeScript + Jest + React Testing Library
- Déploiement : Docker + GitHub Actions

### Dépendances

- `chalk@^4.1.2` - Styles de couleur terminal
- `commander@^11.0.0` - Parsing des arguments de ligne de commande
- `fs-extra@^11.1.1` - Extensions système de fichiers
- `inquirer@^8.2.5` - Ligne de commande interactive
- `ora@^5.4.1` - Loader terminal élégant
- `yaml@^2.3.4` - Parsing et sérialisation YAML

## Notes de version

### Semantic Versioning

Ce projet suit le format de numérotation de version [Semantic Versioning](https://semver.org/lang/zh-CN/) : MAJOR.MINOR.PATCH

- **MAJOR** : Changements d'API incompatibles
- **MINOR** : Nouvelles fonctionnalités rétrocompatibles
- **PATCH** : Corrections de bugs rétrocompatibles

### Types de modifications

- **Nouveautés** (Added) : Nouvelles fonctionnalités
- **Modifications** (Changed) : Changements de fonctionnalités existantes
- **Obsolètes** (Deprecated) : Fonctionnalités devant être supprimées
- **Supprimés** (Removed) : Fonctionnalités supprimées
- **Corrections** (Fixed) : Corrections de bugs
- **Sécurité** (Security) : Corrections de sécurité

## Ressources connexes

- [GitHub Releases](https://github.com/hyz1992/agent-app-factory/releases) - Page de publication officielle
- [Dépôt du projet](https://github.com/hyz1992/agent-app-factory) - Code source
- [Suivi des problèmes](https://github.com/hyz1992/agent-app-factory/issues) - Signaler des problèmes et suggestions
- [Guide de contribution](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - Comment contribuer

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Dernière mise à jour : 2024-01-29

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json) | 1-52 |
| Point d'entrée CLI | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 1-123 |
| Commande d'initialisation | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-427 |
| Commande d'exécution | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-294 |
| Commande de continuation | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-87 |
| Définition du pipeline | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 1-87 |
| Définition du planificateur | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Matrice des capacités | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-44 |
| Stratégie d'échec | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-200 |
| Normes de code | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-287 |
| Convention des codes d'erreur | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-134 |
| Norme Changelog | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md) | 1-87 |

**Informations clés de version** :
- `version = "1.0.0"` : Version de publication initiale
- `engines.node = ">=16.0.0"` : Version minimale de Node.js requise

**Versions des dépendances** :
- `chalk@^4.1.2` : Styles de couleur terminal
- `commander@^11.0.0` : Parsing des arguments de ligne de commande
- `fs-extra@^11.1.1` : Extensions système de fichiers
- `inquirer@^8.2.5` : Ligne de commande interactive
- `ora@^5.4.1` : Loader terminal élégant
- `yaml@^2.3.4` : Parsing et sérialisation YAML

</details>
