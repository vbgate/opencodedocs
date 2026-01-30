---
title: "Structure des fichiers : Organisation des répertoires | opencode-openskills"
sidebarTitle: "Où placer les compétences"
subtitle: "Structure des fichiers : Organisation des répertoires | opencode-openskills"
description: "Apprenez l'organisation des répertoires et fichiers d'OpenSkills. Maîtrisez le répertoire d'installation des compétences, la structure des répertoires, le format AGENTS.md et les priorités de recherche."
tags:
  - "Annexe"
  - "Structure des fichiers"
  - "Organisation des répertoires"
prerequisite: []
order: 3
---

# Structure des fichiers

## Vue d'ensemble

La structure des fichiers d'OpenSkills est divisée en trois catégories : **répertoires d'installation des compétences**, **structure des répertoires de compétences** et **fichier de synchronisation AGENTS.md**. Comprendre ces structures vous aide à mieux gérer et utiliser les compétences.

## Répertoires d'installation des compétences

OpenSkills prend en charge 4 emplacements d'installation de compétences, classés par priorité décroissante :

| Priorité | Emplacement | Description | Quand utiliser |
|--- | --- | --- | ---|
| 1 | `./.agent/skills/` | Mode Universel local au projet | Environnement multi-agent, éviter les conflits avec Claude Code |
| 2 | `~/.agent/skills/` | Mode Universel global | Environnement multi-agent + installation globale |
| 3 | `./.claude/skills/` | Local au projet (par défaut) | Installation standard, compétences spécifiques au projet |
| 4 | `~/.claude/skills/` | Installation globale | Compétences partagées entre tous les projets |

**Recommandations de choix** :
- Environnement mono-agent : utilisez `.claude/skills/` par défaut
- Environnement multi-agent : utilisez `.agent/skills/` (drapeau `--universal`)
- Compétences inter-projets : utilisez l'installation globale (drapeau `--global`)

## Structure des répertoires de compétences

Chaque compétence est un répertoire indépendant, contenant des fichiers obligatoires et des ressources optionnelles :

```
skill-name/
├── SKILL.md              # Obligatoire : fichier principal de la compétence
├── .openskills.json      # Obligatoire : métadonnées d'installation (généré automatiquement)
├── references/           # Optionnel : documentation de référence
│   └── api-docs.md
├── scripts/             # Optionnel : scripts exécutables
│   └── helper.py
└── assets/              # Optionnel : modèles et fichiers de sortie
    └── template.json
```

### Description des fichiers

#### SKILL.md (obligatoire)

Fichier principal de la compétence, contenant le frontmatter YAML et les instructions de la compétence :

```yaml
---
name: my-skill
description: Description de la compétence
---

## Titre de la compétence

Contenu des instructions de la compétence...
```

**Points clés** :
- Le nom du fichier doit être `SKILL.md` (majuscules)
- Le frontmatter YAML doit contenir `name` et `description`
- Le contenu utilise l'impératif (forme impérative)

#### .openskills.json (obligatoire, généré automatiquement)

Fichier de métadonnées créé automatiquement par OpenSkills, enregistrant la source d'installation :

```json
{
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2026-01-24T12:00:00.000Z"
}
```

**Utilisation** :
- Prend en charge les mises à jour de compétences (`openskills update`)
- Enregistre l'horodatage d'installation
- Suit la source de la compétence

**Emplacement source** :
- `src/utils/skill-metadata.ts:29-36` - Écriture des métadonnées
- `src/utils/skill-metadata.ts:17-27` - Lecture des métadonnées

#### references/ (optionnel)

Contient la documentation de référence et les spécifications d'API :

```
references/
├── skill-format.md      # Spécifications du format de compétence
├── api-docs.md         # Documentation de l'API
└── best-practices.md   # Meilleures pratiques
```

**Scénarios d'utilisation** :
- Documentation technique détaillée (garder SKILL.md concis)
- Manuel de référence de l'API
- Exemples de code et modèles

#### scripts/ (optionnel)

Contient des scripts exécutables :

```
scripts/
├── extract_text.py      # Script Python
├── deploy.sh          # Script Shell
└── build.js          # Script Node.js
```

**Scénarios d'utilisation** :
- Scripts d'automatisation à exécuter lors de l'exécution de la compétence
- Outils de traitement et de conversion de données
- Scripts de déploiement et de construction

#### assets/ (optionnel)

Contient des modèles et des fichiers de sortie :

```
assets/
├── template.json      # Modèle JSON
├── config.yaml       # Fichier de configuration
└── output.md        # Exemple de sortie
```

**Scénarios d'utilisation** :
- Modèles pour le contenu généré par la compétence
- Exemples de fichiers de configuration
- Exemples de sorties attendues

## Structure AGENTS.md

Le fichier AGENTS.md généré par `openskills sync` contient la description du système de compétences et la liste des compétences disponibles :

### Format complet

