---
title: "API Gemini : Intégration de la passerelle locale | Antigravity-Manager"
subtitle: "Intégration API Gemini : Connecter le SDK Google directement à la passerelle locale"
sidebarTitle: "Connexion directe Gemini locale"
description: "Apprenez l'intégration de la passerelle locale Gemini d'Antigravity-Manager. Maîtrisez les appels generateContent et streamGenerateContent via le point de terminaison /v1beta/models, et validez avec cURL et Python."
tags:
  - "Gemini"
  - "SDK Google"
  - "Proxy API"
  - "v1beta"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 3
---

# Intégration API Gemini : Connecter le SDK Google directement à la passerelle locale

## Ce que vous pourrez faire après ce cours

- Intégrer vos clients en utilisant les points de terminaison natifs Gemini (`/v1beta/models/*`) exposés par Antigravity Tools
- Appeler la passerelle locale avec les chemins de style Google `:generateContent` / `:streamGenerateContent`
- Comprendre pourquoi `x-goog-api-key` peut être utilisé directement lorsque l'authentification Proxy est activée

## Votre situation actuelle

Vous avez peut-être déjà démarré le proxy inverse local, mais vous bloquez dès que vous arrivez à Gemini :

- Le SDK Google appelle par défaut `generativelanguage.googleapis.com`, comment le changer pour votre propre `http://127.0.0.1:<port>` ?
- Les chemins Gemini ont des deux-points (`models/<model>:generateContent`), beaucoup de clients les concatènent et obtiennent 404
- Vous avez activé l'authentification du proxy, mais le client Google n'envoie pas `x-api-key`, donc vous obtenez toujours 401

## Quand utiliser cette approche

- Vous souhaitez utiliser le "protocole natif Gemini" plutôt que la couche de compatibilité OpenAI/Anthropic
- Vous disposez déjà de clients de style Google/tiers et souhaitez migrer vers la passerelle locale à moindre coût

## 🎒 Préparatifs avant de commencer

::: warning Conditions préalables
- Vous avez déjà ajouté au moins 1 compte dans l'application (sinon le backend ne peut pas obtenir le jeton d'accès en amont)
- Vous avez déjà démarré le service de proxy inverse local et connaissez le port d'écoute (par défaut `8045`)
:::

## Idée principale

Antigravity Tools expose les chemins natifs Gemini sur le serveur Axum local :

- Liste : `GET /v1beta/models`
- Appel : `POST /v1beta/models/<model>:generateContent`
- Flux : `POST /v1beta/models/<model>:streamGenerateContent`

Le backend enveloppera le corps de la requête native Gemini dans une structure v1internal (en injectant `project`, `requestId`, `requestType`, etc.), puis transférera vers le point de terminaison en amont v1internal de Google (en incluant le jeton d'accès du compte). (Code source : `src-tauri/src/proxy/mappers/gemini/wrapper.rs`, `src-tauri/src/proxy/upstream/client.rs`)

::: info Pourquoi le base URL recommandé dans le tutoriel utilise-t-il 127.0.0.1 ?
L'exemple d'intégration rapide de l'application utilise `127.0.0.1` pour éviter les problèmes de délai de résolution IPv6 dans certains environnements. (Code source : `src/pages/ApiProxy.tsx`)
:::

## Suivez les étapes

### Étape 1 : Vérifiez que la passerelle est en ligne (/healthz)

**Pourquoi**
Confirmez d'abord que le service est en ligne, puis résolvez les problèmes de protocole/authentification pour gagner du temps.

::: code-group

```bash [macOS/Linux]
curl -s "http://127.0.0.1:8045/healthz"
```

```powershell [Windows]
Invoke-RestMethod "http://127.0.0.1:8045/healthz"
```

:::

**Ce que vous devriez voir** : Retourne JSON, contenant `{"status":"ok"}` (code source : `src-tauri/src/proxy/server.rs`).

### Étape 2 : Listez les modèles Gemini (/v1beta/models)

**Pourquoi**
Vous devez d'abord confirmer quel est "l'ID de modèle exposé", tous les `<model>` suivants seront basés sur ceci.

```bash
curl -s "http://127.0.0.1:8045/v1beta/models" | head
```

**Ce que vous devriez voir** : La réponse contient un tableau `models`, chaque élément a un `name` similaire à `models/<id>` (code source : `src-tauri/src/proxy/handlers/gemini.rs`).

::: tip Important
Quel champ utiliser pour l'ID de modèle ?
- ✅ Utilisez le champ `displayName` (comme `gemini-2.0-flash`)
- ✅ Ou retirez le préfixe `models/` du champ `name`
- ❌ Ne copiez pas directement la valeur complète du champ `name` (cela entraînerait des erreurs de chemin)

Si vous copiez le champ `name` (comme `models/gemini-2.0-flash`) comme ID de modèle, le chemin de la requête deviendra `/v1beta/models/models/gemini-2.0-flash:generateContent`, ce qui est incorrect. (Code source : `src-tauri/src/proxy/common/model_mapping.rs`)
:::

::: warning Important
L'actuel `/v1beta/models` est un retour "déguisant la liste dynamique de modèles locaux en liste de modèles Gemini", ce n'est pas une extraction en temps réel depuis l'amont. (Code source : `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Étape 3 : Appelez generateContent (chemin avec deux-points)

**Pourquoi**
La clé de l'API REST native Gemini est `:generateContent` comme "action avec deux-points". Le backend analysera `model:method` dans la même route. (Code source : `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -s \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:generateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Bonjour"}]}
    ]
  }'
