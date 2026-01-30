---
title: "Commande list : Lister les compétences | OpenSkills"
sidebarTitle: "Lister les compétences installées"
subtitle: "Commande list : Lister les compétences"
description: "Apprenez à utiliser la commande list d'OpenSkills. Découvrez comment visualiser toutes les compétences installées, comprenez la différence entre les étiquettes project et global et apprenez les règles de priorité."
tags:
  - "Gestion des compétences"
  - "Utilisation des commandes"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 4
---

# Lister les compétences installées

## Ce que vous apprendrez

- Utiliser `openskills list` pour voir toutes les compétences installées
- Comprendre la différence entre les étiquettes `(project)` et `(global)`
- Compter rapidement le nombre de compétences project et global
- Vérifier si une compétence est bien installée

## Votre problème actuel

Après avoir installé quelques compétences, vous pourriez rencontrer ces problèmes :

- "Quelles compétences ai-je installées ? J'ai oublié."
- "Cette compétence est installée dans le projet ou globalement ?"
- "Pourquoi certaines compétences sont visibles dans le projet A mais pas dans le projet B ?"
- "Je veux supprimer des compétences inutilisées mais je ne connais pas leurs noms exacts"

La commande `openskills list` est conçue pour résoudre ces doutes — elle agit comme un "catalogue" de compétences, vous permettant de voir toutes les compétences installées et leurs emplacements d'un coup d'œil.

## Quand utiliser cette commande

| Scénario | Action |
| --- | --- |
| Vérifier si une compétence s'est bien installée après installation | Exécuter `openskills list` pour voir si la compétence apparaît |
| Passer à un nouveau projet et vérifier les compétences disponibles | Exécuter `openskills list` pour voir quelles compétences project sont disponibles |
| Faire l'inventaire avant de nettoyer les compétences | Exécuter `openskills list` pour lister toutes les compétences, puis supprimer celles qui ne sont pas nécessaires |
| Déboguer des problèmes de chargement de compétences | Confirmer que le nom de la compétence et l'emplacement d'installation sont corrects |

## Concepts fondamentaux

OpenSkills supporte l'installation de compétences dans **4 emplacements** (par ordre de priorité de recherche) :

1. **project .agent/skills** — Répertoire de compétences génériques au niveau projet (environnement multi-agent)
2. **global .agent/skills** — Répertoire de compétences génériques au niveau global (environnement multi-agent)
3. **project .claude/skills** — Répertoire de compétences Claude Code au niveau projet
4. **global .claude/skills** — Répertoire de compétences Claude Code au niveau global

`openskills list` va :

1. Parcourir ces 4 répertoires pour trouver toutes les compétences
2. **Dédoublonner** : chaque nom de compétence n'est affiché qu'une seule fois (priorité au projet)
3. **Trier** : compétences project en premier, puis compétences global ; ordre alphabétique dans chaque emplacement
4. **Marquer l'emplacement** : utiliser les étiquettes `(project)` et `(global)` pour différencier
5. **Résumé statistique** : afficher le nombre de compétences project, global et le total

::: info Pourquoi dédoublonner ?
Si vous installez la même compétence à la fois dans le projet et globalement (par exemple `pdf`), OpenSkills priorisera la version projet. La commande list n'affiche qu'une seule fois pour éviter la confusion.
:::

## Guide pratique

### Étape 1 : Lister toutes les compétences installées

**Pourquoi**
Voir rapidement quelles compétences sont disponibles dans l'environnement actuel

Exécutez la commande suivante :

```bash
npx openskills list
```

**Ce que vous devriez voir**

Si aucune compétence n'est installée, vous verrez :

```
Available Skills:

No skills installed.

Install skills:
  npx openskills install anthropics/skills         # Project (default)
  npx openskills install owner/skill --global     # Global (advanced)
```

Si des compétences sont installées, vous verrez quelque chose comme :

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text and tables...

  code-analyzer                (project)
    Static code analysis tool for identifying security vulnerabilities...

  email-reader                 (global)
    Read email content and attachments via IMAP protocol...

Summary: 2 project, 1 global (3 total)
```

### Étape 2 : Comprendre le format de sortie

**Pourquoi**
Savoir ce que représente chaque ligne permet de localiser rapidement l'information souhaitée

Explication du format de sortie :

| Partie | Description |
| --- | --- |
| `pdf` | Nom de la compétence (extrait du champ name du fichier SKILL.md) |
| `(project)` | Étiquette d'emplacement : bleu pour les compétences projet, gris pour les compétences globales |
| `Comprehensive PDF...` | Description de la compétence (extraite du champ description du fichier SKILL.md) |
| `Summary: 2 project, 1 global (3 total)` | Résumé statistique : nombre de compétences project, global et total |

### Étape 3 : Vérifier les étiquettes d'emplacement

**Pourquoi**
Confirmer que les compétences sont installées à l'emplacement prévu, évitant ainsi la confusion de "pourquoi je ne vois pas cette compétence dans ce projet"

Essayez les opérations suivantes pour comprendre les étiquettes d'emplacement :

```bash
# 1. Installer une compétence au niveau projet
npx openskills install anthropics/skills -y

