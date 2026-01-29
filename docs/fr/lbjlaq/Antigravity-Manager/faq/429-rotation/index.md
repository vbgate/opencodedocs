---
title: "429 Troubleshooting: Rotation des comptes et gestion des erreurs | Antigravity-Manager"
sidebarTitle: "Erreur 429 : Rotation automatique des comptes"
subtitle: "429 Troubleshooting: Rotation des comptes et gestion des erreurs"
description: "Apprenez à résoudre les erreurs 429 avec Antigravity Tools. Maîtrisez l'identification et le traitement des erreurs QUOTA_EXHAUSTED et RATE_LIMIT_EXCEEDED, utilisez Monitor et X-Account-Email pour localiser rapidement les problèmes."
tags:
  - "FAQ"
  - "Dépannage"
  - "Planification des comptes"
  - "Erreur 429"
prerequisite:
  - "start-getting-started"
  - "advanced-scheduling"
order: 3
---
# 429/Erreur de capacité : Attentes correctes pour la rotation des comptes et méprise sur l'épuisement de la capacité du modèle

## Ce que vous saurez faire à la fin

- Distinguer correctement « quota insuffisant » et « limitation en amont » pour éviter les mauvaises interprétations
- Comprendre le mécanisme de rotation automatique et le comportement attendu d'Antigravity Tools
- Savoir localiser rapidement les problèmes et optimiser la configuration lors d'erreurs 429

## Votre situation actuelle

- Voir une erreur 429 et penser à tort que « le modèle n'a plus de capacité »
- Avoir configuré plusieurs comptes mais continuer à rencontrer fréquemment des erreurs 429, sans savoir s'il s'agit d'un problème de configuration ou de compte
- Ne pas savoir quand le système bascule automatiquement vers un autre compte et quand il « bloque »

## Idée principale

### Qu'est-ce qu'une erreur 429 ?

**429 Too Many Requests** est un code d'état HTTP. Dans Antigravity Tools, 429 ne signifie pas seulement « trop de requêtes », mais peut aussi signaler « quota épuisé », « surcharge temporaire du modèle » et d'autres types de « vous ne pouvez pas utiliser pour le moment ».

::: info Le proxy essaie d'identifier la cause de l'erreur 429

Le proxy essaie d'analyser `error.details[0].reason` ou `error.message` depuis le corps de la réponse, divisant grossièrement les 429 en plusieurs catégories (selon ce qui est réellement renvoyé) :

| Type identifié par le proxy | Reason / indice courant | Caractéristique typique |
|--- | --- | ---|
| **Quota épuisé** | `QUOTA_EXHAUSTED` / texte contenant `exhausted`, `quota` | Peut nécessiter d'attendre le rafraîchissement du quota |
| **Limite de taux** | `RATE_LIMIT_EXCEEDED` / texte contenant `per minute`, `rate limit`, `too many requests` | Généralement un refroidissement de quelques dizaines de secondes |
| **Capacité de modèle insuffisante** | `MODEL_CAPACITY_EXHAUSTED` / texte contenant `model_capacity` | Souvent une surcharge temporaire, récupérable plus tard |
| **Inconnu** | Impossible d'analyser | Utilise la stratégie de refroidissement par défaut |

:::

### Traitement automatique par Antigravity Tools

Lorsqu'une requête rencontre une erreur 429 (et certains états 5xx/surcharge), le proxy fait généralement deux choses côté serveur :

1. **Enregistrer le temps de refroidissement** : écrire cette erreur dans `RateLimitTracker`, les sélections de compte ultérieures éviteront activement les comptes « encore en refroidissement ».
2. **Rotation du compte dans les tentatives** : les Handlers feront plusieurs tentatives au sein d'une seule requête, lors de la nouvelle tentative avec `force_rotate=true`, déclenchant ainsi TokenManager pour sélectionner le compte disponible suivant.

::: tip Comment savoir si le compte a été changé ?
Même si le corps de votre requête ne change pas, la réponse inclut généralement `X-Account-Email` (ainsi que `X-Mapped-Model`), vous pouvez l'utiliser pour vérifier « quel compte a réellement été utilisé pour cette requête ».
:::

