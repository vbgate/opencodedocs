---
title: "Créer des compétences : Écrire SKILL.md | OpenSkills"
sidebarTitle: "Écrire une compétence"
subtitle: "Créer des compétences : Écrire SKILL.md"
description: "Apprenez à créer des compétences personnalisées à partir de zéro, maîtrisez le format SKILL.md et les spécifications YAML frontmatter. À travers des exemples complets et le flux de développement de liens symboliques, démarrez rapidement la création de compétences, en garantissant la conformité aux standards Anthropic."
tags:
  - "avancé"
  - "compétences"
  - "création"
  - "SKILL.md"
prerequisite:
  - "start-quick-start"
  - "start-first-skill"
order: 4
---

# Créer des compétences personnalisées

## Ce que vous serez capable de faire

- Créer un fichier de compétence SKILL.md complet à partir de zéro
- Écrire du YAML frontmatter conforme aux standards Anthropic
- Concevoir une structure de répertoire de compétences raisonnable (references/, scripts/, assets/)
- Utiliser des liens symboliques pour le développement local et l'itération
- Installer et valider des compétences personnalisées via la commande `openskills`

## Votre problème actuel

Vous souhaitez qu'un agent IA vous aide à résoudre un problème spécifique, mais il n'existe pas de solution appropriée dans la bibliothèque de compétences existante. Vous essayez de décrire vos besoins de manière répétée dans la conversation, mais l'IA ne retient pas ou n'exécute pas complètement les tâches. Vous avez besoin d'un moyen pour **encapsuler des connaissances spécialisées**, permettant aux agents IA de les réutiliser de manière stable et fiable.

## Quand utiliser cette approche

- **Encapsuler des flux de travail** : Transformer les étapes d'opération répétitives en compétences, permettant à l'IA de tout exécuter en une seule fois
- **Capitalisation des connaissances d'équipe** : Empaqueter les normes internes, la documentation API et les scripts de l'équipe en compétences, partagées avec tous les membres
- **Intégration d'outils** : Créer des compétences spécialisées pour des outils spécifiques (comme le traitement PDF, le nettoyage de données, les processus de déploiement)
- **Développement local** : Modifier et tester des compétences en temps réel pendant le développement, sans installation répétée

## 🎒 Préparatifs avant de commencer

::: warning Vérifications préalables

Avant de commencer, assurez-vous de :

- ✅ Avoir installé [OpenSkills](/start/installation/)
- ✅ Avoir installé et synchronisé au moins une compétence (comprendre le flux de base)
- ✅ Être familier avec la syntaxe de base de Markdown

:::

## Concept central

### Qu'est-ce que SKILL.md ?

**SKILL.md** est le format standard du système de compétences d'Anthropic, utilisant le YAML frontmatter pour décrire les métadonnées de la compétence et le corps Markdown pour fournir les instructions d'exécution. Il présente trois avantages principaux :

1. **Format unifié** - Tous les agents (Claude Code, Cursor, Windsurf, etc.) utilisent la même description de compétence
2. **Chargement progressif** - Charge le contenu complet uniquement lorsque nécessaire, maintenant le contexte IA concis
3. **Ressources empaquetables** - Prend en charge trois types de ressources supplémentaires : references/, scripts/, assets/

### Structure minimale vs structure complète

**Structure minimale** (adaptée aux compétences simples) :
```
my-skill/
└── SKILL.md          # Un seul fichier
```

**Structure complète** (adaptée aux compétences complexes) :
```
my-skill/
├── SKILL.md          # Instructions principales (< 5000 mots)
├── references/       # Documentation détaillée (chargée à la demande)
│   └── api-docs.md
├── scripts/          # Scripts exécutables
│   └── helper.py
└── assets/           # Modèles et fichiers de sortie
    └── template.json
```

::: info Quand utiliser la structure complète ?

