---
title: "Ajouter un compte: double canal OAuth et Refresh Token | Antigravity Tools"
sidebarTitle: "Ajouter votre compte Google"
subtitle: "Ajouter un compte : double canal OAuth/Refresh Token et bonnes pratiques"
description: "Apprenez à ajouter des comptes dans Antigravity Tools via OAuth ou Refresh Token. Support d'import en lot, gestion des échecs de callback et vérification du pool."
tags:
  - "Gestion de comptes"
  - "OAuth"
  - "refresh_token"
  - "Google"
  - "Bonnes pratiques"
prerequisite:
  - "start-getting-started"
duration: 15
order: 4
---

# Ajouter un compte : double canal OAuth/Refresh Token et bonnes pratiques

Dans Antigravity Tools, "ajouter un compte" signifie écrire le `refresh_token` du compte Google dans le pool de comptes local, permettant aux requêtes de proxy inversé de les utiliser en rotation. Vous pouvez passer par l'autorisation OAuth en un clic, ou coller directement le `refresh_token` pour un ajout manuel.

## Ce que vous pourrez faire après ce cours

- Ajouter des comptes Google au pool de comptes d'Antigravity Tools via OAuth ou Refresh Token
- Copier/ouvrir manuellement le lien d'autorisation, et compléter automatiquement l'ajout après un callback réussi
- Savoir comment résoudre des problèmes comme l'impossibilité d'obtenir un `refresh_token` ou l'échec de connexion du callback à `localhost`

## Vos difficultés actuelles

- Vous avez cliqué sur "Autorisation OAuth" mais l'indicateur tourne en rond, ou le navigateur indique `localhost refused to connect`
- L'autorisation a réussi, mais un message indique "Refresh Token non obtenu"
- Vous avez uniquement le `refresh_token` en main et ne savez pas comment l'importer en lot

## Quand utiliser cette méthode

- Vous voulez ajouter des comptes de la manière la plus stable (priorité à OAuth)
- Vous privilégiez la portabilité/sauvegarde (Refresh Token est plus adapté comme "actif de pool de comptes")
- Vous devez ajouter de nombreux comptes et souhaitez importer des `refresh_token` en lot (extraction à partir de texte/JSON supportée)

## 🎒 Préparatifs avant de commencer

- Vous avez installé et pouvez ouvrir l'application de bureau Antigravity Tools
- Vous savez où trouver l'entrée : dans la navigation de gauche, allez à la page `Accounts` (route voir `source/lbjlaq/Antigravity-Manager/src/App.tsx`)

::: info Deux mots-clés dans ce cours
**OAuth** : Un processus "se connecter et autoriser via le navigateur". Antigravity Tools lance temporairement une adresse de callback locale (`http://localhost/127.0.0.1/[::1]:<port>/oauth-callback`, choisie automatiquement selon la surveillance IPv4/IPv6 du système), attend que le navigateur revienne avec un `code`, puis l'échange contre un token. (Implémentation voir `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs`)

**refresh_token** : Un "identifiant permettant de rafraîchir l'access_token sur le long terme". Lors de l'ajout de comptes dans ce projet, il est utilisé pour obtenir d'abord un access_token, puis récupérer l'adresse email réelle auprès de Google, et l'email que vous avez saisi en frontend est ignoré. (Implémentation voir `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs`)
:::

## Idée principale

"Ajouter un compte" dans Antigravity Tools vise finalement à obtenir un `refresh_token` utilisable et à écrire les informations du compte dans le pool de comptes local.

- **Canal OAuth** : L'application génère le lien d'autorisation pour vous et surveille le callback local ; après l'autorisation, elle échange automatiquement le token et sauvegarde le compte (voir `prepare_oauth_url`, `start_oauth_login`, `complete_oauth_login`)
- **Canal Refresh Token** : Vous collez directement le `refresh_token`, l'application l'utilise pour rafraîchir l'access_token, et récupère l'adresse email réelle auprès de Google pour la sauvegarder (voir `add_account`)

## Suivez-moi

### Étape 1 : Ouvrir la fenêtre "Ajouter un compte"

**Pourquoi**
Tous les points d'ajout sont centralisés sur la page `Accounts`.

Action : Allez à la page `Accounts` et cliquez sur le bouton **Add Account** à droite (composant : `AddAccountDialog`).

**Ce que vous devriez voir** : Une fenêtre apparaît avec 3 onglets : `OAuth` / `Refresh Token` / `Import` (voir `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx`).

### Étape 2 : Prioriser l'autorisation OAuth en un clic (recommandé)

**Pourquoi**
C'est le chemin recommandé par défaut du produit : laisser l'application générer le lien d'autorisation, ouvrir automatiquement le navigateur, et compléter automatiquement la sauvegarde après le callback.

