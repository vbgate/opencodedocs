---
title: "Intégration z.ai : explication détaillée des limites de capacités | Antigravity-Manager"
sidebarTitle: "Référence rapide des limites z.ai"
subtitle: "Intégration z.ai : explication détaillée des limites de capacités"
description: "Maîtrisez les limites de l'intégration z.ai d'Antigravity Tools. Comprenez le routage des demandes, la répartition dispatch_mode, le mappage des modèles, la stratégie de sécurité des en-têtes, ainsi que le proxy inverse et les limitations MCP, pour éviter les mauvaises interprétations."
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "Limites de capacités"
prerequisite:
  - "start-getting-started"
  - "platforms-mcp"
order: 3
---
# Limites des capacités d'intégration z.ai (implémenté vs explicitement non implémenté)

Ce document traite uniquement des « limites » de z.ai dans Antigravity Tools, et non de « comment se connecter ». Si vous constatez qu'une certaine capacité ne fonctionne pas, venez d'abord vérifier ici : est-ce qu'elle n'est pas activée, pas configurée, ou tout simplement pas implémentée.

## Ce que vous pourrez faire après ce chapitre

- Juger si vous devez compter sur z.ai : ce qui est « implémenté », ce qui est « explicitement non fait »
- Comprendre quels points de terminaison sont affectés par z.ai (et lesquels ne le sont pas du tout)
- Voir les preuves de code source/documentation pour chaque conclusion (avec liens vers les numéros de ligne GitHub), pour que vous puissiez vérifier par vous-même

## Votre situation actuelle

Vous avez peut-être déjà activé z.ai dans Antigravity Tools, mais dès que vous l'utilisez, vous rencontrez ces doutes :

- Pourquoi certaines demandes passent par z.ai, d'autres pas du tout ?
- Les points de terminaison MCP peuvent-ils être considérés comme un « serveur MCP complet » ?
- Les interrupteurs visibles dans l'interface correspondent-ils réellement aux implémentations ?

## Qu'est-ce que l'intégration z.ai (dans ce projet) ?

**L'intégration z.ai** dans Antigravity Tools est un « fournisseur amont + extension MCP » optionnel. Elle ne prend le contrôle des demandes de protocole Claude que dans des conditions spécifiques, et fournit un proxy inverse pour MCP Search/Reader et un serveur MCP Vision intégré minimaliste ; ce n'est pas une solution de remplacement complet pour tous les protocoles et toutes les capacités.

::: info À retenir en une phrase
Vous pouvez considérer z.ai comme un « fournisseur amont optionnel pour les demandes Claude + un ensemble de points de terminaison MCP activables », ne le considérez pas comme « importer toutes les capacités de z.ai ».
:::

## Implémenté : stable et disponible (basé sur le code source)

### 1) Seul le protocole Claude passe par z.ai (/v1/messages + /v1/messages/count_tokens)

Le transfert du fournisseur amont Anthropic z.ai ne se produit que dans la branche z.ai du handler Claude :

- `POST /v1/messages` : lorsque `use_zai=true`, appelle `forward_anthropic_json(...)` pour transférer la demande JSON vers le point de terminaison Anthropic compatible z.ai
- `POST /v1/messages/count_tokens` : lorsque z.ai est activé, transfère également ; sinon renvoie un espace réservé `{input_tokens:0, output_tokens:0}`

Preuves :

