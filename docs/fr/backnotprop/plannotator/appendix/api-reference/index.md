---
title: "Référence API : Documentation des interfaces locales | plannotator"
sidebarTitle: "Référence API"
subtitle: "Référence API : Documentation des interfaces locales | plannotator"
description: "Découvrez tous les endpoints API fournis par Plannotator ainsi que les formats de requête/réponse. Documentation complète des interfaces de revue de plan, revue de code et téléchargement d'images pour faciliter l'intégration."
tags:
  - "API"
  - "Annexe"
prerequisite:
  - "start-getting-started"
order: 1
---

# Référence API Plannotator

## Ce que vous apprendrez

- Découvrir tous les endpoints API fournis par le serveur local Plannotator
- Consulter les formats de requête et de réponse de chaque API
- Comprendre les différences entre les interfaces de revue de plan et de revue de code
- Disposer d'une référence pour l'intégration ou le développement d'extensions

## Vue d'ensemble

Plannotator exécute un serveur HTTP local (utilisant Bun.serve) qui fournit des API RESTful pour la revue de plan et la revue de code. Toutes les réponses API sont au format JSON, sans authentification requise (environnement local isolé).

**Modes de démarrage du serveur** :
- Port aléatoire (mode local)
- Port fixe 19432 (mode distant/Devcontainer, configurable via `PLANNOTATOR_PORT`)

**URL de base de l'API** : `http://localhost:<PORT>/api/`

::: tip Conseil
Les API suivantes sont classées par module fonctionnel. Le comportement d'un même chemin peut différer entre les serveurs de revue de plan et de revue de code.
:::

## API de revue de plan

### GET /api/plan

Récupère le contenu du plan actuel et les métadonnées associées.

**Requête** : Aucune

**Exemple de réponse** :

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| Champ | Type | Description |
| --- | --- | --- |
| `plan` | string | Contenu Markdown du plan |
| `origin` | string | Identifiant de source (`"claude-code"` ou `"opencode"`) |
| `permissionMode` | string | Mode de permission actuel (spécifique à Claude Code) |
| `sharingEnabled` | boolean | Partage par URL activé |

---

### POST /api/approve

Approuve le plan actuel, avec option de sauvegarde dans une application de notes.

**Corps de la requête** :

