---
title: "Commande read : Lire le contenu des compétences installées | openskills"
sidebarTitle: "Lire les compétences installées"
subtitle: "Commande read : Lire le contenu des compétences installées"
description: "Apprenez à utiliser la commande openskills read pour lire le contenu des compétences installées. Maîtrisez les 4 niveaux de priorité de recherche de compétences et le processus de chargement complet, avec support de la lecture de plusieurs compétences, aidant les agents IA à obtenir rapidement les définitions de compétences et à exécuter des tâches."
tags:
  - "Tutoriel pour débutants"
  - "Utilisation des compétences"
prerequisite:
  - "start-first-skill"
order: "6"
---

# Utiliser les compétences

## Ce que vous apprendrez

- Utiliser la commande `openskills read` pour lire le contenu des compétences installées
- Comprendre comment les agents IA chargent les compétences via cette commande
- Maîtriser l'ordre des 4 niveaux de priorité de recherche de compétences
- Savoir lire plusieurs compétences en une seule fois (séparées par des virgules)

::: info Prérequis

Ce tutor assumes que vous avez [installé au moins une compétence](../first-skill/). Si vous n'avez pas encore installé de compétence, veuillez d'abord suivre les étapes d'installation.

:::

---

## Votre situation actuelle

Vous avez peut-être installé des compétences, mais vous rencontrez ces problèmes :

- **Vous ne savez pas comment faire utiliser les compétences à l'IA** : les compétences sont installées, mais comment l'agent IA les lit-il ?
- **Vous ne comprenez pas le rôle de la commande read** : vous savez qu'il y a une commande `read`, mais vous ne savez pas ce qu'elle affiche
- **Vous ne connaissez pas l'ordre de recherche des compétences** : il y a des compétences globales et de projet, laquelle l'IA utilisera-t-elle ?

Ces problèmes sont très courants. Résolvons-les étape par étape.

---

## Quand utiliser cette approche

**L'utilisation des compétences (commande read)** est adaptée dans ces situations :

- **L'agent IA doit exécuter une tâche spécifique** : comme traiter des PDF, manipuler des dépôts Git, etc.
- **Valider le contenu d'une compétence** : vérifier si les instructions du SKILL.md correspondent aux attentes
- **Comprendre la structure complète d'une compétence** : consulter les ressources comme references/, scripts/, etc.

::: tip Bonne pratique

Habituellement, vous n'utilisez pas directement la commande `read`, elle est appelée automatiquement par l'agent IA. Cependant, comprendre son format de sortie est utile pour le débogage et le développement de compétences personnalisées.

:::

---

## ⚒️ Préparation

Avant de commencer, veuillez confirmer :

- [ ] Vous avez terminé [l'installation de la première compétence](../first-skill/)
- [ ] Vous avez installé au moins une compétence dans votre répertoire de projet
- [ ] Vous pouvez consulter le répertoire `.claude/skills/`

::: warning Vérification préalable

Si vous n'avez pas encore installé de compétence, vous pouvez en installer une rapidement pour tester :

```bash
npx openskills install anthropics/skills
# Dans l'interface interactive, choisissez n'importe quelle compétence (comme pdf)
```

:::

---

## Approche principale : Rechercher et afficher les compétences par priorité

La commande `read` d'OpenSkills suit ce processus :

```
[Nom de compétence spécifié] → [Recherche par priorité] → [Premier trouvé] → [Lecture du SKILL.md] → [Sortie sur stdout]
```

**Points clés** :

- **4 niveaux de recherche par priorité** :
  1. `.agent/skills/` (universel projet)
  2. `~/.agent/skills/` (universel global)
  3. `.claude/skills/` (claude projet)
  4. `~/.claude/skills/` (claude global)

- **Retourne le premier correspondance** : s'arrête au premier trouvé, ne continue pas dans les répertoires suivants
- **Affiche le répertoire de base** : les agents IA ont besoin de ce chemin pour résoudre les fichiers de ressources

---

## Suivez les étapes

### Étape 1 : Lire une compétence unique

Tout d'abord, essayez de lire une compétence installée.

**Exemple de commande** :

```bash
npx openskills read pdf
```

**Pourquoi**

`pdf` est le nom de la compétence que nous avons installée dans la leçon précédente. Cette commande recherchera et affichera le contenu complet de cette compétence.

**Ce que vous devriez voir** :

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit for extracting text and tables...
...

Skill read: pdf
```

**Analyse de la structure de sortie** :

| Partie | Contenu | Rôle |
| --- | --- | --- |
| `Reading: pdf` | Nom de la compétence | Identifie la compétence en cours de lecture |
| `Base directory: ...` | Répertoire de base de la compétence | L'IA utilise ce chemin pour résoudre les ressources comme references/, scripts/ |
| Contenu SKILL.md | Définition complète de la compétence | Contient les instructions, références aux ressources, etc. |
| `Skill read: pdf` | Marqueur de fin | Identifie la fin de la lecture |

::: tip Important

Le **répertoire de base (Base directory)** est très important. Les chemins comme `references/some-doc.md` dans la compétence seront résolus relativement à ce répertoire.

:::

---

### Étape 2 : Lire plusieurs compétences

OpenSkills prend en charge la lecture de plusieurs compétences en une seule fois, les noms séparés par des virgules.

**Exemple de commande** :

```bash
npx openskills read pdf,git-workflow
```

**Pourquoi**

Lire plusieurs compétences en une seule fois réduit le nombre d'appels de commande et améliore l'efficacité.

**Ce que vous verrez** :

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit...
...

Skill read: pdf

Reading: git-workflow
Base directory: /path/to/your/project/.claude/skills/git-workflow

---
name: git-workflow
description: Git workflow: Best practices...
...

Skill read: git-workflow
```

**Caractéristiques** :
- La sortie de chaque compétence est séparée par une ligne vide
- Chaque compétence a ses propres marqueurs `Reading:` et `Skill read:`
- Les compétences sont lues dans l'ordre spécifié dans la commande

::: tip Utilisation avancée

Les noms de compétences peuvent contenir des espaces, la commande `read` les gère automatiquement :

```bash
npx openskills read pdf, git-workflow  # Les espaces seront ignorés
```

:::

---

### Étape 3 : Valider la priorité de recherche des compétences

Vérifions que l'ordre de recherche à 4 niveaux est correct.

**Préparation de l'environnement** :

Tout d'abord, installez des compétences dans le répertoire de projet et le répertoire global (avec différentes sources d'installation) :

