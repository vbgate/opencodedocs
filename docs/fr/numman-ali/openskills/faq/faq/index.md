---
title: "FAQ : Guide de dépannage | opencode"
subtitle: "FAQ : Guide de dépannage"
sidebarTitle: "Que faire en cas de problème"
description: "Apprenez les solutions aux questions fréquentes sur OpenSkills. Dépannez rapidement les échecs d'installation, les compétences non chargées, la synchronisation AGENTS.md, etc., pour améliorer l'efficacité de la gestion des compétences."
tags:
  - "FAQ"
  - "Dépannage"
  - "Questions fréquentes"
prerequisite:
  - "start-quick-start"
order: 1
---

# Questions Fréquentes

## Ce que vous pourrez faire après ce cours

Ce cours répond aux questions fréquentes lors de l'utilisation d'OpenSkills, en vous aidant à :

- ✅ Identifier et résoudre rapidement les problèmes d'installation
- ✅ Comprendre la relation entre OpenSkills et Claude Code
- ✅ Résoudre les problèmes où les compétences n'apparaissent pas dans AGENTS.md
- ✅ Gérer les questions liées aux mises à jour et suppressions de compétences
- ✅ Configurer correctement les compétences dans un environnement multi-agents

## Vos difficultés actuelles

Lors de l'utilisation d'OpenSkills, vous pourriez rencontrer :

- "L'installation échoue toujours, je ne sais pas où est le problème"
- "Je ne vois pas les compétences nouvellement installées dans AGENTS.md"
- "Je ne sais pas où les compétences sont installées"
- "Je veux utiliser OpenSkills, mais je crains des conflits avec Claude Code"

Ce cours vous aide à trouver rapidement la cause profonde et les solutions.

---

## Questions sur les concepts fondamentaux

### Quelle est la différence entre OpenSkills et Claude Code ?

**Réponse courte** : OpenSkills est un "installateur universel", Claude Code est un "agent officiel".

**Explication détaillée** :

| Aspect | OpenSkills | Claude Code |
|--- | --- | ---|
| **Positionnement** | Chargeur de compétences universel | Agent IA de codage officiel d'Anthropic |
| **Portée de support** | Tous les agents IA (Cursor, Windsurf, Aider, etc.) | Claude Code uniquement |
| **Format de compétence** | Identique à Claude Code (`SKILL.md`) | Spécification officielle |
| **Méthode d'installation** | Depuis GitHub, chemin local, dépôt privé | Depuis le Marketplace intégré |
| **Stockage des compétences** | `.claude/skills/` ou `.agent/skills/` | `.claude/skills/` |
| **Méthode d'appel** | `npx openskills read <name>` | Outil intégré `Skill()` |

**Valeur clé** : OpenSkills permet aux autres agents d'utiliser le système de compétences d'Anthropic sans attendre que chaque agent implémente sa propre solution.

### Pourquoi CLI et non MCP ?

**Raison fondamentale** : Les compétences sont des fichiers statiques, MCP est un outil dynamique, ils résolvent des problèmes différents.

| Dimension de comparaison | MCP (Model Context Protocol) | OpenSkills (CLI) |
|--- | --- | ---|
| **Scénario d'utilisation** | Outils dynamiques, appels API en temps réel | Instructions statiques, documentation, scripts |
| **Configuration requise** | Serveur MCP requis | Aucun serveur nécessaire (fichiers purs) |
| **Support des agents** | Agents prenant en charge MCP uniquement | Tous les agents pouvant lire AGENTS.md |
| **Complexité** | Nécessite un déploiement de serveur | Configuration zéro |

**Points clés** :

- **Les compétences sont des fichiers** : SKILL.md est constitué d'instructions statiques + ressources (references/, scripts/, assets/), pas besoin de serveur
- **Pas besoin de support des agents** : Tout agent capable d'exécuter des commandes shell peut l'utiliser
- **Conforme au design officiel** : Le système de compétences d'Anthropic est conçu comme un système de fichiers, pas MCP

**Résumé** : MCP et le système de compétences résolvent des problèmes différents. OpenSkills maintient la légèreté et l'universalité des compétences sans obliger chaque agent à prendre en charge MCP.

