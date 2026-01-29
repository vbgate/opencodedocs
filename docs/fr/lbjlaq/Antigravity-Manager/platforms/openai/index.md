---
title: "API OpenAI : Configuration de l'intégration | Antigravity-Manager"
sidebarTitle: "Connecter le SDK OpenAI en 5 minutes"
subtitle: "API OpenAI : Configuration de l'intégration"
description: "Apprenez à configurer l'intégration de l'API compatible OpenAI. Maîtrisez la conversion des routes, la configuration du base_url et le dépannage des erreurs 401/404/429, pour utiliser rapidement les outils Antigravity."
tags:
  - "OpenAI"
  - "Proxy API"
  - "Chat Completions"
  - "Responses"
  - "Outils Antigravity"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 1
---

# API compatible OpenAI : Stratégies de déploiement pour /v1/chat/completions et /v1/responses

Vous utiliserez cette **API compatible OpenAI** pour connecter directement les SDK/clients OpenAI existants à la passerelle locale des outils Antigravity. L'objectif principal est de faire fonctionner `/v1/chat/completions` et `/v1/responses`, et d'apprendre à résoudre les problèmes rapidement grâce aux en-têtes de réponse.

## Ce que vous pourrez faire après ce cours

- Connecter le SDK OpenAI (ou curl) directement à la passerelle locale des outils Antigravity
- Faire fonctionner `/v1/chat/completions` (avec `stream: true`) et `/v1/responses`
- Comprendre la liste des modèles de `/v1/models` et l'en-tête de réponse `X-Mapped-Model`
- Savoir quoi vérifier en priorité en cas d'erreurs 401/404/429

## Votre situation actuelle

De nombreux clients/SDK ne reconnaissent que la forme des interfaces OpenAI : des URL fixes, des champs JSON fixes et un format de flux SSE fixe.
L'objectif des outils Antigravity n'est pas de vous faire modifier vos clients, mais de faire croire aux clients qu'ils communiquent avec OpenAI, tout en convertissant les requêtes en appels en amont internes, puis en reconvertissant les résultats au format OpenAI.

## Quand utiliser cette approche

- Vous disposez déjà d'un ensemble d'outils ne supportant que OpenAI (plugins IDE, scripts, bots, SDK) et vous ne souhaitez pas écrire une nouvelle intégration pour chacun
- Vous souhaitez utiliser un `base_url` unique pour diriger les requêtes vers une passerelle locale (ou réseau local), la passerelle gérant ensuite la planification des comptes, les nouvelles tentatives et la surveillance

## 🎒 Préparatifs avant de commencer

::: warning Conditions préalables
- Vous avez déjà démarré le service de proxy inverse dans la page "API Proxy" d'Antigravity Tools et avez noté le port (par exemple `8045`)
- Vous avez ajouté au moins un compte disponible, sinon le proxy ne peut pas obtenir de jeton en amont
:::

::: info Comment transmettre l'authentification ?
Lorsque vous activez `proxy.auth_mode` et configurez `proxy.api_key`, la requête doit inclure une API Key.

Le middleware des outils Antigravity lit d'abord `Authorization`, et est également compatible avec `x-api-key` et `x-goog-api-key`. (Implémentation dans `src-tauri/src/proxy/middleware/auth.rs`)
:::

## Qu'est-ce que l'API compatible OpenAI ?

L'**API compatible OpenAI** est un ensemble de routes HTTP et de protocoles JSON/SSE qui "ressemblent à OpenAI". Les clients envoient des requêtes au format OpenAI vers la passerelle locale, qui convertit ensuite les requêtes en appels en amont internes et reconvertit les réponses en amont au format de réponse OpenAI, permettant aux SDK OpenAI existants de fonctionner sans modification majeure.

### Aperçu des points de terminaison compatibles (liés à ce cours)

