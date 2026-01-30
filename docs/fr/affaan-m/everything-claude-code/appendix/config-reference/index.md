---
title: "Guide de configuration complet : settings.json | Everything Claude Code"
sidebarTitle: "Personnaliser toutes les configurations"
subtitle: "Guide de configuration complet settings.json"
description: "Apprenez toutes les options de configuration de Everything Claude Code. Maîtrisez l'automatisation des Hooks, la configuration des serveurs MCP et des plugins pour résoudre rapidement les conflits de configuration."
tags:
  - "configuration"
  - "paramètres"
  - "json"
  - "hooks"
  - "mcp"
prerequisite:
  - "start-installation"
  - "start-mcp-setup"
order: "190"
---

# Guide de configuration complet : settings.json

## Ce que vous pourrez faire après ce cours

- Comprendre parfaitement toutes les options de configuration de `~/.claude/settings.json`
- Personnaliser les workflows d'automatisation avec les Hooks
- Configurer et gérer les serveurs MCP
- Modifier les manifestes de plugins et les chemins de configuration
- Résoudre les conflits de configuration et les problèmes

## Votre situation actuelle

Vous utilisez déjà Everything Claude Code, mais vous rencontrez ces problèmes :
- « Pourquoi un Hook ne se déclenche-t-il pas ? »
- « La connexion au serveur MCP a échoué, où est l'erreur de configuration ? »
- « Je veux personnaliser une fonctionnalité, mais je ne sais pas quel fichier de configuration modifier ? »
- « Plusieurs fichiers de configuration se chevauchent, quelle est la priorité ? »

Ce cours vous fournira un guide de référence de configuration complet.

## Concept principal

Le système de configuration de Claude Code est divisé en trois niveaux, avec la priorité suivante (de la plus haute à la plus basse) :

1. **Configuration au niveau du projet** (`.claude/settings.json`) - active uniquement pour le projet actuel
2. **Configuration globale** (`~/.claude/settings.json`) - active pour tous les projets
3. **Configuration intégrée au plugin** (configuration par défaut de Everything Claude Code)

::: tip Priorité de configuration
Les configurations sont **fusionnées** plutôt que remplacées. La configuration au niveau du projet remplace les options de même nom dans la configuration globale, mais conserve les autres options.
:::

Les fichiers de configuration utilisent le format JSON et suivent le schéma Claude Code Settings :

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

Ce schéma fournit l'autocomplétion et la validation, il est recommandé de toujours l'inclure.

## Structure des fichiers de configuration

### Modèle de configuration complet

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",

  "mcpServers": {},

  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "SessionStart": [],
    "SessionEnd": [],
    "PreCompact": [],
    "Stop": []
  },

  "disabledMcpServers": [],

  "environmentVariables": {}
}
```

::: warning Règles de syntaxe JSON
- Tous les noms de clés et les valeurs de chaîne doivent être entourés de **guillemets doubles**
- **Ne pas mettre de virgule** après la dernière paire clé-valeur
- Les commentaires ne font pas partie du standard JSON, utilisez le champ `"_comments"` à la place
:::

## Configuration détaillée des Hooks

Les Hooks sont le mécanisme d'automatisation central de Everything Claude Code, définissant des scripts automatisés déclenchés lors d'événements spécifiques.

### Types de Hooks et moments de déclenchement

| Type de Hook | Moment de déclenchement | Utilisation |
| --- | --- | --- |
| `SessionStart` | Au démarrage de la session Claude Code | Charger le contexte, détecter le gestionnaire de paquets |
| `SessionEnd` | À la fin de la session Claude Code | Enregistrer l'état de la session, évaluer le mode d'extraction |
| `PreToolUse` | Avant l'appel d'un outil | Valider les commandes, bloquer les opérations dangereuses |
| `PostToolUse` | Après l'appel d'un outil | Formater le code, vérification de types |
| `PreCompact` | Avant la compression du contexte | Enregistrer un instantané de l'état |
| `Stop` | À la fin de chaque réponse IA | Vérifier les problèmes comme console.log |

### Structure de configuration des Hooks

Chaque entrée de Hook contient les champs suivants :

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Hook déclenché')\""
    }
  ],
  "description": "Description du Hook (optionnel)"
}
```

#### Champ matcher

