---
title: "Guide complet des modèles IA et de la configuration d'authentification : plusieurs fournisseurs, méthodes d'authentification et dépannage | Tutoriels Clawdbot"
sidebarTitle: "Configurer votre compte IA"
subtitle: "Modèles IA et configuration d'authentification"
description: "Apprenez à configurer les fournisseurs de modèles IA (Anthropic, OpenAI, OpenRouter, Ollama, etc.) et les trois méthodes d'authentification (API Key, OAuth, Token) pour Clawdbot. Ce tutoriel couvre la gestion des fichiers d'authentification, la rotation multi-comptes, l'actualisation automatique des tokens OAuth, la configuration des alias de modèles, le basculement en cas d'erreur et le dépannage des erreurs courantes, incluant des exemples de configuration réels et des commandes CLI pour vous aider à démarrer rapidement."
tags:
  - "advanced"
  - "configuration"
  - "authentication"
  - "models"
prerequisite:
  - "start-getting-started"
order: 190
---

# Modèles IA et configuration d'authentification

## Ce que vous pourrez faire après ce cours

- Configurer plusieurs fournisseurs de modèles IA (Anthropic, OpenAI, OpenRouter, etc.)
- Utiliser trois méthodes d'authentification (API Key, OAuth, Token)
- Gérer l'authentification multi-comptes et la rotation des identifiants
- Configurer la sélection de modèles et les modèles de secours
- Dépanner les problèmes d'authentification courants

## Votre situation actuelle

Clawdbot prend en charge des dizaines de fournisseurs de modèles, mais leur configuration peut être déroutante :

- Faut-il utiliser une API Key ou OAuth ?
- Quelles sont les différences entre les méthodes d'authentification des différents fournisseurs ?
- Comment configurer plusieurs comptes ?
- Comment les tokens OAuth sont-ils automatiquement actualisés ?

## Quand utiliser cette méthode

- Lors de la première installation pour configurer les modèles IA
- Lors de l'ajout d'un nouveau fournisseur de modèles ou d'un compte de secours
- En cas d'erreur d'authentification ou de limitation de quota
- Lors de la configuration du basculement de modèles et du mécanisme de secours

## 🎒 Préparatifs avant de commencer

::: warning Prérequis
Ce tutoriel suppose que vous avez terminé le [Démarrage rapide](../../start/getting-started/), installé et démarré le Gateway.
:::

- Assurez-vous que Node ≥22 est installé
- Le démon Gateway est en cours d'exécution
- Préparez les identifiants d'au moins un fournisseur de modèles IA (API Key ou compte d'abonnement)

## Concepts fondamentaux

### Séparation de la configuration des modèles et de l'authentification

Dans Clawdbot, la **sélection de modèles** et les **identifiants d'authentification** sont deux concepts distincts :

- **Configuration des modèles** : indique à Clawdbot quel modèle utiliser (par exemple, `anthropic/claude-opus-4-5`), stocké dans `~/.clawdbot/models.json`
- **Configuration de l'authentification** : fournit les identifiants pour accéder aux modèles (par exemple, API Key ou token OAuth), stocké dans `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`

::: info Pourquoi la séparation ?
Cette conception vous permet de basculer facilement entre plusieurs fournisseurs et comptes sans avoir à reconfigurer les paramètres des modèles.
:::

### Trois méthodes d'authentification

Clawdbot prend en charge trois méthodes d'authentification adaptées à différents scénarios :

| Méthode d'authentification | Format de stockage | Scénario typique | Fournisseurs pris en charge |
|--- | --- | --- | ---|
| **API Key** | `{ type: "api_key", key: "sk-..." }` | Démarrage rapide, tests | Anthropic, OpenAI, OpenRouter, DeepSeek, etc. |
| **OAuth** | `{ type: "oauth", access: "...", refresh: "..." }` | Exécution à long terme, actualisation automatique | Anthropic (Claude Code CLI), OpenAI (Codex), Qwen Portal |
| **Token** | `{ type: "token", token: "..." }` | Token Bearer statique | GitHub Copilot, certains proxies personnalisés |

