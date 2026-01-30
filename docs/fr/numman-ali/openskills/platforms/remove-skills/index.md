---
title: "Supprimer les compétences : Suppression interactive et scriptée | openskills"
sidebarTitle: "Supprimer les anciennes compétences en toute sécurité"
subtitle: "Supprimer les compétences : Suppression interactive et scriptée"
description: "Apprenez les deux méthodes de suppression de compétences avec OpenSkills : manage interactif et remove scripté. Comprenez les cas d'utilisation, la confirmation de l'emplacement et le dépannage courant pour nettoyer votre bibliothèque de compétences en toute sécurité."
tags:
  - "Gestion des compétences"
  - "Utilisation des commandes"
  - "CLI"
prerequisite:
  - "/fr/start-installation"
  - "/fr/start-first-skill"
  - "/fr/platforms-list-skills"
order: 6
---
# Supprimer les compétences

## Ce que vous apprendrez à faire

- Utiliser `openskills manage` pour supprimer plusieurs compétences de manière interactive
- Utiliser `openskills remove` pour supprimer des compétences spécifiques de manière scriptée
- Comprendre les cas d'utilisation des deux méthodes de suppression
- Confirmer si la compétence est supprimée de l'emplacement project ou global
- Nettoyer safely les compétences dont vous n'avez plus besoin

## Votre situation actuelle

Au fur et à mesure que vous installez des compétences, vous pourriez rencontrer ces problèmes :

- "Certaines compétences ne me servent plus, j'aimerais en supprimer quelques-unes, mais c'est fastidieux de les supprimer une par une"
- "Je veux supprimer des compétences automatiquement dans un script, mais la commande manage nécessite une sélection interactive"
- "Je ne sais pas si la compétence est installée en project ou en global, j'aimerais confirmer avant de supprimer"
- "Je crains de supprimer par erreur des compétences que j'utilise encore"

OpenSkills propose deux méthodes de suppression pour résoudre ces problèmes : **manage interactif** (pour sélectionner manuellement plusieurs compétences) et **remove scripté** (pour supprimer précisément des compétences individuelles).

## Quand utiliser cette approche

| Scénario | Méthode recommandée | Commande |
|--- | --- | ---|
| Supprimer manuellement plusieurs compétences | Sélection interactive | `openskills manage` |
| Suppression automatique dans un script ou CI/CD | Spécifier le nom de la compétence | `openskills remove <name>` |
| Vous connaissez le nom de la compétence et voulez la supprimer rapidement | Suppression directe | `openskills remove <name>` |
| Voulez voir quelles compétences peuvent être supprimées | Lister puis supprimer | `openskills list` → `openskills manage` |

## Principe fondamental

Les deux méthodes de suppression d'OpenSkills sont adaptées à différents contextes :

### Suppression interactive : `openskills manage`

- **Caractéristiques** : Affiche toutes les compétences installées et vous permet de sélectionner celles à supprimer
- **Adapté à** : Gestion manuelle de la bibliothèque de compétences, suppression de plusieurs compétences en une fois
- **Avantage** : Pas de suppression par erreur, possibilité de prévisualiser toutes les options
- **Comportement par défaut** : **Aucune compétence sélectionnée** (pour éviter les suppressions accidentelles)

### Suppression scriptée : `openskills remove <name>`

- **Caractéristiques** : Supprime directement la compétence spécifiée
- **Adapté à** : Scripts, automatisation, suppression précise
- **Avantage** : Rapide, sans interaction
- **Risque** : Si le nom de la compétence est incorrect, une erreur sera générée, mais aucune autre compétence ne sera supprimée par erreur

### Principe de suppression

Les deux méthodes suppriment l'**entire répertoire de la compétence** (y compris SKILL.md, references/, scripts/, assets/ et tous les fichiers), sans laisser de résidus.

::: tip Suppression irréversible
La suppression d'une compétence supprime l'intégralité du répertoire de la compétence, de manière irréversible. Il est recommandé de confirmer que la compétence n'est plus nécessaire avant de la supprimer, ou vous pouvez la réinstaller.
:::

## Suivez les étapes

### Étape 1 : Supprimer plusieurs compétences de manière interactive

**Pourquoi**
Lorsque vous devez supprimer plusieurs compétences, la sélection interactive est plus sûre et intuitive

Exécutez la commande suivante :

```bash
npx openskills manage
```

**Ce que vous devriez voir**

Vous verrez d'abord la liste de toutes les compétences installées (triées par project/global) :

