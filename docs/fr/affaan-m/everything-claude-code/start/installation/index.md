---
title: "Installation : Plugin vs Manuel | Everything Claude Code"
sidebarTitle: "Installation en 5 minutes"
subtitle: "Installation : Plugin vs Manuel"
description: "Apprenez les deux méthodes d'installation d'Everything Claude Code. L'installation via le marketplace de plugins est la plus rapide, tandis que l'installation manuelle permet une configuration précise des composants."
tags:
  - "installation"
  - "plugin"
  - "setup"
prerequisite:
  - "start-quickstart"
order: 20
---

# Guide d'installation : Marketplace de plugins vs Installation manuelle

## Ce que vous apprendrez dans ce tutoriel

À la fin de ce tutoriel, vous serez capable de :

- Installer Everything Claude Code en un clic via le marketplace de plugins
- Choisir manuellement les composants pour une configuration personnalisée
- Configurer correctement les serveurs MCP et les Hooks
- Vérifier que l'installation a réussi

## Votre situation actuelle

Vous souhaitez démarrer rapidement avec Everything Claude Code, mais vous ne savez pas :

- Si vous devez utiliser l'installation via le marketplace en un clic ou contrôler manuellement chaque composant ?
- Comment éviter les erreurs de configuration qui pourraient empêcher le bon fonctionnement ?
- Quels fichiers copier et où les placer en cas d'installation manuelle ?

## Quand utiliser quelle méthode

| Scénario | Méthode recommandée | Raison |
| --- | --- | --- |
| Première utilisation | Installation via le marketplace | La plus simple, terminée en 5 minutes |
| Tester une fonctionnalité spécifique | Installation via le marketplace | Découvrir l'ensemble des fonctionnalités avant de décider |
| Besoins spécifiques | Installation manuelle | Contrôle précis de chaque composant |
| Configuration personnalisée existante | Installation manuelle | Éviter d'écraser les paramètres existants |

## Concept clé

Everything Claude Code propose deux méthodes d'installation :

1. **Installation via le marketplace** (recommandée)
   - Adaptée à la majorité des utilisateurs
   - Gère automatiquement toutes les dépendances
   - Une seule commande suffit

2. **Installation manuelle**
   - Adaptée aux utilisateurs ayant des besoins spécifiques
   - Permet de contrôler précisément quels composants installer
   - Nécessite une configuration manuelle

Quelle que soit la méthode choisie, les fichiers de configuration finiront par être copiés dans le répertoire `~/.claude/` pour que Claude Code puisse les reconnaître et les utiliser.

## 🎒 Prérequis

::: warning Conditions préalables

Avant de commencer, assurez-vous que :
- [ ] Claude Code est installé
- [ ] Vous disposez d'une connexion Internet fonctionnelle pour accéder à GitHub
- [ ] Vous connaissez les opérations de base en ligne de commande (en cas d'installation manuelle)

:::

---

## Procédure pas à pas

### Méthode 1 : Installation via le marketplace (recommandée)

C'est la méthode la plus simple, idéale pour les premières utilisations ou pour une découverte rapide.

#### Étape 1 : Ajouter le marketplace

**Pourquoi**
Enregistrer le dépôt GitHub comme marketplace de plugins pour Claude Code permet d'installer les plugins qu'il contient.

Dans Claude Code, saisissez :

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**Ce que vous devriez voir** :
```
Successfully added marketplace affaan-m/everything-claude-code
```

#### Étape 2 : Installer le plugin

**Pourquoi**
Installer le plugin Everything Claude Code à partir du marketplace que vous venez d'ajouter.

Dans Claude Code, saisissez :

```bash
/plugin install everything-claude-code@everything-claude-code
```

**Ce que vous devriez voir** :
```
Successfully installed everything-claude-code@everything-claude-code
```

::: tip Point de contrôle ✅

Vérifiez que le plugin est bien installé :

```bash
/plugin list
```

Vous devriez voir `everything-claude-code@everything-claude-code` dans la sortie.

:::

#### Étape 3 (optionnelle) : Configuration directe dans settings.json

**Pourquoi**
Si vous souhaitez modifier directement le fichier de configuration pour éviter la ligne de commande.

Ouvrez `~/.claude/settings.json` et ajoutez le contenu suivant :

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  },
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Ce que vous devriez voir** :
- Après la mise à jour du fichier de configuration, Claude Code chargera automatiquement le plugin
- Tous les agents, skills, commands et hooks deviendront immédiatement actifs

---

### Méthode 2 : Installation manuelle

Adaptée aux utilisateurs souhaitant un contrôle précis sur les composants à installer.

#### Étape 1 : Cloner le dépôt

