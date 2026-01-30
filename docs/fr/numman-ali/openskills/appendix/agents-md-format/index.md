---
title: "Format du fichier AGENTS.md : Spécification des compétences | openskills"
sidebarTitle: "Faire connaître vos compétences à l'IA"
subtitle: "Spécification du format AGENTS.md"
description: "Apprenez la structure des balises XML et la définition de la liste de compétences du fichier AGENTS.md. Comprenez la signification des champs, le mécanisme de génération et les meilleures pratiques pour maîtriser le fonctionnement du système de compétences."
tags:
  - "annexe"
  - "référence"
  - "format"
prerequisite:
  - "/fr/numman-ali/openskills/sync-to-agents/"
order: 2
---

# Format du fichier AGENTS.md

**AGENTS.md** est le fichier de description des compétences généré par OpenSkills. Il indique aux agents AI (comme Claude Code, Cursor, Windsurf, etc.) quelles compétences sont disponibles et comment les invoquer.

## Ce que vous pourrez faire après avoir appris

- Comprendre la structure XML d'AGENTS.md et la signification de chaque balise
- Comprendre la définition des champs de la liste de compétences et leurs limitations d'utilisation
- Savoir comment éditer manuellement AGENTS.md (non recommandé, mais parfois nécessaire)
- Comprendre comment OpenSkills génère et met à jour ce fichier

## Exemple de format complet

Voici un exemple complet de fichier AGENTS.md :

```xml
# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
- For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>open-source-maintainer</name>
<description>End-to-end GitHub repository maintenance for open-source projects. Use when asked to triage issues, review PRs, analyze contributor activity, generate maintenance reports, or maintain a repository.</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

## Explication détaillée de la structure des balises

### Conteneur externe : `<skills_system>`

```xml
<skills_system priority="1">
  <!-- Contenu des compétences -->
</skills_system>
```

- **priority** : Marqueur de priorité (fixé à `"1"`), indiquant aux agents AI l'importance de ce système de compétences

::: tip Remarque
L'attribut `priority` est réservé pour une utilisation future, tous les fichiers AGENTS.md utilisent la valeur fixe `"1"`.
:::

### Instructions d'utilisation : `<usage>`

La balise `<usage>` contient des instructions sur la manière dont les agents AI doivent utiliser les compétences :

```xml
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>
```

**Points clés** :
- **Condition de déclenchement** : Vérifier si la tâche de l'utilisateur peut être effectuée plus efficacement avec une compétence
- **Méthode d'invocation** : Utiliser la commande `npx openskills read <skill-name>`
- **Invocation multiple** : Prend en charge plusieurs noms de compétences séparés par des virgules
- **Répertoire de base** : La sortie inclut un champ `base_dir` pour résoudre les fichiers référencés dans la compétence (comme `references/`, `scripts/`, `assets/`)
- **Limitations d'utilisation** :
  - N'utiliser que les compétences listées dans `<available_skills>`
  - Ne pas recharger une compétence déjà chargée dans le contexte
  - Chaque invocation de compétence est sans état

### Liste des compétences : `<available_skills>`

`<available_skills>` contient la liste de toutes les compétences disponibles, chaque compétence étant définie par une balise `<skill>` :

```xml
<available_skills>

<skill>
<name>nom-de-la-competence</name>
<description>Description de la compétence...</description>
<location>project</location>
</skill>

<skill>
<name>autre-competence</name>
<description>Description d'une autre compétence...</description>
<location>global</location>
</skill>

