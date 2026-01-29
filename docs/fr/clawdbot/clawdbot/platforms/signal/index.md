---
title: "Configuration du canal Signal : Intégration sécurisée de l'assistant IA avec signal-cli | Tutoriel Clawdbot"
sidebarTitle: "Connecter une IA Signal privée"
subtitle: "Configuration du canal Signal : Intégration sécurisée de l'assistant IA avec signal-cli | Tutoriel Clawdbot"
description: "Apprenez à configurer le canal Signal dans Clawdbot, y compris l'installation de signal-cli, la liaison de compte, la prise en charge multi-compte, le mécanisme d'appariement DM, les messages de groupe et le contrôle d'accès. Ce tutoriel explique en détail le processus complet de l'installation à l'utilisation, vous aidant à déployer rapidement un assistant IA personnel basé sur Signal."
tags:
  - "Signal"
  - "signal-cli"
  - "Configuration de canal"
  - "Plateforme de messagerie"
prerequisite:
  - "start-getting-started"
order: 120
---

# Configuration du canal Signal : Connecter un assistant IA personnel avec signal-cli | Tutoriel Clawdbot

## Ce que vous saurez faire

Après avoir terminé ce cours, vous serez capable de :

- ✅ Installer et configurer signal-cli
- ✅ Configurer le canal Signal dans Clawdbot
- ✅ Interagir avec l'assistant IA via des messages privés et des groupes
- ✅ Utiliser le mécanisme d'appariement DM pour protéger votre compte
- ✅ Configurer la prise en charge multi-compte Signal
- ✅ Utiliser les indicateurs de frappe, les accusés de lecture et les réactions de Signal

## Votre problème actuel

Vous souhaitez utiliser un assistant IA sur Signal, mais vous rencontrez ces problèmes :

- ❌ Vous ne savez pas comment connecter Signal et Clawdbot
- ❌ Vous craignez des problèmes de confidentialité et ne voulez pas télécharger vos données dans le cloud
- ❌ Vous n'êtes pas sûr de savoir comment contrôler qui peut envoyer des messages à l'assistant IA
- ❌ Vous devez basculer entre plusieurs comptes Signal

::: info Pourquoi choisir Signal ?

Signal est une application de messagerie instantanée avec chiffrement de bout en bout. Toutes les communications sont chiffrées et seuls l'expéditeur et le destinataire peuvent lire les messages. Clawdbot s'intègre via signal-cli, vous permettant de profiter des fonctionnalités de l'assistant IA tout en préservant votre confidentialité.
:::

## Quand utiliser cette méthode

**Scénarios adaptés à l'utilisation du canal Signal** :

- Vous avez besoin d'un canal de communication axé sur la confidentialité
- Votre équipe ou vos groupes d'amis utilisent Signal
- Vous devez exécuter l'assistant IA sur un appareil personnel (priorité locale)
- Vous devez contrôler l'accès via un mécanisme d'appariement DM protégé

::: tip Compte Signal indépendant

Il est recommandé d'utiliser un **numéro Signal indépendant** comme compte bot, plutôt que votre numéro personnel. Cela permet d'éviter les boucles de messages (le bot ignore ses propres messages) et de séparer les communications professionnelles et personnelles.
:::

## Prérequis

Avant de commencer, assurez-vous d'avoir terminé les étapes suivantes :

::: warning Conditions préalables
- ✅ Avoir terminé le tutoriel [Démarrage rapide](../../start/getting-started/)
- ✅ Clawdbot est installé et fonctionne normalement
- ✅ Au moins un fournisseur de modèle IA est configuré (Anthropic, OpenAI, OpenRouter, etc.)
- ✅ Java est installé (requis pour signal-cli)
:::

## Concepts de base

L'intégration Signal de Clawdbot est basée sur **signal-cli** et fonctionne de la manière suivante :

1. **Mode démon** : signal-cli s'exécute en arrière-plan en tant que démon, fournissant une interface HTTP JSON-RPC
2. **Flux d'événements (SSE)** : Clawdbot reçoit les événements Signal via Server-Sent Events (SSE)
3. **Messages normalisés** : Les messages Signal sont convertis en un format interne unifié, puis acheminés vers l'agent IA
4. **Routage déterministe** : Toutes les réponses sont renvoyées à l'expéditeur ou au groupe du message original

