---
title: "Configuration et Utilisation du Canal Discord | Tutoriel Clawdbot"
sidebarTitle: "Connecter votre Bot Discord"
subtitle: "Configuration et Utilisation du Canal Discord"
description: "Apprenez à créer un Discord Bot et à le configurer dans Clawdbot. Ce tutoriel couvre la création de Bot via Discord Developer Portal, la configuration des permissions Gateway Intents, la méthode de configuration du Bot Token, la génération d'URL d'invitation OAuth2, le mécanisme de protection par appariement DM, la configuration de liste blanche des canaux de serveur, la gestion des permissions d'appel d'outils AI Discord et les étapes de dépannage des problèmes courants."
tags:
  - "Configuration de Canal"
  - "Discord"
  - "Bot"
prerequisite:
  - "start-getting-started"
order: 100
---

# Configuration et Utilisation du Canal Discord

## Ce que vous saurez faire

- Créer un Discord Bot et obtenir le Bot Token
- Configurer l'intégration Clawdbot avec Discord Bot
- Utiliser l'assistant IA dans les messages privés (DM) et les canaux de serveur Discord
- Configurer le contrôle d'accès (appariement DM, liste blanche de canaux)
- Permettre à l'IA d'appeler des outils Discord (envoyer des messages, créer des canaux, gérer les rôles, etc.)

## Votre situation actuelle

Vous utilisez déjà Discord pour communiquer avec vos amis ou votre équipe, et vous souhaitez discuter avec l'assistant IA directement dans Discord sans changer d'application. Vous pourriez rencontrer les problèmes suivants :

- Vous ne savez pas comment créer un Discord Bot
- Vous ne savez pas quelles permissions sont nécessaires pour que le Bot fonctionne correctement
- Vous voulez contrôler qui peut interagir avec le Bot (éviter les abus par des inconnus)
- Vous souhaitez configurer des comportements différents dans différents canaux de serveur

Ce tutoriel vous apprendra étape par étape à résoudre ces problèmes.

## Quand utiliser cette solution

Le canal Discord convient à ces scénarios :

- ✅ Vous êtes un utilisateur intensif de Discord, la plupart de vos communications se font sur Discord
- ✅ Vous souhaitez ajouter des fonctionnalités IA à votre serveur Discord (comme un assistant intelligent dans le canal `#help`)
- ✅ Vous voulez interagir avec l'IA via les messages privés Discord (plus pratique que d'ouvrir WebChat)
- ✅ Vous avez besoin que l'IA effectue des opérations de gestion dans Discord (créer des canaux, envoyer des messages, etc.)

::: info Le canal Discord est basé sur discord.js et prend en charge les fonctionnalités complètes de l'API Bot.
:::

## 🎒 Prérequis

**Conditions obligatoires** :
- Avoir terminé le [démarrage rapide](../../start/getting-started/), le Gateway peut fonctionner
- Node.js ≥ 22
- Compte Discord (peut créer des applications)

