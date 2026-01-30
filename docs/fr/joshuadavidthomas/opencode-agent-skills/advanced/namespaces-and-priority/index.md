---
title: "Espaces de noms : Priorité des Skills | opencode-agent-skills"
sidebarTitle: "Résoudre les conflits de Skills"
subtitle: "Espaces de noms : Priorité des Skills | opencode-agent-skills"
description: "Maîtrisez le système d'espaces de noms et les règles de priorité de découverte des skills. Apprenez les 5 types de labels, les 6 niveaux de priorité, et comment utiliser les espaces de noms pour distinguer les skills homonymes et résoudre les conflits."
tags:
  - "Avancé"
  - "Espaces de noms"
  - "Gestion des Skills"
prerequisite:
  - "start-what-is-opencode-agent-skills"
  - "platforms-skill-discovery-mechanism"
  - "platforms-listing-available-skills"
order: 3
---

# Espaces de noms et priorité des Skills

## Ce que vous apprendrez

- Comprendre le système d'espaces de noms des skills pour distinguer les skills homonymes de différentes sources
- Maîtriser les règles de priorité de découverte des skills et anticiper quel skill sera chargé
- Utiliser les préfixes d'espace de noms pour spécifier précisément la source d'un skill
- Résoudre les conflits entre skills homonymes

## Le problème que vous rencontrez

À mesure que le nombre de skills augmente, vous pouvez rencontrer ces difficultés :

- **Conflits de skills homonymes** : Un skill `git-helper` existe à la fois dans le répertoire projet et utilisateur, et vous ne savez pas lequel est chargé
- **Sources confuses** : Vous ne savez pas quels skills proviennent du niveau projet, utilisateur ou du cache des plugins
- **Comportement de remplacement incompris** : Vous modifiez un skill utilisateur mais il ne prend pas effet car il est remplacé par un skill projet
- **Contrôle imprécis** : Vous voulez forcer l'utilisation d'un skill d'une source spécifique, mais vous ne savez pas comment le spécifier

Ces problèmes proviennent d'une méconnaissance des espaces de noms et des règles de priorité des skills.

## Concept clé

L'**espace de noms** est le mécanisme utilisé par OpenCode Agent Skills pour distinguer les skills homonymes de différentes sources. Chaque skill possède un label identifiant sa source, et ces labels constituent l'espace de noms du skill.

::: info Pourquoi avons-nous besoin d'espaces de noms ?

Imaginez que vous ayez deux skills portant le même nom :
- Niveau projet `.opencode/skills/git-helper/` (personnalisé pour le projet actuel)
- Niveau utilisateur `~/.config/opencode/skills/git-helper/` (version générique)

Sans espace de noms, le système ne saurait pas lequel utiliser. Avec les espaces de noms, vous pouvez spécifier explicitement :
- `project:git-helper` - Forcer l'utilisation de la version projet
- `user:git-helper` - Forcer l'utilisation de la version utilisateur
:::

Les **règles de priorité** garantissent que le système fait un choix raisonnable lorsqu'aucun espace de noms n'est spécifié. Les skills niveau projet ont priorité sur les skills niveau utilisateur, ce qui vous permet de personnaliser des comportements spécifiques dans un projet sans affecter la configuration globale.

## Sources des Skills et Labels

OpenCode Agent Skills prend en charge plusieurs sources de skills, chacune avec son label correspondant :

| Source | Label | Chemin | Description |
| --- | --- | --- | --- |
| **OpenCode niveau projet** | `project` | `.opencode/skills/` | Skills dédiés au projet actuel |
| **Claude niveau projet** | `claude-project` | `.claude/skills/` | Skills projet compatibles Claude Code |
| **OpenCode niveau utilisateur** | `user` | `~/.config/opencode/skills/` | Skills génériques partagés par tous les projets |
| **Claude niveau utilisateur** | `claude-user` | `~/.claude/skills/` | Skills utilisateur compatibles Claude Code |
| **Cache plugins Claude** | `claude-plugins` | `~/.claude/plugins/cache/` | Plugins Claude installés |
| **Marketplace plugins Claude** | `claude-plugins` | `~/.claude/plugins/marketplaces/` | Plugins Claude installés depuis le marketplace |

::: tip Recommandations pratiques
- Configuration spécifique au projet : placez-la dans `.opencode/skills/`
- Skills utilitaires génériques : placez-les dans `~/.config/opencode/skills/`
- Migration depuis Claude Code : pas besoin de déplacer, le système les découvrira automatiquement
:::

## Priorité de découverte des Skills

Lors de la découverte des skills, le système scanne les emplacements dans l'ordre suivant :

