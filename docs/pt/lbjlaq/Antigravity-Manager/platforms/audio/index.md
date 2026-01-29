---
title: "API de Áudio: Endpoint Compatível Whisper | Antigravity-Manager"
subtitle: "API de Áudio: Endpoint Compatível Whisper"
sidebarTitle: "5 Minutos Áudio para Texto"
description: "Aprenda uso da API de transcrição de áudio do Antigravity-Manager. Domine suporte a 6 formatos, limite de 15MB e método de tratamento de grande payload, implemente rapidamente áudio para texto."
tags:
  - "Transcrição de Áudio"
  - "OpenAI"
  - "Whisper"
  - "Gemini"
  - "API Proxy"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 5
---

# Transcrição de Áudio: Limitações de /v1/audio/transcriptions e Tratamento de Grande Payload

Você pode usar **endpoint de transcrição de áudio `POST /v1/audio/transcriptions`** converter arquivo de áudio em texto. Parece API Whisper do OpenAI, mas no gateway local fará verificação de formato, limite de tamanho de arquivo, e enviará áudio como `inlineData` do Gemini para solicitação upstream.

## O que você poderá fazer após completar

- Usar curl / OpenAI SDK chamar `POST /v1/audio/transcriptions` converter áudio em `{"text":"..."}`
- Esclarecer suporte a 6 formatos de áudio, e **limite rígido de 15MB** na forma real de erro
- Saber valores padrão de `model` / `prompt` e método de passagem (não adivinhar regras upstream)
- Localizar solicitação de áudio no Proxy Monitor, e entender origem de `[Binary Request Data]`

## Seu dilema atual

Você quer converter gravação de reunião, podcast ou chamada de serviço ao cliente em texto, mas frequentemente fica preso nestes pontos:

- Diferentes ferramentas têm formato de áudio/shape de interface diferentes, script e SDK difícil de reutilizar
- Ao falhar upload só vê "bad request/erro de gateway", não sabe se formato errado ou arquivo muito grande
- Você quer colocar transcrição no "gateway local" do Antigravity Tools para agendamento e monitoramento unificados, mas não sabe até que ponto compatível

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
- Você já rodou [Iniciar Proxy Reverso Local e Conectar Primeiro Cliente](/pt/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/), e sabe porta de proxy reverso (esta página usa `8045` como exemplo)
- Você já rodou [Adicionar Contas](/pt/lbjlaq/Antigravity-Manager/start/add-account/), tem pelo menos 1 conta disponível
:::

## O que é endpoint de transcrição de áudio (/v1/audio/transcriptions）？

**Endpoint de transcrição de áudio** é uma rota compatível Whisper do OpenAI que Antigravity Tools expõe. Cliente usa `multipart/form-data` fazer upload de arquivo de áudio, servidor verifica extensão e tamanho, converte áudio em Base64 `inlineData`, depois chama upstream `generateContent`, finalmente só retorna um campo `text`.

## Visão rápida de endpoint e limitações

| Item | Conclusão | Evidência de código |
| --- | --- | --- |
| Rota de entrada | `POST /v1/audio/transcriptions` | `src-tauri/src/proxy/server.rs` registra rota para `handlers::audio::handle_audio_transcription` |
| Formatos suportados | Reconhecidos por extensão de arquivo: `mp3/wav/m4a/ogg/flac/aiff(aif)` | `src-tauri/src/proxy/audio/mod.rs` `detect_mime_type()` |
| Tamanho de arquivo | **Limite rígido 15MB** (acima retorna 413 + mensagem de erro de texto) | `src-tauri/src/proxy/audio/mod.rs` `exceeds_size_limit()`; `src-tauri/src/proxy/handlers/audio.rs` |
| limite total de body de proxy reverso | Camada Axum permite até 100MB | `src-tauri/src/proxy/server.rs` `DefaultBodyLimit::max(100 * 1024 * 1024)` |
| Parâmetros padrão | `model="gemini-2.0-flash-exp"`; `prompt="Generate a transcript of speech."` | `src-tauri/src/proxy/handlers/audio.rs` |

## Siga-me

### Passo 1: Confirme gateway rodando (/healthz）

**Por que**
Primeiro elimine problemas como porta errada/serviço não iniciado.