---

## Questions sur l'installation et la configuration

### Que faire si l'installation échoue ?

**Erreurs courantes et solutions** :

#### Erreur 1 : Échec du clonage

```bash
Error: Git clone failed
```

**Causes possibles** :
- Problème réseau (impossible d'accéder à GitHub)
- Git non installé ou version trop ancienne
- Dépôt privé sans clé SSH configurée

**Solutions** :

1. Vérifiez que Git est installé :
   ```bash
   git --version
   # Devrait afficher : git version 2.x.x
   ```

2. Vérifiez la connexion réseau :
   ```bash
   # Testez si vous pouvez accéder à GitHub
   ping github.com
   ```

3. Configurez SSH pour les dépôts privés :
   ```bash
   # Testez la connexion SSH
   ssh -T git@github.com
   ```

#### Erreur 2 : Le chemin n'existe pas

```bash
Error: Path does not exist: ./nonexistent-path
```

**Solutions** :
- Confirmez que le chemin local est correct
- Utilisez des chemins absolus ou relatifs :
  ```bash
  # Chemin absolu
  npx openskills install /Users/dev/my-skills

  # Chemin relatif
  npx openskills install ./my-skills
  ```

#### Erreur 3 : SKILL.md introuvable

```bash
Error: No valid SKILL.md found
```

**Solutions** :

1. Vérifiez la structure du répertoire de la compétence :
   ```bash
   ls -la ./my-skill
   # Doit contenir SKILL.md
   ```

2. Confirmez que SKILL.md a un YAML frontmatter valide :
   ```markdown
   ---
   name: my-skill
   description: Skill description
   ---

   # Skill content
   ```

### Dans quel répertoire les compétences sont-elles installées ?

**Emplacement par défaut** (projet local) :
```bash
.claude/skills/
```

**Emplacement d'installation globale** (avec `--global`) :
```bash
~/.claude/skills/
```

**Mode Universal** (avec `--universal`) :
```bash
.agent/skills/
```

**Priorité de recherche des compétences** (de la plus haute à la plus basse) :
1. `./.agent/skills/` (projet local, Universal)
2. `~/.agent/skills/` (global, Universal)
3. `./.claude/skills/` (projet local, par défaut)
4. `~/.claude/skills/` (global, par défaut)

**Voir l'emplacement des compétences installées** :
```bash
npx openskills list
# La sortie affiche les balises [project] ou [global]
```

### Comment coexister avec Claude Code Marketplace ?

**Problème** : Je veux utiliser Claude Code et OpenSkills, comment éviter les conflits ?

**Solution** : Utilisez le mode Universal

```bash
# Installer dans .agent/skills/ au lieu de .claude/skills/
npx openskills install anthropics/skills --universal
```

**Pourquoi cela fonctionne** :

| Répertoire | Utilisé par | Description |
|--- | --- | ---|
| `.claude/skills/` | Claude Code | Utilisé par Claude Code Marketplace |
| `.agent/skills/` | OpenSkills | Autres agents (Cursor, Windsurf) |

**Avertissement de conflit** :

Lors de l'installation depuis le dépôt officiel, OpenSkills vous avertira :
```
⚠️  Warning: These skills are also available in Claude Code Marketplace.
   Installing to .claude/skills/ may cause conflicts.
   Use --universal to install to .agent/skills/ instead.
```

---

## Questions sur l'utilisation

### Les compétences n'apparaissent pas dans AGENTS.md ?

**Symptôme** : Après avoir installé des compétences, elles ne figurent pas dans AGENTS.md.

**Étapes de dépannage** :

#### 1. Confirmez la synchronisation

Après avoir installé des compétences, vous devez exécuter la commande `sync` :

```bash
npx openskills install anthropics/skills
# Sélectionnez les compétences...

# Exécutez sync obligatoirement !
npx openskills sync
```

#### 2. Vérifiez l'emplacement de AGENTS.md

```bash
# AGENTS.md est par défaut dans le répertoire racine du projet
cat AGENTS.md
```

Si vous utilisez un chemin de sortie personnalisé, confirmez que le chemin est correct :
```bash
npx openskills sync -o custom-path/AGENTS.md
```

#### 3. Vérifiez que les compétences sont sélectionnées

La commande `sync` est interactive, vous devez confirmer que vous avez sélectionné les compétences à synchroniser :

```bash
npx openskills sync

? Select skills to sync:
  ◉ pdf                  [sélectionné]
  ◯ check-branch-first   [non sélectionné]
```

#### 4. Vérifiez le contenu de AGENTS.md

Confirmez que les balises XML sont correctes :

```xml
<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
```

### Comment mettre à jour les compétences ?

**Mettre à jour toutes les compétences** :
```bash
npx openskills update
```

**Mettre à jour des compétences spécifiques** (séparées par des virgules) :
```bash
npx openskills update pdf,git-workflow
```

**Questions courantes** :

#### Compétence non mise à jour

**Symptôme** : Après avoir exécuté `update`, le message "skipped" s'affiche

**Cause** : Les informations source n'ont pas été enregistrées lors de l'installation (comportement des anciennes versions)

**Solution** :
```bash
# Réinstaller pour enregistrer la source
npx openskills install anthropics/skills
```

#### Compétence locale impossible à mettre à jour

**Symptôme** : Les compétences installées depuis un chemin local génèrent une erreur lors de la mise à jour

**Cause** : Les compétences de chemin local doivent être mises à jour manuellement

**Solution** :
```bash
# Réinstaller depuis le chemin local
npx openskills install ./my-skill
```

### Comment supprimer des compétences ?

**Méthode 1 : Suppression interactive**

```bash
npx openskills manage
```

Sélectionnez les compétences à supprimer, appuyez sur Espace pour les sélectionner, Entrée pour confirmer.

**Méthode 2 : Suppression directe**

```bash
npx openskills remove <skill-name>
```

**Après suppression** : N'oubliez pas d'exécuter `sync` pour mettre à jour AGENTS.md :
```bash
npx openskills sync
```

**Questions courantes** :

#### Suppression accidentelle

**Méthode de récupération** :
```bash
# Réinstaller depuis la source
npx openskills install anthropics/skills
# Sélectionnez la compétence supprimée par erreur
```

#### Toujours affiché dans AGENTS.md après suppression

**Solution** : Synchroniser à nouveau
```bash
npx openskills sync
```

---

## Questions avancées

### Comment partager des compétences entre plusieurs projets ?

**Scénario** : Plusieurs projets ont besoin du même ensemble de compétences, vous ne voulez pas les installer plusieurs fois.

**Solution 1 : Installation globale**

```bash
# Installer une fois globalement
npx openskills install anthropics/skills --global

# Tous les projets peuvent les utiliser
cd project-a
npx openskills read pdf

cd project-b
npx openskills read pdf
```

**Avantages** :
- Installation unique, disponibilité partout
- Réduit l'occupation disque

**Inconvénients** :
- Les compétences ne sont pas dans le projet, non inclus dans le contrôle de version

**Solution 2 : Liens symboliques**

```bash
# 1. Installer les compétences globalement
npx openskills install anthropics/skills --global

# 2. Créer des liens symboliques dans le projet
cd project-a
ln -s ~/.claude/skills/pdf .claude/skills/pdf

# 3. sync reconnaîtra l'emplacement [project]
npx openskills sync
```

**Avantages** :
- Les compétences sont dans le projet (balise `[project]`)
- Le contrôle de version peut inclure les liens symboliques
- Installation unique, utilisation multiple

**Inconvénients** :
- Les liens symboliques nécessitent des droits sur certains systèmes

**Solution 3 : Git Submodule**

```bash
# Ajouter le dépôt de compétences comme submodule dans le projet
cd project-a
git submodule add https://github.com/anthropics/skills.git .claude/skills-repo

# Installer les compétences depuis submodule
npx openskills install .claude/skills-repo/pdf
```

**Avantages** :
- Contrôle de version complet
- Peut spécifier la version des compétences

**Inconvénients** :
- Configuration relativement complexe

### Liens symboliques inaccessibles ?

**Symptôme** :

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Solutions par système** :

#### macOS

1. Ouvrez "Préférences Système"
2. Allez dans "Sécurité et confidentialité"
3. Dans "Accès complet au disque", autorisez votre application de terminal

#### Windows

Windows ne prend pas en charge nativement les liens symboliques, recommandez :
- **Utiliser Git Bash** : prend en charge les liens symboliques nativement
- **Utiliser WSL** : le sous-système Linux prend en charge les liens symboliques
- **Activer le mode développeur** : Paramètres → Mise à jour et sécurité → Mode développeur

```bash
# Créer des liens symboliques dans Git Bash
ln -s /c/dev/my-skills/my-skill .claude/skills/my-skill
```

#### Linux

Vérifiez les permissions du système de fichiers :

```bash
# Vérifier les permissions du répertoire
ls -la .claude/

# Ajouter les permissions d'écriture
chmod +w .claude/
```

### Compétence introuvable ?

**Symptôme** :

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Étapes de dépannage** :

#### 1. Confirmez que la compétence est installée

```bash
npx openskills list
```

#### 2. Vérifiez la casse du nom de la compétence

```bash
# ❌ Incorrect (majuscule)
npx openskills read My-Skill

# ✅ Correct (minuscule)
npx openskills read my-skill
```

#### 3. Vérifiez que la compétence est écrasée par une compétence de priorité plus élevée

```bash
# Voir tous les emplacements de compétences
ls -la .claude/skills/my-skill
ls -la ~/.claude/skills/my-skill
ls -la .agent/skills/my-skill
ls -la ~/.agent/skills/my-skill
```

**Règle de recherche des compétences** : L'emplacement avec la priorité la plus élevée remplacera les compétences du même nom dans d'autres emplacements.

---

## Résumé du cours

Points clés sur les questions fréquentes d'OpenSkills :

### Concepts fondamentaux

- ✅ OpenSkills est un installateur universel, Claude Code est l'agent officiel
- ✅ CLI est plus adapté que MCP pour le système de compétences (fichiers statiques)

### Installation et configuration

- ✅ Les compétences sont installées par défaut dans `.claude/skills/`
- ✅ Utilisez `--universal` pour éviter les conflits avec Claude Code
- ✅ Les échecs d'installation sont généralement dus au réseau, Git, ou aux chemins

### Astuces d'utilisation

- ✅ `sync` est obligatoire après l'installation pour apparaître dans AGENTS.md
- ✅ La commande `update` ne met à jour que les compétences avec des informations source
- ✅ N'oubliez pas `sync` après avoir supprimé des compétences

### Scénarios avancés

- ✅ Partage de compétences multi-projets : installation globale, liens symboliques, Git Submodule
- ✅ Problèmes de liens symboliques : configurer les droits par système
- ✅ Compétence introuvable : vérifiez le nom, regardez la priorité

## Prochain cours

> Le prochain cours couvre **[Dépannage](../troubleshooting/)**.
>
> Vous apprendrez :
> - Diagnostic rapide et solutions des erreurs courantes
> - Traitement des problèmes de chemins, échecs de clonage, SKILL.md invalide, etc.
> - Techniques de dépannage pour les problèmes de droits et de liens symboliques

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier                                                                                                   | Ligne    |
|--- | --- | ---|
| Commande d'installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts)              | 1-424   |
| Commande de synchronisation | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)                  | 1-99    |
| Commande de mise à jour | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts)              | 1-113   |
| Commande de suppression | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts)              | 1-30    |
| Recherche de compétences | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts)                    | 1-50    |
| Priorité des répertoires | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts)                      | 14-25   |
| Génération AGENTS.md | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts)            | 23-93   |

**Fonctions clés** :
- `findAllSkills()` : Trouve toutes les compétences (triées par priorité)
- `findSkill(name)` : Trouve une compétence spécifique
- `generateSkillsXml()` : Génère le format XML AGENTS.md
- `updateSkillFromDir()` : Met à jour une compétence depuis un répertoire

</details>
