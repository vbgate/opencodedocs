---
title: "Points de terminaison MCP : Exposition des outils | Antigravity-Manager"
sidebarTitle: "Permettre à Claude d'utiliser les capacités z.ai"
subtitle: "Points de terminaison MCP : Exposer Web Search/Reader/Vision comme des outils appelables"
description: "Apprenez la configuration des points de terminaison MCP d'Antigravity Manager. Activez Web Search/Reader/Vision, validez les appels d'outils, intégrez des clients externes, et maîtrisez les méthodes de dépannage des erreurs courantes."
tags:
  - "MCP"
  - "Recherche Web"
  - "Lecteur Web"
  - "Vision"
  - "z.ai"
  - "Outils Antigravity"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 6
---
# Points de terminaison MCP : Exposer Web Search/Reader/Vision comme des outils appelables

Vous utiliserez ces **points de terminaison MCP** pour exposer les capacités de recherche, de lecture et de vision de z.ai aux clients MCP externes. L'objectif principal est de comprendre la différence entre "proxy inverse à distance" et "serveur intégré", et comment activer et appeler ces points de terminaison.

## Ce que vous pourrez faire après ce cours

- Comprendre le fonctionnement des trois types de points de terminaison MCP (proxy inverse à distance vs serveur intégré)
- Activer les points de terminaison Web Search/Web Reader/Vision MCP dans Antigravity Tools
- Permettre aux clients MCP externes (comme Claude Desktop, Cursor) d'appeler ces capacités via la passerelle locale
- Maîtriser la gestion des sessions (Vision MCP) et le modèle d'authentification

## Votre situation actuelle

De nombreux outils AI commencent à prendre en charge MCP (Model Context Protocol), mais nécessitent la configuration d'une API Key et d'une URL en amont. Le serveur MCP de z.ai fournit également des capacités puissantes (recherche, lecture, analyse visuelle), mais une configuration directe signifie exposer la clé z.ai dans chaque client.

La solution d'Antigravity Tools est de gérer uniformément la clé z.ai au niveau de la passerelle locale, d'exposer les points de terminaison MCP, les clients n'ont qu'à se connecter à la passerelle locale sans connaître la clé z.ai.

## Quand utiliser cette approche

- Vous avez plusieurs clients MCP (Claude Desktop, Cursor, outils personnalisés) et souhaitez utiliser un ensemble uniforme de clés z.ai
- Vous souhaitez exposer les capacités Web Search/Web Reader/Vision de z.ai comme des outils utilisables par l'AI
- Vous ne souhaitez pas configurer et faire tourner les clés z.ai à plusieurs endroits

## 🎒 Préparatifs avant de commencer

::: warning Conditions préalables
- Vous avez déjà démarré le service de proxy inverse dans la page "API Proxy" d'Antigravity Tools
- Vous avez obtenu la clé API z.ai (à partir de la console z.ai)
- Vous connaissez le port du proxy (par défaut `8045`)
:::

::: info Qu'est-ce que MCP ?
MCP (Model Context Protocol) est un protocole ouvert permettant aux clients AI d'appeler des outils/sources de données externes.

Flux d'interaction MCP typique :
1. Le client (comme Claude Desktop) envoie une requête `tools/list` au serveur MCP pour obtenir la liste des outils disponibles
2. Le client sélectionne un outil en fonction du contexte et envoie une requête `tools/call`
3. Le serveur MCP exécute l'outil et retourne le résultat (texte, image, données, etc.)

Antigravity Tools fournit trois points de terminaison MCP :
- **Proxy inverse à distance** : transfert direct vers le serveur MCP z.ai (Web Search/Web Reader)
- **Serveur intégré** : implémentation locale du protocole JSON-RPC 2.0, traitement des appels d'outils (Vision)
:::

## Qu'est-ce qu'un point de terminaison MCP ?

Les **points de terminaison MCP** sont un ensemble de routes HTTP exposées par Antigravity Tools, permettant aux clients MCP externes d'appeler les capacités de z.ai, avec une gestion unifiée de l'authentification et de la configuration par Antigravity Tools.

### Classification des points de terminaison

