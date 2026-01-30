---
title: "Règles : Explication détaillée des 8 ensembles de règles | everything-claude-code"
sidebarTitle: "Référence rapide des 8 ensembles de règles"
subtitle: "Règles : Explication détaillée des 8 ensembles de règles | everything-claude-code"
description: "Apprenez les 8 ensembles de règles d'everything-claude-code, y compris sécurité, style de code, tests, workflow Git, optimisation des performances, utilisation d'agents, modèles de conception et système de Hooks."
tags:
  - "rules"
  - "security"
  - "coding-style"
  - "testing"
  - "git-workflow"
  - "performance"
prerequisite:
  - "/fr/affaan-m/everything-claude-code/start/quickstart/"
order: 200
---

# Référence complète des Règles : Explication détaillée des 8 ensembles de règles

## Ce que vous pourrez faire après avoir terminé

- Trouver et comprendre rapidement les 8 ensembles de règles obligatoires
- Appliquer correctement les normes de sécurité, style de code, tests, etc. pendant le développement
- Savoir quel agent utiliser pour aider à respecter les règles
- Comprendre les stratégies d'optimisation des performances et le fonctionnement du système de Hooks

## Vos défis actuels

Face aux 8 ensembles de règles du projet, vous pourriez :

- **Ne pas vous souvenir de toutes les règles** : sécurité, style de code, tests, workflow Git... lesquelles sont obligatoires ?
- **Ne pas savoir comment les appliquer** : les règles mentionnent des modèles immuables, le flux TDD, mais comment opérer concrètement ?
- **Ne pas savoir à qui demander de l'aide** : quel agent utiliser pour les problèmes de sécurité ? à qui s'adresser pour la revue de code ?
- **Équilibre performance et sécurité** : comment optimiser l'efficacité du développement tout en garantissant la qualité du code ?

Ce document de référence vous aide à comprendre en profondeur le contenu, les scénarios d'application et les outils Agent correspondants pour chaque ensemble de règles.

---

## Aperçu des Règles

Everything Claude Code comprend 8 ensembles de règles obligatoires, chacun avec des objectifs et des scénarios d'application clairs :

| Ensemble de règles | Objectif | Priorité | Agent correspondant |
|--- | --- | --- | ---|
| **Security** | Prévenir les failles de sécurité et les fuites de données sensibles | P0 | security-reviewer |
| **Coding Style** | Code lisible, modèles immuables, fichiers de petite taille | P0 | code-reviewer |
| **Testing** | 80%+ de couverture de tests, flux TDD | P0 | tdd-guide |
| **Git Workflow** | Commits standardisés, flux PR | P1 | code-reviewer |
| **Agents** | Utilisation correcte des sous-agents | P1 | N/A |
| **Performance** | Optimisation des tokens, gestion du contexte | P1 | N/A |
| **Patterns** | Modèles de conception, meilleures pratiques d'architecture | P2 | architect |
| **Hooks** | Comprendre et utiliser les Hooks | P2 | N/A |

::: info Explication des priorités des règles

- **P0 (Critique)** : Doit être strictement respecté, les violations entraînent des risques de sécurité ou une dégradation grave de la qualité du code
- **P1 (Important)** : Devrait être respecté, affecte l'efficacité du développement et la collaboration d'équipe
- **P2 (Recommandé)** : Respect recommandé, améliore l'architecture du code et la maintenabilité
:::

---

## 1. Security (Règles de sécurité)

### Vérifications de sécurité obligatoires

Avant **tout commit**, les vérifications suivantes doivent être terminées :

- [ ] Aucune clé codée en dur (clés API, mots de passe, tokens)
- [ ] Toutes les entrées utilisateur ont été validées
- [ ] Prévention des injections SQL (requêtes paramétrées)
- [ ] Prévention XSS (nettoyage HTML)
- [ ] Protection CSRF activée
- [ ] Authentification/autorisation vérifiée
- [ ] Toutes les extrémités ont une limitation de taux
- [ ] Les messages d'erreur ne divulguent pas de données sensibles

### Gestion des clés

**❌ Mauvaise pratique** : clé codée en dur

```typescript
const apiKey = "sk-proj-xxxxx"
```

**✅ Bonne pratique** : utiliser des variables d'environnement

