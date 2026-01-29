---
title: "Configuration Guidée : Configurer Clawdbot en Une Seule Fois | Tutoriel Clawdbot"
sidebarTitle: "Configuration en Un Clic"
subtitle: "Configuration Guidée : Configurer Clawdbot en Une Seule Fois"
description: "Apprenez à utiliser l'assistant interactif pour configurer complètement Clawdbot, y compris les paramètres réseau de la Gateway, l'authentification du modèle IA (supportant setup-token et API Key), les canaux de communication (WhatsApp, Telegram, Slack, etc.) et l'initialisation du système de compétences."
tags:
  - "Prise en main"
  - "Configuration"
  - "Assistant"
  - "Gateway"
prerequisite:
  - "getting-started"
order: 20
---

# Configuration Guidée : Configurer Clawdbot en Une Seule Fois

## Ce Que Vous Allez Apprendre

Grâce à ce tutoriel, vous serez capable de :

- ✅ Utiliser l'assistant interactif pour configurer complètement Clawdbot
- ✅ Comprendre la différence entre les modes QuickStart et Manual
- ✅ Configurer le réseau Gateway et les options d'authentification
- ✅ Configurer les fournisseurs de modèles IA (setup-token et API Key)
- ✅ Activer les canaux de communication (WhatsApp, Telegram, etc.)
- ✅ Installer et gérer les paquets de compétences

Une fois l'assistant terminé, la Gateway Clawdbot s'exécutera en arrière-plan et vous pourrez dialoguer avec l'assistant IA via les canaux configurés.

## Votre Situation Actuelle

L'édition manuelle des fichiers de configuration est fastidieuse :

- Vous ne connaissez pas la signification des paramètres ni leurs valeurs par défaut
- Vous risquez d'oublier des paramètres critiques empêchant le démarrage
- Les méthodes d'authentification des modèles IA sont variées (OAuth, API Key) et vous ne savez pas laquelle choisir
- La configuration des canaux est complexe, chaque plateforme ayant sa propre méthode d'authentification
- Vous ne savez pas quelles compétences installer dans le système

L'assistant de configuration résout ces problèmes en vous guidant à travers toute la configuration via des questions interactives et en proposant des valeurs par défaut raisonnables.

## Quand Utiliser Cette Méthode

- **Première installation** : Nouveaux utilisateurs utilisant Clawdbot pour la première fois
- **Reconfiguration** : Besoin de modifier les paramètres Gateway, changer de modèle IA ou ajouter de nouveaux canaux
- **Validation rapide** : Vous souhaitez tester rapidement les fonctionnalités de base sans approfondir la configuration
- **Dépannage** : Après une erreur de configuration, utilisez l'assistant pour réinitialiser

::: tip Astuce
L'assistant détecte la configuration existante et vous permet de la conserver, la modifier ou la réinitialiser.
:::

## Concepts Clés

### Deux Modes Disponibles

L'assistant propose deux modes de configuration :

**Mode QuickStart** (recommandé pour les débutants)
- Utilise des valeurs par défaut sécurisées : Gateway liée à loopback (127.0.0.1), port 18789, authentification par token
- Ignore la plupart des paramètres détaillés
- Adapté à une utilisation sur une seule machine, pour une prise en main rapide

**Mode Manual** (pour utilisateurs avancés)
- Configuration manuelle de toutes les options
- Supporte la liaison LAN, l'accès distant Tailscale, les méthodes d'authentification personnalisées
- Adapté aux déploiements multi-machines, à l'accès distant ou aux environnements réseau spéciaux

### Flux de Configuration

```
1. Confirmation de l'avertissement de sécurité
2. Choix du mode (QuickStart / Manual)
3. Configuration Gateway (port, liaison, authentification, Tailscale)
4. Authentification du modèle IA (setup-token / API Key)
5. Configuration de l'espace de travail (défaut ~/clawd)
6. Configuration des canaux (WhatsApp / Telegram / Slack, etc.)
7. Installation des compétences (optionnel)
8. Terminé (démarrage de la Gateway)
```

### Rappel de Sécurité

Au début de l'assistant, un avertissement de sécurité s'affiche. Vous devez confirmer les éléments suivants :

- Clawdbot est un projet amateur, encore en phase bêta
- Une fois les outils activés, l'IA peut lire des fichiers et exécuter des actions
- Des invites malveillantes peuvent inciter l'IA à effectuer des actions non sécurisées
- Il est recommandé d'utiliser l'appairage/liste blanche + outils à permissions minimales
- Effectuez régulièrement des audits de sécurité

