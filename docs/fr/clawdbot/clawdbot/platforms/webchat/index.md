---
title: "Interface WebChat : Assistant IA dans le navigateur | Tutoriel Clawdbot"
sidebarTitle: "Essayez l'interface Web"
subtitle: "Interface WebChat : Assistant IA dans le navigateur"
description: "Apprenez à utiliser l'interface WebChat intégrée de Clawdbot pour discuter avec l'assistant IA. Ce tutoriel présente l'accès à WebChat, les fonctionnalités principales (gestion de sessions, téléchargement de pièces jointes, support Markdown) et la configuration de l'accès distant (tunnel SSH, Tailscale), sans port supplémentaire ni configuration séparée."
tags:
  - "WebChat"
  - "Interface navigateur"
  - "Chat"
prerequisite:
  - "start-gateway-startup"
order: 150
---

# Interface WebChat : Assistant IA dans le navigateur

## Ce que vous saurez faire

Après avoir terminé ce tutoriel, vous serez capable de :

- ✅ Accéder à l'interface WebChat via le navigateur
- ✅ Envoyer des messages dans WebChat et recevoir les réponses de l'IA
- ✅ Gérer l'historique des sessions et changer de session
- ✅ Télécharger des pièces jointes (images, audio, vidéo)
- ✅ Configurer l'accès distant (Tailscale/tunnel SSH)
- ✅ Comprendre les différences entre WebChat et les autres canaux

## Votre situation actuelle

Vous avez peut-être déjà démarré le Gateway, mais vous souhaitez disposer d'une interface graphique plus intuitive pour discuter avec l'assistant IA, au lieu d'utiliser uniquement la ligne de commande.

Vous vous demandez peut-être :

- "Y a-t-il une interface web similaire à ChatGPT ?"
- "Quelle est la différence entre WebChat et les canaux WhatsApp/Telegram ?"
- "WebChat nécessite-t-il une configuration séparée ?"
- "Comment utiliser WebChat sur un serveur distant ?"

La bonne nouvelle est : **WebChat est l'interface de chat intégrée de Clawdbot**, sans installation ni configuration séparée. Il est prêt à l'usage une fois le Gateway démarré.

## Quand utiliser cette solution

Lorsque vous avez besoin de :

- 🖥️ **Conversation en interface graphique** : Préférez l'expérience de chat dans le navigateur plutôt que la ligne de commande
- 📊 **Gestion de sessions** : Consulter l'historique, basculer entre différentes sessions
- 🌐 **Accès local** : Discuter avec l'IA sur le même appareil
- 🔄 **Accès distant** : Accéder à un Gateway distant via tunnel SSH/Tailscale
- 💬 **Interaction en texte enrichi** : Support du format Markdown et des pièces jointes

---

## 🎒 Prérequis

Avant d'utiliser WebChat, vérifiez les éléments suivants :

### Conditions obligatoires

| Condition | Comment vérifier |
| --------- | --------------- |
| **Gateway démarré** | `clawdbot gateway status` ou vérifiez si le processus est en cours d'exécution |
| **Port accessible** | Vérifiez que le port 18789 (ou le port personnalisé) n'est pas utilisé |
| **Modèle IA configuré** | `clawdbot models list` pour vérifier qu'un modèle est disponible |

::: warning Cours préalables
Ce tutoriel suppose que vous avez déjà terminé :
- [Démarrage rapide](../../start/getting-started/) - Installation, configuration et démarrage de Clawdbot
- [Démarrer le Gateway](../../start/gateway-startup/) - Comprendre les différents modes de démarrage du Gateway

Si ce n'est pas encore fait, revenez d'abord à ces cours.
:::

### Optionnel : Configurer l'authentification

WebChat nécessite une authentification par défaut (même en accès local), pour protéger votre assistant IA.

Vérification rapide :

```bash
## Voir la configuration d'authentification actuelle
clawdbot config get gateway.auth.mode
clawdbot config get gateway.auth.token
```

Si non configuré, il est recommandé de le configurer d'abord :