**Principes de conception clés** :

- **Priorité locale** : signal-cli s'exécute sur votre appareil, toutes les communications sont chiffrées
- **Prise en charge multi-compte** : Plusieurs comptes Signal peuvent être configurés
- **Contrôle d'accès** : Le mécanisme d'appariement DM est activé par défaut, les inconnus doivent être approuvés pour envoyer des messages
- **Isolation du contexte** : Les messages de groupe ont un contexte de session indépendant et ne sont pas mélangés avec les messages privés

## Suivez le guide

### Étape 1 : Installer signal-cli

**Pourquoi**

signal-cli est l'interface en ligne de commande de Signal. Clawdbot l'utilise pour communiquer avec le réseau Signal.

**Méthodes d'installation**

::: code-group

```bash [macOS (Homebrew)]
brew install signal-cli
```

```bash [Linux (Ubuntu/Debian)]
# Visitez https://github.com/AsamK/signal-cli/releases pour voir la dernière version
# Téléchargez le dernier paquet signal-cli (remplacez VERSION par le numéro de version réel)
wget https://github.com/AsamK/signal-cli/releases/download/vVERSION/signal-cli-VERSION.tar.gz

# Extrayez dans le répertoire /opt
sudo tar -xvf signal-cli-VERSION.tar.gz -C /opt/

# Créez un lien symbolique (optionnel)
sudo ln -s /opt/signal-cli-VERSION/bin/signal-cli /usr/local/bin/signal-cli
```

```bash [Windows (WSL2)]
# Utilisez la méthode d'installation Linux dans WSL2
# Remarque : Windows utilise WSL2, l'installation de signal-cli suit le processus Linux
```

:::

**Vérifier l'installation**

```bash
signal-cli --version
# Devrait afficher : version de signal-cli (comme 0.13.x ou supérieur)
```

**Ce que vous devriez voir** : Le numéro de version de signal-cli affiché.

::: danger Exigences Java

signal-cli nécessite un environnement d'exécution Java (généralement Java 11 ou supérieur). Assurez-vous que Java est installé et configuré correctement :

```bash
java -version
# Devrait afficher : openjdk version "11.x.x" ou supérieur
```

**Remarque** : Pour connaître les exigences spécifiques de version de Java, reportez-vous à la [documentation officielle de signal-cli](https://github.com/AsamK/signal-cli#readme).
:::

### Étape 2 : Lier un compte Signal

**Pourquoi**

Une fois le compte lié, signal-cli peut envoyer et recevoir des messages au nom de votre numéro Signal.

**Recommandation** : Utilisez un numéro Signal indépendant comme compte bot.

**Étapes de liaison**

1. **Générer la commande de liaison** :

```bash
signal-cli link -n "Clawdbot"
```

`-n "Clawdbot"` spécifie le nom de l'appareil comme "Clawdbot" (vous pouvez le personnaliser).

2. **Scanner le code QR** :

Après avoir exécuté la commande, le terminal affichera un code QR :

```
tsconfig: 2369:35 - warning - *! is deprecated: Use .nonNull().
  (deprecated-non-null)

To link your device, navigate to
  Signal Settings > Linked Devices > (+) Link New Device
  on your phone and scan the QR code displayed below.

████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
...
```

3. **Dans l'application mobile Signal** :

    - Ouvrez les paramètres Signal
    - Sélectionnez "Appareils liés" (Linked Devices)
    - Cliquez sur "(+) Lier un nouvel appareil" (Link New Device)
    - Scannez le code QR affiché dans le terminal

**Ce que vous devriez voir** : Une fois la liaison réussie, le terminal affichera une sortie similaire à :

```
INFO  Account restored (Number: +15551234567)
INFO  Configuration created at: ~/.local/share/signal-cli/data
```

::: tip Prise en charge multi-appareils

Signal permet de lier jusqu'à 4 appareils. Clawdbot s'exécutera comme l'un de ces appareils. Vous pouvez consulter et gérer ces appareils dans "Appareils liés" de l'application mobile Signal.
:::

### Étape 3 : Configurer le canal Signal de Clawdbot

**Pourquoi**

Le fichier de configuration indique à Clawdbot comment se connecter à signal-cli et comment traiter les messages provenant de Signal.

**Méthodes de configuration**

Il existe trois méthodes de configuration, choisissez celle qui vous convient le mieux :

#### Méthode 1 : Configuration rapide (compte unique)

C'est la méthode la plus simple, adaptée aux scénarios de compte unique.

Modifiez `~/.clawdbot/clawdbot.json` :

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "account": "+15551234567",
      "cliPath": "signal-cli",
      "dmPolicy": "pairing",
      "allowFrom": ["+15557654321"]
    }
  }
}
```

**Explication de la configuration** :

| Champ | Valeur | Description |
|--- | --- | ---|
| `enabled` | `true` | Activer le canal Signal |
| `account` | `"+15551234567"` | Votre compte Signal (format E.164) |
| `cliPath` | `"signal-cli"` | Chemin de la commande signal-cli |
| `dmPolicy` | `"pairing"` | Stratégie d'accès DM (mode d'appariement par défaut) |
| `allowFrom` | `["+15557654321"]` | Liste blanche des numéros autorisés à envoyer des DM |

#### Méthode 2 : Configuration multi-compte

Si vous devez gérer plusieurs comptes Signal, utilisez l'objet `accounts` :

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "accounts": {
        "work": {
          "account": "+15551234567",
          "name": "Work Bot",
          "httpPort": 8080,
          "dmPolicy": "pairing",
          "allowFrom": ["+15557654321"]
        },
        "personal": {
          "account": "+15559876543",
          "name": "Personal Bot",
          "httpPort": 8081,
          "dmPolicy": "allowlist",
          "allowFrom": ["*"]
        }
      }
    }
  }
}
```

