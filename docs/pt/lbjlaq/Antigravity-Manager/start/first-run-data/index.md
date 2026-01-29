---
title: "Primeira Inicialização: Domine o Diretório de Dados | Antigravity Tools"
sidebarTitle: "Encontre o Diretório de Dados"
subtitle: "Essencial para Primeira Inicialização: Diretório de Dados, Logs, Bandeja e Início Automático"
description: "Aprenda localização e gerenciamento de diretório de dados do Antigravity Tools. Domine abrir diretório de dados na página de configurações, limpar logs, rodar em bandeja e início automático, distinguir dois tipos de início automático."
tags:
  - "Primeira Inicialização"
  - "Diretório de Dados"
  - "Logs"
  - "Bandeja"
  - "Início Automático"
prerequisite:
  - "start-getting-started"
  - "start-installation"
order: 3
---

# Essencial para Primeira Inicialização: Diretório de Dados, Logs, Bandeja e Início Automático

Muitas capacidades "parecem mágica" do Antigravity Tools (pool de contas, cota, monitoramento, estatísticas, rodar em background), no final se baseiam em duas coisas: **diretório de dados** e **logs**. Na primeira vez que rodar, esclareça essas duas partes, depois resolver problemas economizará muito tempo.

## O que é diretório de dados?

**Diretório de dados** é a pasta onde o Antigravity Tools salva estado na sua máquina: JSON de contas, arquivos relacionados à cota, arquivos de log, e bancos de dados SQLite do Token Stats/Proxy Monitor ficam todos aqui. Quando você faz backup/migração/solução de problemas, só localize este diretório primeiro, basicamente pode encontrar fonte de dados autoritativa.

## O que você poderá fazer após completar

- Saber onde fica o diretório de dados do Antigravity Tools (e abrir com um clique)
- Esclarecer quais arquivos devem ser backup, quais são logs/cache
- Ao resolver problemas, consegue localizar rapidamente logs e banco de dados de monitoramento
- Entender diferença entre "fechar janela" e "sair do programa" (bandeja residente)
- Distinguir dois tipos de início automático: início automático vs início automático de proxy reverso

## Seu dilema atual

- Você quer backup/migração de contas, mas não sabe onde contas são salvas
- UI relata erro/chamada de proxy reverso falha, mas não encontra logs
- Você fechou janela, pensou que programa saiu, mas ainda está rodando em background

## Quando usar essa técnica

- Você acabou de instalar Antigravity Tools, quer confirmar "onde dados ficam"
- Você prepara trocar computador/reinstalar sistema, quer primeiro fazer backup de contas e dados estatísticos
- Você precisa resolver problemas: OAuth falha, atualização de cota falha, início de proxy reverso falha, chamada relata 401/429

## 🎒 Preparação antes de começar

- Instalou e pode abrir Antigravity Tools
- Você pode entrar na página Settings (entrada de configurações canto superior direito/barra lateral)
- Sua conta de sistema tem permissão para acessar seu próprio diretório Home

::: warning Lembrete
Esta lição dirá quais arquivos são "dados reais", mas não recomenda que você edite manualmente esses arquivos. Para mudar configuração, priorize mudar na UI.
:::

## Ideia Principal

Primeiro lembre uma frase:

"**O diretório de dados é a única fonte de verdade do estado local; logs são a primeira entrada de solução de problemas.**"

O Antigravity Tools criará diretório de dados `.antigravity_tools` no seu diretório Home, e colocará contas, logs, banco de estatísticas, etc. (se diretório não existir será criado automaticamente).

Simultaneamente, por padrão habilita bandeja: quando você fecha janela, programa não sai imediatamente, mas esconde para bandeja, continua rodando em background.

## Siga-me

### Passo 1: Abra diretório de dados na página de configurações

**Por que**
Primeiro localize precisamente o diretório de dados, depois seja backup ou solução de problemas, há "ponto de apoio".

No Antigravity Tools abra Settings, depois mude para Advanced.

Você verá uma caixa de entrada somente leitura "Diretório de dados" (ela mostrará caminho real), ao lado há um botão abrir.

Clique no botão abrir.

**Você deve ver**: Gerenciador de arquivos do sistema abre um diretório, caminho algo como `~/.antigravity_tools/`.

### Passo 2: Confirme seu caminho de diretório de dados (cross-platform)

**Por que**
Depois quando você escrever scripts de backup, ou resolver problemas na linha de comando, precisa saber o caminho real deste diretório no seu sistema.

::: code-group

