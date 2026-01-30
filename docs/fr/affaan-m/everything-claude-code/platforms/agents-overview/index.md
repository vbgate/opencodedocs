
### 7. E2E Runner - Expert E2E

**Quand l'utiliser** : Lorsque vous devez générer, maintenir et exécuter des tests E2E.

::: tip Valeur des tests de bout en bout
Les tests E2E sont la dernière ligne de défense avant la production, ils capturent les problèmes d'intégration que les tests unitaires manquent.
:::

**Responsabilités principales** :
1. **Création de parcours de test** : Écrire des tests Playwright pour les flux utilisateur
2. **Maintenance des tests** : Garder les tests synchronisés avec les changements d'UI
3. **Gestion des tests flaky** : Identifier et isoler les tests instables
4. **Gestion des artefacts** : Capturer des captures d'écran, vidéos, traces
5. **Intégration CI/CD** : S'assurer que les tests s'exécutent de manière fiable dans les pipelines
6. **Rapports de test** : Générer des rapports HTML et JUnit XML

**Commandes de test** :
```bash
# Exécuter tous les tests E2E
npx playwright test

# Exécuter un fichier de test spécifique
npx playwright test tests/markets.spec.ts

# Exécuter les tests en mode headed (voir le navigateur)
npx playwright test --headed

# Déboguer les tests avec l'inspecteur
npx playwright test --debug

# Générer du code de test à partir des actions du navigateur
npx playwright codegen http://localhost:3000

# Exécuter les tests avec trace
npx playwright test --trace on

# Afficher le rapport HTML
npx playwright show-report

# Mettre à jour les instantanés
npx playwright test --update-snapshots

# Exécuter les tests sur un navigateur spécifique
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Workflow de test E2E** :

**1. Phase de planification des tests**
```
a) Identifier les parcours utilisateur clés
   - Flux d'authentification (connexion, déconnexion, inscription)
   - Fonctionnalités principales (création de marchés, trading, recherche)
   - Flux de paiement (dépôt, retrait)
   - Intégrité des données (opérations CRUD)

b) Définir les scénarios de test
   - Happy path (tout fonctionne normalement)
   - Edge cases (états vides, limites)
   - Error cases (échecs réseau, validations)

c) Prioriser par risque
   - HAUT : Transactions financières, authentification
   - MOYEN : Recherche, filtrage, navigation
   - FAIBLE : Finitions UI, animations, styles
```

**2. Phase de création des tests**
```
Pour chaque parcours utilisateur :

1. Écrire le test dans Playwright
   - Utiliser le pattern Page Object Model (POM)
   - Ajouter des descriptions de test significatives
   - Ajouter des assertions aux étapes clés
   - Ajouter des captures d'écran aux points clés

2. Rendre le test résilient
   - Utiliser des locateurs appropriés (data-testid prioritairement)
   - Ajouter des attentes pour le contenu dynamique
   - Gérer les conditions de course
   - Implémenter la logique de retry

3. Ajouter la capture d'artefacts
   - Captures d'écran en cas d'échec
   - Enregistrement vidéo
   - Traces pour le débogage
   - Logs réseau si nécessaire
```

**Structure des tests Playwright** :

**Organisation des fichiers de test** :
```
tests/
├── e2e/                       # Parcours utilisateur de bout en bout
│   ├── auth/                  # Flux d'authentification
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── markets/               # Fonctionnalités de marchés
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   ├── create.spec.ts
│   │   └── trade.spec.ts
│   ├── wallet/                # Opérations de portefeuille
│   │   ├── connect.spec.ts
│   │   └── transactions.spec.ts
│   └── api/                   # Tests des endpoints API
│       ├── markets-api.spec.ts
│       └── search-api.spec.ts
├── fixtures/                  # Données de test et utilitaires
│   ├── auth.ts                # Fixtures d'authentification
│   ├── markets.ts             # Données de test de marchés
│   └── wallets.ts             # Fixtures de portefeuilles
└── playwright.config.ts       # Configuration Playwright
```

**Pattern Page Object Model** :
```typescript
// pages/MarketsPage.ts
import { Page, Locator } from '@playwright/test'

