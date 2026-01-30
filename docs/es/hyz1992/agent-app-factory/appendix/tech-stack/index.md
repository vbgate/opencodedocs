---
title: "Stack Técnico Detallado: Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "Stack Técnico Detallado"
subtitle: "Stack Técnico Detallado: Conoce la pila tecnológica de la aplicación generada"
description: "Profundiza en el stack técnico de las aplicaciones generadas por AI App Factory, incluyendo el backend completo (Node.js + Express + Prisma) y frontend (React Native + Expo), selección tecnológica, toolchain y mejores prácticas."
tags:
  - "Stack Técnico"
  - "Backend"
  - "Frontend"
  - "Despliegue"
order: 240
---

# Stack Técnico Detallado

Las aplicaciones generadas por AI App Factory utilizan un stack tecnológico probado en producción, enfocado en el desarrollo rápido de MVP y la escalabilidad posterior. Este documento explica en detalle el porqué de cada elección tecnológica y sus casos de uso.

---

## Lo Que Aprenderás

- Comprender los motivos de selección tecnológica de la aplicación generada
- Dominar las herramientas y frameworks principales del stack frontend y backend
- Entender por qué se eligen estas tecnologías sobre otras alternativas
- Saber cómo ajustar la configuración técnica según los requerimientos del proyecto

---

## Visión General de la Tecnología Core

La aplicación generada adopta una solución **Full Stack TypeScript**, garantizando seguridad de tipos y consistencia en la experiencia de desarrollo tanto en frontend como backend.

| Capa | Selección Tecnológica | Versión | Propósito |
|------|---------------------|---------|-----------|
| **Runtime Backend** | Node.js | 16+ | Entorno de ejecución JavaScript del lado del servidor |
| **Lenguaje Backend** | TypeScript | 5+ | Superconjunto JavaScript con seguridad de tipos |
| **Framework Backend** | Express | 4.x | Framework web ligero para construir API RESTful |
| **ORM** | Prisma | 5.x | Capa de acceso a base de datos con seguridad de tipos |
| **Base de Datos Desarrollo** | SQLite | - | Base de datos sin configuración, ideal para prototipado rápido |
| **Base de Datos Producción** | PostgreSQL | - | Base de datos relacional para entorno de producción |
| **Framework Frontend** | React Native | - | Desarrollo de aplicaciones móviles multiplataforma |
| **Toolchain Frontend** | Expo | - | Herramientas de desarrollo y construcción para React Native |
| **Navegación Frontend** | React Navigation | 6+ | Experiencia de navegación a nivel nativo |
| **Gestión de Estado** | React Context API | - | Gestión de estado ligera (fase MVP) |
| **Cliente HTTP** | Axios | - | Cliente HTTP para navegador y Node.js |

---

## Stack Backend Detallado

### Node.js + TypeScript

**¿Por qué elegir Node.js?**

- ✅ **Ecosistema rico**: npm posee el ecosistema de paquetes más grande del mundo
- ✅ **Unificación frontend-backend**: el equipo solo necesita dominar un lenguaje
- ✅ **Alta eficiencia de desarrollo**: I/O no bloqueante y basado en eventos, ideal para aplicaciones en tiempo real
- ✅ **Comunidad activa**: abundantes bibliotecas de código abierto y soluciones

**¿Por qué elegir TypeScript?**

- ✅ **Seguridad de tipos**: captura errores en tiempo de compilación, reduce bugs en tiempo de ejecución
- ✅ **Excelente experiencia de desarrollo**: autocompletado inteligente, sugerencias y soporte de refactorización
- ✅ **Mantenibilidad del código**: definiciones explícitas de interfaz mejoran la eficiencia de colaboración del equipo
- ✅ **Integración perfecta con Prisma**: generación automática de definiciones de tipos

**Ejemplo de configuración**:

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

**¿Por qué elegir Express?**

- ✅ **Maduro y estable**: el framework web Node.js más popular
- ✅ **Middleware abundante**: autenticación, registro, CORS, etc. listos para usar
- ✅ **Alta flexibilidad**: no impone estructura de proyecto, organización libre
- ✅ **Excelente soporte comunitario**: abundantes tutoriales y soluciones a problemas

**Estructura típica de proyecto**:

```
src/
├── config/         # Archivos de configuración
│   ├── swagger.ts  # Configuración de documentación Swagger API
│   └── index.ts    # Configuración de la aplicación
├── lib/            # Bibliotecas de utilidades
│   ├── logger.ts   # Herramienta de registro
│   └── prisma.ts   # Singleton de Prisma
├── middleware/     # Middleware
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/         # Definiciones de rutas
│   ├── items.ts
│   └── index.ts
├── controllers/    # Capa de controladores
│   ├── items.controller.ts
│   └── index.ts
├── services/       # Capa de lógica de negocio
│   └── items.service.ts
├── validators/     # Validación de entrada
│   └── items.validator.ts
├── __tests__/      # Archivos de prueba
│   └── items.test.ts
├── app.ts          # Aplicación Express
└── index.ts        # Punto de entrada de la aplicación
```

**Middleware core**:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware de seguridad
app.use(helmet());                          // Headers de seguridad
app.use(cors(corsOptions));                 // Configuración CORS

// Middleware de procesamiento de solicitudes
app.use(express.json());                    // Análisis JSON
app.use(compression());                     // Compresión de respuesta
app.use(requestLogger);                    // Registro de solicitudes

// Middleware de manejo de errores (al final)
app.use(errorHandler);

export default app;
```

### ORM Prisma

**¿Por qué elegir Prisma?**

- ✅ **Seguridad de tipos**: generación automática de definiciones de tipos TypeScript
- ✅ **Gestión de migraciones**: schema declarativo, scripts de migración generados automáticamente
- ✅ **Excelente experiencia de desarrollo**: soporte IntelliSense, mensajes de error claros
- ✅ **Soporte multi-base de datos**: SQLite, PostgreSQL, MySQL, etc.
- ✅ **Excelente rendimiento**: optimización de consultas, gestión de pool de conexiones

**Ejemplo típico de Schema**:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"           // Entorno de desarrollo
  // provider = "postgresql"   // Entorno de producción
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

  @@index([createdAt])  // Crear índice manualmente para ordenamiento
}
```

**Operaciones comunes de base de datos**:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear
const item = await prisma.item.create({
  data: { title: 'Almuerzo', amount: 25.5 }
});

// Consultar (soporta paginación)
const items = await prisma.item.findMany({
  take: 20,       // Limitar cantidad
  skip: 0,        // Offset
  orderBy: { createdAt: 'desc' }
});

// Actualizar
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: 'Cena' }
});

// Eliminar
await prisma.item.delete({
  where: { id: 1 }
});
```

### Selección de Base de Datos

**Entorno de Desarrollo: SQLite**

- ✅ **Cero configuración**: base de datos de archivo, no requiere instalación de servicio
- ✅ **Inicio rápido**: adecuado para desarrollo local e iteración rápida
- ✅ **Portabilidad**: toda la base de datos es un archivo `.db`
- ❌ **No soporta escrituras concurrentes**: múltiples procesos escribiendo simultáneamente generan conflictos
- ❌ **No apto para producción**: rendimiento y capacidad de concurrencia limitados

**Entorno de Producción: PostgreSQL**

- ✅ **Funcionalidad completa**: soporta consultas complejas, transacciones, tipo JSON
- ✅ **Excelente rendimiento**: soporta alta concurrencia, índices complejos
- ✅ **Estable y confiable**: base de datos de nivel empresarial, probada en el tiempo
- ✅ **Ecosistema maduro**: herramientas de backup y monitoreo abundantes

**Estrategia de Migración de Base de Datos**:

```bash
# Entorno de desarrollo - usar SQLite
DATABASE_URL="file:./dev.db"

# Entorno de producción - usar PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# Crear migración
npx prisma migrate dev --name add_item_category

# Despliegue de producción
npx prisma migrate deploy

# Resetear base de datos (entorno de desarrollo)
npx prisma migrate reset
```

---

## Stack Frontend Detallado

### React Native + Expo

**¿Por qué elegir React Native?**

- ✅ **Multiplataforma**: un código base ejecutándose en iOS y Android
- ✅ **Rendimiento nativo**: compilado a componentes nativos, no WebView
- ✅ **Actualizaciones en caliente**: Expo soporta actualizaciones sin republicación
- ✅ **Componentes abundantes**: la comunidad provee gran cantidad de componentes de calidad

**¿Por qué elegir Expo?**

- ✅ **Inicio rápido**: no requiere configurar complejo entorno de desarrollo nativo
- ✅ **Toolchain unificada**: flujo unificado de desarrollo, construcción y despliegue
- ✅ **Expo Go**: escanea código QR para previsualizar en dispositivo real
- ✅ **EAS Build**: construcción en la nube, soporta publicación en App Store

**Estructura de proyecto**:

```
src/
├── api/           # Llamadas API
│   ├── client.ts  # Instancia Axios
│   └── items.ts   # API de Items
├── components/    # Componentes reutilizables
│   └── ui/        # Componentes UI base
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/         # Hooks personalizados
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/    # Configuración de navegación
│   └── RootNavigator.tsx
├── screens/       # Componentes de pantalla
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/        # Estilos y temas
│   └── theme.ts
└── types/         # Tipos TypeScript
    └── index.ts
