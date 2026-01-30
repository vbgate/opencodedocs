---
title: "Compatibilité : Intégration Claude Code | oh-my-opencode"
sidebarTitle: "Réutiliser la config Claude Code"
subtitle: "Compatibilité Claude Code : Support complet des Commands, Skills, Agents, MCPs et Hooks"
description: "Découvrez la couche de compatibilité Claude Code d'oh-my-opencode. Maîtrisez le chargement des configurations, les règles de priorité et les options de désactivation pour une migration fluide vers OpenCode."
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Compatibilité Claude Code : Support complet des Commands, Skills, Agents, MCPs et Hooks

## Ce que vous apprendrez

- Utiliser les configurations et plugins Claude Code existants dans OpenCode
- Comprendre les règles de priorité entre différentes sources de configuration
- Contrôler le chargement des fonctionnalités compatibles Claude Code via des options de configuration
- Migrer en douceur de Claude Code vers OpenCode

## Votre situation actuelle

Si vous migrez de Claude Code vers OpenCode, vous avez probablement déjà configuré de nombreuses Commands personnalisées, Skills et serveurs MCP dans le répertoire `~/.claude/`. Reconfigurer tout cela serait fastidieux, et vous aimeriez pouvoir réutiliser ces configurations directement dans OpenCode.

Oh My OpenCode fournit une couche de compatibilité complète avec Claude Code, vous permettant d'utiliser vos configurations et plugins existants sans aucune modification.

## Concept clé

Oh My OpenCode assure la compatibilité avec le format de configuration Claude Code grâce à un **mécanisme de chargement automatique**. Au démarrage, le système analyse automatiquement les répertoires de configuration standard de Claude Code, convertit ces ressources dans un format reconnu par OpenCode et les enregistre dans le système.

La compatibilité couvre les fonctionnalités suivantes :

| Fonctionnalité | État de compatibilité | Description |
| --- | --- | --- |
| **Commands** | ✅ Support complet | Charge les commandes slash depuis `~/.claude/commands/` et `.claude/commands/` |
| **Skills** | ✅ Support complet | Charge les compétences spécialisées depuis `~/.claude/skills/` et `.claude/skills/` |
| **Agents** | ⚠️ Réservé | Interface réservée, seuls les Agents intégrés sont actuellement supportés |
| **MCPs** | ✅ Support complet | Charge la configuration des serveurs MCP depuis `.mcp.json` et `~/.claude/.mcp.json` |
| **Hooks** | ✅ Support complet | Charge les hooks de cycle de vie personnalisés depuis `settings.json` |
| **Plugins** | ✅ Support complet | Charge les plugins Marketplace depuis `installed_plugins.json` |

---

## Priorité de chargement des configurations

Oh My OpenCode supporte le chargement de configurations depuis plusieurs emplacements, fusionnées selon un ordre de priorité fixe. **Les configurations de priorité supérieure écrasent celles de priorité inférieure**.

### Priorité de chargement des Commands

Les Commands sont chargées dans l'ordre suivant (de la plus haute à la plus basse priorité) :

1. `.opencode/command/` (niveau projet, priorité maximale)
2. `~/.config/opencode/command/` (niveau utilisateur)
3. `.claude/commands/` (niveau projet, compatibilité Claude Code)
4. `~/.claude/commands/` (niveau utilisateur, compatibilité Claude Code)

