---
title: "Optimisation des Tokens : Fenêtre de Contexte | Everything Claude Code"
sidebarTitle: "Que faire quand le contexte sature"
subtitle: "Optimisation des Tokens : Fenêtre de Contexte"
description: "Apprenez les stratégies d'optimisation des tokens pour Claude Code. Maîtrisez la sélection de modèles, la compression stratégique et la configuration MCP pour maximiser l'efficacité de la fenêtre de contexte."
tags:
  - "token-optimization"
  - "context-management"
  - "performance"
prerequisite:
  - "start-quick-start"
order: 110
---

# Stratégies d'Optimisation des Tokens : Gestion de la Fenêtre de Contexte

## Ce que vous saurez faire après ce cours

- Choisir le modèle approprié selon le type de tâche, en équilibrant coût et performance
- Utiliser la compression stratégique pour préserver le contexte clé aux points de transition logiques
- Configurer judicieusement les serveurs MCP pour éviter une consommation excessive de la fenêtre de contexte
- Éviter la saturation de la fenêtre de contexte et maintenir la qualité des réponses

## Votre situation actuelle

Avez-vous rencontré ces problèmes ?

- En pleine conversation, le contexte est soudainement compressé et des informations cruciales sont perdues
- Trop de serveurs MCP activés, la fenêtre de contexte passe de 200k à 70k
- Lors d'un refactoring majeur, le modèle "oublie" les discussions précédentes
- Vous ne savez pas quand compresser et quand ne pas le faire

## Quand utiliser cette technique

- **Pour des tâches complexes** - Choisir le modèle et la stratégie de gestion de contexte appropriés
- **Quand la fenêtre de contexte approche la saturation** - Utiliser la compression stratégique pour préserver les informations clés
- **Lors de la configuration des serveurs MCP** - Équilibrer le nombre d'outils et la capacité de contexte
- **Pour des sessions longues** - Compresser aux points de transition logiques pour éviter la perte d'informations lors de la compression automatique

## Concept fondamental

L'optimisation des tokens ne consiste pas à "réduire l'utilisation", mais à **préserver les informations précieuses aux moments critiques**.

### Les trois piliers de l'optimisation

1. **Stratégie de sélection de modèle** - Différentes tâches nécessitent différents modèles, évitez d'utiliser un canon pour tuer une mouche
2. **Compression stratégique** - Compresser aux points de transition logiques, pas à n'importe quel moment
3. **Gestion de la configuration MCP** - Contrôler le nombre d'outils activés pour protéger la fenêtre de contexte

### Concepts clés

::: info Qu'est-ce que la fenêtre de contexte ?

La fenêtre de contexte est la longueur de l'historique de conversation que Claude Code peut "mémoriser". Le modèle actuel supporte environ 200k tokens, mais cela est affecté par :

- **Les serveurs MCP activés** - Chaque MCP consomme de l'espace dans le prompt système
- **Les Skills chargés** - Les définitions de compétences occupent du contexte
- **L'historique de conversation** - Vos échanges avec Claude

Quand le contexte approche la saturation, Claude compresse automatiquement l'historique, ce qui peut entraîner la perte d'informations clés.
:::

::: tip Pourquoi la compression manuelle est-elle préférable ?

La compression automatique de Claude se déclenche à des moments arbitraires, interrompant souvent le flux de travail en pleine tâche. La compression stratégique vous permet de compresser proactivement aux **points de transition logiques** (comme après avoir terminé la planification, avant de changer de tâche), en préservant le contexte important.
:::

## Suivez-moi

### Étape 1 : Choisir le modèle approprié

Sélectionnez le modèle en fonction de la complexité de la tâche pour éviter de gaspiller du coût et du contexte.

**Pourquoi**

Les différents modèles varient considérablement en capacité de raisonnement et en coût. Un choix judicieux peut économiser beaucoup de tokens.

**Guide de sélection de modèle**

| Modèle | Cas d'utilisation | Coût | Capacité de raisonnement |
| --- | --- | --- | --- |
| **Haiku 4.5** | Agents légers, appels fréquents, génération de code | Faible (1/3 de Sonnet) | 90% des capacités de Sonnet |
| **Sonnet 4.5** | Développement principal, tâches de codage complexes, orchestration | Moyen | Meilleur modèle de codage |
| **Opus 4.5** | Décisions d'architecture, raisonnement approfondi, analyse de recherche | Élevé | Capacité de raisonnement maximale |

**Méthode de configuration**

Dans les fichiers d'agent du répertoire `agents/` :

```markdown
---
name: planner
description: Planifie les étapes d'implémentation de fonctionnalités complexes
model: opus
---

Vous êtes un planificateur senior...
```