</available_skills>
```

#### Champs de la balise `<skill>`

Chaque `<skill>` contient les champs obligatoires suivants :

| Champ         | Type     | Valeurs possibles             | Explication                                                   |
|--- | --- | --- | ---|
| `<name>`      | string   | -                             | Nom de la compétence (cohérent avec le nom du fichier SKILL.md ou le champ `name` dans le YAML) |
| `<description>` | string | -                             | Description de la compétence (provenant du YAML frontmatter de SKILL.md) |
| `<location>`  | string   | `project` \| `global`         | Marqueur de l'emplacement d'installation de la compétence (pour aider les agents AI à comprendre la source de la compétence) |

**Explication des champs** :

- **`<name>`** : Identifiant unique de la compétence, que les agents AI utilisent pour invoquer la compétence
- **`<description>`** : Explique en détail la fonctionnalité et les scénarios d'utilisation de la compétence, aidant l'IA à décider si elle doit utiliser cette compétence
- **`<location>`** :
  - `project` : Installé localement dans le projet (`.claude/skills/` ou `.agent/skills/`)
  - `global` : Installé dans le répertoire global (`~/.claude/skills/`)

::: info Pourquoi avons-nous besoin du marquage location ?
Le marquage `<location>` aide les agents AI à comprendre la portée de visibilité des compétences :
- Les compétences `project` ne sont disponibles que dans le projet actuel
- Les compétences `global` sont disponibles dans tous les projets
Cela affecte la stratégie de sélection des compétences par les agents AI.
:::

## Méthodes de marquage

AGENTS.md prend en charge deux méthodes de marquage, que OpenSkills reconnaît automatiquement :

### Méthode 1 : Balises XML (recommandée)

```xml
<skills_system priority="1">
  <!-- Contenu des compétences -->
</skills_system>
```

C'est la méthode par défaut, utilisant des balises XML standard pour marquer le début et la fin du système de compétences.

### Méthode 2 : Marquage par commentaires HTML (mode compatibilité)

```xml
<!-- SKILLS_TABLE_START -->

## Available Skills

<usage>
  <!-- Instructions d'utilisation -->
</usage>

<available_skills>
  <!-- Liste des compétences -->
</available_skills>

