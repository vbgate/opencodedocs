---
title: "Guide complet de configuration du canal Slack : Mode Socket/HTTP, paramètres de sécurité | Tutoriel Clawdbot"
sidebarTitle: "Slack avec l'IA"
subtitle: "Guide complet de configuration du canal Slack | Tutoriel Clawdbot"
description: "Apprenez à configurer et utiliser le canal Slack dans Clawdbot. Ce tutoriel couvre les deux modes de connexion Socket Mode et HTTP Mode, les étapes d'obtention des Token, la configuration de sécurité DM, les stratégies de gestion de groupe et l'utilisation des outils Slack Actions."
tags:
  - "platforms"
  - "slack"
  - "configuration"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 90
---

# Guide complet de configuration du canal Slack

## Ce que vous saurez faire à la fin

- ✅ Interagir avec Clawdbot dans Slack et utiliser l'assistant IA pour accomplir des tâches
- ✅ Configurer les stratégies de sécurité DM pour protéger votre vie privée
- ✅ Intégrer Clawdbot dans les groupes et répondre intelligemment aux mentions @ et aux commandes
- ✅ Utiliser les outils Slack Actions (envoyer des messages, gérer les Pins, afficher les informations des membres, etc.)
- ✅ Choisir entre les deux modes de connexion Socket Mode ou HTTP Mode

## Votre problème actuel

Slack est l'outil central de collaboration d'équipe, mais vous rencontrez peut-être les problèmes suivants :

- Les discussions d'équipe sont dispersées sur plusieurs canaux et vous manquez des informations importantes
- Vous devez rechercher rapidement des messages historiques, des Pins ou des informations sur les membres, mais l'interface Slack n'est pas assez pratique
- Vous souhaitez utiliser les capacités de l'IA directement dans Slack sans basculer vers d'autres applications
- Vous craignez qu'activer l'assistant IA dans les groupes ne provoque une surcharge de messages ou des fuites de confidentialité

## Quand utiliser cette méthode

- **Communication quotidienne d'équipe** : Slack est votre outil principal de communication d'équipe
- **Intégration native Slack nécessaire** : Utiliser les fonctionnalités Reaction, Pin, Thread, etc.
- **Besoin de multi-comptes** : Besoin de connecter plusieurs Slack Workspaces
- **Scénario de déploiement distant** : Utiliser HTTP Mode pour connecter un Gateway distant

## 🎒 Prérequis

::: warning Vérification préalable
Avant de commencer, assurez-vous de :
- Avoir terminé le [Démarrage rapide](../../start/getting-started/)
- Gateway est démarré et en cours d'exécution
- Avoir les permissions d'administrateur du Slack Workspace (créer une App)
::

