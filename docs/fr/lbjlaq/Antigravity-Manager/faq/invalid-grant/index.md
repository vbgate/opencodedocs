---
title: "Dépannage Invalid Grant: Réactivation de compte désactivé | Antigravity-Manager"
sidebarTitle: "Comment réactiver un compte désactivé"
subtitle: "invalid_grant et désactivation automatique de compte : pourquoi cela arrive, comment réactiver"
description: "Apprenez la signification de l'erreur invalid_grant et la logique de traitement automatique. Après confirmation de l'expiration de refresh_token, déclenchez la réactivation automatique en ajoutant à nouveau le compte via OAuth, et vérifiez que la réactivation prend effet pour le Proxy."
tags:
  - "FAQ"
  - "Dépannage"
  - "OAuth"
  - "Gestion des comptes"
  - "invalid_grant"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
  - "advanced-scheduling"
order: 1
---
# invalid_grant et désactivation automatique de compte : pourquoi cela arrive, comment réactiver

## Ce que vous saurez faire à la fin

- En voyant `invalid_grant`, savoir à quelle catégorie de problème refresh_token cela correspond
- Comprendre pourquoi « le compte est soudainement indisponible » : dans quels cas il est automatiquement désactivé, comment le système traite après désactivation
- Réactiver le compte par le chemin le plus court, et confirmer que la réactivation a pris effet pour le Proxy en cours

## Vos symptômes actuels

- L'appel au Proxy local échoue soudainement, le message d'erreur contient `invalid_grant`
- Le compte est encore dans la liste Accounts, mais le Proxy continue de le sauter (ou vous avez l'impression qu'il « n'est plus jamais utilisé »)
- Avec peu de comptes, après une `invalid_grant`, la disponibilité globale se dégrade nettement

## Qu'est-ce que invalid_grant ?

**invalid_grant** est une erreur renvoyée par Google OAuth lors du rafraîchissement de `access_token`. Pour Antigravity Tools, cela signifie que le `refresh_token` d'un compte a probablement été révoqué ou a expiré, continuer à réessayer ne fera qu'échouer de manière répétée, donc le système marquera le compte comme indisponible et le retirera du pool proxy.

## Idée principale : le système ne « saute pas temporairement », mais « désactive de manière persistante »

Lorsque le Proxy découvre que la chaîne d'erreur de rafraîchissement de token contient `invalid_grant`, il fera deux choses :

1. **Marquer le compte comme disabled** (persister dans JSON du compte)
2. **Retirer le compte du pool de tokens en mémoire** (éviter de sélectionner à plusieurs reprises le même mauvais compte)

C'est pourquoi vous voyez « le compte est là, mais le Proxy ne l'utilise plus ».

::: info disabled vs proxy_disabled

- `disabled=true` : le compte est « complètement désactivé » (la cause typique est `invalid_grant`). Sera sauté lors du chargement du pool de comptes.
- `proxy_disabled=true` : le compte est seulement « indisponible pour le Proxy » (désactivation manuelle/operation batch/logique de protection du quota), la sémantique est différente.

Ces deux états sont jugés séparément lors du chargement du pool de comptes : d'abord juger `disabled`, puis juger la protection du quota et `proxy_disabled`.

:::

## Suivez-moi

### Étape 1 : Confirmer si invalid_grant est déclenché par le rafraîchissement de refresh_token

**Pourquoi** : `invalid_grant` peut apparaître dans plusieurs chaînes d'appel, mais la « désactivation automatique » de ce projet n'est déclenchée que lors de l'**échec du rafraîchissement de access_token**.

Dans le journal Proxy, vous verrez un journal d'erreur similaire (mots-clés sont `Token 刷新失败` + `invalid_grant`) :

```text
Token 刷新失败 (<email>): <...invalid_grant...>，尝试下一个账号
Disabling account due to invalid_grant (<email>): refresh_token likely revoked/expired
```

**Ce que vous devriez voir** : après qu'un compte a `invalid_grant`, il n'est plus sélectionné rapidement (car retiré du pool de tokens).

### Étape 2 : Vérifier le champ disabled dans le fichier de compte (optionnel, mais le plus précis)

**Pourquoi** : la désactivation automatique est « persistée », après avoir confirmé le contenu du fichier, vous pouvez exclure la mauvaise interprétation de « juste rotation temporaire ».

Le fichier de compte se trouve dans le répertoire `accounts/` du répertoire de données de l'application (l'emplacement du répertoire de données voir **[Premier démarrage : répertoire de données, journaux, barre des tâches et démarrage automatique](../../start/first-run-data/)**). Lorsque le compte est désactivé, le fichier affichera ces trois champs :

```json
{
  "disabled": true,
  "disabled_at": 1700000000,
  "disabled_reason": "invalid_grant: ..."
}
```

**Ce que vous devriez voir** : `disabled` est `true`, et `disabled_reason` contient le préfixe `invalid_grant:`.

