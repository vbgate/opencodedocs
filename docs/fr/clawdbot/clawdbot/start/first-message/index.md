---
title: "Envoyer le premier message : discuter avec l'IA via WebChat ou via des canaux"
subtitle: "Envoyer le premier message : discuter avec l'IA via WebChat ou via des canaux"
description: "Apprenez à envoyer votre premier message à l'assistant IA Clawdbot via l'interface WebChat ou via des canaux configurés (WhatsApp/Telegram/Slack/Discord, etc.). Ce tutoriel présente trois méthodes : commandes CLI, accès WebChat et envoi de messages via canaux, incluant les résultats attendus et le dépannage des problèmes courants."
tags:
  - "Prise en main"
  - "WebChat"
  - "Canaux"
  - "Messages"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 40
---

# Envoyer le premier message : discuter avec l'IA via WebChat ou via des canaux

## Ce que vous pourrez faire après ce tutoriel

À la fin de ce tutoriel, vous serez capable de :

- ✅ Discuter avec l'assistant IA via CLI
- ✅ Utiliser l'interface WebChat pour envoyer des messages
- ✅ Discuter avec l'IA sur des canaux configurés (WhatsApp, Telegram, Slack, etc.)
- ✅ Comprendre les résultats attendus et les codes de statut de l'envoi de messages

## Votre problème actuel

Vous venez peut-être de terminer l'installation de Clawdbot et le démarrage du Gateway, mais vous ne savez pas comment vérifier que tout fonctionne correctement.

Vous vous demandez peut-être :

- "Gateway a démarré, comment confirmer qu'il peut répondre aux messages ?"
- "Outre la ligne de commande, existe-t-il une interface graphique ?"
- "J'ai configuré WhatsApp/Telegram, comment discuter avec l'IA sur ces plateformes ?"

La bonne nouvelle est : **Clawdbot propose plusieurs méthodes pour envoyer le premier message**, il y en a forcément une qui vous convient.

## Quand utiliser cette méthode

Lorsque vous avez besoin de :

- 🧪 **Vérifier l'installation** : confirmer que Gateway et l'assistant IA fonctionnent correctement
- 🌐 **Tester les canaux** : vérifier que les connexions WhatsApp/Telegram/Slack, etc. sont normales
- 💬 **Conversation rapide** : communiquer avec l'IA directement via CLI ou WebChat sans ouvrir l'application du canal
- 🔄 **Livrer des réponses** : envoyer la réponse de l'IA à un canal ou contact spécifique

---

## 🎒 Prérequis

Avant d'envoyer votre premier message, veuillez confirmer :

### Conditions requises

| Condition                     | Comment vérifier                                        |
|--- | ---|
| **Gateway démarré**   | `clawdbot gateway status` ou vérifier si le processus est en cours d'exécution |
| **Modèle IA configuré** | `clawdbot models list` pour voir s'il y a des modèles disponibles      |
| **Port accessible**       | Vérifier que le port 18789 (ou port personnalisé) n'est pas occupé |

::: warning Cours prérequis
Ce tutoriel suppose que vous avez déjà terminé :
- [Démarrage rapide](../getting-started/) - Installation, configuration et démarrage de Clawdbot
- [Démarrer Gateway](../gateway-startup/) - Comprendre les différents modes de démarrage de Gateway

Si ce n'est pas encore fait, veuillez revenir à ces cours d'abord.
:::

### Optionnel : Configurer les canaux

Si vous souhaitez envoyer des messages via WhatsApp/Telegram/Slack, etc., vous devez d'abord configurer les canaux.

Vérification rapide :

```bash
## Voir les canaux configurés
clawdbot channels list
```

Si la liste est vide ou s'il manque le canal que vous souhaitez utiliser, reportez-vous au tutoriel de configuration du canal correspondant (dans la section `platforms/`).

---

## Idée principale

Clawdbot prend en charge trois méthodes principales pour envoyer des messages :

