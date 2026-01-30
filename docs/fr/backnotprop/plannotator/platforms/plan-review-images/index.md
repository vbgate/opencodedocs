---
title: "Annotation d'images : Trois outils de marquage | Plannotator"
sidebarTitle: "Annoter les images avec trois outils"
subtitle: "Annotation d'images : Trois outils de marquage"
description: "Découvrez les trois outils d'annotation d'images de Plannotator. Joignez des images aux revues de plan, utilisez le pinceau, les flèches et les cercles, avec réglage des couleurs et raccourcis clavier."
tags:
  - "Annotation d'images"
  - "Pinceau"
  - "Flèche"
  - "Cercle"
  - "Raccourcis clavier"
  - "Revue de plan"
  - "Revue de code"
prerequisite:
  - "platforms-plan-review-basics"
order: 3
---

# Ajouter des annotations d'images : Marquer avec le pinceau, les flèches et les cercles

## Ce que vous apprendrez

- ✅ Joindre des images aux revues de plan ou de code
- ✅ Utiliser l'outil pinceau pour dessiner librement
- ✅ Utiliser l'outil flèche pour indiquer les zones importantes
- ✅ Utiliser l'outil cercle pour encadrer des zones
- ✅ Ajuster les couleurs et l'épaisseur du trait
- ✅ Utiliser les raccourcis clavier pour changer d'outil rapidement

## Vos difficultés actuelles

**Problème 1** : Lors de la revue de maquettes UI ou de diagrammes, les descriptions textuelles ne sont pas assez visuelles et vous devez encercler les zones problématiques.

**Problème 2** : Vous voulez ajouter des captures d'écran annotées à vos revues de code, mais vous ne pouvez qu'écrire « il y a un problème ici » sans pouvoir marquer directement sur l'image.

**Problème 3** : Vous recevez un lien vers une image partagée par l'équipe et souhaitez annoter rapidement vos retours sans télécharger l'image localement pour utiliser un autre outil.

**Plannotator peut vous aider** :
- Annoter les images directement dans le navigateur, sans téléchargement local
- Trois outils — pinceau, flèche, cercle — couvrant tous les scénarios d'annotation
- Cinq couleurs et cinq épaisseurs de trait pour ajuster l'effet des annotations
- Raccourcis clavier pour améliorer l'efficacité

## Quand utiliser cette technique

**Cas d'utilisation** :
- Annoter des problèmes lors de la revue de maquettes UI, diagrammes de flux ou d'architecture
- Capturer et annoter des problèmes de code lors des revues de code
- Partager des images annotées avec les membres de l'équipe
- Encercler des zones importantes ou ajouter des flèches indicatives sur les images

## 🎒 Avant de commencer

::: warning Prérequis

Ce tutoriel suppose que vous avez :

- ✅ Terminé les [Bases de la revue de plan](../plan-review-basics/) ou les [Bases de la revue de code](../code-review-basics/)
- ✅ Compris comment ouvrir la page de revue de plan ou de code
- ✅ Maîtrisé les opérations de base des commentaires

:::

## Concept clé

**Les trois outils d'annotation d'images** :

| Outil | Icône | Raccourci | Utilisation |
| --- | --- | --- | --- |
| **Pinceau** | 🖊️ | 1 | Dessin libre, idéal pour les notes manuscrites ou l'encerclement de formes quelconques |
| **Flèche** | ➡️ | 2 | Indiquer les zones importantes ou une direction, idéal pour les annotations point à point |
| **Cercle** | ⭕ | 3 | Encercler une zone, idéal pour mettre en évidence un élément |

**Flux de travail** :
```
Télécharger l'image → Sélectionner l'outil → Ajuster couleur et taille → Dessiner sur l'image → Enregistrer
```

## Suivez le guide

### Étape 1 : Ouvrir la page de revue de plan ou de code

**Pourquoi**
La fonction d'annotation d'images de Plannotator est intégrée aux revues de plan et de code.

**Actions**

1. Lancez une revue de plan (déclenchée par Claude Code ou via l'appel submit_plan d'OpenCode)
2. Ou exécutez la commande `/plannotator-review` pour lancer une revue de code

**Vous devriez voir** :
- Le navigateur ouvre la page de revue
- Un bouton « Upload » ou « Pièce jointe » en haut à droite

### Étape 2 : Télécharger une image

**Pourquoi**
Vous devez d'abord télécharger une image avant de pouvoir l'annoter.

**Actions**

1. Cliquez sur le bouton « Upload » ou « Pièce jointe » en haut à droite de la page
2. Sélectionnez l'image à annoter (formats PNG, JPEG, WebP pris en charge)
3. Une fois téléchargée, l'image apparaît dans la liste des commentaires