- Sélection de la branche z.ai et point d'entrée de transfert : [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- Branche z.ai et retour d'espace réservé pour count_tokens : [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- Implémentation du transfert Anthropic z.ai : [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip Comment comprendre « réponse en flux » ?
`forward_anthropic_json` renvoie le corps de réponse du fournisseur amont en flux vers le client via `bytes_stream()`, sans analyser le SSE (voir construction du corps de réponse dans `providers/zai_anthropic.rs`).
:::

### 2) « Signification réelle » du mode de répartition (dispatch_mode)

`dispatch_mode` détermine si `/v1/messages` passe par z.ai :

| dispatch_mode | Ce qui se passe | Preuve |
| --- | --- | --- |
| `off` | N'utilise jamais z.ai | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | Toutes les demandes Claude passent par z.ai | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Utilise z.ai uniquement lorsque le pool Google n'est pas disponible (0 compte ou « aucun compte disponible ») | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | Traite z.ai comme « 1 emplacement supplémentaire » participant à la rotation (ne garantit pas toujours d'atteindre) | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning Malentendu courant sur pooled
`pooled` n'est pas « z.ai + pool de comptes Google tous utilisés, et répartition stable par poids ». Le code indique clairement « no strict guarantees », c'est essentiellement un emplacement de rotation (seulement si `slot == 0` passe par z.ai).
:::

### 3) Mappage des modèles : comment les noms de modèles Claude deviennent-ils les glm-* de z.ai ?

Avant de transférer vers z.ai, si le corps de la demande contient un champ `model`, il sera réécrit :

1. Correspondance exacte de `proxy.zai.model_mapping` (prend en charge à la fois la chaîne originale et la clé en minuscules)
2. Préfixe `zai:<model>` : supprime `zai:` et utilise directement
3. `glm-*` : reste inchangé
4. Non `claude-*` : reste inchangé
5. `claude-*` et contient `opus/haiku` : mappe vers `proxy.zai.models.opus/haiku` ; sinon par défaut `sonnet`

Preuve : [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37), [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) Stratégie de sécurité des en-têtes lors du transfert (éviter la fuite de la clé proxy locale)

Le transfert du fournisseur amont z.ai ne « transfère pas tous les en-têtes tels quels », mais met en place deux lignes de défense :

- Ne laisse passer qu'une petite partie des en-têtes (comme `content-type`, `accept`, `anthropic-version`, `user-agent`)
- Injecte la clé API z.ai dans le fournisseur amont (privilégie le mode d'authentification utilisé par le client : `x-api-key` ou `Authorization: Bearer ...`)

Preuves :

- Liste blanche des en-têtes : [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- Injection de l'authentification z.ai : [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## Implémenté : MCP (proxy inverse Search/Reader + Vision intégré)

### 1) MCP Search/Reader : proxy inverse vers les points de terminaison MCP de z.ai

Les points de terminaison locaux et l'adresse amont sont codés en dur :

| Point de terminaison local | Adresse amont | Interrupteur | Preuve |
| --- | --- | --- | --- |
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404 n'est pas un « problème réseau »
Tant que `proxy.zai.mcp.enabled=false`, ou que `web_search_enabled/web_reader_enabled=false` correspondant, ces points de terminaison renverront directement 404.
:::

Preuves :

- Interrupteur général MCP et validation de la clé z.ai : [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- Enregistrement des routes : [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)

### 2) Vision MCP : un serveur intégré « MCP HTTP Streamable minimaliste »

Vision MCP n'est pas un proxy inverse, c'est une implémentation intégrée locale :

- Point de terminaison : `/mcp/zai-mcp-server/mcp`
- `POST` prend en charge : `initialize`, `tools/list`, `tools/call`
- `GET` renvoie un keepalive SSE (nécessite une session initialisée)
- `DELETE` termine la session

Preuves :

- Point d'entrée principal du handler et répartition des méthodes : [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- Implémentation de `initialize`, `tools/list`, `tools/call` : [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Positionnement de « l'implémentation minimale » de Vision MCP : [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Ensemble d'outils Vision MCP (8) et limites de taille de fichier

La liste des outils provient de `tool_specs()` :

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

Preuve : [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270), [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

Les fichiers locaux sont lus et encodés en `data:<mime>;base64,...`, avec une limite stricte :

- Limite d'image 5 Mo (`image_source_to_content(..., 5)`)
- Limite vidéo 8 Mo (`video_source_to_content(..., 8)`)

Preuve : [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## Explicitement non implémenté / à ne pas attendre (basé sur les déclarations de documentation et les détails d'implémentation)

### 1) Surveillance de l'utilisation/budget z.ai (usage/budget) non implémentée

`docs/zai/implementation.md` indique clairement « not implemented yet ». Cela signifie que :

- Vous ne pouvez pas compter sur Antigravity Tools pour fournir des requêtes ou des alertes d'utilisation/budget z.ai
- La gouvernance des quotas (Quota Protection) ne lira pas automatiquement les données de budget/utilisation de z.ai

Preuve : [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP n'est pas un serveur MCP complet

Vision MCP est actuellement positionné comme une « implémentation minimale juste suffisante pour les appels d'outils » : prompts/resources, la reprise (resumability), la sortie d'outils en flux, etc. ne sont pas encore faits.

Preuve : [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36), [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude` ne reflète pas la vraie liste de modèles z.ai

La liste des modèles renvoyée par ce point de terminaison provient du mappage intégré local et du mappage personnalisé (`get_all_dynamic_models`), elle n'interroge pas le `/v1/models` du fournisseur amont z.ai.

Preuves :

- handler : [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- Logique de génération de liste : [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## Référence rapide des champs de configuration (liés à z.ai)

La configuration z.ai se trouve sous `ProxyConfig.zai` et comprend ces champs :

- `enabled` / `base_url` / `api_key`
- `dispatch_mode` (`off/exclusive/pooled/fallback`)
- `model_mapping` (remplacement par correspondance exacte)
- `models.{opus,sonnet,haiku}` (mappage par défaut de la famille Claude)
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

Les valeurs par défaut (base_url / modèles par défaut) se trouvent également dans le même fichier :

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

Preuve : [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116), [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)

---

## Résumé de ce chapitre

- z.ai ne prendra le contrôle que du protocole Claude (`/v1/messages` + `count_tokens`), les autres points de terminaison de protocole ne « passent pas automatiquement par z.ai »
- MCP Search/Reader est un proxy inverse ; Vision MCP est une implémentation minimale locale, pas un serveur MCP complet
- La liste des modèles de `/v1/models/claude` provient du mappage local et ne représente pas les vrais modèles du fournisseur amont z.ai

---

## Aperçu du prochain chapitre

> Dans le prochain chapitre, nous étudierons **[Évolution des versions](../../changelog/release-notes/)**.

---

## Annexe : référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Portée de l'intégration z.ai (protocole Claude + MCP + Vision MCP) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| Mode de répartition z.ai et valeurs par défaut des modèles | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| base_url par défaut z.ai / modèles par défaut | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| Logique de sélection si `/v1/messages` passe par z.ai | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| Transfert z.ai et retour d'espace réservé pour `/v1/messages/count_tokens` | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| Transfert du fournisseur amont Anthropic z.ai (transfert JSON + réponse en flux) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| Règles de mappage des modèles z.ai (map_model_for_zai) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Liste blanche des en-têtes + injection auth z.ai | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| Proxy inverse MCP Search/Reader et interrupteurs | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
| Serveur intégré Vision MCP (GET/POST/DELETE + JSON-RPC) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L190-L397) | 190-397 |
| Positionnement de l'implémentation minimale Vision MCP (pas un serveur MCP complet) | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Liste d'outils Vision et limites (tool_specs + taille de fichier + stream=false) | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| Source de la liste des modèles `/v1/models/claude` (mappage local, pas d'interrogation amont) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| Surveillance de l'utilisation/budget non implémentée (déclaration de documentation) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