### Fournisseurs de modèles pris en charge

Clawdbot prend en charge nativement les fournisseurs de modèles suivants :

::: details Liste des fournisseurs intégrés
| Fournisseur | Méthode d'authentification | Modèle recommandé | Remarques |
|--- | --- | --- | ---|
| **Anthropic** | API Key / OAuth (Claude Code CLI) | `anthropic/claude-opus-4-5` | Recommandé Claude Pro/Max + Opus 4.5 |
| **OpenAI** | API Key / OAuth (Codex) | `openai/gpt-5.2` | Prend en charge les versions standard OpenAI et Codex |
| **OpenRouter** | API Key | `openrouter/anthropic/claude-sonnet-4-5` | Agrège des centaines de modèles |
| **Ollama** | HTTP Endpoint | `ollama/<model>` | Modèles locaux, aucune API Key requise |
| **DeepSeek** | API Key | `deepseek/deepseek-r1` | Friendly en Chine |
| **Qwen Portal** | OAuth | `qwen-portal/<model>` | OAuth Qwen Portal |
| **Venice** | API Key | `venice/<model>` | Priorité à la confidentialité |
| **Bedrock** | AWS SDK | `amazon-bedrock/<model>` | Modèles hébergés par AWS |
| **Antigravity** | API Key | `google-antigravity/<model>` | Service de proxy de modèles |
:::

::: tip Combinaison recommandée
Pour la plupart des utilisateurs, nous recommandons de configurer **Anthropic Opus 4.5** comme modèle principal et **OpenAI GPT-5.2** comme modèle de secours. Opus offre de meilleures performances en termes de contexte long et de sécurité.
:::

## Suivez le guide

### Étape 1 : Configurer Anthropic (recommandé)

**Pourquoi**
Anthropic Claude est le modèle recommandé pour Clawdbot, en particulier Opus 4.5, qui offre d'excellentes performances en matière de traitement de contexte long et de sécurité.

**Option A : Utiliser une API Key Anthropic (le plus rapide)**

```bash
clawdbot onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

**Ce que vous devriez voir** :
- Gateway recharge la configuration
- Le modèle par défaut est défini sur `anthropic/claude-opus-4-5`
- Le fichier d'authentification `~/.clawdbot/agents/default/agent/auth-profiles.json` est créé

**Option B : Utiliser OAuth (recommandé pour une exécution à long terme)**

OAuth convient aux Gateway qui s'exécutent pendant une longue période, le token est automatiquement actualisé.

1. Générer un setup-token (nécessite l'exécution de Claude Code CLI sur n'importe quelle machine) :
```bash
claude setup-token
```

2. Copier le token en sortie

3. Exécuter sur l'hôte Gateway :
```bash
clawdbot models auth paste-token --provider anthropic
# Coller le token
```

**Ce que vous devriez voir** :
- Le message "Auth profile added: anthropic:claude-cli"
- Le type d'authentification est `oauth` (pas `api_key`)

::: tip Avantages d'OAuth
Les tokens OAuth sont automatiquement actualisés, aucune mise à jour manuelle n'est requise. Convient aux démons Gateway qui s'exécutent en continu.
:::

### Étape 2 : Configurer OpenAI comme modèle de secours

**Pourquoi**
La configuration d'un modèle de secours permet un basculement automatique lorsque le modèle principal (comme Anthropic) rencontre des limitations de quota ou des erreurs.

```bash
clawdbot onboard --openai-api-key "$OPENAI_API_KEY"
```

Ou utiliser OpenAI Codex OAuth :

```bash
clawdbot onboard --openai-codex
```

**Ce que vous devriez voir** :
- Une nouvelle configuration de fournisseur OpenAI dans `~/.clawdbot/clawdbot.json`
- Une nouvelle configuration `openai:default` ou `openai-codex:codex-cli` dans le fichier d'authentification

### Étape 3 : Configurer la sélection de modèles et le secours

**Pourquoi**
Configurer la stratégie de sélection de modèles, définir le modèle principal, les modèles de secours et les alias.

Modifier `~/.clawdbot/clawdbot.json` :

```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-5"
      fallbacks:
        - "openai/gpt-5.2"
        - "openai/gpt-5-mini"
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Explication des champs** :
- `primary` : modèle utilisé par défaut
- `fallbacks` : modèles de secours essayés dans l'ordre (basculement automatique en cas d'échec)
- `alias` : alias de modèle (par exemple, `/model opus` équivaut à `/model anthropic/claude-opus-4-5`)

