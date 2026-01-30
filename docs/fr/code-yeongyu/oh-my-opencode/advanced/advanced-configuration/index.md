---
title: "Configuration avancée : Agents et permissions | oh-my-opencode"
sidebarTitle: "Contrôler le comportement des agents"
subtitle: "Configuration avancée : Agents et permissions | oh-my-opencode"
description: "Apprenez la configuration des agents, les paramètres de permissions, la substitution de modèles et la modification des invites d'oh-my-opencode. Créez l'équipe de développement IA la plus adaptée à vos besoins grâce à une personnalisation approfondie, en contrôlant précisément le comportement et les capacités de chaque agent."
tags:
  - "configuration"
  - "agents"
  - "permissions"
  - "customization"
prerequisite:
  - "start-installation"
  - "platforms-provider-setup"
order: 140
---

# Configuration approfondie : Gestion des agents et des permissions

## Ce que vous serez capable de faire

- Personnaliser le modèle et les paramètres utilisés par chaque agent
- Contrôler précisément les permissions des agents (édition de fichiers, exécution Bash, requêtes Web, etc.)
- Ajouter des instructions supplémentaires aux agents via `prompt_append`
- Créer des catégories personnalisées pour réaliser des combinaisons dynamiques d'agents
- Activer/désactiver des agents, compétences, hooks et MCP spécifiques

## Vos difficultés actuelles

**La configuration par défaut fonctionne bien, mais ne correspond pas exactement à vos besoins :**
- Oracle utilise le GPT 5.2 qui est trop coûteux, vous souhaitez utiliser un modèle moins cher
- L'agent Explore ne devrait pas avoir la permission d'écrire des fichiers, seulement rechercher
- Vous voulez que Librarian recherche en priorité la documentation officielle plutôt que GitHub
- Un certain Hook génère toujours de fausses alertes, vous souhaitez le désactiver temporairement

**Ce dont vous avez besoin est une "personnalisation approfondie"** — pas juste "ça fonctionne", mais "exactement ce qu'il vous faut".

---

## 🎒 Préparation avant de commencer

::: warning Prérequis
Ce tutoriel suppose que vous avez terminé [l'installation](../../start/installation/) et la [configuration du Provider](../../platforms/provider-setup/).
:::

**Ce que vous devez savoir** :
- Emplacement du fichier de configuration : `~/.config/opencode/oh-my-opencode.json` (niveau utilisateur) ou `.opencode/oh-my-opencode.json` (niveau projet)
- La configuration au niveau utilisateur a priorité sur celle au niveau projet

---

## Idée principale

**Priorité de configuration** : Configuration utilisateur > Configuration projet > Configuration par défaut

```
~/.config/opencode/oh-my-opencode.json (priorité la plus élevée)
    ↓ remplace
.opencode/oh-my-opencode.json (niveau projet)
    ↓ remplace
Valeurs par défaut intégrées d'oh-my-opencode (priorité la plus faible)
```

**Les fichiers de configuration prennent en charge JSONC** :
- Peut utiliser `//` pour ajouter des commentaires
- Peut utiliser `/* */` pour ajouter des commentaires de bloc
- Peut avoir des virgules finales

---

## Suivez-moi

### Étape 1 : Trouver le fichier de configuration et activer l'auto-complétion du Schema

**Pourquoi**
Après avoir activé le JSON Schema, l'éditeur vous suggérera automatiquement tous les champs et types disponibles, évitant ainsi les erreurs de configuration.

**Opérations** :

```jsonc
{
  // Ajoutez cette ligne pour activer l'auto-complétion
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  
  // Votre configuration...
}
```

**Ce que vous devriez voir** :
- Dans VS Code / JetBrains et autres éditeurs, après avoir tapé `{`, tous les champs disponibles seront suggérés automatiquement
- En survolant un champ avec la souris, la description et le type s'afficheront

---

### Étape 2 : Personnaliser les modèles d'agents

**Pourquoi**
Différentes tâches nécessitent différents modèles :
- **Conception d'architecture** : Utiliser le modèle le plus puissant (Claude Opus 4.5)
- **Exploration rapide** : Utiliser le modèle le plus rapide (Grok Code)
- **Conception d'interface** : Utiliser un modèle visuel (Gemini 3 Pro)
- **Contrôle des coûts** : Utiliser des modèles moins chers pour des tâches simples

**Opérations** :

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle : Conseiller stratégique, utilise GPT 5.2
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1  // Faible température, plus déterministe
    },

    // Explore : Exploration rapide, utilise un modèle gratuit
    "explore": {
      "model": "opencode/gpt-5-nano",  // Gratuit
      "temperature": 0.3
    },

    // Librarian : Recherche de documentation, utilise un modèle avec grand contexte
    "librarian": {
      "model": "anthropic/claude-sonnet-4-5"
    },

    // Multimodal Looker : Analyse multimédia, utilise Gemini
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

