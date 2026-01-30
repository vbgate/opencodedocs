---
title: "Configuration des modèles de raisonnement | opencode-antigravity-auth"
sidebarTitle: "Laissez l'IA réfléchir en profondeur"
subtitle: "Modèles de raisonnement : les capacités de réflexion de Claude et Gemini 3"
description: "Apprenez à configurer les modèles de raisonnement Claude et Gemini 3. Maîtrisez les configurations de thinking budget, thinking level et variant."
tags:
  - "Modèles de raisonnement"
  - "Claude Opus 4.5"
  - "Claude Sonnet 4.5"
  - "Gemini 3 Pro"
  - "Gemini 3 Flash"
  - "Configuration variant"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 4
---

# Modèles de raisonnement : les capacités de réflexion de Claude et Gemini 3

## Ce que vous pourrez faire après ce tutoriel

- Configurer le thinking budget des modèles Claude Opus 4.5 et Sonnet 4.5 de raisonnement
- Utiliser le thinking level de Gemini 3 Pro/Flash (minimal/low/medium/high)
- Ajuster la force de réflexion de manière flexible via le système variant d'OpenCode
- Comprendre l'interleaved thinking (le mécanisme de réflexion lors des appels d'outils)
- Maîtriser la stratégie de conservation des blocs de raisonnement (configuration keep_thinking)

## Les défis auxquels vous êtes confrontés

Vous souhaitez que les modèles d'IA performent mieux sur des tâches complexes — comme le raisonnement multi-étapes, le débogage de code ou la conception d'architecture. Mais vous savez que :

- Les modèles classiques répondent trop vite, sans réflexion suffisante
- Claude limite officiellement la fonction de réflexion, difficile d'y accéder
- La configuration du thinking level de Gemini 3 n'est pas claire
- On ne sait pas combien de réflexion est suffisant (quel budget définir)
- Des erreurs de signature surviennent lors de la lecture du contenu des blocs de réflexion

## Quand utiliser cette technique

**Scénarios applicables** :
- Problèmes complexes nécessitant un raisonnement multi-étapes (conception d'algorithmes, architecture système)
- Révision ou débogage de code nécessitant une réflexion approfondie
- Documents longs ou bases de code nécessitant une analyse approfondie
- Tâches intensives en appels d'outils (nécessitant l'interleaved thinking)

**Scénarios non applicables** :
- Questions-réponses simples (gaspillant le quota de réflexion)
- Validation rapide de prototypes (vitesse prioritaire)
- Requêtes factuelles (pas de raisonnement nécessaire)

## 🎒 Préparation avant de commencer

::: warning Vérification préalable

 1. **Installation et authentification du plugin terminées** : référez-vous à [Installation rapide](../../start/quick-install/) et [Première authentification](../../start/first-auth-login/)
 2. **Connaissance de base de l'utilisation des modèles** : référez-vous à [Première requête](../../start/first-request/)
 3. **Modèles de raisonnement disponibles** : assurez-vous que votre compte a accès aux modèles Claude Opus 4.5/Sonnet 4.5 de raisonnement ou Gemini 3 Pro/Flash

 :::

---

## Concepts fondamentaux

### Qu'est-ce qu'un modèle de raisonnement

Un **modèle de raisonnement** effectue un raisonnement interne (thinking blocks) avant de générer la réponse finale. Ces contenus de réflexion :

- **Ne sont pas facturés** : Les tokens de réflexion ne comptent pas dans le quota de sortie standard (les règles de facturation exactes sont définies par Antigravity)
- **Améliorent la qualité du raisonnement** : Plus de réflexion → réponses plus précises et logiques
- **Consomment du temps** : La réflexion augmente la latence de réponse, mais offre de meilleurs résultats

**Différence clé** :

| Modèle classique | Modèle de raisonnement |
| --- | --- |
| Génère directement la réponse | Réflexion d'abord → puis génère la réponse |
| Rapide mais peut-être superficiel | Lent mais plus approfondi |
| Adapté aux tâches simples | Adapté aux tâches complexes |

### Deux implémentations de raisonnement

Le plugin Antigravity Auth supporte deux implémentations de raisonnement :

#### Raisonnement Claude (Opus 4.5, Sonnet 4.5)

- **Budget basé sur les tokens** : Contrôle la quantité de réflexion avec des nombres (ex: 8192, 32768)
- **Interleaved thinking** : Permet de réfléchir avant et après les appels d'outils
- **Clés snake_case** : Utilise `include_thoughts`, `thinking_budget`

#### Raisonnement Gemini 3 (Pro, Flash)

