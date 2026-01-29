---
title: "Migration de comptes : sauvegarde/migration à chaud | Antigravity Manager"
sidebarTitle: "Migrer le pool de comptes en 3 minutes"
subtitle: "Migration de comptes : sauvegarde/migration à chaud"
description: "Apprenez la sauvegarde et la migration de comptes avec Antigravity Manager. Prend en charge l'import/export JSON, la migration à chaud depuis Antigravity/IDE, la migration depuis le répertoire de données V1, et synchronise automatiquement le compte connecté actuel."
tags:
  - "Gestion de comptes"
  - "Sauvegarde"
  - "Migration"
  - "Import/export"
  - "state.vscdb"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
duration: 12
order: 5
---
# Sauvegarde et migration de comptes : import/export, migration à chaud V1/DB

Ce que vous voulez vraiment « sauvegarder », ce n'est pas le nombre de quotas, mais le `refresh_token` qui permet de reconnecter le compte. Ce cours explique clairement les différentes méthodes de migration d'Antigravity Tools : import/export JSON, import depuis `state.vscdb`, import depuis le répertoire de données V1, et le fonctionnement de la synchronisation automatique.

## Ce que vous saurez faire

- Exporter le pool de comptes en un fichier JSON (contenant uniquement email + refresh_token)
- Importer ce JSON sur une nouvelle machine pour restaurer rapidement le pool de comptes
- Importer directement le « compte actuellement connecté » depuis `state.vscdb` d'Antigravity/IDE (supporte les chemins par défaut et personnalisés)
- Scanner et importer automatiquement les anciens comptes depuis le répertoire de données V1
- Comprendre ce que la « synchronisation automatique du compte actuel » fait vraiment et quand elle est ignorée

## Votre problème actuel

- Après réinstallation de votre système ou changement d'ordinateur, vous devez réajouter tous vos comptes, ce qui coûte beaucoup de temps
- Vous avez changé de compte connecté dans Antigravity/IDE, mais le « compte actuel » dans Manager ne s'est pas mis à jour
- Vous avez utilisé la version V1/les scripts par le passé, et vous ne savez pas si vous pouvez migrer directement vos anciennes données

## Quand utiliser cette méthode

- Vous souhaitez déplacer votre pool de comptes vers une autre machine (bureau/serveur/conteneur)
- Vous utilisez Antigravity comme « point d'entrée de connexion principal » et voulez que Manager synchronise automatiquement le compte actuel
- Vous voulez migrer des comptes depuis une ancienne version (répertoire de données V1)

## 🎒 Avant de commencer

- Vous pouvez ouvrir Antigravity Tools et avez au moins un compte dans votre pool
- Vous savez que les données de compte sont des informations sensibles (surtout `refresh_token`)

::: warning Rappel de sécurité : traitez les fichiers de sauvegarde comme des mots de passe
Le fichier JSON exporté contient `refresh_token`. Quiconque l'obtient pourrait l'utiliser pour rafraîchir un access token. Ne téléversez pas le fichier de sauvegarde sur un lien public de cloud, ne l'envoyez pas dans des groupes, et ne le committez pas dans Git.
:::

## Concept de base

La « migration » d'Antigravity Tools revient essentiellement à deux choses :

1) Trouver un `refresh_token` valide
2) L'utiliser pour obtenir un access token, récupérer l'email réel auprès de Google, puis écrire le compte dans le pool de comptes local

Il propose trois points d'entrée :

- Import/export JSON : idéal pour faire une « sauvegarde contrôlée » explicite
- Import DB : idéal quand vous considérez l'état de connexion d'Antigravity/IDE comme source de vérité (recherche par défaut `state.vscdb`, supporte aussi la sélection manuelle de fichier)
- Import V1 : idéal pour scanner et migrer automatiquement depuis l'ancien répertoire de données

Il y a aussi une « synchronisation automatique » : elle lit périodiquement le refresh_token dans la DB, s'il diffère du compte actuel de Manager, elle exécute automatiquement un import DB ; s'il est identique, elle est ignorée (pour économiser le trafic).

## Suivez les étapes

### Étape 1 : Exporter le pool de comptes (sauvegarde JSON)

**Pourquoi**
C'est la méthode de migration la plus stable et la plus contrôlée. Avec un fichier, vous pouvez restaurer le pool de comptes sur une autre machine.

Action : allez sur la page `Accounts`, cliquez sur le bouton d'export.

