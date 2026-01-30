---
title: "Fase Preview: Geração Automática de Guia de Implantação e Instruções de Execução | Tutorial Agent App Factory"
sidebarTitle: "Gerar Guia de Implantação"
subtitle: "Gerar Guia de Implantação: Guia Completo da Fase Preview"
description: "Aprenda como a fase Preview do AI App Factory escreve automaticamente guias de execução e configurações de implantação para aplicativos gerados, cobrindo inicialização local, containerização Docker, builds Expo EAS, pipelines CI/CD e design de fluxo de demonstração."
tags:
  - "Guia de Implantação"
  - "Docker"
  - "CI/CD"
prerequisite:
  - "advanced-stage-validation"
order: 140
---

# Gerar Guia de Implantação: Guia Completo da Fase Preview

## O Que Você Poderá Fazer Após Este Curso

Ao concluir esta lição, você será capaz de:

- Entender como o Preview Agent escreve guias de execução para aplicativos gerados
- Dominar métodos de geração de configurações de implantação Docker
- Compreender o papel das configurações de build Expo EAS
- Aprender a projetar fluxos de demonstração curtos para MVPs
- Entender as melhores práticas de configuração de CI/CD e Git Hooks

## O Dilema Atual

O código foi gerado e validado, você quer mostrar o MVP rapidamente para a equipe ou cliente, mas não sabe:

- Que tipo de documentação de execução deve escrever?
- Como fazer outras pessoas iniciarem e executarem o aplicativo rapidamente?
- Quais funcionalidades devem ser demonstradas? Quais armadilhas devem ser evitadas?
- Como fazer o deploy no ambiente de produção? Docker ou plataforma em nuvem?
- Como estabelecer integração contínua e portões de qualidade de código?

A fase Preview resolve exatamente esses problemas — ela gera automaticamente instruções de execução completas e configurações de implantação.

## Quando Usar Esta Etapa

A fase Preview é a 7ª e última etapa do pipeline, imediatamente após a fase de Validação.

**Cenários Típicos de Uso**:

| Cenário | Descrição |
| ---- | ---- |
| Demonstração de MVP | Precisa mostrar o aplicativo para a equipe ou cliente, requer guia de execução detalhado |
| Colaboração em Equipe | Novos membros ingressam no projeto, precisam configurar rapidamente o ambiente de desenvolvimento |
| Deploy em Produção | Preparando para colocar o aplicativo online, precisa de configurações Docker e pipeline CI/CD |
| Publicação de Aplicativo Móvel | Precisa configurar Expo EAS, preparando para submissão à App Store e Google Play |

**Cenários Não Aplicáveis**:

- Apenas visualizar código sem executar (a fase Preview é obrigatória)
- Código não passou pela fase de Validação (corrija os problemas antes de executar Preview)

## 🎒 Preparação Antes de Começar

::: warning Requisitos Prévios

Esta lição assume que você já:

1. **Completou a fase de Validação**: `artifacts/validation/report.md` deve existir e ter passado na validação
2. **Entende a arquitetura do aplicativo**: conhece claramente a stack tecnológica de backend e frontend, modelos de dados e endpoints de API
3. **Está familiarizado com conceitos básicos**: entende os conceitos básicos de Docker, CI/CD, Git Hooks

:::

**Conceitos Necessários**:

::: info O Que é Docker?

Docker é uma plataforma de containerização que pode empacotar aplicativos e suas dependências em um container portátil.

**Vantagens Principais**:

- **Consistência de Ambiente**: Ambientes de desenvolvimento, teste e produção são completamente consistentes, evitando "funciona na minha máquina"
- **Deploy Rápido**: Um comando para iniciar toda a stack de aplicativos
- **Isolamento de Recursos**: Containers não interferem uns com os outros, melhorando a segurança

**Conceitos Básicos**:

```
Dockerfile → Imagem (Image) → Container (Container)
```

:::

::: info O Que é CI/CD?

CI/CD (Integração Contínua/Deploy Contínuo) são práticas automatizadas de desenvolvimento de software.

**CI (Continuous Integration)**:
- Testes e verificações são executados automaticamente a cada commit
- Descobre problemas de código mais cedo
- Melhora a qualidade do código

**CD (Continuous Deployment)**:
- Construção e deploy de aplicativos automatizados
- Novas funcionalidades são levadas à produção rapidamente
- Reduz erros de operação manual