| Point de terminaison | Utilisation | Preuve dans le code |
| --- | --- | --- |
| `POST /v1/chat/completions` | Chat Completions (avec flux) | Enregistrement de route dans `src-tauri/src/proxy/server.rs` ; `src-tauri/src/proxy/handlers/openai.rs` |
| `POST /v1/completions` | Completions héritées (réutilisation du même gestionnaire) | Enregistrement de route dans `src-tauri/src/proxy/server.rs` |
| `POST /v1/responses` | Compatibilité Responses/Codex CLI (réutilisation du même gestionnaire) | Enregistrement de route dans `src-tauri/src/proxy/server.rs` (commentaire : compatibilité Codex CLI) |
| `GET /v1/models` | Retourne la liste des modèles (avec mappage personnalisé + génération dynamique) | `src-tauri/src/proxy/handlers/openai.rs` + `src-tauri/src/proxy/common/model_mapping.rs` |

## Suivez les étapes

### Étape 1 : Vérifiez que le service fonctionne avec curl (/healthz + /v1/models)

**Pourquoi**
Éliminez d'abord les problèmes élémentaires comme "service non démarré/port incorrect/bloqué par le pare-feu".

```bash
 # 1) Vérification de santé
curl -s http://127.0.0.1:8045/healthz

 # 2) Récupération de la liste des modèles
curl -s http://127.0.0.1:8045/v1/models
```

**Ce que vous devriez voir** : `/healthz` retourne quelque chose comme `{"status":"ok"}` ; `/v1/models` retourne `{"object":"list","data":[...]}`.

### Étape 2 : Appelez /v1/chat/completions avec le SDK OpenAI Python

**Pourquoi**
Cette étape prouve que toute la chaîne "SDK OpenAI → passerelle locale → en amont → conversion de réponse OpenAI" fonctionne.

```python
import openai

client = openai.OpenAI(
    api_key="sk-antigravity",
    base_url="http://127.0.0.1:8045/v1",
)

response = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Bonjour, présentez-vous"}],
)

print(response.choices[0].message.content)
```

**Ce que vous devriez voir** : Le terminal affiche un texte de réponse du modèle.

### Étape 3 : Activez le flux pour confirmer le retour SSE

**Pourquoi**
De nombreux clients dépendent du protocole SSE d'OpenAI (`Content-Type: text/event-stream`). Cette étape confirme que le flux et le format des événements sont disponibles.

```bash
curl -N http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "stream": true,
    "messages": [
      {"role": "user", "content": "Expliquez en trois phrases ce qu'est un proxy inverse local"}
    ]
  }'
```

**Ce que vous devriez voir** : Le terminal affiche en continu des lignes commençant par `data: { ... }`, se terminant par `data: [DONE]`.

### Étape 4 : Utilisez /v1/responses (style Codex/Responses) pour une requête

**Pourquoi**
Certains outils utilisent `/v1/responses` ou des champs comme `instructions` et `input` dans le corps de la requête. Ce projet "normalise" ce type de requête en `messages` puis réutilise la même logique de conversion. (Gestionnaire dans `src-tauri/src/proxy/handlers/openai.rs`)

```bash
curl -s http://127.0.0.1:8045/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "instructions": "Vous êtes un réviseur de code rigoureux.",
    "input": "Indiquez le bug le plus probable dans le code suivant :\n\nfunction add(a, b) { return a - b }"
  }'
```