Définit les conditions de déclenchement, prend en charge les variables suivantes :

| Variable | Signification | Valeur d'exemple |
| --- | --- | --- |
| `tool` | Nom de l'outil | `"Bash"`, `"Write"`, `"Edit"` |
| `tool_input.command` | Contenu de la commande Bash | `"npm run dev"` |
| `tool_input.file_path` | Chemin du fichier pour Write/Edit | `"/path/to/file.ts"` |

**Opérateurs de correspondance** :

```javascript
// Égalité
tool == "Bash"

// Correspondance par expression régulière
tool_input.command matches "npm run dev"
tool_input.file_path matches "\\.ts$"

// Opérations logiques
tool == "Edit" || tool == "Write"
tool == "Bash" && !(tool_input.command matches "git push")
```

#### Tableau hooks

Définit les actions à exécuter, prend en charge deux types :

**Type 1 : command**

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
}
```

- `${CLAUDE_PLUGIN_ROOT}` est la variable du répertoire racine du plugin
- La commande s'exécute dans le répertoire racine du projet
- La sortie au format JSON standard est transmise à Claude Code

**Type 2 : prompt** (non utilisé dans cette configuration)

```json
{
  "type": "prompt",
  "prompt": "Review the code before committing"
}
```

### Exemple complet de configuration des Hooks

Everything Claude Code fournit plus de 15 Hooks préconfigurés, voici la configuration complète :

#### PreToolUse Hooks

**1. Blocage du serveur de développement Tmux**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] BLOQUÉ : Le serveur de développement doit tourner dans tmux pour accéder aux logs');console.error('[Hook] Utiliser : tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Puis : tmux attach -t dev');process.exit(1)\""
    }
  ],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Utilisation** : Force l'exécution des serveurs de développement dans tmux pour garantir l'accès aux logs.

**Commandes correspondantes** :
- `npm run dev`
- `pnpm dev` / `pnpm run dev`
- `yarn dev`
- `bun run dev`

**2. Rappel Tmux**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"if(!process.env.TMUX){console.error('[Hook] Envisagez d\\'utiliser tmux pour la persistance de session');console.error('[Hook] tmux new -s dev  |  tmux attach -t dev')}\""
    }
  ],
  "description": "Reminder to use tmux for long-running commands"
}
```

**Utilisation** : Rappel d'utiliser tmux pour les commandes de longue durée.

**Commandes correspondantes** :
- `npm install`, `npm test`
- `pnpm install`, `pnpm test`
- `cargo build`, `make`, `docker`
- `pytest`, `vitest`, `playwright`

**3. Rappel Git Push**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] Vérifiez les modifications avant de pousser...');console.error('[Hook] Continuation du push (supprimez ce hook pour ajouter une revue interactive)')\""
    }
  ],
  "description": "Reminder before git push to review changes"
}
```

**Utilisation** : Rappel de vérifier les modifications avant de pousser.

**4. Blocage des fichiers MD aléatoires**

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\.md|CLAUDE\\.md|AGENTS\\.md|CONTRIBUTING\\.md\")",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.(md|txt)$/.test(p)&&!/(README|CLAUDE|AGENTS|CONTRIBUTING)\\.md$/.test(p)){console.error('[Hook] BLOQUÉ : Création de fichier de documentation inutile');console.error('[Hook] Fichier : '+p);console.error('[Hook] Utilisez README.md pour la documentation');process.exit(1)}console.log(d)})\""
    }
  ],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Utilisation** : Bloque la création de fichiers .md aléatoires, garde la documentation centralisée.

**Fichiers autorisés** :
- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`

**5. Suggestion de compression**

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
    }
  ],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Utilisation** : Suggère une compression manuelle du contexte à des intervalles logiques.

#### SessionStart Hook

