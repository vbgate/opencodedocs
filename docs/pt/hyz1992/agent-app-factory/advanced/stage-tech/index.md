---
title: "Desenhar Arquitetura Técnica: Guia Completo da Fase Tech | Tutorial do Agent App Factory"
sidebarTitle: "Desenhar Arquitetura Técnica"
subtitle: "Desenhar Arquitetura Técnica: Guia Completo da Fase Tech"
description: "Aprenda como a fase Tech do AI App Factory desenha a arquitetura técnica mínima viável e os modelos de dados Prisma com base no PRD, incluindo seleção de stack técnico, design de modelo de dados, definição de API e estratégia de migração de banco de dados."
tags:
  - "Arquitetura Técnica"
  - "Modelo de Dados"
  - "Prisma"
prerequisite:
  - "advanced-stage-prd"
order: 110
---

# Desenhar Arquitetura Técnica: Guia Completo da Fase Tech

## O Que Você Será Capaz de Fazer

Após concluir esta aula, você será capaz de:

- Entender como o Tech Agent desenha a arquitetura técnica com base no PRD
- Dominar os métodos e restrições de design do Schema Prisma
- Compreender os princípios de decisão para seleção de stack técnico
- Aprender a definir modelos de dados e design de API adequados para MVP
- Entender a estratégia de migração entre ambiente de desenvolvimento SQLite e ambiente de produção PostgreSQL

## Seu Problema Atual

O PRD já foi escrito, você sabe quais funcionalidades implementar, mas não sabe:

- Qual stack técnico escolher? Node.js ou Python?
- Como desenhar as tabelas de dados? Como definir as relações?
- Quais endpoints de API devem existir? Quais padrões seguir?
- Como garantir que o design permita entrega rápida mas também suporte expansão futura?

A fase Tech existe para resolver esses problemas — ela gera automaticamente a arquitetura técnica e o modelo de dados com base no PRD.

## Quando Usar Este Recurso

A fase Tech é a 4ª etapa do pipeline, logo após a fase UI e antes da fase Code.

**Cenários Típicos de Uso**:

| Cenário | Descrição |
| ---- | ---- |
| Início de novo projeto | Após confirmação do PRD, é necessário desenhar a solução técnica |
| Protótipo rápido de MVP | É necessária uma arquitetura técnica mínima viável, evitando over-engineering |
| Decisão de stack técnico | Incerteza sobre qual combinação de tecnologias é mais adequada |
| Design de modelo de dados | É necessário definir claramente as relações entre entidades e campos |

**Cenários Não Aplicáveis**:

- Projetos com arquitetura técnica já definida (a fase Tech redesenharia)
- Apenas frontend ou apenas backend (a fase Tech desenha arquitetura full-stack)
- Necessidade de arquitetura de microsserviços (não recomendada na fase MVP)

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos

Esta aula assume que você já:

1. **Concluiu a fase PRD**: `artifacts/prd/prd.md` deve existir e estar validado
2. **Entende os requisitos do produto**: está claro sobre funcionalidades principais, user stories e escopo do MVP
3. **Está familiarizado com conceitos básicos**: entende conceitos básicos de API RESTful, banco de dados relacional e ORM

:::

**Conceitos a Conhecer**:

::: info O que é Prisma?

Prisma é uma ferramenta moderna de ORM (Object-Relational Mapping) para operar bancos de dados em TypeScript/Node.js.

**Vantagens Principais**:

- **Type Safety**: gera automaticamente tipos TypeScript, fornecendo sugestões completas durante o desenvolvimento
- **Gerenciamento de Migrações**: `prisma migrate dev` gerencia automaticamente alterações no banco de dados
- **Experiência de Desenvolvimento**: Prisma Studio permite visualizar e editar dados

**Fluxo de Trabalho Básico**:

```
Definir schema.prisma → Executar migração → Gerar Client → Usar no código
```

:::

::: info Por que SQLite para MVP e PostgreSQL para produção?

**SQLite (ambiente de desenvolvimento)**:

- Zero configuração, banco de dados baseado em arquivo (`dev.db`)
- Leve e rápido, adequado para desenvolvimento local e demonstrações
- Não suporta gravação concorrente

**PostgreSQL (ambiente de produção)**:

- Funcionalidade completa, suporta concorrência e consultas complexas
- Excelente desempenho, adequado para implantação em produção
- Migração Prisma sem interrupções: basta modificar `DATABASE_URL`