**Ce que vous devriez voir** :
- Chaque agent utilise un modèle différent, optimisé selon les caractéristiques de la tâche
- Après avoir enregistré la configuration, le prochain appel à l'agent correspondant utilisera le nouveau modèle


---

### Étape 3 : Configurer les permissions des agents

**Pourquoi**
Certains agents **ne devraient pas** avoir toutes les permissions :
- Oracle (conseiller stratégique) : Lecture seule, n'a pas besoin d'écrire des fichiers
- Librarian (expert en recherche) : Lecture seule, n'a pas besoin d'exécuter Bash
- Explore (exploration) : Lecture seule, n'a pas besoin de requêtes Web

**Opérations** :

```jsonc
{
  "agents": {
    "explore": {
      // Interdire l'écriture de fichiers et l'exécution Bash, autoriser uniquement la recherche Web
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"
      }
    },

    "librarian": {
      // Permissions en lecture seule
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Nécessaire pour rechercher la documentation
      }
    },

    "oracle": {
      // Permissions en lecture seule
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Nécessaire pour consulter des ressources
      }
    },

    // Sisyphus : Orchestrateur principal, peut exécuter toutes les opérations
    "sisyphus": {
      "permission": {
        "edit": "allow",
        "bash": "allow",
        "webfetch": "allow"
      }
    }
  }
}
```

**Description des permissions** :

| Permission           | Valeur            | Description                                               |
|--- | --- | ---|
| `edit`         | `ask/allow/deny` | Permission d'édition de fichiers                                    |
| `bash`         | `ask/allow/deny` ou objet | Permission d'exécution Bash (peut être affinée par commande spécifique)             |
| `webfetch`     | `ask/allow/deny` | Permission de requêtes Web                                  |
| `doom_loop`    | `ask/allow/deny` | Autoriser l'agent à contourner la détection de boucle infinie                   |
| `external_directory` | `ask/allow/deny` | Permission d'accès aux répertoires hors projet                         |

**Affiner les permissions Bash** :

```jsonc
{
  "agents": {
    "explore": {
      "permission": {
        "bash": {
          "git": "allow",      // Autoriser l'exécution des commandes git
          "grep": "allow",     // Autoriser l'exécution de grep
          "rm": "deny",       // Interdire la suppression de fichiers
          "mv": "deny"        // Interdire le déplacement de fichiers
        }
      }
    }
  }
}
```

**Ce que vous devriez voir** :
- Après avoir configuré les permissions, les tentatives des agents d'exécuter des opérations désactivées seront automatiquement rejetées
- Dans OpenCode, vous verrez un message indiquant que la permission a été refusée

---

### Étape 4 : Utiliser prompt_append pour ajouter des instructions supplémentaires

**Pourquoi**
Les invites système par défaut sont déjà très bonnes, mais vous pourriez avoir des **besoins spécifiques** :
- Faire en sorte que Librarian recherche prioritairement une documentation spécifique
- Faire en sorte qu'Oracle suive un modèle d'architecture spécifique
- Faire en sorte qu'Explore utilise des mots-clés de recherche spécifiques

**Opérations** :

```jsonc
{
  "agents": {
    "librarian": {
      // Ajouté après l'invite système par défaut, ne la remplace pas
      "prompt_append": "Always use elisp-dev-mcp for Emacs Lisp documentation lookups. " +
                      "When searching for docs, prioritize official documentation over blog posts."
    },

    "oracle": {
      "prompt_append": "Follow SOLID principles and Clean Architecture patterns. " +
                    "Always suggest TypeScript types for all function signatures."
    },

    "explore": {
      "prompt_append": "When searching code, prioritize recent commits and actively maintained files. " +
                    "Ignore test files unless explicitly asked."
    }
  }
}
```