**Charger le contexte précédent**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
    }
  ],
  "description": "Load previous context and detect package manager on new session"
}
```

**Utilisation** : Charge le contexte de la session précédente et détecte le gestionnaire de paquets.

#### PostToolUse Hooks

**1. Enregistrer l'URL de la PR**

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';const m=out.match(/https:\\/\\/github.com\\/[^/]+\\/[^/]+\\/pull\\/\\d+/);if(m){console.error('[Hook] PR créée : '+m[0]);const repo=m[0].replace(/https:\\/\\/github.com\\/([^/]+\\/[^/]+)\\/pull\\/\\d+/,'$1');const pr=m[0].replace(/.*\\/pull\\/(\\d+)/,'$1');console.error('[Hook] Pour reviewer : gh pr review '+pr+' --repo '+repo)}}console.log(d)})\""
    }
  ],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Utilisation** : Enregistre l'URL et fournit la commande de revue après la création d'une PR.

**2. Formatage automatique**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
    }
  ],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Utilisation** : Formate automatiquement les fichiers JS/TS avec Prettier.

**3. Vérification TypeScript**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');const path=require('path');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){let dir=path.dirname(p);while(dir!==path.dirname(dir)&&!fs.existsSync(path.join(dir,'tsconfig.json'))){dir=path.dirname(dir)}if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']});const lines=r.split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}catch(e){const lines=(e.stdout||'').split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}}}console.log(d)})\""
    }
  ],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Utilisation** : Exécute la vérification de types après l'édition de fichiers TypeScript.

**4. Avertissement console.log**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');const matches=[];lines.forEach((l,idx)=>{if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())});if(matches.length){console.error('[Hook] AVERTISSEMENT : console.log trouvé dans '+p);matches.slice(0,5).forEach(m=>console.error(m));console.error('[Hook] Supprimez console.log avant de commit')}}console.log(d)})\""
    }
  ],
  "description": "Warn about console.log statements after edits"
}
```

**Utilisation** : Détecte et avertit sur les instructions console.log dans les fichiers.

#### Stop Hook

**Vérifier console.log dans les fichiers modifiés**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{execSync('git rev-parse --git-dir',{stdio:'pipe'})}catch{console.log(d);process.exit(0)}try{const files=execSync('git diff --name-only HEAD',{encoding:'utf8',stdio:['pipe','pipe','pipe']}).split('\\n').filter(f=/\\.(ts|tsx|js|jsx)$/.test(f)&&fs.existsSync(f));let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] AVERTISSEMENT : console.log trouvé dans '+f);hasConsole=true}}if(hasConsole)console.error('[Hook] Supprimez les instructions console.log avant de commit')}catch(e){}console.log(d)})\""
    }
  ],
  "description": "Check for console.log in modified files after each response"
}
```

**Utilisation** : Vérifie les console.log dans les fichiers modifiés.

#### PreCompact Hook

**Enregistrer l'état avant compression**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
    }
  ],
  "description": "Save state before context compaction"
}
```

**Utilisation** : Enregistre l'état avant la compression du contexte.

#### SessionEnd Hooks

**1. Persister l'état de la session**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
    }
  ],
  "description": "Persist session state on end"
}
```

**Utilisation** : Persiste l'état de la session.

**2. Évaluer la session**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
    }
  ],
  "description": "Evaluate session for extractable patterns"
}
```

**Utilisation** : Évalue la session pour extraire des modèles réutilisables.

### Personnaliser les Hooks

Vous pouvez personnaliser les Hooks de plusieurs façons :

#### Méthode 1 : Modifier settings.json

```bash
# Éditer la configuration globale
vim ~/.claude/settings.json
```

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"votre_pattern\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Votre hook personnalisé')\""
          }
        ],
        "description": "Votre hook personnalisé"
      }
    ]
  }
}
```

#### Méthode 2 : Configuration au niveau du projet

Créez `.claude/settings.json` dans le répertoire racine du projet :

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"votre_commande_personnalisee\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Hook spécifique au projet')\""
          }
        ]
      }
    ]
  }
}
```

::: tip Avantages de la configuration au niveau du projet
- N'affecte pas la configuration globale
- Active uniquement pour un projet spécifique
- Peut être commitée dans le contrôle de version
:::

## Configuration détaillée des serveurs MCP

MCP (Model Context Protocol) étend les capacités d'intégration de services externes de Claude Code.

### Structure de configuration MCP

```json
{
  "mcpServers": {
    "nom_du_serveur": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "ENV_VAR": "votre_valeur"
      },
      "description": "Description du serveur"
    },
    "http_server": {
      "type": "http",
      "url": "https://example.com/mcp",
      "description": "Description du serveur HTTP"
    }
  }
}
```

### Types de serveurs MCP

