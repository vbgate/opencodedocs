---
title: "Mode Ultrawork : Activer toutes les fonctionnalités"
sidebarTitle: "Mode Ultrawork"
subtitle: "Mode Ultrawork : Activer toutes les fonctionnalités avec une seule commande"
description: "Découvrez le mode Ultrawork d'oh-my-opencode pour activer toutes les fonctionnalités avec une seule commande. Active les agents parallèles, l'achèvement forcé et le système Category + Skills."
tags:
  - "ultrawork"
  - "tâches d'arrière-plan"
  - "collaboration d'agents"
prerequisite:
  - "start-installation"
  - "start-sisyphus-orchestrator"
order: 30
---

# Mode Ultrawork : Activer toutes les fonctionnalités avec une seule commande

## Ce que vous allez apprendre

- Activer toutes les fonctionnalités avancées d'oh-my-opencode avec une seule commande
- Faire travailler plusieurs agents IA en parallèle comme une véritable équipe
- Éviter de configurer manuellement plusieurs agents et tâches d'arrière-plan
- Comprendre la philosophie de conception et les meilleures pratiques du mode Ultrawork

## Vos défis actuels

Vous avez peut-être rencontré ces situations lors du développement :

- **Trop de fonctionnalités, ne savez pas comment les utiliser** : Vous avez 10 agents spécialisés, des tâches d'arrière-plan, des outils LSP, mais ne savez pas comment les activer rapidement
- **Configuration manuelle requise** : Chaque tâche complexe nécessite de spécifier manuellement les agents, la concurrence d'arrière-plan et autres paramètres
- **Collaboration d'agents inefficace** : Appel d'agents en série, gaspillage de temps et de coûts
- **Tâches bloquées à mi-chemin** : Les agents n'ont pas assez de motivation et de contraintes pour terminer les tâches

Tout cela affecte votre capacité à libérer la véritable puissance d'oh-my-opencode.

## Concept de base

**Le Mode Ultrawork** est le mécanisme "activer tout en un clic" d'oh-my-opencode.

::: info Qu'est-ce que le Mode Ultrawork ?
Le Mode Ultrawork est un mode de travail spécial déclenché par un mot-clé. Lorsque votre invite contient `ultrawork` ou son abréviation `ulw`, le système active automatiquement toutes les fonctionnalités avancées : tâches d'arrière-plan parallèles, exploration approfondie, achèvement forcé, collaboration multi-agents, et plus encore.
:::

### Philosophie de conception

Le mode Ultrawork repose sur les principes fondamentaux suivants (tirés du [Manifeste Ultrawork](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md)) :

| Principe | Description |
|-----------|-------------|
| **L'intervention humaine est un signal d'échec** | Si vous devez constamment corriger la sortie de l'IA, cela signifie qu'il y a un problème avec la conception du système |
| **Code indiscernable** | Le code écrit par l'IA doit être indiscernable du code écrit par des ingénieurs seniors |
| **Minimiser la charge cognitive** | Vous devez seulement dire "quoi faire", les agents sont responsables du "comment faire" |
| **Prévisible, cohérent, délégable** | Les agents doivent être aussi stables et fiables qu'un compilateur |

### Mécanisme d'activation

Lorsque le système détecte le mot-clé `ultrawork` ou `ulw` :

1. **Définir le mode de précision maximale** : `message.variant = "max"`
2. **Afficher la notification Toast** : "Mode Ultrawork Activé - Précision maximale engagée. Tous les agents à votre disposition."
3. **Injecter des instructions complètes** : Injecter 200+ lignes d'instructions ULTRAWORK aux agents, notamment :
   - Exiger 100% de certitude avant de commencer l'implémentation
   - Exiger l'utilisation parallèle de tâches d'arrière-plan
   - Forcer l'utilisation du système Category + Skills
   - Forcer la vérification d'achèvement (workflow TDD)
   - Interdire toute excuse "je ne peux pas le faire"

## Suivez le guide

### Étape 1 : Déclencher le Mode Ultrawork

Entrez une invite contenant le mot-clé `ultrawork` ou `ulw` dans OpenCode :

