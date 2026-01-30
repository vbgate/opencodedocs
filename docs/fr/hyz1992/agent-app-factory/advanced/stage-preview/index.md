---
title: "Étape Preview : Génération automatique du guide de déploiement et des instructions d'exécution | Tutoriel Agent App Factory"
sidebarTitle: "Génération du Guide de Déploiement"
subtitle: "Génération du guide de déploiement : guide complet de l'étape Preview"
description: "Apprenez comment l'étape Preview d'AI App Factory génère automatiquement les guides d'exécution et les configurations de déploiement pour les applications générées, couvrant le démarrage local, la conteneurisation Docker, les builds Expo EAS, les pipelines CI/CD et la conception des flux de démonstration."
tags:
  - "Guide de déploiement"
  - "Docker"
  - "CI/CD"
prerequisite:
  - "advanced-stage-validation"
order: 140
---

# Génération du guide de déploiement : guide complet de l'étape Preview

## Ce que vous pourrez faire après ce cours

À la fin de ce cours, vous serez capable de :

- Comprendre comment l'agent Preview écrit des guides d'exécution pour les applications générées
- Maîtriser la méthode de génération des configurations de déploiement Docker
- Comprendre le rôle des configurations de build Expo EAS
- Apprendre à concevoir des flux de démonstration courts pour les MVP
- Comprendre les meilleures pratiques pour les configurations CI/CD et Git Hooks

## Votre situation actuelle

Le code a été généré et validé, et vous souhaitez présenter rapidement le MVP à votre équipe ou à vos clients, mais vous ne savez pas :

- Quel type de documentation d'exécution rédiger ?
- Comment permettre aux autres de démarrer et d'exécuter l'application rapidement ?
- Quelles fonctionnalités présenter lors de la démonstration ? Quels pièges éviter ?
- Comment déployer en production ? Docker ou plateforme cloud ?
- Comment mettre en place l'intégration continue et les contrôles de qualité du code ?

L'étape Preview résout ces problèmes en générant automatiquement des instructions d'exécution complètes et des configurations de déploiement.

## Quand utiliser cette approche

L'étape Preview est la 7ème étape du pipeline, également la dernière, qui suit immédiatement l'étape Validation.

**Scénarios d'utilisation typiques** :

| Scénario | Description |
| -------- | ----------- |
| Démonstration MVP | Besoin de présenter l'application à l'équipe ou aux clients, nécessite un guide d'exécution détaillé |
| Collaboration en équipe | Nouveaux membres rejoignant le projet, besoin de démarrer rapidement l'environnement de développement |
| Déploiement en production | Préparation de la mise en ligne de l'application, nécessite les configurations Docker et les pipelines CI/CD |
| Publication d'applications mobiles | Besoin de configurer Expo EAS, préparation de la soumission à l'App Store et Google Play |

**Scénarios non applicables** :

