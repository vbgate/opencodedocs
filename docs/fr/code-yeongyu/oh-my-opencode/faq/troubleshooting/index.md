---
title: "Dépannage : Commande Doctor | oh-my-opencode"
subtitle: "Utilisation de la commande Doctor pour le diagnostic de configuration"
sidebarTitle: "Dépannage"
description: "Apprenez les méthodes de diagnostic de la commande doctor de oh-my-opencode. Exécutez 17+ vérifications de santé incluant la version, les plugins, l'authentification et les modèles pour résoudre rapidement les problèmes."
tags:
  - "dépannage"
  - "diagnostics"
  - "configuration"
prerequisite:
  - "start-installation"
order: 150
---

# Diagnostics de Configuration et Dépannage : Utilisation de la Commande Doctor pour Résoudre Rapidement les Problèmes

## Ce que Vous Apprendrez

- Exécuter `oh-my-opencode doctor` pour diagnostiquer rapidement 17+ vérifications de santé
- Localiser et corriger des problèmes comme la version obsolète d'OpenCode, les plugins non enregistrés, les problèmes de configuration de Provider
- Comprendre le mécanisme de résolution de modèles et vérifier les assignations de modèles d'agents et de catégories
- Utiliser le mode verbeux pour obtenir des informations complètes pour le diagnostic de problèmes

## Votre Défi Actuel

Après avoir installé oh-my-opencode, que faites-vous lorsque vous rencontrez :

- OpenCode signale que le plugin n'est pas chargé, mais le fichier de configuration semble correct
- Certains agents IA renvoient toujours une erreur "Modèle introuvable"
- Vous voulez vérifier que tous les Providers (Claude, OpenAI, Gemini) sont correctement configurés
- Vous n'êtes pas sûr si le problème provient de l'installation, de la configuration ou de l'authentification

Le dépannage un par un prend du temps. Vous avez besoin d'un **outil de diagnostic en un clic**.

## Concepts Fondamentaux

**La commande Doctor est le système de vérification de santé de oh-my-opencode**, similaire à l'Utilitaire de Disque de Mac ou au scanner de diagnostic d'une voiture. Il vérifie systématiquement votre environnement et vous indique ce qui fonctionne et ce qui a des problèmes.

La logique de vérification du Doctor provient entièrement de l'implémentation du code source (`src/cli/doctor/checks/`), incluant :
- ✅ **installation** : version d'OpenCode, enregistrement des plugins
- ✅ **configuration** : format du fichier de configuration, validation du schéma
- ✅ **authentification** : plugins d'authentification Anthropic, OpenAI, Google
- ✅ **dépendances** : dépendances Bun, Node.js, Git
- ✅ **outils** : statut des serveurs LSP et MCP
- ✅ **mises à jour** : vérifications des mises à jour de version

## Suivez le Guide

### Étape 1 : Exécuter les Diagnostics de Base

**Pourquoi**
Exécutez d'abord une vérification complète pour comprendre l'état de santé global.

```bash
bunx oh-my-opencode doctor
```

**Vous Devriez Voir** :

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**Point de Contrôle ✅** :
- [ ] Voir les résultats pour 6 catégories
- [ ] Chaque élément a un marqueur ✓ (réussi), ⚠ (avertissement), ✗ (échec)
- [ ] Statistiques de résumé en bas

### Étape 2 : Interpréter les Problèmes Courants

Sur la base des résultats de diagnostic, vous pouvez localiser rapidement les problèmes. Voici les erreurs courantes et leurs solutions :

#### ✗ "Version d'OpenCode trop ancienne"

**Problème** : La version d'OpenCode est inférieure à 1.0.150 (exigence minimale)

**Cause** : oh-my-opencode dépend de nouvelles fonctionnalités d'OpenCode que les anciennes versions ne supportent pas

**Solution** :

```bash
# Mettre à jour OpenCode
npm install -g opencode@latest
# Ou utiliser Bun
bun install -g opencode@latest
```

**Vérification** : Réexécuter `bunx oh-my-opencode doctor`

#### ✗ "Plugin non enregistré"

**Problème** : Le plugin n'est pas enregistré dans le tableau `plugin` de `opencode.json`

