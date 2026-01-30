---
title: "Mettre à Jour les Skills : Garder vos Skills à Jour | opencode-openskills"
sidebarTitle: "Mettre à Jour les Skills en un Clic"
subtitle: "Mettre à Jour les Skills : Garder vos Skills à Jour"
description: "Apprenez à utiliser la commande OpenSkills update pour actualiser les skills installés. Prend en charge la mise à jour globale de tous les skills ou de skills spécifiques, maîtrisez les différences de mise à jour entre les chemins locaux et les dépôts git, et gardez vos skills à la dernière version."
tags:
  - "skills"
  - "update"
  - "git"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 5
---

# Mettre à jour les Skills : Garder vos Skills Synchronisés avec le Dépôt Source

## Ce que Vous Apprendrez

Cette leçon vous apprend à garder les skills OpenSkills toujours à jour. Grâce à la commande OpenSkills update, vous pourrez :

- Mettre à jour tous les skills installés en un seul clic
- Mettre à jour uniquement quelques skills spécifiques
- Comprendre les différences de mise à jour selon les sources d'installation
- Diagnostiquer les causes des échecs de mise à jour

## Votre Problème Actuel

Les dépôts de skills sont constamment mis à jour — les auteurs peuvent avoir corrigé des bugs, ajouté de nouvelles fonctionnalités, ou amélioré la documentation. Mais les skills que vous avez installés sont toujours à l'ancienne version.

Vous avez peut-être déjà rencontré ces situations :
- La documentation du skill indique "prend en charge cette fonctionnalité", mais votre agent IA dit qu'il ne sait pas
- Le skill a de meilleurs messages d'erreur, mais vous voyez toujours les anciens
- Un bug présent lors de l'installation a été corrigé, mais vous en êtes encore affecté

**Supprimer et réinstaller à chaque fois est trop fastidieux** — vous avez besoin d'une méthode de mise à jour efficace.

## Quand Utiliser Cette Commande

Scénarios typiques d'utilisation de la commande `update` :

| Scénario | Action |
|---|---|
| Découvrir qu'un skill a une mise à jour | Exécuter `openskills update` |
| Mettre à jour seulement quelques skills | `openskills update skill1,skill2` |
| Tester un skill en développement local | Mettre à jour depuis le chemin local |
| Mettre à jour depuis un dépôt GitHub | Cloner automatiquement le dernier code |

::: tip Recommandation de Fréquence de Mise à Jour
- **Skills communautaires** : Mettre à jour une fois par mois pour obtenir les dernières améliorations
- **Skills que vous développez** : Mettre à jour manuellement après chaque modification
- **Skills installés depuis un chemin local** : Mettre à jour après chaque modification de code
:::

## 🎒 Préparatifs

Avant de commencer, assurez-vous d'avoir terminé :

- [x] OpenSkills installé (voir [Installer OpenSkills](../../start/installation/))
- [x] Au moins un skill installé (voir [Installer votre Premier Skill](../../start/first-skill/))
- [x] Si installé depuis GitHub, assurez-vous d'avoir une connexion internet

## Concept Central

Le mécanisme de mise à jour d'OpenSkills est très simple :

**Enregistrer les informations de source lors de chaque installation → Recopier depuis la source originale lors de la mise à jour**

::: info Pourquoi une réinstallation est-elle nécessaire ?
Les skills de l'ancienne version (installés sans enregistrer la source) ne peuvent pas être mis à jour. Dans ce cas, vous devez réinstaller une fois, et OpenSkills mémorisera la source. Après cela, les mises à jour automatiques seront possibles.
:::

**Méthodes de mise à jour pour trois sources d'installation** :

| Type de Source | Méthode de Mise à Jour | Scénario Applicable |
|---|---|---|
| **Chemin local** | Copier directement depuis le chemin local | Développer vos propres skills |
| **Dépôt git** | Cloner le dernier code dans un répertoire temporaire | Installer depuis GitHub/GitLab |
| **GitHub shorthand** | Convertir en URL complète puis cloner | Installer depuis un dépôt GitHub officiel |

