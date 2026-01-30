---
title: "Exemples de configuration : Niveau projet et utilisateur | Everything Claude Code"
sidebarTitle: "Configuration rapide du projet"
subtitle: "Exemples de configuration : Niveau projet et utilisateur"
description: "Apprenez à utiliser les fichiers de configuration Everything Claude Code. Maîtrisez la configuration du CLAUDE.md au niveau projet et utilisateur, la hiérarchie des configurations, les champs clés et la personnalisation de la barre d'état. Adaptez les configurations selon les projets frontend, backend et full-stack."
tags:
  - "examples"
  - "CLAUDE.md"
  - "statusline"
  - "configuration"
prerequisite:
  - "start-quickstart"
order: 240
---

# Exemples de configuration : Niveau projet et utilisateur

## Ce que vous apprendrez

- Configurer rapidement le fichier CLAUDE.md pour un projet
- Configurer les paramètres globaux au niveau utilisateur pour améliorer l'efficacité de développement
- Personnaliser la barre d'état pour afficher des informations clés
- Adapter les modèles de configuration selon les besoins du projet

## Vos défis actuels

Face aux fichiers de configuration Everything Claude Code, vous pourriez :

- **Ne pas savoir par où commencer** : Quelle est la différence entre les configurations niveau projet et utilisateur ? Où les placer ?
- **Trouver les fichiers de configuration trop longs** : Que faut-il écrire dans CLAUDE.md ? Quels éléments sont obligatoires ?
- **Trouver la barre d'état insuffisante** : Comment personnaliser la barre d'état pour afficher plus d'informations utiles ?
- **Ne pas savoir comment personnaliser** : Comment adapter les exemples de configuration selon les besoins du projet ?

Ce document fournit des exemples de configuration complets pour vous aider à démarrer rapidement avec Everything Claude Code.

---

## Vue d'ensemble de la hiérarchie des configurations

Everything Claude Code prend en charge deux niveaux de configuration :

| Type de configuration | Emplacement | Portée | Utilisation typique |
| --- | --- | --- | --- |
| **Configuration niveau projet** | `CLAUDE.md` à la racine du projet | Uniquement le projet actuel | Règles spécifiques au projet, stack technique, structure des fichiers |
| **Configuration niveau utilisateur** | `~/.claude/CLAUDE.md` | Tous les projets | Préférences de codage personnelles, règles générales, paramètres de l'éditeur |

::: tip Priorité des configurations

Lorsque les configurations niveau projet et utilisateur coexistent :
- **Superposition des règles** : Les deux ensembles de règles sont appliqués
- **Gestion des conflits** : La configuration niveau projet a priorité sur celle niveau utilisateur
- **Pratique recommandée** : Placez les règles générales dans la configuration utilisateur et les règles spécifiques au projet dans la configuration projet
:::

---

## 1. Exemple de configuration niveau projet

### 1.1 Emplacement du fichier de configuration

Enregistrez le contenu suivant dans le fichier `CLAUDE.md` à la racine du projet :

```markdown
# Nom du projet CLAUDE.md

## Project Overview

[Description brève du projet : ce qu'il fait, la stack technique utilisée]

## Critical Rules

### 1. Code Organization

- Privilégier de nombreux petits fichiers plutôt que quelques gros fichiers
- Haute cohésion, faible couplage
- 200-400 lignes typiques, 800 maximum par fichier
- Organiser par fonctionnalité/domaine, pas par type

### 2. Code Style

- Pas d'emojis dans le code, les commentaires ou la documentation
- Immuabilité toujours - ne jamais muter des objets ou des tableaux
- Pas de console.log dans le code de production
- Gestion appropriée des erreurs avec try/catch
- Validation des entrées avec Zod ou similaire

### 3. Testing

- TDD : Écrire les tests d'abord
- Couverture minimale de 80%
- Tests unitaires pour les utilitaires
- Tests d'intégration pour les API
- Tests E2E pour les flux critiques

### 4. Security

- Pas de secrets codés en dur
- Variables d'environnement pour les données sensibles
- Valider toutes les entrées utilisateur
- Requêtes paramétrées uniquement
- Protection CSRF activée

## File Structure

```
src/
├── components/
├── utils/
├── hooks/
├── types/
└── api/
```

## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}
```

## Environment Variables

