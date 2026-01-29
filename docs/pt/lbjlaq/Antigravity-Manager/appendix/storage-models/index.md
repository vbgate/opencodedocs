---
title: "Modelo de Armazenamento: Estrutura de Dados | Antigravity Tools"
sidebarTitle: "Onde estão todos os dados"
subtitle: "Dados e Modelos: Arquivos de Conta, Biblioteca de Estatística SQLite e Métricas de Campo-Chave"
description: "Aprenda a estrutura de armazenamento de dados das Antigravity Tools. Domine localização de accounts.json, arquivos de conta, token_stats.db/proxy_logs.db e significado de campos."
tags:
  - "apêndice"
  - "modelo de dados"
  - "estrutura de armazenamento"
  - "backup"
prerequisite:
  - "start-backup-migrate"
order: 2
---

# Dados e Modelos: Arquivos de Conta, Biblioteca de Estatística SQLite e Métricas de Campo-Chave

## O que você poderá fazer após concluir

- Localizar rapidamente armazenamento de dados de conta, biblioteca de estatística, arquivos de configuração, diretório de logs
- Entender estrutura JSON de arquivos de conta e significado de campos-chave
- Consultar diretamente logs de solicitação de proxy e consumo de Token via SQLite
- Ao fazer backup/migração/solução de problemas, saber quais arquivos olhar

## Seu dilema atual

Quando você precisa:
- **Migrar contas para nova máquina**: não sabe quais arquivos copiar
- **Solução de problemas de conta anômala**: quais campos nos arquivos de conta podem julgar estado da conta
- **Exportar consumo de Token**: quer consultar diretamente do banco de dados, não sabe estrutura da tabela
- **Limpar dados históricos**: preocupa com deletar arquivo errado causando perda de dados

Este apêndice ajudará você a estabelecer cognição completa do modelo de dados.

---

## Estrutura do diretório de dados

