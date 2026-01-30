---
title: "Première Compétence : Installer une Compétence Officielle | OpenSkills"
sidebarTitle: "Installer votre première compétence en 5 minutes"
subtitle: "Première Compétence : Installer une Compétence Officielle"
description: "Apprenez à installer des compétences depuis le dépôt officiel d'Anthropic dans votre projet. Maîtrisez la commande openskills install et la sélection interactive, comprenez la structure du répertoire des compétences."
tags:
  - "Tutoriel de Démarrage"
  - "Installation de Compétence"
prerequisite:
  - "start-installation"
order: 4
---

# Installer votre première compétence

## Ce que vous apprendrez

- Installer des compétences depuis le dépôt officiel d'Anthropic dans votre projet
- Utiliser l'interface de sélection interactive pour choisir les compétences nécessaires
- Comprendre où les compétences sont installées (répertoire .claude/skills/)
- Vérifier que la compétence a été installée avec succès

::: info Prérequis

Ce tutoriel suppose que vous avez déjà terminé [l'installation d'OpenSkills](../installation/). Si ce n'est pas encore fait, veuillez d'abord suivre les étapes d'installation.

:::

---

## Votre situation actuelle

Vous venez peut-être d'installer OpenSkills, mais :

- **Vous ne savez pas où trouver des compétences** : Il existe de nombreux dépôts de compétences sur GitHub, mais vous ne savez pas lesquels sont officiels
- **Vous ne savez pas comment installer une compétence** : Vous savez qu'il y a une commande `install`, mais vous ne savez pas comment l'utiliser
- **Vous craignez de l'installer au mauvais endroit** : Vous avez peur que la compétence soit installée globalement sur le système et que vous ne la retrouviez pas si vous changez de projet

Ces problèmes sont très courants. Résolvons-les étape par étape.

---

## Quand utiliser cette méthode

**L'installation de la première compétence** convient aux scénarios suivants :

- Première utilisation d'OpenSkills, vous souhaitez une expérience rapide
- Besoin d'utiliser les compétences fournies officiellement par Anthropic (comme le traitement PDF, les workflows Git, etc.)
- Souhait d'utiliser des compétences dans le projet actuel plutôt que de les installer globalement

::: tip Recommandation

Pour la première installation, il est conseillé de commencer par le dépôt officiel d'Anthropic `anthropics/skills`, ces compétences sont de haute qualité et validées.

:::

---

## 🎒 Préparatifs avant de commencer

Avant de commencer, veuillez confirmer :

- [ ] [L'installation d'OpenSkills](../installation/) est terminée
- [ ] Vous êtes dans le répertoire de votre projet
- [ ] Git est configuré (pour cloner les dépôts GitHub)

::: warning Vérification des prérequis

Si vous n'avez pas encore de répertoire de projet, vous pouvez créer un répertoire temporaire pour vous entraîner :

```bash
mkdir my-project && cd my-project
```

:::

---

## Concept clé : Installer des compétences depuis GitHub

OpenSkills prend en charge l'installation de compétences depuis des dépôts GitHub. Le processus d'installation se déroule comme suit :

```
[Spécifier le dépôt] → [Cloner dans un répertoire temporaire] → [Rechercher SKILL.md] → [Sélection interactive] → [Copier dans .claude/skills/]
```

**Points clés** :
- Utilisez le format `owner/repo` pour spécifier un dépôt GitHub
- L'outil clone automatiquement le dépôt dans un répertoire temporaire
- Recherche tous les sous-répertoires contenant un fichier `SKILL.md`
- Sélectionnez les compétences à installer via une interface interactive
- Les compétences sont copiées dans le répertoire `.claude/skills/` du projet

---

## Suivez le guide

### Étape 1 : Accéder au répertoire du projet

Tout d'abord, accédez au répertoire du projet sur lequel vous travaillez :

```bash
cd /chemin/vers/votre/projet
```

**Pourquoi**

Par défaut, OpenSkills installe les compétences dans le répertoire `.claude/skills/` du projet, permettant ainsi de versionner les compétences avec le projet et de les partager avec les membres de l'équipe.

**Ce que vous devriez voir** :

Votre répertoire de projet devrait contenir l'un des éléments suivants :

- `.git/` (dépôt Git)
- `package.json` (projet Node.js)
- Autres fichiers de projet

::: tip Recommandation

Même pour un nouveau projet, il est conseillé d'initialiser d'abord un dépôt Git pour mieux gérer les fichiers de compétences.

:::

---

### Étape 2 : Installer la compétence

Utilisez la commande suivante pour installer des compétences depuis le dépôt officiel d'Anthropic :

