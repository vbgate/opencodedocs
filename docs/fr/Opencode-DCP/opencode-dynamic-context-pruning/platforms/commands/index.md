---
title: "Commandes : Surveillance et Taillage | opencode-dynamic-context-pruning"
sidebarTitle: "Surveillance des Tokens, Taillage Manuel"
subtitle: "Guide d'utilisation des commandes DCP : Surveillance et taillage manuel"
description: "Apprenez à utiliser les 4 commandes DCP pour surveiller et tailler manuellement. Découvrez /dcp context pour voir les sessions, /dcp stats pour les statistiques, /dcp sweep pour le taillage manuel."
tags:
  - "Commandes DCP"
  - "Surveillance des Tokens"
  - "Taillage Manuel"
prerequisite:
  - "../../start/getting-started/"
  - "../auto-pruning/"
order: 3
---

# Guide d'utilisation des commandes DCP : Surveillance et taillage manuel

## Ce que vous pourrez faire après ce cours

- Utiliser `/dcp context` pour voir la distribution de l'utilisation des tokens dans la session actuelle
- Utiliser `/dcp stats` pour voir les statistiques cumulées de taillage
- Utiliser `/dcp sweep [n]` pour déclencher manuellement le taillage
- Comprendre les mécanismes de protection des outils et des fichiers
- Découvrir les stratégies de calcul des tokens et les économies réalisées

## Votre problème actuel

Dans les longues conversations, la consommation de tokens augmente rapidement, mais vous ne savez pas :
- Où sont dépensés les tokens de la session actuelle ?
- Combien DCP vous a réellement permis d'économiser ?
- Comment nettoyer manuellement les sorties d'outils dont vous n'avez plus besoin ?
- Quels outils sont protégés et ne seront pas taillés ?

Sans clarifier ces questions, vous ne pourrez pas tirer pleinement parti des effets d'optimisation de DCP, et vous risquez même de supprimer par erreur des informations importantes à des moments critiques.

## Quand utiliser cette technique

Lorsque vous :
- Voulez comprendre la composition des tokens de la session actuelle
- Avez besoin de nettoyer rapidement l'historique des conversations
- Voulez vérifier l'efficacité du taillage de DCP
- Préparez une nouvelle tâche et souhaitez nettoyer le contexte

## Idée principale

DCP fournit 4 commandes Slash pour vous aider à surveiller et contrôler l'utilisation des tokens :

| Commande | Utilisation | Scenarios |
|--- | --- | ---|
| `/dcp` | Afficher l'aide | Consulter quand vous oubliez les commandes |
| `/dcp context` | Analyser la distribution des tokens de la session actuelle | Comprendre la composition du contexte |
| `/dcp stats` | Voir les statistiques cumulées de taillage | Vérifier les effets à long terme |
| `/dcp sweep [n]` | Tailler manuellement les outils | Réduire rapidement la taille du contexte |

**Mécanisme de protection** :

Toutes les opérations de taillage ignorent automatiquement :
- **Outils protégés** : `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- **Fichiers protégés** : Chemins de fichiers correspondant aux `protectedFilePatterns` de la configuration

::: info
Les paramètres des outils protégés et des fichiers protégés peuvent être personnalisés via le fichier de configuration. Voir [Configuration complète](../../start/configuration/) pour plus de détails.
:::

## Suivez-moi

### Étape 1 : Voir les informations d'aide

Tapez `/dcp` dans la boîte de dialogue OpenCode.

**Ce que vous devriez voir** :

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

**Point de contrôle ✅** : Confirmez que vous voyez les descriptions des 3 sous-commandes.

### Étape 2 : Analyser la distribution des tokens de la session actuelle

Tapez `/dcp context` pour voir l'utilisation des tokens de la session actuelle.

**Ce que vous devriez voir** :

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
───────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

───────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Explication des catégories de tokens** :

| Catégorie | Méthode de calcul | Description |
|--- | --- | ---|
| **System** | `firstAssistant.input + cache.read - tokenizer(firstUserMessage)` | Invite système |
| **Tools** | `tokenizer(toolInputs + toolOutputs) - prunedTokens` | Appels d'outils (taillage déduit) |
| **User** | `tokenizer(all user messages)` | Tous les messages utilisateur |
| **Assistant** | `total - system - user - tools` | Sortie de texte IA + tokens de raisonnement |

**Point de contrôle ✅** : Confirmez que vous voyez le pourcentage et le nombre de tokens pour chaque catégorie.

### Étape 3 : Voir les statistiques cumulées de taillage

Tapez `/dcp stats` pour voir l'historique cumulé des effets de taillage.

**Ce que vous devriez voir** :

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
───────────────────────────────────────────────────────────
  Tokens pruned: ~15.2K
  Tools pruned:   12

All-time:
───────────────────────────────────────────────────────────
  Tokens saved:  ~284.5K
  Tools pruned:   156
  Sessions:       8
```

**Explication des statistiques** :
- **Session** : Données de taillage de la session actuelle (en mémoire)
- **All-time** : Données cumulées de toutes les sessions historiques (persistées sur disque)

**Point de contrôle ✅** : Confirmez que vous voyez les statistiques de taillage de la session actuelle et cumulées.

### Étape 4 : Tailler manuellement les outils

Il existe deux façons d'utiliser `/dcp sweep` :

#### Méthode 1 : Tailler tous les outils après le dernier message utilisateur

Tapez `/dcp sweep` (sans paramètre).

**Ce que vous devriez voir** :

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept 8 tool(s) since previous user message.
Tokens saved: ~12,345

  • Read: src/config.ts
  • Read: src/utils.ts
  • Bash: npm test
  • Read: package.json
  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