#### Type 1 : npx

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "VOTRE_GITHUB_PAT_ICI"
    },
    "description": "Opérations GitHub - PRs, issues, repos"
  }
}
```

**Description des champs** :
- `command` : Commande d'exécution, généralement `npx`
- `args` : Tableau d'arguments, `-y` confirme automatiquement l'installation
- `env` : Objet de variables d'environnement
- `description` : Texte de description

#### Type 2 : http

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Déploiements et projets Vercel"
  }
}
```

**Description des champs** :
- `type` : Doit être `"http"`
- `url` : URL du serveur
- `description` : Texte de description

### Serveurs MCP préconfigurés de Everything Claude Code

Voici la liste de tous les serveurs MCP préconfigurés :

| Nom du serveur | Type | Description | Configuration requise |
| --- | --- | --- | --- |
| `github` | npx | Opérations GitHub (PRs, Issues, Repos) | GitHub PAT |
| `firecrawl` | npx | Scraping et crawling web | Clé API Firecrawl |
| `supabase` | npx | Opérations base de données Supabase | Référence Projet |
| `memory` | npx | Mémoire persistante inter-sessions | Aucune |
| `sequential-thinking` | npx | Raisonnement en chaîne | Aucune |
| `vercel` | http | Déploiements et projets Vercel | Aucune |
| `railway` | npx | Déploiements Railway | Aucune |
| `cloudflare-docs` | http | Recherche dans la documentation Cloudflare | Aucune |
| `cloudflare-workers-builds` | http | Builds Cloudflare Workers | Aucune |
| `cloudflare-workers-bindings` | http | Liaisons Cloudflare Workers | Aucune |
| `cloudflare-observability` | http | Logs et monitoring Cloudflare | Aucune |
| `clickhouse` | http | Requêtes analytiques ClickHouse | Aucune |
| `context7` | npx | Recherche de documentation en temps réel | Aucune |
| `magic` | npx | Composants Magic UI | Aucune |
| `filesystem` | npx | Opérations système de fichiers | Configuration du chemin |

### Ajouter un serveur MCP

#### Ajouter depuis les préconfigurations

1. Copiez la configuration du serveur depuis `mcp-configs/mcp-servers.json`
2. Collez-la dans votre `~/.claude/settings.json`

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      },
      "description": "Opérations GitHub - PRs, issues, repos"
    }
  }
}
```

3. Remplacez les placeholders `VOTRE_*_ICI` par les valeurs réelles

#### Ajouter un serveur MCP personnalisé

```json
{
  "mcpServers": {
    "mon_serveur_personnalise": {
      "command": "npx",
      "args": ["-y", "@votre-org/votre-serveur"],
      "env": {
        "API_KEY": "votre_cle_api"
      },
      "description": "Serveur MCP personnalisé"
    }
  }
}
```

### Désactiver un serveur MCP

Utilisez le tableau `disabledMcpServers` pour désactiver des serveurs spécifiques :

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "firecrawl": { /* ... */ }
  },
  "disabledMcpServers": ["github", "firecrawl"]
}
```

::: warning Avertissement sur la fenêtre de contexte
Activer trop de serveurs MCP consomme beaucoup de fenêtre de contexte. Il est recommandé d'activer **moins de 10** serveurs MCP.
:::

## Configuration détaillée des plugins

### Structure de plugin.json

`.claude-plugin/plugin.json` est le fichier manifeste du plugin, définissant les métadonnées du plugin et les chemins des composants.

```json
{
  "name": "everything-claude-code",
  "description": "Collection complète de configurations Claude Code testées en production",
  "author": {
    "name": "Affaan Mustafa",
    "url": "https://x.com/affaanmustafa"
  },
  "homepage": "https://github.com/affaan-m/everything-claude-code",
  "repository": "https://github.com/affaan-m/everything-claude-code",
  "license": "MIT",
  "keywords": [
    "claude-code",
    "agents",
    "skills",
    "hooks",
    "commands",
    "rules",
    "tdd",
    "code-review",
    "security",
    "workflow",
    "automation",
    "best-practices"
  ],
  "commands": "./commands",
  "skills": "./skills"
}
```

### Description des champs

