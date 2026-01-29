---
title: "Configuration : Mise à jour à chaud et migration | Antigravity-Manager"
subtitle: "Configuration : Mise à jour à chaud et migration | Antigravity-Manager"
sidebarTitle: "Configuration ne prend pas effet"
description: "Apprenez les mécanismes de persistance, de mise à jour à chaud et de migration du système de configuration. Maîtrisez les valeurs par défaut des champs et les méthodes de vérification d'authentification pour éviter les pièges courants."
tags:
  - "Configuration"
  - "gui_config.json"
  - "AppConfig"
  - "ProxyConfig"
  - "Mise à jour à chaud"
prerequisite:
  - "start-first-run-data"
  - "start-proxy-and-first-client"
order: 1
---
# Configuration complète : AppConfig/ProxyConfig, emplacement de persistance et sémantique de mise à jour à chaud

Vous avez modifié `auth_mode` mais le client renvoie toujours 401 ; vous avez activé `allow_lan_access` mais les appareils du même segment réseau ne peuvent pas se connecter ; vous souhaitez migrer la configuration vers une nouvelle machine mais ne savez pas quels fichiers copier.

Ce cours explique en détail le système de configuration d'Antigravity Tools : où la configuration est stockée, quelles sont les valeurs par défaut, ce qui peut être mis à jour à chaud, ce qui nécessite le redémarrage du proxy inverse.

## Qu'est-ce que AppConfig/ProxyConfig ?

**AppConfig/ProxyConfig** sont les modèles de données de configuration d'Antigravity Tools : AppConfig gère les paramètres généraux de l'application de bureau (langue, thème, préchauffage, protection de quotas, etc.), ProxyConfig gère les paramètres d'exécution du service de proxy inverse local (port, authentification, mappage de modèles, proxy amont, etc.). Ils sont finalement sérialisés dans le même fichier `gui_config.json`, le proxy inverse lit le ProxyConfig à l'intérieur lors du démarrage.

## Ce que vous pourrez faire après ce cours

- Trouver l'emplacement réel de persistance du fichier de configuration `gui_config.json` et pouvoir effectuer une sauvegarde/migration
- Comprendre les champs clés et les valeurs par défaut de AppConfig/ProxyConfig (basés sur le code source)
- Clarifier quelles configurations prennent effet immédiatement après l'enregistrement, lesquelles nécessitent le redémarrage du proxy inverse
- Comprendre quand se produit une "migration de configuration" (anciens champs fusionnés/supprimés automatiquement)

## Votre problème actuel

- Vous avez modifié la configuration mais elle "ne prend pas effet", vous ne savez pas si ce n'est pas enregistré, pas mis à jour à chaud, ou si un redémarrage est nécessaire
- Vous souhaitez apporter uniquement la "configuration de proxy inverse" vers une nouvelle machine, mais craignez d'apporter également les données de compte
- Après la mise à niveau, d'anciens champs apparaissent, vous craignez que le format du fichier de configuration ne soit "cassé"

## Quand utiliser cette méthode

- Vous préparez à passer le proxy inverse de "uniquement local" à "accessible par le réseau local"
- Vous modifiez la stratégie d'authentification (`auth_mode`/`api_key`) et souhaitez vérifier immédiatement qu'elle prend effet
- Vous devez maintenir en masse le mappage de modèles/le proxy amont/la configuration z.ai

## 🎒 Préparatifs avant de commencer

- Vous savez déjà ce qu'est le répertoire de données (voir [Premier démarrage : Répertoire de données, journaux, barre des tâches et démarrage automatique](../../start/first-run-data/))
- Vous pouvez démarrer une fois le service de proxy inverse (voir [Démarrer le proxy inverse local et connecter le premier client](../../start/proxy-and-first-client/))

::: warning Délimitons d'abord
Ce cours vous apprendra à lire/sauvegarder/migrer `gui_config.json`, mais ne recommande pas de le considérer comme un "fichier de configuration maintenu manuellement à long terme". Car le backend re-sérialisera selon la structure Rust `AppConfig` lors de l'enregistrement de la configuration, et les champs inconnus insérés manuellement seront probablement supprimés automatiquement lors du prochain enregistrement.
:::

## Idée centrale

Pour la configuration, souvenez-vous de ces trois phrases :

