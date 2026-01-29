---
title: "Démarrer le proxy : Reverse proxy et intégration client | Antigravity-Manager"
sidebarTitle: "Faire fonctionner le reverse proxy en 5 minutes"
subtitle: "Démarrer le reverse proxy local et intégrer le premier client (/healthz + configuration SDK)"
description: "Apprenez le démarrage du reverse proxy Antigravity et l'intégration client : configurer le port et l'authentification, vérifier avec /healthz, effectuer le premier appel SDK."
tags:
  - "API Proxy"
  - "healthz"
  - "OpenAI SDK"
  - "Anthropic SDK"
  - "Gemini SDK"
  - "Base URL"
prerequisite:
  - "start-installation"
  - "start-add-account"
duration: 18
order: 6
---

# Démarrer le reverse proxy local et intégrer le premier client (/healthz + configuration SDK)

Dans cette leçon, nous allons mettre en place le reverse proxy (API Proxy) local avec Antigravity Tools : démarrer le service, vérifier son fonctionnement avec `/healthz`, puis intégrer un SDK pour effectuer la première requête.

## Ce que vous saurez faire

- Démarrer/arrêter le service de reverse proxy local depuis la page API Proxy d'Antigravity Tools
- Utiliser `GET /healthz` pour vérifier que "le port est correct et le service fonctionne vraiment"
- Comprendre la relation entre `auth_mode` et l'API Key : quels chemins nécessitent une authentification et quel header inclure
- Choisir un client (OpenAI / Anthropic / Gemini SDK) et effectuer la première requête réelle

## Votre situation actuelle

- Vous avez installé Antigravity Tools et ajouté des comptes, mais vous ne savez pas "si le reverse proxy a démarré avec succès"
- Lors de l'intégration du client, vous rencontrez souvent des erreurs `401` (clé manquante) ou `404` (Base URL incorrecte/chemins dupliqués)
- Vous ne voulez pas deviner, vous voulez le cycle le plus court : démarrage → vérification → première requête réussie

## Quand utiliser cette méthode

- Vous venez d'installer et voulez confirmer que la passerelle locale fonctionne vers l'extérieur
- Vous avez changé le port, activé l'accès réseau local ou modifié le mode d'authentification, et voulez vérifier rapidement que la configuration fonctionne
- Vous intégrez un nouveau client/nouveau SDK et voulez d'abord faire fonctionner un exemple minimal

## 🎒 Préparation

::: warning Prérequis
- Vous avez terminé l'installation et pouvez ouvrir normalement Antigravity Tools.
- Vous avez au moins un compte disponible ; sinon, le démarrage du reverse proxy renverra l'erreur `"Aucun compte disponible, veuillez d'abord ajouter un compte"` (uniquement si la distribution z.ai n'est pas activée).
:::

::: info Quelques termes qui reviendront souvent dans cette leçon
- **Base URL** : L'adresse racine du service demandée par le client. La méthode de concaténation varie selon les SDK, certains nécessitent `/v1`, d'autres non.
- **Vérification de disponibilité** : Confirmer l'accessibilité du service avec une requête minimale. Le point de terminaison de vérification de ce projet est `GET /healthz`, qui renvoie `{"status":"ok"}`.
:::

## Idée centrale

1. Lorsqu'Antigravity Tools démarre le reverse proxy, il lie l'adresse et le port d'écoute en fonction de la configuration :
   - `allow_lan_access=false` lie `127.0.0.1`
   - `allow_lan_access=true` lie `0.0.0.0`
2. Vous n'avez pas besoin d'écrire de code au préalable. Utilisez d'abord `GET /healthz` pour vérifier que "le service fonctionne".
3. Si vous activez l'authentification :
   - `auth_mode=all_except_health` exemptera `/healthz`
   - `auth_mode=strict` nécessitera une API Key pour tous les chemins

## Suivez-moi

### Étape 1 : Confirmer le port, l'accès réseau local et le mode d'authentification

**Pourquoi**
Vous devez d'abord déterminer "où le client doit se connecter (host/port)" et "s'il faut inclure une clé", sinon les erreurs 401/404 seront difficiles à résoudre.

Ouvrez la page `API Proxy` dans Antigravity Tools et regardez ces 4 champs :

- `port` : par défaut `8045`
- `allow_lan_access` : désactivé par défaut (accès uniquement local)
- `auth_mode` : options `off/strict/all_except_health/auto`
- `api_key` : générera par défaut `sk-...`, et l'interface utilisateur vérifiera qu'il commence par `sk-` et a au moins 10 caractères

**Ce que vous devriez voir**
- Un bouton Start/Stop dans le coin supérieur droit de la page (démarrer/arrêter le reverse proxy), la zone de saisie du port sera désactivée lorsque le service fonctionne

