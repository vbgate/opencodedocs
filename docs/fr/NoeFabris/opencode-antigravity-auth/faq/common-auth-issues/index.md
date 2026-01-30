---
title: "Dépannage OAuth : Résolution des problèmes courants | Antigravity Auth"
sidebarTitle: "Échec de l'authentification OAuth ?"
subtitle: "Dépannage OAuth : Résolution des problèmes courants"
description: "Apprenez à diagnostiquer et résoudre les problèmes d'authentification OAuth avec le plugin Antigravity Auth. Couvre les échecs de callback Safari, les erreurs 403, les limites de taux, et la configuration WSL2/Docker."
tags:
  - FAQ
  - Dépannage
  - OAuth
  - Authentification
prerequisite:
  - start-first-auth-login
  - start-quick-install
order: 1
---

# Dépannage des problèmes d'authentification courants

Une fois ce tutoriel terminé, vous serez capable de résoudre par vous-même les échecs d'authentification OAuth, les erreurs de rafraîchissement de jeton, et les refus de permission, permettant ainsi de rétablir rapidement l'utilisation normale du plugin.

## Votre situation actuelle

Vous venez d'installer le plugin Antigravity Auth et vous vous apprêtez à utiliser les modèles Claude ou Gemini 3 pour travailler, mais :

- Après avoir exécuté `opencode auth login`, l'autorisation du navigateur réussit, mais le terminal affiche « Autorisation échouée »
- Après un certain temps d'utilisation, une erreur « Permission Denied » ou « invalid_grant » apparaît soudainement
- Tous les comptes affichent « Limite de taux », alors que le quota semble encore suffisant
- L'authentification OAuth ne peut pas être terminée dans un environnement WSL2 ou Docker
- Le callback OAuth échoue toujours avec Safari

Ces problèmes sont très courants. Dans la plupart des cas, il n'est pas nécessaire de réinstaller ou de contacter le support. Suivez cet article étape par étape pour résoudre le problème.

## Quand utiliser cette méthode

Consultez ce tutoriel lorsque vous rencontrez les situations suivantes :
- **Échec de l'authentification OAuth** : `opencode auth login` ne peut pas se terminer
- **Jeton invalide** : Erreurs invalid_grant, Permission Denied
- **Limite de taux** : Erreur 429, « Tous les comptes sont limités »
- **Problèmes d'environnement** : WSL2, Docker, environnement de développement à distance
- **Conflits de plugins** : Incompatibilité avec oh-my-opencode ou d'autres plugins