**Explication de la configuration** :

- Chaque compte a un ID unique (comme `work`, `personal`)
- Chaque compte peut avoir différents ports, stratégies et autorisations
- `name` est un nom d'affichage optionnel, utilisé dans les listes CLI/UI

#### Méthode 3 : Mode démon externe

Si vous souhaitez gérer signal-cli vous-même (par exemple dans un conteneur ou avec un CPU partagé), désactivez le démarrage automatique :

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "httpUrl": "http://127.0.0.1:8080",
      "autoStart": false
    }
  }
}
```

**Explication de la configuration** :

- `httpUrl` : URL complète du démon (remplace `httpHost` et `httpPort`)
- `autoStart` : Définir sur `false` pour désactiver le démarrage automatique de signal-cli
- Clawdbot se connectera au démon signal-cli déjà en cours d'exécution

**Ce que vous devriez voir** : Après avoir enregistré le fichier de configuration, aucune erreur de syntaxe.

::: tip Validation de la configuration

Clawdbot validera la configuration au démarrage. Si la configuration contient des erreurs, des messages d'erreur détaillés s'afficheront dans les journaux.
:::

### Étape 4 : Démarrer la passerelle

**Pourquoi**

Une fois la passerelle démarrée, Clawdbot démarrera automatiquement le démon signal-cli (sauf si vous avez désactivé `autoStart`) et commencera à écouter les messages Signal.

**Commande de démarrage**

```bash
clawdbot gateway start
```

**Ce que vous devriez voir** : Une sortie similaire à :

```
[INFO] Starting Clawdbot Gateway...
[INFO] Starting signal-cli daemon...
[INFO] signal-cli: INFO  Starting daemon...
[INFO] signal-cli: INFO  Daemon started on http://127.0.0.1:8080
[INFO] Signal channel ready (account: +15551234567)
[INFO] Gateway listening on ws://127.0.0.1:18789
[INFO] Clawdbot Gateway started successfully
```

**Vérifier l'état du canal**

```bash
clawdbot channels status
```

**Ce que vous devriez voir** : Une sortie similaire à :

```
Signal Channels:
  ├─ +15551234567 (Work Bot)
  │   ├─ Status: Connected
  │   ├─ Daemon: http://127.0.0.1:8080
  │   └─ Mode: Auto-start
