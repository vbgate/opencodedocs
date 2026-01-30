---
title: "Global vs Projet : Emplacement d'installation | OpenSkills"
sidebarTitle: "Installation globale : Partager les compétences entre projets"
subtitle: "Installation globale vs Installation locale au projet"
description: "Apprenez la différence entre l'installation globale et l'installation locale au projet des compétences OpenSkills. Maîtrisez l'utilisation du drapeau --global, comprenez les règles de priorité de recherche, choisissez l'emplacement d'installation approprié selon le scénario."
tags:
  - "Intégration de plateforme"
  - "Gestion des compétences"
  - "Techniques de configuration"
prerequisite:
  - "start-first-skill"
  - "platforms-install-sources"
order: 3
---

# Installation globale vs Installation locale au projet

## Ce que vous apprendrez

- Comprendre la différence entre les deux emplacements d'installation OpenSkills (global vs local au projet)
- Choisir l'emplacement d'installation approprié selon le scénario
- Maîtriser l'utilisation du drapeau `--global`
- Comprendre les règles de priorité de recherche des compétences
- Éviter les erreurs courantes de configuration de l'emplacement d'installation

::: info Prérequis

Ce tutoriel suppose que vous avez déjà terminé [l'installation de la première compétence](../../start/first-skill/) et [les détails sur les sources d'installation](../install-sources/), et que vous comprenez le processus d'installation de base des compétences.

:::

---

## Votre situation actuelle

Vous avez peut-être déjà appris à installer des compétences, mais :

- **Où sont installées les compétences ?** : Après avoir exécuté `openskills install`, vous ne savez pas dans quel répertoire les fichiers de compétence ont été copiés
- **Faut-il réinstaller pour le nouveau projet ?** : En changeant de projet, les compétences précédemment installées ont disparu
- **Que faire des compétences utilisées une seule fois globalement ?** : Certaines compétences sont nécessaires pour tous les projets, vous ne voulez pas les installer dans chaque projet
- **Partager des compétences entre plusieurs projets ?** : Certaines compétences sont courantes dans l'équipe, vous souhaitez une gestion unifiée

En réalité, OpenSkills fournit deux emplacements d'installation, vous permettant de gérer les compétences de manière flexible.

---

## Quand utiliser cette méthode

**Scénarios d'utilisation pour les deux emplacements d'installation** :

| Emplacement d'installation | Scénario applicable | Exemple |
|--- | --- | ---|
| **Local au projet** (par défaut) | Compétences spécifiques au projet, nécessitant un contrôle de version | Règles métier de l'équipe, outils spécifiques au projet |
| **Installation globale** (`--global`) | Compétences communes à tous les projets, sans contrôle de version | Outils de génération de code génériques, conversion de formats de fichiers |

::: tip Recommandation

- **Utilisez par défaut l'installation locale au projet** : Laissez les compétences suivre le projet, facilitant la collaboration d'équipe et le contrôle de version
- **Utilisez l'installation globale uniquement pour les outils génériques** : Par exemple `git-helper`, `docker-generator` et autres outils inter-projets
- **Évitez une globalisation excessive** : Les compétences installées globalement sont partagées par tous les projets, ce qui peut entraîner des conflits ou des incohérences de version

:::

---

## Concept clé : Deux emplacements, un choix flexible

L'emplacement d'installation des compétences OpenSkills est contrôlé par le drapeau `--global` :

**Par défaut (installation locale au projet)** :
- Emplacement d'installation : `./.claude/skills/` (répertoire racine du projet)
- Usage : Compétences spécifiques à un projet unique
- Avantage : Les compétences suivent le projet, peuvent être soumises à Git, facilitant la collaboration d'équipe

**Installation globale** :
- Emplacement d'installation : `~/.claude/skills/` (répertoire personnel de l'utilisateur)
- Usage : Compétences communes à tous les projets
- Avantage : Partagé par tous les projets, pas besoin de réinstaller

::: info Concept important

**Local au projet** : Les compétences sont installées dans le répertoire `.claude/skills/` du projet actuel et ne sont visibles que pour le projet actuel.

**Installation globale** : Les compétences sont installées dans `.claude/skills/` du répertoire personnel de l'utilisateur et sont visibles pour tous les projets.

:::

---

## Suivez le guide

### Étape 1 : Voir le comportement d'installation par défaut

**Pourquoi**
Comprendre d'abord le mode d'installation par défaut pour saisir la philosophie de conception d'OpenSkills.

Ouvrez le terminal et exécutez dans n'importe quel projet :

```bash
# Installer une compétence de test (par défaut locale au projet)
npx openskills install anthropics/skills -y

# Voir la liste des compétences
npx openskills list
```

