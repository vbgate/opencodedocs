---
title: "Configuration des Providers : Stratégie Multi-Modèles IA | oh-my-opencode"
sidebarTitle: "Connecter plusieurs services IA"
subtitle: "Configuration des Providers : Stratégie Multi-Modèles IA"
description: "Apprenez à configurer les différents Providers IA de oh-my-opencode, notamment Anthropic, OpenAI, Google et GitHub Copilot, ainsi que le fonctionnement du mécanisme de repli automatique multi-modèles."
tags:
  - "configuration"
  - "providers"
  - "models"
prerequisite:
  - "start-installation"
order: 40
---

# Configuration des Providers : Claude, OpenAI, Gemini et Stratégie Multi-Modèles

## Ce que vous saurez faire

- Configurer plusieurs Providers IA : Anthropic Claude, OpenAI, Google Gemini, GitHub Copilot, etc.
- Comprendre le mécanisme de repli par priorité multi-modèles pour que le système choisisse automatiquement le meilleur modèle disponible
- Attribuer le modèle le plus adapté à chaque agent IA et type de tâche
- Configurer des services tiers comme Z.ai Coding Plan et OpenCode Zen
- Utiliser la commande doctor pour diagnostiquer la configuration de résolution des modèles

## Votre situation actuelle

Vous avez installé oh-my-opencode, mais vous ne savez pas vraiment :
- Comment ajouter plusieurs Providers IA (Claude, OpenAI, Gemini, etc.)
- Pourquoi parfois l'agent n'utilise pas le modèle attendu
- Comment configurer différents modèles pour différentes tâches (par exemple, un modèle économique pour la recherche, un modèle puissant pour la programmation)
- Comment le système bascule automatiquement vers un modèle de secours quand un Provider est indisponible
- Comment les configurations de modèles fonctionnent ensemble dans `opencode.json` et `oh-my-opencode.json`

## Quand utiliser cette technique

- **Configuration initiale** : Vous venez d'installer oh-my-opencode et devez ajouter ou ajuster les Providers IA
- **Nouvel abonnement** : Vous avez souscrit à un nouveau service IA (comme Gemini Pro) et souhaitez l'intégrer
- **Optimisation des coûts** : Vous voulez que certains agents utilisent des modèles moins chers ou plus rapides
- **Dépannage** : Un agent n'utilise pas le modèle prévu et vous devez diagnostiquer le problème
- **Orchestration multi-modèles** : Vous souhaitez exploiter les avantages de différents modèles pour construire un workflow de développement intelligent

## 🎒 Avant de commencer

::: warning Prérequis
Ce tutoriel suppose que vous avez :
- ✅ Terminé l'[installation et la configuration initiale](../installation/)
- ✅ Installé OpenCode (version >= 1.0.150)
- ✅ Une connaissance de base du format de fichier de configuration JSON/JSONC
:::

## Concept clé

oh-my-opencode utilise un **système d'orchestration multi-modèles** qui sélectionne le modèle le plus approprié pour chaque agent IA et type de tâche en fonction de vos abonnements et de votre configuration.

**Pourquoi le multi-modèles ?**

Différents modèles ont différents points forts :
- **Claude Opus 4.5** : Excellent pour le raisonnement complexe et la conception d'architecture (coûteux mais de haute qualité)
- **GPT-5.2** : Excellent pour le débogage de code et le conseil stratégique
- **Gemini 3 Pro** : Excellent pour les tâches frontend et UI/UX (fortes capacités visuelles)
- **GPT-5 Nano** : Rapide et gratuit, idéal pour la recherche de code et l'exploration simple
- **GLM-4.7** : Excellent rapport qualité-prix, adapté à la recherche et à la consultation de documentation

L'intelligence de oh-my-opencode réside dans : **utiliser le modèle le plus adapté pour chaque tâche, plutôt que le même modèle pour toutes les tâches**.

## Emplacement des fichiers de configuration

oh-my-opencode prend en charge deux niveaux de configuration :

| Emplacement | Chemin | Priorité | Cas d'utilisation |
| --- | --- | --- | --- |
| **Configuration projet** | `.opencode/oh-my-opencode.json` | Basse | Configuration spécifique au projet (versionnée avec le code) |
| **Configuration utilisateur** | `~/.config/opencode/oh-my-opencode.json` | Haute | Configuration globale (partagée entre tous les projets) |

**Règle de fusion** : La configuration utilisateur écrase la configuration projet.

