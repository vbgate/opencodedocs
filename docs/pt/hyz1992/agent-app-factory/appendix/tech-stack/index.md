---
title: "Detalhes da Stack Tecnológica: Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "Detalhes da Stack"
subtitle: "Detalhes da Stack Tecnológica: Compreenda a stack tecnológica utilizada pelas aplicações geradas"
description: "Explore em profundidade a stack tecnológica das aplicações geradas pelo AI App Factory, incluindo o backend completo (Node.js + Express + Prisma) e frontend (React Native + Expo), seleção de ferramentas e melhores práticas."
tags:
  - "Stack Tecnológica"
  - "Backend"
  - "Frontend"
  - "Deployment"
order: 240
---

# Detalhes da Stack Tecnológica

As aplicações geradas pelo AI App Factory utilizam uma stack tecnológica comprovada e pronta para produção, focada em desenvolvimento rápido de MVP e escalabilidade futura. Este documento explica detalhadamente cada escolha tecnológica e seus cenários de uso.

---

## O que você poderá fazer após concluir

- Compreender o racional por trás das escolhas tecnológicas das aplicações geradas
- Dominar as ferramentas e frameworks essenciais da stack de frontend e backend
- Entender por que estas tecnologias foram escolhidas em vez de outras alternativas
- Saber como ajustar as configurações técnicas de acordo com as necessidades do projeto

---

## Visão Geral das Tecnologias Principais

As aplicações geradas adotam uma solução **Full-Stack TypeScript**, garantindo segurança de tipos e consistência na experiência de desenvolvimento entre frontend e backend.

| Camada | Tecnologia | Versão | Finalidade |
|--------|-----------|--------|------------|
| **Runtime Backend** | Node.js | 16+ | Ambiente de execução JavaScript no servidor |
| **Linguagem Backend** | TypeScript | 5+ | Superconjunto JavaScript com tipagem segura |
| **Framework Backend** | Express | 4.x | Framework web leve para construção de APIs RESTful |
| **ORM** | Prisma | 5.x | Camada de acesso a dados com segurança de tipos |
| **Banco Desenvolvimento** | SQLite | - | Banco de dados sem necessidade de configuração, ideal para protótipos rápidos |
| **Banco Produção** | PostgreSQL | - | Banco de dados relacional para ambiente de produção |
| **Framework Frontend** | React Native | - | Desenvolvimento de aplicativos móveis multiplataforma |
| **Ferramentas Frontend** | Expo | - | Ferramentas de desenvolvimento e build para React Native |
| **Navegação Frontend** | React Navigation | 6+ | Experiência de navegação nativa |
| **Gerenciamento Estado** | React Context API | - | Gerenciamento de estado leve (fase MVP) |
| **Cliente HTTP** | Axios | - | Cliente HTTP para browser e Node.js |

---

## Detalhes da Stack Backend

### Node.js + TypeScript

**Por que escolher Node.js?**

- ✅ **Ecossistema Rico**: npm possui o maior ecossistema de pacotes global
- ✅ **Unificação Frontend-Backend**: a equipe precisa dominar apenas uma linguagem
- ✅ **Alta Produtividade**: event-driven e I/O não-bloqueante ideal para aplicações em tempo real
- ✅ **Comunidade Ativa**: grande quantidade de bibliotecas open source e soluções

**Por que escolher TypeScript?**

- ✅ **Segurança de Tipos**: captura erros em tempo de compilação, reduzindo bugs em runtime
- ✅ **Excelente DX**: IntelliSense, autocompletar, suporte a refatoração
- ✅ **Código Manutenível**: interfaces explícitas melhoram a eficiência da colaboração em equipe
- ✅ **Integração Perfeita com Prisma**: geração automática de definições de tipos

**Exemplo de Configuração**:

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

**Por que escolher Express?**

- ✅ **Maduro e Estável**: framework web Node.js mais popular
- ✅ **Middleware Rico**: autenticação, logs, CORS, etc. prontos para uso
- ✅ **Alta Flexibilidade**: não impõe estrutura de projeto, organização livre
- ✅ **Excelente Suporte da Comunidade**: abundância de tutoriais e soluções para problemas

**Estrutura Típica de Projeto**:

