---
title: "Commands : 15 commandes slash | Everything Claude Code"
subtitle: "Commands : 15 commandes slash | Everything Claude Code"
sidebarTitle: "Maîtriser le développement avec 15 commandes"
description: "Apprenez les 15 commandes slash d'Everything Claude Code. Maîtrisez l'utilisation des commandes essentielles comme /plan, /tdd, /code-review, /e2e, /verify pour améliorer votre efficacité de développement."
tags:
  - "commands"
  - "slash-commands"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# Guide complet des Commands : les 15 commandes slash expliquées

## Ce que vous saurez faire

- Démarrer rapidement un flux de développement TDD pour produire du code de haute qualité
- Créer des plans d'implémentation systématiques pour ne manquer aucune étape clé
- Exécuter des revues de code complètes et des audits de sécurité
- Générer des tests end-to-end pour valider les parcours utilisateurs critiques
- Corriger automatiquement les erreurs de build et gagner du temps de débogage
- Nettoyer le code mort en toute sécurité pour maintenir une base de code légère
- Extraire et réutiliser des patterns de problèmes déjà résolus
- Gérer l'état du travail et les checkpoints
- Exécuter une validation complète pour s'assurer que le code est prêt

## Vos difficultés actuelles

Vous rencontrez peut-être ces problèmes pendant le développement :

- **Ne pas savoir par où commencer** — Face à une nouvelle exigence, comment décomposer les étapes d'implémentation ?
- **Faible couverture de tests** — Beaucoup de code écrit, mais pas assez de tests, qualité difficile à garantir
- **Accumulation d'erreurs de build** — Après modification du code, les erreurs de type s'enchaînent, sans savoir par où commencer
- **Revue de code non systématique** — La revue visuelle laisse facilement passer des problèmes de sécurité
- **Résoudre les mêmes problèmes encore et encore** — Les pièges déjà rencontrés se reproduisent

Les 15 commandes slash d'Everything Claude Code sont conçues pour résoudre ces points de douleur.

## Concept fondamental

**Les commandes sont les points d'entrée des workflows**. Chaque commande encapsule un flux de développement complet, appelant les agents ou skills correspondants pour accomplir une tâche spécifique.

::: tip Commande vs Agent vs Skill

- **Commande** : Le raccourci que vous tapez directement dans Claude Code (comme `/tdd`, `/plan`)
- **Agent** : Le sous-agent spécialisé appelé par la commande, responsable de l'exécution concrète
- **Skill** : Les définitions de workflow et connaissances métier que l'agent peut référencer

Une commande appelle généralement un ou plusieurs agents, et les agents peuvent référencer des skills associés.

:::

## Vue d'ensemble des commandes

Les 15 commandes classées par fonction :

| Catégorie | Commande | Usage |
| --- | --- | --- |
| **Flux de développement** | `/plan` | Créer un plan d'implémentation |
| | `/tdd` | Exécuter le développement piloté par les tests |
| | `/orchestrate` | Exécuter plusieurs agents en séquence |
| **Qualité du code** | `/code-review` | Revue de code |
| | `/build-fix` | Corriger les erreurs de build |
| | `/refactor-clean` | Nettoyer le code mort |
| | `/verify` | Validation complète |
| **Tests** | `/e2e` | Tests end-to-end |
| | `/test-coverage` | Analyser la couverture de tests |
| | `/eval` | Gérer le développement piloté par les evals |
| **Documentation & Architecture** | `/update-docs` | Synchroniser la documentation |
| | `/update-codemaps` | Mettre à jour la documentation d'architecture |
| **Gestion d'état** | `/checkpoint` | Sauvegarder l'état du travail |
| **Apprentissage & Optimisation** | `/learn` | Extraire des patterns réutilisables |
| **Configuration** | `/setup-pm` | Configurer le gestionnaire de paquets |

## Commandes de flux de développement

### /plan : Planifier des fonctionnalités complexes

**Usage** : Créer un plan d'implémentation détaillé avant de commencer à coder.

**Cas d'utilisation** :
- Démarrer le développement d'une nouvelle fonctionnalité
- Effectuer des changements architecturaux majeurs
- Quand les exigences sont floues ou ambiguës
- Modifications coordonnées sur plusieurs fichiers/composants

**Workflow** :

```
1. Reformuler les exigences
   ↓
2. Identifier les risques et dépendances
   ↓
3. Décomposer en phases concrètes
   ↓
4. Attendre votre confirmation
```

::: warning Caractéristique clé

L'agent planner **n'écrit aucun code** tant que vous n'avez pas explicitement confirmé le plan.

:::

**Exemple** :

```
Vous : /plan J'ai besoin d'ajouter une fonctionnalité de notifications en temps réel

Claude :
# Plan d'implémentation : Notifications de résolution de marché en temps réel

## Reformulation des exigences
- Envoyer des notifications quand les marchés se résolvent
- Supporter plusieurs canaux (in-app, email, webhook)
- Assurer une livraison fiable
- Inclure le résultat du marché et le résultat de la position de l'utilisateur

## Phases d'implémentation
### Phase 1 : Schéma de base de données
- Ajouter la table notifications
- Ajouter la table user_notification_preferences
- Créer les index

### Phase 2 : Service de notification
- Créer une file de notifications avec BullMQ/Redis
- Implémenter la logique de retry
- Créer les templates de notification

...

EN ATTENTE DE CONFIRMATION : Procéder avec ce plan ? (oui/non/modifier)
```

