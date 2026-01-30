---
title: "Contextes Dynamiques : Injection de Contexts | Everything Claude Code"
sidebarTitle: "Faire comprendre à l'IA votre mode de travail"
subtitle: "Contextes Dynamiques : Injection de Contexts"
description: "Maîtrisez le mécanisme d'injection de contexte dynamique de Claude Code. Apprenez à basculer entre les modes dev, review et research pour optimiser le comportement de l'IA selon vos besoins."
tags:
  - "contexts"
  - "workflow-optimization"
  - "dynamic-prompts"
prerequisite:
  - "start-quick-start"
order: 140
---

# Injection de Contexte Dynamique : Utilisation des Contexts

## Ce que vous apprendrez

Après avoir maîtrisé l'injection de contexte dynamique, vous pourrez :

- Adapter la stratégie comportementale de l'IA selon votre mode de travail actuel (développement, revue, recherche)
- Faire suivre à Claude différentes priorités et préférences d'outils selon les situations
- Éviter la confusion des objectifs au sein d'une même session et améliorer votre concentration
- Optimiser l'efficacité à chaque phase de travail (implémentation rapide vs revue approfondie)

## Vos difficultés actuelles

Avez-vous rencontré ces problèmes lors du développement ?

- **Quand vous voulez développer rapidement**, Claude analyse trop, donne trop de suggestions et ralentit votre progression
- **Lors de la revue de code**, Claude se précipite pour modifier le code au lieu de lire attentivement et identifier les problèmes
- **Lors de recherches**, Claude commence à coder sans avoir bien compris, ce qui mène à des erreurs de direction
- **Dans une même session**, vous alternez entre développement et revue, et le comportement de Claude devient incohérent

La cause profonde de ces problèmes : **Claude n'a pas de signal clair de « mode de travail »**, il ne sait pas quelle devrait être sa priorité actuelle.

## Quand utiliser cette technique

- **Phase de développement** : Faire prioriser l'implémentation des fonctionnalités par l'IA, discussions détaillées ensuite
- **Revue de code** : Faire d'abord bien comprendre à l'IA, puis proposer des améliorations
- **Recherche technique** : Faire d'abord explorer et apprendre à l'IA, puis donner des conclusions
- **Lors d'un changement de mode** : Indiquer clairement à l'IA quel est l'objectif actuel

## Concept clé

Le cœur de l'injection de contexte dynamique est de **donner à l'IA différentes stratégies comportementales selon les modes de travail**.

### Les trois modes de travail

Everything Claude Code propose trois contextes prédéfinis :

| Mode | Fichier | Focus | Priorité | Cas d'usage |
| --- | --- | --- | --- | --- |
| **dev** | `contexts/dev.md` | Implémenter les fonctionnalités, itérer rapidement | D'abord que ça marche, ensuite on améliore | Développement quotidien, nouvelles fonctionnalités |
| **review** | `contexts/review.md` | Qualité du code, sécurité, maintenabilité | D'abord identifier les problèmes, ensuite suggérer des corrections | Code Review, revue de PR |
| **research** | `contexts/research.md` | Comprendre le problème, explorer les solutions | D'abord comprendre, ensuite agir | Recherche technique, analyse de bugs, conception d'architecture |

### Pourquoi avez-vous besoin de contextes dynamiques ?

::: info Contexte vs Prompt système

Le **prompt système** est constitué des instructions fixes chargées au démarrage de Claude Code (comme le contenu des répertoires `agents/` et `rules/`), il définit le comportement de base de l'IA.

Le **contexte** est une instruction temporaire que vous injectez dynamiquement selon votre mode de travail actuel, il remplace ou complète le prompt système pour modifier le comportement de l'IA dans une situation spécifique.

Le prompt système est le « comportement par défaut global », le contexte est la « surcharge contextuelle ».
:::

### Comparaison des modes de travail

Pour une même tâche, voici comment l'IA se comporte différemment selon les modes :

```markdown
### Tâche : Corriger un bug qui empêche la connexion

#### Mode dev (correction rapide)
- Localiser rapidement le problème
- Modifier directement le code
- Exécuter les tests pour vérifier
- D'abord que ça marche, on optimise ensuite

### Mode review (analyse approfondie)
- Lire attentivement le code concerné
- Vérifier les cas limites et la gestion des erreurs
- Évaluer l'impact de la solution
- D'abord identifier les problèmes, ensuite suggérer des corrections

### Mode research (investigation complète)
- Explorer toutes les causes possibles
- Analyser les logs et messages d'erreur
- Valider les hypothèses
- D'abord comprendre la cause racine, ensuite proposer une solution
```

