---
title: "Optimisation des performances : Modèles et contexte | Everything Claude Code"
sidebarTitle: "Réponses 10x plus rapides"
subtitle: "Optimisation des performances : Améliorer la vitesse de réponse"
description: "Apprenez les stratégies d'optimisation des performances d'Everything Claude Code. Maîtrisez la sélection des modèles, la gestion de la fenêtre de contexte, la configuration MCP et la compression stratégique pour améliorer la vitesse de réponse et l'efficacité du développement."
tags:
  - "performance"
  - "optimization"
  - "token-usage"
prerequisite:
  - "start-quick-start"
order: 180
---

# Optimisation des performances : Améliorer la vitesse de réponse

## Ce que vous apprendrez

- Choisir le modèle approprié selon la complexité de la tâche, en équilibrant coût et performance
- Gérer efficacement la fenêtre de contexte pour éviter d'atteindre les limites
- Configurer judicieusement les serveurs MCP pour maximiser le contexte disponible
- Utiliser la compression stratégique pour maintenir la cohérence logique des conversations

## Votre situation actuelle

Claude Code répond lentement ? La fenêtre de contexte se remplit rapidement ? Vous ne savez pas quand utiliser Haiku, Sonnet ou Opus ? Ces problèmes peuvent sérieusement affecter votre efficacité de développement.

## Concept fondamental

Le cœur de l'optimisation des performances est d'**utiliser le bon outil au bon moment**. Que ce soit pour choisir un modèle, gérer le contexte ou configurer MCP, il s'agit toujours d'un compromis : vitesse vs intelligence, coût vs qualité.

::: info Concept clé

La **fenêtre de contexte** représente la longueur de l'historique de conversation que Claude peut « mémoriser ». Les modèles actuels supportent environ 200k tokens, mais cette capacité est influencée par le nombre de serveurs MCP activés, le nombre d'appels d'outils, etc.

:::

## Problèmes de performance courants

### Problème 1 : Réponses lentes

**Symptômes** : Même les tâches simples prennent beaucoup de temps

**Causes possibles** :
- Utilisation d'Opus pour des tâches simples
- Contexte trop long nécessitant le traitement d'un historique volumineux
- Trop de serveurs MCP activés

**Solutions** :
- Utiliser Haiku pour les tâches légères
- Compresser régulièrement le contexte
- Réduire le nombre de MCP activés

### Problème 2 : Fenêtre de contexte rapidement saturée

**Symptômes** : Nécessité de compresser ou redémarrer la session après peu de temps de développement

**Causes possibles** :
- Trop de serveurs MCP activés (chaque MCP consomme du contexte)
- Historique de conversation non compressé à temps
- Utilisation de chaînes d'appels d'outils complexes

**Solutions** :
- Activer les MCP à la demande, utiliser `disabledMcpServers` pour désactiver ceux inutilisés
- Utiliser la compression stratégique, compresser manuellement aux frontières de tâches
- Éviter les lectures de fichiers et recherches inutiles

### Problème 3 : Consommation rapide de tokens

**Symptômes** : Quota épuisé rapidement, coûts élevés

**Causes possibles** :
- Utilisation systématique d'Opus pour toutes les tâches
- Lecture répétée de nombreux fichiers
- Compression non utilisée de manière appropriée

**Solutions** :
- Choisir le modèle selon la complexité de la tâche
- Utiliser `/compact` pour compresser proactivement
- Utiliser les hooks strategic-compact pour des rappels intelligents

## Stratégie de sélection des modèles

Choisir le modèle approprié selon la complexité de la tâche peut considérablement améliorer les performances et réduire les coûts.

### Haiku 4.5 (90% des capacités de Sonnet, 3x d'économies)

**Cas d'utilisation** :
- Agents légers avec appels fréquents
- Programmation en binôme et génération de code
- Agents workers dans les systèmes multi-agents

**Exemple** :
```markdown
Modifications de code simples, formatage, génération de commentaires
Utiliser Haiku
```

### Sonnet 4.5 (Meilleur modèle de codage)

**Cas d'utilisation** :
- Travail de développement principal
- Coordination des workflows multi-agents
- Tâches de codage complexes

**Exemple** :
```markdown
Implémentation de nouvelles fonctionnalités, refactoring, correction de bugs complexes
Utiliser Sonnet
```

### Opus 4.5 (Capacité de raisonnement maximale)