**Structure de fichier de configuration recommandée** :

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  // Active l'autocomplétion JSON Schema

  "agents": {
    // Surcharges de modèles pour les agents
  },
  "categories": {
    // Surcharges de modèles pour les catégories
  }
}
```

::: tip Autocomplétion Schema
Dans les éditeurs comme VS Code, après avoir ajouté le champ `$schema`, vous obtiendrez une autocomplétion complète et une vérification de type lors de la saisie de la configuration.
:::

## Méthodes de configuration des Providers

oh-my-opencode prend en charge 6 Providers principaux. La méthode de configuration varie selon le Provider.

### Anthropic Claude (Recommandé)

**Cas d'utilisation** : Orchestrateur principal Sisyphus et la plupart des agents centraux

**Étapes de configuration** :

1. **Exécuter l'authentification OpenCode** :
   ```bash
   opencode auth login
   ```

2. **Sélectionner le Provider** :
   - `Provider` : Sélectionnez `Anthropic`
   - `Login method` : Sélectionnez `Claude Pro/Max`

3. **Compléter le flux OAuth** :
   - Le système ouvrira automatiquement le navigateur
   - Connectez-vous à votre compte Claude
   - Attendez la fin de l'authentification

4. **Vérifier le succès** :
   ```bash
   opencode models | grep anthropic
   ```

   Vous devriez voir :
   - `anthropic/claude-opus-4-5`
   - `anthropic/claude-sonnet-4-5`
   - `anthropic/claude-haiku-4-5`

**Mapping des modèles** (Configuration par défaut de Sisyphus) :

| Agent | Modèle par défaut | Utilisation |
| --- | --- | --- |
| Sisyphus | `anthropic/claude-opus-4-5` | Orchestrateur principal, raisonnement complexe |
| Prometheus | `anthropic/claude-opus-4-5` | Planification de projet |
| Metis | `anthropic/claude-sonnet-4-5` | Analyse pré-planification |
| Momus | `anthropic/claude-opus-4-5` | Revue de plan |

### OpenAI (ChatGPT Plus)

**Cas d'utilisation** : Agent Oracle (revue d'architecture, débogage)

**Étapes de configuration** :

1. **Exécuter l'authentification OpenCode** :
   ```bash
   opencode auth login
   ```

2. **Sélectionner le Provider** :
   - `Provider` : Sélectionnez `OpenAI`
   - `Login method` : Sélectionnez OAuth ou API Key

3. **Compléter le flux d'authentification** (selon la méthode choisie)

4. **Vérifier le succès** :
   ```bash
   opencode models | grep openai
   ```

**Mapping des modèles** (Configuration par défaut d'Oracle) :

| Agent | Modèle par défaut | Utilisation |
| --- | --- | --- |
| Oracle | `openai/gpt-5.2` | Revue d'architecture, débogage |

**Exemple de surcharge manuelle** :

```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2",  // Utiliser GPT pour le raisonnement stratégique
      "temperature": 0.1
    }
  }
}
```

### Google Gemini (Recommandé)

**Cas d'utilisation** : Multimodal Looker (analyse média), tâches Frontend UI/UX

::: tip Fortement recommandé
Pour l'authentification Gemini, il est fortement recommandé d'installer le plugin [`opencode-antigravity-auth`](https://github.com/NoeFabris/opencode-antigravity-auth). Il offre :
- Équilibrage de charge multi-comptes (jusqu'à 10 comptes)
- Support du système de variantes (`low`/`high`)
- Double système de quota (Antigravity + Gemini CLI)
:::

**Étapes de configuration** :

1. **Ajouter le plugin d'authentification Antigravity** :
   
   Éditez `~/.config/opencode/opencode.json` :
   ```json
   {
     "plugin": [
       "oh-my-opencode",
       "opencode-antigravity-auth@latest"
     ]
   }
   ```

2. **Configurer les modèles Gemini** (Important) :
   
   Le plugin Antigravity utilise des noms de modèles différents. Vous devez copier la configuration complète des modèles dans `opencode.json`, en faisant attention à fusionner sans casser les paramètres existants.

   Modèles disponibles (quota Antigravity) :
   - `google/antigravity-gemini-3-pro` — variantes : `low`, `high`
   - `google/antigravity-gemini-3-flash` — variantes : `minimal`, `low`, `medium`, `high`
   - `google/antigravity-claude-sonnet-4-5` — pas de variantes
   - `google/antigravity-claude-sonnet-4-5-thinking` — variantes : `low`, `max`
   - `google/antigravity-claude-opus-4-5-thinking` — variantes : `low`, `max`

   Modèles disponibles (quota Gemini CLI) :
   - `google/gemini-2.5-flash`, `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

