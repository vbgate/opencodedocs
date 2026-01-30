---
title: "Installation et Configuration | Tutoriel Agent App Factory"
sidebarTitle: "Installation en 5 minutes"
subtitle: "Installation et Configuration | Tutoriel Agent App Factory"
description: "Apprenez à installer l'outil CLI Agent App Factory, configurer Claude Code ou OpenCode, et installer les plugins nécessaires. Ce tutoriel couvre les exigences Node.js, la configuration de l'assistant IA et les étapes d'installation des plugins."
tags:
  - "Installation"
  - "Configuration"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 20
---

# Installation et Configuration

## Ce que vous saurez faire

✅ Installer l'outil CLI Agent App Factory et vérifier l'installation
✅ Configurer Claude Code ou OpenCode comme moteur d'exécution IA
✅ Installer les plugins nécessaires pour exécuter les pipelines
✅ Initialiser un projet et démarrer votre premier projet Factory

## Votre problème actuel

Vous voulez utiliser AI App Factory pour transformer vos idées en applications, mais vous ne savez pas quels outils installer ni quel environnement configurer. Une fois installé, vous craignez d'oublier des plugins essentiels et de voir des erreurs au milieu du pipeline.

## Quand utiliser cette méthode

Utilisez cette méthode lors de votre première utilisation d'AI App Factory, ou lorsque vous configurez un nouvel environnement de développement. Terminez l'installation et la configuration avant de commencer à générer des applications.

## 🎒 Préparatifs

::: warning Prérequis

Avant de commencer l'installation, assurez-vous de :

- **Node.js version >= 16.0.0** - C'est la version minimale requise pour l'outil CLI
- **npm ou yarn** - Pour installer les packages globalement
- **Un assistant IA** - Claude Code ou OpenCode (Claude Code recommandé)

:::

**Vérifier la version de Node.js** :

```bash
node --version
```

