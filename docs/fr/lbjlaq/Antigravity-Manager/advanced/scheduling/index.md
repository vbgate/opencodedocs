---
title: "Planification de comptes : Stratégie haute disponibilité | Antigravity-Manager"
sidebarTitle: "Rendre les requêtes plus stables"
subtitle: "Planification haute disponibilité"
description: "Apprendre la planification de comptes et la stratégie haute disponibilité d'Antigravity Manager. Maîtriser session sticky, compte fixe, mécanisme de nouvelle tentative en cas d'échec, améliorer la disponibilité du système."
tags:
  - "avancé"
  - "planification"
  - "session sticky"
  - "rotation de comptes"
  - "nouvelle tentative en cas d'échec"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
  - "advanced-config"
order: 3
---
# Planification haute disponibilité : rotation, compte fixe, session sticky et nouvelle tentative en cas d'échec

Après avoir utilisé Antigravity Tools comme passerelle IA locale pendant un moment, vous rencontrerez tous le même problème : moins il y a de comptes, plus souvent 429/401/invalid_grant ; plus il y a de comptes, moins on sait "quel compte travaille", et le taux de succès du cache chute.

Ce cours explique clairement la planification : comment elle sélectionne le compte, ce que signifie "session sticky", quand elle force la rotation, et comment utiliser le "mode compte fixe" pour rendre la planification contrôlable.

## Ce que vous pourrez faire après ce cours

- Comprendre ce que font vraiment les 3 modes de planification d'Antigravity Tools dans les requêtes réelles
- Savoir comment le "session fingerprint (session_id)" est généré, et comment il affecte la planification sticky
- Activer/désactiver le "mode compte fixe" dans l'interface, et comprendre quelles logiques de planification il surcharge
- En cas de 429/5xx/invalid_grant, savoir comment le système marque la limitation, comment il réessaie, quand il fait la rotation

## Votre situation actuelle

- Claude Code ou OpenAI SDK tourne et soudain 429, une nouvelle tentative change de compte, le taux de succès du cache chute
- Plusieurs clients exécutent des tâches en parallèle, souvent "marchent sur" l'état de compte de l'autre
- Vous voulez dépanner, mais ne savez pas quel compte sert la requête actuelle
- Vous voulez utiliser un "compte le plus stable", mais le système continue de faire la rotation

## Quand utiliser cette méthode

- Vous devez faire un compromis entre "stabilité (moins d'erreurs)" et "succès du cache (même compte)"
- Vous voulez que la même conversation réutilise autant que possible le même compte (réduire les fluctuations Prompt Caching)
- Vous voulez faire un déploiement graduel/dépannage, fixer toutes les requêtes à un compte

## 🎒 Préparation avant de commencer

1) Préparez au moins 2 comptes disponibles (plus petit le pool de comptes, plus petit l'espace de rotation)
2) Le service reverse proxy est démarré (dans la page « API Proxy » vous voyez l'état Running)
3) Vous savez où est le fichier de configuration (si vous devez modifier manuellement la configuration)

::: tip D'abord compléter ce cours sur le système de configuration
Si vous n'êtes pas familier avec `gui_config.json` et quelles configurations peuvent être mises à jour à chaud, d'abord voir **[Configuration complète : AppConfig/ProxyConfig, emplacement de sauvegarde et sémantique de mise à jour à chaud](/fr/lbjlaq/Antigravity-Manager/advanced/config/)**.
:::

## Idée centrale : combien de couches de "planification" une requête traverse

La planification n'est pas un "interrupteur unique", mais plusieurs mécanismes superposés :

1) **SessionManager donne d'abord un session fingerprint (session_id) à la requête**
2) **Chaque nouvelle tentative de Handlers demande à TokenManager une rotation forcée** (`attempt > 0`)
3) **TokenManager sélectionne ensuite le compte selon : compte fixe → session sticky → fenêtre 60s → rotation**
4) **En cas de 429/5xx, il enregistre les informations de limitation**, la sélection suivante de compte évitera activement les comptes limités

### Qu'est-ce que "session fingerprint (session_id)" ?

**Le session fingerprint** est une "Session Key aussi stable que possible", utilisée pour lier plusieurs requêtes de la même conversation sur le même compte.