**Ressources dont vous avez besoin** :
- [Console Slack API](https://api.slack.com/apps) - Créer et gérer une App Slack
- Fichier de configuration Clawdbot - Généralement situé à `~/.clawdbot/clawdbot.json`

## Concepts fondamentaux

Le canal Slack de Clawdbot est basé sur le framework [Bolt](https://slack.dev/bolt-js) et prend en charge deux modes de connexion :

| Mode | Scénario d'utilisation | Avantages | Inconvénients |
| ------ | -------- | ------ | ------ |
| **Socket Mode** | Gateway local, utilisation personnelle | Configuration simple (seulement Token requis) | Nécessite une connexion WebSocket constante |
| **HTTP Mode** | Déploiement serveur, accès distant | Peut traverser les pare-feux, prend en charge l'équilibrage de charge | Nécessite une IP publique, configuration complexe |

**Par défaut, Socket Mode est utilisé**, adapté à la plupart des utilisateurs.

**Mécanismes d'authentification** :
- **Bot Token** (`xoxb-...`) - Obligatoire, pour les appels API
- **App Token** (`xapp-...`) - Obligatoire pour Socket Mode, pour la connexion WebSocket
- **User Token** (`xoxp-...`) - Optionnel, pour les opérations en lecture seule (historique, Pins, Reactions)
- **Signing Secret** - Obligatoire pour HTTP Mode, pour vérifier les requêtes Webhook

## Instructions détaillées

### Étape 1 : Créer une App Slack

**Pourquoi**
L'App Slack est le pont entre Clawdbot et le Workspace, fournissant l'authentification et le contrôle des permissions.

1. Visitez la [console Slack API](https://api.slack.com/apps)
2. Cliquez sur **Create New App** → Choisissez **From scratch**
3. Remplissez les informations de l'App :
   - **App Name** : `Clawdbot` (ou le nom de votre choix)
   - **Pick a workspace to develop your app in** : Sélectionnez votre Workspace
4. Cliquez sur **Create App**

**Ce que vous devriez voir** :
L'App est créée avec succès et vous accédez à la page de configuration de base.

### Étape 2 : Configurer Socket Mode (recommandé)

::: tip Astuce
Si vous utilisez un Gateway local, Socket Mode est recommandé pour une configuration plus simple.
::

**Pourquoi**
Socket Mode ne nécessite pas d'IP publique et se connecte via le service WebSocket de Slack.

1. Sur la page de configuration de l'App, trouvez **Socket Mode** et basculez sur **On**
2. Faites défiler jusqu'à **App-Level Tokens**, cliquez sur **Generate Token and Scopes**
3. Dans la section **Token**, sélectionnez le scope :
   - Cochez `connections:write`
4. Cliquez sur **Generate Token** et copiez le **App Token** généré (commençant par `xapp-`)

**Ce que vous devriez voir** :
Le Token généré ressemble à : `xapp-1-A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P`

::: danger Rappel de sécurité
L'App Token est une information sensible, veuillez le conserver en sécurité et ne pas le divulguer dans des dépôts publics.
::
### Étape 3 : Configurer le Bot Token et les permissions

1. Faites défiler jusqu'à **OAuth & Permissions** → **Bot Token Scopes**
2. Ajoutez les scopes (permissions) suivants :

**Bot Token Scopes (obligatoire)** :

```yaml
    chat:write                    # Envoyer/éditer/supprimer des messages
    channels:history              # Lire l'historique des canaux
    channels:read                 # Obtenir les informations des canaux
    groups:history                # Lire l'historique des groupes
    groups:read                   # Obtenir les informations des groupes
    im:history                   # Lire l'historique des DM
    im:read                      # Obtenir les informations des DM
    im:write                     # Ouvrir une session DM
    mpim:history                # Lire l'historique des DM de groupe
    mpim:read                   # Obtenir les informations des DM de groupe
    users:read                   # Interroger les informations utilisateur
    app_mentions:read            # Lire les mentions @
    reactions:read               # Lire les Reactions
    reactions:write              # Ajouter/supprimer des Reactions
    pins:read                    # Lire la liste des Pins
    pins:write                   # Ajouter/supprimer des Pins
    emoji:read                   # Lire les Emoji personnalisés
    commands                     # Traiter les commandes slash
    files:read                   # Lire les informations des fichiers
    files:write                  # Télécharger des fichiers
```

::: info Explication
Ce sont les permissions obligatoires pour le **Bot Token**, assurant que le Bot peut lire les messages, envoyer des réponses, gérer les Reactions et les Pins normalement.
::

3. Faites défiler vers le haut de la page et cliquez sur **Install to Workspace**
4. Cliquez sur **Allow** pour autoriser l'App à accéder à votre Workspace
5. Copiez le **Bot User OAuth Token** généré (commençant par `xoxb-`)

**Ce que vous devriez voir** :
Le Token ressemble à : `xoxb-YOUR-BOT-TOKEN-HERE`

::: tip Astuce
 Si vous avez besoin d'un **User Token** (pour les opérations en lecture seule), faites défiler jusqu'à **User Token Scopes** et ajoutez les permissions suivantes :
- `channels:history`, `groups:history`, `im:history`, `mpim:history`
- `channels:read`, `groups:read`, `im:read`, `mpim:read`
- `users:read`, `reactions:read`, `pins:read`, `emoji:read`
- `search:read`

Ensuite, sur la page **Install App**, copiez le **User OAuth Token** (commençant par `xoxp-`).

**User Token Scopes (optionnel, lecture seule)** :
- Utilisé uniquement pour lire l'historique, les Reactions, les Pins, les Emoji et rechercher
- Les opérations d'écriture utilisent toujours le Bot Token (sauf si `userTokenReadOnly: false` est défini)
::

### Étape 4 : Configurer les abonnements aux événements

1. Sur la page de configuration de l'App, trouvez **Event Subscriptions**, activez **Enable Events**
2. Dans **Subscribe to bot events**, ajoutez les événements suivants :

```yaml
    app_mention                  # Mention @ du Bot
    message.channels              # Messages de canal
    message.groups               # Messages de groupe
    message.im                   # Messages DM
    message.mpim                # Messages DM de groupe
    reaction_added               # Ajout de Reaction
    reaction_removed             # Suppression de Reaction
    member_joined_channel       # Membre rejoint le canal
    member_left_channel          # Membre quitte le canal
    channel_rename               # Renommage de canal
    pin_added                   # Ajout de Pin
    pin_removed                 # Suppression de Pin
```

3. Cliquez sur **Save Changes**

### Étape 5 : Activer les fonctionnalités DM

1. Sur la page de configuration de l'App, trouvez **App Home**
2. Activez **Messages Tab** → Basculez sur **Enable Messages Tab**
3. Assurez-vous que **Messages tab read-only disabled: No** est affiché

**Ce que vous devriez voir** :
L'onglet Messages est activé, les utilisateurs peuvent avoir des conversations DM avec le Bot.

### Étape 6 : Configurer Clawdbot

**Pourquoi**
Configurez le Token Slack dans Clawdbot pour établir la connexion.

#### Méthode 1 : Variables d'environnement (recommandé)

```bash
    # Définir les variables d'environnement
    export SLACK_BOT_TOKEN="xoxb-VotreBotToken"
    export SLACK_APP_TOKEN="xapp-VotreAppToken"

    # Redémarrer le Gateway
    clawdbot gateway restart
```

**Ce que vous devriez voir** :
Les journaux du Gateway affichent `Slack: connected`.

#### Méthode 2 : Fichier de configuration

Modifiez `~/.clawdbot/clawdbot.json` :

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-VotreBotToken",
      "appToken": "xapp-VotreAppToken"
    }
  }
}
```

**Si vous avez un User Token** :

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-VotreBotToken",
      "appToken": "xapp-VotreAppToken",
      "userToken": "xoxp-VotreUserToken",
      "userTokenReadOnly": true
    }
  }
}
```

