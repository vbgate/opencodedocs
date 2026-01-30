---
title: "Skills Intégrés : Automatisation Navigateur et Git | oh-my-opencode"
sidebarTitle: "4 Skills Couteau Suisse"
subtitle: "Skills Intégrés : Automatisation Navigateur, Design UI/UX et Expert Git"
description: "Apprenez les 4 skills intégrés d'oh-my-opencode : playwright, frontend-ui-ux, git-master, dev-browser. Maîtrisez l'automatisation navigateur, le design UI et les opérations Git."
tags:
  - "skills"
  - "automatisation-navigateur"
  - "git"
  - "ui-ux"
prerequisite:
  - "categories-skills"
order: 110
---

# Skills Intégrés : Automatisation Navigateur, Design UI/UX et Expert Git

## Ce Que Vous Allez Apprendre

Grâce à ce cours, vous apprendrez à :
- Utiliser `playwright` ou `agent-browser` pour les tests d'automatisation navigateur et le scraping de données
- Adopter une perspective de designer pour créer de belles interfaces UI/UX
- Automatiser les opérations Git, y compris les commits atomiques, la recherche dans l'historique et le rebase
- Utiliser `dev-browser` pour le développement d'automatisation navigateur persistante

## Vos Frustrations Actuelles

Vous êtes-vous déjà trouvé dans ces situations :
- Vous voulez tester une page frontend, mais cliquer manuellement est trop lent, et vous ne savez pas écrire de scripts Playwright
- Après avoir écrit du code, vos messages de commit sont un désordre et votre historique est un chaos
- Vous devez concevoir une interface UI mais ne savez pas par où commencer, et le résultat manque d'esthétique
- Vous avez besoin d'automatiser des opérations navigateur mais devez vous reconnecter à chaque fois

**Les Skills Intégrés** sont le couteau suisse qu'il vous faut — chaque Skill est un expert dans un domaine spécifique, prêt à résoudre rapidement ces frustrations.

## Quand Utiliser Cette Approche

| Scénario | Skill Recommandé | Pourquoi |
|---|---|---|
| L'interface frontend a besoin d'un beau design | `frontend-ui-ux` | Perspective designer, attention à la typographie, couleurs, animations |
| Tests navigateur, captures d'écran, scraping | `playwright` ou `agent-browser` | Capacités complètes d'automatisation navigateur |
| Commits Git, recherche historique, gestion branches | `git-master` | Détection automatique du style de commit, génération de commits atomiques |
| Opérations navigateur multiples (état de connexion persistant) | `dev-browser` | Persistance de l'état de la page, support de la réutilisation |

## Concept Clé

**Qu'est-ce qu'un Skill ?**

Un Skill est un mécanisme qui injecte des **connaissances professionnelles** et des **outils dédiés** dans l'agent. Lorsque vous utilisez `delegate_task` avec le paramètre `load_skills`, le système va :
1. Charger le `template` du Skill comme partie du prompt système
2. Injecter les serveurs MCP configurés dans le Skill (s'il y en a)
3. Limiter la gamme d'outils disponibles (s'il y a des `allowedTools`)

**Skills Intégrés vs Skills Personnalisés**

- **Skills Intégrés** : Prêts à l'emploi, prompts et outils préconfigurés
- **Skills Personnalisés** : Vous pouvez créer vos propres SKILL.md dans `.opencode/skills/` ou `~/.claude/skills/`

Ce cours se concentre sur 4 Skills Intégrés qui couvrent les scénarios de développement les plus courants.

## 🎒 Préparation Avant de Commencer

Avant de commencer à utiliser les Skills Intégrés, assurez-vous de :
- [ ] Avoir suivi le cours sur [Categories et Skills](../categories-skills/)
- [ ] Comprendre l'utilisation de base de l'outil `delegate_task`
- [ ] Savoir que les Skills d'automatisation navigateur nécessitent de démarrer les serveurs correspondants (Playwright MCP ou agent-browser)

---

## Skill 1 : playwright (Automatisation Navigateur)

### Vue d'Ensemble

Le Skill `playwright` utilise le serveur MCP Playwright pour fournir des capacités complètes d'automatisation navigateur :
- Navigation et interaction avec les pages
- Localisation et manipulation d'éléments (clics, remplissage de formulaires)
- Captures d'écran et export PDF
- Interception et simulation de requêtes réseau

