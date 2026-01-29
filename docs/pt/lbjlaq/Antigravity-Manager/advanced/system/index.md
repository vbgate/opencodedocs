---
title: "Capacidades do Sistema: Idioma/Tema/API | Antigravity-Manager"
sidebarTitle: "Configure sistema em 5 minutos"
subtitle: "Capacidades do Sistema: Idioma/Tema/API | Antigravity-Manager"
description: "Aprenda idioma, tema, bandeja e servidor de API das Antigravity Tools. Domine fallback de i18n, inicialização automática, chamada de interface HTTP e regras de efeito de reinício."
tags:
  - "configurações do sistema"
  - "i18n"
  - "tema"
  - "atualização"
  - "bandeja"
  - "API HTTP"
prerequisite:
  - "start-first-run-data"
  - "advanced-config"
order: 9
---

# Capacidades do Sistema: Multi-idioma/Tema/Atualização/Inicialização Automática/Servidor de API HTTP

Você mudou tema para dark, mas interface ainda está clara; você fechou janela explicitamente, mas processo continua rodando em segundo plano; você quer que ferramentas externas mudem conta atual, mas também não quer expor proxy para LAN.

Esta aula foca "capacidades de produto" das Antigravity Tools como aplicativo de desktop: alternância de interface multi-idioma e tema, verificação de atualização e upgrade, bandeja residuário após fechar janela e inicialização automática, e servidor de API HTTP que só vincula `127.0.0.1` para programas externos chamarem.

## O que são capacidades do sistema?

**Capacidades do sistema** refere-se a "capacidades de produto" das Antigravity Tools como aplicativo de desktop: alternância de interface multi-idioma e tema, verificação e upgrade de atualização, bandeja residuário e inicialização automática após fechar janela, e fornecer servidor de API HTTP que só vincula `127.0.0.1` para programas externos chamarem.

## O que você poderá fazer após concluir

- Alternar idioma/tema, e esclarecer quais são "imediatamente em vigor"
- Entender claramente diferença entre "fechar janela" e "sair do programa", e o que bandeja pode fazer
- Saber condições de disparo, intervalo e arquivo de gravação de verificação de atualização automática
- Ativar servidor de API HTTP e rodar verificação de vivacidade/alternância de conta com `curl`

## 🎒 Preparação antes de começar