**Ce que vous devriez voir** :
Après avoir redémarré le Gateway, la connexion Slack est réussie.

### Étape 7 : Inviter le Bot dans un canal

1. Dans Slack, ouvrez le canal où vous voulez que le Bot rejoigne
2. Entrez `/invite @Clawdbot` (remplacez par le nom de votre Bot)
3. Cliquez sur **Add to channel**

**Ce que vous devriez voir** :
Le Bot rejoint le canal avec succès et affiche "Clawdbot has joined the channel".

### Étape 8 : Configurer les stratégies de sécurité de groupe

**Pourquoi**
Empêcher le Bot de répondre automatiquement dans tous les canaux, protéger la confidentialité.

Modifiez `~/.clawdbot/clawdbot.json` :

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-VotreBotToken",
      "appToken": "xapp-VotreAppToken",
      "groupPolicy": "allowlist",
      "channels": {
        "C1234567890": {
          "allow": true,
          "requireMention": true
        },
        "#general": {
          "allow": true,
          "requireMention": true
        }
      }
    }
  }
}
```

**Explication des champs** :
- `groupPolicy` : Stratégie de groupe
  - `"open"` - Autoriser tous les canaux (non recommandé)
  - `"allowlist"` - Autoriser uniquement les canaux listés (recommandé)
  - `"disabled"` - Interdire tous les canaux
- `channels` : Configuration des canaux
  - `allow` : Autoriser/refuser
  - `requireMention` : Nécessite-t-il une mention @ du Bot pour répondre (par défaut `true`)
  - `users` : Liste blanche d'utilisateurs supplémentaires
  - `skills` : Limiter les compétences utilisables dans ce canal
  - `systemPrompt` : Prompt système supplémentaire

**Ce que vous devriez voir** :
Le Bot ne répond aux messages que dans les canaux configurés et nécessite une mention @.

### Étape 9 : Configurer les stratégies de sécurité DM

**Pourquoi**
Empêcher les inconnus d'interagir avec le Bot via DM, protéger la confidentialité.

Modifiez `~/.clawdbot/clawdbot.json` :

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-VotreBotToken",
      "appToken": "xapp-VotreAppToken",
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["U1234567890", "@alice", "user@example.com"]
      }
    }
  }
}
```