# 2. Voir la liste (devrait afficher l'étiquette project)
npx openskills list

# 3. Installer une compétence globale
npx openskills install anthropics/skills --global -y

# 4. Voir à nouveau la liste (deux compétences pdf, n'affichée qu'une seule fois, étiquette project)
npx openskills list
```

**Ce que vous devriez voir**

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text...

Summary: 1 project, 0 global (1 total)
```

Même si la même compétence est installée à la fois globalement et dans le projet, la commande list ne l'affichera qu'une seule fois, car la version projet a une priorité plus élevée.

## Points de contrôle ✅

Vérifiez les éléments suivants :

- [ ] Exécuter `openskills list` permet de voir la liste des compétences installées
- [ ] Pouvoir différencier les étiquettes `(project)` et `(global)` (couleurs différentes : bleu vs gris)
- [ ] Les chiffres du résumé sont corrects (nombre de compétences project + nombre de compétences global = total)
- [ ] Comprendre la règle selon laquelle un même nom de compétence n'est affiché qu'une seule fois

## Pièges à éviter

### Problème courant 1 : Impossible de trouver une compétence récemment installée

**Symptôme** : La commande `install` réussit, mais `list` ne la montre pas

**Étapes de dépannage** :

1. Vérifiez que vous êtes dans le bon répertoire de projet (les compétences project ne sont visibles que pour le projet courant)
2. Confirmez si l'installation a été faite globalement (avec le drapeau `--global`)
3. Vérifiez l'emplacement d'installation :

```bash
# Vérifier le répertoire du projet
ls -la .claude/skills/

# Vérifier le répertoire global
ls -la ~/.claude/skills/
```

### Problème courant 2 : Voir des noms de compétences étranges

**Symptôme** : Le nom de la compétence ne correspond pas à ce que vous attendiez (par exemple, nom de dossier vs name dans SKILL.md)

**Cause** : OpenSkills utilise le champ `name` du fichier SKILL.md comme nom de compétence, et non pas le nom du dossier

**Solution** : Vérifiez le frontmatter du fichier SKILL.md :

```yaml
---
name: pdf  # C'est le nom affiché par la commande list
description: Comprehensive PDF manipulation toolkit...
---
```

### Problème courant 3 : Description tronquée

**Symptôme** : La description de la compétence est coupée

**Cause** : C'est une limitation de la largeur du terminal, cela n'affecte pas le contenu de la compétence

**Solution** : Consultez directement le fichier SKILL.md pour obtenir la description complète

## Résumé de la leçon

`openskills list` est la commande "catalogue" de la gestion des compétences, elle vous aide à :

- 📋 **Voir toutes les compétences** : Voir d'un coup d'œil les compétences installées
- 🏷️ **Différencier les étiquettes d'emplacement** : `(project)` pour le niveau projet, `(global)` pour le niveau global
- 📊 **Résumé statistique** : Connaître rapidement le nombre de compétences project et global
- 🔍 **Résoudre les problèmes** : Vérifier si une compétence est installée avec succès, localiser l'emplacement de la compétence

Règles fondamentales :

1. Un même nom de compétence n'est affiché qu'une seule fois (priorité au projet)
2. Les compétences project sont affichées en premier, suivies des compétences global
3. Dans chaque emplacement, les compétences sont triées par ordre alphabétique

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons à **[Mettre à jour les compétences](../update-skills/)**.
>
> Vous apprendrez :
> - Comment rafraîchir les compétences installées depuis le dépôt source
> - Comment mettre à jour toutes les compétences en masse
> - Comment gérer les anciennes compétences sans métadonnées

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Ligne |
| --- | --- | --- |
| Implémentation de la commande list | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 7-43 |
| Rechercher toutes les compétences | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Configuration des répertoires de recherche | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 18-25 |
| Définition du type Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-6 |

**Fonctions clés** :
- `listSkills()` : Liste toutes les compétences installées, formate la sortie
- `findAllSkills()` : Parcourt les 4 répertoires de recherche, collecte toutes les compétences
- `getSearchDirs()` : Retourne les 4 chemins des répertoires de recherche (par priorité)

**Constantes clés** :
- Aucune (les chemins des répertoires de recherche sont calculés dynamiquement)

**Logique principale** :
1. **Mécanisme de déduplication** : Utilise un `Set` pour enregistrer les noms de compétences déjà traitées (skills.ts:32-33, 43, 57)
2. **Détection d'emplacement** : Détermine s'il s'agit d'un répertoire project via `dir.includes(process.cwd())` (skills.ts:48)
3. **Règle de tri** : Priorité au project, ordre alphabétique dans le même emplacement (list.ts:21-26)

</details>
