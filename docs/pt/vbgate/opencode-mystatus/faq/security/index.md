---
title: "Segurança: Proteção de Dados e Privacidade | opencode-mystatus"
sidebarTitle: "Segurança"
subtitle: "Segurança e privacidade: acesso a arquivos locais, mascaramento de API, interfaces oficiais"
description: "Entenda os mecanismos de segurança do opencode-mystatus: acesso only-read, mascaramento de API Key e chamadas apenas a interfaces oficiais para proteção de privacidade."
tags:
  - "segurança"
  - "privacidade"
  - "FAQ"
prerequisite: []
order: 2
---

# Segurança e privacidade: acesso a arquivos locais, mascaramento de API, interfaces oficiais

## O seu problema atual

Ao usar ferramentas de terceiros, o que mais lhe preocupa?

- "Ela lerá minha API Key?"
- "Minhas informações de autenticação serão enviadas para um servidor?"
- "Haverá risco de vazamento de dados?"
- "O que fazer se ela modificar meus arquivos de configuração?"

Essas preocupações são razoáveis, especialmente ao lidar com informações de autenticação de plataformas de IA sensíveis. Este tutorial explicará em detalhes como o plugin opencode-mystatus protege seus dados e privacidade por meio de design.

::: info Princípio de prioridade local
O opencode-mystatus segue o princípio "apenas leitura de arquivos locais + consulta direta a APIs oficiais", todas as operações sensíveis são concluídas em sua máquina, sem passar por nenhum servidor de terceiros.
:::

## Ideia principal

O design de segurança do plugin gira em torno de três princípios centrais:

1. **Princípio only-read**: Apenas lê arquivos de autenticação locais, não escreve ou modifica nada
2. **Interfaces oficiais**: Apenas chama as APIs oficiais de cada plataforma, não usa serviços de terceiros
3. **Mascaramento de dados**: Ao exibir a saída, oculta automaticamente informações sensíveis (como API Key)

Esses três princípios se sobrepõem, garantindo que seus dados sejam seguros durante todo o fluxo, desde a leitura até a exibição.

---

## Acesso a arquivos locais (only-read)

### Quais arquivos o plugin lê

O plugin lê apenas dois arquivos de configuração locais, ambos em **modo only-read**:

| Caminho do arquivo | Propósito | Localização no código |
|--- | --- | ---|
| `~/.local/share/opencode/auth.json` | Armazenamento de autenticação oficial OpenCode | `mystatus.ts:35` |
| `~/.config/opencode/antigravity-accounts.json` | Armazenamento de contas do plugin Antigravity | `google.ts` (lógica de leitura) |

::: tip Não modificar arquivos
No código-fonte, apenas a função `readFile` é usada para ler arquivos, sem nenhum `writeFile` ou outras operações de modificação. Isso significa que o plugin não sobrescreverá acidentalmente suas configurações.
:::

### Evidência do código-fonte

```typescript
// Linhas 38-40 do mystatus.ts
const content = await readFile(authPath, "utf-8");
authData = JSON.parse(content);
```

Aqui, o `fs/promises.readFile` do Node.js é usado, que é uma **operação only-read**. Se o arquivo não existir ou estiver com formato incorreto, o plugin retornará uma mensagem de erro amigável, em vez de criar ou modificar o arquivo.

---

## Mascaramento automático de API Key

### O que é mascaramento

Mascaramento (Masking) é o processo de exibir apenas alguns caracteres ao mostrar informações sensíveis, ocultando a parte principal.

Por exemplo, sua API Key Zhipu AI pode ser:
```
sk-9c89abc1234567890abcdefAQVM
```

Após o mascaramento, será exibida como:
```
sk-9c8****fAQVM
```

### Regras de mascaramento

O plugin usa a função `maskString` para processar todas as informações sensíveis:

```typescript
// Linhas 130-135 do utils.ts
export function maskString(str: string, showChars: number = 4): string {
  if (str.length <= showChars * 2) {
    return str;
  }
  return `${str.slice(0, showChars)}****${str.slice(-showChars)}`;
}
```

**Explicação das regras**:
- Por padrão, exibe os primeiros 4 e os últimos 4 caracteres
- A parte do meio é substituída por `****`
- Se a string for muito curta (≤ 8 caracteres), é retornada como está

### Exemplo de uso real

Na consulta de cota Zhipu AI, a API Key mascarada aparecerá na saída:

```typescript
// Linha 124 do zhipu.ts
const maskedKey = maskString(apiKey);
lines.push(`${t.account}        ${maskedKey} (${accountLabel})`);
```

Efeito da saída:
```
Account:        9c89****AQVM (Coding Plan)
```

::: tip Função do mascaramento
Mesmo que você compartilhe um print da saída da consulta com outras pessoas, sua API Key real não será vazada. Apenas os "primeiros e últimos 4 caracteres" exibidos são visíveis, e a parte principal foi ocultada.
:::

---

## Chamada a interfaces oficiais

### Quais APIs o plugin chama

O plugin apenas chama as **APIs oficiais** de cada plataforma, sem passar por nenhum servidor de terceiros:

