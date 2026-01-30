---
title: "Bonnes Pratiques: Configuration de Projet et Collaboration en Équipe | OpenSkills"
sidebarTitle: "Configurer les compétences de l'équipe en 5 minutes"
subtitle: "Bonnes Pratiques: Configuration de Projet et Collaboration en Équipe"
description: "Apprenez les bonnes pratiques d'OpenSkills. Maîtrisez l'installation locale vs globale des projets, la configuration du mode Universal, les spécifications d'écriture SKILL.md et l'intégration CI/CD pour améliorer l'efficacité de collaboration en équipe."
tags:
  - "advanced"
  - "best-practices"
  - "skills"
  - "team"
prerequisite:
  - "start-quick-start"
  - "start-installation"
  - "start-first-skill"
order: 8
---

# Bonnes Pratiques

## Ce Que Vous Pourrez Faire Après Ce Cours

- Choisir la méthode d'installation appropriée pour les compétences selon les besoins du projet (projet local vs global vs Universal)
- Écrire des fichiers SKILL.md conformes aux spécifications (nommage, description, instructions)
- Utiliser des liens symboliques pour un développement local efficace
- Gérer les versions et mises à jour des compétences
- Collaborer en utilisant les compétences dans un environnement d'équipe
- Intégrer OpenSkills dans les workflows CI/CD

## Les Difficultés Que Vous Rencontrez Actuellement

Vous avez appris à installer et utiliser les compétences, mais vous rencontrez ces problèmes dans les projets réels :

- Les compétences doivent-elles être installées dans le répertoire du projet ou globalement ?
- Comment partager les compétences entre plusieurs agents IA ?
- Vous avez écrit les compétences plusieurs fois, mais l'IA n'arrive toujours pas à s'en souvenir
- Les membres de l'équipe installent les compétences individuellement, les versions sont incohérentes
- Après modification locale des compétences, la réinstallation à chaque fois est trop fastidieuse

Dans ce cours, nous résumons les meilleures pratiques d'OpenSkills pour vous aider à résoudre ces problèmes.

## Quand Utiliser Cette Méthode

- **Optimisation de la configuration du projet** : Choisir l'emplacement d'installation approprié pour les compétences selon le type de projet
- **Environnement multi-agents** : Utiliser simultanément des outils comme Claude Code, Cursor, Windsurf
- **Standardisation des compétences** : Uniformiser le format et les spécifications d'écriture des compétences en équipe
- **Développement local** : Itérer et tester les compétences rapidement
- **Collaboration en équipe** : Partager les compétences, contrôle de version, intégration CI/CD

## 🎒 Préparatifs Avant de Commencer

::: warning Vérification Préalable

Avant de commencer, assurez-vous :

- ✅ D'avoir terminé le [Démarrage Rapide](../../start/quick-start/)
- ✅ D'avoir installé au moins une compétence et synchronisé vers AGENTS.md
- ✅ De connaître le [format de base SKILL.md](../../start/what-is-openskills/)

:::

## Bonnes Pratiques de Configuration de Projet

### 1. Projet Local vs Global vs Installation Universal

Choisir l'emplacement d'installation approprié est la première étape de la configuration du projet.

#### Installation Projet Local (Par Défaut)

**Scénarios Applicables** : Compétences exclusives à un projet spécifique

```bash
# Installer dans .claude/skills/
npx openskills install anthropics/skills
```

**Avantages** :

- ✅ Les compétences sont versionnées avec le projet
- ✅ Différentes versions de compétences pour différents projets
- ✅ Pas besoin d'installation globale, réduction des dépendances

**Pratiques Recommandées** :

- Compétences dédiées au projet (comme les flux de construction spécifiques à un framework)
- Compétences métier développées en interne par l'équipe
- Compétences dépendant de la configuration du projet

#### Installation Globale

**Scénarios Applicables** : Compétences générales utilisées par tous les projets

