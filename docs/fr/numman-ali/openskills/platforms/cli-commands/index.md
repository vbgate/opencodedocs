---
title: "Référence des commandes : Guide CLI OpenSkills | openskills"
sidebarTitle: "Maîtriser les 7 commandes"
subtitle: "Référence des commandes : Guide CLI OpenSkills | openskills"
description: "Apprenez à utiliser les 7 commandes OpenSkills et leurs paramètres. Maîtrisez la référence complète de install, list, read, update, sync, manage, remove pour améliorer l'efficacité de l'outil CLI."
tags:
  - "CLI"
  - "Référence des commandes"
  - "Aide-mémoire"
prerequisite:
  - "/fr/numman-ali/openskills/start/installation/"
  - "/fr/numman-ali/openskills/start/first-skill/"
order: 1
---
# Référence des commandes : Guide complet des commandes OpenSkills

## Ce que vous pourrez faire après ce cours

- Utiliser couramment les 7 commandes OpenSkills
- Comprendre le rôle et les scénarios d'utilisation des options globales
- Trouver rapidement la signification des paramètres et des indicateurs de commande
- Utiliser des commandes non interactives dans des scripts

## Aperçu des commandes

OpenSkills propose les 7 commandes suivantes :

| Commande | Utilité | Scénario d'utilisation |
|--- | --- | ---|
| `install` | Installer des compétences | Installer de nouvelles compétences depuis GitHub, un chemin local ou un dépôt privé |
| `list` | Lister les compétences | Voir toutes les compétences installées et leurs emplacements |
| `read` | Lire des compétences | Permettre à l'agent IA de charger le contenu des compétences (généralement appelé automatiquement par l'agent) |
| `update` | Mettre à jour des compétences | Actualiser les compétences installées depuis le dépôt source |
| `sync` | Synchroniser | Écrire la liste des compétences dans AGENTS.md |
| `manage` | Gérer | Suppression interactive des compétences |
| `remove` | Supprimer | Supprimer une compétence spécifique (mode script) |

::: info Astuce
Utilisez `npx openskills --help` pour voir une brève description de toutes les commandes.
:::

## Options globales

Certaines commandes prennent en charge les options globales suivantes :

| Option | Abréviation | Rôle | Commandes applicables |
|--- | --- | --- | ---|
| `--global` | `-g` | Installer dans le répertoire global `~/.claude/skills/` | `install` |
| `--universal` | `-u` | Installer dans le répertoire universel `.agent/skills/` (environnement multi-agents) | `install` |
| `--yes` | `-y` | Ignorer les invites interactives et utiliser le comportement par défaut | `install`, `sync` |
| `--output <path>` | `-o <path>` | Spécifier le chemin du fichier de sortie | `sync` |

## Référence détaillée des commandes

### install - Installer des compétences

Installez des compétences depuis un dépôt GitHub, un chemin local ou un dépôt git privé.

```bash
openskills install <source> [options]
```

**Paramètres** :

| Paramètre | Obligatoire | Description |
|--- | --- | ---|
| `<source>` | ✅ | Source de la compétence (shorthand GitHub, URL git ou chemin local) |

**Options** :

| Option | Abréviation | Valeur par défaut | Description |
|--- | --- | --- | ---|
| `--global` | `-g` | `false` | Installer dans le répertoire global `~/.claude/skills/` |
| `--universal` | `-u` | `false` | Installer dans le répertoire universel `.agent/skills/` |
| `--yes` | `-y` | `false` | Ignorer la sélection interactive et installer toutes les compétences trouvées |

**Exemples de paramètre source** :

```bash
# GitHub shorthand (recommandé)
openskills install anthropics/skills

# Spécifier une branche
openskills install owner/repo@branch

# Dépôt privé
openskills install git@github.com:owner/repo.git

# Chemin local
openskills install ./path/to/skill

# URL Git
openskills install https://github.com/owner/repo.git
```

**Comportement** :

