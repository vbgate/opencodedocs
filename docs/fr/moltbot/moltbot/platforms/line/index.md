---
title: "Configuration et Utilisation du Canal LINE | Tutoriel Clawdbot"
sidebarTitle: "Discuter avec AI sur LINE"
subtitle: "Configuration et Utilisation du Canal LINE"
description: "Apprenez à configurer et utiliser le canal LINE de Clawdbot. Ce tutoriel couvre l'intégration de LINE Messaging API, la configuration du Webhook, le contrôle d'accès, les messages riches (modèles Flex, réponses rapides, Rich Menu) et les techniques de dépannage des problèmes courants."
tags:
  - "LINE"
  - "Messaging API"
  - "Configuration de Canal"
prerequisite:
  - "start-gateway-startup"
order: 140
---

# Configuration et Utilisation du Canal LINE

## Ce que vous saurez faire

Après avoir terminé ce tutoriel, vous serez capable de :

- ✅ Créer un canal LINE Messaging API et obtenir les informations d'identification
- ✅ Configurer le plugin LINE et le Webhook de Clawdbot
- ✅ Configurer l'appariement DM, le contrôle d'accès aux groupes et les limites de médias
- ✅ Envoyer des messages riches (cartes Flex, réponses rapides, informations de localisation)
- ✅ Résoudre les problèmes courants du canal LINE

## Votre situation actuelle

Vous vous demandez peut-être :

- "Je veux discuter avec l'assistant IA via LINE, comment intégrer ?"
- "Comment configurer le Webhook de LINE Messaging API ?"
- "LINE prend-il en charge les messages Flex et les réponses rapides ?"
- "Comment contrôler qui peut accéder à mon assistant IA via LINE ?"

La bonne nouvelle est : **Clawdbot fournit un plugin LINE complet prenant en charge toutes les fonctionnalités principales de Messaging API**.

## Quand utiliser cette solution

Lorsque vous avez besoin de :

- 📱 **Discuter avec l'assistant IA sur LINE**
- 🎨 **Utiliser des messages riches** (cartes Flex, réponses rapides, Rich Menu)
- 🔒 **Contrôler les autorisations d'accès** (appariement DM, liste blanche de groupes)
- 🌐 **Intégrer LINE dans** les flux de travail existants

## Concepts clés

Le canal LINE s'intègre via **LINE Messaging API**, utilisant Webhook pour recevoir des événements et envoyer des messages.

```
Utilisateur LINE
    │
    ▼ (envoyer message)
┌──────────────────┐
│  LINE Platform  │
│  (Messaging API)│
└────────┬─────────┘
         │ (Webhook POST)
         ▼
┌──────────────────┐
│  Clawdbot       │
│  Gateway        │
│  /line/webhook   │
└────────┬─────────┘
         │ (appeler AI)
         ▼
     ┌────────┐
     │ Agent  │
     └───┬────┘
         │ (répondre)
         ▼
     Utilisateur LINE
```

**Concepts clés** :

| Concept | Fonction |
|--- | ---|
| **Channel Access Token** | Jeton d'authentification pour l'envoi de messages |
| **Channel Secret** | Clé pour vérifier la signature du Webhook |
| **Webhook URL** | Point de terminaison où Clawdbot reçoit les événements LINE (doit être HTTPS) |
| **DM Policy** | Stratégie de contrôle d'accès pour les expéditeurs inconnus (pairing/allowlist/open/disabled) |
| **Rich Menu** | Menu fixe de LINE, les utilisateurs peuvent cliquer pour déclencher rapidement des actions |

## 🎒 Prérequis

### Comptes et outils nécessaires

| Élément | Exigence | Méthode d'obtention |
|--- | --- | ---|
| **Compte LINE Developers** | Inscription gratuite | https://developers.line.biz/console/ |
| **LINE Provider** | Créer Provider et canal Messaging API | LINE Console |
| **Serveur HTTPS** | Le Webhook doit être HTTPS | ngrok, Cloudflare Tunnel, Tailscale Serve/Funnel |

