---
title: "Phase 2 : PRD - Génération du Document de Spécifications Produit | Tutoriel Agent App Factory"
sidebarTitle: "Générer le Document de Spécifications Produit"
subtitle: "Phase 2 : PRD - Génération du Document de Spécifications Produit"
description: "Apprenez comment la phase PRD transforme une idée de produit structurée en un document de spécifications MVP. Ce tutoriel explique en profondeur les limites de responsabilité de l'Agent PRD, l'utilisation de skills/prd/skill.md, la structure standard de prd.md et le cadre de priorisation MoSCoW, pour vous aider à définir rapidement la portée et les priorités du MVP, et à rédiger des user stories et critères d'acceptation testables."
tags:
  - "Pipeline"
  - "PRD"
  - "Spécifications Produit"
prerequisite:
  - "start-pipeline-overview"
  - "advanced-stage-bootstrap"
order: 90
---

# Phase 2 : PRD - Génération du Document de Spécifications Produit

La phase PRD est la deuxième étape du pipeline Agent App Factory, responsable de transformer `input/idea.md` en un document de spécifications produit complet orienté MVP (Produit Minimum Viable). Cette phase clarifie les utilisateurs cibles, les fonctionnalités essentielles, la portée du MVP et les éléments hors scope, fournissant des directives claires pour la conception UI et l'architecture technique ultérieures.

## Ce que vous apprendrez

- Transformer `input/idea.md` en un document `artifacts/prd/prd.md` conforme au modèle standard
- Comprendre les limites de responsabilité de l'Agent PRD (définir les besoins uniquement, sans impliquer la mise en œuvre technique)
- Maîtriser le cadre de priorisation des fonctionnalités MoSCoW pour garantir que le MVP se concentre sur la valeur essentielle
- Rédiger des user stories de haute qualité et des critères d'acceptation vérifiables
- Savoir ce qui doit figurer dans le PRD et ce qui doit être reporté aux phases ultérieures

## Vos difficultés actuelles

Vous avez peut-être une idée de produit claire (phase Bootstrap terminée), mais vous rencontrez des difficultés pour la transformer en document de spécifications :

- "Je ne sais pas quelles fonctionnalités inclure, j'ai peur d'oublier des éléments ou de surconcevoir"
- "Il y a beaucoup de fonctionnalités, mais je ne sais pas lesquelles sont indispensables pour le MVP"
- "Mes user stories ne sont pas claires, l'équipe de développement ne comprend pas"
- "J'ai involontairement mélangé les détails de mise en œuvre technique avec les besoins, entraînant un débordement de la portée"

Un PRD peu clair entraînera une conception UI et un développement de code sans directives précises, et l'application finale pourrait s'écarter de vos attentes ou inclure une complexité inutile.

## Quand utiliser cette méthode

Lorsque la phase Bootstrap est terminée et que les conditions suivantes sont remplies :

