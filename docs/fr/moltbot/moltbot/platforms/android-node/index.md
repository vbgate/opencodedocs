---
title: "Nœud Android : Configuration des opérations locales | Tutoriel Clawdbot"
sidebarTitle: "Laissez l'IA contrôler votre mobile"
subtitle: "Nœud Android : Configuration des opérations locales | Tutoriel Clawdbot"
description: "Apprenez à configurer le nœud Android pour exécuter des opérations locales (Camera, Canvas, Screen). Ce tutoriel présente le processus de connexion, le mécanisme de jumelage et les commandes disponibles."
tags:
  - "Android"
  - "Nœud"
  - "Camera"
  - "Canvas"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 180
---

# Nœud Android : Configuration des opérations locales

## Ce que vous apprendrez

- Connecter un appareil Android au Gateway pour exécuter des opérations locales en tant que nœud
- Contrôler la caméra de l'appareil Android via l'assistant IA pour prendre des photos et enregistrer des vidéos
- Afficher du contenu en temps réel sur Android à l'aide de l'interface de visualisation Canvas
- Gérer l'enregistrement d'écran, la récupération de localisation et l'envoi de SMS

## Votre situation actuelle

Vous souhaitez que l'assistant IA puisse accéder à votre appareil Android — prendre des photos, enregistrer des vidéos, afficher l'interface Canvas — mais vous ne savez pas comment connecter l'appareil au Gateway en toute sécurité.

L'installation directe de l'application Android peut ne pas permettre de découvrir le Gateway, ou la configuration peut échouer. Vous avez besoin d'un processus de connexion clair.

## Quand utiliser cette approche

- **Opérations locales requises** : Vous souhaitez que l'appareil Android exécute des opérations locales (photos, vidéos, enregistrement d'écran) via l'assistant IA
- **Accès multi-réseaux** : L'appareil Android et le Gateway sont sur des réseaux différents et nécessitent une connexion via Tailscale
- **Visualisation Canvas** : Vous devez afficher des interfaces HTML/CSS/JS générées par l'IA sur Android

## 🎒 Avant de commencer

::: warning Prérequis

Avant de commencer, assurez-vous de :

- ✅ **Gateway installé et en cours d'exécution** : Gateway exécuté sur macOS, Linux ou Windows (WSL2)
- ✅ **Appareil Android disponible** : Appareil ou émulateur Android 8.0+
- ✅ **Connexion réseau fonctionnelle** : L'appareil Android peut accéder au port WebSocket du Gateway (par défaut 18789)
- ✅ **CLI disponible** : La commande `clawdbot` est disponible sur l'hôte du Gateway

:::

## Concept fondamental

Le **Nœud Android** est une application compagnon (companion app) qui se connecte au Gateway via WebSocket et expose les capacités d'opérations locales de l'appareil à l'assistant IA.

### Aperçu de l'architecture

```
Appareil Android (application nœud)
        ↓
    Connexion WebSocket
        ↓
    Gateway (plan de contrôle)
        ↓
    Assistant IA + Appel d'outils
```

**Points clés** :
- Android **n'héberge pas** le Gateway, il ne sert que de nœud connecté à un Gateway en cours d'exécution
- Toutes les commandes sont routées vers le nœud Android via la méthode `node.invoke` du Gateway
- Le nœud doit être jumelé (pairing) pour obtenir l'accès

### Fonctionnalités prises en charge

Le nœud Android prend en charge les opérations locales suivantes :

| Fonctionnalité | Commande | Description |
|--- | --- | ---|
| **Canvas** | `canvas.*` | Afficher des interfaces de visualisation en temps réel (A2UI) |
| **Camera** | `camera.*` | Prendre des photos (JPG) et enregistrer des vidéos (MP4) |
| **Screen** | `screen.*` | Enregistrement d'écran |
| **Location** | `location.*` | Obtenir la position GPS |
| **SMS** | `sms.*` | Envoyer des SMS |

::: tip Limitation de premier plan

Toutes les opérations locales (Canvas, Camera, Screen) nécessitent que l'application Android soit **en cours d'exécution au premier plan**. Les appels en arrière-plan renvoient l'erreur `NODE_BACKGROUND_UNAVAILABLE`.

:::

## Suivez-moi

### Étape 1 : Démarrer le Gateway

**Pourquoi**
Le nœud Android doit se connecter à un Gateway en cours d'exécution pour fonctionner. Le Gateway fournit le plan de contrôle WebSocket et le service de jumelage.

