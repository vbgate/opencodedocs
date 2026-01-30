---
title: "API CLI : Référence des commandes | OpenSkills"
subtitle: "API CLI : Référence des commandes | OpenSkills"
sidebarTitle: "Toutes les commandes"
description: "Apprenez l'API de ligne de commande complète d'OpenSkills. Consultez les paramètres, options et exemples d'utilisation de toutes les commandes pour maîtriser rapidement leur usage."
tags:
  - "API"
  - "CLI"
  - "Référence des commandes"
  - "Description des options"
prerequisite: []
order: 1
---

# Référence de l'API CLI OpenSkills

## Ce que vous pourrez faire après ce cours

- Comprendre l'utilisation complète de toutes les commandes OpenSkills
- Maîtriser les paramètres et options de chaque commande
- Savoir comment combiner les commandes pour accomplir des tâches

## De quoi s'agit-il

La référence de l'API CLI OpenSkills fournit une documentation complète de toutes les commandes, y compris les paramètres, options et exemples d'utilisation. C'est un manuel de référence que vous pouvez consulter lorsque vous avez besoin de comprendre en profondeur une commande spécifique.

---

## Aperçu

OpenSkills CLI fournit les commandes suivantes :

```bash
openskills install <source>   # Installer des compétences
openskills list                # Lister les compétences installées
openskills read <name>         # Lire le contenu d'une compétence
openskills sync                # Synchroniser avec AGENTS.md
openskills update [name...]    # Mettre à jour des compétences
openskills manage              # Gérer les compétences de manière interactive
openskills remove <name>       # Supprimer une compétence
```

---

## Commande install

Installe des compétences depuis GitHub, un chemin local ou un dépôt git privé.

### Syntaxe

```bash
openskills install <source> [options]
```

### Paramètres

| Paramètre | Type | Requis | Description |
|--- | --- | --- | ---|
| `<source>` | string | O | Source de la compétence (voir formats ci-dessous) |

### Options

| Option | Raccourci | Type | Défaut | Description |
|--- | --- | --- | --- | ---|
| `--global` | `-g` | flag | false | Installation globale dans `~/.claude/skills/` |
| `--universal` | `-u` | flag | false | Installation dans `.agent/skills/` (environnement multi-agent) |
| `--yes` | `-y` | flag | false | Ignorer la sélection interactive, installer toutes les compétences trouvées |

### Formats de source

| Format | Exemple | Description |
|--- | --- | ---|
| Raccourci GitHub | `anthropics/skills` | Installation depuis un dépôt GitHub public |
| URL Git | `https://github.com/owner/repo.git` | URL Git complète |
| URL Git SSH | `git@github.com:owner/repo.git` | Dépôt privé SSH |
| Chemin local | `./my-skill` ou `~/dev/skills` | Installation depuis un répertoire local |

### Exemples

```bash
# Installation depuis GitHub (sélection interactive)
openskills install anthropics/skills

# Installation depuis GitHub (non-interactif)
openskills install anthropics/skills -y

# Installation globale
openskills install anthropics/skills --global

# Installation en environnement multi-agent
openskills install anthropics/skills --universal

# Installation depuis un chemin local
openskills install ./my-custom-skill

# Installation depuis un dépôt privé
openskills install git@github.com:your-org/private-skills.git
```

### Sortie

Après une installation réussie, il affiche :
- La liste des compétences installées
- L'emplacement d'installation (projet/global)
- Une invite à exécuter `openskills sync`

---

## Commande list

Liste toutes les compétences installées.

### Syntaxe

```bash
openskills list
```

### Paramètres

Aucun.

### Options

Aucune.

### Exemples

```bash
openskills list
```

### Sortie

```
Compétences installées :

┌────────────────────┬────────────────────────────────────┬──────────┐
│ Nom de compétence │ Description                         │ Emplacement│
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit             │ project  │
│ git-workflow       │ Git workflow automation              │ global   │
│ skill-creator      │ Guide for creating effective skills  │ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

Statistiques : 3 compétences (2 de niveau projet, 1 globale)
```

### Description des emplacements de compétences

- **project** : Installé dans `.claude/skills/` ou `.agent/skills/`
- **global** : Installé dans `~/.claude/skills/` ou `~/.agent/skills/`

---

## Commande read

Lit le contenu d'une compétence vers la sortie standard (pour utilisation par les agents IA).

### Syntaxe

```bash
openskills read <skill-names...>
```

### Paramètres

| Paramètre | Type | Requis | Description |
|--- | --- | --- | ---|
| `<skill-names...>` | string | O | Noms des compétences (liste séparée par des virgules) |

### Options

Aucune.

### Exemples

```bash
# Lire une seule compétence
openskills read pdf

# Lire plusieurs compétences (séparées par des virgules)
openskills read pdf,git-workflow

# Lire plusieurs compétences (séparées par des espaces)
openskills read pdf git-workflow
```

### Sortie

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### Utilisation

Cette commande est principalement utilisée par les agents IA pour charger le contenu des compétences. Les utilisateurs peuvent également l'utiliser pour consulter les instructions détaillées d'une compétence.

---

## Commande sync

Synchronise les compétences installées avec AGENTS.md (ou un autre fichier).

### Syntaxe

```bash
openskills sync [options]
```

### Paramètres

Aucun.

### Options

| Option | Raccourci | Type | Défaut | Description |
|--- | --- | --- | --- | ---|
| `--output <path>` | `-o` | string | `AGENTS.md` | Chemin du fichier de sortie |
| `--yes` | `-y` | flag | false | Ignorer la sélection interactive, synchroniser toutes les compétences |

