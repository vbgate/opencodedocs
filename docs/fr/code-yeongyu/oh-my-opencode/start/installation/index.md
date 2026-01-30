---
title: "Installation : Déploiement Rapide | oh-my-opencode"
sidebarTitle: "Démarrage en 5 minutes"
subtitle: "Installation et Configuration Rapides : Configuration et Vérification des Providers"
description: "Apprenez à installer et configurer oh-my-opencode. Configurez vos providers IA en 5 minutes : Claude, OpenAI, Gemini, GitHub Copilot."
tags:
  - "installation"
  - "setup"
  - "provider-configuration"
prerequisite: []
order: 10
---

# Installation et Configuration Rapides : Configuration et Vérification des Providers

## Ce que vous allez apprendre

- ✅ Installer et configurer automatiquement oh-my-opencode via un agent IA (méthode recommandée)
- ✅ Effectuer une installation manuelle via l'installateur CLI interactif
- ✅ Configurer plusieurs providers IA : Claude, OpenAI, Gemini, GitHub Copilot
- ✅ Vérifier le succès de l'installation et diagnostiquer les problèmes de configuration
- ✅ Comprendre la priorité des providers et le mécanisme de fallback

## Vos difficultés actuelles

- Vous venez d'installer OpenCode mais vous êtes perdu face à l'interface de configuration vide
- Vous avez plusieurs abonnements IA (Claude, ChatGPT, Gemini) et ne savez pas comment les configurer ensemble
- Vous voulez que l'IA vous aide à installer, mais ne savez pas quelles instructions lui donner
- Vous craignez qu'une mauvaise configuration empêche le plugin de fonctionner

## Quand utiliser ceci

- **Lors de la première installation de oh-my-opencode** : C'est la première étape obligatoire
- **Après avoir souscrit à un nouveau provider IA** : Par exemple, après avoir acheté Claude Max ou ChatGPT Plus
- **Lors d'un changement d'environnement de développement** : Pour reconfigurer sur une nouvelle machine
- **En cas de problèmes de connexion au provider** : Pour diagnostiquer les problèmes de configuration

## 🎒 Prérequis

::: warning Conditions préalables
Ce tutoriel suppose que vous avez déjà :
1. Installé **OpenCode >= 1.0.150**
2. Au moins un abonnement à un provider IA (Claude, OpenAI, Gemini, GitHub Copilot, etc.)

