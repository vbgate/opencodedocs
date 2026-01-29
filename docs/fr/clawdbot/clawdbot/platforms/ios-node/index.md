---
title: "Configuration du nœud iOS : Connexion à Gateway, caméra, Canvas et Voice Wake | Tutoriel Clawdbot"
sidebarTitle: "Faire utiliser l'iPhone par l'IA"
subtitle: "Guide de configuration du nœud iOS"
description: "Apprenez à configurer un nœud iOS pour se connecter à Gateway, utiliser l'appareil photo, l'interface visuelle Canvas, le réveil vocal Voice Wake, le mode de conversation continue Talk Mode, l'obtention de localisation et d'autres fonctionnalités locales de l'appareil, avec découverte automatique via Bonjour et Tailscale, authentification par appariement et contrôle de sécurité pour la collaboration multi-appareils, supportant les modes premier plan et arrière-plan ainsi que la gestion des autorisations."
tags:
  - "Nœud iOS"
  - "Nœud d'appareil"
  - "Canvas"
  - "Voice Wake"
prerequisite:
  - "start-gateway-startup"
order: 170
---

# Guide de configuration du nœud iOS

## Ce que vous saurez faire

Après avoir configuré un nœud iOS, vous pourrez :

- ✅ Permettre à l'assistant IA d'utiliser l'appareil photo d'un appareil iOS pour prendre des photos ou enregistrer des vidéos
- ✅ Afficher l'interface visuelle Canvas sur l'appareil iOS
- ✅ Utiliser Voice Wake et Talk Mode pour l'interaction vocale
- ✅ Obtenir les informations de localisation de l'appareil iOS
- ✅ Gérer de manière unifiée plusieurs nœuds d'appareils via Gateway

## Votre problème actuel

Vous souhaitez étendre les capacités de votre assistant IA sur votre appareil iOS pour lui permettre de :

- **Utiliser l'appareil photo pour prendre des photos ou enregistrer des vidéos** : lorsque vous dites « Prends une photo », l'IA peut automatiquement utiliser l'iPhone pour prendre une photo
- **Afficher une interface visuelle** : afficher sur l'iPhone les graphiques, formulaires ou panneaux de contrôle générés par l'IA
- **Réveil vocal et conversation continue** : sans utiliser vos mains, il suffit de dire « Clawd » pour réveiller l'assistant et commencer une conversation
- **Obtenir des informations sur l'appareil** : permettre à l'IA de connaître votre localisation, l'état de l'écran et d'autres informations

## Quand utiliser cette méthode

- **Scénarios mobiles** : vous souhaitez que l'IA puisse utiliser les capacités de l'iPhone comme l'appareil photo et l'écran
- **Collaboration multi-appareils** : Gateway s'exécute sur un serveur mais doit appeler des fonctionnalités d'appareils locaux
- **Interaction vocale** : vous souhaitez utiliser l'iPhone comme terminal d'assistant vocal portable

::: info Qu'est-ce qu'un nœud iOS ?
Le nœud iOS est une application Companion qui s'exécute sur iPhone/iPad et se connecte à Clawdbot Gateway via WebSocket. Ce n'est pas Gateway lui-même, mais plutôt une « périphérique » qui fournit des capacités d'opération locales sur l'appareil.

**Différence avec Gateway** :
- **Gateway** : s'exécute sur un serveur/macOS, responsable du routage des messages, de l'appel des modèles IA, de la distribution des outils
- **Nœud iOS** : s'exécute sur iPhone, responsable de l'exécution des opérations locales de l'appareil (appareil photo, Canvas, localisation, etc.)
:::

---

## 🎒 Préparatifs

::: warning Prérequis

Avant de commencer, veuillez confirmer :

1. **Gateway est démarré et en cours d'exécution**
   - Assurez-vous que Gateway s'exécute sur un autre appareil (macOS, Linux ou Windows via WSL2)
   - Gateway est lié à une adresse réseau accessible (réseau local ou Tailscale)

2. **Connectivité réseau**
   - L'appareil iOS et Gateway se trouvent sur le même réseau local (recommandé) ou sont connectés via Tailscale
   - L'appareil iOS peut accéder à l'adresse IP et au port de Gateway (par défaut 18789)