**Ce que vous devriez voir** : Chaque compétence dans la liste est suivie de l'étiquette `(project)`

```
  codebase-reviewer         (project)
    Review code changes for issues...

Summary: 3 project, 0 global (3 total)
```

**Explication** :
- Par défaut, les compétences sont installées dans le répertoire `./.claude/skills/`
- La commande `list` affiche les étiquettes `(project)` ou `(global)`
- Sans le drapeau `--global` par défaut, les compétences ne sont visibles que pour le projet actuel

---

### Étape 2 : Voir l'emplacement d'installation des compétences

**Pourquoi**
Confirmer l'emplacement de stockage réel des fichiers de compétences pour faciliter la gestion future.

Exécutez dans le répertoire racine du projet :

```bash
# Voir le répertoire des compétences locales au projet
ls -la .claude/skills/

# Voir le contenu du répertoire des compétences
ls -la .claude/skills/codebase-reviewer/
```

**Ce que vous devriez voir** :

```
.claude/skills/
├── codebase-reviewer/
│   ├── SKILL.md
│   └── .openskills.json    # Métadonnées d'installation
├── file-writer/
│   ├── SKILL.md
│   └── .openskills.json
└── ...
```

**Explication** :
- Chaque compétence a son propre répertoire
- `SKILL.md` est le contenu principal de la compétence
- `.openskills.json` enregistre la source d'installation et les métadonnées (utilisé pour les mises à jour)

---

### Étape 3 : Installer une compétence globalement

**Pourquoi**
Comprendre la commande et l'effet de l'installation globale.

Exécutez :

```bash
# Installer une compétence globalement
npx openskills install anthropics/skills --global -y

# Voir à nouveau la liste des compétences
npx openskills list
```

**Ce que vous devriez voir** :

```
  codebase-reviewer         (project)
    Review code changes for issues...
  file-writer              (global)
    Write files with format...

Summary: 1 project, 2 global (3 total)
```

**Explication** :
- Après avoir utilisé le drapeau `--global`, la compétence est installée dans `~/.claude/skills/`
- La commande `list` affiche l'étiquette `(global)`
- Les compétences du même nom priorisent la version locale au projet (priorité de recherche)

---

### Étape 4 : Comparer les deux emplacements d'installation

**Pourquoi**
Comprendre les différences entre les deux emplacements d'installation grâce à une comparaison pratique.

Exécutez les commandes suivantes :

```bash
# Voir le répertoire des compétences installées globalement
ls -la ~/.claude/skills/

# Comparer les compétences locales au projet et globales
echo "=== Project Skills ==="
ls .claude/skills/

echo "=== Global Skills ==="
ls ~/.claude/skills/
```

**Ce que vous devriez voir** :

```
=== Project Skills ===
codebase-reviewer
file-writer

=== Global Skills ===
codebase-reviewer
file-writer
test-generator
```

**Explication** :
- Compétences locales au projet : `./.claude/skills/`
- Compétences globales : `~/.claude/skills/`
- Les deux répertoires peuvent contenir des compétences du même nom, mais la version locale au projet a une priorité plus élevée

---

### Étape 5 : Vérifier la priorité de recherche

**Pourquoi**
Comprendre comment OpenSkills recherche des compétences dans plusieurs emplacements.

Exécutez :

```bash
# Installer une compétence du même nom dans les deux emplacements
npx openskills install anthropics/skills -y  # Local au projet
npx openskills install anthropics/skills --global -y  # Global

# Lire la compétence (priorisera la version locale au projet)
npx openskills read codebase-reviewer | head -5
```

**Ce que vous devriez voir** : Le résultat est le contenu de la version locale au projet de la compétence.

**Règles de priorité de recherche** (code source `dirs.ts:18-24`) :

```typescript
export function getSearchDirs(): string[] {
  return [
    join(process.cwd(), '.claude/skills'),   // 1. Local au projet (priorité la plus élevée)
    join(homedir(), '.claude/skills'),       // 2. Global
  ];
}
```

**Explication** :
- Les compétences locales au projet ont une priorité plus élevée que les compétences globales
- Lorsque des compétences du même nom existent simultanément, la version locale au projet est prioritaire
- Cela permet de réaliser une configuration flexible de "projet écrasant global"

---

## Point de contrôle ✅

Effectuez les vérifications suivantes pour confirmer que vous avez maîtrisé le contenu de cette leçon :

- [ ] Pouvoir distinguer l'installation locale au projet et l'installation globale
- [ ] Connaître l'effet du drapeau `--global`
- [ ] Comprendre les règles de priorité de recherche des compétences
- [ ] Pouvoir choisir l'emplacement d'installation approprié selon le scénario
- [ ] Savoir comment voir les étiquettes d'emplacement des compétences installées

