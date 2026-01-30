---
title: "Démarrage rapide : Maîtrisez Plannotator en 5 minutes"
sidebarTitle: "Démarrage en 5 min"
subtitle: "Démarrage rapide : Maîtrisez Plannotator en 5 minutes"
description: "Apprenez à installer et configurer Plannotator. Installez le CLI en 5 minutes, configurez le plugin Claude Code ou OpenCode, et maîtrisez la revue de plans et de code."
tags:
  - "Démarrage rapide"
  - "Introduction"
  - "Installation"
  - "Claude Code"
  - "OpenCode"
order: 1
---

# Démarrage rapide : Maîtrisez Plannotator en 5 minutes

## Ce que vous apprendrez

- ✅ Comprendre les fonctionnalités principales et les cas d'usage de Plannotator
- ✅ Installer Plannotator en 5 minutes
- ✅ Configurer l'intégration avec Claude Code ou OpenCode
- ✅ Effectuer votre première revue de plan et de code

## Les problèmes que vous rencontrez

**Plannotator** est un outil de revue interactif conçu pour Claude Code et OpenCode, qui résout les problèmes suivants :

**Problème 1** : Les plans d'implémentation générés par l'IA sont difficiles à lire dans le terminal — trop de texte, structure peu claire, revue fatigante.

**Problème 2** : Pour donner un retour à l'IA, vous devez décrire textuellement « supprimer le 3e paragraphe », « modifier cette fonction » — coût de communication élevé.

**Problème 3** : Lors de la revue de code, vous devez jongler entre plusieurs terminaux ou IDE, difficile de rester concentré.

**Problème 4** : Les membres de l'équipe veulent participer à la revue, mais ne savent pas comment partager le contenu du plan.

**Plannotator vous aide à** :
- Remplacer la lecture en terminal par une interface visuelle claire et structurée
- Sélectionner du texte pour ajouter des annotations (supprimer, remplacer, commenter) — retour précis
- Revue visuelle des diff Git avec annotations ligne par ligne
- Partage par URL, collaboration d'équipe sans backend

## Quand utiliser cet outil

**Cas d'usage** :
- Développement assisté par IA avec Claude Code ou OpenCode
- Revue des plans d'implémentation générés par l'IA
- Examen des modifications de code
- Partage des résultats de revue de plan ou de code avec l'équipe

