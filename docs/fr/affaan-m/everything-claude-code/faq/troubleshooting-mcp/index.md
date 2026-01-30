---
title: "Échec de connexion MCP : Dépannage de la configuration | Everything Claude Code"
sidebarTitle: "Résoudre les problèmes de connexion MCP"
subtitle: "Échec de connexion MCP : Dépannage de la configuration"
description: "Apprenez à diagnostiquer les problèmes de connexion aux serveurs MCP. Résolvez 6 pannes courantes : erreurs de clé API, fenêtre de contexte réduite, mauvaise configuration du type de serveur, avec un processus de correction systématique."
tags:
  - "troubleshooting"
  - "mcp"
  - "configuration"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# Dépannage : Échec de connexion MCP

## Votre situation actuelle

Après avoir configuré un serveur MCP, vous pourriez rencontrer ces problèmes :

- ❌ Claude Code affiche "Failed to connect to MCP server"
- ❌ Les commandes GitHub/Supabase ne fonctionnent pas
- ❌ La fenêtre de contexte se réduit soudainement, les appels d'outils ralentissent
- ❌ Filesystem MCP ne peut pas accéder aux fichiers
- ❌ Trop de serveurs MCP activés, le système devient lent

Pas de panique, chaque problème a une solution claire. Cette leçon vous guide dans le diagnostic systématique des problèmes de connexion MCP.

---

## Problème courant 1 : Clé API non configurée ou invalide

### Symptômes

Lorsque vous essayez d'utiliser des serveurs MCP comme GitHub ou Firecrawl, Claude Code affiche :

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

ou

```
Failed to connect to MCP server: Authentication failed
```

### Cause

Les placeholders `YOUR_*_HERE` dans le fichier de configuration MCP n'ont pas été remplacés par les vraies clés API.

### Solution

**Étape 1 : Vérifier le fichier de configuration**

Ouvrez `~/.claude.json` et trouvez la configuration du serveur MCP concerné :

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← Vérifiez ici
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**Étape 2 : Remplacer le placeholder**

Remplacez `YOUR_GITHUB_PAT_HERE` par votre vraie clé API :

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Étape 3 : Où obtenir les clés pour les serveurs MCP courants**

| Serveur MCP | Variable d'environnement | Où l'obtenir |
| --- | --- | --- |
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl | `FIRECRAWL_API_KEY` | Firecrawl Dashboard → API Keys |
| Supabase | Référence du projet | Supabase Dashboard → Settings → API |

**Résultat attendu** : Après redémarrage de Claude Code, les outils concernés fonctionnent normalement.

### Piège à éviter

::: danger Avertissement de sécurité
Ne commitez jamais un fichier de configuration contenant de vraies clés API dans un dépôt Git. Assurez-vous que `~/.claude.json` est dans votre `.gitignore`.
:::

---

## Problème courant 2 : Fenêtre de contexte trop petite

### Symptômes

- La liste des outils disponibles devient soudainement très courte
- Claude affiche "Context window exceeded"
- Le temps de réponse ralentit notablement

### Cause

Trop de serveurs MCP sont activés, ce qui consomme la fenêtre de contexte. Selon le README du projet, **une fenêtre de contexte de 200k peut se réduire à 70k si trop de MCP sont activés**.

### Solution

**Étape 1 : Vérifier le nombre de MCP activés**

Consultez la section `mcpServers` dans `~/.claude.json` et comptez les serveurs activés.

**Étape 2 : Utiliser `disabledMcpServers` pour désactiver les serveurs inutiles**

Dans la configuration au niveau projet (`~/.claude/settings.json` ou `.claude/settings.json` du projet), ajoutez :

```json
{
  "disabledMcpServers": [
    "railway",
    "cloudflare-docs",
    "cloudflare-workers-builds",
    "magic",
    "filesystem"
  ]
}
```

**Étape 3 : Suivre les bonnes pratiques**

Selon les recommandations du README :

- Configurez 20-30 serveurs MCP (dans le fichier de configuration)
- Activez < 10 serveurs MCP par projet
- Maintenez le nombre d'outils actifs < 80

**Résultat attendu** : La liste des outils revient à sa longueur normale, le temps de réponse s'améliore.

### Piège à éviter

::: tip Conseil d'expérience
Il est recommandé d'activer différentes combinaisons de MCP selon le type de projet. Par exemple :
- Projet Web : GitHub, Firecrawl, Memory, Context7
- Projet Data : Supabase, ClickHouse, Sequential-thinking
:::

---

## Problème courant 3 : Mauvais type de serveur configuré

### Symptômes

```
Failed to start MCP server: Command not found
```

ou

```
Failed to connect: Invalid server type
```

### Cause

Confusion entre les deux types de serveurs MCP : `npx` et `http`.

### Solution

**Étape 1 : Identifier le type de serveur**

Vérifiez `mcp-configs/mcp-servers.json` et distinguez les deux types :

**Type npx** (nécessite `command` et `args`) :
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

**Type http** (nécessite `url`) :
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**Étape 2 : Corriger la configuration**

