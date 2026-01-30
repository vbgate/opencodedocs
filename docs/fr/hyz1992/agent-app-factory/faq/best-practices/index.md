---
title: "Guide des meilleures pratiques d'AI App Factory : description produit, points de contrôle, portée et développement itératif | Tutoriel"
sidebarTitle: "Meilleures pratiques"
subtitle: "Meilleures pratiques : description claire, utilisation des points de contrôle, contrôle de la portée et techniques d'itération"
description: "Maîtrisez les meilleures pratiques d'AI App Factory pour améliorer la qualité et l'efficacité des applications générées par l'IA. Apprenez à rédiger des descriptions produits claires, à utiliser les points de contrôle pour garantir la qualité, à définir les non-objectifs pour éviter l'expansion de la portée, à valider vos idées par itérations successives, à diviser les sessions pour économiser des tokens, et à gérer les échecs et réessais. Ce tutoriel couvre six compétences clés : qualité des entrées, validation des points de contrôle, contrôle MVP, développement itératif, optimisation du contexte et gestion des échecs."
tags:
  - "Meilleures pratiques"
  - "MVP"
  - "Développement itératif"
prerequisite:
  - "start-getting-started"
  - "start-pipeline-overview"
order: 200
---

# Meilleures pratiques : description claire, utilisation des points de contrôle, contrôle de la portée et techniques d'itération

## Ce que vous pourrez faire après ce cours

Après avoir terminé ce cours, vous maîtriserez :
- Comment rédiger des descriptions produits de haute qualité pour que l'IA comprenne vos idées
- Comment utiliser le mécanisme des points de contrôle pour contrôler la qualité de sortie de chaque étape
- Comment définir des limites de portée claires grâce aux non-objectifs pour éviter l'expansion du projet
- Comment valider rapidement vos idées et optimiser continuellement par itérations successives

## Votre situation actuelle

Avez-vous rencontré ces situations :
- "J'ai été très clair, pourquoi le résultat n'est pas ce que je veux ?"
- "Un endroit ne me satisfait pas, tout le reste est faux, c'est pénible à corriger"
- "Au fur et à mesure, il y a de plus en plus de fonctionnalités, impossible de terminer"
- "Je veux tout faire en une fois, mais au final rien n'est fait"

## Quand utiliser cette technique

Que vous utilisiez AI App Factory pour la première fois ou que vous ayez déjà de l'expérience, ces meilleures pratiques vous aideront à :
- **Améliorer la qualité de sortie** : rendre l'application générée plus conforme aux attentes
- **Économiser du temps de modification** : éviter l'accumulation d'erreurs, détecter tôt les problèmes
- **Contrôler l'échelle du projet** : se concentrer sur le MVP, livrer rapidement
- **Réduire les coûts de développement** : valider par étapes, éviter les investissements inutiles

## 🎒 Préparatifs