::: danger Important
Si vous ne comprenez pas les mécanismes de base de sécurité et de contrôle d'accès, n'activez pas les outils et n'exposez pas la Gateway sur Internet. Il est recommandé de demander l'aide d'une personne expérimentée avant utilisation.
:::

---

## 🎒 Prérequis

Avant de lancer l'assistant, veuillez vérifier :

- **Clawdbot installé** : Consultez la section [Démarrage rapide](../getting-started/) pour l'installation
- **Version Node.js** : Assurez-vous que Node.js ≥ 22 (vérifiez avec `node -v`)
- **Compte modèle IA** (recommandé) :
  - Compte Anthropic Claude (abonnement Pro/Max), supportant le flux OAuth
  - Ou préparez une API Key d'un fournisseur comme OpenAI/DeepSeek
- **Compte de canal** (optionnel) : Si vous souhaitez utiliser WhatsApp, Telegram, etc., créez d'abord les comptes correspondants
- **Permissions réseau** : Si vous souhaitez utiliser Tailscale, assurez-vous que le client Tailscale est installé

---

## Étapes à Suivre

### Étape 1 : Lancer l'Assistant

Ouvrez un terminal et exécutez la commande suivante :

```bash
clawdbot onboard
```

**Pourquoi**
Lance l'assistant de configuration interactif pour vous guider à travers tous les paramètres nécessaires.

**Vous devriez voir** :
```
  ┌─────────────────────────────────────────────────────┐
  │                                                   │
  │   Clawdbot onboarding                              │
  │                                                   │
  └─────────────────────────────────────────────────────┘
```

### Étape 2 : Confirmer l'Avertissement de Sécurité

L'assistant affiche d'abord l'avertissement de sécurité (comme décrit dans la section "Concepts Clés" ci-dessus).

**Pourquoi**
Garantit que l'utilisateur comprend les risques potentiels et évite les problèmes de sécurité dus à une mauvaise utilisation.

**Action** :
- Lisez le contenu de l'avertissement de sécurité
- Saisissez `y` ou sélectionnez `Yes` pour confirmer que vous comprenez les risques
- Si vous n'acceptez pas les risques, l'assistant se terminera

**Vous devriez voir** :
```
Security warning — please read.

Clawdbot is a hobby project and still in beta. Expect sharp edges.
...

I understand this is powerful and inherently risky. Continue? (y/N)
```

### Étape 3 : Choisir le Mode de Configuration

::: code-group

```bash [Mode QuickStart]
Recommandé pour les débutants, utilise des valeurs par défaut sécurisées :
- Port Gateway : 18789
- Adresse de liaison : Loopback (127.0.0.1)
- Méthode d'authentification : Token (généré automatiquement)
- Tailscale : désactivé
```

```bash [Mode Manual]
Pour utilisateurs avancés, configuration manuelle de toutes les options :
- Port Gateway personnalisé et liaison
- Choix entre authentification Token ou Password
- Configuration de l'accès distant Tailscale Serve/Funnel
- Configuration détaillée de chaque étape
```

:::

**Pourquoi**
Le mode QuickStart permet aux débutants de démarrer rapidement, tandis que le mode Manual offre un contrôle précis aux utilisateurs avancés.

**Action** :
- Utilisez les flèches directionnelles pour sélectionner `QuickStart` ou `Manual`
- Appuyez sur Entrée pour confirmer

**Vous devriez voir** :
```
? Onboarding mode
  QuickStart         Configure details later via clawdbot configure.
  Manual            Configure port, network, Tailscale, and auth options.
```

### Étape 4 : Choisir le Mode de Déploiement (Mode Manual uniquement)

Si vous choisissez le mode Manual, l'assistant demandera où déployer la Gateway :

::: code-group

```bash [Gateway local (cette machine)]
La Gateway s'exécute sur la machine actuelle :
- Peut exécuter le flux OAuth et écrire les credentials locaux
- L'assistant complète toute la configuration
- Adapté au développement local ou au déploiement sur une seule machine
```

```bash [Gateway distant (infos uniquement)]
La Gateway s'exécute sur une autre machine :
- L'assistant configure uniquement l'URL distante et l'authentification
- N'exécute pas le flux OAuth, les credentials doivent être configurés manuellement sur l'hôte distant
- Adapté aux scénarios de déploiement multi-machines
```

:::

**Pourquoi**
Le mode Local supporte un flux de configuration complet, tandis que le mode Remote configure uniquement les informations d'accès.