```bash [macOS/Linux]
echo "$HOME/.antigravity_tools"
ls -la "$HOME/.antigravity_tools"
```

```powershell [Windows]
$dataDir = Join-Path $HOME ".antigravity_tools"
$dataDir
Get-ChildItem -Force $dataDir
```

:::

**Você deve ver**: Diretório existe (se você abre página de configurações pela primeira vez, diretório será criado automaticamente).

### Passo 3: Conheça "arquivos principais" no diretório de dados

**Por que**
Nem todos os arquivos valem ser backup. Primeiro separe "quais são dados de conta", "quais são banco estatístico/logs".

Abaixo nomes de arquivos vêm de código-fonte do projeto, todos são fixos:

| Você verá conteúdo | Finalidade | O que você precisa se importar |
|--- | --- | ---|
| `accounts.json` | Índice de contas (incluindo lista de contas/conta atual) | Recomendado fazer backup junto ao migrar contas |
| `accounts/` | Cada conta um arquivo `*.json` | Este é corpo principal de dados de conta |
| `logs/` | Diretório de logs do aplicativo | Prioridade ao resolver problemas |
| `token_stats.db` | Banco de dados SQLite do Token Stats | Dados que você vê na página Token Stats vêm dele |
| `proxy_logs.db` | Banco de dados SQLite do Proxy Monitor | Logs de solicitação que você vê na página Monitor vêm dele |
| `warmup_history.json` | Histórico local do Smart Warmup | Principalmente para evitar warmup repetido |
| `update_settings.json` | Configurações de verificação de atualização (verificação automática/intervalo etc.) | Geralmente não precisa mexer manualmente |

**Você deve ver**: Pelo menos há diretório `logs/`; se você ainda não adicionou conta, `accounts.json`/`accounts/` podem não ter aparecido.

### Passo 4: Lembre localização dos logs (solução de problemas depende disso)

**Por que**
Avisos de erro de UI geralmente só dão "fenômeno", causa real de falha (ex: solicitação falhou, falha de leitura/escrita de arquivo) muitas vezes está em logs.

O Antigravity Tools escreve logs em `logs/` dentro do diretório de dados.

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/logs"
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs")
```

:::

**Você deve ver**: Sob diretório existem arquivos de log rodando por dia (nome de arquivo começa com `app.log`).

### Passo 5: Quando precisa "limpar logs", use limpeza com um clique da página de configurações

**Por que**
Alguns problemas você só quer reproduzir uma vez, depois deixar aqueles logs separadamente; então primeiro limpar logs é melhor para comparar.

Em Settings -> Advanced, encontre área de logs, clique "Limpar Logs".

**Você deve ver**: Surge caixa de confirmação; após confirmar avisa limpeza bem-sucedida.

::: tip Duas coisas com as quais você se preocupará
- Logs farão automaticamente "rodar por dia", e ao iniciar tentarão limpar logs antigos com mais de 7 dias.
- "Limpar Logs" truncará arquivos de log para 0 bytes, conveniente para processo rodando continuar escrevendo mesmo handle de arquivo.
:::

### Passo 6: Esclareça diferença entre "fechar janela" e "sair do programa" (bandeja)

**Por que**
Antigravity Tools por padrão habilita bandeja; quando você clica fechar no canto superior direito da janela, programa esconderá para bandeja e continuará rodando. Se você acha que ele saiu, facilmente aparece ilusão de "porta ainda ocupada/background ainda rodando".

Você pode usar este pequeno fluxo para confirmar:

```
Operação: fechar janela (não sair)

┌─────────────────────────────────────────────────────────────┐
│  Passo 1                Passo 2                             │
│  Clique fechar janela →   Vá para bandeja/barra de menu do sistema procurar ícone  │
└─────────────────────────────────────────────────────────────┘

