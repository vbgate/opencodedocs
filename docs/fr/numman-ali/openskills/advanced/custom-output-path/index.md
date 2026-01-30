---
title: "Personnalisation du chemin de sortie: gestion flexible de l'emplacement des compétences | openskills"
sidebarTitle: "Placer les compétences n'importe où"
subtitle: "Personnalisation du chemin de sortie: gestion flexible de l'emplacement des compétences | openskills"
description: "Apprenez à utiliser la commande openskills sync -o pour synchroniser les compétences vers n'importe quel emplacement. Prend en charge la création automatique de répertoires pour les environnements multi-outils, répondant aux besoins d'intégration flexibles."
tags:
  - "Fonctionnalités avancées"
  - "Sortie personnalisée"
  - "Synchronisation des compétences"
  - "Option -o"
prerequisite:
  - "start-sync-to-agents"
order: 2
---

# Personnalisation du chemin de sortie

## Ce que vous pourrez faire après avoir terminé

- Utiliser les options `-o` ou `--output` pour synchroniser les compétences vers un fichier `.md` à n'importe quel emplacement
- Comprendre comment l'outil crée automatiquement les fichiers et répertoires inexistants
- Configurer différents fichiers AGENTS.md pour différents outils (Windsurf, Cursor, etc.)
- Gérer les listes de compétences dans un environnement multi-fichiers
- Ignorer le fichier AGENTS.md par défaut et s'intégrer à un système de documentation existant

::: info Connaissances préalables

Ce tutoriel suppose que vous maîtrisez déjà la méthode d'utilisation de [Synchronisation des compétences de base](../../start/sync-to-agents/). Si vous n'avez pas encore installé de compétences ou synchronisé de fichier AGENTS.md, veuillez d'abord terminer le cours prérequis.

:::

---

## Votre problème actuel

Vous avez probablement l'habitude d'utiliser `openskills sync` pour générer `AGENTS.md` par défaut, mais vous pourriez rencontrer :

- **Outils nécessitant des chemins spécifiques**: Certains outils IA (comme Windsurf) s'attendent à trouver AGENTS.md dans un répertoire spécifique (comme `.ruler/`), plutôt qu'à la racine du projet
- **Conflits multi-outils**: Utiliser plusieurs outils de codage simultanément, alors qu'ils s'attendent à trouver AGENTS.md à des emplacements différents
- **Intégration de documentation existante**: Vous avez déjà un document listant les compétences et souhaitez intégrer les compétences d'OpenSkills, plutôt que de créer un nouveau fichier
- **Répertoire inexistant**: Vous souhaitez sortir vers un répertoire imbriqué (comme `docs/ai-skills.md`), mais le répertoire n'existe pas encore

La racine de ces problèmes est : **le chemin de sortie par défaut ne peut pas satisfaire tous les scénarios**. Vous avez besoin d'un contrôle de sortie plus flexible.

---

## Quand utiliser cette technique

La **personnalisation du chemin de sortie** convient à ces scénarios :

- **Environnements multi-outils**: Configurer des fichiers AGENTS.md indépendants pour différents outils IA (comme `.ruler/AGENTS.md` vs `AGENTS.md`)
- **Exigences de structure de répertoire**: Les outils s'attendent à trouver AGENTS.md dans un répertoire spécifique (comme `.ruler/` pour Windsurf)
- **Intégration de documentation existante**: Intégrer la liste des compétences dans un système de documentation existant, plutôt que de créer un nouveau fichier AGENTS.md
- **Gestion organisée**: Stocker les listes de compétences par projet ou fonction (comme `docs/ai-skills.md`)
- **Environnements CI/CD**: Utiliser un chemin fixe pour la sortie dans des processus automatisés

::: tip Pratique recommandée

Si votre projet n'utilise qu'un seul outil IA et que l'outil prend en charge AGENTS.md à la racine du projet, utilisez le chemin par défaut. N'utilisez la personnalisation du chemin de sortie que lorsque vous avez besoin d'une gestion multi-fichiers ou d'exigences de chemin spécifiques aux outils.

:::

---

## 🎒 Préparatifs avant de commencer

Avant de commencer, veuillez confirmer :

