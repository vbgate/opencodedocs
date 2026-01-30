---
title: "OpenCode et autres assistants IA : 3 façons d'exécuter le pipeline | Tutoriel Agent App Factory"
sidebarTitle: "3 façons d'exécuter"
subtitle: "OpenCode et autres assistants IA : 3 façons d'exécuter le pipeline"
description: "Apprenez à exécuter le pipeline Agent App Factory avec OpenCode, Cursor et autres assistants IA. Ce tutoriel détaille les démarrages automatique et manuel, les différences de format de commande, les scénarios d'utilisation et les méthodes de dépannage."
tags:
  - "Assistant IA"
  - "OpenCode"
  - "Cursor"
  - "Exécution du pipeline"
prerequisite:
  - "start-installation"
order: 60
---

# OpenCode et autres assistants IA : 3 façons d'exécuter le pipeline

## Ce que vous saurez faire

- ✅ Utiliser OpenCode pour démarrer et exécuter le pipeline Factory
- ✅ Exécuter le pipeline avec Cursor
- ✅ Comprendre les différences de format de commande entre les assistants IA
- ✅ Choisir l'assistant IA approprié selon votre scénario d'utilisation

## Votre problème actuel

Vous avez initialisé un projet Factory, mais en dehors de Claude Code, vous ne savez pas comment exécuter le pipeline avec d'autres assistants IA. OpenCode et Cursor sont des assistants de programmation IA populaires, peuvent-ils exécuter le pipeline Factory ? Quelles sont les différences de démarrage et de format de commande ?

## Quand utiliser cette méthode

| Assistant IA | Scénario d'utilisation recommandé | Avantages |
| --- | --- | --- |
| **Claude Code** | Besoin de l'expérience en mode Agent la plus stable | Support natif du mode Agent, format de commande clair |
| **OpenCode** | Utilisateurs multiplateformes, besoin d'outils IA flexibles | Multiplateforme, support du mode Agent |
| **Cursor** | Utilisateurs intensifs de VS Code, habitués à l'écosystème VS Code | Intégration élevée, transition transparente |

::: tip Principe clé
La logique d'exécution de tous les assistants IA est identique : **Lire la définition de l'Agent → Exécuter le pipeline → Générer les artefacts**. Les différences résident uniquement dans le mode de démarrage et le format de commande.
:::

## 🎒 Préparatifs

Avant de commencer, assurez-vous de :

- ✅ Avoir terminé l'[installation et la configuration](../../start/installation/)
- ✅ Avoir initialisé le projet avec `factory init`
- ✅ Avoir installé OpenCode ou Cursor (au moins un)

## Idée clé : L'assistant IA comme moteur d'exécution du pipeline

L'**assistant IA** est le moteur d'exécution du pipeline, responsable de l'interprétation des définitions d'Agent et de la génération des artefacts. Le workflow principal comprend cinq étapes : premièrement lire `.factory/pipeline.yaml` pour comprendre l'ordre des étapes, puis charger l'orchestrateur pour maîtriser les contraintes d'exécution et les règles de vérification des autorisations, ensuite charger les fichiers de définition d'Agent correspondants selon l'état actuel, puis exécuter les commandes de l'Agent pour générer les artefacts et vérifier les conditions de sortie, enfin attendre la confirmation de l'utilisateur avant de passer à l'étape suivante.

::: info Important : L'assistant IA doit supporter le mode Agent
Le pipeline Factory dépend de la capacité de l'assistant IA à comprendre et exécuter des commandes Markdown complexes. Tous les assistants IA supportés (Claude Code, OpenCode, Cursor) possèdent la capacité du mode Agent.
:::

## Suivez-moi

### Étape 1 : Utiliser OpenCode pour exécuter le pipeline

#### Démarrage automatique (recommandé)

Si vous avez installé le CLI OpenCode globalement :

```bash
# Exécuter dans le répertoire racine du projet
factory init
```

`factory init` détectera automatiquement et démarrera OpenCode, en transmettant le prompt suivant :

