---
title: "Revue de code : Workflow /code-review | Everything Claude Code"
subtitle: "Revue de code : Workflow /code-review"
sidebarTitle: "Vérifier le code avant de commiter"
description: "Apprenez à utiliser la commande /code-review. Maîtrisez les agents code-reviewer et security-reviewer pour la qualité et la sécurité du code. Détectez les vulnérabilités et les problèmes avant de commiter."
tags:
  - "code-review"
  - "security"
  - "code-quality"
  - "owasp"
prerequisite:
  - "start-quickstart"
order: 80
---

# Workflow de revue de code : /code-review et audit de sécurité

## Ce que vous apprendrez

La **revue de code** est une étape cruciale pour garantir la qualité et la sécurité du code. Ce tutoriel vous aide à :

- ✅ Utiliser la commande `/code-review` pour vérifier automatiquement les modifications
- ✅ Comprendre la différence entre les agents code-reviewer et security-reviewer
- ✅ Maîtriser la checklist de sécurité (OWASP Top 10)
- ✅ Détecter et corriger les vulnérabilités courantes (injection SQL, XSS, clés codées en dur, etc.)
- ✅ Appliquer les standards de qualité du code (taille des fonctions, longueur des fichiers, couverture de tests, etc.)
- ✅ Comprendre les critères d'approbation (CRITICAL, HIGH, MEDIUM, LOW)

## Votre situation actuelle

Vous avez écrit du code, prêt à commiter, mais :

- ❌ Vous ne savez pas s'il y a des vulnérabilités de sécurité
- ❌ Vous craignez d'avoir manqué des problèmes de qualité
- ❌ Vous n'êtes pas sûr d'avoir suivi les bonnes pratiques
- ❌ La vérification manuelle est chronophage et sujette aux oublis
- ❌ Vous souhaitez détecter les problèmes automatiquement avant de commiter

Le workflow de revue de code d'**Everything Claude Code** résout ces problèmes :

- **Vérification automatisée** : La commande `/code-review` analyse automatiquement toutes les modifications
- **Revue spécialisée** : L'agent code-reviewer se concentre sur la qualité, l'agent security-reviewer sur la sécurité
- **Classification par gravité** : Les problèmes sont classés par niveau de sévérité (CRITICAL, HIGH, MEDIUM, LOW)
- **Recommandations détaillées** : Chaque problème inclut des suggestions de correction concrètes

## Quand utiliser cette technique

**Avant chaque commit**, vous devriez exécuter une revue de code :

- ✅ Après avoir terminé une nouvelle fonctionnalité
- ✅ Après avoir corrigé un bug
- ✅ Après avoir refactorisé du code
- ✅ Lors de l'ajout d'endpoints API (security-reviewer obligatoire)
- ✅ Pour le code traitant des entrées utilisateur (security-reviewer obligatoire)
- ✅ Pour le code impliquant l'authentification/autorisation (security-reviewer obligatoire)

::: tip Bonne pratique
Prenez l'habitude : avant chaque `git commit`, exécutez `/code-review`. S'il y a des problèmes CRITICAL ou HIGH, corrigez-les avant de commiter.
:::

## 🎒 Prérequis