**Cas non adaptés** :
- Code écrit entièrement à la main (sans plans générés par l'IA)
- Processus de revue de code déjà en place (comme les PR GitHub)
- Pas besoin d'outil de revue visuelle

## Concept principal

### Qu'est-ce que Plannotator

**Plannotator** est un outil de revue interactif conçu pour les AI Coding Agents (Claude Code, OpenCode), offrant deux fonctionnalités principales :

1. **Revue de plan** : Revue visuelle des plans d'implémentation générés par l'IA, avec support des annotations, approbation ou rejet
2. **Revue de code** : Revue visuelle des diff Git, avec annotations ligne par ligne et plusieurs modes d'affichage

### Fonctionnement

```
┌─────────────────┐
│  AI Agent      │
│  (génère plan) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Plannotator   │  ← Serveur HTTP local
│  (interface)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Navigateur    │
│  (revue user)  │
└─────────────────┘
```

**Flux principal** :
1. L'AI Agent termine un plan ou des modifications de code
2. Plannotator démarre un serveur HTTP local et ouvre le navigateur
3. L'utilisateur consulte le plan/code dans le navigateur et ajoute des annotations
4. L'utilisateur approuve ou rejette, Plannotator renvoie la décision à l'AI Agent
5. L'AI Agent continue l'implémentation ou modifie selon le retour

### Sécurité

**Toutes les données sont traitées localement**, rien n'est envoyé dans le cloud :
- Le contenu du plan, les diff de code et les annotations sont stockés sur votre machine locale
- Le serveur HTTP local utilise un port aléatoire (ou fixe)
- Le partage par URL fonctionne en compressant les données dans le hash de l'URL, sans backend

## 🎒 Prérequis

**Configuration requise** :
- Système d'exploitation : macOS / Linux / Windows / WSL
- Runtime : Bun (le script d'installation s'en charge automatiquement)
- Environnement IA : Claude Code 2.1.7+ ou OpenCode

**Choix du mode d'installation** :
- Si vous utilisez Claude Code : installez CLI + plugin
- Si vous utilisez OpenCode : configurez le plugin
- Pour la revue de code uniquement : installez seulement le CLI

## Suivez le guide

### Étape 1 : Installer le CLI Plannotator

**macOS / Linux / WSL** :

```bash
curl -fsSL https://plannotator.ai/install.sh | bash
```

**Windows PowerShell** :

```powershell
irm https://plannotator.ai/install.ps1 | iex
```

**Windows CMD** :

```cmd
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**Résultat attendu** : Le script d'installation télécharge automatiquement le CLI Plannotator, l'ajoute au PATH système et affiche le numéro de version (ex : "plannotator v0.6.7 installed to ...").

::: tip Que fait le script d'installation ?
Le script d'installation :
1. Télécharge la dernière version du CLI Plannotator
2. L'ajoute au PATH système
3. Nettoie les anciennes versions éventuelles
4. Installe automatiquement la commande `/plannotator-review` (pour la revue de code)
:::

### Étape 2 : Configurer Claude Code (optionnel)

Si vous utilisez Claude Code, vous devez installer le plugin.

**Exécutez dans Claude Code** :

```
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**Important** : Après l'installation du plugin, **vous devez redémarrer Claude Code** pour que le hook prenne effet.

**Résultat attendu** : Après une installation réussie, `plannotator` apparaît dans la liste des plugins de Claude Code.

::: info Configuration manuelle (optionnel)
Si vous ne souhaitez pas utiliser le système de plugins, vous pouvez configurer le hook manuellement. Voir la section [Installation du plugin Claude Code](../installation-claude-code/).
:::

### Étape 3 : Configurer OpenCode (optionnel)

Si vous utilisez OpenCode, vous devez modifier le fichier `opencode.json`.

**Modifiez `opencode.json`** :

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**Redémarrez OpenCode**.

**Résultat attendu** : Après le redémarrage, OpenCode charge automatiquement le plugin et l'outil `submit_plan` devient disponible.

### Étape 4 : Première revue de plan (exemple Claude Code)

**Condition de déclenchement** : Demandez à Claude Code de générer un plan d'implémentation et d'appeler `ExitPlanMode`.

**Exemple de conversation** :

```
Utilisateur : Crée-moi un plan d'implémentation pour un module d'authentification utilisateur

Claude : D'accord, voici le plan d'implémentation :
1. Créer le modèle utilisateur
2. Implémenter l'API d'inscription
3. Implémenter l'API de connexion
...
(appelle ExitPlanMode)
```

**Résultat attendu** :
1. Le navigateur ouvre automatiquement l'interface Plannotator
2. Affiche le contenu du plan généré par l'IA
3. Vous pouvez sélectionner du texte du plan et ajouter des annotations (supprimer, remplacer, commenter)
4. En bas, les boutons "Approve" et "Request Changes"

**Actions** :
1. Consultez le plan dans le navigateur
2. Si le plan est correct, cliquez sur **Approve** → L'IA continue l'implémentation
3. Si des modifications sont nécessaires, sélectionnez le texte à modifier, cliquez sur **Delete**, **Replace** ou **Comment** → Cliquez sur **Request Changes**

**Résultat attendu** : Après le clic, le navigateur se ferme automatiquement, Claude Code reçoit votre décision et continue l'exécution.

### Étape 5 : Première revue de code

**Exécutez dans le répertoire du projet** :

```bash
/plannotator-review
```

**Résultat attendu** :
1. Le navigateur ouvre la page de revue de code
2. Affiche le diff Git (par défaut, les modifications non commitées)
3. À gauche l'arborescence des fichiers, à droite le visualiseur de diff
4. Cliquez sur les numéros de ligne pour sélectionner une plage de code et ajouter des annotations

**Actions** :
1. Parcourez les modifications de code dans le visualiseur de diff
2. Cliquez sur les numéros de ligne pour sélectionner le code à réviser
3. Ajoutez des annotations dans le panneau de droite (comment/suggestion/concern)
4. Cliquez sur **Send Feedback** pour envoyer à l'agent, ou cliquez sur **LGTM** pour approuver

**Résultat attendu** : Après avoir cliqué sur Send Feedback, le navigateur se ferme, le terminal affiche le retour formaté, et l'agent le traite automatiquement.

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez pouvoir :

- [ ] Le script d'installation affiche "plannotator vX.X.X installed to ..."
- [ ] Déclencher la revue de plan dans Claude Code, le navigateur ouvre automatiquement l'interface
- [ ] Sélectionner du texte du plan dans l'interface et ajouter des annotations
- [ ] Cliquer sur Approve ou Request Changes et voir le navigateur se fermer
- [ ] Exécuter `/plannotator-review` et voir l'interface de revue de code
- [ ] Ajouter des annotations ligne par ligne dans la revue de code et cliquer sur Send Feedback

**Si une étape échoue**, consultez :
- [Guide d'installation Claude Code](../installation-claude-code/)
- [Guide d'installation OpenCode](../installation-opencode/)
- [Questions fréquentes](../../faq/common-problems/)

## Pièges à éviter

**Erreur courante 1** : Après l'installation, `plannotator` affiche "command not found"

**Cause** : La variable d'environnement PATH n'est pas mise à jour, ou le terminal doit être redémarré.

**Solution** :
- macOS/Linux : Exécutez `source ~/.zshrc` ou `source ~/.bashrc`, ou redémarrez le terminal
- Windows : Redémarrez PowerShell ou CMD

**Erreur courante 2** : Après l'installation du plugin Claude Code, la revue de plan ne se déclenche pas

**Cause** : Claude Code n'a pas été redémarré, le hook n'est pas actif.

**Solution** : Quittez complètement Claude Code (pas seulement fermer la fenêtre), puis rouvrez-le.

**Erreur courante 3** : Le navigateur ne s'ouvre pas automatiquement

**Cause** : Peut-être en mode distant (devcontainer, SSH), ou le port est occupé.

**Solution** :
- Vérifiez si la variable d'environnement `PLANNOTATOR_REMOTE=1` est définie
- Consultez l'URL affichée dans le terminal et ouvrez-la manuellement dans le navigateur
- Voir [Mode distant/Devcontainer](../../advanced/remote-mode/)

**Erreur courante 4** : La revue de code affiche "No changes"

**Cause** : Aucune modification git non commitée actuellement.

**Solution** :
- Exécutez d'abord `git status` pour confirmer qu'il y a des modifications
- Ou exécutez `git add` pour indexer quelques fichiers
- Ou passez à un autre type de diff (comme last commit)

## Résumé

Plannotator est un outil de revue local qui améliore l'efficacité de la revue de plans et de code grâce à une interface visuelle :

**Fonctionnalités principales** :
- **Revue de plan** : Revue visuelle des plans générés par l'IA avec annotations précises
- **Revue de code** : Revue visuelle des diff Git avec annotations ligne par ligne
- **Partage par URL** : Partage du contenu de revue sans backend
- **Intégrations tierces** : Sauvegarde automatique des plans approuvés vers Obsidian/Bear

**Avantages clés** :
- Exécution locale, données sécurisées
- Interface visuelle, efficacité accrue
- Retour précis, coût de communication réduit
- Collaboration d'équipe, sans système de comptes

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Installation du plugin Claude Code](../installation-claude-code/)**.
>
> Vous apprendrez :
> - Les étapes détaillées d'installation du plugin Claude Code
> - Comment configurer manuellement le hook
> - Comment vérifier que l'installation a réussi
> - Les solutions aux problèmes d'installation courants

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Point d'entrée CLI (revue de plan) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L1-L50) | 1-50 |
| Point d'entrée CLI (revue de code) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84) | 46-84 |
| Serveur de revue de plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L1-L200) | 1-200 |
| Serveur de revue de code | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L150) | 1-150 |
| Utilitaires Git | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L100) | 1-100 |
| Interface de revue de plan | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| Interface de revue de code | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L200) | 1-200 |

**Constantes clés** :
- `MAX_RETRIES = 5` : Nombre de tentatives de port (`packages/server/index.ts:80`)
- `RETRY_DELAY_MS = 500` : Délai entre les tentatives (`packages/server/index.ts:80`)

**Fonctions clés** :
- `startPlannotatorServer()` : Démarre le serveur de revue de plan (`packages/server/index.ts`)
- `startReviewServer()` : Démarre le serveur de revue de code (`packages/server/review.ts`)
- `runGitDiff()` : Exécute la commande git diff (`packages/server/git.ts`)

**Variables d'environnement** :
- `PLANNOTATOR_REMOTE` : Indicateur de mode distant (`apps/hook/server/index.ts:17`)
- `PLANNOTATOR_PORT` : Port fixe (`apps/hook/server/index.ts:18`)
- `PLANNOTATOR_BROWSER` : Navigateur personnalisé (`apps/hook/README.md:79`)
- `PLANNOTATOR_SHARE` : Activation du partage par URL (`apps/hook/server/index.ts:44`)

</details>