**GitHub Actions** é a plataforma de CI/CD fornecida pelo GitHub, definindo fluxos de automação através de arquivos de configuração `.github/workflows/*.yml`.

:::

::: info O Que são Git Hooks?

Git Hooks são scripts executados automaticamente em pontos específicos das operações Git.

**Hooks Comuns**:

- **pre-commit**: Executa verificações e formatação de código antes do commit
- **commit-msg**: Valida o formato da mensagem de commit
- **pre-push**: Executa testes completos antes do push

**Husky** é uma ferramenta popular de gerenciamento de Git Hooks, usada para simplificar a configuração e manutenção dos Hooks.

:::

## Ideia Central

O núcleo da fase Preview é **preparar documentação completa de uso e implantação para o aplicativo**, seguindo o princípio de "local primeiro, riscos transparentes".

### Framework de Pensamento

O Preview Agent segue o seguinte framework de pensamento:

| Princípio | Descrição |
| ---- | ---- |
| **Local Primeiro** | Garante que qualquer pessoa com ambiente de desenvolvimento básico possa iniciar localmente |
| **Pronto para Deploy** | Fornece todos os arquivos de configuração necessários para implantação em produção |
| **História do Usuário** | Projeta fluxos de demonstração curtos, mostrando o valor central |
| **Riscos Transparentes** | Lista proativamente limitações ou problemas conhecidos da versão atual |

### Estrutura de Arquivos de Saída

O Preview Agent gera dois tipos de arquivos:

**Arquivos Obrigatórios** (todos os projetos precisam):

| Arquivo | Descrição | Localização |
| ---- | ---- | ---- |
| `README.md` | Documentação principal de execução | `artifacts/preview/README.md` |
| `Dockerfile` | Configuração Docker backend | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Docker Compose ambiente dev | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Template variáveis ambiente produção | `artifacts/backend/.env.production.example` |
| `eas.json` | Configuração build Expo EAS | `artifacts/client/eas.json` |

**Arquivos Recomendados** (necessários para produção):

| Arquivo | Descrição | Localização |
| ---- | ---- | ---- |
| `DEPLOYMENT.md` | Guia de implantação detalhado | `artifacts/preview/DEPLOYMENT.md` |
| `docker-compose.production.yml` | Docker Compose ambiente produção | Diretório raiz do projeto |

### Estrutura do Documento README

O `artifacts/preview/README.md` deve conter os seguintes capítulos:

```markdown
# [Nome do Projeto]

## Início Rápido

### Requisitos de Ambiente
- Node.js >= 18
- npm >= 9
- [Outras dependências]

### Iniciar Backend
[Instalar dependências, configurar ambiente, inicializar banco de dados, iniciar serviço]

### Iniciar Frontend
[Instalar dependências, configurar ambiente, iniciar servidor dev]

### Verificar Instalação
[Comandos de teste, health check]

---

## Fluxo de Demonstração

### Preparação
### Passos da Demonstração
### Notas Importantes para Demonstração

---

## Problemas Conhecidos e Limitações

### Limitações de Funcionalidade
### Dívida Técnica
### Operações a Evitar Durante Demonstração

---

## Perguntas Frequentes
```

## Fluxo de Trabalho do Preview Agent

O Preview Agent é um AI Agent responsável por escrever guias de execução e configurações de implantação para aplicativos gerados. Seu fluxo de trabalho é o seguinte:

### Arquivos de Entrada

O Preview Agent só pode ler os seguintes arquivos:

| Arquivo | Descrição | Localização |
| ---- | ---- | ---- |
| Código Backend | Aplicativo backend validado | `artifacts/backend/` |
| Código Frontend | Aplicativo frontend validado | `artifacts/client/` |

### Arquivos de Saída

O Preview Agent deve gerar os seguintes arquivos:

| Arquivo | Descrição | Localização |
| ---- | ---- | ---- |
| `README.md` | Documentação principal de execução | `artifacts/preview/README.md` |
| `Dockerfile` | Configuração Docker backend | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Docker Compose ambiente dev | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Template variáveis ambiente produção | `artifacts/backend/.env.production.example` |
| `eas.json` | Configuração build Expo EAS | `artifacts/client/eas.json` |

### Passos de Execução

