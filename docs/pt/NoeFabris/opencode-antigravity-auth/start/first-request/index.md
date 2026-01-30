---
title: "Primeira Requisição: Verificar Instalação do Antigravity | opencode-antigravity-auth"
sidebarTitle: "Enviar Primeira Requisição"
description: "Aprenda a enviar sua primeira requisição de modelo Antigravity, verificando se a autenticação OAuth e a configuração estão corretas. Domine a seleção de modelos, uso do parâmetro variant e solução de erros comuns."
subtitle: "Primeira Requisição: Verificar Sucesso da Instalação"
tags:
  - "Verificação de instalação"
  - "Requisição de modelo"
  - "Início rápido"
prerequisite:
  - "start-quick-install"
order: 4
---

# Primeira Requisição: Verificar Sucesso da Instalação

## O Que Você Vai Aprender

- Enviar sua primeira requisição de modelo Antigravity
- Entender a função dos parâmetros `--model` e `--variant`
- Escolher o modelo e configuração de pensamento adequados conforme a necessidade
- Solucionar erros comuns de requisição de modelo

## Seu Problema Atual

Você acabou de instalar o plugin, completou a autenticação OAuth, configurou as definições de modelo, mas agora não tem certeza:
- O plugin realmente funciona normalmente?
- Qual modelo devo usar para começar a testar?
- Como usar o parâmetro `--variant`?
- Se a requisição falhar, como saber qual etapa deu errado?

## Quando Usar Esta Técnica

Use o método de verificação desta lição nos seguintes cenários:
- **Após a primeira instalação** — Confirmar que autenticação, configuração e modelos funcionam normalmente
- **Após adicionar nova conta** — Verificar se a nova conta está disponível
- **Após alterar configuração de modelo** — Confirmar que a nova configuração de modelo está correta
- **Antes de encontrar problemas** — Estabelecer uma linha de base para comparação futura

## Preparação Antes de Começar

::: warning Verificação de Pré-requisitos

Antes de continuar, confirme:

- Completou a [Instalação Rápida](/pt/NoeFabris/opencode-antigravity-auth/start/quick-install/)
- Executou `opencode auth login` para completar a autenticação OAuth
- Adicionou definições de modelo em `~/.config/opencode/opencode.json`
- Terminal OpenCode ou CLI está disponível

:::

## Ideia Central

### Por Que Verificar Primeiro

O plugin envolve a colaboração de múltiplos componentes:
1. **Autenticação OAuth** — Obter token de acesso
2. **Gerenciamento de conta** — Selecionar conta disponível
3. **Transformação de requisição** — Converter formato OpenCode para formato Antigravity
4. **Resposta em streaming** — Processar resposta SSE e converter de volta para formato OpenCode

Enviar a primeira requisição pode verificar se toda a cadeia está funcionando. Se bem-sucedido, significa que todos os componentes estão funcionando normalmente; se falhar, você pode localizar o problema com base na mensagem de erro.

### Relação entre Model e Variant

No plugin Antigravity, **modelo e variant são dois conceitos independentes**:

| Conceito | Função | Exemplo |
| --- | --- | --- |
| **Model (Modelo)** | Seleciona o modelo de IA específico | `antigravity-claude-sonnet-4-5-thinking` |
| **Variant (Variante)** | Configura o orçamento ou modo de pensamento do modelo | `low` (pensamento leve), `max` (pensamento máximo) |

::: info O que é Orçamento de Pensamento?

Orçamento de pensamento (thinking budget) refere-se à quantidade de tokens que o modelo pode usar para "pensar" antes de gerar uma resposta. Um orçamento maior significa que o modelo tem mais tempo para raciocinar, mas também aumenta o tempo de resposta e o custo.

- **Modelos Claude Thinking**: Configurado com `thinkingConfig.thinkingBudget` (unidade: tokens)
- **Modelos Gemini 3**: Configurado com `thinkingLevel` (níveis em string: minimal/low/medium/high)

:::

### Combinações Recomendadas para Iniciantes

Combinações recomendadas de modelo e variant para diferentes necessidades:

| Necessidade | Modelo | Variant | Características |
| --- | --- | --- | --- |
| **Teste rápido** | `antigravity-gemini-3-flash` | `minimal` | Resposta mais rápida, adequado para verificação |
| **Desenvolvimento diário** | `antigravity-claude-sonnet-4-5-thinking` | `low` | Equilíbrio entre velocidade e qualidade |
| **Raciocínio complexo** | `antigravity-claude-opus-4-5-thinking` | `max` | Capacidade de raciocínio mais forte |
| **Tarefas visuais** | `antigravity-gemini-3-pro` | `high` | Suporte multimodal (imagens/PDF) |

## Siga Comigo

### Passo 1: Enviar a Requisição de Teste Mais Simples

Primeiro, use o comando mais simples para testar se a conexão básica está normal.

**Por quê**
Esta requisição não usa a funcionalidade thinking, retorna extremamente rápido, adequada para verificar rapidamente autenticação e status da conta.

**Execute o comando**

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5
```

**Você deve ver**

```
Hello! I'm Claude Sonnet 4.5, an AI assistant...
```

::: tip Sinal de Sucesso

Se você viu a resposta da IA, significa:
- Autenticação OAuth bem-sucedida
- Conta tem permissão de acesso
- Transformação de requisição funcionando normalmente
- Resposta em streaming analisada corretamente

:::

### Passo 2: Usar Modelo Thinking e Variant

Agora teste o fluxo completo de pensamento, incluindo o parâmetro variant.

**Por quê**
Modelos Thinking requerem lógica adicional de transformação de requisição, que é uma das funcionalidades principais do plugin.

**Execute o comando**

```bash
opencode run "Explique o que é closure, usando uma analogia simples" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**Você deve ver**

1. **Saída de pensamento em streaming**: Você verá o modelo primeiro exibir o processo de pensamento (com marcação `<thinking>`)
2. **Processo de pensamento**: O modelo analisará detalhadamente como organizar a resposta
3. **Resposta final**: Após completar o pensamento, exibe o conteúdo final

::: details Ver um exemplo de resposta completa

```
<thinking>
O usuário perguntou o que é closure, preciso explicar usando uma analogia simples.

Conceito de closure:
1. Função pode acessar variáveis do seu escopo externo
2. Mesmo que a função externa já tenha terminado de executar
3. Esta capacidade é como uma "mochila"

Ideia de analogia:
- Posso usar a analogia da "mochila"
- Função retorna carregando algumas variáveis
- Como colocar coisas de casa na mochila antes de sair
</thinking>

Closure é como uma "mochila" da função.

Quando uma função é criada, ela "empacota" as variáveis externas que pode acessar, como colocar coisas necessárias da casa na mochila antes de sair. Mesmo que a função deixe o lugar onde foi criada (função externa terminou de executar), ela ainda pode acessar essas variáveis através dessa "mochila".

Um exemplo:
```javascript
function createCounter() {
  let count = 0;  // Esta variável é colocada na "mochila"
  return function() {
    count++;  // Ainda pode acessar a variável na mochila
    return count;
  };
}
```
```

:::

**Checkpoint**

- [ ] Viu o bloco `<thinking>` (se configurou `keep_thinking: true`)
- [ ] Conteúdo da resposta é razoável e lógico
- [ ] Tempo de resposta está dentro do aceitável (geralmente 2-10 segundos)

### Passo 3: Testar Modelos Gemini 3

Teste diferentes níveis de pensamento do Gemini 3 Pro.

**Por quê**
Gemini 3 usa `thinkingLevel` em formato de string, verificando o suporte a diferentes famílias de modelos.

**Execute os comandos**

```bash
# Testar Gemini 3 Flash (resposta rápida)
opencode run "Escreva um bubble sort" --model=google/antigravity-gemini-3-flash --variant=low

# Testar Gemini 3 Pro (pensamento profundo)
opencode run "Analise a complexidade de tempo do bubble sort" --model=google/antigravity-gemini-3-pro --variant=high
```

**Você deve ver**

