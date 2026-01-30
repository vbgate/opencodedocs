---
title: "Guide de contribution : Soumettre des configurations | Everything Claude Code"
sidebarTitle: "Soumettez votre première configuration"
subtitle: "Guide de contribution : Soumettre des configurations"
description: "Apprenez le processus standardisé pour soumettre des configurations à Everything Claude Code. Maîtrisez le fork du projet, la création de branches, le suivi des formats, les tests locaux et la soumission de PR."
tags:
  - "contributing"
  - "agents"
  - "skills"
  - "commands"
  - "hooks"
  - "rules"
  - "mcp"
  - "github"
prerequisite:
  - "start-installation"
  - "start-quickstart"
order: 230
---

# Guide de contribution : Comment contribuer au projet avec des configurations, agents et skills

## Ce que vous apprendrez

- Comprendre le processus de contribution et les normes du projet
- Soumettre correctement des Agents, Skills, Commands, Hooks, Rules et configurations MCP
- Suivre les conventions de style de code et de nommage
- Éviter les erreurs courantes de contribution
- Collaborer efficacement avec la communauté via Pull Request

## Vos difficultés actuelles

Vous souhaitez contribuer à Everything Claude Code, mais vous rencontrez ces problèmes :
- "Je ne sais pas quel contenu contribuer qui ait de la valeur"
- "Je ne sais pas comment commencer ma première PR"
- "Les formats de fichiers et les conventions de nommage ne sont pas clairs"
- "Je crains que mon contenu soumis ne respecte pas les exigences"

Ce tutoriel vous fournira un guide de contribution complet, de la philosophie à la pratique.

## Idée centrale

Everything Claude Code est une **ressource communautaire**, pas un projet d'une seule personne. La valeur de ce dépôt réside dans :

1. **Validation en production** - Toutes les configurations ont été utilisées en production pendant 10+ mois
2. **Conception modulaire** - Chaque Agent, Skill, Command est un composant indépendant et réutilisable
3. **Qualité prioritaire** - La révision de code et l'audit de sécurité garantissent la qualité des contributions
4. **Collaboration ouverte** - Licence MIT, encourageant la contribution et la personnalisation

::: tip Pourquoi la contribution a de la valeur
- **Partage de connaissances** : Votre expérience peut aider d'autres développeurs
- **Influence** : Des configurations utilisées par des centaines/milliers de personnes
- **Développement de compétences** : Apprendre la structure du projet et la collaboration communautaire
- **Construction de réseau** : Se connecter avec la communauté Anthropic et Claude Code
:::

## Ce que nous recherchons

### Agents

Sous-agents spécialisés traitant des tâches complexes dans des domaines spécifiques :

| Type | Exemple |
|--- | ---|
| Expert en langage | Python, Go, Rust - révision de code |
| Expert en frameworks | Django, Rails, Laravel, Spring |
| Expert DevOps | Kubernetes, Terraform, CI/CD |
| Expert en domaine | ML pipelines, data engineering, mobile |

### Skills

Définitions de workflow et bases de connaissances de domaine :

| Type | Exemple |
|--- | ---|
| Meilleures pratiques de langage | Python, Go, Rust - normes de codage |
| Modèles de frameworks | Django, Rails, Laravel - modèles d'architecture |
| Stratégies de test | Tests unitaires, tests d'intégration, tests E2E |
| Guides d'architecture | Microservices, événementiel, CQRS |
| Connaissances de domaine | ML, analyse de données, développement mobile |

### Commands

Commandes slash fournissant des points d'entrée de workflow rapides :

| Type | Exemple |
|--- | ---|
| Commandes de déploiement | Déployer sur Vercel, Railway, AWS |
| Commandes de test | Exécuter des tests unitaires, tests E2E, analyse de couverture |
| Commandes de documentation | Générer de la documentation API, mettre à jour README |
| Commandes de génération de code | Générer des types, générer des modèles CRUD |

### Hooks

Hooks d'automatisation déclenchés à des événements spécifiques :

| Type | Exemple |
|--- | ---|
| Linting/formatage | Formatage de code, vérifications lint |
| Vérifications de sécurité | Détection de données sensibles, analyse de vulnérabilités |
| Hooks de validation | Validation de commit Git, vérifications PR |
| Hooks de notification | Notifications Slack/Email |

