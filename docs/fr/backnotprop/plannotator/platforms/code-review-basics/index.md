---
title: "Revue de code : Visualisation des Git Diff | plannotator"
sidebarTitle: "Réviser le code modifié par l'Agent"
subtitle: "Revue de code : Visualisation des Git Diff"
description: "Apprenez à utiliser la fonctionnalité de revue de code de Plannotator. Révisez les Git Diff via une interface visuelle, basculez entre les vues side-by-side et unified, ajoutez des commentaires au niveau des lignes et envoyez vos retours à l'Agent IA."
tags:
  - "Revue de code"
  - "Git Diff"
  - "Commentaires par ligne"
  - "Side-by-side"
  - "Unified"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 4
---

# Bases de la revue de code : Réviser les Git Diff avec /plannotator-review

## Ce que vous apprendrez

- ✅ Utiliser la commande `/plannotator-review` pour réviser les Git Diff
- ✅ Basculer entre les vues side-by-side et unified
- ✅ Cliquer sur les numéros de ligne pour sélectionner des plages de code et ajouter des commentaires
- ✅ Ajouter différents types de commentaires (comment/suggestion/concern)
- ✅ Changer de type de diff (uncommitted/staged/last commit/branch)
- ✅ Envoyer vos retours de revue à l'Agent IA

## Vos difficultés actuelles

**Problème 1** : Lorsque vous consultez les modifications avec `git diff`, la sortie défile dans le terminal, rendant difficile la compréhension globale des changements.

**Problème 2** : Pour donner un retour à l'Agent sur des problèmes de code, vous ne pouvez que décrire textuellement « il y a un problème à la ligne 10 » ou « modifiez cette fonction », ce qui peut créer des ambiguïtés.

**Problème 3** : Vous ne savez pas exactement quels fichiers l'Agent a modifiés, et il est difficile de se concentrer sur les parties essentielles parmi de nombreuses modifications.

**Problème 4** : Après avoir révisé le code, vous souhaitez envoyer des retours structurés à l'Agent pour qu'il effectue les corrections selon vos suggestions.

**Plannotator peut vous aider** :
- Visualiser les Git Diff avec deux modes de vue : side-by-side et unified
- Cliquer sur les numéros de ligne pour sélectionner des plages de code et marquer précisément les problèmes
- Ajouter des commentaires par ligne (comment/suggestion/concern) avec du code suggéré
- Basculer facilement entre les types de diff (uncommitted, staged, last commit, branch)
- Les commentaires sont automatiquement convertis en Markdown pour que l'Agent comprenne précisément vos retours

## Quand utiliser cette fonctionnalité

**Cas d'utilisation** :
- Après que l'Agent a terminé des modifications de code, vous devez réviser les changements
- Avant de commiter, vous souhaitez vérifier complètement vos modifications
- En collaboration d'équipe, vous avez besoin de retours structurés sur le code
- Vous voulez basculer entre différents types de diff (non commité vs stagé vs dernier commit)

