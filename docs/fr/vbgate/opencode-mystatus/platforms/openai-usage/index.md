---
title: "Quota OpenAI : Limites 3h et 24h | opencode-mystatus"
sidebarTitle: "Quota OpenAI"
subtitle: "Consultation des quotas OpenAI : limites de 3 heures et 24 heures"
description: "Apprenez à consulter les quotas OpenAI 3h/24h avec mystatus. Interprétez la barre de progression, le temps de réinitialisation et gérez l'expiration du jeton OAuth."
tags:
  - "OpenAI"
  - "Consultation des quotas"
  - "Quota API"
prerequisite:
  - "start-quick-start"
  - "start-understanding-output"
order: 1
---

# Consultation des quotas OpenAI : limites de 3 heures et 24 heures

## Ce que vous saurez faire à la fin

- Utiliser `/mystatus` pour consulter les quotas des abonnements OpenAI Plus/Team/Pro
- Comprendre les informations de limite de 3 heures et 24 heures dans la sortie
- Comprendre les différences entre fenêtre principale et fenêtre secondaire
- Comprendre la gestion en cas d'expiration de jeton

## Votre situation actuelle

Les appels API d'OpenAI ont des limites, et les dépassements entraînent une restriction temporaire d'accès. Mais vous ne savez pas :
- Combien de quota reste-t-il actuellement ?
- Quelle fenêtre de 3h ou 24h est utilisée ?
- Quand se réinitialise-t-elle ?
- Pourquoi voyez-vous parfois les données de deux fenêtres ?

Si vous ne maîtrisez pas ces informations à temps, cela pourrait affecter votre progression d'utilisation de ChatGPT pour écrire du code ou faire des projets.

## Quand utiliser cette méthode

Quand vous :
- Besoin d'utiliser fréquemment l'API OpenAI pour le développement
- Remarquez que les réponses sont plus lentes ou que la limitation de débit s'active
- Voulez comprendre l'utilisation du compte d'équipe
- Voulez savoir quand le quota sera renouvelé

## Approche principale

OpenAI a deux fenêtres de limitation de débit pour les appels API :

| Type de fenêtre | Durée | Rôle |
| --------------- | ----- | ---- |
| **Fenêtre principale** (primary) | Renvoyée par le serveur OpenAI | Empêcher un grand nombre d'appels en peu de temps |
| **Fenêtre secondaire** (secondary) | Renvoyée par le serveur OpenAI (peut ne pas exister) | Empêcher une utilisation excessive à long terme |

mystatus interroge ces deux fenêtres en parallèle et affiche chacune :
- Pourcentage d'utilisation
- Barre de progression du quota restant
- Temps restant jusqu'à la réinitialisation

::: info
La durée de la fenêtre est renvoyée par le serveur OpenAI, et peut varier selon le type d'abonnement (Plus, Team, Pro).
:::

## Suivez les étapes

### Étape 1 : Exécuter la commande de consultation

Dans OpenCode, entrez `/mystatus`, le système interrogera automatiquement les quotas de toutes les plateformes configurées.

**Ce que vous devriez voir** :
Contient les informations de quota de toutes les plateformes configurées (OpenAI, Zhipu AI, Z.ai, Copilot, Google Cloud, etc., selon les plateformes que vous avez configurées).

### Étape 2 : Trouver la section OpenAI

Dans la sortie, trouvez la section `## OpenAI Account Quota`.

**Ce que vous devriez voir** :
Un contenu similaire à celui-ci :

```
## OpenAI Account Quota

Account:        user@example.com (plus)

3-hour limit
███████████████░░░░░░░░░░ 60% remaining
Resets in: 2h 30m
```

### Étape 3 : Interpréter les informations de fenêtre principale

La **fenêtre principale** (primary_window) affiche généralement :
- **Nom de la fenêtre** : par exemple `3-hour limit` ou `24-hour limit`
- **Barre de progression** : Affichage visuel de la proportion du quota restant
- **Pourcentage restant** : par exemple `60% remaining`
- **Temps de réinitialisation** : par exemple `Resets in: 2h 30m`

**Ce que vous devriez voir** :
- Le nom de la fenêtre affiche la durée (3 heures / 24 heures)
- Plus la barre de progression est pleine, plus le reste est important ; plus elle est vide, plus elle sera bientôt épuisée
- Le temps de réinitialisation est un compte à rebours ; quand il atteint zéro, le quota est renouvelé

::: warning
Si vous voyez le message `Limit reached!`, cela signifie que le quota de la fenêtre actuelle est épuisé, vous devez attendre la réinitialisation.
:::

### Étape 4 : Consulter la fenêtre secondaire (si elle existe)

Si OpenAI renvoie des données de fenêtre secondaire, vous verrez :

```
24-hour limit
████████████████████████████ 90% remaining
Resets in: 20h 45m
```

**Ce que vous devriez voir** :
- La fenêtre secondaire affiche un autre quota temporel (généralement 24 heures)
- Peut avoir un pourcentage restant différent de la fenêtre principale

