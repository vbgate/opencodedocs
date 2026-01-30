---
title: "Logs de Depuração: Diagnosticando Problemas e Monitorando Status | opencode-antigravity-auth"
sidebarTitle: "Logs para Diagnosticar Problemas"
subtitle: "Logs de Depuração: Diagnosticando Problemas e Monitorando Status"
description: "Aprenda a ativar logs de depuração para diagnosticar problemas do plugin Antigravity Auth. Inclui níveis de log, interpretação de conteúdo, configuração por variáveis de ambiente e gerenciamento de arquivos de log."
tags:
  - "advanced"
  - "debug"
  - "logging"
  - "troubleshooting"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# Logs de Depuração: Diagnosticando Problemas e Monitorando Status

## O que Você Vai Aprender

- Ativar logs de depuração para registrar detalhes completos de requisições e respostas
- Compreender diferentes níveis de log e seus cenários de uso
- Interpretar conteúdo dos logs para identificar rapidamente a causa raiz dos problemas
- Usar variáveis de ambiente para ativar depuração temporária sem modificar arquivos de configuração
- Gerenciar arquivos de log para evitar consumo excessivo de disco

## Onde Você Está

Ao encontrar problemas, você pode:

- Receber mensagens de erro vagas sem saber a causa específica
- Não saber se a requisição chegou à API Antigravity
- Suspeitar de problemas na seleção de conta, limitação de taxa ou conversão de requisição
- Não conseguir fornecer informações valiosas de diagnóstico ao pedir ajuda

## Quando Usar

Logs de depuração são adequados para os seguintes cenários:

| Cenário | Necessário | Motivo |
|---|---|---|
| Diagnosticar limitação de taxa 429 | ✅ Necessário | Ver qual conta e qual modelo está limitado |
| Diagnosticar falha de autenticação | ✅ Necessário | Verificar atualização de token, fluxo OAuth |
| Diagnosticar problemas de conversão de requisição | ✅ Necessário | Comparar requisição original com a convertida |
| Diagnosticar estratégia de seleção de conta | ✅ Necessário | Ver como o plugin seleciona contas |
| Monitorar status de operação diária | ✅ Necessário | Estatísticas de frequência de requisições, taxas de sucesso/falha |
| Execução de longo prazo | ⚠️ Cuidado | Logs crescem continuamente, precisam de gerenciamento |

::: warning Pré-requisitos
Antes de iniciar este tutorial, certifique-se de ter:
- ✅ Instalado o plugin opencode-antigravity-auth
- ✅ Autenticado com sucesso via OAuth
- ✅ Capacidade de fazer requisições com modelos Antigravity

[Tutorial de Instalação Rápida](../../start/quick-install/) | [Tutorial de Primeira Requisição](../../start/first-request/)
:::

## Conceito Central

Como funciona o sistema de logs de depuração:

1. **Logs Estruturados**: Cada log possui timestamp e etiquetas, facilitando filtragem e análise
2. **Registro em Níveis**:
   - Level 1 (básico): Registra metadados de requisição/resposta, seleção de conta, eventos de limitação de taxa
   - Level 2 (verbose): Registra corpo completo de requisição/resposta (até 50.000 caracteres)
3. **Mascaramento de Segurança**: Oculta automaticamente informações sensíveis (como header Authorization)
4. **Arquivos Independentes**: Cada inicialização cria novo arquivo de log, evitando confusão

**Visão Geral do Conteúdo dos Logs**:

| Tipo de Log | Etiqueta | Exemplo de Conteúdo |
|---|---|---|
| Rastreamento de Requisição | `Antigravity Debug ANTIGRAVITY-1` | URL, headers, preview do body |
| Rastreamento de Resposta | `Antigravity Debug ANTIGRAVITY-1` | Código de status, tempo, body da resposta |
| Contexto da Conta | `[Account]` | Conta selecionada, índice da conta, família de modelo |
| Limitação de Taxa | `[RateLimit]` | Detalhes da limitação, tempo de reset, atraso de retry |
| Identificação de Modelo | `[ModelFamily]` | Análise de URL, extração de modelo, determinação da família |

