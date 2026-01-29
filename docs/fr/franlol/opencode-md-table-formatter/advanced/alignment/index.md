---
title: "Alignement : Mise en page des tableaux Markdown | opencode-md-table-formatter"
subtitle: "Alignement : Mise en page des tableaux Markdown | opencode-md-table-formatter"
sidebarTitle: "Améliorer l'alignement des tableaux"
description: "Apprenez les trois modes d'alignement et la syntaxe de la ligne de séparation des tableaux Markdown. Maîtrisez l'algorithme d'alignement pour que les tableaux générés par l'IA soient esthétiques et bien organisés."
tags:
  - "Alignement à gauche"
  - "Alignement centré"
  - "Alignement à droite"
  - "Syntaxe de ligne de séparation"
prerequisite:
  - "advanced-table-spec"
order: 50
---

# Explication détaillée de l'alignement : gauche, centre, droite

::: info Ce que vous pourrez faire après ce cours
- Maîtriser la syntaxe et les effets des trois modes d'alignement
- Comprendre comment la ligne de séparation spécifie le mode d'alignement
- Comprendre le principe de fonctionnement de l'algorithme de remplissage des cellules
- Savoir pourquoi la ligne de séparation ajuste automatiquement sa largeur
:::

## Votre problème actuel

L'IA a généré un tableau, mais l'alignement des colonnes n'est pas très esthétique :

```markdown
| 名称 | 类型 | 描述 |
|--- | --- | ---|
| 用户 | string | 用户名 |
| 年龄 | number | 年龄 |
| is_active | boolean | 是否激活 |
```

Vous souhaitez centrer certaines colonnes ou les aligner à droite pour rendre le tableau plus lisible, mais vous ne savez pas comment le spécifier.

## Quand utiliser cette technique

- Vous souhaitez centrer certaines colonnes du tableau (par exemple, statuts, étiquettes)
- Vous souhaitez aligner les colonnes numériques à droite (facilite la comparaison des valeurs)
- Vous souhaitez aligner les colonnes de texte à gauche (comportement par défaut)
- Vous souhaitez comprendre le principe de mise en œuvre de l'alignement

## Idée clé : la ligne de séparation détermine le mode d'alignement

Le mode d'alignement des tableaux Markdown n'est pas spécifié dans chaque ligne, mais est défini de manière unifiée par la **ligne de séparation**.

La syntaxe de la ligne de séparation est : `:?-+:?` (deux-points + tiret + deux-points)

| Position des deux-points | Mode d'alignement | Exemple |
|--- | --- | ---|
| Des deux côtés | Centré | `:---:` |
| Seulement à droite | Aligné à droite | `---:` |
| Aucun | Aligné à gauche | `---` ou `:---` |

Chaque cellule de la ligne de séparation correspond au mode d'alignement d'une colonne. Le plugin formatera toute la colonne selon cette règle.

## Suivez les étapes : trois modes d'alignement

### Étape 1 : Alignement à gauche (par défaut)

**Pourquoi**

L'alignement à gauche est le comportement par défaut des tableaux, adapté aux données textuelles.

**Syntaxe**

```markdown
| 名称 | 描述 |
|--- | --- | ---|
| 用户 | 用户名 |
```

**Ce que vous devriez voir**

```markdown
| 名称   | 描述   |
|--- | ---|
| 用户   | 用户名 |
```

La ligne de séparation s'affichera comme `:---` (marqueur d'alignement à gauche), le texte est aligné à gauche.

**Implémentation du code source**

```typescript
// Fonction getAlignment : analyse le mode d'alignement
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"  // Retourne left par défaut
}
```

Emplacement du code source : `index.ts:141-149`

**Explication de la logique**

- Des deux-points des deux côtés (`:---:`) → Retourne `"center"`
- Seulement un deux-points à droite (`---:`) → Retourne `"right"`
- Autres cas (`---` ou `:---`) → Retourne `"left"` (par défaut)

### Étape 2 : Alignement centré

**Pourquoi**

Le centrage convient aux étiquettes de statut, aux textes courts, aux titres et autres contenus nécessitant un centrage visuel.

**Syntaxe**

```markdown
| 名称 | 状态 | 描述 |
|--- | --- | --- | ---|
| 用户 | 激活 | 用户名 |
```

**Ce que vous devriez voir**

```markdown
| 名称   |  状态  | 描述   |
|--- | --- | ---|
| 用户   |  激活  | 用户名 |
```

Le "激活" de la colonne du milieu s'affichera centré, la ligne de séparation s'affichera comme `:---:` (marqueur de centrage).

**Principe de formatage de la ligne de séparation**

Le formatage des cellules de la ligne de séparation est géré par la fonction `formatSeparatorCell` :

