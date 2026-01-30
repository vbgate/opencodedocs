---
title: "Liens symboliques : Mise à jour automatique Git | OpenSkills"
subtitle: "Liens symboliques : Mise à jour automatique Git"
sidebarTitle: "Compétences Git mises à jour automatiquement"
description: "Apprenez la fonctionnalité de liens symboliques d'OpenSkills, réalisant la mise à jour automatique des compétences basée sur git et le flux de travail de développement local via symlink, améliorant considérablement l'efficacité."
tags:
  - "avancé"
  - "liens symboliques"
  - "développement local"
  - "gestion des compétences"
prerequisite:
  - "platforms-install-sources"
  - "start-first-skill"
order: 3
---

# Support des liens symboliques

## Ce que vous serez capable de faire

- Comprendre la valeur centrale et les scénarios d'application des liens symboliques
- Maîtriser la commande `ln -s` pour créer des liens symboliques
- Comprendre comment OpenSkills gère automatiquement les liens symboliques
- Réaliser la mise à jour automatique des compétences basée sur git
- Effectuer efficacement le développement local de compétences
- Gérer les liens symboliques rompus

::: info Prérequis

Ce tutoriel suppose que vous avez déjà compris [Installation des sources détaillée](../../platforms/install-sources/) et [Installer la première compétence](../../start/first-skill/), et que vous comprenez le processus de base d'installation des compétences.

:::

---

## Votre problème actuel

Vous avez peut-être déjà appris à installer et mettre à jour des compétences, mais vous êtes confronté aux problèmes suivants lors de l'utilisation des **liens symboliques** :

- **Mises à jour locales fastidieuses** : après avoir modifié une compétence, il faut la réinstaller ou copier manuellement les fichiers
- **Difficulté à partager des compétences entre plusieurs projets** : la même compétence est utilisée dans plusieurs projets, chaque mise à jour nécessite une synchronisation
- **Gestion des versions confuse** : les fichiers de compétences sont dispersés dans différents projets, difficile à gérer de manière unifiée avec git
- **Processus de mise à jour fastidieux** : mettre à jour une compétence à partir d'un dépôt git nécessite de réinstaller le dépôt entier

En fait, OpenSkills prend en charge les liens symboliques, ce qui vous permet de réaliser la mise à jour automatique des compétences basée sur git et un flux de travail de développement local efficace via symlink.

---

## Quand utiliser cette méthode

**Scénarios d'utilisation des liens symboliques** :

| Scénario | Nécessite un lien symbolique ? | Exemple |
|--- | --- | ---|
| **Développement local de compétences** | ✅ Oui | Développer une compétence personnalisée, modifications et tests fréquents |
| **Partage de compétences entre projets** | ✅ Oui | Dépôt de compétences partagées en équipe, utilisé simultanément par plusieurs projets |
| **Mise à jour automatique basée sur git** | ✅ Oui | Après la mise à jour du dépôt de compétences, tous les projets obtiennent automatiquement la dernière version |
| **Installation unique, utilisation permanente** | ❌ Non | Installation sans modification, utilisez simplement `install` |
| **Test de compétences tierces** | ❌ Non | Test temporaire de compétences, pas besoin de liens symboliques |

::: tip Recommandations

- **Utiliser des liens symboliques pour le développement local** : lors du développement de vos propres compétences, utilisez symlink pour éviter les copies répétées
- **Partage en équipe avec git + symlink** : placez le dépôt de compétences de l'équipe dans git, partagez-le entre les projets via symlink
- **Utiliser une installation normale en production** : lors du déploiement stable, utilisez l'installation normale `install` pour éviter de dépendre de répertoires externes

:::

---

## Concept clé : lier plutôt que copier

**Méthode d'installation traditionnelle** :

```
┌─────────────────┐
│  Dépôt Git       │
│  ~/dev/skills/ │
│  └── my-skill/ │
└────────┬────────┘
         │ Copier
         ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/ │
│     └── Copie complète │
└─────────────────┘
```

