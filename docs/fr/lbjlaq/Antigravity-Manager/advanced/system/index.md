---
title: "Capacités système : Langage/Thème/API | Antigravity-Manager"
sidebarTitle: "Configurer le système en 5 minutes"
subtitle: "Capacités système : Langage/Thème/API | Antigravity-Manager"
description: "Apprenez les langages, thèmes, barre d'état et API Server d'Antigravity Tools. Maîtrisez i18n fallback, démarrage automatique, appels d'interface HTTP et règles de redémarrage."
tags:
  - "Configuration système"
  - "i18n"
  - "Thème"
  - "Mise à jour"
  - "Barre d'état"
  - "HTTP API"
prerequisite:
  - "start-first-run-data"
  - "advanced-config"
order: 9
---

# Capacités système : multilingue/thème/mise à jour/démarrage auto/HTTP API Server

Vous passez votre thème en dark, mais l'interface reste claire ; vous avez fermé la fenêtre, mais le processus tourne encore en arrière-plan ; vous souhaitez qu'un outil externe bascule le compte actuel sans exposer le reverse proxy à votre réseau local.

Cette leçon se concentre sur les "capacités système" d'Antigravity Tools : langage, thème, mise à jour, barre d'état/démarrage automatique, et un HTTP API Server pour les appels de programmes externes.

## Qu'est-ce que les capacités système ?

Les **capacités système** désignent les "capacités de produitisation" d'Antigravity Tools en tant qu'application de bureau : changement de langue et de thème de l'interface, vérification et installation de mises à jour, résidence dans la barre d'état après fermeture de la fenêtre et démarrage automatique, ainsi que la fourniture d'un HTTP API Server qui ne se lie qu'à `127.0.0.1` pour les appels de programmes externes.

## Ce que vous saurez faire à la fin

- Changer de langue/thème et comprendre ce qui prend effet "immédiatement"
- Comprendre la différence entre "fermer la fenêtre" et "quitter l'application", et ce que le menu de la barre d'état peut faire
- Connaître les conditions de déclenchement, l'intervalle et le fichier de stockage de la vérification automatique des mises à jour
- Activer l'HTTP API Server et utiliser `curl` pour tester la santé et le basculement de compte

## 🎒 Avant de commencer