**Scénarios Applicables** : Validation UI, tests E2E, captures d'écran web, scraping de données

### Suivez-Moi : Valider la Fonctionnalité d'un Site

**Scénario** : Vous devez vérifier que la fonctionnalité de connexion fonctionne correctement.

#### Étape 1 : Déclencher le Skill playwright

Dans OpenCode, entrez :

```
Utilise playwright pour naviguer vers https://example.com/login, capture un screenshot montrant l'état de la page
```

**Vous devriez voir** : L'agent invoquera automatiquement l'outil MCP Playwright, ouvrira le navigateur et capturera un screenshot.

#### Étape 2 : Remplir le Formulaire et Soumettre

Continuez avec :

```
Utilise playwright pour remplir les champs nom d'utilisateur et mot de passe (user@example.com / password123), puis clique sur le bouton de connexion, capture un screenshot du résultat
```

**Vous devriez voir** : L'agent localisera automatiquement les éléments du formulaire, remplira les données, cliquera sur le bouton et retournera un screenshot du résultat.

#### Étape 3 : Vérifier la Redirection

```
Attends le chargement de la page, vérifie si l'URL redirige vers /dashboard
```

**Vous devriez voir** : L'agent rapporte l'URL actuelle confirmant le succès de la redirection.

### Point de Vérification ✅

- [ ] Le navigateur peut naviguer avec succès vers la page cible
- [ ] Les opérations de remplissage de formulaire et de clic s'exécutent normalement
- [ ] Le screenshot peut afficher clairement l'état de la page

::: tip Configuration
Par défaut, le moteur d'automatisation navigateur utilise `playwright`. Si vous souhaitez passer à `agent-browser`, configurez dans `oh-my-opencode.json` :

```json
{
  "browser_automation_engine": {
    "provider": "agent-browser"
  }
}
```
:::

---

## Skill 2 : frontend-ui-ux (Perspective Designer)

### Vue d'Ensemble

Le Skill `frontend-ui-ux` transforme l'agent en un rôle de "développeur designer" :
- Se concentre sur **typographie, couleurs, animations** et autres détails visuels
- Met en avant **des directions esthétiques audacieuses** (minimalisme, maximalisme, rétro-futurisme, etc.)
- Fournit **principes de design** : éviter les polices génériques (Inter, Roboto, Arial), créer des palettes de couleurs uniques

**Scénarios Applicables** : Conception de composants UI, amélioration d'interfaces, construction de systèmes visuels

### Suivez-Moi : Concevoir un Tableau de Bord Élégant

**Scénario** : Vous devez concevoir un tableau de bord de statistiques, mais n'avez pas de maquette.

#### Étape 1 : Activer le Skill frontend-ui-ux

```
Utilise le skill frontend-ui-ux pour concevoir une page de tableau de bord de statistiques
Exigences : inclure 3 cartes de données (utilisateurs, revenus, commandes), utiliser un style de design moderne
```

**Vous devriez voir** : L'agent effectuera d'abord une "planification de design", déterminant le but, le ton, les contraintes et les points de différenciation.

#### Étape 2 : Clarifier la Direction Esthétique

L'agent vous demandera (ou déterminera en interne) le style de design. Par exemple :

```
**Choix de Direction Esthétique** :
- Minimalisme (Minimalist)
- Maximalisme (Maximalist)
- Rétro-futurisme (Retro-futuristic)
- Luxe/Raffiné (Luxury/Refined)
```

Réponse : **Minimalisme**

**Vous devriez voir** : L'agent génère des spécifications de design (polices, couleurs, espacements) basées sur la direction choisie.

#### Étape 3 : Générer le Code

```
Basé sur les spécifications de design ci-dessus, implémente cette page de tableau de bord avec React + Tailwind CSS
```

**Vous devriez voir** :
- Une typographie et des espacements soigneusement conçus
- Une palette de couleurs distinctive mais harmonieuse (pas le dégradé violet habituel)
- Des animations et transitions subtiles

### Point de Vérification ✅

- [ ] La page adopte un style de design unique, pas le "slop IA" générique
- [ ] Le choix de police est distinctif, évite Inter/Roboto/Arial
- [ ] Le schéma de couleurs est cohérent avec une hiérarchie visuelle claire

