---
title: "Annotations de code : Commentaires au niveau des lignes | Plannotator"
subtitle: "Annotations de code : Commentaires au niveau des lignes"
sidebarTitle: "Ajouter des annotations en 5 min"
description: "Apprenez la fonctionnalité d'annotations de code de Plannotator. Ajoutez des commentaires au niveau des lignes (comment/suggestion/concern) dans les diffs, joignez du code suggéré, marquez les points de risque, gérez toutes les annotations et exportez les retours."
tags:
  - "Révision de code"
  - "Annotation"
  - "diff"
  - "commentaire"
  - "suggestion"
  - "problème"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
  - "platforms-code-review-basics"
order: 5
---

# Ajouter des annotations de code : Commentaires, suggestions et points d'attention au niveau des lignes

## Ce que vous saurez faire

- ✅ Ajouter des commentaires au niveau des lignes (comment/suggestion/concern) dans les diffs de code
- ✅ Fournir du code suggéré pour les modifications de code (suggestedCode)
- ✅ Marquer les segments de code nécessitant une attention (concern)
- ✅ Afficher et gérer toutes les annotations (barre latérale)
- ✅ Comprendre les scénarios d'utilisation des trois types d'annotations
- ✅ Exporter les retours au format Markdown

## Vos difficultés actuelles

**Problème 1** : Lors de la révision des modifications de code, vous ne pouvez voir le diff que dans le terminal, puis écrire "la ligne 3 a un problème", "suggérer de changer en XXX", sans précision de position.

**Problème 2** : Certains codes ne nécessitent qu'un commentaire (comment), d'autres une suggestion de modification (suggestion), et d'autres sont des problèmes graves nécessitant une attention (concern), mais aucun outil ne vous aide à les distinguer.

**Problème 3** : Vous voulez suggérer une modification pour une fonction, mais vous ne savez pas comment transmettre le segment de code à l'IA.

**Problème 4** : Après avoir ajouté plusieurs annotations, vous oubliez quelles parties ont été révisées, sans vue d'ensemble.

**Plannotator peut vous aider** :
- Cliquez sur les numéros de ligne pour sélectionner la plage de code, avec une précision au niveau de la ligne
- Trois types d'annotations (comment/suggestion/concern) correspondent à différents scénarios
- Vous pouvez joindre du code suggéré, l'IA voit directement la solution de modification
- La barre latérale répertorie toutes les annotations, avec navigation en un clic

## Quand utiliser cette fonctionnalité

**Scénarios d'utilisation** :
- Après avoir exécuté la commande `/plannotator-review`, afficher les modifications de code
- Besoin de donner des retours sur des lignes de code spécifiques
- Vouloir fournir des suggestions de modification de code à l'IA
- Besoin de marquer des problèmes potentiels ou des points de risque

**Scénarios non applicables** :
- Révision des plans de mise en œuvre générés par l'IA (utiliser la fonction de révision de plan)
- Besoin de parcourir rapidement le diff (utiliser la fonction de révision de code de base)

## 🎒 Préparatifs

**Prérequis** :
- ✅ CLI Plannotator installée (voir [Démarrage rapide](../../start/getting-started/))
- ✅ Les bases de la révision de code maîtrisées (voir [Bases de la révision de code](../code-review-basics/))
- ✅ Dépôt Git local avec modifications non validées

**Déclencheur** :
- Exécuter la commande `/plannotator-review` dans OpenCode ou Claude Code

## Concept clé

### Que sont les annotations de code

**Les annotations de code** sont la fonctionnalité principale de révision de code de Plannotator, utilisée pour ajouter des retours au niveau des lignes dans les diffs Git. En cliquant sur les numéros de ligne pour sélectionner une plage de code, vous pouvez ajouter des commentaires, des suggestions ou des points d'attention de manière précise sur des lignes de code spécifiques. Les annotations s'affichent sous le diff, facilitant la compréhension par l'IA de vos intentions de retour.

::: info Pourquoi avons-nous besoin d'annotations de code ?
Dans la révision de code, vous devez donner des retours sur des lignes de code spécifiques. Si vous utilisez simplement une description textuelle "la ligne 5 a un problème", "suggérer de changer en XXX", l'IA doit elle-même localiser le code, ce qui peut entraîner des erreurs. Plannotator vous permet de cliquer sur les numéros de ligne pour sélectionner une plage de code et d'ajouter directement des annotations à cette position. Les annotations s'affichent sous le diff (style GitHub), permettant à l'IA de voir précisément quel segment de code vous avez commenté.
:::

