---
title: "Tâches en arrière-plan : Exécution parallèle de plusieurs agents | oh-my-opencode"
sidebarTitle: "Faire travailler plusieurs IA simultanément"
subtitle: "Tâches en arrière-plan : Exécution parallèle de plusieurs agents | oh-my-opencode"
description: "Apprenez à utiliser le système de tâches en arrière-plan d'oh-my-opencode pour l'exécution parallèle. Maîtrisez le contrôle de concurrence à trois niveaux, la gestion du cycle de vie des tâches, et les outils delegate_task et background_output."
tags:
  - "background-tasks"
  - "parallel-execution"
  - "concurrency"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 80
---

# Tâches parallèles en arrière-plan : Travailler comme une équipe

## Ce que vous saurez faire après ce tutoriel

- ✅ Lancer plusieurs tâches en arrière-plan en parallèle, permettant à différents agents IA de travailler simultanément
- ✅ Configurer les limites de concurrence pour éviter les limitations d'API et la perte de contrôle des coûts
- ✅ Récupérer les résultats des tâches en arrière-plan sans attendre leur achèvement
- ✅ Annuler des tâches pour libérer des ressources

## Votre situation actuelle

**Une seule personne au travail ?**

Imaginez ce scénario :
- Vous devez demander à l'agent **Explore** de rechercher l'implémentation d'authentification dans le code
- En même temps, demander à l'agent **Librarian** d'étudier les meilleures pratiques
- Et demander à l'agent **Oracle** d'examiner la conception architecturale

Si vous les exécutez séquentiellement, le temps total = 10 minutes + 15 minutes + 8 minutes = **33 minutes**

Mais si vous pouviez les exécuter en parallèle ? 3 agents travaillant simultanément, temps total = **max(10, 15, 8) = 15 minutes**, économisant **54%** du temps.

**Problème** : Par défaut, OpenCode ne peut traiter qu'une seule session à la fois. Pour réaliser du parallélisme, vous devez gérer manuellement plusieurs fenêtres ou attendre la fin des tâches.

**Solution** : Le système de tâches en arrière-plan d'oh-my-opencode peut exécuter plusieurs agents IA simultanément et suivre leur progression en arrière-plan, vous permettant de continuer d'autres travaux.

## Quand utiliser cette technique

Scénarios où le système de tâches en arrière-plan améliore l'efficacité :

| Scénario | Exemple | Valeur |
| --- | --- | --- |
| **Recherche parallèle** | Explore recherche l'implémentation + Librarian consulte la documentation | Recherche 3× plus rapide |
| **Revue multi-experts** | Oracle examine l'architecture + Momus valide le plan | Retours multi-perspectives rapides |
| **Tâches asynchrones** | Révision de code pendant le commit Git | Ne bloque pas le flux principal |
| **Ressources limitées** | Limiter la concurrence pour éviter les limitations d'API | Contrôle des coûts et stabilité |

::: tip Mode Ultrawork
Ajoutez `ultrawork` ou `ulw` dans votre prompt pour activer automatiquement le mode performance maximale, incluant tous les agents professionnels et les tâches parallèles en arrière-plan. Aucune configuration manuelle nécessaire.
:::

## 🎒 Prérequis

::: warning Conditions préalables

