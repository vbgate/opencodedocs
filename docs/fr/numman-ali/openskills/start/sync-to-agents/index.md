---
title: "Synchronisation des compétences : Générer AGENTS.md | openskills"
sidebarTitle: "Informer l'IA des compétences"
subtitle: "Synchronisation des compétences : Générer AGENTS.md"
description: "Apprenez à utiliser la commande openskills sync pour générer le fichier AGENTS.md, permettant aux agents IA (Claude Code, Cursor) de connaître les compétences installées. Maîtrisez la sélection et la synchronisation des compétences pour optimiser l'utilisation du contexte IA."
tags:
  - "Tutoriel débutant"
  - "Synchronisation des compétences"
  - "AGENTS.md"
prerequisite:
  - "start-first-skill"
order: "5"
---

# Synchroniser les compétences vers AGENTS.md

## Ce que vous apprendrez

- Utiliser `openskills sync` pour générer le fichier AGENTS.md
- Comprendre comment les agents IA découvrent les compétences disponibles via AGENTS.md
- Sélectionner les compétences à synchroniser et contrôler la taille du contexte IA
- Utiliser un chemin de sortie personnalisé pour s'intégrer dans une documentation existante
- Comprendre le format XML d'AGENTS.md et son utilisation

::: info Prérequis

Ce tutoriel suppose que vous avez déjà terminé [l'installation d'une première compétence](../first-skill/). Si vous n'avez pas encore installé de compétence, suivez d'abord les étapes d'installation.

:::

---

## Votre situation actuelle

Vous avez peut-être installé des compétences, mais vous constatez que :

- **Les agents IA ne savent pas que des compétences sont disponibles** : les compétences sont installées, mais les agents IA (comme Claude Code) ignorent totalement leur existence
- **Vous ne savez pas comment informer l'IA des compétences** : vous avez entendu parler d'`AGENTS.md`, mais vous ne comprenez pas ce que c'est ni comment le générer
- **Vous craignez que trop de compétences n'occupent trop de contexte** : vous avez installé de nombreuses compétences et souhaitez une synchronisation sélective plutôt que de tout révéler à l'IA

La根源 de ces problèmes est simple : **l'installation d'une compétence et sa disponibilité pour l'IA sont deux choses différentes**. L'installation consiste simplement à télécharger les fichiers ; pour que l'IA soit au courant, il faut synchroniser vers AGENTS.md.

---

## Quand utiliser cette approche

La **synchronisation des compétences vers AGENTS.md** est adaptée dans ces situations :

- Vous venez d'installer des compétences et devez informer les agents IA de leur existence
- Après avoir ajouté de nouvelles compétences, vous mettez à jour la liste des compétences disponibles pour l'IA
- Après avoir supprimé une compétence, vous la retirez d'AGENTS.md
- Vous souhaitez synchroniser sélectivement les compétences pour contrôler la taille du contexte IA
- Dans un environnement multi-agents, vous avez besoin d'une liste de compétences unifiée

::: tip Bonne pratique

Après chaque installation, mise à jour ou suppression de compétence, exécutez `openskills sync` pour maintenir AGENTS.md aligné avec les compétences réelles.

:::

---

## 🎒 Préparation avant de commencer

Avant de commencer, vérifiez que :

- [ ] Vous avez terminé [l'installation d'au moins une compétence](../first-skill/)
- [ ] Vous êtes dans votre répertoire de projet
- [ ] Vous connaissez l'emplacement des compétences (project ou global)

::: warning Vérification préalable

Si aucune compétence n'est installée, exécutez d'abord :

```bash
npx openskills install anthropics/skills
```

:::

---

## Idée clé : Installation ≠ Disponibilité pour l'IA

La gestion des compétences OpenSkills se déroule en deux phases :

```
[Phase d'installation]       [Phase de synchronisation]
Compétence → .claude/skills/  →  AGENTS.md
    ↓                            ↓
  Fichiers existants        Agent IA lit
    ↓                            ↓
  Localement dispo         L'IA sait et peut utiliser
```

**Points clés** :

1. **Phase d'installation** : avec `openskills install`, les compétences sont copiées dans le répertoire `.claude/skills/`
2. **Phase de synchronisation** : avec `openskills sync`, les informations sur les compétences sont écrites dans `AGENTS.md`
3. **Lecture par l'IA** : l'agent IA lit `AGENTS.md` et connaît les compétences disponibles
4. **Chargement à la demande** : l'IA utilise `openskills read <skill>` pour charger une compétence spécifique selon les besoins de la tâche

**Pourquoi AGENTS.md est-il nécessaire ?**