**Problème** : après la mise à jour du dépôt Git, la compétence dans `.claude/skills/` n'est pas mise à jour automatiquement.

**Méthode des liens symboliques** :

```
┌─────────────────┐
│  Dépôt Git       │
│  ~/dev/skills/ │
│  └── my-skill/ │ ← Fichiers réels ici
└────────┬────────┘
         │ Lien symbolique (ln -s)
         ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/ │ → Pointe vers ~/dev/skills/my-skill
└─────────────────┘
```

**Avantage** : après la mise à jour du dépôt Git, le contenu pointé par le lien symbolique est mis à jour automatiquement, sans réinstallation.

::: info Concept important

**Lien symbolique (Symlink)** : un type de fichier spécial qui pointe vers un autre fichier ou répertoire. OpenSkills reconnaît automatiquement les liens symboliques lors de la recherche de compétences et suit leur contenu réel. Les liens symboliques rompus (pointant vers une cible inexistante) sont automatiquement ignorés et ne provoquent pas de plantage.

:::

**Implémentation du code source** (`src/utils/skills.ts:10-25`) :

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync suit les liens symboliques
      return stats.isDirectory();
    } catch {
      // Lien symbolique rompu ou erreur de permission
      return false;
    }
  }
  return false;
}
```

**Points clés** :
- `entry.isSymbolicLink()` détecte les liens symboliques
- `statSync()` suit automatiquement les liens symboliques vers la cible
- `try/catch` capture les liens symboliques rompus, retourne `false` pour les ignorer

---

## Suivez le guide

### Étape 1 : Créer le dépôt de compétences

**Pourquoi**
Créer d'abord un dépôt git pour stocker les compétences, simulant le scénario de partage en équipe.

Ouvrez un terminal et exécutez :

```bash
# Créer le répertoire du dépôt de compétences
mkdir -p ~/dev/my-skills
cd ~/dev/my-skills

# Initialiser le dépôt git
git init

# Créer une compétence d'exemple
mkdir -p my-first-skill
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: Une compétence d'exemple pour démontrer le support des liens symboliques
---

# Ma Première Compétence

Lorsque l'utilisateur demande de l'aide avec cette compétence, suivez ces étapes :
1. Vérifiez que le lien symbolique fonctionne
2. Affichez "Le support des liens symboliques fonctionne !"
EOF

# Commiter dans git
git add .
git commit -m "Commit initial : Ajouter my-first-skill"
```

**Ce que vous devriez voir** : dépôt git créé avec succès et compétence commitée.

**Explication** :
- La compétence est stockée dans le répertoire `~/dev/my-skills/`
- Utilisation de git pour le contrôle de version, facilitant la collaboration en équipe
- Ce répertoire est l'"emplacement réel" de la compétence

---

### Étape 2 : Créer le lien symbolique

**Pourquoi**
Apprendre à utiliser la commande `ln -s` pour créer des liens symboliques.

Continuez dans le répertoire du projet :

```bash
# Retourner à la racine du projet
cd ~/my-project

# Créer le répertoire des compétences
mkdir -p .claude/skills

# Créer le lien symbolique
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Voir le lien symbolique
ls -la .claude/skills/
```

**Ce que vous devriez voir** :

```
.claude/skills/
└── my-first-skill -> /Users/yourname/dev/my-skills/my-first-skill
```

**Explication** :
- `ln -s` crée un lien symbolique
- Après `->` s'affiche le chemin réel pointé
- Le lien symbolique lui-même est juste un "pointeur", n'occupe pas d'espace réel

---

### Étape 3 : Vérifier que le lien symbolique fonctionne

**Pourquoi**
Confirmer qu'OpenSkills peut correctement reconnaître et lire les compétences de liens symboliques.

Exécutez :

```bash
# Lister les compétences
npx openskills list

