---
title: "Referência completa de configuração do Clawdbot: Explicação detalhada de todos os elementos de configuração | Tutorial de configuração"
sidebarTitle: "Controlar toda a configuração"
subtitle: "Referência completa de configuração"
description: "Aprenda o sistema completo de configuração do Clawdbot. Este documento de referência explica em detalhes todas as seções de configuração, tipos de campos, valores padrão e exemplos práticos para ajudá-lo a personalizar e otimizar o comportamento do Clawdbot. Inclui configuração de autenticação, configuração de modelos, opções de canais, estratégias de ferramentas, isolamento de sandbox, gerenciamento de sessões, processamento de mensagens, tarefas Cron, Hooks, Gateway, Tailscale, Skills, Plugins, Node Host, Canvas, Talk, broadcast, registro, atualizações, UI e mais de 50 seções principais de configuração, cobrindo todas as opções de básico a avançado. Adequado para consultar rapidamente todos os elementos de configuração disponíveis, localizar as configurações necessárias, melhorar a eficiência de uso e realizar uma configuração personalizada. Compreenda o papel e o impacto de cada elemento de configuração, encontre rapidamente as opções necessárias e evite erros de configuração. Tanto iniciantes quanto usuários avançados podem encontrar rapidamente os elementos de configuração necessários, melhorar a eficiência do trabalho e resolver problemas de configuração. O documento de referência de configuração ajuda você a entender e dominar completamente o sistema de configuração do Clawdbot para realizar uma personalização personalizada. Adequado para consulta, depuração e configuração avançada. Recomenda-se a todos os usuários ler esta referência de configuração para entender o significado e o uso de cada elemento de configuração e aproveitar ao máximo as poderosas funcionalidades do Clawdbot."
tags:
  - "Configuração"
  - "Referência"
  - "Guia completo"
order: 340
---



# Référence complète de configuration

Clawdbot lit un fichier de configuration JSON5 optionnel (supporte les commentaires et les virgules finales) : `~/.clawdbot/clawdbot.json`

Si le fichier de configuration est manquant, Clawdbot utilise des valeurs par défaut sécurisées (agent Pi intégré + session par expéditeur + espace de travail `~/clawd`). En général, vous n'avez besoin de configurer que pour :
- Restreindre qui peut déclencher le bot (`channels.whatsapp.allowFrom`, `channels.telegram.allowFrom`, etc.)
- Contrôler la liste blanche des groupes + le comportement de mention (`channels.whatsapp.groups`, `channels.telegram.groups`, `channels.discord.guilds`)
- Personnaliser les préfixes de messages (`messages`)
- Définir l'espace de travail du proxy (`agents.defaults.workspace` ou `agents.list[].workspace`)
- Ajuster les valeurs par défaut de l'agent intégré (`agents.defaults`) et le comportement de session (`session`)
- Définir l'identité de chaque agent (`agents.list[].identity`)

::: tip Débutant ?
Si c'est votre première configuration, nous vous recommandons de lire d'abord les tutoriels de [Démarrage rapide](../../start/getting-started/) et de [Assistant de configuration](../../start/onboarding-wizard/).

## Mécanisme de validation de la configuration

Clawdbot n'accepte que les configurations qui correspondent entièrement au Schema. Les clés inconnues, les types incorrects ou les valeurs invalides feront en sorte que le Gateway **refusera de démarrer** pour garantir la sécurité.

Lorsque la validation échoue :
- Le Gateway ne démarrera pas
- Seuls les commandes de diagnostic sont autorisées (par exemple : `clawdbot doctor`, `clawdbot logs`, `clawdbot health`, `clawdbot status`, `clawdbot service`, `clawdbot help`)
- Exécutez `clawdbot doctor` pour voir le problème exact
- Exécutez `clawdbot doctor --fix` (ou `--yes`) pour appliquer les migrations/réparations

::: warning Avertissement
Doctor n'écrira aucun changement à moins que vous ne sélectionniez explicitement `--fix`/`--yes`.

## Structure du fichier de configuration

Le fichier de configuration de Clawdbot est un objet hiérarchique contenant les sections de configuration principales suivantes :

```json5
{
  // Configuration centrale
  meta: {},
  env: {},
  wizard: {},
  diagnostics: {},
  logging: {},
  update: {},
  
  // Configuration des fonctionnalités
  browser: {},
  ui: {},
  auth: {},
  models: {},
  nodeHost: {},
  agents: {},
  tools: {},
  bindings: {},
  broadcast: {},
  audio: {},
  media: {},
  messages: {},
  commands: {},
  approvals: {},
  session: {},
  cron: {},
  hooks: {},
  web: {},
  channels: {},
  discovery: {},
  canvasHost: {},
  talk: {},
  gateway: {},
  skills: {},
  plugins: {}
}
```

## Configuration centrale

### `meta`

