---
title: "Factory Init : Configuration en 3 min | Agent Factory"
sidebarTitle: "Initialisation en 3 min"
subtitle: "Initialiser un projet Factory : configuration en 3 min à partir de zéro"
description: "Apprenez à initialiser rapidement un projet Agent App Factory avec la commande factory init. Ce tutoriel couvre les exigences de répertoire, la structure des fichiers, la configuration des permissions et le lancement de l'assistant IA."
tags:
  - "Initialisation de projet"
  - "factory init"
  - "Structure du répertoire"
prerequisite:
  - "start-installation"
order: 30
---

# Initialiser un projet Factory : configuration en 3 min à partir de zéro

## Ce que vous apprendrez

- Initialiser un projet Factory dans n'importe quel répertoire vide
- Comprendre la structure du répertoire `.factory/` généré
- Configurer les paramètres du projet (stack technique, préférences UI, contraintes MVP)
- Lancer automatiquement l'assistant IA et démarrer le pipeline

## Votre situation actuelle

Vous voulez essayer AI App Factory mais ne savez pas par où commencer ? Vous regardez ce dossier vide sans savoir quels fichiers créer ? Ou vous avez déjà du code mais n'êtes pas sûr de pouvoir l'utiliser ? Pas d'inquiétude, la commande `factory init` s'occupera de tout pour vous.

## Quand utiliser cette méthode

- Première utilisation d'AI App Factory
- Démarrage d'une nouvelle idée de produit
- Besoin d'un environnement de projet Factory propre

## 🎒 Prérequis

::: warning Vérifications préalables

Avant de commencer, veuillez confirmer :

- ✅ [Installation et configuration](../installation/) terminées
- ✅ AI Assistant installé (Claude Code ou OpenCode)
- ✅ Un **répertoire vide** ou ne contenant que des fichiers Git/éditeur

:::

## Concept clé

L'essence de la commande `factory init` est **l'auto-contenance** :

1. Copie tous les fichiers nécessaires (agents, skills, policies, pipeline.yaml) dans le répertoire `.factory/` du projet
2. Génère les fichiers de configuration du projet (`config.yaml` et `state.json`)
3. Configure les permissions de Claude Code (`.claude/settings.local.json`)
4. Installe automatiquement les plugins requis (superpowers, ui-ux-pro-max)
5. Lance l'assistant IA et démarre le pipeline

Ainsi, chaque projet Factory contient tout ce dont il a besoin pour fonctionner, sans dépendance d'installation globale.

::: tip Pourquoi l'auto-contenance ?

Les avantages du design auto-contenu :

- **Isolation de version** : différents projets peuvent utiliser différentes versions de configuration Factory
- **Portabilité** : le répertoire `.factory/` peut être directement commité sur Git et réutilisé par l'équipe
- **Sécurité** : la configuration des permissions ne s'applique qu'au répertoire du projet, sans affecter les autres projets

:::

## Instructions étape par étape

### Étape 1 : Entrer dans le répertoire du projet

**Pourquoi** : un répertoire de travail propre est nécessaire pour stocker l'application générée.

```bash
# Créer un nouveau répertoire
mkdir my-app && cd my-app

# Ou entrer dans un répertoire vide existant
cd /path/to/your/project
```

**Ce que vous devriez voir** : un répertoire vide ou ne contenant que des fichiers autorisés comme `.git/`, `.gitignore`, `README.md`.

### Étape 2 : Exécuter la commande d'initialisation

**Pourquoi** : `factory init` crée le répertoire `.factory/` et copie tous les fichiers nécessaires.

```bash
factory init
```

**Ce que vous devriez voir** :

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
  .factory/
    agents/
    skills/
    templates/
    policies/
    pipeline.yaml
    config.yaml
    state.json

Checking and installing required Claude plugins...
Installing superpowers plugin... ✓
Installing ui-ux-pro-max-skill plugin... ✓
Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

### Étape 3 : Personnaliser avec des paramètres optionnels (optionnel)

**Pourquoi** : si vous avez des préférences de stack technique claires, vous pouvez les spécifier lors de l'initialisation.

```bash
factory init --name "Mon application de comptabilité" --description "Aide les jeunes à enregistrer leurs dépenses quotidiennes"
```

