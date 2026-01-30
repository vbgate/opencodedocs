---
title: "Changelog do opencode-notify: Histórico de Versões e Registro de Alterações"
sidebarTitle: "Novidades"
subtitle: "Changelog"
description: "Consulte o histórico de versões e registro de alterações importantes do plugin opencode-notify. Saiba mais sobre atualizações de recursos, correções de problemas e melhorias de configuração em cada versão."
tags:
  - "Changelog"
  - "Histórico de Versões"
order: 150
---

# Changelog

## Notas da Versão

Este plugin é publicado via OCX e não possui números de versão tradicionais. As alterações importantes são registradas abaixo em ordem cronológica inversa.

---

## 2026-01-23

**Tipo de Alteração**: Sincronização

- Manutenção da sincronização com o repositório principal kdcokenny/ocx

---

## 2026-01-22

**Tipo de Alteração**: Sincronização

- Manutenção da sincronização com o repositório principal kdcokenny/ocx

---

## 2026-01-13

**Tipo de Alteração**: Sincronização

- Manutenção da sincronização com o repositório principal kdcokenny/ocx

---

## 2026-01-12

**Tipo de Alteração**: Sincronização

- Manutenção da sincronização com o repositório principal kdcokenny/ocx

---

## 2026-01-08

**Tipo de Alteração**: Sincronização

- Manutenção da sincronização com o repositório principal kdcokenny/ocx

---

## 2026-01-07

**Tipo de Alteração**: Sincronização

- Atualização a partir de ocx@30a9af5
- Ignorar build do CI

---

## 2026-01-01

### Correção: Sintaxe de Namespace no Estilo Cargo

**Conteúdo da Alteração**:
- Atualização da sintaxe de namespace: `ocx add kdco-notify` → `ocx add kdco/notify`
- Atualização da sintaxe de namespace: `ocx add kdco-workspace` → `ocx add kdco/workspace`
- Renomeação de arquivo fonte: `kdco-notify.ts` → `notify.ts`

**Impacto**:
- O comando de instalação mudou de `ocx add kdco-notify` para `ocx add kdco/notify`
- A estrutura de arquivos fonte está mais clara, seguindo o estilo de nomenclatura Cargo

---

### Otimização: Documentação README

**Conteúdo da Alteração**:
- Otimização da documentação README, adicionando explicação da proposta de valor
- Nova seção de FAQ respondendo perguntas comuns
- Melhoria na copy relacionada a "Notificações Inteligentes"
- Simplificação das instruções de instalação

**Conteúdo Adicionado**:
- Tabela de proposta de valor (evento, notificar ou não, som, motivo)
- Perguntas frequentes: adiciona contexto, receberá notificações spam, como desativar temporariamente

---

## 2025-12-31

### Documentação: Simplificação do README

**Conteúdo da Alteração**:
- Remoção de referências inválidas a ícones e modo escuro
- Simplificação da documentação README, focando na explicação dos recursos principais

### Remoção: Suporte a Ícones

**Conteúdo da Alteração**:
- Remoção do suporte a ícones OpenCode (detecção de modo escuro multiplataforma)
- Simplificação do fluxo de notificações, removendo recurso de ícones instável
- Limpeza do diretório `src/plugin/assets/`

**Arquivos Removidos**:
- `src/plugin/assets/opencode-icon-dark.png`
- `src/plugin/assets/opencode-icon-light.png`

**Impacto**:
- As notificações não exibem mais ícones personalizados
- O fluxo de notificações está mais estável, reduzindo problemas de compatibilidade entre plataformas

### Adicionado: Ícone OpenCode (Removido)

**Conteúdo da Alteração**:
- Adicionado suporte a ícone OpenCode
- Implementação de detecção de modo escuro multiplataforma

::: info
Este recurso foi removido em versões subsequentes, consulte "Remoção: Suporte a Ícones" em 2025-12-31.
:::

### Adicionado: Detecção de Terminal e Consciência de Foco

**Conteúdo da Alteração**:
- Nova função de detecção automática de terminal (suporta 37+ terminais)
- Nova função de detecção de foco (apenas macOS)
- Nova função de foco ao clicar (apenas macOS)

**Recursos Adicionados**:
- Identificação automática de emuladores de terminal
- Supressão de notificações quando o terminal está em foco
- Foco na janela do terminal ao clicar na notificação (macOS)

**Detalhes Técnicos**:
- Uso da biblioteca `detect-terminal` para detectar tipo de terminal
- Obtenção do aplicativo em primeiro plano via macOS osascript
- Uso da opção activate do node-notifier para implementar foco ao clicar

### Adicionado: Versão Inicial

**Conteúdo da Alteração**:
- Commit inicial: plugin kdco-notify
- Função básica de notificações nativas
- Sistema básico de configuração

**Recursos Principais**:
- Notificação de evento session.idle (tarefa concluída)
- Notificação de evento session.error (erro)
- Notificação de evento permission.updated (solicitação de permissão)
- Integração com node-notifier (notificações nativas multiplataforma)

**Arquivos Iniciais**:
- `LICENSE` - Licença MIT
- `README.md` - Documentação do projeto
- `registry.json` - Configuração de registro OCX
- `src/plugin/kdco-notify.ts` - Código principal do plugin

---

## Recursos Relacionados

- **Repositório GitHub**: https://github.com/kdcokenny/ocx/tree/main/registry/src/kdco/notify
- **Histórico de Commits**: https://github.com/kdcokenny/ocx/commits/main/registry/src/kdco/notify
- **Documentação OCX**: https://github.com/kdcokenny/ocx

---

## Política de Versões

Este plugin, como parte do ecossistema OCX, adota a seguinte política de versões:

- **Sem Números de Versão**: Alterações são rastreadas via histórico de commits Git
- **Entrega Contínua**: Atualizações sincronizadas com o repositório principal OCX
- **Compatibilidade Retroativa**: Manutenção da compatibilidade retroativa de formato de configuração e API

Alterações incompatíveis serão claramente marcadas no changelog.

---

**Última Atualização**: 2026-01-27