```bash
# Requis
DATABASE_URL=
API_KEY=

# Optionnel
DEBUG=false
```

## Available Commands

- `/tdd` - Flux de développement piloté par les tests
- `/plan` - Créer un plan de mise en œuvre
- `/code-review` - Réviser la qualité du code
- `/build-fix` - Corriger les erreurs de build

## Git Workflow

- Commits conventionnels : `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Ne jamais commit directement sur main
- Les PRs nécessitent une revue
- Tous les tests doivent passer avant la fusion
```

### 1.2 Explication des champs clés

#### Project Overview

Décrivez brièvement le projet pour aider Claude Code à comprendre le contexte :

```markdown
## Project Overview

Election Markets Platform - Une plateforme de marché prédictif pour les événements politiques utilisant Next.js, Supabase et les embeddings OpenAI pour la recherche sémantique.
```

#### Critical Rules

C'est la partie la plus importante, définissant les règles que le projet doit respecter :

| Catégorie de règle | Description | Obligatoire |
| --- | --- | --- |
| Code Organization | Principes d'organisation des fichiers | Oui |
| Code Style | Style de codage | Oui |
| Testing | Exigences de test | Oui |
| Security | Normes de sécurité | Oui |

#### Key Patterns

Définissez les modèles couramment utilisés dans le projet, Claude Code les appliquera automatiquement :

```markdown
## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling Pattern

[Exemple de code]
```

---

## 2. Exemple de configuration niveau utilisateur

### 2.1 Emplacement du fichier de configuration

Enregistrez le contenu suivant dans `~/.claude/CLAUDE.md` :

```markdown
# Exemple de CLAUDE.md niveau utilisateur

Les configurations niveau utilisateur s'appliquent globalement à tous les projets. Utilisez-les pour :
- Préférences de codage personnelles
- Règles universelles que vous souhaitez toujours appliquer
- Liens vers vos règles modulaires

---

## Core Philosophy

You are Claude Code. J'utilise des agents et compétences spécialisés pour les tâches complexes.

**Key Principles:**
1. **Agent-First** : Déléguer à des agents spécialisés pour le travail complexe
2. **Parallel Execution** : Utiliser l'outil Task avec plusieurs agents lorsque possible
3. **Plan Before Execute** : Utiliser le Plan Mode pour les opérations complexes
4. **Test-Driven** : Écrire les tests avant l'implémentation
5. **Security-First** : Ne jamais compromettre la sécurité

---

## Modular Rules

Les directives détaillées sont dans `~/.claude/rules/` :

| Fichier de règle | Contenu |
| --- | --- |
| security.md | Vérifications de sécurité, gestion des secrets |
| coding-style.md | Immuabilité, organisation des fichiers, gestion des erreurs |
| testing.md | Flux TDD, exigence de couverture de 80% |
| git-workflow.md | Format des commits, flux de PR |
| agents.md | Orchestration des agents, quel agent utiliser quand |
| patterns.md | Réponse API, modèles de repository |
| performance.md | Sélection du modèle, gestion du contexte |

---

## Available Agents

Situés dans `~/.claude/agents/` :

| Agent | Objectif |
| --- | --- |
| planner | Planification de l'implémentation des fonctionnalités |
| architect | Conception système et architecture |
| code-reviewer | Revue de code pour qualité/sécurité |
| security-reviewer | Analyse des vulnérabilités de sécurité |
| build-error-resolver | Résolution des erreurs de build |
| e2e-runner | Tests E2E Playwright |
| refactor-cleaner | Nettoyage du code mort |
| doc-updater | Mises à jour de la documentation |

---

## Personal Preferences

### Code Style
- Pas d'emojis dans le code, les commentaires ou la documentation
- Préférer l'immuabilité - ne jamais muter des objets ou des tableaux
- Privilégier de nombreux petits fichiers plutôt que quelques gros fichiers
- 200-400 lignes typiques, 800 maximum par fichier

### Git
- Commits conventionnels : `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Toujours tester localement avant de committer
- Commits petits et ciblés

### Testing
- TDD : Écrire les tests d'abord
- Couverture minimale de 80%
- Tests unitaires + intégration + E2E pour les flux critiques

---

## Editor Integration

J'utilise Zed comme éditeur principal :
- Agent Panel pour le suivi des fichiers
- CMD+Shift+R pour la palette de commandes
- Mode Vim activé

