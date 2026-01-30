---
title: "Categories et Skills : Composition Dynamique d'Agents | oh-my-opencode"
sidebarTitle: "Agents Composables comme des Briques"
subtitle: "Categories et Skills : Composition Dynamique d'Agents (v3.0)"
description: "Apprenez le système Categories et Skills d'oh-my-opencode, et maîtrisez la création de sous-agents spécialisés par combinaison de modèles et de connaissances. Grâce aux 7 Categories intégrées, 4 Skills et l'outil delegate_task, optimisez vos coûts de développement."
tags:
  - "categories"
  - "skills"
  - "delegate-task"
  - "sisyphus-junior"
prerequisite:
  - "start-quick-start"
order: 100
---

# Categories et Skills : Composition Dynamique d'Agents (v3.0)

## Ce que vous apprendrez

- ✅ Utiliser les 7 Categories intégrées pour sélectionner automatiquement le meilleur modèle selon le type de tâche
- ✅ Charger les 4 Skills intégrés pour injecter des connaissances professionnelles et des outils MCP dans vos agents
- ✅ Créer des sous-agents spécialisés en combinant Category et Skill via l'outil `delegate_task`
- ✅ Personnaliser vos propres Categories et Skills pour répondre à des besoins spécifiques

## Votre situation actuelle

**Vos agents manquent de professionnalisme ? Les coûts sont trop élevés ?**

Imaginez ce scénario :

| Problème | Approche traditionnelle | Besoin réel |
|---|---|---|
| **Utilisation d'un modèle surpuissant pour des tâches UI** | Employ Claude Opus pour un simple ajustement de style | Coût élevé, gaspillage de ressources de calcul |
| **Utilisation d'un modèle léger pour de la logique complexe** | Employ Haiku pour concevoir une architecture | Capacités d'inférence insuffisantes, solutions erronées |
| **Style de commit Git non uniforme** | Gestion manuelle des commits, sujette aux erreurs | Besoin de détection automatique et de respect des normes du projet |
| **Besoin de tests navigateur** | Ouverture manuelle du navigateur pour vérification | Besoin du support MCP de Playwright |

**Problèmes fondamentaux** :
1. Une seule agent gère toutes les tâches → Modèles et outils inadaptés
2. 10 agents fixes codés en dur → Impossibilité de combinaisons flexibles
3. Absence de compétences professionnelles → Les agents manquent de connaissances spécifiques

**Solution** : Le système Categories et Skills v3.0 vous permet de composer vos agents comme des briques :
- **Category** (abstraction de modèle) : Définit le type de tâche → Sélection automatique du meilleur modèle
- **Skill** (connaissances professionnelles) : Injecte des connaissances et des serveurs MCP → Agents plus professionnels

## Quand utiliser cette approche

| Scénario | Combinaison recommandée | Résultat |
|---|---|---|
| **Conception et implémentation UI** | `category="visual-engineering"` + `skills=["frontend-ui-ux", "playwright"]` | Sélection automatique de Gemini 3 Pro + Mindset de designer + Validation navigateur |
| **Réparation rapide et commit** | `category="quick"` + `skills=["git-master"]` | Faible coût avec Haiku + Détection automatique du style de commit |
| **Analyse d'architecture en profondeur** | `category="ultrabrain"` (sans Skill) | Raisonnement pur avec GPT-5.2 Codex xhigh |
| **Rédaction de documentation** | `category="writing"` (sans Skill) | Génération rapide de documentation avec Gemini 3 Flash |

## 🎒 Prérequis

::: warning Conditions préalables

