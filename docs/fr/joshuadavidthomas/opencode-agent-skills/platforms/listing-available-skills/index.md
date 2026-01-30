---
title: "Gestion des Compétences : Rechercher les Compétences Disponibles | opencode-agent-skills"
sidebarTitle: "Rechercher Rapidement une Compétence"
subtitle: "Gestion des Compétences : Rechercher les Compétences Disponibles"
description: "Apprenez à utiliser l'outil get_available_skills. Localisez rapidement les compétences via la recherche, les espaces de noms et les filtres, et maîtrisez les fonctions essentielles de découverte et de gestion des compétences."
tags:
  - "Gestion des Compétences"
  - "Utilisation des Outils"
  - "Espaces de Noms"
prerequisite:
  - "start-installation"
order: 2
---

# Rechercher et Lister les Compétences Disponibles

## Ce Que Vous Apprendrez

- Utiliser l'outil `get_available_skills` pour lister toutes les compétences disponibles
- Filtrer des compétences spécifiques via des requêtes de recherche
- Utiliser les espaces de noms (par exemple `project:skill-name`) pour localiser précisément une compétence
- Identifier la source des compétences et la liste des scripts exécutables

## Votre Situation Actuelle

Vous souhaitez utiliser une compétence, mais vous ne vous souvenez plus de son nom exact. Peut-être savez-vous qu'il s'agit d'une compétence du projet, mais vous ignorez dans quel chemin de découverte elle se trouve. Ou bien vous souhaitez simplement parcourir rapidement les compétences disponibles dans le projet actuel.

## Quand Utiliser Cette Méthode

- **Explorer un nouveau projet** : Lorsque vous rejoignez un nouveau projet, familiarisez-vous rapidement avec les compétences disponibles
- **Nom de compétence incertain** : Vous ne vous souvenez que d'une partie du nom ou de la description de la compétence et avez besoin d'une correspondance approximative
- **Conflits d'espaces de noms multiples** : Des compétences portant le même nom existent au niveau du projet et de l'utilisateur ; vous devez spécifier clairement laquelle utiliser
- **Rechercher des scripts** : Vous souhaitez savoir quels scripts d'automatisation exécutables se trouvent dans le répertoire de la compétence

## Idée Centrale

L'outil `get_available_skills` vous permet de visualiser toutes les compétences disponibles pour la session actuelle. Le plugin analyse automatiquement les compétences à partir de 6 chemins de découverte :

::: info Priorité de Découverte des Compétences
1. `.opencode/skills/` (OpenCode niveau projet)
2. `.claude/skills/` (Claude niveau projet)
3. `~/.config/opencode/skills/` (OpenCode niveau utilisateur)
4. `~/.claude/skills/` (Claude niveau utilisateur)
5. `~/.claude/plugins/cache/` (Cache des plugins)
6. `~/.claude/plugins/marketplaces/` (Plugins installés)
:::

Pour les compétences portant le même nom, seule la première est conservée selon la priorité ; les suivantes sont ignorées.

Les informations retournées par l'outil incluent :
- **Nom de la compétence**
- **Étiquette de source** (project, user, claude-project, etc.)
- **Description**
- **Liste des scripts exécutables** (le cas échéant)

::: tip Syntaxe des Espaces de Noms
Vous pouvez spécifier explicitement la source au format `namespace:skill-name` :
- `project:my-skill` - Utiliser la compétence OpenCode niveau projet (`.opencode/skills/`)
- `claude-project:my-skill` - Utiliser la compétence Claude niveau projet (`.claude/skills/`)
- `user:my-skill` - Utiliser la compétence OpenCode niveau utilisateur (`~/.config/opencode/skills/`)
- `claude-user:my-skill` - Utiliser la compétence Claude niveau utilisateur (`~/.claude/skills/`)
- `claude-plugins:my-skill` - Utiliser une compétence depuis un plugin Claude
:::

## Procédure à Suivre

### Étape 1 : Lister Toutes les Compétences Disponibles

Demandez directement à l'IA dans OpenCode de lister les compétences :

