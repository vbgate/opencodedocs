---
title: "Quota GitHub Copilot: Premium Requests | opencode-mystatus"
sidebarTitle: "Quota Copilot"
subtitle: "Interrogation de quota GitHub Copilot : Premium Requests et détails du modèle"
description: "Apprenez à consulter le quota GitHub Copilot. Visualisez les Premium Requests, limites par abonnement et détails d'utilisation par modèle avec mystatus."
tags:
  - "github-copilot"
  - "quota"
  - "premium-requests"
  - "authentification-pat"
prerequisite:
  - "start-quick-start"
order: 3
---

# Interrogation de quota GitHub Copilot : Premium Requests et détails du modèle

## Ce que vous apprendrez

- Consulter rapidement l'utilisation mensuelle des Premium Requests GitHub Copilot
- Comprendre les différences de limites entre différents types d'abonnement (Free / Pro / Pro+ / Business / Enterprise)
- Afficher les détails d'utilisation par modèle (comme le nombre d'utilisations de GPT-4, Claude, etc.)
- Identifier le nombre de dépassements, estimer les coûts supplémentaires
- Résoudre les problèmes d'autorisation de la nouvelle intégration OpenCode (le jeton OAuth ne peut pas interroger le quota)

## Votre problème actuel

::: info Problème d'autorisation de la nouvelle intégration OpenCode

La nouvelle intégration OAuth d'OpenCode n'accorde plus l'autorisation d'accès à l'API `/copilot_internal/*`, rendant impossible l'interrogation du quota avec la méthode de jeton OAuth d'origine.

Vous pouvez rencontrer cette erreur :
```
⚠️ L'interrogation de quota GitHub Copilot est temporairement indisponible.
La nouvelle intégration OAuth d'OpenCode ne prend pas en charge l'accès à l'API de quota.

Solution :
1. Créez un fine-grained PAT (visitez https://github.com/settings/tokens?type=beta)
2. Définissez 'Plan' sur 'Read-only' dans 'Account permissions'
...
```

C'est normal, ce tutoriel vous apprendra comment le résoudre.

:::

## Concept clé

Le quota de GitHub Copilot se divise en plusieurs concepts clés :

### Premium Requests (quota principal)

