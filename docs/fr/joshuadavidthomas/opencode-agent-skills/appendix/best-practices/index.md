---
title: "Bonnes pratiques : Développement de Skills | opencode-agent-skills"
sidebarTitle: "Écrire des Skills de qualité"
subtitle: "Bonnes pratiques : Développement de Skills"
description: "Maîtrisez les conventions de développement d'OpenCode Agent Skills. Apprenez les bonnes pratiques de nommage, description, organisation des répertoires, scripts et Frontmatter pour améliorer la qualité et l'efficacité de vos skills."
tags:
  - "Bonnes pratiques"
  - "Développement de Skills"
  - "Conventions"
  - "Anthropic Skills"
prerequisite:
  - "creating-your-first-skill"
order: 1
---

# Bonnes pratiques pour le développement de Skills

## Ce que vous apprendrez

À la fin de ce tutoriel, vous serez capable de :
- Rédiger des noms de skills conformes aux conventions de nommage
- Écrire des descriptions facilement identifiables par le système de recommandation automatique
- Organiser une structure de répertoire claire pour vos skills
- Utiliser judicieusement les fonctionnalités de scripts
- Éviter les erreurs courantes de Frontmatter
- Améliorer la découvrabilité et l'utilisabilité de vos skills

## Pourquoi suivre les bonnes pratiques

Le plugin OpenCode Agent Skills ne se contente pas de stocker les skills, il :
- **Découvre automatiquement** : scanne les répertoires de skills depuis plusieurs emplacements
- **Effectue une correspondance sémantique** : recommande les skills selon la similarité entre leur description et le message de l'utilisateur
- **Gère les espaces de noms** : permet la coexistence de skills provenant de sources multiples
- **Exécute des scripts** : scanne et exécute automatiquement les scripts exécutables

Suivre les bonnes pratiques permet à vos skills de :
- ✅ Être correctement identifiés et chargés par le plugin
- ✅ Obtenir une priorité de recommandation plus élevée lors de la correspondance sémantique
- ✅ Éviter les conflits avec d'autres skills
- ✅ Être plus facilement compris et utilisés par les membres de l'équipe

---

## Conventions de nommage

### Règles pour les noms de skills

Les noms de skills doivent respecter les conventions suivantes :

::: tip Règles de nommage
- ✅ Utiliser des lettres minuscules, des chiffres et des tirets
- ✅ Commencer par une lettre
- ✅ Séparer les mots par des tirets
- ❌ Ne pas utiliser de majuscules ni de tirets bas
- ❌ Ne pas utiliser d'espaces ni de caractères spéciaux
:::

**Exemples** :

| ✅ Correct | ❌ Incorrect | Raison |
| --- | --- | --- |
| `git-helper` | `GitHelper` | Contient des majuscules |
| `docker-build` | `docker_build` | Utilise un tiret bas |
| `code-review` | `code review` | Contient un espace |
| `test-utils` | `1-test` | Commence par un chiffre |

**Référence du code source** : `src/skills.ts:106-108`

```typescript
name: z.string()
  .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
  .min(1, { message: "Name cannot be empty" }),
```

### Relation entre le nom du répertoire et le frontmatter

Le nom du répertoire du skill et le champ `name` dans le frontmatter peuvent être différents :

```yaml
---
# Le répertoire est my-git-tools, mais le name dans le frontmatter est git-helper
name: git-helper
description: Assistant pour les opérations Git courantes
---
```

**Recommandations** :
- Garder le nom du répertoire et le champ `name` identiques pour faciliter la maintenance
- Utiliser un identifiant court et mémorable pour le nom du répertoire
- Le champ `name` peut décrire plus précisément l'utilité du skill

**Référence du code source** : `src/skills.ts:155-158`

---

## Techniques de rédaction des descriptions

### Rôle de la description

La description d'un skill n'est pas seulement une explication pour l'utilisateur, elle sert également à :

1. **Correspondance sémantique** : le plugin calcule la similarité entre la description et le message de l'utilisateur
2. **Recommandation de skills** : recommande automatiquement les skills pertinents selon la similarité
3. **Correspondance approximative** : suggère des skills similaires en cas de faute de frappe dans le nom

### Bonne description vs mauvaise description

| ✅ Bonne description | ❌ Mauvaise description | Raison |
| --- | --- | --- |
| "Automatise la gestion des branches Git et le processus de commit, avec génération automatique des messages de commit" | "Outil Git" | Trop vague, manque de fonctionnalités concrètes |
| "Génère du code client API type-safe pour les projets Node.js" | "Un outil utile" | Ne précise pas le cas d'utilisation |
| "Traduit des PDF en chinois en préservant la mise en page originale" | "Outil de traduction" | Ne mentionne pas les capacités spéciales |

### Principes de rédaction des descriptions

