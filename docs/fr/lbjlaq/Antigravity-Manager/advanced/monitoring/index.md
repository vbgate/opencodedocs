---
title: "Monitoring et dépannage : Analyse des journaux de requêtes | Antigravity-Manager"
sidebarTitle: "Vérification journaux de requêtes"
subtitle: "Monitoring et dépannage : Analyse des journaux de requêtes"
description: "Apprendre le monitoring et dépannage Proxy Monitor d'Antigravity Tools. Via journaux de requêtes, filtrage et fonctionnalité de restauration de détails, localiser les erreurs 401/429/5xx et interruptions de streaming."
tags:
  - "avancé"
  - "monitoring"
  - "dépannage"
  - "Proxy"
  - "journaux"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-first-run-data"
  - "advanced-config"
order: 6
---

# Proxy Monitor : journaux de requêtes, filtrage, restauration de détails et exportation

Vous avez déjà démarré le reverse proxy local, mais dès qu'apparaissent 401/429/500, interruption de streaming, ou "soudain changement de compte/modèle", le dépannage devient facilement de la conjecture aveugle.

Ce cours ne traite qu'une seule chose : utiliser **Proxy Monitor** pour restaurer chaque appel en "preuve reproductible", vous permettant de savoir d'où vient la requête, quel point de terminaison elle a touché, quel compte elle a utilisé, si le modèle a été mappé, et combien de tokens environ consommés.

## Ce que vous pourrez faire après ce cours

- Ouvrir/suspendre l'enregistrement sur la page `/monitor`, et comprendre si cela affecte Token Stats
- Utiliser la zone de recherche, filtrage rapide, filtrage par compte, localiser rapidement un enregistrement de requête
- Dans la popup de détails, voir et copier les messages Request/Response, analyser la cause de l'échec
- Connaître l'emplacement de sauvegarde des données Proxy Monitor (`proxy_logs.db`) et le comportement de vidage
- Comprendre la capacité réelle de "exportation des journaux" de la version actuelle (GUI vs commande backend)

## Votre situation actuelle

- Vous ne voyez que "échec d'appel/délai", mais ne savez pas si l'échec est sur l'amont, le proxy, ou la configuration client
- Vous soupçonnez avoir déclenché le mappage de modèle ou la rotation de compte, mais n'avez pas de chaîne de preuves
- Vous voulez restaurer le payload complet d'une requête (surtout streaming/Thinking), mais ne le voyez pas dans les journaux

## Quand utiliser cette méthode

- Vous dépannez : échec d'auth 401, limitation 429, erreur amont 5xx, interruption streaming
- Vous voulez confirmer : quel compte a été utilisé pour une certaine requête (`X-Account-Email`)
- Vous faites une stratégie de routage de modèle, voulez vérifier "nom de modèle client -> nom de modèle réel mappé"

## 🎒 Préparation avant de commencer

::: warning Conditions préalables
Proxy Monitor enregistre les "requêtes reçues par le service reverse proxy". Donc vous devez au moins réussir à :

- Le service reverse proxy est démarré, et peut accéder `/healthz`
- Vous connaissez l'URL de base et le port du reverse proxy actuel

