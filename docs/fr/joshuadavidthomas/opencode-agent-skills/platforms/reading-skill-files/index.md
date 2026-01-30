---
title: "Lecture de fichiers de compétences : Accès aux ressources | opencode-agent-skills"
subtitle: "Lecture de fichiers de compétences : Accès aux ressources | opencode-agent-skills"
sidebarTitle: "Accéder aux ressources supplémentaires des compétences"
description: "Apprenez à lire les fichiers de compétences. Maîtrisez la vérification de sécurité des chemins et le mécanisme d'injection XML pour accéder en toute sécurité aux documents et configurations du répertoire des compétences."
tags:
  - "Fichiers de compétences"
  - "Utilisation d'outils"
  - "Sécurité des chemins"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: "6"
---

# Lecture de fichiers de compétences

## Ce que vous saurez faire après ce cours

- Utiliser l'outil `read_skill_file` pour lire les documents, configurations et exemples de fichiers dans le répertoire des compétences
- Comprendre le mécanisme de sécurité des chemins pour prévenir les attaques par parcours de répertoire
- Maîtriser l'injection de contenu de fichiers au format XML
- Gérer les messages d'erreur et la liste des fichiers disponibles lorsque le fichier n'existe pas

## Votre situation actuelle

Le fichier SKILL.md de la compétence ne contient que les instructions principales, mais de nombreuses compétences fournissent des documents d'accompagnement, des exemples de configuration, des guides d'utilisation et autres fichiers de support. Vous souhaitez accéder à ces fichiers pour obtenir des instructions plus détaillées, mais vous ne savez pas comment lire en toute sécurité les fichiers du répertoire des compétences.

## Quand utiliser cette technique

- **Consulter la documentation détaillée** : le répertoire `docs/` de la compétence contient des guides d'utilisation détaillés
- **Exemples de configuration** : besoin de consulter les fichiers de configuration d'exemple dans le répertoire `config/`
- **Exemples de code** : le répertoire `examples/` de la compétence contient des exemples de code
- **Aide au débogage** : consulter le README ou autres fichiers d'instruction de la compétence
- **Comprendre la structure des ressources** : explorer les fichiers disponibles dans le répertoire des compétences

## Idée principale

L'outil `read_skill_file` vous permet d'accéder en toute sécurité aux fichiers de support du répertoire des compétences. Il garantit la sécurité et la disponibilité grâce aux mécanismes suivants :

::: info Mécanisme de sécurité
Le plugin vérifie strictement les chemins de fichiers pour prévenir les attaques par parcours de répertoire :
- Interdiction d'utiliser `..` pour accéder aux fichiers en dehors du répertoire des compétences
- Interdiction d'utiliser des chemins absolus
- Autorisation d'accès uniquement aux fichiers du répertoire des compétences et de ses sous-répertoires
:::

Processus d'exécution de l'outil :
1. Vérifier si le nom de la compétence existe (avec support des espaces de noms)
2. Vérifier si le chemin de fichier demandé est sécurisé
3. Lire le contenu du fichier
4. Emballer et injecter le contenu dans le contexte de session au format XML
5. Renvoyer un message de confirmation de chargement réussi

::: tip Persistance du contenu du fichier
Le contenu du fichier est injecté avec les drapeaux `synthetic: true` et `noReply: true`, ce qui signifie que :
- Le contenu du fichier fait partie du contexte de session
- Même si la session est compressée, le contenu reste accessible
- L'injection ne déclenche pas de réponse directe de l'IA
:::

## Suivez les étapes

### Étape 1 : Lire la documentation de la compétence

Supposons que le répertoire des compétences contient une documentation d'utilisation détaillée :

```
Entrée utilisateur :
Lire la documentation de git-helper

Appel système :
read_skill_file(skill="git-helper", filename="docs/usage-guide.md")

Réponse système :
File "docs/usage-guide.md" from skill "git-helper" loaded.
```

Le contenu du fichier sera injecté dans le contexte de session au format XML :

```xml
<skill-file skill="git-helper" file="docs/usage-guide.md">
  <metadata>
    <directory>/path/to/project/.opencode/skills/git-helper</directory>
  </metadata>

  <content>
# Guide d'utilisation de Git Helper

Cette compétence fournit des instructions pour la gestion des branches Git, les conventions de commit et les processus de collaboration...

[Suite de la documentation]
  </content>
</skill-file>
```

**Vous devriez voir** : Un message de chargement réussi, le contenu du fichier est injecté dans le contexte de session.

