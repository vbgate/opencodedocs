---
title: "Structure des Répertoires : Guide Complet des Répertoires et Fichiers du Projet Factory | Tutoriel AI App Factory"
sidebarTitle: "Structure des Répertoires"
subtitle: "Structure des Répertoires : Guide Complet du Projet Factory"
description: "Apprenez la structure complète des répertoires et l'utilisation de chaque fichier du projet AI App Factory. Ce tutoriel explique en détail le rôle des répertoires principaux tels que agents, skills, policies, artifacts, et la fonction de chaque fichier, vous aidant à comprendre le fonctionnement du projet Factory, à localiser et modifier rapidement les fichiers de configuration, et à déboguer les problèmes du pipeline."
tags:
  - "Annexe"
  - "Structure des Répertoires"
  - "Architecture du Projet"
prerequisite:
  - "start-init-project"
order: 220
---

# Structure des Répertoires : Guide Complet du Projet Factory

## Ce que vous allez apprendre

- ✅ Comprendre la structure complète des répertoires du projet Factory
- ✅ Connaître l'utilisation de chaque répertoire et fichier
- ✅ Comprendre la méthode de stockage des artefacts
- ✅ Maîtriser le rôle des fichiers de configuration et les méthodes de modification

## Idée centrale

Le projet Factory adopte une structure de répertoires en couches claire, séparant les configurations, le code, les artefacts et la documentation. Comprendre ces structures de répertoires vous aide à localiser rapidement les fichiers, modifier les configurations et déboguer les problèmes.

Le projet Factory présente deux formes :

**Forme 1 : Dépôt source** (celui que vous clonez depuis GitHub)
**Forme 2 : Projet initialisé** (généré par `factory init`)

Ce tutoriel se concentre principalement sur la **Forme 2** — la structure du projet Factory après initialisation, car c'est le répertoire dans lequel vous travaillez quotidiennement.

---

## Structure complète du projet Factory

```
my-app/                          # Répertoire racine de votre projet Factory
├── .factory/                    # Répertoire de configuration principale Factory (ne pas modifier manuellement)
│   ├── pipeline.yaml             # Définition du pipeline (7 étapes)
│   ├── config.yaml               # Fichier de configuration du projet (stack technique, contraintes MVP, etc.)
│   ├── state.json                # État d'exécution du pipeline (étape actuelle, étapes terminées)
│   ├── agents/                   # Définitions des Agents (instructions de tâches des assistants IA)
│   ├── skills/                   # Modules de compétences (connaissances réutilisables)
│   ├── policies/                 # Documents de stratégie (permissions, gestion des échecs, normes de code)
│   └── templates/                # Modèles de configuration (CI/CD, Git Hooks)
├── .claude/                      # Répertoire de configuration Claude Code (généré automatiquement)
│   └── settings.local.json       # Configuration des permissions Claude Code
├── input/                        # Répertoire des entrées utilisateur
│   └── idea.md                   # Idée de produit structurée (générée par Bootstrap)
└── artifacts/                    # Répertoire des artefacts du pipeline (sorties des 7 étapes)
    ├── prd/                      # Artefacts PRD
    │   └── prd.md                # Document des exigences produit
    ├── ui/                       # Artefacts UI
    │   ├── ui.schema.yaml        # Définition de la structure UI
    │   └── preview.web/          # Prototype HTML visualisable
    │       └── index.html
    ├── tech/                     # Artefacts Tech
    │   └── tech.md               # Document d'architecture technique
    ├── backend/                  # Code backend (Express + Prisma)
    │   ├── src/                  # Code source
    │   ├── prisma/               # Configuration base de données
    │   │   ├── schema.prisma     # Modèle de données Prisma
    │   │   └── seed.ts           # Données initiales
    │   ├── tests/                # Tests
    │   ├── docs/                 # Documentation API
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    ├── client/                   # Code frontend (React Native)
    │   ├── src/                  # Code source
    │   ├── __tests__/            # Tests
    │   ├── app.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    ├── validation/               # Artefacts de validation
    │   └── report.md             # Rapport de validation de la qualité du code
    ├── preview/                  # Artefacts Preview
    │   ├── README.md             # Guide de déploiement et d'exécution
    │   └── GETTING_STARTED.md    # Guide de démarrage rapide
    ├── _failed/                  # Archivage des artefacts échoués
    │   └── <stage-id>/           # Artefacts de l'étape échouée
    └── _untrusted/               # Isolation des artefacts non fiables
        └── <stage-id>/           # Fichiers écrits par Agent non autorisé
```

---

## Détails du répertoire .factory/

