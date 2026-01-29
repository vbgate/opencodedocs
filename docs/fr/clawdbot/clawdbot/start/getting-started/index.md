---
title: "Démarrage Rapide : Installer et Lancer Clawdbot | Tutoriel"
sidebarTitle: "Opérationnel en 5 Minutes"
subtitle: "Démarrage Rapide : Installer, Configurer et Lancer Clawdbot"
description: "Apprenez à installer Clawdbot, configurer le modèle IA, démarrer le Gateway et envoyer votre premier message via WhatsApp/Telegram/Slack et autres canaux."
tags:
  - "Démarrage"
  - "Installation"
  - "Configuration"
  - "Gateway"
prerequisite: []
order: 10
---

# Démarrage Rapide : Installer, Configurer et Lancer Clawdbot

## Ce que vous apprendrez

Après avoir suivi ce tutoriel, vous serez capable de :

- ✅ Installer Clawdbot sur votre appareil
- ✅ Configurer l'authentification du modèle IA (Anthropic / OpenAI / autres fournisseurs)
- ✅ Démarrer le démon Gateway
- ✅ Envoyer votre premier message via WebChat ou les canaux configurés

## Votre situation actuelle

Vous vous demandez peut-être :

- "Un assistant IA local semble compliqué, par où commencer ?"
- "J'ai plusieurs appareils (téléphone, ordinateur), comment les gérer de manière unifiée ?"
- "J'utilise WhatsApp/Telegram/Slack quotidiennement, puis-je converser avec l'IA via ces plateformes ?"

La bonne nouvelle est que **Clawdbot a été conçu précisément pour résoudre ces problèmes**.

## Quand utiliser cette approche

Lorsque vous devez :

- 🚀 **Configurer pour la première fois** votre assistant IA personnel
- 🔧 **Configurer plusieurs canaux** (WhatsApp, Telegram, Slack, Discord, etc.)
- 🤖 **Connecter un modèle IA** (Anthropic Claude, OpenAI GPT, etc.)
- 📱 **Coordonner vos appareils** (nœuds macOS, iOS, Android)

::: tip Pourquoi recommander le mode Gateway ?
Le Gateway est le plan de contrôle de Clawdbot, il permet de :
- Gérer de manière unifiée toutes les sessions, canaux, outils et événements
- Prendre en charge les connexions clients simultanées multiples
- Permettre aux nœuds d'appareils d'exécuter des opérations locales
:::

## 🎒 Avant de commencer

### Configuration requise

| Composant | Prérequis |
|--- | ---|
| **Node.js** | ≥ 22.12.0 |
| **Système d'exploitation** | macOS / Linux / Windows (WSL2) |
| **Gestionnaire de paquets** | npm / pnpm / bun |

::: warning Attention utilisateurs Windows
Il est fortement recommandé d'utiliser **WSL2** sur Windows car :
- De nombreux canaux dépendent de binaires locaux
- Les démons (launchd/systemd) ne sont pas disponibles sur Windows
:::

### Modèles IA recommandés

Bien que tous les modèles soient pris en charge, nous recommandons fortement :

| Fournisseur | Modèle recommandé | Raison |
|--- | --- | ---|
| Anthropic | Claude Opus 4.5 | Avantage de contexte long, meilleure résistance aux injections de prompts |
| OpenAI | GPT-5.2 + Codex | Capacités de programmation, support multimodal |

---

## Concept fondamental

L'architecture de Clawdbot est simple : **un Gateway, plusieurs canaux, un assistant IA**.

```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat
                │
                ▼
        ┌──────────────────┐
        │   Gateway       │  ← Plan de contrôle (démon)
        │   127.0.0.1:18789 │
        └────────┬─────────┘
                 │
                 ├─→ AI Agent (pi-mono RPC)
                 ├─→ CLI (clawdbot ...)
                 ├─→ WebChat UI
                 └─→ Nœuds macOS / iOS / Android
```

**Concepts clés** :

| Concept | Rôle |
|--- | ---|
| **Gateway** | Démon responsable de la gestion des sessions, connexions aux canaux, invocation des outils |
| **Channel** | Canaux de messagerie (WhatsApp, Telegram, Slack, etc.) |
| **Agent** | Runtime IA (mode RPC basé sur pi-mono) |
| **Node** | Nœuds d'appareils (macOS/iOS/Android), exécutent les opérations locales |

---

## Suivez-moi

### Étape 1 : Installer Clawdbot

**Pourquoi**
Après l'installation globale, la commande `clawdbot` est disponible partout.

#### Méthode A : Utiliser npm (recommandé)

```bash
npm install -g clawdbot@latest
```

