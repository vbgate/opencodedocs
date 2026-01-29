---
title: "Démarrer le Gateway : Démon et modes d'exécution | Tutoriel Clawdbot"
sidebarTitle: "Gateway toujours en ligne"
subtitle: "Démarrer le Gateway : Démon et modes d'exécution"
description: "Apprenez à démarrer le démon Gateway de Clawdbot, comprenez les différences entre les modes développement et production, et maîtrisez les commandes de démarrage et la configuration des paramètres."
tags:
  - "gateway"
  - "daemon"
  - "startup"
prerequisite:
  - "start-onboarding-wizard"
order: 30
---

# Démarrer le Gateway : Démon et modes d'exécution

## Ce que vous pourrez faire après ce cours

- Démarrer le Gateway en mode premier plan via la ligne de commande
- Configurer le Gateway en tant que démon en arrière-plan (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- Comprendre les différents modes de liaison (loopback / LAN / Tailnet) et les méthodes d'authentification
- Basculer entre le mode développement et le mode production
- Utiliser `--force` pour libérer par force un port occupé

## Votre problème actuel

Vous avez terminé la configuration de l'assistant, les paramètres de base du Gateway sont prêts. Mais :

- Chaque fois que vous voulez utiliser le Gateway, vous devez exécuter manuellement une commande dans le terminal ?
- Le Gateway s'arrête lorsque vous fermez la fenêtre du terminal, et l'assistant IA se "déconnecte" également ?
- Vous voulez accéder au Gateway depuis le réseau local ou le réseau Tailscale, mais vous ne savez pas comment configurer cela ?
- Le Gateway échoue à démarrer, mais vous ne savez pas si c'est un problème de configuration ou un port occupé ?

## Quand utiliser cette méthode

**Méthodes de démarrage recommandées** :

| Scénario | Commande | Explication |
|--- | --- | ---|
| Usage quotidien | `clawdbot gateway install` + `clawdbot gateway start` | Démarrage automatique en tant que service en arrière-plan |
| Débogage de développement | `clawdbot gateway --dev` | Créer une configuration de développement, rechargement automatique |
| Test temporaire | `clawdbot gateway` | Exécution en premier plan, les journaux sont affichés directement dans le terminal |
| Conflit de port | `clawdbot gateway --force` | Libérer par force le port avant de démarrer |
| Accès réseau local | `clawdbot gateway --bind lan` | Autoriser les connexions des périphériques du réseau local |
| Accès distant Tailscale | `clawdbot gateway --tailscale serve` | Exposer le Gateway via le réseau Tailscale |

## 🎒 Préparation avant de commencer

::: warning Vérifications préalables

Avant de démarrer le Gateway, assurez-vous de :

1. ✅ Avoir terminé la configuration de l'assistant (`clawdbot onboard`) ou avoir défini manuellement `gateway.mode=local`
2. ✅ Le modèle IA est configuré (Anthropic / OpenAI / OpenRouter, etc.)
3. ✅ Si l'accès au réseau externe est nécessaire (LAN / Tailnet), l'authentification est configurée
4. ✅ Vous comprenez votre scénario d'utilisation (développement local vs production)

:::

## Concept de base

**Qu'est-ce que le Gateway ?**

Le Gateway est le plan de contrôle WebSocket de Clawdbot, il est responsable de :

- **Gestion de session** : Maintenir l'état de toutes les sessions de conversation IA
- **Connexion de canaux** : Connecter WhatsApp, Telegram, Slack et plus de 12 canaux de messagerie
- **Appel d'outils** : Coordonner l'automatisation du navigateur, les opérations de fichiers, les tâches planifiées, etc.
- **Gestion de nœuds** : Gérer les nœuds de périphériques macOS / iOS / Android
- **Distribution d'événements** : Diffuser des événements en temps réel comme la progression de réflexion de l'IA, les résultats d'appel d'outils

**Pourquoi avons-nous besoin d'un démon ?**

Le Gateway exécuté en tant que service en arrière-plan présente ces avantages :

- **Disponibilité permanente** : L'assistant IA reste disponible même après la fermeture du terminal
- **Démarrage automatique** : Le service reprend automatiquement après un redémarrage système (macOS LaunchAgent / Linux systemd)
- **Gestion unifiée** : Contrôler le cycle de vie via les commandes `start` / `stop` / `restart`
- **Centralisation des journaux** : Collecte des journaux au niveau système pour faciliter le dépannage

## Suivez les étapes

### Étape 1 : Démarrer le Gateway (mode premier plan)

**Pourquoi**

Le mode premier plan convient au développement et aux tests, les journaux sont affichés directement dans le terminal, ce qui facilite la surveillance en temps réel de l'état du Gateway.

```bash
# Démarrer avec la configuration par défaut (écouter sur 127.0.0.1:18789)
clawdbot gateway

# Démarrer en spécifiant un port
clawdbot gateway --port 19001

# Activer les journaux détaillés
clawdbot gateway --verbose
```

**Ce que vous devriez voir** :

```bash
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
✓ log file: /Users/you/.clawdbot/logs/gateway.log
```

::: tip Point de vérification

- Voir `listening on ws://...` indique que le démarrage a réussi
- Notez le PID affiché (identifiant de processus), utile pour le débogage ultérieur
- Le port par défaut est 18789, modifiable via `--port`

:::

### Étape 2 : Configurer le mode de liaison

**Pourquoi**

Par défaut, le Gateway n'écoute que sur l'adresse de bouclage locale (`127.0.0.1`), ce qui signifie que seule la machine locale peut se connecter. Si vous souhaitez accéder au Gateway depuis le réseau local ou le réseau Tailscale, vous devez ajuster le mode de liaison.

```bash
# Bouclage local uniquement (par défaut, le plus sécurisé)
clawdbot gateway --bind loopback

# Accès réseau local (nécessite une authentification)
clawdbot gateway --bind lan --token "your-token"

# Accès réseau Tailscale
clawdbot gateway --bind tailnet --token "your-token"

# Détection automatique (local + LAN)
clawdbot gateway --bind auto
```

**Ce que vous devriez voir** :

```bash
# mode loopback
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# mode lan
✓ listening on ws://192.168.1.100:18789 (PID 12345)
✓ listening on ws://10.0.0.5:18789
```

::: warning Avertissement de sécurité

⚠️ **La liaison à une adresse non-loopback nécessite une configuration de l'authentification !**

- `--bind lan` / `--bind tailnet` doit être accompagné de `--token` ou `--password`
- Sinon, le Gateway refusera de démarrer avec l'erreur : `Refusing to bind gateway to lan without auth`
- Le jeton d'authentification est transmis via la configuration `gateway.auth.token` ou le paramètre `--token`

:::
### Étape 3 : Installer en tant que démon (macOS / Linux / Windows)

**Pourquoi**

Le démon permet au Gateway de s'exécuter en arrière-plan, sans être affecté par la fermeture de la fenêtre du terminal. Il démarre automatiquement après un redémarrage du système, gardant l'assistant IA toujours en ligne.

```bash
# Installer en tant que service système (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
clawdbot gateway install

# Démarrer le service
clawdbot gateway start

# Vérifier l'état du service
clawdbot gateway status

# Redémarrer le service
clawdbot gateway restart

# Arrêter le service
clawdbot gateway stop
```

**Ce que vous devriez voir** :

```bash
# macOS
✓ LaunchAgent loaded
✓ service runtime: active

# Linux
✓ systemd service enabled
✓ service runtime: active

# Windows
✓ Scheduled Task registered
✓ service runtime: running
```

::: tip Point de vérification

- Exécutez `clawdbot gateway status` pour confirmer que l'état du service est `active` / `running`
- Si le service affiche `loaded` mais `runtime: inactive`, exécutez `clawdbot gateway start`
- Les journaux du démon sont écrits dans `~/.clawdbot/logs/gateway.log`

:::

### Étape 4 : Gérer les conflits de port (--force)

**Pourquoi**

Le port par défaut 18789 peut être occupé par un autre processus (comme une instance précédente du Gateway). L'utilisation de `--force` permet de libérer automatiquement le port.

```bash
# Libérer par force le port et démarrer le Gateway
clawdbot gateway --force
```

**Ce que vous devriez voir** :

```bash
✓ force: killed pid 9876 (node) on port 18789
✓ force: waited 1200ms for port 18789 to free
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: info Comment cela fonctionne

`--force` effectue les opérations suivantes dans l'ordre :

1. Tenter SIGTERM pour terminer gracieusement le processus (attendre 700ms)
2. Si non terminé, utiliser SIGKILL pour tuer par force
3. Attendre que le port soit libéré (maximum 2 secondes)
4. Démarrer un nouveau processus Gateway

:::
### Étape 5 : Mode développement (--dev)

**Pourquoi**

Le mode développement utilise un fichier de configuration et un répertoire indépendants, évitant de polluer l'environnement de production. Il prend en charge le rechargement à chaud TypeScript, redémarrant automatiquement le Gateway après modification du code.

```bash
# Démarrer le mode développement (créer un profil dev + workspace)
clawdbot gateway --dev

# Réinitialiser la configuration de développement (effacer les crédentials + sessions + workspace)
clawdbot gateway --dev --reset
```

**Ce que vous devriez voir** :

```bash
✓ dev config created at ~/.clawdbot-dev/clawdbot.json
✓ dev workspace initialized at ~/clawd-dev
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Caractéristiques du mode développement

- Fichier de configuration : `~/.clawdbot-dev/clawdbot.json` (indépendant de la configuration de production)
- Répertoire de workspace : `~/clawd-dev`
- Sauter l'exécution du script `BOOT.md`
- Liaison loopback par défaut, aucune authentification requise

:::

### Étape 6 : Intégration Tailscale

**Pourquoi**

Tailscale vous permet d'accéder à un Gateway distant via un réseau privé sécurisé, sans adresse IP publique ou redirection de port.

```bash
# Mode Tailscale Serve (recommandé)
clawdbot gateway --tailscale serve

# Mode Tailscale Funnel (nécessite une authentification supplémentaire)
clawdbot gateway --tailscale funnel --auth password
```

**Ce que vous devriez voir** :

```bash
# mode serve
✓ Tailscale identity detected
✓ advertising gateway via Tailscale Serve
✓ MagicDNS: https://your-tailnet.ts.net
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# mode funnel
✓ Tailscale Funnel enabled
✓ Funnel URL: https://your-tailnet.ts.net:18789
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Configuration de l'authentification

L'intégration Tailscale prend en charge deux méthodes d'authentification :

1. **Identity Headers** (recommandé) : Définir `gateway.auth.allowTailscale=true`, l'identité Tailscale satisfait automatiquement l'authentification
2. **Token / Password** : Méthode d'authentification traditionnelle, nécessitant de transmettre manuellement `--token` ou `--password`

:::
### Étape 7 : Vérifier l'état du Gateway

**Pourquoi**

Confirmer que le Gateway fonctionne normalement et que le protocole RPC est accessible.

```bash
# Voir l'état complet (service + détection RPC)
clawdbot gateway status

# Sauter la détection RPC (état du service uniquement)
clawdbot gateway status --no-probe

# Contrôle de santé
clawdbot gateway health

# Détecter tous les Gateway accessibles
clawdbot gateway probe
```

**Ce que vous devriez voir** :

```bash
# sortie de la commande status
Gateway service status
┌──────────────────────────────────────┐
│ Service: LaunchAgent (loaded)      │
│ Runtime: running (PID 12345)       │
│ Port: 18789                       │
│ Last gateway error: none            │
└──────────────────────────────────────┘

RPC probe
┌──────────────────────────────────────┐
│ Target: ws://127.0.0.1:18789 │
│ Status: ✓ connected                │
│ Latency: 12ms                    │
└──────────────────────────────────────┘

# sortie de la commande health
✓ Gateway is healthy
✓ WebSocket connection: OK
✓ RPC methods: available
```

::: tip Dépannage

Si `status` affiche `Runtime: running` mais `RPC probe: failed` :

1. Vérifiez que le port est correct : `clawdbot gateway status`
2. Vérifiez la configuration de l'authentification : avez-vous lié à LAN / Tailnet sans fournir d'authentification ?
3. Consultez les journaux : `cat ~/.clawdbot/logs/gateway.log`
4. Exécutez `clawdbot doctor` pour obtenir un diagnostic détaillé

:::
## Pièges courants

### ❌ Erreur : Le Gateway refuse de démarrer

**Message d'erreur** :
```
Gateway start blocked: set gateway.mode=local (current: unset) or pass --allow-unconfigured.
```

**Cause** : `gateway.mode` n'est pas défini sur `local`

**Solution** :

```bash
# Méthode 1 : Exécuter la configuration de l'assistant
clawdbot onboard

# Méthode 2 : Modifier manuellement le fichier de configuration
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "mode": "local"
  }
}

