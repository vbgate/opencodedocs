---
title: "Explicação Detalhada da Estrutura de Diretórios: Estrutura Completa do Projeto Factory e Uso dos Arquivos | Tutorial do AI App Factory"
sidebarTitle: "Explicação Detalhada da Estrutura de Diretórios"
subtitle: "Explicação Detalhada da Estrutura de Diretórios: Guia Completo do Projeto Factory"
description: "Aprenda a estrutura completa de diretórios do projeto AI App Factory e a função de cada arquivo. Este tutorial explica em detalhes a função dos diretórios principais como agents, skills, policies, artifacts, ajudando você a entender profundamente os princípios de funcionamento do projeto Factory, localizar e modificar arquivos de configuração rapidamente, bem como depurar problemas no pipeline."
tags:
  - "Apêndice"
  - "Estrutura de Diretórios"
  - "Arquitetura do Projeto"
prerequisite:
  - "start-init-project"
order: 220
---

# Explicação Detalhada da Estrutura de Diretórios: Guia Completo do Projeto Factory

## O que Você Vai Aprender

- ✅ Compreender a estrutura completa de diretórios do projeto Factory
- ✅ Saber a função de cada diretório e arquivo
- ✅ Entender a forma de armazenamento dos artefatos (artifacts)
- ✅ Dominar a função dos arquivos de configuração e o método de modificação

## Ideia Central

O projeto Factory adota uma estrutura de diretórios em camadas clara, separando configuração, código, artefatos e documentação. Compreender essas estruturas de diretórios ajuda você a localizar arquivos rapidamente, modificar configurações e depurar problemas.

O projeto Factory tem duas formas:

**Forma 1: Repositório de código-fonte** (clonado do GitHub)
**Forma 2: Projeto inicializado** (gerado por `factory init`)

Este tutorial foca na **Forma 2**—a estrutura do projeto Factory após inicialização, pois este é o diretório do seu trabalho diário.

---

## Estrutura Completa do Projeto Factory

```
my-app/                          # Diretório raiz do seu projeto Factory
├── .factory/                    # Diretório de configuração central do Factory (não modifique manualmente)
│   ├── pipeline.yaml             # Definição do pipeline (7 fases)
│   ├── config.yaml               # Arquivo de configuração do projeto (stack tecnológico, restrições do MVP, etc.)
│   ├── state.json                # Estado de execução do pipeline (fase atual, fases concluídas)
│   ├── agents/                   # Definições de Agent (instruções de tarefa do assistente de IA)
│   ├── skills/                   # Módulos de habilidades (conhecimento reutilizável)
│   ├── policies/                 # Documentos de políticas (permissões, tratamento de falhas, padrões de código)
│   └── templates/                # Modelos de configuração (CI/CD, Git Hooks)
├── .claude/                      # Diretório de configuração do Claude Code (gerado automaticamente)
│   └── settings.local.json       # Configuração de permissões do Claude Code
├── input/                        # Diretório de entrada do usuário
│   └── idea.md                   # Ideia de produto estruturada (gerada pelo Bootstrap)
└── artifacts/                    # Diretório de artefatos do pipeline (saída das 7 fases)
    ├── prd/                      # Artefatos PRD
    │   └── prd.md                # Documento de Requisitos do Produto
    ├── ui/                       # Artefatos UI
    │   ├── ui.schema.yaml        # Definição da estrutura UI
    │   └── preview.web/          # Protótipo HTML visualizável
    │       └── index.html
    ├── tech/                     # Artefatos Tech
    │   └── tech.md               # Documento de arquitetura técnica
    ├── backend/                  # Código de backend (Express + Prisma)
    │   ├── src/                  # Código-fonte
    │   ├── prisma/               # Configuração do banco de dados
    │   │   ├── schema.prisma     # Modelo de dados Prisma
    │   │   └── seed.ts           # Dados de semente
    │   ├── tests/                # Testes
    │   ├── docs/                 # Documentação da API
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    ├── client/                   # Código de frontend (React Native)
    │   ├── src/                  # Código-fonte
    │   ├── __tests__/            # Testes
    │   ├── app.json
    │   ├── package.json
    │   └── README.md
    ├── validation/               # Artefatos de validação
    │   └── report.md             # Relatório de validação de qualidade de código
    ├── preview/                  # Artefatos de Preview
    │   ├── README.md             # Guia de implantação e execução
    │   └── GETTING_STARTED.md    # Guia de início rápido
    ├── _failed/                  # Arquivo de artefatos com falha
    │   └── <stage-id>/           # Artefatos da fase com falha
    └── _untrusted/               # Isolamento de artefatos não confiáveis
        └── <stage-id>/           # Arquivos gravados por Agent não autorizado
```

