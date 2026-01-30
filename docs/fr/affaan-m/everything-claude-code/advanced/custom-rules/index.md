---
title: "Règles personnalisées : Définir les standards de votre projet | Everything Claude Code"
subtitle: "Règles personnalisées : Définir les standards de votre projet"
sidebarTitle: "Faire obéir Claude"
description: "Apprenez à créer des fichiers de règles personnalisées. Maîtrisez le format des règles, la rédaction de checklists, la personnalisation des règles de sécurité et l'intégration du workflow Git pour que Claude respecte automatiquement les standards de votre équipe."
tags:
  - "custom-rules"
  - "project-standards"
  - "code-quality"
prerequisite:
  - "start-quick-start"
order: 130
---

# Règles personnalisées : Définir les standards de votre projet

## Ce que vous saurez faire

- Créer des fichiers de règles personnalisées pour définir les conventions de codage spécifiques à votre projet
- Utiliser des checklists pour garantir une qualité de code cohérente
- Intégrer les standards de votre équipe dans le workflow Claude Code
- Personnaliser différents types de règles selon les besoins du projet

## Votre situation actuelle

Avez-vous déjà rencontré ces problèmes ?

- Les styles de code varient entre les membres de l'équipe, et les mêmes problèmes reviennent sans cesse lors des revues de code
- Votre projet a des exigences de sécurité spécifiques que Claude ne connaît pas
- Vous devez vérifier manuellement le respect des conventions de l'équipe à chaque fois que vous écrivez du code
- Vous aimeriez que Claude rappelle automatiquement certaines bonnes pratiques spécifiques au projet

## Quand utiliser cette technique

- **Lors de l'initialisation d'un nouveau projet** - Définir les conventions de codage et les standards de sécurité propres au projet
- **Lors du travail en équipe** - Unifier le style de code et les standards de qualité
- **Après avoir identifié des problèmes récurrents lors des revues de code** - Formaliser les problèmes courants en règles
- **Lorsque le projet a des besoins spécifiques** - Intégrer les normes du secteur ou les règles spécifiques à la stack technique

## Concept clé

Les règles constituent la couche d'application des standards du projet, permettant à Claude de respecter automatiquement les normes que vous définissez.

### Comment fonctionnent les règles

Les fichiers de règles se trouvent dans le répertoire `rules/`. Claude Code charge automatiquement toutes les règles au début de chaque session. À chaque génération de code ou revue, Claude effectue des vérifications basées sur ces règles.

::: info Différence entre Rules et Skills