# Lire le contenu de la compétence
npx openskills read my-first-skill
```

**Ce que vous devriez voir** :

```
  my-first-skill           (project)
    Une compétence d'exemple pour démontrer le support des liens symboliques

Résumé : 1 projet, 0 global (1 total)
```

Sortie de la lecture de la compétence :

```markdown
---
name: my-first-skill
description: Une compétence d'exemple pour démontrer le support des liens symboliques
---

# Ma Première Compétence

Lorsque l'utilisateur demande de l'aide avec cette compétence, suivez ces étapes :
1. Vérifiez que le lien symbolique fonctionne
2. Affichez "Le support des liens symboliques fonctionne !"
```

**Explication** :
- OpenSkills reconnaît automatiquement les liens symboliques
- Les compétences de liens symboliques affichent l'étiquette `(project)`
- Le contenu lu provient du fichier original pointé par le lien symbolique

---

### Étape 4 : Mise à jour automatique basée sur git

**Pourquoi**
Expérimenter le plus grand avantage des liens symboliques : après la mise à jour du dépôt git, la compétence se synchronise automatiquement.

Modifiez la compétence dans le dépôt de compétences :

```bash
# Entrer dans le dépôt de compétences
cd ~/dev/my-skills

# Modifier le contenu de la compétence
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: Version mise à jour avec de nouvelles fonctionnalités
---

# Ma Première Compétence (mise à jour)

Lorsque l'utilisateur demande de l'aide avec cette compétence, suivez ces étapes :
1. Vérifiez que le lien symbolique fonctionne
2. Affichez "Le support des liens symboliques fonctionne !"
3. NOUVEAU : Cette fonctionnalité a été mise à jour via git !
EOF

# Commiter la mise à jour
git add .
git commit -m "Mise à jour de la compétence : Ajouter une nouvelle fonctionnalité"
```

Maintenant, vérifiez la mise à jour dans le répertoire du projet :

```bash
# Retourner au répertoire du projet
cd ~/my-project

# Lire la compétence (pas besoin de réinstaller)
npx openskills read my-first-skill
```

**Ce que vous devriez voir** : le contenu de la compétence a été automatiquement mis à jour, avec la nouvelle description de fonctionnalité.

**Explication** :
- Après la mise à jour du fichier pointé par le lien symbolique, OpenSkills lit automatiquement le dernier contenu
- Pas besoin de réexécuter `openskills install`
- Réalise "une mise à jour, effet partout"

---

### Étape 5 : Partager des compétences entre plusieurs projets

**Pourquoi**
Expérimenter l'avantage des liens symboliques dans les scénarios à plusieurs projets, éviter l'installation répétée de compétences.

Créez un deuxième projet :

```bash
# Créer le deuxième projet
mkdir ~/my-second-project
cd ~/my-second-project

# Créer le répertoire des compétences et le lien symbolique
mkdir -p .claude/skills
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Vérifier que la compétence est disponible
npx openskills list
```

**Ce que vous devriez voir** :

```
  my-first-skill           (project)
    Version mise à jour avec de nouvelles fonctionnalités

Résumé : 1 projet, 0 global (1 total)
```

**Explication** :
- Plusieurs projets peuvent créer des liens symboliques vers la même compétence
- Après la mise à jour du dépôt de compétences, tous les projets obtiennent automatiquement la dernière version
- Évite l'installation répétée et la mise à jour des compétences

---

### Étape 6 : Gérer les liens symboliques rompus

**Pourquoi**
Comprendre comment OpenSkills gère élégamment les liens symboliques rompus.

Simulez un lien symbolique rompu :

```bash
# Supprimer le dépôt de compétences
rm -rf ~/dev/my-skills