**Cause** : Le processus d'installation a été interrompu, ou le fichier de configuration a été modifié manuellement

**Solution** :

```bash
# Réexécuter l'installateur
bunx oh-my-opencode install
```

**Base du Code Source** (`src/cli/doctor/checks/plugin.ts:79-117`) :
- Vérifie si le plugin est dans le tableau `plugin` de `opencode.json`
- Supporte les formats : `oh-my-opencode` ou `oh-my-opencode@version` ou chemin `file://`

#### ✗ "La configuration a des erreurs de validation"

**Problème** : Le fichier de configuration ne correspond pas à la définition du schéma

**Cause** : Erreurs introduites lors de la modification manuelle (comme des fautes de frappe, des incompatibilités de types)

**Solution** :

1. Utiliser `--verbose` pour voir les informations d'erreur détaillées :

```bash
bunx oh-my-opencode doctor --verbose
```

2. Types d'erreurs courants (à partir de `src/config/schema.ts`) :

| Message d'Erreur | Cause | Correction |
|------------------|-------|-----------|
| `agents.sisyphus.mode: Invalid enum value` | `mode` ne peut être que `subagent`/`primary`/`all` | Changer en `primary` |
| `categories.quick.model: Expected string` | `model` doit être une chaîne | Ajouter des guillemets : `"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | La concurrence doit être un nombre | Changer en nombre : `3` |

3. Consulter la [Référence de Configuration](../../appendix/configuration-reference/) pour vérifier les définitions des champs

#### ⚠ "Plugin d'authentification non installé"

**Problème** : Le plugin d'authentification pour le Provider n'est pas installé

**Cause** : Ce Provider a été ignoré lors de l'installation, ou le plugin a été désinstallé manuellement

**Solution** :

```bash
# Réinstaller et sélectionner le Provider manquant
bunx oh-my-opencode install
```

**Base du Code Source** (`src/cli/doctor/checks/auth.ts:11-15`) :

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### Étape 3 : Vérifier la Résolution de Modèles

La résolution de modèles est le mécanisme central de oh-my-opencode, vérifiant si les assignations de modèles d'agents et de catégories sont correctes.

```bash
bunx oh-my-opencode doctor --category configuration
```

**Vous Devriez Voir** :

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══

    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15
    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh

  ═══ Configured Models ═══

  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...

  Categories:
    ○ visual-engineering: google/gemini-3-pro
    ○ ultrabrain: openai/gpt-5.2-codex
    ...

  ○ = provider fallback
```

**Point de Contrôle ✅** :
- [ ] Voir les assignations de modèles d'Agents et de Catégories
- [ ] `○` signifie utilisation du mécanisme de repli du Provider (pas de remplacement manuel)
- [ ] `●` signifie que l'utilisateur a remplacé le modèle par défaut dans la configuration

**Problèmes Courants** :

| Problème | Cause | Solution |
|----------|-------|----------|
| Modèle `unknown` | La chaîne de repli du Provider est vide | S'assurer qu'au moins un Provider est disponible |
| Modèle non utilisé | Provider non connecté | Exécuter `opencode` pour connecter le Provider |
| Vouloir remplacer le modèle | Utilisation du modèle par défaut | Définir `agents.<name>.model` dans `oh-my-opencode.json` |

**Base du Code Source** (`src/cli/doctor/checks/model-resolution.ts:129-148`) :
- Lit les modèles disponibles à partir de `~/.cache/opencode/models.json`
- Exigences de modèles d'agents : `AGENT_MODEL_REQUIREMENTS` (`src/shared/model-requirements.ts`)
- Exigences de modèles de catégories : `CATEGORY_MODEL_REQUIREMENTS`

### Étape 4 : Utiliser la Sortie JSON (Scripting)

Si vous voulez automatiser les diagnostics dans CI/CD, utilisez le format JSON :

```bash
bunx oh-my-opencode doctor --json
```

**Vous Devriez Voir** :

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**Cas d'Utilisation** :