- **Rules** : Checklists obligatoires, applicables à toutes les opérations (vérifications de sécurité, style de code, etc.)
- **Skills** : Définitions de workflows et connaissances métier, applicables à des tâches spécifiques (processus TDD, conception d'architecture, etc.)

Les Rules sont des contraintes « à respecter impérativement », les Skills sont des guides « comment faire ».
:::

### Structure des fichiers de règles

Chaque fichier de règle suit un format standard :

```markdown
# Titre de la règle

## Catégorie de la règle
Description de la règle...

### Checklist
- [ ] Point de vérification 1
- [ ] Point de vérification 2

### Exemples de code
Comparaison code correct / code incorrect...
```

## Suivez le guide

### Étape 1 : Découvrir les types de règles intégrées

Everything Claude Code fournit 8 ensembles de règles intégrées. Commencez par comprendre leurs fonctions.

**Pourquoi**

Connaître les règles intégrées vous aide à identifier ce que vous devez personnaliser et évite de réinventer la roue.

**Consulter les règles intégrées**

Examinez le répertoire `rules/` dans le code source :

```bash
ls rules/
```

Vous verrez les 8 fichiers de règles suivants :

| Fichier de règle | Utilité | Cas d'utilisation |
| --- | --- | --- |
| `security.md` | Vérifications de sécurité | Clés API, entrées utilisateur, opérations de base de données |
| `coding-style.md` | Style de code | Taille des fonctions, organisation des fichiers, patterns d'immutabilité |
| `testing.md` | Exigences de test | Couverture de tests, processus TDD, types de tests |
| `performance.md` | Optimisation des performances | Choix du modèle, gestion du contexte, stratégies de compression |
| `agents.md` | Utilisation des agents | Quel agent utiliser et quand, exécution parallèle |
| `git-workflow.md` | Workflow Git | Format des commits, processus PR, gestion des branches |
| `patterns.md` | Design patterns | Pattern Repository, format de réponse API, projets squelettes |
| `hooks.md` | Système de hooks | Types de hooks, permissions d'acceptation automatique, TodoWrite |

**Ce que vous devriez voir** :
- Chaque fichier de règle a un titre et une catégorisation clairs
- Les règles incluent des checklists et des exemples de code
- Les règles s'appliquent à des scénarios et besoins techniques spécifiques

### Étape 2 : Créer un fichier de règles personnalisées

Créez un nouveau fichier de règles dans le répertoire `rules/` de votre projet.

**Pourquoi**

Les règles personnalisées permettent de résoudre les problèmes spécifiques à votre projet et de faire respecter les conventions de l'équipe par Claude.

**Créer le fichier de règles**

Supposons que votre projet utilise Next.js et Tailwind CSS, et que vous devez définir des conventions pour les composants frontend :

```bash
# Créer le fichier de règles
touch rules/frontend-conventions.md
```

**Éditer le fichier de règles**

Ouvrez `rules/frontend-conventions.md` et ajoutez le contenu suivant :

```markdown
# Frontend Conventions

## Component Design
ALL components must follow these conventions:

### Component Structure
- Export default function component
- Use TypeScript interfaces for props
- Keep components focused (<300 lines)
- Use Tailwind utility classes, not custom CSS

### Naming Conventions
- Component files: PascalCase (UserProfile.tsx)
- Component names: PascalCase
- Props interface: `<ComponentName>Props`
- Utility functions: camelCase

### Code Example

\`\`\`typescript
// CORRECT: Following conventions
interface UserProfileProps {
  name: string
  email: string
  avatar?: string
}

export default function UserProfile({ name, email, avatar }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {avatar && <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />}
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`typescript
// WRONG: Violating conventions
export const UserProfile = (props: any) => {
  return <div>...</div>  // Missing TypeScript, wrong export
}
\`\`\`

### Checklist
Before marking frontend work complete:
- [ ] Components follow PascalCase naming
- [ ] Props interfaces properly typed with TypeScript
- [ ] Components <300 lines
- [ ] Tailwind utility classes used (no custom CSS)
- [ ] Default export used
- [ ] Component file name matches component name
```

**Ce que vous devriez voir** :
- Le fichier de règles utilise le format Markdown standard
- Titres et catégories clairs (##)
- Exemples de code comparatifs (CORRECT vs WRONG)
- Checklist (cases à cocher)
- Descriptions de règles concises et claires

### Étape 3 : Définir des règles de sécurité personnalisées

Si votre projet a des exigences de sécurité particulières, créez des règles de sécurité dédiées.

**Pourquoi**

Le fichier `security.md` intégré contient des vérifications de sécurité génériques, mais votre projet peut avoir des besoins de sécurité spécifiques.

**Créer les règles de sécurité du projet**

Créez `rules/project-security.md` :

```markdown
# Project Security Requirements

## API Authentication
ALL API calls must include authentication:

### JWT Token Management
- Store JWT in httpOnly cookies (not localStorage)
- Validate token expiration on each request
- Refresh tokens automatically before expiration
- Include CSRF protection headers

// CORRECT: JWT in httpOnly cookie
const response = await fetch('/api/users', {
  credentials: 'include',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
})

// WRONG: JWT in localStorage (vulnerable to XSS)
const token = localStorage.getItem('jwt')
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

## Data Validation
ALL user inputs must be validated server-side:

import { z } from 'zod'
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(18, 'Must be 18 or older')
})
const validatedData = CreateUserSchema.parse(req.body)

## Checklist
Before marking security work complete:
- [ ] API calls use httpOnly cookies for JWT
- [ ] CSRF protection enabled
- [ ] All user inputs validated server-side
- [ ] Sensitive data never logged
- [ ] Rate limiting configured on all endpoints
- [ ] Error messages don't leak sensitive information
```

**Ce que vous devriez voir** :
- Les règles ciblent la stack technique spécifique du projet (JWT, Zod)
- Les exemples de code montrent les implémentations correctes et incorrectes
- La checklist couvre tous les points de vérification de sécurité

### Étape 4 : Définir des règles de workflow Git spécifiques au projet

Si votre équipe a des conventions de commit Git particulières, vous pouvez étendre `git-workflow.md` ou créer des règles personnalisées.

**Pourquoi**

Le fichier `git-workflow.md` intégré contient un format de commit basique, mais votre équipe peut avoir des exigences supplémentaires.

**Créer les règles Git**

Créez `rules/team-git-workflow.md` :

```markdown
# Team Git Workflow

## Commit Message Format
Follow Conventional Commits with team-specific conventions:

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `docs`: Documentation changes
- `test`: Test updates
- `chore`: Maintenance tasks
- `team` (custom): Team-specific changes (onboarding, meetings)

### Commit Scope (REQUIRED)
Must include scope in brackets after type:

Format: 

Examples:
- feat(auth): add OAuth2 login
- fix(api): handle 404 errors
- docs(readme): update installation guide
- team(onboarding): add Claude Code setup guide

### Commit Body (Required for breaking changes)

feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses

## Pull Request Requirements

### PR Checklist
Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist
Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated
```


Examples:
feat(auth): add OAuth2 login
fix(api): handle 404 errors
docs(readme): update installation guide
team(onboarding): add Claude Code setup guide
```

### Commit Body (Required for breaking changes)

```
feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses
```

## Pull Request Requirements

### PR Checklist

Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist

Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated

## Checklist

Before marking Git work complete:
- [ ] Commit message includes type and scope
- [ ] Breaking changes documented in commit body
- [ ] PR title follows conventional commits format
- [ ] Test plan included in PR description
- [ ] Related issues linked to PR
```

**Ce que vous devriez voir** :
- Le format de commit Git inclut un type personnalisé par l'équipe (`team`)
- Le scope de commit est obligatoire
- Les PR ont une checklist claire
- Les règles s'appliquent au workflow de collaboration d'équipe

### Étape 5 : Vérifier le chargement des règles

Après avoir créé les règles, vérifiez que Claude Code les charge correctement.

**Pourquoi**

S'assurer que le format des fichiers de règles est correct et que Claude peut lire et appliquer les règles.

**Méthode de vérification**

1. Démarrez une nouvelle session Claude Code
2. Demandez à Claude de vérifier les règles chargées :
   ```
   Quels fichiers de règles sont chargés ?
   ```

3. Testez si les règles sont effectives :
   ```
   Créez un composant React en respectant les règles frontend-conventions
   ```

**Ce que vous devriez voir** :
- Claude liste toutes les règles chargées (y compris les règles personnalisées)
- Le code généré respecte les conventions que vous avez définies
- Si une règle est violée, Claude suggère une correction

### Étape 6 : Intégrer au processus de revue de code

Faites en sorte que les règles personnalisées soient automatiquement vérifiées lors des revues de code.

**Pourquoi**

L'application automatique des règles lors des revues de code garantit que tout le code respecte les standards.

**Configurer code-reviewer pour référencer les règles**

Assurez-vous que `agents/code-reviewer.md` référence les règles pertinentes :

```markdown
---
name: code-reviewer
description: Review code for quality, security, and adherence to standards
---

When reviewing code, check these rules:

1. **Security checks** (rules/security.md)
   - No hardcoded secrets
   - All inputs validated
   - SQL injection prevention
   - XSS prevention

2. **Coding style** (rules/coding-style.md)
   - Immutability
   - File organization
   - Error handling
   - Input validation

3. **Project-specific rules**
   - Frontend conventions (rules/frontend-conventions.md)
   - Project security (rules/project-security.md)
   - Team Git workflow (rules/team-git-workflow.md)

Report findings in this format:
- CRITICAL: Must fix before merge
- HIGH: Should fix before merge
- MEDIUM: Consider fixing
- LOW: Nice to have
```

**Ce que vous devriez voir** :
- L'agent code-reviewer vérifie toutes les règles pertinentes lors des revues
- Les rapports sont classés par niveau de gravité
- Les conventions spécifiques au projet sont intégrées au processus de revue

## Points de contrôle ✅

- [ ] Au moins un fichier de règles personnalisées créé
- [ ] Les fichiers de règles suivent le format standard (titre, catégorie, exemples de code, checklist)
- [ ] Les règles incluent des exemples comparatifs correct/incorrect
- [ ] Les fichiers de règles sont dans le répertoire `rules/`
- [ ] Vérification que Claude Code charge correctement les règles
- [ ] L'agent code-reviewer référence les règles personnalisées

## Pièges à éviter

### ❌ Erreur courante 1 : Nommage non standard des fichiers de règles

**Problème** : Les noms de fichiers de règles contiennent des espaces ou des caractères spéciaux, empêchant Claude de les charger.

**Correction** :
- ✅ Correct : `frontend-conventions.md`, `project-security.md`
- ❌ Incorrect : `Frontend Conventions.md`, `project-security(v2).md`

Utilisez des lettres minuscules et des tirets, évitez les espaces et les parenthèses.

### ❌ Erreur courante 2 : Règles trop vagues

**Problème** : Les descriptions de règles sont floues, rendant impossible de déterminer clairement la conformité.

**Correction** : Fournissez des checklists spécifiques et des exemples de code :

```markdown
❌ Règle vague : Les composants doivent être concis et lisibles

✅ Règle spécifique :
- Les composants doivent faire < 300 lignes
- Les fonctions doivent faire < 50 lignes
- Interdiction de dépasser 4 niveaux d'imbrication
```

### ❌ Erreur courante 3 : Absence d'exemples de code

**Problème** : Seulement des descriptions textuelles, sans démonstration des implémentations correctes et incorrectes.

**Correction** : Toujours inclure des exemples de code comparatifs :

```markdown
CORRECT : Respecte les conventions
function example() { ... }

WRONG : Viole les conventions
function example() { ... }
```

### ❌ Erreur courante 4 : Checklist incomplète

**Problème** : La checklist omet des points de vérification clés, empêchant l'application complète des règles.

**Correction** : Couvrez tous les aspects décrits dans les règles :

```markdown
Checklist :
- [ ] Point de vérification 1
- [ ] Point de vérification 2
- [ ] ... (couvrir tous les points clés des règles)
```

## Résumé de la leçon

Les règles personnalisées sont essentielles pour standardiser votre projet :

1. **Comprendre les règles intégrées** - 8 ensembles de règles standard couvrant les scénarios courants
2. **Créer des fichiers de règles** - Utiliser le format Markdown standard
3. **Définir les conventions du projet** - Personnaliser selon la stack technique et les besoins de l'équipe
4. **Vérifier le chargement** - S'assurer que Claude lit correctement les règles
5. **Intégrer au processus de revue** - Faire vérifier automatiquement les règles par code-reviewer

Grâce aux règles personnalisées, vous pouvez faire respecter automatiquement les conventions du projet par Claude, réduire la charge de travail des revues de code et améliorer la cohérence de la qualité du code.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Injection dynamique de contexte : Utilisation des Contexts](/fr/affaan-m/everything-claude-code/advanced/dynamic-contexts/)**.
>
> Vous apprendrez :
> - La définition et l'utilité des Contexts
> - Comment créer des Contexts personnalisés
> - Comment basculer entre les Contexts selon les modes de travail
> - La différence entre Contexts et Rules

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Règles de sécurité | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Règles de style de code | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Règles de test | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Règles de performance | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Règles d'utilisation des agents | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Règles de workflow Git | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Règles de design patterns | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Règles du système de hooks | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |
| Code Reviewer | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-200 |

**Constantes clés** :
- `MIN_TEST_COVERAGE = 80` : Couverture de test minimale requise
- `MAX_FILE_SIZE = 800` : Limite maximale de lignes par fichier
- `MAX_FUNCTION_SIZE = 50` : Limite maximale de lignes par fonction
- `MAX_NESTING_LEVEL = 4` : Niveau d'imbrication maximal

**Règles clés** :
- **Immutability (CRITICAL)** : Interdiction de modifier directement les objets, utiliser l'opérateur spread
- **Secret Management** : Interdiction de coder en dur les clés, utiliser les variables d'environnement
- **TDD Workflow** : Exige d'écrire les tests d'abord, puis l'implémentation, puis le refactoring
- **Model Selection** : Choisir Haiku/Sonnet/Opus selon la complexité de la tâche

</details>