Dans les requêtes Claude, la priorité est :

1) `metadata.user_id` (entré explicitement par le client, et non vide et sans préfixe `"session-"`)
2) Le premier message user "suffisamment long" fait un hachage SHA256, puis tronqué en `sid-xxxxxxxxxxxxxxxx`

Implémentation correspondante : `src-tauri/src/proxy/session_manager.rs` (Claude/OpenAI/Gemini ont chacun leur logique d'extraction).

::: info Petit détail : pourquoi seulement regarder le premier message user ?
Le code source écrit explicitement "seulement hacher le contenu du premier message utilisateur, ne pas mélanger le nom du modèle ou l'horodatage", l'objectif est de faire en sorte que plusieurs requêtes de la même conversation génèrent autant que possible le même session_id, améliorant ainsi le taux de succès du cache.
:::

### Priorité de sélection de compte par TokenManager

L'entrée principale de TokenManager est :

- `TokenManager::get_token(quota_group, force_rotate, session_id, target_model)`

Ce qu'il fait peut être compris par priorité :

1) **Mode compte fixe (Fixed Account)** : si vous avez activé le "mode compte fixe" dans l'interface (paramètre d'exécution), et que ce compte n'est pas limité, ni protégé par quota, utilisez-le directement.
2) **Session sticky (Session Binding)** : s'il y a `session_id` et que le mode de planification n'est pas `PerformanceFirst`, réutilisez prioritairement le compte lié à cette session.
3) **Réutilisation fenêtre 60s globale** : si aucun `session_id` n'est passé (ou pas encore lié avec succès), en mode non `PerformanceFirst`, essayez de réutiliser "le compte utilisé la dernière fois" dans les 60 secondes.
4) **Rotation (Round-robin)** : quand aucun des précédents ne s'applique, sélectionnez le compte par rotation via un index auto-incrémenté global.

De plus, il y a deux "règles invisibles" qui affectent beaucoup l'expérience :

- **Les comptes seront d'abord triés** : ULTRA > PRO > FREE, dans le même tier priorité au compte avec plus de quota restant.
- **Échec ou limitation sera évité** : les comptes déjà tentés échoués entreront dans l'ensemble `attempted` ; les comptes marqués limités seront évités.

### Différence réelle entre les 3 modes de planification

Dans la configuration, vous verrez : `CacheFirst` / `Balance` / `PerformanceFirst`.

En prenant pour base "vraie branche TokenManager backend", leur différence clé n'est qu'une seule : **si activer session sticky + réutilisation fenêtre 60s**.

- `PerformanceFirst` : saute session sticky et réutilisation fenêtre 60s, va directement en rotation (et continue à sauter limitation/protection quota).
- `CacheFirst` / `Balance` : activeront tous deux session sticky et réutilisation fenêtre 60s.

::: warning À propos de max_wait_seconds
L'interface/structure de configuration a `max_wait_seconds`, et l'interface ne permet de l'ajuster que sous `CacheFirst`. Mais actuellement la logique de planification backend se branche seulement sur `mode`, ne lit pas `max_wait_seconds`.
:::

### Comment nouvelle tentative en cas d'échec et "rotation forcée" s'interconnectent

Dans les handlers OpenAI/Gemini/Claude, tous utilisent un modèle similaire pour gérer les nouvelles tentatives :

- 1ère tentative : `force_rotate = false`
- 2ème et après : `force_rotate = true` (`attempt > 0`), TokenManager sautera la réutilisation sticky, ira directement chercher le prochain compte disponible

En cas d'erreurs 429/529/503/500 etc. :

- le handler appellera `token_manager.mark_rate_limited(...)` pour enregistrer ce compte comme "limité/surchargé", la planification suivante évitera activement ce compte.
- Le chemin compatible OpenAI essaiera aussi d'analyser `RetryInfo.retryDelay` ou `quotaResetDelay` depuis l'erreur JSON, attendra un petit temps avant de continuer la nouvelle tentative.

## Suivez-moi : ajustez la planification à "contrôlable"

### Étape 1 : D'abord confirmer que vous avez vraiment "un pool de comptes"