Avant de commencer ce tutoriel, assurez-vous de :
1. Avoir installé oh-my-opencode (voir [Tutoriel d'installation](../../start/installation/))
2. Avoir configuré au moins un Provider (voir [Configuration Provider](../../platforms/provider-setup/))
3. Comprendre l'utilisation de base de l'outil delegate_task (voir [Tâches en arrière-plan](../background-tasks/))

:::

::: info Concepts clés
**Category** définit "Quel type de travail est-ce ?" (détermine le modèle, la température, le mode de pensée). **Skill** définit "Quelles connaissances et outils sont nécessaires ?" (injecte des invites et des serveurs MCP). En combinant les deux via `delegate_task(category=..., skills=[...])`.
:::

## Concepts fondamentaux

### Categories : Le type de tâche détermine le modèle

oh-my-opencode fournit 7 Categories intégrées, chacune préconfigurée avec le meilleur modèle et mode de pensée :

| Category | Modèle par défaut | Température | Utilisation |
|---|---|---|---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Tâches frontend, UI/UX, design |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | Tâches de raisonnement avancé (décisions d'architecture complexes) |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | Tâches créatives et artistiques (idées nouvelles) |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Tâches rapides et à faible coût (modification de fichier unique) |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tâches de complexité moyenne ne correspondant pas aux autres catégories |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | Tâches de haute qualité ne correspondant pas aux autres catégories |
| `writing` | `google/gemini-3-flash` | 0.1 | Tâches de documentation et d'écriture |

**Pourquoi utiliser les Categories ?**

Différentes tâches nécessitent des modèles aux capacités différentes :
- Conception UI → Besoin de **créativité visuelle** (Gemini 3 Pro)
- Architecture → Besoin de **raisonnement approfondi** (GPT-5.2 Codex xhigh)
- Modifications simples → Besoin de **réponse rapide** (Claude Haiku)

Sélectionner manuellement le modèle pour chaque tâche est fastidieux. Les Categories vous permettent de simplement déclarer le type de tâche, et le système sélectionne automatiquement le meilleur modèle.

### Skills : Injection de connaissances professionnelles

Un Skill est un expert de domaine défini via un fichier SKILL.md, pouvant injecter :
- **Connaissances professionnelles** (extension d'invite)
- **Serveurs MCP** (chargement automatique)
- **Guides de workflow** (étapes opérationnelles spécifiques)

4 Skills intégrés :

| Skill | Fonctionnalité | MCP | Utilisation |
|---|---|---|---|
| `playwright` | Automatisation navigateur | `@playwright/mcp` | Validation UI, captures d'écran, scraping |
| `agent-browser` | Automatisation navigateur (Vercel) | Installation manuelle | Alternative ci-dessus |
| `frontend-ui-ux` | Mentalité de designer | Aucun | Créer des interfaces raffinées |
| `git-master` | Expert Git | Aucun | Commits automatiques, recherche historique, rebase |

**Fonctionnement des Skills** :

Quand vous chargez un Skill, le système :
1. Lit le contenu des invites du fichier SKILL.md
2. Si un MCP est défini, démarre automatiquement le serveur correspondant
3. Ajoute les invites du Skill à l'invite système de l'agent

Par exemple, le Skill `git-master` contient :
- Détection du style de commit (identification automatique du format du projet)
- Règles de commits atomiques (3 fichiers → au moins 2 commits)
- Workflow Rebase (squash, fixup, gestion des conflits)
- Recherche historique (blame, bisect, log -S)

### Sisyphus Junior : L'exécuteur de tâches

Quand vous utilisez une Category, un sous-agent spécial est généré — **Sisyphus Junior**.

**Caractéristiques clés** :
- ✅ Hérite de la configuration du modèle de la Category
- ✅ Hérite des invites des Skills chargés
- ❌ **Ne peut pas déléguer à nouveau** (interdiction d'utiliser les outils `task` et `delegate_task`)

**Pourquoi interdire la délégation ?**

Pour empêcher les boucles infinies et la divergence des tâches :
```
Sisyphus (agent principal)
  ↓ delegate_task(category="quick")
Sisyphus Junior
  ↓ tentative de delegate_task (si autorisé)
Sisyphus Junior 2
  ↓ delegate_task
...Boucle infinie...
```

En interdisant la délégation, Sisyphus Junior se concentre sur l'accomplissement de la tâche assignée, garantissant un objectif clair et une exécution efficace.

## Suivez-moi

### Étape 1 : Correction rapide (Quick + Git Master)

Utilisons un scénario réel : vous avez modifié plusieurs fichiers et devez automatiquement les commiter en respectant le style du projet.

**Pourquoi**
Utiliser le modèle Haiku de la Category `quick` est peu coûteux, et avec le Skill `git-master` qui détecte automatiquement le style de commit, cela permet un commit parfait.

Dans OpenCode, saisissez :

```
Utilisez delegate_task pour commiter les modifications actuelles
- category: quick
- load_skills: ["git-master"]
- prompt: "Commettre toutes les modifications actuelles. Respectez le style de commit du projet (via git log). Assurez-vous des commits atomiques, un commit max 3 fichiers."
- run_in_background: false
```

**Ce que vous devriez voir** :

1. Sisyphus Junior démarre, utilise le modèle `claude-haiku-4-5`
2. Le Skill `git-master` est chargé, les invites contiennent les connaissances d'expert Git
3. L'agent effectue les opérations suivantes :
   ```bash
   # Collecter le contexte en parallèle
   git status
   git diff --stat
   git log -30 --oneline
   ```
4. Détecte le style de commit (ex : Semantic vs Plain vs Short)
5. Planifie les commits atomiques (3 fichiers → au moins 2 commits)
6. Exécute les commits en respectant le style détecté

**Point de contrôle ✅** :

Vérifiez que le commit a réussi :
```bash
git log --oneline -5
```

Vous devriez voir plusieurs commits atomiques, chacun avec un style de message clair.

### Étape 2 : Implémentation et validation UI (Visual + Playwright + UI/UX)

Scénario : vous devez ajouter un composant de graphique responsive à une page et le valider dans le navigateur.

**Pourquoi**
- La Category `visual-engineering` sélectionne Gemini 3 Pro (excellente en conception visuelle)
- Le Skill `playwright` fournit des outils MCP pour les tests navigateur
- Le Skill `frontend-ui-ux` injecte la mentalité de designer (couleurs, mise en page, animations)

Dans OpenCode, saisissez :

```
Utilisez delegate_task pour implémenter le composant de graphique
- category: visual-engineering
- load_skills: ["frontend-ui-ux", "playwright"]
- prompt: "Ajouter un composant de graphique responsive dans la page dashboard. Exigences :
  - Utiliser Tailwind CSS
  - Supporter mobile et desktop
  - Utiliser un schéma de couleurs vif (éviter les dégradés violets)
  - Ajouter des effets d'animation en cascade
  - Valider avec une capture d'écran playwright après"
- run_in_background: false
```

**Ce que vous devriez voir** :

1. Sisyphus Junior démarre, utilise le modèle `google/gemini-3-pro`
2. Charge les invites des deux Skills :
   - `frontend-ui-ux` : guide de mentalité de designer
   - `playwright` : instructions d'automatisation du navigateur
3. Le serveur `@playwright/mcp` démarre automatiquement
4. L'agent effectue :
   - Conception du composant de graphique (applique la mentalité de designer)
   - Implémentation de la mise en page responsive
   - Ajout des effets d'animation
   - Utilisation des outils Playwright :
     ```
     playwright_navigate: http://localhost:3000/dashboard
     playwright_take_screenshot: output=dashboard-chart.png
     ```

**Point de contrôle ✅** :

Vérifiez que le composant est correctement rendu :
```bash
# Vérifier les nouveaux fichiers
git diff --name-only
git diff --stat

# Voir les captures d'écran
ls screenshots/
```

Vous devriez voir :
- Les nouveaux fichiers de composant de graphique
- Le code de style responsive
- Les fichiers de captures d'écran (validation réussie)

### Étape 3 : Analyse approfondie d'architecture (Ultrabrain, raisonnement pur)

Scénario : vous devez concevoir un mode de communication complexe pour une architecture de microservices.

**Pourquoi**
- La Category `ultrabrain` sélectionne GPT-5.2 Codex (xhigh), offrant la plus forte capacité de raisonnement
- Aucun Skill chargé → Raisonnement pur, éviter l'interférence des connaissances professionnelles

Dans OpenCode, saisissez :

```
Utilisez delegate_task pour analyser l'architecture
- category: ultrabrain
- load_skills: []
- prompt: "Concevoir un mode de communication efficace pour notre architecture de microservices. Exigences :
  - Supporter la découverte de services
  - Gérer les partitions réseau
  - Minimiser la latence
  - Fournir une stratégie de repli

  Architecture actuelle : [bref résumé]
  Stack technique : gRPC, Kubernetes, Consul"
- run_in_background: false
```

**Ce que vous devriez voir** :

1. Sisyphus Junior démarre, utilise le modèle `openai/gpt-5.2-codex` (variante xhigh)
2. Aucun Skill chargé
3. L'agent effectue un raisonnement en profondeur :
   - Analyse l'architecture existante
   - Compare les modes de communication (ex : CQRS, Event Sourcing, Saga)
   - Pèse les avantages et inconvénients
   - Fournit des recommandations hiérarchisées (Bottom Line → Action Plan → Risks)

**Structure de sortie** :

```
Bottom Line: Recommandation d'utiliser un mode hybride (gRPC + Event Bus)

Action Plan:
1. Utiliser gRPC pour la communication synchrone entre services
2. Publier les événements clés de manière asynchrone via Event Bus
3. Implémenter l'idempotence pour gérer les messages en double

Risks and Mitigations:
- Risk: Les partitions réseau causent la perte de messages
  Mitigation: Implémenter la réémission de messages et les files d'attente de lettres mortes
```

**Point de contrôle ✅** :

Vérifiez que la solution est complète :
- La découverte de services est-elle prise en compte ?
- Les partitions réseau sont-elles gérées ?
- Une stratégie de repli est-elle fournie ?

### Étape 4 : Category personnalisée (optionnel)

Si les Categories intégrées ne répondent pas à vos besoins, vous pouvez les personnaliser dans `oh-my-opencode.json`.

**Pourquoi**
Certains projets nécessitent des configurations de modèle spécifiques (ex : Korean Writer, Deep Reasoning).

Éditez `~/.config/opencode/oh-my-opencode.json` :

```jsonc
{
  "categories": {
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },
    
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false
      }
    }
  }
}
```

**Description des champs** :

| Champ | Type | Description |
|---|---|---|
| `model` | string | Remplace le modèle utilisé par la Category |
| `temperature` | number | Niveau de créativité (0-2) |
| `prompt_append` | string | Contenu à ajouter à l'invite système |
| `thinking` | object | Configuration Thinking (`{ type, budgetTokens }`) |
| `tools` | object | Désactivation des permissions d'outils (`{ toolName: false }`) |

**Point de contrôle ✅** :

Vérifiez que la Category personnalisée fonctionne :
```bash
# Utiliser la Category personnalisée
delegate_task(category="korean-writer", load_skills=[], prompt="...")
```

Vous devriez voir que le système utilise votre modèle et vos invites configurés.

## Pièges à éviter

### Piège 1 : Invite trop vague avec la Category Quick

**Problème** : La Category `quick` utilise le modèle Haiku, dont les capacités d'inférence sont limitées. Si l'invite est trop floue, les résultats seront médiocres.

**Exemple incorrect** :
```
delegate_task(category="quick", load_skills=["git-master"], prompt="commit changes")
```

**Approche correcte** :
```
TÂCHE : Commiter toutes les modifications de code actuelles

À FAIRE OBLIGATOIREMENT :
1. Détecter le style de commit du projet (via git log -30)
2. Diviser les 8 fichiers en 3+ commits atomiques selon les répertoires
3. Maximum 3 fichiers par commit
4. Respecter le style détecté (Semantic/Plain/Short)

À NE PAS FAIRE :
- Fusionner des fichiers de répertoires différents dans le même commit
- Exécuter directement sans planification des commits

SORTIE ATTENDUE :
- Plusieurs commits atomiques
- Chaque message de commit correspond au style du projet
- Respect de l'ordre de dépendance (types → implémentation → tests)
```

### Piège 2 : Oublier de spécifier `load_skills`

**Problème** : `load_skills` est un **paramètre obligatoire**. Ne pas le spécifier provoque une erreur.

**Erreur** :
```
delegate_task(category="quick", prompt="...")
```

**Message d'erreur** :
```
Error: Invalid arguments: 'load_skills' parameter is REQUIRED.
Pass [] if no skills needed, but IT IS HIGHLY RECOMMENDED to pass proper skills.
```

**Approche correcte** :
```
# Pas besoin de Skill, passer explicitement un tableau vide
delegate_task(category="unspecified-low", load_skills=[], prompt="...")
```

### Piège 3 : Spécifier simultanément Category et subagent_type

**Problème** : Ces deux paramètres sont mutuellement exclusifs, ils ne peuvent pas être spécifiés simultanément.

**Erreur** :
```
delegate_task(
  category="quick",
  subagent_type="oracle",  # ❌ Conflit
  ...
)
```

**Approche correcte** :
```
# Utiliser Category (recommandé)
delegate_task(category="quick", load_skills=[], prompt="...")

# Ou spécifier directement l'agent
delegate_task(subagent_type="oracle", load_skills=[], prompt="...")
```

### Piège 4 : Règles de multi-commit de Git Master

**Problème** : Le Skill `git-master` impose **obligatoirement** des multi-commits. Un seul commit à partir de 3+ fichiers échouera.

**Erreur** :
```
# Tentative de 1 commit avec 8 fichiers
git commit -m "Update landing page"  # ❌ git-master va refuser
```

**Approche correcte** :
```
# Diviser par répertoire en plusieurs commits
git add app/page.tsx app/layout.tsx
git commit -m "Add app layer"  # ✅ Commit 1

git add components/demo/*
git commit -m "Add demo components"  # ✅ Commit 2

git add e2e/*
git commit -m "Add tests"  # ✅ Commit 3
```

### Piège 5 : Skill Playwright sans MCP installé

**Problème** : Avant d'utiliser le Skill `playwright`, vous devez vous assurer que le serveur MCP est disponible.

**Erreur** :
```
delegate_task(category="visual-engineering", load_skills=["playwright"], prompt="capture d'écran...")
```

**Approche correcte** :

Vérifiez la configuration MCP (`~/.config/opencode/mcp.json` ou `.claude/.mcp.json`) :

```jsonc
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Si Playwright MCP n'est pas configuré, le Skill `playwright` le démarrera automatiquement.

## Résumé de la leçon

Le système Categories et Skills vous permet de composer vos agents de manière flexible :

| Composant | Rôle | Mode de configuration |
|---|---|---|
| **Category** | Détermine le modèle et le mode de pensée | `delegate_task(category="...")` ou fichier de configuration |
| **Skill** | Injecte des connaissances et MCP | `delegate_task(load_skills=["..."])` ou fichier SKILL.md |
| **Sisyphus Junior** | Exécute les tâches, ne peut pas déléguer | Généré automatiquement, pas de spécification manuelle |

**Stratégies de combinaison** :
1. **Tâches UI** : `visual-engineering` + `frontend-ui-ux` + `playwright`
2. **Réparations rapides** : `quick` + `git-master`
3. **Raisonnement approfondi** : `ultrabrain` (sans Skill)
4. **Rédaction de documentation** : `writing` (sans Skill)

**Meilleures pratiques** :
- ✅ Toujours spécifier `load_skills` (même un tableau vide)
- ✅ Les invites pour la Category `quick` doivent être explicites (Haiku a des capacités d'inférence limitées)
- ✅ Toujours utiliser le Skill `git-master` pour les tâches Git (détection automatique du style)
- ✅ Toujours utiliser le Skill `playwright` pour les tâches UI (validation navigateur)
- ✅ Choisir la Category appropriée selon le type de tâche (plutôt que d'utiliser l'agent principal par défaut)

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Skills intégrés : Automatisation navigateur, Expert Git et Designer UI](../builtin-skills/)**.
>
> Vous apprendrez :
> - Le workflow détaillé du Skill `playwright`
> - Les 3 modes du Skill `git-master` (Commit/Rebase/History Search)
> - La philosophie de conception du Skill `frontend-ui-ux`
> - Comment créer un Skill personnalisé

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonction | Chemin du fichier | Lignes |
|---|---|---|
| Implémentation de l'outil delegate_task | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | Intégralité (1070 lignes) |
| Fonction resolveCategoryConfig | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 113-152 |
| Fonction buildSystemContent | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 176-188 |
| Configuration par défaut des Categories | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 158-166 |
| Ajout des invites des Categories | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 168-176 |
| Descriptions des Categories | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 178-186 |
| Schema de configuration Category | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172 |
| Définition des Skills intégrés | [`src/features/builtin-skills/`](https://github.com/code-yeongyu/oh-my-opencode/tree/main/src/features/builtin-skills) | Structure du répertoire |
| Invite du Skill git-master | [`src/features/builtin-skills/git-master/SKILL.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/git-master/SKILL.md) | Intégralité (1106 lignes) |

**Constantes clés** :
- `SISYPHUS_JUNIOR_AGENT = "sisyphus-junior"` : Agent d'exécution pour la délégation par Category
- `DEFAULT_CATEGORIES` : Configuration des modèles pour les 7 Categories intégrées
- `CATEGORY_PROMPT_APPENDS` : Contenu d'invite ajouté pour chaque Category
- `CATEGORY_DESCRIPTIONS` : Description de chaque Category (affichée dans l'invite delegate_task)

**Fonctions clés** :
- `resolveCategoryConfig()` : Analyse la configuration de la Category, fusionne les surcharges utilisateur et les valeurs par défaut
- `buildSystemContent()` : Fusionne le contenu des invites de Skill et Category
- `createDelegateTask()` : Crée la définition de l'outil delegate_task

**Fichiers des Skills intégrés** :
- `src/features/builtin-skills/frontend-ui-ux/SKILL.md` : Invite du mindset de designer
- `src/features/builtin-skills/git-master/SKILL.md` : Workflow complet de l'expert Git
- `src/features/builtin-skills/agent-browser/SKILL.md` : Configuration Vercel agent-browser
- `src/features/builtin-skills/dev-browser/SKILL.md` : Documentation de référence pour l'automatisation navigateur

</details>
