---
title: "API : Référence des outils | opencode-agent-skills"
sidebarTitle: "Les 4 outils API"
subtitle: "API : Référence des outils | opencode-agent-skills"
description: "Apprenez à utiliser les 4 outils API principaux d'opencode-agent-skills. Maîtrisez la configuration des paramètres, le traitement des valeurs de retour et le dépannage des erreurs. Découvrez le support des espaces de noms et les mécanismes de sécurité."
tags:
  - "API"
  - "Référence des outils"
  - "Documentation d'interface"
prerequisite:
  - "start-installation"
order: 2
---

# Référence des outils API

## Objectifs d'apprentissage

À l'issue de cette référence API, vous serez en mesure de :

- Comprendre les paramètres et valeurs de retour des 4 outils principaux
- Maîtriser les bonnes pratiques d'appel des outils
- Apprendre à gérer les erreurs courantes

## Vue d'ensemble des outils

Le plugin OpenCode Agent Skills fournit les 4 outils suivants :

| Nom de l'outil | Description | Cas d'utilisation |
| --- | --- | --- |
| `get_available_skills` | Obtenir la liste des compétences disponibles | Afficher toutes les compétences disponibles, avec filtrage par recherche |
| `read_skill_file` | Lire un fichier de compétence | Accéder aux fichiers de support d'une compétence (documentation, configuration, etc.) |
| `run_skill_script` | Exécuter un script de compétence | Lancer des scripts d'automatisation dans le répertoire de la compétence |
| `use_skill` | Charger une compétence | Injecter le contenu du SKILL.md dans le contexte de la session |

---

## get_available_skills

Obtient la liste des compétences disponibles, avec filtrage optionnel par recherche.

### Paramètres

| Nom du paramètre | Type | Requis | Description |
| --- | --- | --- | --- |
| `query` | string | Non | Chaîne de recherche, correspondance sur le nom et la description de la compétence (supporte le joker `*`) |

### Valeur de retour

Retourne une liste formatée de compétences, chaque élément contenant :

- Le nom de la compétence et son étiquette de source (ex. `skill-name (project)`)
- La description de la compétence
- La liste des scripts disponibles (le cas échéant)

**Exemple de retour** :
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### Gestion des erreurs

- En l'absence de résultat correspondant, un message d'information est retourné
- Si le paramètre de recherche contient une faute de frappe, des suggestions de compétences similaires sont proposées

### Exemples d'utilisation

**Lister toutes les compétences** :
```
Entrée utilisateur :
Lister toutes les compétences disponibles

Appel IA :
get_available_skills()
```

**Rechercher les compétences contenant "git"** :
```
Entrée utilisateur :
Trouver les compétences liées à git

Appel IA :
get_available_skills({
  "query": "git"
})
```

**Recherche avec joker** :
```
Appel IA :
get_available_skills({
  "query": "code*"
})

Retour :
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

Lit les fichiers de support dans le répertoire de la compétence (documentation, configuration, exemples, etc.).

### Paramètres

| Nom du paramètre | Type | Requis | Description |
| --- | --- | --- | --- |
| `skill` | string | Oui | Nom de la compétence |
| `filename` | string | Oui | Chemin du fichier (relatif au répertoire de la compétence, ex. `docs/guide.md`, `scripts/helper.sh`) |

### Valeur de retour

Retourne un message de confirmation du chargement du fichier.

**Exemple de retour** :
```
File "docs/guide.md" from skill "code-review" loaded.
```

Le contenu du fichier est injecté dans le contexte de la session au format XML :

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[Contenu réel du fichier]
  </content>
</skill-file>
```

### Gestion des erreurs

| Type d'erreur | Message retourné |
| --- | --- |
| Compétence inexistante | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Chemin non sécurisé | `Invalid path: cannot access files outside skill directory.` |
| Fichier inexistant | `File "xxx" not found. Available files: file1, file2, ...` |

### Mécanismes de sécurité

- Vérification de sécurité du chemin : prévention des attaques par traversée de répertoire (ex. `../../../etc/passwd`)
- Accès limité aux fichiers du répertoire de la compétence uniquement

### Exemples d'utilisation

**Lire la documentation d'une compétence** :
```
Entrée utilisateur :
Voir le guide d'utilisation de la compétence code-review

Appel IA :
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**Lire un fichier de configuration** :
```
Appel IA :
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

Exécute un script exécutable dans le répertoire de la compétence.

### Paramètres

| Nom du paramètre | Type | Requis | Description |
| --- | --- | --- | --- |
| `skill` | string | Oui | Nom de la compétence |
| `script` | string | Oui | Chemin relatif du script (ex. `build.sh`, `tools/deploy.sh`) |
| `arguments` | string[] | Non | Tableau d'arguments de ligne de commande à passer au script |

