---
title: "Processus TDD : Red-Green-Refactor | everything-claude-code"
sidebarTitle: "Tester d'abord, coder après"
subtitle: "Processus TDD : Red-Green-Refactor"
description: "Apprenez le processus TDD d'Everything Claude Code. Maîtrisez les commandes /plan, /tdd, /code-review, /verify pour atteindre une couverture de tests de 80%+."
tags:
  - "tdd"
  - "test-driven-development"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: "70"
---

# TDD : Le cycle complet Red-Green-Refactor de /plan à /verify

## Ce que vous saurez faire à la fin

- Utiliser la commande `/plan` pour créer un plan d'implémentation systématique et éviter les oublis
- Appliquer la commande `/tdd` pour exécuter le développement piloté par les tests, en suivant le cycle RED-GREEN-REFACTOR
- Utiliser `/code-review` pour garantir la sécurité et la qualité du code
- Employer `/verify` pour valider que le code est prêt à être soumis
- Atteindre une couverture de tests de 80%+ et établir une suite de tests fiable

## Votre situation actuelle

Avez-vous rencontré ces situations lors du développement de nouvelles fonctionnalités :

- Vous réalisez après avoir écrit le code que vous avez mal compris les exigences et devez recommencer
- La couverture de tests est faible et vous trouvez des bugs après la mise en production
- Lors de la revue de code, des problèmes de sécurité sont détectés et le code est rejeté
- Après le commit, vous découvrez des erreurs de type ou un build échoué
- Vous ne savez pas quand écrire des tests et vos tests sont incomplets

Tous ces problèmes conduisent à une efficacité de développement réduite et à une qualité de code difficile à garantir.

## Quand utiliser cette approche

Scénarios d'utilisation du processus TDD :

- **Développement de nouvelles fonctionnalités** : de l'exigence à l'implémentation, garantir la complétude et les tests
- **Correction de bugs** : écrire d'abord un test pour reproduire le bug, puis le corriger, s'assurer de ne pas introduire de nouveaux problèmes
- **Refactoring de code** : avec la protection des tests, optimiser la structure du code en toute confiance
- **Implémentation de points d'API** : écrire des tests d'intégration pour vérifier la correctitude de l'interface
- **Développement de logique métier critique** : calculs financiers, authentification, etc. nécessitent une couverture de tests de 100%

::: tip Principe fondamental
Le développement piloté par les tests n'est pas simplement un processus d'écriture de tests en premier, mais une méthode systématique pour garantir la qualité du code et améliorer l'efficacité du développement. Tout nouveau code devrait être implémenté via le processus TDD.
:::

## Idée centrale

Le processus TDD se compose de 4 commandes principales formant un cycle de développement complet :

```
1. /plan     → Planification : clarifier les exigences, identifier les risques, implémentation par phases
2. /tdd      → Implémentation : tests en premier, code minimal, refactoring continu
3. /code-review → Revue : vérification de sécurité, évaluation qualité, bonnes pratiques
4. /verify   → Validation : build, types, tests, audit de code
```

**Pourquoi ce processus fonctionne** :

- **Planifier d'abord** : `/plan` garantit une compréhension correcte et évite les erreurs de direction
- **Piloter par les tests** : `/tdd` impose les tests en premier, garantit que chaque fonctionnalité est protégée par des tests
- **Revoir pour filtrer** : `/code-review` détecte les failles de sécurité et les problèmes de qualité
- **Valider pour terminer** : `/verify` garantit que le code peut être soumis en toute sécurité

## 🎒 Préparation avant de commencer

Avant de commencer le processus TDD, assurez-vous d'avoir :

- ✅ Le plugin Everything Claude Code installé
- ✅ Un framework de tests configuré dans le projet (Jest, Vitest, etc.)
- ✅ Un processus de build de base dans le projet (`npm run build`)
- ✅ Une compréhension des commandes de base décrites dans [Démarrage rapide](../../start/quickstart/)

::: warning Prérequis
Ce didacticiel suppose que vous êtes familiarisé avec les opérations de base du [Démarrage rapide](../../start/quickstart/). Si l'installation n'est pas encore effectuée, veuillez d'abord lire le [Guide d'installation](../../start/installation/).
:::

## Suivez-moi : le processus TDD complet

Apprenons l'ensemble du processus à travers un exemple concret. Supposons que vous devez implémenter une fonctionnalité de « calculateur de score de liquidité de marché ».

### Étape 1 : Utiliser /plan pour créer un plan d'implémentation

**Pourquoi**
La phase de planification garantit que vous avez compris les exigences, identifié les risques potentiels et évité les révisions ultérieures.

**Action**
Dans Claude Code, saisissez :

```
/plan Je dois implémenter un calculateur de score de liquidité de marché qui calcule un score (0-100) basé sur le volume de transactions, le spread bid-ask, le nombre de traders actifs et l'heure de la dernière transaction
```