3. **Surcharger les modèles des agents** (dans `oh-my-opencode.json`) :
   
   ```jsonc
   {
     "agents": {
       "multimodal-looker": {
         "model": "google/antigravity-gemini-3-flash"
       }
     }
   }
   ```

4. **Exécuter l'authentification** :
   ```bash
   opencode auth login
   ```

5. **Sélectionner le Provider** :
   - `Provider` : Sélectionnez `Google`
   - `Login method` : Sélectionnez `OAuth with Google (Antigravity)`

6. **Compléter le flux d'authentification** :
   - Le système ouvrira automatiquement le navigateur
   - Complétez la connexion Google
   - Optionnel : Ajoutez d'autres comptes Google pour l'équilibrage de charge

**Mapping des modèles** (Configuration par défaut) :

| Agent | Modèle par défaut | Utilisation |
| --- | --- | --- |
| Multimodal Looker | `google/antigravity-gemini-3-flash` | Analyse PDF, images |

### GitHub Copilot (Provider de secours)

**Cas d'utilisation** : Option de secours quand le Provider natif est indisponible

::: info Provider de secours
GitHub Copilot agit comme un Provider proxy, routant les requêtes vers les modèles sous-jacents de votre abonnement.
:::

**Étapes de configuration** :

1. **Exécuter l'authentification OpenCode** :
   ```bash
   opencode auth login
   ```

2. **Sélectionner le Provider** :
   - `Provider` : Sélectionnez `GitHub`
   - `Login method` : Sélectionnez `Authenticate via OAuth`

3. **Compléter le flux OAuth GitHub**

4. **Vérifier le succès** :
   ```bash
   opencode models | grep github-copilot
   ```

**Mapping des modèles** (Quand GitHub Copilot est le meilleur Provider disponible) :

| Agent | Modèle | Utilisation |
| --- | --- | --- |
| Sisyphus | `github-copilot/claude-opus-4.5` | Orchestrateur principal |
| Oracle | `github-copilot/gpt-5.2` | Revue d'architecture |
| Explore | `opencode/gpt-5-nano` | Exploration rapide |
| Librarian | `zai-coding-plan/glm-4.7` (si Z.ai disponible) | Recherche de documentation |

### Z.ai Coding Plan (Optionnel)

**Cas d'utilisation** : Agent Librarian (recherche multi-dépôts, consultation de documentation)

**Caractéristiques** :
- Fournit le modèle GLM-4.7
- Excellent rapport qualité-prix
- Quand activé, **l'agent Librarian utilise toujours** `zai-coding-plan/glm-4.7`, indépendamment des autres Providers disponibles

**Étapes de configuration** :

Utilisez l'installateur interactif :

```bash
bunx oh-my-opencode install
# Quand demandé : "Do you have a Z.ai Coding Plan subscription?" → Sélectionnez "Yes"
```

**Mapping des modèles** (Quand Z.ai est le seul Provider disponible) :

| Agent | Modèle | Utilisation |
| --- | --- | --- |
| Sisyphus | `zai-coding-plan/glm-4.7` | Orchestrateur principal |
| Oracle | `zai-coding-plan/glm-4.7` | Revue d'architecture |
| Explore | `zai-coding-plan/glm-4.7-flash` | Exploration rapide |
| Librarian | `zai-coding-plan/glm-4.7` | Recherche de documentation |

### OpenCode Zen (Optionnel)

**Cas d'utilisation** : Fournit les modèles préfixés `opencode/` (Claude Opus 4.5, GPT-5.2, GPT-5 Nano, Big Pickle)

**Étapes de configuration** :

```bash
bunx oh-my-opencode install
# Quand demandé : "Do you have access to OpenCode Zen (opencode/ models)?" → Sélectionnez "Yes"
```

**Mapping des modèles** (Quand OpenCode Zen est le meilleur Provider disponible) :

| Agent | Modèle | Utilisation |
| --- | --- | --- |
| Sisyphus | `opencode/claude-opus-4-5` | Orchestrateur principal |
| Oracle | `opencode/gpt-5.2` | Revue d'architecture |
| Explore | `opencode/gpt-5-nano` | Exploration rapide |
| Librarian | `opencode/big-pickle` | Recherche de documentation |

## Système de résolution des modèles (Priorité en 3 étapes)

