---
title: "Référence API : Documentation des Interfaces du Plugin | opencode-dynamic-context-pruning"
sidebarTitle: "Référence API du Plugin"
subtitle: "Référence API DCP"
description: "Apprenez la documentation complète de l'API du plugin OpenCode DCP, incluant la fonction d'entrée du plugin, les interfaces de configuration, les définitions d'outils, les gestionnaires de hooks et les interfaces de gestion d'état de session."
tags:
  - "API"
  - "Développement de Plugin"
  - "Référence des Interfaces"
prerequisite:
  - "start-configuration"
order: 3
---

# Référence API DCP

## Ce Que Vous Allez Apprendre

Cette section fournit aux développeurs de plugins la référence API complète de DCP, vous permettant de :

- Comprendre le point d'entrée du plugin DCP et le mécanisme de hooks
- Maîtriser les interfaces de configuration et le rôle de chaque option
- Connaître les spécifications des outils discard et extract
- Utiliser l'API de gestion d'état pour les opérations sur l'état de session

## Concepts Fondamentaux

Le plugin DCP est basé sur le SDK OpenCode Plugin et implémente la fonctionnalité d'élagage de contexte en enregistrant des hooks, des outils et des commandes.

**Cycle de Vie du Plugin** :

```
1. OpenCode charge le plugin
    ↓
2. La fonction Plugin s'exécute
    ↓
3. Enregistrement des hooks, outils, commandes
    ↓
4. OpenCode appelle les hooks pour traiter les messages
    ↓
5. Le plugin exécute la logique d'élagage
    ↓
6. Retourne les messages modifiés
```

---

## API du Point d'Entrée du Plugin

### Fonction Plugin

La fonction d'entrée principale de DCP, retourne l'objet de configuration du plugin.

**Signature** :

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // Logique d'initialisation du plugin
    return {
        // Hooks, outils, commandes enregistrés
    }) satisfies Plugin

