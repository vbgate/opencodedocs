---
title: "Persistance d'état : Conserver l'historique entre les sessions | opencode-dynamic-context-pruning"
subtitle: "Persistance d'état : Conserver l'historique entre les sessions"
sidebarTitle: "Données préservées après redémarrage"
description: "Découvrez le mécanisme de persistance d'état de opencode-dynamic-context-pruning. Conservez l'historique d'élagage entre les sessions et consultez les économies de tokens cumulées via /dcp stats."
tags:
  - "advanced"
  - "state-management"
  - "persistence"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 2
---

# Persistance d'état : Conserver l'historique d'élagage entre les sessions

## Ce que vous apprendrez

- Comprendre comment DCP conserve l'état d'élagage après un redémarrage d'OpenCode
- Connaître l'emplacement et le format des fichiers de persistance
- Maîtriser la logique de gestion d'état lors des changements de session et de la compression de contexte
- Consulter les économies de tokens cumulées de toutes les sessions via `/dcp stats`

## Votre problème actuel

Vous avez fermé OpenCode, et en le rouvrant, vous constatez que vos enregistrements d'élagage ont disparu ? Ou vous vous demandez d'où viennent les « économies cumulées de toutes les sessions » dans `/dcp stats` ?

Le mécanisme de persistance d'état de DCP sauvegarde automatiquement votre historique d'élagage et vos statistiques en arrière-plan, garantissant leur disponibilité après un redémarrage.

## Quand utiliser cette fonctionnalité

- Pour cumuler les statistiques d'économie de tokens entre les sessions
- Pour continuer l'historique d'élagage après un redémarrage d'OpenCode
- Pour une utilisation à long terme de DCP afin de visualiser l'effet global

## Concept clé

**Qu'est-ce que la persistance d'état ?**

La **persistance d'état** signifie que DCP sauvegarde l'historique d'élagage et les statistiques sur le disque, garantissant que ces informations ne sont pas perdues après un redémarrage d'OpenCode ou un changement de session.

::: info Pourquoi la persistance est-elle nécessaire ?

Sans persistance, à chaque fermeture d'OpenCode :
- La liste des ID d'outils élagués serait perdue
- Les statistiques d'économie de tokens seraient remises à zéro
- L'IA pourrait élaguer le même outil plusieurs fois

Avec la persistance, DCP peut :
- Se souvenir des outils déjà élagués
- Cumuler les économies de tokens de toutes les sessions
- Reprendre le travail précédent après un redémarrage
:::

**Les deux composantes de la persistance**

L'état sauvegardé par DCP contient deux types d'informations :

| Type | Contenu | Utilité |
| --- | --- | --- |
| **État d'élagage** | Liste des ID d'outils élagués | Éviter les élaguages répétés, suivi inter-sessions |
| **Statistiques** | Nombre de tokens économisés (session actuelle + historique cumulé) | Afficher l'efficacité de DCP, analyse des tendances à long terme |

Ces données sont stockées séparément par ID de session OpenCode, chaque session correspondant à un fichier JSON.

## Flux de données

```mermaid
graph TD
    subgraph "Opérations d'élagage"
        A1[L'IA appelle discard/extract]
        A2[L'utilisateur exécute /dcp sweep]
    end

    subgraph "État en mémoire"
        B1[SessionState.prune.toolIds]
        B2[SessionState.stats]
    end

    subgraph "Stockage persistant"
        C1[~/.local/share/opencode/storage/plugin/dcp/]
        C2[{sessionId}.json]
    end

    A1 --> B1
    A2 --> B1
    B1 -->|Sauvegarde asynchrone| C1
    B2 -->|Sauvegarde asynchrone| C1
    C1 --> C2

    C2 -->|Chargement au changement de session| B1
    C2 -->|Chargement au changement de session| B2

    D[Message summary d'OpenCode] -->|Vider le cache| B1
```

## Suivez le guide

### Étape 1 : Comprendre l'emplacement de stockage

**Pourquoi**
Savoir où les données sont stockées permet de les vérifier ou de les supprimer manuellement si nécessaire

DCP sauvegarde l'état dans le système de fichiers local, sans téléchargement vers le cloud.

