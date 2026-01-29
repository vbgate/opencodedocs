---
title: "Gouvernance de quota : Protection Quota et Warmup | Antigravity-Manager"
subtitle: "Gouvernance de quota : Protection Quota et Warmup | Antigravity-Manager"
sidebarTitle: "Protégez vos quotas de modèles"
description: "Apprendre le mécanisme de gouvernance de quota d'Antigravity-Manager. Utiliser Quota Protection pour protéger les modèles par seuil, Smart Warmup pour préchauffage automatique, supportant analyse planifiée et contrôle de refroidissement."
tags:
  - "quota"
  - "warmup"
  - "comptes"
  - "proxy"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
order: 5
---

# Gouvernance de quota : combinaison Quota Protection + Smart Warmup

Vous utilisez Antigravity Tools comme proxy depuis un moment, assez stable, mais vous craignez une chose : le quota du modèle principal est "silencieusement épuisé", et quand vous voulez vraiment l'utiliser, vous découvrez qu'il est déjà trop bas pour être utilisable.

Ce cours traite spécifiquement de **gouvernance de quota** : utiliser Quota Protection pour garder les modèles clés ; utiliser Smart Warmup pour faire une "préchauffage léger" quand le quota revient à 100%, réduisant les interruptions temporaires.

## Qu'est-ce que la gouvernance de quota ?

La **gouvernance de quota** signifie utiliser deux mécanismes liés dans Antigravity Tools pour contrôler "comment dépenser le quota" : quand le quota restant d'un certain modèle descend en dessous du seuil, Quota Protection ajoutera ce modèle aux `protected_models` du compte, et lors d'une demande pour ce modèle, il sera prioritairement évité ; quand le quota revient à 100%, Smart Warmup déclenchera une demande de préchauffage à très faible trafic, et utilisera un fichier historique local pour 4 heures de refroidissement.

## Ce que vous pourrez faire après ce cours

- Activer Quota Protection, laisser les comptes à faible quota "laisser la place" automatiquement, gardant les modèles de haute valeur pour les requêtes clés
- Activer Smart Warmup, préchauffer automatiquement quand le quota revient à 100% (et savoir comment 4 heures de refroidissement affectent la fréquence de déclenchement)
- Clarifier où `quota_protection` / `scheduled_warmup` / `protected_models` prennent effet respectivement
- Savoir quels noms de modèles seront normalisés en "groupe de protection" (et lesquels ne le seront pas)

## Votre situation actuelle

- Vous pensez être en "rotation de comptes", mais en fait vous consommez toujours la même catégorie de modèles de haute valeur
- Vous découvrez le quota bas seulement après, voire c'est Claude Code/le client qui warmup en arrière-plan qui a mangé le quota
- Vous avez activé le préchauffage, mais ne savez pas quand il se déclenche exactement, s'il y a refroidissement, s'il affectera le quota

## Quand utiliser cette méthode

- Vous avez plusieurs pools de comptes, espérez qu'aux "moments importants", les modèles clés ont encore des réserves
- Vous ne voulez pas surveiller manuellement l'heure de retour du quota, voulez laisser le système faire "vérification légère après retour"

## 🎒 Préparation avant de commencer

::: warning Conditions préalables
Ce cours suppose que vous pouvez déjà :

- Voir la liste des comptes dans la page **Accounts**, et rafraîchir manuellement le quota
- Avoir déjà démarré le reverse proxy local (au moins pouvoir accéder `/healthz`)

