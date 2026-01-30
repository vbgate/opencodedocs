---
title: "Boucle de Vérification : Checkpoint et Evals | Everything Claude Code"
subtitle: "Boucle de Vérification : Checkpoint et Evals"
sidebarTitle: "Vérifications avant PR sans faux pas"
description: "Découvrez le mécanisme de boucle de vérification d'Everything Claude Code. Maîtrisez la gestion des checkpoints, la définition des evals et la vérification continue. Sauvegardez et restaurez l'état avec checkpoint, assurez la qualité du code avec evals."
tags:
  - "verification"
  - "checkpoint"
  - "evals"
  - "quality-gates"
prerequisite:
  - "platforms-tdd-workflow"
order: 120
---

# Boucle de Vérification : Checkpoint et Evals

## Ce que vous saurez faire après ce cours

Après avoir appris le mécanisme de boucle de vérification, vous pourrez :

- Utiliser `/checkpoint` pour sauvegarder et restaurer l'état de votre travail
- Utiliser `/verify` pour effectuer des vérifications complètes de la qualité du code
- Maîtriser la philosophie Eval-Driven Development (EDD), définir et exécuter des evals
- Établir une boucle de vérification continue pour maintenir la qualité du code pendant le développement

## Votre situation actuelle

Vous venez de terminer une fonctionnalité, mais vous n'osez pas soumettre une PR, car :
- Vous n'êtes pas sûr d'avoir cassé des fonctionnalités existantes
- Vous craignez une baisse de la couverture de tests
- Vous avez oublié l'objectif initial et ne savez pas si vous avez dévié
- Vous voulez revenir à un état stable, mais vous n'avez pas de trace

Si vous aviez un mécanisme pour "prendre une photo" aux moments clés et vérifier continuellement pendant le développement, ces problèmes seraient résolus.

## Quand utiliser cette technique

- **Avant de commencer une nouvelle fonctionnalité** : Créer un checkpoint pour enregistrer l'état initial
- **Après avoir terminé une étape importante** : Sauvegarder la progression pour faciliter le retour en arrière et la comparaison
- **Avant de soumettre une PR** : Exécuter une vérification complète pour garantir la qualité du code
- **Lors d'un refactoring** : Vérifier fréquemment pour éviter de casser les fonctionnalités existantes
- **En collaboration** : Partager les checkpoints pour synchroniser l'état du travail

## 🎒 Préparation avant de commencer

::: warning Prérequis

Ce tutoriel suppose que vous avez déjà :

- ✅ Terminé l'apprentissage du [Workflow TDD](../../platforms/tdd-workflow/)
- ✅ Familiarisé avec les opérations Git de base
- ✅ Compris comment utiliser les commandes de base d'Everything Claude Code

:::

---

## Concept fondamental

La **boucle de vérification** est un mécanisme d'assurance qualité qui transforme le cycle "écrire du code → tester → vérifier" en un processus systématique.

### Système de vérification à trois niveaux

Everything Claude Code propose trois niveaux de vérification :

| Niveau | Mécanisme | Objectif | Quand l'utiliser |
| --- | --- | --- | --- |
| **Vérification en temps réel** | PostToolUse Hooks | Capturer immédiatement les erreurs de type, console.log, etc. | Après chaque appel d'outil |
| **Vérification périodique** | Commande `/verify` | Vérification complète : build, types, tests, sécurité | Toutes les 15 minutes ou après un changement majeur |
| **Vérification d'étape** | `/checkpoint` | Comparer les différences d'état, suivre les tendances de qualité | Après une étape importante, avant de soumettre une PR |

### Checkpoint : Le "point de sauvegarde" du code

Le checkpoint "prend une photo" aux moments clés :

- Enregistre le SHA Git
- Enregistre le taux de réussite des tests
- Enregistre la couverture de code
- Enregistre l'horodatage

Lors de la vérification, vous pouvez comparer l'état actuel avec n'importe quel checkpoint.

### Evals : Les "tests unitaires" du développement IA

**Eval-Driven Development (EDD)** traite les evals comme des tests unitaires pour le développement IA :