```bash
clawdbot gateway --port 18789 --verbose
```

**Vous devriez voir** :
```
listening on ws://0.0.0.0:18789
bonjour: advertising _clawdbot-gw._tcp on local...
```

::: tip Mode Tailscale (recommandé)

Si le Gateway et l'appareil Android sont sur des réseaux différents mais connectés via Tailscale, liez le Gateway à l'IP tailnet :

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: {
    bind: "tailnet"
  }
}
```

Après redémarrage du Gateway, le nœud Android peut être découvert via Wide-Area Bonjour.

:::

### Étape 2 : Vérifier la découverte (optionnel)

**Pourquoi**
Confirmer que le service Bonjour/mDNS du Gateway fonctionne correctement pour faciliter la découverte par l'application Android.

Sur l'hôte du Gateway :

```bash
dns-sd -B _clawdbot-gw._tcp local.
```

**Vous devriez voir** :
```
Timestamp     A/R    IF  N/T   Target              Port
==========   ===   ===  ========               ====
12:34:56.123 Addr   10  _clawdbot-gw._tcp. 18789
```

Si vous voyez une sortie similaire, le Gateway annonce le service de découverte.

::: details Débogage des problèmes Bonjour

Si la découverte échoue, les causes possibles sont :

- **mDNS bloqué** : Certains réseaux Wi-Fi désactivent mDNS
- **Pare-feu** : Bloque le port UDP 5353
- **Isolation réseau** : Les appareils sont sur des VLAN ou sous-réseaux différents

Solution : Utilisez Tailscale + Wide-Area Bonjour, ou configurez manuellement l'adresse du Gateway.

:::

### Étape 3 : Connexion depuis Android

**Pourquoi**
L'application Android découvre le Gateway via mDNS/NSD et établit une connexion WebSocket.

Dans l'application Android :

1. Ouvrez **Paramètres** (Settings)
2. Sélectionnez votre Gateway dans **Gateways découverts**
3. Cliquez sur **Connecter**

**Si mDNS est bloqué** :
- Allez dans **Avancé → Gateway manuel**
- Entrez le **nom d'hôte et le port** du Gateway (par exemple `192.168.1.100:18789`)
- Cliquez sur **Connecter (manuel)**

::: tip Reconnexion automatique

Après le premier jumelage réussi, l'application Android se reconnectera automatiquement au démarrage :
- Si un point de terminaison manuel est configuré, utilisez le point de terminaison manuel
- Sinon, utilisez le dernier Gateway découvert (best effort)

:::

**Point de contrôle ✅**
- L'application Android affiche l'état "Connected"
- L'application affiche le nom d'affichage du Gateway
- L'application affiche l'état du jumelage (Pending ou Paired)

### Étape 4 : Approuver le jumelage (CLI)

**Pourquoi**
Le Gateway doit approuver la demande de jumelage du nœud pour accorder l'accès.

Sur l'hôte du Gateway :

```bash
# Voir les demandes de jumelage en attente
clawdbot nodes pending

# Approuver le jumelage
clawdbot nodes approve <requestId>
```

::: details Processus de jumelage

Flux de travail du jumelage géré par le Gateway :

1. Le nœud Android se connecte au Gateway et demande le jumelage
2. Le Gateway stocke la **demande en attente** et émet un événement `node.pair.requested`
3. Vous approuvez ou rejetez la demande via la CLI
4. Après approbation, le Gateway délivre un nouveau **jeton d'authentification**
5. Le nœud Android utilise le jeton pour se reconnecter et passe à l'état "paired"

Les demandes en attente expirent automatiquement après **5 minutes**.

:::

**Vous devriez voir** :
```
✓ Node approved: android-node-abc123
Token issued: eyJhbGc...
```

L'application Android se reconnectera automatiquement et affichera l'état "Paired".

### Étape 5 : Vérifier que le nœud est connecté

**Pourquoi**
Confirmer que le nœud Android a été jumelé avec succès et connecté au Gateway.

Vérifiez via la CLI :

```bash
clawdbot nodes status
```

**Vous devriez voir** :
```
Known: 1 · Paired: 1 · Connected: 1