- Uniquement consultation du code sans exécution (l'étape Preview est obligatoire)
- Code n'ayant pas réussi l'étape Validation (corriger d'abord les problèmes avant d'exécuter Preview)

## 🎒 Préparation avant de commencer

::: warning Prérequis

Ce cours suppose que vous avez déjà :

1. **Terminé l'étape Validation** : Le fichier `artifacts/validation/report.md` doit exister et la validation doit être réussie
2. **Compris l'architecture de l'application** : Clair sur la pile technologique backend et frontend, les modèles de données et les points de terminaison API
3. **Familiarisé avec les concepts de base** : Compréhension des concepts de base de Docker, CI/CD, Git Hooks

:::

**Concepts à connaître** :

::: info Qu'est-ce que Docker ?

Docker est une plateforme de conteneurisation qui peut empaqueter une application et ses dépendances dans un conteneur portable.

**Avantages clés** :

- **Cohérence de l'environnement** : Les environnements de développement, de test et de production sont identiques, évitant le problème "ça marche sur ma machine"
- **Déploiement rapide** : Une seule commande pour démarrer toute la pile d'application
- **Isolation des ressources** : Les conteneurs ne s'influencent pas les uns les autres, améliorant la sécurité

**Concepts de base** :

```
Dockerfile → Image (Image) → Conteneur (Container)
```

:::

::: info Qu'est-ce que CI/CD ?

CI/CD (Intégration Continue/Déploiement Continu) est une pratique de développement logiciel automatisée.

**CI (Intégration Continue)** :
- Exécute automatiquement les tests et les vérifications à chaque commit
- Détecte les problèmes de code tôt
- Améliore la qualité du code

**CD (Déploiement Continu)** :
- Build automatique et déploiement d'applications
- Déploiement rapide de nouvelles fonctionnalités en production
- Réduit les erreurs d'opération manuelle

**GitHub Actions** est la plateforme CI/CD fournie par GitHub, définissant les flux de travail automatisés via les fichiers de configuration `.github/workflows/*.yml`.

:::

::: info Qu'est-ce que Git Hooks ?

Git Hooks sont des scripts exécutés automatiquement à des moments spécifiques des opérations Git.

**Hooks courants** :

- **pre-commit** : Exécute les vérifications de code et le formatage avant le commit
- **commit-msg** : Valide le format du message de commit
- **pre-push** : Exécute les tests complets avant le push

**Husky** est un outil populaire de gestion des Git Hooks, utilisé pour simplifier la configuration et la maintenance des Hooks.

:::

## Idée centrale

Le cœur de l'étape Preview est de **préparer la documentation complète d'utilisation et de déploiement pour l'application**, mais en suivant le principe "local d'abord, risques transparents".

### Cadre de pensée

L'agent Preview suit le cadre de pensée suivant :

| Principe | Description |
| -------- | ----------- |
| **Local d'abord** | S'assurer que toute personne ayant un environnement de développement de base peut démarrer localement |
| **Prêt pour le déploiement** | Fournir tous les fichiers de configuration nécessaires au déploiement en production |
| **Stories utilisateur** | Concevoir des flux de démonstration courts montrant la valeur centrale |
| **Risques transparents** | Lister activement les limitations ou problèmes connus de la version actuelle |

### Structure des fichiers de sortie

L'agent Preview génère deux types de fichiers :

**Fichiers obligatoires** (nécessaires pour chaque projet) :

| Fichier | Description | Emplacement |
| ------- | ----------- | ----------- |
| `README.md` | Documentation principale d'exécution | `artifacts/preview/README.md` |
| `Dockerfile` | Configuration Docker backend | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Docker Compose environnement de développement | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Modèle de variables d'environnement de production | `artifacts/backend/.env.production.example` |
| `eas.json` | Configuration de build Expo EAS | `artifacts/client/eas.json` |

**Fichiers recommandés** (nécessaires pour la production) :

| Fichier | Description | Emplacement |
| ------- | ----------- | ----------- |
| `DEPLOYMENT.md` | Guide de déploiement détaillé | `artifacts/preview/DEPLOYMENT.md` |
| `docker-compose.production.yml` | Docker Compose environnement de production | Racine du projet |

### Structure du document README

`artifacts/preview/README.md` doit inclure les sections suivantes :

```markdown
# [Nom du projet]

## Démarrage rapide

### Exigences d'environnement
- Node.js >= 18
- npm >= 9
- [Autres dépendances]

### Démarrage backend
[Installation des dépendances, configuration de l'environnement, initialisation de la base de données, démarrage du service]

### Démarrage frontend
[Installation des dépendances, configuration de l'environnement, démarrage du serveur de développement]

### Vérification de l'installation
[Commandes de test, vérification de santé]

---

## Flux de démonstration

### Préparation
### Étapes de démonstration
### Précautions de démonstration

---

## Problèmes connus et limitations

### Limitations de fonctionnalités
### Dette technique
### Opérations à éviter lors de la démonstration

---

## Questions fréquentes
```

## Flux de travail de l'agent Preview

L'agent Preview est un agent IA chargé de rédiger des guides d'exécution et des configurations de déploiement pour les applications générées. Son flux de travail est le suivant :

### Fichiers d'entrée

L'agent Preview ne peut lire que les fichiers suivants :

| Fichier | Description | Emplacement |
| ------- | ----------- | ----------- |
| Code backend | Application backend validée | `artifacts/backend/` |
| Code frontend | Application frontend validée | `artifacts/client/` |

### Fichiers de sortie

L'agent Preview doit générer les fichiers suivants :

| Fichier | Description | Emplacement |
| ------- | ----------- | ----------- |
| `README.md` | Documentation principale d'exécution | `artifacts/preview/README.md` |
| `Dockerfile` | Configuration Docker backend | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Docker Compose environnement de développement | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Modèle de variables d'environnement de production | `artifacts/backend/.env.production.example` |
| `eas.json` | Configuration de build Expo EAS | `artifacts/client/eas.json` |

### Étapes d'exécution

1. **Explorer le code** : Analyser les répertoires backend et frontend, déterminer les commandes d'installation des dépendances et de démarrage
2. **Rédiger le README** : Suivre les instructions de `skills/preview/skill.md`, rédiger un guide clair d'installation et d'exécution
3. **Générer les configurations Docker** : Créer Dockerfile et docker-compose.yml
4. **Configurer EAS** : Générer les fichiers de configuration de build Expo EAS (application mobile)
5. **Préparer le flux de démonstration** : Concevoir des descriptions de scénarios de démonstration courts
6. **Lister les problèmes connus** : Lister activement les défauts ou limitations de la version actuelle

## Suivez-moi : Exécuter l'étape Preview

### Étape 1 : Confirmer que l'étape Validation est terminée

**Pourquoi**

L'agent Preview doit lire `artifacts/backend/` et `artifacts/client/`. Si le code n'a pas réussi la validation, la documentation générée par l'étape Preview peut être inexacte.

**Action**

```bash
# Vérifier le rapport de validation
cat artifacts/validation/report.md
```

**Ce que vous devriez voir** : Le rapport de validation montre que toutes les vérifications backend et frontend ont réussi.

```
✅ Backend Dependencies: OK
✅ Backend Type Check: OK
✅ Prisma Schema: OK
✅ Frontend Dependencies: OK
✅ Frontend Type Check: OK
```

### Étape 2 : Exécuter l'étape Preview

**Pourquoi**

Utiliser l'assistant IA pour exécuter l'agent Preview, générant automatiquement le guide d'exécution et les configurations de déploiement.

**Action**

```bash
# Utiliser Claude Code pour exécuter l'étape preview
factory run preview
```

**Ce que vous devriez voir** :

```
✓ Étape actuelle: preview
✓ Chargement du code backend: artifacts/backend/
✓ Chargement du code frontend: artifacts/client/
✓ Démarrage de l'agent Preview

L'agent Preview génère le guide d'exécution et les configurations de déploiement...

[L'assistant IA exécutera les opérations suivantes]
1. Analyser la structure des projets backend et frontend
2. Générer README.md (installation, exécution, flux de démonstration)
3. Créer Dockerfile et docker-compose.yml
4. Configurer les fichiers de build Expo EAS
5. Préparer le modèle de variables d'environnement de production
6. Lister les problèmes connus et limitations

Attente de la fin de l'agent...
```

### Étape 3 : Vérifier le README généré

**Pourquoi**

Vérifier que le README est complet, valider que les étapes d'installation et les commandes d'exécution sont claires.

**Action**

```bash
# Voir le guide d'exécution
cat artifacts/preview/README.md
```

**Ce que vous devriez voir** : Un guide d'exécution complet incluant les sections suivantes

```markdown
# Assistant de recommandation de restaurants IA

## Démarrage rapide

### Exigences d'environnement

- Node.js >= 18
- npm >= 9
- Docker (optionnel, pour le déploiement conteneurisé)

### Démarrage backend

```bash
# Entrer dans le répertoire backend
cd artifacts/backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env pour remplir la configuration nécessaire

# Initialiser la base de données
npx prisma migrate dev

# (Optionnel) Remplir les données de test
npm run db:seed

# Démarrer le serveur de développement
npm run dev
```

Backend fonctionne sur : http://localhost:3000
Vérification de santé : http://localhost:3000/health
Documentation API : http://localhost:3000/api-docs

### Démarrage frontend

```bash
# Entrer dans le répertoire frontend
cd artifacts/client

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer API_URL pour pointer vers l'adresse backend

# Démarrer le serveur de développement
npm start
```

- Simulateur iOS : Appuyez sur `i`
- Simulateur Android : Appuyez sur `a`
- Navigateur Web : Appuyez sur `w`

### Vérification de l'installation

Exécutez les commandes suivantes pour vérifier que l'installation a réussi :

```bash
# Tests backend
cd artifacts/backend && npm test

# Tests frontend
cd artifacts/client && npm test

# Vérification de santé API
curl http://localhost:3000/health
```

---

## Flux de démonstration

### Préparation

1. Assurez-vous que le backend et le frontend sont tous les deux démarrés
2. Videz ou réinitialisez les données de démonstration (optionnel)

### Étapes de démonstration

1. **Présentation du scénario** (30 secondes)
   - Présenter l'utilisateur cible : utilisateurs voulant essayer de nouveaux restaurants
   - Présenter le problème central : difficulté de choix, ne pas savoir quoi manger

2. **Démonstration des fonctionnalités** (3-5 minutes)
   - Étape 1 : L'utilisateur saisit ses préférences (cuisine, goût, budget)
   - Étape 2 : L'IA recommande des restaurants basés sur les préférences
   - Étape 3 : L'utilisateur consulte les résultats et sélectionne

3. **Points forts techniques** (optionnel, 1 minute)
   - Recommandations IA en temps réel (appel à l'API OpenAI)
   - Design responsive mobile
   - Persistance de base de données locale

### Précautions de démonstration

- Assurez-vous que la connexion réseau fonctionne (les recommandations IA nécessitent un appel API)
- Évitez de saisir des préférences trop longues ou vagues (peuvent conduire à des recommandations inexactes)
- Ne modifiez pas la base de données lors de la démonstration (peut affecter l'effet de la démonstration)

---

## Problèmes connus et limitations

### Limitations de fonctionnalités

- [ ] L'inscription et la connexion des utilisateurs ne sont pas encore prises en charge
- [ ] Les favoris et l'historique ne sont pas encore pris en charge
- [ ] Les recommandations IA ne prennent en charge que la saisie de texte, pas encore la voix ou les images

### Dette technique

- [ ] La gestion des erreurs frontend n'est pas parfaite
- [ ] La journalisation backend doit être optimisée
- [ ] Les index de base de données ne sont pas optimisés (pas d'impact sur de petits volumes de données)

### Opérations à éviter lors de la démonstration

- Essayer de s'inscrire ou de se connecter - Peut interrompre la démonstration
- Saisir des caractères spéciaux ou du texte trop long - Peut déclencher des erreurs
- Requêtes successives rapides - Peut déclencher la limitation de l'API

---

## Questions fréquentes

### Q : Que faire si le port est occupé ?

R : Modifiez la variable `PORT` dans `.env` ou terminez d'abord le processus occupant le port.

### Q : Que faire si la connexion à la base de données échoue ?

R : Vérifiez que la configuration `DATABASE_URL` dans `.env` est correcte, assurez-vous que la base de données est démarrée.

### Q : Que faire si les recommandations IA ne répondent pas ?

R : Vérifiez que `OPENAI_API_KEY` dans `.env` est valide, assurez-vous que la connexion réseau fonctionne.
```

### Étape 4 : Vérifier la configuration Docker générée

**Pourquoi**

Vérifier que la configuration Docker est correcte, assurer un build et une exécution fluides des conteneurs.

**Action**

```bash
# Voir Dockerfile
cat artifacts/backend/Dockerfile

# Voir docker-compose.yml
cat artifacts/backend/docker-compose.yml
```

**Ce que vous devriez voir** : Fichiers de configuration conformes aux meilleures pratiques Docker

**Exemple de Dockerfile** :

```dockerfile
# Image de base
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci --only=production

# Générer Prisma Client
RUN npx prisma generate

# Copier le code source
COPY . .

# Build
RUN npm run build

# Image de production
FROM node:20-alpine AS production

WORKDIR /app

# Installer les dépendances de production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Exposer le port
EXPOSE 3000

# Vérification de santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Commande de démarrage
CMD ["npm", "start"]
```

**Exemple de docker-compose.yml** :

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./dev.db
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### Étape 5 : Vérifier la configuration EAS

**Pourquoi**

Vérifier que la configuration Expo EAS est correcte, assurer un build et une publication fluides de l'application mobile.

**Action**

```bash
# Voir la configuration EAS
cat artifacts/client/eas.json
```

**Ce que vous devriez voir** : Configuration incluant trois environnements : development, preview, production

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "http://localhost:3000"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api-staging.your-domain.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.your-domain.com"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Étape 6 : Vérifier les conditions de sortie

**Pourquoi**

Sisyphus vérifiera si l'agent Preview satisfait les conditions de sortie ; si non, il demandera une réexécution.

**Liste de vérification**

| Élément de vérification | Description | Passé/Échoué |
| ----------------------- | ----------- | ------------ |
| README inclut les étapes d'installation | Liste clairement les commandes d'installation des dépendances pour le backend et le frontend | [ ] |
| README inclut les commandes d'exécution | Fournit respectivement les commandes de démarrage du backend et du frontend | [ ] |
| README liste les adresses d'accès et le flux de démonstration | Indique les adresses et ports à accéder lors de la démonstration | [ ] |
| La configuration Docker peut être build normalement | Dockerfile et docker-compose.yml sans erreurs de syntaxe | [ ] |
| Le modèle de variables d'environnement de production est complet | .env.production.example inclut toutes les configurations requises | [ ] |

**En cas d'échec** :

```bash
# Réexécuter l'étape Preview
factory run preview
```

## Point de contrôle ✅

**Confirmez que vous avez terminé** :

- [ ] L'étape Preview a réussi
- [ ] Le fichier `artifacts/preview/README.md` existe et son contenu est complet
- [ ] Le fichier `artifacts/backend/Dockerfile` existe et peut être build
- [ ] Le fichier `artifacts/backend/docker-compose.yml` existe
- [ ] Le fichier `artifacts/backend/.env.production.example` existe
- [ ] Le fichier `artifacts/client/eas.json` existe (application mobile)
- [ ] Le README inclut des étapes d'installation claires et des commandes d'exécution
- [ ] Le README inclut le flux de démonstration et les problèmes connus

## Avertissements sur les pièges

### ⚠️ Piège 1 : Ignorer les étapes d'installation des dépendances

**Problème** : Le README ne mentionne que "démarrer le service", sans expliquer comment installer les dépendances.

**Symptôme** : Les nouveaux membres suivant le README obtiennent une erreur "module introuvable" lors de l'exécution de `npm run dev`.

**Solution** : L'agent Preview contraint "le README doit inclure les étapes d'installation", s'assurant que chaque étape a une commande claire.

**Exemple correct** :

```bash
# ❌ Erreur - Étapes d'installation manquantes
npm run dev

# ✅ Correct - Inclut les étapes complètes
npm install
npm run dev
```

### ⚠️ Piège 2 : Utiliser l'étiquette latest dans la configuration Docker

**Problème** : Le Dockerfile utilise `FROM node:latest` ou `FROM node:alpine`.

**Symptôme** : Chaque build peut utiliser une version différente de Node.js, entraînant une incohérence de l'environnement.

**Solution** : L'agent Preview contraint "NE JAMAIS utiliser latest comme étiquette d'image Docker, utiliser un numéro de version spécifique".

**Exemple correct** :

```dockerfile
# ❌ Erreur - Utilisation de latest
FROM node:latest

# ❌ Erreur - Version spécifique non spécifiée
FROM node:alpine

# ✅ Correct - Utilisation d'une version spécifique
FROM node:20-alpine
```

### ⚠️ Piège 3 : Codage en dur des variables d'environnement

**Problème** : Codage en dur d'informations sensibles (mots de passe, clés API, etc.) dans la configuration Docker ou EAS.

**Symptôme** : Fuite d'informations sensibles dans le dépôt de code, risque de sécurité.

**Solution** : L'agent Preview contraint "NE JAMAIS coder en dur d'informations sensibles dans les configurations de déploiement", utiliser des modèles de variables d'environnement.

**Exemple correct** :

```yaml
# ❌ Erreur - Mot de passe de base de données codé en dur
DATABASE_URL=postgresql://user:password123@host:5432/database

# ✅ Correct - Utilisation de variables d'environnement
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}
```

### ⚠️ Piège 4 : Cacher les problèmes connus

**Problème** : Le README ne liste pas les problèmes connus et les limitations, exagérant les capacités du produit.

**Symptôme** : Apparition inattendue lors de la démonstration, entraînant de l'embarras et une baisse de confiance.

**Solution** : L'agent Preview contraint "NE JAMAIS exagérer les fonctionnalités ou cacher les défauts", lister activement les problèmes existants de la version actuelle.

**Exemple correct** :

```markdown
## Problèmes connus et limitations

### Limitations de fonctionnalités
- [ ] L'inscription et la connexion des utilisateurs ne sont pas encore prises en charge
- [ ] Les recommandations IA peuvent être inexactes (dépendant des résultats de l'API OpenAI)
```

### ⚠️ Piège 5 : Flux de démonstration trop complexe

**Problème** : Le flux de démonstration comprend 10+ étapes, nécessitant plus de 10 minutes.

**Symptôme** : Le présentateur ne se souvient pas des étapes, le public perd patience.

**Solution** : L'agent Preview contraint "le flux de démonstration doit être contrôlé entre 3-5 minutes, pas plus de 5 étapes".

**Exemple correct** :

```markdown
### Étapes de démonstration

1. **Présentation du scénario** (30 secondes)
   - Présenter l'utilisateur cible et le problème central

2. **Démonstration des fonctionnalités** (3-5 minutes)
   - Étape 1 : L'utilisateur saisit ses préférences
   - Étape 2 : L'IA recommande basé sur les préférences
   - Étape 3 : L'utilisateur consulte les résultats

3. **Points forts techniques** (optionnel, 1 minute)
   - Recommandations IA en temps réel
   - Design responsive mobile
```

## Modèles de configuration CI/CD

L'agent Preview peut référencer `templates/cicd-github-actions.md` pour générer des configurations CI/CD, incluant :

### Pipeline CI backend

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run linter
        working-directory: backend
        run: npm run lint

      - name: Run type check
        working-directory: backend
        run: npx tsc --noEmit

      - name: Validate Prisma schema
        working-directory: backend
        run: npx prisma validate

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Run tests
        working-directory: backend
        run: npm test
```

### Pipeline CI frontend

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'client/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'client/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: client/package-lock.json

      - name: Install dependencies
        working-directory: client
        run: npm ci

      - name: Run linter
        working-directory: client
        run: npm run lint

      - name: Run type check
        working-directory: client
        run: npx tsc --noEmit

      - name: Run tests
        working-directory: client
        run: npm test -- --coverage
```

## Modèles de configuration Git Hooks

L'agent Preview peut référencer `templates/git-hooks-husky.md` pour générer des configurations Git Hooks, incluant :

### Hook pre-commit

Exécuter les vérifications de code et le formatage avant le commit.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Exécuter lint-staged
npx lint-staged

# Vérifier les types TypeScript
echo "📝 Type checking..."
npm run type-check

echo "✅ Pre-commit checks passed!"
```

### Hook commit-msg

Valider le format du message de commit.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📋 Validating commit message..."

npx --no -- commitlint --edit "$1"

echo "✅ Commit message is valid!"
```

## Résumé du cours

L'étape Preview est le dernier maillon du pipeline, responsable de la préparation de la documentation complète d'utilisation et de déploiement pour les applications générées. Elle génère automatiquement :

- **Guide d'exécution** : Étapes d'installation claires, commandes de démarrage et flux de démonstration
- **Configuration Docker** : Dockerfile et docker-compose.yml, supportant le déploiement conteneurisé
- **Configuration EAS** : Configuration de build Expo EAS, supportant la publication d'applications mobiles
- **Configuration CI/CD** : Pipelines GitHub Actions, supportant l'intégration continue et le déploiement
- **Git Hooks** : Configuration Husky, supportant les vérifications pré-commit

**Principes clés** :

1. **Local d'abord** : S'assurer que toute personne ayant un environnement de développement de base peut démarrer localement
2. **Prêt pour le déploiement** : Fournir tous les fichiers de configuration nécessaires au déploiement en production
3. **Stories utilisateur** : Concevoir des flux de démonstration courts montrant la valeur centrale
4. **Risques transparents** : Lister activement les limitations ou problèmes connus de la version actuelle

Après avoir terminé l'étape Preview, vous obtiendrez :

- ✅ Guide d'exécution complet (`README.md`)
- ✅ Configuration de conteneurisation Docker (`Dockerfile`, `docker-compose.yml`)
- ✅ Modèle de variables d'environnement de production (`.env.production.example`)
- ✅ Configuration de build Expo EAS (`eas.json`)
- ✅ Guide de déploiement détaillé optionnel (`DEPLOYMENT.md`)

## Aperçu du prochain cours

> Félicitations ! Vous avez terminé toutes les 7 étapes d'AI App Factory.
>
> Si vous souhaitez approfondir le mécanisme de coordination du pipeline, vous pouvez apprendre **[Exploration détaillée de l'orchestrateur Sisyphus](../orchestrator/)**.
>
> Vous apprendrez :
> - Comment l'orchestrateur coordonne l'exécution du pipeline
> - Les mécanismes de vérification des autorisations et de traitement des dépassements
> - La gestion des échecs et les stratégies de rollback
> - L'optimisation du contexte et les techniques d'économie de tokens

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-29

| Fonctionnalité | Chemin du fichier | Numéro de ligne |
| -------------- | ---------------- | --------------- |
| Définition de l'agent Preview | [`source/hyz1992/agent-app-factory/agents/preview.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/preview.agent.md) | 1-33 |
| Guide de compétences Preview | [`source/hyz1992/agent-app-factory/skills/preview/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/preview/skill.md) | 1-583 |
| Configuration du Pipeline | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 98-111 |
| Modèle de configuration CI/CD | [`source/hyz1992/agent-app-factory/templates/cicd-github-actions.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/cicd-github-actions.md) | 1-617 |
| Modèle de configuration Git Hooks | [`source/hyz1992/agent-app-factory/templates/git-hooks-husky.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/git-hooks-husky.md) | 1-530 |

**Contraintes clés** :
- **Local d'abord** : S'assurer que toute personne ayant un environnement de développement de base peut démarrer localement
- **Prêt pour le déploiement** : Fournir tous les fichiers de configuration nécessaires au déploiement en production
- **Risques transparents** : Lister activement les limitations ou problèmes connus de la version actuelle

**Fichiers à générer obligatoirement** :
- `artifacts/preview/README.md` - Documentation principale d'exécution
- `artifacts/backend/Dockerfile` - Configuration Docker backend
- `artifacts/backend/docker-compose.yml` - Docker Compose environnement de développement
- `artifacts/backend/.env.production.example` - Modèle de variables d'environnement de production
- `artifacts/client/eas.json` - Configuration de build Expo EAS

**Ne pas faire (NEVER)** :
- NEVER ignorer l'installation des dépendances ou les étapes de configuration, sinon l'exécution ou le déploiement échouera probablement
- NEVER fournir des instructions supplémentaires ou un langage marketing sans rapport avec l'application
- NEVER exagérer les capacités du produit, cacher les défauts ou les limitations
- NEVER coder en dur d'informations sensibles dans les configurations de déploiement (mots de passe, clés API, etc.)
- NEVER ignorer la configuration des vérifications de santé, cruciale pour la surveillance de la production
- NEVER sauter les explications de migration de base de données, étape clé de la mise en ligne
- NEVER utiliser `latest` comme étiquette d'image Docker, utiliser un numéro de version spécifique
- NEVER utiliser SQLite en production (doit migrer vers PostgreSQL)

</details>
