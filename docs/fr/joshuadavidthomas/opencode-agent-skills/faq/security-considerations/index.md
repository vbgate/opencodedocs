---
title: "Mécanismes de sécurité : Protection des chemins et validation | opencode-agent-skills"
sidebarTitle: "Mécanismes de sécurité"
subtitle: "Mécanismes de sécurité : Protection des chemins et validation"
description: "Découvrez les mécanismes de sécurité du plugin OpenCode Agent Skills. Maîtrisez la protection des chemins, l'analyse YAML, la validation des entrées et la protection de l'exécution des scripts pour utiliser les skills en toute sécurité."
tags:
  - "Sécurité"
  - "Meilleures pratiques"
  - "FAQ"
prerequisite: []
order: 2
---

# Considérations de sécurité

## Ce que vous apprendrez

- Comprendre comment le plugin protège votre système contre les menaces de sécurité
- Connaître les normes de sécurité que les fichiers de skills doivent respecter
- Maîtriser les meilleures pratiques de sécurité lors de l'utilisation du plugin

## Concept clé

Le plugin OpenCode Agent Skills s'exécute dans votre environnement local, exécutant des scripts, lisant des fichiers et analysant des configurations. Bien qu'il soit puissant, des fichiers de skills provenant de sources non fiables peuvent présenter des risques de sécurité.

Le plugin intègre plusieurs mécanismes de sécurité, agissant comme des portes de protection successives, depuis l'accès aux chemins jusqu'à l'analyse des fichiers et l'exécution des scripts. Comprendre ces mécanismes vous permettra d'utiliser le plugin plus sûrement.

## Mécanismes de sécurité détaillés

### 1. Vérification des chemins : Prévention de la traversée de répertoires

**Problème** : Si un fichier de skill contient des chemins malveillants (comme `../../etc/passwd`), il pourrait accéder à des fichiers sensibles du système.

**Mesures de protection** :

Le plugin utilise la fonction `isPathSafe()` (`src/utils.ts:130-133`) pour garantir que tous les accès aux fichiers restent limités au répertoire du skill :

```typescript
export function isPathSafe(basePath: string, requestedPath: string): boolean {
  const resolved = path.resolve(basePath, requestedPath);
  return resolved.startsWith(basePath + path.sep) || resolved === basePath;
}
```

**Principe de fonctionnement** :
1. Résolution du chemin demandé en chemin absolu
2. Vérification que le chemin résolu commence par le répertoire du skill
3. Refus immédiat si le chemin tente de sortir du répertoire (contient `..`)

**Cas pratique** :

Lorsque l'outil `read_skill_file` lit un fichier (`src/tools.ts:101-103`), il appelle d'abord `isPathSafe` :