┌──────────────────────────────────────────────┐
│ Name: My Samsung Tab                     │
│ Device: Android                          │
│ Model: Samsung SM-X926B                 │
│ IP: 192.168.0.99                      │
│ Status: paired, connected                 │
│ Caps: camera, canvas, screen, location, sms │
└──────────────────────────────────────────────┘
```

Ou via l'API du Gateway :

```bash
clawdbot gateway call node.list --params '{}'
```

### Étape 6 : Tester la fonctionnalité Camera

**Pourquoi**
Vérifier que les commandes Camera du nœud Android fonctionnent correctement et que les autorisations ont été accordées.

Testez la prise de photo via la CLI :

```bash
# Prendre une photo (caméra avant par défaut)
clawdbot nodes camera snap --node "android-node"

# Spécifier la caméra arrière
clawdbot nodes camera snap --node "android-node" --facing back

# Enregistrer une vidéo (3 secondes)
clawdbot nodes camera clip --node "android-node" --duration 3000
```

**Vous devriez voir** :
```
MEDIA: /tmp/clawdbot-camera-snap-123456.jpg
```

::: tip Autorisations Camera

Le nœud Android nécessite les autorisations d'exécution suivantes :

- **CAMERA** : Pour `camera.snap` et `camera.clip`
- **RECORD_AUDIO** : Pour `camera.clip` (lorsque `includeAudio=true`)

Au premier appel des commandes Camera, l'application demandera d'accorder les autorisations. Si refusées, les commandes renverront l'erreur `CAMERA_PERMISSION_REQUIRED` ou `AUDIO_PERMISSION_REQUIRED`.

:::

### Étape 7 : Tester la fonctionnalité Canvas

**Pourquoi**
Vérifier que l'interface de visualisation Canvas peut être affichée sur l'appareil Android.

::: info Canvas Host

Canvas nécessite un serveur HTTP pour fournir le contenu HTML/CSS/JS. Par défaut, le Gateway exécute Canvas Host sur le port 18793.

:::

Créez un fichier Canvas sur l'hôte du Gateway :

```bash
mkdir -p ~/clawd/canvas
echo '<h1>Hello from AI!</h1>' > ~/clawd/canvas/index.html
```

Naviguez vers Canvas dans l'application Android :

```bash
clawdbot nodes invoke --node "android-node" \
  --command canvas.navigate \
  --params '{"url":"http://<gateway-hostname>.local:18793/__clawdbot__/canvas/"}'
```

**Vous devriez voir** :
La page "Hello from AI!" s'affiche dans l'application Android.

::: tip Environnement Tailscale

Si l'appareil Android et le Gateway sont tous les deux sur le réseau Tailscale, remplacez `.local` par le nom MagicDNS ou l'IP tailnet :

```json
{"url":"http://<gateway-magicdns>:18793/__clawdbot__/canvas/"}
```

:::

### Étape 8 : Tester les fonctionnalités Screen et Location

**Pourquoi**
Vérifier que l'enregistrement d'écran et la récupération de localisation fonctionnent correctement.

Enregistrement d'écran :

```bash
# Enregistrer l'écran pendant 10 secondes
clawdbot nodes screen record --node "android-node" --duration 10s --fps 15
```

**Vous devriez voir** :
```
MEDIA: /tmp/clawdbot-screen-record-123456.mp4
```

Récupération de localisation :

```bash
clawdbot nodes invoke --node "android-node" --command location.get
```

**Vous devriez voir** :
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 10,
  "timestamp": 1706345678000
}
```

::: warning Exigences d'autorisation

L'enregistrement d'écran nécessite l'autorisation Android **RECORD_AUDIO** (si l'audio est activé) et l'accès au premier plan. La récupération de localisation nécessite l'autorisation **LOCATION**.

Au premier appel, l'application demandera d'accorder les autorisations.

:::

## Pièges à éviter

### Problème 1 : Impossible de découvrir le Gateway

**Symptôme** : L'application Android ne voit pas le Gateway

**Causes possibles** :
- Le Gateway n'est pas démarré ou est lié à loopback
- mDNS est bloqué sur le réseau
- Le pare-feu bloque le port UDP 5353

**Solutions** :
1. Vérifiez que le Gateway fonctionne : `clawdbot nodes status`
2. Utilisez l'adresse manuelle du Gateway : entrez l'IP et le port du Gateway dans l'application Android
3. Configurez Tailscale + Wide-Area Bonjour (recommandé)

### Problème 2 : Échec de la connexion après jumelage

**Symptôme** : Affiche "Paired" mais impossible de se connecter

