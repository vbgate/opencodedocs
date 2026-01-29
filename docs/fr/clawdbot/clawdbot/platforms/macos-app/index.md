---
title: "Guide complet de l'application macOS : barre de menus, Voice Wake, Talk Mode et mode nœud | Tutoriel Clawdbot"
sidebarTitle: "Transformez votre Mac en assistant IA"
subtitle: "Guide complet de l'application macOS : barre de menus, Voice Wake, Talk Mode et mode nœud"
description: "Apprenez toutes les fonctionnalités de l'application Clawdbot pour macOS, y compris la gestion de la barre de menus, la fenêtre WebChat intégrée, Voice Wake, Talk Mode, le mode nœud, Exec Approvals et la configuration SSH/Tailscale pour l'accès distant. Maîtrisez la commutation entre les modes local et distant et les meilleures pratiques de gestion des permissions."
tags:
  - "macOS"
  - "Application de barre de menus"
  - "Voice Wake"
  - "Talk Mode"
  - "Mode nœud"
prerequisite:
  - "start-getting-started"
order: 160
---

# Application macOS : Contrôle de la barre de menus et interaction vocale

## Ce que vous pourrez faire après ce cours

Après avoir terminé ce tutoriel, vous serez capable de :

- ✅ Comprendre le rôle central de l'application Clawdbot pour macOS en tant que plan de contrôle de la barre de menus
- ✅ Maîtriser l'utilisation de Voice Wake et Talk Mode pour le dialogue continu
- ✅ Comprendre les capacités du mode nœud : `system.run`, Canvas, Camera, etc.
- ✅ Configurer les modes local et distant pour différents scénarios de déploiement
- ✅ Gérer le mécanisme d'approbation Exec Approvals pour contrôler les permissions d'exécution
- ✅ Utiliser les liens profonds pour déclencher rapidement l'assistant IA
- ✅ Accéder et contrôler le Gateway à distance via SSH/Tailscale

## Votre situation actuelle

Vous vous demandez peut-être :

- "Que fait exactement l'application macOS ? Est-ce le Gateway lui-même ?"
- "Comment utiliser Voice Wake et Talk Mode ? Ont-ils besoin de matériel supplémentaire ?"
- "Quelle est la différence entre le mode nœud et le mode normal ? Quand utiliser lequel ?"
- "Comment gérer les permissions et les paramètres de sécurité sur macOS ?"
- "Puis-je exécuter le Gateway sur une autre machine ?"

La bonne nouvelle est : **l'application Clawdbot pour macOS est le plan de contrôle graphique du Gateway**. Elle n'exécute pas le service Gateway, mais se connecte, gère et surveille. En même temps, elle agit également comme un nœud exposant les fonctionnalités spécifiques à macOS (comme `system.run`, Canvas, Camera) à un Gateway distant.

## Quand utiliser cette approche

Lorsque vous avez besoin de :

- 🖥️ **Gestion graphique macOS** - Statut et contrôle de la barre de menus, plus intuitif que la ligne de commande
- 🎙️ **Interaction vocale** - Voice Wake + Talk Mode pour le dialogue continu
- 💻 **Exécution de commandes locales** - Exécuter des commandes comme `system.run` sur le nœud macOS
- 🎨 **Visualisation Canvas** - Rendre des interfaces visuelles alimentées par l'IA sur macOS
- 📷 **Fonctionnalités de l'appareil** - Photo, vidéo et enregistrement d'écran avec Camera
- 🌐 **Accès à distance** - Contrôler le Gateway distant via SSH/Tailscale

::: info Différence entre nœud et Gateway
- **Gateway** : Exécute les modèles d'IA, gère les sessions, traite les messages (peut fonctionner sur n'importe quelle machine)
- **Nœud (Node)** : Expose les fonctionnalités locales de l'appareil (Canvas, Camera, system.run) au Gateway
- **Application macOS** : Peut être à la fois un client Gateway et un nœud
:::