```bash
# Installation locale dans le projet (dans le répertoire du projet actuel)
npx openskills install anthropics/skills

# Installation globale (avec --global)
npx openskills install anthropics/skills --global
```

**Validation de la priorité** :

```bash
# Lister toutes les compétences
npx openskills list
```

**Ce que vous verrez** :

```
Available skills:

pdf (project)      /path/to/your/project/.claude/skills/pdf
pdf (global)       /home/user/.claude/skills/pdf

Total: 2 skills (1 project, 1 global)
```

**Lecture de la compétence** :

```bash
npx openskills read pdf
```

**Ce que vous verrez** :

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf  ← Retourne la compétence de projet en priorité
...
```

**Conclusion** : Comme `.claude/skills/` (projet) a une priorité supérieure à `~/.claude/skills/` (global), la compétence locale du projet est lue.

::: tip Application pratique

Ce mécanisme de priorité vous permet de remplacer les compétences globales dans un projet sans affecter les autres projets. Par exemple :
- Installer des compétences couramment utilisées globalement (partagées entre tous les projets)
- Installer des versions personnalisées dans le projet (remplaçant les versions globales)

:::

---

### Étape 4 : Consulter les ressources complètes de la compétence

Les compétences contiennent non seulement SKILL.md, mais peuvent aussi avoir des ressources comme references/, scripts/.

**Afficher la structure du répertoire de compétence** :

```bash
ls -la .claude/skills/pdf/
```

**Ce que vous verrez** :

```
.claude/skills/pdf/
├── SKILL.md
├── .openskills.json
├── references/
│   ├── pdf-extraction.md
│   └── table-extraction.md
└── scripts/
    └── extract-pdf.js
```

**Lire la compétence et observer la sortie** :

```bash
npx openskills read pdf
```

**Ce que vous verrez** :

La sortie contient des références aux ressources dans SKILL.md, comme :

```markdown
## References

See [PDF extraction guide](references/pdf-extraction.md) for details.

## Scripts

Run `node scripts/extract-pdf.js` to extract text from PDF.
```

::: info Point clé

Lorsque l'agent IA lit une compétence, il :
1. Obtient le chemin du `Base directory`
2. Concatène les chemins relatifs (comme `references/...`) du SKILL.md avec le répertoire de base
3. Lit le contenu réel des fichiers de ressources

C'est pourquoi la commande `read` doit afficher le `Base directory`.

:::

---

## Points de vérification ✅

Après avoir completed les étapes ci-dessus, veuillez confirmer :

- [ ] La ligne de commande affiche le contenu complet du SKILL.md de la compétence
- [ ] La sortie contient `Reading: <name>` et `Base directory: <path>`
- [ ] La sortie se termine par le marqueur de fin `Skill read: <name>`
- [ ] Lors de la lecture de plusieurs compétences, chaque compétence est séparée par une ligne vide
- [ ] La compétence locale du projet est lue en priorité plutôt que la compétence globale

Si tous les points de vérification sont validés, félicitations ! Vous maîtrisez le processus de lecture des compétences.

---

## Pièges à éviter

### Problème 1 : Compétence non trouvée

**Symptôme** :

```
Error: Skill(s) not found: pdf

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Causes** :
- Compétence non installée
- Nom de compétence mal orthographié