**Explication des champs** :
- `dm.enabled` : Activer/désactiver DM (par défaut `true`)
- `dm.policy` : Stratégie DM
  - `"pairing"` - Les inconnus reçoivent un code de jumelage, nécessitent une approbation (par défaut)
  - `"open"` - Autoriser n'importe qui à envoyer des DM
  - `"allowlist"` - Autoriser uniquement les utilisateurs de la liste blanche
- `dm.allowFrom` : Liste blanche
  - Prend en charge l'ID utilisateur (`U1234567890`)
  - Prend en charge les mentions @ (`@alice`)
  - Prend en charge les e-mails (`user@example.com`)

**Processus de jumelage** :
1. Un inconnu envoie un DM au Bot
2. Le Bot répond avec un code de jumelage (valide 1 heure)
3. L'utilisateur fournit le code de jumelage à l'administrateur
4. L'administrateur exécute : `clawdbot pairing approve slack <code de jumelage>`
5. L'utilisateur est ajouté à la liste blanche et peut utiliser normalement

**Ce que vous devriez voir** :
Les expéditeurs inconnus reçoivent un code de jumelage, le Bot ne traite pas leurs messages.

### Étape 10 : Tester le Bot

1. Envoyez un message dans le canal configuré : `@Clawdbot Bonjour`
2. Ou envoyez un DM au Bot
3. Observez la réponse du Bot

**Ce que vous devriez voir** :
Le Bot répond normalement à votre message.

### Point de contrôle ✅

- [ ] L'App Slack est créée avec succès
- [ ] Socket Mode est activé
- [ ] Bot Token et App Token sont copiés
- [ ] Le fichier de configuration Clawdbot est mis à jour
- [ ] Le Gateway est redémarré
- [ ] Le Bot est invité dans le canal
- [ ] Les stratégies de sécurité de groupe sont configurées
- [ ] Les stratégies de sécurité DM sont configurées
- [ ] Les messages de test reçoivent des réponses

## Éviter les pièges

### Erreur courante 1 : Le Bot ne répond pas

**Problème** : Après avoir envoyé un message, le Bot ne répond pas.

**Causes possibles** :
1. Le Bot n'a pas rejoint le canal → Utilisez `/invite @Clawdbot` pour l'inviter
2. `requireMention` est défini sur `true` → Vous devez mentionner `@Clawdbot` lors de l'envoi du message
3. Erreur de configuration du Token → Vérifiez que le Token dans `clawdbot.json` est correct
4. Le Gateway ne fonctionne pas → Exécutez `clawdbot gateway status` pour vérifier l'état