Você deve ver: ícone da bandeja ainda existe, clicar nele pode mostrar janela novamente.
```

No menu da bandeja também há duas ações comuns (muito conveniente quando não vai pela UI):

- Alternar conta: mudar para próxima conta
- Atualizar cota: atualizar cota da conta atual (enquanto notificará frontend atualizar exibição)

### Passo 7: Configure início automático ao ligar (deixe iniciar minimizado automaticamente)

**Por que**
Se você quer que funcione como "serviço residente" (bandeja residente + atualização em background), início automático ao ligar economizará cada vez abrir manualmente.

Em Settings -> General encontre "Início Automático ao Ligado", escolha habilitar.

**Você deve ver**: Após alternar avisa habilitar com sucesso; próxima vez ao iniciar o sistema rodará com parâmetro `--minimized`.

::: info Dois tipos de "início automático", não confunda
| Nome | Significado | Evidência |
|--- | --- | ---|
| Início automático ao ligar | Após iniciar computador, inicia Antigravity Tools automaticamente (aplicativo de desktop em si) | Parâmetros de início incluem `--minimized`, e fornece comando `toggle_auto_launch` |
| Início automático de proxy reverso | Após Antigravity Tools iniciar, se configurado `proxy.auto_start=true`, tentará iniciar serviço de proxy reverso local automaticamente | Ao iniciar aplicativo lê configuração e `start_proxy_service(...)` |
:::

## Ponto de verificação ✅

- [ ] Você pode ver caminho real do diretório de dados em Settings -> Advanced
- [ ] Você pode abrir diretório de dados, e aproximadamente reconhecer `accounts.json`, `accounts/`, `logs/`, `token_stats.db`, `proxy_logs.db`
- [ ] Você sabe logs estão em `logs/`, e pode usar linha de comando para ver rápido
- [ ] Você sabe após fechar janela programa ainda está na bandeja, sair usa Quit do menu da bandeja
- [ ] Você pode distinguir "início automático ao ligar" e "início automático de proxy reverso"

## Aviso sobre armadilhas

| Cenário | O que você pode fazer (❌) | Prática recomendada (✓) |
|--- | --- | ---|
| Não encontra diretório de dados | Procurar aleatoriamente por diretório de instalação do App no sistema | Vá diretamente Settings -> Advanced ver "Diretório de dados" e abrir com um clique |
| Fechou janela achando que saiu | Após clicar fechar janela vai mudar configuração/mudar porta | Primeiro veja se ícone da bandeja ainda existe; para sair use Quit da bandeja |
| Muitos logs difíceis de resolver | Reproduzir problema enquanto folheia logs antigos | Primeiro "Limpar Logs", depois reproduzir uma vez, finalmente só ver arquivo de log desta vez |
| Quer mudar dados de conta | Editar manualmente `accounts/*.json` | Use fluxo de importar/exportar/migrar da UI (próxima seção relacionada explicará) |

## Resumo da lição

- Diretório de dados fixo em `.antigravity_tools` sob Home (no macOS/Linux geralmente se apresenta como diretório oculto), contas/logs/banco estatístico estão todos aqui
- Diretório de logs é `logs/`, prioridade ao resolver problemas; quando necessário pode limpar com um clique na página de configurações
- Fechar janela esconderá para bandeja continua rodando; para sair completamente use Quit da bandeja
- Início automático tem dois tipos: início automático ao ligar (aplicativo) e início automático de proxy reverso (Proxy)

---

## Próximo aviso de lição

> Na próxima lição aprendemos **[Adicionar Contas: Canais Duplos OAuth/Refresh Token e Melhores Práticas](../add-account/)**.

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
|--- | --- | ---|
| Localização do diretório de dados (`~/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Índice de contas e diretório de arquivos de contas (`accounts.json` / `accounts/`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L46) | 16-46 |
| Diretório de logs e rodar por dia (`logs/` + `app.log`) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L83) | 17-83 |
| Limpar logs (truncar arquivo) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L149-L169) | 149-169 |
| Página de configurações mostra diretório de dados + abrir com um clique | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L525-L576) | 525-576 |
| Página de configurações limpar logs com um clique (botão + lógica de diálogo) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L127-L135) | 127-135 |
| Página de configurações limpar logs com um clique (botão aba Advanced) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L732-L747) | 732-747 |
| Menu da bandeja e eventos de clique (alternar conta/atualizar/mostrar/sair) | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L9-L158) | 9-158 |
|--- | --- | ---|
|--- | --- | ---|
| Interruptor de início automático ao ligar (`toggle_auto_launch` / `is_auto_launch_enabled`) | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L4-L39) | 4-39 |
| Comandos abrir diretório de dados / obter caminho / limpar logs | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L578-L621) | 578-621 |
| Nome do arquivo do banco de dados Token Stats (`token_stats.db`) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L61) | 58-61 |
| Nome do arquivo do banco de dados Proxy Monitor (`proxy_logs.db`) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L8) | 5-8 |
| Nome do arquivo de histórico Warmup (`warmup_history.json`) | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L14-L17) | 14-17 |
| Nome do arquivo de configurações de atualização (`update_settings.json`) | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L150-L177) | 150-177 |
| Início automático de proxy reverso (inicia serviço quando `proxy.auto_start=true`) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L107-L126) | 107-126 |

</details>
