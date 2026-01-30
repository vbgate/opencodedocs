---
title: "Chaîne d'outils de construction Agent Skills : validation, construction et intégration CI | Tutoriel Agent Skills"
sidebarTitle: "Valider les règles et construire automatiquement"
subtitle: "Utilisation de la chaîne d'outils de construction"
description: "Apprenez à utiliser la chaîne d'outils de construction Agent Skills, y compris pnpm validate pour vérifier l'intégrité des règles, pnpm build pour générer AGENTS.md et test-cases.json, pnpm dev pour le flux de développement, la configuration de l'intégration CI GitHub Actions, ainsi que l'extraction de cas de test et l'évaluation automatique LLM. Ce tutoriel vous apprend à gérer la base de règles, à automatiser le processus de validation, à intégrer l'intégration continue, à extraire des cas de test, à maintenir le système de construction et à garantir la qualité des règles."
tags:
  - "Outil de construction"
  - "CI/CD"
  - "Automatisation"
  - "Validation de code"
order: 80
prerequisite:
  - "start-getting-started"
  - "start-installation"
  - "advanced-rule-authoring"
---

# Utilisation de la chaîne d'outils de construction

## Ce que vous pourrez faire après ce cours

Après avoir terminé ce cours, vous pourrez :

- ✅ Utiliser `pnpm validate` pour vérifier le format et l'intégrité des fichiers de règles
- ✅ Utiliser `pnpm build` pour générer AGENTS.md et test-cases.json
- ✅ Comprendre le processus de construction : parse → validate → group → sort → generate
- ✅ Configurer GitHub Actions CI pour la validation et la construction automatiques
- ✅ Extraire des cas de test pour l'évaluation automatique LLM
- ✅ Utiliser `pnpm dev` pour un flux de développement rapide (build + validate)

## Votre problème actuel

Si vous maintenez ou étendez la base de règles React, vous avez peut-être rencontré ces problèmes :

- ✗ Après avoir modifié une règle, vous oubliez de vérifier le format, ce qui entraîne des erreurs dans AGENTS.md généré
- ✗ De plus en plus de fichiers de règles rendent la vérification manuelle de chaque fichier trop longue
- ✗ Après avoir soumis le code, vous découvrez qu'une règle manque d'exemples de code, ce qui affecte l'efficacité de la révision PR
- ✗ Vous souhaitez valider automatiquement les règles dans CI, mais vous ne savez pas comment configurer GitHub Actions
- ✗ Vous ne comprenez pas le processus de construction de `build.ts` et ne savez pas où chercher en cas d'erreur

## Quand utiliser cette technique

Lorsque vous avez besoin de :

- 🔍 **Valider les règles** : avant de soumettre du code, assurez-vous que tous les fichiers de règles respectent les spécifications
- 🏗️ **Générer de la documentation** : générer AGENTS.md structuré à partir de fichiers de règles Markdown
- 🤖 **Extraire des cas de test** : préparer des données de test pour l'évaluation automatique LLM
- 🔄 **Intégrer CI** : automatiser la validation et la construction dans GitHub Actions
- 🚀 **Développement rapide** : utiliser `pnpm dev` pour itérer et valider rapidement les règles

## 🎒 Préparatifs avant de commencer

Avant de commencer, veuillez confirmer :

::: warning Vérification des prérequis

- Avez terminé [Introduction à Agent Skills](../../start/getting-started/)
- Avez installé Agent Skills et êtes familiarisé avec son utilisation de base
- Comprenez les spécifications de rédaction de règles React (il est recommandé d'apprendre d'abord [Rédiger des règles de meilleures pratiques React](../rule-authoring/))
- Avez une expérience de base des opérations en ligne de commande
- Comprenez l'utilisation de base du gestionnaire de packages pnpm

:::

## Idée centrale

**Rôle de la chaîne d'outils de construction** :

La base de règles d'Agent Skills est essentiellement 57 fichiers Markdown indépendants, mais Claude a besoin d'un AGENTS.md structuré pour l'utiliser efficacement. La chaîne d'outils de construction est responsable de :