Si OpenCode n'est pas installé, consultez d'abord la [documentation officielle d'OpenCode](https://opencode.ai/docs).
:::

::: tip Vérifier la version d'OpenCode
```bash
opencode --version
# Devrait afficher 1.0.150 ou une version supérieure
```
:::

## Concepts fondamentaux

L'installation de oh-my-opencode repose sur deux principes clés :

**1. Priorité à l'agent IA (Recommandé)**

Laissez un agent IA gérer l'installation plutôt que de le faire manuellement. Pourquoi ?
- L'IA n'oublie aucune étape (elle dispose du guide d'installation complet)
- L'IA choisit automatiquement la meilleure configuration selon vos abonnements
- L'IA peut diagnostiquer et corriger automatiquement les erreurs

**2. Mode interactif vs non-interactif**

- **Installation interactive** : Exécutez `bunx oh-my-opencode install` et répondez aux questions
- **Installation non-interactive** : Utilisez les paramètres en ligne de commande (idéal pour l'automatisation ou les agents IA)

**3. Priorité des providers**

oh-my-opencode utilise un mécanisme de résolution de modèle en trois étapes :
1. **Surcharge utilisateur** : Si un modèle est explicitement spécifié dans la configuration, il est utilisé
2. **Fallback de provider** : Essai par ordre de priorité : `Native (anthropic/openai/google) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`
3. **Défaut système** : Si aucun provider n'est disponible, utilisation du modèle par défaut d'OpenCode

::: info Qu'est-ce qu'un Provider ?
Un provider est un fournisseur de services de modèles IA, par exemple :
- **Anthropic** : Fournit les modèles Claude (Opus, Sonnet, Haiku)
- **OpenAI** : Fournit les modèles GPT (GPT-5.2, GPT-5-nano)
- **Google** : Fournit les modèles Gemini (Gemini 3 Pro, Flash)
- **GitHub Copilot** : Fournit plusieurs modèles hébergés par GitHub en fallback

oh-my-opencode peut configurer plusieurs providers simultanément et sélectionne automatiquement le modèle optimal selon le type de tâche et la priorité.
:::

## Suivez le guide

### Étape 1 : Méthode recommandée — Installation par agent IA (conviviale)

**Pourquoi**
C'est la méthode d'installation officiellement recommandée. L'agent IA complète automatiquement la configuration, évitant les oublis humains.

**Procédure**

Ouvrez votre interface de conversation IA (Claude Code, AmpCode, Cursor, etc.) et entrez :

```bash
Veuillez installer et configurer oh-my-opencode selon ce guide :
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**Vous devriez voir**
L'agent IA va :
1. Vous demander vos abonnements (Claude, OpenAI, Gemini, GitHub Copilot, etc.)
2. Exécuter automatiquement les commandes d'installation
3. Configurer l'authentification des providers
4. Vérifier le résultat de l'installation
5. Vous confirmer que l'installation est terminée

::: tip Mot de passe de test de l'agent IA
Une fois l'installation terminée, l'agent IA utilisera "oMoMoMoMo..." comme mot de passe de test pour confirmer.
:::

### Étape 2 : Installation manuelle — Installateur CLI interactif

**Pourquoi**
Si vous souhaitez contrôler entièrement le processus d'installation, ou si l'installation par agent IA échoue.

::: code-group

```bash [Avec Bun (Recommandé)]
bunx oh-my-opencode install
```

```bash [Avec npm]
npx oh-my-opencode install
```

:::

> **Note** : Le CLI télécharge automatiquement un binaire autonome adapté à votre plateforme. Après l'installation, Bun/Node.js n'est plus nécessaire.
>
> **Plateformes supportées** : macOS (ARM64, x64), Linux (x64, ARM64, Alpine/musl), Windows (x64)

**Vous devriez voir**
L'installateur pose les questions suivantes :

```
oMoMoMoMo... Install

[?] Do you have a Claude Pro/Max Subscription? (Y/n)
[?] Are you on max20 (20x mode)? (Y/n)
[?] Do you have an OpenAI/ChatGPT Plus Subscription? (Y/n)
[?] Will you integrate Gemini models? (Y/n)
[?] Do you have a GitHub Copilot Subscription? (Y/n)
[?] Do you have access to OpenCode Zen (opencode/ models)? (Y/n)
[?] Do you have a Z.ai Coding Plan subscription? (Y/n)

Configuration Summary
────────────────────────────────────────────────

  [OK] Claude (max20)
  [OK] OpenAI/ChatGPT (GPT-5.2 for Oracle)
  [OK] Gemini
  [OK] GitHub Copilot (fallback)
  ○ OpenCode Zen (opencode/ models)
  ○ Z.ai Coding Plan (Librarian/Multimodal)

────────────────────────────────────────────────

Model Assignment

  [i] Models auto-configured based on provider priority
  * Priority: Native > Copilot > OpenCode Zen > Z.ai

✓ Plugin registered in opencode.json
✓ Configuration written to ~/.config/opencode/oh-my-opencode.json
✓ Auth setup hints displayed

[!] Please configure authentication for your providers:

1. Anthropic (Claude): Run 'opencode auth login' → Select Anthropic
2. Google (Gemini): Run 'opencode auth login' → Select Google → Choose OAuth with Google (Antigravity)
3. GitHub (Copilot): Run 'opencode auth login' → Select GitHub

Done! 🎉
```

### Étape 3 : Configurer l'authentification des providers

#### 3.1 Authentification Claude (Anthropic)

**Pourquoi**
L'agent principal Sisyphus recommande fortement le modèle Opus 4.5, l'authentification est donc obligatoire.

**Procédure**

```bash
opencode auth login
```

Puis suivez les instructions :
1. **Sélectionnez le provider** : Choisissez `Anthropic`
2. **Sélectionnez la méthode de connexion** : Choisissez `Claude Pro/Max`
3. **Complétez le flux OAuth** : Connectez-vous et autorisez dans le navigateur
4. **Attendez la fin** : Le terminal affiche le succès de l'authentification

**Vous devriez voir**
```
✓ Authentication successful
✓ Anthropic provider configured
```

::: warning Restrictions d'accès OAuth Claude
> En janvier 2026, Anthropic a restreint l'accès OAuth tiers, invoquant des violations des CGU.
>
> [**Anthropic cite ce projet oh-my-opencode comme raison du blocage d'OpenCode**](https://x.com/thdxr/status/2010149530486911014)
>
> Il existe effectivement des plugins dans la communauté qui falsifient les signatures de requêtes OAuth Claude Code. Ces outils peuvent fonctionner techniquement, mais les utilisateurs doivent être conscients des implications des CGU. Je ne les recommande personnellement pas.
>
> Ce projet n'est pas responsable des problèmes causés par l'utilisation d'outils non officiels, et **nous n'avons aucune implémentation personnalisée du système OAuth**.
:::

#### 3.2 Authentification Google Gemini (OAuth Antigravity)

**Pourquoi**
Les modèles Gemini sont utilisés pour le Multimodal Looker (analyse média) et certaines tâches spécialisées.

**Procédure**

**Étape 1** : Ajouter le plugin Antigravity Auth

Éditez `~/.config/opencode/opencode.json` et ajoutez `opencode-antigravity-auth@latest` dans le tableau `plugin` :

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Étape 2** : Configurer les modèles Antigravity (obligatoire)

Copiez la configuration complète des modèles depuis la [documentation opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) et fusionnez-la soigneusement dans `~/.config/opencode/oh-my-opencode.json`, en évitant de casser la configuration existante.

Ce plugin utilise un **système de variantes** — les modèles comme `antigravity-gemini-3-pro` supportent les variantes `low`/`high`, plutôt que des entrées séparées `-low`/`-high`.

**Étape 3** : Surcharger les modèles d'agents oh-my-opencode

Dans `oh-my-opencode.json` (ou `.opencode/oh-my-opencode.json`), surchargez les modèles d'agents :

```json
{
  "agents": {
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Modèles disponibles (quota Antigravity)** :
- `google/antigravity-gemini-3-pro` — Variantes : `low`, `high`
- `google/antigravity-gemini-3-flash` — Variantes : `minimal`, `low`, `medium`, `high`
- `google/antigravity-claude-sonnet-4-5` — Sans variante
- `google/antigravity-claude-sonnet-4-5-thinking` — Variantes : `low`, `max`
- `google/antigravity-claude-opus-4-5-thinking` — Variantes : `low`, `max`

**Modèles disponibles (quota Gemini CLI)** :
- `google/gemini-2.5-flash`, `google/gemini-2.5-pro`
- `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

> **Note** : Les anciens noms avec suffixes comme `google/antigravity-gemini-3-pro-high` fonctionnent toujours, mais les variantes sont recommandées. Utilisez plutôt `--variant=high` avec le nom de base du modèle.

**Étape 4** : Exécuter l'authentification

```bash
opencode auth login
```

Puis suivez les instructions :
1. **Sélectionnez le provider** : Choisissez `Google`
2. **Sélectionnez la méthode de connexion** : Choisissez `OAuth with Google (Antigravity)`
3. **Complétez la connexion navigateur** : (détection automatique) Terminez la connexion
4. **Optionnel** : Ajoutez d'autres comptes Google pour l'équilibrage de charge multi-comptes
5. **Vérifiez le succès** : Confirmez avec l'utilisateur

**Vous devriez voir**
```
✓ Authentication successful
✓ Google provider configured (Antigravity)
✓ Multiple accounts available for load balancing
```

::: tip Équilibrage de charge multi-comptes
Ce plugin supporte jusqu'à 10 comptes Google. Quand un compte atteint sa limite de débit, il bascule automatiquement vers le compte disponible suivant.
:::

#### 3.3 Authentification GitHub Copilot (Provider de fallback)

**Pourquoi**
GitHub Copilot sert de **provider de fallback**, utilisé quand les providers natifs ne sont pas disponibles.

**Priorité** : `Native (anthropic/, openai/, google/) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`

**Procédure**

```bash
opencode auth login
```

Puis suivez les instructions :
1. **Sélectionnez le provider** : Choisissez `GitHub`
2. **Sélectionnez la méthode d'authentification** : Choisissez `Authenticate via OAuth`
3. **Complétez la connexion navigateur** : Flux OAuth GitHub

**Vous devriez voir**
```
✓ Authentication successful
✓ GitHub Copilot configured as fallback
```

::: info Mapping des modèles GitHub Copilot
Quand GitHub Copilot est le meilleur provider disponible, oh-my-opencode utilise l'attribution de modèles suivante :

| Agent | Modèle |
| --- | --- |
| **Sisyphus** | `github-copilot/claude-opus-4.5` |
| **Oracle** | `github-copilot/gpt-5.2` |
| **Explore** | `opencode/gpt-5-nano` |
| **Librarian** | `zai-coding-plan/glm-4.7` (si Z.ai disponible) ou fallback |

GitHub Copilot agit comme provider proxy, routant les requêtes vers les modèles sous-jacents selon votre abonnement.
:::

### Étape 4 : Installation non-interactive (pour agents IA)

**Pourquoi**
Les agents IA doivent utiliser le mode non-interactif, complétant toute la configuration en une seule commande avec des paramètres.

**Procédure**

```bash
bunx oh-my-opencode install --no-tui \
  --claude=<yes|no|max20> \
  --openai=<yes|no> \
  --gemini=<yes|no> \
  --copilot=<yes|no> \
  [--opencode-zen=<yes|no>] \
  [--zai-coding-plan=<yes|no>]
```

**Description des paramètres** :

| Paramètre | Valeur | Description |
| --- | --- | --- |
| `--no-tui` | - | Désactive l'interface interactive (autres paramètres obligatoires) |
| `--claude` | `yes/no/max20` | Statut d'abonnement Claude |
| `--openai` | `yes/no` | Abonnement OpenAI/ChatGPT (GPT-5.2 pour Oracle) |
| `--gemini` | `yes/no` | Intégration Gemini |
| `--copilot` | `yes/no` | Abonnement GitHub Copilot |
| `--opencode-zen` | `yes/no` | Accès OpenCode Zen (défaut : no) |
| `--zai-coding-plan` | `yes/no` | Abonnement Z.ai Coding Plan (défaut : no) |

**Exemples** :

```bash
# Utilisateur avec tous les abonnements natifs
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no

# Utilisateur avec Claude uniquement
bunx oh-my-opencode install --no-tui \
  --claude=yes \
  --openai=no \
  --gemini=no \
  --copilot=no

# Utilisateur avec GitHub Copilot uniquement
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=yes

# Utilisateur sans abonnement
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no
```

**Vous devriez voir**
La même sortie que l'installation interactive, mais sans avoir à répondre aux questions.

## Point de contrôle ✅

### Vérifier le succès de l'installation

**Vérification 1** : Confirmer la version d'OpenCode

```bash
opencode --version
```

**Résultat attendu** : Affiche `1.0.150` ou une version supérieure.

::: warning Exigence de version OpenCode
Si vous êtes sur la version 1.0.132 ou antérieure, un bug d'OpenCode peut corrompre la configuration.
>
> Le correctif a été fusionné après 1.0.132 — utilisez une version plus récente.
> Fait amusant : Ce PR a été découvert et corrigé grâce aux configurations Librarian, Explore et Oracle de OhMyOpenCode.
:::

**Vérification 2** : Confirmer l'enregistrement du plugin

```bash
cat ~/.config/opencode/opencode.json
```

**Résultat attendu** : Voir `"oh-my-opencode"` dans le tableau `plugin`.

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Vérification 3** : Confirmer la génération du fichier de configuration

```bash
cat ~/.config/opencode/oh-my-opencode.json
```

**Résultat attendu** : Affiche la structure de configuration complète, incluant les champs `agents`, `categories`, `disabled_agents`, etc.

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/gpt-5.2"
    },
    ...
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1
    },
    ...
  },
  "disabled_agents": [],
  "disabled_skills": [],
  "disabled_hooks": [],
  "disabled_mcps": []
}
```

### Exécuter la commande de diagnostic

```bash
oh-my-opencode doctor --verbose
```

**Vous devriez voir** :
- Vérification de la résolution des modèles
- Validation de la configuration des agents
- Statut de connexion MCP
- Statut d'authentification des providers

```bash
✓ OpenCode version: 1.0.150 (required: >=1.0.150)
✓ Plugin registered: oh-my-opencode
✓ Config file found: ~/.config/opencode/oh-my-opencode.json
✓ Anthropic provider: authenticated
✓ OpenAI provider: authenticated
✓ Google provider: authenticated (Antigravity)
✓ GitHub Copilot: authenticated (fallback)
✓ MCP servers: 3 connected (websearch, context7, grep_app)
✓ Agents: 10 enabled
✓ Hooks: 32 enabled
```

::: danger Si le diagnostic échoue
Si le diagnostic affiche des erreurs, résolvez-les d'abord :
1. **Échec d'authentification du provider** : Relancez `opencode auth login`
2. **Erreur de fichier de configuration** : Vérifiez la syntaxe de `oh-my-opencode.json` (JSONC supporte les commentaires et les virgules finales)
3. **Incompatibilité de version** : Mettez à jour OpenCode vers la dernière version
4. **Plugin non enregistré** : Relancez `bunx oh-my-opencode install`
:::

## Pièges courants

### ❌ Erreur 1 : Oublier de configurer l'authentification du provider

**Problème** : Utilisation directe après l'installation, mais les modèles IA ne fonctionnent pas.

**Cause** : Le plugin est installé, mais le provider n'est pas authentifié via OpenCode.

**Solution** :
```bash
opencode auth login
# Sélectionnez le provider correspondant et complétez l'authentification
```

### ❌ Erreur 2 : Version d'OpenCode trop ancienne

**Problème** : Le fichier de configuration est corrompu ou ne se charge pas.

**Cause** : OpenCode 1.0.132 ou antérieur a un bug qui corrompt la configuration.

**Solution** :
```bash
# Mettre à jour OpenCode
npm install -g @opencode/cli@latest

# Ou via un gestionnaire de paquets (Bun, Homebrew, etc.)
bun install -g @opencode/cli@latest
```

### ❌ Erreur 3 : Erreur de paramètres CLI

**Problème** : Erreur de paramètre lors de l'installation non-interactive.

**Cause** : `--claude` est un paramètre obligatoire, vous devez fournir `yes`, `no` ou `max20`.

**Solution** :
```bash
# ❌ Erreur : paramètre --claude manquant
bunx oh-my-opencode install --no-tui --gemini=yes

# ✅ Correct : fournir tous les paramètres obligatoires
bunx oh-my-opencode install --no-tui --claude=yes --gemini=yes
```

### ❌ Erreur 4 : Quota Antigravity épuisé

**Problème** : Les modèles Gemini cessent soudainement de fonctionner.

**Cause** : Le quota Antigravity est limité, un seul compte peut atteindre sa limite de débit.

**Solution** : Ajoutez plusieurs comptes Google pour l'équilibrage de charge
```bash
opencode auth login
# Sélectionnez Google
# Ajoutez d'autres comptes
```

Le plugin bascule automatiquement entre les comptes, évitant l'épuisement d'un seul compte.

### ❌ Erreur 5 : Mauvais emplacement du fichier de configuration

**Problème** : Les modifications de configuration ne prennent pas effet.

**Cause** : Modification du mauvais fichier de configuration (configuration projet vs configuration utilisateur).

**Solution** : Confirmez l'emplacement du fichier de configuration

| Type de configuration | Chemin du fichier | Priorité |
| --- | --- | --- |
| **Configuration utilisateur** | `~/.config/opencode/oh-my-opencode.json` | Haute |
| **Configuration projet** | `.opencode/oh-my-opencode.json` | Basse |

::: tip Règles de fusion de configuration
Si les configurations utilisateur et projet existent toutes les deux, **la configuration utilisateur surcharge la configuration projet**.
:::

## Résumé de la leçon

- **Privilégiez l'installation par agent IA** : Laissez l'IA compléter automatiquement la configuration, évitant les oublis humains
- **Le CLI supporte les modes interactif et non-interactif** : Interactif pour les humains, non-interactif pour l'IA
- **Priorité des providers** : Native > Copilot > OpenCode Zen > Z.ai
- **L'authentification est obligatoire** : Vous devez configurer l'authentification du provider après l'installation pour utiliser le plugin
- **La commande de diagnostic est importante** : `oh-my-opencode doctor --verbose` permet de diagnostiquer rapidement les problèmes
- **Support du format JSONC** : Les fichiers de configuration supportent les commentaires et les virgules finales

## Aperçu de la leçon suivante

> Dans la leçon suivante, nous apprendrons **[Découverte de Sisyphus : L'Orchestrateur Principal](../sisyphus-orchestrator/)**.
>
> Vous apprendrez :
> - Les fonctionnalités principales et la philosophie de conception de l'agent Sisyphus
> - Comment utiliser Sisyphus pour planifier et déléguer des tâches
> - Le mécanisme de fonctionnement des tâches parallèles en arrière-plan
> - Le principe du Todo Completion Enforcer

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Point d'entrée CLI | [`src/cli/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/index.ts) | 22-60 |
| Installateur interactif | [`src/cli/install.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/install.ts) | 1-400+ |
| Gestionnaire de configuration | [`src/cli/config-manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/config-manager.ts) | 1-200+ |
| Schéma de configuration | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-400+ |
| Commande de diagnostic | [`src/cli/doctor.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/doctor.ts) | 1-200+ |

**Constantes clés** :
- `VERSION = packageJson.version` : Numéro de version actuel du CLI
- `SYMBOLS` : Symboles UI (check, cross, arrow, bullet, info, warn, star)

**Fonctions clés** :
- `install(args: InstallArgs)` : Fonction d'installation principale, gère les installations interactive et non-interactive
- `validateNonTuiArgs(args: InstallArgs)` : Valide les paramètres du mode non-interactif
- `argsToConfig(args: InstallArgs)` : Convertit les paramètres CLI en objet de configuration
- `addPluginToOpenCodeConfig()` : Enregistre le plugin dans opencode.json
- `writeOmoConfig(config)` : Écrit le fichier de configuration oh-my-opencode.json
- `isOpenCodeInstalled()` : Vérifie si OpenCode est installé
- `getOpenCodeVersion()` : Obtient le numéro de version d'OpenCode

**Champs du schéma de configuration** :
- `AgentOverrideConfigSchema` : Configuration de surcharge d'agent (model, variant, skills, temperature, prompt, etc.)
- `CategoryConfigSchema` : Configuration de catégorie (description, model, temperature, thinking, etc.)
- `ClaudeCodeConfigSchema` : Configuration de compatibilité Claude Code (mcp, commands, skills, agents, hooks, plugins)
- `BuiltinAgentNameSchema` : Énumération des agents intégrés (sisyphus, prometheus, oracle, librarian, explore, multimodal-looker, metis, momus, atlas)
- `PermissionValue` : Énumération des valeurs de permission (ask, allow, deny)

**Plateformes d'installation supportées** (depuis le README) :
- macOS (ARM64, x64)
- Linux (x64, ARM64, Alpine/musl)
- Windows (x64)

**Chaîne de priorité des providers** (depuis docs/guide/installation.md) :
1. Native (anthropic/, openai/, google/)
2. GitHub Copilot
3. OpenCode Zen
4. Z.ai Coding Plan

</details>
