---
title: "Étape 1 : Bootstrap - Structurer l'idée produit | Tutoriel Agent App Factory"
sidebarTitle: "Structurer l'idée produit"
subtitle: "Étape 1 : Bootstrap - Structurer l'idée produit"
description: "Apprenez comment l'étape Bootstrap transforme une idée produit vague en un document input/idea.md clair et structuré. Ce tutoriel couvre les responsabilités du Bootstrap Agent, l'utilisation du superpowers:brainstorm, la structure standard d'idea.md et la checklist de qualité."
tags:
  - "Pipeline"
  - "Bootstrap"
  - "Idée produit"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# Étape 1 : Bootstrap - Structurer l'idée produit

Bootstrap est la première étape du pipeline Agent App Factory, chargée de transformer votre idée produit vague en un document `input/idea.md` clair. C'est le point de départ de toutes les étapes ultérieures (PRD, UI, Tech, etc.) et détermine la direction et la qualité de l'ensemble du projet.

## Ce que vous saurez faire à la fin

- Transformer une idée produit vague en un document `input/idea.md` conforme au modèle standard
- Comprendre les limites de responsabilité du Bootstrap Agent (collecte d'informations uniquement, pas de création de besoins)
- Savoir utiliser le superpowers:brainstorm pour approfondir l'idée produit
- Pouvoir déterminer quelles informations doivent être incluses dans l'étape Bootstrap et lesquelles ne doivent pas l'être

## Votre problème actuel

Vous avez peut-être une idée produit, mais vous la décrivez de manière vague :

- "Je veux faire une application de fitness" (trop général)
- "Faire une application comme Xiaohongshu" (pas de différenciation)
- "Les utilisateurs ont besoin d'un meilleur outil de gestion de tâches" (pas de problème spécifique)

Cette description vague entraîne un manque d'entrées claires pour les étapes ultérieures (PRD, UI, Tech), et l'application générée peut s'écarter complètement de vos attentes.

## Quand utiliser cette méthode

Lorsque vous êtes prêt à démarrer le pipeline et que vous remplissez les conditions suivantes :

1. **Avoir une idée produit préliminaire** (même si ce n'est qu'une phrase)
2. **Ne pas encore avoir commencé à rédiger les spécifications** (PRD aux étapes ultérieures)
3. **Ne pas encore avoir décidé de la stack technique ou du style UI** (ces étapes viendront plus tard)
4. **Vouloir contrôler la portée du produit pour éviter la surconception** (l'étape Bootstrap clarifiera les non-objectifs)

## 🎒 Préparatifs avant de commencer

::: warning Prérequis
Avant de commencer l'étape Bootstrap, assurez-vous de :

- ✅ Avoir terminé [l'initialisation du projet](../../start/init-project/)
- ✅ Avoir compris [l'aperçu du pipeline à 7 étapes](../../start/pipeline-overview/)
- ✅ Avoir installé et configuré votre assistant IA (Claude Code recommandé)
- ✅ Avoir prêt votre idée produit (même si elle est vague)
:::

## Concept fondamental

### Qu'est-ce que l'étape Bootstrap ?

**Bootstrap** est le point de départ de l'ensemble du pipeline, sa seule responsabilité est de **transformer une idée produit fragmentée en un document structuré**.

::: info Pas de gestionnaire de produit
Le Bootstrap Agent n'est pas un gestionnaire de produit, il ne créera pas de besoins ou ne concevra pas de fonctionnalités pour vous. Sa tâche est de :
- Collecter les informations que vous avez fournies
- Organiser et structurer ces informations
- Les présenter selon le modèle standard

Il ne décidera pas "quelles fonctionnalités devraient exister", mais vous aidera à clarifier "ce que vous voulez".
:::

### Pourquoi structurer ?

Imaginez que vous dites au chef : "Je veux manger quelque chose de bon"

- ❌ Description vague : le chef ne peut que deviner et peut préparer un plat que vous ne voulez pas du tout
- ✅ Description structurée : "Je veux un plat épicé du Sichuan sans coriandre, qui se mange bien avec du riz"

L'étape Bootstrap transforme "je veux manger quelque chose de bon" en "plat épicé du Sichuan sans coriandre".

### Structure du document de sortie

L'étape Bootstrap génère `input/idea.md`, contenant les sections suivantes :

| Section | Contenu | Exemple |
|---------|---------|---------|
| **Description brève** | 1-2 phrases résumant le produit | "Une application de comptabilité mobile pour aider les jeunes à enregistrer rapidement leurs dépenses quotidiennes" |
| **Problème** | Le point de douleur central de l'utilisateur | "Les jeunes découvrent à la fin du mois qu'ils ont dépassé leur budget, mais ne savent pas où l'argent est allé" |
| **Utilisateur cible** | Profil d'utilisateur spécifique | "Jeunes de 18-30 ans qui commencent à travailler, compétences techniques moyennes" |
| **Valeur centrale** | Pourquoi c'est précieux | "Enregistrement en 3 secondes, économise 80 % de temps par rapport à la consultation manuelle" |
| **Hypothèses** | 2-4 hypothèses vérifiables | "Les utilisateurs sont prêts à passer 2 minutes à apprendre l'application, si elle aide à contrôler leur budget" |
| **Non-objectifs** | Ce qu'on ne fera PAS explicitement | "Pas de planification budgétaire ni de conseils financiers" |

## Suivez-moi

### Étape 1 : Préparez votre idée produit

Avant de démarrer le pipeline, clarifiez votre idée produit. Ce peut être une description complète ou juste une idée simple.

**Exemple** :
```
Je veux faire une application de fitness pour aider les débutants à enregistrer leurs entraînements, y compris le type d'exercice, la durée, les calories, et voir les statistiques de la semaine.
```

::: tip L'idée peut être grossière
Même une seule phrase suffit, le Bootstrap Agent utilisera le superpowers:brainstorm pour compléter les informations.
:::

### Étape 2 : Démarrez le pipeline à l'étape Bootstrap

Dans le répertoire du projet Factory, exécutez :

```bash
# Démarrer le pipeline (si pas encore démarré)
factory run

# Ou spécifier directement de commencer par bootstrap
factory run bootstrap
```

La CLI affichera l'état actuel et les étapes disponibles.

### Étape 3 : L'assistant IA lit la définition du Bootstrap Agent

L'assistant IA (comme Claude Code) lira automatiquement `agents/bootstrap.agent.md` pour comprendre ses responsabilités et contraintes.

::: info Responsabilités de l'Agent
Le Bootstrap Agent peut uniquement :
- Lire l'idée produit fournie par l'utilisateur dans la conversation
- Écrire dans `input/idea.md`

Il ne peut pas :
- Lire d'autres fichiers
- Écrire dans d'autres répertoires
- Créer de nouveaux besoins
:::

### Étape 4 : Utilisation obligatoire du superpowers:brainstorm

C'est l'étape clé de l'étape Bootstrap. L'assistant IA **doit** d'abord appeler le superpowers:brainstorm, même si vous pensez que l'information est déjà complète.

**Rôle du brainstorm** :
1. **Explorer en profondeur l'essence du problème** : Découvrir les points aveugles de votre description par des questions structurées
2. **Clarifier le profil de l'utilisateur cible** : Aider à clarifier "à qui on s'adresse exactement"
3. **Valider la valeur centrale** : Trouver la différenciation en comparant avec les concurrents
4. **Identifier les hypothèses implicites** : Lister les hypothèses que vous prenez pour acquises mais non vérifiées
5. **Contrôler la portée du produit** : Clarifier les limites par les non-objectifs

**Ce que fera l'assistant IA** :
- Appeler le superpowers:brainstorm
- Fournir votre idée originale
- Vous poser des questions générées par la compétence
- Collecter vos réponses et améliorer l'idée

::: danger Le saut de cette étape sera rejeté
Le planificateur Sisyphus vérifiera si la compétence brainstorm a été utilisée. Si non, la sortie du Bootstrap Agent sera rejetée et l'étape devra être réexécutée.
:::

### Étape 5 : Confirmez le contenu d'idea.md

Une fois le Bootstrap Agent terminé, `input/idea.md` sera généré. Vérifiez attentivement :

**Points de contrôle ✅** :

1. **La description brève** est-elle claire ?
   - ✅ Inclut : quoi faire + pour qui + quel problème résoudre
   - ❌ Trop générale : "Un outil pour améliorer l'efficacité"

2. **La description du problème** est-elle spécifique ?
   - ✅ Inclut : scénario + difficulté + résultat négatif
   - ❌ Trop vague : "L'expérience utilisateur n'est pas bonne"

3. **L'utilisateur cible** est-il clair ?
   - ✅ Profil spécifique (âge/profession/compétences techniques)
   - ❌ Vague : "Tout le monde"

4. **La valeur centrale** est-elle quantifiable ?
   - ✅ Bénéfice spécifique (économise 80 % de temps)
   - ❌ Trop vague : "Améliore l'efficacité"

5. **Les hypothèses** sont-elles vérifiables ?
   - ✅ Vérifiables par recherche utilisateur
   - ❌ Jugement subjectif : "Les utilisateurs aimeront"

6. **Les non-objectifs** sont-ils suffisants ?
   - ✅ Au moins 3 fonctionnalités non incluses listées
   - ❌ Manquants ou insuffisants

### Étape 6 : Choisissez de continuer, réessayer ou mettre en pause

Après confirmation, la CLI affichera les options :

```bash
Choisissez une action :
[1] Continuer (entrer dans l'étape PRD)
[2] Réessayer (régénérer idea.md)
[3] Mettre en pause (continuer plus tard)
```

::: tip Vérifiez d'abord dans l'éditeur de code
Avant de confirmer dans l'assistant IA, ouvrez `input/idea.md` dans votre éditeur de code et vérifiez mot par mot. Une fois dans l'étape PRD, le coût de modification sera plus élevé.
:::

## Éviter les pièges

### Piège 1 : Description d'idée trop vague

**Exemple erroné** :
```
Je veux faire une application de fitness
```

**Conséquence** : Le Bootstrap Agent posera beaucoup de questions via brainstorm pour compléter les informations.

**Conseil** : Décrivez clairement dès le début :
```
Je veux faire une application de fitness mobile pour aider les débutants à enregistrer leurs entraînements, y compris le type d'exercice, la durée, les calories, et voir les statistiques de la semaine.
```

### Piège 2 : Inclusion de détails techniques

**Exemple erroné** :
```
Je veux utiliser React Native, backend Express, base de données Prisma...
```

**Conséquence** : Le Bootstrap Agent rejettera ces contenus (il ne collecte que les idées produit, la stack technique est décidée à l'étape Tech).

**Conseil** : Dites seulement "quoi faire", pas "comment faire".

### Piège 3 : Description de l'utilisateur cible trop vague

**Exemple erroné** :
```
Tous ceux qui ont besoin de fitness
```

**Conséquence** : Les étapes ultérieures ne pourront pas définir clairement la direction de conception.

**Conseil** : Clarifiez le profil :
```
Débutants en fitness de 18-30 ans, commençant l'entraînement systématique, compétences techniques moyennes, veulent un enregistrement simple et voir les statistiques.
```

### Piège 4 : Non-objectifs manquants ou insuffisants

**Exemple erroné** :
```
Non-objectifs : aucun
```

**Conséquence** : Les étapes PRD et Code ultérieures risquent une surconception, augmentant la complexité technique.

**Conseil** : Listez au moins 3 éléments :
```
Non-objectifs :
- Collaboration d'équipe et fonctionnalités sociales (MVP focus individuel)
- Analyse de données complexe et rapports
- Intégration avec des équipements fitness tiers
```

### Piège 5 : Hypothèses non vérifiables

**Exemple erroné** :
```
Hypothèse : Les utilisateurs aimeront notre design
```

**Conséquence** : Impossible de vérifier par recherche utilisateur, l'MVP risque d'échouer.

**Conseil** : Écrivez des hypothèses vérifiables :
```
Hypothèse : Les utilisateurs sont prêts à passer 5 minutes à apprendre l'application, si elle aide à enregistrer systématiquement les entraînements.
```

## Résumé

Le cœur de l'étape Bootstrap est la **structuration** :

1. **Entrée** : Votre idée produit vague
2. **Processus** : L'assistant IA explore en profondeur via superpowers:brainstorm
3. **Sortie** : Un `input/idea.md` conforme au modèle standard
4. **Validation** : Vérifiez si la description est spécifique, l'utilisateur clair, la valeur quantifiable

::: tip Principes clés
- ❌ Ne pas faire : ne pas créer de besoins, ne pas concevoir de fonctionnalités, ne pas décider de la stack technique
- ✅ Faire uniquement : collecter des informations, organiser structurer, présenter selon le modèle
:::

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Étape 2 : PRD - Générer le document de spécifications produit](../stage-prd/)**.
>
> Vous apprendrez :
> - Comment transformer idea.md en PRD de niveau MVP
> - Ce que contient un PRD (histoires utilisateur, liste de fonctionnalités, besoins non fonctionnels)
> - Comment clarifier la portée et les priorités de l'MVP
> - Pourquoi le PRD ne doit pas contenir de détails techniques

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-29

| Fonctionnalité | Chemin du fichier | Lignes |
|----------------|-------------------|--------|
| Définition du Bootstrap Agent | [`agents/bootstrap.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/bootstrap.agent.md) | 1-93 |
| Bootstrap Skill | [`skills/bootstrap/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/bootstrap/skill.md) | 1-433 |
| Définition du pipeline (Étape Bootstrap) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 8-18 |
| Définition de l'orchestrateur | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Contraintes clés** :
- **Utilisation obligatoire de la compétence brainstorm** : bootstrap.agent.md:70-71
- **Interdiction des détails techniques** : bootstrap.agent.md:47
- **Interdiction de fusionner plusieurs idées** : bootstrap.agent.md:48
- **Le fichier de sortie doit être sauvegardé dans input/idea.md** : bootstrap.agent.md:50

**Conditions de sortie** (pipeline.yaml:15-18) :
- idea.md existe
- idea.md décrit une idée produit cohérente
- L'Agent a utilisé la compétence `superpowers:brainstorm` pour une exploration en profondeur

**Cadre de contenu de la Skill** :
- **Cadre de pensée** : extraction vs création, problème prioritaire, concrétisation, validation d'hypothèses
- **Modèles de questions** : sur le problème, l'utilisateur cible, la valeur centrale, les hypothèses MVP, les non-objectifs
- **Techniques d'extraction d'information** : remonter au problème depuis les fonctionnalités, extraire les besoins des plaintes, identifier les hypothèses implicites
- **Checklist de qualité** : exhaustivité, spécificité, cohérence, interdictions
- **Principes de décision** : priorité aux questions, orientation problème, concret supérieur à abstrait, vérifiabilité, contrôle de la portée
- **Traitement de scénarios courants** : utilisateur fournit une seule phrase, décrit beaucoup de fonctionnalités, décrit des concurrents, idées contradictoires
- **Comparaison d'exemples** : mauvais idea.md vs bon idea.md

</details>