1. **Navegar Código**: Analisar diretórios backend e frontend, determinar dependências de instalação e comandos de inicialização
2. **Escrever README**: Seguindo as diretrizes de `skills/preview/skill.md`, escrever guias claras de instalação e execução
3. **Gerar Config Docker**: Criar Dockerfile e docker-compose.yml
4. **Configurar EAS**: Gerar configuração de build Expo EAS (aplicativos móveis)
5. **Preparar Fluxo Demonstração**: Projetar descrição de cenário de demonstração curta
6. **Listar Problemas Conhecidos**: Listar proativamente defeitos ou limitações da versão atual

## Siga Comigo: Executando a Fase Preview

### Passo 1: Confirmar que a Fase de Validação Foi Concluída

**Por quê**

O Preview Agent precisa ler `artifacts/backend/` e `artifacts/client/`, se o código não passou na validação, a documentação gerada na fase Preview pode estar imprecisa.

**Ação**

```bash
# Verificar relatório de validação
cat artifacts/validation/report.md
```

**Você deve ver**: O relatório de validação mostra que todos os checklists de backend e frontend passaram.

```
✅ Backend Dependencies: OK
✅ Backend Type Check: OK
✅ Prisma Schema: OK
✅ Frontend Dependencies: OK
✅ Frontend Type Check: OK
```\n
### Passo 2: Executar a Fase Preview

**Por quê**

Usar o assistente de IA para executar o Preview Agent, gerando automaticamente guias de execução e configurações de implantação.

**Ação**

```bash
# Usar Claude Code para executar fase preview
factory run preview
```

**Você deve ver**:

```
✓ Fase atual: preview
✓ Carregar código backend: artifacts/backend/
✓ Carregar código frontend: artifacts/client/
✓ Iniciar Preview Agent

Preview Agent está gerando guia de execução e configurações de implantação...

[O assistente de IA executará as seguintes ações]
1. Analisar estrutura do projeto backend e frontend
2. Gerar README.md (instalação, execução, fluxo de demonstração)
3. Criar Dockerfile e docker-compose.yml
4. Configurar arquivo de build Expo EAS
5. Preparar template de variáveis de ambiente de produção
6. Listar problemas conhecidos e limitações

Aguardando conclusão do Agent...
```

### Passo 3: Visualizar o README Gerado

**Por quê**

Verificar se o README está completo, validar se passos de instalação e comandos de execução estão claros.

**Ação**

```bash
# Visualizar guia de execução
cat artifacts/preview/README.md
```

**Você deve ver**: Guia de execução completa contendo os seguintes capítulos

```markdown
# Assistente de Recomendação de Restaurantes com IA

## Início Rápido

### Requisitos de Ambiente

- Node.js >= 18
- npm >= 9
- Docker (opcional, para implantação containerizada)

### Iniciar Backend

```bash
# Entrar no diretório backend
cd artifacts/backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env preenchendo configurações necessárias

# Inicializar banco de dados
npx prisma migrate dev

# (Opcional) Preencher dados de seed
npm run db:seed

# Iniciar servidor de desenvolvimento
npm run dev
```

Backend rodando em: http://localhost:3000
Health check: http://localhost:3000/health
Documentação da API: http://localhost:3000/api-docs

### Iniciar Frontend

```bash
# Entrar no diretório frontend
cd artifacts/client

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar API_URL apontando para o endereço do backend

# Iniciar servidor de desenvolvimento
npm start
```

- Simulador iOS: Pressione `i`
- Simulador Android: Pressione `a`
- Navegador Web: Pressione `w`

### Verificar Instalação

Execute os seguintes comandos para verificar se a instalação foi bem-sucedida:

```bash
# Testes backend
cd artifacts/backend && npm test

# Testes frontend
cd artifacts/client && npm test