**Action** :
- Sélectionnez le mode de déploiement
- En mode Remote, saisissez l'URL et le token de la Gateway distante

### Étape 5 : Configurer la Gateway (Mode Manual uniquement)

Si vous choisissez le mode Manual, l'assistant demandera les paramètres Gateway un par un :

#### Port Gateway

```bash
? Gateway port (18789)
```

**Explication** :
- Valeur par défaut 18789
- Si le port est occupé, saisissez un autre port
- Assurez-vous que le port n'est pas bloqué par le pare-feu

#### Adresse de Liaison Gateway

```bash
? Gateway bind
  Loopback (127.0.0.1)
  LAN (0.0.0.0)
  Tailnet (Tailscale IP)
  Auto (Loopback → LAN)
  Custom IP
```

**Description des options** :
- **Loopback** : Accès uniquement depuis cette machine, le plus sécurisé
- **LAN** : Les appareils du réseau local peuvent accéder
- **Tailnet** : Accès via le réseau virtuel Tailscale
- **Auto** : Essaie d'abord loopback, bascule vers LAN en cas d'échec
- **Custom IP** : Spécifiez manuellement l'adresse IP

::: tip Astuce
Il est recommandé d'utiliser Loopback ou Tailnet pour éviter une exposition directe au réseau local.
:::

#### Méthode d'Authentification Gateway

```bash
? Gateway auth
  Token              Option par défaut recommandée (local + distant)
  Password
```

**Description des options** :
- **Token** : Option recommandée, génère automatiquement un token aléatoire, supporte l'accès distant
- **Password** : Utilise un mot de passe personnalisé, obligatoire pour le mode Tailscale Funnel

#### Accès Distant Tailscale (Optionnel)

```bash
? Tailscale exposure
  Off               Pas d'exposition Tailscale
  Serve             HTTPS privé pour votre tailnet (appareils sur Tailscale)
  Funnel            HTTPS public via Tailscale Funnel (internet)
```

::: warning Avertissement Tailscale
- Mode Serve : Seuls les appareils du réseau Tailscale peuvent accéder
- Mode Funnel : Exposition via HTTPS public (nécessite une authentification par mot de passe)
- Assurez-vous que le client Tailscale est installé : https://tailscale.com/download/mac
:::

### Étape 6 : Configurer l'Espace de Travail

L'assistant demandera le répertoire de l'espace de travail :

```bash
? Workspace directory (~/clawd)
```

**Explication** :
- Valeur par défaut `~/clawd` (soit `/Users/votre_nom_utilisateur/clawd`)
- L'espace de travail stocke l'historique des sessions, la configuration des agents, les données des compétences, etc.
- Vous pouvez utiliser un chemin absolu ou relatif

::: info Support des Profils Multiples (Profile)
En définissant la variable d'environnement `CLAWDBOT_PROFILE`, vous pouvez utiliser des configurations indépendantes pour différents environnements de travail :

| Valeur Profile | Chemin Espace de Travail | Fichier de Configuration |
|----------|----------|----------|
| `default` ou non défini | `~/clawd` | `~/.clawdbot/clawdbot.json` |
| `work` | `~/clawd-work` | `~/.clawdbot/clawdbot.json` (profil work) |
| `dev` | `~/clawd-dev` | `~/.clawdbot/clawdbot.json` (profil dev) |

Exemple :
```bash
# Utiliser le profil work
export CLAWDBOT_PROFILE=work
clawdbot onboard
```
:::

**Vous devriez voir** :
```
Ensuring workspace directory: /Users/votre_nom_utilisateur/clawd
Creating sessions.json...
Creating agents directory...
```

### Étape 7 : Configurer l'Authentification du Modèle IA

L'assistant listera les fournisseurs de modèles IA supportés :

```bash
? Choose AI model provider
  Anthropic                    Claude Code CLI + API key
  OpenAI                       Codex OAuth + API key
  MiniMax                      M2.1 (recommandé)
  Qwen                         OAuth
  Venice AI                     Axé sur la confidentialité (modèles non censurés)
  Google                       Gemini API key + OAuth
  Copilot                      GitHub + proxy local
  Vercel AI Gateway            API key
  Moonshot AI                  Kimi K2 + Kimi Code
  Z.AI (GLM 4.7)            API key
  OpenCode Zen                 API key
  OpenRouter                   API key
  Custom API Endpoint
  Skip for now
```