### Étape 2 : Lire les exemples de configuration

Consulter les exemples de configuration de la compétence :

```
Entrée utilisateur :
Afficher les exemples de configuration de docker-helper

Appel système :
read_skill_file(skill="docker-helper", filename="config/docker-compose.yml.example")

Réponse système :
File "config/docker-compose.yml.example" from skill "docker-helper" loaded.
```

**Vous devriez voir** : Le contenu du fichier de configuration est injecté, l'IA peut consulter les exemples pour générer une configuration réelle.

### Étape 3 : Utiliser l'espace de noms pour lire les fichiers

Si des compétences de même nom existent au niveau du projet et de l'utilisateur :

```
Entrée utilisateur :
Lire le script de construction de project:build-helper

Appel système :
read_skill_file(skill="project:build-helper", filename="scripts/build.sh")

Réponse système :
File "scripts/build.sh" from skill "build-helper" loaded.
```

**Vous devriez voir** : La source de la compétence est clairement spécifiée via l'espace de noms.

### Étape 4 : Gérer le cas où le fichier n'existe pas

Si vous essayez de lire un fichier qui n'existe pas :

```
Entrée utilisateur :
Lire api-docs.md de git-helper

Appel système :
read_skill_file(skill="git-helper", filename="api-docs.md")

Réponse système :
File "api-docs.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md, SKILL.md
```

L'outil listera tous les fichiers disponibles dans le répertoire des compétences pour vous aider à trouver le bon nom de fichier.

**Vous devriez voir** : Un message d'erreur et la liste des fichiers disponibles.

### Étape 5 : Tester la protection de sécurité des chemins

Essayer d'accéder aux fichiers en dehors du répertoire des compétences :

```
Entrée utilisateur :
Lire le fichier du répertoire parent de git-helper

Appel système :
read_skill_file(skill="git-helper", filename="../secrets.txt")

Réponse système :
Invalid path: cannot access files outside skill directory.
```

L'outil rejettera toute tentative d'accès aux fichiers en dehors du répertoire des compétences.

**Vous devriez voir** : Un message d'erreur de sécurité de chemin.

## Points de vérification ✅

- [ ] Pouvez-vous utiliser `read_skill_file` pour lire les fichiers de compétences ?
- [ ] Comprenez-vous le rôle du mécanisme de sécurité des chemins ?
- [ ] Pouvez-vous identifier le format XML d'injection du contenu du fichier ?
- [ ] Pouvez-vous trouver la liste des fichiers disponibles dans le message d'erreur ?
- [ ] Pouvez-vous utiliser l'espace de noms pour localiser précisément une compétence ?

## Rappels sur les pièges

### Piège 1 : Erreur de chemin de fichier

Si vous oubliez que le fichier est dans un sous-répertoire :

```
Entrée utilisateur :
Lire usage-guide.md de git-helper

Réponse système :
File "usage-guide.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md
```

**Cause** : Le fichier peut être dans un sous-répertoire, vous devez spécifier le chemin relatif.

**Solution** : Utiliser le chemin complet, comme `docs/usage-guide.md`.

### Piège 2 : Ignorer les conflits d'espace de noms

Lorsque des compétences de même nom existent dans plusieurs espaces de noms :

```
Entrée utilisateur :
Lire le README de build-helper

Réponse système :
File "README.md" from skill "build-helper" loaded.
```

Vous avez peut-être lu la compétence au niveau du projet, mais vous souhaitiez la compétence au niveau de l'utilisateur.

**Solution** : Utiliser l'espace de noms pour spécifier explicitement, comme `read_skill_file(skill="user:build-helper", filename="README.md")`.

### Piège 3 : Tentative de parcours de répertoire

Essayer d'utiliser `..` pour accéder au répertoire parent :

```
Entrée utilisateur :
Lire un fichier en dehors du répertoire des compétences

Appel système :
read_skill_file(skill="my-skill", filename="../../../etc/passwd")

Réponse système :
Invalid path: cannot access files outside skill directory.
```

**Cause** : C'est une limitation de sécurité pour prévenir les attaques par parcours de répertoire.

**Solution** : Vous ne pouvez accéder qu'aux fichiers à l'intérieur du répertoire des compétences. Pour d'autres fichiers, demandez à l'IA d'utiliser directement l'outil `Read`.

### Piège 4 : Le fichier existe déjà dans le contexte de session

Si vous avez déjà chargé une compétence, le contenu du fichier peut être dans le SKILL.md de la compétence ou dans un autre contenu déjà injecté :