## Quand rencontrerez-vous des erreurs 429 ?

### Scénario 1 : Requêtes trop rapides sur un seul compte

**Phénomène** : même avec un seul compte, l'envoi d'un grand nombre de requêtes dans un court laps de temps déclenche 429.

**Cause** : chaque compte a ses propres limites de taux (RPM/TPM), dépasser entraîne une limitation.

**Solution** :
- Augmenter le nombre de comptes
- Réduire la fréquence des requêtes
- Utiliser le mode de compte fixe pour disperser la pression (voir « Mode de compte fixe »)

### Scénario 2 : Tous les comptes limités simultanément

**Phénomène** : plusieurs comptes, mais tous renvoient 429.

**Cause** :
- Le nombre total de comptes est insuffisant pour supporter votre fréquence de requêtes
- Tous les comptes déclenchent la limitation/surcharge presque simultanément

**Solution** :
- Ajouter plus de comptes
- Ajuster le mode de planification en « Performance优先 » (sauter la session sticky et la réutilisation de fenêtre 60s)
- Vérifier si la protection du quota exclut par erreur des comptes disponibles

### Scénario 3 : Compte mal identifié par la protection du quota

**Phénomène** : le quota d'un compte est très suffisant, mais le système continue de le sauter.

**Cause** :
- La **protection du quota** est activée, le seuil est trop élevé
- Le quota de modèle spécifique de ce compte est inférieur au seuil
- Le compte est manuellement marqué comme `proxy_disabled`

**Solution** :
- Vérifier les paramètres de protection du quota (Settings → Quota Protection), ajuster le seuil et les modèles surveillés selon votre intensité d'utilisation
- Dans les données du compte, vérifier `protected_models`, confirmer si il est sauté par la stratégie de protection

## Suivez-moi

### Étape 1 : Identifier le type d'erreur 429

**Pourquoi** : différents types d'erreurs 429 nécessitent des méthodes de traitement différentes.

Dans Proxy Monitor, examinez le corps de réponse des erreurs 429, concentrez-vous sur deux types d'informations :

- **Raison** : `error.details[0].reason` (par exemple `RATE_LIMIT_EXCEEDED`, `QUOTA_EXHAUSTED`) ou `error.message`
- **Temps d'attente** : `RetryInfo.retryDelay` ou `details[0].metadata.quotaResetDelay` (si présent)

```json
{
  "error": {
    "details": [
      {
        "reason": "RATE_LIMIT_EXCEEDED",
        "metadata": {
          "quotaResetDelay": "42s"
        }
      }
    ]
  }
}
```

**Ce que vous devriez voir** :
- Si le temps d'attente peut être trouvé dans le corps de la réponse (par exemple `RetryInfo.retryDelay` ou `quotaResetDelay`), le proxy attendra généralement un court moment avant de réessayer.
- S'il n'y a pas de temps d'attente, le proxy appliquera une période de « refroidissement » selon la stratégie intégrée, et passera directement au compte suivant lors de la nouvelle tentative.

### Étape 2 : Vérifier la configuration de la planification des comptes

**Pourquoi** : la configuration de la planification affecte directement la fréquence et la priorité de la rotation des comptes.

Accédez à la page **API Proxy**, consultez la stratégie de planification :

| Élément de configuration | Description | Valeur par défaut/suggestion |
|--- | --- | ---|
| **Scheduling Mode** | Mode de planification | `Balance` (par défaut) |
| **Preferred Account** | Mode de compte fixe | Non sélectionné (par défaut) |

**Comparaison des modes de planification** :

| Mode | Stratégie de réutilisation de compte | Traitement de la limitation | Scénario applicable |
|--- | --- | --- | ---|
| **CacheFirst** | Active session sticky et réutilisation de fenêtre 60s | **Attend en priorité**, améliore considérablement le taux de succès du Prompt Caching | Conversation/taux de succès du cache élevé |
| **Balance** | Active session sticky et réutilisation de fenêtre 60s | **Bascule immédiatement** vers le compte de secours, équilibre taux de succès et performance | Scénario général, par défaut |
| **PerformanceFirst** | Saute session sticky et réutilisation de fenêtre 60s, mode round-robin pur | Bascule immédiatement, répartition de charge la plus équilibrée | Haute concurrence, requêtes sans état |