**Informations nécessaires** :
- Discord Bot Token (nous verrons comment l'obtenir plus tard)
- ID du serveur (optionnel, pour configurer des canaux spécifiques)
- ID du canal (optionnel, pour un contrôle affiné)

## Concepts clés

### Comment fonctionne le canal Discord

Le canal Discord communique avec Discord via l'**API Bot officielle** :

```
Discord utilisateur
     ↓
  Serveur Discord
     ↓
  Gateway Bot Discord
     ↓ (WebSocket)
  Gateway Clawdbot
     ↓
  Agent IA (Claude/GPT, etc.)
     ↓
  API Bot Discord (envoyer la réponse)
     ↓
Serveur Discord
     ↓
Discord utilisateur (voir la réponse)
```

**Points clés** :
- Le Bot reçoit les messages via WebSocket (Gateway → Bot)
- Clawdbot transmet les messages à l'Agent IA pour traitement
- L'IA peut appeler l'outil `discord` pour effectuer des opérations spécifiques à Discord
- Toutes les réponses sont renvoyées via l'API Bot

### Différences entre DM et canaux de serveur

| Type | Isolation de session | Comportement par défaut | Scénario d'utilisation |
| --- | --- | --- | --- |
| **Message privé (DM)** | Tous les DM partagent la session `agent:main:main` | Nécessite une protection par appariement (pairing) | Conversation personnelle, contexte continu |
| **Canal de serveur** | Chaque canal a une session indépendante `agent:<agentId>:discord:channel:<channelId>` | Ne répond que sur @mention | Assistant intelligent de serveur, plusieurs canaux en parallèle |

::: tip
Les sessions des canaux de serveur sont complètement isolées et ne s'interfèrent pas. La conversation dans le canal `#help` n'apparaîtra pas dans `#general`.
:::

### Mécanisme de sécurité par défaut

Le canal Discord active par défaut la **protection par appariement DM** :

```
Utilisateur inconnu → Envoyer DM → Clawdbot
                              ↓
                      Refuser le traitement, renvoyer le code d'appariement
                              ↓
                L'utilisateur doit exécuter `clawdbot pairing approve discord <code>`
                              ↓
                            Appariement réussi, conversation possible
```

Cela évite que des utilisateurs inconnus interagissent directement avec votre assistant IA.

---

## Suivez les étapes

### Étape 1 : Créer une application Discord et un Bot

**Pourquoi**
Un Discord Bot a besoin d'une "identité" pour se connecter au serveur Discord. Cette identité est le Bot Token.

#### 1.1 Créer une application Discord

1. Ouvrez le [Discord Developer Portal](https://discord.com/developers/applications)
2. Cliquez sur **New Application** (Nouvelle application)
3. Entrez le nom de l'application (par exemple `Clawdbot AI`)
4. Cliquez sur **Create** (Créer)

#### 1.2 Ajouter un utilisateur Bot

1. Dans la barre de navigation de gauche, cliquez sur **Bot** (Robot)
2. Cliquez sur **Add Bot** → **Reset Token** → **Reset Token** (Réinitialiser le jeton)
3. **Important** : Copiez immédiatement le Bot Token (ne s'affiche qu'une seule fois !)

```
Format du Bot Token : MTAwOTk1MDk5NjQ5NTExNjUy.Gm9...
(Chaque réinitialisation le change, conservez-le soigneusement !)
```

#### 1.3 Activer les Gateway Intents nécessaires

Discord n'autorise pas par défaut le Bot à lire le contenu des messages, vous devez l'activer manuellement.

Dans **Bot → Privileged Gateway Intents** (Intents de Gateway privilégiés), activez :

| Intent | Requis | Description |
| --- | --- | --- |
| **Message Content Intent** | ✅ **Obligatoire** | Lire le contenu textuel des messages (sans cela, le Bot ne peut pas voir les messages) |
| **Server Members Intent** | ⚠️ **Recommandé** | Pour la recherche de membres et la résolution des noms d'utilisateur |

::: danger Interdiction
N'activez pas **Presence Intent** (Intent de présence), sauf si vous avez vraiment besoin du statut de présence des utilisateurs.
:::

**Ce que vous devriez voir** : Les deux interrupteurs passent en vert (ON).

---

### Étape 2 : Générer l'URL d'invitation et l'ajouter au serveur

**Pourquoi**
Le Bot a besoin de permissions pour lire et envoyer des messages dans le serveur.

1. Dans la barre de navigation de gauche, cliquez sur **OAuth2 → URL Generator**
2. Dans **Scopes** (Portées), sélectionnez :
   - ✅ **bot**
   - ✅ **applications.commands** (pour les commandes natives)

3. Dans **Bot Permissions** (Permissions du Bot), sélectionnez au minimum :

| Permission | Description |
| --- | --- |
| **View Channels** | Voir les canaux |
| **Send Messages** | Envoyer des messages |
| **Read Message History** | Lire l'historique des messages |
| **Embed Links** | Intégrer des liens |
| **Attach Files** | Télécharger des fichiers |

Permissions optionnelles (ajoutez selon vos besoins) :
- **Add Reactions** (Ajouter des réactions emoji)
- **Use External Emojis** (Utiliser des emojis personnalisés)

::: warning Conseil de sécurité
Évitez d'accorder la permission **Administrator** (Administrateur), sauf si vous déboguez et faites entièrement confiance au Bot.
:::

4. Copiez l'URL générée
5. Ouvrez l'URL dans votre navigateur
6. Sélectionnez votre serveur, cliquez sur **Authorize** (Autoriser)

**Ce que vous devriez voir** : Le Bot a rejoint le serveur avec succès, affiché comme en ligne en vert.

---

### Étape 3 : Obtenir les IDs nécessaires (serveur, canal, utilisateur)

**Pourquoi**
La configuration de Clawdbot privilégie l'utilisation des IDs (numéros), car les IDs ne changent pas.

#### 3.1 Activer le mode développeur Discord

1. Discord desktop/web → **User Settings** (Paramètres utilisateur)
2. **Advanced** (Avancé) → Activer **Developer Mode** (Mode développeur)

#### 3.2 Copier les IDs

| Type | Action |
| --- | --- |
| **ID du serveur** | Clic droit sur le nom du serveur → **Copy Server ID** |
| **ID du canal** | Clic droit sur le canal (par exemple `#general`) → **Copy Channel ID** |
| **ID de l'utilisateur** | Clic droit sur l'avatar de l'utilisateur → **Copy User ID** |

::: tip ID vs Nom
Utilisez de préférence les IDs pour la configuration. Les noms peuvent changer, mais les IDs ne changeront jamais.
:::

**Ce que vous devriez voir** : L'ID a été copié dans le presse-papiers (format : `123456789012345678`).

---

### Étape 4 : Configurer la connexion Clawdbot à Discord

**Pourquoi**
Dire à Clawdbot comment se connecter à votre Discord Bot.

#### Méthode 1 : Via les variables d'environnement (recommandé, pour les serveurs)

```bash
export DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"

clawdbot gateway --port 18789
```

#### Méthode 2 : Via le fichier de configuration

Éditez `~/.clawdbot/clawdbot.json` :

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "YOUR_BOT_TOKEN"  // Token copié à l'étape 1
    }
  }
}
```

::: tip Priorité des variables d'environnement
Si les variables d'environnement et le fichier de configuration sont définis simultanément, **le fichier de configuration est prioritaire**.
:::

**Ce que vous devriez voir** : Après le démarrage du Gateway, le Discord Bot est affiché comme en ligne.

---

### Étape 5 : Vérifier la connexion et tester

**Pourquoi**
S'assurer que la configuration est correcte et que le Bot peut recevoir et envoyer des messages normalement.

1. Démarrez le Gateway (si ce n'est pas déjà fait) :

```bash
clawdbot gateway --port 18789 --verbose
```

2. Vérifiez l'état du Discord Bot :
   - Le Bot devrait être affiché comme **en ligne en vert** dans la liste des membres du serveur
   - S'il est hors ligne en gris, vérifiez si le Token est correct

3. Envoyez un message de test :

Dans Discord :
- **Message privé** : Envoyez directement un message au Bot (vous recevrez un code d'appariement, voir la section suivante)
- **Canal de serveur** : Mentionnez @ le Bot, par exemple `@ClawdbotAI hello`

**Ce que vous devriez voir** : Le Bot répond avec un message (le contenu dépend de votre modèle IA).

::: tip Échec du test ?
Si le Bot ne répond pas, consultez la section [Dépannage](#Dépannage).
:::

---

## Point de contrôle ✅

Avant de continuer, vérifiez les éléments suivants :

- [ ] Le Bot Token est correctement configuré
- [ ] Le Bot a rejoint le serveur avec succès
- [ ] Le Message Content Intent est activé
- [ ] Le Gateway fonctionne
- [ ] Le Bot est affiché comme en ligne dans Discord
- [ ] La réponse est reçue sur @mention du Bot

---

## Configuration avancée

### Contrôle d'accès DM

La stratégie par défaut est `pairing` (mode d'appariement), adapté pour un usage personnel. Vous pouvez l'ajuster selon vos besoins :

| Stratégie | Description | Exemple de configuration |
| --- | --- | --- |
| **pairing** (par défaut) | Les inconnus reçoivent un code d'appariement, nécessitent une approbation manuelle | `"dm": { "policy": "pairing" }` |
| **allowlist** | Autoriser uniquement les utilisateurs de la liste | `"dm": { "policy": "allowlist", "allowFrom": ["123456", "alice"] }` |
| **open** | Autoriser tout le monde (nécessite que `allowFrom` contienne `"*"`) | `"dm": { "policy": "open", "allowFrom": ["*"] }` |
| **disabled** | Désactiver tous les DM | `"dm": { "enabled": false }` |

#### Exemple de configuration : Autoriser des utilisateurs spécifiques

```json5
{
  channels: {
    discord: {
      dm: {
        enabled: true,
        policy: "allowlist",
        allowFrom: [
          "123456789012345678",  // ID utilisateur
          "@alice",                   // Nom d'utilisateur (sera résolu en ID)
          "alice#1234"              // Nom d'utilisateur complet
        ]
      }
    }
  }
}
```

#### Approuver les demandes d'appariement

Lorsqu'un utilisateur inconnu envoie un DM pour la première fois, il reçoit un code d'appariement. Pour approuver :

```bash
clawdbot pairing approve discord <code>
```

### Configuration des canaux de serveur

#### Configuration de base : Autoriser uniquement des canaux spécifiques

```json5
{
  channels: {
    discord: {
      groupPolicy: "allowlist",  // Mode liste blanche (par défaut)
      guilds: {
        "123456789012345678": {
          requireMention: true,  // Nécessite @mention pour répondre
          channels: {
            help: { allow: true },    // Autoriser #help
            general: { allow: true } // Autoriser #general
          }
        }
      }
    }
  }
}
```

::: tip
`requireMention: true` est une configuration recommandée pour éviter que le Bot ne devienne "trop intelligent" dans les canaux publics.
:::

#### Configuration avancée : Comportement spécifique par canal

```json5
{
  channels: {
    discord: {
      guilds: {
        "123456789012345678": {
          slug: "my-server",              // Nom d'affichage (optionnel)
          reactionNotifications: "own",      // Seules les réactions aux propres messages du Bot déclenchent des événements
          channels: {
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"], // Seuls des utilisateurs spécifiques peuvent déclencher
              skills: ["search", "docs"],    // Limiter les compétences disponibles
              systemPrompt: "Keep answers under 50 words."  // Invite système supplémentaire
            }
          }
        }
      }
    }
  }
}
```

### Opérations d'outils Discord

L'Agent IA peut appeler l'outil `discord` pour effectuer des opérations spécifiques à Discord. Contrôlez les permissions via `channels.discord.actions` :

| Catégorie d'opération | État par défaut | Description |
| --- | --- | --- |
| **reactions** | ✅ Activé | Ajouter/lire les réactions emoji |
| **messages** | ✅ Activé | Lire/envoyer/modifier/supprimer des messages |
| **threads** | ✅ Activé | Créer/répondre aux fils de discussion |
| **channels** | ✅ Activé | Créer/modifier/supprimer des canaux |
| **pins** | ✅ Activé | Épingler/désépingler des messages |
| **search** | ✅ Activé | Rechercher des messages |
| **memberInfo** | ✅ Activé | Interroger les informations des membres |
| **roleInfo** | ✅ Activé | Interroger la liste des rôles |
| **roles** | ❌ **Désactivé** | Ajouter/supprimer des rôles |
| **moderation** | ❌ **Désactivé** | Bannir/expulser/mettre en pause |

#### Désactiver des opérations spécifiques

```json5
{
  channels: {
    discord: {
      actions: {
        channels: false,      // Désactiver la gestion des canaux
        moderation: false,   // Désactiver les opérations de modération
        roles: false         // Désactiver la gestion des rôles
      }
    }
  }
}
```

::: danger Avertissement de sécurité
Lorsque vous activez les opérations `moderation` et `roles`, assurez-vous que l'IA a des invites strictes et un contrôle d'accès, pour éviter d'interdire accidentellement des utilisateurs.
:::

### Autres options de configuration

| Option de configuration | Description | Valeur par défaut |
| --- | --- | --- |
| `historyLimit` | Nombre de messages historiques inclus dans le contexte du canal de serveur | 20 |
| `dmHistoryLimit` | Nombre de messages historiques de session DM | Illimité |
| `textChunkLimit` | Nombre maximal de caractères par message | 2000 |
| `maxLinesPerMessage` | Nombre maximal de lignes par message | 17 |
| `mediaMaxMb` | Taille maximale des fichiers médias téléchargés (Mo) | 8 |
| `chunkMode` | Mode de découpage des messages (`length`/`newline`) | `length` |

---

## Pièges à éviter

### ❌ Erreur "Used disallowed intents"

**Cause** : Le **Message Content Intent** n'est pas activé.

**Solution** :
1. Retournez au Discord Developer Portal
2. Bot → Privileged Gateway Intents
3. Activez **Message Content Intent**
4. Redémarrez le Gateway

### ❌ Le Bot se connecte mais ne répond pas

**Causes possibles** :
1. Le **Message Content Intent** manque
2. Le Bot n'a pas les permissions de canal
3. La configuration exige @mention mais vous n'avez pas mentionné
4. Le canal n'est pas dans la liste blanche

**Étapes de résolution** :
```bash
# Exécuter l'outil de diagnostic
clawdbot doctor

