---
title: "Démarrage Rapide : De l'Idée à l'Application | Tutoriel AI App Factory"
sidebarTitle: "5 Minutes pour Démarrer"
subtitle: "Démarrage Rapide : De l'Idée à l'Application"
description: "Découvrez comment AI App Factory transforme les idées de produits en applications MVP exécutables via un pipeline en 7 étapes. Ce tutoriel couvre la valeur fondamentale, les prérequis, l'initialisation du projet, le démarrage du pipeline et l'exécution du code—vous permettant de démarrer avec la génération d'applications pilotée par l'IA en seulement 5 minutes. Automatisation de bout en bout, mécanisme de points de contrôle et code prêt pour la production, incluant le code frontend et backend, les tests, la documentation et la configuration CI/CD."
tags:
  - "Démarrage Rapide"
  - "MVP"
  - "Génération IA"
prerequisite: []
order: 10
---

# Démarrage Rapide : De l'Idée à l'Application

## Ce Que Vous Apprendrez

Après avoir terminé cette leçon, vous serez capable de :

- Comprendre comment AI App Factory vous aide à transformer rapidement vos idées en applications exécutables
- Compléter l'initialisation de votre premier projet Factory
- Lancer le pipeline et suivre les 7 étapes pour générer votre première application MVP

## Votre Situation Actuelle

**"J'ai une idée de produit mais je ne sais pas par où commencer"**

Vous êtes-vous déjà retrouvé dans cette situation :
- Avoir une idée de produit mais ne pas savoir comment la décomposer en exigences actionnables
- Frontend, backend, base de données, tests, déploiement... chaque tâche prend du temps
- Vouloir valider rapidement une idée, mais la configuration de l'environnement de développement prend plusieurs jours
- Réaliser après avoir écrit le code que la compréhension des exigences était erronée, et devoir tout recommencer

AI App Factory existe pour résoudre ces problèmes.

## Quand Utiliser Cette Approche

AI App Factory est adapté pour ces scénarios :

- ✅ **Valider rapidement les idées de produits** : Vouloir tester si cette idée est réalisable
- ✅ **Phase 0-1 d'un projet de startup** : Besoin de livrer rapidement un prototype démontrable
- ✅ **Outils internes et systèmes de gestion** : Pas besoin de permissions complexes, simple et pratique
- ✅ **Apprendre les meilleures pratiques de développement full-stack** : Voir comment l'IA génère du code de niveau production

Non adapté pour ces scénarios :

- ❌ **Systèmes d'entreprise complexes** : Multi-locataires, systèmes de permissions, haute concurrence
- ❌ **Projets nécessitant une UI hautement personnalisée** : Projets avec des systèmes de design uniques
- ❌ **Systèmes avec des exigences de temps réel extrêmes** : Jeux, visioconférences, etc.

## 🎯 Concept Fondamental

AI App Factory est un système intelligent de génération d'applications basé sur des points de contrôle, qui, via un pipeline collaboratif multi-agents, transforme automatiquement votre idée de produit en une application exécutable complète incluant le code frontend et backend, les tests et la documentation.

**Trois Valeurs Fondamentales** :

### 1. Automatisation de Bout en Bout

De l'idée au code, entièrement automatisé :
- Entrée : Une description en une phrase de votre idée de produit
- Sortie : Application frontend et backend complète (Express + Prisma + React Native)
- Processus intermédiaire : Compléter automatiquement l'analyse des exigences, la conception UI, l'architecture technique et la génération de code

### 2. Mécanisme de Points de Contrôle

Pause après avoir complété chaque étape et attendre votre confirmation :
- ✅ Empêche l'accumulation d'erreurs, assurant que chaque étape répond aux attentes
- ✅ Vous pouvez ajuster la direction à tout moment, évitant de découvrir trop tard que vous êtes sur la mauvaise voie
- ✅ Retour automatique en arrière en cas d'échec, évitant de perdre du temps sur du code incorrect

### 3. Prêt pour la Production

Génère non pas du code jouet, mais des applications prêtes pour la production qui peuvent être mises en ligne directement :
- ✅ Code frontend et backend complet
- ✅ Tests unitaires et tests d'intégration (couverture >60%)
- ✅ Documentation API (Swagger/OpenAPI)
- ✅ Données de seed de base de données
- ✅ Configuration de déploiement Docker
- ✅ Pipeline CI/CD (GitHub Actions)
- ✅ Gestion des erreurs et surveillance des logs
- ✅ Optimisation des performances et vérifications de sécurité

**Pipeline en 7 Étapes** :

