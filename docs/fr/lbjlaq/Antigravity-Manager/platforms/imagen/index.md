---
title: "Utiliser l'API OpenAI Images pour appeler Imagen 3 : Mappage des paramètres | Antigravity"
sidebarTitle: "Appeler selon les habitudes OpenAI"
subtitle: "Génération d'images Imagen 3 : Mappage automatique des paramètres size/quality de l'API OpenAI Images"
description: "Apprenez à appeler Imagen 3 avec l'API OpenAI Images, maîtrisez le mappage des paramètres. size(largeurxhauteur) contrôle le ratio, quality contrôle la qualité, prend en charge le retour b64_json et url."
tags:
  - "Imagen 3"
  - "API OpenAI Images"
  - "Génération d'images"
  - "Gemini"
  - "Outils Antigravity"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-security"
duration: 12
order: 4
---

# Génération d'images Imagen 3 : Mappage automatique des paramètres size/quality de l'API OpenAI Images

Vous souhaitez appeler Imagen 3 selon les habitudes de l'API OpenAI Images ? Le proxy inverse local d'Antigravity Tools fournit `/v1/images/generations`, et mappe automatiquement `size` / `quality` vers les paramètres de ratio et de résolution requis par Imagen 3.

## Ce que vous pourrez faire après ce cours

- Générer des images Imagen 3 avec `POST /v1/images/generations`, sans modifier les habitudes d'appel des clients/SDK OpenAI existants
- Contrôler stably `aspectRatio` (16:9, 9:16, etc.) avec `size: "WIDTHxHEIGHT"`
- Contrôler `imageSize` (standard/2K/4K) avec `quality: "standard" | "medium" | "hd"`
- Comprendre le retour `b64_json` / `url(data:...)`, et confirmer le compte réellement utilisé via les en-têtes de réponse

## Votre situation actuelle

Vous avez peut-être rencontré ces situations :

- Le client ne sait appeler que `/v1/images/generations` d'OpenAI, mais vous souhaitez utiliser Imagen 3
- Avec le même prompt, parfois c'est une image carrée, parfois horizontale, le contrôle du ratio est instable
- Vous avez écrit `size` comme `16:9`, mais cela reste 1:1 (et vous ne savez pas pourquoi)

## Quand utiliser cette approche

- Vous utilisez déjà le proxy inverse local d'Antigravity Tools et souhaitez unifier également la "génération d'images" par la même passerelle
- Vous souhaitez que les outils prenant en charge l'API OpenAI Images (Cherry Studio, Kilo Code, etc.) génèrent directement des images Imagen 3

## 🎒 Préparatifs avant de commencer

::: warning Vérification préalable
Ce cours suppose que vous pouvez démarrer le proxy inverse local et connaître votre Base URL (par exemple `http://127.0.0.1:<port>`). Si ce n'est pas encore le cas, commencez d'abord par "Démarrer le proxy inverse local et connecter le premier client".
:::

::: info Rappel d'authentification
Si vous avez activé `proxy.auth_mode` (par exemple `strict` / `all_except_health`), lors de l'appel `/v1/images/generations`, vous devez inclure :

- `Authorization: Bearer <proxy.api_key>`
:::

## Idée principale

### Que fait exactement ce "mappage automatique" ?

Le **mappage des images OpenAI Imagen 3** signifie que vous envoyez toujours `prompt/size/quality` selon l'API OpenAI Images. Le proxy analyse `size` comme un ratio standard (comme 16:9), analyse `quality` comme un niveau de résolution (2K/4K), puis utilise le format de requête interne pour appeler `gemini-3-pro-image` en amont.

::: info Description du modèle
`gemini-3-pro-image` est le nom du modèle de génération d'images Google Imagen 3 (provenant de la documentation README du projet). Dans le code source, ce modèle est utilisé par défaut pour la génération d'images.
:::

### 1) size -> aspectRatio (calcul dynamique)

- Le proxy analyse `size` comme `WIDTHxHEIGHT`, puis correspond au ratio standard selon le ratio largeur/hauteur.
- Si l'analyse de `size` échoue (par exemple pas séparé par `x`, ou nombre illégal), il revient à `1:1`.

### 2) quality -> imageSize (niveau de résolution)

- `quality: "hd"` -> `imageSize: "4K"`
- `quality: "medium"` -> `imageSize: "2K"`
- `quality: "standard"` (ou autre valeur) -> ne pas définir `imageSize` (garder par défaut)

### 3) n plusieurs images est "envoyer n fois en parallèle"

Cette implémentation ne dépend pas du `candidateCount > 1` en amont, mais divise la génération n fois en plusieurs requêtes parallèles, puis fusionne les résultats au format `data[]` d'OpenAI.

## Suivez les étapes

### Étape 1 : Vérifiez que le proxy inverse est démarré (optionnel mais fortement recommandé)

**Pourquoi**
Confirmez d'abord votre Base URL et le mode d'authentification pour éviter de juger erronément les problèmes comme "échec de la génération d'images".

::: code-group

```bash [macOS/Linux]
 # Test de disponibilité (accessible sans authentification même en auth_mode=all_except_health)
curl -sS http://127.0.0.1:PORT/healthz
```

```powershell [Windows]
 # Test de disponibilité (accessible sans authentification même en auth_mode=all_except_health)
curl.exe -sS http://127.0.0.1:PORT/healthz
```

:::

**Ce que vous devriez voir** : Retourne JSON, contenant `"status": "ok"`.

### Étape 2 : Lancez une requête de génération d'images minimale

**Pourquoi**
Faites d'abord fonctionner le chemin avec le moins de champs, puis superposez les paramètres ratio/qualité/nombre.

::: code-group

