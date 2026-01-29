---
title: "Roteamento de Modelo: Mapeamento Personalizado | Antigravity-Manager"
sidebarTitle: "Roteamento de Modelo Personalizado"
subtitle: "Roteamento de Modelo: Mapeamento Personalizado, Prioridade de Curinga e Estratégias Preset"
description: "Aprenda configuração de roteamento de modelo do Antigravity Tools. Através de custom_mapping realize mapeamento de nome de modelo, entenda regras de correspondência exata e curinga, use preset para adaptar OpenAI/Claude, e verifique roteamento através de X-Mapped-Model."
tags:
  - "roteamento de modelo"
  - "custom_mapping"
  - "curinga"
  - "compatível OpenAI"
  - "compatível Claude"
prerequisite:
  - "start-proxy-and-first-client"
  - "platforms-openai"
order: 4
---

# Roteamento de Modelo: Mapeamento Personalizado, Prioridade de Curinga e Estratégias Preset

O `model` que você escreve no cliente não é necessariamente igual ao "modelo físico" que Antigravity Tools finalmente solicita upstream. **Roteamento de modelo** faz algo simples: mapear "nome de modelo estável externamente" para "modelo realmente usado internamente", e colocar o resultado no header de resposta `X-Mapped-Model`, facilitando você confirmar se entrou no caminho esperado.

## O Que Você Poderá Fazer Após Este Curso

- Na UI configurar `proxy.custom_mapping` (mapeamento exato + mapeamento curinga)
- Explicar claramente como uma regra é atingida (exato > curinga > mapeamento padrão)
- Aplicar regras preset com um clique, compatibilize rapidamente clientes OpenAI/Claude
- Usar `curl -i` para verificar `X-Mapped-Model`, localizar "por que não roteou como eu pensava"

## Seu Problema Atual

- Você quer que cliente sempre escreva `gpt-4o`, mas upstream quer estabilizar em certo modelo Gemini
- Você tem um monte de nomes de modelo versionados (por exemplo `gpt-4-xxxx`), não quer cada vez adicionar mapeamento manualmente
- Você vê solicitação bem-sucedida, mas não tem certeza qual modelo físico está rodando

## Quando Usar Esta Técnica

- Você quer fornecer para equipe um "conjunto de modelo externo fixo", blindar mudança de modelo upstream
- Você quer unificar rotear múltiplos nomes de modelo OpenAI/Claude para poucos modelos de alta relação custo-benefício
- Ao solucionar 401/429/0 token, você precisa confirmar modelo real após mapeamento

## 🎒 Preparação Antes de Começar

- Você já pode iniciar proxy reverso local, e pode fazer chamadas de fora funcionarem (recomendado primeiro completar [Inicie o Proxy Reverso Local e Conecte o Primeiro Cliente (/healthz + Configuração SDK)](/zh/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/))
- Você sabe como usar `curl -i` para ver headers de resposta (na aula anterior usou `X-Mapped-Model`)

::: info Duas palavras-chave nesta aula
- **`custom_mapping`**: Sua "tabela de regras personalizadas", key é nome de modelo passado pelo cliente (ou padrão curinga), value é nome de modelo finalmente usado (origem: `src/types/config.ts`).
- **Curinga `*`**: Usado para corresponder em lote nomes de modelo (por exemplo `gpt-4*`), implementação de correspondência é **sensível a maiúsculas/minúsculas** (origem: `src-tauri/src/proxy/common/model_mapping.rs`).
:::

## Ideia Central

Ao processar solicitação, o backend primeiro calculará um `mapped_model`:

 1. Primeiro verifica se `custom_mapping` tem **correspondência exata** (key completamente igual a `model`)
 2. Depois tenta correspondência curinga: seleciona regra com "**mais caracteres não `*`**" (regra mais específica tem prioridade)
 3. Se não atingir nenhuma, vai para mapeamento padrão do sistema (por exemplo alguns aliases de modelo OpenAI/Claude para modelos internos)

 Este `mapped_model` será escrito no header de resposta `X-Mapped-Model` (pelo menos handler OpenAI fará isso), você pode usá-lo para confirmar "meu model final se tornou o que".