## 🎒 Prérequis

::: warning Conditions préalables

Ce tutoriel suppose que vous avez :

- ✅ Terminé le tutoriel [Démarrage rapide](../../start/quickstart/)
- ✅ Installé le plugin Everything Claude Code
- ✅ Compris les concepts de base de la gestion de session

:::

---

## Suivez le guide : Utiliser les contextes dynamiques

### Étape 1 : Comprendre le fonctionnement des trois contextes

Commençons par comprendre la définition de chaque contexte :

#### dev.md - Mode développement

**Objectif** : Implémenter rapidement les fonctionnalités, d'abord que ça marche, on améliore ensuite

**Priorités** :
1. Get it working (Faire fonctionner)
2. Get it right (Faire correctement)
3. Get it clean (Faire proprement)

**Stratégie comportementale** :
- Write code first, explain after (Écrire le code d'abord, expliquer ensuite)
- Prefer working solutions over perfect solutions (Préférer les solutions fonctionnelles aux solutions parfaites)
- Run tests after changes (Exécuter les tests après les modifications)
- Keep commits atomic (Garder les commits atomiques)

**Outils privilégiés** : Edit, Write (modification de code), Bash (exécution de tests/build), Grep/Glob (recherche de code)

---

#### review.md - Mode revue

**Objectif** : Identifier les problèmes de qualité de code, les failles de sécurité et les problèmes de maintenabilité

**Priorités** : Critical (Critique) > High (Élevé) > Medium (Moyen) > Low (Faible)

**Stratégie comportementale** :
- Read thoroughly before commenting (Lire attentivement avant de commenter)
- Prioritize issues by severity (Prioriser les problèmes par gravité)
- Suggest fixes, don't just point out problems (Suggérer des corrections, pas seulement signaler les problèmes)
- Check for security vulnerabilities (Vérifier les failles de sécurité)

**Checklist de revue** :
- [ ] Logic errors (Erreurs de logique)
- [ ] Edge cases (Cas limites)
- [ ] Error handling (Gestion des erreurs)
- [ ] Security (injection, auth, secrets) (Sécurité)
- [ ] Performance (Performance)
- [ ] Readability (Lisibilité)
- [ ] Test coverage (Couverture de tests)

**Format de sortie** : Groupé par fichier, priorité par gravité

---

#### research.md - Mode recherche

**Objectif** : Comprendre en profondeur le problème, explorer les solutions possibles

**Processus de recherche** :
1. Understand the question (Comprendre la question)
2. Explore relevant code/docs (Explorer le code/documentation pertinents)
3. Form hypothesis (Formuler une hypothèse)
4. Verify with evidence (Vérifier avec des preuves)
5. Summarize findings (Résumer les découvertes)

**Stratégie comportementale** :
- Read widely before concluding (Lire largement avant de conclure)
- Ask clarifying questions (Poser des questions de clarification)
- Document findings as you go (Documenter les découvertes au fur et à mesure)
- Don't write code until understanding is clear (Ne pas écrire de code tant que la compréhension n'est pas claire)

**Outils privilégiés** : Read (comprendre le code), Grep/Glob (rechercher des patterns), WebSearch/WebFetch (documentation externe), Task with Explore agent (questions sur la codebase)

**Format de sortie** : D'abord les découvertes, ensuite les recommandations

---

### Étape 2 : Choisir et appliquer un contexte

Selon votre situation de travail actuelle, choisissez le contexte approprié.

#### Scénario 1 : Implémenter une nouvelle fonctionnalité

**Contexte approprié** : `dev.md`

**Comment l'appliquer** :

```markdown
@contexts/dev.md

Aidez-moi à implémenter la fonctionnalité d'authentification utilisateur :
1. Support de la connexion par email/mot de passe
2. Génération de token JWT
3. Implémentation d'un middleware pour protéger les routes
```

**Comment Claude va se comporter** :
- Implémenter rapidement les fonctionnalités principales
- Ne pas sur-concevoir
- Exécuter les tests après l'implémentation pour vérifier
- Garder les commits atomiques (chaque commit complète une petite fonctionnalité)

