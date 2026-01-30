---
title: "Référence de Configuration : Options Complètes | oh-my-opencode"
sidebarTitle: "Guide Complet de Configuration"
subtitle: "Référence de Configuration : Options Complètes"
description: "Découvrez toutes les options de configuration d'oh-my-opencode et les définitions des champs. Couvre les agents, catégories, hooks, tâches en arrière-plan et plus encore pour personnaliser en profondeur votre environnement de développement OpenCode et optimiser votre workflow de codage IA."
tags:
  - "configuration"
  - "reference"
  - "schema"
prerequisite: []
order: 180
---

# Référence de Configuration : Schéma Complet du Fichier de Configuration

Cette page fournit les définitions complètes des champs et les explications du fichier de configuration oh-my-opencode.

::: info Emplacement du Fichier de Configuration
- Niveau projet : `.opencode/oh-my-opencode.json`
- Niveau utilisateur (macOS/Linux) : `~/.config/opencode/oh-my-opencode.json`
- Niveau utilisateur (Windows) : `%APPDATA%\opencode\oh-my-opencode.json`

La configuration au niveau projet a la priorité sur la configuration au niveau utilisateur.
:::

::: tip Activer l'Autocomplétion
Ajoutez le champ `$schema` en haut de votre fichier de configuration pour obtenir l'autocomplétion IDE :

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
}
```
:::

## Champs de Niveau Racine

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `$schema` | string | Non | - | Lien JSON Schema pour l'autocomplétion |
| `disabled_mcps` | string[] | Non | [] | Liste des MCP désactivés |
| `disabled_agents` | string[] | Non | [] | Liste des agents désactivés |
| `disabled_skills` | string[] | Non | [] | Liste des compétences désactivées |
| `disabled_hooks` | string[] | Non | [] | Liste des hooks désactivés |
| `disabled_commands` | string[] | Non | [] | Liste des commandes désactivées |
| `agents` | object | Non | - | Configuration de remplacement des agents |
| `categories` | object | Non | - | Configuration personnalisée des catégories |
| `claude_code` | object | Non | - | Configuration de compatibilité Claude Code |
| `sisyphus_agent` | object | Non | - | Configuration de l'agent Sisyphus |
| `comment_checker` | object | Non | - | Configuration du vérificateur de commentaires |
| `experimental` | object | Non | - | Configuration des fonctionnalités expérimentales |
| `auto_update` | boolean | Non | true | Vérification automatique des mises à jour |
| `skills` | object\|array | Non | - | Configuration des compétences |
| `ralph_loop` | object | Non | - | Configuration Ralph Loop |
| `background_task` | object | Non | - | Configuration de la concurrence des tâches en arrière-plan |
| `notification` | object | Non | - | Configuration des notifications |
| `git_master` | object | Non | - | Configuration de la compétence Git Master |
| `browser_automation_engine` | object | Non | - | Configuration du moteur d'automatisation du navigateur |
| `tmux` | object | Non | - | Configuration de la gestion des sessions Tmux |

## agents - Configuration des Agents

Remplace les paramètres des agents intégrés. Chaque agent prend en charge les champs suivants :

### Champs Généraux des Agents

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `model` | string | Non | Remplace le modèle utilisé par l'agent (obsolète, utilisez category) |
| `variant` | string | Non | Variante du modèle |
| `category` | string | Non | Hérite du modèle et de la configuration depuis une catégorie |
| `skills` | string[] | Non | Liste des compétences injectées dans le prompt de l'agent |
| `temperature` | number | Non | 0-2, contrôle le caractère aléatoire |
| `top_p` | number | Non | 0-1, paramètre d'échantillonnage nucléaire |
| `prompt` | string | Non | Remplace complètement le prompt système par défaut |
| `prompt_append` | string | Non | Ajoute à la fin du prompt par défaut |
| `tools` | object | Non | Remplacement des permissions d'outils (`{toolName: boolean}`) |
| `disable` | boolean | Non | Désactive cet agent |
| `description` | string | Non | Description de l'agent |
| `mode` | enum | Non | `subagent` / `primary` / `all` |
| `color` | string | Non | Couleur hexadécimale (ex. `#FF0000`) |
| `permission` | object | Non | Restrictions de permissions de l'agent |

