---
title: "Intégration Claude Code : Configuration des permissions pour exécuter le pipeline | Tutoriel AI App Factory"
sidebarTitle: "Configurer Claude Code en 5 minutes"
subtitle: "Intégration Claude Code : Configuration des permissions pour exécuter le pipeline | Tutoriel AI App Factory"
description: "Apprenez à configurer les permissions de Claude Code pour exécuter le pipeline AI App Factory en toute sécurité. Découvrez comment générer automatiquement settings.local.json, le mécanisme de whitelist et les bonnes pratiques de configuration multiplateforme, tout en évitant l'utilisation du paramètre dangereux --dangerously-skip-permissions. Ce tutoriel couvre la gestion des chemins sous Windows/macOS/Linux et le débogage des erreurs de permissions courantes."
tags:
  - "Claude Code"
  - "Configuration des permissions"
  - "Assistant IA"
prerequisite:
  - "start-installation"
  - "start-init-project"
order: "50"
---

# Intégration Claude Code : Configuration des permissions pour exécuter le pipeline | Tutoriel AI App Factory

## Ce que vous saurez faire après ce cours

- Configurer les permissions de sécurité de Claude Code sans utiliser `--dangerously-skip-permissions`
- Comprendre la whitelist de permissions générée automatiquement par Factory
- Exécuter le pipeline complet en 7 étapes dans Claude Code
- Maîtriser la configuration multiplateforme des permissions (Windows/macOS/Linux)

## Votre situation actuelle

Lors de la première utilisation de Factory, vous pourriez rencontrer :

- **Permissions bloquées** : Claude Code indique « pas de permission pour lire le fichier »
- **Utilisation de paramètres dangereux** : contraint d'ajouter `--dangerously-skip-permissions` pour contourner les vérifications de sécurité
- **Configuration manuelle fastidieuse** : ne sait pas quelles opérations autoriser
- **Problèmes multiplateforme** : incohérence des permissions entre Windows et Unix

En réalité, Factory génère automatiquement la configuration complète des permissions, il suffit de l'utiliser correctement.

## Quand utiliser cette approche

Lorsque vous devez exécuter le pipeline Factory dans Claude Code :

- Après avoir utilisé `factory init` pour initialiser le projet (démarrage automatique)
- Lorsque vous utilisez `factory run` pour continuer le pipeline
- Au démarrage manuel de Claude Code

::: info Pourquoi recommander Claude Code ?
Claude Code est l'assistant de programmation IA officiel d'Anthropic, profondément intégré au système de permissions de Factory. Comparé à d'autres assistants IA, la gestion des permissions de Claude Code est plus fine et plus sécurisée.
:::

## Principe fondamental

La configuration des permissions de Factory utilise un **mécanisme de whitelist** : seules les opérations explicitement autorisées sont permises, toutes les autres sont bloquées.

### Catégories de la whitelist de permissions

| Catégorie | Opérations autorisées | Usage |
| --- | --- | --- |
| **Opérations fichiers** | Read/Write/Edit/Glob | Lire et modifier les fichiers du projet |
| **Opérations Git** | git add/commit/push etc. | Contrôle de version |
| **Opérations répertoire** | ls/cd/tree/pwd | Parcourir la structure des répertoires |
| **Outils de build** | npm/yarn/pnpm | Installer les dépendances, exécuter les scripts |
| **TypeScript** | tsc/npx tsc | Vérification de types |
| **Base de données** | npx prisma | Migrations et gestion de base de données |
| **Python** | python/pip | Système de conception UI |
| **Tests** | vitest/jest/test | Exécuter les tests |
| **Factory CLI** | factory init/run/continue | Commandes du pipeline |
| **Docker** | docker compose | Déploiement en conteneurs |
| **Opérations Web** | WebFetch(domain:...) | Récupérer la documentation API |
| **Skills** | superpowers/ui-ux-pro-max | Compétences des plugins |

### Pourquoi ne pas utiliser `--dangerously-skip-permissions` ?

