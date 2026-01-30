---
title: "Modèles de données: Définition complète des types principaux | Plannotator"
subtitle: "Modèles de données: Définition complète des types principaux | Plannotator"
sidebarTitle: "Maîtriser les modèles de données principaux"
description: "Découvrez les modèles de données de Plannotator, maîtrisez les définitions complètes et les descriptions de champs des types principaux tels que Annotation, Block, CodeAnnotation, et comprenez en profondeur l'architecture du système."
tags:
  - "Modèles de données"
  - "Définition de types"
  - "Référence API"
prerequisite: []
order: 2
---

# Modèles de données de Plannotator

Cette annexe présente tous les modèles de données utilisés par Plannotator, y compris les structures de données principales pour la révision de plans, la révision de code et le partage par URL.
## Vue d'ensemble des modèles de données principaux

Plannotator définit les modèles de données principaux suivants en TypeScript :

| Modèle | Utilisation | Emplacement de définition |
|--- | --- | ---|
| `Annotation` | Annotations dans la révision de plans | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Blocs de contenu après analyse Markdown | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | Annotations dans la révision de code | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | Format d'annotation simplifié pour partage par URL | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation (Annotation de plan)

`Annotation` représente une annotation dans la révision de plan, utilisée pour marquer la suppression, l'insertion, le remplacement ou le commentaire sur une section du plan.

### Définition complète

```typescript
export interface Annotation {
  id: string;              // Identifiant unique
  blockId: string;         // ID du Block associé (obsolète, conservé pour compatibilité)
  startOffset: number;     // Offset de début (obsolète, conservé pour compatibilité)
  endOffset: number;       // Offset de fin (obsolète, conservé pour compatibilité)
  type: AnnotationType;     // Type d'annotation
  text?: string;           // Contenu du commentaire (pour INSERTION/REPLACEMENT/COMMENT)
  originalText: string;    // Texte original annoté
  createdA: number;        // Horodatage de création
  author?: string;         // Identité du collaborateur (pour partage par URL)
  imagePaths?: string[];    // Chemins des images attachées
  startMeta?: {            // Métadonnées de sélection entre éléments de web-highlighter
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // Métadonnées de sélection entre éléments de web-highlighter
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### Énumération AnnotationType

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // Supprimer ce contenu
  INSERTION = 'INSERTION',         // Insérer ce contenu
  REPLACEMENT = 'REPLACEMENT',     // Remplacer ce contenu
  COMMENT = 'COMMENT',             // Commenter ce contenu
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // Commentaire global (non lié à un texte spécifique)
}
```
### Description des champs

| Champ | Type | Requis | Description |
|--- | --- | --- | ---|
| `id` | string | ✅ | Identifiant unique, généralement un UUID généré automatiquement |
| `blockId` | string | ✅ | ID du `Block` associé (obsolète, conservé pour compatibilité) |
| `startOffset` | number | ✅ | Offset de caractère de début (obsolète, conservé pour compatibilité) |
| `endOffset` | number | ✅ | Offset de caractère de fin (obsolète, conservé pour compatibilité) |
| `type` | AnnotationType | ✅ | Type d'annotation (DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT) |
| `text` | string | ❌ | Contenu du commentaire (à remplir pour INSERTION/REPLACEMENT/COMMENT) |
| `originalText` | string | ✅ | Texte original annoté |
| `createdA` | number | ✅ | Horodatage de création (en millisecondes) |
| `author` | string | ❌ | Identifiant du collaborateur (pour distinguer les auteurs lors du partage par URL) |
| `imagePaths` | string[] | ❌ | Tableau des chemins des images attachées |
| `startMeta` | object | ❌ | Métadonnées de début de sélection entre éléments de web-highlighter |
| `endMeta` | object | ❌ | Métadonnées de fin de sélection entre éléments de web-highlighter |

### Exemples

#### Annotation de suppression

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "Cette partie n'est pas nécessaire",
  createdA: Date.now(),
}
```

#### Annotation de remplacement

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "Nouveau contenu",
  originalText: "Contenu original",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### Commentaire global

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "Dans l'ensemble, le plan est très clair",
  originalText: "",
  createdA: Date.now(),
}
```