::: code-group

```bash [macOS/Linux]
curl -s http://127.0.0.1:8045/healthz
```

```powershell [Windows]
curl http://127.0.0.1:8045/healthz
```

:::

**Você deve ver**: Algo como `{"status":"ok"}` JSON.

### Passo 2: Prepare um arquivo de áudio não excedendo 15MB

**Por que**
Servidor fará verificação de 15MB no processador, acima retornará diretamente 413.

::: code-group

```bash [macOS/Linux]
ls -lh audio.mp3
```

```powershell [Windows]
Get-Item audio.mp3 | Select-Object Length
```

:::

**Você deve ver**: Tamanho de arquivo não excede `15MB`.

### Passo 3: Use curl chamar /v1/audio/transcriptions

**Por que**
curl é mais direto, conveniente para você primeiro validar forma de protocolo e mensagem de erro.

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3" \
  -F "model=gemini-2.0-flash-exp" \
  -F "prompt=Generate a transcript of speech."
```

**Você deve ver**: Retorna JSON, só tem um campo `text`.

```json
{
  "text": "..."
}
```

### Passo 4: Use OpenAI Python SDK chamar

```python
from openai import OpenAI

client = OpenAI(
  base_url="http://127.0.0.1:8045/v1",
  api_key="your-proxy-api-key"  # Se habilitou autenticação
)

audio_file = open("audio.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="gemini-2.0-flash-exp",
  file=audio_file
)

print(transcript.text)
```

**Você deve ver**: `print(transcript.text)` sai um trecho de texto transcrito.

## Formatos de áudio suportados

Antigravity Tools decide tipo MIME por extensão de arquivo (não por detecção de conteúdo de arquivo).

| Formato | Tipo MIME | Extensão |
| --- | --- | --- |
| MP3 | `audio/mp3` | `.mp3` |
| WAV | `audio/wav` | `.wav` |
| AAC (M4A) | `audio/aac` | `.m4a` |
| OGG | `audio/ogg` | `.ogg` |
| FLAC | `audio/flac` | `.flac` |
| AIFF | `audio/aiff` | `.aiff`, `.aif` |

::: warning Formatos não suportados
Se extensão não está na tabela, retornará `400`, corpo de resposta é um texto, ex: `Formato de áudio não suportado: txt`.
:::

## Ponto de verificação ✅

- [ ] Corpo de retorno é `{"text":"..."}` (sem estruturas adicionais como `segments`, `verbose_json`)
- [ ] Cabeçalhos de resposta contêm `X-Account-Email` (marca conta realmente usada)
- [ ] Na página "Monitor" consegue ver este registro de solicitação

## Tratamento de grande payload: por que você vê 100MB, mas ainda fica preso em 15MB

Servidor na camada Axum aumentou limite de corpo de solicitação para 100MB (evitar algumas solicitações grandes serem rejeitadas diretamente pelo framework), mas processador de transcrição de áudio fará adicionalmente uma **verificação de 15MB**.

Ou seja:

- `15MB < arquivo <= 100MB`: solicitação consegue entrar no processador, mas retornará `413` + mensagem de erro de texto
- `arquivo > 100MB`: solicitação pode falhar diretamente na camada framework (não garante forma específica de erro)

### O que você verá ao exceder 15MB

Retorna código de status `413 Payload Too Large`, corpo de resposta é um texto (não JSON), conteúdo similar:

```
Arquivo de áudio muito grande (18,5 MB). Suporta máximo 15 MB (aprox 16 minutos MP3). Sugestão: 1) Comprimir qualidade de áudio 2) Upload segmentado
```

### Dois métodos divisíveis executáveis

1) Comprimir qualidade de áudio (converter WAV para MP3 menor)

```bash
ffmpeg -i input.wav -b:a 64k -ac 1 output.mp3
```

2) Segmentar (cortar áudio longo em múltiplos trechos)

```bash
ffmpeg -i long_audio.mp3 -f segment -segment_time 600 -c copy segment_%03d.mp3
```

## Precauções de coleta de logs

### Por que frequentemente não vê corpo de solicitação real no Monitor

Middleware Monitor lerá primeiro **corpo de solicitação POST** fazer registro de log:

- Se corpo de solicitação puder ser analisado como texto UTF-8, registra texto original
- Caso contrário registra como `[Binary Request Data]`

Transcrição de áudio usa `multipart/form-data`, dentro tem conteúdo binário de áudio, então facilmente cai no segundo caso.

### O que você deve ver no Monitor

```
URL: /v1/audio/transcriptions
Request Body: [Binary Request Data]
Response Body: {"text":"..."}
```

::: info Explicação de limite de log
No log não vê corpo de áudio, mas você ainda pode usar `status/duration/X-Account-Email` julgar rapidamente: é incompatibilidade de protocolo, arquivo muito grande, ou falha upstream.
:::

## Explicação de parâmetros (não fazer "complemento empírico")

Este endpoint só lê explicitamente 3 campos de formulário:

| Campo | Obrigatório | Valor padrão | Maneira de tratamento |
| --- | --- | --- | --- |
| `file` | ✅ | Nenhum | Deve fornecer; falta retorna `400` + texto `Falta arquivo de áudio` |
| `model` | ❌ | `gemini-2.0-flash-exp` | Passa como string, e participa de obtenção de token (regra específica upstream baseada em resposta real) |
| `prompt` | ❌ | `Generate a transcript of speech.` | Envia como primeiro trecho `text` para upstream, usado para guiar transcrição |

## Aviso sobre armadilhas

### ❌ Erro 1: usou parâmetros curl errados, causando não multipart

```bash
#Erro: usar diretamente -d
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -d "file=@audio.mp3"
```

Prática correta:

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3"
```

