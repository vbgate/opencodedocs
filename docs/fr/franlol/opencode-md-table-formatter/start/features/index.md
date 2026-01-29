---
title: "8 Fonctionnalités principales | opencode-md-table-formatter"
sidebarTitle: "8 Fonctionnalités principales"
subtitle: "Aperçu des 8 fonctionnalités principales"
description: "Découvrez les 8 fonctionnalités principales du plugin opencode-md-table-formatter. Maîtrisez le formatage automatique des tableaux, la compatibilité du mode de masquage et le support de l'alignement."
tags:
  - "Formatage automatique"
  - "Mode de masquage"
  - "Support de l'alignement"
  - "Protection des blocs de code"
prerequisite:
  - "start-getting-started"
order: 20
---

# Aperçu des fonctionnalités : La magie du formatage automatique

::: info Ce que vous apprendrez
- Comprendre les 8 fonctionnalités principales du plugin
- Identifier les scénarios adaptés à ce plugin
- Connaître les limites du plugin (ce qu'il ne peut pas faire)
:::

## Votre problème actuel

::: info Informations sur le plugin
Le nom complet de ce plugin est **@franlol/opencode-md-table-formatter**, ci-après appelé « plugin de formatage de tableaux ».
:::

Les tableaux Markdown générés par l'IA ressemblent souvent à ceci :

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| **用户管理** | 管理系统用户 | ✅ 完成 |
| API | 接口文档 | 🚧 进行中 |
```

Les largeurs de colonnes sont inégales, ce qui est désagréable à regarder. Ajustement manuel ? Chaque fois que l'IA génère un nouveau tableau, vous devez le régler à nouveau, c'est trop fatigant.

## Quand utiliser cette méthode

- L'IA a généré un tableau Markdown et vous voulez qu'il soit plus ordonné
- Vous avez activé le mode de masquage (Concealment Mode) d'OpenCode et l'alignement des tableaux pose toujours des problèmes
- Vous êtes trop paresseux pour ajuster manuellement les largeurs de colonnes des tableaux

## Idée principale

Le fonctionnement de ce plugin est très simple :

```
Génération de texte par l'IA → Détection des tableaux par le plugin → Validation de la structure → Formatage → Retour du texte amélioré
```

Il se monte sur le hook `experimental.text.complete` d'OpenCode. Chaque fois que l'IA termine de générer du texte, le plugin le traite automatiquement. Vous n'avez pas besoin de le déclencher manuellement, tout est transparent.

## 8 fonctionnalités principales

### 1. Formatage automatique des tableaux

Le plugin détecte automatiquement les tableaux Markdown dans le texte généré par l'IA, unifie les largeurs de colonnes et rend les tableaux ordonnés et esthétiques.

**Avant formatage** :

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| **用户管理** | 管理系统用户 | ✅ 完成 |
| API | 接口文档 | 🚧 进行中 |
```

**Après formatage** :

```markdown
| 名称         | 描述         | 状态       |
| ------------ | ------------ | ---------- |
| **用户管理** | 管理系统用户 | ✅ 完成    |
| API          | 接口文档     | 🚧 进行中  |
```

::: tip Condition de déclenchement
Le plugin se monte sur le hook `experimental.text.complete` et se déclenche automatiquement après la génération de texte par l'IA, sans intervention manuelle.
:::

### 2. Compatibilité avec le mode de masquage

OpenCode active par défaut le mode de masquage (Concealment Mode), qui masque les symboles Markdown (comme `**`, `*`, `~~`).

Les outils de formatage de tableaux ordinaires ne prennent pas cela en compte et incluent `**` dans le calcul de la largeur, ce qui entraîne un désalignement.

Ce plugin est optimisé spécifiquement pour le mode de masquage :

- Lors du calcul de la largeur, il supprime les symboles comme `**gras**`, `*italique*`, `~~barré~~`
- Il conserve la syntaxe Markdown originale lors de la sortie
- Résultat final : les tableaux sont parfaitement alignés en mode de masquage

::: details Détail technique : Logique de calcul de la largeur
```typescript
// Suppression des symboles Markdown (pour le calcul de la largeur)
visualText = visualText
  .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***gras italique*** → texte
  .replace(/\*\*(.+?)\*\*/g, "$1")     // **gras** → gras
  .replace(/\*(.+?)\*/g, "$1")         // *italique* → italique
  .replace(/~~(.+?)~~/g, "$1")         // ~~barré~~ → barré
```
Emplacement du code source : `index.ts:181-185`
:::

### 3. Support de l'alignement

Prend en charge les trois modes d'alignement des tableaux Markdown :

| Syntaxe | Mode d'alignement | Effet |
| --- | --- | --- |
| `---` ou `:---` | Aligné à gauche | Texte aligné à gauche (les deux syntaxes ont le même effet) |
| `:---:` | Centré | Texte centré |
| `---:` | Aligné à droite | Texte aligné à droite |

**Exemple** :

```markdown
| 左对齐 | 居中 | 右对齐 |
| :--- | :---: | ---: |
| 文本 | 文本 | 文本 |
```

Après formatage, chaque colonne sera alignée selon le mode spécifié et la ligne de séparation sera régénérée en fonction du mode d'alignement.

### 4. Traitement du Markdown imbriqué

Les cellules de tableau peuvent contenir une syntaxe Markdown imbriquée, comme `***gras italique***`.

Le plugin utilise un algorithme regex multi-passes, supprimant les couches de l'extérieur vers l'intérieur :

```
***gras italique*** → **gras italique** → *gras italique* → gras italique
```

Ainsi, même avec plusieurs niveaux d'imbrication, le calcul de la largeur reste précis.

### 5. Protection des blocs de code

Les symboles Markdown dans le code en ligne (entre backticks) doivent rester tels quels et ne pas être supprimés.

Par exemple, `` `**bold**` ``, l'utilisateur voit ces 8 caractères `**bold**`, et non les 4 caractères `bold`.

Le plugin extrait d'abord le contenu des blocs de code, supprime les symboles Markdown des autres parties, puis remet le contenu des blocs de code.

::: details Détail technique : Logique de protection des blocs de code
```typescript
// Étape 1 : Extraire et protéger le code en ligne
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})

// Étape 2 : Supprimer les symboles Markdown des parties non-code
// ...

// Étape 3 : Restaurer le contenu du code en ligne
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})
```
Emplacement du code source : `index.ts:168-193`
:::

### 6. Traitement des cas limites

Le plugin peut gérer correctement divers cas limites :

| Scénario | Méthode de traitement |
| --- | --- |
| Emoji | Utiliser `Bun.stringWidth` pour calculer correctement la largeur d'affichage |
| Caractères Unicode | Caractères à chasse fixe comme le chinois, le japonais sont correctement alignés |
| Cellules vides | Remplir avec des espaces jusqu'à la largeur minimale (3 caractères) |
| Contenu trop long | Traitement normal, sans troncature |

### 7. Opération silencieuse

Le plugin s'exécute en silence en arrière-plan :

- **Aucune sortie de journal** : N'imprime aucune information dans la console
- **Les erreurs n'interrompent pas** : Même si le formatage échoue, cela n'affecte pas la sortie normale de l'IA

Si une erreur survient pendant le formatage, le plugin conserve le texte original et ajoute un commentaire HTML à la fin :

```markdown
<!-- table formatting failed: [message d'erreur] -->
```

### 8. Validation et feedback

Le plugin valide si la structure du tableau est valide. Les tableaux invalides ne seront pas formatés, mais conservés tels quels, avec un ajout d'indication :

```markdown
<!-- table not formatted: invalid structure -->
```

**Exigences pour un tableau valide** :

- Au moins 2 lignes (y compris la ligne de séparation)
- Toutes les lignes ont le même nombre de colonnes
- Doit avoir une ligne de séparation (format : `|---|---|`)

## Limites du plugin

::: warning Scénarios non pris en charge
- **Tableaux HTML** : Traite uniquement les tableaux avec pipes Markdown (`| ... |`)
- **Cellules multilignes** : Les cellules contenant des balises `<br>` ne sont pas prises en charge
- **Tableaux sans ligne de séparation** : Doit avoir une ligne de séparation `|---|---|`
- **Tableaux sans en-tête** : Doit avoir une ligne d'en-tête
:::

## Point de contrôle

Après avoir terminé cette leçon, vous devriez pouvoir répondre :

- [ ] Comment le plugin se déclenche-t-il automatiquement ? (Réponse : hook `experimental.text.complete`)
- [ ] Pourquoi avons-nous besoin de la « compatibilité avec le mode de masquage » ? (Réponse : Le mode de masquage masque les symboles Markdown, ce qui affecte le calcul de la largeur)
- [ ] Les symboles Markdown dans le code en ligne seront-ils supprimés ? (Réponse : Non, les symboles Markdown dans le code sont entièrement conservés)
- [ ] Comment les tableaux invalides sont-ils traités ? (Réponse : Conservés tels quels, avec ajout d'un commentaire d'erreur)

## Résumé de la leçon

| Fonctionnalité | Description |
| --- | --- |
| Formatage automatique | Se déclenche automatiquement après la génération de texte par l'IA, sans intervention manuelle |
| Compatibilité avec le mode de masquage | Calcule correctement la largeur d'affichage après masquage des symboles Markdown |
| Support de l'alignement | Aligné à gauche, centré, aligné à droite |
| Markdown imbriqué | Suppression regex multi-passes, support de la syntaxe imbriquée |
| Protection des blocs de code | Les symboles dans le code en ligne restent tels quels |
| Cas limites | Emoji, Unicode, cellules vides, contenu trop long |
| Opération silencieuse | Aucun journal, les erreurs n'interrompent pas |
| Validation et feedback | Ajout de commentaires d'erreur pour les tableaux invalides |

## Prochain cours

> Dans le prochain cours, nous approfondirons **[Principe du mode de masquage](../../advanced/concealment-mode/)**.
>
> Vous apprendrez :
> - Le fonctionnement du mode de masquage d'OpenCode
> - Comment le plugin calcule correctement la largeur d'affichage
> - Le rôle de `Bun.stringWidth`

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Point d'entrée du plugin | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23 |
| Détection des tableaux | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Validation des tableaux | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Calcul de la largeur (mode de masquage) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L161-L196) | 161-196 |
| Analyse des modes d'alignement | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Protection des blocs de code | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |

**Constantes clés** :
- `colWidths[col] = 3` : Largeur minimale de colonne de 3 caractères (`index.ts:115`)

**Fonctions clés** :
- `formatMarkdownTables()` : Fonction principale de traitement, formate tous les tableaux du texte
- `getStringWidth()` : Calcule la largeur d'affichage d'une chaîne, supprime les symboles Markdown
- `isValidTable()` : Valide si la structure du tableau est valide

</details>
