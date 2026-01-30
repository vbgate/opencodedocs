---
title: "Options de Configuration Complètes : 30+ Paramètres Détaillés | Antigravity Auth"
sidebarTitle: "Personnaliser 30+ Paramètres"
subtitle: "Manuel de référence complet des options de configuration d'Antigravity Auth"
description: "Apprenez les 30+ options de configuration du plugin Antigravity Auth. Couvre les paramètres généraux, la récupération de session, les stratégies de sélection de compte, la limitation de débit, le rafraîchissement de jeton et les meilleures pratiques."
tags:
  - "Référence de Configuration"
  - "Configuration Avancée"
  - "Manuel Complet"
  - "Antigravity"
  - "OpenCode"
prerequisite:
  - "quick-install"
order: 1
---

# Manuel de Référence Complet des Options de Configuration d'Antigravity Auth

## Ce que vous apprendrez

- Trouver et modifier toutes les options de configuration du plugin Antigravity Auth
- Comprendre le rôle et les scénarios d'application de chaque paramètre
- Choisir la meilleure combinaison de configuration selon vos cas d'usage
- Remplacer les paramètres du fichier de configuration via des variables d'environnement

## Concept clé

Le plugin Antigravity Auth contrôle presque tous les comportements via le fichier de configuration : du niveau de journalisation à la stratégie de sélection de compte, de la récupération de session au mécanisme de rafraîchissement de jeton.

::: info Emplacement du fichier de configuration (par ordre de priorité)
1. **Configuration du projet** : `.opencode/antigravity.json`
2. **Configuration utilisateur** :
   - Linux/Mac : `~/.config/opencode/antigravity.json`
   - Windows : `%APPDATA%\opencode\antigravity.json`
:::

::: tip Priorité des variables d'environnement
Tous les paramètres de configuration peuvent être remplacés par des variables d'environnement, qui ont une priorité **supérieure** au fichier de configuration.
:::

## Vue d'ensemble de la configuration

| Catégorie | Nombre de paramètres | Scénarios principaux |
| --- | --- | --- |
| Paramètres généraux | 3 | Journalisation, mode débogage |
| Blocs de réflexion | 1 | Conservation du processus de réflexion |
| Récupération de session | 3 | Récupération automatique des erreurs |
| Cache de signature | 4 | Persistance de la signature des blocs de réflexion |
| Nouvelle tentative de réponse vide | 2 | Gestion des réponses vides |
| Récupération d'ID d'outil | 1 | Correspondance d'outils |
| Prévention des hallucinations d'outils | 1 | Prévention des erreurs de paramètres |
| Rafraîchissement de jeton | 3 | Mécanisme de rafraîchissement proactif |
| Limitation de débit | 5 | Rotation de compte et attente |
| Score de santé | 7 | Notation de la stratégie Hybrid |
| Jeton bucket | 3 | Jetons de la stratégie Hybrid |
| Mise à jour automatique | 1 | Mise à jour automatique du plugin |
| Recherche web | 2 | Recherche Gemini |

---

## Paramètres généraux

### `quiet_mode`

**Type** : `boolean`  
**Valeur par défaut** : `false`  
**Variable d'environnement** : `OPENCODE_ANTIGRAVITY_QUIET=1`

Supprime la plupart des notifications toast (limitation de débit, changement de compte, etc.). Les notifications de récupération (récupération de session réussie) sont toujours affichées.

**Scénarios d'application** :
- Scénarios d'utilisation multi-comptes à haute fréquence, pour éviter les interruptions fréquentes de notifications
- Utilisation dans des scripts automatisés ou des services en arrière-plan

**Exemple** :
```json
{
  "quiet_mode": true
}
```

### `debug`

**Type** : `boolean`  
**Valeur par défaut** : `false`  
**Variable d'environnement** : `OPENCODE_ANTIGRAVITY_DEBUG=1`

