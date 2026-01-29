---
title: "404 Base URL: Configuration | Antigravity-Manager"
sidebarTitle: "Corriger les 404 de chemin"
subtitle: "404/Incompatibilité de chemins : Base URL, préfixe /v1 et clients à chemins imbriqués"
description: "Apprenez à résoudre les problèmes d'incompatibilité de chemins 404 lors de l'intégration d'Antigravity Tools. Maîtrisez la configuration correcte de la Base URL, évitez les duplications de préfixe /v1, gérez les clients à chemins imbriqués, couvrant les scénarios courants."
tags:
  - "faq"
  - "base-url"
  - "404"
  - "openai"
  - "anthropic"
  - "gemini"
prerequisite:
  - "start-proxy-and-first-client"
  - "faq-auth-401"
order: 4
---

# 404/Incompatibilité de chemins : Base URL, préfixe /v1 et clients à chemins imbriqués

## Ce que vous apprendrez

- Identifier si un 404 est un "problème de concaténation de Base URL" ou un "problème d'authentification/service non démarré"
- Choisir la bonne Base URL selon le type de client (avec ou sans `/v1`)
- Reconnaître deux pièges fréquents : préfixes en double (`/v1/v1/...`) et chemins imbriqués (`/v1/chat/completions/responses`)

## Votre problème actuel

Lors de l'intégration de clients externes, vous rencontrez une erreur `404 Not Found` et, après investigation, vous découvrez que c'est un problème de configuration de la Base URL :

- Kilo Code échoue, les journaux montrent que `/v1/chat/completions/responses` est introuvable
- Claude Code se connecte mais indique toujours une incompatibilité de chemin
- Le SDK OpenAI Python renvoie `404`, alors que le service est clairement démarré

La racine de ces problèmes n'est pas le quota de compte ou l'authentification, mais le fait que le client concatène "son propre chemin" à la Base URL que vous avez définie, ce qui rend le chemin incorrect.

## Quand utiliser cette méthode

- Vous avez confirmé que le reverse proxy est démarré, mais tous les appels renvoient 404
- Vous avez défini une Base URL avec un chemin (comme `/v1/...`), mais vous ne savez pas si le client va la concaténer à nouveau
- Le client que vous utilisez a "sa propre logique de concaténation de chemin" et les requêtes résultantes ne ressemblent pas aux chemins standards OpenAI/Anthropic/Gemini

## 🎒 Préparatifs

Excluez d'abord "service non démarré/échec d'authentification", sinon vous allez tourner en rond dans la mauvaise direction.

### Étape 1 : Confirmez que le reverse proxy fonctionne

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/healthz
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/healthz | Select-Object -ExpandProperty Content
```

:::

**Ce que vous devriez voir** : HTTP 200, JSON retourné (au moins `{"status":"ok"}`).

### Étape 2 : Confirmez que vous rencontrez bien un 404 (pas un 401)

Si vous n'avez pas fourni de clé en mode `auth_mode=strict/all_except_health/auto(allow_lan_access=true)`, vous rencontrerez plus probablement un 401. Vérifiez d'abord le code d'état et, si nécessaire, terminez d'abord **[Dépannage 401 échec d'authentification](../auth-401/)**.

## Qu'est-ce que la Base URL ?

**Base URL** est l'"adresse racine" utilisée par le client pour envoyer des requêtes. Les clients concatènent généralement leur propre chemin d'API à la fin de la Base URL avant d'envoyer la requête. Par conséquent, que la Base URL doive ou non inclure `/v1` dépend du chemin que le client va ajouter. Tant que vous alignez le chemin final sur les routes d'Antigravity Tools, vous ne serez plus bloqué par des 404.

## Idée centrale

Les routes du reverse proxy d'Antigravity Tools sont "toutes codées en dur" (voir `src-tauri/src/proxy/server.rs`), les points d'entrée courants sont :

| Protocole | Chemin | Usage |
| --- | --- | --- |
| OpenAI | `/v1/models` | Lister les modèles |
| OpenAI | `/v1/chat/completions` | Complétions de chat |
| OpenAI | `/v1/responses` | Compatibilité Codex CLI |
| Anthropic | `/v1/messages` | API de messages Claude |
| Gemini | `/v1beta/models` | Lister les modèles |
| Gemini | `/v1beta/models/:model` | Générer du contenu |
| Vérification de santé | `/healthz` | Endpoint de sondage |

Ce que vous devez faire : faire en sorte que le "chemin final" concaténé par le client corresponde exactement à ces routes.

---

## Suivez le guide

### Étape 1 : Testez d'abord avec curl le "chemin correct"

**Pourquoi**
Confirmez d'abord que "le protocole que vous utilisez" a bien une route correspondante localement, pour éviter de confondre un 404 avec un "problème de modèle/compte".

::: code-group

```bash [macOS/Linux]
 # Protocole OpenAI : lister les modèles
curl -i http://127.0.0.1:8045/v1/models

 # Protocole Anthropic : endpoint de messages (vérifier seulement 404/401, pas obligé de réussir)
curl -i http://127.0.0.1:8045/v1/messages

 # Protocole Gemini : lister les modèles