# Méthode 3 : Sauter temporairement la vérification (non recommandé)
clawdbot gateway --allow-unconfigured
```

### ❌ Erreur : Liaison à LAN sans authentification

**Message d'erreur** :
```
Refusing to bind gateway to lan without auth.
Set gateway.auth.token/password (or CLAWDBOT_GATEWAY_TOKEN/CLAWDBOT_GATEWAY_PASSWORD) or pass --token/--password.
```

**Cause** : La liaison non-loopback nécessite une configuration de l'authentification (restriction de sécurité)

**Solution** :

```bash
# Définir l'authentification via le fichier de configuration
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}

# Ou transmettre via la ligne de commande
clawdbot gateway --bind lan --token "your-secure-token"
```

### ❌ Erreur : Port déjà occupé

**Message d'erreur** :
```
Error: listen EADDRINUSE: address already in use :::18789
```

**Cause** : Une autre instance du Gateway ou un autre programme occupe le port

**Solution** :

```bash
# Méthode 1 : Libérer par force le port
clawdbot gateway --force

# Méthode 2 : Utiliser un port différent
clawdbot gateway --port 19001

# Méthode 3 : Rechercher et tuer manuellement le processus
lsof -ti:18789 | xargs kill -9  # macOS / Linux
netstat -ano | findstr :18789               # Windows
```
### ❌ Erreur : Le reset du mode dev nécessite --dev

**Message d'erreur** :
```
Use --reset with --dev.
```

**Cause** : `--reset` ne peut être utilisé qu'en mode développement, pour éviter de supprimer par erreur des données de production

**Solution** :

```bash
# Commande correcte pour réinitialiser l'environnement de développement
clawdbot gateway --dev --reset
```

### ❌ Erreur : Le service est installé mais le mode premier plan est toujours utilisé

**Phénomène** : Exécuter `clawdbot gateway` affiche "Gateway already running locally"

**Cause** : Le démon s'exécute déjà en arrière-plan

**Solution** :

```bash
# Arrêter le service en arrière-plan
clawdbot gateway stop

