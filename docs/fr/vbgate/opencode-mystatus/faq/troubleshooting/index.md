---
title: "Dépannage: Erreurs courantes | opencode-mystatus"
sidebarTitle: "Dépannage"
subtitle: "Questions fréquentes : impossibilité d'interroger le quota, jeton expiré, problèmes d'autorisation"
description: "Résolvez les problèmes courants de mystatus : jetons expirés, erreurs API, autorisations. Solutions détaillées pour OpenAI, Copilot et Google Cloud."
tags:
  - "dépannage"
  - "questions fréquentes"
  - "expiration du jeton"
  - "problèmes d'autorisation"
prerequisite:
  - "start-quick-start"
order: 1
---

# Questions fréquentes : impossibilité d'interroger le quota, jeton expiré, problèmes d'autorisation

Lors de l'utilisation du plugin opencode-mystatus, vous pouvez rencontrer diverses erreurs : impossibilité de lire les fichiers d'authentification, jeton OAuth expiré, autorisations insuffisantes GitHub Copilot, échecs de demande API, etc. Ces problèmes courants peuvent généralement être résolus par une simple configuration ou une réautorisation. Ce tutoriel compile toutes les étapes de dépannage des erreurs courantes, vous aidant à localiser rapidement la cause racine.

## Ce que vous apprendrez

- Localiser rapidement la cause de l'échec de l'interrogation mystatus
- Résoudre les problèmes d'expiration de jeton OpenAI
- Configurer le PAT Fine-grained pour GitHub Copilot
- Gérer l'absence de project_id Google Cloud
- Faire face à divers échecs et délais d'attente de demande API

## Votre problème actuel

Vous exécutez `/mystatus` pour interroger le quota, mais voyez divers messages d'erreur, ne sachant pas par où commencer le dépannage.

## Quand utiliser cette méthode

- **Lorsque vous voyez un message d'erreur** : Ce tutoriel couvre toutes les erreurs courantes
- **Lors de la configuration d'un nouveau compte** : Vérifier que la configuration est correcte
- **Lors de l'échec soudain de l'interrogation de quota** : Il peut s'agir d'un jeton expiré ou d'un changement d'autorisations

::: tip Principe de dépannage

Face à une erreur, regardez d'abord les mots-clés du message d'erreur, puis correspondez-les à la solution de ce tutoriel. La plupart des erreurs ont des messages d'invite clairs.

:::

## Concept clé

Le mécanisme de gestion des erreurs de mystatus est divisé en trois couches :

1. **Couche de lecture des fichiers d'authentification** : Vérifie si `auth.json` existe et si le format est correct
2. **Couche d'interrogation de plateforme** : Chaque plateforme interroge indépendamment, l'échec d'une n'affecte pas les autres
3. **Couche de demande API** : Les demandes réseau peuvent expirer ou renvoyer des erreurs, mais l'outil continuera à essayer d'autres plateformes

Cela signifie que :
- Si une plateforme échoue, les autres s'afficheront normalement
- Le message d'erreur indiquera clairement quelle plateforme a un problème
- La plupart des erreurs peuvent être résolues par configuration ou réautorisation

## Liste de vérification des problèmes

### Problème 1 : Impossible de lire le fichier d'authentification

**Message d'erreur** :

```
❌ Impossible de lire le fichier d'authentification : ~/.local/share/opencode/auth.json
Erreur : ENOENT: no such file or directory
```

**Cause** :
- Le fichier d'authentification OpenCode n'existe pas
- Aucun compte de plateforme n'a encore été configuré

**Solution** :

1. **Confirmer qu'OpenCode est installé et configuré**
   - Confirmez que vous avez configuré au moins une plateforme (OpenAI, Zhipu AI, etc.) dans OpenCode
   - Sinon, complétez d'abord l'autorisation dans OpenCode

2. **Vérifier le chemin du fichier**
   - Le fichier d'authentification OpenCode devrait être à `~/.local/share/opencode/auth.json`
   - Si vous utilisez un répertoire de configuration personnalisé, confirmez que le chemin du fichier est correct

3. **Vérifier le format du fichier**
   - Confirmez que `auth.json` est un fichier JSON valide
   - Le contenu du fichier devrait inclure au moins les informations d'authentification d'une plateforme

**Ce que vous devriez voir** :
Après avoir réexécuté `/mystatus`, vous devriez pouvoir voir les informations de quota d'au moins une plateforme.

---

### Problème 2 : Aucun compte configuré trouvé

**Message d'erreur** :

