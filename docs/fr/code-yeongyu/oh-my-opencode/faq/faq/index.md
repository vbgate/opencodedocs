---
title: "FAQ : mode ultrawork | oh-my-opencode"
subtitle: "Questions fréquentes"
sidebarTitle: "Que faire en cas de problème"
description: "Découvrez les réponses aux questions fréquentes sur oh-my-opencode. Incluant le mode ultrawork, la collaboration multi-agents, les tâches en arrière-plan, Ralph Loop et le dépannage de la configuration."
tags:
  - "faq"
  - "dépannage"
  - "installation"
  - "configuration"
order: 160
---

# FAQ (Questions fréquentes)

## Ce que vous apprendrez

Après avoir lu cette FAQ, vous serez capable de :

- Trouver rapidement des solutions aux problèmes d'installation et de configuration
- Comprendre comment utiliser correctement le mode ultrawork
- Maîtriser les meilleures pratiques d'appel d'agents
- Comprendre les limites et restrictions de la compatibilité Claude Code
- Éviter les pièges courants de sécurité et de performance

---

## Installation et configuration

### Comment installer oh-my-opencode ?

**La méthode la plus simple** : laissez un agent AI installer pour vous.

Envoyez l'invite suivante à votre agent LLM (Claude Code, AmpCode, Cursor, etc.) :

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**Installation manuelle** : consultez le [Guide d'installation](../start/installation/).

::: tip Pourquoi recommander l'installation par agent AI ?
Les humains ont tendance à faire des erreurs lors de la configuration du format JSONC (oublier les guillemets, positionnement incorrect des deux-points). Laisser un agent AI gérer cela évite les erreurs de syntaxe courantes.
:::

### Comment désinstaller oh-my-opencode ?

Trois étapes pour nettoyer :

**Étape 1** : Retirer le plugin de la configuration OpenCode

Éditez `~/.config/opencode/opencode.json` (ou `opencode.jsonc`) et supprimez `"oh-my-opencode"` du tableau `plugin`.

```bash
# Utiliser jq pour supprimer automatiquement
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**Étape 2** : Supprimer le fichier de configuration (optionnel)

```bash
# Supprimer la configuration utilisateur
rm -f ~/.config/opencode/oh-my-opencode.json

# Supprimer la configuration projet (si elle existe)
rm -f .opencode/oh-my-opencode.json
```

**Étape 3** : Vérifier la suppression

```bash
opencode --version
# Le plugin ne devrait plus être chargé
```

### Où se trouvent les fichiers de configuration ?

Les fichiers de configuration existent à deux niveaux :

| Niveau | Emplacement | Utilisation | Priorité |
| --- | --- | --- | --- |
| Projet | `.opencode/oh-my-opencode.json` | Configuration spécifique au projet | Basse |
| Utilisateur | `~/.config/opencode/oh-my-opencode.json` | Configuration par défaut globale | Haute |

**Règle de fusion** : la configuration utilisateur remplace la configuration projet.

Le fichier de configuration prend en charge le format JSONC (JSON with Comments), vous pouvez ajouter des commentaires et des virgules finales :

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // Ceci est un commentaire
  "disabled_agents": [], // Virgule finale autorisée
  "agents": {}
}
```

### Comment désactiver une fonctionnalité ?

Utilisez les tableaux `disabled_*` dans le fichier de configuration :

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Options de compatibilité Claude Code** :

```json
{
  "claude_code": {
    "mcp": false,        // Désactiver le MCP de Claude Code
    "commands": false,    // Désactiver les Commands de Claude Code
    "skills": false,      // Désactiver les Skills de Claude Code
    "hooks": false        // Désactiver les hooks settings.json
  }
}
```

---

## Utilisation

### Qu'est-ce que ultrawork ?

**ultrawork** (ou abrégé `ulw`) est le mot magique — incluez-le dans votre invite pour activer automatiquement toutes les fonctionnalités :

- ✅ Tâches en arrière-plan parallèles
- ✅ Tous les agents spécialisés (Sisyphus, Oracle, Librarian, Explore, Prometheus, etc.)
- ✅ Mode d'exploration approfondie
- ✅ Mécanisme de forçage de complétion des todos

**Exemple d'utilisation** :

```
ultrawork Développer une API REST avec authentification JWT et gestion utilisateurs
```

Ou plus court :

```
ulw Refactoriser ce module
```

::: info Fonctionnement
Le Hook `keyword-detector` détecte les mots-clés `ultrawork` ou `ulw`, puis définit `message.variant` sur une valeur spéciale qui déclenche toutes les fonctionnalités avancées.
:::

### Comment appeler un agent spécifique ?

**Méthode 1 : utiliser le symbole @**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**Méthode 2 : utiliser l'outil delegate_task**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**Restrictions de permissions des agents** :

| Agent | Peut écrire du code | Peut exécuter Bash | Peut déléguer des tâches | Description |
| --- | --- | --- | --- | --- |
| Sisyphus | ✅ | ✅ | ✅ | Orchestrateur principal |
| Oracle | ❌ | ❌ | ❌ | Consultant lecture seule |
| Librarian | ❌ | ❌ | ❌ | Recherche lecture seule |
| Explore | ❌ | ❌ | ❌ | Recherche lecture seule |
| Multimodal Looker | ❌ | ❌ | ❌ | Analyse média lecture seule |
| Prometheus | ✅ | ✅ | ✅ | Planificateur |

### Comment fonctionnent les tâches en arrière-plan ?

Les tâches en arrière-plan vous permettent de faire travailler plusieurs agents AI en parallèle, comme une véritable équipe de développement :

**Démarrer une tâche en arrière-plan** :

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**Continuez votre travail...**

**Le système notifie automatiquement la complétion** (via le Hook `background-notification`)

**Récupérer les résultats** :

```
background_output(task_id="bg_abc123")
```

**Contrôle de concurrence** :

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**Priorité** : `modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip Pourquoi un contrôle de concurrence ?
Pour éviter le rate limiting de l'API et les coûts incontrôlés. Par exemple, Claude Opus 4.5 est coûteux, limitez sa concurrence ; Haiku est moins cher, vous pouvez augmenter sa concurrence.
:::

### Comment utiliser Ralph Loop ?

**Ralph Loop** est une boucle de développement autoréférente — travaille continuellement jusqu'à ce que la tâche soit terminée.

**Démarrage** :

```
/ralph-loop "Build a REST API with authentication"
/ralph-loop "Refactor the payment module" --max-iterations=50
```

**Comment détecter la complétion** : l'agent produit le marqueur `<promise>DONE</promise>`.

**Annuler la boucle** :

```
/cancel-ralph
```

**Configuration** :

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip Différence avec ultrawork
`/ralph-loop` est le mode normal, `/ulw-loop` est le mode ultrawork (toutes les fonctionnalités avancées activées).
:::

### Que sont les Categories et les Skills ?

**Categories** (ajouté en v3.0) : couche d'abstraction des modèles, sélectionne automatiquement le meilleur modèle selon le type de tâche.

**Categories intégrées** :

| Category | Modèle par défaut | Temperature | Cas d'usage |
| --- | --- | --- | --- |
| visual-engineering | google/gemini-3-pro | 0.7 | Frontend, UI/UX, design |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | Tâches de raisonnement haute intelligence |
| artistry | google/gemini-3-pro | 0.7 | Tâches créatives et artistiques |
| quick | anthropic/claude-haiku-4-5 | 0.1 | Tâches rapides et peu coûteuses |
| writing | google/gemini-3-flash | 0.1 | Documentation et écriture |

**Skills** : modules de connaissance spécialisés, injectant les meilleures pratiques d'un domaine spécifique.

**Skills intégrés** :

| Skill | Condition de déclenchement | Description |
| --- | --- | --- |
| playwright | Tâches liées au navigateur | Automatisation navigateur Playwright MCP |
| frontend-ui-ux | Tâches UI/UX | Designer transformé développeur, crée des interfaces magnifiques |
| git-master | Opérations Git (commit, rebase, squash) | Expert Git, commits atomiques, recherche d'historique |

**Exemple d'utilisation** :

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="Designer l'UI de cette page")
delegate_task(category="quick", skills=["git-master"], prompt="Commiter ces changements")
```

::: info Avantages
Les Categories optimisent les coûts (utilisent des modèles moins chers), les Skills assurent la qualité (injectent des connaissances spécialisées).
:::

---

## Compatibilité Claude Code

### Puis-je utiliser la configuration de Claude Code ?

**Oui**, oh-my-opencode fournit une **couche de compatibilité complète** :

**Types de configuration pris en charge** :

| Type | Emplacement de chargement | Priorité |
| --- | --- | --- |
| Commands | `~/.claude/commands/`, `.claude/commands/` | Basse |
| Skills | `~/.claude/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` | Moyenne |
| Agents | `~/.claude/agents/*.md`, `.claude/agents/*.md` | Haute |
| MCPs | `~/.claude/.mcp.json`, `.claude/.mcp.json` | Haute |
| Hooks | `~/.claude/settings.json`, `.claude/settings.json` | Haute |

**Priorité de chargement des configurations** :

Configuration projet OpenCode > Configuration utilisateur Claude Code

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Désactiver un plugin spécifique
    }
  }
}
```

### Puis-je utiliser un abonnement Claude Code ?

**Techniquement possible, mais non recommandé**.

::: warning Restrictions d'accès OAuth Claude
À compter de janvier 2026, Anthropic a restreint l'accès OAuth tiers, au motif de violation des CGU.
:::

**Déclaration officielle** (issue du README) :

> Il existe effectivement des outils communautaires qui falsifient les signatures de requête OAuth de Claude Code. Ces outils peuvent être techniquement indétectables, mais les utilisateurs doivent comprendre les implications des CGU, et je ne les recommande pas personnellement.
>
> **Ce projet n'est pas responsable des problèmes liés à l'utilisation d'outils non officiels, nous n'avons pas implémenté ces systèmes OAuth personnalisés.**

**Solution recommandée** : utilisez votre abonnement AI Provider existant (Claude, OpenAI, Gemini, etc.).

### Les données sont-elles compatibles ?

**Oui**, le format de stockage des données est compatible :

| Données | Emplacement | Format | Compatibilité |
| --- | --- | --- | --- |
| Todos | `~/.claude/todos/` | JSON | ✅ Compatible Claude Code |
| Transcriptions | `~/.claude/transcripts/` | JSONL | ✅ Compatible Claude Code |

Vous pouvez basculer de manière transparente entre Claude Code et oh-my-opencode.

---

## Sécurité et performance

### Y a-t-il des avertissements de sécurité ?

**Oui**, il y a un avertissement explicite en haut du README :

::: danger Avertissement : site d'usurpation
**ohmyopencode.com n'est pas affilié à ce projet.** Nous n'exploitons ni ne cautionnons ce site web.
>
> OhMyOpenCode est **gratuit et open source**. Ne téléchargez pas d'installateurs ou ne saisissez pas d'informations de paiement sur des sites tiers prétendant être "officiels".
>
> Comme le site d'usurpation se trouve derrière un paywall, nous **ne pouvons pas vérifier son contenu de distribution**. Considérez tout téléchargement en provenance de celui-ci comme **potentiellement non sécurisé**.
>
> ✅ Téléchargement officiel : https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### Comment optimiser les performances ?

**Stratégie 1 : utiliser le modèle approprié**

- Tâches rapides → utiliser la category `quick` (modèle Haiku)
- Conception UI → utiliser la category `visual` (Gemini 3 Pro)
- Raisonnement complexe → utiliser la category `ultrabrain` (GPT 5.2)

**Stratégie 2 : activer le contrôle de concurrence**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // Limiter la concurrence Anthropic
      "openai": 5       // Augmenter la concurrence OpenAI
    }
  }
}
```