**Ce que vous devraient voir**
L'agent planner va générer un plan d'implémentation détaillé :

```markdown
## Plan d'implémentation : Calculateur de score de liquidité de marché

## Reformulation des exigences
- Calculer un score de liquidité de marché (0-100) basé sur plusieurs indicateurs
- Un score plus élevé indique une meilleure liquidité de marché
- Prendre en compte le volume de transactions, le spread bid-ask, les traders actifs, l'heure de la dernière transaction

## Phases d'implémentation

### Phase 1 : Définir l'interface
- Créer l'interface `MarketData` pour définir les données d'entrée
- Définir la signature de la fonction `calculateLiquidityScore`

### Phase 2 : Écrire les tests
- Écrire des tests unitaires couvrant différents scénarios
- Conditions limites : volume zéro, valeurs extrêmes
- Gestion des erreurs : champs manquants, types invalides

### Phase 3 : Implémenter le calcul
- Implémenter l'algorithme de calcul
- Calcul pondéré de chaque indicateur
- Normalisation sur l'échelle 0-100

### Phase 4 : Intégration
- Intégration dans l'API existante
- Ajout d'un point d'accès pour exposer la fonctionnalité
- Documentation de la méthode d'utilisation

## Dépendances
- Aucune dépendance externe

## Risques
- MOYEN : l'algorithme de calcul pourrait nécessiter un ajustement des pondérations
- FAIBLE : gestion des conditions limites

**EN ATTENTE DE CONFIRMATION** : Procéder avec ce plan ? (oui/non/modifier)
```

**Points de contrôle ✅**
- Confirmer que la compréhension des exigences est correcte
- Confirmer que les étapes d'implémentation sont raisonnables
- Vérifier qu'aucun risque n'a été oublié

**Étape suivante**
Si le plan vous convient, répondez `oui` ou `procédez`. Si des modifications sont nécessaires, précisez les changements souhaités.

---

### Étape 2 : Utiliser /tdd pour exécuter le développement piloté par les tests

**Pourquoi**
La commande `/tdd` impose les tests en premier, garantissant que chaque fonctionnalité est protégée par des tests et évitant la douleur de rédiger des tests a posteriori.

**Action**
Après confirmation du plan, saisissez :

```
/tdd Implémenter le calculateur de score de liquidité de marché selon le plan
```

**Ce que vous devraient voir**
L'agent tdd-guide va vous guider à travers le processus TDD :

#### Phase RED : Écrire les tests d'abord

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO : Implémentation
  throw new Error('Non implémenté')
}
```

```typescript
// lib/liquidity.test.ts
import { calculateLiquidityScore } from './liquidity'

describe('calculateLiquidityScore', () => {
  it('should return high score for liquid market', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('should return low score for illiquid market', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // il y a 1 jour
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('should handle edge case: zero volume', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBe(0)
  })
})
```

```bash
npm test lib/liquidity.test.ts

## Vous devriez voir les tests échouer
FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market
    Error: Not implemented
```

✅ **Les tests échouent, comme prévu**

#### Phase GREEN : Implémenter le code minimal

```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Gestion du cas limite volume zéro
  if (market.totalVolume === 0) {
    return 0
  }

  // Calcul des scores des composantes (échelle 0-100)
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // Bonus d'activité récente
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // Moyenne pondérée
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // Contraindre à 0-100
}
```

```bash
npm test lib/liquidity.test.ts

## Vous devriez voir les tests passer
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **Tous les tests passent**

#### Phase REFACTOR : Améliorer le code

```typescript
// lib/liquidity.ts - Après refactoring
const WEIGHTS = {
  VOLUME: 0.4,
  SPREAD: 0.3,
  TRADERS: 0.2,
  RECENCY: 0.1,
} as const

const SCALE_FACTORS = {
  VOLUME: 1000,
  SPREAD: 1000,
  TRADERS: 10,
  RECENCY_PENALTY: 10,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) return 0

  const volumeScore = Math.min(market.totalVolume / SCALE_FACTORS.VOLUME, 100)
  const spreadScore = clamp(100 - (market.bidAskSpread * SCALE_FACTORS.SPREAD), 0, 100)
  const traderScore = Math.min(market.activeTraders / SCALE_FACTORS.TRADERS, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = clamp(100 - (hoursSinceLastTrade * SCALE_FACTORS.RECENCY_PENALTY), 0, 100)

  const weightedScore =
    volumeScore * WEIGHTS.VOLUME +
    spreadScore * WEIGHTS.SPREAD +
    traderScore * WEIGHTS.TRADERS +
    recencyScore * WEIGHTS.RECENCY

  return clamp(weightedScore, 0, 100)
}
```

