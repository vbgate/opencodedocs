---
title: "Modèle de stockage : structure des données | Antigravity Tools"
sidebarTitle: "Où sont les données"
subtitle: "Données et modèles : fichiers de compte, base de statistiques SQLite et définitions des champs clés"
description: "Découvrez la structure de stockage des données d'Antigravity Tools. Maîtrisez l'emplacement et la signification des champs de accounts.json, fichiers de compte, token_stats.db/proxy_logs.db."
tags:
  - "Annexe"
  - "Modèle de données"
  - "Structure de stockage"
  - "Sauvegarde"
prerequisite:
  - "start-backup-migrate"
order: 2
---

# Données et modèles : fichiers de compte, base de statistiques SQLite et définitions des champs clés

## Ce que vous pourrez faire après ce chapitre

- Localiser rapidement les emplacements de stockage des données de compte, de la base de statistiques, des fichiers de configuration et des journaux
- Comprendre la structure JSON des fichiers de compte et la signification des champs clés
- Interroger directement via SQLite les journaux des requêtes proxy et les statistiques de consommation de tokens
- Savoir quels fichiers consulter lors de la sauvegarde, de la migration ou du dépannage

## Votre situation actuelle

Lorsque vous avez besoin de :
- **Migrer les comptes vers une nouvelle machine** : vous ne savez pas quels fichiers copier
- **Investiguer des anomalies de compte** : quels champs dans les fichiers de compte peuvent indiquer l'état du compte
- **Exporter la consommation de tokens** : vous souhaitez interroger directement la base de données mais ne connaissez pas la structure des tables
- **Nettoyer les données historiques** : vous craignez de supprimer les mauvais fichiers et de perdre des données

Cette annexe vous aidera à établir une compréhension complète du modèle de données.

---

## Structure du répertoire de données

Les données principales d'Antigravity Tools sont stockées par défaut dans le répertoire `.antigravity_tools` sous le « répertoire personnel de l'utilisateur » (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: warning Clarifier d'abord les limites de sécurité
Ce répertoire contiendra des informations sensibles comme `refresh_token`/`access_token` (source : `source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`). Avant de sauvegarder/copier/partager, assurez-vous que votre environnement cible est digne de confiance.
:::

### Où dois-je trouver ce répertoire ?

::: code-group

```bash [macOS/Linux]
## Entrer dans le répertoire de données
cd ~/.antigravity_tools

## Ou ouvrir dans Finder (macOS)
open ~/.antigravity_tools
```

```powershell [Windows]
## Entrer dans le répertoire de données
Set-Location "$env:USERPROFILE\.antigravity_tools"

## Ou ouvrir dans l'Explorateur de fichiers
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### Aperçu de l'arborescence

```
~/.antigravity_tools/
├── accounts.json          # Index des comptes (version 2.0)
├── accounts/              # Répertoire des comptes
│   └── <account_id>.json  # Un fichier par compte
├── gui_config.json        # Configuration de l'application (écrit par le GUI)
├── token_stats.db         # Base de statistiques de tokens (SQLite)
├── proxy_logs.db          # Base de journaux de surveillance Proxy (SQLite)
├── logs/                  # Répertoire des journaux de l'application
│   └── app.log*           # Rotation quotidienne (le nom du fichier change avec la date)
├── bin/                   # Outils externes (comme cloudflared)
│   └── cloudflared(.exe)
└── device_original.json   # Ligne de base de l'empreinte d'appareil (optionnel)
```

**Règle de chemin du répertoire de données** : prendre `dirs::home_dir()`, concaténer `.antigravity_tools` (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: tip Recommandation de sauvegarde
Sauvegardez régulièrement le répertoire `accounts/`, `accounts.json`, `token_stats.db` et `proxy_logs.db` pour conserver toutes les données principales.
:::

---

## Modèle de données des comptes

### accounts.json (index des comptes)

Le fichier d'index des comptes enregistre les informations résumées de tous les comptes et le compte actuellement sélectionné.

**Emplacement** : `~/.antigravity_tools/accounts.json`

**Schéma** (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`) :

```json
{
  "version": "2.0",                  // Version de l'index
  "accounts": [                       // Liste résumée des comptes
    {
      "id": "uuid-v4",              // ID unique du compte
      "email": "user@gmail.com",     // Email du compte
      "name": "Display Name",        // Nom d'affichage (optionnel)
      "created_at": 1704067200,      // Heure de création (horodatage Unix)
      "last_used": 1704067200       // Dernière utilisation (horodatage Unix)
    }
  ],
  "current_account_id": "uuid-v4"    // ID du compte actuellement sélectionné
}
```

