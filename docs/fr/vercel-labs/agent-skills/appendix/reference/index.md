---
title: "Référence API: Commandes et types | Agent Skills"
sidebarTitle: "Référence API"
subtitle: "Référence API: Commandes et types"
description: "Consultez la référence complète d'Agent Skills: commandes de construction, types TypeScript, modèle SKILL.md et niveaux d'impact."
tags:
  - "Référence"
  - "API"
  - "Ligne de commande"
  - "Définitions de types"
prerequisite: []
---

# API et référence de commandes

Cette page fournit la référence complète de l'API et des commandes d'Agent Skills, incluant les commandes de la chaîne d'outils de construction, les définitions de types TypeScript, le modèle SKILL.md et les valeurs d'énumation des niveaux d'impact.

## Définitions de types TypeScript

### ImpactLevel (Niveau d'impact）

Le niveau d'impact identifie le degré d'impact sur les performances des règles, avec 6 niveaux :

| Valeur | Description | Scénario d'application |
|--- | --- | ---|
| `CRITICAL` | Goulot d'étranglement critique | Doit être corrigé, sinon impacte gravement l'expérience utilisateur (comme les requêtes en cascade, bundle non optimisé) |
| `HIGH` | Amélioration importante | Amélioration significative des performances (comme le cache serveur, élimination des props dupliquées) |
| `MEDIUM-HIGH` | Priorité moyennement élevée | Amélioration notable des performances (comme l'optimisation de la récupération de données) |
| `MEDIUM` | Amélioration modérée | Amélioration mesurable des performances (comme l'optimisation Memo, réduction des re-renders) |
| `LOW-MEDIUM` | Priorité moyennement basse | Amélioration légère des performances (comme l'optimisation du rendu) |
| `LOW` | Amélioration incrémentale | Micro-optimisation (comme le style de code, modes avancés) |

**Emplacement dans le code** : `types.ts:5`

### CodeExample (Exemple de code)

Structure de l'exemple de code dans les règles :

| Champ | Type | Obligatoire | Description |
|--- | --- | --- | ---|
| `label` | string | ✅ | Étiquette de l'exemple (comme « Incorrect », « Correct ») |
| `description` | string | ❌ | Description de l'étiquette (optionnel) |
| `code` | string | ✅ | Contenu du code |
| `language` | string | ❌ | Langage du code (par défaut 'typescript') |
| `additionalText` | string | ❌ | Texte supplémentaire (optionnel) |

**Emplacement dans le code** : `types.ts:7-13`

### Rule (Règle)

Structure complète d'une seule règle d'optimisation des performances :

| Champ | Type | Obligatoire | Description |
|--- | --- | --- | ---|
| `id` | string | ✅ | ID de règle (généré automatiquement, comme « 1.1 », « 2.3 ») |
| `title` | string | ✅ | Titre de la règle |
| `section` | number | ✅ | Section d'appartenance (1-8) |
| `subsection` | number | ❌ | Numéro de sous-section (généré automatiquement) |
| `impact` | ImpactLevel | ✅ | Niveau d'impact |
| `impactDescription` | string | ❌ | Description de l'impact (comme « 2-10× improvement ») |
| `explanation` | string | ✅ | Explication de la règle |
| `examples` | CodeExample[] | ✅ | Tableau d'exemples de code (au moins 1) |
| `references` | string[] | ❌ | Liens de référence |
| `tags` | string[] | ❌ | Étiquettes (pour la recherche) |

**Emplacement dans le code** : `types.ts:15-26`

### Section (Section)

Structure de section des règles :

| Champ | Type | Obligatoire | Description |
|--- | --- | --- | ---|
| `number` | number | ✅ | Numéro de section (1-8) |
| `title` | string | ✅ | Titre de section |
| `impact` | ImpactLevel | ✅ | Niveau d'impact global |
| `impactDescription` | string | ❌ | Description de l'impact |
| `introduction` | string | ❌ | Introduction de section |
| `rules` | Rule[] | ✅ | Tableau de règles incluses |

**Emplacement dans le code** : `types.ts:28-35`

### GuidelinesDocument (Document de directives)

Structure complète du document de directives :

| Champ | Type | Obligatoire | Description |
|--- | --- | --- | ---|
| `version` | string | ✅ | Numéro de version |
| `organization` | string | ✅ | Nom de l'organisation |
| `date` | string | ✅ | Date |
| `abstract` | string | ✅ | Résumé |
| `sections` | Section[] | ✅ | Tableau de sections |
| `references` | string[] | ❌ | Références |

**Emplacement dans le code** : `types.ts:37-44`

### TestCase (Cas de test)

Structure des cas de test extraits des règles :

| Champ | Type | Obligatoire | Description |
|--- | --- | --- | ---|
| `ruleId` | string | ✅ | ID de règle (comme « 1.1 ») |
| `ruleTitle` | string | ✅ | Titre de règle |
| `type` | 'bad' \| 'good' | ✅ | Type de cas de test |
| `code` | string | ✅ | Contenu du code |
| `language` | string | ✅ | Langage du code |
| `description` | string | ❌ | Description |

**Emplacement dans le code** : `types.ts:46-53`

## Commandes de la chaîne d'outils de construction

### pnpm build

Construit la documentation des règles et extrait les cas de test.

**Commande** :
```bash
pnpm build
```

**Fonctions** :
1. Analyser tous les fichiers de règles (`rules/*.md`)
2. Grouper et trier par section
3. Générer le guide complet `AGENTS.md`
4. Extraire les cas de test vers `test-cases.json`

**Sortie** :
```bash
Processed 57 rules
Generated AGENTS.md
Extracted 114 test cases
```

**Emplacement dans le code** : `build.ts`

### pnpm validate

Valide le format et l'intégrité de tous les fichiers de règles.

**Commande** :
```bash
pnpm validate
```

**Éléments vérifiés** :
- ✅ Titre de règle non vide
- ✅ Explication de règle non vide
- ✅ Au moins un exemple de code
- ✅ Contient des exemples Bad/Incorrect et Good/Correct
- ✅ Niveau d'impact valide (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

**Sortie de succès** :
```bash
✓ All 57 rules are valid
```

**Sortie d'échec** :
```bash
✗ Validation failed

✖ [async-parallel.md]: Missing or empty title
   rules/async-parallel.md:2

2 errors found
```

**Emplacement dans le code** : `validate.ts`

## Modèle SKILL.md

### Modèle de définition de compétence Claude.ai

Chaque compétence Claude.ai doit inclure le fichier `SKILL.md` :

```markdown
---
name: {skill-name}
description: {One sentence describing when to use this skill. Include trigger phrases like "Deploy my app", "Check logs", etc.}
---

# {Skill Title}

{Brief description of what skill does.}

## How It Works

{Numbered list explaining skill's workflow}

## Usage

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**Arguments:**
- `arg1` - Description (defaults to X)

**Examples:**
{Show 2-3 common usage patterns}

## Output

{Show example output users will see}

## Present Results to User

{Template for how Claude should format results when presenting to users}

## Troubleshooting

{Common issues and solutions, especially network/permissions errors}
```

**Emplacement dans le code** : `AGENTS.md:29-69`

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour :2026-01-25

| Fonctionnalité | Chemin de fichier | Ligne |
|--- | --- | ---|
| Définition du type ImpactLevel | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L5) | 5 |
| Interface CodeExample | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L7-L13) | 7-13 |
| Interface Rule | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L15-L26) | 15-26 |
| Interface Section | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L28-L35) | 28-35 |
| Interface GuidelinesDocument | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L37-L44) | 37-44 |
| Interface TestCase | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L46-L53) | 46-53 |

**Constantes clés** :
- `ImpactLevel` énumération : `'CRITICAL' | 'HIGH' | 'MEDIUM-HIGH' | 'MEDIUM' | 'LOW-MEDIUM' | 'LOW'`

**Fonctions clés** :
- `incrementVersion(version: string)` : incrémenter le numéro de version (build.ts)
- `generateMarkdown(sections, metadata)` : générer AGENTS.md (build.ts)
- `validateRule(rule, file)` : valider l'intégrité des règles (validate.ts)

</details>