1. **Analyser les fichiers de règles** : extraire les champs title, impact, examples, etc. à partir de Markdown
2. **Vérifier l'intégrité** : vérifier que chaque règle a un titre, une explication et des exemples de code
3. **Grouper et trier** : regrouper par chapitre, trier par ordre alphabétique des titres, attribuer des ID (1.1, 1.2...)
4. **Générer de la documentation** : sortir AGENTS.md et test-cases.json formatés

**Processus de construction** :

```
rules/*.md (57 fichiers)
    ↓
[parser.ts] Analyser Markdown
    ↓
[validate.ts] Vérifier l'intégrité
    ↓
[build.ts] Grouper → Trier → Générer AGENTS.md
    ↓
[extract-tests.ts] Extraire les cas de test → test-cases.json
```

**Quatre commandes principales** :

| Commande                 | Fonction                              | Scénario d'utilisation             |
|--- | --- | ---|
| `pnpm validate`      | Vérifier le format et l'intégrité de tous les fichiers de règles    | Vérification avant soumission, validation CI  |
| `pnpm build`         | Générer AGENTS.md et test-cases.json | Après modification des règles, avant publication   |
| `pnpm dev`           | Exécuter build + validate (flux de développement) | Itération rapide, développement de nouvelles règles |
| `pnpm extract-tests` | Extraire uniquement les cas de test (sans reconstruire)    | Lors de la mise à jour uniquement des données de test     |

---

## Suivez-moi : utiliser la chaîne d'outils de construction

### Étape 1 : Valider les règles (pnpm validate)

**Pourquoi**
Lors du développement ou de la modification de règles, assurez-vous d'abord que tous les fichiers de règles respectent les spécifications pour éviter de découvrir des erreurs lors de la construction.

Accédez au répertoire des outils de construction :

```bash
cd packages/react-best-practices-build
```

Exécutez la commande de validation :

```bash
pnpm validate
```

**Ce que vous devriez voir** :

```bash
Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**S'il y a des erreurs** :

```bash
✗ Validation failed:

  async-parallel.md: Missing or empty title
  bundle-dynamic-imports.md: Missing code examples
  rerender-memo.md: Invalid impact level: SUPER_HIGH
```

**Contenu vérifié** (code source : `validate.ts`) :

- ✅ title non vide
- ✅ explanation non vide
- ✅ au moins un exemple de code inclus
- ✅ au moins un exemple "Incorrect/bad" ou "Correct/good" inclus
- ✅ niveau d'impact valide (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

### Étape 2 : Construire la documentation (pnpm build)

**Pourquoi**
Générer AGENTS.md et test-cases.json utilisés par Claude à partir des fichiers de règles.

Exécutez la commande de construction :

```bash
pnpm build
```

**Ce que vous devriez voir** :

```bash
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules
```

**Fichiers générés** :

1. **AGENTS.md** (situé dans `skills/react-best-practices/AGENTS.md`)
   - Guide d'optimisation des performances React structuré
   - Contient 8 chapitres, 57 règles
   - Trié par niveau d'impact (CRITICAL → HIGH → MEDIUM...)

2. **test-cases.json** (situé dans `packages/react-best-practices-build/test-cases.json`)
   - Cas de test extraits de toutes les règles
   - Contient des exemples bad et good
   - Utilisé pour l'évaluation automatique LLM

**Exemple de structure AGENTS.md** :

```markdown
# React Best Practices

Version 1.0
Vercel Engineering
January 2026

---

## Abstract

