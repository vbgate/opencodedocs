---
title: "Démarrage Rapide : Installation et Configuration | opencode-md-table-formatter"
sidebarTitle: "Alignez vos tableaux en 1 minute"
subtitle: "Prise en main en 1 minute : Installation et Configuration"
description: "Apprenez à installer et configurer opencode-md-table-formatter. Installez le plugin en 1 minute et configurez-le pour aligner automatiquement les tableaux générés par l'IA."
tags:
  - "installation"
  - "configuration"
  - "opencode-plugin"
prerequisite: []
order: 10
---

# Prise en main en 1 minute : Installation et Configuration

::: info Ce que vous saurez faire
- Installer le plugin de formatage de tableaux dans OpenCode
- Aligner automatiquement les tableaux Markdown générés par l'IA
- Vérifier que le plugin fonctionne correctement
:::

## Votre problème actuel

Les tableaux Markdown générés par l'IA ressemblent souvent à ceci :

```markdown
| Nom | Description | Statut |
|---|---|---|
| Fonction A | Ceci est un texte de description très long | Terminé |
| B | Court | En cours |
```

Les largeurs de colonnes sont inégales, ce qui est difficile à lire. Ajuster manuellement ? Trop chronophage.

## Quand utiliser cette solution

- Vous demandez souvent à l'IA de générer des tableaux (comparaisons, listes, descriptions de configuration)
- Vous voulez que les tableaux s'affichent proprement dans OpenCode
- Vous ne voulez pas ajuster manuellement la largeur des colonnes à chaque fois

## 🎒 Prérequis

::: warning Conditions préalables
- OpenCode installé (version >= 1.0.137)
- Connaître l'emplacement du fichier de configuration `.opencode/opencode.jsonc`
:::

## Suivez le guide

### Étape 1 : Ouvrir le fichier de configuration

**Pourquoi** : Les plugins sont déclarés via le fichier de configuration et sont automatiquement chargés au démarrage d'OpenCode.

Trouvez votre fichier de configuration OpenCode :

::: code-group

```bash [macOS/Linux]
# Le fichier de configuration est généralement dans le répertoire racine du projet
ls -la .opencode/opencode.jsonc

# Ou dans le répertoire utilisateur
ls -la ~/.config/opencode/opencode.jsonc
```

```powershell [Windows]
# Le fichier de configuration est généralement dans le répertoire racine du projet
Get-ChildItem .opencode\opencode.jsonc

# Ou dans le répertoire utilisateur
Get-ChildItem "$env:APPDATA\opencode\opencode.jsonc"
```

:::

Ouvrez ce fichier avec votre éditeur préféré.

### Étape 2 : Ajouter la configuration du plugin

**Pourquoi** : Indiquer à OpenCode de charger le plugin de formatage de tableaux.

Ajoutez le champ `plugin` dans le fichier de configuration :

```jsonc
{
  // ... autres configurations ...
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

::: tip Vous avez déjà d'autres plugins ?
Si vous avez déjà un tableau `plugin`, ajoutez le nouveau plugin au tableau :

```jsonc
{
  "plugin": [
    "existing-plugin",
    "@franlol/opencode-md-table-formatter@0.0.3"  // Ajoutez-le ici
  ]
}
```
:::

**Ce que vous devriez voir** : Le fichier de configuration est enregistré avec succès, sans erreur de syntaxe.

### Étape 3 : Redémarrer OpenCode

**Pourquoi** : Les plugins sont chargés au démarrage d'OpenCode, vous devez redémarrer après avoir modifié la configuration.

Fermez la session OpenCode actuelle et redémarrez-la.

**Ce que vous devriez voir** : OpenCode démarre normalement, sans erreur.

### Étape 4 : Vérifier que le plugin fonctionne

**Pourquoi** : Confirmer que le plugin est correctement chargé et fonctionne.

Demandez à l'IA de générer un tableau, par exemple en saisissant :

```
Génère un tableau comparatif des caractéristiques de trois frameworks : React, Vue et Angular
```

**Ce que vous devriez voir** : Les largeurs de colonnes du tableau généré par l'IA sont alignées, comme ceci :

```markdown
| Framework | Caractéristiques                | Courbe d'apprentissage |
| --------- | ------------------------------- | ---------------------- |
| React     | Composants, DOM virtuel         | Moyenne                |
| Vue       | Progressif, liaison bidirectionnelle | Faible                 |
| Angular   | Framework complet, TypeScript   | Élevée                 |
```

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vérifiez les points suivants :

| Élément de vérification | Résultat attendu |
| ------------------------ | ------------------------------ |
| Syntaxe du fichier de configuration | Pas d'erreur |
| Démarrage d'OpenCode | Démarrage normal, sans erreur de chargement de plugin |
| Tableaux générés par l'IA | Largeurs de colonnes alignées automatiquement, format de ligne de séparation uniforme |

## Pièges à éviter

### Le tableau n'est pas formaté ?

1. **Vérifiez le chemin du fichier de configuration** : Assurez-vous de modifier le fichier de configuration qu'OpenCode lit réellement
2. **Vérifiez le nom du plugin** : Il doit être `@franlol/opencode-md-table-formatter@0.0.3`, attention au symbole `@`
3. **Redémarrez OpenCode** : Vous devez redémarrer après avoir modifié la configuration

### Vous voyez le commentaire "invalid structure" ?

Cela signifie que la structure du tableau ne respecte pas les spécifications Markdown. Causes courantes :

- Ligne de séparation manquante (`|---|---|`)
- Nombre de colonnes incohérent entre les lignes

Voir la section [FAQ](../../faq/troubleshooting/) pour plus de détails.

## Résumé de la leçon

- Les plugins sont configurés via le champ `plugin` dans `.opencode/opencode.jsonc`
- Le numéro de version `@0.0.3` garantit l'utilisation d'une version stable
- Vous devez redémarrer OpenCode après avoir modifié la configuration
- Le plugin formate automatiquement tous les tableaux Markdown générés par l'IA

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Aperçu des fonctionnalités](../features/)**.
>
> Vous apprendrez :
> - Les 8 fonctionnalités principales du plugin
> - Le principe de calcul de la largeur en mode caché
> - Quels tableaux peuvent être formatés et lesquels ne peuvent pas l'être

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Ligne |
| -------------- | -------------------------------------------------------------------------------------------- | ------- |
| Point d'entrée du plugin | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23    |
| Enregistrement des hooks | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L11-L13) | 11-13   |
| Configuration du package | [`package.json`](https://github.com/franlol/opencode-md-table-formatter/blob/main/package.json#L1-L41) | 1-41    |

**Constantes clés** :
- `@franlol/opencode-md-table-formatter@0.0.3` : Nom du package npm et version
- `experimental.text.complete` : Nom du hook écouté par le plugin

**Dépendances requises** :
- OpenCode >= 1.0.137
- `@opencode-ai/plugin` >= 0.13.7

</details>