**Stratégie 3 : utiliser les tâches en arrière-plan**

Laissez les modèles légers (comme Haiku) collecter des informations en arrière-plan, pendant que l'agent principal (Opus) se concentre sur la logique centrale.

**Stratégie 4 : désactiver les fonctionnalités non nécessaires**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // Désactiver les hooks Claude Code (si non utilisés)
  }
}
```

### Quelle version d'OpenCode est requise ?

**Recommandé** : OpenCode >= 1.0.132

::: warning Bug des anciennes versions
Si vous utilisez la version 1.0.132 ou une version antérieure, un bug d'OpenCode pourrait corrompre la configuration.
>
> Le correctif a été fusionné après la 1.0.132 — utilisez une version plus récente.
:::

Vérifier la version :

```bash
opencode --version
```

---

## Dépannage

### L'agent ne fonctionne pas ?

**Liste de vérification** :

1. ✅ Vérifier que le format du fichier de configuration est correct (syntaxe JSONC)
2. ✅ Vérifier la configuration du Provider (la clé API est-elle valide ?)
3. ✅ Exécuter l'outil de diagnostic : `oh-my-opencode doctor --verbose`
4. ✅ Consulter les messages d'erreur dans les logs OpenCode

**Problèmes courants** :

| Problème | Cause | Solution |
| --- | --- | --- |
| L'agent refuse la tâche | Erreur de configuration des permissions | Vérifier la configuration `agents.permission` |
| Timeout de la tâche en arrière-plan | Limites de concurrence trop strictes | Augmenter `providerConcurrency` |
| Erreur de bloc de réflexion | Le modèle ne supporte pas le thinking | Basculer vers un modèle supportant le thinking |

### Le fichier de configuration n'est pas pris en compte ?

**Causes possibles** :

1. Erreur de syntaxe JSON (guillemets ou virgules oubliés)
2. Emplacement incorrect du fichier de configuration
3. La configuration utilisateur ne remplace pas la configuration projet

**Étapes de vérification** :

```bash
# Vérifier que le fichier de configuration existe
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# Vérifier la syntaxe JSON
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**Validation avec JSON Schema** :