```text
Veuillez lire .factory/pipeline.yaml et .factory/agents/orchestrator.checkpoint.md, démarrer le pipeline, m'aider à transformer les fragments d'idées de produit en application fonctionnelle, ensuite je vais saisir les fragments d'idées. Note : Les fichiers skills/ et policies/ référencés par l'Agent doivent d'abord rechercher dans le répertoire .factory/, puis dans le répertoire racine.
```

**Ce que vous devriez voir** :
- Le terminal affiche `Starting OpenCode...`
- La fenêtre OpenCode s'ouvre automatiquement
- Le prompt a été automatiquement collé dans le champ de saisie

#### Démarrage manuel

Si le démarrage automatique échoue, vous pouvez opérer manuellement :

1. Ouvrez l'application OpenCode
2. Ouvrez votre répertoire de projet Factory
3. Copiez le prompt suivant dans le champ de saisie OpenCode :

```text
Veuillez lire .factory/pipeline.yaml et .factory/agents/orchestrator.checkpoint.md, démarrer le pipeline, m'aider à transformer les fragments d'idées de produit en application fonctionnelle, ensuite je vais saisir les fragments d'idées. Note : Les fichiers skills/ et policies/ référencés par l'Agent doivent d'abord rechercher dans le répertoire .factory/, puis dans le répertoire racine.
```

4. Appuyez sur Entrée pour exécuter

#### Continuer l'exécution du pipeline

Si le pipeline a déjà atteint une certaine étape, vous pouvez utiliser la commande `factory run` pour continuer :

```bash
# Voir l'état actuel et générer les commandes
factory run

# Ou commencer à partir d'une étape spécifiée
factory run prd
```

OpenCode affichera des commandes similaires à Claude Code :

```
🤖 AI Assistant Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Please:

1. Read .factory/pipeline.yaml
2. Read .factory/agents/orchestrator.checkpoint.md
3. Read .factory/config.yaml
4. Execute pipeline from: bootstrap

Note: Check .factory/ first for skills/policies/ references, then root directory.
```

### Étape 2 : Utiliser Cursor pour exécuter le pipeline

Cursor est un assistant de programmation IA basé sur VS Code, utilisez la fonctionnalité Composer pour exécuter le pipeline Factory.

#### Détection de Cursor

Le CLI Factory détectera automatiquement l'environnement Cursor (via les variables d'environnement `CURSOR` ou `CURSOR_API_KEY`).

#### Utiliser Composer pour exécuter

1. Ouvrez votre répertoire de projet Factory dans Cursor
2. Exécutez la commande `factory run` :

```bash
factory run
```

3. Le terminal affichera les commandes spécifiques à Cursor :

```
🤖 Cursor Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Use Cursor Composer to:

1. @ReadFile .factory/pipeline.yaml
2. @ReadFile .factory/agents/orchestrator.checkpoint.md
3. @ReadFile .factory/config.yaml
   (Note: Check .factory/ first for skills/policies/ references)
4. Execute pipeline from: bootstrap
```

4. Copiez ces commandes dans le champ de saisie Cursor Composer
5. Exécutez

#### Point de contrôle ✅

- La fenêtre Cursor Composer est ouverte
- Le pipeline commence à s'exécuter, affichant l'étape actuelle (ex : `Running: bootstrap`)
- Les artefacts sont générés (ex : `input/idea.md`)

### Étape 3 : Comprendre les différences de format de commande entre les assistants IA

Bien que la logique d'exécution soit identique, les formats de commande des différents assistants IA ont des différences subtiles :

| Opération | Format Claude Code | Format Cursor | Autres assistants IA (OpenCode, etc.) |
| --- | --- | --- | --- |
| Lire un fichier | `Read(filePath)` | `@ReadFile filePath` | `Read filePath` |
| Lire plusieurs fichiers | `Read(file1)`, `Read(file2)` | `@ReadFile file1`, `@ReadFile file2` | - |
| Écrire un fichier | `Write(filePath, content)` | Écriture directe | - |
| Exécuter une commande Bash | `Bash(command)` | Exécution directe | - |

