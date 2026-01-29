---
title: "Vue d'ensemble du système multicanaux : guide complet des 13+ canaux de communication pris en charge par Clawdbot | Tutoriel Clawdbot"
sidebarTitle: "Choisir le bon canal"
subtitle: "Vue d'ensemble du système multicanaux : tous les canaux de communication pris en charge par Clawdbot"
description: "Découvrez les 13+ canaux de communication pris en charge par Clawdbot (WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, LINE, etc.). Maîtrisez les méthodes d'authentification, les caractéristiques et les cas d'usage de chaque canal, choisissez le canal le plus adapté pour commencer la configuration. Le couvre la protection par appariement DM, le traitement des messages de groupe et les méthodes de configuration."
tags:
  - "Canal"
  - "Plateforme"
  - "Multicanaux"
  - "Prise en main"
prerequisite:
  - "start-getting-started"
order: 60
---

# Vue d'ensemble du système multicanaux : tous les canaux de communication pris en charge par Clawdbot

## Ce que vous serez capable de faire

Après avoir terminé ce tutoriel, vous serez capable de :

- ✅ Comprendre les 13+ canaux de communication pris en charge par Clawdbot
- ✅ Maîtriser les méthodes d'authentification et les points de configuration de chaque canal
- ✅ Choisir le canal le plus adapté en fonction de vos cas d'usage
- ✅ Comprendre la valeur de sécurité du mécanisme de protection par appariement DM

## Votre problème actuel

Vous vous demandez peut-être :

- "Quelles plates-formes Clawdbot prend-il en charge ?"
- "Quelles sont les différences entre WhatsApp, Telegram et Slack ?"
- "Quel canal est le plus simple et le plus rapide ?"
- "Dois-je inscrire un bot sur chaque plate-forme ?"

La bonne nouvelle est que : **Clawdbot offre un large choix de canaux, vous pouvez combiner librement selon vos habitudes et vos besoins**.

## Quand utiliser cette approche

Quand vous avez besoin de :

- 🌐 **Gestion multicanaux unifiée** — Un assistant AI disponible simultanément sur plusieurs canaux
- 🤝 **Collaboration en équipe** — Intégration aux lieux de travail comme Slack, Discord, Google Chat
- 💬 **Messagerie personnelle** — Outils de communication quotidiens comme WhatsApp, Telegram, iMessage
- 🔧 **Extension flexible** — Prise en charge de plates-formes régionales comme LINE, Zalo

::: tip Valeur des canaux multiples
Les avantages d'utiliser plusieurs canaux :
- **Passage transparent** : WhatsApp à la maison, Slack au travail, Telegram en déplacement
- **Synchronisation multi-appareils** : Les messages et conversations restent cohérents sur tous les canaux
- **Couverture des scénarios** : Chaque plate-forme a ses avantages, leur combinaison est optimale
:::

---

## Concept central

Le système de canaux de Clawdbot adopte une **architecture modulaire** :

```
┌─────────────────────────────────────────────────┐
│              Gateway (plan de contrôle)          │
│         ws://127.0.0.1:18789                  │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┼───────┬─────────┬───────┐
        │       │       │         │       │
    WhatsApp  Telegram  Slack  Discord  ... et 13+ autres canaux
        │       │       │         │       │
    Baileys  grammY   Bolt  discord.js ...
```

**Concepts clés** :

| Concept         | Rôle                         |
| --------------- | ---------------------------- |
| **Plugin de canal** | Chaque canal est un plugin indépendant |
| **Interface unifiée** | Tous les canaux utilisent la même API |
| **Protection DM**   | Mécanisme d'appariement activé par défaut, refuse les expéditeurs inconnus |
| **Support des groupes**  | Prise en charge des mentions @mention et des déclencheurs de commande |

---

## Vue d'ensemble des canaux pris en charge

Clawdbot prend en charge **13+ canaux de communication**, répartis en deux catégories :

### Canaux principaux (intégrés)