1. **Définir d'abord les critères de succès** (écrire les evals)
2. **Ensuite écrire le code** (implémenter la fonctionnalité)
3. **Exécuter continuellement les evals** (vérifier l'exactitude)
4. **Suivre les régressions** (s'assurer de ne pas casser les fonctionnalités existantes)

Cela est cohérent avec la philosophie TDD (Test-Driven Development), mais orienté vers le développement assisté par IA.

---

## Suivez-moi : Utiliser Checkpoint

### Étape 1 : Créer le checkpoint initial

Avant de commencer une nouvelle fonctionnalité, créez d'abord un checkpoint :

```bash
/checkpoint create "feature-start"
```

**Pourquoi**
Enregistrer l'état initial pour faciliter la comparaison ultérieure.

**Ce que vous devriez voir** :

```
VERIFICATION: Running quick checks...
Build:    OK
Types:    OK

CHECKPOINT CREATED: feature-start
Time:     2026-01-25-14:30
Git SHA:  abc1234
Logged to: .claude/checkpoints.log
```

Le checkpoint va :
1. D'abord exécuter `/verify quick` (vérifier uniquement le build et les types)
2. Créer un git stash ou commit (nommé : `checkpoint-feature-start`)
3. Enregistrer dans `.claude/checkpoints.log`

### Étape 2 : Implémenter la fonctionnalité principale

Commencez à écrire le code et terminez la logique principale.

### Étape 3 : Créer un checkpoint d'étape

Après avoir terminé la fonctionnalité principale :

```bash
/checkpoint create "core-done"
```

**Pourquoi**
Enregistrer l'étape importante pour faciliter le retour en arrière.

**Ce que vous devriez voir** :

```
CHECKPOINT CREATED: core-done
Time:     2026-01-25-16:45
Git SHA:  def5678
Logged to: .claude/checkpoints.log
```

### Étape 4 : Vérifier et comparer

Vérifier si l'état actuel s'écarte de l'objectif :

```bash
/checkpoint verify "feature-start"
```

**Pourquoi**
Comparer les changements des indicateurs de qualité depuis le début jusqu'à maintenant.

**Ce que vous devriez voir** :

```
CHECKPOINT COMPARISON: feature-start
=====================================
Files changed: 12
Tests: +25 passed / -0 failed
Coverage: +15% / -2% (from 60% to 75%)
Build: PASS
Status: ✅ Quality improved
```

### Étape 5 : Voir tous les checkpoints

Consulter l'historique des checkpoints :

```bash
/checkpoint list
```

**Ce que vous devriez voir** :

```
CHECKPOINTS HISTORY
===================
Name           | Time             | Git SHA  | Status
---------------|------------------|----------|--------
feature-start  | 2026-01-25-14:30 | abc1234  | behind
core-done      | 2026-01-25-16:45 | def5678  | current
```

**Point de contrôle ✅** : Vérifier la compréhension

- Le checkpoint exécute-t-il automatiquement `/verify quick` ? ✅ Oui
- Dans quel fichier le checkpoint est-il enregistré ? ✅ `.claude/checkpoints.log`
- Quels indicateurs `/checkpoint verify` compare-t-il ? ✅ Changements de fichiers, taux de réussite des tests, couverture

---

## Suivez-moi : Utiliser la commande Verify

### Étape 1 : Exécuter une vérification rapide

Pendant le développement, exécutez fréquemment une vérification rapide :

```bash
/verify quick
```

**Pourquoi**
Vérifie uniquement le build et les types, c'est le plus rapide.

**Ce que vous devriez voir** :

```
VERIFICATION: PASS

Build:    OK
Types:    OK

Ready for next task: YES
```

### Étape 2 : Exécuter une vérification complète

Avant de préparer la soumission d'une PR, exécutez une vérification complète :

```bash
/verify full
```

**Pourquoi**
Vérifier complètement toutes les portes de qualité.

**Ce que vous devriez voir** :

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK (2 warnings)
Tests:    120/125 passed, 76% coverage
Secrets:  OK
Logs:     3 console.logs found in src/

Ready for PR: NO

Issues to Fix:
1. Remove console.log statements before PR
   Found in: src/utils/logger.ts:15, src/api/client.ts:23, src/ui/button.ts:8
2. Increase test coverage from 76% to 80% (target)
   Missing coverage in: src/components/Form.tsx
```

### Étape 3 : Exécuter la vérification pré-PR

La vérification la plus stricte, incluant le scan de sécurité :

```bash
/verify pre-pr
```

**Ce que vous devriez voir** :

```
VERIFICATION: FAIL

Build:    OK
Types:    OK (1 error)
Lint:     OK
Tests:    120/125 passed, 76% coverage
Secrets:  ❌ FOUND (2 API keys)
Logs:     3 console.logs

Security Issues Found:
1. Hardcoded API key in src/api/config.ts:10
2. Secret key in .env.example

Ready for PR: NO

Critical Issues:
1. Remove hardcoded secrets
2. Fix type error in src/components/Form.tsx:45
3. Remove console.logs
4. Increase coverage to 80%
```

### Étape 4 : Revérifier après correction

Après avoir corrigé les problèmes, exécutez à nouveau la vérification :

```bash
/verify full
```

**Ce que vous devriez voir** :

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK
Tests:    125/125 passed, 81% coverage
Secrets:  OK
Logs:     OK

Ready for PR: YES
```

**Point de contrôle ✅** : Vérifier la compréhension

- Que vérifie uniquement `/verify quick` ? ✅ Build et types
- Quels éléments `/verify full` vérifie-t-il ? ✅ Build, types, Lint, tests, Secrets, Console.log, statut Git
- Quel mode de vérification inclut le scan de sécurité ? ✅ `pre-pr`

---

## Suivez-moi : Utiliser les Evals (Eval-Driven Development)

### Étape 1 : Définir les Evals (avant d'écrire le code)

**Avant de commencer à coder, définissez d'abord les critères de succès** :

```markdown
## EVAL: user-authentication

### Capability Evals
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

### Regression Evals
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

**Pourquoi**
Définir d'abord les critères de succès force à réfléchir à "quels sont les critères d'achèvement".

Sauvegarder dans : `.claude/evals/user-authentication.md`

### Étape 2 : Implémenter la fonctionnalité

Écrire le code selon les evals.

### Étape 3 : Exécuter les Capability Evals

Tester si la nouvelle fonctionnalité satisfait les evals :

```markdown
[CERTAIN CAPABILITY EVAL: user-authentication]

Test 1: User can register with email/password
Task: Call registration API with valid credentials
Expected: User account created, token returned
Actual: PASS

Test 2: User can login with valid credentials
Task: Call login API with registered credentials
Expected: JWT token returned
Actual: PASS

Test 3: Invalid credentials rejected
Task: Call login API with wrong password
Expected: 401 Unauthorized with error message
Actual: PASS

Overall: 3/3 passed
```

### Étape 4 : Exécuter les Regression Evals

S'assurer de ne pas casser les fonctionnalités existantes :

```bash
npm test -- --testPathPattern="existing"
```

**Ce que vous devriez voir** :

```
PASS  existing/auth.test.ts
PASS  existing/api.test.ts
PASS  existing/db.test.ts

All regression tests: 15/15 passed
```

### Étape 5 : Générer le rapport Eval

Résumer les résultats :

```markdown
EVAL REPORT: user-authentication
=================================

Capability Evals:
  register-user:       PASS (pass@1)
  login-user:          PASS (pass@2)
  reject-invalid:      PASS (pass@1)
  session-persistence: PASS (pass@1)
  logout-clears:       PASS (pass@1)
  Overall:             5/5 passed

Regression Evals:
  public-routes:       PASS
  api-responses:       PASS
  db-schema:           PASS
  Overall:             3/3 passed

Metrics:
  pass@1: 80% (4/5)
  pass@3: 100% (5/5)
  pass^3: 100% (3/3)

Status: READY FOR REVIEW
```

**Point de contrôle ✅** : Vérifier la compréhension

- Quand les Evals doivent-ils être définis ? ✅ Avant d'écrire le code
- Quelle est la différence entre capability evals et regression evals ? ✅ Les premiers testent les nouvelles fonctionnalités, les seconds s'assurent de ne pas casser les fonctionnalités existantes
- Que signifie pass@3 ? ✅ Probabilité de succès en 3 tentatives

---

## Pièges à éviter

### Piège 1 : Oublier de créer un checkpoint

**Problème** : Après avoir développé pendant un certain temps, vous voulez revenir à un certain état, mais vous n'avez pas d'enregistrement.

**Solution** : Créer un checkpoint avant de commencer chaque nouvelle fonctionnalité :

```bash
# Bonne habitude : avant de commencer une nouvelle fonctionnalité
/checkpoint create "feature-name-start"

# Bonne habitude : à chaque étape importante
/checkpoint create "phase-1-done"
/checkpoint create "phase-2-done"
```

### Piège 2 : Définition d'Evals trop vague

**Problème** : Les Evals sont écrits de manière trop vague et ne peuvent pas être vérifiés.

**Mauvais exemple** :
```markdown
- [ ] L'utilisateur peut se connecter
```

**Bon exemple** :
```markdown
- [ ] User can login with valid credentials
  Task: POST /api/login with email="test@example.com", password="Test123!"
  Expected: HTTP 200 with JWT token in response body
  Actual: ___________
```

### Piège 3 : Exécuter la vérification uniquement avant de soumettre une PR

**Problème** : Attendre la PR pour découvrir les problèmes, le coût de correction est élevé.

**Solution** : Établir une habitude de vérification continue :

```
Toutes les 15 minutes : /verify quick
À chaque fonctionnalité terminée : /checkpoint create "milestone"
Avant de soumettre une PR : /verify pre-pr
```

### Piège 4 : Ne pas mettre à jour les Evals

**Problème** : Après un changement d'exigences, les Evals sont toujours anciens, ce qui rend la vérification inefficace.

**Solution** : Les Evals sont du "code de première classe", mettez-les à jour en même temps que les changements d'exigences :

```bash
# Changement d'exigences → Mise à jour des Evals → Mise à jour du code
1. Modifier .claude/evals/feature-name.md
2. Modifier le code selon les nouveaux evals
3. Réexécuter les evals
```

---

## Résumé de la leçon

La boucle de vérification est une méthode systématique pour maintenir la qualité du code :

| Mécanisme | Rôle | Fréquence d'utilisation |
| --- | --- | --- |
| **PostToolUse Hooks** | Capturer les erreurs en temps réel | À chaque appel d'outil |
| **`/verify`** | Vérification complète périodique | Toutes les 15 minutes |
| **`/checkpoint`** | Enregistrement et comparaison d'étapes | À chaque phase de fonctionnalité |
| **Evals** | Vérification de fonctionnalité et tests de régression | Pour chaque nouvelle fonctionnalité |

Principes fondamentaux :
1. **Définir d'abord, implémenter ensuite** (Evals)
2. **Vérifier fréquemment, améliorer continuellement** (`/verify`)
3. **Enregistrer les étapes, faciliter le retour en arrière** (`/checkpoint`)

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Règles personnalisées : Construire des normes spécifiques au projet](../custom-rules/)**.
>
> Vous apprendrez :
> - Comment créer des fichiers Rules personnalisés
> - Format des fichiers Rule et rédaction de listes de contrôle
> - Définir des règles de sécurité spécifiques au projet
> - Intégrer les normes d'équipe dans le processus de révision de code

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Définition de la commande Checkpoint | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Définition de la commande Verify | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Verification Loop Skill | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| Eval Harness Skill | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |

**Processus clés** :
- Processus de création de Checkpoint : exécuter d'abord `/verify quick` → créer git stash/commit → enregistrer dans `.claude/checkpoints.log`
- Processus de vérification Verify : Build Check → Type Check → Lint Check → Test Suite → Console.log Audit → Git Status
- Workflow Eval : Define (définir les evals) → Implement (implémenter le code) → Evaluate (exécuter les evals) → Report (générer le rapport)

**Paramètres clés** :
- `/checkpoint [create\|verify\|list] [name]` - Opérations Checkpoint
- `/verify [quick\|full\|pre-commit\|pre-pr]` - Modes de vérification
- pass@3 - Objectif de succès en 3 tentatives (>90%)
- pass^3 - 3 succès consécutifs (100%, pour les chemins critiques)

</details>