Les agents IA (comme Claude Code, Cursor) ne analysent pas activement le système de fichiers. Ils ont besoin d'une "liste de compétences" explicite, leur indiquant quels outils sont à leur disposition. Cette liste est précisément `AGENTS.md`.

---

## Suivez les étapes

### Étape 1 : Accéder au répertoire du projet

Tout d'abord, accédez au répertoire où vous avez installé les compétences :

```bash
cd /path/to/your/project
```

**Pourquoi**

`openskills sync` recherche par défaut les compétences installées dans le répertoire courant et génère ou met à jour `AGENTS.md` dans ce même répertoire.

**Ce que vous devriez voir**

Votre répertoire de projet doit contenir le répertoire `.claude/skills/` (si vous avez installé des compétences) :

```bash
ls -la
# Exemple de sortie :
drwxr-xr-x  5 user  staff  .claude
drwxr-xr-x  5 user  staff  .claude/skills/
-rw-r--r-- 1 user  staff  package.json
```

---

### Étape 2 : Synchroniser les compétences

Utilisez la commande suivante pour synchroniser les compétences installées vers AGENTS.md :

```bash
npx openskills sync
```

**Pourquoi**

La commande `sync` recherche toutes les compétences installées, génère une liste de compétences au format XML et l'écrit dans le fichier `AGENTS.md`.

**Ce que vous devriez voir**

La commande lance une interface de sélection interactive :

```
Found 2 skill(s)

? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...
  ◉ check-branch-first          (global)   Git workflow: Always check current branch...

<Space> Sélectionner  <a> Tout sélectionner  <i> Inverser  <Enter> Confirmer
```

**Guide d'utilisation** :

```
┌─────────────────────────────────────────────────────────────┐
│  Instructions                                                │
│                                                             │
│  Étape 1          Étape 2           Étape 3                 │
│  Déplacer curseur → Appuyer sur Espace → Appuyer sur Enter  │
│                                                             │
│  ○ Non sélectionné      ◉ Sélectionné                       │
│                                                             │
│  (project)        Compétence projet, surlignée en bleu      │
│  (global)         Compétence globale, affichée en gris      │
└─────────────────────────────────────────────────────────────┘

Ce que vous devriez observer :
- Le curseur peut être déplacé vers le haut et le bas
- Appuyez sur Espace pour basculer l'état de sélection (○ ↔ ◉)
- Les compétences projet sont affichées en bleu, les compétences globales en gris
- Appuyez sur Enter pour confirmer la synchronisation
```

::: tip Pré-sélection intelligente

Si c'est la première synchronisation, l'outil sélectionne par défaut toutes les **compétences projet**. Si vous mettez à jour un AGENTS.md existant, l'outil présélectionne les **compétences déjà activées** dans le fichier.

:::

---

### Étape 3 : Sélectionner les compétences

Dans l'interface interactive, sélectionnez les compétences que vous souhaitez rendre visibles pour les agents IA.

**Exemple**

Supposons que vous vouliez synchroniser toutes les compétences installées :

```
? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)
  ◉ git-workflow                (project)
  ◯ check-branch-first          (global)   ← Ne pas sélectionner cette compétence globale
```

Actions :
1. **Déplacer le curseur** : utilisez les touches fléchées haut et bas
2. **Sélectionner/Désélectionner** : appuyez sur **Espace** pour basculer l'état de sélection (`○` ↔ `◉`)
3. **Confirmer la synchronisation** : appuyez sur **Entrée** pour lancer la synchronisation

**Ce que vous devriez voir**

```
✅ Synced 2 skill(s) to AGENTS.md
```

::: tip Stratégie de sélection

- **Compétences projet** : compétences dédiées au projet actuel, recommandées pour la synchronisation
- **Compétences globales** : compétences génériques (comme les normes de code), à synchroniser selon les besoins
- **Éviter la surcharge** : trop de compétences occupent le contexte IA, il est recommandé de ne synchroniser que les compétences fréquemment utilisées

:::

---

### Étape 4 : Consulter AGENTS.md

Après la synchronisation, consultez le fichier AGENTS.md généré :

```bash
cat AGENTS.md
```

**Ce que vous devriez voir**

