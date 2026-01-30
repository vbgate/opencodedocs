---
title: "Conception de l'architecture technique : Guide complet de la phase Tech | Tutoriel Agent App Factory"
sidebarTitle: "Conception de l'architecture technique"
subtitle: "Conception de l'architecture technique : Guide complet de la phase Tech"
description: "Apprenez comment la phase Tech de AI App Factory conçoit une architecture technique minimale viable et un modèle de données Prisma à partir du PRD, incluant le choix de la stack technique, la conception du modèle de données, la définition des API et la stratégie de migration de base de données."
order: 110
tags:
  - "Architecture technique"
  - "Modèle de données"
  - "Prisma"
prerequisite:
  - "advanced-stage-prd"
---

# Conception de l'architecture technique : Guide complet de la phase Tech

## Ce que vous pourrez faire après ce cours

En terminant cette leçon, vous serez capable de :

- Comprendre comment le Tech Agent conçoit l'architecture technique à partir du PRD
- Maîtriser les méthodes et contraintes de conception du Schéma Prisma
- Comprendre les principes de décision pour le choix de la stack technique
- Apprendre à concevoir un modèle de données et une API raisonnables pour un MVP
- Comprendre la stratégie de migration entre l'environnement de développement SQLite et l'environnement de production PostgreSQL

## Votre situation actuelle

Le PRD est rédigé, vous savez clairement quelles fonctionnalités développer, mais vous ne savez pas :

- Quelle stack technique choisir ? Node.js ou Python ?
- Comment concevoir les tables de données ? Comment définir les relations ?
- Quels endpoints API sont nécessaires ? Quelles normes suivre ?
- Comment garantir une conception qui permet une livraison rapide tout en supportant l'expansion future ?

La phase Tech résout précisément ces problèmes — elle génère automatiquement l'architecture technique et le modèle de données à partir du PRD.

## Quand utiliser cette approche

La phase Tech est la 4ème étape du pipeline, juste après la phase UI et avant la phase Code.

**Scénarios d'utilisation typiques** :

| Scénario | Explication |
| ---- | ---- |
| Lancement d'un nouveau projet | Après validation du PRD, une conception technique est nécessaire |
| Prototype MVP rapide | Besoin d'une architecture technique minimale viable pour éviter la surconception |
| Décision de stack technique | Incertitude sur la combinaison technologique la plus appropriée |
| Conception du modèle de données | Besoin de définir clairement les entités et les relations |

**Scénarios non applicables** :

- Projets avec une architecture technique déjà définie (la phase Tech la reconcevra)
- Développement uniquement frontend ou backend (la phase Tech conçoit une architecture full-stack)
- Besoin d'une architecture microservices (non recommandé pour la phase MVP)

## 🎒 Préparatifs

::: warning Prérequis

Cette leçon suppose que vous avez déjà :

1. **Complété la phase PRD** : Le fichier `artifacts/prd/prd.md` doit exister et être validé
2. **Compris les besoins produit** : Connaissance claire des fonctionnalités principales, des user stories et du périmètre MVP
3. **Familiarité avec les concepts de base** : Connaissance de base des API RESTful, des bases de données relationnelles et des ORM

:::

**Concepts à comprendre** :

::: info Qu'est-ce que Prisma ?

Prisma est un ORM (Object-Relational Mapping) moderne pour TypeScript/Node.js permettant d'opérer sur les bases de données.

**Avantages clés** :

- **Sécurité de type** : Génération automatique de types TypeScript avec complétion complète pendant le développement
- **Gestion des migrations** : `prisma migrate dev` gère automatiquement les changements de base de données
- **Expérience développeur** : Prisma Studio pour visualiser et éditer les données

**Flux de travail de base** :

```
Définir schema.prisma → Exécuter migration → Générer Client → Utiliser dans le code
```

:::

::: info Pourquoi SQLite en développement et PostgreSQL en production ?

**SQLite (environnement de développement)** :

- Zéro configuration, base de données fichier (`dev.db`)
- Légère et rapide, idéale pour le développement local et les démonstrations
- Ne supporte pas les écritures concurrentes

**PostgreSQL (environnement de production)** :

- Fonctionnalités complètes, supporte la concurrence et les requêtes complexes
- Excellente performance, adaptée au déploiement en production
- Migration transparente avec Prisma : modification uniquement de `DATABASE_URL`

**Stratégie de migration** : Prisma s'adapte automatiquement au fournisseur de base de données selon `DATABASE_URL`, sans modification manuelle du Schema.

:::

