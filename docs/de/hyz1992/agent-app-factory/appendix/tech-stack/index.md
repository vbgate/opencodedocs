---
title: "Technologie-Stack im Detail: Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "Technologie-Stack"
subtitle: "Technologie-Stack im Detail: Verstehen Sie den Technologie-Stack der generierten Apps"
description: "Erfahren Sie mehr über den Technologie-Stack der von AI App Factory generierten Apps, einschließlich Backend (Node.js + Express + Prisma) und Frontend (React Native + Expo) mit vollständiger Technologieauswahl, Toolchain und Best Practices."
tags:
  - "Technologie-Stack"
  - "Backend"
  - "Frontend"
  - "Deployment"
order: 240
---

# Technologie-Stack im Detail

Die von AI App Factory generierten Apps verwenden einen bewährten, produktionsreifen Technologie-Stack, der sich auf schnelle MVP-Entwicklung und nachträgliche Skalierbarkeit konzentriert. Dieses Dokument erklärt im Detail die Gründe für jede technische Entscheidung und deren Anwendungsfälle.

---

## Was Sie nach diesem Kurs können

- Die technischen Entscheidungen der generierten App verstehen
- Die Kernwerkzeuge und Frameworks des Frontend- und Backend-Stacks beherrschen
- Verstehen, warum diese Technologien statt anderer Alternativen gewählt wurden
- Wissen, wie Sie die Technologiekonfiguration an die Projektanforderungen anpassen

---

## Kern-Technologie-Übersicht

Die generierten Apps verwenden einen **Full-Stack TypeScript**-Ansatz, um Typsicherheit und konsistente Entwicklungserfahrung im Frontend und Backend zu gewährleisten.

| Ebene | Technologie | Version | Zweck |
|------|------------|---------|-------|
| **Backend-Laufzeit** | Node.js | 16+ | JavaScript-Server-Laufzeitumgebung |
| **Backend-Sprache** | TypeScript | 5+ | Typsichere JavaScript-Superset |
| **Backend-Framework** | Express | 4.x | Leichtes Web-Framework zum Erstellen RESTful APIs |
| **ORM** | Prisma | 5.x | Typsichere Datenbankzugriffsschicht |
| **Entwicklungsdatenbank** | SQLite | - | Konfigurationsfreie Dateidatenbank für schnelles Prototyping |
| **Produktionsdatenbank** | PostgreSQL | - | Relationale Datenbank für Produktionsumgebungen |
| **Frontend-Framework** | React Native | - | Cross-Plattform Mobile-App-Entwicklung |
| **Frontend-Toolchain** | Expo | - | React Native-Entwicklungs- und Build-Tools |
| **Frontend-Navigation** | React Navigation | 6+ | Native-artige Navigationserfahrung |
| **Zustandsverwaltung** | React Context API | - | Leichte Zustandsverwaltung (MVP-Phase) |
| **HTTP-Client** | Axios | - | HTTP-Client für Browser und Node.js |

---

## Backend-Technologie-Stack im Detail

### Node.js + TypeScript

**Warum Node.js?**

- ✅ **Reiches Ökosystem**: npm verfügt über das weltweit größte Paketökosystem
- ✅ **Einheitliche Sprache**: Team muss nur eine Sprache beherrschen
- ✅ **Hohe Entwicklungseffizienz**: Ereignisgesteuerte, nicht-blockierende I/O für Echtzeitanwendungen
- ✅ **Aktive Community**: Zahlreiche Open-Source-Bibliotheken und Lösungen

**Warum TypeScript?**

- ✅ **Typsicherheit**: Kompilierzeit-Fehlererkennung, reduziert Laufzeit-Bugs
- ✅ **Gute Entwicklungserfahrung**: IntelliSense, Autovervollständigung, Refactoring-Unterstützung
- ✅ **Wartbarer Code**: Klare Schnittstellendefinitionen verbessern die Team-Zusammenarbeit
- ✅ **Perfekte Integration mit Prisma**: Automatische Generierung von Typdefinitionen