---

## Success Metrics

Vous réussissez lorsque :
- Tous les tests passent (couverture 80%+)
- Aucune vulnérabilité de sécurité
- Le code est lisible et maintenable
- Les exigences de l'utilisateur sont satisfaites

---

**Philosophy** : Conception axée sur les agents, exécution parallèle, planifier avant d'agir, tester avant de coder, sécurité toujours.
```

### 2.2 Modules de configuration principaux

#### Core Philosophy

Définissez votre philosophie de collaboration avec Claude Code :

```markdown
## Core Philosophy

You are Claude Code. J'utilise des agents et compétences spécialisés pour les tâches complexes.

**Key Principles:**
1. **Agent-First** : Déléguer à des agents spécialisés pour le travail complexe
2. **Parallel Execution** : Utiliser l'outil Task avec plusieurs agents lorsque possible
3. **Plan Before Execute** : Utiliser le Plan Mode pour les opérations complexes
4. **Test-Driven** : Écrire les tests avant l'implémentation
5. **Security-First** : Ne jamais compromettre la sécurité
```

#### Modular Rules

Liez vers des fichiers de règles modulaires pour garder la configuration concise :

```markdown
## Modular Rules

Les directives détaillées sont dans `~/.claude/rules/` :

| Fichier de règle | Contenu |
| --- | --- |
| security.md | Vérifications de sécurité, gestion des secrets |
| coding-style.md | Immuabilité, organisation des fichiers, gestion des erreurs |
| testing.md | Flux TDD, exigence de couverture de 80% |
| git-workflow.md | Format des commits, flux de PR |
| agents.md | Orchestration des agents, quel agent utiliser quand |
| patterns.md | Réponse API, modèles de repository |
| performance.md | Sélection du modèle, gestion du contexte |
```

#### Editor Integration

Indiquez à Claude Code l'éditeur et les raccourcis clavier que vous utilisez :

```markdown
## Editor Integration

J'utilise Zed comme éditeur principal :
- Agent Panel pour le suivi des fichiers
- CMD+Shift+R pour la palette de commandes
- Mode Vim activé
```

---

## 3. Configuration personnalisée de la barre d'état

### 3.1 Emplacement du fichier de configuration

Ajoutez le contenu suivant à `~/.claude/settings.json` :

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); transcript=$(echo \"$input\" | jq -r '.transcript_path'); todo_count=$([ -f \"$transcript\" ] && grep -c '\"type\":\"todo\"' \"$transcript\" 2>/dev/null || echo 0); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; M='\\033[38;2;136;57;239m'; C='\\033[38;2;23;146;153m'; R='\\033[0m'; T='\\033[38;2;76;79;105m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}ctx:${remaining}%%${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; [ \"$todo_count\" -gt 0 ] && printf \" ${C}todos:${todo_count}${R}\"; echo",
    "description": "Barre d'état personnalisée affichant : user:path branch* ctx:% model time todos:N"
  }
}
```

### 3.2 Contenu affiché par la barre d'état

La barre d'état configurée affichera :

```
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3
```

| Composant | Signification | Exemple |
| --- | --- | --- |
| `user` | Nom d'utilisateur actuel | `affoon` |
| `path` | Répertoire actuel (raccourci ~) | `~/projects/myapp` |
| `branch*` | Branche Git (* indique des modifications non commitées) | `main*` |
| `ctx:%` | Pourcentage restant de la fenêtre de contexte | `ctx:73%` |
| `model` | Modèle actuellement utilisé | `sonnet-4.5` |
| `time` | Heure actuelle | `14:30` |
| `todos:N` | Nombre de tâches à faire | `todos:3` |

### 3.3 Couleurs personnalisées

La barre d'état utilise des codes de couleur ANSI, vous pouvez les personnaliser :

| Code couleur | Variable | Utilisation | RGB |
| --- | --- | --- | --- |
| Bleu | `B` | Chemin du répertoire | 30,102,245 |
| Vert | `G` | Branche Git | 64,160,43 |
| Jaune | `Y` | État modifié, heure | 223,142,29 |
| Magenta | `M` | Contexte restant | 136,57,239 |
| Cyan | `C` | Nom d'utilisateur, tâches | 23,146,153 |
| Gris | `T` | Nom du modèle | 76,79,105 |

