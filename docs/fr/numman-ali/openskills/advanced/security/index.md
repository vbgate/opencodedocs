---
title: "Sécurité : Parcours de chemin et liens symboliques | OpenSkills"
sidebarTitle: "Prévention des parcours de chemin"
subtitle: "Sécurité : Parcours de chemin et liens symboliques | OpenSkills"
description: "Apprenez les mécanismes de protection à trois couches d'OpenSkills. Comprenez la protection contre le parcours de chemin, le traitement sécurisé des liens symboliques, la sécurité de l'analyse YAML pour garantir l'installation et l'utilisation sécurisées des compétences."
tags:
  - "Sécurité"
  - "Parcours de chemin"
  - "Liens symboliques"
  - "YAML"
prerequisite:
  - "advanced-ci-integration"
order: 7
---

# Sécurité OpenSkills

## Ce que vous pourrez faire après ce cours

- Comprendre les mécanismes de protection à trois couches d'OpenSkills
- Connaître les principes et les méthodes de protection contre les attaques de parcours de chemin
- Maîtriser le traitement sécurisé des liens symboliques
- Reconnaître les risques ReDoS et les mesures de protection lors de l'analyse YAML

## Votre problème actuel

Vous avez peut-être entendu dire que "l'exécution locale est plus sécurisée", mais vous ne connaissez pas les mesures de protection spécifiques. Ou vous vous inquiétez lors de l'installation de compétences :
- Les fichiers seront-ils écrits dans les répertoires système ?
- Les liens symboliques présenteront-ils des risques de sécurité ?
- L'analyse du YAML dans SKILL.md présentera-t-elle des vulnérabilités ?

## Quand utiliser cette approche

Lorsque vous avez besoin de :
- Déployer OpenSkills dans un environnement d'entreprise
- Auditer la sécurité d'OpenSkills
- Évaluer les solutions de gestion de compétences du point de vue de la sécurité
- Répondre aux examens techniques de l'équipe de sécurité

## Idées principales

La conception de sécurité d'OpenSkills suit trois principes :

::: info Protection à trois couches
1. **Validation des entrées** - Vérifier toutes les entrées externes (chemins, URL, YAML)
2. **Exécution isolée** - S'assurer que les opérations se produisent dans le répertoire attendu
3. **Analyse sécurisée** - Prévenir les vulnérabilités de l'analyseur (ReDoS)
:::

Exécution locale + absence de téléchargement de données + validation des entrées + isolation des chemins = gestion de compétences sécurisée

## Protection contre le parcours de chemin

### Qu'est-ce qu'une attaque de parcours de chemin

Une **attaque de parcours de chemin (Path Traversal)** est une attaque dans laquelle l'attaquant accède à des fichiers en dehors du répertoire attendu en utilisant des séquences telles que `../`.

**Exemple** : Sans protection, un attaquant pourrait essayer :
```bash
# Tenter d'installer dans les répertoires système
openskills install malicious/skill --target ../../../etc/

# Tenter d'écraser les fichiers de configuration
openskills install malicious/skill --target ../../../../.ssh/
```

### Mécanisme de protection d'OpenSkills

OpenSkills utilise la fonction `isPathInside` pour vérifier que le chemin d'installation doit être à l'intérieur du répertoire cible.

**Emplacement du code source** : [`src/commands/install.ts:71-78`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78)

```typescript
function isPathInside(targetPath: string, targetDir: string): boolean {
  const resolvedTargetPath = resolve(targetPath);
  const resolvedTargetDir = resolve(targetDir);
  const resolvedTargetDirWithSep = resolvedTargetDir.endsWith(sep)
    ? resolvedTargetDir
    : resolvedTargetDir + sep;
  return resolvedTargetPath.startsWith(resolvedTargetDirWithSep);
}
```

**Comment cela fonctionne** :
1. Utiliser `resolve()` pour résoudre tous les chemins relatifs en chemins absolus
2. Normaliser le répertoire cible, s'assurer qu'il se termine par un séparateur de chemin
3. Vérifier si le chemin cible commence par le répertoire cible