**Konfigurationsbeispiel**:

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

### Express-Framework

**Warum Express?**

- ✅ **Reif und stabil**: Beliebtestes Node.js-Web-Framework
- ✅ **Reiche Middleware**: Authentifizierung, Logging, CORS sofort einsatzbereit
- ✅ **Hohe Flexibilität**: Keine erzwungene Projektstruktur, freie Organisation
- ✅ **Gute Community-Unterstützung**: Zahlreiche Tutorials und Problemlösungen

**Typische Projektstruktur**:

```
src/
├── config/         # Konfigurationsdateien
│   ├── swagger.ts  # Swagger API-Dokumentationskonfiguration
│   └── index.ts    # Anwendungskonfiguration
├── lib/            # Bibliotheken
│   ├── logger.ts   # Logging-Tool
│   └── prisma.ts   # Prisma-Singleton
├── middleware/     # Middleware
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/         # Routendefinitionen
│   ├── items.ts
│   └── index.ts
├── controllers/    # Controller-Schicht
│   ├── items.controller.ts
│   └── index.ts
├── services/       # Geschäftslogik-Schicht
│   └── items.service.ts
├── validators/     # Eingabevalidierung
│   └── items.validator.ts
├── __tests__/      # Testdateien
│   └── items.test.ts
├── app.ts          # Express-Anwendung
└── index.ts        # Anwendungseinstieg
```

**Kern-Middleware**:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Sicherheits-Middleware
app.use(helmet());                          // Sicherheits-Header
app.use(cors(corsOptions));                 // CORS-Konfiguration

// Request-Verarbeitungs-Middleware
app.use(express.json());                    // JSON-Parsing
app.use(compression());                     // Antwortkomprimierung
app.use(requestLogger);                    // Request-Logging

// Fehlerbehandlungs-Middleware (zuletzt)
app.use(errorHandler);

export default app;
```

### Prisma ORM

**Warum Prisma?**

- ✅ **Typsicherheit**: Automatische Generierung von TypeScript-Typdefinitionen
- ✅ **Migrationsverwaltung**: Deklaratives Schema, automatische Generierung von Migrationsskripten
- ✅ **Gute Entwicklungserfahrung**: IntelliSense-Unterstützung, klare Fehlermeldungen
- ✅ **Mehrere Datenbanken**: SQLite, PostgreSQL, MySQL usw.
- ✅ **Exzellente Performance**: Abfrageoptimierung, Verbindungspool-Verwaltung

**Typisches Schema-Beispiel**:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"           // Entwicklungsumgebung
  // provider = "postgresql"   // Produktionsumgebung
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

  @@index([createdAt])  // Manueller Index für Sortierung
}
```

**Häufige Datenbankoperationen**:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Erstellen
const item = await prisma.item.create({
  data: { title: 'Mittagessen', amount: 25.5 }
});

// Abfragen (unterstützt Paginierung)
const items = await prisma.item.findMany({
  take: 20,       // Anzahl begrenzen
  skip: 0,        // Offset
  orderBy: { createdAt: 'desc' }
});

// Aktualisieren
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: 'Abendessen' }
});

// Löschen
await prisma.item.delete({
  where: { id: 1 }
});
```

### Datenbankauswahl

**Entwicklungsumgebung: SQLite**

- ✅ **Null-Konfiguration**: Dateidatenbank, keine Service-Installation erforderlich
- ✅ **Schneller Start**: Geeignet für lokale Entwicklung und schnelle Iteration
- ✅ **Portabel**: Gesamte Datenbank ist eine `.db`-Datei
- ❌ **Keine gleichzeitigen Schreibvorgänge**: Konflikte bei gleichzeitigen Multi-Prozess-Schreibvorgängen
- ❌ **Nicht für die Produktion geeignet**: Begrenzte Performance und Parallelitätsfähigkeit

**Produktionsumgebung: PostgreSQL**

- ✅ **Vollständig**: Unterstützt komplexe Abfragen, Transaktionen, JSON-Typen
- ✅ **Exzellente Performance**: Unterstützt hohe Parallelität, komplexe Indizes
- ✅ **Stabil und zuverlässig**: Enterprise-Datenbank, bewährt
- ✅ **Reife Community**: Reiche Backup- und Monitoring-Tools

**Datenbankmigrationsstrategie**:

```bash
# Entwicklungsumgebung - SQLite verwenden
DATABASE_URL="file:./dev.db"

