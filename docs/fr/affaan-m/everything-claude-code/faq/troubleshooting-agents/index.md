---
title: "Dépannage des Agents: Diagnostic et Réparation | Everything Claude Code"
sidebarTitle: "Que faire si un Agent plante"
subtitle: "Dépannage des Agents: Diagnostic et Réparation"
description: "Apprenez à résoudre les échecs d'appel des Agents Everything Claude Code. Couvre le diagnostic et la résolution des problèmes courants : Agents non chargés, erreurs de configuration, permissions d'outils insuffisantes, délais d'appel dépassés."
tags:
  - "agents"
  - "dépannage"
  - "faq"
prerequisite:
  - "platforms-agents-overview"
order: 170
---

# Dépannage des échecs d'appel d'Agent

## Votre problème

Vous rencontrez des difficultés avec les Agents ? Vous pourriez être confronté aux situations suivantes :

- Vous saisissez `/plan` ou une autre commande, mais l'Agent n'est pas appelé
- Vous voyez un message d'erreur : "Agent not found"
- L'exécution de l'Agent est en timeout ou bloquée
- La sortie de l'Agent ne correspond pas aux attentes
- L'Agent ne fonctionne pas selon les règles

Ne vous inquiétez pas, ces problèmes ont généralement des solutions claires. Ce cours vous aide à diagnostiquer et à réparer systématiquement les problèmes liés aux Agents.

## 🎒 Préparatifs