- Lors de l'installation, toutes les compétences trouvées sont listées pour la sélection
- Utilisez `--yes` pour ignorer la sélection et installer toutes les compétences
- Priorité des emplacements d'installation : `--universal` → `--global` → répertoire du projet par défaut
- Après l'installation, un fichier de métadonnées `.openskills.json` est créé dans le répertoire des compétences

---

### list - Lister les compétences

Listez toutes les compétences installées.

```bash
openskills list
```

**Options** : Aucune

**Format de sortie** :

```
Available Skills:

skill-name           [description]            (project/global)
```

**Comportement** :

- Trié par emplacement : compétences du projet en premier, compétences globales ensuite
- Trié par ordre alphabétique dans le même emplacement
- Affiche le nom de la compétence, la description et l'étiquette d'emplacement

---

### read - Lire des compétences

Lisez le contenu d'une ou plusieurs compétences vers la sortie standard. Cette commande est principalement utilisée par les agents IA pour charger des compétences à la demande.

```bash
openskills read <skill-names...>
```

**Paramètres** :

| Paramètre | Obligatoire | Description |
|--- | --- | ---|
| `<skill-names...>` | ✅ | Liste des noms de compétences (prend en charge plusieurs, séparés par des espaces ou des virgules) |

**Options** : Aucune

**Exemples** :

```bash
# Lire une seule compétence
openskills read pdf

# Lire plusieurs compétences
openskills read pdf git

# Séparé par des virgules (aussi pris en charge)
openskills read "pdf,git,excel"
```

**Format de sortie** :

```
Skill: pdf
Base Directory: /path/to/.claude/skills/pdf

---SKILL.md contenu---

[SKILL.END]
```

**Comportement** :

- Recherche des compétences selon 4 priorités de répertoires
- Affiche le nom de la compétence, le chemin du répertoire de base et le contenu complet de SKILL.md
- Affiche un message d'erreur pour les compétences introuvables

---

### update - Mettre à jour des compétences

Actualisez les compétences installées depuis la source enregistrée. Si aucun nom de compétence n'est spécifié, mettez à jour toutes les compétences installées.

```bash
openskills update [skill-names...]
```

**Paramètres** :

| Paramètre | Obligatoire | Description |
|--- | --- | ---|
| `[skill-names...]` | ❌ | Liste des noms de compétences à mettre à jour (toutes par défaut) |

**Options** : Aucune

**Exemples** :

```bash
# Mettre à jour toutes les compétences
openskills update

# Mettre à jour des compétences spécifiques
openskills update pdf git

# Séparé par des virgules (aussi pris en charge)
openskills update "pdf,git,excel"
```

**Comportement** :

