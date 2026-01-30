---
title: "Claude Code : Installation et configuration | Plannotator"
sidebarTitle: "Installation en 3 min"
subtitle: "Claude Code : Installation et configuration"
description: "Apprenez à installer le plugin Plannotator dans Claude Code. Configuration en 3 minutes, avec deux méthodes : système de plugins ou Hook manuel. Compatible macOS, Linux et Windows, y compris les environnements distants et Devcontainer."
tags:
  - "installation"
  - "claude-code"
  - "getting-started"
prerequisite:
  - "start-getting-started"
order: 2
---

# Installer le plugin Claude Code

## Ce que vous saurez faire

- Activer la fonctionnalité de revue de plan Plannotator dans Claude Code
- Choisir la méthode d'installation adaptée à vos besoins (système de plugins ou Hook manuel)
- Vérifier que l'installation a réussi
- Configurer correctement Plannotator dans un environnement distant/Devcontainer

## Votre problème actuel

Lorsque vous utilisez Claude Code, les plans générés par l'IA ne peuvent être lus que dans le terminal, ce qui rend difficile une revue et un feedback précis. Vous souhaitez :
- Visualiser les plans de l'IA dans un navigateur
- Annoter précisément les plans : suppression, remplacement, insertion
- Donner à l'IA des instructions de modification claires en une seule fois

## Quand utiliser cette méthode

Cette méthode convient aux situations suivantes :
- Vous utilisez Claude Code + Plannotator pour la première fois
- Vous devez réinstaller ou mettre à jour Plannotator
- Vous souhaitez l'utiliser dans un environnement distant (SSH, Devcontainer, WSL)

## Concept clé

L'installation de Plannotator se divise en deux parties :
1. **Installation de la commande CLI** : C'est le runtime principal, responsable du démarrage du serveur local et du navigateur
2. **Configuration de Claude Code** : Via le système de plugins ou un Hook manuel, permettre à Claude Code d'appeler automatiquement Plannotator lorsqu'un plan est terminé

Une fois l'installation terminée, lorsque Claude Code appelle `ExitPlanMode`, Plannotator se déclenche automatiquement et ouvre l'interface de revue de plan dans le navigateur.

## 🎒 Prérequis

::: warning Vérifications préalables

- [ ] Claude Code version 2.1.7 ou supérieure installé (nécessite le support des Permission Request Hooks)
- [ ] Permissions pour exécuter des commandes dans le terminal (Linux/macOS nécessite sudo ou installation dans le répertoire home)

:::

## Suivez le guide

### Étape 1 : Installer la commande CLI Plannotator

Commencez par installer l'outil en ligne de commande Plannotator.

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

**Vous devriez voir** : Le terminal affiche la progression de l'installation, puis à la fin : `plannotator {version} installed to {chemin}/plannotator`

**Point de contrôle ✅** : Exécutez la commande suivante pour vérifier l'installation :

::: code-group

```bash [macOS / Linux]
which plannotator
```

```powershell [Windows PowerShell]
Get-Command plannotator
```

```cmd [Windows CMD]
where plannotator
```

:::

Vous devriez voir le chemin d'installation de la commande Plannotator, par exemple `/usr/local/bin/plannotator` ou `$HOME/.local/bin/plannotator`.

### Étape 2 : Installer le plugin dans Claude Code

Ouvrez Claude Code et exécutez les commandes suivantes :

```bash
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**Vous devriez voir** : Un message confirmant l'installation réussie du plugin.

::: danger Important : Redémarrage obligatoire de Claude Code

Après l'installation du plugin, **vous devez redémarrer Claude Code**, sinon les Hooks ne seront pas activés.

:::

### Étape 3 : Vérifier l'installation

Après le redémarrage, exécutez la commande suivante dans Claude Code pour tester la fonctionnalité de revue de code :

```bash
/plannotator-review
```

**Vous devriez voir** :
- Le navigateur s'ouvre automatiquement sur l'interface de revue de code Plannotator
- Le terminal affiche "Opening code review..." et attend votre feedback de revue

Si vous voyez ces résultats, félicitations, l'installation est réussie !

::: tip Remarque
La fonctionnalité de revue de plan se déclenche automatiquement lorsque Claude Code appelle `ExitPlanMode`, sans besoin d'exécuter manuellement une commande de test. Vous pouvez tester cette fonctionnalité lors de l'utilisation réelle du mode plan.
:::

### Étape 4 : (Optionnel) Installation manuelle du Hook

Si vous ne souhaitez pas utiliser le système de plugins, ou si vous devez l'utiliser dans un environnement CI/CD, vous pouvez configurer le Hook manuellement.

Éditez le fichier `~/.claude/settings.json` (créez-le s'il n'existe pas) et ajoutez le contenu suivant :

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "plannotator",
            "timeout": 1800
          }
        ]
      }
    ]
  }
}
```