Les Premium Requests sont le principal indicateur de quota de Copilot, incluant :
- Interactions Chat (dialogue avec l'assistant IA)
- Code Completion (complétion de code)
- Fonctionnalités Copilot Workspace (collaboration dans l'espace de travail)

::: tip Que sont les Premium Requests ?

Pour faire simple : chaque fois que Copilot vous « aide » (générer du code, répondre à des questions, analyser du code) compte comme une Premium Request. C'est l'unité de facturation principale de Copilot.

:::

### Types d'abonnement et limites

Différents types d'abonnement ont des limites mensuelles différentes :

| Type d'abonnement | Limite mensuelle | Public cible |
|--- | --- | ---|
| Free              | 50 fois         | Développeurs personnels en essai |
| Pro               | 300 fois        | Développeurs personnels en version officielle |
| Pro+              | 1,500 fois      | Développeurs personnels intensifs |
| Business          | 300 fois        | Abonnement d'équipe (300 par compte) |
| Enterprise        | 1,000 fois      | Abonnement d'entreprise (1000 par compte) |

### Dépassement

Si vous dépassez votre limite mensuelle, Copilot peut toujours être utilisé, mais entraînera des coûts supplémentaires. Le nombre de dépassements sera affiché séparément dans la sortie.

## 🎒 Avant de commencer

### Conditions préalables

::: warning Vérification de la configuration

Ce tutoriel suppose que vous avez déjà :

1. ✅ **Installé le plugin mystatus**
   - Voir [Démarrage rapide](../../start/quick-start/)

2. ✅ **Configuré au moins l'un des suivants** :
   - Connecté à GitHub Copilot dans OpenCode (jeton OAuth)
   - Créé manuellement le fichier de configuration PAT Fine-grained (recommandé)

:::

### Méthodes de configuration (au choix)

#### Méthode 1 : Utiliser Fine-grained PAT (recommandé)

C'est la méthode la plus fiable, non affectée par les changements d'intégration OAuth d'OpenCode.

1. Visitez https://github.com/settings/tokens?type=beta
2. Cliquez sur "Generate new token (classic)" ou "Generate new token (beta)"
3. Dans "Account permissions", définissez **Plan** sur **Read-only**
4. Générez le token, format similaire à `github_pat_11A...`
5. Créez le fichier de configuration `~/.config/opencode/copilot-quota-token.json` :

```json
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

**Description des champs du fichier de configuration** :
- `token`: Votre PAT Fine-grained
- `username`: Nom d'utilisateur GitHub (nécessaire pour l'appel API)
- `tier`: Type d'abonnement, valeurs possibles : `free` / `pro` / `pro+` / `business` / `enterprise`

#### Méthode 2 : Utiliser le jeton OAuth OpenCode

Si vous êtes déjà connecté à GitHub Copilot dans OpenCode, mystatus essaiera d'utiliser votre jeton OAuth.

::: warning Remarque de compatibilité

Cette méthode peut échouer en raison des restrictions d'autorisation de l'intégration OAuth d'OpenCode. En cas d'échec, utilisez la méthode 1 (Fine-grained PAT).

:::

## Suivez les étapes

### Étape 1 : Exécuter la commande d'interrogation

Dans OpenCode, exécutez la commande slash :

```bash
/mystatus
```

**Ce que vous devriez voir** :

Si vous avez configuré un compte Copilot (en utilisant PAT Fine-grained ou jeton OAuth), la sortie inclura un contenu similaire à :

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (pro)

Premium Requests [████████░░░░░░░░░] 40% (180/300)

Détails d'utilisation du modèle :
  gpt-4: 120 demandes
  claude-3-5-sonnet: 60 demandes

Période: 2026-01
```

### Étape 2 : Interpréter les résultats de sortie

La sortie inclut les informations clés suivantes :

#### 1. Informations de compte

```
Account:        GitHub Copilot (pro)
```

Affiche votre type d'abonnement Copilot (pro / free / business, etc.).

#### 2. Quota Premium Requests

```
Premium Requests [████████░░░░░░░░░] 40% (180/300)
```

- **Barre de progression** : Affiche visuellement le pourcentage restant
- **Pourcentage** : 40% restant
- **Utilisé/total** : 180 utilisés sur 300 au total

::: tip Description de la barre de progression

Le remplissage vert/jaune indique l'utilisation, le vide indique le reste. Plus il y a de remplissage, plus l'utilisation est élevée.

:::

#### 3. Détails d'utilisation du modèle (API publique uniquement)

```
Détails d'utilisation du modèle :
  gpt-4: 120 demandes
  claude-3-5-sonnet: 60 demandes
```

Affiche le nombre d'utilisations de chaque modèle, trié par ordre décroissant d'utilisation (jusqu'à 5 premiers affichés).

::: info Pourquoi ma sortie n'a-t-elle pas de détails de modèle ?

Les détails de modèle ne s'affichent qu'avec la méthode API publique (PAT Fine-grained). Si vous utilisez le jeton OAuth (API interne), les détails de modèle ne s'afficheront pas.

:::

#### 4. Dépassement (le cas échéant)

Si vous avez dépassé votre limite mensuelle, il s'affichera :

```
Dépassement : 25 demandes
```

Le dépassement entraînera des coûts supplémentaires, pour les tarifs spécifiques, veuillez vous référer à la tarification GitHub Copilot.

#### 5. Heure de réinitialisation (API interne uniquement)

```
Réinitialisation du quota : 12d 5h (2026-02-01)
```

Affiche le compte à rebours avant la réinitialisation du quota.

### Étape 3 : Vérifier les situations courantes

#### Situation 1 : Voir "⚠️ Interrogation de quota temporairement indisponible"

C'est normal, indiquant que le jeton OAuth d'OpenCode n'a pas l'autorisation d'accès à l'API de quota.

**Solution** : Configurez le PAT en suivant « Méthode 1 : Utiliser Fine-grained PAT ».

#### Situation 2 : Barre de progression vide ou presque pleine

- **Vide** `░░░░░░░░░░░░░░░` : Quota épuisé, affichera le nombre de dépassements
- **Presque pleine** `██████████████████` : Sur le point d'être épuisé, faites attention à contrôler la fréquence d'utilisation

#### Situation 3 : Affiche "Unlimited"

Certains abonnements Enterprise peuvent afficher "Unlimited", indiquant qu'il n'y a pas de limite.

### Étape 4 : Gérer les erreurs (si l'interrogation échoue)

Si vous voyez l'erreur suivante :

```
Échec de la demande API GitHub Copilot (403) : Ressource non accessible par l'intégration
```

**Cause** : Le jeton OAuth n'a pas d'autorisations suffisantes pour accéder à l'API Copilot.

**Solution** : Utilisez la méthode PAT Fine-grained (voir méthode 1).

---

## Point de vérification ✅

Après avoir terminé les étapes ci-dessus, vous devriez pouvoir :

- [ ] Voir les informations de quota GitHub Copilot dans la sortie `/mystatus`
- [ ] Comprendre la barre de progression et le pourcentage des Premium Requests
- [ ] Connaître votre type d'abonnement et la limite mensuelle
- [ ] Savoir comment afficher les détails d'utilisation du modèle (si vous utilisez PAT Fine-grained)
- [ ] Comprendre ce que signifie le dépassement

## Pièges courants

### Piège 1 : Le jeton OAuth ne peut pas interroger le quota (le plus courant)

::: danger Erreur courante

```
⚠️ L'interrogation de quota GitHub Copilot est temporairement indisponible.
La nouvelle intégration OAuth d'OpenCode ne prend pas en charge l'accès à l'API de quota.
```

**Cause** : L'intégration OAuth d'OpenCode n'a pas accordé l'autorisation d'accès à l'API `/copilot_internal/*`.

**Solution** : Utilisez la méthode PAT Fine-grained, voir « Méthode 1 : Utiliser Fine-grained PAT ».

:::

### Piège 2 : Format incorrect du fichier de configuration

Si le fichier de configuration `~/.config/opencode/copilot-quota-token.json` a un format incorrect, l'interrogation échouera.

**Exemple d'erreur** :

```json
// ❌ Erreur : champ username manquant
{
  "token": "github_pat_11A...",
  "tier": "pro"
}
```

**Exemple correct** :

```json
// ✅ Correct : inclut tous les champs requis
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

### Piège 3 : Type d'abonnement incorrect

Si le `tier` que vous remplissez ne correspond pas à votre abonnement réel, le calcul de la limite sera incorrect.

| Votre abonnement réel | Le champ tier doit contenir | Exemple de remplissage incorrect |
|--- | --- | ---|
| Free                 | `free`                      | `pro` ❌                       |
| Pro                  | `pro`                       | `free` ❌                      |
| Pro+                 | `pro+`                      | `pro` ❌                       |
| Business             | `business`                  | `enterprise` ❌                |
| Enterprise           | `enterprise`                | `business` ❌                  |

**Comment voir votre type d'abonnement réel** :
- Visitez https://github.com/settings/billing
- Consultez la section "GitHub Copilot"

### Piège 4 : Autorisations insuffisantes du token

Si vous utilisez un jeton Classic (non Fine-grained), sans l'autorisation de lecture "Plan", cela renverra une erreur 403.

**Solution** :
1. Assurez-vous d'utiliser un jeton Fine-grained (généré sur la page version bêta)
2. Assurez-vous d'avoir accordé "Account permissions → Plan → Read-only"

### Piège 5 : Les détails du modèle ne s'affichent pas

::: tip Phénomène normal

Si vous utilisez la méthode jeton OAuth (API interne), les détails d'utilisation du modèle ne s'afficheront pas.

C'est parce que l'API interne ne renvoie pas de statistiques d'utilisation au niveau du modèle. Si vous avez besoin de détails du modèle, utilisez la méthode PAT Fine-grained.

:::

## Résumé de cette leçon

Ce cours explique comment utiliser opencode-mystatus pour interroger le quota de GitHub Copilot :

**Points clés** :

1. **Premium Requests** est le principal indicateur de quota de Copilot, incluant Chat, Completion, Workspace et autres fonctionnalités
2. **Type d'abonnement** détermine la limite mensuelle : Free 50 fois, Pro 300 fois, Pro+ 1,500 fois, Business 300 fois, Enterprise 1,000 fois
3. **Dépassement** entraînera des coûts supplémentaires, affiché séparément dans la sortie
4. **Fine-grained PAT** est la méthode d'authentification recommandée, non affectée par les changements d'intégration OAuth d'OpenCode
5. **Jeton OAuth** peut échouer en raison des restrictions d'autorisation, nécessitant l'utilisation de PAT comme solution alternative

**Interprétation de la sortie** :
- Barre de progression : Affiche visuellement le pourcentage restant
- Pourcentage : Reste spécifique
- Utilisé/total : Utilisation détaillée
- Détails du modèle (optionnel) : Nombre d'utilisations par modèle
- Heure de réinitialisation (optionnel) : Compte à rebours avant la prochaine réinitialisation

## Prochaine leçon

> La prochaine leçon nous apprendrons **[Configuration de l'authentification Copilot](../../advanced/copilot-auth/)**.
>
> Vous apprendrez :
> - Comparaison détaillée du jeton OAuth et du PAT Fine-grained
> - Comment générer un PAT Fine-grained (étapes complètes)
> - Diverses solutions pour résoudre les problèmes d'autorisation
> - Bonnes pratiques dans différents scénarios

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour :2026-01-23

| Fonction             | Chemin du fichier                                                                                      | Ligne    |
|--- | --- | ---|
| Interrogation de quota Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 481-524 |
|--- | --- | ---|
| Interrogation API Billing publique | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 157-177 |
| Interrogation API interne | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 242-304 |
| Logique d'échange de jeton   | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 183-208 |
| Formatage API interne | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 354-393 |
| Formatage API publique | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 410-468 |
| Définition de type d'abonnement Copilot | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 57-58  |
| Définition de type CopilotQuotaConfig | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 66-73  |
| Définition de type CopilotAuthData | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 46-51  |
| Constante de quota d'abonnement Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 397-403 |

**Constantes clés** :

- `COPILOT_PLAN_LIMITS` : Limites mensuelles de chaque type d'abonnement (lignes 397-403)
  - `free: 50`
  - `pro: 300`
  - `pro+: 1500`
  - `business: 300`
  - `enterprise: 1000`

- `COPILOT_QUOTA_CONFIG_PATH` : Chemin du fichier de configuration PAT Fine-grained (lignes 93-98)
  - `~/.config/opencode/copilot-quota-token.json`

**Fonctions clés** :

- `queryCopilotUsage()` : Fonction principale d'interrogation, prenant en charge deux stratégies d'authentification (lignes 481-524)
- `fetchPublicBillingUsage()` : Utilise PAT Fine-grained pour interroger l'API Billing publique (lignes 157-177)
- `fetchCopilotUsage()` : Utilise le jeton OAuth pour interroger l'API interne (lignes 242-304)
- `exchangeForCopilotToken()` : Logique d'échange de jeton OAuth (lignes 183-208)
- `formatPublicBillingUsage()` : Formatage de la réponse de l'API publique, incluant les détails du modèle (lignes 410-468)
- `formatCopilotUsage()` : Formatage de la réponse de l'API interne (lignes 354-393)

**Stratégies d'authentification** :

1. **Stratégie 1 (prioritaire)** : Utiliser PAT Fine-grained + API Billing publique
   - Avantages : Stable, non affecté par les changements d'intégration OAuth d'OpenCode
   - Inconvénients : Nécessite que l'utilisateur configure manuellement le PAT

2. **Stratégie 2 (régression)** : Utiliser le jeton OAuth + API interne
   - Avantages : Aucune configuration supplémentaire requise
   - Inconvénients : Peut échouer en raison de restrictions d'autorisation (l'intégration OpenCode actuelle ne le prend pas en charge)

**Points de terminaison API** :

- API Billing publique : `https://api.github.com/users/{username}/settings/billing/premium_request/usage`
- API de quota interne : `https://api.github.com/copilot_internal/user`
- API d'échange de jetons : `https://api.github.com/copilot_internal/v2/token`

</details>
