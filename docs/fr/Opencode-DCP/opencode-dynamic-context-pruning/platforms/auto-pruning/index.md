---
title: "Élagage automatique : trois stratégies | opencode-dcp"
sidebarTitle: "Économiser des tokens avec les stratégies"
subtitle: "Élagage automatique : trois stratégies | opencode-dcp"
description: "Découvrez les trois stratégies d'élagage automatique de DCP : déduplication, écrasement d'écriture et purge des erreurs. Apprenez leur fonctionnement, cas d'usage et configuration pour réduire vos coûts de tokens et améliorer la qualité des conversations. Toutes les stratégies sont sans coût LLM."
tags:
  - "élagage automatique"
  - "stratégies"
  - "déduplication"
  - "écrasement d'écriture"
  - "purge des erreurs"
prerequisite:
  - "start-getting-started"
  - "start-configuration"
order: 1
---

# Guide détaillé des stratégies d'élagage automatique

## Ce que vous apprendrez

- Comprendre le fonctionnement des trois stratégies d'élagage automatique
- Savoir quand activer ou désactiver chaque stratégie
- Optimiser l'efficacité des stratégies via la configuration

## Le problème actuel

À mesure que les conversations s'allongent, les appels d'outils s'accumulent dans le contexte :
- L'IA lit le même fichier à plusieurs reprises, injectant à chaque fois son contenu complet dans le contexte
- Après une écriture de fichier suivie d'une lecture, l'ancien contenu écrit reste inutilement dans le contexte
- Après un échec d'appel d'outil, les paramètres d'entrée volumineux continuent d'occuper de l'espace

Ces problèmes font exploser votre facture de tokens et peuvent « polluer » le contexte, affectant le jugement de l'IA.

## Concept clé

DCP propose trois **stratégies d'élagage automatique** qui s'exécutent silencieusement avant chaque requête, **sans aucun coût LLM** :

| Stratégie | État par défaut | Fonction |
| --- | --- | --- |
| Déduplication | ✅ Activée | Détecte les appels d'outils en double, ne conserve que le plus récent |
| Écrasement d'écriture | ❌ Désactivée | Nettoie les entrées d'écriture qui ont été écrasées par une lecture |
| Purge des erreurs | ✅ Activée | Nettoie les entrées d'outils en erreur après N tours |

Toutes les stratégies suivent ces règles :
- **Ignorer les outils protégés** : les outils critiques comme task, write, edit ne sont jamais élagués
- **Ignorer les fichiers protégés** : les chemins de fichiers protégés par des patterns glob configurés
- **Conserver les messages d'erreur** : la stratégie de purge des erreurs ne supprime que les paramètres d'entrée, les messages d'erreur sont conservés

---

## Stratégie de déduplication

### Fonctionnement

La stratégie de déduplication détecte les appels répétés avec **le même nom d'outil et les mêmes paramètres**, ne conservant que le plus récent.

::: info Mécanisme de correspondance par signature

DCP identifie les doublons via une « signature » :
- Même nom d'outil
- Mêmes valeurs de paramètres (null/undefined ignorés, l'ordre des clés n'a pas d'importance)

Par exemple :
```json
// 1er appel
{ "tool": "read", "path": "src/config.ts" }

// 2e appel (même signature)
{ "tool": "read", "path": "src/config.ts" }

// 3e appel (signature différente)
{ "tool": "read", "path": "src/utils.ts" }
```
:::

### Cas d'usage

**Recommandé d'activer** (activé par défaut) :
- L'IA lit fréquemment le même fichier pour l'analyse de code
- Requêtes répétées de la même configuration au fil des conversations
- Scénarios où seul l'état le plus récent compte et l'historique peut être supprimé

**Vous pourriez vouloir désactiver** :
- Besoin de conserver le contexte de chaque appel d'outil (par exemple, pour déboguer les sorties d'outils)

### Configuration

```json
// ~/.config/opencode/dcp.jsonc
{
  "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/main/dcp.schema.json",
  "strategies": {
    "deduplication": {
      "enabled": true  // true pour activer, false pour désactiver
    }
  }
}
```

