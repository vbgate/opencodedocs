---
title: "Modèles Disponibles : Guide de Configuration Claude et Gemini | Antigravity Auth"
sidebarTitle: "Choisir le bon modèle IA"
subtitle: "Découvrez tous les modèles disponibles et leurs configurations de variantes"
description: "Apprenez la configuration des modèles Antigravity Auth. Maîtrisez les variantes Thinking de Claude Opus 4.5, Sonnet 4.5 et Gemini 3 Pro/Flash."
tags:
  - "Plateforme"
  - "Modèle"
  - "Claude"
  - "Gemini"
  - "Thinking"
prerequisite:
  - "start-what-is-antigravity-auth"
  - "start-quick-install"
order: 1
---

# Découvrez tous les modèles disponibles et leurs configurations de variantes

## Ce que vous apprendrez

- Choisir le modèle Claude ou Gemini le mieux adapté à vos besoins
- Comprendre les différents niveaux de mode Thinking (low/max ou minimal/low/medium/high)
- Comprendre les deux pools de quota indépendants Antigravity et Gemini CLI
- Utiliser le paramètre `--variant` pour ajuster dynamiquement le budget de raisonnement

## Votre situation actuelle

Vous venez d'installer le plugin et vous êtes confronté à une longue liste de noms de modèles, sans savoir lequel choisir :
- Quelle est la différence entre `antigravity-gemini-3-pro` et `gemini-3-pro-preview` ?
- Que signifie `--variant=max` ? Que se passe-t-il si je ne le spécifie pas ?
- Le mode thinking de Claude est-il identique à celui de Gemini ?

## Concept de base

Antigravity Auth prend en charge deux grandes catégories de modèles, chacune avec son propre pool de quota :

1. **Quota Antigravity** : Accès via l'API Google Antigravity, incluant Claude et Gemini 3
2. **Quota Gemini CLI** : Accès via l'API Gemini CLI, incluant Gemini 2.5 et Gemini 3 Preview

::: info Système de Variantes
Le système de variantes d'OpenCode vous permet de ne pas avoir à définir un modèle indépendant pour chaque niveau de thinking. Au lieu de cela, vous spécifiez la configuration au moment de l'exécution via le paramètre `--variant`. Cela rend le sélecteur de modèles plus propre et la configuration plus flexible.
:::

## Modèles du Quota Antigravity

Ces modèles sont accessibles via le préfixe `antigravity-` et utilisent le pool de quotas de l'API Antigravity.

### Série Gemini 3

#### Gemini 3 Pro
| Nom du modèle | Variantes | Niveau de Thinking | Description |
|---|---|---|---|
| `antigravity-gemini-3-pro` | low, high | low, high | Équilibre entre qualité et vitesse |

**Exemples de configuration de variantes** :
```bash
# Niveau de raisonnement faible (plus rapide)
opencode run "Réponse rapide" --model=google/antigravity-gemini-3-pro --variant=low

# Niveau de raisonnement élevé (plus approfondi)
opencode run "Raisonnement complexe" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash
| Nom du modèle | Variantes | Niveau de Thinking | Description |
|---|---|---|---|
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | Réponse ultra-rapide, prend en charge 4 niveaux de raisonnement |

**Exemples de configuration de variantes** :
```bash
# Raisonnement minimal (le plus rapide)
opencode run "Tâche simple" --model=google/antigravity-gemini-3-flash --variant=minimal

# Raisonnement équilibré (par défaut)
opencode run "Tâche standard" --model=google/antigravity-gemini-3-flash --variant=medium

# Raisonnement maximal (le plus approfondi)
opencode run "Analyse complexe" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro ne prend pas en charge minimal/medium
Le `gemini-3-pro` ne prend en charge que deux niveaux : `low` et `high`. Si vous essayez d'utiliser `--variant=minimal` ou `--variant=medium`, l'API retournera une erreur.
:::

### Série Claude

#### Claude Sonnet 4.5 (Non Thinking)
| Nom du modèle | Variantes | Budget de Thinking | Description |
|---|---|---|---|
| `antigravity-claude-sonnet-4-5` | — | — | Mode standard, sans réflexion étendue |

**Exemple d'utilisation** :
```bash
# Mode standard
opencode run "Conversation quotidienne" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking
| Nom du modèle | Variantes | Budget de Thinking (tokens) | Description |
|---|---|---|---|
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Mode équilibré |

**Exemples de configuration de variantes** :
```bash
# Raisonnement léger (plus rapide)
opencode run "Inférence rapide" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# Raisonnement maximal (le plus approfondi)
opencode run "Analyse approfondie" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking
| Nom du modèle | Variantes | Budget de Thinking (tokens) | Description |
|---|---|---|---|
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Capacité de raisonnement maximale |