::: tip Différence avec un Agent Ordinaire
Un agent ordinaire peut écrire du code fonctionnellement correct, mais l'interface manque d'esthétique. La valeur principale du Skill `frontend-ui-ux` réside dans :
- L'accent mis sur le processus de design (planification > codage)
- Des directives esthétiques claires
- Des avertissements contre les anti-patterns (design générique, dégradé violet)
:::

---

## Skill 3 : git-master (Expert Git)

### Vue d'Ensemble

Le Skill `git-master` est un expert Git intégrant trois capacités professionnelles :
1. **Architecte de Commits** : Commits atomiques, ordre des dépendances, détection de style
2. **Chirurgien Rebase** : Réécriture d'historique, résolution de conflits, nettoyage de branches
3. **Archéologue de l'Historique** : Trouver quand/où une modification spécifique a été introduite

**Principe Clé** : Par défaut, créer **plusieurs commits**, rejeter le comportement paresseux d'"un commit contenant plusieurs fichiers".

**Scénarios Applicables** : Validation de code, recherche dans l'historique, gestion de branches, opérations rebase

### Suivez-Moi : Commits Intelligents

**Scénario** : Vous avez modifié 5 fichiers et devez valider le code.

#### Étape 1 : Déclencher le Skill git-master (recommandé avec catégorie quick)

```
Utilise delegate_task(category='quick', load_skills=['git-master']) pour soumettre les modifications de code actuelles
```