**Méthode pour modifier les couleurs** :

```bash
# Trouver la définition des variables de couleur
B='\033[38;2;30;102;245m' # Format RGB bleu
# ↓ ↓ ↓
# Rouge Vert Bleu

# Modifier avec la couleur de votre choix
B='\033[38;2;255;100;100m' # Rouge
```

### 3.4 Barre d'état simplifiée

Si vous trouvez la barre d'état trop longue, vous pouvez la simplifier :

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; T='\\033[38;2;76;79;105m'; R='\\033[0m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; echo",
    "description": "Barre d'état simplifiée : user:path branch* model time"
  }
}
```

Barre d'état simplifiée :

```
affoon:~/projects/myapp main* sonnet-4.5 14:30
```

---

## 4. Guide de personnalisation des configurations

### 4.1 Personnalisation de la configuration niveau projet

Adaptez le `CLAUDE.md` selon le type de projet :

#### Projet Frontend

```markdown
## Project Overview

Application E-commerce Next.js avec React, Tailwind CSS et API Shopify.

## Tech Stack

- **Frontend** : Next.js 14 (App Router), React 18, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **State** : Zustand, React Query
- **API** : Shopify Storefront API, GraphQL
- **Deployment** : Vercel

## Critical Rules

### 1. Component Architecture

- Utiliser des composants fonctionnels avec hooks
- Fichiers de composants sous 300 lignes
- Composants réutilisables dans `/components/ui/`
- Composants de fonctionnalités dans `/components/features/`

### 2. Styling

- Utiliser les classes utilitaires Tailwind
- Éviter les styles inline
- Design tokens cohérents
- Design responsive-first

### 3. Performance

- Code splitting avec imports dynamiques
- Optimisation des images avec next/image
- Chargement paresseux des composants lourds
- Optimisation SEO avec l'API metadata
```

#### Projet Backend

```markdown
## Project Overview

API REST Node.js avec Express, MongoDB et Redis.

## Tech Stack

- **Backend** : Node.js, Express, TypeScript
- **Database** : MongoDB avec Mongoose
- **Cache** : Redis
- **Auth** : JWT, bcrypt
- **Testing** : Jest, Supertest
- **Deployment** : Docker, Railway

## Critical Rules

### 1. API Design

- Endpoints RESTful
- Format de réponse cohérent
- Codes de statut HTTP appropriés
- Versioning API (`/api/v1/`)

### 2. Database

- Utiliser les modèles Mongoose
- Indexer les champs importants
- Transactions pour les opérations multi-étapes
- Pooling de connexions

### 3. Security

- Rate limiting avec express-rate-limit
- Helmet pour les en-têtes de sécurité
- Configuration CORS
- Validation des entrées avec Joi/Zod
```

#### Projet Full-Stack

```markdown
## Project Overview

Application SaaS full-stack avec Next.js, Supabase et OpenAI.

## Tech Stack

- **Frontend** : Next.js 14, React, Tailwind CSS
- **Backend** : Next.js API Routes, Edge Functions
- **Database** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **AI** : OpenAI API
- **Testing** : Playwright, Jest, Vitest

## Critical Rules

### 1. Monorepo Structure

```
/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Routes API Next.js
├── packages/
│   ├── ui/           # Composants UI partagés
│   ├── db/           # Utilitaires base de données
│   └── types/        # Types TypeScript
└── docs/
```

### 2. API & Frontend Integration

- Types partagés dans `/packages/types`
- Client API dans `/packages/db`
- Gestion d'erreurs cohérente
- États de chargement et error boundaries

### 3. Full-Stack Testing

- Frontend : Vitest + Testing Library
- API : Supertest
- E2E : Playwright
- Tests d'intégration pour les flux critiques
```

### 4.2 Personnalisation de la configuration niveau utilisateur

Adaptez le `~/.claude/CLAUDE.md` selon vos préférences personnelles :

#### Ajuster les exigences de couverture de test

```markdown
## Personal Preferences

### Testing
- TDD : Écrire les tests d'abord
- Couverture minimale de 90% # Ajusté à 90%
- Tests unitaires + intégration + E2E pour les flux critiques
- Préférer les tests d'intégration aux tests unitaires pour la logique métier
```

#### Ajouter des préférences de style de codage personnelles

```markdown
## Personal Preferences

