---
title: "Impacto no Cache: Equilibrando Taxa de Acerto e Economia | opencode-dcp"
subtitle: "Prompt Caching: Como o DCP Equilibra Taxa de Acerto de Cache e Economia de Tokens"
sidebarTitle: "Cache Caiu, Prejuízo?"
description: "Entenda como o DCP afeta a taxa de acerto do Prompt Caching e a economia de tokens. Domine as melhores práticas para provedores como Anthropic e OpenAI, ajustando estratégias dinamicamente conforme o modelo de cobrança."
tags:
  - "advanced"
  - "prompt-caching"
  - "token-optimization"
  - "cost-optimization"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
  - "platforms-llm-tools"
order: 3
---

# Impacto no Prompt Cache: Equilibrando Taxa de Acerto e Economia de Tokens

## O Que Você Vai Aprender

- Entender como funciona o mecanismo de Prompt Caching dos provedores de LLM
- Saber por que a poda do DCP afeta a taxa de acerto do cache
- Aprender a equilibrar a perda de cache com a economia de tokens
- Definir a melhor estratégia conforme o provedor e modelo de cobrança utilizado

## Seu Dilema Atual

Você ativou o DCP e notou que a taxa de acerto do cache caiu de 85% para 65%, preocupado se isso aumentou os custos? Ou quer entender se usar o DCP em diferentes provedores de LLM (Anthropic, OpenAI, GitHub Copilot) terá impactos diferentes?

A operação de poda do DCP altera o conteúdo das mensagens, o que afeta o Prompt Caching. Mas esse trade-off vale a pena? Vamos analisar em profundidade.

## Quando Usar Esta Técnica

- Em sessões longas, quando a expansão do contexto se torna significativa
- Ao usar provedores com cobrança por requisição (como GitHub Copilot, Google Antigravity)
- Quando quiser reduzir a poluição do contexto e melhorar a qualidade das respostas
- Quando a economia de tokens supera a perda na taxa de acerto do cache

## Conceito Central

**O Que é Prompt Caching**

**Prompt Caching** é uma técnica oferecida por provedores de LLM (como Anthropic, OpenAI) para otimizar desempenho e custos. Baseia-se em **correspondência exata de prefixo** para armazenar em cache prompts já processados, evitando recalcular tokens de prefixos idênticos.

::: info Exemplo do Mecanismo de Cache

Suponha que você tenha o seguinte histórico de conversa:

```
[Prompt do Sistema]
[Mensagem do Usuário 1]
[Resposta da IA 1 + Chamada de Ferramenta A]
[Mensagem do Usuário 2]
[Resposta da IA 2 + Chamada de Ferramenta A]  ← mesma chamada de ferramenta
[Mensagem do Usuário 3]
```

Sem cache, cada envio ao LLM requer recalcular todos os tokens. Com cache, no segundo envio, o provedor pode reutilizar os resultados calculados anteriormente, precisando calcular apenas a nova "Mensagem do Usuário 3".

:::

**Como o DCP Afeta o Cache**

Quando o DCP poda a saída de ferramentas, ele substitui o conteúdo original da saída por um texto placeholder: `"[Output removed to save context - information superseded or no longer needed]"`

Esta operação altera o conteúdo exato da mensagem (que antes era a saída completa da ferramenta, agora é um placeholder), causando **invalidação do cache** — o prefixo em cache a partir desse ponto não pode mais ser reutilizado.

**Análise do Trade-off**

| Métrica | Sem DCP | Com DCP | Impacto |
| --- | --- | --- | --- |
| **Taxa de Acerto do Cache** | ~85% | ~65% | ⬇️ Redução de 20% |
| **Tamanho do Contexto** | Crescimento contínuo | Poda controlada | ⬇️ Redução significativa |
| **Economia de Tokens** | 0 | 10-40% | ⬆️ Aumento significativo |
| **Qualidade das Respostas** | Pode diminuir | Mais estável | ⬆️ Melhoria (menos poluição de contexto) |

::: tip Por Que a Queda na Taxa de Acerto Pode Resultar em Custos Menores?

A queda na taxa de acerto do cache não equivale a aumento de custos. Motivos:

1. **Economia de tokens geralmente supera a perda de cache**: Em sessões longas, a quantidade de tokens economizada pela poda do DCP (10-40%) frequentemente supera o cálculo extra de tokens causado pela invalidação do cache
2. **Redução da poluição de contexto**: Com conteúdo redundante removido, o modelo pode focar melhor na tarefa atual, resultando em respostas de maior qualidade
3. **Taxa de acerto absoluta ainda é alta**: Mesmo caindo para 65%, quase 2/3 do conteúdo ainda pode ser cacheado

