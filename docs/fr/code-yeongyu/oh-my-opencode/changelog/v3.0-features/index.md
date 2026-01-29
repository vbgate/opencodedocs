---
title: "v3.0: Catégories et Compétences | oh-my-opencode"
sidebarTitle: "Fonctionnalités v3.0"
subtitle: "v3.0: Catégories et Compétences"
description: "Découvrez le nouveau système de Catégories et Compétences d'oh-my-opencode v3.0. Maîtrisez 7 catégories intégrées, 3 packages de compétences et la composition dynamique d'agents."
tags:
  - "v3.0"
  - "catégories"
  - "compétences"
  - "journal des modifications"
order: 200
---

# Fonctionnalités v3.0: Guide complet des Catégories et Compétences

## Vue d'ensemble de la version

oh-my-opencode v3.0 est une version majeure qui introduit le tout nouveau **système de Catégories et Compétences**, révolutionnant la manière dont les agents IA sont orchestrés. Cette version vise à rendre les agents IA plus spécialisés, flexibles et composables.

**Améliorations clés**:
- 🎯 **Système de Catégories**: 7 catégories de tâches intégrées avec sélection automatique du modèle
- 🛠️ **Système de Compétences**: 3 packages de compétences professionnelles intégrées pour injecter des connaissances de domaine
- 🔄 **Composition Dynamique**: Combinez librement Catégorie et Compétence via `delegate_task`
- 🚀 **Sisyphus-Junior**: Nouvel exécuteur de tâches déléguées qui empêche les boucles infinies
- 📝 **Configuration Flexible**: Support des Catégories et Compétences personnalisées

---

## Fonctionnalité principale 1: Système de Catégories

### Qu'est-ce qu'une Catégorie?

Une Catégorie est un **préréglage de configuration d'agent spécialisé** optimisé pour un domaine spécifique. Elle répond à une question clé: **"Quel type de travail est-ce?"**

Chaque Catégorie définit:
- **Modèle à utiliser** (model)
- **Paramètre de température** (temperature)
- **État d'esprit du prompt** (prompt mindset)
- **Capacité de raisonnement** (reasoning effort)
- **Autorisations d'outils** (tools)

### 7 Catégories intégrées

| Catégorie | Modèle par défaut | Température | Cas d'utilisation |
|-----------|-------------------|-------------|-------------------|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Frontend, UI/UX, design, stylisation, animations |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | Raisonnement logique approfondi, décisions d'architecture complexes nécessitant une analyse extensive |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | Tâches de haute créativité/art, idées novatrices |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Tâches simples - modification de fichier unique, corrections de fautes de frappe, changements simples |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tâches ne correspondant pas à d'autres catégories, faible charge de travail |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | Tâches ne correspondant pas à d'autres catégories, charge de travail élevée |
| `writing` | `google/gemini-3-flash` | 0.1 | Documentation, essais, rédaction technique |

**Source**: `docs/category-skill-guide.md:22-30`

### Comment utiliser les Catégories?

Lors de l'appel de l'outil `delegate_task`, spécifiez le paramètre `category`:

```typescript
// Déléguer une tâche frontend à la catégorie visual-engineering
delegate_task(
  category="visual-engineering",
  prompt="Ajouter un composant de graphique responsive à la page du tableau de bord"
)
```

Le système automatiquement:
1. Sélectionnera la Catégorie `visual-engineering`
2. Utilisera le modèle `google/gemini-3-pro`
3. Appliquera `temperature: 0.7` (haute créativité)
4. Chargera l'état d'esprit du prompt de la Catégorie

### Sisyphus-Junior: Exécuteur de tâches déléguées

Lorsque vous utilisez une Catégorie, un agent spécial nommé **Sisyphus-Junior** exécutera la tâche.

**Fonctionnalités clés**:
- ❌ **Ne peut pas redéléguer** les tâches à d'autres agents
- 🎯 **Concentré sur les tâches assignées**
- 🔄 **Empêche les boucles de délégation infinies**

**Objectif de conception**: Garantir que les agents se concentrent sur la tâche actuelle, évitant la complexité causée par la délégation de tâches couche par couche.

---

## Fonctionnalité principale 2: Système de Compétences

### Qu'est-ce qu'une Compétence?

