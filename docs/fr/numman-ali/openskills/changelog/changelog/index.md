---
title: "Journal des Versions : Mises à Jour | OpenSkills"
sidebarTitle: "Voir les Nouveautés"
subtitle: "Journal des Versions : Mises à Jour | OpenSkills"
description: "Consultez l'historique des versions d'OpenSkills, découvrez les nouvelles fonctionnalités comme la commande update, les liens symboliques, les dépôts privés, ainsi que les améliorations importantes et les corrections de bugs."
tags:
  - "journal"
  - "historique des versions"
order: 1
---

# Journal des Versions

Cette page enregistre l'historique des versions d'OpenSkills pour vous aider à comprendre les nouvelles fonctionnalités, les améliorations et les corrections de bugs de chaque version.

---

## [1.5.0] - 2026-01-17

### Nouvelles Fonctionnalités

- **`openskills update`** - Rafraîchit les compétences installées à partir des sources enregistrées (par défaut : tout rafraîchir)
- **Suivi des métadonnées source** - L'installation enregistre désormais les informations de source pour des mises à jour fiables des compétences

### Améliorations

- **Lecture multi-compétences** - La commande `openskills read` prend désormais en charge une liste de noms de compétences séparés par des virgules
- **Instructions d'utilisation générées** - Optimisation des suggestions d'appel de la commande read dans les environnements shell
- **README** - Ajout du guide de mise à jour et des conseils pour une utilisation manuelle

### Corrections de Bugs

- **Optimisation de l'expérience de mise à jour** - Ignore les compétences sans métadonnées de source et liste ces compétences pour une réinstallation

---

## [1.4.0] - 2026-01-17

### Améliorations

- **README** - Clarification de la méthode d'installation locale par défaut du projet et suppression des suggestions sync redondantes
- **Messages d'installation** - L'installateur distingue désormais clairement l'installation locale par défaut du projet et l'option `--global`

---

## [1.3.2] - 2026-01-17

### Améliorations

- **Documentation et directives AGENTS.md** - Tous les exemples de commandes et les instructions d'utilisation générées utilisent désormais uniformément `npx openskills`

---

## [1.3.1] - 2026-01-17

### Corrections de Bugs

- **Installation Windows** - Correction du problème de validation de chemin sur les systèmes Windows ("Erreur de sécurité : chemin d'installation en dehors du répertoire cible")
- **Version CLI** - `npx openskills --version` lit désormais correctement le numéro de version dans package.json
- **SKILL.md à la racine** - Correction du problème d'installation SKILL.md dans le répertoire racine des dépôts à compétence unique

---

## [1.3.0] - 2025-12-14

### Nouvelles Fonctionnalités

- **Prise en charge des liens symboliques** - Les compétences peuvent désormais être installées via des liens symboliques vers le répertoire des compétences ([#3](https://github.com/numman-ali/openskills/issues/3))
  - Prise en charge des mises à jour de compétences basées sur git via la création de liens symboliques à partir de dépôts clonés
  - Prise en charge du flux de travail de développement local de compétences
  - Les liens symboliques rompus sont ignorés gracieusement

- **Chemin de sortie configurable** - La commande sync prend désormais en charge les options `--output` / `-o` ([#5](https://github.com/numman-ali/openskills/issues/5))
  - Peut se synchroniser vers n'importe quel fichier `.md` (par exemple `.ruler/AGENTS.md`)
  - Crée automatiquement le fichier et ajoute le titre si le fichier n'existe pas
  - Crée automatiquement les répertoires imbriqués si nécessaire

- **Installation par chemin local** - Prise en charge de l'installation de compétences à partir de répertoires locaux ([#10](https://github.com/numman-ali/openskills/issues/10))
  - Prise en charge des chemins absolus (`/path/to/skill`)
  - Prise en charge des chemins relatifs (`./skill`, `../skill`)
  - Prise en charge de l'expansion tilde (`~/my-skills/skill`)

- **Prise en charge des dépôts git privés** - Prise en charge de l'installation de compétences à partir de dépôts privés ([#10](https://github.com/numman-ali/openskills/issues/10))
  - URLs SSH (`git@github.com:org/private-skills.git`)
  - URLs HTTPS avec authentification
  - Utilisation automatique des clés SSH système

- **Suite de tests complète** - 88 tests dans 6 fichiers de test
  - Tests unitaires pour la détection des liens symboliques, l'analyse YAML
  - Tests d'intégration pour les commandes install, sync
  - Tests de bout en bout pour le flux de travail CLI complet

### Améliorations

- **`--yes` flag saute maintenant toutes les invites** - Mode entièrement non interactif, adapté pour CI/CD ([#6](https://github.com/numman-ali/openskills/issues/6))
  - Ne demande pas lors du remplacement de compétences existantes
  - Affiche le message `Overwriting: <skill-name>` lors du saut des invites
  - Toutes les commandes peuvent désormais s'exécuter dans des environnements headless

- **Réorganisation du workflow CI** - L'étape de build s'exécute désormais avant les tests
  - Assure que `dist/cli.js` existe pour les tests de bout en bout

### Sécurité

- **Protection contre la traversée de chemin** - Validation que les chemins d'installation restent dans le répertoire cible
- **Déréférencement des liens symboliques** - `cpSync` utilise `dereference: true` pour copier en toute sécurité les cibles des liens symboliques
- **Regex YAML non-gourmand** - Prévention des attaques ReDoS potentielles dans l'analyse frontmatter

---

## [1.2.1] - 2025-10-27

### Corrections de Bugs

- Nettoyage de la documentation README - Suppression des sections dupliquées et des drapeaux incorrects

---

## [1.2.0] - 2025-10-27

### Nouvelles Fonctionnalités

- Drapeau `--universal`, installe les compétences dans `.agent/skills/` au lieu de `.claude/skills/`
  - Adapté aux environnements multi-agents (Claude Code + Cursor/Windsurf/Aider)
  - Évite les conflits avec les plugins du marché natif Claude Code

### Améliorations

- L'installation locale du projet est désormais l'option par défaut (auparavant c'était l'installation globale)
- Les compétences sont installées par défaut dans `./.claude/skills/`

---

## [1.1.0] - 2025-10-27

### Nouvelles Fonctionnalités

- README complet sur une page, avec une analyse technique approfondie
- Comparaison côte à côte avec Claude Code

### Corrections de Bugs

- Les étiquettes d'emplacement affichent désormais correctement `project` ou `global` en fonction de l'emplacement d'installation

---

## [1.0.0] - 2025-10-26

### Nouvelles Fonctionnalités

- Version initiale
- `npx openskills install <source>` - Installe des compétences à partir de dépôts GitHub
- `npx openskills sync` - Génère `<available_skills>` XML pour AGENTS.md
- `npx openskills list` - Affiche les compétences installées
- `npx openskills read <name>` - Charge le contenu de la compétence pour l'agent
- `npx openskills manage` - Suppression interactive des compétences
- `npx openskills remove <name>` - Supprime la compétence spécifiée
- Interface TUI interactive pour toutes les commandes
- Prise en charge du format SKILL.md d'Anthropic
- Divulgation progressive (chargement des compétences à la demande)
- Prise en charge des ressources empaquetées (references/, scripts/, assets/)

---

## Annexe : Référence Source

<details>
<summary><strong>Cliquez pour voir l'emplacement source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonction | Chemin du fichier |
|---|---|
| Journal des versions original | [`CHANGELOG.md`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md) |

</details>
