---
title: "Référence des commandes CLI : liste complète des commandes et paramètres | Tutoriel Agent App Factory"
sidebarTitle: "Référence des commandes CLI"
subtitle: "Référence des commandes CLI : liste complète des commandes et description des paramètres"
description: "Référence complète des commandes CLI d'Agent App Factory, incluant la description des paramètres et des exemples d'utilisation pour les commandes init, run, continue, status, list et reset, vous aidant à maîtriser rapidement l'outil en ligne de commande."
tags:
  - "CLI"
  - "Ligne de commande"
  - "Référence"
order: 210
---

# Référence des commandes CLI : liste complète des commandes et description des paramètres

Ce chapitre fournit une référence complète des commandes de l'outil CLI d'Agent App Factory.

## Aperçu des commandes

| Commande | Fonction | Scénario d'utilisation |
| ----- | ---- | ---- |
| `factory init` | Initialiser un projet Factory | Démarrer un nouveau projet |
| `factory run [stage]` | Exécuter le pipeline | Exécuter ou continuer le pipeline |
| `factory continue` | Continuer dans une nouvelle session | Économiser les tokens, exécution par sessions |
| `factory status` | Afficher l'état du projet | Comprendre la progression actuelle |
| `factory list` | Lister tous les projets | Gérer plusieurs projets |
| `factory reset` | Réinitialiser l'état du projet | Redémarrer le pipeline |

---

## factory init

Initialiser le répertoire courant comme projet Factory.

### Syntaxe

```bash
factory init [options]
```

### Paramètres

| Paramètre | Raccourci | Type | Requis | Description |
| ---- | ----- | ---- | ---- | ---- |
| `--name` | `-n` | string | Non | Nom du projet |
| `--description` | `-d` | string | Non | Description du projet |

### Description de la fonction

Après avoir exécuté la commande `factory init`, le système va :

1. Vérifier la sécurité du répertoire (uniquement les fichiers de configuration comme `.git`, `.gitignore`, `README.md` sont autorisés)
2. Créer le répertoire `.factory/`
3. Copier les fichiers suivants dans `.factory/` :
   - `agents/` - Fichiers de définition des agents
   - `skills/` - Modules de compétences
   - `policies/` - Documents de stratégie
   - `templates/` - Modèles de configuration
   - `pipeline.yaml` - Définition du pipeline
