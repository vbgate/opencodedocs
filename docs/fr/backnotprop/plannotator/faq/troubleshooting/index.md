---
title: "Dépannage : Résoudre les problèmes courants | Plannotator"
sidebarTitle: "Diagnostic rapide"
subtitle: "Dépannage : Résoudre les problèmes courants"
description: "Apprenez les méthodes de dépannage de Plannotator, y compris la consultation des journaux, l'occupation des ports, le débogage des événements Hook, les problèmes de navigateur, l'état du dépôt Git et la gestion des erreurs d'intégration."
tags:
  - "Dépannage"
  - "Débogage"
  - "Erreurs courantes"
  - "Consultation des journaux"
prerequisite:
  - "start-getting-started"
order: 2
---

# Dépannage de Plannotator

## Ce que vous pourrez faire après avoir terminé

En cas de problème, vous serez capable de :

- Localiser rapidement la source du problème (occupation de port, analyse d'événement Hook, configuration Git, etc.)
- Diagnostiquer les erreurs via les journaux de sortie
- Appliquer la bonne solution selon le type d'erreur
- Déboguer les problèmes de connexion en mode distant/Devcontainer

## Votre situation actuelle

Plannotator ne fonctionne plus soudainement, le navigateur ne s'ouvre pas, ou le Hook affiche des messages d'erreur. Vous ne savez pas comment consulter les journaux, ni quelle étape pose problème. Vous avez peut-être essayé de redémarrer, mais le problème persiste.

## Quand utiliser cette méthode

Le dépannage est nécessaire dans les cas suivants :

- Le navigateur ne s'ouvre pas automatiquement
- Le Hook affiche des messages d'erreur
- L'occupation d'un port empêche le démarrage
- Les pages de plan ou de revue de code s'affichent de manière anormale
- L'intégration Obsidian/Bear échoue
- Le Git diff affiche un résultat vide

---

## Approche principale

Les problèmes avec Plannotator se divisent généralement en trois catégories :

1. **Problèmes d'environnement** : occupation de port, erreur de configuration des variables d'environnement, problème de chemin du navigateur
2. **Problèmes de données** : échec de l'analyse d'événement Hook, contenu de plan vide, état anormal du dépôt Git
3. **Problèmes d'intégration** : échec de sauvegarde Obsidian/Bear, problème de connexion en mode distant

La clé du débogage est de **consulter les journaux de sortie**. Plannotator utilise `console.error` pour sortir les erreurs vers stderr, et `console.log` pour sortir les informations normales vers stdout. Distinguer ces deux flux vous aidera à localiser rapidement le type de problème.

---

## 🎒 Préparation avant de commencer

- ✅ Plannotator installé (plugin Claude Code ou OpenCode)
- ✅ Connaissance des opérations de base en ligne de commande
- ✅ Familiarité avec votre répertoire de projet et l'état de votre dépôt Git

---

## Suivez-moi

### Étape 1 : Vérifier les journaux de sortie

**Pourquoi**

Toutes les erreurs de Plannotator sont sorties vers stderr. Consulter les journaux est la première étape du diagnostic.

**Comment procéder**

#### Dans Claude Code

Lorsque le Hook déclenche Plannotator, les messages d'erreur s'affichent dans la sortie de terminal de Claude Code :

```bash
# Exemple d'erreur que vous pourriez voir
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

#### Dans OpenCode

OpenCode capture le stderr du CLI et l'affiche dans l'interface :

```
[stderr] Failed to parse hook event from stdin
[stderr] No plan content in hook event
```

**Ce que vous devriez voir** :

- S'il n'y a pas d'erreur, stderr devrait être vide ou ne contenir que les messages d'information attendus
- S'il y a une erreur, elle contiendra le type d'erreur (comme EADDRINUSE), le message d'erreur et les informations de pile (si disponibles)

---

### Étape 2 : Traiter les problèmes d'occupation de port

**Pourquoi**

Par défaut, Plannotator démarre le serveur sur un port aléatoire. Si un port fixe est occupé, le serveur essaiera 5 fois (avec un délai de 500 ms entre chaque tentative), puis signalera une erreur.

**Message d'erreur** :

```
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

**Solutions**

#### Solution A : Laisser Plannotator choisir automatiquement le port (recommandé)

Ne définissez pas la variable d'environnement `PLANNOTATOR_PORT`, Plannotator choisira automatiquement un port disponible.

#### Solution B : Utiliser un port fixe et résoudre l'occupation

Si vous devez utiliser un port fixe (par exemple en mode distant), vous devez résoudre l'occupation du port :

```bash
# macOS/Linux
lsof -ti:54321 | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 54321 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Puis redéfinissez le port :

```bash
# macOS/Linux/WSL
export PLANNOTATOR_PORT=54322

# Windows PowerShell
$env:PLANNOTATOR_PORT = "54322"
```

**Point de contrôle ✅** :

- Déclenchez à nouveau Plannotator, le navigateur devrait s'ouvrir normalement
- Si l'erreur persiste, essayez un autre numéro de port

---

### Étape 3 : Déboguer l'échec de l'analyse d'événement Hook

**Pourquoi**

L'événement Hook est des données JSON lues depuis stdin. Si l'analyse échoue, Plannotator ne peut pas continuer.

**Message d'erreur** :

```
Failed to parse hook event from stdin
No plan content in hook event
```

**Causes possibles** :

1. L'événement Hook n'est pas un JSON valide
2. L'événement Hook manque le champ `tool_input.plan`
3. La version du Hook n'est pas compatible

**Méthodes de débogage**

#### Voir le contenu de l'événement Hook

Avant le démarrage du serveur Hook, affichez le contenu de stdin :

```bash
# Modifiez temporairement hook/server/index.ts
# Ajoutez après la ligne 91 :
console.log("[DEBUG] Hook event:", eventJson);
```

**Ce que vous devriez voir** :

```json
{
  "tool_input": {
    "plan": "# Implementation Plan\n\n## Task 1\n..."
  },
  "permission_mode": "default"
}
```

**Solutions** :

- Si `tool_input.plan` est vide ou manquant, vérifiez que l'AI Agent a correctement généré le plan
- Si le format JSON est incorrect, vérifiez que la configuration du Hook est correcte
- Si la version du Hook n'est pas compatible, mettez à jour Plannotator vers la dernière version

---

### Étape 4 : Résoudre le problème de navigateur non ouvert

**Pourquoi**

Plannotator utilise la fonction `openBrowser` pour ouvrir automatiquement le navigateur. Si cela échoue, cela peut être dû à un problème de compatibilité multiplateforme ou un chemin de navigateur incorrect.

**Causes possibles** :

1. Le navigateur par défaut du système n'est pas défini
2. Le chemin du navigateur personnalisé est invalide
3. Problème de traitement spécial dans l'environnement WSL
4. En mode distant, le navigateur ne s'ouvre pas automatiquement (c'est normal)

**Méthodes de débogage**

#### Vérifier si vous êtes en mode distant

```bash
# Voir les variables d'environnement
echo $PLANNOTATOR_REMOTE

# Windows PowerShell
echo $env:PLANNOTATOR_REMOTE
```

Si la sortie est `1` ou `true`, vous êtes en mode distant, le navigateur ne s'ouvrira pas automatiquement, c'est le comportement attendu.

#### Tester manuellement l'ouverture du navigateur

```bash
# macOS
open "http://localhost:54321"

# Linux
xdg-open "http://localhost:54321"

# Windows
start http://localhost:54321
```

**Ce que vous devriez voir** :

- Si l'ouverture manuelle réussit, le serveur Plannotator fonctionne normalement, le problème se situe dans la logique d'ouverture automatique
- Si l'ouverture manuelle échoue, vérifiez que l'URL est correcte (le port peut être différent)

**Solutions** :

#### Solution A : Définir un navigateur personnalisé (macOS)

```bash
export PLANNOTATOR_BROWSER="Google Chrome"

# Ou utiliser le chemin complet
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

#### Solution B : Définir un navigateur personnalisé (Linux)

```bash
export PLANNOTATOR_BROWSER="/usr/bin/firefox"
```

#### Solution C : Ouverture manuelle en mode distant (Devcontainer/SSH)

```bash
# Plannotator affichera les informations d'URL et de port
# Copiez l'URL et ouvrez-la dans votre navigateur local
# Ou utilisez le transfert de port :
ssh -L 19432:localhost:19432 user@remote
```

---

### Étape 5 : Vérifier l'état du dépôt Git (revue de code)

**Pourquoi**

La fonctionnalité de revue de code dépend des commandes Git. Si l'état du dépôt Git est anormal (par exemple pas de commit, HEAD détaché), cela entraînera un diff vide ou une erreur.

**Message d'erreur** :

```
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Méthodes de débogage**

#### Vérifier le dépôt Git

```bash
# Vérifier si vous êtes dans un dépôt Git
git status

# Vérifier la branche actuelle
git branch

# Vérifier s'il y a des commits
git log --oneline -1
```

**Ce que vous devriez voir** :

- Si la sortie est `fatal: not a git repository`, le répertoire actuel n'est pas un dépôt Git
- Si la sortie est `HEAD detached at <commit>`, vous êtes dans un état HEAD détaché
- Si la sortie est `fatal: your current branch 'main' has no commits yet`, il n'y a encore aucun commit

**Solutions** :

#### Problème A : Pas dans un dépôt Git

```bash
# Initialiser le dépôt Git
git init
git add .
git commit -m "Initial commit"
```

#### Problème B : État HEAD détaché

```bash
# Basculer vers une branche
git checkout main
# Ou créer une nouvelle branche
git checkout -b feature-branch
```

#### Problème C : Pas de commit

```bash
# Au moins un commit est nécessaire pour voir le diff
git add .
git commit -m "Initial commit"
```

#### Problème D : Diff vide (pas de modifications)

```bash
# Créer quelques modifications
echo "test" >> test.txt
git add test.txt

# Exécuter à nouveau /plannotator-review
```

**Point de contrôle ✅** :

- Exécutez à nouveau `/plannotator-review`, le diff devrait s'afficher normalement
- S'il est toujours vide, vérifiez s'il y a des modifications non indexées ou non validées

---

### Étape 6 : Déboguer l'échec de l'intégration Obsidian/Bear

**Pourquoi**

L'échec de l'intégration Obsidian/Bear n'empêche pas l'approbation du plan, mais entraîne un échec de sauvegarde. Les erreurs sont sorties vers stderr.

**Message d'erreur** :

```
[Obsidian] Save failed: Vault not found
[Bear] Save failed: Failed to open Bear
```

**Méthodes de débogage**

#### Vérifier la configuration Obsidian

**macOS** :
```bash
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

**Windows** :
```powershell
cat $env:APPDATA\obsidian\obsidian.json
```

**Ce que vous devriez voir** :

```json
{
  "vaults": {
    "/path/to/vault": {
      "path": "/path/to/vault",
      "ts": 1234567890
    }
  }
}
```

#### Vérifier la disponibilité de Bear (macOS)

```bash
# Tester le schéma d'URL Bear
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**Ce que vous devriez voir** :

- L'application Bear s'ouvre et crée une nouvelle note
- S'il n'y a aucune réaction, Bear n'est pas correctement installé

**Solutions** :

#### Échec de sauvegarde Obsidian

- Assurez-vous qu'Obsidian est en cours d'exécution
- Vérifiez que le chemin du vault est correct
- Essayez de créer manuellement une note dans Obsidian pour vérifier les permissions

#### Échec de sauvegarde Bear

- Assurez-vous que Bear est correctement installé
- Testez si `bear://x-callback-url` est disponible
- Vérifiez si x-callback-url est activé dans les paramètres de Bear

---

### Étape 7 : Voir les journaux d'erreur détaillés (mode débogage)

**Pourquoi**

Parfois, les messages d'erreur ne sont pas assez détaillés, il faut voir la trace de pile complète et le contexte.

**Comment procéder**

#### Activer le mode débogage Bun

```bash
export DEBUG="*"
plannotator review

# Windows PowerShell
$env:DEBUG = "*"
plannotator review
```

#### Voir les journaux du serveur Plannotator

Les erreurs internes du serveur sont sorties via `console.error`. Emplacements des journaux clés :

- `packages/server/index.ts:260` - Journaux d'erreur d'intégration
- `packages/server/git.ts:141` - Journaux d'erreur Git diff
- `apps/hook/server/index.ts:100-106` - Erreurs d'analyse d'événement Hook

**Ce que vous devriez voir** :

```bash
# Sauvegarde réussie vers Obsidian
[Obsidian] Saved plan to: /path/to/vault/Plan - 2026-01-24.md

# Échec de sauvegarde
[Obsidian] Save failed: Cannot write to directory
[Bear] Save failed: Failed to open Bear

# Erreur Git diff
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Point de contrôle ✅** :

- Les journaux d'erreur contiennent suffisamment d'informations pour localiser le problème
- Appliquez la solution correspondante selon le type d'erreur

---

## Pièges à éviter

### ❌ Ignorer la sortie stderr

**Mauvaise pratique** :

```bash
# Se concentrer uniquement sur stdout, ignorer stderr
plannotator review 2>/dev/null
```

**Bonne pratique** :

```bash
# Voir stdout et stderr simultanément
plannotator review
# Ou séparer les journaux
plannotator review 2>error.log
```

### ❌ Redémarrer aveuglément le serveur

**Mauvaise pratique** :

- Redémarrer dès qu'un problème survient, sans vérifier la cause de l'erreur

**Bonne pratique** :

- D'abord consulter les journaux d'erreur pour déterminer le type de problème
- Appliquer la solution correspondante selon le type d'erreur
- Le redémarrage n'est que le dernier recours

### ❌ Attendre l'ouverture automatique du navigateur en mode distant

**Mauvaise pratique** :

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Attendre l'ouverture automatique du navigateur (ne se produira pas)
```

**Bonne pratique** :

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Notez l'URL affichée, ouvrez-la manuellement dans le navigateur
# Ou utilisez le transfert de port
```

---

## Résumé de cette leçon

- Plannotator utilise `console.error` pour sortir les erreurs vers stderr, et `console.log` pour sortir les informations normales vers stdout
- Les problèmes courants incluent : occupation de port, échec de l'analyse d'événement Hook, navigateur non ouvert, état anormal du dépôt Git, échec d'intégration
- La clé du débogage est : consulter les journaux → localiser le type de problème → appliquer la solution correspondante
- En mode distant, le navigateur ne s'ouvre pas automatiquement, il faut ouvrir l'URL manuellement ou configurer le transfert de port

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Problèmes courants](../common-problems/)**.
>
> Vous apprendrez :
> - Comment résoudre les problèmes d'installation et de configuration
> - Les erreurs d'utilisation courantes et les points d'attention
> - Suggestions d'optimisation des performances

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Mécanisme de réessai de port | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L80) | 79-80 |
| Gestion des erreurs EADDRINUSE | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L320-L334) | 320-334 |
| Analyse d'événement Hook | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L91-L107) | 91-107 |
| Ouverture du navigateur | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Gestion des erreurs Git diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L139-L144) | 139-144 |
| Journal de sauvegarde Obsidian | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L242-L246) | 242-246 |
| Journal de sauvegarde Bear | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L252-L256) | 252-256 |

**Constantes clés** :
- `MAX_RETRIES = 5` : nombre maximum de tentatives de réessai de port
- `RETRY_DELAY_MS = 500` : délai de réessai de port (millisecondes)

**Fonctions clés** :
- `startPlannotatorServer()` : démarrer le serveur de revue de plan
- `startReviewServer()` : démarrer le serveur de revue de code
- `openBrowser()` : ouverture du navigateur multiplateforme
- `runGitDiff()` : exécuter la commande Git diff
- `saveToObsidian()` : sauvegarder le plan vers Obsidian
- `saveToBear()` : sauvegarder le plan vers Bear

</details>
