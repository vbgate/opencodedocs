---
title: "Exécution de scripts : Exécution dans le répertoire de compétences | opencode-agent-skills"
sidebarTitle: "Exécution de scripts automatisés"
subtitle: "Exécution de scripts : Exécution dans le répertoire de compétences"
description: "Maîtrisez les méthodes d'exécution des scripts de compétences. Apprenez à exécuter des scripts dans le contexte du répertoire de compétences, à passer des paramètres, à gérer les erreurs et à configurer les permissions, en exploitant les capacités d'automatisation pour améliorer votre efficacité."
tags:
  - "exécution de scripts"
  - "automatisation"
  - "utilisation d'outils"
prerequisite:
  - "/fr/joshuadavidthomas/opencode-agent-skills/start-installation/"
  - "/fr/joshuadavidthomas/opencode-agent-skills/platforms-listing-available-skills/"
order: 5
---

# Exécution de scripts de compétences

## Ce que vous pourrez faire après avoir appris

- Utiliser l'outil `run_skill_script` pour exécuter des scripts exécutables dans le répertoire de compétences
- Passer des arguments de ligne de commande aux scripts
- Comprendre le contexte du répertoire de travail lors de l'exécution des scripts
- Gérer les erreurs d'exécution de scripts et les codes de sortie
- Maîtriser la configuration des permissions de scripts et les mécanismes de sécurité

## Votre problème actuel

Vous souhaitez que l'IA exécute un script d'automatisation d'une compétence, comme construire un projet, exécuter des tests ou déployer une application. Mais vous n'êtes pas sûr de la méthode pour appeler le script, ou vous rencontrez des erreurs de permissions ou des scripts introuvables lors de l'exécution.

## Quand utiliser cette méthode

- **Construction automatisée** : Exécuter `build.sh` ou `build.py` de la compétence pour construire le projet
- **Exécution de tests** : Déclencher la suite de tests de la compétence pour générer un rapport de couverture
- **Processus de déploiement** : Exécuter des scripts de déploiement pour publier l'application en production
- **Traitement de données** : Exécuter des scripts pour traiter des fichiers, convertir des formats de données
- **Installation de dépendances** : Exécuter des scripts pour installer les dépendances requises par la compétence

## Idée principale

L'outil `run_skill_script` vous permet d'exécuter des scripts exécutables dans le contexte du répertoire de compétences. Les avantages sont :

- **Environnement d'exécution correct** : Les scripts s'exécutent dans le répertoire de compétences et peuvent accéder à la configuration et aux ressources de la compétence
- **Flux de travail automatisé** : Les compétences peuvent inclure un ensemble de scripts automatisés, réduisant les opérations répétitives
- **Vérification des permissions** : Seuls les fichiers avec des permissions d'exécution sont exécutés, empêchant l'exécution accidentelle de fichiers texte ordinaires
- **Capture d'erreurs** : Capture des codes de sortie et de la sortie des scripts pour faciliter le débogage

