---
title: "Gestion des sous-agents : Mécanisme de désactivation automatique | opencode-dynamic-context-pruning"
subtitle: "Gestion des sous-agents : Mécanisme de désactivation automatique"
sidebarTitle: "Les sous-agents ne sont pas élagués ? Voici pourquoi"
description: "Apprenez le comportement et les limites de DCP dans les sessions de sous-agents. Comprenez pourquoi DCP désactive automatiquement l'élagage des sous-agents et les différentes stratégies d'utilisation des tokens entre les sous-agents et l'agent principal."
tags:
  - "Sous-agent"
  - "Gestion de session"
  - "Limites d'utilisation"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 4
---

# Gestion des sous-agents

## Ce que vous apprendrez

- Comprendre pourquoi DCP se désactive automatiquement dans les sessions de sous-agents
- Connaître les différentes stratégies d'utilisation des tokens entre les sous-agents et l'agent principal
- Éviter les problèmes causés par l'utilisation des fonctions DCP dans les sous-agents

## Votre situation actuelle

Vous avez peut-être remarqué que, dans certaines conversations OpenCode, la fonction d'élagage de DCP semble "ne plus fonctionner" — les appels d'outils ne sont pas nettoyés, et les statistiques d'économie de tokens ne changent pas. Cela peut se produire lorsque vous utilisez certaines fonctionnalités spécifiques d'OpenCode, comme la révision de code ou l'analyse approfondie.

Ce n'est pas que DCP rencontre un problème, mais que ces fonctionnalités utilisent le mécanisme de **sous-agent (Subagent)**, et que DCP a un traitement spécial pour les sous-agents.

## Qu'est-ce qu'un sous-agent

::: info Qu'est-ce qu'un sous-agent (Subagent) ?

Un **sous-agent** est un mécanisme interne d'IA d'OpenCode. L'agent principal délègue des tâches complexes à un sous-agent, qui retourne les résultats sous forme de résumé une fois terminé.

**Scénarios d'utilisation typiques** :
- Révision de code : l'agent principal démarre un sous-agent, qui lit attentivement plusieurs fichiers, analyse les problèmes, puis retourne une liste concise de problèmes
- Analyse approfondie : l'agent principal démarre un sous-agent, qui effectue de nombreux appels d'outils et du raisonnement, puis retourne les découvertes clés

Du point de vue technique, une session de sous-agent a une propriété `parentID` qui pointe vers sa session parente.
:::

## Comportement de DCP avec les sous-agents

DCP **désactive automatiquement toutes les fonctions d'élagage** dans les sessions de sous-agents.

### Pourquoi DCP n'élague-t-il pas les sous-agents ?

Il y a une philosophie de conception importante derrière cela :

| Rôle | Stratégie d'utilisation des tokens | Objectif principal |
| --- | --- | --- |
| **Agent principal** | Besoin d'utiliser les tokens efficacement | Maintenir le contexte dans les longues conversations, réduire les coûts |
| **Sous-agent** | Peut utiliser les tokens librement | Générer des informations riches, faciliter la synthèse par l'agent principal |

**La valeur d'un sous-agent** réside dans sa capacité à "dépenser des tokens pour de la qualité d'information" — à travers de nombreux appels d'outils et des analyses détaillées, il fournit un résumé d'informations de haute qualité à l'agent parent. Si DCP élaguait les appels d'outils dans le sous-agent, cela pourrait entraîner :

1. **Perte d'information** : le processus d'analyse détaillée du sous-agent est supprimé, empêchant la génération d'un résumé complet
2. **Baisse de la qualité du résumé** : le résumé reçu par l'agent principal est incomplet, affectant la décision finale
3. **Contrevenir à l'intention de conception** : le sous-agent est conçu pour "ne pas hésiter à dépenser des tokens pour de la qualité"

**Conclusion** : un sous-agent n'a pas besoin d'élagage car il ne retourne finalement qu'un résumé concis à l'agent parent.

### Comment DCP détecte les sous-agents