oh-my-opencode utilise un **mécanisme de priorité en 3 étapes** pour déterminer le modèle utilisé par chaque agent et catégorie. Ce mécanisme garantit que le système trouve toujours un modèle disponible.

### Étape 1 : Surcharge utilisateur

Si l'utilisateur a explicitement spécifié un modèle dans `oh-my-opencode.json`, ce modèle est utilisé.

**Exemple** :
```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2"  // Spécifié explicitement par l'utilisateur
    }
  }
}
```

Dans ce cas :
- ✅ Utilise directement `openai/gpt-5.2`
- ❌ Ignore l'étape de repli Provider

### Étape 2 : Repli Provider

Si l'utilisateur n'a pas explicitement spécifié de modèle, le système essaie chaque Provider dans la chaîne de priorité définie par l'agent jusqu'à trouver un modèle disponible.

**Chaîne de priorité Provider de Sisyphus** :

```
anthropic → github-copilot → opencode → antigravity → google
```

**Processus de résolution** :
1. Essayer `anthropic/claude-opus-4-5`
   - Disponible ? → Retourner ce modèle
   - Indisponible ? → Passer à l'étape suivante
2. Essayer `github-copilot/claude-opus-4-5`
   - Disponible ? → Retourner ce modèle
   - Indisponible ? → Passer à l'étape suivante
3. Essayer `opencode/claude-opus-4-5`
   - ...
4. Essayer `google/antigravity-claude-opus-4-5-thinking` (si configuré)
   - ...
5. Retourner le modèle par défaut du système

**Chaînes de priorité Provider pour tous les agents** :

| Agent | Modèle (sans préfixe) | Chaîne de priorité Provider |
| --- | --- | --- |
| **Sisyphus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Oracle** | `gpt-5.2` | openai → anthropic → google → github-copilot → opencode |
| **Librarian** | `big-pickle` | opencode → github-copilot → anthropic |
| **Explore** | `gpt-5-nano` | anthropic → opencode |
| **Multimodal Looker** | `gemini-3-flash` | google → openai → zai-coding-plan → anthropic → opencode |
| **Prometheus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Metis** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Momus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Atlas** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |

**Chaînes de priorité Provider pour les catégories** :

| Catégorie | Modèle (sans préfixe) | Chaîne de priorité Provider |
| --- | --- | --- |
| **ultrabrain** | `gpt-5.2-codex` | openai → anthropic → google → github-copilot → opencode |
| **artistry** | `gemini-3-pro` | google → openai → anthropic → github-copilot → opencode |
| **quick** | `claude-haiku-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **writing** | `gemini-3-flash` | google → openai → anthropic → github-copilot → opencode |

### Étape 3 : Valeur par défaut système

Si tous les Providers sont indisponibles, le modèle par défaut d'OpenCode est utilisé (lu depuis `opencode.json`).

**Ordre de priorité global** :

```
Surcharge utilisateur > Repli Provider > Valeur par défaut système
```

## Suivez le guide : Configurer plusieurs Providers

### Étape 1 : Planifier vos abonnements

Avant de commencer la configuration, faites l'inventaire de vos abonnements :

```markdown
- [ ] Anthropic Claude (Pro/Max)
- [ ] OpenAI ChatGPT Plus
- [ ] Google Gemini
- [ ] GitHub Copilot
- [ ] Z.ai Coding Plan
- [ ] OpenCode Zen
```

### Étape 2 : Utiliser l'installateur interactif (Recommandé)

oh-my-opencode fournit un installateur interactif qui gère automatiquement la plupart de la configuration :

```bash
bunx oh-my-opencode install
```

L'installateur vous demandera :
1. **Do you have a Claude Pro/Max Subscription?**
   - `yes, max20` → `--claude=max20`
   - `yes, regular` → `--claude=yes`
   - `no` → `--claude=no`

2. **Do you have an OpenAI/ChatGPT Plus Subscription?**
   - `yes` → `--openai=yes`
   - `no` → `--openai=no`

3. **Will you integrate Gemini models?**
   - `yes` → `--gemini=yes`
   - `no` → `--gemini=no`

4. **Do you have a GitHub Copilot Subscription?**
   - `yes` → `--copilot=yes`
   - `no` → `--copilot=no`

5. **Do you have access to OpenCode Zen (opencode/ models)?**
   - `yes` → `--opencode-zen=yes`
   - `no` → `--opencode-zen=no`

6. **Do you have a Z.ai Coding Plan subscription?**
   - `yes` → `--zai-coding-plan=yes`
   - `no` → `--zai-coding-plan=no`

**Mode non-interactif** (pour l'installation scriptée) :

```bash
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no
```

### Étape 3 : Authentifier chaque Provider

Une fois l'installateur terminé, authentifiez chaque Provider :

```bash
# Authentifier Anthropic
opencode auth login
# Provider: Anthropic
# Login method: Claude Pro/Max
# Compléter le flux OAuth