::: tip Méthodes d'exposition recommandées
Si vous développez en local, vous pouvez utiliser :
- **ngrok** : `ngrok http 18789`
- **Tailscale Funnel** : `gateway.tailscale.mode = "funnel"`
- **Cloudflare Tunnel** : Gratuit et stable
:::

## Suivez les étapes

### Étape 1 : Installer le plugin LINE

**Pourquoi**
Le canal LINE est implémenté via un plugin, il doit être installé d'abord.

```bash
clawdbot plugins install @clawdbot/line
```

**Ce que vous devriez voir** :
```
✓ Installed @clawdbot/line plugin
```

::: tip Développement local
Si vous exécutez à partir du code source, vous pouvez utiliser l'installation locale :
```bash
clawdbot plugins install ./extensions/line
```
:::

### Étape 2 : Créer un canal LINE Messaging API

**Pourquoi**
Besoin d'obtenir le `Channel Access Token` et le `Channel Secret` pour configurer Clawdbot.

#### 2.1 Connectez-vous à LINE Developers Console

Visitez : https://developers.line.biz/console/

#### 2.2 Créer un Provider (si vous n'en avez pas encore)

1. Cliquez sur "Create new provider"
2. Entrez le nom du Provider (par exemple `Clawdbot`)
3. Cliquez sur "Create"

#### 2.3 Ajouter un canal Messaging API

1. Sous le Provider, cliquez sur "Add channel" → Sélectionnez "Messaging API"
2. Définissez les informations du canal :
   - Channel name: `Clawdbot AI Assistant`
   - Channel description: `Personal AI assistant powered by Clawdbot`
   - Category: `Communication`
   - Subcategory: `Bot`
3. Cochez "Agree" → Cliquez sur "Create"

#### 2.4 Activer le Webhook

1. Sur la page de configuration du canal, recherchez l'onglet "Messaging API"
2. Cliquez sur l'interrupteur "Use webhook" → Définissez sur ON
3. Copiez les informations suivantes :

| Élément | Emplacement | Exemple |
|--- | --- | ---|
| **Channel Access Token** | Basic settings → Channel access token (long-lived) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Channel Secret** | Basic settings → Channel secret | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7` |

::: warning Conservez les informations d'identification !
Le Channel Access Token et le Channel Secret sont des informations sensibles, gardez-les soigneusement et ne les divulguez pas dans des dépôts publics.
:::

### Étape 3 : Configurer le canal LINE de Clawdbot

**Pourquoi**
Configurer le Gateway pour utiliser LINE Messaging API afin d'envoyer et de recevoir des messages.

#### Méthode A : Configuration via ligne de commande

```bash
clawdbot configure
```

L'assistant vous demandera :
- Si vous souhaitez activer le canal LINE
- Channel Access Token
- Channel Secret
- Stratégie DM (par défaut `pairing`)

#### Méthode B : Modifier directement le fichier de configuration

Modifiez `~/.clawdbot/clawdbot.json` :

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
      channelSecret: "YOUR_CHANNEL_SECRET",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    }
  }
}
```

::: tip Utiliser les variables d'environnement
Vous pouvez également configurer via des variables d'environnement (uniquement pour le compte par défaut) :
```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_token_here"
export LINE_CHANNEL_SECRET="your_secret_here"
```
:::

#### Méthode C : Utiliser un fichier pour stocker les informations d'identification

Une méthode plus sécurisée consiste à stocker les informations d'identification dans un fichier séparé :

```json5
{
  channels: {
    line: {
      enabled: true,
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
      dmPolicy: "pairing"
    }
  }
}
```

### Étape 4 : Configurer l'URL du Webhook

**Pourquoi**
LINE a besoin de l'URL du Webhook pour pousser les événements de messages vers Clawdbot.

#### 4.1 Assurez-vous que votre Gateway est accessible depuis l'extérieur

Si vous développez en local, vous devez utiliser un service de tunnel :

```bash
# Utiliser ngrok
ngrok http 18789

# La sortie affichera l'URL HTTPS, par exemple :
# Forwarding: https://abc123.ngrok.io -> http://localhost:18789
```

#### 4.2 Configurer l'URL du Webhook dans LINE Console

