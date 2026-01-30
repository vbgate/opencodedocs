---
title: "Élagage LLM : Optimisation intelligente | opencode-dynamic-context-pruning"
sidebarTitle: "Laisser l'IA élaguer automatiquement"
subtitle: "Élagage LLM : Optimisation intelligente du contexte"
description: "Apprenez les outils discard/extract de DCP, comprenez leurs différences, le mécanisme d'injection et les protections, configurez les options, validez l'élagage en pratique, optimisez les tokens et réduisez les coûts."
tags:
  - "DCP"
  - "Élagage de contexte"
  - "Outils IA"
  - "Optimisation des tokens"
prerequisite:
  - "start-configuration"
order: 2
---

# Outils d'élagage pilotés par LLM : Laissez l'IA optimiser intelligemment le contexte

## Ce que vous apprendrez

- Comprendre les différences entre les outils discard et extract et leurs cas d'utilisation
- Savoir comment l'IA sélectionne le contenu à élaguer via la liste `<prunable-tools>`
- Configurer les options d'activation, la fréquence des rappels et les paramètres d'affichage
- Comprendre comment les mécanismes de protection empêchent l'élagage accidentel de fichiers critiques

## Votre situation actuelle

Au fil de la conversation, les appels d'outils s'accumulent et le contexte devient de plus en plus volumineux. Vous rencontrez peut-être :
- Une explosion de l'utilisation des tokens et des coûts croissants
- L'IA doit traiter de nombreuses sorties d'outils obsolètes et non pertinentes
- Vous ne savez pas comment inciter l'IA à nettoyer proactivement le contexte

La solution traditionnelle est le nettoyage manuel, mais cela interrompt le flux de conversation. DCP offre une meilleure approche : laisser l'IA décider elle-même quand nettoyer le contexte.

## Quand utiliser cette technique

Lorsque vous :
- Avez fréquemment de longues conversations avec de nombreux appels d'outils accumulés
- Constatez que l'IA doit traiter un grand volume de sorties d'outils historiques
- Souhaitez optimiser les coûts de tokens sans interrompre la conversation
- Voulez choisir de conserver ou supprimer du contenu selon le contexte spécifique

## Concept fondamental

DCP fournit deux outils permettant à l'IA d'optimiser proactivement le contexte pendant la conversation :

| Outil | Utilisation | Conservation du contenu |
| --- | --- | --- |
| **discard** | Supprimer les tâches terminées ou le bruit | ❌ Non conservé |
| **extract** | Extraire les découvertes clés puis supprimer le contenu original | ✅ Informations condensées conservées |

### Mécanisme de fonctionnement

Avant chaque envoi de message par l'IA, DCP effectue :

```
1. Analyse des appels d'outils dans la session actuelle
   ↓
2. Filtrage des outils déjà élagués ou protégés
   ↓
3. Génération de la liste <prunable-tools>
   Format : ID: outil, paramètre
   ↓
4. Injection de la liste dans le contexte
   ↓
5. L'IA sélectionne les outils et appelle discard/extract
   ↓
6. DCP remplace le contenu élagué par un placeholder
```

### Logique de décision pour le choix de l'outil

L'IA suit ce processus de décision :

```
"Cette sortie d'outil nécessite-t-elle de conserver des informations ?"
  │
  ├─ Non → discard (méthode de nettoyage par défaut)
  │   - Tâche terminée, contenu sans valeur
  │   - Bruit, informations non pertinentes
  │
  ├─ Oui → extract (préserver les connaissances)
  │   - Informations clés nécessaires pour référence ultérieure
  │   - Signatures de fonctions, valeurs de configuration, etc.
  │
  └─ Incertain → extract (plus sûr)
```

::: info
L'IA élague par lots plutôt que de traiter chaque petite sortie d'outil individuellement. C'est plus efficace.
:::

### Mécanismes de protection

DCP dispose de plusieurs couches de protection pour empêcher l'élagage accidentel de contenu critique :

| Couche de protection | Description | Option de configuration |
| --- | --- | --- |
| **Outils protégés** | Les outils essentiels comme task, write, edit ne peuvent pas être élagués | `tools.settings.protectedTools` |
| **Fichiers protégés** | Les chemins de fichiers correspondant aux patterns glob ne peuvent pas être élagués | `protectedFilePatterns` |
| **Protection par tour** | Les nouveaux outils ne sont pas ajoutés à la liste d'élagage pendant N tours | `turnProtection.turns` |

::: tip
Les outils protégés par défaut incluent : task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
:::

## Suivez le guide

### Étape 1 : Comprendre la liste `<prunable-tools>`

Pendant la conversation, DCP injecte automatiquement la liste `<prunable-tools>`. L'IA voit un contenu comme celui-ci :