- Vous savez où se trouve le répertoire de données (voir [Premier lancement : répertoire de données, journaux, barre d'état et démarrage automatique](../../start/first-run-data/))
- Vous savez que `gui_config.json` est la source unique de vérité pour le stockage des configurations (voir [Configuration complète : AppConfig/ProxyConfig, emplacement de stockage et sémantique de mise à jour à chaud](../config/))

## Idée clé

Il est plus facile de mémoriser ces capacités en les divisant en deux catégories :

1. Capacités "pilotées par configuration" : langue et thème sont écrits dans `gui_config.json` (frontend appelle `save_config`).
2. Capacités "à stockage indépendant" : paramètres de mise à jour et paramètres HTTP API ont chacun leur propre fichier JSON ; la barre d'état et le comportement de fermeture sont contrôlés côté Tauri.

## Suivez-moi

### Étape 1 : Changer de langue (effet immédiat + persistence automatique)

**Pourquoi**
Le changement de langue fait souvent penser qu'il faut "redémarrer". Ici, l'implémentation est : l'interface change immédiatement, tout en écrivant `language` dans la configuration.

Action : ouvrez `Settings` -> `General`, et choisissez une langue dans le menu déroulant.

Vous verrez deux choses se produire presque simultanément :

- L'interface passe immédiatement à la nouvelle langue (frontend appelle directement `i18n.changeLanguage(newLang)`).
- La configuration est persistée (frontend appelle `updateLanguage(newLang)`, qui déclenche en interne `save_config`).

::: info D'où viennent les packs de langue ?
Le frontend initialise les ressources multilingues avec `i18next` et définit `fallbackLng: "en"`. Cela signifie : si une key manque de traduction, elle revient à l'anglais.
:::

### Étape 2 : Changer de thème (light/dark/system)

**Pourquoi**
Le thème affecte non seulement le CSS, mais aussi la couleur de fond de la fenêtre Tauri, l'attribut `data-theme` de DaisyUI et la classe `dark` de Tailwind.

Action : dans `Settings` -> `General`, passez le thème sur `light` / `dark` / `system`.

Vous devriez voir :

- Le thème prend effet immédiatement (`ThemeManager` lit la configuration et l'applique à `document.documentElement`).
- Quand le thème est `system`, les changements de couleur du système se synchronisent en temps réel avec l'application (écoute de `prefers-color-scheme`).

::: warning Une exception pour Linux
`ThemeManager` essaie d'appeler `getCurrentWindow().setBackgroundColor(...)` pour définir la couleur de fond de la fenêtre, mais sur Linux cette étape est ignorée (le code source contient un commentaire : fenêtre transparente + softbuffer peut provoquer des plantages).
:::

### Étape 3 : Démarrage automatique (et pourquoi il inclut `--minimized`)

**Pourquoi**
Le démarrage automatique n'est pas un "champ de configuration", mais une entrée de registre au niveau système (plugin Tauri autostart).

Action : dans `Settings` -> `General`, activez/désactivez "Démarrage automatique".

Vous devriez voir :

- Au basculement, `toggle_auto_launch(enable)` du backend est appelé directement.
- À l'initialisation de la page, `is_auto_launch_enabled()` est appelé pour afficher l'état réel (sans compter sur le cache local).

Complément : lors de l'initialisation du plugin autostart, le paramètre `--minimized` est passé, donc "démarrage automatique au démarrage" se lance généralement sous forme réduite/en arrière-plan (le comportement exact dépend de la façon dont le frontend gère ce paramètre).

### Étape 4 : Comprendre "fermer la fenêtre" et "quitter l'application"

**Pourquoi**
De nombreuses applications de bureau "ferment et quittent", mais le comportement par défaut d'Antigravity Tools est "fermer et cacher dans la barre d'état".

Vous devriez savoir :

- Après avoir cliqué sur le bouton de fermeture de la fenêtre, Tauri intercepte l'événement de fermeture et exécute `hide()`, au lieu de quitter le processus.
- Le menu de la barre d'état contient `Show`/`Quit` : pour quitter complètement, utilisez `Quit`.
- Le texte affiché dans la barre d'état suit `config.language` (lors de la création de la barre d'état, la langue de configuration est lue et le texte de traduction est récupéré ; après la mise à jour de la configuration, l'événement `config://updated` est écouté pour rafraîchir le menu de la barre d'état).

### Étape 5 : Vérification des mises à jour (déclenchement automatique + vérification manuelle)

**Pourquoi**
La mise à jour utilise simultanément deux systèmes :

- Logique personnalisée de "vérification de version" : récupère la dernière version des GitHub Releases, détermine s'il y a une mise à jour.
- Tauri Updater : responsable du téléchargement et de l'installation, puis `relaunch()`.

Vous pouvez l'utiliser ainsi :

1. Vérification automatique : après le démarrage de l'application, `should_check_updates` est appelé, si une vérification est nécessaire, `UpdateNotification` s'affiche, et `last_check_time` est immédiatement mis à jour.
2. Vérification manuelle : cliquez sur "Vérifier les mises à jour" dans la page `Settings` (appelle `check_for_updates`, et affiche le résultat dans l'interface).

::: tip D'où vient l'intervalle de mise à jour ?
Le backend enregistre les paramètres de mise à jour dans `update_settings.json` du répertoire de données, par défaut `auto_check=true`, `check_interval_hours=24`.
:::

### Étape 6 : Activer l'HTTP API Server (liaison locale uniquement)

**Pourquoi**
Si vous souhaitez qu'un programme externe (comme un plugin VS Code) "change de compte/rafraîchisse le quota/lise les journaux", l'HTTP API Server est plus approprié que le port de reverse proxy : il est lié à `127.0.0.1`, ouvert uniquement pour la machine locale.

Action : dans `Settings` -> `Advanced`, section "HTTP API" :

1. Activez l'interrupteur.
2. Définissez le port et cliquez sur Enregistrer.

Vous devriez voir : l'interface vous invite à "redémarrage nécessaire" (car le backend ne lit `http_api_settings.json` et ne démarre le service qu'au démarrage).

### Étape 7 : Vérifier l'HTTP API avec curl (santé/compte/basculement/journaux)

**Pourquoi**
Vous avez besoin d'une boucle de vérification reproductible : pouvoir atteindre `health`, lister les comptes, déclencher le basculement/rafraîchissement et comprendre qu'ils sont des tâches asynchrones.

Le port par défaut est `19527`. Si vous avez modifié le port, remplacez `19527` par votre valeur réelle ci-dessous.

::: code-group

```bash [macOS/Linux]
 # Santé
curl -sS "http://127.0.0.1:19527/health" && echo

 # Lister les comptes (incluant le résumé du quota)
curl -sS "http://127.0.0.1:19527/accounts" | head -n 5

 # Obtenir le compte actuel
curl -sS "http://127.0.0.1:19527/accounts/current" | head -n 5

 # Déclencher le basculement de compte (note : retourne 202, exécution asynchrone en arrière-plan)
curl -sS -i \
  -H 'Content-Type: application/json' \
  -d '{"account_id":"<account_id>"}' \
  "http://127.0.0.1:19527/accounts/switch"

 # Déclencher le rafraîchissement de tous les quotas (également 202, exécution asynchrone)
curl -sS -i -X POST "http://127.0.0.1:19527/accounts/refresh"

 # Lire les journaux du proxy (limit/offset/filter/errors_only)
curl -sS "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | head -n 5
```

```powershell [Windows]
 # Santé
Invoke-RestMethod "http://127.0.0.1:19527/health"

 # Lister les comptes
Invoke-RestMethod "http://127.0.0.1:19527/accounts" | ConvertTo-Json -Depth 5

 # Obtenir le compte actuel
Invoke-RestMethod "http://127.0.0.1:19527/accounts/current" | ConvertTo-Json -Depth 5

 # Déclencher le basculement de compte (retourne 202)
$body = @{ account_id = "<account_id>" } | ConvertTo-Json
Invoke-WebRequest -Method Post -ContentType "application/json" -Body $body "http://127.0.0.1:19527/accounts/switch" | Select-Object -ExpandProperty StatusCode

 # Déclencher le rafraîchissement de tous les quotas (retourne 202)
Invoke-WebRequest -Method Post "http://127.0.0.1:19527/accounts/refresh" | Select-Object -ExpandProperty StatusCode

 # Lire les journaux du proxy
Invoke-RestMethod "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | ConvertTo-Json -Depth 5
```

:::

**Vous devriez voir** :

- `/health` retourne un JSON au style `{"status":"ok","version":"..."}`.
- `/accounts/switch` retourne 202 (Accepted), et indique "task started". Le basculement réel s'exécute en arrière-plan.

## Point de contrôle ✅

- Vous pouvez expliquer : pourquoi langue/thème "changent et prennent effet immédiatement", mais le port HTTP API nécessite un redémarrage
- Vous pouvez expliquer : pourquoi fermer la fenêtre ne quitte pas l'application, et comment quitter réellement
- Vous pouvez utiliser `curl` pour atteindre `/health` et `/accounts`, et comprendre que `/accounts/switch` est asynchrone

## Pièges à éviter

1. L'HTTP API Server est lié à `127.0.0.1`, c'est une chose différente de `proxy.allow_lan_access`.
2. La logique "vérifier ou non" de la vérification des mises à jour est déterminée au démarrage de l'application ; une fois déclenchée, elle met d'abord à jour `last_check_time`, même si la vérification échoue par la suite, elle ne répétera pas la fenêtre contextuelle dans un court délai.
3. "Fermer la fenêtre ne quitte pas l'application" est par conception : pour libérer les ressources du processus, utilisez `Quit` de la barre d'état.

## Résumé de cette leçon

- Langue : changement immédiat de l'interface + écriture dans la configuration (`i18n.changeLanguage` + `save_config`)
- Thème : appliqué de manière unifiée par `ThemeManager` à `data-theme`, classe `dark` et couleur de fond de la fenêtre (exception pour Linux)
- Mise à jour : au démarrage, `update_settings.json` détermine s'il faut afficher une fenêtre, l'installation est assurée par Tauri Updater
- HTTP API : activé par défaut, accessible uniquement localement, configuration stockée dans `http_api_settings.json`, changement de port nécessite un redémarrage

## Prochain cours

> Le prochain cours entrera dans **Déploiement serveur : Docker noVNC vs Headless Xvfb (advanced-deployment)**, pour déplacer le bureau vers NAS/serveur.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Mise à jour : 2026-01-23

| Sujet | Chemin du fichier | Lignes |
|--- | --- | ---|
| Initialisation i18n et fallback | [`src/i18n.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/i18n.ts#L1-L67) | 1-67 |
| Settings : langue/thème/démarrage auto/paramètres de mise à jour/paramètres HTTP API | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L16-L730) | 16-730 |
| App : synchronisation de la langue + déclenchement de la vérification de mise à jour au démarrage | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L52-L124) | 52-124 |
| ThemeManager : application du thème, écoute du thème système, écriture dans localStorage | [`src/components/common/ThemeManager.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/ThemeManager.tsx#L1-L82) | 1-82 |
| UpdateNotification : vérification des mises à jour, téléchargement et installation automatiques et relaunch | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L1-L217) | 1-217 |
| Vérification des mises à jour : GitHub Releases + intervalle de vérification | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L1-L187) | 1-187 |
| Barre d'état : génération du menu selon la langue + écoute de `config://updated` pour rafraîchir | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L1-L255) | 1-255 |
| Sauvegarde de configuration : émission de `config://updated` + mise à jour à chaud du reverse proxy en cours d'exécution | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| Commandes de démarrage automatique : toggle/is_enabled (compatibilité Windows disable) | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L1-L39) | 1-39 |
| Tauri : initialisation autostart/updater + fermeture de fenêtre vers hide + démarrage HTTP API | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L160) | 50-160 |
| HTTP API : stockage des paramètres + routes (health/accounts/switch/refresh/logs) + liaison uniquement 127.0.0.1 | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L1-L95) | 1-95 |
| HTTP API : liaison du serveur et enregistrement des routes | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L51-L94) | 51-94 |
| Commandes de paramètres HTTP API : get/save | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L773-L789) | 773-789 |

</details>