# Authentifier OpenAI
opencode auth login
# Provider: OpenAI
# Compléter le flux OAuth

# Authentifier Google Gemini (nécessite d'abord le plugin antigravity)
opencode auth login
# Provider: Google
# Login method: OAuth with Google (Antigravity)
# Compléter le flux OAuth

# Authentifier GitHub Copilot
opencode auth login
# Provider: GitHub
# Login method: Authenticate via OAuth
# Compléter OAuth GitHub
```

### Étape 4 : Vérifier la configuration

```bash
# Vérifier la version d'OpenCode
opencode --version
# Devrait être >= 1.0.150

# Voir tous les modèles disponibles
opencode models

# Exécuter le diagnostic doctor
bunx oh-my-opencode doctor --verbose
```

**Vous devriez voir** (exemple de sortie doctor) :

```
✅ OpenCode version: 1.0.150
✅ Plugin loaded: oh-my-opencode

📊 Model Resolution:
┌─────────────────────────────────────────────────────┐
│ Agent           │ Requirement            │ Resolved         │
├─────────────────────────────────────────────────────┤
│ Sisyphus        │ anthropic/claude-opus-4-5  │ anthropic/claude-opus-4-5 │
│ Oracle           │ openai/gpt-5.2              │ openai/gpt-5.2              │
│ Librarian        │ opencode/big-pickle           │ opencode/big-pickle           │
│ Explore          │ anthropic/gpt-5-nano          │ anthropic/gpt-5-nano          │
│ Multimodal Looker│ google/gemini-3-flash          │ google/gemini-3-flash          │
└─────────────────────────────────────────────────────┘

✅ All models resolved successfully
```

### Étape 5 : Personnaliser les modèles des agents (Optionnel)

Si vous souhaitez spécifier un modèle différent pour un agent particulier :

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle utilise GPT pour la revue d'architecture
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },

    // Librarian utilise un modèle moins cher pour la recherche
    "librarian": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Multimodal Looker utilise Antigravity Gemini
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash",
      "variant": "high"
    }
  }
}
```

### Étape 6 : Personnaliser les modèles de catégorie (Optionnel)

Spécifier des modèles pour différents types de tâches :

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "categories": {
    // Tâches rapides utilisent un modèle économique
    "quick": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Tâches frontend utilisent Gemini
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },

    // Tâches de raisonnement avancé utilisent GPT Codex
    "ultrabrain": {
      "model": "openai/gpt-5.2-codex",
      "temperature": 0.1
    }
  }
}
```

**Utilisation des catégories** :

```markdown
// Utiliser delegate_task dans la conversation
delegate_task(category="visual", prompt="Create a responsive dashboard component")
delegate_task(category="quick", skills=["git-master"], prompt="Commit these changes")
```

## Points de contrôle ✅

- [ ] `opencode --version` affiche une version >= 1.0.150
- [ ] `opencode models` liste les modèles de tous vos Providers configurés
- [ ] `bunx oh-my-opencode doctor --verbose` montre que tous les modèles des agents sont correctement résolus
- [ ] Vous pouvez voir `"oh-my-opencode"` dans le tableau `plugin` de `opencode.json`
- [ ] Essayez d'utiliser un agent (comme Sisyphus) pour confirmer que le modèle fonctionne correctement

## Pièges à éviter

### ❌ Piège 1 : Oublier d'authentifier le Provider

**Symptôme** : Provider configuré, mais la résolution du modèle échoue.

**Cause** : L'installateur a configuré le modèle, mais l'authentification n'a pas été complétée.

**Solution** :
```bash
opencode auth login
# Sélectionner le Provider correspondant et compléter l'authentification
```

### ❌ Piège 2 : Nom de modèle Antigravity incorrect

**Symptôme** : Gemini configuré, mais l'agent ne l'utilise pas.

**Cause** : Le plugin Antigravity utilise des noms de modèles différents (`google/antigravity-gemini-3-pro` au lieu de `google/gemini-3-pro`).

**Solution** :
```jsonc
{
  "agents": {
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash"  // Correct
      // model: "google/gemini-3-flash"  // ❌ Incorrect
    }
  }
}
```

### ❌ Piège 3 : Mauvais emplacement du fichier de configuration

**Symptôme** : Configuration modifiée, mais le système ne prend pas en compte les changements.

**Cause** : Mauvais fichier de configuration modifié (configuration utilisateur vs configuration projet).

**Solution** :
```bash
# Configuration utilisateur (globale, priorité haute)
~/.config/opencode/oh-my-opencode.json