```typescript
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### Protocole de réponse de sécurité

Si un problème de sécurité est découvert :

1. **Arrêter immédiatement** le travail en cours
2. Utiliser l'agent **security-reviewer** pour une analyse complète
3. Corriger les problèmes CRITIQUES avant de continuer
4. Faire pivoter toutes les clés exposées
5. Vérifier l'ensemble du codebase pour des problèmes similaires

::: tip Utilisation de l'agent de sécurité

L'utilisation de la commande `/code-review` déclenche automatiquement la vérification de security-reviewer, garantissant que le code respecte les normes de sécurité.
:::

---

## 2. Coding Style (Règles de style de code)

### Immutabilité (CRITIQUE)

**Toujours créer de nouveaux objets, ne jamais modifier les objets existants** :

**❌ Mauvaise pratique** : modification directe de l'objet

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION !
  return user
}
```

**✅ Bonne pratique** : créer un nouvel objet

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### Organisation des fichiers

**Plusieurs petits fichiers > moins de grands fichiers** :

- **Haute cohésion, faible couplage**
- **Typiquement 200-400 lignes, maximum 800 lignes**
- Extraire les fonctions utilitaires des grands composants
- Organiser par fonction/domaine, pas par type

### Gestion des erreurs

**Toujours gérer complètement les erreurs** :

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### Validation des entrées

**Toujours valider les entrées utilisateur** :

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### Liste de contrôle de qualité du code

Avant de marquer le travail comme terminé, vous devez confirmer :

- [ ] Le code est lisible et la dénomination est claire
- [ ] Les fonctions sont petites (< 50 lignes)
- [ ] Les fichiers sont focalisés (< 800 lignes)
- [ ] Aucun imbrication profonde (> 4 niveaux)
- [ ] Gestion correcte des erreurs
- [ ] Aucune instruction console.log
- [ ] Aucune valeur codée en dur
- [ ] Aucune modification directe (utiliser des modèles immuables)

---

## 3. Testing (Règles de tests)

### Couverture minimale de tests : 80%

**Doit inclure tous les types de tests** :

1. **Tests unitaires** - Fonctions indépendantes, fonctions utilitaires, composants
2. **Tests d'intégration** - Extrémités API, opérations de base de données
3. **Tests E2E** - Flux utilisateur critiques (Playwright)

### Développement piloté par les tests (TDD)

**Flux de travail obligatoire** :

1. Écrire les tests en premier (RED)
2. Exécuter les tests - devrait échouer
3. Écrire l'implémentation minimale (GREEN)
4. Exécuter les tests - devrait réussir
5. Refactoriser (IMPROVE)
6. Vérifier la couverture (80%+)

### Dépannage des tests

1. Utiliser l'agent **tdd-guide**
2. Vérifier l'isolation des tests
3. Vérifier que les mocks sont corrects
4. Corriger l'implémentation, pas les tests (sauf si le test lui-même est erroné)

### Support Agent

- **tdd-guide** - Utilisé activement pour les nouvelles fonctionnalités, force l'écriture des tests en premier
- **e2e-runner** - Expert des tests E2E Playwright

::: tip Utilisation de la commande TDD

L'utilisation de la commande `/tdd` appelle automatiquement l'agent tdd-guide, vous guidant à travers le flux complet de TDD.
:::

---

## 4. Git Workflow (Règles de workflow Git)

### Format des messages de commit

```
<type>: <description>

<optional body>
```

**Types** : feat, fix, refactor, docs, test, chore, perf, ci

::: info Messages de commit

L'attribution dans les messages de commit a été désactivée globalement via `~/.claude/settings.json`.
:::

### Workflow Pull Request

Lors de la création d'un PR :

1. Analyser l'historique complet des commits (pas seulement le dernier commit)
2. Utiliser `git diff [base-branch]...HEAD` pour voir toutes les modifications
3. Rédiger un résumé complet du PR
4. Inclure le plan de tests et les TODOs
5. S'il s'agit d'une nouvelle branche, pousser avec le drapeau `-u`

### Workflow d'implémentation de fonctionnalité

#### 1. Planification en premier

- Utiliser l'agent **planner** pour créer un plan d'implémentation
- Identifier les dépendances et les risques
- Décomposer en plusieurs phases

#### 2. Méthode TDD

- Utiliser l'agent **tdd-guide**
- Écrire les tests en premier (RED)
- Implémenter pour réussir les tests (GREEN)
- Refactoriser (IMPROVE)
- Vérifier 80%+ de couverture