### Fichier de compte ({account_id}.json)

Les données complètes de chaque compte sont stockées indépendamment au format JSON dans le répertoire `accounts/`.

**Emplacement** : `~/.antigravity_tools/accounts/{account_id}.json`

**Schéma** (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42` ; type frontend : `source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`) :

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // Données du token OAuth
    "access_token": "ya29...",      // Jeton d'accès actuel
    "refresh_token": "1//...",      // Jeton d'actualisation (le plus important)
    "expires_in": 3600,            // Temps d'expiration (secondes)
    "expiry_timestamp": 1704070800, // Horodatage d'expiration
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // Optionnel : ID de projet Google Cloud
    "session_id": "..."            // Optionnel : Antigravity sessionId
  },

  "device_profile": {               // Empreinte d'appareil (optionnel)
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // Versions historiques de l'empreinte d'appareil
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Saved from device X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // Données de quota (optionnel)
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // Pourcentage de quota restant
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // Type d'abonnement : FREE/PRO/ULTRA
  },

  "disabled": false,                // Le compte est-il complètement désactivé
  "disabled_reason": null,          // Raison de la désactivation (ex: invalid_grant)
  "disabled_at": null,             // Horodatage de désactivation

  "proxy_disabled": false,         // Est-ce que la fonction proxy est désactivée
  "proxy_disabled_reason": null,   // Raison de la désactivation du proxy
  "proxy_disabled_at": null,       // Horodatage de désactivation du proxy

  "protected_models": [             // Liste des modèles protégés par quota
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### Explication des champs clés

| Champ | Type | Signification métier | Condition de déclenchement |
|--- | --- | --- | ---|
| `disabled` | bool | Le compte est complètement désactivé (ex: refresh_token invalide) | Défini automatiquement sur `true` lors de `invalid_grant` |
| `proxy_disabled` | bool | Désactive uniquement la fonction proxy, n'affecte pas l'utilisation du GUI | Désactivation manuelle ou déclenché par la protection de quota |
| `protected_models` | string[] | « Liste de modèles restreints » pour la protection de quota au niveau du modèle | Mis à jour par la logique de protection de quota |
| `quota.models[].percentage` | number | Pourcentage de quota restant (0-100) | Mis à jour à chaque actualisation de quota |
| `token.refresh_token` | string | Informations d'identification pour obtenir access_token | Obtenu lors de l'autorisation OAuth, valide à long terme |

**Règle importante 1 : invalid_grunt déclenche la désactivation** (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889` ; écriture : `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`) :

- Lorsque l'actualisation du token échoue et que l'erreur contient `invalid_grant`, TokenManager écrira `disabled=true` / `disabled_at` / `disabled_reason` dans le fichier de compte et retirera le compte du pool de tokens.

**Règle importante 2 : sémantique de protected_models** (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250` ; écriture de protection de quota : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`) :

- `protected_models` contient les « ID de modèle normalisés », utilisés pour la protection de quota au niveau du modèle et pour sauter l'ordonnancement.

---

## Base de données de statistiques de tokens

La base de statistiques de tokens enregistre la consommation de tokens de chaque demande de proxy, utilisée pour la surveillance des coûts et l'analyse des tendances.

**Emplacement** : `~/.antigravity_tools/token_stats.db`

**Moteur de base de données** : SQLite + mode WAL (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`)

### Structure des tables

#### token_usage (enregistrements d'utilisation bruts)

| Champ | Type | Description |
|--- | --- | ---|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Clé primaire auto-incrémentée |
| timestamp | INTEGER | Horodatage de la demande |
| account_email | TEXT | Email du compte |
| model | TEXT | Nom du modèle |
| input_tokens | INTEGER | Nombre de tokens d'entrée |
| output_tokens | INTEGER | Nombre de tokens de sortie |
| total_tokens | INTEGER | Nombre total de tokens |

**Instruction de création de table** (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`) :

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly (table d'agrégation horaire)

Agrège l'utilisation des tokens toutes les heures, pour une interrogation rapide des données de tendance.

**Instruction de création de table** (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`) :

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- Seau de temps (format : YYYY-MM-DD HH:00)
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### Indexes

Pour améliorer les performances d'interrogation, la base de données a établi les index suivants (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`) :

```sql
-- Index par temps décroissant
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- Index par compte
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### Exemples d'interrogations courantes

#### Interroger la consommation de tokens des 24 dernières heures

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### Statistiques de consommation par modèle

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info Définition des champs de temps
`token_usage.timestamp` est un horodatage Unix écrit par `chrono::Utc::now().timestamp()` (précision en secondes), et `token_stats_hourly.hour_bucket` est également une chaîne générée en UTC (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`).
:::