**Ce que vous devriez voir** :
- Après avoir redémarré Gateway, le modèle principal devient Opus 4.5
- La configuration des modèles de secours prend effet

### Étape 4 : Ajouter OpenRouter (optionnel)

**Pourquoi**
OpenRouter agrège des centaines de modèles, idéal pour accéder à des modèles spéciaux ou gratuits.

```bash
clawdbot onboard --auth-choice openrouter-api-key --token "$OPENROUTER_API_KEY"
```

Puis configurer les modèles :

```yaml
agents:
  defaults:
    model:
      primary: "openrouter/anthropic/claude-sonnet-4-5"
```

**Ce que vous devriez voir** :
- Le format de référence du modèle est `openrouter/<provider>/<model>`
- Vous pouvez utiliser `clawdbot models scan` pour voir les modèles disponibles

### Étape 5 : Configurer Ollama (modèles locaux)

**Pourquoi**
Ollama vous permet d'exécuter des modèles localement, sans API Key, idéal pour les scénarios sensibles à la confidentialité.

Modifier `~/.clawdbot/clawdbot.json` :

```yaml
models:
  providers:
    ollama:
      baseUrl: "http://localhost:11434"
      api: "openai-completions"
      models:
        - id: "ollama/llama3.2"
          name: "Llama 3.2"
          api: "openai-completions"
          reasoning: false
          input: ["text"]
          cost:
            input: 0
            output: 0
            cacheRead: 0
            cacheWrite: 0
          contextWindow: 128000
          maxTokens: 4096

agents:
  defaults:
    model:
      primary: "ollama/llama3.2"
```

**Ce que vous devriez voir** :
- Les modèles Ollama ne nécessitent pas d'API Key
- Assurez-vous que le service Ollama fonctionne sur `http://localhost:11434`

### Étape 6 : Vérifier la configuration

**Pourquoi**
S'assurer que l'authentification et la configuration des modèles sont correctes, Gateway peut appeler l'IA normalement.

```bash
clawdbot doctor
```

**Ce que vous devriez voir** :
- Aucune erreur d'authentification
- La liste des modèles inclut les fournisseurs que vous avez configurés
- L'état affiche "OK"

Ou envoyer un message de test :

```bash
clawdbot message send --to +1234567890 --message "Hello from Clawdbot"
```

**Ce que vous devriez voir** :
- La réponse IA est normale
- Aucune erreur "No credentials found"

## Point de contrôle ✅

- [ ] Au moins un fournisseur de modèles configuré (Anthropic ou OpenAI)
- [ ] Le fichier d'authentification `auth-profiles.json` est créé
- [ ] Le fichier de configuration des modèles `models.json` est généré
- [ ] Vous pouvez basculer les modèles via `/model <alias>`
- [ ] Aucune erreur d'authentification dans les logs Gateway
- [ ] Les messages de test reçoivent une réponse IA avec succès

## Pièges à éviter

### Inadéquation du mode d'authentification

**Problème** : La configuration OAuth ne correspond pas au mode d'authentification

```yaml
# ❌ Erreur : identifiants OAuth mais le mode est token
anthropic:claude-cli:
  provider: "anthropic"
  mode: "token"  # devrait être "oauth"
```

