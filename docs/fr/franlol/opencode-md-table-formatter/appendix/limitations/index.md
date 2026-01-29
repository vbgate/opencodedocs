---
title: "Limitations connues : tableaux HTML non pris en charge | opencode-md-table-formatter"
sidebarTitle: "Que faire si le formatage échoue"
subtitle: "Limitations connues : tableaux HTML non pris en charge"
description: "Découvrez les limites techniques d'opencode-md-table-formatter, y compris la non prise en charge des tableaux HTML et des cellules multilignes. Évitez d'utiliser le plugin dans des scénarios non pris en charge pour améliorer votre efficacité."
tags:
  - "Limitations connues"
  - "Tableaux HTML"
  - "Cellules multilignes"
  - "Tableaux sans séparateur"
prerequisite:
  - "start-features"
order: 70
---

# Limitations connues : quelles sont les frontières du plugin

::: info Ce que vous saurez faire après ce cours
- Connaître les types de tableaux non pris en charge par le plugin
- Éviter d'utiliser le plugin dans des scénarios non pris en charge
- Comprendre les limites techniques et les choix de conception du plugin
:::

## Idée centrale

Ce plugin se concentre sur un seul objectif : **optimiser le formatage des tableaux Markdown avec pipes pour le mode caché d'OpenCode**.

Pour ce faire, nous avons volontairement limité certaines fonctionnalités afin d'assurer la fiabilité et les performances des scénarios principaux.

## Aperçu des limitations connues

| Limitation | Description | Prise en charge prévue |
| --- | --- | --- |
| **Tableaux HTML** | Uniquement les tableaux Markdown avec pipes (`\| ... \|`) | ❌ Non pris en charge |
| **Cellules multilignes** | Les cellules ne peuvent pas contenir de balises de saut de ligne comme `<br>` | ❌ Non pris en charge |
| **Tableaux sans séparateur** | Doit avoir une ligne de séparation `|---|` | ❌ Non pris en charge |
| **Fusion de cellules** | Pas de fusion de lignes ou de colonnes | ❌ Non pris en charge |
| **Tableaux sans en-tête** | La ligne de séparation est considérée comme l'en-tête, impossible de créer des tableaux sans en-tête | ❌ Non pris en charge |
| **Options de configuration** | Impossible de personnaliser la largeur des colonnes, désactiver des fonctionnalités, etc. | 🤔 Peut-être à l'avenir |
| **Très grands tableaux** | Performance non vérifiée pour les tableaux de 100+ lignes | 🤔 Optimisation future |

---

## Explication détaillée des limitations

### 1. Tableaux HTML non pris en charge

**Phénomène**

```html
<!-- Ce tableau ne sera pas formaté -->
<table>
  <tr>
    <th>Colonne 1</th>
    <th>Colonne 2</th>
  </tr>
  <tr>
    <td>Donnée 1</td>
    <td>Donnée 2</td>
  </tr>
</table>
```

**Raison**

Le plugin ne traite que les tableaux Markdown avec pipes (Pipe Table), c'est-à-dire le format séparé par `|` :

```markdown
| Colonne 1 | Colonne 2 |
| --- | --- |
| Donnée 1 | Donnée 2 |
```

**Source du code**

```typescript
// index.ts:58-61
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```

La logique de détection ne correspond qu'aux lignes commençant et se terminant par `|`, les tableaux HTML sont directement ignorés.

**Solution alternative**

Si vous devez formater des tableaux HTML, nous vous recommandons :
- D'utiliser d'autres outils de formatage HTML spécialisés
- De convertir les tableaux HTML en tableaux Markdown avec pipes

---

### 2. Cellules multilignes non prises en charge

**Phénomène**

```markdown
| Colonne 1 | Colonne 2 |
| --- | --- |
| Ligne 1<br>Ligne 2 | Une seule ligne |
```

Vous verrez le commentaire `<!-- table not formatted: invalid structure -->` lors de la sortie.

**Raison**

