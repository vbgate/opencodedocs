---
title: "Início Rápido: Usando o Antigravity Tools do Zero | Antigravity-Manager"
sidebarTitle: "Começando do Zero"
subtitle: "Início Rápido: Usando o Antigravity Tools do Zero"
description: "Aprenda o fluxo completo de primeiros passos com o Antigravity Tools. Da instalação e configuração até a primeira chamada de API, domine rapidamente os principais métodos de uso do gateway local."
order: 1
---

# Início Rápido

Este capítulo guia você através do uso do Antigravity Tools do zero, completando o fluxo completo da instalação até a primeira chamada de API bem-sucedida. Você aprenderá os conceitos principais, gerenciamento de contas, backup de dados e como conectar seus clientes AI ao gateway local.

## Conteúdo do Capítulo

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">O que é o Antigravity Tools</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Estabeleça o modelo mental correto: gateway local, compatibilidade de protocolo, conceitos principais de pool de contas e limites de uso.</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Instalação e Atualização</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Melhor caminho de instalação para desktop (brew / releases) e como lidar com bloqueios comuns do sistema.</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Essencial para o Primeiro Uso</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Diretório de dados, logs, bandeja e início automático. Evite exclusões acidentais e perdas irreversíveis.</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Adicionar Contas</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Canais duplos OAuth/Refresh Token e melhores práticas. Construa seu pool de contas da forma mais estável.</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Backup e Migração de Contas</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Importar/Exportar, migração a quente V1/DB. Suporta reuso multi-máquina e cenários de implantação em servidor.</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Iniciar Proxy e Conectar Cliente</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Do início do serviço à chamada bem-sucedida de clientes externos. Valide o ciclo completo em uma execução.</p>
</a>

</div>

## Caminho de Aprendizado

::: tip Ordem Recomendada
Siga esta ordem para começar a usar o Antigravity Tools o mais rápido possível:
:::

```
1. Compreensão de Conceitos  →  2. Instalar Software  →  3. Entender Diretório de Dados
      getting-started             installation              first-run-data
            ↓                        ↓                            ↓
4. Adicionar Contas       →  5. Backup de Contas  →  6. Iniciar Proxy
      add-account             backup-migrate         proxy-and-first-client
```

| Passo | Curso | Tempo Estimado | Você Aprenderá |
|--- | --- | --- | ---|
| 1 | [Compreensão de Conceitos](./getting-started/) | 5 minutos | O que é um gateway local, por que precisa de um pool de contas |
| 2 | [Instalar Software](./installation/) | 3 minutos | Instalação via brew ou download manual, lidar com bloqueios do sistema |
| 3 | [Entender Diretório de Dados](./first-run-data/) | 5 minutos | Onde os dados ficam, como ver logs, operações da bandeja |
| 4 | [Adicionar Contas](./add-account/) | 10 minutos | Autorização OAuth ou preenchimento manual de Refresh Token |
| 5 | [Backup de Contas](./backup-migrate/) | 5 minutos | Exportar contas, migração entre dispositivos |
| 6 | [Iniciar Proxy](./proxy-and-first-client/) | 10 minutos | Iniciar serviço, configurar cliente, validar chamadas |

**Caminho Mínimo Válido**: Se estiver com pressa, você pode completar apenas 1 → 2 → 4 → 6, cerca de 25 minutos para começar a usar.

## Próximos Passos

Após completar este capítulo, você já pode usar o Antigravity Tools normalmente. Em seguida, você pode estudar mais a fundo conforme necessário:

- **[Plataformas e Integrações](../platforms/)**: Entenda os detalhes de integração de diferentes protocolos como OpenAI, Anthropic, Gemini, etc.
- **[Configurações Avançadas](../advanced/)**: Funcionalidades avançadas como roteamento de modelos, proteção de cota, agendamento de alta disponibilidade
- **[Perguntas Frequentes](../faq/)**: Guia de solução de problemas ao encontrar erros 401, 429, 404, etc.