```bash
# Emplacement du répertoire de persistance
~/.local/share/opencode/storage/plugin/dcp/

# Un fichier JSON par session, format : {sessionId}.json
```

**Ce que vous devriez voir** : Le répertoire peut contenir plusieurs fichiers `.json`, chacun correspondant à une session OpenCode

::: tip Confidentialité des données

DCP ne sauvegarde localement que l'état d'élagage et les statistiques, sans aucune information sensible. Les fichiers de persistance contiennent :
- La liste des ID d'outils (identifiants numériques)
- Le nombre de tokens économisés (statistiques)
- L'heure de dernière mise à jour (horodatage)

Ils ne contiennent pas le contenu des conversations, les sorties d'outils ou les entrées utilisateur.
:::

### Étape 2 : Examiner le format des fichiers de persistance

**Pourquoi**
Comprendre la structure des fichiers permet de les vérifier manuellement ou de déboguer les problèmes

```bash
# Lister tous les fichiers de persistance
ls -la ~/.local/share/opencode/storage/plugin/dcp/

# Afficher le contenu de persistance d'une session
cat ~/.local/share/opencode/storage/plugin/dcp/{sessionId}.json
```

**Ce que vous devriez voir** : Une structure JSON similaire à celle-ci

```json
{
  "sessionName": "Nom de ma session",
  "prune": {
    "toolIds": ["12345", "12346", "12347"]
  },
  "stats": {
    "pruneTokenCounter": 0,
    "totalPruneTokens": 15420
  },
  "lastUpdated": "2026-01-23T10:30:45.123Z"
}
```

**Description des champs** :

| Champ | Type | Signification |
| --- | --- | --- |
| `sessionName` | string (optionnel) | Nom de la session, pour faciliter l'identification |
| `prune.toolIds` | string[] | Liste des ID d'outils élagués |
| `stats.pruneTokenCounter` | number | Tokens économisés dans la session actuelle (non archivés) |
| `stats.totalPruneTokens` | number | Tokens économisés cumulés historiquement |
| `lastUpdated` | string | Heure de dernière mise à jour au format ISO 8601 |

### Étape 3 : Consulter les statistiques cumulées

**Pourquoi**
Comprendre l'effet cumulé de toutes les sessions pour évaluer la valeur à long terme de DCP

```bash
# Exécuter dans OpenCode
/dcp stats
```

**Ce que vous devriez voir** : Le panneau de statistiques

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.4K
  Tools pruned:   3

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~154.2K
  Tools pruned:   47
  Sessions:       12
```

**Signification des statistiques** :

| Statistique | Source | Description |
| --- | --- | --- |
| **Session** | État en mémoire actuel | Effet d'élagage de la session actuelle |
| **All-time** | Tous les fichiers de persistance | Effet cumulé de toutes les sessions historiques |

::: info Comment les statistiques All-time sont-elles calculées ?

DCP parcourt tous les fichiers JSON dans le répertoire `~/.local/share/opencode/storage/plugin/dcp/` et additionne :
- `totalPruneTokens` : Total des tokens économisés dans toutes les sessions
- `toolIds.length` : Nombre total d'outils élagués dans toutes les sessions
- Nombre de fichiers : Nombre total de sessions

Cela vous permet de voir l'effet global de DCP sur une utilisation à long terme.
:::

### Étape 4 : Comprendre le mécanisme de sauvegarde automatique

**Pourquoi**
Savoir quand DCP sauvegarde l'état pour éviter les pertes de données accidentelles

DCP sauvegarde automatiquement l'état sur le disque aux moments suivants :

| Déclencheur | Contenu sauvegardé | Emplacement dans le code |
| --- | --- | --- |
| Après l'appel de l'outil `discard`/`extract` par l'IA | État d'élagage + statistiques mis à jour | `lib/strategies/tools.ts:148-150` |
| Après l'exécution de la commande `/dcp sweep` par l'utilisateur | État d'élagage + statistiques mis à jour | `lib/commands/sweep.ts:234-236` |
| Après une opération d'élagage | Sauvegarde asynchrone, ne bloque pas le flux principal | `saveSessionState()` |

**Processus de sauvegarde** :

```typescript
// 1. Mettre à jour l'état en mémoire
state.stats.totalPruneTokens += state.stats.pruneTokenCounter
state.stats.pruneTokenCounter = 0