**Vérification lors de l'installation** ([`src/commands/install.ts:257-260`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260)) :
```typescript
if (!isPathInside(targetPath, targetDir)) {
  console.error(chalk.red('Security error: Installation path outside target directory'));
  process.exit(1);
}
```

### Vérifier l'efficacité de la protection

**Scénario de test** : Tenter une attaque de parcours de chemin

```bash
# Installation normale (succès)
openskills install anthropics/skills

# Tenter d'utiliser ../ (échec)
openskills install malicious/skill --target ../../../etc/
# Security error: Installation path outside target directory
```

**Ce que vous devriez voir** : Toute tentative d'installation en dehors du répertoire cible sera rejetée, affichant une erreur de sécurité.

## Sécurité des liens symboliques

### Risques des liens symboliques

Un **lien symbolique (Symlink)** est un raccourci vers un autre fichier ou répertoire. S'il n'est pas traité correctement, cela peut entraîner :

1. **Fuite d'informations** - L'attaquant crée un lien symbolique vers des fichiers sensibles
2. **Écrasement de fichiers** - Le lien symbolique pointe vers des fichiers système, écrasés par l'opération d'installation
3. **Référence circulaire** - Le lien symbolique pointe vers lui-même, provoquant une récursion infinie

### Déréférencement lors de l'installation

OpenSkills utilise `dereference: true` pour déréférencer les liens symboliques lors de la copie des fichiers, copiant directement le fichier cible.

**Emplacement du code source** : [`src/commands/install.ts:262`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262)

```typescript
cpSync(skillDir, targetPath, { recursive: true, dereference: true });
```

**Effet** :
- Les liens symboliques sont remplacés par les fichiers réels
- Les liens symboliques eux-mêmes ne sont pas copiés
- Évite que les fichiers pointés par les liens symboliques soient écrasés

### Vérification des liens symboliques lors de la recherche de compétences

OpenSkills prend en charge les compétences sous forme de liens symboliques, mais vérifie si elles sont corrompues.

**Emplacement du code source** : [`src/utils/skills.ts:10-25`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync suit les liens symboliques
      return stats.isDirectory();
    } catch {
      // Lien symbolique brisé ou erreur de permission
      return false;
    }
  }
  return false;
}
```

**Caractéristiques de sécurité** :
- Utiliser `statSync()` pour suivre les liens symboliques et vérifier la cible
- Les liens symboliques brisés seront ignorés (bloc `catch`)
- Ne plante pas, traitement silencieux

::: tip Scénarios d'utilisation
La prise en charge des liens symboliques vous permet de :
- Utiliser directement des compétences à partir du dépôt git (sans copie)
- Synchroniser les modifications lors du développement local
- Partager des bibliothèques de compétences entre plusieurs projets
:::

## Sécurité de l'analyse YAML

### Risque ReDoS

Le **Refus de service par expression régulière (ReDoS)** est une attaque où une entrée malveillante provoque un temps de correspondance exponentiel de l'expression régulière, consommant des ressources CPU.

OpenSkills doit analyser le YAML frontmatter de SKILL.md :
```yaml
---
name: skill-name
description: Skill description
---
```

### Protection par expression régulière non gourmande

OpenSkills utilise des expressions régulières non gourmandes pour éviter ReDoS.

**Emplacement du code source** : [`src/utils/yaml.ts:4`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4)

```typescript
export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

**Points clés** :
- `+?` est un quantificateur **non gourmand**, correspondant à la plus courte possibilité
- `^` et `$` verrouillent le début et la fin de la ligne
- Correspond uniquement à une seule ligne, évitant les imbrications complexes

**Exemple incorrect (correspondance gourmande)** :
```typescript
// ❌ Dangereux : + correspondra de manière gourmande, peut rencontrer une explosion de retour en arrière
new RegExp(`^${field}:\\s*(.+)$`, 'm')
```

**Exemple correct (correspondance non gourmande)** :
```typescript
// ✅ Sûr : +? non gourmand, s'arrête au premier saut de ligne
new RegExp(`^${field}:\\s*(.+?)$`, 'm')
```