```
Aucun compte configuré n'a été trouvé.

Types de comptes pris en charge :
- OpenAI (utilisateurs d'abonnement Plus/Team/Pro)
- Zhipu AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

**Cause** :
- `auth.json` existe, mais ne contient aucune configuration valide
- La configuration existante a un format incorrect (par exemple, manque de champs requis)

**Solution** :

1. **Vérifier le contenu de auth.json**
   Ouvrez `~/.local/share/opencode/auth.json`, confirmez qu'il y a au moins une configuration de plateforme :

   ```json
   {
     "openai": {
       "type": "oauth",
       "access": "eyJ...",
       "expires": 1738000000000
     }
   }
   ```

2. **Configurer au moins une plateforme**
   - Complétez l'autorisation OAuth dans OpenCode
   - Ou ajoutez manuellement la clé API de la plateforme (Zhipu AI, Z.ai)

3. **Référence de format de configuration**
   Exigences de configuration pour chaque plateforme :
   - OpenAI : doit avoir `type: "oauth"` et `access` token
   - Zhipu AI / Z.ai : doit avoir `type: "api"` et `key`
   - GitHub Copilot : doit avoir `type: "oauth"` et `refresh` token
   - Google Cloud : ne dépend pas de `auth.json`, nécessite une configuration séparée (voir problème 6)

---

### Problème 3 : Jeton OAuth OpenAI expiré

**Message d'erreur** :

```
⚠️ L'autorisation OAuth a expiré, veuillez utiliser une fois le modèle OpenAI dans OpenCode pour rafraîchir l'autorisation.
```

**Cause** :
- Le jeton OAuth OpenAI a une durée de validité limitée, après expiration le quota ne peut pas être interrogé
- L'heure d'expiration du jeton est stockée dans le champ `expires` de `auth.json`

**Solution** :

1. **Utiliser une fois le modèle OpenAI dans OpenCode**
   - Posez une question à ChatGPT ou Codex
   - OpenCode rafraîchira automatiquement le jeton et mettra à jour `auth.json`

2. **Confirmer que le jeton a été mis à jour**
   - Consultez le champ `expires` dans `auth.json`
   - Confirmez qu'il s'agit d'un horodatage futur

3. **Réexécuter /mystatus**
   - Maintenant, vous devriez pouvoir interroger normalement le quota OpenAI

**Pourquoi utiliser à nouveau le modèle est nécessaire** :
Le jeton OAuth OpenAI a un mécanisme d'expiration, l'utilisation du modèle déclenche le rafraîchissement du jeton. C'est une caractéristique de sécurité du processus d'authentification officielle OpenCode.

---

### Problème 4 : Échec de la demande API (générique)

**Message d'erreur** :

```
Échec de la demande API OpenAI (401) : Non autorisé
Échec de la demande API Zhipu (403) : Interdit
Échec de la demande API Google (500) : Erreur interne du serveur
```

**Cause** :
- Jeton ou clé API invalide
- Problème de connexion réseau
- Service API temporairement indisponible
- Autorisations insuffisantes (certaines plateformes nécessitent des autorisations spécifiques)

**Solution** :

1. **Vérifier le jeton ou la clé API**
   - OpenAI : confirmez que le `access` token n'est pas expiré (voir problème 3)
   - Zhipu AI / Z.ai : confirmez que `key` est correct, sans espaces supplémentaires
   - GitHub Copilot : confirmez que le `refresh` token est valide

2. **Vérifier la connexion réseau**
   - Confirmez que le réseau fonctionne
   - Certaines plateformes peuvent avoir des restrictions régionales (comme Google Cloud)

3. **Essayer de réautoriser**
   - Réautorisez OAuth dans OpenCode
   - Ou mettez à jour manuellement la clé API

4. **Vérifier le code d'état HTTP spécifique**
   - `401` / `403` : Problème d'autorisation, généralement le jeton ou la clé API invalide
   - `500` / `503` : Erreur serveur, généralement l'API temporairement indisponible, réessayez plus tard
   - `429` : Demandes trop fréquentes, attendez un certain temps

---

### Problème 5 : Délai d'attente de la demande

**Message d'erreur** :

```
Délai d'attente de la demande (10 secondes)
```

**Cause** :
- Connexion réseau lente
- Temps de réponse API trop long
- Pare-feu ou proxy bloquant la demande

**Solution** :

1. **Vérifier la connexion réseau**
   - Confirmez que le réseau est stable
   - Essayez de visiter le site web de la plateforme, confirmez que l'accès est normal

2. **Vérifier les paramètres du proxy**
   - Si vous utilisez un proxy, confirmez que la configuration du proxy est correcte
   - Certaines plateformes peuvent nécessiter une configuration de proxy spéciale

3. **Réessayer une fois**
   - Il peut s'agir simplement de fluctuations temporaires du réseau
   - Réessayer une fois résout généralement le problème

---

### Problème 6 : Interrogation de quota GitHub Copilot indisponible

**Message d'erreur** :

```
⚠️ L'interrogation de quota GitHub Copilot est temporairement indisponible.
La nouvelle intégration OAuth d'OpenCode ne prend pas en charge l'accès à l'API de quota.