```
src/
├── config/         # Arquivos de configuração
│   ├── swagger.ts  # Configuração da documentação Swagger API
│   └── index.ts    # Configuração da aplicação
├── lib/            # Bibliotecas utilitárias
│   ├── logger.ts   # Ferramenta de logging
│   └── prisma.ts   # Singleton Prisma
├── middleware/     # Middlewares
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/         # Definições de rotas
│   ├── items.ts
│   └── index.ts
├── controllers/    # Camada de controllers
│   ├── items.controller.ts
│   └── index.ts
├── services/       # Camada de lógica de negócio
│   └── items.service.ts
├── validators/     # Validação de entrada
│   └── items.validator.ts
├── __tests__/      # Arquivos de teste
│   └── items.test.ts
├── app.ts          # Aplicação Express
└── index.ts        # Ponto de entrada da aplicação
```

**Middlewares Principais**:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middlewares de segurança
app.use(helmet());                          // Headers de segurança
app.use(cors(corsOptions));                 // Configuração CORS

// Middlewares de processamento de requisições
app.use(express.json());                    // Parsing JSON
app.use(compression());                     // Compressão de resposta
app.use(requestLogger);                    // Logging de requisições

// Middleware de tratamento de erros (por último)
app.use(errorHandler);

export default app;
```

### Prisma ORM

**Por que escolher Prisma?**

- ✅ **Segurança de Tipos**: geração automática de definições de tipos TypeScript
- ✅ **Gerenciamento de Migrações**: schema declarativo, geração automática de scripts de migração
- ✅ **Excelente DX**: suporte IntelliSense, mensagens de erro claras
- ✅ **Suporte a Múltiplos Bancos**: SQLite, PostgreSQL, MySQL, etc.
- ✅ **Performance Excelente**: otimização de queries, gerenciamento de pool de conexões

**Exemplo Típico de Schema**:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"           // Ambiente de desenvolvimento
  // provider = "postgresql"   // Ambiente de produção
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

  @@index([createdAt])  // Criação manual de índice para ordenação
}
```

**Operações Comuns de Banco de Dados**:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar
const item = await prisma.item.create({
  data: { title: 'Almoço', amount: 25.5 }
});

// Consultar (suporta paginação)
const items = await prisma.item.findMany({
  take: 20,       // Limitar quantidade
  skip: 0,        // Offset
  orderBy: { createdAt: 'desc' }
});

// Atualizar
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: 'Jantar' }
});

// Deletar
await prisma.item.delete({
  where: { id: 1 }
});
```

### Escolha do Banco de Dados

**Ambiente de Desenvolvimento: SQLite**

- ✅ **Zero Configuração**: banco de dados em arquivo, sem necessidade de instalar serviço
- ✅ **Inicialização Rápida**: ideal para desenvolvimento local e iteração rápida
- ✅ **Portabilidade**: todo o banco de dados é um único arquivo `.db`
- ❌ **Sem Suporte a Escrita Concorrente**: múltiplos processos escrevendo simultaneamente causam conflitos
- ❌ **Não Adequado para Produção**: performance e capacidade de concorrência limitadas

**Ambiente de Produção: PostgreSQL**

- ✅ **Funcionalidade Completa**: suporte a queries complexas, transações, tipo JSON
- ✅ **Excelente Performance**: suporte a alta concorrência, índices complexos
- ✅ **Estável e Confiável**: banco de dados enterprise, testado e comprovado
- ✅ **Ecossistema Maduro**: ferramentas abundantes de backup e monitoramento

**Estratégia de Migração de Banco de Dados**:

```bash
# Ambiente de Desenvolvimento - Usar SQLite
DATABASE_URL="file:./dev.db"

# Ambiente de Produção - Usar PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# Criar migração
npx prisma migrate dev --name add_item_category

# Deploy em Produção
npx prisma migrate deploy

# Resetar Banco de Dados (Ambiente de Desenvolvimento)
npx prisma migrate reset
```

---

## Detalhes da Stack Frontend

### React Native + Expo

**Por que escolher React Native?**

- ✅ **Multiplataforma**: um único código rodando em iOS e Android
- ✅ **Performance Nativa**: compilado para componentes nativos, não WebView
- ✅ **Hot Updates**: Expo suporta atualizações sem necessidade de republicação
- ✅ **Componentes Ricos**: comunidade fornece grande quantidade de componentes de alta qualidade

**Por que escolher Expo?**

- ✅ **Inicialização Rápida**: sem necessidade de configurar complexos ambientes de desenvolvimento nativo
- ✅ **Ferramentas Unificadas**: processos unificados de desenvolvimento, build e deploy
- ✅ **Expo Go**: escaneie o QR code para visualizar no dispositivo real instantaneamente
- ✅ **EAS Build**: build em nuvem, suporte a publicação na App Store

**Estrutura do Projeto**:

```
src/
├── api/           # Chamadas de API
│   ├── client.ts  # Instância Axios
│   └── items.ts   # Items API
├── components/    # Componentes reutilizáveis
│   └── ui/        # Componentes UI básicos
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/         # Hooks customizados
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/    # Configuração de navegação
│   └── RootNavigator.tsx
├── screens/       # Componentes de página
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/        # Estilos e temas
│   └── theme.ts
└── types/         # Tipos TypeScript
    └── index.ts