::: tip Le CLI Factory gère automatiquement
Lorsque vous exécutez `factory run`, le CLI détectera automatiquement le type d'assistant IA actuel et générera le format de commande correspondant. Vous n'avez qu'à copier-coller, pas besoin de conversion manuelle.
:::

### Étape 4 : Continuer l'exécution à partir d'une étape spécifiée

Si le pipeline a déjà terminé les premières étapes, vous pouvez continuer à partir de n'importe quelle étape :

```bash
# Commencer à partir de l'étape UI
factory run ui

# Commencer à partir de l'étape Tech
factory run tech

# Commencer à partir de l'étape Code
factory run code
```

Le CLI Factory affichera l'état actuel du pipeline :

```
Pipeline Status:
───────────────────────
Project: my-app
Status: Running
Current Stage: ui
Completed: bootstrap, prd

Available stages:
  ✓ bootstrap
  ✓ prd
  → ui
  ○ tech
  ○ code
  ○ validation
  ○ preview
```

### Étape 5 : Utiliser factory continue pour économiser des tokens (Claude Code uniquement)

::: warning Attention
La commande `factory continue` ne supporte actuellement que **Claude Code**. Si vous utilisez OpenCode ou Cursor, veuillez utiliser directement `factory run` pour démarrer manuellement une nouvelle session.
:::

Pour économiser des tokens et éviter l'accumulation de contexte, Claude Code supporte l'exécution multi-sessions :

```bash
# Ouvrir une nouvelle fenêtre de terminal, exécuter
factory continue
```

**Effet d'exécution** :
- Lit l'état actuel (`.factory/state.json`)
- Démarre automatiquement une nouvelle fenêtre Claude Code
- Continue à partir de l'étape où la session précédente s'est arrêtée

**Scénarios d'application** :
- Bootstrap → PRD terminés, vouloir créer une nouvelle session pour exécuter l'étape UI
- UI → Tech terminés, vouloir créer une nouvelle session pour exécuter l'étape Code
- Tout scénario nécessitant d'éviter un long historique de conversation

## Mises en garde

### Problème 1 : Échec du démarrage d'OpenCode

**Symptôme** : Après avoir exécuté `factory init`, OpenCode ne démarre pas automatiquement.

**Causes** :
- Le CLI OpenCode n'est pas ajouté au PATH
- OpenCode n'est pas installé

**Solutions** :

```bash
# Démarrer manuellement OpenCode
# Windows
%LOCALAPPDATA%\Programs\OpenCode\OpenCode.exe

# macOS
/Applications/OpenCode.app

# Linux (recherche par priorité : d'abord /usr/bin/opencode, puis /usr/local/bin/opencode)
/usr/bin/opencode
# Si le chemin ci-dessus n'existe pas, essayez :
/usr/local/bin/opencode
```

Ensuite, copiez manuellement le prompt et collez-le dans OpenCode.

### Problème 2 : Cursor Composer ne reconnaît pas les commandes

**Symptôme** : Après avoir copié les commandes générées par `factory run` dans Cursor Composer, aucune réponse.

**Causes** :
- La syntaxe `@ReadFile` de Cursor Composer nécessite une correspondance exacte
- Le chemin du fichier peut être incorrect

**Solutions** :
1. Confirmez l'utilisation de `@ReadFile` et non `Read` ou `ReadFile`
2. Confirmez que le chemin du fichier est relatif au répertoire racine du projet
3. Essayez d'utiliser un chemin absolu

**Exemple** :

```text
# ✅ Correct
@ReadFile .factory/pipeline.yaml

# ❌ Incorrect
Read(.factory/pipeline.yaml)
@readfile .factory/pipeline.yaml
```

### Problème 3 : Échec de la référence aux fichiers de compétences par l'Agent

**Symptôme** : L'Agent signale qu'il ne trouve pas `skills/bootstrap/skill.md` ou `policies/failure.policy.md`.