### permission - Permissions des Agents

| Champ | Type | Requis | Valeurs | Description |
| --- | --- | --- | --- | --- |
| `edit` | string | Non | `ask`/`allow`/`deny` | Permission d'édition de fichiers |
| `bash` | string/object | Non | `ask`/`allow`/`deny` ou par commande | Permission d'exécution Bash |
| `webfetch` | string | Non | `ask`/`allow`/`deny` | Permission de requêtes web |
| `doom_loop` | string | Non | `ask`/`allow`/`deny` | Remplacement de la détection de boucle infinie |
| `external_directory` | string | Non | `ask`/`allow`/`deny` | Permission d'accès aux répertoires externes |

### Liste des Agents Configurables

| Nom de l'Agent | Description |
| --- | --- |
| `sisyphus` | Agent orchestrateur principal |
| `prometheus` | Agent planificateur stratégique |
| `oracle` | Agent conseiller stratégique |
| `librarian` | Agent expert en recherche multi-dépôts |
| `explore` | Agent expert en exploration rapide de codebase |
| `multimodal-looker` | Agent expert en analyse média |
| `metis` | Agent d'analyse pré-planification |
| `momus` | Agent réviseur de planification |
| `atlas` | Agent orchestrateur principal |
| `sisyphus-junior` | Agent exécuteur de tâches généré par catégorie |

### Exemple de Configuration

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": ["git-master"]
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    },
    "multimodal-looker": {
      "disable": true
    }
  }
}
```

## categories - Configuration des Catégories

Définit les catégories (abstractions de modèles) utilisées pour la composition dynamique d'agents.

### Champs des Catégories

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `description` | string | Non | Description de l'objectif de la catégorie (affiché dans le prompt delegate_task) |
| `model` | string | Non | Remplace le modèle utilisé par la catégorie |
| `variant` | string | Non | Variante du modèle |
| `temperature` | number | Non | 0-2, température |
| `top_p` | number | Non | 0-1, échantillonnage nucléaire |
| `maxTokens` | number | Non | Nombre maximum de tokens |
| `thinking` | object | Non | Configuration Thinking `{type, budgetTokens}` |
| `reasoningEffort` | enum | Non | `low` / `medium` / `high` / `xhigh` |
| `textVerbosity` | enum | Non | `low` / `medium` / `high` |
| `tools` | object | Non | Permissions d'outils |
| `prompt_append` | string | Non | Ajout de prompt |
| `is_unstable_agent` | boolean | Non | Marquer comme agent instable (force le mode arrière-plan) |

### Configuration thinking

| Champ | Type | Requis | Valeurs | Description |
| --- | --- | --- | --- | --- |
| `type` | string | Oui | `enabled`/`disabled` | Active ou désactive Thinking |
| `budgetTokens` | number | Non | - | Nombre de tokens budget pour Thinking |

### Catégories Intégrées

| Catégorie | Modèle par Défaut | Temperature | Description |
| --- | --- | --- | --- |
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Tâches frontend, UI/UX, design |
| `ultrabrain` | `openai/gpt-5.2-codex` | 0.1 | Tâches de raisonnement haute intelligence |
| `artistry` | `google/gemini-3-pro` | 0.7 | Tâches créatives et artistiques |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Tâches rapides et économiques |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tâches moyennes non spécifiées |
| `unspecified-high` | `anthropic/claude-opus-4-5` | 0.1 | Tâches haute qualité non spécifiées |
| `writing` | `google/gemini-3-flash` | 0.1 | Tâches de documentation et d'écriture |

### Exemple de Configuration

```jsonc
{
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Data analysis and ML tasks"
    }
  }
}
```

## claude_code - Configuration de Compatibilité Claude Code

Contrôle les différentes fonctionnalités de la couche de compatibilité Claude Code.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `mcp` | boolean | Non | - | Charger ou non le fichier `.mcp.json` |
| `commands` | boolean | Non | - | Charger ou non les commandes |
| `skills` | boolean | Non | - | Charger ou non les compétences |
| `agents` | boolean | Non | - | Charger ou non les agents (réservé) |
| `hooks` | boolean | Non | - | Charger ou non les hooks settings.json |
| `plugins` | boolean | Non | - | Charger ou non les plugins Marketplace |
| `plugins_override` | object | Non | - | Désactiver des plugins spécifiques (`{pluginName: boolean}`) |

### Exemple de Configuration

```jsonc
{
  "claude_code": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "hooks": false,
    "plugins": true,
    "plugins_override": {
      "some-plugin": false
    }
  }
}
```

## sisyphus_agent - Configuration de l'Agent Sisyphus

Contrôle le comportement du système d'orchestration Sisyphus.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `disabled` | boolean | Non | false | Désactive le système d'orchestration Sisyphus |
| `default_builder_enabled` | boolean | Non | false | Active l'agent OpenCode-Builder |
| `planner_enabled` | boolean | Non | true | Active l'agent Prometheus (Planner) |
| `replace_plan` | boolean | Non | true | Rétrograde l'agent plan par défaut en subagent |

### Exemple de Configuration

```jsonc
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