```

### Étape 5 : Envoyer le premier message

**Pourquoi**

Vérifier que la configuration est correcte et que Clawdbot peut recevoir et traiter les messages Signal.

**Envoyer un message**

1. **Depuis votre application mobile Signal**, envoyez un message à votre numéro bot :

```
Bonjour, Clawdbot !
```

2. **Traitement du premier message** :

    Si `dmPolicy="pairing"` (par défaut), les inconnus recevront un code d'appariement :

    ```
    ❌ Expéditeur non autorisé

    Pour continuer, veuillez approuver cet appariement en utilisant le code suivant :

    📝 Code d'appariement : ABC123

    Le code expirera dans 1 heure.

    Pour approuver, exécutez :
    clawdbot pairing approve signal ABC123
    ```

3. **Approuver l'appariement** :

    ```bash
    clawdbot pairing list signal
    ```

    Liste des demandes d'appariement en attente :

    ```
    Pending Pairings (Signal):
      ├─ ABC123
      │   ├─ Sender: +15557654321
      │   ├─ UUID: uuid:123e4567-e89b-12d3-a456-426614174000
      │   └─ Expires: 2026-01-27 12:00:00
    ```

    Approuver l'appariement :

    ```bash
    clawdbot pairing approve signal ABC123
    ```

4. **Envoyer le deuxième message** :

    Une fois l'appariement réussi, renvoyez le message :

    ```
    Bonjour, Clawdbot !
    ```

**Ce que vous devriez voir** :

- L'application mobile Signal reçoit la réponse de l'IA :
  ```
  Bonjour ! Je suis Clawdbot, votre assistant IA personnel. Comment puis-je vous aider ?
  ```

- Les journaux de la passerelle affichent :
  ```
  [INFO] Received Signal message from +15557654321
  [INFO] Processing message through Agent...
  [INFO] Sending Signal response to +15557654321
  ```

**Point de contrôle ✅** :

- [ ] Le démon signal-cli est en cours d'exécution
- [ ] L'état du canal affiche "Connected"
- [ ] Vous recevez une réponse IA après avoir envoyé un message
- [ ] Aucun message d'erreur dans les journaux de la passerelle

::: danger Vos propres messages seront ignorés

Si vous exécutez le bot sur votre numéro Signal personnel, le bot ignorera les messages que vous envoyez vous-même (protection contre les boucles). Il est recommandé d'utiliser un numéro bot indépendant.
:::

## Problèmes fréquents

### Problème 1 : Échec du démarrage de signal-cli

**Problème** : Le démon signal-cli ne peut pas démarrer

**Causes possibles** :

1. Java n'est pas installé ou la version est trop ancienne
2. Le port est déjà utilisé
3. Le chemin signal-cli est incorrect

**Solutions** :

```bash
# Vérifier la version Java
java -version

# Vérifier l'utilisation du port
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows (PowerShell)

