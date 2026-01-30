---
title: "Apprentissage Continu : Extraction Automatique de Patterns | Everything Claude Code"
sidebarTitle: "Rendre Claude Code plus intelligent"
subtitle: "Apprentissage Continu : Extraction automatique de patterns réutilisables"
description: "Découvrez le mécanisme d'apprentissage continu d'Everything Claude Code. Utilisez /learn pour extraire des patterns, configurez l'évaluation automatique et les Stop hooks pour que Claude Code accumule de l'expérience et améliore votre productivité."
tags:
  - "continuous-learning"
  - "knowledge-extraction"
  - "automation"
prerequisite:
  - "start-quick-start"
  - "platforms-commands-overview"
order: 100
---

# Mécanisme d'Apprentissage Continu : Extraction automatique de patterns réutilisables

## Ce que vous apprendrez

- Utiliser la commande `/learn` pour extraire manuellement des patterns réutilisables d'une session
- Configurer le skill continuous-learning pour l'évaluation automatique en fin de session
- Mettre en place un Stop hook pour déclencher automatiquement l'extraction de patterns
- Sauvegarder les patterns extraits comme learned skills pour les réutiliser dans les sessions futures
- Configurer les seuils d'extraction, les exigences de longueur de session et autres paramètres

## Vos difficultés actuelles

Lors de l'utilisation de Claude Code pour le développement, avez-vous rencontré ces situations :

- Vous avez résolu un problème complexe, mais la prochaine fois que vous rencontrez un problème similaire, vous devez tout recommencer
- Vous avez appris une technique de débogage pour un framework, mais vous l'oubliez après un certain temps
- Vous avez découvert des conventions de codage spécifiques au projet, mais vous ne pouvez pas les documenter systématiquement
- Vous avez trouvé une solution de contournement, mais vous ne vous en souvenez plus lors du prochain problème similaire

Ces problèmes empêchent l'accumulation efficace de votre expérience et de vos connaissances, vous obligeant à repartir de zéro à chaque fois.

## Quand utiliser cette technique

Scénarios d'utilisation du mécanisme d'apprentissage continu :

- **Lors de la résolution de problèmes complexes** : Après avoir débogué un bug pendant des heures, vous devez mémoriser l'approche de résolution
- **Lors de l'apprentissage d'un nouveau framework** : Vous découvrez les particularités ou les meilleures pratiques du framework
- **En milieu de développement de projet** : Vous découvrez progressivement les conventions et patterns spécifiques au projet
- **Après une revue de code** : Vous apprenez de nouvelles méthodes de vérification de sécurité ou des normes de codage
- **Lors de l'optimisation des performances** : Vous trouvez des techniques d'optimisation efficaces ou des combinaisons d'outils

::: tip Valeur fondamentale
Le mécanisme d'apprentissage continu rend Claude Code de plus en plus intelligent. Il agit comme un mentor expérimenté qui enregistre automatiquement les patterns utiles pendant que vous résolvez des problèmes, et fournit des suggestions dans des situations similaires à l'avenir.
:::

## Concept central

Le mécanisme d'apprentissage continu se compose de trois composants principaux :

```
1. Commande /learn     → Extraction manuelle : exécutez à tout moment pour sauvegarder les patterns de valeur
2. Continuous Learning Skill → Évaluation automatique : déclenchée par le Stop hook, analyse la session
3. Learned Skills   → Base de connaissances : sauvegarde les patterns, chargement automatique futur
```

**Principe de fonctionnement** :

- **Extraction manuelle** : Après avoir résolu un problème non trivial, vous utilisez activement `/learn` pour extraire des patterns
- **Évaluation automatique** : À la fin de la session, le script Stop hook vérifie la longueur de la session et invite Claude à évaluer
- **Capitalisation des connaissances** : Les patterns extraits sont sauvegardés comme learned skills dans le répertoire `~/.claude/skills/learned/`
- **Réutilisation future** : Claude Code charge automatiquement ces skills dans les sessions futures

**Pourquoi choisir le Stop hook** :