::: tip Réinitialisation rapide
Pour les problèmes d'authentification, **90% des cas** peuvent être résolus en supprimant le fichier de compte et en se réauthentifiant :
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```
:::

---

## Processus de diagnostic rapide

Lorsque vous rencontrez un problème, suivez cet ordre pour localiser rapidement la cause :

1. **Vérifier le chemin de configuration** → Confirmer que l'emplacement du fichier est correct
2. **Supprimer le fichier de compte et se réauthentifier** → Résout la plupart des problèmes d'authentification
3. **Consulter le message d'erreur** → Trouver une solution basée sur le type d'erreur spécifique
4. **Vérifier l'environnement réseau** → WSL2/Docker nécessite une configuration supplémentaire

---

## Concepts clés : Authentification OAuth et gestion des jetons

Avant de résoudre les problèmes, comprenons quelques concepts clés.

::: info Qu'est-ce que l'authentification OAuth 2.0 avec PKCE ?

Antigravity Auth utilise le mécanisme d'authentification **OAuth 2.0 avec PKCE** (Proof Key for Code Exchange) :

1. **Code d'autorisation** : Après votre autorisation, Google retourne un code d'autorisation temporaire
2. **Échange de jetons** : Le plugin échange le code d'autorisation contre un `access_token` (pour les appels API) et un `refresh_token` (pour le rafraîchissement)
3. **Rafraîchissement automatique** : 30 minutes avant l'expiration de l'`access_token`, le plugin rafraîchit automatiquement avec le `refresh_token`
4. **Stockage des jetons** : Tous les jetons sont stockés localement dans `~/.config/opencode/antigravity-accounts.json` et ne sont jamais téléversés vers un serveur

**Sécurité** : Le mécanisme PKCE empêche l'interception du code d'autorisation, et même si les jetons sont divulgués, les attaquants ne peuvent pas se réautoriser.

:::

::: info Qu'est-ce que la limite de taux (Rate Limit) ?

Google impose des limites de fréquence sur les appels API pour chaque compte Google. Lorsqu'une limite est déclenchée :

- **429 Too Many Requests** : Requêtes trop fréquentes, attente nécessaire
- **403 Permission Denied** : Possible mise en sourdine ou détection d'abus
- **Requête en attente** : 200 OK mais sans réponse, généralement un étranglement silencieux

**Avantage des comptes multiples** : En faisant tourner plusieurs comptes, vous pouvez contourner les limites d'un seul compte et maximiser le quota total.

:::

---

## Explication des chemins de configuration

Toutes les plateformes (y compris Windows) utilisent `~/.config/opencode/` comme répertoire de configuration :

| Fichier | Chemin | Description |
| --- | --- | --- |
| Configuration principale | `~/.config/opencode/opencode.json` | Fichier de configuration principal d'OpenCode |
| Fichier de comptes | `~/.config/opencode/antigravity-accounts.json` | Jetons OAuth et informations de compte |
| Configuration du plugin | `~/.config/opencode/antigravity.json` | Configuration spécifique au plugin |
| Journaux de débogage | `~/.config/opencode/antigravity-logs/` | Fichiers de journal de débogage |

> **Note pour les utilisateurs Windows** : `~` est automatiquement résolu vers votre répertoire utilisateur (par exemple `C:\Users\VotreNom`). N'utilisez pas `%APPDATA%`.

---

## Problèmes d'authentification OAuth

### Échec du callback OAuth dans Safari (macOS)

**Symptômes** :
- Après une autorisation réussie dans le navigateur, le terminal affiche « fail to authorize »
- Safari affiche « Safari ne peut pas ouvrir la page » ou « Connexion refusée »

**Cause** : Le mode « HTTPS-Only » de Safari bloque l'adresse de callback `http://localhost`.

**Solutions** :

**Solution 1 : Utiliser un autre navigateur (la plus simple)**

1. Exécutez `opencode auth login`
2. Copiez l'URL OAuth affichée dans le terminal
3. Collez-la dans Chrome ou Firefox
4. Terminez l'autorisation

**Solution 2 : Désactiver temporairement le mode HTTPS-Only**

1. Safari → Réglages (⌘,) → Confidentialité
2. Décochez « Activer le mode HTTPS-Only »
3. Exécutez `opencode auth login`
4. Réactivez le mode HTTPS-Only après l'authentification

**Solution 3 : Extraire manuellement le callback (avancé)**

