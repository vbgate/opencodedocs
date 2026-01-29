---
title: "Sécurité : Confidentialité et Configuration d'Authentification | Antigravity-Manager"
sidebarTitle: "Ne laissez pas votre réseau local à nu"
subtitle: "Sécurité et confidentialité : auth_mode, allow_lan_access, et la conception 'ne pas divulguer les informations du compte'"
description: "Apprenez les méthodes de configuration de sécurité d'Antigravity Tools. Maîtrisez les 4 modes d'auth_mode, les différences d'adresse d'allow_lan_access, la configuration d'api_key et la vérification /healthz pour éviter les fuites d'informations du compte."
tags:
  - "security"
  - "privacy"
  - "auth_mode"
  - "allow_lan_access"
  - "api_key"
prerequisite:
  - "start-getting-started"
  - "start-proxy-and-first-client"
duration: 16
order: 2
---

# Sécurité et confidentialité : auth_mode, allow_lan_access, et la conception "ne pas divulguer les informations du compte"

Lorsque vous utilisez Antigravity Tools comme "passerelle IA locale", les questions de sécurité tournent généralement autour de deux choses : à qui vous exposez le service (uniquement la machine locale, ou tout le réseau local/Internet public), et si les demandes externes doivent porter une clé API. Ce cours explique clairement les règles du code source et vous fournit une ligne de base de sécurité minimale que vous pouvez suivre directement.

## Ce que vous pourrez faire après ce cours

- Choisir le bon `allow_lan_access` : comprendre qu'il affecte l'adresse d'écoute (`127.0.0.1` vs `0.0.0.0`)
- Choisir le bon `auth_mode` : comprendre le comportement réel de `off/strict/all_except_health/auto`
- Configurer `api_key` et vérifier : utiliser `curl` pour voir immédiatement "si l'authentification est activée"
- Connaître les limites de la protection de la confidentialité : la clé proxy locale n'est pas transférée en amont ; les messages d'erreur pour les clients API évitent de divulguer l'e-mail du compte

## Votre problème actuel

- Vous voulez autoriser l'accès depuis votre téléphone/un autre ordinateur, mais vous craignez que l'ouverture de l'accès au réseau local ne vous "mette à nu"
- Vous voulez activer l'authentification, mais vous n'êtes pas sûr si `/healthz` doit être exempté, craignant de casser les sondes de santé
- Vous craignez de divulguer votre clé locale, vos cookies et l'e-mail de votre compte à des clients externes ou aux plateformes en amont

## Quand utiliser cette méthode