### Flux de travail

```
┌─────────────────┐
│  /plannotator-   │  Déclencher la commande
│  review          │
└────────┬────────┘
          │
          │ Exécuter git diff
          ▼
┌─────────────────┐
│  Diff Viewer    │  ← Afficher le diff de code
│  (split/unified) │
└────────┬────────┘
          │
          │ Cliquer sur numéro de ligne / Hover +
          ▼
┌─────────────────┐
│  Sélectionner    │
│  la plage de    │
│  code (lineStart-│
│   lineEnd)      │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Ajouter une    │  ← Barre d'outils contextuelle
│  annotation     │     Remplir le contenu du commentaire
│  - Comment      │     Optionnel : fournir code suggéré
│  - Suggestion   │
│  - Concern      │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Annotation     │  Sous le diff
│  affichée       │  Barre latérale répertorie toutes les annotations
│  (style GitHub) │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Exporter les  │  Send Feedback
│  retours        │  L'IA reçoit des retours structurés
│  (Markdown)     │
└─────────────────┘
```

### Types d'annotations

Plannotator prend en charge trois types d'annotations de code, chacun ayant une utilisation différente :

| Type d'annotation | Utilisation | Scénario typique | Code suggéré |
|--- | --- | --- | ---|
| **Comment** | Commenter un segment de code, fournir des retours généraux | "Cette logique peut être simplifiée", "Le nom de la variable n'est pas très clair" | Optionnel |
| **Suggestion** | Fournir une suggestion de modification de code spécifique | "Suggérer d'utiliser map à la place de la boucle for", "Utiliser await au lieu de Promise.then" | Recommandé |
| **Concern** | Marquer les problèmes potentiels ou points de risque | "Cette requête SQL peut avoir des problèmes de performance", "Gestion des erreurs manquante" | Optionnel |

::: tip Recommandations pour le choix du type d'annotation
- **Comment** : Pour "suggérer sans forcer", par exemple le style de code, la direction d'optimisation
- **Suggestion** : Pour "suggérer fortement une modification", et vous avez une solution de modification claire
- **Concern** : Pour "problèmes à surveiller absolument", par exemple les bugs, les risques de performance, les problèmes de sécurité
:::

### Comment vs Suggestion vs Concern

| Scénario | Type à choisir | Exemple de texte |
|--- | --- | ---|
| Le code fonctionne, mais peut être optimisé | Comment | "Ceci peut être simplifié avec async/await" |
| Le code a une solution d'amélioration claire | Suggestion | "Suggérer d'utiliser `Array.from()` au lieu de l'opérateur de décomposition" (avec code) |
| Un bug ou problème grave découvert | Concern | "Il manque une vérification null ici, cela peut entraîner une erreur d'exécution" |

## Suivez-moi

### Étape 1 : Déclencher la révision de code

Exécutez dans le terminal :

```bash
/plannotator-review
```

**Ce que vous devriez voir** :
1. Le navigateur s'ouvre automatiquement sur l'interface de révision de code
2. Affichage du contenu du diff git (par défaut `git diff HEAD`)
3. À gauche : arborescence des fichiers, au centre : diff viewer, à droite : barre latérale des annotations

### Étape 2 : Parcourir le contenu du diff

Afficher les modifications de code dans le navigateur :

- Par défaut, utilisez la **vue split** (comparaison gauche-droite)
- Vous pouvez basculer vers la **vue unified** (comparaison haut-bas)
- Cliquez sur le nom du fichier dans l'arborescence pour changer le fichier affiché

### Étape 3 : Sélectionner les lignes de code et ajouter une annotation

**Méthode 1 : Hover et cliquer sur le bouton "+"**

1. Survolez la ligne de code où vous souhaitez ajouter une annotation
2. Un bouton **+** apparaît à droite (uniquement sur les lignes diff)
3. Cliquez sur le bouton **+**
4. Une barre d'outils d'annotation apparaît

**Méthode 2 : Cliquer directement sur les numéros de ligne**