- **Léger** : S'exécute une seule fois à la fin de la session, n'affecte pas la vitesse de réponse interactive
- **Contexte complet** : Peut accéder à l'historique complet de la session, facilitant la découverte de patterns de valeur
- **Non bloquant** : Ne s'exécute pas à chaque envoi de message, n'ajoute pas de latence

## 🎒 Prérequis

Avant d'utiliser le mécanisme d'apprentissage continu, veuillez confirmer :

- ✅ Le plugin Everything Claude Code est installé
- ✅ Vous avez compris la commande `/learn` dans [Aperçu des commandes principales](../../platforms/commands-overview/)
- ✅ Vous comprenez le concept de Stop hook dans [Automatisation avec les Hooks](../hooks-automation/)

::: warning Conditions préalables
Ce tutoriel suppose que vous êtes familier avec les opérations de base de Claude Code et le concept de hooks. Si vous n'avez pas encore terminé l'installation, veuillez d'abord lire [Démarrage rapide](../../start/quickstart/).
:::

## Suivez-moi : Processus complet d'apprentissage continu

Apprenons l'ensemble du processus à travers un exemple pratique. Supposons que vous déboguez une erreur de type TypeScript et que vous avez finalement trouvé la solution.

### Étape 1 : Utiliser /learn pour extraire manuellement un pattern

**Pourquoi**
L'extraction manuelle est adaptée aux problèmes importants que vous venez de résoudre, sauvegardez immédiatement pour éviter l'oubli.

**Opération**
Dans Claude Code, entrez :

```
/learn
```

**Vous devriez voir**
Claude analysera la session en cours et demandera s'il a trouvé des patterns extractibles :

```markdown
J'ai analysé la session en cours et trouvé les patterns extractibles suivants :

1. Erreur de type TypeScript : résolue via les contraintes génériques
   - Description du problème : Inférence de type incorrecte pour les paramètres de fonction
   - Solution : Ajouter une contrainte générique explicite `<T extends ...>`
   - Scénarios applicables : Inférence de type complexe, fonctions callback

Voulez-vous extraire ces patterns ? (yes/no/skip)
```

**Point de contrôle ✅**
- Claude a-t-il identifié le problème que vous avez résolu
- La description du pattern extrait est-elle précise
- Les scénarios applicables sont-ils raisonnables

**Étape suivante**
Si le pattern est correct, répondez `yes`. Si des modifications sont nécessaires, expliquez les changements spécifiques.

---

### Étape 2 : Sauvegarder comme learned skill

**Pourquoi**
Une fois sauvegardé comme fichier skill, les sessions futures pourront charger automatiquement ces connaissances.

**Opération**
Si vous confirmez l'extraction, Claude créera le fichier skill :

```markdown
Le pattern sera sauvegardé dans : ~/.claude/skills/learned/typescript-generic-constraints.md

# TypeScript Generic Constraints

**Extracted:** 2026-01-25
**Context:** Résolution de problèmes d'inférence de type complexe

## Problem
L'inférence de type des paramètres de fonction TypeScript est incorrecte, causant des erreurs de type.

## Solution
Ajouter une contrainte générique explicite `<T extends ...>` pour clarifier les relations de type.

## Example
```typescript
// Before
function process(data) { ... }  // Échec de l'inférence de type

// After
function process<T extends Record<string, unknown>>(data: T) { ... }
```

## When to Use
- Scénarios d'inférence de type complexe
- Définition de types pour les fonctions callback
- Contraintes de paramètres pour les fonctions génériques
```

**Vous devriez voir**
Claude indique que le fichier a été sauvegardé :

```markdown
✅ Skill sauvegardé dans : ~/.claude/skills/learned/typescript-generic-constraints.md

Lors de problèmes de type similaires à l'avenir, Claude chargera automatiquement cette compétence.
```

**Point de contrôle ✅**
- Le fichier a-t-il été créé avec succès
- Le chemin du fichier est-il dans le répertoire `~/.claude/skills/learned/`
- Le contenu du skill est-il précis

---

### Étape 3 : Configurer le Continuous Learning Skill

**Pourquoi**
Après avoir configuré l'évaluation automatique, Claude vérifiera automatiquement s'il y a des patterns extractibles à la fin de chaque session.

**Opération**

Créez le fichier de configuration `~/.claude/skills/continuous-learning/config.json` :

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