```
Entrée utilisateur :
Lister toutes les compétences disponibles

Réponse du système :
skill-helper (project)
  Assistant pour les opérations Git et la gestion des branches [scripts: tools/branch.sh, tools/commit.sh]

test-helper (user)
  Outils pour les tests unitaires et l'analyse de couverture

docker-helper (project)
  Guide pour la conteneurisation Docker et le déploiement [scripts: build.sh, deploy.sh]

claude-code-superpowers (claude-plugins)
  Flux de travail complet pour le développement logiciel
```

**Ce que vous devriez voir** : Une liste de compétences, chacune affichant son nom, son étiquette de source, sa description et sa liste de scripts.

### Étape 2 : Utiliser une Requête de Recherche pour Filtrer

Si vous ne vous souvenez que d'une partie du nom de la compétence :

```
Entrée utilisateur :
Rechercher des compétences contenant "docker"

Réponse du système :
docker-helper (project)
  Guide pour la conteneurisation Docker et le déploiement [scripts: build.sh, deploy.sh]
```

La recherche correspondra aux mots-clés dans les noms et les descriptions des compétences, et prend en charge le caractère générique `*` :

```
Entrée utilisateur :
Rechercher des compétences commençant par "test"

Réponse du système :
test-helper (user)
  Outils pour les tests unitaires et l'analyse de couverture
```

**Ce que vous devriez voir** : Affichage uniquement des compétences correspondant aux conditions de la requête.

### Étape 3 : Tester la Suggestion de Correspondance Approximative

Si vous saisissez un nom de compétence incorrect :

```
Entrée utilisateur :
Je veux utiliser docker-asistant

Réponse du système :
Aucune compétence trouvée correspondant à "docker-asistant". Vouliez-vous dire "docker-helper" ?
```

Le plugin calculera la similarité basée sur la distance de Levenshtein et suggérera automatiquement le nom de compétence le plus proche.

**Ce que vous devriez voir** : Un message d'erreur avec la suggestion de nom de compétence correcte.

### Étape 4 : Utiliser l'Espace de Noms pour une Localisation Précise

Supposons qu'il existe une compétence nommée `build-helper` à la fois au niveau du projet et de l'utilisateur :

```
Entrée utilisateur :
Afficher les détails de build-helper

Réponse du système :
build-helper (project)
  Configuration de build spécifique au projet et optimisation de compilation [scripts: build.sh, optimize.sh]
```

Si l'utilisateur souhaite la compétence au niveau utilisateur :

```
Entrée utilisateur :
Utiliser user:build-helper

Réponse du système :
build-helper (user)
  Chaîne d'outils de build générique et configuration d'intégration continue [scripts: ci.sh, test.sh]
```

**Ce que vous devriez voir** : L'utilisation du préfixe d'espace de noms permet d'accéder à des compétences portant le même nom mais provenant de sources différentes.

### Étape 5 : Vérifier les Scripts Exécutables

Vérifiez quels scripts se trouvent dans le répertoire de la compétence :

```
Entrée utilisateur :
Quels scripts docker-helper possède-t-il ?

Réponse du système :
docker-helper (project)
  Guide pour la conteneurisation Docker et le déploiement [scripts: build.sh, deploy.sh]
```

Les scripts s'affichent entre crochets dans les informations de la compétence, séparés par des virgules. Vous pouvez exécuter ces scripts avec l'outil `run_skill_script`.

**Ce que vous devriez voir** : Le nom de la compétence suivi d'une liste au format `[scripts: chemin_script1, chemin_script2, ...]`.

## Points de Contrôle ✅

- [ ] Pouvez-vous lister toutes les compétences disponibles ?
- [ ] Pouvez-vous utiliser une requête de recherche pour filtrer des compétences spécifiques ?
- [ ] Comprenez-vous la signification des étiquettes de source des compétences (project, user, claude-project, etc.) ?
- [ ] Pouvez-vous expliquer le rôle et la syntaxe des espaces de noms de compétences ?
- [ ] Pouvez-vous identifier la liste des scripts exécutables à partir des informations de la compétence ?

## Pièges à Éviter

### Piège 1 : Le Masquage des Compétences Portant le Même Nom