```bash
npm test lib/liquidity.test.ts

## Vous devriez voir les tests toujours passer
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **Refactoring terminé, les tests passent toujours**

#### Vérifier la couverture

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Cible : 80%)
```

✅ **Processus TDD terminé, couverture requise atteinte**

**Points de contrôle ✅**
- Tests écrits avant le code (RED)
- Tests échoués puis implémentation (GREEN)
- Code refactorisé après passage des tests (REFACTOR)
- Couverture de tests supérieure à 80%

---

### Étape 3 : Utiliser /code-review pour réviser le code

**Pourquoi**
La revue de code permet de détecter les problèmes de sécurité, de qualité et de bonnes pratiques, garantissant que le code peut être fusionné en toute sécurité.

**Action**
Saisissez :

```
/code-review
```

**Ce que vous devraient voir**
L'agent code-reviewer va vérifier :

```markdown
## Rapport de revue de code

## Problèmes de sécurité (CRITIQUE)
- ✅ Aucun identifiant codé en dur trouvé
- ✅ Aucune vulnérabilité d'injection SQL
- ✅ Aucune vulnérabilité XSS

## Qualité du code (ÉLEVÉ)
- ✅ Fonctions de moins de 50 lignes (actuel : 8 lignes max)
- ✅ Fichiers de moins de 800 lignes (actuel : 25 lignes)
- ✅ Aucune gestion d'erreurs manquante
- ⚠️ 1 instruction console.log trouvée à lib/liquidity.ts:15
  - **Suggestion** : Supprimer ou remplacer par une journalisation appropriée

## Bonnes pratiques (MOYEN)
- ✅ Utilisation de patterns immuables
- ✅ Aucun commentaire TODO/FIXME
- ✅ Tout nouveau code possède des tests
- ✅ JSDoc pour l'API publique présent

## Résumé
- Critique : 0 problème
- Élevé : 1 problème (console.log)
- Moyen : 0 problème

**Recommandation** : Corriger le problème console.log, puis prêt pour le commit.
```

**Étape suivante**
Corrigez les problèmes selon les résultats de la revue :

```typescript
// Supprimer console.log
// console.log(`Calculated score: ${score}`)  // Supprimé
return clamp(weightedScore, 0, 100)
```

**Points de contrôle ✅**
- Corriger tous les problèmes de niveau CRITIQUE
- Corriger ou justifier les problèmes de niveau ÉLEVÉ
- Vérifier que la qualité du code est conforme aux standards

---

### Étape 4 : Utiliser /verify pour valider le code

**Pourquoi**
La commande de validation garantit que le code peut être soumis en toute sécurité, build, types et tests passent, sans problèmes résiduels.

**Action**
Saisissez :

```
/verify
```

**Ce que vous devraient voir**
Un rapport de validation complet :

```markdown
VÉRIFICATION : REUSSITE

Build:     OK
Types:     OK (0 erreurs)
Lint:      OK (0 problème)
Tests:     3/3 réussis, couverture 100%
Secrets:   OK (0 trouvé)
Logs:      OK (0 console.logs)

Prêt pour PR : OUI ✅
```

Si des problèmes surviennent, ils seront détaillés :

```markdown
VÉRIFICATION : ÉCHEC

Build:     OK
Types:     ❌ 2 erreurs
  - lib/liquidity.ts:15:25 - Le type 'string' n'est pas affectable au type 'number'
  - lib/utils.ts:8:10 - La propriété 'toFixed' n'existe pas sur le type 'unknown'
Lint:      ⚠️ 2 avertissements
  - lib/liquidity.ts:10:1 - JSDoc manquant pour la constante WEIGHTS
Tests:     ✅ 3/3 réussis, couverture 100%
Secrets:   OK
Logs:      OK

Prêt pour PR : NON ❌

Corrigez ces problèmes avant de valider.
```

**Points de contrôle ✅**
- Build réussi
- Vérification de type réussie
- Lint réussi (ou seulement des avertissements)
- Tous les tests passent
- Couverture supérieure à 80%+
- Pas de console.log
- Pas de clés codées en dur

---

### Étape 5 : Soumettre le code

**Pourquoi**
Après validation, le code est prêt à être soumis et peut être poussé vers le dépôt distant en toute confiance.

**Action**
```bash
git add lib/liquidity.ts lib/liquidity.test.ts
git commit -m "feat: add market liquidity score calculator

- Calculate 0-100 score based on volume, spread, traders, recency
- 100% test coverage with unit tests
- Edge cases handled (zero volume, illiquid markets)
- Refactored with constants and helper functions

Closes #123"
```

```bash
git push origin feature/liquidity-score
```

## Pièges à éviter

### Piège 1 : Sauter la phase RED et écrire directement le code

**Mauvaise pratique** :
```
Implémenter d'abord la fonction calculateLiquidityScore
Puis écrire les tests
```

