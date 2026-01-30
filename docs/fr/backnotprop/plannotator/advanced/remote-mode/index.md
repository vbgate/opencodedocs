---
title: "Mode distant : configuration | plannotator"
subtitle: "Mode distant : configuration | plannotator"
sidebarTitle: "Accéder à Plannotator dans un environnement distant"
description: "Apprenez à configurer le mode distant de Plannotator. Configurez un port fixe dans les environnements SSH, Devcontainer et WSL, configurez le transfert de port et accédez à l'interface de révision depuis votre navigateur local."
tags:
  - "Développement distant"
  - "Devcontainer"
  - "Transfert de port"
  - "SSH"
  - "WSL"
prerequisite:
  - "start-getting-started"
order: 4
---

# Configuration du mode distant / Devcontainer

## Ce que vous pourrez faire

- Utiliser Plannotator sur un serveur distant connecté via SSH
- Configurer et accéder à Plannotator dans un devcontainer VS Code
- Utiliser Plannotator dans un environnement WSL (Windows Subsystem for Linux)
- Configurer le transfert de port pour accéder à Plannotator depuis votre navigateur local

## Votre problème actuel

Vous utilisez Claude Code ou OpenCode dans un environnement distant, un devcontainer ou WSL. Lorsque l'IA génère un plan ou nécessite une révision de code, Plannotator tente d'ouvrir un navigateur dans l'environnement distant - mais il n'y a pas d'interface graphique, ou vous souhaitez voir l'interface de révision dans votre navigateur local.

## Quand utiliser cette méthode

Scénarios typiques nécessitant le mode distant / Devcontainer :

| Scénario | Description |
|--- | ---|
| **Connexion SSH** | Vous vous connectez via SSH à un serveur de développement distant |
| **Devcontainer** | Vous utilisez un devcontainer dans VS Code pour le développement |
| **WSL** | Vous utilisez WSL sur Windows pour le développement Linux |
| **Environnement cloud** | Votre code s'exécute dans un conteneur ou une machine virtuelle dans le cloud |

## Concept clé

L'utilisation de Plannotator dans un environnement distant nécessite de résoudre deux problèmes :

1. **Port fixe** : L'environnement distant ne peut pas choisir automatiquement un port aléatoire, car vous devez configurer le transfert de port
2. **Accès navigateur** : L'environnement distant n'a pas d'interface graphique, vous devez donc accéder depuis le navigateur de votre machine locale

Plannotator passe automatiquement en "mode distant" en détectant la variable d'environnement `PLANNOTATOR_REMOTE` :
- Utilise un port fixe (par défaut 19432) au lieu d'un port aléatoire
- Saute l'ouverture automatique du navigateur
- Affiche l'URL dans le terminal pour vous permettre d'y accéder manuellement depuis votre navigateur local

## 🎒 Prérequis

::: warning Conditions préalables

Avant de commencer ce tutoriel, assurez-vous de :
- Avoir terminé le [Démarrage rapide](../../start/getting-started/)
- Avoir installé et configuré le [plugin Claude Code](../../start/installation-claude-code/) ou le [plugin OpenCode](../../start/installation-opencode/)
- Comprendre les concepts de base de la configuration SSH ou devcontainer

:::

---

## Suivez le guide

### Étape 1 : Comprendre les variables d'environnement du mode distant

Le mode distant de Plannotator dépend de trois variables d'environnement :

| Variable d'environnement | Description | Valeur par défaut |
|--- | --- | ---|
| `PLANNOTATOR_REMOTE` | Active le mode distant | Non définie (mode local) |
| `PLANNOTATOR_PORT` | Numéro de port fixe | Aléatoire (local) / 19432 (distant) |
| `PLANNOTATOR_BROWSER` | Chemin du navigateur personnalisé | Navigateur par défaut du système |

**Pourquoi**

- `PLANNOTATOR_REMOTE` indique à Plannotator qu'il est dans un environnement distant et qu'il ne doit pas essayer d'ouvrir un navigateur
- `PLANNOTATOR_PORT` définit un port fixe pour faciliter la configuration du transfert de port
- `PLANNOTATOR_BROWSER` (optionnel) spécifie le chemin du navigateur à utiliser sur votre machine locale

---

### Étape 2 : Configurer sur un serveur distant SSH

#### Configurer le transfert de port SSH

Éditez votre fichier de configuration SSH `~/.ssh/config` :