**Outils protégés** (non élagués par défaut) :
- task, write, edit, batch, plan_enter, plan_exit
- todowrite, todoread (outils de liste de tâches)
- discard, extract (outils propres à DCP)

Ces outils ne peuvent pas être dédupliqués même via la configuration (protection codée en dur).

---

## Stratégie d'écrasement d'écriture

### Fonctionnement

La stratégie d'écrasement d'écriture nettoie **les entrées d'opérations d'écriture qui ont été écrasées par une lecture ultérieure**.

::: details Exemple : écriture suivie d'une lecture

```text
Étape 1 : Écriture du fichier
L'IA appelle write("config.json", {...})
↓
Étape 2 : Lecture du fichier pour confirmation
L'IA appelle read("config.json") → retourne le contenu actuel
↓
La stratégie d'écrasement identifie
L'entrée de write (potentiellement volumineuse) devient redondante
car read a déjà capturé l'état actuel du fichier
↓
Élagage
Seule la sortie de read est conservée, l'entrée de write est supprimée
```

:::

### Cas d'usage

**Recommandé d'activer** :
- Scénarios de développement itératif fréquent « écrire → vérifier → modifier »
- Opérations d'écriture contenant de grands templates ou des fichiers complets

**Pourquoi désactivé par défaut** :
- Certains workflows dépendent de l'« historique des écritures » comme contexte
- Peut affecter certains appels d'outils liés au contrôle de version

**Quand l'activer manuellement** :
```json
{
  "strategies": {
    "supersedeWrites": {
      "enabled": true
    }
  }
}
```

### Points d'attention

Cette stratégie **n'élague que les entrées de l'outil write**, pas les sorties. Car :
- La sortie de write est généralement un message de confirmation (très petit)
- L'entrée de write peut contenir le contenu complet du fichier (très volumineux)

---

## Stratégie de purge des erreurs

### Fonctionnement

La stratégie de purge des erreurs attend N tours après un échec d'appel d'outil, puis supprime **les paramètres d'entrée** (en conservant les messages d'erreur).

::: info Qu'est-ce qu'un tour ?
Dans une conversation OpenCode :
- L'utilisateur envoie un message → l'IA répond = 1 tour
- Les appels d'outils ne comptent pas comme des tours séparés

Le seuil par défaut est de 4 tours, ce qui signifie que les entrées d'outils en erreur sont automatiquement nettoyées après 4 tours.
:::

### Cas d'usage

