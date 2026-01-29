---
title: "Comprendre la sortie : barres et quotas | opencode-mystatus"
sidebarTitle: "Comprendre la sortie"
subtitle: "Comprendre la sortie : barres de progression, temps de réinitialisation et multi-comptes"
description: "Apprenez à interpréter la sortie d'opencode-mystatus : signification des barres de progression, temps de réinitialisation et différences de quotas entre OpenAI, Zhipu AI, Copilot et Google Cloud."
tags:
  - "format-de-sortie"
  - "barre-de-progression"
  - "temps-de-reinitialisation"
  - "multi-comptes"
prerequisite:
  - "start-quick-start"
order: 3
---

# Comprendre la sortie : barres de progression, temps de réinitialisation et multi-comptes

## Ce que vous saurez faire à la fin

- Comprendre chaque information affichée dans la sortie mystatus
- Comprendre la signification de l'affichage des barres de progression (plein vs vide)
- Connaître les cycles de limite de différentes plateformes (3 heures, 5 heures, mensuel)
- Identifier les différences de quota entre plusieurs comptes

## Votre situation actuelle

Vous avez exécuté `/mystatus` et voyez une série de barres de progression, pourcentages, compteurs à rebours, mais vous ne comprenez pas :

- La barre de progression est-elle bonne quand elle est pleine ou vide ?
- Que signifie "Resets in: 2h 30m" ?
- Pourquoi certaines plateformes affichent deux barres de progression, d'autres une seule ?
- Pourquoi Google Cloud a-t-il plusieurs comptes ?

Cette leçon vous aidera à décortiquer ces informations une par une.

## Approche principale

La sortie de mystatus a un format unifié, mais des différences selon les plateformes :

**Éléments unifiés** :
- Barre de progression : `█` (plein) = restant, `░` (vide) = utilisé
- Pourcentage : pourcentage restant calculé sur la base de l'utilisation
- Temps de réinitialisation : compte à rebours jusqu'au prochain renouvellement du quota

**Différences de plateforme** :
| Plateforme | Cycle de limite | Caractéristiques |
|--- | --- | ---|
| OpenAI | 3h / 24h | Peut afficher deux fenêtres |
| Zhipu AI / Z.ai | Limite de token 5h / Quota mensuel MCP | Deux types de limites différents |
| GitHub Copilot | Mensuel | Affiche des valeurs spécifiques (229/300) |
| Google Cloud | Par modèle | Chaque compte affiche 4 modèles |

## Analyse de la structure de sortie

### Exemple de sortie complet

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
████████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

## GitHub Copilot Account Quota

Account:        GitHub Copilot (individual)

Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)

## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

### Signification de chaque partie

#### 1. Ligne d'informations de compte

```
Account:        user@example.com (team)
```

- **OpenAI / Copilot** : Affiche l'email + type d'abonnement
- **Zhipu AI / Z.ai** : Affiche la clé API masquée + type de compte (Coding Plan)
- **Google Cloud** : Affiche l'email, plusieurs comptes séparés par `###`

#### 2. Barre de progression

```
███████████████████████████ 85% remaining
```

- `█` (bloc plein) : **Restant**
- `░` (bloc vide) : **Utilisé**
- **Pourcentage** : Pourcentage restant (plus c'est élevé, mieux c'est)

::: tip Mnémotechnique
Plus les blocs pleins sont nombreux, plus le reste est important → Continuez à utiliser avec confiance
Plus les blocs vides sont nombreux, plus l'utilisation est importante → Économisez un peu
:::

#### 3. Compte à rebours de réinitialisation

```
Resets in: 2h 30m
```

Indique le temps restant jusqu'au prochain renouvellement du quota.

**Cycle de réinitialisation** :
- **OpenAI** : Fenêtre de 3h / Fenêtre de 24h
- **Zhipu AI / Z.ai** : Limite de token 5h / Quota mensuel MCP
- **GitHub Copilot** : Mensuel (affiche la date spécifique)
- **Google Cloud** : Chaque modèle a un temps de réinitialisation indépendant

#### 4. Détails des valeurs (certaines plateformes)

Zhipu AI et Copilot affichent des valeurs spécifiques :

```
Used: 0.5M / 10.0M              # Zhipu AI : utilisé / total (unité : millions de tokens)
Premium        24% (229/300)     # Copilot : pourcentage restant (utilisé / quota total)
```

## Détails des différences de plateforme

### OpenAI : Double limite de fenêtre

OpenAI peut afficher deux barres de progression :

```
3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
████████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m
```

- **3-hour limit** : Fenêtre glissante de 3h, adaptée à une utilisation à haute fréquence
- **24-hour limit** : Fenêtre glissante de 24h, adaptée à une planification à long terme

**Comptes Team** :
- Ont deux limites de fenêtre : principale et secondaire
- Différents membres partagent le même quota Team

**Comptes personnels** (Plus) :
- Affichent généralement uniquement la fenêtre de 3h