::: tip Principes de rédaction
1. **Être spécifique** : décrire l'utilité concrète et les cas d'utilisation du skill
2. **Inclure des mots-clés** : inclure les mots-clés que les utilisateurs pourraient rechercher (ex : "Git", "Docker", "traduction")
3. **Mettre en avant la valeur unique** : expliquer les avantages de ce skill par rapport aux autres du même type
4. **Éviter la redondance** : ne pas répéter le nom du skill
:::

**Exemple** :

```markdown
---
name: pdf-translator
description: Traduit des documents PDF anglais en chinois, en préservant la mise en page originale, la position des images et la structure des tableaux. Prend en charge la traduction par lots et les glossaires personnalisés.
---
```

Cette description inclut :
- ✅ Fonctionnalités concrètes (traduction PDF, préservation du format)
- ✅ Cas d'utilisation (documents en anglais)
- ✅ Valeur unique (préservation du format, traitement par lots, glossaire)

**Référence du code source** : `src/skills.ts:109`

```typescript
description: z.string()
  .min(1, { message: "Description cannot be empty" }),
```

---

## Organisation des répertoires

### Structure de base

Un répertoire de skill standard contient :

```
my-skill/
├── SKILL.md              # Fichier principal du skill (obligatoire)
├── README.md             # Documentation détaillée (optionnel)
├── tools/                # Scripts exécutables (optionnel)
│   ├── setup.sh
│   └── run.sh
└── docs/                 # Documentation de support (optionnel)
    ├── guide.md
    └── examples.md
```

### Répertoires ignorés

Le plugin ignore automatiquement les répertoires suivants (pas de scan de scripts) :

::: warning Répertoires automatiquement ignorés
- `node_modules` - Dépendances Node.js
- `__pycache__` - Cache de bytecode Python
- `.git` - Contrôle de version Git
- `.venv`, `venv` - Environnements virtuels Python
- `.tox`, `.nox` - Environnements de test Python
- Tout répertoire caché commençant par `.`
:::

**Référence du code source** : `src/skills.ts:61`

```typescript
const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);
```

### Noms de répertoires recommandés

| Usage | Nom recommandé | Description |
| --- | --- | --- |
| Fichiers de scripts | `tools/` ou `scripts/` | Stockage des scripts exécutables |
| Documentation | `docs/` ou `examples/` | Stockage de la documentation auxiliaire |
| Configuration | `config/` | Stockage des fichiers de configuration |
| Modèles | `templates/` | Stockage des fichiers modèles |

---

## Utilisation des scripts

### Règles de découverte des scripts

Le plugin scanne automatiquement les fichiers exécutables dans le répertoire du skill :

::: tip Règles de découverte des scripts
- ✅ Les scripts doivent avoir les permissions d'exécution (`chmod +x script.sh`)
- ✅ Profondeur de récursion maximale de 10 niveaux
- ✅ Les répertoires cachés et de dépendances sont ignorés
- ❌ Les fichiers non exécutables ne sont pas reconnus comme scripts
:::

**Référence du code source** : `src/skills.ts:86`

```typescript
if (stats.mode & 0o111) {
  scripts.push({
    relativePath: newRelPath,
    absolutePath: fullPath
  });
}
```

### Définir les permissions des scripts

**Scripts Bash** :
```bash
chmod +x tools/setup.sh
chmod +x tools/run.sh
```

**Scripts Python** :
```bash
chmod +x tools/scan.py
```

Et ajouter le shebang au début du fichier :
```python
#!/usr/bin/env python3
import sys
# ...
```

### Exemple d'appel de script

Lorsqu'un skill est chargé, l'IA voit la liste des scripts disponibles :

```
Available scripts:
- tools/setup.sh: Initialise l'environnement de développement
- tools/build.sh: Compile le projet
- tools/deploy.sh: Déploie en production
```

L'IA peut appeler ces scripts via l'outil `run_skill_script` :

```javascript
run_skill_script({
  skill: "project-builder",
  script: "tools/build.sh",
  arguments: ["--release", "--verbose"]
})
```

---

## Bonnes pratiques pour le Frontmatter

### Champs obligatoires

**name** : Identifiant unique du skill
- Lettres minuscules, chiffres et tirets
- Court mais descriptif
- Éviter les noms génériques (comme `helper`, `tool`)

**description** : Description du skill
- Décrire concrètement les fonctionnalités
- Inclure les cas d'utilisation
- Longueur modérée (1-2 phrases)

### Champs optionnels

**license** : Informations de licence
```yaml
license: MIT
```

**allowed-tools** : Restreindre les outils utilisables par le skill
```yaml
allowed-tools:
  - read
  - write
  - bash
```

**metadata** : Métadonnées personnalisées
```yaml
metadata:
  author: "Your Name"
  version: "1.0.0"
  category: "development"
```

**Référence du code source** : `src/skills.ts:105-114`

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

### Exemple complet