---

## Pièges à éviter

### Erreur courante 1 : Mauvaise utilisation de l'installation globale

**Scénario d'erreur** : Installer globalement des compétences spécifiques au projet

```bash
# ❌ Erreur : les règles métier de l'équipe ne devraient pas être installées globalement
npx openskills install my-company/rules --global
```

**Problème** :
- Les autres membres de l'équipe ne peuvent pas obtenir cette compétence
- La compétence ne sera pas sous contrôle de version
- Peut entrer en conflit avec les compétences d'autres projets

**Correct** :

```bash
# ✅ Correct : les compétences spécifiques au projet utilisent l'installation par défaut (locale au projet)
npx openskills install my-company/rules
```

---

### Erreur courante 2 : Oublier le drapeau `--global`

**Scénario d'erreur** : Vouloir partager des compétences entre tous les projets, mais oublier d'ajouter `--global`

```bash
# ❌ Erreur : installation par défaut dans le projet local, les autres projets ne peuvent pas utiliser
npx openskills install universal-tool
```

**Problème** :
- La compétence n'est installée que dans `./.claude/skills/` du projet actuel
- Après avoir changé vers un autre projet, elle doit être réinstallée

**Correct** :

```bash
# ✅ Correct : les outils génériques utilisent l'installation globale
npx openskills install universal-tool --global
```

---

### Erreur courante 3 : Conflit de compétences du même nom

**Scénario d'erreur** : Une compétence du même nom est installée localement au projet et globalement, mais on souhaite utiliser la version globale

```bash
# codebase-reviewer existe à la fois localement au projet et globalement
# mais on veut utiliser la version globale (nouvelle)
npx openskills install codebase-reviewer --global  # Installer la nouvelle version
npx openskills read codebase-reviewer  # ❌ Toujours lit l'ancienne version
```

**Problème** :
- La version locale au projet a une priorité plus élevée
- Même si une nouvelle version est installée globalement, l'ancienne version locale au projet est toujours lue

**Correct** :

```bash
# Solution 1 : Supprimer la version locale au projet
npx openskills remove codebase-reviewer  # Supprimer le local au projet
npx openskills read codebase-reviewer  # ✅ Maintenant lit la version globale

# Solution 2 : Mettre à jour localement au projet
npx openskills update codebase-reviewer  # Mettre à jour la version locale au projet
```

---

## Résumé de la leçon

**Points clés** :

1. **Installation par défaut locale au projet** : Les compétences sont installées dans `./.claude/skills/`, visibles uniquement pour le projet actuel
2. **L'installation globale utilise `--global`** : Les compétences sont installées dans `~/.claude/skills/`, partagées par tous les projets
3. **Priorité de recherche** : Local au projet > Global
4. **Principe recommandé** : Spécifique au projet = local, outil générique = global

**Processus de décision** :

```
[Besoin d'installer une compétence] → [Est-ce spécifique au projet ?]
                                      ↓ Oui
                              [Installation locale au projet (par défaut)]
                                      ↓ Non
                              [Besoin d'un contrôle de version ?]
                                      ↓ Oui
                              [Installation locale au projet (peut être commitée dans Git)]
                                      ↓ Non
                              [Installation globale (--global)]
```

**Mnémo** :

- **Local au projet** : Les compétences suivent le projet, la collaboration d'équipe sans souci
- **Installation globale** : Les outils génériques sont placés globalement, tous les projets peuvent les utiliser

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[lister les compétences installées](../list-skills/)**.
>
> Vous apprendrez :
> - Comment voir toutes les compétences installées
> - Comprendre la signification des étiquettes d'emplacement des compétences
> - Comment compter le nombre de compétences de projet et de compétences globales
> - Comment filtrer les compétences par emplacement

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Détermination de l'emplacement d'installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| Utilitaires de chemin de répertoire | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L7-L25) | 7-25 |
| Affichage de la liste des compétences | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts#L20-L43) | 20-43 |

**Constantes clés** :
- `.claude/skills` : Répertoire de compétences par défaut (compatible avec Claude Code)
- `.agent/skills` : Répertoire de compétences génériques (environnement multi-agent)

**Fonctions clés** :
- `getSkillsDir(projectLocal, universal)` : Retourne le chemin du répertoire des compétences selon les drapeaux
- `getSearchDirs()` : Retourne la liste des répertoires de recherche de compétences (classés par priorité)
- `listSkills()` : Liste toutes les compétences installées, affiche les étiquettes d'emplacement

**Règles métier** :
- Installation par défaut locale au projet (`!options.global`)
- Priorité de recherche des compétences : local au projet > global
- La commande `list` affiche les étiquettes `(project)` et `(global)`

</details>