**Emplacement dans le code source** : `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// Charge les Commands depuis 4 répertoires, fusionnées par priorité
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**Exemple** : Si une commande du même nom existe dans `.opencode/command/refactor.md` et `~/.claude/commands/refactor.md`, celle de `.opencode/` sera utilisée.

### Priorité de chargement des Skills

Les Skills sont chargées dans l'ordre suivant (de la plus haute à la plus basse priorité) :

1. `.opencode/skills/*/SKILL.md` (niveau projet, priorité maximale)
2. `~/.config/opencode/skills/*/SKILL.md` (niveau utilisateur)
3. `.claude/skills/*/SKILL.md` (niveau projet, compatibilité Claude Code)
4. `~/.claude/skills/*/SKILL.md` (niveau utilisateur, compatibilité Claude Code)

**Emplacement dans le code source** : `src/features/opencode-skill-loader/loader.ts:206-215`

**Exemple** : Les Skills au niveau projet écrasent celles au niveau utilisateur, garantissant que les besoins spécifiques de chaque projet sont prioritaires.

### Priorité de chargement des MCPs

Les configurations MCP sont chargées dans l'ordre suivant (de la plus haute à la plus basse priorité) :

1. `.claude/.mcp.json` (niveau projet, priorité maximale)
2. `.mcp.json` (niveau projet)
3. `~/.claude/.mcp.json` (niveau utilisateur)

**Emplacement dans le code source** : `src/features/claude-code-mcp-loader/loader.ts:18-27`

**Caractéristique** : Les configurations MCP supportent l'expansion des variables d'environnement (comme `${OPENAI_API_KEY}`), automatiquement résolues via `env-expander.ts`.

**Emplacement dans le code source** : `src/features/claude-code-mcp-loader/env-expander.ts`

### Priorité de chargement des Hooks

Les Hooks sont chargés depuis le champ `hooks` de `settings.json`, supportant les chemins suivants (par priorité) :

1. `.claude/settings.local.json` (configuration locale, priorité maximale)
2. `.claude/settings.json` (niveau projet)
3. `~/.claude/settings.json` (niveau utilisateur)

**Emplacement dans le code source** : `src/hooks/claude-code-hooks/config.ts:46-59`

**Caractéristique** : Les Hooks de plusieurs fichiers de configuration sont automatiquement fusionnés, plutôt que de s'écraser mutuellement.

---

## Options de désactivation

Si vous ne souhaitez pas charger certaines configurations Claude Code, vous pouvez les contrôler finement via le champ `claude_code` dans `oh-my-opencode.json`.

### Désactivation complète de la compatibilité

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### Désactivation partielle

Vous pouvez également désactiver uniquement certaines fonctionnalités :

```jsonc
{
  "claude_code": {
    "mcp": false,         // Désactive les fichiers .mcp.json (conserve les MCPs intégrés)
    "commands": false,     // Désactive ~/.claude/commands/ et .claude/commands/
    "skills": false,       // Désactive ~/.claude/skills/ et .claude/skills/
    "agents": false,       // Désactive ~/.claude/agents/ (conserve les Agents intégrés)
    "hooks": false,        // Désactive les hooks de settings.json
    "plugins": false       // Désactive les plugins Claude Code Marketplace
  }
}
```

**Description des options** :

| Option | Contenu désactivé | Contenu conservé |
| --- | --- | --- |
| `mcp` | Fichiers `.mcp.json` | MCPs intégrés (websearch, context7, grep_app) |
| `commands` | `~/.claude/commands/`, `.claude/commands/` | Commands natives OpenCode |
| `skills` | `~/.claude/skills/`, `.claude/skills/` | Skills natives OpenCode |
| `agents` | `~/.claude/agents/` | Agents intégrés (Sisyphus, Oracle, Librarian, etc.) |
| `hooks` | Hooks de `settings.json` | Hooks intégrés Oh My OpenCode |
| `plugins` | Plugins Claude Code Marketplace | Fonctionnalités de plugins intégrées |

### Désactivation de plugins spécifiques

Utilisez `plugins_override` pour désactiver des plugins Claude Code Marketplace spécifiques :

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Désactive le plugin claude-mem
    }
  }
}
```

**Emplacement dans le code source** : `src/config/schema.ts:143`

---

## Compatibilité du stockage des données

Oh My OpenCode est compatible avec le format de stockage de données de Claude Code, assurant la persistance et la migration des données de session et de tâches.

### Stockage des Todos

- **Emplacement** : `~/.claude/todos/`
- **Format** : Format JSON compatible Claude Code
- **Usage** : Stocke les listes de tâches et les éléments à faire

