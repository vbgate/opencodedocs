---
title: "Référence rapide des points de terminaison : vue d'ensemble des routes HTTP | Antigravity-Manager"
sidebarTitle: "Consulter toutes les routes"
subtitle: "Tableau de référence rapide des points de terminaison : vue d'ensemble des routes HTTP exposées"
description: "Découvrez la distribution des points de terminaison HTTP de la passerelle Antigravity. Comparez les routes OpenAI/Anthropic/Gemini/MCP via un tableau, et maîtrisez les modes d'authentification et l'utilisation des API Key Headers."
tags:
  - "Référence rapide des points de terminaison"
  - "Référence API"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 1
---
# Référence rapide des points de terminaison : vue d'ensemble des routes HTTP exposées

## Ce que vous pourrez faire après ce chapitre

- Localiser rapidement le chemin du point de terminaison à appeler
- Comprendre la distribution des points de terminaison selon différents protocoles
- Connaître les règles spéciales pour les modes d'authentification et les contrôles de santé

## Vue d'ensemble des points de terminaison

Le service de proxy inverse local d'Antigravity Tools fournit les catégories de points de terminaison suivantes :

| Classification du protocole | Usage | Client typique |
| --- | --- | --- |
| **Protocole OpenAI** | Compatibilité applications IA génériques | OpenAI SDK / Clients compatibles |
| **Protocole Anthropic** | Appels Claude série | Claude Code / Anthropic SDK |
| **Protocole Gemini** | SDK Google officiel | Google Gemini SDK |
| **Points de terminaison MCP** | Extension des appels d'outils | Clients MCP |
| **Interne/Auxiliaire** | Vérification de santé, interception/capacités internes | Scripts d'automatisation / Surveillance de disponibilité |

---

## Points de terminaison du protocole OpenAI

Ces points de terminaison sont compatibles avec le format de l'API OpenAI, convenant pour la plupart des clients prenant en charge le SDK OpenAI.

| Méthode | Chemin | Point d'entrée de routage (handler Rust) | Notes |
| --- | --- | --- | --- |
| GET | `/v1/models` | `handlers::openai::handle_list_models` | Compatibilité OpenAI : liste des modèles |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | Compatibilité OpenAI : Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | Compatibilité OpenAI : Completions hérité |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | Compatibilité OpenAI : requêtes Codex CLI (même handler que `/v1/completions`) |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | Compatibilité OpenAI : Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | Compatibilité OpenAI : Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | Compatibilité OpenAI : Audio Transcriptions |

::: tip Indice de compatibilité
Le point de terminaison `/v1/responses` est conçu pour Codex CLI et utilise en fait la même logique de traitement que `/v1/completions`.
:::

---

## Points de terminaison du protocole Anthropic

Ces points de terminaison sont organisés selon le format des chemins et des requêtes de l'API Anthropic, destinés aux appels de Claude Code / Anthropic SDK.

| Méthode | Chemin | Point d'entrée de routage (handler Rust) | Notes |
| --- | --- | --- | --- |
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Compatibilité Anthropic : Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Compatibilité Anthropic : count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Compatibilité Anthropic : liste des modèles |

---

## Points de terminaison du protocole Gemini

Ces points de terminaison sont compatibles avec le format de l'API Google Gemini et peuvent être utilisés directement avec le SDK officiel Google.

| Méthode | Chemin | Point d'entrée de routage (handler Rust) | Notes |
| --- | --- | --- | --- |
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Gemini natif : liste des modèles |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Gemini natif : GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Gemini natif : generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Gemini natif : countTokens |

::: warning Note sur le chemin
`/v1beta/models/:model` enregistre à la fois GET et POST sur le même chemin (voir définition du routage).
:::

---

## Points de terminaison MCP

Les points de terminaison MCP (Model Context Protocol) servent à exposer l'interface « appel d'outils » (géré par `handlers::mcp::*`). S'ils sont activés et leur comportement spécifique dépendent de la configuration ; pour plus de détails, voir [Points de terminaison MCP](../../platforms/mcp/).

| Méthode | Chemin | Point d'entrée de routage (handler Rust) | Notes |
| --- | --- | --- | --- |
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP : Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP : Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP : z.ai MCP Server |