Ajoutez le champ `$schema` en début de fichier de configuration, l'éditeur affichera automatiquement les erreurs :

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### La tâche en arrière-plan ne se termine pas ?

**Liste de vérification** :

1. ✅ Vérifier le statut de la tâche : `background_output(task_id="...")`
2. ✅ Vérifier les limites de concurrence : y a-t-il des slots de concurrence disponibles ?
3. ✅ Consulter les logs : y a-t-il des erreurs de rate limiting API ?

**Annulation forcée de la tâche** :

```javascript
background_cancel(task_id="bg_abc123")
```

**TTL des tâches** : les tâches en arrière-plan sont automatiquement nettoyées après 30 minutes.

---

## Ressources supplémentaires

### Où demander de l'aide ?

- **GitHub Issues** : https://github.com/code-yeongyu/oh-my-opencode/issues
- **Communauté Discord** : https://discord.gg/PUwSMR9XNk
- **X (Twitter)** : https://x.com/justsisyphus

### Ordre de lecture recommandé

Si vous êtes débutant, nous vous recommandons de lire dans l'ordre suivant :

1. [Installation et configuration rapide](../start/installation/)
2. [À la découverte de Sisyphus : l'orchestrateur principal](../start/sisyphus-orchestrator/)
3. [Mode Ultrawork](../start/ultrawork-mode/)
4. [Diagnostic de configuration et dépannage](../troubleshooting/)

### Contribuer au code

Les Pull Requests sont les bienvenues ! Le projet est construit à 99% avec OpenCode.

Si vous souhaitez améliorer une fonctionnalité ou corriger un bug, veuillez :

1. Forker le dépôt
2. Créer une branche de fonctionnalité
3. Soumettre vos modifications
4. Pousser vers la branche
5. Créer une Pull Request

---

## Résumé de la leçon

Cette FAQ couvre les questions courantes sur oh-my-opencode, notamment :

- **Installation et configuration** : comment installer, désinstaller, emplacement des fichiers de configuration, désactivation des fonctionnalités
- **Conseils d'utilisation** : mode ultrawork, appel d'agents, tâches en arrière-plan, Ralph Loop, Categories et Skills
- **Compatibilité Claude Code** : chargement de configuration, limitations d'utilisation de l'abonnement, compatibilité des données
- **Sécurité et performance** : avertissements de sécurité, stratégies d'optimisation des performances, exigences de version
- **Dépannage** : problèmes courants et solutions

Retenez ces points clés :

- Utilisez les mots-clés `ultrawork` ou `ulw` pour activer toutes les fonctionnalités
- Laissez les modèles légers collecter des informations en arrière-plan, pendant que l'agent principal se concentre sur la logique centrale
- Le fichier de configuration prend en charge le format JSONC, vous pouvez ajouter des commentaires
- Les configurations Claude Code peuvent être chargées de manière transparente, mais l'accès OAuth est limité
- Téléchargez depuis le dépôt officiel GitHub, méfiez-vous des sites d'usurpation

## Aperçu de la leçon suivante

> Si vous rencontrez des problèmes de configuration spécifiques, consultez le **[Diagnostic de configuration et dépannage](../troubleshooting/)**.
>
> Vous apprendrez :
> - Comment utiliser les outils de diagnostic pour vérifier la configuration
> - La signification des codes d'erreur courants et leurs solutions
> - Les techniques de dépannage des problèmes de configuration Provider
> - Le diagnostic et les recommandations d'optimisation des problèmes de performance

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Keyword Detector (détection ultrawork) | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | Tout le répertoire |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Contrôle de concurrence | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | Tout le fichier |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | Tout le fichier |
| Delegate Task (analyse Category & Skill) | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Schéma de configuration | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | Tout le fichier |
| Hooks Claude Code | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | Tout le répertoire |

**Constantes clés** :
- `DEFAULT_MAX_ITERATIONS = 100` : nombre maximal d'itérations par défaut de Ralph Loop
- `TASK_TTL_MS = 30 * 60 * 1000` : TTL des tâches en arrière-plan (30 minutes)
- `POLL_INTERVAL_MS = 2000` : intervalle de polling des tâches en arrière-plan (2 secondes)

**Configuration clé** :
- `disabled_agents` : liste des agents désactivés
- `disabled_skills` : liste des skills désactivés
- `disabled_hooks` : liste des hooks désactivés
- `claude_code` : configuration de compatibilité Claude Code
- `background_task` : configuration de concurrence des tâches en arrière-plan
- `categories` : configuration personnalisée des Categories
- `agents` : configuration de remplacement des agents

</details>