Lors de la mise à jour, les skills sans métadonnées de source seront ignorés, et les noms des skills nécessitant une réinstallation seront listés.

## Suivez le Guide

### Étape 1 : Voir les Skills Installés

Vérifiez d'abord quels skills peuvent être mis à jour :

```bash
npx openskills list
```

**Ce que vous devriez voir** : Liste des skills installés, incluant le nom, la description et l'étiquette d'emplacement d'installation (project/global)

### Étape 2 : Mettre à Jour Tous les Skills

La méthode la plus simple consiste à mettre à jour tous les skills installés :

```bash
npx openskills update
```

**Ce que vous devriez voir** : Mise à jour des skills un par un, chaque skill affichant le résultat de la mise à jour

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Skipped: my-old-skill (no source metadata; re-install once to enable updates)
Summary: 2 updated, 1 skipped (3 total)
```

::: details Signification des Skills Ignorés
Si vous voyez `Skipped: xxx (no source metadata)`, cela signifie que ce skill a été installé avant l'ajout de la fonctionnalité de mise à jour. Vous devez le réinstaller une fois pour activer les mises à jour automatiques.
:::

### Étape 3 : Mettre à Jour des Skills Spécifiques

Si vous ne voulez mettre à jour que quelques skills spécifiques, passez les noms des skills (séparés par des virgules) :

```bash
npx openskills update git-workflow,check-branch-first
```

**Ce que vous devriez voir** : Seuls les deux skills spécifiés ont été mis à jour

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Summary: 2 updated, 0 skipped (2 total)
```

### Étape 4 : Mettre à Jour un Skill en Développement Local

Si vous développez un skill localement, vous pouvez le mettre à jour depuis le chemin local :

```bash
npx openskills update my-skill
```

**Ce que vous devriez voir** : Le skill est recopié depuis le chemin local où vous l'avez installé

```
✅ Updated: my-skill
Summary: 1 updated, 0 skipped (1 total)
```

::: tip Flux de Travail de Développement Local
Processus de développement :
1. Installer le skill : `openskills install ./my-skill`
2. Modifier le code
3. Mettre à jour le skill : `openskills update my-skill`
4. Synchroniser vers AGENTS.md : `openskills sync`
:::

### Étape 5 : Gérer les Échecs de Mise à Jour

Si certains skills échouent à se mettre à jour, OpenSkills affichera les causes détaillées :

```bash
npx openskills update
```

**Situations possibles** :

```
Skipped: git-workflow (git clone failed)
Skipped: my-skill (local source missing)
Missing source metadata (1): old-skill
Clone failed (1): git-workflow
```

**Méthodes de résolution correspondantes** :

| Message d'Erreur | Cause | Méthode de Résolution |
|---|---|---|
| `no source metadata` | Installation de l'ancienne version | Réinstaller : `openskills install <source>` |
| `local source missing` | Le chemin local a été supprimé | Restaurer le chemin local ou réinstaller |
| `SKILL.md missing at local source` | Le fichier local a été supprimé | Restaurer le fichier SKILL.md |
| `git clone failed` | Problème réseau ou dépôt inexistant | Vérifier le réseau ou l'adresse du dépôt |
| `SKILL.md not found in repo` | Changement de structure du dépôt | Contacter l'auteur du skill ou mettre à jour le sous-chemin |

## Point de Contrôle ✅

Confirmez que vous avez appris :

- [ ] Savoir utiliser `openskills update` pour mettre à jour tous les skills
- [ ] Savoir mettre à jour des skills spécifiques en les séparant par des virgules
- [ ] Comprendre la signification et la résolution des skills "ignorés"
- [ ] Connaître le flux de mise à jour pour les skills en développement local

## Mises en Garde

### ❌ Erreurs Courantes

| Erreur | Bonne Pratique |
|---|---|
| Ignorer les skills qui sont ignorés | Réinstaller ou corriger le problème selon les indications |
| Supprimer et réinstaller à chaque fois | Utiliser la commande `update` pour plus d'efficacité |
| Ne pas savoir d'où le skill a été installé | Utiliser `openskills list` pour voir la source |