**Vous devriez voir** :
- Une miniature de l'image dans la zone de commentaires
- Cliquer sur la miniature ouvre l'éditeur d'annotation

::: tip Sources d'images
Vous pouvez obtenir des images de plusieurs façons :
- Capture d'écran et collage (Ctrl+V / Cmd+V)
- Sélection depuis un fichier local
- Glisser-déposer une image sur la page
:::

### Étape 3 : Ouvrir l'éditeur d'annotation d'images

**Pourquoi**
L'éditeur d'annotation fournit les outils de dessin et la sélection des couleurs.

**Actions**

1. Cliquez sur la miniature de l'image téléchargée
2. L'éditeur d'annotation s'ouvre dans une fenêtre modale

**Vous devriez voir** :
- L'image centrée à l'écran
- Une barre d'outils en haut
- De gauche à droite dans la barre d'outils : sélection d'outil, épaisseur du trait, sélection de couleur, annuler, effacer, enregistrer

### Étape 4 : Utiliser l'outil pinceau pour dessiner librement

**Pourquoi**
L'outil pinceau est idéal pour les notes manuscrites ou l'encerclement de formes quelconques.

**Actions**

1. Assurez-vous que l'outil pinceau est sélectionné (icône 🖊️, sélectionné par défaut)
2. Maintenez le bouton gauche de la souris enfoncé et dessinez sur l'image
3. Relâchez la souris pour terminer le dessin

**Vous devriez voir** :
- Le tracé qui suit le mouvement de la souris
- Une fois la souris relâchée, la forme dessinée reste fixée sur l'image

::: info Caractéristiques du pinceau
- Utilise la bibliothèque perfect-freehand pour un effet de dessin fluide
- Prend en charge la sensibilité à la pression (si votre appareil le permet)
- Plus le trait est épais, plus la ligne est lisse
:::

### Étape 5 : Utiliser l'outil flèche pour indiquer les points importants

**Pourquoi**
Les flèches sont idéales pour les annotations point à point, indiquant clairement l'emplacement d'un problème.

**Actions**

1. Cliquez sur l'outil flèche (icône ➡️) ou appuyez sur le raccourci `2`
2. Cliquez sur l'image pour définir le point de départ de la flèche
3. Faites glisser jusqu'à la position cible et relâchez la souris pour terminer

**Vous devriez voir** :
- Une ligne droite du point de départ au point d'arrivée
- Une pointe de flèche au point d'arrivée, pointant vers la cible

::: tip Astuces pour dessiner des flèches
- Le **point de départ** est la queue de la flèche, le **point d'arrivée** est la tête
- Pendant le glissement, vous pouvez prévisualiser la direction de la flèche en temps réel
- Idéal pour annoter « il y a un problème ici » ou « ceci doit être modifié »
:::

### Étape 6 : Utiliser l'outil cercle pour encadrer une zone

**Pourquoi**
Les cercles sont idéaux pour mettre en évidence un élément avec une zone clairement délimitée.

**Actions**

1. Cliquez sur l'outil cercle (icône ⭕) ou appuyez sur le raccourci `3`
2. Cliquez sur l'image pour définir un bord du cercle
3. Faites glisser jusqu'au bord opposé et relâchez la souris pour terminer

**Vous devriez voir** :
- Un cercle dont le diamètre est la ligne reliant le point de départ au point d'arrivée
- Le centre du cercle est le milieu de cette ligne

::: details Principe de dessin du cercle

L'outil cercle dessine d'un bord à l'autre :
- **Premier clic** : un bord du cercle
- **Glissement** : définit le diamètre du cercle
- **Relâchement** : le cercle est terminé

Implémentation dans le code source (`utils.ts:95-124`) :
```typescript
// Le centre est le milieu entre le point de départ et le point d'arrivée
const cx = (x1 + x2) / 2;
const cy = (y1 + y2) / 2;

// Le rayon est la moitié de la distance entre les deux points
const radius = Math.hypot(x2 - x1, y2 - y1) / 2;
```

:::

### Étape 7 : Ajuster la couleur des annotations

**Pourquoi**
Différentes couleurs permettent de distinguer différents types d'annotations (par exemple, rouge pour les erreurs, vert pour les suggestions).

**Actions**

1. Cliquez sur un point de couleur dans la barre d'outils
2. Couleurs disponibles : rouge, jaune, vert, bleu, blanc

**Vous devriez voir** :
- Le point de couleur sélectionné s'agrandit
- Toutes les nouvelles annotations utilisent la couleur actuelle

::: info Conseils d'utilisation des couleurs
- **Rouge** : erreurs, problèmes, contenu à supprimer
- **Jaune** : avertissements, points d'attention, éléments à confirmer
- **Vert** : suggestions, optimisations, améliorations
- **Bleu** : informations complémentaires, notes
- **Blanc** : adapté aux images à fond sombre
:::