## Concepts clés

Le cœur de la phase Tech est la **transformation des besoins produit en solution technique**, en suivant le principe « MVP First ».

### Cadre de réflexion

Le Tech Agent suit ce cadre de réflexion :

| Principe | Explication |
| ---- | ---- |
| **Alignement des objectifs** | La solution technique doit servir la valeur produit principale |
| **Simplicité prioritaire** | Choisir des stacks techniques éprouvées pour une livraison rapide |
| **Extensibilité** | Prévoir des points d'extension dans la conception pour supporter l'évolution future |
| **Data-driven** | Exprimer les entités et relations à travers un modèle de données clair |

### Arbre de décision pour le choix de stack

**Stack backend** :

| Composant | Recommandé | Alternative | Explication |
| ---- | ---- | ---- | ---- |
| **Runtime** | Node.js + TypeScript | Python + FastAPI | Écosystème Node.js riche, unification frontend/backend |
| **Framework Web** | Express | Fastify | Express mature et stable, middlewares riches |
| **ORM** | Prisma 5.x | TypeORM | Prisma sécurisé en types, excellente gestion des migrations |
| **Base de données** | SQLite (développement) / PostgreSQL (production) | - | SQLite zéro configuration, PostgreSQL production-ready |

**Stack frontend** :

| Scénario | Recommandé | Explication |
| ---- | ---- | ---- |
| Mobile uniquement | React Native + Expo | Cross-platform, hot reload |
| Mobile + Web | React Native Web | Un seul code, multi-plateforme |
| Web uniquement | React + Vite | Excellente performance, écosystème mature |

**Gestion d'état** :

| Complexité | Recommandé | Explication |
| ---- | ---- | ---- |
| Simple (< 5 états globaux) | React Context API | Zéro dépendance, faible courbe d'apprentissage |
| Complexité moyenne | Zustand | Léger, API concise, bonnes performances |
| Application complexe | Redux Toolkit | ⚠️ Non recommandé en phase MVP, trop complexe |

### Principes de conception du modèle de données

**Identification des entités** :

1. Extraire les noms des user stories du PRD → entités candidates
2. Distinguer les entités principales (obligatoires) des entités auxiliaires (optionnelles)
3. Chaque entité doit avoir une signification métier claire

**Conception des relations** :

| Type de relation | Exemple | Explication |
| ---- | ---- | ---- |
| Un-à-plusieurs (1:N) | User → Posts | Un utilisateur a plusieurs articles |
| Plusieurs-à-plusieurs (M:N) | Posts ↔ Tags | Articles et tags (via table intermédiaire) |
| Un-à-un (1:1) | User → UserProfile | ⚠️ Rarement utilisé, généralement fusionnable |

**Principes des champs** :

- **Champs obligatoires** : `id`, `createdAt`, `updatedAt`
- **Éviter la redondance** : Ne pas stocker les champs calculables ou récupérables par association
- **Types appropriés** : String, Int, Float, Boolean, DateTime
- **Marquer les champs sensibles** : Les mots de passe ne doivent pas être stockés en clair

### ⚠️ Contraintes de compatibilité SQLite

Le Tech Agent doit respecter ces exigences de compatibilité SQLite lors de la génération du Schéma Prisma :

#### Interdiction des Composite Types

SQLite ne supporte pas les définitions `type` de Prisma, il faut utiliser `String` pour stocker le JSON.

```prisma
// ❌ Erreur - Non supporté par SQLite
type UserProfile {
  identity String
  ageRange String
}

model User {
  id      Int        @id @default(autoincrement())
  profile UserProfile
}

// ✅ Correct - Utilisation de String pour stocker le JSON
model User {
  id      Int    @id @default(autoincrement())
  profile String // JSON: {"identity":"student","ageRange":"18-25"}
}
```

#### Spécification des commentaires JSON

Documenter la structure JSON dans le Schéma avec des commentaires :

```prisma
model User {
  id      Int    @id @default(autoincrement())
  // Format JSON: {"identity":"student","ageRange":"18-25"}
  profile String
}
```

Définir l'interface correspondante dans le code TypeScript :

```typescript
// src/types/index.ts
export interface UserProfile {
  identity: string;
  ageRange: string;
}
```

#### Verrouillage de version Prisma

Il est impératif d'utiliser Prisma 5.x, pas 7.x (problèmes de compatibilité) :

```json
{
  "dependencies": {
    "@prisma/client": "5.22.0",
    "prisma": "5.22.0"
  }
}
```

## Flux de travail du Tech Agent