---

## Base de données de journaux de surveillance Proxy

La base de journaux Proxy enregistre les détails de chaque demande de proxy, utilisée pour le dépannage et l'audit des demandes.

**Emplacement** : `~/.antigravity_tools/proxy_logs.db`

**Moteur de base de données** : SQLite + mode WAL (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`)

### Structure de la table : request_logs

| Champ | Type | Description |
|--- | --- | ---|
| id | TEXT PRIMARY KEY | ID unique de la demande (UUID) |
| timestamp | INTEGER | Horodatage de la demande |
| method | TEXT | Méthode HTTP (GET/POST) |
| url | TEXT | URL de la demande |
| status | INTEGER | Code d'état HTTP |
| duration | INTEGER | Durée de la demande (millisecondes) |
| model | TEXT | Nom du modèle demandé par le client |
| mapped_model | TEXT | Nom du modèle réellement utilisé après le routage |
| account_email | TEXT | Email du compte utilisé |
| error | TEXT | Message d'erreur (le cas échéant) |
| request_body | TEXT | Corps de la demande (optionnel, occupe beaucoup d'espace) |
| response_body | TEXT | Corps de la réponse (optionnel, occupe beaucoup d'espace) |
| input_tokens | INTEGER | Nombre de tokens d'entrée |
| output_tokens | INTEGER | Nombre de tokens de sortie |
| protocol | TEXT | Type de protocole (openai/anthropic/gemini) |

**Instruction de création de table** (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`) :

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- Compatibilité : ajouter progressivement de nouveaux champs via ALTER TABLE
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### Indexes

```sql
-- Index par temps décroissant
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- Index par code d'état
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### Nettoyage automatique

Lorsque le système démarre ProxyMonitor, il nettoie automatiquement les journaux de plus de 30 jours et exécute `VACUUM` sur la base de données (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60` ; implémentation : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`).

### Exemples d'interrogations courantes

#### Interroger les demandes échouées récentes

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### Statistiques du taux de réussite par compte

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## Fichiers de configuration

### gui_config.json

Stocke les informations de configuration de l'application, y compris les paramètres de proxy, le mappage des modèles, le mode d'authentification, etc.

**Emplacement** : `~/.antigravity_tools/gui_config.json` (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`)

La structure de ce fichier suit `AppConfig` (source : `source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`).

::: tip Si vous avez besoin de « sauvegarder/migrer uniquement »
La méthode la plus simple consiste à : fermer l'application puis à compresser l'ensemble du répertoire `~/.antigravity_tools/`. La sémantique de mise à jour à chaud/redémarrage de la configuration relève du « comportement d'exécution » ; voir le cours avancé **[Configuration complète](../../advanced/config/)**.
:::

---

## Fichiers journaux

### Journaux de l'application

**Emplacement** : `~/.antigravity_tools/logs/` (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`)

Les journaux utilisent une rotation de fichier quotidienne, le nom de fichier de base étant `app.log` (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`).

**Niveau de journalisation** : INFO/WARN/ERROR

**Usage** : Enregistre les événements clés, les messages d'erreur et les informations de débogage pendant l'exécution de l'application, utilisés pour le dépannage.

---

## Migration et sauvegarde des données

### Sauvegarder les données principales

::: code-group

```bash [macOS/Linux]
## Sauvegarder l'ensemble du répertoire de données (le plus stable)
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## Sauvegarder l'ensemble du répertoire de données (le plus stable)
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### Migrer vers une nouvelle machine

1. Fermez Antigravity Tools (éviter que la copie interrompe l'écriture)
2. Copiez `.antigravity_tools` de la machine source vers le répertoire personnel de la machine cible
3. Démarrez Antigravity Tools

::: tip Migration multi-plateforme
Si vous migrez de Windows vers macOS/Linux (ou vice versa), il suffit de copier l'ensemble du répertoire `.antigravity_tools`. Le format des données est compatible multi-plateforme.
:::

### Nettoyer les données historiques

::: info D'abord la conclusion
- `proxy_logs.db` : nettoyage automatique de 30 jours (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`).
- `token_stats.db` : la structure de table est initialisée au démarrage (source : `source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`), mais le code source ne montre pas de logique de « nettoyage automatique des enregistrements historiques par jour ».
:::