::: warning Vérifications préalables
Assurez-vous d'avoir :
1. ✅ Effectué l'[installation](../../start/installation/) d'Everything Claude Code
2. ✅ Compris le [concept d'Agents](../../platforms/agents-overview/) et les 9 sous-agents spécialisés
3. ✅ Tenté d'appeler un Agent (comme `/plan`, `/tdd`, `/code-review`)
:::

---

## Problème courant 1 : L'Agent n'est pas du tout appelé

### Symptôme
Vous saisissez `/plan` ou une autre commande, mais l'Agent n'est pas déclenché, c'est juste une conversation normale.

### Causes possibles

#### Cause A : Chemin de fichier Agent incorrect

**Problème** : Le fichier Agent n'est pas au bon endroit, Claude Code ne peut pas le trouver.

**Solution** :

Vérifiez que l'emplacement du fichier Agent est correct :

```bash
# Devrait être à l'un des emplacements suivants :
~/.claude/agents/              # Configuration utilisateur (globale)
.claude/agents/                 # Configuration projet
```

**Méthode de vérification** :

```bash
# Voir la configuration utilisateur
ls -la ~/.claude/agents/

# Voir la configuration projet
ls -la .claude/agents/
```

**Vous devriez voir 9 fichiers Agent** :
- `planner.md`
- `architect.md`
- `tdd-guide.md`
- `code-reviewer.md`
- `security-reviewer.md`
- `build-error-resolver.md`
- `e2e-runner.md`
- `refactor-cleaner.md`
- `doc-updater.md`

**Si les fichiers n'existent pas**, copiez-les depuis le répertoire du plugin Everything Claude Code :

```bash
# En supposant que le plugin est installé dans ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/agents/*.md ~/.claude/agents/

# Ou copiez depuis le dépôt cloné
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

#### Cause B : Fichier Command manquant ou chemin incorrect

**Problème** : Le fichier Command (comme `plan.md` pour `/plan`) n'existe pas ou le chemin est incorrect.

**Solution** :

Vérifiez l'emplacement des fichiers Command :

```bash
# Les Commands devraient être à l'un des emplacements suivants :
~/.claude/commands/             # Configuration utilisateur (globale)
.claude/commands/                # Configuration projet
```

**Méthode de vérification** :

```bash
# Voir la configuration utilisateur
ls -la ~/.claude/commands/

# Voir la configuration projet
ls -la .claude/commands/
```

**Vous devriez voir 14 fichiers Command** :
- `plan.md` → Appelle l'agent `planner`
- `tdd.md` → Appelle l'agent `tdd-guide`
- `code-review.md` → Appelle l'agent `code-reviewer`
- `build-fix.md` → Appelle l'agent `build-error-resolver`
- `e2e.md` → Appelle l'agent `e2e-runner`
- etc...

**Si les fichiers n'existent pas**, copiez les fichiers Command :

```bash
cp ~/.claude-plugins/everything-claude-code/commands/*.md ~/.claude/commands/
```

#### Cause C : Plugin non chargé correctement

**Problème** : Installé via le marketplace de plugins, mais le plugin n'est pas chargé correctement.

**Solution** :

Vérifiez la configuration du plugin dans `~/.claude/settings.json` :

```bash
# Voir la configuration des plugins
cat ~/.claude/settings.json | jq '.enabledPlugins'
```

**Vous devriez voir** :

```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Si non activé**, ajoutez manuellement :

```bash
# Éditer settings.json
nano ~/.claude/settings.json

# Ajouter ou modifier le champ enabledPlugins
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Redémarrez Claude Code pour que la configuration prenne effet**.

---

## Problème courant 2 : Erreur "Agent not found" lors de l'appel d'Agent

### Symptôme
Après avoir saisi une commande, vous voyez le message d'erreur : "Agent not found" ou "Could not find agent: xxx".

### Causes possibles

#### Cause A : Nom d'Agent dans le fichier Command ne correspond pas

**Problème** : Le champ `invokes` dans le fichier Command ne correspond pas au nom du fichier Agent.

**Solution** :

Vérifiez le champ `invokes` dans le fichier Command :

```bash
# Voir un fichier Command spécifique
cat ~/.claude/commands/plan.md | grep -A 5 "invokes"
```

**Structure du fichier Command** (exemple `plan.md`) :

```markdown
---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes **planner** agent...
```

**Vérifier que le fichier Agent existe** :

Le nom de l'agent mentionné dans le fichier Command (comme `planner`) doit correspondre à un fichier : `planner.md`

```bash
# Vérifier que le fichier Agent existe
ls -la ~/.claude/agents/planner.md

# S'il n'existe pas, vérifier s'il y a des fichiers avec un nom similaire
ls -la ~/.claude/agents/ | grep -i plan
```

**Exemples de non-correspondance courante** :

| Command invokes | Nom de fichier Agent réel | Problème |
|--- | --- | ---|
| `planner` | `planner.md` | ✅ Correct |
| `planner` | `Planner.md` | ❌ Incohérence de casse (Unix distingue les majuscules/minuscules) |
| `planner` | `planner.md.backup` | ❌ Extension de fichier incorrecte |
| `tdd-guide` | `tdd_guide.md` | ❌ Tiret vs souligné |

#### Cause B : Nom de fichier Agent incorrect

**Problème** : Le nom du fichier Agent ne correspond pas à ce qui est attendu.

**Solution** :

Vérifiez tous les noms de fichiers Agent :

```bash
# Lister tous les fichiers Agent
ls -la ~/.claude/agents/

# Les 9 fichiers Agent attendus
# planner.md
# architect.md
# tdd-guide.md
# code-reviewer.md
# security-reviewer.md
# build-error-resolver.md
# e2e-runner.md
# refactor-cleaner.md
# doc-updater.md
```

**Si le nom de fichier est incorrect**, renommez le fichier :

```bash
# Exemple : corriger le nom de fichier
cd ~/.claude/agents/
mv Planner.md planner.md
mv tdd_guide.md tdd-guide.md
```

---

## Problème courant 3 : Erreur de format Front Matter de l'Agent

### Symptôme
L'Agent est appelé, mais vous voyez le message d'erreur : "Invalid agent metadata" ou une erreur de format similaire.

### Causes possibles

#### Cause A : Champs requis manquants

**Problème** : Le Front Matter de l'Agent manque des champs requis (`name`, `description`, `tools`).

**Solution** :

Vérifiez le format du Front Matter de l'Agent :

```bash
# Voir l'en-tête d'un fichier Agent
head -20 ~/.claude/agents/planner.md
```

**Format Front Matter correct** :

```markdown
---
name: planner
description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.
tools: Read, Grep, Glob
model: opus
---
```

**Champs requis** :
- `name` : Nom de l'Agent (doit correspondre au nom du fichier, sans extension)
- `description` : Description de l'Agent (utilisé pour comprendre les responsabilités de l'Agent)
- `tools` : Liste des outils autorisés (séparés par des virgules)

**Champs optionnels** :
- `model` : Modèle préféré (`opus` ou `sonnet`)

#### Cause B : Champ Tools incorrect

**Problème** : Le champ `tools` utilise des noms d'outils incorrects ou un format incorrect.

**Solution** :

Vérifiez le champ `tools` :

```bash
# Extraire le champ tools
grep "^tools:" ~/.claude/agents/*.md
```

**Noms d'outils autorisés** (sensibles à la casse) :
- `Read`
- `Write`
- `Edit`
- `Bash`
- `Grep`
- `Glob`

**Erreurs courantes** :

| Écriture incorrecte | Écriture correcte | Problème |
|--- | --- | ---|
| `tools: read, grep, glob` | `tools: Read, Grep, Glob` | ❌ Erreur de casse |
| `tools: Read, Grep, Glob,` | `tools: Read, Grep, Glob` | ❌ Virgule finale (erreur de syntaxe YAML) |
| `tools: "Read, Grep, Glob"` | `tools: Read, Grep, Glob` | ❌ Pas besoin de guillemets |
| `tools: Read Grep Glob` | `tools: Read, Grep, Glob` | ❌ Manque de virgules de séparation |

#### Cause C : Erreur de syntaxe YAML

**Problème** : Erreur de format YAML dans le Front Matter (comme l'indentation, les guillemets, les caractères spéciaux).

**Solution** :

Validez le format YAML :

```bash
# Utiliser Python pour valider YAML
python3 -c "import yaml; yaml.safe_load(open('~/.claude/agents/planner.md'))"

# Ou utiliser yamllint (nécessite installation)
pip install yamllint
yamllint ~/.claude/agents/*.md
```

**Erreurs YAML courantes** :
- Indentation incohérente (YAML est sensible à l'indentation)
- Espace manquant après les deux-points : `name:planner` → `name: planner`
- Caractères spéciaux non échappés dans les chaînes (comme deux-points, dièse)
- Utilisation de tabulations pour l'indentation (YAML n'accepte que les espaces)

---

## Problème courant 4 : Exécution de l'Agent en timeout ou bloquée

### Symptôme
L'Agent commence l'exécution mais ne répond pas pendant longtemps ou est bloqué.

### Causes possibles

#### Cause A : Trop grande complexité de la tâche

**Problème** : La tâche demandée est trop complexe et dépasse les capacités de l'Agent.

**Solution** :

**Divisez la tâche en étapes plus petites** :

```
❌ Incorrect : Demander à l'Agent de traiter tout le projet en une seule fois
"Aide-moi à refactoriser tout le système d'authentification utilisateur, y compris tous les tests et la documentation"

✅ Correct : Exécuter étape par étape
Étape 1 : /plan refactoriser le système d'authentification utilisateur
Étape 2 : /tdd implémenter la première étape (API de connexion)
Étape 3 : /tdd implémenter la deuxième étape (API d'inscription)
...
```

**Utiliser d'abord la commande `/plan`** :

```
Utilisateur : /plan J'ai besoin de refactoriser le système d'authentification utilisateur

Agent (planner):
# Implementation Plan: Refactor User Authentication System

## Phase 1: Audit Current Implementation
- Review existing auth code
- Identify security issues
- List dependencies

## Phase 2: Design New System
- Define authentication flow
- Choose auth method (JWT, OAuth, etc.)
- Design API endpoints

## Phase 3: Implement Core Features
[détails des étapes...]

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

#### Cause B : Choix de modèle inapproprié

**Problème** : Grande complexité de la tâche, mais modèle plus faible utilisé (comme `sonnet` au lieu de `opus`).

**Solution** :

Vérifiez le champ `model` de l'Agent :

```bash
# Voir les modèles utilisés par tous les Agents
grep "^model:" ~/.claude/agents/*.md
```

**Configuration recommandée** :
- **Tâches intensives en raisonnement** (comme `planner`, `architect`) : utiliser `opus`
- **Génération/modification de code** (comme `tdd-guide`, `code-reviewer`) : utiliser `opus`
- **Tâches simples** (comme `refactor-cleaner`) : peut utiliser `sonnet`

**Modifier la configuration du modèle** :

Éditez le fichier Agent :

```markdown
---
name: my-custom-agent
description: Custom agent for...
tools: Read, Write, Edit, Bash, Grep
model: opus  # Utiliser opus pour améliorer les performances des tâches complexes
---
```

#### Cause C : Trop de fichiers lus

**Problème** : L'Agent a lu de nombreux fichiers, dépassant la limite de tokens.

**Solution** :

**Limiter la portée des fichiers lus par l'Agent** :

```
❌ Incorrect : Laisser l'Agent lire tout le projet
"Lire tous les fichiers du projet, puis analyser l'architecture"

✅ Correct : Spécifier les fichiers pertinents
"Lire les fichiers dans le répertoire src/auth/, analyser l'architecture du système d'authentification"
```

**Utiliser des motifs Glob pour une correspondance précise** :

```
Utilisateur : Aide-moi à optimiser les performances

L'Agent devrait :
# Utiliser Glob pour trouver les fichiers critiques de performance
Glob pattern="**/*.{ts,tsx}" path="src/api"

# Plutôt que
Glob pattern="**/*" path="."  # Lire tous les fichiers
```

---

## Problème courant 5 : Sortie de l'Agent ne correspond pas aux attentes

### Symptôme
L'Agent est appelé et s'exécute, mais la sortie ne correspond pas aux attentes ou n'est pas de bonne qualité.

### Causes possibles

#### Cause A : Description de la tâche pas claire

**Problème** : La demande de l'utilisateur est vague, l'Agent ne peut pas comprendre précisément les besoins.

**Solution** :

**Fournissez une description de tâche claire et spécifique** :

```
❌ Incorrect : Demande vague
"Aide-moi à optimiser le code"

✅ Correct : Demande spécifique
"Aide-moi à optimiser la fonction searchMarkets dans src/api/markets.ts,
améliorer les performances de la requête, objectif : réduire le temps de réponse de 500ms à moins de 100ms"
```

**Incluez les informations suivantes** :
- Noms de fichiers ou de fonctions spécifiques
- Objectifs clairs (performances, sécurité, lisibilité, etc.)
- Contraintes (ne pas casser les fonctionnalités existantes, maintenir la compatibilité, etc.)

#### Cause B : Manque de contexte

**Problème** : L'Agent manque d'informations de contexte nécessaires pour prendre les bonnes décisions.

**Solution** :

**Fournissez proactivement des informations de contexte** :

```
Utilisateur : Aide-moi à corriger l'échec des tests

❌ Incorrect : Pas de contexte
"npm test a une erreur, aide-moi à corriger"

✅ Correct : Fournir le contexte complet
"Lors de l'exécution de npm test, le test searchMarkets a échoué.
Le message d'erreur est : Expected 5 but received 0.
Je viens de modifier la fonction vectorSearch, cela pourrait être lié.
Aide-moi à localiser le problème et à le corriger."
```

**Utiliser Skills pour fournir des connaissances de domaine** :

Si le projet a une bibliothèque de compétences spécifique (`~/.claude/skills/`), l'Agent chargera automatiquement les connaissances pertinentes.

#### Cause C : Inadéquation du domaine de spécialisation de l'Agent

**Problème** : Utilisation d'un Agent inapproprié pour la tâche.

**Solution** :

**Choisissez le bon Agent en fonction du type de tâche** :

| Type de tâche | Recommandé | Commande |
|--- | --- | ---|
| Implémenter une nouvelle fonctionnalité | `tdd-guide` | `/tdd` |
| Planification de fonctionnalités complexes | `planner` | `/plan` |
| Revue de code | `code-reviewer` | `/code-review` |
| Audit de sécurité | `security-reviewer` | Appel manuel |
| Corriger les erreurs de build | `build-error-resolver` | `/build-fix` |
| Tests E2E | `e2e-runner` | `/e2e` |
| Nettoyer le code mort | `refactor-cleaner` | `/refactor-clean` |
| Mettre à jour la documentation | `doc-updater` | `/update-docs` |
| Conception de l'architecture système | `architect` | Appel manuel |

**Consultez [Vue d'ensemble des Agents](../../platforms/agents-overview/) pour了解 les responsabilités de chaque Agent**.

---

## Problème courant 6 : Permissions d'outils de l'Agent insuffisantes

### Symptôme
Lorsque l'Agent tente d'utiliser un outil, il est refusé avec l'erreur : "Tool not available: xxx".

### Causes possibles

#### Cause A : Champ Tools manque cet outil

**Problème** : Le champ `tools` dans le Front Matter de l'Agent n'inclut pas l'outil nécessaire.

**Solution** :

Vérifiez le champ `tools` de l'Agent :

```bash
# Voir les outils que l'Agent est autorisé à utiliser
grep -A 1 "^tools:" ~/.claude/agents/planner.md
```

**Si l'outil manque**, ajoutez-le au champ `tools` :

```markdown
---
name: my-custom-agent
description: Agent that needs to write code
tools: Read, Write, Edit, Grep, Glob  # Assurez-vous d'inclure Write et Edit
model: opus
---
```

**Scénarios d'utilisation des outils** :
- `Read` : Lire le contenu des fichiers (presque tous les Agents en ont besoin)
- `Write` : Créer de nouveaux fichiers
- `Edit` : Modifier des fichiers existants
- `Bash` : Exécuter des commandes (comme exécuter des tests, construire)
- `Grep` : Rechercher le contenu des fichiers
- `Glob` : Rechercher des chemins de fichiers

#### Cause B : Erreur d'orthographe du nom de l'outil

**Problème** : Le champ `tools` utilise un nom d'outil incorrect.

**Solution** :

**Vérifiez l'orthographe du nom de l'outil** (sensible à la casse) :

| ✅ Correct | ❌ Incorrect |
|--- | ---|
| `Read` | `read`, `READ` |
| `Write` | `write`, `WRITE` |
| `Edit` | `edit`, `EDIT` |
| `Bash` | `bash`, `BASH` |
| `Grep` | `grep`, `GREP` |
| `Glob` | `glob`, `GLOB` |

---

## Problème courant 7 : Agent Proactif non déclenché automatiquement

### Symptôme
Certains Agents devraient se déclencher automatiquement (comme appeler `code-reviewer` automatiquement après modification de code), mais ce n'est pas le cas.

### Causes possibles

#### Cause A : Conditions de déclenchement non satisfaites

**Problème** : La description de l'Agent indique `Use PROACTIVELY`, mais les conditions de déclenchement ne sont pas satisfaites.

**Solution** :

Vérifiez le champ `description` de l'Agent :

```bash
# Voir la description de l'Agent
grep "^description:" ~/.claude/agents/code-reviewer.md
```

**Exemple (code-reviewer)** :

```markdown
description: Reviews code for quality, security, and maintainability. Use PROACTIVELY when users write or modify code.
```

**Conditions de déclenchement Proactif** :
- L'utilisateur demande explicitement une revue de code
- Juste après l'écriture/modification du code
- Avant de préparer le commit du code

**Déclenchement manuel** :

Si le déclenchement automatique ne fonctionne pas, vous pouvez appeler manuellement :

```
Utilisateur : Aide-moi à revoir le code que je viens de faire

Ou utiliser la Commande :
Utilisateur : /code-review
```

---

## Outils et techniques de diagnostic

### Vérifier l'état de chargement des Agents

Vérifiez si Claude Code a correctement chargé tous les Agents :

```bash
# Voir les logs de Claude Code (si disponibles)
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log | grep -i agent

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait | Select-String "agent"
```

### Tester manuellement les Agents

Testez manuellement l'appel d'Agent dans Claude Code :

```
Utilisateur : Veuillez appeler l'agent planner pour m'aider à planifier une nouvelle fonctionnalité

# Observer si l'Agent est correctement appelé
# Vérifier si la sortie correspond aux attentes
```

### Valider le format Front Matter

Utilisez Python pour valider le Front Matter de tous les Agents :

```bash
#!/bin/bash

for file in ~/.claude/agents/*.md; do
    echo "Validating $file..."
    python3 << EOF
import yaml
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        # Extraire le front matter (entre ---)
        start = content.find('---')
        end = content.find('---', start + 3)
        if start == -1 or end == -1:
            print("Error: No front matter found")
            sys.exit(1)
        
        front_matter = content[start + 3:end].strip()
        metadata = yaml.safe_load(front_matter)
        
        # Vérifier les champs requis
        required = ['name', 'description', 'tools']
        for field in required:
            if field not in metadata:
                print(f"Error: Missing required field '{field}'")
                sys.exit(1)
        
        print("✅ Valid")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF
done
```

Sauvegardez sous `validate-agents.sh`, exécutez :

```bash
chmod +x validate-agents.sh
./validate-agents.sh
```

---

## Point de contrôle ✅

Vérifiez les éléments suivants un par un :

- [ ] Les fichiers Agent sont au bon emplacement (`~/.claude/agents/` ou `.claude/agents/`)
- [ ] Les fichiers Command sont au bon emplacement (`~/.claude/commands/` ou `.claude/commands/`)
- [ ] Le format Front Matter de l'Agent est correct (contient name, description, tools)
- [ ] Le champ Tools utilise les bons noms d'outils (sensible à la casse)
- [ ] Le champ `invokes` de la Commande correspond au nom du fichier Agent
- [ ] Le plugin est correctement activé dans `~/.claude/settings.json`
- [ ] La description de la tâche est claire et spécifique
- [ ] Le bon Agent est choisi pour la tâche

---

## Quand demander de l'aide

Si les méthodes ci-dessus ne résolvent pas le problème :

1. **Collecter les informations de diagnostic** :
    ```bash
    # Sortir les informations suivantes
    echo "Claude Code version: $(claude-code --version 2>/dev/null || echo 'N/A')"
    echo "Agent files:"
    ls -la ~/.claude/agents/
    echo "Command files:"
    ls -la ~/.claude/commands/
    echo "Plugin config:"
    cat ~/.claude/settings.json | jq '.enabledPlugins'
    ```

2. **Voir les GitHub Issues** :
    - Visitez [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
    - Recherchez des problèmes similaires

3. **Soumettre un Issue** :
    - Incluez le message d'erreur complet
    - Fournissez des informations sur le système d'exploitation et la version
    - Joignez le contenu des fichiers Agent et Command pertinents

---

## Résumé du cours

Les échecs d'appel d'Agent ont généralement les causes suivantes :

| Type de problème | Cause courante | Diagnostic rapide |
|--- | --- | ---|
| **Pas du tout appelé** | Chemins de fichiers Agent/Command incorrects, plugin non chargé | Vérifier l'emplacement des fichiers, valider la configuration du plugin |
| **Agent not found** | Non-correspondance des noms (Command invokes vs nom de fichier) | Valider les noms de fichiers et le champ invokes |
| **Erreur de format** | Champs Front Matter manquants, erreur de syntaxe YAML | Vérifier les champs requis, valider le format YAML |
| **Exécution en timeout** | Grande complexité de la tâche, choix de modèle inapproprié | Diviser la tâche, utiliser le modèle opus |
| **Sortie non conforme aux attentes** | Description de tâche pas claire, manque de contexte, Agent inadapté | Fournir une tâche spécifique, choisir le bon Agent |
| **Permissions d'outils insuffisantes** | Champ Tools manque des outils, erreur d'orthographe du nom | Vérifier le champ Tools, valider les noms d'outils |

Rappelez-vous : la plupart des problèmes peuvent être résolus en vérifiant les chemins de fichiers, en validant le format Front Matter, et en choisissant le bon Agent.

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons les **[Techniques d'optimisation des performances](../performance-tips/)**.
>
> Vous apprendrez :
> - Comment optimiser l'utilisation des tokens
> - Améliorer la vitesse de réponse de Claude Code
> - Stratégies de gestion de la fenêtre de contexte

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonction | Chemin du fichier | Lignes |
|--- | --- | ---|
| Configuration de la liste des plugins | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Planner Agent | [`agents/planner.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| TDD Guide Agent | [`agents/tdd-guide.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-281 |
| Plan Command | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| TDD Command | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-281 |
| Règles d'utilisation des Agents | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |

**Champs requis Front Matter** (tous les fichiers Agent) :
- `name` : Identifiant de l'Agent (doit correspondre au nom du fichier, sans l'extension `.md`)
- `description` : Description des fonctionnalités de l'Agent (inclut les conditions de déclenchement)
- `tools` : Liste des outils autorisés (séparés par des virgules : `Read, Grep, Glob`)
- `model` : Modèle préféré (`opus` ou `sonnet`, optionnel)

**Noms d'outils autorisés** (sensibles à la casse) :
- `Read` : Lire le contenu des fichiers
- `Write` : Créer de nouveaux fichiers
- `Edit` : Modifier des fichiers existants
- `Bash` : Exécuter des commandes
- `Grep` : Rechercher le contenu des fichiers
- `Glob` : Rechercher les chemins de fichiers

**Chemins de configuration clés** :
- Agents utilisateur : `~/.claude/agents/`
- Commands utilisateur : `~/.claude/commands/`
- Settings utilisateur : `~/.claude/settings.json`
- Agents projet : `.claude/agents/`
- Commands projet : `.claude/commands/`

**Configuration de chargement des plugins** (`~/.claude/settings.json`) :
```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

</details>