Métadonnées du fichier de configuration (écrit automatiquement par l'assistant CLI).

```json5
{
  meta: {
    lastTouchedVersion: "2026.1.24",
    lastTouchedAt: "2026-01-27T00:00:00.000Z"
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `lastTouchedVersion` | string | - | Version de Clawdbot qui a modifié cette configuration pour la dernière fois |
| `lastTouchedAt` | string | - | Heure de la dernière modification de cette configuration (ISO 8601) |

### `env`

Configuration des variables d'environnement et importation de l'environnement du shell.

```json5
{
  env: {
    shellEnv: {
      enabled: true,
      timeoutMs: 15000
    },
    vars: {
      OPENAI_API_KEY: "sk-...",
      ANTHROPIC_API_KEY: "sk-ant-..."
    },
    // Paires clé-valeur arbitraires
    CUSTOM_VAR: "value"
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `shellEnv.enabled` | boolean | `false` | Importer les variables d'environnement depuis le shell de connexion (n'importe que les clés manquantes) |
| `shellEnv.timeoutMs` | number | `15000` | Délai d'attente d'importation de l'environnement du shell (millisecondes) |
| `vars` | object | - | Variables d'environnement en ligne (paires clé-valeur) |

**Remarque** : `vars` ne s'applique que lorsque la clé correspondante est manquante dans les variables d'environnement du processus. Cela n'écrase jamais les variables d'environnement existantes.

::: info Priorité des variables d'environnement
Variables d'environnement du processus > fichier `.env` > `~/.clawdbot/.env` > `env.vars` dans le fichier de configuration

### `wizard`

Métadonnées écrites par l'assistant CLI (`onboard`, `configure`, `doctor`).

```json5
{
  wizard: {
    lastRunAt: "2026-01-01T00:00:00.000Z",
    lastRunVersion: "2026.1.4",
    lastRunCommit: "abc1234",
    lastRunCommand: "configure",
    lastRunMode: "local"
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `lastRunAt` | string | - | Heure de la dernière exécution de l'assistant |
| `lastRunVersion` | string | - | Version de Clawdbot lors de la dernière exécution de l'assistant |
| `lastRunCommit` | string | - | Hash du commit Git lors de la dernière exécution de l'assistant |
| `lastRunCommand` | string | - | Dernière commande d'assistant exécutée |
| `lastRunMode` | string | - | Mode d'exécution de l'assistant (`local` \| `remote`) |

### `diagnostics`

Configuration de la télémétrie de diagnostic et d'OpenTelemetry.

```json5
{
  diagnostics: {
    enabled: true,
    flags: ["debug-mode", "verbose-tool-calls"],
    otel: {
      enabled: false,
      endpoint: "https://otel.example.com",
      protocol: "http/protobuf",
      headers: {
        "X-Custom-Header": "value"
      },
      serviceName: "clawdbot",
      traces: true,
      metrics: true,
      logs: false,
      sampleRate: 0.1,
      flushIntervalMs: 5000
    },
    cacheTrace: {
      enabled: false,
      filePath: "/tmp/clawdbot/trace-cache.json",
      includeMessages: true,
      includePrompt: true,
      includeSystem: false
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | `false` | Activer les fonctionnalités de diagnostic |
| `flags` | string[] | - | Liste des indicateurs de diagnostic |
| `otel.enabled` | boolean | `false` | Activer la télémétrie OpenTelemetry |
| `otel.endpoint` | string | - | Point de terminaison du collecteur OTEL |
| `otel.protocol` | string | - | Protocole OTEL (`http/protobuf` \| `grpc`) |
| `otel.headers` | object | - | En-têtes de requête OTEL |
| `otel.serviceName` | string | - | Nom du service OTEL |
| `otel.traces` | boolean | - | Collecter les données de trace |
| `otel.metrics` | boolean | - | Collecter les données de métriques |
| `otel.logs` | boolean | - | Collecter les données de journal |
| `otel.sampleRate` | number | - | Taux d'échantillonnage (0-1) |
| `otel.flushIntervalMs` | number | - | Intervalle de vidage (millisecondes) |
| `cacheTrace.enabled` | boolean | `false` | Activer le cache de trace |
| `cacheTrace.filePath` | string | - | Chemin du fichier de cache de trace |
| `cacheTrace.includeMessages` | boolean | - | Inclure les messages dans le cache |
| `cacheTrace.includePrompt` | boolean | - | Inclure les invites dans le cache |
| `cacheTrace.includeSystem` | boolean | - | Inclure les invites système dans le cache |

### `logging`

Configuration de la journalisation.

```json5
{
  logging: {
    level: "info",
    file: "/tmp/clawdbot/clawdbot.log",
    consoleLevel: "info",
    consoleStyle: "pretty",
    redactSensitive: "tools",
    redactPatterns: [
      "\\bTOKEN\\b\\s*[=:]\\s*([\"']?)([^\\s\"']+)\\1",
      "/\\bsk-[A-Za-z0-9_-]{8,}\\b/gi"
    ]
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `level` | string | `info` | Niveau de journal (`silent` \| `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace`) |
| `file` | string | - | Chemin du fichier de journal (par défaut : `/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`) |
| `consoleLevel` | string | `info` | Niveau de journal de console (même que l'option `level`) |
| `consoleStyle` | string | `pretty` | Style de sortie de console (`pretty` \| `compact` \| `json`) |
| `redactSensitive` | string | `tools` | Mode de rédaction d'informations sensibles (`off` \| `tools`) |
| `redactPatterns` | string[] | - | Modèles de rédaction regex personnalisés (remplace les valeurs par défaut) |

::: tip Chemin du fichier de journal
Si vous souhaitez un chemin de fichier de journal stable, définissez `logging.file` sur `/tmp/clawdbot/clawdbot.log` (au lieu du chemin de rotation quotidienne par défaut).

### `update`

Configuration du canal de mise à jour et de la vérification automatique.

```json5
{
  update: {
    channel: "stable",
    checkOnStart: true
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `channel` | string | `stable` | Canal de mise à jour (`stable` \| `beta` \| `dev`) |
| `checkOnStart` | boolean | - | Vérifier les mises à jour au démarrage |

### `browser`

Configuration de l'automatisation du navigateur (basée sur Playwright).

```json5
{
  browser: {
    enabled: true,
    controlUrl: "ws://localhost:9222",
    controlToken: "secret-token",
    cdpUrl: "http://localhost:9222",
    remoteCdpTimeoutMs: 10000,
    remoteCdpHandshakeTimeoutMs: 5000,
    color: "#3b82f6",
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    noSandbox: false,
    attachOnly: false,
    defaultProfile: "default",
    snapshotDefaults: {
      mode: "efficient"
    },
    profiles: {
      "profile-1": {
        cdpPort: 9222,
        cdpUrl: "http://localhost:9222",
        driver: "clawd",
        color: "#ff0000"
      }
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | - | Activer l'outil du navigateur |
| `controlUrl` | string | - | URL WebSocket de contrôle du navigateur |
| `controlToken` | string | - | Jeton d'authentification de contrôle du navigateur |
| `cdpUrl` | string | - | URL du protocole Chrome DevTools |
| `remoteCdpTimeoutMs` | number | - | Délai d'attente CDP distant (millisecondes) |
| `remoteCdpHandshakeTimeoutMs` | number | - | Délai d'attente de handshake CDP distant (millisecondes) |
| `color` | string | - | Couleur hexadécimale affichée dans l'interface utilisateur |
| `executablePath` | string | - | Chemin du fichier exécutable du navigateur |
| `headless` | boolean | - | Mode sans tête |
| `noSandbox` | boolean | - | Désactiver le bac à sable (nécessaire sous Linux) |
| `attachOnly` | boolean | - | S'attacher uniquement à l'instance de navigateur existante |
| `defaultProfile` | string | - | ID de profil par défaut |
| `snapshotDefaults.mode` | string | - | Mode d'instantané (`efficient`) |
| `profiles` | object | - | Mappage des profils (clé : nom du profil, valeur : configuration) |

**Configuration du profil** :
- `cdpPort` : Port CDP (1-65535)
- `cdpUrl` : URL CDP
- `driver` : Type de pilote (`clawd` \| `extension`)
- `color` : Couleur hexadécimale du profil

::: warning Nommage du profil du navigateur
Les noms de profil ne doivent contenir que des lettres minuscules, des chiffres et des tirets : `^[a-z0-9-]+$`

### `ui`

Configuration de personnalisation de l'interface utilisateur (Contrôle UI, WebChat).

```json5
{
  ui: {
    seamColor: "#3b82f6",
    assistant: {
      name: "Clawdbot",
      avatar: "avatars/clawdbot.png"
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `seamColor` | string | - | Valeur hexadécimale de la couleur Seam |
| `assistant.name` | string | - | Nom d'affichage de l'assistant (maximum 50 caractères) |
| `assistant.avatar` | string | - | Chemin ou URL de l'avatar de l'assistant (maximum 200 caractères) |

**Prise en charge des avatars** :
- Chemin relatif à l'espace de travail (doit être dans l'espace de travail de l'agent)
- URL `http(s)`
- URI `data:`

## Configuration de l'authentification

### `auth`

Métadonnées du profil d'authentification (ne stocke pas de clés, mappe uniquement les profils aux fournisseurs et modes).

```json5
{
  auth: {
    profiles: {
      "anthropic:me@example.com": {
        provider: "anthropic",
        mode: "oauth",
        email: "me@example.com"
      },
      "anthropic:work": {
        provider: "anthropic",
        mode: "api_key"
      },
      "openai:default": {
        provider: "openai",
        mode: "api_key"
      }
    },
    order: {
      anthropic: ["anthropic:me@example.com", "anthropic:work"],
      openai: ["openai:default"]
    },
    cooldowns: {
      billingBackoffHours: 24,
      billingBackoffHoursByProvider: {
        anthropic: 48
      },
      billingMaxHours: 168,
      failureWindowHours: 1
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `profiles` | object | - | Mappage des profils (clé : ID de profil, valeur : configuration) |
| `profiles.<profileId>.provider` | string | - | Nom du fournisseur |
| `profiles.<profileId>.mode` | string | - | Mode d'authentification (`api_key` \| `oauth` \| `token`) |
| `profiles.<profileId>.email` | string | - | Courriel OAuth (optionnel) |
| `order` | object | - | Ordre de basculement du fournisseur |
| `cooldowns.billingBackoffHours` | number | - | Durée de temporisation des problèmes de facturation (heures) |
| `cooldowns.billingBackoffHoursByProvider` | object | - | Durée de temporisation de facturation par fournisseur |
| `cooldowns.billingMaxHours` | number | - | Durée maximale de temporisation de facturation (heures) |
| `cooldowns.failureWindowHours` | number | - | Durée de la fenêtre d'échec (heures) |

::: tip Synchronisation automatique de Claude Code CLI
Clawdbot synchronise automatiquement les jetons OAuth depuis Claude Code CLI vers `auth-profiles.json` (lorsqu'il existe sur l'hôte du Gateway) :
- macOS : Élément du trousseau "Claude Code-credentials" (sélectionnez "Toujours autoriser" pour éviter les invites launchd)
- Linux/Windows : `~/.claude/.credentials.json`

**Emplacements de stockage de l'authentification** :
- `<agentDir>/auth-profiles.json` (par défaut : `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`)
- Importation héritée : `~/.clawdbot/credentials/oauth.json`

**Cache d'exécution de l'agent intégré** :
- `<agentDir>/auth.json` (géré automatiquement ; ne pas modifier manuellement)

## Configuration des modèles

### `models`

Fournisseurs de modèles d'IA et configuration.

```json5
{
  models: {
    mode: "merge",
    providers: {
      "openai": {
        baseUrl: "https://api.openai.com/v1",
        apiKey: "${OPENAI_API_KEY}",
        auth: "api_key",
        api: "openai-completions",
        headers: {
          "X-Custom-Header": "value"
        },
        models: [
          {
            id: "gpt-4",
            name: "GPT-4",
            api: "openai-completions",
            reasoning: false,
            input: ["text"],
            cost: {
              input: 0.000005,
              output: 0.000015,
              cacheRead: 0.000001,
              cacheWrite: 0.000005
            },
            contextWindow: 128000,
            maxTokens: 4096,
            compat: {
              supportsStore: true,
              supportsDeveloperRole: true,
              supportsReasoningEffort: true,
              maxTokensField: "max_tokens"
            }
          }
        ]
      },
      "anthropic": {
        apiKey: "${ANTHROPIC_API_KEY}",
        auth: "oauth",
        api: "anthropic-messages",
        models: [
          {
            id: "claude-opus-4-5",
            name: "Claude Opus 4.5",
            api: "anthropic-messages",
            reasoning: true,
            input: ["text", "image"],
            contextWindow: 200000,
            maxTokens: 8192
          }
        ]
      },
      "ollama": {
        baseUrl: "http://localhost:11434",
        apiKey: "ollama"
      },
      "vercel-gateway": {
        apiKey: "${VERCEL_GATEWAY_API_KEY}"
      }
    },
    bedrockDiscovery: {
      enabled: false,
      region: "us-east-1",
      providerFilter: ["anthropic"],
      refreshInterval: 3600000,
      defaultContextWindow: 200000,
      defaultMaxTokens: 4096
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `mode` | string | - | Mode de fusion des modèles (`merge` \| `replace`) |
| `providers` | object | - | Mappage des fournisseurs (clé : ID du fournisseur, valeur : configuration du fournisseur) |
| `providers.<providerId>.baseUrl` | string | - | URL de base de l'API |
| `providers.<providerId>.apiKey` | string | - | Clé d'API (prend en charge le remplacement des variables d'environnement) |
| `providers.<providerId>.auth` | string | - | Type d'authentification (`api_key` \| `aws-sdk` \| `oauth` \| `token`) |
| `providers.<providerId>.api` | string | - | Type d'API (`openai-completions` \| `openai-responses` \| `anthropic-messages` \| `google-generative-ai` \| `github-copilot` \| `bedrock-converse-stream`) |
| `providers.<providerId>.authHeader` | boolean | - | Utiliser l'en-tête d'authentification |
| `providers.<providerId>.headers` | object | - | En-têtes HTTP personnalisés |
| `providers.<providerId>.models` | array | - | Liste des définitions de modèles |
| `bedrockDiscovery.enabled` | boolean | `false` | Activer la découverte de modèles AWS Bedrock |
| `bedrockDiscovery.region` | string | - | Région AWS |
| `bedrockDiscovery.providerFilter` | string[] | - | Filtre des fournisseurs Bedrock |
| `bedrockDiscovery.refreshInterval` | number | - | Intervalle d'actualisation (millisecondes) |
| `bedrockDiscovery.defaultContextWindow` | number | - | Fenêtre de contexte par défaut |
| `bedrockDiscovery.defaultMaxTokens` | number | - | Nombre maximal de tokens par défaut |

**Champs de définition du modèle** :
- `id` : ID du modèle (obligatoire)
- `name` : Nom d'affichage du modèle (obligatoire)
- `api` : Type d'API
- `reasoning` : Si c'est un modèle de raisonnement
- `input` : Types d'entrée pris en charge (`text` \| `image`)
- `cost.input` : Coût d'entrée
- `cost.output` : Coût de sortie
- `cost.cacheRead` : Coût de lecture du cache
- `cost.cacheWrite` : Coût d'écriture du cache
- `contextWindow` : Taille de la fenêtre de contexte
- `maxTokens` : Nombre maximal de tokens
- `compat` : Indicateurs de compatibilité

## Configuration des agents

### `agents`

Liste des agents et configuration par défaut.

```json5
{
  agents: {
    defaults: {
      workspace: "~/clawd",
      repoRoot: "~/Projects/clawdbot",
      skipBootstrap: false,
      bootstrapMaxChars: 20000,
      userTimezone: "America/Chicago",
      timeFormat: "auto",
      model: {
        primary: "anthropic/claude-opus-4-5",
        fallbacks: [
          "openai/gpt-4",
          "vercel-gateway/gpt-4"
        ]
      },
      identity: {
        name: "Clawdbot",
        theme: "helpful sloth",
        emoji: "🦞",
        avatar: "avatars/clawdbot.png"
      },
      groupChat: {
        mentionPatterns: ["@clawd", "clawdbot"]
      },
      sandbox: {
        mode: "off",
        scope: "session",
        workspaceAccess: "rw",
        workspaceRoot: "/tmp/clawdbot-sandbox",
        docker: {
          image: "clawdbot/agent:latest",
          network: "bridge",
          env: {
            "CUSTOM_VAR": "value"
          },
          setupCommand: "npm install",
          limits: {
            memory: "512m",
            cpu: "0.5"
          }
        },
        browser: {
          enabled: true
        },
        prune: {
          enabled: true,
          keepLastN: 3
        }
      },
      subagents: {
        allowAgents: ["*"]
      },
      tools: {
        profile: "full-access",
        allow: ["read", "write", "edit", "browser"],
        deny: ["exec"]
      },
      concurrency: {
        maxConcurrentSessions: 5,
        maxConcurrentToolCalls: 10
      },
      cli: {
        backend: {
          command: "clawdbot agent",
          args: ["--thinking", "high"],
          output: "json",
          resumeOutput: "json",
          input: "stdin",
          maxPromptArgChars: 10000,
          env: {},
          clearEnv: ["NODE_ENV"],
          modelArg: "--model",
          modelAliases: {
            "opus": "anthropic/claude-opus-4-5"
          },
          sessionArg: "--session",
          sessionArgs: ["--verbose"],
          resumeArgs: [],
          sessionMode: "existing",
          sessionIdFields: ["agent", "channel", "accountId", "peer"],
          systemPromptArg: "--system-prompt",
          systemPromptMode: "append",
          systemPromptWhen: "always",
          imageArg: "--image",
          imageMode: "repeat",
          serialize: false
        }
      }
    },
    list: [
      {
        id: "main",
        default: true,
        name: "Main Assistant",
        workspace: "~/clawd-main",
        agentDir: "~/.clawdbot/agents/main/agent",
        model: "anthropic/claude-opus-4-5",
        identity: {
          name: "Samantha",
          theme: "helpful sloth",
          emoji: "🦥",
          avatar: "avatars/samantha.png"
        },
        groupChat: {
          mentionPatterns: ["@samantha", "sam", "assistant"]
        },
        sandbox: {
          mode: "non-main"
        },
        subagents: {
          allowAgents: ["research", "writer"]
        },
        tools: {
          allow: ["read", "write", "browser"],
          deny: []
        }
      },
      {
        id: "work",
        workspace: "~/clawd-work",
        model: {
          primary: "openai/gpt-4",
          fallbacks: []
        }
      }
    ]
  }
}
```

**Configuration par défaut** (`agents.defaults`) :

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `workspace` | string | `~/clawd` | Répertoire de l'espace de travail de l'agent |
| `repoRoot` | string | - | Répertoire racine du dépôt Git (pour l'invite système) |
| `skipBootstrap` | boolean | `false` | Ignorer la création de fichiers d'amorçage de l'espace de travail |
| `bootstrapMaxChars` | number | `20000` | Nombre maximal de caractères par fichier d'amorçage |
| `userTimezone` | string | - | Fuseau horaire de l'utilisateur (contexte d'invite système) |
| `timeFormat` | string | `auto` | Format de l'heure (`auto` \| `12` \| `24`) |
| `model.primary` | string | - | Modèle principal (sous forme de chaîne : `provider/model`) |
| `model.fallbacks` | string[] | - | Liste des modèles de basculement |
| `identity.name` | string | - | Nom de l'agent |
| `identity.theme` | string | - | Thème de l'agent |
| `identity.emoji` | string | - | Emoji de l'agent |
| `identity.avatar` | string | - | Chemin ou URL de l'avatar de l'agent |
| `groupChat.mentionPatterns` | string[] | - | Modèles de mention de groupe (regex) |
| `groupChat.historyLimit` | number | - | Limite d'historique de groupe |
| `sandbox.mode` | string | - | Mode de bac à sable (`off` \| `non-main` \| `all`) |
| `sandbox.scope` | string | - | Portée du bac à sable (`session` \| `agent` \| `shared`) |
| `sandbox.workspaceAccess` | string | - | Autorisation d'accès à l'espace de travail (`none` \| `ro` \| `rw`) |
| `sandbox.workspaceRoot` | string | - | Répertoire racine de l'espace de travail de bac à sable personnalisé |
| `subagents.allowAgents` | string[] | - | IDs de sous-agents autorisés (`["*"]` = tous) |
| `tools.profile` | string | - | Profil d'outils (appliqué avant allow/deny) |
| `tools.allow` | string[] | - | Liste des outils autorisés |
| `tools.deny` | string[] | - | Liste des outils refusés (deny a priorité) |
| `concurrency.maxConcurrentSessions` | number | - | Nombre maximal de sessions simultanées |
| `concurrency.maxConcurrentToolCalls` | number | - | Nombre maximal d'appels d'outils simultanés |

**Liste des agents** (`agents.list`) :

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `id` | string | Obligatoire | ID de l'agent (identifiant stable) |
| `default` | boolean | `false` | Si c'est l'agent par défaut (le premier gagne s'il y en a plusieurs) |
| `name` | string | - | Nom d'affichage de l'agent |
| `workspace` | string | `~/clawd-<agentId>` | Espace de travail de l'agent (remplace la valeur par défaut) |
| `agentDir` | string | `~/.clawdbot/agents/<agentId>/agent` | Répertoire de l'agent |
| `model` | string/object | - | Configuration du modèle par agent |
| `identity` | object | - | Configuration d'identité par agent |
| `groupChat` | object | - | Configuration de chat de groupe par agent |
| `sandbox` | object | - | Configuration de bac à sable par agent |
| `subagents` | object | - | Configuration de sous-agents par agent |
| `tools` | object | - | Restrictions d'outils par agent |

::: tip Formulaire de configuration du modèle
Le champ `model` d'un agent peut adopter deux formes :
- **Forme de chaîne** : `"provider/model"` (ne remplace que `primary`)
- **Forme d'objet** : `{ primary, fallbacks }` (remplace `primary` et `fallbacks` ; `[]` désactive le basculement global pour cet agent)

## Configuration des liaisons

### `bindings`

Achemine les messages entrants vers des agents spécifiques.

```json5
{
  bindings: [
    {
      agentId: "main",
      match: {
        channel: "whatsapp",
        accountId: "personal",
        peer: {
          kind: "dm",
          id: "+15555550123"
        },
        guildId: "123456789012345678",
        teamId: "T12345"
      }
    },
    {
      agentId: "work",
      match: {
        channel: "whatsapp",
        accountId: "biz"
      }
    },
    {
      agentId: "main",
      match: {
        channel: "telegram"
      }
    }
  ]
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `agentId` | string | Obligatoire | ID de l'agent cible (doit être dans `agents.list`) |
| `match.channel` | string | Obligatoire | Canal correspondant |
| `match.accountId` | string | - | ID de compte correspondant (`*` = n'importe quel compte ; omis = compte par défaut) |
| `match.peer` | object | - | Pair correspondant (pair) |
| `match.peer.kind` | string | - | Type de pair (`dm` \| `group` \| `channel`) |
| `match.peer.id` | string | - | ID du pair |
| `match.guildId` | string | - | ID du serveur Discord |
| `match.teamId` | string | - | ID de l'équipe Slack/Microsoft Teams |

**Ordre de correspondance déterministe** :
1. `match.peer` (le plus spécifique)
2. `match.guildId`
3. `match.teamId`
4. `match.accountId` (exact, sans pair/guild/team)
5. `match.accountId: "*"` (portée du canal, sans pair/guild/team)
6. Agent par défaut (`agents.list[].default`, sinon premier élément de la liste, sinon `"main"`)

Dans chaque couche de correspondance, le premier élément correspondant dans `bindings` gagne.

## Configuration des outils

### `tools`

Exécution d'outils et politiques de sécurité.

```json5
{
  tools: {
    exec: {
      elevated: {
        enabled: false,
        allowFrom: {
          whatsapp: ["+15555550123"],
          telegram: ["tg:123456789"]
        }
      }
    },
    browser: {
      enabled: true
    },
    agentToAgent: {
      enabled: false,
      allow: ["main", "work"]
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `exec.elevated.enabled` | boolean | `false` | Activer bash élevé (`! <cmd>`) |
| `exec.elevated.allowFrom` | object | - | Liste des autorisations élevées par canal |
| `browser.enabled` | boolean | - | Activer l'outil du navigateur |
| `agentToAgent.enabled` | boolean | - | Activer la messagerie d'agent à agent |
| `agentToAgent.allow` | string[] | - | Liste des IDs d'agents autorisés |

## Configuration de diffusion

### `broadcast`

Envoie des messages à plusieurs canaux/agents.

```json5
{
  broadcast: {
    strategy: "parallel",
    "+15555550123": ["main", "work"],
    "120363403215116621@g.us": ["transcribe"],
    "strategy": "sequential"
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `strategy` | string | - | Stratégie de diffusion (`parallel` \| `sequential`) |
| `<peerId>` | string[] | - | Envoyer des messages à ces agents (clé dynamique) |

::: info Clés de diffusion
- Format de clé : `<peerId>` (par exemple : `+15555550123` ou `"120363403215116621@g.us"`)
- Valeur : tableau d'IDs d'agents
- Clé spéciale `"strategy"` : contrôle l'exécution parallèle vs séquentielle

## Configuration de l'audio

### `audio`

Configuration de l'audio et de la transcription.

```json5
{
  audio: {
    transcription: {
      enabled: true,
      provider: "whisper",
      model: "base"
    }
  }
}
```

::: info Détails des champs
Pour les champs de configuration de transcription complète, consultez `TranscribeAudioSchema` dans `zod-schema.core.ts`.

## Configuration des messages

### `messages`

Préfixes de messages, accusés de réception et comportement de la file d'attente.

```json5
{
  messages: {
    responsePrefix: "🦞",
    ackReaction: "👀",
    ackReactionScope: "group-mentions",
    removeAckAfterReply: false,
    queue: {
      mode: "collect",
      debounceMs: 1000,
      cap: 20,
      drop: "summarize",
      byChannel: {
        whatsapp: "collect",
        telegram: "collect",
        discord: "collect",
        imessage: "collect",
        webchat: "collect"
      }
    },
    inbound: {
      debounceMs: 2000,
      byChannel: {
        whatsapp: 5000,
        slack: 1500,
        discord: 1500
      }
    },
    groupChat: {
      historyLimit: 50
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `responsePrefix` | string | - | Préfixe pour toutes les réponses sortantes (prend en charge les variables de modèle) |
| `ackReaction` | string | - | Emoji pour confirmer les messages entrants |
| `ackReactionScope` | string | - | Quand envoyer la confirmation (`group-mentions` \| `group-all` \| `direct` \| `all`) |
| `removeAckAfterReply` | boolean | `false` | Supprimer la confirmation après l'envoi de la réponse |
| `queue.mode` | string | - | Mode de file d'attente (`steer` \| `followup` \| `collect` \| `steer-backlog` \| `queue` \| `interrupt`) |
| `queue.debounceMs` | number | - | Anti-rebond de file d'attente (millisecondes) |
| `queue.cap` | number | - | Limite supérieure de la file d'attente |
| `queue.drop` | string | - | Stratégie de suppression (`old` \| `new` \| `summarize`) |
| `queue.byChannel` | object | - | Mode de file d'attente par canal |
| `inbound.debounceMs` | number | - | Anti-rebond de messages entrants (millisecondes ; 0 désactive) |
| `inbound.byChannel` | object | - | Durée d'anti-rebond par canal |
| `groupChat.historyLimit` | number | - | Limite de contexte d'historique de groupe (0 désactive) |

**Variables de modèle** (pour `responsePrefix`) :

| Variable | Description | Exemple |
|--- | --- | ---|
| `{model}` | Nom court du modèle | `claude-opus-4-5`, `gpt-4` |
| `{modelFull}` | Identifiant complet du modèle | `anthropic/claude-opus-4-5` |
| `{provider}` | Nom du fournisseur | `anthropic`, `openai` |
| `{thinkingLevel}` | Niveau de raisonnement actuel | `high`, `low`, `off` |
| `{identity.name}` | Nom d'identité de l'agent | (identique au mode `"auto"`) |

::: tip Chat personnel de WhatsApp
Les réponses de chat personnel utilisent `[{identity.name}]` par défaut, sinon `[clawdbot]`, pour que les conversations du même nombre restent lisibles.

## Configuration des commandes

### `commands`

Configuration du traitement des commandes de chat.

```json5
{
  commands: {
    native: "auto",
    text: true,
    bash: false,
    bashForegroundMs: 2000,
    config: false,
    debug: false,
    restart: false,
    useAccessGroups: true
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `native` | string | `auto` | Commandes natives (`auto` \| `true` \| `false`) |
| `text` | boolean | `true` | Analyser les commandes de barre oblique dans les messages de chat |
| `bash` | boolean | `false` | Autoriser `!` (alias pour `/bash`) |
| `bashForegroundMs` | number | `2000` | Fenêtre de premier plan de bash (millisecondes) |
| `config` | boolean | `false` | Autoriser `/config` (écrit sur le disque) |
| `debug` | boolean | `false` | Autoriser `/debug` (remplacements d'exécution uniquement) |
| `restart` | boolean | `false` | Autoriser `/restart` + outil de redémarrage du Gateway |
| `useAccessGroups` | boolean | `true` | Appliquer la liste d'autorisation/stratégies de groupes d'accès pour les commandes |

::: warning commande bash
`commands.bash: true` active `! <cmd>` pour exécuter des commandes shell de l'hôte (`/bash <cmd>` fonctionne également comme alias). Nécessite `tools.elevated.enabled` et l'expéditeur dans la liste d'autorisation.

## Configuration de session

### `session`

Persistance et comportement de la session.

```json5
{
  session: {
    activation: {
      defaultMode: "auto",
      defaultDurationMs: 900000,
      keepAlive: true
    },
    compaction: {
      auto: true,
      threshold: 0.8,
      strategy: "summary"
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `activation.defaultMode` | string | `auto` | Mode d'activation par défaut (`auto` \| `always` \| `manual`) |
| `activation.defaultDurationMs` | number | - | Durée d'activation par défaut (millisecondes) |
| `activation.keepAlive` | boolean | - | Garder en vie |
| `compaction.auto` | boolean | `true` | Compactage automatique |
| `compaction.threshold` | number | - | Seuil de compactage (0-1) |
| `compaction.strategy` | string | - | Stratégie de compactage |

::: info Compactage de session
Se compacte automatiquement lorsque le contexte déborde, puis échoue. Consultez `CHANGELOG.md:122`.

## Configuration de Cron

### `cron`

Planification des tâches programmées.

```json5
{
  cron: {
    enabled: true,
    store: "~/.clawdbot/cron.json",
    maxConcurrentRuns: 5
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | - | Activer le moteur Cron |
| `store` | string | - | Chemin du fichier de stockage Cron |
| `maxConcurrentRuns` | number | - | Nombre maximal d'exécutions simultanées |

## Configuration des Hooks

### `hooks`

Webhooks et transfert d'événements.

```json5
{
  hooks: {
    enabled: true,
    path: "~/.clawdbot/hooks",
    token: "webhook-secret-token",
    maxBodyBytes: 1048576,
    presets: ["slack-alerts", "discord-notifications"],
    transformsDir: "~/.clawdbot/hook-transforms",
    mappings: [
      {
        pattern: "^agent:.*$",
        target: "https://hooks.example.com/agent-events",
        headers: {
          "Authorization": "Bearer ${WEBHOOK_AUTH}"
        }
      }
    ],
    gmail: {
      enabled: false,
      credentialsPath: "~/.clawdbot/gmail-credentials.json",
      subscriptionIds: ["subscription-1", "subscription-2"]
    },
    internal: {
      onMessage: "log-message",
      onToolCall: "log-tool-call",
      onError: "log-error"
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | - | Activer les Hooks |
| `path` | string | - | Chemin du répertoire des Hooks |
| `token` | string | - | Jeton d'authentification Webhook |
| `maxBodyBytes` | number | - | Taille maximale du corps de la requête (octets) |
| `presets` | string[] | - | Liste des Hooks prédéfinis |
| `transformsDir` | string | - | Répertoire des scripts de transformation des Hooks |
| `mappings` | array | - | Mappages de Hooks personnalisés |
| `gmail.enabled` | boolean | - | Activer Gmail Pub/Sub |
| `gmail.credentialsPath` | string | - | Chemin des identifiants Gmail |
| `gmail.subscriptionIds` | string[] | - | Liste des IDs d'abonnement Gmail |
| `internal.onMessage` | string | - | Hook interne de message |
| `internal.onToolCall` | string | - | Hook interne d'appel d'outil |
| `internal.onError` | string | - | Hook interne d'erreur |

## Configuration des canaux

### `channels`

Configuration d'intégration de messages multicanal.

```json5
{
  channels: {
    whatsapp: {
      enabled: true,
      botToken: "123456:ABC...",
      dmPolicy: "pairing",
      allowFrom: ["+15555550123"],
      groups: {
        "*": { requireMention: true },
        "-1001234567890": {
          allowFrom: ["@admin"],
          systemPrompt: "Keep answers brief.",
          topics: {
            "99": {
              requireMention: false,
              skills: ["search"],
              systemPrompt: "Stay on topic."
            }
          }
        }
      },
      sendReadReceipts: true,
      textChunkLimit: 4000,
      chunkMode: "length",
      mediaMaxMb: 50,
      historyLimit: 50,
      replyToMode: "first",
      accounts: {
        default: {},
        personal: {},
        biz: {
          authDir: "~/.clawdbot/credentials/whatsapp/biz"
        }
      }
    },
    telegram: {
      enabled: true,
      botToken: "123456:ABC...",
      dmPolicy: "pairing",
      allowFrom: ["tg:123456789"],
      groups: {
        "*": { requireMention: true }
      },
      customCommands: [
        { command: "backup", description: "Git backup" },
        { command: "generate", description: "Create an image" }
      ],
      historyLimit: 50,
      replyToMode: "first",
      linkPreview: true,
      streamMode: "partial",
      draftChunk: {
        minChars: 200,
        maxChars: 800,
        breakPreference: "paragraph"
      }
    },
    discord: {
      enabled: true,
      token: "your-bot-token",
      mediaMaxMb: 8,
      allowBots: false,
      actions: {
        reactions: true,
        messages: true,
        threads: true,
        pins: true
      },
      guilds: {
        "123456789012345678": {
          requireMention: false,
          users: ["987654321098765432"],
          channels: {
            general: { allow: true },
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"]
            }
          }
        }
      },
      historyLimit: 20,
      dm: {
        enabled: true,
        policy: "pairing",
        allowFrom: ["1234567890", "username"],
        groupEnabled: false,
        groupChannels: ["clawd-dm"]
      }
    },
    slack: {
      enabled: true,
      botToken: "xoxb-...",
      appToken: "xapp-...",
      channels: {
        "#general": { allow: true, requireMention: true }
      },
      historyLimit: 50,
      allowBots: false,
      reactionNotifications: "own",
      slashCommand: {
        enabled: true,
        name: "clawd",
        sessionPrefix: "slack:slash",
        ephemeral: true
      }
    },
    signal: {
      reactionNotifications: "own",
      reactionAllowlist: ["+15551234567"],
      historyLimit: 50
    },
    imessage: {
      enabled: true,
      cliPath: "imsg",
      dbPath: "~/Library/Messages/chat.db",
      dmPolicy: "pairing",
      allowFrom: ["+15555550123"],
      historyLimit: 50,
      includeAttachments: false,
      mediaMaxMb: 16
    }
  }
}
```

::: tip Documentation spécifique au canal
Chaque canal a des options de configuration détaillées. Consultez :
- [Canal WhatsApp](../../platforms/whatsapp/)
- [Canal Telegram](../../platforms/telegram/)
- [Canal Slack](../../platforms/slack/)
- [Canal Discord](../../platforms/discord/)
- [Canal Google Chat](../../platforms/googlechat/)
- [Canal Signal](../../platforms/signal/)
- [Canal iMessage](../../platforms/imessage/)

**Champs communs du canal** :
- `enabled` : Activer le canal
- `dmPolicy` : Stratégie DM (`pairing` \| `allowlist` \| `open` \| `disabled`)
- `allowFrom` : Liste d'autorisation DM (les expéditeurs inconnus reçoivent un code de jumelage en mode `pairing`)
- `groupPolicy` : Stratégie de groupe (`open` \| `disabled` \| `allowlist`)
- `historyLimit` : Limite de contexte d'historique (0 désactive)

## Configuration du Gateway

### `gateway`

Serveur WebSocket du Gateway et authentification.

```json5
{
  gateway: {
    port: 18789,
    mode: "local",
    bind: "loopback",
    controlUi: {
      enabled: true,
      basePath: "/",
      allowInsecureAuth: false,
      dangerouslyDisableDeviceAuth: false
    },
    auth: {
      mode: "token",
      token: "secret-gateway-token",
      password: "gateway-password",
      allowTailscale: false
    },
    trustedProxies: ["127.0.0.1", "10.0.0.0/8"],
    tailscale: {
      mode: "off",
      resetOnExit: false
    },
    remote: {
      url: "ws://gateway.example.com:18789",
      transport: "ssh",
      token: "remote-token",
      password: "remote-password",
      tlsFingerprint: "SHA256:...",
      sshTarget: "user@gateway-host",
      sshIdentity: "~/.ssh/id_ed25519"
    },
    reload: {
      mode: "hot",
      debounceMs: 1000
    },
    tls: {
      enabled: false,
      autoGenerate: true,
      certPath: "/path/to/cert.pem",
      keyPath: "/path/to/key.pem",
      caPath: "/path/to/ca.pem"
    },
    http: {
      endpoints: {
        chatCompletions: {
          enabled: true
        },
        responses: {
          enabled: true,
          maxBodyBytes: 10485760,
          files: {
            allowUrl: true,
            allowedMimes: ["text/*", "application/pdf"],
            maxBytes: 10485760,
            maxChars: 100000,
            maxRedirects: 10,
            timeoutMs: 30000,
            pdf: {
              maxPages: 50,
              maxPixels: 67108864,
              minTextChars: 0
            }
          },
          images: {
            allowUrl: true,
            allowedMimes: ["image/*"],
            maxBytes: 10485760,
            maxRedirects: 5,
            timeoutMs: 30000
          }
        }
      }
    },
    nodes: {
      browser: {
        mode: "auto",
        node: "macos-1"
      },
      allowCommands: [],
      denyCommands: ["rm -rf", ":(){ :|:& };:"]
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `port` | number | `18789` | Port WebSocket du Gateway |
| `mode` | string | `local` | Mode du Gateway (`local` \| `remote`) |
| `bind` | string | - | Adresse de liaison (`auto` \| `lan` \| `loopback` \| `custom` \| `tailnet`) |
| `controlUi.enabled` | boolean | - | Activer l'interface utilisateur de contrôle |
| `controlUi.basePath` | string | - | Chemin de base de l'interface utilisateur |
| `controlUi.allowInsecureAuth` | boolean | - | Autoriser l'authentification non sécurisée |
| `auth.mode` | string | - | Mode d'authentification (`token` \| `password`) |
| `auth.token` | string | - | Jeton d'authentification |
| `auth.password` | string | - | Mot de passe d'authentification |
| `auth.allowTailscale` | boolean | - | Autoriser l'authentification Tailscale |
| `tailscale.mode` | string | `off` | Mode Tailscale (`off` \| `serve` \| `funnel`) |
| `tailscale.resetOnExit` | boolean | - | Réinitialiser Serve/Funnel à la sortie |
| `remote.url` | string | - | URL du Gateway distant |
| `remote.transport` | string | - | Transport distant (`ssh` \| `direct`) |
| `remote.token` | string | - | Jeton distant |
| `remote.password` | string | - | Mot de passe distant |
| `remote.tlsFingerprint` | string | - | Empreinte TLS distante |
| `remote.sshTarget` | string | - | Cible SSH |
| `remote.sshIdentity` | string | - | Chemin du fichier d'identité SSH |
| `reload.mode` | string | - | Mode de rechargement (`off` \| `restart` \| `hot` \| `hybrid`) |
| `reload.debounceMs` | number | - | Anti-rebond de rechargement (millisecondes) |
| `tls.enabled` | boolean | - | Activer TLS |
| `tls.autoGenerate` | boolean | - | Générer automatiquement les certificats |
| `nodes.browser.mode` | string | - | Mode du nœud du navigateur (`auto` \| `manual` \| `off`) |
| `nodes.allowCommands` | string[] | - | Commandes de nœud autorisées |
| `nodes.denyCommands` | string[] | - | Commandes de nœud refusées |

::: warning Restriction de liaison Tailscale
Lors de l'activation de Serve/Funnel, `gateway.bind` doit rester `loopback` (Clawdbot applique cette règle).

## Configuration des compétences

### `skills`

Plateforme de compétences et installation.

```json5
{
  skills: {
    allowBundled: ["bird", "sherpa-onnx-tts"],
    load: {
      extraDirs: ["~/custom-skills"],
      watch: true,
      watchDebounceMs: 500
    },
    install: {
      preferBrew: false,
      nodeManager: "pnpm"
    },
    entries: {
      "search": {
        enabled: true,
        apiKey: "${SEARCH_API_KEY}",
        env: {
          "SEARCH_ENGINE": "google"
        },
        config: {
          "maxResults": 10
        }
      }
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `allowBundled` | string[] | - | Liste des compétences intégrées autorisées |
| `load.extraDirs` | string[] | - | Répertoires de compétences supplémentaires |
| `load.watch` | boolean | - | Surveiller les changements de fichiers de compétences |
| `load.watchDebounceMs` | number | - | Anti-rebond de surveillance (millisecondes) |
| `install.preferBrew` | boolean | - | Préférer l'installation Homebrew |
| `install.nodeManager` | string | - | Gestionnaire de nœuds (`npm` \| `pnpm` \| `yarn` \| `bun`) |
| `entries.<skillId>.enabled` | boolean | - | Activer la compétence |
| `entries.<skillId>.apiKey` | string | - | Clé API de la compétence |
| `entries.<skillId>.env` | object | - | Variables d'environnement de la compétence |
| `entries.<skillId>.config` | object | - | Configuration de la compétence |

## Configuration des plugins

### `plugins`

Configuration du système de plugins.

```json5
{
  plugins: {
    enabled: true,
    allow: ["whatsapp", "telegram", "discord"],
    deny: [],
    load: {
      paths: ["~/.clawdbot/plugins", "./custom-plugins"]
    },
    slots: {
      memory: "custom-memory-provider"
    }
  }
}
```

| Champ | Type | Obligatoire | Par défaut | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | - | Activer le système de plugins |
| `allow` | string[] | - | Liste des plugins autorisés |
| `deny` | string[] | - | Liste des plugins refusés |
| `load.paths` | string[] | - | Chemins de chargement des plugins |
| `slots.memory` | string | - | Fournisseur de mémoire personnalisé |

## Inclusions de configuration (`$include`)

Utilisez la directive `$include` pour diviser la configuration en plusieurs fichiers.

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: { port: 18789 },
  
  // Inclure un seul fichier (remplace la valeur de la clé d'inclusion)
  agents: { "$include": "./agents.json5" },
  
  // Inclure plusieurs fichiers (fusion profonde dans l'ordre)
  broadcast: { 
    "$include": [
      "./clients/mueller.json5",
      "./clients/schmidt.json5"
    ]
  }
}
```

```json5
// ~/.clawdbot/agents.json5
{
  defaults: { sandbox: { mode: "all", scope: "session" } },
  list: [
    { id: "main", workspace: "~/clawd" }
  ]
}
```

**Comportement de fusion** :
- **Fichier unique** : Remplace l'objet contenant `$include`
- **Tableau de fichiers** : Fusionne profondément les fichiers dans l'ordre (les fichiers ultérieurs écrasent les précédents)
- **Clés sœurs** : Fusionne les clés sœurs après inclusion (écrase les valeurs incluses)
- **Clés sœurs + tableau/type de base** : Non pris en charge (le contenu inclus doit être un objet)

**Résolution des chemins** :
- **Chemins relatifs** : Résolus par rapport au fichier inclus
- **Chemins absolus** : Utilisés tels quels
- **Répertoire parent** : Les références `../` fonctionnent comme prévu

**Inclusions imbriquées** :
Les fichiers inclus peuvent contenir des directives `$include` (jusqu'à 10 niveaux de profondeur).

## Remplacement des variables d'environnement

Vous pouvez faire référence directement aux variables d'environnement dans n'importe quelle valeur de chaîne de configuration en utilisant la syntaxe `${VAR_NAME}`. Les variables sont remplacées lors du chargement de la configuration, avant la validation.

```json5
{
  models: {
    providers: {
      "vercel-gateway": {
        apiKey: "${VERCEL_GATEWAY_API_KEY}"
      }
    }
  },
  gateway: {
    auth: {
      token: "${CLAWDBOT_GATEWAY_TOKEN}"
    }
  }
}
```

**Règles** :
- Ne correspond qu'aux noms de variables d'environnement en majuscules : `[A-Z_][A-Z0-9_]*`
- Les variables d'environnement manquantes ou vides lancent une erreur lors du chargement de la configuration
- Utilisez `$${VAR}` pour échapper et produire le littéral `${VAR}`
- S'applique à `$include` (les fichiers inclus obtiennent également le remplacement)

::: warning Variables manquantes
Les variables d'environnement manquantes ou vides lanceront une erreur lors du chargement de la configuration.

## Validation et diagnostic de la configuration

Lorsque la validation de la configuration échoue, utilisez `clawdbot doctor` pour voir le problème exact.

```bash
## Diagnostiquer la configuration
clawdbot doctor

## Réparer automatiquement les problèmes (nécessite une confirmation manuelle)
clawdbot doctor --fix

## Réparer automatiquement (ignorer la confirmation)
clawdbot doctor --yes
```

**Fonctions de diagnostic** :
- Détecter les clés de configuration inconnues
- Valider les types de données
- Détecter les champs obligatoires manquants
- Appliquer les migrations de configuration
- Détecter les stratégies DM non sécurisées
- Valider la configuration des canaux

## Chemins des fichiers de configuration

| Fichier | Chemin | Description |
|--- | --- | ---|
| Configuration principale | `~/.clawdbot/clawdbot.json` | Fichier de configuration principal |
| Variables d'environnement | `~/.clawdbot/.env` | Variables d'environnement globales |
| Environnement de l'espace de travail | `~/clawd/.env` | Variables d'environnement de l'espace de travail |
| Profils d'authentification | `<agentDir>/auth-profiles.json` | Profils d'authentification |
| Cache d'exécution | `<agentDir>/auth.json` | Cache d'exécution de l'agent intégré |
| OAuth hérité | `~/.clawdbot/credentials/oauth.json` | Importation OAuth héritée |
| Stockage Cron | `~/.clawdbot/cron.json` | Stockage des tâches Cron |
| Chemins des Hooks | `~/.clawdbot/hooks` | Répertoire des Hooks |

---

## Résumé de cette leçon

Ce tutoriel explique en détail le système complet de configuration de Clawdbot :

- ✅ Structure du fichier de configuration et mécanisme de validation
- ✅ Toutes les sections de configuration principales (authentification, agents, canaux, sessions, outils, Cron, Hooks, etc.)
- ✅ Remplacement des variables d'environnement et priorité de configuration
- ✅ Exemples courants de configuration et meilleures pratiques
- ✅ Chemins des fichiers de configuration et emplacements de stockage

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons sur le **[Protocole d'API WebSocket du Gateway](./api-protocol/)**.
>
> Vous apprendrez :
> - Handshake de connexion WebSocket et authentification
> - Format des trames de message (requête, réponse, événement)
> - Référence des méthodes principales et exemples d'appels
> - Système de permissions et gestion des rôles
> - Gestion des erreurs et stratégies de nouvelle tentative

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-27

| Section de configuration | Chemin du fichier | Numéro de ligne |
|--- | --- | ---|
| Schema principal | [`src/config/zod-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.ts) | 1-556 |
| Schema central | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts) | 1-300 |
| Schema des agents | [`src/config/zod-schema.agents.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.agents.ts) | 1-54 |
| Schema des canaux | [`src/config/zod-schema.channels.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.channels.ts) | 1-11 |
| Schema de session | [`src/config/zod-schema.session.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.session.ts) | - |
| Schema des outils | [`src/config/zod-schema.agent-runtime.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.agent-runtime.ts) | - |
| Schema des Hooks | [`src/config/zod-schema.hooks.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.hooks.ts) | - |
| Schema des fournisseurs | [`src/config/zod-schema.providers.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.providers.ts) | - |
| Documentation de configuration | [`docs/gateway/configuration.md`](https://github.com/moltbot/moltbot/blob/main/docs/gateway/configuration.md) | - |

**Constantes clés** :
- Port par défaut : `18789` (`gateway.server-startup-log.ts`)
- Espace de travail par défaut : `~/clawd`
- Liaison par défaut du Gateway : `loopback` (127.0.0.1)

**Fonctions clés** :
- `ClawdbotSchema` : Définition du Schema de configuration principal
- `normalizeAllowFrom()` : Normalise les valeurs de la liste d'autorisation
- `requireOpenAllowFrom()` : Valide la liste d'autorisation en mode ouvert
</details>