```

#### Méthode 2 : Tailler les N derniers outils

Tapez `/dcp sweep 5` pour tailler les 5 derniers outils.

**Ce que vous devriez voir** :

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept last 5 tool(s).
Tokens saved: ~7,892

  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
  • Bash: npm run build
```

**Indication d'outils protégés** :

Si des outils protégés sont ignorés, la sortie affichera :

```
Swept 5 tool(s).
Tokens saved: ~7,892
(2 protected tool(s) skipped)
```

::: warning
Les outils protégés (comme `write`, `edit`) et les chemins de fichiers protégés sont automatiquement ignorés et ne seront pas taillés.
:::

**Point de contrôle ✅** : Confirmez que vous voyez la liste des outils taillés et le nombre de tokens économisés.

### Étape 5 : Voir à nouveau les effets du taillage

Après le taillage, tapez à nouveau `/dcp context` pour voir la nouvelle distribution des tokens.

**Ce que vous devriez voir** :
- Le pourcentage de la catégorie `Tools` a diminué
- Le nombre d'outils taillés affiché dans `Summary` a augmenté
- Le total `Current context` a diminué

**Point de contrôle ✅** : Confirmez que l'utilisation des tokens a diminué de manière significative.

## Points à surveiller

### ❌ Erreur : Supprimer par erreur des outils importants

**Scénario** : Vous venez d'écrire un fichier clé avec l'outil `write`, puis vous exécutez `/dcp sweep`.

**Résultat erroné** : L'outil `write` est taillé, et l'IA peut ne pas savoir que le fichier a été créé.

**Bonne pratique** :
- Les outils comme `write`, `edit` sont protégés par défaut
- Ne modifiez pas manuellement la configuration `protectedTools` pour supprimer ces outils
- Attendez quelques tours après avoir terminé des tâches critiques avant de nettoyer

### ❌ Erreur : Moment inapproprié pour le taillage

**Scénario** : La conversation vient de commencer, et vous exécutez `/dcp sweep` après seulement quelques appels d'outils.

**Résultat erroné** : Les économies de tokens sont minimes, et cela peut affecter la cohérence du contexte.

**Bonne pratique** :
- Attendez que la conversation ait suffisamment progressé (par exemple, 10+ appels d'outils) avant de nettoyer
- Nettoyez les sorties d'outils de la tour précédente avant de commencer une nouvelle tâche
- Utilisez `/dcp context` pour juger si le nettoyage en vaut la peine

### ❌ Erreur : Dépendance excessive au taillage manuel

**Scénario** : Vous exécutez manuellement `/dcp sweep` à chaque conversation.

**Résultat erroné** :
- Les stratégies de taillage automatique (déduplication, écrasement, suppression des erreurs) sont gaspillées
- Augmente la charge opérationnelle

**Bonne pratique** :
- Activez par défaut les stratégies de taillage automatique (configuration : `strategies.*.enabled`)
- Utilisez le taillage manuel comme complément, en cas de nécessité
- Vérifiez l'efficacité du taillage automatique via `/dcp stats`

## Résumé du cours

Les 4 commandes DCP vous aident à surveiller et contrôler l'utilisation des tokens :

| Commande | Fonction principale |
|--- | ---|
| `/dcp` | Afficher les informations d'aide |
| `/dcp context` | Analyser la distribution des tokens de la session actuelle |
| `/dcp stats` | Voir les statistiques cumulées de taillage |
| `/dcp sweep [n]` | Tailler manuellement les outils |

**Stratégies de calcul des tokens** :
- System : Invite système (calculée à partir de la première réponse)
- Tools : Entrées/sorties d'outils (taillage déduit)
- User : Tous les messages utilisateur (estimation)
- Assistant : Sortie IA + tokens de raisonnement (résiduel)

**Mécanisme de protection** :
- Outils protégés : `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- Fichiers protégés : Motifs glob configurés
- Toutes les opérations de taillage ignorent automatiquement ces éléments

**Meilleures pratiques** :
- Consultez régulièrement `/dcp context` pour comprendre la composition des tokens
- Exécutez `/dcp sweep` avant une nouvelle tâche pour nettoyer l'historique
- Dépendez du taillage automatique, utilisez le taillage manuel comme complément
- Vérifiez les effets à long terme via `/dcp stats`

## Aperçu du cours suivant

> Dans le cours suivant, nous apprendrons **[Mécanisme de protection](../../advanced/protection/)**.
>
> Vous apprendrez :
> - Comment la protection des tours empêche le taillage par erreur
> - Comment personnaliser la liste des outils protégés
> - Méthodes de configuration des motifs de fichiers protégés
> - Traitement spécial des sessions de sous-agents

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| /dcp help command | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 19-32 |
| /dcp context command | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 238-247 |
| Token calculation strategy | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 5-38 |
| /dcp stats command | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| /dcp sweep command | [`lib/commands/sweep.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/sweep.ts) | 123-259 |
| Protected tools configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 461 |
| Default protected tools list | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 150-151 |

**Constantes clés** :
- `DEFAULT_PROTECTED_TOOLS` : Liste par défaut des outils protégés

**Fonctions clés** :
- `handleHelpCommand()` : Traite la commande /dcp d'aide
- `handleContextCommand()` : Traite la commande /dcp context
- `analyzeTokens()` : Calcule le nombre de tokens pour chaque catégorie
- `handleStatsCommand()` : Traite la commande /dcp stats
- `handleSweepCommand()` : Traite la commande /dcp sweep
- `buildToolIdList()` : Construit la liste des identifiants d'outils

</details>