1. Allez à l'onglet `OAuth`.
2. Copiez d'abord le lien d'autorisation : après l'ouverture de la fenêtre, `prepare_oauth_url` est appelé automatiquement pour pré-générer l'URL (appel frontend voir `AddAccountDialog.tsx:111-125` ; génération backend et surveillance voir `oauth_server.rs`).
3. Cliquez sur **Start OAuth** (correspondant au frontend `startOAuthLogin()` / backend `start_oauth_login`), l'application ouvre le navigateur par défaut et commence à attendre le callback.

**Ce que vous devriez voir** :
- Un lien d'autorisation copiable apparaît dans la fenêtre (nom de l'événement : `oauth-url-generated`)
- Le navigateur ouvre la page d'autorisation Google ; après l'autorisation, il redirige vers une adresse locale et affiche "Authorization Successful!" (`oauth_success_html()`)

### Étape 3 : Quand OAuth ne s'achève pas automatiquement, utilisez "Finish OAuth" pour terminer manuellement

**Pourquoi**
Le processus OAuth se fait en deux étapes : le navigateur obtient un `code` par autorisation, puis l'application utilise le `code` pour échanger un token. Même si vous n'avez pas cliqué sur "Start OAuth", tant que vous avez ouvert manuellement le lien d'autorisation et terminé le callback, la fenêtre essaiera de terminer automatiquement ; si cela échoue, vous pouvez cliquer manuellement une fois.

1. Si vous avez "copié le lien et l'avez ouvert dans votre propre navigateur" (au lieu du navigateur par défaut), après le callback d'autorisation, l'application recevra l'événement `oauth-callback-received` et appellera automatiquement `completeOAuthLogin()` (voir `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx:67-109`).
2. Si vous ne voyez pas l'achèvement automatique, cliquez sur **Finish OAuth** dans la fenêtre (correspondant au backend `complete_oauth_login`).

**Ce que vous devriez voir** : La fenêtre indique le succès et se ferme automatiquement ; le nouveau compte apparaît dans la liste `Accounts`.

::: tip Astuce : En cas d'échec de callback, copiez d'abord le lien
Le backend essaiera de surveiller simultanément IPv6 `::1` et IPv4 `127.0.0.1`, et choisira `localhost/127.0.0.1/[::1]` comme adresse de callback selon la situation de surveillance, principalement pour éviter les échecs de connexion causés par "le navigateur résolvant localhost en IPv6". (Voir `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`)
:::

### Étape 4 : Ajouter manuellement avec Refresh Token (support en lot)

**Pourquoi**
Quand vous ne pouvez pas obtenir de `refresh_token` (ou si vous préférez "un actif portable"), l'ajout direct avec Refresh Token est plus contrôlable.

1. Allez à l'onglet `Refresh Token`.
2. Collez le `refresh_token` dans la zone de texte.

Formats d'entrée supportés (le frontend analysera et ajoutera en lot) :

| Type d'entrée | Exemple | Logique d'analyse |
| --- | --- | --- |
| Texte token pur | `1//abc...` | Extraction par regex : `/1\/\/[a-zA-Z0-9_\-]+/g` (voir `AddAccountDialog.tsx:213-220`) |
| Inclus dans un long texte | Les logs/textes exportés contiennent plusieurs `1//...` | Extraction par regex en lot et déduplication (voir `AddAccountDialog.tsx:213-224`) |
| Tableau JSON | `[{"refresh_token":"1//..."}]` | Analyse le tableau et prend `item.refresh_token` (voir `AddAccountDialog.tsx:198-207`) |

Après avoir cliqué sur **Confirm**, la fenêtre appellera `onAdd("", token)` individuellement pour chaque token (voir `AddAccountDialog.tsx:231-248`), aboutissant finalement au backend `add_account`.

**Ce que vous devriez voir** :
- La fenêtre affiche la progression en lot (par exemple `1/5`)
- Après succès, le nouveau compte apparaît dans la liste `Accounts`

### Étape 5 : Confirmer "le pool de comptes est utilisable"

**Pourquoi**
L'ajout réussi ne signifie pas "immédiatement utilisable de manière stable". Le backend déclenchera automatiquement un "rafraîchissement de quota" après l'ajout, et essaiera de recharger le token pool lors de l'exécution du Proxy, rendant les modifications effectives immédiatement.

Vous pouvez confirmer avec les 2 signaux suivants :

1. Le compte apparaît dans la liste et affiche l'email (l'email vient du backend `get_user_info`, pas de l'email que vous avez saisi).
2. Les informations de quota/souscription du compte commencent à se rafraîchir (le backend appellera automatiquement `internal_refresh_account_quota`).

**Ce que vous devriez voir** : Après l'ajout, il n'est pas nécessaire de cliquer manuellement sur rafraîchir, les informations de quota commenceront à apparaître sur le compte (le succès ou non est basé sur l'affichage réel de l'interface).

## Point de contrôle ✅