**Estratégia de Migração**: Prisma adapta automaticamente o provedor de banco de dados com base no `DATABASE_URL`, sem necessidade de modificar manualmente o Schema.

:::

## Ideia Central

O núcleo da fase Tech é **transformar requisitos de produto em soluções técnicas**, mas seguindo o princípio de "MVP em primeiro lugar".

### Framework de Pensamento

O Tech Agent segue o seguinte framework de pensamento:

| Princípio | Descrição |
| ---- | ---- |
| **Alinhamento de Objetivos** | A solução técnica deve servir ao valor central do produto |
| **Simplicidade Primeiro** | Escolha stack técnica simples e madura para entrega rápida |
| **Escalabilidade** | Reservar pontos de extensão no design para suportar evolução futura |
| **Orientado por Dados** | Expressar entidades e relações através de modelos de dados claros |

### Árvore de Decisão de Seleção Técnica

**Stack Técnico Backend**:

| Componente | Recomendado | Alternativa | Descrição |
| ---- | ---- | ---- | ---- |
| **Runtime** | Node.js + TypeScript | Python + FastAPI | Ecossistema Node.js rico, unificação frontend e backend |
| **Framework Web** | Express | Fastify | Express maduro e estável, middlewares abundantes |
| **ORM** | Prisma 5.x | TypeORM | Prisma type-safe, excelente gerenciamento de migrações |
| **Banco de Dados** | SQLite (dev) / PostgreSQL (prod) | - | SQLite zero config, PostgreSQL production-ready |

**Stack Técnico Frontend**:

| Cenário | Recomendado | Descrição |
| ---- | ---- | ---- |
| Apenas mobile | React Native + Expo | Cross-platform, hot reload |
| Mobile + Web | React Native Web | Um código, múltiplas plataformas |
| Apenas Web | React + Vite | Excelente desempenho, ecossistema maduro |

**Gerenciamento de Estado**:

| Complexidade | Recomendado | Descrição |
| ---- | ---- | ---- |
| Simples (< 5 estados globais) | React Context API | Zero dependências, baixa curva de aprendizado |
| Complexidade média | Zustand | Leve, API simples, bom desempenho |
| Aplicações complexas | Redux Toolkit | ⚠️ Não recomendado na fase MVP, muito complexo |

### Princípios de Design de Modelo de Dados

**Identificação de Entidades**:

1. Extrair substantivos dos user stories do PRD → entidades candidatas
2. Distinguir entidades principais (obrigatórias) e entidades auxiliares (opcionais)
3. Cada entidade deve ter significado de negócio claro

**Design de Relações**:

| Tipo de Relação | Exemplo | Descrição |
| ---- | ---- | ---- |
| Um-para-muitos (1:N) | User → Posts | Usuário tem vários posts |
| Muitos-para-muitos (M:N) | Posts ↔ Tags | Posts e tags (através de tabela intermediária) |
| Um-para-um (1:1) | User → UserProfile | ⚠️ Pouco usado, geralmente pode ser mesclado |

**Princípios de Campos**:

- **Campos Obrigatórios**: `id`, `createdAt`, `updatedAt`
- **Evitar Redundância**: Campos que podem ser obtidos através de cálculo ou associação não devem ser armazenados
- **Tipo Apropriado**: String, Int, Float, Boolean, DateTime
- **Campos Sensíveis**: Senhas etc. não devem ser armazenadas diretamente

### ⚠️ Restrições de Compatibilidade SQLite

Ao gerar Prisma Schema, o Tech Agent deve seguir os requisitos de compatibilidade SQLite:

#### Proibir Uso de Composite Types

SQLite não suporta a definição `type` do Prisma, deve usar `String` para armazenar strings JSON.

```prisma
// ❌ Erro - SQLite não suporta
type UserProfile {
  identity String
  ageRange String
}

model User {
  id      Int        @id @default(autoincrement())
  profile UserProfile
}

// ✅ Correto - usar String para armazenar JSON
model User {
  id      Int    @id @default(autoincrement())
  profile String // JSON: {"identity":"student","ageRange":"18-25"}
}
```

#### Padrão de Comentários para Campos JSON

No Schema, usar comentários para explicar a estrutura JSON:

```prisma
model User {
  id      Int    @id @default(autoincrement())
  // Formato JSON: {"identity":"student","ageRange":"18-25"}
  profile String
}
```

No código TypeScript, definir a interface correspondente:

```typescript
// src/types/index.ts
export interface UserProfile {
  identity: string;
  ageRange: string;
}
```