**Pourquoi utiliser la catégorie `quick` ?**
- Les opérations Git ne nécessitent pas de raisonnement complexe
- Le modèle `claude-haiku-4-5` est suffisamment rapide
- Optimisation des coûts (Haiku est 10x moins cher qu'Opus)

**Vous devriez voir** : L'agent effectue une analyse parallèle (Phase 0), incluant :
- `git status` et `git diff --stat`
- Journal des 30 derniers commits (pour détection de style)
- État de la branche actuelle

#### Étape 2 : Détection de Style (Phase 1)

L'agent affichera :

```
RÉSULTAT DE DÉTECTION DE STYLE
===============================
Analysé : 30 commits depuis git log

Langue : ANGLAIS
  - Commits en anglais : 28 (93%)

Style : SÉMANTIQUE
  - Sémantique (feat:, fix:, etc.) : 25 (83%)
  - Simple : 3 (10%)

Exemples de référence du dépôt :
  1. "feat: add user authentication"
  2. "fix: resolve database connection issue"
  3. "refactor: extract validation logic"

Tous les commits suivront : ANGLAIS + SÉMANTIQUE
```

**Vous devriez voir** : L'agent vous indique clairement le style de commit et la langue à utiliser.

#### Étape 3 : Planification des Commits Atomiques (Phase 3)

L'agent analysera les modifications de fichiers et affichera :

```
PLAN DE COMMIT
==============
Fichiers modifiés : 5
Nombre minimum de commits requis : ceil(5/3) = 2
Commits planifiés : 3
Statut : 3 >= 2 (PASS)

COMMIT 1 : feat: add authentication service
  - src/services/auth.ts
  - src/types/auth.ts
  Justification : implémentation du service + ses définitions de types

COMMIT 2 : feat: implement login page
  - src/pages/login.tsx
  - src/components/login-form.tsx
  Justification : page et ses composants

COMMIT 3 : feat: add API endpoint
  - src/api/auth.ts
  - tests/auth.test.ts
  Justification : endpoint API + son test

Ordre d'exécution : Commit 1 -> Commit 2 -> Commit 3
```

**Vous devriez voir** : L'agent divise clairement les commits et explique pourquoi ces fichiers doivent être ensemble.

#### Étape 4 : Exécution des Commits (Phase 5)

L'agent exécutera automatiquement :
```bash
git add src/services/auth.ts src/types/auth.ts
git commit -m "feat: add authentication service"

git add src/pages/login.tsx src/components/login-form.tsx
git commit -m "feat: implement login page"

git add src/api/auth.ts tests/auth.test.ts
git commit -m "feat: add API endpoint"
```

**Vous devriez voir** :
- 3 commits distincts, chacun avec un message sémantique clair
- Répertoire de travail propre (`git status` sans fichiers non commités)

### Point de Vérification ✅

- [ ] L'agent a effectué une détection de style et l'a clairement indiqué
- [ ] Le nombre de commits satisfait la règle du "nombre minimum de commits" (nombre de fichiers / 3, arrondi au supérieur)
- [ ] Chaque message de commit correspond au style détecté (sémantique, description simple, etc.)
- [ ] Les fichiers de test sont dans le même commit que les fichiers d'implémentation

::: tip Fonction de Recherche dans l'Historique
`git-master` supporte également une recherche puissante dans l'historique :

- "quand X a-t-il été ajouté" → `git log -S` (recherche pickaxe)
- "qui a écrit cette ligne" → `git blame`
- "quand le bug a-t-il commencé" → `git bisect`
- "trouver les commits modifiant le motif X" → `git log -G` (recherche regex)

Exemple : `Utilise git-master pour trouver dans quel commit la fonction 'calculate_discount' a été ajoutée`
:::

::: warning Anti-Pattern : Un Seul Gros Commit
La règle obligatoire de `git-master` est :

| Nombre de Fichiers | Nombre Minimum de Commits |
|---|---|
| 3+ fichiers | 2+ commits |
| 5+ fichiers | 3+ commits |
| 10+ fichiers | 5+ commits |

Si l'agent tente de committer plusieurs fichiers en 1 fois, il échouera automatiquement et replanifiera.
:::

---

## Skill 4 : dev-browser (Navigateur Développeur)

### Vue d'Ensemble

Le Skill `dev-browser` fournit des capacités d'automatisation navigateur persistantes :
- **Persistance de l'État de Page** : Maintient l'état de connexion entre plusieurs exécutions de scripts
- **ARIA Snapshot** : Découverte automatique des éléments de page, retourne une structure arborescente avec références (`@e1`, `@e2`)
- **Support Double Mode** :
  - **Mode Standalone** : Démarre un nouveau navigateur Chromium
  - **Mode Extension** : Se connecte au navigateur Chrome existant de l'utilisateur

**Scénarios Applicables** : Opérations navigateur multiples nécessitant un état de connexion maintenu, automatisation de flux de travail complexes

### Suivez-Moi : Écrire un Script pour les Opérations Post-Connexion

**Scénario** : Vous devez automatiser une série d'opérations après connexion, tout en maintenant l'état de session.

#### Étape 1 : Démarrer le Serveur dev-browser

**macOS/Linux** :
```bash
cd skills/dev-browser && ./server.sh &
```

**Windows (PowerShell)** :
```powershell
cd skills/dev-browser
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"
```

**Vous devriez voir** : Le console affiche le message `Ready`.

#### Étape 2 : Écrire le Script de Connexion

Dans OpenCode, entrez :

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**Vous devriez voir** : Le navigateur ouvre la page de connexion et affiche le titre et l'URL de la page.

#### Étape 3 : Ajouter les Opérations de Remplissage de Formulaire

Modifiez le script :

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

// Obtenir l'ARIA snapshot
const snapshot = await client.getAISnapshot("login");
console.log(snapshot);

// Sélectionner et remplir le formulaire (selon la ref dans le snapshot)
await client.fill("input[name='username']", "user@example.com");
await client.fill("input[name='password']", "password123");
await client.click("button[type='submit']");

await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url(),
  loggedIn: page.url().includes("/dashboard")
});