---

## Concepts de base

L'application Clawdbot pour macOS est un système à **double rôle** :

```
┌──────────────────────────────────────────┐
│     Clawdbot.app (Application macOS)    │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Plan de contrôle de la   │      │
│   │  barre de menus           │      │
│   │  • Gestion de connexion   │◄────► Gateway WebSocket
│   │    Gateway                │      │
│   │  • Fenêtre WebChat        │      │
│   │    intégrée               │      │
│   │  • Paramètres et          │      │
│   │    configuration          │      │
│   │  • Voice Wake/Talk Mode   │      │
│   └────────────────────────────┘      │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Service nœud          │      │
│   │  • system.run              │◄────► Protocole nœud Gateway
│   │  • Canvas                 │      │
│   │  • Camera/Screen          │      │
│   └────────────────────────────┘      │
└──────────────────────────────────────────┘
```

**Deux modes de fonctionnement** :

| Mode | Emplacement du Gateway | Service nœud | Scénario |
| ----- | -------------- | --------- | -------- |
| **Mode local** (défaut) | Machine locale (démon launchd) | Non démarré | Gateway fonctionne sur ce Mac |
| **Mode distant** | Machine distante (via SSH/Tailscale) | Démarré | Gateway fonctionne sur une autre machine |

**Modules fonctionnels principaux** :

1. **Contrôle de la barre de menus** - État de connexion Gateway, WebChat, configuration, gestion des sessions
2. **Voice Wake** - Écoute globale du mot de réveil
3. **Talk Mode** - Boucle de dialogue vocal continu (entrée vocale → réponse IA → lecture TTS)
4. **Mode nœud** - Expose les commandes spécifiques à macOS (`system.run`, `canvas.*`, `camera.*`)
5. **Exec Approvals** - Approbation d'exécution et contrôle de sécurité des commandes `system.run`
6. **Liens profonds** - Protocole `clawdbot://` pour déclencher rapidement des fonctionnalités

---

## Suivez le guide

### Étape 1 : Installer et démarrer l'application macOS

**Pourquoi**
Vous devez installer l'application Clawdbot pour macOS pour obtenir le contrôle de la barre de menus et les fonctionnalités vocales.

**Méthodes d'installation** :

::: code-group

```bash [Installation via Homebrew]
brew install --cask clawdbot
```

```bash [Téléchargement manuel .dmg]
# Téléchargez le dernier Clawdbot.app.dmg depuis https://github.com/clawdbot/clawdbot/releases
# Faites-le glisser vers le dossier Applications
```

:::

**Premier démarrage** :

```bash
open /Applications/Clawdbot.app
```

**Ce que vous devriez voir** :
- L'icône 🦞 apparaît dans la barre de menus macOS en haut
- Cliquez sur l'icône pour développer le menu déroulant
- macOS affiche la boîte de dialogue de demande de permissions TCC

::: tip Demande de permissions au premier démarrage
L'application macOS nécessite les permissions suivantes (le système affichera automatiquement les invites) :
- **Permission de notification** - Afficher les notifications système
- **Permission d'accessibilité** - Utilisée pour Voice Wake et les opérations système
- **Permission de microphone** - Nécessaire pour Voice Wake et Talk Mode
- **Permission d'enregistrement d'écran** - Fonctionnalités Canvas et d'enregistrement d'écran
- **Permission de reconnaissance vocale** - Entrée vocale pour Voice Wake
- **Permission d'automatisation** - Contrôle AppleScript (si nécessaire)

Toutes ces permissions sont utilisées **entièrement localement** et ne sont pas envoyées à aucun serveur.
:::

---

### Étape 2 : Configurer le mode de connexion (local vs distant)

**Pourquoi**
Choisissez le mode local ou distant selon vos besoins de déploiement.

#### Mode A : Mode local (par défaut)

Scénario d'utilisation : Le Gateway et l'application macOS fonctionnent sur la même machine.

**Étapes de configuration** :

