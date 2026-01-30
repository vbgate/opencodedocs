---
title: "Variables d'environnement : Mode distant et configuration des ports | plannotator"
sidebarTitle: "Configuration distante en 5 min"
subtitle: "Variables d'environnement : Mode distant et configuration des ports"
description: "Apprenez à configurer les variables d'environnement de plannotator. Configurez le mode distant, les ports fixes, les navigateurs personnalisés et le partage d'URL pour SSH, Devcontainer et WSL."
tags:
  - "Variables d'environnement"
  - "Mode distant"
  - "Configuration des ports"
  - "Configuration du navigateur"
  - "Partage d'URL"
  - "Devcontainer"
  - "WSL"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 5
---

# Configuration des variables d'environnement

## Objectifs d'apprentissage

- ✅ Configurer correctement Plannotator dans les environnements distants (SSH, Devcontainer, WSL)
- ✅ Utiliser des ports fixes pour éviter les conflits et les configurations répétées de redirection de ports
- ✅ Spécifier un navigateur personnalisé pour ouvrir l'interface de révision des plans
- ✅ Activer ou désactiver la fonctionnalité de partage d'URL
- ✅ Comprendre les valeurs par défaut et le comportement de chaque variable d'environnement

## Les problèmes que vous rencontrez

**Problème 1** : Dans SSH ou Devcontainer, le navigateur ne s'ouvre pas automatiquement ou vous ne pouvez pas accéder au serveur local.

**Problème 2** : Chaque redémarrage de Plannotator utilise un port aléatoire, nécessitant des mises à jour constantes de la configuration de redirection de ports.

**Problème 3** : Le navigateur par défaut du système ne correspond pas à vos préférences, et vous souhaitez visualiser les plans dans un navigateur spécifique.

**Problème 4** : Pour des raisons de sécurité, vous souhaitez désactiver le partage d'URL pour éviter le partage accidentel des plans.

**Plannotator peut vous aider** :
- Détection automatique de l'environnement distant via les variables d'environnement et désactivation de l'ouverture automatique du navigateur
- Port fixe pour faciliter la configuration de la redirection de ports
- Support des navigateurs personnalisés
- Variables d'environnement pour contrôler le partage d'URL

## Quand utiliser cette fonctionnalité

**Cas d'utilisation** :
- Utilisation de Claude Code ou OpenCode sur un serveur SSH distant
- Développement dans un conteneur Devcontainer
- Travail dans un environnement WSL (Windows Subsystem for Linux)
- Besoin d'un port fixe pour simplifier la configuration de redirection de ports
- Préférence pour un navigateur spécifique (Chrome, Firefox, etc.)
- Politique de sécurité d'entreprise exigeant la désactivation du partage d'URL