Dados de teste mostram que, na maioria dos casos, o efeito de economia de tokens do DCP é mais significativo.
:::

## Impacto em Diferentes Modelos de Cobrança

### Cobrança por Requisição (GitHub Copilot, Google Antigravity)

**Melhor caso de uso**, sem impacto negativo.

Esses provedores cobram por número de requisições, não por quantidade de tokens. Portanto:

- ✅ Tokens economizados pela poda do DCP não afetam diretamente os custos
- ✅ Reduzir o tamanho do contexto pode melhorar a velocidade de resposta
- ✅ Invalidação de cache não gera custos adicionais

::: info GitHub Copilot e Google Antigravity

Essas duas plataformas cobram por requisição, tornando o DCP uma **otimização de custo zero** — mesmo que a taxa de acerto do cache caia, não haverá aumento de custos, e o desempenho ainda melhora.

:::

### Cobrança por Token (Anthropic, OpenAI)

Requer equilibrar a perda de cache com a economia de tokens.

**Exemplo de Cálculo**:

Suponha uma sessão longa com 100 mensagens e total de 100K tokens:

| Cenário | Taxa de Acerto | Tokens Economizados pelo Cache | Tokens Economizados pela Poda DCP | Economia Total |
| --- | --- | --- | --- | --- |
| Sem DCP | 85% | 85K × (1-0.85) = 12.75K | 0 | 12.75K |
| Com DCP | 65% | 100K × (1-0.65) = 35K | 20K (estimado) | 35K + 20K - 12.75K = **42.25K** |

Após a poda do DCP, embora a taxa de acerto do cache diminua, como o contexto foi reduzido em 20K tokens, a economia total real é maior.

::: warning Vantagem Evidente em Sessões Longas

Em sessões longas, a vantagem do DCP é mais evidente:

- **Sessões curtas** (< 10 mensagens): A invalidação de cache pode predominar, benefícios limitados
- **Sessões longas** (> 30 mensagens): Expansão severa do contexto, tokens economizados pela poda do DCP superam em muito a perda de cache

Recomendação: Priorize ativar o DCP em sessões longas; pode desativar em sessões curtas.
:::

## Observação e Verificação

### Passo 1: Observar o Uso de Tokens em Cache

**Por quê**
Entender a proporção de tokens em cache no total de tokens, avaliando a importância do cache

```bash
# Execute no OpenCode
/dcp context
```

**Você deve ver**: Uma análise de tokens similar a esta

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Interpretação das Métricas Principais**:

| Métrica | Significado | Como Avaliar |
| --- | --- | --- |
| **Pruned** | Quantidade de ferramentas podadas e tokens | Quanto maior, mais o DCP economiza |
| **Current context** | Total de tokens do contexto atual da sessão | Deve ser significativamente menor que Without DCP |
| **Without DCP** | Tamanho do contexto sem DCP ativado | Usado para comparar o efeito de economia |

### Passo 2: Comparar Com/Sem DCP

**Por quê**
Através da comparação, sentir intuitivamente a diferença entre cache e economia de tokens

```bash
# 1. Desativar DCP (definir enabled: false na configuração)
# Ou desativar temporariamente:
/dcp sweep 999  # Podar todas as ferramentas, observar efeito do cache

# 2. Realizar algumas conversas

# 3. Ver estatísticas
/dcp stats

# 4. Reativar DCP
# (modificar configuração ou restaurar valores padrão)

# 5. Continuar conversando, comparar estatísticas
/dcp stats
```

**Você deve ver**:

Use `/dcp context` para observar mudanças nas métricas principais:

| Métrica | DCP Desativado | DCP Ativado | Explicação |
| --- | --- | --- | --- |
| **Pruned** | 0 tools | 5-20 tools | Quantidade de ferramentas podadas pelo DCP |
| **Current context** | Maior | Menor | Contexto significativamente reduzido após DCP |
| **Without DCP** | Igual ao Current | Maior que Current | Mostra o potencial de economia do DCP |

::: tip Sugestões para Testes Práticos

Teste em diferentes tipos de sessão:

1. **Sessões curtas** (5-10 mensagens): Observe se o cache é mais importante
2. **Sessões longas** (30+ mensagens): Observe se a economia do DCP é mais evidente
3. **Leituras repetidas**: Cenários com leitura frequente dos mesmos arquivos

Isso ajuda a fazer a melhor escolha conforme seus hábitos de uso.
:::

### Passo 3: Entender o Impacto da Poluição de Contexto