**Solutions** :
1. Lister les compétences installées : `npx openskills list`
2. Vérifier que le nom de la compétence est correct
3. Si non installée, utiliser `openskills install` pour l'installer

---

### Problème 2 : Lecture de la mauvaise compétence

**Symptôme** :

On s'attend à lire la compétence de projet, mais on lit en fait la compétence globale.

**Causes** :
- Le répertoire de projet n'est pas le bon emplacement (mauvais répertoire utilisé)

**Solutions** :
1. Vérifier le répertoire de travail actuel : `pwd`
2. S'assurer d'être dans le bon répertoire de projet
3. Utiliser `openskills list` pour voir l'étiquette `location` des compétences

---

### Problème 3 : L'ordre de lecture de plusieurs compétences ne correspond pas aux attentes

**Symptôme** :

```bash
npx openskills read skill-a,skill-b
```

On s'attend à lire d'abord skill-b, mais skill-a est lu en premier.

**Causes** :
- La commande `read` lit dans l'ordre des paramètres spécifiés, sans tri automatique

**Solutions** :
- Si un ordre spécifique est nécessaire, spécifier les noms de compétences dans l'ordre souhaité dans la commande

---

### Problème 4 : Contenu SKILL.md tronqué

**Symptôme** :

Le contenu SKILL.md affiché est incomplet, il manque la fin.

**Causes** :
- Fichier de compétence endommagé ou mal formaté
- Problème d'encodage de fichier

**Solutions** :
1. Vérifier le fichier SKILL.md : `cat .claude/skills/<name>/SKILL.md`
2. Confirmer que le fichier est complet et correctement formaté (doit avoir le YAML frontmatter)
3. Réinstaller la compétence : `openskills update <name>`

---

## Résumé de la leçon

Dans cette leçon, vous avez appris à :

- **Utiliser `openskills read <name>`** pour lire le contenu des compétences installées
- **Comprendre les 4 niveaux de priorité de recherche** : projet universal > global universal > projet claude > global claude
- **Prendre en charge la lecture de plusieurs compétences** : utiliser des virgules pour séparer les noms
- **Format de sortie** :包含 `Reading:`, `Base directory`, contenu de la compétence, marqueur `Skill read:`

**Concepts clés** :

| Concept | Description |
| --- | --- |
| **Priorité de recherche** | 4 répertoires recherchés dans l'ordre, retourne la première correspondance |
| **Répertoire de base** | Répertoire de référence utilisé par l'agent IA pour résoudre les chemins relatifs dans la compétence |
| **Lecture de plusieurs compétences** | Séparées par des virgules, lues dans l'ordre spécifié |

**Commandes clés** :

| Commande | Effet |
| --- | --- |
| `npx openskills read <name>` | Lire une compétence unique |
| `npx openskills read name1,name2` | Lire plusieurs compétences |
| `npx openskills list` | Consulter les compétences installées et leur emplacement |

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons les **[détails des commandes CLI](../../platforms/cli-commands/)**.
>
> Vous apprendrez :
> - La liste complète des commandes OpenSkills et leurs paramètres
> - Comment utiliser les drapeaux de ligne de commande et leur rôle
> - Référence rapide des commandes courantes

Après avoir appris à utiliser les compétences, vous devez ensuite comprendre toutes les commandes fournies par OpenSkills et leurs rôles.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonction | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Point d'entrée de la commande read | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L8-L48) | 8-48 |
| Recherche de compétence (findSkill) | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84) | 69-84 |
| Normalisation des noms de compétences | [`src/utils/skill-names.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-names.ts) | 1-8 |
| Obtention des répertoires de recherche | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L18-L25) | 18-25 |
| Définition de la commande CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L52-L55) | 52-55 |

**Fonctions clés** :
- `readSkill(skillNames)` - Lit les compétences vers stdout, supporte plusieurs noms de compétences
- `findSkill(skillName)` - Recherche la compétence selon les 4 niveaux de priorité, retourne la première correspondance
- `normalizeSkillNames(input)` - Normalise la liste des noms de compétences, supporte la séparation par virgules et la déduplication
- `getSearchDirs()` - Retourne les 4 répertoires de recherche, triés par priorité

**Types clés** :
- `SkillLocation` - Informations sur l'emplacement de la compétence, contient path, baseDir, source

**Priorité des répertoires** (depuis dirs.ts:18-24) :
```typescript
[
  process.cwd() + '/.agent/skills',   // 1. Projet universal
  homedir() + '/.agent/skills',       // 2. Global universal
  process.cwd() + '/.claude/skills',  // 3. Projet claude
  homedir() + '/.claude/skills',      // 4. Global claude
]
```

</details>