```json
{
  "obsidian": {
    "vaultPath": "/Users/xxx/Documents/Obsidian",
    "folder": "Plans",
    "tags": ["plannotator"],
    "plan": "Plan content..."
  },
  "bear": {
    "plan": "Plan content..."
  },
  "feedback": "Remarque lors de l'approbation (OpenCode uniquement)",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Exemple de réponse** :

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**Description des champs** :

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `obsidian` | object | Non | Configuration de sauvegarde Obsidian |
| `bear` | object | Non | Configuration de sauvegarde Bear |
| `feedback` | string | Non | Remarque accompagnant l'approbation (OpenCode uniquement) |
| `agentSwitch` | string | Non | Nom de l'Agent vers lequel basculer (OpenCode uniquement) |
| `permissionMode` | string | Non | Mode de permission demandé (Claude Code uniquement) |
| `planSave` | object | Non | Configuration de sauvegarde du plan |

**Champs de configuration Obsidian** :

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `vaultPath` | string | Oui | Chemin du fichier Vault |
| `folder` | string | Non | Dossier cible (racine par défaut) |
| `tags` | string[] | Non | Tags générés automatiquement |
| `plan` | string | Oui | Contenu du plan |

---

### POST /api/deny

Rejette le plan actuel et fournit un retour.

**Corps de la requête** :

```json
{
  "feedback": "Des tests unitaires supplémentaires sont nécessaires",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Exemple de réponse** :

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**Description des champs** :

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `feedback` | string | Non | Motif du rejet (par défaut "Plan rejected by user") |
| `planSave` | object | Non | Configuration de sauvegarde du plan |

---

### GET /api/obsidian/vaults

Détecte les vaults Obsidian configurés localement.

**Requête** : Aucune

**Exemple de réponse** :

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**Chemin du fichier de configuration** :
- macOS : `~/Library/Application Support/obsidian/obsidian.json`
- Windows : `%APPDATA%\obsidian\obsidian.json`
- Linux : `~/.config/obsidian/obsidian.json`

---

## API de revue de code

### GET /api/diff

Récupère le contenu du git diff actuel.

**Requête** : Aucune

**Exemple de réponse** :

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "HEAD",
  "origin": "opencode",
  "diffType": "uncommitted",
  "gitContext": {
    "currentBranch": "feature/auth",
    "defaultBranch": "main",
    "diffOptions": [
      { "id": "uncommitted", "label": "Uncommitted changes" },
      { "id": "last-commit", "label": "Last commit" },
      { "id": "branch", "label": "vs main" }
    ]
  },
  "sharingEnabled": true
}
```

| Champ | Type | Description |
| --- | --- | --- |
| `rawPatch` | string | Patch au format unifié Git diff |
| `gitRef` | string | Référence Git utilisée |
| `origin` | string | Identifiant de source |
| `diffType` | string | Type de diff actuel |
| `gitContext` | object | Informations de contexte Git |
| `sharingEnabled` | boolean | Partage par URL activé |

**Description des champs gitContext** :

| Champ | Type | Description |
| --- | --- | --- |
| `currentBranch` | string | Nom de la branche actuelle |
| `defaultBranch` | string | Nom de la branche par défaut (main ou master) |
| `diffOptions` | object[] | Options de types de diff disponibles (contient id et label) |

---

### POST /api/diff/switch

Bascule vers un type de git diff différent.

**Corps de la requête** :

```json
{
  "diffType": "staged"
}
```

**Types de diff supportés** :

| Type | Commande Git | Description |
| --- | --- | --- |
| `uncommitted` | `git diff HEAD` | Modifications non commitées (par défaut) |
| `staged` | `git diff --staged` | Modifications indexées |
| `last-commit` | `git diff HEAD~1..HEAD` | Dernier commit |
| `vs main` | `git diff main..HEAD` | Branche actuelle vs main |

**Exemple de réponse** :

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

Soumet un retour de revue de code à l'Agent IA.

**Corps de la requête** :

```json
{
  "feedback": "Suggère d'ajouter une logique de gestion des erreurs",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "Un try-catch devrait être utilisé ici",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**Description des champs** :

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `feedback` | string | Non | Retour textuel (LGTM ou autre) |
| `annotations` | array | Non | Tableau d'annotations structurées |
| `agentSwitch` | string | Non | Nom de l'Agent vers lequel basculer (OpenCode uniquement) |

**Champs de l'objet annotation** :

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | string | Oui | Identifiant unique |
| `type` | string | Oui | Type : `comment`, `suggestion`, `concern` |
| `filePath` | string | Oui | Chemin du fichier |
| `lineStart` | number | Oui | Numéro de ligne de début |
| `lineEnd` | number | Oui | Numéro de ligne de fin |
| `side` | string | Oui | Côté : `"old"` ou `"new"` |
| `text` | string | Non | Contenu du commentaire |
| `suggestedCode` | string | Non | Code suggéré (type suggestion) |

**Exemple de réponse** :

```json
{
  "ok": true
}
```

---

## API partagées

### GET /api/image

Récupère une image (chemin de fichier local ou fichier temporaire téléchargé).

**Paramètres de requête** :

| Paramètre | Type | Requis | Description |
| --- | --- | --- | --- |
| `path` | string | Oui | Chemin du fichier image |

**Exemple de requête** : `GET /api/image?path=/tmp/plannotator/abc-123.png`

**Réponse** : Fichier image (PNG/JPEG/WebP)

**Réponses d'erreur** :
- `400` - Paramètre path manquant
- `404` - Fichier inexistant
- `500` - Échec de lecture du fichier

---

### POST /api/upload

Télécharge une image vers le répertoire temporaire et retourne un chemin accessible.

**Requête** : `multipart/form-data`

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `file` | File | Oui | Fichier image |

**Formats supportés** : PNG, JPEG, WebP

**Exemple de réponse** :

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**Réponses d'erreur** :
- `400` - Aucun fichier fourni
- `500` - Échec du téléchargement

::: info Remarque
Les images téléchargées sont sauvegardées dans le répertoire `/tmp/plannotator` et ne sont pas automatiquement nettoyées à l'arrêt du serveur.
:::

---

### GET /api/agents

Récupère la liste des Agents OpenCode disponibles (OpenCode uniquement).

**Requête** : Aucune

**Exemple de réponse** :

```json
{
  "agents": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable model for complex tasks"
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "description": "Fast and efficient multimodal model"
    }
  ]
}
```

**Règles de filtrage** :
- Retourne uniquement les agents avec `mode === "primary"`
- Exclut les agents avec `hidden === true`

**Réponse d'erreur** :

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## Gestion des erreurs

### Codes de statut HTTP

| Code | Description |
| --- | --- |
| `200` | Requête réussie |
| `400` | Échec de validation des paramètres |
| `404` | Ressource inexistante |
| `500` | Erreur interne du serveur |

### Format des réponses d'erreur

```json
{
  "error": "Message de description de l'erreur"
}
```

### Erreurs courantes

| Erreur | Condition de déclenchement |
| --- | --- |
| `Missing path parameter` | Paramètre `path` manquant pour `/api/image` |
| `File not found` | Fichier spécifié inexistant pour `/api/image` |
| `No file provided` | Aucun fichier téléchargé pour `/api/upload` |
| `Missing diffType` | Champ `diffType` manquant pour `/api/diff/switch` |
| `Port ${PORT} in use` | Port déjà utilisé (échec du démarrage du serveur) |

---

## Comportement du serveur

### Mécanisme de réessai de port

- Nombre maximum de tentatives : 5
- Délai entre les tentatives : 500 millisecondes
- Erreur de timeout : `Port ${PORT} in use after 5 retries`

::: warning Avertissement pour le mode distant
En mode distant/Devcontainer, si le port est occupé, vous pouvez utiliser un autre port en définissant la variable d'environnement `PLANNOTATOR_PORT`.
:::

### Attente de décision

Après le démarrage, le serveur entre en état d'attente de décision utilisateur :

**Serveur de revue de plan** :
- Attend un appel à `/api/approve` ou `/api/deny`
- Retourne la décision et arrête le serveur après l'appel

**Serveur de revue de code** :
- Attend un appel à `/api/feedback`
- Retourne le retour et arrête le serveur après l'appel

### Fallback SPA

Tous les chemins non correspondants retournent le HTML embarqué (application monopage) :

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

Cela garantit le bon fonctionnement du routage frontend.

---

## Variables d'environnement

| Variable | Description | Valeur par défaut |
| --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Active le mode distant | Non défini |
| `PLANNOTATOR_PORT` | Numéro de port fixe | Aléatoire (local) / 19432 (distant) |
| `PLANNOTATOR_ORIGIN` | Identifiant de source | `"claude-code"` ou `"opencode"` |
| `PLANNOTATOR_SHARE` | Désactive le partage par URL | Non défini (activé) |

::: tip Conseil
Pour plus de détails sur la configuration des variables d'environnement, consultez la section [Configuration des variables d'environnement](../../advanced/environment-variables/).
:::