# Produktionsumgebung - PostgreSQL verwenden
DATABASE_URL="postgresql://user:password@host:5432/database"

# Migration erstellen
npx prisma migrate dev --name add_item_category

# Produktions-Deployment
npx prisma migrate deploy

# Datenbank zurücksetzen (Entwicklungsumgebung)
npx prisma migrate reset
```

---

## Frontend-Technologie-Stack im Detail

### React Native + Expo

**Warum React Native?**

- ✅ **Cross-Plattform**: Ein Code läuft auf iOS und Android
- ✅ **Native Performance**: Kompiliert zu nativen Komponenten, kein WebView
- ✅ **Hot-Updates**: Expo unterstützt Updates ohne Neupublishing
- ✅ **Reiche Komponenten**: Community bietet zahlreiche hochwertige Komponenten

**Warum Expo?**

- ✅ **Schneller Start**: Keine komplexe native Entwicklungsumgebung erforderlich
- ✅ **Einheitliche Toolchain**: Einheitlicher Entwicklungs-, Build- und Deploy-Prozess
- ✅ **Expo Go**: Vorschau auf echten Geräten per QR-Code
- ✅ **EAS Build**: Cloud-Build, unterstützt App Store-Veröffentlichung

**Projektstruktur**:

```
src/
├── api/           # API-Aufrufe
│   ├── client.ts  # Axios-Instanz
│   └── items.ts   # Items-API
├── components/    # Wiederverwendbare Komponenten
│   └── ui/        # Basis-UI-Komponenten
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/         # Custom Hooks
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/    # Navigationskonfiguration
│   └── RootNavigator.tsx
├── screens/       # Seitenkomponenten
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/        # Styles und Theme
│   └── theme.ts
└── types/         # TypeScript-Typen
    └── index.ts
```

**Typisches Seitenbeispiel**:

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
    return <Text>Laden fehlgeschlagen: {error.message}</Text>;
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

**Warum React Navigation?**

- ✅ **Offiziell empfohlen**: Offizielles React Native-Navigationskonzept
- ✅ **Typsicherheit**: TypeScript unterstützt vollständige Navigationsparametertypen
- ✅ **Native Erfahrung**: Bietet Stack-Navigation, Tab-Navigation usw.
- ✅ **Deep-Linking**: Unterstützt URL-Schemes und Deep-Links

**Navigationskonfigurationsbeispiel**:

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Navigationsparametertypen definieren
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
          options={{ title: 'Startseite' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `Details ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Zustandsverwaltung

**React Context API (MVP-Phase)**

Geeignet für einfache Apps, ohne Abhängigkeiten:

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

**Zustand (Apps mittlerer Komplexität)**

Leichte Zustandsverwaltungsbibliothek, einfache API:

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
      { name: 'items-storage' } // Persistenz zu AsyncStorage
    )
  )
);
```

---

## Entwicklungstoolchain

### Test-Frameworks

**Backend: Vitest**

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

**Frontend: Jest + React Native Testing Library**

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

### API-Dokumentation: Swagger/OpenAPI

Die generierte App enthält automatisch Swagger UI, zugänglich unter `http://localhost:3000/api-docs`.

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
  apis: ['./src/routes/*.ts'], // Routenkommentare scannen
};

