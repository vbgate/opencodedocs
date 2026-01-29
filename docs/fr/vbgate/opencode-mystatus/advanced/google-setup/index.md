---
title: "Google Cloud : Gestion multi-comptes | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Configuration avancée Google Cloud : gestion multi-comptes et de modèles"
description: "Apprenez à configurer plusieurs comptes Google Cloud Antigravity. Gérez le quota des 4 modèles (G3 Pro, G3 Image, G3 Flash, Claude) et comprenez le mappage des ID de projet."
tags:
  - "Google Cloud"
  - "Gestion multi-comptes"
  - "Antigravity"
  - "Mappage de modèles"
prerequisite:
  - "start-quick-start"
order: 1
---

# Configuration avancée Google Cloud : gestion multi-comptes et de modèles

## Ce que vous apprendrez

Configurez plusieurs comptes Google Cloud, visualisez en un clic l'utilisation du quota de tous les comptes, comprenez la relation de mappage des 4 modèles (G3 Pro, G3 Image, G3 Flash, Claude), résolvez les problèmes de quota insuffisant pour un seul compte modèle.

## Concept clé

### Support multi-comptes

opencode-mystatus prend en charge l'interrogation simultanée de plusieurs comptes Google Cloud Antigravity. Chaque compte affiche indépendamment le quota de ses 4 modèles, ce qui vous facilite la gestion de l'allocation du quota pour plusieurs projets.

Les comptes sont stockés dans `~/.config/opencode/antigravity-accounts.json` et sont gérés par le plugin `opencode-antigravity-auth`. Vous devez d'abord installer ce plugin pour ajouter des comptes Google Cloud.

### Relation de mappage des modèles

Google Cloud Antigravity propose plusieurs modèles, le plugin affichera les 4 plus courants :

| Nom affiché | Clé de modèle (principale) | Clé de modèle (alternative) |
| ----------- | -------------------------- | --------------------------- |
| G3 Pro | `gemini-3-pro-high` | `gemini-3-pro-low` |
| G3 Image | `gemini-3-pro-image` | - |
| G3 Flash | `gemini-3-flash` | - |
| Claude | `claude-opus-4-5-thinking` | `claude-opus-4-5` |

**Pourquoi y a-t-il une clé alternative ?**

Certains modèles ont deux versions (high/low), le plugin affichera en priorité les données de la clé principale, si la clé principale n'a pas d'informations de quota, il utilisera automatiquement les données de la clé alternative.

### Utilisation de l'ID de projet

L'interrogation du quota nécessite de fournir un ID de projet, le plugin utilisera en priorité `projectId`, s'il n'existe pas, il utilisera `managedProjectId`. Ces deux ID peuvent être configurés lors de l'ajout du compte.

## 🎒 Avant de commencer

::: warning Conditions préalables
Assurez-vous que vous avez :
- [x] Complété le tutoriel de démarrage rapide ([Quick Start](/fr/vbgate/opencode-mystatus/start/quick-start/))
- [x] Installé le plugin opencode-mystatus
- [x] Installé le plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)
:::

## Suivez les étapes

### Étape 1 : Ajouter le premier compte Google Cloud

**Pourquoi**
Le premier compte est la base, une fois ajouté avec succès, vous pouvez tester l'interrogation multi-comptes.

Utilisez le plugin `opencode-antigravity-auth` pour ajouter un compte. Supposons que vous ayez déjà installé ce plugin :

```bash
# Laissez l'IA vous aider à installer (recommandé)
# Dans Claude/OpenCode, entrez :
Install the opencode-antigravity-auth plugin from: https://github.com/NoeFabris/opencode-antigravity-auth
```

Une fois l'installation terminée, suivez la documentation de ce plugin pour compléter l'authentification OAuth Google.

**Ce que vous devriez voir** :
- Les informations du compte ont été sauvegardées dans `~/.config/opencode/antigravity-accounts.json`
- Le contenu du fichier est similaire à :
  ```json
  {
    "version": 1,
    "accounts": [
      {
        "email": "user1@gmail.com",
        "refreshToken": "1//...",
        "projectId": "my-project-123",
        "managedProjectId": "managed-project-456",
        "addedAt": 1737600000000,
        "lastUsed": 1737600000000
      }
    ]
  }
  ```

### Étape 2 : Interroger le quota Google Cloud

**Pourquoi**
Vérifiez que la configuration du premier compte est correcte et consultez la situation du quota des 4 modèles.

