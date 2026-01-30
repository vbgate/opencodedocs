---
title: "Changelog: Histórico de Versões | everything-claude-code"
sidebarTitle: "Confira as novidades"
subtitle: "Changelog: Histórico de Versões"
description: "Conheça o histórico de versões e as principais alterações do everything-claude-code. Acompanhe novos recursos, correções de segurança e atualizações de documentação."
tags:
  - "changelog"
  - "updates"
prerequisite: []
order: 250
---

# Changelog: Histórico de Versões e Alterações

## O que você vai aprender

- Entender as principais alterações de cada versão
- Acompanhar novos recursos e correções
- Decidir se precisa atualizar

## Histórico de Versões

### 2026-01-24 - Correções de Segurança e Documentação

**Correções**:
- 🔒 **Correção de segurança**: Prevenção de vulnerabilidade de injeção de comandos em `commandExists()`
  - Substituição de `execSync` por `spawnSync`
  - Validação de entrada permitindo apenas caracteres alfanuméricos, hífens, underscores e pontos
- 📝 **Correção de documentação**: Adição de aviso de segurança na documentação de `runCommand()`
- 🐛 **Correção de falso positivo do scanner XSS**: Substituição de `<script>` e `<binary>` por `[script-name]` e `[binary-name]`
- 📚 **Correção de documentação**: Correção de `npx ts-morph` para o comando correto `npx tsx scripts/codemaps/generate.ts` em `doc-updater.md`

**Impacto**: #42, #43, #51

---

### 2026-01-22 - Suporte Multiplataforma e Plugins

**Novos recursos**:
- 🌐 **Suporte multiplataforma**: Todos os hooks e scripts reescritos em Node.js, com suporte para Windows, macOS e Linux
- 📦 **Empacotamento como plugin**: Distribuição como plugin do Claude Code, com suporte à instalação via marketplace
- 🎯 **Detecção automática do gerenciador de pacotes**: Suporte a 6 níveis de prioridade de detecção
  - Variável de ambiente `CLAUDE_PACKAGE_MANAGER`
  - Configuração do projeto `.claude/package-manager.json`
  - Campo `packageManager` no `package.json`
  - Detecção de arquivos lock (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
  - Configuração global `~/.claude/package-manager.json`
  - Fallback para o primeiro gerenciador de pacotes disponível

**Correções**:
- 🔄 **Carregamento de hooks**: Carregamento automático por convenção, removendo declarações de hooks no `plugin.json`
- 📌 **Caminhos de hooks**: Uso de `${CLAUDE_PLUGIN_ROOT}` e caminhos relativos
- 🎨 **Melhorias de UI**: Adição de gráfico de histórico de stars e barra de badges
- 📖 **Organização de hooks**: Migração dos hooks session-end de Stop para SessionEnd

---

### 2026-01-20 - Melhorias de Funcionalidades

**Novos recursos**:
- 💾 **Memory Persistence Hooks**: Salvamento e carregamento automático de contexto entre sessões
- 🧠 **Strategic Compact Hook**: Sugestões inteligentes de compactação de contexto
- 📚 **Continuous Learning Skill**: Extração automática de padrões reutilizáveis das sessões
- 🎯 **Strategic Compact Skill**: Estratégias de otimização de tokens

---

### 2026-01-17 - Lançamento Inicial

**Funcionalidades iniciais**:
- ✨ Coleção completa de configurações do Claude Code
- 🤖 9 agents especializados
- ⚡ 14 comandos slash
- 📋 8 conjuntos de regras
- 🔄 Hooks automatizados
- 🎨 11 bibliotecas de skills
- 🌐 Mais de 15 servidores MCP pré-configurados
- 📖 Documentação README completa

---

## Convenção de Nomenclatura de Versões

Este projeto não utiliza versionamento semântico tradicional, mas sim o formato de **versão por data** (`YYYY-MM-DD`).

### Tipos de Versão

| Tipo | Descrição | Exemplo |
| --- | --- | --- |
| **Novo recurso** | Adição de nova funcionalidade ou melhoria significativa | `feat: add new agent` |
| **Correção** | Correção de bug ou problema | `fix: resolve hook loading issue` |
| **Documentação** | Atualização de documentação | `docs: update README` |
| **Estilo** | Formatação ou estilo de código | `style: fix indentation` |
| **Refatoração** | Refatoração de código | `refactor: simplify hook logic` |
| **Performance** | Otimização de performance | `perf: improve context loading` |
| **Teste** | Relacionado a testes | `test: add unit tests` |
| **Build** | Sistema de build ou dependências | `build: update package.json` |
| **Reversão** | Reversão de commit anterior | `revert: remove version field` |

---

## Como Obter Atualizações

### Atualização via Marketplace de Plugins

Se você instalou o Everything Claude Code através do marketplace de plugins:

1. Abra o Claude Code
2. Execute `/plugin update everything-claude-code`
3. Aguarde a conclusão da atualização

### Atualização Manual

Se você clonou o repositório manualmente:

```bash
cd ~/.claude/plugins/everything-claude-code
git pull origin main
```

### Instalação via Marketplace

Primeira instalação:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

---

## Análise de Impacto das Alterações

### Correções de Segurança (Atualização Obrigatória)

- **2026-01-24**: Correção de vulnerabilidade de injeção de comandos, atualização fortemente recomendada

### Melhorias de Funcionalidades (Atualização Opcional)

- **2026-01-22**: Suporte multiplataforma, atualização obrigatória para usuários Windows
- **2026-01-20**: Melhorias de funcionalidades, atualize conforme necessário

### Atualizações de Documentação (Sem Necessidade de Atualização)

- Atualizações de documentação não afetam funcionalidades, você pode consultar o README manualmente

---

## Problemas Conhecidos

### Versão Atual (2026-01-24)

- Nenhum problema crítico conhecido

### Versões Anteriores

- Antes de 2026-01-22: Carregamento de hooks exigia configuração manual (corrigido em 2026-01-22)
- Antes de 2026-01-20: Sem suporte para Windows (corrigido em 2026-01-22)

---

## Contribuição e Feedback

### Reportar Problemas

Se você encontrou um bug ou tem sugestões de funcionalidades:

1. Pesquise no [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues) se já existe um problema similar
2. Se não existir, crie uma nova Issue fornecendo:
   - Informações da versão
   - Sistema operacional
   - Passos para reproduzir
   - Comportamento esperado vs comportamento real

### Enviar PR

Contribuições são bem-vindas! Consulte [CONTRIBUTING.md](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) para mais detalhes.

---

## Resumo da Lição

- Everything Claude Code usa versionamento por data (`YYYY-MM-DD`)
- Correções de segurança (como 2026-01-24) exigem atualização obrigatória
- Melhorias de funcionalidades podem ser atualizadas conforme necessário
- Usuários do marketplace de plugins usam `/plugin update` para atualizar
- Usuários com instalação manual usam `git pull` para atualizar
- Para reportar problemas e enviar PRs, siga as diretrizes do projeto

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Referência de Arquivos de Configuração](../../appendix/config-reference/)**.
>
> Você vai aprender:
> - Descrição completa dos campos do `settings.json`
> - Opções avançadas de configuração de hooks
> - Detalhes da configuração de servidores MCP
> - Melhores práticas para configurações personalizadas
