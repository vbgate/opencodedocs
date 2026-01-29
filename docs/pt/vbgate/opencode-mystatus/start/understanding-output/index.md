---
title: "Interpretar saída: barras e tempo | opencode-mystatus"
sidebarTitle: "Interpretar saída"
subtitle: "Interpretar saída: barras de progresso, tempo de redefinição e múltiplas contas"
description: "Aprenda a interpretar a saída do opencode-mystatus: barras de progresso, tempo de redefinição e diferenças entre OpenAI, Zhipu AI, Copilot e Google Cloud."
tags:
  - "formato de saída"
  - "barra de progresso"
  - "tempo de redefinição"
  - "múltiplas contas"
prerequisite:
  - "start-quick-start"
order: 3
---

# Interpretar saída: barras de progresso, tempo de redefinição e múltiplas contas

## O que você poderá fazer após concluir

- Entender cada informação na saída do mystatus
- Entender o significado da exibição da barra de progresso (sólido vs. vazio)
- Saber os ciclos de limite de diferentes plataformas (3 horas, 5 horas, mensal)
- Identificar diferenças de cota de múltiplas contas

## O seu problema atual

Você executou `/mystatus`, vê muitas barras de progresso, porcentagens, contagens regressivas, mas não está claro:

- A barra de progresso cheia é boa ou vazia é boa?
- O que significa "Resets in: 2h 30m"?
- Por que algumas plataformas exibem duas barras de progresso, outras apenas uma?
- Por que o Google Cloud tem várias contas?

Esta seção explicará essas informações uma por uma.

## Ideia principal

A saída do mystatus tem formato unificado, mas há diferenças entre plataformas:

**Elementos unificados**:
- Barra de progresso: `█` (sólido) indica restante, `░` (vazio) indica usado
- Porcentagem: baseada no uso calcula a porcentagem restante
- Tempo de redefinição: contagem regressiva até a próxima atualização de cota

**Diferenças de plataforma**:
| Plataforma | Ciclo de limite | Características |
|--- | --- | ---|
| OpenAI | 3 horas / 24 horas | Pode exibir duas janelas |
| Zhipu AI / Z.ai | 5 horas Token / Cota mensal de MCP | Dois tipos diferentes de limite |
| GitHub Copilot | Mensal | Exibe valores específicos (229/300) |
| Google Cloud | Por modelo | Cada conta exibe 4 modelos |

## Análise de estrutura de saída

### Exemplo de saída completa

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
█████████░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

## GitHub Copilot Account Quota

Account:        GitHub Copilot (individual)

Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)

## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

### Significado de cada parte

#### 1. Linha de informações da conta

```
Account:        user@example.com (team)
```

- **OpenAI / Copilot**: Exibe e-mail + tipo de assinatura
- **Zhipu AI / Z.ai**: Exibe API Key mascarada + tipo de conta (Coding Plan)
- **Google Cloud**: Exibe e-mail, múltiplas contas separadas por `###`

#### 2. Barra de progresso

```
███████████████████████████ 85% remaining
```

- `█` (bloco sólido): **restante** da cota
- `░` (bloco vazio): **usado** da cota
- **Porcentagem**: porcentagem restante (quanto maior, melhor)

::: tip Mnemônico
Bloco sólido mais cheio = mais restante → pode usar com confiança
Bloco vazio mais cheio = mais usado → economize um pouco
:::

#### 3. Contagem regressiva de tempo de redefinição

```
Resets in: 2h 30m
```

Indica quanto tempo resta até a próxima atualização de cota.

**Ciclo de redefinição**:
- **OpenAI**: 3 horas / 24 horas
- **Zhipu AI / Z.ai**: 5 horas Token / Cota mensal de MCP
- **GitHub Copilot**: Mensal (exibe data específica)
- **Google Cloud**: Cada modelo tem tempo de redefinição independente

#### 4. Detalhes numéricos (algumas plataformas)

O Zhipu AI e o Copilot exibirão valores específicos:

```
Used: 0.5M / 10.0M              # Zhipu AI: usado / total (unidade: milhões de tokens)
Premium        24% (229/300)     # Copilot: porcentagem restante (usado / cota total)
```

## Explicação detalhada de diferenças de plataforma

### OpenAI: Limite de dupla janela

O OpenAI pode exibir duas barras de progresso:

```
3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
█████████░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m
```

- **3-hour limit**: janela de 3 horas, adequada para uso de alta frequência
- **24-hour limit**: janela de 24 horas, adequada para planejamento de longo prazo

**Conta de equipe** (Team):
- Tem duas janelas de cota (principal e secundária)
- Diferentes membros compartilham a mesma cota Team

**Conta pessoal** (Plus):
- Geralmente exibe apenas a janela de 3 horas

### Zhipu AI / Z.ai: Dois tipos de limite