| Type de point de terminaison | Mode d'implémentation | Chemin local | Cible en amont |
|--- | --- | --- | ---|
| **Web Search** | Proxy inverse à distance | `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` |
| **Web Reader** | Proxy inverse à distance | `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` |
| **Vision MCP** | Serveur intégré (JSON-RPC 2.0) | `/mcp/zai-mcp-server/mcp` | Appel interne à l'API z.ai PaaS |

### Différences clés

::: info Proxy inverse à distance vs Serveur intégré
**Proxy inverse à distance** (Web Search/Web Reader) :
- Le proxy conserve certains en-têtes de requête (`content-type`, `accept`, `user-agent`) et injecte l'en-tête `Authorization`
- Le proxy transfère le corps de la réponse et le code de statut en amont, mais ne conserve que l'en-tête de réponse `CONTENT_TYPE`
- Sans état, aucune gestion de session requise

**Serveur intégré** (Vision MCP) :
- Implémentation complète du protocole JSON-RPC 2.0 (`initialize`, `tools/list`, `tools/call`)
- Avec état : création de session (`mcp-session-id`), le point de terminaison GET retourne un keepalive SSE
- La logique des outils est implémentée localement, appelant l'API z.ai PaaS pour exécuter l'analyse visuelle
:::

## Idée principale

Les points de terminaison MCP d'Antigravity Tools suivent les principes de conception suivants :

1. **Authentification unifiée** : gérée par Antigravity avec la clé z.ai, les clients n'ont pas besoin de configuration
2. **Activable** : les trois points de terminaison peuvent être activés/désactivés indépendamment
3. **Isolation de session** : Vision MCP utilise `mcp-session-id` pour isoler différents clients
4. **Transparence des erreurs** : le corps de la réponse et le code de statut en amont sont transférés tels quels (les en-têtes de réponse sont filtrés)

### Modèle d'authentification

```
Client MCP → Proxy local Antigravity → z.ai en amont
                ↓
            [Optionnel] proxy.auth_mode
                ↓
            [Automatique] Injection de la clé z.ai
```

Le middleware de proxy d'Antigravity Tools (`src-tauri/src/proxy/middleware/auth.rs`) vérifiera `proxy.auth_mode`. Si l'authentification est activée, le client doit fournir une API Key.

**Important** : quelle que soit la valeur de `proxy.auth_mode`, la clé z.ai est injectée automatiquement par le proxy, les clients n'ont pas besoin de la configurer.

## Suivez les étapes

### Étape 1 : Configurez z.ai et activez les fonctionnalités MCP

**Pourquoi**
Assurez-vous d'abord que la configuration de base de z.ai est correcte, puis activez les points de terminaison MCP un par un.

1. Ouvrez Antigravity Tools, allez dans la page **API Proxy**
2. Trouvez la carte **Configuration z.ai**, cliquez pour développer
3. Configurez les champs suivants :

```yaml
 # Configuration z.ai
base_url: "https://api.z.ai/api/anthropic"  # Point de terminaison compatible Anthropic z.ai
api_key: "votre-z.ai-api-key"               # Obtenue à partir de la console z.ai
enabled: true                              # Activer z.ai
```

4. Trouvez la sous-carte **Configuration MCP**, configurez :

```yaml
 # Configuration MCP
enabled: true                              # Activer le commutateur MCP général
web_search_enabled: true                    # Activer Web Search
web_reader_enabled: true                    # Activer Web Reader
vision_enabled: true                        # Activer Vision MCP
```

**Ce que vous devriez voir** : après avoir enregistré la configuration, une liste "Points de terminaison MCP locaux" apparaît en bas de la page, affichant les URL complètes des trois points de terminaison.

### Étape 2 : Vérifiez le point de terminaison Web Search

**Pourquoi**
Web Search est un proxy inverse à distance, le plus simple, adapté pour vérifier d'abord la configuration de base.

```bash
 # 1) Listez d'abord les outils fournis par le point de terminaison Web Search (les noms d'outils basés sur le retour réel)
curl -X POST http://127.0.0.1:8045/mcp/web_search_prime/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**Ce que vous devriez voir** : Retourne une réponse JSON contenant une liste `tools`.

::: tip Continuez à vérifier tools/call (optionnel)
Une fois que vous avez `tools[].name` et `tools[].inputSchema`, vous pouvez composer la requête `tools/call` selon le schéma (les paramètres sont basés sur le schéma, ne devinez pas les champs).
:::

::: tip Point de terminaison introuvable ?
Si vous recevez `404 Not Found`, vérifiez :
1. Si `proxy.zai.mcp.enabled` est `true`
2. Si `proxy.zai.mcp.web_search_enabled` est `true`
3. Si le service de proxy inverse est en cours d'exécution
:::

### Étape 3 : Vérifiez le point de terminaison Web Reader

**Pourquoi**
Web Reader est également un proxy inverse à distance, mais les paramètres et le format de retour sont différents, vérifiez que le proxy peut gérer correctement différents points de terminaison.

```bash
 # 2) Listez les outils fournis par le point de terminaison Web Reader
