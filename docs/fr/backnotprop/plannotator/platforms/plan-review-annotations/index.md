---
title: "Annotations de plan : quatre types d'annotations | Plannotator"
sidebarTitle: "Ajouter quatre types d'annotations"
subtitle: "Annotations de plan : quatre types d'annotations"
description: "Maîtrisez les quatre types d'annotations de Plannotator. Apprenez à ajouter des suppressions, remplacements, insertions et commentaires, avec le raccourci type-to-comment et les pièces jointes d'images pour améliorer l'efficacité de la révision de plan."
tags:
  - "Annotations de plan"
  - "Types d'annotations"
  - "Suppression"
  - "Remplacement"
  - "Insertion"
  - "Commentaire"
  - "type-to-comment"
  - "Pièces jointes d'images"
prerequisite:
  - "platforms-plan-review-basics"
order: 2
---

# Ajouter des annotations de plan : maîtriser les quatre types d'annotations

## Ce que vous pourrez faire après ce cours

- ✅ Sélectionner du texte de plan et ajouter quatre types d'annotations différents (suppression, remplacement, insertion, commentaire)
- ✅ Utiliser le raccourci type-to-comment pour saisir directement des commentaires
- ✅ Joindre des images aux annotations (images de référence, captures d'écran, etc.)
- ✅ Comprendre la signification et les cas d'utilisation de chaque type d'annotation
- ✅ Visualiser le format Markdown exporté des annotations

## Votre problème actuel

**Problème 1** : Vous savez qu'il faut supprimer un certain contenu, mais après avoir sélectionné le texte, vous ne savez pas sur quel bouton cliquer.

**Problème 2** : Vous voulez remplacer un bloc de code, mais la barre d'outils n'affiche que « Supprimer » et « Commenter », pas d'option « Remplacer ».

**Problème 3** : Vous sélectionnez plusieurs lignes de texte et voulez saisir directement un commentaire, mais vous devez d'abord cliquer sur le bouton « Comment » à chaque fois, ce qui est inefficace.

**Problème 4** : Vous voulez joindre une image de référence à un bloc de code, mais vous ne savez pas comment télécharger des images.

**Plannotator peut vous aider** :
- Des icônes de boutons claires pour distinguer immédiatement suppression, remplacement, insertion et commentaire
- Le raccourci type-to-comment pour saisir directement sans cliquer sur un bouton
- Support des pièces jointes d'images dans les annotations pour ajouter facilement des références visuelles
- Les annotations sont automatiquement converties en Markdown structuré que l'IA comprend avec précision

## Quand utiliser cette approche

**Cas d'utilisation** :
- Réviser un plan d'implémentation généré par l'IA et fournir des retours de modification précis
- Un certain contenu n'est pas nécessaire (suppression)
- Un certain contenu doit être réécrit différemment (remplacement)
- Un certain contenu nécessite des explications supplémentaires après (insertion)
- Vous avez des questions ou des suggestions sur un certain contenu (commentaire)

**Cas non applicables** :
- Vous voulez simplement approuver ou rejeter le plan globalement (pas besoin d'annotations, décidez directement)
- Vous révisez déjà des modifications de code (utilisez la fonctionnalité de revue de code)

## 🎒 Préparation avant de commencer

**Prérequis** :
- ✅ Avoir terminé le tutoriel [Bases de la révision de plan](../plan-review-basics/)
- ✅ Savoir comment déclencher l'interface de révision de plan Plannotator

**Hypothèses de ce cours** :
- Vous avez déjà ouvert la page de révision de plan Plannotator
- La page affiche un plan Markdown généré par l'IA

## Concept central

### Détail des types d'annotations

Plannotator prend en charge quatre types d'annotations de plan (plus un commentaire global) :

| Type d'annotation | Icône | Utilisation | Saisie de contenu requise |
| --- | --- | --- | --- |
| **Suppression (DELETION)** | 🗑️ | Marquer ce contenu pour suppression du plan | ❌ Non requise |
| **Commentaire (COMMENT)** | 💬 | Poser des questions ou faire des suggestions sur le contenu sélectionné | ✅ Saisie de commentaire requise |
| **Remplacement (REPLACEMENT)** | Via commentaire | Remplacer le contenu sélectionné par un nouveau contenu | ✅ Saisie du nouveau contenu requise |
| **Insertion (INSERTION)** | Via commentaire | Insérer un nouveau contenu après le contenu sélectionné | ✅ Saisie du nouveau contenu requise |
| **Commentaire global (GLOBAL_COMMENT)** | Champ de saisie en bas de page | Fournir des retours sur l'ensemble du plan | ✅ Saisie de commentaire requise |

**Pourquoi le remplacement et l'insertion n'ont-ils pas de boutons dédiés ?**

Parce que, d'après l'implémentation du code source, le remplacement et l'insertion sont essentiellement des types spéciaux de commentaires (`packages/ui/utils/parser.ts:287-296`) :
- **Remplacement** : Le contenu du commentaire sert de nouveau texte de remplacement
- **Insertion** : Le contenu du commentaire sert de nouveau texte à insérer

Ils utilisent tous deux le bouton **Commentaire (COMMENT)** pour être créés, la différence réside dans la façon dont vous décrivez votre intention.

### Flux de travail de la barre d'outils

```
Sélectionner du texte → La barre d'outils apparaît (étape menu)
                  │
                  ├── Cliquer sur Delete → Crée immédiatement une annotation de suppression
                  ├── Cliquer sur Comment → Passe à l'étape de saisie → Saisir le contenu → Enregistrer
                  └── Saisir directement des caractères → type-to-comment → Passe automatiquement à l'étape de saisie
```

**Différence entre les deux étapes** :
- **Étape menu** : Choisir le type d'opération (supprimer, commenter, annuler)
- **Étape de saisie** : Saisir le contenu du commentaire ou joindre des images (accessible depuis commentaire/remplacement)

### Raccourci type-to-comment

C'est la fonctionnalité clé pour améliorer l'efficacité. Après avoir sélectionné du texte, **commencez simplement à taper** (sans cliquer sur aucun bouton), et la barre d'outils va automatiquement :
1. Passer en mode « commentaire »
2. Placer le premier caractère que vous avez tapé dans le champ de saisie
3. Positionner automatiquement le curseur à la fin du champ de saisie

Emplacement dans le code source : `packages/ui/components/AnnotationToolbar.tsx:127-147`

## Suivez les étapes

### Étape 1 : Lancer la révision de plan

**Pourquoi**
Vous avez besoin d'un plan réel pour pratiquer l'ajout d'annotations.

**Opération**

Déclenchez la révision de plan dans Claude Code ou OpenCode :

```bash
# Exemple Claude Code : Demandez à l'IA de générer un plan, elle appellera ExitPlanMode
"Veuillez générer un plan d'implémentation pour une fonctionnalité d'authentification utilisateur"

# Attendez que l'IA termine le plan, Plannotator s'ouvrira automatiquement dans le navigateur
```

**Ce que vous devriez voir** :
- Le navigateur ouvre la page de révision de plan
- La page affiche un plan d'implémentation au format Markdown

### Étape 2 : Ajouter une annotation de suppression

**Pourquoi**
Les annotations de suppression servent à marquer le contenu que vous ne voulez pas voir dans le plan final.

**Opération**

1. Trouvez un paragraphe dont vous n'avez pas besoin dans le plan (par exemple, une description de fonctionnalité non pertinente)
2. Sélectionnez le texte avec la souris
3. La barre d'outils apparaît automatiquement, cliquez sur le **bouton Supprimer (🗑️)**

**Ce que vous devriez voir** :
- Le texte sélectionné s'affiche avec un style de suppression (généralement barré ou avec un fond rouge)
- La barre d'outils se ferme automatiquement

::: tip Caractéristique des annotations de suppression
Les annotations de suppression **ne nécessitent aucune saisie de contenu**. Après avoir cliqué sur le bouton de suppression, l'annotation est immédiatement créée.
:::

### Étape 3 : Utiliser type-to-comment pour ajouter un commentaire

**Pourquoi**
Le commentaire est le type d'annotation le plus utilisé, et type-to-comment vous évite un clic.

**Opération**

1. Sélectionnez du texte dans le plan (par exemple, un nom de fonction ou une description)
2. **Ne cliquez sur aucun bouton, commencez simplement à taper**
3. Saisissez le contenu de votre commentaire (par exemple : « Ce nom de fonction n'est pas assez clair »)
4. Appuyez sur `Entrée` pour enregistrer, ou cliquez sur le bouton **Save**

**Ce que vous devriez voir** :
- La barre d'outils passe automatiquement en mode champ de saisie
- Le premier caractère que vous avez tapé est déjà dans le champ de saisie
- Le curseur est automatiquement positionné à la fin du champ de saisie
- Après avoir appuyé sur `Entrée`, le texte sélectionné s'affiche avec un style de commentaire (généralement avec un fond jaune)

::: tip Raccourcis type-to-comment
- `Entrée` : Enregistrer l'annotation (si le champ de saisie contient du contenu)
- `Maj + Entrée` : Nouvelle ligne (pour saisir des commentaires multilignes)
- `Échap` : Annuler la saisie, revenir à l'étape menu
:::

### Étape 4 : Ajouter une annotation de remplacement

**Pourquoi**
Les annotations de remplacement servent à remplacer le contenu sélectionné par un nouveau contenu, l'IA modifiera le plan selon votre annotation.

**Opération**

1. Sélectionnez du texte dans le plan (par exemple « Utiliser un token JWT pour l'authentification »)
2. Utilisez type-to-comment ou cliquez sur le bouton commentaire
3. Saisissez le nouveau contenu dans le champ de saisie (par exemple : « Utiliser un cookie de session pour l'authentification »)
4. Appuyez sur `Entrée` pour enregistrer

**Ce que vous devriez voir** :
- Le texte sélectionné s'affiche avec un style de commentaire
- La barre latérale des annotations affiche le contenu de votre commentaire

**Format après exportation** (`packages/ui/utils/parser.ts:292-296`) :

```markdown
## 1. Change this

**From:**
```
Utiliser un token JWT pour l'authentification
```

**To:**
```
Utiliser un cookie de session pour l'authentification
```
```

::: info Différence entre remplacement et suppression
- **Suppression** : Supprime directement le contenu, pas besoin de justification
- **Remplacement** : Remplace l'ancien contenu par un nouveau, nécessite de spécifier le nouveau contenu
:::

### Étape 5 : Ajouter une annotation d'insertion

**Pourquoi**
Les annotations d'insertion servent à ajouter des explications ou des extraits de code après le contenu sélectionné.

**Opération**

1. Sélectionnez du texte dans le plan (par exemple, la fin d'une signature de fonction)
2. Utilisez type-to-comment ou cliquez sur le bouton commentaire
3. Saisissez le contenu à insérer dans le champ de saisie (par exemple : « , doit gérer le cas d'échec d'authentification »)
4. Appuyez sur `Entrée` pour enregistrer

**Ce que vous devriez voir** :
- Le texte sélectionné s'affiche avec un style de commentaire
- La barre latérale des annotations affiche votre commentaire

**Format après exportation** (`packages/ui/utils/parser.ts:287-290`) :

```markdown
## 1. Add this

```
, doit gérer le cas d'échec d'authentification
```
```

### Étape 6 : Joindre des images aux annotations

**Pourquoi**
Parfois, les descriptions textuelles ne sont pas assez visuelles, vous devez joindre des images de référence ou des captures d'écran.

**Opération**

1. Sélectionnez n'importe quel texte, passez à l'étape de saisie (cliquez sur le bouton commentaire ou utilisez type-to-comment)
2. À côté du champ de saisie de la barre d'outils, cliquez sur le **bouton pièce jointe (📎)**
3. Sélectionnez l'image à télécharger (formats PNG, JPEG, WebP pris en charge)
4. Vous pouvez continuer à saisir le contenu du commentaire
5. Appuyez sur `Entrée` pour enregistrer

**Ce que vous devriez voir** :
- La miniature de l'image s'affiche dans le champ de saisie
- Après enregistrement, l'image s'affiche dans la barre latérale des annotations

::: warning Emplacement de stockage des images
Les images téléchargées sont enregistrées dans le répertoire local `/tmp/plannotator` (emplacement dans le code source : `packages/server/index.ts:163`). Si vous nettoyez les fichiers temporaires, les images seront perdues.
:::

### Étape 7 : Ajouter un commentaire global

**Pourquoi**
Lorsque vous avez des retours sur l'ensemble du plan (pas sur un texte spécifique), utilisez un commentaire global.

**Opération**

1. Trouvez le champ de saisie en bas de la page (le libellé peut être « Add a general comment about the plan... »)
2. Saisissez le contenu de votre commentaire
3. Appuyez sur `Entrée` pour enregistrer ou cliquez sur le bouton d'envoi

**Ce que vous devriez voir** :
- Le commentaire apparaît dans la zone de commentaires globaux en bas de la page
- Le commentaire s'affiche comme une carte indépendante, non associée à un bloc de texte

::: tip Commentaire global vs commentaire de texte
- **Commentaire global** : Retour sur l'ensemble du plan, non associé à un texte spécifique (par exemple « Le plan entier manque de considérations de performance »)
- **Commentaire de texte** : Retour sur un texte spécifique, met en surbrillance le texte correspondant
:::

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez :

- [ ] Avoir ajouté avec succès au moins une annotation de suppression
- [ ] Avoir ajouté un commentaire en utilisant type-to-comment
- [ ] Avoir ajouté des annotations de remplacement et d'insertion
- [ ] Avoir joint une image à une annotation
- [ ] Avoir ajouté un commentaire global
- [ ] Voir la liste de toutes les annotations dans la barre latérale droite

## Pièges à éviter

### Piège 1 : Impossible de trouver le bouton « Remplacer »

**Erreur courante** :
- Après avoir sélectionné du texte, la barre d'outils n'affiche que Delete et Comment, pas de bouton Replace ou Insert

**Bonne pratique** :
- Le remplacement et l'insertion sont réalisés via le bouton **Commentaire (COMMENT)**
- Décrivez votre intention dans le contenu du commentaire (remplacement ou insertion)
- L'IA comprendra votre intention en fonction du contenu du commentaire

### Piège 2 : type-to-comment ne fonctionne pas

**Causes possibles** :
1. Aucun texte n'est sélectionné
2. Vous avez d'abord cliqué sur un bouton, la barre d'outils est déjà à l'étape de saisie
3. Vous avez appuyé sur des touches spéciales (`Ctrl`, `Alt`, `Échap`, etc.)

**Bonne pratique** :
1. Sélectionnez d'abord du texte, assurez-vous que la barre d'outils affiche l'étape menu (avec les boutons Delete, Comment)
2. Tapez directement des caractères normaux (lettres, chiffres, ponctuation)
3. N'appuyez pas sur les touches de fonction

### Piège 3 : Image introuvable après téléchargement

**Causes possibles** :
- Les images sont enregistrées dans le répertoire `/tmp/plannotator`
- Le système a nettoyé les fichiers temporaires

**Bonne pratique** :
- Si vous devez conserver les images à long terme, copiez-les dans le répertoire du projet
- Lors de l'exportation des annotations, les chemins d'images sont absolus, assurez-vous que les autres outils peuvent y accéder

### Piège 4 : Appuyer sur `Entrée` pour une nouvelle ligne enregistre l'annotation

**Erreur courante** :
- Dans le champ de saisie, vous voulez aller à la ligne, vous appuyez directement sur `Entrée`, et l'annotation est enregistrée

**Bonne pratique** :
- Utilisez `Maj + Entrée` pour aller à la ligne
- La touche `Entrée` est dédiée à l'enregistrement des annotations

## Résumé du cours

**Quatre types d'annotations** :
- **Suppression (DELETION)** : Marquer le contenu que vous ne voulez pas voir dans le plan
- **Remplacement (REPLACEMENT)** : Remplacer le contenu sélectionné par un nouveau contenu (via commentaire)
- **Insertion (INSERTION)** : Ajouter du contenu après le contenu sélectionné (via commentaire)
- **Commentaire (COMMENT)** : Poser des questions ou faire des suggestions sur le contenu sélectionné
- **Commentaire global (GLOBAL_COMMENT)** : Retour sur l'ensemble du plan

**Opérations clés** :
- Sélectionner → La barre d'outils apparaît → Choisir le type d'opération
- type-to-comment : Tapez directement des caractères, passe automatiquement en mode commentaire
- `Maj + Entrée` : Nouvelle ligne ; `Entrée` : Enregistrer
- Bouton pièce jointe : Télécharger des images dans les annotations

**Format d'exportation des annotations** :
- Suppression : `## Remove this` + texte original
- Insertion : `## Add this` + nouveau texte
- Remplacement : `## Change this` + comparaison From/To
- Commentaire : `## Feedback on: "..."` + contenu du commentaire

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Ajouter des annotations d'images](../plan-review-images/)**.
>
> Vous apprendrez :
> - Comment joindre des images dans la révision de plan
> - Utiliser les outils pinceau, flèche et cercle pour annoter
> - Utiliser les images annotées comme retours de référence

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Définition de l'énumération des types d'annotations | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Interface Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| Composant barre d'outils d'annotation | [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L29-L272) | 29-272 |
| Formatage de l'exportation des annotations | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| Analyse du Markdown en Blocks | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| Composant Viewer (gestion de la sélection de texte) | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L66-L350) | 66-350 |

**Constantes clés** :
- `AnnotationType.DELETION = 'DELETION'` : Type d'annotation de suppression
- `AnnotationType.INSERTION = 'INSERTION'` : Type d'annotation d'insertion
- `AnnotationType.REPLACEMENT = 'REPLACEMENT'` : Type d'annotation de remplacement
- `AnnotationType.COMMENT = 'COMMENT'` : Type d'annotation de commentaire
- `AnnotationType.GLOBAL_COMMENT = 'GLOBAL_COMMENT'` : Type de commentaire global

**Fonctions clés** :
- `exportDiff(blocks, annotations)` : Exporte les annotations au format Markdown, incluant la comparaison From/To
- `parseMarkdownToBlocks(markdown)` : Analyse le Markdown en un tableau linéaire de Blocks
- `createAnnotationFromSource()` : Crée un objet Annotation à partir d'une sélection de texte

</details>