**Bonnes pratiques** :
- ✅ Planifier avant d'implémenter pour les fonctionnalités complexes
- ✅ Vérifier attentivement les risques et dépendances
- ✅ Exécuter par phases, valider chaque phase
- ❌ Ne pas sauter la planification

---

### /tdd : Développement piloté par les tests

**Usage** : Forcer l'exécution du flux TDD, assurer une couverture de tests ≥ 80%.

**Cas d'utilisation** :
- Implémenter une nouvelle fonctionnalité
- Corriger un bug (d'abord écrire un test qui reproduit le bug)
- Refactoriser du code existant
- Écrire la logique métier critique

**Cycle TDD** :

```
RED → GREEN → REFACTOR → REPEAT

RED:      Écrire un test qui échoue
GREEN:    Écrire le minimum de code pour faire passer le test
REFACTOR: Améliorer le code, garder les tests passants
REPEAT:   Prochaine fonctionnalité/scénario
```

::: warning Exigence stricte

**Vous devez d'abord écrire le test, puis le code**. Impossible de sauter la phase RED.

:::

**Exemple** :

```
Vous : /tdd J'ai besoin d'une fonction pour calculer le score de liquidité d'un marché

Claude (agent tdd-guide) :
## Étape 1 : Définir l'interface (SCAFFOLD)
```typescript
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}
```

## Étape 2 : Écrire le test qui échoue (RED)
```typescript
test('should return high score for liquid market', () => {
  const market = { ... }
  expect(calculateLiquidityScore(market)).toBeGreaterThan(80)
})
```

## Étape 3 : Exécuter les tests - Vérifier l'ÉCHEC
```bash
npm test lib/liquidity.test.ts
FAIL ✕ should return high score for liquid market
  Error: Not implemented
```

## Étape 4 : Implémenter le code minimal (GREEN)
```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Code d'implémentation...
}
```

## Étape 5 : Exécuter les tests - Vérifier le SUCCÈS
```bash
npm test lib/liquidity.test.ts
PASS ✓ should return high score for liquid market
```

## Étape 6 : Refactoriser (IMPROVE)
// Améliorer la structure du code...

## Étape 7 : Vérifier que les tests passent toujours
```bash
npm test lib/liquidity.test.ts
PASS ✓ all tests passing
```

## Étape 8 : Vérifier la couverture
Coverage: 100% ✅ (Objectif : 80%)
```

**Bonnes pratiques** :
- ✅ D'abord définir l'interface
- ✅ Implémenter après l'échec du test
- ✅ Tester immédiatement après chaque fonctionnalité
- ✅ Valider les tests avant et après le refactoring
- ✅ Couverture ≥ 80% (100% pour le code critique)
- ❌ Ne pas écrire trop de code avant de tester
- ❌ Ne pas sauter la phase RED
- ❌ Ne pas tester les détails d'implémentation

---

### /orchestrate : Exécuter des agents en séquence

**Usage** : Automatiser l'exécution de workflows séquentiels avec plusieurs agents.

**Cas d'utilisation** :
- Développement complet de fonctionnalité (planner → tdd-guide → code-reviewer → security-reviewer)
- Flux de correction de bug (explorer → tdd-guide → code-reviewer)
- Audit de sécurité (security-reviewer → code-reviewer → architect)

**Types de workflow** :

| Type de workflow | Séquence d'agents |
| --- | --- |
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**Exemple** :

```
Vous : /orchestrate feature "Ajouter une fonctionnalité d'authentification utilisateur"

Claude :
### RAPPORT D'ORCHESTRATION
Workflow : feature
Tâche : Ajouter une fonctionnalité d'authentification utilisateur
Agents : planner → tdd-guide → code-reviewer → security-reviewer

RÉSUMÉ
-------
Fonctionnalité d'authentification utilisateur implémentée avec succès, incluant inscription, connexion, gestion de session.

SORTIES DES AGENTS
------------------
Planner : Plan d'implémentation en 4 phases créé
TDD Guide : Service d'authentification implémenté, couverture 95%
Code Reviewer : 3 problèmes haute priorité trouvés, corrigés
Security Reviewer : Audit de sécurité passé, aucune vulnérabilité

FICHIERS MODIFIÉS
-----------------
- src/services/auth.ts
- src/api/auth/route.ts
- tests/auth.test.ts
- ...

RÉSULTATS DES TESTS
-------------------
PASS : 24/24 tests (100%)

STATUT SÉCURITÉ
---------------
✅ Aucune vulnérabilité trouvée

RECOMMANDATION
--------------
✅ SHIP - Prêt pour la production
```

**Bonnes pratiques** :
- ✅ Utiliser orchestrate pour les fonctionnalités complexes
- ✅ Documentation claire entre chaque agent
- ✅ Exécuter les vérifications indépendantes en parallèle (code-reviewer et security-reviewer)
- ❌ Ne pas utiliser orchestrate pour les tâches simples

---

## Commandes de qualité du code

### /code-review : Revue de code

**Usage** : Revue complète du code non commité, vérification des problèmes de sécurité et de qualité.

**Cas d'utilisation** :
- Avant de commiter le code
- Avant de merger une PR
- Après avoir terminé le développement d'une fonctionnalité

**Points de vérification** :

| Catégorie | Contenu vérifié | Sévérité |
| --- | --- | --- |
| **Sécurité** | Clés codées en dur, injection SQL, XSS, validation d'entrée manquante | CRITICAL |
| **Qualité du code** | Fonction > 50 lignes, fichier > 800 lignes, profondeur d'imbrication > 4 | HIGH |
| **Bonnes pratiques** | Patterns de mutation, console.log, tests manquants, TODO/FIXME | MEDIUM |