Le Tech Agent est un Agent IA responsable de concevoir l'architecture technique à partir du PRD. Son flux de travail est le suivant :

### Fichiers d'entrée

Le Tech Agent peut uniquement lire les fichiers suivants :

| Fichier | Explication | Emplacement |
| ---- | ---- | ---- |
| `prd.md` | Document des exigences produit | `artifacts/prd/prd.md` |

### Fichiers de sortie

Le Tech Agent doit générer les fichiers suivants :

| Fichier | Explication | Emplacement |
| ---- | ---- | ---- |
| `tech.md` | Document d'architecture et de solution technique | `artifacts/tech/tech.md` |
| `schema.prisma` | Définition du modèle de données | `artifacts/backend/prisma/schema.prisma` |

### Étapes d'exécution

1. **Lire le PRD** : Identifier les fonctionnalités principales, les flux de données et les contraintes
2. **Choisir la stack technique** : Sélectionner le langage, le framework et la base de données selon `skills/tech/skill.md`
3. **Concevoir le modèle de données** : Définir les entités, attributs et relations, exprimés via le schéma Prisma
4. **Rédiger le document technique** : Expliquer les raisons des choix, la stratégie d'expansion et les non-objectifs dans `tech.md`
5. **Générer les fichiers de sortie** : Écrire la conception dans les chemins spécifiés, sans modifier les fichiers en amont

### Conditions de sortie

L'ordonnanceur Sisyphus vérifiera si le Tech Agent remplit les conditions suivantes :

- ✅ Déclaration explicite de la stack technique (backend, frontend, base de données)
- ✅ Cohérence du modèle de données avec le PRD (toutes les entités proviennent du PRD)
- ✅ Absence d'optimisation prématurée ou de surconception

## Pratique guidée : Exécuter la phase Tech

### Étape 1 : Confirmer la complétion de la phase PRD

**Pourquoi**

Le Tech Agent doit lire `artifacts/prd/prd.md`, si le fichier n'existe pas, la phase Tech ne peut pas s'exécuter.

**Action**

```bash
# Vérifier si le fichier PRD existe
cat artifacts/prd/prd.md
```

**Vous devriez voir** : Un document PRD structuré contenant l'utilisateur cible, la liste des fonctionnalités, les non-objectifs, etc.

### Étape 2 : Exécuter la phase Tech

**Pourquoi**

Utiliser l'assistant IA pour exécuter le Tech Agent et générer automatiquement l'architecture technique et le modèle de données.

**Action**

```bash
# Utiliser Claude Code pour exécuter la phase tech
factory run tech
```

**Vous devriez voir** :

```
✓ Phase actuelle : tech
✓ Chargement du document PRD : artifacts/prd/prd.md
✓ Démarrage du Tech Agent

Le Tech Agent conçoit l'architecture technique...

[L'assistant IA exécutera les opérations suivantes]
1. Analyser le PRD, extraire les entités et fonctionnalités
2. Choisir la stack technique (Node.js + Express + Prisma)
3. Concevoir le modèle de données (entités User, Post, etc.)
4. Définir les endpoints API
5. Générer tech.md et schema.prisma

En attente de la fin de l'Agent...
```

### Étape 3 : Consulter le document technique généré

**Pourquoi**

Vérifier si le document technique est complet et si la conception est raisonnable.

**Action**

```bash
# Consulter le document technique
cat artifacts/tech/tech.md
```

**Vous devriez voir** : Un document technique complet contenant les sections suivantes