Active la journalisation de débogage dans un fichier. Les fichiers journaux sont stockés par défaut dans `~/.config/opencode/antigravity-logs/`.

**Scénarios d'application** :
- Activer lors du dépannage
- Fournir des journaux détaillés lors de la soumission de rapports de bugs

::: danger Les journaux de débogage peuvent contenir des informations sensibles
Les fichiers journaux contiennent des réponses API, des index de compte, etc. Veuillez anonymiser avant de les soumettre.
:::

### `log_dir`

**Type** : `string`  
**Valeur par défaut** : Répertoire de configuration spécifique à l'OS + `/antigravity-logs`  
**Variable d'environnement** : `OPENCODE_ANTIGRAVITY_LOG_DIR=/path/to/logs`

Personnalise le répertoire de stockage des journaux de débogage.

**Scénarios d'application** :
- Besoin de stocker les journaux dans un emplacement spécifique (comme un répertoire partagé réseau)
- Scripts de rotation et d'archivage des journaux

---

## Paramètres des blocs de réflexion

### `keep_thinking`

**Type** : `boolean`  
**Valeur par défaut** : `false`  
**Variable d'environnement** : `OPENCODE_ANTIGRAVITY_KEEP_THINKING=1`

::: warning Fonctionnalité expérimentale
Conserve les blocs de réflexion du modèle Claude (via le cache de signature).

**Description du comportement** :
- `false` (par défaut) : Supprime les blocs de réflexion pour éviter les erreurs de signature, priorité à la fiabilité
- `true` : Conserve le contexte complet (y compris les blocs de réflexion), mais peut rencontrer des erreurs de signature

**Scénarios d'application** :
- Besoin de voir le processus de raisonnement complet du modèle
- Utilisation fréquente du contenu de réflexion dans les conversations

**Scénarios non recommandés** :
- Environnement de production (priorité à la fiabilité)
- Conversations multi-tours (facile de déclencher des conflits de signature)

::: tip Utiliser avec `signature_cache`
Lors de l'activation de `keep_thinking`, il est recommandé de configurer également `signature_cache` pour améliorer le taux de réussite de signature.
:::

---

## Récupération de session

### `session_recovery`

**Type** : `boolean`  
**Valeur par défaut** : `true`

Récupère automatiquement la session à partir de l'erreur `tool_result_missing`. Lorsqu'activé, une notification toast s'affiche en cas d'erreur récupérable.

**Types d'erreurs récupérées** :
- `tool_result_missing` : Résultat d'outil manquant (interruption ESC, timeout, crash)
- `Expected thinking but found text` : Erreur d'ordre des blocs de réflexion

**Scénarios d'application** :
- Tous les scénarios utilisant des outils (activation recommandée par défaut)
- Conversations longues ou exécution fréquente d'outils

### `auto_resume`

**Type** : `boolean`  
**Valeur par défaut** : `false`

Envoie automatiquement l'invite "continue" pour récupérer la session. Prend effet uniquement lorsque `session_recovery` est activé.

**Description du comportement** :
- `false` : Affiche uniquement une notification toast, l'utilisateur doit envoyer manuellement "continue"
- `true` : Envoie automatiquement "continue" pour poursuivre la session

**Scénarios d'application** :
- Scripts automatisés ou scénarios sans surveillance
- Souhait d'automatiser complètement le processus de récupération

**Scénarios non recommandés** :
- Besoin de confirmation manuelle des résultats de récupération
- Besoin de vérifier l'état après interruption de l'exécution d'outil avant de continuer

### `resume_text`

**Type** : `string`  
**Valeur par défaut** : `"continue"`

Texte personnalisé envoyé lors de la récupération automatique. Utilisé uniquement lorsque `auto_resume` est activé.

**Scénarios d'application** :
- Environnements multilingues (par exemple, changer en "continuer", "veuillez continuer")
- Scénarios nécessitant des invites supplémentaires