- Modelo Flash responde mais rápido (adequado para tarefas simples)
- Modelo Pro pensa mais profundamente (adequado para análises complexas)
- Ambos os modelos funcionam normalmente

### Passo 4: Testar Capacidade Multimodal (Opcional)

Se sua configuração de modelo suporta entrada de imagens, você pode testar a funcionalidade multimodal.

**Por quê**
Antigravity suporta entrada de imagens/PDF, que é uma funcionalidade necessária em muitos cenários.

**Prepare uma imagem de teste**: Qualquer arquivo de imagem (como `test.png`)

**Execute o comando**

```bash
opencode run "Descreva o conteúdo desta imagem" --model=google/antigravity-gemini-3-pro --image=test.png
```

**Você deve ver**

- O modelo descreve com precisão o conteúdo da imagem
- A resposta inclui resultados de análise visual

## Checkpoint

Após completar os testes acima, confirme a seguinte lista:

| Item de Verificação | Resultado Esperado | Status |
| --- | --- | --- |
| **Conexão básica** | Requisição simples do Passo 1 bem-sucedida | ☐ |
| **Modelo Thinking** | Viu processo de pensamento no Passo 2 | ☐ |
| **Modelos Gemini 3** | Ambos os modelos funcionam no Passo 3 | ☐ |
| **Parâmetro Variant** | Diferentes variants produzem resultados diferentes | ☐ |
| **Saída em streaming** | Resposta exibida em tempo real, sem interrupções | ☐ |

::: tip Tudo passou?

Se todos os itens de verificação passaram, parabéns! O plugin está completamente configurado e pronto para uso.

Próximos passos:
- [Explorar modelos disponíveis](/pt/NoeFabris/opencode-antigravity-auth/platforms/available-models/)
- [Configurar balanceamento de carga multi-conta](/pt/NoeFabris/opencode-antigravity-auth/advanced/multi-account-setup/)
- [Ativar Google Search](/pt/NoeFabris/opencode-antigravity-auth/platforms/google-search-grounding/)

:::

## Armadilhas Comuns

### Erro 1: `Model not found`

**Mensagem de erro**
```
Error: Model 'antigravity-claude-sonnet-4-5' not found
```

**Causa**
A definição do modelo não foi adicionada corretamente em `provider.google.models` no `opencode.json`.

**Solução**

Verifique o arquivo de configuração:

```bash
cat ~/.config/opencode/opencode.json | grep -A 10 "models"
```

Confirme que o formato da definição do modelo está correto:

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: warning Atenção à ortografia

O nome do modelo deve corresponder exatamente à chave no arquivo de configuração (diferencia maiúsculas/minúsculas):

- Errado: `--model=google/claude-sonnet-4-5`
- Correto: `--model=google/antigravity-claude-sonnet-4-5`

:::

### Erro 2: `403 Permission Denied`

**Mensagem de erro**
```
403 Permission denied on resource '//cloudaicompanion.googleapis.com/...'
```

**Causa**
1. Autenticação OAuth não completada
2. Conta não tem permissão de acesso
3. Problema de configuração do Project ID (para modelos Gemini CLI)

**Solução**

1. **Verificar status da autenticação**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   Você deve ver pelo menos um registro de conta.

2. **Se a conta estiver vazia ou a autenticação falhou**:
   ```bash
   rm ~/.config/opencode/antigravity-accounts.json
   opencode auth login
   ```

3. **Se for erro de modelo Gemini CLI**:
   Você precisa configurar manualmente o Project ID (veja [FAQ - 403 Permission Denied](/pt/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/))

### Erro 3: `Invalid variant 'max'`

**Mensagem de erro**
```
Error: Invalid variant 'max' for model 'antigravity-gemini-3-pro'
```

**Causa**
Diferentes modelos suportam formatos diferentes de configuração de variant.

**Solução**

Verifique a definição de variant na configuração do modelo:

| Tipo de Modelo | Formato do Variant | Valor de Exemplo |
| --- | --- | --- |
| **Claude Thinking** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 32768 } }` |
| **Gemini 3** | `thinkingLevel` | `{ "thinkingLevel": "high" }` |
| **Gemini 2.5** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 8192 } }` |