**Ce dont vous avez besoin** :
- Everything Claude Code installé (si ce n'est pas fait, consultez le [Démarrage rapide](../../start/quickstart/))
- Quelques modifications de code (vous pouvez d'abord écrire du code avec `/tdd`)
- Une connaissance de base des opérations Git

**Ce dont vous n'avez pas besoin** :
- Pas besoin d'être expert en sécurité (l'agent détecte pour vous)
- Pas besoin de mémoriser toutes les bonnes pratiques de sécurité (l'agent vous les rappelle)

---

## Concept clé

Everything Claude Code fournit deux agents de revue spécialisés :

### Agent code-reviewer

**Se concentre sur la qualité du code et les bonnes pratiques**, vérifie :

- **Qualité du code** : Taille des fonctions (>50 lignes), longueur des fichiers (>800 lignes), profondeur d'imbrication (>4 niveaux)
- **Gestion des erreurs** : Try/catch manquants, instructions console.log
- **Standards de code** : Conventions de nommage, code dupliqué, patterns d'immutabilité
- **Bonnes pratiques** : Utilisation d'emojis, TODO/FIXME sans ticket, JSDoc manquant
- **Couverture de tests** : Nouveau code sans tests

**Cas d'utilisation** : Toutes les modifications de code devraient passer par code-reviewer.

### Agent security-reviewer

**Se concentre sur les vulnérabilités et les menaces de sécurité**, vérifie :

- **OWASP Top 10** : Injection SQL, XSS, CSRF, contournement d'authentification, etc.
- **Fuites de secrets** : Clés API, mots de passe, tokens codés en dur
- **Validation des entrées** : Validation des entrées utilisateur manquante ou incorrecte
- **Authentification/Autorisation** : Vérifications d'identité et de permissions incorrectes
- **Sécurité des dépendances** : Dépendances obsolètes ou avec des vulnérabilités connues

**Cas d'utilisation** : Le code sensible en termes de sécurité (API, authentification, paiement, entrées utilisateur) doit obligatoirement passer par security-reviewer.

### Classification par niveau de gravité

| Niveau | Signification | Bloque le commit ? | Exemple |
| --- | --- | --- | --- |
| **CRITICAL** | Vulnérabilité de sécurité grave ou problème de qualité majeur | ❌ Doit bloquer | Clé API codée en dur, injection SQL |
| **HIGH** | Problème de sécurité ou de qualité important | ❌ Doit bloquer | Gestion d'erreurs manquante, vulnérabilité XSS |
| **MEDIUM** | Problème de priorité moyenne | ⚠️ Peut commiter avec prudence | Utilisation d'emojis, JSDoc manquant |
| **LOW** | Problème mineur | ✓ Peut être corrigé plus tard | Formatage incohérent, nombres magiques |

---

## Suivez le guide : Votre première revue de code

### Étape 1 : Créer des modifications de code

Commencez par écrire un endpoint API simple avec `/tdd` (incluant quelques failles de sécurité) :

```bash
/tdd
```

Demandez à Claude Code de créer une API de connexion utilisateur, le code ressemblera à ceci :

```typescript
// src/api/login.ts
export async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`  // ❌ Risque d'injection SQL
  const user = await db.query(query)
  
  if (user.password === password) {  // ❌ Comparaison de mot de passe en clair
    const token = generateToken(user.id)
    console.log('User logged in:', { email, password })  // ❌ Fuite du mot de passe dans les logs
    return { token }
  }
}
```

**Pourquoi**
Ce code contient plusieurs failles de sécurité et problèmes de qualité, idéal pour démontrer la fonctionnalité de revue de code.

**Vous devriez voir** : Le fichier de code a été créé.

---

### Étape 2 : Exécuter la revue de code

Maintenant, exécutez la commande `/code-review` :

```bash
/code-review
```

**Pourquoi**
`/code-review` appelle automatiquement l'agent code-reviewer pour vérifier toutes les modifications non commitées.

**Vous devriez voir** : L'agent commence à analyser le code, puis génère un rapport de revue.

---

### Étape 3 : Consulter le rapport de revue

code-reviewer génère un rapport similaire à celui-ci :

```markdown
# Code Review Report

## Critical Issues (Fix Immediately)

### 1. [CRITICAL] Hardcoded credentials
**File:** src/api/login.ts:3
**Issue:** Password logging in console
**Fix:** Remove password from logs, only log user ID

```typescript
// ❌ Bad
console.log('User logged in:', { email, password })

// ✓ Good
console.log('User logged in:', { email, userId: user.id })
```

---

### 2. [CRITICAL] SQL injection vulnerability
**File:** src/api/login.ts:2
**Issue:** String concatenation in SQL query
**Fix:** Use parameterized queries

```typescript
// ❌ Bad
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✓ Good
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
```

---

## High Issues (Fix Before Production)

### 3. [HIGH] Plaintext password comparison
**File:** src/api/login.ts:4
**Issue:** Password stored in plaintext
**Fix:** Use bcrypt to hash passwords

```typescript
// ❌ Bad
if (user.password === password) {

// ✓ Good
import bcrypt from 'bcrypt'
const isValid = await bcrypt.compare(password, user.password)
```

---

## Recommendations

1. Add input validation for email format
2. Add rate limiting to prevent brute force attacks
3. Use JWT tokens instead of generating custom tokens

## Approval Status

❌ BLOCKED - 2 CRITICAL issues found

Please fix all CRITICAL and HIGH issues before committing.
```

**Pourquoi**
Le rapport est classé par gravité, chaque problème inclut l'emplacement, la description, les suggestions de correction et des exemples de code.

**Vous devriez voir** : Un rapport de revue clair, indiquant tous les problèmes et les suggestions de correction.

---

### Étape 4 : Corriger les problèmes

Corrigez le code selon le rapport :

```typescript
// src/api/login.ts
import bcrypt from 'bcrypt'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function loginUser(input: unknown) {
  // Validation des entrées
  const validated = LoginSchema.parse(input)
  
  // Requête paramétrée (prévient l'injection SQL)
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.email)
    .single()
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // Comparaison de mot de passe haché
  const isValid = await bcrypt.compare(validated.password, user.password_hash)
  
  if (isValid) {
    const token = generateToken(user.id)
    console.log('User logged in:', { email: validated.email, userId: user.id })
    return { token }
  }
  
  throw new Error('Invalid credentials')
}
```

**Pourquoi**
Corrigez tous les problèmes CRITICAL et HIGH, ajoutez la validation des entrées et la comparaison de mot de passe haché.

**Vous devriez voir** : Le code a été mis à jour, les failles de sécurité ont été éliminées.

---

### Étape 5 : Nouvelle revue

Exécutez à nouveau `/code-review` :

```bash
/code-review
```

**Pourquoi**
Vérifiez que tous les problèmes ont été corrigés, assurez-vous que le code peut être commité.

**Vous devriez voir** : Un rapport d'approbation similaire à celui-ci :

```markdown
# Code Review Report