Une Compétence est un mécanisme qui injecte **l'expertise de domaine (Context)** et **les outils (MCP)** dans un agent. Elle répond à une autre question clé: **"Quels outils et connaissances sont nécessaires?"**

### 3 Compétences intégrées

#### 1. `git-master`

**Capacités**:
- Expert Git
- Détecter le style de commit
- Diviser les commits atomiques
- Créer des stratégies de rebase

**MCP**: Aucun (utilise les commandes Git)

**Cas d'utilisation**: Commits, recherche d'historique, gestion des branches

#### 2. `playwright`

**Capacités**:
- Automatisation de navigateur
- Tests web
- Captures d'écran
- Extraction de données

**MCP**: `@playwright/mcp` (exécuté automatiquement)

**Cas d'utilisation**: Validation UI post-implémentation, rédaction de tests E2E

#### 3. `frontend-ui-ux`

**Capacités**:
- Injecter l'état d'esprit de designer
- Lignes directrices de couleur, typographie, mouvement

**Cas d'utilisation**: Travail UI beau au-delà de l'implémentation simple

**Source**: `docs/category-skill-guide.md:57-70`

### Comment utiliser les Compétences?

Ajoutez un tableau `load_skills` dans `delegate_task`:

```typescript
// Déléguer une tâche rapide et charger la compétence git-master
delegate_task(
  category="quick",
  load_skills=["git-master"],
  prompt="Commiter les changements actuels. Suivre le style de message de commit."
)
```

