---
title: "Spécifications des Tableaux: Conditions de Formatage | opencode-md-table-formatter"
sidebarTitle: "Résoudre l'erreur invalid structure"
subtitle: "Spécifications des Tableaux: Quels tableaux peuvent être formatés"
description: "Apprenez les 4 conditions valides pour les tableaux Markdown. Maîtrisez les tuyaux de début/fin de ligne, la syntaxe de ligne de séparation, la cohérence du nombre de colonnes, résolvez l'erreur invalid structure."
tags:
  - "Validation de tableau"
  - "Ligne de séparation"
  - "Cohérence des colonnes"
  - "Syntaxe d'alignement"
prerequisite:
  - "start-features"
order: 40
---

# Spécifications des Tableaux: Quels tableaux peuvent être formatés

::: info Ce que vous saurez faire
- Savoir quels tableaux peuvent être formatés par le plugin
- Comprendre les causes de l'erreur `invalid structure`
- Écrire des tableaux Markdown conformes aux spécifications
:::

## Votre situation actuelle

L'IA a généré un tableau, mais le plugin ne l'a pas formaté et a ajouté un commentaire à la fin:

```markdown
<!-- table not formatted: invalid structure -->
```

Qu'est-ce qu'une "structure invalide"? Pourquoi mon tableau ne fonctionne-t-il pas?

## Quand utiliser cette méthode

- Vous rencontrez l'erreur `invalid structure` et voulez savoir où est le problème
- Vous voulez vous assurer que les tableaux générés par l'IA peuvent être correctement formatés
- Vous voulez écrire manuellement un tableau Markdown conforme aux spécifications

## Idée centrale

Le plugin effectue trois niveaux de validation avant le formatage:

```
Niveau 1: Est-ce une ligne de tableau? → isTableRow()
Niveau 2: Y a-t-il une ligne de séparation? → isSeparatorRow()
Niveau 3: La structure est-elle valide? → isValidTable()
```

Seuls les tableaux qui passent les trois niveaux seront formatés. Si un niveau échoue, le tableau reste inchangé et un commentaire d'erreur est ajouté.

## Les 4 conditions d'un tableau valide

### Condition 1: Chaque ligne doit commencer et finir par `|`

C'est l'exigence la plus basique. Chaque ligne d'un tableau Markdown avec tuyaux (Pipe Table) doit être entourée de `|`.

```markdown
✅ Correct
| Nom | Description |

❌ Incorrect
Nom | Description      ← Pas de | au début
| Nom | Description     ← Pas de | à la fin
```

::: details Implémentation du code source
```typescript
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```
Emplacement du code source: `index.ts:58-61`
:::

### Condition 2: Chaque ligne doit avoir au moins 2 séparateurs

`split("|").length > 2` signifie qu'il doit y avoir au moins 2 `|` pour séparer le contenu.

```markdown
✅ Correct (3 |, 2 séparateurs)
| Nom | Description |

❌ Incorrect (seulement 2 |, 1 séparateur)
| Nom |
```

En d'autres termes, **un tableau à une seule colonne est valide**, mais doit être écrit sous la forme `| contenu |`.

### Condition 3: Il doit y avoir une ligne de séparation

La ligne de séparation est celle entre l'en-tête et les lignes de données, utilisée pour définir l'alignement.

```markdown
| Nom | Description |
| --- | --- |      ← C'est la ligne de séparation
| Valeur1 | Valeur2 |
```

**Règles de syntaxe de la ligne de séparation**:

Chaque cellule doit correspondre à l'expression régulière `/^\s*:?-+:?\s*$/`, ce qui signifie en langage humain:

| Composant | Signification | Exemple |
|--- | --- | ---|
| `\s*` | Espace blanc optionnel | Permet `| --- |` ou `|---|` |
| `:?` | Deux-points optionnels | Pour spécifier l'alignement |
| `-+` | Au moins un tiret | `-`, `---`, `------` sont tous valides |

**Exemples de lignes de séparation valides**:

```markdown
| --- | --- |           ← Forme la plus simple
| :--- | ---: |         ← Avec marqueurs d'alignement
| :---: | :---: |       ← Alignement centré
|---|---|               ← Sans espaces aussi valide
| -------- | -------- | ← Tirets longs aussi valides
```

**Exemples de lignes de séparation invalides**:

```markdown
| === | === |           ← Utilisation de signes égal, pas de tirets
| - - | - - |           ← Espaces entre les tirets
| ::: | ::: |           ← Seulement des deux-points, pas de tirets
```

::: details Implémentation du code source
```typescript
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false
  const cells = trimmed.split("|").slice(1, -1)
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))
}
```
Emplacement du code source: `index.ts:63-68`
:::

### Condition 4: Toutes les lignes doivent avoir le même nombre de colonnes

