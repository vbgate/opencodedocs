---
title: "Installation : Plugin Agent Skills | opencode-agent-skills"
sidebarTitle: "Installer le plugin en 5 minutes"
subtitle: "Installation : Plugin Agent Skills | opencode-agent-skills"
description: "Apprenez les trois méthodes d'installation du plugin opencode-agent-skills. Incluye l'installation de base, l'installation avec version figée et l'installation pour le développement local, adaptées à différents cas d'utilisation."
tags:
  - "Installation"
  - "Plugin"
  - "Démarrage rapide"
prerequisite: []
order: 2
---

# Installation d'OpenCode Agent Skills

## Ce que vous apprendrez

- Installer le plugin Agent Skills dans OpenCode de trois manières différentes
- Vérifier que le plugin est correctement installé
- Comprendre la différence entre version figée et dernière version

## Votre défi actuel

Vous souhaitez que votre Agent IA puisse réutiliser des compétences, mais vous ne savez pas comment activer cette fonctionnalité dans OpenCode. Le système de plugins d'OpenCode semble un peu complexe et vous craignez de faire des erreurs de configuration.

## Quand utiliser cette solution

**Vous avez besoin de cette fonctionnalité lorsque l'Agent IA doit** :
- Réutiliser des compétences entre différents projets (comme les normes de code, les modèles de tests)
- Charger la bibliothèque de compétences de Claude Code
- Faire suivre un flux de travail spécifique à l'IA

## 🎒 Préparatifs avant de commencer

::: warning Vérifications préalables

Avant de commencer, assurez-vous d'avoir :

