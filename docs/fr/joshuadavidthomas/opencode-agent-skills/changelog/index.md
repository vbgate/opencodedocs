---
title: "Historique des versions: Évolution des fonctionnalités | opencode-agent-skills"
sidebarTitle: "Quoi de neuf"
subtitle: "Historique des versions"
description: "Découvrez l'évolution des versions du plugin OpenCode Agent Skills. Ce tutoriel couvre toutes les mises à jour majeures, corrections de bugs, améliorations architecturales et changements majeurs de la v0.1.0 à la v0.6.4."
tags:
  - "Mises à jour"
  - "changelog"
  - "Historique des versions"
order: 3
---

# Historique des versions

Ce document enregistre toutes les mises à jour du plugin OpenCode Agent Skills. Grâce à l'historique des versions, vous pouvez suivre le parcours d'évolution des fonctionnalités, les problèmes résolus et les améliorations architecturales.

::: tip Version actuelle
La dernière version stable est la **v0.6.4** (20 janvier 2026)
:::

## Chronologie des versions

| Version | Date de publication | Type | Contenu principal |
| --- | --- | --- | --- |
| 0.6.4 | 2026-01-20 | Correction | Analyse YAML, support Claude v2 |
| 0.6.3 | 2025-12-16 | Amélioration | Optimisation des suggestions de compétences |
| 0.6.2 | 2025-12-15 | Correction | Séparation du nom de compétence et du nom de répertoire |
| 0.6.1 | 2025-12-13 | Amélioration | Éviter de recommander les compétences déjà chargées |
| 0.6.0 | 2025-12-12 | Nouvelle fonctionnalité | Correspondance sémantique, précalcul des embeddings |
| 0.5.0 | 2025-12-11 | Amélioration | Suggestions de correspondance floue, refactoring |
| 0.4.1 | 2025-12-08 | Amélioration | Simplification de l'installation |
| 0.4.0 | 2025-12-05 | Amélioration | Recherche récursive des scripts |
| 0.3.3 | 2025-12-02 | Correction | Gestion des liens symboliques |
| 0.3.2 | 2025-11-30 | Correction | Préservation du mode agent |
| 0.3.1 | 2025-11-28 | Correction | Problème de changement de modèle |
| 0.3.0 | 2025-11-27 | Nouvelle fonctionnalité | Fonction de liste de fichiers |
| 0.2.0 | 2025-11-26 | Nouvelle fonctionnalité | Mode Superpowers |
| 0.1.0 | 2025-11-26 | Initial | 4 outils, découverte multi-localisation |

## Journal des modifications détaillé

### v0.6.4 (20 janvier 2026)

**Corrections :**
- Correction de l'analyse du frontmatter YAML pour les descriptions multilignes de compétences (prise en charge des syntaxes de scalaires de bloc `|` et `>`), en remplaçant l'analyseur personnalisé par la bibliothèque `yaml`
- Ajout de la prise en charge du format Claude plugin v2, `installed_plugins.json` utilise désormais un tableau d'installations de plugins plutôt qu'un objet unique

**Améliorations :**
- La découverte du cache des plugins Claude Code prend désormais en charge la nouvelle structure de répertoires imbriqués (`cache/<marketplace>/<plugin>/<version>/skills/`)

### v0.6.3 (16 décembre 2025)