**Pourquoi**
Planification aussi avancée soit-elle, s'il n'y a qu'un seul compte dans le pool, pas de choix. Beaucoup de racines de "rotation inefficace/pas de ressenti sticky" sont "trop peu de comptes".

**Opération**
Ouvrez la page « Accounts », confirmez qu'au moins 2 comptes sont dans l'état disponible (pas disabled / proxy disabled).

**Ce que vous devriez voir** : au moins 2 comptes peuvent rafraîchir normalement le quota, et après démarrage du reverse proxy, `active_accounts` n'est pas 0.

### Étape 2 : Choisir le mode de planification dans l'interface

**Pourquoi**
Le mode de planification décide si "la même conversation" essaie autant que possible de réutiliser le même compte, ou fait la rotation à chaque fois.

**Opération**
Entrez dans la page « API Proxy », trouvez la carte "Account Scheduling & Rotation", choisissez l'un des modes :

- `Balance` : valeur par défaut recommandée. Dans la plupart des cas plus stable (session sticky + rotation en cas d'échec).
- `PerformanceFirst` : concurrence élevée, tâches courtes, vous vous souciez plus du débit que du cache, choisissez-le.
- `CacheFirst` : si vous voulez "conversation fixe compte autant que possible", vous pouvez le choisir (comportement backend actuel très peu différent de `Balance`).

Si vous voulez modifier manuellement la configuration, le segment correspondant est :

```json
{
  "proxy": {
    "scheduling": {
      "mode": "Balance",
      "max_wait_seconds": 60
    }
  }
}
```

**Ce que vous devriez voir** : après changement de mode, écriture immédiate dans `gui_config.json`, prise d'effet directe pendant l'exécution du service reverse proxy (pas besoin de redémarrer).

### Étape 3 : Activer le "mode compte fixe" (éteindre la rotation)

**Pourquoi**
Dépannage, déploiement graduel, ou vous voulez "clouer" un certain compte à un certain client, le mode compte fixe est le moyen le plus direct.

**Opération**
Dans la même carte, activez "Fixed Account Mode", puis dans le déroulant choisissez le compte.

N'oubliez pas : cet interrupteur n'est disponible que quand le service reverse proxy est Running.

**Ce que vous devriez voir** : les requêtes suivantes utiliseront prioritairement ce compte ; s'il est limité ou protégé par quota, reviendra à la rotation.

::: info Le compte fixe est un paramètre d'exécution
Le mode compte fixe est un **état d'exécution** (défini dynamiquement via GUI ou API), ne sera pas persisté dans `gui_config.json`. Après redémarrage du service reverse proxy, le compte fixe reviendra à vide (retour au mode rotation).
:::

### Étape 4 : Besoin de nettoyer "liaison de session"

**Pourquoi**
Session sticky enregistre `session_id -> account_id` en mémoire. Si vous faites différentes expériences sur la même machine (par exemple changer le pool de comptes, changer de mode), les anciennes liaisons peuvent interférer avec votre observation.

**Opération**
Dans la carte "Account Scheduling & Rotation", en haut à droite, cliquez "Clear bindings".

**Ce que vous devriez voir** : les anciennes sessions seront réassignées à des comptes (la prochaine requête reliera à nouveau).

### Étape 5 : Utiliser l'en-tête de réponse pour confirmer "quel compte sert"

**Pourquoi**
Vous voulez vérifier si la planification correspond aux attentes, le moyen le plus fiable est d'obtenir l'identifiant de "compte actuel" renvoyé par le serveur.

**Opération**
Envoyez une demande non-streaming au point de terminaison compatible OpenAI, puis observez l'en-tête de réponse `X-Account-Email`.

```bash
  # Exemple : demande OpenAI Chat Completions minimale
  # Note : model doit être un nom de modèle disponible/routable dans votre configuration actuelle
curl -i "http://127.0.0.1:8045/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-REPLACE_ME" \
  -d '{
    "model": "gemini-3-pro-high",
    "stream": false,
    "messages": [{"role": "user", "content": "hello"}]
  }'
```

**Ce que vous devriez voir** : dans l'en-tête de réponse apparaît quelque chose comme ci-dessous (exemple) :

```text
X-Account-Email: example@gmail.com
X-Mapped-Model: gemini-3-pro-high
```

## Point de vérification ✅

- Vous pouvez dire clairement "fixed account", "sticky session", "round-robin" : quel mécanisme surcharge lequel
- Vous savez d'où vient `session_id` (priorité `metadata.user_id`, sinon hachage du premier message user)
- En cas de 429/5xx, vous pouvez anticiper : le système enregistrera d'abord la limitation, puis changera de compte et réessaiera
- Vous pouvez utiliser `X-Account-Email` pour vérifier quel compte sert la requête actuelle

## Attention aux pièges courants

1) **Quand le pool n'a qu'un seul compte, n'attendez pas que "la rotation puisse vous sauver"**
La rotation est seulement "changer pour un autre compte", quand il n'y a pas de deuxième compte dans le pool, 429/invalid_grant sera encore plus souvent exposé.