- Si vous avez configuré `default_export_path` dans les paramètres, l'export sera écrit directement dans ce répertoire avec le nom de fichier `antigravity_accounts_YYYY-MM-DD.json`.
- Si aucun répertoire par défaut n'est configuré, une boîte de dialogue système s'ouvrira pour que vous choisissiez le chemin.

Le contenu du fichier exporté ressemble à ceci (chaque élément du tableau ne contient que les champs nécessaires) :

```json
[
  {
    "email": "alice@example.com",
    "refresh_token": "1//xxxxxxxxxxxxxxxxxxxxxxxx"
  },
  {
    "email": "bob@example.com",
    "refresh_token": "1//yyyyyyyyyyyyyyyyyyyyyyyy"
  }
]
```

**Ce que vous devriez voir** : la page affiche que l'export a réussi et indique le chemin de sauvegarde.

### Étape 2 : Importer le JSON sur la nouvelle machine (restaurer le pool de comptes)

**Pourquoi**
L'import appelle la logique « ajouter compte » pour chaque compte, utilise le `refresh_token` pour récupérer l'email réel et l'écrit dans le pool de comptes.

Action : toujours sur la page `Accounts`, cliquez sur « Importer JSON » et sélectionnez le fichier que vous venez d'exporter.

Les exigences de format sont les suivantes (doit contenir au moins 1 enregistrement valide) :

- Doit être un tableau JSON
- Le système n'importera que les entrées contenant `refresh_token` commençant par `1//`

**Ce que vous devriez voir** : après l'import, les comptes importés apparaissent dans la liste des comptes.

::: tip Si Proxy fonctionne pendant votre import
Après chaque succès d'« ajout de compte », le backend essaiera de recharger le pool de tokens du reverse proxy, pour que les nouveaux comptes prennent effet immédiatement.
:::

### Étape 3 : Importer le « compte actuellement connecté » depuis `state.vscdb`

**Pourquoi**
Parfois, vous ne voulez pas maintenir de fichiers de sauvegarde et voulez simplement « suivre l'état de connexion d'Antigravity/IDE ». L'import DB est conçu pour ce scénario.

Action : allez sur la page `Accounts`, cliquez sur **Add Account**, passez à l'onglet `Import` :

- Cliquez sur « Importer depuis la base de données » (utilise le chemin DB par défaut)
- Ou cliquez sur « Custom DB (state.vscdb) » pour sélectionner manuellement un fichier `*.vscdb`

Le chemin DB par défaut est multiplateforme (et reconnaît aussi en priorité `--user-data-dir` ou le mode portable) :

::: code-group

```text [macOS]
~/Library/Application Support/Antigravity/User/globalStorage/state.vscdb
```

```text [Windows]
%APPDATA%\Antigravity\User\globalStorage\state.vscdb
```

```text [Linux]
~/.config/Antigravity/User/globalStorage/state.vscdb
```

:::

**Ce que vous devriez voir** :

- Après un import réussi, ce compte est automatiquement défini comme « compte actuel » de Manager
- Le système déclenche automatiquement un rafraîchissement des quotas

### Étape 4 : Migrer depuis le répertoire de données V1 (import de l'ancienne version)

**Pourquoi**
Si vous avez utilisé la version V1/scripts par le passé, Manager vous permet de scanner directement l'ancien répertoire de données et d'essayer d'importer.

Action : dans l'onglet `Import`, cliquez sur « Importer V1 ».

Il cherchera ce chemin dans votre home directory (ainsi que les fichiers d'index à l'intérieur) :

```text
~/.antigravity-agent/
  - antigravity_accounts.json
  - accounts.json
```

**Ce que vous devriez voir** : après l'import, les comptes apparaissent dans la liste ; si les fichiers d'index ne sont pas trouvés, le backend retournera l'erreur `V1 account data file not found`.

### Étape 5 (optionnelle) : Activer « synchroniser automatiquement le compte actuel »

**Pourquoi**
Quand vous changez de compte connecté dans Antigravity/IDE, Manager peut vérifier périodiquement si le refresh_token dans la DB a changé, et importer automatiquement en cas de changement.

Action : allez dans `Settings`, activez `auto_sync`, et définissez `sync_interval` (unité : secondes).

