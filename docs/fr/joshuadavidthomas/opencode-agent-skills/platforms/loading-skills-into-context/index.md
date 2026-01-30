---
title: "Charger les compétences: Injection de contenu XML | opencode-agent-skills"
sidebarTitle: "Permettre à l'IA d'utiliser vos compétences"
subtitle: "Charger les compétences dans le contexte de session"
description: "Maîtriser l'outil use_skill pour charger les compétences dans le contexte de session. Comprendre les mécanismes d'injection XML et de Synthetic Message Injection, apprendre la gestion des métadonnées de compétences."
tags:
  - "Chargement de compétences"
  - "Injection XML"
  - "Gestion du contexte"
prerequisite:
  - "start-creating-your-first-skill"
  - "platforms-listing-available-skills"
order: 3
---

# Charger les compétences dans le contexte de session

## Ce que vous pourrez faire après cette leçon

- Utiliser l'outil `use_skill` pour charger des compétences dans la session actuelle
- Comprendre comment le contenu des compétences est injecté dans le contexte au format XML
- Maîtriser le mécanisme de Synthetic Message Injection (injection de messages synthétiques)
- Comprendre la structure des métadonnées des compétences (source, répertoire, scripts, fichiers)
- Savoir comment les compétences restent disponibles après la compression de session

## Votre problème actuel

Vous avez créé une compétence, mais l'IA ne semble pas pouvoir accéder à son contenu. Ou dans une longue conversation, les instructions de la compétence disparaissent soudainement, l'IA oubliant les règles précédentes. Tout cela est lié au mécanisme de chargement des compétences.

## Quand utiliser cette technique

- **Chargement manuel de compétences** : lorsque la recommandation automatique de l'IA n'est pas appropriée, spécifiez directement la compétence nécessaire
- **Maintien de sessions longues** : garantir que le contenu des compétences reste accessible après la compression du contexte
- **Compatibilité Claude Code** : charger les compétences au format Claude pour obtenir le mappage des outils
- **Contrôle précis** : charger une version spécifique d'une compétence (via l'espace de noms)

## Idée principale

L'outil `use_skill` injecte le contenu SKILL.md de la compétence dans le contexte de session, permettant à l'IA de suivre les règles et workflows définis dans la compétence.

### Injection de contenu XML

Le contenu de la compétence est injecté dans un format XML structuré, comprenant trois parties :

```xml
<skill name="skill-name">
  <metadata>
    <source>Étiquette de source de compétence</source>
    <directory>Chemin du répertoire de compétence</directory>
    <scripts>
      <script>tools/script1.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
    </files>
  </metadata>

  <tool-mapping>
    <!-- Mappage d'outils Claude Code -->
  </tool-mapping>

  <content>
    Contenu complet de SKILL.md
  </content>
</skill>
```

### Injection de messages synthétiques

Le plugin utilise la méthode `session.prompt()` du SDK OpenCode pour injecter le contenu de la compétence, avec deux indicateurs clés :