```
Bootstrap → PRD → UI → Tech → Code → Validation → Preview
    ↓          ↓    ↓     ↓      ↓         ↓          ↓
Idée       Exigences UI   Archi-  Génération Validation Guide de
Structurée Produit  Design tecture Code      Qualité      Déploiement
```

## 🎒 Préparation Avant de Commencer

### Outils Essentiels

**1. Node.js >= 16.0.0**

```bash
# Vérifier la version de Node.js
node --version
```

Si non installé ou version trop ancienne, téléchargez et installez depuis [nodejs.org](https://nodejs.org/).

**2. Assistant de Programmation IA (Obligatoire)** ⚠️ Important

Les définitions d'Agent et les fichiers Skill de AI App Factory sont des instructions IA au format Markdown et doivent être interprétés et exécutés via un assistant IA. Ces pipelines ne peuvent pas être exécutés manuellement par des humains.

Outils recommandés :

- **Claude Code** (https://claude.ai/code) - Recommandé ⭐
- **OpenCode** ou autres assistants IA supportant le mode Agent

::: warning Pourquoi Devez-Vous Utiliser un Assistant IA ?
Le cœur de ce projet est un système d'Agent IA. Chaque étape nécessite un assistant IA pour :
- Lire les fichiers `.agent.md` pour comprendre leurs tâches
- Charger les fichiers Skill correspondants pour acquérir des connaissances
- Suivre strictement les instructions pour générer du code et de la documentation

Les humains ne peuvent pas remplacer ce processus, tout comme vous ne pouvez pas exécuter du code Python avec le Bloc-notes.
:::

**3. Installer l'Outil CLI Globalement**

```bash
npm install -g agent-app-factory
```

Vérifier l'installation :

```bash
factory --version
```

Vous devriez voir le numéro de version s'afficher.

### Préparer l'Idée de Produit

Passez 5 minutes à écrire votre idée de produit. Plus la description est détaillée, plus l'application générée répondra à vos attentes.

**Exemple de bonne description** :

> ✅ Une application qui aide les débutants en fitness à enregistrer leurs entraînements, supportant l'enregistrement des types d'exercice (course, natation, salle de sport), de la durée, des calories brûlées, et permettant de visualiser les statistiques d'entraînement de la semaine. Pas besoin de collaboration multi-utilisateur, pas d'analyse de données, axé sur l'enregistrement personnel.

**Exemple de mauvaise description** :

> ❌ Faire une application de fitness.

## Suivez le Guide

### Étape 1 : Créer le Répertoire du Projet

Créez un répertoire vide n'importe où :

```bash
mkdir my-first-app && cd my-first-app
```

### Étape 2 : Initialiser le Projet Factory

Exécutez la commande d'initialisation :

```bash
factory init
```

**Pourquoi**
Cela crée le répertoire `.factory/` et copie tous les fichiers Agent, Skill et Policy nécessaires, faisant du répertoire actuel un projet Factory.

**Vous devriez voir** :

```
✓ Répertoire .factory/ créé
✓ Copié agents/, skills/, policies/, pipeline.yaml
✓ Fichiers de configuration générés : config.yaml, state.json
✓ Configuration des permissions Claude Code générée : .claude/settings.local.json
✓ Tentative d'installation des plugins requis (superpowers, ui-ux-pro-max)
```

Si vous voyez des messages d'erreur, veuillez vérifier :
- Le répertoire est-il vide (ou ne contient-il que des fichiers de configuration)
- La version de Node.js est-elle >= 16.0.0
- agent-app-factory est-il installé globalement

::: tip Structure des Répertoires
Après initialisation, la structure de votre répertoire devrait être :

```
my-first-app/
├── .factory/
│   ├── agents/              # Fichiers de définition des Agents
│   ├── skills/              # Modules de connaissances réutilisables
│   ├── policies/            # Politiques et spécifications
│   ├── pipeline.yaml         # Définition du pipeline
│   ├── config.yaml          # Configuration du projet
│   └── state.json           # État du pipeline
└── .claude/
    └── settings.local.json  # Configuration des permissions Claude Code
```
:::

### Étape 3 : Lancer le Pipeline

Dans un assistant IA (Claude Code recommandé), exécutez l'instruction suivante :

```
Veuillez lire pipeline.yaml et agents/orchestrator.checkpoint.md,
lancer le pipeline, et m'aider à transformer cette idée de produit en une application exécutable :

[Collez votre idée de produit ici]
```

**Pourquoi**
Cela demande au planificateur Sisyphus de démarrer le pipeline, en commençant par l'étape Bootstrap, et de transformer votre idée en code étape par étape.

**Vous devriez voir** :

L'assistant IA va :
1. Lire pipeline.yaml et orchestrator.checkpoint.md
2. Afficher l'état actuel (idle → running)
3. Démarrer l'Agent Bootstrap et commencer à structurer votre idée de produit

### Étape 4 : Suivre les 7 Étapes

Le système exécutera les 7 étapes suivantes, **en faisant une pause après chaque étape et en demandant votre confirmation** :

#### Étape 1 : Bootstrap - Structurer l'Idée de Produit

**Entrée** : Votre description de produit
**Sortie** : `input/idea.md` (document produit structuré)

**Contenu à confirmer** :
- Définition du problème : Quel problème cela résout-il ?
- Utilisateurs cibles : Qui rencontre ce problème ?
- Valeur fondamentale : Pourquoi ce produit est-il nécessaire ?
- Hypothèses clés : Quelles sont vos hypothèses ?

**Vous devriez voir** :

L'assistant IA demandera :

```
✓ Étape Bootstrap terminée
Document généré : input/idea.md

Veuillez confirmer :
1. Continuer vers l'étape suivante
2. Réessayer l'étape actuelle (fournir des suggestions de modification)
3. Mettre le pipeline en pause
```

Lisez attentivement `input/idea.md`. Si quelque chose ne correspond pas, choisissez "Réessayer" et fournissez des suggestions de modification.

#### Étape 2 : PRD - Générer le Document d'Exigences Produit

**Entrée** : `input/idea.md`
**Sortie** : `artifacts/prd/prd.md`

**Contenu à confirmer** :
- Scénarios utilisateur : Comment les utilisateurs utiliseront-ils ce produit ?
- Liste des fonctionnalités : Quelles fonctionnalités principales doivent être implémentées ?
- Non-objectifs : Définir explicitement ce qui ne sera pas fait (prévenir l'expansion du périmètre)

#### Étape 3 : UI - Concevoir la Structure UI et le Prototype

**Entrée** : `artifacts/prd/prd.md`
**Sortie** : `artifacts/ui/ui.schema.yaml` + Prototype HTML visualisable

**Contenu à confirmer** :
- Structure des pages : Quelles pages existe-t-il ?
- Flux d'interaction : Comment l'utilisateur opère-t-il ?
- Design visuel : Schéma de couleurs, polices, mise en page

**Fonctionnalité** : Système de design ui-ux-pro-max intégré (67 styles, 96 palettes de couleurs, 100 règles sectorielles)

#### Étape 4 : Tech - Concevoir l'Architecture Technique

**Entrée** : `artifacts/prd/prd.md`
**Sortie** : `artifacts/tech/tech.md` + `artifacts/backend/prisma/schema.prisma`

**Contenu à confirmer** :
- Stack technique : Quelles technologies utiliser ?
- Modèle de données : Quelles tables existe-t-il ? Quels sont les champs ?
- Conception API : Quels points de terminaison API existe-t-il ?

#### Étape 5 : Code - Générer le Code Complet

**Entrée** : Schéma UI + Conception Tech + Schéma Prisma
**Sortie** : `artifacts/backend/` + `artifacts/client/`

**Contenu à confirmer** :
- Code backend : Express + Prisma + TypeScript
- Code frontend : React Native + TypeScript
- Tests : Vitest (backend) + Jest (frontend)
- Fichiers de configuration : package.json, tsconfig.json, etc.

#### Étape 6 : Validation - Valider la Qualité du Code

**Entrée** : Code généré
**Sortie** : `artifacts/validation/report.md`

**Contenu à confirmer** :
- Installation des dépendances : npm install a-t-il réussi ?
- Vérification des types : La compilation TypeScript a-t-elle réussi ?
- Validation Prisma : Le schéma de base de données est-il correct ?

#### Étape 7 : Preview - Générer le Guide de Déploiement

**Entrée** : Code complet
**Sortie** : `artifacts/preview/README.md` + `GETTING_STARTED.md`

**Contenu à confirmer** :
- Instructions d'exécution locale : Comment démarrer le frontend et le backend localement ?
- Déploiement Docker : Comment déployer avec Docker ?
- Configuration CI/CD : Comment configurer GitHub Actions ?

### Point de Contrôle ✅

Après avoir terminé les 7 étapes, vous devriez voir :

```
✓ Toutes les étapes du pipeline terminées
Artefacts finaux :
- artifacts/prd/prd.md (Document d'Exigences Produit)
- artifacts/ui/ui.schema.yaml (Conception UI)
- artifacts/tech/tech.md (Architecture Technique)
- artifacts/backend/ (Code backend)
- artifacts/client/ (Code frontend)
- artifacts/validation/report.md (Rapport de Validation)
- artifacts/preview/GETTING_STARTED.md (Guide d'Exécution)

Prochaine étape : Consulter artifacts/preview/GETTING_STARTED.md pour démarrer l'application
```

Félicitations ! Votre première application générée par l'IA est terminée.

### Étape 5 : Exécuter l'Application Générée

Suivez le guide généré pour exécuter l'application :

```bash
# Backend
cd artifacts/backend
npm install
npm run dev

# Ouvrir une nouvelle fenêtre de terminal, exécuter le frontend
cd artifacts/client
npm install
npm run web  # Version Web
# ou
npm run ios      # Simulateur iOS
# ou
npm run android  # Simulateur Android
```

**Vous devriez voir** :
- Le backend démarre sur `http://localhost:3000`
- Le frontend démarre sur `http://localhost:8081` (Version Web) ou s'ouvre dans le simulateur

## Alertes aux Pièges

### ❌ Erreur 1 : Répertoire Non Vide

**Message d'erreur** :

```
✗ Répertoire non vide, veuillez nettoyer et réessayer
```

**Cause** : Le répertoire contient déjà des fichiers lors de l'initialisation

**Solution** :

```bash
# Méthode 1 : Nettoyer le répertoire (conserver uniquement les fichiers de configuration cachés)
ls -a    # Voir tous les fichiers
rm -rf !(.*)

# Méthode 2 : Créer un nouveau répertoire
mkdir new-app && cd new-app
factory init
```

### ❌ Erreur 2 : L'Assistant IA Ne Comprend Pas les Instructions

**Symptôme d'erreur** : L'assistant IA signale l'erreur "Impossible de trouver la définition de l'Agent"

**Cause** : Exécution hors du répertoire du projet Factory

**Solution** :

```bash
# Assurez-vous d'être dans le répertoire racine du projet contenant .factory/
ls -la  # Devrait pouvoir voir .factory/
pwd     # Confirmer le répertoire actuel
```

### ❌ Erreur 3 : CLI Claude Non Installé

**Message d'erreur** :

```
✗ CLI Claude non installé, veuillez visiter https://claude.ai/code pour télécharger
```

**Solution** :

Téléchargez et installez Claude Code CLI depuis https://claude.ai/code.

## Résumé de la Leçon

Dans cette leçon, vous avez appris :

- **Valeur fondamentale de AI App Factory** : Automatisation de bout en bout + mécanisme de points de contrôle + prêt pour la production
- **Pipeline en 7 étapes** : Bootstrap → PRD → UI → Tech → Code → Validation → Preview
- **Comment initialiser un projet** : Commande `factory init`
- **Comment démarrer le pipeline** : Exécuter les instructions dans un assistant IA
- **Comment suivre le pipeline** : Confirmer après chaque étape, en s'assurant que la sortie répond aux attentes

**Points clés** :
- Doit être utilisé avec un assistant IA (Claude Code recommandé)
- Fournir des descriptions de produits claires et détaillées
- Confirmer attentivement à chaque point de contrôle pour éviter l'accumulation d'erreurs
- Le code généré est de niveau production et peut être utilisé directement

## Aperçu de la Prochaine Leçon

> Dans la prochaine leçon, nous apprendrons **[Installation et Configuration](../installation/)**.
>
> Vous apprendrez :
> - Comment installer globalement Agent Factory CLI
> - Comment configurer l'assistant IA (Claude Code / OpenCode)
> - Comment installer les plugins requis (superpowers, ui-ux-pro-max)

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Fonctionnalité           | Chemin du Fichier                                                                                      | Plage de Lignes |
| ------------------------ | ------------------------------------------------------------------------------------------------------ | --------------- |
| Point d'entrée CLI       | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)         | 1-123           |
| Implémentation commande init | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | -               |
| Implémentation commande run  | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js)    | -               |
| Implémentation commande continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | -               |
| Définition du Pipeline   | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)              | -               |
| Définition du Planificateur | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | -               |

**Configurations clés** :
- `pipeline.yaml` : Définit la séquence du pipeline en 7 étapes et les entrées/sorties de chaque étape
- `.factory/state.json` : Maintient l'état d'exécution du pipeline (idle/running/waiting_for_confirmation/paused/failed)

**Flux principal** :
- `factory init` → Créer le répertoire `.factory/`, copier les fichiers Agent, Skill, Policy
- `factory run` → Lire `state.json`, détecter le type d'assistant IA, générer les instructions pour l'assistant
- `factory continue` → Régénérer la configuration des permissions Claude Code, démarrer une nouvelle session pour continuer l'exécution

</details>