**Ce que vous devriez voir** : Le corps de la réponse est un objet au format OpenAI (ce projet convertira la réponse Gemini en `choices[].message.content` d'OpenAI).

### Étape 5 : Vérifiez que le routage des modèles fonctionne (voir l'en-tête X-Mapped-Model)

**Pourquoi**
Le `model` que vous écrivez dans le client n'est pas nécessairement le "modèle physique" réellement appelé. La passerelle effectue d'abord un mappage de modèles (incluant le mappage personnalisé/les caractères génériques, voir [Routage des modèles : mappage personnalisé, priorité des caractères génériques et stratégies prédéfinies](/fr/lbjlaq/Antigravity-Manager/advanced/model-router/)), puis place le résultat final dans l'en-tête de réponse pour faciliter le dépannage.

```bash
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "salut"}]
  }'
```

**Ce que vous devriez voir** : L'en-tête de réponse contient `X-Mapped-Model: ...` (par exemple mappé vers `gemini-2.5-flash`), et peut également contenir `X-Account-Email: ...`.

## Point de contrôle ✅

- `GET /healthz` retourne `{"status":"ok"}` (ou JSON équivalent)
- `GET /v1/models` retourne `object=list` et `data` est un tableau
- La requête non flux `/v1/chat/completions` peut obtenir `choices[0].message.content`
- Avec `stream: true`, vous recevez SSE, se terminant par `[DONE]`
- `curl -i` peut voir l'en-tête de réponse `X-Mapped-Model`

## Pièges à éviter

### 1) Base URL incorrect entraîne 404 (le plus courant)

- Dans les exemples du SDK OpenAI, `base_url` doit se terminer par `/v1` (voir l'exemple Python du README du projet).
- Certains clients "empilent les chemins". Par exemple, le README mentionne explicitement : Kilo Code en mode OpenAI peut construire des chemins non standards comme `/v1/chat/completions/responses`, déclenchant ainsi une erreur 404.

### 2) 401 : ce n'est pas que l'en amont est en panne, c'est que vous n'avez pas fourni de clé ou que le mode est incorrect

Lorsque le "mode valide" de la stratégie d'authentification n'est pas `off`, le middleware vérifie les en-têtes de requête : `Authorization: Bearer <proxy.api_key>`, et est également compatible avec `x-api-key` et `x-goog-api-key`. (Implémentation dans `src-tauri/src/proxy/middleware/auth.rs`)

::: tip Indication sur le mode d'authentification
Avec `auth_mode = auto`, la décision est automatique selon `allow_lan_access` :
- `allow_lan_access = true` → mode valide = `all_except_health` (authentification requise sauf pour `/healthz`)
- `allow_lan_access = false` → mode valide = `off` (pas d'authentification pour l'accès local)
:::

### 3) 429/503/529 : le proxy fait des nouvelles tentatives + rotation de comptes, mais le "pool peut être épuisé"

Le gestionnaire OpenAI intègre jusqu'à 3 tentatives (et est limité par la taille du pool de comptes), en cas de certaines erreurs il attend/rotate les comptes pour réessayer. (Implémentation dans `src-tauri/src/proxy/handlers/openai.rs`)

## Résumé du cours

- `/v1/chat/completions` est le point d'intégration le plus universel, `stream: true` utilise SSE
- `/v1/responses` et `/v1/completions` utilisent le même gestionnaire de compatibilité, la clé est de normaliser d'abord la requête en `messages`
- `X-Mapped-Model` vous aide à confirmer le résultat du mappage "nom du modèle client → modèle physique final"

## Prochain cours

> Dans le prochain cours, nous continuerons avec **API compatible Anthropic : /v1/messages et les contrats clés de Claude Code** (chapitre correspondant : `platforms-anthropic`).

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Enregistrement des routes OpenAI (incluant /v1/responses) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Gestionnaire Chat Completions (incluant la détection du format Responses) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L70-L462) | 70-462 |
| Gestionnaire /v1/completions et /v1/responses (normalisation Codex/Responses + nouvelles tentatives/rotation) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L464-L1080) | 464-1080 |
| Retour de /v1/models (liste dynamique de modèles) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1082-L1102) | 1082-1102 |
| Structure de données de requête OpenAI (messages/instructions/input/size/quality) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L7-L38) | 7-38 |
| Conversion OpenAI -> Gemini de la requête (systemInstruction/thinkingConfig/tools) | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L6-L553) | 6-553 |
| Conversion Gemini -> OpenAI de la réponse (choices/usageMetadata) | [`src-tauri/src/proxy/mappers/openai/response.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/response.rs#L5-L214) | 5-214 |
| Mappage de modèles et priorité des caractères génériques (exact > générique > défaut) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
| Middleware d'authentification (Authorization/x-api-key/x-goog-api-key) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |

**Constantes clés** :
- `MAX_RETRY_ATTEMPTS = 3` : nombre maximum de tentatives pour le protocole OpenAI (incluant la rotation) (voir `src-tauri/src/proxy/handlers/openai.rs`)

**Fonctions clés** :
- `transform_openai_request(...)` : convertit le corps de la requête OpenAI en requête en amont interne (voir `src-tauri/src/proxy/mappers/openai/request.rs`)
- `transform_openai_response(...)` : convertit la réponse en amont en `choices`/`usage` d'OpenAI (voir `src-tauri/src/proxy/mappers/openai/response.rs`)

</details>
