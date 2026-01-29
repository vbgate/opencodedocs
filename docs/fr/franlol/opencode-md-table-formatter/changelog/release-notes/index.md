---
title: "Journal des modifications : Historique des versions | opencode-md-table-formatter"
sidebarTitle: "Aperçu des changements de version"
subtitle: "Journal des modifications : Historique des versions et enregistrement des modifications"
description: "Découvrez l'évolution des versions et les nouvelles fonctionnalités d'opencode-md-table-formatter. Consultez les fonctionnalités de v0.1.0, y compris le formatage automatique et le cache de largeur."
tags:
  - "changelog"
  - "version-history"
  - "release-notes"
prerequisite: []
order: 90
---

# Journal des modifications : Historique des versions et enregistrement des modifications

::: info Ce que vous saurez faire
- Suivre l'évolution des versions du plugin
- Comprendre les nouvelles fonctionnalités et corrections de chaque version
- Maîtriser les limitations connues et les détails techniques
- Comprendre les améliorations futures possibles
:::

---

## [0.1.0] - 2025-01-07

### Nouvelles fonctionnalités

Il s'agit de la **version initiale** d'opencode-md-table-formatter, qui inclut les fonctionnalités principales suivantes :

- **Formatage automatique de tableaux** : Formate automatiquement les tableaux Markdown générés par l'IA via le hook `experimental.text.complete`
- **Prise en charge du mode caché** : Traite correctement les symboles Markdown masqués (comme `**`, `*`) lors du calcul de la largeur
- **Traitement du Markdown imbriqué** : Prend en charge la syntaxe Markdown imbriquée à n'importe quelle profondeur, utilisant un algorithme de suppression en plusieurs passes
- **Protection des blocs de code** : Les symboles Markdown dans le code en ligne (`` `code` ``) restent sous forme littérale et ne participent pas au calcul de la largeur
- **Prise en charge de l'alignement** : Prend en charge l'alignement à gauche (`---` ou `:---`), centré (`:---:`) et à droite (`---:`)
- **Optimisation du cache de largeur** : Met en cache les résultats de calcul de la largeur d'affichage des chaînes pour améliorer les performances
- **Validation des tableaux invalides** : Valide automatiquement la structure des tableaux, les tableaux invalides reçoivent un commentaire d'erreur
- **Prise en charge multi-caractères** : Prend en charge les emoji, les caractères Unicode, les cellules vides et le contenu très long
- **Gestion silencieuse des erreurs** : Un échec du formatage n'interrompt pas le flux de travail OpenCode

### Détails techniques

Cette version contient environ **230 lignes de code TypeScript prêt pour la production** :

- **12 fonctions** : Responsabilités claires, séparation bien définie
- **Sécurité des types** : Utilisation correcte de l'interface `Hooks`
- **Nettoyage intelligent du cache** : Déclenché lorsque le nombre d'opérations dépasse 100 ou le nombre d'entrées de cache dépasse 1000
- **Traitement regex en plusieurs passes** : Prend en charge la suppression de symboles Markdown imbriqués à n'importe quelle profondeur

::: tip Mécanisme de cache
Le cache est conçu pour optimiser le calcul de la largeur du contenu répétitif. Par exemple, lorsque le même texte de cellule apparaît plusieurs fois dans un tableau, la largeur n'est calculée qu'une seule fois, les lectures suivantes provenant directement du cache.
:::

### Limitations connues

Cette version ne prend pas en charge les scénarios suivants :

- **Tableaux HTML** : Prend uniquement en charge les tableaux Markdown de type Pipe Table
- **Cellules multilignes** : Ne prend pas en charge les cellules contenant des balises `<br>`
- **Tableaux sans ligne de séparation** : Les tableaux doivent inclure une ligne de séparation (`|---|`) pour être formatés
- **Exigences de dépendance** : Nécessite `@opencode-ai/plugin` >= 0.13.7 (utilise le hook non documenté `experimental.text.complete`)

::: info Exigences de version
Le plugin nécessite OpenCode >= 1.0.137 et `@opencode-ai/plugin` >= 0.13.7 pour fonctionner correctement.
:::

---

## Plans futurs

Les fonctionnalités suivantes sont prévues pour les versions futures :

- **Options de configuration** : Prise en charge de la personnalisation des largeurs de colonnes minimales/maximales, désactivation de fonctionnalités spécifiques
- **Prise en charge des tableaux sans en-tête** : Formatage des tableaux sans ligne d'en-tête
- **Optimisation des performances** : Analyse et optimisation des performances pour les très grands tableaux (100+ lignes)
- **Plus d'options d'alignement** : Extension de la syntaxe et des fonctionnalités d'alignement

::: tip Contribuer
Si vous avez des suggestions de fonctionnalités ou souhaitez contribuer du code, n'hésitez pas à proposer vos idées sur [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues).
:::

---

## Format du journal des modifications

Le journal des modifications de ce projet suit le format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), et les numéros de version suivent les [Spécifications de version sémantique (Semantic Versioning)](https://semver.org/spec/v2.0.0.html).

**Format du numéro de version** : `MAJOR.MINOR.PATCH`

- **MAJOR** : Modifications de l'API incompatibles
- **MINOR** : Nouvelles fonctionnalités rétrocompatibles
- **PATCH** : Corrections de bogues rétrocompatibles

**Types de modifications** :

- **Added** : Nouvelles fonctionnalités
- **Changed** : Modifications des fonctionnalités existantes
- **Deprecated** : Fonctionnalités qui seront bientôt supprimées
- **Removed** : Fonctionnalités supprimées
- **Fixed** : Corrections de problèmes
- **Security** : Corrections liées à la sécurité

---

## Ordre de lecture recommandé

Si vous êtes un nouvel utilisateur, nous vous recommandons d'apprendre dans l'ordre suivant :

1. [Démarrage rapide : Installation et configuration](../../start/getting-started/) — Prise en main rapide
2. [Aperçu des fonctionnalités : La magie du formatage automatique](../../start/features/) — Comprendre les fonctionnalités principales
3. [FAQ : Que faire si le tableau n'est pas formaté](../../faq/troubleshooting/) — Dépannage
4. [Limitations connues : Quelles sont les limites du plugin](../../appendix/limitations/) — Comprendre les limitations