Solution :
1. Créez un fine-grained PAT (visitez https://github.com/settings/tokens?type=beta)
2. Définissez 'Plan' sur 'Read-only' dans 'Account permissions'
3. Créez un fichier de configuration et remplissez le contenu suivant (y compris le champ requis `tier`) :
   ```json
   {
     "token": "github_pat_xxx...",
     "username": "votre_nom_utilisateur",
     "tier": "pro"
   }
   ```

Autres méthodes :
• Cliquez sur l'icône Copilot dans la barre d'état de VS Code pour voir le quota
• Visitez https://github.com/settings/billing pour voir l'utilisation
```

**Cause** :
- L'intégration OAuth officielle d'OpenCode utilise un nouveau processus d'authentification
- Le nouveau jeton OAuth n'a pas d'autorisation `copilot`, ne peut pas appeler l'API de quota interne
- C'est une restriction de sécurité officielle d'OpenCode

**Solution** (recommandée) :

1. **Créer un Fine-grained PAT**
   - Visitez https://github.com/settings/tokens?type=beta
   - Cliquez sur "Generate new token" → "Fine-grained token"
   - Remplissez le nom du jeton (comme "OpenCode Copilot Quota")

2. **Configurer les autorisations**
   - Dans "Account permissions", trouvez l'autorisation "Plan"
   - Définissez sur "Read-only"
   - Cliquez sur "Generate token"

3. **Créer le fichier de configuration**
   Créez `~/.config/opencode/copilot-quota-token.json` :

   ```json
   {
     "token": "github_pat_xxx...",
     "username": "votre nom d'utilisateur GitHub",
     "tier": "pro"
   }
   ```

   **Description du champ tier** :
   - `free` : Copilot Free (50 fois/mois)
   - `pro` : Copilot Pro (300 fois/mois)
   - `pro+` : Copilot Pro+ (1500 fois/mois)
   - `business` : Copilot Business (300 fois/mois)
   - `enterprise` : Copilot Enterprise (1000 fois/mois)

4. **Réexécuter /mystatus**
   - Maintenant, vous devriez pouvoir interroger normalement le quota GitHub Copilot

**Solution alternative** :

Si vous ne souhaitez pas configurer de PAT, vous pouvez :
- Cliquez sur l'icône Copilot dans la barre d'état de VS Code pour voir le quota
- Visitez https://github.com/settings/billing pour voir l'utilisation

---

### Problème 7 : Absence de project_id Google Cloud

**Message d'erreur** :

```
⚠️ project_id manquant, impossible d'interroger le quota.
```

**Cause** :
- La configuration du compte Google Cloud manque de `projectId` ou `managedProjectId`
- mystatus a besoin de l'ID de projet pour appeler l'API Google Cloud

**Solution** :

1. **Vérifier antigravity-accounts.json**
   Ouvrez le fichier de configuration, confirmez que la configuration du compte inclut `projectId` ou `managedProjectId` :

   ::: code-group

   ```bash [macOS/Linux]
   ~/.config/opencode/antigravity-accounts.json
   ```

   ```powershell [Windows]
   %APPDATA%\opencode\antigravity-accounts.json
   ```

   :::

   ```json
   {
     "accounts": [
       {
         "email": "your-email@gmail.com",
         "refreshToken": "1//xxx",
         "projectId": "your-project-id",
         "addedAt": 1738000000000,
         "lastUsed": 1738000000000,
         "rateLimitResetTimes": {}
       }
     ]
   }
   ```

2. **Comment obtenir le project_id**
   - Visitez https://console.cloud.google.com/
   - Sélectionnez votre projet
   - Dans les informations du projet, trouvez "Project ID" (ID de projet)
   - Copiez-le dans le fichier de configuration

3. **S'il n'y a pas de project_id**
   - Si vous utilisez un projet géré, vous devrez peut-être utiliser `managedProjectId`
   - Contactez votre administrateur Google Cloud pour confirmer l'ID du projet

---

### Problème 8 : API Zhipu AI / Z.ai renvoie des données invalides

**Message d'erreur** :

```
Échec de la demande API Zhipu (200) : {"code": 401, "msg": "Invalid API key"}
Échec de la demande API Z.ai (200) : {"code": 400, "msg": "Bad request"}
```

**Cause** :
- Clé API invalide ou format incorrect
- Clé API expirée ou révoquée
- Le compte n'a pas l'autorisation du service correspondant

**Solution** :

1. **Confirmer que la clé API est correcte**
   - Connectez-vous à la console Zhipu AI ou Z.ai
   - Vérifiez si votre clé API est valide
   - Confirmez qu'il n'y a pas d'espaces ou de sauts de ligne supplémentaires

2. **Vérifier les autorisations de la clé API**
   - Zhipu AI : confirmez que vous avez l'autorisation "Coding Plan"
   - Z.ai : confirmez que vous avez l'autorisation "Coding Plan"

3. **Régénérer la clé API**
   - Si la clé API a un problème, vous pouvez la régénérer dans la console
   - Mettez à jour le champ `key` dans `auth.json`

---

## Point de vérification ✅

Confirmez que vous pouvez résoudre indépendamment les problèmes courants :

| Compétence | Méthode de vérification | Résultat attendu |
|--- | --- | ---|
| Résoudre les problèmes de fichiers d'authentification | Vérifier si auth.json existe et si le format est correct | Le fichier existe, le format JSON est correct |
| Rafraîchir le jeton OpenAI | Utiliser une fois le modèle OpenAI dans OpenCode | Le jeton a été mis à jour, le quota peut être interrogé normalement |
| Configurer le PAT Copilot | Créer copilot-quota-token.json | Le quota Copilot peut être interrogé normalement |
| Gérer les erreurs API | Vérifier le code d'état HTTP et prendre les mesures correspondantes | Connaître la signification des codes d'erreur 401/403/500 |
| Configurer le project_id Google | Ajouter projectId à antigravity-accounts.json | Le quota Google Cloud peut être interrogé normalement |

## Résumé de cette leçon

La gestion des erreurs de mystatus est divisée en trois couches : lecture de fichiers d'authentification, interrogation de plateforme, demande API. Face à une erreur, regardez d'abord les mots-clés du message d'erreur, puis correspondez-les à la solution. Les problèmes les plus courants incluent :

1. **Problèmes de fichiers d'authentification** : Vérifiez si `auth.json` existe et si le format est correct
2. **Jeton expiré** : Utilisez une fois le modèle correspondant dans OpenCode pour rafraîchir le jeton
3. **Erreurs API** : Déterminez s'il s'agit d'un problème d'autorisation ou d'un problème serveur selon le code d'état HTTP
4. **Autorisations spéciales Copilot** : La nouvelle intégration OAuth nécessite la configuration d'un PAT Fine-grained
5. **Configuration Google** : project_id est nécessaire pour interroger le quota

La plupart des erreurs peuvent être résolues par configuration ou réautorisation, l'échec d'une plateforme n'affecte pas l'interrogation des autres.

## Prochaine leçon

> La prochaine leçon nous apprendrons **[Sécurité et confidentialité : accès aux fichiers locaux, masquage de l'API, interfaces officielles](/fr/vbgate/opencode-mystatus/faq/security/)**.
>
> Vous apprendrez :
> - Comment mystatus protège vos données sensibles
> - Principe du masquage automatique de la clé API
> - Pourquoi le plugin est un outil local sûr
> - Garantie de non-stockage et de non-téléchargement des données

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour :2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Logique principale de gestion des erreurs | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 41-87 |
| Lecture des fichiers d'authentification | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 38-46 |
| Invite de compte introuvable | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 78-80 |
| Collecte et synthèse des résultats | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| Vérification d'expiration du jeton OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 216-221 |
| Gestion des erreurs API | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 149-152 |
| Lecture du PAT Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Invite d'échec OAuth Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 298-303 |
| Vérification du project_id Google | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 232-234 |
| Gestion des erreurs API Zhipu | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 94-103 |
| Définition des messages d'erreur | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts) | 66-123 (chinois), 144-201 (anglais) |

**Constantes clés** :

- `HIGH_USAGE_THRESHOLD = 80` : Seuil d'avertissement d'utilisation élevée (`plugin/lib/types.ts:111`)

**Fonctions clés** :

- `collectResult()` : Collecte les résultats de l'interrogation dans les tableaux results et errors (`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()` : Interroge le quota OpenAI, incluant la vérification d'expiration du jeton (`plugin/lib/openai.ts:207-236`)
- `readQuotaConfig()` : Lit la configuration PAT Copilot (`plugin/lib/copilot.ts:122-151`)
- `fetchAccountQuota()` : Interroge le quota d'un seul compte Google Cloud (`plugin/lib/google.ts:218-256`)
- `fetchUsage()` : Interroge l'utilisation Zhipu/Z.ai (`plugin/lib/zhipu.ts:81-106`)

</details>