1. AppConfig est l'objet racine de la configuration persistante, stocké dans `gui_config.json`.
2. ProxyConfig est un sous-objet de `AppConfig.proxy`, le démarrage/la mise à jour à chaud du proxy inverse tournent autour de lui.
3. La mise à jour à chaud est "mise à jour uniquement de l'état en mémoire" : ce qui peut être mis à jour à chaud ne signifie pas que le port d'écoute/l'adresse d'écoute peut être modifié.

## Suivez le guide

### Étape 1 : Localisez `gui_config.json` (la source unique de vérité de la configuration)

**Pourquoi**
Tous vos "sauvegardes/migrations/dépannage" ultérieurs doivent se baser sur ce fichier.

Le répertoire de données du backend est `.antigravity_tools` sous votre répertoire Home (créé automatiquement s'il n'existe pas), le nom du fichier de configuration est fixé à `gui_config.json`.

::: code-group

```bash [macOS/Linux]
CONFIG_FILE="$HOME/.antigravity_tools/gui_config.json"
echo "$CONFIG_FILE"
ls -la "$CONFIG_FILE" || true
```

```powershell [Windows]
$configFile = Join-Path $HOME ".antigravity_tools\gui_config.json"
$configFile
Get-ChildItem -Force $configFile -ErrorAction SilentlyContinue
```

:::

**Vous devriez voir** :
- Si vous n'avez pas encore démarré le proxy inverse, ce fichier peut ne pas exister (le backend utilisera directement la configuration par défaut).
- Lorsque le service de proxy inverse démarre ou que les paramètres sont enregistrés, il sera automatiquement créé et écrit en JSON.

### Étape 2 : Sauvegardez d'abord une copie (protection contre les erreurs + facilité de retour arrière)

**Pourquoi**
La configuration peut contenir des champs sensibles comme `proxy.api_key`, la clé `api_key` de z.ai, etc. Lorsque vous souhaitez migrer/comparer, la sauvegarde est plus fiable que la "mémoire".

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/antigravity-config-backup"
cp "$HOME/.antigravity_tools/gui_config.json" "$HOME/antigravity-config-backup/gui_config.$(date +%Y%m%d%H%M%S).json"
```

```powershell [Windows]
$backupDir = Join-Path $HOME "antigravity-config-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$ts = Get-Date -Format "yyyyMMddHHmmss"
Copy-Item (Join-Path $HOME ".antigravity_tools\gui_config.json") (Join-Path $backupDir "gui_config.$ts.json")
```

:::

**Vous devriez voir** : Un fichier JSON avec horodatage apparaît dans le répertoire de sauvegarde.

### Étape 3 : Clarifiez les valeurs par défaut (ne devinez pas au feeling)

**Pourquoi**
Beaucoup de problèmes de "configuration impossible" sont en fait dus à vos attentes incorrectes sur les valeurs par défaut.

Les valeurs par défaut ci-dessous proviennent de `AppConfig::new()` et `ProxyConfig::default()` du backend :

| Bloc de configuration | Champ | Valeur par défaut (code source) | Ce que vous devez retenir |
| --- | --- | --- | --- |
| AppConfig | `language` | `"zh"` | Chinois par défaut |
| AppConfig | `theme` | `"system"` | Suit le système |
| AppConfig | `auto_refresh` | `true` | Actualise automatiquement les quotas par défaut |
| AppConfig | `refresh_interval` | `15` | Unité : minutes |
| ProxyConfig | `enabled` | `false` | Ne démarre pas le proxy inverse par défaut |
| ProxyConfig | `allow_lan_access` | `false` | Lie uniquement à la machine locale par défaut (priorité à la confidentialité) |
| ProxyConfig | `auth_mode` | `"off"` | Pas d'authentification par défaut (scénario uniquement local) |
| ProxyConfig | `port` | `8045` | C'est le champ que vous modifiez le plus souvent |
| ProxyConfig | `api_key` | `"sk-<uuid>"` | Génère une clé aléatoire par défaut |
| ProxyConfig | `request_timeout` | `120` | Unité : secondes (note : le proxy inverse peut ne pas l'utiliser actuellement) |
| ProxyConfig | `enable_logging` | `true` | Active la collecte de journaux dont dépendent la surveillance/les statistiques par défaut |
| StickySessionConfig | `mode` | `Balance` | La stratégie de planification est équilibrée par défaut |
| StickySessionConfig | `max_wait_seconds` | `60` | Significatif uniquement pour le mode CacheFirst |

::: tip Comment voir les champs complets ?
Vous pouvez ouvrir directement `gui_config.json` et comparer avec le code source : `src-tauri/src/models/config.rs` (AppConfig) et `src-tauri/src/proxy/config.rs` (ProxyConfig). La "Référence du code source" à la fin de ce cours donne des liens de numéros de ligne cliquables.
:::

### Étape 4 : Modifiez une configuration "sûrement mise à jour à chaud" et vérifiez immédiatement (exemple : authentification)

**Pourquoi**
Vous avez besoin d'une boucle "modifié, immédiatement vérifiable" pour éviter les modifications aveugles dans l'interface utilisateur.

Lorsque le proxy inverse est en cours d'exécution, `save_config` du backend mettra à jour à chaud en mémoire ces contenus :

- `proxy.custom_mapping`
- `proxy.upstream_proxy`
- `proxy.auth_mode` / `proxy.api_key` (stratégie de sécurité)
- `proxy.zai`
- `proxy.experimental`

Ici nous utilisons `auth_mode` comme exemple :

1. Ouvrez la page `API Proxy`, assurez-vous que le service de proxy inverse est en cours d'exécution (Running).
2. Définissez `auth_mode` sur `all_except_health`, et confirmez que vous connaissez le `api_key` actuel.
3. Utilisez la demande suivante pour vérifier "contrôle de santé autorisé, autres interfaces bloquées".

::: code-group

```bash [macOS/Linux]
#Demande /healthz sans clé : devrait réussir
curl -sS "http://127.0.0.1:8045/healthz" && echo