#### 3. Revue de code

- Utiliser immédiatement l'agent **code-reviewer** après avoir écrit le code
- Corriger les problèmes CRITICAL et HIGH
- Corriger les problèmes MEDIUM dans la mesure du possible

#### 4. Commit et push

- Messages de commit détaillés
- Suivre le format conventional commits

---

## 5. Agents (Règles des Agents)

### Agents disponibles

Situés dans `~/.claude/agents/` :

| Agent | Usage | Quand utiliser |
|--- | --- | --- |
| planner | Planification d'implémentation | Fonctionnalités complexes, refactoring |
| architect | Conception système | Décisions d'architecture |
| tdd-guide | Développement piloté par les tests | Nouvelles fonctionnalités, corrections de bugs |
| code-reviewer | Revue de code | Après avoir écrit le code |
| security-reviewer | Analyse de sécurité | Avant de committer |
| build-error-resolver | Correction des erreurs de build | Lorsque le build échoue |
| e2e-runner | Tests E2E | Flux utilisateur critiques |
| refactor-cleaner | Nettoyage du code mort | Maintenance du code |
| doc-updater | Mise à jour de la documentation | Mise à jour de la documentation |

### Utiliser immédiatement les Agents

**Sans invite utilisateur** :

1. Demande de fonctionnalité complexe - utiliser l'agent **planner**
2. Code nouvellement écrit/modifié - utiliser l'agent **code-reviewer**
3. Correction de bug ou nouvelle fonctionnalité - utiliser l'agent **tdd-guide**
4. Décision d'architecture - utiliser l'agent **architect**

### Exécution parallèle de tâches

**Toujours utiliser l'exécution parallèle de tâches pour les opérations indépendantes** :

| Méthode | Description |
|--- | ---|
| ✅ Bon : exécution parallèle | Lancer 3 agents en parallèle : Agent 1 (analyse de sécurité de auth.ts), Agent 2 (examen de performance du système de cache), Agent 3 (vérification de type de utils.ts) |
| ❌ Mauvais : exécution séquentielle | Exécuter d'abord l'agent 1, puis l'agent 2, puis l'agent 3 |

### Analyse multi-perspective

Pour des problèmes complexes, utilisez des sous-agents avec des rôles :

- Examinateur de faits
- Ingénieur senior
- Expert en sécurité
- Examinateur de cohérence
- Vérificateur de redondance

---

## 6. Performance (Règles d'optimisation des performances)

### Stratégie de sélection de modèle

**Haiku 4.5** (90% des capacités de Sonnet, 3 fois moins cher) :

- Agents légers, appels fréquents
- Programmation en binôme et génération de code
- Agents de travail dans des systèmes multi-agents

**Sonnet 4.5** (meilleur modèle de codage) :

- Travail de développement principal
- Coordination de workflows multi-agents
- Tâches de codage complexes

**Opus 4.5** (raisonnement le plus profond) :

- Décisions d'architecture complexes
- Besoin maximal de raisonnement
- Tâches de recherche et d'analyse

### Gestion de la fenêtre de contexte

**Éviter d'utiliser les 20% derniers de la fenêtre de contexte** :

- Refactoring à grande échelle
- Implémentation de fonctionnalités sur plusieurs fichiers
- Débogage d'interactions complexes

**Tâches à faible sensibilité au contexte** :

- Édition de fichiers uniques
- Création d'outils indépendants
- Mise à jour de la documentation
- Corrections de bugs simples

### Ultrathink + Plan Mode

Pour des tâches complexes nécessitant un raisonnement profond :

1. Utiliser `ultrathink` pour une réflexion améliorée
2. Activer le **Plan Mode** pour une approche structurée
3. "Redémarrer le moteur" pour plusieurs tours de critique
4. Utiliser des sous-agents avec des rôles pour une analyse diversifiée

### Dépannage de build

Si le build échoue :

1. Utiliser l'agent **build-error-resolver**
2. Analyser les messages d'erreur
3. Corriger progressivement
4. Vérifier après chaque correction

---

## 7. Patterns (Règles des modèles courants)

### Format de réponse API

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### Modèles de Hooks personnalisés

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Modèle de Repository

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### Projets squelettes

Lors de l'implémentation de nouvelles fonctionnalités :

1. Rechercher des projets squelettes éprouvés
2. Utiliser des agents parallèles pour évaluer les options :
   - Évaluation de sécurité
   - Analyse de scalabilité
   - Score de pertinence
   - Planification de l'implémentation