**Correction** :

```yaml
# ✅ Correct
anthropic:claude-cli:
  provider: "anthropic"
  mode: "oauth"
```

::: tip
Clawdbot définit automatiquement la configuration importée de Claude Code CLI sur `mode: "oauth"`, aucune modification manuelle n'est requise.
:::

### Échec de l'actualisation du token OAuth

**Problème** : Voir l'erreur "OAuth token refresh failed for anthropic"

**Causes** :
- Les identifiants Claude Code CLI sont expirés sur une autre machine
- Le token OAuth a expiré

**Correction** :
```bash
# Régénérer un setup-token
claude setup-token

# Recoller
clawdbot models auth paste-token --provider anthropic
```

::: warning token vs oauth
`type: "token"` est un token Bearer statique qui ne s'actualise pas automatiquement. `type: "oauth"` prend en charge l'actualisation automatique.
:::

### Limitation de quota et basculement en cas d'erreur

**Problème** : Le modèle principal rencontre une limitation de quota (erreur 429)

**Symptôme** :
```
HTTP 429: rate_limit_error
```

**Traitement automatique** :
- Clawdbot essaiera automatiquement le modèle suivant dans `fallbacks`
- Si tous les modèles échouent, une erreur est renvoyée

**Configurer une période de refroidissement** (optionnel) :

```yaml
auth:
  cooldowns:
    billingBackoffHours: 24  # Désactiver le fournisseur pendant 24 heures après une erreur de quota
    failureWindowHours: 1      # Les échecs dans les 1 heure sont comptés pour le refroidissement
```

### Remplacement par des variables d'environnement

**Problème** : Des variables d'environnement sont utilisées dans le fichier de configuration mais non définies

```yaml
models:
  providers:
    openai:
      apiKey: "${OPENAI_KEY}"  # Erreur si non défini
```

**Correction** :
```bash
# Définir la variable d'environnement
export OPENAI_KEY="sk-..."

# Ou ajouter dans .zshrc/.bashrc
echo 'export OPENAI_KEY="sk-..."' >> ~/.zshrc
```

## Configuration avancée

### Multi-comptes et rotation de l'authentification

**Pourquoi**
Configurer plusieurs comptes pour le même fournisseur afin d'obtenir une répartition de charge et une gestion des quotas.

**Configurer le fichier d'authentification** (`~/.clawdbot/agents/default/agent/auth-profiles.json`) :

```json
{
  "version": 1,
  "profiles": {
    "anthropic:me@example.com": {
      "type": "oauth",
      "provider": "anthropic",
      "email": "me@example.com"
    },
    "anthropic:work": {
      "type": "api_key",
      "provider": "anthropic",
      "key": "sk-ant-work..."
    },
    "openai:personal": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-1..."
    },
    "openai:work": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-2..."
    }
  },
  "order": {
    "anthropic": ["anthropic:me@example.com", "anthropic:work"],
    "openai": ["openai:personal", "openai:work"]
  }
}
```

**Champ `order`** :
- Définit l'ordre de rotation de l'authentification
- Clawdbot essaiera chaque compte dans l'ordre
- Les comptes en échec sont automatiquement ignorés

**Commandes CLI pour gérer l'ordre** :

```bash
# Voir l'ordre actuel
clawdbot models auth order get --provider anthropic

# Définir l'ordre
clawdbot models auth order set --provider anthropic anthropic:me@example.com anthropic:work

# Effacer l'ordre (utiliser la rotation par défaut)
clawdbot models auth order clear --provider anthropic
```

### Authentification pour une session spécifique

**Pourquoi**
Verrouiller la configuration d'authentification pour une session spécifique ou un sous-Agent.

**Utiliser la syntaxe `/model <alias>@<profileId>`** :

