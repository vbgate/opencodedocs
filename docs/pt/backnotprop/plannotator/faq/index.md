---
title: "FAQ: Resolvendo Problemas de Uso | opencode-plannotator"
sidebarTitle: "O Que Fazer Quando Encontrar Problemas"
subtitle: "FAQ: Resolvendo Problemas de Uso"
description: "Aprenda a resolver problemas comuns do Plannotator. Domine técnicas de diagnóstico rápido para portas ocupadas, navegador não abrindo, falhas de integração e mais."
order: 4
---

# Perguntas Frequentes

Esta seção ajuda você a resolver vários problemas encontrados ao usar o Plannotator. Seja porta ocupada, navegador não abrindo, ou falha de integração, você encontrará soluções e técnicas de depuração correspondentes aqui.

## Conteúdo Desta Seção

<div class="grid-cards">

<a href="./common-problems/" class="card">
  <h3>🔧 Problemas Comuns</h3>
  <p>Resolva problemas comuns encontrados durante o uso, incluindo portas ocupadas, navegador não abrindo, planos não exibidos, erros do Git, falha no upload de imagens, problemas de integração com Obsidian/Bear, etc.</p>
</a>

<a href="./troubleshooting/" class="card">
  <h3>🔍 Diagnóstico de Problemas</h3>
  <p>Domine os métodos básicos de diagnóstico de problemas, incluindo visualização de logs, tratamento de erros e técnicas de depuração. Aprenda a localizar rapidamente a fonte do problema através da saída de logs.</p>
</a>

</div>

## Caminho de Aprendizado

```
Problemas Comuns → Diagnóstico de Problemas
   ↓                    ↓
 Resolução Rápida    Depuração Aprofundada
```

**Ordem Recomendada**:

1. **Consulte Problemas Comuns Primeiro**: A maioria dos problemas pode encontrar soluções prontas aqui
2. **Depois Aprenda Diagnóstico de Problemas**: Se os problemas comuns não cobrem, aprenda como diagnosticar problemas por conta própria através de logs e técnicas de depuração

::: tip Sugestão Para Quando Encontrar Problemas
Primeiro procure palavras-chave na seção "Problemas Comuns" (como "porta", "navegador", "Obsidian") para encontrar a solução correspondente. Se o problema for complexo ou não estiver na lista, consulte "Diagnóstico de Problemas" para aprender métodos de depuração.
:::

## Pré-requisitos

Antes de estudar esta seção, recomenda-se que você já tenha completado:

- ✅ [Início Rápido](../start/getting-started/) - Entender os conceitos básicos do Plannotator
- ✅ Instalado o plugin Claude Code ou OpenCode (escolha um):
  - [Instalar Plugin Claude Code](../start/installation-claude-code/)
  - [Instalar Plugin OpenCode](../start/installation-opencode/)

## Próximos Passos

Após completar esta seção, você pode continuar aprendendo:

- [Referência da API](../appendix/api-reference/) - Conhecer todos os endpoints da API e formatos de requisição/resposta
- [Modelos de Dados](../appendix/data-models/) - Entender as estruturas de dados usadas pelo Plannotator
- [Configuração de Variáveis de Ambiente](../advanced/environment-variables/) - Aprofundar em todas as variáveis de ambiente disponíveis

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dark .grid-cards .card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