1. **La structuration de idea.md est terminée** (sortie de la phase Bootstrap)
2. **La conception UI ou l'architecture technique n'a pas encore commencé** (cela viendra dans les phases ultérieures)
3. **Vous souhaitez clarifier la portée du MVP** (éviter la surconception des fonctionnalités)
4. **Vous avez besoin de directives claires pour le développement et la conception** (user stories, critères d'acceptation)

## 🎒 Préparatifs avant de commencer

::: warning Prérequis
Avant de commencer la phase PRD, assurez-vous de :

- ✅ Avoir terminé [l'initialisation du projet](../../start/init-project/)
- ✅ Avoir compris [l'aperçu du pipeline en 7 phases](../../start/pipeline-overview/)
- ✅ Avoir terminé la [phase Bootstrap](../stage-bootstrap/) et généré `input/idea.md`
- ✅ Avoir installé et configuré l'assistant IA (Claude Code recommandé)
:::

## Idée centrale

### Qu'est-ce que la phase PRD ?

**PRD** (Product Requirements Document, Document de Spécifications Produit) a pour responsabilité principale de **définir QUOI faire, pas COMMENT le faire**.

::: info Ce n'est pas un document technique
L'Agent PRD n'est pas un architecte ou un designer UI, il ne décidera pas pour vous :
- ❌ Quelle stack technique utiliser (React vs Vue, Express vs Koa)
- ❌ Comment concevoir la base de données (structure des tables, index)
- ❌ Les détails de mise en page et d'interaction UI (position des boutons, palette de couleurs)

Sa mission est :
- ✅ Définir les utilisateurs cibles et leurs points de douleur
- ✅ Lister les fonctionnalités essentielles et leurs priorités
- ✅ Clarifier la portée du MVP et les éléments hors scope
- ✅ Fournir des user stories et critères d'acceptation testables
:::

### Pourquoi un PRD ?

Imaginez que vous dites à une équipe de construction : "Je veux construire une maison"

- ❌ Sans plans : L'équipe ne peut que deviner, et pourrait construire une maison où vous ne voudriez pas vivre
- ✅ Avec des plans détaillés : Nombre de pièces clair, disposition fonctionnelle, exigences matérielles, l'équipe suit les plans

La phase PRD transforme "Je veux construire une maison" en plans détaillés : "Trois chambres, deux salons, chambre principale orientée sud, cuisine ouverte".

### Cadre de priorisation MoSCoW

La phase PRD utilise le **cadre MoSCoW** pour classer les fonctionnalités, garantissant que le MVP se concentre sur la valeur essentielle :

| Catégorie | Définition | Critère de jugement | Exemple |
| --- | --- | --- | --- |
| **Must Have** | Fonctionnalités indispensables pour le MVP | Sans elles, le produit ne peut pas livrer sa valeur essentielle | Application de comptabilité : ajouter une dépense, voir la liste des dépenses |
| **Should Have** | Fonctionnalités importantes mais non bloquantes | Les utilisateurs sentiront leur absence, mais une solution temporaire est possible | Application de comptabilité : exporter des rapports, statistiques par catégorie |
| **Could Have** | Fonctionnalités qui ajoutent du confort | N'affectent pas l'expérience essentielle, les utilisateurs ne remarqueront pas leur absence | Application de comptabilité : alertes de budget, support multi-devises |
| **Won't Have** | Fonctionnalités explicitement exclues | Sans rapport avec la valeur essentielle ou complexité technique élevée | Application de comptabilité : partage social, conseils d'investissement |

::: tip Cœur du MVP
Les fonctionnalités Must Have doivent être limitées à 5-7 maximum, garantissant que le MVP se concentre sur la valeur essentielle et évite le débordement de la portée.
:::

## Suivez-moi

### Étape 1 : Confirmer que la phase Bootstrap est terminée

Avant de commencer la phase PRD, assurez-vous que `input/idea.md` existe et que son contenu est conforme au standard.

```bash
# Vérifier si idea.md existe
cat input/idea.md
```

**Vous devriez voir** : Un document structuré contenant des sections comme description succincte, problème, utilisateurs cibles, valeur essentielle, hypothèses, éléments hors scope.

::: tip Si idea.md n'est pas conforme au standard
Retournez à la [phase Bootstrap](../stage-bootstrap/) pour le régénérer, ou éditez-le manuellement pour compléter les informations.
:::

### Étape 2 : Lancer le pipeline jusqu'à la phase PRD

Dans le répertoire du projet Factory, exécutez :

```bash
# Si le pipeline est déjà lancé, continuez jusqu'à la phase PRD
factory run prd

# Ou lancez le pipeline depuis le début
factory run
```

Le CLI affichera l'état actuel et les phases disponibles, et générera les instructions d'aide pour l'Agent PRD.

### Étape 3 : L'assistant IA lit la définition de l'Agent PRD

L'assistant IA (comme Claude Code) lira automatiquement `agents/prd.agent.md` pour comprendre ses responsabilités et contraintes.

::: info Responsabilités de l'Agent PRD
L'Agent PRD peut uniquement :
- Lire `input/idea.md`
- Écrire `artifacts/prd/prd.md`
- Utiliser les cadres de réflexion et principes de décision de `skills/prd/skill.md`

Il ne peut pas :
- Discuter de détails de mise en œuvre technique ou de conception UI
- Lire d'autres fichiers (y compris les produits en amont)
- Écrire dans d'autres répertoires
:::

### Étape 4 : Charger skills/prd/skill.md

L'Agent PRD chargera `skills/prd/skill.md` pour obtenir les directives suivantes :

**Cadre de réflexion** :
- Utilisateurs cibles : Qui utilisera ? Contexte, rôle, points de douleur ?
- Problème essentiel : Quel problème fondamental le produit résout-il ?
- Valeur essentielle : Pourquoi cette solution a-t-elle de la valeur ? Quels sont les avantages par rapport aux concurrents ?
- Indicateurs de succès : Comment mesurer le succès ?

**Priorisation des fonctionnalités MoSCoW** :
- Must Have (Doit avoir) : Fonctionnalités indispensables pour le MVP
- Should Have (Devrait avoir) : Fonctionnalités importantes mais non bloquantes
- Could Have (Pourrait avoir) : Fonctionnalités qui ajoutent du confort
- Won't Have (N'aura pas) : Fonctionnalités explicitement exclues

**Guide de rédaction des user stories** :
```
En tant que [rôle/type d'utilisateur]
Je veux [fonctionnalité/action]
Afin de [valeur métier/objectif]
```

**Exigences de structure du document PRD** (8 sections) :
1. Vue d'ensemble
2. Profil des utilisateurs cibles
3. Proposition de valeur essentielle
4. Besoins fonctionnels (classification MoSCoW)
5. Parcours utilisateur
6. Éléments hors scope (Won't Have)
7. Indicateurs de succès
8. Hypothèses et risques

### Étape 5 : Générer le document PRD

L'assistant IA générera un document PRD complet basé sur le contenu de `input/idea.md`, en utilisant les cadres de réflexion et principes de décision des compétences.

**Ce que fera l'Agent PRD** :
1. Lire `input/idea.md` et extraire les éléments clés (utilisateurs cibles, problème, valeur essentielle, etc.)
2. Classer les fonctionnalités selon le cadre MoSCoW
3. Rédiger des user stories et critères d'acceptation pour les fonctionnalités Must Have
4. Lister les éléments hors scope pour éviter le débordement de la portée
5. Fournir des indicateurs de succès quantifiables
6. Écrire le document organisé dans `artifacts/prd/prd.md`

::: tip Contrainte clé
L'Agent PRD interdit de discuter des détails de mise en œuvre technique ou de conception UI. S'il détecte ce contenu, l'Agent PRD refusera d'écrire.
:::

### Étape 6 : Confirmer le contenu de prd.md

Une fois l'Agent PRD terminé, il générera `artifacts/prd/prd.md`. Vous devez le vérifier attentivement :

**Points de vérification ✅** :

1. **Les utilisateurs cibles** sont-ils spécifiques ?
   - ✅ Profil concret (âge/profession/compétences techniques/contexte d'utilisation/points de douleur)
   - ❌ Flou : "Tout le monde" ou "Les gens qui ont besoin de tenir des comptes"

2. **Le problème essentiel** est-il clair ?
   - ✅ Décrit les difficultés rencontrées par les utilisateurs dans des scénarios réels
   - ❌ Vague : "Mauvaise expérience utilisateur"

3. **La valeur essentielle** est-elle quantifiable ?
   - ✅ Avantages concrets (économiser 80% du temps, améliorer l'efficacité de 50%)
   - ❌ Vague : "Améliorer l'efficacité", "Meilleure expérience"

4. **Les fonctionnalités Must Have** sont-elles ciblées ?
   - ✅ Pas plus de 5-7 fonctionnalités essentielles
   - ❌ Trop de fonctionnalités ou inclusion de fonctionnalités secondaires

5. **Chaque fonctionnalité Must Have** a-t-elle une user story ?
   - ✅ Utilise le format standard (En tant que... Je veux... Afin de...)
   - ❌ User story manquante ou format incorrect

6. **Les critères d'acceptation** sont-ils vérifiables ?
   - ✅ Standards vérifiables concrets (peut saisir un montant, s'affiche dans la liste)
   - ❌ Flou ("Convivial", "Expérience fluide")

7. **Should Have** et **Won't Have** sont-ils clairement listés ?
   - ✅ Should Have marqué comme "itération future" avec explication
   - ✅ Won't Have explique pourquoi c'est exclu
   - ❌ Manquant ou insuffisant

8. **Les indicateurs de succès** sont-ils quantifiables ?
   - ✅ Valeurs concrètes (taux de rétention > 30%, temps de complétion de tâche < 30 secondes)
   - ❌ Flou ("Les utilisateurs aiment", "Bonne expérience")

9. **Les hypothèses** sont-elles vérifiables ?
   - ✅ Peut être validé par des études utilisateur
   - ❌ Jugement subjectif ("Les utilisateurs aimeront")

10. **Contient-il des détails de mise en œuvre technique ou de conception UI ?**
    - ✅ Pas de détails techniques ni de descriptions UI
    - ❌ Inclut le choix de stack technique, conception de base de données, mise en page UI, etc.

### Étape 7 : Choisir de continuer, réessayer ou mettre en pause

Après confirmation, le CLI affichera les options :

```bash
Veuillez choisir une action :
[1] Continuer (passer à la phase UI)
[2] Réessayer (régénérer prd.md)
[3] Mettre en pause (continuer plus tard)
```

::: tip Conseil : Vérifiez d'abord dans l'éditeur de code
Avant de confirmer dans l'assistant IA, ouvrez d'abord `artifacts/prd/prd.md` dans l'éditeur de code et vérifiez mot par mot. Une fois entré dans la phase UI, le coût des modifications sera plus élevé.
:::

## Pièges à éviter

### Piège 1 : Trop de fonctionnalités Must Have

**Exemple d'erreur** :
```
Must Have :
1. Ajouter un enregistrement de dépense
2. Voir la liste des dépenses
3. Exporter des rapports
4. Statistiques par catégorie
5. Alertes de budget
6. Support multi-devises
7. Partage social
8. Conseils d'investissement
```

**Conséquence** : Portée du MVP trop large, cycle de développement long, risques élevés.

**Recommandation** : Limitez à 5-7 fonctionnalités essentielles :
```
Must Have :
1. Ajouter un enregistrement de dépense
2. Voir la liste des dépenses
3. Sélectionner une catégorie de dépense

Should Have (itération future) :
4. Exporter des rapports
5. Statistiques par catégorie

Won't Have (explicitement exclu) :
6. Partage social (sans rapport avec la valeur essentielle)
7. Conseils d'investissement (nécessite des qualifications professionnelles, complexité technique élevée)
```

### Piège 2 : User stories manquantes ou format incorrect

**Exemple d'erreur** :
```
Fonctionnalité : Ajouter un enregistrement de dépense
Description : L'utilisateur peut ajouter un enregistrement de dépense
```

**Conséquence** : L'équipe de développement ne sait pas pour qui et quel problème résoudre.

**Recommandation** : Utilisez le format standard :
```
Fonctionnalité : Ajouter un enregistrement de dépense
User story : En tant qu'utilisateur conscient de mon budget
Je veux enregistrer chaque dépense
Afin de comprendre où va mon argent et contrôler mon budget

Critères d'acceptation :
- Peut saisir le montant et la description de la dépense
- Peut sélectionner une catégorie de dépense
- L'enregistrement s'affiche immédiatement dans la liste des dépenses
- Affiche la date et l'heure actuelles
```

### Piège 3 : Critères d'acceptation non vérifiables

**Exemple d'erreur** :
```
Critères d'acceptation :
- Interface utilisateur conviviale
- Opérations fluides
- Bonne expérience
```

**Conséquence** : Impossible à tester, l'équipe de développement ne sait pas ce qui constitue "convivial", "fluide", "bon".

**Recommandation** : Rédigez des standards vérifiables concrets :
```
Critères d'acceptation :
- Peut saisir le montant et la description de la dépense
- Peut choisir parmi 10 catégories prédéfinies
- L'enregistrement s'affiche dans la liste des dépenses en moins d'une seconde
- Enregistre automatiquement la date et l'heure actuelles
```

### Piège 4 : Description des utilisateurs cibles trop générale

**Exemple d'erreur** :
```
Utilisateurs cibles : Tous ceux qui ont besoin de tenir des comptes
```

**Conséquence** : La conception UI et l'architecture technique ultérieures ne peuvent pas avoir de direction claire.

**Recommandation** : Profil précis :
```
Groupe d'utilisateurs principal :
- Rôle : Jeunes adultes de 18-30 ans qui commencent à travailler
- Âge : 18-30 ans
- Compétences techniques : Intermédiaires, familiers avec les applications mobiles
- Contexte d'utilisation : Enregistrer immédiatement après une dépense quotidienne, consulter les statistiques en fin de mois
- Points de douleur : Découvrir un dépassement de budget en fin de mois sans savoir où est parti l'argent, pas de contrôle de budget
```

### Piège 5 : Éléments hors scope manquants ou insuffisants

**Exemple d'erreur** :
```
Éléments hors scope : Aucun
```

**Conséquence** : Les phases PRD et Code ultérieures peuvent surconcevoir, augmentant la complexité technique.

**Recommandation** : Listez au moins 3 éléments :
```
Éléments hors scope (Out of Scope) :
- Fonctionnalité de partage social (MVP concentré sur la comptabilité personnelle)
- Conseils financiers et analyse d'investissement (nécessite des qualifications professionnelles, dépasse la valeur essentielle)
- Intégration avec des systèmes financiers tiers (complexité technique élevée, non nécessaire pour le MVP)
- Analyse de données et rapports complexes (Should Have, itération future)
```

### Piège 6 : Inclusion de détails de mise en œuvre technique

**Exemple d'erreur** :
```
Fonctionnalité : Ajouter un enregistrement de dépense
Mise en œuvre technique : Utiliser React Hook Form pour gérer le formulaire, point d'API POST /api/expenses
```

**Conséquence** : L'Agent PRD refusera ce contenu (définit uniquement les besoins, sans impliquer la mise en œuvre technique).

**Recommandation** : Dites seulement "QUOI faire", pas "COMMENT le faire" :
```
Fonctionnalité : Ajouter un enregistrement de dépense
User story : En tant qu'utilisateur conscient de mon budget
Je veux enregistrer chaque dépense
Afin de comprendre où va mon argent et contrôler mon budget

Critères d'acceptation :
- Peut saisir le montant et la description de la dépense
- Peut sélectionner une catégorie de dépense
- L'enregistrement s'affiche immédiatement dans la liste des dépenses
- Affiche la date et l'heure actuelles
```

### Piège 7 : Indicateurs de succès non quantifiables

**Exemple d'erreur** :
```
Indicateurs de succès :
- Les utilisateurs aiment notre application
- Expérience fluide
- Rétention élevée des utilisateurs
```

**Conséquence** : Impossible de mesurer si le produit est un succès.

**Recommandation** : Rédigez des indicateurs quantifiables :
```
Indicateurs de succès :
Objectifs produit :
- Obtenir 100 utilisateurs actifs le premier mois
- Les utilisateurs utilisent l'application au moins 3 fois par semaine
- Taux d'utilisation des fonctionnalités essentielles (ajouter une dépense) > 80%

KPIs clés :
- Taux de rétention utilisateur : rétention à 7 jours > 30%, rétention à 30 jours > 15%
- Taux d'utilisation des fonctionnalités essentielles : ajouter une dépense > 80%
- Temps de complétion de tâche : ajouter une dépense < 30 secondes

Méthodes de validation :
- Enregistrer les comportements utilisateur via les logs backend
- Utiliser des tests A/B pour valider la rétention utilisateur
- Collecter la satisfaction via des questionnaires de feedback utilisateur
```

### Piège 8 : Hypothèses non vérifiables

**Exemple d'erreur** :
```
Hypothèse : Les utilisateurs aimeront notre design
```

**Conséquence** : Impossible de valider par des études utilisateur, le MVP pourrait échouer.

**Recommandation** : Rédigez des hypothèses vérifiables :
```
Hypothèses :
Hypothèses de marché :
- Les jeunes (18-30 ans) ont le point de douleur de "ne pas savoir où est parti l'argent"
- Les applications de comptabilité existantes sont trop complexes, les jeunes ont besoin d'une solution plus simple

Hypothèses de comportement utilisateur :
- Les utilisateurs sont prêts à consacrer 2 minutes à enregistrer une dépense après chaque achat, si cela aide à contrôler le budget
- Les utilisateurs préfèrent une UI minimaliste, n'ayant pas besoin de graphiques et analyses complexes

Hypothèses de faisabilité technique :
- Une application mobile peut réaliser un processus de comptabilité rapide en 3 étapes
- Le stockage hors ligne peut répondre aux besoins de base
```

## Résumé de cette leçon

Le cœur de la phase PRD est **définir les besoins, pas la mise en œuvre** :

1. **Entrée** : `input/idea.md` structuré (sortie de la phase Bootstrap)
2. **Processus** : L'assistant IA utilise les cadres de réflexion de `skills/prd/skill.md` et le cadre de priorisation MoSCoW
3. **Sortie** : Document complet `artifacts/prd/prd.md`
4. **Validation** : Vérifier si les utilisateurs sont clairs, la valeur est quantifiable, les fonctionnalités sont ciblées, absence de détails techniques

::: tip Principe clé
- ❌ Ce qu'on ne fait pas : Ne pas discuter de la mise en œuvre technique, ne pas concevoir la mise en page UI, ne pas décider de la structure de la base de données
- ✅ Ce qu'on fait uniquement : Définir les utilisateurs cibles, lister les fonctionnalités essentielles, clarifier la portée du MVP, fournir des user stories testables
:::

## Aperçu de la prochaine leçon

> La prochaine leçon couvre la **[Phase 3 : UI - Conception de l'interface et prototypage](../stage-ui/)**.
>
> Vous apprendrez :
> - Comment concevoir la structure UI basée sur le PRD
> - Comment utiliser la compétence ui-ux-pro-max pour générer un système de design
> - Comment générer des prototypes HTML visualisables
> - Les fichiers de sortie et conditions de sortie de la phase UI

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Fonctionnalité | Chemin du fichier | Numéro de ligne |
| --- | --- | --- |
| Définition de l'Agent PRD | [`agents/prd.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/prd.agent.md) | 1-33 |
| Compétence PRD | [`skills/prd/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/prd/skill.md) | 1-325 |
| Définition du pipeline (phase PRD) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 20-33 |
| Définition de l'orchestrateur | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Contraintes clés** :
- **Interdiction des détails de mise en œuvre technique** : prd.agent.md:23
- **Interdiction des descriptions de conception UI** : prd.agent.md:23
- **Doit inclure les utilisateurs cibles** : pipeline.yaml:29
- **Doit définir la portée du MVP** : pipeline.yaml:30
- **Doit lister les éléments hors scope** : pipeline.yaml:31
- **Le fichier de sortie doit être sauvegardé dans artifacts/prd/prd.md** : prd.agent.md:13

**Conditions de sortie** (pipeline.yaml:28-32) :
- Le PRD contient les utilisateurs cibles
- Le PRD définit la portée du MVP
- Le PRD liste les éléments hors scope (Out of Scope)
- Le PRD ne contient aucun détail de mise en œuvre technique

**Cadre de contenu des compétences** :
- **Cadre de réflexion** : Utilisateurs cibles, Problème essentiel, Valeur essentielle, Indicateurs de succès
- **Cadre de priorisation MoSCoW** : Must Have, Should Have, Could Have, Won't Have
- **Guide de rédaction des user stories** : Format standard et exemples
- **Exigences de structure du document PRD** : 8 sections requises
- **Principes de décision** : Centré sur l'utilisateur, Focus sur le MVP, Éléments hors scope clairs, Testabilité
- **Liste de contrôle qualité** : Utilisateurs et problèmes, Portée des fonctionnalités, User stories, Intégrité du document, Vérification des interdictions
- **À NE JAMAIS FAIRE (NEVER)** : 7 comportements explicitement interdits

**Sections requises du document PRD** :
1. Vue d'ensemble (Vue d'ensemble du produit, Contexte et objectifs)
2. Profil des utilisateurs cibles (Groupe d'utilisateurs principal, Groupe d'utilisateurs secondaire)
3. Proposition de valeur essentielle (Problème résolu, Notre solution, Avantage différenciant)
4. Besoins fonctionnels (Must Have, Should Have, Could Have)
5. Parcours utilisateur (Description du flux principal)
6. Éléments hors scope (Won't Have)
7. Indicateurs de succès (Objectifs produit, KPIs clés, Méthodes de validation)
8. Hypothèses et risques (Hypothèses de marché, Hypothèses de comportement utilisateur, Hypothèses de faisabilité technique, Tableau des risques)

</details>
