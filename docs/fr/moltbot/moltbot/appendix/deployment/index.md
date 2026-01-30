---
title: "Guide complet de déploiement Clawdbot : Local, Docker, Nix, Fly.io, Hetzner VPS et exe.dev | Tutoriel Clawdbot"
sidebarTitle: "Faire fonctionner Gateway 24/7"
subtitle: "Options de déploiement"
description: "Apprenez à déployer Clawdbot sur différentes plateformes : installation locale, conteneurisation Docker, configuration déclarative Nix, déploiement cloud Fly.io, hébergement Hetzner VPS et hébergement virtuel exe.dev. Découvrez les caractéristiques, cas d'usage, étapes de configuration et meilleures pratiques de sécurité pour chaque méthode de déploiement."
tags:
  - "déploiement"
  - "installation"
  - "Docker"
  - "Nix"
  - "cloud"
prerequisite:
  - "start-getting-started"
order: 360
---

# Options de déploiement

## Ce que vous saurez faire

Après ce cours, vous serez capable de :

- Choisir la méthode de déploiement la plus adaptée à vos besoins (local, Docker, Nix, services cloud)
- Installer et exécuter Clawdbot dans un environnement local
- Déployer Gateway avec conteneurisation Docker
- Gérer Clawdbot de manière déclarative via Nix
- Déployer Gateway sur Fly.io, Hetzner VPS ou exe.dev
- Configurer l'accès distant et les meilleures pratiques de sécurité

## Votre situation actuelle

Vous voulez utiliser Clawdbot mais vous ne savez pas quelle méthode de déploiement choisir :

- L'installation locale est la plus simple, mais ne fonctionne pas quand la machine est éteinte
- Vous voulez exécuter dans le cloud 24/7, mais ne savez pas quel service cloud convient
- Vous craignez les erreurs de configuration et cherchez la solution la plus fiable
- Vous avez besoin d'accéder au même Gateway depuis plusieurs appareils, mais ne savez pas comment faire

## Quand utiliser cette approche

| Méthode de déploiement | Cas d'usage |
| --- | --- |
| **Installation locale** | PC personnel, tests de développement, prise en main rapide |
| **Docker** | Environnement isolé, déploiement serveur, reconstruction rapide |
| **Nix** | Déploiement reproductible, utilisateurs NixOS/Home Manager, besoin de rollback |
| **Fly.io** | Exécution cloud 24/7, HTTPS automatique, opérations simplifiées |
| **Hetzner VPS** | VPS personnel, contrôle total, 24/7 à faible coût |
| **exe.dev** | Hébergement Linux économique, pas besoin de configurer un VPS |

## 🎒 Préparation

Avant de commencer, vérifiez :

::: warning Exigences environnementales
- Node.js ≥ 22 (requis pour installation locale)
- Docker Desktop + Docker Compose v2 (requis pour déploiement Docker)
- Nix flakes + Home Manager (requis pour déploiement Nix)
- Client SSH (requis pour accès cloud)
- Compétences de base en terminal (copier, coller, exécuter des commandes)
:::

::: tip Outils recommandés
 - Si c'est votre première fois avec Clawdbot, commencez par [Démarrage rapide](../../start/getting-started/)
- Utiliser un assistant IA (comme Claude, Cursor) peut accélérer le processus de configuration
- Sauvegardez vos clés API (Anthropic, OpenAI, etc.) et identifiants de canaux
:::

## Comparaison des méthodes de déploiement

### Installation locale

**Convient pour** : PC personnel, tests de développement, prise en main rapide

**Avantages** :
- ✅ Le plus simple et direct, pas besoin d'infrastructure supplémentaire
- ✅ Démarrage rapide, débogage pratique
- ✅ Modifications de configuration prennent effet immédiatement

**Inconvénients** :
- ❌ Inutilisable quand la machine est éteinte
- ❌ Pas adapté pour service 24/7
- ❌ Synchronisation multi-appareils nécessite configuration supplémentaire

### Déploiement Docker

**Convient pour** : Déploiement serveur, environnement isolé, CI/CD

**Avantages** :
- ✅ Isolation environnementale, facile à nettoyer et reconstruire
- ✅ Déploiement uniforme multi-plateforme
- ✅ Support exécution d'outils en sandbox isolé
- ✅ Configuration versionnable

**Inconvénients** :
- ❌ Nécessite connaissances Docker
- ❌ Configuration initiale légèrement complexe

### Déploiement Nix

**Convient pour** : Utilisateurs NixOS, utilisateurs Home Manager, besoin de déploiement reproductible

**Avantages** :
- ✅ Configuration déclarative, reproductible
- ✅ Rollback rapide (`home-manager switch --rollback`)
- ✅ Versions de tous les composants fixées
- ✅ Gateway + app macOS + outils tous gérés

**Inconvénients** :
- ❌ Courbe d'apprentissage abrupte
- ❌ Nécessite familiarité avec l'écosystème Nix

### Déploiement cloud (Fly.io / Hetzner / exe.dev)

**Convient pour** : En ligne 24/7, accès distant, collaboration d'équipe

**Avantages** :
- ✅ En ligne 24/7, indépendant de la machine locale
- ✅ HTTPS automatique, pas besoin de certificat manuel
- ✅ Évolutivité rapide
- ✅ Support accès distant multi-appareils

