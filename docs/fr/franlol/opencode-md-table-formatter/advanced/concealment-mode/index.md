---
title: "Mode de masquage : Principe du calcul de la largeur | opencode-md-table-formatter"
sidebarTitle: "Trois étapes du calcul de la largeur"
subtitle: "Principe du mode de masquage : pourquoi le calcul de la largeur est si important"
description: "Apprenez le fonctionnement du mode de masquage OpenCode. Maîtrisez la méthode de calcul de la largeur d'affichage du plugin, comprenez la suppression des symboles Markdown, la protection des blocs de code et l'utilisation de Bun.stringWidth."
tags:
  - "mode de masquage"
  - "calcul de la largeur d'affichage"
  - "suppression des symboles Markdown"
  - "Bun.stringWidth"
prerequisite:
  - "start-features"
order: 30
---

# Principe du mode de masquage : pourquoi le calcul de la largeur est si important

::: info Ce que vous apprendrez
- Comprendre le fonctionnement du mode de masquage OpenCode
- Savoir pourquoi les outils de formatage ordinaires provoquent un désalignement en mode de masquage
- Maîtriser l'algorithme de calcul de la largeur du plugin (trois étapes)
- Comprendre le rôle de `Bun.stringWidth`
:::

## Votre problème actuel

Vous écrivez du code avec OpenCode, l'IA génère un joli tableau :

```markdown
| 字段 | 类型 | 说明 |
|--- | --- | ---|
| **name** | string | 用户名 |
| age | number | 年龄 |
```

Dans la vue du code source, il semble bien aligné. Mais en passant en mode aperçu, le tableau est désaligné :

```
| 字段     | 类型   | 说明   |
|--- | --- | ---|
| name | string | 用户名 |    ← Pourquoi c'est plus court ?
| age      | number | 年龄   |
```

Où est le problème ? **Le mode de masquage**.

## Qu'est-ce que le mode de masquage

OpenCode active par défaut le **mode de masquage (Concealment Mode)**, qui masque les symboles de syntaxe Markdown lors du rendu :

| Code source | Affichage en mode de masquage |
|--- | ---|
| `**粗体**` | 粗体（4 个字符） |
| `*斜体*` | 斜体（4 个字符） |
| `~~删除线~~` | 删除线（6 个字符） |
| `` `代码` `` | `代码`（4 个字符 + 背景色） |

::: tip Avantages du mode de masquage
Permet de vous concentrer sur le contenu lui-même, sans être distrait par une multitude de symboles `**`, `*`.
:::

## Pourquoi les outils de formatage ordinaires ont-ils des problèmes

Les outils de formatage de tableaux ordinaires calculent la largeur en considérant `**name**` comme 8 caractères :

```
** n a m e ** = 8 caractères
```

Mais en mode de masquage, l'utilisateur voit `name`, seulement 4 caractères.

Le résultat est : l'outil de formatage aligne selon 8 caractères, l'utilisateur voit 4 caractères, le tableau est naturellement désaligné.

## Idée principale : calculer la « largeur d'affichage » et non la « longueur des caractères »

L'idée principale de ce plugin est : **calculer la largeur que l'utilisateur voit réellement, et non le nombre de caractères du code source**.

L'algorithme se déroule en trois étapes :

```
Étape 1 : Protéger les blocs de code (les symboles dans les blocs de code ne sont pas supprimés)
Étape 2 : Supprimer les symboles Markdown (**, *, ~~, etc.)
Étape 3 : Utiliser Bun.stringWidth pour calculer la largeur finale
```

## Suivez-moi : comprendre l'algorithme en trois étapes

### Étape 1 : Protéger les blocs de code

**Pourquoi**

Les symboles Markdown dans le code en ligne (entre backticks) sont des « littéraux », l'utilisateur voit ces 8 caractères `**bold**`, et non les 4 caractères `bold`.

Donc avant de supprimer les symboles Markdown, il faut d'abord « cacher » le contenu des blocs de code.

**Implémentation du code source**

```typescript
// Étape 1 : Extraire et protéger le code en ligne
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})
```

**Fonctionnement**

| Entrée | Après traitement | Tableau codeBlocks |
|--- | --- | ---|
| `` `**bold**` `` | `\x00CODE0\x00` | `["**bold**"]` |
| `` `a` and `b` `` | `\x00CODE0\x00 and \x00CODE1\x00` | `["a", "b"]` |

En remplaçant les blocs de code par des espaces réservés spéciaux comme `\x00CODE0\x00`, ils ne seront pas affectés lors de la suppression des symboles Markdown.

### Étape 2 : Supprimer les symboles Markdown

**Pourquoi**

En mode de masquage, `**粗体**` s'affiche comme `粗体`, `*斜体*` s'affiche comme `斜体`. Lors du calcul de la largeur, il faut supprimer ces symboles.

**Implémentation du code source**

```typescript
// Étape 2 : Supprimer les symboles Markdown des parties non-code
let visualText = textWithPlaceholders
let previousText = ""

while (visualText !== previousText) {
  previousText = visualText
  visualText = visualText
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***粗斜体*** → 文本
    .replace(/\*\*(.+?)\*\*/g, "$1")     // **粗体** → 粗体
    .replace(/\*(.+?)\*/g, "$1")         // *斜体* → 斜体
    .replace(/~~(.+?)~~/g, "$1")         // ~~删除线~~ → 删除线
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")     // ![alt](url) → alt
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)") // [text](url) → text (url)
}
```