::: warning Prérequis
- Avoir lu [Démarrage rapide](../../start/getting-started/) pour comprendre les concepts de base d'AI App Factory
- Avoir lu [Vue d'ensemble du pipeline en 7 étapes](../../start/pipeline-overview/) pour comprendre le processus complet
- Avoir exécuté au moins une fois un pipeline complet (ainsi vous aurez une perception intuitive de la sortie de chaque étape)
:::

## Idées clés

Les meilleures pratiques d'AI App Factory tournent autour de quatre principes fondamentaux :

1. **La qualité des entrées détermine la qualité des sorties** : une description produit claire et détaillée est la première étape vers le succès
2. **Les points de contrôle sont une ligne de défense qualité** : vérifiez attentivement après chaque étape pour éviter l'accumulation d'erreurs
3. **Focus MVP** : définissez clairement les non-objectifs, contrôlez la portée, livrez rapidement les fonctionnalités principales
4. **Itération continue** : validez d'abord l'idée principale, puis étendez progressivement les fonctionnalités

Ces principes sont issus d'un résumé du code source et de l'expérience pratique. En les suivant, votre efficacité de développement augmentera plusieurs fois.

## Suivez-moi

### Technique 1 : Fournir une description produit claire

#### Pourquoi

Lorsque l'IA comprend vos idées, elle ne peut compter que sur les informations textuelles que vous fournissez. Plus la description est claire, plus le résultat généré correspondra aux attentes.

#### Comment faire

**Une bonne description produit comprend les éléments suivants** :
- **Utilisateurs cibles** : qui utilisera ce produit ?
- **Problème central** : quelles difficultés rencontrent les utilisateurs ?
- **Solution** : comment le produit résout-il cette difficulté ?
- **Fonctionnalités clés** : quelles fonctionnalités doivent être incluses ?
- **Scénarios d'utilisation** : dans quelles circonstances les utilisateurs l'utilisent-ils ?
- **Contraintes** : y a-t-il des limitations ou des exigences particulières ?

#### Exemples comparatifs

| ❌ Mauvaise description | ✅ Bonne description |
| --- | --- |
| Faire une application de fitness | Application pour aider les débutants en fitness à enregistrer leurs entraînements, supportant l'enregistrement du type d'exercice, de la durée, des calories brûlées, et l'affichage des statistiques d'entraînement de la semaine. Les utilisateurs cibles sont les jeunes qui commencent le fitness, les fonctionnalités principales sont l'enregistrement rapide et l'affichage des progrès, sans inclure le partage social ou les fonctionnalités payantes |
| Faire une application de comptabilité | Application mobile de comptabilité pour aider les jeunes à enregistrer rapidement leurs dépenses quotidiennes, les fonctionnalités principales sont l'enregistrement du montant, le choix de catégorie (alimentation, transport, divertissement, autre), l'affichage des dépenses totales du mois et des statistiques par catégorie. Supporte l'utilisation hors ligne, les données sont uniquement stockées localement |
| Faire un outil de gestion de tâches | Outil simple pour aider les petites équipes à gérer les tâches, supportant la création de tâches, l'assignation de membres, la définition de dates limite, l'affichage de la liste des tâches. Les membres de l'équipe peuvent partager l'état des tâches. Pas besoin de workflows complexes ou de gestion des permissions |

#### Point de contrôle ✅

- [ ] La description identifie clairement les utilisateurs cibles
- [ ] La description explique le problème central rencontré par les utilisateurs
- [ ] La description énumère les fonctionnalités clés (pas plus de 5)
- [ ] La description inclut des contraintes ou des non-objectifs

---

### Technique 2 : Vérifier attentivement aux points de contrôle

#### Pourquoi

Après chaque étape du pipeline, une pause au point de contrôle attend votre confirmation. C'est une **ligne de défense qualité** qui vous permet de détecter tôt les problèmes et d'éviter leur propagation aux étapes ultérieures.

Si vous détectez un problème à cette étape, il suffit de relancer l'étape actuelle ; si vous ne le découvrez qu'à la fin, vous devrez peut-être faire marche arrière sur plusieurs étapes, perdant ainsi beaucoup de temps et de tokens.

#### Comment faire

**À chaque confirmation de point de contrôle, vérifiez les éléments suivants** :

**Point de contrôle de l'étape Bootstrap** :
- [ ] La définition du problème dans `input/idea.md` est exacte
- [ ] Le profil de l'utilisateur cible est clair et spécifique
- [ ] La proposition de valeur principale est claire
- [ ] Les hypothèses sont raisonnables

**Point de contrôle de l'étape PRD** :
- [ ] Les user stories sont claires, incluent des critères d'acceptation
- [ ] La liste des fonctionnalités ne dépasse pas 7 (principe MVP)
- [ ] Les non-objectifs (Non-Goals) sont clairement énumérés
- [ ] Ne contient pas de détails techniques (comme React, API, base de données)

**Point de contrôle de l'étape UI** :
- [ ] La structure des pages est raisonnable, pas plus de 3 pages
- [ ] Le prototype peut être prévisualisé dans le navigateur
- [ ] Le flux d'interaction est clair
- [ ] Le style esthétique est distinctif (éviter le style IA commun)

**Point de contrôle de l'étape Tech** :
- [ ] Le choix de la pile technologique est raisonnable, conforme au principe MVP
- [ ] La conception du modèle de données est simple, pas plus de 10 tables
- [ ] La liste des points de terminaison API est complète
- [ ] N'introduit pas de microservices, cache, etc. (surconception)

**Point de contrôle de l'étape Code** :
- [ ] La structure du code frontend et backend est complète
- [ ] Inclut des cas de test
- [ ] Pas de type `any` évident
- [ ] Inclut README.md expliquant comment exécuter

**Point de contrôle de l'étape Validation** :
- [ ] Le rapport de validation n'a pas de problèmes de sécurité graves
- [ ] La couverture de test > 60%
- [ ] L'installation des dépendances sans conflit
- [ ] La vérification des types TypeScript réussit

**Point de contrôle de l'étape Preview** :
- [ ] README.md inclut des instructions d'exécution complètes
- [ ] La configuration Docker peut être construite normalement
- [ ] Les services frontend et backend peuvent être démarrés localement
- [ ] Inclut des instructions de configuration des variables d'environnement

#### Processus de confirmation aux points de contrôle

À chaque point de contrôle, le système propose les options suivantes :
- **Continuer** : si la sortie correspond aux attentes, passer à l'étape suivante
- **Réessayer** : si la sortie a des problèmes, fournir des commentaires de modification et relancer l'étape actuelle
- **Suspendre** : si vous avez besoin de plus d'informations ou souhaitez ajuster l'idée, suspendre le pipeline

**Principes de décision** :
- ✅ **Continuer** : tous les éléments de vérification répondent aux exigences
- ⚠️ **Réessayer** : problèmes mineurs (format, omission, détails), peut être corrigé immédiatement
- 🛑 **Suspendre** : problèmes majeurs (mauvaise direction, portée hors contrôle, impossible à corriger), nécessite une nouvelle planification

#### Attention aux pièges

::: danger Erreurs courantes
**Ne sautez pas la confirmation aux points de contrôle pour "terminer rapidement" !**

Le pipeline est conçu avec "pause et confirmation à chaque étape" pour vous permettre de détecter les problèmes à temps. Si vous cliquez habituellement sur "Continuer", et découvrez le problème à la fin, vous devrez peut-être :
- Faire marche arrière sur plusieurs étapes
- Réexécuter beaucoup de travail
- Gaspiller beaucoup de tokens

Rappelez-vous : **le temps investi dans la confirmation des points de contrôle est bien inférieur au coût temporel de la réexécution**.
:::

---

### Technique 3 : Utiliser les non-objectifs pour contrôler la portée

#### Pourquoi

**Les non-objectifs (Non-Goals) sont l'arme clé du développement MVP**. Énumérer clairement "ce que nous ne ferons pas" peut efficacement empêcher l'expansion de la portée.

De nombreux projets échouent non pas à cause de trop peu de fonctionnalités, mais à cause de trop de fonctionnalités. Chaque nouvelle fonctionnalité augmente la complexité, le temps de développement et les coûts de maintenance. Définir des limites claires, se concentrer sur la valeur principale, permet de livrer rapidement.

#### Comment faire

**Dans l'étape Bootstrap, énumérez clairement les non-objectifs** :

```markdown
## Non-objectifs (fonctionnalités non incluses dans cette version)

1. Ne supporte pas la collaboration multi-utilisateur
2. Ne supporte pas la synchronisation en temps réel
3. Ne supporte pas l'intégration de services tiers (comme paiement, cartes)
4. Ne fournit pas de fonctionnalités d'analyse de données ou de rapports
5. Ne contient pas de fonctionnalités de partage social
6. Pas besoin d'authentification utilisateur ou de fonctionnalité de connexion
```

**Dans l'étape PRD, mettez les non-objectifs comme une section indépendante** :

```markdown
## Non-objectifs (clairement non inclus dans cette version)

Les fonctionnalités suivantes ont de la valeur mais ne sont pas dans la portée du MVP actuel :

| Fonctionnalité | Raison | Plan futur |
| --- | --- | --- |
| Collaboration multi-utilisateur | Se concentrer sur les utilisateurs individuels | Considéré pour v2.0 |
| Synchronisation en temps réel | Augmente la complexité technique | Considéré après un fort feedback utilisateur |
| Intégration de paiement | Non essentiel à la valeur principale | Considéré pour v1.5 |
| Analyse de données | Pas nécessaire pour le MVP | Considéré pour v2.0 |
```

#### Critères de jugement des non-objectifs

**Comment juger si quelque chose devrait être un non-objectif** :
- ❌ Cette fonctionnalité n'est pas nécessaire pour valider l'idée principale → comme non-objectif
- ❌ Cette fonctionnalité augmenterait considérablement la complexité technique → comme non-objectif
- ❌ Cette fonctionnalité peut être remplacée par des méthodes manuelles → comme non-objectif
- ✅ Cette fonctionnalité est la raison de l'existence du produit → doit être incluse

#### Attention aux pièges

::: warning Piège de l'expansion de la portée
**Signaux courants d'expansion de la portée** :

1. "C'est très simple, ajoutons-en un en passant..."
2. "Les concurrents ont cette fonctionnalité, nous aussi..."
3. "Les utilisateurs pourraient en avoir besoin, faisons-le d'abord..."
4. "Cette fonctionnalité est intéressante, peut améliorer les points forts du produit..."

**Lorsque vous rencontrez ces idées, posez-vous trois questions** :
1. Cette fonctionnalité est-elle utile pour valider l'idée principale ?
2. Si cette fonctionnalité n'est pas incluse, le produit peut-il encore être utilisé ?
3. Ajouter cette fonctionnalité retardera-t-elle la livraison ?

Si les réponses sont "non nécessaire", "peut être utilisé", "retardera", alors placez-la résolument dans les non-objectifs.
:::

---

### Technique 4 : Itérer progressivement, valider rapidement

#### Pourquoi

**Le concept clé du MVP (Minimum Viable Product) est de valider rapidement les idées**, pas de faire tout parfaitement en une seule fois.

Grâce au développement itératif, vous pouvez :
- Obtenir tôt le feedback des utilisateurs
- Ajuster rapidement la direction
- Réduire les coûts irrécupérables
- Maintenir la motivation de développement

#### Comment faire

**Étapes du développement itératif** :

**Premier tour : validation des fonctionnalités principales**
1. Utiliser AI App Factory pour générer la première version de l'application
2. Inclure uniquement les 3-5 fonctionnalités les plus importantes
3. Exécuter et tester rapidement
4. Présenter le prototype aux utilisateurs réels, collecter le feedback

**Deuxième tour : optimisation basée sur le feedback**
1. Sur la base du feedback des utilisateurs, déterminer les points d'amélioration les plus prioritaires
2. Modifier `input/idea.md` ou `artifacts/prd/prd.md`
3. Utiliser `factory run <stage>` pour réexécuter à partir de l'étape correspondante
4. Générer une nouvelle version et tester

**Troisième tour : extension des fonctionnalités**
1. Évaluer si les objectifs principaux sont atteints
2. Choisir 2-3 fonctionnalités à haute valeur
3. Générer et intégrer via le pipeline
4. Itérer continuellement, améliorer progressivement

#### Exemple pratique d'itération

**Scénario** : vous voulez créer une application de gestion de tâches

**Premier MVP** :
- Fonctionnalités principales : créer des tâches, afficher la liste, marquer comme terminé
- Non-objectifs : gestion des membres, contrôle des permissions, notifications de rappel
- Délai de livraison : 1 jour

**Deuxième optimisation** (basé sur le feedback) :
- Feedback utilisateur : vouloir ajouter des étiquettes aux tâches
- Modifier le PRD, ajouter la fonctionnalité "classification par étiquettes"
- Réexécuter le pipeline à partir de l'étape UI
- Délai de livraison : demi-journée

**Troisième extension** (après validation réussie) :
- Ajouter la fonctionnalité de gestion des membres
- Ajouter les rappels de date limite
- Ajouter la fonctionnalité de commentaires sur les tâches
- Délai de livraison : 2 jours

#### Point de contrôle ✅

Avant chaque itération, vérifiez :
- [ ] La nouvelle fonctionnalité est-elle cohérente avec l'objectif principal
- [ ] La nouvelle fonctionnalité a-t-elle un support de demande utilisateur
- [ ] La nouvelle fonctionnalité augmentera-t-elle considérablement la complexité
- [ ] Y a-t-il des critères d'acceptation clairs

---

## Techniques avancées

### Technique 5 : Utiliser les sous-sessions pour économiser des tokens

#### Pourquoi

L'exécution du pipeline sur une longue période entraîne l'accumulation du contexte, consommant beaucoup de tokens. **L'exécution par sous-sessions** permet à chaque étape d'avoir son propre contexte propre, réduisant considérablement les coûts d'utilisation.

#### Comment faire

**À chaque point de contrôle, choisissez "continuer dans une nouvelle session"** :

```bash
# Exécuter dans une nouvelle fenêtre de ligne de commande
factory continue
```

Le système automatiquement :
1. Lit `.factory/state.json` pour restaurer l'état
2. Démarre une nouvelle fenêtre Claude Code
3. Continue à partir de la prochaine étape à exécuter
4. Charge uniquement les fichiers d'entrée nécessaires à cette étape

**Comparaison** :

| Méthode | Avantages | Inconvénients |
| --- | --- | --- |
| Continuer dans la même session | Simple, pas besoin de changer de fenêtre | Accumulation du contexte, grande consommation de tokens |
| Continuer dans une nouvelle session | Chaque étape a son propre contexte propre, économise des tokens | Besoin de changer de fenêtre |

::: tip Approche recommandée
**Pour les grands projets ou les budgets de tokens limités, l'utilisation de "continuer dans une nouvelle session" est fortement recommandée**.

Pour plus de détails, voir le tutoriel [Optimisation du contexte](../../advanced/context-optimization/).
:::

---

### Technique 6 : Gérer les échecs et réessayer

#### Pourquoi

Pendant l'exécution du pipeline, vous pouvez rencontrer des échecs (entrées insuffisantes, problèmes de permissions, erreurs de code, etc.). Comprendre comment gérer les échecs vous permet de reprendre plus rapidement.

#### Comment faire

**Meilleures pratiques de gestion des échecs** (voir `failure.policy.md:267-274`) :

1. **Échec précoce** : détecter les problèmes tôt, éviter de perdre du temps dans les étapes ultérieures
2. **Journalisation détaillée** : enregistrer suffisamment d'informations de contexte pour faciliter le diagnostic des problèmes
3. **Opérations atomiques** : la sortie de chaque étape doit être atomique, facilitant le retour en arrière
4. **Conserver les preuves** : archiver les produits en échec avant de réessayer, pour faciliter l'analyse comparative
5. **Réessai progressif** : lors du réessai, fournir des orientations plus spécifiques, plutôt que de simplement répéter

**Scénarios d'échec courants** :

| Type d'échec | Symptôme | Solution |
| --- | --- | --- |
| Sortie manquante | `input/idea.md` n'existe pas | Réessayer, vérifier le chemin d'écriture |
| Expansion de la portée | Nombre de fonctionnalités > 7 | Réessayer, demander de simplifier au MVP |
| Erreur technique | Échec de la compilation TypeScript | Vérifier les définitions de type, réessayer |
| Problème de permissions | Agent écrit dans un répertoire non autorisé | Vérifier la matrice des limites de capacité |

**Liste de contrôle de récupération des échecs** :
- [ ] La cause de l'échec est claire
- [ ] La solution a été mise en œuvre
- [ ] La configuration pertinente a été mise à jour
- [ ] Redémarrer à partir de l'étape en échec

::: tip L'échec est normal
**N'ayez pas peur des échecs !** AI App Factory a conçu un mécanisme complet de gestion des échecs :
- Chaque étape permet un réessai automatique
- Les produits en échec sont automatiquement archivés dans `artifacts/_failed/`
- Peut revenir au point de contrôle de succès le plus récent

Lorsque vous rencontrez un échec, analysez calmement la cause et suivez la stratégie de gestion des échecs.
:::

---

## Résumé du cours

Ce cours a présenté les six meilleures pratiques d'AI App Factory :

1. **Description produit claire** : décrire en détail les utilisateurs cibles, le problème central, les fonctionnalités clés et les contraintes
2. **Vérification attentive aux points de contrôle** : vérifier la qualité de la sortie après chaque étape pour éviter l'accumulation d'erreurs
3. **Utiliser les non-objectifs pour contrôler la portée** : énumérer clairement les fonctionnalités non incluses pour éviter l'expansion de la portée
4. **Itération progressive** : valider d'abord l'idée principale, puis étendre progressivement sur la base du feedback utilisateur
5. **Diviser les sessions pour économiser des tokens** : créer une nouvelle session à chaque point de contrôle pour réduire les coûts d'utilisation
6. **Gérer correctement les échecs** : utiliser le mécanisme de gestion des échecs pour reprendre rapidement

En suivant ces meilleures pratiques, votre expérience d'utilisation d'AI App Factory sera plus fluide, la qualité des applications générées sera plus élevée, et votre efficacité de développement augmentera plusieurs fois.

---

## Aperçu du prochain cours

> Dans le prochain cours, nous apprendrons **[Référence des commandes CLI](../../appendix/cli-commands/)**.
>
> Vous apprendrez :
> - Tous les paramètres et options de la commande factory init
> - Comment démarrer la commande factory run à partir d'une étape spécifiée
> - Comment la commande factory continue continue dans une nouvelle session
> - Comment factory status et factory list affichent les informations du projet
> - Comment factory reset réinitialise l'état du projet

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Techniques de description produit | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L186-L210) | 186-210 |
| Mécanisme des points de contrôle | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md#L98-L112) | 98-112 |
| Contrôle des non-objectifs | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L199-L203) | 199-203 |
| Stratégie de gestion des échecs | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md#L267-L274) | 267-274 |
| Isolation du contexte | [`policies/context-isolation.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/context-isolation.md#L10-L42) | 10-42 |
| Normes de code | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | Tout le document |

**Constantes clés** :
- `MAX_RETRY_COUNT = 1` : chaque étape permet par défaut un réessai automatique

**Règles clés** :
- Nombre de fonctionnalités Must Have ≤ 7 (principe MVP)
- Nombre de pages ≤ 3 pages (étape UI)
- Nombre de modèles de données ≤ 10 (étape Tech)
- Couverture de test > 60% (étape Validation)

</details>