Si des compétences portant le même nom existent au niveau du projet et de l'utilisateur, vous pourriez être confus quant à la raison pour laquelle la compétence chargée n'est pas celle que vous attendiez.

**Cause** : Les compétences sont découvertes selon une priorité, le niveau projet étant prioritaire sur le niveau utilisateur ; seule la première compétence portant un nom donné est conservée.

**Solution** : Utilisez l'espace de noms pour spécifier explicitement, par exemple `user:my-skill` plutôt que `my-skill`.

### Piège 2 : La Sensibilité à la Casse de la Recherche

La requête de recherche utilise des expressions régulières, mais est configurée avec l'indicateur `i`, elle est donc insensible à la casse.

```bash
# Ces recherches sont équivalentes
get_available_skills(query="docker")
get_available_skills(query="DOCKER")
get_available_skills(query="Docker")
```

### Piège 3 : L'Échappement des Caractères Génériques

Le caractère générique `*` dans la recherche est automatiquement converti en expression régulière `.*`, vous n'avez pas besoin d'échapper manuellement :

```bash
# Rechercher des compétences commençant par "test"
get_available_skills(query="test*")

# Équivalent à l'expression régulière /test.*/i
```

## Résumé de la Leçon

`get_available_skills` est un outil pour explorer l'écosystème des compétences, prenant en charge :

- **Lister toutes les compétences** : Appel sans paramètres
- **Filtrage par recherche** : Filtrer par correspondance sur les noms et descriptions via le paramètre `query`
- **Espaces de noms** : Localisation précise avec le format `namespace:skill-name`
- **Suggestions de correspondance approximative** : Suggestion automatique du nom correct en cas d'erreur de frappe
- **Liste des scripts** : Affichage des scripts d'automatisation exécutables

Le plugin injecte automatiquement la liste des compétences au début de la session, vous n'avez donc généralement pas besoin d'appeler manuellement cet outil. Cependant, il est utile dans les scénarios suivants :
- Vous souhaitez parcourir rapidement les compétences disponibles
- Vous ne vous souvenez pas du nom exact d'une compétence
- Vous devez distinguer différentes sources de compétences portant le même nom
- Vous souhaitez consulter la liste des scripts d'une compétence

## Aperçu de la Prochaine Leçon

> Dans la prochaine leçon, nous apprendrons **[Charger les Compétences dans le Contexte de Session](../loading-skills-into-context/)**.
>
> Vous apprendrez :
> - À utiliser l'outil `use_skill` pour charger les compétences dans la session actuelle
> - À comprendre comment le contenu des compétences est injecté au format XML dans le contexte
> - À maîtriser le mécanisme d'Injection de Message Synthétique (Synthetic Message Injection)
> - À savoir comment les compétences restent disponibles après la compression de session

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du Fichier | Lignes |
|---|---|---|
| Définition de l'outil GetAvailableSkills | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| Fonction discoverAllSkills | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L240-L263) | 240-263 |
| Fonction resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Fonction findClosestMatch | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**Types Clés** :
- `SkillLabel = "project" | "user" | "claude-project" | "claude-user" | "claude-plugins"` : Énumération des étiquettes de source de compétences

**Constantes Clés** :
- Seuil de correspondance approximative : `0.4` (`utils.ts:124`) - Aucune suggestion retournée si la similarité est inférieure à cette valeur

**Fonctions Clés** :
- `GetAvailableSkills()` : Retourne une liste formatée de compétences, prend en charge le filtrage par requête et les suggestions de correspondance approximative
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)` : Prend en charge l'analyse des compétences au format `namespace:skill-name`
- `findClosestMatch(input: string, candidates: string[])` : Calcule la meilleure correspondance basée sur plusieurs stratégies (préfixe, inclusion, distance d'édition)

**Règles Métier** :
- Les compétences portant le même nom sont dédupliquées selon l'ordre de découverte, seule la première est conservée (`skills.ts:258`)
- Les requêtes de recherche prennent en charge le caractère générique `*`, automatiquement converti en expression régulière (`tools.ts:43`)
- Les suggestions de correspondance approximative ne sont déclenchées que lorsqu'un paramètre de requête est présent mais qu'aucun résultat n'est trouvé (`tools.ts:49-57`)

</details>