::: info Injection de messages synthétiques
- `noReply: true` - L'IA ne répondra pas à cette injection elle-même
- `synthetic: true` - Marque le message comme généré par le système (caché à l'utilisateur, non compté comme entrée utilisateur)
:::

Cela signifie que :
- **Invisible pour l'utilisateur** : l'injection de la compétence n'apparaît pas dans l'historique de conversation
- **Ne consomme pas d'entrée** : non compté dans le nombre de messages utilisateur
- **Disponible de manière persistante** : même après compression de session, le contenu de la compétence reste dans le contexte

### Cycle de vie de session

1. **Au premier message** : le plugin injecte automatiquement la liste `<available-skills>`, affichant toutes les compétences disponibles
2. **Utilisation de `use_skill`** : injecte le contenu XML de la compétence sélectionnée dans le contexte
3. **Après compression de session** : le plugin écoute l'événement `session.compacted` et réinjecte la liste des compétences

## Suivez-moi

### Étape 1 : Charger une compétence de base

Demandez à l'IA de charger une compétence dans OpenCode :

```
Entrée utilisateur :
Charger la compétence brainstorming

Réponse du système :
Skill "brainstorming" loaded.
```

**Ce que vous devriez voir** : l'IA renvoie un message de chargement réussi, le contenu de la compétence a été injecté dans le contexte.

Maintenant, vous pouvez tester si l'IA suit les règles de la compétence :

```
Entrée utilisateur :
Aide-moi à écrire une description de produit

Réponse du système :
(L'IA générera du contenu en suivant les règles de la compétence brainstorming, en utilisant les techniques et processus définis)
```

### Étape 2 : Voir les ressources disponibles après chargement

Lors du chargement d'une compétence, le système renvoie la liste des scripts et fichiers disponibles :

```
Entrée utilisateur :
Charger git-helper

Réponse du système :
Skill "git-helper" loaded.
Available scripts: tools/branch.sh, tools/commit.sh
Available files: docs/usage.md, examples/workflow.md
```

Ces informations vous indiquent quelles ressources sont disponibles dans le répertoire de la compétence :
- **Scripts** : peuvent être exécutés avec l'outil `run_skill_script`
- **Fichiers** : peuvent être lus avec l'outil `read_skill_file`

**Ce que vous devriez voir** : un message de chargement réussi, suivi d'une liste facultative de scripts et fichiers.

### Étape 3 : Charger des compétences avec le même nom en utilisant l'espace de noms

Supposons qu'il existe une compétence `build-helper` au niveau du projet et au niveau utilisateur :

```
Entrée utilisateur :
Charger build-helper

Réponse du système :
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh

Entrée utilisateur :
(Vérifier quelle version de build-helper est chargée)
```

Selon la priorité de découverte des compétences, la compétence de niveau projet est chargée par défaut. Si vous avez besoin de celle de niveau utilisateur :

```
Entrée utilisateur :
Charger user:build-helper

Réponse du système :
Skill "build-helper" loaded.
Available scripts: ci.sh, test.sh
Available files: README.md
```

**Ce que vous devriez voir** : charger différentes versions de compétences avec le même nom via le format `namespace:skill-name`.

### Étape 4 : Expérimenter l'effet des instructions de compétence

Après le chargement d'une compétence, le comportement de l'IA devrait suivre les règles définies dans la compétence. Prenons l'exemple de la compétence brainstorming :

```
Entrée utilisateur :
Charger brainstorming
Aide-moi à concevoir les points de vente clés d'un produit domotique

Réponse du système :
(L'IA utilisera les techniques définies dans la compétence brainstorming, telles que :
- Lister d'abord les directions possibles, puis explorer en profondeur
- Éviter de juger trop tôt les idées
- Utiliser "Oui, et..." pour étendre la réflexion
- Enregistrer toutes les idées avant de les filtrer)

Listons d'abord les directions possibles :
1. Contrôle pratique
2. Gestion énergétique
3. Sécurité et protection
...
```

**Ce que vous devriez voir** : le style et le flux de réponse de l'IA sont cohérents avec ceux définis dans la compétence.

### Étape 5 : Comprendre la persistance des compétences dans les sessions longues

Menez une longue conversation et observez si la compétence reste efficace :

```
Entrée utilisateur :
Charger docker-helper
(Mener plusieurs tours de conversation, impliquant des opérations de construction, déploiement, etc.)
...
(Supposons que la conversation est très longue et déclenche la compression de contexte d'OpenCode)
Entrée utilisateur :
Continuer le déploiement Docker précédent

Réponse du système :
(L'IA peut toujours accéder au contenu de docker-helper,
car le plugin a réinjecté la liste des compétences après la compression)
```

::: tip Mécanisme de récupération après compression
Le plugin écoute l'événement `session.compacted` et réinjecte la liste des compétences lors de la compression de session, garantissant que les compétences chargées restent accessibles après la compression.
:::

**Ce que vous devriez voir** : même si la conversation est longue et que le contexte est compressé, l'IA peut toujours accéder au contenu de la compétence.

### Étape 6 : Charger des compétences au format Claude Code

Si vous avez des compétences Claude Code, elles seront découvertes automatiquement :

```
Entrée utilisateur :
Lister toutes les compétences disponibles

Réponse du système :
...
claude-code-superpowers (claude-plugins)
  Workflow complet de développement logiciel

Entrée utilisateur :
Charger claude-code-superpowers

Réponse du système :
Skill "claude-code-superpowers" loaded.
```

Lors du chargement de compétences au format Claude, le mappage des outils (toolTranslation) est injecté automatiquement, mappant les noms des outils Claude vers les outils OpenCode :

::: info Exemple de mappage d'outils
- Le `TodoWrite` de Claude → le `todowrite` d'OpenCode
- Le `Task` de Claude → le `task` d'OpenCode (sous-agent)
- Le `Bash` de Claude → le `bash` d'OpenCode
:::

**Ce que vous devriez voir** : la compétence est chargée avec succès, l'IA peut comprendre et utiliser les workflows au format Claude.

## Point de contrôle ✅

- [ ] Pouvez-vous charger des compétences avec `use_skill` ?
- [ ] Pouvez-vous comprendre le mécanisme d'injection du contenu des compétences au format XML ?
- [ ] Pouvez-vous nommer les deux indicateurs clés des messages synthétiques ?
- [ ] Pouvez-vous expliquer pourquoi les compétences restent disponibles après la compression de session ?
- [ ] Pouvez-vous charger différentes versions de compétences avec le même nom en utilisant l'espace de noms ?

## Mise en garde sur les pièges

### Piège 1 : Faute de frappe dans le nom de la compétence

Si vous entrez un nom de compétence incorrect :

```
Entrée utilisateur :
Charger brainstormig

Réponse du système :
Skill "brainstormig" not found. Did you mean "brainstorming"?
```

Le plugin fournira une suggestion de correspondance approximative basée sur la distance d'édition.

**Solution** : vérifiez l'orthographe ou utilisez `get_available_skills` pour voir les noms corrects.

### Piège 2 : Confusion entre compétences avec le même nom

S'il existe des compétences avec le même nom au niveau projet et au niveau utilisateur, vous pourriez charger la mauvaise version :

```
Entrée utilisateur :
Charger build-helper

Réponse du système :
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh  # C'est celle de niveau projet

L'utilisateur s'attend à charger celle de niveau utilisateur, mais celle de niveau projet est chargée par défaut
```

**Solution** : utilisez l'espace de noms pour spécifier explicitement, comme `user:build-helper`.

### Piège 3 : Le contenu de la compétence ne prend pas effet

Parfois, vous avez chargé une compétence, mais l'IA ne semble pas suivre les règles :

```
Entrée utilisateur :
Charger my-conventions
(Attendez-vous à ce que l'IA suive les conventions de code)
Entrée utilisateur :
Écrire une fonction

Réponse du système :
(L'IA écrit du code qui ne correspond pas aux conventions attendues)
```

**Causes possibles** :
- Le contenu de SKILL.md de la compétence n'est pas assez clair
- La description de la compétence n'est pas assez détaillée, l'IA comprend mal
- Le contexte a été compressé dans une longue conversation, la liste des compétences doit être réinjectée

**Solutions** :
- Vérifiez que le frontmatter et le contenu de la compétence sont clairs
- Dites explicitement à l'IA d'utiliser des règles spécifiques : "Veuillez utiliser les règles de la compétence my-conventions"
- Rechargez la compétence après compression

### Piège 4 : Problèmes de mappage d'outils avec les compétences Claude

Après avoir chargé une compétence Claude Code, l'IA peut toujours utiliser des noms d'outils incorrects :

```
Entrée utilisateur :
Charger claude-code-superpowers
Utiliser l'outil TodoWrite

Réponse du système :
(L'IA peut tenter d'utiliser un nom d'outil incorrect, car le mappage n'est pas correct)
```

**Cause** : lors du chargement de la compétence, le mappage des outils est injecté automatiquement, mais l'IA peut avoir besoin d'un indice explicite.

**Solution** : après avoir chargé la compétence, dites explicitement à l'IA d'utiliser les outils mappés :

```
Entrée utilisateur :
Charger claude-code-superpowers
Attention à utiliser l'outil todowrite (et non TodoWrite)
```

## Résumé de la leçon

L'outil `use_skill` injecte le contenu de la compétence dans le contexte de session au format XML, grâce au mécanisme de Synthetic Message Injection :

- **Injection structurée XML** : inclut les métadonnées, le mappage des outils et le contenu de la compétence
- **Messages synthétiques** : `noReply: true` et `synthetic: true` garantissent que les messages sont cachés à l'utilisateur
- **Disponible de manière persistante** : même après compression du contexte, le contenu de la compétence reste accessible
- **Support des espaces de noms** : le format `namespace:skill-name` spécifie précisément la source de la compétence
- **Compatibilité Claude** : injecte automatiquement le mappage des outils, prend en charge les compétences Claude Code

Le chargement de compétences est un mécanisme clé permettant à l'IA de suivre des workflows et des règles spécifiques. Grâce à l'injection de contenu, l'IA peut maintenir un comportement cohérent tout au long de la conversation.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Recommandation automatique de compétences : Principe de correspondance sémantique](../automatic-skill-matching/)**.
>
> Vous apprendrez :
> - Comprendre comment le plugin recommande automatiquement les compétences pertinentes basées sur la similarité sémantique
> - Maîtriser les principes de base des modèles d'embedding et du calcul de similarité cosinus
> - Découvrir des techniques d'optimisation de description de compétences pour une meilleure recommandation
> - Comprendre comment le mécanisme de cache d'embedding améliore les performances

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonction        | Chemin du fichier                                                                                    | Ligne    |
|--- | --- | ---|
| Définition de l'outil UseSkill | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267)         | 200-267 |
| Fonction injectSyntheticContent | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162)    | 147-162 |
| Fonction injectSkillsList | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L345-L370) | 345-370 |
| Fonction resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Fonction listSkillFiles | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |

**Constantes clés** :
- Aucune

**Fonctions clés** :
- `UseSkill()` : accepte le paramètre `skill`, construit le contenu de la compétence au format XML et l'injecte dans la session
- `injectSyntheticContent(client, sessionID, text, context)` : injecte un message synthétique via `client.session.prompt()`, en définissant `noReply: true` et `synthetic: true`
- `injectSkillsList()` : injecte la liste `<available-skills>` lors du premier message
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)` : prend en charge la résolution des compétences au format `namespace:skill-name`
- `listSkillFiles(skillPath: string, maxDepth: number)` : liste récursivement tous les fichiers dans le répertoire de la compétence (excluant SKILL.md)

**Règles métier** :
- Le contenu de la compétence est injecté au format XML, incluant les métadonnées, le mappage des outils et le contenu (`tools.ts:238-249`)
- Le message injecté est marqué comme synthétique et n'est pas compté comme entrée utilisateur (`utils.ts:159`)
- Les compétences déjà chargées ne sont plus recommandées dans la session actuelle (`plugin.ts:128-132`)
- La liste des compétences est injectée automatiquement lors du premier message (`plugin.ts:70-105`)
- La liste des compétences est réinjectée après compression de session (`plugin.ts:145-151`)

**Format du contenu XML** :
```xml
<skill name="${skill.name}">
  <metadata>
    <source>${skill.label}</source>
    <directory>${skill.path}</directory>
    <scripts>
      <script>${script.relativePath}</script>
    </scripts>
    <files>
      <file>${file}</file>
    </files>
  </metadata>

  ${toolTranslation}

  <content>
  ${skill.template}
  </content>
</skill>
```

</details>
