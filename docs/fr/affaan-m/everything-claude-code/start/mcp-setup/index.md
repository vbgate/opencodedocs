---
title: "Configuration MCP : Services Externes | Everything Claude Code"
sidebarTitle: "Connexion aux Services Externes"
subtitle: "Configuration du Serveur MCP : Étendre les Capacités d'Intégration de Services Externes"
description: "Apprenez à configurer MCP. Sélectionnez parmi 15 serveurs préconfigurés celui qui correspond à votre projet, configurez les clés API et les variables d'environnement, et optimisez l'utilisation de la fenêtre de contexte."
tags:
  - "mcp"
  - "configuration"
  - "integration"
prerequisite:
  - "start-installation"
order: "40"
---

# Configuration du Serveur MCP : Étendre les Capacités d'Intégration de Services Externes

## Ce Que Vous Apprendrez

- Comprendre ce qu'est MCP et comment il étend les capacités de Claude Code
- Sélectionner parmi 15 serveurs MCP préconfigurés celui qui correspond à votre projet
- Configurer correctement les clés API et les variables d'environnement
- Optimiser l'utilisation de MCP pour éviter d'occuper la fenêtre de contexte

## Votre Situation Actuelle

Claude Code dispose par défaut uniquement de capacités de manipulation de fichiers et d'exécution de commandes, mais vous pourriez avoir besoin de :

- Consulter les PR et Issues GitHub
- Extraire le contenu de pages web
- Manipuler des bases de données Supabase
- Consulter de la documentation en temps réel
- Persister la mémoire entre les sessions

Si vous traquez ces tâches manuellement, vous devez constamment changer d'outil, copier-coller, ce qui est inefficace. Les serveurs MCP (Model Context Protocol) peuvent vous aider à automatiser ces intégrations de services externes.

## Quand Utiliser Cette Approppe

**Situations adaptées aux serveurs MCP** :
- Le projet implique des services tiers comme GitHub, Vercel, Supabase
- Besoin de consulter de la documentation en temps réel (Cloudflare, ClickHouse)
- Besoin de maintenir un état ou une mémoire entre les sessions
- Besoin d'extraction de pages web ou de génération de composants UI

**Situations où MCP n'est pas nécessaire** :
- Uniquement des opérations sur fichiers locaux
- Développement frontend pur, sans intégration de services externes
- Applications CRUD simples avec peu d'opérations de base de données

## 🎒 Préparation Avant de Commencer

Avant de commencer la configuration, veuillez confirmer :

::: warning Vérification Préalable

- ✅ L'[extension](../installation/) est déjà installée
- ✅ Vous êtes familier avec la syntaxe de configuration JSON de base
- ✅ Vous avez les clés API des services à intégrer (GitHub PAT, Firecrawl API Key, etc.)
- ✅ Vous connaissez l'emplacement du fichier de configuration `~/.claude.json`

:::

## Concept Clé

### Qu'est-ce que MCP

**MCP (Model Context Protocol)** est le protocole utilisé par Claude Code pour se connecter aux services externes. Il permet à l'IA d'accéder à des ressources externes comme GitHub, les bases de données, les requêtes de documentation, comme une capacité étendue.

**Principe de fonctionnement** :

```
Claude Code ←→ Serveur MCP ←→ Service Externe
    (local)         (middleware)        (GitHub/Supabase/...)
```

### Structure de Configuration MCP

Chaque configuration de serveur MCP contient :

```json
{
  "mcpServers": {
    "nom-serveur": {
      "command": "npx",          // Commande de lancement
      "args": ["-y", "package"],  // Arguments de commande
      "env": {                   // Variables d'environnement
        "API_KEY": "VOTRE_CLE"
      },
      "description": "Description de la fonctionnalité"   // Explication
    }
  }
}
```

**Types** :
- **Type npx** : Exécution via package npm (GitHub, Firecrawl)
- **Type http** : Connexion à un point de terminaison HTTP (Vercel, Cloudflare)

### Gestion de la Fenêtre de Contexte (Important !)

::: warning Avertissement de Contexte

Chaque serveur MCP activé occupe de la fenêtre de contexte. Activer trop de serveurs peut réduire le contexte de 200K à 70K.

**Règle d'or** :
- Configurer 20-30 serveurs MCP (tous disponibles)
- Activer < 10 par projet
- Nombre total d'outils actifs < 80

Utilisez `disabledMcpServers` dans la configuration du projet pour désactiver les MCP inutilisés.

:::

## Suivez les Étapes

### Étape 1 : Consulter les Serveurs MCP Disponibles

Everything Claude Code propose **15 serveurs MCP préconfigurés** :