```typescript
function formatSeparatorCell(width: number, align: "left" | "center" | "right"): string {
  if (align === "center") return ":" + "-".repeat(Math.max(1, width - 2)) + ":"
  if (align === "right") return "-".repeat(Math.max(1, width - 1)) + ":"
  return "-".repeat(width)
}
```

Emplacement du code source : `index.ts:213-217`

**Principe mathématique de l'alignement centré**

Le format de la ligne de séparation centrée est : `:` + tiret + `:`

| Largeur cible | Formule de calcul | Résultat |
|--- | --- | ---|
| 3 | `:` + `-`*1 + `:` | `:-:` |
| 5 | `:` + `-`*3 + `:` | `:---:` |
| 10 | `:` + `-`*8 + `:` | `:--------:` |

`Math.max(1, width - 2)` garantit qu'au moins 1 tiret est conservé, évitant que la largeur 2 ne devienne `::` (sans effet de séparation).

### Étape 3 : Alignement à droite

**Pourquoi**

L'alignement à droite convient aux données numériques, aux montants, aux dates et autres données nécessitant une comparaison de droite à gauche.

**Syntaxe**

```markdown
| 名称 | 价格 | 数量 |
|--- | --- | --- | ---|
| 商品 | 99.9 | 100 |
```

**Ce que vous devriez voir**

```markdown
| 名称   | 价格 | 数量 |
|--- | --- | ---|
| 商品   |  99.9 |  100 |
```

Les nombres sont alignés à droite, facilitant la comparaison des valeurs.

**Principe mathématique de l'alignement à droite**

Le format de la ligne de séparation alignée à droite est : tiret + `:`

| Largeur cible | Formule de calcul | Résultat |
|--- | --- | ---|
| 3 | `-`*2 + `:` | `--:` |
| 5 | `-`*4 + `:` | `----:` |
| 10 | `-`*9 + `:` | `---------:` |

`Math.max(1, width - 1)` garantit qu'au moins 1 tiret est conservé.

## Algorithme de remplissage des cellules

Comment le plugin décide du nombre d'espaces à remplir de chaque côté de la cellule ? La réponse se trouve dans la fonction `padCell`.

**Implémentation du code source**

```typescript
function padCell(text: string, width: number, align: "left" | "center" | "right"): string {
  const displayWidth = calculateDisplayWidth(text)  // Calculer la largeur d'affichage
  const totalPadding = Math.max(0, width - displayWidth)

  if (align === "center") {
    const leftPad = Math.floor(totalPadding / 2)
    const rightPad = totalPadding - leftPad
    return " ".repeat(leftPad) + text + " ".repeat(rightPad)
  } else if (align === "right") {
    return " ".repeat(totalPadding) + text
  } else {
    return text + " ".repeat(totalPadding)
  }
}
```

Emplacement du code source : `index.ts:198-211`

**Règles de remplissage**

| Mode d'alignement | Remplissage gauche | Remplissage droite | Exemple (largeur cible 10, texte "abc") |
|--- | --- | --- | ---|
| Alignement à gauche | 0 | totalPadding | `abc       ` |
| Centré | floor(total/2) | total - floor(total/2) | `   abc    ` |
| Alignement à droite | totalPadding | 0 | `       abc` |

**Détails mathématiques de l'alignement centré**

`Math.floor(totalPadding / 2)` garantit que le remplissage gauche est un entier, l'espace supplémentaire est ajouté à droite.

| Largeur cible | Largeur du texte | totalPadding | Remplissage gauche | Remplissage droite | Résultat |
|--- | --- | --- | --- | --- | ---|
| 10 | 3 | 7 | 3 (7÷2=3.5→3) | 4 (7-3) | `   abc    ` |
| 11 | 3 | 8 | 4 (8÷2=4) | 4 (8-4) | `    abc    ` |
| 12 | 3 | 9 | 4 (9÷2=4.5→4) | 5 (9-4) | `    abc     ` |

## Exemple complet

**Tableau d'entrée** (spécifiant différents modes d'alignement pour les colonnes) :

```markdown
| 名称 | 状态 | 价格 | 描述 |
|--- | --- | --- | ---|
| 商品A | 激活 | 99.9 | 这是一个商品 |
| 商品B | 停用 | 199.0 | 这是另一个商品 |
```

**Résultat formaté** :

```markdown
| 名称   |  状态  | 价格 | 描述         |
|--- | --- | --- | ---|
| 商品A  |  激活  |  99.9 | 这是一个商品 |
| 商品B  |  停用  | 199.0 | 这是另一个商品 |
```

**Mode d'alignement de chaque colonne** :