1. Cliquez sur un numéro de ligne (par exemple `L10`) pour sélectionner une seule ligne
2. Cliquez sur un autre numéro de ligne (par exemple `L15`) pour sélectionner une plage de plusieurs lignes
3. Après sélection, la barre d'outils apparaît automatiquement

**Ce que vous devriez voir** :
- La barre d'outils affiche le numéro de ligne sélectionné (par exemple `Line 10` ou `Lines 10-15`)
- La barre d'outils contient une zone de saisie de texte (`Leave feedback...`)
- Un bouton optionnel "Add suggested code"

### Étape 4 : Ajouter une annotation Comment

**Scénario** : Fournir des suggestions sur le code, sans exiger de modifications obligatoires

1. Entrez le contenu du commentaire dans la zone de texte de la barre d'outils
2. Optionnel : Cliquez sur **Add suggested code** et entrez le code suggéré
3. Cliquez sur le bouton **Add Comment**

**Exemple** :

```
Contenu du commentaire : Le nom du paramètre de cette fonction n'est pas très clair, suggérer de le renommer en fetchUserData
```

**Ce que vous devriez voir** :
- La barre d'outils disparaît
- L'annotation s'affiche sous le diff (cadre bleu)
- Une nouvelle entrée d'annotation apparaît dans la barre latérale
- Si du code suggéré a été fourni, il s'affiche sous l'annotation (format bloc de code)

### Étape 5 : Ajouter une annotation Suggestion

**Scénario** : Fournir une solution de modification de code claire, souhaitant que l'IA l'adopte directement

1. Entrez la description de la suggestion dans la zone de texte de la barre d'outils (optionnel)
2. Cliquez sur **Add suggested code**
3. Dans la zone de saisie de code qui apparaît, entrez le code suggéré
4. Cliquez sur le bouton **Add Comment**

**Exemple** :

```
Description de la suggestion : Utiliser async/await pour simplifier la chaîne Promise

Code suggéré :
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

**Ce que vous devriez voir** :
- L'annotation s'affiche sous le diff (cadre bleu)
- Le code suggéré s'affiche sous forme de bloc de code avec l'étiquette "Suggested:"
- La barre latérale affiche la première ligne du code suggéré (avec points de suspension)

### Étape 6 : Ajouter une annotation Concern

**Scénario** : Marquer les problèmes potentiels ou points de risque, pour alerter l'IA

**Note** : Dans la version actuelle de l'interface utilisateur Plannotator, le type d'annotation par défaut est **Comment**. Si vous devez marquer un **Concern**, vous pouvez l'indiquer explicitement dans le texte de l'annotation.

1. Entrez la description du problème dans la zone de texte de la barre d'outils
2. Vous pouvez utiliser `Concern:` ou `⚠️` pour indiquer clairement qu'il s'agit d'un point d'attention
3. Cliquez sur le bouton **Add Comment**

**Exemple** :

```
Concern : Il manque une vérification null ici, si user est null cela entraînera une erreur d'exécution

Suggérer d'ajouter :
if (!user) return null;
```

**Ce que vous devriez voir** :
- L'annotation s'affiche sous le diff
- Le contenu de l'annotation s'affiche dans la barre latérale

### Étape 7 : Afficher et gérer les annotations

**Afficher toutes les annotations dans la barre latérale** :

1. La barre latérale droite affiche la liste de toutes les annotations
2. Chaque annotation affiche :
   - Le nom du fichier (dernier composant du chemin)
   - La plage de numéros de ligne (par exemple `L10` ou `L10-L15`)
   - L'auteur (si révision collaborative)
   - L'horodatage (par exemple `5m`, `2h`, `1d`)
   - Le contenu de l'annotation (jusqu'à 2 lignes)
   - Aperçu du code suggéré (première ligne)

**Naviguer vers une annotation** :

1. Cliquez sur une annotation dans la barre latérale
2. Le diff viewer défile automatiquement vers la position correspondante
3. L'annotation est mise en évidence

**Supprimer une annotation** :

1. Survolez une annotation dans la barre latérale
2. Cliquez sur le bouton **×** en haut à droite
3. L'annotation est supprimée, la mise en évidence dans le diff disparaît

**Ce que vous devriez voir** :
- La barre latérale affiche le nombre d'annotations (par exemple `Annotations: 3`)
- Après avoir cliqué sur une annotation, le diff viewer défile en douceur vers la ligne correspondante
- Après suppression, le nombre est mis à jour

### Étape 8 : Exporter les retours

Après avoir terminé toutes les annotations, cliquez sur le bouton **Send Feedback** en bas de la page.

**Ce que vous devriez voir** :
- Le navigateur se ferme automatiquement
- Le contenu des retours au format Markdown s'affiche dans le terminal
- L'IA reçoit des retours structurés et peut répondre automatiquement

**Format Markdown exporté** :

```markdown
# Code Review Feedback

