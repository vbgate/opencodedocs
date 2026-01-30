---
title: "Structure SKILL.md : Spécifications et Ressources | OpenSkills"
sidebarTitle: "Comprendre la Structure des Compétences"
subtitle: "Structure SKILL.md : Spécifications et Ressources"
description: "Maîtrisez les spécifications complètes des champs SKILL.md, les exigences YAML frontmatter et la conception des Bundled Resources. Apprenez l'utilisation de references/, scripts/, assets/, les directives de taille de fichiers et les mécanismes de résolution des ressources."
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "advanced-create-skills"
order: 5
---

# Explication de la Structure des Compétences

## Ce Que Vous Apprendrez

- Comprendre précisément toutes les exigences de champs et les spécifications de format de SKILL.md
- Maîtriser les principes de conception et les scénarios d'utilisation de references/, scripts/, assets/
- Optimiser l'utilisation des tokens et les performances de chargement des compétences
- Éviter les erreurs de format courantes et les problèmes de résolution de chemins
- Utiliser le chargement progressif pour améliorer l'efficacité du contexte de l'IA

## Vos Difficultés Actuelles

Vous avez appris à créer des compétences de base, mais vous ne connaissez pas encore toutes les spécifications complètes de SKILL.md. Vos compétences peuvent rencontrer les problèmes suivants :

- SKILL.md trop long, entraînant une consommation excessive de tokens
- Incertitude sur le contenu à placer dans references/ plutôt que dans SKILL.md
- Les agents IA ne peuvent pas charger correctement les ressources dans scripts/ ou assets/
- Erreurs de format YAML frontmatter entraînant l'échec de l'installation

## Quand Utiliser Cette Approche

- **Révision des compétences** : Vérifier si les compétences existantes sont conformes aux spécifications d'Anthropic
- **Optimisation des performances** : Résoudre les problèmes de chargement lent ou de dépassement de tokens
- **Refactorisation des ressources** : Diviser les compétences volumineuses en SKILL.md + bundled resources
- **Développement de compétences complexes** : Rédiger des compétences complètes incluant la documentation d'API et des scripts exécutables

## 🎒 Avant de Commencer

::: warning Vérification Préalable

Avant de commencer, assurez-vous de :

- ✅ Avoir lu [Créer des Compétences Personnalisées](../create-skills/)
- ✅ Avoir installé au moins une compétence (comprendre le flux de base)
- ✅ Être familiarisé avec la syntaxe de base de YAML et Markdown

:::

## Concepts Fondamentaux

### Philosophie de Conception de SKILL.md

**SKILL.md** est au cœur du système de compétences d'Anthropic, utilisant une conception de **chargement progressif** :

```mermaid
graph LR
    A[Métadonnées<br/>name + description] -->|Toujours chargé| B[Contexte]
    B -->|L'IA juge nécessaire| C[SKILL.md<br/>Instructions principales]
    C -->|Référence à la demande| D[Ressources<br/>references/scripts/assets]
```

**Avantages des trois couches de chargement** :

1. **Couche Métadonnées** : Les `name` et `description` de toutes les compétences sont toujours dans le contexte, permettant à l'IA de rapidement comprendre les compétences disponibles
2. **Couche SKILL.md** : Chargée uniquement lorsqu'elle est pertinente, contient les instructions principales (< 5000 mots)
3. **Couche Ressources** : Documentation détaillée et fichiers exécutables chargés à la demande, évitant le gaspillage de tokens

### Classification des Bundled Resources

| Répertoire | Chargé dans le Contexte | Scénarios d'Utilisation | Types d'Exemples |
|--- | --- | --- | ---|
| `references/` | ✅ Chargement à la demande | Documentation détaillée, spécifications d'API | Documentation d'API, schéma de base de données |
| `scripts/`  | ❌ Non chargé | Code exécutable | Scripts Python/Bash |
| `assets/`   | ❌ Non chargé | Modèles, fichiers de sortie, images | Modèles JSON, code boilerplate |