Ces paramètres seront écrits dans `config.yaml` et affecteront le code généré ultérieurement.

### Étape 4 : Vérifier la structure du répertoire générée

**Pourquoi** : confirmer que tous les fichiers ont été générés correctement.

```bash
ls -la
```

**Ce que vous devriez voir** :

```
.claude/              # Répertoire de configuration Claude Code
  └── settings.local.json   # Configuration des permissions

.factory/            # Répertoire principal Factory
  ├── agents/          # Fichiers de définition des agents
  ├── skills/          # Modules de compétences
  ├── templates/       # Modèles de configuration
  ├── policies/        # Politiques et spécifications
  ├── pipeline.yaml    # Définition du pipeline
  ├── config.yaml      # Configuration du projet
  └── state.json      # État du pipeline
```

## Point de contrôle ✅

Assurez-vous que les fichiers suivants ont été créés :

- [ ] `.factory/pipeline.yaml` existe
- [ ] `.factory/config.yaml` existe
- [ ] `.factory/state.json` existe
- [ ] `.claude/settings.local.json` existe
- [ ] Le répertoire `.factory/agents/` contient 7 fichiers `.agent.md`
- [ ] Le répertoire `.factory/skills/` contient 6 modules de compétences
- [ ] Le répertoire `.factory/policies/` contient 7 documents de politiques

## Détails des fichiers générés

### config.yaml : Configuration du projet

`config.yaml` contient les informations de base du projet et l'état du pipeline :

```yaml
project:
  name: my-app                  # Nom du projet
  description: ""                # Description du projet
  created_at: "2026-01-30T00:00:00.000Z"  # Date de création
  updated_at: "2026-01-30T00:00:00.000Z"  # Date de mise à jour

pipeline:
  current_stage: null           # Étape d'exécution actuelle
  completed_stages: []          # Liste des étapes terminées
  last_checkpoint: null         # Dernier point de contrôle

settings:
  auto_save: true               # Sauvegarde automatique
  backup_on_error: true        # Sauvegarde en cas d'erreur
```

::: tip Modifier la configuration

Vous pouvez éditer directement `config.yaml` après `factory init`, puis il prendra effet automatiquement lors de l'exécution du pipeline. Aucune réinitialisation nécessaire.

:::

### state.json : État du pipeline

`state.json` enregistre la progression de l'exécution du pipeline :

```json
{
  "version": 1,
  "status": "idle",
  "current_stage": null,
  "completed_stages": [],
  "started_at": null,
  "last_updated": "2026-01-30T00:00:00.000Z"
}
```

- `status` : état actuel (`idle` lors de l'initialisation, changera dynamiquement en `running`, `waiting_for_confirmation`, `paused`, `failed` lors de l'exécution)
- `current_stage` : étape en cours d'exécution
- `completed_stages` : liste des étapes terminées

::: info Explication des états

Le pipeline fonctionne avec une machine à états, l'état lors de l'initialisation est `idle`. Les autres valeurs d'état sont définies dynamiquement pendant l'exécution :
- `idle` : en attente de démarrage
- `running` : exécution d'une étape
- `waiting_for_confirmation` : attente de confirmation manuelle pour continuer, réessayer ou mettre en pause
- `paused` : pause manuelle
- `failed` : échec détecté, intervention manuelle nécessaire

:::

::: warning Ne pas éditer manuellement

`state.json` est maintenu automatiquement par le pipeline, l'édition manuelle peut entraîner des incohérences d'état. Pour réinitialiser, utilisez la commande `factory reset`.

:::

### pipeline.yaml : Définition du pipeline

Définit l'ordre d'exécution et les dépendances des 7 étapes :

```yaml
stages:
  - id: bootstrap
    description: Initialiser l'idée du projet
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs: [input/idea.md]

  - id: prd
    description: Générer le document de spécifications produit
    agent: agents/prd.agent.md
    inputs: [input/idea.md]
    outputs: [artifacts/prd/prd.md]

  # ... autres étapes
```

::: info Ordre du pipeline

Le pipeline s'exécute strictement en séquence, aucun saut n'est autorisé. Chaque étape se met en pause en attendant la confirmation.