**Exemples de configuration de variantes** :
```bash
# Raisonnement léger
opencode run "Réponse de haute qualité" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# Raisonnement maximal (pour les tâches les plus complexes)
opencode run "Analyse experte" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Différence entre les modes de raisonnement Claude et Gemini
- **Claude** utilise un budget de thinking numérique (tokens), comme 8192, 32768
- **Gemini 3** utilise un niveau de thinking textuel (minimal/low/medium/high)
- Les deux affichent le processus de raisonnement avant la réponse, mais les méthodes de configuration diffèrent
:::

## Modèles du Quota Gemini CLI

Ces modèles n'ont pas le préfixe `antigravity-` et utilisent le pool de quotas indépendant de l'API Gemini CLI. Ils ne prennent pas en charge le mode thinking.

| Nom du modèle | Description |
|---|---|
| `gemini-2.5-flash` | Gemini 2.5 Flash (réponse rapide) |
| `gemini-2.5-pro` | Gemini 2.5 Pro (équilibre qualité/vitesse) |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview (version préliminaire) |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview (version préliminaire) |

**Exemples d'utilisation** :
```bash
# Gemini 2.5 Pro (sans thinking)
opencode run "Tâche rapide" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview (sans thinking)
opencode run "Test de modèle preview" --model=google/gemini-3-pro-preview
```

::: info Modèles Preview
Les modèles `gemini-3-*-preview` sont des versions préliminaires officielles de Google qui peuvent être instables ou sujettes à modification. Si vous souhaitez utiliser la fonctionnalité Thinking, utilisez les modèles `antigravity-gemini-3-*`.
:::

## Aperçu Comparatif des Modèles

| Caractéristique | Claude 4.5 | Gemini 3 | Gemini 2.5 |
|---|---|---|---|
| **Prise en charge Thinking** | ✅ (thinkingBudget) | ✅ (thinkingLevel) | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **Pool de quotas** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **Scénarios d'utilisation** | Raisonnement complexe, programmation | Tâches générales + recherche | Réponse rapide, tâches simples |

## 🎯 Comment Choisir un Modèle

### Choisir entre Claude et Gemini ?

- **Choisir Claude** : Vous avez besoin d'une capacité de raisonnement logique supérieure et d'une génération de code plus stable
- **Choisir Gemini 3** : Vous avez besoin de Google Search et d'une vitesse de réponse plus rapide

### Choisir entre Thinking et Mode Standard ?

- **Utiliser Thinking** : Raisonnement complexe, tâches multi-étapes, besoin de voir le processus de raisonnement
- **Utiliser le Mode Standard** : Questions-réponses simples, réponse rapide, pas besoin d'afficher le raisonnement

### Choisir quel Niveau de Thinking ?

| Niveau | Claude (tokens) | Gemini 3 | Scénarios d'utilisation |
|---|---|---|---|
| **minimal** | — | Flash uniquement | Tâches ultra-rapides, comme traduction ou résumé |
| **low** | 8192 | Pro/Flash | Équilibre qualité/vitesse, adapté à la plupart des tâches |
| **medium** | — | Flash uniquement | Tâches de complexité moyenne |
| **high/max** | 32768 | Pro/Flash | Tâches les plus complexes, comme conception de système ou analyse approfondie |

::: tip Configuration Recommandée
- **Développement quotidien** : `antigravity-claude-sonnet-4-5-thinking --variant=low`
- **Raisonnement complexe** : `antigravity-claude-opus-4-5-thinking --variant=max`
- **Questions-réponses rapides + recherche** : `antigravity-gemini-3-flash --variant=low` avec Google Search activé
:::

## Exemple de Configuration Complète

Ajoutez la configuration suivante à votre fichier `~/.config/opencode/opencode.json` :

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: details Copier la configuration
Cliquez sur le bouton de copie en haut à droite du bloc de code, puis collez-le dans votre fichier `~/.config/opencode/opencode.json`.
:::

## Points de contrôle ✅

Suivez les étapes suivantes pour confirmer que vous maîtrisez la sélection des modèles :

- [ ] Comprendre les deux pools de quota indépendants Antigravity et Gemini CLI
- [ ] Savoir que Claude utilise thinkingBudget (tokens) et Gemini 3 utilise thinkingLevel (chaîne)
- [ ] Pouvoir choisir la variante appropriée selon la complexité de la tâche
- [ ] Avoir ajouté la configuration complète à `opencode.json`

## Résumé de la leçon

Antigravity Auth offre un riche choix de modèles et une configuration flexible des variantes :

- **Quota Antigravity** : prend en charge Claude 4.5 et Gemini 3, avec capacité Thinking
- **Quota Gemini CLI** : prend en charge Gemini 2.5 et Gemini 3 Preview, sans capacité Thinking
- **Système de Variantes** : ajustez dynamiquement le niveau de raisonnement via le paramètre `--variant`, sans définir plusieurs modèles

Lors du choix d'un modèle, considérez le type de votre tâche (raisonnement vs recherche), la complexité (simple vs complexe) et les besoins en vitesse de réponse.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Les Modèles Thinking en Détail](../../thinking-models/)**.
>
> Vous apprendrez :
> - Le principe des modes Thinking de Claude et Gemini
> - Comment configurer un budget de thinking personnalisé
> - Les techniques de conservation des blocs de raisonnement (signature caching)

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Numéros de ligne |
|---|---|---|
| Analyse des modèles et extraction du niveau | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Définition du budget du niveau Thinking | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Définition des niveaux de thinking Gemini 3 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| Mapping des alias de modèles | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Analyse de la configuration des variantes | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| Définitions de types | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**Constantes clés** :
- `THINKING_TIER_BUDGETS` : Mapping des budgets de raisonnement Claude et Gemini 2.5 (low/medium/high → tokens)
- `GEMINI_3_THINKING_LEVELS` : Niveaux de raisonnement pris en charge par Gemini 3 (minimal/low/medium/high)

**Fonctions clés** :
- `resolveModelWithTier(requestedModel)` : Analyse le nom du modèle et la configuration de raisonnement
- `resolveModelWithVariant(requestedModel, variantConfig)` : Analyse le modèle à partir de la configuration de variante
- `budgetToGemini3Level(budget)` : Mappe le budget de tokens au niveau Gemini 3

</details>