### Zhipu AI / Z.ai : Deux types de limites

```
5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

MCP limit
███████████████████████████ 100% remaining
Used: 0 / 1000
```

- **5-hour token limit** : Limite d'utilisation de tokens sur 5h
- **MCP limit** : Quota mensuel MCP (Model Context Protocol), pour la fonction de recherche

::: warning
Le quota MCP est mensuel, le temps de réinitialisation est long. S'il est affiché comme plein, vous devrez attendre le mois prochain pour récupérer.
:::

### GitHub Copilot : Quota mensuel

```
Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)
```

- **Premium Requests** : Utilisation des fonctionnalités Premium de Copilot
- Affiche des valeurs spécifiques (utilisé / quota total)
- Réinitialisation mensuelle, affiche la date spécifique

**Différences selon le type d'abonnement** :
| Type d'abonnement | Quota mensuel | Description |
|--- | --- | ---|
| Free | N/A | Pas de limite de quota, mais fonctionnalités limitées |
| Pro | 300 | Version personnelle standard |
| Pro+ | Plus élevé | Version mise à jour |
| Business | Plus élevé | Version entreprise |
| Enterprise | Illimité | Version entreprise |

### Google Cloud : Multi-comptes + Multi-modèles

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

**Format** : `[Nom du modèle] | [Temps de réinitialisation] | [Barre de progression + Pourcentage]`

**Explication des 4 modèles** :
| Nom du modèle | Clé API correspondante | Utilisation |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Inférence avancée |
| G3 Image | `gemini-3-pro-image` | Génération d'images |
| G3 Flash | `gemini-3-flash` | Génération rapide |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Modèle Claude |

**Affichage multi-comptes** :
- Chaque compte Google est séparé par `###`
- Chaque compte affiche ses 4 modèles de quota
- Permet de comparer l'utilisation de quota de différents comptes

## Pièges à éviter

### Malentendus courants

| Malentendu | Fait |
|--- | ---|
| Barre de progression toute pleine = pas utilisé | Blocs pleins = **plus de reste**, continuez à utiliser |
| Temps de réinitialisation court = quota presque épuisé | Temps de réinitialisation court = va bientôt se réinitialiser, continuez à utiliser |
| Pourcentage 100% = tout utilisé | Pourcentage 100% = **tout reste** |
| Zhipu AI n'affiche qu'une seule limite | En réalité il y a deux types de limites : TOKENS_LIMIT et TIME_LIMIT |

### Que faire si le quota est épuisé ?

Si la barre de progression est toute vide (0% remaining) :

1. **Limites à court terme** (ex : 3h, 5h) : Attendez que le compte à rebours de réinitialisation soit terminé
2. **Limites mensuelles** (ex : Copilot, MCP) : Attendez le début du mois prochain
3. **Multi-comptes** : Basculez vers un autre compte (Google Cloud prend en charge plusieurs comptes)

::: info
mystatus est un **outil en lecture seule**, il ne consomme pas votre quota et ne déclenche aucun appel API.
:::

## Résumé de la leçon

- **Barre de progression** : Plein `█` = restant, Vide `░` = utilisé
- **Temps de réinitialisation** : Compte à rebours jusqu'au prochain renouvellement du quota
- **Différences de plateforme** : Différentes plateformes ont des cycles de limite différents (3h/5h/mensuel)
- **Multi-comptes** : Google Cloud affiche plusieurs comptes, facilitant la gestion des quotas

## Prochaine leçon

> La prochaine leçon couvre **[Quota OpenAI](../../platforms/openai-usage/)**.
>
> Vous apprendrez :
> - Différences entre les limites de 3h et 24h d'OpenAI
> - Mécanisme de partage de quota pour les comptes Team
> - Comment analyser le jeton JWT pour obtenir les informations du compte

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer l'emplacement du code source</strong></summary>

> Date de mise à jour :2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Génération des barres de progression | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L40-L53) | 40-53 |
| Formatage du temps | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L18-L29) | 18-29 |
| Calcul du pourcentage restant | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L63-L65) | 63-65 |
| Formatage des quantités de token | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L70-L72) | 70-72 |
| Formatage de sortie OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| Formatage de sortie Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L115-L177) | 115-177 |
| Formatage de sortie Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L395-L447) | 395-447 |
| Formatage de sortie Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |

**Fonctions clés** :
- `createProgressBar(percent, width)` : Génère une barre de progression, les blocs pleins représentent le reste
- `formatDuration(seconds)` : Convertit les secondes en format lisible par l'humain (ex : "2h 30m")
- `calcRemainPercent(usedPercent)` : Calcule le pourcentage restant (100 - pourcentage utilisé)
- `formatTokens(tokens)` : Formate la quantité de tokens en millions (ex : "0.5M")

**Constantes clés** :
- Largeur par défaut de la barre de progression : 30 caractères (Google Cloud utilise 20 caractères pour les modèles)
- Caractères de la barre de progression : `█` (plein), `░` (vide)

</details>
