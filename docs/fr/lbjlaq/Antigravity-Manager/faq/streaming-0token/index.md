---
title: "Interruption de flux: Dépannage 0 Token | Antigravity-Manager"
sidebarTitle: "Auto-guérison ou intervention manuelle"
subtitle: "Interruption de flux/0 Token/Signature invalide : mécanisme d'auto-guérison et chemin de dépannage"
description: "Apprenez le chemin de dépannage des interruptions de flux, 0 Token et signatures invalides dans Antigravity Tools. Confirmez /v1/messages ou appel natif Gemini, comprenez la pré-lecture peek et la nouvelle tentative avec délai, combinez Proxy Monitor et les journaux pour localiser rapidement la cause et déterminer si vous devez faire pivoter les comptes."
tags:
  - "faq"
  - "streaming"
  - "dépannage"
  - "retry"
prerequisite:
  - "start-getting-started"
  - "start-first-run-data"
  - "advanced-monitoring"
  - "advanced-scheduling"
order: 5
---

# Interruption de flux/0 Token/Signature invalide : mécanisme d'auto-guérison et chemin de dépannage

Dans Antigravity Tools, lors de l'appel de `/v1/messages` (compatible Anthropic) ou de l'interface native de flux Gemini, si vous rencontrez des problèmes tels que « interruption de sortie de flux », « 200 OK mais 0 Token », « Invalid `signature` », cette leçon vous donne un chemin de dépannage de l'UI aux journaux.

## Ce que vous saurez faire à la fin

- Savoir que les problèmes 0 Token/interruption dans le proxy sont généralement bloqués en premier par « pré-lecture peek »
- Pouvoir confirmer le compte et le modèle mappé de cette requête dans Proxy Monitor (`X-Account-Email` / `X-Mapped-Model`)
- Pouvoir juger par les journaux si c'est « flux en amont terminé tôt », « nouvelle tentative avec délai », « rotation de compte » ou « nouvelle tentative de réparation de signature »
- Savoir dans quels cas attendre l'auto-guérison du proxy, dans quels cas intervenir manuellement

## Votre situation actuelle

Vous pouvez voir ces « phénomènes », mais ne savez pas par où commencer :

- La sortie de flux s'interrompt à moitié, le client semble « bloqué » et ne continue plus
- 200 OK, mais `usage.output_tokens=0` ou le contenu est vide
- Erreur 400 contient `Invalid \`signature\``, `Corrupted thought signature`, `must be \`thinking\`` etc.

La plupart de ces problèmes ne sont pas « votre requête est mal écrite », mais plutôt transmission de flux, limitation/fluctuation en amont, ou blocs de signature portés dans les messages historiques déclenchent la validation en amont. Antigravity Tools a mis plusieurs lignes de défense dans la couche proxy, vous n'avez qu'à vérifier par un chemin fixe à quelle étape il bloque.

## Qu'est-ce que 0 Token ?

**0 Token** signifie généralement `output_tokens=0` finalement renvoyé par une requête, et semble « n'a généré aucun contenu ». Dans Antigravity Tools, sa cause la plus courante est « la réponse de flux se termine/se produit une erreur avant de vraiment sortir », plutôt que le modèle a vraiment généré 0 tokens. Le proxy essaiera d'utiliser la pré-lecture peek pour bloquer ce type de réponse vide et déclencher une nouvelle tentative.

## Trois choses que le proxy fait en arrière-plan (d'abord le modèle mental)

### 1) Les requêtes non-flux peuvent être automatiquement converties en flux

Dans le chemin `/v1/messages`, le proxy convertira en interne « la requête non-flux du client » en requête de flux pour demander l'amont, puis collectera en JSON après avoir reçu SSE (la raison est indiquée dans le journal comme « better quota »).

Preuve du code source : `src-tauri/src/proxy/handlers/claude.rs#L665-L913`.

### 2) Pré-lecture peek : attendez d'abord « le premier bloc de données valides » avant de donner le flux au client

Pour la sortie SSE de `/v1/messages`, le proxy fera d'abord `timeout + next()` pour pré-lecture, sautera les lignes de heartbeat/commentaire (commençant par `:`), jusqu'à obtenir le premier bloc de données « non vide, non heartbeat » avant de commencer à transmettre formellement. Si peek échoue/expire/flux se termine, entrera directement dans la tentative suivante (la tentative suivante déclenchera généralement la rotation de compte).

Preuve du code source : `src-tauri/src/proxy/handlers/claude.rs#L812-L926` ; le flux natif Gemini a aussi peek similaire : `src-tauri/src/proxy/handlers/gemini.rs#L117-L149`.