| Canal           | Méthode d'authentification             | Difficulté | Caractéristiques                              |
| -------------- | -------------------- | ---- | --------------------------------- |
| **Telegram**   | Bot Token            | ⭐   | Le plus simple et rapide, recommandé aux débutants                |
| **WhatsApp**   | QR Code / Lien téléphonique | ⭐⭐  | Utilise un vrai numéro, recommandé : téléphone séparé + eSIM |
| **Slack**      | Bot Token + App Token | ⭐⭐ | Choix des lieux de travail, Mode Socket         |
| **Discord**    | Bot Token            | ⭐⭐  | Scénarios de communauté et de jeux, fonctionnalités riches         |
| **Google Chat** | OAuth / Compte de service | ⭐⭐⭐ | Intégration entreprise Google Workspace        |
| **Signal**     | signal-cli           | ⭐⭐⭐ | Haute sécurité, configuration complexe              |
| **iMessage**   | imsg (macOS)        | ⭐⭐⭐ | Exclusif macOS, encore en développement          |

### Canaux étendus (plugins externes)

| Canal             | Méthode d'authentification             | Type       | Caractéristiques                              |
| ---------------- | -------------------- | ---------- | --------------------------------- |
| **WebChat**       | Gateway WebSocket     | Intégré       | Pas d'authentification tierce, le plus simple            |
| **LINE**          | Messaging API        | Plugin externe   | Populaire chez les utilisateurs asiatiques                       |
| **BlueBubbles**   | API privée         | Plugin d'extension   | Extension iMessage, prend en charge les appareils distants       |
| **Microsoft Teams** | Bot Framework       | Plugin d'extension   | Collaboration entreprise                           |
| **Matrix**        | Matrix Bot SDK      | Plugin d'extension   | Communication décentralisée                       |
| **Zalo**         | Zalo OA             | Plugin d'extension   | Populaire chez les utilisateurs vietnamiens                       |
| **Zalo Personnel** | Compte personnel     | Plugin d'extension   | Compte personnel Zalo                       |

::: info Comment choisir un canal ?
- **Débutant** : Commencez avec Telegram ou WebChat
- **Usage personnel** : WhatsApp (si vous avez déjà un numéro), Telegram
- **Collaboration en équipe** : Slack, Google Chat, Discord
- **Confidentialité prioritaire** : Signal
- **Écosystème Apple** : iMessage, BlueBubbles
:::

---

## Détail des canaux principaux

### 1. Telegram (recommandé aux débutants)

**Pourquoi recommandé** :
- ⚡ Processus de configuration le plus simple (seul le Bot Token nécessaire)
- 📱 Prise en charge native de Markdown et des médias riches
- 🌍 Disponible mondialement, pas besoin d'environnement réseau spécial

**Méthode d'authentification** :
1. Trouvez `@BotFather` dans Telegram
2. Envoyez la commande `/newbot`
3. Configurez le nom du bot selon les instructions
4. Obtenez le Bot Token (format : `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`)

**Exemple de configuration** :
```yaml
channels:
  telegram:
    botToken: "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"  # Protection par appariement DM par défaut
    allowFrom: ["*"]     # Autoriser tous les utilisateurs (après appariement)
```

**Caractéristiques** :
- ✅ Prise en charge des fils/sujets (Thread/Topic)
- ✅ Prise en charge des réactions (Reaction)
- ✅ Prise en charge des fichiers, images et vidéos

---

### 2. WhatsApp (recommandé pour les utilisateurs personnels)

**Pourquoi recommandé** :
- 📱 Utilise un vrai numéro de téléphone, les amis n'ont pas besoin d'ajouter un nouveau contact
- 🌍 L'outil de messagerie instantanée le plus populaire au monde
- 📞 Prise en charge des messages vocaux et des appels

**Méthode d'authentification** :
1. Exécutez `clawdbot channels login whatsapp`
2. Scannez le code QR (similaire à WhatsApp Web)
3. Ou utilisez le lien téléphonique (nouvelle fonctionnalité)