Performance optimization guide for React and Next.js applications, ordered by impact.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
   - 1.1 [Parallel async operations](#11-parallel-async-operations)
   - 1.2 [Deferring non-critical async operations](#12-deferring-non-critical-async-outputs)

2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
   - 2.1 [Dynamic imports for large components](#21-dynamic-imports-for-large-components)

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Eliminating request waterfalls is the most impactful performance optimization you can make in React and Next.js applications.

### 1.1 Parallel async operations

**Impact: CRITICAL**

...

**Incorrect:**

```typescript
// Sequential fetching creates waterfalls
const userData = await fetch('/api/user').then(r => r.json())
const postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())
```

**Correct:**

```typescript
// Fetch in parallel
const [userData, postsData] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/posts').then(r => r.json())
])
```
```

**Exemple de structure test-cases.json** :

```json
[
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "bad",
    "code": "// Sequential fetching creates waterfalls\nconst userData = await fetch('/api/user').then(r => r.json())\nconst postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())",
    "language": "typescript",
    "description": "Incorrect example for Parallel async operations"
  },
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "good",
    "code": "// Fetch in parallel\nconst [userData, postsData] = await Promise.all([\n  fetch('/api/user').then(r => r.json()),\n  fetch('/posts').then(r => r.json())\n])",
    "language": "typescript",
    "description": "Correct example for Parallel async operations"
  }
]
```

### Étape 3 : Flux de développement (pnpm dev)

**Pourquoi**
Lors du développement de nouvelles règles ou de la modification de règles existantes, vous devez itérer, valider et construire rapidement l'ensemble du processus.

Exécutez la commande de développement :

```bash
pnpm dev
```

**Cette commande va** :

1. Exécuter `pnpm build-agents` (générer AGENTS.md)
2. Exécuter `pnpm extract-tests` (générer test-cases.json)
3. Exécuter `pnpm validate` (valider toutes les règles)

**Ce que vous devriez voir** :

```bash
pnpm build-agents && pnpm extract-tests
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules

Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57

Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**Suggestions pour le flux de développement** :

```bash
# 1. Modifier ou créer un fichier de règles
vim skills/react-best-practices/rules/my-new-rule.md

# 2. Exécuter pnpm dev pour valider et construire rapidement
cd packages/react-best-practices-build
pnpm dev

# 3. Vérifier le AGENTS.md généré
cat ../skills/react-best-practices/AGENTS.md

# 4. Tester si Claude utilise correctement la nouvelle règle
# (activer la compétence dans Claude Code et tester)
```

**Mettre à jour le numéro de version** (optionnel) :

```bash
pnpm build --upgrade-version
```

Cela va automatiquement :
- Incrémenter le numéro de version dans `metadata.json` (ex: 1.0 → 1.1)
- Mettre à jour le champ version dans Front Matter de `SKILL.md`

**Ce que vous devriez voir** :

```bash
Upgrading version: 1.0 -> 1.1
✓ Updated metadata.json
✓ Updated SKILL.md
```

### Étape 4 : Extraire uniquement les cas de test (pnpm extract-tests)

**Pourquoi**
Si vous avez uniquement mis à jour la logique d'extraction des données de test et n'avez pas besoin de reconstruire AGENTS.md, vous pouvez exécuter `extract-tests` séparément.

```bash
pnpm extract-tests
```

**Ce que vous devriez voir** :

```bash
Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57
```

---

## Point de contrôle ✅

Maintenant vérifiez si vous comprenez la chaîne d'outils de construction :

- [ ] Saissez quels champs `pnpm validate` vérifie pour les règles
- [ ] Saissez quels fichiers `pnpm build` génère
- [ ] Saissez le flux de développement de `pnpm dev`
- [ ] Saissez l'utilisation de test-cases.json
- [ ] Saissez comment mettre à jour le numéro de version (`--upgrade-version`)
- [ ] Saissez la structure de AGENTS.md (chapitre → règle → exemple)

---

## Intégration CI GitHub Actions

### Pourquoi CI est nécessaire

Dans la collaboration d'équipe, CI peut :
- ✅ Valider automatiquement le format des fichiers de règles
- ✅ Construire automatiquement AGENTS.md
- ✅ Empêcher la soumission de code non conforme aux spécifications

### Fichier de configuration CI

La configuration GitHub Actions est située dans `.github/workflows/react-best-practices-ci.yml` :

```yaml
name: React Best Practices CI

on:
  push:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'
  pull_request:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/react-best-practices-build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10.24.0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          cache-dependency-path: packages/react-best-practices-build/pnpm-lock.yaml
      - run: pnpm install
      - run: pnpm validate
      - run: pnpm build
```

### Conditions de déclenchement CI

CI s'exécute automatiquement dans les cas suivants :

| Événement           | Condition                                                                                                      |
|--- | ---|
| `push`         | Soumission à la branche `main`, et modification de `skills/react-best-practices/**` ou `packages/react-best-practices-build/**` |
| `pull_request` | Création ou mise à jour de PR vers la branche `main`, et modification des chemins ci-dessus                                                            |

### Étapes d'exécution CI

1. **Extraire le code** : `actions/checkout@v4`
2. **Installer pnpm** : `pnpm/action-setup@v2` (version 10.24.0)
3. **Installer Node.js** : `actions/setup-node@v4` (version 20)
4. **Installer les dépendances** : `pnpm install` (utiliser le cache pnpm pour accélérer)
5. **Valider les règles** : `pnpm validate`
6. **Construire la documentation** : `pnpm build`

Si une étape échoue, CI marquera ❌ et empêchera la fusion.

---

## Avertissements sur les pièges

### Piège 1 : Validation réussie mais échec de la construction

**Symptôme** : `pnpm validate` réussit, mais `pnpm build` signale une erreur.

**Cause** : La vérification ne vérifie que le format des fichiers de règles, pas `_sections.md` ou `metadata.json`.

**Solution** :
```bash
# Vérifier si _sections.md existe
ls skills/react-best-practices/rules/_sections.md

# Vérifier si metadata.json existe
ls skills/react-best-practices/metadata.json

# Voir l'erreur spécifique dans les journaux de construction
pnpm build 2>&1 | grep -i error
```

### Piège 2 : ID de règles non consécutifs

**Symptôme** : Les ID de règles dans AGENTS.md généré sont discontinus (ex: 1.1, 1.3, 1.5).

**Cause** : Les règles sont triées par ordre alphabétique des titres, pas par nom de fichier.

**Solution** :
```bash
# La construction trie automatiquement par titre et attribue des ID
# Si vous avez besoin d'un ordre personnalisé, modifiez le titre de la règle
# Par exemple : changez en "A. Parallel" (A au début sera en premier)
pnpm build
```

### Piège 3 : test-cases.json n'a que des exemples bad

**Symptôme** : `pnpm extract-tests` affiche "Bad examples: 0".

**Cause** : Les étiquettes d'exemple dans le fichier de règles ne respectent pas les spécifications.

**Solution** :
```markdown
# ❌ Erreur : étiquette non conforme
**Example:**

**Typo:**

# ✅ Correct : utiliser Incorrect ou Correct
**Incorrect:**

**Correct:**

# Ou utiliser les étiquettes bad/good (prend également en charge wrong, usage, etc.)
**Bad example:**

**Good example:**
```

### Piège 4 : pnpm validate échoue dans CI

**Symptôme** : `pnpm validate` local réussit, mais CI échoue.

**Cause** :
- Version Node.js incompatible (CI utilise v20, local peut utiliser une autre version)
- Version pnpm incompatible (CI utilise 10.24.0)
- Différence de fins de ligne Windows et Linux

**Solution** :
```bash
# Vérifier la version Node locale
node --version  # devrait être v20.x

# Vérifier la version pnpm locale
pnpm --version  # devrait être >= 10.24.0

# Unifier les fins de ligne (convertir en LF)
git config core.autocrlf input
git add --renormalize .
git commit -m "Fix line endings"
```

### Piège 5 : SKILL.md non mis à jour après mise à jour de version

**Symptôme** : Après `pnpm build --upgrade-version`, le numéro de version dans `metadata.json` a changé, mais `SKILL.md` n'a pas changé.

**Cause** : Le format du version dans Front Matter de SKILL.md ne correspond pas.

**Solution** :
```yaml
# Vérifier le Front Matter de SKILL.md
---
version: "1.0"  # ✅ Doit avoir des guillemets doubles
---

# Si le numéro de version n'a pas de guillemets, ajoutez-les manuellement
---
version: 1.0   # ❌ Erreur
version: "1.0" # ✅ Correct (ajouter des guillemets doubles)
---
```

---

## Résumé de ce cours

**Points clés** :

1. **Validation (validate)** : vérifier le format des règles, l'intégrité, le niveau d'impact
2. **Construction (build)** : analyser les règles → grouper → trier → générer AGENTS.md
3. **Extraction de tests (extract-tests)** : extraire les exemples bad/good à partir des examples
4. **Flux de développement (dev)** : `validate + build + extract-tests` pour itérer rapidement
5. **Intégration CI** : GitHub Actions valide et construit automatiquement, empêchant la soumission de code erroné

**Flux de travail de développement** :

```
Modifier/créer des règles
    ↓
pnpm dev (valider + construire + extraire les tests)
    ↓
Vérifier AGENTS.md et test-cases.json
    ↓
Soumettre le code → CI s'exécute automatiquement
    ↓
Révision PR → Fusionner dans main
```

**Formule des meilleures pratiques** :

> Valider avant de modifier, construire avant de soumettre
> La commande dev couvre tout le processus, une seule étape pour une haute efficacité
> CI contrôle automatiquement, la révision PR est plus facile
> Le numéro de version doit être mis à jour, n'oubliez pas de modifier metadata

---

## Aperçu du cours suivant

> Dans le cours suivant, nous apprendrons **[Résolution des problèmes courants](../../faq/troubleshooting/)**.
>
> Vous apprendrez :
> - Résoudre les erreurs de réseau de déploiement (Network Egress Error)
> - Gérer les problèmes de compétences non activées
> - Résoudre les échecs de validation de règles (VALIDATION_ERROR)
> - Corriger les problèmes de détection de framework inexacte
> - Résoudre les problèmes d'autorisations de fichiers

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonction                  | Chemin de fichier                                                                                                                                                                     | Ligne    |
|--- | --- | ---|
| Définition des scripts package.json | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json)                 | 6-12    |
| Fonction d'entrée de construction          | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)                 | 131-290 |
| Analyseur de règles            | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts)               | Tout    |
| Fonction de validation des règles          | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)           | 21-66   |
| Extraction des cas de test          | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts) | 15-38   |
| Configuration des chemins              | [`packages/react-best-practices-build/src/config.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/config.ts)               | Tout    |
| GitHub Actions CI     | [`.github/workflows/react-best-practices-ci.yml`](https://github.com/vercel-labs/agent-skills/blob/main/.github/workflows/react-best-practices-ci.yml)                       | Tout    |
| Modèle de fichier de règles          | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md)                     | Tout    |

**Constantes clés** (`config.ts`) :
- `RULES_DIR`: chemin du répertoire des fichiers de règles
- `METADATA_FILE`: chemin du fichier de métadonnées (metadata.json)
- `OUTPUT_FILE`: chemin de sortie AGENTS.md
- `TEST_CASES_FILE`: chemin de sortie JSON des cas de test

**Fonctions clés** :
- `build()`: fonction de construction principale, analyser les règles → grouper → trier → générer la documentation
- `validateRule()`: valider l'intégrité d'une seule règle (title, explanation, examples, impact)
- `extractTestCases()`: extraire les cas de test bad/good à partir des examples des règles
- `generateMarkdown()`: générer le contenu AGENTS.md à partir du tableau Section

**Règles de validation** (`validate.ts:21-66`) :
- title non vide
- explanation non vide
- au moins un exemple de code
- au moins un exemple "Incorrect/bad" ou "Correct/good"
- niveau d'impact valide

**Flux de travail CI** :
- Conditions de déclenchement : push/PR vers main, et modification de `skills/react-best-practices/**` ou `packages/react-best-practices-build/**`
- Étapes d'exécution : checkout → installer pnpm → installer Node.js → pnpm install → pnpm validate → pnpm build

</details>