**Cas d'utilisation** :
- Décisions architecturales complexes
- Tâches nécessitant une profondeur de raisonnement maximale
- Tâches de recherche et d'analyse

**Exemple** :
```markdown
Conception de systèmes, audits de sécurité, résolution de problèmes complexes
Utiliser Opus
```

::: tip Conseil de sélection de modèle

Spécifiez le modèle via le champ `model` dans la configuration de l'agent :
```markdown
---
name: my-agent
model: haiku  # ou sonnet, opus
---
```

:::

## Gestion de la fenêtre de contexte

Une utilisation excessive de la fenêtre de contexte affecte les performances et peut même entraîner l'échec des tâches.

### Éviter les tâches dans les derniers 20% de la fenêtre de contexte

Pour ces tâches, il est recommandé de compresser le contexte d'abord :
- Refactoring à grande échelle
- Implémentation de fonctionnalités sur plusieurs fichiers
- Débogage d'interactions complexes

### Tâches moins sensibles au contexte

Ces tâches ont des exigences de contexte plus faibles et peuvent continuer près de la limite :
- Édition de fichier unique
- Création d'outils indépendants
- Mise à jour de documentation
- Corrections de bugs simples

::: warning Rappel important

La fenêtre de contexte est influencée par :
- Le nombre de serveurs MCP activés
- Le nombre d'appels d'outils
- La longueur de l'historique de conversation
- Les opérations sur les fichiers de la session en cours

:::

## Optimisation de la configuration MCP

Les serveurs MCP sont un moyen important d'étendre les capacités de Claude Code, mais chaque MCP consomme du contexte.

### Principes de base

Selon les recommandations du README :

```json
{
  "mcpServers": {
    "mcp-server-1": { ... },
    "mcp-server-2": { ... }
    // ... plus de configurations
  },
  "disabledMcpServers": [
    "mcp-server-3",
    "mcp-server-4"
    // Désactiver les MCP inutilisés
  ]
}
```

**Bonnes pratiques** :
- Vous pouvez configurer 20-30 serveurs MCP
- Activer au maximum 10 par projet
- Maintenir le nombre d'outils actifs en dessous de 80

### Activer les MCP à la demande

Sélectionnez les MCP pertinents selon le type de projet :

| Type de projet | Recommandés | Optionnels |
| --- | --- | --- |
| Projet frontend | Vercel, Magic | Filesystem, GitHub |
| Projet backend | Supabase, ClickHouse | GitHub, Railway |
| Projet full-stack | Tous | - |
| Bibliothèque d'outils | GitHub | Filesystem |

::: tip Comment basculer les MCP

Utilisez `disabledMcpServers` dans la configuration du projet (`~/.claude/settings.json`) :
```json
{
  "disabledMcpServers": ["cloudflare-observability", "clickhouse-io"]
}
```

:::

## Compression stratégique

La compression automatique peut se déclencher à tout moment et interrompre la logique de la tâche. La compression stratégique s'exécute manuellement aux frontières de tâches pour maintenir la cohérence logique.

### Pourquoi la compression stratégique est nécessaire

**Problèmes de la compression automatique** :
- Se déclenche souvent en pleine tâche, perdant un contexte important
- Ne comprend pas les frontières logiques des tâches
- Peut interrompre des opérations complexes en plusieurs étapes

**Avantages de la compression stratégique** :
- Compresse aux frontières de tâches, préservant les informations clés
- Logique plus claire
- Évite l'interruption des processus importants

### Meilleurs moments pour compresser

1. **Après l'exploration, avant l'exécution** - Compresser le contexte de recherche, conserver le plan d'implémentation
2. **Après avoir atteint un jalon** - Repartir à zéro pour la phase suivante
3. **Avant de changer de tâche** - Effacer le contexte d'exploration, préparer la nouvelle tâche

### Hook Strategic Compact

Ce plugin inclut le skill `strategic-compact` qui vous rappelle automatiquement quand compresser.

**Fonctionnement du hook** :
- Suit le nombre d'appels d'outils
- Rappelle lorsque le seuil est atteint (50 appels par défaut)
- Rappelle ensuite tous les 25 appels

**Configuration du seuil** :
```bash
# Définir la variable d'environnement
export COMPACT_THRESHOLD=40
```

**Configuration du hook** (incluse dans `hooks/hooks.json`) :
```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }]
}
```

### Conseils d'utilisation