#### Méthode B : Utiliser pnpm

```bash
pnpm add -g clawdbot@latest
```

#### Méthode C : Utiliser bun

```bash
bun install -g clawdbot@latest
```

**Vous devriez voir** :
```
added 1 package, and audited 1 package in 3s
```

::: tip Option développeur
Si vous prévoyez de développer à partir des sources ou de contribuer, consultez [Annexe : Construire depuis les sources](#construire-depuis-les-sources).
:::

---

### Étape 2 : Exécuter l'assistant d'onboarding

**Pourquoi**
L'assistant vous guidera à travers toutes les configurations nécessaires : Gateway, canaux, compétences.

#### Démarrer l'assistant (recommandé)

```bash
clawdbot onboard --install-daemon
```

**Ce que l'assistant vous demandera** :

| Étape | Question | Description |
|--- | --- | ---|
| 1 | Choisir la méthode d'authentification du modèle IA | OAuth / API Key |
| 2 | Configurer le Gateway (port, authentification) | Par défaut : 127.0.0.1:18789 |
| 3 | Configurer les canaux (WhatsApp, Telegram, etc.) | Peut être ignoré, configuration ultérieure possible |
| 4 | Configurer les compétences (optionnel) | Peut être ignoré |

**Vous devriez voir** :
```
✓ Gateway configured
✓ Workspace initialized: ~/clawd
✓ Channels configured
✓ Skills installed

To start the gateway, run:
  clawdbot gateway
```

::: info Qu'est-ce qu'un Daemon ?
`--install-daemon` installe le démon Gateway :
- **macOS** : Service launchd (niveau utilisateur)
- **Linux** : Service utilisateur systemd

Ainsi, le Gateway s'exécute automatiquement en arrière-plan sans démarrage manuel.
:::

---

### Étape 3 : Démarrer le Gateway

**Pourquoi**
Le Gateway est le plan de contrôle de Clawdbot, il doit être démarré en premier.

#### Démarrage en avant-plan (pour débogage)

```bash
clawdbot gateway --port 18789 --verbose
```

**Vous devriez voir** :
```
[clawdbot] Gateway started
[clawdbot] Listening on ws://127.0.0.1:18789
[clawdbot] Ready to accept connections
```

#### Démarrage en arrière-plan (recommandé)

Si vous avez utilisé `--install-daemon` lors de l'assistant, le Gateway démarre automatiquement.

Vérifiez le statut :

```bash
clawdbot gateway status
```

**Vous devriez voir** :
```
Gateway is running
PID: 12345
Port: 18789
```

::: tip Options courantes
- `--port 18789` : Spécifiez le port Gateway (18789 par défaut)
- `--verbose` : Activez les journaux détaillés (utile pour le débogage)
- `--reset` : Redémarrez le Gateway (efface les sessions)
:::

---

### Étape 4 : Envoyer votre premier message

**Pourquoi**
Vérifiez que l'installation a réussi et découvrez la réponse de l'assistant IA.

#### Méthode A : Dialogue direct via CLI

```bash
clawdbot agent --message "Ship checklist" --thinking high
```

**Vous devriez voir** :
```
[clawdbot] Agent is thinking...
[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

#### Méthode B : Envoyer un message via un canal

Si vous avez configuré des canaux lors de l'assistant (comme WhatsApp, Telegram), vous pouvez envoyer des messages directement à votre assistant IA via l'application correspondante.

**Exemple WhatsApp** :

1. Ouvrez WhatsApp
2. Recherchez votre numéro Clawdbot
3. Envoyez le message : `Hello, I'm testing Clawdbot!`

**Vous devriez voir** :
- L'assistant IA répond à votre message

::: info Protection par jumelage DM
Par défaut, Clawdbot active la **protection par jumelage DM** :
- Les expéditeurs inconnus reçoivent un code de jumelage
- Les messages ne sont pas traités tant que vous n'avez pas approuvé le jumelage

Plus de détails : [Jumelage DM et contrôle d'accès](../pairing-approval/)
:::

---

## Point de contrôle ✅

Après avoir suivi les étapes ci-dessus, vous devriez pouvoir :

- [ ] Exécuter `clawdbot --version` et voir le numéro de version
- [ ] Exécuter `clawdbot gateway status` et voir que le Gateway est en cours d'exécution
- [ ] Envoyer un message via CLI et recevoir une réponse IA
- [ ] (Optionnel) Envoyer un message via les canaux configurés et recevoir une réponse IA

::: tip Problèmes fréquents
**Q : Le Gateway ne démarre pas ?**
R : Vérifiez si le port est occupé :
```bash
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows
```

**Q : L'IA ne répond pas ?**
R : Vérifiez si la clé API est correctement configurée :
```bash
clawdbot models list
```

**Q : Comment voir les journaux détaillés ?**
R : Ajoutez `--verbose` au démarrage :
```bash
clawdbot gateway --verbose
```
:::

---

## Pièges à éviter

### ❌ Oublier d'installer le Daemon

**Mauvaise pratique** :
```bash
clawdbot onboard  # Oublié --install-daemon
```

**Bonne pratique** :
```bash
clawdbot onboard --install-daemon
```

::: warning Avant-plan vs Arrière-plan
- Avant-plan : Adapté au débogage, le Gateway s'arrête à la fermeture du terminal
- Arrière-plan : Adapté à l'environnement de production, redémarrage automatique
:::

### ❌ Version de Node.js trop ancienne

**Mauvaise pratique** :
```bash
node --version
# v20.x.x  # Trop ancien
```

**Bonne pratique** :
```bash
node --version
# v22.12.0 ou supérieur
```

### ❌ Erreur de chemin de fichier de configuration

Emplacement par défaut du fichier de configuration de Clawdbot :

| Système d'exploitation | Chemin de configuration |
|--- | ---|
| macOS/Linux | `~/.clawdbot/clawdbot.json` |
| Windows (WSL2) | `~/.clawdbot/clawdbot.json` |

Si vous modifiez manuellement le fichier de configuration, assurez-vous que le chemin est correct.

---

## Résumé du cours

Dans ce cours, vous avez appris à :

1. ✅ **Installer Clawdbot** : Installation globale via npm/pnpm/bun
2. ✅ **Exécuter l'assistant** : `clawdbot onboard --install-daemon` pour terminer la configuration
3. ✅ **Démarrer le Gateway** : `clawdbot gateway` ou démarrage automatique par le démon
4. ✅ **Envoyer des messages** : Dialoguer avec l'IA via CLI ou les canaux configurés

**Prochaines étapes** :

- Apprenez la [Configuration guidée](../onboarding-wizard/) pour découvrir davantage d'options de l'assistant
- Découvrez le [Démarrage du Gateway](../gateway-startup/) pour apprendre les différents modes de démarrage (dev/production)
- Apprenez à [Envoyer votre premier message](../first-message/) pour explorer plus de formats de messages et d'interactions

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons la **[Configuration guidée](../onboarding-wizard/)**.
>
> Vous apprendrez :
> - Comment utiliser l'assistant interactif pour configurer le Gateway
> - Comment configurer plusieurs canaux (WhatsApp, Telegram, Slack, etc.)
> - Comment gérer les compétences et l'authentification du modèle IA

---

## Annexe : Construire depuis les sources

Si vous prévoyez de développer à partir des sources ou de contribuer, vous pouvez :

### 1. Cloner le dépôt

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Construire l'UI (première exécution)

```bash
pnpm ui:build  # Installe automatiquement les dépendances UI
```

### 4. Compiler TypeScript

```bash
pnpm build
```

### 5. Exécuter l'onboarding

```bash
pnpm clawdbot onboard --install-daemon
```

### 6. Cycle de développement (rechargement automatique)

```bash
pnpm gateway:watch  # Rechargement automatique lors des modifications des fichiers TS
```

::: info Mode développement vs Mode production
- `pnpm clawdbot ...` : Exécute directement TypeScript (mode développement)
- Après `pnpm build` : Génère le répertoire `dist/` (mode production)
:::

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Entrée CLI | [`src/cli/run-main.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/run-main.ts) | 26-60 |
| Commande Onboarding | [`src/cli/program/register.onboard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.onboard.ts) | 34-100 |
| Installation du Daemon | [`src/cli/daemon-cli/install.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/daemon-cli/install.ts) | 15-100 |
| Service Gateway | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | Fichier entier |
| Vérification runtime | [`src/infra/runtime-guard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/runtime-guard.ts) | Fichier entier |

**Constantes clés** :
- `DEFAULT_GATEWAY_DAEMON_RUNTIME = "node"` : Runtime du démon Gateway par défaut (provenant de `src/commands/daemon-runtime.ts`)
- `DEFAULT_GATEWAY_PORT = 18789` : Port Gateway par défaut (provenant de la configuration)

**Fonctions clés** :
- `runCli()` : Entrée principale CLI, gère l'analyse des arguments et le routage des commandes (`src/cli/run-main.ts`)
- `runDaemonInstall()` : Installe le démon Gateway (`src/cli/daemon-cli/install.ts`)
- `onboardCommand()` : Commande de l'assistant interactif (`src/commands/onboard.ts`)

</details>