### Étape 8 : Ajuster l'épaisseur du trait

**Pourquoi**
Différentes épaisseurs de trait conviennent à différents scénarios d'annotation.

**Actions**

1. Cliquez sur les boutons `-` ou `+` dans la barre d'outils
2. Ou observez l'aperçu de l'épaisseur actuelle (un point)

**Vous devriez voir** :
- Épaisseurs disponibles : 3, 6, 10, 16, 24
- Un point d'aperçu au centre de la barre d'outils indique l'épaisseur actuelle

::: tip Conseils sur l'épaisseur du trait
- **3** : annotation précise de petits éléments (boutons, icônes)
- **6** : annotation standard (valeur par défaut)
- **10** : trait épais, adapté à l'encerclement de grandes zones
- **16** : annotation très épaisse, pour mettre en évidence les points importants
- **24** : trait maximum, pour mettre en évidence de très grandes zones
:::

### Étape 9 : Annuler et effacer

**Pourquoi**
Des erreurs peuvent survenir pendant l'annotation, il faut pouvoir annuler ou recommencer.

**Actions**

1. **Annuler la dernière action** : cliquez sur l'icône d'annulation (↩️) ou appuyez sur `Cmd+Z` / `Ctrl+Z`
2. **Effacer toutes les annotations** : cliquez sur l'icône d'effacement (❌)

**Vous devriez voir** :
- Annuler : la dernière annotation dessinée disparaît
- Effacer : toutes les annotations sont supprimées, l'image originale est restaurée

::: warning Avertissement sur l'effacement
L'effacement est irréversible, utilisez-le avec précaution. Il est recommandé d'utiliser d'abord l'annulation pour revenir en arrière progressivement.
:::

### Étape 10 : Enregistrer les annotations

**Pourquoi**
Une fois enregistrées, les annotations sont fusionnées avec l'image et peuvent être consultées dans la revue.

**Actions**

1. Cliquez sur l'icône d'enregistrement (✅) à droite de la barre d'outils
2. Ou appuyez sur `Esc` ou `Entrée`
3. Ou cliquez en dehors de la fenêtre modale

**Vous devriez voir** :
- La fenêtre modale se ferme
- La miniature de l'image est mise à jour avec la version annotée
- L'image est jointe au commentaire actuel

::: tip Mécanisme d'enregistrement
- Si **aucune annotation n'a été dessinée**, l'image originale est enregistrée directement
- Si **des annotations existent**, l'image originale et les annotations sont fusionnées en une nouvelle image
- L'image fusionnée est enregistrée au format PNG pour une haute qualité
:::

## Point de contrôle ✅

**Vérifiez vos acquis** :

- [ ] Vous pouvez télécharger une image sur la page de revue
- [ ] Vous pouvez utiliser les trois outils — pinceau, flèche, cercle — pour dessiner des annotations
- [ ] Vous pouvez ajuster la couleur et l'épaisseur des annotations
- [ ] Vous pouvez utiliser les raccourcis clavier (1/2/3, Cmd+Z, Esc) pour des opérations rapides
- [ ] Vous pouvez annuler des annotations erronées
- [ ] Vous pouvez enregistrer l'image annotée

## Pièges à éviter

### Problème 1 : La flèche pointe dans la mauvaise direction

**Symptôme** : La flèche pointe dans la mauvaise direction.

**Cause** : L'outil flèche dessine du point de départ (queue) au point d'arrivée (tête).

**Solution** :
- Redessinez en vous assurant que le point de départ est la queue et le point d'arrivée est la tête
- Si déjà dessiné, annulez et recommencez

### Problème 2 : Le cercle n'est pas au bon endroit

**Symptôme** : Le cercle n'encadre pas la zone cible.

**Cause** : L'outil cercle dessine d'un bord à l'autre, le centre étant le milieu des deux points.

**Solution** :
- Premier clic sur le bord de la zone cible
- Faites glisser jusqu'au bord opposé en vous assurant que la zone cible est à l'intérieur du cercle
- Annulez et recommencez si nécessaire

### Problème 3 : Le trait est trop épais ou trop fin

**Symptôme** : L'effet d'annotation n'est pas satisfaisant.

**Cause** : L'épaisseur du trait ne convient pas au scénario actuel.

**Solution** :
- Utilisez les boutons `-` ou `+` de la barre d'outils pour ajuster l'épaisseur
- Utilisez 3-6 pour les petits éléments, 10-24 pour les grandes zones

### Problème 4 : La couleur n'est pas visible

**Symptôme** : Sur un fond sombre, le trait noir n'est pas visible.

