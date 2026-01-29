---
title: "Échec d'authentification: Dépannage erreur 401 | Antigravity-Manager"
sidebarTitle: "Résoudre 401 en 3 minutes"
subtitle: "401/Échec d'authentification: d'abord auth_mode, ensuite Header"
description: "Apprenez le mécanisme d'authentification du proxy Antigravity Tools, dépannage des erreurs 401. Localisez le problème dans l'ordre auth_mode, api_key, Header, comprenez les règles du mode auto et l'exemption /healthz, évitez les pièges de priorité des en-têtes."
tags:
  - "FAQ"
  - "Authentification"
  - "401"
  - "Clé API"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# 401/Échec d'authentification : d'abord auth_mode, ensuite Header

## Ce que vous saurez faire à la fin

- Déterminer en 3 minutes si 401 est bloqué par le middleware d'authentification d'Antigravity Tools
- Comprendre les quatre modes de `proxy.auth_mode` (surtout `auto`) et leur « valeur effective » dans votre configuration actuelle
- Utiliser le bon en-tête de clé API (et éviter les pièges de priorité des en-têtes) pour faire passer les requêtes

## Votre situation actuelle

Le client appelle le proxy local et reçoit une erreur `401 Unauthorized` :
- Python/OpenAI SDK : lance `AuthenticationError`
- curl : renvoie `HTTP/1.1 401 Unauthorized`
- Client HTTP : code d'état de réponse 401

## Qu'est-ce que 401/échec d'authentification ?

**401 Unauthorized** dans Antigravity Tools signifie le plus souvent : le proxy a activé l'authentification (déterminée par `proxy.auth_mode`), mais la requête n'a pas porté de clé API, ou a porté un en-tête prioritaire mais non correspondant, donc `auth_middleware()` renvoie directement 401.

::: info Confirmez d'abord si « le proxy bloque »
La plateforme en amont peut également renvoyer 401, mais cette FAQ traite uniquement du « 401 causé par l'authentification du proxy ». Vous pouvez utiliser d'abord le `/healthz` ci-dessous pour distinguer rapidement.
:::

## Dépannage rapide (suivez cet ordre)

### Étape 1 : Utiliser `/healthz` pour déterminer « l'authentification vous bloque-t-elle »

**Pourquoi**
`all_except_health` autorise `/healthz` mais bloque les autres routes ; cela peut vous aider à localiser rapidement si 401 provient de la couche d'authentification du proxy.

```bash
 # Sans aucun en-tête d'authentification
curl -i http://127.0.0.1:8045/healthz
```

**Ce que vous devriez voir**
- Quand `auth_mode=all_except_health` (ou `auto` et `allow_lan_access=true`) : renvoie généralement `200`
- Quand `auth_mode=strict` : renverra `401`

::: tip `/healthz` est GET dans la couche de routage
Le proxy enregistre `GET /healthz` dans le routage (voir `src-tauri/src/proxy/server.rs`).
:::

---

### Étape 2 : Confirmer la « valeur effective » de `auth_mode` (surtout `auto`)

**Pourquoi**
`auto` n'est pas une « stratégie indépendante », il calcule le mode réel à exécuter selon `allow_lan_access`.

| `proxy.auth_mode` | Condition supplémentaire | Valeur effective (effective mode) |
| --- | --- | --- |
| `off` | - | `off` |
| `strict` | - | `strict` |
| `all_except_health` | - | `all_except_health` |
| `auto` | `allow_lan_access=false` | `off` |
| `auto` | `allow_lan_access=true` | `all_except_health` |

**Vous pouvez vérifier dans la page GUI API Proxy** : `Allow LAN Access` et `Auth Mode`.

---

### Étape 3 : Confirmer que `api_key` n'est pas vide, et que vous utilisez la même valeur

**Pourquoi**
Quand l'authentification est activée, si `proxy.api_key` est vide, `auth_middleware()` refusera directement toutes les requêtes et enregistrera une erreur.

```text
Proxy auth is enabled but api_key is empty; denying request
```

**Ce que vous devriez voir**
- Dans la page API Proxy, vous pouvez voir une clé commençant par `sk-` (la valeur par défaut dans `ProxyConfig::default()` est générée automatiquement)
- Après avoir cliqué sur « Regenerate/Modifier » et enregistré, les requêtes externes sont immédiatement validées selon la nouvelle clé (pas besoin de redémarrer)