**Description des champs** :
- `matcher: "ExitPlanMode"` - Se déclenche lorsque Claude Code appelle ExitPlanMode
- `command: "plannotator"` - Exécute la commande CLI Plannotator installée
- `timeout: 1800` - Délai d'expiration (30 minutes), vous laissant suffisamment de temps pour revoir le plan

**Point de contrôle ✅** : Après avoir enregistré le fichier, redémarrez Claude Code, puis exécutez `/plannotator-review` pour tester.

### Étape 5 : (Optionnel) Configuration distant/Devcontainer

Si vous utilisez Claude Code dans un environnement distant tel que SSH, Devcontainer ou WSL, vous devez définir des variables d'environnement pour fixer le port et désactiver l'ouverture automatique du navigateur.

Dans l'environnement distant, exécutez :

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999  # Choisissez un port que vous accéderez via la redirection de port
```

**Ces variables permettent de** :
- Utiliser un port fixe (au lieu d'un port aléatoire), facilitant la configuration de la redirection de port
- Ignorer l'ouverture automatique du navigateur (car le navigateur est sur votre machine locale)
- Afficher l'URL dans le terminal, que vous pouvez copier et ouvrir dans votre navigateur local

::: tip Redirection de port

**VS Code Devcontainer** : Les ports sont généralement redirigés automatiquement, vérifiez l'onglet "Ports" de VS Code pour confirmer.

**Redirection de port SSH** : Éditez `~/.ssh/config` et ajoutez :

```bash
Host your-server
    LocalForward 9999 localhost:9999
```

:::

## Pièges à éviter

### Problème 1 : La commande `/plannotator-review` ne répond pas après l'installation

**Cause** : Vous avez oublié de redémarrer Claude Code, les Hooks ne sont pas activés.

**Solution** : Quittez complètement Claude Code et rouvrez-le.

### Problème 2 : Le script d'installation échoue

**Cause** : Problème réseau ou permissions insuffisantes.

**Solution** :
- Vérifiez votre connexion réseau et assurez-vous de pouvoir accéder à `https://plannotator.ai`
- En cas de problème de permissions, essayez de télécharger manuellement le script d'installation et de l'exécuter

### Problème 3 : Le navigateur ne s'ouvre pas dans l'environnement distant

**Cause** : L'environnement distant n'a pas d'interface graphique, le navigateur ne peut pas démarrer.

**Solution** : Définissez la variable d'environnement `PLANNOTATOR_REMOTE=1` et configurez la redirection de port.

### Problème 4 : Le port est déjà utilisé

**Cause** : Le port fixe `9999` est déjà utilisé par un autre programme.

**Solution** : Choisissez un autre port disponible, par exemple `8888` ou `19432`.

## Résumé de la leçon

- ✅ Installation de la commande CLI Plannotator
- ✅ Configuration de Claude Code via le système de plugins ou Hook manuel
- ✅ Vérification du succès de l'installation
- ✅ (Optionnel) Configuration de l'environnement distant/Devcontainer

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Installer le plugin OpenCode](../installation-opencode/)**.
>
> Si vous utilisez OpenCode plutôt que Claude Code, la prochaine leçon vous montrera comment effectuer une configuration similaire dans OpenCode.

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Point d'entrée du script d'installation | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L35-L60) | 35-60 |
| Documentation de configuration Hook | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L30-L39) | 30-39 |
| Exemple de Hook manuel | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L42-L62) | 42-62 |
| Configuration des variables d'environnement | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L73-L79) | 73-79 |
| Configuration du mode distant | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L81-L94) | 81-94 |

**Constantes clés** :
- `PLANNOTATOR_REMOTE = "1"` : Active le mode distant, utilise un port fixe
- `PLANNOTATOR_PORT = 9999` : Port fixe utilisé en mode distant (par défaut 19432)
- `timeout: 1800` : Délai d'expiration du Hook (30 minutes)

**Variables d'environnement clés** :
- `PLANNOTATOR_REMOTE` : Indicateur du mode distant
- `PLANNOTATOR_PORT` : Numéro de port fixe
- `PLANNOTATOR_BROWSER` : Chemin personnalisé du navigateur

</details>