# Essayer de lister les compétences
npx openskills list
```

**Ce que vous devriez voir** : les liens symboliques rompus sont automatiquement ignorés, sans erreur.

```
Résumé : 0 projet, 0 global (0 total)
```

**Explication** :
- Le `try/catch` dans le code source capture les liens symboliques rompus
- OpenSkills ignorera les liens rompus et continuera à chercher d'autres compétences
- Ne provoquera pas le crash de la commande `openskills`

---

## Point de contrôle ✅

Complétez les vérifications suivantes pour confirmer que vous avez maîtrisé le contenu de cette leçon :

- [ ] Comprendre la valeur centrale des liens symboliques
- [ ] Maîtriser l'utilisation de la commande `ln -s`
- [ ] Comprendre la différence entre liens symboliques et copie de fichiers
- [ ] Pouvoir créer un dépôt de compétences basé sur git
- [ ] Pouvoir réaliser la mise à jour automatique des compétences
- [ ] Savoir comment partager des compétences entre plusieurs projets
- [ ] Comprendre le mécanisme de gestion des liens symboliques rompus

---

## Pièges courants

### Erreur courante 1 : Chemin de lien symbolique incorrect

**Scénario d'erreur** : utiliser un chemin relatif pour créer un lien symbolique, le lien devient invalide après avoir déplacé le projet.

```bash
# ❌ Erreur : utiliser un chemin relatif
cd ~/my-project
ln -s ../dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Après avoir déplacé le projet, le lien devient invalide
mv ~/my-project ~/new-location/project
npx openskills list  # ❌ Compétence introuvable
```

**Problème** :
- Le chemin relatif dépend du répertoire de travail actuel
- Après avoir déplacé le projet, le chemin relatif devient invalide
- Le lien symbolique pointe vers un emplacement incorrect

**Bonne pratique** :

```bash
# ✅ Correct : utiliser un chemin absolu
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Après avoir déplacé le projet, toujours valide
mv ~/my-project ~/new-location/project
npx openskills list  # ✅ Toujours capable de trouver la compétence
```

---

### Erreur courante 2 : Confondre liens durs et liens symboliques

**Scénario d'erreur** : utiliser un lien dur plutôt qu'un lien symbolique.

```bash
# ❌ Erreur : utiliser un lien dur (sans paramètre -s)
ln ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Un lien dur est une autre entrée vers le fichier, pas un pointeur
# Ne permet pas de "mettre à jour un endroit, effet partout"
```

**Problème** :
- Un lien dur est un autre nom d'entrée pour le fichier
- Modifier n'importe quel lien dur mettra à jour les autres liens durs
- Mais après avoir supprimé le fichier source, le lien dur existe toujours, provoquant de la confusion
- Ne peut pas être utilisé à travers les systèmes de fichiers

**Bonne pratique** :

```bash
# ✅ Correct : utiliser un lien symbolique (avec paramètre -s)
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Un lien symbolique est un pointeur
# Après avoir supprimé le fichier source, le lien symbolique deviendra invalide (OpenSkills l'ignorera)
```

---

### Erreur courante 3 : Lien symbolique pointant vers un emplacement incorrect

**Scénario d'erreur** : le lien symbolique pointe vers le répertoire parent de la compétence, plutôt que le répertoire de la compétence lui-même.

```bash
# ❌ Erreur : pointer vers le répertoire parent
ln -s ~/dev/my-skills .claude/skills/my-skills-link

