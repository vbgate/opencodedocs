---
title: "Détails de la Stack Technique : Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "Détails de la Stack Technique"
subtitle: "Détails de la Stack Technique : Comprendre la stack technique utilisée pour générer les applications"
description: "Découvrez en profondeur la stack technique des applications générées par AI App Factory, y compris le backend (Node.js + Express + Prisma) et le frontend (React Native + Expo) avec la sélection complète des technologies, la chaîne d'outils et les meilleures pratiques."
tags:
  - "Stack Technique"
  - "Backend"
  - "Frontend"
  - "Déploiement"
order: 240
---

# Détails de la Stack Technique

Les applications générées par AI App Factory utilisent une stack technique éprouvée et prête pour la production, axée sur le développement rapide de MVP et l'évolutivité future. Ce document explique en détail les raisons de chaque choix technologique et ses cas d'utilisation.

---

## Ce que vous apprendrez à faire

- Comprendre les raisons derrière le choix technologique des applications générées
- Maîtriser les outils et frameworks principaux des stacks backend et frontend
- Comprendre pourquoi ces technologies ont été choisies plutôt que d'autres solutions
- Savoir comment ajuster la configuration technique en fonction des besoins du projet

---

## Aperçu des Technologies Clés

Les applications générées adoptent une approche **TypeScript Full Stack**, garantissant la sécurité des types et une expérience de développement cohérente entre le backend et le frontend.

| Couche | Choix Technologique | Version | Utilisation |
|------|-------------------|---------|-------------|
| **Runtime Backend** | Node.js | 16+ | Environnement d'exécution JavaScript côté serveur |
| **Langage Backend** | TypeScript | 5+ | Sur-ensemble de JavaScript avec sécurité de type |
| **Framework Backend** | Express | 4.x | Framework Web léger pour construire des API RESTful |
| **ORM** | Prisma | 5.x | Couche d'accès à la base de données avec sécurité de type |
| **Base de données de développement** | SQLite | - | Base de données de fichiers sans configuration, prototypage rapide |
| **Base de données de production** | PostgreSQL | - | Base de données relationnelle pour la production |
| **Framework Frontend** | React Native | - | Développement d'applications mobiles multiplateforme |
| **Chaîne d'outils Frontend** | Expo | - | Outils de développement et de construction React Native |
| **Navigation Frontend** | React Navigation | 6+ | Expérience de navigation de niveau natif |
| **Gestion d'état** | React Context API | - | Gestion d'état légère (phase MVP) |
| **Client HTTP** | Axios | - | Client HTTP pour navigateurs et Node.js |

---

## Détails de la Stack Technique Backend

### Node.js + TypeScript

**Pourquoi choisir Node.js ?**

- ✅ **Écosystème riche** : npm possède le plus grand écosystème de packages au monde
- ✅ **Unification backend-frontend** : L'équipe n'a besoin de maîtriser qu'un seul langage
- ✅ **Haute productivité** : Event-driven et I/O non bloquant pour les applications en temps réel
- ✅ **Communauté active** : Nombreuses bibliothèques open source et solutions

**Pourquoi choisir TypeScript ?**

- ✅ **Sécurité de type** : Capture les erreurs à la compilation, réduit les bugs runtime
- ✅ **Bonne expérience de développement** : IntelliSense, autocomplétion, support de refactorisation
- ✅ **Code maintenable** : Définitions d'interface claires améliorent l'efficacité de collaboration d'équipe
- ✅ **Parfaite intégration avec Prisma** : Génération automatique de définitions de type

**Exemple de configuration** :

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Framework Express

**Pourquoi choisir Express ?**

- ✅ **Mature et stable** : Framework Web Node.js le plus populaire
- ✅ **Middlewares riches** : Authentification, logging, CORS prêts à l'emploi
- ✅ **Flexibilité élevée** : N'oblige pas une structure de projet, organisation libre
- ✅ **Bon support communautaire** : Nombreux tutoriels et solutions aux problèmes

**Structure de projet typique** :

```
src/
├── config/         # Fichiers de configuration
│   ├── swagger.ts  # Configuration de documentation API Swagger
│   └── index.ts    # Configuration de l'application
├── lib/            # Bibliothèques utilitaires
│   ├── logger.ts   # Outil de logging
│   └── prisma.ts   # Singleton Prisma
├── middleware/     # Middlewares
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/         # Définitions de routes
│   ├── items.ts
│   └── index.ts
├── controllers/    # Couche de contrôleurs
│   ├── items.controller.ts
│   └── index.ts
├── services/       # Couche de logique métier
│   └── items.service.ts
├── validators/     # Validation d'entrée
│   └── items.validator.ts
├── __tests__/      # Fichiers de tests
│   └── items.test.ts
├── app.ts          # Application Express
└── index.ts        # Point d'entrée de l'application
```

