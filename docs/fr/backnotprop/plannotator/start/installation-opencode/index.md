---
title: "OpenCode : Installation du Plugin | Plannotator"
sidebarTitle: "Prêt à l'emploi"
subtitle: "Installer le plugin OpenCode"
description: "Apprenez à installer le plugin Plannotator dans OpenCode. Configurez opencode.json pour ajouter le plugin, exécutez le script d'installation pour obtenir les commandes slash, configurez les variables d'environnement pour le mode distant et vérifiez le bon fonctionnement."
tags:
  - "Installation"
  - "Configuration"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 3
---

# Installer le plugin OpenCode

## Ce que vous apprendrez

- Installer le plugin Plannotator dans OpenCode
- Configurer l'outil `submit_plan` et la commande `/plannotator-review`
- Définir les variables d'environnement (mode distant, port, navigateur, etc.)
- Vérifier que l'installation du plugin a réussi

## Votre problème actuel

Lorsque vous utilisez un Agent IA dans OpenCode, la révision des plans nécessite de lire du texte brut dans le terminal, ce qui rend difficile un retour précis. Vous souhaitez une interface visuelle pour annoter les plans, ajouter des commentaires et renvoyer automatiquement les retours structurés à l'Agent.

## Quand utiliser cette méthode

**Indispensable avant d'utiliser Plannotator** : si vous développez dans l'environnement OpenCode et souhaitez bénéficier d'une expérience de révision de plans interactive.

## 🎒 Prérequis