export const swaggerSpec = swaggerJsdoc(options);
```

### Logging und Monitoring

**Backend-Logging: winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// Verwendungsbeispiel
logger.info('Item created', { itemId: 1 });
logger.error('Failed to create item', { error: 'Database error' });
```

**Frontend-Monitoring**: Erfasst API-Request-Dauer, Fehler und Performance-Metriken.

---

## Deployment-Tools

### Docker + docker-compose

Die generierte App enthält `Dockerfile` und `docker-compose.yml`, unterstützt Container-Deployment.

**docker-compose.yml Beispiel**:

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

### CI/CD: GitHub Actions

Automatisierter Test-, Build- und Deploy-Prozess:

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

## Technologie-Stack-Auswahlprinzipien

Die Kernprinzipien von AI App Factory bei der Auswahl dieses Technologie-Stacks:

### 1. Einfachheit zuerst

- Auswahl reifer, stabiler Technologien, geringere Lernkosten
- Überdesign vermeiden, Fokus auf Kernfunktionalität
- Null-Konfigurations-Start, schnelle Ideenverifizierung

### 2. Typsicherheit

- Einheitliche Nutzung von TypeScript im Frontend und Backend
- Prisma generiert automatisch Datenbanktypen
- Typsichere Navigationsparameter in React Navigation

### 3. Produktionsbereit

- Vollständige Testabdeckung
- Bereitstellungskonfiguration (Docker, CI/CD)
- Umfassendes Logging, Monitoring und Fehlerbehandlung

### 4. Skalierbarkeit

- Erweiterungspunkte vorbereitet (z. B. Caching, Message Queue)
- Unterstützung von Datenbankmigrationen (SQLite → PostgreSQL)
- Modulare Architektur, erleichtert Aufspaltung und Refactoring

### 5. MVP-Fokus

- Klare Nicht-Ziele, keine Einführung von Authentifizierung, Autorisierung usw.
- Begrenzung der Seitenzahl (maximal 3 Seiten)
- Schnelle Lieferung, nachfolgende Iterationen

---

## Häufig gestellte Fragen

### F: Warum nicht NestJS?

**A**: NestJS ist ein hervorragendes Framework, aber zu komplex für die MVP-Phase. Express ist leichter und flexibler, geeignet für schnelles Prototyping. Wenn die Projektgröße wächst, kann eine Migration zu NestJS in Betracht gezogen werden.

### F: Warum nicht MongoDB?

**A**: Die meisten MVP-Apps haben relationale Datenmodelle, PostgreSQL oder SQLite sind geeigneter. MongoDB eignet sich für dokumentenbasierte Daten. Wenn keine NoSQL-Features explizit benötigt werden, wird die Verwendung nicht empfohlen.

### F: Warum nicht Redux?

**A**: Redux eignet sich für große Apps, aber die Lernkurve ist steil. React Context API oder Zustand sind in der MVP-Phase ausreichend. Wenn die Zustandsverwaltung komplexer wird, kann Redux Toolkit später eingeführt werden.

### F: Warum nicht GraphQL?

**A**: RESTful API ist einfacher, geeignet für die meisten CRUD-Apps. Die Stärke von GraphQL liegt in flexiblen Abfragen und reduzierten Anfragen, aber REST API reicht in der MVP-Phase, und die Swagger-Dokumentation ist vollständiger.

### F: Warum nicht Next.js?

**A**: Next.js ist ein React-Framework, geeignet für SSR und Web-Apps. Das Ziel dieses Projekts ist die Generierung mobiler Apps, React Native ist die bessere Wahl. Wenn eine Web-Version benötigt wird, kann React Native Web verwendet werden.

---

## Technologie-Stack-Vergleich

### Backend-Framework-Vergleich