```markdown
# AGENTS.md

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms...</description>
<location>project</location>
</skill>

<skill>
<name>git-workflow</name>
<description>Git workflow: Best practices for commits, branches, and PRs, ensuring clean history and effective collaboration.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

**Explication des éléments clés**

| Élément | Fonction |
| --- | --- |
| `<skills_system>` | Balise XML indiquant à l'IA qu'il s'agit d'une définition de système de compétences |
| `<usage>` | Instructions d'utilisation, expliquant à l'IA comment invoquer les compétences |
| `<available_skills>` | Liste des compétences disponibles |
| `<skill>` | Définition d'une compétence individuelle |
| `<name>` | Nom de la compétence |
| `<description>` | Description de la compétence |
| `<location>` | Emplacement de la compétence |

::: info Pourquoi le format XML ?

Le format XML est le format standard pour les agents IA (particulièrement Claude Code), facilitant l'analyse et la compréhension. L'outil prend également en charge le format de commentaires HTML comme alternative.

:::

---

### Étape 5 : Vérifier la lecture par l'IA

Maintenant, faites en sorte que l'agent IA lise AGENTS.md pour vérifier qu'il connaît les compétences disponibles.

**Exemple de conversation**

```
Utilisateur :
Je veux extraire des données de tableau d'un fichier PDF

Agent IA :
Je peux utiliser la compétence `pdf` pour vous aider à extraire les données de tableau. Laissez-moi d'abord lire les détails de cette compétence.

L'agent IA exécute :
npx openskills read pdf

Sortie :
Skill: pdf
Base Directory: /path/to/project/.claude/skills/pdf

[Contenu détaillé de la compétence PDF...]

Agent IA :
Très bien, j'ai chargé la compétence PDF. Maintenant je peux vous aider à extraire les données de tableau...
```

**Ce que vous devriez observer**

- L'agent IA reconnaît qu'il peut utiliser la compétence `pdf`
- L'agent IA exécute automatiquement `npx openskills read pdf` pour charger le contenu de la compétence
- L'agent IA exécute la tâche selon les instructions de la compétence

---

### Étape 6 (optionnelle) : Chemin de sortie personnalisé

Si vous souhaitez synchroniser les compétences vers un autre fichier (comme `.ruler/AGENTS.md`), utilisez l'option `-o` ou `--output` :

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**Pourquoi**

Certains outils (comme Windsurf) peuvent attendre AGENTS.md dans un répertoire spécifique. L'option `-o` permet de personnaliser flexiblement le chemin de sortie.

**Ce que vous devriez voir**

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: tip Synchronisation non-interactive

Dans un environnement CI/CD, vous pouvez utiliser le flag `-y` ou `--yes` pour passer la sélection interactive et synchroniser toutes les compétences :

```bash
npx openskills sync -y
```

:::

---

## Points de vérification ✅

Après avoir complété les étapes ci-dessus, vérifiez que :

- [ ] La ligne de commande affiche l'interface de sélection interactive
- [ ] Vous avez réussi à sélectionner au moins une compétence (marquée par `◉`)
- [ ] La synchronisation a réussi, avec le message `✅ Synced X skill(s) to AGENTS.md`
- [ ] Le fichier `AGENTS.md` a été créé ou mis à jour
- [ ] Le fichier contient les balises XML `<skills_system>`
- [ ] Le fichier contient la liste des compétences `<available_skills>`
- [ ] Chaque `<skill>` contient `<name>`, `<description>` et `<location>`

Si toutes les vérifications sont passées, félicitations ! Les compétences ont été synchronisées avec succès vers AGENTS.md, et les agents IA peuvent maintenant les connaître et les utiliser.

---

## Pièges à éviter

### Problème 1 : Aucune compétence trouvée

**Symptôme**

```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Cause**

- Aucune compétence n'est installée ni dans le répertoire courant ni dans le répertoire global

**Solution**

1. Vérifiez si des compétences sont installées :

```bash
npx openskills list
```

2. Si aucune, installez d'abord des compétences :

```bash
npx openskills install anthropics/skills
```

---

### Problème 2 : AGENTS.md ne se met pas à jour

**Symptôme**

Après avoir exécuté `openskills sync`, le contenu d'AGENTS.md n'a pas changé.

**Cause**

- Vous avez utilisé le flag `-y`, mais la liste de compétences est identique à sebelumnya
- AGENTS.md existe déjà, mais la synchronisation concerne les mêmes compétences

**Solution**

1. Vérifiez si vous avez utilisé le flag `-y`

```bash
# Supprimez -y, passez en mode interactif pour resélectionner
npx openskills sync
```

2. Vérifiez que vous êtes dans le bon répertoire

```bash
# Confirmez que vous êtes dans le répertoire du projet où les compétences sont installées
pwd
ls .claude/skills/
```

---

### Problème 3 : L'agent IA ne connaît pas les compétences

**Symptôme**

AGENTS.md a été généré, mais l'agent IA ne sait toujours pas que des compétences sont disponibles.

**Cause**