**Ce que vous devriez voir** : après activation, une synchronisation s'exécute immédiatement ; ensuite elle s'exécute périodiquement selon l'intervalle. Si le refresh_token dans la DB est identique au compte actuel, il sera ignoré et ne sera pas réimporté.

## Points de vérification ✅

- Vous pouvez voir les comptes importés dans la liste `Accounts`
- Vous pouvez voir que le « compte actuel » a bien basculé vers celui que vous attendiez (l'import DB le définit automatiquement comme actuel)
- Après avoir démarré Proxy, les nouveaux comptes importés peuvent être utilisés normalement pour les requêtes (basé sur les résultats réels des appels)

## À éviter

| Scénario | Ce que vous pourriez faire (❌) | Approche recommandée (✓) |
| --- | --- | --- |
| Sécurité du fichier de sauvegarde | Envoyer le JSON exporté comme un simple fichier de configuration | Traiter le JSON comme un mot de passe, minimiser la portée de diffusion, éviter l'exposition sur Internet public |
| Échec de l'import JSON | JSON n'est pas un tableau, ou refresh_token n'a pas le préfixe `1//` | Utiliser le JSON exporté par ce projet comme modèle, garder les noms de champs et la structure cohérents |
| Import DB ne trouve pas de données | Antigravity ne s'est jamais connecté, ou la DB manque `jetskiStateSync.agentManagerInitState` | Confirmez d'abord qu'Antigravity/IDE est connecté, puis essayez d'importer ; si nécessaire, utilisez Custom DB pour choisir le bon fichier |
| Comptes inutilisables après import V1 | Ancien refresh_token expiré | Supprimez le compte et rajoutez-le avec OAuth/nouveau refresh_token (basé sur le message d'erreur) |
| auto_sync trop fréquent | `sync_interval` défini très petit, scanne fréquemment la DB | Considérez-le comme « suivi d'état », définissez l'intervalle à une fréquence acceptable pour vous |

## Résumé de cette leçon

- L'export/import JSON est la méthode de migration la plus contrôlable : le fichier de sauvegarde ne contient que `email + refresh_token`
- L'import DB est idéal pour « suivre le compte actuellement connecté dans Antigravity/IDE » et définit automatiquement le compte actuel de Manager
- L'import V1 scanne `~/.antigravity-agent` et est compatible avec plusieurs anciens formats
- auto_sync compare les refresh_token ; s'ils sont identiques, il ignore et ne réimporte pas

## Prochaines étapes

> Dans la prochaine leçon, nous allons vraiment utiliser le « pool de comptes après migration » : **[Démarrer le reverse proxy local et connecter le premier client (/healthz + configuration SDK)](../proxy-and-first-client/)**.
>
> Vous apprendrez :
> - Comment démarrer/arrêter Proxy et utiliser `/healthz` pour une vérification minimale
> - Comment configurer l'URL de base dans le SDK/le client

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Accounts export/import JSON (`save_text_file` / `read_text_file`) | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L458-L578) | 458-578 |
| Dashboard export JSON des comptes | [`src/pages/Dashboard.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Dashboard.tsx#L113-L148) | 113-148 |
| Onglet Import : boutons Import DB / Custom DB / Import V1 | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L491-L539) | 491-539 |
| Ajouter un compte : ignorer l'email frontend, utiliser refresh_token pour récupérer l'email réel, rafraîchir automatiquement les quotas, reload à chaud Proxy | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
| Import V1 : scanner `~/.antigravity-agent` et compatibilité multi-formats | [`src-tauri/src/modules/migration.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/migration.rs#L9-L190) | 9-190 |
| Import DB : extraire refresh_token depuis `state.vscdb` (ItemTable + base64 + protobuf) | [`src-tauri/src/modules/migration.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/migration.rs#L192-L267) | 192-267 |
| Dérivation du chemin DB par défaut (`--user-data-dir` / portable / chemin standard) | [`src-tauri/src/modules/db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/db.rs#L18-L63) | 18-63 |
| Après import DB, définir automatiquement comme « compte actuel » et rafraîchir les quotas | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L495-L511) | 495-511 |
| auto_sync : comparer refresh_token, ignorer si identique ; déclencher import DB en cas de changement | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L532-L564) | 532-564 |
| Tâche en arrière-plan frontend : appeler périodiquement `syncAccountFromDb()` selon `sync_interval` | [`src/components/common/BackgroundTaskRunner.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/BackgroundTaskRunner.tsx#L43-L72) | 43-72 |

</details>
