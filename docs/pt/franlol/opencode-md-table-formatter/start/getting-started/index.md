---
title: "Início Rápido: Instalação e Configuração | opencode-md-table-formatter"
sidebarTitle: "Alinhe tabelas em 1 minuto"
subtitle: "Comece em 1 minuto: Instalação e Configuração"
description: "Aprenda os métodos de instalação e configuração do opencode-md-table-formatter. Instale o plugin em 1 minuto e faça com que as tabelas Markdown geradas por IA sejam alinhadas automaticamente através do arquivo de configuração."
tags:
  - "instalação"
  - "configuração"
  - "opencode-plugin"
prerequisite: []
order: 10
---

# Comece em 1 minuto: Instalação e Configuração

::: info O que você será capaz de fazer após esta aula
- Instalar o plugin de formatação de tabelas no OpenCode
- Fazer com que as tabelas Markdown geradas por IA sejam alinhadas automaticamente
- Verificar se o plugin está funcionando corretamente
:::

## Seu dilema atual

As tabelas Markdown geradas por IA frequentemente ficam assim:

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| 功能A | 这是一个很长的描述文本 | 已完成 |
| B | 短 | 进行中 |
```

As larguras das colunas são irregulares, o que é desconfortável de ver. Ajustar manualmente? Demora muito tempo.

## Quando usar esta técnica

- Você frequentemente pede à IA para gerar tabelas (comparações, listas, descrições de configuração)
- Você deseja que as tabelas sejam exibidas de forma organizada no OpenCode
- Você não deseja ajustar manualmente a largura das colunas toda vez

## 🎒 Preparativos

::: warning Pré-requisitos
- OpenCode instalado (versão >= 1.0.137)
- Sabe onde está o arquivo de configuração `.opencode/opencode.jsonc`
:::

## Siga comigo

### Passo 1: Abra o arquivo de configuração

**Por quê**: O plugin é declarado através do arquivo de configuração, que é carregado automaticamente ao iniciar o OpenCode.

Encontre seu arquivo de configuração do OpenCode:

::: code-group

```bash [macOS/Linux]
# O arquivo de configuração geralmente está no diretório raiz do projeto
ls -la .opencode/opencode.jsonc

# Ou no diretório do usuário
ls -la ~/.config/opencode/opencode.jsonc
```

```powershell [Windows]
# O arquivo de configuração geralmente está no diretório raiz do projeto
Get-ChildItem .opencode\opencode.jsonc

# Ou no diretório do usuário
Get-ChildItem "$env:APPDATA\opencode\opencode.jsonc"
```

:::

Abra este arquivo com o editor de sua preferência.

### Passo 2: Adicione a configuração do plugin

**Por quê**: Informar ao OpenCode para carregar o plugin de formatação de tabelas.

Adicione o campo `plugin` no arquivo de configuração:

```jsonc
{
  // ... outras configurações ...
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

::: tip Já tem outros plugins?
Se você já tem um array `plugin`, adicione o novo plugin ao array:

```jsonc
{
  "plugin": [
    "existing-plugin",
    "@franlol/opencode-md-table-formatter@0.0.3"  // adicione aqui
  ]
}
```
:::

**Você deve ver**: O arquivo de configuração foi salvo com sucesso, sem mensagens de erro de sintaxe.

### Passo 3: Reinicie o OpenCode

**Por quê**: O plugin é carregado ao iniciar o OpenCode, então você precisa reiniciar após modificar a configuração para que as alterações entrem em vigor.

Feche a sessão atual do OpenCode e reinicie.

**Você deve ver**: O OpenCode inicia normalmente, sem erros.

### Passo 4: Verifique se o plugin está funcionando

**Por quê**: Confirmar que o plugin foi carregado corretamente e está funcionando.

Peça à IA para gerar uma tabela, por exemplo, digite:

```
Gere uma tabela comparando os recursos dos frameworks React, Vue e Angular
```

**Você deve ver**: As larguras das colunas da tabela gerada pela IA estão alinhadas, assim:

```markdown
| 框架    | 特点                     | 学习曲线 |
| ------- | ------------------------ | -------- |
| React   | 组件化、虚拟 DOM         | 中等     |
| Vue     | 渐进式、双向绑定         | 较低     |
| Angular | 全功能框架、TypeScript   | 较高     |
```

## Ponto de verificação ✅

Após concluir as etapas acima, verifique os seguintes pontos:

| Item de verificação                   | Resultado esperado                       |
| ------------------------ | ------------------------------ |
| Sintaxe do arquivo de configuração             | Sem erros                         |
| Inicialização do OpenCode            | Inicia normalmente, sem erros de carregamento de plugin       |
| Tabelas geradas pela IA              | Larguras das colunas alinhadas automaticamente, formato da linha separador unificado   |

## Avisos de armadilhas

### A tabela não foi formatada?

1. **Verifique o caminho do arquivo de configuração**: Certifique-se de que você modificou o arquivo de configuração que o OpenCode realmente lê
2. **Verifique o nome do plugin**: Deve ser `@franlol/opencode-md-table-formatter@0.0.3`, observe o símbolo `@`
3. **Reinicie o OpenCode**: Você deve reiniciar após modificar a configuração

### Vê o comentário "invalid structure"?

Isso indica que a estrutura da tabela não está em conformidade com a especificação Markdown. Causas comuns:

- Falta a linha separadora (`|---|---|`)
- O número de colunas em cada linha é inconsistente

Consulte a seção [Perguntas Frequentes](../../faq/troubleshooting/) para obter mais detalhes.

## Resumo da aula

- O plugin é configurado através do campo `plugin` em `.opencode/opencode.jsonc`
- O número da versão `@0.0.3` garante o uso de uma versão estável
- Você precisa reiniciar o OpenCode após modificar a configuração
- O plugin formata automaticamente todas as tabelas Markdown geradas pela IA

## Próxima aula

> Na próxima aula, aprenderemos **[Visão Geral de Recursos](../features/)**.
>
> Você aprenderá:
> - Os 8 recursos principais do plugin
> - O princípio de cálculo de largura no modo de ocultação
> - Quais tabelas podem ser formatadas e quais não podem

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Função           | Caminho do arquivo                                                                                     | Número da linha    |
| -------------- | -------------------------------------------------------------------------------------------- | ------- |
| Entrada do plugin       | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23    |
| Registro de hooks       | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L11-L13) | 11-13   |
| Configuração do pacote         | [`package.json`](https://github.com/franlol/opencode-md-table-formatter/blob/main/package.json#L1-L41) | 1-41    |

**Constantes principais**:
- `@franlol/opencode-md-table-formatter@0.0.3`: nome do pacote npm e versão
- `experimental.text.complete`: nome do hook que o plugin monitora

**Requisitos de dependência**:
- OpenCode >= 1.0.137
- `@opencode-ai/plugin` >= 0.13.7

</details>