# OpenSkills cherchera SKILL.md dans .claude/skills/my-skills-link/
# Mais le SKILL.md réel est dans ~/dev/my-skills/my-first-skill/SKILL.md
```

**Problème** :
- OpenSkills cherchera `<link>/SKILL.md`
- Mais la compétence réelle est dans `<link>/my-first-skill/SKILL.md`
- Provoque l'impossibilité de trouver le fichier de compétence

**Bonne pratique** :

```bash
# ✅ Correct : pointer directement vers le répertoire de la compétence
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# OpenSkills cherchera .claude/skills/my-first-skill/SKILL.md
# Le répertoire pointé par le lien symbolique contient SKILL.md
```

---

### Erreur courante 4 : Oublier de synchroniser AGENTS.md

**Scénario d'erreur** : après avoir créé un lien symbolique, oublier de synchroniser AGENTS.md.

```bash
# Créer un lien symbolique
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ❌ Erreur : oublier de synchroniser AGENTS.md
# L'agent IA ne peut pas savoir qu'une nouvelle compétence est disponible
```

**Problème** :
- Le lien symbolique est créé, mais AGENTS.md n'est pas mis à jour
- L'agent IA ne sait pas qu'une nouvelle compétence existe
- Impossible d'appeler la nouvelle compétence

**Bonne pratique** :

```bash
# Créer un lien symbolique
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ✅ Correct : synchroniser AGENTS.md
npx openskills sync

# Maintenant l'agent IA peut voir la nouvelle compétence
```

---

## Résumé du chapitre

**Points clés** :

1. **Les liens symboliques sont des pointeurs** : créés avec `ln -s`, pointent vers des fichiers ou répertoires réels
2. **Suivi automatique des liens** : OpenSkills utilise `statSync()` pour suivre automatiquement les liens symboliques
3. **Liens rompus ignorés automatiquement** : `try/catch` capture les exceptions, évite les plantages
4. **Mise à jour automatique basée sur git** : après la mise à jour du dépôt Git, les compétences se synchronisent automatiquement
5. **Partage multi-projets** : plusieurs projets peuvent créer des liens symboliques vers la même compétence

**Processus de décision** :

```
[Besoin d'utiliser une compétence] → [Besoin de modifications fréquentes ?]
                         ↓ Oui
                 [Utiliser un lien symbolique (développement local)]
                         ↓ Non
                 [Partagé entre plusieurs projets ?]
                         ↓ Oui
                 [Utiliser git + lien symbolique]
                         ↓ Non
                 [Utiliser install normal]
```

**Formule mnémotechnique** :

- **Développement local avec symlink** : modifications fréquentes, éviter les copies répétées
- **Partage en équipe git lien** : une mise à jour, effet partout
- **Chemin absolu pour la stabilité** : éviter l'invalidation des chemins relatifs
- **Lien rompu ignoré automatiquement** : géré automatiquement par OpenSkills

---

## Prochain chapitre

> Dans le prochain chapitre, nous apprendrons **[Créer des compétences personnalisées](../create-skills/)**.
>
> Vous apprendrez :
> - Comment créer vos propres compétences à partir de zéro
> - Comprendre le format SKILL.md et le YAML frontmatter
> - Comment organiser la structure du répertoire de compétences (references/, scripts/, assets/)
> - Comment écrire des descriptions de compétences de haute qualité

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité            | Chemin du fichier                                                                                              | Ligne    |
|--- | --- | ---|
| Détection de liens symboliques    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)      | 10-25   |
| Recherche de compétences        | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L30-L64)      | 30-64   |
| Recherche d'une seule compétence    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84)      | 69-84   |

**Fonctions clés** :

- `isDirectoryOrSymlinkToDirectory(entry, parentDir)` : détermine si une entrée de répertoire est un répertoire réel ou un lien symbolique vers un répertoire
  - Utilise `entry.isSymbolicLink()` pour détecter les liens symboliques
  - Utilise `statSync()` pour suivre automatiquement les liens symboliques vers la cible
  - `try/catch` capture les liens symboliques rompus, retourne `false`

- `findAllSkills()` : trouve toutes les compétences installées
  - Parcourt 4 répertoires de recherche
  - Appelle `isDirectoryOrSymlinkToDirectory` pour identifier les liens symboliques
  - Ignore automatiquement les liens symboliques rompus

**Règles métier** :

- Les liens symboliques sont automatiquement reconnus comme répertoires de compétences
- Les liens symboliques rompus sont élégamment ignorés, ne provoquent pas de plantage
- Les liens symboliques et les répertoires réels ont la même priorité de recherche

</details>