#### Bloqueio de Versão do Prisma

Deve usar Prisma 5.x, não usar 7.x (tem problemas de compatibilidade):

```json
{
  "dependencies": {
    "@prisma/client": "5.22.0",
    "prisma": "5.22.0"
  }
}
```

## Fluxo de Trabalho do Tech Agent

O Tech Agent é um AI Agent responsável por desenhar a arquitetura técnica com base no PRD. Seu fluxo de trabalho é o seguinte:

### Arquivos de Entrada

O Tech Agent só pode ler os seguintes arquivos:

| Arquivo | Descrição | Localização |
| ---- | ---- | ---- |
| `prd.md` | Documento de requisitos do produto | `artifacts/prd/prd.md` |

### Arquivos de Saída

O Tech Agent deve gerar os seguintes arquivos:

| Arquivo | Descrição | Localização |
| ---- | ---- | ---- |
| `tech.md` | Documento de solução técnica e arquitetura | `artifacts/tech/tech.md` |
| `schema.prisma` | Definição de modelo de dados | `artifacts/backend/prisma/schema.prisma` |

### Etapas de Execução

1. **Ler o PRD**: identificar funcionalidades principais, fluxos de dados e restrições
2. **Selecionar stack técnico**: com base em `skills/tech/skill.md`, escolher linguagem, framework e banco de dados
3. **Desenhar modelo de dados**: definir entidades, atributos e relações, usando Prisma schema
4. **Escrever documento técnico**: em `tech.md`, explicar justificativas, estratégias de expansão e não-objetivos
5. **Gerar arquivos de saída**: escrever o design nos caminhos especificados, sem modificar arquivos upstream

### Condições de Saída

O agendador Sisyphus verificará se o Tech Agent satisfaz as seguintes condições:

- ✅ Stack técnico claramente declarado (backend, frontend, banco de dados)
- ✅ Modelo de dados consistente com o PRD (todas as entidades vêm do PRD)
- ✅ Sem otimização prematura ou over-engineering

## Siga-me: Executar Fase Tech

### Etapa 1: Confirmar que a Fase PRD Está Concluída

**Por que**

O Tech Agent precisa ler `artifacts/prd/prd.md`. Se o arquivo não existir, a fase Tech não pode ser executada.

**Ação**

```bash
# Verificar se o arquivo PRD existe
cat artifacts/prd/prd.md
```

**O que você deve ver**: documento PRD estruturado, contendo usuários-alvo, lista de funcionalidades, não-objetivos etc.

### Etapa 2: Executar Fase Tech

**Por que**

Usar o assistente de IA para executar o Tech Agent, gerando automaticamente a arquitetura técnica e o modelo de dados.

**Ação**

```bash
# Usar Claude Code para executar fase tech
factory run tech
```

**O que você deve ver**:

```
✓ Fase atual: tech
✓ Carregar documento PRD: artifacts/prd/prd.md
✓ Iniciar Tech Agent

Tech Agent está desenhando a arquitetura técnica...

[O assistente de AI executará as seguintes operações]
1. Analisar PRD, extrair entidades e funcionalidades
2. Selecionar stack técnico (Node.js + Express + Prisma)
3. Desenhar modelo de dados (User, Post etc.)
4. Definir endpoints de API
5. Gerar tech.md e schema.prisma

Aguardando o Agent concluir...
```

### Etapa 3: Visualizar Documento Técnico Gerado

**Por que**

Verificar se o documento técnico está completo e se o design é razoável.

**Ação**

```bash
# Visualizar documento técnico
cat artifacts/tech/tech.md
```

**O que você deve ver**: documento técnico completo contendo as seguintes seções