```
? Select skills to remove:
❯◯ pdf                         (project)
  ◯ code-analyzer              (project)
  ◯ email-reader               (global)
  ◯ git-tools                  (global)
```

- **Bleu** `(project)` : Compétences au niveau du projet
- **Gris** `(global)` : Compétences globales
- **Espace** : Cocher/décocher
- **Entrée** : Confirmer la suppression

Supposons que vous ayez coché `pdf` et `git-tools`, puis appuyé sur Entrée :

**Ce que vous devriez voir**

```
✅ Removed: pdf (project)
✅ Removed: git-tools (global)

✅ Removed 2 skill(s)
```

::: info Pas de sélection par défaut
La commande manage ne sélectionne **aucune compétence par défaut**, afin de prévenir les suppressions accidentelles. Vous devez utiliser la touche Espace pour cocher manuellement les compétences à supprimer.
:::

### Étape 2 : Supprimer une compétence de manière scriptée

**Pourquoi**
Lorsque vous connaissez le nom de la compétence et voulez la supprimer rapidement

Exécutez la commande suivante :

```bash
npx openskills remove pdf
```

**Ce que vous devriez voir**

```
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)
```

Si la compétence n'existe pas :

```
Error: Skill 'pdf' not found
```

Le programme quittera et retournera un code d'erreur 1 (adapté pour les scripts).

### Étape 3 : Confirmer l'emplacement de suppression

**Pourquoi**
Confirmer l'emplacement de la compétence (project vs global) avant la suppression pour éviter les suppressions accidentelles

Lors de la suppression d'une compétence, la commande affichera l'emplacement de suppression :

```bash
# La suppression scriptée affiche l'emplacement détaillé
npx openskills remove pdf
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)

# La suppression interactive affiche également l'emplacement de chaque compétence
npx openskills manage
# Après sélection et Entrée
✅ Removed: pdf (project)
✅ Removed: git-tools (global)
```

**Règle de判断** :
- Si le chemin contient le répertoire du projet actuel → `(project)`
- Si le chemin contient le répertoire personnel → `(global)`

### Étape 4 : Vérifier après suppression

**Pourquoi**
Confirmer que la suppression a réussi, éviter les omissions

Après avoir supprimé une compétence, vérifiez avec la commande list :

```bash
npx openskills list
```

**Ce que vous devriez voir**

Les compétences supprimées n'apparaîtront plus dans la liste.

## Points de vérification ✅

Confirmez les éléments suivants :

- [ ] L'exécution de `openskills manage` affiche la liste de toutes les compétences
- [ ] Vous pouvez cocher/décocher les compétences avec la touche Espace
- [ ] Aucune compétence n'est sélectionnée par défaut (pour éviter les suppressions accidentelles)
- [ ] L'exécution de `openskills remove <name>` supprime la compétence spécifiée
- [ ] La suppression affiche l'emplacement project ou global
- [ ] Après suppression, utilisez `openskills list` pour vérifier que la compétence a disparu

## Pièges à éviter

### Problème courant 1 : Suppression accidentelle d'une compétence encore utilisée

**Phénomène** : Vous réalisez après la suppression que la compétence est encore utilisée

**Solution** :

Réinstallez simplement :

```bash
 # Si installé depuis GitHub
npx openskills install anthropics/skills

 # Si installé depuis un chemin local
npx openskills install ./path/to/skill
```

OpenSkills enregistre la source d'installation (dans le fichier `.openskills.json`), et lors de la réinstallation, les informations de chemin d'origine ne seront pas perdues.

### Problème courant 2 : La commande manage affiche "No skills installed"

**Phénomène** : L'exécution de `openskills manage` indique qu'aucune compétence n'est installée

**Cause** : Il n'y a effectivement aucune compétence dans le répertoire actuel

**Étapes de débogage** :

1. Vérifiez que vous êtes dans le bon répertoire de projet
2. Confirmez que des compétences globales sont installées (`openskills list --global`)
3. Basculez vers le répertoire où les compétences sont installées et réessayez

```bash
 # Basculez vers le répertoire du projet
cd /path/to/your/project

 # Réessayez
npx openskills manage
```

### Problème courant 3 : La commande remove génère une erreur "Skill not found"

**Phénomène** : L'exécution de `openskills remove <name>` indique que la compétence n'existe pas

**Cause** : Le nom de la compétence est mal orthographié, ou la compétence a déjà été supprimée

