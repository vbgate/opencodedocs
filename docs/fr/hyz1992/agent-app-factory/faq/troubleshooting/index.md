---
title: "Questions fréquentes et dépannage : résoudre rapidement divers problèmes | Tutoriel AI App Factory"
sidebarTitle: "Que faire en cas de problème"
subtitle: "Questions fréquentes et dépannage"
description: "Apprenez à localiser rapidement et à résoudre les problèmes courants lors de l'utilisation d'AI App Factory. Ce tutoriel explique en détail les méthodes de diagnostic et les étapes de réparation pour divers types de pannes, notamment les problèmes d'initialisation de répertoire, les échecs de démarrage de l'assistant IA, la gestion des échecs de phase, les conflits de versions de dépendances et les erreurs de dépassement de permissions, vous aidant ainsi à mener efficacement le développement d'applications."
tags:
  - "Dépannage"
  - "FAQ"
  - "Debugging"
prerequisite:
  - "../../start/installation/"
  - "../../start/init-project/"
order: 190
---

# Questions fréquentes et dépannage

## Ce que vous pourrez faire après ce cours

- Localiser rapidement et résoudre les problèmes de répertoire lors de l'initialisation
- Diagnostiquer les causes des échecs de démarrage de l'assistant IA
- Comprendre le processus de traitement des échecs de phase (réessai/annulation/intervention manuelle)
- Résoudre les problèmes d'installation et de conflits de versions de dépendances
- Gérer les erreurs de dépassement de permissions des agents
- Utiliser `factory continue` pour reprendre l'exécution dans une nouvelle session

## Votre situation actuelle

Vous pourriez rencontrer ces problèmes :

- ❌ Message "répertoire non vide" lors de l'exécution de `factory init`
- ❌ L'assistant IA ne peut pas démarrer et vous ne savez pas comment configurer les permissions
- ❌ Le pipeline échoue soudainement à une certaine phase et vous ne savez pas comment continuer
- ❌ Erreurs lors de l'installation des dépendances avec des conflits de versions graves
- ❌ Les artefacts générés par l'agent sont marqués comme "non autorisés"
- ❌ Vous ne comprenez pas les mécanismes de points de contrôle et de réessai

Ne vous inquiétez pas, tous ces problèmes ont des solutions claires. Ce tutoriel vous aidera à diagnostiquer et à réparer rapidement divers types de pannes.

---

## 🎒 Préparatifs avant de commencer

::: warning Connaissances préalables

Avant de commencer, assurez-vous d'avoir :