**Cas non adaptés** :
- Réviser un plan d'implémentation généré par l'IA (utilisez la fonctionnalité de revue de plan)
- Utiliser directement `git diff` dans le terminal (pas besoin d'interface visuelle)

## 🎒 Préparation

**Prérequis** :
- ✅ Plannotator CLI installé (voir [Démarrage rapide](../../start/getting-started/))
- ✅ Plugin Claude Code ou OpenCode configuré (voir le guide d'installation correspondant)
- ✅ Répertoire courant dans un dépôt Git

**Comment déclencher** :
- Exécutez la commande `/plannotator-review` dans Claude Code ou OpenCode

## Concept clé

### Qu'est-ce que la revue de code

La **revue de code** est un outil de visualisation Git Diff fourni par Plannotator, permettant de consulter les modifications de code et d'ajouter des commentaires par ligne directement dans le navigateur.

::: info Pourquoi avez-vous besoin de la revue de code ?
Après que l'Agent IA a modifié le code, il affiche généralement le contenu du git diff dans le terminal. Ce format texte brut rend difficile la compréhension globale des modifications et ne permet pas de marquer précisément les problèmes. Plannotator offre une interface visuelle (side-by-side ou unified), permet d'ajouter des commentaires en cliquant sur les numéros de ligne, et envoie des retours structurés à l'Agent pour qu'il modifie le code selon vos suggestions.
:::

### Flux de travail

```
┌─────────────────┐
│  Utilisateur    │
│  (exécute cmd)  │
└────────┬────────┘
         │
         │ /plannotator-review
         ▼
┌─────────────────┐
│  CLI            │
│  (exécute git)  │
│  git diff HEAD  │
└────────┬────────┘
         │
         │ rawPatch + gitRef
         ▼
┌─────────────────┐
│ Review Server   │  ← Serveur local
│  /api/diff      │
└────────┬────────┘
         │
         │ Ouverture navigateur
         ▼
┌─────────────────┐
│ Review UI       │
│                 │
│ ┌───────────┐   │
│ │ File Tree │   │
│ │ (liste)   │   │
│ └───────────┘   │
│       │         │
│       ▼         │
│ ┌───────────┐   │
│ │ DiffViewer│   │
│ │ (compa-   │   │
│ │ raison)   │   │
│ │ split/    │   │
│ │ unified   │   │
│ └───────────┘   │
│       │         │
│       │ Clic ligne
│       ▼         │
│ ┌───────────┐   │
│ │ Annotation│   │
│ │ comment/  │   │
│ │ suggestion│   │
│ │ /concern  │   │
│ └───────────┘   │
│       │         │
│       ▼         │
│ ┌───────────┐   │
│ │ Envoi     │   │
│ │ Send      │   │
│ │ Feedback  │   │
│ │ ou LGTM   │   │
│ └───────────┘   │
└────────┬────────┘
         │
         │ Feedback Markdown
         ▼
┌─────────────────┐
│  Agent IA       │
│  (applique les  │
│   corrections)  │
└─────────────────┘
```

### Modes de vue

| Mode de vue | Description | Cas d'utilisation |
| --- | --- | --- |
| **Split (Side-by-side)** | Écran divisé, ancien code à gauche, nouveau à droite | Comparer de grandes modifications, voir clairement avant/après |
| **Unified** | Fusionné verticalement, suppressions et ajouts dans la même colonne | Voir de petites modifications, économiser l'espace vertical |

### Types de commentaires

Plannotator prend en charge trois types de commentaires de code :

| Type | Usage | Apparence UI |
| --- | --- | --- |
| **Comment** | Commenter une ligne de code, poser une question ou expliquer | Bordure violette/bleue |
| **Suggestion** | Fournir une suggestion concrète de modification | Bordure verte, avec bloc de code suggéré |
| **Concern** | Marquer un problème potentiel nécessitant attention | Bordure jaune/orange |

::: tip Différence entre les types de commentaires
- **Comment** : Pour poser des questions, expliquer, donner un retour général
- **Suggestion** : Pour proposer une modification concrète du code (avec code suggéré)
- **Concern** : Pour signaler un problème à corriger ou un risque potentiel
:::

### Types de Diff

| Type de Diff | Commande Git | Description |
| --- | --- | --- |
| **Uncommitted** | `git diff HEAD` | Modifications non commitées (par défaut) |
| **Staged** | `git diff --staged` | Modifications stagées |
| **Unstaged** | `git diff` | Modifications non stagées |
| **Last commit** | `git diff HEAD~1..HEAD` | Contenu du dernier commit |
| **Branch** | `git diff main..HEAD` | Comparaison entre la branche courante et la branche par défaut |

## Suivez le guide

### Étape 1 : Déclencher la revue de code

Exécutez la commande `/plannotator-review` dans Claude Code ou OpenCode :

```
Utilisateur : /plannotator-review

CLI : Exécution de git diff...
      Navigateur ouvert
```

**Vous devriez voir** :
1. Le navigateur ouvre automatiquement l'interface de revue de code Plannotator
2. À gauche, la liste des fichiers (File Tree)
3. À droite, le Diff Viewer (vue split par défaut)
4. En haut, les boutons de changement de vue (Split/Unified)
5. En bas, les boutons "Send Feedback" et "LGTM"

### Étape 2 : Parcourir la liste des fichiers

Consultez les fichiers modifiés dans le File Tree à gauche :

- Les fichiers sont groupés par chemin
- Chaque fichier affiche les statistiques de modification (additions/deletions)
- Cliquez sur un fichier pour voir son diff

**Vous devriez voir** :
```
src/
  auth/
    login.ts          (+12, -5)  ← Cliquez pour voir le diff de ce fichier
    user.ts          (+8, -2)
  api/
    routes.ts        (+25, -10)
```

### Étape 3 : Changer de mode de vue

Cliquez sur les boutons "Split" ou "Unified" en haut de la page pour changer de vue :

**Vue Split** (Side-by-side) :
- Ancien code à gauche (fond gris, lignes supprimées en rouge)
- Nouveau code à droite (fond blanc, lignes ajoutées en vert)
- Idéal pour comparer de grandes modifications

**Vue Unified** (fusionnée) :
- Ancien et nouveau code dans la même colonne
- Lignes supprimées sur fond rouge, lignes ajoutées sur fond vert
- Idéal pour voir de petites modifications

**Vous devriez voir** :
- Vue Split : écran divisé, comparaison claire avant/après
- Vue Unified : fusionné verticalement, économie d'espace

### Étape 4 : Sélectionner des lignes de code et ajouter des commentaires

**Ajouter un commentaire Comment** :

1. Survolez une ligne de code, un bouton `+` apparaît à côté du numéro de ligne
2. Cliquez sur le bouton `+`, ou cliquez directement sur le numéro de ligne pour sélectionner cette ligne
3. Sélection multiple : cliquez sur le numéro de la première ligne, maintenez Shift et cliquez sur le numéro de la dernière ligne
4. Saisissez votre commentaire dans la barre d'outils qui apparaît
5. Cliquez sur le bouton "Add Comment"

**Ajouter un commentaire Suggestion (avec code suggéré)** :

1. Suivez les étapes ci-dessus pour ajouter un commentaire
2. Cliquez sur le bouton "Add suggested code" dans la barre d'outils
3. Saisissez le code suggéré dans la zone de code qui apparaît
4. Cliquez sur le bouton "Add Comment"

**Vous devriez voir** :
- Le commentaire s'affiche sous la ligne de code
- Commentaire Comment : bordure violette/bleue, affiche le contenu du commentaire
- Commentaire Suggestion : bordure verte, affiche le commentaire et le bloc de code suggéré
- La barre latérale droite affiche la liste de tous les commentaires

### Étape 5 : Changer de type de Diff

Sélectionnez un type de diff différent en haut de la page :

- **Uncommitted changes** (par défaut) : modifications non commitées
- **Staged changes** : modifications stagées
- **Last commit** : contenu du dernier commit
- **vs main** (si pas sur la branche par défaut) : comparaison avec la branche par défaut

**Vous devriez voir** :
- Le Diff Viewer se met à jour avec le nouveau contenu diff sélectionné
- La liste des fichiers se rafraîchit avec les nouvelles statistiques de modification

### Étape 6 : Envoyer les retours à l'Agent

**Send Feedback (Envoyer les retours)** :

1. Ajoutez les commentaires nécessaires (Comment/Suggestion/Concern)
2. Cliquez sur le bouton "Send Feedback" en bas de la page
3. S'il n'y a pas de commentaires, une boîte de dialogue de confirmation apparaît pour demander si vous souhaitez continuer

**LGTM (Looks Good To Me)** :

Si le code n'a pas de problème, cliquez sur le bouton "LGTM".

**Vous devriez voir** :
- Le navigateur se ferme automatiquement (délai de 1,5 seconde)
- Le terminal affiche le contenu des retours ou "LGTM - no changes requested."
- L'Agent reçoit les retours et commence à modifier le code

### Étape 7 : Consulter le contenu des retours (optionnel)

Si vous souhaitez voir le contenu des retours envoyés par Plannotator à l'Agent, vous pouvez le consulter dans le terminal :

```
# Code Review Feedback

## src/auth/login.ts

### Line 15 (new)
Il faut ajouter une logique de gestion des erreurs ici.

### Line 20-25 (old)
**Suggested code:**
```typescript
try {
  await authenticate(req);
} catch (error) {
  return res.status(401).json({ error: 'Authentication failed' });
}
```

## src/api/routes.ts

### Line 10 (new)
Cette fonction manque de validation des entrées.
```

**Vous devriez voir** :
- Les retours sont groupés par fichier
- Chaque commentaire affiche le chemin du fichier, le numéro de ligne et le type
- Les commentaires Suggestion incluent un bloc de code suggéré

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez être capable de :

- [ ] Exécuter la commande `/plannotator-review`, le navigateur ouvre automatiquement l'interface de revue de code
- [ ] Consulter la liste des fichiers modifiés dans le File Tree
- [ ] Basculer entre les vues Split et Unified
- [ ] Cliquer sur les numéros de ligne ou le bouton `+` pour sélectionner des lignes de code
- [ ] Ajouter des commentaires Comment, Suggestion et Concern
- [ ] Ajouter du code suggéré dans les commentaires
- [ ] Changer de type de diff (uncommitted/staged/last commit/branch)
- [ ] Cliquer sur Send Feedback, le navigateur se ferme, le terminal affiche le contenu des retours
- [ ] Cliquer sur LGTM, le navigateur se ferme, le terminal affiche "LGTM - no changes requested."

**Si une étape échoue**, consultez :
- [Problèmes courants](../../faq/common-problems/)
- [Guide d'installation Claude Code](../../start/installation-claude-code/)
- [Guide d'installation OpenCode](../../start/installation-opencode/)

## Pièges à éviter

**Erreur courante 1** : Après avoir exécuté `/plannotator-review`, le navigateur ne s'ouvre pas

**Cause** : Le port peut être occupé ou le serveur n'a pas réussi à démarrer.

**Solution** :
- Vérifiez s'il y a des messages d'erreur dans le terminal
- Essayez d'ouvrir manuellement l'URL affichée dans le navigateur
- Si le problème persiste, consultez [Dépannage](../../faq/troubleshooting/)

**Erreur courante 2** : Après avoir cliqué sur un numéro de ligne, la barre d'outils n'apparaît pas

**Cause** : Vous avez peut-être sélectionné une ligne vide, ou la fenêtre du navigateur est trop petite.

**Solution** :
- Essayez de sélectionner une ligne contenant du code
- Agrandissez la fenêtre du navigateur
- Assurez-vous que JavaScript n'est pas désactivé

**Erreur courante 3** : Après avoir ajouté un commentaire, il ne s'affiche pas sous le code

**Cause** : Vous avez peut-être sélectionné une ligne vide, ou la fenêtre du navigateur est trop petite.

**Solution** :
- Essayez de sélectionner une ligne contenant du code
- Agrandissez la fenêtre du navigateur
- Assurez-vous que JavaScript n'est pas désactivé
- Vérifiez si la liste des commentaires s'affiche dans la barre latérale droite

**Erreur courante 4** : Après avoir cliqué sur Send Feedback, le terminal n'affiche pas le contenu des retours

**Cause** : Problème réseau ou erreur serveur possible.

**Solution** :
- Vérifiez s'il y a des messages d'erreur dans le terminal
- Essayez de renvoyer les retours
- Si le problème persiste, consultez [Dépannage](../../faq/troubleshooting/)

**Erreur courante 5** : L'Agent ne modifie pas le code selon les suggestions après avoir reçu les retours

**Cause** : L'Agent n'a peut-être pas correctement compris l'intention du commentaire.

**Solution** :
- Essayez d'utiliser des commentaires plus explicites (Suggestion est plus clair que Comment)
- Utilisez Comment pour ajouter des explications détaillées
- Fournissez du code suggéré complet dans Suggestion
- Si le problème persiste, vous pouvez relancer `/plannotator-review` pour réviser les nouvelles modifications

**Erreur courante 6** : Après avoir changé de type de diff, la liste des fichiers est vide

**Cause** : Le type de diff sélectionné n'a peut-être pas de modifications.

**Solution** :
- Essayez de revenir à "Uncommitted changes"
- Vérifiez le statut git pour confirmer s'il y a des modifications
- Utilisez `git status` pour voir l'état actuel

## Résumé de la leçon

La revue de code est un outil de visualisation Git Diff fourni par Plannotator :

**Opérations principales** :
1. **Déclencher** : Exécutez `/plannotator-review`, le navigateur ouvre automatiquement l'UI
2. **Parcourir** : Consultez la liste des fichiers modifiés dans le File Tree
3. **Vue** : Basculez entre les vues Split (side-by-side) et Unified
4. **Commenter** : Cliquez sur les numéros de ligne pour sélectionner du code, ajoutez des commentaires Comment/Suggestion/Concern
5. **Changer** : Sélectionnez différents types de diff (uncommitted/staged/last commit/branch)
6. **Retours** : Cliquez sur Send Feedback ou LGTM, les retours sont envoyés à l'Agent

**Modes de vue** :
- **Split (Side-by-side)** : Écran divisé, ancien code à gauche, nouveau à droite
- **Unified** : Fusionné verticalement, suppressions et ajouts dans la même colonne

**Types de commentaires** :
- **Comment** : Commenter une ligne de code, poser une question ou expliquer
- **Suggestion** : Fournir une suggestion concrète de modification (avec code suggéré)
- **Concern** : Marquer un problème potentiel nécessitant attention

**Types de Diff** :
- **Uncommitted** : Modifications non commitées (par défaut)
- **Staged** : Modifications stagées
- **Unstaged** : Modifications non stagées
- **Last commit** : Contenu du dernier commit
- **Branch** : Comparaison entre la branche courante et la branche par défaut

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Ajouter des commentaires de code](../code-review-annotations/)**.
>
> Vous apprendrez :
> - Comment utiliser précisément les commentaires Comment, Suggestion et Concern
> - Comment ajouter du code suggéré et le formater
> - Comment modifier et supprimer des commentaires
> - Les bonnes pratiques et cas d'utilisation courants des commentaires
> - Comment sélectionner le côté old/new dans la vue side-by-side

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Serveur de revue de code | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L302) | 1-302 |
| UI de revue de code | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L150) | 1-150 |
| Composant DiffViewer | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| Utilitaires Git | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L148) | 1-148 |
| Point d'entrée Hook (review) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84) | 46-84 |
| Définition des types de commentaires | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L83) | 53-83 |