```typescript
// Sécurité : s'assurer que le chemin ne sort pas du répertoire du skill
if (!isPathSafe(skill.path, args.filename)) {
  return `Chemin invalide : impossible d'accéder aux fichiers en dehors du répertoire du skill.`;
}
```

Cela signifie :
- ✅ `docs/guide.md` → Autorisé (dans le répertoire du skill)
- ❌ `../../../etc/passwd` → Refusé (tentative d'accès aux fichiers système)
- ❌ `/etc/passwd` → Refusé (chemin absolu)

::: info Pourquoi c'est important
Les attaques par traversée de répertoires sont une vulnérabilité courante des applications Web. Même si le plugin s'exécute localement, des skills non fiables pourraient tenter d'accéder à vos clés SSH, configurations de projet ou autres fichiers sensibles.
:::

### 2. Analyse YAML sécurisée : Prévention de l'exécution de code

**Problème** : YAML supporte les balises personnalisées et les objets complexes. Un YAML malveillant pourrait exécuter du code via des balises (comme `!!js/function`).

**Mesures de protection** :

Le plugin utilise la fonction `parseYamlFrontmatter()` (`src/utils.ts:41-49`) avec une stratégie d'analyse YAML stricte :

```typescript
export function parseYamlFrontmatter(text: string): Record<string, unknown> {
  try {
    const result = YAML.parse(text, {
      // Utiliser le schéma core qui ne supporte que les types basiques compatibles JSON
      // Cela empêche les balises personnalisées qui pourraient exécuter du code
      schema: "core",
      // Limiter la profondeur de récursion pour prévenir les attaques DoS
      maxAliasCount: 100,
    });
    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
```

**Paramètres de sécurité clés** :

| Paramètre | Fonction |
| --- | --- |
| `schema: "core"` | Supporte uniquement les types JSON basiques (chaînes, nombres, booléens, tableaux, objets), désactive les balises personnalisées |
| `maxAliasCount: 100` | Limite la profondeur de récursion des alias YAML pour prévenir les attaques DoS |

**Cas pratique** :

```yaml
# Exemple de YAML malveillant (sera rejeté par le schéma core)
---
!!js/function >
function () { return "code malveillant" }
---

# Format sécurisé correct
---
name: my-skill
description: Une description de skill sécurisée
---
```

Si l'analyse YAML échoue, le plugin ignore silencieusement ce skill et continue à découvrir les autres (`src/skills.ts:142-145`) :

```typescript
let frontmatterObj: unknown;
try {
  frontmatterObj = parseYamlFrontmatter(frontmatterText);
} catch {
  return null;  // Échec de l'analyse, ignorer ce skill
}
```

### 3. Validation des entrées : Vérification stricte avec Zod Schema

**Problème** : Les champs frontmatter des skills peuvent ne pas respecter les normes, provoquant des comportements anormaux du plugin.

**Mesures de protection** :

Le plugin utilise Zod Schema (`src/skills.ts:105-114`) pour valider strictement le frontmatter :

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Le nom doit être en minuscules alphanumériques avec tirets" })
    .min(1, { message: "Le nom ne peut pas être vide" }),
  description: z.string()
    .min(1, { message: "La description ne peut pas être vide" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

**Règles de validation** :

| Champ | Règle | Exemple rejeté |
| --- | --- | --- |
| `name` | Lettres minuscules, chiffres, tirets, ne peut pas être vide | `MySkill` (majuscules), `my skill` (espaces) |
| `description` | Ne peut pas être vide | `""` (chaîne vide) |
| `license` | Chaîne optionnelle | - |
| `allowed-tools` | Tableau de chaînes optionnel | `[123]` (non chaîne) |
| `metadata` | Objet clé-valeur optionnel (valeurs en chaînes) | `{key: 123}` (valeur non chaîne) |

**Cas pratique** :

```yaml
# ❌ Erreur : le nom contient des majuscules
---
name: GitHelper
description: Assistant pour les opérations Git
---

# ✅ Correct : conforme aux normes
---
name: git-helper
description: Assistant pour les opérations Git
---
```

Si la validation échoue, le plugin ignore ce skill (`src/skills.ts:147-152`) :

```typescript
let frontmatter: SkillFrontmatter;
try {
  frontmatter = SkillFrontmatterSchema.parse(frontmatterObj);
} catch (error) {
  return null;  // Échec de la validation, ignorer ce skill
}
```

### 4. Sécurité de l'exécution des scripts : Exécution uniquement des fichiers exécutables

**Problème** : Si le plugin exécute des fichiers arbitraires (comme des fichiers de configuration ou de documentation), cela pourrait avoir des conséquences imprévues.

**Mesures de protection** :

Lors de la découverte des scripts (`src/skills.ts:59-99`), le plugin ne collecte que les fichiers ayant des permissions d'exécution :

```typescript
async function findScripts(skillPath: string, maxDepth: number = 10): Promise<Script[]> {
  const scripts: Script[] = [];
  const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);

  // ... logique de parcours récursif ...

  if (stats.isFile()) {
    // Clé : ne collecter que les fichiers avec bit d'exécution
    if (stats.mode & 0o111) {
      scripts.push({
        relativePath: newRelPath,
        absolutePath: fullPath
      });
    }
  }
  // ...
}
```

**Caractéristiques de sécurité** :

| Mécanisme de vérification | Fonction |
| --- | --- |
| **Vérification du bit d'exécution** (`stats.mode & 0o111`) | N'exécute que les fichiers explicitement marqués comme exécutables par l'utilisateur, évite l'exécution accidentelle de documents ou configurations |
| **Ignorer les répertoires cachés** (`entry.name.startsWith('.')`) | Ne scanne pas les répertoires cachés comme `.git`, `.vscode`, évite de scanner trop de fichiers |
| **Ignorer les répertoires de dépendances** (`skipDirs.has(entry.name)`) | Ignore `node_modules`, `__pycache__`, etc., évite de scanner les dépendances tierces |
| **Limite de profondeur de récursion** (`maxDepth: 10`) | Limite la profondeur de récursion à 10 niveaux pour éviter les problèmes de performance avec des répertoires profonds malveillants |

**Cas pratique** :

Dans le répertoire d'un skill :

```bash
my-skill/
├── SKILL.md
├── deploy.sh          # ✓ Exécutable (reconnu comme script)
├── build.sh           # ✓ Exécutable (reconnu comme script)
├── README.md          # ✗ Non exécutable (non reconnu comme script)
├── config.json        # ✗ Non exécutable (non reconnu comme script)
└── node_modules/      # ✗ Ignoré (répertoire de dépendances)
    └── ...           # ✗ Ignoré
```

Si vous appelez `run_skill_script("my-skill", "README.md")`, comme README.md n'a pas les permissions d'exécution et n'est pas reconnu comme script (`src/skills.ts:86`), le plugin retournera une erreur "non trouvé" (`src/tools.ts:165-177`).

## Meilleures pratiques de sécurité

### 1. Obtenir les skills depuis des sources fiables

- ✓ Utiliser les dépôts de skills officiels ou des développeurs de confiance
- ✓ Vérifier le nombre de GitHub Stars et l'activité des contributeurs
- ✗ Ne pas télécharger et exécuter des skills de sources inconnues

### 2. Examiner le contenu des skills

Avant de charger un nouveau skill, parcourez rapidement le fichier SKILL.md et les scripts :

```bash
# Voir la description et les métadonnées du skill
cat .opencode/skills/skill-name/SKILL.md

# Vérifier le contenu des scripts
cat .opencode/skills/skill-name/scripts/*.sh
```

Points d'attention particuliers :
- Les scripts accèdent-ils à des chemins sensibles du système (`/etc`, `~/.ssh`)
- Les scripts installent-ils des dépendances externes
- Les scripts modifient-ils la configuration du système

### 3. Définir correctement les permissions des scripts

Seuls les fichiers nécessitant une exécution explicite doivent avoir les permissions d'exécution :

```bash
# Correct : ajouter les permissions d'exécution aux scripts
chmod +x .opencode/skills/my-skill/tools/deploy.sh

# Correct : les documents restent avec les permissions par défaut (non exécutables)
# README.md, config.json, etc. n'ont pas besoin d'être exécutés
```

### 4. Masquer les fichiers sensibles

Ne pas inclure d'informations sensibles dans le répertoire des skills :

- ✗ Fichiers `.env` (clés API)
- ✗ Fichiers `.pem` (clés privées)
- ✗ Fichiers `credentials.json` (identifiants)
- ✓ Utiliser des variables d'environnement ou une configuration externe pour gérer les données sensibles

### 5. Les skills au niveau projet remplacent les skills au niveau utilisateur

Priorité de découverte des skills (`src/skills.ts:241-246`) :

1. `.opencode/skills/` (niveau projet)
2. `.claude/skills/` (niveau projet, Claude)
3. `~/.config/opencode/skills/` (niveau utilisateur)
4. `~/.claude/skills/` (niveau utilisateur, Claude)
5. `~/.claude/plugins/cache/` (cache du plugin)
6. `~/.claude/plugins/marketplaces/` (marketplace du plugin)

**Meilleures pratiques** :

- Les skills spécifiques au projet vont dans `.opencode/skills/`, remplaçant automatiquement les skills de même nom au niveau utilisateur
- Les skills génériques vont dans `~/.config/opencode/skills/`, disponibles pour tous les projets
- Déconseillé d'installer globalement des skills provenant de sources non fiables

## Résumé de cette leçon

Le plugin OpenCode Agent Skills intègre plusieurs couches de protection de sécurité :

| Mécanisme de sécurité | Objectif de protection | Emplacement du code |
| --- | --- | --- |
| Vérification des chemins | Prévenir la traversée de répertoires, limiter la portée d'accès aux fichiers | `utils.ts:130-133` |
| Analyse YAML sécurisée | Empêcher l'exécution de code via YAML malveillant | `utils.ts:41-49` |
| Validation Zod Schema | Garantir que le frontmatter du skill respecte les normes | `skills.ts:105-114` |
| Vérification d'exécution des scripts | N'exécuter que les fichiers explicitement marqués comme exécutables | `skills.ts:86` |
| Logique d'ignorance des répertoires | Éviter de scanner les répertoires cachés et de dépendances | `skills.ts:61, 70` |

N'oubliez pas : la sécurité est une responsabilité partagée. Le plugin fournit des mécanismes de protection, mais la décision finale vous appartient — n'utilisez que des skills provenant de sources fiables et adoptez l'habitude d'examiner le code.

## Aperçu de la prochaine leçon

> La prochaine leçon couvre **[Meilleures pratiques de développement de skills](../../appendix/best-practices/)**.
>
> Vous découvrirez :
> - Normes de nommage et techniques de rédaction de descriptions
> - Organisation des répertoires et utilisation des scripts
> - Meilleures pratiques pour le frontmatter
> - Méthodes pour éviter les erreurs courantes

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Mécanisme de sécurité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Vérification des chemins | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| Analyse YAML sécurisée | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L56) | 41-56 |
| Validation Zod Schema | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Vérification d'exécution des scripts | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| Logique d'ignorance des répertoires | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61-L70) | 61, 70 |
| Sécurité des chemins dans les outils | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L101-L103) | 101-103 |

**Fonctions clés** :
- `isPathSafe(basePath, requestedPath)` : Vérifie si un chemin est sécurisé, prévient la traversée de répertoires
- `parseYamlFrontmatter(text)` : Analyse YAML sécurisée, utilise le schéma core et limite la récursion
- `SkillFrontmatterSchema` : Schéma Zod, valide les champs du frontmatter du skill
- `findScripts(skillPath, maxDepth)` : Recherche récursive des scripts exécutables, ignore les répertoires cachés et de dépendances

**Constantes clés** :
- `maxAliasCount: 100` : Nombre maximum d'alias pour l'analyse YAML, prévient les attaques DoS
- `maxDepth: 10` : Profondeur maximale de récursion pour la découverte des scripts
- `0o111` : Masque de bits d'exécution (vérifie si un fichier est exécutable)

</details>