# Vérifier le chemin signal-cli
which signal-cli
```

### Problème 2 : Code d'appariement expiré

**Problème** : Le code d'appariement expire après 1 heure

**Solution** :

Renvoyez le message pour obtenir un nouveau code d'appariement et approuvez-le dans l'heure.

### Problème 3 : Pas de réponse aux messages de groupe

**Problème** : Vous mentionnez le bot avec @ dans un groupe Signal, mais pas de réponse

**Causes possibles** :

- `groupPolicy` est défini sur `allowlist`, mais vous n'êtes pas dans `groupAllowFrom`
- Signal ne prend pas en charge nativement les mentions @ (contrairement à Discord/Slack)

**Solutions** :

Configurez la stratégie de groupe :

```json
{
  "channels": {
    "signal": {
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["+15557654321"]
    }
  }
}
```

Ou utilisez le déclencheur de commande (si `commands.config: true` est configuré) :

```
@clawdbot help
```

### Problème 4 : Échec du téléchargement de fichiers médias

**Problème** : Les images ou pièces jointes dans les messages Signal ne peuvent pas être traitées

**Causes possibles** :

- La taille du fichier dépasse la limite `mediaMaxMb` (par défaut 8 Mo)
- `ignoreAttachments` est défini sur `true`

**Solutions** :

```json
{
  "channels": {
    "signal": {
      "mediaMaxMb": 20,
      "ignoreAttachments": false
    }
  }
}
```

### Problème 5 : Messages longs tronqués

**Problème** : Les messages envoyés sont divisés en plusieurs parties

**Cause** : Signal a une limite de longueur de message (par défaut 4000 caractères), Clawdbot divisera automatiquement en blocs

**Solutions** :

Ajustez la configuration de découpage :

```json
{
  "channels": {
    "signal": {
      "textChunkLimit": 2000,
      "chunkMode": "newline"
    }
  }
}
```

Options `chunkMode` :
- `length` (par défaut) : Découpage par longueur
- `newline` : Découpage d'abord par lignes vides (limites de paragraphe), puis par longueur

## Résumé du cours

Dans ce cours, nous avons terminé la configuration et l'utilisation du canal Signal :

**Concepts clés** :
- Le canal Signal est basé sur signal-cli, communiquant via HTTP JSON-RPC + SSE
- Il est recommandé d'utiliser un numéro bot indépendant pour éviter les boucles de messages
- Le mécanisme d'appariement DM est activé par défaut pour protéger la sécurité de votre compte

**Configurations clés** :
- `account` : Compte Signal (format E.164)
- `cliPath` : Chemin signal-cli
- `dmPolicy` : Stratégie d'accès DM (par défaut `pairing`)
- `allowFrom` : Liste blanche DM
- `groupPolicy` / `groupAllowFrom` : Stratégie de groupe

**Fonctionnalités pratiques** :
- Prise en charge multi-compte
- Messages de groupe (contexte indépendant)
- Indicateurs de frappe
- Accusés de lecture
- Réactions (emojis)

**Dépannage** :
- Utilisez `clawdbot channels status` pour vérifier l'état du canal
- Utilisez `clawdbot pairing list signal` pour voir les demandes d'appariement en attente
- Consultez les journaux de la passerelle pour des messages d'erreur détaillés

## Prochain cours

> Le prochain cours couvre **[Canal iMessage](../imessage/)**.
>
> Vous apprendrez :
> - Comment configurer le canal iMessage sur macOS
> - Utilisation de l'extension BlueBubbles
> - Fonctionnalités spéciales d'iMessage (accusés de lecture, indicateurs de frappe, etc.)
> - Intégration des nœuds iOS (Camera, Canvas, Voice Wake)

Continuez à explorer les puissantes fonctionnalités de Clawdbot ! 🚀

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Client RPC Signal | [`src/signal/client.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/client.ts) | 1-186 |
| Gestion du démon Signal | [`src/signal/daemon.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/daemon.ts) | 1-85 |
| Prise en charge multi-compte | [`src/signal/accounts.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/accounts.ts) | 1-84 |
| Surveillance Signal et gestion des événements | [`src/signal/monitor.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/monitor.ts) | - |
| Envoi de messages | [`src/signal/send.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send.ts) | - |
| Envoi de réactions | [`src/signal/send-reactions.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send-reactions.ts) | - |
| Configuration du niveau de réaction | [`src/signal/reaction-level.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/reaction-level.ts) | - |

**Définitions de types de configuration** :
- `SignalAccountConfig`: [`src/config/types.signal.ts:13-87`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L13-L87)
- `SignalConfig`: [`src/config/types.signal.ts:89-93`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L89-L93)

**Constantes clés** :
- `DEFAULT_TIMEOUT_MS = 10_000` : Délai d'expiration par défaut des requêtes RPC Signal (10 secondes) Source : `src/signal/client.ts:29`
- Port HTTP par défaut : `8080` Source : `src/signal/accounts.ts:59`
- Taille de découpage de texte par défaut : `4000` caractères Source : `docs/channels/signal.md:113`

**Fonctions clés** :
- `signalRpcRequest<T>()` : Envoyer une requête JSON-RPC à signal-cli Source : `src/signal/client.ts:54-90`
- `streamSignalEvents()` : S'abonner aux événements Signal via SSE Source : `src/signal/client.ts:112-185`
- `spawnSignalDaemon()` : Démarrer le démon signal-cli Source : `src/signal/daemon.ts:50-84`
- `resolveSignalAccount()` : Résoudre la configuration du compte Signal Source : `src/signal/accounts.ts:49-77`
- `listEnabledSignalAccounts()` : Lister les comptes Signal activés Source : `src/signal/accounts.ts:79-83`

</details>