::: details Notes sur MCP
Pour la portée et les limites de la disponibilité de MCP, voir [Limites des capacités d'intégration z.ai (implémenté vs explicitement non implémenté)](../zai-boundaries/).
:::

---

## Points de terminaison internes et auxiliaires

Ces points de terminaison sont utilisés pour les fonctions internes du système et la surveillance externe.

| Méthode | Chemin | Point d'entrée de routage (handler Rust) | Notes |
| --- | --- | --- | --- |
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | Point de terminaison de préchauffage interne |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | Interception des journaux de télémétrie : renvoie directement 200 |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | Interception des journaux de télémétrie : renvoie directement 200 |
| GET | `/healthz` | `health_check_handler` | Contrôle de santé : renvoie `{"status":"ok"}` |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | Détection automatique de modèle |

::: tip Traitement silencieux
Les points de terminaison des journaux d'événements renvoient directement `200 OK` sans traitement réel, servant à intercepter les rapports de télémétrie des clients.
:::

::: warning Ces points de terminaison nécessitent-ils une API Key ?
À l'exception possible de `GET /healthz`, si les autres routes nécessitent une clé dépend du « mode valide » de `proxy.auth_mode` (voir ci-dessous « Mode d'authentification » et `auth_middleware` dans le code source).
:::

---

## Mode d'authentification

Les droits d'accès à tous les points de terminaison sont contrôlés par `proxy.auth_mode` :

| Mode | Description | `/healthz` exige l'authentification ? | Autres points de terminaison exigent l'authentification ? |
| --- | --- | --- | --- |
| `off` | Entièrement ouvert | ❌ Non | ❌ Non |
| `strict` | Tous nécessitent l'authentification | ✅ Oui | ✅ Oui |
| `all_except_health` | Seul le contrôle de santé est ouvert | ❌ Non | ✅ Oui |
| `auto` | Jugement automatique (défaut) | ❌ Non | Dépend de `allow_lan_access` |

::: info Logique du mode auto
`auto` n'est pas une stratégie indépendante mais dérivée de la configuration : lorsque `proxy.allow_lan_access=true`, il équivaut à `all_except_health`, sinon à `off` (voir `docs/proxy/auth.md`).
:::

**Format de la demande d'authentification** :

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (style OpenAI)
curl -H "x-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (style Gemini)
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (style OpenAI)
curl.exe -H "x-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (style Gemini)
curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## Résumé de cette section

Antigravity Tools fournit un ensemble complet de points de terminaison compatibles multi-protocoles, prenant en charge les trois formats d'API principaux OpenAI, Anthropic et Gemini, ainsi que l'extension d'appels d'outils MCP.

- **Intégration rapide** : Priorisez les points de terminaison du protocole OpenAI pour une compatibilité maximale
- **Fonctionnalités natives** : Utilisez les points de terminaison du protocole Anthropic lorsque vous avez besoin des fonctionnalités complètes de Claude Code
- **Écosystème Google** : Choisissez les points de terminaison du protocole Gemini lors de l'utilisation du SDK officiel Google
- **Configuration de sécurité** : Sélectionnez le mode d'authentification approprié selon le scénario d'utilisation (local/LAN/public)

---

## Aperçu du prochain chapitre

> Dans le prochain chapitre, nous étudierons **[Données et modèles](../storage-models/)**.
>
> Vous apprendrez :
> - La structure de stockage des fichiers de compte
> - La structure de la base de données de statistiques SQLite
> - Les définitions des champs clés et les stratégies de sauvegarde

---

## Annexe : référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Enregistrement des routes (tous les points de terminaison) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Middleware d'authentification (compatibilité Header + exemption `/healthz` + autorisation OPTIONS) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| Modes auth_mode et règles de dérivation auto | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| Valeur de retour `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Interception des journaux de télémétrie (silent 200) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**Fonctions clés** :
- `AxumServer::start()` : Démarre le serveur Axum et enregistre les routes (lignes 79-254)
- `health_check_handler()` : Traitement du contrôle de santé (lignes 266-272)
- `silent_ok_handler()` : Traitement silencieux réussi (lignes 274-277)

</details>