**Emplacement dans le code source** : `src/features/claude-code-session-state/index.ts`

### Stockage des Transcripts

- **Emplacement** : `~/.claude/transcripts/`
- **Format** : JSONL (un objet JSON par ligne)
- **Usage** : Stocke l'historique des sessions et les enregistrements de messages

**Emplacement dans le code source** : `src/features/claude-code-session-state/index.ts`

**Avantage** : Partage le même répertoire de données que Claude Code, permettant une migration directe de l'historique des sessions.

---

## Intégration des Hooks Claude Code

Le champ `hooks` dans le `settings.json` de Claude Code définit des scripts personnalisés exécutés à des points d'événements spécifiques. Oh My OpenCode supporte entièrement ces Hooks.

### Types d'événements Hook

| Événement | Moment de déclenchement | Actions possibles |
| --- | --- | --- |
| **PreToolUse** | Avant l'exécution d'un outil | Bloquer l'appel d'outil, modifier les paramètres d'entrée, injecter du contexte |
| **PostToolUse** | Après l'exécution d'un outil | Ajouter des avertissements, modifier la sortie, injecter des messages |
| **UserPromptSubmit** | Lors de la soumission d'un prompt | Bloquer le prompt, injecter des messages, transformer le prompt |
| **Stop** | Quand la session devient inactive | Injecter des prompts de suivi, exécuter des tâches automatisées |

**Emplacement dans le code source** : `src/hooks/claude-code-hooks/index.ts`

### Exemple de configuration Hook

Voici une configuration typique de Hooks Claude Code :

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**Description des champs** :

- **matcher** : Motif de correspondance du nom d'outil (supporte le joker `*`)
- **type** : Type de Hook (`command`, `inject`, etc.)
- **command** : Commande shell à exécuter (supporte les variables comme `$FILE`)
- **content** : Contenu du message à injecter

### Mécanisme d'exécution des Hooks

Oh My OpenCode exécute automatiquement ces Hooks personnalisés via le Hook `claude-code-hooks`. Ce Hook vérifie et charge la configuration Claude Code à tous les points d'événements.

**Emplacement dans le code source** : `src/hooks/claude-code-hooks/index.ts:36-401`

**Flux d'exécution** :

1. Charge le `settings.json` de Claude Code
2. Analyse le champ `hooks` et fait correspondre l'événement actuel
3. Exécute les Hooks correspondants dans l'ordre
4. Modifie le comportement de l'agent selon les résultats retournés (bloquer, injecter, avertir, etc.)

**Exemple** : Si un Hook PreToolUse retourne `deny`, l'appel d'outil est bloqué et l'agent reçoit un message d'erreur.

---

## Cas d'utilisation courants

### Scénario 1 : Migration des configurations Claude Code

Si vous avez déjà configuré des Commands et Skills dans Claude Code, vous pouvez les utiliser directement dans OpenCode :

**Étapes** :

1. Assurez-vous que le répertoire `~/.claude/` existe et contient vos configurations
2. Lancez OpenCode, Oh My OpenCode chargera automatiquement ces configurations
3. Tapez `/` dans le chat pour voir les Commands chargées
4. Utilisez les Commands ou invoquez les Skills

**Vérification** : Consultez les logs de démarrage d'Oh My OpenCode pour voir le nombre de configurations chargées.

### Scénario 2 : Surcharge de configuration au niveau projet

Vous souhaitez utiliser des Skills différentes pour un projet spécifique, sans affecter les autres projets :

**Étapes** :

1. Créez le répertoire `.claude/skills/` à la racine du projet
2. Ajoutez une Skill spécifique au projet (ex : `./.claude/skills/my-skill/SKILL.md`)
3. Redémarrez OpenCode
4. La Skill au niveau projet écrasera automatiquement celle au niveau utilisateur

**Avantage** : Chaque projet peut avoir sa propre configuration indépendante, sans interférence.