**Explication de la configuration** :

| Champ | Description | Valeur recommandée |
| --- | --- | --- |
| `min_session_length` | Longueur minimale de session (nombre de messages utilisateur) | 10 |
| `extraction_threshold` | Seuil d'extraction | medium |
| `auto_approve` | Sauvegarde automatique (recommandé false) | false |
| `learned_skills_path` | Chemin de sauvegarde des learned skills | `~/.claude/skills/learned/` |
| `patterns_to_detect` | Types de patterns à détecter | Voir ci-dessus |
| `ignore_patterns` | Types de patterns à ignorer | Voir ci-dessus |

**Vous devriez voir**
Le fichier de configuration a été créé dans `~/.claude/skills/continuous-learning/config.json`.

**Point de contrôle ✅**
- Le format du fichier de configuration est correct (JSON valide)
- `learned_skills_path` contient le symbole `~` (sera remplacé par le répertoire home réel)
- `auto_approve` est défini sur `false` (recommandé)

---

### Étape 4 : Configurer le Stop Hook pour le déclenchement automatique

**Pourquoi**
Le Stop hook se déclenche automatiquement à la fin de chaque session, sans avoir besoin d'exécuter manuellement `/learn`.

**Opération**

Éditez `~/.claude/settings.json` et ajoutez le Stop hook :

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**Explication des chemins de script** :

| Plateforme | Chemin du script |
| --- | --- |
| macOS/Linux | `~/.claude/skills/continuous-learning/evaluate-session.sh` |
| Windows | `C:\Users\VotreNom\.claude\skills\continuous-learning\evaluate-session.cmd` |

**Vous devriez voir**
Le Stop hook a été ajouté à `~/.claude/settings.json`.

**Point de contrôle ✅**
- La structure hooks est correcte (Stop → matcher → hooks)
- Le chemin command pointe vers le bon script
- Le matcher est défini sur `"*"` (correspond à toutes les sessions)

---

### Étape 5 : Vérifier que le Stop Hook fonctionne correctement

**Pourquoi**
Après avoir vérifié que la configuration est correcte, vous pouvez utiliser la fonction d'extraction automatique en toute confiance.

**Opération**
1. Ouvrez une nouvelle session Claude Code
2. Effectuez du travail de développement (envoyez au moins 10 messages)
3. Fermez la session

**Vous devriez voir**
Le script Stop hook affiche les logs :

```
[ContinuousLearning] Session has 12 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/votrenom/.claude/skills/learned/
```

**Point de contrôle ✅**
- Les logs montrent un nombre de messages de session ≥ 10
- Le chemin des learned skills dans les logs est correct
- Pas de messages d'erreur

---

### Étape 6 : Chargement automatique des learned skills dans les sessions futures

**Pourquoi**
Les skills sauvegardés seront automatiquement chargés dans des scénarios similaires à l'avenir, fournissant du contexte.

**Opération**
Lorsque vous rencontrez un problème similaire dans une session future, Claude chargera automatiquement les learned skills pertinents.

**Vous devriez voir**
Claude indique qu'il a chargé les skills pertinents :

```markdown
Je remarque que ce scénario est similaire au problème d'inférence de type résolu précédemment.

Selon le saved skill (typescript-generic-constraints), je recommande d'utiliser une contrainte générique explicite :

```typescript
function process<T extends Record<string, unknown>>(data: T) { ... }
```
```

**Point de contrôle ✅**
- Claude a référencé le saved skill
- La solution suggérée est précise
- L'efficacité de résolution des problèmes est améliorée

## Point de contrôle ✅ : Vérification de la configuration

Après avoir terminé les étapes ci-dessus, exécutez les vérifications suivantes pour confirmer que tout fonctionne correctement :

1. **Vérifier que le fichier de configuration existe** :
```bash
ls -la ~/.claude/skills/continuous-learning/config.json
```

2. **Vérifier la configuration du Stop hook** :
```bash
cat ~/.claude/settings.json | grep -A 10 "Stop"
```

3. **Vérifier le répertoire des learned skills** :
```bash
ls -la ~/.claude/skills/learned/
```

4. **Tester manuellement le Stop hook** :
```bash
node ~/.claude/skills/continuous-learning/scripts/hooks/evaluate-session.js
```