Lorsque Safari affiche une erreur, la barre d'adresse contient `?code=...&scope=...`, vous pouvez extraire manuellement les paramètres de callback. Voir l'[issue #119](https://github.com/NoeFabris/opencode-antigravity-auth/issues/119) pour plus de détails.

### Port déjà utilisé

**Message d'erreur** : `Address already in use`

**Cause** : Le serveur de callback OAuth utilise par défaut le port `localhost:51121`, si le port est occupé, il ne peut pas démarrer.

**Solutions** :

**macOS / Linux :**
```bash
# Rechercher le processus utilisant le port
lsof -i :51121

# Tuer le processus (remplacez <PID> par l'ID réel)
kill -9 <PID>

# Réauthentifier
opencode auth login
```

**Windows :**
```powershell
# Rechercher le processus utilisant le port
netstat -ano | findstr :51121

# Tuer le processus (remplacez <PID> par l'ID réel)
taskkill /PID <PID> /F

# Réauthentifier
opencode auth login
```

### Environnement WSL2 / Docker / développement à distance

**Problème** : Le callback OAuth nécessite que le navigateur puisse accéder au `localhost` où OpenCode s'exécute, mais dans les conteneurs ou environnements distants, l'accès direct n'est pas possible.

**Solution WSL2** :
- Utilisez le transfert de port de VS Code
- Ou configurez le transfert de port Windows → WSL

**Solution SSH / développement à distance :**
```bash
# Établir un tunnel SSH, transférer le port 51121 distant vers le local
ssh -L 51121:localhost:51121 user@remote-host
```

**Solution Docker / conteneurs :**
- Les conteneurs ne peuvent pas utiliser localhost pour le callback
- Attendez 30 secondes pour utiliser le flux manuel avec URL
- Ou utilisez le transfert de port SSH

### Problèmes d'authentification multi-comptes

**Symptômes** : Échec ou confusion lors de l'authentification de plusieurs comptes.

**Solutions** :
1. Supprimez le fichier de comptes : `rm ~/.config/opencode/antigravity-accounts.json`
2. Réauthentifiez : `opencode auth login`
3. Assurez-vous que chaque compte utilise une adresse Gmail différente

---

## Problèmes de rafraîchissement de jeton

### Erreur invalid_grant

**Message d'erreur** :
```
Error: invalid_grant
Token has been revoked or expired.
```

**Causes** :
- Changement du mot de passe du compte Google
- Incident de sécurité sur le compte (connexion suspecte par exemple)
- Échec du `refresh_token`

**Solutions** :
```bash
# Supprimer le fichier de comptes
rm ~/.config/opencode/antigravity-accounts.json

# Réauthentifier
opencode auth login
```

### Expiration du jeton

**Symptômes** : Une erreur apparaît lors de l'appel du modèle après une période d'inactivité.

**Cause** : La validité de l'`access_token` est d'environ 1 heure, celle du `refresh_token` est plus longue mais peut aussi expirer.

**Solutions** :
- Le plugin rafraîchit automatiquement 30 minutes avant l'expiration du jeton, aucune action manuelle requise
- Si le rafraîchissement automatique échoue, réauthentifiez : `opencode auth login`

---

## Erreurs de permission

### 403 Permission Denied (rising-fact-p41fc)

**Message d'erreur** :
```
Permission 'cloudaicompanion.companions.generateChat' denied on resource
'//cloudaicompanion.googleapis.com/projects/rising-fact-p41fc/locations/global'
```

**Cause** : Lorsqu'aucun projet valide n'est trouvé, le plugin revient à l'ID de projet par défaut (comme `rising-fact-p41fc`). Cela fonctionne pour les modèles Antigravity, mais échoue pour les modèles Gemini CLI car Gemini CLI nécessite un projet GCP dans votre propre compte.

**Solutions** :

**Étape 1 : Créer ou sélectionner un projet GCP**

1. Visitez la [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez l'ID du projet (par exemple `my-gemini-project`)

**Étape 2 : Activer l'API Gemini for Google Cloud**

1. Dans Google Cloud Console, accédez à « API et services » → « Bibliothèque »
2. Recherchez « Gemini for Google Cloud API » (`cloudaicompanion.googleapis.com`)
3. Cliquez sur « Activer »

**Étape 3 : Ajouter le projectId dans le fichier de comptes**

Modifiez `~/.config/opencode/antigravity-accounts.json` :

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "your@gmail.com",
      "refreshToken": "...",
      "projectId": "my-gemini-project"
    }
  ]
}
```

::: warning Configuration multi-comptes
Si plusieurs comptes Google sont configurés, chaque compte doit avoir son propre `projectId`.
:::

---

## Problèmes de limitation de débit

### Tous les comptes limités (mais quota disponible)

**Symptômes** :
- Message « All accounts rate-limited »
- Le quota semble suffisant, mais aucune nouvelle requête ne peut être initiée
- Les nouveaux comptes ajoutés sont immédiatement limités

**Cause** : Il s'agit d'un bug en cascade dans le mode hybride (`clearExpiredRateLimits()`), corrigé dans les versions bêta récentes.

**Solutions** :

**Option 1 : Mettre à jour vers la dernière version bêta**
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Option 2 : Supprimer le fichier de comptes et réauthentifier**
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**Option 3 : Changer la stratégie de sélection de compte**
Modifiez `~/.config/opencode/antigravity.json`, changez la stratégie en `sticky` :
```json
{
  "account_selection_strategy": "sticky"
}
```

### 429 Too Many Requests

**Symptômes** :
- Erreurs 429 fréquentes
- Message « Rate limit exceeded »

**Cause** : Google a considérablement resserré les quotas et l'application des limites de débit. Tous les utilisateurs sont affectés, pas seulement ce plugin. Facteurs clés :

1. **Application plus stricte** : Même si le quota semble disponible, Google peut limiter ou suspendre les comptes déclenchant la détection d'abus
2. **Modèle de requêtes d'OpenCode** : OpenCode effectue plus d'appels API que les applications natives (appels d'outils, tentatives, streaming, chaînes de dialogue multi-tours), ce qui déclenche les limites plus rapidement que l'usage « normal »
3. **Shadow bans** : Certains comptes, une fois marqués, restent inutilisables pendant longtemps, tandis que d'autres continuent de fonctionner normalement

::: danger Risques d'utilisation
L'utilisation de ce plugin peut augmenter les chances de déclencher les protections automatiques contre l'abus/les limites de débit. Le fournisseur en amont peut restreindre, suspendre ou résilier l'accès à sa discrétion. **Utilisation à vos risques et périls**.
:::

**Solutions** :

**Option 1 : Attendre la réinitialisation (la plus fiable)**

Les limites de débit se réinitialisent généralement après quelques heures. Si le problème persiste :
- Arrêtez d'utiliser le compte affecté pendant 24-48 heures
- Utilisez d'autres comptes pendant ce temps
- Vérifiez `rateLimitResetTimes` dans le fichier de comptes pour voir quand la limite expire

**Option 2 : « Réchauffer » le compte dans l'IDE Antigravity (expérience communautaire)**

Les utilisateurs rapportent que cette méthode fonctionne :
1. Ouvrez directement l'[IDE Antigravity](https://idx.google.com/) dans le navigateur
2. Connectez-vous avec le compte Google affecté
3. Exécutez quelques invites simples (comme « Bonjour », « Combien font 2+2 »)
4. Après 5-10 invites réussies, essayez d'utiliser à nouveau le compte avec le plugin

**Principe** : L'utilisation du compte via l'interface « officielle » peut réinitialiser certains indicateurs internes, ou rendre le compte moins suspect.

**Option 3 : Réduire le volume et la rafale de requêtes**

- Utilisez des sessions plus courtes
- Évitez les flux de travail parallèles/intensifs en tentatives (comme générer plusieurs sous-agents simultanément)
- Si vous utilisez oh-my-opencode, envisagez de réduire le nombre d'agents générés simultanément
- Définissez `max_rate_limit_wait_seconds: 0` pour échouer rapidement au lieu de réessayer

**Option 4 : Utiliser directement l'IDE Antigravity (utilisateurs mono-compte)**

Si vous n'avez qu'un seul compte, l'utilisation directe de l'[IDE Antigravity](https://idx.google.com/) peut offrir une meilleure expérience, car le modèle de requêtes d'OpenCode déclenche les limites plus rapidement.

**Option 5 : Configuration d'un nouveau compte**

Si vous ajoutez de nouveaux comptes :
1. Supprimez le fichier de comptes : `rm ~/.config/opencode/antigravity-accounts.json`
2. Réauthentifiez : `opencode auth login`
3. Mettez à jour vers la dernière bêta : `"plugin": ["opencode-antigravity-auth@beta"]`
4. Envisagez de « réchauffer » d'abord le compte dans l'IDE Antigravity

**Informations à signaler** :

Si vous rencontrez un comportement anormal de limitation de débit, veuillez partager dans une [issue GitHub](https://github.com/NoeFabris/opencode-antigravity-auth/issues) :
- Les codes d'état dans les journaux de débogage (403, 429, etc.)
- La durée de persistance de l'état de limitation
- Le nombre de comptes et la stratégie de sélection utilisée

### Requête en attente (pas de réponse)

**Symptômes** :
- L'invite reste en attente, sans retour
- Les journaux affichent 200 OK, mais sans contenu de réponse

**Cause** : Généralement un étranglement silencieux ou une suspension douce de la part de Google.

**Solutions** :
1. Arrêtez la requête en cours (Ctrl+C ou ESC)
2. Attendez 24-48 heures avant d'utiliser à nouveau ce compte
3. Utilisez d'autres comptes pendant ce temps

---

## Problèmes de récupération de session

### Erreur après interruption de l'exécution d'un outil

**Symptômes** : Lors de l'exécution d'un outil, appuyez sur ESC pour interrompre, et une erreur `tool_result_missing` apparaît dans les dialogues suivants.

**Solutions** :
1. Tapez `continue` dans le dialogue pour déclencher la récupération automatique
2. Si bloqué, utilisez `/undo` pour revenir à l'état avant l'erreur
3. Réessayez l'opération

::: tip Récupération automatique
La fonction de récupération de session du plugin est activée par défaut. Si l'exécution d'un outil est interrompue, elle injectera automatiquement un `tool_result` synthétique et tentera de récupérer.
:::

---

## Problèmes de compatibilité des plugins

### Conflit avec oh-my-opencode

**Problème** : oh-my-opencode intègre une authentification Google, qui entre en conflit avec ce plugin.

**Solution** : Dans `~/.config/opencode/oh-my-opencode.json`, désactivez l'authentification intégrée :
```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Problème d'agents parallèles** : Lors de la génération d'agents subordonnés parallèles, plusieurs processus peuvent cibler le même compte. **Solutions** :
- Activez `pid_offset_enabled: true` (dans `antigravity.json`)
- Ou ajoutez plus de comptes