## Suivez les Étapes

### Étape 1 : Comprendre les Spécifications Complètes du YAML Frontmatter

**Pourquoi** : Le YAML frontmatter représente les métadonnées de la compétence et doit respecter des spécifications strictes

SKILL.md doit commencer et se terminer par `---` :

```yaml
---
name: my-skill
description: Use this skill when you need to demonstrate proper format.
---
```

**Champs requis** :

| Champ | Type | Exigences de Format | Exemple |
|--- | --- | --- | ---|
| `name` | string | Format avec traits d'union (kebab-case), sans espaces | `pdf-editor`, `api-client` |
| `description` | string | 1-2 phrases, troisième personne | `Use this skill to edit PDF files` |

::: danger Erreurs Courantes

| Exemple d'Erreur | Problème | Méthode de Correction |
|--- | --- | ---|
| `name: My Skill` | Contient des espaces | Remplacer par `name: my-skill` |
| `name: my_skill` | Format avec traits de soulignement | Remplacer par `name: my-skill` |
| `description: You should use this when...` | Deuxième personne | Remplacer par `description: Use this skill when...` |
| `description:` trop long | Plus de 100 mots | Résumer en 1-2 phrases |
| Absence de `---` final | YAML non correctement fermé | Ajouter le séparateur de fin |

:::

**Vérification dans le code source** : OpenSkills utilise une regex non gourmande pour valider le format

```typescript
// src/utils/yaml.ts
export function hasValidFrontmatter(content: string): boolean {
  return content.trim().startsWith('---');
}

export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

---

### Étape 2 : Rédiger le Corps de SKILL.md (Forme Impérative)

**Pourquoi** : Les agents IA s'attendent à des instructions impératives, pas à des descriptions conversationnelles

**Positionnement correct** :

```markdown
## Instructions

To execute this task:

1. Read the input file
2. Process data using the algorithm
3. Generate output in specified format
```

**Positionnement incorrect** (à éviter) :

```markdown
## Instructions

You should execute this task by:

1. Reading the input file
2. Processing data using the algorithm
3. Generating output in specified format
```

**Tableau de comparaison** :

| ✅ Correct (Impératif/Infinitif) | ❌ Incorrect (Deuxième Personne) |
|--- | ---|
| "Load this skill when X"       | "If you need Y"        |
| "To accomplish Z, execute A"   | "You should do Z"      |
| "See references/guide.md"     | "When you want to Z"   |

**Règles d'écriture** :

1. **Commencer par un verbe** : `Create` → `Use` → `Return`
2. **Omettre "You"** : Ne pas dire "You should"
3. **Chemins clairs** : Utiliser les préfixes `references/`, `scripts/`, `assets/` lors de la référence aux ressources

---

### Étape 3 : Utiliser references/ pour Gérer la Documentation Détaillée

**Pourquoi** : Garder SKILL.md concis, documentation détaillée chargée à la demande

**Scénarios d'utilisation** :

- Documentation d'API (explications d'endpoints dépassant 500 mots)
- Schéma de base de données (structure des tables, définitions des champs)
- Guides détaillés (explications des options de configuration, FAQ)
- Exemples de code (grands fragments de code)

**Structure des répertoires** :

```
my-skill/
├── SKILL.md              (~2,000 mots, instructions principales)
└── references/
    ├── api-docs.md       (Documentation d'API détaillée)
    ├── database-schema.md (Structure de base de données)
    └── troubleshooting.md (Guide de dépannage)
```

**Méthode de référence dans SKILL.md** :

```markdown
## Instructions

To interact with the API:

1. Read the request parameters
2. Call the API endpoint
3. For detailed response format, see `references/api-docs.md`
4. Parse the response
5. Handle errors (see `references/troubleshooting.md`)
```

**Exemple de references/api-docs.md** :

```markdown
# API Documentation

## Overview

This API provides endpoints for data processing.

## Endpoints

### POST /api/process

**Request:**
```json
{
  "input": "data to process",
  "options": {
    "format": "json"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "result": {
    "output": "processed data"
  }
}
```

**Error Codes:**
- `400`: Invalid input format
- `500`: Server error
```

::: tip Meilleures Pratiques

**Recommandations de taille de fichiers pour references/** :
- Fichier individuel : recommandé < 10,000 mots
- Taille totale : recommandé < 50,000 mots (divisé en plusieurs fichiers)
- Nomination : utiliser le format avec traits d'union (`api-docs.md` au lieu de `API_Docs.md`)

:::

---

### Étape 4 : Utiliser scripts/ pour Exécuter des Tâches Déterministes

**Pourquoi** : Les scripts exécutables n'ont pas besoin d'être chargés dans le contexte, adaptés aux tâches répétitives

**Scénarios d'utilisation** :

- Conversion de données (JSON → CSV, conversion de format)
- Traitement de fichiers (compression, décompression, renommage)
- Génération de code (génération de code à partir de modèles)
- Exécution de tests (tests unitaires, tests d'intégration)

**Structure des répertoires** :

```
my-skill/
├── SKILL.md
└── scripts/
    ├── process.py       (Script Python)
    ├── transform.sh     (Script Bash)
    └── validate.js     (Script Node.js)
```

**Méthode de référence dans SKILL.md** :

```markdown
## Instructions

To process the input data:

1. Validate the input file format
2. Execute the processing script:
   ```bash
   python scripts/process.py --input data.json --output result.json
   ```
3. Verify the output file
4. If validation fails, see `scripts/validate.py` for error messages
```

**Exemple de scripts/process.py** :

```python
#!/usr/bin/env python3
import json
import sys

def main():
    input_file = sys.argv[1]
    output_file = sys.argv[2]

    with open(input_file, 'r') as f:
        data = json.load(f)

    # Processing logic
    result = transform_data(data)

    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)

    print(f"✅ Processed {input_file} → {output_file}")

if __name__ == "__main__":
    main()
```

::: info Avantages de scripts/

Par rapport au code en ligne dans SKILL.md :

| Caractéristique | Code en Ligne | scripts/ |
|--- | --- | ---|
| Consommation de tokens | ✅ Élevée | ❌ Faible |
| Réutilisabilité | ❌ Faible | ✅ Bonne |
| Testabilité | ❌ Difficile | ✅ Facile |
| Limite de complexité | ❌ Limitée par les tokens | ✅ Sans limite |

:::

---

### Étape 5 : Utiliser assets/ pour Stocker les Modèles et Fichiers de Sortie

**Pourquoi** : Les modèles et fichiers de sortie n'ont pas besoin d'être chargés dans le contexte, économisant des tokens

**Scénarios d'utilisation** :

- Modèles de sortie (modèles JSON, XML, Markdown)
- Code boilerplate (scaffolding de projet, fichiers de configuration)
- Images et diagrammes (organigrammes, diagrammes d'architecture)
- Données de test (échantillons d'entrée, sorties attendues)

**Structure des répertoires** :

```
my-skill/
├── SKILL.md
└── assets/
    ├── template.json    (Modèle JSON)
    ├── boilerplate.js   (Code boilerplate)
    └── diagram.png     (Organigramme)
```

**Méthode de référence dans SKILL.md** :

```markdown
## Instructions

To generate the output file:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
4. For boilerplate code, see `assets/boilerplate.js`
```

**Exemple de assets/template.json** :

```json
{
  "title": "{{ title }}",
  "description": "{{ description }}",
  "version": "{{ version }}",
  "author": "{{ author }}",
  "created_at": "{{ timestamp }}"
}
```

**Utilisation du modèle dans un script** :

```python
import json
from string import Template