### Erreur courante 2 : Échec de la connexion Socket Mode

**Problème** : Les journaux du Gateway affichent un échec de connexion.

**Solution** :
1. Vérifiez que l'App Token est correct (commençant par `xapp-`)
2. Vérifiez que Socket Mode est activé
3. Vérifiez la connexion réseau

### Erreur courante 3 : Permissions User Token insuffisantes

**Problème** : Certaines opérations échouent avec une erreur de permission.

**Solution** :
1. Assurez-vous que le User Token contient les permissions nécessaires (voir étape 3)
2. Vérifiez le paramètre `userTokenReadOnly` (par défaut `true`, lecture seule)
3. Si vous avez besoin d'opérations d'écriture, définissez `"userTokenReadOnly": false`

### Erreur courante 4 : Échec de la résolution de l'ID de canal

**Problème** : Le nom de canal configuré ne peut pas être résolu en ID.

**Solution** :
1. Utilisez de préférence l'ID de canal (comme `C1234567890`) plutôt que le nom
2. Assurez-vous que le nom du canal commence par `#` (comme `#general`)
3. Vérifiez que le Bot a les permissions pour accéder à ce canal
## Configuration avancée

### Explication des permissions

::: info Bot Token vs User Token
- **Bot Token** : Obligatoire, pour les fonctionnalités principales du Bot (envoyer des messages, lire l'historique, gérer les Pins/Reactions, etc.)
- **User Token** : Optionnel, uniquement pour les opérations en lecture seule (historique, Reactions, Pins, Emoji, recherche)
  - Par défaut `userTokenReadOnly: true`, assurant la lecture seule
  - Les opérations d'écriture (envoyer des messages, ajouter des Reactions, etc.) utilisent toujours le Bot Token
::

**Permissions qui pourraient être nécessaires à l'avenir** :

Les permissions suivantes ne sont pas obligatoires dans la version actuelle, mais pourraient être prises en charge à l'avenir :

| Permission | Utilisation |
| ------ | ------ |
| `groups:write` | Gestion de canaux privés (créer, renommer, inviter, archiver) |
| `mpim:write` | Gestion de sessions DM de groupe |
| `chat:write.public` | Publier des messages dans des canaux où le Bot n'est pas membre |
| `files:read` | Lister/lire les métadonnées de fichiers |

Si vous devez activer ces fonctionnalités, ajoutez les permissions correspondantes dans **Bot Token Scopes** de l'App Slack.

### HTTP Mode (déploiement serveur)

Si votre Gateway est déployé sur un serveur distant, utilisez HTTP Mode :

1. Créez une App Slack, désactivez Socket Mode
2. Copiez le **Signing Secret** (page Basic Information)
3. Configurez les abonnements aux événements, définissez **Request URL** sur `https://votre-domaine/slack/events`
4. Configurez Interactivity & Shortcuts, définissez le même **Request URL**
5. Configurez Slash Commands, définissez **Request URL**

**Fichier de configuration** :

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "http",
      "botToken": "xoxb-VotreBotToken",
      "signingSecret": "VotreSigningSecret",
      "webhookPath": "/slack/events"
    }
  }
}
```

### Configuration multi-comptes

Prend en charge la connexion à plusieurs Slack Workspaces :

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "workspace1": {
          "name": "Team A",
          "enabled": true,
          "botToken": "xoxb-Workspace1Token",
          "appToken": "xapp-Workspace1Token"
        },
        "workspace2": {
          "name": "Team B",
          "enabled": true,
          "botToken": "xoxb-Workspace2Token",
          "appToken": "xapp-Workspace2Token"
        }
      }
    }
  }
}
```

### Configuration des commandes slash

Activer la commande `/clawd` :

1. Sur la page de configuration de l'App, trouvez **Slash Commands**
2. Créez une commande :
   - **Command** : `/clawd`
   - **Request URL** : Non requis pour Socket Mode (traité via WebSocket)
   - **Description** : `Send a message to Clawdbot`