```bash [macOS/Linux]
curl -sS http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "Une icône minimaliste d'une fusée, design plat",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

```powershell [Windows]
curl.exe -sS http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "Une icône minimaliste d'une fusée, design plat",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

:::

**Ce que vous devriez voir** : La réponse JSON contient un tableau `data`, le tableau contient le champ `b64_json` (contenu relativement long).

### Étape 3 : Confirmez quel compte vous utilisez (voir les en-têtes de réponse)

**Pourquoi**
La génération d'images passe également par la planification du pool de comptes. Lors du dépannage, confirmer "quel compte génère réellement" est crucial.

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

```powershell [Windows]
curl.exe -i http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

:::

**Ce que vous devriez voir** : L'en-tête de réponse contient `X-Account-Email: ...`.

### Étape 4 : Utilisez size pour contrôler le ratio largeur/hauteur (recommandé d'utiliser uniquement WIDTHxHEIGHT)

**Pourquoi**
L'amont Imagen 3 reçoit `aspectRatio` standardisé. Il suffit d'écrire `size` comme un ensemble de largeur/hauteur courants pour le mapper stablement aux ratios standard.

| size que vous envoyez | aspectRatio calculé par le proxy |
| --- | --- |
| `"1024x1024"` | `1:1` |
| `"1920x1080"` / `"1280x720"` | `16:9` |
| `"1080x1920"` / `"720x1280"` | `9:16` |
| `"800x600"` | `4:3` |
| `"600x800"` | `3:4` |
| `"2560x1080"` | `21:9` |

**Ce que vous devriez voir** : Le ratio de l'image change avec le `size`.

### Étape 5 : Utilisez quality pour contrôler le niveau de résolution (standard/medium/hd)

**Pourquoi**
Vous n'avez pas besoin de mémoriser les champs internes d'Imagen 3, il suffit d'utiliser `quality` d'OpenAI Images pour changer le niveau de résolution.

| quality que vous envoyez | imageSize écrit par le proxy |
| --- | --- |
| `"standard"` | Non défini (utiliser par défaut en amont) |
| `"medium"` | `"2K"` |
| `"hd"` | `"4K"` |

**Ce que vous devriez voir** : Les détails de `hd` sont plus riches (mais aussi plus lents/plus gourmands en ressources, c'est le comportement en amont, basé sur le retour réel).

### Étape 6 : Décidez entre b64_json et url

**Pourquoi**
Dans cette implémentation, `response_format: "url"` ne vous donne pas une URL accessible publiquement, mais retourne un Data URI `data:<mime>;base64,...` ; beaucoup d'outils sont plus adaptés à utiliser directement `b64_json`.

| response_format | Champ de data[] |
| --- | --- |
| `"b64_json"` (défaut) | `{ "b64_json": "..." }` |
| `"url"` | `{ "url": "data:image/png;base64,..." }` |

## Point de contrôle ✅

- Vous pouvez retourner au moins 1 image avec `/v1/images/generations` (`data.length >= 1`)
- Vous pouvez voir `X-Account-Email` dans les en-têtes de réponse et reproduire les problèmes du même compte si nécessaire
- Après avoir changé `size` en `1920x1080`, le ratio de l'image devient horizontal (16:9)
- Après avoir changé `quality` en `hd`, le proxy le mappera vers `imageSize: "4K"`

## Pièges à éviter

### 1) Écrire size comme 16:9 n'obtiendra pas 16:9

La logique d'analyse de `size` ici est divisée selon `WIDTHxHEIGHT`. Si `size` n'est pas de ce format, il reviendra directement à `1:1`.

| Écriture | Résultat |
| --- | --- |
| ✓ `"1920x1080"` | 16:9 |
| ❌ `"16:9"` | Revenir à 1:1 |

### 2) Avoir l'authentification désactivée mais inclure Authorization ne mène pas au succès

L'authentification est une question de "si c'est obligatoire" :

- `proxy.auth_mode=off` : avec ou sans `Authorization`, ça va
- `proxy.auth_mode=strict/all_except_health` : sans `Authorization` sera rejeté

### 3) Quand n > 1, un "succès partiel" peut se produire

L'implémentation consiste à faire des requêtes parallèles et fusionner les résultats : si certaines requêtes échouent, des images partielles peuvent toujours être retournées, et les raisons de l'échec seront enregistrées dans les journaux.

## Résumé du cours

- Pour appeler Imagen 3 avec `/v1/images/generations`, la clé est de se souvenir : utilisez `WIDTHxHEIGHT` pour `size`, utilisez `standard/medium/hd` pour `quality`
- `size` contrôle `aspectRatio`, `quality` contrôle `imageSize(2K/4K)`
- `response_format=url` retourne un Data URI, pas une URL publique

## Prochain cours

> Dans le prochain cours, nous apprenrons **[Transcription audio : Limites de /v1/audio/transcriptions et traitement des grands corps de requête](../audio/)**.

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Exposer les routes Images OpenAI | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L123-L146) | 123-146 |
| Point de terminaison de génération Images : analyse prompt/size/quality + assemblage de la réponse OpenAI | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1104-L1333) | 1104-1333 |
| Analyse et mappage size/quality (size->aspectRatio, quality->imageSize) | [`src-tauri/src/proxy/mappers/common_utils.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/common_utils.rs#L19-L222) | 19-222 |
| Déclaration OpenAIRequest de size/quality (pour compatibilité de la couche de protocole) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L6-L38) | 6-38 |
| Conversion OpenAI->Gemini de la requête : passer size/quality à la fonction d'analyse unifiée | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L19-L27) | 19-27 |

**Champs clés (provenant du code source)** :
- `size` : analysé comme `aspectRatio` selon `WIDTHxHEIGHT`
- `quality` : `hd -> 4K`, `medium -> 2K`, autre non défini

</details>
