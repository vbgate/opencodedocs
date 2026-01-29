---
title: "Use OpenAI Images para Chamar Imagen3: Mapeamento de Parâmetros | Antigravity"
sidebarTitle: "Chame conforme hábito OpenAI"
subtitle: "Geração de Imagens Imagen3: Mapeamento Automático de Parâmetros size/quality de OpenAI Images"
description: "Aprenda usar API OpenAI Images para chamar Imagen3, domine mapeamento de parâmetros. size(largura x altura) controla proporção, quality controla qualidade, suporta retorno b64_json e url."
tags:
  - "Imagen 3"
  - "OpenAI Images API"
  - "Geração de Imagens"
  - "Gemini"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-security"
duration: 12
order: 4
---

# Geração de Imagens Imagen3: Mapeamento Automático de Parâmetros size/quality de OpenAI Images

Quer usar API OpenAI Images conforme hábito para chamar Imagen3? O proxy reverso local do Antigravity Tools fornece `/v1/images/generations`, e mapeia automaticamente `size` / `quality` para configurações de proporção e resolução exigidas pelo Imagen3.

## O que você poderá fazer após completar

- Usar `POST /v1/images/generations` gerar imagens Imagen3, sem mudar hábitos de chamada de cliente/SDK OpenAI existentes
- Usar `size: "WIDTHxHEIGHT"` controlar estavelmente `aspectRatio` (16:9, 9:16, etc)
- Usar `quality: "standard" | "medium" | "hd"` controlar `imageSize` (padrão/2K/4K)
- Entender retorno de `b64_json` / `url(data:...)`, e através de cabeçalhos de resposta confirmar conta realmente usada

## Seu dilema atual

Você pode ter encontrado estes casos:

- Cliente só sabe chamar `/v1/images/generations` do OpenAI, mas você quer usar Imagen3
- Mesmo prompt, às vezes é quadrado, às vezes paisagem, controle de proporção instável
- Você escreveu `size` como `16:9`, resultado ainda é 1:1 (e não sabe por que)

## Quando usar esta técnica

- Você já usando proxy reverso local do Antigravity Tools, quer "geração de imagem" também ir pelo mesmo gateway unificado
- Você quer que ferramentas suportando API OpenAI Images (Cherry Studio, Kilo Code, etc) gerem diretamente imagens Imagen3

## 🎒 Preparação antes de começar

::: warning Verificação prévia
Esta lição assume você já conseguir iniciar proxy reverso local, e saber seu Base URL (ex: `http://127.0.0.1:<port>`). Se ainda não rodou, primeiro complete "Iniciar Proxy Reverso Local e Conectar Primeiro Cliente".
:::

::: info Lembrete de autenticação
Se você habilitou `proxy.auth_mode` (ex: `strict` / `all_except_health`), ao chamar `/v1/images/generations` precisa trazer:

- `Authorization: Bearer <proxy.api_key>`
:::

## Ideia principal

### O que este "mapeamento automático" faz afinal?

**Mapeamento OpenAI Images do Imagen3** significa: você ainda envia `prompt/size/quality` segundo API OpenAI Images, proxy analisa `size` como proporção padrão (como 16:9), analisa `quality` como faixa de resolução (2K/4K), depois usa formato de solicitação interno para chamar upstream `gemini-3-pro-image`.

::: info Explicação de modelo
`gemini-3-pro-image` é nome de modelo de geração de imagens Imagen3 do Google (vem de documentação README do projeto). Código-fonte por padrão usa este modelo para gerar imagens.
:::

### 1) size -> aspectRatio (cálculo dinâmico)

- Proxy tratará `size` como `WIDTHxHEIGHT` para analisar, depois baseado em proporção largura/altura corresponder à proporção padrão.
- Se análise de `size` falhar (ex: não separado por `x`, ou números ilegais), voltará a `1:1`.

### 2) quality -> imageSize (faixa de resolução)

- `quality: "hd"` -> `imageSize: "4K"`
- `quality: "medium"` -> `imageSize: "2K"`
- `quality: "standard"` (ou outros valores) -> não define `imageSize` (mantém padrão)

### 3) n multi-imagens é "enviar n vezes concorrentemente"

Esta implementação não depende de `candidateCount > 1` do upstream, mas dividirá `n` vezes geração em solicitações concorrentes, depois mesclar resultados em retorno no estilo OpenAI `data[]`.

## Siga-me

### Passo 1: Confirme proxy reverso iniciado (opcional mas altamente recomendado)

**Por que**
Primeiro confirme seu Base URL e modo de autenticação, evitar julgar errado como "falha de geração de imagem".

::: code-group

```bash [macOS/Linux]
 # Verificação (auth_mode=all_except_health também acessível sem autenticação)
 curl -sS http://127.0.0.1:PORT/healthz
```

```powershell [Windows]
 # Verificação (auth_mode=all_except_health também acessível sem autenticação)
 curl.exe -sS http://127.0.0.1:PORT/healthz
```

:::

**Você deve ver**: Retorna JSON, contendo `"status": "ok"`.

### Passo 2: Inicie uma solicitação de geração de imagem mínima utilizável

**Por que**
Primeiro rodar cadeia com menos campos, depois adicionar proporção/qualidade/quantidade e outros parâmetros.

::: code-group