**Middlewares principaux** :

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middlewares de sécurité
app.use(helmet());                          // En-têtes de sécurité
app.use(cors(corsOptions));                 // Configuration CORS

// Middlewares de traitement des requêtes
app.use(express.json());                    // Analyse JSON
app.use(compression());                     // Compression des réponses
app.use(requestLogger);                    // Journalisation des requêtes

// Middleware de gestion des erreurs (à la fin)
app.use(errorHandler);

export default app;
```

### ORM Prisma

**Pourquoi choisir Prisma ?**

- ✅ **Sécurité de type** : Génération automatique de définitions de type TypeScript
- ✅ **Gestion des migrations** : Schema déclaratif, génération automatique de scripts de migration
- ✅ **Bonne expérience de développement** : Support IntelliSense, messages d'erreur clairs
- ✅ **Support multi-base de données** : SQLite, PostgreSQL, MySQL, etc.
- ✅ **Performance excellente** : Optimisation des requêtes, gestion du pool de connexions

**Exemple de Schema typique** :

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"           // Environnement de développement
  // provider = "postgresql"   // Environnement de production
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Item {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  amount      Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([createdAt])  // Création manuelle d'index pour le tri
}
```

**Opérations de base de données courantes** :

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer
const item = await prisma.item.create({
  data: { title: 'Déjeuner', amount: 25.5 }
});

// Rechercher (supporte la pagination)
const items = await prisma.item.findMany({
  take: 20,       // Limiter le nombre
  skip: 0,        // Décalage
  orderBy: { createdAt: 'desc' }
});

// Mettre à jour
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: 'Dîner' }
});

// Supprimer
await prisma.item.delete({
  where: { id: 1 }
});
```

### Choix de la base de données

**Environnement de développement : SQLite**

- ✅ **Zéro configuration** : Base de données de fichiers, pas besoin d'installer de service
- ✅ **Démarrage rapide** : Convient au développement local et à l'itération rapide
- ✅ **Portable** : La base de données entière est un seul fichier `.db`
- ❌ **Pas d'écriture concurrente** : Les écritures simultanées multi-processus causent des conflits
- ❌ **Pas adapté à la production** : Performance et capacités concurrentes limitées

**Environnement de production : PostgreSQL**

- ✅ **Fonctionnalité complète** : Supporte les requêtes complexes, transactions, types JSON
- ✅ **Performance excellente** : Supporte la haute concurrence, index complexes
- ✅ **Stable et fiable** : Base de données de niveau entreprise, éprouvée
- ✅ **Écosystème mature** : Outils de sauvegarde et de surveillance riches

**Stratégie de migration de base de données** :

```bash
# Environnement de développement - Utilisation de SQLite
DATABASE_URL="file:./dev.db"

# Environnement de production - Utilisation de PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# Créer une migration
npx prisma migrate dev --name add_item_category

# Déploiement en production
npx prisma migrate deploy

# Réinitialiser la base de données (environnement de développement)
npx prisma migrate reset
```

---

## Détails de la Stack Technique Frontend

### React Native + Expo

**Pourquoi choisir React Native ?**

- ✅ **Multiplateforme** : Un seul code fonctionne sur iOS et Android
- ✅ **Performance native** : Compile en composants natifs, pas WebView
- ✅ **Mises à jour en direct** : Expo supporte les mises à jour sans republication
- ✅ **Composants riches** : La communauté fournit de nombreux composants de haute qualité

**Pourquoi choisir Expo ?**

- ✅ **Démarrage rapide** : Pas besoin de configurer un environnement de développement natif complexe
- ✅ **Chaîne d'outils unifiée** : Flux de développement, construction et déploiement unifiés
- ✅ **Expo Go** : Prévisualisation sur appareil réel en scannant un QR code
- ✅ **EAS Build** : Construction dans le cloud, supporte la publication App Store

**Structure de projet** :

```
src/
├── api/           # Appels API
│   ├── client.ts  # Instance Axios
│   └── items.ts   # API Items
├── components/    # Composants réutilisables
│   └── ui/        # Composants UI de base
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/         # Hooks personnalisés
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/    # Configuration de navigation
│   └── RootNavigator.tsx
├── screens/       # Composants d'écran
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/        # Styles et thèmes
│   └── theme.ts
└── types/         # Types TypeScript
    └── index.ts
```

**Exemple d'écran typique** :

```typescript
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useItems } from '@/hooks/useItems';
import { Card } from '@/components/ui/Card';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';

export function HomeScreen() {
  const { data, loading, error, refresh } = useItems();

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <Text>Échec du chargement : {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card title={item.title} description={item.description} />
        )}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

### React Navigation