- Installé [OpenCode](https://opencode.ai/) v1.0.110 ou une version ultérieure
- Accès au fichier de configuration `~/.config/opencode/opencode.json` (configuration d'OpenCode)

:::

## Approche principale

OpenCode Agent Skills est un plugin distribué via npm, et son installation est simple : déclarez le nom du plugin dans le fichier de configuration, et OpenCode le téléchargera et le chargera automatiquement au démarrage.

**Cas d'usage des trois méthodes d'installation** :

| Méthode | Cas d'usage | Avantages et inconvénients |
| --- | --- | --- |
| **Installation de base** | Utiliser la dernière version à chaque démarrage | ✅ Mise à jour automatique pratique<br>❌ Possible de rencontrer des mises à jour rétrocompatibles |
| **Version figée** | Environnement de production stable | ✅ Version contrôlée<br>❌ Mise à jour manuelle requise |
| **Développement local** | Personnaliser le plugin ou contribuer au code | ✅ Modification flexible<br>❌ Gestion manuelle des dépendances requise |

---

## Suivez le guide

### Méthode 1 : Installation de base (recommandée)

C'est la méthode la plus simple. OpenCode vérifiera et téléchargera la dernière version à chaque démarrage.

**Pourquoi**
Convient à la plupart des utilisateurs, garantit que vous utilisez toujours les dernières fonctionnalités et corrections de bugs.

**Étapes**

1. Ouvrez le fichier de configuration d'OpenCode

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json

# Windows (avec le Bloc-notes)
notepad %APPDATA%\opencode\opencode.json
```

2. Ajoutez le nom du plugin dans le fichier de configuration

```json
{
  "plugin": ["opencode-agent-skills"]
}
```

Si d'autres plugins sont déjà présents dans le fichier, ajoutez simplement le nom dans le tableau `plugin` :

```json
{
  "plugin": ["other-plugin", "opencode-agent-skills"]
}
```

3. Sauvegardez le fichier et redémarrez OpenCode

**Ce que vous devez voir** :
- OpenCode redémarre et vous voyez le plugin chargé avec succès dans les logs de démarrage
- Vous pouvez utiliser des outils comme `get_available_skills` dans les conversations avec l'IA

### Méthode 2 : Installation avec version figée (pour environnement de production)

Si vous souhaitez verrouiller la version du plugin et éviter les mises à jour automatiques inattendues, utilisez cette méthode.

**Pourquoi**
Les environnements de production nécessitent généralement un contrôle de version. Une version figée garantit que votre équipe utilise la même version du plugin.

**Étapes**

1. Ouvrez le fichier de configuration d'OpenCode

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json
```

2. Ajoutez le nom du plugin avec son numéro de version dans le fichier de configuration

```json
{
  "plugin": ["opencode-agent-skills@0.6.4"]
}
```

3. Sauvegardez le fichier et redémarrez OpenCode

**Ce que vous devez voir** :
- OpenCode démarre avec la version figée v0.6.4
- Le plugin est mis en cache localement, plus besoin de le télécharger à chaque fois

::: tip Gestion des versions

Les plugins à version figée sont mis en cache localement dans OpenCode. Pour mettre à jour la version, vous devez modifier manuellement le numéro de version et redémarrer. Consultez la [dernière version](https://www.npmjs.com/package/opencode-agent-skills) pour les mises à jour.

:::

### Méthode 3 : Installation pour le développement local (pour les contributeurs)

Si vous souhaitez personnaliser le plugin ou participer au développement, utilisez cette méthode.

**Pourquoi**
Pendant le développement, vous pouvez voir immédiatement les effets de vos modifications de code, sans attendre une publication npm.

**Étapes**

1. Clonez le dépôt dans le répertoire de configuration d'OpenCode

```bash
git clone https://github.com/joshuadavidthomas/opencode-agent-skills ~/.config/opencode/opencode-agent-skills
```

2. Entrez dans le répertoire du projet et installez les dépendances

```bash
cd ~/.config/opencode/opencode-agent-skills
bun install
```

::: info Pourquoi utiliser Bun

Le projet utilise Bun comme runtime et gestionnaire de paquets. Selon le champ `engines` du fichier package.json, Bun >= 1.0.0 est requis.

:::

3. Créez un lien symbolique vers le plugin

```bash
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/opencode-agent-skills/src/plugin.ts ~/.config/opencode/plugin/skills.ts
```

**Ce que vous devez voir** :
- `~/.config/opencode/plugin/skills.ts` pointe vers votre code de plugin local
- Après avoir modifié le code, redémarrez OpenCode pour voir les changements

---

## Points de vérification ✅

Après l'installation, vérifiez de la manière suivante :

**Méthode 1 : Consulter la liste des outils**

Dans OpenCode, demandez à l'IA :

```
Veuillez lister tous les outils disponibles et voir s'il y a des outils liés aux compétences ?
```

Vous devez voir les outils suivants :
- `use_skill` - Charger une compétence
- `read_skill_file` - Lire un fichier de compétence
- `run_skill_script` - Exécuter un script de compétence
- `get_available_skills` - Obtenir la liste des compétences disponibles

**Méthode 2 : Appeler un outil**

```
Veuillez appeler get_available_skills pour voir quelles compétences sont actuellement disponibles ?
```

Vous devez voir la liste des compétences (elle peut être vide, mais l'appel de l'outil doit réussir).

**Méthode 3 : Consulter les logs de démarrage**

Vérifiez les logs de démarrage d'OpenCode, vous devriez voir quelque chose comme :

```
[plugin] Loaded plugin: opencode-agent-skills
```

---

## Résolution des problèmes

### Problème 1 : Les outils n'apparaissent pas après le démarrage d'OpenCode

**Causes possibles** :
- Erreur de format JSON dans le fichier de configuration (virgule, guillemets manquants, etc.)
- Version d'OpenCode trop ancienne (nécessite >= v1.0.110)
- Nom du plugin mal orthographié

**Solutions** :
1. Vérifiez la syntaxe du fichier de configuration avec un validateur JSON
2. Exécutez `opencode --version` pour confirmer la version
3. Vérifiez que le nom du plugin est bien `opencode-agent-skills` (avec le tiret)

### Problème 2 : La mise à jour de la version figée n'a pas pris effet

**Cause** : Les plugins à version figée sont mis en cache localement. Après avoir mis à jour le numéro de version, vous devez vider le cache.

**Solutions** :
1. Modifiez le numéro de version dans le fichier de configuration
2. Redémarrez OpenCode
3. Si le problème persiste, videz le cache des plugins d'OpenCode (l'emplacement dépend de votre système)

### Problème 3 : Les modifications ne prennent pas effet après l'installation en développement local

**Cause** : Erreur de lien symbolique ou dépendances Bun non installées.

**Solutions** :
1. Vérifiez que le lien symbolique est correct :
   ```bash
   ls -la ~/.config/opencode/plugin/skills.ts
   ```
   Doit pointer vers `~/.config/opencode/opencode-agent-skills/src/plugin.ts`

2. Confirmez que les dépendances sont installées :
   ```bash
   cd ~/.config/opencode/opencode-agent-skills
   bun install
   ```

---

## Récapitulatif de la leçon

Cette leçon a couvert trois méthodes d'installation :

- **Installation de base** : Ajoutez `opencode-agent-skills` dans le fichier de configuration, convient à la plupart des utilisateurs
- **Installation avec version figée** : Ajoutez `opencode-agent-skills@numéro_de_version`, convient à la production
- **Installation pour le développement local** : Clonez le dépôt et créez un lien symbolique, convient aux développeurs

Après l'installation, vous pouvez vérifier via la liste des outils, l'appel d'outils ou les logs de démarrage.

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons à **[créer votre première compétence](../creating-your-first-skill/)**.
>
> Vous apprendrez :
> - La structure du répertoire des compétences
> - Le format YAML frontmatter du fichier SKILL.md
> - Comment rédiger le contenu d'une compétence

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonction        | Chemin du fichier                                                                                    | Ligne    |
| --- | --- | --- |
| Définition du point d'entrée du plugin | [`package.json:18`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L18)         | 18      |
| Fichier principal du plugin | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts)         | Fichier complet  |
| Configuration des dépendances    | [`package.json:27-32`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L27-L32) | 27-32   |
| Configuration de la version    | [`package.json:39-41`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L39-L41) | 39-41   |

**Configuration clé** :
- `main: "src/plugin.ts"` : Fichier d'entrée du plugin
- `engines.bun: ">=1.0.0"` : Version requise du runtime

**Dépendances clés** :
- `@opencode-ai/plugin ^1.0.115` : SDK du plugin OpenCode
- `@huggingface/transformers ^3.8.1` : Modèle de correspondance sémantique
- `zod ^4.1.13` : Validation de schéma
- `yaml ^2.8.2` : Analyse YAML

</details>
