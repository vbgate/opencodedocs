---
title: "Dépannage : Problèmes de formatage de tableaux | opencode-md-table-formatter"
sidebarTitle: "Que faire si le tableau n'est pas formaté"
subtitle: "Dépannage : Problèmes de formatage de tableaux"
description: "Apprenez les méthodes de dépannage du plugin opencode-md-table-formatter. Identifiez rapidement les problèmes courants comme les tableaux non formatés et les structures invalides, et maîtrisez la vérification de configuration et les solutions."
tags:
  - "troubleshooting"
  - "questions fréquentes"
prerequisite:
  - "start-getting-started"
order: 60
---

# Questions fréquentes : Que faire si le tableau n'est pas formaté

## Ce que vous apprendrez

Cette leçon vous aidera à diagnostiquer et résoudre rapidement les problèmes courants lors de l'utilisation du plugin :

- Identifier les raisons pour lesquelles un tableau n'est pas formaté
- Comprendre la signification de l'erreur "structure de tableau invalide"
- Connaître les limitations connues du plugin et les scénarios inapplicables
- Vérifier rapidement si la configuration est correcte

---

## Problème 1 : Le tableau ne se formate pas automatiquement

### Symptômes

L'IA a généré un tableau, mais les largeurs de colonnes ne sont pas cohérentes et le tableau n'est pas aligné.

### Causes possibles et solutions

#### Cause 1 : Plugin non configuré

**Étapes de vérification** :

1. Ouvrez le fichier `.opencode/opencode.jsonc`
2. Vérifiez si le plugin est présent dans le tableau `plugin` :

```jsonc
{
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

3. Si ce n'est pas le cas, ajoutez la configuration du plugin
4. **Redémarrez OpenCode** pour que la configuration prenne effet

::: tip Format de configuration
Assurez-vous que le numéro de version et le nom du package sont corrects, en utilisant le format `@franlol/opencode-md-table-formatter` + `@` + numéro de version.
:::

#### Cause 2 : OpenCode n'a pas été redémarré

**Solution** :

Après avoir ajouté le plugin, vous devez redémarrer complètement OpenCode (pas simplement rafraîchir la page) pour que le plugin soit chargé.

#### Cause 3 : Le tableau manque une ligne de séparation

**Exemple de symptôme** :

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Ce type de tableau ne sera pas formaté.

**Solution** :

Ajoutez une ligne de séparation (deuxième ligne, au format `|---|`) :

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
| Bob | 30 |
```

::: info Rôle de la ligne de séparation
La ligne de séparation est la syntaxe standard des tableaux Markdown, utilisée pour distinguer l'en-tête des lignes de contenu et pour spécifier le mode d'alignement. Le plugin **doit** détecter une ligne de séparation pour formater le tableau.
:::

#### Cause 4 : Version d'OpenCode trop ancienne

**Étapes de vérification** :

1. Ouvrez le menu d'aide d'OpenCode
2. Consultez le numéro de version actuel
3. Vérifiez que la version >= 1.0.137

**Solution** :

Mettez à jour vers la dernière version d'OpenCode.

::: warning Exigences de version
Le plugin utilise le hook `experimental.text.complete`, qui est disponible dans OpenCode version 1.0.137+.
:::

---

## Problème 2 : Voir le commentaire "invalid structure"

### Symptômes

À la fin du tableau apparaît :

```markdown
<!-- table not formatted: invalid structure -->
```

### Qu'est-ce qu'une "structure de tableau invalide"

Le plugin valide chaque tableau Markdown, et seuls les tableaux qui passent la validation sont formatés. Si la structure du tableau ne respecte pas les spécifications, le plugin conserve le texte original et ajoute ce commentaire.

### Causes courantes

#### Cause 1 : Nombre de lignes du tableau insuffisant

**Exemple d'erreur** :

```markdown
| Name |
```

Seulement 1 ligne, format incomplet.

**Exemple correct** :

```markdown
| Name |
|---|
```

Au moins 2 lignes sont nécessaires (y compris la ligne de séparation).

#### Cause 2 : Nombre de colonnes incohérent

**Exemple d'erreur** :

```markdown
| Name | Age |
|--- | ---|
| Alice |
```

La première ligne a 2 colonnes, la deuxième ligne a 1 colonne, le nombre de colonnes n'est pas cohérent.

**Exemple correct** :

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
```

Toutes les lignes doivent avoir le même nombre de colonnes.

#### Cause 3 : Ligne de séparation manquante

**Exemple d'erreur** :

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Pas de ligne de séparation comme `|---|---|`.

**Exemple correct** :

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
| Bob | 30 |
```

### Comment diagnostiquer rapidement

Utilisez la liste de contrôle suivante :

- [ ] Le tableau a au moins 2 lignes
- [ ] Toutes les lignes ont le même nombre de colonnes (comptez le nombre de `|` dans chaque ligne)
- [ ] Il existe une ligne de séparation (la deuxième ligne est généralement au format `|---|`)

Si tout cela est satisfait mais que l'erreur persiste, vérifiez s'il y a des caractères cachés ou des espaces supplémentaires qui causent une erreur de calcul du nombre de colonnes.

---

## Problème 3 : Voir le commentaire "table formatting failed"

### Symptômes

À la fin du texte apparaît :

```markdown
<!-- table formatting failed: {message d'erreur} -->
```

### Cause

C'est une exception inattendue lancée en interne par le plugin.

### Solution