**Exemple** :
```json
{
  "auto_resume": true,
  "resume_text": "Veuillez continuer la tâche précédente"
}
```

---

## Cache de signature

> Prend effet uniquement lorsque `keep_thinking` est activé

### `signature_cache.enabled`

**Type** : `boolean`  
**Valeur par défaut** : `true`

Active la mise en cache sur disque des signatures de blocs de réflexion.

**Rôle** : La mise en cache des signatures évite les erreurs causées par des signatures répétées dans les conversations multi-tours.

### `signature_cache.memory_ttl_seconds`

**Type** : `number` (plage : 60-86400)  
**Valeur par défaut** : `3600` (1 heure)

Durée d'expiration du cache mémoire (secondes).

### `signature_cache.disk_ttl_seconds`

**Type** : `number` (plage : 3600-604800)  
**Valeur par défaut** : `172800` (48 heures)

Durée d'expiration du cache disque (secondes).

### `signature_cache.write_interval_seconds`

**Type** : `number` (plage : 10-600)  
**Valeur par défaut** : `60`

Intervalle d'écriture en arrière-plan sur le disque (secondes).

**Exemple** :
```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  }
}
```

---

## Nouvelle tentative de réponse vide

Réessaye automatiquement lorsque Antigravity renvoie une réponse vide (sans candidates/choices).

### `empty_response_max_attempts`

**Type** : `number` (plage : 1-10)  
**Valeur par défaut** : `4`

Nombre maximum de tentatives.

### `empty_response_retry_delay_ms`

**Type** : `number` (plage : 500-10000)  
**Valeur par défaut** : `2000` (2 secondes)

Délai entre chaque tentative (millisecondes).

**Scénarios d'application** :
- Environnement réseau instable (augmenter le nombre de tentatives)
- Besoin d'échec rapide (réduire le nombre de tentatives et le délai)

---

## Récupération d'ID d'outil

### `tool_id_recovery`

**Type** : `boolean`  
**Valeur par défaut** : `true`

Active la récupération d'ID d'outil orphelin. Lorsque l'ID de réponse d'outil ne correspond pas (en raison de la compression du contexte), tente de faire correspondre par nom de fonction ou de créer un espace réservé.

**Rôle** : Améliore la fiabilité des appels d'outils dans les conversations multi-tours.

**Scénarios d'application** :
- Scénarios de conversations longues (activation recommandée)
- Scénarios d'utilisation fréquente d'outils

---

## Prévention des hallucinations d'outils

### `claude_tool_hardening`

**Type** : `boolean`  
**Valeur par défaut** : `true`

Active la prévention des hallucinations d'outils pour les modèles Claude. Lorsqu'activé, injecte automatiquement :
- Signature de paramètres dans la description de l'outil
- Instructions système strictes pour l'utilisation des outils

**Rôle** : Empêche Claude d'utiliser des noms de paramètres provenant des données d'entraînement plutôt que du schéma réel.

**Scénarios d'application** :
- Utilisation de plugins MCP ou d'outils personnalisés (activation recommandée)
- Schéma d'outil complexe

**Scénarios non recommandés** :
- Confirmation que les appels d'outils sont entièrement conformes au schéma (peut être désactivé pour réduire les invites supplémentaires)

---

## Rafraîchissement proactif de jeton

### `proactive_token_refresh`

**Type** : `boolean`  
**Valeur par défaut** : `true`

Active le rafraîchissement proactif de jeton en arrière-plan. Lorsqu'activé, les jetons sont automatiquement rafraîchis avant expiration, garantissant que les requêtes ne sont pas bloquées par le rafraîchissement de jeton.

**Rôle** : Évite le délai d'attente du rafraîchissement de jeton pour les requêtes.

### `proactive_refresh_buffer_seconds`

**Type** : `number` (plage : 60-7200)  
**Valeur par défaut** : `1800` (30 minutes)

