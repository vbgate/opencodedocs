---
title: "Fonctionnalités de la Plateforme: Découverte, Recherche et Chargement de Compétences | opencode-agent-skills"
sidebarTitle: "Maîtriser les Six Fonctionnalités des Compétences"
subtitle: "Fonctionnalités de la Plateforme: Découverte, Recherche et Chargement de Compétences | opencode-agent-skills"
description: "Apprenez les modules de fonctionnalités principales d'opencode-agent-skills, y compris la découverte, la recherche, le chargement et la recommandation automatique de compétences. Maîtrisez les fonctionnalités principales de l'extension en 10 minutes."
order: 2
---

# Fonctionnalités de la Plateforme

Ce chapitre explique en profondeur les modules de fonctionnalités principales d'OpenCode Agent Skills, y compris la découverte, la recherche, le chargement, la recommandation automatique, l'exécution de scripts et la lecture de fichiers de compétences. Une fois ces fonctionnalités maîtrisées, vous pourrez exploiter pleinement les capacités de gestion des compétences de l'extension, permettant à l'IA de servir plus efficacement votre travail de développement.

## Prérequis

::: warning À vérifier avant de commencer
Avant de suivre ce chapitre, assurez-vous d'avoir complété :

- [Installation d'OpenCode Agent Skills](../start/installation/) - L'extension est correctement installée et opérationnelle
- [Créer votre première compétence](../start/creating-your-first-skill/) - Comprendre la structure de base des compétences
:::

## Contenu du Chapitre

| Cours | Description | Outils Principaux |
|--- | --- | ---|
| [Mécanisme de Découverte de Compétences](./skill-discovery-mechanism/) | Comprendre à partir de quels emplacements l'extension découvre automatiquement les compétences et maîtriser les règles de priorité | - |
| [Recherche et Liste des Compétences Disponibles](./listing-available-skills/) | Utiliser l'outil `get_available_skills` pour rechercher et filtrer les compétences | `get_available_skills` |
| [Chargement de Compétences dans le Contexte de Session](./loading-skills-into-context/) | Utiliser l'outil `use_skill` pour charger des compétences et comprendre le mécanisme d'injection XML | `use_skill` |
| [Recommandation Automatique de Compétences](./automatic-skill-matching/) | Comprendre le principe du correspondance sémantique pour permettre à l'IA de découvrir automatiquement les compétences pertinentes | - |
| [Exécution de Scripts de Compétences](./executing-skill-scripts/) | Utiliser l'outil `run_skill_script` pour exécuter des scripts d'automatisation | `run_skill_script` |
| [Lecture de Fichiers de Compétences](./reading-skill-files/) | Utiliser l'outil `read_skill_file` pour accéder aux fichiers de support des compétences | `read_skill_file` |

## Parcours d'Apprentissage

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Ordre d'Apprentissage Recommandé                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Mécanisme de Découverte  ──→  2. Liste des Compétences  ──→  3. Chargement de Compétences   │
│         │                     │                    │                    │
│         │                     │                    │                    │
│         ▼                     ▼                    ▼                    │
│   Comprendre d'où viennent    Apprendre à chercher   Maîtriser la méthode   │
│   les compétences            les compétences      de chargement          │
│                                                                         │
│                              │                                          │
│                              ▼                                          │
│                                                                         │
│   4. Recommandation Automatique  ←──  5. Exécution de Scripts  ←──  6. Lecture de Fichiers       │
│         │                    │                  │                       │
│         ▼                    ▼                  ▼                       │
│   Comprendre la correspondance   Exécuter l'automatisation   Accéder aux fichiers   │
│   intelligente                                      de support              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Il est recommandé de suivre l'ordre séquentiellement** :

1. **D'abord apprendre le mécanisme de découverte** - Comprendre d'où proviennent les compétences et comment la priorité est déterminée
2. **Ensuite apprendre à rechercher des compétences** - Maîtriser l'utilisation de l'outil `get_available_skills`
3. **Puis apprendre à charger des compétences** - Comprendre `use_skill` et le mécanisme d'injection XML
4. **Ensuite apprendre la recommandation automatique** - Comprendre comment fonctionne la correspondance sémantique (optionnel, plus théorique)
5. **Enfin apprendre les scripts et les fichiers** - Ce sont des fonctionnalités avancées, à apprendre selon vos besoins

::: tip Parcours de Démarrage Rapide
Si vous souhaitez simplement l'utiliser rapidement, vous pouvez vous concentrer uniquement sur les trois premiers cours (découverte → recherche → chargement), et compléter les autres selon vos besoins.
:::

## Prochaines Étapes

Après avoir complété ce chapitre, vous pouvez continuer à apprendre :

- [Fonctionnalités Avancées](../advanced/) - Découvrez en profondeur la compatibilité Claude Code, l'intégration Superpowers, les priorités d'espaces de noms et autres sujets avancés
- [Questions Fréquentes](../faq/) - Consultez le dépannage et les instructions de sécurité en cas de problème
- [Annexe](../appendix/) - Consultez la référence API et les meilleures pratiques