3. **Obtenir l'application iOS**
   - L'application iOS est actuellement une **version d'aperçu interne** et n'est pas distribuée publiquement
   - Vous devez la construire à partir du code source ou obtenir une version de test TestFlight
:::

## Idée principale

Le flux de travail du nœud iOS :

```
[Gateway] ←→ [Nœud iOS]
     ↓            ↓
  [Modèle IA]   [Capacités de l'appareil]
     ↓            ↓
  [Exécution décision]   [Appareil photo/Canvas/Voix]
```

**Points techniques clés** :

1. **Découverte automatique** : Découverte automatique de Gateway via Bonjour (réseau local) ou Tailscale (entre réseaux)
2. **Authentification par appariement** : La première connexion nécessite une approbation manuelle côté Gateway pour établir une relation de confiance
3. **Communication par protocole** : Utilisation du protocole WebSocket (`node.invoke`) pour envoyer des commandes
4. **Contrôle des autorisations** : Les commandes locales de l'appareil nécessitent une autorisation utilisateur (appareil photo, localisation, etc.)

**Caractéristiques de l'architecture** :

- **Sécurité** : Toutes les opérations sur l'appareil nécessitent une autorisation explicite de l'utilisateur côté iOS
- **Isolation** : Le nœud n'exécute pas Gateway, il exécute uniquement des opérations locales
- **Flexibilité** : Supporte divers scénarios d'utilisation : premier plan, arrière-plan, à distance, etc.

---

## Suivez les étapes

### Étape 1 : Démarrer Gateway

Sur l'hôte Gateway, démarrez le service :

```bash
clawdbot gateway --port 18789
```

**Ce que vous devriez voir** :

```
✅ Gateway running on ws://0.0.0.0:18789
✅ Bonjour advertisement active: _clawdbot._tcp
```

::: tip Accès entre réseaux
Si Gateway et l'appareil iOS ne se trouvent pas sur le même réseau local, utilisez **Tailscale Serve/Funnel** :

```bash
clawdbot gateway --port 18789 --tailscale funnel
```

L'appareil iOS découvrira automatiquement Gateway via Tailscale.
:::

### Étape 2 : Connexion de l'application iOS

Dans l'application iOS :