Le plugin traite les tableaux ligne par ligne et ne prend pas en charge les sauts de ligne dans les cellules.

**Source du code**

```typescript
// index.ts:25-56
function formatMarkdownTables(text: string): string {
  const lines = text.split("\n")
  // ... analyse ligne par ligne, pas de logique de fusion de plusieurs lignes
}
```

**Solution alternative**

- Divisez le contenu multiligne en plusieurs lignes de données
- Ou acceptez que le tableau s'élargisse pour afficher le contenu sur une seule ligne

---

### 3. Tableaux sans séparateur non pris en charge

**Phénomène**

```markdown
<!-- Ligne de séparation manquante -->
| Colonne 1 | Colonne 2 |
| Donnée 1 | Donnée 2 |
| Donnée 3 | Donnée 4 |
```

Vous verrez le commentaire `<!-- table not formatted: invalid structure -->`.

**Raison**

Les tableaux Markdown avec pipes doivent contenir une ligne de séparation (Separator Row), utilisée pour définir le nombre de colonnes et l'alignement.

**Source du code**

```typescript
// index.ts:86-87
const hasSeparator = lines.some((line) => isSeparatorRow(line))
return hasSeparator  // Renvoie false si pas de séparateur
```

**Écriture correcte**

```markdown
| Colonne 1 | Colonne 2 |
| --- | --- |  ← Ligne de séparation
| Donnée 1 | Donnée 2 |
| Donnée 3 | Donnée 4 |
```

---

### 4. Fusion de cellules non prise en charge

**Phénomène**

```markdown
| Colonne 1 | Colonne 2 |
| --- | --- |
| Fusionner deux colonnes |  ← Attendu pour couvrir les colonnes 1 et 2
| Donnée 1 | Donnée 2 |
```

**Raison**

La norme Markdown ne prend pas en charge la syntaxe de fusion de cellules, et le plugin n'implémente aucune logique de fusion.

**Solution alternative**

- Utilisez des cellules vides comme espace réservé : `| Fusionner deux colonnes | |`
- Ou acceptez les limitations de Markdown et passez aux tableaux HTML

---

### 5. La ligne de séparation est considérée comme l'en-tête

**Phénomène**

```markdown
| :--- | :---: | ---: |
| Aligné à gauche | Centré | Aligné à droite |
| Donnée 1 | Donnée 2 | Donnée 3 |
```

La ligne de séparation sera considérée comme la ligne d'en-tête, impossible de créer des tableaux de données purs "sans en-tête".

**Raison**

La spécification Markdown considère la première ligne après la ligne de séparation comme l'en-tête du tableau (Table Header).

**Solution alternative**

- Il s'agit d'une limitation de Markdown elle-même, pas spécifique au plugin
- Pour les tableaux sans en-tête, envisagez d'autres formats (comme CSV)

---

### 6. Aucune option de configuration

**Phénomène**

Impossible d'ajuster via un fichier de configuration :
- Largeur de colonne min/max
- Désactiver des fonctionnalités spécifiques
- Personnaliser la stratégie de cache

**Raison**

La version actuelle (v0.0.3) ne fournit pas d'interface de configuration, tous les paramètres sont codés en dur dans le code source.

::: tip Note de version
La version actuelle du plugin est v0.0.3 (déclarée dans package.json). La v0.1.0 enregistrée dans CHANGELOG.md est une planification de version future, pas encore publiée.
:::

**Source du code**

```typescript
// index.ts:115 - Largeur minimale de colonne codée en dur à 3
const colWidths: number[] = Array(colCount).fill(3)

// index.ts:222 - Seuil de cache codé en dur
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Planification future**

Le CHANGELOG mentionne un support possible à l'avenir :
> Configuration options (min/max column width, disable features)

---

### 7. Performance non vérifiée pour les très grands tableaux

**Phénomène**

Pour les tableaux de 100+ lignes, le formatage peut être lent ou consommer beaucoup de mémoire.

**Raison**

Le plugin utilise une analyse ligne par ligne et un mécanisme de cache, théoriquement capable de traiter de grands tableaux, mais aucune optimisation de performance dédiée n'a été effectuée.

**Source du code**

```typescript
// index.ts:5-7
const widthCache = new Map<string, number>()
let cacheOperationCount = 0