1. Sur la page de configuration de Messaging API, recherchez "Webhook settings"
2. Entrez l'URL du Webhook :
   ```
   https://your-gateway-host/line/webhook
   ```
   - Chemin par défaut : `/line/webhook`
   - Peut être personnalisé via `channels.line.webhookPath`
3. Cliquez sur "Verify" → Confirmez que LINE peut accéder à votre Gateway

**Ce que vous devriez voir** :
```
✓ Webhook URL verification succeeded
```

#### 4.3 Activer les types d'événements nécessaires

Dans Webhook settings, cochez les événements suivants :

| Événement | Usage |
|--- | ---|
| **Message event** | Recevoir les messages envoyés par les utilisateurs |
| **Follow event** | L'utilisateur ajoute le Bot comme ami |
| **Unfollow event** | L'utilisateur supprime le Bot |
| **Join event** | Le Bot rejoint un groupe |
| **Leave event** | Le Bot quitte un groupe |
| **Postback event** | Réponses rapides et clics sur boutons |

### Étape 5 : Démarrer le Gateway

**Pourquoi**
Le Gateway doit fonctionner pour recevoir les événements Webhook de LINE.

```bash
clawdbot gateway --verbose
```

**Ce que vous devriez voir** :
```
✓ Gateway listening on ws://127.0.0.1:18789
✓ LINE webhook server started on /line/webhook
✓ LINE plugin initialized
```

### Étape 6 : Tester le canal LINE

**Pourquoi**
Vérifier que la configuration est correcte et que l'assistant IA répond normalement.

#### 6.1 Ajouter le Bot comme ami

1. Dans LINE Console → Messaging API → Channel settings
2. Copiez "Basic ID" ou "QR Code"
3. Recherchez ou scannez le QR Code dans LINE App, ajoutez le Bot comme ami

#### 6.2 Envoyer un message de test

Envoyez un message au Bot dans LINE :
```
Bonjour, aide-moi à résumer la météo d'aujourd'hui.
```

**Ce que vous devriez voir** :
- Le Bot affiche l'état "typing" (si les indicateurs de frappe sont configurés)
- L'assistant IA renvoie la réponse en streaming
- Le message s'affiche correctement dans LINE

### Étape 7 : Vérification de l'appariement DM (optionnel)

**Pourquoi**
Si vous utilisez `dmPolicy="pairing"` par défaut, les expéditeurs inconnus doivent d'abord être approuvés.

#### Consulter les demandes d'appariement en attente

```bash
clawdbot pairing list line
```

**Ce que vous devriez voir** :
```
Pending pairing requests for LINE:
  CODE: ABC123 - User ID: U1234567890abcdef1234567890ab
```

#### Approuver les demandes d'appariement

```bash
clawdbot pairing approve line ABC123
```

**Ce que vous devriez voir** :
```
✓ Approved pairing request for LINE user U1234567890abcdef1234567890ab
```

::: info Explication de la stratégie DM
- `pairing` (par défaut) : Les expéditeurs inconnus reçoivent un code d'appariement, les messages sont ignorés jusqu'à l'approbation
- `allowlist` : Seuls les utilisateurs de la liste blanche peuvent envoyer des messages
- `open` : Tout le monde peut envoyer des messages (à utiliser avec prudence)
- `disabled` : Désactiver les messages privés
:::

## Point de contrôle ✅

Vérifiez si votre configuration est correcte :

| Élément à vérifier | Méthode de vérification | Résultat attendu |
|--- | --- | ---|
| **Plugin installé** | `clawdbot plugins list` | Voir `@clawdbot/line` |
| **Configuration valide** | `clawdbot doctor` | Aucune erreur liée à LINE |
| **Webhook accessible** | Vérification LINE Console | `✓ Verification succeeded` |
| **Bot accessible** | Ajouter un ami et envoyer un message dans LINE | L'assistant IA répond normalement |
| **Mécanisme d'appariement** | Utiliser un nouvel utilisateur pour envoyer un DM | Recevoir un code d'appariement (si stratégie pairing utilisée) |

## Pièges à éviter