---

## Résumé

Plannotator fournit une API HTTP locale complète supportant deux fonctionnalités principales : la revue de plan et la revue de code :

- **API de revue de plan** : Récupération du plan, décisions d'approbation/rejet, intégration Obsidian/Bear
- **API de revue de code** : Récupération du diff, changement de type de diff, soumission de retours structurés
- **API partagées** : Téléchargement d'images, requête de liste d'Agents
- **Gestion des erreurs** : Codes de statut HTTP et formats d'erreur unifiés

Toutes les API s'exécutent localement, sans téléchargement de données, garantissant sécurité et fiabilité.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Point d'entrée du serveur de revue de plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents (revue de plan) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| Point d'entrée du serveur de revue de code | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents (revue de code) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**Constantes clés** :
- `MAX_RETRIES = 5` : Nombre maximum de tentatives de démarrage du serveur (`packages/server/index.ts:79`, `packages/server/review.ts:68`)
- `RETRY_DELAY_MS = 500` : Délai de réessai de port (`packages/server/index.ts:80`, `packages/server/review.ts:69`)

**Fonctions clés** :
- `startPlannotatorServer(options)` : Démarre le serveur de revue de plan (`packages/server/index.ts:91`)
- `startReviewServer(options)` : Démarre le serveur de revue de code (`packages/server/review.ts:79`)

</details>