Combien de temps avant l'expiration du jeton déclencher le rafraîchissement proactif (secondes).

### `proactive_refresh_check_interval_seconds`

**Type** : `number` (plage : 30-1800)  
**Valeur par défaut** : `300` (5 minutes)

Intervalle de vérification du rafraîchissement proactif (secondes).

**Scénarios d'application** :
- Scénarios de requêtes à haute fréquence (activation recommandée du rafraîchissement proactif)
- Souhait de réduire le risque d'échec de rafraîchissement (augmenter le temps de buffer)

---

## Limitation de débit et sélection de compte

### `max_rate_limit_wait_seconds`

**Type** : `number` (plage : 0-3600)  
**Valeur par défaut** : `300` (5 minutes)

Temps d'attente maximum lorsque tous les comptes sont limités en débit (secondes). Si le temps d'attente minimum de tous les comptes dépasse ce seuil, le plugin échouera rapidement au lieu de se bloquer.

**Définir à 0** : Désactive le timeout, attente indéfinie.

**Scénarios d'application** :
- Scénarios nécessitant un échec rapide (réduire le temps d'attente)
- Scénarios acceptant une longue attente (augmenter le temps d'attente)

### `quota_fallback`

**Type** : `boolean`  
**Valeur par défaut** : `false`

Active le repli de quota pour les modèles Gemini. Lorsque le pool de quota préféré (Gemini CLI ou Antigravity) est épuisé, tente le pool de quota de secours du même compte.

**Scénarios d'application** :
- Utilisation à haute fréquence des modèles Gemini (activation recommandée)
- Souhait de maximiser l'utilisation du quota de chaque compte

::: tip Prend effet uniquement lorsque le suffixe de quota n'est pas explicitement spécifié
Si le nom du modèle inclut explicitement `:antigravity` ou `:gemini-cli`, le pool de quota spécifié sera toujours utilisé, sans repli.
:::

### `account_selection_strategy`

**Type** : `string` (énumération : `sticky`, `round-robin`, `hybrid`)  
**Valeur par défaut** : `"hybrid"`  
**Variable d'environnement** : `OPENCODE_ANTIGRAVITY_ACCOUNT_SELECTION_STRATEGY`

Stratégie de sélection de compte.

| Stratégie | Description | Scénarios d'application |
| --- | --- | --- |
| `sticky` | Utilise le même compte jusqu'à limitation de débit, conserve le cache d'invite | Session unique, scénarios sensibles au cache |
| `round-robin` | Rotation vers le compte suivant à chaque requête, maximise le débit | Scénarios multi-comptes à haut débit |
| `hybrid` | Sélection déterministe basée sur le score de santé + jeton bucket + LRU | Recommandé en général, équilibre performance et fiabilité |

::: info Description détaillée
Voir le chapitre [Stratégies de sélection de compte](/fr/NoeFabris/opencode-antigravity-auth/advanced/account-selection-strategies/).
:::

### `pid_offset_enabled`

**Type** : `boolean`  
**Valeur par défaut** : `false`  
**Variable d'environnement** : `OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1`

Active le décalage de compte basé sur le PID. Lorsqu'activé, différentes sessions (PIDs) privilégieront différents comptes de départ, aidant à répartir la charge lors de l'exécution de plusieurs agents parallèles.

**Description du comportement** :
- `false` (par défaut) : Toutes les sessions commencent à partir du même index de compte, conserve le cache d'invite Anthropic (recommandé pour une session unique)
- `true` : Décale le compte de départ en fonction du PID, répartit la charge (recommandé pour plusieurs sessions parallèles)

**Scénarios d'application** :
- Exécution de plusieurs sessions OpenCode parallèles
- Utilisation de sous-agents ou de tâches parallèles

### `switch_on_first_rate_limit`

**Type** : `boolean`  
**Valeur par défaut** : `true`

Change immédiatement de compte lors de la première limitation de débit (après un délai de 1 seconde). Lorsque désactivé, réessaye d'abord le même compte, ne change qu'à la deuxième limitation de débit.

**Scénarios d'application** :
- Souhait de changer rapidement de compte (activation recommandée)
- Souhait de maximiser le quota d'un seul compte (désactiver)

---

## Score de santé (Stratégie Hybrid)

> Prend effet uniquement lorsque `account_selection_strategy` est `hybrid`

### `health_score.initial`

**Type** : `number` (plage : 0-100)  
**Valeur par défaut** : `70`

Score de santé initial du compte.

### `health_score.success_reward`

**Type** : `number` (plage : 0-10)  
**Valeur par défaut** : `1`

Score de santé ajouté pour chaque requête réussie.

### `health_score.rate_limit_penalty`

**Type** : `number` (plage : -50-0)  
**Valeur par défaut** : `-10`

Score de santé déduit pour chaque limitation de débit.

### `health_score.failure_penalty`

**Type** : `number` (plage : -100-0)  
**Valeur par défaut** : `-20`

Score de santé déduit pour chaque échec.

### `health_score.recovery_rate_per_hour`

**Type** : `number` (plage : 0-20)  
**Valeur par défaut** : `2`

Score de santé récupéré par heure.

### `health_score.min_usable`

**Type** : `number` (plage : 0-100)  
**Valeur par défaut** : `50`

Seuil de score de santé minimum pour qu'un compte soit utilisable.

### `health_score.max_score`

**Type** : `number` (plage : 50-100)  
**Valeur par défaut** : `100`

Limite supérieure du score de santé.

**Scénarios d'application** :
- La configuration par défaut convient à la plupart des scénarios
- Dans un environnement de limitation de débit à haute fréquence, peut réduire `rate_limit_penalty` ou augmenter `recovery_rate_per_hour`
- Pour un changement de compte plus rapide, peut réduire `min_usable`

**Exemple** :
```json
{
  "account_selection_strategy": "hybrid",
  "health_score": {
    "initial": 80,
    "success_reward": 2,
    "rate_limit_penalty": -5,
    "failure_penalty": -15,
    "recovery_rate_per_hour": 5,
    "min_usable": 40,
    "max_score": 100
  }
}
```

---

## Jeton bucket (Stratégie Hybrid)

> Prend effet uniquement lorsque `account_selection_strategy` est `hybrid`

### `token_bucket.max_tokens`

**Type** : `number` (plage : 1-1000)  
**Valeur par défaut** : `50`

Capacité maximale du jeton bucket.

### `token_bucket.regeneration_rate_per_minute`

**Type** : `number` (plage : 0.1-60)  
**Valeur par défaut** : `6`

Nombre de jetons générés par minute.

### `token_bucket.initial_tokens`

**Type** : `number` (plage : 1-1000)  
**Valeur par défaut** : `50`

Nombre de jetons initiaux du compte.

**Scénarios d'application** :
- Les scénarios de requêtes à haute fréquence peuvent augmenter `max_tokens` et `regeneration_rate_per_minute`
- Pour une rotation de compte plus rapide, peut réduire `initial_tokens`

---

## Mise à jour automatique

### `auto_update`

**Type** : `boolean`  
**Valeur par défaut** : `true`

Active la mise à jour automatique du plugin.

**Scénarios d'application** :
- Souhait d'obtenir automatiquement les dernières fonctionnalités (activation recommandée)
- Besoin d'une version fixe (désactiver)

---

## Recherche web (Gemini Grounding)

### `web_search.default_mode`

**Type** : `string` (énumération : `auto`, `off`)  
**Valeur par défaut** : `"off"`

Mode par défaut de la recherche web (lorsque non spécifié via variant).

| Mode | Description |
| --- | --- |
| `auto` | Le modèle décide quand rechercher (récupération dynamique) |
| `off` | Recherche désactivée par défaut |

### `web_search.grounding_threshold`

**Type** : `number` (plage : 0-1)  
**Valeur par défaut** : `0.3`

Seuil de récupération dynamique (0.0 à 1.0). Plus la valeur est élevée, moins le modèle recherche fréquemment (nécessite une confiance plus élevée pour déclencher une recherche). Prend effet uniquement en mode `auto`.

**Scénarios d'application** :
- Réduire les recherches inutiles (augmenter le seuil, par exemple 0.5)
- Encourager le modèle à rechercher davantage (réduire le seuil, par exemple 0.2)

**Exemple** :
```json
{
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.4
  }
}
```

---

## Exemples de configuration

### Configuration de base mono-compte

```json
{
  "quiet_mode": false,
  "debug": false,
  "keep_thinking": false,
  "session_recovery": true,
  "auto_resume": false,
  "account_selection_strategy": "sticky"
}
```

### Configuration haute performance multi-comptes

```json
{
  "quiet_mode": true,
  "debug": false,
  "session_recovery": true,
  "auto_resume": true,
  "account_selection_strategy": "hybrid",
  "quota_fallback": true,
  "switch_on_first_rate_limit": true,
  "max_rate_limit_wait_seconds": 120,
  "health_score": {
    "initial": 70,
    "min_usable": 40
  },
  "token_bucket": {
    "max_tokens": 100,
    "regeneration_rate_per_minute": 10
  }
}
```

### Configuration de débogage et diagnostic

```json
{
  "debug": true,
  "log_dir": "/tmp/antigravity-logs",
  "quiet_mode": false,
  "session_recovery": true,
  "auto_resume": true,
  "tool_id_recovery": true
}
```

### Configuration de conservation des blocs de réflexion

```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  },
  "session_recovery": true
}
```

---

## Questions fréquentes

### Q : Comment désactiver temporairement un paramètre ?

**R** : Utilisez des variables d'environnement pour remplacer, sans modifier le fichier de configuration.

```bash
# Activer temporairement le mode débogage
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode

# Activer temporairement le mode silencieux
OPENCODE_ANTIGRAVITY_QUIET=1 opencode
```

### Q : Faut-il redémarrer OpenCode après modification du fichier de configuration ?

**R** : Oui, le fichier de configuration est chargé au démarrage d'OpenCode, un redémarrage est nécessaire après modification.

### Q : Comment vérifier si la configuration est effective ?

**R** : Activez le mode `debug`, vérifiez les informations de chargement de configuration dans le fichier journal.

```json
{
  "debug": true
}
```

Le journal affichera la configuration chargée :
```
[config] Loaded configuration: {...}
```

### Q : Quels paramètres nécessitent le plus souvent des ajustements ?

**R** :
- `account_selection_strategy` : Choisir la stratégie appropriée pour les scénarios multi-comptes
- `quiet_mode` : Réduire les interruptions de notifications
- `session_recovery` / `auto_resume` : Contrôler le comportement de récupération de session
- `debug` : Activer lors du dépannage

### Q : Le fichier de configuration a-t-il une validation de schéma JSON ?

**R** : Oui, ajouter le champ `$schema` dans le fichier de configuration active l'autocomplétion et la validation IDE :

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  ...
}
```

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition du schéma de configuration | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 1-373 |
| Schéma JSON | [`assets/antigravity.schema.json`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/assets/antigravity.schema.json) | 1-157 |
| Chargement de configuration | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | - |

**Constantes clés** :
- `DEFAULT_CONFIG` : Objet de configuration par défaut (`schema.ts:328-372`)

**Types clés** :
- `AntigravityConfig` : Type de configuration principal (`schema.ts:322`)
- `SignatureCacheConfig` : Type de configuration du cache de signature (`schema.ts:323`)
- `AccountSelectionStrategy` : Type de stratégie de sélection de compte (`schema.ts:22`)

</details>