```
ultrawork développer une API REST
```

Ou plus simplement :

```
ulw ajouter l'authentification utilisateur
```

**Vous devriez voir** :
- Une notification Toast apparaît sur l'interface : "Mode Ultrawork Activé"
- La réponse de l'agent commence par "ULTRAWORK MODE ENABLED!"

### Étape 2 : Observer les changements de comportement des agents

Après avoir activé le mode Ultrawork, les agents vont :

1. **Exploration parallèle de la base de code**
   ```
   delegate_task(agent="explore", prompt="trouver les modèles API existants", background=true)
   delegate_task(agent="explore", prompt="trouver l'infrastructure de test", background=true)
   delegate_task(agent="librarian", prompt="trouver les meilleures pratiques d'authentification", background=true)
   ```

2. **Appeler l'agent Plan pour créer un plan de travail**
   ```
   delegate_task(subagent_type="plan", prompt="créer un plan détaillé basé sur le contexte rassemblé")
   ```

3. **Utiliser Category + Skills pour exécuter les tâches**
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"], ...)
   ```

**Vous devriez voir** :
- Plusieurs tâches d'arrière-plan s'exécutant simultanément
- Des agents appelant activement des agents spécialisés (Oracle, Librarian, Explore)
- Des plans de test complets et une décomposition du travail
- Les tâches continuent de s'exécuter jusqu'à 100% d'achèvement

### Étape 3 : Vérifier l'achèvement des tâches

Une fois les agents terminés, ils vont :

1. **Afficher afficher les preuves de vérification** : Sortie de test réelle, descriptions de vérification manuelle
2. **Confirmer que tous les TODO sont terminés** : Ne déclarent pas l'achèvement prématurément
3. **Résumer le travail effectué** : Lister ce qui a été fait et pourquoi

**Vous devriez voir** :
- Des résultats de test clairs (pas "devrait fonctionner")
- Tous les problèmes résolus
- Aucune liste de TODO inachevée

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, confirmez :

- [ ] Vous voyez une notification Toast après avoir entré `ulw`
- [ ] La réponse de l'agent commence par "ULTRAWORK MODE ENABLED!"
- [ ] Vous observez des tâches d'arrière-plan parallèles en cours d'exécution
- [ ] Les agents utilisent le système Category + Skills
- [ ] Il y a des preuves de vérification après l'achèvement des tâches

Si un élément échoue, vérifiez :
- L'orthographe du mot-clé est-elle correcte (`ultrawork` ou `ulw`)
- Êtes-vous dans la session principale (les tâches d'arrière-plan ne déclencheront pas le mode)
- Le fichier de configuration est-il activé avec les fonctionnalités pertinentes

## Quand utiliser cette technique

| Scénario | Utiliser Ultrawork | Mode normal |
|----------|--------------|-------------|
| **Nouvelles fonctionnalités complexes** | ✅ Recommandé (nécessite une collaboration multi-agents) | ❌ Peut ne pas être assez efficace |
| **Corrections urgentes** | ✅ Recommandé (nécessite un diagnostic rapide et une exploration) | ❌ Peut manquer de contexte |
| **Modifications simples** | ❌ Excessif (gaspille des ressources) | ✅ Plus adapté |
| **Validation rapide d'idée** | ❌ Excessif | ✅ Plus adapté |

**Règle empirique** :
- La tâche implique plusieurs modules ou systèmes → Utilisez `ulw`
- Besoin d'une recherche approfondie de la base de code → Utilisez `ulw`
- Besoin d'appeler plusieurs agents spécialisés → Utilisez `ulw`
- Modification simple d'un seul fichier → Pas besoin de `ulw`

## Pièges courants

::: warning Notes importantes

**1. N'utilisez pas `ulw` dans chaque invite**

Le mode Ultrawork injecte une grande quantité d'instructions, ce qui est excessif pour les tâches simples. Utilisez-le uniquement pour les tâches complexes qui nécessitent véritablement une collaboration multi-agents, une exploration parallèle et une analyse approfondie.

**2. Les tâches d'arrière-plan ne déclenchent pas le mode Ultrawork**

Le détecteur de mots-clés ignore les sessions d'arrière-plan pour éviter d'injecter incorrectement le mode dans les sous-agents. Le mode Ultrawork ne fonctionne que dans la session principale.

**3. Assurez-vous que la configuration Provider est correcte**

Le mode Ultrawork repose sur plusieurs modèles IA travaillant en parallèle. Si certains Providers ne sont pas configurés ou indisponibles, les agents peuvent ne pas être en mesure d'appeler des agents spécialisés.
:::

## Résumé de la leçon

Le mode Ultrawork atteint l'objectif de conception "activer toutes les fonctionnalités avec une seule commande" grâce au déclenchement par mot-clé :

- **Facile à utiliser** : Entrez simplement `ulw` pour activer
- **Collaboration automatique** : Les agents appellent automatiquement d'autres agents et exécutent des tâches d'arrière-plan en parallèle
- **Achèvement forcé** : Le mécanisme de vérification complète garantit 100% d'achèvement
- **Zéro configuration** : Pas besoin de définir manuellement les priorités des agents, les limites de concurrence, etc.

Rappelez-vous : le mode Ultrawork est conçu pour faire travailler les agents comme une véritable équipe. Vous devez seulement exprimer l'intention, les agents sont responsables de l'exécution.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Configuration Provider](../../platforms/provider-setup/)**.
>
> Vous apprendrez :
> - Comment configurer plusieurs Providers comme Anthropic, OpenAI, Google
> - Comment la stratégie multi-modèles dégrade automatiquement et sélectionne les modèles optimaux
> - Comment tester les connexions Provider et l'utilisation des quotas

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-26

| Fonctionnalité | Chemin du fichier | Numéros de ligne |
|---------|-----------|--------------|
| Philosophie de conception Ultrawork | [`docs/ultrawork-manifesto.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) | 1-198 |
| Hook détecteur de mots-clés | [`src/hooks/keyword-detector/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/index.ts) | 12-100 |
| Modèle d'instruction ULTRAWORK | [`src/hooks/keyword-detector/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/constants.ts) | 54-280 |
| Logique de détection de mots-clés | [`src/hooks/keyword-detector/detector.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/detector.ts) | 26-53 |

**Constantes clés** :
- `KEYWORD_DETECTORS` : Configuration du détecteur de mots-clés, incluant trois modes : ultrawork, search, analyze
- `CODE_BLOCK_PATTERN` : Motif regex de bloc de code, utilisé pour filtrer les mots-clés dans les blocs de code
- `INLINE_CODE_PATTERN` : Motif regex de code en ligne, utilisé pour filtrer les mots-clés dans le code en ligne

**Fonctions clés** :
- `createKeywordDetectorHook()` : Crée le Hook détecteur de mots-clés, écoute l'événement UserPromptSubmit
- `detectKeywordsWithType()` : Détecte les mots-clés dans le texte et retourne le type (ultrawork/search/analyze)
- `getUltraworkMessage()` : Génère les instructions complètes du mode ULTRAWORK (sélectionne Planner ou mode normal selon le type d'agent)
- `removeCodeBlocks()` : Supprime les blocs de code du texte pour éviter de déclencher des mots-clés dans les blocs de code

**Règles métier** :
| ID de règle | Description de la règle | Tag |
|---------|------------------|-----|
| BR-4.8.4-1 | Activer le mode Ultrawork lorsque "ultrawork" ou "ulw" est détecté | [Fact] |
| BR-4.8.4-2 | Le mode Ultrawork définit `message.variant = "max"` | [Fact] |
| BR-4.8.4-3 | Le mode Ultrawork affiche la notification Toast : "Mode Ultrawork Activé" | [Fact] |
| BR-4.8.4-4 | Les sessions de tâches d'arrière-plan ignorent la détection de mots-clés pour éviter l'injection de mode | [Fact] |
| BR-4.8.4-5 | Les sessions non principales n'autorisent que le mot-clé ultrawork, bloquant l'injection d'autres modes | [Fact] |

</details>