::: info Description des champs obsolètes
Les champs `blockId`, `startOffset` et `endOffset` étaient utilisés dans les anciennes versions pour la mise en surbrillance de texte basée sur l'offset de caractères. La version actuelle utilise la bibliothèque [web-highlighter](https://github.com/alvarotrigo/web-highlighter), réalisant la sélection entre éléments via `startMeta` et `endMeta`. Ces champs sont conservés uniquement pour la compatibilité.
:::
## Block (Bloc de plan)

`Block` représente un bloc de contenu après analyse du texte Markdown, utilisé pour afficher le contenu du plan de manière structurée.

### Définition complète

```typescript
export interface Block {
  id: string;              // Identifiant unique
  type: BlockType;         // Type de bloc
  content: string;        // Contenu de texte brut
  level?: number;         // Niveau (pour les titres ou les listes)
  language?: string;      // Langage de code (pour les blocs de code)
  checked?: boolean;      // État de la case à cocher (pour les éléments de liste)
  order: number;          // Ordre de tri
  startLine: number;      // Numéro de ligne de début (1-based)
}
```

### Type BlockType

```typescript
type BlockType =
  | 'paragraph'     // Paragraphe
  | 'heading'       // Titre
  | 'blockquote'    // Bloc de citation
  | 'list-item'     // Élément de liste
  | 'code'          // Bloc de code
  | 'hr'            // Ligne de séparation
  | 'table';        // Tableau
```
### Description des champs

| Champ | Type | Requis | Description |
|--- | --- | --- | ---|
| `id` | string | ✅ | Identifiant unique, format `block-{numéro}` |
| `type` | BlockType | ✅ | Type de bloc (paragraph/heading/blockquote/list-item/code/hr/table) |
| `content` | string | ✅ | Contenu de texte brut du bloc |
| `level` | number | ❌ | Niveau : 1-6 pour les titres, niveau d'indentation pour les éléments de liste |
| `language` | string | ❌ | Langage du bloc de code (ex: 'typescript', 'rust') |
| `checked` | boolean | ❌ | État de la case à cocher de l'élément de liste (true = coché, false = non coché) |
| `order` | number | ✅ | Numéro d'ordre pour maintenir l'ordre des blocs |
| `startLine` | number | ✅ | Numéro de ligne de début dans le Markdown source (commence à 1) |

### Exemples

#### Bloc de titre

```typescript
{
  id: "block-0",
  type: "heading",
  content: "Plan d'implémentation",
  level: 1,
  order: 1,
  startLine: 1,
}
```

#### Bloc de paragraphe

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "Ceci est un paragraphe avec du texte.",
  order: 2,
  startLine: 3,
}
```

#### Bloc de code

```typescript
{
  id: "block-2",
  type: "code",
  content: "function hello() {\n  return 'world';\n}",
  language: "typescript",
  order: 3,
  startLine: 5,
}
```

#### Élément de liste (avec case à cocher)

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "Terminer le module d'authentification",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Analyse Markdown
Plannotator utilise un analyseur Markdown simplifié personnalisé (`parseMarkdownToBlocks`) qui convertit le Markdown source en un tableau `Block[]`. L'analyseur prend en charge les syntaxes courantes telles que les titres, les listes, les blocs de code, les tableaux et les blocs de citation.
:::
## CodeAnnotation (Annotation de code)

`CodeAnnotation` représente une annotation au niveau des lignes dans la révision de code, utilisée pour ajouter des commentaires sur des lignes ou des plages spécifiques d'un diff Git.

### Définition complète

```typescript
export interface CodeAnnotation {
  id: string;              // Identifiant unique
  type: CodeAnnotationType;  // Type d'annotation
  filePath: string;         // Chemin du fichier
  lineStart: number;        // Numéro de ligne de début
  lineEnd: number;          // Numéro de ligne de fin
  side: 'old' | 'new';     // Côté ('old' = lignes supprimées, 'new' = lignes ajoutées)
  text?: string;           // Contenu du commentaire
  suggestedCode?: string;    // Code suggéré (pour le type suggestion)
  createdAt: number;        // Horodatage de création
  author?: string;         // Identité du collaborateur
}
```

### Type CodeAnnotationType

```typescript
export type CodeAnnotationType =
  | 'comment'      // Commentaire ordinaire
  | 'suggestion'  // Suggestion de modification (doit fournir suggestedCode)
  | 'concern';     // Point de préoccupation (rappel de questions importantes)