**Ce que vous devriez voir** :
- Le comportement des agents change, mais ils conservent leurs capacités d'origine
- Par exemple, Oracle suggérera toujours des types TypeScript lors des demandes


---

### Étape 5 : Personnaliser la configuration Category

**Pourquoi**
Category est une nouvelle fonctionnalité de v3.0, réalisant des **combinaisons dynamiques d'agents** :
- Préconfigurer des modèles et des paramètres pour des types de tâches spécifiques
- Appel rapide via `delegate_task(category="...")`
- Plus efficace que "sélection manuelle du modèle + rédaction d'invite"

**Opérations** :

```jsonc
{
  "categories": {
    // Personnalisé : Tâches de science des données
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "prompt_append": "Focus on data analysis, ML pipelines, and statistical methods. " +
                      "Use pandas/numpy for Python and dplyr/tidyr for R."
    },

    // Remplacer la valeur par défaut : Tâches d'interface utilisateur utilisant une invite personnalisée
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "prompt_append": "Use shadcn/ui components and Tailwind CSS. " +
                      "Ensure responsive design and accessibility."
    },

    // Remplacer la valeur par défaut : Tâches rapides
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1,
      "prompt_append": "Be concise. Focus on simple fixes and quick searches."
    }
  }
}
```

**Champs de configuration Category** :

| Champ              | Description                         | Exemple                              |
|--- | --- | ---|
| `model`           | Modèle utilisé                   | `"anthropic/claude-sonnet-4-5"`    |
| `temperature`     | Température (0-2)                 | `0.2` (déterministe) / `0.8` (créatif)    |
| `top_p`           | Échantillonnage noyau (0-1)               | `0.9`                              |
| `maxTokens`       | Nombre maximal de tokens               | `4000`                             |
| `thinking`        | Configuration Thinking               | `{"type": "enabled", "budgetTokens": 16000}` |
| `prompt_append`    | Ajout d'invite                   | `"Use X for Y"`                    |
| `tools`           | Permissions des outils                   | `{"bash": false}`                    |
| `is_unstable_agent` | Marquer comme instable (force le mode arrière-plan) | `true`                              |

**Utiliser Category** :

```
// Dans OpenCode
delegate_task(category="data-science", prompt="Analyser cet ensemble de données et générer des visualisations")
delegate_task(category="visual-engineering", prompt="Créer un composant de tableau de bord réactif")
delegate_task(category="quick", prompt="Rechercher la définition de cette fonction")
```

**Ce que vous devriez voir** :
- Différents types de tâches utilisent automatiquement le modèle et la configuration les plus adaptés
- Pas besoin de spécifier manuellement le modèle et les paramètres à chaque fois

---

### Étape 6 : Désactiver des fonctionnalités spécifiques

**Pourquoi**
Certaines fonctionnalités peuvent ne pas convenir à votre flux de travail :
- `comment-checker` : Votre projet autorise les commentaires détaillés
- `agent-usage-reminder` : Vous savez quand utiliser quel agent
- Un certain MCP : Vous n'en avez pas besoin

**Opérations** :

```jsonc
{
  // Désactiver des Hooks spécifiques
  "disabled_hooks": [
    "comment-checker",           // Ne pas vérifier les commentaires
    "agent-usage-reminder",       // Ne pas suggérer l'utilisation d'agents
    "startup-toast"               // Ne pas afficher la notification de démarrage
  ],

  // Désactiver des Skills spécifiques
  "disabled_skills": [
    "playwright",                // Ne pas utiliser Playwright
    "frontend-ui-ux"            // Ne pas utiliser le Skill frontend intégré
  ],

  // Désactiver des MCPs spécifiques
  "disabled_mcps": [
    "websearch",                // Ne pas utiliser la recherche Exa
    "context7",                // Ne pas utiliser Context7
    "grep_app"                 // Ne pas utiliser grep.app
  ],

  // Désactiver des agents spécifiques
  "disabled_agents": [
    "multimodal-looker",        // Ne pas utiliser le multimodal Looker
    "metis"                   // Ne pas utiliser l'analyse pré-planification Metis
  ]
}
```

**Liste des Hooks disponibles** (partielle) :