**Pourquoi**
Récupérer tous les fichiers source d'Everything Claude Code.

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
```

**Ce que vous devriez voir** :
```
Cloning into 'everything-claude-code'...
remote: Enumerating objects...
```

#### Étape 2 : Copier les agents

**Pourquoi**
Copier les sous-agents spécialisés dans le répertoire agents de Claude Code.

```bash
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

**Ce que vous devriez voir** :
- 9 nouveaux fichiers agent dans le répertoire `~/.claude/agents/`

::: tip Point de contrôle ✅

Vérifiez que les agents ont bien été copiés :

```bash
ls ~/.claude/agents/
```

Vous devriez voir quelque chose comme :
```
planner.md architect.md tdd-guide.md code-reviewer.md ...
```

:::

#### Étape 3 : Copier les rules

**Pourquoi**
Copier les règles obligatoires dans le répertoire rules de Claude Code.

```bash
cp everything-claude-code/rules/*.md ~/.claude/rules/
```

**Ce que vous devriez voir** :
- 8 nouveaux fichiers de règles dans le répertoire `~/.claude/rules/`

#### Étape 4 : Copier les commands

**Pourquoi**
Copier les commandes slash dans le répertoire commands de Claude Code.

```bash
cp everything-claude-code/commands/*.md ~/.claude/commands/
```

**Ce que vous devriez voir** :
- 14 nouveaux fichiers de commandes dans le répertoire `~/.claude/commands/`

#### Étape 5 : Copier les skills

**Pourquoi**
Copier les définitions de workflow et les connaissances métier dans le répertoire skills de Claude Code.

```bash
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

**Ce que vous devriez voir** :
- 11 nouveaux répertoires de skills dans `~/.claude/skills/`

#### Étape 6 : Configurer les hooks

**Pourquoi**
Ajouter la configuration des hooks d'automatisation au fichier settings.json de Claude Code.

Copiez le contenu de `hooks/hooks.json` dans votre `~/.claude/settings.json` :

```bash
cat everything-claude-code/hooks/hooks.json
```

Ajoutez le contenu de sortie à votre `~/.claude/settings.json`, au format suivant :

```json
{
  "hooks": [
    {
      "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
      "hooks": [
        {
          "type": "command",
          "command": "#!/bin/bash\ngrep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
        }
      ]
    }
  ]
}
```

**Ce que vous devriez voir** :
- Un avertissement apparaît lors de l'édition de fichiers TypeScript/JavaScript contenant des `console.log`

::: warning Remarque importante

Assurez-vous que le tableau `hooks` n'écrase pas les configurations existantes dans `~/.claude/settings.json`. Si des hooks existent déjà, vous devez les fusionner.

:::

#### Étape 7 : Configurer les serveurs MCP

**Pourquoi**
Étendre les capacités d'intégration de Claude Code avec les services externes.

Sélectionnez les serveurs MCP dont vous avez besoin dans `mcp-configs/mcp-servers.json` et ajoutez-les à `~/.claude.json` :

```bash
cat everything-claude-code/mcp-configs/mcp-servers.json
```

Copiez les configurations nécessaires dans `~/.claude.json`, par exemple :

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "VOTRE_GITHUB_TOKEN_ICI"
      }
    }
  }
}
```

::: danger Important : Remplacez les placeholders

Vous devez remplacer les placeholders `YOUR_*_HERE` par vos vraies clés API, sinon les serveurs MCP ne fonctionneront pas.

:::

::: tip Conseils d'utilisation des MCP

**N'activez pas tous les MCP !** Trop de MCP occupent beaucoup d'espace de contexte.

- Il est recommandé de configurer 20-30 serveurs MCP
- Limitez-vous à 10 serveurs actifs par projet
- Gardez moins de 80 outils actifs

Utilisez `disabledMcpServers` pour désactiver les MCP inutiles dans la configuration du projet :

```json
{
  "disabledMcpServers": ["firecrawl", "supabase"]
}
```

:::

---

## Points de contrôle ✅

### Vérifier l'installation via le marketplace

```bash
/plugin list
```

Vous devriez voir `everything-claude-code@everything-claude-code` activé.

### Vérifier l'installation manuelle

```bash
# Vérifier les agents
ls ~/.claude/agents/ | head -5

# Vérifier les rules
ls ~/.claude/rules/ | head -5

# Vérifier les commands
ls ~/.claude/commands/ | head -5

# Vérifier les skills
ls ~/.claude/skills/ | head -5
```