---

### Étape 4 : Essayez avec l'en-tête le plus simple (n'utilisez pas de SDK complexes d'abord)

**Pourquoi**
Le middleware lira d'abord `Authorization`, puis `x-api-key`, enfin `x-goog-api-key`. Si vous envoyez plusieurs en-têtes en même temps, le premier est faux, même si le second est correct, il ne sera pas utilisé.

```bash
 # Méthode recommandée : Authorization + Bearer
curl -i http://127.0.0.1:8045/v1/models \
  -H "Authorization: Bearer sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

**Ce que vous devriez voir** : `HTTP/1.1 200 OK` (ou au moins plus 401)

::: info Détails de compatibilité du proxy avec Authorization
`auth_middleware()` dépouillera la valeur de `Authorization` selon le préfixe `Bearer ` ; si pas de préfixe `Bearer `, il traitera la valeur entière comme clé à comparer. La documentation recommande toujours `Authorization: Bearer <key>` (plus conforme aux conventions générales SDK).
:::

**Si vous devez utiliser `x-api-key`** :

```bash
curl -i http://127.0.0.1:8045/v1/models \
  -H "x-api-key: sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

---

## Pièges courants (tous se produisent réellement dans le code source)

| Phénomène | Vraie cause | Comment corriger |
| --- | --- | --- |
| `auth_mode=auto`, mais l'appel local renvoie toujours 401 | `allow_lan_access=true` fait que `auto` prend effet comme `all_except_health` | Désactivez `allow_lan_access`, ou faites porter une clé au client |
| Vous pensez « j'ai bien porté x-api-key », mais toujours 401 | Portez simultanément un `Authorization` non correspondant, le middleware le privilégie | Supprimez l'en-tête en trop, ne gardez qu'un que vous êtes sûr correct |
| `Authorization: Bearer<key>` toujours 401 | Il manque un espace après `Bearer`, impossible de dépouiller selon le préfixe `Bearer ` | Changez en `Authorization: Bearer <key>` |
| Toutes les requêtes renvoient 401, le journal affiche `api_key is empty` | `proxy.api_key` est vide | Dans le GUI, régénérez/définissez une clé non vide |

## Résumé de la leçon

- Utilisez d'abord `/healthz` pour localiser si 401 provient de la couche d'authentification du proxy
- Ensuite confirmez `auth_mode` (surtout le mode effectif de `auto`)
- Enfin ne portez qu'un en-tête sûr et correct pour vérifier (évitez les pièges de priorité des en-têtes)

## Prochaine leçon

> La prochaine leçon, nous apprendrons **[429/Erreur de capacité : attentes correctes pour la rotation des comptes et méprise sur l'épuisement de la capacité du modèle](../429-rotation/)**.
>
> Vous apprendrez :
> - Si 429 est « quota insuffisant » ou « limitation en amont »
> - Attentes correctes pour la rotation des comptes (quand basculer automatiquement, quand ne pas basculer)
> - Utiliser la configuration pour réduire la probabilité de 429

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Heure de mise à jour : 2026-01-23

| Fonction        | Chemin du fichier                                                                                             | Ligne    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------- |
| Énumération ProxyAuthMode | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig: allow_lan_access/auth_mode/api_key et valeurs par défaut | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L258) | 174-258 |
| Analyse du mode auto (effective_auth_mode) | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L1-L30) | 1-30 |
| Middleware d'authentification (extraction et priorité des en-têtes, exemption /healthz, autorisation OPTIONS) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| Enregistrement de route /healthz et ordre des middlewares | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L193) | 170-193 |
| Documentation d'authentification (modes et conventions client) | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L1-L45) | 1-45 |

**Énumérations clés** :
- `ProxyAuthMode::{Off, Strict, AllExceptHealth, Auto}` : modes d'authentification

**Fonctions clés** :
- `ProxySecurityConfig::effective_auth_mode()` : analyser `auto` en vraie stratégie
- `auth_middleware()` : exécuter l'authentification (incluant l'ordre d'extraction des en-têtes et exemption /healthz)

</details>