| Framework | Vorteile | Nachteile | Anwendungsszenario |
|-----------|----------|-----------|-------------------|
| **Express** | Leicht, flexibel, reiches Ökosystem | Manuelle Strukturkonfiguration erforderlich | Mittelgroße Apps, API-Dienste |
| **NestJS** | Typsicherheit, modular, Dependency Injection | Steile Lernkurve, Overdesign | Große Enterprise-Apps |
| **Fastify** | Hohe Performance, integrierte Validierung | Kleineres Ökosystem | Hoch parallele Szenarien |
| **Koa** | Leicht, elegante Middleware | Dokumentation und Ökosystem nicht so gut wie Express | Szenarien mit fine-grained Kontrolle |

### Frontend-Framework-Vergleich

| Framework | Vorteile | Nachteile | Anwendungsszenario |
|-----------|----------|-----------|-------------------|
| **React Native** | Cross-Plattform, native Performance, reiches Ökosystem | Native-Entwicklung erforderlich | iOS + Android Apps |
| **Flutter** | Exzellente Performance, konsistente UI | Kleineres Dart-Ökosystem | Szenarien mit extremer Performance |
| **Ionic** | Web-Stack, schneller Einstieg | Keine Native-Performance | Einfache Hybrid-Apps |

### Datenbank-Vergleich

| Datenbank | Vorteile | Nachteile | Anwendungsszenario |
|-----------|----------|-----------|-------------------|
| **PostgreSQL** | Vollständig, exzellente Performance | Separate Bereitstellung erforderlich | Produktionsumgebung |
| **SQLite** | Null-Konfiguration, leicht | Keine gleichzeitigen Schreibvorgänge | Entwicklungsumgebung, kleine Apps |
| **MySQL** | Beliebt, reiche Dokumentation | Etwas weniger Features als PostgreSQL | Traditionelle Web-Apps |

---

## Erweiterungsempfehlungen

Mit der Projektentwicklung können folgende Erweiterungen in Betracht gezogen werden:

### Kurzfristige Erweiterung (v1.1)

- Redis-Caching-Schicht hinzufügen
- Elasticsearch-Suche einführen
- Authentifizierung und Autorisierung (JWT) implementieren
- WebSocket-Echtzeitkommunikation hinzufügen

### Mittelfristige Erweiterung (v2.0)

- Migration zu Microservices-Architektur
- Message Queue einführen (RabbitMQ/Kafka)
- CDN-Beschleunigung hinzufügen
- Mehrsprachunterstützung implementieren

### Langfristige Erweiterung

- GraphQL API einführen
- Serverless-Architektur implementieren
- AI/ML-Funktionen hinzufügen
- Multi-Tenant-Unterstützung implementieren

---

## Vorschau auf die nächste Lektion

> Die nächste Lektion: **[CLI-Befehlsreferenz](../cli-commands/)**.
>
> Sie werden lernen:
> - Wie `factory init` ein Projekt initialisiert
> - Wie `factory run` die Pipeline ausführt
> - Wie `factory continue` in einer neuen Sitzung weiter ausgeführt wird
> - Parameter und Verwendung anderer häufiger Befehle

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodeorte anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-29

| Funktion | Dateipfad |
|----------|-----------|
| Technologie-Stack-Übersicht | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (Zeilen 211-230) |
| Technologie-Architektur-Guide | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| Code-Generierungs-Guide | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| Backend-Template | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| Frontend-Template | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**Wichtige Technologie-Stack-Konfigurationen**:
- **Backend**: Node.js + Express + Prisma + SQLite/PostgreSQL
- **Frontend**: React Native + Expo + React Navigation + Zustand
- **Tests**: Vitest (Backend) + Jest (Frontend)
- **Deployment**: Docker + GitHub Actions

**Warum diese Technologien**:
- **Einfachheit zuerst**: Null-Konfigurations-Start, schnelle Ideenverifizierung
- **Typsicherheit**: TypeScript + Prisma automatische Typerzeugung
- **Produktionsbereit**: Vollständige Tests, Dokumentation, Bereitstellungskonfiguration
- **Skalierbarkeit**: Erweiterungspunkte wie Caching, Message Queue vorgesehen

</details>