**Exemple** :

```
Vous : /code-review

Claude (agent code-reviewer) :
# Rapport de revue de code

## Problèmes de sécurité (CRITICAL)
🔴 [HIGH] Clé API codée en dur
Fichier : src/api/github.ts:15
Problème : Token GitHub codé en dur
Correction : Déplacer vers une variable d'environnement

## Qualité du code (HIGH)
🟡 [MEDIUM] Fonction dépassant 50 lignes
Fichier : src/utils/formatter.ts:62
Lignes : 78
Problème : La fonction FormatLargeData est trop longue
Correction : Diviser en fonctions plus petites

## Bonnes pratiques (MEDIUM)
🟢 [LOW] Commentaire TODO
Fichier : src/services/user.ts:45
Problème : TODO: Add rate limiting
Correction : Implémenter ou supprimer le commentaire

RÉSUMÉ
------
CRITICAL : 1 (À corriger avant le commit)
HIGH : 2 (Devrait être corrigé)
MEDIUM : 3 (Souhaitable)

❌ BLOQUÉ - Problèmes de sécurité critiques trouvés
```

::: danger Règle de blocage du commit

Si des problèmes de niveau **CRITICAL** ou **HIGH** sont trouvés, le commit est bloqué.

:::

---

### /build-fix : Corriger les erreurs de build

**Usage** : Corriger les erreurs TypeScript et de build une par une.

**Cas d'utilisation** :
- Échec de `npm run build`
- Erreurs de type TypeScript
- Erreurs de compilation

**Workflow** :

```
1. Exécuter le build
   ↓
2. Parser la sortie d'erreur, trier par sévérité
   ↓
3. Corriger une par une :
   - Afficher le contexte de l'erreur
   - Expliquer le problème
   - Proposer une correction
   - Appliquer la correction
   - Relancer le build
   ↓
4. Générer un résumé des corrections
```

**Exemple** :

```
Vous : /build-fix

Claude (agent build-error-resolver) :
# Correction des erreurs de build

Exécution du build : npm run build
5 erreurs trouvées

## Erreur 1 : Type 'string' is not assignable to type 'number'
Fichier : src/calculator.ts:15
```typescript
const result = add("10", "20")  // Erreur
```
Problème : La fonction add attend des nombres, a reçu des chaînes
Correction : Convertir en nombres
```typescript
const result = add(Number("10"), Number("20"))
```
✅ Corrigé. Relance du build...

## Erreur 2 : Cannot find module './utils'
Fichier : src/index.ts:3
Problème : Le chemin d'import est incorrect
Correction : Changer en './utils/helper'
```typescript
import { helper } from './utils/helper'
```
✅ Corrigé. Relance du build...

...

RÉSUMÉ
------
Erreurs corrigées : 5
Erreurs restantes : 0
Statut du build : ✅ PASS
```

::: tip La sécurité d'abord

Corriger une seule erreur à la fois pour éviter d'introduire de nouveaux problèmes.

:::

---

### /refactor-clean : Nettoyer le code mort

**Usage** : Identifier et supprimer en toute sécurité le code inutilisé.

**Cas d'utilisation** :
- La base de code contient beaucoup de fichiers et exports inutilisés
- Réduire la charge de maintenance
- Améliorer la lisibilité du code

**Workflow** :

```
1. Exécuter les outils d'analyse de code mort
   - knip : Trouver les exports et fichiers inutilisés
   - depcheck : Trouver les dépendances inutilisées
   - ts-prune : Trouver les exports TypeScript inutilisés
   ↓
2. Générer un rapport consolidé
   ↓
3. Classifier par sévérité
   - SAFE : Fichiers de test, fonctions utilitaires inutilisées
   - CAUTION : Routes API, composants
   - DANGER : Fichiers de configuration, points d'entrée
   ↓
4. Supprimer un par un (tester d'abord)
   ↓
5. Générer un résumé du nettoyage
```

**Exemple** :

```
Vous : /refactor-clean

Claude (agent refactor-cleaner) :
# Analyse du code mort

## Outils exécutés
- ✅ knip : 12 exports inutilisés trouvés
- ✅ depcheck : 5 dépendances inutilisées trouvées
- ✅ ts-prune : 8 exports TypeScript inutilisés trouvés

## Classification

### SAFE (Peut être supprimé)
- `src/utils/old-helper.ts` - Fonction utilitaire inutilisée
- `src/components/Button.tsx` - Non utilisé nulle part
- `lodash` - Dépendance inutilisée

### CAUTION (À examiner d'abord)
- `src/api/users.ts` - Utilisé uniquement dans les tests
- `@types/node` - Peut être utilisé dans les scripts de build

### DANGER (Ne pas supprimer)
- `src/index.ts` - Point d'entrée principal
- `tsconfig.json` - Fichier de configuration

## Plan de suppression

Exécution de la suite de tests complète d'abord :
✅ Tests passés (98% de couverture)

Suppression des éléments SAFE...

1. Suppression de src/utils/old-helper.ts
   ✅ Tests toujours passés

2. Suppression de src/components/Button.tsx
   ✅ Tests toujours passés

3. Suppression de lodash de package.json
   ✅ Tests toujours passés

RÉSUMÉ
------
Fichiers supprimés : 12
Dépendances supprimées : 5
Tests toujours passés : ✅
```

::: warning Les tests d'abord

**Exécuter les tests avant de supprimer du code** pour s'assurer de ne pas casser les fonctionnalités existantes.

:::