```bash
npx openskills install anthropics/skills
```

**Pourquoi**

`anthropics/skills` est le dépôt de compétences maintenu officiellement par Anthropic, contenant des exemples de compétences de haute qualité, idéal pour une première expérience.

**Ce que vous devriez voir** :

La commande lancera une interface de sélection interactive :

```
Installing from: anthropics/skills
Location: project (.claude/skills)
Default install is project-local (./.claude/skills). Use --global for ~/.claude/skills.

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)    Comprehensive PDF manipulation toolkit for extracting text and tables...
  ◯ git-workflow (12 KB)   Git workflow: Best practices for commits, branches, and PRs...
  ◯ check-branch-first (8 KB)    Git workflow: Always check current branch before making changes...
  ◯ skill-creator (16 KB)   Guide for creating effective skills...

<Space> Select  <a> Select All  <i> Invert  <Enter> Confirm
```

**Guide d'utilisation** :

```
┌─────────────────────────────────────────────────────────────┐
│  Instructions                                               │
│                                                             │
│  Étape 1         Étape 2          Étape 3                   │
│  Déplacer le curseur → Appuyer sur Espace pour sélectionner → Appuyer sur Entrée pour confirmer │
│                                                             │
│  ○ Non sélectionné     ◉ Sélectionné                        │
└─────────────────────────────────────────────────────────────┘

Vous devriez voir :
- Le curseur peut se déplacer vers le haut et vers le bas
- Appuyez sur la barre d'espace pour basculer l'état de sélection (○ ↔ ◉)
- Appuyez sur Entrée pour confirmer l'installation
```

---

### Étape 3 : Sélectionner la compétence

Dans l'interface interactive, sélectionnez la compétence que vous souhaitez installer.

**Exemple** :

Supposons que vous souhaitez installer la compétence de traitement PDF :

```
? Select skills to install:
❯ ◉ pdf (24 KB)    ← Sélectionnez ceci
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

Actions :
1. **Déplacer le curseur** : Utilisez les touches fléchées haut/bas pour vous déplacer sur la ligne `pdf`
2. **Sélectionner la compétence** : Appuyez sur la **barre d'espace**, assurez-vous que c'est `◉` et non `◯`
3. **Confirmer l'installation** : Appuyez sur la touche **Entrée** pour commencer l'installation

**Ce que vous devriez voir** :

```
✅ Installed: pdf
   Location: /chemin/vers/votre/projet/.claude/skills/pdf

Skills installed to: /chemin/vers/votre/projet/.claude/skills/

Next steps:
  → Run openskills sync to generate AGENTS.md with your installed skills
  → Run openskills list to see all installed skills
```

::: tip Opérations avancées

Si vous souhaitez installer plusieurs compétences en une seule fois :
- Appuyez sur la barre d'espace pour sélectionner chaque compétence nécessaire (plusieurs `◉`)
- Appuyez sur `<a>` pour sélectionner toutes les compétences
- Appuyez sur `<i>` pour inverser la sélection actuelle

:::

---

### Étape 4 : Vérifier l'installation

Une fois l'installation terminée, vérifiez que la compétence a été correctement installée dans le répertoire du projet.

**Vérifier la structure du répertoire** :

```bash
ls -la .claude/skills/
```

**Ce que vous devriez voir** :

```
.claude/skills/
└── pdf/
    ├── SKILL.md
    ├── .openskills.json
    ├── references/
    │   ├── pdf-extraction.md
    │   └── table-extraction.md
    └── scripts/
        └── extract-pdf.js