```bash
Host your-server
    HostName your-server.com
    User your-username
    LocalForward 9999 localhost:9999
```

**Ce que vous devriez voir** :
- Ajout de la ligne `LocalForward 9999 localhost:9999`
- Cela transférera le trafic du port local 9999 vers le port 9999 du serveur distant

#### Définir les variables d'environnement sur le serveur distant

Après vous être connecté au serveur distant, définissez les variables d'environnement dans le terminal :

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

**Pourquoi**
- `PLANNOTATOR_REMOTE=1` active le mode distant
- `PLANNOTATOR_PORT=9999` utilise le port fixe 9999 (cohérent avec le numéro de port dans la configuration SSH)

::: tip Configuration persistante
Si définir manuellement les variables d'environnement à chaque connexion est fastidieux, vous pouvez les ajouter à votre fichier de configuration shell (`~/.bashrc` ou `~/.zshrc`) :

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Utiliser Plannotator

Maintenant, vous pouvez utiliser normalement Claude Code ou OpenCode sur le serveur distant. Lorsque l'IA génère un plan ou nécessite une révision de code :

```bash
# Sur le serveur distant, le terminal affichera des informations similaires :
[Plannotator] Server running at http://localhost:9999
[Plannotator] Access from your local machine: http://localhost:9999
```

**Ce que vous devriez voir** :
- Le terminal affiche l'URL de Plannotator
- L'environnement distant n'ouvre pas de navigateur (comportement normal)

#### Accéder depuis le navigateur local

Ouvrez dans le navigateur de votre machine locale :

```
http://localhost:9999
```

**Ce que vous devriez voir** :
- L'interface de révision de Plannotator s'affiche normalement
- Vous pouvez effectuer une révision de plan ou de code comme dans un environnement local

**Point de contrôle ✅** :
- [ ] Le transfert de port SSH est configuré
- [ ] Les variables d'environnement sont définies
- [ ] Le terminal du serveur distant affiche l'URL
- [ ] Le navigateur local peut accéder à l'interface de révision

---

### Étape 3 : Configurer dans un Devcontainer VS Code

#### Configurer le devcontainer

Éditez votre fichier `.devcontainer/devcontainer.json` :

```json
{
  "name": "Your Devcontainer",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",

  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },

  "forwardPorts": [9999]
}
```

**Pourquoi**
- `containerEnv` définit les variables d'environnement dans le conteneur
- `forwardPorts` indique à VS Code de transférer automatiquement les ports du conteneur vers la machine locale

#### Reconstruire et démarrer le devcontainer

1. Ouvrez la palette de commandes VS Code (`Ctrl+Shift+P` ou `Cmd+Shift+P`)
2. Tapez `Dev Containers: Rebuild Container` et exécutez
3. Attendez que la reconstruction du conteneur soit terminée

**Ce que vous devriez voir** :
- VS Code affiche l'état du transfert de port dans le coin inférieur droit (généralement une petite icône)
- Après avoir cliqué, vous pouvez voir que "Port 9999" est transféré

#### Utiliser Plannotator

Utilisez normalement Claude Code ou OpenCode dans le devcontainer. Lorsque l'IA génère un plan :

```bash
# Sortie du terminal dans le conteneur :
[Plannotator] Server running at http://localhost:9999
```

**Ce que vous devriez voir** :
- Le terminal affiche l'URL de Plannotator
- Le conteneur n'ouvre pas de navigateur (comportement normal)

#### Accéder depuis le navigateur local

Ouvrez dans le navigateur de votre machine locale :

```
http://localhost:9999
```

**Ce que vous devriez voir** :
- L'interface de révision de Plannotator s'affiche normalement

**Point de contrôle ✅** :
- [ ] La configuration du devcontainer a ajouté les variables d'environnement et le transfert de port
- [ ] Le conteneur a été reconstruit
- [ ] VS Code affiche que le port est transféré
- [ ] Le navigateur local peut accéder à l'interface de révision

---

### Étape 4 : Configurer dans un environnement WSL

La configuration de l'environnement WSL est similaire à celle d'une connexion SSH, mais vous n'avez pas besoin de configurer manuellement le transfert de port - WSL transfère automatiquement le trafic localhost vers le système Windows.

#### Définir les variables d'environnement

Définissez les variables d'environnement dans le terminal WSL :

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