```
Entrée utilisateur :
Lire la documentation principale de la compétence

Appel système :
read_skill_file(skill="my-skill", filename="core-guide.md")
```

Mais cela peut être inutile car le contenu principal est généralement dans SKILL.md.

**Solution** : D'abord consulter le contenu des compétences déjà chargées pour confirmer si des fichiers supplémentaires sont nécessaires.

## Résumé de ce cours

L'outil `read_skill_file` vous permet d'accéder en toute sécurité aux fichiers de support du répertoire des compétences :

- **Vérification de sécurité des chemins** : prévient les parcours de répertoire, n'autorise que l'accès aux fichiers à l'intérieur du répertoire des compétences
- **Mécanisme d'injection XML** : le contenu du fichier est enveloppé dans des balises XML `<skill-file>`, incluant les métadonnées
- **Gestion d'erreur conviviale** : liste les fichiers disponibles lorsque le fichier n'existe pas, vous aidant à trouver le bon chemin
- **Support des espaces de noms** : permet de localiser précisément les compétences de même nom avec `namespace:skill-name`
- **Persistance du contexte** : grâce au drapeau `synthetic: true`, le contenu du fichier reste accessible même après compression de la session

Cet outil est idéal pour lire les :
- Documentation détaillée (répertoire `docs/`)
- Exemples de configuration (répertoire `config/`)
- Exemples de code (répertoire `examples/`)
- Fichiers README et d'instruction
- Code source des scripts (si vous avez besoin de voir l'implémentation)

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons la **[Compatibilité des compétences avec Claude Code](../../advanced/claude-code-compatibility/)**.
>
> Vous apprendrez :
> - Comment le plugin est compatible avec le système de compétences et de plugins de Claude Code
> - Comprendre le mécanisme de mappage des outils (conversion des outils Claude Code vers les outils OpenCode)
> - Maîtriser la méthode de découverte des compétences à partir de l'emplacement d'installation de Claude Code

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonction        | Chemin du fichier                                                                                    | Lignes    |
| --- | --- | ---|
| Définition de l'outil ReadSkillFile | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135)         | 74-135   |
| Vérification de sécurité des chemins | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133)    | 130-133  |
| Liste des fichiers de compétences | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316  |
| Fonction resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283  |
| Fonction injectSyntheticContent | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162)    | 147-162  |

**Types clés** :
- `Skill` : Interface des métadonnées de compétence (`skills.ts:43-52`)
- `OpencodeClient` : Type client du SDK OpenCode (`utils.ts:140`)
- `SessionContext` : Contexte de session, contenant les informations model et agent (`utils.ts:142-145`)

**Fonctions clés** :
- `ReadSkillFile(directory: string, client: OpencodeClient)` : Renvoie la définition de l'outil, traite la lecture des fichiers de compétences
- `isPathSafe(basePath: string, requestedPath: string): boolean` : Vérifie si le chemin est dans le répertoire de base, prévient les parcours de répertoire
- `listSkillFiles(skillPath: string, maxDepth: number = 3): Promise<string[]>` : Liste tous les fichiers du répertoire des compétences (à l'exclusion de SKILL.md)
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>): Skill | null` : Prend en charge l'analyse des compétences au format `namespace:skill-name`
- `injectSyntheticContent(client, sessionID, text, context)` : Injecte le contenu dans la session avec `noReply: true` et `synthetic: true`

**Règles métier** :
- La vérification de sécurité des chemins utilise `path.resolve()` pour vérifier que le chemin résolu commence par le répertoire de base (`utils.ts:131-132`)
- Lorsque le fichier n'existe pas, tente `fs.readdir()` pour lister les fichiers disponibles et fournit un message d'erreur convivial (`tools.ts:126-131`)
- Le contenu du fichier est enveloppé au format XML, avec les attributs `skill`, `file` et les balises `<metadata>`, `<content>` (`tools.ts:111-119`)
- Lors de l'injection, obtient le contexte model et agent de la session actuelle pour s'assurer que le contenu est injecté dans le bon contexte (`tools.ts:121-122`)

**Mécanismes de sécurité** :
- Protection contre les parcours de répertoire : `isPathSafe()` vérifie si le chemin est dans le répertoire de base (`utils.ts:130-133`)
- Suggestions de correspondance floue lorsque la compétence n'existe pas (`tools.ts:90-95`)
- Liste des fichiers disponibles lorsque le fichier n'existe pas, aidant l'utilisateur à trouver le bon chemin (`tools.ts:126-131`)

</details>