**Types clés** :
- `CodeAnnotationType` : Énumération des types de commentaires de code (comment, suggestion, concern) (`packages/ui/types.ts:53`)
- `CodeAnnotation` : Interface de commentaire de code (`packages/ui/types.ts:55-66`)
- `DiffType` : Énumération des types de Diff (uncommitted, staged, unstaged, last-commit, branch) (`packages/server/git.ts:10-15`)
- `GitContext` : Interface de contexte Git (`packages/server/git.ts:22-26`)

**Fonctions clés** :
- `startReviewServer()` : Démarre le serveur de revue de code (`packages/server/review.ts:79`)
- `runGitDiff()` : Exécute la commande git diff (`packages/server/git.ts:101`)
- `getGitContext()` : Obtient le contexte Git (informations de branche et options diff) (`packages/server/git.ts:79`)
- `parseDiffToFiles()` : Parse le diff en liste de fichiers (`packages/review-editor/App.tsx:48`)
- `exportReviewFeedback()` : Exporte les commentaires en retours Markdown (`packages/review-editor/App.tsx:86`)

**Routes API** :
- `GET /api/diff` : Obtient le contenu du diff (`packages/server/review.ts:118`)
- `POST /api/diff/switch` : Change de type de diff (`packages/server/review.ts:130`)
- `POST /api/feedback` : Soumet les retours de revue (`packages/server/review.ts:222`)
- `GET /api/image` : Obtient une image (`packages/server/review.ts:164`)
- `POST /api/upload` : Télécharge une image (`packages/server/review.ts:181`)
- `GET /api/agents` : Obtient les agents disponibles (OpenCode) (`packages/server/review.ts:204`)

**Règles métier** :
- Par défaut, affiche le diff non commité (`apps/hook/server/index.ts:55`)
- Prend en charge le basculement vers le diff vs main (`packages/server/git.ts:131`)
- Les retours sont formatés en Markdown (`packages/review-editor/App.tsx:86`)
- Lors de l'approbation, envoie le texte "LGTM" (`packages/review-editor/App.tsx:430`)

</details>