## background_task - Configuration des Tâches en Arrière-plan

Contrôle le comportement de concurrence du système de gestion des agents en arrière-plan.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `defaultConcurrency` | number | Non | - | Nombre maximum de concurrences par défaut |
| `providerConcurrency` | object | Non | - | Limite de concurrence au niveau du fournisseur (`{providerName: number}`) |
| `modelConcurrency` | object | Non | - | Limite de concurrence au niveau du modèle (`{modelName: number}`) |
| `staleTimeoutMs` | number | Non | 180000 | Délai d'expiration (millisecondes), minimum 60000 |

### Ordre de Priorité

`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### Exemple de Configuration

```jsonc
{
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,
      "google/gemini-3-flash": 10
    },
    "staleTimeoutMs": 180000
  }
}
```

## git_master - Configuration de la Compétence Git Master

Contrôle le comportement de la compétence Git Master.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `commit_footer` | boolean | Non | true | Ajoute le footer "Ultraworked with Sisyphus" dans les messages de commit |
| `include_co_authored_by` | boolean | Non | true | Ajoute le trailer "Co-authored-by: Sisyphus" dans les messages de commit |

### Exemple de Configuration

```jsonc
{
  "git_master": {
    "commit_footer": true,
    "include_co_authored_by": true
  }
}
```

## browser_automation_engine - Configuration de l'Automatisation du Navigateur

Sélectionne le fournisseur d'automatisation du navigateur.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `provider` | enum | Non | `playwright` | Fournisseur d'automatisation du navigateur |

### Valeurs Possibles pour provider

| Valeur | Description | Exigences d'Installation |
| --- | --- | --- |
| `playwright` | Utilise le serveur MCP Playwright | Installation automatique |

### Exemple de Configuration

```jsonc
{
  "browser_automation_engine": {
    "provider": "playwright"
  }
}
```

## tmux - Configuration des Sessions Tmux

Contrôle le comportement de la gestion des sessions Tmux.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Non | false | Active ou non la gestion des sessions Tmux |
| `layout` | enum | Non | `main-vertical` | Disposition Tmux |
| `main_pane_size` | number | Non | 60 | Taille du panneau principal (20-80) |
| `main_pane_min_width` | number | Non | 120 | Largeur minimale du panneau principal |
| `agent_pane_min_width` | number | Non | 40 | Largeur minimale du panneau agent |

### Valeurs Possibles pour layout

| Valeur | Description |
| --- | --- |
| `main-horizontal` | Panneau principal en haut, panneaux agents empilés en bas |
| `main-vertical` | Panneau principal à gauche, panneaux agents empilés à droite (par défaut) |
| `tiled` | Grille de panneaux de même taille |
| `even-horizontal` | Tous les panneaux disposés horizontalement |
| `even-vertical` | Tous les panneaux empilés verticalement |

### Exemple de Configuration

```jsonc
{
  "tmux": {
    "enabled": false,
    "layout": "main-vertical",
    "main_pane_size": 60,
    "main_pane_min_width": 120,
    "agent_pane_min_width": 40
  }
}
```

## ralph_loop - Configuration Ralph Loop

Contrôle le comportement du workflow en boucle Ralph Loop.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Non | false | Active ou non la fonctionnalité Ralph Loop |
| `default_max_iterations` | number | Non | 100 | Nombre maximum d'itérations par défaut (1-1000) |
| `state_dir` | string | Non | - | Répertoire personnalisé des fichiers d'état (relatif à la racine du projet) |

### Exemple de Configuration

```jsonc
{
  "ralph_loop": {
    "enabled": false,
    "default_max_iterations": 100,
    "state_dir": ".opencode/"
  }
}
```

## notification - Configuration des Notifications

Contrôle le comportement des notifications système.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `force_enable` | boolean | Non | false | Force l'activation de session-notification, même si un plugin de notification externe est détecté |

### Exemple de Configuration

```jsonc
{
  "notification": {
    "force_enable": false
  }
}
```

## comment_checker - Configuration du Vérificateur de Commentaires

Contrôle le comportement du vérificateur de commentaires.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `custom_prompt` | string | Non | - | Prompt personnalisé, remplace le message d'avertissement par défaut. Utilisez le placeholder `{{comments}}` pour représenter le XML des commentaires détectés |

### Exemple de Configuration

```jsonc
{
  "comment_checker": {
    "custom_prompt": "Please review these redundant comments: {{comments}}"
  }
}
```

## experimental - Configuration des Fonctionnalités Expérimentales

Contrôle l'activation des fonctionnalités expérimentales.

### Champs

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `aggressive_truncation` | boolean | Non | - | Active un comportement de troncature plus agressif |
| `auto_resume` | boolean | Non | - | Active la reprise automatique (récupération des erreurs de bloc de réflexion ou des violations de désactivation de réflexion) |
| `truncate_all_tool_outputs` | boolean | Non | false | Tronque toutes les sorties d'outils, pas seulement les outils en liste blanche |
| `dynamic_context_pruning` | object | Non | - | Configuration de l'élagage dynamique du contexte |

### Configuration dynamic_context_pruning

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Non | false | Active l'élagage dynamique du contexte |
| `notification` | enum | Non | `detailed` | Niveau de notification : `off` / `minimal` / `detailed` |
| `turn_protection` | object | Non | - | Configuration de la protection des tours |
| `protected_tools` | string[] | Non | - | Liste des outils à ne jamais élaguer |
| `strategies` | object | Non | - | Configuration des stratégies d'élagage |

### Configuration turn_protection

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Non | true | Active la protection des tours |
| `turns` | number | Non | 3 | Protège les sorties d'outils des N derniers tours (1-10) |

### Configuration strategies

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `deduplication` | object | Non | - | Configuration de la stratégie de déduplication |
| `supersede_writes` | object | Non | - | Configuration de la stratégie de remplacement d'écriture |
| `purge_errors` | object | Non | - | Configuration de la stratégie de nettoyage des erreurs |

### Configuration deduplication

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Non | true | Supprime les appels d'outils en double (même outil + mêmes paramètres) |

### Configuration supersede_writes

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Non | true | Élague les entrées d'écriture lors de lectures ultérieures |
| `aggressive` | boolean | Non | false | Mode agressif : élague TOUTE écriture si TOUTE lecture ultérieure |

### Configuration purge_errors

| Champ | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | Non | true | Élague les entrées d'outils en erreur après N tours |
| `turns` | number | Non | 5 | Nombre de tours pour élaguer les entrées d'outils en erreur (1-20) |

### Exemple de Configuration

```jsonc
{
  "experimental": {
    "aggressive_truncation": true,
    "auto_resume": true,
    "truncate_all_tool_outputs": false,
    "dynamic_context_pruning": {
      "enabled": false,
      "notification": "detailed",
      "turn_protection": {
        "enabled": true,
        "turns": 3
      },
      "protected_tools": [
        "task",
        "todowrite",
        "todoread",
        "lsp_rename",
        "session_read",
        "session_write",
        "session_search"
      ],
      "strategies": {
        "deduplication": {
          "enabled": true
        },
        "supersede_writes": {
          "enabled": true,
          "aggressive": false
        },
        "purge_errors": {
          "enabled": true,
          "turns": 5
        }
      }
    }
  }
}
```

## skills - Configuration des Compétences

Configure le chargement et le comportement des compétences (Skills).

### Format de Configuration

Les compétences prennent en charge deux formats :

**Format 1 : Tableau Simple**

```jsonc
{
  "skills": ["skill1", "skill2", "skill3"]
}
```

**Format 2 : Configuration Objet**

```jsonc
{
  "skills": {
    "sources": [
      "path/to/skills",
      {
        "path": "another/path",
        "recursive": true,
        "glob": "*.md"
      }
    ],
    "enable": ["skill1", "skill2"],
    "disable": ["skill3"]
  }
}
```

### Champs de Définition des Compétences

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `description` | string | Non | Description de la compétence |
| `template` | string | Non | Modèle de compétence |
| `from` | string | Non | Source |
| `model` | string | Non | Modèle utilisé |
| `agent` | string | Non | Agent utilisé |
| `subtask` | boolean | Non | Est-ce une sous-tâche |
| `argument-hint` | string | Non | Indication d'argument |
| `license` | string | Non | Licence |
| `compatibility` | string | Non | Compatibilité |
| `metadata` | object | Non | Métadonnées |
| `allowed-tools` | string[] | Non | Liste des outils autorisés |
| `disable` | boolean | Non | Désactive cette compétence |

### Compétences Intégrées

| Compétence | Description |
| --- | --- |
| `playwright` | Automatisation du navigateur (par défaut) |
| `agent-browser` | Automatisation du navigateur (Vercel CLI) |
| `frontend-ui-ux` | Design frontend UI/UX |
| `git-master` | Expert Git |

## Listes de Désactivation

Les champs suivants sont utilisés pour désactiver des modules fonctionnels spécifiques.

### disabled_mcps - Liste des MCP Désactivés

```jsonc
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