Si vous n'avez pas réussi, d'abord voir **[Démarrer le reverse proxy local et intégrer le premier client](/fr/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

## Qu'est-ce que Proxy Monitor ?

**Proxy Monitor** est le "tableau de bord des journaux de requêtes" intégré à Antigravity Tools. Chaque requête entrant dans le reverse proxy local enregistre l'heure, le chemin, le code d'état, la durée, le modèle et le protocole, et essaie d'extraire l'utilisation des tokens de la réponse ; vous pouvez aussi cliquer sur un enregistrement unique pour voir les messages requête/réponse, l'utiliser pour analyser la cause de l'échec et le résultat de sélection de routage/compte.

::: info Emplacement de sauvegarde des données
Les journaux Proxy Monitor sont écrits dans SQLite dans le répertoire de données : `proxy_logs.db`. Comment trouver le répertoire de données, comment sauvegarder, recommandé d'abord revoir **[Premier démarrage à comprendre : répertoire de données, journaux, barre des tâches et démarrage automatique](/fr/lbjlaq/Antigravity-Manager/start/first-run-data/)**.
:::

## Idée centrale : 6 champs à surveiller

Dans un enregistrement Proxy Monitor (structure backend `ProxyRequestLog`), les plus utiles sont ces champs :

| Champ | Question à laquelle vous répondez |
| --- | --- |
| `status` | Cette requête a-t-elle réussi ou échoué (200-399 vs autres) |
| `url` / `method` | Quel point de terminaison avez-vous touché (par exemple `/v1/messages`, `/v1/chat/completions`) |
| `protocol` | C'est quel protocole OpenAI / Claude(Anthropic) / Gemini |
| `account_email` | Quel compte a été utilisé pour cette requête (depuis l'en-tête de réponse `X-Account-Email`) |
| `model` / `mapped_model` | Le nom de modèle demandé par le client a-t-il été "routé/mappé" vers un autre modèle |
| `input_tokens` / `output_tokens` | Utilisation de tokens de cette requête (seulement si extractible) |

::: tip D'abord "résumé", puis détails si nécessaire
La page liste affiche seulement le résumé (sans corps request/response), cliquer sur un enregistrement chargera les détails complets depuis le backend, évitant de tirer trop de grands champs en une fois.
:::

## Suivez-moi : utiliser un appel pour compléter "la boucle de monitoring"

### Étape 1 : D'abord créer une "requête qui apparaîtra certainement"

**Pourquoi**
Proxy Monitor enregistre seulement les requêtes reçues par le service reverse proxy. Utilisez d'abord une requête la plus simple pour valider "s'il y a enregistrement", ensuite on parle de filtrage et détails.

::: code-group

```bash [macOS/Linux]
## 1) Vérification (point de terminaison qui existe certainement)
curl "http://127.0.0.1:PORT/healthz"

## 2) Puis request une fois models (si vous avez activé l'auth, n'oubliez pas d'ajouter header)
curl "http://127.0.0.1:PORT/v1/models"
```

```powershell [Windows]
## 1) Vérification (point de terminaison qui existe certainement)
curl "http://127.0.0.1:PORT/healthz"

## 2) Puis request une fois models (si vous avez activé l'auth, n'oubliez pas d'ajouter header)
curl "http://127.0.0.1:PORT/v1/models"
```

:::

**Ce que vous devriez voir** : le terminal retourne `{"status":"ok"}` (ou JSON similaire), et la réponse `/v1/models` (succès ou 401, ça va).

### Étape 2 : Ouvrir la page Monitor et confirmer "l'état d'enregistrement"

**Pourquoi**
Proxy Monitor a un interrupteur "enregistrement/pause". Vous devez d'abord confirmer l'état actuel, sinon vous pourriez continuer à requêter, mais la liste est toujours vide.

Dans Antigravity Tools, ouvrez la barre latérale **Panneau de monitoring API** (route `/monitor`).

En haut de page, il y a un bouton avec un point :

```
┌───────────────────────────────────────────┐
│  ● Enregistrement en cours  [Recherche]  [Actualiser] [Effacer]      │
└───────────────────────────────────────────┘
```

Si vous voyez "En pause", cliquez une fois pour passer à "Enregistrement en cours".

**Ce que vous devriez voir** : l'état du bouton devient "Enregistrement en cours" ; la liste commence à afficher les enregistrements de requête précédents.

### Étape 3 : Utiliser "Recherche + filtrage rapide" pour localiser un enregistrement

**Pourquoi**
En dépannage réel, vous vous souvenez souvent seulement d'un fragment : le chemin contient `messages`, ou le code d'état est `401`, ou le nom de modèle contient `gemini`. La zone de recherche est conçue pour ce genre de souvenir.

La recherche Proxy Monitor traite votre entrée comme un "mot-clé flou", dans le backend utilise SQL `LIKE` pour correspondre ces champs :

- `url`
- `method`
- `model`
- `status`
- `account_email`

Vous pouvez essayer quelques mots-clés typiques :

- `healthz`
- `models`
- `401` (si vous avez justement créé un 401)

Vous pouvez aussi cliquer les boutons "Filtrage rapide" : **Erreurs uniquement / Chat / Gemini / Claude / Image**.

**Ce que vous devriez voir** : la liste ne reste plus que la catégorie de requête que vous attendez.

### Étape 4 : Cliquer sur détails, restaurer "message requête + message réponse"

**Pourquoi**
La liste suffit à répondre "ce qui s'est passé". Pour répondre "pourquoi", vous devez généralement voir le payload complet requête/réponse.

Cliquez sur n'importe quel enregistrement, une fenêtre de détails apparaît. Vous pouvez vérifier spécifiquement :

- `Protocole` (OpenAI/Claude/Gemini)
- `Modèle utilisé` et `Modèle mappé`
- `Compte utilisé`
- `Consommation de tokens (entrée/sortie)`

Puis utilisez les boutons pour copier :

- `Message de requête (Request)`
- `Message de réponse (Response)`

**Ce que vous devriez voir** : dans les détails, il y a deux blocs de prévisualisation JSON (ou texte) ; après copie, vous pouvez coller dans un ticket/note pour analyse.

### Étape 5 : Besoin de "reproduire à partir de zéro", vider les journaux

**Pourquoi**
En dépannage, ce qu'on craint le plus est "les anciennes données interfèrent le jugement". Vider puis reproduire une fois, succès/échec sera très clair.

Cliquez le bouton "Effacer" en haut, une boîte de confirmation apparaît.

::: danger C'est une opération irréversible
Effacer supprime tous les enregistrements dans `proxy_logs.db`.
:::

**Ce que vous devriez voir** : après confirmation, la liste est vidée, les statistiques reviennent à 0.

## Point de vérification ✅

- [ ] Vous pouvez voir sur `/monitor` l'enregistrement `/healthz` ou `/v1/models` que vous venez d'émettre
- [ ] Vous pouvez utiliser la zone de recherche pour filtrer un enregistrement (par exemple entrer `healthz`)
- [ ] Vous pouvez cliquer sur un enregistrement pour voir les messages requête/réponse, et les copier
- [ ] Vous savez que vider les journaux supprimera directement tous les enregistrements historiques

## Attention aux pièges courants

| Scénario | Ce que vous pourriez comprendre (❌) | Comportement réel (✓) |
| --- | --- | --- |
| "En pause" = aucune surcharge de monitoring | Penser que après pause, les requêtes ne seront pas analysées | La pause affecte seulement "si écrire dans les journaux Proxy Monitor". Mais l'analyse requête/réponse (y compris l'analyse SSE des données streaming) se produira quand même, juste que les données analysées ne seront pas sauvegardées. Token Stats enregistrera quand même (que le monitoring soit activé ou non). |
| Journaux vides pour binaire/gros payload | Penser que le monitoring est cassé | Les requêtes/réponses binaires afficheront `[Binary Request Data]` / `[Binary Response Data]`. Le corps de réponse dépassant 100MB sera marqué `[Response too large (>100MB)]` ; le corps de requête dépassant la limite ne sera pas enregistré. |
| Utiliser Monitor pour trouver "qui a lancé la requête" | Penser pouvoir remonter au processus client | Monitor enregistre les informations HTTP (méthode/chemin/modèle/compte), ne contient pas "nom du processus appelant". Vous devez combiner les logs du client lui-même ou le sniffing réseau du système pour localiser la source. |
| Données Token Stats anormales quand monitoring activé | Penser erreur de statistique | Quand monitoring activé, Token Stats peut être enregistré deux fois (une fois au début de la fonction monitoring, une fois lors de l'écriture asynchrone dans la base). C'est le comportement du code source de la version actuelle. |

## Exportation et conservation à long terme : d'abord clarifier les limites de capacité

### 1) Ce que GUI peut faire actuellement

Dans l'interface Monitor UI (`ProxyMonitor.tsx`) de la version actuelle, vous pouvez :

- Rechercher/filtrer/naviguer par pages
- Cliquer sur détails pour voir et copier payload
- Vider tous les journaux

Mais **pas de bouton "exporter" trouvé** (l'interface UI n'a pas vu de bouton correspondant dans le code source).

### 2) Quelles capacités d'exportation le backend a déjà (convient pour développement secondaire)

Les commandes Tauri backend fournissent deux méthodes d'exportation :

- `export_proxy_logs(file_path)` : exporter "tous les journaux" de la base de données en fichier JSON
- `export_proxy_logs_json(file_path, json_data)` : écrire joliment votre tableau JSON entré dans un fichier (l'entrée doit être au format tableau)

Si vous voulez développer secondairement GUI, ou écrire votre propre script d'appel, vous pouvez directement réutiliser ces commandes.

### 3) Exportation la plus "simple" : sauvegarder directement `proxy_logs.db`

Parce que Proxy Monitor est essentiellement SQLite, vous pouvez aussi traiter `proxy_logs.db` comme "paquet de preuves de dépannage" à sauvegarder ensemble (par exemple avec `token_stats.db`). L'emplacement du répertoire de données voir **[Premier démarrage à comprendre](/fr/lbjlaq/Antigravity-Manager/start/first-run-data/)**.

## À lire

- Vouloir clarifier le mappage de modèles : **[Routage de modèles : mappage personnalisé, priorité des caractères génériques et stratégies prédéfinies](/fr/lbjlaq/Antigravity-Manager/advanced/model-router/)**
- Vouloir dépanner les problèmes d'auth : **[401/Échec d'auth : auth_mode, compatibilité Header et liste de configuration client](/fr/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- Vouloir combiner Monitor avec statistiques de coûts : la section suivante parlera de Token Stats (`token_stats.db`)

## Résumé du cours

- La valeur de Proxy Monitor est "reproductible" : enregistre code d'état/chemin/protocole/compte/mappage de modèle/utilisation de tokens, et fournit les détails de requête
- Recherche et filtrage rapide sont l'entrée de dépannage : d'abord réduire la portée, puis cliquer sur détails pour voir payload
- Vider les journaux est une opération irréversible ; l'exportation tend actuellement plus vers "capacité de développement secondaire" et "fichier de base de données sauvegardé"

## Aperçu du prochain cours

> Le prochain cours, nous apprenons **[Token Stats : métriques de statistiques de perspective de coût et interprétation des graphiques](/fr/lbjlaq/Antigravity-Manager/advanced/token-stats/)**, transformant "ça me semble cher" en optimisation quantifiable.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| Entrée page Monitor (monte ProxyMonitor) | [`src/pages/Monitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Monitor.tsx#L1-L12) | 1-12 |
| Interface Monitor : tableau/filtrage/popup détails | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L13-L713) | 13-713 |
| Interface : lire configuration et synchroniser enable_logging | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L243) | 174-243 |
| Interface : basculer enregistrement (écrire config + set_proxy_monitor_enabled) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L254-L267) | 254-267 |
| Interface : écoute événements temps réel (proxy://request) et déduplication | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L273-L355) | 273-355 |
| Interface : vider journaux (clear_proxy_logs) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L389-L403) | 389-403 |
| Interface : charger détails unique (get_proxy_log_detail) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L505-L519) | 505-519 |
| Middleware monitoring : capturer requête/réponse, analyser token, écrire dans monitor | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |
| ProxyMonitor : interrupteur enabled, écrire DB, envoyer événement | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L33-L194) | 33-194 |
| Serveur montage middleware monitoring (layer) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L183-L194) | 183-194 |
| Commandes Tauri : get/count/filter/detail/clear/export | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L180-L314) | 180-314 |
| SQLite : chemin proxy_logs.db, structure table et SQL filtrage | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L1-L416) | 1-416 |
| Description design monitoring (peut différer de l'implémentation, le code source prime) | [`docs/proxy-monitor-technical.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-monitor-technical.md#L1-L53) | 1-53 |

**Constantes clés** :
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024` : corps de requête maximal lisible par middleware monitoring (dépassera échouera)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024` : corps de réponse maximal lisible par middleware monitoring (pour images etc. grosses réponses)

**Fonctions/Commandes clés** :
- `monitor_middleware(...)` : au niveau HTTP collecter requête et réponse, et appeler `monitor.log_request(...)`
- `ProxyMonitor::log_request(...)` : écrire en mémoire + SQLite, et pousser résumé via événement `proxy://request`
- `get_proxy_logs_count_filtered(filter, errors_only)` / `get_proxy_logs_filtered(...)` : filtrage et pagination page liste
- `get_proxy_log_detail(log_id)` : charger corps request/response complet d'un seul journal
- `export_proxy_logs(file_path)` : exporter tous les journaux en fichier JSON (l'interface actuelle n'expose pas le bouton)

</details>