- **references/** : Lorsque la documentation API, les schémas de base de données, les guides détaillés dépassent 5000 mots
- **scripts/** : Lorsqu'il faut exécuter des tâches déterministes et reproductibles (comme la conversion de données, le formatage)
- **assets/** : Lorsqu'il faut générer des modèles, des images, du code boilerplate

:::

## Suivez le guide

### Étape 1 : Créer le répertoire de compétences

**Pourquoi** : Créer un répertoire indépendant pour organiser les fichiers de compétences

```bash
mkdir my-skill
cd my-skill
```

**Ce que vous devriez voir** : Le répertoire courant est vide

---

### Étape 2 : Écrire la structure de base SKILL.md

**Pourquoi** : SKILL.md doit commencer par un YAML frontmatter pour définir les métadonnées de la compétence

Créez le fichier `SKILL.md` :

```markdown
---
name: my-skill                    # Obligatoire : identifiant au format avec traits d'union
description: When to use this skill.  # Obligatoire : 1-2 phrases, à la troisième personne
---

# Titre de la compétence

Description détaillée de la compétence.
```

**Points de vérification** :

- ✅ La première ligne est `---`
- ✅ Contient le champ `name` (format avec traits d'union, comme `pdf-editor`, `api-client`)
- ✅ Contient le champ `description` (1-2 phrases, à la troisième personne)
- ✅ Utilise à nouveau `---` après la fin du YAML

::: danger Erreurs courantes

| Exemple d'erreur | Méthode de correction |
|--- | ---|
| `name: My Skill` (espaces) | Changer en `name: my-skill` (traits d'union) |
| `description: You should use this for...` (deuxième personne) | Changer en `description: Use this skill for...` (troisième personne) |
|--- | ---|
| `description` trop long (plus de 100 mots) | Simplifier en résumé de 1-2 phrases |

:::

---

### Étape 3 : Écrire le contenu des instructions

**Pourquoi** : Les instructions indiquent à l'agent IA comment exécuter la tâche, doivent utiliser la forme impérative/infinitive

Continuez à éditer `SKILL.md` :

```markdown
---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill

## When to Use

Load this skill when:
- Demonstrating instruction writing patterns
- Understanding imperative/infinitive form
- Learning SKILL.md format

## Instructions

To execute this skill:

1. Read the user's input
2. Process the data
3. Return the result

For detailed information, see references/guide.md
```

**Règles d'écriture** :

| ✅ Forme correcte (impérative/infinitive) | ❌ Forme incorrecte (deuxième personne) |
|--- | ---|
| "To accomplish X, execute Y"        | "You should do X"          |
| "Load this skill when Z"            | "If you need Y"            |
| "See references/guide.md"           | "When you want Z"           |

::: tip Règle mnémotechnique

**Trois principes de rédaction d'instructions** :
1. **Commencer par un verbe** : "Create" → "Use" → "Return"
2. **Omettre "You"** : Ne pas dire "You should"
3. **Chemin explicite** : Citer les ressources en commençant par `references/`

:::

---

### Étape 4 : Ajouter des ressources empaquetées (optionnel)

**Pourquoi** : Lorsque la compétence nécessite beaucoup de documentation détaillée ou des scripts exécutables, utilisez les ressources empaquetées pour maintenir SKILL.md concis

#### 4.1 Ajouter references/

```bash
mkdir references
```

Créez `references/api-docs.md` :

```markdown
# API Documentation

## Overview

This section provides detailed API information...

## Endpoints

### GET /api/data

Returns processed data.

Response:
```json
{
  "status": "success",
  "data": [...]
}
```
```

Dans `SKILL.md`, référencez :

```markdown
## Instructions

To fetch data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format
3. Process the result
```

#### 4.2 Ajouter scripts/

```bash
mkdir scripts
```

Créez `scripts/process.py` :

```python
#!/usr/bin/env python3
import sys

def main():
    # Processing logic
    print("Processing complete")

if __name__ == "__main__":
    main()
```

Dans `SKILL.md`, référencez :

```markdown
## Instructions

To process data:

1. Execute the script:
   ```bash
   python scripts/process.py
   ```
2. Review the output
```

::: info Avantages de scripts/

- **Pas chargé dans le contexte** : Économise des tokens, adapté aux fichiers volumineux
- **Exécutable indépendamment** : L'agent IA peut appeler directement sans charger le contenu au préalable
- **Adapté aux tâches déterministes** : Conversion de données, formatage, génération, etc.

:::

#### 4.3 Ajouter assets/

```bash
mkdir assets
```

Ajoutez le fichier modèle `assets/template.json` :

```json
{
  "title": "{{ title }}",
  "content": "{{ content }}"
}
```

Dans `SKILL.md`, référencez :

```markdown
## Instructions

To generate output:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
```

---

### Étape 5 : Valider le format SKILL.md

**Pourquoi** : Valider le format avant l'installation pour éviter les erreurs d'installation

```bash
npx openskills install ./my-skill
```

**Ce que vous devriez voir** :

```
✔ Found skill: my-skill
  Description: Use this skill to demonstrate how to write proper instructions.
  Size: 1.2 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

Sélectionnez la compétence et appuyez sur Entrée, vous devriez voir :

```
✔ Installing my-skill...
✔ Skill installed successfully to .claude/skills/my-skill

Next steps:
  Run: npx openskills sync
  Then: Ask your AI agent to use the skill
```

::: tip Liste de vérification

Avant l'installation, vérifiez les éléments suivants :

- [ ] SKILL.md commence par `---`
- [ ] Contient les champs `name` et `description`
- [ ] `name` utilise le format avec traits d'union (`my-skill` et non `my_skill`)
- [ ] `description` est un résumé de 1-2 phrases
- [ ] Les instructions utilisent la forme impérative/infinitive
- [ ] Tous les chemins de référence `references/`, `scripts/`, `assets/` sont corrects

:::

---

### Étape 6 : Synchroniser vers AGENTS.md

**Pourquoi** : Permettre à l'agent IA de savoir que cette compétence est disponible

```bash
npx openskills sync
```

**Ce que vous devriez voir** :

```
✔ Found 1 skill:
  ☑ my-skill

✔ Syncing to AGENTS.md...
✔ Updated AGENTS.md successfully
```

Vérifiez le fichier `AGENTS.md` généré :

```markdown
<!-- SKILLS_SYSTEM_START -->
...
<available_skills>
  <skill name="my-skill">Use this skill to demonstrate how to write proper instructions.</skill>
</available_skills>
...
<!-- SKILLS_SYSTEM_END -->
```

---

### Étape 7 : Tester le chargement de la compétence

**Pourquoi** : Vérifier que la compétence peut être chargée correctement dans le contexte IA

```bash
npx openskills read my-skill
```

**Ce que vous devriez voir** :

```
Loading skill: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill
... (contenu SKILL.md complet)
```

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez :

- ✅ Avoir créé un répertoire de compétences contenant SKILL.md
- ✅ SKILL.md contient le YAML frontmatter correct et le contenu Markdown
- ✅ La compétence est installée avec succès dans `.claude/skills/`
- ✅ La compétence est synchronisée vers AGENTS.md
- ✅ Utiliser `openskills read` permet de charger le contenu de la compétence

## Pièges courants

### Problème 1 : Erreur "Invalid SKILL.md (missing YAML frontmatter)" lors de l'installation

**Cause** : SKILL.md ne commence pas par `---`

**Solution** : Vérifiez que la première ligne du fichier est `---`, et non `# My Skill` ou autre contenu

---

### Problème 2 : L'agent IA ne reconnaît pas la compétence

**Cause** : `openskills sync` n'a pas été exécuté ou AGENTS.md n'a pas été mis à jour

**Solution** : Exécutez `npx openskills sync` et vérifiez si AGENTS.md contient l'entrée de la compétence

---

### Problème 3 : Erreur de résolution du chemin des ressources

**Cause** : Utilisation de chemins absolus ou de chemins relatifs incorrects dans SKILL.md

**Solution** :
- ✅ Correct : `references/api-docs.md` (chemin relatif)
- ❌ Incorrect : `/path/to/skill/references/api-docs.md` (chemin absolu)
- ❌ Incorrect : `../other-skill/references/api-docs.md` (référence entre compétences)

---

### Problème 4 : SKILL.md trop long dépassant la limite de tokens

**Cause** : SKILL.md dépasse 5000 mots ou contient beaucoup de documentation détaillée

**Solution** : Déplacez le contenu détaillé vers le répertoire `references/`, référencez dans SKILL.md

## Résumé du chapitre

Étapes clés pour créer des compétences personnalisées :

1. **Créer la structure de répertoire** : Structure minimale (seulement SKILL.md) ou structure complète (incluant references/, scripts/, assets/)
2. **Écrire le YAML frontmatter** : Champs obligatoires `name` (format avec traits d'union) et `description` (1-2 phrases)
3. **Écrire le contenu des instructions** : Utiliser la forme impérative/infinitive, éviter la deuxième personne
4. **Ajouter des ressources** (optionnel) : references/, scripts/, assets/
5. **Valider le format** : Utiliser `openskills install ./my-skill` pour valider
6. **Synchroniser vers AGENTS.md** : Exécuter `openskills sync` pour informer l'agent IA
7. **Tester le chargement** : Utiliser `openskills read my-skill` pour valider le chargement

## Prochain chapitre

> Dans le prochain chapitre, nous apprendrons **[Structure détaillée des compétences](../skill-structure/)**.
>
> Vous apprendrez :
> - Description complète des champs SKILL.md
> - Meilleures pratiques pour references/, scripts/, assets/
> - Comment optimiser la lisibilité et la maintenabilité des compétences

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Ligne |
|--- | --- | ---|
| Validation du YAML frontmatter | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14 |
| Extraction de champ YAML | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Validation de format lors de l'installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |
| Extraction du nom de compétence | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 344-345 |

**Fichiers de compétence exemples** :
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Exemple de structure minimale
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Référence de spécification de format

**Fonctions clés** :
- `hasValidFrontmatter(content: string): boolean` - Vérifie si SKILL.md commence par `---`
- `extractYamlField(content: string, field: string): string` - Extrait la valeur d'un champ YAML (correspondance non gourmande)

</details>