## Permissions de fichiers et vérification des sources

### Héritage des permissions système

OpenSkills ne gère pas les permissions de fichiers, héritant directement du contrôle des permissions du système d'exploitation :

- Les fichiers appartiennent au même utilisateur que celui qui exécute OpenSkills
- Les permissions de répertoires suivent le paramètre umask du système
- La gestion des permissions est contrôlée uniformément par le système de fichiers

### Vérification des sources pour les dépôts privés

Lors de l'installation à partir d'un dépôt git privé, OpenSkills s'appuie sur la vérification par clé SSH de git.

**Emplacement du code source** : [`src/commands/install.ts:167`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167)

::: tip Recommandation
Assurez-vous que vos clés SSH sont configurées correctement et ajoutées à la liste des clés autorisées du serveur git.
:::

## Sécurité de l'exécution locale

OpenSkills est un outil purement local, n'impliquant pas de communication réseau (sauf pour cloner des dépôts git) :

### Absence de téléchargement de données

| Opération | Flux de données |
|--- | ---|
| Installer des compétences | Dépôt git → Local |
| Lire des compétences | Local → Sortie standard |
| Synchroniser AGENTS.md | Local → Fichier local |
| Mettre à jour des compétences | Dépôt git → Local |

### Protection de la confidentialité

- Tous les fichiers de compétences sont stockés localement
- Les agents AI lisent via le système de fichiers local
- Pas de dépendance cloud ou de collecte de télémétrie

::: info Différence avec Marketplace
OpenSkills ne dépend pas d'Anthropic Marketplace, s'exécutant entièrement localement.
:::

## Résumé du cours

La protection à trois couches d'OpenSkills :

| Couche de sécurité | Mesure de protection | Emplacement du code source |
|--- | --- | ---|
| **Protection contre le parcours de chemin** | `isPathInside()` vérifie que le chemin est à l'intérieur du répertoire cible | `install.ts:71-78` |
| **Sécurité des liens symboliques** | `dereference: true` déréférence les liens symboliques | `install.ts:262` |
| **Sécurité de l'analyse YAML** | Expression régulière non gourmande `+?` prévient ReDoS | `yaml.ts:4` |

**À retenir** :
- Les attaques de parcours de chemin accèdent à des fichiers en dehors du répertoire attendu via des séquences `../`
- Les liens symboliques doivent être déréférencés ou vérifiés pour éviter les fuites d'informations et l'écrasement de fichiers
- L'analyse YAML utilise des expressions régulières non gourmandes pour éviter ReDoS
- Exécution locale + absence de téléchargement de données = confidentialité et sécurité accrues

## Aperçu du prochain cours

> Le prochain cours couvre **[Bonnes pratiques](../best-practices/)**.
>
> Vous apprendrez :
> - Les meilleures pratiques de configuration de projet
> - Les solutions de collaboration d'équipe pour la gestion des compétences
> - Les techniques d'utilisation dans des environnements multi-agents
> - Les pièges courants et comment les éviter

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonction          | Chemin du fichier                                                                                     | Lignes     |
|--- | --- | ---|
| Protection contre le parcours de chemin   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78) | 71-78    |
| Vérification du chemin d'installation   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260) | 257-260  |
| Déréférencement des liens symboliques | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262) | 262      |
| Vérification du chemin de mise à jour   | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L156-L172) | 156-172  |
| Vérification des liens symboliques   | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25) | 10-25    |
| Sécurité de l'analyse YAML  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4) | 4        |

**Fonctions clés** :
- `isPathInside(targetPath, targetDir)` : Vérifie si le chemin cible est à l'intérieur du répertoire cible (empêche le parcours de chemin)
- `isDirectoryOrSymlinkToDirectory(entry, parentDir)` : Vérifie si un répertoire ou un lien symbolique pointe vers un répertoire
- `extractYamlField(content, field)` : Extrait des champs YAML à l'aide d'une expression régulière non gourmande (empêche ReDoS)

**Journal des modifications** :
- [`CHANGELOG.md:64-68`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md#L64-L68) - Notes de mise à jour de sécurité v1.5.0

</details>