Os dados principais das Antigravity Tools são armazenados por padrão no diretório `.antigravity_tools` em "diretório raiz do usuário" (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: warning Primeiro esclareça limites de segurança
Este diretório conterá `refresh_token`/`access_token` e outras informações sensíveis (fonte: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`). Antes de backup/copiar/compartilhar, primeiro confirme que seu ambiente alvo é confiável.
:::

### Onde devo encontrar este diretório?

::: code-group

```bash [macOS/Linux]
## Entrar no diretório de dados
cd ~/.antigravity_tools

## Ou abrir no Finder (macOS)
open ~/.antigravity_tools
```

```powershell [Windows]
## Entrar no diretório de dados
Set-Location "$env:USERPROFILE\.antigravity_tools"

## Ou abrir no Explorador de Arquivos
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### Visão geral da árvore de diretórios

```
~/.antigravity_tools/
├── accounts.json          # Índice de contas (versão 2.0)
├── accounts/              # Diretório de contas
│   └── <account_id>.json  # Arquivo para cada conta
├── gui_config.json        # Configuração de aplicativo (escrito por GUI)
├── token_stats.db         # Biblioteca de estatística de Token (SQLite)
├── proxy_logs.db          # Biblioteca de logs de Proxy Monitor (SQLite)
├── logs/                  # Diretório de logs de aplicativo
│   └── app.log*           # Rotação diária (nome de arquivo muda com data)
├── bin/                   # Ferramentas externas (como cloudflared)
│   └── cloudflared(.exe)
└── device_original.json   # Linha de base de impressão digital de dispositivo (opcional)
```

**Regras de caminho do diretório de dados**: usa `dirs::home_dir()`, concatena `.antigravity_tools` (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: tip Sugestão de backup
Faça backup regular de diretório `accounts/`, `accounts.json`, `token_stats.db` e `proxy_logs.db` para salvar todos os dados principais.
:::

---

## Modelo de dados de conta

### accounts.json (índice de contas)

Arquivo de índice registra informações de resumo de todas as contas e conta atualmente selecionada.

**Localização**: `~/.antigravity_tools/accounts.json`

**Schema** (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`):

```json
{
  "version": "2.0",                  // Versão do índice
  "accounts": [                       // Lista de resumos de contas
    {
      "id": "uuid-v4",              // ID único da conta
      "email": "user@gmail.com",     // Email da conta
      "name": "Display Name",        // Nome de exibição (opcional)
      "created_at": 1704067200,      // Tempo de criação (timestamp Unix)
      "last_used": 1704067200       // Último uso (timestamp Unix)
    }
  ],
  "current_account_id": "uuid-v4"    // ID da conta atualmente selecionada
}
```

### Arquivo de conta ({account_id}.json)

Cada conta tem dados completos armazenados independentemente no formato JSON no diretório `accounts/`.

**Localização**: `~/.antigravity_tools/accounts/{account_id}.json`

**Schema** (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42`; tipo frontend: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`):

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // Dados de Token OAuth
    "access_token": "ya29...",      // Token de acesso atual
    "refresh_token": "1//...",      // Token de atualização (mais importante)
    "expires_in": 3600,            // Tempo de expiração (segundos)
    "expiry_timestamp": 1704070800, // Timestamp de expiração
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // Opcional: ID do projeto Google Cloud
    "session_id": "..."            // Opcional: sessionId do Antigravity
  },

  "device_profile": {               // Impressão digital de dispositivo (opcional)
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // Histórico de versões de impressão digital
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Saved from device X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // Dados de cota (opcional)
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // Porcentagem de cota restante
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // Tipo de assinatura: FREE/PRO/ULTRA
  },

  "disabled": false,                // Conta totalmente desabilitada
  "disabled_reason": null,          // Motivo de desabilitação (como invalid_grant)
  "disabled_at": null,             // Timestamp de desabilitação

  "proxy_disabled": false,         // Desabilitar função de proxy apenas
  "proxy_disabled_reason": null,   // Motivo de desabilitação de proxy
  "proxy_disabled_at": null,       // Timestamp de desabilitação de proxy

  "protected_models": [             // Lista de modelos protegidos por cota
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### Descrição de campos-chave

| Campo | Tipo | Significado comercial | Condição de disparo |
|--- | --- | --- | ---|
| `disabled` | bool | Conta totalmente desabilitada (como refresh_token expirado) | Quando `invalid_grant`, automaticamente definido para `true` |
| `proxy_disabled` | bool | Apenas desabilitar função de proxy, não afeta uso de GUI | Desabilitação manual ou disparo de proteção de cota |
| `protected_models` | string[] | Lista de modelos restritos de proteção de cota a nível de modelo | Atualizado por lógica de proteção de cota |
| `quota.models[].percentage` | number | Porcentagem de cota restante (0-100) | Atualizado cada vez que cota for atualizada |
| `token.refresh_token` | string | Credencial para obter access_token | Obtida na autorização OAuth, válida a longo prazo |

**Regra importante 1: invalid_grant dispara desabilitação** (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889`; gravação: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`):

- Quando atualização de token falhar e erro contiver `invalid_grant`, TokenManager gravará `disabled=true` / `disabled_at` / `disabled_reason` no arquivo da conta, e removerá a conta do pool de tokens.

**Regra importante 2: semântica de protected_models** (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250`; gravação de proteção de cota: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`):

- `protected_models` armazena "ID de modelo normalizado", usado para proteção de cota a nível de modelo e desvio de escalonamento.

---

## Biblioteca de estatística de Token

Biblioteca de estatística de Token registra consumo de Token de cada solicitação de proxy, usado para monitoramento de custo e análise de tendência.

**Localização**: `~/.antigravity_tools/token_stats.db`

**Engine de banco de dados**: SQLite + modo WAL (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`)

### Estrutura da tabela

#### token_usage (registros de uso originais)

| Campo | Tipo | Descrição |
|--- | --- | ---|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Chave primária auto-incremento |
| timestamp | INTEGER | Timestamp da solicitação |
| account_email | TEXT | Email da conta |
| model | TEXT | Nome do modelo |
| input_tokens | INTEGER | Número de Tokens de entrada |
| output_tokens | INTEGER | Número de Tokens de saída |
| total_tokens | INTEGER | Número total de Tokens |

**Instrução de criação de tabela** (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`):

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly (tabela de agregação por hora)

Agrega consumo de Token a cada hora, usado para consulta rápida de dados de tendência.

**Instrução de criação de tabela** (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`):

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- Bucket de tempo (formato: YYYY-MM-DD HH:00)
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### Índices

Para melhorar desempenho de consulta, o banco de dados estabeleceu os seguintes índices (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`):

```sql
-- Índice por tempo descendente
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- Índice por conta
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### Exemplos de consulta comum

#### Consultar consumo das últimas 24 horas

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### Estatísticas por modelo

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info Métrica de campo de tempo
`token_usage.timestamp` é timestamp Unix (segundos) gravado por `chrono::Utc::now().timestamp()`, `token_stats_hourly.hour_bucket` também é string gerada por UTC (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`).
:::

---

## Biblioteca de logs de Proxy Monitor

Biblioteca de logs de Proxy registra informações detalhadas de cada solicitação de proxy, usada para solução de problemas e auditoria de solicitações.

**Localização**: `~/.antigravity_tools/proxy_logs.db`

**Engine de banco de dados**: SQLite + modo WAL (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`)

### Estrutura da tabela: request_logs

| Campo | Tipo | Descrição |
|--- | --- | ---|
| id | TEXT PRIMARY KEY | ID único da solicitação (UUID) |
| timestamp | INTEGER | Timestamp da solicitação |
| method | TEXT | Método HTTP (GET/POST) |
| url | TEXT | URL da solicitação |
| status | INTEGER | Código de status HTTP |
| duration | INTEGER | Duração da solicitação (milissegundos) |
| model | TEXT | Nome do modelo solicitado pelo cliente |
| mapped_model | TEXT | Nome do modelo realmente usado após roteamento |
| account_email | TEXT | Email da conta usada |
| error | TEXT | Informações de erro (se houver) |
| request_body | TEXT | Corpo da solicitação (opcional, ocupa muito espaço) |
| response_body | TEXT | Corpo da resposta (opcional, ocupa muito espaço) |
| input_tokens | INTEGER | Número de Tokens de entrada |
| output_tokens | INTEGER | Número de Tokens de saída |
| protocol | TEXT | Tipo de protocolo (openai/anthropic/gemini) |

**Instrução de criação de tabela** (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`):

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- Compatibilidade: adicionar gradualmente novos campos via ALTER TABLE
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### Índices

```sql
-- Índice por tempo descendente
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- Índice por código de status
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### Limpeza automática

Ao iniciar o ProxyMonitor, limpará automaticamente logs de 30 dias atrás e fará `VACUUM` no banco de dados (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`; implementação: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`).

### Exemplos de consulta comum

#### Consultar solicitações falhadas recentes

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### Taxa de sucesso por conta

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## Arquivos de configuração

### gui_config.json

Armazena informações de configuração do aplicativo, incluindo configurações de proxy, mapeamento de modelo, modo de autenticação, etc.

**Localização**: `~/.antigravity_tools/gui_config.json` (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`)

A estrutura deste arquivo usa `AppConfig` como padrão (fonte: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`).

::: tip Quando você só precisa "backup/migração"
A maneira mais simples é: após fechar o aplicativo, empacotar todo o diretório `~/.antigravity_tools/`. Atualização a quente/semântica de reinício pertence a "comportamento em tempo de execução", sugiro ver aula avançada **[Explicação completa de configuração](../../advanced/config/)**.
:::

---

## Arquivos de log

### Log do aplicativo

**Localização**: `~/.antigravity_tools/logs/` (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`)

Logs usam rotação diária de arquivos, nome de arquivo base é `app.log` (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`).

**Nível de log**: INFO/WARN/ERROR

**Uso**: registra eventos-chave, informações de erro e informações de depuração em tempo de execução do aplicativo, usado para solução de problemas.

---

## Migração e backup de dados

### Backup de dados principais

::: code-group

```bash [macOS/Linux]
## Backup de todo o diretório de dados (mais estável)
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## Backup de todo o diretório de dados (mais estável)
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### Migrar para nova máquina

1. Feche as Antigravity Tools (evitar cópia no meio de gravação)
2. Copie `.antigravity_tools` da máquina de origem para o diretório raiz do usuário na máquina de destino
3. Inicie as Antigravity Tools

::: tip Migração entre plataformas
Se migrar do Windows para macOS/Linux (ou vice-versa), basta copiar todo o diretório `.antigravity_tools`, o formato de dados é compatível entre plataformas.
:::

### Limpar dados históricos

::: info Primeiro diga a conclusão
- `proxy_logs.db`: tem limpeza automática de 30 dias (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`).
- `token_stats.db`: ao iniciar inicializará estrutura da tabela (fonte: `source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`), mas no código-fonte não vi lógica de "limpar automaticamente registros históricos por dia".
:::

::: danger Só faça quando você confirmar que não precisa de dados históricos
Limpar estatística/logs fará você perder dados históricos de solução de problemas e análise de custo. Antes de agir, primeiro faça backup de todo o `.antigravity_tools`.
:::

Se você só quer "limpar e recomeçar", a maneira mais estável é fechar o aplicativo e deletar diretamente arquivos DB (ao iniciar novamente a estrutura da tabela será reconstruída).

::: code-group

```bash [macOS/Linux]
## Limpar estatística de Token (perderá histórico)
rm -f ~/.antigravity_tools/token_stats.db

## Limpar logs de Proxy Monitor (perderá histórico)
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## Limpar estatística de Token (perderá histórico)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## Limpar logs de Proxy Monitor (perderá histórico)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## Descrição de métricas de campo comuns

### Timestamp Unix

Todos os campos relacionados a tempo (como `created_at`, `last_used`, `timestamp`) usam timestamp Unix (precisão de segundos).

**Converter para tempo legível**:

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## Consulta SQLite (exemplo: converter request_logs.timestamp para tempo legível)
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### Porcentagem de cota

`quota.models[].percentage` indica porcentagem de cota restante (0-100) (fonte: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40`; modelo backend: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`).

Se disparará "proteção de cota", decidido por `quota_protection.enabled/threshold_percentage/monitored_models` (fonte: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63`; gravação `protected_models`: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`).

---

## Resumo desta seção

- Diretório de dados das Antigravity Tools está em `.antigravity_tools` no diretório raiz do usuário
- Dados de conta: `accounts.json` (índice) + `accounts/<account_id>.json` (dados completos de conta única)
- Dados de estatística: `token_stats.db` (estatística de Token) + `proxy_logs.db` (logs de Proxy Monitor)
- Configuração e operação: `gui_config.json`, `logs/`, `bin/cloudflared*`, `device_original.json`
- A maneira mais estável de backup/migração é "empacotar todo o `.antigravity_tools/` após fechar o aplicativo"

---

## Próxima seção

> Na próxima seção, aprenderemos **[Limites de capacidade de integração z.ai](../zai-boundaries/)**.
>
> Você aprenderá:
> - Lista de recursos implementados de integração z.ai
> - Recursos não implementados e limitações de uso
> - Descrição de implementação experimental do Vision MCP

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Diretório de dados (.antigravity_tools) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Diretório de contas (accounts/) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| Estrutura accounts.json | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Estrutura Account (backend) | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Estrutura Account (frontend) | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| Estrutura TokenData/QuotaData | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| Estrutura TokenData/QuotaData | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Inicialização de biblioteca de estatística de Token (schema) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Inicialização de biblioteca de logs de Proxy (schema) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Limpeza automática de logs de Proxy (30 dias) | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Implementação de limpeza automática de logs de Proxy | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| Gravação/leitura gui_config.json | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| logs/ diretório e app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| Caminho bin/cloudflared | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
| Gravação de disabled em invalid_grant | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L869-L969) | 869-969 |

**Constantes-chave**:
- `DATA_DIR = ".antigravity_tools"`: nome do diretório de dados (`src-tauri/src/modules/account.rs:16-18`)
- `ACCOUNTS_INDEX = "accounts.json"`: nome do arquivo de índice de contas (`src-tauri/src/modules/account.rs:16-18`)
- `CONFIG_FILE = "gui_config.json"`: nome do arquivo de configuração (`src-tauri/src/modules/config.rs:7`)

**Funções-chave**:
- `get_data_dir()`: obter caminho do diretório de dados (`src-tauri/src/modules/account.rs`)
- `record_usage()`: gravar `token_usage`/`token_stats_hourly` (`src-tauri/src/modules/token_stats.rs`)
- `save_log()`: gravar `request_logs` (`src-tauri/src/modules/proxy_db.rs`)
- `cleanup_old_logs(days)`: deletar registros `request_logs` antigos e `VACUUM` (`src-tauri/src/modules/proxy_db.rs`)

</details>