## Siga os Passos

### Passo 1: Ativar Logs de Depuração Básicos

**Por quê**
Após ativar logs de depuração básicos, o plugin registrará todos os metadados de requisições, incluindo URL, headers, seleção de conta, eventos de limitação de taxa, etc., ajudando a diagnosticar problemas sem vazar dados sensíveis.

**Operação**

Edite o arquivo de configuração do plugin:

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/antigravity.json
```

```powershell [Windows]
notepad %APPDATA%\opencode\antigravity.json
```

:::

Adicione ou modifique a seguinte configuração:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true
}
```

Salve o arquivo e reinicie o OpenCode.

**Você Deverá Ver**:

1. Após iniciar o OpenCode, novos arquivos de log serão gerados no diretório de configuração
2. Formato de nomenclatura dos arquivos de log: `antigravity-debug-YYYY-MM-DDTHH-MM-SS-mmmZ.log`
3. Após fazer qualquer requisição, novos registros aparecerão nos arquivos de log

::: tip Localização dos Arquivos de Log
- **Linux/macOS**: `~/.config/opencode/antigravity-logs/`
- **Windows**: `%APPDATA%\opencode\antigravity-logs\`
:::

### Passo 2: Interpretar o Conteúdo dos Logs

**Por quê**
Compreender o formato e conteúdo dos logs permite localizar problemas rapidamente.

**Operação**

Faça uma requisição de teste e visualize o arquivo de log:

```bash
<!-- macOS/Linux -->
tail -f ~/.config/opencode/antigravity-logs/antigravity-debug-*.log

<!-- Windows PowerShell -->
Get-Content "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" -Wait
```

**Você Deverá Ver**:

```log
[2026-01-23T10:30:15.123Z] [Account] Request: Account 1 (1/2) family=claude
[2026-01-23T10:30:15.124Z] [Antigravity Debug ANTIGRAVITY-1] POST https://cloudcode-pa.googleapis.com/...
[2026-01-23T10:30:15.125Z] [Antigravity Debug ANTIGRAVITY-1] Streaming: yes
[2026-01-23T10:30:15.126Z] [Antigravity Debug ANTIGRAVITY-1] Headers: {"user-agent":"opencode-antigravity-auth/1.3.0","authorization":"[redacted]",...}
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Body Preview: {"model":"google/antigravity-claude-sonnet-4-5",...}
[2026-01-23T10:30:18.456Z] [Antigravity Debug ANTIGRAVITY-1] Response 200 OK (3330ms)
[2026-01-23T10:30:18.457Z] [Antigravity Debug ANTIGRAVITY-1] Response Headers: {"content-type":"application/json",...}
```

**Interpretação dos Logs**:

1. **Timestamp**: `[2026-01-23T10:30:15.123Z]` - Formato ISO 8601, precisão de milissegundos
2. **Seleção de Conta**: `[Account]` - O plugin selecionou a conta 1, total de 2 contas, família de modelo claude
3. **Início da Requisição**: `Antigravity Debug ANTIGRAVITY-1` - ID da requisição é 1
4. **Método da Requisição**: `POST https://...` - Método HTTP e URL de destino
5. **Streaming**: `Streaming: yes/no` - Se usa resposta SSE em stream
6. **Headers da Requisição**: `Headers: {...}` - Oculta automaticamente Authorization (mostra `[redacted]`)
7. **Body da Requisição**: `Body Preview: {...}` - Conteúdo da requisição (máximo 12.000 caracteres, truncado se exceder)
8. **Status da Resposta**: `Response 200 OK (3330ms)` - Código de status HTTP e tempo gasto
9. **Headers da Resposta**: `Response Headers: {...}` - Headers da resposta

### Passo 3: Ativar Logs Detalhados (Verbose)

**Por quê**
Logs detalhados registram o corpo completo da requisição/resposta (até 50.000 caracteres), adequados para diagnosticar problemas profundos de conversão de requisição, análise de resposta, etc.