---

## Explicação Detalhada do Diretório .factory/

O diretório `.factory/` é o núcleo do projeto Factory, contendo definições do pipeline, configurações de Agent e documentos de políticas. Este diretório é criado automaticamente pelo comando `factory init` e geralmente não precisa ser modificado manualmente.

### pipeline.yaml - Definição do Pipeline

**Função**: Define a ordem de execução, entrada e saída e critérios de saída das 7 fases.

**Conteúdo principal**:
- 7 fases: bootstrap, prd, ui, tech, code, validation, preview
- Agent, arquivos de entrada, arquivos de saída de cada fase
- Critérios de saída (exit_criteria): padrões de verificação de conclusão da fase

**Exemplo**:
```yaml
stages:
  - id: bootstrap
    description: Inicializar a ideia do projeto
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs:
      - input/idea.md
    exit_criteria:
      - idea.md existe
      - idea.md descreve uma ideia de produto coerente
```

**Quando modificar**: Geralmente não precisa modificar, a menos que você queira personalizar o fluxo do pipeline.

### config.yaml - Arquivo de Configuração do Projeto

**Função**: Configura stack tecnológico, restrições do MVP, preferências de UI e outras configurações globais.

**Principais itens de configuração**:
- `preferences`: Preferências de stack tecnológico (linguagem de backend, banco de dados, framework frontend, etc.)
- `mvp_constraints`: Controle de escopo do MVP (número máximo de páginas, número máximo de modelos, etc.)
- `ui_preferences`: Preferências de design de UI (direção estética, esquema de cores)
- `pipeline`: Comportamento do pipeline (modo de pontos de verificação, tratamento de falhas)
- `advanced`: Opções avançadas (timeout do Agent, controle de simultaneidade)

**Exemplo**:
```yaml
preferences:
  backend:
    language: typescript
    framework: express
    database: sqlite
  mvp_constraints:
    max_pages: 3
    enable_auth: false
```

**Quando modificar**: Quando você deseja ajustar o stack tecnológico ou alterar o escopo do MVP.

### state.json - Estado do Pipeline

**Função**: Registra o estado de execução do pipeline, suportando continuação de pontos de interrupção.

**Conteúdo principal**:
- `status`: Estado atual (idle/running/waiting_for_confirmation/paused/failed)
- `current_stage`: Fase atual em execução
- `completed_stages`: Lista de fases concluídas
- `last_updated`: Hora da última atualização

**Quando modificar**: Atualizado automaticamente, não modifique manualmente.

### agents/ - Diretório de Definições de Agent

**Função**: Define responsabilidades, entrada e saída e restrições de execução de cada Agent.

**Lista de arquivos**:
| Arquivo | Descrição |
|--------|----------|
| `orchestrator.checkpoint.md` | Definição central do Orquestrador (coordenação do pipeline) |
| `orchestrator-implementation.md` | Guia de implementação do Orquestrador (referência de desenvolvimento) |
| `bootstrap.agent.md` | Bootstrap Agent (ideia de produto estruturada) |
| `prd.agent.md` | PRD Agent (gera documento de requisitos) |
| `ui.agent.md` | UI Agent (desenha protótipo UI) |
| `tech.agent.md` | Tech Agent (desenha arquitetura técnica) |
| `code.agent.md` | Code Agent (gera código) |
| `validation.agent.md` | Validation Agent (valida qualidade do código) |
| `preview.agent.md` | Preview Agent (gera guia de implantação) |

**Quando modificar**: Geralmente não precisa modificar, a menos que você queira personalizar o comportamento de um Agent específico.

### skills/ - Diretório de Módulos de Habilidades

**Função**: Módulos de conhecimento reutilizáveis, cada Agent carrega o arquivo Skill correspondente.

**Estrutura do diretório**:
```
skills/
├── bootstrap/skill.md         # Estruturação de ideia de produto
├── prd/skill.md               # Geração de PRD
├── ui/skill.md                # Design de UI
├── tech/skill.md              # Arquitetura técnica + migração de banco de dados
├── code/skill.md              # Geração de código + testes + logs
│   └── references/            # Modelos de referência para geração de código
│       ├── backend-template.md   # Modelo de backend pronto para produção
│       └── frontend-template.md  # Modelo de frontend pronto para produção
└── preview/skill.md           # Configuração de implantação + guia de início rápido
```

**Quando modificar**: Geralmente não precisa modificar, a menos que você queira expandir a capacidade de um Skill específico.

### policies/ - Diretório de Documentos de Políticas

**Função**: Define políticas de permissões, tratamento de falhas, padrões de código, etc.