# Ou redémarrer le service
clawdbot gateway restart

# Puis démarrer en premier plan (si nécessaire pour le débogage)
clawdbot gateway --port 19001  # Utiliser un port différent
```

## Résumé du cours

Dans ce cours, vous avez appris :

✅ **Méthodes de démarrage** : Mode premier plan vs Démon
✅ **Modes de liaison** : loopback / LAN / Tailnet / Auto
✅ **Méthodes d'authentification** : Token / Password / Identité Tailscale
✅ **Mode développement** : Configuration indépendante, rechargement à chaud, réinitialisation --reset
✅ **Dépannage** : Commandes `status` / `health` / `probe`
✅ **Gestion du service** : `install` / `start` / `stop` / `restart` / `uninstall`

**Référence rapide des commandes clés** :

| Scénario | Commande |
|--- | ---|
| Usage quotidien (service) | `clawdbot gateway install && clawdbot gateway start` |
| Débogage de développement | `clawdbot gateway --dev` |
| Test temporaire | `clawdbot gateway` |
| Libération forcée du port | `clawdbot gateway --force` |
| Accès réseau local | `clawdbot gateway --bind lan --token "xxx"` |
| Tailscale distant | `clawdbot gateway --tailscale serve` |
| Vérifier l'état | `clawdbot gateway status` |
| Contrôle de santé | `clawdbot gateway health` |

## Aperçu du cours suivant

> Dans le prochain cours, nous allons apprendre **[Envoyer le premier message](../first-message/)**.
>
> Vous apprendrez :
> - Envoyer le premier message via WebChat
> - Dialoguer avec l'assistant IA via les canaux configurés (WhatsApp/Telegram, etc.)
> - Comprendre le routage des messages et le flux de réponse

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Point d'entrée de démarrage du Gateway | [`src/cli/gateway-cli/run.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/run.ts) | 55-310 |
| Abstraction du service de démon | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | 66-155 |
| Démarrage du serveur de la barre latérale | [`src/gateway/server-startup.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup.ts) | 26-160 |
| Implémentation du serveur Gateway | [`src/gateway/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server.ts) | 1-500 |
| Analyse des arguments du programme | [`src/daemon/program-args.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/program-args.ts) | 1-250 |
| Sortie des journaux de démarrage | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 7-40 |
| Configuration du mode développement | [`src/cli/gateway-cli/dev.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/dev.ts) | 1-100 |
| Logique de libération de port | [`src/cli/ports.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/ports.ts) | 1-80 |

**Constantes clés** :
- Port par défaut : `18789` (source : `src/gateway/server.ts`)
- Liaison par défaut : `loopback` (source : `src/cli/gateway-cli/run.ts:175`)
- Chemin de configuration du mode développement : `~/.clawdbot-dev/` (source : `src/cli/gateway-cli/dev.ts`)

**Fonctions clés** :
- `runGatewayCommand()` : Point d'entrée principal du CLI Gateway, traite les arguments de ligne de commande et la logique de démarrage
- `startGatewayServer()` : Démarre le serveur WebSocket, écoute sur le port spécifié
- `forceFreePortAndWait()` : Libère par force le port et attend
- `resolveGatewayService()` : Renvoie l'implémentation du démon correspondante selon la plateforme (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- `logGatewayStartup()` : Affiche les informations de démarrage du Gateway (modèle, adresse d'écoute, fichier de journal)

</details>
