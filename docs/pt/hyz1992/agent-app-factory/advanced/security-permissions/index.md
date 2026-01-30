---
title: "Permissões e Mecanismos de Segurança: Matriz de Limites de Capacidade, Proteção contra Acesso Não Autorizado, Configuração de Permissões do Claude Code e Melhores Práticas de Segurança | AI App Factory"
sidebarTitle: "Permissões e Segurança"
subtitle: "Permissões e Mecanismos de Segurança: Matriz de Limites de Capacidade e Proteção contra Acesso Não Autorizado"
description: "Aprenda sobre a Matriz de Limites de Capacidade do AI App Factory, mecanismos de verificação de permissões e estratégias de proteção contra acesso não autorizado. Domine como configurar permissões do Claude Code, prevenir operações não autorizadas de Agentes, lidar com exceções de segurança e garantir a execução segura e estável do pipeline. Este tutorial inclui explicação detalhada dos três mecanismos de proteção, exercícios práticos de configuração de permissões, fluxo completo de tratamento de acesso não autorizado, validação de habilidades obrigatórias e guia de melhores práticas de segurança."
tags:
  - "Avançado"
  - "Segurança"
  - "Controle de Permissões"
  - "Matriz de Limites de Capacidade"
  - "Claude Code"
prerequisite:
  - "advanced-orchestrator"
order: 170
---

# Permissões e Mecanismos de Segurança: Matriz de Limites de Capacidade e Proteção contra Acesso Não Autorizado

## O que Você Poderá Fazer Após Este Curso

- Compreender o princípio de design da Matriz de Limites de Capacidade e o mecanismo de isolamento de permissões
- Aprender a configurar o arquivo de permissões do Claude Code, evitando o uso de `--dangerously-skip-permissions`
- Dominar o fluxo de tratamento de operações não autorizadas e métodos de recuperação
- Entender o mecanismo de validação de uso de habilidades obrigatórias
- Ser capaz de identificar e corrigir problemas de segurança relacionados a permissões

## Sua Situação Atual

Você pode ter encontrado estas situações:

- Não saber por que o Agente não consegue acessar determinados arquivos
- Ao executar `factory run`, sempre ser solicitado a conceder permissões, usando diretamente `--dangerously-skip-permissions` para ignorar
- Não estar claro sobre os limites de permissão entre Agentes, preocupado que operações não autorizadas causem contaminação de dados
- Não saber como lidar e recuperar após ocorrência de acesso não autorizado

Se esses problemas o incomodam, este capítulo ajudará você a estabelecer um conhecimento completo sobre permissões e segurança.

## Quando Usar Esta Técnica

Quando você precisar:

- **Configurar o Claude Code**: Definir o arquivo de permissões correto para projetos Factory
- **Depurar problemas de permissão**: Investigar por que um Agente não consegue ler ou escrever arquivos específicos
- **Tratar exceções de acesso não autorizado**: Recuperar pipelines interrompidos causados por operações não autorizadas
- **Expandir Agentes**: Ao adicionar novos Agentes, definir seus limites de permissão
- **Auditoria de segurança**: Verificar se a configuração de permissões do projeto existente é razoável

## Ideia Central

O mecanismo de segurança do AI App Factory é baseado na **Matriz de Limites de Capacidade** (Capability Boundary Matrix), garantindo que cada Agente opere apenas em diretórios autorizados.

**Lembre-se desta analogia**:

- Os Agentes são como **trabalhadores especializados** em uma fábrica
- A Matriz de Limites de Capacidade é como uma **licença de trabalho**, especificando claramente quais oficinas cada trabalhador pode entrar e quais equipamentos pode operar
- O orquestrador Sisyphus é como um **supervisor de segurança**, verificando as licenças quando os trabalhadores entram ou saem das oficinas, garantindo que não haja comportamentos não autorizados

**Mecanismo de Três Camadas de Proteção**:

| Nível | Responsabilidade | Momento da Verificação |
| --- | --- | --- |
| **Permissões do Claude Code** | Permissões de leitura e escrita no sistema de arquivos | Quando o assistente de IA é iniciado |
| **Matriz de Limites de Capacidade** | Permissões de acesso a diretórios do Agente | Antes e depois da execução da fase |
| **Validação de Habilidades Obrigatórias** | Requisitos de uso de habilidades específicas em determinadas fases | Nas fases bootstrap e ui |

## Detalhes da Matriz de Limites de Capacidade

### Por Que É Necessário Isolamento de Permissões?

Imagine o que aconteceria sem limites de permissão:

- **Agente PRD modifica arquivos de UI**: O design da UI é alterado de forma desordenada, sem possibilidade de rastreamento
- **Agente Tech lê arquivos de Code**: A arquitetura técnica é influenciada pela implementação do código, desviando-se do princípio MVP
- **Agente Code modifica o PRD**: O documento de requisitos é "contaminado" pela lógica do código, causando confusão de responsabilidades

**Resposta**: Limites de responsabilidade não claros, produtos sem rastreabilidade, qualidade sem garantia.

A Matriz de Limites de Capacidade garante a separação de responsabilidades ao restringir as permissões de leitura e escrita de cada Agente.

### Tabela da Matriz de Permissões

| Agente | Diretórios Legíveis | Diretórios Graváveis | Descrição |
| --- | --- | --- | --- |
| **bootstrap** | Nenhum | `input/` | Cria ou modifica `idea.md` apenas no diretório `input/` |
| **prd** | `input/` | `artifacts/prd/` | Lê arquivo de ideias, gera PRD; proibido escrever em outros diretórios |
| **ui** | `artifacts/prd/` | `artifacts/ui/` | Lê PRD, gera UI Schema e preview |
| **tech** | `artifacts/prd/` | `artifacts/tech/`, `artifacts/backend/prisma/` | Lê PRD, gera design técnico e modelos de dados |
| **code** | `artifacts/ui/`, `artifacts/tech/`, `artifacts/backend/prisma/` | `artifacts/backend/`, `artifacts/client/` | Gera código backend e cliente com base na UI e design técnico; não pode modificar produtos upstream |
| **validation** | `artifacts/backend/`, `artifacts/client/` | `artifacts/validation/` | Valida qualidade do código, gera relatório de validação; somente leitura, não modifica código |
| **preview** | `artifacts/backend/`, `artifacts/client/` | `artifacts/preview/` | Lê serviços e clientes gerados, escreve instruções de demonstração |

::: tip Princípio Central
- **Dependência Unidirecional**: Agente só pode ler produtos de fases upstream, não pode ler produtos de fases downstream ou do mesmo nível
- **Responsabilidade Independente**: Cada Agente só pode escrever em seu próprio diretório de saída
- **Proibição de Acesso Não Autorizado**: Operações de leitura e escrita não autorizadas são consideradas violações de segurança
:::

### Fluxo de Verificação de Permissões

O orquestrador Sisyphus realiza verificações de permissão antes e depois da execução de cada fase:

**Antes da Execução (Informar Permissões)**:

```
1. Sisyphus lê capability.matrix.md
2. Passa os diretórios legíveis e graváveis do Agente atual para o assistente de IA
3. O assistente de IA deve obedecer a essas restrições durante a execução
```

**Depois da Execução (Validar Saída)**:

```
1. Sisyphus escaneia arquivos criados ou modificados
2. Verifica se o caminho do arquivo está dentro do intervalo de diretórios autorizados do Agente
3. Se acesso não autorizado for detectado, trata imediatamente (veja mecanismo de tratamento de acesso não autorizado)
```

::: info Automação vs Manual
A verificação de permissões é realizada principalmente de forma automática pelo sistema de permissões do assistente de IA (Claude Code) e pela lógica de validação do Sisyphus. Intervenção manual só é necessária em casos anormais como acesso não autorizado.
:::