curl -X POST http://127.0.0.1:8045/mcp/web_reader/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**Ce que vous devriez voir** : Retourne une réponse JSON contenant une liste `tools`.

### Étape 4 : Vérifiez le point de terminaison Vision MCP (gestion de session)

**Pourquoi**
Vision MCP est un serveur intégré avec état de session, vous devez d'abord `initialize`, puis appeler les outils.

#### 4.1 Initialiser la session

```bash
 # 1) Envoyez une requête initialize
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05"
    },
    "id": 1
  }'
```

**Ce que vous devriez voir** : La réponse contient l'en-tête `mcp-session-id`, enregistrez cet ID.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "serverInfo": {
      "name": "zai-mcp-server",
      "version": "<app-version>"
    }
  },
  "id": 1
}
```

::: info Rappel
`serverInfo.version` provient de `env!("CARGO_PKG_VERSION")` de Rust, basé sur votre version réelle installée localement.
:::

En-têtes de réponse :
```
mcp-session-id: uuid-v4-string
```

#### 4.2 Obtenir la liste des outils

```bash
 # 2) Envoyez une requête tools/list (avec l'ID de session)
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: votre-ID-de-session" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**Ce que vous devriez voir** : Retourne les définitions de 8 outils (`ui_to_artifact`, `extract_text_from_screenshot`, `diagnose_error_screenshot`, etc.).

#### 4.3 Appeler un outil

```bash
 # 3) Appelez l'outil analyze_image
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: votre-ID-de-session" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "analyze_image",
      "arguments": {
        "image_source": "https://example.com/image.jpg",
        "prompt": "Décrivez le contenu de cette image"
      }
    },
    "id": 3
  }'
```

**Ce que vous devriez voir** : Retourne une description textuelle du résultat de l'analyse d'image.

::: danger L'ID de session est important
Toutes les requêtes Vision MCP (sauf `initialize`) doivent inclure l'en-tête `mcp-session-id`.

L'ID de session est retourné dans la réponse `initialize`, les requêtes suivantes doivent utiliser le même ID. Si la session est perdue, vous devez réinitialiser.
:::

### Étape 5 : Testez le keepalive SSE (optionnel)

**Pourquoi**
Le point de terminaison GET de Vision MCP retourne un flux SSE (Server-Sent Events), utilisé pour maintenir la connexion active.

```bash
 # 4) Appelez le point de terminaison GET (obtenir le flux SSE)
curl -N http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "mcp-session-id: votre-ID-de-session"
```

**Ce que vous devriez voir** : Recevez un message `event: ping` toutes les 15 secondes, format comme suit :

```
event: ping
data: keepalive

event: ping
data: keepalive
...
```

## Point de contrôle ✅

### Vérification de configuration

- [ ] `proxy.zai.enabled` est `true`
- [ ] `proxy.zai.api_key` est configuré (non vide)
- [ ] `proxy.zai.mcp.enabled` est `true`
- [ ] Au moins un point de terminaison MCP est activé (`web_search_enabled` / `web_reader_enabled` / `vision_enabled`)
- [ ] Le service de proxy inverse est en cours d'exécution

### Vérification des fonctionnalités

- [ ] Le point de terminaison Web Search retourne des résultats de recherche
- [ ] Le point de terminaison Web Reader retourne le contenu de la page web
- [ ] Le point de terminaison Vision MCP réussit l'`initialize` et obtient `mcp-session-id`
- [ ] Le point de terminaison Vision MCP retourne la liste des outils (8 outils)
- [ ] Le point de terminaison Vision MCP appelle avec succès un outil et retourne le résultat

## Référence rapide des outils Vision MCP

