---
title: "Démarrage Rapide : Installation du Plugin | everything-claude-code"
sidebarTitle: "Prise en main en 5 minutes"
subtitle: "Démarrage Rapide : Installer le plugin everything-claude-code"
description: "Apprenez à installer everything-claude-code et découvrez ses fonctionnalités principales. Installez le plugin en 5 minutes et utilisez les commandes /plan, /tdd, /code-review pour améliorer votre productivité."
tags:
  - "quickstart"
  - "installation"
  - "getting-started"
prerequisite: []
order: 10
---

# Démarrage Rapide : Prise en main d'Everything Claude Code en 5 minutes

## Ce que vous apprendrez

**Everything Claude Code** est un plugin pour Claude Code qui fournit des agents, commandes, règles et hooks professionnels pour vous aider à améliorer la qualité de votre code et votre productivité. Ce tutoriel vous permettra de :

- ✅ Installer Everything Claude Code en 5 minutes
- ✅ Utiliser la commande `/plan` pour créer un plan d'implémentation
- ✅ Utiliser la commande `/tdd` pour le développement piloté par les tests
- ✅ Utiliser la commande `/code-review` pour réviser votre code
- ✅ Comprendre les composants principaux du plugin

## Vos difficultés actuelles

Vous souhaitez rendre Claude Code plus puissant, mais :
- ❌ Vous devez répéter sans cesse les normes de codage et les meilleures pratiques
- ❌ Le taux de couverture des tests est faible et les bugs sont fréquents
- ❌ Les révisions de code omettent toujours les problèmes de sécurité
- ❌ Vous voulez faire du TDD mais ne savez pas par où commencer
- ❌ Vous souhaitez avoir des sous-agents spécialisés pour traiter des tâches spécifiques

**Everything Claude Code** résout ces problèmes :
- 9 agents spécialisés (planner, tdd-guide, code-reviewer, security-reviewer, etc.)
- 14 commandes slash (/plan, /tdd, /code-review, etc.)
- 8 ensembles de règles obligatoires (security, coding-style, testing, etc.)
- 15+ hooks automatisés
- 11 skills de workflow

## Concepts clés

**Everything Claude Code** est un plugin pour Claude Code qui fournit :
- **Agents** : Sous-agents spécialisés qui traitent des tâches spécifiques (TDD, révision de code, audit de sécurité)
- **Commands** : Commandes slash pour démarrer rapidement des workflows (/plan, /tdd)
- **Rules** : Règles obligatoires pour assurer la qualité et la sécurité du code (couverture 80%+, interdiction de console.log)
- **Skills** : Définitions de workflow pour réutiliser les meilleures pratiques
- **Hooks** : Hooks d'automatisation déclenchés à des événements spécifiques (persistance de session, avertissement console.log)

::: tip Qu'est-ce qu'un plugin Claude Code ?
Les plugins Claude Code étendent les capacités de Claude Code, tout comme les plugins VS Code étendent les fonctionnalités de l'éditeur. Après installation, vous pouvez utiliser tous les agents, commandes, skills et hooks fournis par le plugin.
:::

## 🎒 Prérequis

**Ce dont vous avez besoin** :
- Claude Code installé
- Connaissances de base des commandes terminal
- Un répertoire de projet (pour les tests)

**Ce dont vous n'avez pas besoin** :
- Connaissances spéciales d'un langage de programmation
- Configuration préalable

---

## Suivez-moi : Installation en 5 minutes

### Étape 1 : Ouvrir Claude Code

Lancez Claude Code et ouvrez un répertoire de projet.

**Vous devriez voir** : L'interface en ligne de commande de Claude Code prête à l'emploi.

---

### Étape 2 : Ajouter le Marketplace

Dans Claude Code, exécutez la commande suivante pour ajouter le marketplace :

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**Pourquoi**
Ajoute Everything Claude Code comme source de plugins pour Claude Code, permettant ainsi d'installer le plugin.

**Vous devriez voir** :
```
✓ Successfully added marketplace: everything-claude-code
```

---

### Étape 3 : Installer le plugin

Exécutez la commande suivante pour installer le plugin :

```bash
/plugin install everything-claude-code@everything-claude-code
```

**Pourquoi**
Installe le plugin Everything Claude Code pour pouvoir utiliser toutes ses fonctionnalités.

**Vous devriez voir** :
```
✓ Successfully installed plugin: everything-claude-code@everything-claude-code
```

---

### Étape 4 : Vérifier l'installation

Exécutez la commande suivante pour voir les plugins installés :

```bash
/plugin list
```

**Vous devriez voir** :
```
Installed Plugins:
  everything-claude-code@everything-claude-code
```

✅ Installation réussie !

---

## Suivez-moi : Découvrir les fonctionnalités principales

### Étape 5 : Utiliser /plan pour créer un plan d'implémentation

Supposons que vous voulez ajouter une fonction d'authentification utilisateur, exécutez :

```bash
/plan I need to add user authentication with email and password
```

**Pourquoi**
Utilise l'agent planner pour créer un plan d'implémentation détaillé, évitant d'oublier des étapes clés.