Le système automatiquement:
1. Sélectionnera la Catégorie `quick` (Claude Haiku, faible coût)
2. Chargera la Compétence `git-master` (injectera l'expertise Git)
3. Lancera Sisyphus-Junior pour exécuter la tâche

### Compétences personnalisées

Vous pouvez ajouter des Compétences personnalisées directement dans `.opencode/skills/` à la racine du projet ou dans `~/.claude/skills/` dans le répertoire utilisateur.

**Exemple: `.opencode/skills/my-skill/SKILL.md`**

```markdown
---
name: my-skill
description: Ma compétence personnalisée professionnelle
mcp:
  my-mcp:
    command: npx
    args: ["-y", "my-mcp-server"]
---

# Prompt de ma Compétence

Ce contenu sera injecté dans le prompt système de l'agent.
...
```

**Source**: `docs/category-skill-guide.md:87-103`

---

## Fonctionnalité principale 3: Capacité de composition dynamique

### Stratégie de composition: Création d'agents spécialisés

En combinant différentes Catégories et Compétences, vous pouvez créer des agents spécialisés puissants.

#### 🎨 Designer (Implémentation UI)

- **Catégorie**: `visual-engineering`
- **load_skills**: `["frontend-ui-ux", "playwright"]`
- **Effet**: Implémenter une belle UI et valider directement les résultats de rendu dans le navigateur

#### 🏗️ Architecte (Revue de conception)

- **Catégorie**: `ultrabrain`
- **load_skills**: `[]` (raisonnement pur)
- **Effet**: Utiliser la capacité de raisonnement logique de GPT-5.2 pour une analyse approfondie de l'architecture système

#### ⚡ Mainteneur (Corrections rapides)

- **Catégorie**: `quick`
- **load_skills**: `["git-master"]`
- **Effet**: Corriger rapidement le code en utilisant un modèle rentable et générer des commits propres

**Source**: `docs/category-skill-guide.md:111-124`

### Guide de prompt delegate_task

Lors de la délégation de tâches, des prompts **clairs et spécifiques** sont cruciaux. Incluez les 7 éléments suivants:

1. **TÂCHE**: Que faut-il faire? (objectif unique)
2. **RÉSULTAT ATTENDU**: Quelle est la livrable?
3. **COMPÉTENCES REQUISES**: Quelles compétences doivent être chargées via `load_skills`?
4. **OUTILS REQUIS**: Quels outils doivent être utilisés? (liste blanche)
5. **À FAIRE**: Que faut-il absolument faire (contraintes)
6. **À NE PAS FAIRE**: Ce qu'il ne faut jamais faire
7. **CONTEXTE**: Chemins de fichiers, modèles existants, matériaux de référence

**❌ Mauvais exemple**:
> "Corrige ça"

**✅ Bon exemple**:
> **TÂCHE**: Corriger le problème de layout mobile dans `LoginButton.tsx`
> **CONTEXTE**: `src/components/LoginButton.tsx`, utilisant Tailwind CSS
> **À FAIRE**: Changer flex-direction au breakpoint `md:`
> **À NE PAS FAIRE**: Modifier le layout desktop existant
> **RÉSULTAT ATTENDU**: Le bouton s'aligne verticalement sur mobile

**Source**: `docs/category-skill-guide.md:130-148`

---

## Guide de configuration

### Schéma de configuration de Catégorie

Vous pouvez affiner les Catégories dans `oh-my-opencode.json`.

| Champ | Type | Description |
|-------|------|-------------|
| `description` | string | Description lisible par humain de l'objectif de la Catégorie. Affichée dans les prompts delegate_task. |
| `model` | string | ID du modèle IA à utiliser (ex: `anthropic/claude-opus-4-5`) |
| `variant` | string | Variante du modèle (ex: `max`, `xhigh`) |
| `temperature` | number | Niveau de créativité (0.0 ~ 2.0). Plus bas = plus déterministe. |
| `top_p` | number | Paramètre d'échantillonnage de noyau (0.0 ~ 1.0) |
| `prompt_append` | string | Contenu ajouté au prompt système lorsque cette Catégorie est sélectionnée |
| `thinking` | object | Configuration du modèle de réflexion (`{ type: "enabled", budgetTokens: 16000 }`) |
| `reasoningEffort` | string | Niveau d'effort de raisonnement (`low`, `medium`, `high`) |
| `textVerbosity` | string | Verbosité du texte (`low`, `medium`, `high`) |
| `tools` | object | Contrôle d'utilisation des outils (utilisez `{ "tool_name": false }` pour désactiver) |
| `maxTokens` | number | Nombre maximum de tokens de réponse |
| `is_unstable_agent` | boolean | Marquer l'agent comme instable - forcer le mode arrière-plan pour la surveillance |

**Source**: `docs/category-skill-guide.md:159-172`

### Exemple de configuration

```jsonc
{
  "categories": {
    // 1. Définir une nouvelle catégorie personnalisée
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "Vous êtes un rédacteur technique coréen. Maintenez un ton amical et clair."
    },

    // 2. Remplacer une catégorie existante (changer le modèle)
    "visual-engineering": {
      "model": "openai/gpt-5.2",
      "temperature": 0.8
    },

    // 3. Configurer le modèle de réflexion et limiter les outils
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false // Désactiver la recherche web
      }
    }
  },

  // Désactiver les compétences
  "disabled_skills": ["playwright"]
}
```

**Source**: `docs/category-skill-guide.md:175-206`

---

## Autres améliorations importantes

En plus du système de Catégories et Compétences, v3.0 inclut les améliorations importantes suivantes:

### Améliorations de stabilité
- ✅ Version marquée comme stable (3.0.1)
- ✅ Mécanisme de délégation d'agent optimisé
- ✅ Capacité de récupération d'erreur améliorée

### Optimisations de performance
- ✅ Réduction de l'injection de contexte inutile
- ✅ Mécanisme de polling des tâches d'arrière-plan optimisé
- ✅ Efficacité d'orchestration multi-modèle améliorée

### Compatibilité Claude Code
- ✅ Entièrement compatible avec le format de configuration Claude Code
- ✅ Supporte le chargement des Compétences, Commandes, MCP de Claude Code
- ✅ Découverte et configuration automatiques

**Source**: `README.md:18-20`, `README.md:292-304`

---

## Prochaines étapes

Le système de Catégories et Compétences dans v3.0 pose une base flexible pour étendre oh-my-opencode. Si vous souhaitez approfondir l'utilisation de ces nouvelles fonctionnalités, référez-vous aux sections suivantes:

- [Catégories et Compétences: Composition dynamique d'agents](../../advanced/categories-skills/) - Guide d'utilisation détaillé
- [Compétences intégrées: Automatisation de navigateur et expert Git](../../advanced/builtin-skills/) - Analyse approfondie des Compétences
- [Configuration avancée: Gestion des agents et des permissions](../../advanced/advanced-configuration/) - Guide de configuration personnalisée

Commencez à explorer ces nouvelles fonctionnalités et rendez vos agents IA plus spécialisés et efficaces!