- [ ] Vous avez terminé [l'installation d'au moins une compétence](../../start/first-skill/)
- [ ] Vous êtes entré dans votre répertoire de projet
- [ ] Vous connaissez l'utilisation de base d'`openskills sync`

::: warning Vérification préalable

Vérifiez que vous avez des compétences installées :

```bash
npx openskills list
```

Si la liste est vide, installez d'abord les compétences :

```bash
npx openskills install anthropics/skills
```

:::

---

## Concept clé: contrôle de sortie flexible

La fonction de synchronisation d'OpenSkills sort par défaut vers `AGENTS.md`, mais vous pouvez personnaliser le chemin de sortie en utilisant les options `-o` ou `--output`.

```
[Comportement par défaut]            [Sortie personnalisée]
openskills sync      →      AGENTS.md (racine du projet)
openskills sync -o custom.md →  custom.md (racine du projet)
openskills sync -o .ruler/AGENTS.md →  .ruler/AGENTS.md (répertoire imbriqué)
```

**Fonctionnalités clés** :

1. **Chemin arbitraire**: Vous pouvez spécifier n'importe quel chemin de fichier `.md` (chemin relatif ou absolu)
2. **Création automatique de fichiers**: Si le fichier n'existe pas, l'outil le crée automatiquement
3. **Création automatique de répertoires**: Si le répertoire contenant le fichier n'existe pas, l'outil le crée récursivement
4. **Titre intelligent**: Lors de la création d'un fichier, ajoute automatiquement un titre basé sur le nom du fichier (comme `# AGENTS`)
5. **Validation de format**: Doit se terminer par `.md`, sinon une erreur sera générée

**Pourquoi avez-vous besoin de cette fonctionnalité ?**

Différents outils IA peuvent avoir des chemins attendus différents :

| Outil       | Chemin attendu          | Chemin par défaut utilisable |
|-------------|-------------------------|-----------------------------|
| Claude Code | `AGENTS.md`             | ✅ Utilisable               |
| Cursor      | `AGENTS.md`             | ✅ Utilisable               |
| Windsurf    | `.ruler/AGENTS.md`      | ❌ Non utilisable           |
| Aider       | `.aider/agents.md`      | ❌ Non utilisable           |

En utilisant l'option `-o`, vous pouvez configurer le chemin correct pour chaque outil.

---

## Suivez mes étapes

### Étape 1: Utilisation de base - sortie vers le répertoire actuel

Tout d'abord, essayez de synchroniser les compétences vers un fichier personnalisé dans le répertoire actuel :

```bash
npx openskills sync -o my-skills.md
```

**Pourquoi**

Utiliser `-o my-skills.md` indique à l'outil de sortir vers `my-skills.md` plutôt que vers le `AGENTS.md` par défaut.

**Ce que vous devriez voir** :

Si `my-skills.md` n'existe pas, l'outil le créera :

```
Created my-skills.md
```

Puis il lancera l'interface de sélection interactive :

```
Found 2 skill(s)

? Select skills to sync to my-skills.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...

<Espace> sélectionner  <a> tout sélectionner  <i> inverser la sélection  <Entrée> confirmer
```

Après avoir sélectionné les compétences, vous verrez :

```
✅ Synced 2 skill(s) to my-skills.md
```

::: tip Vérifier le fichier généré

Consultez le fichier généré :

```bash
cat my-skills.md
```

Vous verrez :

```markdown
<!-- Titre du fichier: # my-skills -->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help...
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

Notez que la première ligne est `# my-skills`, c'est le titre généré automatiquement par l'outil basé sur le nom du fichier.

:::

---

### Étape 2: Sortie vers un répertoire imbriqué

Maintenant, essayez de synchroniser les compétences vers un répertoire imbriqué inexistant :

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**Pourquoi**

Certains outils (comme Windsurf) s'attendent à trouver AGENTS.md dans le répertoire `.ruler/`. Si le répertoire n'existe pas, l'outil le créera automatiquement.

**Ce que vous devriez voir** :

Si le répertoire `.ruler/` n'existe pas, l'outil créera le répertoire et le fichier :

```
Created .ruler/AGENTS.md
```

Puis il lancera l'interface de sélection interactive (identique à l'étape précédente).

**Guide d'utilisation** :