| Champ | Type | Obligatoire | Description |
| --- | --- | --- | --- |
| `name` | string | Y | Nom du plugin |
| `description` | string | Y | Description du plugin |
| `author.name` | string | Y | Nom de l'auteur |
| `author.url` | string | N | URL de la page de l'auteur |
| `homepage` | string | N | Page d'accueil du plugin |
| `repository` | string | N | URL du dépôt |
| `license` | string | N | Licence |
| `keywords` | string[] | N | Tableau de mots-clés |
| `commands` | string | Y | Chemin du répertoire des commandes |
| `skills` | string | Y | Chemin du répertoire des skills |

### Modifier les chemins du plugin

Si vous devez personnaliser les chemins des composants, modifiez `plugin.json` :

```json
{
  "name": "ma-configuration-claude-personnalisee",
  "commands": "./commandes-personnalisees",
  "skills": "./skills-personnalises"
}
```

## Autres fichiers de configuration

### package-manager.json

Configuration du gestionnaire de paquets, supporte les niveaux projet et global :

```json
{
  "packageManager": "pnpm"
}
```

**Emplacements** :
- Global : `~/.claude/package-manager.json`
- Projet : `.claude/package-manager.json`

### marketplace.json

Manifeste du marketplace des plugins, utilisé pour la commande `/plugin marketplace add` :

```json
{
  "name": "everything-claude-code",
  "displayName": "Everything Claude Code",
  "description": "Collection complète de configurations Claude Code",
  "url": "https://github.com/affaan-m/everything-claude-code"
}
```

### statusline.json

Exemple de configuration de la barre de statut :

```json
{
  "items": [
    {
      "type": "text",
      "text": "Everything Claude Code"
    }
  ]
}
```

## Fusion et priorité des fichiers de configuration

### Stratégie de fusion

Les fichiers de configuration sont fusionnés dans l'ordre suivant (le dernier a la priorité) :

1. Configuration intégrée au plugin
2. Configuration globale (`~/.claude/settings.json`)
3. Configuration du projet (`.claude/settings.json`)

**Exemple** :

```json
// Configuration intégrée au plugin
{
  "hooks": {
    "PreToolUse": [/* Hook A */]
  }
}

// Configuration globale
{
  "hooks": {
    "PreToolUse": [/* Hook B */]
  }
}

// Configuration du projet
{
  "hooks": {
    "PreToolUse": [/* Hook C */]
  }
}

// Résultat final de la fusion (configuration du projet prioritaire)
{
  "hooks": {
    "PreToolUse": [/* Hook C */]  // Hook C remplace A et B
  }
}
```

::: warning Précautions
- **Les tableaux de même nom sont complètement remplacés**, pas ajoutés
- Il est recommandé de ne définir que les parties à remplacer dans la configuration du projet
- Utilisez la commande `/debug config` pour voir la configuration complète
:::

### Configuration des variables d'environnement

Définissez les variables d'environnement dans `settings.json` :

```json
{
  "environmentVariables": {
    "CLAUDE_PACKAGE_MANAGER": "pnpm",
    "NODE_ENV": "development"
  }
}
```

::: tip Rappel de sécurité
- Les variables d'environnement sont exposées dans le fichier de configuration
- Ne stockez pas d'informations sensibles dans les fichiers de configuration
- Utilisez les variables d'environnement système ou le fichier `.env` pour gérer les clés secrètes
:::

## Dépannage des problèmes de configuration courants

### Problème 1 : Le Hook ne se déclenche pas

**Causes possibles** :
1. Erreur dans l'expression du matcher
2. Format de configuration du Hook incorrect
3. Fichier de configuration non correctement enregistré

**Étapes de diagnostic** :

```bash
# Vérifier la syntaxe de la configuration
cat ~/.claude/settings.json | python -m json.tool

# Vérifier si le Hook est chargé
# Exécutez dans Claude Code
/debug config
```

**Réparations courantes** :

```json
// ❌ Erreur : guillemets simples
{
  "matcher": "tool == 'Bash'"
}

// ✅ Correct : guillemets doubles
{
  "matcher": "tool == \"Bash\""
}
```

### Problème 2 : Échec de connexion au serveur MCP

**Causes possibles** :
1. Variables d'environnement non configurées
2. Problèmes de réseau
3. URL du serveur incorrecte

**Étapes de diagnostic** :