Avant de commencer ce tutoriel, assurez-vous que :
1. oh-my-opencode est installé (voir [Tutoriel d'installation](../../start/installation/))
2. La configuration de base est terminée, avec au moins un AI Provider disponible
3. Vous comprenez l'utilisation de base de l'orchestrateur Sisyphus (voir [Tutoriel Sisyphus](../sisyphus-orchestrator/))

:::

## Concepts fondamentaux

Le fonctionnement du système de tâches en arrière-plan peut être résumé en trois concepts clés :

### 1. Exécution parallèle

Le système de tâches en arrière-plan vous permet de lancer simultanément plusieurs tâches d'agents IA, chaque tâche s'exécutant dans une session indépendante. Cela signifie :

- **Explore** recherche le code
- **Librarian** consulte la documentation
- **Oracle** examine la conception

Les trois tâches s'exécutent en parallèle, le temps total étant égal à celui de la tâche la plus lente.

### 2. Contrôle de concurrence

Pour éviter de lancer trop de tâches simultanément, ce qui pourrait entraîner des limitations d'API ou une perte de contrôle des coûts, le système fournit trois niveaux de limitation de concurrence :

```
Priorité : Model > Provider > Default

Exemple de configuration :
modelConcurrency:     claude-opus-4-5 → 2
providerConcurrency:  anthropic → 3
defaultConcurrency:   tous → 5
```

**Règles** :
- Si une limite au niveau du modèle est spécifiée, utilisez cette limite
- Sinon, si une limite au niveau du fournisseur est spécifiée, utilisez cette limite
- Sinon, utilisez la limite par défaut (valeur par défaut : 5)

### 3. Mécanisme de polling

Le système vérifie l'état des tâches toutes les 2 secondes pour déterminer si une tâche est terminée. Conditions d'achèvement :

- **Session idle** (événement session.idle)
- **Détection de stabilité** : 3 vérifications consécutives sans changement du nombre de messages
- **Liste TODO vide** : Toutes les tâches sont terminées

## Suivez-moi

### Étape 1 : Lancer des tâches en arrière-plan

Utilisez l'outil `delegate_task` pour lancer des tâches en arrière-plan :

```markdown
Lancer des tâches parallèles en arrière-plan :

1. Explore recherche l'implémentation d'authentification
2. Librarian étudie les meilleures pratiques
3. Oracle examine la conception architecturale

Exécution parallèle :
```

**Pourquoi**
C'est le scénario d'utilisation le plus classique pour démontrer les tâches en arrière-plan. Les 3 tâches peuvent s'exécuter simultanément, économisant considérablement du temps.

**Ce que vous devriez voir**
Le système retournera 3 ID de tâches :

```
Background task launched successfully.

Task ID: bg_abc123
Session ID: sess_xyz789
Description: Explore: recherche l'implémentation d'authentification
Agent: explore
Status: pending
...

Background task launched successfully.

Task ID: bg_def456
Session ID: sess_uvwx012
Description: Librarian: étudie les meilleures pratiques
Agent: librarian
Status: pending
...
```

::: info Explication des états de tâche
- **pending** : En attente d'un slot de concurrence
- **running** : En cours d'exécution
- **completed** : Terminé
- **error** : Erreur
- **cancelled** : Annulé
:::

### Étape 2 : Vérifier l'état des tâches

Utilisez l'outil `background_output` pour consulter l'état des tâches :

```markdown
Consulter l'état de bg_abc123 :
```

**Pourquoi**
Pour savoir si une tâche est terminée ou toujours en cours. Par défaut, ne pas attendre, retourner l'état immédiatement.

**Ce que vous devriez voir**
Si la tâche est toujours en cours :

```
## Task Status

| Field | Value |
| --- | --- |
| Task ID | `bg_abc123` |
| Description | Explore: recherche l'implémentation d'authentification |
| Agent | explore |
| Status | **running** |
| Duration | 2m 15s |
| Session ID | `sess_xyz789` |

> **Note**: No need to wait explicitly - system will notify you when this task completes.

## Original Prompt

Rechercher l'implémentation d'authentification dans le répertoire src/auth, incluant connexion, inscription, gestion des tokens, etc.
```

Si la tâche est terminée :

```
Task Result

Task ID: bg_abc123
Description: Explore: recherche l'implémentation d'authentification
Duration: 5m 32s
Session ID: sess_xyz789

---

Trouvé 3 implémentations d'authentification :
1. `src/auth/login.ts` - Authentification JWT
2. `src/auth/register.ts` - Inscription utilisateur
3. `src/auth/token.ts` - Rafraîchissement de token
...
```

### Étape 3 : Configurer le contrôle de concurrence

Éditez `~/.config/opencode/oh-my-opencode.json` :

```jsonc
{
  "$schema": "https://code-yeongyu.github.io/oh-my-opencode/schema.json",

  "background_task": {
    // Limite de concurrence au niveau du fournisseur (configuration recommandée)
    "providerConcurrency": {
      "anthropic": 3,     // Maximum 3 modèles Anthropic simultanés
      "openai": 2,         // Maximum 2 modèles OpenAI simultanés
      "google": 2          // Maximum 2 modèles Google simultanés
    },

    // Limite de concurrence au niveau du modèle (priorité la plus élevée)
    "modelConcurrency": {
      "claude-opus-4-5": 2,    // Maximum 2 Opus 4.5 simultanés
      "gpt-5.2": 2              // Maximum 2 GPT 5.2 simultanés
    },

    // Limite de concurrence par défaut (utilisée quand aucune des configurations ci-dessus n'est définie)
    "defaultConcurrency": 3
  }
}
```

**Pourquoi**
Le contrôle de concurrence est essentiel pour éviter la perte de contrôle des coûts. Si vous ne définissez pas de limite, lancer 10 tâches Opus 4.5 simultanément pourrait consommer instantanément une grande quantité de quota API.

::: tip Configuration recommandée
Pour la plupart des scénarios, configuration recommandée :
- `providerConcurrency.anthropic: 3`
- `providerConcurrency.openai: 2`
- `defaultConcurrency: 5`
:::

**Ce que vous devriez voir**
Une fois la configuration appliquée, lors du lancement de tâches en arrière-plan :
- Si la limite de concurrence est atteinte, la tâche entrera en état **pending** et attendra
- Dès qu'une tâche se termine, les tâches en attente démarreront automatiquement

### Étape 4 : Annuler des tâches

Utilisez l'outil `background_cancel` pour annuler des tâches :

```markdown
Annuler toutes les tâches en arrière-plan :
```

**Pourquoi**
Parfois, une tâche est bloquée ou n'est plus nécessaire, vous pouvez l'annuler activement pour libérer des ressources.

**Ce que vous devriez voir**

```
Cancelled 3 background task(s):

| Task ID | Description | Status | Session ID |
| --- | --- | --- | --- |
| `bg_abc123` | Explore: recherche l'implémentation d'authentification | running | `sess_xyz789` |
| `bg_def456` | Librarian: étudie les meilleures pratiques | running | `sess_uvwx012` |
| `bg_ghi789` | Oracle: examine la conception architecturale | pending | (not started) |

## Continue Instructions

To continue a cancelled task, use:

    delegate_task(session_id="<session_id>", prompt="Continue: <your follow-up>")

Continuable sessions:
- `sess_xyz789` (Explore: recherche l'implémentation d'authentification)
- `sess_uvwx012` (Librarian: étudie les meilleures pratiques)
```

## Point de contrôle ✅

Confirmez que vous avez compris les points suivants :

- [ ] Capable de lancer plusieurs tâches parallèles en arrière-plan
- [ ] Comprendre les états de tâche (pending, running, completed)
- [ ] Configurer des limites de concurrence raisonnables
- [ ] Capable de consulter et récupérer les résultats des tâches
- [ ] Capable d'annuler des tâches inutiles

## Pièges à éviter

### Piège 1 : Oublier de configurer les limites de concurrence

**Symptôme** : Lancer trop de tâches, épuiser instantanément le quota API, ou atteindre la limite de débit.

**Solution** : Configurer `providerConcurrency` ou `defaultConcurrency` dans `oh-my-opencode.json`.

### Piège 2 : Vérifier les résultats trop fréquemment

**Symptôme** : Appeler `background_output` toutes les quelques secondes pour vérifier l'état des tâches, augmentant les coûts inutiles.

**Solution** : Le système vous notifiera automatiquement lorsque la tâche est terminée. Ne vérifiez manuellement que lorsque vous avez vraiment besoin de résultats intermédiaires.

### Piège 3 : Timeout de tâche

**Symptôme** : La tâche est automatiquement annulée après avoir fonctionné plus de 30 minutes.

**Raison** : Les tâches en arrière-plan ont un TTL (temps d'expiration) de 30 minutes.

**Solution** : Si vous avez besoin de tâches de longue durée, envisagez de les diviser en plusieurs sous-tâches, ou utilisez `delegate_task(background=false)` pour une exécution en premier plan.

### Piège 4 : Les tâches Pending ne démarrent jamais

**Symptôme** : L'état de la tâche reste `pending`, ne passe jamais à `running`.

**Raison** : La limite de concurrence est atteinte, aucun slot disponible.

**Solution** :
- Attendre que les tâches existantes se terminent
- Augmenter la configuration de limite de concurrence
- Annuler les tâches inutiles pour libérer des slots

## Résumé de la leçon

Le système de tâches en arrière-plan vous permet de travailler comme une vraie équipe, avec plusieurs agents IA exécutant des tâches en parallèle :

1. **Lancer des tâches parallèles** : Utiliser l'outil `delegate_task`
2. **Contrôler la concurrence** : Configurer `providerConcurrency`, `modelConcurrency`, `defaultConcurrency`
3. **Récupérer les résultats** : Utiliser l'outil `background_output` (le système notifiera automatiquement)
4. **Annuler des tâches** : Utiliser l'outil `background_cancel`

**Règles fondamentales** :
- Vérification de l'état des tâches toutes les 2 secondes
- Tâche terminée après 3 vérifications stables consécutives ou idle
- Timeout automatique des tâches après 30 minutes
- Priorité : modelConcurrency > providerConcurrency > defaultConcurrency

## Aperçu de la prochaine leçon

> La prochaine leçon porte sur **[LSP et AST-Grep : Outils de refactoring de code](../lsp-ast-tools/)**.
>
> Vous apprendrez :
> - Comment utiliser les outils LSP pour la navigation et le refactoring de code
> - Comment utiliser AST-Grep pour la recherche et le remplacement de motifs précis
> - Meilleures pratiques pour combiner LSP et AST-Grep

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Gestionnaire de tâches en arrière-plan | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1378 |
| Contrôle de concurrence | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | 1-138 |
| Outil delegate_task | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 51-119 |
| Outil background_output | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 320-384 |
| Outil background_cancel | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 386-514 |

**Constantes clés** :
- `TASK_TTL_MS = 30 * 60 * 1000` : Temps d'expiration de la tâche (30 minutes)
- `MIN_STABILITY_TIME_MS = 10 * 1000` : Temps de démarrage de la détection de stabilité (10 secondes)
- `DEFAULT_STALE_TIMEOUT_MS = 180_000` : Temps d'expiration par défaut (3 minutes)
- `MIN_IDLE_TIME_MS = 5000` : Temps minimum pour ignorer les idle précoces (5 secondes)

**Classes clés** :
- `BackgroundManager` : Gestionnaire de tâches en arrière-plan, responsable du lancement, du suivi, du polling et de l'achèvement des tâches
- `ConcurrencyManager` : Gestionnaire de contrôle de concurrence, implémente la priorité à trois niveaux (model > provider > default)

**Fonctions clés** :
- `BackgroundManager.launch()` : Lancer une tâche en arrière-plan
- `BackgroundManager.pollRunningTasks()` : Vérifier l'état des tâches toutes les 2 secondes (ligne 1182)
- `BackgroundManager.tryCompleteTask()` : Terminer une tâche en toute sécurité, prévenir les conditions de concurrence (ligne 909)
- `ConcurrencyManager.getConcurrencyLimit()` : Obtenir la limite de concurrence (ligne 24)
- `ConcurrencyManager.acquire()` / `ConcurrencyManager.release()` : Acquérir/libérer un slot de concurrence (lignes 41, 71)

</details>
