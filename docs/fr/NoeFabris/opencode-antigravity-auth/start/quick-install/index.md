---
title: "Installation Rapide : Configuration en 5 Minutes | Antigravity Auth"
sidebarTitle: "Opérationnel en 5 Minutes"
subtitle: "Installation Rapide d'Antigravity Auth : Configuration du Plugin en 5 Minutes"
description: "Apprenez l'installation rapide du plugin Antigravity Auth. Deux méthodes d'installation (IA assistée/manuelle), configuration des définitions de modèles, authentification Google OAuth et vérification."
tags:
  - "Démarrage Rapide"
  - "Guide d'Installation"
  - "OAuth"
  - "Configuration Plugin"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Installation Rapide d'Antigravity Auth : Configuration en 5 Minutes

L'installation rapide d'Antigravity Auth vous permet de configurer le plugin OpenCode en 5 minutes et de commencer à utiliser les modèles avancés Claude et Gemini 3. Ce tutoriel propose deux méthodes d'installation (assistée par IA / configuration manuelle), couvrant l'installation du plugin, l'authentification OAuth, la définition des modèles et les étapes de vérification pour vous assurer une prise en main rapide.

## Ce Que Vous Allez Apprendre

- ✅ Compléter l'installation du plugin Antigravity Auth en 5 minutes
- ✅ Configurer l'accès aux modèles Claude et Gemini 3
- ✅ Exécuter l'authentification Google OAuth et vérifier l'installation

## Votre Situation Actuelle

Vous souhaitez essayer les fonctionnalités puissantes d'Antigravity Auth (Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash), mais vous ne savez pas comment installer le plugin, configurer les modèles, et vous craignez de bloquer dès la première étape.

## Quand Utiliser Cette Méthode

- Lors de votre première utilisation du plugin Antigravity Auth
- Lors de l'installation d'OpenCode sur une nouvelle machine
- Lors d'une reconfiguration du plugin

## 🎒 Préparatifs Avant de Commencer

::: warning Vérifications Préliminaires

Avant de commencer, veuillez confirmer que :
- [ ] OpenCode CLI est installé (la commande `opencode` est disponible)
- [ ] Vous disposez d'un compte Google (pour l'authentification OAuth)
- [ ] Vous connaissez les concepts de base d'Antigravity Auth (lisez [Qu'est-ce qu'Antigravity Auth ?](/fr/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/))

:::

## Concept Principal

Le processus d'installation d'Antigravity Auth se divise en 4 étapes :

1. **Installer le plugin** → Activer le plugin dans la configuration OpenCode
2. **Authentification OAuth** → Se connecter avec un compte Google
3. **Configurer les modèles** → Ajouter les définitions de modèles Claude/Gemini
4. **Vérifier l'installation** → Tester avec une première requête

**Note importante** : Le chemin du fichier de configuration est `~/.config/opencode/opencode.json` sur tous les systèmes (sur Windows, `~` est automatiquement résolu en répertoire utilisateur, par exemple `C:\Users\VotreNom`).

## Guide Étape par Étape

### Étape 1 : Choisir la Méthode d'Installation

Antigravity Auth propose deux méthodes d'installation, choisissez celle qui vous convient.

::: tip Méthode Recommandée

Si vous utilisez un Agent LLM (comme Claude Code, Cursor, OpenCode), **l'installation assistée par IA est recommandée**, plus rapide et pratique.

:::

**Méthode 1 : Installation Assistée par IA (Recommandée)**

Copiez simplement le prompt suivant et collez-le dans n'importe quel Agent LLM :

```
Install opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

**L'IA effectuera automatiquement** :
- Modifier `~/.config/opencode/opencode.json`
- Ajouter la configuration du plugin
- Ajouter les définitions complètes des modèles
- Exécuter `opencode auth login` pour l'authentification

**Vous devriez voir** : L'IA affiche "Plugin installé avec succès" ou un message similaire.

**Méthode 2 : Installation Manuelle**

Si vous préférez un contrôle manuel, suivez les étapes ci-dessous :

**Étape 1.1 : Ajouter le Plugin au Fichier de Configuration**

Modifiez `~/.config/opencode/opencode.json` (créez le fichier s'il n'existe pas) :

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> **Version Bêta** : Pour essayer les dernières fonctionnalités, utilisez `opencode-antigravity-auth@beta` à la place de `@latest`.

**Vous devriez voir** : Le fichier de configuration contient le champ `plugin` avec une valeur de type tableau.

---

### Étape 2 : Exécuter l'Authentification Google OAuth

Dans le terminal, exécutez :

```bash
opencode auth login
```

**Le système effectuera automatiquement** :
1. Démarrer un serveur OAuth local (écoute sur `localhost:51121`)
2. Ouvrir le navigateur et rediriger vers la page d'autorisation Google
3. Recevoir le callback OAuth et échanger le jeton
4. Obtenir automatiquement l'ID du projet Google Cloud

**Ce que vous devez faire** :
1. Cliquer sur "Autoriser" dans le navigateur pour accorder l'accès
2. Si vous êtes dans un environnement WSL ou Docker, vous devrez peut-être copier manuellement l'URL de callback

**Vous devriez voir** :

```
✅ Authentication successful
✅ Account added: your-email@gmail.com
✅ Project ID resolved: cloud-project-id-xxx
```

::: tip Support Multi-Comptes

Besoin d'ajouter d'autres comptes pour augmenter les quotas ? Exécutez simplement `opencode auth login` à nouveau. Le plugin prend en charge jusqu'à 10 comptes avec répartition de charge automatique.

:::

---

### Étape 3 : Configurer les Définitions de Modèles

Copiez la configuration complète suivante et ajoutez-la à `~/.config/opencode/opencode.json` (attention à ne pas écraser le champ `plugin` existant) :

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: info Classification des Modèles

- **Quota Antigravity** (Claude + Gemini 3) : `antigravity-gemini-*`, `antigravity-claude-*`
- **Quota Gemini CLI** (indépendant) : `gemini-2.5-*`, `gemini-3-*-preview`

Pour plus de détails sur la configuration des modèles, consultez la [liste complète des modèles disponibles](/fr/NoeFabris/opencode-antigravity-auth/platforms/available-models/).

:::

**Vous devriez voir** : Le fichier de configuration contient la définition complète de `provider.google.models`, et le format JSON est valide (pas d'erreurs de syntaxe).

---

### Étape 4 : Vérifier l'Installation

Exécutez la commande suivante pour tester si le plugin fonctionne correctement :

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**Vous devriez voir** :

```
Utilisation de : google/antigravity-claude-sonnet-4-5-thinking (max)
...

