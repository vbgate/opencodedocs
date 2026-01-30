---
title: "Introduction: OpenCode Agent Skills | opencode-agent-skills"
sidebarTitle: "Faire comprendre vos skills à l'IA"
subtitle: "Introduction: OpenCode Agent Skills"
description: "Apprenez les valeurs fondamentales et les fonctionnalités principales d'OpenCode Agent Skills. Maîtrisez la découverte dynamique de skills, l'injection de contexte, la compression et la récupération, compatible avec Claude Code et recommandations automatiques."
tags:
  - "Guide de démarrage"
  - "Introduction au plugin"
prerequisite: []
order: 1
---

# Qu'est-ce qu'OpenCode Agent Skills ?

## Ce que vous pourrez faire après ce tutoriel

- Comprendre les valeurs fondamentales du plugin OpenCode Agent Skills
- Maîtriser les fonctionnalités principales fournies par le plugin
- Comprendre comment les skills sont découverts et chargés automatiquement
- Distinguer ce plugin des autres solutions de gestion de skills

## Les problèmes que vous rencontrez actuellement

Vous avez peut-être rencontré ces situations :

- **Difficulté de gestion des skills dispersés** : Les skills sont dispersés dans plusieurs emplacements (projet, répertoire utilisateur, cache du plugin), et vous ne trouvez pas le skill approprié
- **Problèmes avec les sessions longues** : Après une longue session, les skills chargés précédemment deviennent invalides à cause de la compression du contexte
- **Anxiété de compatibilité** : Inquiétude que les skills et plugins existants ne fonctionnent plus après la migration depuis Claude Code
- **Configuration répétitive** : Chaque projet nécessite une reconfiguration des skills, manque d'un mécanisme de gestion unifié

Ces problèmes affectent votre efficacité d'utilisation des assistants IA.

## Approche fondamentale

**OpenCode Agent Skills** est un système de plugin qui fournit à OpenCode des capacités de découverte et de gestion dynamiques des skills.

::: info Qu'est-ce qu'un skill ?
Un skill (compétence) est un module réutilisable contenant des directives de workflow IA. C'est généralement un répertoire contenant un fichier `SKILL.md` (décrivant les fonctionnalités et l'utilisation du skill), ainsi que des fichiers auxiliaires possibles (documentation, scripts, etc.).
:::

**Valeur fondamentale** : Grâce au format de skill standardisé (SKILL.md), réaliser la réutilisation des skills entre projets et sessions.

### Architecture technique

Le plugin est développé en TypeScript + Bun + Zod, fournissant 4 outils de base :

| Outil | Fonction |
| --- | --- |
| `use_skill` | Injecter le contenu SKILL.md du skill dans le contexte de session |
| `read_skill_file` | Lire les fichiers de support du répertoire du skill (documentation, configuration, etc.) |
| `run_skill_script` | Exécuter des scripts exécutables dans le contexte du répertoire du skill |
| `get_available_skills` | Obtenir la liste des skills actuellement disponibles |

## Fonctionnalités principales

### 1. Découverte dynamique des skills

Le plugin découvre automatiquement les skills à partir de plusieurs emplacements, triés par priorité :

```
1. .opencode/skills/              (niveau projet - OpenCode)
2. .claude/skills/                (niveau projet - Claude Code)
3. ~/.config/opencode/skills/     (niveau utilisateur - OpenCode)
4. ~/.claude/skills/              (niveau utilisateur - Claude Code)
5. ~/.claude/plugins/cache/        (cache plugin)
6. ~/.claude/plugins/marketplaces/ (plugins installés)
```

**Règle** : La première occurrence du skill est appliquée, les occurrences ultérieures du même nom sont ignorées.

> Pourquoi cette conception ?
>
> Les skills au niveau projet ont la priorité sur ceux au niveau utilisateur, vous permettant de personnaliser des comportements spécifiques dans un projet sans affecter la configuration globale.

### 2. Injection de contexte

Lorsque vous appelez `use_skill`, le contenu du skill est injecté dans le contexte de session au format XML :

- `noReply: true` - L'IA ne répondra pas au message injecté
- `synthetic: true` - Marqué comme message généré par le système (non affiché dans l'interface, non comptabilisé dans l'entrée utilisateur)

Cela signifie que le contenu du skill persiste dans le contexte de session, même lorsque la session grandit et subit une compression de contexte, le skill reste toujours disponible.

### 3. Mécanisme de récupération après compression