1. **Consultez le message d'erreur** : la partie `{message d'erreur}` dans le commentaire indiquera le problème spécifique
2. **Vérifiez le contenu du tableau** : confirmez s'il y a des cas extrêmes particuliers (comme une ligne très longue, des combinaisons de caractères spéciaux)
3. **Conservez le texte original** : même en cas d'échec, le plugin ne corrompra pas le texte original, votre contenu est en sécurité
4. **Signalez le problème** : si le problème se reproduit, vous pouvez soumettre un rapport de problème sur [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues)

::: tip Isolation des erreurs
Le plugin enveloppe la logique de formatage avec try-catch, donc même en cas d'erreur, cela n'interrompra pas le flux de travail d'OpenCode.
:::

---

## Problème 4 : Certains types de tableaux ne sont pas pris en charge

### Types de tableaux non pris en charge

#### Tableaux HTML

**Non pris en charge** :

```html
<table>
  <tr><th>Name</th></tr>
  <tr><td>Alice</td></tr>
</table>
```

**Seuls les tableaux Markdown avec pipes (Pipe Table) sont pris en charge**

#### Cellules multilignes

**Non pris en charge** :

```markdown
| Name | Description |
|--- | ---|
| Alice | Line 1<br>Line 2 |
```

::: info Pourquoi non pris en charge
Le plugin est conçu pour les tableaux simples générés par l'IA, les cellules multilignes nécessitent une logique de mise en page plus complexe.
:::

#### Tableaux sans ligne de séparation

**Non pris en charge** :

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Une ligne de séparation est obligatoire (voir "Cause 3" ci-dessus).

---

## Problème 5 : Le tableau reste désaligné après formatage

### Causes possibles

#### Cause 1 : Mode caché non activé

Le plugin est optimisé pour le mode caché d'OpenCode (Concealment Mode), qui masque les symboles Markdown (comme `**`, `*`).

Si votre éditeur n'a pas activé le mode caché, le tableau peut sembler "désaligné" car les symboles Markdown occupent une largeur réelle.

**Solution** :

Vérifiez que le mode caché d'OpenCode est activé (activé par défaut).

#### Cause 2 : Contenu de cellule trop long

Si le contenu d'une cellule est très long, le tableau peut s'étendre considérablement.

C'est un comportement normal, le plugin ne tronquera pas le contenu.

#### Cause 3 : Symboles dans le code en ligne

Les symboles Markdown dans le code en ligne (`` `**code**` ``) sont calculés **selon la largeur littérale** et ne seront pas supprimés.

**Exemple** :

```
| Symbole | Largeur |
|--- | ---|
| Texte normal | 4 |
| `**bold**` | 8 |
```

C'est le comportement correct, car en mode caché, les symboles dans les blocs de code sont visibles.

---

## Résumé de la leçon

Grâce à cette leçon, vous avez appris :

- **Diagnostiquer les tableaux non formatés** : vérifier la configuration, le redémarrage, les exigences de version, la ligne de séparation
- **Comprendre les erreurs de tableau invalide** : validation du nombre de lignes, du nombre de colonnes, de la ligne de séparation
- **Identifier les limitations connues** : tableaux HTML, cellules multilignes, tableaux sans ligne de séparation non pris en charge
- **Auto-vérification rapide** : utiliser la liste de contrôle pour vérifier la structure du tableau

---

## Toujours pas résolu ?

Si vous avez vérifié tous les problèmes ci-dessus mais que le problème persiste :

1. **Consultez les journaux complets** : le plugin fonctionne en mode silencieux par défaut, sans journaux détaillés
2. **Soumettez un Issue** : sur [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues), fournissez votre exemple de tableau et le message d'erreur
3. **Consultez les cours avancés** : lisez [Spécifications des tableaux](../../advanced/table-spec/) et [Principe du mode caché](../../advanced/concealment-mode/) pour en savoir plus sur les détails techniques

---

## Prochain cours

> Dans le prochain cours, nous apprendrons **[Limitations connues : Où se trouvent les limites du plugin](../../appendix/limitations/)**.
>
> Vous apprendrez :
> - Les limites de conception et les contraintes du plugin
> - Les améliorations futures possibles
> - Comment déterminer si un scénario est adapté à l'utilisation de ce plugin

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonction            | Chemin du fichier                                                                                    | Ligne    |
|--- | --- | ---|
| Logique de validation du tableau    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88)     | 70-88   |
| Détection des lignes de tableau      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61)     | 58-61   |
| Détection de la ligne de séparation      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68)     | 63-68   |
| Gestion des erreurs        | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L15-L20)     | 15-20   |
| Commentaire de tableau invalide    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47)     | 44-47   |

**Règles métier clés** :
- `isValidTable()` : valide que le tableau doit avoir au moins 2 lignes, toutes les lignes ont le même nombre de colonnes, une ligne de séparation existe (lignes 70-88)
- `isSeparatorRow()` : utilise l'expression régulière `/^\s*:?-+:?\s*$/` pour détecter la ligne de séparation (lignes 63-68)
- Largeur minimale de colonne : 3 caractères (ligne 115)

**Mécanisme de gestion des erreurs** :
- try-catch enveloppe la fonction de traitement principale (lignes 15-20)
- Échec du formatage : conserve le texte original + ajoute le commentaire `<!-- table formatting failed: {message} -->`
- Échec de la validation : conserve le texte original + ajoute le commentaire `<!-- table not formatted: invalid structure -->`

</details>