# Health check da API
curl http://localhost:3000/health
```

---

## Fluxo de Demonstração

### Preparação

1. Certifique-se de que backend e frontend estão iniciados
2. Limpar ou redefinir dados de demonstração (opcional)

### Passos da Demonstração

1. **Introdução do Cenário** (30 segundos)
   - Apresentar usuário-alvo: usuários que querem experimentar novos restaurantes
   - Apresentar problema central: dificuldade de escolha, não saber o que comer

2. **Demonstração de Funcionalidade** (3-5 minutos)
   - Passo 1: Usuário insere preferências (tipo de cozinha, sabor, orçamento)
   - Passo 2: IA recomenda restaurantes baseado nas preferências
   - Passo 3: Usuário visualiza resultados e seleciona

3. **Destaques Técnicos** (opcional, 1 minuto)
   - Recomendação de IA em tempo real (chamada à API OpenAI)
   - Design responsivo para dispositivos móveis
   - Persistência local de banco de dados

### Notas Importantes para Demonstração

- Certifique-se de que a conexão de rede está normal (recomendação de IA requer chamada à API)
- Evite inserir preferências muito longas ou vagas (podem levar a recomendações imprecisas)
- Não modifique o banco de dados durante a demonstração (pode afetar o efeito da demonstração)

---

## Problemas Conhecidos e Limitações

### Limitações de Funcionalidade

- [ ] Ainda não suporta registro e login de usuários
- [ ] Ainda não suporta favoritos e histórico
- [ ] Recomendação de IA suporta apenas entrada de texto, ainda não suporta voz ou imagem

### Dívida Técnica

- [ ] Tratamento de erros do frontend precisa ser aprimorado
- [ ] Registro de logs do backend precisa ser otimizado
- [ ] Índices de banco de dados não otimizados (sem impacto em pequenos volumes de dados)

### Operações a Evitar Durante Demonstração

- Tentar registrar ou fazer login - pode causar interrupção da demonstração
- Inserir caracteres especiais ou texto muito longo - pode acionar erros
- Solicitações contínuas rápidas - pode acionar limitação de taxa da API

---

## Perguntas Frequentes

### P: O que fazer se a porta estiver ocupada?

R: Modifique a variável `PORT` no `.env` ou termine o processo que está ocupando a porta primeiro.

### P: O que fazer se a conexão com o banco de dados falhar?

R: Verifique se a configuração `DATABASE_URL` no `.env` está correta e se o banco de dados está iniciado.

### P: O que fazer se a recomendação de IA não responder?

R: Verifique se a `OPENAI_API_KEY` no `.env` é válida e se a conexão de rede está normal.

```

### Passo 4: Visualizar a Configuração Docker Gerada

**Por quê**

Verificar se a configuração Docker está correta, garantindo que o container possa ser construído e executado sem problemas.

**Ação**

```bash
# Visualizar Dockerfile
cat artifacts/backend/Dockerfile

# Visualizar docker-compose.yml
cat artifacts/backend/docker-compose.yml
```

**Você deve ver**: Arquivos de configuração que seguem as melhores práticas Docker

**Exemplo de Dockerfile**:

```dockerfile
# Imagem base
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build
RUN npm run build

# Imagem de produção
FROM node:20-alpine AS production

WORKDIR /app

# Instalar dependências de produção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando de inicialização
CMD ["npm", "start"]
```

**Exemplo de docker-compose.yml**:

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

### Passo 5: Visualizar a Configuração EAS

**Por quê**

Verificar se a configuração Expo EAS está correta, garantindo que o aplicativo móvel possa ser construído e publicado sem problemas.

**Ação**

```bash
# Visualizar configuração EAS
cat artifacts/client/eas.json
```

**Você deve ver**: Configuração contendo três ambientes: development, preview, production

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

### Passo 6: Verificar Condições de Saída

**Por quê**

O Sisyphus verificará se o Preview Agent atende às condições de saída, caso contrário exigirá reexecução.

**Lista de Verificação**

| Item de Verificação | Descrição | Passou/Falhou |
| ---- | ---- | ---- |
| README contém passos de instalação | Lista claramente comandos de instalação de dependência necessários para backend e frontend | [ ] |
| README contém comandos de execução | Fornece comandos para iniciar backend e frontend separadamente | [ ] |
| README lista endereços de acesso e fluxo de demonstração | Explica endereços e portas a serem acessados durante a demonstração | [ ] |
| Configuração Docker pode ser construída normalmente | Dockerfile e docker-compose.yml sem erros de sintaxe | [ ] |
| Template de variáveis de ambiente de produção está completo | .env.production.example contém todas as configurações necessárias | [ ] |

**Se falhar**:

```bash
# Reexecutar fase Preview
factory run preview
```

## Pontos de Verificação ✅

**Confirme que você completou**:

- [ ] Fase Preview executada com sucesso
- [ ] Arquivo `artifacts/preview/README.md` existe e o conteúdo está completo
- [ ] Arquivo `artifacts/backend/Dockerfile` existe e pode ser construído
- [ ] Arquivo `artifacts/backend/docker-compose.yml` existe
- [ ] Arquivo `artifacts/backend/.env.production.example` existe
- [ ] Arquivo `artifacts/client/eas.json` existe (aplicativo móvel)
- [ ] README contém passos de instalação claros e comandos de execução
- [ ] README contém fluxo de demonstração e problemas conhecidos