### Rules

Règles obligatoires garantissant la qualité et les normes de sécurité du code :

| Type | Exemple |
|--- | ---|
| Règles de sécurité | Interdiction de clés en dur, vérifications OWASP |
| Style de code | Modèles immuables, limites de taille de fichiers |
| Exigences de test | Couverture 80%+, processus TDD |
| Conventions de nommage | Nom des variables, nom des fichiers |

### MCP Configurations

Configurations de serveurs MCP étendant les intégrations de services externes :

| Type | Exemple |
|--- | ---|
| Intégrations de bases de données | PostgreSQL, MongoDB, ClickHouse |
| Fournisseurs cloud | AWS, GCP, Azure |
| Outils de surveillance | Datadog, New Relic, Sentry |
| Outils de communication | Slack, Discord, Email |

## Comment contribuer

### Étape 1 : Fork le projet

**Pourquoi** : Vous avez besoin de votre propre copie pour apporter des modifications sans affecter le dépôt d'origine.

```bash
# 1. Visitez https://github.com/affaan-m/everything-claude-code
# 2. Cliquez sur le bouton "Fork" en haut à droite
# 3. Clonez votre fork
git clone https://github.com/YOUR_USERNAME/everything-claude-code.git
cd everything-claude-code

# 4. Ajoutez le dépôt amont (pour faciliter la synchronisation ultérieure)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
```

**Vous devriez voir** : Le répertoire local `everything-claude-code` contenant tous les fichiers du projet.

### Étape 2 : Créer une branche de fonctionnalité

**Pourquoi** : La branche isole vos modifications, facilitant la gestion et la fusion.

```bash
# Créer un nom de branche descriptif
git checkout -b add-python-reviewer

# Ou utiliser un nommage plus spécifique
git checkout -b feature/django-pattern-skill
git checkout -b fix/hook-tmux-reminder
```

**Conventions de nommage des branches** :
- `feature/` - Nouvelle fonctionnalité
- `fix/` - Correction de bug
- `docs/` - Mise à jour de documentation
- `refactor/` - Refactorisation de code

### Étape 3 : Ajouter votre contribution

**Pourquoi** : Placer les fichiers dans le bon répertoire assure que Claude Code peut les charger correctement.

```bash
# Choisissez le répertoire selon le type de contribution
agents/           # Nouvel Agent
skills/           # Nouveau Skill (peut être un seul .md ou un répertoire)
commands/         # Nouvelle commande slash
rules/            # Nouveau fichier de règles
hooks/            # Configuration de Hook (modifier hooks/hooks.json)
mcp-configs/      # Configuration de serveur MCP (modifier mcp-configs/mcp-servers.json)
```

::: tip Structure des répertoires
- **Fichier unique** : Placez directement dans le répertoire, par exemple `agents/python-reviewer.md`
- **Composant complexe** : Créez un sous-répertoire, par exemple `skills/coding-standards/` (contenant plusieurs fichiers)
:::

### Étape 4 : Suivre les conventions de format

#### Format Agent

**Pourquoi** : Le Front Matter définit les métadonnées de l'Agent, et Claude Code s'appuie sur ces informations pour charger l'Agent.

```markdown
---
name: python-reviewer
description: Reviews Python code for PEP 8 compliance, type hints, and best practices
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---

You are a senior Python code reviewer...

Your review should cover:
- PEP 8 style compliance
- Type hints usage
- Docstring completeness
- Security best practices
- Performance optimizations
```

**Champs obligatoires** :
- `name`: Identifiant de l'Agent (minuscules et traits d'union)
- `description`: Description fonctionnelle
- `tools`: Liste des outils autorisés (séparés par des virgules)
- `model`: Modèle préféré (`opus` ou `sonnet`)

#### Format Skill

**Pourquoi** : Une définition claire du Skill facilite sa réutilisation et sa compréhension.

```markdown
# Python Best Practices

## When to Use

Use this skill when:
- Writing new Python code
- Reviewing Python code
- Refactoring Python modules

## How It Works

Follow these principles:

1. **Type Hints**: Always include type hints for function parameters and return values
2. **Docstrings**: Use Google style docstrings for all public functions
3. **PEP 8**: Follow PEP 8 style guide
4. **Immutability**: Prefer immutable data structures

## Examples

### Good
```python
def process_user_data(user_id: str) -> dict:
    """Process user data and return result.

    Args:
        user_id: The user ID to process

    Returns:
        A dictionary with processed data
    """
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```

### Bad
```python
def process_user_data(user_id):
    user_data = fetch_user(user_id)
    return transform_data(user_id)