| Méthode | Sécurité | Recommandée |
| --- | --- | --- |
| `--dangerously-skip-permissions` | ❌ Permet à Claude d'effectuer n'importe quelle opération (y compris supprimer des fichiers) | Non recommandé |
| Configuration whitelist | ✅ Ne permet que les opérations explicites, les dépassements génèrent une erreur | Recommandée |

Bien que la configuration de la whitelist soit plus complexe initialement, elle se réutilise automatiquement après une génération initiale et est plus sûre.

## 🎒 Préparation avant de commencer

Avant de commencer, vérifiez que :

- [x] Vous avez complété **l'installation et la configuration** ([start/installation/](../../start/installation/))
- [x] Vous avez complété **l'initialisation du projet Factory** ([start/init-project/](../../start/init-project/))
- [x] Claude Code est installé : https://claude.ai/code
- [x] Le répertoire du projet est initialisé (le répertoire `.factory/` existe)

::: warning Vérifier que Claude Code est installé
Exécutez la commande suivante dans le terminal pour confirmer :

```bash
claude --version
```

Si le message « command not found » s'affiche, installez d'abord Claude Code.
:::

## Suivez les étapes

### Étape 1 : Initialiser le projet (génération automatique des permissions)

**Pourquoi** : `factory init` génère automatiquement `.claude/settings.local.json` contenant la whitelist complète des permissions.

Dans le répertoire du projet, exécutez :

```bash
# Créer un nouveau répertoire et y accéder
mkdir my-factory-project && cd my-factory-project

# Initialiser le projet Factory
factory init
```

**Vous devriez voir** :

```
✓ Factory project initialized!
✓ Claude Code is starting...
  (Please wait for window to open)
```

La fenêtre Claude Code s'ouvre automatiquement et affiche le message suivant :

```
Veuillez lire .factory/pipeline.yaml et .factory/agents/orchestrator.checkpoint.md,
démarrer le pipeline et m'aider à transformer les fragments d'idée de produit en application fonctionnelle,
ensuite je vais entrer des fragments d'idée. Remarque : Les fichiers skills/ et policies/
référencés par l'Agent doivent d'abord être recherchés dans le répertoire .factory/, puis à la racine.
```

**Ce qui s'est passé** :

1. Création du répertoire `.factory/` contenant la configuration du pipeline
2. Génération de `.claude/settings.local.json` (whitelist de permissions)
3. Démarrage automatique de Claude Code avec les instructions de lancement

### Étape 2 : Vérifier la configuration des permissions

**Pourquoi** : Confirmer que le fichier de permissions a été correctement généré pour éviter les problèmes de permissions à l'exécution.

Vérifiez le fichier de permissions généré :

```bash
# Afficher le contenu du fichier de permissions
cat .claude/settings.local.json
```

**Vous devriez voir** (contenu partiel) :

```json
{
  "permissions": {
    "allow": [
      "Read(/path/to/project/**)",
      "Write(/path/to/project/**)",
      "Glob(/path/to/project/**)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(npm install:*)",
      "Bash(npx prisma generate:*)",
      "Skill(superpowers:brainstorming)",
      "Skill(ui-ux-pro-max)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.org)"
    ]
  },
  "features": {
    "autoSave": true,
    "telemetry": false
  }
}
```

::: tip Explication des chemins
Les chemins dans les permissions s'ajustent automatiquement selon votre système d'exploitation :

- **Windows** : `Read(//c/Users/...)` (la lettre de lecteur en minuscule et majuscule sont toutes deux prises en charge)
- **macOS/Linux** : `Read(/Users/...)` (chemin absolu)
:::

### Étape 3 : Lancer le pipeline dans Claude Code

**Pourquoi** : Claude Code est configuré avec les permissions, peut directement lire les définitions d'Agents et les fichiers de Skills.

Dans la fenêtre Claude Code déjà ouverte, entrez votre idée de produit :

```
Je veux créer une application mobile de suivi des dépenses pour aider les jeunes à enregistrer rapidement leurs dépenses quotidiennes,
éviter de dépasser le budget à la fin du mois. Les fonctionnalités principales sont l'enregistrement du montant, la sélection de la catégorie (alimentation, transport, divertissement, autres),
et voir le total des dépenses du mois.
```