- Met à jour uniquement les compétences avec des métadonnées (c'est-à-dire installées via `install`)
- Ignore les compétences sans métadonnées avec un message
- Met à jour l'horodatage d'installation après une mise à jour réussie
- Utilise le clone superficiel (`--depth 1`) lors de la mise à jour depuis un dépôt git

---

### sync - Synchroniser vers AGENTS.md

Synchronisez les compétences installées vers AGENTS.md (ou un autre fichier personnalisé), générant une liste de compétences utilisables par les agents IA.

```bash
openskills sync [options]
```

**Options** :

| Option | Abréviation | Valeur par défaut | Description |
|--- | --- | --- | ---|
| `--output <path>` | `-o <path>` | `AGENTS.md` | Chemin du fichier de sortie |
| `--yes` | `-y` | `false` | Ignorer la sélection interactive et synchroniser toutes les compétences |

**Exemples** :

```bash
# Synchroniser vers le fichier par défaut
openskills sync

# Synchroniser vers un fichier personnalisé
openskills sync -o .ruler/AGENTS.md

# Ignorer la sélection interactive
openskills sync -y
```

**Comportement** :

- Analyse le fichier existant et pré-sélectionne les compétences déjà activées
- Par défaut, les compétences du projet sont sélectionnées lors de la première synchronisation
- Génère un format XML compatible avec Claude Code
- Prend en charge le remplacement ou l'ajout de la section des compétences dans le fichier existant

---

### manage - Gérer les compétences

Supprimez de manière interactive les compétences installées. Fournit une interface de suppression conviviale.

```bash
openskills manage
```

**Options** : Aucune

**Comportement** :

- Affiche toutes les compétences installées pour la sélection
- Aucune compétence n'est sélectionnée par défaut
- Supprime immédiatement après la sélection, sans confirmation secondaire

---

### remove - Supprimer des compétences

Supprimez une compétence installée spécifique (mode script). Plus pratique que `manage` pour une utilisation dans des scripts.

```bash
openskills remove <skill-name>
```

**Paramètres** :

| Paramètre | Obligatoire | Description |
|--- | --- | ---|
| `<skill-name>` | ✅ | Nom de la compétence à supprimer |

**Options** : Aucune

**Exemples** :

```bash
openskills remove pdf

# Peut aussi utiliser l'alias
openskills rm pdf
```

**Comportement** :

- Supprime le répertoire entier de la compétence (y compris tous les fichiers et sous-répertoires)
- Affiche l'emplacement et la source de la suppression
- Affiche une erreur et quitte si la compétence n'est pas trouvée

## Aide-mémoire des opérations rapides

| Tâche | Commande |
|--- | ---|
| Voir toutes les compétences installées | `openskills list` |
| Installer les compétences officielles | `openskills install anthropics/skills` |
| Installer depuis un chemin local | `openskills install ./my-skill` |
| Installer une compétence globalement | `openskills install owner/skill --global` |
| Mettre à jour toutes les compétences | `openskills update` |
| Mettre à jour des compétences spécifiques | `openskills update pdf git` |
| Supprimer des compétences de manière interactive | `openskills manage` |
| Supprimer une compétence spécifique | `openskills remove pdf` |
| Synchroniser vers AGENTS.md | `openskills sync` |
| Chemin de sortie personnalisé | `openskills sync -o custom.md` |

## Mises en garde

### 1. Commande introuvable

**Problème** : L'exécution de la commande affiche "command not found"

**Causes** :
- Node.js n'est pas installé ou la version est trop ancienne (nécessite 20.6+)
- `npx` n'est pas utilisé ou non installé globalement

**Solution** :
```bash
# Utiliser npx (recommandé)
npx openskills list

# Ou installer globalement
npm install -g openskills
```

### 2. Compétence introuvable

**Problème** : `openskills read skill-name` affiche "Skill not found"

**Causes** :
- La compétence n'est pas installée
- Orthographe incorrecte du nom de la compétence
- L'emplacement d'installation de la compétence n'est pas dans le chemin de recherche

**Solution** :
```bash
# Vérifier les compétences installées
openskills list

# Voir les répertoires des compétences
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

### 3. Échec de la mise à jour

**Problème** : `openskills update` affiche "No metadata found"

**Causes** :
- La compétence n'a pas été installée via la commande `install`
- Le fichier de métadonnées `.openskills.json` a été supprimé

**Solution** : Réinstaller la compétence
```bash
openskills install <source-originale>
```

## Résumé du cours

OpenSkills fournit une interface de ligne de commande complète, couvrant l'installation, la liste, la lecture, la mise à jour, la synchronisation et la gestion des compétences. Maîtriser ces commandes est la base d'une utilisation efficace d'OpenSkills :

- `install` - Installer de nouvelles compétences (prend en charge GitHub, local, dépôts privés)
- `list` - Voir les compétences installées
- `read` - Lire le contenu des compétences (utilisé par les agents IA)
- `update` - Mettre à jour les compétences installées
- `sync` - Synchroniser vers AGENTS.md
- `manage` - Supprimer des compétences de manière interactive
- `remove` - Supprimer une compétence spécifique

Rappelez-vous le rôle des options globales :
- `--global` / `--universal` - Contrôler l'emplacement d'installation
- `--yes` - Ignorer les invites interactives (convient pour CI/CD)
- `--output` - Chemin du fichier de sortie personnalisé

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Sources d'installation détaillées](../install-sources/)**.
>
> Vous apprendrez :
> - Utilisation détaillée des trois méthodes d'installation
> - Scénarios d'utilisation de chaque méthode
> - Configuration des dépôts privés