- Vous prévoyez d'activer `allow_lan_access` (NAS, réseau domestique, réseau interne d'équipe)
- Vous souhaitez exposer votre service local à Internet via cloudflared/proxy inverse (voir d'abord **[Tunnel Cloudflared en un clic](/fr/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**)
- Vous rencontrez `401` et devez confirmer s'il s'agit de "pas de clé" ou de "mode non aligné"

## 🎒 Préparatifs avant de commencer

::: warning Conditions préalables
- Vous avez déjà réussi à démarrer l'API Proxy dans l'interface GUI (si ce n'est pas le cas, voir d'abord **[Démarrer le proxy inverse local et connecter le premier client](/fr/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**).
- Vous savez quel problème vous devez résoudre : accès uniquement local, ou autorisation d'accès réseau/Internet public.
:::

::: info 3 champs qui apparaîtront à plusieurs reprises dans ce cours
- `allow_lan_access` : autoriser ou non l'accès depuis le réseau local.
- `auth_mode` : stratégie d'authentification (détermine quels itinéraires doivent porter une clé).
- `api_key` : clé API du proxy local (utilisée uniquement pour l'authentification du proxy local, n'est pas transférée en amont).
:::

## Qu'est-ce qu'auth_mode ?

**auth_mode** est le "commutateur d'authentification proxy + stratégie d'exemption" d'Antigravity Tools. Il détermine quels demandes des clients externes vers les terminaux du proxy local doivent porter `proxy.api_key`, et si les itinéraires de sondage de santé comme `/healthz` autorisent l'accès sans authentification.

## Idée centrale

1. D'abord définir la "surface d'exposition" : `allow_lan_access=false` n'écoute que sur `127.0.0.1` ; `true` écoute sur `0.0.0.0`.
2. Ensuite définir la "clé d'entrée" : `auth_mode` détermine si une clé est requise et si `/healthz` est exempté.
3. Enfin "clôturer la confidentialité" : ne pas transférer la clé proxy locale/les cookies en amont ; les messages d'erreur externes ne doivent pas contenir l'e-mail du compte.

## Suivez-moi

### Étape 1 : Décidez d'abord si vous souhaitez activer l'accès au réseau local (allow_lan_access)

**Pourquoi**
Vous ne devez activer l'accès au réseau local que lorsque vous avez "besoin d'accès depuis d'autres appareils", sinon l'accès uniquement local par défaut est la stratégie de sécurité la plus simple.

Dans `ProxyConfig`, l'adresse d'écoute est déterminée par `allow_lan_access` :

```rust
pub fn get_bind_address(&self) -> &str {
    if self.allow_lan_access {
        "0.0.0.0"
    } else {
        "127.0.0.1"
    }
}
```

Dans la page `API Proxy` de l'interface GUI, définissez le commutateur "Autoriser l'accès au réseau local" selon vos besoins.

**Ce que vous devriez voir**
- Désactivé : le texte indique "accès uniquement local" (le texte exact dépend du pack de langue)
- Activé : l'interface affiche un avertissement de risque évident (rappelant qu'il s'agit d'une "expansion de la surface d'exposition")

### Étape 2 : Choisissez un auth_mode (recommandé d'utiliser d'abord auto)

**Pourquoi**
`auth_mode` n'est pas seulement "activer/désactiver l'authentification", il détermine également si les terminaux de sondage comme `/healthz` sont exemptés.

Le projet prend en charge 4 modes (issus de `docs/proxy/auth.md`) :

- `off` : aucun itinéraire ne nécessite d'authentification
- `strict` : tous les itinéraires nécessitent une authentification
- `all_except_health` : tous les itinéraires sauf `/healthz` nécessitent une authentification
- `auto` : mode automatique, déduit la stratégie réelle en fonction de `allow_lan_access`

La logique de déduction de `auto` se trouve dans `ProxySecurityConfig::effective_auth_mode()` :

```rust
match self.auth_mode {
    ProxyAuthMode::Auto => {
        if self.allow_lan_access {
            ProxyAuthMode::AllExceptHealth
        } else {
            ProxyAuthMode::Off
        }
    }
    ref other => other.clone(),
}
```

**Approche recommandée**
- Accès uniquement local : `allow_lan_access=false` + `auth_mode=auto` (finalement équivalent à `off`)
- Accès réseau local : `allow_lan_access=true` + `auth_mode=auto` (finalement équivalent à `all_except_health`)

**Ce que vous devriez voir**
- Dans la page `API Proxy`, la liste déroulante "Auth Mode" propose quatre options : `off/strict/all_except_health/auto`

### Étape 3 : Confirmez votre api_key (régénérez si nécessaire)

**Pourquoi**
Tant que votre proxy doit être accessible depuis l'extérieur (réseau local/Internet public), `api_key` doit être géré comme un mot de passe.

Par défaut, `ProxyConfig::default()` génère une clé sous la forme `sk-...` :

```rust
api_key: format!("sk-{}", uuid::Uuid::new_v4().simple()),
```

Dans la page `API Proxy`, vous pouvez modifier, régénérer et copier l'`api_key` actuel.

**Ce que vous devriez voir**
- La page contient une zone de saisie pour `api_key`, ainsi que des boutons modifier/régénérer/copier

### Étape 4 : Vérifiez avec /healthz que la "stratégie d'exemption" correspond aux attentes

**Pourquoi**
`/healthz` est le boucle de validation la plus courte : vous pouvez confirmer "service accessible + stratégie d'authentification correcte" sans vraiment appeler le modèle.

Remplacez `<PORT>` par votre propre port (par défaut `8045`) :

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**Ce que vous devriez voir**

```json
{"status":"ok"}
```

::: details Si vous avez défini auth_mode sur strict
`strict` n'exempte pas `/healthz`. Vous devez porter la clé :

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```
:::

### Étape 5 : Vérifiez 401 avec un "terminaison non health" (et avec la clé ce n'est plus 401)

**Pourquoi**
Vous devez confirmer que le middleware d'authentification fonctionne réellement, et non que vous avez sélectionné le mode dans l'interface mais qu'il n'est pas effectif.

Le corps de la demande suivant est intentionnellement incomplet, son but n'est pas "réussir l'appel" mais de vérifier s'il est intercepté par l'authentification :

```bash
#Sans clé : quand auth_mode != off, devrait être 401
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -d "{}"

#Avec clé : ne devrait plus être 401 (peut renvoyer 400/422 car le corps est incomplet)
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d "{}"
```

**Ce que vous devriez voir**
- Sans clé : `HTTP/1.1 401 Unauthorized`
- Avec clé : le code d'état n'est plus 401

## Point de contrôle ✅

- Vous pouvez clairement dire quelle est votre surface d'exposition actuelle : uniquement local (127.0.0.1) ou réseau local (0.0.0.0)
- Avec `auth_mode=auto`, vous pouvez prédire le mode effectif réel (LAN -> `all_except_health`, local -> `off`)
- Vous pouvez reproduire "401 sans clé" avec 2 commandes `curl`

## Mises en garde contre les pièges

::: warning Mauvaise pratique vs Pratique recommandée

| Scénario | ❌ Erreur courante | ✓ Pratique recommandée |
| --- | --- | --- |
| Besoin d'accès réseau local | Seulement activer `allow_lan_access=true`, mais `auth_mode=off` | Utiliser `auth_mode=auto` et définir un `api_key` fort |
| Authentification activée mais toujours 401 | Le client porte la clé, mais le nom du header n'est pas compatible | Le proxy prend en charge trois types de headers : `Authorization`/`x-api-key`/`x-goog-api-key` |
| Authentification activée mais clé non configurée | Activer l'authentification avec `api_key` vide | Le backend rejettera directement (les journaux indiqueront que la clé est vide) |
:::

::: warning L'exemption /healthz ne s'applique qu'à all_except_health
Le middleware autorisera le passage lorsque le "mode effectif" est `all_except_health` et que le chemin est `/healthz` ; considérez-le comme un "point de sondage de santé", ne l'utilisez pas comme une API métier.
:::

## Confidentialité et conception "ne pas divulguer les informations du compte"

### 1) La clé proxy locale n'est pas transférée en amont

L'authentification se produit uniquement à l'entrée du proxy local ; `docs/proxy/auth.md` indique clairement : la clé API proxy n'est pas transférée en amont.

### 2) Lors du transfert vers z.ai, les headers transmissibles sont délibérément réduits

Lorsqu'une demande est transférée vers z.ai (compatible Anthropic), le code n'autorise qu'un petit nombre de headers, évitant de transporter la clé proxy locale ou les cookies :

```rust
// Only forward a conservative set of headers to avoid leaking the local proxy key or cookies.
```

### 3) Les messages d'erreur d'échec de rafraîchissement du token évitent d'inclure l'e-mail du compte

Lorsque le rafraîchissement du token échoue, les journaux enregistreront le compte spécifique, mais l'erreur renvoyée au client API sera réécrite pour ne pas inclure l'e-mail :

```rust
// Avoid leaking account emails to API clients; details are still in logs.
last_error = Some(format!("Token refresh failed: {}", e));
```

## Résumé de ce cours

- D'abord définir la surface d'exposition (`allow_lan_access`), puis définir la clé d'entrée (`auth_mode` + `api_key`)
- La règle de `auth_mode=auto` est simple : LAN nécessite au moins `all_except_health`, uniquement local c'est `off`
- La ligne de base de confidentialité est "ne pas transporter la clé locale, ne pas divulguer l'e-mail du compte dans les erreurs externes", les détails se trouvent dans le middleware et le code de transfert en amont

## Prochain cours

> Le prochain cours abordera **[Ordonnancement haute disponibilité : rotation, compte fixe, session collante et nouvelle tentative en cas d'échec](/fr/lbjlaq/Antigravity-Manager/advanced/scheduling/)**, pour compléter la "sortie stable" après "l'entrée sécurisée".

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Lignes |
| --- | --- | --- |
| Les 4 modes d'auth_mode et explication de la sémantique auto | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L10-L24) | 10-24 |
| Énumération ProxyAuthMode et valeur par défaut (off par défaut) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| Champs clés et valeurs par défaut de ProxyConfig (allow_lan_access, api_key) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L259) | 174-259 |
| Dérivation de l'adresse d'écoute (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L292) | 281-292 |
| Logique de déduction auto -> effective_auth_mode | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L10-L30) | 10-30 |
| Middleware d'authentification (OPTIONS autorisés, /healthz exempté, compatibilité 3 headers) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| Interface : commutateurs/listes déroulantes allow_lan_access et auth_mode | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L943-L1046) | 943-1046 |
| Interface : modification/réinitialisation/copie de api_key | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1048-L1120) | 1048-1120 |
| Désactivation automatique invalid_grant et réécriture d'erreur "éviter la fuite d'e-mail" | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L841-L940) | 841-940 |
| disable_account : écrire disabled/disabled_at/disabled_reason et retirer du pool de mémoire | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| Transfert z.ai : réduire les headers transmissibles (éviter la fuite de clés locales/cookies) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89) | 70-89 |
| Comportement de désactivation du pool de comptes et affichage de l'interface (documentation) | [`docs/proxy/accounts.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/accounts.md#L9-L44) | 9-44 |

</details>