### disabled_agents - Liste des Agents Désactivés

```jsonc
{
  "disabled_agents": ["oracle", "multimodal-looker"]
}
```

### disabled_skills - Liste des Compétences Désactivées

```jsonc
{
  "disabled_skills": ["playwright"]
}
```

### disabled_hooks - Liste des Hooks Désactivés

```jsonc
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

### disabled_commands - Liste des Commandes Désactivées

```jsonc
{
  "disabled_commands": ["init-deep", "start-work"]
}
```

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonctionnalité | Chemin du Fichier | Lignes |
| --- | --- | --- |
| Définition du schéma de configuration | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-378 |
| JSON Schema | [`assets/oh-my-opencode.schema.json`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/assets/oh-my-opencode.schema.json) | 1-51200 |
| Documentation de configuration | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/docs/configurations.md) | 1-595 |

**Types Clés** :
- `OhMyOpenCodeConfig` : Type de configuration principal
- `AgentOverrideConfig` : Type de configuration de remplacement d'agent
- `CategoryConfig` : Type de configuration de catégorie
- `BackgroundTaskConfig` : Type de configuration de tâche en arrière-plan
- `PermissionValue` : Type de valeur de permission (`ask`/`allow`/`deny`)

**Énumérations Clés** :
- `BuiltinAgentNameSchema` : Énumération des noms d'agents intégrés
- `BuiltinSkillNameSchema` : Énumération des noms de compétences intégrées
- `BuiltinCategoryNameSchema` : Énumération des noms de catégories intégrées
- `HookNameSchema` : Énumération des noms de hooks
- `BrowserAutomationProviderSchema` : Énumération des fournisseurs d'automatisation du navigateur

---

## Aperçu du Prochain Cours

> Dans le prochain cours, nous étudierons **[Serveurs MCP Intégrés](../builtin-mcps/)**.
>
> Vous apprendrez :
> - Les fonctionnalités et méthodes d'utilisation des 3 serveurs MCP intégrés
> - Configuration et meilleures pratiques pour Exa Websearch, Context7, grep.app
> - Comment utiliser MCP pour rechercher de la documentation et du code

</details>