1. Assurez-vous que le mode **Local** est affiché dans l'application de la barre de menus
2. Si le Gateway n'est pas en cours d'exécution, l'application démarrera automatiquement le service launchd `com.clawdbot.gateway`
3. L'application se connectera à `ws://127.0.0.1:18789`

**Ce que vous devriez voir** :
- L'icône de la barre de menus affiche le vert (état connecté)
- La carte d'état du Gateway affiche "Local"
- Le service nœud **non démarré** (le mode nœud n'est nécessaire qu'en mode distant)

#### Mode B : Mode distant

Scénario d'utilisation : Le Gateway fonctionne sur une autre machine (comme un serveur ou un VPS Linux) et vous souhaitez le contrôler via Mac.

**Étapes de configuration** :

1. Basculez vers le mode **Remote** dans l'application de la barre de menus
2. Entrez l'adresse WebSocket du Gateway distant (comme `ws://your-server:18789`)
3. Choisissez la méthode d'authentification (Token ou Password)
4. L'application établira automatiquement un tunnel SSH pour se connecter au Gateway distant

**Ce que vous devriez voir** :
- L'icône de la barre de menus affiche l'état de connexion (jaune/vert/rouge)
- La carte d'état du Gateway affiche l'adresse du serveur distant
- Le service nœud **automatiquement démarré** (pour que le Gateway distant puisse appeler les fonctionnalités locales)

**Mécanisme du tunnel en mode distant** :

```
Application macOS                 Gateway distant
    │                                  │
    ├── Tunnel SSH ───────────────────► ws://remote:18789
    │                                  │
    └── Service nœud ◄──────────────────── node.invoke
```

::: tip Avantages du mode distant
- **Gestion centralisée** : Exécutez le Gateway sur une machine puissante, plusieurs clients y accèdent
- **Optimisation des ressources** : Le Mac peut rester léger, le Gateway fonctionne sur un serveur haute performance
- **Localisation de l'appareil** : Les fonctionnalités comme Canvas, Camera s'exécutent toujours localement sur le Mac
:::

---

### Étape 3 : Utiliser le plan de contrôle de la barre de menus

**Pourquoi**
L'application de la barre de menus fournit une interface pour accéder rapidement à toutes les fonctionnalités principales.

**Éléments de menu principaux** :

Après avoir cliqué sur l'icône de la barre de menus, vous verrez :

1. **Carte d'état**
   - État de connexion Gateway (connecté/déconnecté/connexion en cours)
   - Mode actuel (Local/Remote)
   - Liste des canaux en cours d'exécution (WhatsApp, Telegram, etc.)

2. **Actions rapides**
   - **Agent** - Ouvrir la fenêtre de dialogue IA (appelle le Gateway)
   - **WebChat** - Ouvrir l'interface WebChat intégrée
   - **Canvas** - Ouvrir la fenêtre de visualisation Canvas
   - **Settings** - Ouvrir l'interface de configuration

3. **Bascules de fonctionnalités**
   - **Talk** - Activer/désactiver Talk Mode
   - **Voice Wake** - Activer/désactiver Voice Wake

4. **Menu d'informations**
   - **Usage** - Voir les statistiques d'utilisation et les coûts
   - **Sessions** - Gérer la liste des sessions
   - **Channels** - Voir l'état des canaux
   - **Skills** - Gérer les compétences

**Ce que vous devriez voir** :
- Des indicateurs d'état mis à jour en temps réel (vert = normal, rouge = déconnecté)
- Les détails de la connexion s'affichent au survol de la souris
- Cliquer sur n'importe quel élément de menu ouvre rapidement la fonctionnalité correspondante

---

### Étape 4 : Configurer et utiliser Voice Wake

**Pourquoi**
Voice Wake vous permet de déclencher l'assistant IA par un mot de réveil vocal, sans cliquer ni taper.

**Fonctionnement de Voice Wake** :