- [ ] Complété [Installation et configuration](../../start/installation/)
- [ ] Complété [Initialisation d'un projet Factory](../../start/init-project/)
- [ ] Compris [Vue d'ensemble du pipeline à 7 phases](../../start/pipeline-overview/)
- [ ] Su comment utiliser [l'intégration Claude Code](../../platforms/claude-code/)

:::

## Concepts fondamentaux

La gestion des pannes d'AI App Factory suit une stratégie stricte. Comprendre ce mécanisme vous permettra de ne pas être désorienté face aux problèmes.

### Les trois niveaux de gestion des échecs

1. **Réessai automatique** : chaque phase permet un réessai
2. **Annulation et archivage** : les artefacts échoués sont déplacés vers `_failed/`, retour au dernier point de contrôle réussi
3. **Intervention manuelle** : après deux échecs consécutifs, pause nécessitant votre réparation manuelle

### Règles de gestion des dépassements de permissions

- L'agent écrit dans un répertoire non autorisé → déplacé vers `_untrusted/`
- Le pipeline est en pause, attendant votre examen
- Ajustez les permissions ou modifiez le comportement de l'agent selon vos besoins

### Frontières de permissions

Chaque agent a une étendue stricte de permissions de lecture/écriture :

| Agent       | Peut lire                    | Peut écrire                                    |
| ----------- | ---------------------------- | ---------------------------------------------- |
| bootstrap   | Aucun                        | `input/`                                       |
| prd         | `input/`                     | `artifacts/prd/`                              |
| ui          | `artifacts/prd/`             | `artifacts/ui/`                               |
| tech        | `artifacts/prd/`             | `artifacts/tech/`, `artifacts/backend/prisma/` |
| code        | `artifacts/ui/`, `artifacts/tech/`, `artifacts/backend/prisma/` | `artifacts/backend/`, `artifacts/client/` |
| validation  | `artifacts/backend/`, `artifacts/client/` | `artifacts/validation/`                        |
| preview     | `artifacts/backend/`, `artifacts/client/` | `artifacts/preview/`                           |

---

## Problèmes d'initialisation

### Problème 1 : Erreur de répertoire non vide

**Symptômes** :

```bash
$ factory init
Error: Directory is not empty or contains conflicting files
```

**Cause** : Le répertoire actuel contient des fichiers en conflit (pas `.git`, `README.md` ou autres fichiers autorisés).

**Solution** :

1. **Vérifier le contenu du répertoire** :

```bash
ls -la
```

2. **Nettoyer les fichiers en conflit** :

```bash
# Méthode 1 : supprimer les fichiers en conflit
rm -rf <conflicting-files>

# Méthode 2 : déplacer vers un nouveau répertoire
mkdir ../my-app && mv . ../my-app/
cd ../my-app
```

3. **Réinitialiser** :

```bash
factory init
```

**Fichiers autorisés** : `.git`, `.gitignore`, `README.md`, `.vscode/*`, `.idea/*`

### Problème 2 : Projet Factory déjà existant

**Symptômes** :

```bash
$ factory init
Error: This is already a Factory project
```

**Cause** : Le répertoire contient déjà `.factory/` ou `artifacts/`.

**Solution** :

- Si c'est un nouveau projet, nettoyez d'abord puis initialisez :

```bash
rm -rf .factory artifacts
factory init
```

- Si vous souhaitez récupérer l'ancien projet, exécutez simplement `factory run`

### Problème 3 : Échec du démarrage de l'assistant IA

**Symptômes** :

```bash
$ factory init
✓ Factory project initialized
Could not find Claude Code installation.
```

**Cause** : Claude Code n'est pas installé ou n'est pas correctement configuré.

**Solution** :

1. **Installer Claude Code** :

```bash
# macOS
brew install claude

# Linux (télécharger depuis le site officiel)
# https://claude.ai/code
```

2. **Vérifier l'installation** :

```bash
claude --version
```

3. **Démarrage manuel** :

```bash
# Dans le répertoire du projet Factory
claude "Veuillez lire .factory/pipeline.yaml et .factory/agents/orchestrator.checkpoint.md, puis démarrer le pipeline"
```

**Processus de démarrage manuel** : 1. Lire `pipeline.yaml` → 2. Lire `orchestrator.checkpoint.md` → 3. Attendre l'exécution par l'IA

---

## Problèmes d'exécution du pipeline

### Problème 4 : Erreur de répertoire non projet

**Symptômes** :

```bash
$ factory run
Error: Not a Factory project. Run 'factory init' first.
```

**Cause** : Le répertoire actuel n'est pas un projet Factory (répertoire `.factory/` manquant).

**Solution** :

1. **Vérifier la structure du projet** :

```bash
ls -la .factory/
```

2. **Basculer vers le bon répertoire** ou **réinitialiser** :

```bash
# Basculer vers le répertoire du projet
cd /path/to/project

# Ou réinitialiser
factory init
```

### Problème 5 : Fichier Pipeline introuvable

**Symptômes** :

```bash
$ factory run
Error: Pipeline configuration not found
```

**Cause** : Le fichier `pipeline.yaml` est manquant ou le chemin est incorrect.

**Solution** :

1. **Vérifier si le fichier existe** :

```bash
ls -la .factory/pipeline.yaml
ls -la pipeline.yaml
```

2. **Copier manuellement** (si le fichier est perdu) :

```bash
cp /path/to/factory/source/hyz1992/agent-app-factory/pipeline.yaml .factory/
```

3. **Réinitialiser** (le plus fiable) :

```bash
rm -rf .factory
factory init
```

---

## Gestion des échecs de phase

### Problème 6 : Échec de la phase Bootstrap

**Symptômes** :

- `input/idea.md` n'existe pas
- `idea.md` manque des sections clés (utilisateurs cibles, valeur principale, hypothèses)

**Cause** : Informations utilisateur insuffisantes ou l'agent n'a pas correctement écrit le fichier.

**Processus de gestion** :

```
1. Vérifier si le répertoire input/ existe → le créer s'il n'existe pas
2. Réessayer une fois, en demandant à l'agent d'utiliser le bon modèle
3. Si cela échoue toujours, demander à l'utilisateur de fournir une description de produit plus détaillée
```

**Réparation manuelle** :

1. **Vérifier le répertoire des artefacts** :

```bash
ls -la artifacts/_failed/bootstrap/
```

2. **Créer le répertoire input/** :

```bash
mkdir -p input
```

3. **Fournir une description de produit détaillée** :

Fournissez à l'IA une idée de produit plus claire et plus détaillée, incluant :
- Qui sont les utilisateurs cibles (personas spécifiques)
- Quels sont les points de douleur principaux
- Quel problème vous souhaitez résoudre
- Idées de fonctionnalités préliminaires

### Problème 7 : Échec de la phase PRD

**Symptômes** :

- Le PRD contient des détails techniques (violation des frontières de responsabilité)
- Fonctionnalités Must Have > 7 (dilution de la portée)
- Manque des non-objectifs (frontières non claires)

**Cause** : L'agent dépasse ses frontières ou le contrôle de la portée n'est pas strict.

**Processus de gestion** :

```
1. Vérifier que prd.md ne contient pas de mots-clés techniques
2. Vérifier que le nombre de fonctionnalités Must Have ≤ 7
3. Vérifier que les utilisateurs cibles ont des personas spécifiques
4. Fournir des exigences de correction spécifiques lors du réessai
```

**Exemples d'erreurs courantes** :

| Type d'erreur | Exemple d'erreur | Exemple correct |
|---------------|------------------|-----------------|
| Contient des détails techniques | "Utiliser React Native" | "Prendre en charge iOS et Android" |
| Dilution de la portée | "Inclure paiement, social, messages et 10 autres fonctionnalités" | "Fonctionnalités principales pas plus de 7" |
| Cible floue | "Tout le monde peut l'utiliser" | "Employés de bureau urbains âgés de 25-35 ans" |

**Réparation manuelle** :

1. **Vérifier le PRD échoué** :

```bash
cat artifacts/_failed/prd/prd.md
```

2. **Corriger le contenu** :

- Supprimer les descriptions de la pile technique
- Simplifier la liste des fonctionnalités à ≤ 7
- Ajouter la liste des non-objectifs

3. **Déplacer manuellement vers le bon emplacement** :

```bash
mv artifacts/_failed/prd/prd.md artifacts/prd/prd.md
```

### Problème 8 : Échec de la phase UI

**Symptômes** :

- Nombre de pages > 8 (dilution de la portée)
- Fichier HTML d'aperçu corrompu
- Utilisation du style IA (police Inter + dégradé violet)
- Échec de l'analyse YAML

**Cause** : Portée UI trop grande ou non-respect du guide esthétique.

**Processus de gestion** :

```
1. Compter le nombre de pages dans ui.schema.yaml
2. Essayer d'ouvrir preview.web/index.html dans un navigateur
3. Vérifier la syntaxe YAML
4. Vérifier si des éléments de style IA interdits sont utilisés
```

**Réparation manuelle** :

1. **Vérifier la syntaxe YAML** :

```bash
npx js-yaml .factory/artifacts/ui/ui.schema.yaml
```

2. **Ouvrir l'aperçu dans le navigateur** :

```bash
open artifacts/ui/preview.web/index.html  # macOS
xdg-open artifacts/ui/preview.web/index.html  # Linux
```

3. **Réduire le nombre de pages** : vérifier `ui.schema.yaml`, assurer que le nombre de pages ≤ 8

### Problème 9 : Échec de la phase Tech

**Symptômes** :

- Erreur de syntaxe du schéma Prisma
- Introduction de microservices, cache, etc. (surconception)
- Trop de modèles de données (nombre de tables > 10)
- Manque de définitions d'API

**Cause** : Complexification de l'architecture ou problèmes de conception de la base de données.

**Processus de gestion** :

```
1. Exécuter npx prisma validate pour vérifier le schéma
2. Vérifier que tech.md contient les sections nécessaires
3. Compter le nombre de modèles de données
4. Vérifier si des technologies inutilement complexes sont introduites
```

**Réparation manuelle** :

1. **Vérifier le schéma Prisma** :

```bash
cd artifacts/backend/
npx prisma validate
```

2. **Simplifier l'architecture** : vérifier `artifacts/tech/tech.md`, supprimer les technologies non nécessaires (microservices, cache, etc.)

3. **Ajouter les définitions d'API** : assurer que `tech.md` contient tous les points de terminaison d'API nécessaires

### Problème 10 : Échec de la phase Code

**Symptômes** :

- Échec de l'installation des dépendances
- Erreurs de compilation TypeScript
- Fichiers nécessaires manquants
- Échec des tests
- Impossible de démarrer l'API

**Cause** : Conflits de versions de dépendances, problèmes de type ou erreurs logiques de code.

**Processus de gestion** :

```
1. Exécuter npm install --dry-run pour vérifier les dépendances
2. Exécuter npx tsc --noEmit pour vérifier les types
3. Vérifier la structure des répertoires par rapport à la liste des fichiers
4. Exécuter npm test pour vérifier les tests
5. Si tout réussit, essayer de démarrer le service
```

**Correction des problèmes de dépendances courants** :

```bash
# Conflit de versions
rm -rf node_modules package-lock.json
npm install

# Incompatibilité de version Prisma
npm install @prisma/client@latest prisma@latest

# Problèmes de dépendances React Native
npx expo install --fix
```

**Gestion des erreurs TypeScript** :

```bash
# Vérifier les erreurs de type
npx tsc --noEmit

# Revérifier après correction
npx tsc --noEmit
```

**Vérification de la structure des répertoires** :

Assurer que les fichiers/répertoires suivants sont inclus :

```
artifacts/backend/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── index.ts
│   ├── lib/
│   └── routes/
└── vitest.config.ts

artifacts/client/
├── package.json
├── tsconfig.json
├── app.json
└── src/
```

### Problème 11 : Échec de la phase Validation

**Symptômes** :

- Rapport de validation incomplet
- Trop de problèmes graves (nombre d'erreurs > 10)
- Problèmes de sécurité (détection de clés codées en dur)

**Cause** : Qualité médiocre de la phase Code ou problèmes de sécurité.

**Processus de gestion** :

```
1. Analyser report.md pour confirmer que toutes les sections existent
2. Compter le nombre de problèmes graves
3. Si problèmes graves > 10, suggérer de revenir à la phase Code
4. Vérifier les résultats du scan de sécurité
```

**Réparation manuelle** :

1. **Voir le rapport de validation** :

```bash
cat artifacts/validation/report.md
```

2. **Réparer les problèmes graves** : réparer un par un selon le rapport

3. **Revenir à la phase Code** (s'il y a trop de problèmes) :

```bash
factory run code  # Reprendre depuis la phase Code
```

### Problème 12 : Échec de la phase Preview

**Symptômes** :

- README incomplet (étapes d'installation manquantes)
- Échec de la construction Docker
- Configuration de déploiement manquante

**Cause** : Contenu omis ou problèmes de configuration.

**Processus de gestion** :

```
1. Vérifier que README.md contient toutes les sections nécessaires
2. Essayer docker build pour vérifier Dockerfile
3. Vérifier si les fichiers de configuration de déploiement existent
```

**Réparation manuelle** :

1. **Vérifier la configuration Docker** :

```bash
cd artifacts/preview/
docker build -t my-app .
```

2. **Vérifier les fichiers de déploiement** :

Assurer que les fichiers suivants existent :

```
artifacts/preview/
├── README.md
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml  # Configuration CI/CD
```

---

## Gestion des erreurs de dépassement de permissions

### Problème 13 : Dépassement de permissions de l'agent

**Symptômes** :

```bash
Error: Unauthorized write to <path>
Artifacts moved to: artifacts/_untrusted/<stage-id>/
Pipeline paused. Manual intervention required.
```

**Cause** : L'agent tente d'écrire dans un répertoire ou fichier non autorisé.

**Solution** :

1. **Vérifier les fichiers non autorisés** :

```bash
ls -la artifacts/_untrusted/<stage-id>/
```

2. **Examiner la matrice des permissions** : confirmer l'étendue d'écriture de cet agent

3. **Choisir une méthode de gestion** :

   - **Option A : Corriger le comportement de l'agent** (recommandé)

   Indiquez clairement le problème de dépassement de permissions à l'assistant IA et demandez-lui de le corriger.

   - **Option B : Déplacer les fichiers vers le bon emplacement** (avec prudence)

   Si vous êtes sûr que les fichiers devraient exister, déplacez-les manuellement :

   ```bash
   mv artifacts/_untrusted/<stage-id>/<file> artifacts/<target-stage>/
   ```

   - **Option C : Ajuster la matrice des permissions** (avancé)

   Modifiez `.factory/policies/capability.matrix.md` pour augmenter les permissions d'écriture de cet agent.

4. **Continuer l'exécution** :

```bash
factory continue
```

**Scénarios d'exemple** :

- L'agent Code tente de modifier `artifacts/prd/prd.md` (violation des frontières de responsabilité)
- L'agent UI tente de créer le répertoire `artifacts/backend/` (dépassement de l'étendue des permissions)
- L'agent Tech tente d'écrire dans le répertoire `artifacts/ui/` (dépassement)

---

## Problèmes d'exécution multi-sessions

### Problème 14 : Tokens insuffisants ou accumulation de contexte

**Symptômes** :

- Les réponses de l'IA deviennent plus lentes
- Le contexte trop long entraîne une baisse des performances du modèle
- Consommation de tokens excessive

**Cause** : Trop d'historique de conversation accumulé dans une même session.

**Solution : utiliser `factory continue`**

La commande `factory continue` vous permet de :

1. **Sauvegarder l'état actuel** dans `.factory/state.json`
2. **Démarrer une nouvelle fenêtre Claude Code**
3. **Continuer l'exécution à partir de la phase actuelle**

**Étapes d'exécution** :

1. **Voir l'état actuel** :

```bash
factory status
```

Exemple de sortie :

```bash
Pipeline Status:
──────────────────────────────────────
Project: my-app
Status: Waiting
Current Stage: tech
Completed: bootstrap, prd, ui
```

2. **Continuer dans une nouvelle session** :

```bash
factory continue
```

**Effets** :

- Chaque phase bénéficie d'un contexte propre
- Évite l'accumulation de tokens
- Prend en charge la reprise après interruption

**Démarrage manuel d'une nouvelle session** (si `factory continue` échoue) :

```bash
# Régénérer la configuration des permissions
claude "Veuillez régénérer .claude/settings.local.json, autoriser les opérations Read/Write/Glob/Bash"

# Démarrer manuellement une nouvelle session
claude "Veuillez continuer l'exécution du pipeline, la phase actuelle est tech"
```

---

## Problèmes d'environnement et de permissions

### Problème 15 : Version Node.js trop ancienne

**Symptômes** :

```bash
Error: Node.js version must be >= 16.0.0
```

**Cause** : La version de Node.js ne répond pas aux exigences.

**Solution** :

1. **Vérifier la version** :

```bash
node --version
```

2. **Mettre à niveau Node.js** :

```bash
# macOS
brew install node@18
brew link --overwrite node@18

# Linux (en utilisant nvm)
nvm install 18
nvm use 18

# Windows (télécharger depuis le site officiel)
# https://nodejs.org/
```

### Problème 16 : Problèmes de permissions Claude Code

**Symptômes** :

- L'IA indique "pas de permissions de lecture/écriture"
- L'IA ne peut pas accéder au répertoire `.factory/`

**Cause** : La configuration des permissions `.claude/settings.local.json` est incorrecte.

**Solution** :

1. **Vérifier le fichier des permissions** :

```bash
cat .claude/settings.local.json
```

2. **Régénérer les permissions** :

```bash
factory continue  # Régénère automatiquement
```

Ou exécuter manuellement :

```bash
node -e "
const { generateClaudeSettings } = require('./cli/utils/claude-settings');
generateClaudeSettings(process.cwd());
"
```

3. **Exemple de configuration correcte des permissions** :

```json
{
  "allowedCommands": ["npm", "npx", "node", "git"],
  "allowedPaths": [
    "/absolute/path/to/project/.factory",
    "/absolute/path/to/project/artifacts",
    "/absolute/path/to/project/input",
    "/absolute/path/to/project/node_modules"
  ]
}
```

### Problème 17 : Problèmes réseau entraînant l'échec de l'installation des dépendances

**Symptômes** :

```bash
Error: Network request failed
npm ERR! code ECONNREFUSED
```

**Cause** : Problèmes de connexion réseau ou échec d'accès à la source npm.

**Solution** :

1. **Vérifier la connexion réseau** :

```bash
ping registry.npmjs.org
```

2. **Changer la source npm** :

```bash
# Utiliser le miroir Taobao
npm config set registry https://registry.npmmirror.com

# Vérifier
npm config get registry
```

3. **Réinstaller les dépendances** :

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Arbre de décision d'intervention manuelle

```
Échec de phase
    │
    ▼
Est-ce le premier échec ?
    ├─ Oui → Réessai automatique
    │         │
    │         ▼
    │     Réessai réussi ? → Oui → Continuer le flux
    │            │
    │            Non → Deuxième échec
    │
    └─ Non → Analyser la cause de l'échec
              │
              ▼
          Est-ce un problème d'entrée ?
              ├─ Oui → Modifier le fichier d'entrée
              │         └─ Revenir à la phase en amont
              │
              └─ Non → Demander une intervention manuelle
```

**Points de décision** :

- **Premier échec** : permettre le réessai automatique, observer si l'erreur disparaît
- **Deuxième échec** : arrêter le traitement automatique, nécessite votre examen manuel
- **Problème d'entrée** : modifier `input/idea.md` ou les artefacts en amont
- **Problème technique** : vérifier les dépendances, la configuration ou la logique du code
- **Problème de dépassement** : examiner la matrice des permissions ou le comportement de l'agent

---

## Mises en garde

### ❌ Erreurs courantes

1. **Modifier directement les artefacts en amont**

   Façon incorrecte : modifier `input/idea.md` lors de la phase PRD
   
   Façon correcte : revenir à la phase Bootstrap

2. **Ignorer la confirmation des points de contrôle**

   Façon incorrecte : sauter rapidement tous les points de contrôle
   
   Façon correcte : examiner attentivement si les artefacts de chaque phase répondent aux attentes

3. **Supprimer manuellement les artefacts échoués**

   Façon incorrecte : supprimer le répertoire `_failed/`
   
   Façon correcte : conserver les artefacts échoués pour l'analyse comparative

4. **Ne pas régénérer les permissions après modification**

   Façon incorrecte : ne pas mettre à jour `.claude/settings.local.json` après modification de la structure du projet
   
   Façon correcte : exécuter `factory continue` pour mettre à jour automatiquement les permissions

### ✅ Meilleures pratiques

1. **Échec précoce** : détecter les problèmes le plus tôt possible pour éviter de perdre du temps dans les phases ultérieures

2. **Journalisation détaillée** : conserver des journaux d'erreurs complets pour faciliter le diagnostic des problèmes

3. **Opérations atomiques** : chaque sortie de phase doit être atomique pour faciliter l'annulation

4. **Conserver les preuves** : archiver les artefacts échoués avant de réessayer pour faciliter l'analyse comparative

5. **Réessai progressif** : fournir des instructions plus spécifiques lors du réessai au lieu de simplement répéter

---

## Résumé du cours

Ce cours couvre divers problèmes courants rencontrés lors de l'utilisation d'AI App Factory :

| Catégorie | Nombre de problèmes | Méthode de résolution principale |
|-----------|---------------------|----------------------------------|
| Initialisation | 3 | Nettoyer le répertoire, installer l'assistant IA, démarrage manuel |
| Exécution du pipeline | 2 | Confirmer la structure du projet, vérifier les fichiers de configuration |
| Échecs de phase | 7 | Réessai, annulation, réexécution après réparation |
| Gestion des dépassements | 1 | Examiner la matrice des permissions, déplacer les fichiers ou ajuster les permissions |
| Exécution multi-sessions | 1 | Utiliser `factory continue` pour démarrer une nouvelle session |
| Environnement et permissions | 3 | Mettre à niveau Node.js, régénérer les permissions, changer la source npm |

**Points clés** :

- Chaque phase permet **un réessai automatique**
- Après deux échecs consécutifs, **intervention manuelle** est nécessaire
- Les artefacts échoués sont automatiquement archivés dans `_failed/`
- Les fichiers non autorisés sont déplacés vers `_untrusted/`
- Utiliser `factory continue` pour économiser les tokens

**Rappelez-vous** :

Ne paniquez pas face aux problèmes. Commencez par examiner le journal des erreurs, puis vérifiez le répertoire des artefacts correspondant, et suivez pas à pas les solutions de ce cours. La plupart des problèmes peuvent être résolus en réessayant, en annulant ou en réparation les fichiers d'entrée.

## Prochain cours

> Le prochain cours, nous allons apprendre **[Meilleures pratiques](../best-practices/)**.
>
> Vous apprendrez :
> - Comment fournir une description claire du produit
> - Comment utiliser le mécanisme de points de contrôle
> - Comment contrôler la portée du projet
> - Comment optimiser progressivement par itérations

**Lectures connexes** :

- [Gestion des échecs et annulation](../../advanced/failure-handling/) - Comprendre en profondeur les stratégies de gestion des échecs
- [Mécanismes de permissions et de sécurité](../../advanced/security-permissions/) - Comprendre la matrice des frontières de capacités
- [Optimisation du contexte](../../advanced/context-optimization/) - Techniques pour économiser les tokens

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer et voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-29

| Fonctionnalité | Chemin du fichier | Numéro de ligne |
|----------------|------------------|-----------------|
| Vérification du répertoire d'initialisation | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 32-53 |
| Démarrage de l'assistant IA | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| Définition de la stratégie d'échec | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-276 |
| Spécification des codes d'erreur | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |
| Matrice des frontières de capacités | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-23 |
| Configuration du pipeline | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | Texte complet |
| Cœur du planificateur | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Commande Continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |

**Constantes clés** :
- Nombre de fonctionnalités Must Have autorisées : ≤ 7
- Nombre de pages UI autorisées : ≤ 8
- Nombre de modèles de données autorisés : ≤ 10
- Nombre de tentatives : chaque phase permet un réessai

**Fonctions clés** :
- `isFactoryProject(dir)` - vérifie si c'est un projet Factory
- `isDirectorySafeToInit(dir)` - vérifie si le répertoire peut être initialisé
- `generateClaudeSettings(projectDir)` - génère la configuration des permissions Claude Code
- `factory continue` - continue l'exécution du pipeline dans une nouvelle session

</details>
