---
title: "Configuração Avançada: Explicação Detalhada de Funcionalidades Avançadas | Antigravity-Manager"
order: 300
sidebarTitle: "Elevar Sistema para Nível de Produção"
subtitle: "Configuração Avançada: Explicação Detalhada de Funcionalidades Avançadas"
description: "Aprenda métodos de configuração avançada do Antigravity-Manager. Domine agendamento de conta, roteamento de modelo, governança de cota e monitoramento estatístico, entre outras funcionalidades avançadas."
---

# Configuração Avançada

Este capítulo aprofunda funcionalidades avançadas do Antigravity Tools: gerenciamento de configuração, estratégia de segurança, agendamento de conta, roteamento de modelo, governança de cota, monitoramento e estatísticas, e planos de implantação de servidor. Após dominar estes conteúdos, você pode elevar Antigravity Tools de "pode usar" para "bom uso, estável, operável".

## Conteúdo do Capítulo

| Tutorial | Descrição |
|-----|------|
| [Configuração Completa](./config/) | Campos completos de AppConfig/ProxyConfig, localização de persistência e semântica de atualização a quente |
| [Segurança e Privacidade](./security/) | `auth_mode`, `allow_lan_access` e design de linha de base de segurança |
| [Agendamento de Alta Disponibilidade](./scheduling/) | Rotação, conta fixa, sessão aderente e mecanismo de retry em caso de falha |
| [Roteamento de Modelo](./model-router/) | Mapeamento personalizado, prioridade de curinga e estratégias predefinidas |
| [Governança de Cota](./quota/) | Combinação de Quota Protection + Smart Warmup |
| [Proxy Monitor](./monitoring/) | Logs de solicitação, filtragem, restauração de detalhes e exportação |
| [Token Stats](./token-stats/) | Métrica de perspectiva de custo e interpretação de gráficos |
| [Estabilidade de Sessão Longa](./context-compression/) | Compressão de contexto, cache de assinatura e compressão de resultados de ferramentas |
| [Capacidade do Sistema](./system/) | Multilínguagem/tema/atualização/início automático/HTTP API Server |
| [Implantação de Servidor](./deployment/) | Docker noVNC vs Headless Xvfb seleção de tipo e operações |

## Sugestão de Caminho de Aprendizado

::: tip Ordem recomendada
Este capítulo tem muito conteúdo, recomenda aprender em módulos em lote:
:::

**Fase 1: Configuração e Segurança (aprender primeiro)**

```
Configuração Completa → Segurança e Privacidade
config             security
```

Primeiro entenda sistema de configuração (quais precisam de reinício, quais atualização a quente), depois aprenda configurações de segurança (especialmente ao expor para LAN/rede pública).

**Fase 2: Agendamento e Roteamento (recomendado)**

```
Agendamento de Alta Disponibilidade → Roteamento de Modelo
scheduling              model-router
```

Use número mínimo de contas para obter máxima estabilidade, depois use roteamento de modelo para blindar mudanças upstream.

**Fase 3: Cota e Monitoramento (conforme necessário)**

```
Governança de Cota → Proxy Monitor → Token Stats
quota                 monitoring      token-stats
```

Evite cota esgotar imperceptivelmente, transformar chamada de caixa preta em sistema observável, quantificar custo otimizar.

**Fase 4: Estabilidade e Implantação (avançado)**

```
Estabilidade de Sessão Longa → Capacidade do Sistema → Implantação de Servidor
context-compression          system            deployment
```

Resolva problemas ocultos de sessão longa, deixar cliente mais parecido com produto, finalmente aprenda implantação de servidor.

**Seleção Rápida**:

| Seu cenário | Recomendado ver primeiro |
|---------|---------------------------|
| Rotação de múltiplas contas instável | [Agendamento de Alta Disponibilidade](./scheduling/) |
| Quer fixar certo nome de modelo | [Roteamento de Modelo](./model-router/) |
| Cota sempre esgota | [Governança de Cota](./quota/) |
| Quer ver logs de solicitação | [Proxy Monitor](./monitoring/) |
| Quer estatísticas de consumo de token | [Token Stats](./token-stats/) |
| Diálogos longos frequentemente erram | [Estabilidade de Sessão Longa](./context-compression/) |
| Quer expor para LAN | [Segurança e Privacidade](./security/) |
| Quer implantar em servidor | [Implantação de Servidor](./deployment/) |

## Pré-requisitos

::: warning Confirme antes de começar
- Completou [Início Rápido](../start/) capítulos (pelo menos completou instalação, adicionar conta, iniciar proxy reverso)
- Completou pelo menos um protocolo de integração em [Plataformas e Integrações](../platforms/) (como OpenAI ou Anthropic)
- Proxy reverso local consegue responder solicitações normalmente
:::

## Próximos Passos

Após completar este capítulo, você pode continuar aprendendo:

- [Perguntas Frequentes](../faq/): guia de solução de problemas ao encontrar erros 401/404/429/interrupção de fluxo
- [Apêndice](../appendix/): tabela rápida de endpoints, modelo de dados, fronteiras de capacidades z.ai, etc. referências