### ⚠️ Points d'Attention

**La mise à jour écrasera les modifications locales**

Si vous avez directement modifié les fichiers du skill dans le répertoire d'installation, ces modifications seront écrasées lors de la mise à jour. La bonne pratique est :
1. Modifier les **fichiers sources** (chemin local ou dépôt)
2. Puis exécuter `openskills update`

**Les skills installés par lien symbolique nécessitent un traitement spécial**

Si le skill a été installé via un lien symbolique (voir [Support des Liens Symboliques](../../advanced/symlink-support/)), la mise à jour recréera le lien sans briser la relation de lien symbolique.

**Les skills globaux et par projet doivent être mis à jour séparément**

```bash
# Mettre à jour uniquement les skills du projet (par défaut)
openskills update

# La mise à jour des skills globaux nécessite un traitement séparé
# Ou utiliser le mode --universal pour une gestion unifiée
```

## Résumé de la Leçon

Dans cette leçon, nous avons appris la fonctionnalité de mise à jour d'OpenSkills :

- **Mise à jour par lots** : `openskills update` met à jour tous les skills en un clic
- **Mise à jour spécifique** : `openskills update skill1,skill2` met à jour des skills spécifiques
- **Sensibilité à la source** : Reconnaissance automatique des chemins locaux et des dépôts git
- **Messages d'erreur** : Explication détaillée des raisons des skills ignorés et des méthodes de résolution

La fonctionnalité de mise à jour permet aux skills de rester à la dernière version, garantissant que les skills que vous utilisez contiennent toujours les dernières améliorations et corrections.

## Aperçu de la Prochaine Leçon

> Dans la prochaine leçon, nous apprendrons **[Supprimer des Skills](../remove-skills/)**.
>
> Vous apprendrez :
> - Comment utiliser la commande interactive `manage` pour supprimer des skills
> - Comment utiliser la commande `remove` pour des suppressions scriptées
> - Les points d'attention après avoir supprimé des skills

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du Fichier | Lignes |
|---|---|---|
| Logique principale de mise à jour des skills | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L14-L150) | 14-150 |
| Mise à jour depuis le chemin local | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L64-L82) | 64-82 |
| Mise à jour depuis le dépôt Git | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L85-L125) | 85-125 |
| Copier le skill depuis le répertoire | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L152-L163) | 152-163 |
| Vérification de sécurité du chemin | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L165-L172) | 165-172 |
| Définition de la structure des métadonnées | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L8-L15) | 8-15 |
| Lecture des métadonnées du skill | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L17-L27) | 17-27 |
| Écriture des métadonnées du skill | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L29-L36) | 29-36 |
| Définition des commandes CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L58-L62) | 58-62 |

**Constantes clés** :
- `SKILL_METADATA_FILE = '.openskills.json'` : Nom du fichier de métadonnées, enregistre la source d'installation du skill

**Fonctions clés** :
- `updateSkills(skillNames)` : Fonction principale pour mettre à jour des skills spécifiques ou tous les skills
- `updateSkillFromDir(targetPath, sourceDir)` : Copier le skill depuis le répertoire source vers le répertoire cible
- `isPathInside(targetPath, targetDir)` : Vérifier la sécurité du chemin d'installation (empêcher le parcours de chemin)
- `readSkillMetadata(skillDir)` : Lire les métadonnées du skill
- `writeSkillMetadata(skillDir, metadata)` : Écrire/mettre à jour les métadonnées du skill

**Règles métier** :
- **BR-5-1** : Par défaut, mettre à jour tous les skills installés (update.ts:37-38)
- **BR-5-2** : Prend en charge les listes de noms de skills séparés par des virgules (update.ts:15)
- **BR-5-3** : Ignorer les skills sans métadonnées de source (update.ts:56-62)
- **BR-5-4** : Prend en charge la mise à jour depuis le chemin local (update.ts:64-82)
- **BR-5-5** : Prend en charge la mise à jour depuis le dépôt git (update.ts:85-125)
- **BR-5-6** : Vérifier la sécurité du chemin (update.ts:156-162)

</details>