| Nom de l'outil | Fonctionnalité | Paramètres requis | Scénario d'exemple |
|--- | --- | --- | ---|
| `ui_to_artifact` | Convertir une capture d'écran UI en code/prompt/spécification/description | `image_source`, `output_type`, `prompt` | Générer du code frontend à partir d'une maquette |
| `extract_text_from_screenshot` | Extraire du texte/code d'une capture d'écran (comme OCR) | `image_source`, `prompt` | Lire une capture d'écran de journal d'erreurs |
| `diagnose_error_screenshot` | Diagnostiquer une capture d'écran d'erreur (trace de pile, journaux) | `image_source`, `prompt` | Analyser une erreur d'exécution |
| `understand_technical_diagram` | Analyser les diagrammes d'architecture/flux/UML/ER | `image_source`, `prompt` | Comprendre le diagramme d'architecture du système |
| `analyze_data_visualization` | Analyser les graphiques/tableaux de bord | `image_source`, `prompt` | Extraire les tendances d'un tableau de bord |
| `ui_diff_check` | Comparer deux captures d'écran UI et signaler les différences | `expected_image_source`, `actual_image_source`, `prompt` | Test de régression visuelle |
| `analyze_image` | Analyse d'image générique | `image_source`, `prompt` | Décrire le contenu de l'image |
| `analyze_video` | Analyse du contenu vidéo | `video_source`, `prompt` | Analyser une scène vidéo |

::: info Explication des paramètres
- `image_source` : chemin de fichier local (comme `/tmp/screenshot.png`) ou URL distante (comme `https://example.com/image.jpg`)
- `video_source` : chemin de fichier local ou URL distante (prend en charge MP4, MOV, M4V)
- `output_type` (`ui_to_artifact`) : `code` / `prompt` / `spec` / `description`
:::

## Pièges à éviter

### 404 Not Found

**Phénomène** : L'appel au point de terminaison MCP retourne `404 Not Found`.

**Causes** :
1. Le point de terminaison n'est pas activé (le `*_enabled` correspondant est `false`)
2. Le service de proxy inverse n'est pas démarré
3. Le chemin URL est incorrect (notez le préfixe `/mcp/`)

**Solutions** :
1. Vérifiez `proxy.zai.mcp.enabled` et la configuration `*_enabled` correspondante
2. Vérifiez l'état du service de proxy inverse
3. Confirmez le format du chemin URL (comme `/mcp/web_search_prime/mcp`)

### 400 Bad Request: Missing Mcp-Session-Id

**Phénomène** : L'appel à Vision MCP (sauf `initialize`) retourne `400 Bad Request`.

- Point de terminaison GET : retourne du texte brut `Missing Mcp-Session-Id`
- Point de terminaison POST : retourne une erreur JSON-RPC `{"error":{"code":-32000,"message":"Bad Request: missing Mcp-Session-Id"}}`

**Cause** : L'en-tête de requête manque `mcp-session-id` ou l'ID est invalide.

**Solutions** :
1. Assurez-vous que la requête `initialize` a réussi et récupérez `mcp-session-id` à partir des en-têtes de réponse
2. Les requêtes suivantes (`tools/list`, `tools/call`, ainsi que le keepalive SSE) doivent toutes inclure cet en-tête
3. Si la session est perdue (comme lors du redémarrage du service), vous devez réinitialiser

### z.ai is not configured

**Phénomène** : Retourne `400 Bad Request`, indiquant `z.ai is not configured`.

**Cause** : `proxy.zai.enabled` est `false` ou `api_key` est vide.

**Solutions** :
1. Assurez-vous que `proxy.zai.enabled` est `true`
2. Assurez-vous que `proxy.zai.api_key` est configuré (non vide)

### Échec de la requête en amont

**Phénomène** : Retourne `502 Bad Gateway` ou une erreur interne.

**Causes** :
1. La clé API z.ai est invalide ou a expiré
2. Problème de connexion réseau (nécessite un proxy en amont)
3. Erreur du serveur z.ai

**Solutions** :
1. Vérifiez que la clé API z.ai est correcte
2. Vérifiez la configuration `proxy.upstream_proxy` (si un proxy est nécessaire pour accéder à z.ai)
3. Consultez les journaux pour obtenir des informations d'erreur détaillées

## Intégration avec des clients MCP externes

### Exemple de configuration Claude Desktop

Le fichier de configuration du client MCP de Claude Desktop (`~/.config/claude/claude_desktop_config.json`) :

