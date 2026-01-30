---
title: "Avancé : Pipeline et mécanismes internes | Tutoriel AI App Factory"
sidebarTitle: "Avancé : Pipeline"
subtitle: "Avancé : Pipeline et mécanismes internes"
description: "Découvrez en profondeur le pipeline en 7 étapes de l'AI App Factory, le planificateur Sisyphus, les mécanismes de sécurité et les stratégies de gestion des échecs. Maîtrisez l'optimisation du contexte et les techniques de configuration avancée."
tags:
  - "Pipeline"
  - "Planificateur"
  - "Sécurité des permissions"
  - "Gestion des échecs"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# Avancé : Pipeline et mécanismes internes

Ce chapitre explique en détail les mécanismes de base et les fonctionnalités avancées de l'AI App Factory, notamment le fonctionnement détaillé du pipeline en 7 étapes, les stratégies de planification du planificateur Sisyphus, les mécanismes de permissions et de sécurité, les stratégies de gestion des échecs, ainsi que l'optimisation du contexte pour économiser les coûts en tokens.

::: warning Prérequis
Avant d'étudier ce chapitre, assurez-vous d'avoir terminé :
- [Démarrage rapide](../../start/getting-started/) et [Installation et configuration](../../start/installation/)
- [Vue d'ensemble du pipeline en 7 étapes](../../start/pipeline-overview/)
- [Intégration de plateforme](../../platforms/claude-code/) configuration
:::

## Contenu du chapitre

Ce chapitre couvre les sujets suivants :

### Explication détaillée du pipeline en 7 étapes

- **[Étape 1 : Bootstrap - Structurez l'idée produit](stage-bootstrap/)**
  - Apprenez à transformer une idée produit floue en document structuré
  - Comprenez les formats d'entrée et de sortie du Bootstrap Agent

- **[Étape 2 : PRD - Générez le document de spécifications produit](stage-prd/)**
  - Générez un PRD de niveau MVP, incluant les user stories, la liste des fonctionnalités et les non-objectifs
  - Maîtrisez les techniques de décomposition des exigences et de priorisation

- **[Étape 3 : UI - Concevez l'interface et le prototype](stage-ui/)**
  - Utilisez la compétence ui-ux-pro-max pour concevoir la structure UI et le prototype prévisualisable
  - Comprenez le processus de conception d'interface et les meilleures pratiques

- **[Étape 4 : Tech - Concevez l'architecture technique](stage-tech/)**
  - Concevez l'architecture technique minimale viable et le modèle de données Prisma
  - Maîtrisez les principes de sélection technologique et de conception architecturale

- **[Étape 5 : Code - Générez du code exécutable](stage-code/)**
  - Générez le code frontend et backend, les tests et la configuration à partir du schéma UI et de la conception Tech
  - Comprenez le processus de génération de code et le système de templates

- **[Étape 6 : Validation - Validez la qualité du code](stage-validation/)**
  - Validez l'installation des dépendances, la vérification des types, le schéma Prisma et la qualité du code
  - Maîtrisez le processus automatisé de vérification de qualité

- **[Étape 7 : Preview - Générez le guide de déploiement](stage-preview/)**
  - Générez la documentation complète des instructions d'exécution et la configuration de déploiement
  - Apprenez l'intégration CI/CD et la configuration des Git Hooks

### Mécanismes internes

- **[Explication détaillée du planificateur Sisyphus](orchestrator/)**
  - Comprenez comment le planificateur coordonne le pipeline, gère les états et effectue les vérifications de permissions
  - Maîtrisez les stratégies de planification et les principes de la machine à états

- **[Optimisation du contexte : Exécution par sessions](context-optimization/)**
  - Apprenez à utiliser la commande `factory continue` pour économiser des tokens
  - Maîtrisez les meilleures pratiques pour créer de nouvelles sessions à chaque étape

- **[Mécanismes de permissions et de sécurité](security-permissions/)**
  - Comprenez la matrice des limites de capacités, le traitement des dépassements de permissions et les mécanismes de vérification de sécurité
  - Maîtrisez la configuration de sécurité et la gestion des permissions

- **[Gestion des échecs et rollback](failure-handling/)**
  - Apprenez l'identification des échecs, les mécanismes de réessai, les stratégies de rollback et les processus d'intervention humaine
  - Maîtrisez les techniques de dépannage et de récupération

## Recommandations pour le parcours d'apprentissage

### Ordre d'apprentissage recommandé

1. **Complétez d'abord le pipeline en 7 étapes** (dans l'ordre)
   - Bootstrap → PRD → UI → Tech → Code → Validation → Preview
   - Chaque étape a des entrées et sorties claires, les étudier dans l'ordre permet d'établir une compréhension complète

2. **Ensuite, étudiez le planificateur et l'optimisation du contexte**
   - Comprenez comment Sisyphus coordonne ces 7 étapes
   - Apprenez à optimiser le contexte pour économiser les coûts en tokens

3. **Enfin, étudiez la sécurité et la gestion des échecs**
   - Maîtrisez les limites de permissions et les mécanismes de sécurité
   - Comprenez les scénarios d'échec et les stratégies de réponse

### Points d'accentuation selon les rôles

| Rôle | Chapitres prioritaires |
| ---- | ---------------------- |
| **Développeur** | Code, Validation, Tech, Orchestrateur |
| **Chef de produit** | Bootstrap, PRD, UI, Preview |
| **Lead technique** | Tech, Code, Sécurité, Gestion des échecs |
| **Ingénieur DevOps** | Validation, Preview, Optimisation du contexte |

## Prochaines étapes

Après avoir terminé ce chapitre, vous pouvez continuer à apprendre :

- **[FAQ et dépannage](../../faq/troubleshooting/)** - Résolvez les problèmes rencontrés lors de l'utilisation
- **[Meilleures pratiques](../../faq/best-practices/)** - Maîtrisez les techniques pour utiliser efficacement la Factory
- **[Référence des commandes CLI](../../appendix/cli-commands/)** - Consultez la liste complète des commandes
- **[Normes de code](../../appendix/code-standards/)** - Découvrez les normes que le code généré doit respecter

---

💡 **Conseil** : Si vous rencontrez des problèmes lors de l'utilisation, consultez d'abord le chapitre [FAQ et dépannage](../../faq/troubleshooting/).
