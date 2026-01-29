---
title: "Configuração: Atualização a Quente e Migração | Antigravity-Manager"
subtitle: "Configuração: Atualização a Quente e Migração | Antigravity-Manager"
sidebarTitle: "O que fazer se configuração não entra em vigor"
description: "Aprenda o mecanismo de persistência, atualização a quente e migração do sistema de configuração. Domine valores padrão de campos e métodos de verificação de autenticação, evite armadilhas comuns."
tags:
  - "configuração"
  - "gui_config.json"
  - "AppConfig"
  - "ProxyConfig"
  - "atualização a quente"
prerequisite:
  - "start-first-run-data"
  - "start-proxy-and-first-client"
order: 1
---

# Configuração Completa: AppConfig/ProxyConfig, Local de Persistência e Semântica de Atualização a Quente

Você mudou `auth_mode` mas o cliente ainda retorna 401; você abriu `allow_lan_access`, mas dispositivos na mesma rede não conseguem conectar; você quer migrar configuração para nova máquina, mas não sabe quais arquivos copiar.

Esta aula explica completamente o sistema de configuração do Antigravity Tools: onde a configuração existe, quais são os valores padrão, quais podem ser atualizados a quente, quais exigem reiniciar o proxy reverso.

## O Que é AppConfig/ProxyConfig?

**AppConfig/ProxyConfig** é o modelo de dados de configuração do Antigravity Tools: AppConfig gerencia configurações gerais do desktop (idioma, tema, aquecimento, proteção de cota etc.), ProxyConfig gerencia parâmetros de execução do serviço de proxy reverso local (porta, autenticação, mapeamento de modelo, proxy upstream etc.). Eles finalmente são serializados no mesmo arquivo `gui_config.json`, e ao iniciar o proxy reverso é lido o ProxyConfig dentro dele.

## O Que Você Poderá Fazer Após Este Curso

- Encontrar a localização real do arquivo de configuração `gui_config.json` e poder fazer backup/migração
- Entender campos principais e valores padrão de AppConfig/ProxyConfig (baseado no código-fonte)
- Esclarecer quais configurações após salvar entram em vigor a quente, quais exigem reiniciar o proxy reverso
- Entender quando ocorre uma "migração de configuração" (campos antigos serão automaticamente fundidos/removidos)

## Seu Problema Atual

- Você mudou configuração mas "não entra em vigor", não sabe se não salvou, não atualizou a quente, ou precisa reiniciar
- Você só quer levar "configuração de proxy" para nova máquina, mas se preocupa em levar dados de contas juntos
- Após upgrade aparecem campos antigos, preocupa-se que o formato do arquivo de configuração "quebrou"

## Quando Usar Esta Técnica

- Você está preparando para mudar o proxy reverso de "apenas local" para "acessível na LAN"
- Você precisa mudar estratégia de autenticação (`auth_mode`/`api_key`), e quer verificar imediatamente que entrou em vigor
- Você precisa manter em lote mapeamento de modelo/proxy upstream/configuração z.ai

## 🎒 Preparação Antes de Começar

- Você já sabe o que é diretório de dados (veja [Primeira Inicialização: Diretório de Dados, Logs, Bandeja e Inicialização Automática](../../start/first-run-data/))
- Você pode iniciar uma vez o serviço de proxy reverso (veja [Inicie o Proxy Reverso Local e Conecte o Primeiro Cliente](../../start/proxy-and-first-client/))

::: warning Primeiro Uma Fronteira
Esta aula ensinará ler/backup/migrar `gui_config.json`, mas não recomenda tratá-lo como "arquivo de configuração mantido manualmente a longo prazo". Porque ao salvar configuração o backend re-serializará pela estrutura Rust `AppConfig`, campos desconhecidos inseridos manualmente provavelmente serão automaticamente descartados na próxima salva.
:::

## Ideia Central

Para configuração, lembre três frases:

1. AppConfig é o objeto raiz de configuração persistente, cai em `gui_config.json`.
2. ProxyConfig é subobjeto de `AppConfig.proxy`, inicialização/atualização a quente do proxy reverso giram em torno dele.
3. Atualização a quente é "apenas atualizar estado na memória": pode atualizar a quente não significa poder mudar porta/endereço de escuta.

## Siga-me

### Passo 1: Localize `gui_config.json` (Fonte Única de Verdade da Configuração)

**Por Que**
Todos os seus "backup/migração/solução de problemas" subsequentes devem usar este arquivo como padrão.

O diretório de dados do backend é `.antigravity_tools` sob seu diretório Home (se não existirá criado automaticamente), o nome do arquivo de configuração é fixo como `gui_config.json`.

::: code-group

```bash [macOS/Linux]
CONFIG_FILE="$HOME/.antigravity_tools/gui_config.json"
echo "$CONFIG_FILE"
ls -la "$CONFIG_FILE" || true
```

```powershell [Windows]
$configFile = Join-Path $HOME ".antigravity_tools\gui_config.json"
$configFile
Get-ChildItem -Force $configFile -ErrorAction SilentlyContinue
```

:::

**Você Deve Ver**:
- Se você ainda não iniciou o proxy reverso, este arquivo pode não existir (o backend usará diretamente configuração padrão).
- Ao iniciar o serviço de proxy reverso ou salvar configurações, será automaticamente criado e escrito em JSON.

### Passo 2: Primeiro Faça um Backup (Prevenir Erro de Mão + Fácil Reverter)

**Por Que**
A configuração pode conter campos sensíveis como `proxy.api_key`, API key z.ai etc. Quando você precisa migrar/comparar, backup é mais confiável que "memória".

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/antigravity-config-backup"
cp "$HOME/.antigravity_tools/gui_config.json" "$HOME/antigravity-config-backup/gui_config.$(date +%Y%m%d%H%M%S).json"
```

```powershell [Windows]
$backupDir = Join-Path $HOME "antigravity-config-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$ts = Get-Date -Format "yyyyMMddHHmmss"
Copy-Item (Join-Path $HOME ".antigravity_tools\gui_config.json") (Join-Path $backupDir "gui_config.$ts.json")
```

:::

**Você Deve Ver**: Aparece um arquivo JSON com timestamp no diretório de backup.

### Passo 3: Entenda os Valores Padrão (Não Adivinhe por Sentimento)

**Por Que**
Muitos problemas de "como configurar tudo errado", na verdade são suas expectativas incorretas dos valores padrão.

Abaixo estes valores padrão vêm de `AppConfig::new()` e `ProxyConfig::default()` do backend:

| Bloco de Configuração | Campo | Valor Padrão (Código-fonte) | O Que Você Precisa Lembrar |
| --- | --- | --- | --- |
| AppConfig | `language` | `"zh"` | Padrão chinês |
| AppConfig | `theme` | `"system"` | Seguir sistema |
| AppConfig | `auto_refresh` | `true` | Padrão atualizará cota automaticamente |
| AppConfig | `refresh_interval` | `15` | Unidade: minutos |
| ProxyConfig | `enabled` | `false` | Padrão não iniciar proxy reverso |
| ProxyConfig | `allow_lan_access` | `false` | Padrão apenas ligar a esta máquina (privacidade primeiro) |
| ProxyConfig | `auth_mode` | `"off"` | Padrão sem autenticação (cenário apenas local) |
| ProxyConfig | `port` | `8045` | Este é o campo que você mais muda |
| ProxyConfig | `api_key` | `"sk-<uuid>"` | Padrão gerará key aleatória |
| ProxyConfig | `request_timeout` | `120` | Unidade: segundos (nota: atualmente internamente no proxy reverso não necessariamente usa) |
| ProxyConfig | `enable_logging` | `true` | Padrão ativar coleta de logs que monitor/estatísticas dependem |
| StickySessionConfig | `mode` | `Balance` | Estratégia de agendamento padrão equilibrada |
| StickySessionConfig | `max_wait_seconds` | `60` | Apenas significativo no modo CacheFirst |

::: tip Como Ver Campos Completos?
Você pode abrir `gui_config.json` diretamente comparando com código-fonte: `src-tauri/src/models/config.rs` (AppConfig) e `src-tauri/src/proxy/config.rs` (ProxyConfig). No final desta aula "Referência do Código-fonte" fornecem links clicáveis de número da linha.
:::

### Passo 4: Mude Uma Configuração "Certamente Atualiza a Quente" e Verifique Imediatamente (Exemplo com Autenticação)

**Por Que**
Você precisa de um ciclo "mudou pode verificar imediatamente", evitando mudanças cegas na UI.

Quando o proxy reverso está em execução, o backend `save_config` atualizará a quente na memória estes conteúdos:

- `proxy.custom_mapping`
- `proxy.upstream_proxy`
- `proxy.auth_mode` / `proxy.api_key` (política de segurança)
- `proxy.zai`
- `proxy.experimental`

Aqui usamos `auth_mode` como exemplo:

1. Abra a página `API Proxy`, certifique-se de que o serviço de proxy reverso está em Running.
2. Defina `auth_mode` como `all_except_health`, e confirme que você sabe a atual `api_key`.
3. Use a solicitação abaixo para verificar "health check passa, outras interfaces bloqueiam".

::: code-group

```bash [macOS/Linux]
#solicitação sem key /healthz: deve ter sucesso
curl -sS "http://127.0.0.1:8045/healthz" && echo

