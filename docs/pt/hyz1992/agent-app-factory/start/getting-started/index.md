---
title: "Início Rápido: Da Ideia ao Aplicativo | Tutorial do AI App Factory"
sidebarTitle: "Começar em 5 Minutos"
subtitle: "Início Rápido: Da Ideia ao Aplicativo"
description: "Aprenda como o AI App Factory converte automaticamente ideias de produto em aplicativos MVP funcionais através de um pipeline de 7 etapas. Este tutorial cobre valores principais, pré-requisitos, inicialização do projeto, início do pipeline e execução do código, ajudando você a começar rapidamente com a geração de aplicativos alimentados por IA em 5 minutos. Automação ponta a ponta, mecanismo de pontos de verificação e pronto para produção, incluindo código front-end e back-end, testes, documentação e configuração CI/CD."
tags:
  - "Início Rápido"
  - "MVP"
  - "Geração por IA"
prerequisite: []
order: 10
---

# Início Rápido: Da Ideia ao Aplicativo

## O Que Você Vai Aprender

Ao terminar esta aula, você:

- Entenderá como o AI App Factory ajuda você a converter ideias em aplicativos funcionais rapidamente
- Completará a inicialização do seu primeiro projeto Factory
- Iniciará o pipeline e seguirá as 7 etapas para gerar seu primeiro aplicativo MVP

## O Seu Dilema Atual

**"Tenho uma ideia de produto, mas não sei por onde começar"**

Você já passou por isso:
- Tem uma ideia de produto, mas não sabe como分解成 requisitos executáveis
- Front-end, back-end, banco de dados, testes, implantação... tudo leva tempo
- Quer validar rapidamente a ideia, mas configurar o ambiente de desenvolvimento leva dias
- Escreve o código e depois descobre que entendeu mal os requisitos, precisa refazer tudo

O AI App Factory foi criado para resolver esses problemas.

## Quando Usar Esta Abordagem

O AI App Factory é adequado para esses cenários:

- ✅ **Validar rapidamente ideias de produto**: Quer testar se a ideia é viável
- ✅ **Fase 0-1 de projetos de startup**: Precisa entregar rapidamente um protótipo demonstrável
- ✅ **Ferramentas internas e sistemas de gestão**: Não precisa de permissões complexas, simples e prático é suficiente
- ✅ **Aprender melhores práticas de desenvolvimento full-stack**: Veja como a IA gera código pronto para produção

Não adequado para esses cenários:

- ❌ **Sistemas empresariais complexos**: Multi-tenant, sistema de permissões, alta concorrência
- ❌ **Interface de usuário altamente personalizada**: Projetos com sistemas de design únicos
- ❌ **Sistemas com requisitos de tempo real extremos**: Jogos, videochamadas, etc.

## 🎯 Conceito Central

O AI App Factory é um sistema inteligente de geração de aplicativos baseado em pontos de verificação, que através de um pipeline colaborativo de múltiplos agentes, converte automaticamente sua ideia de produto em um aplicativo completo e funcional, incluindo código front-end e back-end, testes e documentação.

**Três Valores Principais**:

### 1. Automação Ponta a Ponta

Da ideia ao código, totalmente automático:
- Entrada: Descreva sua ideia de produto em uma frase
- Saída: Aplicativo completo front-end e back-end (Express + Prisma + React Native)
- Processo intermediário: Análise de requisitos, design de interface, arquitetura técnica e geração de código são completados automaticamente

### 2. Mecanismo de Pontos de Verificação

Pausa após cada etapa, aguardando sua confirmação:
- ✅ Impede o acúmulo de erros, garantindo que cada passo atenda às expectativas
- ✅ Você pode ajustar a direção a qualquer momento, evitando descobrir tarde que se desviou
- ✅ Em caso de falha, reverte automaticamente, não desperdiçando tempo em código incorreto

### 3. Pronto para Produção

O código gerado não é um brinquedo, mas um aplicativo pronto para produção que pode ser implantado diretamente:
- ✅ Código completo front-end e back-end
- ✅ Testes unitários e de integração (>60% de cobertura)
- ✅ Documentação de API (Swagger/OpenAPI)
- ✅ Dados de semente do banco de dados
- ✅ Configuração de implantação Docker
- ✅ Pipeline CI/CD (GitHub Actions)
- ✅ Tratamento de erros e monitoramento de logs
- ✅ Otimização de desempenho e verificação de segurança