**Conséquences** :
- Les tests peuvent simplement « valider l'implémentation existante » sans vraiment vérifier le comportement
- Les cas limites et la gestion des erreurs sont facilement oubliés
- Manque de confiance lors du refactoring

**Bonne pratique** :
```
1. Écrire d'abord les tests (devrait échouer)
2. Exécuter les tests pour confirmer l'échec (RED)
3. Implémenter le code pour faire passer les tests (GREEN)
4. Refactoriser tout en gardant les tests passent (REFACTOR)
```

---

### Piège 2 : Couverture de tests insuffisante

**Mauvaise pratique** :
```
Écrire un seul test, couverture seulement de 40%
```

**Conséquences** :
- Une grande partie du code n'est pas protégée par des tests
- Facile d'introduire des bugs lors du refactoring
- Retour en arrière lors de la revue de code

**Bonne pratique** :
```
Garantir une couverture de 80%+ :
- Tests unitaires : couvrir toutes les fonctions et branches
- Tests d'intégration : couvrir les points d'API
- Tests E2E : couvrir les flux utilisateurs critiques
```

---

### Piège 3 : Ignorer les suggestions de code-review

**Mauvaise pratique** :
```
Voir des problèmes CRITIQUES et continuer à soumettre
```

**Conséquences** :
- Des failles de sécurité arrivent en production
- Code de qualité faible, difficile à maintenir
- Rejeté par les relecteurs de PR

**Bonne pratique** :
```
- Les problèmes CRITIQUES doivent être corrigés
- Les problèmes ÉLEVÉS doivent être corrigés si possible, ou justifiés
- Les problèmes MOYEN/FAIBLE peuvent être optimisés ultérieurement
```

---

### Piège 4 : Ne pas exécuter /verify avant de soumettre

**Mauvaise pratique** :
```
Écrire le code et faire directement git commit, sauter la validation
```

**Conséquences** :
- Build échoué, gaspillage des ressources CI
- Erreurs de type causant des erreurs à l'exécution
- Tests non passés, anomalie sur la branche principale

**Bonne pratique** :
```
Toujours exécuter /verify avant de soumettre :
/verify
# Attendre "Prêt pour PR : OUI" avant de soumettre
```

---

### Piège 5 : Tester les détails d'implémentation plutôt que le comportement

**Mauvaise pratique** :
```typescript
// Tester l'état interne
expect(component.state.count).toBe(5)
```

**Conséquences** :
- Tests fragiles, beaucoup d'échecs lors du refactoring
- Les tests ne reflètent pas ce que l'utilisateur voit réellement

**Bonne pratique** :
```typescript
// Tester le comportement visible par l'utilisateur
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

## Résumé de la leçon

Points clés du processus TDD :

1. **Planifier d'abord** : utiliser `/plan` pour garantir une compréhension correcte et éviter les erreurs de direction
2. **Piloter par les tests** : utiliser `/tdd` pour imposer les tests en premier, suivre RED-GREEN-REFACTOR
3. **Revue de code** : utiliser `/code-review` pour détecter les problèmes de sécurité et de qualité
4. **Validation complète** : utiliser `/verify` pour garantir que le code peut être soumis en toute sécurité
5. **Exigences de couverture** : garantir une couverture de tests de 80%+, 100% pour le code critique

Ces quatre commandes forment un cycle de développement complet garantissant la qualité du code et l'efficacité du développement.

::: tip Mémorisez ce processus
```
Exigences → /plan → /tdd → /code-review → /verify → Commit
```

Chaque nouvelle fonctionnalité devrait suivre ce processus.
:::

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Processus de revue de code : /code-review et audit de sécurité](../code-review-workflow/)**.
>
> Vous apprendrez :
> - Comprendre en profondeur la logique de vérification de l'agent code-reviewer
> - Maîtriser la liste de contrôle de l'audit de sécurité
> - Apprendre à corriger les vulnérabilités de sécurité courantes
> - Savoir comment configurer des règles de revue personnalisées

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-25

| Fonction              | Chemin du fichier                                                                                     | Ligne      |
| --- | --- | --- |
| Commande /plan        | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114     |
| Commande /tdd         | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)              | 1-327     |
| Commande /verify      | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md)          | 1-60      |

**Fonctions clés** :
- `plan` appelle l'agent planner, crée un plan d'implémentation
- `tdd` appelle l'agent tdd-guide, exécute le cycle RED-GREEN-REFACTOR
- `verify` exécute une validation complète (build, types, lint, tests)
- `code-review` vérifie les failles de sécurité, la qualité du code, les bonnes pratiques

**Exigences de couverture** :
- Couverture de code minimale de 80% (branches, functions, lines, statements)
- Calculs financiers, logique d'authentification, code critique pour la sécurité : couverture de 100% requise

</details>