Le répertoire `.factory/` est le cœur du projet Factory, contenant la définition du pipeline, les configurations des Agents et les documents de stratégie. Ce répertoire est créé automatiquement par la commande `factory init` et ne nécessite généralement pas de modification manuelle.

### pipeline.yaml - Définition du pipeline

**Utilisation** : Définit l'ordre d'exécution des 7 étapes, les entrées/sorties et les conditions de sortie.

**Contenu clé** :
- 7 étapes : bootstrap, prd, ui, tech, code, validation, preview
- Agent, fichiers d'entrée et de sortie pour chaque étape
- Conditions de sortie (exit_criteria) : critères de validation de fin d'étape

**Exemple** :
```yaml
stages:
  - id: bootstrap
    description: Initialisation de l'idée de produit
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs:
      - input/idea.md
    exit_criteria:
      - idea.md existe
      - idea.md décrit une idée de produit cohérente
```

**Quand modifier** : Généralement pas besoin de modification, sauf si vous souhaitez personnaliser le flux du pipeline.

### config.yaml - Fichier de configuration du projet

**Utilisation** : Configure la stack technique, les contraintes MVP, les préférences UI et autres paramètres globaux.

**Principaux éléments de configuration** :
- `preferences` : Préférences de stack technique (langage backend, base de données, framework frontend, etc.)
- `mvp_constraints` : Contrôle de la portée MVP (nombre maximum de pages, nombre maximum de modèles, etc.)
- `ui_preferences` : Préférences de conception UI (direction esthétique, palette de couleurs)
- `pipeline` : Comportement du pipeline (mode checkpoint, gestion des échecs)
- `advanced` : Options avancées (timeout Agent, contrôle de concurrence)

**Exemple** :
```yaml
preferences:
  backend:
    language: typescript
    framework: express
    database: sqlite
  mvp_constraints:
    max_pages: 3
    enable_auth: false
```

**Quand modifier** : Lorsque vous souhaitez ajuster la stack technique ou modifier la portée du MVP.

### state.json - État du pipeline

**Utilisation** : Enregistre l'état d'exécution du pipeline, prend en charge la reprise après interruption.

**Contenu clé** :
- `status` : État actuel (idle/running/waiting_for_confirmation/paused/failed)
- `current_stage` : Étape actuellement en cours d'exécution
- `completed_stages` : Liste des étapes terminées
- `last_updated` : Heure de dernière mise à jour

**Quand modifier** : Mise à jour automatique, ne pas modifier manuellement.

### agents/ - Répertoire des définitions d'Agents

**Utilisation** : Définit les responsabilités de chaque Agent, les entrées/sorties et les contraintes d'exécution.