```

**Ejemplo de página típica**:

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
    return <Text>Error de carga: {error.message}</Text>;
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

**¿Por qué elegir React Navigation?**

- ✅ **Recomendación oficial**: solución de navegación oficial de React Native
- ✅ **Seguridad de tipos**: soporte completo de TypeScript para parámetros de navegación
- ✅ **Experiencia nativa**: provee modos de navegación nativos como stack y tab
- ✅ **Deep linking**: soporte para URL Scheme y deep linking

**Ejemplo de configuración de navegación**:

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Definir tipos de parámetros de navegación
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
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `Detalle ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Gestión de Estado

**React Context API (fase MVP)**

Adecuado para aplicaciones simples, sin dependencias:

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
    throw new Error('useItems debe usarse dentro de ItemsProvider');
  }
  return context;
}
```

**Zustand (aplicaciones de complejidad media)**

Librería de gestión de estado ligera, con API concisa:

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
      { name: 'items-storage' } // Persistencia en AsyncStorage
    )
  )
);
```

---

## Toolchain de Desarrollo

### Framework de Pruebas

**Backend: Vitest**

```typescript
// src/__tests__/items.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Items API', () => {
  it('debería retornar lista de items', async () => {
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
  it('debería renderizar sin errores', () => {
    render(<HomeScreen />);
  });

  it('debería mostrar estado de carga inicialmente', () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

### Documentación API: Swagger/OpenAPI

Las aplicaciones generadas incluyen automáticamente Swagger UI, accesible en `http://localhost:3000/api-docs`.

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
  apis: ['./src/routes/*.ts'], // Escanear comentarios de rutas
};

export const swaggerSpec = swaggerJsdoc(options);
```

### Registro y Monitoreo

**Registro Backend: winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// Ejemplo de uso
logger.info('Item creado', { itemId: 1 });
logger.error('Error al crear item', { error: 'Database error' });
```

**Monitoreo Frontend**: registra tiempo de solicitud API, errores y métricas de rendimiento.

---

## Herramientas de Despliegue

### Docker + docker-compose

Las aplicaciones generadas incluyen `Dockerfile` y `docker-compose.yml`, soportando despliegue containerizado.

**Ejemplo de docker-compose.yml**:

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

Automatización de pruebas, construcción y despliegue:

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

## Principios de Selección del Stack Técnico

Los principios core detrás de la selección del stack técnico de AI App Factory:

### 1. Simplicidad Primero

- Elegir tecnologías maduras y estables, reducir costo de aprendizaje
- Evitar sobre-diseño, enfocarse en funcionalidad core
- Inicio sin configuración, validación rápida de ideas

### 2. Seguridad de Tipos

- Frontend y backend unifican TypeScript
- Prisma genera automáticamente tipos de base de datos
- Parámetros de navegación con seguridad de tipos en React Navigation

### 3. Listo para Producción

- Cobertura de pruebas completa incluida
- Proveer configuración de despliegue (Docker, CI/CD)
- Registro, monitoreo y manejo de errores completos

### 4. Escalabilidad

- Puntos de extensión reservados (ej. caché, message queue)
- Soporte de migración de base de datos (SQLite → PostgreSQL)
- Arquitectura modular, fácil de dividir y refactorizar

### 5. Enfoque MVP

- Clarificar no-objetivos, no introducir funcionalidades no-core como autenticación y autorización
- Limitar cantidad de páginas (máximo 3 páginas)
- Entrega rápida, iteración posterior

---

## Preguntas Frecuentes

### P: ¿Por qué no usar NestJS?

**R**: NestJS es un excelente framework, pero demasiado complejo para la fase MVP. Express es más ligero y flexible, adecuado para prototipado rápido. Si la escala del proyecto crece posteriormente, se puede considerar migrar a NestJS.

### P: ¿Por qué no usar MongoDB?

**R**: La mayoría de los modelos de datos de aplicaciones MVP son relacionales, PostgreSQL o SQLite son más adecuados. MongoDB es apropiado para datos tipo documento, a menos que se necesiten características específicas de NoSQL, no se recomienda usarlo.

### P: ¿Por qué no usar Redux?

**R**: Redux es adecuado para aplicaciones grandes, pero el costo de aprendizaje es alto. La fase MVP es suficiente con React Context API o Zustand. Si la gestión de estado se vuelve compleja posteriormente, se puede introducir Redux Toolkit.

### P: ¿Por qué no usar GraphQL?