DCP détecte si la session actuelle est un sous-agent via les étapes suivantes :

```typescript
// lib/state/utils.ts:1-8
export async function isSubAgentSession(client: any, sessionID: string): Promise<boolean> {
    try {
        const result = await client.session.get({ path: { id: sessionID } })
        return !!result.data?.parentID  // Si parentID existe, c'est un sous-agent
    } catch (error: any) {
        return false
    }
}
```

**Moment de la détection** :
- Lors de l'initialisation de la session (`ensureSessionInitialized()`)
- Avant chaque transformation de message (`createChatMessageTransformHandler()`)

### Comportement de DCP dans les sessions de sous-agents

Lorsque DCP détecte un sous-agent, il saute les fonctionnalités suivantes :

| Fonctionnalité | Session normale | Session de sous-agent | Position de saut |
| --- | --- | --- | --- |
| Injection de prompt système | ✅ Exécuté | ❌ Sauté | `hooks.ts:26-28` |
| Stratégie d'élagage automatique | ✅ Exécuté | ❌ Sauté | `hooks.ts:64-66` |
| Injection de liste d'outils | ✅ Exécuté | ❌ Sauté | `hooks.ts:64-66` |

**Implémentation du code** (`lib/hooks.ts`) :

```typescript
// Gestionnaire de prompt système
export function createSystemPromptHandler(state: SessionState, ...) {
    return async (_input: unknown, output: { system: string[] }) => {
        if (state.isSubAgent) {  // ← Détection de sous-agent
            return               // ← Retour direct, pas d'injection d'outil d'élagage
        }
        // ... logique normale
    }
}

// Gestionnaire de transformation de messages
export function createChatMessageTransformHandler(...) {
    return async (input: {}, output: { messages: WithParts[] }) => {
        await checkSession(client, state, logger, output.messages)

        if (state.isSubAgent) {  // ← Détection de sous-agent
            return               // ← Retour direct, aucun élagage exécuté
        }

        // ... logique normale : déduplication, écrasement, effacement d'erreurs, injection de liste d'outils, etc.
    }
}
```

## Comparaison de cas réels

### Cas 1 : Session d'agent principal

**Scénario** : Vous dialoguez avec l'agent principal et lui demandez d'analyser du code

**Comportement de DCP** :
```
Entrée utilisateur : "Analyser les fonctions utilitaires dans src/utils.ts"
    ↓
[Agent principal] Lit src/utils.ts
    ↓
[Agent principal] Analyse le code
    ↓
Entrée utilisateur : "Vérifier également src/helpers.ts"
    ↓
DCP détecte un modèle de lecture répété
    ↓
DCP marque la première lecture de src/utils.ts comme élagable ✅
    ↓
Lors de l'envoi du contexte au LLM, le contenu de la première lecture est remplacé par un espace réservé
    ↓
✅ Économie de tokens
```

### Cas 2 : Session de sous-agent

**Scénario** : L'agent principal démarre un sous-agent pour une révision de code approfondie

**Comportement de DCP** :
```
Entrée utilisateur : "Révision approfondie de tous les fichiers dans src/"
    ↓
[Agent principal] Détecte une tâche complexe, démarre le sous-agent
    ↓
[Sous-agent] Lit src/utils.ts
    ↓
[Sous-agent] Lit src/helpers.ts
    ↓
[Sous-agent] Lit src/config.ts
    ↓
[Sous-agent] Lit plus de fichiers...
    ↓
DCP détecte une session de sous-agent
    ↓
DCP saute toutes les opérations d'élagage ❌
    ↓
[Sous-agent] Génère des résultats de révision détaillés
    ↓
[Sous-agent] Retourne un résumé concis à l'agent principal
    ↓
[Agent principal] Génère une réponse finale basée sur le résumé
```

## FAQ

### Q : Comment confirmer que la session actuelle est un sous-agent ?