### 3) Nouvelle tentative avec délai unifié + décider « faut-il faire pivoter le compte » selon le code d'état

Le proxy a une stratégie de délai claire pour les codes d'état courants, et définit quels codes d'état déclencheront la rotation de compte.

Preuve du code source : `src-tauri/src/proxy/handlers/claude.rs#L117-L236`.

## 🎒 Préparatifs avant de commencer

- Vous pouvez ouvrir Proxy Monitor (voir [Proxy Monitor : journaux de requêtes, filtrage, restauration de détails et exportation](../../advanced/monitoring/))
- Vous savez que les journaux sont dans `logs/` du répertoire de données (voir [Premier démarrage : répertoire de données, journaux, barre des tâches et démarrage automatique](../../start/first-run-data/))

## Suivez-moi

### Étape 1 : Confirmer quel chemin d'interface vous appelez

**Pourquoi**
Les détails d'auto-guérison de `/v1/messages` (handler claude) et Gemini natif (handler gemini) sont différents, confirmez d'abord le chemin pour éviter de perdre du temps sur de mauvais mots-clés de journal.

Ouvrez Proxy Monitor, trouvez cette requête échouée, notez d'abord le Path :

- `/v1/messages` : voir la logique de `src-tauri/src/proxy/handlers/claude.rs`
- `/v1beta/models/...:streamGenerateContent` : voir la logique de `src-tauri/src/proxy/handlers/gemini.rs`

**Ce que vous devriez voir** : dans l'enregistrement de requête, vous pouvez voir URL/méthode/code d'état (et durée de la requête).

### Étape 2 : Capturer « compte + modèle mappé » dans les en-têtes de réponse

**Pourquoi**
Qu'une requête échoue/réussisse, beaucoup de choses dépendent de « quel compte a été sélectionné cette fois » « a été routé vers quel modèle amont ». Le proxy écrira ces deux informations dans les en-têtes de réponse, notez-les d'abord, puis faites correspondre avec les journaux.

Dans cette requête échouée, cherchez ces en-têtes de réponse :

- `X-Account-Email`
- `X-Mapped-Model`

Ces deux éléments sont définis dans `/v1/messages` et le handler Gemini (par exemple, dans la réponse SSE `/v1/messages` : `src-tauri/src/proxy/handlers/claude.rs#L887-L896` ; Gemini SSE : `src-tauri/src/proxy/handlers/gemini.rs#L235-L245`).

**Ce que vous devriez voir** : `X-Account-Email` est l'e-mail, `X-Mapped-Model` est le nom de modèle réellement demandé.

### Étape 3 : Dans app.log, juger si « échec à l'étape peek »

**Pourquoi**
L'échec peek signifie généralement « l'amont n'a même pas commencé à cracher des données valides ». Ce type de problème le plus souvent traité par nouvelle tentative/rotation de compte, vous devez confirmer si le proxy a déclenché.

D'abord localisez le fichier journal (le répertoire de journaux vient de `logs/` du répertoire de données, écrit en rotation journalière dans `app.log*`).

::: code-group

```bash [macOS/Linux]
ls -lt "$HOME/.antigravity_tools/logs" | head
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs") | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

:::

Ensuite, dans le dernier `app.log*`, cherchez ces mots-clés :

- `/v1/messages` (handler claude) : `Stream error during peek` / `Stream ended during peek` / `Timeout waiting for first data` (`src-tauri/src/proxy/handlers/claude.rs#L828-L864`)
- Flux natif Gemini : `[Gemini] Empty first chunk received, retrying...` / `Stream error during peek` / `Stream ended immediately` (`src-tauri/src/proxy/handlers/gemini.rs#L117-L144`)

**Ce que vous devriez voir** : si la nouvelle tentative peek est déclenchée, le journal affichera une alerte similaire à « retrying... », puis entrera dans la tentative suivante (généralement entraînera une rotation de compte).

### Étape 4 : Si 400/Signature invalide, confirmer si le proxy a fait « nouvelle tentative de réparation de signature »

**Pourquoi**
Les erreurs de signature proviennent souvent des blocs Thinking/blocs de signature dans les messages historiques qui ne répondent pas aux exigences de l'amont. Antigravity Tools essaiera « rétrograder les blocs thinking historiques + injecter prompt de réparation » avant de réessayer, vous devriez d'abord laisser l'auto-guérison se terminer.

Vous pouvez juger s'il est entré dans la logique de réparation avec 2 signaux :