Après avoir sélectionné un fournisseur, l'assistant affichera les méthodes d'authentification spécifiques selon le type de fournisseur. Voici les options d'authentification des principaux fournisseurs :

**Méthodes d'authentification Anthropic** :
- `claude-cli` : Utilise l'authentification OAuth existante de Claude Code CLI (nécessite l'accès au trousseau)
- `token` : Collez le setup-token généré via `claude setup-token`
- `apiKey` : Saisissez manuellement la clé API Anthropic

::: info Méthode Anthropic setup-token (recommandée)
Il est recommandé d'utiliser la méthode setup-token pour les raisons suivantes :
- Pas besoin de gérer manuellement la clé API
- Génère un token valide longtemps
- Adapté aux utilisateurs Pro/Max

Flux :
1. Exécutez d'abord dans un autre terminal : `claude setup-token`
2. Cette commande ouvre le navigateur pour l'autorisation OAuth
3. Copiez le setup-token généré
4. Dans l'assistant, sélectionnez `Anthropic` → `token`
5. Collez le setup-token dans l'assistant
6. Les credentials sont automatiquement sauvegardés dans le répertoire `~/.clawdbot/credentials/`
:::

::: info Méthode API Key
Si vous choisissez API Key :
- L'assistant demandera de saisir la clé API
- Les credentials sont sauvegardés dans le répertoire `~/.clawdbot/credentials/`
- Supporte plusieurs fournisseurs, changeable à tout moment

Exemple :
```bash
? Enter API Key
sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
:::

### Étape 8 : Sélectionner le Modèle par Défaut

Après une authentification réussie, l'assistant affichera la liste des modèles disponibles :

```bash
? Select default model
  anthropic/claude-sonnet-4-5      Anthropic Sonnet 4.5 (200k ctx)
  anthropic/claude-opus-4-5          Anthropic Opus 4.5 (200k ctx)
  openai/gpt-4-turbo                OpenAI GPT-4 Turbo
  deepseek/DeepSeek-V3                DeepSeek V3
  (Keep current selection)
```

**Recommandations** :
- Il est recommandé d'utiliser **Claude Sonnet 4.5** ou **Opus 4.5** (contexte 200k, sécurité renforcée)
- Si vous avez un budget limité, vous pouvez choisir la version Mini
- Cliquez sur `Keep current selection` pour conserver la configuration existante

### Étape 9 : Configurer les Canaux de Communication

L'assistant listera tous les plugins de canaux de communication disponibles :

```bash
? Select channels to enable
  ✓ whatsapp       WhatsApp (Baileys Web Client)
  ✓ telegram       Telegram (Bot Token)
  ✓ slack          Slack (Bot Token + App Token)
  ✓ discord        Discord (Bot Token)
  ✓ googlechat     Google Chat (OAuth)
  (Press Space to select, Enter to confirm)
```

**Action** :
- Utilisez les flèches directionnelles pour naviguer
- Appuyez sur **Espace** pour basculer la sélection
- Appuyez sur **Entrée** pour confirmer la sélection

::: tip Optimisation du Mode QuickStart
En mode QuickStart, l'assistant sélectionne automatiquement les canaux permettant un démarrage rapide (comme WebChat) et ignore la configuration de la stratégie DM en utilisant des valeurs par défaut sécurisées (mode pairing).
:::

Après avoir sélectionné les canaux, l'assistant demandera la configuration de chaque canal :

#### Configuration WhatsApp

```bash
? Configure WhatsApp
  Link new account     Ouvrir le QR code dans le navigateur
  Skip
```

**Action** :
- Sélectionnez `Link new account`
- L'assistant affichera un code QR
- Scannez le code QR avec WhatsApp pour vous connecter
- Une fois connecté, les données de session sont sauvegardées dans `~/.clawdbot/credentials/`

#### Configuration Telegram

```bash
? Configure Telegram
  Bot Token
  Skip
```

**Action** :
- Sélectionnez `Bot Token`
- Saisissez le Bot Token obtenu auprès de @BotFather
- L'assistant testera si la connexion réussit

::: tip Obtention du Bot Token
1. Recherchez @BotFather dans Telegram
2. Envoyez `/newbot` pour créer un nouveau bot
3. Suivez les instructions pour définir le nom et le nom d'utilisateur du bot
4. Copiez le Bot Token généré
:::

#### Configuration Slack

```bash
? Configure Slack
  App Token         xapp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Bot Token         xoxb-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Signing Secret   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Skip