**Inconvénients** :
- ❌ Nécessite paiement de services cloud
- ❌ Nécessite connaissances de base en opérations
- ❌ Données stockées chez un tiers

---

## Installation locale

### Installation globale npm/pnpm/bun (recommandé)

L'installation depuis le dépôt npm officiel est la plus simple :

::: code-group

```bash [npm]
# Installation avec npm
npm install -g clawdbot@latest
```

```bash [pnpm]
# Installation avec pnpm (recommandé)
pnpm add -g clawdbot@latest
```

```bash [bun]
# Installation avec bun (le plus rapide)
bun add -g clawdbot@latest
```

:::

Après installation, exécutez l'assistant :

```bash
clawdbot onboard --install-daemon
```

Cette commande va :
- Vous guider dans la configuration de Gateway, canaux et modèles
- Installer le daemon Gateway (macOS launchd / Linux systemd)
- Configurer le fichier de configuration par défaut `~/.clawdbot/clawdbot.json`

### Construction depuis les sources

Si vous devez construire depuis les sources (développement, personnalisation) :

::: code-group

```bash [macOS/Linux]
# Cloner le dépôt
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# Installer les dépendances et construire
pnpm install
pnpm ui:build
pnpm build

# Installer et exécuter
pnpm clawdbot onboard --install-daemon
```

```bash [Windows (WSL2)]
# Construire dans WSL2 (recommandé)
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

wsl.exe -d Ubuntu bash -c "pnpm install && pnpm ui:build && pnpm build"
```

:::

::: info Cycle de développement
Exécutez `pnpm gateway:watch` pour recharger automatiquement Gateway lors des modifications de code.
:::

---

## Déploiement Docker

### Démarrage rapide (recommandé)

Utilisez le script fourni pour un déploiement en un clic :

```bash
./docker-setup.sh
```

Ce script va :
- Construire l'image Gateway
- Exécuter l'assistant d'onboarding
- Afficher les invites de configuration des fournisseurs
- Démarrer Gateway via Docker Compose
- Générer le token Gateway et l'écrire dans `.env`

Après completion :
1. Ouvrez `http://127.0.0.1:18789/` dans votre navigateur
2. Collez le token dans les paramètres de Control UI

Le script créera sur l'hôte :
- `~/.clawdbot/` (répertoire de configuration)
- `~/clawd` (répertoire de workspace)

### Processus manuel

Si vous devez personnaliser la configuration Docker Compose :

```bash
# Construire l'image
docker build -t clawdbot:local -f Dockerfile .

# Exécuter le conteneur CLI pour compléter la configuration
docker compose run --rm clawdbot-cli onboard

# Démarrer Gateway
docker compose up -d clawdbot-gateway
```

### Montages supplémentaires (optionnel)

Si vous voulez monter des répertoires hôtes supplémentaires dans le conteneur, définissez la variable d'environnement avant d'exécuter `docker-setup.sh` :

```bash
export CLAWDBOT_EXTRA_MOUNTS="$HOME/.codex:/home/node/.codex:ro,$HOME/github:/home/node/github:rw"
./docker-setup.sh
```

**Notes** :
- Les chemins doivent être partagés avec Docker Desktop (macOS/Windows)
- Si vous modifiez `CLAWDBOT_EXTRA_MOUNTS`, vous devez réexécuter `docker-setup.sh` pour régénérer le fichier compose

### Persistance du répertoire home du conteneur (optionnel)

Si vous voulez que `/home/node` persiste lors des reconstructions de conteneur :

```bash
export CLAWDBOT_HOME_VOLUME="clawdbot_home"
./docker-setup.sh
```

**Notes** :
- Les volumes nommés persistent jusqu'à suppression avec `docker volume rm`
- Peut être combiné avec `CLAWDBOT_EXTRA_MOUNTS`

### Installation de paquets système supplémentaires (optionnel)

Si vous devez installer des paquets système supplémentaires dans l'image (par exemple outils de build, bibliothèques média) :

```bash
export CLAWDBOT_DOCKER_APT_PACKAGES="ffmpeg build-essential"
./docker-setup.sh
```

### Configuration des canaux (optionnel)

Utilisez le conteneur CLI pour configurer les canaux :

::: code-group

```bash [WhatsApp]
# Connexion WhatsApp (affichera le QR code)
docker compose run --rm clawdbot-cli channels login
```

```bash [Telegram]
# Ajouter un bot Telegram
docker compose run --rm clawdbot-cli channels add --channel telegram --token "<token>"
```

```bash [Discord]
# Ajouter un bot Discord
docker compose run --rm clawdbot-cli channels add --channel discord --token "<token>"
```

:::

### Vérification de santé

```bash
docker compose exec clawdbot-gateway node dist/index.js health --token "$CLAWDBOT_GATEWAY_TOKEN"
```

### Agent Sandbox (Gateway hôte + outils Docker)