1. **Compresser après la planification** - Une fois le plan établi, compresser et recommencer
2. **Compresser après le débogage** - Effacer le contexte de résolution d'erreurs, continuer l'étape suivante
3. **Ne pas compresser pendant l'implémentation** - Conserver le contexte des modifications associées
4. **Suivre les rappels** - Le hook vous dit « quand », vous décidez « si vous compressez »

::: tip Voir l'état actuel

Utilisez la commande `/checkpoint` pour sauvegarder l'état actuel avant de compresser la session.

:::

## Liste de vérification des performances

Dans votre utilisation quotidienne, vérifiez régulièrement les points suivants :

### Utilisation des modèles
- [ ] Utiliser Haiku plutôt que Sonnet/Opus pour les tâches simples
- [ ] Utiliser Opus plutôt que Sonnet pour le raisonnement complexe
- [ ] Spécifier le modèle approprié dans la configuration de l'agent

### Gestion du contexte
- [ ] Pas plus de 10 MCP activés
- [ ] Utiliser régulièrement `/compact` pour compresser
- [ ] Compresser aux frontières de tâches plutôt qu'en pleine tâche

### Configuration MCP
- [ ] Activer uniquement les MCP nécessaires au projet
- [ ] Utiliser `disabledMcpServers` pour gérer les MCP inutilisés
- [ ] Vérifier régulièrement le nombre d'outils actifs (recommandé < 80)

## Questions fréquentes

### Q : Quand utiliser Haiku, Sonnet ou Opus ?

**R** : Selon la complexité de la tâche :
- **Haiku** : Tâches légères, appels fréquents (formatage de code, génération de commentaires)
- **Sonnet** : Travail de développement principal, coordination d'agents (implémentation de fonctionnalités, refactoring)
- **Opus** : Raisonnement complexe, décisions architecturales (conception de systèmes, audits de sécurité)

### Q : Que faire quand la fenêtre de contexte est pleine ?

**R** : Utilisez immédiatement `/compact` pour compresser la session. Si le hook strategic-compact est activé, il vous rappellera au bon moment. Vous pouvez utiliser `/checkpoint` pour sauvegarder les états importants avant de compresser.

### Q : Comment savoir combien de MCP sont activés ?

**R** : Consultez les configurations `mcpServers` et `disabledMcpServers` dans `~/.claude/settings.json`. Le nombre de MCP actifs = total - nombre dans `disabledMcpServers`.

### Q : Pourquoi mes réponses sont-elles particulièrement lentes ?

**R** : Vérifiez les points suivants :
1. Utilisez-vous Opus pour des tâches simples ?
2. La fenêtre de contexte est-elle presque pleine ?
3. Trop de serveurs MCP activés ?
4. Effectuez-vous des opérations sur de nombreux fichiers ?

## Résumé de la leçon

Le cœur de l'optimisation des performances est d'« utiliser le bon outil au bon moment » :

- **Sélection du modèle** : Choisir Haiku/Sonnet/Opus selon la complexité de la tâche
- **Gestion du contexte** : Éviter les derniers 20% de la fenêtre, compresser à temps
- **Configuration MCP** : Activer à la demande, pas plus de 10
- **Compression stratégique** : Compresser manuellement aux frontières de tâches pour maintenir la cohérence logique

## Cours connexes

- [Stratégies d'optimisation des tokens](../../advanced/token-optimization/) - Approfondir la gestion de la fenêtre de contexte
- [Automatisation avec les Hooks](../../advanced/hooks-automation/) - Comprendre la configuration du hook strategic-compact
- [Configuration des serveurs MCP](../../start/mcp-setup/) - Apprendre à configurer les serveurs MCP

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Règles de performance | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Skill de compression stratégique | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Configuration des hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Hook Strategic Compact | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json#L46-L54) | 46-54 |
| Script Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | - |
| Exemple de configuration MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | - |

**Règles clés** :
- **Sélection du modèle** : Haiku (tâches légères), Sonnet (développement principal), Opus (raisonnement complexe)
- **Fenêtre de contexte** : Éviter les derniers 20%, compresser à temps
- **Configuration MCP** : Maximum 10 par projet, outils actifs < 80
- **Compression stratégique** : Compresser manuellement aux frontières de tâches, éviter les interruptions automatiques

**Variables d'environnement clés** :
- `COMPACT_THRESHOLD` : Seuil du nombre d'appels d'outils (par défaut : 50)

</details>