```markdown
## Stack Técnico

**Backend**
- Runtime: Node.js 20+
- Linguagem: TypeScript 5+
- Framework: Express 4.x
- ORM: Prisma 5.x
- Banco de Dados: SQLite (dev) / PostgreSQL (prod)

**Frontend**
- Framework: React Native + Expo
- Linguagem: TypeScript
- Navegação: React Navigation 6
- Gerenciamento de Estado: React Context API
- Cliente HTTP: Axios

## Design de Arquitetura

**Estrutura em Camadas**
- Camada de rotas (routes/): define endpoints de API
- Camada de controladores (controllers/): processa requisições e respostas
- Camada de serviços (services/): lógica de negócios
- Camada de acesso a dados: Prisma ORM

**Fluxo de Dados**
Client → API Gateway → Controller → Service → Prisma → Database

## Design de Endpoints de API

| Endpoint | Método | Descrição | Body da Requisição | Resposta |
|------|------|------|--------|------|
| /api/items | GET | Obter lista | - | Item[] |
| /api/items/:id | GET | Obter detalhes | - | Item |
| /api/items | POST | Criar | CreateItemDto | Item |
| /api/items/:id | PUT | Atualizar | UpdateItemDto | Item |
| /api/items/:id | DELETE | Excluir | - | { deleted: true } |

## Modelo de Dados

### User
- id: chave primária
- email: email (obrigatório)
- name: nome (obrigatório)
- createdAt: data de criação
- updatedAt: data de atualização

**Relações**:
- posts: um-para-muitos (usuário tem vários posts)

## Variáveis de Ambiente

**Backend (.env)**
- PORT: porta do serviço (padrão 3000)
- DATABASE_URL: string de conexão do banco de dados
- NODE_ENV: ambiente (development/production)
- CORS_ORIGINS: origens permitidas para CORS

**Frontend (.env)**
- EXPO_PUBLIC_API_URL: URL da API backend

## Pontos de Expansão Futura

**Curto prazo (v1.1)**
- Adicionar paginação e filtros
- Implementar funcionalidade de exportação de dados

**Médio prazo (v2.0)**
- Migrar para PostgreSQL
- Adicionar autenticação de usuários

**Longo prazo**
- Dividir em microsserviços
- Adicionar camada de cache (Redis)
```

### Etapa 4: Visualizar Schema Prisma Gerado

**Por que**

Verificar se o modelo de dados está de acordo com o PRD e se segue as restrições de compatibilidade SQLite.

**Ação**

```bash
# Visualizar Schema Prisma
cat artifacts/backend/prisma/schema.prisma
```

**O que você deve ver**: Schema conforme a sintaxe do Prisma 5.x, contendo definições completas de entidades e relações

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // ambiente de desenvolvimento
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

### Etapa 5: Verificar Condições de Saída

**Por que**

Sisyphus verificará se o Tech Agent satisfaz as condições de saída. Se não satisfizer, exigirá reexecução.

**Lista de Verificação**

| Item de Verificação | Descrição | Passou/Falhou |
| ---- | ---- | ---- |
| Stack técnico claramente declarado | Backend, frontend, banco de dados claramente definidos | [ ] |
| Modelo de dados consistente com o PRD | Todas as entidades vêm do PRD, sem campos extras | [ ] |
| Sem otimização prematura ou over-engineering | Adequado ao escopo do MVP, sem funcionalidades não verificadas | [ ] |

**Se falhar**:

```bash
# Reexecutar fase Tech
factory run tech
```

## Ponto de Verificação ✅

**Confirme que você completou**:

- [ ] Fase Tech executada com sucesso
- [ ] Arquivo `artifacts/tech/tech.md` existe e está completo
- [ ] Arquivo `artifacts/backend/prisma/schema.prisma` existe e está sintaticamente correto
- [ ] Stack técnico escolhido é razoável (Node.js + Express + Prisma)
- [ ] Modelo de dados consistente com o PRD, sem campos extras
- [ ] Schema segue restrições de compatibilidade SQLite (sem Composite Types)

## Avisos sobre Cuidados a Tomar

### ⚠️ Armadilha 1: Over-engineering

**Problema**: introduzir microsserviços, cache complexo ou funcionalidades avançadas na fase MVP.

**Sintomas**: `tech.md` contém "arquitetura de microsserviços", "cache Redis", "fila de mensagens" etc.

**Solução**: O Tech Agent tem uma lista `NEVER`, proibindo explicitamente over-engineering. Se vir esse conteúdo, reexecute.

```markdown
## Não Faça (NEVER)
* **NEVER** faça over-engineering, como introduzir microsserviços, filas de mensagens complexas ou cache de alto desempenho na fase MVP
* **NEVER** escreva código redundante para cenários ainda não determinados
```

### ⚠️ Armadilha 2: Erro de Compatibilidade SQLite

**Problema**: O Prisma Schema usa recursos não suportados pelo SQLite.

**Sintomas**: erro na fase Validation, ou falha em `npx prisma generate`.

**Erros Comuns**:

```prisma
// ❌ Erro - SQLite não suporta Composite Types
type UserProfile {
  identity String
  ageRange String
}

model User {
  profile UserProfile
}

// ❌ Erro - usando versão 7.x
{
  "prisma": "^7.0.0"
}
```