**R** : Vous pouvez confirmer de la manière suivante :

  1. **Vérifier les journaux DCP** (si le mode debug est activé) :
    ```
    2026-01-23T10:30:45.123Z INFO state: session ID = abc-123
    2026-01-23T10:30:45.124Z INFO state: isSubAgent = true
    ```

 2. **Observer les caractéristiques de la conversation** :
    - Les sous-agents sont généralement démarrés lors du traitement de tâches complexes (comme l'analyse approfondie ou la révision de code)
    - L'agent principal indiquera "Démarrage du sous-agent" ou un message similaire

 3. **Utiliser la commande /dcp stats** :
    - Dans une session de sous-agent, les appels d'outils ne seront pas élagués
    - Le nombre "élagué" dans les statistiques de tokens est de 0

### Q : Le fait de ne pas élaguer du tout dans les sous-agents ne gaspille-t-il pas des tokens ?

**R** : Non. Voici pourquoi :

 1. **Les sous-agents sont éphémères** : le sous-agent se termine après avoir terminé sa tâche, contrairement à l'agent principal qui maintient une longue conversation
 2. **Les sous-agents retournent des résumés** : ce qui est finalement transmis à l'agent principal est un résumé concis, sans ajouter de charge au contexte de l'agent principal
 3. **Les objectifs de conception diffèrent** : le but du sous-agent est d'"échanger des tokens contre de la qualité", et non de "faire des économies de tokens"

### Q : Est-il possible de forcer DCP à élaguer les sous-agents ?

**R** : **Non, et vous ne devriez pas le faire**. DCP est conçu pour permettre aux sous-agents de conserver le contexte complet afin de générer des résumés de haute qualité. Si vous forcez l'élagage, cela pourrait :

 - Entraîner des résumés d'informations incomplets
 - Affecter la qualité des décisions de l'agent principal
 - Aller à l'encontre de la philosophie de conception des sous-agents d'OpenCode

### Q : L'utilisation des tokens dans les sessions de sous-agents est-elle comptabilisée ?

**R** : Les sessions de sous-agents elles-mêmes ne sont pas comptabilisées par DCP. Les statistiques de DCP ne suivent que les économies de tokens dans les sessions de l'agent principal.

## Résumé de cette leçon

- **Détection des sous-agents** : DCP identifie les sessions de sous-agents en vérifiant `session.parentID`
- **Désactivation automatique** : DCP saute automatiquement toutes les fonctions d'élagage dans les sessions de sous-agents
- **Raison de conception** : Les sous-agents ont besoin d'un contexte complet pour générer des résumés de haute qualité ; l'élagage interférerait avec ce processus
- **Limites d'utilisation** : Les sous-agents ne visent pas l'efficacité des tokens, mais la qualité de l'information, ce qui diffère de l'objectif de l'agent principal

## Aperçu de la prochaine leçon

> La prochaine leçon portera sur **[FAQ et Dépannage](/fr/Opencode-DCP/opencode-dynamic-context-pruning/faq/troubleshooting/)**.
>
> Vous apprendrez :
> - Comment corriger les erreurs de configuration
> - Comment activer les journaux de débogage
> - Les causes courantes de non-réduction des tokens
> - Les limites des sessions de sous-agents

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Fonction de détection des sous-agents | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts) | 1-8 |
| Initialisation de l'état de session | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| Gestionnaire de prompt système (sauter les sous-agents) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts) | 26-28 |
| Gestionnaire de transformation de messages (sauter les sous-agents) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts) | 64-66 |
| Définition du type SessionState | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts) | 27-38 |

**Fonctions clés** :
- `isSubAgentSession()` : Détecte les sous-agents via `session.parentID`
- `ensureSessionInitialized()` : Initialise l'état de session avec détection de sous-agent
- `createSystemPromptHandler()` : Injection de prompt système sautée pour les sessions de sous-agents
- `createChatMessageTransformHandler()` : Toutes les opérations d'élagage sautées pour les sessions de sous-agents

**Constantes clés** :
- `state.isSubAgent` : Indicateur de sous-agent dans l'état de session

</details>