Si la première ligne a 3 colonnes, chaque ligne suivante doit également avoir 3 colonnes.

```markdown
✅ Correct (chaque ligne a 3 colonnes)
| A | B | C |
|--- | --- | ---|
| 1 | 2 | 3 |

❌ Incorrect (la troisième ligne n'a que 2 colonnes)
| A | B | C |
|--- | --- | ---|
| 1 | 2 |
```

::: details Implémentation du code source
```typescript
function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false

  const rows = lines.map((line) =>
    line.split("|").slice(1, -1).map((cell) => cell.trim()),
  )

  if (rows.length === 0 || rows[0].length === 0) return false

  const firstRowCellCount = rows[0].length
  const allSameColumnCount = rows.every((row) => row.length === firstRowCellCount)
  if (!allSameColumnCount) return false

  const hasSeparator = lines.some((line) => isSeparatorRow(line))
  return hasSeparator
}
```
Emplacement du code source: `index.ts:70-88`
:::

## Référence rapide de la syntaxe d'alignement

La ligne de séparation sert non seulement à séparer, mais aussi à spécifier l'alignement:

| Syntaxe | Alignement | Effet |
|--- | --- | ---|
| `---` ou `:---` | Aligné à gauche | Texte à gauche (par défaut) |
| `:---:` | Centré | Texte centré |
| `---:` | Aligné à droite | Texte à droite |

**Exemple**:

```markdown
| Aligné à gauche | Centré | Aligné à droite |
|--- | --- | ---|
| Texte | Texte | Texte |
```

Après formatage:

```markdown
| Aligné à gauche |  Centré  | Aligné à droite |
|--- | --- | ---|
| Texte           |  Texte   |            Texte |
```

::: details Implémentation du code source
```typescript
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"
}
```
Emplacement du code source: `index.ts:141-149`
:::

## Dépannage des erreurs courantes

| Symptôme d'erreur | Cause possible | Solution |
|--- | --- | ---|
| `invalid structure` | Ligne de séparation manquante | Ajoutez `\| --- \| --- \|` après l'en-tête |
| `invalid structure` | Nombre de colonnes incohérent | Vérifiez que chaque ligne a le même nombre de `\|` |
| `invalid structure` | `\|` manquant au début/à la fin de la ligne | Ajoutez les `\|` manquants |
| Tableau non détecté | Seulement 1 colonne | Assurez-vous d'avoir au moins 2 séparateurs `\|` |
| Alignement non appliqué | Erreur de syntaxe de ligne de séparation | Vérifiez que vous utilisez `-` et non d'autres caractères |

## Points de vérification

Après avoir terminé cette leçon, vous devriez pouvoir répondre:

- [ ] Quelles conditions une ligne de tableau doit-elle remplir? (Réponse: Commencer et finir par `|`, au moins 2 séparateurs)
- [ ] Que signifie l'expression régulière de la ligne de séparation? (Réponse: Deux-points optionnels + au moins un tiret + deux-points optionnels)
- [ ] Pourquoi l'erreur `invalid structure` apparaît-elle? (Réponse: Ligne de séparation manquante, nombre de colonnes incohérent, ou `|` manquant au début/à la fin de la ligne)
- [ ] Que signifie `:---:`? (Réponse: Alignement centré)

## Résumé de la leçon

| Condition | Exigence |
|--- | ---|
| Début et fin de ligne | Doit commencer et finir par `\|` |
| Nombre de séparateurs | Au moins 2 `\|` |
| Ligne de séparation | Obligatoire, format `:?-+:?` |
| Cohérence des colonnes | Toutes les lignes doivent avoir le même nombre de colonnes |

**Mnemonic**:

> Tuyaux des deux côtés, tirets dans la ligne de séparation, colonnes cohérentes indispensables, quatre règles à retenir.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Détails de l'alignement](../alignment/)**.
>
> Vous apprendrez:
> - L'utilisation détaillée des trois méthodes d'alignement
> - Le principe d'implémentation du formatage des lignes de séparation
> - L'algorithme de remplissage des cellules

---

## Annexe: Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour: 2026-01-26

| Fonction | Chemin du fichier | Numéro de ligne |
|--- | --- | ---|
| Détection de ligne de tableau | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Détection de ligne de séparation | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| Validation de tableau | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Analyse de l'alignement | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Gestion des tableaux invalides | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**Expressions régulières clés**:
- `/^\s*:?-+:?\s*$/`: Règle de correspondance des cellules de ligne de séparation

**Fonctions clés**:
- `isTableRow()`: Détermine si c'est une ligne de tableau
- `isSeparatorRow()`: Détermine si c'est une ligne de séparation
- `isValidTable()`: Vérifie si la structure du tableau est valide
- `getAlignment()`: Analyse la méthode d'alignement

</details>