export class MarketsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly marketCards: Locator
  readonly createMarketButton: Locator
  readonly filterDropdown: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.marketCards = page.locator('[data-testid="market-card"]')
    this.createMarketButton = page.locator('[data-testid="create-market-btn"]')
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]')
  }

  async goto() {
    await this.page.goto('/markets')
    await this.page.waitForLoadState('networkidle')
  }

  async searchMarkets(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp => resp.url().includes('/api/markets/search'))
    await this.page.waitForLoadState('networkidle')
  }

  async getMarketCount() {
    return await this.marketCards.count()
  }

  async clickMarket(index: number) {
    await this.marketCards.nth(index).click()
  }

  async filterByStatus(status: string) {
    await this.filterDropdown.selectOption(status)
    await this.page.waitForLoadState('networkidle')
  }
}
```

**Exemple de test des meilleures pratiques** :
```typescript
// tests/e2e/markets/search.spec.ts
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test.describe('Recherche de marchés', () => {
  let marketsPage: MarketsPage

  test.beforeEach(async ({ page }) => {
    marketsPage = new MarketsPage(page)
    await marketsPage.goto()
  })

  test('devrait rechercher des marchés par mot-clé', async ({ page }) => {
    // Arrange
    await expect(page).toHaveTitle(/Markets/)

    // Act
    await marketsPage.searchMarkets('trump')

    // Assert
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBeGreaterThan(0)

    // Vérifier que le premier résultat contient le terme de recherche
    const firstMarket = marketsPage.marketCards.first()
    await expect(firstMarket).toContainText(/trump/i)

    // Prendre une capture d'écran pour vérification
    await page.screenshot({ path: 'artifacts/search-results.png' })
  })

  test('devrait gérer élégamment l\'absence de résultats', async ({ page }) => {
    // Act
    await marketsPage.searchMarkets('xyznonexistentmarket123')

    // Assert
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBe(0)
  })
})
```

**Gestion des tests flaky** :

**Identifier les tests flaky** :
```bash
# Exécuter les tests plusieurs fois pour vérifier la stabilité
npx playwright test tests/markets/search.spec.ts --repeat-each=10

# Exécuter un test spécifique avec retries
npx playwright test tests/markets/search.spec.ts --retries=3
```

**Mode d'isolation** :
```typescript
// Marquer un test flaky pour isolation
test('flaky: recherche de marchés avec requête complexe', async ({ page }) => {
  test.fixme(true, 'Test est flaky - Issue #123')

  // Code de test ici...
})

// Ou utiliser le saut conditionnel
test('recherche de marchés avec requête complexe', async ({ page }) => {
  test.skip(process.env.CI, 'Test est flaky dans CI - Issue #123')

  // Code de test ici...
})
```

**Causes courantes de flakiness et corrections** :

**1. Conditions de course**
```typescript
// ❌ FLAKY : Ne pas supposer que l'élément est prêt
await page.click('[data-testid="button"]')

// ✅ STABLE : Attendre que l'élément soit prêt
await page.locator('[data-testid="button"]').click() // Auto-attente intégrée
```

**2. Timing réseau**
```typescript
// ❌ FLAKY : Timeout arbitraire
await page.waitForTimeout(5000)

// ✅ STABLE : Attendre une condition spécifique
await page.waitForResponse(resp => resp.url().includes('/api/markets'))
```

**3. Timing des animations**
```typescript
// ❌ FLAKY : Clic pendant l'animation
await page.click('[data-testid="menu-item"]')

// ✅ STABLE : Attendre la fin de l'animation
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.click('[data-testid="menu-item"]')
```

### 8. Refactor Cleaner - Nettoyeur de refactoring

**Quand l'utiliser** : Lorsque vous devez supprimer du code non utilisé, du code dupliqué et effectuer du refactoring.

::: warning Opération prudente
Refactor Cleaner exécute des outils d'analyse (knip, depcheck, ts-prune) pour identifier le code mort et le supprimer en toute sécurité. Vérifiez toujours avant de supprimer !
:::

**Responsabilités principales** :
1. **Détection de code mort** : Trouver le code, exports, dépendances non utilisés
2. **Élimination de doublons** : Identifier et fusionner le code dupliqué
3. **Nettoyage des dépendances** : Supprimer les packages et imports non utilisés
4. **Refactoring sécurisé** : S'assurer que les changements ne cassent pas la fonctionnalité
5. **Documentation** : Suivre toutes les suppressions dans `DELETION_LOG.md`

**Outils de détection** :
- **knip** : Trouver les fichiers, exports, dépendances, types non utilisés
- **depcheck** : Identifier les dépendances npm non utilisées
- **ts-prune** : Trouver les exports TypeScript non utilisés
- **eslint** : Vérifier les directives disable et variables non utilisées

**Commandes d'analyse** :
```bash
# Exécuter knip pour trouver les exports/fichiers/dépendances non utilisés
npx knip