**Vous devriez voir** :
```
# Implementation Plan: User Authentication with Email and Password

## Requirements Restatement
- User registration with email and password
- User login with email and password
- Password hashing with bcrypt
- JWT token generation
- Session management

## Implementation Phases
[Detailed implementation steps...]

## Risks
- HIGH: Password security (use bcrypt, salt rounds)
- MEDIUM: JWT token expiration
- LOW: Email uniqueness validation

## Estimated Complexity: MEDIUM
**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

Entrez `yes` pour confirmer le plan, puis le planner commencera la mise en œuvre.

---

### Étape 6 : Utiliser /tdd pour le développement piloté par les tests

Pendant la mise en œuvre de la fonctionnalité, exécutez :

```bash
/tdd I need to implement a function to validate email format
```

**Pourquoi**
Utilise l'agent tdd-guide pour forcer le processus TDD, assurant d'écrire d'abord les tests, puis le code, pour atteindre 80%+ de couverture.

**Vous devriez voir** :
```
# TDD Session: Email Format Validator

## Step 1: Define Interface (SCAFFOLD)
```typescript
// lib/email-validator.ts
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)
[Test code...]

## Step 3: Run Tests - Verify FAIL
[Test failure...]

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)
[Implementation code...]

## Step 5: Run Tests - Verify PASS
[Tests pass...]

## Step 6: Refactor (IMPROVE)
[Refactored code...]

## Step 7: Verify Tests Still Pass
[Tests still pass...]

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)

✅ TDD session complete!
```

---

### Étape 7 : Utiliser /code-review pour réviser le code

Avant de commit, exécutez :

```bash
/code-review
```

**Pourquoi**
Utilise l'agent code-reviewer pour vérifier la qualité du code, la sécurité et les meilleures pratiques.

**Vous devriez voir** :
```
# Code Review Report

## Overview
- Files reviewed: 3
- Total lines: 150
- Issues found: 2

## Issues Found

### 1. [CRITICAL] Hardcoded JWT Secret
**Location**: `lib/auth.ts:15`
**Issue**: JWT secret is hardcoded in source code
**Fix**: Move to environment variable
**Impact**: Security vulnerability - secret exposed in code

### 2. [MEDIUM] Missing Error Handling
**Location**: `lib/email-validator.ts:23`
**Issue**: No error handling for null/undefined input
**Fix**: Add null check at function start
**Impact**: Potential runtime errors

## Recommendations
✓ Tests are well written
✓ Code is readable
✓ Follows TypeScript best practices

**Action Required**: Fix CRITICAL issues before commit.
```

Après avoir corrigé les problèmes, exécutez à nouveau `/code-review` pour confirmer que tous les problèmes sont résolus.

---

## Points de contrôle ✅

Confirmez que vous avez complété avec succès les étapes suivantes :

- [ ] Marketplace ajouté avec succès
- [ ] Plugin everything-claude-code installé avec succès
- [ ] Plan d'implémentation créé avec `/plan`
- [ ] Développement TDD effectué avec `/tdd`
- [ ] Révision de code effectuée avec `/code-review`

En cas de problème, consultez [Dépannage des problèmes courants](../../faq/troubleshooting-hooks/) ou vérifiez [Échec de connexion MCP](../../faq/troubleshooting-mcp/).

---

## Pièges à éviter

::: warning Échec de l'installation
Si `/plugin marketplace add` échoue, assurez-vous que :
1. Vous utilisez la dernière version de Claude Code
2. La connexion réseau fonctionne
3. L'accès à GitHub est possible (proxy peut-être nécessaire)
:::

::: warning Commandes indisponibles
Si les commandes `/plan` ou `/tdd` ne sont pas disponibles :
1. Exécutez `/plugin list` pour confirmer que le plugin est installé
2. Vérifiez que le statut du plugin est enabled
3. Redémarrez Claude Code
:::

::: tip Utilisateurs Windows
Everything Claude Code est entièrement compatible avec Windows. Tous les hooks et scripts sont réécrits en Node.js pour assurer la compatibilité multi-plateforme.
:::

---

## Résumé du cours

✅ Vous avez :
1. Installé avec succès le plugin Everything Claude Code
2. Compris les concepts clés : agents, commands, rules, skills, hooks
3. Expérimenté les trois commandes principales `/plan`, `/tdd`, `/code-review`
4. Maîtrisé les bases du workflow TDD

**À retenir** :
- Les agents sont des sous-agents spécialisés qui traitent des tâches spécifiques
- Les commands sont des points d'entrée pour démarrer rapidement des workflows
- Les rules sont des règles obligatoires qui assurent la qualité et la sécurité du code
- Commencez par les fonctionnalités qui résonnent avec vous, puis étendez progressivement
- N'activez pas tous les MCPs, gardez moins de 10

---

## Prochain cours

> Au prochain cours, nous apprendrons **[Guide d'installation : Marketplace vs Installation manuelle](../installation/)**.
>
> Vous apprendrez :
> - Les étapes détaillées de l'installation via le marketplace
> - Le processus complet d'installation manuelle
> - Comment copier uniquement les composants nécessaires
> - La méthode de configuration des serveurs MCP

Continuez à apprendre pour approfondir votre compréhension de l'installation et de la configuration complète d'Everything Claude Code.

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité          | Chemin du fichier                                                                                    | Lignes  |
| --- | --- | --- |
| Manifeste du plugin       | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28  |
| Configuration du Marketplace | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45  |
| Instructions d'installation       | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                        | 175-242 |
| Commande /plan      | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114 |
| Commande /tdd      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)            | 1-327 |

**Constantes clés** :
- Nom du plugin : `everything-claude-code`
- Dépôt du Marketplace : `affaan-m/everything-claude-code`

**Fichiers clés** :
- `plugin.json` : Métadonnées du plugin et chemins des composants
- `commands/*.md` : 14 définitions de commandes slash
- `agents/*.md` : 9 sous-agents spécialisés
- `rules/*.md` : 8 ensembles de règles obligatoires
- `hooks/hooks.json` : 15+ configurations de hooks automatisés

</details>