## Alertas de Armadilhas

### ⚠️ Armadilha 1: Ignorar Passos de Instalação de Dependência

**Problema**: No README só está escrito "iniciar serviço", sem explicar como instalar dependências.

**Sintoma**: Novos membros seguem o README, executam `npm run dev` e recebem erro "módulo não encontrado".

**Solução**: Preview Agent impõe "README deve conter passos de instalação", garantindo que cada passo tenha comandos claros.

**Exemplo Correto**:

```bash
# ❌ Errado - falta passos de instalação
npm run dev

# ✅ Correto - inclui passos completos
npm install
npm run dev
```

### ⚠️ Armadilha 2: Configuração Docker Usando Tag latest

**Problema**: No Dockerfile usa `FROM node:latest` ou `FROM node:alpine`.

**Sintoma**: Cada build pode usar versões diferentes do Node.js, causando inconsistência de ambiente.

**Solução**: Preview Agent impõe "NUNCA use latest como tag de imagem Docker, deve usar número de versão específico".

**Exemplo Correto**:

```dockerfile
# ❌ Errado - usa latest
FROM node:latest

# ❌ Errado - não especifica versão
FROM node:alpine

# ✅ Correto - usa versão específica
FROM node:20-alpine
```

### ⚠️ Armadilha 3: Variáveis de Ambiente Codificadas

**Problema**: Em configurações Docker ou EAS codifica informações sensíveis (senhas, API Key, etc.).

**Sintoma**: Informações sensíveis vazam para o repositório de código, representando risco de segurança.

**Solução**: Preview Agent impõe "NUNCA codifique informações sensíveis em configurações de implantação", use templates de variáveis de ambiente.

**Exemplo Correto**:

```yaml
# ❌ Errado - senha do banco de dados codificada
DATABASE_URL=postgresql://user:password123@host:5432/database

# ✅ Correto - usa variável de ambiente
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}
```

### ⚠️ Armadilha 4: Problemas Conhecidos Não Listados

**Problema**: No README não lista problemas conhecidos e limitações, exagerando capacidades do produto.

**Sintoma**: Problemas inesperados ocorrem durante a demonstração, causando constrangimento e queda de confiança.

**Solução**: Preview Agent impõe "NUNCA exagere funcionalidades ou oculte defeitos", liste proativamente problemas existentes na versão atual.

**Exemplo Correto**:

```markdown
## Problemas Conhecidos e Limitações

### Limitações de Funcionalidade
- [ ] Ainda não suporta registro e login de usuários
- [ ] Recomendação de IA pode ser imprecisa (depende do retorno da API OpenAI)
```

### ⚠️ Armadilha 5: Fluxo de Demonstração Muito Complexo

**Problema**: Fluxo de demonstração contém 10+ passos, requer mais de 10 minutos.

**Sintoma**: O apresentador não consegue lembrar os passos, a audiência perde a paciência.

**Solução**: Preview Agent impõe "Fluxo de demonstração deve ser controlado em 3-5 minutos, passos não devem exceder 5".

**Exemplo Correto**:

```markdown
### Passos da Demonstração

1. **Introdução do Cenário** (30 segundos)
   - Apresentar usuário-alvo e problema central

2. **Demonstração de Funcionalidade** (3-5 minutos)
   - Passo 1: Usuário insere preferências
   - Passo 2: IA recomenda baseado nas preferências
   - Passo 3: Usuário visualiza resultados

3. **Destaques Técnicos** (opcional, 1 minuto)
   - Recomendação de IA em tempo real
   - Design responsivo para dispositivos móveis
```

## Templates de Configuração CI/CD

O Preview Agent pode referenciar `templates/cicd-github-actions.md` para gerar configurações CI/CD, incluindo:

### Pipeline CI Backend

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

### Pipeline CI Frontend

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

## Templates de Configuração Git Hooks

O Preview Agent pode referenciar `templates/git-hooks-husky.md` para gerar configurações Git Hooks, incluindo:

### Hook pre-commit

Executar verificações e formatação de código antes do commit.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Executando verificações pre-commit..."

# Executar lint-staged
npx lint-staged

# Verificar tipos TypeScript
echo "📝 Verificando tipos..."
npm run type-check

echo "✅ Verificações pre-commit passaram!"
```

### Hook commit-msg

Validar formato da mensagem de commit.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📋 Validando mensagem de commit..."

npx --no -- commitlint --edit "$1"

echo "✅ Mensagem de commit é válida!"
```

