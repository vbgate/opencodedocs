---
title: "Quota Zhipu AI : Limite token et MCP | opencode-mystatus"
sidebarTitle: "Quota Zhipu AI"
subtitle: "Consultation des quotas Zhipu AI et Z.ai : limite de token de 5 heures et quota mensuel MCP"
description: "Apprenez à consulter les quotas Zhipu AI et Z.ai avec opencode-mystatus. Maîtrisez la limite de token de 5 heures et le quota mensuel MCP."
tags:
  - "Zhipu AI"
  - "Z.ai"
  - "Consultation des quotas"
  - "Limite de token"
  - "Quota MCP"
prerequisite:
  - "start-quick-start"
order: 2
---

# Consultation des quotas Zhipu AI et Z.ai : limite de token de 5 heures et quota mensuel MCP

## Ce que vous saurez faire à la fin

- Consulter la limite de token de 5 heures de **Zhipu AI** et **Z.ai**
- Comprendre la signification et les règles de réinitialisation du **quota mensuel MCP**
- Interpréter les barres de progression, l'utilisation, le quota total et d'autres informations dans la sortie
- Savoir quand l'avertissement de taux d'utilisation élevé se déclenche

## Votre situation actuelle

Vous utilisez Zhipu AI ou Z.ai pour le développement d'applications, mais rencontrez souvent ces problèmes :

- Vous ne savez pas combien reste-t-il de la **limite de token de 5 heures**
- Les demandes échouent après dépassement de la limite, affectant la progression du développement
- Vous ne comprenez pas la signification concrète du **quota mensuel MCP**
- Vous devez vous connecter à deux plateformes séparément pour consulter les quotas, c'est fastidieux

## Quand utiliser cette méthode

Quand vous :

- Utilisez l'API de Zhipu AI / Z.ai pour le développement d'applications
- Besoin de surveiller l'utilisation des tokens pour éviter les dépassements
- Voulez comprendre le quota mensuel de la fonction de recherche MCP
- Utilisez simultanément Zhipu AI et Z.ai, voulez gérer les quotas de manière unifiée

## Approche principale

Le système de quota de **Zhipu AI** et **Z.ai** se divise en deux types :

| Type de quota | Signification | Cycle de réinitialisation |
|--- | --- | ---|
| **Limite de token de 5 heures** | Limite d'utilisation de tokens pour les requêtes API | Réinitialisation automatique de 5 heures |
| **Quota mensuel MCP** | Limite mensuelle du nombre de recherches MCP (Model Context Protocol) | Réinitialisation mensuelle |

Le plugin appelle l'API officielle en temps réel pour obtenir ces données, et les affiche visuellement avec des **barres de progression** et des **pourcentages**.

::: info Qu'est-ce que MCP ?

**MCP** (Model Context Protocol) est un protocole de contexte de modèle fourni par Zhipu AI, permettant aux modèles IA de rechercher et citer des ressources externes. Le quota mensuel MCP limite le nombre de recherches mensuelles.

:::

## Suivez les étapes

### Étape 1 : Configurer le compte Zhipu AI / Z.ai

**Pourquoi**
Le plugin a besoin de la clé API pour consulter vos quotas. Zhipu AI et Z.ai utilisent la **méthode d'authentification par clé API**.

**Opération**

1. Ouvrez le fichier `~/.local/share/opencode/auth.json`

2. Ajoutez la configuration de la clé API de Zhipu AI ou Z.ai :

```json
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "你的智谱 AI API Key"
  },
  "zai-coding-plan": {
    "type": "api",
    "key": "你的 Z.ai API Key"
  }
}
```

**Ce que vous devriez voir** :
- Le fichier de configuration contient le champ `zhipuai-coding-plan` ou `zai-coding-plan`
- Chaque champ a `type: "api"` et le champ `key`

### Étape 2 : Consulter les quotas

**Pourquoi**
Appeler l'API officielle pour obtenir la situation d'utilisation en temps réel.

**Opération**

Dans OpenCode, exécutez la commande slash :

```bash
/mystatus
```

Ou posez une question en langage naturel :

```
查看我的智谱 AI 额度
```

**Ce que vous devriez voir** : une sortie similaire à celle-ci :

```
## 智谱 AI 账号额度

Account:        9c89****AQVM (Coding Plan)

5 小时 Token 限额
███████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4小时后

MCP 月度配额
██████████████████░░░░░░░ 剩余 60%
已用: 200 / 500

## Z.ai 账号额度

Account:        9c89****AQVM (Z.ai)

5 小时 Token 限额
███████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4小时后
```

### Étape 3 : Interpréter la sortie

**Pourquoi**
Seule la compréhension de la signification de chaque ligne de sortie vous permettra de gérer efficacement les quotas.

**Opération**

Comparez les explications suivantes avec votre sortie :