# Configuration projet (locale, priorité basse)
.opencode/oh-my-opencode.json

# Vérifier quel fichier est utilisé
bunx oh-my-opencode doctor --verbose
```

### ❌ Piège 4 : Chaîne de priorité Provider interrompue

**Symptôme** : Un agent utilise toujours le mauvais modèle.

**Cause** : La surcharge utilisateur (Étape 1) ignore complètement le repli Provider (Étape 2).

**Solution** : Si vous voulez utiliser le repli automatique, ne codez pas en dur le modèle dans `oh-my-opencode.json`, laissez le système choisir automatiquement selon la chaîne de priorité.

**Exemple** :
```jsonc
{
  "agents": {
    "oracle": {
      // ❌ Codé en dur : utilise toujours GPT, même si Anthropic est disponible
      "model": "openai/gpt-5.2"
    }
  }
}
```

Pour utiliser le repli, supprimez le champ `model` et laissez le système choisir automatiquement :
```jsonc
{
  "agents": {
    "oracle": {
      // ✅ Automatique : anthropic → google → github-copilot → opencode
      "temperature": 0.1
    }
  }
}
```

### ❌ Piège 5 : Z.ai monopolise toujours Librarian

**Symptôme** : Même avec d'autres Providers configurés, Librarian utilise toujours GLM-4.7.

**Cause** : Quand Z.ai est activé, Librarian est codé en dur pour utiliser `zai-coding-plan/glm-4.7`.

**Solution** : Si vous ne voulez pas ce comportement, désactivez Z.ai :
```bash
bunx oh-my-opencode install --no-tui --zai-coding-plan=no
```

Ou surchargez manuellement :
```jsonc
{
  "agents": {
    "librarian": {
      "model": "opencode/big-pickle"  // Surcharge le codage en dur de Z.ai
    }
  }
}
```

## Résumé de la leçon

- oh-my-opencode prend en charge 6 Providers principaux : Anthropic, OpenAI, Google, GitHub Copilot, Z.ai, OpenCode Zen
- L'installateur interactif `bunx oh-my-opencode install` permet de configurer rapidement plusieurs Providers
- Le système de résolution des modèles sélectionne dynamiquement les modèles via une priorité en 3 étapes (Surcharge utilisateur → Repli Provider → Valeur par défaut système)
- Chaque agent et catégorie a sa propre chaîne de priorité Provider, garantissant qu'un modèle disponible est toujours trouvé
- La commande `doctor --verbose` permet de diagnostiquer la configuration de résolution des modèles
- Lors de la personnalisation des modèles d'agents et de catégories, veillez à ne pas casser le mécanisme de repli automatique

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Stratégie multi-modèles : Repli automatique et priorités](../model-resolution/)**.
>
> Vous apprendrez :
> - Le workflow complet du système de résolution des modèles
> - Comment concevoir la combinaison optimale de modèles pour différentes tâches
> - Les stratégies de contrôle de concurrence pour les tâches en arrière-plan
> - Comment diagnostiquer les problèmes de résolution des modèles

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition du Schema de configuration | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378 |
| Guide d'installation (Configuration Provider) | [`docs/guide/installation.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/guide/installation.md) | 1-299 |
| Référence de configuration (Résolution des modèles) | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 391-512 |
| Schema de surcharge des agents | [`src/config/schema.ts:AgentOverrideConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L98-L119) | 98-119 |
| Schema de configuration des catégories | [`src/config/schema.ts:CategoryConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L154-L172) | 154-172 |
| Documentation des chaînes de priorité Provider | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md#L445-L473) | 445-473 |

**Constantes clés** :
- Aucune : Les chaînes de priorité Provider sont codées en dur dans la documentation de configuration, pas comme constantes de code

**Fonctions clés** :
- Aucune : La logique de résolution des modèles est gérée par le cœur d'OpenCode, oh-my-opencode fournit la configuration et les définitions de priorité

</details>