## Summary

- **Critical Issues:** 0 ✓
- **High Issues:** 0 ✓
- **Medium Issues:** 1 ⚠️
- **Low Issues:** 1 💡

## Medium Issues (Fix When Possible)

### 1. [MEDIUM] Missing JSDoc for public API
**File:** src/api/login.ts:9
**Issue:** loginUser function missing documentation
**Fix:** Add JSDoc comments

```typescript
/**
 * Authenticates a user with email and password
 * @param input - Login credentials (email, password)
 * @returns Object with JWT token
 * @throws Error if credentials invalid
 */
export async function loginUser(input: unknown) {
```

---

## Low Issues (Consider Fixing)

### 2. [LOW] Add rate limiting
**File:** src/api/login.ts:9
**Issue:** Login endpoint lacks rate limiting
**Fix:** Add express-rate-limit middleware

```typescript
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per window
})

app.post('/api/login', loginLimiter, loginUser)
```

---

## Approval Status

✅ APPROVED - No CRITICAL or HIGH issues

**Note:** Medium and Low issues can be fixed in follow-up commits.
```

**Vous devriez voir** : Revue approuvée, le code peut être commité.

---

### Étape 6 : Revue de sécurité dédiée (optionnel)

Si votre code implique des endpoints API, de l'authentification, des paiements ou d'autres fonctionnalités sensibles en termes de sécurité, vous pouvez appeler spécifiquement security-reviewer :

```bash
/security-reviewer
```

**Pourquoi**
security-reviewer effectue une analyse OWASP Top 10 plus approfondie, vérifiant davantage de patterns de vulnérabilités de sécurité.

**Vous devriez voir** : Un rapport de revue de sécurité détaillé, incluant l'analyse OWASP, la vérification des vulnérabilités des dépendances, les recommandations d'outils de sécurité, etc.

---

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez :

- ✅ Être capable d'exécuter la commande `/code-review`
- ✅ Comprendre la structure et le contenu du rapport de revue
- ✅ Être capable de corriger les problèmes de code selon le rapport
- ✅ Savoir que les problèmes CRITICAL et HIGH doivent être corrigés
- ✅ Comprendre la différence entre code-reviewer et security-reviewer
- ✅ Avoir pris l'habitude de faire une revue avant de commiter

---

## Pièges à éviter

### Erreur courante 1 : Ignorer la revue de code

**Problème** : Penser que le code est simple et commiter directement sans exécuter de revue.

**Conséquence** : Des vulnérabilités de sécurité peuvent être manquées, rejetées par le CI/CD ou causer des incidents en production.

**Bonne pratique** : Prenez l'habitude d'exécuter `/code-review` avant chaque commit.

---

### Erreur courante 2 : Ignorer les problèmes MEDIUM

**Problème** : Voir les problèmes MEDIUM et les ignorer, les laissant s'accumuler.

**Conséquence** : La qualité du code se dégrade, la dette technique s'accumule, la maintenance devient difficile.

**Bonne pratique** : Bien que les problèmes MEDIUM ne bloquent pas le commit, ils devraient être corrigés dans un délai raisonnable.

---

### Erreur courante 3 : Corriger manuellement l'injection SQL

**Problème** : Écrire son propre échappement de chaînes au lieu d'utiliser des requêtes paramétrées.

**Conséquence** : L'échappement est incomplet, le risque d'injection SQL persiste.

**Bonne pratique** : Utilisez toujours un ORM ou des requêtes paramétrées, ne concaténez jamais manuellement du SQL.

---

### Erreur courante 4 : Confondre les deux reviewers

**Problème** : Exécuter uniquement code-reviewer pour tout le code, en ignorant security-reviewer.

**Conséquence** : Des vulnérabilités de sécurité peuvent être manquées, particulièrement pour le code impliquant des API, de l'authentification ou des paiements.

**Bonne pratique** :
- Code ordinaire : code-reviewer suffit
- Code sensible en termes de sécurité : security-reviewer est obligatoire en plus

---

## Résumé de la leçon

Le **workflow de revue de code** est l'une des fonctionnalités principales d'Everything Claude Code :

| Fonctionnalité | Agent | Éléments vérifiés | Gravité |
| --- | --- | --- | --- |
| **Revue de qualité du code** | code-reviewer | Taille des fonctions, gestion des erreurs, bonnes pratiques | HIGH/MEDIUM/LOW |
| **Revue de sécurité** | security-reviewer | OWASP Top 10, fuites de secrets, vulnérabilités d'injection | CRITICAL/HIGH/MEDIUM |

**Points clés** :

1. **Avant chaque commit**, exécutez `/code-review`
2. **Les problèmes CRITICAL/HIGH** doivent être corrigés avant de commiter
3. **Le code sensible en termes de sécurité** doit passer par security-reviewer
4. **Le rapport de revue** inclut l'emplacement précis et les suggestions de correction
5. **Prenez l'habitude** : Revue → Correction → Nouvelle revue → Commit

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons l'**[Automatisation avec les Hooks](../../advanced/hooks-automation/)**.
>
> Vous apprendrez :
> - Ce que sont les Hooks et comment automatiser le workflow de développement
> - Comment utiliser plus de 15 hooks d'automatisation
> - Comment personnaliser les Hooks pour les adapter aux besoins du projet
> - Les cas d'utilisation des hooks SessionStart, SessionEnd, PreToolUse, etc.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Ligne |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**Constantes clés** :
- Limite de taille de fonction : 50 lignes (code-reviewer.md:47)
- Limite de taille de fichier : 800 lignes (code-reviewer.md:48)
- Limite de profondeur d'imbrication : 4 niveaux (code-reviewer.md:49)

**Fonctions clés** :
- `/code-review` : Appelle l'agent code-reviewer pour la revue de qualité du code
- `/security-reviewer` : Appelle l'agent security-reviewer pour l'audit de sécurité
- `git diff --name-only HEAD` : Obtient les fichiers modifiés non commités (code-review.md:5)

**Critères d'approbation** (code-reviewer.md:90-92) :
- ✅ Approve : Aucun problème CRITICAL ou HIGH
- ⚠️ Warning : Uniquement des problèmes MEDIUM (peut merger avec prudence)
- ❌ Block : Problèmes CRITICAL ou HIGH détectés

</details>