#solicitação sem key /v1/models: deve 401
curl -sS -i "http://127.0.0.1:8045/v1/models"

#solicitação com key /v1/models novamente: deve ter sucesso
curl -sS -H "Authorization: Bearer <proxy.api_key>" "http://127.0.0.1:8045/v1/models"
```

```powershell [Windows]
#solicitação sem key /healthz: deve ter sucesso
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/healthz" | Select-Object -ExpandProperty StatusCode

#solicitação sem key /v1/models: deve 401
try { Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" } catch { $_.Exception.Response.StatusCode.value__ }

#solicitação com key /v1/models novamente: deve ter sucesso
$headers = @{ Authorization = "Bearer <proxy.api_key>" }
(Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" -Headers $headers).StatusCode
```

:::

**Você Deve Ver**: `/healthz` retorna 200; `/v1/models` retorna 401 sem key, sucesso com key.

### Passo 5: Mude Uma Configuração "Deve Reiniciar o Proxy Reverso" (Porta / Endereço de Escuta)

**Por Que**
Muitas configurações são "salvas mas não entram em vigor", a causa raiz não é bug, mas ela decide como o TCP Listener se liga.

Ao iniciar o proxy reverso, o backend usará `allow_lan_access` para calcular endereço de escuta (`127.0.0.1` ou `0.0.0.0`), e usará `port` para ligar porta; este passo só acontece em `start_proxy_service`.

Sugestão de operação:

1. Na página `API Proxy` mude `port` para um novo valor (por exemplo `8050`), salve.
2. Pare o serviço de proxy reverso, então reinicie.
3. Verifique `/healthz` com a nova porta.

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:8050/healthz" && echo
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8050/healthz" | Select-Object -ExpandProperty StatusCode
```

:::

**Você Deve Ver**: Nova porta acessível; porta antiga falha ou retorna vazio.

::: warning Sobre `allow_lan_access`
No código-fonte `allow_lan_access` afeta duas coisas simultaneamente:

1. **Endereço de Escuta**: decide ligar `127.0.0.1` ou `0.0.0.0` (precisa reiniciar o proxy reverso para re-ligar).
2. **Estratégia de Autenticação Auto**: quando `auth_mode=auto`, o cenário LAN automaticamente virará `all_except_health` (esta parte pode atualizar a quente).
:::

### Passo 6: Entenda Uma "Migração de Configuração" (Campos Antigos Serão Automaticamente Limpos)

**Por Que**
Após upgrade você pode ver campos antigos em `gui_config.json`, preocupa-se que "quebrou". Na verdade, ao carregar configuração o backend fará uma migração: fundir `anthropic_mapping/openai_mapping` em `custom_mapping`, e deletar campos antigos, então salvar automaticamente uma vez.

Você pode usar esta regra para autodiagnóstico:

- Se você vir `proxy.anthropic_mapping` ou `proxy.openai_mapping` no arquivo, na próxima inicialização/carregamento de configuração, eles serão removidos.
- Ao fundir, keys terminando com `-series` serão puladas (esses agora são tratados por lógica preset/builtin).

**Você Deve Ver**: Após migração, apenas `proxy.custom_mapping` fica em `gui_config.json`.

## Pontos de Verificação ✅

- Você pode encontrar `$HOME/.antigravity_tools/gui_config.json` nesta máquina
- Você pode explicar claramente: por que configurações como `auth_mode/api_key/custom_mapping` podem atualizar a quente
- Você pode explicar claramente: por que configurações como `port/allow_lan_access` exigem reiniciar o proxy reverso

## Lembrete de Armadilhas

1. A atualização a quente de `save_config` apenas cobre poucos campos: não reiniciará listener, nem empurrará configurações como `scheduling` para o TokenManager.
2. `request_timeout` na implementação interna atual do proxy reverso realmente não entra em vigor: o parâmetro `start` do AxumServer é `_request_timeout`, mas o estado tem timeout codificado como `300` segundos.
3. Inserir manualmente "campos personalizados" em `gui_config.json` não é confiável: ao salvar configuração o backend re-serializará em `AppConfig`, campos desconhecidos serão descartados.

## Resumo da Lição

- Persistência de configuração tem apenas uma entrada: `$HOME/.antigravity_tools/gui_config.json`
- "Pode atualizar a quente" do ProxyConfig não significa "pode mudar porta/mudar endereço de escuta"; tudo que envolver bind precisa reiniciar o proxy reverso
- Ver campos de mapeamento antigos não se assuste: ao carregar configuração migrará automaticamente para `custom_mapping` e limpará campos antigos

## Próximo Passo

> Na próxima lição aprenderemos **[Segurança e Privacidade: auth_mode, allow_lan_access, e o Design "Não Vaze Informações de Conta"](../security/)**.
>
> Você aprenderá:
> - Quando deve ativar autenticação (e por que `auto` é mais estrito em cenários LAN)
> - Estratégia de exposição mínima ao expor o proxy reverso local para LAN/público
> - Quais dados são enviados para upstream, quais são apenas salvos localmente

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para Expandir e Ver Localização do Código-fonte</strong></summary>

> Última Atualização: 2026-01-24

| Tópico | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Valores Padrão AppConfig (`AppConfig::new()`) | [`src-tauri/src/models/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/config.rs#L4-L158) | 4-158 |
| Valores Padrão ProxyConfig (porta/autenticação/endereço de escuta) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L74-L292) | 74-292 |
| Valores Padrão StickySessionConfig (agendamento) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L36) | 3-36 |
| Nome do Arquivo de Persistência de Configuração + Lógica de Migração (`gui_config.json`) | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| Diretório de Dados (`$HOME/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| `save_config`: salvar configuração + quais campos atualizar a quente | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| AxumServer: `update_mapping/update_proxy/update_security/...` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L45-L117) | 45-117 |
| Seleção de Endereço de Escuta `allow_lan_access` | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L81-L92) | 81-92 |
| Endereço Bind e Porta ao Iniciar Proxy (precisa reiniciar para mudar) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L134) | 42-134 |
| Regras Reais de `auth_mode=auto` | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L3-L31) | 3-31 |
| Frontend Salvar Configuração de Agendamento (apenas salvar, não empurrar para runtime backend) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L476-L501) | 476-501 |
| Página Monitor Dinamicamente Ativar/Desativar Coleta de Logs | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L263) | 174-263 |

</details>