| Serveur MCP | Type correct | Configuration correcte |
| --- | --- | --- |
| GitHub | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel | http | `type: "http"`, `url: "https://mcp.vercel.com"` |
| Cloudflare Docs | http | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"` |
| Memory | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**Résultat attendu** : Après redémarrage, le serveur MCP démarre normalement.

---

## Problème courant 4 : Mauvais chemin pour Filesystem MCP

### Symptômes

- L'outil Filesystem ne peut accéder à aucun fichier
- Message "Path not accessible" ou "Permission denied"

### Cause

Le paramètre de chemin de Filesystem MCP n'a pas été remplacé par le vrai chemin du projet.

### Solution

**Étape 1 : Vérifier la configuration**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**Étape 2 : Remplacer par le vrai chemin**

Remplacez le chemin selon votre système d'exploitation :

**macOS/Linux** :
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows** :
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**Étape 3 : Vérifier les permissions**

Assurez-vous d'avoir les droits de lecture/écriture sur le chemin configuré.

**Résultat attendu** : L'outil Filesystem peut accéder et manipuler les fichiers dans le chemin spécifié.

### Piège à éviter

::: warning Attention
- N'utilisez pas le symbole `~`, utilisez le chemin complet
- Sous Windows, les antislashs doivent être échappés avec `\\`
- Assurez-vous qu'il n'y a pas de séparateur superflu à la fin du chemin
:::

---

## Problème courant 5 : Référence de projet Supabase non configurée

### Symptômes

La connexion MCP Supabase échoue avec le message "Missing project reference".

### Cause

Le paramètre `--project-ref` de Supabase MCP n'est pas configuré.

### Solution

**Étape 1 : Obtenir la référence du projet**

Dans le Dashboard Supabase :
1. Accédez aux paramètres du projet
2. Trouvez la section "Project Reference" ou "API"
3. Copiez l'ID du projet (format similaire à `xxxxxxxxxxxxxxxx`)

**Étape 2 : Mettre à jour la configuration**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**Résultat attendu** : Les outils Supabase peuvent interroger la base de données normalement.

---

## Problème courant 6 : Commande npx introuvable

### Symptômes

```
Failed to start MCP server: npx: command not found
```

### Cause

Node.js n'est pas installé sur le système ou npx n'est pas dans le PATH.

### Solution

**Étape 1 : Vérifier la version de Node.js**

```bash
node --version
```

**Étape 2 : Installer Node.js (si absent)**

Visitez [nodejs.org](https://nodejs.org/) pour télécharger et installer la dernière version LTS.

**Étape 3 : Vérifier npx**

```bash
npx --version
```

**Résultat attendu** : Le numéro de version de npx s'affiche correctement.

---

## Diagramme de dépannage

En cas de problème MCP, suivez cet ordre de vérification :

```
1. Vérifier si la clé API est configurée
   ↓ (configurée)
2. Vérifier si le nombre de MCP activés est < 10
   ↓ (nombre correct)
3. Vérifier le type de serveur (npx vs http)
   ↓ (type correct)
4. Vérifier les paramètres de chemin (Filesystem, Supabase)
   ↓ (chemin correct)
5. Vérifier si Node.js et npx sont disponibles
   ↓ (disponibles)
Problème résolu !
```

---

## Résumé de la leçon

La plupart des problèmes de connexion MCP sont liés à la configuration. Retenez ces points clés :

- ✅ **Clés API** : Remplacez tous les placeholders `YOUR_*_HERE`
- ✅ **Gestion du contexte** : Activez < 10 MCP, utilisez `disabledMcpServers` pour désactiver les inutiles
- ✅ **Type de serveur** : Distinguez les types npx et http
- ✅ **Configuration des chemins** : Filesystem et Supabase nécessitent des chemins/références spécifiques
- ✅ **Dépendances système** : Assurez-vous que Node.js et npx sont disponibles

Si le problème persiste, vérifiez s'il y a des conflits entre `~/.claude/settings.json` et la configuration au niveau projet.

---



## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Dépannage des échecs d'Agent](../troubleshooting-agents/)**.
>
> Vous apprendrez :
> - Comment diagnostiquer les problèmes de chargement et de configuration des Agents
> - Les stratégies pour résoudre les permissions d'outils insuffisantes
> - Comment diagnostiquer les timeouts d'Agent et les sorties inattendues

---

## Annexe : Références au code source

<details>
<summary><strong>Cliquez pour voir les emplacements dans le code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Fichier de configuration MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91 |
| Avertissement fenêtre de contexte | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 67-75 |

**Configurations clés** :
- `mcpServers.mcpServers.*.command` : Commande de démarrage pour les serveurs de type npx
- `mcpServers.mcpServers.*.args` : Paramètres de démarrage
- `mcpServers.mcpServers.*.env` : Variables d'environnement (clés API)
- `mcpServers.mcpServers.*.type` : Type de serveur ("npx" ou "http")
- `mcpServers.mcpServers.*.url` : URL pour les serveurs de type http

**Commentaires importants** :
- `mcpServers._comments.env_vars` : Remplacez les placeholders `YOUR_*_HERE`
- `mcpServers._comments.disabling` : Utilisez `disabledMcpServers` pour désactiver les serveurs
- `mcpServers._comments.context_warning` : Activez < 10 MCP pour préserver la fenêtre de contexte

</details>