Vous devriez voir :
- Le répertoire agents contient `planner.md`, `tdd-guide.md`, etc.
- Le répertoire rules contient `security.md`, `coding-style.md`, etc.
- Le répertoire commands contient `tdd.md`, `plan.md`, etc.
- Le répertoire skills contient `coding-standards`, `backend-patterns`, etc.

### Vérifier que les fonctionnalités fonctionnent

Dans Claude Code, entrez :

```bash
/tdd
```

Vous devriez voir l'agent TDD Guide commencer à travailler.

---

## Pièges courants

### Erreur courante 1 : Le plugin ne fonctionne pas après installation

**Symptôme** : Après l'installation du plugin, les commandes ne fonctionnent pas.

**Cause** : Le plugin n'a pas été chargé correctement.

**Solution** :
```bash
# Vérifier la liste des plugins
/plugin list

# Si non activé, activer manuellement
/plugin enable everything-claude-code@everything-claude-code
```

### Erreur courante 2 : Échec de connexion au serveur MCP

**Symptôme** : Les fonctionnalités MCP ne fonctionnent pas, erreur de connexion.

**Cause** : La clé API n'a pas été remplacée ou le format est incorrect.

**Solution** :
- Vérifiez que tous les placeholders `YOUR_*_HERE` dans `~/.claude.json` ont été remplacés
- Vérifiez que la clé API est valide
- Confirmez que le chemin de la commande du serveur MCP est correct

### Erreur courante 3 : Les hooks ne se déclenchent pas

**Symptôme** : Aucun message hook n'apparaît lors de l'édition de fichiers.

**Cause** : Le format de configuration des hooks dans `~/.claude/settings.json` est incorrect.

**Solution** :
- Vérifiez que le format du tableau `hooks` est correct
- Assurez-vous que la syntaxe de l'expression `matcher` est correcte
- Vérifiez que le chemin de la commande hook est exécutable

### Erreur courante 4 : Problèmes de permissions de fichiers (installation manuelle)

**Symptôme** : Erreur "Permission denied" lors de la copie de fichiers.

**Cause** : Permissions insuffisantes sur le répertoire `~/.claude/`.

**Solution** :
```bash
# Assurez-vous que le répertoire .claude existe et a les bonnes permissions
mkdir -p ~/.claude/{agents,rules,commands,skills}

# Utilisez sudo (seulement si nécessaire)
sudo cp -r everything-claude-code/agents/*.md ~/.claude/agents/
```

---

## Résumé du tutoriel

**Comparaison des deux méthodes d'installation** :

| Caractéristique | Installation via le marketplace | Installation manuelle |
| --- | --- | --- |
| Vitesse | ⚡ Rapide | 🐌 Lente |
| Difficulté | 🟢 Simple | 🟡 Modérée |
| Flexibilité | 🔒 Fixe | 🔓 Personnalisable |
| Scénarios recommandés | Débutants, découverte rapide | Utilisateurs avancés, besoins spécifiques |

**Points clés** :
- L'installation via le marketplace est la méthode la plus simple, une commande suffit
- L'installation manuelle convient aux utilisateurs ayant besoin d'un contrôle précis des composants
- Lors de la configuration MCP, n'oubliez pas de remplacer les placeholders et n'activez pas trop de serveurs
- Lors de la vérification de l'installation, contrôlez la structure des répertoires et la disponibilité des commandes

---

## Aperçu du prochain tutoriel

> Dans le prochain tutoriel, nous apprendrons **[Configuration du gestionnaire de packages : détection automatique et personnalisation](../package-manager-setup/)**.
>
> Vous apprendrez :
> - Comment Everything Claude Code détecte automatiquement le gestionnaire de packages
> - Le fonctionnement des 6 niveaux de priorité de détection
> - Comment personnaliser la configuration du gestionnaire de packages au niveau projet et utilisateur
> - Comment utiliser la commande `/setup-pm` pour une configuration rapide

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Ligne |
| --- | --- | --- |
| Métadonnées du plugin | [`source/affaan-m/everything-claude-code/.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Manifeste du marketplace | [`source/affaan-m/everything-claude-code/.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45 |
| Guide d'installation | [`source/affaan-m/everything-claude-code/README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 175-242 |
| Configuration des Hooks | [`source/affaan-m/everything-claude-code/hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-146 |
| Configuration MCP | [`source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-95 |

**Configuration clé** :
- Nom du plugin : `everything-claude-code`
- Dépôt : `affaan-m/everything-claude-code`
- Licence : MIT
- Supporte 9 agents, 14 commandes, 8 ensembles de règles, 11 skills

**Méthodes d'installation** :
1. Installation via le marketplace : `/plugin marketplace add` + `/plugin install`
2. Installation manuelle : copier agents, rules, commands, skills dans `~/.claude/`

</details>
