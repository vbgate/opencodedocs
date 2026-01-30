---
title: "Impact sur le cache : équilibrer taux de succès et économies | opencode-dcp"
subtitle: "Prompt Caching : comment DCP équilibre le taux de succès du cache et les économies de tokens"
sidebarTitle: "Cache réduit = perte ?"
description: "Comprenez comment DCP affecte le taux de succès du Prompt Caching et les économies de tokens. Maîtrisez les meilleures pratiques pour Anthropic, OpenAI et autres fournisseurs, et ajustez dynamiquement votre stratégie selon le modèle de facturation."
tags:
  - "advanced"
  - "prompt-caching"
  - "token-optimization"
  - "cost-optimization"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
  - "platforms-llm-tools"
order: 3
---

# Impact sur le Prompt Cache : équilibrer taux de succès et économies de tokens

## Ce que vous apprendrez

- Comprendre le fonctionnement du Prompt Caching des fournisseurs LLM
- Savoir pourquoi l'élagage DCP affecte le taux de succès du cache
- Apprendre à équilibrer la perte de cache et les économies de tokens
- Définir la meilleure stratégie selon votre fournisseur et modèle de facturation

## Le problème actuel

Après avoir activé DCP, vous remarquez que le taux de succès du cache est passé de 85% à 65%, et vous vous demandez si cela n'augmente pas les coûts ? Ou vous souhaitez savoir si l'utilisation de DCP a des impacts différents selon les fournisseurs LLM (Anthropic, OpenAI, GitHub Copilot) ?

L'élagage DCP modifie le contenu des messages, ce qui affecte le Prompt Caching. Mais ce compromis en vaut-il la peine ? Analysons cela en détail.

## Quand utiliser cette technique

- Dans les longues sessions où l'inflation du contexte devient significative
- Avec des fournisseurs facturant par requête (comme GitHub Copilot, Google Antigravity)
- Pour réduire la pollution du contexte et améliorer la qualité des réponses du modèle
- Quand les économies de tokens dépassent la perte de taux de succès du cache

## Concept clé

**Qu'est-ce que le Prompt Caching**

Le **Prompt Caching** est une technique proposée par les fournisseurs LLM (comme Anthropic, OpenAI) pour optimiser les performances et les coûts. Elle repose sur la **correspondance exacte des préfixes** pour mettre en cache les prompts déjà traités, évitant ainsi de recalculer les tokens pour les préfixes identiques.

::: info Exemple du mécanisme de cache

Supposons que vous ayez l'historique de conversation suivant :

```
[Prompt système]
[Message utilisateur 1]
[Réponse IA 1 + Appel d'outil A]
[Message utilisateur 2]
[Réponse IA 2 + Appel d'outil A]  ← Même appel d'outil
[Message utilisateur 3]
```

Sans cache, chaque envoi au LLM nécessite de recalculer tous les tokens. Avec le cache, lors du second envoi, le fournisseur peut réutiliser les résultats précédemment calculés et ne traiter que la nouvelle partie « Message utilisateur 3 ».

:::

**Comment DCP affecte le cache**

Lorsque DCP élague la sortie d'un outil, il remplace le contenu original par un texte de substitution : `"[Output removed to save context - information superseded or no longer needed]"`

