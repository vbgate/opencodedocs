---
title: "Démarrage Rapide : Prise en Main d'OpenSkills | OpenSkills"
sidebarTitle: "Démarrage en 15 Minutes"
subtitle: "Démarrage Rapide : Prise en Main d'OpenSkills | OpenSkills"
description: "Apprenez les bases d'OpenSkills. En 15 minutes, installez les outils et les compétences pour permettre à votre agent IA d'utiliser de nouvelles compétences et de comprendre leur fonctionnement."
order: 1
---

# Démarrage Rapide

Ce chapitre vous guide pour prendre rapidement en main OpenSkills, de l'installation des outils à l'utilisation des compétences par votre agent IA, en seulement 10 à 15 minutes.

## Parcours d'Apprentissage

Nous vous recommandons de suivre cet ordre d'apprentissage :

### 1. [Démarrage Rapide](./quick-start/)

En 5 minutes, installez les outils, les compétences et synchronisez-les pour découvrir la valeur essentielle d'OpenSkills.

- Installer l'outil OpenSkills
- Installer des compétences depuis le dépôt officiel Anthropic
- Synchroniser les compétences vers AGENTS.md
- Vérifier que l'agent IA peut utiliser les compétences

### 2. [Qu'est-ce qu'OpenSkills ?](./what-is-openskills/)

Comprenez les concepts fondamentaux et le fonctionnement d'OpenSkills.

- La relation entre OpenSkills et Claude Code
- Format de compétences unifié, chargement progressif, support multi-agents
- Quand utiliser OpenSkills plutôt que le système de compétences intégré

### 3. [Guide d'Installation](./installation/)

Les étapes d'installation détaillées et la configuration de l'environnement.

- Vérification de l'environnement Node.js et Git
- Utilisation temporaire via npx vs installation globale
- Résolution des problèmes d'installation courants

### 4. [Installer Votre Première Compétence](./first-skill/)

Installez une compétence depuis le dépôt officiel Anthropic et découvrez la sélection interactive.

- Utiliser la commande `openskills install`
- Sélectionner interactivement les compétences souhaitées
- Comprendre la structure du répertoire des compétences (.claude/skills/)

### 5. [Synchroniser les Compétences vers AGENTS.md](./sync-to-agents/)

Générez le fichier AGENTS.md pour informer votre agent IA des compétences disponibles.

- Utiliser la commande `openskills sync`
- Comprendre le format XML de AGENTS.md
- Sélectionner les compétences à synchroniser pour contrôler la taille du contexte

### 6. [Utiliser les Compétences](./read-skills/)

Découvrez comment l'agent IA charge le contenu des compétences.

- Utiliser la commande `openskills read`
- Les 4 niveaux de priorité de recherche des compétences
- Lire plusieurs compétences simultanément

## Prérequis

Avant de commencer, veuillez vérifier :

- Avoir installé [Node.js](https://nodejs.org/) version 20.6.0 ou supérieure
- Avoir installé [Git](https://git-scm.com/) (nécessaire pour installer des compétences depuis GitHub)
- Avoir installé au moins un agent de codage IA (Claude Code, Cursor, Windsurf, Aider, etc.)

::: tip Vérification Rapide de l'Environnement
```bash
node -v  # Doit afficher v20.6.0 ou supérieur
git -v   # Doit afficher git version x.x.x
```
:::

## Prochaines Étapes

Après avoir terminé ce chapitre, vous pouvez poursuivre avec :

- [Détail des Commandes](../platforms/cli-commands/) : Approfondissez toutes les commandes et leurs paramètres
- [Sources d'Installation Détaillées](../platforms/install-sources/) : Apprenez à installer des compétences depuis GitHub, un chemin local ou un dépôt privé
- [Créer des Compétences Personnalisées](../advanced/create-skills/) : Créez vos propres compétences sur mesure