**Por quê**
A poda do DCP não apenas economiza tokens, mas também reduz a poluição de contexto, melhorando a qualidade das respostas

::: info O Que é Poluição de Contexto?

**Poluição de contexto** refere-se a excesso de informações redundantes, irrelevantes ou desatualizadas no histórico da conversa, causando:

- Dispersão da atenção do modelo, dificuldade em focar na tarefa atual
- Possível referência a dados antigos (como conteúdo de arquivos já modificados)
- Queda na qualidade das respostas, necessitando mais tokens para "entender" o contexto

O DCP reduz essa poluição removendo saídas de ferramentas já concluídas, operações de leitura duplicadas, etc.
:::

**Comparação de Efeitos Práticos**:

| Cenário | Sem DCP | Com DCP |
| --- | --- | --- |
| Ler o mesmo arquivo 3 vezes | Mantém 3 saídas completas (redundante) | Mantém apenas a mais recente |
| Reler após escrever arquivo | Operação de escrita antiga + nova leitura | Mantém apenas a nova leitura |
| Saída de ferramenta com erro | Mantém entrada de erro completa | Mantém apenas a mensagem de erro |

Com menos poluição de contexto, o modelo pode entender o estado atual com mais precisão, reduzindo "alucinações" ou referências a dados desatualizados.

## Recomendações de Melhores Práticas

### Escolher Estratégia Conforme o Provedor

| Provedor | Modelo de Cobrança | Recomendação | Motivo |
| --- | --- | --- | --- |
| **GitHub Copilot** | Por requisição | ✅ Sempre ativar | Otimização de custo zero, apenas melhora desempenho |
| **Google Antigravity** | Por requisição | ✅ Sempre ativar | Idem |
| **Anthropic** | Por token | ✅ Ativar em sessões longas<br>⚠️ Opcional em sessões curtas | Equilibrar cache e economia |
| **OpenAI** | Por token | ✅ Ativar em sessões longas<br>⚠️ Opcional em sessões curtas | Idem |

### Ajustar Configuração Conforme Tipo de Sessão

```jsonc
// ~/.config/opencode/dcp.jsonc ou configuração do projeto

{
  // Sessões longas (> 30 mensagens): ativar todas as estratégias
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": true },  // Recomendado ativar
    "purgeErrors": { "enabled": true }
  },

  // Sessões curtas (< 10 mensagens): ativar apenas deduplicação
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": false },
    "purgeErrors": { "enabled": false }
  }
}
```

**Explicação das Estratégias**:

- **deduplication (deduplicação)**: Impacto pequeno, recomendado sempre ativar
- **supersedeWrites (sobrescrever escritas)**: Impacto médio, recomendado para sessões longas
- **purgeErrors (limpar erros)**: Impacto pequeno, recomendado ativar

### Ajuste Dinâmico de Estratégia

Use `/dcp context` para observar a composição de tokens e o efeito da poda:

```bash
# Se o valor de Pruned for alto, significa que o DCP está economizando tokens ativamente
# Compare Current context e Without DCP para avaliar o efeito de economia

/dcp context
```

## Checkpoint ✅

Confirme que você entendeu os seguintes pontos:

- [ ] Prompt Caching baseia-se em correspondência exata de prefixo; mudanças no conteúdo invalidam o cache
- [ ] A poda do DCP altera o conteúdo das mensagens, causando queda na taxa de acerto do cache (~20%)
- [ ] Em sessões longas, a economia de tokens geralmente supera a perda de cache
- [ ] GitHub Copilot e Google Antigravity cobram por requisição; DCP é otimização de custo zero
- [ ] Anthropic e OpenAI cobram por token; é necessário equilibrar cache e economia
- [ ] Use `/dcp context` para observar composição de tokens e efeito da poda
- [ ] Ajuste dinamicamente a configuração de estratégia conforme a duração da sessão

## Armadilhas Comuns

### ❌ Pensar que Queda na Taxa de Acerto = Aumento de Custos

**Problema**: Ver a taxa de acerto do cache cair de 85% para 65% e pensar que os custos aumentarão

**Causa**: Focar apenas na taxa de acerto do cache, ignorando a economia de tokens e redução do contexto

**Solução**: Use `/dcp context` para ver dados reais, focando em:
1. Tokens economizados pela poda do DCP (`Pruned`)
2. Tamanho atual do contexto (`Current context`)
3. Tamanho teórico sem poda (`Without DCP`)

Comparando `Without DCP` e `Current context`, você pode ver a quantidade real de tokens economizada pelo DCP.

### ❌ Poda Muito Agressiva em Sessões Curtas