::: tip Semântica de Atualização a Quente (Sem Reiniciar)
Quando serviço de proxy reverso está em execução, frontend chamando `update_model_mapping` fará backend imediatamente escrever `custom_mapping` no `RwLock` na memória, e também salvará na configuração persistente (origem: `src-tauri/src/commands/proxy.rs`; `src-tauri/src/proxy/server.rs`).
:::

## Siga-me

### Passo 1: Na Página API Proxy Encontre o Cartão "Roteamento de Modelo"

**Por Que**
A entrada de configuração de roteamento de modelo está na UI; você não precisa editar manualmente arquivo de configuração.

Abra Antigravity Tools -> página `API Proxy`, role para baixo.

**Você Deve Ver**: Um cartão com título semelhante a "Centro de Roteamento de Modelo", canto superior direito tem dois botões: "Aplicar Mapeamento Preset" e "Resetar Mapeamento" (origem: `src/pages/ApiProxy.tsx`).

### Passo 2: Adicione Um "Mapeamento Exato" (Mais Controlável)

**Por Que**
Mapeamento exato tem prioridade mais alta, adequado para "eu só quero este nome de modelo cair neste modelo físico".

Na área "Adicionar Mapeamento":

- Original preencha nome de modelo que você quer expor externamente, por exemplo `gpt-4o`
- Target na caixa suspensa selecione um modelo alvo, por exemplo `gemini-3-flash`

Clique Add.

**Você Deve Ver**: Na lista de mapeamento aparece `gpt-4o -> gemini-3-flash`, e pop-up de sucesso ao salvar.

### Passo 3: Adicione Um "Mapeamento Curinga" (Cobertura em Lote)

**Por Que**
Quando você tem um monte de nomes de modelo versionados (por exemplo `gpt-4-turbo`, `gpt-4-1106-preview`), usar curinga pode economizar muito configuration repetitiva.

Adicione outro mapeamento:

- Original: `gpt-4*`
- Target: `gemini-3-pro-high`

**Você Deve Ver**: Na lista aparece `gpt-4* -> gemini-3-pro-high`.

::: warning "Buraco de Prioridade" de Regras
Quando `gpt-4o` simultaneamente atende regra exata `gpt-4o` e regra curinga `gpt-4*`, o backend primeiro seguirá correspondência exata (origem: `src-tauri/src/proxy/common/model_mapping.rs`).
:::

### Passo 4: Aplique Regras Preset com Um Clique (Compatibilização Rápida)

**Por Que**
Se seu objetivo principal é "adaptar rapidamente nomes de modelo comuns OpenAI/Claude", preset pode ajudar você preencher diretamente um lote de regras curinga.

Clique em "Aplicar Mapeamento Preset".

**Você Deve Ver**: Lista adiciona múltiplas regras, contendo conteúdo semelhante abaixo (origem: `src/pages/ApiProxy.tsx`):

```json
{
  "gpt-4*": "gemini-3-pro-high",
  "gpt-4o*": "gemini-3-flash",
  "gpt-3.5*": "gemini-2.5-flash",
  "o1-*": "gemini-3-pro-high",
  "o3-*": "gemini-3-pro-high",
  "claude-3-5-sonnet-*": "claude-sonnet-4-5",
  "claude-3-opus-*": "claude-opus-4-5-thinking",
  "claude-opus-4-*": "claude-opus-4-5-thinking",
  "claude-haiku-*": "gemini-2.5-flash",
  "claude-3-haiku-*": "gemini-2.5-flash"
}
```

### Passo 5: Use `X-Mapped-Model` para Verificar Se Roteamento Entrou em Vigor

**Por Que**
Você quer confirmar "configuração entrou", mais quer confirmar "solicitação realmente seguiu esta regra". O meio mais simples é ver `X-Mapped-Model`.

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

```powershell [Windows]
$resp = Invoke-WebRequest "http://127.0.0.1:8045/v1/chat/completions" -Method Post -ContentType "application/json" -Body '{
  "model": "gpt-4o",
  "messages": [{"role": "user", "content": "hi"}]
}'
$resp.Headers["X-Mapped-Model"]
```

:::

**Você Deve Ver**: Nos headers de resposta há `X-Mapped-Model: ...`. Se no passo 2 você mapeou `gpt-4o` exatamente para `gemini-3-flash`, aqui você deve ver valor correspondente (escrita de header de resposta veja `src-tauri/src/proxy/handlers/openai.rs`).