**Fichier de configuration** :

```json
{
  "channels": {
    "slack": {
      "slashCommand": {
        "enabled": true,
        "name": "clawd",
        "ephemeral": true
      }
    }
  }
}
```

### Configuration des réponses en fil de discussion

Contrôler la manière dont le Bot répond dans les canaux :

```json
{
  "channels": {
    "slack": {
      "replyToMode": "off",
      "replyToModeByChatType": {
        "direct": "all",
        "group": "first"
      }
    }
  }
}
```

| Mode | Comportement |
| ----- | ------ |
| `off` | Par défaut, répond dans le canal principal |
| `first` | La première réponse va dans le fil, les réponses suivantes dans le canal principal |
| `all` | Toutes les réponses sont dans le fil |
### Activer les outils Slack Actions

Permettre à l'Agent d'appeler des opérations spécifiques à Slack :

```json
{
  "channels": {
    "slack": {
      "actions": {
        "reactions": true,
        "messages": true,
        "pins": true,
        "memberInfo": true,
        "emojiList": true
      }
    }
  }
}
```

**Opérations disponibles** :
- `sendMessage` - Envoyer un message
- `editMessage` - Modifier un message
- `deleteMessage` - Supprimer un message
- `readMessages` - Lire les messages historiques
- `react` - Ajouter une Reaction
- `reactions` - Lister les Reactions
- `pinMessage` - Épingler un message
- `unpinMessage` - Désépingler un message
- `listPins` - Lister les Pins
- `memberInfo` - Obtenir les informations d'un membre
- `emojiList` - Lister les Emoji personnalisés

## Résumé de cette leçon

- Le canal Slack prend en charge deux modes de connexion : Socket Mode et HTTP Mode
- Socket Mode est simple à configurer, recommandé pour une utilisation locale
- Les stratégies de sécurité DM sont par défaut `pairing`, les inconnus nécessitent une approbation
- Les stratégies de sécurité de groupe prennent en charge la liste blanche et le filtrage par mention @
- Les outils Slack Actions fournissent des capacités d'opération riches
- Le support multi-comptes permet de connecter plusieurs Workspaces

## Aperçu de la leçon suivante

> Dans la prochaine leçon, nous apprendrons le **[Canal Discord](../discord/)**.
>
> Vous apprendrez :
> - La méthode de configuration du Bot Discord
> - L'obtention des Token et le paramétrage des permissions
> - Les stratégies de sécurité pour les groupes et les DM
> - L'utilisation des outils spécifiques à Discord

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer la localisation du code source</strong></summary>

> Date de mise à jour : 2026-01-27

| Fonctionnalité            | Chemin du fichier                                                                                               | Numéro de ligne       |
| --------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| Types de configuration Slack | [`src/config/types.slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.slack.ts) | 1-150      |
| Logique d'onboarding Slack | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 1-539      |
| Outils Slack Actions | [`src/agents/tools/slack-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/slack-actions.ts) | 1-301      |
| Documentation officielle Slack | [`docs/channels/slack.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/slack.md) | 1-508      |

**Définitions de types clés** :
- `SlackConfig` : Type de configuration principale du canal Slack
- `SlackAccountConfig` : Configuration de compte unique (prend en charge les modes socket/http)
- `SlackChannelConfig` : Configuration de canal (liste blanche, stratégie de mention, etc.)
- `SlackDmConfig` : Configuration DM (pairing, allowlist, etc.)
- `SlackActionConfig` : Contrôle des permissions des outils Actions

**Fonctions clés** :
- `handleSlackAction()` : Traiter les appels d'outils Slack Actions
- `resolveThreadTsFromContext()` : Résoudre l'ID de fil selon replyToMode
- `buildSlackManifest()` : Générer le manifeste de l'App Slack

</details>