```

**Exemplo de Página Típica**:

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
    return <Text>Falha ao carregar: {error.message}</Text>;
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

**Por que escolher React Navigation?**

- ✅ **Recomendação Oficial**: solução de navegação oficial do React Native
- ✅ **Segurança de Tipos**: TypeScript suporta tipos completos de parâmetros de navegação
- ✅ **Experiência Nativa**: fornece modos de navegação nativos como stack navigation e tab navigation
- ✅ **Deep Linking**: suporte a URL Scheme e deep linking

**Exemplo de Configuração de Navegação**:

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Definir tipos de parâmetros de navegação
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
          options={{ title: 'Início' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `Detalhes ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Gerenciamento de Estado

**React Context API (Fase MVP)**

Adequado para aplicações simples, sem dependências:

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
    throw new Error('useItems deve ser usado dentro de ItemsProvider');
  }
  return context;
}
```

**Zustand (Aplicações de Complexidade Média)**

Biblioteca de gerenciamento de estado leve, com API simples:

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
      { name: 'items-storage' } // Persistir no AsyncStorage
    )
  )
);
```

---

## Ferramentas de Desenvolvimento

### Frameworks de Teste

**Backend: Vitest**

```typescript
// src/__tests__/items.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Items API', () => {
  it('deve retornar lista de items', async () => {
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
  it('deve renderizar sem erros', () => {
    render(<HomeScreen />);
  });

  it('deve mostrar estado de carregamento inicialmente', () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

### Documentação de API: Swagger/OpenAPI

As aplicações geradas incluem automaticamente Swagger UI, acessível em `http://localhost:3000/api-docs`.

```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentação da API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // Escanear comentários nas rotas
};

export const swaggerSpec = swaggerJsdoc(options);
```

### Logging e Monitoramento