```bash
/mystatus
```

**Ce que vous devriez voir** :

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### Étape 3 : Ajouter un deuxième compte Google Cloud

**Pourquoi**
Lorsque vous avez plusieurs comptes Google Cloud, vous pouvez gérer simultanément l'allocation du quota pour plusieurs projets.

Répétez le processus de l'étape 1, connectez-vous avec un autre compte Google.

Une fois l'ajout terminé, le fichier `antigravity-accounts.json` deviendra :

```json
{
  "version": 1,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//...",
      "projectId": "my-project-123",
      "addedAt": 1737600000000,
      "lastUsed": 1737600000000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "2//...",
      "projectId": "another-project-456",
      "addedAt": 1737700000000,
      "lastUsed": 1737700000000
    }
  ]
}
```

### Étape 4 : Voir le quota multi-comptes

**Pourquoi**
Vérifiez que le quota des deux comptes s'affiche correctement, ce qui vous aide à planifier l'utilisation de chaque compte.

```bash
/mystatus
```

**Ce que vous devriez voir** :

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### user2@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 65%
G3 Image   2h 30m     ██████████░░░░░░░░░ 50%
G3 Flash   2h 30m     ██████████████░░░░░░ 80%
Claude     1d 5h      ████████░░░░░░░░░░░ 35%
```

## Pièges courants

### Compte non affiché

**Problème** : Le compte a été ajouté, mais `mystatus` ne l'affiche pas.

**Cause** : Le compte n'a pas de champ email. Le plugin filtrera les comptes sans `email` (voir le code source `google.ts:318`).

**Solution** : Assurez-vous que chaque compte dans `antigravity-accounts.json` a un champ `email`.

### ID de projet manquant

**Problème** : Affiche l'erreur "No project ID found".

**Cause** : La configuration du compte n'a ni `projectId` ni `managedProjectId`.

**Solution** : Lors de la ré-ajout du compte, assurez-vous de remplir l'ID de projet.

### Données de modèle vides

**Problème** : Un modèle affiche 0% ou n'a pas de données.

**Cause** :
1. Le compte n'a pas utilisé ce modèle
2. Les informations de quota du modèle n'ont pas été renvoyées (certains modèles peuvent nécessiter des autorisations spéciales)

**Solution** :
- C'est normal, tant que le compte a des données de quota
- Si tous les modèles sont à 0%, vérifiez si les autorisations du compte sont correctes

## Résumé de cette leçon

- L'installation du plugin `opencode-antigravity-auth` est une condition préalable pour utiliser l'interrogation du quota Google Cloud
- Prend en charge l'interrogation simultanée multi-comptes, chaque compte affiche indépendamment le quota des 4 modèles
- Relation de mappage des modèles : G3 Pro (supporte high/low), G3 Image, G3 Flash, Claude (supporte thinking/normal)
- Le plugin utilise en priorité `projectId`, s'il n'existe pas, utilise `managedProjectId`
- Les comptes doivent inclure un champ `email` pour être interrogés

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Configuration de l'authentification GitHub Copilot](/fr/vbgate/opencode-mystatus/advanced/copilot-auth/)**.
>
> Vous apprendrez :
> - Deux méthodes d'authentification Copilot : Jeton OAuth et Fine-grained PAT
> - Comment résoudre les problèmes d'autorisation Copilot
> - Différences de quota pour différents types d'abonnement

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| Mappage de configuration des modèles | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 69-78 |
| Interrogation parallèle multi-comptes | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 327-334 |
| Filtrage des comptes (doit avoir un email) | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 318 |
| Priorité de l'ID de projet | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 231 |
| Extraction du quota de modèle | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 132-157 |
| Définition de type AntigravityAccount | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 78-86 |

**Constantes clés** :
- `MODELS_TO_DISPLAY` : Configuration des 4 modèles (clé, altKey, display)
- `GOOGLE_QUOTA_API_URL` : Adresse de l'API de quota Google Cloud
- `USER_AGENT` : User-Agent de la demande (antigravity/1.11.9)

**Fonctions clés** :
- `queryGoogleUsage()` : Interroge le quota de tous les comptes Google Cloud
- `fetchAccountQuota()` : Interroge le quota d'un seul compte (inclut le rafraîchissement du jeton)
- `extractModelQuotas()` : Extrait les informations de quota des 4 modèles à partir de la réponse de l'API
- `formatAccountQuota()` : Formate la sortie du quota d'un seul compte

</details>