### Conflit avec @tarquinen/opencode-dcp

**Problème** : DCP crée des messages d'assistant synthétiques sans bloc de réflexion, ce qui entre en conflit avec ce plugin.

**Solution** : **Placez ce plugin avant DCP** :
```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

### Autres plugins gemini-auth

**Problème** : D'autres plugins d'authentification Google Gemini sont installés, ce qui provoque des conflits.

**Solution** : Vous n'en avez pas besoin. Ce plugin gère déjà toute l'authentification OAuth Google. Désinstallez les autres plugins gemini-auth.

---

## Problèmes de configuration

### Erreur d'orthographe des clés de configuration

**Message d'erreur** : `Unrecognized key: "plugins"`

**Cause** : Utilisation du nom de clé incorrect.

**Solution** : La clé correcte est `plugin` (au singulier) :
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

Ce n'est **pas** `"plugins"` (au pluriel), ce qui provoquerait l'erreur « Unrecognized key ».

### Modèle introuvable

**Symptômes** : Erreur « Model not found » ou 400 lors de l'utilisation d'un modèle.

**Solution** : Ajoutez dans la configuration `google` provider :
```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

---

## Problèmes de migration

### Migration de compte entre machines

**Problème** : Après avoir copié `antigravity-accounts.json` vers une nouvelle machine, le message « API key missing » apparaît.