```
### Description des champs

| Champ | Type | Requis | Description |
|--- | --- | --- | ---|
| `id` | string | ✅ | Identifiant unique |
| `type` | CodeAnnotationType | ✅ | Type d'annotation (comment/suggestion/concern) |
| `filePath` | string | ✅ | Chemin relatif du fichier annoté (ex: `src/auth.ts`) |
| `lineStart` | number | ✅ | Numéro de ligne de début (commence à 1) |
| `lineEnd` | number | ✅ | Numéro de ligne de fin (commence à 1) |
| `side` | 'old' \| 'new' | ✅ | Côté : `'old'` = lignes supprimées (ancienne version), `'new'` = lignes ajoutées (nouvelle version) |
| `text` | string | ❌ | Contenu du commentaire |
| `suggestedCode` | string | ❌ | Code suggéré (requis lorsque type est 'suggestion') |
| `createdAt` | number | ✅ | Horodatage de création (en millisecondes) |
| `author` | string | ❌ | Identifiant du collaborateur |

### Description du champ side

Le champ `side` correspond à la vue diff de la bibliothèque [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs) :

| Valeur side | Correspondance @pierre/diffs | Description |
|--- | --- | ---|
| `'old'` | `deletions` | Lignes supprimées (contenu de l'ancienne version) |
| `'new'` | `additions` | Lignes ajoutées (contenu de la nouvelle version) |

### Exemples

#### Commentaire ordinaire (lignes ajoutées)

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "Il faut gérer les cas d'erreur ici",
  createdAt: Date.now(),
}
```

#### Suggestion de modification (lignes supprimées)

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "Suggestion d'utiliser async/await",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```
## ShareableAnnotation (Annotation partageable)

`ShareableAnnotation` est un format d'annotation simplifié pour le partage par URL, représenté par des tuples de tableaux pour réduire la taille du payload.

### Définition complète

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [type, original, author, images]
  | ['R', string, string, string | null, string[]?]   // Replacement: [type, original, replacement, author, images]
  | ['C', string, string, string | null, string[]?]   // Comment: [type, original, comment, author, images]
  | ['I', string, string, string | null, string[]?]   // Insertion: [type, context, new text, author, images]
  | ['G', string, string | null, string[]?];          // Global Comment: [type, comment, author, images]
```

### Description des types

| Type | Premier caractère | Structure du tuple | Description |
|--- | --- | --- | ---|
| DELETION | `'D'` | `['D', original, author?, images?]` | Supprimer le contenu |
| REPLACEMENT | `'R'` | `['R', original, replacement, author?, images?]` | Remplacer le contenu |
| COMMENT | `'C'` | `['C', original, comment, author?, images?]` | Commenter le contenu |
| INSERTION | `'I'` | `['I', context, newText, author?, images?]` | Insérer le contenu |
| GLOBAL_COMMENT | `'G'` | `['G', comment, author?, images?]` | Commentaire global |
### Exemples

```typescript
// Suppression
['D', 'Contenu à supprimer', null, []]

// Remplacement
['R', 'Texte original', 'Remplacer par', null, ['/tmp/img.png']]

// Commentaire
['C', 'Ce code', 'Suggestion d\'optimisation', null, []]

// Insertion
['I', 'Contexte', 'Nouveau contenu à insérer', null, []]

// Commentaire global
['G', 'Excellent dans l\'ensemble', null, []]
```

::: tip Pourquoi utiliser un format simplifié ?
L'utilisation de tuples de tableaux plutôt que d'objets réduit la taille du payload, rendant l'URL compressée plus courte. Par exemple :
- Format objet : `{"type":"DELETION","originalText":"text"}` → 38 octets
- Format simplifié : `["D","text",null,[]]` → 18 octets
:::

## SharePayload (Payload de partage)

`SharePayload` est la structure de données complète pour le partage par URL, contenant le contenu du plan et les annotations.

### Définition complète

```typescript
export interface SharePayload {
  p: string;                  // Texte Markdown du plan
  a: ShareableAnnotation[];    // Tableau d'annotations (format simplifié)
  g?: string[];              // Chemins des pièces jointes globales (images)
}
```

### Description des champs

| Champ | Type | Requis | Description |
|--- | --- | --- | ---|
| `p` | string | ✅ | Contenu Markdown du plan original |
| `a` | ShareableAnnotation[] | ✅ | Tableau d'annotations (utilisant le format simplifié `ShareableAnnotation`) |
| `g` | string[] | ❌ | Chemins des pièces jointes globales (images non liées à une annotation spécifique) |