```markdown
---
name: docker-deploy
description: Automatise le processus de build et de déploiement d'images Docker, avec support de la configuration multi-environnements, des health checks et du rollback
license: MIT
allowed-tools:
  - read
  - write
  - bash
metadata:
  version: "2.1.0"
  author: "DevOps Team"
  category: "deployment"
---

# Déploiement automatique Docker

Ce skill vous aide à automatiser le processus de build, push et déploiement d'images Docker.

## Utilisation

...
```

---

## Éviter les erreurs courantes

### Erreur 1 : Nom non conforme aux conventions

**Exemple incorrect** :
```yaml
name: MyAwesomeSkill  # ❌ Majuscules
```

**Correction** :
```yaml
name: my-awesome-skill  # ✅ Minuscules + tirets
```

### Erreur 2 : Description trop vague

**Exemple incorrect** :
```yaml
description: "Un outil utile"  # ❌ Trop vague
```

**Correction** :
```yaml
description: "Automatise le processus de commit Git, génère automatiquement des messages de commit conformes aux conventions"  # ✅ Spécifique et clair
```

### Erreur 3 : Script sans permissions d'exécution

**Problème** : Le script n'est pas reconnu comme exécutable

**Solution** :
```bash
chmod +x tools/setup.sh
```

**Vérification** :
```bash
ls -l tools/setup.sh
# Devrait afficher : -rwxr-xr-x (avec permission x)
```

### Erreur 4 : Conflit de noms de répertoires

**Problème** : Plusieurs skills utilisent le même nom

**Solutions** :
- Utiliser des espaces de noms (via la configuration du plugin ou la structure des répertoires)
- Ou utiliser des noms plus descriptifs

**Référence du code source** : `src/skills.ts:258-259`

```typescript
// Les skills homonymes ne conservent que le premier, les suivants sont ignorés
if (skillsByName.has(skill.name)) {
  continue;
}
```

---

## Améliorer la découvrabilité

### 1. Optimiser les mots-clés de la description

Inclure dans la description les mots-clés que les utilisateurs pourraient rechercher :

```yaml
---
name: code-reviewer
description: Outil automatisé de revue de code, vérifie la qualité du code, les bugs potentiels, les failles de sécurité et les problèmes de performance. Prend en charge JavaScript, TypeScript, Python et d'autres langages.
---
```

Mots-clés : revue de code, qualité du code, bug, faille de sécurité, problème de performance, JavaScript, TypeScript, Python

### 2. Utiliser les emplacements standards pour les skills

Le plugin découvre les skills selon l'ordre de priorité suivant :

1. `.opencode/skills/` - Niveau projet (priorité la plus haute)
2. `.claude/skills/` - Niveau projet Claude
3. `~/.config/opencode/skills/` - Niveau utilisateur
4. `~/.claude/skills/` - Niveau utilisateur Claude

**Recommandations** :
- Skills spécifiques au projet → placer au niveau projet
- Skills génériques → placer au niveau utilisateur

### 3. Fournir une documentation détaillée

En plus de SKILL.md, vous pouvez fournir :
- `README.md` - Explications détaillées et exemples d'utilisation
- `docs/guide.md` - Guide d'utilisation complet
- `docs/examples.md` - Exemples pratiques

---

## Résumé de la leçon

Ce tutoriel a présenté les bonnes pratiques de développement de skills :

- **Conventions de nommage** : utiliser des lettres minuscules, des chiffres et des tirets
- **Rédaction des descriptions** : être spécifique, inclure des mots-clés, mettre en avant la valeur unique
- **Organisation des répertoires** : structure claire, ignorer les répertoires inutiles
- **Utilisation des scripts** : définir les permissions d'exécution, respecter la limite de profondeur
- **Conventions Frontmatter** : remplir correctement les champs obligatoires et optionnels
- **Éviter les erreurs** : problèmes courants et solutions

Suivre ces bonnes pratiques permet à vos skills de :
- ✅ Être correctement identifiés et chargés par le plugin
- ✅ Obtenir une priorité de recommandation plus élevée lors de la correspondance sémantique
- ✅ Éviter les conflits avec d'autres skills
- ✅ Être plus facilement compris et utilisés par les membres de l'équipe

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons la **[Référence API des outils](../api-reference/)**.
>
> Vous découvrirez :
> - Les paramètres détaillés de tous les outils disponibles
> - Des exemples d'appels d'outils et les formats de retour
> - Les utilisations avancées et les points d'attention

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements dans le code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Validation du nom de skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L106-L108) | 106-108 |
| Validation de la description | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L109-L110) | 109-110 |
| Définition du schéma Frontmatter | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Liste des répertoires ignorés | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61) | 61 |
| Vérification des permissions d'exécution | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| Logique de déduplication des skills homonymes | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |

**Constantes clés** :
- Répertoires ignorés : `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`

**Fonctions clés** :
- `findScripts(skillPath: string, maxDepth: number = 10)` : Recherche récursive des scripts exécutables dans le répertoire du skill
- `parseSkillFile(skillPath: string)` : Parse SKILL.md et valide le frontmatter

</details>
