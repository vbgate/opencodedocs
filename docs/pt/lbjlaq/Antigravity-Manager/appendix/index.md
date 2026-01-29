---
title: "Apêndice: Manual de Referência Técnica | Antigravity-Manager"
sidebarTitle: "Dicionário Técnico"
subtitle: "Apêndice: Manual de Referência Técnica"
description: "Consulte materiais de referência técnica do Antigravity Tools, incluindo tabela rápida de endpoints de API, estrutura de armazenamento de dados e limites de funcionalidade. Encontre informações chave rapidamente."
order: 500
---

# Apêndice

Este capítulo reúne materiais de referência técnica do Antigravity Tools, incluindo tabela rápida de endpoints de API, estrutura de armazenamento de dados e explicação de limites de funcionalidades experimentais. Quando você precisar consultar rapidamente algum detalhe técnico, aqui está seu "dicionário".

## Conteúdo do Capítulo

| Documento | Descrição | Cenário Adequado |
|--- | --- | ---|
| **[Tabela Rápida de Endpoints](./endpoints/)** | Visão geral de rotas HTTP externas: endpoints OpenAI/Anthropic/Gemini/MCP, modo de autenticação e uso de Header API Key | Integrar novo cliente, solucionar 404/401 |
| **[Dados e Modelos](./storage-models/)** | Estrutura de arquivos de conta, estrutura de tabelas de banco de dados SQLite, campos de métrica de chave | Backup/migração, consulta direta de banco, solução de problemas |
| **[Limites de Integração z.ai](./zai-boundaries/)** | Lista de funcionalidades z.ai implementadas vs claramente não implementadas | Avaliar capacidades z.ai, evitar uso incorreto |

## Caminho de Aprendizado

```
Tabela Rápida de Endpoints → Dados e Modelos → Limites de Integração z.ai
         ↓                    ↓                       ↓
  Saber qual rota chamar   Saber onde dados estão  Saber limites existem
```

1. **Primeiro veja Tabela Rápida de Endpoints**: entenda quais APIs podem ser chamadas, e como autenticação é configurada
2. **Depois veja Dados e Modelos**: entenda estrutura de armazenamento de dados, conveniente para backup, migração e consulta direta de banco
3. **Por último veja Limites de Integração z.ai**: se você usar z.ai, este artigo evita tratar "não implementado" como "pode usar"

::: tip Estes documentos não são "leitura obrigatória"
Apêndice são materiais de referência, não tutoriais. Você não precisa ler do começo ao fim, quando encontrar problema específico, consulte aqui.
:::

## Pré-requisitos

::: warning Recomendado completar primeiro
- [O que é o Antigravity Tools](../start/getting-started/): estabelecer modelo mental básico
- [Iniciar Proxy Reverso Local e Conectar Primeiro Cliente](../start/proxy-and-first-client/): passar fluxo básico
:::

Se você ainda não passou fluxo básico, recomenda completar primeiro [Início](../start/) tutorials.

## Próximos Passos

Após completar leitura do apêndice, você pode:

- **[Evolução de Versão](../changelog/release-notes/)**: entender mudanças recentes, fazer verificação antes de atualizar
- **[Perguntas Frequentes](../faq/invalid-grant/)**: encontrar respostas ao encontrar erros específicos
- **[Configuração Avançada](../advanced/config/)**: entender atualização a quente de configurações, estratégias de agendamento, etc.