### Exemples

```bash
# Synchroniser avec AGENTS.md par défaut (interactif)
openskills sync

# Synchroniser avec un chemin personnalisé
openskills sync -o .ruler/AGENTS.md

# Synchronisation non-interactive (CI/CD)
openskills sync -y

# Synchronisation non-interactive vers un chemin personnalisé
openskills sync -y -o .ruler/AGENTS.md
```

### Sortie

Après la synchronisation, le contenu suivant sera généré dans le fichier spécifié :

```xml
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## Commande update

Actualise les compétences installées depuis leur source.

### Syntaxe

```bash
openskills update [skill-names...]
```

### Paramètres

| Paramètre | Type | Requis | Description |
|--- | --- | --- | ---|
| `[skill-names...]` | string | N | Noms des compétences (séparés par des virgules), toutes par défaut |

### Options

Aucune.

### Exemples

```bash
# Mettre à jour toutes les compétences installées
openskills update

# Mettre à jour des compétences spécifiques
openskills update pdf,git-workflow

# Mettre à jour une seule compétence
openskills update pdf
```

### Sortie

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### Règles de mise à jour

- Met à jour uniquement les compétences avec des métadonnées enregistrées
- Compétences de chemin local : copie directe depuis le chemin source
- Compétences de dépôt Git : re-clonage et copie
- Compétences sans métadonnées : ignorées avec invite à réinstaller

---

## Commande manage

Gestion interactive (suppression) des compétences installées.

### Syntaxe

```bash
openskills manage
```

### Paramètres

Aucun.

### Options

Aucune.

### Exemples

```bash
openskills manage
```

### Interface interactive

```
Sélectionnez les compétences à supprimer :

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

Action : [↑/↓] Sélectionner [Espace] Basculer [Entrée] Confirmer [Esc] Annuler
```

### Sortie

```
1 compétence supprimée :
- skill-creator (project)
```

---

## Commande remove

Supprime les compétences installées spécifiées (mode script).

### Syntaxe

```bash
openskills remove <skill-name>
```

### Alias

`rm`

### Paramètres

| Paramètre | Type | Requis | Description |
|--- | --- | --- | ---|
| `<skill-name>` | string | O | Nom de la compétence |

### Options

Aucune.

### Exemples

```bash
# Supprimer une compétence
openskills remove pdf

# Utiliser l'alias
openskills rm pdf
```

### Sortie

```
Compétence supprimée : pdf (project)
Emplacement : /path/to/.claude/skills/pdf
Source : anthropics/skills
```

---

## Options globales

Les options suivantes s'appliquent à toutes les commandes :

| Option | Raccourci | Type | Défaut | Description |
|--- | --- | --- | --- | ---|
| `--version` | `-V` | flag | - | Afficher le numéro de version |
| `--help` | `-h` | flag | - | Afficher l'aide |

### Exemples

```bash
# Afficher la version
openskills --version

# Afficher l'aide globale
openskills --help

# Afficher l'aide d'une commande spécifique
openskills install --help
```

---

## Priorité de recherche de compétences

Lorsque plusieurs emplacements d'installation existent, les compétences sont recherchées dans l'ordre de priorité suivant (du plus élevé au plus bas) :

1. `./.agent/skills/` - Niveau projet universal
2. `~/.agent/skills/` - Niveau global universal
3. `./.claude/skills/` - Niveau projet
4. `~/.claude/skills/` - Niveau global

**Important** : Seule la première compétence trouvée sera renvoyée (celle avec la priorité la plus élevée).

---

## Codes de sortie

| Code de sortie | Description |
|--- | ---|
| 0 | Succès |
| 1 | Erreur (erreur de paramètre, échec de commande, etc.) |

---

## Variables d'environnement

La version actuelle ne prend pas en charge la configuration par variables d'environnement.

---

## Fichiers de configuration

OpenSkills utilise les fichiers de configuration suivants :

- **Métadonnées de compétence** : `.claude/skills/<skill-name>/.openskills.json`
  - Enregistre la source d'installation, l'horodatage, etc.
  - Utilisé par la commande `update` pour actualiser les compétences

### Exemple de métadonnées

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Spécifications du format AGENTS.md](../agents-md-format/)**.
>
> Vous apprendrez :
> - La structure des balises XML d'AGENTS.md et la signification de chaque balise
> - Les définitions de champs et les restrictions d'utilisation de la liste des compétences
> - Comment OpenSkills génère et met à jour AGENTS.md
> - Les méthodes de marquage (balises XML et commentaires HTML)

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Commande | Chemin du fichier | Lignes |
|--- | --- | ---|
| Point d'entrée CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 13-80 |
| Commande install | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562 |
| Commande list | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 1-50 |
| Commande read | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| Commande sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 1-101 |
| Commande update | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173 |
| Commande manage | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50 |
| Commande remove | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30 |
| Définitions de types | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-25 |

**Constantes clés** :
- Aucune constante globale

**Types clés** :
- `Skill` : Interface d'information de compétence (name, description, location, path)
- `SkillLocation` : Interface d'emplacement de compétence (path, baseDir, source)
- `InstallOptions` : Interface d'options d'installation (global, universal, yes)

**Fonctions clés** :
- `program.command()` : Définit une commande (commander.js)
- `program.option()` : Définit une option (commander.js)
- `program.action()` : Définit une fonction de traitement de commande (commander.js)

</details>