:::

### .claude/settings.local.json : Configuration des permissions

Configuration des permissions Claude Code générée automatiquement, contient :

- **Permissions de manipulation de fichiers** : Read/Write/Glob/Edit pour le répertoire du projet
- **Permissions de commandes Bash** : git, npm, npx, docker, etc.
- **Permissions Skills** : compétences requises comme superpowers, ui-ux-pro-max
- **Permissions WebFetch** : accès autorisé à des domaines spécifiques (GitHub, NPM, etc.)

::: danger Sécurité

La configuration des permissions ne s'applique qu'au répertoire du projet actuel et n'affecte pas les autres emplacements du système. C'est l'un des aspects de conception sécurisée de Factory.

:::

## Pièges à éviter

### Erreur de répertoire non vide

**Message d'erreur** :

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

**Cause** : Présence de fichiers ou répertoires incompatibles (comme `artifacts/`, `input/`, etc.)

**Solution** :

1. Nettoyer les fichiers conflictuels :
   ```bash
   rm -rf artifacts/ input/
   ```

2. Ou utiliser un nouveau répertoire :
   ```bash
   mkdir my-app-new && cd my-app-new
   factory init
   ```

### Déjà un projet Factory

**Message d'erreur** :

```
This directory is already a Factory project:
  Name: my-app
  Created: 2026-01-29T13:00:00.000Z

To reset project, use: factory reset
```

**Cause** : Le répertoire `.factory/` existe déjà

**Solution** :

```bash
# Réinitialiser l'état du projet (conserve les artefacts)
factory reset

# Ou réinitialiser complètement (supprime tout)
rm -rf .factory/
factory init
```

### Claude Code non installé

**Message d'erreur** :

```
Claude CLI not found - skipping plugin installation
Install Claude Code to enable plugins: https://claude.ai/code
```

**Cause** : Le CLI Claude Code n'est pas installé

**Solution** :

1. Installer Claude Code : https://claude.ai/code
2. Ou exécuter manuellement le pipeline (voir [Démarrage rapide](../getting-started/))

### Échec de l'installation des plugins

**Message d'erreur** :

```
Installing superpowers plugin... (failed)
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

**Cause** : Problème réseau ou problème de configuration Claude Code

**Solution** :

Ignorez l'avertissement et continuez. L'étape Bootstrap vous invitera à installer les plugins manuellement.

## Résumé de cette leçon

Dans cette leçon, vous avez appris à :

1. ✅ Utiliser la commande `factory init` pour initialiser un projet Factory
2. ✅ Comprendre la structure du répertoire `.factory/` généré
3. ✅ Connaître les options de configuration de `config.yaml`
4. ✅ Comprendre la gestion des états dans `state.json`
5. ✅ Connaître la configuration des permissions dans `.claude/settings.local.json`

Une fois l'initialisation terminée, le projet est prêt à exécuter le pipeline. Dans la prochaine étape, nous apprendrons l'[Aperçu du pipeline](../pipeline-overview/) pour comprendre le flux complet de l'idée à l'application.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons l'**[Aperçu du pipeline](../pipeline-overview/)**.
>
> Vous apprendrez :
> - L'ordre et les dépendances des 7 étapes
> - Les entrées et sorties de chaque étape
> - Le mécanisme des points de contrôle pour garantir la qualité
> - La gestion des échecs et les stratégies de réessai

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Fonction | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Logique principale init | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 220-456 |
| Vérification de sécurité du répertoire | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 32-53 |
| Génération de configuration | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 58-76 |
| Configuration des permissions Claude | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 41-248 |
| Définition du pipeline | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 7-111 |
| Modèle de configuration du projet | [`config.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/config.yaml) | 1-102 |

**Fonctions clés** :
- `isFactoryProject()` : Vérifie si le répertoire est déjà un projet Factory (lignes 22-26)
- `isDirectorySafeToInit()` : Vérifie si le répertoire peut être initialisé en toute sécurité (lignes 32-53)
- `generateConfig()` : Génère la configuration du projet (lignes 58-76)
- `generateClaudeSettings()` : Génère la configuration des permissions Claude Code (lignes 256-275)

</details>