```bash
# Installer dans ~/.claude/skills/
npx openskills install anthropics/skills --global
```

**Avantages** :

- ✅ Tous les projets partagent le même ensemble de compétences
- ✅ Pas besoin de réinstaller pour chaque projet
- ✅ Gestion centralisée des mises à jour

**Pratiques Recommandées** :

- Bibliothèque de compétences officielle Anthropic (anthropics/skills)
- Compétences utilitaires générales (comme le traitement PDF, les opérations Git)
- Compétences fréquemment utilisées personnellement

#### Mode Universal (Environnement Multi-Agents)

**Scénarios Applicables** : Utilisation simultanée de plusieurs agents IA

```bash
# Installer dans .agent/skills/
npx openskills install anthropics/skills --universal
```

**Ordre de Priorité** (Du plus élevé au plus bas) :

1. `./.agent/skills/` (Universal Projet Local)
2. `~/.agent/skills/` (Universal Global)
3. `./.claude/skills/` (Claude Code Projet Local)
4. `~/.claude/skills/` (Claude Code Global)

**Pratiques Recommandées** :

- ✅ À utiliser lors de l'utilisation de plusieurs agents (Claude Code + Cursor + Windsurf)
- ✅ Pour éviter les conflits avec Claude Code Marketplace
- ✅ Pour gérer uniformément les compétences de tous les agents

::: tip Quand Utiliser le Mode Universal ?

Si votre `AGENTS.md` est partagé entre Claude Code et d'autres agents, utilisez `--universal` pour éviter les conflits de compétences. Le mode Universal utilise le répertoire `.agent/skills/`, isolé de `.claude/skills/` de Claude Code.

:::

### 2. Privilégier npx Plutôt Que l'Installation Globale

OpenSkills est conçu pour être utilisé instantanément, il est recommandé d'utiliser toujours `npx` :

```bash
# ✅ Recommandé : Utiliser npx
npx openskills install anthropics/skills
npx openskills sync
npx openskills list

# ❌ À Éviter : Installation globale puis appel direct
openskills install anthropics/skills
```

**Avantages** :

- ✅ Pas besoin d'installation globale, évite les conflits de versions
- ✅ Utilise toujours la dernière version (npx met à jour automatiquement)
- ✅ Réduction des dépendances système

**Quand l'Installation Globale est Nécessaire** :

- En environnement CI/CD (pour les performances)
- Dans des scripts appelés fréquemment (réduction du temps de démarrage npx)

```bash
# Installation globale dans CI/CD ou scripts
npm install -g openskills
openskills install anthropics/skills -y
openskills sync -y
```

## Bonnes Pratiques de Gestion des Compétences

### 1. Spécifications d'Écriture SKILL.md

#### Spécifications de Nommage : Utiliser le Format Kebab-Case

**Règles** :

- ✅ Correct : `pdf-editor`, `api-client`, `git-workflow`
- ❌ Incorrect : `PDF Editor` (espaces), `pdf_editor` (underscores), `PdfEditor` (camelCase)

**Raison** : Le format kebab-case est un identifiant compatible URL, conforme aux spécifications de nommage GitHub et du système de fichiers.

#### Rédaction de Description : Troisième Personne, 1-2 Phrases

**Règles** :

- ✅ Correct : `Use this skill for comprehensive PDF manipulation.`
- ❌ Incorrect : `You should use this skill to manipulate PDFs.` (deuxième personne)

**Comparaison d'Exemples** :

| Scénario | ❌ Incorrect (Deuxième Personne) | ✅ Correct (Troisième Personne) |
|---|---|---|
| Compétence PDF | You can use this to extract text from PDFs. | Extract text from PDFs with this skill. |
| Compétence Git | When you need to manage branches, use this. | Manage Git branches with this skill. |
| Compétence API | If you want to call the API, load this skill. | Call external APIs with this skill. |

#### Rédaction d'Instructions : Forme Impérative/Infinitive

**Règles** :