### Problème courant 1 : Échec de la vérification du Webhook

**Symptôme** :
```
Webhook URL verification failed
```

**Causes** :
- L'URL du Webhook n'est pas HTTPS
- Le Gateway ne fonctionne pas ou le port est incorrect
- Le pare-feu bloque les connexions entrantes

**Solution** :
1. Assurez-vous d'utiliser HTTPS : `https://your-gateway-host/line/webhook`
2. Vérifiez si le Gateway fonctionne : `clawdbot gateway status`
3. Vérifiez le port : `netstat -an | grep 18789`
4. Utilisez un service de tunnel (ngrok/Tailscale/Cloudflare)

### Problème courant 2 : Impossible de recevoir des messages

**Symptômes** :
- La vérification du Webhook réussit
- Mais envoyer un message au Bot n'obtient aucune réponse

**Causes** :
- Le chemin du Webhook est configuré de manière incorrecte
- Les types d'événements ne sont pas activés
- Le `channelSecret` dans le fichier de configuration ne correspond pas

**Solution** :
1. Vérifiez si `channels.line.webhookPath` correspond à LINE Console
2. Assurez-vous que "Message event" est activé dans LINE Console
3. Vérifiez que le `channelSecret` est copié correctement (sans espaces supplémentaires)

### Problème courant 3 : Échec du téléchargement de médias

**Symptôme** :
```
Error downloading LINE media: size limit exceeded
```

**Cause** :
- Le fichier média dépasse la limite par défaut (10 Mo)

**Solution** :
Augmentez la limite dans la configuration :
```json5
{
  channels: {
    line: {
      mediaMaxMb: 25  // Limite officielle LINE 25 Mo
    }
  }
}
```

### Problème courant 4 : Pas de réponse aux messages de groupe

**Symptômes** :
- Les DM fonctionnent normalement
- Envoyer des messages dans un groupe n'obtient aucune réponse

**Causes** :
- Par défaut `groupPolicy="allowlist"`, le groupe n'est pas dans la liste blanche
- Le Bot n'est pas @mentionné dans le groupe

**Solution** :
1. Ajoutez l'ID du groupe à la liste blanche dans la configuration :
```json5
{
  channels: {
    line: {
      groupAllowFrom: ["C1234567890abcdef1234567890ab"]
    }
  }
}
```

2. Ou @mentionnez le Bot dans le groupe : `@Clawdbot aide-moi à traiter cette tâche`

## Fonctionnalités avancées

### Messages riches (modèles Flex et réponses rapides)

Clawdbot prend en charge les messages riches LINE, y compris les cartes Flex, les réponses rapides, les informations de localisation, etc.

#### Envoyer des réponses rapides

```json5
{
  text: "Que puis-je faire pour vous aujourd'hui ?",
  channelData: {
    line: {
      quickReplies: ["Vérifier la météo", "Définir un rappel", "Générer du code"]
    }
  }
}
```

#### Envoyer une carte Flex

```json5
{
  text: "Carte de statut",
  channelData: {
    line: {
      flexMessage: {
        altText: "Statut du serveur",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            contents: [
              {
                type: "text",
                text: "CPU: 45%"
              },
              {
                type: "text",
                text: "Mémoire: 2.1 Go"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### Envoyer des informations de localisation

```json5
{
  text: "Voici l'emplacement de mon bureau",
  channelData: {
    line: {
      location: {
        title: "Bureau",
        address: "123 Main St, San Francisco",
        latitude: 37.7749,
        longitude: -122.4194
      }
    }
  }
}
```

### Rich Menu (menu fixe)

Le Rich Menu est le menu fixe de LINE, les utilisateurs peuvent cliquer pour déclencher rapidement des actions.

```bash
# Créer un Rich Menu
clawdbot line rich-menu create

# Télécharger l'image du menu
clawdbot line rich-menu upload --image /path/to/menu.png

