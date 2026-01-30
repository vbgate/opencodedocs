---
title: "Concepts clés : Écosystème de compétences unifié | OpenSkills"
sidebarTitle: "Partager des compétences entre outils IA"
subtitle: "Concepts clés : Écosystème de compétences unifié | OpenSkills"
description: "Apprenez les concepts clés et le fonctionnement d'OpenSkills. En tant que chargeur de compétences unifié, il prend en charge le partage de compétences entre plusieurs agents et permet un chargement progressif."
tags:
  - "Introduction aux concepts"
  - "Concepts clés"
prerequisite: []
order: 2
---

# Qu'est-ce qu'OpenSkills ?

## Ce que vous pourrez faire après ce cours

- Comprendre la valeur fondamentale et le fonctionnement d'OpenSkills
- Connaître la relation entre OpenSkills et Claude Code
- Savoir quand utiliser OpenSkills plutôt que le système de compétences intégré
- Comprendre comment permettre à plusieurs agents de codage IA de partager un écosystème de compétences

::: info Prérequis
Ce tutoriel suppose que vous connaissez les outils de codage IA de base (comme Claude Code, Cursor, etc.), mais ne nécessite aucune expérience préalable avec OpenSkills.
:::

---

## Votre problème actuel

Vous pourriez rencontrer ces scénarios :

- **Les compétences que vous utilisez confortablement dans Claude Code disparaissent lorsque vous changez d'outil IA** : par exemple, les compétences de traitement PDF dans Claude Code ne sont plus disponibles dans Cursor
- **Installation répétée de compétences dans différents outils** : chaque outil IA doit être configuré séparément avec des compétences, ce qui augmente les coûts de gestion
- **Vous souhaitez utiliser des compétences privées, mais le Marketplace officiel ne le prend pas en charge** : les compétences développées en interne ou personnellement ne peuvent pas être facilement partagées avec l'équipe

Ces problèmes sont essentiellement : **le format des compétences n'est pas unifié, ce qui empêche le partage entre outils**.

---

## Idée centrale : unifier le format des compétences

L'idée centrale d'OpenSkills est simple : **transformer le système de compétences de Claude Code en chargeur de compétences universel**.

### Qu'est-ce que c'est

**OpenSkills** est un chargeur universel pour le système de compétences d'Anthropic, permettant à tout agent de codage IA (Claude Code, Cursor, Windsurf, Aider, etc.) d'utiliser des compétences au format SKILL.md standard.

En termes simples : **un installateur qui sert tous les outils de codage IA**.

### Quels problèmes cela résout-il

| Problème | Solution |
|--- | ---|
| Format des compétences non unifié | Utilisation du format SKILL.md standard de Claude Code |
| Impossibilité de partager des compétences entre outils | Génération d'un AGENTS.md unifié, lisible par tous les outils |
| Gestion dispersée des compétences | Commandes unifiées d'installation, de mise à jour et de suppression |
| Difficulté de partage des compétences privées | Prise en charge de l'installation depuis les chemins locaux et les dépôts git privés |

---

## Valeurs fondamentales

OpenSkills offre les valeurs fondamentales suivantes :

### 1. Standard unifié

Tous les agents utilisent le même format de compétences et la description AGENTS.md, sans avoir besoin d'apprendre un nouveau format.

- **Entièrement compatible avec Claude Code** : même format de prompt, même Marketplace, même structure de dossiers
- **SKILL.md standardisé** : définitions de compétences claires, faciles à développer et à maintenir

### 2. Chargement progressif

Chargement des compétences à la demande pour maintenir le contexte IA concis.

- Pas besoin de charger toutes les compétences en une seule fois
- Les agents IA chargent dynamiquement les compétences pertinentes en fonction des besoins de la tâche
- Évite l'explosion du contexte, améliore la qualité des réponses

### 3. Support multi-agents

Un ensemble de compétences pour plusieurs agents, sans installation répétée.

- Claude Code, Cursor, Windsurf, Aider partagent le même ensemble de compétences
- Interface de gestion des compétences unifiée
- Réduit les coûts de configuration et de maintenance

### 4. Amical pour les projets open source

Prend en charge les chemins locaux et les dépôts git privés, idéal pour la collaboration en équipe.