```
┌─────────────────────────────────────────────────────────────┐
│  Explication de la création automatique de répertoire         │
│                                                             │
│  Commande saisie: openskills sync -o .ruler/AGENTS.md      │
│                                                             │
│  Exécution de l'outil:                                      │
│  1. Vérifier si .ruler existe     →  inexistant              │
│  2. Créer récursivement .ruler   →  mkdir .ruler             │
│  3. Créer .ruler/AGENTS.md       →  écrire le titre # AGENTS │
│  4. Synchroniser le contenu       →  écrire la liste XML     │
│                                                             │
│  Résultat: fichier .ruler/AGENTS.md généré, compétences synchronisées │
└─────────────────────────────────────────────────────────────┘
```

::: tip Création récursive

L'outil créera récursivement tous les répertoires parents inexistants. Par exemple :

- `docs/ai/skills.md` - Si `docs` et `docs/ai` n'existent pas, ils seront tous les deux créés
- `.config/agents.md` - Créera le répertoire caché `.config`

:::

---

### Étape 3: Gestion multi-fichiers - configuration pour différents outils

Supposons que vous utilisiez simultanément Windsurf et Cursor et que vous deviez configurer différents fichiers AGENTS.md pour eux :

```bash
<!-- Configuration pour Windsurf (attend .ruler/AGENTS.md) -->
npx openskills sync -o .ruler/AGENTS.md

<!-- Configuration pour Cursor (utilise AGENTS.md à la racine du projet) -->
npx openskills sync
```

**Pourquoi**

Différents outils peuvent s'attendre à trouver AGENTS.md à des emplacements différents. En utilisant `-o`, vous pouvez configurer le chemin correct pour chaque outil et éviter les conflits.

**Ce que vous devriez voir** :

Les deux fichiers sont générés séparément :

```bash
<!-- Voir AGENTS.md pour Windsurf -->
cat .ruler/AGENTS.md

<!-- Voir AGENTS.md pour Cursor -->
cat AGENTS.md
```

::: tip Indépendance des fichiers

Chaque fichier `.md` est indépendant et contient sa propre liste de compétences. Vous pouvez sélectionner différentes compétences dans différents fichiers :

- `.ruler/AGENTS.md` - Compétences sélectionnées pour Windsurf
- `AGENTS.md` - Compétences sélectionnées pour Cursor
- `docs/ai-skills.md` - Liste des compétences dans la documentation

:::

---

### Étape 4: Synchronisation non interactive vers un fichier personnalisé

Dans un environnement CI/CD, vous devrez peut-être ignorer la sélection interactive et synchroniser directement toutes les compétences vers un fichier personnalisé :

```bash
npx openskills sync -o .ruler/AGENTS.md -y
```

**Pourquoi**

L'option `-y` ignore la sélection interactive et synchronise toutes les compétences installées. Combinée avec l'option `-o`, elle permet de sortir vers un chemin personnalisé dans des processus automatisés.

**Ce que vous devriez voir** :

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: info Scénario d'utilisation CI/CD

Utiliser dans des scripts CI/CD :

```bash
#!/bin/bash
<!-- Installer les compétences -->
npx openskills install anthropics/skills -y

<!-- Synchroniser vers un fichier personnalisé (non interactif) -->
npx openskills sync -o .ruler/AGENTS.md -y
```

:::

---

### Étape 5: Vérification du fichier de sortie

Enfin, vérifiez que le fichier de sortie a été généré correctement :

```bash
<!-- Voir le contenu du fichier -->
cat .ruler/AGENTS.md

<!-- Vérifier si le fichier existe -->
ls -l .ruler/AGENTS.md

<!-- Confirmer le nombre de compétences -->
grep -c "<name>" .ruler/AGENTS.md
```

**Ce que vous devriez voir** :

1. Le fichier contient le titre correct (comme `# AGENTS`)
2. Le fichier contient la balise XML `<skills_system>`
3. Le fichier contient la liste des compétences `<available_skills>`
4. Chaque `<skill>` contient `<name>`, `<description>`, `<location>`

::: tip Vérifier le chemin de sortie

Si vous n'êtes pas sûr du répertoire de travail actuel, vous pouvez utiliser :