- [ ] [OpenCode](https://opencode.ai/) installé
- [ ] Connaissance de base de la configuration `opencode.json` (système de plugins OpenCode)

::: warning Connaissances préalables
Si vous ne connaissez pas encore les opérations de base d'OpenCode, nous vous recommandons de lire d'abord la [documentation officielle d'OpenCode](https://opencode.ai/docs).
:::

## Concept clé

Plannotator fournit deux fonctionnalités principales pour OpenCode :

1. **Outil `submit_plan`** - Appelé lorsque l'Agent termine un plan, ouvre le navigateur pour une révision interactive
2. **Commande `/plannotator-review`** - Déclenche manuellement une révision de code Git diff

Le processus d'installation se fait en deux étapes :
1. Ajouter la configuration du plugin dans `opencode.json` (active l'outil `submit_plan`)
2. Exécuter le script d'installation (obtient la commande `/plannotator-review`)

## Suivez le guide

### Étape 1 : Installer le plugin via opencode.json

Trouvez votre fichier de configuration OpenCode (généralement situé dans le répertoire racine du projet ou le répertoire de configuration utilisateur), et ajoutez Plannotator dans le tableau `plugin` :

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**Pourquoi**
`opencode.json` est le fichier de configuration des plugins OpenCode. Après avoir ajouté le nom du plugin, OpenCode téléchargera et chargera automatiquement le plugin depuis le registre npm.

Vous devriez voir : Au démarrage d'OpenCode, un message "Loading plugin: @plannotator/opencode..." s'affiche.

---

### Étape 2 : Redémarrer OpenCode

**Pourquoi**
Les modifications de configuration des plugins nécessitent un redémarrage pour prendre effet.

Vous devriez voir : OpenCode recharge tous les plugins.

---

### Étape 3 : Exécuter le script d'installation pour obtenir les commandes slash

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

:::

**Pourquoi**
Ce script va :
1. Télécharger l'outil CLI `plannotator` sur votre système
2. Installer la commande slash `/plannotator-review` dans OpenCode
3. Nettoyer toutes les versions de plugins en cache

Vous devriez voir : Un message de succès d'installation, similaire à "Plannotator installed successfully!"

---

### Étape 4 : Vérifier l'installation

Vérifiez dans OpenCode que le plugin fonctionne correctement :

**Vérifier si l'outil `submit_plan` est disponible** :
- Dans la conversation, demandez à l'Agent "Veuillez utiliser submit_plan pour soumettre le plan"
- Si le plugin fonctionne, l'Agent devrait pouvoir voir et appeler cet outil

**Vérifier si la commande `/plannotator-review` est disponible** :
- Dans la zone de saisie, tapez `/plannotator-review`
- Si le plugin fonctionne, vous devriez voir la suggestion de commande

Vous devriez voir : Les deux fonctionnalités fonctionnent normalement, sans message d'erreur.

---

### Étape 5 : Configurer les variables d'environnement (optionnel)

Plannotator prend en charge les variables d'environnement suivantes, à configurer selon vos besoins :

::: details Description des variables d'environnement

| Variable d'environnement | Utilisation | Valeur par défaut | Exemple |
| --- | --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Activer le mode distant (devcontainer/SSH) | Non défini | `export PLANNOTATOR_REMOTE=1` |
| `PLANNOTATOR_PORT` | Port fixe (obligatoire en mode distant) | Aléatoire en local, 19432 en distant | `export PLANNOTATOR_PORT=9999` |
| `PLANNOTATOR_BROWSER` | Chemin personnalisé du navigateur | Navigateur système par défaut | `export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"` |
| `PLANNOTATOR_SHARE` | Désactiver le partage d'URL | Activé | `export PLANNOTATOR_SHARE=disabled` |

:::

**Exemple de configuration en mode distant** (devcontainer/SSH) :

Dans `.devcontainer/devcontainer.json` :

```json
{
  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },
  "forwardPorts": [9999]
}
```

**Pourquoi**
- Mode distant : Lors de l'exécution d'OpenCode dans un conteneur ou une machine distante, utilise un port fixe et ouvre automatiquement le navigateur
- Redirection de port : Permet à la machine hôte d'accéder aux services dans le conteneur

Vous devriez voir : Lorsque l'Agent appelle `submit_plan`, la console affiche l'URL du serveur (au lieu d'ouvrir automatiquement le navigateur), par exemple :
```
Plannotator server running at http://localhost:9999
```

---

### Étape 6 : Redémarrer OpenCode (si vous avez modifié les variables d'environnement)

Si vous avez configuré des variables d'environnement à l'étape 5, vous devez redémarrer OpenCode pour que la configuration prenne effet.

---

## Point de contrôle ✅

Après l'installation, confirmez les points suivants :

- [ ] `@plannotator/opencode@latest` a été ajouté dans `opencode.json`
- [ ] Aucune erreur de chargement de plugin après le redémarrage d'OpenCode
- [ ] La saisie de `/plannotator-review` affiche la suggestion de commande
- [ ] (Optionnel) Les variables d'environnement sont correctement configurées

## Pièges à éviter

### Erreur courante 1 : Échec du chargement du plugin

**Symptôme** : Au démarrage d'OpenCode, le message "Failed to load plugin @plannotator/opencode" s'affiche

**Causes possibles** :
- Problème réseau empêchant le téléchargement depuis npm
- Cache npm corrompu

**Solution** :
1. Vérifiez la connexion réseau
2. Exécutez le script d'installation (il nettoie le cache des plugins)
3. Nettoyez manuellement le cache npm : `npm cache clean --force`

---

### Erreur courante 2 : Commande slash indisponible

**Symptôme** : La saisie de `/plannotator-review` n'affiche pas de suggestion de commande

**Cause possible** : Le script d'installation n'a pas été exécuté avec succès

**Solution** : Réexécutez le script d'installation (étape 3)

---

### Erreur courante 3 : Impossible d'ouvrir le navigateur en mode distant

**Symptôme** : Lors de l'appel de `submit_plan` dans un devcontainer, le navigateur ne s'ouvre pas

**Causes possibles** :
- `PLANNOTATOR_REMOTE=1` n'est pas défini
- La redirection de port n'est pas configurée

**Solution** :
1. Confirmez que `PLANNOTATOR_REMOTE=1` est défini
2. Vérifiez que `forwardPorts` dans `.devcontainer/devcontainer.json` inclut le port que vous avez défini
3. Accédez manuellement à l'URL affichée : `http://localhost:9999`

---

### Erreur courante 4 : Port occupé

**Symptôme** : Le démarrage du serveur échoue avec le message "Port already in use"

**Cause possible** : Le serveur précédent n'a pas été correctement arrêté

**Solution** :
1. Modifiez `PLANNOTATOR_PORT` vers un autre port
2. Ou arrêtez manuellement le processus occupant le port (macOS/Linux : `lsof -ti:9999 | xargs kill`)

---

## Résumé de la leçon

Cette leçon a présenté comment installer et configurer le plugin Plannotator dans OpenCode :

1. **Ajouter le plugin via `opencode.json`** - Active l'outil `submit_plan`
2. **Exécuter le script d'installation** - Obtient la commande slash `/plannotator-review`
3. **Configurer les variables d'environnement** - S'adapte au mode distant et aux besoins personnalisés
4. **Vérifier l'installation** - Confirme que le plugin fonctionne correctement

Après l'installation, vous pouvez :
- Demander à l'Agent d'utiliser `submit_plan` pour soumettre des plans pour une révision interactive
- Utiliser `/plannotator-review` pour réviser manuellement les Git diff

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons les **[Bases de la révision de plans](../../platforms/plan-review-basics/)**.
>
> Vous apprendrez :
> - Comment visualiser les plans générés par l'IA
> - Ajouter différents types d'annotations (suppression, remplacement, insertion, commentaire)
> - Approuver ou rejeter un plan

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition du point d'entrée du plugin | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 34-280 |
| Définition de l'outil `submit_plan` | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 209-252 |
| Injection de la configuration du plugin (opencode.json) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 55-63 |
| Lecture des variables d'environnement | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |
| Démarrage du serveur de révision de plans | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts) | Fichier entier |
| Démarrage du serveur de révision de code | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts) | Fichier entier |
| Détection du mode distant | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | Fichier entier |

**Constantes clés** :
- `PLANNOTATOR_REMOTE` : Indicateur du mode distant (définir à "1" ou "true" pour activer)
- `PLANNOTATOR_PORT` : Numéro de port fixe (aléatoire par défaut en local, 19432 par défaut en distant)

**Fonctions clés** :
- `startPlannotatorServer()` : Démarre le serveur de révision de plans
- `startReviewServer()` : Démarre le serveur de révision de code
- `getSharingEnabled()` : Obtient l'état du commutateur de partage d'URL (depuis la configuration OpenCode ou les variables d'environnement)

</details>