- Você sabe onde está o diretório de dados (ver [Primeira execução: diretório de dados, logs, bandeja e inicialização automática](../../start/first-run-data/））
- Você sabe que `gui_config.json` é a única fonte de verdade de configuração de gravação (ver [Explicação completa de configuração: AppConfig/ProxyConfig, local de gravação e semântica de atualização a quente](../config/））

## Ideia central

Dividir estas capacidades em duas categorias, será mais fácil lembrar:

1. Capacidades "impulsionadas por configuração": idioma, tema serão gravados em `gui_config.json` (frontend chama `save_config`).
2. Capacidades de "gravação independente": configurações de atualização e de API HTTP cada uma tem arquivo JSON separado; bandeja e comportamento de fechamento são controlados pelo lado Tauri.

## Siga-me

### Passo 1: Alternar idioma (imediatamente em vigor + persistência automática)

**Por que**
Alternar idioma é o que mais facilmente faz pessoas pensarem "precisa reiniciar". Aqui a implementação é: UI muda imediatamente, ao mesmo tempo grava `language` de volta na configuração.

Operação: abra `Settings` -> `General`, na caixa suspensa de idioma escolha um idioma.

Você verá duas coisas quase simultâneas:

- UI imediatamente muda para novo idioma (frontend chama diretamente `i18n.changeLanguage(newLang)`).
- Configuração é persistida (frontend chama `updateLanguage(newLang)`, internamente disparará `save_config`).

::: info De onde vêm pacotes de idioma?
Frontend inicializa recursos multi-idioma com `i18next`, e define `fallbackLng: "en"`. Ou seja: quando certa chave falta tradução, voltará para inglês.
:::

### Passo 2: Alternar tema (light/dark/system)

**Por que**
Tema não só afeta CSS, mas também afeta cor de fundo de janela Tauri, `data-theme` do DaisyUI e classe `dark` do Tailwind.

Operação: em `Settings` -> `General`, mude tema para `light` / `dark` / `system`.

Você deve ver:

- Tema entra em vigor imediatamente (`ThemeManager` lerá configuração e aplicará ao `document.documentElement`).
- Quando tema é `system`, mudança de cor clara/escura do sistema será sincronizada em tempo real com aplicativo (ouvindo `prefers-color-scheme`).

::: warning Uma exceção no Linux
`ThemeManager` tentará chamar `getCurrentWindow().setBackgroundColor(...)` para definir cor de fundo da janela, mas na plataforma Linux pulará este passo (há comentário no código-fonte: janela transparente + softbuffer pode causar crash).
:::

### Passo 3: Inicialização automática (e por que vem com `--minimized`)

**Por que**
Inicialização automática não é "campo de configuração", mas item de registro de nível de sistema (plugin autostart do Tauri).

Operação: em `Settings` -> `General`, defina "inicializar automaticamente ao ligar" para ativar/desativar.

Você deve ver:

- Ao alternar, chamará diretamente `toggle_auto_launch(enable)` do backend.
- Ao inicializar a página, chamará `is_auto_launch_enabled()`, exibindo estado real (não depende de cache local).

Suplemento: ao inicializar plugin de autostart, aplicativo passou parâmetro `--minimized`, então "inicializar ao ligar" geralmente iniciará em forma minimizada/em segundo plano (comportamento específico depende de como frontend processa este parâmetro).

### Passo 4: Entender "fechar janela" e "sair do programa"

**Por que**
Muitos aplicativos de desktop são "fechar é sair", mas comportamento padrão das Antigravity Tools é "fechar é esconder na bandeja".

Você deve saber:

- Após clicar botão de fechar da janela, Tauri interceptará evento de fechamento e `hide()`, em vez de sair do processo.
- Menu da bandeja tem `Show`/`Quit`: para sair totalmente, deve usar `Quit`.
- Texto exibido na bandeja segue `config.language` (ao criar bandeja lê configuração de idioma e obtém texto traduzido; após atualização de configuração ouvir evento `config://updated` para atualizar menu da bandeja).

### Passo 5: Verificação de atualização (disparo automático + verificação manual)

**Por que**
Bloco de atualização usa duas coisas simultaneamente:

- Lógica de "verificação de versão" personalizada: puxa última versão do GitHub Releases, julga se há atualização.
- Tauri Updater: responsável por baixar e instalar, depois `relaunch()`.

Você pode usar assim:

1. Verificação automática: após início do aplicativo, chamará `should_check_updates`, se necessário verificar então exibir `UpdateNotification`, e imediatamente atualizar `last_check_time`.
2. Verificação manual: na página Settings, clique "verificar atualizações" (chama `check_for_updates`, e exibe resultados na UI).

::: tip De onde vem intervalo de atualização?
Backend grava configurações de atualização no diretório de dados em `update_settings.json`, padrão `auto_check=true`, `check_interval_hours=24`.
:::

### Passo 6: Ativar servidor de API HTTP (só vincula local)

**Por que**
Se você quer que programas externos (como plugin VS Code) "mudem conta/atualizem cota/leiam logs", servidor de API HTTP é mais adequado que porta de proxy: fixamente vincula `127.0.0.1`, só aberto para local.

Operação: em `Settings` -> `Advanced`, área "HTTP API":

1. Ative interruptor.
2. Defina porta e clique salvar.

Você deve ver: UI exibirá "precisa reiniciar" (porque backend só lê `http_api_settings.json` e inicia serviço ao iniciar).

### Passo 7: Verificar API HTTP com curl (vivacidade/conta/alternância/logs)

**Por que**
Você precisa de um ciclo de verificação repetível: pode conectar `health`, pode listar contas, pode disparar alternância/atualização e entender que são tarefas assíncronas.

Porta padrão é `19527`. Se você mudou porta, substitua `19527` abaixo por valor real.

::: code-group

```bash [macOS/Linux]
 # Vivacidade
curl -sS "http://127.0.0.1:19527/health" && echo

 # Listar contas (incluindo resumo de quota）
curl -sS "http://127.0.0.1:19527/accounts" | head -n 5

 # Obter conta atual
curl -sS "http://127.0.0.1:19527/accounts/current" | head -n 5

 # Disparar alternância de conta (note: retorna 202, executa assincronamente em segundo plano)
curl -sS -i \
  -H 'Content-Type: application/json' \
  -d '{"account_id":"<account_id>"}' \
  "http://127.0.0.1:19527/accounts/switch"

 # Disparar atualização de todas as cotas (também 202, assíncrono)
curl -sS -i -X POST "http://127.0.0.1:19527/accounts/refresh"

 # Ler logs de proxy (limit/offset/filter/errors_only）
curl -sS "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | head -n 5
```

```powershell [Windows]
 # Vivacidade
Invoke-RestMethod "http://127.0.0.1:19527/health"

 # Listar contas
Invoke-RestMethod "http://127.0.0.1:19527/accounts" | ConvertTo-Json -Depth 5

 # Obter conta atual
Invoke-RestMethod "http://127.0.0.1:19527/accounts/current" | ConvertTo-Json -Depth 5

 # Disparar alternância de conta (retorna 202)
$body = @{ account_id = "<account_id>" } | ConvertTo-Json
Invoke-WebRequest -Method Post -ContentType "application/json" -Body $body "http://127.0.0.1:19527/accounts/switch" | Select-Object -ExpandProperty StatusCode

 # Disparar atualização de todas as cotas (retorna 202)
Invoke-WebRequest -Method Post "http://127.0.0.1:19527/accounts/refresh" | Select-Object -ExpandProperty StatusCode

 # Ler logs de proxy
Invoke-RestMethod "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | ConvertTo-Json -Depth 5
```

:::

**Você deve ver**:

- `/health` retorna JSON estilo `{"status":"ok","version":"..."}`.
- `/accounts/switch` retorna 202 (Accepted), e exibe "task started". A alternância real é executada em segundo plano.

## Ponto de verificação ✅

- Você pode explicar: por que idioma/tema "mudou e entrou em vigor imediatamente", enquanto porta de API HTTP precisa reiniciar
- Você pode explicar: por que fechar janela não sai, e de onde realmente sair
- Você pode conectar `curl` `/health` e `/accounts`, e entender `/accounts/switch` é assíncrono

## Avisos sobre armadilhas

1. Servidor de API HTTP fixamente vincula `127.0.0.1`, é diferente de `proxy.allow_lan_access`.
2. Lógica de "se verificar ou não" de verificação de atualização é determinada no início do App; uma vez disparado, primeiro atualiza `last_check_time`, mesmo se verificação subsequente falhar não exibirá janela novamente em pouco tempo.
3. "fechar janela não sair" é projeto: para liberar recursos de processo, use `Quit` da bandeja.

## Resumo desta aula

- Idioma: UI muda imediatamente + grava de volta na configuração (`i18n.changeLanguage` + `save_config`)
- Tema: unificado por `ThemeManager` para `data-theme`, classe `dark` e cor de fundo de janela (Linux tem exceção)
- Atualização: ao iniciar determina por `update_settings.json` se exibir janela, instalação responsável pelo Tauri Updater
- API HTTP: padrão ativado, só acessível localmente, configuração gravada em `http_api_settings.json`, mudar porta precisa reiniciar

## Próxima aula

> Próxima aula entrará **Implantação de servidor: Docker noVNC vs Headless Xvfb (advanced-deployment)**, movendo desktop para rodar em NAS/servidor.

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Tema | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Inicialização de i18n e fallback | [`src/i18n.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/i18n.ts#L1-L67) | 1-67 |
| Settings: idioma/tema/inicialização automática/configuração de atualização/configuração de API HTTP | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L16-L730) | 16-730 |
| App: sincronizar idioma + disparar verificação de atualização ao iniciar | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L52-L124) | 52-124 |
| ThemeManager: aplicar tema, ouvir tema do sistema, escrever localStorage | [`src/components/common/ThemeManager.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/ThemeManager.tsx#L1-L82) | 1-82 |
| UpdateNotification: verificar atualização, baixar automaticamente e instalar e relaunch | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L1-L217) | 1-217 |
| Verificação de atualização: GitHub Releases + intervalo de verificação | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L1-L187) | 1-187 |
| Bandeja: gerar menu por idioma + ouvir `config://updated` para atualizar | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L1-L255) | 1-255 |
| Gravação de configuração: emitir `config://updated` + atualizar proxy em execução a quente | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| Comandos de inicialização automática: toggle/is_enabled (compatibilidade com disable Windows) | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L1-L39) | 1-39 |
| Tauri: inicializar autostart/updater + fechar janela para hide + iniciar API HTTP | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L160) | 50-160 |
| API HTTP: configuração de gravação + rotas (health/accounts/switch/refresh/logs) + só vincula 127.0.0.1 | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L1-L95) | 1-95 |
| API HTTP: Server bind e registro de rotas | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L51-L94) | 51-94 |
| Comandos de configuração de API HTTP: get/save | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L773-L789) | 773-789 |

</details>