**Améliorations :**
- Optimisation de l'invite d'évaluation des compétences pour empêcher le modèle d'envoyer des messages de type "aucune compétence nécessaire" à l'utilisateur (l'utilisateur ne voit pas l'invite d'évaluation cachée)

### v0.6.2 (15 décembre 2025)

**Corrections :**
- La validation des compétences permet désormais que le nom du répertoire diffère du `name` dans le frontmatter SKILL.md. Le `name` dans le frontmatter est l'identifiant standard, le nom du répertoire sert uniquement à l'organisation. Cela est conforme à la spécification Anthropic Agent Skills.

### v0.6.1 (13 décembre 2025)

**Améliorations :**
- La recommandation dynamique de compétences suit désormais les compétences déjà chargées par session, évitant de recommander à nouveau les compétences déjà chargées et réduisant les invites redondantes et l'utilisation du contexte

### v0.6.0 (12 décembre 2025)

**Nouveautés :**
- **Correspondance sémantique des compétences** : après l'injection initiale de la liste des compétences, les messages suivants utilisent les embeddings locaux pour correspondre avec les descriptions des compétences
- Nouvelle dépendance `@huggingface/transformers` pour la génération d'embeddings locaux (version quantifiée all-MiniLM-L6-v2)
- Injection d'une invite d'évaluation en 3 étapes (EVALUATE → DECIDE → ACTIVATE) lorsqu'un message correspond à une compétence disponible, encourageant le chargement de la compétence (inspiré par [l'article de blog](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably) de [@spences10](https://github.com/spences10))
- Mise en cache sur disque des embeddings pour une correspondance à faible latence (~/.cache/opencode-agent-skills/)
- Nettoyage des sessions sur l'événement `session.deleted`

### v0.5.0 (11 décembre 2025)

**Nouveautés :**
- Ajout de suggestions de correspondance floue "Vouliez-vous dire..." dans tous les outils (`use_skill`, `read_skill_file`, `run_skill_script`, `get_available_skills`)

**Améliorations :**
- **Changement majeur** : renommage de l'outil `find_skills` en `get_available_skills` pour une intention plus claire
- **Interne** : réorganisation de la base de code en modules indépendants (`claude.ts`, `skills.ts`, `tools.ts`, `utils.ts`, `superpowers.ts`) pour améliorer la maintenabilité
- **Interne** : amélioration de la qualité du code en supprimant les commentaires générés par IA et le code inutile

### v0.4.1 (8 décembre 2025)

**Améliorations :**
- L'installation utilise désormais le package npm via la configuration OpenCode, plutôt que git clone + lien symbolique

**Suppressions :**
- Suppression de `INSTALL.md` (plus nécessaire après simplification de l'installation)

### v0.4.0 (5 décembre 2025)

**Améliorations :**
- La découverte de scripts recherche désormais récursivement tout le répertoire de compétences (profondeur maximale 10), plutôt que seulement le répertoire racine et le sous-répertoire `scripts/`
- Les scripts sont désormais identifiés par chemin relatif (par exemple `tools/build.sh`) plutôt que par nom de base
- Renommage du paramètre `skill_name` en `skill` dans les outils `read_skill_file`, `run_skill_script` et `use_skill`
- Renommage du paramètre `script_name` en `script` dans l'outil `run_skill_script`

### v0.3.3 (2 décembre 2025)

**Corrections :**
- Correction de la détection des fichiers et répertoires pour gérer correctement les liens symboliques en utilisant `fs.stat`

### v0.3.2 (30 novembre 2025)

**Corrections :**
- Préservation du mode agent lors de l'injection de messages synthétiques au début de la session

### v0.3.1 (28 novembre 2025)

**Corrections :**
- Correction du changement de modèle inattendu lors de l'utilisation des outils de compétence en passant explicitement le modèle actuel dans l'opération `noReply` (solution temporaire pour le problème opencode #4475)

### v0.3.0 (27 novembre 2025)

**Nouveautés :**
- Ajout d'une liste de fichiers dans la sortie `use_skill`

### v0.2.0 (26 novembre 2025)

**Nouveautés :**
- Ajout de la prise en charge du mode Superpowers
- Ajout d'une preuve de publication

### v0.1.0 (26 novembre 2025)

**Nouveautés :**
- Ajout de l'outil `use_skill` pour charger le contenu des compétences dans le contexte
- Ajout de l'outil `read_skill_file` pour lire les fichiers de support dans le répertoire de compétences
- Ajout de l'outil `run_skill_script` pour exécuter des scripts depuis le répertoire de compétences
- Ajout de l'outil `find_skills` pour rechercher et lister les compétences disponibles
- Ajout de la découverte de compétences multi-localisation (niveau projet, niveau utilisateur et emplacements compatibles Claude)
- Ajout de la validation du frontmatter conforme à la spécification Anthropic Agent Skills v1.0
- Ajout de l'injection automatique de la liste des compétences au début de la session et après la compression du contexte

**Nouveaux contributeurs :**
- Josh Thomas <josh@joshthomas.dev> (mainteneur)

## Vue d'ensemble de l'évolution des fonctionnalités

| Fonctionnalité | Version d'introduction | Parcours d'évolution |
| --- | --- | --- |
| 4 outils de base | v0.1.0 | v0.5.0 ajout de la correspondance floue |
| Découverte de compétences multi-localisation | v0.1.0 | v0.4.1 simplification de l'installation, v0.6.4 support Claude v2 |
| Injection automatique du contexte | v0.1.0 | v0.3.0 ajout de la liste de fichiers, v0.6.1 éviter les recommandations répétées |
| Mode Superpowers | v0.2.0 | Stable en continu |
| Recherche récursive des scripts | v0.4.0 | v0.3.3 correction des liens symboliques |
| Recommandation par correspondance sémantique | v0.6.0 | v0.6.1 éviter les répétitions, v0.6.3 optimisation des invites |
| Suggestions de correspondance floue | v0.5.0 | Stable en continu |

## Notes sur les changements majeurs

### v0.6.0 : Fonctionnalité de correspondance sémantique

Introduction de la capacité de correspondance sémantique basée sur des embeddings locaux, permettant à l'IA de recommander automatiquement des compétences pertinentes en fonction du contenu du message de l'utilisateur, sans nécessiter de mémoriser manuellement les noms des compétences.

- **Détails techniques** : utilisation du modèle `all-MiniLM-L6-v2` de HuggingFace (quantification q8)
- **Mécanisme de cache** : les résultats des embeddings sont mis en cache dans `~/.cache/opencode-agent-skills/`, améliorant la vitesse des correspondances ultérieures
- **Processus de correspondance** : message utilisateur → embedding → calcul de similarité cosinus avec les descriptions de compétences → Top 5 recommandations (seuil 0,35)

### v0.5.0 : Refactoring et renommage des outils

Refactoring de l'architecture du code vers une conception modulaire, avec des noms d'outils plus clairs :

- `find_skills` → `get_available_skills`
- `skill_name` → `skill`
- `script_name` → `script`

### v0.4.0 : Amélioration du mécanisme de découverte des scripts

La découverte de scripts passe de "répertoire racine uniquement + scripts/" à "recherche récursive de tout le répertoire de compétences" (profondeur maximale 10), prenant en charge une organisation plus flexible des scripts.

### v0.2.0 : Intégration Superpowers

Ajout de la prise en charge du mode de flux de travail Superpowers, nécessitant l'installation de la compétence `using-superpowers` et la définition de la variable d'environnement `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`.

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 24 janvier 2026

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
| --- | --- | --- |
| Numéro de version actuel | [`package.json`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L3-L3) | 3 |
| Historique des versions | [`CHANGELOG.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/CHANGELOG.md#L19-L152) | 19-152 |

**Informations clés sur les versions :**
- `v0.6.4` : Version actuelle (20 janvier 2026)
- `v0.6.0` : Introduction de la correspondance sémantique (12 décembre 2025)
- `v0.5.0` : Version de refactoring (11 décembre 2025)
- `v0.1.0` : Version initiale (26 novembre 2025)

</details>