curl -i http://127.0.0.1:8045/v1beta/models
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/models | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/messages | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1beta/models | Select-Object -ExpandProperty StatusCode
```

:::

**Ce que vous devriez voir** : ces chemins ne devraient pas être 404. Si vous voyez un 401, configurez d'abord la clé en suivant **[Dépannage 401 échec d'authentification](../auth-401/)**.

### Étape 2 : Choisissez la Base URL selon "si le client ajoute /v1 lui-même"

**Pourquoi**
Le piège de la Base URL est essentiellement que "votre chemin" et "le chemin ajouté par le client" se superposent.

| Ce que vous utilisez | Base URL recommandée | La route sur laquelle vous vous alignez |
| --- | --- | --- |
| SDK OpenAI (Python/Node, etc.) | `http://127.0.0.1:8045/v1` | `/v1/chat/completions`, `/v1/models` |
| Claude Code CLI (Anthropic) | `http://127.0.0.1:8045` | `/v1/messages` |
| SDK Gemini / clients en mode Gemini | `http://127.0.0.1:8045` | `/v1beta/models/*` |

::: tip Astuce
Le SDK OpenAI vous demande généralement de mettre `/v1` dans la Base URL ; Anthropic/Gemini écrivent plus souvent seulement host:port.
:::

### Étape 3 : Gérer les clients "à chemins imbriqués" comme Kilo Code

**Pourquoi**
Antigravity Tools n'a pas la route `/v1/chat/completions/responses`. Si un client génère ce chemin, c'est garanti 404.

Suivez la configuration recommandée dans le README :

1. Choix de protocole : privilégiez le **protocole Gemini**
2. Base URL : entrez `http://127.0.0.1:8045`

**Ce que vous devriez voir** : les requêtes utiliseront les chemins `/v1beta/models/...`, et `/v1/chat/completions/responses` n'apparaîtra plus.

### Étape 4 : N'écrivez pas la Base URL jusqu'à un "chemin de ressource spécifique"

**Pourquoi**
La plupart des SDK concatènent leur propre chemin de ressource après la Base URL. Si vous écrivez la Base URL trop profondément, cela finira par devenir un "chemin à double niveau".

✅ Recommandé (SDK OpenAI) :

```text
http://127.0.0.1:8045/v1
```

❌ Erreur courante :

```text
http://127.0.0.1:8045
http://127.0.0.1:8045/v1/chat/completions
```

**Ce que vous devriez voir** : après avoir rendu la Base URL moins profonde, les chemins de requête reviennent à `/v1/...` ou `/v1beta/...`, et le 404 disparaît.

---

## Point de contrôle ✅

Vous pouvez utiliser ce tableau pour vérifier rapidement si votre "chemin de requête final" peut correspondre aux routes d'Antigravity Tools :

| Chemin que vous voyez dans les journaux | Conclusion |
| --- | --- |
| Commence par `/v1/` (comme `/v1/models`, `/v1/chat/completions`) | Utilise les routes compatibles OpenAI/Anthropic |
| Commence par `/v1beta/` (comme `/v1beta/models/...`) | Utilise les routes natives Gemini |
| Apparaît `/v1/v1/` | La Base URL contenait `/v1`, le client l'a ajouté à nouveau |
| Apparaît `/v1/chat/completions/responses` | Client à chemins imbriqués, la table de routage actuelle ne le prend pas en charge |

---

## Attention aux pièges courants

### Piège 1 : Préfixe /v1 en double

**Erreur** : le chemin devient `/v1/v1/chat/completions`

**Cause** : la Base URL contenait déjà `/v1`, le client l'a ajouté à nouveau.

**Solution** : changez la Base URL pour qu'elle s'arrête à `/v1`, n'écrivez pas de chemin de ressource spécifique ensuite.

### Piège 2 : Clients à chemins imbriqués

**Erreur** : le chemin devient `/v1/chat/completions/responses`

**Cause** : le client a ajouté un chemin métier au-dessus du chemin du protocole OpenAI.

**Solution** : privilégiez le basculement vers un autre mode de protocole du client (par exemple, Kilo Code en mode Gemini).

### Piège 3 : Mauvais port

**Erreur** : `Connection refused` ou timeout

**Solution** : dans la page "API reverse proxy" d'Antigravity Tools, confirmez le port d'écoute actuel (par défaut 8045), le port de la Base URL doit correspondre.

---

## Résumé de la leçon

| Phénomène | Cause la plus fréquente | Ce que vous devriez modifier |
| --- | --- | --- |
| 404 constant | Concaténation incorrecte de la Base URL | Vérifiez d'abord avec curl que `/v1/models`/`/v1beta/models` ne renvoient pas 404 |
| `/v1/v1/...` | `/v1` en double | Gardez la Base URL du SDK OpenAI qui se termine par `/v1` |
| `/v1/chat/completions/responses` | Client à chemins imbriqués | Passez au protocole Gemini ou faites une réécriture de chemin (non recommandé pour les débutants) |

---

## Prochaine leçon

> Dans la prochaine leçon, nous apprenons **[Interruption de streaming et problème 0 Token](../streaming-0token/)**
>
> Vous apprendrez :
> - Pourquoi les réponses en streaming s'interrompent de manière inattendue
> - Comment dépanner les erreurs 0 Token
> - Le mécanisme de repli automatique d'Antigravity

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Définition des routes du reverse proxy (table de routage complète) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| `AxumServer::start()` (point d'entrée de la construction des routes) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L79-L216) | 79-216 |
| `health_check_handler()` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| README : Base URL recommandée pour Claude Code | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L204) | 197-204 |
| README : explication des chemins imbriqués Kilo Code et protocole recommandé | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L206-L211) | 206-211 |
| README : exemple de base_url pour le SDK OpenAI Python | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L213-L227) | 213-227 |

**Fonctions clés** :
- `AxumServer::start()`: Démarre le serveur de reverse proxy Axum et enregistre toutes les routes externes
- `health_check_handler()`: Gestionnaire de vérification de santé (`GET /healthz`)

</details>