```
┌──────────────────────────────────┐
│   Runtime Voice Wake          │
│                              │
│   Écoute micro ──► Détection mot  │
│                     de réveil      │
│                              │
│   Mot de réveil correspond ?      │
│       │                       │
│       ├─ Oui ──► Déclencher Agent│
│       │                       │
│       └─ Non ──► Continuer  │
│                    écouter        │
└──────────────────────────────────┘
```

**Configuration de Voice Wake** :

1. Ouvrez **Settings** → **Voice Wake**
2. Entrez le mot de réveil (par défaut : `clawd`, `claude`, `computer`)
3. Vous pouvez ajouter plusieurs mots de réveil (séparés par des virgules)
4. Activez le commutateur **Enable Voice Wake**

**Règles des mots de réveil** :
- Les mots de réveil sont stockés dans le Gateway : `~/.clawdbot/settings/voicewake.json`
- Tous les nœuds partagent la **même liste globale de mots de réveil**
- Les modifications sont diffusées à tous les appareils connectés (macOS, iOS, Android)

**Flux d'utilisation** :

1. Assurez-vous que la permission du microphone a été accordée
2. Activez Voice Wake dans la barre de menus
3. Prononcez le mot de réveil vers le microphone (comme "Hey clawd")
4. Attendez d'entendre le son "ding" (indiquant que le réveil a réussi)
5. Prononcez votre commande ou votre question

**Ce que vous devriez voir** :
- Une superposition Voice Wake apparaît au centre de l'écran
- Affiche la forme d'onde du volume du microphone
- Affiche le texte d'état "Listening"
- L'IA commence à traiter votre entrée vocale