### Valeur de retour

Retourne la sortie du script.

**Exemple de retour** :
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### Gestion des erreurs

| Type d'erreur | Message retourné |
| --- | --- |
| Compétence inexistante | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Script inexistant | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| Échec d'exécution | `Script failed (exit 1): error message` |

### Règles de découverte des scripts

Le plugin scanne automatiquement les fichiers exécutables dans le répertoire de la compétence :

- Profondeur de récursion maximale : 10 niveaux
- Ignore les répertoires cachés (commençant par `.`)
- Ignore les répertoires de dépendances courants (`node_modules`, `__pycache__`, `.git`, etc.)
- Inclut uniquement les fichiers avec le bit d'exécution (`mode & 0o111`)

### Environnement d'exécution

- Le répertoire de travail (CWD) est défini sur le répertoire de la compétence
- Le script s'exécute dans le contexte du répertoire de la compétence
- La sortie est directement retournée à l'IA

### Exemples d'utilisation

**Exécuter un script de build** :
```
Entrée utilisateur :
Lancer le script de build du projet

Appel IA :
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**Exécution avec arguments** :
```
Appel IA :
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

Charge le contenu du SKILL.md d'une compétence dans le contexte de la session.

### Paramètres

| Nom du paramètre | Type | Requis | Description |
| --- | --- | --- | --- |
| `skill` | string | Oui | Nom de la compétence (supporte le préfixe d'espace de noms, ex. `project:my-skill`, `user:my-skill`) |

### Valeur de retour

Retourne un message de confirmation du chargement de la compétence, incluant la liste des scripts et fichiers disponibles.

**Exemple de retour** :
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

Le contenu de la compétence est injecté dans le contexte de la session au format XML :

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Mapping des outils Claude Code...]
  
  <content>
[Contenu réel du SKILL.md]
  </content>
</skill>
```

### Support des espaces de noms

Utilisez le préfixe d'espace de noms pour spécifier précisément la source de la compétence :

| Espace de noms | Description | Exemple |
| --- | --- | --- |
| `project:` | Compétence OpenCode au niveau projet | `project:my-skill` |
| `user:` | Compétence OpenCode au niveau utilisateur | `user:my-skill` |
| `claude-project:` | Compétence Claude au niveau projet | `claude-project:my-skill` |
| `claude-user:` | Compétence Claude au niveau utilisateur | `claude-user:my-skill` |
| Sans préfixe | Utilise la priorité par défaut | `my-skill` |

### Gestion des erreurs

| Type d'erreur | Message retourné |
| --- | --- |
| Compétence inexistante | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### Fonctionnalité d'injection automatique

Lors du chargement d'une compétence, le plugin effectue automatiquement :

1. Liste tous les fichiers du répertoire de la compétence (sauf SKILL.md)
2. Liste tous les scripts exécutables
3. Injecte le mapping des outils Claude Code (si la compétence le nécessite)

### Exemples d'utilisation

**Charger une compétence** :
```
Entrée utilisateur :
Aide-moi à faire une revue de code

Appel IA :
use_skill({
  "skill": "code-review"
})
```

**Spécifier la source avec un espace de noms** :
```
Appel IA :
use_skill({
  "skill": "user:git-helper"
})
```

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Outil | Chemin du fichier | Lignes |
| --- | --- | --- |
| Outil GetAvailableSkills | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| Outil ReadSkillFile | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| Outil RunSkillScript | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| Outil UseSkill | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| Enregistrement des outils | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Définition du type Skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Définition du type Script | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| Définition du type SkillLabel | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| Fonction resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**Types clés** :
- `Skill` : Métadonnées complètes de la compétence (name, description, path, scripts, template, etc.)
- `Script` : Métadonnées du script (relativePath, absolutePath)
- `SkillLabel` : Identifiant de source de la compétence (project, user, claude-project, etc.)

**Fonctions clés** :
- `resolveSkill()` : Résout le nom de la compétence, supporte les préfixes d'espace de noms
- `isPathSafe()` : Vérifie la sécurité du chemin, prévient la traversée de répertoire
- `findClosestMatch()` : Suggestions par correspondance approximative

</details>

---

## Prochaine leçon

Cette leçon a complété la documentation de référence des outils API d'OpenCode Agent Skills.

Pour plus d'informations, consultez :
- [Bonnes pratiques de développement de compétences](../best-practices/) - Apprenez les techniques et normes pour écrire des compétences de qualité
- [Dépannage des problèmes courants](../../faq/troubleshooting/) - Résolvez les problèmes courants rencontrés lors de l'utilisation du plugin