**Ce que vous devriez voir** :
- Les tâches de raisonnement avancé (comme la conception d'architecture) utilisent Opus pour une meilleure qualité
- Les tâches de codage utilisent Sonnet pour le meilleur rapport qualité-prix
- Les agents worker appelés fréquemment utilisent Haiku pour économiser les coûts

### Étape 2 : Activer le Hook de compression stratégique

Configurez un Hook pour vous rappeler de compresser le contexte aux points de transition logiques.

**Pourquoi**

La compression automatique se déclenche à des moments arbitraires et peut perdre des informations clés. La compression stratégique vous permet de décider du moment de compression.

**Étapes de configuration**

Assurez-vous que `hooks/hooks.json` contient les configurations PreToolUse et PreCompact :

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Edit\" || tool == \"Write\"",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
          }
        ],
        "description": "Suggest manual compaction at logical intervals"
      }
    ],
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
          }
        ],
        "description": "Save state before context compaction"
      }
    ]
  }
}
```

**Personnaliser le seuil**

Définissez la variable d'environnement `COMPACT_THRESHOLD` pour contrôler la fréquence des suggestions (par défaut 50 appels d'outils) :

```json
// Ajouter dans ~/.claude/settings.json
{
  "env": {
    "COMPACT_THRESHOLD": "50"  // Première suggestion après 50 appels d'outils
  }
}
```

**Ce que vous devriez voir** :
- Après chaque édition ou écriture de fichier, le Hook compte les appels d'outils
- Une fois le seuil atteint (50 par défaut), vous verrez le message :
  ```
  [StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
  ```
- Ensuite, tous les 25 appels d'outils, vous verrez :
  ```
  [StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
  ```

### Étape 3 : Compresser aux points de transition logiques

Suivez les suggestions du Hook pour compresser manuellement au bon moment.

**Pourquoi**

Compresser après un changement de tâche ou l'achèvement d'une étape importante permet de préserver le contexte clé tout en éliminant les informations redondantes.

**Guide des moments de compression**

✅ **Moments recommandés pour compresser** :
- Après avoir terminé la planification, avant de commencer l'implémentation
- Après avoir terminé une étape fonctionnelle, avant de passer à la suivante
- Après le débogage, avant de reprendre le développement
- Lors du passage à un type de tâche différent

❌ **Moments à éviter pour compresser** :
- En cours d'implémentation d'une fonctionnalité
- Au milieu du débogage d'un problème
- Pendant la modification de plusieurs fichiers liés

**Étapes d'exécution**

Quand vous voyez la suggestion du Hook :

1. Évaluez la phase actuelle de la tâche
2. Si c'est approprié de compresser, exécutez :
   ```bash
   /compact
   ```
3. Attendez que Claude résume le contexte
4. Vérifiez que les informations clés ont été préservées

**Ce que vous devriez voir** :
- Après la compression, la fenêtre de contexte libère beaucoup d'espace
- Les informations clés (comme le plan d'implémentation, les fonctionnalités terminées) sont préservées
- Les nouvelles interactions commencent avec un contexte épuré

### Étape 4 : Optimiser la configuration MCP

Contrôlez le nombre de serveurs MCP activés pour protéger la fenêtre de contexte.

**Pourquoi**

Chaque serveur MCP consomme de l'espace dans le prompt système. En activer trop réduit considérablement la fenêtre de contexte.

**Principes de configuration**

Selon l'expérience du README :

```json
{
  "mcpServers": {
    // Vous pouvez configurer 20-30 MCP...
    "github": { ... },
    "supabase": { ... },
    // ...plus de configurations
  },
  "disabledMcpServers": [
    "firecrawl",       // Désactiver les MCP peu utilisés
    "clickhouse",
    // ...désactiver selon les besoins du projet
  ]
}
```

**Bonnes pratiques** :

- **Configurer tous les MCP** (20-30), basculer de manière flexible selon le projet
- **Activer < 10 MCP**, maintenir les outils actifs < 80
- **Choisir selon le projet** : activer les MCP liés aux bases de données pour le backend, ceux liés au build pour le frontend

**Méthode de vérification**

Vérifier le nombre d'outils :

```bash
// Claude Code affichera les outils actuellement activés
/tool list
```

**Ce que vous devriez voir** :
- Nombre total d'outils < 80
- Fenêtre de contexte maintenue à 180k+ (éviter de descendre sous 70k)
- Liste d'activation ajustée dynamiquement selon les besoins du projet

### Étape 5 : Combiner avec Memory Persistence

Utilisez les Hooks pour préserver l'état clé après la compression.

**Pourquoi**

La compression stratégique perd du contexte, mais l'état clé (comme le plan d'implémentation, les checkpoints) doit être préservé.

**Configurer les Hooks**

Assurez-vous que les Hooks suivants sont activés :

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
          }
        ],
        "description": "Load previous context and detect package manager on new session"
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
          }
        ],
        "description": "Persist session state on end"
      }
    ]
  }
}
```

**Flux de travail** :

1. Après avoir terminé une tâche, utilisez `/checkpoint` pour sauvegarder l'état
2. Avant de compresser le contexte, le Hook PreCompact sauvegarde automatiquement
3. Au démarrage d'une nouvelle session, le Hook SessionStart charge automatiquement
4. Les informations clés (plans, état) sont persistées, non affectées par la compression

**Ce que vous devriez voir** :
- Après la compression, l'état important reste disponible
- Les nouvelles sessions restaurent automatiquement le contexte précédent
- Les décisions clés et les plans d'implémentation ne sont pas perdus

## Point de contrôle ✅

- [ ] Hook `strategic-compact` configuré
- [ ] Modèle approprié sélectionné selon la tâche (Haiku/Sonnet/Opus)
- [ ] MCP activés < 10, nombre total d'outils < 80
- [ ] Compression aux points de transition logiques (fin de planification/étapes importantes)
- [ ] Hooks Memory Persistence activés, état clé préservé

## Pièges à éviter

### ❌ Erreur courante 1 : Utiliser Opus pour toutes les tâches

**Problème** : Bien qu'Opus soit le plus puissant, il coûte 10 fois plus que Sonnet et 30 fois plus que Haiku.

**Correction** : Choisir le modèle selon le type de tâche :
- Agents appelés fréquemment (comme la revue de code, le formatage) → Haiku
- Travail de développement principal → Sonnet
- Décisions d'architecture, raisonnement approfondi → Opus

### ❌ Erreur courante 2 : Ignorer les suggestions de compression du Hook

**Problème** : Continuer à travailler après avoir vu `[StrategicCompact]`, le contexte finit par être compressé automatiquement, perdant des informations clés.

**Correction** : Évaluer la phase de la tâche et exécuter `/compact` au moment approprié en réponse à la suggestion.

### ❌ Erreur courante 3 : Activer tous les serveurs MCP

**Problème** : 20+ MCP configurés et tous activés, la fenêtre de contexte passe de 200k à 70k.

**Correction** : Utiliser `disabledMcpServers` pour désactiver les MCP peu utilisés, maintenir < 10 MCP actifs.

### ❌ Erreur courante 4 : Compresser pendant l'implémentation

**Problème** : Compresser le contexte d'une fonctionnalité en cours d'implémentation, le modèle "oublie" les discussions précédentes.

**Correction** : Compresser uniquement aux points de transition logiques (fin de planification, changement de tâche, étape importante terminée).

## Résumé de la leçon

L'optimisation des tokens consiste à **préserver les informations précieuses aux moments critiques** :

1. **Sélection de modèle** - Haiku/Sonnet/Opus ont chacun leurs cas d'utilisation, un choix judicieux économise les coûts
2. **Compression stratégique** - Compresser manuellement aux points de transition logiques pour éviter la perte d'informations lors de la compression automatique
3. **Gestion MCP** - Contrôler le nombre d'activations pour protéger la fenêtre de contexte
4. **Memory Persistence** - Garder l'état clé disponible après la compression

En suivant ces stratégies, vous pouvez maximiser l'efficacité du contexte de Claude Code et éviter la dégradation de qualité due à la saturation du contexte.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Boucle de Vérification : Checkpoint et Evals](../verification-loop/)**.
>
> Vous apprendrez :
> - Comment utiliser Checkpoint pour sauvegarder et restaurer l'état de travail
> - La méthode Eval Harness pour la vérification continue
> - Les types de Grader et la métrique Pass@K
> - L'application de la boucle de vérification dans le TDD

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Skill de compression stratégique | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Hook de suggestion de compression | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Hook de sauvegarde pré-compression | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Règles d'optimisation de performance | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Configuration des Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Explication de la fenêtre de contexte | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 349-359 |

**Constantes clés** :
- `COMPACT_THRESHOLD = 50` : Seuil d'appels d'outils (valeur par défaut)
- `MCP_LIMIT = 10` : Limite recommandée de MCP activés
- `TOOL_LIMIT = 80` : Limite recommandée du nombre total d'outils

**Fonctions clés** :
- `suggest-compact.js:main()` : Compte les appels d'outils et suggère la compression
- `pre-compact.js:main()` : Sauvegarde l'état de session avant la compression

</details>