```json
{
  "mcpServers": {
    "antigravity-vision": {
      "command": "node",
      "args": [
        "/chemin/vers/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/zai-mcp-server/mcp"
      ]
    },
    "antigravity-web-search": {
      "command": "node",
      "args": [
        "/chemin/vers/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/web_search_prime/mcp"
      ]
    }
  }
}
```

::: tip Limitations de Claude Desktop
Le client MCP de Claude Desktop nécessite une communication via `stdio`. Si vous utilisez directement le point de terminaison HTTP, vous devez écrire un script wrapper pour convertir `stdio` en requêtes HTTP.

Ou utilisez un client prenant en charge MCP HTTP (comme Cursor).
:::

### Client HTTP MCP (comme Cursor)

Si le client prend en charge MCP HTTP, configurez simplement l'URL du point de terminaison :

```yaml
 # Configuration MCP Cursor
mcpServers:
  - name: antigravity-vision
    url: http://127.0.0.1:8045/mcp/zai-mcp-server/mcp
  - name: antigravity-web-search
    url: http://127.0.0.1:8045/mcp/web_search_prime/mcp
```

## Résumé du cours

Les points de terminaison MCP d'Antigravity Tools exposent les capacités de z.ai comme des outils appelables, divisés en deux catégories :
- **Proxy inverse à distance** (Web Search/Web Reader) : transfert simple, sans état
- **Serveur intégré** (Vision MCP) : implémentation complète de JSON-RPC 2.0, avec gestion de session

Points clés :
1. Authentification unifiée : la clé z.ai est gérée par Antigravity, les clients n'ont pas besoin de configuration
2. Activable : les trois points de terminaison peuvent être activés/désactivés indépendamment
3. Isolation de session : Vision MCP utilise `mcp-session-id` pour isoler les clients
4. Intégration flexible : prend en charge tout client compatible avec le protocole MCP

## Prochain cours

> Dans le prochain cours, nous apprenrons **[Tunnel Cloudflared en un clic](/fr/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**.
>
> Vous apprendrez :
> - Comment installer et démarrer le tunnel Cloudflared en un clic
> - La différence entre le mode quick et le mode auth
> - Comment exposer en toute sécurité l'API locale au réseau public

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Point de terminaison Web Search | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L115-L135) | 115-135 |
| Point de terminaison Web Reader | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L137-L157) | 137-157 |
| Point de terminaison Vision MCP (entrée principale) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397) | 376-397 |
| Traitement initialize Vision MCP | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L271-L293) | 271-293 |
| Traitement tools/list Vision MCP | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L311-L314) | 311-314 |
| Traitement tools/call Vision MCP | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L315-L363) | 315-363 |
| Gestion de l'état de session Vision MCP | [`src-tauri/src/proxy/zai_vision_mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_mcp.rs#L1-L42) | 1-42 |
| Définition des outils Vision MCP | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L271) | 166-271 |
| Implémentation des appels d'outils Vision MCP | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L273-L400) | 273-400 |
| Enregistrement des routes | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169) | 157-169 |
| Middleware d'authentification | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L1-L78) | 1-78 |
| Interface utilisateur de configuration MCP | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1304-L1357) | 1304-1357 |
| Documentation dans le dépôt | [`docs/zai/mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/mcp.md#L1-L57) | 1-57 |

**Constantes clés** :
- `ZAI_PAAZ_CHAT_COMPLETIONS_URL = "https://api.z.ai/api/paas/v4/chat/completions"` : point de terminaison API z.ai PaaS (utilisé pour les appels d'outils Vision)

**Fonctions clés** :
- `handle_web_search_prime()` : traite le proxy inverse à distance pour le point de terminaison Web Search
- `handle_web_reader()` : traite le proxy inverse à distance pour le point de terminaison Web Reader
- `handle_zai_mcp_server()` : traite toutes les méthodes du point de terminaison Vision MCP (GET/POST/DELETE)
- `mcp_session_id()` : extrait `mcp-session-id` à partir des en-têtes de requête
- `forward_mcp()` : fonction de transfert MCP générique (injection d'authentification et transfert vers l'amont)
- `tool_specs()` : retourne la liste des définitions d'outils Vision MCP
- `call_tool()` : exécute l'outil Vision MCP spécifié

</details>