# Définir comme menu par défaut
clawdbot line rich-menu set-default --rich-menu-id <MENU_ID>
```

::: info Limitations du Rich Menu
- Dimensions de l'image : 2500x1686 ou 2500x843 pixels
- Format de l'image : PNG ou JPEG
- Maximum 10 éléments de menu
:::

### Conversion Markdown

Clawdbot convertit automatiquement le format Markdown en format pris en charge par LINE :

| Markdown | Résultat de conversion LINE |
|--- | ---|
| Blocs de code | Carte Flex |
| Tableaux | Carte Flex |
| Liens | Détecté et converti automatiquement en carte Flex |
| Gras/italique | Supprimé (LINE ne prend pas en charge) |

::: tip Préserver le format
LINE ne prend pas en charge le format Markdown, Clawdbot essaiera de le convertir en carte Flex. Si vous souhaitez du texte brut, vous pouvez désactiver la conversion automatique dans la configuration.
:::

## Résumé de la leçon

Ce tutoriel a présenté :

1. ✅ Installation du plugin LINE
2. ✅ Création d'un canal LINE Messaging API
3. ✅ Configuration du Webhook et des informations d'identification
4. ✅ Configuration du contrôle d'accès (appariement DM, liste blanche de groupes)
5. ✅ Envoi de messages riches (Flex, réponses rapides, localisation)
6. ✅ Utilisation du Rich Menu
7. ✅ Résolution des problèmes courants

Le canal LINE offre de riches types de messages et des méthodes d'interaction, très adaptés pour construire une expérience d'assistant IA personnalisée sur LINE.

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprenons le **[Interface WebChat](../webchat/)**.
>
> Vous apprendrez :
> - Comment accéder à l'interface WebChat via le navigateur
> - Les fonctionnalités principales de WebChat (gestion des sessions, téléchargement de pièces jointes, support Markdown)
> - Configuration de l'accès à distance (tunnel SSH, Tailscale)
> - Comprendre les différences entre WebChat et d'autres canaux

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Numéro de ligne |
|--- | --- | ---|
| Implémentation principale du LINE Bot | [`src/line/bot.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot.ts) | 27-83 |
| Définition du schéma de configuration | [`src/line/config-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/config-schema.ts) | 1-54 |
| Gestionnaire d'événements Webhook | [`src/line/bot-handlers.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot-handlers.ts) | 1-100 |
| Fonction d'envoi de messages | [`src/line/send.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/send.ts) | - |
| Génération de modèles Flex | [`src/line/flex-templates.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/flex-templates.ts) | - |
| Opérations Rich Menu | [`src/line/rich-menu.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/rich-menu.ts) | - |
| Messages de modèle | [`src/line/template-messages.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/template-messages.ts) | - |
| Markdown vers LINE | [`src/line/markdown-to-line.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/markdown-to-line.ts) | - |
| Serveur Webhook | [`src/line/webhook.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/webhook.ts) | - |

**Champs de configuration clés** :
- `channelAccessToken`: LINE Channel Access Token (`config-schema.ts:19`)
- `channelSecret`: LINE Channel Secret (`config-schema.ts:20`)
- `dmPolicy`: Stratégie d'accès DM (`config-schema.ts:26`)
- `groupPolicy`: Stratégie d'accès aux groupes (`config-schema.ts:27`)
- `mediaMaxMb`: Limite de taille des médias (`config-schema.ts:28`)
- `webhookPath`: Chemin Webhook personnalisé (`config-schema.ts:29`)

**Fonctions clés** :
- `createLineBot()`: Créer une instance LINE Bot (`bot.ts:27`)
- `handleLineWebhookEvents()`: Traiter les événements Webhook LINE (`bot-handlers.ts:100`)
- `sendMessageLine()`: Envoyer un message LINE (`send.ts`)
- `createFlexMessage()`: Créer un message Flex (`send.ts:20`)
- `createQuickReplyItems()`: Créer des réponses rapides (`send.ts:21`)

**Stratégies DM prises en charge** :
- `open`: Accès ouvert
- `allowlist`: Mode liste blanche
- `pairing`: Mode d'appariement (par défaut)
- `disabled`: Désactivé

**Stratégies de groupe prises en charge** :
- `open`: Accès ouvert
- `allowlist`: Mode liste blanche (par défaut)
- `disabled`: Désactivé

</details>