```
5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

MCP limit
███████████████████████████ 100% remaining
Used: 0 / 1000
```

- **5-hour token limit**: Limite de uso de token em 5 horas
- **MCP limit**: Cota mensal de MCP (Model Context Protocol), para função de pesquisa

::: warning
A cota de MCP é mensal, o tempo de redefinição é mais longo. Se exibir cheia, precisa esperar até o próximo mês para recuperar.
:::

### GitHub Copilot: Cota mensal

```
Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)
```

- **Premium Requests**: Uso de recursos avançados do Copilot
- Exibe valores específicos (usado / cota total)
- Redefinição mensal, exibe data específica

**Diferenças de tipo de assinatura**:
| Tipo de assinatura | Cota mensal | Descrição |
|--- | --- | ---|
| Free | N/A | Sem limite de cota, mas funcionalidades limitadas |
| Pro | 300 | Versão pessoal padrão |
| Pro+ | Mais alto | Versão atualizada |
| Business | Mais alto | Versão corporativa |
| Enterprise | Ilimitado | Versão corporativa |

### Google Cloud: Múltiplas contas + Múltiplos modelos

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

**Formato**: `nome do modelo | tempo de redefinição | barra de progresso + porcentagem`

**Explicação dos 4 modelos**:
| Nome do modelo | Chave de API correspondente | Uso |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Raciocínio avançado |
| G3 Image | `gemini-3-pro-image` | Geração de imagem |
| G3 Flash | `gemini-3-flash` | Geração rápida |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Modelo Claude |

**Exibição de múltiplas contas**:
- Cada conta Google é separada por `###`
- Cada conta exibe sua própria cota de 4 modelos
- Pode comparar o uso de cota de diferentes contas

## Avisos sobre armadilhas

### Equívocos comuns

| Equívoco | Fato |
|--- | ---|
| Barra de progresso toda sólida = nunca usada | Bloco sólido mais cheio = **mais restante**, pode usar com segurança |
| Tempo de redefinição curto = cota quase esgotada | Tempo de redefinição curto = vai redefinir em breve, pode continuar usando |
| Porcentagem 100% = totalmente usado | Porcentagem 100% = **totalmente restante** |
| Zhipu AI exibe apenas um limite | Na verdade há dois tipos de limite: TOKENS_LIMIT e TIME_LIMIT |

### O que fazer quando o limite estiver cheio?

Se a barra de progresso estiver toda vazia (0% remaining):

1. **Limite de curto prazo** (como 3 horas, 5 horas): Aguarde a contagem regressiva de tempo de redefinição terminar
2. **Limite mensal** (como Copilot, MCP): Aguarde até o início do próximo mês
3. **Múltiplas contas**: Mude para outra conta (Google Cloud suporta múltiplas contas)

::: info
O mystatus é uma **ferramenta only-read**, não consome sua cota, nem aciona nenhuma chamada de API.
:::

## Resumo desta seção

- **Barra de progresso**: Sólido `█` = restante, vazio `░` = usado
- **Tempo de redefinição**: Contagem regressiva até a próxima atualização de cota
- **Diferenças de plataforma**: Diferentes plataformas têm diferentes ciclos de limite (3h/5h/mensal)
- **Múltiplas contas**: Google Cloud exibe múltiplas contas, facilitando o gerenciamento de cota

## Próxima seção

> A próxima seção aprenderemos **[Consulta de cota OpenAI](../../platforms/openai-usage/)**.
>
> Você aprenderá:
> - Diferença entre limites de 3 horas e 24 horas do OpenAI
> - Mecanismo de compartilhamento de cota de contas de equipe
> - Como analisar o token JWT para obter informações da conta

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Geração de barra de progresso | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L40-L53) | 40-53 |
| Formatação de tempo | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L18-L29) | 18-29 |
| Cálculo de porcentagem restante | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L63-L65) | 63-65 |
| Formatação de quantidade de tokens | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L70-L72) | 70-72 |
| Formatação de saída OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| Formatação de saída Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L115-L177) | 115-177 |
| Formatação de saída Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L395-L447) | 395-447 |
| Formatação de saída Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |

**Funções principais**:
- `createProgressBar(percent, width)`: Gera barra de progresso, bloco sólido indica restante
- `formatDuration(seconds)`: Converte segundos em formato legível para humanos (como "2h 30m")
- `calcRemainPercent(usedPercent)`: Calcula porcentagem restante (100 - porcentagem usada)
- `formatTokens(tokens)`: Formata quantidade de tokens em milhões (como "0.5M")

**Constantes principais**:
- Largura padrão da barra de progresso: 30 caracteres (modelos Google Cloud usam 20 caracteres)
- Caracteres da barra de progresso: `█` (sólido), `░` (vazio)

</details>