```bash [macOS/Linux]
curl -sS http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n":1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

```powershell [Windows]
curl.exe -sS http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n":1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

:::

**Você deve ver**: Resposta JSON tem array `data`, dentro contém campo `b64_json` (conteúdo longo).

### Passo 3: Confirme qual conta você está usando (veja cabeçalhos de resposta)

**Por que**
Geração de imagem também passa por agendamento de pool de contas; ao solucionar problemas, confirmar "exatamente qual conta gerando" é muito crítico.

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

```powershell [Windows]
curl.exe -i http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

:::

**Você deve ver**: Cabeçalhos de resposta contêm `X-Account-Email: ...`.

### Passo 4: Use size para controlar proporção largura/altura (recomendado só usar WIDTHxHEIGHT)

**Por que**
Upstream Imagen3 recebe `aspectRatio` padronizado; você só escrever `size` como um conjunto de larguras/alturas comuns, consegue mapear estavelmente para proporção padrão.

| size que você passa | aspectRatio calculado pelo proxy |
| --- | --- |
| `"1024x1024"` | `1:1` |
| `"1920x1080"` / `"1280x720"` | `16:9` |
| `"1080x1920"` / `"720x1280"` | `9:16` |
| `"800x600"` | `4:3` |
| `"600x800"` | `3:4` |
| `"2560x1080"` | `21:9` |

**Você deve ver**: Proporção de imagem muda conforme `size` muda.

### Passo 5: Use quality para controlar faixa de resolução (standard/medium/hd)

**Por que**
Você não precisa lembrar campos internos do Imagen3, só usar `quality` de OpenAI Images consegue alternar faixa de resolução.

| quality que você passa | imageSize escrito pelo proxy |
| --- | --- |
| `"standard"` | Não define (vai padrão upstream) |
| `"medium"` | `"2K"` |
| `"hd"` | `"4K"` |

**Você deve ver**: `hd` tem mais detalhes (ao mesmo tempo mais lento/consume mais recursos, é comportamento upstream, especificamente baseado em retorno real).

### Passo 6: Decida se quer b64_json ou url

**Por que**
Nesta implementação `response_format: "url"` não vai dar um URL acessível publicamente na rede, mas retorna Data URI `data:<mime>;base64,...`; muitas ferramentas mais adequadas usar diretamente `b64_json`.

| response_format | campo de data[] |
| --- | --- |
| `"b64_json"` (padrão) | `{ "b64_json": "..." }` |
| `"url"` | `{ "url": "data:image/png;base64,..." }` |

## Ponto de verificação ✅

- Você consegue retornar pelo menos 1 imagem com `/v1/images/generations` (`data.length >= 1`)
- Você consegue ver `X-Account-Email` nos cabeçalhos de resposta, e pode reconstituir mesmo problema de conta quando necessário
- Após mudar `size` para `1920x1080`, proporção de imagem se torna paisagem (16:9)
- Após mudar `quality` para `hd`, proxy mapeará para `imageSize: "4K"`

## Aviso sobre armadilhas

### 1) size escrito como 16:9 não vai obter 16:9

Lógica de análise `size` aqui é dividir conforme `WIDTHxHEIGHT`; se `size` não é este formato, voltará diretamente para `1:1`.

| Escrita | Resultado |
| --- | --- |
| ✓ `"1920x1080"` | 16:9 |
| ❌ `"16:9"` | volta 1:1 |

### 2) Não abriu autenticação mas trouxe Authorization, também não causará sucesso

Autenticação é problema "se necessário ou não":

- `proxy.auth_mode=off`: trazer ou não `Authorization` tudo bem
- `proxy.auth_mode=strict/all_except_health`: não trazer `Authorization` será rejeitado

### 3) Quando n > 1, pode aparecer "sucesso parcial"

Implementação é solicitar concorrentemente e mesclar resultados: se parte de solicitações falhar, ainda pode retornar parte de imagens, e registrará causa de falha nos logs.

## Resumo da lição

- Usar `/v1/images/generations` chamar Imagen3, chave é lembrar: `size` usa `WIDTHxHEIGHT`, `quality` usa `standard/medium/hd`
- `size` controla `aspectRatio`, `quality` controla `imageSize(2K/4K)`
- `response_format=url` retorna Data URI, não URL de rede pública

## Próximo aviso de lição

> Na próxima lição aprendemos **[Transcrição de Áudio: Limitações de /v1/audio/transcriptions e Tratamento de Grande Payload](../audio/)**.

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
|---------------|---------------------|-------|
| Expor rota OpenAI Images | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L123-L146) | 123-146 |
| Endpoint de geração de Images: analisar prompt/size/quality + montar resposta OpenAI | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1104-L1333) | 1104-1333 |
| Análise e mapeamento size/quality (size->aspectRatio, quality->imageSize) | [`src-tauri/src/proxy/mappers/common_utils.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/common_utils.rs#L19-L222) | 19-222 |
| Declaração OpenAIRequest size/quality (para compatibilidade de camada de protocolo) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L6-L38) | 6-38 |
| Conversão de solicitação OpenAI->Gemini: passar size/quality para função de análise unificada | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L19-L27) | 19-27 |

**Campos principais (do código-fonte)**:
- `size`: analisado como `aspectRatio` conforme `WIDTHxHEIGHT`
- `quality`: `hd -> 4K`, `medium -> 2K`, outros não definem

</details>
