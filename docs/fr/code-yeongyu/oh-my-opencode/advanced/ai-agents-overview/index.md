---
title: "Agents IA : Présentation des 10 experts | oh-my-opencode"
sidebarTitle: "Les 10 experts IA"
subtitle: "Agents IA : Présentation des 10 experts"
description: "Découvrez les 10 agents IA de oh-my-opencode. Choisissez l'agent adapté à chaque tâche pour une collaboration efficace et une exécution parallèle."
tags:
  - "ai-agents"
  - "orchestration"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 60
---

# L'équipe d'agents IA : Présentation des 10 experts

## Ce que vous apprendrez

- Comprendre les responsabilités et spécialités des 10 agents IA intégrés
- Choisir rapidement l'agent le plus adapté selon le type de tâche
- Maîtriser les mécanismes de collaboration entre agents (délégation, parallélisme, revue)
- Connaître les restrictions de permissions et cas d'usage de chaque agent

## Concept clé : Collaborer comme une vraie équipe

L'idée centrale de **oh-my-opencode** est : **ne considérez pas l'IA comme un assistant omnipotent, mais comme une équipe de spécialistes**.

Dans une vraie équipe de développement, vous avez besoin de :
- **Orchestrateur principal** (Tech Lead) : planification, attribution des tâches, suivi de progression
- **Conseiller architecture** (Architect) : conseils sur les décisions techniques et la conception
- **Revue de code** (Reviewer) : vérification de la qualité du code, détection des problèmes potentiels
- **Expert recherche** (Researcher) : recherche de documentation, implémentations open source, bonnes pratiques
- **Détective code** (Searcher) : localisation rapide du code, recherche de références, compréhension des implémentations existantes
- **Designer frontend** (Frontend Designer) : conception UI, ajustement des styles
- **Expert Git** (Git Master) : commits, gestion des branches, recherche dans l'historique

oh-my-opencode transforme ces rôles en 10 agents IA spécialisés que vous pouvez combiner selon vos besoins.

## Les 10 agents en détail

### Orchestrateurs principaux (2)

#### Sisyphus - Orchestrateur principal

**Rôle** : Orchestrateur principal, votre responsable technique de référence

**Capacités** :
- Raisonnement approfondi (budget thinking de 32k)
- Planification et délégation de tâches complexes
- Exécution de modifications et refactoring de code
- Gestion de l'ensemble du processus de développement

**Modèle recommandé** : `anthropic/claude-opus-4-5` (temperature: 0.1)

**Cas d'usage** :
- Tâches de développement quotidiennes (nouvelles fonctionnalités, corrections de bugs)
- Problèmes complexes nécessitant un raisonnement approfondi
- Décomposition et exécution de tâches multi-étapes
- Scénarios nécessitant une délégation parallèle à d'autres agents