Claude: Bonjour ! Je suis Claude Sonnet 4.5 Thinking.
```

::: tip Point de Contrôle ✅

Si vous voyez une réponse normale de l'IA, félicitations ! Le plugin Antigravity Auth est installé et configuré avec succès.

:::

---

## Pièges Courants

### Problème 1 : Échec de l'Authentification OAuth

**Symptômes** : Après avoir exécuté `opencode auth login`, une erreur apparaît, telle que `invalid_grant` ou la page d'autorisation ne s'ouvre pas.

**Causes** : Changement de mot de passe du compte Google, incident de sécurité, ou URL de callback incomplète.

**Solutions** :
1. Vérifiez si le navigateur ouvre correctement la page d'autorisation Google
2. Si vous êtes dans un environnement WSL/Docker, copiez manuellement l'URL de callback affichée dans le terminal vers le navigateur
3. Supprimez `~/.config/opencode/antigravity-accounts.json` puis réauthentifiez-vous

### Problème 2 : Modèle Introuvable (Erreur 400)

**Symptômes** : Lors de l'exécution d'une requête, l'erreur `400 Unknown name 'xxx'` est retournée.

**Causes** : Erreur d'orthographe du nom du modèle ou problème de formatage du fichier de configuration.

**Solutions** :
1. Vérifiez si le paramètre `--model` correspond exactement à la clé dans le fichier de configuration (sensible à la casse)
2. Validez que `opencode.json` est un JSON valide (utilisez `cat ~/.config/opencode/opencode.json | jq` pour vérifier)
3. Confirmez que le champ `provider.google.models` contient la définition du modèle correspondant

### Problème 3 : Chemin de Fichier de Configuration Incorrect

**Symptômes** : Message indiquant "fichier de configuration introuvable" ou modifications sans effet.

**Causes** : Utilisation d'un chemin incorrect sur différents systèmes.

**Solution** : Tous les systèmes utilisent uniformément `~/.config/opencode/opencode.json`, y compris Windows (`~` est automatiquement résolu en répertoire utilisateur).

| Système | Chemin Correct | Chemin Incorrect |
| --- | --- | ---|
| macOS/Linux | `~/.config/opencode/opencode.json` | `/usr/local/etc/...` |
| Windows | `C:\Users\VotreNom\.config\opencode\opencode.json` | `%APPDATA%\opencode\...` |

## Résumé du Cours

Dans ce cours, nous avons accompli :
1. ✅ Deux méthodes d'installation (assistance IA / configuration manuelle)
2. ✅ Processus d'authentification Google OAuth
3. ✅ Configuration complète des modèles (Claude + Gemini 3)
4. ✅ Vérification de l'installation et résolution des problèmes courants

**Points Clés** :
- Chemin de configuration unifié : `~/.config/opencode/opencode.json`
- L'authentification OAuth obtient automatiquement l'ID du projet, aucune configuration manuelle requise
- Support multi-comptes pour augmenter les quotas
- Utilisez le paramètre `variant` pour contrôler la profondeur de réflexion des modèles Thinking

## Aperçu du Prochain Cours

> Dans le prochain cours, nous apprendrons **[Première Authentification : Comprendre en Profondeur le Flux OAuth 2.0 PKCE](/fr/NoeFabris/opencode-antigravity-auth/start/first-auth-login/)**.
>
> Vous apprendrez :
> - Le fonctionnement d'OAuth 2.0 PKCE
> - Le mécanisme de rafraîchissement des tokens
> - Le processus d'extraction automatique de l'ID de projet
> - Le format de stockage des comptes

---

## Annexe : Références du Code Source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du Fichier | Lignes |
|---|---|---|
| Génération de l'URL d'autorisation OAuth | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L91-L113) | 91-113 |
| Génération de la paire de clés PKCE | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L1-L2) | 1-2 |
| Échange de tokens | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L201-L270) | 201-270 |
| Récupération automatique de l'ID de projet | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L131-L196) | 131-196 |
| Récupération des informations utilisateur | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L231-L242) | 231-242 |

**Constantes Clés** :
- `ANTIGRAVITY_CLIENT_ID` : ID client OAuth (utilisé pour l'authentification Google)
- `ANTIGRAVITY_REDIRECT_URI` : Adresse de callback OAuth (fixée à `http://localhost:51121/oauth-callback`)
- `ANTIGRAVITY_SCOPES` : Liste des périmètres d'autorisation OAuth

**Fonctions Clés** :
- `authorizeAntigravity()` : Construit l'URL d'autorisation OAuth, incluant le challenge PKCE
- `exchangeAntigravity()` : Échange le code d'autorisation contre un token d'accès et un token de rafraîchissement
- `fetchProjectID()` : Extrait automatiquement l'ID du projet Google Cloud
- `encodeState()` / `decodeState()` : Encode/décode le paramètre OAuth state (contient le vérificateur PKCE)

</details>