::: danger À faire uniquement si vous êtes certain de ne plus avoir besoin des données historiques
Vider les statistiques/journaux vous fera perdre les données historiques de dépannage et d'analyse des coûts. Sauvegardez d'abord l'ensemble de `.antigravity_tools` avant d'agir.
:::

Si vous souhaitez simplement « vider l'historique et recommencer », la méthode la plus stable consiste à supprimer les fichiers de base de données après avoir fermé l'application (la structure de table sera reconstruite au prochain démarrage).

::: code-group

```bash [macOS/Linux]
## Vider les statistiques de tokens (perdra l'historique)
rm -f ~/.antigravity_tools/token_stats.db

## Vider les journaux de surveillance Proxy (perdra l'historique)
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## Vider les statistiques de tokens (perdra l'historique)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## Vider les journaux de surveillance Proxy (perdra l'historique)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## Explication des définitions de champs courants

### Horodatage Unix

Tous les champs liés au temps (comme `created_at`, `last_used`, `timestamp`) utilisent l'horodatage Unix (précision en secondes).

**Conversion en temps lisible** :

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## Interrogation SQLite (exemple : convertir request_logs.timestamp en temps lisible)
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### Pourcentage de quota

`quota.models[].percentage` indique le pourcentage de quota restant (0-100) (source : `source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40` ; modèle backend : `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`).

Si la « protection de quota » est déclenchée dépend de `quota_protection.enabled/threshold_percentage/monitored_models` (source : `source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63` ; écriture `protected_models` : `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`).

---

## Résumé de ce chapitre

- Le répertoire de données d'Antigravity Tools se trouve dans `.antigravity_tools` sous le répertoire personnel de l'utilisateur
- Données de compte : `accounts.json` (index) + `accounts/<account_id>.json` (données complètes d'un compte)
- Données de statistiques : `token_stats.db` (statistiques de tokens) + `proxy_logs.db` (journaux de surveillance Proxy)
- Configuration et exploitation : `gui_config.json`, `logs/`, `bin/cloudflared*`, `device_original.json`
- La méthode la plus stable pour sauvegarder/migrer est de « compresser l'ensemble de `.antigravity_tools` après avoir fermé l'application »

---

## Aperçu du prochain chapitre

> Dans le prochain chapitre, nous étudierons **[Limites des capacités d'intégration z.ai](../zai-boundaries/)**.
>
> Vous apprendrez :
> - La liste des fonctionnalités implémentées pour l'intégration z.ai
> - Les fonctionnalités explicitement non implémentées et les limitations d'utilisation
> - Explication de l'implémentation expérimentale de Vision MCP

---

## Annexe : référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
| Répertoire de données (.antigravity_tools) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Répertoire des comptes (accounts/) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| Structure accounts.json | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Structure Account (backend) | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Structure Account (frontend) | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| Structure TokenData/QuotaData | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| Structure TokenData/QuotaData | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Initialisation de la base de statistiques de tokens (schéma) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Initialisation de la base de journaux Proxy (schéma) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Nettoyage automatique des journaux Proxy (30 jours) | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Implémentation du nettoyage automatique des journaux Proxy | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| Lecture/écriture gui_config.json | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| Répertoire logs/ et app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| Chemin bin/cloudflared | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
|--- | --- | ---|

**Constantes clés** :
- `DATA_DIR = ".antigravity_tools"` : nom du répertoire de données (`src-tauri/src/modules/account.rs:16-18`)
- `ACCOUNTS_INDEX = "accounts.json"` : nom du fichier d'index des comptes (`src-tauri/src/modules/account.rs:16-18`)
- `CONFIG_FILE = "gui_config.json"` : nom du fichier de configuration (`src-tauri/src/modules/config.rs:7`)

**Fonctions clés** :
- `get_data_dir()` : obtenir le chemin du répertoire de données (`src-tauri/src/modules/account.rs`)
- `record_usage()` : écrire dans `token_usage`/`token_stats_hourly` (`src-tauri/src/modules/token_stats.rs`)
- `save_log()` : écrire dans `request_logs` (`src-tauri/src/modules/proxy_db.rs`)
- `cleanup_old_logs(days)` : supprimer les anciens `request_logs` et `VACUUM` (`src-tauri/src/modules/proxy_db.rs`)

</details>