::: tip Caractéristique globale de Voice Wake
Les mots de réveil sont une **configuration globale au niveau du Gateway**, pas limités à un seul appareil. Cela signifie que :
- Après avoir modifié les mots de réveil sur macOS, les appareils iOS et Android se synchroniseront également
- Tous les appareils utilisent le même ensemble de mots de réveil
- Mais chaque appareil peut activer/désactiver Voice Wake individuellement (basé sur les permissions et les préférences de l'utilisateur)
:::

---

### Étape 5 : Utiliser Talk Mode pour le dialogue continu

**Pourquoi**
Talk Mode offre une expérience de dialogue vocal continu comme Siri/Alexa, sans avoir à se réveiller à chaque fois.

**Boucle de fonctionnement de Talk Mode** :

```
Écoute ──► Traitement IA ──► Lecture TTS ──► Écoute
   │                                              │
   └────────────────────────────────────────┘
```

**Activation de Talk Mode** :

1. Cliquez sur le bouton **Talk** dans la barre de menus
2. Ou utilisez le raccourci clavier (par défaut : aucun, peut être configuré dans Settings)
3. La superposition Talk Mode apparaît

**États de l'interface Talk Mode** :

| État | Affichage | Description |
| ----- | ---- | ---- |
| **Listening** | Animation pulsante nuage + volume micro | Attend que vous parliez |
| **Thinking** | Animation d'enfoncement | L'IA réfléchit |
| **Speaking** | Animation d'anneau radial + ondulations | L'IA répond (lecture TTS en cours) |

**Contrôle d'interaction** :

- **Arrêter de parler** : Cliquez sur l'icône nuage pour arrêter la lecture TTS
- **Quitter Talk Mode** : Cliquez sur le bouton X en haut à droite
- **Interruption vocale** : Si vous commencez à parler pendant que l'IA parle, la lecture s'arrête automatiquement

**Configuration TTS** :

Talk Mode utilise ElevenLabs pour la synthèse vocale. Emplacement de configuration : `~/.clawdbot/clawdbot.json`

```yaml
talk:
  voiceId: "elevenlabs_voice_id"  # ID de voix ElevenLabs
  modelId: "eleven_v3"            # Version du modèle
  apiKey: "elevenlabs_api_key"     # Clé API (ou utiliser une variable d'environnement)
  interruptOnSpeech: true           # Interruption lors de la parole
  outputFormat: "mp3_44100_128"   # Format de sortie
```

::: tip Configuration ElevenLabs
Si aucune clé API n'est configurée, Talk Mode essaiera d'utiliser :
1. La variable d'environnement `ELEVENLABS_API_KEY`
2. La clé dans le profil shell du Gateway
3. La première voix ElevenLabs disponible comme défaut
:::

---

### Étape 6 : Utiliser le mode nœud

**Pourquoi**
Le mode nœud permet à l'application macOS d'exposer des capacités locales à un Gateway distant, réalisant une véritable collaboration inter-appareils.

**Commandes disponibles en mode nœud** :

| Catégorie de commande | Exemple de commande | Description |
| --------- | ---------- | -------- |
| **Canvas** | `canvas.present`, `canvas.navigate`, `canvas.eval` | Rendre une interface visuelle sur macOS |
| **Camera** | `camera.snap`, `camera.clip` | Prendre une photo ou une vidéo |
| **Screen** | `screen.record` | Enregistrer l'écran |
| **System** | `system.run`, `system.notify` | Exécuter des commandes Shell ou envoyer des notifications |

**Activation du mode nœud** :

Le mode nœud démarre **automatiquement en mode distant**, car le Gateway distant doit appeler les fonctionnalités locales.

Vous pouvez également démarrer manuellement le service nœud :

```bash
clawdbot node run --display-name "My Mac"
```

**Gestion des permissions du nœud** :

L'application macOS signale quelles fonctionnalités sont disponibles via un système de permissions :

```json
{
  "canvas": true,
  "camera": true,
  "screen": true,
  "system": {
    "run": true,
    "notify": true
  }
}
```

L'IA choisira automatiquement les outils disponibles en fonction des permissions.

---

### Étape 7 : Configurer Exec Approvals (contrôle de sécurité `system.run`)

**Pourquoi**
`system.run` peut exécuter des commandes Shell arbitraires, donc un mécanisme d'approbation est nécessaire pour prévenir les erreurs ou les abus.

**Modèle de sécurité en trois couches d'Exec Approvals** :

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",          // Stratégie par défaut : refuser
    "ask": "on-miss"           // Demander si la commande n'est pas dans la liste blanche
  },
  "agents": {
    "main": {
      "security": "allowlist",    // Session principale : autoriser uniquement la liste blanche
      "ask": "on-miss",
      "allowlist": [
        { "pattern": "/usr/bin/git" },
        { "pattern": "/opt/homebrew/*/rg" }
      ]
    }
  }
}
```

**Types de stratégies de sécurité** :

| Stratégie | Comportement | Scénario d'utilisation |
| ----- | ---- | -------- |
| `deny` | Refuser tous les appels `system.run` | Haute sécurité, désactiver toutes les commandes |
| `allowlist` | Autoriser uniquement les commandes de la liste blanche | Équilibre entre sécurité et commodité |
| `ask` | Demander l'approbation de l'utilisateur si pas dans la liste blanche | Flexible mais nécessite confirmation |

**Flux d'approbation** :

Lorsque l'IA tente d'exécuter une commande non autorisée :

1. L'application macOS affiche une boîte de dialogue d'approbation
2. Affiche le chemin complet de la commande et les paramètres
3. Propose trois options :
   - **Allow Once** - Autoriser uniquement cette fois
   - **Always Allow** - Ajouter à la liste blanche
   - **Deny** - Refuser l'exécution

**Ce que vous devriez voir** :
- La boîte de dialogue d'approbation affiche les détails de la commande (comme `/usr/bin/ls -la ~`)
- Après avoir choisi "Always Allow", il ne vous sera plus demandé à l'avenir
- Après avoir choisi "Deny", l'exécution de la commande échoue et renvoie une erreur à l'IA

**Emplacement de configuration** :

Exec Approvals est stocké localement sur macOS :
- Fichier : `~/.clawdbot/exec-approvals.json`
- Historique des approbations : Voir toutes les commandes approuvées/refusées dans l'application

---

### Étape 8 : Utiliser les liens profonds

**Pourquoi**
Les liens profonds offrent la capacité de déclencher rapidement les fonctionnalités de Clawdbot à partir d'autres applications.

**Protocole de lien profond pris en charge** : `clawdbot://`