```
1. .opencode/skills/              (project)        ← Priorité la plus haute
2. .claude/skills/                (claude-project)
3. ~/.config/opencode/skills/     (user)
4. ~/.claude/skills/              (claude-user)
5. ~/.claude/plugins/cache/       (claude-plugins)
6. ~/.claude/plugins/marketplaces/ (claude-plugins)  ← Priorité la plus basse
```

**Règles clés** :
- **Premier trouvé, premier servi** : Le premier skill trouvé est conservé
- **Déduplication des homonymes** : Les skills homonymes suivants sont ignorés (avec un avertissement)
- **Priorité projet** : Les skills projet remplacent les skills utilisateur

### Exemple de priorité

Supposons que vous ayez la distribution de skills suivante :

```
Répertoire projet :
.opencode/skills/
  └── git-helper/              ← Version A (personnalisée projet)

Répertoire utilisateur :
~/.config/opencode/skills/
  └── git-helper/              ← Version B (générique)

Cache plugins :
~/.claude/plugins/cache/xxx/skills/
  └── git-helper/              ← Version C (plugin Claude)
```

Résultat : Le système charge la **Version A** (`project:git-helper`), les deux skills homonymes suivants sont ignorés.

## Spécifier un Skill avec un espace de noms

Lorsque vous appelez `use_skill` ou d'autres outils, vous pouvez utiliser un préfixe d'espace de noms pour spécifier précisément la source du skill.

### Format de syntaxe

```
namespace:skill-name
```

ou

```
skill-name  # Sans espace de noms, utilise la priorité par défaut
```

### Liste des espaces de noms

```
project:skill-name         # Skill OpenCode niveau projet
claude-project:skill-name  # Skill Claude niveau projet
user:skill-name            # Skill OpenCode niveau utilisateur
claude-user:skill-name     # Skill Claude niveau utilisateur
claude-plugins:skill-name  # Skill plugin Claude
```

### Exemples d'utilisation

**Scénario 1 : Chargement par défaut (selon priorité)**

```
use_skill("git-helper")
```

- Le système recherche selon la priorité et charge le premier skill correspondant
- C'est-à-dire `project:git-helper` (s'il existe)

**Scénario 2 : Forcer l'utilisation du skill utilisateur**

```
use_skill("user:git-helper")
```

- Contourne les règles de priorité et charge directement le skill utilisateur
- Accessible même si le skill utilisateur est remplacé par le skill projet

**Scénario 3 : Charger un skill de plugin Claude**

```
use_skill("claude-plugins:git-helper")
```

- Charge explicitement un skill provenant d'un plugin Claude
- Utile lorsque vous avez besoin d'une fonctionnalité spécifique d'un plugin

## Logique de correspondance des espaces de noms

Lors de l'utilisation du format `namespace:skill-name`, la logique de correspondance du système est la suivante :

1. **Analyse de l'entrée** : Sépare l'espace de noms et le nom du skill
2. **Parcours de tous les skills** : Recherche le skill correspondant
3. **Conditions de correspondance** :
   - Le nom du skill correspond
   - Le champ `label` du skill est égal à l'espace de noms spécifié
   - Ou le champ personnalisé `namespace` du skill est égal à l'espace de noms spécifié
4. **Retour du résultat** : Le premier skill satisfaisant les conditions

::: details Code source de la logique de correspondance

```typescript
export function resolveSkill(
  skillName: string,
  skillsByName: Map<string, Skill>
): Skill | null {
  if (skillName.includes(':')) {
    const [namespace, name] = skillName.split(':');
    for (const skill of skillsByName.values()) {
      if (skill.name === name &&
          (skill.label === namespace || skill.namespace === namespace)) {
        return skill;
      }
    }
    return null;
  }
  return skillsByName.get(skillName) || null;
}
```

:::

## Espaces de noms en mode Superpowers

Lorsque vous activez le mode Superpowers, le système injecte une explication des priorités d'espace de noms lors de l'initialisation de la session :

```markdown
**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
```

Cela garantit que l'IA suit les règles de priorité correctes lors de la sélection des skills.

::: tip Comment activer le mode Superpowers

Définissez la variable d'environnement :

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

:::

## Cas d'utilisation courants

### Scénario 1 : Personnalisation projet remplaçant un skill générique

**Besoin** : Votre projet nécessite un workflow Git spécial, mais vous avez déjà un skill `git-helper` générique au niveau utilisateur.

**Solution** :
1. Créez `.opencode/skills/git-helper/` dans le répertoire projet
2. Configurez le workflow Git spécifique au projet
3. L'appel par défaut `use_skill("git-helper")` utilisera automatiquement la version projet

**Vérification** :

```bash
## Voir la liste des skills, noter les labels
get_available_skills("git-helper")
```

