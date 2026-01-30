---
title: "Histórico de Versões: Changelog do Antigravity Auth | opencode-antigravity-auth"
sidebarTitle: "Novidades"
subtitle: "Histórico de Versões: Changelog do Antigravity Auth"
description: "Conheça o histórico de versões e as principais alterações do plugin Antigravity Auth. Veja os novos recursos, correções de bugs e melhorias de desempenho de cada versão, além de guias de atualização e informações de compatibilidade."
tags:
  - "Histórico de Versões"
  - "Changelog"
  - "Registro de Alterações"
order: 1
---

# Histórico de Versões

Este documento registra o histórico de versões e as principais alterações do plugin Antigravity Auth.

::: tip Versão Mais Recente
Versão estável atual: **v1.3.0** (17/01/2026)
:::

## Descrição das Versões

### Versão Estável (Stable)
- Totalmente testada, recomendada para ambientes de produção
- Formato do número de versão: `vX.Y.Z` (ex.: v1.3.0)

### Versão Beta (Beta)
- Contém os recursos mais recentes, pode apresentar instabilidades
- Formato do número de versão: `vX.Y.Z-beta.N` (ex.: v1.3.1-beta.3)
- Ideal para testes antecipados e feedback

---

## Série v1.3.x

### v1.3.1-beta.3
**Data de Lançamento**: 22/01/2026

**Alterações**:
- Otimização do algoritmo de backoff para o erro `MODEL_CAPACITY_EXHAUSTED`, aumentando o intervalo de jitter aleatório

### v1.3.1-beta.2
**Data de Lançamento**: 22/01/2026

**Alterações**:
- Remoção da opção de configuração `googleSearch` não utilizada
- Adição de aviso sobre ToS (Termos de Serviço) e recomendações de uso no README

### v1.3.1-beta.1
**Data de Lançamento**: 22/01/2026

**Alterações**:
- Melhoria na lógica de debounce para notificações de troca de conta, reduzindo avisos duplicados

### v1.3.1-beta.0
**Data de Lançamento**: 20/01/2026

**Alterações**:
- Remoção do rastreamento de sub-repositório, restauração do tsconfig.json

### v1.3.0
**Data de Lançamento**: 17/01/2026

**Alterações Importantes**:

**Novos Recursos**:
- Uso do método nativo `toJSONSchema` do Zod v4 para geração de schema

**Correções**:
- Correção do teste de consumo de tokens, usando `toBeCloseTo` para lidar com precisão de ponto flutuante
- Melhoria no cálculo de cobertura de testes

**Melhorias na Documentação**:
- Aprimoramento da documentação relacionada ao balanceamento de carga
- Adição de melhorias de formatação

---

## Série v1.2.x

### v1.2.9-beta.10
**Data de Lançamento**: 17/01/2026

**Alterações**:
- Correção da asserção de saldo de tokens, usando correspondência de precisão de ponto flutuante

### v1.2.9-beta.9
**Data de Lançamento**: 16/01/2026

**Alterações**:
- Atualização do teste de consumo de tokens, usando `toBeCloseTo` para lidar com precisão de ponto flutuante
- Aprimoramento do wrapper de ferramentas Gemini, adicionando estatísticas de contagem de funções encapsuladas

### v1.2.9-beta.8
**Data de Lançamento**: 16/01/2026

**Alterações**:
- Adição de novos templates de issue (relatório de bug e solicitação de recurso)
- Melhoria na lógica de onboarding do projeto

### v1.2.9-beta.7
**Data de Lançamento**: 16/01/2026

**Alterações**:
- Atualização dos templates de issue, exigindo títulos descritivos

### v1.2.9-beta.6
**Data de Lançamento**: 16/01/2026

**Alterações**:
- Adição de atraso de retry configurável para limite de taxa
- Melhoria na detecção de hostname, suportando ambiente Docker OrbStack
- Vinculação inteligente de endereço do servidor de callback OAuth
- Esclarecimento da prioridade entre `thinkingLevel` e `thinkingBudget`

### v1.2.9-beta.5
**Data de Lançamento**: 16/01/2026

**Alterações**:
- Melhoria no wrapper de ferramentas Gemini, suportando formato `functionDeclarations`
- Garantia de criação correta de wrappers de funções personalizadas em `normalizeGeminiTools`

### v1.2.9-beta.4
**Data de Lançamento**: 16/01/2026

**Alterações**:
- Encapsulamento de ferramentas Gemini no formato `functionDeclarations`
- Aplicação de `toGeminiSchema` em `wrapToolsAsFunctionDeclarations`

### v1.2.9-beta.3
**Data de Lançamento**: 14/01/2026

**Alterações**:
- Atualização da documentação e comentários de código, explicando a implementação da estratégia híbrida
- Simplificação das instruções do sistema antigravity para testes

### v1.2.9-beta.2
**Data de Lançamento**: 12/01/2026

**Alterações**:
- Correção da lógica de parsing do modelo Gemini 3, deduplicação do processamento de blocos de pensamento
- Adição de verificação do modelo Gemini 3 para hashes de pensamento exibidos

### v1.2.9-beta.1
**Data de Lançamento**: 08/01/2026

**Alterações**:
- Atualização da versão beta nas instruções de instalação do plugin
- Melhoria no gerenciamento de contas, garantindo que a autenticação atual seja adicionada às contas armazenadas

### v1.2.9-beta.0
**Data de Lançamento**: 08/01/2026

**Alterações**:
- Atualização do README, correção da URL do plugin Antigravity
- Atualização da URL do schema para o repositório NoeFabris