#### `clawdbot://agent`

Déclenche une requête `agent` Gateway, équivalent à exécuter `clawdbot agent` dans le terminal.

**Paramètres** :

| Paramètre | Description | Exemple |
| ----- | ---- | ---- |
| `message` (requis) | Message à envoyer à l'IA | `message=Hello%20from%20deep%20link` |
| `sessionKey` (optionnel) | Clé de session cible, par défaut `main` | `sessionKey=main` |
| `thinking` (optionnel) | Niveau de réflexion : off\|minimal\|low\|medium\|high\|xhigh | `thinking=high` |
| `deliver`/`to`/`channel` (optionnel) | Canal de livraison | `channel=telegram` |
| `timeoutSeconds` (optionnel) | Délai d'attente | `timeoutSeconds=30` |
| `key` (optionnel) | Clé de confirmation, pour l'automatisation | `key=your-secret-key` |

**Exemples** :

```bash
# Basique : envoyer un message
open 'clawdbot://agent?message=Hello%20from%20deep%20link'

# Avancé : envoyer à Telegram, niveau de réflexion élevé, délai 30 secondes
open 'clawdbot://agent?message=Summarize%20my%20day&to=telegram&thinking=high&timeoutSeconds=30'

# Automatisation : utiliser une clé pour sauter la confirmation (utilisation sûre uniquement dans vos scripts)
open 'clawdbot://agent?message=Automated%20task&key=secure-random-string'
```

**Ce que vous devriez voir** :
- L'application Clawdbot pour macOS s'ouvre automatiquement (si elle n'est pas en cours d'exécution)
- La fenêtre Agent apparaît et affiche le message
- L'IA commence à traiter et renvoie la réponse

::: warning Sécurité des liens profonds
- Sans le paramètre `key`, l'application affichera une boîte de dialogue de confirmation
- Avec une `key` valide, la demande s'exécute silencieusement (pour les scripts d'automatisation)
- N'utilisez jamais de liens profonds provenant de sources non fiables
:::

---

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vérifiez les éléments suivants :

### Installation et connexion

- [ ] L'application macOS est installée avec succès et apparaît dans le dossier Applications
- [ ] Toutes les permissions requises ont été accordées au premier démarrage
- [ ] L'icône de la barre de menus s'affiche normalement
- [ ] Vous pouvez vous connecter au Gateway en mode local (Local)
- [ ] Vous pouvez vous connecter au Gateway en mode distant (Remote)

### Voice Wake et Talk Mode

- [ ] La configuration des mots de réveil Voice Wake a réussi (comme "clawd", "claude")
- [ ] Prononcer le mot de réveil déclenche l'assistant IA
- [ ] La superposition Talk Mode peut s'ouvrir et se fermer normalement
- [ ] La lecture TTS est claire (nécessite une clé API ElevenLabs)
- [ ] La fonction d'interruption vocale fonctionne normalement (arrêter la lecture lors de la parole)

### Mode nœud et Exec Approvals

- [ ] Le service nœud démarre automatiquement en mode distant
- [ ] Les commandes `system.run` s'exécutent et renvoient des résultats
- [ ] La boîte de dialogue Exec Approvals s'affiche normalement
- [ ] "Always Allow" ajoute correctement à la liste blanche
- [ ] "Deny" refuse correctement l'exécution de la commande

### Fonctionnalités avancées

- [ ] Les liens profonds peuvent être déclenchés à partir du terminal ou d'autres applications
- [ ] L'interface des paramètres enregistre correctement la configuration
- [ ] La fenêtre WebChat intégrée s'ouvre normalement
- [ ] La fenêtre Canvas affiche le contenu visuel généré par l'IA

