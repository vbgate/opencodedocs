---
title: "Fonctionnalités avancées : Multi-agents et développement de compétences | OpenSkills"
sidebarTitle: "Multi-comptes et compétences personnalisées"
subtitle: "Fonctionnalités avancées : Multi-agents et développement de compétences"
description: "Apprenez les fonctionnalités avancées d'OpenSkills, notamment la configuration d'environnements multi-agents, le développement de compétences personnalisées, l'intégration CI/CD et les mécanismes de sécurité pour gérer efficacement les scénarios complexes."
order: 3
---

# Fonctionnalités avancées

Ce chapitre couvre l'utilisation avancée d'OpenSkills, notamment la configuration d'environnements multi-agents, la sortie personnalisée, le développement de liens symboliques, la création de compétences, l'intégration CI/CD et les mécanismes de sécurité. Une fois ces concepts maîtrisés, vous pourrez gérer efficacement les compétences dans des scénarios complexes et créer votre propre bibliothèque de compétences dédiée.

::: warning Conditions préalables
Avant d'étudier ce chapitre, assurez-vous d'avoir complété :
- [Démarrage rapide](../start/quick-start/) : Comprendre l'installation de base et le processus d'utilisation
- [Installer la première compétence](../start/first-skill/) : Maîtriser les méthodes d'installation de compétences
- [Synchroniser les compétences avec AGENTS.md](../start/sync-to-agents/) : Comprendre le mécanisme de synchronisation des compétences
:::

## Contenu du chapitre

### Multi-agents et configuration de sortie

| Tutoriel | Description |
|--- | ---|
|--- | ---|
|--- | ---|

### Développement de compétences

| Tutoriel | Description |
|--- | ---|
| [Support des liens symboliques](./symlink-support/) | Mettre en œuvre des mises à jour de compétences basées sur git et des flux de travail de développement local via des liens symboliques, partager des compétences entre plusieurs projets |
| [Créer des compétences personnalisées](./create-skills/) | Créer des fichiers de compétence SKILL.md à partir de zéro, maîtriser la spécification YAML frontmatter et la structure de répertoire |
| [Structure des compétences détaillée](./skill-structure/) | Comprendre en profondeur la spécification complète des champs SKILL.md, la conception des ressources references/scripts/assets/ et l'optimisation des performances |

### Automatisation et sécurité

| Tutoriel | Description |
|--- | ---|
|--- | ---|
| [Notes de sécurité](./security/) | Comprendre les mécanismes de protection à trois couches : protection contre le parcours de chemin, traitement sécurisé des liens symboliques, sécurité de l'analyse YAML |

### Guides complets

| Tutoriel | Description |
|--- | ---|
| [Bonnes pratiques](./best-practices/) | Résumé d'expériences sur la configuration de projet, la gestion des compétences et la collaboration d'équipe pour vous aider à utiliser OpenSkills efficacement |

## Recommandations de parcours d'apprentissage

Choisissez le parcours d'apprentissage approprié selon votre scénario d'utilisation :

### Parcours A : Utilisateurs multi-agents

Si vous utilisez simultanément plusieurs outils d'encodage IA (Claude Code + Cursor + Windsurf, etc.) :

```
Mode Universel → Chemin de sortie personnalisé → Bonnes pratiques
```

### Parcours B : Créateurs de compétences

Si vous souhaitez créer vos propres compétences et les partager avec votre équipe :

```
Créer des compétences personnalisées → Structure des compétences détaillée → Support des liens symboliques → Bonnes pratiques
```

### Parcours C : DevOps/Automatisation

Si vous devez intégrer OpenSkills dans les processus CI/CD :

```
Intégration CI/CD → Notes de sécurité → Bonnes pratiques
```

### Parcours D : Apprentissage complet

Si vous souhaitez maîtriser toutes les fonctionnalités avancées de manière exhaustive, suivez cet ordre :

1. [Mode Universel](./universal-mode/) - Bases des environnements multi-agents
2. [Chemin de sortie personnalisé](./custom-output-path/) - Configuration de sortie flexible
3. [Support des liens symboliques](./symlink-support/) - Flux de travail de développement efficace
4. [Créer des compétences personnalisées](./create-skills/) - Introduction à la création de compétences
5. [Structure des compétences détaillée](./skill-structure/) - Compréhension approfondie du format des compétences
6. [Intégration CI/CD](./ci-integration/) - Déploiement automatisé
7. [Notes de sécurité](./security/) - Détails des mécanismes de sécurité
8. [Bonnes pratiques](./best-practices/) - Résumé des expériences

## Prochaines étapes

Après avoir complété ce chapitre, vous pouvez :

- Consulter [Questions fréquentes](../faq/faq/) pour résoudre les problèmes rencontrés lors de l'utilisation
- Référer à [Référence API CLI](../appendix/cli-api/) pour comprendre l'interface de ligne de commande complète
- Lire [Spécification du format AGENTS.md](../appendix/agents-md-format/) pour approfondir la compréhension du format des fichiers générés
- Voir [Journal des modifications](../changelog/changelog/) pour connaître les dernières fonctionnalités et modifications