3. Cloner la meilleure correspondance comme base
4. Itérer dans une structure vérifiée

---

## 8. Hooks (Règles du système de Hooks)

### Types de Hooks

- **PreToolUse** : Avant l'exécution de l'outil (vérification, modification de paramètres)
- **PostToolUse** : Après l'exécution de l'outil (formatage automatique, vérification)
- **Stop** : À la fin de la session (vérification finale)

### Hooks actuels (dans ~/.claude/settings.json)

#### PreToolUse

- **Rappel tmux** : suggère d'utiliser tmux pour les commandes de longue durée (npm, pnpm, yarn, cargo, etc.)
- **Examen git push** : ouvrir l'examen dans Zed avant de pousser
- **Bloqueur de documentation** : empêche la création de fichiers .md/.txt inutiles

#### PostToolUse

- **Création de PR** : enregistre l'URL du PR et l'état de GitHub Actions
- **Prettier** : formate automatiquement les fichiers JS/TS après édition
- **Vérification TypeScript** : exécute tsc après édition des fichiers .ts/.tsx
- **Avertissement console.log** : avertit des console.log dans les fichiers modifiés

#### Stop

- **Audit console.log** : vérifie les console.log dans tous les fichiers modifiés avant la fin de la session

### Acceptation automatique des autorisations

**Utiliser avec prudence** :

- Activer pour des plans de confiance bien définis
- Désactiver pour le travail d'exploration
- Ne jamais utiliser le drapeau dangerously-skip-permissions
- Configurer plutôt `allowedTools` dans `~/.claude.json`

### Meilleures pratiques TodoWrite

Utilisez l'outil TodoWrite pour :

- Suivre la progression des tâches à plusieurs étapes
- Vérifier la compréhension des instructions
- Activer le guidage en temps réel
- Afficher des étapes d'implémentation granulaires

Les listes de Todo révèlent :

- Des étapes dans le mauvais ordre
- Des éléments manquants
- Des éléments supplémentaires inutiles
- Une granularité incorrecte
- Des exigences mal comprises

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Référence complète des Skills](../skills-reference/)**.
>
> Vous apprendrez :
> - Référence complète des 11 bibliothèques de compétences
> - Compétences en normes de codage, modèles backend/frontend, apprentissage continu, etc.
> - Comment choisir la compétence appropriée pour différentes tâches

---

## Résumé du cours

Les 8 ensembles de règles d'Everything Claude Code fournissent des directives complètes pour le processus de développement :

1. **Security** - Prévenir les failles de sécurité et les fuites de données sensibles
2. **Coding Style** - Garantir un code lisible, immuable et de petite taille
3. **Testing** - Imposer 80%+ de couverture et le flux TDD
4. **Git Workflow** - Standardiser les commits et le flux PR
5. **Agents** - Guider l'utilisation correcte des 9 sous-agents spécialisés
6. **Performance** - Optimiser l'utilisation des tokens et la gestion du contexte
7. **Patterns** - Fournir des modèles de conception courants et les meilleures pratiques
8. **Hooks** - Expliquer le fonctionnement du système de hooks automatisés

Rappelez-vous, ces règles ne sont pas des contraintes, mais des directives pour vous aider à écrire un code de haute qualité, sécurisé et maintenable. Utiliser les Agents correspondants (comme code-reviewer, security-reviewer) peut vous aider à respecter automatiquement ces règles.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-25

| Fonction | Chemin du fichier | Numéro de ligne |
|--- | --- | ---|
| Règles Security | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Règles Coding Style | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Règles Testing | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Règles Git Workflow | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Règles Agents | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Règles Performance | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Règles Patterns | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Règles Hooks | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |

**Règles clés** :
- **Security** : Aucun secret codé en dur, vérifications OWASP Top 10
- **Coding Style** : Modèles immuables, fichiers < 800 lignes, fonctions < 50 lignes
- **Testing** : 80%+ de couverture de tests, flux TDD obligatoire
- **Performance** : Stratégie de sélection de modèle, gestion de la fenêtre de contexte

**Agents associés** :
- **security-reviewer** : Détection des failles de sécurité
- **code-reviewer** : Examen de la qualité et du style du code
- **tdd-guide** : Guide du flux TDD
- **planner** : Planification de l'implémentation

</details>