```markdown
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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### Description des composants

| Composant | Description |
|--- | ---|
| `<skills_system>` | Balise XML, marque la section du système de compétences |
| `<usage>` | Instructions d'utilisation des compétences (indique à l'IA comment invoquer les compétences) |
| `<available_skills>` | Liste des compétences disponibles (une balise `<skill>` par compétence) |
| `<skill>` | Informations sur une seule compétence (name, description, location) |
| `<!-- SKILLS_TABLE_START -->` | Marqueur de début (utilisé pour le positionnement lors de la synchronisation) |
| `<!-- SKILLS_TABLE_END -->` | Marqueur de fin (utilisé pour le positionnement lors de la synchronisation) |

**Champ location** :
- `project` - Compétences locales au projet (`.claude/skills/` ou `.agent/skills/`)
- `global` - Compétences globales (`~/.claude/skills/` ou `~/.agent/skills/`)

## Priorité de recherche dans les répertoires

Lors de la recherche de compétences, OpenSkills parcourt les répertoires dans l'ordre de priorité suivant :

```typescript
// Emplacement source : src/utils/dirs.ts:18-25
[
  join(process.cwd(), '.agent/skills'),   // 1. Universel local au projet
  join(homedir(), '.agent/skills'),        // 2. Universel global
  join(process.cwd(), '.claude/skills'),  // 3. Claude local au projet
  join(homedir(), '.claude/skills'),       // 4. Claude global
]
```

**Règles** :
- Arrête la recherche dès qu'une compétence correspondante est trouvée
- Les compétences locales au projet ont priorité sur les compétences globales
- Le mode Universel a priorité sur le mode standard

**Emplacement source** : `src/utils/skills.ts:30-64` - Implémentation de la recherche de toutes les compétences

## Exemple : structure de projet complète

Une structure de projet typique utilisant OpenSkills :

```
my-project/
├── AGENTS.md                    # Liste des compétences générée par synchronisation
├── .claude/                     # Configuration Claude Code
│   └── skills/                  # Répertoire d'installation des compétences
│       ├── pdf/
│       │   ├── SKILL.md
│       │   ├── .openskills.json
│       │   ├── references/
│       │   ├── scripts/
│       │   └── assets/
│       └── git-workflow/
│           ├── SKILL.md
│           └── .openskills.json
├── .agent/                      # Répertoire mode Universel (optionnel)
│   └── skills/
│       └── my-custom-skill/
│           ├── SKILL.md
│           └── .openskills.json
├── src/                         # Code source du projet
├── package.json
└── README.md
```

## Meilleures pratiques

### 1. Choix du répertoire

| Scénario | Répertoire recommandé | Commande |
|--- | --- | ---|
| Compétences spécifiques au projet | `.claude/skills/` | `openskills install repo` |
| Partage multi-agent | `.agent/skills/` | `openskills install repo --universal` |
| Inter-projets | `~/.claude/skills/` | `openskills install repo --global` |

### 2. Organisation des compétences

- **Dépôt mono-compétence** : placez `SKILL.md` à la racine
- **Dépôt multi-compétences** : chaque sous-répertoire contient son propre `SKILL.md`
- **Liens symboliques** : utilisez symlink pendant le développement vers le dépôt local (voir [Support des liens symboliques](../../advanced/symlink-support/))

### 3. Contrôle de version AGENTS.md

- **Recommandé de commit** : ajoutez `AGENTS.md` au contrôle de version
- **Synchronisation CI** : exécutez `openskills sync -y` dans CI/CD (voir [Intégration CI/CD](../../advanced/ci-integration/))
- **Collaboration d'équipe** : les membres de l'équipe exécutent `openskills sync` pour rester synchronisés

## Résumé de la leçon

La structure des fichiers d'OpenSkills est conçue de manière simple et claire :

- **4 répertoires d'installation** : prend en charge local au projet, global, mode Universel
- **Répertoire de compétences** : SKILL.md obligatoire + .openskills.json généré automatiquement + ressources/scripts/assets optionnels
- **AGENTS.md** : liste des compétences générée par synchronisation, suivant le format Claude Code

Comprendre ces structures vous aide à gérer et utiliser les compétences plus efficacement.

## Aperçu de la leçon suivante

> Dans la leçon suivante, nous apprendrons **[Glossaire](../glossary/)**.
>
> Vous apprendrez :
> > - Les termes clés d'OpenSkills et des systèmes de compétences IA
> > - Définitions précises des concepts professionnels
> > - Signification des abréviations courantes

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Mis à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Utilitaires de chemin de répertoire | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 1-25 |
| Recherche de compétences | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-84 |
| Gestion des métadonnées | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts) | 1-36 |

**Fonctions clés** :
- `getSkillsDir(projectLocal, universal)` - Récupère le chemin du répertoire des compétences
- `getSearchDirs()` - Récupère les 4 répertoires de recherche (par priorité)
- `findAllSkills()` - Trouve toutes les compétences installées
- `findSkill(skillName)` - Trouve une compétence spécifique
- `readSkillMetadata(skillDir)` - Lit les métadonnées d'une compétence
- `writeSkillMetadata(skillDir, metadata)` - Écrit les métadonnées d'une compétence

</details>
