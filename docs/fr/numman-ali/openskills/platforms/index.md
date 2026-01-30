---
title: "Fonctionnalités de la Plateforme : Commandes Essentielles et Gestion des Skills | OpenSkills"
sidebarTitle: "Maîtriser les Opérations Essentielles"
subtitle: "Fonctionnalités de la Plateforme : Commandes Essentielles et Gestion des Skills | OpenSkills"
description: "Apprenez les fonctionnalités de la plateforme OpenSkills, maîtrisez les opérations essentielles comme les commandes, l'installation, la liste, la mise à jour et la suppression des skills, et comprenez les différences entre la gestion globale et par projet."
order: 2
---

# Fonctionnalités de la Plateforme

Ce chapitre explore en profondeur les commandes essentielles de l'OpenSkills CLI et les fonctionnalités de gestion des skills, vous aidant à passer de "savoir utiliser" à "maîtriser".

## Prérequis

::: warning Veuillez vérifier avant de commencer
Avant d'étudier ce chapitre, assurez-vous d'avoir terminé le chapitre [Démarrage Rapide](../start/), en particulier :
- [Installation d'OpenSkills](../start/installation/) : OpenSkills CLI installé avec succès
- [Installation de votre Premier Skill](../start/first-skill/) : Comprendre le processus d'installation de base des skills
:::

## Contenu de ce Chapitre

Ce chapitre comprend 6 thèmes couvrant toutes les fonctionnalités essentielles d'OpenSkills :

### [Détail des Commandes](./cli-commands/)

Présentation complète des 7 commandes, des paramètres et des options, avec un tableau de référence rapide des commandes. Idéal pour les utilisateurs qui ont besoin de rechercher rapidement l'utilisation des commandes.

### [Sources d'Installation en Détail](./install-sources/)

Explication détaillée des trois sources d'installation : dépôts GitHub, chemins locaux et dépôts Git privés. Les scénarios d'utilisation, le format des commandes et les points d'attention pour chaque méthode.

### [Installation Globale vs Installation Locale par Projet](./global-vs-project/)

Explication des différences entre l'installation `--global` et l'installation par défaut (locale par projet), vous aidant à choisir l'emplacement d'installation approprié et à comprendre les règles de priorité de recherche des skills.

### [Lister les Skills Installés](./list-skills/)

Apprenez à utiliser la commande `list` pour voir les skills installés et comprendre la signification des étiquettes de position `(project)` et `(global)`.

### [Mettre à Jour les Skills](./update-skills/)

Guidez-vous pour utiliser la commande `update` pour actualiser les skills installés, prenant en charge la mise à jour complète et la mise à jour de skills spécifiques, en maintenant la synchronisation des skills avec le dépôt source.

### [Supprimer les Skills](./remove-skills/)

Présentation de deux méthodes de suppression : la commande `manage` interactive et la commande `remove` scriptée, vous aidant à gérer efficacement votre bibliothèque de skills.

## Parcours d'Apprentissage

Selon vos besoins, choisissez le parcours d'apprentissage approprié :

### Parcours A : Apprentissage Systématique (Recommandé pour les Débutants)

Suivez tous les contenus dans l'ordre pour établir un système de connaissances complet :

```
Détail des Commandes → Sources d'Installation → Global vs Projet → Lister les Skills → Mettre à Jour les Skills → Supprimer les Skills
```

### Parcours B : Consultation à la Demande

Accédez directement selon votre tâche actuelle :

| Que voulez-vous faire ? | Lire cet article |
|---|---|
| Trouver l'utilisation d'une commande | [Détail des Commandes](./cli-commands/) |
| Installer un skill depuis un dépôt privé | [Sources d'Installation en Détail](./install-sources/) |
| Décider d'installer en global ou en projet | [Global vs Projet](./global-vs-project/) |
| Voir quels skills sont installés | [Lister les Skills Installés](./list-skills/) |
| Mettre à jour les skills vers la dernière version | [Mettre à Jour les Skills](./update-skills/) |
| Nettoyer les skills inutilisés | [Supprimer les Skills](./remove-skills/) |

## Prochaines Étapes

Après avoir terminé ce chapitre, vous maîtriserez les skills d'utilisation quotidienne d'OpenSkills. Ensuite, vous pouvez :

- **[Fonctionnalités Avancées](../advanced/)** : Apprendre le mode Universal, les chemins de sortie personnalisés, les liens symboliques, la création de skills personnalisés et d'autres fonctionnalités avancées
- **[FAQ](../faq/)** : Consulter la FAQ et le guide de dépannage en cas de problème