**Cause** : Mauvais choix de couleur.

**Solution** :
- Utilisez le blanc ou le jaune sur les fonds sombres
- Utilisez le rouge, le vert ou le bleu sur les fonds clairs

## Aide-mémoire des raccourcis

| Raccourci | Fonction |
| --- | --- |
| `1` | Basculer vers l'outil pinceau |
| `2` | Basculer vers l'outil flèche |
| `3` | Basculer vers l'outil cercle |
| `Cmd+Z` / `Ctrl+Z` | Annuler la dernière action |
| `Esc` / `Entrée` | Enregistrer les annotations |

## Résumé de la leçon

Dans cette leçon, vous avez appris :

1. **Télécharger des images** : via le bouton de téléchargement ou le collage sur la page de revue
2. **Trois outils d'annotation** :
   - Pinceau (1) : dessin libre, idéal pour les notes manuscrites
   - Flèche (2) : annotation point à point, idéal pour indiquer les points importants
   - Cercle (3) : encadrement de zone, idéal pour mettre en évidence
3. **Ajuster le style des annotations** : 5 couleurs, 5 épaisseurs de trait
4. **Annuler et effacer** : corriger les annotations erronées
5. **Enregistrer les annotations** : fusionner les annotations avec l'image

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons les **[Bases de la revue de code](../code-review-basics/)**.
>
> Vous apprendrez :
> - Comment utiliser la commande /plannotator-review pour réviser un git diff
> - Basculer entre les vues side-by-side et unified
> - Cliquer sur les numéros de ligne pour sélectionner une plage de code
> - Ajouter des commentaires au niveau des lignes (comment/suggestion/concern)
> - Changer de type de diff
> - Envoyer les retours à l'Agent IA

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition des types d'outils | [`packages/ui/components/ImageAnnotator/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/types.ts#L1-L40) | 1-40 |
| Fonctions de rendu | [`packages/ui/components/ImageAnnotator/utils.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/utils.ts#L1-L148) | 1-148 |
| Composant principal | [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx#L1-L233) | 1-233 |
| Composant barre d'outils | [`packages/ui/components/ImageAnnotator/Toolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/Toolbar.tsx#L1-L219) | 1-219 |
| Interface Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |

**Types clés** :

**Tool** (type d'outil) :
```typescript
export type Tool = 'pen' | 'arrow' | 'circle';
```

**Point** (coordonnées) :
```typescript
export interface Point {
  x: number;
  y: number;
  pressure?: number;
}
```

**Stroke** (trait) :
```typescript
export interface Stroke {
  id: string;
  tool: Tool;
  points: Point[];
  color: string;
  size: number;
}
```

**AnnotatorState** (état de l'annotateur) :
```typescript
export interface AnnotatorState {
  tool: Tool;
  color: string;
  strokeSize: number;
  strokes: Stroke[];
  currentStroke: Stroke | null;
}
```

**COLORS** (tableau de couleurs) :
```typescript
export const COLORS = [
  '#ef4444', // rouge
  '#eab308', // jaune
  '#22c55e', // vert
  '#3b82f6', // bleu
  '#ffffff', // blanc
] as const;
```

**STROKE_SIZES** (épaisseurs de trait) :
```typescript
const STROKE_SIZES = [3, 6, 10, 16, 24];
```

**Fonctions clés** :

**renderPenStroke()** (rendu du trait de pinceau) :
- Utilise la bibliothèque perfect-freehand pour un effet de dessin fluide
- Prend en charge la sensibilité à la pression (champ pressure)

**renderArrow()** (rendu de la flèche) :
- Dessine une ligne droite du point de départ au point d'arrivée
- Dessine la pointe de flèche au point d'arrivée

**renderCircle()** (rendu du cercle) :
- Calcule le milieu des deux points comme centre
- Calcule la moitié de la distance entre les deux points comme rayon

**renderStroke()** (rendu selon le type d'outil) :
- Appelle la fonction de rendu correspondante selon le champ tool
- Prend en charge le zoom (paramètre scale)

**Annotation.imagePaths** (champ des images jointes) :
```typescript
export interface Annotation {
  // ...
  imagePaths?: string[]; // Images jointes (chemins locaux ou URLs)
}
```

**Gestion des raccourcis clavier** (index.tsx:33-59) :
```typescript
// 1/2/3 pour changer d'outil
if (e.key === '1') setState(s => ({ ...s, tool: 'pen' }));
if (e.key === '2') setState(s => ({ ...s, tool: 'arrow' }));
if (e.key === '3') setState(s => ({ ...s, tool: 'circle' }));

// Cmd+Z pour annuler
if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
  e.preventDefault();
  handleUndo();
}
```

</details>