**Liste des fichiers** :
| Fichier | Description |
|------|------|
| `orchestrator.checkpoint.md` | Définition principale de l'Orchestrateur (coordination du pipeline) |
| `orchestrator-implementation.md` | Guide d'implémentation de l'Orchestrateur (référence développeur) |
| `bootstrap.agent.md` | Agent Bootstrap (structuration de l'idée produit) |
| `prd.agent.md` | Agent PRD (génération du document d'exigences) |
| `ui.agent.md` | Agent UI (conception de prototypes UI) |
| `tech.agent.md` | Agent Tech (conception de l'architecture technique) |
| `code.agent.md` | Agent Code (génération de code) |
| `validation.agent.md` | Agent Validation (validation de la qualité du code) |
| `preview.agent.md` | Agent Preview (génération du guide de déploiement) |

**Quand modifier** : Généralement pas besoin de modification, sauf si vous souhaitez personnaliser le comportement d'un Agent spécifique.

### skills/ - Répertoire des modules de compétences

**Utilisation** : Modules de connaissances réutilisables, chaque Agent charge le fichier Skill correspondant.

**Structure du répertoire** :
```
skills/
├── bootstrap/skill.md         # Structuration de l'idée produit
├── prd/skill.md               # Génération PRD
├── ui/skill.md                # Conception UI
├── tech/skill.md              # Architecture technique + migrations de base de données
├── code/skill.md              # Génération de code + tests + journalisation
│   └── references/            # Modèles de référence pour la génération de code
│       ├── backend-template.md   # Modèle backend production-ready
│       └── frontend-template.md  # Modèle frontend production-ready
└── preview/skill.md           # Configuration de déploiement + guide de démarrage rapide
```

**Quand modifier** : Généralement pas besoin de modification, sauf si vous souhaitez étendre les capacités d'une Skill.

### policies/ - Répertoire des documents de stratégie

**Utilisation** : Définit les permissions, la gestion des échecs, les normes de code et autres stratégies.

**Liste des fichiers** :
| Fichier | Description |
|------|------|
| `capability.matrix.md` | Matrice de limites de capacités (permissions de lecture/écriture des Agents) |
| `failure.policy.md` | Politique de gestion des échecs (retry, rollback, intervention manuelle) |
| `context-isolation.md` | Politique d'isolation du contexte (économie de tokens) |
| `error-codes.md` | Spécification des codes d'erreur unifiés |
| `code-standards.md` | Normes de code (style de codage, structure des fichiers) |
| `pr-template.md` | Modèle de PR et checklist de revue de code |
| `changelog.md` | Spécification de génération du Changelog |

**Quand modifier** : Généralement pas besoin de modification, sauf si vous souhaitez ajuster les stratégies ou normes.

### templates/ - Répertoire des modèles de configuration

**Utilisation** : Modèles de configuration pour CI/CD, Git Hooks, etc.

**Liste des fichiers** :
| Fichier | Description |
|------|------|
| `cicd-github-actions.md` | Configuration CI/CD (GitHub Actions) |
| `git-hooks-husky.md` | Configuration Git Hooks (Husky) |

**Quand modifier** : Généralement pas besoin de modification, sauf si vous souhaitez personnaliser le flux CI/CD.

---

## Détails du répertoire .claude/

### settings.local.json - Configuration des permissions Claude Code

**Utilisation** : Définit les répertoires accessibles et les permissions d'opération pour Claude Code.

**Quand généré** : Généré automatiquement lors de `factory init`.

**Quand modifier** : Généralement pas besoin de modification, sauf si vous souhaitez ajuster la portée des permissions.

---

## Détails du répertoire input/

### idea.md - Idée de produit structurée

**Utilisation** : Stocke l'idée de produit structurée, générée par l'Agent Bootstrap.

**Moment de génération** : Après la fin de l'étape Bootstrap.

**Structure du contenu** :
- Définition du problème (Problem)
- Utilisateurs cibles (Target Users)
- Valeur principale (Core Value)
- Hypothèses (Assumptions)
- Hors périmètre (Out of Scope)

**Quand modifier** : Si vous souhaitez ajuster la direction du produit, vous pouvez éditer manuellement, puis réexécuter Bootstrap ou les étapes suivantes.

---

## Détails du répertoire artifacts/

Le répertoire `artifacts/` est l'emplacement de stockage des artefacts du pipeline, chaque étape écrira les artefacts dans le sous-répertoire correspondant.

### prd/ - Répertoire des artefacts PRD

**Fichiers produits** :
- `prd.md` : Document d'exigences produit

**Contenu** :
- User Stories (User Stories)
- Liste des fonctionnalités (Features)
- Exigences non-fonctionnelles (Non-functional Requirements)
- Hors périmètre (Out of Scope)

**Moment de génération** : Après la fin de l'étape PRD.

### ui/ - Répertoire des artefacts UI

**Fichiers produits** :
- `ui.schema.yaml` : Définition de la structure UI (pages, composants, interactions)
- `preview.web/index.html` : Prototype HTML visualisable

**Contenu** :
- Structure des pages (nombre de pages, mise en page)
- Définition des composants (boutons, formulaires, listes, etc.)
- Flux d'interactions (navigation, redirections)
- Système de design (palette de couleurs, typographie, espacement)

**Moment de génération** : Après la fin de l'étape UI.

**Méthode de prévisualisation** : Ouvrir `preview.web/index.html` dans un navigateur.

### tech/ - Répertoire des artefacts Tech

**Fichiers produits** :
- `tech.md` : Document d'architecture technique

**Contenu** :
- Choix de la stack technique (backend, frontend, base de données)
- Conception du modèle de données
- Conception des endpoints API
- Stratégie de sécurité
- Recommandations d'optimisation des performances

**Moment de génération** : Après la fin de l'étape Tech.

### backend/ - Répertoire du code backend

**Fichiers produits** :
```
backend/
├── src/                      # Code source
│   ├── routes/               # Routes API
│   ├── services/             # Logique métier
│   ├── middleware/           # Middleware
│   └── utils/               # Fonctions utilitaires
├── prisma/                   # Configuration Prisma
│   ├── schema.prisma         # Modèle de données Prisma
│   └── seed.ts              # Données initiales
├── tests/                    # Tests
│   ├── unit/                 # Tests unitaires
│   └── integration/          # Tests d'intégration
├── docs/                     # Documentation
│   └── api-spec.yaml        # Spécification API (Swagger)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

**Contenu** :
- Serveur backend Express
- ORM Prisma (SQLite/PostgreSQL)
- Framework de test Vitest
- Documentation API Swagger

**Moment de génération** : Après la fin de l'étape Code.

### client/ - Répertoire du code frontend

**Fichiers produits** :
```
client/
├── src/                      # Code source
│   ├── screens/              # Écrans
│   ├── components/           # Composants
│   ├── navigation/           # Configuration de navigation
│   ├── services/             # Services API
│   └── utils/               # Fonctions utilitaires
├── __tests__/               # Tests
│   └── components/          # Tests des composants
├── assets/                  # Ressources statiques
├── app.json                 # Configuration Expo
├── package.json
├── tsconfig.json
└── README.md
```

**Contenu** :
- React Native + Expo
- React Navigation
- Jest + React Testing Library
- TypeScript

**Moment de génération** : Après la fin de l'étape Code.

### validation/ - Répertoire des artefacts de validation

**Fichiers produits** :
- `report.md` : Rapport de validation de la qualité du code

**Contenu** :
- Vérification de l'installation des dépendances
- Vérification des types TypeScript
- Validation du schéma Prisma
- Couverture de test

**Moment de génération** : Après la fin de l'étape Validation.

### preview/ - Répertoire des artefacts Preview

**Fichiers produits** :
- `README.md` : Guide de déploiement et d'exécution
- `GETTING_STARTED.md` : Guide de démarrage rapide

**Contenu** :
- Étapes d'exécution locale
- Configuration de déploiement Docker
- Pipeline CI/CD
- Adresses d'accès et flux de démonstration

**Moment de génération** : Après la fin de l'étape Preview.

### _failed/ - Archivage des artefacts échoués

**Utilisation** : Stocke les artefacts des étapes échouées, facilite le débogage.

**Structure du répertoire** :
```
_failed/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**Quand généré** : Après deux échecs consécutifs d'une étape.

### _untrusted/ - Isolation des artefacts non fiables

**Utilisation** : Stocke les fichiers écrits par des Agents non autorisés, empêche la contamination des artefacts principaux.

**Structure du répertoire** :
```
_untrusted/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**Quand généré** : Quand un Agent tente d'écrire dans un répertoire non autorisé.

---

## FAQ

### 1. Puis-je modifier manuellement les fichiers sous .factory/ ?

::: warning Modification prudente
**Non recommandé** de modifier directement les fichiers sous `.factory/`, sauf si vous savez exactement ce que vous faites. Une modification incorrecte peut empêcher le pipeline de fonctionner normalement.

Si vous devez personnaliser les configurations, privilégiez la modification du fichier `config.yaml`.
:::

### 2. Les fichiers sous artifacts/ peuvent-ils être modifiés manuellement ?

**Oui**. Les fichiers sous `artifacts/` sont les artefacts de sortie du pipeline, vous pouvez :

- Modifier `input/idea.md` ou `artifacts/prd/prd.md` pour ajuster la direction du produit
- Réparer manuellement le code dans `artifacts/backend/` ou `artifacts/client/`
- Ajuster les styles dans `artifacts/ui/preview.web/index.html`

Après modification, vous pouvez réexécuter le pipeline à partir de l'étape correspondante.

### 3. Comment traiter les fichiers sous _failed/ et _untrusted/ ?

- **_failed/** : Vérifiez la cause de l'échec, réparez le problème puis réexécutez cette étape.
- **_untrusted/** : Confirmez si le fichier devrait exister, si oui, déplacez-le vers le répertoire correct.

### 4. Que faire si le fichier state.json est corrompu ?

Si `state.json` est corrompu, vous pouvez exécuter la commande suivante pour réinitialiser :

```bash
factory reset
```

### 5. Comment vérifier l'état actuel du pipeline ?

Exécutez la commande suivante pour voir l'état actuel :

```bash
factory status
```

---

## Résumé de cette leçon

Dans cette leçon, nous avons expliqué en détail la structure complète des répertoires du projet Factory :

- ✅ `.factory/` : Configuration principale Factory (pipeline, agents, skills, policies)
- ✅ `.claude/` : Configuration des permissions Claude Code
- ✅ `input/` : Entrées utilisateur (idea.md)
- ✅ `artifacts/` : Artefacts du pipeline (prd, ui, tech, backend, client, validation, preview)
- ✅ `_failed/` et `_untrusted/` : Archivage des artefacts échoués et non fiables

Comprendre ces structures de répertoires vous aide à localiser rapidement les fichiers, modifier les configurations et déboguer les problèmes.

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[les normes de code](../code-standards/)**.
>
> Vous apprendrez :
> - Les normes de codage TypeScript
> - La structure des fichiers et les conventions de nommage
> - Les exigences de commentaires et de documentation
> - Les normes de messages de commit Git