```bash
# Sauvegarder le rapport de diagnostic dans un fichier
bunx oh-my-opencode doctor --json > doctor-report.json

# Vérifier l'état de santé dans CI/CD
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "All checks passed"
else
  echo "Some checks failed"
  exit 1
fi
```

## Pièges Courants

### Piège 1 : Ignorer les Messages d'Avertissement

**Problème** : Voir les marqueurs `⚠` et penser qu'ils sont "optionnels", alors qu'ils peuvent être des indices importants

**Solution** :
- Par exemple : l'avertissement "using default model" signifie que vous n'avez pas configuré les modèles de Catégories, ce qui pourrait ne pas être optimal
- Utiliser `--verbose` pour voir les informations détaillées et décider si une action est nécessaire

### Piège 2 : Modifier Manuellement opencode.json

**Problème** : Modifier directement `opencode.json` d'OpenCode, cassant l'enregistrement du plugin

**Solution** :
- Utiliser `bunx oh-my-opencode install` pour réenregistrer
- Ou ne modifier que `oh-my-opencode.json`, ne pas toucher au fichier de configuration d'OpenCode

### Piège 3 : Cache Non Actualisé

**Problème** : La résolution de modèles affiche "cache not found", mais le Provider est configuré

**Solution** :

```bash
# Démarrer OpenCode pour actualiser le cache des modèles
opencode

# Ou actualiser manuellement (si la commande opencode models existe)
```

## Résumé

La commande Doctor est le couteau suisse de oh-my-opencode, vous aidant à localiser rapidement les problèmes :

| Commande | Objectif | Quand Utiliser |
|----------|-----------|----------------|
| `bunx oh-my-opencode doctor` | Diagnostic complet | Après l'installation initiale, lors de la rencontre de problèmes |
| `--verbose` | Informations détaillées | Besoin de voir les détails des erreurs |
| `--json` | Sortie JSON | CI/CD, automatisation de scripts |
| `--category <name>` | Vérification d'une seule catégorie | Vouloir vérifier uniquement un aspect spécifique |

**Rappelez-vous** : Chaque fois que vous rencontrez un problème, exécutez d'abord `doctor`, comprenez clairement l'erreur avant de prendre des mesures.

## À Venir

> Dans la prochaine leçon, nous apprendrons **[Questions Fréquentes](../faq/)**.
>
> Vous apprendrez :
> - Les différences entre oh-my-opencode et autres outils IA
> - Comment optimiser les coûts d'utilisation des modèles
> - Les meilleures pratiques pour le contrôle de la concurrence des tâches en arrière-plan

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquer pour développer les emplacements du code source</strong></summary>

> Mis à jour : 2026-01-26

| Fonctionnalité | Chemin du Fichier | Numéros de Ligne |
|----------------|-------------------|------------------|
| Entrée de la commande Doctor | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| Enregistrement de toutes les vérifications | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| Vérification de l'enregistrement du plugin | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| Vérification de la validation de configuration | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| Vérification de l'authentification | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| Vérification de la résolution de modèles | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| Schéma de Configuration | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| Définition des exigences de modèles | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | Fichier entier |

**Constantes Clés** :
- `MIN_OPENCODE_VERSION = "1.0.150"` : Exigence de version minimale d'OpenCode
- `AUTH_PLUGINS` : Mappage des plugins d'authentification (Anthropic=built-in, OpenAI/GitHub=plugins)
- `AGENT_MODEL_REQUIREMENTS` : Exigences de modèles d'agents (chaîne de priorité de chaque agent)
- `CATEGORY_MODEL_REQUIREMENTS` : Exigences de modèles de catégories (visuel, rapide, etc.)

**Fonctions Clés** :
- `doctor(options)` : Exécuter la commande de diagnostic, retourne le code de sortie
- `getAllCheckDefinitions()` : Obtenir toutes les définitions des 17+ éléments de vérification
- `checkPluginRegistration()` : Vérifier si le plugin est enregistré dans opencode.json
- `validateConfig(configPath)` : Valider que le fichier de configuration correspond au schéma
- `checkAuthProvider(providerId)` : Vérifier le statut du plugin d'authentification du Provider
- `checkModelResolution()` : Vérifier la résolution et l'assignation des modèles

</details>