**R**: RESTful API es más simple, adecuado para la mayoría de aplicaciones CRUD. La ventaja de GraphQL es la consulta flexible y la reducción de solicitudes, pero la fase MVP REST API es suficiente, y la documentación Swagger es más completa.

### P: ¿Por qué no usar Next.js?

**R**: Next.js es un framework React, adecuado para SSR y aplicaciones Web. El objetivo de este proyecto es generar aplicaciones móviles, React Native es una mejor opción. Si se necesita versión Web, se puede usar React Native Web.

---

## Comparación de Stacks Técnicos

### Comparación de Frameworks Backend

| Framework | Ventajas | Desventajas | Escenario Aplicable |
|-----------|----------|-------------|---------------------|
| **Express** | Ligero, flexible, ecosistema rico | Requiere configurar estructura manualmente | Aplicaciones medianas y pequeñas, servicios API |
| **NestJS** | Seguridad de tipos, modular, inyección de dependencias | Curva de aprendizaje pronunciada, sobre-diseño | Aplicaciones empresariales grandes |
| **Fastify** | Alto rendimiento, validación integrada | Ecosistema más pequeño | Escenarios de alta concurrencia |
| **Koa** | Ligero, middleware elegante | Documentación y ecosistema no tan buenos como Express | Escenarios que requieren control fino |

### Comparación de Frameworks Frontend

| Framework | Ventajas | Desventajas | Escenario Aplicable |
|-----------|----------|-------------|---------------------|
| **React Native** | Multiplataforma, rendimiento nativo, ecosistema rico | Requiere aprender desarrollo nativo | Aplicaciones iOS + Android |
| **Flutter** | Excelente rendimiento, UI consistente | Ecosistema de lenguaje Dart más pequeño | Escenarios que requieren rendimiento extremo |
| **Ionic** | Stack tecnológico Web, inicio rápido | Rendimiento no nativo | Aplicaciones híbridas simples |

### Comparación de Bases de Datos

| Base de Datos | Ventajas | Desventajas | Escenario Aplicable |
|---------------|----------|-------------|---------------------|
| **PostgreSQL** | Funcionalidad completa, excelente rendimiento | Requiere despliegue independiente | Entorno de producción |
| **SQLite** | Cero configuración, ligero | No soporta escrituras concurrentes | Entorno de desarrollo, aplicaciones pequeñas |
| **MySQL** | Popular, documentación rica | Funcionalidad ligeramente inferior a PostgreSQL | Aplicaciones Web tradicionales |

---

## Recomendaciones de Extensión

A medida que el proyecto evoluciona, se pueden considerar las siguientes extensiones:

### Extensión a Corto Plazo (v1.1)

- Agregar capa de caché Redis
- Introducir búsqueda Elasticsearch
- Implementar autenticación y autorización (JWT)
- Agregar comunicación en tiempo real WebSocket

### Extensión a Mediano Plazo (v2.0)

- Migrar a arquitectura de microservicios
- Introducir message queue (RabbitMQ/Kafka)
- Agregar aceleración CDN
- Implementar soporte multiidioma

### Extensión a Largo Plazo

- Introducir API GraphQL
- Implementar arquitectura Serverless
- Agregar funcionalidades AI/ML
- Implementar soporte multi-tenant

---

## Próxima Lección

> En la próxima lección aprenderemos **[Referencia de Comandos CLI](../cli-commands/)**.
>
> Aprenderás:
> - Cómo `factory init` inicializa un proyecto
> - Cómo `factory run` ejecuta el pipeline
> - Cómo `factory continue` continúa la ejecución en una nueva sesión
> - Parámetros y uso de otros comandos comunes

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-29

| Funcionalidad | Ruta del Archivo |
| ------------- | ---------------- |
| Visión general del stack técnico | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (líneas 211-230) |
| Guía de arquitectura técnica | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| Guía de generación de código | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| Plantilla backend | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| Plantilla frontend | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**Configuración clave del stack técnico**:
- **Backend**: Node.js + Express + Prisma + SQLite/PostgreSQL
- **Frontend**: React Native + Expo + React Navigation + Zustand
- **Pruebas**: Vitest (backend) + Jest (frontend)
- **Despliegue**: Docker + GitHub Actions

**¿Por qué elegir estas tecnologías?**:
- **Simplicidad primero**: inicio sin configuración, validación rápida de ideas
- **Seguridad de tipos**: TypeScript + generación automática de tipos Prisma
- **Listo para producción**: pruebas completas, documentación, configuración de despliegue
- **Escalabilidad**: puntos de extensión reservados como caché, message queue, etc.

</details>