```

**Explication** :
Slack nécessite trois credentials, obtenus depuis les paramètres de l'App Slack :
- **App Token** : Token au niveau du Workspace
- **Bot Token** : OAuth token de l'utilisateur bot
- **Signing Secret** : Utilisé pour vérifier la signature des requêtes

::: tip Création d'une App Slack
1. Visitez https://api.slack.com/apps
2. Créez une nouvelle App
3. Sur la page Basic Information, récupérez le Signing Secret
4. Sur la page OAuth & Permissions, installez l'App dans le Workspace
5. Obtenez le Bot Token et l'App Token
:::

### Étape 10 : Configurer les Compétences (Optionnel)

L'assistant demandera si vous souhaitez installer des compétences :

```bash
? Install skills? (Y/n)
```

**Recommandation** :
- Sélectionnez `Y` pour installer les compétences recommandées (comme le gestionnaire de paquets bird, le TTS local sherpa-onnx-tts)
- Sélectionnez `n` pour ignorer, vous pourrez gérer les compétences ultérieurement via la commande `clawdbot skills`

Si vous choisissez d'installer, l'assistant listera les compétences disponibles :

```bash
? Select skills to install
  ✓ bird           Installation de paquets macOS Homebrew
  ✓ sherpa-onnx-tts  Moteur TTS local (priorité à la confidentialité)
  (Press Space to select, Enter to confirm)
```

### Étape 11 : Terminer la Configuration

L'assistant résumera toute la configuration et l'écrira dans le fichier de configuration :

```bash
✓ Writing config to ~/.clawdbot/clawdbot.json
✓ Workspace initialized at ~/clawd
✓ Channels configured: whatsapp, telegram, slack
✓ Skills installed: bird, sherpa-onnx-tts

────────────────────────────────────────────────────

Configuration complete!

Next steps:
  1. Start Gateway:
     clawdbot gateway --daemon

  2. Test connection:
     clawdbot message send --to +1234567890 --message "Hello!"

  3. Manage configuration:
     clawdbot configure

Docs: https://docs.clawd.bot/start/onboarding
────────────────────────────────────────────────────
```

## Points de Vérification ✅

Après avoir terminé l'assistant, veuillez confirmer les éléments suivants :

- [ ] Le fichier de configuration a été créé : `~/.clawdbot/clawdbot.json`
- [ ] L'espace de travail est initialisé : le répertoire `~/clawd/` existe
- [ ] Les credentials du modèle IA sont sauvegardés : vérifiez `~/.clawdbot/credentials/`
- [ ] Les canaux sont configurés : consultez le nœud `channels` dans `clawdbot.json`
- [ ] Les compétences sont installées (si sélectionné) : consultez le nœud `skills` dans `clawdbot.json`

**Commandes de Vérification** :

```bash
## Voir le résumé de la configuration
```bash
clawdbot doctor
```

## Voir l'état de la Gateway
```bash
clawdbot gateway status
```

## Voir les canaux disponibles
```bash
clawdbot channels list
```
```

## Pièges à Éviter

### Erreur Courante 1 : Port Occupé

**Message d'erreur** :
```
Error: Port 18789 is already in use
```

**Solution** :
1. Recherchez le processus occupant : `lsof -i :18789` (macOS/Linux) ou `netstat -ano | findstr 18789` (Windows)
2. Arrêtez le processus en conflit ou utilisez un autre port

### Erreur Courante 2 : Échec du Flux OAuth

**Message d'erreur** :
```
Error: OAuth exchange failed
```

**Causes Possibles** :
- Problème de réseau empêchant l'accès aux serveurs Anthropic
- Code OAuth expiré ou format incorrect
- Navigateur bloqué empêchant l'ouverture

**Solution** :
1. Vérifiez la connexion réseau
2. Relancez `clawdbot onboard` pour réessayer OAuth
3. Ou utilisez la méthode API Key à la place

### Erreur Courante 3 : Échec de Configuration du Canal

**Message d'erreur** :
```
Error: WhatsApp authentication failed
```

**Causes Possibles** :
- Code QR expiré
- Compte limité par WhatsApp
- Dépendances non installées (comme signal-cli)

**Solution** :
1. WhatsApp : Rescannez le code QR
2. Signal : Assurez-vous que signal-cli est installé (voir la documentation spécifique au canal)
3. Bot Token : Confirmez que le format du token est correct et qu'il n'est pas expiré

### Erreur Courante 4 : Échec de Configuration Tailscale

**Message d'erreur** :
```
Error: Tailscale binary not found in PATH or /Applications.
```

**Solution** :
1. Installez Tailscale : https://tailscale.com/download/mac
2. Assurez-vous qu'il est ajouté au PATH ou installé dans `/Applications`
3. Ou ignorez la configuration Tailscale et configurez-la manuellement plus tard

### Erreur Courante 5 : Format de Fichier de Configuration Invalide

**Message d'erreur** :
```
Error: Invalid config at ~/.clawdbot/clawdbot.json
```

**Solution** :
```bash
# Réparer la configuration
clawdbot doctor