::: tip Configuration persistante
Ajoutez ces variables d'environnement à votre fichier de configuration shell WSL (`~/.bashrc` ou `~/.zshrc`) :

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Utiliser Plannotator

Utilisez normalement Claude Code ou OpenCode dans WSL :

```bash
# Sortie du terminal WSL :
[Plannotator] Server running at http://localhost:9999
```

**Ce que vous devriez voir** :
- Le terminal affiche l'URL de Plannotator
- WSL n'ouvre pas de navigateur (comportement normal)

#### Accéder depuis le navigateur Windows

Ouvrez dans le navigateur Windows :

```
http://localhost:9999
```

**Ce que vous devriez voir** :
- L'interface de révision de Plannotator s'affiche normalement

**Point de contrôle ✅** :
- [ ] Les variables d'environnement sont définies
- [ ] Le terminal WSL affiche l'URL
- [ ] Le navigateur Windows peut accéder à l'interface de révision

---

## Pièges courants

### Port déjà utilisé

Si vous voyez une erreur similaire :

```
Error: bind: EADDRINUSE: address already in use :::9999
```

**Solution** :
1. Changez le numéro de port :
   ```bash
   export PLANNOTATOR_PORT=10000  # Utilisez un port non utilisé
   ```
2. Ou arrêtez le processus utilisant le port 9999 :
   ```bash
   lsof -ti:9999 | xargs kill -9
   ```

### Le transfert de port SSH ne fonctionne pas

Si le navigateur local ne peut pas accéder à Plannotator :

**Liste de vérification** :
- [ ] Le numéro de port `LocalForward` dans le fichier de configuration SSH correspond à `PLANNOTATOR_PORT`
- [ ] Vous avez déconnecté et reconnecté SSH
- [ ] Le pare-feu ne bloque pas le transfert de port

### Le transfert de port Devcontainer ne fonctionne pas

Si VS Code ne transfère pas automatiquement les ports :

**Solution** :
1. Vérifiez la configuration `forwardPorts` dans `.devcontainer/devcontainer.json`
2. Transférez le port manuellement :
   - Ouvrez la palette de commandes VS Code
   - Exécutez `Forward a Port`
   - Entrez le numéro de port `9999`

### Impossible d'accéder depuis WSL

Si le navigateur Windows ne peut pas accéder à Plannotator dans WSL :

**Solution** :
1. Vérifiez que les variables d'environnement sont correctement définies
2. Essayez d'utiliser `0.0.0.0` au lieu de `localhost` (selon la version WSL et la configuration réseau)
3. Vérifiez les paramètres du pare-feu Windows

---

## Résumé de la leçon

Points clés du mode distant / Devcontainer :

| Point | Description |
|--- | ---|
| **Variables d'environnement** | `PLANNOTATOR_REMOTE=1` active le mode distant |
| **Port fixe** | Utilisez `PLANNOTATOR_PORT` pour définir un port fixe (par défaut 19432) |
| **Transfert de port** | SSH / Devcontainer nécessite une configuration du transfert de port, WSL transfère automatiquement |
| **Accès manuel** | Le mode distant n'ouvre pas automatiquement le navigateur, vous devez y accéder manuellement depuis votre navigateur local |
| **Persistance** | Ajoutez les variables d'environnement aux fichiers de configuration pour éviter les définitions répétées |

---

## Prochain cours

> Dans le prochain cours, nous apprendrons **[Configuration détaillée des variables d'environnement](../environment-variables/)**.
>
> Vous apprendrez :
> - Toutes les variables d'environnement disponibles pour Plannotator
> - Le rôle et la valeur par défaut de chaque variable d'environnement
> - Comment combiner les variables d'environnement selon différents scénarios

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour afficher les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Détection de session distante | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L16-L29) | 16-29 |
| Obtention du port du serveur | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L34-L49) | 34-49 |
| Logique de démarrage du serveur | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L97) | 91-97 |
| Logique d'ouverture du navigateur | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Détection WSL | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L11-L34) | 11-34 |

**Constantes clés** :
- `DEFAULT_REMOTE_PORT = 19432` : Numéro de port par défaut en mode distant

**Fonctions clés** :
- `isRemoteSession()` : Détecte si l'exécution a lieu dans une session distante
- `getServerPort()` : Obtient le port du serveur (port fixe en distant, port aléatoire en local)
- `openBrowser(url)` : Ouvre le navigateur de manière multiplateforme

</details>