Lorsqu'OpenCode effectue une compression de contexte (opération courante dans les sessions longues), le plugin écoute l'événement `session.compacted`, et réinjecte automatiquement la liste des skills disponibles.

Cela garantit que l'IA sait toujours quels skills sont disponibles pendant les sessions longues, sans perdre l'accès aux skills à cause de la compression.

### 4. Compatibilité Claude Code

Le plugin est entièrement compatible avec le système de skills et de plugins de Claude Code, supportant :

- Skills Claude Code (`.claude/skills/<nom-du-skill>/SKILL.md`)
- Cache de plugins Claude (`~/.claude/plugins/cache/...`)
- Marketplace de plugins Claude (`~/.claude/plugins/marketplaces/...`)

Cela signifie que si vous utilisiez Claude Code auparavant, vous pouvez toujours utiliser les skills et plugins existants après migration vers OpenCode.

### 5. Recommandation automatique de skills

Le plugin surveille vos messages, utilisant la détection de similarité sémantique pour déterminer si un skill disponible est pertinent :

- Calculer le vecteur d'embedding du message
- Calculer la similarité cosinus avec la description de tous les skills
- Lorsque la similarité dépasse le seuil, injecter une invite d'évaluation suggérant à l'IA de charger le skill pertinent

Ce processus est entièrement automatique, vous n'avez pas besoin de mémoriser les noms de skills ou de faire des demandes explicites.

### 6. Intégration Superpowers (optionnel)

Le plugin supporte le workflow Superpowers, activable via variable d'environnement :

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

Après activation, le plugin détectera automatiquement le skill `using-superpowers` et injectera les directives complètes du workflow lors de l'initialisation de la session.

## Comparaison avec d'autres solutions

| Solution | Caractéristiques | Scénario d'application |
|---|---|---|
| **opencode-agent-skills** | Découverte dynamique, récupération après compression, recommandation automatique | Scénarios nécessitant une gestion unifiée et des recommandations automatiques |
| **opencode-skills** | Enregistrement automatique en tant qu'outil `skills_{{nom}}` | Scénarios nécessitant des appels d'outils indépendants |
| **superpowers** | Workflow complet de développement logiciel | Projets nécessitant des processus stricts |
| **skillz** | Mode serveur MCP | Scénarios nécessitant l'utilisation de skills à travers des outils |

Raisons de choisir ce plugin :

- ✅ **Zéro configuration** : découverte et gestion automatiques des skills
- ✅ **Recommandation intelligente** : recommandation automatique de skills pertinents basée sur la correspondance sémantique
- ✅ **Récupération après compression** : stable et fiable pendant les sessions longues
- ✅ **Compatibilité** : migration transparente des skills Claude Code

## Résumé de cette leçon

Le plugin OpenCode Agent Skills fournit des capacités complètes de gestion des skills à OpenCode grâce aux mécanismes de découverte dynamique, d'injection de contexte et de récupération après compression. Ses valeurs fondamentales sont :

- **Automatisation** : réduire le fardeau de la configuration manuelle et de la mémorisation des noms de skills
- **Stabilité** : les skills restent toujours disponibles pendant les sessions longues
- **Compatibilité** : intégration transparente avec l'écosystème Claude Code existant

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[l'installation d'OpenCode Agent Skills](../installation/)**.
>
> Vous apprendrez :
> - Comment ajouter le plugin dans la configuration OpenCode
> - Comment vérifier si le plugin est correctement installé
> - La méthode de configuration du mode développement local

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
|---|---|---|
| Entrée du plugin et vue d'ensemble des fonctionnalités | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L1-L12) | 1-12 |
| Liste des fonctionnalités principales | [`README.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/README.md#L5-L11) | 5-11 |
| Priorité de découverte des skills | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Injection de messages synthétiques | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| Mécanisme de récupération après compression | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L144-L151) | 144-151 |
| Module de correspondance sémantique | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L108-L135) | 108-135 |

**Constantes clés** :
- `EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"` : modèle d'embedding utilisé
- `SIMILARITY_THRESHOLD = 0.35` : seuil de similarité sémantique
- `TOP_K = 5` : nombre maximum de skills retournés par la recommandation automatique

**Fonctions clés** :
- `discoverAllSkills()` : découvrir les skills à partir de plusieurs emplacements
- `use_skill()` : injecter le contenu du skill dans le contexte de session
- `matchSkills()` : faire correspondre les skills pertinents basés sur la similarité sémantique
- `injectSyntheticContent()` : injecter des messages synthétiques dans la session

</details>