| Plataforma | Endpoint da API | Propósito |
|--- | --- | ---|
| OpenAI | `https://chatgpt.com/backend-api/wham/usage` | Consulta de cota |
| Zhipu AI | `https://bigmodel.cn/api/monitor/usage/quota/limit` | Consulta de limite de token |
| Z.ai | `https://api.z.ai/api/monitor/usage/quota/limit` | Consulta de limite de token |
| GitHub Copilot | `https://api.github.com/copilot_internal/user` | Consulta de cota |
| GitHub Copilot | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` | Consulta de API pública |
| Google Cloud | `https://oauth2.googleapis.com/token` | Atualização de token OAuth |
| Google Cloud | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` | Consulta de cota de modelo |

::: info Segurança de APIs oficiais
Esses endpoints de API são interfaces oficiais de cada plataforma, usando transmissão criptografada HTTPS. O plugin apenas atua como "cliente" enviando solicitações, não armazena ou encaminha nenhum dado.
:::

### Proteção de tempo limite de solicitação

Para evitar que solicitações de rede travem, o plugin define um tempo limite de 10 segundos:

```typescript
// Linha 114 do types.ts
export const REQUEST_TIMEOUT_MS = 10000;

// Linhas 84-106 do utils.ts
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(t.timeoutError(Math.round(timeoutMs / 1000)));
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**Função do mecanismo de tempo limite**:
- Evitar que falhas de rede causem espera infinita do plugin
- Proteger seus recursos do sistema de serem ocupados
- Após 10 segundos, a solicitação é cancelada automaticamente e uma mensagem de erro é retornada

---

## Resumo de proteção de privacidade

### O que o plugin não faz

| Operação | Comportamento do plugin |
|--- | ---|
| Armazenar dados | ❌ Não armazena nenhum dado do usuário |
| Carregar dados | ❌ Não carrega nenhum dado para servidores de terceiros |
| Cache de resultados | ❌ Não armazena resultados de consulta em cache |
| Modificar arquivos | ❌ Não modifica nenhum arquivo de configuração local |
| Registros de log | ❌ Não registra nenhum log de uso |

### O que o plugin faz

| Operação | Comportamento do plugin |
|--- | ---|
| Ler arquivos | ✅ Apenas lê arquivos de autenticação locais |
| Chamar APIs | ✅ Apenas chama endpoints de API oficiais |
| Exibir mascarado | ✅ Oculta automaticamente informações sensíveis como API Key |
| Código aberto | ✅ Todo o código é open-source, podendo ser auditado independentemente |

### Código-fonte auditável

Todo o código do plugin é open-source, você pode:
- Verificar o repositório GitHub do código-fonte
- Verificar cada endpoint de chamada de API
- Verificar se há lógica de armazenamento de dados
- Confirmar a implementação da função de mascaramento

---

## Perguntas frequentes

::: details O plugin roubará minha API Key?
Não. O plugin apenas usa a API Key para enviar solicitações à API oficial, não armazena ou encaminha para nenhum servidor de terceiros. Todo o código é open-source e pode ser auditado.
:::

::: details Por que exibir a API Key mascarada?
Isso é para proteger sua privacidade. Mesmo que você compartilhe um print do resultado da consulta, sua API Key completa não será vazada. Após o mascaramento, apenas os primeiros 4 e últimos 4 caracteres são exibidos, e a parte do meio foi ocultada.
:::

::: details O plugin modificará meus arquivos de configuração?
Não. O plugin apenas usa `readFile` para ler arquivos, não executa nenhuma operação de gravação. Se o formato do arquivo de configuração estiver incorreto, o plugin retornará uma mensagem de erro, em vez de tentar corrigir ou sobrescrever.
:::

::: details Os resultados da consulta serão armazenados em cache no plugin?
Não. O plugin lê arquivos e consulta a API em tempo real a cada chamada, não armazena nenhum resultado em cache. Todos os dados são descartados imediatamente após a conclusão da consulta.
:::

::: details O plugin coletará dados de uso?
Não. O plugin não tem nenhum recurso de rastreamento ou coleta de dados, não rastreia seu comportamento de uso.
:::

---

## Resumo desta seção

- **Princípio only-read**: O plugin apenas lê arquivos de autenticação locais, não modifica nada
- **Mascaramento de API**: Ao exibir a saída, oculta automaticamente a parte principal da API Key
- **Interfaces oficiais**: Apenas chama as APIs oficiais de cada plataforma, não usa serviços de terceiros
- **Código aberto e transparente**: Todo o código é open-source, você pode auditar os mecanismos de segurança independentemente

## Próxima seção

> A próxima seção aprenderemos **[Modelos de dados: estrutura de arquivo de autenticação e formato de resposta da API](/pt/vbgate/opencode-mystatus/appendix/data-models/)**.
>
> Você aprenderá:
> - Definição completa da estrutura AuthData
> - Significado dos campos de dados de autenticação de cada plataforma
> - Formato de dados de resposta da API

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Leitura de arquivo de autenticação | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts#L38-L40) | 38-40 |
| Função de mascaramento de API | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L135) | 130-135 |
| Configuração de tempo limite de solicitação | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |
| Implementação de tempo limite de solicitação | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L84-L106) | 84-106 |
| Exemplo de mascaramento Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L124) | 124 |

**Funções principais**:
- `maskString(str, showChars = 4)`: Exibe strings sensíveis de forma mascarada, exibe os primeiros e últimos `showChars` caracteres, o meio é substituído por `****`

**Constantes principais**:
- `REQUEST_TIMEOUT_MS = 10000`: Tempo limite de solicitação de API (10 segundos)

</details>