| Nom de la colonne | Syntaxe de la ligne de séparation | Mode d'alignement | Explication |
|--- | --- | --- | ---|
| 名称 | `:---` | Alignement à gauche | Texte aligné à gauche |
| 状态 | `:---:` | Centré | Texte centré |
| 价格 | `---:` | Alignement à droite | Nombres alignés à droite |
| 描述 | `:---` | Alignement à gauche | Texte aligné à gauche |

## Point de contrôle

Après avoir terminé ce cours, vous devriez pouvoir répondre :

- [ ] Comment spécifier l'alignement centré ? (Réponse : utiliser `:---:` dans la ligne de séparation)
- [ ] Comment spécifier l'alignement à droite ? (Réponse : utiliser `---:` dans la ligne de séparation)
- [ ] Quelle est la syntaxe par défaut pour l'alignement à gauche ? (Réponse : `---` ou `:---`)
- [ ] Pourquoi l'alignement centré utilise-t-il `Math.floor(totalPadding / 2)` ? (Réponse : pour garantir que le remplissage gauche est un entier, l'espace supplémentaire est ajouté à droite)
- [ ] Que signifie `:---:` dans la ligne de séparation ? (Réponse : marqueur d'alignement centré, un deux-points de chaque côté, des tirets au milieu)

## Attention aux pièges

::: warning Malentendus courants
**Malentendu** : chaque ligne doit spécifier le mode d'alignement

**Réalité** : non. Seule la ligne de séparation spécifie le mode d'alignement, les lignes de données sont automatiquement alignées par colonne.

La ligne de séparation est la "configuration", les lignes de données sont le "contenu", une seule ligne de configuration suffit.
:::

::: danger À retenir
La position des deux-points dans la ligne de séparation **doit** correspondre aux colonnes.

| Exemple erroné | Problème |
|--- | ---|
| `| :--- | --- |` | Première colonne centrée, deuxième colonne alignée à gauche (2 colonnes) |
| `| :--- | ---: | :--- |` | Première colonne alignée à gauche, deuxième colonne alignée à droite, troisième colonne alignée à gauche (3 colonnes) |

Le nombre de colonnes de la ligne de séparation doit correspondre au nombre de colonnes de l'en-tête et des lignes de données !
:::

## Résumé du cours

| Mode d'alignement | Syntaxe de la ligne de séparation | Scénario d'utilisation |
|--- | --- | ---|
| Alignement à gauche | `---` ou `:---` | Texte, données descriptives (par défaut) |
| Centré | `:---:` | Étiquettes de statut, textes courts, titres |
| Alignement à droite | `---:` | Nombres, montants, dates |

**Fonctions clés** :

| Fonction | Rôle | Emplacement du code source |
|--- | --- | ---|
| `getAlignment()` | Analyse le mode d'alignement des cellules de la ligne de séparation | 141-149 |
| `padCell()` | Remplit les cellules à la largeur spécifiée | 198-211 |
| `formatSeparatorCell()` | Formate les cellules de la ligne de séparation | 213-217 |

**Mnémo** :

> Deux-points des deux côtés pour centrer, deux-points à droite pour aligner à droite,
> Pas de deux-points par défaut à gauche, la ligne de séparation définit les règles.

## Prochain cours

> Le prochain cours porte sur **[Questions fréquentes : que faire si le tableau n'est pas formaté](../../faq/troubleshooting/)**.
>
> Vous apprendrez :
> - Comment localiser rapidement les erreurs `invalid structure`
> - Méthodes de dépannage des erreurs de configuration
> - Solutions aux problèmes courants de tableaux

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
| Analyse du mode d'alignement | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Remplissage des cellules | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L198-L211) | 198-211 |
| Formatage de la ligne de séparation | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L213-L217) | 213-217 |
| Application du mode d'alignement | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L107-L113) | 107-113 |

**Fonctions clés** :
- `getAlignment(delimiterCell: string)` : analyse le mode d'alignement des cellules de la ligne de séparation
  - Retourne `"left"` | `"center"` | `"right"`
  - Logique : deux-points des deux côtés → centré, seulement deux-points à droite → aligné à droite, autre → aligné à gauche

- `padCell(text, width, align)` : remplit les cellules à la largeur spécifiée
  - Calcule la différence entre la largeur d'affichage et la largeur cible
  - Distribue le remplissage gauche et droite selon le mode d'alignement
  - Utilise `Math.floor(totalPadding / 2)` pour garantir que le remplissage gauche est un entier

- `formatSeparatorCell(width, align)` : formate les cellules de la ligne de séparation
  - Centré : `:` + `-`*(width-2) + `:`
  - Aligné à droite : `-`*(width-1) + `:`
  - Aligné à gauche : `-`*width
  - Utilise `Math.max(1, ...)` pour garantir qu'au moins 1 tiret est conservé

</details>