```markdown
## Stack technique

**Backend**
- Runtime : Node.js 20+
- Langage : TypeScript 5+
- Framework : Express 4.x
- ORM : Prisma 5.x
- Base de données : SQLite (développement) / PostgreSQL (production)

**Frontend**
- Framework : React Native + Expo
- Langage : TypeScript
- Navigation : React Navigation 6
- Gestion d'état : React Context API
- Client HTTP : Axios

## Conception de l'architecture

**Structure en couches**
- Couche routes (routes/) : Définition des endpoints API
- Couche contrôleurs (controllers/) : Traitement des requêtes et réponses
- Couche services (services/) : Logique métier
- Couche accès données : ORM Prisma

**Flux de données**
Client → API Gateway → Contrôleur → Service → Prisma → Base de données

## Conception des endpoints API

| Endpoint | Méthode | Description | Corps de requête | Réponse |
|------|------|------|--------|------|
| /api/items | GET | Obtenir la liste | - | Item[] |
| /api/items/:id | GET | Obtenir les détails | - | Item |
| /api/items | POST | Créer | CreateItemDto | Item |
| /api/items/:id | PUT | Mettre à jour | UpdateItemDto | Item |
| /api/items/:id | DELETE | Supprimer | - | { deleted: true } |

## Modèle de données

### User
- id : Clé primaire
- email : Email (obligatoire)
- name : Nom (obligatoire)
- createdAt : Date de création
- updatedAt : Date de mise à jour

**Relations** :
- posts : Un-à-plusieurs (un utilisateur a plusieurs articles)

## Variables d'environnement

**Backend (.env)**
- PORT : Port du service (défaut 3000)
- DATABASE_URL : Chaîne de connexion à la base de données
- NODE_ENV : Environnement (development/production)
- CORS_ORIGINS : Origines CORS autorisées

**Frontend (.env)**
- EXPO_PUBLIC_API_URL : Adresse de l'API backend

## Points d'extension futurs

**Court terme (v1.1)**
- Ajouter la pagination et le filtrage
- Implémenter l'export de données

**Moyen terme (v2.0)**
- Migration vers PostgreSQL
- Ajouter l'authentification utilisateur

**Long terme**
- Décomposition en microservices
- Ajouter une couche de cache (Redis)
```

### Étape 4 : Consulter le Schéma Prisma généré

**Pourquoi**

Vérifier si le modèle de données est conforme au PRD et s'il respecte les contraintes de compatibilité SQLite.

**Action**

```bash
# Consulter le Schéma Prisma
cat artifacts/backend/prisma/schema.prisma
```

**Vous devriez voir** : Un Schéma conforme à la syntaxe Prisma 5.x, contenant des définitions d'entités complètes et leurs relations

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // Environnement de développement
  url      = "file:./dev.db"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User     @relation(fields: [authorId], references: [id])
}
```

### Étape 5 : Vérifier les conditions de sortie

**Pourquoi**

L'ordonnanceur Sisyphus vérifiera si le Tech Agent remplit les conditions de sortie ; si ce n'est pas le cas, une réexécution sera demandée.

**Liste de vérification**

| Élément de vérification | Explication | Réussi/Échoué |
| ---- | ---- | ---- |
| Déclaration explicite de la stack technique | Backend, frontend, base de données clairement définis | [ ] |
| Cohérence du modèle de données avec le PRD | Toutes les entités proviennent du PRD, sans champs supplémentaires | [ ] |
| Absence d'optimisation prématurée ou de surconception | Conforme au périmètre MVP, sans fonctionnalités non validées | [ ] |

**En cas d'échec** :

```bash
# Réexécuter la phase Tech
factory run tech
```

## Point de contrôle ✅

**Confirmez que vous avez terminé** :

- [ ] La phase Tech s'est exécutée avec succès
- [ ] Le fichier `artifacts/tech/tech.md` existe et est complet
- [ ] Le fichier `artifacts/backend/prisma/schema.prisma` existe et a une syntaxe correcte
- [ ] Le choix de la stack technique est raisonnable (Node.js + Express + Prisma)
- [ ] Le modèle de données est cohérent avec le PRD, sans champs supplémentaires
- [ ] Le Schéma respecte les contraintes de compatibilité SQLite (pas de Composite Types)

## Avertissements sur les pièges

### ⚠️ Piège 1 : Surconception

**Problème** : Introduction de microservices, de caches complexes ou de fonctionnalités avancées en phase MVP.

**Symptôme** : Le fichier `tech.md` contient des termes comme « Architecture microservices », « Cache Redis », « Message queue ».

**Solution** : Le Tech Agent possède une liste `NEVER` interdisant explicitement la surconception. Si vous voyez ce contenu, réexécutez.

```markdown
## Ne pas faire (NEVER)
* **NEVER** surconcevoir, comme introduire des microservices, des files de messages complexes ou des caches haute performance en phase MVP
* **NEVER** écrire du code redondant pour des scénarios non encore déterminés
```

### ⚠️ Piège 2 : Erreur de compatibilité SQLite

**Problème** : Le Schéma Prisma utilise des fonctionnalités non supportées par SQLite.

**Symptôme** : Erreur lors de la phase Validation, ou échec de `npx prisma generate`.

**Erreurs courantes** :

```prisma
// ❌ Erreur - SQLite ne supporte pas les Composite Types
type UserProfile {
  identity String
  ageRange String
}

model User {
  profile UserProfile
}