---

### /verify : Validation complète

**Usage** : Exécuter une validation complète du code.

**Cas d'utilisation** :
- Avant de commiter le code
- Avant de merger une PR
- Avant une release

**Points de vérification** (dans l'ordre) :

1. **Vérification du build** - Exécuter la commande de build
2. **Vérification des types** - Exécuter le vérificateur TypeScript
3. **Vérification du lint** - Exécuter le linter
4. **Suite de tests** - Exécuter tous les tests, rapporter la couverture
5. **Audit console.log** - Rechercher les console.log dans les fichiers source
6. **Statut Git** - Afficher les changements non commités

**Exemple** :

```
Vous : /verify pre-pr

Claude :
# Rapport de validation

VALIDATION : ✅ PASS

Build :    ✅ OK
Types :    ✅ OK (0 erreurs)
Lint :     ✅ OK (0 problèmes)
Tests :    ✅ 142/145 passés, 98% de couverture
Secrets :  ✅ OK (0 trouvés)
Logs :     ⚠️ 3 console.logs trouvés

Emplacements des console.log :
- src/utils/logger.ts:15 (logger intentionnel)
- src/api/webhook.ts:42 (debug, à supprimer avant commit)
- src/services/auth.ts:89 (debug, à supprimer avant commit)

Prêt pour PR : ⚠️ OUI (supprimer les logs de debug)

Fichiers modifiés depuis le dernier commit :
- src/api/webhook.ts (nouveau)
- src/services/auth.ts (modifié)
- tests/auth.test.ts (modifié)
```

**Paramètres** :
- `quick` - Build + vérification des types uniquement
- `full` - Toutes les vérifications (par défaut)
- `pre-commit` - Vérifications liées au commit
- `pre-pr` - Validation complète + scan de sécurité

---

## Commandes de test

### /e2e : Tests end-to-end

**Usage** : Générer et exécuter des tests end-to-end avec Playwright.

**Cas d'utilisation** :
- Tester les parcours utilisateurs critiques (connexion, transaction, paiement)
- Valider l'intégration end-to-end des flux multi-étapes
- Tester les interactions UI et la navigation
- Préparer le déploiement en production

**Workflow** :

```
1. Analyser le parcours utilisateur, identifier les scénarios de test
   ↓
2. Générer les tests Playwright (utilisant le pattern Page Object)
   ↓
3. Exécuter les tests sur plusieurs navigateurs (Chrome, Firefox, Safari)
   ↓
4. Capturer screenshots, vidéos, traces en cas d'échec
   ↓
5. Générer un rapport avec résultats et artefacts
   ↓
6. Identifier les tests instables et suggérer des corrections
```

**Exemple** :

```
Vous : /e2e Tester le flux de recherche et visualisation de marché

Claude (agent e2e-runner) :
# Génération de test E2E : Flux de recherche et visualisation de marché

## Scénario de test identifié
**Parcours utilisateur :** Recherche de marché → Voir les résultats → Cliquer sur un marché → Voir les détails

## Code de test généré
```typescript
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test('user can search markets and view details', async ({ page }) => {
  const marketsPage = new MarketsPage(page)
  await marketsPage.goto()

  // Effectuer la recherche
  await marketsPage.searchMarkets('election')
  await page.waitForResponse(resp =>
    resp.url().includes('/api/markets/search') && resp.status() === 200
  )

  // Vérifier les résultats
  const marketCards = marketsPage.marketCards
  await expect(marketCards.first()).toBeVisible()

  // Cliquer sur le premier résultat
  await marketCards.first().click()

  // Vérifier que la page de détails du marché se charge
  await expect(page).toHaveURL(/\/markets\/[a-z0-9-]+/)
  await expect(page.locator('[data-testid="market-name"]')).toBeVisible()
})
```

## Exécution des tests
```bash
npx playwright test tests/e2e/markets/search-and-view.spec.ts

✓ [chromium] user can search markets and view details (4.2s)
✓ [chromium] search with no results shows empty state (1.8s)

2 passed (6.0s)

Artefacts générés :
- artifacts/search-results.png
- artifacts/market-details.png
- playwright-report/index.html
```

## Rapport de test
╔══════════════════════════════════════════════════════╗
║ Statut :    ✅ TOUS LES TESTS PASSÉS                  ║
║ Total :     2 tests                                   ║
║ Passés :    2 (100%)                                  ║
║ Instables : 0                                         ║
╚══════════════════════════════════════════════════════╝
```

**Commandes rapides** :

```bash
# Exécuter tous les tests E2E
npx playwright test

# Exécuter un fichier de test spécifique
npx playwright test tests/e2e/markets/search.spec.ts

# Exécuter en mode headed (voir le navigateur)
npx playwright test --headed

# Déboguer les tests
npx playwright test --debug

# Voir le rapport
npx playwright show-report
```

**Bonnes pratiques** :
- ✅ Utiliser le Page Object Model pour améliorer la maintenabilité
- ✅ Utiliser les attributs data-testid comme sélecteurs
- ✅ Attendre les réponses API plutôt que des timeouts arbitraires
- ✅ Tester les parcours utilisateurs critiques
- ❌ Ne pas utiliser de sélecteurs fragiles (les classes CSS changent)
- ❌ Ne pas tester les détails d'implémentation

---

### /test-coverage : Analyse de la couverture de tests

**Usage** : Analyser la couverture de tests et générer les tests manquants.

**Cas d'utilisation** :
- Couverture inférieure à 80%
- Besoin de compléter les tests

**Workflow** :

```
1. Exécuter les tests avec couverture
   ↓
2. Analyser le rapport de couverture (coverage/coverage-summary.json)
   ↓
3. Identifier les fichiers en dessous du seuil de 80%
   ↓
4. Pour chaque fichier avec couverture insuffisante :
   - Analyser les chemins de code non testés
   - Générer des tests unitaires pour les fonctions
   - Générer des tests d'intégration pour les API
   ↓
5. Vérifier que les nouveaux tests passent
   ↓
6. Afficher les métriques de couverture avant/après
```

**Exemple** :

```
Vous : /test-coverage

Claude :
# Analyse de la couverture de tests

Exécution des tests avec couverture...
npm test --coverage

## Rapport de couverture

Fichier                    | % Stmts | % Branch | % Funcs | % Lines
---------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   65    |   50     |   75    |   63  ⚠️
src/api/users.ts           |   100   |   100    |   100   |   100
src/components/Button.tsx  |   45    |   30     |   50    |   44  ⚠️

Global                     |   78    |   72     |   85    |   76  ⚠️

Objectif : 80%
Actuel : 76% ❌ À améliorer

## Génération des tests manquants

### Fichier : src/utils/formatter.ts (65% de couverture)
Chemins non testés :
- FormatCurrency avec valeurs négatives
- FormatDate avec locale personnalisée
- TruncateText avec chaînes longues

Génération des tests...
```typescript
describe('formatter', () => {
  it('should format negative currency', () => {
    expect(formatCurrency(-100)).toBe('-$100.00')
  })

  it('should format date with custom locale', () => {
    expect(formatDate(new Date(), 'ja-JP')).toMatch('2024年')
  })

  it('should truncate long text', () => {
    expect(truncateText('a'.repeat(100), 10)).toBe('aaaaaaaaaa...')
  })
})
```

### Fichier : src/components/Button.tsx (45% de couverture)
Chemins non testés :
- État désactivé
- État de chargement
- Gestionnaire onClick

Génération des tests...

## Après ajout des tests

Relance des tests...

Fichier                    | % Stmts | % Branch | % Funcs | % Lines
---------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   100   |   95     |   100   |   99  ✅
src/api/users.ts           |   100   |   100    |   100   |   100
src/components/Button.tsx  |   95    |   90     |   100   |   94  ✅

Global                     |   95    |   92     |   100   |   94  ✅

Objectif : 80%
Actuel : 94% ✅ DÉPASSÉ

Résumé : +12 tests ajoutés, Couverture : 76% → 94%
```

---

### /eval : Développement piloté par les évaluations

**Usage** : Gérer le workflow de développement piloté par les evals.

**Cas d'utilisation** :
- Développement piloté par les évaluations (EDD)
- Tests d'acceptation fonctionnelle
- Tests de régression

**Sous-commandes** :

- `define <name>` - Créer une nouvelle définition d'eval
- `check <name>` - Exécuter et vérifier les evals
- `report <name>` - Générer un rapport complet
- `list` - Afficher tous les evals

**Exemple - Définir un Eval** :

```
Vous : /eval define user-auth

Claude :
Création de la définition d'eval...

.claude/evals/user-auth.md :

## EVAL : user-auth
Créé : 2026-01-25

### Evals de capacité
- [ ] L'utilisateur peut s'inscrire avec email et mot de passe
- [ ] L'utilisateur peut se connecter avec les bons identifiants
- [ ] L'utilisateur ne peut pas se connecter avec un mauvais mot de passe
- [ ] L'utilisateur peut réinitialiser son mot de passe par email

### Evals de régression
- [ ] Les utilisateurs existants peuvent toujours se connecter
- [ ] Les tokens de session fonctionnent toujours
- [ ] La connexion OAuth fonctionne toujours

### Critères de succès
- pass@3 > 90% pour les evals de capacité
- pass^3 = 100% pour les evals de régression

Veuillez remplir les critères d'évaluation spécifiques...
```

**Exemple - Vérifier un Eval** :

```
Vous : /eval check user-auth

Claude :
Exécution des evals...

VÉRIFICATION EVAL : user-auth
=============================
Capacité : 2/4 passants
Régression : 2/3 passants
Statut : EN COURS

Résultats de capacité :
✅ L'utilisateur peut s'inscrire avec email et mot de passe
✅ L'utilisateur peut se connecter avec les bons identifiants
❌ L'utilisateur ne peut pas se connecter avec un mauvais mot de passe (échec intermittent)
❌ L'utilisateur peut réinitialiser son mot de passe par email (non implémenté)

Résultats de régression :
✅ Les utilisateurs existants peuvent toujours se connecter
✅ Les tokens de session fonctionnent toujours
❌ La connexion OAuth fonctionne toujours (test échoué à cause de la limite de taux)

RECOMMANDATION : TRAVAIL NÉCESSAIRE - Corriger la validation du mot de passe et implémenter la réinitialisation
```

**Exemple - Rapport d'Eval** :

```
Vous : /eval report user-auth

Claude :
Génération du rapport complet...

RAPPORT EVAL : user-auth
========================
Généré : 2026-01-25

EVALS DE CAPACITÉ
-----------------
[register-email-pass] : PASS (pass@1)
[login-credentials-pass] : PASS (pass@2) - retry nécessaire
[login-wrong-pass-fail] : FAIL - voir notes
[password-reset-pass] : FAIL - non implémenté

EVALS DE RÉGRESSION
-------------------
[existing-users-login] : PASS
[session-tokens] : PASS
[oauth-login] : PASS

MÉTRIQUES
---------
Capacité pass@1 : 50%
Capacité pass@3 : 100%
Régression pass^3 : 100%

NOTES
-----
Le test de validation du mot de passe est instable à cause d'un problème de timing.
Besoin d'implémenter le flux de réinitialisation du mot de passe.

RECOMMANDATION
--------------
TRAVAIL NÉCESSAIRE - Compléter l'implémentation de la réinitialisation du mot de passe
```

---

## Commandes de documentation et architecture

### /update-docs : Synchroniser la documentation

**Usage** : Synchroniser la documentation depuis le code source.

**Cas d'utilisation** :
- Mettre à jour la documentation après des changements de code
- Maintenir la documentation synchronisée avec le code

**Workflow** :

```
1. Lire la section scripts de package.json
   - Générer la table de référence des scripts
   - Extraire les descriptions des commentaires
   ↓
2. Lire .env.example
   - Extraire toutes les variables d'environnement
   - Documenter l'usage et le format
   ↓
3. Générer docs/CONTRIB.md
   - Workflow de développement
   - Scripts disponibles
   - Configuration de l'environnement
   - Procédures de test
   ↓
4. Générer docs/RUNBOOK.md
   - Procédures de déploiement
   - Monitoring et alertes
   - Problèmes courants et corrections
   - Procédures de rollback
   ↓
5. Identifier la documentation obsolète
   - Trouver les docs non modifiés depuis 90+ jours
   - Lister pour revue manuelle
   ↓
6. Afficher le résumé des différences
```

::: tip Source unique de vérité

package.json et .env.example sont les sources uniques de vérité.

:::

---

### /update-codemaps : Mettre à jour la documentation d'architecture

**Usage** : Analyser la structure de la base de code et mettre à jour la documentation d'architecture.

**Cas d'utilisation** :
- Après des changements de structure du code
- Besoin de mettre à jour la documentation d'architecture

**Workflow** :

```
1. Scanner tous les fichiers source pour les imports, exports et dépendances
   ↓
2. Générer des codemaps concis :
   - codemaps/architecture.md - Architecture globale
   - codemaps/backend.md - Structure backend
   - codemaps/frontend.md - Structure frontend
   - codemaps/data.md - Modèles de données et schémas
   ↓
3. Calculer le pourcentage de différence avec la version précédente
   ↓
4. Si changement > 30%, demander l'approbation de l'utilisateur avant mise à jour
   ↓
5. Ajouter un timestamp de fraîcheur à chaque codemap
   ↓
6. Sauvegarder le rapport dans .reports/codemap-diff.txt
```

**Exemple** :

```
Vous : /update-codemaps

Claude :
Analyse de la structure de la base de code...

Scan de 156 fichiers...
89 imports et 124 exports trouvés

## Différence des Codemaps

Version précédente : 2026-01-20
Version actuelle : 2026-01-25
Différence : 12% (sous le seuil de 30%)

✅ Mise à jour sécurisée

## Codemaps mis à jour

codemaps/architecture.md
- Dépendances de modules mises à jour
- Nouveaux services ajoutés : auth, notifications
- Modules obsolètes supprimés : legacy-db

codemaps/backend.md
- Structure des routes API mise à jour
- Documentation des middlewares ajoutée

codemaps/frontend.md
- Hiérarchie des composants mise à jour
- Nouvelles pages ajoutées : profile, settings

codemaps/data.md
- Schémas de base de données mis à jour
- Nouvelles tables ajoutées : users, sessions

Résumé : 4 codemaps mis à jour, 12% de changement
```

---

## Commandes de gestion d'état

### /checkpoint : Sauvegarder l'état du travail

**Usage** : Créer ou vérifier des checkpoints dans le workflow.

**Cas d'utilisation** :
- Sauvegarder des étapes de développement importantes
- Supporter le rollback et le suivi de progression

**Sous-commandes** :

- `create <name>` - Créer un checkpoint nommé
- `verify <name>` - Vérifier un checkpoint
- `list` - Afficher tous les checkpoints
- `clear` - Supprimer les anciens checkpoints (garder les 5 derniers)

**Exemple** :

```
Vous : /checkpoint create feature-start

Claude :
# Création du checkpoint : feature-start

Exécution de /verify quick...

Build : ✅ OK
Types : ✅ OK

Création du checkpoint...

✅ Checkpoint "feature-start" créé
├─ Timestamp : 2026-01-25-14:30
├─ Git SHA : abc1234
└─ Statut : Clean (pas de changements non commités)
```

```
Vous : /checkpoint verify feature-start

Claude :
COMPARAISON DE CHECKPOINT : feature-start
=========================================
Fichiers modifiés : 5
Tests : +3 passés / -0 échoués
Couverture : +5% / -0%
Build : PASS

Changements depuis le checkpoint :
✅ src/services/auth.ts (modifié)
✅ tests/auth.test.ts (ajouté)
✅ src/components/Login.tsx (ajouté)
```

**Workflow** :

```
[Début] → /checkpoint create "feature-start"
   |
[Implémentation] → /checkpoint create "core-done"
   |
[Tests] → /checkpoint verify "core-done"
   |
[Refactoring] → /checkpoint create "refactor-done"
   |
[PR] → /checkpoint verify "feature-start"
```

---

## Commandes d'apprentissage et d'optimisation

### /learn : Extraire des patterns réutilisables

**Usage** : Analyser la session actuelle et extraire des patterns pouvant être sauvegardés comme skills.

**Cas d'utilisation** :
- Après avoir résolu un problème non trivial
- Découverte d'un pattern de résolution d'erreur réutilisable
- Documentation de conventions spécifiques au projet

**Contenu extrait** :

1. **Patterns de résolution d'erreurs**
   - Quelle erreur s'est produite ?
   - Quelle était la cause racine ?
   - Comment a-t-elle été corrigée ?
   - Est-ce réutilisable pour des erreurs similaires ?

2. **Techniques de débogage**
   - Étapes de débogage non évidentes
   - Combinaisons d'outils efficaces
   - Patterns de diagnostic

3. **Workarounds**
   - Quirks des bibliothèques
   - Limitations d'API
   - Corrections spécifiques à une version

4. **Patterns spécifiques au projet**
   - Conventions de la base de code découvertes
   - Décisions architecturales prises
   - Patterns d'intégration

**Exemple** :

```
Vous : /learn

Claude :
# Extraction des patterns de la session

Revue de l'historique de session...

3 patterns extractibles trouvés :

## Pattern 1 : Récupération de session Supabase Auth
**Type :** Résolution d'erreur
**Réutilisabilité :** Élevée (affecte tous les endpoints d'auth)

### Problème
Après la connexion de l'utilisateur, les appels API suivants échouent avec 401 Unauthorized.

### Cause racine
Le cookie de session Supabase n'est pas envoyé à l'API backend à cause de la configuration CORS.

### Solution
```typescript
// Configurer Supabase avec l'URL correcte
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storageKey: 'my-app-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
```

### Quand utiliser
Déclencheur : Endpoints d'auth retournant 401 de manière inattendue

---

## Pattern 2 : Correction de l'instabilité des tests Playwright
**Type :** Technique de débogage
**Réutilisabilité :** Moyenne (affecte les tests UI asynchrones)

### Problème
Le test "user can click submit button" échoue de manière intermittente avec timeout.

### Cause racine
Le bouton est initialement désactivé à cause de la validation asynchrone, mais le test n'attend pas.

### Solution
```typescript
// Utiliser une attente explicite avec prédicat
await page.waitForSelector('[data-testid="submit-btn"]:not(:disabled)', {
  timeout: 10000
})

// Puis cliquer
await page.locator('[data-testid="submit-btn"]').click()
```

### Quand utiliser
Déclencheur : Problèmes de timing des tests avec état UI asynchrone

---

Voulez-vous sauvegarder ces patterns ? (oui/non/modifier)
```

::: tip Principe de focus

Extraire un pattern à la fois, garder les skills focalisés.

:::

---

## Commandes de configuration

### /setup-pm : Configurer le gestionnaire de paquets

**Usage** : Configurer le gestionnaire de paquets préféré pour le projet ou globalement.

**Cas d'utilisation** :
- Détecter le gestionnaire de paquets actuellement utilisé
- Définir une préférence globale ou par projet

**Priorité de détection** :

1. Variable d'environnement : `CLAUDE_PACKAGE_MANAGER`
2. Configuration projet : `.claude/package-manager.json`
3. package.json : champ `packageManager`
4. Fichiers lock : package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb
5. Configuration globale : `~/.claude/package-manager.json`
6. Fallback : Premier gestionnaire de paquets disponible

**Priorité des gestionnaires supportés** : pnpm > bun > yarn > npm

**Exemple** :

```bash
# Détecter le gestionnaire de paquets actuel
node scripts/setup-package-manager.js --detect

# Définir la préférence globale
node scripts/setup-package-manager.js --global pnpm

# Définir la préférence projet
node scripts/setup-package-manager.js --project bun

# Lister les gestionnaires de paquets disponibles
node scripts/setup-package-manager.js --list
```

**Fichiers de configuration** :

Configuration globale (`~/.claude/package-manager.json`) :
```json
{
  "packageManager": "pnpm"
}
```

Configuration projet (`.claude/package-manager.json`) :
```json
{
  "packageManager": "bun"
}
```

La variable d'environnement surcharge toutes les méthodes de détection :
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

---

## Workflows combinés de commandes

### Flux complet de développement de fonctionnalité

```
1. /plan "Ajouter une fonctionnalité d'authentification utilisateur"
   ↓ Créer le plan d'implémentation
2. /tdd "Implémenter le service d'authentification"
   ↓ Développement TDD
3. /test-coverage
   ↓ S'assurer que la couverture ≥ 80%
4. /code-review
   ↓ Revue de code
5. /verify pre-pr
   ↓ Validation complète
6. /checkpoint create "auth-feature-done"
   ↓ Sauvegarder le checkpoint
7. /update-docs
   ↓ Mettre à jour la documentation
8. /update-codemaps
   ↓ Mettre à jour la documentation d'architecture
```

### Flux de correction de bug

```
1. /checkpoint create "bug-start"
   ↓ Sauvegarder l'état actuel
2. /orchestrate bugfix "Corriger l'erreur de connexion"
   ↓ Flux automatisé de correction de bug
3. /test-coverage
   ↓ S'assurer de la couverture de tests
4. /verify quick
   ↓ Vérifier la correction
5. /checkpoint verify "bug-start"
   ↓ Comparer avec le checkpoint
```

### Flux d'audit de sécurité

```
1. /orchestrate security "Auditer le flux de paiement"
   ↓ Flux de revue orienté sécurité
2. /e2e "Tester le flux de paiement"
   ↓ Tests end-to-end
3. /code-review
   ↓ Revue de code
4. /verify pre-pr
   ↓ Validation complète
```

---

## Tableau de référence rapide des commandes

| Commande | Usage principal | Agent déclenché | Sortie |
| --- | --- | --- | --- |
| `/plan` | Créer un plan d'implémentation | planner | Plan par phases |
| `/tdd` | Développement TDD | tdd-guide | Tests + Implémentation + Couverture |
| `/orchestrate` | Exécuter des agents en séquence | Plusieurs agents | Rapport consolidé |
| `/code-review` | Revue de code | code-reviewer, security-reviewer | Rapport sécurité et qualité |
| `/build-fix` | Corriger les erreurs de build | build-error-resolver | Résumé des corrections |
| `/refactor-clean` | Nettoyer le code mort | refactor-cleaner | Résumé du nettoyage |
| `/verify` | Validation complète | Bash | Rapport de vérification |
| `/e2e` | Tests end-to-end | e2e-runner | Tests Playwright + Artefacts |
| `/test-coverage` | Analyser la couverture | Bash | Rapport de couverture + Tests manquants |
| `/eval` | Développement piloté par les evals | Bash | Rapport de statut des evals |
| `/checkpoint` | Sauvegarder l'état | Bash + Git | Rapport de checkpoint |
| `/learn` | Extraire des patterns | skill continuous-learning | Fichier Skill |
| `/update-docs` | Synchroniser la documentation | agent doc-updater | Mise à jour de la documentation |
| `/update-codemaps` | Mettre à jour l'architecture | agent doc-updater | Mise à jour des Codemaps |
| `/setup-pm` | Configurer le gestionnaire de paquets | Script Node.js | Détection du gestionnaire |

---

## Pièges à éviter

### ❌ Ne pas sauter la phase de planification

Pour les fonctionnalités complexes, commencer à coder directement entraîne :
- Oubli de dépendances importantes
- Incohérence architecturale
- Mauvaise compréhension des exigences

**✅ Bonne pratique** : Utiliser `/plan` pour créer un plan détaillé, attendre la confirmation avant d'implémenter.

---

### ❌ Ne pas sauter la phase RED en TDD

Écrire le code avant les tests, ce n'est plus du TDD.

**✅ Bonne pratique** : Exécuter strictement le cycle RED → GREEN → REFACTOR.

---

### ❌ Ne pas ignorer les problèmes CRITICAL de /code-review

Les vulnérabilités de sécurité peuvent entraîner des fuites de données, des pertes financières et d'autres conséquences graves.

**✅ Bonne pratique** : Corriger tous les problèmes de niveau CRITICAL et HIGH avant de commiter.

---

### ❌ Ne pas supprimer du code sans tester

L'analyse de code mort peut avoir des faux positifs, supprimer directement peut casser des fonctionnalités.

**✅ Bonne pratique** : Exécuter les tests avant chaque suppression pour s'assurer de ne pas casser les fonctionnalités existantes.

---

### ❌ Ne pas oublier d'utiliser /learn

Ne pas extraire de patterns après avoir résolu un problème non trivial signifie devoir résoudre le même problème depuis le début la prochaine fois.

**✅ Bonne pratique** : Utiliser régulièrement `/learn` pour extraire des patterns réutilisables et accumuler des connaissances.

---

## Résumé de la leçon

Les 15 commandes slash d'Everything Claude Code fournissent un support complet pour le workflow de développement :

- **Flux de développement** : `/plan` → `/tdd` → `/orchestrate`
- **Qualité du code** : `/code-review` → `/build-fix` → `/refactor-clean` → `/verify`
- **Tests** : `/e2e` → `/test-coverage` → `/eval`
- **Documentation & Architecture** : `/update-docs` → `/update-codemaps`
- **Gestion d'état** : `/checkpoint`
- **Apprentissage & Optimisation** : `/learn`
- **Configuration** : `/setup-pm`

Maîtriser ces commandes vous permet de travailler efficacement, en toute sécurité et avec qualité.

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons **[Guide détaillé des Agents principaux](../agents-overview/)**.
>
> Vous apprendrez :
> - Les responsabilités et cas d'utilisation des 9 agents spécialisés
> - Quand appeler quel agent
> - Comment les agents collaborent entre eux
> - Comment personnaliser la configuration des agents

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Mis à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Commande TDD | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Commande Plan | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Commande Code Review | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| Commande E2E | [`commands/e2e.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/e2e.md) | 1-364 |
| Commande Build Fix | [`commands/build-fix.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/build-fix.md) | 1-30 |
| Commande Refactor Clean | [`commands/refactor-clean.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/refactor-clean.md) | 1-29 |
| Commande Learn | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Commande Checkpoint | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Commande Verify | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Commande Test Coverage | [`commands/test-coverage.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/test-coverage.md) | 1-28 |
| Commande Setup PM | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md) | 1-81 |
| Commande Update Docs | [`commands/update-docs.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-docs.md) | 1-32 |
| Commande Orchestrate | [`commands/orchestrate.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/orchestrate.md) | 1-173 |
| Commande Update Codemaps | [`commands/update-codemaps.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-codemaps.md) | 1-18 |
| Commande Eval | [`commands/eval.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/eval.md) | 1-121 |
| Définition du plugin | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |

**Constantes clés** :
- Objectif de couverture TDD : 80% (100% pour le code critique) - `commands/tdd.md:293-300`

**Fonctions clés** :
- Cycle TDD : RED → GREEN → REFACTOR - `commands/tdd.md:40-47`
- Mécanisme d'attente de confirmation du Plan - `commands/plan.md:96`
- Niveaux de sévérité Code Review : CRITICAL, HIGH, MEDIUM - `commands/code-review.md:33`

</details>