## src/app/api/users.ts

### Line 10 (new)
Cette logique peut être simplifiée, suggérer d'utiliser async/await

### Lines 15-20 (new)
**Suggested code:**
```typescript
async function fetchUserData() {
  const response = await fetch(url);
  return await response.json();
}
```

### Line 25 (old)
Concern : Il manque une vérification null ici, si user est null cela entraînera une erreur d'exécution
```

::: tip Copier les retours
Si vous devez copier manuellement le contenu des retours, vous pouvez cliquer sur le bouton **Copy Feedback** en bas de la barre latérale pour copier les retours au format Markdown dans le presse-papiers.
:::

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez être capable de :

- [ ] Sélectionner des lignes de code en cliquant sur les numéros de ligne ou en utilisant le bouton "+" au survol dans le diff de code
- [ ] Ajouter des annotations Comment (commentaires généraux)
- [ ] Ajouter des annotations Suggestion (avec code suggéré)
- [ ] Ajouter des annotations Concern (marquer les problèmes potentiels)
- [ ] Afficher toutes les annotations dans la barre latérale, cliquer pour naviguer vers la position correspondante
- [ ] Supprimer les annotations indésirables
- [ ] Exporter les retours au format Markdown
- [ ] Copier le contenu des retours dans le presse-papiers

**Si une étape échoue**, voir :
- [Problèmes fréquents](../../faq/common-problems/)
- [Bases de la révision de code](../code-review-basics/)
- [Dépannage](../../faq/troubleshooting/)

## Pièges à éviter

**Erreur courante 1** : Après avoir cliqué sur le numéro de ligne, la barre d'outils n'apparaît pas

**Cause** : Vous avez peut-être cliqué sur le nom du fichier ou le numéro de ligne n'est pas dans la plage diff.

**Solution** :
- Assurez-vous de cliquer sur le numéro de ligne d'une ligne diff (ligne verte ou rouge)
- Pour les lignes supprimées (rouge), cliquez sur le numéro de ligne à gauche
- Pour les lignes ajoutées (vert), cliquez sur le numéro de ligne à droite

**Erreur courante 2** : Après avoir sélectionné plusieurs lignes, l'annotation s'affiche à la mauvaise position

**Cause** : Le côté (old/new) est incorrect.

**Solution** :
- Vérifiez si vous avez sélectionné l'ancien code (suppressions) ou le nouveau code (ajouts)
- L'annotation s'affichera sous la dernière ligne de la plage
- Si la position est incorrecte, supprimez l'annotation et ajoutez-la à nouveau

**Erreur courante 3** : Après avoir ajouté du code suggéré, le format du code est désordonné

**Cause** : Le code suggéré peut contenir des caractères spéciaux ou des problèmes d'indentation.

**Solution** :
- Dans la zone de saisie du code suggéré, assurez-vous que l'indentation est correcte
- Utilisez une police à chasse fixe pour éditer le code suggéré
- S'il y a des sauts de ligne, utilisez `Shift + Enter` au lieu de simplement appuyer sur Entrée

**Erreur courante 4** : Les nouvelles annotations ne sont pas visibles dans la barre latérale

**Cause** : La barre latérale peut ne pas s'être actualisée, ou l'annotation a été ajoutée à un autre fichier.

**Solution** :
- Basculez de fichier puis revenez
- Vérifiez si l'annotation a été ajoutée au fichier actuellement affiché
- Actualisez la page du navigateur (peut perdre les annotations non validées)

**Erreur courante 5** : Après avoir exporté les retours, l'IA n'a pas modifié selon les suggestions

**Cause** : L'IA peut ne pas avoir correctement compris l'intention de l'annotation, ou la suggestion n'est pas réalisable.

**Solution** :
- Utilisez des annotations plus explicites (Suggestion est plus explicite que Comment)
- Ajoutez des commentaires dans le code suggéré expliquant la raison
- Si le problème persiste, vous pouvez envoyer à nouveau les retours en ajustant le contenu de l'annotation

## Résumé de la leçon

Les annotations de code sont la fonctionnalité principale de révision de code de Plannotator, vous permettant de donner des retours précis sur les problèmes de code :

**Opérations clés** :
1. **Déclencher** : Exécuter `/plannotator-review`, le navigateur ouvre automatiquement le diff viewer
2. **Parcourir** : Afficher les modifications de code (basculement vue split/unified)
3. **Sélectionner** : Cliquer sur les numéros de ligne ou le bouton "+" au survol pour sélectionner la plage de code
4. **Annoter** : Ajouter des annotations Comment/Suggestion/Concern
5. **Gérer** : Afficher, naviguer vers, supprimer les annotations dans la barre latérale
6. **Exporter** : Send Feedback, l'IA reçoit des retours structurés

**Types d'annotations** :
- **Comment** : Commentaires généraux, fournir des suggestions sans obligation
- **Suggestion** : Suggestions de modification claires, avec code suggéré
- **Concern** : Marquer les problèmes potentiels ou points de risque

**Meilleures pratiques** :
- Lorsque vous utilisez Suggestion, essayez de fournir un code complet exécutable
- Pour les problèmes de performance ou de sécurité, utilisez Concern pour marquer
- Le contenu des annotations doit être spécifique, évitez les descriptions vagues (comme "ce n'est pas bon")
- Vous pouvez joindre des images pour aider à expliquer (utiliser la fonction d'annotation d'images)

## Prochaine leçon

> La prochaine leçon, nous apprenrons **[Basculer les vues de diff](../code-review-diff-types/)**.
>
> Vous apprendrez :
> - Comment basculer entre différents types de diff (uncommitted/staged/last commit/branch)
> - Scénarios d'utilisation des différents types de diff
> - Comment basculer rapidement entre plusieurs types de diff

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
| Définition du type CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L56) | 53-56 |
| Interface CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| Composant DiffViewer | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| Composant ReviewPanel | [`packages/review-editor/components/ReviewPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/ReviewPanel.tsx#L1-L211) | 1-211 |
| Export des retours Markdown | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L86-L126) | 86-126 |
| Bouton Hover "+" | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L180-L199) | 180-199 |
| Barre d'outils d'annotation | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L267-L344) | 267-344 |
| Rendu des annotations | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L140-L177) | 140-177 |

