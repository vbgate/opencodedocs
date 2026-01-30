---
title: "Registro de Alterações: Histórico de Versões e Mudanças | Agent App Factory"
sidebarTitle: "Registro de Alterações"
subtitle: "Registro de Alterações: Histórico de Versões e Mudanças | Agent App Factory"
description: "Conheça o histórico de atualizações do Agent App Factory, incluindo mudanças de funcionalidades, correções de bugs e melhorias significativas. Esta página documenta o histórico completo de alterações desde a versão 1.0.0, abrangendo o sistema de pipeline de 7 estágios, agendador Sisyphus, gerenciamento de permissões, otimização de contexto e estratégias de tratamento de falhas."
tags:
  - "Registro de Alterações"
  - "Histórico de Versões"
prerequisite: []
order: 250
---

# Registro de Alterações

Esta página documenta o histórico de atualizações de versões do Agent App Factory, incluindo novas funcionalidades, melhorias, correções de bugs e alterações incompatíveis.

O formato segue a especificação [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e o versionamento segue o [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-01-29

### Adicionado

**Funcionalidades Principais**
- **Sistema de Pipeline de 7 Estágios**: Fluxo automatizado completo da ideia ao aplicativo executável
  - Bootstrap - Estruturação da ideia do produto (input/idea.md)
  - PRD - Geração do documento de requisitos do produto (artifacts/prd/prd.md)
  - UI - Design da estrutura de UI e protótipo visualizável (artifacts/ui/)
  - Tech - Design da arquitetura técnica e modelo de dados Prisma (artifacts/tech/)
  - Code - Geração de código frontend e backend (artifacts/backend/, artifacts/client/)
  - Validation - Validação da qualidade do código (artifacts/validation/report.md)
  - Preview - Geração do guia de implantação (artifacts/preview/README.md)

- **Agendador Sisyphus**: Componente central de controle do pipeline
  - Executa sequencialmente os estágios definidos em pipeline.yaml
  - Valida entrada/saída e critérios de saída de cada estágio
  - Mantém o estado do pipeline (.factory/state.json)
  - Executa verificações de permissão para prevenir leitura/escrita não autorizada por Agents
  - Trata situações de exceção conforme a política de falhas
  - Pausa em cada checkpoint, aguardando confirmação manual para continuar

**Ferramentas CLI**
- `factory init` - Inicializa um projeto Factory
- `factory run [stage]` - Executa o pipeline (a partir do estágio atual ou especificado)
- `factory continue` - Continua a execução em uma nova sessão (economiza Tokens)
- `factory status` - Visualiza o status atual do projeto
- `factory list` - Lista todos os projetos Factory
- `factory reset` - Reseta o estado do projeto atual

**Permissões e Segurança**
- **Matriz de Capacidades** (capability.matrix.md): Define permissões estritas de leitura/escrita para cada Agent
  - Cada Agent só pode acessar diretórios autorizados
  - Arquivos escritos sem autorização são movidos para artifacts/_untrusted/
  - Após falha, o pipeline pausa automaticamente aguardando intervenção manual

**Otimização de Contexto**
- **Execução em Sessões Separadas**: Cada estágio é executado em uma nova sessão
  - Evita acúmulo de contexto, economizando Tokens
  - Suporta recuperação após interrupção
  - Compatível com todos os assistentes de IA (Claude Code, OpenCode, Cursor)

**Estratégias de Tratamento de Falhas**
- Mecanismo de retry automático: Cada estágio permite uma tentativa de retry
- Arquivamento de falhas: Artefatos com falha são movidos para artifacts/_failed/
- Mecanismo de rollback: Retorna ao checkpoint bem-sucedido mais recente
- Intervenção manual: Pausa após duas falhas consecutivas

**Garantia de Qualidade**
- **Padrões de Código** (code-standards.md)
  - Padrões de codificação TypeScript e melhores práticas
  - Estrutura de arquivos e convenções de nomenclatura
  - Requisitos de comentários e documentação
  - Padrão de mensagens de commit Git (Conventional Commits)

- **Padrão de Códigos de Erro** (error-codes.md)
  - Estrutura unificada de códigos de erro: [MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - Tipos de erro padrão: VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - Mapeamento de códigos de erro frontend/backend e mensagens amigáveis ao usuário

**Gerenciamento de Changelog**
- Segue o formato Keep a Changelog
- Integração com Conventional Commits
- Suporte a ferramentas de automação: conventional-changelog-cli, release-it

**Templates de Configuração**
- Configuração de CI/CD (GitHub Actions)
- Configuração de Git Hooks (Husky)

**Características dos Aplicativos Gerados**
- Código frontend e backend completo (Express + Prisma + React Native)
- Testes unitários e de integração (Vitest + Jest)
- Documentação de API (Swagger/OpenAPI)
- Dados de seed do banco de dados
- Configuração de implantação Docker
- Tratamento de erros e monitoramento de logs
- Otimização de performance e verificações de segurança

### Melhorado

**Foco no MVP**
- Lista clara de não-objetivos (Non-Goals) para prevenir expansão de escopo
- Limite de páginas em no máximo 3
- Foco nas funcionalidades principais, evitando over-engineering

**Separação de Responsabilidades**
- Cada Agent é responsável apenas por seu domínio, sem ultrapassar limites
- PRD não inclui detalhes técnicos, Tech não envolve design de UI
- Code Agent implementa estritamente conforme o UI Schema e design técnico

**Verificabilidade**
- Cada estágio define exit_criteria claros
- Todas as funcionalidades são testáveis e executáveis localmente
- Artefatos devem ser estruturados e consumíveis pelos estágios seguintes

### Stack Tecnológica

**Ferramentas CLI**
- Node.js >= 16.0.0
- Commander.js - Framework de linha de comando
- Chalk - Saída colorida no terminal
- Ora - Indicador de progresso
- Inquirer - Linha de comando interativa
- fs-extra - Operações de sistema de arquivos
- YAML - Parser de YAML

**Aplicativos Gerados**
- Backend: Node.js + Express + Prisma + TypeScript + Vitest
- Frontend: React Native + Expo + TypeScript + Jest + React Testing Library
- Implantação: Docker + GitHub Actions

### Dependências

- `chalk@^4.1.2` - Estilos de cores no terminal
- `commander@^11.0.0` - Parser de argumentos de linha de comando
- `fs-extra@^11.1.1` - Extensões do sistema de arquivos
- `inquirer@^8.2.5` - Linha de comando interativa
- `ora@^5.4.1` - Loader elegante para terminal
- `yaml@^2.3.4` - Parser e serialização de YAML

## Notas de Versão

### Semantic Versioning

Este projeto segue o formato de versão [Semantic Versioning](https://semver.org/lang/pt-BR/): MAJOR.MINOR.PATCH

- **MAJOR**: Alterações de API incompatíveis
- **MINOR**: Novas funcionalidades compatíveis com versões anteriores
- **PATCH**: Correções de bugs compatíveis com versões anteriores

### Tipos de Alteração

- **Adicionado** (Added): Novas funcionalidades
- **Alterado** (Changed): Mudanças em funcionalidades existentes
- **Descontinuado** (Deprecated): Funcionalidades que serão removidas
- **Removido** (Removed): Funcionalidades já removidas
- **Corrigido** (Fixed): Correções de bugs
- **Segurança** (Security): Correções de segurança

## Recursos Relacionados

- [GitHub Releases](https://github.com/hyz1992/agent-app-factory/releases) - Página oficial de releases
- [Repositório do Projeto](https://github.com/hyz1992/agent-app-factory) - Código-fonte
- [Rastreador de Issues](https://github.com/hyz1992/agent-app-factory/issues) - Reportar problemas e sugestões
- [Guia de Contribuição](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - Como contribuir

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2024-01-29

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json) | 1-52 |
| Entrada CLI | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 1-123 |
| Comando init | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-427 |
| Comando run | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-294 |
| Comando continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-87 |
| Definição do Pipeline | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 1-87 |
| Definição do Agendador | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Matriz de Permissões | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-44 |
| Política de Falhas | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-200 |
| Padrões de Código | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-287 |
| Padrão de Códigos de Erro | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-134 |
| Padrão de Changelog | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md) | 1-87 |

**Informações de Versão Principais**:
- `version = "1.0.0"`: Versão de lançamento inicial
- `engines.node = ">=16.0.0"`: Requisito mínimo de versão do Node.js

**Versões das Dependências**:
- `chalk@^4.1.2`: Estilos de cores no terminal
- `commander@^11.0.0`: Parser de argumentos de linha de comando
- `fs-extra@^11.1.1`: Extensões do sistema de arquivos
- `inquirer@^8.2.5`: Linha de comando interativa
- `ora@^5.4.1`: Loader elegante para terminal
- `yaml@^2.3.4`: Parser e serialização de YAML

</details>