## Pièges à éviter

### Piège 1 : Session trop courte, extraction non déclenchée

**Problème** :
Le script Stop hook vérifie la longueur de la session, si elle est inférieure à `min_session_length`, il saute l'évaluation.

**Cause** :
Par défaut `min_session_length: 10`, les sessions courtes ne déclenchent pas l'évaluation.

**Solution** :
```json
{
  "min_session_length": 5  // Réduire le seuil
}
```

::: warning Attention
Ne définissez pas une valeur trop basse (comme < 5), sinon vous extrairez de nombreux patterns sans signification (comme des corrections d'erreurs de syntaxe simples).
:::

---

### Piège 2 : `auto_approve: true` entraîne la sauvegarde de patterns de mauvaise qualité

**Problème** :
En mode sauvegarde automatique, Claude peut sauvegarder des patterns de faible qualité.

**Cause** :
`auto_approve: true` saute l'étape de confirmation manuelle.

**Solution** :
```json
{
  "auto_approve": false  // Toujours garder false
}
```

**Pratique recommandée** :
Confirmez toujours manuellement les patterns extraits pour garantir la qualité.

---

### Piège 3 : Le répertoire des learned skills n'existe pas, échec de la sauvegarde

**Problème** :
Le Stop hook s'exécute avec succès, mais le fichier skill n'est pas créé.

**Cause** :
Le répertoire pointé par `learned_skills_path` n'existe pas.

**Solution** :
```bash
# Créer manuellement le répertoire
mkdir -p ~/.claude/skills/learned/

# Ou utiliser un chemin absolu dans la configuration
{
  "learned_skills_path": "/chemin/absolu/vers/learned/"
}
```

---

### Piège 4 : Chemin du script Stop hook incorrect (Windows)

**Problème** :
Le Stop hook ne se déclenche pas sous Windows.

**Cause** :
Le fichier de configuration utilise des chemins de style Unix (`~/.claude/...`), mais le chemin réel sous Windows est différent.

**Solution** :
```json
{
  "command": "C:\\Users\\VotreNom\\.claude\\skills\\continuous-learning\\evaluate-session.cmd"
}
```

**Pratique recommandée** :
Utilisez des scripts Node.js (multi-plateforme) au lieu de scripts Shell.

---

### Piège 5 : Patterns extraits trop génériques, faible réutilisabilité

**Problème** :
La description du pattern extrait est trop vague (comme "corriger une erreur de type"), manque de contexte spécifique.

**Cause** :
Pas assez d'informations contextuelles incluses lors de l'extraction (message d'erreur, exemple de code, scénarios applicables).

**Solution** :
Fournissez un contexte plus détaillé lors de l'utilisation de `/learn` :

```
/learn J'ai résolu une erreur de type TypeScript : Property 'xxx' does not exist on type 'yyy'. J'ai utilisé une assertion de type as comme solution temporaire, mais une meilleure méthode est d'utiliser des contraintes génériques.
```

**Liste de vérification** :
- [ ] Description du problème spécifique (incluant le message d'erreur)
- [ ] Solution détaillée (incluant un exemple de code)
- [ ] Scénarios applicables clairs (quand utiliser ce pattern)
- [ ] Nommage spécifique (comme "typescript-generic-constraints" plutôt que "type-fix")

---

### Piège 6 : Trop de learned skills, difficiles à gérer

**Problème** :
Au fil du temps, le répertoire `learned/` accumule de nombreux skills, difficiles à trouver et à gérer.

**Cause** :
Pas de nettoyage régulier des skills de faible qualité ou obsolètes.

**Solution** :

1. **Révision régulière** : Vérifiez les learned skills une fois par mois
```bash
# Lister tous les skills
ls -la ~/.claude/skills/learned/

# Voir le contenu d'un skill
cat ~/.claude/skills/learned/pattern-name.md
```

2. **Marquer les skills de faible qualité** : Ajoutez le préfixe `deprecated-` au nom du fichier
```bash
mv ~/.claude/skills/learned/old-pattern.md \
   ~/.claude/skills/learned/deprecated-old-pattern.md
```

3. **Gestion par catégories** : Utilisez des sous-répertoires pour la classification
```bash
mkdir -p ~/.claude/skills/learned/{types,debugging,testing}
mv ~/.claude/skills/learned/*types*.md ~/.claude/skills/learned/types/
```

**Pratique recommandée** :
Nettoyez une fois par trimestre pour garder les learned skills concis et efficaces.

---

## Résumé du cours

Le mécanisme d'apprentissage continu fonctionne à travers trois composants principaux :

1. **Commande `/learn`** : Extraction manuelle des patterns réutilisables de la session
2. **Continuous Learning Skill** : Configuration des paramètres d'évaluation automatique (longueur de session, seuil d'extraction)
3. **Stop Hook** : Déclenchement automatique de l'évaluation à la fin de la session

**Points clés** :

- ✅ L'extraction manuelle est adaptée aux problèmes importants que vous venez de résoudre
- ✅ L'évaluation automatique est déclenchée par le Stop hook à la fin de la session
- ✅ Les patterns extraits sont sauvegardés comme learned skills dans le répertoire `~/.claude/skills/learned/`
- ✅ Configurez `min_session_length` pour contrôler la longueur minimale de session (recommandé 10)
- ✅ Gardez toujours `auto_approve: false` pour confirmer manuellement la qualité de l'extraction
- ✅ Nettoyez régulièrement les learned skills de faible qualité ou obsolètes

**Meilleures pratiques** :

- Après avoir résolu un problème non trivial, utilisez immédiatement `/learn` pour extraire le pattern
- Fournissez un contexte détaillé (description du problème, solution, exemple de code, scénarios applicables)
- Utilisez un nommage spécifique pour les skills (comme "typescript-generic-constraints" plutôt que "type-fix")
- Révisez et nettoyez régulièrement les learned skills pour garder la base de connaissances concise

## Prochain cours

> Au prochain cours, nous apprendrons **[Stratégies d'optimisation des Tokens](../token-optimization/)**.
>
> Vous apprendrez :
> - Comment optimiser l'utilisation des Tokens pour maximiser l'efficacité de la fenêtre de contexte
> - Configuration et utilisation du skill strategic-compact
> - Automatisation avec les hooks PreCompact et PostToolUse
> - Choisir le bon modèle (opus vs sonnet) pour équilibrer coût et qualité

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-25

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition de la commande /learn | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Continuous Learning Skill | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81 |
| Script Stop Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Commande Checkpoint | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |

**Constantes clés** :
- `min_session_length = 10` : Longueur minimale de session par défaut (nombre de messages utilisateur)
- `CLAUDE_TRANSCRIPT_PATH` : Variable d'environnement, chemin de l'historique de session
- `learned_skills_path` : Chemin de sauvegarde des learned skills, par défaut `~/.claude/skills/learned/`

**Fonctions clés** :
- `main()` : Fonction principale de evaluate-session.js, lit la configuration, vérifie la longueur de session, affiche les logs
- `getLearnedSkillsDir()` : Obtient le chemin du répertoire des learned skills (gère l'expansion de `~`)
- `countInFile()` : Compte le nombre d'occurrences d'un pattern dans un fichier

**Options de configuration** :
| Option | Type | Valeur par défaut | Description |
| --- | --- | --- | --- |
| `min_session_length` | number | 10 | Longueur minimale de session (nombre de messages utilisateur) |
| `extraction_threshold` | string | "medium" | Seuil d'extraction |
| `auto_approve` | boolean | false | Sauvegarde automatique (recommandé false) |
| `learned_skills_path` | string | "~/.claude/skills/learned/" | Chemin de sauvegarde des learned skills |
| `patterns_to_detect` | array | Voir source | Types de patterns à détecter |
| `ignore_patterns` | array | Voir source | Types de patterns à ignorer |

**Types de patterns** :
- `error_resolution` : Patterns de résolution d'erreurs
- `user_corrections` : Patterns de correction utilisateur
- `workarounds` : Solutions de contournement
- `debugging_techniques` : Techniques de débogage
- `project_specific` : Patterns spécifiques au projet

**Types de Hook** :
- Stop : S'exécute à la fin de la session (evaluate-session.js)

</details>
