---
title: "Problèmes courants : Guide de dépannage | Plannotator"
sidebarTitle: "Que faire en cas de problème"
subtitle: "Problèmes courants : Guide de dépannage"
description: "Apprenez à diagnostiquer et résoudre les problèmes courants de Plannotator. Résolvez rapidement les conflits de port, les problèmes de navigateur, les échecs de commandes Git, les téléchargements d'images et les problèmes d'intégration."
tags:
  - "problèmes courants"
  - "dépannage"
  - "conflit de port"
  - "navigateur"
  - "Git"
  - "environnement distant"
  - "problèmes d'intégration"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 1
---

# Problèmes courants

## Ce que vous saurez faire

- ✅ Diagnostiquer et résoudre rapidement les conflits de port
- ✅ Comprendre pourquoi le navigateur ne s'ouvre pas automatiquement et savoir comment y accéder
- ✅ Dépanner les problèmes d'affichage des plans ou des revues de code
- ✅ Gérer les échecs d'exécution des commandes Git
- ✅ Résoudre les erreurs liées au téléchargement d'images
- ✅ Diagnostiquer les échecs d'intégration Obsidian/Bear
- ✅ Accéder correctement à Plannotator dans un environnement distant

## Votre problème actuel

Lors de l'utilisation de Plannotator, vous pouvez rencontrer ces problèmes :

- **Problème 1** : Au démarrage, le port est occupé et le serveur ne peut pas démarrer
- **Problème 2** : Le navigateur ne s'ouvre pas automatiquement, vous ne savez pas comment accéder à l'interface de revue
- **Problème 3** : La page de plan ou de revue de code affiche un écran blanc, le contenu ne se charge pas
- **Problème 4** : Lors de l'exécution de `/plannotator-review`, une erreur Git apparaît
- **Problème 5** : Le téléchargement d'images échoue ou les images ne s'affichent pas
- **Problème 6** : L'intégration Obsidian/Bear est configurée, mais les plans ne sont pas sauvegardés automatiquement
- **Problème 7** : Impossible d'accéder au serveur local dans un environnement distant

Ces problèmes interrompent votre flux de travail et affectent l'expérience utilisateur.

## Concept clé

::: info Mécanisme de gestion des erreurs

Le serveur Plannotator implémente un **mécanisme de nouvelle tentative automatique** :

- **Nombre maximum de tentatives** : 5 fois
- **Délai entre les tentatives** : 500 millisecondes
- **Scénario d'application** : Conflit de port (erreur EADDRINUSE)

En cas de conflit de port, le système essaiera automatiquement d'autres ports. Une erreur ne sera signalée qu'après 5 tentatives infructueuses.

:::

La gestion des erreurs de Plannotator suit ces principes :

1. **Priorité locale** : Tous les messages d'erreur sont affichés dans le terminal ou la console
2. **Dégradation gracieuse** : Les échecs d'intégration (comme l'échec de sauvegarde Obsidian) ne bloquent pas le flux principal
3. **Messages clairs** : Fournit des messages d'erreur spécifiques et des solutions suggérées

## Problèmes courants et solutions

### Problème 1 : Port occupé

**Message d'erreur** :

```
Port 19432 in use after 5 retries
```

**Analyse de la cause** :

- Le port est déjà utilisé par un autre processus
- En mode distant, un port fixe est configuré mais il y a un conflit
- Le processus Plannotator précédent ne s'est pas terminé correctement

**Solutions** :

#### Méthode 1 : Attendre la nouvelle tentative automatique (mode local uniquement)

En mode local, Plannotator essaiera automatiquement des ports aléatoires. Si vous voyez une erreur de port occupé, cela signifie généralement :

- Les 5 ports aléatoires sont tous occupés (extrêmement rare)
- Un port fixe est configuré (`PLANNOTATOR_PORT`) mais il y a un conflit

**Vous devriez voir** : Le terminal affiche "Port X in use after 5 retries"

#### Méthode 2 : Utiliser un port fixe (mode distant)

Dans un environnement distant, vous devez configurer `PLANNOTATOR_PORT` :