def generate_output(data, template_path):
    with open(template_path, 'r') as f:
        template_str = f.read()

    template = Template(template_str)
    output = template.safe_substitute(data)

    return output
```

::: warning Précautions pour assets/

- **Non chargé dans le contexte** : Les agents IA ne peuvent pas lire directement le contenu, doivent le charger via des scripts
- **Résolution des chemins** : Utiliser des chemins relatifs, comme `assets/template.json`
- **Taille des fichiers** : Recommandé : fichiers individuels < 10MB (éviter les délais de transfert)

:::

---

### Étape 6 : Optimiser la Taille des Fichiers et les Performances

**Pourquoi** : La taille des fichiers affecte directement la consommation de tokens et la vitesse de chargement du contexte de l'IA

**Guide de taille des fichiers** (recommandation officielle) :

| Répertoire | Limite de Taille | Comportement de Chargement |
|--- | --- | --- |
| SKILL.md  | < 5,000 mots | Toujours chargé (au besoin) |
| references/ | Pas de limite stricte | Chargé à la demande |
| scripts/  | Non compté dans les tokens | Non chargé, uniquement exécuté |
| assets/   | Non chargé dans le contexte | Non chargé, uniquement copié |

**Techniques d'optimisation des performances** :

1. **Diviser references/** :
   ```bash
   # ❌ Un seul grand fichier (20,000 mots)
   references/all-docs.md

   # ✅ Divisé en plusieurs petits fichiers (chaque < 5,000 mots)
   references/
   ├── api-docs.md
   ├── database-schema.md
   └── troubleshooting.md
   ```

2. **Utiliser scripts/ pour traiter les données** :
   ```markdown
   # ❌ Blocs de code en ligne dans SKILL.md (consomme des tokens)
   ## Instructions
   Execute this code:
   ```python
   # 500 lignes de code...
   ```

   # ✅ Référencer scripts/ (ne consomme pas de tokens)
   ## Instructions
   Execute: `python scripts/processor.py`
   ```

3. **Simplifier SKILL.md** :
   - Ne conserver que les instructions principales et les étapes
   - Déplacer les explications détaillées vers `references/`
   - Utiliser un langage impératif concis

**Vérification de la taille des fichiers** :

```bash
# Compter les mots de SKILL.md
wc -w my-skill/SKILL.md

# Compter le total des mots de references/
find my-skill/references -name "*.md" -exec wc -w {} + | tail -1

# Vérifier la taille des fichiers scripts/
du -sh my-skill/scripts/
```

---

### Étape 7 : Comprendre le Mécanisme de Résolution des Ressources

**Pourquoi** : Comprendre les règles de résolution des chemins pour éviter les erreurs de référence

**Concept de répertoire de base** :

Lorsqu'un agent IA charge une compétence, `openskills read` affiche le répertoire de base :

```
Reading: my-skill
Base directory: /path/to/project/.claude/skills/my-skill
```

**Règles de résolution des chemins relatifs** :

| Chemin de Référence | Résultat |
|--- | ---|
| `references/api.md`   | `/base/directory/references/api.md` |
| `scripts/process.py`  | `/base/directory/scripts/process.py` |
| `assets/template.json` | `/base/directory/assets/template.json` |

**Vérification dans le code source** :

```typescript
// src/commands/read.ts
export function readSkill(skillNames: string[] | string): void {
  const skill = findSkill(name);
  const content = readFileSync(skill.path, 'utf-8');

  // Afficher le répertoire de base pour que l'IA puisse résoudre les chemins relatifs
  console.log(`Base directory: ${skill.baseDir}`);
  console.log(content);
}
```

::: danger Exemples d'Erreurs de Chemin

| ❌ Écriture Incorrecte | Problème | ✅ Écriture Correcte |
|--- | --- | ---|
| `/absolute/path/to/api.md` | Utilisation d'un chemin absolu | `references/api.md` |
| `../other-skill/references/api.md` | Référence inter-compétences | `references/api.md` |
| `~/references/api.md` | Utilisation de l'expansion tilde | `references/api.md` |

:::

---

### Étape 8 : Valider le Format de la Compétence

**Pourquoi** : Valider le format avant l'installation pour éviter les erreurs à l'exécution

**Utiliser openskills pour valider** :

```bash
npx openskills install ./my-skill
```

**Ce que vous devriez voir** :

```
✔ Found skill: my-skill
  Description: Use this skill when you need to demonstrate proper format.
  Size: 2.1 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