**Recommandé d'activer** (activé par défaut) :
- Échec d'appel d'outil avec une entrée volumineuse (par exemple, échec de lecture d'un très gros fichier)
- Le message d'erreur doit être conservé, mais les paramètres d'entrée n'ont plus de valeur

**Vous pourriez vouloir désactiver** :
- Besoin de conserver l'entrée complète des outils en échec pour le débogage
- Erreurs « intermittentes » fréquentes où vous souhaitez conserver l'historique

### Configuration

```json
{
  "strategies": {
    "purgeErrors": {
      "enabled": true,   // Interrupteur d'activation
      "turns": 4        // Seuil de purge (nombre de tours)
    }
  }
}
```

**Outils protégés** (non élagués par défaut) :
- Même liste d'outils protégés que la stratégie de déduplication

---

## Ordre d'exécution des stratégies

Les trois stratégies s'exécutent dans un **ordre fixe** :

```mermaid
graph LR
    A["Liste des messages"] --> B["Synchronisation du cache d'outils"]
    B --> C["Stratégie de déduplication"]
    C --> D["Stratégie d'écrasement d'écriture"]
    D --> E["Stratégie de purge des erreurs"]
    E --> F["Remplacement du contenu élagué"]
```

Cela signifie :
1. D'abord la déduplication (réduction de la redondance)
2. Ensuite l'écrasement d'écriture (nettoyage des écritures obsolètes)
3. Enfin la purge des erreurs (nettoyage des entrées d'erreurs expirées)

Chaque stratégie se base sur le résultat de la précédente et n'élague pas deux fois le même outil.

---

## Pièges à éviter

### ❌ Erreur 1 : Penser que tous les outils sont automatiquement élagués

**Problème** : Pourquoi les outils task, write, etc. ne sont-ils pas élagués ?

**Raison** : Ces outils sont dans la **liste des outils protégés**, protection codée en dur.

**Solution** :
- Si vous devez vraiment élaguer write, envisagez d'activer la stratégie d'écrasement d'écriture
- Si vous devez élaguer task, vous pouvez contrôler indirectement via la configuration des chemins de fichiers protégés

### ❌ Erreur 2 : La stratégie d'écrasement d'écriture rend le contexte incomplet

**Problème** : Après activation de l'écrasement d'écriture, l'IA ne trouve plus le contenu précédemment écrit.

**Raison** : La stratégie ne nettoie que les opérations d'écriture « écrasées par une lecture », mais si le fichier n'a jamais été lu après l'écriture, il ne sera pas élagué.

**Solution** :
- Vérifiez si le fichier a vraiment été lu (`/dcp context` pour voir)
- Si vous devez vraiment conserver l'historique des écritures, désactivez cette stratégie

### ❌ Erreur 3 : La stratégie de purge des erreurs nettoie trop vite

**Problème** : L'entrée en erreur vient d'être élaguée, et l'IA rencontre immédiatement la même erreur.

**Raison** : Le seuil `turns` est trop petit.

**Solution** :
```json
{
  "strategies": {
    "purgeErrors": {
      "turns": 8  // Augmenter de 4 (défaut) à 8
    }
  }
}
```

---

## Quand utiliser ces stratégies

| Scénario | Combinaison de stratégies recommandée |
| --- | --- |
| Développement quotidien (plus de lectures que d'écritures) | Déduplication + Purge des erreurs (configuration par défaut) |
| Vérification fréquente des écritures | Toutes activées (activer manuellement l'écrasement d'écriture) |
| Débogage des échecs d'outils | Déduplication uniquement (désactiver la purge des erreurs) |
| Besoin de l'historique complet du contexte | Toutes désactivées |

---

## Résumé

- **Stratégie de déduplication** : Détecte les appels d'outils en double, conserve le plus récent (activée par défaut)
- **Stratégie d'écrasement d'écriture** : Nettoie les entrées d'écriture écrasées par une lecture (désactivée par défaut)
- **Stratégie de purge des erreurs** : Nettoie les entrées d'outils en erreur après N tours (activée par défaut, seuil de 4)
- Toutes les stratégies ignorent les outils protégés et les chemins de fichiers protégés
- Les stratégies s'exécutent dans un ordre fixe : Déduplication → Écrasement d'écriture → Purge des erreurs

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons les **[Outils d'élagage pilotés par LLM](../llm-tools/)**.
>
> Vous apprendrez :
> - Comment l'IA appelle de manière autonome les outils discard et extract
> - L'implémentation de l'optimisation sémantique du contexte
> - Les meilleures pratiques pour extraire les découvertes clés

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Implémentation de la déduplication | [`lib/strategies/deduplication.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/deduplication.ts) | 13-83 |
| Implémentation de l'écrasement d'écriture | [`lib/strategies/supersede-writes.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/supersede-writes.ts) | 16-105 |
| Implémentation de la purge des erreurs | [`lib/strategies/purge-errors.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/purge-errors.ts) | 16-80 |
| Export du point d'entrée des stratégies | [`lib/strategies/index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/index.ts) | 1-5 |
| Configuration par défaut | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 423-464 |
| Liste des outils protégés | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 68-79 |

**Fonctions clés** :
- `deduplicate()` - Fonction principale de la stratégie de déduplication
- `supersedeWrites()` - Fonction principale de la stratégie d'écrasement d'écriture
- `purgeErrors()` - Fonction principale de la stratégie de purge des erreurs
- `createToolSignature()` - Création de la signature d'outil pour la correspondance de déduplication
- `normalizeParameters()` - Normalisation des paramètres (suppression de null/undefined)
- `sortObjectKeys()` - Tri des clés de paramètres (garantit la cohérence des signatures)

**Valeurs de configuration par défaut** :
- `strategies.deduplication.enabled = true`
- `strategies.supersedeWrites.enabled = false`
- `strategies.purgeErrors.enabled = true`
- `strategies.purgeErrors.turns = 4`

**Outils protégés (non élagués par défaut)** :
- task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit

</details>