```bash
## Définir l'authentification par token (recommandé)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here
```

Explications détaillées : [Configuration de l'authentification du Gateway](../../advanced/security-sandbox/).

---

## Concepts clés

### Qu'est-ce que WebChat

**WebChat** est l'interface de chat intégrée de Clawdbot, qui interagit directement avec l'assistant IA via le WebSocket du Gateway.

**Points clés** :

```
┌─────────────────────────────────────────────────────┐
│              Architecture WebChat                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Navigateur/Client                                   │
│      │                                              │
│      ▼                                              │
│  Gateway WebSocket (ws://127.0.0.1:18789)          │
│      │                                              │
│      ├─ chat.send → Agent → Traitement du message  │
│      ├─ chat.history → Retourner l'historique      │
│      ├─ chat.inject → Ajouter une note système     │
│      └─ Flux d'événements → Mise à jour en temps réel│
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Différences avec les autres canaux** :

| Caractéristique | WebChat                          | WhatsApp/Telegram, etc.                |
| -------------- | -------------------------------- | ------------------------------ |
| **Mode d'accès** | Accès direct au Gateway via navigateur | Nécessite une application tierce et une connexion |
| **Configuration requise** | Aucune configuration séparée, réutilise le port du Gateway | Nécessite une clé API/Token spécifique au canal |
| **Routage des réponses** | Renvoi déterministe vers WebChat          | Renvoi vers le canal correspondant              |
| **Accès distant** | Via tunnel SSH/Tailscale       | Fourni par la plateforme du canal         |
| **Modèle de session** | Utilise la gestion de sessions du Gateway | Utilise la gestion de sessions du Gateway        |

### Comment fonctionne WebChat

WebChat ne nécessite pas de serveur HTTP séparé ni de configuration de port. Il utilise directement le service WebSocket du Gateway.

**Points clés** :
- **Port partagé** : WebChat utilise le même port que le Gateway (par défaut 18789)
- **Aucune configuration supplémentaire** : Pas de bloc de configuration `webchat.*` dédié
- **Synchronisation en temps réel** : L'historique est récupéré du Gateway en temps réel, pas de cache local
- **Mode lecture seule** : Si le Gateway est inaccessible, WebChat passe en mode lecture seule

::: info WebChat vs Control UI
WebChat se concentre sur l'expérience de chat, tandis que le **Control UI** fournit un panneau de contrôle complet du Gateway (configuration, gestion des sessions, gestion des compétences, etc.).

- WebChat : `http://localhost:18789/chat` ou la vue de chat dans l'application macOS
- Control UI : `http://localhost:18789/` panneau de contrôle complet
:::

---

## Suivez les étapes

### Étape 1 : Accéder à WebChat

**Pourquoi**
WebChat est l'interface de chat intégrée du Gateway, sans installation de logiciel supplémentaire nécessaire.

#### Méthode 1 : Accès via navigateur

Ouvrez votre navigateur et accédez à :

```bash
## Adresse par défaut (utilisant le port par défaut 18789)
http://localhost:18789

## Ou utilisez l'adresse de bouclage (plus fiable)
http://127.0.0.1:18789
```

**Ce que vous devriez voir** :
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat                   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  [Liste de sessions]  [Paramètres]    │   │
│  └───────────────────────────────────┘   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  Bonjour ! Je suis votre assistant IA.  │   │
│  │  Comment puis-je vous aider ?        │   │
│  └───────────────────────────────────┘   │
│                                             │
│  [Saisir un message...]              [Envoyer]   │
└─────────────────────────────────────────────┘
```

#### Méthode 2 : Application macOS

Si vous avez installé l'application Clawdbot dans la barre de menus macOS :

1. Cliquez sur l'icône de la barre de menus
2. Sélectionnez "Open WebChat" ou cliquez sur l'icône de chat
3. WebChat s'ouvre dans une fenêtre indépendante

**Avantages** :
- Expérience macOS native
- Support des raccourcis clavier
- Intégration avec Voice Wake et Talk Mode

#### Méthode 3 : Raccourci en ligne de commande

```bash
## Ouvrir automatiquement le navigateur vers WebChat
clawdbot web
```

**Ce que vous devriez voir** : Le navigateur par défaut s'ouvre automatiquement et navigue vers `http://localhost:18789`

---

### Étape 2 : Envoyer votre premier message

**Pourquoi**
Vérifier que la connexion entre WebChat et le Gateway fonctionne normalement et que l'assistant IA répond correctement.

1. Saisissez votre premier message dans le champ de saisie
2. Cliquez sur le bouton "Envoyer" ou appuyez sur `Entrée`
3. Observez la réponse de l'interface de chat

**Exemple de message** :
```
Hello! I'm testing WebChat. Can you introduce yourself?
```

**Ce que vous devriez voir** :
```
┌─────────────────────────────────────────────┐
│  Vous → IA: Hello! I'm testing...      │
│                                             │
│  IA → Vous: Bonjour ! Je suis l'assistant IA Clawdbot  │
│  Je peux vous aider à répondre à des questions,          │
│  écrire du code, gérer des tâches, etc.              │
│  Comment puis-je vous aider ?            │
│                                             │
│  [Saisir un message...]              [Envoyer]   │
└─────────────────────────────────────────────┘
```

::: tip Indication d'authentification
Si le Gateway est configuré avec une authentification, l'accès à WebChat vous demandera de saisir un token ou un mot de passe :

```
┌─────────────────────────────────────────────┐
│          Authentification Gateway                   │
│                                             │
│  Saisir le Token:                             │
│  [•••••••••••••]              │
│                                             │
│              [Annuler]  [Connexion]               │
└─────────────────────────────────────────────┘
```

Saisissez votre `gateway.auth.token` ou `gateway.auth.password` configuré.
:::

---

### Étape 3 : Utiliser les fonctionnalités de WebChat

**Pourquoi**
WebChat offre de riches fonctionnalités d'interaction. Se familiariser avec ces fonctionnalités améliorera votre expérience.

#### Gestion de sessions

WebChat prend en charge la gestion multi-sessions, vous permettant de discuter avec l'IA dans différents contextes.

**Étapes** :

1. Cliquez sur la liste des sessions à gauche (ou sur le bouton "Nouvelle session")
2. Sélectionnez ou créez une nouvelle session
3. Continuez la conversation dans la nouvelle session

**Caractéristiques des sessions** :
- ✅ Contexte indépendant : L'historique des messages de chaque session est isolé
- ✅ Sauvegarde automatique : Toutes les sessions sont gérées par le Gateway, stockées de manière persistante
- ✅ Synchronisation multiplateforme : Partage des mêmes données de session avec CLI, l'application macOS, les nœuds iOS/Android

::: info Session principale
WebChat utilise par défaut la **clé de session principale** du Gateway (`main`), ce qui signifie que tous les clients (CLI, WebChat, application macOS, nœuds iOS/Android) partagent le même historique de session principale.

Si vous avez besoin d'un contexte isolé, vous pouvez définir différentes clés de session dans la configuration.
:::

#### Téléchargement de pièces jointes

WebChat prend en charge le téléchargement de pièces jointes telles que des images, de l'audio et de la vidéo.

**Étapes** :

1. Cliquez sur l'icône "Pièce jointe" à côté du champ de saisie (généralement 📎 ou 📎️)
2. Sélectionnez le fichier à télécharger (ou faites glisser le fichier vers la zone de chat)
3. Saisissez une description textuelle pertinente
4. Cliquez sur "Envoyer"

**Formats pris en charge** :
- 📷 **Images** : JPEG, PNG, GIF
- 🎵 **Audio** : MP3, WAV, M4A
- 🎬 **Vidéo** : MP4, MOV
- 📄 **Documents** : PDF, TXT, etc. (dépend de la configuration du Gateway)

**Ce que vous devriez voir** :
```
┌─────────────────────────────────────────────┐
│  Vous → IA: Veuillez analyser cette image         │
│  [📎 photo.jpg]                         │
│                                             │
│  IA → Vous: Je vois que c'est...        │
│  [Résultat de l'analyse...]                              │
└─────────────────────────────────────────────┘
```

::: warning Limite de taille de fichier
WebChat et le Gateway ont des limites sur la taille des fichiers téléchargés (généralement quelques Mo). Si le téléchargement échoue, vérifiez la taille du fichier ou la configuration multimédia du Gateway.
:::

#### Support Markdown

WebChat prend en charge le format Markdown, vous permettant de formater vos messages.

**Exemple** :

```markdown
# Titre
## Sous-titre
- Élément de liste 1
- Élément de liste 2

**Gras** et *italique*
`Code`
```

**Aperçu du résultat** :
```
# Titre
## Sous-titre
- Élément de liste 1
- Élément de liste 2

**Gras** et *italique*
`Code`
```

#### Raccourcis de commandes

WebChat prend en charge les commandes avec slash, pour exécuter rapidement des opérations spécifiques.

**Commandes courantes** :

| Commande             | Fonction                         |
| ---------------- | ---------------------------- |
| `/new`          | Créer une nouvelle session                   |
| `/reset`        | Réinitialiser l'historique de la session actuelle           |
| `/clear`        | Effacer tous les messages de la session actuelle       |
| `/status`       | Afficher l'état du Gateway et des canaux       |
| `/models`       | Lister les modèles IA disponibles         |
| `/help`         | Afficher les informations d'aide                 |

**Exemple d'utilisation** :

```
/new
## Créer une nouvelle session

/reset
## Réinitialiser la session actuelle
```

---

### Étape 4 (Optionnel) : Configurer l'accès distant

**Pourquoi**
Si vous exécutez le Gateway sur un serveur distant, ou si vous souhaitez accéder à WebChat depuis d'autres appareils, vous devez configurer l'accès distant.

#### Accès via tunnel SSH

**Scénario** : Le Gateway est sur un serveur distant, vous souhaitez accéder à WebChat depuis votre machine locale.

**Étapes** :

1. Établissez un tunnel SSH, en mappant le port du Gateway distant vers le local :

```bash
## Mapper le port 18789 distant vers le port 18789 local
ssh -L 18789:localhost:18789 user@your-remote-server.com
```

2. Gardez la connexion SSH ouverte (ou utilisez le paramètre `-N` pour ne pas exécuter de commandes distantes)

3. Accédez depuis votre navigateur local : `http://localhost:18789`

**Ce que vous devriez voir** : La même interface WebChat que l'accès local

::: tip Maintien du tunnel SSH
Le tunnel SSH expire lorsque la connexion est interrompue. Si vous avez besoin d'un accès persistant :

- Utilisez `autossh` pour la reconnexion automatique
- Configurez `LocalForward` dans le fichier de configuration SSH
- Utilisez systemd/launchd pour démarrer automatiquement le tunnel
:::

#### Accès via Tailscale

**Scénario** : Utiliser Tailscale pour créer un réseau privé, le Gateway et le client sont sur le même tailnet.

**Étapes de configuration** :

1. Activez Tailscale Serve ou Funnel sur la machine du Gateway :

```bash
## Modifier le fichier de configuration
clawdbot config set gateway.tailscale.mode serve
## Ou
clawdbot config set gateway.tailscale.mode funnel
```

2. Redémarrez le Gateway

```bash
## Redémarrer le Gateway pour appliquer la configuration
clawdbot gateway restart
```

3. Obtenez l'adresse Tailscale du Gateway

```bash
## Voir l'état (affichera l'URL Tailscale)
clawdbot gateway status
```

4. Accédez depuis l'appareil client (même tailnet) :

```
http://<gateway-tailscale-name>.tailnet-<tailnet-id>.ts.net:18789
```

::: info Tailscale Serve vs Funnel
- **Serve** : Accessible uniquement dans le tailnet, plus sécurisé
- **Funnel** : Accès public à Internet, nécessite une protection `gateway.auth`

Il est recommandé d'utiliser le mode Serve, sauf si vous avez besoin d'un accès depuis le réseau public.
:::

#### Authentification pour l'accès distant

Que vous utilisiez un tunnel SSH ou Tailscale, si le Gateway est configuré avec une authentification, vous devrez toujours fournir un token ou un mot de passe.

**Vérifier la configuration d'authentification** :

```bash
## Voir le mode d'authentification
clawdbot config get gateway.auth.mode

## Si en mode token, vérifier que le token est défini
clawdbot config get gateway.auth.token
```

---

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez être capable de :

- [ ] Accéder à WebChat dans votre navigateur (`http://localhost:18789`)
- [ ] Envoyer des messages et recevoir des réponses de l'IA
- [ ] Utiliser les fonctionnalités de gestion de sessions (créer, basculer, réinitialiser des sessions)
- [ ] Télécharger des pièces jointes et laisser l'IA les analyser
- [ ] (Optionnel) Accéder à WebChat à distance via tunnel SSH
- [ ] (Optionnel) Accéder à WebChat via Tailscale

::: tip Vérifier la connexion
Si WebChat est inaccessible ou si l'envoi de messages échoue, vérifiez :

1. Le Gateway fonctionne-t-il : `clawdbot gateway status`
2. Le port est-il correct : Vérifiez que vous accédez à `http://127.0.0.1:18789` (et non `localhost:18789`)
3. L'authentification est-elle configurée : `clawdbot config get gateway.auth.*`
4. Voir les journaux détaillés : `clawdbot gateway --verbose`
:::

---

## Pièges à éviter

### ❌ Gateway non démarré

**Mauvaise pratique** :
```
Accéder directement à http://localhost:18789
## Résultat : Échec de connexion ou impossible à charger
```

**Bonne pratique** :
```bash
## D'abord démarrer le Gateway
clawdbot gateway --port 18789

## Puis accéder à WebChat
open http://localhost:18789
```

::: warning Le Gateway doit être démarré en premier
WebChat dépend du service WebSocket du Gateway. Sans Gateway en cours d'exécution, WebChat ne peut pas fonctionner correctement.
:::

### ❌ Erreur de configuration de port

**Mauvaise pratique** :
```
Accéder à http://localhost:8888
## Le Gateway fonctionne en réalité sur le port 18789
## Résultat : Connexion refusée
```

**Bonne pratique** :
```bash
## 1. Voir le port réel du Gateway
clawdbot config get gateway.port

## 2. Accéder avec le bon port
open http://localhost:<gateway.port>
```

### ❌ Configuration d'authentification manquante

**Mauvaise pratique** :
```
Non défini gateway.auth.mode ou token
## Résultat : WebChat indique une erreur d'authentification
```

**Bonne pratique** :
```bash
## Définir l'authentification par token (recommandé)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here

## Redémarrer le Gateway
clawdbot gateway restart

## Saisir le token lors de l'accès à WebChat
```

### ❌ Accès distant non configuré

**Mauvaise pratique** :
```
Accéder directement à l'IP du serveur distant depuis le local
http://remote-server-ip:18789
## Résultat : Délai d'attente de connexion (bloqué par le pare-feu)
```

**Bonne pratique** :
```bash
## Utiliser un tunnel SSH
ssh -L 18789:localhost:18789 user@remote-server.com

## Ou utiliser Tailscale Serve
clawdbot config set gateway.tailscale.mode serve
clawdbot gateway restart

## Accéder depuis le navigateur local
http://localhost:18789
```

---

## Résumé de la leçon

Dans cette leçon, vous avez appris :

1. ✅ **Introduction à WebChat** : Interface de chat intégrée basée sur le WebSocket du Gateway, sans configuration séparée
2. ✅ **Modes d'accès** : Accès via navigateur, application macOS, raccourci en ligne de commande
3. ✅ **Fonctionnalités principales** : Gestion de sessions, téléchargement de pièces jointes, support Markdown, commandes avec slash
4. ✅ **Accès distant** : Accès à un Gateway distant via tunnel SSH ou Tailscale
5. ✅ **Configuration de l'authentification** : Comprendre les modes d'authentification du Gateway (token/mot de passe/Tailscale)
6. ✅ **Dépannage** : Problèmes courants et solutions

**Révision des concepts clés** :

- WebChat utilise le même port que le Gateway, sans serveur HTTP séparé
- L'historique est géré par le Gateway, synchronisé en temps réel, sans cache local
- Si le Gateway est inaccessible, WebChat passe en mode lecture seule
- Les réponses sont renvoyées de manière déterministe vers WebChat, contrairement aux autres canaux

**Prochaines étapes** :

- Découvrez l'[application macOS](../macos-app/), pour comprendre le contrôle de la barre de menus et la fonctionnalité Voice Wake
- Apprenez le [nœud iOS](../ios-node/), pour configurer des appareils mobiles exécutant des opérations locales
- Découvrez l'[interface visuelle Canvas](../../advanced/canvas/), pour découvrir l'espace de travail visuel piloté par l'IA

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprenons l'[**application macOS**](../macos-app/).
>
> Vous apprendrez :
> - Les fonctionnalités et la disposition de l'application de barre de menus macOS
> - L'utilisation de Voice Wake et Talk Mode
> - L'intégration entre WebChat et l'application macOS
> - Les outils de débogage et le contrôle distant du Gateway

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité                  | Chemin du fichier                                                                                    | Numéro de ligne    |
| ------------------- | ------------------------------------------------------------------------------------------- | ------- |
| Explication du principe WebChat     | [`docs/web/webchat.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/web/webchat.md) | Fichier complet   |
| API WebSocket Gateway | [`src/gateway/protocol/`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/) | Répertoire complet   |
| Méthode chat.send        | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380  |
| Méthode chat.history     | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 1-295    |
| Méthode chat.inject      | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 381-450  |
| Point d'entrée Web UI         | [`ui/index.html`](https://github.com/clawdbot/clawdbot/blob/main/ui/index.html) | 1-15     |
| Configuration de l'authentification Gateway     | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-100    |
| Intégration Tailscale       | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | Fichier complet   |
| Intégration WebChat macOS  | [`apps/macos/`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/) | Répertoire complet   |

**Constantes clés** :
- `INTERNAL_MESSAGE_CHANNEL = "webchat"` : Identificateur du canal de messages interne WebChat (depuis `src/utils/message-channel.ts:17`)

**Éléments de configuration clés** :
- `gateway.port` : Port WebSocket (par défaut 18789)
- `gateway.auth.mode` : Mode d'authentification (token/mot de passe/tailscale)
- `gateway.auth.token` : Valeur du token pour l'authentification par token
- `gateway.auth.password` : Valeur du mot de passe pour l'authentification par mot de passe
- `gateway.tailscale.mode` : Mode Tailscale (serve/funnel/disabled)
- `gateway.remote.url` : Adresse WebSocket du Gateway distant
- `gateway.remote.token` : Token d'authentification du Gateway distant
- `gateway.remote.password` : Mot de passe d'authentification du Gateway distant

**Méthodes WebSocket clés** :
- `chat.send(message)` : Envoyer un message à l'Agent (depuis `src/gateway/server-methods/chat.ts`)
- `chat.history(sessionId)` : Obtenir l'historique de session (depuis `src/gateway/server-methods/chat.ts`)
- `chat.inject(message)` : Injecter directement une note système dans la session, sans passer par l'Agent (depuis `src/gateway/server-methods/chat.ts`)

**Caractéristiques de l'architecture** :
- WebChat ne nécessite pas de serveur HTTP séparé ni de configuration de port
- Utilise le même port que le Gateway (par défaut 18789)
- L'historique est récupéré du Gateway en temps réel, sans cache local
- Les réponses sont renvoyées de manière déterministe vers WebChat (contrairement aux autres canaux)

</details>