```
┌─────────────────────────────────────────────────────────────┐
│              Méthodes d'envoi de messages Clawdbot              │
├─────────────────────────────────────────────────────────────┤
│                                                         │
│  Méthode 1 : Dialogue CLI Agent                                 │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → IA → Résultat renvoyé              │
│  │ agent        │                                       │
│  │ --message    │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Méthode 2 : Envoi direct de messages CLI vers canal                           │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → Canal → Envoyer message              │
│  │ message send │                                       │
│  │ --target     │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Méthode 3 : WebChat / Canaux configurés                              │
│  ┌─────────────┐               ┌──────────────┐   │
│  │ WebChat     │   ou         │ WhatsApp    │   │
│  │ Interface navigateur   │              │ Telegram    │ → Gateway → IA → Réponse du canal │
│  └─────────────┘               │ Slack       │   │
│                                 │ Discord     │   │
│                                 └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Différences clés** :

| Méthode                     | Passe par l'IA | Usage                           |
|--- | --- | ---|
| `clawdbot agent`     | ✅ Oui       | Discuter avec l'IA, obtenir la réponse et le processus de pensée    |
| `clawdbot message send` | ❌ Non       | Envoyer directement le message au canal, sans passer par l'IA    |
| WebChat / Canaux       | ✅ Oui       | Discuter avec l'IA via l'interface graphique         |

::: info Choisir la bonne méthode
- **Vérifier l'installation** : utilisez `clawdbot agent` ou WebChat
- **Tester les canaux** : utilisez les applications WhatsApp/Telegram, etc.
- **Envoi en masse** : utilisez `clawdbot message send` (sans passer par l'IA)
:::

---

## Suivez-moi

### Étape 1 : Discuter avec l'IA via CLI

**Pourquoi**
CLI est la méthode de vérification la plus rapide, pas besoin d'ouvrir un navigateur ou l'application du canal.

#### Dialogue de base

```bash
## Envoyer un message simple à l'assistant IA
clawdbot agent --message "Hello, I'm testing Clawdbot!"
```

**Ce que vous devriez voir** :
```
[clawdbot] Thinking...
[clawdbot] Hello! I'm your AI assistant powered by Clawdbot. How can I help you today?
```

#### Utiliser les niveaux de pensée

Clawdbot prend en charge différents niveaux de pensée, contrôlant la "transparence" de l'IA :

```bash
## Niveau de pensée élevé (affiche le processus de raisonnement complet)
clawdbot agent --message "Ship checklist" --thinking high

## Désactiver la pensée (ne voir que la réponse finale)
clawdbot agent --message "What's 2+2?" --thinking off
```

**Ce que vous devriez voir** (niveau de pensée élevé) :
```
[clawdbot] I'll create a comprehensive ship checklist for you.

[THINKING]
Let me think about what needs to be checked for shipping:

1. Code readiness
   - All tests passing?
   - Code review completed?
   - Documentation updated?

2. Build configuration
   - Environment variables set correctly?
   - Build artifacts generated?

[THINKING END]