**Ce que vous devriez voir** :
- Obtenir rapidement du code fonctionnel
- Tests passants
- Fonctionnalité utilisable, peut-être pas élégante

---

#### Scénario 2 : Revoir la PR d'un collègue

**Contexte approprié** : `review.md`

**Comment l'appliquer** :

```markdown
@contexts/review.md

Veuillez revoir cette PR : https://github.com/your-repo/pull/123

Points à vérifier en priorité :
- Sécurité (injection SQL, XSS, authentification)
- Gestion des erreurs
- Problèmes de performance
```

**Comment Claude va se comporter** :
- Lire d'abord attentivement tout le code concerné
- Classer les problèmes par gravité
- Fournir des suggestions de correction pour chaque problème
- Ne pas modifier directement le code, seulement faire des suggestions

**Ce que vous devriez voir** :
- Un rapport de revue structuré (par fichier, par gravité)
- Chaque problème avec sa localisation précise et une suggestion de correction
- Les problèmes de niveau Critical signalés en priorité

---

#### Scénario 3 : Étudier l'intégration d'une nouvelle technologie

**Contexte approprié** : `research.md`

**Comment l'appliquer** :

```markdown
@contexts/research.md

Je souhaite intégrer ClickHouse comme base de données analytique dans le projet, aidez-moi à étudier :

1. Les avantages et inconvénients de ClickHouse
2. Comment l'intégrer avec notre architecture PostgreSQL existante
3. Stratégie de migration et risques
4. Résultats de benchmarks de performance

Ne pas écrire de code, d'abord bien étudier la solution.
```

**Comment Claude va se comporter** :
- D'abord rechercher la documentation officielle de ClickHouse et les bonnes pratiques
- Lire des cas de migration similaires
- Analyser la compatibilité avec l'architecture existante
- Documenter les découvertes au fur et à mesure de l'exploration
- Finalement donner des recommandations globales

**Ce que vous devriez voir** :
- Une analyse technique comparative détaillée
- Évaluation des risques et recommandations de migration
- Pas de code, seulement des solutions et conclusions

---

### Étape 3 : Changer de contexte dans une même session

Vous pouvez changer dynamiquement de contexte dans une même session pour vous adapter aux différentes phases de travail.

**Exemple : Workflow développement + revue**

```markdown
#### Étape 1 : Implémenter la fonctionnalité (mode dev)
@contexts/dev.md
Implémentez la fonctionnalité de connexion utilisateur avec authentification email/mot de passe.
...
#### Claude implémente rapidement la fonctionnalité

#### Étape 2 : Auto-revue (mode review)
@contexts/review.md
Veuillez revoir le code de connexion que nous venons d'implémenter :
...
#### Claude passe en mode revue, analyse en profondeur la qualité du code
#### Liste les problèmes et suggestions d'amélioration par gravité

#### Étape 3 : Améliorer selon les résultats de la revue (mode dev)
@contexts/dev.md
Selon les commentaires de revue ci-dessus, corrigez les problèmes de niveau Critical et High.
...
#### Claude corrige rapidement les problèmes

#### Étape 4 : Nouvelle revue (mode review)
@contexts/review.md
Revoyez le code après correction.
...
#### Claude vérifie si les problèmes sont résolus
```

**Ce que vous devriez voir** :
- Chaque phase a un focus de travail clair
- Phase de développement : itération rapide
- Phase de revue : analyse approfondie
- Éviter les conflits de comportement dans un même mode

---

### Étape 4 : Créer des contextes personnalisés (optionnel)

Si les trois modes prédéfinis ne répondent pas à vos besoins, vous pouvez créer des contextes personnalisés.

**Format de fichier de contexte** :

```markdown
#### My Custom Context

Mode: [Nom du mode]
Focus: [Point de focus]

## Behavior
- Règle de comportement 1
- Règle de comportement 2

## Priorities
1. Priorité 1
2. Priorité 2

## Tools to favor
- Outils recommandés
```

**Exemple : `debug.md` - Mode débogage**

```markdown
#### Debug Context

Mode: Debugging and troubleshooting
Focus: Root cause analysis and fix

## Behavior
- Start by gathering evidence (logs, error messages, stack traces)
- Form hypothesis before proposing fixes
- Test fixes systematically (control variables)
- Document findings for future reference

## Debug Process
1. Reproduce the issue consistently
2. Gather diagnostic information
3. Narrow down potential causes
4. Test hypotheses
5. Verify the fix works

## Tools to favor
- Read for code inspection
- Bash for running tests and checking logs
- Grep for searching error patterns
```