```

**Description des fichiers clés** :

| Fichier | Utilisation |
|---------|-------------|
| `SKILL.md` | Contenu principal et instructions de la compétence |
| `.openskills.json` | Métadonnées d'installation (enregistre la source, utilisé pour les mises à jour) |
| `references/` | Documentation de référence et explications détaillées |
| `scripts/` | Scripts exécutables |

**Afficher les métadonnées de la compétence** :

```bash
cat .claude/skills/pdf/.openskills.json
```

**Ce que vous devriez voir** :

```json
{
  "source": "anthropics/skills",
  "sourceType": "git",
  "repoUrl": "https://github.com/anthropics/skills",
  "subpath": "pdf",
  "installedAt": "2026-01-24T10:30:00.000Z"
}
```

Ce fichier de métadonnées enregistre les informations de source de la compétence, qui seront utilisées lors des futures mises à jour avec `openskills update`.

---

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, veuillez confirmer :

- [ ] L'interface de sélection interactive s'affiche dans la ligne de commande
- [ ] Au moins une compétence a été sélectionnée avec succès (précédée de `◉`)
- [ ] L'installation a réussi, affichant le message `✅ Installed:`
- [ ] Le répertoire `.claude/skills/` a été créé
- [ ] Le répertoire de la compétence contient le fichier `SKILL.md`
- [ ] Le répertoire de la compétence contient le fichier de métadonnées `.openskills.json`

Si tous les points de contrôle ci-dessus sont validés, félicitations ! Votre première compétence est installée avec succès.

---

## Pièges à éviter

### Problème 1 : Échec du clonage du dépôt

**Symptôme** :

```
✗ Failed to clone repository
fatal: repository 'https://github.com/anthropics/skills' not found
```

**Cause** :
- Problème de connexion réseau
- Adresse du dépôt GitHub incorrecte

**Solution** :
1. Vérifiez la connexion réseau : `ping github.com`
2. Confirmez que l'adresse du dépôt est correcte (format `owner/repo`)

---

### Problème 2 : Pas d'interface de sélection interactive

**Symptôme** :

La commande installe directement toutes les compétences sans afficher l'interface de sélection.

**Cause** :
- Il n'y a qu'un seul fichier `SKILL.md` dans le dépôt (dépôt à compétence unique)
- L'option `-y` ou `--yes` a été utilisée (sauter la sélection)

**Solution** :
- S'il s'agit d'un dépôt à compétence unique, c'est un comportement normal
- Si vous avez besoin de sélectionner, retirez l'option `-y`

---

### Problème 3 : Erreur de permission

**Symptôme** :

```
Error: EACCES: permission denied, mkdir '.claude/skills'
```

**Cause** :
- Le répertoire actuel n'a pas les permissions d'écriture

**Solution** :
1. Vérifiez les permissions du répertoire : `ls -la`
2. Utilisez `sudo` ou passez à un répertoire avec les permissions appropriées

---

### Problème 4 : Impossible de trouver SKILL.md

**Symptôme** :

```
Error: No SKILL.md files found in repository
```

**Cause** :
- Le dépôt ne contient pas de fichiers de compétence au format requis

**Solution** :
1. Confirmez que le dépôt est bien un dépôt de compétences
2. Vérifiez la structure du répertoire dans le dépôt

---

## Résumé de la leçon

Grâce à cette leçon, vous avez appris :

- **Utiliser `openskills install anthropics/skills`** pour installer des compétences depuis le dépôt officiel
- **Sélectionner des compétences dans l'interface interactive**, utilisez la barre d'espace pour sélectionner, Entrée pour confirmer
- **Les compétences sont installées dans `.claude/skills/`**, contenant `SKILL.md` et les métadonnées
- **Vérifier le succès de l'installation**, en vérifiant la structure du répertoire et le contenu des fichiers

**Commandes essentielles** :

| Commande | Fonction |
|----------|----------|
| `npx openskills install anthropics/skills` | Installer des compétences depuis le dépôt officiel |
| `ls .claude/skills/` | Voir les compétences installées |
| `cat .claude/skills/<nom>/.openskills.json` | Voir les métadonnées de la compétence |

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[à utiliser les compétences](../read-skills/)**.
>
> Vous apprendrez :
> - Utiliser la commande `openskills read` pour lire le contenu des compétences
> - Comprendre comment l'agent IA charge les compétences dans le contexte
> - Maîtriser l'ordre de priorité à 4 niveaux pour la recherche de compétences

L'installation de compétences n'est que la première étape, ensuite il faut comprendre comment l'agent IA utilise ces compétences.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonction | Chemin du fichier | Ligne |
|----------|-------------------|-------|
| Point d'entrée de la commande d'installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L183) | 83-183 |
| Détermination de l'emplacement d'installation (projet vs global) | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| Analyse du raccourci GitHub | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Clonage du dépôt | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Recherche récursive de compétences | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L358-L373) | 358-373 |
| Interface de sélection interactive | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L427-L455) | 427-455 |
| Copie et installation de la compétence | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L461-L486) | 461-486 |
| Liste des compétences officielles (avertissement de conflit) | [`src/utils/marketplace-skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/marketplace-skills.ts) | 1-25 |

**Fonctions clés** :
- `installFromRepo()` - Installer des compétences depuis un dépôt, prend en charge la sélection interactive
- `installSpecificSkill()` - Installer une compétence spécifique à un sous-chemin
- `installFromLocal()` - Installer des compétences depuis un chemin local
- `warnIfConflict()` - Vérifier et avertir en cas de conflit de compétences

**Constantes clés** :
- `ANTHROPIC_MARKETPLACE_SKILLS` - Liste des compétences de l'Anthropic Marketplace, utilisée pour les avertissements de conflit

</details>