::: code-group

```bash [macOS/Linux]
export PLANNOTATOR_PORT=9999
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT = "9999"
plannotator start
```

:::

::: tip Conseils pour le choix du port

- Choisissez un port dans la plage 1024-49151 (ports utilisateur)
- Évitez les ports de services courants (80, 443, 3000, 5000, etc.)
- Assurez-vous que le port n'est pas bloqué par le pare-feu

:::

#### Méthode 3 : Nettoyer le processus occupant le port

```bash
# Trouver le processus occupant le port (remplacez 19432 par votre port)
lsof -i :19432  # macOS/Linux
netstat -ano | findstr :19432  # Windows

# Terminer le processus (remplacez PID par l'ID du processus réel)
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

::: warning Attention

Avant de terminer un processus, assurez-vous qu'il ne s'agit pas d'une autre application importante. Plannotator ferme automatiquement le serveur après avoir reçu une décision, il n'est généralement pas nécessaire de le terminer manuellement.

:::

---

### Problème 2 : Le navigateur ne s'ouvre pas automatiquement

**Symptôme** : Le terminal indique que le serveur a démarré, mais le navigateur ne s'ouvre pas.

**Analyse de la cause** :

| Scénario | Raison |
| --- | --- |
| Environnement distant | Plannotator détecte le mode distant et ignore l'ouverture automatique du navigateur |
| Configuration `PLANNOTATOR_BROWSER` incorrecte | Le chemin ou le nom du navigateur est incorrect |
| Navigateur non installé | Le navigateur par défaut du système n'existe pas |

**Solutions** :

#### Scénario 1 : Environnement distant (SSH, Devcontainer, WSL)

**Vérifier si c'est un environnement distant** :

```bash
echo $PLANNOTATOR_REMOTE
# Affiche "1" ou "true" pour indiquer le mode distant
```

**Dans un environnement distant** :

1. **Le terminal affichera l'URL d'accès** :

```
Plannotator running at: http://localhost:9999
Press Ctrl+C to stop
```

2. **Ouvrez manuellement le navigateur** et accédez à l'URL affichée

3. **Configurez la redirection de port** (si nécessaire pour accéder depuis la machine locale)

**Vous devriez voir** : Le terminal affiche quelque chose comme "Plannotator running at: http://localhost:19432"

#### Scénario 2 : Mode local mais le navigateur ne s'ouvre pas

**Vérifier la configuration `PLANNOTATOR_BROWSER`** :

::: code-group

```bash [macOS/Linux]
echo $PLANNOTATOR_BROWSER
# Devrait afficher le nom ou le chemin du navigateur
```

```powershell [Windows PowerShell]
echo $env:PLANNOTATOR_BROWSER
```

:::

**Supprimer la configuration personnalisée du navigateur** :

::: code-group

```bash [macOS/Linux]
unset PLANNOTATOR_BROWSER
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_BROWSER = ""
plannotator start
```

:::

**Configurer le bon navigateur** (si personnalisation nécessaire) :

```bash
# macOS : Utiliser le nom de l'application
export PLANNOTATOR_BROWSER="Google Chrome"

# Linux : Utiliser le chemin du fichier exécutable
export PLANNOTATOR_BROWSER="/usr/bin/google-chrome"

# Windows : Utiliser le chemin du fichier exécutable
set PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

### Problème 3 : Le plan ou la revue de code ne s'affiche pas

**Symptôme** : Le navigateur s'ouvre, mais la page affiche un écran blanc ou ne se charge pas.

**Causes possibles** :

| Raison | Revue de plan | Revue de code |
| --- | --- | --- |
| Paramètre Plan vide | ✅ Courant | ❌ Non applicable |
| Problème de dépôt Git | ❌ Non applicable | ✅ Courant |
| Aucun diff à afficher | ❌ Non applicable | ✅ Courant |
| Échec du démarrage du serveur | ✅ Possible | ✅ Possible |

**Solutions** :

#### Situation 1 : La revue de plan ne s'affiche pas

**Vérifier la sortie du terminal** :