::: tip
La fenêtre secondaire est un pool de quota indépendant ; l'épuisement de la fenêtre principale n'affecte pas la fenêtre secondaire, et inversement.
:::

### Étape 5 : Consulter le type d'abonnement

Dans la ligne `Account`, vous pouvez voir le type d'abonnement :

```
Account:        user@example.com (plus)
                                   ^^^^^
                                   Type d'abonnement
```

**Types d'abonnement courants** :
- `plus` : Abonnement personnel Plus
- `team` : Abonnement équipe/organisation
- `pro` : Abonnement Pro

**Ce que vous devriez voir** :
- Votre type de compte s'affiche entre parenthèses après l'email
- Différents types peuvent avoir des limites différentes

## Point de contrôle ✅

Vérifiez votre compréhension :

| Scénario | Ce que vous devriez voir |
| -------- | ---------------------- |
| Fenêtre principale reste 60% | Barre de progression environ 60% pleine, affichage `60% remaining` |
| Réinitialisation dans 2,5 heures | Affichage `Resets in: 2h 30m` |
| Limite atteinte | Affichage `Limit reached!` |
| Fenêtre secondaire présente | Fenêtre principale et secondaire affichent chacune une ligne de données |

## Pièges à éviter

### ❌ Opération incorrecte : Ne pas rafraîchir après expiration du jeton

**Symptôme** : Vous voyez le message `⚠️ OAuth 授权已过期` (chinois) ou `⚠️ OAuth token expired` (anglais)

**Cause** : Le jeton OAuth a expiré (durée spécifique contrôlée par le serveur), et il est impossible de consulter le quota après expiration.

**Opération correcte** :
1. Reconnectez-vous à OpenAI dans OpenCode
2. Le jeton sera automatiquement rafraîchi
3. Exécutez à nouveau `/mystatus` pour consulter

### ❌ Opération incorrecte : Confondre fenêtre principale et fenêtre secondaire

**Symptôme** : Penser qu'il n'y a qu'une seule fenêtre de quota, alors que la fenêtre principale est épuisée mais la secondaire fonctionne encore

**Cause** : Les deux fenêtres sont des pools de quota indépendants.

**Opération correcte** :
- Suivez le temps de réinitialisation des deux fenêtres
- La fenêtre principale se réinitialise vite, la secondaire lentement
- Répartissez raisonnablement l'utilisation, évitez qu'une fenêtre reste longtemps épuisée

### ❌ Opération incorrecte : Ignorer l'ID de compte d'équipe

**Symptôme** : L'abonnement Team n'affiche pas votre propre utilisation

**Cause** : L'abonnement Team nécessite de transmettre l'ID de compte d'équipe, sinon il peut interroger le compte par défaut.

**Opération correcte** :
- Assurez-vous d'être connecté au bon compte d'équipe dans OpenCode
- Le jeton contiendra automatiquement `chatgpt_account_id`

## Résumé de la leçon

mystatus consulte les quotas en appelant l'API officielle d'OpenAI :
- Prend en charge l'authentification OAuth (Plus/Team/Pro)
- Affiche la fenêtre principale et la fenêtre secondaire (si elles existent)
- Barre de progression visualisant le quota restant
- Compte à rebours affichant le temps de réinitialisation
- Détection automatique de l'expiration du jeton

## Prochaine leçon

> La prochaine leçon couvre **[Quota Zhipu AI et Z.ai](../zhipu-usage/)**.
>
> Vous apprendrez :
> - Qu'est-ce que la limite de token de 5 heures
> - Comment consulter le quota mensuel MCP
> - Avertissement lorsque le taux d'utilisation dépasse 80%

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer l'emplacement du code source</strong></summary>

> Date de mise à jour :2026-01-23

| Fonction | Chemin du fichier | Ligne |
| ------- | ---------------- | ----- |
| Entrée de consultation de quota OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L207-L236) | 207-236 |
| Appel API OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L132-L155) | 132-155 |
| Formatage de sortie | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| Analyse du jeton JWT | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L64-L73) | 64-73 |
| Extraction de l'email utilisateur | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L78-L81) | 78-81 |
| Vérification de l'expiration du jeton | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L216-L221) | 216-221 |
| Définition du type OpenAIAuthData | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33) | 28-33 |

**Constantes clés** :
- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"` : API officielle de consultation des quotas OpenAI

**Fonctions clés** :
- `queryOpenAIUsage(authData)` : Fonction principale de consultation des quotas OpenAI
- `fetchOpenAIUsage(accessToken)` : Appel de l'API OpenAI
- `formatOpenAIUsage(data, email)` : Formatage de sortie
- `parseJwt(token)` : Analyse du jeton JWT (implémentation non standard)
- `getEmailFromJwt(token)` : Extraction de l'email utilisateur depuis le jeton
- `getAccountIdFromJwt(token)` : Extraction de l'ID de compte d'équipe depuis le jeton

</details>