**Pipeline de 7 Etapas**:

```
Bootstrap → PRD → UI → Tech → Code → Validation → Preview
   ↓          ↓    ↓     ↓      ↓         ↓          ↓
Estrutura  Produto UI   Técnico  Código    Validação  Guia de
Ideia      Requisitos Design Arquitetura Geração Qualidade Implantação
```

## 🎒 Preparativos Antes de Começar

### Ferramentas Necessárias

**1. Node.js >= 16.0.0**

```bash
# Verificar versão do Node.js
node --version
```

Se não estiver instalado ou a versão for muito baixa, baixe e instale em [nodejs.org](https://nodejs.org/).

**2. Assistente de Programação IA (Obrigatório)** ⚠️ Importante

As definições de Agent e arquivos Skill do AI App Factory são instruções de IA em formato Markdown que devem ser interpretadas e executadas por assistentes de IA. Pessoas não podem executar esses pipelines diretamente.

Recomenda-se usar uma das seguintes ferramentas:

- **Claude Code** (https://claude.ai/code) - Recomendado ⭐
- **OpenCode** ou outros assistentes de IA que suportem modo Agent

::: warning Por que é obrigatório usar assistente de IA?
O núcleo deste projeto é o sistema de Agentes IA, cada etapa precisa do assistente de IA:
- Ler arquivos `.agent.md` para entender sua tarefa
- Carregar os arquivos Skill correspondentes para obter conhecimento
- Gerar código e documentação estritamente de acordo com as instruções

Humanos não podem substituir este processo, assim como você não pode executar código Python usando o Bloco de Notas.
:::

**3. Instalar globalmente a ferramenta CLI**

```bash
npm install -g agent-app-factory
```

Verificar instalação:

```bash
factory --version
```

Você deve ver a saída do número da versão.

### Preparar a Ideia do Produto

Gaste 5 minutos para escrever sua ideia de produto. Quanto mais detalhada for a descrição, mais próximo da expectativa será o aplicativo gerado.

**Exemplo de boa descrição**:

> ✅ Um aplicativo que ajuda iniciantes em fitness a registrar treinos, suporta registro de tipos de exercício (corrida, natação, academia), duração, calorias queimadas, e permite ver estatísticas de treino da semana. Não precisa colaboração multi-usuário, não faz análise de dados, focado em registro pessoal.

**Exemplo de má descrição**:

> ❌ Faça um aplicativo de fitness.

## Siga Minhas Operações

### Passo 1: Criar Diretório do Projeto

Crie um diretório vazio em qualquer lugar:

```bash
mkdir my-first-app && cd my-first-app
```

### Passo 2: Inicializar Projeto Factory

Execute o comando de inicialização:

```bash
factory init
```

**Por que**
Isso criará o diretório `.factory/` e copiará todos os arquivos necessários de Agent, Skill e Policy, tornando o diretório atual um projeto Factory.

**Você deve ver**:

```
✓ Diretório .factory/ criado
✓ Copiado agents/, skills/, policies/, pipeline.yaml
✓ Arquivos de configuração gerados: config.yaml, state.json
✓ Configuração de permissões Claude Code gerada: .claude/settings.local.json
✓ Tentou instalar plugins necessários (superpowers, ui-ux-pro-max)
```

Se vir mensagens de erro, verifique:
- O diretório está vazio (ou contém apenas arquivos de configuração)
- A versão do Node.js é >= 16.0.0
- Se o agent-app-factory foi instalado globalmente

::: tip Estrutura de Diretórios
Após inicialização, sua estrutura de diretórios deve ser:

```
my-first-app/
├── .factory/
│   ├── agents/              # Arquivos de definição de Agent
│   ├── skills/              # Módulos de conhecimento reutilizáveis
│   ├── policies/            # Políticas e especificações
│   ├── pipeline.yaml         # Definição do pipeline
│   ├── config.yaml          # Configuração do projeto
│   └── state.json           # Estado do pipeline
└── .claude/
    └── settings.local.json  # Configuração de permissões Claude Code
```
:::

### Passo 3: Iniciar o Pipeline

No assistente de IA (recomendado Claude Code), execute a seguinte instrução:

```
Por favor, leia pipeline.yaml e agents/orchestrator.checkpoint.md,
inicie o pipeline e ajude-me a converter esta ideia de produto em um aplicativo funcional:

[Cole sua ideia de produto]
```

**Por que**
Isso fará com que o escalonador Sisyphus inicie o pipeline, começando da fase Bootstrap, e converta sua ideia passo a passo em código.

**Você deve ver**:

O assistente de IA irá:
1. Ler pipeline.yaml e orchestrator.checkpoint.md
2. Mostrar o estado atual (idle → running)
3. Iniciar o Bootstrap Agent e começar a estruturar sua ideia de produto

### Passo 4: Seguir as 7 Etapas

O sistema executará as seguintes 7 etapas, **pausando após cada etapa e aguardando sua confirmação**:

#### Etapa 1: Bootstrap - Estruturar Ideia do Produto

**Entrada**: Sua descrição do produto
**Saída**: `input/idea.md` (documento de produto estruturado)

**Conteúdo a confirmar**:
- Definição do problema: Qual problema resolve?
- Usuários-alvo: Quem encontra esse problema?
- Valor principal: Por que este produto é necessário?
- Hipóteses principais: Quais são suas suposições?

**Você deve ver**:

O assistente de IA perguntará:

```
✓ Fase Bootstrap concluída
Documento gerado: input/idea.md

Por favor confirme:
1. Continuar para a próxima fase
2. Tentar novamente a fase atual (fornecer sugestões de modificação)
3. Pausar o pipeline
```

Leia cuidadosamente `input/idea.md`. Se houver inconsistências, escolha "Tentar novamente" e forneça sugestões de modificação.

#### Etapa 2: PRD - Gerar Documento de Requisitos do Produto

**Entrada**: `input/idea.md`
**Saída**: `artifacts/prd/prd.md`

**Conteúdo a confirmar**:
- User stories: Como os usuários usarão este produto?
- Lista de funcionalidades: Quais funcionalidades principais precisam ser implementadas?
- Não-obrigatórios: O que não será feito explicitamente (para evitar expansão de escopo)

#### Etapa 3: UI - Design Estrutura UI e Protótipo

**Entrada**: `artifacts/prd/prd.md`
**Saída**: `artifacts/ui/ui.schema.yaml` + Protótipo HTML visualizável

**Conteúdo a confirmar**:
- Estrutura da página: Quais páginas existem?
- Fluxo de interação: Como os usuários operam?
- Design visual: Esquema de cores, fontes, layout

**Característica**: Integração com sistema de design ui-ux-pro-max (67 estilos, 96 paletas de cores, 100 regras da indústria)

#### Etapa 4: Tech - Design Arquitetura Técnica

**Entrada**: `artifacts/prd/prd.md`
**Saída**: `artifacts/tech/tech.md` + `artifacts/backend/prisma/schema.prisma`

**Conteúdo a confirmar**:
- Stack tecnológica: Quais tecnologias usar?
- Modelo de dados: Quais tabelas existem? Quais são os campos?
- Design de API: Quais endpoints de API existem?

#### Etapa 5: Code - Gerar Código Completo

**Entrada**: UI Schema + Design Tech + Prisma Schema
**Saída**: `artifacts/backend/` + `artifacts/client/`

**Conteúdo a confirmar**:
- Código back-end: Express + Prisma + TypeScript
- Código front-end: React Native + TypeScript
- Testes: Vitest (back-end) + Jest (front-end)
- Arquivos de configuração: package.json, tsconfig.json, etc.

#### Etapa 6: Validation - Validar Qualidade do Código

**Entrada**: Código gerado
**Saída**: `artifacts/validation/report.md`

**Conteúdo a confirmar**:
- Instalação de dependências: npm install foi bem-sucedido?
- Verificação de tipos: Compilação TypeScript passou?
- Verificação Prisma: Schema do banco de dados está correto?

#### Etapa 7: Preview - Gerar Guia de Implantação

**Entrada**: Código completo
**Saída**: `artifacts/preview/README.md` + `GETTING_STARTED.md`

**Conteúdo a confirmar**:
- Instruções de execução local: Como iniciar front-end e back-end localmente?
- Implantação Docker: Como usar Docker para implantar?
- Configuração CI/CD: Como configurar GitHub Actions?

### Ponto de Verificação ✅

Após concluir todas as 7 etapas, você deve ver:

```
✓ Todas as fases do pipeline concluídas
Produtos finais:
- artifacts/prd/prd.md (Documento de requisitos do produto)
- artifacts/ui/ui.schema.yaml (Design UI)
- artifacts/tech/tech.md (Arquitetura técnica)
- artifacts/backend/ (Código back-end)
- artifacts/client/ (Código front-end)
- artifacts/validation/report.md (Relatório de validação)
- artifacts/preview/GETTING_STARTED.md (Guia de execução)

Próximo passo: Consulte artifacts/preview/GETTING_STARTED.md para começar a executar o aplicativo
```

Parabéns! Seu primeiro aplicativo gerado por IA está completo.

### Passo 5: Executar o Aplicativo Gerado

Execute o aplicativo seguindo o guia gerado:

```bash
# Back-end
cd artifacts/backend
npm install
npm run dev

# Abra uma nova janela de terminal, execute o front-end
cd artifacts/client
npm install
npm run web  # Versão Web
# ou
npm run ios      # Simulador iOS
# ou
npm run android  # Simulador Android
```

**Você deve ver**:
- Back-end iniciado em `http://localhost:3000`
- Front-end iniciado em `http://localhost:8081` (versão Web) ou aberto no simulador

## Dicas para Evitar Armadilhas

### ❌ Erro 1: Diretório Não Vazio

**Mensagem de erro**:

```
✗ Diretório não vazio, limpe e tente novamente
```

**Causa**: Já existem arquivos no diretório ao inicializar

**Solução**:

```bash
# Método 1: Limpar diretório (manter apenas arquivos de configuração ocultos)
ls -a    # Ver todos os arquivos
rm -rf !(.*)

# Método 2: Criar novo diretório
mkdir new-app && cd new-app
factory init
```

### ❌ Erro 2: Assistente IA Não Consegue Entender Instruções

**Sintoma**: Assistente IA reporta erro "Não foi possível encontrar definição de Agent"

**Causa**: Não executado no diretório do projeto Factory

**Solução**:

```bash
# Certifique-se de estar no diretório raiz do projeto contendo o diretório .factory/
ls -la  # Deve ver .factory/
pwd     # Confirmar diretório atual
```

### ❌ Erro 3: Claude CLI Não Instalado

**Mensagem de erro**:

```
✗ Claude CLI não instalado, visite https://claude.ai/code para baixar
```

**Solução**:

Baixe e instale o Claude Code CLI em https://claude.ai/code.

## Resumo da Aula

Nesta aula você aprendeu:

- **Valores principais do AI App Factory**: Automação ponta a ponta + Mecanismo de pontos de verificação + Pronto para produção
- **Pipeline de 7 etapas**: Bootstrap → PRD → UI → Tech → Code → Validation → Preview
- **Como inicializar o projeto**: Comando `factory init`
- **Como iniciar o pipeline**: Executar instrução no assistente de IA
- **Como seguir o pipeline**: Confirmar após cada etapa, garantindo que a saída atenda às expectativas

**Pontos-chave**:
- Deve ser usado com assistente de IA (Claude Code recomendado)
- Fornecer descrição clara e detalhada do produto
- Confirmar cuidadosamente em cada ponto de verificação para evitar acúmulo de erros
- O código gerado é pronto para produção e pode ser usado diretamente

## Próximo Passo

> Na próxima aula aprenderemos **[Instalação e Configuração](../installation/)**.
>
> Você aprenderá:
> - Como instalar globalmente o Agent Factory CLI
> - Como configurar o assistente de IA (Claude Code / OpenCode)
> - Como instalar os plugins necessários (superpowers, ui-ux-pro-max)

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Atualizado em: 2026-01-29

| Funcionalidade | Caminho do Arquivo | Linhas |
| ----------------- | --------------------------------------------------------------------------------------------- | --------- |
| Entrada CLI | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 1-123 |
| Implementação comando init | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | - |
| Implementação comando run | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | - |
| Implementação comando continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | - |
| Definição do pipeline | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | - |
| Definição do escalonador | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | - |

**Configurações principais**:
- `pipeline.yaml`: Define a ordem do pipeline de 7 etapas e entrada/saída de cada etapa
- `.factory/state.json`: Mantém o estado de execução do pipeline (idle/running/waiting_for_confirmation/paused/failed)

**Fluxo principal**:
- `factory init` → Criar diretório `.factory/`, copiar arquivos Agent, Skill, Policy
- `factory run` → Ler `state.json`, detectar tipo de assistente de IA, gerar instrução do assistente
- `factory continue` → Regenerar configuração de permissões Claude Code, iniciar nova sessão para continuar execução

</details>