```
```

**Sections recommandées** :
- `When to Use`: Scénarios d'utilisation
- `How It Works`: Principe de fonctionnement
- `Examples`: Exemples (Good vs Bad)
- `References`: Ressources connexes (optionnel)

#### Format Command

**Pourquoi** : Une description claire de la commande aide les utilisateurs à comprendre la fonctionnalité.

Front Matter (obligatoire) :

```markdown
---
description: Run Python tests with coverage report
---
```

Contenu du corps (optionnel) :

```markdown
# Test

Run tests for the current project:

Coverage requirements:
- Minimum 80% line coverage
- 100% coverage for critical paths
```

Exemples de commandes (optionnel) :

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

**Champs obligatoires** :
- `description`: Description fonctionnelle courte

#### Format Hook

**Pourquoi** : Un Hook a besoin de règles de correspondance claires et d'actions d'exécution.

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(py)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Python file edited')\""
    }
  ],
  "description": "Triggered when Python files are edited"
}
```

**Champs obligatoires** :
- `matcher`: Expression de condition de déclenchement
- `hooks`: Tableau des actions à exécuter
- `description`: Description fonctionnelle du Hook

### Étape 5 : Tester votre contribution

**Pourquoi** : Assurer que la configuration fonctionne correctement en utilisation réelle.

::: warning Important
Avant de soumettre une PR, vous **devez** tester la configuration dans votre environnement local.
:::

**Étapes de test** :

```bash
# 1. Copiez dans votre configuration Claude Code
cp agents/python-reviewer.md ~/.claude/agents/
cp skills/python-patterns/* ~/.claude/skills/

# 2. Testez dans Claude Code
# Lancez Claude Code et utilisez la nouvelle configuration

# 3. Vérifiez les fonctionnalités
# - L'Agent peut-il être appelé correctement ?
# - La Commande peut-elle être exécutée correctement ?
# - Le Hook se déclenche-t-il au bon moment ?
```

**Vous devriez voir** : La configuration fonctionne normalement dans Claude Code, sans erreurs ni anomalies.

### Étape 6 : Soumettre la PR

**Pourquoi** : Pull Request est la méthode standard de collaboration communautaire.

```bash
# Ajoutez toutes les modifications
git add .

# Committez (utilisez un message de commit clair)
git commit -m "Add Python code reviewer agent

- Implements PEP 8 compliance checks
- Adds type hints validation
- Includes security best practices
- Tested on real Python projects"

# Poussez vers votre fork
git push origin add-python-reviewer
```

**Ensuite, créez une PR sur GitHub** :

1. Visitez votre dépôt fork
2. Cliquez sur "Compare & pull request"
3. Remplissez le modèle de PR :

```markdown
## What you added
- [ ] Description of what you added

## Why it's useful
- [ ] Why this contribution is valuable

## How you tested it
- [ ] Testing steps you performed

## Related issues
- [ ] Link to any related issues
```

**Vous devriez voir** : PR créée avec succès, en attente de révision par les mainteneurs.

## Principes directeurs

### À faire (Do)

✅ **Garder les configurations concentrées et modulaires**
- Chaque Agent/Skill ne fait qu'une seule chose
- Évitez le mélange de fonctionnalités

✅ **Inclure des descriptions claires**
- Les descriptions du Front Matter sont précises
- Les commentaires de code sont utiles

✅ **Tester avant de soumettre**
- Vérifiez la configuration localement
- Assurez-vous qu'il n'y a pas d'erreurs

✅ **Suivre les modèles existants**
- Référez-vous au format des fichiers existants
- Maintenez un style de code cohérent

✅ **Documenter les dépendances**
- Listez les dépendances externes
- Spécifiez les exigences d'installation

### À ne pas faire (Don't)

❌ **Inclure des données sensibles**
- API keys, tokens
- Chemins en dur
- Informations d'identification personnelles

❌ **Ajouter des configurations trop complexes ou de niche**
- Priorité à la généricité
- Évitez la sur-conception

❌ **Soumettre des configurations non testées**
- Les tests sont obligatoires
- Fournissez des étapes de test

❌ **Créer des fonctionnalités en double**
- Recherchez les configurations existantes
- Évitez de réinventer la roue

❌ **Ajouter des configurations dépendantes de services payants spécifiques**
- Fournissez des alternatives gratuites
- Ou utilisez des outils open source

## Conventions de nommage des fichiers

**Pourquoi** : Des conventions de nommage unifiées rendent le projet plus facile à maintenir.

### Règles de nommage

| Règle | Exemple |
|--- | ---|
| Utiliser des minuscules | `python-reviewer.md` |
| Utiliser des traits d'union | `tdd-workflow.md` |
| Noms descriptifs | `django-pattern-skill.md` |
| Éviter les noms vagues | ❌ `workflow.md` → ✅ `tdd-workflow.md` |

### Principe de correspondance

Le nom du fichier doit correspondre au nom de l'Agent/Skill/Command :

```bash
# Agent
agents/python-reviewer.md          # name: python-reviewer

# Skill
skills/django-patterns/SKILL.md    # # Django Patterns

# Command
commands/test.md                   # # Test
```

::: tip Astuces de nommage
- Utilisez des termes de l'industrie (comme "PEP 8", "TDD", "REST")
- Évitez les abréviations (sauf si ce sont des abréviations standard)
- Gardez concis mais descriptif
:::

## Liste de contrôle du processus de contribution

Avant de soumettre une PR, assurez-vous de remplir les conditions suivantes :

### Qualité du code
- [ ] Suivre le style de code existant
- [ ] Inclure le Front Matter nécessaire
- [ ] Avoir une description et une documentation claires
- [ ] Tests réussis en local

### Normes de fichiers
- [ ] Le nom du fichier respecte les conventions de nommage
- [ ] Le fichier est placé dans le bon répertoire
- [ ] Le format JSON est correct (si applicable)
- [ ] Pas de données sensibles

### Qualité de la PR
- [ ] Le titre de la PR décrit clairement les modifications
- [ ] La description de la PR inclut "What", "Why", "How"
- [ ] Lié aux issues connexes (si applicable)
- [ ] Fournir des étapes de test

### Normes communautaires
- [ ] Assurer qu'il n'y a pas de fonctionnalités en double
- [ ] Fournir des alternatives (si des services payants sont concernés)
- [ ] Répondre aux commentaires de révision
- [ ] Maintenir une discussion amicale et constructive

## Questions fréquentes

### Q : Comment savoir quoi contribuer qui a de la valeur ?

**R** : Commencez par vos propres besoins :
- À quels problèmes avez-vous récemment été confronté ?
- Quelles solutions avez-vous utilisées ?
- Cette solution peut-elle être réutilisée ?

Vous pouvez également consulter les Issues du projet :
- Feature requests non résolues
- Suggestions d'amélioration
- Rapports de bugs

### Q : Les contributions peuvent-elles être refusées ?

**R** : C'est possible, mais c'est normal. Raisons courantes :
- La fonctionnalité existe déjà
- La configuration ne respecte pas les normes
- Tests manquants
- Problèmes de sécurité ou de confidentialité

Les mainteneurs fourniront des commentaires détaillés, et vous pourrez modifier et soumettre à nouveau en fonction des commentaires.

### Q : Comment suivre le statut de ma PR ?

**R** :
1. Consultez le statut sur la page GitHub PR
2. Suivez les commentaires de révision
3. Répondez aux commentaires des mainteneurs
4. Mettez à jour la PR selon les besoins

### Q : Puis-je contribuer à des corrections de bugs ?

**R** : Absolument ! Les corrections de bugs sont l'une des contributions les plus précieuses :
1. Recherchez ou créez une nouvelle issue dans Issues
2. Fork le projet et corrigez le bug
3. Ajoutez des tests (si nécessaire)
4. Soumettez une PR, en référençant l'issue dans la description

### Q : Comment garder mon fork synchronisé avec l'amont ?

**R** :

```bash
# 1. Ajoutez le dépôt amont (si ce n'est pas déjà fait)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git

# 2. Récupérez les mises à jour de l'amont
git fetch upstream

# 3. Fusionnez les mises à jour de l'amont dans votre branche main
git checkout main
git merge upstream/main

# 4. Poussez les mises à jour vers votre fork
git push origin main

# 5. Rebasez sur la branche main la plus récente
git checkout your-feature-branch
git rebase main
```

## Contact

Si vous avez des questions ou besoin d'aide :

- **Open an Issue**: [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)
- **Twitter**: [@affaanmustafa](https://x.com/affaanmustafa)
- **Email**: Via GitHub

::: tip Suggestions de questions
- Recherchez d'abord les Issues et Discussions existantes
- Fournissez un contexte clair et des étapes de reproduction
- Restez poli et constructif
:::

## Résumé du cours

Ce cours a expliqué systématiquement le processus de contribution et les normes d'Everything Claude Code :

**Idées clés** :
- Ressource communautaire, construction collective
- Validation en production, qualité prioritaire
- Conception modulaire, facile à réutiliser
- Collaboration ouverte, partage de connaissances

**Types de contribution** :
- **Agents**: Sous-agents spécialisés (langage, frameworks, DevOps, experts de domaine)
- **Skills**: Définitions de workflow et bases de connaissances de domaine
- **Commands**: Commandes slash (déploiement, tests, documentation, génération de code)
- **Hooks**: Hooks d'automatisation (linting, vérifications de sécurité, validation, notifications)
- **Rules**: Règles obligatoires (sécurité, style de code, tests, nommage)
- **MCP Configurations**: Configurations de serveurs MCP (bases de données, cloud, surveillance, communication)

**Processus de contribution** :
1. Fork le projet
2. Créer une branche de fonctionnalité
3. Ajouter le contenu de la contribution
4. Suivre les conventions de format
5. Tester en local
6. Soumettre une PR

**Conventions de format** :
- Agent: Front Matter + description + instructions
- Skill: When to Use + How It Works + Examples
- Command: Description + exemples d'utilisation
- Hook: Matcher + Hooks + Description

**Principes directeurs** :
- **Do**: concentré, clair, testé, suit les modèles, documenté
- **Don't**: données sensibles, complexe de niche, non testé, en double, dépendances payantes

**Nommage des fichiers** :
- Minuscules + traits d'union
- Noms descriptifs
- Cohérence avec le nom de l'Agent/Skill/Command

**Liste de contrôle** :
- Qualité du code, normes de fichiers, qualité de la PR, normes communautaires

## Prochain cours

> Au prochain cours, nous apprendrons **[Exemples de configurations : Configurations au niveau projet et utilisateur](../examples/)**.
>
> Vous apprendrez :
> - Les meilleures pratiques des configurations au niveau projet
> - Les personnalisations des configurations au niveau utilisateur
> - Comment personnaliser les configurations pour des projets spécifiques
> - Exemples de configurations de projets réels

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité          | Chemin du fichier                                                                                     | Lignes  |
|--- | --- | ---|
| Guide de contribution      | [`CONTRIBUTING.md`](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md)           | 1-192 |
| Exemple d'Agent    | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | -     |
| Exemple de Skill    | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | -     |
| Exemple de Command  | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)           | -     |
| Configuration de Hook     | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json)     | 1-158 |
| Exemple de Rule     | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | -     |
| Exemple de configuration MCP  | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92  |
| Exemple de configuration      | [`examples/CLAUDE.md`](https://github.com/affaan-m/everything-claude-code/blob/main/examples/CLAUDE.md) | -     |

**Champs clés du Front Matter** :
- `name`: Identifiant de l'Agent/Skill/Command
- `description`: Description fonctionnelle
- `tools`: Outils autorisés (Agent)
- `model`: Modèle préféré (Agent, optionnel)

**Structure des répertoires clés** :
- `agents/`: 9 sous-agents spécialisés
- `skills/`: 11 définitions de workflow
- `commands/`: 14 commandes slash
- `rules/`: 8 ensembles de règles
- `hooks/`: Configurations de hooks d'automatisation
- `mcp-configs/`: Configurations de serveurs MCP
- `examples/`: Fichiers d'exemple de configuration

**Liens liés à la contribution** :
- GitHub Issues: https://github.com/affaan-m/everything-claude-code/issues
- Twitter: https://x.com/affaanmustafa

</details>