**Vous devriez voir** :

Claude Code exécute les étapes suivantes (automatiquement) :

1. Lecture de `.factory/pipeline.yaml`
2. Lecture de `.factory/agents/orchestrator.checkpoint.md`
3. Démarrage de la **phase Bootstrap**, structuration de votre idée dans `input/idea.md`
4. Pause après completion, attente de votre confirmation

**Point de vérification ✅** : Confirmer que la phase Bootstrap est terminée

```bash
# Afficher l'idée structurée générée
cat input/idea.md
```

### Étape 4 : Continuer le pipeline

**Pourquoi** : Chaque phase terminée nécessite une confirmation manuelle pour éviter l'accumulation d'erreurs.

Dans Claude Code, répondez :

```
Continuer
```

Claude Code passe automatiquement à la phase suivante (PRD) et répète le processus « exécuter → pause → confirmer » jusqu'à ce que les 7 phases soient terminées.

::: tip Utiliser `factory run` pour redémarrer
Si la fenêtre Claude Code se ferme, vous pouvez exécuter dans le terminal :

```bash
factory run
```

Cela réaffiche les instructions d'exécution de Claude Code.
:::

### Étape 5 : Gestion des permissions multiplateforme (utilisateurs Windows)

**Pourquoi** : Les permissions de chemins Windows nécessitent un traitement spécial pour assurer que Claude Code peut accéder correctement aux fichiers du projet.

Si vous utilisez Windows, `factory init` génère automatiquement des permissions avec prise en charge des lettres de lecteur :

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Read(//C/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)",
      "Write(//C/Users/yourname/project/**)"
    ]
  }
}
```

**Point de vérification ✅** : Utilisateurs Windows, vérifiez les permissions

```powershell
# PowerShell
Get-Content .claude\settings.local.json | Select-String -Pattern "Read|Write"
```

Si vous voyez les deux formats de chemins `//c/` et `//C/`, la configuration est correcte.

## Points de vérification ✅

Après avoir completed les étapes ci-dessus, vous devriez être capable de :

- [x] Trouver le fichier `.claude/settings.local.json`
- [x] Voir la whitelist complète des permissions (contenant Read/Write/Bash/Skill/WebFetch)
- [x] Lancer avec succès la phase Bootstrap dans Claude Code
- [x] Vérifier `input/idea.md` pour confirmer que l'idée a été structurée
- [x] Continuer l'exécution du pipeline vers la phase suivante

Si vous rencontrez des erreurs de permissions, consultez la section « Avertissements et pièges » ci-dessous.

## Avertissements et pièges

### Problème 1 : Permissions bloquées

**Message d'erreur** :
```
Permission denied: Read(path/to/file)
```

**Causes** :
- Le fichier de permissions n'a pas été généré ou le chemin est incorrect
- Claude Code utilise un ancien cache de permissions

**Solutions** :

1. Vérifier que le fichier de permissions existe :

```bash
ls -la .claude/settings.local.json
```

2. Régénérer les permissions :

```bash
# Supprimer l'ancien fichier de permissions
rm .claude/settings.local.json

# Réinitialiser (régénérera le fichier)
factory init --force
```

3. Redémarrer Claude Code pour vider le cache.

### Problème 2 : Avertissement `--dangerously-skip-permissions`

**Message d'erreur** :
```
Using --dangerously-skip-permissions is not recommended.
```

**Causes** :
- `.claude/settings.local.json` non trouvé
- Le fichier de permissions a un format incorrect

**Solutions** :

Vérifier le format du fichier de permissions (syntaxe JSON) :

```bash
# Valider le format JSON
python -m json.tool .claude/settings.local.json
```

S'il y a une erreur de syntaxe, supprimez le fichier et réexécutez `factory init`.

### Problème 3 : Permissions de chemins Windows non fonctionnelles

**Message d'erreur** :
```
Permission denied: Read(C:\Users\yourname\project\file.js)
```

**Causes** :
- La configuration des permissions manque les chemins avec lettre de lecteur
- Le format de chemin est incorrect (Windows nécessite le format `//c/`)