[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

**Options de niveau de pensée** :

| Niveau        | Explication                           | Scénario d'utilisation             |
|--- | --- | ---|
| `off`     | Ne pas afficher le processus de pensée               | Questions simples, réponse rapide |
| `minimal` | Sortie de pensée minimisée              | Débogage, vérification du processus     |
| `low`     | Détails faibles                     | Conversation quotidienne           |
| `medium`   | Détails moyens                   | Tâches complexes           |
| `high`     | Détails élevés (inclut le processus de raisonnement complet) | Apprentissage, génération de code     |

#### Spécifier le canal de réception

Vous pouvez demander à l'IA d'envoyer la réponse à un canal spécifique (au lieu du canal par défaut) :

```bash
## Demander à l'IA d'envoyer la réponse à Telegram
clawdbot agent --message "Send me a weather update" --deliver --reply-channel telegram
```

::: tip Paramètres courants
- `--to <numéro>` : Spécifier le numéro E.164 du destinataire (pour créer une conversation spécifique)
- `--agent <id>` : Utiliser un ID d'agent spécifique (au lieu de main par défaut)
- `--session-id <id>` : Continuer une conversation existante, au lieu d'en créer une nouvelle
- `--verbose on` : Activer la sortie de journaux détaillée
- `--json` : Sortie au format JSON (adapté pour l'analyse par script)
:::

---

### Étape 2 : Envoyer des messages via l'interface WebChat

**Pourquoi**
WebChat fournit une interface graphique dans le navigateur, plus intuitive, supportant le texte enrichi et les pièces jointes.

#### Accéder à WebChat

WebChat utilise le service WebSocket de Gateway, **ne nécessite pas de configuration séparée ou de port supplémentaire**.

**Méthodes d'accès** :

1. **Ouvrir un navigateur, visiter** : `http://localhost:18789`
2. **Ou exécuter dans le terminal** : `clawdbot dashboard` (ouvre automatiquement le navigateur)

::: info Port WebChat
WebChat utilise le même port que Gateway (par défaut 18789). Si vous avez modifié le port de Gateway, WebChat utilisera également le même port.
:::

**Ce que vous devriez voir** :
```
┌─────────────────────────────────────────────┐
│          WebChat Clawdbot              │
│  ┌───────────────────────────────────┐   │
│  │  Bonjour ! Je suis votre assistant IA.       │   │
│  │  Comment puis-je vous aider ?        │   │
│  └───────────────────────────────────┘   │
│  [Zone de saisie...                       │   │
│  [Envoyer]                            │   │
└─────────────────────────────────────────────┘
```

#### Envoyer des messages

1. Saisissez votre message dans la zone de saisie
2. Cliquez sur "Envoyer" ou appuyez sur `Enter`
3. Attendez la réponse de l'IA

**Ce que vous devriez voir** :
- La réponse de l'IA s'affiche dans l'interface de chat
- Si le niveau de pensée est activé, une balise `[THINKING]` s'affichera

**Fonctionnalités WebChat** :

| Fonctionnalité     | Explication                           |
|--- | ---|
| Texte enrichi   | Prend en charge le format Markdown            |
| Pièces jointes     | Prend en charge l'upload d'images, de fichiers audio et vidéo    |
| Historique | Sauvegarde automatique de l'historique de conversation             |
| Changement de conversation | Panneau gauche pour changer entre différentes conversations         |

::: tip Application de la barre de menu macOS
Si vous avez installé l'application Clawdbot macOS, vous pouvez également ouvrir WebChat directement via le bouton "Open WebChat" de la barre de menu.
:::

---

### Étape 3 : Envoyer des messages via des canaux configurés

**Pourquoi**
Vérifier que les canaux (WhatsApp, Telegram, Slack, etc.) sont correctement connectés et découvrir la conversation multiplateforme réelle.

#### Exemple WhatsApp

Si vous avez configuré WhatsApp lors de l'onboarding ou de la configuration :

1. **Ouvrir l'application WhatsApp** (mobile ou bureau)
2. **Rechercher votre numéro Clawdbot** (ou le contact enregistré)
3. **Envoyer un message** : `Hello from WhatsApp!`

**Ce que vous devriez voir** :
```
[WhatsApp]
Vous → Clawdbot: Hello from WhatsApp!

Clawdbot → Vous: Hello! I received your message via WhatsApp.
How can I help you today?
```

#### Exemple Telegram

Si vous avez configuré un bot Telegram :

1. **Ouvrir l'application Telegram**
2. **Rechercher votre bot** (en utilisant le nom d'utilisateur)
3. **Envoyer un message** : `/start` ou `Hello from Telegram!`

**Ce que vous devriez voir** :
```
[Telegram]
Vous → @your_bot: /start

@your_bot → Vous: Welcome! I'm Clawdbot's AI assistant.
You can talk to me here, and I'll respond via AI.
```

#### Exemples Slack/Discord

Pour Slack ou Discord :

1. **Ouvrir l'application correspondante**
2. **Trouver le canal ou le serveur où se trouve le bot**
3. **Envoyer un message** : `Hello from Slack!`

**Ce que vous devriez voir** :
- Le bot répond à votre message
- Une balise "AI Assistant" peut s'afficher avant le message

::: info Protection d'appariement DM
Par défaut, Clawdbot active la **protection d'appariement DM** :
- Les expéditeurs inconnus reçoivent un code d'appariement
- Les messages ne seront pas traités tant que vous n'avez pas approuvé l'appariement

Si c'est la première fois que vous envoyez un message depuis un canal, vous devrez peut-être :
```bash
## Voir les demandes d'appariement en attente d'approbation
clawdbot pairing list

## Approuver la demande d'appariement (remplacer <channel> et <code> par les valeurs réelles)
clawdbot pairing approve <channel> <code>
```

Explications détaillées : [Appariement DM et contrôle d'accès](../pairing-approval/)
:::

---

### Étape 4 (Optionnel) : Envoyer directement des messages au canal

**Pourquoi**
Envoyer directement des messages au canal sans passer par l'IA. Convient pour les notifications en masse, les messages push, etc.

#### Envoyer des messages texte

```bash
## Envoyer un message texte à WhatsApp
clawdbot message send --target +15555550123 --message "Hello from CLI!"
```

#### Envoyer des messages avec pièces jointes

```bash
## Envoyer une image
clawdbot message send --target +15555550123 \
  --message "Check out this photo" \
  --media ~/Desktop/photo.jpg

## Envoyer une image URL
clawdbot message send --target +15555550123 \
  --message "Here's a link" \
  --media https://example.com/image.png
```

**Ce que vous devriez voir** :
```
[clawdbot] Message sent successfully
[clawdbot] Message ID: 3EB0A1234567890
```

::: tip Paramètres courants de message send
- `--channel` : Spécifier le canal (par défaut : whatsapp)
- `--reply-to <id>` : Répondre à un message spécifique
- `--thread-id <id>` : ID de sujet Telegram
- `--buttons <json>` : Boutons inline Telegram (format JSON)
- `--card <json>` : Adaptive Card (canaux supportés)
:::

---

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez être capable de :

- [ ] Envoyer des messages via CLI et recevoir une réponse de l'IA
- [ ] Envoyer des messages dans l'interface WebChat et voir la réponse
- [ ] (Optionnel) Envoyer des messages dans des canaux configurés et recevoir une réponse de l'IA
- [ ] (Optionnel) Utiliser `clawdbot message send` pour envoyer directement des messages au canal

::: tip Problèmes courants

**Q : L'IA ne répond pas à mes messages ?**

A : Vérifiez les points suivants :
1. Gateway est-il en cours d'exécution : `clawdbot gateway status`
2. Le modèle IA est-il configuré : `clawdbot models list`
3. Afficher les journaux détaillés : `clawdbot agent --message "test" --verbose on`

**Q : WebChat ne s'ouvre pas ?**

A : Vérifiez :
1. Gateway est-il en cours d'exécution
2. Le port est-il correct : par défaut 18789
3. Le navigateur accède-t-il à `http://127.0.0.1:18789` (et non `localhost`)

**Q : Échec de l'envoi de messages du canal ?**

A : Vérifiez :
1. Le canal est-il connecté : `clawdbot channels status`
2. La connexion réseau est-elle normale
3. Afficher les journaux d'erreur spécifiques au canal : `clawdbot gateway --verbose`
:::

---

## À éviter

### ❌ Gateway non démarré

**Mauvaise pratique** :
```bash
clawdbot agent --message "Hello"
## Erreur : Gateway connection failed
```

**Bonne pratique** :
```bash
## D'abord démarrer Gateway
clawdbot gateway --port 18789

## Puis envoyer le message
clawdbot agent --message "Hello"
```

::: warning Gateway doit d'abord être démarré
Toutes les méthodes d'envoi de messages (CLI, WebChat, canaux) dépendent du service WebSocket de Gateway. Assurez-vous que Gateway est en cours d'exécution est la première étape.
:::

### ❌ Canal non connecté

**Mauvaise pratique** :
```bash
## Envoyer un message alors que WhatsApp n'est pas connecté
clawdbot message send --target +15555550123 --message "Hi"
## Erreur : WhatsApp not authenticated
```

**Bonne pratique** :
```bash
## D'abord connecter le canal
clawdbot channels login whatsapp

## Confirmer le statut
clawdbot channels status

## Puis envoyer le message
clawdbot message send --target +15555550123 --message "Hi"
```

### ❌ Oublier l'appariement DM

**Mauvaise pratique** :
```bash
## Envoyer un message depuis Telegram pour la première fois, mais sans approuver l'appariement
## Résultat : Le bot reçoit le message mais ne le traite pas
```

**Bonne pratique** :
```bash
## 1. Voir les demandes d'appariement en attente d'approbation
clawdbot pairing list

## 2. Approuver l'appariement
clawdbot pairing approve telegram ABC123
## 3. Renvoyer le message

### Le message sera maintenant traité et recevra une réponse de l'IA
```

### ❌ Confondre agent et message send

**Mauvaise pratique** :
```bash
## Vouloir discuter avec l'IA, mais utiliser message send
clawdbot message send --target +15555550123 --message "Help me write code"
## Résultat : Le message est envoyé directement au canal, l'IA ne le traite pas
```

**Bonne pratique** :
```bash
## Discuter avec l'IA : utiliser agent
clawdbot agent --message "Help me write code" --to +15555550123

## Envoyer directement le message : utiliser message send (sans passer par l'IA)
clawdbot message send --target +15555550123 --message "Meeting at 3pm"
```

---

## Résumé de la leçon

Dans cette leçon, vous avez appris :

1. ✅ **Dialogue CLI Agent** : `clawdbot agent --message` pour communiquer avec l'IA, prend en charge le contrôle du niveau de pensée
2. ✅ **Interface WebChat** : Visitez `http://localhost:18789` pour envoyer des messages via l'interface graphique
3. ✅ **Messages de canal** : Discutez avec l'IA sur des canaux configurés comme WhatsApp, Telegram, Slack, etc.
4. ✅ **Envoi direct** : `clawdbot message send` contourne l'IA pour envoyer directement des messages au canal
5. ✅ **Dépannage** : Comprendre les causes courantes d'échec et les solutions

**Prochaines étapes** :

- Apprenez [Appariement DM et contrôle d'accès](../pairing-approval/), pour savoir comment gérer en toute sécurité les expéditeurs inconnus
- Explorez [Vue d'ensemble du système multi-canal](../../platforms/channels-overview/), pour comprendre tous les canaux supportés et leur configuration
- Configurez plus de canaux (WhatsApp, Telegram, Slack, Discord, etc.) pour découvrir l'assistant IA multiplateforme

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Appariement DM et contrôle d'accès](../pairing-approval/)**.
>
> Vous apprendrez :
> - Comprendre le mécanisme de protection d'appariement DM par défaut
> - Comment approuver les demandes d'appariement d'expéditeurs inconnus
> - Configurer allowlist et les politiques de sécurité

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonction                  | Chemin du fichier                                                                                             | Ligne    |
|--- | --- | ---|
| Enregistrement de commande CLI Agent  | [`src/cli/program/register.agent.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.agent.ts) | 20-82    |
| Exécution CLI Agent        | [`src/commands/agent-via-gateway.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/agent-via-gateway.ts) | 82-184   |
| Enregistrement CLI message send | [`src/cli/program/message/register.send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/message/register.send.ts) | 1-30     |
| Méthode Gateway chat.send | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380   |
| Traitement de messages internes WebChat | [`src/gateway/server-chat.gateway-server-chat.e2e.test.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-chat.gateway-server-chat.e2e.test.ts) | 50-290    |
| Définition de type de canal de message   | [`src/gateway/protocol/client-info.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/client-info.ts) | 2-23     |
| Registre de canaux         | [`src/channels/registry.js`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.js) | Tout le fichier   |

**Constantes clés** :
- `DEFAULT_CHAT_CHANNEL = "whatsapp"` : Canal de messages par défaut (de `src/channels/registry.js`)
- `INTERNAL_MESSAGE_CHANNEL = "webchat"` : Canal de messages internes WebChat (de `src/utils/message-channel.ts`)

**Fonctions clés** :
- `agentViaGatewayCommand()` : Appeler la méthode agent via Gateway WebSocket (`src/commands/agent-via-gateway.ts`)
- `agentCliCommand()` : Entrée de commande CLI agent, prend en charge les modes local et Gateway (`src/commands/agent-via-gateway.ts`)
- `registerMessageSendCommand()` : Enregistrer la commande `message send` (`src/cli/program/message/register.send.ts`)
- `chat.send` : Méthode WebSocket Gateway, traite les demandes d'envoi de messages (`src/gateway/server-methods/chat.ts`)

</details>