**Liste de vérification** :

- [ ] SKILL.md commence par `---`
- [ ] Contient le champ `name` (format avec traits d'union)
- [ ] Contient le champ `description` (1-2 phrases)
- [ ] YAML se termine par `---`
- [ ] Le corps utilise la forme impérative/infinitive
- [ ] Toutes les références `references/`, `scripts/`, `assets/` utilisent des chemins relatifs
- [ ] SKILL.md a moins de 5,000 mots
- [ ] Les fichiers de references/ utilisent le format avec traits d'union

**Validation manuelle du YAML frontmatter** :

```bash
# Vérifier si commence par ---
head -1 my-skill/SKILL.md

# Valider les champs YAML (utiliser yq ou un autre outil)
yq eval '.name' my-skill/SKILL.md
```

---

### Étape 9 : Tester le Chargement de la Compétence

**Pourquoi** : S'assurer que la compétence peut être correctement chargée dans le contexte de l'IA

**Utiliser openskills read pour tester** :

```bash
npx openskills read my-skill
```

**Ce que vous devriez voir** :

```
Reading: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill when you need to demonstrate proper format.
---

# My Skill

## Instructions

To execute this task...

## Bundled Resources

For detailed information: see `references/skill-format.md`

Skill read: my-skill
```

**Points de contrôle** :

- ✅ La sortie contient `Base directory` (utilisé pour la résolution des chemins)
- ✅ Le contenu de SKILL.md est complet (incluant YAML et corps)
- ✅ Pas d'erreur "Invalid SKILL.md"
- ✅ Tous les chemins de référence sont correctement affichés

## Points de Contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez :

- ✅ Comprendre les spécifications complètes des champs de SKILL.md
- ✅ Maîtriser les scénarios d'utilisation de references/, scripts/, assets/
- ✅ Pouvoir optimiser la taille des fichiers et les performances de chargement des compétences
- ✅ Savoir comment valider le format des compétences et tester le chargement
- ✅ Comprendre le mécanisme de résolution des ressources et le répertoire de base

## Mises en Garde

### Problème 1 : SKILL.md dépasse 5000 mots entraînant le dépassement de tokens

**Cause** : SKILL.md contient trop de documentation détaillée

**Solution** :
1. Déplacer le contenu détaillé vers le répertoire `references/`
2. Dans SKILL.md, référencer : `See references/guide.md for details`
3. Utiliser `wc -w SKILL.md` pour vérifier le nombre de mots

---

### Problème 2 : Les scripts/ ne peuvent pas être exécutés

**Cause** :
- Les scripts manquent de permissions d'exécution
- Utilisation de chemins absolus au lieu de chemins relatifs

**Solution** :
```bash
# Ajouter les permissions d'exécution
chmod +x my-skill/scripts/*.sh

# Utiliser des chemins relatifs dans SKILL.md
## Instructions
Execute: `python scripts/process.py`  # ✅ Correct
Execute: `/path/to/my-skill/scripts/process.py`  # ❌ Incorrect
```

---

### Problème 3 : Les fichiers references/ sont chargés à la demande mais l'IA ne peut pas les lire

**Cause** : L'agent IA n'a pas correctement résolu le chemin `references/`

**Solution** :
1. Confirmer que `openskills read` affiche `Base directory`
2. Lors de la référence, préciser clairement : `See references/api-docs.md in base directory`
3. Éviter d'utiliser des chemins absolus ou des références inter-compétences

---

### Problème 4 : Les fichiers assets/ trop volumineux entraînant des délais de transfert

**Cause** : assets/ stocke des fichiers binaires volumineux (> 10MB)

**Solution** :
- Compresser les images : utiliser PNG au lieu de BMP, optimiser la qualité JPEG
- Diviser les données : diviser de grands ensembles de données en plusieurs petits fichiers
- Utiliser un stockage externe : pour les fichiers très volumineux, fournir un lien de téléchargement plutôt que de les inclure directement

---

### Problème 5 : Erreur de format YAML frontmatter

**Cause** :
- Absence de `---` final
- Les valeurs de champs contiennent des caractères spéciaux (deux-points, dièse) non entre guillemets

**Solution** :
```yaml
# ❌ Incorrect : manque le --- final
---
name: my-skill
description: Use this skill: for testing
# manque ---

# ✅ Correct : fermeture complète
---
name: my-skill
description: "Use this skill: for testing"
---
```

---

### Problème 6 : Les instructions utilisent la deuxième personne (Second Person)

**Cause** : Habitude d'utiliser "You should", "When you want"

**Solution** :
- Utiliser un langage impératif commençant par un verbe
- Utiliser "To do X, execute Y" au lieu de "You should do Y"
- Utiliser "Load this skill when Z" au lieu de "If you need Z"

**Tableau de comparaison** :

| Deuxième Personne (❌ à éviter) | Impératif (✅ recommandé) |
|--- | ---|
| "You should execute..." | "To execute X, run..."   |
| "When you want to..."  | "Load this skill when..."  |
| "If you need..."       | "Use X to accomplish Y"    |

## Résumé du Cours

Points clés de la structure des compétences :

1. **YAML frontmatter** : Champs requis `name` (format avec traits d'union) et `description` (1-2 phrases)
2. **Format du corps** : Utiliser la forme impérative/infinitive, éviter la deuxième personne
3. **references/** : Stocker la documentation détaillée, chargée à la demande dans le contexte (< 10,000 mots/fichier)
4. **scripts/** : Stocker les scripts exécutables, non chargés dans le contexte, adaptés aux tâches déterministes
5. **assets/** : Stocker les modèles et fichiers de sortie, non chargés dans le contexte
6. **Taille des fichiers** : SKILL.md < 5,000 mots, references/ peut être divisé, scripts/ sans limite
7. **Résolution des chemins** : Utiliser des chemins relatifs (`references/`, `scripts/`, `assets/`), résolus à partir du répertoire de base
8. **Méthodes de validation** : Utiliser `openskills install` pour valider le format, `openskills read` pour tester le chargement

## Prochaine Leçon

> Dans la prochaine leçon, nous apprendrons **[Intégration CI/CD](../ci-integration/)**.
>
> Vous apprendrez :
> - Comment utiliser le flag `-y/--yes` dans les environnements CI/CD
> - Automatiser les processus d'installation et de synchronisation des compétences
> - Intégrer OpenSkills dans GitHub Actions, GitLab CI

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Mis à jour : 2026-01-24

| Fonction | Chemin du Fichier | Lignes |
|--- | --- | ---|
| Validation du YAML frontmatter | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14 |
| Extraction des champs YAML | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Commande de lecture de compétence | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-49 |
| Sortie du répertoire de base | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 42 |
| Validation du format lors de l'installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |

**Exemples de fichiers de compétences** :
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Exemple de structure complète
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Référence des spécifications de format

**Fonctions clés** :
- `hasValidFrontmatter(content: string): boolean` - Vérifie si SKILL.md commence par `---`
- `extractYamlField(content: string, field: string): string` - Extrait la valeur d'un champ YAML (correspondance non gourmande)
- `readSkill(skillNames: string[] | string): void` - Lit la compétence vers la sortie standard (pour utilisation par l'IA)

</details>