# Vérifier les dépendances non utilisées
npx depcheck

# Trouver les exports TypeScript non utilisés
npx ts-prune

# Vérifier les directives disable non utilisées
npx eslint . --report-unused-disable-directives
```

**Workflow de refactoring** :

**1. Phase d'analyse**
```
a) Exécuter les outils de détection en parallèle
b) Collecter toutes les découvertes
c) Classer par niveau de risque :
   - SÛR : exports non utilisés, dépendances non utilisées
   - ATTENTION : peut-être utilisé via import dynamique
   - RISQUÉ : API publique, outils partagés
```

**2. Évaluation des risques**
```
Pour chaque élément à supprimer :
- Vérifier s'il est importé quelque part (recherche grep)
- Vérifier qu'il n'y a pas d'import dynamique (recherche de patterns de chaînes)
- Vérifier s'il fait partie d'une API publique
- Consulter l'historique pour le contexte
- Tester l'impact sur le build/tests
```

**3. Processus de suppression sécurisée**
```
a) Commencer uniquement par les éléments SÛRS
b) Supprimer une catégorie à la fois :
   1. Dépendances npm non utilisées
   2. Exports internes non utilisés
   3. Fichiers non utilisés
   4. Code dupliqué
c) Exécuter les tests après chaque lot
d) Créer un commit git pour chaque lot
```

**4. Fusion des doublons**
```
a) Trouver les composants/outils dupliqués
b) Choisir la meilleure implémentation :
   - La plus complète en fonctionnalités
   - La mieux testée
   - La plus récemment utilisée
c) Mettre à jour tous les imports pour utiliser la version choisie
d) Supprimer les doublons
e) Vérifier que les tests passent toujours
```

**Format du journal de suppression** :

Créer/mettre à jour `docs/DELETION_LOG.md` avec la structure suivante :
```markdown
# Journal de suppression de code

## [AAAA-MM-JJ] Session de refactoring

### Dépendances non utilisées supprimées
- package-name@version - Dernière utilisation : jamais, Taille : XX KB
- another-package@version - Remplacé par : better-package

### Fichiers non utilisés supprimés
- src/old-component.tsx - Remplacé par : src/new-component.tsx
- lib/deprecated-util.ts - Fonctionnalité déplacée vers : lib/utils.ts

### Code dupliqué consolidé
- src/components/Button1.tsx + Button2.tsx → Button.tsx
- Raison : Les deux implémentations étaient identiques

### Exports non utilisés supprimés
- src/utils/helpers.ts - Fonctions : foo(), bar()
- Raison : Aucune référence trouvée dans le codebase

### Impact
- Fichiers supprimés : 15
- Dépendances supprimées : 5
- Lignes de code supprimées : 2 300
- Réduction de la taille du bundle : ~45 KB

### Tests
- Tous les tests unitaires passent : ✓
- Tous les tests d'intégration passent : ✓
- Tests manuels complétés : ✓
```

**Checklist de sécurité** :

**Avant de supprimer quoi que ce soit :**
- [ ] Exécuter les outils de détection
- [ ] Rechercher toutes les références avec grep
- [ ] Vérifier les imports dynamiques
- [ ] Consulter l'historique
- [ ] Vérifier s'il s'agit d'une API publique
- [ ] Exécuter tous les tests
- [ ] Créer une branche de sauvegarde
- [ ] Documenter dans DELETION_LOG.md

**Après chaque suppression :**
- [ ] Le build réussit
- [ ] Les tests passent
- [ ] Pas d'erreurs console
- [ ] Commiter les changements
- [ ] Mettre à jour DELETION_LOG.md

**Patterns courants à supprimer** :

**1. Imports non utilisés**
```typescript
// ❌ Supprimer les imports non utilisés
import { useState, useEffect, useMemo } from 'react' // Seul useState est utilisé