### Scénario 3 : Désactivation de la compatibilité Claude Code

Vous souhaitez utiliser uniquement les configurations natives OpenCode, sans charger les anciennes configurations Claude Code :

**Étapes** :

1. Éditez `oh-my-opencode.json`
2. Ajoutez la configuration suivante :

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. Redémarrez OpenCode

**Résultat** : Le système ignorera toutes les configurations Claude Code et utilisera uniquement les configurations natives OpenCode.

---

## Pièges à éviter

### ⚠️ Conflits de configuration

**Problème** : Si des configurations du même nom existent à plusieurs emplacements (par exemple, le même nom de Command dans `.opencode/command/` et `~/.claude/commands/`), cela peut entraîner un comportement imprévisible.

**Solution** : Comprenez les priorités de chargement et placez la configuration souhaitée dans le répertoire de plus haute priorité.

### ⚠️ Différences de format de configuration MCP

**Problème** : Le format de configuration MCP de Claude Code diffère légèrement de celui d'OpenCode, une copie directe peut ne pas fonctionner.

**Solution** : Oh My OpenCode convertit automatiquement le format, mais il est recommandé de consulter la documentation officielle pour s'assurer que la configuration est correcte.

**Emplacement dans le code source** : `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Impact des Hooks sur les performances

**Problème** : Trop de Hooks ou des scripts Hook complexes peuvent dégrader les performances.

**Solution** : Limitez le nombre de Hooks, ne conservez que ceux qui sont nécessaires. Vous pouvez désactiver des Hooks spécifiques via `disabled_hooks`.

---

## Résumé

Oh My OpenCode fournit une couche de compatibilité complète avec Claude Code, vous permettant de migrer et réutiliser vos configurations existantes de manière transparente :

- **Priorité de chargement des configurations** : Les configurations sont chargées dans l'ordre projet > utilisateur > compatibilité Claude Code
- **Options de compatibilité** : Contrôlez précisément les fonctionnalités à charger via le champ `claude_code`
- **Compatibilité du stockage de données** : Partage du répertoire `~/.claude/`, support de la migration des données de session et de tâches
- **Intégration des Hooks** : Support complet du système de hooks de cycle de vie de Claude Code

Si vous migrez depuis Claude Code, cette couche de compatibilité vous permet de commencer à utiliser OpenCode sans aucune configuration.

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons la **[Référence de configuration](../configuration-reference/)**.
>
> Vous apprendrez :
> - La description complète des champs de `oh-my-opencode.json`
> - Les types, valeurs par défaut et contraintes de chaque champ
> - Les modèles de configuration courants et les bonnes pratiques

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements dans le code source</strong></summary>

> Date de mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Point d'entrée principal des Hooks Claude Code | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Chargement de la configuration des Hooks | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| Chargeur de configuration MCP | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Chargeur de Commands | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Chargeur de Skills | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Chargeur de Plugins | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | Complet |
| Compatibilité du stockage de données | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | Complet |
| Transformateur de configuration MCP | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | Complet |
| Expansion des variables d'environnement | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | Complet |

**Fonctions clés** :

- `createClaudeCodeHooksHook()` : Crée le Hook d'intégration Claude Code Hooks, gère tous les événements (PreToolUse, PostToolUse, UserPromptSubmit, Stop)
- `loadClaudeHooksConfig()` : Charge la configuration `settings.json` de Claude Code
- `loadMcpConfigs()` : Charge la configuration des serveurs MCP, supporte l'expansion des variables d'environnement
- `loadAllCommands()` : Charge les Commands depuis 4 répertoires, fusionnées par priorité
- `discoverSkills()` : Charge les Skills depuis 4 répertoires, supporte les chemins compatibles Claude Code
- `getClaudeConfigDir()` : Obtient le chemin du répertoire de configuration Claude Code (dépendant de la plateforme)

**Constantes clés** :

- Priorité de chargement des configurations : `.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Types d'événements Hook : `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `PreCompact`

</details>