### ❌ Erro 2: extensão de arquivo não está na lista suportada

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@document.txt"
```

Prática correta: só fazer upload de arquivo de áudio (`.mp3`, `.wav`, etc).

### ❌ Erro 3: tratar 413 como "gateway quebrou"

`413` aqui geralmente é verificação de 15MB disparou. Primeiro fazer compressão/segmentação, mais rápido que tentativa cega.

## Resumo da lição

- **Endpoint principal**: `POST /v1/audio/transcriptions` (forma compatível Whisper)
- **Suporte de formato**: mp3, wav, m4a, ogg, flac, aiff (aif)
- **Limite de tamanho**: 15MB (acima retorna `413` + mensagem de erro de texto)
- **Comportamento de log**: quando multipart tem conteúdo binário, Monitor mostrará `[Binary Request Data]`
- **Parâmetros principais**: `file` / `model` / `prompt` (valores padrão veja tabela acima)

## Próximo aviso de lição

> Na próxima lição aprendemos **[Endpoint MCP: Expor Web Search/Reader/Vision como Ferramentas Chamáveis](/pt/lbjlaq/Antigravity-Manager/platforms/mcp/)**.
>
> Você aprenderá:
> - Forma de rota de endpoint MCP e estratégia de autenticação
> - Web Search/Web Reader/Vision vai "encaminhamento upstream" ou "ferramenta interna"
> - Quais capacidades são experimentais, não pisar mina em produção

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
|---------------|---------------------|-------|
| Registro de rota (/v1/audio/transcriptions + body limit) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Processador de transcrição de áudio (multipart/15MB/inlineData) | [`src-tauri/src/proxy/handlers/audio.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/audio.rs#L16-L162) | 16-162 |
| Formatos suportados (extensão -> MIME + 15MB) | [`src-tauri/src/proxy/audio/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/audio/mod.rs#L6-L35) | 6-35 |
| Middleware Monitor (Binary Request Data) | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |

**Constantes principais**:
- `MAX_SIZE = 15 * 1024 * 1024`: limite de tamanho de arquivo de áudio (15MB)
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`: limite superior que Monitor lê corpo de solicitação POST (100MB)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`: limite superior que Monitor lê corpo de resposta (100MB)

**Funções principais**:
- `handle_audio_transcription()`: analisar multipart, verificar extensão e tamanho, montar `inlineData` e chamar upstream
- `AudioProcessor::detect_mime_type()`: extensão -> MIME
- `AudioProcessor::exceeds_size_limit()`: verificação 15MB
- `monitor_middleware()`: colocar corpo de solicitação/resposta no Proxy Monitor (só registra completo se UTF-8)

</details>