export default plugin
```

**Paramètres** :

| Paramètre | Type | Description |
| --- | --- | --- |
| ctx | `PluginInput` | Contexte du plugin OpenCode, contient client et directory entre autres |

**Valeur de Retour** :

Objet de configuration du plugin, contenant les champs suivants :

| Champ | Type | Description |
| --- | --- | --- |
| `experimental.chat.system.transform` | `Handler` | Hook d'injection du prompt système |
| `experimental.chat.messages.transform` | `Handler` | Hook de transformation des messages |
| `chat.message` | `Handler` | Hook de capture des messages |
| `command.execute.before` | `Handler` | Hook d'exécution des commandes |
| `tool` | `Record<string, Tool>` | Mapping des outils enregistrés |
| `config` | `ConfigHandler` | Hook de mutation de configuration |

**Emplacement dans le Code Source** : [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## API de Configuration

### Interface PluginConfig

Définition complète du type de configuration DCP.

```typescript
export interface PluginConfig {
    enabled: boolean
    debug: boolean
    pruneNotification: "off" | "minimal" | "detailed"
    commands: Commands
    turnProtection: TurnProtection
    protectedFilePatterns: string[]
    tools: Tools
    strategies: {
        deduplication: Deduplication
        supersedeWrites: SupersedeWrites
        purgeErrors: PurgeErrors
    }
}
```

**Emplacement dans le Code Source** : [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### Détail des Options de Configuration

#### Configuration de Premier Niveau

| Option | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Active ou désactive le plugin |
| `debug` | `boolean` | `false` | Active les logs de débogage, écrits dans `~/.config/opencode/logs/dcp/` |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | Mode d'affichage des notifications |
| `protectedFilePatterns` | `string[]` | `[]` | Liste de patterns glob pour la protection des fichiers, les fichiers correspondants ne seront pas élagués |

#### Configuration Commands

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| Champ | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Active ou désactive la commande `/dcp` |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Liste des outils protégés par les commandes, ces outils ne seront pas élagués par `/dcp sweep` |

#### Configuration TurnProtection

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| Champ | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Active ou désactive la protection par tour |
| `turns` | `number` | `4` | Nombre de tours protégés, les outils des N derniers tours ne seront pas élagués |

#### Configuration Tools

```typescript
export interface Tools {
    settings: ToolSettings
    discard: DiscardTool
    extract: ExtractTool
}
```

**ToolSettings** :

```typescript
export interface ToolSettings {
    nudgeEnabled: boolean
    nudgeFrequency: number
    protectedTools: string[]
}
```

| Champ | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `nudgeEnabled` | `boolean` | `true` | Active ou désactive les rappels à l'IA |
| `nudgeFrequency` | `number` | `10` | Fréquence des rappels, rappelle l'IA d'utiliser les outils d'élagage tous les N résultats d'outils |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Liste des outils protégés |

**DiscardTool** :

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| Champ | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Active ou désactive l'outil discard |

**ExtractTool** :

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| Champ | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Active ou désactive l'outil extract |
| `showDistillation` | `boolean` | `false` | Affiche ou non le contenu extrait dans les notifications |

#### Configuration Strategies

**Deduplication** :

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| Champ | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Active ou désactive la stratégie de déduplication |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Liste des outils exclus de la déduplication |

**SupersedeWrites** :

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| Champ | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Active ou désactive la stratégie d'écrasement des écritures |

**PurgeErrors** :

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| Champ | Type | Valeur par Défaut | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Active ou désactive la stratégie de purge des erreurs |
| `turns` | `number` | `4` | Seuil de purge des erreurs (en nombre de tours) |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Liste des outils exclus de la purge |

### Fonction getConfig

Charge et fusionne les configurations multi-niveaux.

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**Paramètres** :

| Paramètre | Type | Description |
| --- | --- | --- |
| ctx | `PluginInput` | Contexte du plugin OpenCode |

**Valeur de Retour** :

Objet de configuration fusionné, par ordre de priorité décroissante :

1. Configuration projet (`.opencode/dcp.jsonc`)
2. Configuration variable d'environnement (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. Configuration globale (`~/.config/opencode/dcp.jsonc`)
4. Configuration par défaut (définie dans le code)

**Emplacement dans le Code Source** : [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## API des Outils

### createDiscardTool

Crée l'outil discard, utilisé pour supprimer les tâches terminées ou les sorties d'outils bruyantes.

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Paramètres** :

| Paramètre | Type | Description |
| --- | --- | --- |
| ctx | `PruneToolContext` | Contexte de l'outil, contient client, state, logger, config, workingDirectory |

**Spécification de l'Outil** :

| Champ | Type | Description |
| --- | --- | --- |
| `ids` | `string[]` | Le premier élément est la raison (`'completion'` ou `'noise'`), les suivants sont des IDs numériques |

**Emplacement dans le Code Source** : [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

Crée l'outil extract, utilisé pour extraire les découvertes clés puis supprimer les sorties d'outils originales.

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Paramètres** :

| Paramètre | Type | Description |
| --- | --- | --- |
| ctx | `PruneToolContext` | Contexte de l'outil, contient client, state, logger, config, workingDirectory |

**Spécification de l'Outil** :

| Champ | Type | Description |
| --- | --- | --- |
| `ids` | `string[]` | Tableau d'IDs numériques |
| `distillation` | `string[]` | Tableau de contenus extraits, de même longueur que ids |

**Emplacement dans le Code Source** : [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## API d'État

### Interface SessionState

Objet d'état de session, gère l'état d'exécution d'une session unique.

```typescript
export interface SessionState {
    sessionId: string | null
    isSubAgent: boolean
    prune: Prune
    stats: SessionStats
    toolParameters: Map<string, ToolParameterEntry>
    nudgeCounter: number
    lastToolPrune: boolean
    lastCompaction: number
    currentTurn: number
    variant: string | undefined
}
```

**Description des Champs** :

| Champ | Type | Description |
| --- | --- | --- |
| `sessionId` | `string \| null` | ID de session OpenCode |
| `isSubAgent` | `boolean` | Indique si c'est une session de sous-agent |
| `prune` | `Prune` | État d'élagage |
| `stats` | `SessionStats` | Données statistiques |
| `toolParameters` | `Map<string, ToolParameterEntry>` | Cache des appels d'outils (callID → métadonnées) |
| `nudgeCounter` | `number` | Compteur cumulé d'appels d'outils (pour déclencher les rappels) |
| `lastToolPrune` | `boolean` | Indique si la dernière opération était un outil d'élagage |
| `lastCompaction` | `number` | Horodatage de la dernière compression de contexte |
| `currentTurn` | `number` | Numéro du tour actuel |
| `variant` | `string \| undefined` | Variante du modèle (ex : claude-3.5-sonnet) |

**Emplacement dans le Code Source** : [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### Interface SessionStats

Statistiques d'élagage de tokens au niveau de la session.

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**Description des Champs** :

| Champ | Type | Description |
| --- | --- | --- |
| `pruneTokenCounter` | `number` | Nombre de tokens élagués dans la session actuelle (cumulé) |
| `totalPruneTokens` | `number` | Nombre total historique de tokens élagués |

**Emplacement dans le Code Source** : [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Interface Prune

Objet d'état d'élagage.

```typescript
export interface Prune {
    toolIds: string[]
}
```

**Description des Champs** :

| Champ | Type | Description |
| --- | --- | --- |
| `toolIds` | `string[]` | Liste des IDs d'appels d'outils marqués pour élagage |

**Emplacement dans le Code Source** : [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### Interface ToolParameterEntry

Cache de métadonnées pour un appel d'outil unique.

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**Description des Champs** :

| Champ | Type | Description |
| --- | --- | --- |
| `tool` | `string` | Nom de l'outil |
| `parameters` | `any` | Paramètres de l'outil |
| `status` | `ToolStatus \| undefined` | État d'exécution de l'outil |
| `error` | `string \| undefined` | Message d'erreur (le cas échéant) |
| `turn` | `number` | Numéro du tour où cet appel a été créé |

**Énumération ToolStatus** :

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**Emplacement dans le Code Source** : [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

Crée un nouvel objet d'état de session.

```typescript
export function createSessionState(): SessionState
```

**Valeur de Retour** : Objet SessionState initialisé

---

## API des Hooks

### createSystemPromptHandler

Crée le gestionnaire de hook d'injection du prompt système.

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Paramètres** :

| Paramètre | Type | Description |
| --- | --- | --- |
| state | `SessionState` | Objet d'état de session |
| logger | `Logger` | Instance du système de logs |
| config | `PluginConfig` | Objet de configuration |

**Comportement** :

- Vérifie si c'est une session de sous-agent, si oui, ignore
- Vérifie si c'est un agent interne (comme le générateur de résumés), si oui, ignore
- Charge le template de prompt correspondant selon la configuration (both/discard/extract)
- Injecte les instructions des outils d'élagage dans le prompt système

**Emplacement dans le Code Source** : [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

Crée le gestionnaire de hook de transformation des messages, exécute la logique d'élagage automatique.

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Paramètres** :

| Paramètre | Type | Description |
| --- | --- | --- |
| client | `any` | Instance du client OpenCode |
| state | `SessionState` | Objet d'état de session |
| logger | `Logger` | Instance du système de logs |
| config | `PluginConfig` | Objet de configuration |

**Flux de Traitement** :

1. Vérifie l'état de la session (est-ce un sous-agent)
2. Synchronise le cache des outils
3. Exécute les stratégies automatiques (déduplication, écrasement des écritures, purge des erreurs)
4. Élague le contenu des outils marqués
5. Injecte la liste `<prunable-tools>`
6. Sauvegarde un snapshot du contexte (si configuré)

**Emplacement dans le Code Source** : [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

Crée le gestionnaire de hook d'exécution des commandes, traite les commandes de la série `/dcp`.

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**Paramètres** :

| Paramètre | Type | Description |
| --- | --- | --- |
| client | `any` | Instance du client OpenCode |
| state | `SessionState` | Objet d'état de session |
| logger | `Logger` | Instance du système de logs |
| config | `PluginConfig` | Objet de configuration |
| workingDirectory | `string` | Chemin du répertoire de travail |

**Commandes Supportées** :

- `/dcp` - Affiche l'aide
- `/dcp context` - Affiche l'analyse d'utilisation des tokens de la session actuelle
- `/dcp stats` - Affiche les statistiques cumulées d'élagage
- `/dcp sweep [n]` - Élague manuellement les outils (optionnellement spécifier le nombre)

**Emplacement dans le Code Source** : [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## Résumé de Cette Leçon

Cette section a fourni la référence API complète du plugin DCP, couvrant :

- La fonction d'entrée du plugin et le mécanisme d'enregistrement des hooks
- Les interfaces de configuration et la description détaillée de toutes les options
- Les spécifications et méthodes de création des outils discard et extract
- Les définitions de types pour l'état de session, les statistiques et le cache des outils
- Les gestionnaires de hooks pour le prompt système, la transformation des messages et l'exécution des commandes

Si vous souhaitez approfondir les détails d'implémentation interne de DCP, nous vous recommandons de lire [Vue d'Ensemble de l'Architecture](/fr/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/) et [Principes du Calcul des Tokens](/fr/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/).

---

## Annexe : Références du Code Source

<details>
<summary><strong>Cliquez pour Développer et Voir les Emplacements du Code Source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du Fichier | Lignes |
| --- | --- | --- |
| Fonction d'entrée du plugin | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102) | 12-102 |
| Définition des interfaces de configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66 |
| Fonction getConfig | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| Création de l'outil discard | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181 |
| Création de l'outil extract | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Définition des types d'état | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39 |
| Hook du prompt système | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53 |
| Hook de transformation des messages | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82) | 55-82 |
| Hook d'exécution des commandes | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156 |

**Types Clés** :
- `Plugin` : Signature de la fonction du plugin OpenCode
- `PluginConfig` : Interface de configuration DCP
- `SessionState` : Interface d'état de session
- `ToolStatus` : Énumération des états d'outil (pending | running | completed | error)

**Fonctions Clés** :
- `plugin()` : Fonction d'entrée du plugin
- `getConfig()` : Charge et fusionne la configuration
- `createDiscardTool()` : Crée l'outil discard
- `createExtractTool()` : Crée l'outil extract
- `createSessionState()` : Crée l'état de session

</details>