```bash
# Verrouiller l'utilisation d'un compte spécifique pour la session actuelle
/model opus@anthropic:work

# Spécifier l'authentification lors de la création d'un sous-Agent
clawdbot sessions spawn --model "opus@anthropic:work" --workspace "~/clawd-work"
```

**Verrouillage dans le fichier de configuration** (`~/.clawdbot/clawdbot.json`) :

```yaml
auth:
  order:
    # Verrouiller l'ordre anthropic pour l'Agent principal
    main: ["anthropic:me@example.com", "anthropic:work"]
```

### Actualisation automatique des tokens OAuth

Clawdbot prend en charge l'actualisation automatique pour les fournisseurs OAuth suivants :

| Fournisseur | Flux OAuth | Mécanisme d'actualisation |
|--- | --- | ---|
| **Anthropic** (Claude Code CLI) | Code d'autorisation standard | Actualisation RPC pi-mono |
| **OpenAI** (Codex) | Code d'autorisation standard | Actualisation RPC pi-mono |
| **Qwen Portal** | OAuth personnalisé | `refreshQwenPortalCredentials` |
| **Chutes** | OAuth personnalisé | `refreshChutesTokens` |

**Logique d'actualisation automatique** :

1. Vérifier l'expiration du token (champ `expires`)
2. S'il n'est pas expiré, l'utiliser directement
3. S'il est expiré, utiliser le token `refresh` pour demander un nouveau token `access`
4. Mettre à jour les identifiants stockés

::: tip Synchronisation Claude Code CLI
Si vous utilisez l'authentification OAuth Anthropic (`anthropic:claude-cli`), Clawdbot synchronisera les modifications lors de l'actualisation du token vers le stockage de Claude Code CLI, garantissant la cohérence des deux côtés.
:::

### Alias de modèles et raccourcis

**Pourquoi**
Les alias de modèles vous permettent de basculer rapidement entre modèles sans avoir à mémoriser l'ID complet.

**Alias prédéfinis** (configuration recommandée) :

```yaml
agents:
  defaults:
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "anthropic/claude-haiku-4-5":
        alias: "haiku"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Mode d'utilisation** :

```bash
# Basculement rapide vers Opus
/model opus

# Équivaut à
/model anthropic/claude-opus-4-5

# Utiliser une authentification spécifique
/model opus@anthropic:work
```

::: tip Séparation des alias et de l'authentification
Les alias sont simplement des raccourcis pour les ID de modèle et n'affectent pas la sélection de l'authentification. Pour spécifier l'authentification, utilisez la syntaxe `@<profileId>`.
:::

### Configuration implicite des fournisseurs

Certains fournisseurs ne nécessitent pas de configuration explicite, Clawdbot les détectera automatiquement :

| Fournisseur | Méthode de détection | Fichier de configuration |
|--- | --- | ---|
| **GitHub Copilot** | `~/.copilot/credentials.json` | Aucune configuration requise |
| **AWS Bedrock** | Variables d'environnement ou identifiants AWS SDK | `~/.aws/credentials` |
| **Codex CLI** | `~/.codex/auth.json` | Aucune configuration requise |

::: tip Priorité de configuration implicite
Les configurations implicites sont automatiquement fusionnées dans `models.json`, mais les configurations explicites peuvent les remplacer.
:::

## Questions fréquentes

### OAuth vs API Key : quelle est la différence ?

**OAuth** :
- Convient aux Gateway qui s'exécutent pendant une longue période
- Les tokens sont automatiquement actualisés
- Nécessite un compte d'abonnement (Claude Pro/Max, OpenAI Codex)

**API Key** :
- Convient pour un démarrage rapide et les tests
- Ne s'actualise pas automatiquement
- Peut être utilisé pour des comptes de niveau gratuit

::: info Choix recommandé
- Exécution à long terme → Utiliser OAuth (Anthropic, OpenAI)
- Tests rapides → Utiliser API Key
- Sensibilité à la confidentialité → Utiliser des modèles locaux (Ollama)
:::

### Comment voir la configuration d'authentification actuelle ?

```bash
# Voir le fichier d'authentification
cat ~/.clawdbot/agents/default/agent/auth-profiles.json