## Resumo da Lição

A fase Preview é o último elo do pipeline, responsável por preparar documentação completa de uso e implantação para o aplicativo gerado. Ela gera automaticamente:

- **Guia de Execução**: Passos claros de instalação, comandos de inicialização e fluxo de demonstração
- **Configuração Docker**: Dockerfile e docker-compose.yml, suportando implantação containerizada
- **Configuração EAS**: Configuração de build Expo EAS, suportando publicação de aplicativos móveis
- **Configuração CI/CD**: Pipeline GitHub Actions, suportando integração e implantação contínuas
- **Git Hooks**: Configuração Husky, suportando verificações pré-commit

**Princípios-Chave**:

1. **Local Primeiro**: Garante que qualquer pessoa com ambiente de desenvolvimento básico possa iniciar localmente
2. **Pronto para Deploy**: Fornece todos os arquivos de configuração necessários para implantação em produção
3. **História do Usuário**: Projeta fluxos de demonstração curtos, mostrando o valor central
4. **Riscos Transparentes**: Lista proativamente limitações ou problemas conhecidos da versão atual

Após completar a fase Preview, você obterá:

- ✅ Guia de execução completo (`README.md`)
- ✅ Configuração de containerização Docker (`Dockerfile`, `docker-compose.yml`)
- ✅ Template de variáveis de ambiente de produção (`.env.production.example`)
- ✅ Configuração de build Expo EAS (`eas.json`)
- ✅ Guia de implantação detalhado opcional (`DEPLOYMENT.md`)

## Próxima Lição

> Parabéns! Você completou todas as 7 fases do AI App Factory.
>
> Se você deseja entender mais profundamente o mecanismo de coordenação do pipeline, pode estudar o **[Detalhamento do Orquestrador Sisyphus](../orchestrator/)**.
>
> Você aprenderá:
> - Como o orquestrador coordena a execução do pipeline
> - Mecanismos de verificação de permissões e tratamento de ultrapassagem
> - Estratégias de tratamento de falhas e rollback
> - Otimização de contexto e técnicas de economia de Token

---

## Apêndice: Referência de Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-29

| Funcionalidade | Caminho do Arquivo | Linha |
| ---- | ---- | ---- |
| Definição do Preview Agent | [`source/hyz1992/agent-app-factory/agents/preview.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/preview.agent.md) | 1-33 |
| Guia de Habilidades Preview | [`source/hyz1992/agent-app-factory/skills/preview/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/preview/skill.md) | 1-583 |
| Configuração do Pipeline | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 98-111 |
| Template de Configuração CI/CD | [`source/hyz1992/agent-app-factory/templates/cicd-github-actions.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/cicd-github-actions.md) | 1-617 |
| Template de Configuração Git Hooks | [`source/hyz1992/agent-app-factory/templates/git-hooks-husky.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/git-hooks-husky.md) | 1-530 |

**Restrições-Chave**:
- **Local Primeiro**: Garante que qualquer pessoa com ambiente de desenvolvimento básico possa iniciar localmente
- **Pronto para Deploy**: Fornece todos os arquivos de configuração necessários para implantação em produção
- **Riscos Transparentes**: Lista proativamente limitações ou problemas conhecidos da versão atual

**Arquivos que Devem Ser Gerados**:
- `artifacts/preview/README.md` - Documentação principal de execução
- `artifacts/backend/Dockerfile` - Configuração Docker backend
- `artifacts/backend/docker-compose.yml` - Docker Compose ambiente dev
- `artifacts/backend/.env.production.example` - Template variáveis ambiente produção
- `artifacts/client/eas.json` - Configuração build Expo EAS

**NÃO FAÇA (NEVER)**:
- NUNCA ignore passos de instalação ou configuração, caso contrário a execução ou implantação provavelmente falhará
- NUNCA forneça instruções extras ou linguagem de marketing não relacionadas ao aplicativo
- NUNCA exagere capacidades do produto, oculte defeitos ou limitações
- NUNCA codifique informações sensíveis em configurações de implantação (senhas, API Key, etc.)
- NUNCA ignore configuração de health check, isso é crucial para monitoramento em produção
- NUNCA pule instruções de migração de banco de dados, este é um passo crucial para colocar online
- NUNCA use `latest` como tag de imagem Docker, deve usar número de versão específico
- NUNCA use SQLite em produção (deve migrar para PostgreSQL)

</details>