**Pourquoi utiliser une boucle while ?**

Pour traiter la syntaxe imbriquée. Par exemple `***粗斜体***` :

```
Tour 1 : ***粗斜体*** → **粗斜体**（suppression de la couche externe ***）
Tour 2 : **粗斜体** → *粗斜体*（suppression de **）
Tour 3 : *粗斜体* → 粗斜体（suppression de *）
Tour 4 : 粗斜体 = 粗斜体（pas de changement, sortie de la boucle）
```

::: details Traitement des images et des liens
- **Images** `![alt](url)` : OpenCode affiche uniquement le texte alt, donc remplacé par `alt`
- **Liens** `[text](url)` : Affiché comme `text (url)`, conserve les informations de l'URL
:::

### Étape 3 : Restaurer les blocs de code + calculer la largeur

**Pourquoi**

Le contenu des blocs de code doit être remis en place, puis utiliser `Bun.stringWidth` pour calculer la largeur d'affichage finale.

**Implémentation du code source**

```typescript
// Étape 3 : Restaurer le contenu des blocs de code
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})

return Bun.stringWidth(visualText)
```

**Pourquoi utiliser Bun.stringWidth ?**

`Bun.stringWidth` peut calculer correctement :

| Type de caractère | Exemple | Nombre de caractères | Largeur d'affichage |
|--- | --- | --- | ---|
| ASCII | `abc` | 3 | 3 |
| Chinois | `你好` | 2 | 4（chaque caractère occupe 2 cases） |
| Emoji | `😀` | 1 | 2（occupe 2 cases） |
| Caractère de largeur nulle | `a\u200Bb` | 3 | 2（les caractères de largeur nulle n'occupent pas d'espace） |

Le `text.length` ordinaire ne peut que compter le nombre de caractères, incapable de traiter ces cas particuliers.

## Exemple complet

Supposons que le contenu de la cellule est :`` **`code`** and *text* ``

**Étape 1 : Protéger les blocs de code**

```
Entrée : **`code`** and *text*
Sortie : **\x00CODE0\x00** and *text*
codeBlocks = ["code"]
```

**Étape 2 : Supprimer les symboles Markdown**

```
Tour 1 : **\x00CODE0\x00** and *text* → \x00CODE0\x00 and text
Tour 2 : Pas de changement, sortie
```

**Étape 3 : Restaurer les blocs de code + calculer la largeur**

```
Après restauration : code and text
Largeur : Bun.stringWidth("code and text") = 13
```

Finalement, le plugin aligne cette cellule selon une largeur de 13 caractères, et non les 22 caractères du code source.

## Point de contrôle

Après avoir terminé cette leçon, vous devriez pouvoir répondre :

- [ ] Quels symboles sont masqués par le mode de masquage ? (Réponse : Symboles de syntaxe Markdown comme `**`, `*`, `~~`, etc.)
- [ ] Pourquoi faut-il d'abord protéger les blocs de code ? (Réponse : Les symboles dans les blocs de code sont des littéraux et ne doivent pas être supprimés)
- [ ] Pourquoi utiliser une boucle while pour supprimer les symboles ? (Réponse : Pour traiter la syntaxe imbriquée, comme `***粗斜体***`)
- [ ] En quoi `Bun.stringWidth` est-il meilleur que `text.length` ? (Réponse : Peut calculer correctement la largeur d'affichage des caractères chinois, emoji, caractères de largeur nulle)

## Attention aux pièges

::: warning Malentendus courants
**Malentendu** : Les `**` dans les blocs de code seront également supprimés

**Réalité** : Non. Le protège d'abord le contenu des blocs de code avec des espaces réservés, puis restaure le contenu après avoir supprimé les symboles des autres parties.

Donc la largeur de `` `**bold**` `` est 8（`**bold**`）, et non 4（`bold`）。
:::

## Résumé de la leçon

| Étape | Rôle | Code clé |
|--- | --- | ---|
| Protéger les blocs de code | Empêcher la suppression accidentelle des symboles dans les blocs de code | `text.replace(/\`(.+?)\`/g, ...)` |
| Supprimer Markdown | Calculer le contenu d'affichage réel en mode de masquage | Remplacements regex multi-tours |
| Calculer la largeur | Traiter les caractères spéciaux comme le chinois, les emoji | `Bun.stringWidth()` |

## Prochain cours

> Dans le prochain cours, nous apprendrons **[Spécifications des tableaux](../table-spec/)**。
>
> Vous apprendrez :
> - Quels types de tableaux peuvent être formatés
> - Les 4 règles de validation des tableaux
> - Comment éviter les erreurs de « tableau invalide »

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
| Point d'entrée du calcul de la largeur d'affichage | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L151-L159) | 151-159 |
| Protection des blocs de code | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |
| Suppression des symboles Markdown | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L175-L188) | 175-188 |
| Restauration des blocs de code | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L190-L193) | 190-193 |
| Appel de Bun.stringWidth | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L195) | 195 |

**Fonctions clés** :
- `calculateDisplayWidth()` : Point d'entrée du calcul de la largeur avec cache
- `getStringWidth()` : Algorithme principal, supprime les symboles Markdown et calcule la largeur d'affichage

**Constantes clés** :
- `\x00CODE{n}\x00` : Format de l'espace réservé pour les blocs de code

</details>
