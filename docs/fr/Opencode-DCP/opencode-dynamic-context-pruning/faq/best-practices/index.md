---
title: "Bonnes pratiques : Optimisation de la configuration | opencode-dynamic-context-pruning"
subtitle: "Bonnes pratiques : Optimisation de la configuration"
sidebarTitle: "Économisez 40% de tokens"
description: "Apprenez les bonnes pratiques de configuration DCP. Maîtrisez la sélection des stratégies, la protection des tours, la protection des outils et la configuration des notifications pour optimiser l'utilisation des tokens."
tags:
  - "Bonnes pratiques"
  - "Économie de tokens"
  - "Configuration"
  - "Optimisation"
prerequisite:
  - "start-configuration"
  - "platforms-auto-pruning"
order: 2
---

# Bonnes pratiques DCP

## Ce que vous apprendrez

- Comprendre le compromis entre le Prompt Caching et l'économie de tokens
- Choisir la stratégie de protection adaptée à vos besoins (protection des tours, outils protégés, patterns de fichiers)
- Utiliser les commandes pour optimiser manuellement l'utilisation des tokens
- Personnaliser la configuration DCP selon les besoins de votre projet

## Compromis du Prompt Caching

### Comprendre le compromis entre cache et élagage

Lorsque DCP élague les sorties d'outils, il modifie le contenu des messages, ce qui invalide le Prompt Caching basé sur la **correspondance exacte des préfixes** à partir de ce point.

**Comparaison des données de test** :

| Scénario | Taux de cache | Économie de tokens | Bénéfice global |
| --- | --- | --- | --- |
| Sans DCP | ~85% | 0% | Référence |
| Avec DCP | ~65% | 20-40% | ✅ Bénéfice net |

### Quand ignorer la perte de cache

**Scénarios recommandés pour utiliser DCP** :

- ✅ **Longues conversations** (plus de 20 tours) : L'inflation du contexte est significative, l'économie de tokens dépasse largement la perte de cache
- ✅ **Services facturés à la requête** : GitHub Copilot, Google Antigravity, etc. — la perte de cache n'a pas d'impact négatif
- ✅ **Appels d'outils intensifs** : Scénarios avec lectures de fichiers fréquentes, recherches, etc.
- ✅ **Tâches de refactoring** : Scénarios avec lectures répétées du même fichier

**Scénarios où désactiver DCP peut être préférable** :

- ⚠️ **Conversations courtes** (< 10 tours) : Bénéfice d'élagage limité, la perte de cache peut être plus notable
- ⚠️ **Tâches sensibles au cache** : Scénarios nécessitant un taux de cache maximal (comme le traitement par lots)

::: tip Configuration flexible
Vous pouvez ajuster dynamiquement la configuration DCP selon les besoins du projet, voire désactiver certaines stratégies dans la configuration au niveau projet.
:::

---

## Bonnes pratiques de priorité de configuration

### Utilisation correcte de la configuration multi-niveaux

La configuration DCP est fusionnée selon la priorité suivante :

```
Valeurs par défaut < Configuration globale < Répertoire de configuration personnalisé < Configuration projet
```

::: info Explication du répertoire de configuration
Le "répertoire de configuration personnalisé" est spécifié via la variable d'environnement `$OPENCODE_CONFIG_DIR`. Ce répertoire doit contenir un fichier `dcp.jsonc` ou `dcp.json`.
:::

### Stratégies de configuration recommandées

| Scénario | Emplacement recommandé | Points clés de configuration |
| --- | --- | --- |
| **Environnement de développement personnel** | Configuration globale | Activer les stratégies automatiques, désactiver les logs de débogage |
| **Projet d'équipe** | Configuration projet | Fichiers protégés spécifiques au projet, activation/désactivation des stratégies |
| **Environnement CI/CD** | Répertoire de configuration personnalisé | Désactiver les notifications, activer les logs de débogage |
| **Débogage temporaire** | Configuration projet | Activer `debug`, mode de notification détaillé |

**Exemple : Surcharge de configuration au niveau projet**

```jsonc
// ~/.config/opencode/dcp.jsonc (configuration globale)
{
    "enabled": true,
    "strategies": {
        "deduplication": {
            "enabled": true
        }
    }
}
```

```jsonc
// .opencode/dcp.jsonc (configuration projet)
{
    "strategies": {
        // Surcharge au niveau projet : désactiver la déduplication (par exemple si le projet nécessite de conserver l'historique du contexte)
        "deduplication": {
            "enabled": false
        }
    }
}
```