- **Basé sur les niveaux** : Contrôle l'intensité de réflexion avec des chaînes (minimal/low/medium/high)
- **Clés CamelCase** : Utilise `includeThoughts`, `thinkingLevel`
- **Différences de modèles** : Flash supporte les 4 niveaux, Pro ne supporte que low/high

---

## Mise en pratique

### Étape 1 : Configurer les modèles de raisonnement via Variant

Le système variant d'OpenCode vous permet de sélectionner directement l'intensité de réflexion dans le sélecteur de modèles, sans avoir à mémoriser des noms de modèles complexes.

#### Vérifier la configuration existante

Consultez votre fichier de configuration de modèles (généralement dans `.opencode/models.json` ou le répertoire de configuration système) :

```bash
## Voir la configuration des modèles
cat ~/.opencode/models.json
```

#### Configurer les modèles Claude de raisonnement

Trouvez `antigravity-claude-sonnet-4-5-thinking` ou `antigravity-claude-opus-4-5-thinking`, et ajoutez des variants :

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "limit": { "context": 200000, "output": 64000 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "medium": { "thinkingConfig": { "thinkingBudget": 16384 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  }
}
```

**Description de la configuration** :
- `low` : 8192 tokens - Réflexion légère, adaptée aux tâches de complexité moyenne
- `medium` : 16384 tokens - Équilibre entre réflexion et vitesse
- `max` : 32768 tokens - Réflexion maximale, adaptée aux tâches les plus complexes

#### Configurer les modèles Gemini 3 de raisonnement

**Gemini 3 Pro** (ne supporte que low/high) :

```json
{
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro (Antigravity)",
    "limit": { "context": 1048576, "output": 65535 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Gemini 3 Flash** (supporte les 4 niveaux) :

```json
{
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
  }
}
```

**Description de la configuration** :
- `minimal` : Réflexion minimale, réponse la plus rapide (Flash uniquement)
- `low` : Réflexion légère
- `medium` : Réflexion équilibrée (Flash uniquement)
- `high` : Réflexion maximale (la plus lente mais la plus approfondie)

**Ce que vous devriez voir** : Dans le sélecteur de modèles d'OpenCode, après avoir sélectionné un modèle Thinking, vous pouvez voir le menu déroulant des variants.

### Étape 2 : Envoyer des requêtes avec les modèles de raisonnement

Une fois la configuration terminée, vous pouvez sélectionner le modèle et le variant via OpenCode :

```bash
## Utiliser Claude Sonnet 4.5 Thinking (max)
opencode run "Aidez-moi à concevoir l'architecture d'un système de cache distribué" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max

## Utiliser Gemini 3 Pro (high)
opencode run "Analysez les goulots d'étranglement de performance de ce code" \
  --model=google/antigravity-gemini-3-pro \
  --variant=high

## Utiliser Gemini 3 Flash (minimal - le plus rapide)
opencode run "Résumez rapidement le contenu de ce fichier" \
  --model=google/antigravity-gemini-3-flash \
  --variant=minimal
```

**Ce que vous devriez voir** : Le modèle affichera d'abord les blocs de réflexion (contenu de réflexion), puis générera la réponse finale.

### Étape 3 : Comprendre l'interleaved thinking

L'interleaved thinking est une capacité spéciale des modèles Claude — il permet de réfléchir avant et après les appels d'outils.

**Exemple de scénario** : Lorsque vous demandez à l'IA d'utiliser des outils (comme la manipulation de fichiers, les requêtes de base de données) pour accomplir une tâche :

```
Réflexion : J'ai besoin de lire d'abord le fichier de configuration, puis décider de la suite...

[Appel d'outil : read_file("config.json")]

Résultat de l'outil : { "port": 8080, "mode": "production" }

Réflexion : Le port est 8080, mode production. Je dois vérifier si la configuration est correcte...

[Appel d'outil : validate_config({ "port": 8080, "mode": "production" })]

Résultat de l'outil : { "valid": true }

Réflexion : La configuration est valide. Je peux maintenant démarrer le service.

[Génération de la réponse finale]
```

**Pourquoi c'est important** :
- Réflexion avant et après les appels d'outils → Décisions plus intelligentes
- Adaptation aux résultats retournés par les outils → Ajustement dynamique de la stratégie
- Évite l'exécution aveugle → Réduit les erreurs d'opération

::: tip Le plugin gère automatiquement

Vous n'avez pas besoin de configurer manuellement l'interleaved thinking. Le plugin Antigravity Auth détecte automatiquement les modèles Claude Thinking et injecte les instructions système :
- "Interleaved thinking is enabled. You may think between tool calls and after receiving tool results before deciding on next action or final answer."

:::

### Étape 4 : Contrôler la stratégie de conservation des blocs de réflexion

Par défaut, le plugin **détache les blocs de réflexion** pour améliorer la fiabilité (éviter les erreurs de signature). Si vous souhaitez lire le contenu de réflexion, vous devez configurer `keep_thinking`.

#### Pourquoi détacher par défaut ?

**Problème d'erreur de signature** :
- Les blocs de réflexion nécessitent une correspondance de signature dans les conversations multi-tours
- Si tous les blocs de réflexion sont conservés, cela peut entraîner des conflits de signature
- Détacher les blocs de réflexion est une solution plus stable (mais on perd le contenu de réflexion)

#### Activer la conservation des blocs de réflexion

Créez ou modifiez le fichier de configuration :

**Linux/macOS** : `~/.config/opencode/antigravity.json`

**Windows** : `%APPDATA%\opencode\antigravity.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "keep_thinking": true
}
```

Ou utilisez une variable d'environnement :

```bash
export OPENCODE_ANTIGRAVITY_KEEP_THINKING=1
```

**Ce que vous devriez voir** :
- `keep_thinking: false` (défaut) : Vous ne voyez que la réponse finale, les blocs de réflexion sont masqués
- `keep_thinking: true` : Vous voyez le processus de réflexion complet (peut rencontrer des erreurs de signature dans certaines conversations multi-tours)

::: warning Recommandation

- **Environnement de production** : Utilisez `keep_thinking: false` par défaut, assure la stabilité
- **Débogage/Apprentissage** : Activez temporairement `keep_thinking: true`, observez le processus de réflexion
- **En cas d'erreur de signature** : Désactivez `keep_thinking`, le plugin se rétablit automatiquement

:::

### Étape 5 : Vérifier les Max Output Tokens

Les modèles Claude Thinking nécessitent des limites de tokens de sortie plus élevées (maxOutputTokens), sinon le thinking budget peut ne pas être entièrement utilisé.

**Gestion automatique par le plugin** :
- Si vous définissez un thinking budget, le plugin ajuste automatiquement `maxOutputTokens` à 64 000
- Emplacement du code source : `src/plugin/transform/claude.ts:78-90`

**Configuration manuelle (optionnelle)** :

Si vous définissez manuellement `maxOutputTokens`, assurez-vous qu'il est supérieur au thinking budget :

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "variants": {
      "max": {
        "thinkingConfig": { "thinkingBudget": 32768 },
        "maxOutputTokens": 64000  // Doit être >= thinkingBudget
      }
    }
  }
}
```

**Ce que vous devriez voir** :
- Si `maxOutputTokens` est trop petit, le plugin l'ajuste automatiquement à 64 000
- Les logs de débogage afficheront "Adjusted maxOutputTokens for thinking model"

---

## Points de contrôle ✅

Vérifiez que votre configuration est correcte :

### 1. Vérifier la visibilité des variants

Dans OpenCode :

1. Ouvrez le sélecteur de modèles
2. Sélectionnez `Claude Sonnet 4.5 Thinking`
3. Vérifiez s'il y a un menu déroulant variant (low/medium/max)

**Résultat attendu** : Vous devriez voir 3 options de variants.

### 2. Vérifier la sortie du contenu de réflexion

```bash
opencode run "Réfléchissez en 3 étapes : 1+1=? Pourquoi ?" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max
```

**Résultat attendu** :
- Si `keep_thinking: true` : Vous voyez le processus de réflexion détaillé
- Si `keep_thinking: false` (défaut) : Vous voyez directement la réponse "2"

### 3. Vérifier l'interleaved thinking (nécessite des appels d'outils)

```bash
## Utiliser une tâche nécessitant des appels d'outils
opencode run "Lisez la liste des fichiers dans le répertoire actuel, puis résumez les types de fichiers" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=medium
```

**Résultat attendu** :
- Vous voyez le contenu de réflexion avant et après les appels d'outils
- L'IA ajuste sa stratégie en fonction des résultats retournés par les outils

---

## Pièges à éviter

### ❌ Erreur 1 : Le thinking budget dépasse les max output tokens

**Problème** : Définition de `thinkingBudget: 32768`, mais `maxOutputTokens: 20000`

**Message d'erreur** :
```
Invalid argument: max_output_tokens must be greater than or equal to thinking_budget
```

**Solution** :
- Laissez le plugin gérer automatiquement (recommandé)
- Ou définissez manuellement `maxOutputTokens >= thinkingBudget`

### ❌ Erreur 2 : Gemini 3 Pro utilise un niveau non supporté

**Problème** : Gemini 3 Pro ne supporte que low/high, mais vous essayez d'utiliser `minimal`

**Message d'erreur** :
```
Invalid argument: thinking_level "minimal" not supported for gemini-3-pro
```

**Solution** : N'utilisez que les levels supportés par Pro (low/high)

### ❌ Erreur 3 : Erreur de signature en conversation multi-tours (keep_thinking: true)

**Problème** : Après avoir activé `keep_thinking: true`, une erreur survient en conversation multi-tours

**Message d'erreur** :
```
Signature mismatch in thinking blocks
```

**Solution** :
- Désactivez temporairement `keep_thinking` : `export OPENCODE_ANTIGRAVITY_KEEP_THINKING=0`
- Ou redémarrez la session

### ❌ Erreur 4 : Les variants ne s'affichent pas

**Problème** : Vous avez configuré les variants, mais ils ne sont pas visibles dans le sélecteur de modèles d'OpenCode

**Causes possibles** :
- Chemin de fichier de configuration incorrect
- Erreur de syntaxe JSON (virgule manquante, guillemets)
- ID de modèle non correspondant

**Solution** :
1. Vérifiez le chemin du fichier de configuration : `~/.opencode/models.json` ou `~/.config/opencode/models.json`
2. Validez la syntaxe JSON : `cat ~/.opencode/models.json | python -m json.tool`
3. Vérifiez si l'ID du modèle correspond à celui retourné par le plugin

---

## Résumé du cours

Les modèles de raisonnement améliorent la qualité des réponses aux tâches complexes en effectuant un raisonnement interne avant de générer la réponse :

| Fonctionnalité | Raisonnement Claude | Raisonnement Gemini 3 |
| --- | --- | --- |
| **Méthode de configuration** | `thinkingBudget` (nombre) | `thinkingLevel` (chaîne) |
| **Levels** | Budget personnalisé | minimal/low/medium/high |
| **Clés** | snake_case (`include_thoughts`) | camelCase (`includeThoughts`) |
| **Interleaved** | ✅ Supporté | ❌ Non supporté |
| **Max Output** | Ajusté automatiquement à 64 000 | Utilise la valeur par défaut |

**Configuration clé** :
- **Système Variant** : Via `thinkingConfig.thinkingBudget` (Claude) ou `thinkingLevel` (Gemini 3)
- **keep_thinking** : false par défaut (stable), true (lisibilité du contenu de réflexion)
- **Interleaved thinking** : Activé automatiquement, pas de configuration manuelle nécessaire

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Google Search Grounding](../google-search-grounding/)**.
>
> Vous apprendrez :
> - Activer la recherche Google pour les modèles Gemini
> - Configurer le seuil de récupération dynamique
> - Améliorer la précision factuelle et réduire les hallucinations

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Construction de la configuration Raisonnement Claude | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 62-72 |
| Construction de la configuration Raisonnement Gemini 3 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 163-171 |
| Construction de la configuration Raisonnement Gemini 2.5 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 176-184 |
| Détection du modèle Raisonnement Claude | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 34-37 |
| Détection du modèle Gemini 3 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 137-139 |
| Injection du hint Interleaved Thinking | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 96-138 |
| Ajustement automatique des Max Output Tokens | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 78-90 |
| Schéma de configuration keep_thinking | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 78-87 |
| Transformation d'application Raisonnement Claude | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 324-366 |
| Transformation d'application Raisonnement Gemini | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 372-434 |

**Constantes clés** :
- `CLAUDE_THINKING_MAX_OUTPUT_TOKENS = 64_000` : Nombre maximal de tokens de sortie pour les modèles Claude Thinking
- `CLAUDE_INTERLEAVED_THINKING_HINT` : Hint d'interleaved thinking injecté dans les instructions système

**Fonctions clés** :
- `buildClaudeThinkingConfig(includeThoughts, thinkingBudget)` : Construit la configuration Claude Thinking (clés snake_case)
- `buildGemini3ThinkingConfig(includeThoughts, thinkingLevel)` : Construit la configuration Gemini 3 Thinking (chaîne level)
- `buildGemini25ThinkingConfig(includeThoughts, thinkingBudget)` : Construit la configuration Gemini 2.5 Thinking (budget numérique)
- `ensureClaudeMaxOutputTokens(generationConfig, thinkingBudget)` : Assure que maxOutputTokens est suffisamment grand
- `appendClaudeThinkingHint(payload, hint)` : Injecte le hint d'interleaved thinking
- `isClaudeThinkingModel(model)` : Détecte si c'est un modèle Claude Thinking
- `isGemini3Model(model)` : Détecte si c'est un modèle Gemini 3

</details>