**Utiliser un contexte personnalisé** :

```markdown
@contexts/debug.md

J'ai rencontré ce problème en production :
[Message d'erreur]
[Logs associés]

Aidez-moi à déboguer.
```

---

## Point de contrôle ✅

Après avoir terminé les étapes ci-dessus, vous devriez :

- [ ] Comprendre le fonctionnement et les cas d'usage des trois contextes prédéfinis
- [ ] Être capable de choisir le contexte approprié selon la situation de travail
- [ ] Savoir changer dynamiquement de contexte dans une session
- [ ] Savoir comment créer des contextes personnalisés
- [ ] Avoir constaté les différences notables de comportement de l'IA selon les contextes

---

## Pièges à éviter

### ❌ Erreur 1 : Ne pas changer de contexte et s'attendre à ce que l'IA s'adapte automatiquement

**Problème** : Dans une même session, alterner entre développement et revue sans indiquer à l'IA l'objectif actuel.

**Symptôme** : Le comportement de Claude devient incohérent, parfois il analyse trop, parfois il modifie le code précipitamment.

**Bonne pratique** :
- Changer explicitement de contexte : `@contexts/dev.md` ou `@contexts/review.md`
- Déclarer l'objectif actuel au début de chaque phase
- Utiliser `## Étape X : [Objectif]` pour clarifier les phases

---

### ❌ Erreur 2 : Utiliser le mode research pour du développement rapide

**Problème** : Avoir besoin d'implémenter une fonctionnalité en 30 minutes, mais utiliser `@contexts/research.md`.

**Symptôme** : Claude passe beaucoup de temps à rechercher, discuter, analyser, et tarde à écrire du code.

**Bonne pratique** :
- Utiliser le mode `dev` pour le développement rapide
- Utiliser le mode `research` pour les recherches approfondies
- Choisir le mode selon la pression temporelle et la complexité de la tâche

---

### ❌ Erreur 3 : Utiliser le mode dev pour revoir du code critique

**Problème** : Revoir du code impliquant la sécurité, l'argent ou la vie privée avec `@contexts/dev.md`.

**Symptôme** : Claude parcourt rapidement le code et peut manquer des failles de sécurité graves.

**Bonne pratique** :
- La revue de code critique doit utiliser le mode `review`
- Les revues de PR ordinaires utilisent le mode `review`
- N'utiliser le mode `dev` que pour l'itération rapide personnelle

---

## Résumé de la leçon

L'injection de contexte dynamique permet à l'IA d'optimiser sa stratégie comportementale selon les situations en clarifiant le mode de travail actuel :

**Les trois modes prédéfinis** :
- **dev** : Implémentation rapide, d'abord que ça marche, on améliore ensuite
- **review** : Revue approfondie, identifier les problèmes et suggérer des corrections
- **research** : Recherche complète, comprendre avant de conclure

**Points clés** :
1. Changer de contexte selon la phase de travail
2. Utiliser `@contexts/xxx.md` pour charger explicitement un contexte
3. Possibilité de changer plusieurs fois dans une même session
4. Possibilité de créer des contextes personnalisés pour des besoins spécifiques

**Valeur principale** : Éviter les comportements incohérents de l'IA, améliorer la concentration et l'efficacité à chaque phase.

---

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous étudierons **[Référence complète des fichiers de configuration : settings.json](../../appendix/config-reference/)**.
>
> Vous apprendrez :
> - Toutes les options de configuration de settings.json
> - Comment personnaliser la configuration des Hooks
> - Stratégies d'activation et de désactivation des serveurs MCP
> - Priorité entre configuration au niveau projet et au niveau global

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition du contexte dev | [`contexts/dev.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/dev.md) | 1-21 |
| Définition du contexte review | [`contexts/review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/review.md) | 1-23 |
| Définition du contexte research | [`contexts/research.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/research.md) | 1-27 |

**Fichiers de contexte clés** :
- `dev.md` : Contexte du mode développement, priorité à l'implémentation rapide des fonctionnalités
- `review.md` : Contexte du mode revue, priorité à l'identification des problèmes de qualité de code
- `research.md` : Contexte du mode recherche, priorité à la compréhension approfondie du problème

</details>
