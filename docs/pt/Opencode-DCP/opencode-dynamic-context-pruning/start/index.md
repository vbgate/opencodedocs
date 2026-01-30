---
title: "Início Rápido: Instalação e Configuração | opencode-dynamic-context-pruning"
sidebarTitle: "5 Minutos para Começar"
subtitle: "Início Rápido: Instalação e Configuração"
description: "Aprenda os métodos de instalação e configuração do plugin OpenCode DCP. Instale o plugin em 5 minutos, experimente o efeito de economia de Tokens e domine o sistema de configuração de três níveis."
order: 1
---

# Início Rápido

Este capítulo ajuda você a começar a usar o plugin DCP do zero. Você aprenderá a instalar o plugin, verificar os resultados e personalizar a configuração de acordo com suas necessidades.

## Conteúdo do Capítulo

<div class="vp-card-container">

<a href="./getting-started/" class="vp-card">
  <h3>Instalação e Início Rápido</h3>
  <p>Instale o plugin DCP em 5 minutos e veja imediatamente o efeito de economia de Tokens. Aprenda a usar o comando /dcp para monitorar as estatísticas de poda.</p>
</a>

<a href="./configuration/" class="vp-card">
  <h3>Configuração Completa</h3>
  <p>Domine o sistema de configuração de três níveis (global, variáveis de ambiente, nível de projeto), entenda a prioridade de configuração e ajuste as estratégias de poda e mecanismos de proteção conforme necessário.</p>
</a>

</div>

## Caminho de Aprendizado

```
Instalação e Início Rápido → Configuração Completa
     ↓                       ↓
   Plugin funcionando    Saber como ajustar
```

**Ordem Recomendada**:

1. **Primeiro complete [Instalação e Início Rápido](./getting-started/)**: Garanta que o plugin funcione normalmente e experimente o efeito de poda padrão
2. **Em seguida aprenda [Configuração Completa](./configuration/)**: Personalize as estratégias de poda de acordo com as necessidades do projeto

::: tip Sugestão para Iniciantes
Se você está usando o DCP pela primeira vez, recomenda-se usar a configuração padrão por um período, observar os resultados da poda antes de ajustar a configuração.
:::

## Pré-requisitos

Antes de começar este capítulo, confirme:

- [x] Já instalou o **OpenCode** (versão compatível com plugins)
- [x] Entende a sintaxe básica de **JSONC** (JSON que suporta comentários)
- [x] Sabe como editar **arquivos de configuração do OpenCode**

## Próximo Passo

Após concluir este capítulo, você pode continuar aprendendo:

- **[Explicação de Estratégias de Poda Automática](../platforms/auto-pruning/)**: Entenda em profundidade o princípio de funcionamento das três estratégias: desduplicação, sobrescrita e limpeza de erros
- **[Ferramentas de Poda Impulsionadas por LLM](../platforms/llm-tools/)**: Entenda como a IA ativamente chama as ferramentas discard e extract para otimizar o contexto
- **[Uso de Comandos Slash](../platforms/commands/)**: Domine o uso de comandos como /dcp context, /dcp stats, /dcp sweep e outros

<style>
.vp-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.vp-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.vp-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vp-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vp-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