```bash
<!-- Voir le répertoire actuel -->
pwd

<!-- Voir où le chemin relatif sera résolu -->
realpath .ruler/AGENTS.md
```

:::

---

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, veuillez confirmer :

- [ ] Utilisation réussie de l'option `-o` pour sortir vers un fichier personnalisé
- [ ] L'outil a créé automatiquement le fichier inexistant
- [ ] L'outil a créé automatiquement le répertoire imbriqué inexistant
- [ ] Le fichier généré contient le titre correct (basé sur le nom du fichier)
- [ ] Le fichier généré contient la balise XML `<skills_system>`
- [ ] Le fichier généré contient la liste complète des compétences
- [ ] Vous pouvez configurer différents chemins de sortie pour différents outils
- [ ] Vous pouvez utiliser la combinaison `-y` et `-o` dans un environnement CI/CD

Si tous les points de contrôle ci-dessus sont réussis, félicitations ! Vous avez maîtrisé l'utilisation de la personnalisation du chemin de sortie et pouvez synchroniser les compétences de manière flexible vers n'importe quel emplacement.

---

## Problèmes courants

### Problème 1: Le fichier de sortie n'est pas un markdown

**Phénomène** :

```
Error: Output file must be a markdown file (.md)
```

**Cause** :

Lors de l'utilisation de l'option `-o`, l'extension du fichier spécifié n'est pas `.md`. L'outil exige de sortir vers un fichier markdown pour garantir que les outils IA puissent le lire correctement.

**Solution** :

Assurez-vous que le fichier de sortie se termine par `.md` :

```bash
<!-- ❌ Incorrect -->
npx openskills sync -o skills.txt

<!-- ✅ Correct -->
npx openskills sync -o skills.md
```

---

### Problème 2: Erreur de permission lors de la création du répertoire

**Phénomène** :

```
Error: EACCES: permission denied, mkdir '.ruler'
```

**Cause** :

Lors de la tentative de création du répertoire, l'utilisateur actuel n'a pas les droits d'écriture sur le répertoire parent.

**Solution** :

1. Vérifiez les permissions du répertoire parent :

```bash
ls -ld .
```

2. Si les permissions sont insuffisantes, contactez l'administrateur ou utilisez un répertoire avec les permissions appropriées :

```bash
<!-- Utiliser le répertoire du projet -->
cd ~/projects/my-project
npx openskills sync -o .ruler/AGENTS.md
```

---

### Problème 3: Chemin de sortie trop long

**Phénomène** :

Le chemin du fichier est très long, rendant la commande difficile à lire et à maintenir :

```bash
npx openskills sync -o docs/ai/skills/v2/internal/agents.md
```

**Cause** :

Les répertoires imbriqués sont trop profonds, rendant le chemin difficile à gérer.

**Solution** :

1. Utilisez des chemins relatifs (à partir de la racine du projet)
2. Simplifiez la structure des répertoires
3. Envisagez d'utiliser des liens symboliques (voir [Support des liens symboliques](../symlink-support/))

```bash
<!-- Pratique recommandée: structure de répertoire plate -->
npx openskills sync -o docs/agents.md
```

---

### Problème 4: Oublier d'utiliser l'option -o

**Phénomène** :

Vous vous attendez à sortir vers un fichier personnalisé, mais l'outil sort toujours vers le `AGENTS.md` par défaut.

**Cause** :

Vous avez oublié d'utiliser l'option `-o` ou vous avez fait une faute de frappe.

**Solution** :

1. Vérifiez que la commande contient `-o` ou `--output` :

```bash
<!-- ❌ Incorrect: option -o oubliée -->
npx openskills sync

<!-- ✅ Correct: option -o utilisée -->
npx openskills sync -o .ruler/AGENTS.md
```

2. Utilisez la forme complète `--output` (plus clair) :

```bash
npx openskills sync --output .ruler/AGENTS.md
```

---

### Problème 5: Nom de fichier contenant des caractères spéciaux

**Phénomène** :

Le nom du fichier contient des espaces ou des caractères spéciaux, entraînant des erreurs de résolution de chemin :

```bash
npx openskills sync -o "my skills.md"
```

**Cause** :

Certains shells traitent différemment les caractères spéciaux, ce qui peut entraîner des erreurs de chemin.