- L'agent IA n'a pas lu AGENTS.md
- Le format d'AGENTS.md est incorrect
- L'agent IA ne prend pas en charge le système de compétences

**Solution**

1. Confirmez qu'AGENTS.md est à la racine du projet
2. Vérifiez que le format d'AGENTS.md est correct (contient les balises `<skills_system>`)
3. Vérifiez si l'agent IA prend en charge AGENTS.md (comme Claude Code ; d'autres outils peuvent nécessiter une configuration)

---

### Problème 4 : Le fichier de sortie n'est pas un markdown

**Symptôme**

```
Error: Output file must be a markdown file (.md)
```

**Cause**

- Vous avez utilisé l'option `-o`, mais le fichier spécifié n'a pas l'extension `.md`

**Solution**

1. Assurez-vous que le fichier de sortie se termine par `.md`

```bash
# ❌ Erreur
npx openskills sync -o skills.txt

# ✅ Correct
npx openskills sync -o skills.md
```

---

### Problème 5 : Annulation de toutes les sélections

**Symptôme**

Dans l'interface interactive, après avoir désélectionné toutes les compétences, la section compétences d'AGENTS.md est supprimée.

**Cause**

C'est un comportement normal. Si vous annulez toutes les compétences, l'outil supprime la section compétences d'AGENTS.md.

**Solution**

S'il s'agit d'une erreur, réexécutez `openskills sync` et sélectionnez les compétences à synchroniser.

---

## Résumé de cette leçon

Through ce cours, vous avez appris :

- **Utiliser `openskills sync`** pour générer le fichier AGENTS.md
- **Comprendre le processus de synchronisation des compétences** : installation → synchronisation → lecture par l'IA → chargement à la demande
- **Sélectionner interactivement les compétences** et contrôler la taille du contexte IA
- **Personnaliser le chemin de sortie** pour s'intégrer dans un système de documentation existant
- **Comprendre le format AGENTS.md**, incluant les balises XML `<skills_system>` et la liste des compétences

**Commandes clés**

| Commande | Fonction |
| --- | --- |
| `npx openskills sync` | Synchroniser interactivement les compétences vers AGENTS.md |
| `npx openskills sync -y` | Synchroniser toutes les compétences de manière non-interactive |
| `npx openskills sync -o custom.md` | Synchroniser vers un fichier personnalisé |
| `cat AGENTS.md` | Consulter le contenu généré d'AGENTS.md |

**Points essentiels du format AGENTS.md**

- Utiliser les balises XML `<skills_system>` pour l'encapsulation
- Inclure les instructions d'utilisation `<usage>`
- Inclure la liste des compétences `<available_skills>`
- Chaque `<skill>` contient `<name>`, `<description>` et `<location>`

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[à utiliser les compétences](../read-skills/)**.
>
> Vous apprendrez :
> - Comment les agents IA utilisent la commande `openskills read` pour charger les compétences
> - Le processus complet de chargement des compétences
> - Comment lire plusieurs compétences
> - La structure et les composants du contenu des compétences

La synchronisation des compétences ne fait que informer l'IA des outils disponibles ; lors de l'utilisation réelle, l'IA chargera le contenu spécifique d'une compétence via la commande `openskills read`.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| Point d'entrée de la commande sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| Validation du fichier de sortie | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19-L26) | 19-26 |
| Création du fichier s'il n'existe pas | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| Interface de sélection interactive | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| Parsing d'AGENTS.md existant | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Génération du XML des compétences | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| Remplacement de la section compétences | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| Suppression de la section compétences | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L98-L122) | 98-122 |

**Fonctions clés** :
- `syncAgentsMd()` - Synchroniser les compétences vers le fichier AGENTS.md
- `parseCurrentSkills()` - Parser les noms des compétences dans AGENTS.md existant
- `generateSkillsXml()` - Générer la liste des compétences au format XML
- `replaceSkillsSection()` - Remplacer ou ajouter la section compétences dans le fichier
- `removeSkillsSection()` - Supprimer la section compétences du fichier

**Constantes clés** :
- `AGENTS.md` - Nom de fichier de sortie par défaut
- `<skills_system>` - Balise XML pour marquer la définition du système de compétences
- `<available_skills>` - Balise XML pour marquer la liste des compétences disponibles

**Logique importante** :
- Par défaut, présélectionner les compétences existantes dans le fichier (mise à jour incrémentale)
- Première synchronisation : sélectionner toutes les compétences projet par défaut
- Prise en charge de deux formats de marquage : balises XML et commentaires HTML
- Suppression de la section compétences (et non conservation d'une liste vide) lors de l'annulation de toutes les sélections

</details>