```xml
<prunable-tools>
The following tools have been invoked and are available for pruning.
This list does not mandate immediate action.
Consider your current goals and resources you need before discarding valuable tool inputs or outputs.
Consolidate your prunes for efficiency; it is rarely worth pruning a single tiny tool output.
Keep your context free of noise.

5: read, /path/to/auth.ts
12: bash, npm test
18: grep, "function login"
</prunable-tools>
```

**Ce que vous devriez voir** :
- Un outil par ligne, au format `ID: outil, paramètre`
- L'ID est un index numérique (commençant à 0)
- Seuls les outils élagables sont affichés (les outils déjà élagués, protégés ou les fichiers protégés ne sont pas affichés)

### Étape 2 : Observer l'utilisation de discard par l'IA

Lorsque l'IA termine une tâche et détermine qu'aucune information n'a besoin d'être conservée :

```
Entrée utilisateur : Tester la fonctionnalité d'authentification

Sortie IA :
Tests réussis. La logique d'authentification fonctionne correctement, pas besoin de conserver les logs de test.
[Appel discard(ids: ["completion", "5", "12"])]
```

**Ce que vous devriez voir** :
- L'IA a utilisé l'outil `discard`
- Format des paramètres : `["raison", "ID1", "ID2", ...]`
- La raison n'a que deux valeurs possibles : `"completion"` (tâche terminée) ou `"noise"` (bruit)

### Étape 3 : Observer l'utilisation d'extract par l'IA

Lorsque l'IA termine une tâche mais doit conserver des informations clés :

```
Entrée utilisateur : Analyser l'implémentation du service d'authentification

Sortie IA :
J'ai découvert quelques détails clés, voici l'extraction :
[Appel extract(ids: ["5", "12"], distillation: [
  "auth.ts: validateToken vérifie le cache (TTL 5min) puis appelle OIDC",
  "bash: résultat npm test - tous les tests réussis"
])]
```

**Ce que vous devriez voir** :
- L'IA a utilisé l'outil `extract`
- Le tableau `distillation` a la même longueur que le tableau `ids`
- Chaque contenu extrait correspond aux informations condensées d'une sortie d'outil

### Étape 4 : Configurer les options des outils d'élagage

Éditez le fichier de configuration DCP (`~/.config/opencode/dcp.jsonc` ou au niveau projet `.opencode/dcp.jsonc`) :

```jsonc
{
  "tools": {
    "discard": {
      "enabled": true
    },
    "extract": {
      "enabled": true,
      "showDistillation": false
    },
    "settings": {
      "nudgeEnabled": true,
      "nudgeFrequency": 10,
      "protectedTools": [
        "task",
        "todowrite",
        "todoread",
        "discard",
        "extract",
        "batch",
        "write",
        "edit",
        "plan_enter",
        "plan_exit"
      ]
    }
  }
}
```