### Passo 6: Quando Precisa Voltar ao "Mapeamento Padrão Puro", Reset custom_mapping

**Por Que**
Ao solucionar problemas, frequentemente você quer primeiro excluir "influência de regras personalizadas". Limpar `custom_mapping` é o meio mais direto de rollback.

Clique em "Resetar Mapeamento".

**Você Deve Ver**: Lista de mapeamento esvaziada; depois ao solicitar, se não atingir regra personalizada, irá para mapeamento padrão do sistema (origem: `src/pages/ApiProxy.tsx`; `src-tauri/src/proxy/common/model_mapping.rs`).

## Pontos de Verificação ✅

- [ ] Você pode adicionar/deletar regras `custom_mapping` na UI
- [ ] Você pode explicar claramente: por que regra exata sobrecarrega regra curinga
- [ ] Você pode usar `curl -i` ou PowerShell para ler `X-Mapped-Model`

## Lembrete de Armadilhas

| Cenário | O Que Você Pode Fazer (❌) | Recomendado (✓) |
| --- | --- | --- |
| Curinga não entrou em vigor | Escreveu `GPT-4*` esperando corresponder `gpt-4-turbo` | Use minúsculas `gpt-4*`; correspondência curinga backend é sensível a maiúsculas/minúsculas |
| Dois curingas podem corresponder | Escreveu simultaneamente `gpt-*` e `gpt-4*`, incerto qual irá | Faça regra mais específica mais "longa", garanta seus caracteres não `*` são mais |
| Regras parecem corretas, mas ainda não mudou | Apenas olhar corpo de resposta, não headers de resposta | Use `curl -i` para confirmar `X-Mapped-Model` (este é resultado explicitamente retornado pelo backend) |
| Duas Regras "Mesmo Nível de Especificidade" | Escreveu dois curingas, quantidade de caracteres não `*` é igual | Evite este tipo de configuração; comentário no código-fonte explica que neste caso resultado depende de ordem de iteração de `HashMap`, pode ser instável (origem: `src-tauri/src/proxy/common/model_mapping.rs`) |

## Resumo da Lição

- `proxy.custom_mapping` é sua entrada principal para controlar "nome de modelo externo → modelo físico"
- Prioridade de roteamento backend: correspondência exata > correspondência curinga (mais específico tem prioridade) > mapeamento padrão do sistema
- `X-Mapped-Model` é o meio de verificação mais confiável, ao solucionar problemas priorize olhá-lo

## Próximo Passo

> Na próxima lição continuaremos ver **Governança de Cota: Combo de Proteção de Cota + Smart Warmup** (capítulo correspondente: `advanced-quota`).

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para Expandir e Ver Localização do Código-fonte</strong></summary>

> Última Atualização: 2026-01-23

| Função | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Campo de Configuração: `proxy.custom_mapping` (tipo frontend) | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L6-L20) | 6-20 |
| UI: escrever/resetar/preset (chamar `update_model_mapping`) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L371-L475) | 371-475 |
| UI: cartão de roteamento de modelo (aplicar mapeamento preset / resetar mapeamento / lista e formulário de adição) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1762-L1931) | 1762-1931 |
| Comando backend: atualização a quente e persistência de `custom_mapping` | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L344-L365) | 344-365 |
| Estado do servidor: `custom_mapping` salvo com `RwLock<HashMap<..>>` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L16-L53) | 16-53 |
| Algoritmo de roteamento: exato > curinga (mais específico tem prioridade) > mapeamento padrão | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
| Correspondência curinga: suporta múltiplos `*`, e sensível a maiúsculas/minúsculas | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L134-L178) | 134-178 |
| Calcular `mapped_model` na solicitação (exemplo: handler OpenAI) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L154-L159) | 154-159 |
| Header de resposta retornado `X-Mapped-Model` (exemplo: handler OpenAI) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L310-L334) | 310-334 |

**Funções Chave**:
- `resolve_model_route(original_model, custom_mapping)`: entrada principal de roteamento de modelo (veja `src-tauri/src/proxy/common/model_mapping.rs`)

</details>