# Vérifier l'état et les permissions du canal
clawdbot channels status --probe
```

### ❌ Code d'appariement DM expiré

**Cause** : Le code d'appariement est valide pendant **1 heure**.

**Solution** : Demandez à l'utilisateur de renvoyer le DM pour obtenir un nouveau code d'appariement, puis approuvez-le.

### ❌ DM de groupe ignoré

**Cause** : Par défaut `dm.groupEnabled: false`.

**Solution** :

```json5
{
  channels: {
    discord: {
      dm: {
        groupEnabled: true,
        groupChannels: ["clawd-dm"]  // Optionnel : autoriser uniquement des DM de groupe spécifiques
      }
    }
  }
}
```

---

## Dépannage

### Diagnostic des problèmes courants

```bash
# 1. Vérifier si le Gateway fonctionne
clawdbot gateway status

# 2. Vérifier l'état de connexion du canal
clawdbot channels status

# 3. Exécuter un diagnostic complet (recommandé !)
clawdbot doctor
```

### Débogage des journaux

Utilisez `--verbose` lors du démarrage du Gateway pour voir les journaux détaillés :

```bash
clawdbot gateway --port 18789 --verbose
```

**Surveillez ces journaux** :
- `Discord channel connected: ...` → Connexion réussie
- `Message received from ...` → Message reçu
- `ERROR: ...` → Information d'erreur

---

## Résumé de la leçon

- Le canal Discord se connecte via **discord.js**, prend en charge les DM et les canaux de serveur
- Créer un Bot nécessite quatre étapes : **application, utilisateur Bot, Gateway Intents, URL d'invitation**
- Le **Message Content Intent** est obligatoire, sans cela le Bot ne peut pas lire les messages
- La **protection par appariement DM** est activée par défaut, les inconnus doivent s'apparier pour discuter
- Les canaux de serveur peuvent être configurés via `guilds.<id>.channels` pour la liste blanche et le comportement
- L'IA peut appeler des outils Discord pour effectuer des opérations de gestion (contrôlables via `actions`)

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprenons le **[Canal Google Chat](../googlechat/)**.
>
> Vous apprendrez :
> - Comment configurer l'authentification OAuth Google Chat
> - Le routage des messages dans Google Chat Space
> - Comment utiliser les limitations de l'API Google Chat

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Schéma de configuration Discord Bot | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L320-L427) | 320-427 |
| Assistant d'intégration Discord | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 1-485 |
| Opérations d'outils Discord | [`src/agents/tools/discord-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions.ts) | 1-72 |
| Opérations de messages Discord | [`src/agents/tools/discord-actions-messaging.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-messaging.ts) | - |
| Opérations de serveur Discord | [`src/agents/tools/discord-actions-guild.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-guild.ts) | - |
| Documentation officielle Discord | [`docs/channels/discord.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/discord.md) | 1-400 |

**Champs Schema clés** :
- `DiscordAccountSchema` : Configuration du compte Discord (token, guilds, dm, actions, etc.)
- `DiscordDmSchema` : Configuration DM (enabled, policy, allowFrom, groupEnabled)
- `DiscordGuildSchema` : Configuration du serveur (slug, requireMention, reactionNotifications, channels)
- `DiscordGuildChannelSchema` : Configuration du canal (allow, requireMention, skills, systemPrompt)

**Fonctions clés** :
- `handleDiscordAction()` : Point d'entrée pour le traitement des opérations d'outils Discord
- `discordOnboardingAdapter.configure()` : Processus de configuration assistée

</details>