**Problema**: Sessões curtas de 5-10 mensagens com todas as estratégias ativadas, invalidação de cache evidente

**Causa**: Em sessões curtas, a expansão do contexto não é severa; poda agressiva traz poucos benefícios

**Solução**:
- Em sessões curtas, ativar apenas `deduplication` e `purgeErrors`
- Desativar estratégia `supersedeWrites`
- Ou desativar completamente o DCP (`enabled: false`)

### ❌ Ignorar Diferenças de Cobrança Entre Provedores

**Problema**: Preocupar-se com custos de invalidação de cache no GitHub Copilot

**Causa**: Não perceber que o Copilot cobra por requisição; invalidação de cache não aumenta custos

**Solução**:
- Copilot e Antigravity: sempre ativar DCP
- Anthropic e OpenAI: ajustar estratégia conforme duração da sessão

### ❌ Tomar Decisões Sem Observar Dados Reais

**Problema**: Decidir por intuição se deve ativar o DCP

**Causa**: Não usar `/dcp context` e `/dcp stats` para observar efeitos reais

**Solução**:
- Coletar dados em diferentes sessões
- Comparar diferenças com/sem DCP
- Fazer escolhas baseadas em seus hábitos de uso

## Resumo da Lição

**Mecanismo Central do Prompt Caching**:

- Provedores de LLM fazem cache de prompts baseado em **correspondência exata de prefixo**
- A poda do DCP altera o conteúdo das mensagens, causando invalidação do cache
- Taxa de acerto do cache cai (~20%), mas economia de tokens é mais significativa

**Matriz de Decisão de Trade-off**:

| Cenário | Configuração Recomendada | Motivo |
| --- | --- | --- |
| GitHub Copilot/Google Antigravity | ✅ Sempre ativar | Cobrança por requisição, otimização de custo zero |
| Anthropic/OpenAI sessões longas | ✅ Ativar todas as estratégias | Economia de tokens > perda de cache |
| Anthropic/OpenAI sessões curtas | ⚠️ Apenas deduplicação + limpeza de erros | Cache é mais importante |

**Pontos-Chave**:

1. **Queda na taxa de acerto do cache não equivale a aumento de custos**: É preciso ver a economia total de tokens
2. **Modelo de cobrança do provedor afeta a estratégia**: Por requisição vs por token
3. **Ajuste dinâmico conforme duração da sessão**: Sessões longas se beneficiam mais
4. **Use ferramentas para observar dados**: `/dcp context` e `/dcp stats`

**Resumo das Melhores Práticas**:

```
1. Confirme seu provedor e modelo de cobrança
2. Ajuste configuração de estratégia conforme duração da sessão
3. Use /dcp context regularmente para observar efeitos
4. Em sessões longas, priorize economia de tokens
5. Em sessões curtas, priorize taxa de acerto do cache
```

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Tratamento de Subagentes](/pt/Opencode-DCP/opencode-dynamic-context-pruning/advanced/subagent-handling/)**.
>
> Você aprenderá:
> - Como o DCP detecta sessões de subagentes
> - Por que subagentes não participam da poda
> - Como resultados de poda em subagentes são passados ao agente principal

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Explicação do Prompt Caching | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 46-52 |
| Cálculo de Tokens (incluindo cache) | [`lib/messages/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/utils.ts) | 66-78 |
| Comando de Análise de Contexto | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174 |
| Cálculo de Tokens em Cache | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 106-107 |
| Log de Tokens em Cache | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts) | 141 |
| Definição do Placeholder de Poda | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 6-7 |
| Poda de Saída de Ferramentas | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 22-46 |

**Constantes Principais**:
- Nenhuma

**Funções Principais**:
- `calculateTokens(messages, tokenizer)`: Calcula número de tokens das mensagens, incluindo cache.read e cache.write
- `buildSessionContext(messages)`: Constrói análise de contexto da sessão, distinguindo System/User/Assistant/Tools
- `formatContextAnalysis(analysis)`: Formata saída da análise de contexto

**Tipos Principais**:
- `TokenCounts`: Estrutura de contagem de tokens, contendo input/output/reasoning/cache

**Explicação do Mecanismo de Cache** (do README):
- Anthropic e OpenAI fazem cache de prompts baseado em correspondência exata de prefixo
- A poda do DCP altera o conteúdo das mensagens, causando invalidação do cache
- Com DCP ativado, taxa de acerto do cache ~65%; sem DCP ~85%
- Melhor caso de uso: provedores com cobrança por requisição (GitHub Copilot, Google Antigravity) sem impacto negativo

</details>