| Nom du Hook                | Fonction                           |
|--- | ---|
| `todo-continuation-enforcer` | Forcer l'achèvement de la liste TODO              |
| `comment-checker`          | Détecter les commentaires redondants                  |
| `tool-output-truncator`     | Tronquer la sortie des outils pour économiser le contexte        |
| `keyword-detector`         | Détecter les mots-clés comme ultrawork          |
| `agent-usage-reminder`     | Suggérer quel agent utiliser           |
| `session-notification`      | Notification de fin de session                  |
| `background-notification`    | Notification d'achèvement des tâches d'arrière-plan              |

**Ce que vous devriez voir** :
- Les fonctionnalités désactivées ne s'exécutent plus
- Après réactivation, les fonctionnalités sont restaurées


---

### Étape 7 : Configurer le contrôle de concurrence des tâches d'arrière-plan

**Pourquoi**
Les tâches d'arrière-plan parallèles nécessitent un **contrôle du nombre de concurrences** :
- Éviter la limitation des API
- Contrôler les coûts (les modèles coûteux ne peuvent pas avoir trop de concurrences)
- Respecter les quotas des Providers

**Opérations** :

```jsonc
{
  "background_task": {
    // Nombre maximal de concurrences par défaut
    "defaultConcurrency": 5,

    // Limites de concurrence au niveau Provider
    "providerConcurrency": {
      "anthropic": 3,      // Anthropic API maximum 3 concurrences
      "openai": 5,         // OpenAI API maximum 5 concurrences
      "google": 10          // Gemini API maximum 10 concurrences
    },

    // Limites de concurrence au niveau modèle (priorité la plus élevée)
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,     // Opus est trop coûteux, limiter à 2 concurrences
      "google/gemini-3-flash": 10,          // Flash est très bon marché, autoriser 10 concurrences
      "anthropic/claude-haiku-4-5": 15      // Haiku est encore moins cher, autoriser 15 concurrences
    }
  }
}
```

**Ordre de priorité** :
```
modelConcurrency > providerConcurrency > defaultConcurrency
```

**Ce que vous devriez voir** :
- Les tâches d'arrière-plan dépassant la limite de concurrence attendront en file
- La concurrence des modèles coûteux est limitée, économisant les coûts

---

### Étape 8 : Activer les fonctionnalités expérimentales

**Pourquoi**
Les fonctionnalités expérimentales offrent des **capacités supplémentaires**, mais peuvent être instables :
- `aggressive_truncation` : Troncature de contexte plus agressive
- `auto_resume` : Récupération automatique après un crash
- `truncate_all_tool_outputs` : Tronquer toutes les sorties d'outils

::: danger Avertissement
Les fonctionnalités expérimentales peuvent être supprimées ou leur comportement modifié dans les versions futures. Testez soigneusement avant de les activer.
:::

**Opérations** :

```jsonc
{
  "experimental": {
    // Activer une troncature plus agressive des sorties d'outils
    "aggressive_truncation": true,

    // Récupération automatique depuis les erreurs de bloc thinking
    "auto_resume": true,

    // Tronquer toutes les sorties d'outils (pas seulement Grep/Glob/LSP/AST-Grep)
    "truncate_all_tool_outputs": false
  }
}
```

**Ce que vous devriez voir** :
- En mode agressif, les sorties d'outils sont tronquées plus strictement pour économiser le contexte
- Après avoir activé `auto_resume`, les agents se rétablissent automatiquement et continuent à travailler en cas d'erreur


---

## Point de contrôle ✅

**Vérifier si la configuration prend effet** :

```bash
# Exécuter la commande de diagnostic
bunx oh-my-opencode doctor --verbose
```

**Ce que vous devriez voir** :
- Le résultat de résolution du modèle de chaque agent
- Si vos substitutions de configuration prennent effet
- Si les fonctionnalités désactivées sont correctement identifiées

---

## Attention aux pièges

### 1. Erreur de format de fichier de configuration

**Problème** :
- Erreur de syntaxe JSON (virgule manquante, virgule en trop)
- Erreur d'orthographe du nom de champ (`temperature` écrit `temparature`)