| Serveur MCP | Type | Clé Requise | Usage |
| --- | --- | --- | --- |
| **github** | npx | ✅ GitHub PAT | Opérations PR, Issues, Repos |
| **firecrawl** | npx | ✅ API Key | Extraction et crawling web |
| **supabase** | npx | ✅ Project Ref | Opérations base de données |
| **memory** | npx | ❌ | Mémoire persistante inter-sessions |
| **sequential-thinking** | npx | ❌ | Amélioration du raisonnement en chaîne |
| **vercel** | http | ❌ | Déploiement et gestion de projet |
| **railway** | npx | ❌ | Déploiement Railway |
| **cloudflare-docs** | http | ❌ | Recherche de documentation |
| **cloudflare-workers-builds** | http | ❌ | Constructions Workers |
| **cloudflare-workers-bindings** | http | ❌ | Liaisons Workers |
| **cloudflare-observability** | http | ❌ | Logs et monitoring |
| **clickhouse** | http | ❌ | Requêtes analytiques |
| **context7** | npx | ❌ | Recherche de documentation en temps réel |
| **magic** | npx | ❌ | Génération de composants UI |
| **filesystem** | npx | ❌（chemin requis） | Opérations système de fichiers |

**Vous devriez voir** : La liste complète des 15 serveurs MCP, couvrant GitHub, le déploiement, la base de données, la requête de documentation et autres scénarios courants.

---

### Étape 2 : Copier la Configuration MCP vers Claude Code

Copiez la configuration depuis le répertoire source :

```bash
# Copier le modèle de configuration MCP
cp source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers-backup.json
```

**Pourquoi** : Sauvegarder la configuration originale pour référence et comparaison ultérieure.

---

### Étape 3 : Choisir les Serveurs MCP Nécessaires

Selon les besoins de votre projet, sélectionnez les serveurs MCP requis.

**Exemples de scénarios** :

| Type de Projet | MCP Recommandés |
| --- | --- |
| **Application Fullstack** (GitHub + Supabase + Vercel) | github, supabase, vercel, memory, context7 |
| **Projet Frontend** (Vercel + Requête Documentation) | vercel, cloudflare-docs, context7, magic |
| **Projet Données** (ClickHouse + Analyse) | clickhouse, sequential-thinking, memory |
| **Développement Général** | github, filesystem, memory, context7 |

**Vous devriez voir** : Une correspondance claire entre le type de projet et les serveurs MCP.

---

### Étape 4 : Éditer le Fichier de Configuration `~/.claude.json`

Ouvrez votre fichier de configuration Claude Code :

::: code-group

```bash [macOS/Linux]
vim ~/.claude.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.claude.json
```

:::

Ajoutez la section `mcpServers` dans `~/.claude.json` :

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "VOTRE_GITHUB_PAT_ICI"
      },
      "description": "Opérations GitHub - PRs, issues, repos"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "Mémoire persistante entre les sessions"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "description": "Recherche de documentation en temps réel"
    }
  }
}
```

**Pourquoi** : C'est la configuration de base, indiquant à Claude Code quels serveurs MCP lancer.

**Vous devriez voir** : L'objet `mcpServers` contenant la configuration des serveurs MCP sélectionnés.

---

### Étape 5 : Remplacer les Espaces Réservés des Clés API

Pour les serveurs MCP nécessitant une clé API, remplacez les espaces réservés `VOTRE_*_ICI` :

**Exemple GitHub MCP** :

1. Générer un Personal Access Token GitHub :
   - Accédez à https://github.com/settings/tokens
   - Créez un nouveau Token, cochez les permissions `repo`

2. Remplacez les espaces réservés dans la configuration :

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // Remplacer par le Token réel
  }
}
```

**Autres MCP nécessitant une clé** :

| MCP | Nom de la Clé | Adresse d'Obtention |
| --- | --- | --- |
| **firecrawl** | FIRECRAWL_API_KEY | https://www.firecrawl.dev/ |
| **supabase** | --project-ref | https://supabase.com/dashboard |

**Pourquoi** : Sans clé réelle, les serveurs MCP ne peuvent pas se connecter aux services externes.

**Vous devraient voir** : Tous les espaces réservés `VOTRE_*_ICI` remplacés par des clés réelles.

---

### Étape 6 : Configurer la Désactivation MCP au Niveau Projet (Recommandé)

Pour éviter que tous les projets n'activent tous les MCP, créez `.claude/config.json` dans le répertoire racine du projet :

```json
{
  "disabledMcpServers": [
    "supabase",      // Désactiver les MCP inutilisés
    "railway",
    "firecrawl"
  ]
}
```

**Pourquoi** : Cela permet de contrôler finement quels MCP sont actifs au niveau du projet, évitant d'occuper la fenêtre de contexte.

**Vous devriez voir** : Le fichier `.claude/config.json` contenant le tableau `disabledMcpServers`.

---

### Étape 7 : Redémarrer Claude Code

Redémarrez Claude Code pour que la configuration prenne effet :

```bash
# Arrêter Claude Code (si en cours d'exécution)
# Puis redémarrer
claude
```

**Pourquoi** : La configuration MCP est chargée au démarrage, un redémarrage est nécessaire pour qu'elle prenne effet.

**Vous devriez voir** : Après le démarrage de Claude Code, les serveurs MCP se chargent automatiquement.

## Points de Vérification ✅