// Le cache est vidé après 100 opérations ou 1000 entrées
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Recommandation**

- Pour les très grands tableaux, il est recommandé de les diviser en plusieurs petits tableaux
- Ou attendez une future version avec optimisation des performances

---

## Points de contrôle

Après avoir terminé ce cours, vous devriez être capable de répondre :

- [ ] Quels formats de tableau le plugin prend-il en charge ? (Réponse : uniquement les tableaux Markdown avec pipes)
- [ ] Pourquoi ne peut-il pas formater les cellules multilignes ? (Réponse : le plugin traite ligne par ligne, pas de logique de fusion)
- [ ] Quel est le rôle de la ligne de séparation ? (Réponse : définit le nombre de colonnes et l'alignement, obligatoire)
- [ ] Peut-on personnaliser la largeur des colonnes ? (Réponse : non pris en charge dans la version actuelle)

---

## Mise en garde contre les pièges courants

::: warning Erreurs courantes

**Erreur 1** : S'attendre à ce que les tableaux HTML soient formatés

Le plugin ne traite que les tableaux Markdown avec pipes, les tableaux HTML doivent être formatés manuellement ou avec d'autres outils.

**Erreur 2** : Le tableau n'a pas de ligne de séparation

La ligne de séparation est une partie obligatoire des tableaux Markdown, son absence entraîne une erreur "structure invalide".

**Erreur 3** : Le contenu des cellules est trop long, rendant le tableau trop large

Le plugin n'a pas de limite de largeur de colonne maximale, si le contenu des cellules est trop long, tout le tableau deviendra très large. Il est recommandé de faire des sauts de ligne manuels ou de simplifier le contenu.

:::

---

## Résumé du cours

| Limitation | Raison | Solution alternative |
| --- | --- | --- |
| Tableaux HTML non pris en charge | Le plugin se concentre sur les tableaux Markdown avec pipes | Utiliser des outils de formatage HTML |
| Cellules multilignes non prises en charge | Logique de traitement ligne par ligne | Diviser en plusieurs lignes ou accepter l'élargissement |
| Tableaux sans séparateur non pris en charge | Exigence de la spécification Markdown | Ajouter une ligne de séparation `|---|` |
| Aucune option de configuration | Non implémenté dans la version actuelle | Attendre les mises à jour futures |

## Aperçu du prochain cours

> Dans le prochain cours, nous étudierons **[Détails techniques](../tech-details/)**.
>
> Vous apprendrez :
> - Comment fonctionne le mécanisme de cache du plugin
> - Les stratégies d'optimisation des performances
> - Pourquoi le cache est vidé après 100 opérations

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Limitation | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Détection de tableaux HTML | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Détection de ligne de séparation | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| Validation de tableau (doit contenir une ligne de séparation) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Largeur minimale de colonne codée en dur | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L115) | 115 |
| Seuil de cache codé en dur | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L222-L224) | 222-224 |

**Fonctions clés** :
- `isTableRow()` : Détecte si une ligne est une ligne de tableau Markdown avec pipes
- `isSeparatorRow()` : Détecte une ligne de séparation
- `isValidTable()` : Valide la validité de la structure du tableau

**Constantes clés** :
- `colWidths largeur minimale = 3` : Largeur d'affichage minimale des colonnes
- `Seuil de cache = 100 opérations ou 1000 entrées` : Condition déclenchant le nettoyage du cache

**Référence CHANGELOG** :
- Section des limitations connues : [`CHANGELOG.md`](https://github.com/franlol/opencode-md-table-formatter/blob/main/CHANGELOG.md#L31-L36) lignes 31-36

</details>