::: info Règles de découverte de scripts
Le plugin recherche récursivement les fichiers exécutables dans le répertoire de compétences (jusqu'à une profondeur de 10 niveaux) :
- ** Répertoires ignorés** : Répertoires cachés (commençant par `.`), `node_modules`, `__pycache__`, `.git`, `.venv`, etc.
- **Vérification de l'exécution** : Seuls les fichiers avec des permissions d'exécution (mode & 0o111) sont inclus dans la liste des scripts
- ** Chemins relatifs** : Les chemins des scripts sont relatifs au répertoire de compétences, comme `tools/build.sh`
:::

::: tip Vérifier d'abord les scripts disponibles
Avant l'exécution, utilisez d'abord `get_available_skills` pour voir la liste des scripts de la compétence :
```
docker-helper (project)
  Guide de conteneurisation et de déploiement Docker [scripts: build.sh, deploy.sh]
```
::

## Suivez le guide

### Étape 1 : Exécuter un script de compétence

Supposons que vous ayez une compétence `docker-helper` contenant le script `build.sh` :

```
Entrée utilisateur :
Exécuter build.sh de docker-helper

Réponse du système :
Building Docker image...
Successfully built abc123def456
Tagged as myapp:latest
```

**Ce que vous devriez voir** : Le contenu de la sortie du script s'affiche dans la réponse.

Le répertoire de travail lors de l'exécution du script est basculé vers le répertoire de compétences, donc `build.sh` peut correctement accéder aux ressources de la compétence comme le `Dockerfile`.

### Étape 2 : Passer des arguments de ligne de commande

De nombreux scripts prennent en charge des arguments, par exemple `deploy.sh` peut nécessiter de spécifier l'environnement :

```
Entrée utilisateur :
Exécuter deploy.sh de docker-helper, avec le paramètre production

Réponse du système :
Deploying to production environment...
Uploading image to registry...
Deployment successful: https://myapp.example.com
```

Vous pouvez également passer plusieurs arguments :

```
Entrée utilisateur :
Déployer avec deploy.sh, avec les paramètres staging et --force

Réponse du système :
Deploying to staging environment (--force mode)...
Skipping validation...
Deployment successful
```

**Ce que vous devriez voir** : Le script reçoit les arguments et exécute les opérations correspondantes.

### Étape 3 : Exécuter un script dans un répertoire imbriqué

Les scripts peuvent être dans des sous-répertoires de la compétence, comme `tools/setup.sh` :

```
Entrée utilisateur :
Exécuter tools/setup.sh de docker-helper

Réponse du système :
Setting up Docker environment...
✓ Docker network created
✓ Volume mounted
✓ Environment configured
```

Les chemins relatifs sont toujours relatifs au répertoire de compétences, quelle que soit la profondeur réelle du script.

**Ce que vous devriez voir** : Les scripts dans les répertoires imbriqués sont également correctement exécutés.

### Étape 4 : Gérer les erreurs de compétence inexistante

Si vous entrez un nom de compétence incorrect :

```
Entrée utilisateur :
Exécuter build.sh de docker-asistant

Réponse du système :
Skill "docker-asistant" not found. Did you mean "docker-helper"?
```

Le plugin suggérera le nom de compétence correct basé sur une correspondance floue. Vous pouvez d'abord appeler `get_available_skills` pour voir les compétences disponibles.

**Ce que vous devriez voir** : Message d'erreur et suggestion du nom correct.

### Étape 5 : Gérer les erreurs de script inexistant

Si le script n'est pas dans la liste des scripts de la compétence :

```
Entrée utilisateur :
Exécuter run.sh de docker-helper

Réponse du système :
Script "run.sh" not found in skill "docker-helper". Did you mean "build.sh"?
Available scripts: build.sh, deploy.sh
```

Le plugin listera tous les scripts disponibles pour vous aider à choisir le nom de script correct.

**Ce que vous devriez voir** : Message d'erreur et liste des scripts disponibles.

### Étape 6 : Comprendre les échecs d'exécution de script

Si l'exécution du script échoue (code de sortie non 0), le plugin renverra un message d'erreur :

```
Entrée utilisateur :
Exécuter build.sh de docker-helper

Réponse du système :
Script failed (exit 1): Dockerfile not found in /path/to/skill
```

Le message d'erreur contient :
- **Code de sortie** : `exit 1` indique que le script s'est terminé avec un état non nul
- **Sortie d'erreur** : Contenu de stderr ou stdout du script
- **Cause de l'échec** : Message d'erreur spécifique du script

**Ce que vous devriez voir** : Des informations d'erreur détaillées pour vous aider à localiser le problème.

## Point de contrôle ✅

- [ ] Pouvez-vous exécuter des scripts exécutables dans le répertoire de compétences ?
- [ ] Pouvez-vous passer des arguments de ligne de commande aux scripts ?
- [ ] Comprenez-vous le contexte du répertoire de travail lors de l'exécution des scripts ?
- [ ] Pouvez-vous identifier et gérer les erreurs d'exécution de scripts ?
- [ ] Savez-vous comment vérifier les permissions de configuration des scripts ?

## Pièges à éviter

### Piège 1 : Le script n'a pas de permissions d'exécution

Si vous créez un nouveau script mais oubliez de définir les permissions d'exécution, il n'apparaîtra pas dans la liste des scripts.

**Symptôme de l'erreur** :
```
Available scripts: build.sh  # Votre nouveau script new-script.sh n'est pas dans la liste
```

**Cause** : Le fichier n'a pas de permissions d'exécution (mode & 0o111 est false).

**Solution** : Définissez les permissions d'exécution dans le terminal :
```bash
chmod +x .opencode/skills/my-skill/new-script.sh
```

**Vérification** : Rappelez `get_available_skills` pour voir la liste des scripts.

### Piège 2 : Chemin de script incorrect

Le chemin du script doit être un chemin relatif au répertoire de compétences, vous ne pouvez pas utiliser de chemins absolus ou de références au répertoire parent.

**Exemple d'erreur** :

```bash
# ❌ Erreur : Utilisation d'un chemin absolu
Exécuter /path/to/skill/build.sh de docker-helper

# ❌ Erreur : Tentative d'accès au répertoire parent (bien qu'il passe la vérification de sécurité, le chemin est incorrect)
Exécuter ../build.sh de docker-helper
```

**Exemple correct** :

```bash
# ✅ Correct : Utilisation d'un chemin relatif
Exécuter build.sh de docker-helper
Exécuter tools/deploy.sh de docker-helper
```

**Cause** : Le plugin vérifie la sécurité du chemin pour empêcher les attaques de traversée de répertoire, et le chemin relatif est basé sur le répertoire de compétences.

### Piège 3 : Le script dépend du répertoire de travail

Si le script suppose que le répertoire actuel est la racine du projet et non le répertoire de compétences, l'exécution peut échouer.

**Exemple d'erreur** :
```bash
# build.sh dans le répertoire de compétences
#!/bin/bash
# ❌ Erreur : Suppose que le répertoire actuel est la racine du projet
docker build -t myapp .
```

**Problème** : Lors de l'exécution, le répertoire actuel est le répertoire de compétences (`.opencode/skills/docker-helper`), et non la racine du projet.

**Solution** : Le script doit utiliser des chemins absolus ou localiser dynamiquement la racine du projet :
```bash
# ✅ Correct : Utilisation d'un chemin relatif pour localiser la racine du projet
docker build -t myapp ../../..

# Ou : Utiliser des variables d'environnement ou des fichiers de configuration
PROJECT_ROOT="${SKILL_DIR}/../../.."
docker build -t myapp "$PROJECT_ROOT"
```

**Explication** : Le répertoire de compétences peut ne pas avoir le `Dockerfile` du projet, le script doit donc localiser lui-même les fichiers de ressources.

### Piège 4 : Sortie de script trop longue

Si le script génère beaucoup de journaux (par exemple, la progression de téléchargement de npm install), la réponse peut devenir très longue.

**Manifestation** :

```bash
Réponse du système :
npm WARN deprecated package...
npm notice created a lockfile...
added 500 packages in 2m
# Peut y avoir des centaines de lignes de sortie
```

**Recommandation** : Les scripts devraient avoir une sortie concise, n'affichant que les informations clés :

```bash
#!/bin/bash
echo "Installing dependencies..."
npm install --silent
echo "✓ Dependencies installed (500 packages)"
```

## Résumé de cette leçon

L'outil `run_skill_script` vous permet d'exécuter des scripts exécutables dans le contexte du répertoire de compétences, en prenant en charge :

- **Passage de paramètres** : Passage d'arguments de ligne de commande via le tableau `arguments`
- **Basculement de répertoire de travail** : Le CWD est basculé vers le répertoire de compétences lors de l'exécution
- **Gestion des erreurs** : Capture des codes de sortie et de la sortie d'erreur pour faciliter le débogage
- **Vérification des permissions** : Exécute uniquement les fichiers avec des permissions d'exécution
- **Sécurité des chemins** : Vérifie les chemins des scripts pour empêcher la traversée de répertoire

Règles de découverte de scripts :
- Scan récursif du répertoire de compétences, profondeur maximale de 10 niveaux
- Ignore les répertoires cachés et les répertoires de dépendances courants
- Inclut uniquement les fichiers avec des permissions d'exécution
- Les chemins sont relatifs au répertoire de compétences

**Meilleures pratiques** :
- La sortie des scripts doit être concise, n'affichant que les informations clés
- Les scripts ne doivent pas supposer que le répertoire actuel est la racine du projet
- Utilisez `chmod +x` pour définir les permissions d'exécution des nouveaux scripts
- Utilisez d'abord `get_available_skills` pour voir les scripts disponibles

## Prochain cours

> Dans le prochain cours, nous apprendrons la **[Lecture de fichiers de compétences](../reading-skill-files/)**.
>
> Vous apprendrez :
> - Utiliser l'outil read_skill_file pour accéder à la documentation et à la configuration des compétences
> - Comprendre le mécanisme de vérification de sécurité des chemins pour empêcher les attaques de traversée de répertoire
> - Maîtriser le format de lecture de fichiers et d'injection de contenu XML
> - Apprendre à organiser les fichiers de support dans les compétences (documentation, exemples, configuration, etc.)

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité        | Chemin du fichier                                                                                    | Lignes    |
|--- | --- | ---|
| Définition de l'outil RunSkillScript | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| Fonction findScripts | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L59-L99) | 59-99   |

**Types clés** :
- `Script = { relativePath: string; absolutePath: string }` : Métadonnées du script, contenant le chemin relatif et le chemin absolu

**Constantes clés** :
- Profondeur de récursion maximale : `10` (`skills.ts:64`) - Limite de profondeur de recherche de scripts
- Liste des répertoires ignorés : `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']` (`skills.ts:61`)
- Masque de permissions d'exécution : `0o111` (`skills.ts:86`) - Vérifie si le fichier est exécutable

**Fonctions clés** :
- `RunSkillScript(skill: string, script: string, arguments?: string[])` : Exécute un script de compétence, prenant en charge le passage de paramètres et le basculement de répertoire de travail
- `findScripts(skillPath: string)` : Recherche récursivement les fichiers exécutables dans le répertoire de compétences, les renvoie triés par chemin relatif

**Règles métier** :
- Basculement du répertoire de travail vers le répertoire de compétences lors de l'exécution du script (`tools.ts:180`) : `$.cwd(skill.path)`
- Exécute uniquement les scripts présents dans la liste des scripts de la compétence (`tools.ts:165-177`)
- Renvoie la liste des scripts disponibles lorsque le script n'existe pas, prend en charge les suggestions de correspondance floue (`tools.ts:168-176`)
- Renvoie le code de sortie et la sortie d'erreur en cas d'échec d'exécution (`tools.ts:184-195`)
- Ignore les répertoires cachés (commençant par `.`) et les répertoires de dépendances courants (`skills.ts:70-71`)

</details>