### Étape 3 : Réactiver le compte (méthode recommandée : ajouter à nouveau le même compte)

**Pourquoi** : la « réactivation » de ce projet n'est pas de cliquer manuellement sur un interrupteur dans le Proxy, mais de déclencher la réactivation automatique par « mise à jour explicite du token ».

Accédez à la page **Accounts**, ajoutez à nouveau le compte avec vos nouvelles informations d'identification (choisissez l'une des deux méthodes) :

1. Suivez à nouveau le processus d'autorisation OAuth (voir **[Ajouter un compte : double canal OAuth/Refresh Token et meilleures pratiques](../../start/add-account/)**)
2. Ajoutez à nouveau avec un nouveau `refresh_token` (le système utilisera l'e-mail renvoyé par Google comme base pour faire upsert)

Lorsque le système détecte que `refresh_token` ou `access_token` de votre upsert est différent de l'ancienne valeur, et que le compte était auparavant dans `disabled=true`, il effacera automatiquement :

- `disabled`
- `disabled_reason`
- `disabled_at`

**Ce que vous devriez voir** : le compte n'est plus dans l'état disabled, et (si le Proxy est en cours d'exécution) le pool de comptes sera automatiquement rechargé, rendant la réactivation immédiate.

### Étape 4 : Vérifier si la réactivation a pris effet pour le Proxy

**Pourquoi** : si vous n'avez qu'un seul compte, ou si les autres comptes ne sont pas disponibles, après réactivation vous devriez voir immédiatement « la disponibilité est revenue ».

Méthode de vérification :

1. Lancez une requête qui déclenche le rafraîchissement de token (par exemple attendez que le token soit proche de l'expiration avant de faire la requête)
2. Observez que le journal n'affiche plus l'invite « sauter le compte disabled »

**Ce que vous devriez voir** : la requête passe normalement, et le journal n'affiche plus le processus de désactivation `invalid_grant` pour ce compte.

## Attention aux pièges

### ❌ Confondre disabled avec « rotation temporaire »

Si vous ne regardez que « le compte est là » dans l'UI, il est facile de mal interpréter comme « le système ne l'utilise que temporairement ». Mais `disabled=true` est écrit sur le disque, continuera à prendre effet après redémarrage.

### ❌ Compléter seulement access_token, ne pas mettre à jour refresh_token

Le point de déclenchement de `invalid_grant` est le `refresh_token` utilisé lors du rafraîchissement de `access_token`. Si vous avez seulement obtenu temporairement un `access_token` encore utilisable, mais que `refresh_token` est toujours expiré, cela déclenchera encore la désactivation.

## Points de contrôle ✅

- [ ] Vous pouvez confirmer dans le journal que `invalid_grant` provient de l'échec du rafraîchissement de refresh_token
- [ ] Vous connaissez la différence sémantique entre `disabled` et `proxy_disabled`
- [ ] Vous pouvez réactiver le compte en ajoutant à nouveau le compte (OAuth ou refresh_token)
- [ ] Vous pouvez vérifier que la réactivation a pris effet pour le Proxy en cours d'exécution

## Résumé de la leçon

- Lorsque `invalid_grant` est déclenché, le Proxy **persistera le compte comme disabled** et le retirera du pool de tokens, évitant les échecs répétés
- La clé de réactivation est « mise à jour explicite du token » (OAuth à nouveau ou ajouter à nouveau avec nouveau refresh_token), le système effacera automatiquement les champs `disabled_*`
- Le JSON du compte dans le répertoire de données est la source la plus autoritaire d'état (désactivation/raison/heure y sont)

## Prochaine leçon

> La prochaine leçon, nous apprendrons **[401/Échec d'authentification : auth_mode, compatibilité Header et liste de configuration client](../auth-401/)**.
>
> Vous apprendrez :
> - 401 est généralement quelle couche de « mode/Key/Header » ne correspond pas
> - Quels en-têtes d'authentification différents clients doivent porter
> - Comment utiliser le chemin le plus court pour auto-vérifier et corriger

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Heure de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| Conception : problème invalid_grant et comportement de modification | [`docs/proxy-invalid-grant.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-invalid-grant.md#L1-L52) | 1-52 |
| Sauter `disabled=true` lors du chargement du pool de comptes | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L70-L158) | 70-158 |
| Identifier `invalid_grant` et désactiver le compte lors de l'échec du rafraîchissement de token | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L840-L890) | 840-890 |
| Persister `disabled/disabled_at/disabled_reason` et retirer de la mémoire | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| Troncature `disabled_reason` (éviter l'expansion du fichier de compte) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1464-L1471) | 1464-1471 |
| Nettoyage automatique `disabled_*` lors de l'upsert (changement de token considéré comme utilisateur a corrigé les informations d'identification) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L178-L206) | 178-206 |
| Rechargement automatique des comptes proxy après nouvel ajout de compte (effet immédiat en cours d'exécution) | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L21-L59) | 21-59 |

</details>