### Code Style
- Pas d'emojis dans le code, les commentaires ou la documentation
- Préférer l'immuabilité - ne jamais muter des objets ou des tableaux
- Privilégier de nombreux petits fichiers plutôt que quelques gros fichiers
- 200-400 lignes typiques, 800 maximum par fichier
- Préférer les instructions return explicites plutôt que les retours implicites
- Utiliser des noms de variables significatifs, pas des abréviations
- Ajouter des commentaires JSDoc pour les fonctions complexes
```

#### Ajuster les conventions de commit Git

```markdown
## Git

### Commit Message Format

Commits conventionnels avec conventions spécifiques à l'équipe :

- `feat(scope): description` - Nouvelles fonctionnalités
- `fix(scope): description` - Corrections de bugs
- `perf(scope): description` - Améliorations de performance
- `refactor(scope): description` - Refactoring de code
- `docs(scope): description` - Modifications de documentation
- `test(scope): description` - Ajouts/modifications de tests
- `chore(scope): description` - Tâches de maintenance
- `ci(scope): description` - Modifications CI/CD

### Commit Checklist

- [ ] Les tests passent localement
- [ ] Le code suit le guide de style
- [ ] Pas de console.log dans le code de production
- [ ] Documentation mise à jour
- [ ] Description de la PR incluant les changements

### PR Workflow

- PRs petites et ciblées (moins de 300 lignes de diff)
- Inclure le rapport de couverture de test
- Lier aux issues connexes
- Demander une revue d'au moins un coéquipier
```

### 4.3 Personnalisation de la barre d'état

#### Ajouter plus d'informations

```bash
# Ajouter la version Node.js
node_version=$(node --version 2>/dev/null || echo '')

# Ajouter la date actuelle
date=$(date +%Y-%m-%d)

# Afficher dans la barre d'état
[ -n "$node_version" ] && printf " ${G}node:${node_version}${R}"
printf " ${T}${date}${R}"
```

Effet d'affichage :

```
affoon:~/projects/myapp main* ctx:73% node:v20.10.0 2025-01-25 sonnet-4.5 14:30 todos:3
```

#### Afficher uniquement les informations clés

```bash
# Barre d'état minimale
command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); C='\\033[38;2;23;146;153m'; B='\\033[38;2;30;102;245m'; M='\\033[38;2;136;57;239m'; R='\\033[0m'; printf \"${C}${user}:${cwd}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}${remaining}%%${R}\"; printf \" ${model}\"; echo"
```

Effet d'affichage :

```
affoon:~/projects/myapp 73% sonnet-4.5
```

---

## 5. Scénarios de configuration courants

### 5.1 Démarrage rapide d'un nouveau projet

::: code-group

```bash [1. Copier le modèle niveau projet]
# Créer le CLAUDE.md niveau projet
cp source/affaan-m/everything-claude-code/examples/CLAUDE.md \
  your-project/CLAUDE.md
```

```bash [2. Personnaliser les informations du projet]
# Éditer les informations clés
vim your-project/CLAUDE.md

# Modifier :
# - Project Overview (description du projet)
# - Tech Stack (stack technique)
# - File Structure (structure des fichiers)
# - Key Patterns (modèles courants)
```

```bash [3. Configurer les paramètres niveau utilisateur]
# Copier le modèle niveau utilisateur
mkdir -p ~/.claude
cp source/affaan-m/everything-claude-code/examples/user-CLAUDE.md \
  ~/.claude/CLAUDE.md