// ✅ Garder uniquement ce qui est utilisé
import { useState } from 'react'
```

**2. Branches de code mort**
```typescript
// ❌ Supprimer le code inaccessible
if (false) {
  // Ceci ne s'exécute jamais
  doSomething()
}

// ❌ Supprimer les fonctions non utilisées
export function unusedHelper() {
  // Aucune référence dans le codebase
}
```

**3. Composants dupliqués**
```typescript
// ❌ Composants similaires multiples
components/Button.tsx
components/PrimaryButton.tsx
components/NewButton.tsx

// ✅ Consolider en un seul
components/Button.tsx (avec prop variant)
```

### 9. Doc Updater - Metteur à jour de documentation

**Quand l'utiliser** : Lorsque vous devez mettre à jour les codemaps et la documentation.

::: tip Documentation synchronisée avec le code
Doc Updater exécute `/update-codemaps` et `/update-docs`, génère `docs/CODEMAPS/*`, met à jour les READMEs et les guides.
:::

**Responsabilités principales** :
1. **Génération de codemap** : Créer des cartes d'architecture à partir de la structure du codebase
2. **Mise à jour de documentation** : Rafraîchir les READMEs et guides à partir du code
3. **Analyse AST** : Utiliser l'API du compilateur TypeScript pour comprendre la structure
4. **Mapping des dépendances** : Tracer les imports/exports à travers les modules
5. **Qualité de la documentation** : S'assurer que la documentation correspond au code réel

**Outils d'analyse** :
- **ts-morph** : Analyse et manipulation de l'AST TypeScript
- **TypeScript Compiler API** : Analyse approfondie de la structure du code
- **madge** : Visualisation du graphe de dépendances
- **jsdoc-to-markdown** : Génération de documentation à partir des commentaires JSDoc

**Commandes d'analyse** :
```bash
# Analyser la structure du projet TypeScript (exécuter un script personnalisé utilisant la bibliothèque ts-morph)
npx tsx scripts/codemaps/generate.ts

# Générer le graphe de dépendances
npx madge --image graph.svg src/

# Extraire les commentaires JSDoc
npx jsdoc2md src/**/*.ts
```

**Workflow de génération de codemap** :

**1. Analyse de la structure du repository**
```
a) Identifier tous les workspaces/packages
b) Mapper la structure des répertoires
c) Trouver les points d'entrée (apps/*, packages/*, services/*)
d) Détecter les patterns de frameworks (Next.js, Node.js, etc.)
```

**2. Analyse des modules**
```
Pour chaque module :
- Extraire les exports (API publique)
- Mapper les imports (dépendances)
- Identifier les routes (routes API, pages)
- Trouver les modèles de base de données (Supabase, Prisma)
- Localiser les modules queue/worker
```

**3. Génération des Codemaps**
```
Structure :
docs/CODEMAPS/
├── INDEX.md              # Vue d'ensemble de toutes les zones
├── frontend.md           # Structure frontend
├── backend.md            # Structure Backend/API
├── database.md           # Schéma de base de données
├── integrations.md       # Services externes
└── workers.md            # Tâches d'arrière-plan
```

**Format de codemap** :
```markdown
# [Zone] Codemap

**Dernière mise à jour :** AAAA-MM-JJ
**Points d'entrée :** Liste des principaux fichiers

## Architecture

[Diagramme ASCII des relations des composants]

## Modules clés

| Module | Objectif | Exports | Dépendances |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## Flux de données

[Description de comment les données circulent dans cette zone]

## Dépendances externes

- package-name - Objectif, Version
- ...

## Zones connexes