### v1.2.8
**Data de Lançamento**: 08/01/2026

**Alterações Importantes**:

**Novos Recursos**:
- Suporte ao modelo Gemini 3
- Processamento de deduplicação de blocos de pensamento

**Correções**:
- Correção da lógica de parsing do modelo Gemini 3
- Tratamento de hash de pensamento exibido na conversão de resposta

**Melhorias na Documentação**:
- Atualização do redirecionamento de saída do script de teste
- Atualização das opções de teste de modelo

### v1.2.7
**Data de Lançamento**: 01/01/2026

**Alterações Importantes**:

**Novos Recursos**:
- Melhoria no gerenciamento de contas, garantindo que a autenticação atual seja armazenada corretamente
- Publicação automática de versões npm via GitHub Actions

**Correções**:
- Correção do redirecionamento de saída no script de teste E2E

**Melhorias na Documentação**:
- Atualização da URL do repositório para NoeFabris

---

## Série v1.2.6 - v1.2.0

### v1.2.6
**Data de Lançamento**: 26/12/2025

**Alterações**:
- Adição de workflow para republicação automática de versões npm

### v1.2.5
**Data de Lançamento**: 26/12/2025

**Alterações**:
- Atualização da documentação, correção do número de versão para 1.2.6

### v1.2.4 - v1.2.0
**Data de Lançamento**: Dezembro de 2025

**Alterações**:
- Funcionalidade de balanceamento de carga multi-conta
- Sistema de cota dupla (Antigravity + Gemini CLI)
- Mecanismo de recuperação de sessão
- Autenticação OAuth 2.0 PKCE
- Suporte a modelos Thinking (Claude e Gemini 3)
- Google Search grounding

---

## Série v1.1.x

### v1.1.0 e versões posteriores
**Data de Lançamento**: Novembro de 2025

**Alterações**:
- Otimização do fluxo de autenticação
- Melhoria no tratamento de erros
- Adição de mais opções de configuração

---

## Série v1.0.x (Versões Iniciais)

### v1.0.4 - v1.0.0
**Data de Lançamento**: Outubro de 2025 e anteriores

**Recursos Iniciais**:
- Autenticação básica Google OAuth
- Acesso à API Antigravity
- Suporte básico a modelos

---

## Guia de Atualização de Versão

### Atualizando de v1.2.x para v1.3.x

**Compatibilidade**: Totalmente compatível, sem necessidade de modificar configurações

**Ações Recomendadas**:
```bash
# Atualizar o plugin
opencode plugin update opencode-antigravity-auth

# Verificar a instalação
opencode auth status
```

### Atualizando de v1.1.x para v1.2.x

**Compatibilidade**: Requer atualização do formato de armazenamento de contas

**Ações Recomendadas**:
```bash
# Fazer backup das contas existentes
cp ~/.config/opencode/antigravity-accounts.json ~/.config/opencode/antigravity-accounts.json.bak

# Atualizar o plugin
opencode plugin update opencode-antigravity-auth@latest

# Fazer login novamente (se houver problemas)
opencode auth login
```

### Atualizando de v1.0.x para v1.2.x

**Compatibilidade**: Formato de armazenamento de contas incompatível, requer nova autenticação

**Ações Recomendadas**:
```bash
# Atualizar o plugin
opencode plugin update opencode-antigravity-auth@latest

# Fazer login novamente
opencode auth login

# Adicionar configuração de modelo conforme requisitos da nova versão
```

---

## Notas sobre Versões Beta

**Recomendações de uso para versões Beta**:

| Cenário de Uso | Versão Recomendada | Descrição |
| --- | --- | --- |
| Ambiente de produção | Versão estável (vX.Y.Z) | Totalmente testada, alta estabilidade |
| Desenvolvimento diário | Última versão estável | Recursos completos, menos bugs |
| Testes antecipados | Última Beta | Experimente os recursos mais recentes, mas pode ser instável |

**Instalando versão Beta**:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Atualizando para versão estável**:

```bash
opencode plugin update opencode-antigravity-auth@latest
```

---

## Explicação do Número de Versão

O número de versão segue a especificação [Versionamento Semântico 2.0.0](https://semver.org/lang/pt-BR/):

- **Versão Principal (X)**: Modificações de API incompatíveis
- **Versão Secundária (Y)**: Adição de funcionalidades compatíveis com versões anteriores
- **Versão de Correção (Z)**: Correções de problemas compatíveis com versões anteriores

**Exemplos**:
- `1.3.0` → Versão principal 1, versão secundária 3, correção 0
- `1.3.1-beta.3` → 3ª versão Beta do 1.3.1

---

## Recebendo Notificações de Atualização

**Atualização automática** (habilitada por padrão):

```json
{
  "auto_update": true
}
```

**Verificar atualizações manualmente**:

```bash
# Ver versão atual
opencode plugin list

# Atualizar o plugin
opencode plugin update opencode-antigravity-auth
```

---

## Links para Download

- **NPM Versão Estável**: https://www.npmjs.com/package/opencode-antigravity-auth
- **GitHub Releases**: https://github.com/NoeFabris/opencode-antigravity-auth/releases

---

## Contribuições e Feedback

Se encontrar problemas ou tiver sugestões de recursos:

1. Consulte o [Guia de Solução de Problemas](/pt/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/)
2. Abra uma issue no [GitHub Issues](https://github.com/NoeFabris/opencode-antigravity-auth/issues)
3. Use o template de issue correto (Bug Report / Feature Request)
