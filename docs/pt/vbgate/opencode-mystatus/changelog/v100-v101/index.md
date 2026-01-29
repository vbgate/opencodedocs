---
title: "v1.0.0-v1.0.1: Versão Inicial | opencode-mystatus"
sidebarTitle: "v1.0.0 - v1.0.1"
description: "Aprenda sobre o opencode-mystatus v1.0.0: verificação de cota multi-plataforma, barras de progresso e suporte multi-idioma. A v1.0.1 corrige comandos de barra."
subtitle: "v1.0.0 - v1.0.1: Lançamento da Versão Inicial e Correção de Comandos de Barra"
tags:
  - "Versão"
  - "Log de Atualização"
  - "v1.0.0"
  - "v1.0.1"
order: 2
---

# v1.0.0 - v1.0.1: Lançamento da Versão Inicial e Correção de Comandos de Barra

## Visão Geral da Versão

**v1.0.0** (2026-01-11) é a versão inicial do opencode-mystatus, trazendo as principais funcionalidades de verificação de cota de múltiplas plataformas.

**v1.0.1** (2026-01-11) seguiu imediatamente, corrigindo problemas críticos de suporte a comandos de barra.

---

## v1.0.1 - Correção de Comando de Barra

### Problemas Corrigidos

**Inclusão do diretório `command/` no pacote npm**

- **Descrição do problema**: Após o lançamento da v1.0.0, descobriu-se que o comando de barra `/mystatus` não funcionava corretamente
- **Análise da causa**: O empacotamento npm omitiu o diretório `command/`, impedindo que o OpenCode reconhecesse o comando de barra
- **Solução**: Atualizar o campo `files` no `package.json`, garantindo que o diretório `command/` seja incluído no pacote de lançamento
- **Escopo de impacto**: Apenas afeta usuários que instalaram via npm, instalação manual não é afetada

### Recomendação de Atualização

Se você já instalou a v1.0.0, recomenda-se atualizar imediatamente para a v1.0.1 para obter suporte completo a comandos de barra:

```bash
## Atualizar para a versão mais recente
npm update @vbgate/opencode-mystatus
```

---

## v1.0.0 - Lançamento da Versão Inicial

### Novas Funcionalidades

**1. Verificação de Cota de Múltiplas Plataformas**

Suporta consultar em um clique a cota de uso das seguintes plataformas:

| Plataforma | Tipos de Assinatura Suportados | Tipo de Cota |
|--- | --- | ---|
| OpenAI | Plus/Team/Pro | Cota de 3 horas, cota de 24 horas |
| Zhipu AI | Coding Plan | Cota de 5 horas Token, cota mensal MCP |
| Google Cloud | Antigravity | G3 Pro, G3 Image, G3 Flash, Claude |

**2. Barras de Progresso Visualizadas**

Exibe de forma intuitiva o uso da cota:

```
OpenAI (user@example.com)
━━━━━━━━━━━━━━━━━━━ 75%
Usado 750 / 1000 requisições
```

**3. Suporte Multi-idioma**

- Chinês (Simplificado)
- Inglês

Detecção automática de idioma, sem necessidade de troca manual.

**4. Mascaramento Seguro de API Key**

Todas as informações sensíveis (API Key, OAuth Token) são exibidas de forma mascarada:

```
Zhipu AI (zhipuai-coding-plan)
API Key: sk-a1b2****xyz
```

---

## Métodos de Uso

### Comando de Barra (Recomendado)

No OpenCode, digite:

```
/mystatus
```

### Linguagem Natural

Você também pode perguntar em linguagem natural:

```
Ver minha cota de todas as plataformas de IA
```

---

## Guia de Atualização

### Atualizar da v1.0.0 para v1.0.1

```bash
npm update @vbgate/opencode-mystatus
```

Após a atualização, reinicie o OpenCode para usar o comando de barra `/mystatus`.

### Primeira Instalação

```bash
npm install -g @vbgate/opencode-mystatus
```

Após a instalação, no OpenCode digite `/mystatus` para consultar a cota de todas as plataformas.

---

## Limitações Conhecidas

- v1.0.0 não suporta GitHub Copilot (adicionado na v1.2.0)
- v1.0.0 não suporta Z.ai (adicionado na v1.1.0)

Se precisar usar essas funcionalidades, por favor atualize para a versão mais recente.

---

## Próximo Passo

Veja o [Log de Atualização v1.2.0 - v1.2.4](../v120-v124/) para saber sobre novas funcionalidades como suporte ao GitHub Copilot.