Si vous n'avez pas réussi, d'abord voir **[Démarrer le reverse proxy local et intégrer le premier client](/fr/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

De plus, Smart Warmup écrira le fichier historique local `warmup_history.json`. Il est placé dans le répertoire de données, l'emplacement du répertoire de données et la méthode de sauvegarde peuvent d'abord voir **[Premier démarrage à comprendre : répertoire de données, journaux, barre des tâches et démarrage automatique](/fr/lbjlaq/Antigravity-Manager/start/first-run-data/)**.

## Idée centrale

Derrière cette "combinaison" en fait très simple :

- Quota Protection fait "ne plus gaspiller" : quand un modèle descend sous le seuil, il est marqué comme protégé, lors d'une demande pour ce modèle prioritairement évité (niveau modèle, pas interdiction globale du compte).
- Smart Warmup fait "vérifier dès que le quota revient" : quand le modèle revient à 100%, déclencher une demande légère, confirmer que la chaîne est disponible, et utiliser 4 heures de refroidissement pour éviter d'importuner à répétition.

Les champs de configuration correspondants sont dans `AppConfig` du frontend :

- `quota_protection.enabled / threshold_percentage / monitored_models` (voir `src/types/config.ts`)
- `scheduled_warmup.enabled / monitored_models` (voir `src/types/config.ts`)

Et la logique qui décide vraiment "lors d'une demande à ce modèle, faut-il sauter ce compte" est dans TokenManager backend :

- `protected_models` dans le fichier compte participera au filtrage dans `get_token(..., target_model)` (voir `src-tauri/src/proxy/token_manager.rs`)
- `target_model` fera d'abord une normalisation (`normalize_to_standard_id`), donc les variantes comme `claude-sonnet-4-5-thinking` seront repliées dans le même "groupe de protection" (voir `src-tauri/src/proxy/common/model_mapping.rs`)

## Aperçu du prochain cours

> Le prochain cours, nous apprenons **[Proxy Monitor : journaux de requêtes, filtrage, restauration de détails et exportation](/fr/lbjlaq/Antigravity-Manager/advanced/monitoring/)**, transformant la boîte noire des appels en chaîne de preuves reproductible.

## Suivez-moi

### Étape 1 : D'abord rafraîchir le quota "à des données"

**Pourquoi**
Quota Protection se base sur `quota.models[].percentage` du compte pour juger. Si vous n'avez pas rafraîchi le quota, la logique de protection ne peut rien faire pour vous.

Chemin d'opération : ouvrez la page **Accounts**, cliquez sur le bouton de rafraîchissement de la barre d'outils (compte unique ou total vont).

**Ce que vous devriez voir** : la ligne de compte affiche le pourcentage de quota de chaque modèle (par exemple 0-100) et l'heure de reset.

### Étape 2 : Dans Settings, activer Smart Warmup (optionnel, mais recommandé)

**Pourquoi**
L'objectif de Smart Warmup n'est pas "économiser le quota", mais "vérifier la chaîne dès que le quota revient à 100%". Il ne se déclenche que quand le quota du modèle atteint 100%, et a 4 heures de refroidissement.

Chemin d'opération : entrez dans **Settings**, basculez vers la zone de paramètres liés aux comptes, activez l'interrupteur **Smart Warmup**, puis cochez les modèles que vous voulez surveiller.

N'oubliez pas de sauvegarder les paramètres.

**Ce que vous devriez voir** : Smart Warmup déployé montre la liste des modèles ; au moins conserver 1 modèle coché.

### Étape 3 : Activer Quota Protection, et définir seuil et modèles surveillés

**Pourquoi**
Quota Protection est le cœur de "garder des réserves" : quand le pourcentage de quota des modèles surveillés `<= threshold_percentage`, le modèle sera écrit dans `protected_models` du fichier compte, et les demandes ultérieures pour ce modèle éviteront prioritairement ces comptes.

Chemin d'opération : dans **Settings**, activez **Quota Protection**.

1. Définir le seuil (`1-99`)
2. Cochez les modèles que vous voulez surveiller (au moins 1)

::: tip Une configuration de départ très utile
Si vous ne voulez pas vous embêter, commencez par défaut `threshold_percentage=10` (voir `src/pages/Settings.tsx`).
:::

**Ce que vous devriez voir** : la sélection de modèles Quota Protection garde au moins 1 (l'interface vous empêchera de décocher le dernier).

### Étape 4 : Confirmer que "normalisation du groupe de protection" ne vous posera pas problème

**Pourquoi**
Quand TokenManager fait le jugement de protection de quota, il va d'abord normaliser `target_model` en ID standard (`normalize_to_standard_id`). Par exemple `claude-sonnet-4-5-thinking` sera normalisé en `claude-sonnet-4-5`.

Cela signifie :

- Vous cochez `claude-sonnet-4-5` dans Quota Protection
- Quand vous demandez réellement `claude-sonnet-4-5-thinking`

Cela correspondra toujours à la protection (car ils appartiennent au même groupe).

**Ce que vous devriez voir** : quand `protected_models` d'un certain compte contient `claude-sonnet-4-5`, les demandes pour `claude-sonnet-4-5-thinking` éviteront prioritairement ce compte.

### Étape 5 : Besoin de vérifier immédiatement, utiliser "warmup manuel" pour déclencher un warmup

**Pourquoi**
La période de scan Smart Warmup programmé est toutes les 10 minutes (voir `src-tauri/src/modules/scheduler.rs`). Vous voulez vérifier la chaîne immédiatement, le warmup manuel est plus direct.

Chemin d'opération : ouvrez la page **Accounts**, cliquez sur le bouton "Préchauffage" de la barre d'outils :

- Pas de compte sélectionné : déclenche warmup total (appelle `warm_up_all_accounts`)
- Compte sélectionné : déclenche warmup un par un pour les comptes sélectionnés (appelle `warm_up_account`)

**Ce que vous devriez voir** : un toast apparaît, le contenu vient de la chaîne renvoyée par le backend (par exemple "Warmup task triggered ...").

## Point de vérification ✅

- Vous pouvez voir sur la page Accounts le pourcentage de quota de chaque compte de chaque modèle (prouve que la chaîne de données quota est OK)
- Vous pouvez activer Quota Protection / Smart Warmup dans Settings, et sauvegarder avec succès la configuration
- Vous comprenez que `protected_models` est une restriction "niveau modèle" : un compte peut être évité seulement pour certains modèles
- Vous savez que warmup a 4 heures de refroidissement : répétition rapprochée de préchauffage, vous pourriez voir des indices "skipped/cooldown"

## Attention aux pièges courants

### 1) Vous avez activé Quota Protection, mais ça n'a jamais pris effet

La cause la plus fréquente : le compte n'a pas de données `quota`. La logique de protection dans le backend doit d'abord lire `quota.models[]` pour juger le seuil (voir `src-tauri/src/proxy/token_manager.rs`).

Vous pouvez revenir à **l'étape 1**, d'abord rafraîchir le quota.

### 2) Pourquoi seulement quelques modèles seront considérés comme "groupe de protection" ?

La normalisation par TokenManager de `target_model` est "liste blanche" : seuls les noms de modèles explicitement listés seront mappés vers l'ID standard (voir `src-tauri/src/proxy/common/model_mapping.rs`).

La logique après normalisation est : utiliser le nom normalisé (ID standard ou nom de modèle original) pour correspondre au champ `protected_models` du compte. Si la correspondance réussit, le compte sera sauté (voir `src-tauri/src/proxy/token_manager.rs:555-560, 716-719`). Cela signifie :

- Les modèles dans la liste blanche (comme `claude-sonnet-4-5-thinking`) seront normalisés en ID standard (`claude-sonnet-4-5`), puis juger s'ils sont dans `protected_models`
- Quand la normalisation échoue pour les modèles hors liste blanche, revenir au nom de modèle original, toujours correspondre à `protected_models`

En d'autres termes, le jugement de protection de quota prend effet pour "tous les noms de modèles", juste que les modèles dans la liste blanche seront d'abord normalisés.

### 3) Pourquoi warmup manuel/programmé a besoin que le proxy tourne ?

La demande de warmup finira par toucher le point de terminaison interne du proxy local : `POST /internal/warmup` (voir la route dans `src-tauri/src/proxy/server.rs`, et l'implémentation dans `src-tauri/src/proxy/handlers/warmup.rs`). Si vous n'avez pas démarré le service proxy, warmup échouera.

De plus, le port appelé par le préchauffage vient de la configuration : `proxy.port` (si la lecture de la configuration échoue, reviendra à `8045`, voir `src-tauri/src/modules/quota.rs`).

## Résumé du cours

- Quota Protection fait "arrêter la perte" : sous le seuil, écrire le modèle dans `protected_models`, lors d'une demande pour ce modèle éviter prioritairement
- Smart Warmup fait "vérification automatique après retour" : se déclenche seulement à 100%, scanne une fois toutes les 10 minutes, 4 heures de refroidissement
- Les deux dépendent de la chaîne "rafraîchissement quota" : d'abord avoir `quota.models[]`, la gouvernance a une base

## Aperçu du prochain cours

La gouvernance de quota résout "comment dépenser plus stable". Le prochain cours suggère ensuite de voir **Proxy Monitor**, transformer journaux de requêtes, sélection de compte, mappage de modèle en chaîne de preuves reproductible.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| Interface Quota Protection (seuil, cocher modèles, au moins 1) | [`src/components/settings/QuotaProtection.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/QuotaProtection.tsx#L13-L168) | 13-168 |
| Interface Smart Warmup (activé par défaut coché, au moins 1) | [`src/components/settings/SmartWarmup.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/SmartWarmup.tsx#L14-L120) | 14-120 |
| Champs configuration gouvernance quota (`quota_protection` / `scheduled_warmup`) | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L54-L94) | 54-94 |
| Seuil par défaut et configuration par défaut (`threshold_percentage: 10`) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L20-L51) | 20-51 |
| Écriture/restauration `protected_models` (jugement seuil et sauvegarde disque) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L254-L467) | 254-467 |
| Filtrage protection quota côté demande (`get_token(..., target_model)`) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L470-L674) | 470-674 |
| Normalisation groupe de protection (`normalize_to_standard_id`) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L230-L254) | 230-254 |
| Scan planifié Smart Warmup (une fois toutes les 10 minutes + 4 heures refroidissement + `warmup_history.json`) | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L11-L221) | 11-221 |
| Commandes warmup manuel (`warm_up_all_accounts` / `warm_up_account`) | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L167-L212) | 167-212 |
| Implémentation warmup (appeler point de terminaison interne `/internal/warmup`) | [`src-tauri/src/modules/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/quota.rs#L271-L512) | 271-512 |
| Implémentation point de terminaison interne warmup (construire demande + appeler amont) | [`src-tauri/src/proxy/handlers/warmup.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/warmup.rs#L3-L220) | 3-220 |

</details>