**Causes possibles** :
- Le jeton a expiré (le jeton est renouvelé après chaque jumelage)
- Le Gateway a redémarré mais le nœud ne s'est pas reconnecté
- Changement de réseau

**Solutions** :
1. Cliquez manuellement sur "Reconnecter" dans l'application Android
2. Vérifiez les journaux du Gateway : `bonjour: client disconnected ...`
3. Re-jumelez : supprimez le nœud et approuvez à nouveau

### Problème 3 : Les commandes Camera renvoient une erreur d'autorisation

**Symptôme** : `camera.snap` renvoie `CAMERA_PERMISSION_REQUIRED`

**Causes possibles** :
- L'utilisateur a refusé l'autorisation
- L'autorisation est désactivée par la stratégie système

**Solutions** :
1. Recherchez l'application "Clawdbot" dans les paramètres Android
2. Allez dans "Autorisations"
3. Accordez les autorisations Camera et Microphone
4. Réessayez les commandes Camera

### Problème 4 : Échec des appels en arrière-plan

**Symptôme** : Les appels en arrière-plan renvoient `NODE_BACKGROUND_UNAVAILABLE`

**Cause** : Le nœud Android n'autorise que les appels au premier plan pour les commandes locales

**Solutions** :
1. Assurez-vous que l'application s'exécute au premier plan (ouvrez l'application)
2. Vérifiez si l'application est optimisée par le système (optimisation de la batterie)
3. Désactivez les restrictions de "mode économie d'énergie" pour l'application

## Résumé du cours

Ce cours a présenté comment configurer le nœud Android pour exécuter des opérations locales :

- **Processus de connexion** : Connecter le nœud Android au Gateway via mDNS/NSD ou configuration manuelle
- **Mécanisme de jumelage** : Approuver l'accès du nœud à l'aide du jumelage géré par le Gateway
- **Fonctionnalités disponibles** : Camera, Canvas, Screen, Location, SMS
- **Outils CLI** : Gérer les nœuds et appeler les fonctionnalités avec les commandes `clawdbot nodes`
- **Exigences d'autorisation** : L'application Android nécessite des autorisations d'exécution pour Camera, Audio, Location, etc.

**Points clés** :
- Le nœud Android est une application compagnon et n'héberge pas le Gateway
- Toutes les opérations locales nécessitent que l'application s'exécute au premier plan
- Les demandes de jumelage expirent automatiquement après 5 minutes
- Prise en charge de la découverte Wide-Area Bonjour pour les réseaux Tailscale

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons la **[Visualisation Canvas et A2UI](../../advanced/canvas/)**.
>
> Vous apprendrez :
> - Le mécanisme de push Canvas A2UI
> - Comment afficher du contenu en temps réel sur Canvas
> - Liste complète des commandes Canvas

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité        | Chemin du fichier                                                                                    | Lignes    |
|--- | --- | ---|
| Stratégie de commandes nœud | [`src/gateway/node-command-policy.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/node-command-policy.ts) | 1-112   |
| Schéma de protocole nœud | [`src/gateway/protocol/schema/nodes.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/protocol/schema/nodes.ts) | 1-103   |
| Documentation Android  | [`docs/platforms/android.md`](https://github.com/moltbot/moltbot/blob/main/docs/platforms/android.md) | 1-142   |
| CLI Nœuds  | [`docs/cli/nodes.md`](https://github.com/moltbot/moltbot/blob/main/docs/cli/nodes.md) | 1-69    |

**Constantes clés** :
- `PLATFORM_DEFAULTS` : Définit la liste des commandes prises en charge par chaque plateforme (`node-command-policy.ts:32-58`)
- Commandes prises en charge par Android : Canvas, Camera, Screen, Location, SMS (`node-command-policy.ts:34-40`)

**Fonctions clés** :
- `resolveNodeCommandAllowlist()` : Résout la liste des commandes autorisées en fonction de la plateforme (`node-command-policy.ts:77-91`)
- `normalizePlatformId()` : Normalise l'ID de plateforme (`node-command-policy.ts:60-75`)

**Caractéristiques du nœud Android** :
- ID client : `clawdbot-android` (`gateway/protocol/client-info.ts:9`)
- Détection de famille d'appareils : Identifie Android via le champ `deviceFamily` (`node-command-policy.ts:70`)
- Les fonctionnalités Canvas et Camera sont activées par défaut (`docs/platforms/android.md`)

</details>