**Cas non applicables** :
- Développement local avec le navigateur par défaut (aucune variable d'environnement nécessaire)
- Pas besoin de redirection de ports (développement entièrement local)

## Concept clé

### Qu'est-ce qu'une variable d'environnement ?

Les **variables d'environnement** sont un mécanisme de configuration clé-valeur fourni par le système d'exploitation. Plannotator lit ces variables pour s'adapter à différents environnements d'exécution (local ou distant).

::: info Pourquoi avez-vous besoin de variables d'environnement ?

Plannotator suppose par défaut que vous travaillez dans un environnement de développement local :
- Mode local : Port aléatoire (pour éviter les conflits)
- Mode local : Ouverture automatique du navigateur par défaut
- Mode local : Partage d'URL activé

Cependant, dans les environnements distants (SSH, Devcontainer, WSL), ces comportements par défaut doivent être ajustés :
- Mode distant : Port fixe (pour faciliter la redirection de ports)
- Mode distant : Pas d'ouverture automatique du navigateur (doit être ouvert sur la machine hôte)
- Mode distant : Possibilité de désactiver le partage d'URL (pour des raisons de sécurité)

Les variables d'environnement vous permettent d'ajuster le comportement de Plannotator dans différents environnements sans modifier le code.
:::

### Priorité des variables d'environnement

Priorité de lecture des variables d'environnement par Plannotator :

```
Variable d'environnement explicite > Comportement par défaut

Exemple :
PLANNOTATOR_PORT=3000 > Port par défaut du mode distant 19432 > Port aléatoire du mode local
```

Cela signifie :
- Si `PLANNOTATOR_PORT` est défini, ce port est utilisé quel que soit le mode
- Si `PLANNOTATOR_PORT` n'est pas défini, le mode distant utilise 19432, le mode local utilise un port aléatoire

## 🎒 Prérequis

Avant de configurer les variables d'environnement, vérifiez :

- [ ] Installation de Plannotator terminée ([Installation Claude Code](../installation-claude-code/) ou [Installation OpenCode](../installation-opencode/))
- [ ] Connaissance de votre environnement actuel (local, SSH, Devcontainer, WSL)
- [ ] (Environnement distant) Configuration de la redirection de ports effectuée (paramètre `-L` de SSH ou `forwardPorts` de Devcontainer)

## Tutoriel étape par étape

### Étape 1 : Configurer le mode distant (SSH, Devcontainer, WSL)

**Pourquoi**
Le mode distant utilise automatiquement un port fixe et désactive l'ouverture automatique du navigateur, adapté aux environnements SSH, Devcontainer et WSL.

**Comment faire**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
export PLANNOTATOR_REMOTE=1
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_REMOTE="1"
```

```cmd [Windows CMD]
set PLANNOTATOR_REMOTE=1
```

:::

**Résultat attendu** : Aucun retour visuel, la variable d'environnement est définie.

**Rendre permanent** (recommandé) :

::: code-group

```bash [~/.bashrc ou ~/.zshrc]
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
source ~/.bashrc
```

```powershell [Profil PowerShell]
[Environment]::SetEnvironmentVariable('PLANNOTATOR_REMOTE', '1', 'User')
```

```cmd [Variables d'environnement système]
# Ajouter via "Propriétés système > Variables d'environnement"
```

:::

### Étape 2 : Configurer un port fixe (requis pour les environnements distants)

**Pourquoi**
Les environnements distants nécessitent un port fixe pour configurer la redirection de ports. Les environnements locaux peuvent également définir un port fixe si nécessaire.

**Règles de port par défaut** :
- Mode local (sans `PLANNOTATOR_REMOTE`) : Port aléatoire (`0`)
- Mode distant (`PLANNOTATOR_REMOTE=1`) : Par défaut `19432`
- `PLANNOTATOR_PORT` défini explicitement : Utilise le port spécifié

**Comment faire**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# Définir à 19432 (par défaut du mode distant)
export PLANNOTATOR_PORT=19432

# Ou un port personnalisé
export PLANNOTATOR_PORT=3000
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT="19432"
```

```cmd [Windows CMD]
set PLANNOTATOR_PORT=19432
```

:::

**Résultat attendu** : Aucun retour visuel, la variable d'environnement est définie.

**Point de contrôle ✅** : Vérifier que le port est actif

Après avoir redémarré Claude Code ou OpenCode, déclenchez une révision de plan et vérifiez l'URL dans la sortie du terminal :

```bash
# Sortie en mode local (port aléatoire)
http://localhost:54321

# Sortie en mode distant (port fixe 19432)
http://localhost:19432
```

**Exemples de configuration de redirection de ports** :

Développement distant SSH :
```bash
ssh -L 19432:localhost:19432 user@remote-server
```

Devcontainer (`.devcontainer/devcontainer.json`) :
```json
{
  "forwardPorts": [19432]
}
```

### Étape 3 : Configurer un navigateur personnalisé

**Pourquoi**
Le navigateur par défaut du système peut ne pas être celui que vous préférez (par exemple, vous travaillez sur Chrome mais Safari est le navigateur par défaut).

**Comment faire**

::: code-group

```bash [macOS (Bash)]
# Utiliser le nom de l'application (supporté sur macOS)
export PLANNOTATOR_BROWSER="Google Chrome"

# Ou utiliser le chemin complet
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

```bash [Linux (Bash)]
# Utiliser le chemin de l'exécutable
export PLANNOTATOR_BROWSER="/usr/bin/firefox"

# Ou utiliser un chemin relatif (si dans le PATH)
export PLANNOTATOR_BROWSER="firefox"
```

```powershell [Windows PowerShell]
# Utiliser le chemin de l'exécutable
$env:PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

```cmd [Windows CMD]
set PLANNOTATOR_BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe
```

:::

**Résultat attendu** : Lors de la prochaine révision de plan, Plannotator ouvrira le navigateur spécifié.

**Point de contrôle ✅** : Vérifier que le navigateur est actif

Après le redémarrage, déclenchez une révision de plan et observez :
- macOS : L'application spécifiée s'ouvre
- Windows : Le processus du navigateur spécifié démarre
- Linux : La commande du navigateur spécifié s'exécute

**Chemins courants des navigateurs** :

| Système d'exploitation | Navigateur | Chemin/Commande |
| --- | --- | --- |
| macOS | Chrome | `Google Chrome` ou `/Applications/Google Chrome.app` |
| macOS | Firefox | `Firefox` ou `/Applications/Firefox.app` |
| macOS | Safari | `Safari` |
| Linux | Chrome | `google-chrome` ou `/usr/bin/google-chrome` |
| Linux | Firefox | `firefox` ou `/usr/bin/firefox` |
| Windows | Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Windows | Firefox | `C:\Program Files\Mozilla Firefox\firefox.exe` |

### Étape 4 : Configurer le partage d'URL

**Pourquoi**
Le partage d'URL est activé par défaut, mais pour des raisons de sécurité (environnement d'entreprise), vous pourriez avoir besoin de désactiver cette fonctionnalité.

**Comportement par défaut** :
- `PLANNOTATOR_SHARE` non défini : Partage d'URL activé
- Défini à `disabled` : Partage d'URL désactivé

**Comment faire**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# Désactiver le partage d'URL
export PLANNOTATOR_SHARE="disabled"
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_SHARE="disabled"
```

```cmd [Windows CMD]
set PLANNOTATOR_SHARE=disabled
```

:::

**Résultat attendu** : Après avoir cliqué sur le bouton Export, l'option "Share as URL" disparaît ou devient indisponible.

**Point de contrôle ✅** : Vérifier que le partage d'URL est désactivé

1. Redémarrez Claude Code ou OpenCode
2. Ouvrez n'importe quelle révision de plan
3. Cliquez sur le bouton "Export" en haut à droite
4. Observez la liste des options

**État activé** (par défaut) :
- ✅ Affiche les onglets "Share" et "Raw Diff"
- ✅ L'onglet "Share" affiche l'URL partageable et le bouton de copie

**État désactivé** (`PLANNOTATOR_SHARE="disabled"`) :
- ✅ Affiche directement le contenu "Raw Diff"
- ✅ Affiche les boutons "Copy" et "Download .diff"
- ❌ Pas d'onglet "Share" ni de fonctionnalité d'URL de partage

### Étape 5 : Vérifier toutes les variables d'environnement

**Pourquoi**
S'assurer que toutes les variables d'environnement sont correctement définies et fonctionnent comme prévu.

**Méthode de vérification**

```bash
# macOS/Linux/WSL
echo "PLANNOTATOR_REMOTE=$PLANNOTATOR_REMOTE"
echo "PLANNOTATOR_PORT=$PLANNOTATOR_PORT"
echo "PLANNOTATOR_BROWSER=$PLANNOTATOR_BROWSER"
echo "PLANNOTATOR_SHARE=$PLANNOTATOR_SHARE"
```

```powershell
# Windows PowerShell
Write-Host "PLANNOTATOR_REMOTE=$env:PLANNOTATOR_REMOTE"
Write-Host "PLANNOTATOR_PORT=$env:PLANNOTATOR_PORT"
Write-Host "PLANNOTATOR_BROWSER=$env:PLANNOTATOR_BROWSER"
Write-Host "PLANNOTATOR_SHARE=$env:PLANNOTATOR_SHARE"
```

**Résultat attendu** : Toutes les variables d'environnement définies et leurs valeurs.

**Exemple de sortie attendue** (configuration environnement distant) :
```bash
PLANNOTATOR_REMOTE=1
PLANNOTATOR_PORT=19432
PLANNOTATOR_BROWSER=
PLANNOTATOR_SHARE=
```

**Exemple de sortie attendue** (configuration environnement local) :
```bash
PLANNOTATOR_REMOTE=
PLANNOTATOR_PORT=
PLANNOTATOR_BROWSER=Google Chrome
PLANNOTATOR_SHARE=disabled
```

## Erreurs fréquentes à éviter

### Piège 1 : Les variables d'environnement ne prennent pas effet

**Symptôme** : Après avoir défini les variables d'environnement, le comportement de Plannotator ne change pas.

**Cause** : Les variables d'environnement ne prennent effet que dans les nouvelles sessions de terminal, ou l'application doit être redémarrée.

**Solution** :
- Vérifiez que les variables d'environnement sont écrites de manière permanente dans le fichier de configuration (comme `~/.bashrc`)
- Redémarrez le terminal ou exécutez `source ~/.bashrc`
- Redémarrez Claude Code ou OpenCode

### Piège 2 : Port déjà utilisé

**Symptôme** : Après avoir défini `PLANNOTATOR_PORT`, le démarrage échoue.

**Cause** : Le port spécifié est déjà utilisé par un autre processus.

**Solution** :
```bash
# Vérifier l'utilisation du port (macOS/Linux)
lsof -i :19432

# Changer de port
export PLANNOTATOR_PORT=19433
```

### Piège 3 : Chemin du navigateur incorrect

**Symptôme** : Après avoir défini `PLANNOTATOR_BROWSER`, le navigateur ne s'ouvre pas.

**Cause** : Le chemin est incorrect ou le fichier n'existe pas.

**Solution** :
- macOS : Utilisez le nom de l'application plutôt que le chemin complet (comme `Google Chrome`)
- Linux/Windows : Utilisez les commandes `which` ou `where` pour confirmer le chemin de l'exécutable
  ```bash
  which firefox  # Linux
  where chrome   # Windows
  ```

### Piège 4 : Le navigateur s'ouvre de manière inattendue en mode distant

**Symptôme** : Après avoir défini `PLANNOTATOR_REMOTE=1`, le navigateur s'ouvre toujours sur le serveur distant.

**Cause** : La valeur de `PLANNOTATOR_REMOTE` n'est pas `"1"` ou `"true"`.

**Solution** :
```bash
# Valeurs correctes
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_REMOTE=true

# Valeurs incorrectes (ne fonctionneront pas)
export PLANNOTATOR_REMOTE=yes
export PLANNOTATOR_REMOTE=enabled
```

### Piège 5 : L'option de partage d'URL s'affiche toujours après désactivation

**Symptôme** : Après avoir défini `PLANNOTATOR_SHARE=disabled`, "Share as URL" est toujours visible.

**Cause** : L'application doit être redémarrée pour que les changements prennent effet.

**Solution** : Redémarrez Claude Code ou OpenCode.

## Résumé

Cette leçon a couvert les 4 variables d'environnement principales de Plannotator :

| Variable d'environnement | Utilisation | Valeur par défaut | Cas d'utilisation |
| --- | --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Activation du mode distant | Non défini (mode local) | SSH, Devcontainer, WSL |
| `PLANNOTATOR_PORT` | Port fixe | Mode distant 19432, mode local aléatoire | Redirection de ports ou éviter les conflits |
| `PLANNOTATOR_BROWSER` | Navigateur personnalisé | Navigateur par défaut du système | Utiliser un navigateur spécifique |
| `PLANNOTATOR_SHARE` | Activation du partage d'URL | Non défini (activé) | Désactiver la fonctionnalité de partage |

**Points clés** :
- Le mode distant utilise automatiquement un port fixe et désactive l'ouverture automatique du navigateur
- Les variables d'environnement définies explicitement ont priorité sur le comportement par défaut
- Les modifications des variables d'environnement nécessitent un redémarrage de l'application pour prendre effet
- Les environnements d'entreprise peuvent nécessiter la désactivation du partage d'URL

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Dépannage des problèmes courants](../../faq/common-problems/)**.
>
> Vous apprendrez :
> - Comment résoudre les problèmes de port occupé
> - Gérer les cas où le navigateur ne s'ouvre pas
> - Corriger les erreurs de plan non affiché
> - Techniques de débogage et consultation des journaux

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Détection du mode distant | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 16-29 |
| Logique d'obtention du port | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 34-49 |
| Logique d'ouverture du navigateur | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 45-74 |
| Activation du partage d'URL (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts) | 44 |
| Activation du partage d'URL (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |

**Constantes clés** :
- `DEFAULT_REMOTE_PORT = 19432` : Port par défaut du mode distant

**Fonctions clés** :
- `isRemoteSession()` : Détecte si l'exécution se fait dans un environnement distant (SSH, Devcontainer, WSL)
- `getServerPort()` : Obtient le port du serveur (priorité : variable d'environnement, puis défaut du mode distant, puis aléatoire)
- `openBrowser(url)` : Ouvre l'URL dans le navigateur spécifié ou le navigateur par défaut du système

</details>