**Operação**

Modifique a configuração para o nível verbose:

```json
{
  "debug": true,
  "OPENCODE_ANTIGRAVITY_DEBUG": "2"
}
```

Ou use variáveis de ambiente (recomendado, não precisa modificar arquivo de configuração):

::: code-group

```bash [macOS/Linux]
export OPENCODE_ANTIGRAVITY_DEBUG=2
opencode
```

```powershell [Windows]
$env:OPENCODE_ANTIGRAVITY_DEBUG="2"
opencode
```

:::

**Você Deverá Ver**:

1. O arquivo de log mostrará o corpo completo da requisição/resposta (não mais preview truncado)
2. Para respostas grandes, mostra os primeiros 50.000 caracteres e marca o número de caracteres truncados

```log
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Response Body (200): {"id":"msg_...","type":"message","role":"assistant",...}
```

::: warning Aviso de Espaço em Disco
Logs detalhados registram conteúdo completo de requisição/resposta, podendo fazer os arquivos de log crescerem rapidamente. Após a depuração, certifique-se de desativar o modo verbose.
:::

### Passo 4: Diagnosticar Problemas de Limitação de Taxa

**Por quê**
Limitação de taxa (erro 429) é um dos problemas mais comuns, os logs podem mostrar exatamente qual conta, qual modelo está limitado, e quanto tempo esperar.

**Operação**

Faça múltiplas requisições concorrentes para acionar a limitação de taxa:

```bash
<!-- macOS/Linux -->
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait
```

Visualize eventos de limitação de taxa nos logs:

```bash
grep "RateLimit" ~/.config/opencode/antigravity-logs/antigravity-debug-*.log
```

**Você Deverá Ver**:

```log
[2026-01-23T10:30:20.123Z] [RateLimit] 429 on Account 1 family=claude retryAfterMs=60000
[2026-01-23T10:30:20.124Z] [RateLimit] message: Resource has been exhausted
[2026-01-23T10:30:20.125Z] [RateLimit] quotaResetTime: 2026-01-23T10:31:00.000Z
[2026-01-23T10:30:20.126Z] [Account] Request: Account 2 (2/2) family=claude
[2026-01-23T10:30:20.127Z] [RateLimit] snapshot family=claude Account 1=wait 60s | Account 2=ready
```

**Interpretação dos Logs**:

1. **Detalhes da Limitação**: `429 on Account 1 family=claude retryAfterMs=60000`
   - Conta 1 (família de modelo claude) encontrou erro 429
   - Precisa esperar 60.000 milissegundos (60 segundos) antes de tentar novamente
2. **Mensagem de Erro**: `message: Resource has been exhausted` - Cota esgotada
3. **Tempo de Reset**: `quotaResetTime: 2026-01-23T10:31:00.000Z` - Horário exato de reset da cota
4. **Mudança de Conta**: O plugin automaticamente muda para a conta 2
5. **Snapshot Global**: `snapshot` - Mostra o status de limitação de todas as contas

### Passo 5: Personalizar Diretório de Logs

**Por quê**
Por padrão, arquivos de log são armazenados no diretório `~/.config/opencode/antigravity-logs/`. Se desejar armazenar os logs em outro local (por exemplo, no diretório do projeto), você pode personalizar o diretório de logs.

**Operação**