**Ce que vous devriez voir** :
- `discard.enabled` : Active l'outil discard (true par défaut)
- `extract.enabled` : Active l'outil extract (true par défaut)
- `extract.showDistillation` : Affiche ou non le contenu extrait (false par défaut)
- `nudgeEnabled` : Active ou non les rappels d'élagage (true par défaut)
- `nudgeFrequency` : Fréquence des rappels (10 par défaut, soit tous les 10 appels d'outils)

**Ce que vous devriez voir** :
- Si `showDistillation` est false, le contenu extrait n'est pas affiché dans la conversation
- Si `showDistillation` est true, le contenu extrait est affiché sous forme de message ignoré

### Étape 5 : Tester la fonctionnalité d'élagage

1. Menez une conversation assez longue, déclenchant plusieurs appels d'outils
2. Observez si l'IA appelle discard ou extract au moment approprié
3. Utilisez `/dcp stats` pour voir les statistiques d'élagage

**Ce que vous devriez voir** :
- Après l'accumulation d'un certain nombre d'appels d'outils, l'IA commence à élaguer proactivement
- `/dcp stats` affiche le nombre de tokens économisés
- Le contexte de conversation est plus focalisé sur la tâche en cours

## Point de contrôle ✅

::: details Cliquez pour vérifier votre configuration

**Vérifier que la configuration est effective**

```bash
# Voir la configuration DCP
cat ~/.config/opencode/dcp.jsonc

# Ou la configuration au niveau projet
cat .opencode/dcp.jsonc
```

Vous devriez voir :
- `tools.discard.enabled` à true (discard activé)
- `tools.extract.enabled` à true (extract activé)
- `tools.settings.nudgeEnabled` à true (rappels activés)

**Vérifier que l'élagage fonctionne**

Dans la conversation, après avoir déclenché plusieurs appels d'outils :

Vous devriez voir :
- L'IA appelle discard ou extract au moment approprié
- Recevoir une notification d'élagage (affichant les outils élagués et les tokens économisés)
- `/dcp stats` affiche le total cumulé de tokens économisés

:::

## Pièges à éviter

### Erreur courante 1 : L'IA n'élague pas les outils

**Causes possibles** :
- Les outils d'élagage ne sont pas activés
- La configuration de protection est trop stricte, aucun outil n'est élagable

**Solution** :
```jsonc
{
  "tools": {
    "discard": {
      "enabled": true  // S'assurer que c'est activé
    },
    "extract": {
      "enabled": true  // S'assurer que c'est activé
    }
  }
}
```

### Erreur courante 2 : Élagage accidentel de contenu critique

**Causes possibles** :
- Les fichiers critiques ne sont pas ajoutés aux patterns de protection
- La liste des outils protégés est incomplète

**Solution** :
```jsonc
{
  "protectedFilePatterns": [
    "src/auth/*",  // Protéger les fichiers liés à l'authentification
    "config/*"     // Protéger les fichiers de configuration
  ],
  "tools": {
    "settings": {
      "protectedTools": [
        "read",  // Ajouter read à la liste de protection
        "write"
      ]
    }
  }
}
```

### Erreur courante 3 : Le contenu extrait n'est pas visible

**Cause possible** :
- `showDistillation` est configuré à false

**Solution** :
```jsonc
{
  "tools": {
    "extract": {
      "showDistillation": true  // Activer l'affichage
    }
  }
}
```

::: warning
Le contenu extrait est affiché sous forme de message ignoré, sans affecter le contexte de conversation.
:::

## Résumé de la leçon

DCP fournit deux outils permettant à l'IA d'optimiser le contexte de manière autonome :

- **discard** : Supprime les tâches terminées ou le bruit, sans conserver d'informations
- **extract** : Extrait les découvertes clés puis supprime le contenu original, en conservant les informations condensées

L'IA découvre les outils élagables via la liste `<prunable-tools>` et choisit l'outil approprié selon le contexte. Les mécanismes de protection garantissent que le contenu critique n'est pas élagué par erreur.

Points clés de configuration :
- Activer les outils : `tools.discard.enabled` et `tools.extract.enabled`
- Afficher le contenu extrait : `tools.extract.showDistillation`
- Ajuster la fréquence des rappels : `tools.settings.nudgeFrequency`
- Protéger les outils et fichiers critiques : `protectedTools` et `protectedFilePatterns`

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Utilisation des commandes Slash](../commands/)**
>
> Vous apprendrez :
> - Utiliser `/dcp context` pour voir la distribution des tokens de la session actuelle
> - Utiliser `/dcp stats` pour voir les statistiques d'élagage cumulées
> - Utiliser `/dcp sweep` pour déclencher manuellement l'élagage

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition de l'outil discard | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L180) | 155-180 |
| Définition de l'outil extract | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Exécution de l'opération d'élagage | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L26-L153) | 26-153 |
| --- | --- | --- |
| Injection du contexte d'élagage | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L102-L156) | 102-156 |
| Spécification de l'outil discard | [`lib/prompts/discard-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/discard-tool-spec.ts#L1-L41) | 1-41 |
| Spécification de l'outil extract | [`lib/prompts/extract-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/extract-tool-spec.ts#L1-L48) | 1-48 |
| Prompt système (les deux) | [`lib/prompts/system/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/system/both.ts#L1-L60) | 1-60 |
| Prompt de rappel | [`lib/prompts/nudge/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/nudge/both.ts#L1-L10) | 1-10 |
| Définition de la configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L436-L449) | 436-449 |
| Outils protégés par défaut | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-L441) | 438-441 |

**Constantes clés** :
- `DISCARD_TOOL_DESCRIPTION` : Description du prompt de l'outil discard
- `EXTRACT_TOOL_DESCRIPTION` : Description du prompt de l'outil extract
- `DEFAULT_PROTECTED_TOOLS` : Liste des outils protégés par défaut

**Fonctions clés** :
- `createDiscardTool(ctx)` : Crée l'outil discard
- `createExtractTool(ctx)` : Crée l'outil extract
- `executePruneOperation(ctx, toolCtx, ids, reason, toolName, distillation)` : Exécute l'opération d'élagage
- `buildPrunableToolsList(state, config, logger, messages)` : Génère la liste des outils élagables
- `insertPruneToolContext(state, config, logger, messages)` : Injecte le contexte d'élagage

**Options de configuration** :
- `tools.discard.enabled` : Active ou non l'outil discard (true par défaut)
- `tools.extract.enabled` : Active ou non l'outil extract (true par défaut)
- `tools.extract.showDistillation` : Affiche ou non le contenu extrait (false par défaut)
- `tools.settings.nudgeEnabled` : Active ou non les rappels (true par défaut)
- `tools.settings.nudgeFrequency` : Fréquence des rappels (10 par défaut)
- `tools.settings.protectedTools` : Liste des outils protégés
- `protectedFilePatterns` : Patterns glob des fichiers protégés

</details>