**Solution** :

1. Évitez d'utiliser des espaces et des caractères spéciaux
2. Si vous devez les utiliser, enveloppez le chemin avec des guillemets :

```bash
<!-- Non recommandé -->
npx openskills sync -o "my skills.md"

<!-- Recommandé -->
npx openskills sync -o my-skills.md
```

---

## Résumé de la leçon

Dans cette leçon, vous avez appris :

- **Utiliser les options `-o` ou `--output`** pour synchroniser les compétences vers un fichier `.md` personnalisé
- Le **mécanisme de création automatique de fichiers et de répertoires**, sans avoir besoin de préparer manuellement la structure des répertoires
- **Configurer différents fichiers AGENTS.md pour différents outils**, évitant les conflits multi-outils
- **Techniques de gestion multi-fichiers**, stocker les listes de compétences classées par outil ou fonction
- **Utilisation CI/CD** de la combinaison `-y` et `-o` pour une synchronisation automatisée

**Commandes clés** :

| Commande | Action |
|--- |---|
| `npx openskills sync -o custom.md` | Synchroniser vers `custom.md` à la racine du projet |
| `npx openskills sync -o .ruler/AGENTS.md` | Synchroniser vers `.ruler/AGENTS.md` (création automatique du répertoire) |
| `npx openskills sync -o path/to/file.md` | Synchroniser vers n'importe quel chemin (création automatique des répertoires imbriqués) |
| `npx openskills sync -o custom.md -y` | Synchronisation non interactive vers un fichier personnalisé |

**Points clés** :

- Le fichier de sortie doit se terminer par `.md`
- L'outil crée automatiquement les fichiers et répertoires inexistants
- Lors de la création d'un fichier, ajoute automatiquement un titre basé sur le nom du fichier
- Chaque fichier `.md` est indépendant et contient sa propre liste de compétences
- Convient aux environnements multi-outils, exigences de structure de répertoire, intégration de documentation existante, etc.

---

## Prochain cours

> Le prochain cours porte sur **[Support des liens symboliques](../symlink-support/)**.
>
> Vous apprendrez :
> - Comment utiliser les liens symboliques pour implémenter des mises à jour de compétences basées sur git
> - Les avantages et scénarios d'utilisation des liens symboliques
> - Comment gérer les compétences dans le développement local
> - Le mécanisme de détection et de traitement des liens symboliques

La personnalisation du chemin de sortie vous permet de contrôler de manière flexible l'emplacement de la liste des compétences, tandis que les liens symboliques offrent une méthode de gestion des compétences plus avancée, particulièrement adaptée aux scénarios de développement local.

---

## Annexe: référence du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour: 2026-01-24

| Fonction | Chemin du fichier | Ligne |
|--- |--- |---|
| Point d'entrée de la commande sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| Définition des options CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 66 |
| Obtention du chemin de sortie | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19) | 19 |
| Validation du fichier de sortie | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L22-L26) | 22-26 |
| Création de fichiers inexistants | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| Création récursive de répertoires | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L31-L32) | 31-32 |
| Génération automatique de titre | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L34) | 34 |
| Invite interactive utilisant le nom du fichier de sortie | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L70) | 70 |

**Fonctions clés** :
- `syncAgentsMd(options: SyncOptions)` - Synchroniser les compétences vers le fichier de sortie spécifié
- `options.output` - Chemin de sortie personnalisé (optionnel, défaut 'AGENTS.md')

**Constantes clés** :
- `'AGENTS.md'` - Nom du fichier de sortie par défaut
- `'.md'` - Extension de fichier obligatoire

**Logique importante** :
- Le fichier de sortie doit se terminer par `.md`, sinon une erreur est générée et le programme s'arrête (sync.ts:23-26)
- Si le fichier n'existe pas, crée automatiquement le répertoire parent (récursivement) et le fichier (sync.ts:28-36)
- Lors de la création d'un fichier, écrit un titre basé sur le nom du fichier : `# ${outputName.replace('.md', '')}` (sync.ts:34)
- Affiche le nom du fichier de sortie dans l'invite interactive (sync.ts:70)
- Affiche le nom du fichier de sortie dans le message de succès de la synchronisation (sync.ts:105, 107)

</details>