// ❌ Erreur - Utilisation de la version 7.x
{
  "prisma": "^7.0.0"
}
```

**Solution** : Vérifiez le Schéma, assurez-vous d'utiliser String pour stocker le JSON, verrouillez la version Prisma sur 5.x.

### ⚠️ Piège 3 : Modèle de données hors périmètre MVP

**Problème** : Le Schéma contient des entités ou champs non définis dans le PRD.

**Symptôme** : Le nombre d'entités dans `tech.md` est significativement supérieur aux entités principales du PRD.

**Solution** : Le Tech Agent impose la contrainte « Le modèle de données doit couvrir toutes les entités et relations nécessaires aux fonctionnalités MVP, sans ajouter de champs non validés à l'avance ». Si des champs supplémentaires sont trouvés, supprimez-les ou marquez-les comme « Points d'extension futurs ».

### ⚠️ Piège 4 : Erreur de conception des relations

**Problème** : La définition des relations ne correspond pas à la logique métier réelle.

**Symptôme** : Une relation un-à-plusieurs est écrite comme plusieurs-à-plusieurs, ou une relation nécessaire est manquante.

**Exemple d'erreur** :

```prisma
// ❌ Erreur - Utilisateur et Article devraient être un-à-plusieurs, pas un-à-un
model User {
  id   Int    @id @default(autoincrement())
  post Post?  // Relation un-à-un
}

model Post {
  id      Int    @id @default(autoincrement())
  author  User?  // Devrait utiliser @relation
}
```

**Écriture correcte** :

```prisma
// ✅ Correct - Relation un-à-plusieurs
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

## Résumé de la leçon

La phase Tech est le pont du pipeline connectant les « besoins produit » et la « mise en œuvre du code ». À partir du PRD, elle conçoit automatiquement :

- **Stack technique** : Node.js + Express + Prisma (backend), React Native + Expo (frontend)
- **Modèle de données** : Schéma Prisma conforme aux exigences de compatibilité SQLite
- **Conception de l'architecture** : Structure en couches (Routes → Contrôleurs → Services → Données)
- **Définition des API** : Endpoints RESTful et flux de données

**Principes clés** :

1. **MVP First** : Ne concevoir que les fonctionnalités essentielles principales, éviter la surconception
2. **Simplicité prioritaire** : Choisir des stacks techniques matures et stables
3. **Data-driven** : Exprimer les entités et relations à travers un modèle de données clair
4. **Extensibilité** : Marquer les points d'extension futurs dans la documentation, sans les implémenter à l'avance

Après la phase Tech, vous obtiendrez :

- ✅ Document de solution technique complet (`tech.md`)
- ✅ Modèle de données conforme à la spécification Prisma 5.x (`schema.prisma`)
- ✅ Conception d'API claire et configuration environnementale

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Phase Code : Génération de code exécutable](../stage-code/)**.
>
> Vous apprendrez :
> - Comment le Code Agent génère du code frontend et backend à partir du UI Schema et de la conception Tech
> - Quelles fonctionnalités contiennent l'application générée (tests, documentation, CI/CD)
> - Comment valider la qualité du code généré
> - Exigences spécifiques et spécifications de sortie du Code Agent

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-29

| Fonctionnalité | Chemin du fichier | Numéro de ligne |
| ---- | ---- | ---- |
| Définition du Tech Agent | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 1-63 |
| Guide des compétences Tech | [`source/hyz1992/agent-app-factory/skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) | 1-942 |
| Configuration du Pipeline | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 49-62 |
| Contraintes de compatibilité SQLite | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 28-56 |

**Contraintes clés** :
- **Interdiction des Composite Types** : SQLite ne les supporte pas, utiliser String pour stocker le JSON
- **Verrouillage de version Prisma** : Doit utiliser 5.x, pas 7.x
- **Périmètre MVP** : Le modèle de données doit couvrir toutes les entités nécessaires aux fonctionnalités MVP, sans ajouter de champs non validés à l'avance

**Principes de décision de la stack technique** :
- Priorité aux langages et frameworks avec une communauté active et une documentation complète
- En phase MVP, choisir une base de données légère (SQLite), migrable vers PostgreSQL plus tard
- La stratification du système suit : Couche routes → Couche logique métier → Couche accès données

**Ne pas faire (NEVER)** :
- NEVER surconcevoir, comme introduire des microservices, des files de messages complexes ou des caches haute performance en phase MVP
- NEVER choisir des technologies peu utilisées ou mal maintenues
- NEVER ajouter des champs ou des relations non validés par le produit dans le modèle de données
- NEVER inclure des implémentations de code spécifiques dans le document technique

</details>