**Types clés** :
- `CodeAnnotationType` : Type d'annotation de code ('comment' | 'suggestion' | 'concern') (`packages/ui/types.ts:53`)
- `CodeAnnotation` : Interface d'annotation de code (`packages/ui/types.ts:55-66`)
- `SelectedLineRange` : Plage de code sélectionnée (`packages/ui/types.ts:77-82`)

**Fonctions clés** :
- `exportReviewFeedback()` : Convertir les annotations au format Markdown (`packages/review-editor/App.tsx:86`)
- `renderAnnotation()` : Rendre les annotations dans le diff (`packages/review-editor/components/DiffViewer.tsx:140`)
- `renderHoverUtility()` : Rendre le bouton Hover "+" (`packages/review-editor/components/DiffViewer.tsx:180`)

**Routes API** :
- `POST /api/feedback` : Soumettre les retours de révision (`packages/server/review.ts`)
- `GET /api/diff` : Obtenir le diff git (`packages/server/review.ts:111`)
- `POST /api/diff/switch` : Basculer le type de diff (`packages/server/review.ts`)

**Règles métier** :
- Par défaut, afficher le diff non validé (`git diff HEAD`) (`packages/server/review.ts:111`)
- Les annotations s'affichent sous la dernière ligne de la plage (style GitHub) (`packages/review-editor/components/DiffViewer.tsx:81`)
- Permettre de joindre du code suggéré dans les annotations (champ `suggestedCode`) (`packages/ui/types.ts:63`)

</details>