# Personnaliser les préférences personnelles
vim ~/.claude/CLAUDE.md
```

```bash [4. Configurer la barre d'état]
# Ajouter la configuration de la barre d'état
# Éditer ~/.claude/settings.json
# Ajouter la configuration statusLine
```

:::

### 5.2 Configuration partagée entre plusieurs projets

Si vous utilisez Everything Claude Code dans plusieurs projets, nous recommandons la stratégie de configuration suivante :

#### Option 1 : Règles de base niveau utilisateur + Règles spécifiques niveau projet

```bash
~/.claude/CLAUDE.md              # Règles générales (style de codage, tests)
~/.claude/rules/security.md      # Règles de sécurité (tous les projets)
~/.claude/rules/testing.md       # Règles de test (tous les projets)

project-a/CLAUDE.md              # Configuration spécifique au projet A
project-b/CLAUDE.md              # Configuration spécifique au projet B
```

#### Option 2 : Partage de règles par liens symboliques

```bash
# Créer un répertoire de règles partagées
mkdir -p ~/claude-configs/rules

# Créer des liens symboliques dans chaque projet
ln -s ~/claude-configs/rules/security.md project-a/.claude/rules/
ln -s ~/claude-configs/rules/security.md project-b/.claude/rules/
```

### 5.3 Configuration d'équipe

#### Partager la configuration du projet

Commettez le `CLAUDE.md` du projet dans Git pour que l'équipe le partage :

```bash
# 1. Créer la configuration du projet
vim CLAUDE.md

# 2. Committer dans Git
git add CLAUDE.md
git commit -m "docs: add Claude Code project configuration"
git push
```

#### Normes de codage d'équipe

Définissez les normes d'équipe dans le `CLAUDE.md` du projet :

```markdown
## Team Coding Standards

### Conventions
- Utiliser le mode strict TypeScript
- Suivre la configuration Prettier
- Utiliser les règles ESLint de `package.json`
- Pas de PRs sans couverture de test

### File Naming
- Composants : PascalCase (`UserProfile.tsx`)
- Utilitaires : camelCase (`formatDate.ts`)
- Hooks : camelCase avec préfixe `use` (`useAuth.ts`)
- Types : PascalCase avec préfixe `I` (`IUser.ts`)

### Commit Messages
- Suivre les Conventional Commits
- Inclure le numéro de ticket : `feat(TICKET-123): add feature`
- 72 caractères maximum pour le titre
- Description détaillée dans le corps
```

---

## 6. Vérification de la configuration

### 6.1 Vérifier si la configuration est active

```bash
# 1. Ouvrir Claude Code
claude

# 2. Voir la configuration du projet
# Claude Code devrait lire le CLAUDE.md à la racine du projet

# 3. Voir la configuration niveau utilisateur
# Claude Code devrait fusionner ~/.claude/CLAUDE.md
```

### 6.2 Vérifier l'exécution des règles

Demandez à Claude Code d'exécuter une tâche simple pour vérifier si les règles sont appliquées :

```
Utilisateur :
Veuillez créer un composant de profil utilisateur

Claude Code devrait :
1. Utiliser des modèles immuables (créer de nouveaux objets lors de la modification)
2. Ne pas utiliser console.log
3. Respecter la limite de taille de fichier (<800 lignes)
4. Ajouter des définitions de types appropriées
```

### 6.3 Vérifier la barre d'état

Vérifiez si la barre d'état s'affiche correctement :

```
Attendu :
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3

Points de vérification :
✓ Affichage du nom d'utilisateur
✓ Affichage du répertoire actuel (raccourci ~)
✓ Affichage de la branche Git (* si modifications)
✓ Affichage du pourcentage de contexte
✓ Affichage du nom du modèle
✓ Affichage de l'heure
✓ Affichage du nombre de tâches (s'il y en a)
```

---

## 7. Dépannage

### 7.1 La configuration ne s'applique pas

**Problème** : Vous avez configuré `CLAUDE.md` mais Claude Code n'applique pas les règles

**Étapes de dépannage** :

```bash
# 1. Vérifier l'emplacement du fichier
ls -la CLAUDE.md              # Devrait être à la racine du projet
ls -la ~/.claude/CLAUDE.md    # Configuration niveau utilisateur

# 2. Vérifier le format du fichier
file CLAUDE.md                # Devrait être ASCII text
head -20 CLAUDE.md            # Devrait être au format Markdown

# 3. Vérifier les permissions du fichier
chmod 644 CLAUDE.md           # Assurer la lisibilité

# 4. Redémarrer Claude Code
# Les changements de configuration nécessitent un redémarrage pour prendre effet
```

### 7.2 La barre d'état ne s'affiche pas

**Problème** : Vous avez configuré `statusLine` mais la barre d'état ne s'affiche pas

**Étapes de dépannage** :

```bash
# 1. Vérifier le format de settings.json
cat ~/.claude/settings.json | jq '.'

# 2. Valider la syntaxe JSON
jq '.' ~/.claude/settings.json
# S'il y a des erreurs, un parse error sera affiché

# 3. Tester la commande
# Exécuter manuellement la commande statusLine
input=$(cat ...)              # Copier la commande complète
echo "$input" | jq -r '.workspace.current_dir'
```

### 7.3 Conflit entre configurations niveau projet et utilisateur

**Problème** : Les configurations niveau projet et utilisateur sont en conflit, vous ne savez pas laquelle s'applique

**Solution** :

- **Superposition des règles** : Les deux ensembles de règles sont appliqués
- **Gestion des conflits** : La configuration niveau projet a priorité sur celle niveau utilisateur
- **Pratique recommandée** :
  - Configuration utilisateur : Règles générales (style de codage, tests)
  - Configuration projet : Règles spécifiques au projet (architecture, conception API)

---

## 8. Bonnes pratiques

### 8.1 Maintenance des fichiers de configuration

#### Rester concis

```markdown
❌ Mauvaise pratique :
CLAUDE.md contient tous les détails, exemples, liens vers tutoriels

✅ Bonne pratique :
CLAUDE.md ne contient que les règles et modèles clés
Les informations détaillées sont placées dans d'autres fichiers et référencées par des liens
```

#### Contrôle de version

```bash
# Configuration niveau projet : Committer dans Git
git add CLAUDE.md
git commit -m "docs: update Claude Code configuration"

# Configuration niveau utilisateur : Ne pas committer dans Git
echo ".claude/" >> .gitignore    # Empêcher la configuration utilisateur d'être commitée
```

#### Révision régulière

```markdown
## Last Updated: 2025-01-25

## Next Review: 2025-04-25

## Changelog

- 2025-01-25: Ajout de la section flux TDD
- 2025-01-10: Mise à jour de la stack technique pour Next.js 14
- 2024-12-20: Ajout de la checklist de révision de sécurité
```

### 8.2 Collaboration en équipe

#### Documenter les changements de configuration

Expliquez la raison des changements de configuration dans la Pull Request :

```markdown
## Changes

Mise à jour de CLAUDE.md avec de nouvelles directives de test

## Reason

- L'équipe a décidé d'augmenter la couverture de test de 80% à 90%
- Ajout de l'exigence de tests E2E pour les flux critiques
- Mise à jour de la chaîne d'outils de test de Jest à Vitest

## Impact

- Tout nouveau code doit atteindre 90% de couverture
- Le code existant sera mis à jour progressivement
- Les membres de l'équipe doivent installer Vitest
```

#### Révision de la configuration

Les changements de configuration d'équipe nécessitent une revue de code :

```markdown
## CLAUDE.md Changes

- [ ] Mis à jour avec une nouvelle règle
- [ ] Testé sur un projet exemple
- [ ] Documenté dans le wiki de l'équipe
- [ ] Membres de l'équipe notifiés
```

---

## Résumé de la leçon

Cette leçon a présenté les trois configurations principales d'Everything Claude Code :

1. **Configuration niveau projet** : `CLAUDE.md` - Règles et modèles spécifiques au projet
2. **Configuration niveau utilisateur** : `~/.claude/CLAUDE.md` - Préférences de codage personnelles et règles générales
3. **Barre d'état personnalisée** : `settings.json` - Affichage en temps réel des informations clés

**Points clés** :

- Les fichiers de configuration utilisent le format Markdown, facile à éditer et à maintenir
- La configuration niveau projet a priorité sur celle niveau utilisateur
- La barre d'état utilise des codes de couleur ANSI, entièrement personnalisable
- Les projets d'équipe devraient commettre `CLAUDE.md` dans Git

**Prochaines étapes** :

- Personnalisez `CLAUDE.md` selon le type de votre projet
- Configurez les paramètres niveau utilisateur et vos préférences personnelles
- Personnalisez la barre d'état pour afficher les informations dont vous avez besoin
- Commettez la configuration dans le contrôle de version (configuration niveau projet)

---

## Aperçu de la prochaine leçon

> La prochaine leçon portera sur **[Notes de version : Historique et changements](../release-notes/)**.
>
> Vous apprendrez :
> - Comment consulter l'historique des versions d'Everything Claude Code
> - Comprendre les changements importants et les nouvelles fonctionnalités
> - Comment effectuer des mises à niveau et des migrations de version