Vérifiez si la configuration MCP a réussi :

1. **Vérifier l'État de Chargement MCP** :

Dans Claude Code, saisissez :

```bash
/tool list
```

**Résultat attendu** : Voir la liste des serveurs MCP et outils chargés.

2. **Tester la Fonctionnalité MCP** :

Si vous avez activé GitHub MCP, testez la requête :

```bash
# Consulter les Issues GitHub
@mcp list issues
```

**Résultat attendu** : Retourne la liste des Issues de votre dépôt.

3. **Vérifier la Fenêtre de Contexte** :

Voir le nombre d'outils dans `~/.claude.json` :

```bash
jq '.mcpServers | length' ~/.claude.json
```

**Résultat attendu** : Nombre de serveurs MCP activés < 10.

::: tip Conseils de Débogage

Si MCP n'a pas réussi à charger, vérifiez les fichiers journaux de Claude Code :
- macOS/Linux: `~/.claude/logs/`
- Windows: `%USERPROFILE%\.claude\logs\`

:::

## Pièges à Éviter

### Piège 1 : Activer Trop de MCP Provoquant un Contexte Insuffisant

**Symptôme** : La fenêtre de contexte au début de la conversation n'est que de 70K au lieu de 200K.

**Cause** : Chaque outil activé par MCP occupe la fenêtre de contexte.

**Solution** :
1. Vérifier le nombre de MCP activés (`~/.claude.json`)
2. Utiliser `disabledMcpServers` au niveau projet pour désactiver les MCP inutilisés
3. Garder le nombre total d'outils actifs < 80

---

### Piège 2 : Clé API Non Configurée Correctement

**Symptôme** : Erreur de permission ou échec de connexion lors de l'appel de la fonction MCP.

**Cause** : Les espaces réservés `VOTRE_*_ICI` n'ont pas été remplacés.

**Solution** :
1. Vérifier le champ `env` dans `~/.claude.json`
2. Confirmer que tous les espaces réservés sont remplacés par des clés réelles
3. Vérifier que les clés ont suffisamment de permissions (le Token GitHub nécessite la permission `repo`)

---

### Piège 3 : Erreur de Chemin Filesystem MCP

**Symptôme** : Filesystem MCP ne peut pas accéder au répertoire spécifié.

**Cause** : Le chemin dans `args` n'a pas été remplacé par le chemin réel.

**Solution** :
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/votre-nom/projects"],  // Remplacer par votre chemin de projet
    "description": "Opérations système de fichiers"
  }
}
```

---

### Piège 4 : Configuration au Niveau Projet Non Appliquée

**Symptôme** : `disabledMcpServers` dans le répertoire racine du projet n'a pas désactivé MCP.

**Cause** : Erreur de chemin ou de format du fichier `.claude/config.json`.

**Solution** :
1. Confirmer que le fichier est dans le répertoire racine : `.claude/config.json`
2. Vérifier que le format JSON est correct (utiliser `jq .` pour valider)
3. Confirmer que `disabledMcpServers` est un tableau de chaînes de caractères

## Résumé de la Leçon

Cette leçon a couvert les méthodes de configuration des serveurs MCP :

**Points clés** :
- MCP étend les capacités d'intégration de services externes de Claude Code
- Choisir parmi 15 MCP préconfigurés (< 10 recommandés)
- Remplacer les espaces réservés `VOTRE_*_ICI` par des clés API réelles
- Utiliser `disabledMcpServers` au niveau projet pour contrôler le nombre d'activations
- Garder le nombre total d'outils actifs < 80, éviter d'occuper la fenêtre de contexte

**Étape suivante** : Vous avez configuré les serveurs MCP, la prochaine leçon apprend comment utiliser les Commands principales.

## Aperçu de la Prochaine Leçon

> La prochaine leçon couvre les **[Commands Principales Détaillées](../../platforms/commands-overview/)**.
>
> Vous apprendrez :
> - Les fonctionnalités et cas d'utilisation des 14 commandes slash
> - Comment la commande `/plan` crée des plans d'implémentation
> - Comment la commande `/tdd` exécute le développement piloté par les tests
> - Comment déclencher rapidement des flux de travail complexes via des commandes

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-25

| Fonction | Chemin du Fichier | Ligne |
| --- | --- | --- |
| Modèle Configuration MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Notes Importantes README | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 348-369 |
| --- | --- | --- |

**Configuration clé** :
- 15 serveurs MCP (GitHub, Firecrawl, Supabase, Memory, Sequential-thinking, Vercel, Railway, Série Cloudflare, ClickHouse, Context7, Magic, Filesystem)
- Deux types pris en charge : npx (ligne de commande) et http (connexion point de terminaison)
- Utiliser `disabledMcpServers` au niveau projet pour contrôler le nombre d'activations

**Règles clés** :
- Configurer 20-30 serveurs MCP
- Activer < 10 par projet
- Nombre total d'outils actifs < 80
- Risque de réduction de la fenêtre de contexte de 200K à 70K

</details>