// 2. Sauvegarder de manière asynchrone sur le disque
await saveSessionState(state, logger)
```

::: tip Avantages de la sauvegarde asynchrone

DCP utilise un mécanisme de sauvegarde asynchrone pour garantir que les opérations d'élagage ne sont pas bloquées par les E/S disque. Même en cas d'échec de sauvegarde (par exemple, espace disque insuffisant), cela n'affecte pas l'effet d'élagage de la session actuelle.

En cas d'échec, un avertissement est enregistré dans `~/.config/opencode/logs/dcp/`.
:::

### Étape 5 : Comprendre le mécanisme de chargement automatique

**Pourquoi**
Savoir quand DCP charge l'état persisté pour comprendre le comportement lors des changements de session

DCP charge automatiquement l'état persisté aux moments suivants :

| Déclencheur | Contenu chargé | Emplacement dans le code |
| --- | --- | --- |
| Au démarrage d'OpenCode ou lors d'un changement de session | Historique d'élagage + statistiques de cette session | `lib/state/state.ts:104` (dans la fonction `ensureSessionInitialized`) |

**Processus de chargement** :

```typescript
// 1. Détecter le changement d'ID de session
if (state.sessionId !== lastSessionId) {
    await ensureSessionInitialized(client, state, lastSessionId, logger, messages)
}

// 2. Réinitialiser l'état en mémoire
resetSessionState(state)
state.sessionId = lastSessionId

// 3. Charger l'état persisté depuis le disque
const persisted = await loadSessionState(sessionId, logger)
if (persisted) {
    state.prune = { toolIds: persisted.prune.toolIds }
    state.stats = {
        pruneTokenCounter: persisted.stats.pruneTokenCounter,
        totalPruneTokens: persisted.stats.totalPruneTokens
    }
}
```

**Ce que vous devriez voir** : Après être revenu à une session précédente, les statistiques historiques affichées par `/dcp stats` restent inchangées

### Étape 6 : Comprendre le nettoyage d'état lors de la compression de contexte

**Pourquoi**
Comprendre comment DCP gère l'état lorsqu'OpenCode compresse automatiquement le contexte

Lorsqu'OpenCode détecte que la conversation est trop longue, il génère automatiquement un message summary pour compresser le contexte. DCP détecte cette compression et nettoie l'état correspondant.

```typescript
// Traitement lors de la détection d'un message summary
if (lastCompactionTimestamp > state.lastCompaction) {
    state.lastCompaction = lastCompactionTimestamp
    state.toolParameters.clear()  // Vider le cache des outils
    state.prune.toolIds = []       // Vider l'état d'élagage
    logger.info("Detected compaction from messages - cleared tool cache")
}
```

::: info Pourquoi vider l'état ?

Le message summary d'OpenCode compresse tout l'historique de la conversation. À ce moment :
- Les anciens appels d'outils ont été fusionnés dans le summary
- Conserver la liste des ID d'outils n'a plus de sens (les outils n'existent plus)
- Vider l'état évite de référencer des ID d'outils invalides

C'est un compromis de conception : sacrifier une partie de l'historique d'élagage pour garantir la cohérence de l'état.
:::

## Points de contrôle ✅

Confirmez que vous avez compris les points suivants :

- [ ] Les fichiers de persistance de DCP sont stockés dans `~/.local/share/opencode/storage/plugin/dcp/`
- [ ] Chaque session correspond à un fichier `{sessionId}.json`
- [ ] Le contenu persisté inclut l'état d'élagage (toolIds) et les statistiques (totalPruneTokens)
- [ ] Les statistiques « All-time » de `/dcp stats` proviennent de l'addition de tous les fichiers de persistance
- [ ] La sauvegarde asynchrone après les opérations d'élagage ne bloque pas le flux principal
- [ ] L'état historique de la session est automatiquement chargé lors d'un changement de session
- [ ] Le cache des outils et l'état d'élagage sont vidés lors de la détection d'un message summary d'OpenCode

## Pièges à éviter

### ❌ Suppression accidentelle des fichiers de persistance

**Problème** : Vous avez supprimé manuellement les fichiers dans le répertoire `~/.local/share/opencode/storage/plugin/dcp/`

**Conséquences** :
- L'historique d'élagage est perdu
- Les statistiques cumulées sont remises à zéro
- Mais cela n'affecte pas la fonctionnalité d'élagage de la session actuelle

**Solution** : Recommencez à utiliser DCP, il créera automatiquement de nouveaux fichiers de persistance

### ❌ État des sous-agents invisible

**Problème** : Vous avez élagué des outils dans un sous-agent, mais en revenant à l'agent principal, vous ne voyez pas ces enregistrements d'élagage

**Cause** : Les sous-agents ont un `sessionId` indépendant, et l'état d'élagage est persisté dans un fichier séparé. Lors du retour à l'agent principal, comme le `sessionId` est différent, l'état persisté du sous-agent n'est pas chargé

**Solution** : C'est un comportement intentionnel. L'état de la session du sous-agent est indépendant et n'est pas partagé avec l'agent principal. Si vous souhaitez voir toutes les statistiques d'élagage (y compris les sous-agents), utilisez les statistiques « All-time » de `/dcp stats` (qui additionne les données de tous les fichiers de persistance)

### ❌ Échec de sauvegarde dû à un espace disque insuffisant

**Problème** : Les statistiques « All-time » de `/dcp stats` n'augmentent pas

**Cause** : L'espace disque est peut-être insuffisant, causant l'échec de la sauvegarde

**Solution** : Vérifiez les fichiers de log `~/.config/opencode/logs/dcp/` pour voir s'il y a une erreur « Failed to save session state »

## Résumé de la leçon

**Valeur fondamentale de la persistance d'état** :

1. **Mémoire inter-sessions** : Se souvenir des outils déjà élagués pour éviter le travail en double
2. **Statistiques cumulées** : Suivre à long terme les économies de tokens de DCP
3. **Récupération après redémarrage** : Reprendre le travail précédent après un redémarrage d'OpenCode

**Résumé du flux de données** :

```
Opération d'élagage → Mise à jour de l'état en mémoire → Sauvegarde asynchrone sur disque
                ↑