**Backend Logging: winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// Exemplo de uso
logger.info('Item criado', { itemId: 1 });
logger.error('Falha ao criar item', { error: 'Erro no banco de dados' });
```

**Frontend Monitoramento**: Registra tempo de resposta de requisições de API, erros e métricas de performance.

---

## Ferramentas de Deployment

### Docker + docker-compose

As aplicações geradas incluem `Dockerfile` e `docker-compose.yml`, suportando deployment containerizado.

**Exemplo docker-compose.yml**:

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

Automação de testes, build e deployment:

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

## Princípios da Seleção da Stack

Os princípios fundamentais do AI App Factory na seleção desta stack tecnológica:

### 1. Simplicidade em Primeiro Lugar

- Escolher tecnologias maduras e estáveis para reduzir curva de aprendizado
- Evitar over-engineering, focar nas funcionalidades principais
- Inicialização sem configuração, validação rápida de ideias

### 2. Segurança de Tipos

- TypeScript unificado em frontend e backend
- Prisma gera tipos de banco de dados automaticamente
- React Navigation com parâmetros de navegação tipados de forma segura

### 3. Pronto para Produção

- Cobertura completa de testes
- Configurações de deployment fornecidas (Docker, CI/CD)
- Logging, monitoramento e tratamento de erros completos

### 4. Escalabilidade

- Pontos de extensão reservados (cache, message queue)
- Suporte a migração de banco de dados (SQLite → PostgreSQL)
- Arquitetura modular, facilita divisão e refatoração

### 5. Foco em MVP

- Definição clara do que não está no escopo, não introduzir funcionalidades não-core como autenticação e autorização
- Limite de número de páginas (máximo 3)
- Entrega rápida, iterações subsequentes

---

## Perguntas Frequentes

### P: Por que não usar NestJS?

**R**: NestJS é um excelente framework, mas excessivamente complexo para fase MVP. Express é mais leve e flexível, ideal para protótipos rápidos. Se a escala do projeto crescer no futuro, migração para NestJS pode ser considerada.

### P: Por que não usar MongoDB?

**R**: A maioria dos aplicativos MVP tem modelos de dados relacionais, PostgreSQL ou SQLite são mais adequados. MongoDB é adequado para dados documentais, não recomendado a menos que recursos NoSQL sejam explicitamente necessários.

### P: Por que não usar Redux?

**R**: Redux é adequado para aplicações grandes, mas tem curva de aprendizado íngreme. Para fase MVP, React Context API ou Zustand são suficientes. Se o gerenciamento de estado se tornar complexo posteriormente, Redux Toolkit pode ser introduzido.

### P: Por que não usar GraphQL?

**R**: APIs RESTful são mais simples, adequadas para a maioria das aplicações CRUD. As vantagens do GraphQL são em queries flexíveis e redução de requisições, mas para fase MVP REST API é suficiente, e a documentação Swagger é mais completa.

### P: Por que não usar Next.js?

**R**: Next.js é um framework React, adequado para SSR e aplicações web. O objetivo deste projeto é gerar aplicativos mobile, React Native é a melhor escolha. Se versão web for necessária, React Native Web pode ser utilizado.

---

## Comparação de Stacks Tecnológicas

### Comparação de Frameworks Backend

| Framework | Vantagens | Desvantagens | Cenários de Uso |
|-----------|-----------|--------------|-----------------|
| **Express** | Leve, flexível, ecossistema rico | Requer configuração manual de estrutura | Aplicações pequenas a médias, serviços API |
| **NestJS** | Segurança de tipos, modular, injeção de dependência | Curva de aprendizado íngreme, over-engineering | Aplicações empresariais grandes |
| **Fastify** | Alta performance, validação integrada | Ecossistema menor | Cenários de alta concorrência |
| **Koa** | Leve, middleware elegante | Documentação e ecossistema menores que Express | Cenários que requerem controle fino |

### Comparação de Frameworks Frontend

| Framework | Vantagens | Desvantagens | Cenários de Uso |
|-----------|-----------|--------------|-----------------|
| **React Native** | Multiplataforma, performance nativa, ecossistema rico | Requer aprendizado de desenvolvimento nativo | Aplicativos iOS + Android |
| **Flutter** | Excelente performance, UI consistente | Ecossistema Dart menor | Cenários que exigem performance extrema |
| **Ionic** | Stack web, rápido aprendizado | Performance não nativa | Aplicativos híbridos simples |

### Comparação de Bancos de Dados

| Banco de Dados | Vantagens | Desvantagens | Cenários de Uso |
|----------------|-----------|--------------|-----------------|
| **PostgreSQL** | Funcionalidade completa, excelente performance | Requer deployment independente | Ambiente de produção |
| **SQLite** | Zero configuração, leve | Sem suporte a escrita concorrente | Ambiente de desenvolvimento, aplicações pequenas |
| **MySQL** | Popular, documentação rica | Funcionalidades ligeiramente inferiores ao PostgreSQL | Aplicações web tradicionais |

---

## Recomendações de Extensão

À medida que o projeto evolui, as seguintes extensões podem ser consideradas:

### Extensões de Curto Prazo (v1.1)

- Adicionar camada de cache Redis
- Introduzir Elasticsearch para busca
- Implementar autenticação e autorização (JWT)
- Adicionar comunicação em tempo real via WebSocket

### Extensões de Médio Prazo (v2.0)

- Migração para arquitetura de microsserviços
- Introduzir message queue (RabbitMQ/Kafka)
- Adicionar aceleração via CDN
- Implementar suporte a múltiplos idiomas

### Extensões de Longo Prazo

- Introduzir API GraphQL
- Implementar arquitetura Serverless
- Adicionar funcionalidades de AI/ML
- Implementar suporte a multi-tenant

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos **[Referência de Comandos CLI](../cli-commands/)**.
>
> Você aprenderá:
> - Como `factory init` inicializa projetos
> - Como `factory run` executa pipelines
> - Como `factory continue` continua execução em nova sessão
> - Parâmetros e usos de outros comandos comuns

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-29

| Funcionalidade | Caminho do Arquivo |
|----------------|-------------------|
| Visão Geral da Stack | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (linhas 211-230) |
| Guia de Arquitetura Técnica | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| Guia de Geração de Código | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| Template Backend | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| Template Frontend | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**Configuração Principal da Stack Tecnológica**:
- **Backend**: Node.js + Express + Prisma + SQLite/PostgreSQL
- **Frontend**: React Native + Expo + React Navigation + Zustand
- **Testes**: Vitest (backend) + Jest (frontend)
- **Deployment**: Docker + GitHub Actions

**Por que escolher estas tecnologias**:
- **Simplicidade Primeiro**: inicialização sem configuração, validação rápida de ideias
- **Segurança de Tipos**: TypeScript + geração automática de tipos Prisma
- **Pronto para Produção**: testes completos, documentação, configurações de deployment
- **Escalabilidade**: pontos de extensão para cache, message queue, etc.

</details>