Cette opération modifie le contenu exact du message (qui était la sortie complète de l'outil, maintenant remplacée par un placeholder), provoquant ainsi une **invalidation du cache** — le préfixe mis en cache à partir de ce point ne peut plus être réutilisé.

**Analyse du compromis**

| Métrique | Sans DCP | Avec DCP | Impact |
| --- | --- | --- | --- |
| **Taux de succès du cache** | ~85% | ~65% | ⬇️ Réduction de 20% |
| **Taille du contexte** | Croissance continue | Élagage contrôlé | ⬇️ Réduction significative |
| **Économies de tokens** | 0 | 10-40% | ⬆️ Augmentation significative |
| **Qualité des réponses** | Peut diminuer | Plus stable | ⬆️ Amélioration (moins de pollution du contexte) |

::: tip Pourquoi le coût peut baisser malgré la réduction du taux de cache ?

La baisse du taux de succès du cache n'équivaut pas à une augmentation des coûts. Voici pourquoi :

1. **Les économies de tokens dépassent généralement la perte de cache** : dans les longues sessions, les tokens économisés par l'élagage DCP (10-40%) surpassent souvent le surcoût de calcul dû à l'invalidation du cache
2. **Réduction de la pollution du contexte** : une fois le contenu redondant supprimé, le modèle peut mieux se concentrer sur la tâche en cours, améliorant la qualité des réponses
3. **Le taux de succès absolu reste élevé** : même à 65%, près des deux tiers du contenu peuvent encore être mis en cache

Les données de test montrent que dans la plupart des cas, les économies de tokens de DCP sont plus significatives.
:::

## Impact selon le modèle de facturation

### Facturation par requête (GitHub Copilot, Google Antigravity)

**Cas d'usage optimal**, aucun impact négatif.

Ces fournisseurs facturent par nombre de requêtes, pas par nombre de tokens. Par conséquent :

- ✅ Les tokens économisés par l'élagage DCP n'affectent pas directement les frais
- ✅ La réduction de la taille du contexte améliore la vitesse de réponse
- ✅ L'invalidation du cache n'entraîne pas de coûts supplémentaires

::: info GitHub Copilot et Google Antigravity

Ces deux plateformes facturent par requête, DCP est une **optimisation à coût zéro** — même si le taux de succès du cache diminue, cela n'augmente pas les frais, et améliore même les performances.

:::

### Facturation par token (Anthropic, OpenAI)

Il faut équilibrer la perte de cache et les économies de tokens.

**Exemple de calcul** :

Supposons une longue session avec 100 messages et un total de 100K tokens :

| Scénario | Taux de cache | Tokens économisés par cache | Tokens économisés par élagage DCP | Économie totale |
| --- | --- | --- | --- | --- |
| Sans DCP | 85% | 85K × (1-0.85) = 12.75K | 0 | 12.75K |
| Avec DCP | 65% | 100K × (1-0.65) = 35K | 20K (estimation) | 35K + 20K - 12.75K = **42.25K** |

Après l'élagage DCP, bien que le taux de succès du cache diminue, la réduction du contexte de 20K tokens entraîne une économie totale plus importante.

::: warning Avantage marqué pour les longues sessions

Dans les longues sessions, l'avantage de DCP est plus prononcé :

- **Sessions courtes** (< 10 messages) : l'invalidation du cache peut dominer, bénéfice limité
- **Sessions longues** (> 30 messages) : l'inflation du contexte est sévère, les tokens économisés par l'élagage DCP dépassent largement la perte de cache

Recommandation : activez DCP en priorité pour les longues sessions, vous pouvez le désactiver pour les sessions courtes.
:::

## Observation et vérification

### Étape 1 : Observer l'utilisation des tokens de cache

**Pourquoi**
Comprendre la proportion des tokens de cache dans le total des tokens, évaluer l'importance du cache

```bash
# Exécuter dans OpenCode
/dcp context
```

**Ce que vous devriez voir** : une analyse des tokens similaire à ceci

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Interprétation des métriques clés** :

| Métrique | Signification | Comment évaluer |
| --- | --- | --- |
| **Pruned** | Nombre d'outils élagués et tokens économisés | Plus c'est élevé, plus DCP économise |
| **Current context** | Nombre total de tokens du contexte actuel | Devrait être significativement inférieur à Without DCP |
| **Without DCP** | Taille théorique du contexte sans DCP | Pour comparer l'effet des économies |

### Étape 2 : Comparer avec/sans DCP

**Pourquoi**
Par la comparaison, ressentir intuitivement la différence entre cache et économies de tokens

```bash
# 1. Désactiver DCP (définir enabled: false dans la configuration)
# Ou désactiver temporairement :
/dcp sweep 999  # Élaguer tous les outils, observer l'effet du cache

# 2. Effectuer quelques échanges

# 3. Voir les statistiques
/dcp stats

# 4. Réactiver DCP
# (modifier la configuration ou restaurer les valeurs par défaut)

# 5. Continuer la conversation, comparer les statistiques
/dcp stats
```

**Ce que vous devriez voir** :

Utilisez `/dcp context` pour observer les changements des métriques clés :

| Métrique | DCP désactivé | DCP activé | Explication |
| --- | --- | --- | --- |
| **Pruned** | 0 tools | 5-20 tools | Nombre d'outils élagués par DCP |
| **Current context** | Plus grand | Plus petit | Le contexte diminue significativement avec DCP |
| **Without DCP** | Identique à Current | Supérieur à Current | Montre le potentiel d'économie de DCP |

::: tip Conseils pour les tests pratiques

Testez dans différents types de sessions :

1. **Sessions courtes** (5-10 messages) : observer si le cache est plus important
2. **Sessions longues** (30+ messages) : observer si les économies de DCP sont plus significatives
3. **Lectures répétées** : scénarios de lecture fréquente des mêmes fichiers

Cela vous aidera à faire le meilleur choix selon vos habitudes d'utilisation.
:::

### Étape 3 : Comprendre l'impact de la pollution du contexte

**Pourquoi**
L'élagage DCP ne fait pas qu'économiser des tokens, il réduit aussi la pollution du contexte, améliorant la qualité des réponses

::: info Qu'est-ce que la pollution du contexte ?

La **pollution du contexte** désigne la surcharge d'informations redondantes, non pertinentes ou obsolètes dans l'historique de conversation, entraînant :

- Une attention dispersée du modèle, difficulté à se concentrer sur la tâche en cours
- Des références possibles à des données obsolètes (comme le contenu de fichiers modifiés)
- Une baisse de qualité des réponses, nécessitant plus de tokens pour « comprendre » le contexte

DCP réduit cette pollution en supprimant les sorties d'outils terminés, les opérations de lecture en double, etc.
:::

**Comparaison des effets pratiques** :

| Scénario | Sans DCP | Avec DCP |
| --- | --- | --- |
| Lecture du même fichier 3 fois | Conserve 3 sorties complètes (redondant) | Ne conserve que la plus récente |
| Lecture après écriture d'un fichier | Ancienne opération d'écriture + nouvelle lecture | Ne conserve que la nouvelle lecture |
| Sortie d'outil en erreur | Conserve l'entrée complète en erreur | Ne conserve que le message d'erreur |

En réduisant la pollution du contexte, le modèle peut comprendre plus précisément l'état actuel, réduisant les « hallucinations » ou les références à des données obsolètes.

## Recommandations de bonnes pratiques

### Choisir la stratégie selon le fournisseur

| Fournisseur | Modèle de facturation | Recommandation | Raison |
| --- | --- | --- | --- |
| **GitHub Copilot** | Par requête | ✅ Toujours activer | Optimisation à coût zéro, améliore uniquement les performances |
| **Google Antigravity** | Par requête | ✅ Toujours activer | Idem |
| **Anthropic** | Par token | ✅ Activer pour les longues sessions<br>⚠️ Optionnel pour les courtes | Équilibrer cache et économies |
| **OpenAI** | Par token | ✅ Activer pour les longues sessions<br>⚠️ Optionnel pour les courtes | Idem |

### Ajuster la configuration selon le type de session

```jsonc
// ~/.config/opencode/dcp.jsonc ou configuration projet

{
  // Sessions longues (> 30 messages) : activer toutes les stratégies
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": true },  // Recommandé d'activer
    "purgeErrors": { "enabled": true }
  },

  // Sessions courtes (< 10 messages) : activer uniquement la déduplication
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": false },
    "purgeErrors": { "enabled": false }
  }
}
```

**Explication des stratégies** :

- **deduplication (déduplication)** : impact faible, recommandé de toujours activer
- **supersedeWrites (écrasement d'écriture)** : impact moyen, recommandé pour les longues sessions
- **purgeErrors (purge des erreurs)** : impact faible, recommandé d'activer

### Ajustement dynamique de la stratégie

Utilisez `/dcp context` pour observer la composition des tokens et l'effet de l'élagage :

```bash
# Si la valeur Pruned est élevée, DCP économise activement des tokens
# Comparez Current context et Without DCP pour évaluer l'effet des économies

/dcp context
```

## Points de contrôle ✅

Confirmez que vous avez compris les points suivants :

- [ ] Le Prompt Caching repose sur la correspondance exacte des préfixes, tout changement de contenu invalide le cache
- [ ] L'élagage DCP modifie le contenu des messages, entraînant une baisse du taux de succès du cache (~20%)
- [ ] Dans les longues sessions, les économies de tokens dépassent généralement la perte de cache
- [ ] GitHub Copilot et Google Antigravity facturent par requête, DCP est une optimisation à coût zéro
- [ ] Anthropic et OpenAI facturent par token, il faut équilibrer cache et économies
- [ ] Utilisez `/dcp context` pour observer la composition des tokens et l'effet de l'élagage
- [ ] Ajustez dynamiquement la configuration des stratégies selon la longueur de la session

## Pièges à éviter

### ❌ Croire que la baisse du taux de cache équivaut à une augmentation des coûts

**Problème** : voir le taux de succès du cache passer de 85% à 65% et penser que les coûts vont augmenter

**Raison** : se concentrer uniquement sur le taux de cache, en ignorant les économies de tokens et la réduction du contexte

**Solution** : utilisez `/dcp context` pour voir les données réelles, en vous concentrant sur :
1. Les tokens économisés par l'élagage DCP (`Pruned`)
2. La taille actuelle du contexte (`Current context`)
3. La taille théorique sans élagage (`Without DCP`)

En comparant `Without DCP` et `Current context`, vous pouvez voir le nombre réel de tokens économisés par DCP.

### ❌ Élagage trop agressif dans les sessions courtes

**Problème** : sessions de 5-10 messages avec toutes les stratégies activées, invalidation du cache évidente

**Raison** : dans les sessions courtes, l'inflation du contexte n'est pas sévère, le bénéfice d'un élagage agressif est faible

**Solution** :
- Pour les sessions courtes, n'activer que `deduplication` et `purgeErrors`
- Désactiver la stratégie `supersedeWrites`
- Ou désactiver complètement DCP (`enabled: false`)

### ❌ Ignorer les différences de facturation entre fournisseurs

**Problème** : s'inquiéter de l'augmentation des coûts due à l'invalidation du cache sur GitHub Copilot

**Raison** : ne pas avoir remarqué que Copilot facture par requête, l'invalidation du cache n'augmente pas les frais

**Solution** :
- Copilot et Antigravity : toujours activer DCP
- Anthropic et OpenAI : ajuster la stratégie selon la longueur de la session

### ❌ Prendre des décisions sans observer les données réelles

**Problème** : décider d'activer ou non DCP au feeling

**Raison** : ne pas utiliser `/dcp context` et `/dcp stats` pour observer les effets réels

**Solution** :
- Collecter des données dans différents types de sessions
- Comparer les différences avec/sans DCP
- Faire votre choix selon vos habitudes d'utilisation

## Résumé de la leçon

**Mécanisme central du Prompt Caching** :

- Les fournisseurs LLM mettent en cache les prompts basés sur la **correspondance exacte des préfixes**
- L'élagage DCP modifie le contenu des messages, provoquant l'invalidation du cache
- Le taux de succès du cache diminue (~20%), mais les économies de tokens sont plus significatives

**Matrice de décision** :

| Scénario | Configuration recommandée | Raison |
| --- | --- | --- |
| GitHub Copilot/Google Antigravity | ✅ Toujours activer | Facturation par requête, optimisation à coût zéro |
| Anthropic/OpenAI sessions longues | ✅ Activer toutes les stratégies | Économies de tokens > perte de cache |
| Anthropic/OpenAI sessions courtes | ⚠️ Activer uniquement déduplication + purge des erreurs | Le cache est plus important |

**Points clés** :

1. **La baisse du taux de cache n'équivaut pas à une augmentation des coûts** : il faut regarder l'économie totale de tokens
2. **Le modèle de facturation du fournisseur influence la stratégie** : par requête vs par token
3. **Ajuster dynamiquement selon la longueur de la session** : les longues sessions bénéficient davantage
4. **Utiliser les outils pour observer les données** : `/dcp context` et `/dcp stats`

**Résumé des bonnes pratiques** :

```
1. Identifiez votre fournisseur et son modèle de facturation
2. Ajustez la configuration des stratégies selon la longueur de la session
3. Utilisez régulièrement /dcp context pour observer les effets
4. Pour les longues sessions, privilégiez les économies de tokens
5. Pour les sessions courtes, privilégiez le taux de succès du cache
```

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons la **[Gestion des sous-agents](/fr/Opencode-DCP/opencode-dynamic-context-pruning/advanced/subagent-handling/)**.
>
> Vous apprendrez :
> - Comment DCP détecte les sessions de sous-agents
> - Pourquoi les sous-agents ne participent pas à l'élagage
> - Comment les résultats d'élagage des sous-agents sont transmis à l'agent principal

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Explication du Prompt Caching | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 46-52 |
| Calcul des tokens (avec cache) | [`lib/messages/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/utils.ts) | 66-78 |
| Commande d'analyse du contexte | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174 |
| Calcul des tokens de cache | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 106-107 |
| Journalisation des tokens de cache | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts) | 141 |
| Définition du placeholder d'élagage | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 6-7 |
| Élagage des sorties d'outils | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 22-46 |

**Constantes clés** :
- Aucune

**Fonctions clés** :
- `calculateTokens(messages, tokenizer)` : calcule le nombre de tokens des messages, incluant cache.read et cache.write
- `buildSessionContext(messages)` : construit l'analyse du contexte de session, distinguant System/User/Assistant/Tools
- `formatContextAnalysis(analysis)` : formate la sortie de l'analyse du contexte

**Types clés** :
- `TokenCounts` : structure de comptage des tokens, incluant input/output/reasoning/cache

**Explication du mécanisme de cache** (extrait du README) :
- Anthropic et OpenAI mettent en cache les prompts basés sur la correspondance exacte des préfixes
- L'élagage DCP modifie le contenu des messages, provoquant l'invalidation du cache
- Avec DCP activé, le taux de succès du cache est d'environ 65%, sans DCP environ 85%
- Cas d'usage optimal : les fournisseurs facturant par requête (GitHub Copilot, Google Antigravity) n'ont aucun impact négatif

</details>