Changement de session → Chargement depuis le disque → Restauration de l'état en mémoire
                ↑
Compression de contexte → Vidage de l'état en mémoire (sans supprimer les fichiers sur disque)
```

**Points clés** :

- La persistance est une opération de fichier local qui n'affecte pas les performances d'élagage
- Les statistiques « All-time » de `/dcp stats` proviennent de l'addition de toutes les sessions historiques
- Les sessions de sous-agents ne sont pas persistées, c'est un comportement intentionnel
- Le cache est vidé lors de la compression de contexte pour garantir la cohérence de l'état

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons **[Impact sur le cache de prompts](/fr/Opencode-DCP/opencode-dynamic-context-pruning/advanced/prompt-caching/)**.
>
> Vous apprendrez :
> - Comment l'élagage DCP affecte le Prompt Caching
> - Comment équilibrer le taux de succès du cache et les économies de tokens
> - Comprendre le mécanisme de facturation du cache d'Anthropic

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements dans le code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition de l'interface de persistance | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 14-19 |
| Sauvegarde de l'état de session | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 33-66 |
| Chargement de l'état de session | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 68-101 |
| Chargement des statistiques de toutes les sessions | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 109-146 |
| Constante du répertoire de stockage | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 21 |
| Initialisation de l'état de session | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| Détection de la compression de contexte | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 118-126 |
| Traitement de la commande de statistiques | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| Sauvegarde de l'état par l'outil d'élagage | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts) | 144-150 |

**Constantes clés** :
- `STORAGE_DIR = ~/.local/share/opencode/storage/plugin/dcp` : Répertoire racine de stockage des fichiers de persistance

**Fonctions clés** :
- `saveSessionState(state, logger)` : Sauvegarde asynchrone de l'état de session sur le disque
- `loadSessionState(sessionId, logger)` : Charge l'état d'une session spécifique depuis le disque
- `loadAllSessionStats(logger)` : Agrège les statistiques de toutes les sessions
- `ensureSessionInitialized(client, state, sessionId, logger, messages)` : S'assure que la session est initialisée, charge l'état persisté

**Interfaces clés** :
- `PersistedSessionState` : Définition de la structure de l'état persisté
- `AggregatedStats` : Définition de la structure des statistiques cumulées

</details>