```

**Ce que vous devriez voir** : La réponse JSON contient `candidates` (ou il y a `response.candidates` à l'extérieur, le proxy déballera).

### Étape 4 : Appelez streamGenerateContent (SSE)

**Pourquoi**
Le flux est plus stable pour les "longues sorties/grands modèles". Le proxy transférera le SSE en amont vers votre client et définira `Content-Type: text/event-stream`. (Code source : `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -N \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:streamGenerateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Racontez-moi une courte histoire"}]}
    ]
  }'
```

**Ce que vous devriez voir** : Le terminal affiche en continu des lignes SSE au format `data: {...}`, dans des circonstances normales, `data: [DONE]` apparaîtra à la fin (indiquant la fin du flux).

::: tip Note
`data: [DONE]` est le marqueur de fin standard SSE, mais **n'apparaît pas toujours** :
- Si l'amont se termine normalement et envoie `[DONE]`, le proxy le transférera
- Si l'amont se déconnecte anormalement, expire ou envoie d'autres signaux de fin, le proxy n'enverra pas `[DONE]`

Le code client devrait gérer selon le standard SSE : rencontrer `data: [DONE]` ou la déconnexion de la connexion devrait être considéré comme la fin du flux. (Code source : `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Étape 5 : Connectez le SDK Google Python directement à la passerelle locale

**Pourquoi**
C'est le chemin d'exemple "intégration rapide" donné dans l'interface du projet : utilisez le paquet Python Google Generative AI pour diriger `api_endpoint` vers votre adresse de proxy inverse locale. (Code source : `src/pages/ApiProxy.tsx`)

```python
#Installation requise : pip install google-generativeai
import google.generativeai as genai

genai.configure(
    api_key="YOUR_PROXY_API_KEY",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

model = genai.GenerativeModel('<modelId>')
response = model.generate_content("Bonjour")
print(response.text)
```

**Ce que vous devriez voir** : Le programme affiche un texte de réponse du modèle.

## Point de contrôle ✅

- `/healthz` peut retourner `{"status":"ok"}`
- `/v1beta/models` peut lister les modèles (au moins 1)
- `:generateContent` peut retourner `candidates`
- `:streamGenerateContent` retourne `Content-Type: text/event-stream` et peut continuer à envoyer du flux

## Pièges à éviter

- **401 persiste** : si vous avez activé l'authentification mais que `proxy.api_key` est vide, le backend rejettera directement la requête. (Code source : `src-tauri/src/proxy/middleware/auth.rs`)
- **Quelle clé dans l'en-tête** : le proxy reconnaîtra simultanément `Authorization`, `x-api-key`, `x-goog-api-key`. Donc "les clients de style Google n'envoient que `x-goog-api-key`" fonctionnera aussi. (Code source : `src-tauri/src/proxy/middleware/auth.rs`)
- **countTokens retourne toujours 0** : l'actuel `POST /v1beta/models/<model>/countTokens` retourne fixe `{"totalTokens":0}`, c'est une implémentation fictive. (Code source : `src-tauri/src/proxy/handlers/gemini.rs`)

## Résumé du cours

- Vous devez vous connecter à `/v1beta/models/*`, pas `/v1/*`
- L'écriture clé du chemin est `models/<modelId>:generateContent` / `:streamGenerateContent`
- Lorsque l'authentification est activée, `x-goog-api-key` est un en-tête de requête explicitement supporté par le proxy

## Prochain cours

> Dans le prochain cours, nous apprenrons **[Génération d'images Imagen 3 : mappage automatique des paramètres size/quality de l'API OpenAI Images](../imagen/)**.

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Enregistrement des routes Gemini (/v1beta/models/*) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L181) | 170-181 |
| Analyse de l'ID de modèle et routage (pourquoi le préfixe `models/` entraîne des erreurs de routage) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L58-L77) | 58-77 |
| Analyse de `model:method` + logique principale generate/stream | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L14-L337) | 14-337 |
| Logique de sortie SSE (transférer `[DONE]` plutôt que renvoyer automatiquement) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L161-L183) | 161-183 |
| Structure de retour `/v1beta/models` (fausse liste dynamique de modèles) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L39-L71) | 39-71 |
| Implémentation fictive `countTokens` (fixe 0) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L73-L79) | 73-79 |
| Compatibilité des en-têtes d'authentification (incluant `x-goog-api-key`) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |
| Exemple Python du SDK Google (`api_endpoint` vers la passerelle locale) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L692-L734) | 692-734 |
| Empreinte de session Gemini (adhérence/cache avec session_id) | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L121-L158) | 121-158 |
| Enveloppement v1internal de la requête Gemini (injection de project/requestId/requestType, etc.) | [`src-tauri/src/proxy/mappers/gemini/wrapper.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/gemini/wrapper.rs#L5-L160) | 5-160 |
| Point de terminaison en amont v1internal et fallback | [`src-tauri/src/proxy/upstream/client.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/client.rs#L8-L182) | 8-182 |

**Constantes clés** :
- `MAX_RETRY_ATTEMPTS = 3` : limite maximum de rotations pour les requêtes Gemini (code source : `src-tauri/src/proxy/handlers/gemini.rs`)

</details>