---

## Conseils d'évitement des pièges

### ❌ Permission refusée ou non accordée

**Problème** :
- Voice Wake ne peut pas écouter le microphone
- Canvas ne peut pas afficher de contenu
- L'exécution des commandes `system.run` échoue

**Solution** :
1. Ouvrez **Paramètres système** → **Confidentialité et sécurité**
2. Trouvez **Clawdbot** ou **Clawdbot.app**
3. Assurez-vous que les permissions **Microphone**, **Accessibilité**, **Enregistrement d'écran**, **Automatisation** sont toutes activées
4. Redémarrez l'application Clawdbot

::: tip Dépannage des permissions TCC
Si le commutateur de permission ne peut pas être activé ou se ferme immédiatement :
- Vérifiez si des outils de sécurité sont activés (comme Little Snitch)
- Essayez de désinstaller complètement l'application puis de la réinstaller
- Consultez les journaux de refus TCC dans Console.app
:::

### ❌ Échec de connexion Gateway

**Problème** :
- L'icône de la barre de menus affiche le rouge (état déconnecté)
- La carte d'état affiche "Connection Failed"
- WebChat ne peut pas être ouvert

**Causes possibles et solutions** :

| Cause | Méthode de vérification | Solution |
| ----- | -------- | -------- |
| Gateway non démarré | Exécuter `clawdbot gateway status` | Démarrer le service Gateway |
| Adresse incorrecte | Vérifier l'URL WebSocket | Confirmer que `ws://127.0.0.1:18789` ou l'adresse distante est correcte |
| Port occupé | Exécuter `lsof -i :18789` | Fermer le processus occupant le port |
| Échec d'authentification | Vérifier Token/Password | Confirmer que les informations d'identification sont correctes |

### ❌ Talk Mode inutilisable

**Problème** :
- Aucune réaction après avoir activé Talk Mode
- La lecture TTS ne fonctionne pas
- Le microphone ne peut pas entrer

**Solution** :

1. **Vérifier la configuration ElevenLabs** :
   - Confirmez que la clé API est définie
   - Testez si la clé est valide : visitez la console ElevenLabs

2. **Vérifier la connexion réseau** :
   - La lecture TTS nécessite une connexion Internet
   - Vérifiez si le pare-feu bloque les requêtes API

3. **Vérifier la sortie audio** :
   - Confirmez que le volume système est activé
   - Vérifiez si le périphérique de sortie par défaut est correct

### ❌ Le nœud ne peut pas se connecter en mode distant

**Problème** :
- Le Gateway distant ne peut pas appeler les commandes comme `system.run` sur macOS
- Les journaux d'erreurs affichent "Node not found" ou "Node offline"

**Solution** :

1. **Confirmer que le service nœud est en cours d'exécution** :
   ```bash
   clawdbot nodes list
   # Devrait voir le nœud macOS affiché comme "paired"
   ```

2. **Vérifier le tunnel SSH** :
   - Consultez l'état de connexion SSH dans les paramètres de l'application macOS
   - Confirmez que vous pouvez vous connecter manuellement par SSH au Gateway distant

3. **Redémarrer le service nœud** :
   ```bash
   # Sur macOS
   clawdbot node restart
   ```

---

## Résumé de cette leçon

Dans cette leçon, vous avez appris :

1. ✅ **Architecture de l'application macOS** - Double rôle en tant que plan de contrôle Gateway et nœud
2. ✅ **Modes local vs distant** - Comment configurer pour différents scénarios de déploiement
3. ✅ **Fonctionnalités de la barre de menus** - Gestion de l'état, WebChat, Canvas, paramètres, accès rapide
4. ✅ **Voice Wake** - Déclencher l'assistant IA par mot de réveil
5. ✅ **Talk Mode** - Expérience de dialogue vocal continu
6. ✅ **Mode nœud** - Exposer les capacités spécifiques à macOS (`system.run`, Canvas, Camera)
7. ✅ **Exec Approvals** - Mécanisme de sécurité en trois couches pour `system.run`
8. ✅ **Liens profonds** - Protocole `clawdbot://` pour un déclenchement rapide