**Exemplo de configuração correta**:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  },
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro",
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

### Erro 4: Timeout ou Sem Resposta

**Sintomas**
Após executar o comando, não há saída por muito tempo, ou eventualmente timeout.

**Possíveis causas**
1. Problema de conexão de rede
2. Servidor respondendo lentamente
3. Todas as contas estão em estado de limite de taxa

**Solução**

1. **Verificar conexão de rede**:
   ```bash
   ping cloudaicompanion.googleapis.com
   ```

2. **Ver logs de depuração**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=1 opencode run "test" --model=google/antigravity-claude-sonnet-4-5
   ```

3. **Verificar status das contas**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   Se você ver que todas as contas têm timestamp `rateLimit`, significa que todas estão com limite de taxa e você precisa esperar o reset.

### Erro 5: Interrupção na Saída SSE em Streaming

**Sintomas**
A resposta para no meio, ou você só vê conteúdo parcial.

**Possíveis causas**
1. Rede instável
2. Token da conta expirou durante a requisição
3. Erro do servidor

**Solução**

1. **Ativar logs de depuração para ver detalhes**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "test"
   ```

2. **Verificar arquivo de log**:
   ```bash
   tail -f ~/.config/opencode/antigravity-logs/latest.log
   ```

3. **Se interrupções forem frequentes**:
   - Tente mudar para um ambiente de rede mais estável
   - Use modelos não-Thinking para reduzir o tempo de requisição
   - Verifique se a conta está próxima do limite de quota

## Resumo da Lição

Enviar a primeira requisição é o passo chave para verificar o sucesso da instalação. Através desta lição, você aprendeu:

- **Requisição básica**: Usar `opencode run --model` para enviar requisições
- **Uso de Variant**: Configurar orçamento de pensamento através de `--variant`
- **Seleção de modelo**: Escolher modelos Claude ou Gemini conforme a necessidade
- **Solução de problemas**: Localizar e resolver problemas com base nas mensagens de erro

::: tip Práticas Recomendadas

No desenvolvimento diário:

1. **Comece com testes simples**: Após cada mudança de configuração, primeiro envie uma requisição simples para verificar
2. **Aumente a complexidade gradualmente**: De sem thinking → low thinking → max thinking
3. **Registre a linha de base de resposta**: Lembre-se do tempo de resposta em condições normais para comparação
4. **Use logs de depuração**: Quando encontrar problemas, ative `OPENCODE_ANTIGRAVITY_DEBUG=2`

:::

---

## Prévia da Próxima Lição

> Na próxima lição vamos aprender **[Visão Geral dos Modelos Disponíveis](/pt/NoeFabris/opencode-antigravity-auth/platforms/available-models/)**.
>
> Você vai aprender:
> - Lista completa de todos os modelos disponíveis e suas características
> - Guia de seleção entre modelos Claude e Gemini
> - Comparação de limites de contexto e saída
> - Melhores cenários de uso para modelos Thinking

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Entrada de transformação de requisição | [`src/plugin/request.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts) | 1-100 |
| Seleção de conta e gerenciamento de token | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-50 |
| Transformação de modelo Claude | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | Arquivo completo |
| Transformação de modelo Gemini | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | Arquivo completo |
| Processamento de resposta em streaming | [`src/plugin/core/streaming/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/core/streaming/index.ts) | Arquivo completo |
| Sistema de logs de depuração | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | Arquivo completo |

**Funções principais**:
- `prepareAntigravityRequest()`: Converte requisição OpenCode para formato Antigravity (`request.ts`)
- `createStreamingTransformer()`: Cria transformador de resposta em streaming (`core/streaming/`)
- `resolveModelWithVariant()`: Resolve configuração de modelo e variant (`transform/model-resolver.ts`)
- `getCurrentOrNextForFamily()`: Seleciona conta para requisição (`accounts.ts`)

**Exemplos de configuração**:
- Formato de configuração de modelo: [`README.md#models`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L110)
- Descrição detalhada de Variant: [`docs/MODEL-VARIANTS.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MODEL-VARIANTS.md)

</details>