**Lista de arquivos**:
| Arquivo | Descrição |
|--------|----------|
| `capability.matrix.md` | Matriz de limites de capacidade (permissões de leitura/gravação do Agent) |
| `failure.policy.md` | Política de tratamento de falhas (retries, rollback, intervenção manual) |
| `context-isolation.md` | Política de isolamento de contexto (economizar Token) |
| `error-codes.md` | Padrão de códigos de erro unificados |
| `code-standards.md` | Padrões de código (estilo de codificação, estrutura de arquivos) |
| `pr-template.md` | Modelo de PR e lista de verificação de revisão de código |
| `changelog.md` | Padrão de geração de Changelog |

**Quando modificar**: Geralmente não precisa modificar, a menos que você queira ajustar políticas ou padrões.

### templates/ - Diretório de Modelos de Configuração

**Função**: Modelos de configuração como CI/CD, Git Hooks, etc.

**Lista de arquivos**:
| Arquivo | Descrição |
|--------|----------|
| `cicd-github-actions.md` | Configuração CI/CD (GitHub Actions) |
| `git-hooks-husky.md` | Configuração de Git Hooks (Husky) |

**Quando modificar**: Geralmente não precisa modificar, a menos que você queira personalizar o fluxo CI/CD.

---

## Explicação Detalhada do Diretório .claude/

### settings.local.json - Configuração de Permissões do Claude Code

**Função**: Define diretórios e permissões de operação que o Claude Code pode acessar.

**Quando é gerado**: Gerado automaticamente durante `factory init`.

**Quando modificar**: Geralmente não precisa modificar, a menos que você queira ajustar o escopo de permissões.

---

## Explicação Detalhada do Diretório input/

### idea.md - Ideia de Produto Estruturada

**Função**: Armazena ideia de produto estruturada, gerada pelo Bootstrap Agent.

**Momento de geração**: Após a conclusão da fase Bootstrap.

**Estrutura de conteúdo**:
- Definição do problema (Problem)
- Usuários-alvo (Target Users)
- Valor central (Core Value)
- Premissas (Assumptions)
- Fora do escopo (Out of Scope)

**Quando modificar**: Se você deseja ajustar a direção do produto, pode editar manualmente e depois executar novamente o Bootstrap ou as fases subsequentes.

---

## Explicação Detalhada do Diretório artifacts/

O diretório `artifacts/` é o local de armazenamento dos artefatos do pipeline, cada fase escreverá os artefatos no subdiretório correspondente.

### prd/ - Diretório de Artefatos PRD

**Arquivos de artefato**:
- `prd.md`: Documento de Requisitos do Produto

**Conteúdo**:
- Histórias de usuário (User Stories)
- Lista de funcionalidades (Features)
- Requisitos não funcionais (Non-functional Requirements)
- Fora do escopo (Out of Scope)

**Momento de geração**: Após a conclusão da fase PRD.

### ui/ - Diretório de Artefatos UI

**Arquivos de artefato**:
- `ui.schema.yaml`: Definição da estrutura UI (páginas, componentes, interações)
- `preview.web/index.html`: Protótipo HTML visualizável

**Conteúdo**:
- Estrutura de páginas (número de páginas, layout)
- Definição de componentes (botões, formulários, listas, etc.)
- Fluxo de interação (navegação, redirecionamentos)
- Sistema de design (esquema de cores, fontes, espaçamento)

**Momento de geração**: Após a conclusão da fase UI.

**Como visualizar**: Abra `preview.web/index.html` no navegador.

### tech/ - Diretório de Artefatos Tech

**Arquivos de artefato**:
- `tech.md`: Documento de arquitetura técnica

**Conteúdo**:
- Escolha do stack tecnológico (backend, frontend, banco de dados)
- Design do modelo de dados
- Design de endpoints da API
- Políticas de segurança
- Sugestões de otimização de desempenho

**Momento de geração**: Após a conclusão da fase Tech.

### backend/ - Diretório de Código de Backend