Si la version est inférieure à 16.0.0, téléchargez et installez la dernière version LTS depuis le [site officiel de Node.js](https://nodejs.org).

## Idée clé

L'installation d'AI App Factory comprend 3 parties clés :

1. **Outil CLI** - Fournit une interface en ligne de commande et gère l'état du projet
2. **Assistant IA** - Le "cerveau" qui exécute les pipelines et interprète les commandes Agent
3. **Plugins nécessaires** - Extensions qui améliorent les capacités de l'IA (brainstorming Bootstrap, système de design UI)

Processus d'installation : Installer le CLI → Configurer l'assistant IA → Initialiser le projet (plugins installés automatiquement)

## Suivez le guide

### Étape 1 : Installer l'outil CLI

Installez Agent App Factory CLI globalement, afin que vous puissiez utiliser la commande `factory` dans n'importe quel répertoire.

```bash
npm install -g agent-app-factory
```

**Ce que vous devriez voir** : Sortie d'installation réussie

```
added 1 package in Xs
```

**Vérifier l'installation** :

```bash
factory --version
```

**Ce que vous devriez voir** : Sortie du numéro de version

```
1.0.0
```

Si vous ne voyez pas le numéro de version, vérifiez si l'installation a réussi :

```bash
which factory  # macOS/Linux
where factory  # Windows
```

::: tip L'installation a échoué ?

Si vous rencontrez des problèmes de permission (macOS/Linux), essayez :

```bash
sudo npm install -g agent-app-factory
```

Ou utilisez npx sans installation globale (non recommandé, téléchargement nécessaire à chaque utilisation) :

```bash
npx agent-app-factory init
```

:::

### Étape 2 : Installer l'assistant IA

AI App Factory doit être utilisé avec un assistant IA, car les définitions Agent et les fichiers Skill sont des commandes IA au format Markdown qui doivent être interprétées et exécutées par l'IA.

#### Option A : Claude Code (recommandé)

Claude Code est l'assistant de programmation IA officiel d'Anthropic, profondément intégré avec AI App Factory.

**Méthode d'installation** :

1. Visitez le [site officiel de Claude Code](https://claude.ai/code)
2. Téléchargez et installez l'application pour votre plateforme
3. Après l'installation, vérifiez si la commande est disponible :

```bash
claude --version
```

**Ce que vous devriez voir** : Sortie du numéro de version

```
Claude Code 1.x.x
```

#### Option B : OpenCode

OpenCode est un autre assistant de programmation IA supportant le mode Agent.

**Méthode d'installation** :

1. Visitez le [site officiel d'OpenCode](https://opencode.sh)
2. Téléchargez et installez l'application pour votre plateforme
3. S'il n'y a pas d'outil en ligne de commande, téléchargez et installez manuellement dans :

- **Windows** : `%LOCALAPPDATA%\Programs\OpenCode\`
- **macOS** : `/Applications/OpenCode.app/`
- **Linux** : `/usr/bin/opencode` ou `/usr/local/bin/opencode`

::: info Pourquoi recommander Claude Code ?

- Support officiel, meilleure intégration avec le système de permissions d'AI App Factory
- Installation automatique des plugins, `factory init` configure automatiquement les plugins nécessaires
- Meilleure gestion du contexte, économie de tokens

:::

### Étape 3 : Initialiser votre premier projet Factory

Vous avez maintenant une usine propre, initialisons le premier projet.

**Créer le répertoire du projet** :

```bash
mkdir my-first-app && cd my-first-app
```

**Initialiser le projet Factory** :

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
    policies/
    templates/
    pipeline.yaml
    config.yaml
    state.json

✓ Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

**Point de contrôle ✅** : Vérifiez que les fichiers suivants ont été créés

```bash
ls -la .factory/
```

**Ce que vous devriez voir** :

```
agents/
skills/
policies/
templates/
pipeline.yaml
config.yaml
state.json
```

La fenêtre Claude Code devrait également s'ouvrir automatiquement.

::: tip Le répertoire doit être vide

`factory init` ne peut être exécuté que dans un répertoire vide ou un répertoire contenant uniquement des fichiers de configuration comme `.git`, `README.md`.

Si le répertoire contient d'autres fichiers, vous verrez une erreur :

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

:::

### Étape 4 : Plugins installés automatiquement

`factory init` tentera d'installer automatiquement deux plugins nécessaires :

1. **superpowers** - Compétences de brainstorming pour la phase Bootstrap
2. **ui-ux-pro-max-skill** - Système de design pour la phase UI (67 styles, 96 palettes de couleurs, 100 règles industrielles)

Si l'installation automatique échoue, vous verrez un avertissement :

```
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

::: warning Que faire si l'installation du plugin échoue ?

Si l'installation du plugin échoue lors de l'initialisation, vous pourrez l'installer manuellement ultérieurement dans Claude Code :

1. Dans Claude Code, saisissez :
   ```
   /install superpowers
   /install ui-ux-pro-max-skill
   ```

2. Ou visitez le marketplace de plugins pour une installation manuelle

:::

### Étape 5 : Vérifier les permissions de l'assistant IA

`factory init` générera automatiquement le fichier `.claude/settings.local.json` avec les permissions nécessaires configurées.

**Vérifier la configuration des permissions** :

```bash
cat .claude/settings.local.json
```

**Ce que vous devriez voir** (version simplifiée) :

```json
{
  "allowedCommands": [
    "read",
    "write",
    "glob",
    "bash"
  ],
  "allowedPaths": [
    ".factory/**",
    "input/**",
    "artifacts/**"
  ]
}
```

Ces permissions garantissent que l'assistant IA peut :
- Lire les définitions Agent et les fichiers Skill
- Écrire les artefacts dans le répertoire `artifacts/`
- Exécuter les scripts et tests nécessaires

::: danger N'utilisez pas --dangerously-skip-permissions

La configuration des permissions générée par AI App Factory est déjà suffisamment sécurisée. N'utilisez pas `--dangerously-skip-permissions` dans Claude Code, car cela réduirait la sécurité et pourrait entraîner des opérations non autorisées.

:::

## Pièges à éviter

### ❌ Version Node.js trop ancienne

**Erreur** : `npm install -g agent-app-factory` échoue lors de l'installation ou plante lors de l'exécution

**Cause** : Version de Node.js inférieure à 16.0.0

**Solution** : Mettez à jour Node.js vers la dernière version LTS

```bash
# Utiliser nvm pour la mise à jour (recommandé)
nvm install --lts
nvm use --lts
```

### ❌ Claude Code mal installé

**Erreur** : Après l'exécution de `factory init`, le message "Claude CLI not found" apparaît

**Cause** : Claude Code n'a pas été correctement ajouté au PATH

**Solution** : Réinstallez Claude Code, ou ajoutez manuellement le chemin de l'exécutable aux variables d'environnement

- **Windows** : Ajoutez le répertoire d'installation de Claude Code au PATH
- **macOS/Linux** : Vérifiez si l'exécutable `claude` existe dans `/usr/local/bin/`

### ❌ Répertoire non vide

**Erreur** : `factory init` affiche "directory is not empty"

**Cause** : Le répertoire contient déjà d'autres fichiers (à l'exception des fichiers de configuration comme `.git`, `README.md`)

**Solution** : Initialisez dans un nouveau répertoire vide, ou nettoyez le répertoire existant

```bash
# Nettoyer les fichiers non de configuration dans le répertoire
rm -rf * !(.git) !(README.md)
```

### ❌ Échec de l'installation des plugins

**Erreur** : `factory init` affiche un avertissement d'échec de l'installation des plugins

**Cause** : Problèmes de réseau ou marketplace de plugins Claude Code temporairement indisponible

**Solution** : Installez manuellement les plugins dans Claude Code, ou suivez les invites lors de l'exécution ultérieure du pipeline

```
/install superpowers
/install ui-ux-pro-max-skill
```

## Résumé de cette leçon

Cette leçon a complété l'installation et la configuration complète d'AI App Factory :

1. ✅ **Outil CLI** - Installé globalement via `npm install -g agent-app-factory`
2. ✅ **Assistant IA** - Claude Code ou OpenCode, Claude Code recommandé
3. ✅ **Initialisation du projet** - `factory init` crée le répertoire `.factory/` et configure automatiquement
4. ✅ **Plugins nécessaires** - superpowers et ui-ux-pro-max-skill (installé automatiquement ou manuellement)
5. ✅ **Configuration des permissions** - Génération automatique du fichier de permissions Claude Code

Vous avez maintenant un projet Factory opérationnel, la fenêtre Claude Code est ouverte et prête à exécuter des pipelines.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Initialiser un projet Factory](../init-project/)**.
>
> Vous apprendrez :
> - Comprendre la structure du répertoire générée par `factory init`
> - Comprendre l'usage de chaque fichier dans le répertoire `.factory/`
> - Maîtriser la modification de la configuration du projet
> - Apprendre à consulter l'état du projet

Prêt à commencer à générer votre première application ? Continuez !

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Fonction | Chemin du fichier | Lignes |
| --- | --- | --- |
| Point d'entrée CLI | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 1-123 |
| Commande d'initialisation | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| Exigences Node.js | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json) | 41 |
| Démarrage Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| Démarrage OpenCode | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Vérification de l'installation des plugins | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L360-L392) | 360-392 |
| Génération de la configuration des permissions | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-275 |

**Constantes clés** :
- `NODE_VERSION_MIN = "16.0.0"` : Version minimale requise de Node.js (package.json:41)

**Fonctions clés** :
- `getFactoryRoot()` : Obtient le répertoire racine de l'installation Factory (factory.js:22-52)
- `init()` : Initialise un projet Factory (init.js:220-456)
- `launchClaudeCode()` : Démarre Claude Code (init.js:119-147)
- `launchOpenCode()` : Démarre OpenCode (init.js:152-215)
- `generateClaudeSettings()` : Génère la configuration des permissions Claude Code

</details>