**Meilleures pratiques** :
- 🚀 Déploiement local : Utilisez le mode Local par défaut
- 🌐 Déploiement distant : Configurez SSH/Tailscale pour une gestion centralisée
- 🔐 Sécurité d'abord : Configurez une stratégie de liste blanche raisonnable pour `system.run`
- 🎙️ Interaction vocale : Utilisez ElevenLabs pour une expérience TTS optimale

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons le **[Nœud iOS](../ios-node/)**.
>
> Vous apprendrez :
> - Comment configurer un nœud iOS pour se connecter au Gateway
> - Les fonctionnalités du nœud iOS (Canvas, Camera, Location, Voice Wake)
> - Comment appairer les appareils iOS via le Gateway
> - La gestion des permissions et le contrôle de sécurité du nœud iOS
> - Découverte Bonjour et connexion distante Tailscale

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier                                                                                    | Ligne    |
| ----------- | --------------------------------------------------------------------------------------- | ------- |
| Point d'entrée de l'application | [`apps/macos/Sources/Clawdbot/ClawdbotApp.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/ClawdbotApp.swift) | Tout le fichier   |
| Connexion Gateway | [`apps/macos/Sources/Clawdbot/GatewayConnection.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/GatewayConnection.swift) | 1-500   |
| Runtime Voice Wake | [`apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift) | Tout le fichier   |
| Types Talk Mode | [`apps/macos/Sources/Clawdbot/TalkModeTypes.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/TalkModeTypes.swift) | Tout le fichier   |
| Superposition Voice Wake | [`apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift) | Tout le fichier   |
| Coordinateur du mode nœud | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift) | Tout le fichier   |
| Runtime du nœud | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift) | Tout le fichier   |
| Gestionnaire de permissions | [`apps/macos/Sources/Clawdbot/PermissionManager.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/PermissionManager.swift) | Tout le fichier   |
| Exec Approvals | [`apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift) | Tout le fichier   |
| Barre de menus | [`apps/macos/Sources/Clawdbot/MenuBar.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/MenuBar.swift) | Tout le fichier   |
| Injecteur de menu | [`apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift) | Tout le fichier   |

**Constantes clés** :
- `GatewayConnection.shared` : Gestionnaire de connexion Gateway singleton (`GatewayConnection.swift:48`)
- `VoiceWakeRuntime` : Runtime principal Voice Wake (singleton)
- `MacNodeModeCoordinator` : Coordinateur du mode nœud, gère le démarrage du service local

**Types clés** :
- `GatewayAgentChannel` : Énumération des canaux agent Gateway (`GatewayConnection.swift:9-30`)
- `GatewayAgentInvocation` : Structure d'invocation d'agent Gateway (`GatewayConnection.swift:32-41`)
- `ExecApprovalsConfig` : Structure de configuration Exec Approvals (Schéma JSON)
- `VoiceWakeSettings` : Structure de configuration Voice Wake

**Fonctions clés** :
- `GatewayConnection.sendAgent()` : Envoyer une requête agent au Gateway
- `GatewayConnection.setVoiceWakeTriggers()` : Mettre à jour la liste globale des mots de réveil
- `PermissionManager.checkPermission()` : Vérifier l'état des permissions TCC
- `ExecApprovalsGatewayPrompter.prompt()` : Afficher la boîte de dialogue d'approbation

**Emplacement de la documentation** :
- [Documentation de l'application macOS](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/macos.md)
- [Documentation Voice Wake](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/voicewake.md)
- [Documentation Talk Mode](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/talk.md)
- [Documentation des nœuds](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/index.md)

</details>