2) **`CacheFirst` n'est pas "attendre indéfiniment disponible"**
Quand la logique de planification backend actuelle rencontre une limitation, elle tend à délier et changer de compte, plutôt que d'attendre bloqué longtemps.

3) **Le compte fixe n'est pas absolument forcé**
Si le compte fixe est marqué comme limité, ou touché par la protection de quota, le système reviendra à la rotation.

## Résumé du cours

- Chaîne de planification : handler extrait `session_id` → `TokenManager::get_token` sélectionne compte → en cas d'erreur `attempt > 0` rotation forcée
- Vos deux interrupteurs les plus utilisés : mode de planification (si activer sticky/réutilisation 60s) + mode compte fixe (spécifier directement le compte)
- 429/5xx seront enregistrés comme "état de limitation", la planification suivante évitera ce compte, jusqu'à expiration du temps de verrouillage

## Aperçu du prochain cours

> Le prochain cours, nous voyons **Routage de modèles** : quand vous voulez exposer "un ensemble de modèles stable en externe", et vouloir faire stratégie générique/préréglée, comment configurer et dépanner.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Mode de planification et structure de configuration (StickySessionConfig) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L1-L36) | 1-36 |
| Génération session fingerprint (Claude/OpenAI/Gemini) | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L1-L159) | 1-159 |
| TokenManager : champ mode compte fixe et initialisation | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L27-L50) | 27-50 |
| TokenManager : logique principale sélection compte (compte fixe/session sticky/fenêtre 60s/rotation/protection quota) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L470-L940) | 470-940 |
| TokenManager : invalid_grant désactive automatiquement et retire du pool | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L868-L878) | 868-878 |
| TokenManager : API enregistrement limitation et nettoyage succès | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1087-L1147) | 1087-1147 |
| TokenManager : mise à jour config planification / nettoyage liaisons session / setter mode compte fixe | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1419-L1461) | 1419-1461 |
| ProxyConfig : définition champ scheduling et valeurs par défaut | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| Démarrage reverse proxy synchronise configuration scheduling | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L70-L100) | 70-100 |
| Commandes Tauri liées à planification (get/update/clear bindings/fixed account) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L478-L551) | 478-551 |
| Handler OpenAI : session_id + nouvelle tentative rotation forcée | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L160-L182) | 160-182 |
| Handler OpenAI : 429/5xx enregistrement limitation + analyse retry delay | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L349-L367) | 349-367 |
| Handler Gemini : session_id + nouvelle tentative rotation forcée | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L62-L88) | 62-88 |
| Handler Gemini : 429/5xx enregistrement limitation et rotation | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L279-L299) | 279-299 |
| Handler Claude : extraire session_id et passer à TokenManager | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L517-L524) | 517-524 |
| Analyse 429 retry delay (RetryInfo.retryDelay / quotaResetDelay) | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L37-L66) | 37-66 |
| Identification cause limitation et backoff exponentiel (RateLimitTracker) | [`src-tauri/src/proxy/rate_limit.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/rate_limit.rs#L154-L279) | 154-279 |

**Structures clés** :
- `StickySessionConfig` : structure configuration mode et configuration planification (`mode`, `max_wait_seconds`)
- `TokenManager` : pool de comptes, liaison session, mode compte fixe, traqueur limitation
- `SessionManager` : extraire `session_id` depuis la requête

</details>