# Voir la configuration des modèles
cat ~/.clawdbot/models.json

# Voir le fichier de configuration principal
cat ~/.clawdbot/clawdbot.json
```

Ou utiliser la CLI :

```bash
# Lister les modèles
clawdbot models list

# Voir l'ordre d'authentification
clawdbot models auth order get --provider anthropic
```

### Comment supprimer une authentification spécifique ?

```bash
# Modifier le fichier d'authentification, supprimer le profil correspondant
nano ~/.clawdbot/agents/default/agent/auth-profiles.json

# Ou utiliser la CLI (opération manuelle)
clawdbot doctor  # Voir les configurations problématiques
```

::: warning Confirmer avant la suppression
La suppression d'une configuration d'authentification empêchera les modèles utilisant ce fournisseur de fonctionner. Assurez-vous d'avoir une configuration de secours.
:::

### Comment récupérer après une limitation de quota ?

**Récupération automatique** :
- Clawdbot réessaiera automatiquement après la période de refroidissement
- Consultez les logs pour connaître l'heure de nouvelle tentative

**Récupération manuelle** :
```bash
# Effacer l'état de refroidissement
clawdbot models auth clear-cooldown --provider anthropic --profile-id anthropic:me@example.com

# Ou redémarrer Gateway
clawdbot gateway restart
```

## Résumé du cours

- Clawdbot prend en charge trois méthodes d'authentification : API Key, OAuth, Token
- La configuration des modèles et l'authentification sont séparées et stockées dans différents fichiers
- Il est recommandé de configurer Anthropic Opus 4.5 comme modèle principal et OpenAI GPT-5.2 comme modèle de secours
- OAuth prend en charge l'actualisation automatique, idéal pour une exécution à long terme
- Il est possible de configurer plusieurs comptes et une rotation de l'authentification pour obtenir une répartition de charge
- Utiliser des alias de modèles pour basculer rapidement entre modèles

## Prochain cours

> Dans le prochain cours, nous apprendrons la **[Gestion de sessions et multi-Agents](../session-management/)**.
>
> Vous apprendrez :
> - Modèles de session et isolation de session
> - Collaboration de sous-Agents
> - Compression de contexte
> - Configuration de routage multi-Agents

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Définition des types d'identifiants d'authentification | [`src/agents/auth-profiles/types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/types.ts) | 1-74 |
| Analyse et actualisation des tokens OAuth | [`src/agents/auth-profiles/oauth.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/oauth.ts) | 1-220 |
| Gestion des fichiers de configuration d'authentification | [`src/agents/auth-profiles/profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/profiles.ts) | 1-85 |
| Types de configuration des modèles | [`src/config/types.models.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.models.ts) | 1-60 |
| Génération de la configuration des modèles | [`src/agents/models-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/models-config.ts) | 1-139 |
| Configuration du schéma Zod | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300+ |

**Types clés** :
- `AuthProfileCredential` : type union d'identifiants d'authentification (`ApiKeyCredential | TokenCredential | OAuthCredential`)
- `ModelProviderConfig` : structure de configuration du fournisseur de modèles
- `ModelDefinitionConfig` : structure de définition des modèles

**Fonctions clés** :
- `resolveApiKeyForProfile()` : résoudre les identifiants d'authentification et renvoyer l'API Key
- `refreshOAuthTokenWithLock()` : actualisation des tokens OAuth avec verrouillage
- `ensureClawdbotModelsJson()` : générer et fusionner la configuration des modèles

**Emplacements des fichiers de configuration** :
- `~/.clawdbot/clawdbot.json` : fichier de configuration principal
- `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json` : identifiants d'authentification
- `~/.clawdbot/models.json` : configuration des modèles générée

</details>