- Installation de compétences depuis le système de fichiers local (en développement)
- Installation depuis des dépôts git privés (partage interne à l'entreprise)
- Les compétences peuvent être gérées par version avec le projet

### 5. Exécution locale

Pas de téléchargement de données, confidentialité garantie.

- Tous les fichiers de compétences sont stockés localement
- Ne dépend pas de services cloud, aucun risque de fuite de données
- Convient aux projets sensibles et aux environnements d'entreprise

---

## Fonctionnement

Le workflow d'OpenSkills est simple, divisé en trois étapes :

### Étape 1 : Installer les compétences

Installez des compétences depuis GitHub, un chemin local ou un dépôt git privé dans votre projet.

```bash
# Installer depuis le dépôt officiel d'Anthropic
openskills install anthropics/skills

# Installer depuis un chemin local
openskills install ./my-skills
```

Les compétences seront installées dans le répertoire `.claude/skills/` du projet (par défaut), ou `.agent/skills/` (lors de l'utilisation de `--universal`).

### Étape 2 : Synchroniser avec AGENTS.md

Synchronisez les compétences installées dans le fichier AGENTS.md pour générer une liste de compétences lisible par les agents IA.

```bash
openskills sync
```

AGENTS.md contiendra du XML similaire à ceci :

```xml
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>
</available_skills>
```

### Étape 3 : L'agent IA charge les compétences

Lorsqu'un agent IA doit utiliser une compétence, il charge le contenu de la compétence via la commande suivante :

```bash
openskills read <skill-name>
```

L'agent IA chargera dynamiquement le contenu de la compétence dans le contexte et exécutera la tâche.

---

## Relation avec Claude Code

OpenSkills et Claude Code sont complémentaires, pas substituables.

### Compatibilité complète des formats

| Aspect | Claude Code | OpenSkills |
|--- | --- | ---|
| **Format de prompt** | XML `<available_skills>` | Même XML |
| **Stockage des compétences** | `.claude/skills/` | `.claude/skills/` (par défaut) |
| **Appel de compétences** | Outil `Skill("name")` | `npx openskills read <name>` |
| **Marketplace** | Marketplace d'Anthropic | GitHub (anthropics/skills) |
| **Chargement progressif** | ✅ | ✅ |

### Comparaison des scénarios d'utilisation

| Scénario | Outil recommandé | Raison |
|--- | --- | ---|
| Utilisation uniquement de Claude Code | Intégré à Claude Code | Pas besoin d'installation supplémentaire, support officiel |
| Utilisation mixte de plusieurs outils IA | OpenSkills | Gestion unifiée, évite les doublons |
| Besoin de compétences privées | OpenSkills | Prend en charge les dépôts locaux et privés |
| Collaboration en équipe | OpenSkills | Les compétences peuvent être gérées par version, faciles à partager |

---

## Explication des emplacements d'installation

OpenSkills prend en charge trois emplacements d'installation :

| Emplacement d'installation | Commande | Scénario applicable |
|--- | --- | ---|
| **Projet local** | Par défaut | Utilisation par un seul projet, compétences gérées par version avec le projet |
| **Installation globale** | `--global` | Tous les projets partagent des compétences courantes |
| **Mode Universal** | `--universal` | Environnement multi-agents, évite les conflits avec Claude Code |

::: tip Quand utiliser le mode Universal ?
Si vous utilisez simultanément Claude Code et d'autres agents de codage IA (comme Cursor, Windsurf), utilisez `--universal` pour installer dans `.agent/skills/`, permettant à plusieurs agents de partager le même ensemble de compétences et d'éviter les conflits.
:::

---

## Écosystème de compétences

OpenSkills utilise le même écosystème de compétences que Claude Code :

### Bibliothèque officielle de compétences

Le dépôt de compétences officiellement maintenu par Anthropic : [anthropics/skills](https://github.com/anthropics/skills)

Inclut des compétences courantes :
- Traitement PDF
- Génération d'images
- Analyse de données
- Et plus encore...

### Compétences communautaires

N'importe quel dépôt GitHub peut servir de source de compétences, à condition de contenir un fichier SKILL.md.

### Compétences personnalisées

Vous pouvez créer vos propres compétences, utiliser le format standard et les partager avec votre équipe.

---

## Résumé du cours

L'idée centrale d'OpenSkills est :

1. **Standard unifié** : Utilisation du format SKILL.md de Claude Code
2. **Support multi-agents** : Permet à tous les outils de codage IA de partager un écosystème de compétences
3. **Chargement progressif** : Chargement à la demande, maintient un contexte concis
4. **Exécution locale** : Pas de téléchargement de données, confidentialité garantie
5. **Amical pour les projets open source** : Prend en charge les dépôts locaux et privés

Avec OpenSkills, vous pouvez :
- Passer de manière transparente entre différents outils IA
- Gérer uniformément toutes les compétences
- Utiliser et partager des compétences privées
- Améliorer l'efficacité du développement

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Installer l'outil OpenSkills](../installation/)**
>
> Vous apprendrez :
> - Comment vérifier les environnements Node.js et Git
> - Installer OpenSkills avec npx ou globalement
> - Vérifier que l'installation a réussi
> - Résoudre les problèmes d'installation courants

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-24

| Fonction | Chemin du fichier | Numéros de ligne |
|--- | --- | ---|
| Définitions de types de base | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L24) | 1-24 |
| Interface de compétence (Skill) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |
| Interface de localisation de compétence (SkillLocation) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L8-L12) | 8-12 |
| Interface d'options d'installation (InstallOptions) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L14-L18) | 14-18 |
| Interface de métadonnées de compétence (SkillMetadata) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L20-L24) | 20-24 |

**Interfaces clés** :
- `Skill` : Informations sur la compétence installée (name, description, location, path)
- `SkillLocation` : Informations sur l'emplacement de recherche de compétences (path, baseDir, source)
- `InstallOptions` : Options de commande d'installation (global, universal, yes)
- `SkillMetadata` : Métadonnées de la compétence (name, description, context)

**Source des concepts clés** :
- README.md:22-86 - Section "What Is OpenSkills?"

</details>