**Solution** :
1. Assurez-vous que le plugin est installé : `"plugin": ["opencode-antigravity-auth@beta"]`
2. Copiez `~/.config/opencode/antigravity-accounts.json` vers le même chemin sur la nouvelle machine
3. Si l'erreur persiste, le `refresh_token` a peut-être expiré → Réauthentifiez : `opencode auth login`

---

## Techniques de débogage

### Activer les journaux de débogage

**Journal de base** :
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

**Journal détaillé** (requêtes/réponses complètes) :
```bash
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode
```

Emplacement des fichiers de journal : `~/.config/opencode/antigravity-logs/`

### Vérifier l'état des limites de débit

Consultez le champ `rateLimitResetTimes` dans le fichier de comptes :
```bash
cat ~/.config/opencode/antigravity-accounts.json | grep rateLimitResetTimes
```

---

## Points de contrôle ✅

Après avoir terminé le dépannage, vous devriez être capable de :
- [ ] Comprendre correctement les chemins des fichiers de configuration (`~/.config/opencode/`)
- [ ] Résoudre le problème d'échec du callback OAuth dans Safari
- [ ] Gérer les erreurs invalid_grant et 403
- [ ] Comprendre les causes et stratégies des limites de débit
- [ ] Résoudre les conflits avec oh-my-opencode
- [ ] Activer les journaux de débogage pour localiser les problèmes