Docker peut également être utilisé pour isoler l'exécution d'outils dans des sessions non-main en sandbox. Voir : [Sandboxing](https://docs.clawd.bot/gateway/sandboxing)

---

## Installation Nix

**Méthode recommandée** : Utiliser le module Home Manager [nix-clawdbot](https://github.com/clawdbot/nix-clawdbot)

### Démarrage rapide

Collez ce texte dans votre assistant IA (Claude, Cursor, etc.) :

```text
I want to set up nix-clawdbot on my Mac.
Repository: github:clawdbot/nix-clawdbot

What I need you to do:
1. Check if Determinate Nix is installed (if not, install it)
2. Create a local flake at ~/code/clawdbot-local using templates/agent-first/flake.nix
3. Help me create a Telegram bot (@BotFather) and get my chat ID (@userinfobot)
4. Set up secrets (bot token, Anthropic key) - plain files at ~/.secrets/ is fine
5. Fill in the template placeholders and run home-manager switch
6. Verify: launchd running, bot responds to messages

Reference nix-clawdbot README for module options.
```

> **📦 Guide complet** : [github.com/clawdbot/nix-clawdbot](https://github.com/clawdbot/nix-clawdbot)

### Comportement d'exécution en mode Nix

Quand `CLAWDBOT_NIX_MODE=1` est défini (nix-clawdbot le définit automatiquement) :

- La configuration devient déterministe, les processus d'installation automatique sont désactivés
- Si des dépendances manquent, affiche des informations de correction spécifiques à Nix
- L'interface UI affiche une bannière en mode lecture seule Nix

Sur macOS, les applications GUI n'héritent pas automatiquement des variables d'environnement du shell. Vous pouvez également activer le mode Nix via defaults :

```bash
defaults write com.clawdbot.mac clawdbot.nixMode -bool true
```

### Chemins de configuration et d'état

En mode Nix, définissez explicitement ces variables d'environnement :

- `CLAWDBOT_STATE_DIR` (par défaut : `~/.clawdbot`)
- `CLAWDBOT_CONFIG_PATH` (par défaut : `$CLAWDBOT_STATE_DIR/clawdbot.json`)

Ainsi l'état d'exécution et la configuration restent en dehors du stockage immuable géré par Nix.

---

## Déploiement cloud Fly.io

**Convient pour** : Besoin d'exécution cloud 24/7, opérations simplifiées, HTTPS automatique

### Ce dont vous avez besoin

- [flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/)
- Compte Fly.io (niveau gratuit disponible)
- Authentification modèle : Clé API Anthropic (ou clé d'autres fournisseurs)
- Identifiants de canaux : token bot Discord, token Telegram, etc.

### Étape 1 : Créer une application Fly

```bash
# Cloner le dépôt
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# Créer une nouvelle application Fly (choisissez votre propre nom)
fly apps create my-clawdbot

# Créer un volume persistant (1GB suffit généralement)
fly volumes create clawdbot_data --size 1 --region iad
```

::: tip Choix de région
Choisissez la région la plus proche de vous. Options courantes :
- `lhr` (Londres)
- `iad` (Virginie)
- `sjc` (San José)
:::

### Étape 2 : Configurer fly.toml

Éditez `fly.toml` pour correspondre au nom de votre application et à vos besoins.

::: warning Note de sécurité
La configuration par défaut expose une URL publique. Pour un déploiement renforcé sans IP publique, voir [Déploiement privé](#déploiement-privé-renforcé), ou utilisez `fly.private.toml`.
:::

```toml
app = "my-clawdbot"  # Nom de votre application
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  CLAWDBOT_PREFER_PNPM = "1"
  CLAWDBOT_STATE_DIR = "/data"
  NODE_OPTIONS = "--max-old-space-size=1536"

[processes]
  app = "node dist/index.js gateway --allow-unconfigured --port 3000 --bind lan"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  size = "shared-cpu-2x"
  memory = "2048mb"

[mounts]
  source = "clawdbot_data"
  destination = "/data"
```

**Explication des paramètres clés** :

| Paramètre | Raison |
| --- | --- |
| `--bind lan` | Lie à `0.0.0.0`, permet au proxy Fly d'accéder à Gateway |
| `--allow-unconfigured` | Démarre sans fichier de configuration (vous le créerez plus tard) |
| `internal_port = 3000` | Doit correspondre à `--port 3000` (ou `CLAWDBOT_GATEWAY_PORT`) pour les vérifications de santé Fly |
| `memory = "2048mb"` | 512MB trop petit ; 2GB recommandé |
| `CLAWDBOT_STATE_DIR = "/data"` | Persiste l'état sur le volume |

### Étape 3 : Configurer les secrets

```bash
# Requis : token Gateway (pour liaison non-loopback)
fly secrets set CLAWDBOT_GATEWAY_TOKEN=$(openssl rand -hex 32)

# Clés API des fournisseurs de modèles
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set GOOGLE_API_KEY=...

# Tokens de canaux
fly secrets set DISCORD_BOT_TOKEN=MTQ...
```

::: tip Conseil de sécurité
La liaison non-loopback (`--bind lan`) nécessite `CLAWDBOT_GATEWAY_TOKEN` pour la sécurité. Traitez ces tokens comme des mots de passe. Pour toutes les clés API et tokens, privilégiez les variables d'environnement plutôt que les fichiers de configuration, cela évite l'exposition des identifiants dans `clawdbot.json`.
:::

### Étape 4 : Déployer

```bash
fly deploy
```

Le premier déploiement construira l'image Docker (environ 2-3 minutes). Les déploiements suivants seront plus rapides.

Après déploiement, vérifiez :

```bash
fly status
fly logs
```

Vous devriez voir :

```
[gateway] listening on ws://0.0.0.0:3000 (PID xxx)
[discord] logged in to discord as xxx
```

### Étape 5 : Créer le fichier de configuration

SSH dans la machine pour créer le fichier de configuration :

```bash
fly ssh console
```

Créer le répertoire et le fichier de configuration :

```bash
mkdir -p /data
cat > /data/clawdbot.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-5",
        "fallbacks": ["anthropic/claude-sonnet-4-5", "openai/gpt-4o"]
      },
      "maxConcurrent": 4
    },
    "list": [
      {
        "id": "main",
        "default": true
      }
    ]
  },
  "auth": {
    "profiles": {
      "anthropic:default": { "mode": "token", "provider": "anthropic" },
      "openai:default": { "mode": "token", "provider": "openai" }
    }
  },
  "bindings": [
    {
      "agentId": "main",
      "match": { "channel": "discord" }
    }
  ],
  "channels": {
    "discord": {
      "enabled": true,
      "groupPolicy": "allowlist",
      "guilds": {
        "YOUR_GUILD_ID": {
          "channels": { "general": { "allow": true } },
          "requireMention": false
        }
      }
    }
  },
  "gateway": {
    "mode": "local",
    "bind": "auto"
  },
  "meta": {
    "lastTouchedVersion": "2026.1.25"
  }
}
EOF
```

Redémarrer pour appliquer la configuration :

```bash
exit
fly machine restart <machine-id>
```

### Étape 6 : Accéder à Gateway

**Control UI** :

```bash
fly open
```

Ou visitez : `https://my-clawdbot.fly.dev/`

Collez votre token Gateway (depuis `CLAWDBOT_GATEWAY_TOKEN`) pour vous authentifier.

**Logs** :

```bash
fly logs              # Logs en temps réel
fly logs --no-tail    # Logs récents
```

**Console SSH** :

```bash
fly ssh console
```

### Dépannage

**"App is not listening on expected address"** :

Gateway lie à `127.0.0.1` au lieu de `0.0.0.0`.

**Correction** : Ajoutez `--bind lan` dans la commande de processus dans `fly.toml`.

**Échec de vérification de santé / Connexion refusée** :

Fly ne peut pas accéder à Gateway sur le port configuré.

**Correction** : Assurez-vous que `internal_port` correspond au port Gateway (définissez `--port 3000` ou `CLAWDBOT_GATEWAY_PORT=3000`).

**OOM / Problèmes de mémoire** :

Le conteneur redémarre continuellement ou est tué. Signes : `SIGABRT`, `v8::internal::Runtime_AllocateInYoungGeneration` ou redémarrages silencieux.

**Correction** : Augmentez la mémoire dans `fly.toml` :

```toml
[[vm]]
  memory = "2048mb"
```

Ou mettez à jour la machine existante :

```bash
fly machine update <machine-id> --vm-memory 2048 -y
```

**Note** : 512MB trop petit. 1GB peut fonctionner mais risque OOM sous charge ou logs détaillés. **2GB recommandé**.

**Problème de verrou Gateway** :

Gateway refuse de démarrer, affichant une erreur "already running".

Cela se produit quand le conteneur redémarre mais le fichier de verrou PID persiste sur le volume.

**Correction** : Supprimez le fichier de verrou :

```bash
fly ssh console --command "rm -f /data/gateway.*.lock"
fly machine restart <machine-id>
```

Les fichiers de verrou sont situés à `/data/gateway.*.lock` (pas dans un sous-répertoire).

### Déploiement privé (renforcé)

Par défaut, Fly.io attribue une IP publique, rendant votre Gateway accessible sur `https://your-app.fly.dev`. C'est pratique, mais signifie que votre déploiement peut être découvert par les scanners Internet (Shodan, Censys, etc.).

**Utilisez le modèle privé** pour un déploiement renforcé sans exposition publique :

::: info Scénarios de déploiement privé
- Vous effectuez uniquement des appels/messages **sortants** (pas de webhooks entrants)
- Vous utilisez des tunnels **ngrok ou Tailscale** pour les callbacks webhook
- Vous accédez à Gateway via **SSH, proxy ou WireGuard** plutôt que par navigateur
- Vous voulez que le déploiement soit **caché des scanners Internet**
:::

**Configuration** :

Utilisez `fly.private.toml` au lieu de la configuration standard :

```bash
# Déployer avec configuration privée
fly deploy -c fly.private.toml
```

Ou convertir un déploiement existant :

```bash
# Lister les IP actuelles
fly ips list -a my-clawdbot

# Libérer les IP publiques
fly ips release <public-ipv4> -a my-clawdbot
fly ips release <public-ipv6> -a my-clawdbot

# Basculer vers configuration privée pour que les futurs déploiements ne réattribuent pas d'IP publique
fly deploy -c fly.private.toml

# Attribuer uniquement IPv6 privée
fly ips allocate-v6 --private -a my-clawdbot
```

**Accéder au déploiement privé** :

Comme il n'y a pas d'URL publique, utilisez l'une des méthodes suivantes :

**Option 1 : Proxy local (le plus simple)**

```bash
# Transférer le port local 3000 vers l'application
fly proxy 3000:3000 -a my-clawdbot

# Puis ouvrir http://localhost:3000 dans le navigateur
```

**Option 2 : VPN WireGuard**

```bash
# Créer configuration WireGuard (une fois)
fly wireguard create

# Importer dans le client WireGuard, puis accéder via IPv6 interne
# Exemple : http://[fdaa:x:x:x:x::x]:3000
```

**Option 3 : SSH uniquement**

```bash
fly ssh console -a my-clawdbot
```

### Coût

Avec la configuration recommandée (`shared-cpu-2x`, 2GB RAM) :
- Environ $10-15/mois selon l'utilisation
- Le niveau gratuit inclut certains quotas

Voir : [Tarification Fly.io](https://fly.io/docs/about/pricing/)

---

## Déploiement Hetzner VPS

**Convient pour** : VPS personnel, contrôle total, exécution 24/7 à faible coût

### Objectif

Exécuter un Gateway Clawdbot persistant sur un VPS Hetzner avec Docker, avec état persistant, binaires intégrés et comportement de redémarrage sécurisé.

Si vous voulez "Clawdbot 24/7, environ $5/mois", c'est la configuration la plus simple et fiable.

### Ce dont vous avez besoin

- VPS Hetzner avec accès root
- Accès SSH depuis votre ordinateur portable
- Confort de base avec SSH + copier/coller
- Environ 20 minutes
- Docker et Docker Compose
- Identifiants d'authentification de modèles
- Identifiants de fournisseurs optionnels (QR WhatsApp, token bot Telegram, OAuth Gmail)

### Étape 1 : Configurer le VPS

Créez un VPS Ubuntu ou Debian dans Hetzner.

Connectez-vous en tant que root :

```bash
ssh root@YOUR_VPS_IP
```

Ce guide suppose que le VPS est avec état. Ne le traitez pas comme une infrastructure jetable.

### Étape 2 : Installer Docker sur le VPS

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```

Vérifier :

```bash
docker --version
docker compose version
```

### Étape 3 : Cloner le dépôt Clawdbot

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

Ce guide suppose que vous construirez une image personnalisée pour garantir la persistance des binaires.

### Étape 4 : Créer des répertoires hôtes persistants

Les conteneurs Docker sont éphémères. Tout état à long terme doit exister sur l'hôte.

```bash
mkdir -p /root/.clawdbot
mkdir -p /root/clawd

# Définir la propriété pour l'utilisateur du conteneur (uid 1000) :
chown -R 1000:1000 /root/.clawdbot
chown -R 1000:1000 /root/clawd
```

### Étape 5 : Configurer les variables d'environnement

Créez `.env` dans la racine du dépôt.

```bash
CLAWDBOT_IMAGE=clawdbot:latest
CLAWDBOT_GATEWAY_TOKEN=change-me-now
CLAWDBOT_GATEWAY_BIND=lan
CLAWDBOT_GATEWAY_PORT=18789
CLAWDBOT_CONFIG_DIR=/root/.clawdbot
CLAWDBOT_WORKSPACE_DIR=/root/clawd
GOG_KEYRING_PASSWORD=change-me-now
XDG_CONFIG_HOME=/home/node/.clawdbot
```

Générer des secrets forts :

```bash
openssl rand -hex 32
```

::: warning Ne commitez pas ce fichier
Ajoutez `.env` à `.gitignore`.
:::


### Étape 6 : Configuration Docker Compose

Créez ou mettez à jour `docker-compose.yml`.

```yaml
services:
  clawdbot-gateway:
    image: ${CLAWDBOT_IMAGE}
    build: .
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - HOME=/home/node
      - NODE_ENV=production
      - TERM=xterm-256color
      - CLAWDBOT_GATEWAY_BIND=${CLAWDBOT_GATEWAY_BIND}
      - CLAWDBOT_GATEWAY_PORT=${CLAWDBOT_GATEWAY_PORT}
      - CLAWDBOT_GATEWAY_TOKEN=${CLAWDBOT_GATEWAY_TOKEN}
      - GOG_KEYRING_PASSWORD=${GOG_KEYRING_PASSWORD}
      - XDG_CONFIG_HOME=${XDG_CONFIG_HOME}
      - PATH=/home/linuxbrew/.linuxbrew/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    volumes:
      - ${CLAWDBOT_CONFIG_DIR}:/home/node/.clawdbot
      - ${CLAWDBOT_WORKSPACE_DIR}:/home/node/clawd
    ports:
      # Recommandé : Garder Gateway en loopback uniquement sur VPS ; accéder via tunnel SSH.
      # Pour exposition publique, retirez le préfixe `127.0.0.1:` et configurez le pare-feu en conséquence.
      - "127.0.0.1:${CLAWDBOT_GATEWAY_PORT}:18789"
      # Optionnel : Uniquement si vous exécutez des nœuds iOS/Android contre ce VPS et avez besoin d'un hôte Canvas.
      # Si vous exposez ce port publiquement, lisez /gateway/security et configurez le pare-feu en conséquence.
      # - "18793:18793"
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--bind",
        "${CLAWDBOT_GATEWAY_BIND}",
        "--port",
        "${CLAWDBOT_GATEWAY_PORT}"
      ]
```

### Étape 7 : Intégrer les binaires requis dans l'image (critique)

Installer des binaires dans un conteneur en cours d'exécution est un piège. Tout ce qui est installé au runtime sera perdu au redémarrage.

Tous les binaires externes requis par les skills doivent être installés au moment de la construction de l'image.

L'exemple suivant ne montre que trois binaires courants :
- `gog` pour l'accès Gmail
- `goplaces` pour Google Places
- `wacli` pour WhatsApp

Ce sont des exemples, pas une liste complète. Vous pouvez installer autant de binaires que nécessaire en utilisant le même modèle.

Si vous ajoutez plus tard de nouvelles skills qui dépendent de binaires supplémentaires, vous devez :

1. Mettre à jour le Dockerfile
2. Reconstruire l'image
3. Redémarrer le conteneur

**Exemple de Dockerfile** :

```dockerfile
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Exemple binaire 1 : Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin gog

# Exemple binaire 2 : Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin goplaces

# Exemple binaire 3 : WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin wacli

# Ajoutez plus de binaires en utilisant le même modèle ci-dessous

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production

CMD ["node","dist/index.js"]
```

### Étape 8 : Construire et démarrer

```bash
docker compose build
docker compose up -d clawdbot-gateway
```

Vérifier les binaires :

```bash
docker compose exec clawdbot-gateway which gog
docker compose exec clawdbot-gateway which goplaces
docker compose exec clawdbot-gateway which wacli
```

Sortie attendue :

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

### Étape 9 : Vérifier Gateway

```bash
docker compose logs -f clawdbot-gateway
```

Succès :

```
[gateway] listening on ws://0.0.0.0:18789
```

Depuis votre ordinateur portable :

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

Ouvrir :

`http://127.0.0.1:18789/`

Coller votre token Gateway.

### Emplacements de persistance d'état (source de vérité)

Clawdbot s'exécute dans Docker, mais Docker n'est pas la source de vérité.

Tout état à long terme doit survivre aux redémarrages, reconstructions et relances.

| Composant | Emplacement | Mécanisme de persistance | Notes |
| --- | --- | --- | --- |
| Config Gateway | `/home/node/.clawdbot/` | Montage volume hôte | Inclut `clawdbot.json`, tokens |
| Profils auth modèles | `/home/node/.clawdbot/` | Montage volume hôte | Tokens OAuth, clés API |
| Configs skills | `/home/node/.clawdbot/skills/` | Montage volume hôte | État niveau skill |
| Workspace agent | `/home/node/clawd/` | Montage volume hôte | Code et artefacts agent |
| Session WhatsApp | `/home/node/.clawdbot/` | Montage volume hôte | Conserve connexion QR |
| Keyring Gmail | `/home/node/.clawdbot/` | Volume hôte + mot de passe | Nécessite `GOG_KEYRING_PASSWORD` |
| Binaires externes | `/usr/local/bin/` | Image Docker | Doivent être intégrés au build |
| Runtime Node | Système de fichiers conteneur | Image Docker | Reconstruit à chaque build d'image |
| Paquets OS | Système de fichiers conteneur | Image Docker | Ne pas installer au runtime |
| Conteneur Docker | Éphémère | Redémarrable | Destruction sûre |

---

## Déploiement exe.dev

**Convient pour** : Hébergement Linux économique, accès distant, pas besoin de configurer un VPS

### Objectif

Exécuter Clawdbot Gateway sur une VM exe.dev, accessible depuis votre ordinateur portable via :
- **Proxy HTTPS exe.dev** (simple, pas besoin de tunnel)
- **Tunnel SSH** (le plus sécurisé ; Gateway en loopback uniquement)

Ce guide suppose **Ubuntu/Debian**. Si vous avez choisi une distribution différente, adaptez les paquets en conséquence. Si vous êtes sur n'importe quel autre VPS Linux, les mêmes étapes s'appliquent—vous n'utiliserez simplement pas les commandes proxy exe.dev.

### Ce dont vous avez besoin

- Compte exe.dev + capacité à exécuter `ssh exe.dev` depuis votre ordinateur portable
- Clés SSH configurées (votre ordinateur portable → exe.dev)
- Authentification modèle que vous utiliserez (OAuth ou clé API)
- Identifiants de fournisseurs optionnels (scan QR WhatsApp, token bot Telegram, token bot Discord, etc.)

### Étape 1 : Créer une VM

Depuis votre ordinateur portable :

```bash
ssh exe.dev new --name=clawdbot
```

Puis connectez-vous :

```bash
ssh clawdbot.exe.xyz
```

::: tip Garder la VM avec état
Gardez cette VM **avec état**. Clawdbot stocke l'état sous `~/.clawdbot/` et `~/clawd/`.
:::

### Étape 2 : Installer les prérequis sur la VM

```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```

### Node 22

Installez Node **≥ 22.12** (n'importe quelle méthode fonctionne). Vérification rapide :

```bash
node -v
```

Si Node 22 n'est pas encore sur la VM, utilisez votre gestionnaire Node préféré ou une source de paquets de distribution fournissant Node 22+.

### Étape 3 : Installer Clawdbot

Sur le serveur, l'installation globale npm est recommandée :

```bash
npm i -g clawdbot@latest
clawdbot --version
```

Si l'installation des dépendances natives échoue (rare ; généralement `sharp`), ajoutez les outils de build :

```bash
sudo apt-get install -y build-essential python3
```

### Étape 4 : Configuration initiale (assistant)

Exécutez l'assistant d'onboarding sur la VM :

```bash
clawdbot onboard --install-daemon
```

Il peut configurer :
- Bootstrap du workspace `~/clawd`
- Configuration `~/.clawdbot/clawdbot.json`
- Profils d'authentification modèles
- Configuration/connexion fournisseurs de modèles
- Service **utilisateur** systemd Linux

Si vous faites OAuth sur une VM sans tête, faites d'abord OAuth sur une machine normale, puis copiez le profil d'authentification sur la VM (voir [Aide](https://docs.clawd.bot/help/)).

### Étape 5 : Options d'accès distant

#### Option A (recommandé) : Tunnel SSH (loopback uniquement)

Gardez Gateway en loopback (par défaut) et tunnelisez-le depuis votre ordinateur portable :

```bash
ssh -N -L 18789:127.0.0.1:18789 clawdbot.exe.xyz
```

Ouvrir localement :

- `http://127.0.0.1:18789/` (Control UI)

Voir : [Accès distant](https://docs.clawd.bot/gateway/remote)

#### Option B : Proxy HTTPS exe.dev (pas besoin de tunnel)

Pour que exe.dev proxifie le trafic vers la VM, liez Gateway à l'interface LAN et définissez un token :

```bash
export CLAWDBOT_GATEWAY_TOKEN="$(openssl rand -hex 32)"
clawdbot gateway --bind lan --port 8080 --token "$CLAWDBOT_GATEWAY_TOKEN"
```

Pour l'exécution en service, persistez-le dans `~/.clawdbot/clawdbot.json` :

```json5
{
  "gateway": {
    "mode": "local",
    "port": 8080,
    "bind": "lan",
    "auth": { "mode": "token", "token": "YOUR_TOKEN" }
  }
}
```

::: info Note importante
La liaison non-loopback nécessite `gateway.auth.token` (ou `CLAWDBOT_GATEWAY_TOKEN`). `gateway.remote.token` est uniquement pour les appels CLI distants ; il n'active pas l'authentification locale.
:::

Ensuite, sur exe.dev, pointez le proxy vers le port que vous avez choisi (dans cet exemple `8080`, ou n'importe quel port que vous choisissez), et ouvrez l'URL HTTPS de votre VM :

```bash
ssh exe.dev share port clawdbot 8080
```

Ouvrir :

`https://clawdbot.exe.xyz/`

Dans Control UI, collez le token (UI → Paramètres → token). L'UI l'envoie comme `connect.params.auth.token`.

::: tip Port proxy
Si le proxy attend un port d'application, privilégiez un port **non-par défaut** (comme `8080`). Traitez le token comme un mot de passe.
:::

### Étape 6 : Maintenir en fonctionnement (service)

Sur Linux, Clawdbot utilise un service **utilisateur** systemd. Après `--install-daemon`, vérifiez :

```bash
systemctl --user status clawdbot-gateway[-<profile>].service
```

Si le service meurt après déconnexion, activez le lingering :

```bash
sudo loginctl enable-linger "$USER"
```

### Étape 7 : Mise à jour

```bash
npm i -g clawdbot@latest
clawdbot doctor
clawdbot gateway restart
clawdbot health
```

Voir : [Mise à jour](https://docs.clawd.bot/install/updating)

---

## Conseils de choix

### Choisir selon le cas d'usage

| Scénario | Déploiement recommandé | Raison |
| --- | --- | --- |
| **Usage personnel, prise en main rapide** | Installation locale | Le plus simple, pas besoin d'infrastructure |
| **Accès multi-appareils, arrêts occasionnels** | Fly.io | En ligne 24/7, accessible de partout |
| **Contrôle total, infrastructure personnelle** | Hetzner VPS | Contrôle total, état persistant, faible coût |
| **Faible coût, pas envie de gérer un VPS** | exe.dev | Hébergement économique, configuration rapide |
| **Besoin de reproductibilité, rollback rapide** | Nix | Configuration déclarative, versions fixées |
| **Tests, environnement isolé** | Docker | Facile à reconstruire, isolation des tests |

### Meilleures pratiques de sécurité

Quelle que soit la méthode de déploiement choisie, suivez ces principes de sécurité :

::: warning Authentification et contrôle d'accès
- Toujours définir un token ou une authentification par mot de passe pour Gateway (lors de liaison non-loopback)
- Utiliser des variables d'environnement pour stocker les identifiants sensibles (clés API, tokens)
- Pour les déploiements cloud, éviter l'exposition publique ou utiliser un réseau privé
:::

::: tip Persistance d'état
- Pour les déploiements conteneurisés, assurez-vous que la configuration et le workspace sont correctement montés sur des volumes hôtes
- Pour les déploiements VPS, sauvegardez régulièrement les répertoires `~/.clawdbot/` et `~/clawd/`
:::

### Surveillance et logs

- Vérifiez régulièrement l'état de Gateway : `clawdbot doctor`
- Configurez la rotation des logs pour éviter l'épuisement de l'espace disque
- Utilisez les endpoints de vérification de santé pour valider la disponibilité du service

---

## Point de contrôle ✅

**Vérification installation locale** :

```bash
clawdbot --version
clawdbot health
```

Vous devriez voir un message indiquant que Gateway est en écoute.

**Vérification Docker** :

```bash
docker compose ps
docker compose logs clawdbot-gateway
```

L'état du conteneur devrait être `Up`, les logs devraient afficher `[gateway] listening on ws://...`.

**Vérification Nix** :

```bash
# Vérifier l'état du service
systemctl --user status clawdbot-gateway

# Vérifier le mode Nix
defaults read com.clawdbot.mac clawdbot.nixMode
```

**Vérification déploiement cloud** :

```bash
# Fly.io
fly status
fly logs

# Hetzner / exe.dev
ssh root@YOUR_VPS_IP "docker compose logs -f clawdbot-gateway"
```

Vous devriez pouvoir accéder à Control UI via le navigateur ou via tunnel SSH.

---

## Pièges à éviter

::: warning Problèmes courants Docker
- **Erreur de chemin de montage** : Assurez-vous que les chemins hôtes sont partagés dans Docker Desktop
- **Conflit de port** : Vérifiez que le port 18789 n'est pas occupé
- **Problème de permissions** : L'utilisateur du conteneur (uid 1000) nécessite des permissions de lecture/écriture sur les volumes montés
:::

::: warning Problèmes de déploiement cloud
- **Erreur OOM** : Augmentez l'allocation mémoire (au moins 2GB)
- **Verrou Gateway** : Supprimez les fichiers `/data/gateway.*.lock` puis redémarrez le conteneur
- **Échec de vérification de santé** : Assurez-vous que `internal_port` correspond au port Gateway
:::

::: tip Persistance des binaires (Hetzner)
N'installez pas de dépendances au runtime ! Tous les binaires requis par les skills doivent être intégrés dans l'image Docker, sinon ils seront perdus au redémarrage du conteneur.
:::

---

## Résumé du cours

Ce cours a présenté plusieurs méthodes de déploiement de Clawdbot :

1. **Installation locale** : La plus simple et rapide, adaptée à l'usage personnel et au développement
2. **Déploiement Docker** : Environnement isolé, facile à reconstruire, support sandbox
3. **Déploiement Nix** : Configuration déclarative, reproductible, rollback rapide
4. **Fly.io** : Plateforme cloud, HTTPS automatique, en ligne 24/7
5. **Hetzner VPS** : VPS personnel, contrôle total, état persistant
6. **exe.dev** : Hébergement économique, configuration rapide, opérations simplifiées

Lors du choix d'une méthode de déploiement, considérez votre cas d'usage, vos compétences techniques et vos besoins opérationnels. La persistance d'état et la configuration sécurisée sont les clés d'un déploiement réussi.

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité/Section | Chemin du fichier | Lignes |
| --- | --- | --- |
| Script de déploiement Docker | [`docker-setup.sh`](https://github.com/moltbot/moltbot/blob/main/docker-setup.sh) | Complet |
| Définition image Docker | [`Dockerfile`](https://github.com/moltbot/moltbot/blob/main/Dockerfile) | Complet |
| Configuration Docker Compose | [`docker-compose.yml`](https://github.com/moltbot/moltbot/blob/main/docker-compose.yml) | Complet |
| Configuration Fly.io | [`fly.toml`](https://github.com/moltbot/moltbot/blob/main/fly.toml) | Complet |
| Configuration Fly privée | [`fly.private.toml`](https://github.com/moltbot/moltbot/blob/main/fly.private.toml) | Complet |
| Image sandbox Docker | [`Dockerfile.sandbox`](https://github.com/moltbot/moltbot/blob/main/Dockerfile.sandbox) | Complet |
| Intégration Nix | [`nix-clawdbot`](https://github.com/clawdbot/nix-clawdbot) | README |
| Script d'installation | [`scripts/package-mac-app.sh`](https://github.com/moltbot/moltbot/blob/main/scripts/package-mac-app.sh) | Complet |

**Fichiers de configuration clés** :
- `~/.clawdbot/clawdbot.json` : Fichier de configuration principal
- `~/.clawdbot/` : Répertoire d'état (sessions, tokens, profils auth)
- `~/clawd/` : Répertoire de workspace

**Variables d'environnement clés** :
- `CLAWDBOT_GATEWAY_TOKEN` : Token d'authentification Gateway
- `CLAWDBOT_STATE_DIR` : Chemin du répertoire d'état
- `CLAWDBOT_CONFIG_PATH` : Chemin du fichier de configuration
- `CLAWDBOT_NIX_MODE` : Activer le mode Nix

**Scripts clés** :
- `scripts/sandbox-setup.sh` : Construire l'image sandbox par défaut
- `scripts/sandbox-common-setup.sh` : Construire l'image sandbox commune
- `scripts/sandbox-browser-setup.sh` : Construire l'image sandbox navigateur

**Variables d'environnement Docker** (.env) :
- `CLAWDBOT_IMAGE` : Nom de l'image à utiliser
- `CLAWDBOT_GATEWAY_BIND` : Mode de liaison (lan/auto)
- `CLAWDBOT_GATEWAY_PORT` : Port Gateway
- `CLAWDBOT_CONFIG_DIR` : Montage du répertoire de configuration
- `CLAWDBOT_WORKSPACE_DIR` : Montage du workspace
- `GOG_KEYRING_PASSWORD` : Mot de passe keyring Gmail
- `XDG_CONFIG_HOME` : Répertoire de configuration XDG

**Variables d'environnement Fly.io** :
- `NODE_ENV` : Environnement d'exécution (production)
- `CLAWDBOT_PREFER_PNPM` : Utiliser pnpm
- `CLAWDBOT_STATE_DIR` : Répertoire d'état persistant
- `NODE_OPTIONS` : Options d'exécution Node.js

</details>