**Exemple de configuration** :
```yaml
channels:
  whatsapp:
    accounts:
      my-phone:
        dmPolicy: "pairing"  # Protection par appariement DM par défaut
        allowFrom: ["*"]     # Autoriser tous les utilisateurs (après appariement)
```

**Caractéristiques** :
- ✅ Prise en charge des médias riches (images, vidéos, documents)
- ✅ Prise en charge des messages vocaux
- ✅ Prise en charge des réactions (Reaction)
- ⚠️ **Nécessite un téléphone séparé** (recommandé : eSIM + appareil de secours)

::: warning Limitations de WhatsApp
- Ne vous connectez pas au même numéro à plusieurs endroits simultanément
- Évitez les reconnexions fréquentes (risque de blocage temporaire)
- Recommandé d'utiliser un numéro de test séparé
:::

---

### 3. Slack (recommandé pour la collaboration en équipe)

**Pourquoi recommandé** :
- 🏢 Large adoption par les entreprises et les équipes
- 🔧 Prise en charge riche des Actions et des commandes slash
- 📋 Intégration transparente avec les flux de travail

**Méthode d'authentification** :
1. Créez une application sur [Slack API](https://api.slack.com/apps)
2. Activez les scopes Bot Token
3. Activez le Token d'application (App-Level Token)
4. Activez le Mode Socket
5. Obtenez le Bot Token et le App Token

**Exemple de configuration** :
```yaml
channels:
  slack:
    botToken: "xoxb-YOUR-BOT-TOKEN-HERE"
    appToken: "xapp-YOUR-APP-TOKEN-HERE"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**Caractéristiques** :
- ✅ Prise en charge des canaux, discussions privées et groupes
- ✅ Prise en charge des Slack Actions (créer un canal, inviter des utilisateurs, etc.)
- ✅ Prise en charge du téléchargement de fichiers et des émojis
- ⚠️ Nécessite d'activer le Mode Socket (pour éviter d'exposer le port)

---

### 4. Discord (recommandé pour les scénarios de communauté)

**Pourquoi recommandé** :
- 🎮 Choix principal pour les scénarios de jeux et de communauté
- 🤖 Prise en charge des fonctionnalités spécifiques à Discord (rôles, gestion des canaux)
- 👥 Fonctionnalités puissantes de groupes et de communauté

**Méthode d'authentification** :
1. Créez une application sur le [Discord Developer Portal](https://discord.com/developers/applications)
2. Créez un utilisateur Bot
3. Activez l'intention de contenu de message (Message Content Intent)
4. Obtenez le Bot Token

**Exemple de configuration** :
```yaml
channels:
  discord:
    botToken: "MTIzNDU2Nzg5MDEyMzQ1Njgw.GhIJKlmNoPQRsTUVwxyZABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**Caractéristiques** :
- ✅ Prise en charge de la gestion des rôles et des permissions
- ✅ Prise en charge des canaux, fils et émojis
- ✅ Prise en charge des Actions spécifiques (créer un canal, gérer les rôles, etc.)
- ⚠️ Nécessite de configurer correctement les Intents

---

### 5. Autres canaux principaux

#### Google Chat
- **Scénario d'usage** : Utilisateurs entreprise Google Workspace
- **Méthode d'authentification** : OAuth ou Compte de service
- **Caractéristiques** : Intégration avec Gmail et Calendar

#### Signal
- **Scénario d'usage** : Utilisateurs privilégiant la confidentialité
- **Méthode d'authentification** : signal-cli
- **Caractéristiques** : Chiffrement de bout en bout, haute sécurité

#### iMessage
- **Scénario d'usage** : Utilisateurs macOS
- **Méthode d'authentification** : imsg (exclusif macOS)
- **Caractéristiques** : Intégration écosystème Apple, encore en développement

---

## Présentation des canaux étendus

### WebChat (le plus simple)

**Pourquoi recommandé** :
- 🚀 Pas besoin de compte tiers ou de Token
- 🌐 Prise en charge intégrée du WebSocket Gateway
- 🔧 Développement et débogage rapides

**Mode d'utilisation** :

Après avoir démarré le Gateway, accédez directement via :
- **Application macOS/iOS** : Interface SwiftUI native
- **Control UI** : Accès via le navigateur à l'onglet chat de la console

**Caractéristiques** :
- ✅ Pas de configuration nécessaire, prêt à l'emploi
- ✅ Prise en charge des tests et du débogage
- ✅ Partage des conversations et règles de routage avec d'autres canaux
- ⚠️ Accès local uniquement (peut être exposé via Tailscale)

---

### LINE (utilisateurs asiatiques)

**Scénario d'usage** : Utilisateurs LINE au Japon, à Taiwan, en Thaïlande, etc.

**Méthode d'authentification** : Messaging API (LINE Developers Console)

**Caractéristiques** :
- ✅ Prise en charge des boutons et des réponses rapides
- ✅ Large utilisation sur le marché asiatique
- ⚠️ Nécessite une vérification et un compte commercial

---

### BlueBubbles (extension iMessage)

**Scénario d'usage** : Besoin d'accès iMessage à distance

**Méthode d'authentification** : API privée

**Caractéristiques** :
- ✅ Contrôle distant d'iMessage
- ✅ Prise en charge de plusieurs appareils
- ⚠️ Nécessite un serveur BlueBubbles séparé

---

### Microsoft Teams (collaboration entreprise)

**Scénario d'usage** : Entreprises utilisant Office 365

**Méthode d'authentification** : Bot Framework

**Caractéristiques** :
- ✅ Intégration profonde avec Teams
- ✅ Prise en charge des Adaptive Cards
- ⚠️ Configuration complexe

---

### Matrix (décentralisé)

**Scénario d'usage** : Passionnés de communication décentralisée

**Méthode d'authentification** : Matrix Bot SDK

**Caractéristiques** :
- ✅ Réseau fédéré
- ✅ Chiffrement de bout en bout
- ⚠️ Nécessite de configurer un Homeserver

---

### Zalo / Zalo Personnel (utilisateurs vietnamiens)

**Scénario d'usage** : Marché vietnamien

**Méthode d'authentification** : Zalo OA / Compte personnel

**Caractéristiques** :
- ✅ Prise en charge des comptes personnels et d'entreprise
- ⚠️ Restriction régionale (Vietnam)

---

## Mécanisme de protection par appariement DM

### Qu'est-ce que la protection par appariement DM ?

Clawdbot active par défaut la **protection par appariement DM** (`dmPolicy="pairing"`), qui est une caractéristique de sécurité :

1. Un **expéditeur inconnu** reçoit un code d'appariement
2. Les messages ne sont pas traités tant que vous n'approuvez pas l'appariement
3. Une fois approuvé, l'expéditeur est ajouté à la liste blanche locale

::: warning Pourquoi la protection par appariement est-elle nécessaire ?
Clawdbot se connecte à de vraies plates-formes de messagerie, **doit considérer les DM entrants comme des entrées non fiables**. La protection par appariement peut :
- Empêcher les messages indésirables et les abus
- Éviter le traitement de commandes malveillantes
- Protéger votre quota AI et votre confidentialité
:::

### Comment approuver un appariement ?

```bash
# Afficher les demandes d'appariement en attente
clawdbot pairing list

# Approuver un appariement
clawdbot pairing approve <canal> <code>

# Exemple : approuver un expéditeur Telegram
clawdbot pairing approve telegram 123456
```

### Exemple de flux d'appariement

```
Expéditeur inconnu : Hello AI !
Clawdbot : 🔒 Veuillez d'abord faire un appariement. Code d'appariement : ABC123
Votre action : clawdbot pairing approve telegram ABC123
Clawdbot : ✅ Appariement réussi ! Vous pouvez maintenant envoyer des messages.
```

::: tip Désactiver la protection par appariement DM (non recommandé)
Si vous souhaitez un accès public, vous pouvez définir :
```yaml
channels:
  telegram:
    dmPolicy: "open"
    allowFrom: ["*"]  # Autoriser tous les utilisateurs
```

⚠️ Cela réduit la sécurité, utilisez avec prudence !
:::

---

## Traitement des messages de groupe

### Déclenchement par @mention

Par défaut, les messages de groupe nécessitent une **@mention** du bot pour répondre :

```yaml
channels:
  slack:
    allowUnmentionedGroups: false  # Par défaut : nécessite @mention
```

### Déclenchement par commande

Vous pouvez également utiliser un préfixe de commande pour déclencher :

```bash
# Envoyer dans un groupe
/ask Expliquez l'intrication quantique
/help Lister les commandes disponibles
/new Démarrer une nouvelle conversation
```

### Exemple de configuration

```yaml
channels:
  discord:
    allowUnmentionedGroups: false  # Nécessite @mention
    # ou
    allowUnmentionedGroups: true   # Répondre à tous les messages (non recommandé)
```

---

## Configuration des canaux : Assistant vs Manuel

### Méthode A : Utiliser l'assistant d'intégration (recommandé)

```bash
clawdbot onboard
```

L'assistant vous guidera pour :
1. Choisir un canal
2. Configurer l'authentification (Token, API Key, etc.)
3. Définir la stratégie DM
4. Tester la connexion

### Méthode B : Configuration manuelle

Modifiez le fichier de configuration `~/.clawdbot/clawdbot.json` :

```yaml
channels:
  telegram:
    botToken: "your-bot-token"
    dmPolicy: "pairing"
    allowFrom: ["*"]
  whatsapp:
    accountId: "my-phone"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

Redémarrez le Gateway pour appliquer la configuration :

```bash
clawdbot gateway restart
```

---

## Point de contrôle ✅

Après avoir terminé ce tutoriel, vous devriez être capable de :

- [ ] Lister tous les canaux pris en charge par Clawdbot
- [ ] Comprendre le mécanisme de protection par appariement DM
- [ ] Choisir le canal le plus adapté pour vous
- [ ] Savoir comment configurer un canal (assistant ou manuel)
- [ ] Comprendre les modes de déclenchement des messages de groupe

::: info Étape suivante
Choisissez un canal et commencez la configuration :
- [Configuration du canal WhatsApp](../whatsapp/) - Utiliser un vrai numéro
- [Configuration du canal Telegram](../telegram/) - Le plus simple et rapide
- [Configuration du canal Slack](../slack/) - Choix pour la collaboration en équipe
- [Configuration du canal Discord](../discord/) - Scénarios de communauté
:::

---

## Avertissements d'erreurs courantes

### ❌ Oublier d'activer la protection par appariement DM

**Mauvaise pratique** :
```yaml
channels:
  telegram:
    dmPolicy: "open"  # Trop ouvert !
```

**Bonne pratique** :
```yaml
channels:
  telegram:
    dmPolicy: "pairing"  # Sécurité par défaut
```

::: danger Risque de DM ouvert
Ouvrir les DM signifie que n'importe qui peut envoyer des messages à votre assistant AI, ce qui peut entraîner :
- Abus de quota
- Fuite de confidentialité
- Exécution de commandes malveillantes
:::

### ❌ WhatsApp connecté à plusieurs endroits

**Mauvaise pratique** :
- Connecter le même numéro simultanément sur le téléphone et Clawdbot
- Reconnexions fréquentes de WhatsApp

**Bonne pratique** :
- Utiliser un numéro de test séparé
- Éviter les reconnexions fréquentes
- Surveiller l'état de connexion

### ❌ Socket Mode Slack non activé

**Mauvaise pratique** :
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    # appToken manquant
```

**Bonne pratique** :
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    appToken: "xapp-..."  # Requis
```

### ❌ Configuration incorrecte des Intents Discord

**Mauvaise pratique** :
- Activer uniquement les Intents de base
- Oublier d'activer l'intention de contenu de message (Message Content Intent)

**Bonne pratique** :
- Activer tous les Intents requis dans le Discord Developer Portal
- En particulier l'intention de contenu de message (Message Content Intent)

---

## Résumé de la leçon

Dans cette leçon, vous avez appris :

1. ✅ **Vue d'ensemble des canaux** : Clawdbot prend en charge 13+ canaux de communication
2. ✅ **Canaux principaux** : Caractéristiques et configuration de Telegram, WhatsApp, Slack, Discord
3. ✅ **Canaux étendus** : Canaux spécifiques comme LINE, BlueBubbles, Teams, Matrix
4. ✅ **Protection DM** : Valeur de sécurité et méthode d'utilisation du mécanisme d'appariement
5. ✅ **Traitement des groupes** : Mécanismes de @mention et de déclenchement par commande
6. ✅ **Méthodes de configuration** : Assistant et configuration manuelle

**Prochaine étape** :

- Apprendre [la configuration du canal WhatsApp](../whatsapp/), configurer un vrai numéro
- Apprendre [la configuration du canal Telegram](../telegram/), le moyen le plus rapide de démarrer
- Comprendre [la configuration du canal Slack](../slack/), intégration de collaboration en équipe
- Maîtriser [la configuration du canal Discord](../discord/), scénarios de communauté

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[la configuration du canal WhatsApp](../whatsapp/)**.
>
> Vous apprendrez :
> - Comment vous connecter à WhatsApp via QR Code ou lien téléphonique
> - Comment configurer la stratégie DM et les règles de groupe
> - Comment gérer plusieurs comptes WhatsApp
> - Comment résoudre les problèmes de connexion WhatsApp

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-27

| Fonction            | Chemin du fichier                                                                                               | Ligne    |
| --------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| Registre des canaux       | [`src/channels/registry.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.ts) | 7-100   |
| Répertoire des plugins de canaux   | [`src/channels/plugins/`](https://github.com/clawdbot/clawdbot/tree/main/src/channels/plugins/) | Répertoire entier  |
| Types de métadonnées de canal   | [`src/channels/plugins/types.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/types.core.ts) | 74-93   |
| Mécanisme d'appariement DM     | [`src/channels/plugins/pairing.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/pairing.ts) | Fichier entier  |
| @mention de groupe | [`src/channels/plugins/group-mentions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/group-mentions.ts) | Fichier entier  |
| Correspondance liste blanche     | [`src/channels/plugins/allowlist-match.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/allowlist-match.ts) | Fichier entier  |
| Configuration du répertoire de canaux   | [`src/channels/plugins/directory-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/directory-config.ts) | Fichier entier  |
| Plugin WhatsApp | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | Fichier entier  |
| Plugin Telegram | [`src/channels/plugins/onboarding/telegram.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/telegram.ts) | Fichier entier  |
| Plugin Slack     | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/slack.ts) | Fichier entier  |
| Plugin Discord   | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | Fichier entier  |

**Constantes clés** :
- `CHAT_CHANNEL_ORDER` : Tableau d'ordre des canaux principaux (depuis `src/channels/registry.ts:7-15`)
- `DEFAULT_CHAT_CHANNEL = "whatsapp"` : Canal par défaut (depuis `src/channels/registry.ts:21`)
- `dmPolicy="pairing"` : Stratégie d'appariement DM par défaut (depuis `README.md:110`)

**Types clés** :
- `ChannelMeta` : Interface de métadonnées de canal (depuis `src/channels/plugins/types.core.ts:74-93`)
- `ChannelAccountSnapshot` : Instantané d'état de compte de canal (depuis `src/channels/plugins/types.core.ts:95-142`)
- `ChannelSetupInput` : Interface d'entrée de configuration de canal (depuis `src/channels/plugins/types.core.ts:19-51`)

**Fonctions clés** :
- `listChatChannels()` : Lister tous les canaux principaux (`src/channels/registry.ts:114-116`)
- `normalizeChatChannelId()` : Normaliser l'ID de canal (`src/channels/registry.ts:126-133`)
- `buildChannelUiCatalog()` : Construire le catalogue UI (`src/channels/plugins/catalog.ts:213-239`)

</details>