::: tip Configuration recommandée pour les débutants (d'abord faire fonctionner, puis sécuriser)
- Première mise en œuvre : `allow_lan_access=false` + `auth_mode=off`
- Pour l'accès réseau local : activez d'abord `allow_lan_access=true`, puis basculez `auth_mode` sur `all_except_health` (au moins n'exposez pas tout le réseau local en "API nue")
:::

### Étape 2 : Démarrer le service de reverse proxy

**Pourquoi**
Le bouton Start de l'interface graphique appelle la commande backend pour démarrer le serveur Axum et charger le pool de comptes ; c'est la condition préalable pour "fournir l'API vers l'extérieur".

Cliquez sur le bouton Start dans le coin supérieur droit de la page.

**Ce que vous devriez voir**
- Le statut passe de stopped à running
- Le nombre de comptes actuellement chargés (active accounts) s'affiche à côté

::: warning Si le démarrage échoue, les deux erreurs les plus courantes
- `"Aucun compte disponible, veuillez d'abord ajouter un compte"` : Le pool de comptes est vide et la distribution z.ai n'est pas activée.
- `"Échec du démarrage du serveur Axum : échec de liaison de l'adresse <host:port> : ..."` : Le port est occupé ou vous n'avez pas les permissions (essayez un autre port).
:::

### Étape 3 : Vérifier avec /healthz (cycle le plus court)

**Pourquoi**
`/healthz` est la confirmation de connectivité la plus stable. Il ne dépend pas des modèles, des comptes ou de la conversion de protocole, il vérifie seulement si le service est accessible.

Remplacez `<PORT>` par le port que vous voyez dans l'interface (par défaut `8045`) :

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

::: details Comment tester avec authentification requise ?
Lorsque vous basculez `auth_mode` sur `strict`, tous les chemins nécessitent une clé (y compris `/healthz`).

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```

Format recommandé pour l'en-tête d'authentification (compatible avec plus de formats) :
- `Authorization: Bearer <proxy.api_key>` ou `Authorization: <proxy.api_key>`
- `x-api-key: <proxy.api_key>`
- `x-goog-api-key: <proxy.api_key>`
:::

### Étape 4 : Intégrer votre premier client (OpenAI / Anthropic / Gemini au choix)

**Pourquoi**
`/healthz` indique seulement que "le service est accessible" ; l'intégration réussie réelle est confirmée lorsque le SDK effectue une vraie requête.

::: code-group

```python [OpenAI SDK (Python)]
import openai

client = openai.OpenAI(
    api_key="<API_KEY>",
    base_url="http://127.0.0.1:8045/v1",
)

resp = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Bonjour, présentez-vous"}],
)

print(resp.choices[0].message.content)
```

```bash [Claude Code / Anthropic CLI]
export ANTHROPIC_API_KEY="<API_KEY>"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

```python [Gemini SDK (Python)]
import google.generativeai as genai

genai.configure(
    api_key="<API_KEY>",
    transport="rest",
    client_options={"api_endpoint": "http://127.0.0.1:8045"},
)

model = genai.GenerativeModel("gemini-3-flash")
resp = model.generate_content("Hello")
print(resp.text)
```

:::

**Ce que vous devriez voir**
- Le client reçoit une réponse texte non vide
- Si vous avez activé Proxy Monitor, vous verrez cet enregistrement de requête dans la surveillance

## Point de contrôle ✅

- `GET /healthz` renvoie `{"status":"ok"}`
- La page API Proxy affiche running
- L'exemple SDK que vous avez choisi renvoie du contenu (pas 401/404, ni réponse vide)

## Mises en garde

::: warning 401 : généralement une incohérence d'authentification
- Vous avez activé `auth_mode`, mais le client n'inclut pas de clé.
- Vous avez inclus une clé, mais le nom de l'en-tête est incorrect : ce projet est compatible avec `Authorization` / `x-api-key` / `x-goog-api-key`.
:::

::: warning 404 : généralement une Base URL incorrecte ou "chemins dupliqués"
- OpenAI SDK nécessite généralement `base_url=.../v1` ; alors que les exemples Anthropic/Gemini n'ont pas `/v1`.
- Certains clients concatènent les chemins de manière répétée comme `/v1/chat/completions/responses`, ce qui entraîne 404 (le README du projet mentionne spécifiquement le problème de chemins dupliqués en mode OpenAI de Kilo Code).
:::

::: warning L'accès réseau local n'est pas "activer et terminer"
Lorsque vous activez `allow_lan_access=true`, le service se lie à `0.0.0.0`. Cela signifie que d'autres appareils sur le même réseau local peuvent accéder via l'IP de votre machine + le port.

Si vous voulez l'utiliser ainsi, activez au moins `auth_mode` et définissez un `api_key` fort.
:::

## Résumé de la leçon

- Après avoir démarré le reverse proxy, utilisez d'abord `/healthz` pour vérifier, puis configurez le SDK
- `auth_mode` détermine quels chemins nécessitent une clé ; `all_except_health` exempte `/healthz`
- Lors de l'intégration du SDK, l'erreur la plus courante est de savoir si la Base URL doit inclure `/v1`

## Prochaine leçon

> Dans la prochaine leçon, nous détaillerons l'API compatible OpenAI : y compris les limites de compatibilité entre `/v1/chat/completions` et `/v1/responses`.
>
> Voir **[API compatible OpenAI : stratégie pour /v1/chat/completions et /v1/responses](/fr/lbjlaq/Antigravity-Manager/platforms/openai/)**.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour afficher les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Sujet | Chemin du fichier | Lignes |
| --- | --- | --- |
| Démarrage/arrêt/statut du service de reverse proxy | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L178) | 42-178 |
| Vérification du pool de comptes avant démarrage (conditions d'erreur sans comptes) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L81-L91) | 81-91 |
| Enregistrement des routes (y compris `/healthz`) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Valeur de retour `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Middleware d'authentification proxy (compatibilité des headers et exemption `/healthz`) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| Logique de résolution réelle de `auth_mode=auto` | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L19-L30) | 19-30 |
| Valeurs par défaut ProxyConfig (port 8045, uniquement local par défaut) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| Dérivation de l'adresse de liaison (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L291) | 281-291 |
| Bouton démarrage/arrêt de l'interface appelle `start_proxy_service/stop_proxy_service` | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L624-L639) | 624-639 |
| Zone de configuration port/réseau local/authentification/API key de l'interface | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L868-L1121) | 868-1121 |
| Exemples d'intégration Claude Code / Python du README | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L227) | 197-227 |

</details>