<!-- SKILLS_TABLE_END -->
```

Ce format supprime le conteneur externe `<skills_system>` et n'utilise que des commentaires HTML pour marquer le début et la fin de la zone de compétences.

::: tip Logique de traitement d'OpenSkills
La fonction `replaceSkillsSection()` (`src/utils/agents-md.ts:67-93`) recherche les marques selon la priorité suivante :
1. D'abord rechercher les balises XML `<skills_system>`
2. Si introuvable, rechercher les commentaires HTML `<!-- SKILLS_TABLE_START -->`
3. Si aucun n'est trouvé, ajouter le contenu à la fin du fichier
:::

## Comment OpenSkills génère AGENTS.md

Lorsque vous exécutez `openskills sync`, OpenSkills va :

1. **Rechercher toutes les compétences installées** (`findAllSkills()`)
2. **Sélection interactive des compétences** (sauf si vous utilisez le drapeau `-y`)
3. **Générer le contenu XML** (`generateSkillsXml()`)
   - Construire les instructions `<usage>`
   - Générer une balise `<skill>` pour chaque compétence
4. **Remplacer la section des compétences dans le fichier** (`replaceSkillsSection()`)
   - Rechercher les marques existantes (XML ou commentaires HTML)
   - Remplacer le contenu entre les marques
   - S'il n'y a pas de marques, ajouter à la fin du fichier

### Emplacements du code source

| Fonction            | Chemin du fichier                                                                      | Ligne  |
|--- | --- | ---|
| Génération XML      | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62  |
| Remplacement de la section compétences | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93  |
| Analyse des compétences existantes | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18   |

## Précautions pour l'édition manuelle

::: warning Édition manuelle non recommandée
Bien qu'il soit possible d'éditer manuellement AGENTS.md, il est recommandé de :
1. Utiliser la commande `openskills sync` pour générer et mettre à jour
2. Le contenu édité manuellement sera écrasé lors du prochain `sync`
3. Si vous avez besoin de personnaliser la liste des compétences, utilisez la sélection interactive (sans le drapeau `-y`)
:::

Si vous devez vraiment éditer manuellement, veuillez noter :

1. **Garder la syntaxe XML correcte** : Assurez-vous que toutes les balises sont correctement fermées
2. **Ne pas modifier les marques** : Conserver les marques `<skills_system>` ou `<!-- SKILLS_TABLE_START -->`
3. **Champs complets** : Chaque `<skill>` doit contenir les trois champs `<name>`, `<description>`, `<location>`
4. **Pas de compétences en double** : N'ajoutez pas plusieurs fois une compétence du même nom

## Questions fréquentes

### Q1 : Pourquoi AGENTS.md n'a-t-il parfois pas de balise `<skills_system>` ?

**R** : C'est le mode compatibilité. Si votre fichier utilise des commentaires HTML (`<!-- SKILLS_TABLE_START -->`), OpenSkills les reconnaîtra également. Lors du prochain `sync`, ils seront automatiquement convertis en balises XML.

### Q2 : Comment supprimer toutes les compétences ?

**R** : Exécutez `openskills sync` et désélectionnez toutes les compétences dans l'interface interactive, ou exécutez :

```bash
openskills sync -y --output /dev/null
```

Cela videra la section des compétences dans AGENTS.md (mais conservera les marques).

### Q3 : Le champ location a-t-il un impact réel sur les agents AI ?

**R** : Cela dépend de l'implémentation spécifique de l'agent AI. En général :
- `location="project"` signifie que la compétence n'a de sens que dans le contexte du projet actuel
- `location="global"` signifie que la compétence est un outil général qui peut être utilisé dans n'importe quel projet

Les agents AI peuvent ajuster leur stratégie de chargement des compétences en fonction de cette marque, mais la plupart des agents (comme Claude Code) ignorent ce champ et invoquent directement `openskills read`.

### Q4 : Quelle longueur la description de la compétence doit-elle avoir ?

**R** : La description de la compétence doit être :
- **Concise mais complète** : Expliquer la fonctionnalité principale de la compétence et les scénarios d'utilisation principaux
- **Éviter d'être trop courte** : Une description sur une seule ligne est difficile à comprendre pour l'IA pour savoir quand l'utiliser
- **Éviter d'être trop longue** : Une description trop longue gaspille du contexte et l'IA ne la lira pas attentivement

Longueur recommandée : **50-150 mots**.

## Meilleures pratiques

1. **Utiliser la commande sync** : Utilisez toujours `openskills sync` pour générer AGENTS.md, au lieu de l'éditer manuellement
2. **Mise à jour régulière** : Après avoir installé ou mis à jour des compétences, n'oubliez pas d'exécuter `openskills sync`
3. **Choisir les compétences appropriées** : Toutes les compétences installées n'ont pas besoin d'être dans AGENTS.md, choisissez en fonction des besoins du projet
4. **Vérifier le format** : Si l'agent AI ne peut pas reconnaître les compétences, vérifiez que les balises XML d'AGENTS.md sont correctes

## Aperçu du prochain cours

> Dans le prochain cours, nous allons apprendre **[Structure des fichiers](../file-structure/)**.
>
> Vous apprendrez :
> - La structure des répertoires et fichiers générés par OpenSkills
> - Le rôle et l'emplacement de chaque fichier
> - Comment comprendre et gérer les répertoires de compétences

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonction           | Chemin du fichier                                                                                     | Ligne  |
|--- | --- | ---|
| Génération des compétences XML | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62  |
| Remplacement de la section compétences | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93  |
| Analyse des compétences existantes | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18)  | 6-18   |
| Définition de type Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6)           | 1-6    |

**Constantes clés** :
- `priority="1"` : Marqueur de priorité du système de compétences (valeur fixe)

**Fonctions clés** :
- `generateSkillsXml(skills: Skill[])` : Génère la liste des compétences au format XML
- `replaceSkillsSection(content: string, newSection: string)` : Remplace ou ajoute la section des compétences
- `parseCurrentSkills(content: string)` : Analyse les noms des compétences activées à partir d'AGENTS.md

</details>