```bash
# Rechercher les messages d'erreur
plannotator start 2>&1 | grep -i error
```

**Erreur courante 1** : Paramètre Plan vide

**Message d'erreur** :

```
400 Bad Request - Missing plan or plan is empty
```

**Raison** : Le plan transmis par Claude Code ou OpenCode est une chaîne vide.

**Solution** :

- Confirmez que l'agent IA a généré un contenu de plan valide
- Vérifiez que la configuration du Hook ou du Plugin est correcte
- Consultez les journaux de Claude Code/OpenCode pour plus d'informations

**Erreur courante 2** : Le serveur ne démarre pas correctement

**Solution** :

- Vérifiez si le terminal affiche le message "Plannotator running at"
- Si ce n'est pas le cas, consultez "Problème 1 : Port occupé"
- Consultez [Configuration des variables d'environnement](../../advanced/environment-variables/) pour confirmer que la configuration est correcte

#### Situation 2 : La revue de code ne s'affiche pas

**Vérifier la sortie du terminal** :

```bash
/plannotator-review 2>&1 | grep -i error
```

**Erreur courante 1** : Pas de dépôt Git

**Message d'erreur** :

```
fatal: not a git repository
```

**Solution** :

```bash
# Initialiser le dépôt Git
git init

# Ajouter des fichiers et valider (s'il y a des modifications non validées)
git add .
git commit -m "Initial commit"

# Exécuter à nouveau
/plannotator-review
```

**Vous devriez voir** : Le navigateur affiche le visualiseur de diff

**Erreur courante 2** : Aucun diff à afficher

**Symptôme** : La page affiche "No changes" ou un message similaire.

**Solution** :

```bash
# Vérifier s'il y a des modifications non validées
git status

# Vérifier s'il y a des modifications staged
git diff --staged

# Vérifier s'il y a des commits
git log --oneline

# Changer le type de diff pour voir différentes plages
# Dans l'interface de revue de code, cliquez sur le menu déroulant pour basculer :
# - Uncommitted changes
# - Staged changes
# - Last commit
# - vs main (si sur une branche)
```

**Vous devriez voir** : Le visualiseur de diff affiche les modifications de code ou indique "No changes"

**Erreur courante 3** : Échec de l'exécution de la commande Git

**Message d'erreur** :

```
Git diff error for uncommitted: [message d'erreur spécifique]
```

**Causes possibles** :

- Git n'est pas installé
- Version de Git trop ancienne
- Problème de configuration Git

**Solution** :

```bash
# Vérifier la version de Git
git --version

# Tester la commande Git diff
git diff HEAD

# Si Git fonctionne normalement, le problème peut être une erreur interne de Plannotator
# Consultez le message d'erreur complet et signalez le bug
```

---

### Problème 4 : Échec du téléchargement d'images

**Messages d'erreur** :

```
400 Bad Request - No file provided
500 Internal Server Error - Upload failed
```

**Causes possibles** :

| Raison | Solution |
| --- | --- |
| Aucun fichier sélectionné | Cliquez sur le bouton de téléchargement et sélectionnez une image |
| Format de fichier non pris en charge | Utilisez les formats png/jpeg/webp |
| Fichier trop volumineux | Compressez l'image avant de la télécharger |
| Problème de permissions du répertoire temporaire | Vérifiez les permissions du répertoire /tmp/plannotator |

**Solutions** :

#### Vérifier le fichier téléchargé

**Formats pris en charge** :

- ✅ PNG (`.png`)
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

**Formats non pris en charge** :

- ❌ BMP (`.bmp`)
- ❌ GIF (`.gif`)
- ❌ SVG (`.svg`)

**Vous devriez voir** : Après un téléchargement réussi, l'image s'affiche dans l'interface de revue

#### Vérifier les permissions du répertoire temporaire

Plannotator crée automatiquement le répertoire `/tmp/plannotator`. Si le téléchargement échoue toujours, vérifiez les permissions du répertoire temporaire du système.

**Pour vérifier manuellement** :

```bash
# Vérifier les permissions du répertoire
ls -la /tmp/plannotator

# Vérification Windows
dir %TEMP%\plannotator
```

**Vous devriez voir** : `drwxr-xr-x` (ou permissions similaires) indiquant que le répertoire est accessible en écriture

#### Consulter les outils de développement du navigateur

1. Appuyez sur F12 pour ouvrir les outils de développement
2. Passez à l'onglet "Network"
3. Cliquez sur le bouton de téléchargement
4. Recherchez la requête `/api/upload`
5. Vérifiez le statut de la requête et la réponse

**Vous devriez voir** :
- Code de statut : 200 OK (succès)
- Réponse : `{"path": "/tmp/plannotator/xxx.png"}`

---

### Problème 5 : Échec de l'intégration Obsidian/Bear

**Symptôme** : Après avoir approuvé le plan, aucun plan n'est sauvegardé dans l'application de notes.

**Causes possibles** :

| Raison | Obsidian | Bear |
| --- | --- | --- |
| Intégration non activée | ✅ | ✅ |
| Vault/App non détecté | ✅ | N/A |
| Chemin de configuration incorrect | ✅ | ✅ |
| Conflit de nom de fichier | ✅ | ✅ |
| Échec de x-callback-url | N/A | ✅ |

**Solutions** :

#### Problèmes d'intégration Obsidian

**Étape 1 : Vérifier si l'intégration est activée**

1. Dans l'interface Plannotator, cliquez sur l'icône des paramètres (engrenage)
2. Recherchez la section "Obsidian Integration"
3. Assurez-vous que l'interrupteur est activé

**Vous devriez voir** : L'interrupteur affiché en bleu (état activé)

**Étape 2 : Vérifier la détection du Vault**

**Détection automatique** :

- Plannotator lit automatiquement le fichier de configuration Obsidian
- Emplacement du fichier de configuration :
  - macOS: `~/Library/Application Support/obsidian/obsidian.json`
  - Windows: `%APPDATA%\obsidian\obsidian.json`
  - Linux: `~/.config/obsidian/obsidian.json`

**Vérification manuelle** :

::: code-group

```bash [macOS]
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

```powershell [Windows PowerShell]
cat $env:APPDATA\obsidian\obsidian.json
```

```bash [Linux]
cat ~/.config/obsidian/obsidian.json
```

:::

**Vous devriez voir** : Un fichier JSON contenant le champ `vaults`

**Étape 3 : Configurer manuellement le chemin du Vault**

Si la détection automatique échoue :

1. Dans les paramètres de Plannotator
2. Cliquez sur "Manually enter vault path"
3. Entrez le chemin complet du Vault

**Exemples de chemins** :

- macOS: `/Users/yourname/Documents/ObsidianVault`
- Windows: `C:\Users\yourname\Documents\ObsidianVault`
- Linux: `/home/yourname/Documents/ObsidianVault`

**Vous devriez voir** : Le menu déroulant affiche le nom du Vault que vous avez saisi

**Étape 4 : Vérifier la sortie du terminal**

Le résultat de la sauvegarde Obsidian est affiché dans le terminal :

```bash
[Obsidian] Saved plan to: /path/to/vault/plannotator/Title - Jan 24, 2026 2-30pm.md
```

**Messages d'erreur** :

```
[Obsidian] Save failed: [message d'erreur spécifique]
```

**Erreurs courantes** :

- Permissions insuffisantes → Vérifiez les permissions du répertoire Vault
- Espace disque insuffisant → Libérez de l'espace
- Chemin invalide → Confirmez l'orthographe du chemin

#### Problèmes d'intégration Bear

**Vérifier l'application Bear**

- Assurez-vous que Bear est installé sur macOS
- Assurez-vous que l'application Bear est en cours d'exécution

**Tester x-callback-url** :

```bash
# Tester dans le terminal
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**Vous devriez voir** : Bear s'ouvre et crée une nouvelle note

**Vérifier la sortie du terminal** :

```bash
[Bear] Saved plan to Bear
```

**Messages d'erreur** :

```
[Bear] Save failed: [message d'erreur spécifique]
```

**Solutions** :

- Redémarrez l'application Bear
- Confirmez que Bear est à jour
- Vérifiez les paramètres de permissions macOS (autoriser Bear à accéder aux fichiers)

---

### Problème 6 : Problèmes d'accès dans un environnement distant

**Symptôme** : Dans SSH, Devcontainer ou WSL, impossible d'accéder au serveur depuis le navigateur local.

**Concept clé** :

::: info Qu'est-ce qu'un environnement distant

Un environnement distant est un environnement informatique distant accessible via SSH, Devcontainer ou WSL. Dans cet environnement, vous devez utiliser la **redirection de port** pour mapper le port distant vers le port local afin d'accéder au serveur distant dans votre navigateur local.

:::

**Solutions** :

#### Étape 1 : Configurer le mode distant

Définir les variables d'environnement dans l'environnement distant :

::: code-group

```bash [macOS/Linux/WSL]
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

```powershell [Windows]
$env:PLANNOTATOR_REMOTE = "1"
$env:PLANNOTATOR_PORT = "9999"
```

:::

**Vous devriez voir** : Le terminal affiche "Using remote mode with fixed port: 9999"

#### Étape 2 : Configurer la redirection de port

**Scénario 1 : Serveur distant SSH**

Éditez `~/.ssh/config` :

```
Host your-server
    HostName server.example.com
    User yourname
    LocalForward 9999 localhost:9999
```

**Se connecter au serveur** :

```bash
ssh your-server
```

**Vous devriez voir** : Après l'établissement de la connexion SSH, le port local 9999 est redirigé vers le port distant 9999

**Scénario 2 : VS Code Devcontainer**

VS Code Devcontainer redirige généralement les ports automatiquement.

**Méthode de vérification** :

1. Dans VS Code, ouvrez l'onglet "Ports"
2. Recherchez le port 9999
3. Assurez-vous que le statut du port est "Forwarded"

**Vous devriez voir** : L'onglet Ports affiche "Local Address: localhost:9999"

**Scénario 3 : WSL (Windows Subsystem for Linux)**

WSL utilise par défaut la redirection `localhost`.

**Méthode d'accès** :

Dans le navigateur Windows, accédez directement à :

```
http://localhost:9999
```

**Vous devriez voir** : L'interface Plannotator s'affiche normalement

#### Étape 3 : Vérifier l'accès

1. Démarrez Plannotator dans l'environnement distant
2. Dans le navigateur local, accédez à `http://localhost:9999`
3. Confirmez que la page s'affiche normalement

**Vous devriez voir** : L'interface de revue de plan ou de revue de code se charge normalement

---

### Problème 7 : Le plan/les annotations ne sont pas sauvegardés correctement

**Symptôme** : Après avoir approuvé ou rejeté le plan, les annotations ne sont pas sauvegardées ou l'emplacement de sauvegarde est incorrect.

**Causes possibles** :

| Raison | Solution |
| --- | --- |
| Sauvegarde du plan désactivée | Vérifiez l'option "Plan Save" dans les paramètres |
| Chemin personnalisé invalide | Vérifiez que le chemin est accessible en écriture |
| Contenu d'annotation vide | C'est un comportement normal (sauvegarde uniquement si annotations présentes) |
| Problème de permissions du serveur | Vérifiez les permissions du répertoire de sauvegarde |

**Solutions** :

#### Vérifier les paramètres de sauvegarde du plan

1. Dans l'interface Plannotator, cliquez sur l'icône des paramètres (engrenage)
2. Consultez la section "Plan Save"
3. Confirmez que l'interrupteur est activé

**Vous devriez voir** : L'interrupteur "Save plans and annotations" en bleu (état activé)

#### Vérifier le chemin de sauvegarde

**Emplacement de sauvegarde par défaut** :

```bash
~/.plannotator/plans/  # Les plans et annotations sont tous sauvegardés dans ce répertoire
```

**Chemin personnalisé** :

Vous pouvez configurer un chemin de sauvegarde personnalisé dans les paramètres.

**Vérifier que le chemin est accessible en écriture** :

::: code-group

```bash [macOS/Linux]
ls -la ~/.plannotator
mkdir -p ~/.plannotator/plans
touch ~/.plannotator/plans/test.txt
rm ~/.plannotator/plans/test.txt
```

```powershell [Windows PowerShell]
dir $env:USERPROFILE\.plannotator
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.plannotator\plans"
```

:::

**Vous devriez voir** : Les commandes s'exécutent avec succès, sans erreur de permissions

#### Consulter la sortie du terminal

Le résultat de la sauvegarde est affiché dans le terminal :

```bash
[Plan] Saved annotations to: ~/.plannotator/annotations/slug.json
[Plan] Saved snapshot to: ~/.plannotator/plans/slug-approved.md
```

**Vous devriez voir** : Des messages de succès similaires

---

## Résumé de la leçon

Dans cette leçon, vous avez appris :

- **Diagnostiquer les conflits de port** : Utiliser un port fixe ou nettoyer les processus occupants
- **Gérer le navigateur qui ne s'ouvre pas** : Identifier le mode distant, accéder manuellement ou configurer le navigateur
- **Dépanner le contenu qui ne s'affiche pas** : Vérifier les paramètres Plan, le dépôt Git, l'état du diff
- **Résoudre les échecs de téléchargement d'images** : Vérifier le format de fichier, les permissions du répertoire, les outils de développement
- **Corriger les échecs d'intégration** : Vérifier la configuration, les chemins, les permissions et la sortie du terminal
- **Configurer l'accès distant** : Utiliser PLANNOTATOR_REMOTE et la redirection de port
- **Sauvegarder les plans et annotations** : Activer la sauvegarde des plans et vérifier les permissions du chemin

**À retenir** :

1. La sortie du terminal est la meilleure source d'informations de débogage
2. Les environnements distants nécessitent une redirection de port
3. Les échecs d'intégration ne bloquent pas le flux principal
4. Utilisez les outils de développement pour consulter les détails des requêtes réseau

## Prochaines étapes

Si le problème que vous rencontrez n'est pas couvert dans cette leçon, vous pouvez consulter :

- [Dépannage](../troubleshooting/) - Techniques de débogage approfondies et méthodes d'analyse des journaux
- [Référence API](../../appendix/api-reference/) - Découvrez tous les points de terminaison API et les codes d'erreur
- [Modèles de données](../../appendix/data-models/) - Comprenez la structure des données de Plannotator

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Logique de démarrage du serveur et de nouvelle tentative | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L335) | 79-335 |
| Gestion des erreurs de port occupé (revue de plan) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L319-L334) | 319-334 |
| Gestion des erreurs de port occupé (revue de code) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L252-L267) | 252-267 |
| Détection du mode distant | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | Tout le fichier |
| Logique d'ouverture du navigateur | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | Tout le fichier |
| Exécution des commandes Git et gestion des erreurs | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L36-L147) | 36-147 |
| Traitement du téléchargement d'images (revue de plan) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| Traitement du téléchargement d'images (revue de code) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181-L201) | 181-201 |
| Intégration Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts) | Tout le fichier |
| Sauvegarde des plans | [`packages/server/storage.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/storage.ts) | Tout le fichier |

**Constantes clés** :

| Constante | Valeur | Description |
| --- | --- | --- |
| `MAX_RETRIES` | 5 | Nombre maximum de tentatives de démarrage du serveur |
| `RETRY_DELAY_MS` | 500 | Délai entre les tentatives (millisecondes) |

**Fonctions clés** :

- `startPlannotatorServer()` - Démarrer le serveur de revue de plan
- `startReviewServer()` - Démarrer le serveur de revue de code
- `isRemoteSession()` - Détecter si c'est un environnement distant
- `getServerPort()` - Obtenir le port du serveur
- `openBrowser()` - Ouvrir le navigateur
- `runGitDiff()` - Exécuter la commande Git diff
- `detectObsidianVaults()` - Détecter les vaults Obsidian
- `saveToObsidian()` - Sauvegarder le plan dans Obsidian
- `saveToBear()` - Sauvegarder le plan dans Bear

</details>