**Pourquoi choisir React Navigation ?**

- ✅ **Recommandation officielle** : Solution de navigation officielle React Native
- ✅ **Sécurité de type** : TypeScript supporte les types complets de paramètres de navigation
- ✅ **Expérience native** : Fournit des modes de navigation native comme navigation en pile, navigation par onglets
- ✅ **Deep linking** : Supporte URL Scheme et deep linking

**Exemple de configuration de navigation** :

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Définir les types de paramètres de navigation
export type RootStackParamList = {
  Home: undefined;
  Detail: { itemId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Accueil' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `Détail ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Gestion d'état

**React Context API (Phase MVP)**

Convient aux applications simples, zéro dépendance :

```typescript
import React, { createContext, useContext, useState } from 'react';

interface ItemsContextType {
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }) {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (item: Omit<Item, 'id'>) => {
    setItems([...items, { ...item, id: Date.now() }]);
  };

  return (
    <ItemsContext.Provider value={{ items, addItem }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within ItemsProvider');
  }
  return context;
}
```

**Zustand (Applications de complexité moyenne)**

Bibliothèque légère de gestion d'état, API simple :

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ItemsStore {
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  removeItem: (id: number) => void;
}

export const useItemsStore = create<ItemsStore>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) =>
          set((state) => ({
            items: [...state.items, { ...item, id: Date.now() }]
          })),
        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id)
          })),
      }),
      { name: 'items-storage' } // Persister vers AsyncStorage
    )
  )
);
```

---

## Chaîne d'outils de développement

### Framework de tests

**Backend : Vitest**

```typescript
// src/__tests__/items.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Items API', () => {
  it('should return items list', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
```

**Frontend : Jest + React Native Testing Library**

```typescript
// src/screens/__tests__/HomeScreen.test.tsx
import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

describe('HomeScreen', () => {
  it('should render without crashing', () => {
    render(<HomeScreen />);
  });

  it('should show loading state initially', () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

### Documentation API : Swagger/OpenAPI

Les applications générées incluent automatiquement Swagger UI, accessible via `http://localhost:3000/api-docs`.

```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // Scanner les commentaires de routes
};

export const swaggerSpec = swaggerJsdoc(options);
```

### Logging et surveillance

**Logging backend : winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// Exemple d'utilisation
logger.info('Item created', { itemId: 1 });
logger.error('Failed to create item', { error: 'Database error' });
```

**Surveillance frontend** : Enregistre le temps de requêtes API, les erreurs et les métriques de performance.

---

## Outils de déploiement

### Docker + docker-compose

Les applications générées incluent `Dockerfile` et `docker-compose.yml`, supportant le déploiement conteneurisé.

**Exemple docker-compose.yml** :

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/appdb
    depends_on:
      - postgres
```

### CI/CD : GitHub Actions

Flux de test, construction et déploiement automatisés :

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

---

## Principes de choix de la stack technique

Les principes fondamentaux du choix de cette stack technique par AI App Factory :

### 1. Simplicité d'abord

- Choisir des technologies matures et stables, réduire les coûts d'apprentissage
- Éviter la sur-conception, se concentrer sur les fonctionnalités principales
- Démarrage zéro configuration, validation rapide des idées

### 2. Sécurité de type

- Utilisation unifiée de TypeScript entre backend et frontend
- Prisma génère automatiquement les types de base de données
- React Navigation paramètres de navigation sécurisés par type

### 3. Prêt pour la production

- Couverture de tests complète
- Configuration de déploiement fournie (Docker, CI/CD)
- Logging, surveillance, gestion d'erreurs complets

### 4. Évolutivité

- Points d'extension réservés (comme le cache, files de messages)
- Support des migrations de base de données (SQLite → PostgreSQL)
- Architecture modulaire, facile à diviser et refactoriser

### 5. Focus MVP

- Définition claire des non-objectifs, pas d'introduction de fonctionnalités non principales comme authentification, autorisation
- Limite du nombre de pages (maximum 3 pages)
- Livraison rapide, itérations ultérieures

---

## Questions fréquentes

### Q : Pourquoi ne pas utiliser NestJS ?

**R** : NestJS est un excellent framework, mais trop complexe pour la phase MVP. Express est plus léger et plus flexible, adapté au prototypage rapide. Si la taille du projet augmente ultérieurement, une migration vers NestJS peut être envisagée.

### Q : Pourquoi ne pas utiliser MongoDB ?

**R** : La plupart des modèles de données d'applications MVP sont relationnels, PostgreSQL ou SQLite sont plus appropriés. MongoDB convient aux données documentaires, sauf si des fonctionnalités NoSQL sont clairement nécessaires, son utilisation n'est pas recommandée.

### Q : Pourquoi ne pas utiliser Redux ?

**R** : Redux convient aux grandes applications, mais le coût d'apprentissage est élevé. En phase MVP, React Context API ou Zustand sont suffisants. Si la gestion d'état devient complexe ultérieurement, Redux Toolkit peut être introduit.

### Q : Pourquoi ne pas utiliser GraphQL ?

**R** : L'API RESTful est plus simple, convient à la plupart des applications CRUD. L'avantage de GraphQL réside dans les requêtes flexibles et la réduction du nombre de requêtes, mais en phase MVP, l'API REST est suffisante et la documentation Swagger est plus complète.

### Q : Pourquoi ne pas utiliser Next.js ?

**R** : Next.js est un framework React, adapté au SSR et aux applications Web. L'objectif de ce projet est de générer des applications mobiles, React Native est le meilleur choix. Si une version Web est nécessaire, React Native Web peut être utilisé.

---

## Comparaison des stacks techniques

### Comparaison des frameworks backend

| Framework | Avantages | Inconvénients | Scenarios applicables |
|-----------|-----------|---------------|----------------------|
| **Express** | Léger, flexible, écosystème riche | Structure à configurer manuellement | Applications de taille moyenne/petite, services API |
| **NestJS** | Sécurité de type, modulaire, injection de dépendances | Courbe d'apprentissage raide, sur-conception | Grandes applications d'entreprise |
| **Fastify** | Haute performance, validation intégrée | Écosystème plus petit | Scénarios à haute concurrence |
| **Koa** | Léger, middlewares élégants | Documentation et écosystème inférieurs à Express | Scénarios nécessitant un contrôle fine-grained |

### Comparaison des frameworks frontend

| Framework | Avantages | Inconvénients | Scenarios applicables |
|-----------|-----------|---------------|----------------------|
| **React Native** | Multiplateforme, performance native, écosystème riche | Nécessite d'apprendre le développement natif | Applications iOS + Android |
| **Flutter** | Performance excellente, cohérence UI | Écosystème de langage Dart plus petit | Scénarios nécessitant une performance extrême |
| **Ionic** | Stack Web, démarrage rapide | Pas de performance Native | Applications hybrides simples |

### Comparaison des bases de données

| Base de données | Avantages | Inconvénients | Scenarios applicables |
|----------------|-----------|---------------|----------------------|
| **PostgreSQL** | Fonctionnalité complète, performance excellente | Nécessite un déploiement séparé | Environnement de production |
| **SQLite** | Zéro configuration, léger | Pas d'écriture concurrente | Environnement de développement, applications de petite taille |
| **MySQL** | Populaire, documentation riche | Fonctionnalité légèrement inférieure à PostgreSQL | Applications Web traditionnelles |

---

## Suggestions d'extension

Avec le développement du projet, les extensions suivantes peuvent être envisagées :

### Extensions à court terme (v1.1)

- Ajouter une couche de cache Redis
- Introduire la recherche Elasticsearch
- Implémenter l'authentification et l'autorisation (JWT)
- Ajouter la communication en temps réel WebSocket

### Extensions à moyen terme (v2.0)

- Migrer vers une architecture microservices
- Introduire des files de messages (RabbitMQ/Kafka)
- Ajouter l'accélération CDN
- Implémenter le support multi-langues

### Extensions à long terme

- Introduire l'API GraphQL
- Implémenter une architecture Serverless
- Ajouter des fonctionnalités IA/ML
- Implémenter le support multi-tenants

---

## Aperçu de la prochaine leçon

> La prochaine leçon apprendrons **[Référence des commandes CLI](../cli-commands/)**.
>
> Vous apprendrez :
> - Comment `factory init` initialise le projet
> - Comment `factory run` exécute le pipeline
> - Comment `factory continue` continue l'exécution dans une nouvelle session
> - Paramètres et utilisation d'autres commandes courantes

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour développer et voir l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-29

| Fonctionnalité        | Chemin du fichier                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Aperçu de la stack technique   | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (Lignes 211-230) |
| Guide d'architecture technique | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| Guide de génération de code | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| Template Backend     | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| Template Frontend     | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**Configuration de la stack technique clé** :
- **Backend** : Node.js + Express + Prisma + SQLite/PostgreSQL
- **Frontend** : React Native + Expo + React Navigation + Zustand
- **Tests** : Vitest (backend) + Jest (frontend)
- **Déploiement** : Docker + GitHub Actions

**Pourquoi ces technologies** :
- **Simplicité d'abord** : Démarrage zéro configuration, validation rapide des idées
- **Sécurité de type** : TypeScript + Prisma génération automatique de types
- **Prêt pour la production** : Tests complets, documentation, configuration de déploiement
- **Évolutivité** : Points d'extension réservés pour cache, files de messages, etc.

</details>