**Solution** :
```bash
# Valider le format JSON
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

### 2. Configuration des permissions trop stricte

**Problème** :
- Certains agents sont complètement désactivés (`edit: "deny"`, `bash: "deny"`)
- Empêchant les agents de fonctionner normalement

**Solution** :
- Les agents en lecture seule (Oracle, Librarian) peuvent désactiver `edit` et `bash`
- L'orchestrateur principal (Sisyphus) a besoin des permissions complètes

### 3. La configuration Category ne prend pas effet

**Problème** :
- Erreur d'orthographe du nom Category (`visual-engineering` écrit `visual-engineering`)
- `delegate_task` ne spécifie pas le paramètre `category`

**Solution** :
- Vérifiez si le nom dans `delegate_task(category="...")` correspond à la configuration
- Utilisez `doctor --verbose` pour vérifier le résultat de résolution Category

### 4. Limite de concurrence trop basse

**Problème** :
- `modelConcurrency` défini trop bas (comme `1`)
- Les tâches d'arrière-plan s'exécutent presque en série, perdant l'avantage du parallélisme

**Solution** :
- Définir raisonnablement en fonction du budget et des quotas d'API
- Modèles coûteux (Opus) limités à 2-3, modèles bon marché (Haiku) peuvent être 10+

---

## Résumé de la leçon

**Personnalisation approfondie de la configuration = Contrôle précis** :

| Élément de configuration           | Usage                          | Scénarios courants                         |
|--- | --- | ---|
| `agents.model`    | Remplacer le modèle d'agent                  | Optimisation des coûts, adaptation des tâches             |
| `agents.permission` | Contrôler les permissions des agents                | Isolation de sécurité, mode lecture seule           |
| `agents.prompt_append` | Ajouter des instructions supplémentaires                | Suivre les normes d'architecture, optimiser les stratégies de recherche |
| `categories`      | Combinaisons dynamiques d'agents                  | Appel rapide de types de tâches spécifiques           |
| `background_task` | Contrôle de concurrence                     | Contrôle des coûts, quotas d'API           |
| `disabled_*`      | Désactiver des fonctionnalités spécifiques                 | Supprimer des fonctionnalités peu utilisées               |

**À retenir** :
- La configuration utilisateur (`~/.config/opencode/oh-my-opencode.json`) a priorité sur celle du projet
- Utilisez JSONC pour rendre la configuration plus lisible
- Exécutez `oh-my-opencode doctor --verbose` pour vérifier la configuration


---

## Aperçu de la prochaine leçon

> La prochaine leçon, nous apprenons **[Diagnostic et dépannage de la configuration](../../faq/troubleshooting/)**.
>
> Vous apprendrez :
> - Utiliser la commande doctor pour les contrôles de santé
> - Diagnostiquer les problèmes de version OpenCode, d'enregistrement de plugins, de configuration Provider, etc.
> - Comprendre le mécanisme de résolution des modèles et la configuration des Categories
> - Utiliser la sortie JSON pour un diagnostic automatisé

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-26

| Fonction                | Chemin du fichier                                                                 | Ligne    |
|--- | --- | ---|
| Définition du Schema de configuration    | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378   |
| AgentOverrideConfig | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 98-119   |
| CategoryConfig      | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172  |
| AgentPermissionSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 11-17    |
| OhMyOpenCodeConfigSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 329-350  |
| Documentation de configuration          | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 1-595   |

**Constantes clés** :
- `PermissionValue = z.enum(["ask", "allow", "deny"])` : Énumération des valeurs de permission

**Types clés** :
- `AgentOverrideConfig` : Configuration de substitution d'agent (modèle, température, invite, etc.)
- `CategoryConfig` : Configuration Category (modèle, température, invite, etc.)
- `AgentPermissionSchema` : Configuration des permissions d'agent (edit, bash, webfetch, etc.)
- `BackgroundTaskConfig` : Configuration de concurrence des tâches d'arrière-plan

**Énumération des agents intégrés** (`BuiltinAgentNameSchema`) :
- `sisyphus`, `prometheus`, `oracle`, `librarian`, `explore`, `multimodal-looker`, `metis`, `momus`, `atlas`

**Énumération des Skills intégrés** (`BuiltinSkillNameSchema`) :
- `playwright`, `agent-browser`, `frontend-ui-ux`, `git-master`

**Énumération des Categories intégrées** (`BuiltinCategoryNameSchema`) :
- `visual-engineering`, `ultrabrain`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`

</details>