await client.disconnect();
EOF
```

**Vous devriez voir** :
- Sortie de l'ARIA Snapshot (affichant les éléments de page et leurs références)
- Remplissage automatique du formulaire et soumission
- Redirection de la page vers le dashboard (validation de la connexion réussie)

#### Étape 4 : Réutiliser l'État de Connexion

Maintenant, écrivez un second script pour opérer sur une page nécessitant une connexion :

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();

// Réutilise la page "login" précédemment créée (session sauvegardée)
const page = await client.page("login");

// Accède directement à une page nécessitant une connexion
await page.goto("https://example.com/settings");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**Vous devriez voir** : La page accède directement à la page des paramètres sans nécessiter de reconnexion (car l'état de session est sauvegardé).

### Point de Vérification ✅

- [ ] Le serveur dev-browser démarre avec succès et affiche `Ready`
- [ ] L'ARIA Snapshot découvre correctement les éléments de la page
- [ ] L'état de session post-connexion peut être réutilisé entre les scripts
- [ ] Pas besoin de se reconnecter entre plusieurs exécutions de script

::: tip Différence entre playwright et dev-browser

| Caractéristique | playwright | dev-browser |
|---|---|---|
| **Persistance de Session** | ❌ Nouvelle session à chaque fois | ✅ Sauvegardée entre scripts |
| **ARIA Snapshot** | ❌ Utilise l'API Playwright | ✅ Génération auto de références |
| **Mode Extension** | ❌ Non supporté | ✅ Connexion au navigateur utilisateur |
| **Scénarios Applicables** | Opération unique, test | Opérations multiples, flux complexe |
:::

---

## Meilleures Pratiques

### 1. Choisir le Skill Approprié

Choisissez le Skill selon le type de tâche :

| Type de Tâche | Combinaison Recommandée |
|---|---|
| Commit Git rapide | `delegate_task(category='quick', load_skills=['git-master'])` |
| Conception d'interface UI | `delegate_task(category='visual-engineering', load_skills=['frontend-ui-ux'])` |
| Validation navigateur | `delegate_task(category='quick', load_skills=['playwright'])` |
| Flux navigateur complexe | `delegate_task(category='quick', load_skills=['dev-browser'])` |

### 2. Combiner Plusieurs Skills

Vous pouvez charger plusieurs Skills simultanément :

```typescript
delegate_task(
  category="quick",
  load_skills=["git-master", "playwright"],
  prompt="Teste la fonctionnalité de connexion, puis commite le code"
)
```

### 3. Éviter les Erreurs Courantes

::: warning Attention

- ❌ **Erreur** : Spécifier manuellement le message de commit lors de l'utilisation de `git-master`
  - ✅ **Correct** : Laisser `git-master` détecter et générer automatiquement un message conforme au style du projet

- ❌ **Erreur** : Demander "juste normal" lors de l'utilisation de `frontend-ui-ux`
  - ✅ **Correct** : Laisser l'agent exprimer pleinement ses capacités de designer pour créer un design unique

- ❌ **Erreur** : Utiliser des annotations de type TypeScript dans les scripts `dev-browser`
  - ✅ **Correct** : Utiliser du JavaScript pur dans `page.evaluate()` (le navigateur ne comprend pas la syntaxe TS)
:::

---

## Résumé du Cours

Ce cours a présenté 4 Skills Intégrés :

| Skill | Valeur Principale | Scénarios Typiques |
|---|---|---|
| **playwright** | Automatisation navigateur complète | Tests UI, captures d'écran, scraping |
| **frontend-ui-ux** | Perspective designer, esthétique prioritaire | Conception composants UI, amélioration interface |
| **git-master** | Opérations Git automatisées, commits atomiques | Validation code, recherche historique |
| **dev-browser** | Sessions persistantes, flux complexes | Opérations navigateur multiples |

**Points Clés** :
1. **Skill = Connaissances Professionnelles + Outils** : Injecte les meilleures pratiques d'un domaine spécifique dans l'agent
2. **Utilisation Combinée** : `delegate_task(category=..., load_skills=[...])` pour une correspondance précise
3. **Optimisation des Coûts** : Utilisez la catégorie `quick` pour les tâches simples, évitez les modèles coûteux
4. **Avertissements Anti-Patterns** : Chaque Skill a des directives claires sur ce qu'il ne faut pas faire

---

## Aperçu du Cours Suivant

> Dans le cours suivant, nous apprendrons **[Hooks de Cycle de Vie](../lifecycle-hooks/)**.
>
> Vous découvrirez :
> - Les rôles et l'ordre d'exécution des 32 hooks de cycle de vie
> - Comment automatiser l'injection de contexte et la récupération d'erreurs
> - Les méthodes de configuration des hooks courants (todo-continuation-enforcer, keyword-detector, etc.)

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonctionnalité | Chemin du Fichier | Ligne |
|---|---|---|
| Définition Skill playwright | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 4-16 |
| Fonction createBuiltinSkills | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 1723-1729 |
| Définition type BuiltinSkill | [`src/features/builtin-skills/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/types.ts) | 3-16 |
| Logique de chargement Skills intégrés | [`src/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/index.ts) | 51, 311-319 |
| Configuration moteur navigateur | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | - |

**Configuration Clé** :
- `browser_automation_engine.provider` : Moteur d'automatisation navigateur (défaut `playwright`, option `agent-browser`)
- `disabled_skills` : Liste des Skills désactivés

**Fonctions Clés** :
- `createBuiltinSkills(options)` : Retourne le tableau de Skills correspondant selon la configuration du moteur navigateur

</details>