### Exemple

```typescript
{
  p: "# Plan d'implémentation\n\n1. Ajouter l'auth\n2. Ajouter l'UI",
  a: [
    ['C', 'Ajouter l'auth', 'Doit prendre en charge OAuth', null, []],
    ['G', 'Le plan global est clair', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```
## Frontmatter (Métadonnées préliminaires)

`Frontmatter` représente les métadonnées YAML en haut du fichier Markdown, utilisées pour stocker des informations supplémentaires.

### Définition complète

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### Exemple

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Plan d'implémentation (exemple)
...
```

Après analyse :

```typescript
{
  created: "2026-01-24T14:30:00.000Z",
  source: "plannotator",
  tags: ["authentication", "typescript"],
  author: "John Doe",
}
```

::: tip Utilisation des métadonnées préliminaires
Plannotator génère automatiquement le frontmatter lors de l'enregistrement du plan dans Obsidian, incluant l'heure de création, les balises source, etc., facilitant la gestion et la recherche des notes.
:::
## Types auxiliaires connexes

### EditorMode (Mode de l'éditeur)

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'` : Mode de sélection de texte
- `'comment'` : Mode de commentaire
- `'redline'` : Mode d'annotation en rouge

### DiffResult (Résultat de diff)

```typescript
export interface DiffResult {
  original: string;    // Contenu original
  modified: string;    // Contenu modifié
  diffText: string;    // Texte diff unifié
}
```

### DiffAnnotationMetadata (Métadonnées d'annotation de diff)

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // ID de l'annotation associée
  type: CodeAnnotationType;  // Type d'annotation
  text?: string;            // Contenu du commentaire
  suggestedCode?: string;   // Code suggéré
  author?: string;          // Auteur
}
```

### SelectedLineRange (Plage de lignes sélectionnée)

```typescript
export interface SelectedLineRange {
  start: number;                      // Numéro de ligne de début
  end: number;                        // Numéro de ligne de fin
  side: 'deletions' | 'additions';   // Côté (correspond à la vue diff de @pierre/diffs)
  endSide?: 'deletions' | 'additions'; // Côté de fin (pour la sélection entre côtés)
}
```

## Relations de transformation des données

### Annotation ↔ ShareableAnnotation

```typescript
// Complet → Simplifié
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// Simplifié → Complet
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info Perte de coordonnées
Les champs `blockId`, `startOffset` et `endOffset` de l'`Annotation` générée par `fromShareable` sont vides ou 0, nécessitant une restauration de la position précise par correspondance de texte ou web-highlighter.
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```
## Résumé de la leçon

Cette annexe a présenté tous les modèles de données principaux de Plannotator :

- **Annotation** : Annotations dans la révision de plan, prenant en charge les types suppression, insertion, remplacement et commentaire
- **Block** : Blocs de contenu après analyse Markdown, utilisés pour afficher le plan de manière structurée
- **CodeAnnotation** : Annotations au niveau des lignes dans la révision de code, prenant en charge les commentaires et les suggestions
- **ShareableAnnotation** : Format simplifié pour le partage par URL, réduisant la taille du payload
- **SharePayload** : Structure de données complète pour le partage par URL

Ces modèles de données sont largement utilisés dans les fonctions de révision de plan, de révision de code et de partage par URL. Les comprendre permet de personnaliser et d'étendre Plannotator en profondeur.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons **[Licence de Plannotator](../license/)**.
>
> Vous verrez :
> - Les clauses principales de la Business Source License 1.1 (BSL)
> - Les modes d'utilisation autorisés et les restrictions commerciales
> - Le calendrier de conversion vers Apache 2.0 en 2030
> - Comment obtenir une licence commerciale

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
| Interface Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| Énumération AnnotationType | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Interface Block | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| Interface CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| Type CodeAnnotationType | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| Type ShareableAnnotation | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| Interface SharePayload | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**Constantes clés** :
- Aucune

**Fonctions clés** :
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]` : Convertit les annotations complètes en format simplifié
- `fromShareable(data: ShareableAnnotation[]): Annotation[]` : Restaure le format simplifié en annotations complètes
- `parseMarkdownToBlocks(markdown: string): Block[]` : Analyse le Markdown en tableau de Blocks
- `exportDiff(blocks: Block[], annotations: Annotation[]): string` : Exporte les annotations au format Markdown

</details>