- ✅ Correct : `"To accomplish X, execute Y"`
- ✅ Correct : `"Load this skill when Z"`
- ❌ Incorrect : `"You should do X"`
- ❌ Incorrect : `"If you need Y"`

**Mnémonique d'Écriture** :

1. **Verbe en Tête** : "Create" → "Use" → "Return"
2. **Omettre "You"** : Ne pas dire "You should"
3. **Chemins Explicites** : Référencer les ressources avec le préfixe `references/`

**Comparaison d'Exemples** :

| ❌ Écriture Incorrecte | ✅ Écriture Correcte |
|---|---|
| "You should create a file" | "Create a file" |
| "When you want to load this skill" | "Load this skill when" |
| "If you need to see the docs" | "See references/guide.md" |

::: tip Pourquoi Utiliser l'Impératif/l'Infinitif ?

Ce style d'écriture permet aux agents IA d'analyser et exécuter les instructions plus facilement. Les formes impératives et infinitives éliminent le sujet "vous", rendant les instructions plus directes et explicites.

:::

### 2. Contrôle de Taille des Fichiers

**Taille des Fichiers SKILL.md** :

- ✅ **Recommandé** : Moins de 5000 mots
- ⚠️ **Avertissement** : Plus de 8000 mots peuvent causer un dépassement de contexte
- ❌ **Interdit** : Plus de 10000 mots

**Méthodes de Contrôle** :

Déplacer la documentation détaillée dans le répertoire `references/` :

```markdown
# SKILL.md (Instructions Principales)

## Instructions

To process data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format  # Documentation Détaillée
3. Process the result

## Bundled Resources

For detailed API documentation, see:
- `references/api-docs.md`  # Non chargé dans le contexte, économise les tokens
- `references/examples.md`
```

**Comparaison des Tailles de Fichiers** :

| Fichier | Limite de Taille | Chargé dans le Contexte |
|---|---|---|
| `SKILL.md` | < 5000 mots | ✅ Oui |
| `references/` | Sans limite | ❌ Non (Chargement à la demande) |
| `scripts/` | Sans limite | ❌ Non (Exécutable) |
| `assets/` | Sans limite | ❌ Non (Fichiers modèles) |

### 3. Priorité de Recherche des Compétences

OpenSkills recherche les compétences selon la priorité suivante (du plus élevé au plus bas) :

```
1. ./.agent/skills/        # Universal Projet Local
2. ~/.agent/skills/        # Universal Global
3. ./.claude/skills/      # Claude Code Projet Local
4. ~/.claude/skills/      # Claude Code Global
```

**Mécanisme de Déduplication** :

- Seul le premier skill trouvé avec le même nom est retourné
- Les compétences locales au projet ont priorité sur les globales

**Exemple de Scénario** :

```
Projet A :
- .claude/skills/pdf        # Version locale du projet v1.0
- ~/.claude/skills/pdf     # Version globale v2.0

# openskills read pdf chargera .claude/skills/pdf (v1.0)
```

**Recommandations** :

- Placer les compétences avec des besoins spécifiques au projet en local
- Placer les compétences générales en global
- Utiliser le mode Universal pour les environnements multi-agents

## Bonnes Pratiques de Développement Local

### 1. Utiliser des Liens Symboliques pour le Développement Itératif

**Problème** : Chaque modification du skill nécessite une réinstallation, ce qui réduit l'efficacité du développement.

**Solution** : Utiliser des liens symboliques (symlink)

```bash
# 1. Cloner le dépôt de skills dans le répertoire de développement
git clone git@github.com:your-org/my-skills.git ~/dev/my-skills

# 2. Créer le répertoire de skills
mkdir -p .claude/skills

# 3. Créer le lien symbolique
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill

# 4. Synchroniser vers AGENTS.md
npx openskills sync
```

**Avantages** :