**Solução**: verificar o Schema, garantir que está usando String para armazenar JSON, e bloquear a versão do Prisma em 5.x.

### ⚠️ Armadilha 3: Modelo de Dados Fora do Escopo do MVP

**Problema**: O Schema contém entidades ou campos não definidos no PRD.

**Sintomas**: o número de entidades em `tech.md` é significativamente maior do que as entidades principais do PRD.

**Solução**: o Tech Agent é restrito por "o modelo de dados deve cobrir todas as entidades e relações necessárias para funcionalidades do MVP, não adiantar campos não verificados". Se encontrar campos extras, exclua ou marque como "ponto de expansão futura".

### ⚠️ Armadilha 4: Erro de Design de Relações

**Problema**: a definição de relações não corresponde à lógica de negócios real.

**Sintomas**: um-para-muitos escrito como muitos-para-muitos, ou relações essenciais ausentes.

**Exemplo de Erro**:

```prisma
// ❌ Erro - usuário e post devem ser um-para-muitos, não um-para-um
model User {
  id   Int    @id @default(autoincrement())
  post Post?  // relação um-para-um
}

model Post {
  id      Int    @id @default(autoincrement())
  author  User?  // deveria usar @relation
}
```

**Forma Correta**:

```prisma
// ✅ Correto - relação um-para-muitos
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

## Resumo da Aula

A fase Tech é a ponte no pipeline que conecta "requisitos de produto" e "implementação de código". Ela desenha automaticamente com base no PRD:

- **Stack Técnico**: Node.js + Express + Prisma (backend), React Native + Expo (frontend)
- **Modelo de Dados**: Prisma Schema conforme requisitos de compatibilidade SQLite
- **Design de Arquitetura**: estrutura em camadas (rotas → controladores → serviços → dados)
- **Definição de API**: endpoints RESTful e fluxo de dados

**Princípios Chave**:

1. **MVP em Primeiro Lugar**: desenhe apenas funcionalidades principais essenciais, evitando over-engineering
2. **Simplicidade Primeiro**: escolha stack técnica madura e estável
3. **Orientado por Dados**: expresse entidades e relações através de modelos de dados claros
4. **Escalabilidade**: marque pontos de expansão futura na documentação, mas não implemente antecipadamente

Após concluir a fase Tech, você obterá:

- ✅ Documento completo de solução técnica (`tech.md`)
- ✅ Modelo de dados conforme especificação Prisma 5.x (`schema.prisma`)
- ✅ Design de API claro e configuração de ambiente

## Próxima Aula

> Na próxima aula, aprenderemos a **[Fase Code: Gerar Código Executável](../stage-code/)**.
>
> Você aprenderá:
> - Como o Code Agent gera código frontend e backend com base no UI Schema e no design Tech
> - Quais funcionalidades a aplicação gerada inclui (testes, documentação, CI/CD)
> - Como verificar a qualidade do código gerado
> - Requisitos especiais e especificações de saída do Code Agent

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-29

| Funcionalidade | Caminho do Arquivo | Número da Linha |
| ---- | ---- | ---- |
| Definição do Tech Agent | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 1-63 |
| Guia da Skill Tech | [`source/hyz1992/agent-app-factory/skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) | 1-942 |
| Configuração do Pipeline | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 49-62 |
| Restrições de Compatibilidade SQLite | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 28-56 |

**Restrições Chave**:
- **Proibir Uso de Composite Types**: SQLite não suporta, deve usar String para armazenar JSON
- **Bloqueio de Versão Prisma**: deve usar 5.x, não usar 7.x
- **Escopo do MVP**: o modelo de dados deve cobrir todas as entidades necessárias para funcionalidades do MVP, não adiantar campos não verificados

**Princípios de Decisão de Stack Técnico**:
- Priorizar linguagens e frameworks com comunidade ativa e documentação completa
- Na fase MVP, escolher banco de dados leve (SQLite), migrável para PostgreSQL posteriormente
- O sistema em camadas segue camada de rotas → camada de lógica de negócios → camada de acesso a dados

**Não Faça (NEVER)**:
- NEVER faça over-engineering, como introduzir microsserviços, filas de mensagens complexas ou cache de alto desempenho na fase MVP
- NEVER escolha tecnologias de nicho ou mal mantidas
- NEVER adicione campos ou relações não verificados pelo produto no modelo de dados
- NEVER inclua implementação de código específica no documento técnico

</details>