::: tip Cache prioritaire vs mode équilibré
Si vous utilisez Prompt Caching et souhaitez améliorer le taux de succès du cache, choisissez `CacheFirst` — en cas de limitation, il attendra plutôt que de basculer immédiatement. Si vous privilégiez le taux de succès des requêtes plutôt que le cache, choisissez `Balance` — en cas de limitation, il basculera immédiatement.
:::

::: tip Mode Performance优先
Si vos requêtes sont sans état (comme la génération d'images, requêtes indépendantes), essayez `PerformanceFirst`. Il sautera la session sticky et la réutilisation de fenêtre 60s, facilitant la répartition sur différents comptes pour les requêtes consécutives.
:::

### Étape 3 : Vérifier si la rotation des comptes fonctionne normalement

**Pourquoi** : confirmer que le système peut basculer automatiquement vers d'autres comptes.

**Méthode 1 : Regarder les en-têtes de réponse**

Utilisez curl ou votre propre client pour imprimer les en-têtes de réponse, observez si `X-Account-Email` change.

**Méthode 2 : Vérifier les journaux**

Ouvrez le fichier de journal (selon l'emplacement de votre système), recherchez `🔄 [Token Rotation]` :

```
🔄 [Token Rotation] Accounts: [
  "account1@example.com(protected=[])",
  "account2@example.com(protected=[])",
  "account3@example.com(protected=[])"
]
```

**Méthode 3 : Utiliser Proxy Monitor**

Dans la page **Monitor**, consultez les journaux de requêtes, concentrez-vous sur :
- Le champ **Account** bascule-t-il entre différents comptes
- Après les requêtes avec **Status** 429, y a-t-il des requêtes réussies utilisant des comptes différents

**Ce que vous devriez voir** :
- Lorsqu'un compte renvoie 429, les requêtes suivantes basculent automatiquement vers d'autres comptes
- Si vous voyez plusieurs requêtes utilisant le même compte et échouant toutes, cela peut être un problème de configuration de planification

### Étape 4 : Optimiser la priorité des comptes

**Pourquoi** : faire utiliser au système les comptes avec quota élevé/niveau élevé en priorité, réduisant la probabilité de 429.

Dans TokenManager, le système effectuera un tri du pool de comptes avant de sélectionner un compte (imprimera `🔄 [Token Rotation] Accounts: ...`) :

1. **Priorité du niveau d'abonnement** : ULTRA > PRO > FREE
2. **Priorité du pourcentage de quota** : même niveau, quota élevé en premier
3. **Point d'entrée du tri** : ce tri se produit côté proxy, le compte finalement utilisé dépend du tri côté proxy + jugement de disponibilité.

::: info Principe du tri intelligent (côté proxy)
La priorité est `ULTRA > PRO > FREE` ; même niveau d'abonnement, tri par `remaining_quota` (pourcentage de quota restant maximum du compte) décroissant.
:::

**Action** :
- Faites glisser les comptes pour ajuster l'ordre d'affichage (optionnel)
- Rafraîchir les quotas (Accounts → Rafraîchir tous les quotas)
- Vérifier le niveau d'abonnement et le quota des comptes

## Attention aux pièges

### ❌ Erreur 1 : Confondre 429 avec « le modèle n'a plus de capacité »

**Phénomène** : voir une erreur 429 et penser que le modèle n'a plus de capacité.

**Compréhension correcte** :
- 429 est une **limitation**, pas un problème de capacité
- Augmenter le nombre de comptes peut réduire la probabilité de 429
- Ajuster le mode de planification peut améliorer la vitesse de basculement

### ❌ Erreur 2 : Seuil de protection du quota trop élevé

**Phénomène** : quota suffisant mais le système continue de sauter les comptes.

**Cause** : Quota Protection ajoute les modèles sous le seuil dans `protected_models` du compte, le proxy sautera « les modèles protégés » lors de la planification. Si le seuil est trop élevé, cela peut entraîner une exclusion excessive de comptes disponibles.

**Correction** :
- Retournez à **Settings → Quota Protection**, ajustez les modèles surveillés et le seuil
- Si vous voulez savoir quels modèles sont protégés, regardez `protected_models` dans les données du compte

### ❌ Erreur 3 : Mode de compte fixe empêchant la rotation

**Phénomène** : configuration de `Preferred Account`, mais le système « bloque » après la limitation de ce compte.

**Cause** : en mode de compte fixe, le système utilise prioritairement le compte spécifié, ne bascule vers round-robin que lorsque le compte n'est pas disponible.

**Correction** :
- Si vous n'avez pas besoin de compte fixe, videz `Preferred Account`
- Ou assurez-vous que le quota du compte fixe est suffisant pour éviter la limitation

## Points de contrôle ✅

- [ ] Pouvez distinguer quota insuffisant et limitation en amont
- [ ] Savez comment consulter les détails des erreurs 429 dans Proxy Monitor
- [ ] Comprenez la différence entre les trois modes de planification et leurs scénarios d'utilisation
- [ ] Savez comment vérifier si la rotation des comptes fonctionne normalement
- [ ] Pouvez optimiser la priorité des comptes et vérifier la stratégie de protection du quota

## Questions fréquentes

### Q1 : Pourquoi j'ai plusieurs comptes mais rencontre toujours des 429 ?

A : Causes possibles :
1. Tous les comptes déclenchent la limitation simultanément (fréquence de requêtes trop élevée)
2. Les requêtes consécutives réutilisent le même compte sous « réutilisation de fenêtre 60s », facilitant l'atteinte de la limitation sur un seul compte
3. La protection du quota exclut par erreur les comptes disponibles
4. Le nombre total de comptes est insuffisant pour supporter votre fréquence de requêtes

**Solution** :
- Ajouter plus de comptes
- Utiliser le mode `PerformanceFirst`
- Vérifier si Quota Protection a ajouté le modèle que vous utilisez dans `protected_models` (si nécessaire, ajustez les modèles surveillés et le seuil)
- Réduire la fréquence des requêtes

### Q2 : Les erreurs 429 sont-elles réessayées automatiquement ?

A : Elles sont réessayées automatiquement au sein d'une seule requête. **La limite de tentatives est généralement 3 fois**, le calcul spécifique est `min(3, taille du pool de comptes)`, et au moins 1 tentative.

**Exemple de nombre de tentatives** :
- Pool de 1 compte → 1 tentative (pas de nouvelle tentative)
- Pool de 2 comptes → 2 tentatives (1 nouvelle tentative)
- Pool de 3 ou plus de comptes → 3 tentatives (2 nouvelles tentatives)

**Processus approximatif** :
1. Enregistrer les informations de limitation/surcharge (entrer dans `RateLimitTracker`)
2. Si le temps d'attente peut être analysé (par exemple `RetryInfo.retryDelay` / `quotaResetDelay`), attendez un court moment avant de continuer
3. Lors de la nouvelle tentative, forcer la rotation du compte (`force_rotate=true` quand `attempt > 0`), essayer d'initier la requête en amont avec le compte disponible suivant

Si toutes les tentatives échouent, le proxy renverra l'erreur au client ; en même temps, vous pouvez toujours voir les comptes réellement utilisés à partir des en-têtes de réponse (comme `X-Account-Email`) ou Proxy Monitor.

### Q3 : Comment vérifier pendant combien de temps un compte a été limité ?

A : Deux façons :

**Méthode 1** : Vérifier les journaux, rechercher `rate-limited`

```
🔒 [FIX #820] Preferred account xxx@gmail.com is rate-limited, falling back to round-robin
```

**Méthode 2** : Le journal affichera le temps d'attente restant

```
All accounts are currently limited. Please wait 30s.
```

### Q4 : Protection du quota et limitation sont-elles la même chose ?

A : Non.

| Caractéristique | Protection du quota | Suivi de la limitation |
|--- | --- | ---|
| **Condition de déclenchement** | Quota de modèle sous le seuil | Réception d'une erreur 429 |
| **Portée** | Modèle spécifique | Compte entier |
| **Durée** | Jusqu'à récupération du quota | Décidé par l'amont (généralement quelques secondes à quelques minutes) |
| **Comportement** | Sauter ce modèle | Sauter ce compte |

### Q5 : Comment forcer le basculement immédiat du compte ?

A : Commencez par « faciliter le changement de compte pour la prochaine requête » :

1. **Niveau de planification** : passez en `PerformanceFirst`, sautez session sticky et réutilisation de fenêtre 60s
2. **Compte fixe** : si `Preferred Account` est activé, videz-le d'abord, sinon il utilisera prioritairement le compte fixe (jusqu'à limitation/protection)
3. **Pool de comptes** : augmentez le nombre de comptes, facilitant la recherche de compte de remplacement lors de la limitation d'un compte

Dans une seule requête, le proxy forcera également la rotation lors de la nouvelle tentative (`attempt > 0` déclenchera `force_rotate=true`), mais le nombre de tentatives est soumis à la limite.

## Résumé de la leçon

- 429 dans Antigravity Tools est un signal « temporairement indisponible en amont », pouvant être causé par la limitation de taux, l'épuisement du quota, l'insuffisance de capacité du modèle, etc.
- Le proxy enregistre le temps de refroidissement et essaie de faire pivoter les comptes lors des nouvelles tentatives au sein d'une seule requête (mais le nombre de tentatives est limité)
- Le mode de planification, Quota Protection et le nombre de comptes affectent tous la probabilité et la vitesse de récupération des erreurs 429
- Proxy Monitor, les en-têtes de réponse `X-Account-Email` et les journaux peuvent localiser rapidement les problèmes

## Prochaine leçon

> La prochaine leçon, nous apprendrons **[404/Incompatibilité de chemin : Base URL, préfixe /v1 et clients « double chemin »](../404-base-url/)**.
>
> Vous apprendrez :
> - Comment l'erreur d'intégration la plus courante (404) se produit
> - Différences de concaténation base_url entre différents clients
> - Comment corriger rapidement les problèmes 404

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Heure de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Analyse du délai de nouvelle tentative 429 (RetryInfo / quotaResetDelay) | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L38-L67) | 38-67 |
| Outil d'analyse Duration | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L11-L35) | 11-35 |
| Énumération du mode de planification (CacheFirst/Balance/PerformanceFirst) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L12) | 3-12 |
| Analyse de la raison de limitation et stratégie de refroidissement par défaut | [`src-tauri/src/proxy/rate_limit.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/rate_limit.rs#L5-L258) | 5-258 |
| Définition de constante MAX_RETRY_ATTEMPTS (handler OpenAI) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L14) | 14 |
| Calcul du nombre de tentatives (max_attempts = min(MAX_RETRY_ATTEMPTS, pool_size)) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L830) | 830 |
| Handler OpenAI : marquer limitation et réessayer/pivot lors de 429/5xx | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L349-L389) | 349-389 |
| Priorité de tri des comptes (ULTRA > PRO > FREE + remaining_quota) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L504-L538) | 504-538 |
| Réutilisation de fenêtre 60s + éviter limitation/protection du quota | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L624-L739) | 624-739 |
| Point d'entrée d'enregistrement de limitation (mark_rate_limited) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1089-L1113) | 1089-1113 |
| Verrouillage précis 429 / rafraîchissement de quota en temps réel / stratégie de dégradation (mark_rate_limited_async) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1258-L1417) | 1258-1417 |

**Constantes clés** :
- `MAX_RETRY_ATTEMPTS = 3` : nombre maximum de nouvelles tentatives au sein d'une seule requête (handler OpenAI/Gemini)
- `60` : réutilisation de fenêtre 60 secondes (activée uniquement dans les modes autres que `PerformanceFirst`)
- `5` : délai d'expiration de récupération de token (secondes)
- `300` : seuil de rafraîchissement anticipé de token (secondes, 5 minutes)

**Fonctions clés** :
- `parse_retry_delay()` : extraire le délai de nouvelle tentative de la réponse d'erreur 429
- `get_token_internal()` : logique principale de sélection et rotation de compte
- `mark_rate_limited()` : marquer le compte comme état de limitation

</details>