| Champ de sortie | Signification | Exemple |
|--- | --- | ---|
| **Account** | Clé API masquée et type de compte | `9c89****AQVM (Coding Plan)` |
| **5 小时 Token 限额** | Situation d'utilisation des tokens dans le cycle de 5 heures actuel | Barre de progression + pourcentage |
| **已用: X / Y** | Utilisé / Quota total | `0.5M / 10.0M` |
| **重置: X小时后** | Compte à rebours jusqu'à la prochaine réinitialisation | `4小时后` |
| **MCP 月度配额** | Situation d'utilisation mensuelle du nombre de recherches MCP | Barre de progression + pourcentage |
| **已用: X / Y** | Utilisé / Quota total | `200 / 500` |

**Ce que vous devriez voir** :
- La partie limite de token de 5 heures a un **compte à rebours de réinitialisation**
- La partie quota mensuel MCP **n'a pas de compte à rebours** (car c'est une réinitialisation mensuelle)
- Si le taux d'utilisation dépasse 80%, un **avertissement** s'affiche en bas

## Point de contrôle ✅

Confirmez que vous comprenez les éléments suivants :

- [ ] La limite de token de 5 heures a un compte à rebours de réinitialisation
- [ ] Le quota mensuel MCP est réinitialisé mensuellement, n'affiche pas de compte à rebours
- [ ] Un taux d'utilisation dépassant 80% déclenche un avertissement
- [ ] La clé API est affichée de manière masquée (affiche uniquement les 4 premiers et 4 derniers caractères)

## Pièges à éviter

### ❌ Erreur courante 1 : Le champ `type` manque dans le fichier de configuration

**Symptôme** : La consultation affiche "Aucun compte configuré trouvé"

**Cause** : Le champ `type: "api"` manque dans `auth.json`

**Correction** :

```json
// ❌ Erreur
{
  "zhipuai-coding-plan": {
    "key": "你的 API Key"
  }
}

// ✅ Correct
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "你的 API Key"
  }
}
```

### ❌ Erreur courante 2 : La clé API a expiré ou est invalide

**Symptôme** : Affichage "Échec de requête API" ou "Échec d'authentification"

**Cause** : La clé API a expiré ou a été révoquée

**Correction** :
- Connectez-vous à la console Zhipu AI / Z.ai
- Régénérez la clé API
- Mettez à jour le champ `key` dans `auth.json`

### ❌ Erreur courante 3 : Confondre les deux types de quotas

**Symptôme** : Penser que la limite de token et le quota MCP sont la même chose

**Correction** :
- **Limite de token** : Utilisation de tokens pour les appels API, réinitialisation de 5 heures
- **Quota MCP** : Nombre de recherches MCP, réinitialisation mensuelle
- Ce sont **deux limites indépendantes**, elles ne s'affectent pas mutuellement

## Résumé de la leçon

Cette leçon a couvert l'utilisation d'opencode-mystatus pour consulter les quotas de Zhipu AI et Z.ai :

**Concepts clés** :
- Limite de token de 5 heures : Limite d'appels API, avec compte à rebours de réinitialisation
- Quota mensuel MCP : Nombre de recherches MCP, réinitialisation mensuelle

**Étapes d'opération** :
1. Configurez `zhipuai-coding-plan` ou `zai-coding-plan` dans `auth.json`
2. Exécutez `/mystatus` pour consulter les quotas
3. Interprétez les barres de progression, l'utilisation, le temps de réinitialisation dans la sortie

**Points clés** :
- Un taux d'utilisation dépassant 80% déclenche un avertissement
- La clé API est automatiquement affichée de manière masquée
- La limite de token et le quota MCP sont deux limites indépendantes

## Prochaine leçon

> La prochaine leçon couvre **[Consultation des quotas GitHub Copilot](../copilot-usage/)**.
>
> Vous apprendrez :
> - Comment consulter l'utilisation des Premium Requests
> - Différences de quota mensuel selon le type d'abonnement
> - Méthode d'interprétation des détails d'utilisation des modèles

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer l'emplacement du code source</strong></summary>

> Date de mise à jour :2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Consultation des quotas Zhipu AI | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 213-217 |
| Consultation des quotas Z.ai | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 224-228 |
| Formatage de sortie | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 115-177 |
| Configuration des points de terminaison API | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-76 |
| Définition du type ZhipuAuthData | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 38-41 |
| Seuil d'avertissement d'utilisation élevée | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 110-111 |

**Constantes clés** :
- `HIGH_USAGE_THRESHOLD = 80` : Seuil d'avertissement lorsque le taux d'utilisation dépasse 80% (`types.ts:111`)

**Fonctions clés** :
- `queryZhipuUsage(authData)` : Consulte les quotas du compte Zhipu AI (`zhipu.ts:213-217`)
- `queryZaiUsage(authData)` : Consulte les quotas du compte Z.ai (`zhipu.ts:224-228`)
- `formatZhipuUsage(data, apiKey, accountLabel)` : Formate la sortie de quota (`zhipu.ts:115-177`)
- `fetchUsage(apiKey, config)` : Appelle l'API officielle pour obtenir les données de quota (`zhipu.ts:81-106`)

**Points de terminaison API** :
- Zhipu AI : `https://bigmodel.cn/api/monitor/usage/quota/limit` (`zhipu.ts:63`)
- Z.ai : `https://api.z.ai/api/monitor/usage/quota/limit` (`zhipu.ts:64`)

</details>