```bash
# Tester le serveur MCP
npx @modelcontextprotocol/server-github --help

# Vérifier les variables d'environnement
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**Réparations courantes** :

```json
// ❌ Erreur : nom de variable d'environnement incorrect
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxx"  // Devrait être GITHUB_PERSONAL_ACCESS_TOKEN
  }
}

// ✅ Correct
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
  }
}
```

### Problème 3 : Conflits de configuration

**Symptôme** : Certaines options de configuration ne s'appliquent pas

**Cause** : La configuration au niveau du projet a remplacé la configuration globale

**Solution** :

```bash
# Voir la configuration du projet
cat .claude/settings.json

# Voir la configuration globale
cat ~/.claude/settings.json

# Supprimer la configuration du projet (si non nécessaire)
rm .claude/settings.json
```

### Problème 4 : Erreurs de format JSON

**Symptôme** : Claude Code ne peut pas lire la configuration

**Outils de diagnostic** :

```bash
# Utiliser jq pour valider
cat ~/.claude/settings.json | jq '.'

# Utiliser Python pour valider
cat ~/.claude/settings.json | python -m json.tool

# Utiliser un outil en ligne
# https://jsonlint.com/
```

**Erreurs courantes** :

```json
// ❌ Erreur : virgule à la fin
{
  "hooks": {
    "PreToolUse": []
  },
}

// ❌ Erreur : guillemets simples
{
  "description": 'Configuration des Hooks'
}

// ❌ Erreur : commentaires
{
  "hooks": {
    // Ceci est un commentaire
  }
}

// ✅ Correct
{
  "hooks": {
    "PreToolUse": []
  }
}
```

## Résumé de ce cours

Ce cours a expliqué en détail le système de configuration complet de Everything Claude Code :

**Concepts clés** :
- La configuration est divisée en trois niveaux : projet, global, plugin
- Priorité de configuration : projet > global > plugin
- Format JSON strict, attention aux guillemets doubles et à la syntaxe

**Configuration des Hooks** :
- 6 types de Hooks, plus de 15 Hooks préconfigurés
- L'expression matcher définit les conditions de déclenchement
- Support des Hooks personnalisés et du remplacement au niveau du projet

**Serveurs MCP** :
- Deux types : npx et http
- Plus de 15 serveurs préconfigurés
- Support de la désactivation et de la personnalisation

**Configuration des plugins** :
- plugin.json définit les métadonnées du plugin
- Support des chemins de composants personnalisés
- marketplace.json pour le marketplace des plugins

**Autres configurations** :
- package-manager.json : Configuration du gestionnaire de paquets
- statusline.json : Configuration de la barre de statut
- environmentVariables : Définition des variables d'environnement

**Problèmes courants** :
- Hook ne se déclenche pas → Vérifier le matcher et le format JSON
- Échec de connexion MCP → Vérifier les variables d'environnement et le réseau
- Conflits de configuration → Voir les configurations projet et globale
- Erreurs de format JSON → Utiliser jq ou un outil en ligne pour valider

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Référence complète des Rules : 8 ensembles de règles détaillés](../rules-reference/)**.
>
> Vous apprendrez :
> - Règles Security : Prévenir la fuite de données sensibles
> - Règles Coding Style : Style de code et bonnes pratiques
> - Règles Testing : Couverture de tests et exigences TDD
> - Règles Git Workflow : Normes de commit et processus de PR
> - Comment personnaliser les ensembles de règles selon les besoins du projet

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-25

| Fonction | Chemin du fichier | Lignes |
| --- | --- | --- |
| Configuration des Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Manifeste du plugin | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Configuration des serveurs MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Manifeste du marketplace | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | - |

**Scripts de Hooks clés** :
- `session-start.js` : Charge le contexte au démarrage de la session
- `session-end.js` : Enregistre l'état à la fin de la session
- `suggest-compact.js` : Suggère la compression manuelle du contexte
- `pre-compact.js` : Enregistre l'état avant compression
- `evaluate-session.js` : Évalue la session pour extraire les modèles

**Variables d'environnement clés** :
- `CLAUDE_PLUGIN_ROOT` : Répertoire racine du plugin
- `GITHUB_PERSONAL_ACCESS_TOKEN` : Authentification API GitHub
- `FIRECRAWL_API_KEY` : Authentification API Firecrawl

</details>