**Solutions** :

Modifier manuellement `.claude\settings.local.json` pour ajouter les chemins avec lettre de lecteur :

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)"
    ]
  }
}
```

Notez que les deux casses de la lettre de lecteur doivent être prises en charge (`//c/` et `//C/`).

### Problème 4 : Permissions Skills bloquées

**Message d'erreur** :
```
Permission denied: Skill(superpowers:brainstorming)
```

**Causes** :
- Les plugins Claude Code requis (superpowers, ui-ux-pro-max) ne sont pas installés
- Incompatibilité de version des plugins

**Solutions** :

1. Ajouter le marché des plugins :

```bash
# Ajouter le marché des plugins superpowers
claude plugin marketplace add obra/superpowers-marketplace
```

2. Installer le plugin superpowers :

```bash
claude plugin install superpowers@superpowers-marketplace
```

3. Ajouter le marché des plugins ui-ux-pro-max :

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

4. Installer le plugin ui-ux-pro-max :

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

5. Réexécuter le pipeline.

::: info Factory essaiera automatiquement d'installer les plugins
La commande `factory init` essaiera automatiquement d'installer ces plugins. Si cela échoue, installez-les manuellement.
:::

## Résumé de ce cours

- La **whitelist de permissions** est plus sûre que `--dangerously-skip-permissions`
- **`factory init`** génère automatiquement `.claude/settings.local.json`
- La configuration des permissions inclut les catégories : **opérations fichiers, Git, outils de build, base de données, opérations Web**
- **Support multiplateforme** : Windows utilise les chemins `//c/`, Unix utilise les chemins absolus
- **Installation manuelle des plugins** : si l'installation automatique échoue, vous devez installer manuellement superpowers et ui-ux-pro-max dans Claude Code

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[OpenCode et autres assistants IA](../other-ai-assistants/)**.
>
> Vous apprendrez :
> - Comment exécuter le pipeline Factory dans OpenCode
> - Les méthodes d'intégration pour Cursor, GitHub Copilot et autres assistants IA
> - Les différences de configuration des permissions entre les différents assistants

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-29

| Fonction | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Génération de configuration des permissions | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-292 |
| Démarrage automatique de Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| Détection de l'assistant IA | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 105-124 |
| Génération des commandes Claude Code | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 138-156 |
| Traitement multiplateforme des chemins | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 14-67 |

**Fonctions clés** :
- `generatePermissions(projectDir)` : Génère la whitelist complète des permissions, incluant les opérations Read/Write/Bash/Skill/WebFetch
- `generateClaudeSettings(projectDir)` : Génère et écrit le fichier `.claude/settings.local.json`
- `launchClaudeCode(projectDir)` : Lance la fenêtre Claude Code et transmet les instructions de lancement
- `detectAIAssistant()` : Détecte le type d'assistant IA en cours d'exécution (Claude Code/Cursor/OpenCode)

**Constantes clés** :
- Modèle de chemins Windows : `Read(//c/**)`, `Write(//c/**)` (prise en charge de la lettre de lecteur en minuscule et majuscule)
- Modèle de chemins Unix : `Read(/path/to/project/**)`, `Write(/path/to/project/**)`
- Permissions Skills : `'Skill(superpowers:brainstorming)'`, `'Skill(ui-ux-pro-max)'`

**Catégories de la whitelist de permissions** :
- **Opérations fichiers** : Read/Write/Glob (prise en charge des caractères génériques)
- **Opérations Git** : git add/commit/push/pull etc. (ensemble complet des commandes Git)
- **Outils de build** : npm/yarn/pnpm install/build/test/dev
- **TypeScript** : tsc/npx tsc/npx type-check
- **Base de données** : npx prisma validate/generate/migrate/push
- **Python** : python/pip install (pour ui-ux-pro-max)
- **Tests** : vitest/jest/test
- **Factory CLI** : factory init/run/continue/status/reset
- **Docker** : docker compose/ps/build/run
- **Opérations Web** : WebFetch(domain:github.com) etc. (whitelist de domaines spécifiés)

</details>