**Arquivos de artefato**:
```
backend/
├── src/                      # Código-fonte
│   ├── routes/               # Rotas da API
│   ├── services/             # Lógica de negócios
│   ├── middleware/           # Middlewares
│   └── utils/               # Funções utilitárias
├── prisma/                   # Configuração Prisma
│   ├── schema.prisma         # Modelo de dados Prisma
│   └── seed.ts              # Dados de semente
├── tests/                    # Testes
│   ├── unit/                 # Testes unitários
│   └── integration/          # Testes de integração
├── docs/                     # Documentação
│   └── api-spec.yaml        # Especificação da API (Swagger)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

**Conteúdo**:
- Servidor backend Express
- ORM Prisma (SQLite/PostgreSQL)
- Framework de teste Vitest
- Documentação da API Swagger

**Momento de geração**: Após a conclusão da fase Code.

### client/ - Diretório de Código de Frontend

**Arquivos de artefato**:
```
client/
├── src/                      # Código-fonte
│   ├── screens/              # Telas
│   ├── components/           # Componentes
│   ├── navigation/           # Configuração de navegação
│   ├── services/             # Serviços de API
│   └── utils/               # Funções utilitárias
├── __tests__/               # Testes
│   └── components/          # Testes de componentes
├── assets/                  # Recursos estáticos
├── app.json                 # Configuração Expo
├── package.json
├── tsconfig.json
└── README.md
```

**Conteúdo**:
- React Native + Expo
- React Navigation
- Jest + React Testing Library
- TypeScript

**Momento de geração**: Após a conclusão da fase Code.

### validation/ - Diretório de Artefatos de Validação

**Arquivos de artefato**:
- `report.md`: Relatório de validação de qualidade de código

**Conteúdo**:
- Verificação de instalação de dependências
- Verificação de tipos TypeScript
- Validação do schema Prisma
- Cobertura de testes

**Momento de geração**: Após a conclusão da fase Validation.

### preview/ - Diretório de Artefatos de Preview

**Arquivos de artefato**:
- `README.md`: Guia de implantação e execução
- `GETTING_STARTED.md`: Guia de início rápido

**Conteúdo**:
- Passos para execução local
- Configuração de implantação Docker
- Pipeline CI/CD
- Endereços de acesso e fluxo de demonstração

**Momento de geração**: Após a conclusão da fase Preview.

### _failed/ - Arquivo de Artefatos com Falha

**Função**: Armazena artefatos de fases com falha, facilitando a depuração.

**Estrutura do diretório**:
```
_failed/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**Quando é gerado**: Após duas falhas consecutivas em uma fase específica.

### _untrusted/ - Isolamento de Artefatos Não Confiáveis

**Função**: Armazena arquivos gravados por Agents não autorizados, evitando contaminar os artefatos principais.

**Estrutura do diretório**:
```
_untrusted/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**Quando é gerado**: Quando um Agent tenta gravar em um diretório não autorizado.

---

## Perguntas Frequentes

### 1. Posso modificar manualmente os arquivos sob .factory/?

::: warning Modifique com Cuidado
**Não recomendamos** modificar diretamente os arquivos sob `.factory/`, a menos que você saiba muito bem o que está fazendo. Modificações incorretas podem causar falha no funcionamento do pipeline.

Se você precisa personalizar configurações, priorize modificar o arquivo `config.yaml`.
:::

### 2. Os arquivos sob artifacts/ podem ser modificados manualmente?

**Sim**. Os arquivos sob `artifacts/` são saídas do pipeline, você pode:

- Modificar `input/idea.md` ou `artifacts/prd/prd.md` para ajustar a direção do produto
- Corrigir manualmente o código em `artifacts/backend/` ou `artifacts/client/`
- Ajustar os estilos em `artifacts/ui/preview.web/index.html`

Após a modificação, você pode executar o pipeline novamente a partir da fase correspondente.

### 3. Como lidar com os arquivos sob _failed/ e _untrusted/?

- **_failed/**: Verifique a causa da falha e, após corrigir o problema, execute novamente a fase.
- **_untrusted/**: Confirme se o arquivo deve existir; se sim, mova o arquivo para o diretório correto.

### 4. E se o arquivo state.json estiver corrompido?

Se o `state.json` estiver corrompido, você pode executar o seguinte comando para redefinir:

```bash
factory reset
```

### 5. Como visualizar o estado atual do pipeline?

Execute o seguinte comando para visualizar o estado atual:

```bash
factory status
```

---

## Resumo da Lição

Nesta lição, explicamos em detalhes a estrutura completa de diretórios do projeto Factory:

- ✅ `.factory/`: Configuração central do Factory (pipeline, agents, skills, policies)
- ✅ `.claude/`: Configuração de permissões do Claude Code
- ✅ `input/`: Entrada do usuário (idea.md)
- ✅ `artifacts/`: Artefatos do pipeline (prd, ui, tech, backend, client, validation, preview)
- ✅ `_failed/` e `_untrusted/`: Arquivo de artefatos com falha e não confiáveis

Compreender essas estruturas de diretórios ajuda você a localizar arquivos rapidamente, modificar configurações e depurar problemas.

---

## Próximo

> Na próxima lição, aprenderemos **[Padrões de Código](../code-standards/)**.
>
> Você aprenderá:
> - Padrões de codificação TypeScript
> - Estrutura de arquivos e convenções de nomenclatura
> - Requisitos de comentários e documentação
> - Padrões de mensagens de commit do Git