- Vous pouvez voir l'email du nouveau compte dans la liste de comptes
- Aucun état "loading" ne persiste au-delà du temps acceptable (après l'achèvement du callback OAuth, cela devrait se terminer rapidement)
- Si vous exécutez le Proxy, le nouveau compte peut rapidement participer à l'ordonnancement (le backend essaiera de recharger)

## Attention aux pièges

### 1) OAuth indique "Refresh Token non obtenu"

Le backend dans `start_oauth_login/complete_oauth_login` vérifie explicitement si le `refresh_token` existe ; s'il n'existe pas, il renvoie un message d'erreur avec une solution (voir `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs:45-56`).

Suivez la méthode de traitement suggérée par le code source :

1. Ouvrez `https://myaccount.google.com/permissions`
2. Révoquez les permissions d'**Antigravity Tools**
3. Retournez à l'application et refaites OAuth

> Vous pouvez aussi directement passer au canal Refresh Token de ce cours.

### 2) Le navigateur indique `localhost refused to connect`

Le callback OAuth nécessite que le navigateur demande l'adresse de callback locale. Pour réduire le taux d'échec, le backend :

- Essaie de surveiller simultanément `127.0.0.1` et `::1`
- N'utilise `localhost` que lorsque les deux sont disponibles, sinon force l'utilisation de `127.0.0.1` ou `[::1]`

L'implémentation correspondante voir `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`.

### 3) Passer à un autre onglet annule la préparation OAuth

Lorsque la fenêtre passe de `OAuth` à un autre onglet, le frontend appellera `cancelOAuthLogin()` et videra l'URL (voir `AddAccountDialog.tsx:127-136`).

Si vous êtes en cours d'autorisation, ne vous précipitez pas pour changer d'onglet.

### 4) Exemples corrects/incorrects de Refresh Token

| Exemple | Reconnaissable | Raison |
| --- | --- | --- |
| `1//0gAbC...` | ✓ | Conforme à la règle de préfixe `1//` (voir `AddAccountDialog.tsx:215-219`) |
| `ya29.a0...` | ✗ | Non conforme à la règle d'extraction frontend, sera considéré comme une entrée invalide |

## Résumé du cours

- OAuth : adapté pour "rapide", supporte aussi copier le lien vers votre navigateur habituel et terminer automatiquement/manuellement
- Refresh Token : adapté pour "stable" et "portable", supporte l'extraction en lot `1//...` à partir de texte/JSON
- Quand vous ne pouvez pas obtenir de `refresh_token`, révoquez l'autorisation selon l'invite d'erreur et recommencez, ou passez directement au Refresh Token

## Aperçu du prochain cours

Dans le prochain cours, nous allons faire quelque chose de plus concret : transformer le pool de comptes en "actif portable".

> Allez apprendre **[Sauvegarde et migration de comptes : import/export, migration à chaud V1/DB](../backup-migrate/)**.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour déplier et voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Lignes |
| --- | --- | --- |
| Page Accounts avec fenêtre d'ajout montée | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L267-L731) | 267-731 |
| Pré-génération URL OAuth + achèvement automatique événement callback | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L49-L125) | 49-125 |
| Événement callback OAuth déclenche `completeOAuthLogin()` | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L67-L109) | 67-109 |
| Analyse et déduplication en lot Refresh Token | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L185-L268) | 185-268 |
| Appel frontend des commandes Tauri (add/OAuth/cancel) | [`src/services/accountService.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/services/accountService.ts#L5-L91) | 5-91 |
| Backend add_account : ignore email, utilise refresh_token pour obtenir email réel et sauvegarde | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
| Backend OAuth : vérifie absence refresh_token et donne solution de révocation autorisation | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L38-L79) | 38-79 |
| Server callback OAuth : surveillance simultanée IPv4/IPv6 et choix redirect_uri | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L43-L113) | 43-113 |
| Analyse callback OAuth du `code` et émission `oauth-callback-received` | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L140-L180) | 140-180 |

**Noms d'événements clés** :
- `oauth-url-generated` : le backend envoie l'URL OAuth au frontend après génération (voir `oauth_server.rs:250-252`)
- `oauth-callback-received` : le backend notifie le frontend après avoir reçu le callback et analysé le code (voir `oauth_server.rs:177-180` / `oauth_server.rs:232-235`)

**Commandes clés** :
- `prepare_oauth_url` : pré-génère le lien d'autorisation et lance la surveillance du callback (voir `src-tauri/src/commands/mod.rs:469-473`)
- `start_oauth_login` : ouvre le navigateur par défaut et attend le callback (voir `src-tauri/src/commands/mod.rs:339-401`)
- `complete_oauth_login` : n'ouvre pas le navigateur, attend seulement le callback et complète l'échange de token (voir `src-tauri/src/commands/mod.rs:405-467`)
- `add_account` : sauvegarde le compte avec refresh_token (voir `src-tauri/src/commands/mod.rs:19-60`)

</details>