1. Ouvrez **Settings** (Paramètres)
2. Trouvez la section **Gateway**
3. Sélectionnez un Gateway découvert automatiquement (ou activez **Manual Host** ci-dessous pour saisir manuellement l'hôte et le port)

**Ce que vous devriez voir** :

- L'application tente de se connecter à Gateway
- L'état affiche « Connected » ou « Pairing pending »

::: details Configuration manuelle de l'hôte

Si la découverte automatique échoue, saisissez manuellement l'adresse de Gateway :

1. Activez **Manual Host**
2. Saisissez l'hôte Gateway (par exemple `192.168.1.100`)
3. Saisissez le port (par défaut `18789`)
4. Cliquez sur « Connect »

:::

### Étape 3 : Approuver la demande d'appariement

**Sur l'hôte Gateway**, approuvez la demande d'appariement du nœud iOS :

```bash
# Afficher les nœuds en attente d'approbation
clawdbot nodes pending

# Approuver un nœud spécifique (remplacez <requestId>)
clawdbot nodes approve <requestId>
```

**Ce que vous devriez voir** :

```
✅ Node paired successfully
Node: iPhone (iOS)
ID: node-abc123
```

::: tip Refuser l'appariement
Si vous souhaitez refuser la demande de connexion d'un nœud :

```bash
clawdbot nodes reject <requestId>
```

:::

**Point de contrôle ✅** : Vérifiez l'état du nœud sur Gateway

```bash
clawdbot nodes status
```

Vous devriez voir votre nœud iOS affiché avec l'état `paired`.

### Étape 4 : Tester la connexion du nœud

**Tester la communication avec le nœud depuis Gateway** :

```bash
# Appeler une commande de nœud via Gateway
clawdbot gateway call node.list --params "{}"
```

**Ce que vous devriez voir** :

```json
{
  "result": [
    {
      "id": "node-abc123",
      "displayName": "iPhone (iOS)",
      "platform": "ios",
      "capabilities": ["camera", "canvas", "location", "screen", "voicewake"]
    }
  ]
}
```

---

## Utiliser les fonctionnalités du nœud

### Appareil photo

Le nœud iOS prend en charge la prise de photos et l'enregistrement de vidéos :

```bash
# Prendre une photo (caméra avant par défaut)
clawdbot nodes camera snap --node "iPhone (iOS)"

# Prendre une photo (caméra arrière, résolution personnalisée)
clawdbot nodes camera snap --node "iPhone (iOS)" --facing back --max-width 1920

# Enregistrer une vidéo (5 secondes)
clawdbot nodes camera clip --node "iPhone (iOS)" --duration 5000
```

**Ce que vous devriez voir** :

```
MEDIA:/tmp/clawdbot-camera-snap-abc123.jpg
```

::: warning Exigence de premier plan
Les commandes d'appareil photo exigent que l'application iOS soit au **premier plan**. Si l'application est en arrière-plan, elle renverra une erreur `NODE_BACKGROUND_UNAVAILABLE`.

:::

**Paramètres de l'appareil photo iOS** :

| Paramètre | Type | Défaut | Description |
| --- | --- | --- | --- |
| `facing` | `front\|back` | `front` | Orientation de la caméra |
| `maxWidth` | number | `1600` | Largeur maximale (pixels) |
| `quality` | `0..1` | `0.9` | Qualité JPEG (0-1) |
| `durationMs` | number | `3000` | Durée vidéo (millisecondes) |
| `includeAudio` | boolean | `true` | Inclure l'audio |

### Interface visuelle Canvas

Le nœud iOS peut afficher l'interface visuelle Canvas :

```bash
# Naviguer vers une URL
clawdbot nodes canvas navigate --node "iPhone (iOS)" --target "https://example.com"

# Exécuter du JavaScript
clawdbot nodes canvas eval --node "iPhone (iOS)" --js "document.title"

# Capturer d'écran (enregistrer en JPEG)
clawdbot nodes canvas snapshot --node "iPhone (iOS)" --format jpeg --max-width 900
```

**Ce que vous devriez voir** :

```
MEDIA:/tmp/clawdbot-canvas-snap-abc123.jpg
```

::: tip A2UI envoi automatique
Si Gateway a configuré `canvasHost`, le nœud iOS naviguera automatiquement vers l'interface A2UI lors de la connexion.
:::

### Réveil vocal Voice Wake

Activez Voice Wake dans les **Settings** de l'application iOS :

1. Activez l'interrupteur **Voice Wake**
2. Configurez le mot de réveil (par défaut : « clawd », « claude », « computer »)
3. Assurez-vous qu'iOS a autorisé l'accès au microphone

::: info Mot de réveil global
Le mot de réveil Clawdbot est une **configuration globale**, gérée par Gateway. Tous les nœuds (iOS, Android, macOS) utilisent la même liste de mots de réveil.

La modification des mots de réveil se synchronise automatiquement sur tous les appareils.
:::

### Mode de conversation continue Talk Mode

Une fois Talk Mode activé, l'IA lira les réponses via TTS en continu et écoutera les entrées vocales en continu :

1. Activez **Talk Mode** dans les **Settings** de l'application iOS
2. L'IA lira automatiquement les réponses
3. Vous pouvez continuer à parler sans avoir à cliquer manuellement

::: warning Limitations en arrière-plan
iOS peut suspendre l'audio en arrière-plan. Lorsque l'application n'est pas au premier plan, les fonctionnalités vocales sont **de meilleure effort** (best-effort).
:::

---

## Questions fréquentes

### L'invite d'appariement n'apparaît jamais

**Problème** : L'application iOS affiche « Connected », mais Gateway n'affiche pas d'invite d'appariement.

**Solution** :

```bash
# 1. Afficher manuellement les nœuds en attente
clawdbot nodes pending

# 2. Approuver le nœud
clawdbot nodes approve <requestId>

# 3. Vérifier la connexion
clawdbot nodes status
```

### Échec de connexion (après réinstallation)

**Problème** : Impossible de se connecter à Gateway après la réinstallation de l'application iOS.

**Cause** : Le jeton d'appariement dans le Keychain a été effacé.

**Solution** : Refaites le processus d'appariement (étape 3).

### A2UI_HOST_NOT_CONFIGURED

**Problème** : La commande Canvas échoue avec le message `A2UI_HOST_NOT_CONFIGURED`.

**Cause** : Gateway n'a pas configuré l'URL `canvasHost`.

**Solution** :

Configurez l'hôte Canvas dans la configuration de Gateway :

```bash
clawdbot config set canvasHost "http://<gateway-host>:18793/__clawdbot__/canvas/"
```

### NODE_BACKGROUND_UNAVAILABLE

**Problème** : Les commandes appareil photo/Canvas échouent avec `NODE_BACKGROUND_UNAVAILABLE`.

**Cause** : L'application iOS n'est pas au premier plan.

**Solution** : Basculez l'application iOS au premier plan, puis réessayez la commande.

---

## Résumé

Dans cette leçon, vous avez appris :

✅ Le concept et l'architecture du nœud iOS
✅ Comment découvrir automatiquement et se connecter à Gateway
✅ Le processus d'authentification par appariement
✅ L'utilisation des fonctionnalités : appareil photo, Canvas, Voice Wake, etc.
✅ Les méthodes de dépannage des problèmes courants

**Points clés** :

- Le nœud iOS est un fournisseur de capacités d'opération locales sur l'appareil, ce n'est pas Gateway
- Toutes les opérations sur l'appareil nécessitent une autorisation de l'utilisateur et un état au premier plan
- L'appariement est une étape nécessaire pour la sécurité, seuls les nœuds approuvés sont fiables
- Voice Wake et Talk Mode nécessitent des autorisations de microphone

## Prochaine leçon

> Dans la prochaine leçon, nous apprendrons la **[configuration du nœud Android](../android-node/)**.
>
> Vous apprendrez :
> - Comment configurer un nœud Android pour se connecter à Gateway
> - Utiliser les fonctionnalités d'appareil photo, d'enregistrement d'écran et Canvas des appareils Android
> - Gérer les problèmes d'autorisation et de compatibilité spécifiques à Android

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Ligne |
| --- | --- | --- |
| Point d'entrée de l'application iOS | [`apps/ios/Sources/ClawdbotApp.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/ClawdbotApp.swift) | 1-30 |
| Rendu Canvas | [`apps/ios/Sources/RootCanvas.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/RootCanvas.swift) | 1-250 |
| Connexion Gateway | [`apps/ios/Sources/Gateway/`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/Gateway/) | - |
| Runner de protocole de nœud | [`src/node-host/runner.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/runner.ts) | 1-1100 |
| Configuration de nœud | [`src/node-host/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/config.ts) | 1-50 |
| Documentation de la plateforme iOS | [`docs/platforms/ios.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/ios.md) | 1-105 |
| Documentation du système de nœuds | [`docs/nodes/index.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/index.md) | 1-306 |

**Constantes clés** :
- `GATEWAY_DEFAULT_PORT = 18789` : Port par défaut de Gateway
- `NODE_ROLE = "node"` : Identifiant de rôle de connexion de nœud

**Commandes clés** :
- `clawdbot nodes pending` : Lister les nœuds en attente d'approbation
- `clawdbot nodes approve <requestId>` : Approuver l'appariement d'un nœud
- `clawdbot nodes invoke --node <id> --command <cmd>` : Appeler une commande de nœud
- `clawdbot nodes camera snap --node <id>` : Prendre une photo
- `clawdbot nodes canvas navigate --node <id> --target <url>` : Naviguer vers un Canvas

**Méthodes de protocole** :
- `node.invoke.request` : Demande d'appel de commande de nœud
- `node.invoke.result` : Résultat d'exécution de commande de nœud
- `voicewake.get` : Obtenir la liste des mots de réveil
- `voicewake.set` : Définir la liste des mots de réveil
- `voicewake.changed` : Événement de modification des mots de réveil

</details>