- ✅ Les modifications des fichiers source prennent effet immédiatement (pas besoin de réinstaller)
- ✅ Supporte les mises à jour basées sur Git (pull suffit)
- ✅ Partage de la même version de développement du skill entre plusieurs projets

**Vérifier le Lien Symbolique** :

```bash
# Voir les liens symboliques
ls -la .claude/skills/

# Exemple de sortie :
# my-skill -> /Users/yourname/dev/my-skills/my-skill
```

**Points d'Attention** :

- ✅ Les liens symboliques sont reconnus par `openskills list`
- ✅ Les liens symboliques brisés sont automatiquement ignorés (pas de crash)
- ⚠️ Les utilisateurs Windows doivent utiliser Git Bash ou WSL (Windows natif ne supporte pas les liens symboliques)

### 2. Partager les Compétences Entre Plusieurs Projets

**Scénario** : Plusieurs projets ont besoin d'utiliser le même ensemble de compétences d'équipe.

**Méthode 1 : Installation Globale**

```bash
# Installer le dépôt de compétences d'équipe globalement
npx openskills install your-org/team-skills --global
```

**Méthode 2 : Lien Symbolique Vers le Répertoire de Développement**

```bash
# Créer un lien symbolique dans chaque projet
ln -s ~/dev/team-skills/my-skill .claude/skills/my-skill
```

**Méthode 3 : Git Submodule**

```bash
# Ajouter le dépôt de compétences comme sous-module
git submodule add git@github.com:your-org/team-skills.git .claude/skills

# Mettre à jour le sous-module
git submodule update --init --recursive
```

**Recommandations** :

| Méthode | Scénario Applicable | Avantages | Inconvénients |
|---|---|---|---|
| Installation Globale | Tous les projets partagent des compétences unifiées | Gestion centralisée, mises à jour faciles | Pas de personnalisation par projet |
| Lien Symbolique | Développement et test locaux | Modifications prennent effet immédiatement | Nécessite de créer manuellement les liens |
| Git Submodule | Collaboration en équipe, contrôle de version | Contrôle de version avec le projet | Gestion complexe des sous-modules |

## Bonnes Pratiques de Collaboration en Équipe

### 1. Contrôle de Version des Compétences

**Bonnes Pratiques** : Contrôler en version le dépôt de compétences indépendamment

```bash
# Structure du dépôt de compétences d'équipe
team-skills/
├── .git/
├── pdf-editor/
│   └── SKILL.md
├── api-client/
│   └── SKILL.md
└── git-workflow/
    └── SKILL.md
```

**Méthode d'Installation** :

```bash
# Installer les compétences depuis le dépôt d'équipe
npx openskills install git@github.com:your-org/team-skills.git
```

**Processus de Mise à Jour** :

```bash
# Mettre à jour toutes les compétences
npx openskills update

# Mettre à jour des compétences spécifiques
npx openskills update pdf-editor,api-client
```

**Recommandations de Gestion de Version** :

- Utiliser Git Tag pour marquer les versions stables : `v1.0.0`, `v1.1.0`
- Enregistrer la version des compétences dans AGENTS.md : `<skill name="pdf-editor" version="1.0.0">`
- Utiliser des versions stables fixes dans CI/CD

### 2. Spécifications de Nommage des Compétences

**Spécifications de Nommage Unifiées de l'Équipe** :

| Type de Compétence | Modèle de Nommage | Exemple |
|---|---|---|
| Outils Généraux | `<tool-name>` | `pdf`, `git`, `docker` |
| Liés à un Framework | `<framework>-<purpose>` | `react-component`, `django-model` |
| Workflows | `<workflow>` | `ci-cd`, `code-review` |
| Exclusifs à l'Équipe | `<team>-<purpose>` | `team-api`, `company-deploy` |

**Exemples** :

```bash
# ✅ Nommage Unifié
team-skills/
├── pdf/                     # Traitement PDF
├── git-workflow/           # Workflow Git
├── react-component/        # Génération de composants React
└── team-api/             # Client API d'équipe
```