4. Générer `config.yaml` et `state.json`
5. Générer `.claude/settings.local.json` (configuration des permissions Claude Code)
6. Essayer d'installer les plugins requis :
   - superpowers (nécessaire pour l'étape Bootstrap)
   - ui-ux-pro-max-skill (nécessaire pour l'étape UI)
7. Démarrer automatiquement l'assistant IA (Claude Code ou OpenCode)

### Exemples

**Initialiser un projet avec un nom et une description** :

```bash
factory init --name "Todo App" --description "Une application de liste de tâches simple"
```

**Initialiser un projet dans le répertoire courant** :

```bash
factory init
```

### Notes importantes

- Le répertoire doit être vide ou ne contenir que des fichiers de configuration (`.git`, `.gitignore`, `README.md`)
- Si le répertoire `.factory/` existe déjà, il sera suggéré d'utiliser `factory reset` pour réinitialiser

---

## factory run

Exécuter le pipeline, à partir de l'étape actuelle ou de l'étape spécifiée.

### Syntaxe

```bash
factory run [stage] [options]
```

### Paramètres

| Paramètre | Raccourci | Type | Requis | Description |
| ---- | ----- | ---- | ---- | ---- |
| `stage` | - | string | Non | Nom de l'étape du pipeline (bootstrap/prd/ui/tech/code/validation/preview) |

### Options

| Option | Raccourci | Type | Description |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | Ignorer les invites de confirmation |

### Description de la fonction

Après avoir exécuté la commande `factory run`, le système va :

1. Vérifier s'il s'agit d'un projet Factory
2. Lire `config.yaml` et `state.json`
3. Afficher l'état actuel du pipeline
4. Déterminer l'étape cible (spécifiée par paramètre ou étape actuelle)
5. Détecter le type d'assistant IA (Claude Code / Cursor / OpenCode)
6. Générer les instructions d'exécution pour l'assistant correspondant
7. Afficher la liste des étapes disponibles et la progression

### Exemples

**Exécuter le pipeline à partir de l'étape bootstrap** :

```bash
factory run bootstrap
```

**Continuer l'exécution à partir de l'étape actuelle** :

```bash
factory run
```

**Exécuter directement sans confirmation** :

```bash
factory run bootstrap --force
```

### Exemple de sortie

```
Agent Factory - Pipeline Runner

Pipeline Status:
────────────────────────────────────────
Project: Todo App
Status: Running
Current Stage: bootstrap
Completed: 

🤖 Claude Code Instructions:
──────────────────────────
This is an Agent Factory project. To execute the pipeline:

1. Read pipeline definition:
   Read(/path/to/.factory/pipeline.yaml)

2. Read orchestrator agent:
   Read(/path/to/.factory/agents/orchestrator.checkpoint.md)

3. Read project config:
   Read(/path/to/.factory/config.yaml)

Then execute the pipeline starting from: bootstrap

────────────────────────────────────────
Available stages:
  ○ bootstrap
  ○ prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

────────────────────────────────────────
Ready! Follow instructions above to continue.
```

---

## factory continue

Continuer l'exécution du pipeline dans une nouvelle session, économisant les tokens.

### Syntaxe

```bash
factory continue
```

### Description de la fonction

Après avoir exécuté la commande `factory continue`, le système va :

1. Vérifier s'il s'agit d'un projet Factory
2. Lire `state.json` pour obtenir l'état actuel
3. Régénérer la configuration des permissions Claude Code
4. Démarrer une nouvelle fenêtre Claude Code
5. Continuer l'exécution à partir de l'étape actuelle

### Scénarios d'utilisation

- Éviter l'accumulation de tokens après chaque étape
- Chaque étape bénéficie d'un contexte propre
- Permettre la reprise après interruption

### Exemples

**Continuer l'exécution du pipeline** :

```bash
factory continue
```

### Notes importantes

- Nécessite Claude Code installé
- Démarre automatiquement une nouvelle fenêtre Claude Code

---

## factory status

Afficher l'état détaillé du projet Factory actuel.

### Syntaxe

```bash
factory status
```

### Description de la fonction

Après avoir exécuté la commande `factory status`, le système affiche :

- Nom du projet, description, chemin, date de création
- État du pipeline (idle/running/waiting_for_confirmation/paused/failed/completed)
- Étape actuelle
- Liste des étapes terminées
- Progression de chaque étape
- État du fichier d'entrée (input/idea.md)
- État du répertoire des artefacts (artifacts/)
- Nombre et taille des fichiers d'artefacts

### Exemples

```bash
factory status
```

### Exemple de sortie

```
Agent Factory - Project Status

Project:
  Name: Todo App
  Description: Une application de liste de tâches simple
  Path: /Users/user/Projects/todo-app
  Created: 2026-01-29T10:00:00.000Z

Pipeline:
  Status: Running
  Current Stage: prd
  Completed: bootstrap

Progress:
  ✓ bootstrap
  → prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

Input:
  File: input/idea.md
  Lines: 25
  Preview:
    # Todo App

    Une application de liste de tâches simple...

Artifacts:
  ✓ prd (3 files, 12.5 KB)

────────────────────────────────────────
Commands:
  factory run     - Run pipeline
  factory run <stage> - Run from stage
  factory reset  - Reset pipeline state
```

---

## factory list

Lister tous les projets Factory.

### Syntaxe

```bash
factory list
```

### Description de la fonction

Après avoir exécuté la commande `factory list`, le système va :

1. Rechercher dans les répertoires de projets courants (`~/Projects`, `~/Desktop`, `~/Documents`, `~`)
2. Rechercher dans le répertoire courant et ses répertoires parents (jusqu'à 3 niveaux)
3. Lister tous les projets contenant un répertoire `.factory/`
4. Afficher l'état des projets (triés par : en cours, en attente, échoué, terminé)

### Exemples

```bash
factory list
```

### Exemple de sortie

```
Agent Factory - Projects

Found 2 project(s):

◉ Todo App
  Une application de liste de tâches simple
  Path: /Users/user/Projects/todo-app
  Stage: prd

○ Blog System
  Système de blog
  Path: /Users/user/Projects/blog
  Completed: bootstrap

────────────────────────────────────────
Work on a project: cd <path> && factory run
```

---

## factory reset

Réinitialiser l'état du pipeline du projet actuel, en conservant les artefacts.

### Syntaxe

```bash
factory reset [options]
```

### Options

| Option | Raccourci | Type | Description |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | Ignorer la confirmation |

### Description de la fonction

Après avoir exécuté la commande `factory reset`, le système va :

1. Vérifier s'il s'agit d'un projet Factory
2. Afficher l'état actuel
3. Confirmer la réinitialisation (sauf si `--force` est utilisé)
4. Réinitialiser `state.json` à l'état initial
5. Mettre à jour la section pipeline de `config.yaml`
6. Conserver tous les artefacts du répertoire `artifacts/`

### Scénarios d'utilisation

- Recommencer à partir de l'étape bootstrap
- Effacer les erreurs d'état
- Reconfigurer le pipeline

### Exemples

**Réinitialiser l'état du projet** :

```bash
factory reset
```

**Réinitialiser directement sans confirmation** :

```bash
factory reset --force
```

### Notes importantes

- Seul l'état du pipeline est réinitialisé, les artefacts ne sont pas supprimés
- Pour supprimer complètement un projet, vous devez supprimer manuellement les répertoires `.factory/` et `artifacts/`

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Commande | Chemin du fichier | Lignes |
| ----- | --------- | ---- |
| Point d'entrée CLI | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 17-122 |
| Commande init | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| Commande run | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-335 |
| Commande continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |
| Commande status | [`cli/commands/status.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/status.js) | 1-203 |
| Commande list | [`cli/commands/list.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/list.js) | 1-160 |
| Commande reset | [`cli/commands/reset.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/reset.js) | 1-100 |

**Fonctions clés** :
- `getFactoryRoot()` - Obtenir le répertoire racine Factory (factory.js:22-52)
- `isFactoryProject()` - Vérifier s'il s'agit d'un projet Factory (init.js:22-26)
- `generateConfig()` - Générer la configuration du projet (init.js:58-76)
- `launchClaudeCode()` - Démarrer Claude Code (init.js:119-147)
- `launchOpenCode()` - Démarrer OpenCode (init.js:152-215)
- `detectAIAssistant()` - Détecter le type d'assistant IA (run.js:105-124)
- `updateState()` - Mettre à jour l'état du pipeline (run.js:94-100)

**Bibliothèques dépendantes** :
- `commander` - Analyse des paramètres CLI
- `chalk` - Sortie terminal en couleur
- `ora` - Animation de chargement
- `inquirer` - Invites interactives
- `yaml` - Analyse des fichiers YAML
- `fs-extra` - Opérations sur le système de fichiers

</details>