#Demande /v1/models sans clé : devrait 401
curl -sS -i "http://127.0.0.1:8045/v1/models"

#Demande /v1/models avec clé : devrait réussir
curl -sS -H "Authorization: Bearer <proxy.api_key>" "http://127.0.0.1:8045/v1/models"
```

```powershell [Windows]
#Demande /healthz sans clé : devrait réussir
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/healthz" | Select-Object -ExpandProperty StatusCode

#Demande /v1/models sans clé : devrait 401
try { Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" } catch { $_.Exception.Response.StatusCode.value__ }

#Demande /v1/models avec clé : devrait réussir
$headers = @{ Authorization = "Bearer <proxy.api_key>" }
(Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" -Headers $headers).StatusCode
```

:::

**Vous devriez voir** : `/healthz` renvoie 200 ; `/v1/models` renvoie 401 sans clé, réussit avec clé.

### Étape 5 : Modifiez une configuration "nécessitant le redémarrage du proxy inverse" (port / adresse d'écoute)

**Pourquoi**
Beaucoup de configurations sont "enregistrées mais ne prennent pas effet", la cause racine n'est pas un bug, mais cela détermine comment le TCP Listener est lié.

Au démarrage du proxy inverse, le backend utilisera `allow_lan_access` pour calculer l'adresse d'écoute (`127.0.0.1` ou `0.0.0.0`), et utilisera `port` pour lier le port ; cette étape se produit uniquement dans `start_proxy_service`.

Suggestions d'opération :

1. Dans la page `API Proxy`, modifiez `port` vers une nouvelle valeur (par exemple `8050`), enregistrez.
2. Arrêtez le service de proxy inverse, puis redémarrez-le.
3. Vérifiez `/healthz` avec le nouveau port.

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:8050/healthz" && echo
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8050/healthz" | Select-Object -ExpandProperty StatusCode
```

:::

**Vous devriez voir** : Le nouveau port est accessible ; l'ancien port échoue à se connecter ou renvoie vide.

::: warning À propos de `allow_lan_access`
Dans le code source, `allow_lan_access` affecte deux choses en même temps :

1. **Adresse d'écoute** : Détermine de lier `127.0.0.1` ou `0.0.0.0` (nécessite le redémarrage du proxy inverse pour rebind).
2. **Stratégie d'authentification auto** : Lorsque `auth_mode=auto`, le scénario LAN convertira automatiquement en `all_except_health` (cette partie peut être mise à jour à chaud).
:::

### Étape 6 : Comprenez une "migration de configuration" (anciens champs automatiquement nettoyés)

**Pourquoi**
Après la mise à niveau, vous pouvez voir d'anciens champs dans `gui_config.json`, craignant que ce soit "cassé". En fait, lors du chargement de la configuration, le backend effectuera une migration : fusionner `anthropic_mapping/openai_mapping` dans `custom_mapping`, et supprimer les anciens champs, puis enregistrer automatiquement une fois.

Vous pouvez vous auto-vérifier avec cette règle :

- Si vous voyez `proxy.anthropic_mapping` ou `proxy.openai_mapping` dans le fichier, ils seront supprimés après le prochain démarrage/chargement de la configuration.
- Lors de la fusion, les clés se terminant par `-series` sont ignorées (ces derniers sont maintenant gérés par la logique preset/builtin).

**Vous devriez voir** : Après la migration, seuls `proxy.custom_mapping` restent dans `gui_config.json`.

## Point de contrôle ✅

- Vous pouvez trouver `$HOME/.antigravity_tools/gui_config.json` sur votre machine locale
- Vous pouvez expliquer clairement pourquoi les configurations comme `auth_mode/api_key/custom_mapping` peuvent être mises à jour à chaud
- Vous pouvez expliquer clairement pourquoi les configurations comme `port/allow_lan_access` nécessitent le redémarrage du proxy inverse

## Rappels sur les pièges

1. La mise à jour à chaud de `save_config` ne couvre que peu de champs : elle ne vous aide pas à redémarrer le listener, et ne pousse pas non plus les configurations comme `scheduling` vers TokenManager.
2. `request_timeout` n'est pas vraiment en vigueur dans l'implémentation actuelle du proxy inverse : dans le paramètre `start` d'AxumServer, c'est `_request_timeout`, et l'état a le délai d'attente codé en dur à `300` secondes.
3. Insérer manuellement "champs personnalisés" dans `gui_config.json` n'est pas fiable : lors de l'enregistrement par le backend, il le re-sérialisera en `AppConfig`, et les champs inconnus seront supprimés.

## Résumé du cours

- La persistance de la configuration n'a qu'une seule entrée : `$HOME/.antigravity_tools/gui_config.json`
- "Peut être mis à jour à chaud" de ProxyConfig ne signifie pas "peut changer de port/changer d'adresse d'écoute" ; tout ce qui implique un bind nécessite le redémarrage du proxy inverse
- Ne paniquez pas en voyant d'anciens champs de mappage : lors du chargement de la configuration, ils seront automatiquement migrés vers `custom_mapping` et les anciens champs nettoyés

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Sécurité et confidentialité : auth_mode, allow_lan_access, et la conception "ne pas divulguer les informations de compte"](../security/)**.
>
> Vous apprendrez :
> - Quand l'authentification doit être activée (et pourquoi `auto` est plus strict dans le scénario LAN)
> - La stratégie d'exposition minimale lors de l'exposition du proxy inverse local au réseau local/public
> - Quelles données sont envoyées à l'amont, lesquelles sont stockées uniquement localement

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Sujet | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Valeurs par défaut de AppConfig (`AppConfig::new()`) | [`src-tauri/src/models/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/config.rs#L4-L158) | 4-158 |
| Valeurs par défaut de ProxyConfig (port/authentification/adresse d'écoute) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L74-L292) | 74-292 |
| Valeurs par défaut de StickySessionConfig (planification) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L36) | 3-36 |
| Nom de fichier de persistance de configuration + logique de migration (`gui_config.json`) | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| Répertoire de données (`$HOME/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| `save_config` : enregistrer la configuration + quels champs mettre à jour à chaud | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| AxumServer : `update_mapping/update_proxy/update_security/...` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L45-L117) | 45-117 |
| Sélection de l'adresse d'écoute pour `allow_lan_access` | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L81-L92) | 81-92 |
| Adresse de bind et port au démarrage du Proxy (change uniquement après redémarrage) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L134) | 42-134 |
| Règle réelle de `auth_mode=auto` | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L3-L31) | 3-31 |
| Enregistrement de la configuration de planification par le frontend (enregistrement uniquement, ne pousse pas vers le backend en cours d'exécution) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L476-L501) | 476-501 |
| Page Monitor : activation/désactivation dynamique de la collecte de journaux | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L263) | 174-263 |

</details>