### 3. Spécifications de Documentation des Compétences

**Structure de Documentation Unifiée de l'Équipe** :

```markdown
---
name: <skill-name>
description: <1-2 phrases, troisième personne>
author: <équipe/auteur>
version: <numéro de version>
---

# <Titre de la Compétence>

## When to Use

Load this skill when:
- Scénario 1
- Scénario 2

## Instructions

To accomplish task:

1. Étape 1
2. Étape 2

## Bundled Resources

For detailed information:
- `references/api-docs.md`
- `scripts/helper.py`
```

**Liste de Vérification Obligatoire** :

- [ ] `name` utilise le format kebab-case
- [ ] `description` fait 1-2 phrases, troisième personne
- [ ] Les instructions utilisent la forme impérative/infinitive
- [ ] Inclut les champs `author` et `version` (spécifications d'équipe)
- [ ] Instructions détaillées `When to Use`

## Bonnes Pratiques d'Intégration CI/CD

### 1. Installation et Synchronisation Non-Interactive

**Scénario** : Gestion automatisée des compétences dans un environnement CI/CD

**Utiliser le Drapeau `-y` pour Ignorer les Invites Interactives** :

```bash
# Exemple de Script CI/CD
#!/bin/bash

# Installer les compétences (non-interactif)
npx openskills install anthropics/skills -y
npx openskills install git@github.com:your-org/team-skills.git -y

# Synchroniser vers AGENTS.md (non-interactif)
npx openskills sync -y
```

**Exemple GitHub Actions** :

```yaml
name: Setup Skills

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install OpenSkills
        run: npx openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Verify Skills
        run: npx openskills list
```

### 2. Automatisation des Mises à Jour de Compétences

**Mises à Jour de Compétences Planifiées** :

```yaml
# .github/workflows/update-skills.yml
name: Update Skills

on:
  schedule:
    - cron: '0 0 * * 0'  # Mise à jour hebdomadaire le dimanche
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update Skills
        run: npx openskills update -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add AGENTS.md
          git diff --staged --quiet || git commit -m "Update skills"
          git push
```

### 3. Chemins de Sortie Personnalisés

**Scénario** : Synchroniser les compétences vers un fichier personnalisé (comme `.ruler/AGENTS.md`)

```bash
# Synchroniser vers un fichier personnalisé
npx openskills sync -o .ruler/AGENTS.md -y
```

**Exemple CI/CD** :

```yaml
# Générer différents AGENTS.md pour différents agents IA
- name: Sync for Claude Code
  run: npx openskills sync -o AGENTS.md -y

- name: Sync for Cursor
  run: npx openskills sync -o .cursor/AGENTS.md -y

- name: Sync for Windsurf
  run: npx openskills sync -o .windsurf/AGENTS.md -y
```

## Problèmes Courants et Solutions

### Problème 1 : Compétence Introuvable

**Symptômes** :

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Étapes de Dépannage** :

1. Vérifier si la compétence est installée :
   ```bash
   npx openskills list
   ```

2. Vérifier si le nom de la compétence est correct (sensible à la casse) :
   ```bash
   # ❌ Incorrect
   npx openskills read My-Skill

   # ✅ Correct
   npx openskills read my-skill
   ```

3. Vérifier si la compétence est écrasée dans un répertoire de priorité plus élevée :
   ```bash
   # Voir l'emplacement de la compétence
   ls -la .claude/skills/my-skill
   ls -la ~/.claude/skills/my-skill
   ```

### Problème 2 : Lien Symbolique Inaccessible

**Symptômes** :

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Solutions** :

- **macOS** : Autoriser les liens symboliques dans les Préférences Système
- **Windows** : Utiliser Git Bash ou WSL (Windows natif ne supporte pas les liens symboliques)
- **Linux** : Vérifier les permissions du système de fichiers

### Problème 3 : Compétence Non Effective Après Mise à Jour

**Symptômes** :

```bash
npx openskills update
# ✅ Skills updated successfully

npx openskills read my-skill
# Le contenu est toujours l'ancienne version
```

**Cause** : L'agent IA a mis en cache l'ancien contenu de la compétence.

**Solutions** :

1. Resynchroniser AGENTS.md :
   ```bash
   npx openskills sync
   ```

2. Vérifier l'horodatage du fichier de compétence :
   ```bash
   ls -la .claude/skills/my-skill/SKILL.md
   ```

3. Si vous utilisez des liens symboliques, rechargez la compétence :
   ```bash
   npx openskills read my-skill
   ```

## Résumé de Ce Cours

Points Clés des Bonnes Pratiques OpenSkills :

### Configuration du Projet

- ✅ Installation Projet Local : Compétences exclusives à un projet spécifique
- ✅ Installation Globale : Compétences générales utilisées par tous les projets
- ✅ Mode Universal : Partager les compétences dans un environnement multi-agents
- ✅ Privilégier l'utilisation de `npx` plutôt que l'installation globale

### Gestion des Compétences

- ✅ Spécifications d'Écriture SKILL.md : Nommage kebab-case, description troisième personne, instructions impératives
- ✅ Contrôle de Taille des Fichiers : SKILL.md < 5000 mots, documentation détaillée dans `references/`
- ✅ Priorité de Recherche des Compétences : Comprendre la priorité des 4 répertoires et le mécanisme de déduplication

### Développement Local

- ✅ Utiliser des liens symboliques pour le développement itératif
- ✅ Partager les compétences entre plusieurs projets : Installation globale, liens symboliques, Git Submodule

### Collaboration en Équipe

- ✅ Contrôle de Version des Compétences : Dépôt indépendant, Git Tag
- ✅ Spécifications de Nommage Unifiées : Outils, Frameworks, Workflows
- ✅ Spécifications de Documentation Unifiées : author, version, When to Use

### Intégration CI/CD

- ✅ Installation et Synchronisation Non-Interactive : Drapeau `-y`
- ✅ Automatisation des Mises à Jour : Tâches planifiées, workflow_dispatch
- ✅ Chemins de Sortie Personnalisés : Drapeau `-o`

## Aperçu du Prochain Cours

> Dans le prochain cours, nous apprendrons la **[Foire Aux Questions](../faq/faq/)**.
>
> Vous apprendrez :
> - Réponses rapides aux questions fréquentes sur OpenSkills
> - Méthodes de dépannage pour les échecs d'installation, les compétences non chargées, etc.
> - Techniques de configuration pour coexister avec Claude Code

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquer pour Voir l'Emplacement du Code Source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du Fichier | Lignes |
|---|---|---|
| Priorité de Recherche des Compétences | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| Mécanisme de Déduplication des Compétences | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 42-43, 57 |
| Traitement des Liens Symboliques | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 10-25 |
| Extraction des Champs YAML | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Protection contre la Traversée de Chemins | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 71-78 |
| Installation Non-Interactive | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 424 |
| Chemin de Sortie Personnalisé | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 19-36 |

**Constantes Clés** :
- 4 répertoires de recherche de compétences : `./.agent/skills/`, `~/.agent/skills/`, `./.claude/skills/`, `~/.claude/skills/`

**Fonctions Clés** :
- `getSearchDirs(): string[]` - Retourne les répertoires de recherche de compétences triés par priorité
- `isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean` - Vérifie si c'est un répertoire ou un lien symbolique pointant vers un répertoire
- `extractYamlField(content: string, field: string): string` - Extrait la valeur d'un champ YAML (correspondance non-gourmande)
- `isPathInside(path: string, targetDir: string): boolean` - Vérifie si le chemin est dans le répertoire cible (prévention de la traversée de chemins)

**Exemples de Fichiers de Compétences** :
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Exemple de structure minimale
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Référence de spécification de format

</details>