Liens vers d'autres codemaps interagissant avec cette zone
```

**Workflow de mise à jour de documentation** :

**1. Extraction de la documentation à partir du code**
```
- Lire les commentaires JSDoc/TSDoc
- Extraire les sections README de package.json
- Analyser les variables d'environnement à partir de .env.example
- Collecter les définitions d'endpoints API
```

**2. Mise à jour des fichiers de documentation**
```
Fichiers à mettre à jour :
- README.md - Vue d'ensemble du projet, instructions de configuration
- docs/GUIDES/*.md - Guides de fonctionnalités, tutoriels
- package.json - Description, documentation des scripts
- API documentation - Spécifications des endpoints
```

**3. Validation de la documentation**
```
- Vérifier que tous les fichiers mentionnés existent
- Vérifier que tous les liens sont valides
- S'assurer que les exemples sont exécutables
- Vérifier que les extraits de code compilent
```

**Exemples de codemaps spécifiques au projet** :

**Codemap Frontend (docs/CODEMAPS/frontend.md)** :
```markdown
# Architecture Frontend

**Dernière mise à jour :** AAAA-MM-JJ
**Framework :** Next.js 15.1.4 (App Router)
**Point d'entrée :** website/src/app/layout.tsx

## Structure

website/src/
├── app/                # Next.js App Router
│   ├── api/           # Routes API
│   ├── markets/       # Pages de marchés
│   ├── bot/           # Interaction bot
│   └── creator-dashboard/
├── components/        # Composants React
├── hooks/             # Hooks personnalisés
└── lib/               # Utilitaires

## Composants clés

| Composant | Objectif | Emplacement |
| --- | --- | --- |
| HeaderWallet | Connexion de portefeuille | components/HeaderWallet.tsx |
| MarketsClient | Liste des marchés | app/markets/MarketsClient.js |
| SemanticSearchBar | UI de recherche | components/SemanticSearchBar.js |

## Flux de données

Utilisateur → Page Marchés → Route API → Supabase → Redis (optionnel) → Réponse

## Dépendances externes

- Next.js 15.1.4 - Framework
- React 19.0.0 - Bibliothèque UI
- Privy - Authentification
- Tailwind CSS 3.4.1 - Stylisation
```

**Codemap Backend (docs/CODEMAPS/backend.md)** :
```markdown
# Architecture Backend

**Dernière mise à jour :** AAAA-MM-JJ
**Runtime :** Next.js API Routes
**Point d'entrée :** website/src/app/api/

## Routes API

| Route | Méthode | Objectif |
| --- | --- | --- |
| /api/markets | GET | Lister tous les marchés |
| /api/markets/search | GET | Recherche sémantique |
| /api/market/[slug] | GET | Marché unique |
| /api/market-price | GET | Prix en temps réel |

## Flux de données

Route API → Requête Supabase → Redis (cache) → Réponse

## Services externes

- Supabase - Base de données PostgreSQL
- Redis Stack - Recherche vectorielle
- OpenAI - Embeddings
```

**Modèle de mise à jour README** :

Lors de la mise à jour de README.md :
```markdown
# Nom du projet

Brève description

## Configuration
\`\`\`bash
# Installation
npm install

# Variables d'environnement
cp .env.example .env.local
# Remplir : OPENAI_API_KEY, REDIS_URL, etc.

# Développement
npm run dev

# Build
npm run build
\`\`\`

## Architecture

Voir [docs/CODEMAPS/INDEX.md](docs/CODEMAPS/INDEX.md) pour l'architecture détaillée.

### Répertoires clés

- `src/app` - Pages et routes API Next.js App Router
- `src/components` - Composants React réutilisables
- `src/lib` - Bibliothèques d'utilitaires et clients

## Fonctionnalités

- [Fonctionnalité 1] - Description
- [Fonctionnalité 2] - Description

## Documentation

- [Guide de configuration](docs/GUIDES/setup.md)
- [Référence API](docs/GUIDES/api.md)
- [Architecture](docs/CODEMAPS/INDEX.md)

## Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md)
```

## Quel Agent appeler pour quelle tâche

Selon votre type de tâche, choisissez l'agent approprié :

| Type de tâche | Recommandé | Alternative |
| --- | --- | --- |
| **Planifier une nouvelle fonctionnalité** | `/plan` → agent planner | Appel manuel de l'agent planner |
| **Conception d'architecture système** | Appel manuel de l'agent architect | `/orchestrate` → appel séquentiel des agents |
| **Écrire une nouvelle fonctionnalité** | `/tdd` → agent tdd-guide | planner → tdd-guide |
| **Corriger un bug** | `/tdd` → agent tdd-guide | build-error-resolver (si erreur de type) |
| **Revue de code** | `/code-review` → agent code-reviewer | Appel manuel de l'agent code-reviewer |
| **Audit de sécurité** | Appel manuel de l'agent security-reviewer | code-reviewer (couverture partielle) |
| **Échec de build** | `/build-fix` → agent build-error-resolver | Correction manuelle |
| **Tests E2E** | `/e2e` → agent e2e-runner | Écriture manuelle des tests Playwright |
| **Nettoyage de code mort** | `/refactor-clean` → agent refactor-cleaner | Suppression manuelle |
| **Mise à jour documentation** | `/update-docs` → agent doc-updater | `/update-codemaps` → agent doc-updater |

## Exemples de collaboration entre Agents

### Scénario 1 : Développement d'une nouvelle fonctionnalité from scratch

```
1. /plan (agent planner)
   - Créer un plan d'implémentation
   - Identifier les dépendances et risques

2. /tdd (agent tdd-guide)
   - Écrire les tests selon le plan
   - Implémenter la fonctionnalité
   - Assurer la couverture

3. /code-review (agent code-reviewer)
   - Réviser la qualité du code
   - Vérifier les vulnérabilités de sécurité

4. /verify (commande)
   - Exécuter le build, vérification des types, tests
   - Vérifier les console.log, statut git
```

### Scénario 2 : Correction d'une erreur de build

```
1. /build-fix (agent build-error-resolver)
   - Corriger les erreurs TypeScript
   - Assurer que le build passe

2. /test-coverage (commande)
   - Vérifier si la couverture est conforme

3. /code-review (agent code-reviewer)
   - Réviser le code corrigé
```

### Scénario 3 : Nettoyage de code

```
1. /refactor-clean (agent refactor-cleaner)
   - Exécuter les outils de détection
   - Supprimer le code mort
   - Fusionner le code dupliqué

2. /update-docs (agent doc-updater)
   - Mettre à jour les codemaps
   - Rafraîchir la documentation

3. /verify (commande)
   - Exécuter toutes les vérifications
```

## Résumé de cette leçon

Everything Claude Code fournit 9 agents spécialisés, chacun se concentrant sur un domaine spécifique :

1. **planner** - Planification de fonctionnalités complexes
2. **architect** - Conception d'architecture système
3. **tdd-guide** - Exécution du workflow TDD
4. **code-reviewer** - Révision de qualité du code
5. **security-reviewer** - Détection de vulnérabilités de sécurité
6. **build-error-resolver** - Correction d'erreurs de build
7. **e2e-runner** - Gestion des tests de bout en bout
8. **refactor-cleaner** - Nettoyage de code mort
9. **doc-updater** - Mise à jour de documentation et codemaps

**Principes fondamentaux** :
- Choisir l'agent approprié selon le type de tâche
- Utiliser la collaboration entre agents pour construire des workflows efficaces
- Les tâches complexes peuvent appeler plusieurs agents en séquence
- Toujours effectuer une revue de code après les modifications

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Workflow de développement TDD](../tdd-workflow/)**.
>
> Vous apprendrez :
> - Comment utiliser `/plan` pour créer un plan d'implémentation
> - Comment utiliser `/tdd` pour exécuter le cycle Red-Green-Refactor
> - Comment assurer 80%+ de couverture de tests
> - Comment utiliser `/verify` pour exécuter une validation complète

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Agent Planner | [agents/planner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| Agent Architect | [agents/architect.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/architect.md) | 1-212 |
| Agent TDD Guide | [agents/tdd-guide.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Agent Code Reviewer | [agents/code-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| Agent Security Reviewer | [agents/security-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| Agent Build Error Resolver | [agents/build-error-resolver.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/build-error-resolver.md) | 1-533 |
| Agent E2E Runner | [agents/e2e-runner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/e2e-runner.md) | 1-709 |
| Agent Refactor Cleaner | [agents/refactor-cleaner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/refactor-cleaner.md) | 1-307 |
| Agent Doc Updater | [agents/doc-updater.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/doc-updater.md) | 1-453 |

**Constantes clés** :
- Aucune

**Fonctions clés** :
- Aucune

</details>