**Causes** :
- L'ordre de recherche de chemin de l'Agent est incorrect
- Le projet contient simultanément `.factory/` et les répertoires racine `skills/`, `policies/`

**Solutions** :
Tous les assistants IA suivent le même ordre de recherche :

1. **Rechercher en priorité** dans `.factory/skills/` et `.factory/policies/`
2. **Revenir au répertoire racine** `skills/` et `policies/`

Assurez-vous que :
- Après l'initialisation du projet Factory, `skills/` et `policies/` ont été copiés dans `.factory/`
- Dans la définition de l'Agent, il est clairement indiqué : "d'abord rechercher dans le répertoire `.factory/`, puis dans le répertoire racine"

### Problème 4 : État du pipeline non synchronisé

**Symptôme** : L'assistant IA affiche qu'une étape est terminée, mais `factory run` affiche toujours l'état `running`.

**Causes** :
- L'assistant IA a mis à jour manuellement `state.json`, mais cela est incompatible avec l'état du CLI
- Plusieurs fenêtres peuvent avoir modifié simultanément le fichier d'état

**Solutions** :
```bash
# Réinitialiser l'état du projet
factory reset

# Réexécuter le pipeline
factory run
```

::: warning Meilleure pratique
Évitez d'exécuter simultanément le pipeline du même projet dans plusieurs fenêtres d'assistants IA. Cela entraînera des conflits d'état et des écrasements d'artefacts.
:::

## Résumé du cours

Dans ce cours, nous avons appris à utiliser OpenCode, Cursor et autres assistants IA pour exécuter le pipeline Factory :

**Points clés** :
- ✅ Factory supporte plusieurs assistants IA (Claude Code, OpenCode, Cursor)
- ✅ `factory init` détecte automatiquement et démarre les assistants IA disponibles
- ✅ `factory run` génère les commandes correspondantes selon l'assistant IA actuel
- ✅ `factory continue` (Claude Code uniquement) supporte l'exécution multi-sessions, économisant les tokens
- ✅ Tous les assistants IA suivent la même logique d'exécution, seuls les formats de commande diffèrent

**Fichiers clés** :
- `.factory/pipeline.yaml` — Définition du pipeline
- `.factory/agents/orchestrator.checkpoint.md` — Règles de l'orchestrateur
- `.factory/state.json` — État du pipeline

**Recommandations de choix** :
- Claude Code : L'expérience en mode Agent la plus stable (recommandé)
- OpenCode : Premier choix pour les utilisateurs multiplateformes
- Cursor : Utilisateurs intensifs de VS Code

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Installation des plugins requis](../plugins/)**.
>
> Vous apprendrez :
> - Pourquoi il est nécessaire d'installer les plugins superpowers et ui-ux-pro-max
> - Comment installer les plugins automatiquement ou manuellement
> - Comment gérer les échecs d'installation de plugins

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Fonction | Chemin du fichier | Lignes |
| --- | --- | --- |
| Démarrage OpenCode | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Démarrage Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| Détection de l'assistant IA | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L105-L124) | 105-124 |
| Génération de commandes | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L130-L183) | 130-183 |

**Constantes clés** :
- `CLAUDE_CODE` / `ANTHROPIC_API_KEY` : Détection des variables d'environnement Claude Code (run.js:109-110)
- `CURSOR` / `CURSOR_API_KEY` : Détection des variables d'environnement Cursor (run.js:114-115)
- `OPENCODE` / `OPENCODE_VERSION` : Détection des variables d'environnement OpenCode (run.js:119-120)

**Fonctions clés** :
- `launchClaudeCode(projectDir)` : Démarrer Claude Code et transmettre le prompt (init.js:119-147)
- `launchOpenCode(projectDir)` : Démarrer OpenCode, supporte deux modes CLI et exécutable (init.js:152-215)
- `detectAIAssistant()` : Détecter le type d'assistant IA actuel via les variables d'environnement (run.js:105-124)
- `getAssistantInstructions(assistant, ...)` : Générer les commandes correspondantes selon le type d'assistant IA (run.js:130-183)

</details>