# Ou réinitialiser la configuration
clawdbot onboard --mode reset
```

---

## Résumé du Cours

L'assistant de configuration est la méthode recommandée pour configurer Clawdbot. Il vous guide à travers tous les paramètres nécessaires via des questions interactives :

**Points Clés à Retenir** :
- ✅ Supporte les modes **QuickStart** et **Manual**
- ✅ Avertissement de sécurité rappelant les risques potentiels
- ✅ Détecte automatiquement la configuration existante, permet de conserver/modifier/réinitialiser
- ✅ Supporte le flux **Anthropic setup-token** (recommandé) et la méthode API Key
- ✅ Supporte les environnements avec **CLAWDBOT_PROFILE** pour plusieurs profils de configuration
- ✅ Configure automatiquement les canaux et les compétences
- ✅ Génère des valeurs par défaut sécurisées (liaison loopback, authentification token)

**Flux de Travail Recommandé** :
1. Première utilisation : `clawdbot onboard --install-daemon`
2. Modifier la configuration : `clawdbot configure`
3. Dépannage : `clawdbot doctor`
4. Accès distant : Configurer Tailscale Serve/Funnel

**Prochaines Étapes** :
- [Démarrer la Gateway](../gateway-startup/) : Faire fonctionner la Gateway en arrière-plan
- [Envoyer le Premier Message](../first-message/) : Commencer le dialogue avec l'assistant IA
- [Comprendre l'Appairage DM](../pairing-approval/) : Contrôler sécuritairement les expéditeurs inconnus

---

## Aperçu du Prochain Cours

> Dans le prochain cours, nous apprendrons à **[Démarrer la Gateway](../gateway-startup/)**.
>
> Vous apprendrez :
> - Comment démarrer le daemon Gateway
> - La différence entre les modes développement et production
> - Comment surveiller l'état de la Gateway
> - Utiliser launchd/systemd pour le démarrage automatique

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité           | Chemin du Fichier                                                                                                  | Lignes      |
| -------------- | ------------------------------------------------------------------------------------------------- | --------- |
| Flux principal de l'assistant     | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 87-452    |
| Confirmation de l'avertissement de sécurité   | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 46-85     |
| Configuration Gateway   | [`src/wizard/onboarding.gateway-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.gateway-config.ts) | 28-249    |
| Définition des interfaces de l'assistant   | [`src/wizard/prompts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/prompts.ts) | 36-52     |
| Configuration des Canaux     | [`src/commands/onboard-channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/onboard-channels.ts) | -         |
| Configuration des Compétences     | [`src/commands/onboard-skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/onboard-skills.ts) | -         |
| Définition des Types de l'Assistant   | [`src/wizard/onboarding.types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.types.ts) | 1-26      |
| Schéma de Configuration | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | -         |

**Types Clés** :
- `WizardFlow` : `"quickstart" | "advanced"` - Type de mode de l'assistant
- `QuickstartGatewayDefaults` : Configuration par défaut de la Gateway en mode QuickStart
- `GatewayWizardSettings` : Paramètres de configuration de la Gateway
- `WizardPrompter` : Interface d'interaction de l'assistant

**Fonctions Clés** :
- `runOnboardingWizard()` : Flux principal de l'assistant
- `configureGatewayForOnboarding()` : Configure le réseau Gateway et l'authentification
- `requireRiskAcknowledgement()` : Affiche et confirme l'avertissement de sécurité

**Valeurs de Configuration par Défaut** (Mode QuickStart) :
- Port Gateway : 18789
- Adresse de liaison : loopback (127.0.0.1)
- Méthode d'authentification : token (génère automatiquement un token aléatoire)
- Tailscale : off
- Espace de travail : `~/clawd`

**Emplacement des Fichiers de Configuration** :
- Configuration principale : `~/.clawdbot/clawdbot.json`
- Credentials OAuth : `~/.clawdbot/credentials/oauth.json`
- Credentials API Key : `~/.clawdbot/credentials/`
- Données de session : `~/clawd/sessions.json`

</details>