1. Le journal affiche `Unexpected thinking signature error ... Retrying with all thinking blocks removed.` (`src-tauri/src/proxy/handlers/claude.rs#L999-L1025`)
2. Ensuite convertira le bloc historique `Thinking` en `Text`, et ajoutera le prompt de réparation dans le dernier message utilisateur (`src-tauri/src/proxy/handlers/claude.rs#L1027-L1102` ; le handler Gemini ajoutera aussi le même prompt dans `contents[].parts` : `src-tauri/src/proxy/handlers/gemini.rs#L300-L325`)

**Ce que vous devriez voir** : le proxy réessaiera automatiquement après un court délai (`FixedDelay`), et peut entrer dans la tentative suivante.

## Points de contrôle ✅

- [ ] Vous pouvez confirmer le chemin de requête dans Proxy Monitor (`/v1/messages` ou Gemini natif)
- [ ] Vous pouvez obtenir `X-Account-Email` et `X-Mapped-Model` de cette requête
- [ ] Vous pouvez rechercher les mots-clés peek/nouvelle tentative dans `logs/app.log*`
- [ ] En cas d'erreur de signature 400, vous pouvez confirmer si le proxy est entré dans la logique de nouvelle tentative « réparation prompt + nettoyage blocs thinking »

## Attention aux pièges

| Scénario | Ce que vous pourriez faire (❌) | Approche recommandée (✓) |
|--- | --- | ---|
| Voir 0 Token et immédiatement réessayer manuellement plusieurs fois | Continuer à appuyer sur le bouton de nouvelle tentative du client, sans regarder les journaux | D'abord regarder une fois Proxy Monitor + app.log, confirmer si échec précoce à l'étape peek (nouvelle tentative/rotation automatique) |
| Rencontre `Invalid \`signature\`` et videz directement le répertoire de données | Supprimez `.antigravity_tools` entier, comptes/statistiques tous perdus | Laissez d'abord le proxy exécuter une « nouvelle tentative de réparation de signature » ; seulement quand le journal indique clairement irrécupérable, considérez l'intervention manuelle |
| Confondre « fluctuation serveur » avec « compte cassé » | 400/503/529一律 rotation de compte | La rotation est-elle efficace dépend du code d'état ; le proxy a des règles `should_rotate_account(...)` (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`) |

## Résumé de la leçon

- 0 Token/interruption de flux dans le passe généralement par la pré-lecture peek en premier ; l'échec à l'étape peek déclenchera une nouvelle tentative et entrera dans la tentative suivante
- `/v1/messages` peut convertir en interne les requêtes non-flux en flux puis collecter en JSON, cela affecte votre compréhension de « pourquoi cela ressemble à un problème de flux »
- Pour les erreurs 400 de type signature invalide, le proxy essaiera « réparation prompt + nettoyage blocs thinking » avant de réessayer, vous devriez prioriser la vérification si ce chemin d'auto-guérison fonctionne

## Prochaine leçon

> La prochaine leçon, nous apprendrons **[Tableau de référence rapide des points de terminaison](../../appendix/endpoints/)**.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Heure de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Handler Claude : stratégie de nouvelle tentative avec délai + règles de rotation | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L117-L236) | 117-236 |
|--- | --- | ---|
|--- | --- | ---|
| Handler Claude : nouvelle tentative de réparation erreur 400 signature/ordre de blocs | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L999-L1102) | 999-1102 |
|--- | --- | ---|
| Handler Gemini : injection de prompt de réparation erreur 400 signature | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L300-L325) | 300-325 |
| Cache de signature (trois couches : tool/family/session, incluant TTL/longueur minimale) | [`src-tauri/src/proxy/signature_cache.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/signature_cache.rs#L5-L207) | 5-207 |
| Conversion SSE Claude : capture de signature et écriture dans cache de signature | [`src-tauri/src/proxy/mappers/claude/streaming.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/streaming.rs#L639-L787) | 639-787 |

**Constantes clés** :
- `MAX_RETRY_ATTEMPTS = 3` : nombre maximum de nouvelles tentatives (`src-tauri/src/proxy/handlers/claude.rs#L27`)
- `SIGNATURE_TTL = 2 * 60 * 60` secondes : TTL cache de signature (`src-tauri/src/proxy/signature_cache.rs#L6`)
- `MIN_SIGNATURE_LENGTH = 50` : longueur minimale de signature (`src-tauri/src/proxy/signature_cache.rs#L7`)

**Fonctions clés** :
- `determine_retry_strategy(...)` : sélectionner la stratégie de délai selon le code d'état (`src-tauri/src/proxy/handlers/claude.rs#L117-L167`)
- `should_rotate_account(...)` : décider de faire pivoter le compte selon le code d'état (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`)
- `SignatureCache::cache_session_signature(...)` : mettre en cache la signature de session (`src-tauri/src/proxy/signature_cache.rs#L149-L188`)

</details>