Adicione a configuração `log_dir` no arquivo de configuração:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true,
  "log_dir": "/caminho/para/seus/logs/personalizados"
}
```

Ou use variáveis de ambiente:

```bash
export OPENCODE_ANTIGRAVITY_LOG_DIR="/caminho/para/seus/logs/personalizados"
opencode
```

**Você Deverá Ver**:

1. Arquivos de log são escritos no diretório especificado
2. Se o diretório não existir, o plugin criará automaticamente
3. O formato de nomenclatura dos arquivos de log permanece inalterado

::: tip Sugestões de Caminho
- Depuração de desenvolvimento: Armazenar no diretório raiz do projeto (`.logs/`)
- Ambiente de produção: Armazenar no diretório de logs do sistema (`/var/log/` ou `~/Library/Logs/`)
- Depuração temporária: Armazenar no diretório `/tmp/`, facilitando a limpeza
:::

### Passo 6: Limpar e Gerenciar Arquivos de Log

**Por quê**
Em execução de longo prazo, os arquivos de log crescerão continuamente, ocupando muito espaço em disco. A limpeza periódica é necessária.

**Operação**

Visualize o tamanho do diretório de logs:

```bash
<!-- macOS/Linux -->
du -sh ~/.config/opencode/antigravity-logs/

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\" | Measure-Object -Property Length -Sum
```

Limpe logs antigos:

```bash
<!-- macOS/Linux -->
find ~/.config/opencode/antigravity-logs/ -name "antigravity-debug-*.log" -mtime +7 -delete

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item
```

**Você Deverá Ver**:

1. O tamanho do diretório de logs diminuiu
2. Apenas arquivos de log dos últimos 7 dias são mantidos

::: tip Limpeza Automatizada
Você pode adicionar scripts de limpeza ao cron (Linux/macOS) ou Agendador de Tarefas (Windows) para executar limpezas periodicamente.
:::

## Checklist ✅

Após concluir as etapas acima, você deve ser capaz de:

- [ ] Ativar logs de depuração através do arquivo de configuração
- [ ] Usar variáveis de ambiente para ativar depuração temporária
- [ ] Interpretar conteúdo dos logs para encontrar detalhes de requisição/resposta
- [ ] Compreender a função de diferentes níveis de log
- [ ] Personalizar o diretório de logs
- [ ] Gerenciar e limpar arquivos de log

## Dicas de Solução de Problemas

### Arquivos de Log Crescendo Continuamente

**Sintoma**: Espaço em disco sendo consumido por arquivos de log

**Causa**: Depuração ativada por longo período, especialmente em modo verbose

**Solução**:

1. Após concluir a depuração, desative imediatamente `debug: false`
2. Configure scripts de limpeza periódica (como no Passo 6)
3. Monitore o tamanho do diretório de logs, configure alertas de limiar

### Arquivos de Log Não Encontrados

**Sintoma**: `debug: true` ativado, mas diretório de logs vazio

**Causa**:
- Caminho do arquivo de configuração incorreto
- Problema de permissão (não consegue escrever no diretório de logs)
- Variável de ambiente sobrescreveu a configuração

**Solução**:

1. Confirme que o caminho do arquivo de configuração está correto:
   ```bash
   # Encontrar arquivo de configuração
   find ~/.config/opencode/ -name "antigravity.json" 2>/dev/null
   ```
2. Verifique se a variável de ambiente sobrescreveu a configuração:
   ```bash
   echo $OPENCODE_ANTIGRAVITY_DEBUG
   ```
3. Verifique as permissões do diretório de logs:
   ```bash
   ls -la ~/.config/opencode/antigravity-logs/
   ```

### Conteúdo dos Logs Incompleto

**Sintoma**: Corpo da requisição/resposta não visível nos logs

**Causa**: Usando nível padrão basic (Level 1), apenas registra preview do body (máximo 12.000 caracteres)

**Solução**:

1. Ative nível verbose (Level 2):
   ```json
   {
     "OPENCODE_ANTIGRAVITY_DEBUG": "2"
   }
   ```
2. Ou use variável de ambiente:
   ```bash
   export OPENCODE_ANTIGRAVITY_DEBUG=2
   ```

### Vazamento de Informações Sensíveis

**Sintoma**: Preocupação de que os logs contenham dados sensíveis (como token de Authorization)

**Causa**: O plugin oculta automaticamente o header `Authorization`, mas outros headers podem conter informações sensíveis

**Solução**:

1. O plugin já oculta automaticamente o header `Authorization` (mostra `[redacted]`)
2. Ao compartilhar logs, verifique se há outros headers sensíveis (como `Cookie`, `Set-Cookie`)
3. Se encontrar informações sensíveis, remova manualmente antes de compartilhar

### Arquivo de Log Não Pode Ser Aberto

**Sintoma**: Arquivo de log bloqueado por outro processo, não consegue visualizar

**Causa**: OpenCode está escrevendo no arquivo de log

**Solução**:

1. Use o comando `tail -f` para visualizar logs em tempo real (não bloqueia o arquivo)
2. Se precisar editar, feche o OpenCode primeiro
3. Use o comando `cat` para visualizar conteúdo (não bloqueia o arquivo)

## Resumo da Aula

- Logs de depuração são ferramentas poderosas para diagnosticar problemas, podendo registrar detalhes de requisição/resposta, seleção de conta, eventos de limitação de taxa
- Existem dois níveis de log: basic (Level 1) e verbose (Level 2)
- Variáveis de ambiente podem ativar depuração temporária sem modificar arquivos de configuração
- O plugin oculta automaticamente informações sensíveis (como header Authorization)
- Arquivos de log precisam ser limpos periodicamente em execução de longo prazo

## Próxima Aula

> Na próxima aula vamos aprender **[Tratamento de Limitação de Taxa](../rate-limit-handling/)**.
>
> Você vai aprender:
> - Mecanismos de detecção de limitação de taxa e estratégias de retry
> - Como funciona o algoritmo de backoff exponencial
> - Como configurar tempo máximo de espera e número de tentativas
> - Tratamento de limitação de taxa em cenários de múltiplas contas

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
|---|---|---|
| Módulo Debug | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | Completo |
| Inicialização da Depuração | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L98-L118) | 98-118 |
| Rastreamento de Requisição | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L189-L212) | 189-212 |
| Registro de Resposta | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L217-L250) | 217-250 |
| Mascaramento de Headers | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L255-L270) | 255-270 |
| Log de Limitação de Taxa | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L354-L396) | 354-396 |
| Schema de Configuração | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L64-L72) | 64-72 |

**Constantes Principais**:

| Nome da Constante | Valor | Descrição |
|---|---|---|
| `MAX_BODY_PREVIEW_CHARS` | 12000 | Comprimento do preview do body no nível básico |
| `MAX_BODY_VERBOSE_CHARS` | 50000 | Comprimento do preview do body no nível verbose |
| `DEBUG_MESSAGE_PREFIX` | `"[opencode-antigravity-auth debug]"` | Prefixo dos logs de depuração |

**Funções Principais**:

- `initializeDebug(config)`: Inicializa estado de depuração, lê configuração e variáveis de ambiente
- `parseDebugLevel(flag)`: Analisa string de nível de depuração ("0"/"1"/"2"/"true"/"verbose")
- `getLogsDir(customLogDir?)`: Obtém diretório de logs, suporta caminho personalizado
- `createLogFilePath(customLogDir?)`: Gera caminho de arquivo de log com timestamp
- `startAntigravityDebugRequest(meta)`: Inicia rastreamento de requisição, registra metadados da requisição
- `logAntigravityDebugResponse(context, response, meta)`: Registra detalhes da resposta
- `logAccountContext(label, info)`: Registra contexto de seleção de conta
- `logRateLimitEvent(...)`: Registra evento de limitação de taxa
- `maskHeaders(headers)`: Mascara headers sensíveis (Authorization)

**Itens de Configuração** (de schema.ts):

| Item de Configuração | Tipo | Padrão | Descrição |
|---|---|---|---|
| `debug` | boolean | `false` | Ativar logs de depuração |
| `log_dir` | string? | undefined | Diretório de logs personalizado |

**Variáveis de Ambiente**:

| Variável de Ambiente | Valor | Descrição |
|---|---|---|
| `OPENCODE_ANTIGRAVITY_DEBUG` | "0"/"1"/"2"/"true"/"verbose" | Sobrescreve configuração debug, controla nível de log |
| `OPENCODE_ANTIGRAVITY_LOG_DIR` | string | Sobrescreve configuração log_dir, especifica diretório de logs |

</details>