::: warning Redémarrage après modification
Vous devez redémarrer OpenCode après avoir modifié la configuration pour que les changements prennent effet.
:::

---

## Choix des stratégies de protection

### Cas d'utilisation de la protection des tours

La **protection des tours** (Turn Protection) empêche l'élagage des outils pendant un nombre spécifié de tours, donnant à l'IA suffisamment de temps pour référencer le contenu récent.

**Paramètres recommandés** :

| Scénario | Valeur recommandée | Raison |
| --- | --- | --- |
| **Résolution de problèmes complexes** | 4-6 tours | L'IA a besoin de plusieurs itérations pour analyser les sorties d'outils |
| **Refactoring de code** | 2-3 tours | Changements de contexte rapides, une protection trop longue réduit l'efficacité |
| **Prototypage rapide** | 2-4 tours | Équilibre entre protection et économie de tokens |
| **Configuration par défaut** | 4 tours | Point d'équilibre testé |

**Quand activer la protection des tours** :

```jsonc
{
    "turnProtection": {
        "enabled": true,   // Activer la protection des tours
        "turns": 6        // Protéger pendant 6 tours (adapté aux tâches complexes)
    }
}
```

**Quand ne pas l'activer** :

- Scénarios de questions-réponses simples (l'IA répond directement, sans outils)
- Conversations courtes fréquentes (une protection trop longue retarde l'élagage)

### Configuration des outils protégés

**Outils protégés par défaut** (aucune configuration supplémentaire nécessaire) :
- `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

::: warning Note sur les valeurs par défaut du schéma
Si vous utilisez l'autocomplétion de votre IDE, la liste des outils protégés par défaut dans le fichier de schéma (`dcp.schema.json`) peut apparaître incomplète. La référence officielle est `DEFAULT_PROTECTED_TOOLS` défini dans le code source, qui inclut les 10 outils.
:::

**Quand ajouter des outils protégés supplémentaires** :

| Scénario | Exemple de configuration | Raison |
| --- | --- | --- |
| **Outils métier critiques** | `protectedTools: ["critical_tool"]` | S'assurer que les opérations critiques restent toujours visibles |
| **Outils nécessitant l'historique du contexte** | `protectedTools: ["analyze_history"]` | Conserver l'historique complet pour l'analyse |
| **Outils de tâches personnalisées** | `protectedTools: ["custom_task"]` | Protéger le workflow des tâches personnalisées |

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_analyze"]  // Protection supplémentaire pour un outil spécifique
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["important_check"]  // Protection supplémentaire pour les outils LLM
        }
    }
}
```

### Utilisation des patterns de fichiers protégés

**Patterns de protection recommandés** :

| Type de fichier | Pattern recommandé | Raison de la protection |
| --- | --- | --- |
| **Fichiers de configuration** | `"*.env"`, `".env*"` | Éviter la perte d'informations sensibles lors de l'élagage |
| **Configuration de base de données** | `"**/config/database/*"` | S'assurer que la configuration de connexion à la base de données reste disponible |
| **Fichiers de secrets** | `"**/secrets/**"` | Protéger tous les secrets et certificats |
| **Logique métier principale** | `"src/core/*"` | Éviter la perte du contexte de code critique |

```jsonc
{
    "protectedFilePatterns": [
        "*.env",                // Protéger tous les fichiers de variables d'environnement
        ".env.*",              // Inclure .env.local, etc.
        "**/secrets/**",       // Protéger le répertoire secrets
        "**/config/*.json",    // Protéger les fichiers de configuration
        "src/auth/**"          // Protéger le code lié à l'authentification
    ]
}
```

::: tip Règles de correspondance des patterns
`protectedFilePatterns` correspond au champ `filePath` dans les paramètres des outils (comme `read`, `write`, `edit`).
:::

---

## Choix des stratégies automatiques

### Stratégie de déduplication (Deduplication)

**Activée par défaut**, adaptée à la plupart des scénarios.

**Cas d'utilisation** :
- Lectures répétées du même fichier (revue de code, débogage multi-tours)
- Exécution des mêmes commandes de recherche ou d'analyse

**Quand ne pas l'activer** :
- Besoin de conserver la sortie exacte de chaque appel (comme la surveillance des performances)
- Les sorties d'outils contiennent des horodatages ou des valeurs aléatoires (différentes à chaque appel)

### Stratégie de remplacement des écritures (Supersede Writes)

**Désactivée par défaut**, à activer selon les besoins du projet.

**Scénarios recommandés pour l'activation** :
- Lecture de vérification immédiatement après modification de fichier (refactoring, traitement par lots)
- Les sorties d'écriture sont volumineuses et leur valeur est remplacée par la lecture

```jsonc
{
    "strategies": {
        "supersedeWrites": {
            "enabled": true  // Activer la stratégie de remplacement des écritures
        }
    }
}
```

**Quand ne pas l'activer** :
- Besoin de suivre l'historique des modifications de fichiers (audit de code)
- Les opérations d'écriture contiennent des métadonnées importantes (comme les raisons des changements)

### Stratégie de purge des erreurs (Purge Errors)

**Activée par défaut**, il est recommandé de la garder activée.

**Recommandations de configuration** :

| Scénario | Valeur recommandée | Raison |
| --- | --- | --- |
| **Configuration par défaut** | 4 tours | Point d'équilibre testé |
| **Scénario d'échec rapide** | 2 tours | Nettoyer rapidement les entrées erronées, réduire la pollution du contexte |
| **Besoin de l'historique des erreurs** | 6-8 tours | Conserver plus d'informations d'erreur pour le débogage |

```jsonc
{
    "strategies": {
        "purgeErrors": {
            "enabled": true,
            "turns": 2  // Scénario d'échec rapide : nettoyer les entrées erronées après 2 tours
        }
    }
}
```

---

## Bonnes pratiques pour les outils pilotés par LLM

### Optimisation de la fonction de rappel

Par défaut, DCP rappelle à l'IA d'utiliser les outils d'élagage tous les 10 appels d'outils.

**Configuration recommandée** :

| Scénario | nudgeFrequency | Description de l'effet |
| --- | --- | --- |
| **Appels d'outils intensifs** | 8-12 | Rappeler rapidement à l'IA de nettoyer |
| **Appels d'outils peu fréquents** | 15-20 | Réduire les interruptions de rappel |
| **Désactiver les rappels** | Infinity | S'appuyer entièrement sur le jugement autonome de l'IA |

```jsonc
{
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 15  // Scénario peu fréquent : rappeler après 15 appels d'outils
        }
    }
}
```

### Utilisation de l'outil Extract

**Quand utiliser Extract** :
- Les sorties d'outils contiennent des découvertes ou données clés qui nécessitent de conserver un résumé
- La sortie originale est volumineuse, mais les informations extraites suffisent pour le raisonnement ultérieur

**Recommandations de configuration** :

```jsonc
{
    "tools": {
        "extract": {
            "enabled": true,
            "showDistillation": false  // Par défaut, ne pas afficher le contenu extrait (réduire les distractions)
        }
    }
}
```

**Quand activer `showDistillation`** :
- Besoin de voir quelles informations clés l'IA a extraites
- Débogage ou vérification du comportement de l'outil Extract

### Utilisation de l'outil Discard

**Quand utiliser Discard** :
- Les sorties d'outils ne sont que des états temporaires ou du bruit
- Pas besoin de conserver les sorties d'outils après la fin de la tâche

**Recommandations de configuration** :

```jsonc
{
    "tools": {
        "discard": {
            "enabled": true
        }
    }
}
```

---

## Astuces d'utilisation des commandes

### Quand utiliser `/dcp context`

**Scénarios d'utilisation recommandés** :
- Suspicion d'utilisation anormale de tokens
- Besoin de comprendre la distribution du contexte de la session actuelle
- Évaluation de l'efficacité de l'élagage DCP

**Bonnes pratiques** :
- Vérifier une fois au milieu d'une longue conversation pour comprendre la composition du contexte
- Vérifier à la fin de la conversation pour voir la consommation totale de tokens

### Quand utiliser `/dcp stats`

**Scénarios d'utilisation recommandés** :
- Besoin de comprendre l'effet d'économie de tokens à long terme
- Évaluation de la valeur globale de DCP
- Comparaison des effets d'économie entre différentes configurations

**Bonnes pratiques** :
- Consulter les statistiques cumulées une fois par semaine
- Comparer les effets avant et après l'optimisation de la configuration

### Quand utiliser `/dcp sweep`

**Scénarios d'utilisation recommandés** :
- Le contexte trop volumineux ralentit les réponses
- Besoin de réduire immédiatement la consommation de tokens
- Les stratégies automatiques n'ont pas déclenché l'élagage

**Astuces d'utilisation** :

| Commande | Utilisation |
| --- | --- |
| `/dcp sweep` | Élaguer tous les outils après le dernier message utilisateur |
| `/dcp sweep 10` | Élaguer uniquement les 10 derniers outils |
| `/dcp sweep 5` | Élaguer uniquement les 5 derniers outils |

**Workflow recommandé** :
1. Utiliser d'abord `/dcp context` pour voir l'état actuel
2. Décider du nombre d'éléments à élaguer selon la situation
3. Exécuter l'élagage avec `/dcp sweep N`
4. Utiliser à nouveau `/dcp context` pour confirmer l'effet

---

## Choix du mode de notification

### Comparaison des trois modes de notification

| Mode | Contenu affiché | Cas d'utilisation |
| --- | --- | --- |
| **off** | Aucune notification | Environnement de travail sans interruption |
| **minimal** | Uniquement le nombre d'éléments élagués et l'économie de tokens | Besoin de connaître l'effet sans les détails |
| **detailed** | Chaque outil élagué et la raison (par défaut) | Débogage ou scénarios nécessitant une surveillance détaillée |

### Configuration recommandée

| Scénario | Mode recommandé | Raison |
| --- | --- | --- |
| **Développement quotidien** | minimal | Se concentrer sur l'effet, réduire les distractions |
| **Débogage de problèmes** | detailed | Voir la raison de chaque opération d'élagage |
| **Démonstration ou enregistrement** | off | Éviter que les notifications perturbent le flux de démonstration |

```jsonc
{
    "pruneNotification": "minimal"  // Recommandé pour le développement quotidien
}
```

---

## Gestion des scénarios de sous-agents

### Comprendre les limitations des sous-agents

**DCP est complètement désactivé dans les sessions de sous-agents.**

**Raisons** :
- L'objectif des sous-agents est de retourner un résumé concis des découvertes
- L'élagage DCP pourrait interférer avec le comportement de synthèse des sous-agents
- Les sous-agents ont généralement une durée d'exécution courte, l'inflation du contexte est limitée

### Comment identifier une session de sous-agent

1. **Activer les logs de débogage** :
   ```jsonc
   {
       "debug": true
   }
   ```

2. **Consulter les logs** :
   Les logs afficheront le marqueur `isSubAgent: true`

### Conseils d'optimisation des tokens pour les sous-agents

Bien que DCP soit désactivé dans les sous-agents, vous pouvez toujours :

- Optimiser les prompts des sous-agents pour réduire la longueur des sorties
- Limiter la portée des appels d'outils des sous-agents
- Utiliser le paramètre `max_length` de l'outil `task` pour contrôler la sortie

---

## Résumé de la leçon

| Domaine de bonnes pratiques | Recommandation principale |
| --- | --- |
| **Prompt Caching** | Dans les longues conversations, l'économie de tokens dépasse généralement la perte de cache |
| **Priorité de configuration** | Configuration globale pour les paramètres généraux, configuration projet pour les besoins spécifiques |
| **Protection des tours** | 4-6 tours pour les tâches complexes, 2-3 tours pour les tâches rapides |
| **Outils protégés** | La protection par défaut est suffisante, ajouter les outils métier critiques selon les besoins |
| **Fichiers protégés** | Protéger les fichiers de configuration, secrets et logique métier principale |
| **Stratégies automatiques** | Déduplication et purge des erreurs activées par défaut, remplacement des écritures à activer selon les besoins |
| **Outils LLM** | Fréquence de rappel 10-15 fois, afficher le contenu extrait lors du débogage avec Extract |
| **Utilisation des commandes** | Vérifier régulièrement le contexte, élaguer manuellement selon les besoins |
| **Mode de notification** | minimal pour le développement quotidien, detailed pour le débogage |

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements dans le code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Fusion de configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L691-794) | 691-794 |
| Validation de configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375) | 147-375 |
| Configuration par défaut | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-134) | 68-134 |
| Protection des tours | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L432-437) | 432-437 |
| Outils protégés | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79) | 68-79 |
| Patterns de fichiers protégés | [`protected-file-patterns.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/protected-file-patterns.ts#L1-60) | 1-60 |
| Détection de sous-agent | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8) | 1-8 |
| Fonction de rappel | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-441) | 438-441 |

**Constantes clés** :
- `MAX_TOOL_CACHE_SIZE = 1000` : Nombre maximum d'entrées dans le cache d'outils
- `turnProtection.turns` : Protection de 4 tours par défaut

**Fonctions clés** :
- `getConfig()` : Charger et fusionner la configuration multi-niveaux
- `validateConfigTypes()` : Valider les types des éléments de configuration
- `mergeConfig()` : Fusionner la configuration par priorité
- `isSubAgentSession()` : Détecter les sessions de sous-agents

</details>