**Étapes de débogage** :

1. Utilisez d'abord la commande list pour voir le nom correct de la compétence :

```bash
npx openskills list
```

2. Vérifiez l'orthographe du nom de la compétence (attention à la casse et aux traits d'union)

3. Confirmez si la compétence est en project ou global (recherchez dans différents répertoires)

```bash
 # Voir les compétences du projet
ls -la .claude/skills/

 # Voir les compétences globales
ls -la ~/.claude/skills/
```

### Problème courant 4 : La compétence supprimée apparaît encore dans AGENTS.md

**Phénomène** : Après avoir supprimé une compétence, AGENTS.md contient encore une référence à cette compétence

**Cause** : La suppression d'une compétence ne met pas automatiquement à jour AGENTS.md

**Solution** :

Réexécutez la commande sync :

```bash
npx openskills sync
```

Sync rescanner les compétences installées et mettra à jour AGENTS.md, les compétences supprimées seront automatiquement retirées de la liste.

## Résumé de cette leçon

OpenSkills propose deux méthodes de suppression de compétences :

### Suppression interactive : `openskills manage`

- 🎯 **Cas d'utilisation** : Gestion manuelle de la bibliothèque de compétences, suppression de plusieurs compétences
- ✅ **Avantage** : Intuitive, pas de suppression par erreur, prévisualisation possible
- ⚠️ **Attention** : Aucune compétence n'est sélectionnée par défaut, nécessite une sélection manuelle

### Suppression scriptée : `openskills remove <name>

- 🎯 **Cas d'utilisation** : Scripts, automatisation, suppression précise
- ✅ **Avantage** : Rapide, sans interaction
- ⚠️ **Attention** : Une erreur sera générée si le nom de la compétence est incorrect

**Points clés** :

1. Les deux méthodes suppriment l'intégralité du répertoire de la compétence (irréversible)
2. La suppression affiche l'emplacement project ou global
3. Après suppression, utilisez `openskills list` pour vérifier
4. N'oubliez pas de réexécuter `openskills sync` pour mettre à jour AGENTS.md

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons le **[Mode Universal : Environnement multi-agents](../../advanced/universal-mode/)**.
>
> Vous apprendrez :
> - Comment utiliser le drapeau `--universal` pour éviter les conflits avec Claude Code
> - La gestion unifiée des compétences dans un environnement multi-agents
> - Le rôle du répertoire `.agent/skills`

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour展开voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Implémentation de la commande manage | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 10-62 |
| Implémentation de la commande remove | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 8-21 |
| Recherche de toutes les compétences | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Recherche d'une compétence spécifique | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 66-90 |

**Fonctions clés** :
- `manageSkills()` : Suppression interactive des compétences, utilise inquirer checkbox pour permettre à l'utilisateur de sélectionner
- `removeSkill(skillName)` : Suppression scriptée de la compétence spécifiée, signale une erreur et quitte si non trouvée
- `findAllSkills()` : Parcourt les 4 répertoires de recherche et collecte toutes les compétences
- `findSkill(skillName)` : Recherche une compétence spécifique et retourne un objet Skill

**Constantes clés** :
- Aucune (tous les chemins et configurations sont calculés dynamiquement)

**Logique fondamentale** :

1. **Commande manage** (src/commands/manage.ts) :
   - Appelle `findAllSkills()` pour obtenir toutes les compétences (ligne 11)
   - Trie par project/global (lignes 20-25)
   - Utilise inquirer `checkbox` pour la sélection de l'utilisateur (lignes 33-37)
   - Par défaut `checked: false`, aucune compétence sélectionnée (ligne 30)
   - Parcourt les compétences sélectionnées et appelle `rmSync` pour supprimer (lignes 45-52)

2. **Commande remove** (src/commands/remove.ts) :
   - Appelle `findSkill(skillName)` pour rechercher la compétence (ligne 9)
   - Si non trouvée, affiche une erreur et `process.exit(1)` (lignes 12-14)
   - Appelle `rmSync` pour supprimer l'intégralité du répertoire de la compétence (ligne 16)
   - Détermine si project ou global via `homedir()` (ligne 18)

3. **Opération de suppression** :
   - Utilise `rmSync(baseDir, { recursive: true, force: true })` pour supprimer l'intégralité du répertoire de la compétence
   - `recursive: true` : Supprime récursivement tous les sous-fichiers et sous-répertoires
   - `force: true` : Ignore les erreurs de fichiers inexistants

</details>