Exemple de sortie :
```
git-helper (project)
  Project-specific Git workflow
```

### Scénario 2 : Basculer temporairement vers un skill générique

**Besoin** : Une tâche nécessite l'utilisation du skill générique utilisateur plutôt que la version personnalisée projet.

**Solution** :

```
use_skill("user:git-helper")
```

Spécifiez explicitement l'espace de noms `user:` pour contourner le remplacement projet.

### Scénario 3 : Charger un skill depuis un plugin Claude

**Besoin** : Vous migrez depuis Claude Code et souhaitez continuer à utiliser un skill de plugin Claude.

**Solution** :

1. Assurez-vous que le chemin du cache des plugins Claude est correct : `~/.claude/plugins/cache/`
2. Consultez la liste des skills :

```
get_available_skills()
```

3. Chargez avec l'espace de noms :

```
use_skill("claude-plugins:plugin-name")
```

## Pièges à éviter

### ❌ Erreur 1 : Ignorer qu'un skill homonyme est remplacé

**Symptôme** : Vous modifiez un skill utilisateur, mais l'IA utilise toujours l'ancienne version.

**Cause** : Un skill projet homonyme a une priorité plus élevée et remplace le skill utilisateur.

**Solution** :
1. Vérifiez si un skill homonyme existe dans le répertoire projet
2. Utilisez l'espace de noms pour forcer la spécification : `use_skill("user:skill-name")`
3. Ou supprimez le skill projet homonyme

### ❌ Erreur 2 : Faute de frappe dans l'espace de noms

**Symptôme** : L'utilisation de `use_skill("project:git-helper")` retourne 404.

**Cause** : Faute de frappe dans l'espace de noms (par exemple `projcet`) ou erreur de casse.

**Solution** :
1. Consultez d'abord la liste des skills : `get_available_skills()`
2. Notez le label entre parenthèses (par exemple `(project)`)
3. Utilisez le nom d'espace de noms correct

### ❌ Erreur 3 : Confondre label et espace de noms personnalisé

**Symptôme** : L'utilisation de `use_skill("project:custom-skill")` ne trouve pas le skill.

**Cause** : `project` est un label, pas un espace de noms personnalisé. À moins que le champ `namespace` du skill soit explicitement défini sur `project`, il n'y aura pas de correspondance.

**Solution** :
- Utilisez directement le nom du skill : `use_skill("custom-skill")`
- Ou consultez le champ `label` du skill et utilisez l'espace de noms correct

## Résumé de cette leçon

Le système d'espaces de noms d'OpenCode Agent Skills permet une gestion unifiée des skills de sources multiples grâce aux labels et aux règles de priorité :

- **5 types de labels source** : `project`, `claude-project`, `user`, `claude-user`, `claude-plugins`
- **6 niveaux de priorité** : Projet > Claude projet > Utilisateur > Claude utilisateur > Cache plugins > Marketplace plugins
- **Premier trouvé, premier servi** : Les skills homonymes sont chargés selon la priorité, les suivants sont ignorés
- **Préfixe d'espace de noms** : Utilisez le format `namespace:skill-name` pour spécifier précisément la source du skill

Ce mécanisme vous permet de profiter de la commodité de la découverte automatique tout en contrôlant précisément la source des skills quand nécessaire.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons le **[Mécanisme de résilience à la compression de contexte](../context-compaction-resilience/)**.
>
> Vous apprendrez :
> - L'impact de la compression de contexte sur les skills
> - Comment le plugin restaure automatiquement la liste des skills
> - Les techniques pour maintenir les skills disponibles lors de sessions prolongées

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition du type SkillLabel | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| Liste des priorités de découverte | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Logique de déduplication des homonymes | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |
| Traitement des espaces de noms resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Explication des espaces de noms Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |

**Types clés** :
- `SkillLabel` : Énumération des labels de source des skills
- `Skill` : Interface des métadonnées du skill (contient les champs `namespace` et `label`)

**Fonctions clés** :
- `discoverAllSkills()` : Découvre les skills par priorité, déduplique automatiquement
- `resolveSkill()` : Analyse le préfixe d'espace de noms, recherche le skill
- `maybeInjectSuperpowersBootstrap()` : Injecte l'explication des priorités d'espace de noms

**Liste des chemins de découverte** (par ordre de priorité) :
1. `project` - `.opencode/skills/`
2. `claude-project` - `.claude/skills/`
3. `user` - `~/.config/opencode/skills/`
4. `claude-user` - `~/.claude/skills/`
5. `claude-plugins` - `~/.claude/plugins/cache/` et `~/.claude/plugins/marketplaces/`

</details>