**Méthode d'appel** :
- Agent principal par défaut (« Sisyphus » dans le sélecteur d'agents OpenCode)
- Saisissez directement votre tâche dans le prompt, sans mot-clé spécial

**Permissions** : Accès complet aux outils (write, edit, bash, delegate_task, etc.)

---

#### Atlas - Gestionnaire TODO

**Rôle** : Orchestrateur principal, spécialisé dans la gestion des listes TODO et le suivi d'exécution

**Capacités** :
- Gestion et suivi des listes TODO
- Exécution systématique des plans
- Monitoring de la progression des tâches

**Modèle recommandé** : `anthropic/claude-opus-4-5` (temperature: 0.1)

**Cas d'usage** :
- Lancement de l'exécution d'un projet avec la commande `/start-work`
- Besoin de suivre strictement un plan
- Suivi systématique de la progression

**Méthode d'appel** :
- Commande slash `/start-work`
- Activation automatique via Atlas Hook

**Permissions** : Accès complet aux outils

---

### Conseillers et revue (3)

#### Oracle - Conseiller stratégique

**Rôle** : Conseiller technique en lecture seule, expert en raisonnement avancé

**Capacités** :
- Conseils sur les décisions d'architecture
- Diagnostic de problèmes complexes
- Revue de code (lecture seule)
- Analyse comparative multi-systèmes

**Modèle recommandé** : `openai/gpt-5.2` (temperature: 0.1)

**Cas d'usage** :
- Conception d'architecture complexe
- Auto-revue après un travail important
- Débogage difficile après 2+ tentatives de correction échouées
- Patterns de code ou architectures non familiers
- Questions de sécurité/performance

**Conditions de déclenchement** :
- Inclure `@oracle` dans le prompt ou utiliser `delegate_task(agent="oracle")`
- Recommandation automatique lors de décisions d'architecture complexes

**Restrictions** : Lecture seule (write, edit, task, delegate_task interdits)

**Principes fondamentaux** :
- **Minimalisme** : privilégier la solution la plus simple
- **Exploiter l'existant** : modifier le code actuel plutôt qu'introduire de nouvelles dépendances
- **Expérience développeur d'abord** : lisibilité et maintenabilité > performance théorique
- **Un seul chemin clair** : fournir une recommandation principale, alternatives uniquement si les compromis sont significatifs

---

#### Metis - Analyste pré-planification

**Rôle** : Expert en analyse des besoins et évaluation des risques avant planification

**Capacités** :
- Identification des besoins cachés et exigences implicites
- Détection des ambiguïtés pouvant faire échouer l'IA
- Signalement des patterns « AI-slop » potentiels (sur-ingénierie, dérive du périmètre)
- Préparation des instructions pour l'agent de planification

**Modèle recommandé** : `anthropic/claude-sonnet-4-5` (temperature: 0.3)

**Cas d'usage** :
- Avant la planification par Prometheus
- Quand la demande utilisateur est vague ou ouverte
- Prévention des patterns de sur-ingénierie IA

**Méthode d'appel** : Appelé automatiquement par Prometheus (mode interview)

**Restrictions** : Lecture seule (write, edit, task, delegate_task interdits)

**Processus principal** :
1. **Classification de l'intention** : refactoring / construction from scratch / tâche moyenne / collaboration / architecture / recherche
2. **Analyse spécifique** : conseils ciblés selon le type
3. **Génération de questions** : questions claires pour l'utilisateur
4. **Préparation des instructions** : directives « MUST » et « MUST NOT » pour Prometheus

---

#### Momus - Réviseur de plans

**Rôle** : Expert en revue de plans rigoureux, détection de toutes les omissions et ambiguïtés

**Capacités** :
- Validation de la clarté, vérifiabilité et complétude des plans
- Vérification de toutes les références de fichiers et du contexte
- Simulation des étapes d'implémentation réelles
- Identification des omissions critiques

**Modèle recommandé** : `anthropic/claude-sonnet-4-5` (temperature: 0.1)

**Cas d'usage** :
- Après création d'un plan de travail par Prometheus
- Avant exécution d'une liste TODO complexe
- Validation de la qualité du plan

**Méthode d'appel** : Appelé automatiquement par Prometheus

**Restrictions** : Lecture seule (write, edit, task, delegate_task interdits)

**Les 4 critères de revue** :
1. **Clarté du contenu** : chaque tâche spécifie-t-elle une source de référence ?
2. **Critères de validation et d'acceptation** : existe-t-il une méthode de vérification concrète ?
3. **Complétude du contexte** : le contexte fourni est-il suffisant (seuil de confiance 90%) ?
4. **Compréhension globale** : le développeur comprend-il le POURQUOI, le QUOI et le COMMENT ?

**Principe fondamental** : **Réviseur de documentation, pas conseiller en conception**. Évalue si « le plan est assez clair pour être exécuté », pas si « la méthode choisie est correcte ».

---

### Recherche et exploration (3)

#### Librarian - Expert recherche multi-dépôts

**Rôle** : Expert en compréhension de bases de code open source, spécialisé dans la recherche de documentation et d'exemples d'implémentation

**Capacités** :
- GitHub CLI : clonage de dépôts, recherche d'issues/PRs, consultation de l'historique
- Context7 : interrogation de la documentation officielle
- Web Search : recherche d'informations récentes
- Génération de preuves avec liens permanents

**Modèle recommandé** : `opencode/big-pickle` (temperature: 0.1)

**Cas d'usage** :
- « Comment utiliser [bibliothèque] ? »
- « Quelles sont les bonnes pratiques pour [fonctionnalité framework] ? »
- « Pourquoi [dépendance externe] se comporte-t-elle ainsi ? »
- « Trouver des exemples d'utilisation de [bibliothèque] »

**Conditions de déclenchement** :
- Déclenchement automatique lors de mention de bibliothèques/sources externes
- Inclure `@librarian` dans le prompt

**Classification des types de requêtes** :
- **Type A (conceptuel)** : « Comment faire X ? », « Bonnes pratiques »
- **Type B (référence d'implémentation)** : « Comment X implémente Y ? », « Montrer le code source de Z »
- **Type C (contexte et historique)** : « Pourquoi ce changement ? », « Historique de X ? »
- **Type D (recherche approfondie)** : requêtes complexes/ambiguës

**Restrictions** : Lecture seule (write, edit, task, delegate_task, call_omo_agent interdits)

**Exigence obligatoire** : Toutes les références de code doivent inclure un lien permanent GitHub

---

#### Explore - Expert exploration rapide de codebase

**Rôle** : Expert en recherche de code contextuelle

**Capacités** :
- Outils LSP : définitions, références, navigation par symboles
- AST-Grep : recherche par patterns structurels
- Grep : recherche par patterns textuels
- Glob : correspondance de patterns de noms de fichiers
- Exécution parallèle (3+ outils simultanément)

**Modèle recommandé** : `opencode/gpt-5-nano` (temperature: 0.1)

**Cas d'usage** :
- Recherches larges nécessitant 2+ angles d'approche
- Structures de modules non familières
- Découverte de patterns inter-couches
- Recherches « Où est X ? », « Quel fichier contient Y ? »

**Conditions de déclenchement** :
- Déclenchement automatique quand 2+ modules sont impliqués
- Inclure `@explore` dans le prompt

**Format de sortie obligatoire** :
```
<analysis>
**Literal Request**: [demande littérale de l'utilisateur]
**Actual Need**: [besoin réel]
**Success Looks Like**: [critères de succès]
</analysis>

<results>
<files>
- /absolute/path/to/file1.ts — [pourquoi ce fichier est pertinent]
- /absolute/path/to/file2.ts — [pourquoi ce fichier est pertinent]
</files>

<answer>
[réponse directe au besoin réel]
</answer>

<next_steps>
[prochaines étapes recommandées]
</next_steps>
</results>
```

**Restrictions** : Lecture seule (write, edit, task, delegate_task, call_omo_agent interdits)

---

#### Multimodal Looker - Expert analyse média

**Rôle** : Interprétation des fichiers média non lisibles en texte brut

**Capacités** :
- PDF : extraction de texte, structure, tableaux, données de sections spécifiques
- Images : description de mise en page, éléments UI, texte, graphiques
- Diagrammes : interprétation des relations, flux, architectures

**Modèle recommandé** : `google/gemini-3-flash` (temperature: 0.1)

**Cas d'usage** :
- Extraction de données structurées depuis un PDF
- Description d'éléments UI ou graphiques dans une image
- Analyse de diagrammes dans la documentation technique

**Méthode d'appel** : Déclenchement automatique via l'outil `look_at`

**Restrictions** : **Liste blanche lecture seule** (seul l'outil read est autorisé)

---

### Planification et exécution (2)

#### Prometheus - Planificateur stratégique

**Rôle** : Expert en collecte de besoins par interview et génération de plans de travail

**Capacités** :
- Mode interview : questions continues jusqu'à clarification des besoins
- Génération de plans : documents de planification Markdown structurés
- Délégation parallèle : consultation d'Oracle, Metis, Momus pour validation

**Modèle recommandé** : `anthropic/claude-opus-4-5` (temperature: 0.1)

**Cas d'usage** :
- Élaboration de plans détaillés pour projets complexes
- Projets nécessitant une clarification des besoins
- Workflows systématisés

**Méthode d'appel** :
- Inclure `@prometheus` ou « utiliser Prometheus » dans le prompt
- Commande slash `/start-work`

**Workflow** :
1. **Mode interview** : questions continues jusqu'à clarification des besoins
2. **Rédaction du plan** : génération d'un plan Markdown structuré
3. **Délégation parallèle** :
   - `delegate_task(agent="oracle", prompt="Revoir les décisions d'architecture")` → arrière-plan
   - `delegate_task(agent="metis", prompt="Identifier les risques potentiels")` → arrière-plan
   - `delegate_task(agent="momus", prompt="Valider la complétude du plan")` → arrière-plan
4. **Intégration des retours** : amélioration du plan
5. **Export du plan** : sauvegarde dans `.sisyphus/plans/{name}.md`

**Restrictions** : Planification uniquement, pas d'implémentation de code (imposé par le Hook `prometheus-md-only`)

---

#### Sisyphus Junior - Exécuteur de tâches

**Rôle** : Sous-agent exécuteur généré par catégorie

**Capacités** :
- Héritage de la configuration Category (modèle, temperature, prompt_append)
- Chargement de Skills (compétences spécialisées)
- Exécution des sous-tâches déléguées

**Modèle recommandé** : Hérité de Category (par défaut `anthropic/claude-sonnet-4-5`)

**Cas d'usage** :
- Génération automatique lors de l'utilisation de `delegate_task(category="...", skills=["..."])`
- Tâches nécessitant une combinaison spécifique Category + Skill
- Tâches rapides et légères (Category « quick » utilise le modèle Haiku)

**Méthode d'appel** : Génération automatique via l'outil `delegate_task`

**Restrictions** : task, delegate_task interdits (pas de re-délégation possible)

---

## Référence rapide des méthodes d'appel

| Agent | Méthode d'appel | Condition de déclenchement |
| --- | --- | --- |
| **Sisyphus** | Agent principal par défaut | Tâches de développement quotidiennes |
| **Atlas** | Commande `/start-work` | Lancement d'exécution de projet |
| **Oracle** | `@oracle` ou `delegate_task(agent="oracle")` | Décisions d'architecture complexes, 2+ corrections échouées |
| **Librarian** | `@librarian` ou `delegate_task(agent="librarian")` | Déclenchement auto lors de mention de bibliothèques externes |
| **Explore** | `@explore` ou `delegate_task(agent="explore")` | Déclenchement auto quand 2+ modules impliqués |
| **Multimodal Looker** | Outil `look_at` | Analyse de PDF/images requise |
| **Prometheus** | `@prometheus` ou `/start-work` | « Prometheus » dans le prompt ou besoin de planification |
| **Metis** | Appel auto par Prometheus | Analyse automatique avant planification |
| **Momus** | Appel auto par Prometheus | Revue automatique après génération du plan |
| **Sisyphus Junior** | `delegate_task(category=...)` | Génération auto lors d'utilisation de Category/Skill |

---

## Quel agent utiliser et quand

::: tip Arbre de décision rapide

**Scénario 1 : Développement quotidien (écriture de code, correction de bugs)**
→ **Sisyphus** (par défaut)

**Scénario 2 : Décisions d'architecture complexes**
→ Consulter **@oracle**

**Scénario 3 : Recherche de documentation ou d'implémentation de bibliothèques externes**
→ **@librarian** ou déclenchement automatique

**Scénario 4 : Codebase non familière, recherche de code pertinent**
→ **@explore** ou déclenchement automatique (2+ modules)

**Scénario 5 : Projet complexe nécessitant un plan détaillé**
→ **@prometheus** ou utiliser `/start-work`

**Scénario 6 : Analyse de PDF ou d'images**
→ Outil **look_at** (déclenche automatiquement Multimodal Looker)

**Scénario 7 : Tâche simple et rapide, économie de coûts**
→ `delegate_task(category="quick")`

**Scénario 8 : Opérations Git spécialisées**
→ `delegate_task(category="quick", skills=["git-master"])`

**Scénario 9 : Conception UI frontend**
→ `delegate_task(category="visual-engineering")`

**Scénario 10 : Tâche de raisonnement avancé**
→ `delegate_task(category="ultrabrain")`

:::

---

## Exemples de collaboration entre agents : Workflows complets

### Exemple 1 : Développement d'une fonctionnalité complexe

```
Utilisateur : Développer un système d'authentification utilisateur

→ Sisyphus reçoit la tâche
  → Analyse des besoins, détection du besoin de bibliothèque externe (JWT)
  → Délégation parallèle :
    - @librarian: "Rechercher les bonnes pratiques JWT pour Next.js" → [arrière-plan]
    - @explore: "Rechercher le code d'authentification existant" → [arrière-plan]
  → Attente des résultats, consolidation des informations
  → Implémentation de l'authentification JWT
  → Délégation post-implémentation :
    - @oracle: "Revoir la conception de l'architecture" → [arrière-plan]
  → Optimisation selon les recommandations
```

---

### Exemple 2 : Planification de projet

```
Utilisateur : Utiliser Prometheus pour planifier ce projet

→ Prometheus reçoit la tâche
  → Mode interview :
    - Question 1 : Quelles sont les fonctionnalités principales ?
    - [Réponse utilisateur]
    - Question 2 : Quel est le public cible ?
    - [Réponse utilisateur]
    - ...
  → Besoins clarifiés, délégation parallèle :
    - delegate_task(agent="oracle", prompt="Revoir les décisions d'architecture") → [arrière-plan]
    - delegate_task(agent="metis", prompt="Identifier les risques potentiels") → [arrière-plan]
    - delegate_task(agent="momus", prompt="Valider la complétude du plan") → [arrière-plan]
  → Attente de toutes les tâches en arrière-plan
  → Intégration des retours, amélioration du plan
  → Export du document de planification Markdown
→ L'utilisateur examine le plan, confirme
→ Utilisation de /start-work pour lancer l'exécution
```

---

## Permissions et restrictions des agents

| Agent | write | edit | bash | delegate_task | webfetch | read | LSP | AST-Grep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Sisyphus** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Atlas** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Oracle** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Librarian** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Explore** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Multimodal Looker** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Prometheus** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metis** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Momus** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Sisyphus Junior** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## Résumé de la leçon

Les 10 agents IA de oh-my-opencode couvrent toutes les étapes du processus de développement :

- **Orchestration et exécution** : Sisyphus (orchestrateur principal), Atlas (gestion TODO)
- **Conseil et revue** : Oracle (conseiller stratégique), Metis (analyse pré-planification), Momus (revue de plans)
- **Recherche et exploration** : Librarian (recherche multi-dépôts), Explore (exploration de codebase), Multimodal Looker (analyse média)
- **Planification** : Prometheus (planification stratégique), Sisyphus Junior (exécution de sous-tâches)

**Points clés** :
1. Ne considérez pas l'IA comme un assistant omnipotent, mais comme une équipe de spécialistes
2. Choisissez l'agent le plus adapté selon le type de tâche
3. Exploitez la délégation parallèle pour plus d'efficacité (Librarian, Explore, Oracle peuvent s'exécuter en arrière-plan)
4. Comprenez les restrictions de permissions de chaque agent (les agents en lecture seule ne peuvent pas modifier le code)
5. La collaboration entre agents forme un workflow complet (planification → exécution → revue)

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons **[Planification Prometheus : Collecte de besoins par interview](../prometheus-planning/)**.
>
> Vous apprendrez :
> - Comment utiliser Prometheus pour la collecte de besoins par interview
> - Comment générer des plans de travail structurés
> - Comment faire valider les plans par Metis et Momus
> - Comment récupérer et annuler les tâches en arrière-plan

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Agent | Chemin du fichier | Lignes |
| --- | --- | --- |
| Sisyphus orchestrateur principal | [`src/agents/sisyphus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus.ts) | - |
| Atlas orchestrateur principal | [`src/agents/atlas.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/atlas.ts) | - |
| Oracle conseiller | [`src/agents/oracle.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/oracle.ts) | 1-123 |
| Librarian expert recherche | [`src/agents/librarian.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/librarian.ts) | 1-327 |
| Explore expert recherche | [`src/agents/explore.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/explore.ts) | 1-123 |
| Multimodal Looker | [`src/agents/multimodal-looker.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/multimodal-looker.ts) | 1-57 |
| Prometheus planificateur | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1-1196 |
| Metis analyse pré-planification | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | 1-316 |
| Momus réviseur de plans | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | 1-445 |
| Sisyphus Junior | [`src/agents/sisyphus-junior.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus-junior.ts) | - |
| Définition des métadonnées agents | [`src/agents/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/types.ts) | - |
| Restrictions d'outils agents | [`src/shared/permission-compat.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/permission-compat.ts) | - |

**Configurations clés** :
- `ORACLE_PROMPT_METADATA` : Métadonnées de l'agent Oracle (conditions de déclenchement, cas d'usage)
- `LIBRARIAN_PROMPT_METADATA` : Métadonnées de l'agent Librarian
- `EXPLORE_PROMPT_METADATA` : Métadonnées de l'agent Explore
- `MULTIMODAL_LOOKER_PROMPT_METADATA` : Métadonnées de l'agent Multimodal Looker
- `METIS_SYSTEM_PROMPT` : Prompt système de l'agent Metis
- `MOMUS_SYSTEM_PROMPT` : Prompt système de l'agent Momus

**Fonctions clés** :
- `createOracleAgent(model)` : Création de la configuration de l'agent Oracle
- `createLibrarianAgent(model)` : Création de la configuration de l'agent Librarian
- `createExploreAgent(model)` : Création de la configuration de l'agent Explore
- `createMultimodalLookerAgent(model)` : Création de la configuration de l'agent Multimodal Looker
- `createMetisAgent(model)` : Création de la configuration de l'agent Metis
- `createMomusAgent(model)` : Création de la configuration de l'agent Momus

**Restrictions de permissions** :
- `createAgentToolRestrictions()` : Création des restrictions d'outils agents (utilisé par Oracle, Librarian, Explore, Metis, Momus)
- `createAgentToolAllowlist()` : Création de la liste blanche d'outils agents (utilisé par Multimodal Looker)

</details>