---

## Avertissements

### Ne pas soumettre le fichier de comptes au contrôle de version

`antigravity-accounts.json` contient des refresh tokens OAuth, équivalents à des mots de passe. Le plugin crée automatiquement un `.gitignore`, mais assurez-vous que votre `.gitignore` contient :
```
~/.config/opencode/antigravity-accounts.json
```

### Éviter les tentatives fréquentes

Après avoir déclenché une limite 429, ne réessayez pas répétitivement. Attendez un moment avant de réessayer, sinon vous risquez d'être marqué comme abusif.

### Attention au projectId en configuration multi-comptes

Si vous utilisez des modèles Gemini CLI, **chaque compte** doit avoir son propre `projectId`. N'utilisez pas le même ID de projet.

---

## Résumé de ce cours

Ce cours couvre les problèmes d'authentification et de compte les plus courants avec le plugin Antigravity Auth :

1. **Problèmes d'authentification OAuth** : Échec du callback Safari, port occupé, environnement WSL2/Docker
2. **Problèmes de rafraîchissement de jeton** : invalid_grant, expiration du jeton
3. **Erreurs de permission** : 403 Permission Denied, projectId manquant
4. **Problèmes de limitation de débit** : Erreur 429, Shadow bans, tous les comptes limités
5. **Compatibilité des plugins** : Conflits avec oh-my-opencode, DCP
6. **Problèmes de configuration** : Erreurs d'orthographe, modèle introuvable

Lorsque vous rencontrez un problème, essayez d'abord la **réinitialisation rapide** (supprimer le fichier de comptes et réauthentifier), ce qui résout 90% des cas. Si le problème persiste, activez les journaux de débogage pour voir les détails.

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Dépannage des erreurs de modèle introuvable](../model-not-found/)**.
>
> Vous apprendrez :
> - Les erreurs 400 des modèles Gemini 3 (Unknown name 'parameters')
> - Les problèmes d'incompatibilité des schémas d'outils
> - Les méthodes de diagnostic des erreurs causées par les serveurs MCP
> - Comment localiser la source du problème via le débogage

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Lignes |
|---|---|---|
| Authentification OAuth (PKCE) | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts) | 91-270 |
| Vérification et rafraîchissement des jetons | [`src/plugin/auth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/auth.ts) | 1-53 |
| Stockage et gestion des comptes | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-715 |
| Détection des limites de débit | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 9-75 |
| Récupération de session | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | 1-150 |
| Système de journaux de débogage | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 1-300 |

**Constantes clés** :
- `OAUTH_PORT = 51121` : Port du serveur de callback OAuth (`constants.ts:25`)
- `CLIENT_ID` : ID client OAuth (`constants.ts:4`)
- `TOKEN_EXPIRY_BUFFER = 30 * 60 * 1000` : Rafraîchir 30 minutes avant expiration (`auth.ts:33`)

**Fonctions clés** :
- `authorizeAntigravity()` : Lancer le flux d'authentification OAuth (`oauth.ts:91`)
- `exchangeAntigravity()` : Échanger le code d'autorisation contre des jetons (`oauth.ts:209`)
- `refreshAccessToken()` : Rafraîchir le jeton d'accès expiré (`oauth.ts:263`)
- `isOAuthAuth()` : Vérifier si le type d'authentification est OAuth (`auth.ts:5`)
- `accessTokenExpired()` : Vérifier si le jeton est sur le point d'expirer (`auth.ts:33`)
- `markRateLimitedWithReason()` : Marquer un compte comme limité (`accounts.ts:9`)
- `detectErrorType()` : Détecter les types d'erreurs récupérables (`recovery/index.ts`)

</details>
