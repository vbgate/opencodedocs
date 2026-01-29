---
title: "Migração de Contas: Backup/Migração a Quente | Antigravity Manager"
sidebarTitle: "Migre Pool de Contas em 3 Minutos"
subtitle: "Migração de Contas: Backup/Migração a Quente"
description: "Aprenda backup e migração de contas do Antigravity Manager. Suporta importar/exportar JSON, migrar a quente de Antigravity/IDE, migrar de diretório de dados V1, e sincronizar automaticamente conta atual logada."
tags:
  - "Gerenciamento de Contas"
  - "Backup"
  - "Migração"
  - "Importar/Exportar"
  - "state.vscdb"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
duration: 12
order: 5
---
# Backup e Migração de Contas: Importar/Exportar, Migração a Quente V1/DB

O que você realmente quer "fazer backup", na verdade não são números de cota, mas o `refresh_token` que permite que contas relogue. Esta lição deixa claro vários meios de migração do Antigravity Tools: importar/exportar JSON, importar de `state.vscdb`, importar de diretório de dados V1, e como funciona sincronização automática.

## O que você poderá fazer após completar

- Exportar pool de contas para um arquivo JSON (só contém email + refresh_token)
- Em nova máquina importar este JSON, recuperar rapidamente pool de contas
- Importar diretamente "conta atual logada" de Antigravity/IDE `state.vscdb` (suporta caminho padrão e caminho personalizado)
- Importar automaticamente escaneando e lendo contas antigas de diretório de dados V1
- Entender o que "sincronizar conta atual automaticamente" realmente faz, quando pulará

## Seu dilema atual

- Após reinstalar sistema/trocar computador, pool de contas precisa ser adicionado novamente, custo alto
- Você mudou conta logada no Antigravity/IDE, mas "conta atual" do Manager não seguiu mudança
- Você usou versão V1/versão script antes, só tem arquivos de dados antigos na mão, não sabe se pode migrar diretamente

## Quando usar essa técnica

- Você quer mover pool de contas para outra máquina (desktop/servidor/container)
- Você trata Antigravity como "entrada de login autoritativa", quer Manager sincronizar conta atual automaticamente
- Você quer migrar contas da versão antiga (diretório de dados V1)

## 🎒 Preparação antes de começar

- Você já consegue abrir Antigravity Tools, e tem pelo menos uma conta no pool de contas
- Você sabe dados de conta pertencem a informação sensível (especialmente `refresh_token`)

::: warning Lembrete de segurança: trate arquivo de backup como senha
Arquivo JSON exportado contém `refresh_token`. Qualquer pessoa que tenha ele, pode usá-lo para renovar access token. Não carregue arquivo de backup para link público de nuvem, não mande para grupo, não submeta para Git.
:::

## Ideia Principal

No fundo, "migração" do Antigravity Tools são apenas duas coisas:

1) Encontrar `refresh_token` disponível
2) Usar para trocar access token, e obter email real do Google, depois escrever conta no pool de contas local

Ele fornece três entradas:

- Importar/Exportar JSON: adequado quando você quer explicitamente fazer "backup controlável"
- Importar DB: adequado quando você trata estado de login Antigravity/IDE como fonte autoritativa (por padrão procura `state.vscdb`, também suporta escolher arquivo manualmente)
- Importar V1: adequado para escanear automaticamente e migrar de diretório de dados antigo

Além disso há "sincronização automática": ela lerá periodicamente refresh_token do DB, se diferente da conta atual do Manager, executará automaticamente uma importação de DB; se igual, pulará diretamente (economiza tráfego).

## Siga-me

### Passo 1: Exportar pool de contas (backup JSON)

**Por que**
Esta é maneira mais estável e controlável de migração. Você obtém um arquivo, pode recuperar pool de contas em outra máquina.

Operação: entre na página `Accounts`, clique botão de exportar.

- Se você configurou `default_export_path` nas configurações, exportação escreverá diretamente neste diretório, e usará nome de arquivo `antigravity_accounts_YYYY-MM-DD.json`.
- Se não configurou diretório padrão, surgirá diálogo de salvar do sistema para você escolher caminho.

Conteúdo do arquivo exportado aproximadamente assim (cada item no array só mantém campos necessários):

```json
[
  {
    "email": "alice@example.com",
    "refresh_token": "1//xxxxxxxxxxxxxxxxxxxxxxxx"
  },
  {
    "email": "bob@example.com",
    "refresh_token": "1//yyyyyyyyyyyyyyyyyyyyyyyy"
  }
]
```

**Você deve ver**: Página avisa exportação bem-sucedida, e mostra caminho salvo.

### Passo 2: Importar JSON em nova máquina (recuperar pool de contas)

**Por que**
Importação chamará lógica "adicionar conta" uma por uma, usa `refresh_token` para puxar email real e escreve no pool de contas.

Operação: ainda na página `Accounts`, clique "Importar JSON", escolha arquivo que você acabou de exportar.

Requisitos de formato (deve conter pelo menos 1 registro válido):

- Deve ser array JSON
- Sistema só importará entradas que contenham `refresh_token` e comecem com `1//`

**Você deve ver**: Após importação completar, contas importadas aparecem na lista de contas.

::: tip Se você importa enquanto Proxy está rodando
Cada vez "adicionar conta" com sucesso, backend tentará reload token pool de proxy reverso, fazendo nova conta entrar em vigor imediatamente.
:::

### Passo 3: Importar "conta atual logada" de `state.vscdb`

**Por que**
Às vezes você não quer manter arquivo de backup, só quer "tomar estado de login Antigravity/IDE como referência". Importação de DB é preparada para este cenário.

Operação: entre na página `Accounts`, clique **Add Account**, mude para aba `Import`:

- Clique "Importar de banco de dados" (usar caminho DB padrão)
- Ou clique "Custom DB (state.vscdb)" para escolher manualmente um arquivo `*.vscdb`

Caminho DB padrão é cross-platform (também prioriza reconhecer `--user-data-dir` ou modo portable):

::: code-group

```text [macOS]
~/Library/Application Support/Antigravity/User/globalStorage/state.vscdb
```

```text [Windows]
%APPDATA%\Antigravity\User\globalStorage/state.vscdb
```

```text [Linux]
~/.config/Antigravity/User/globalStorage/state.vscdb
```

:::

**Você deve ver**:

- Após importação bem-sucedida, esta conta será automaticamente definida como "conta atual" do Manager
- Sistema disparará automaticamente uma atualização de cota

### Passo 4: Migrar de diretório de dados V1 (importar versão antiga)

**Por que**
Se você usou versão V1/versão script antes, Manager permite escanear diretório de dados antigo diretamente e tentar importar.

Operação: na aba `Import`, clique "Importar V1".

Ele procurará este caminho no seu diretório home (e arquivo de índice dentro):

```text
~/.antigravity-agent/
  - antigravity_accounts.json
  - accounts.json
```

**Você deve ver**: Após importação completar, contas aparecem na lista; se arquivo de índice não encontrado, backend retornará erro `V1 account data file not found`.

### Passo 5 (opcional): Habilitar "sincronizar conta atual automaticamente"

**Por que**
Quando você muda conta logada no Antigravity/IDE, Manager pode detectar se refresh_token no DB mudou em intervalos fixos, e importar automaticamente ao mudar.

Operação: entre em `Settings`, habilite `auto_sync`, e defina `sync_interval` (unidade: segundos).

**Você deve ver**: Após habilitar, executará uma sincronização imediatamente; depois executar periodicamente por intervalo. Se refresh_token no DB for o mesmo da conta atual, pulará diretamente, não importará repetidamente.

## Ponto de verificação ✅

- Você pode ver contas importadas na lista `Accounts`
- Você pode ver "conta atual" já mudou para a que você espera (importação de DB define automaticamente como atual)
- Após iniciar Proxy, novas contas importadas podem ser usadas normalmente para solicitação (baseado em resultado de chamada real)

## Aviso sobre armadilhas

| Cenário | O que você pode fazer (❌) | Prática recomendada (✓) |
|--- | --- | ---|
| Segurança do arquivo de backup | Tratar JSON exportado como arquivo de configuração comum e mandar aleatoriamente | Tratar JSON como senha, minimizar escopo de transmissão, evitar exposição em rede pública |
| Importação de JSON falha | JSON não é array, ou refresh_token não tem prefixo `1//` | Use JSON exportado deste projeto como modelo, mantenha nomes de campos e estrutura consistentes |
| Importação de DB não encontra dados | Antigravity nunca logou, ou DB falta `jetskiStateSync.agentManagerInitState` | Primeiro confirme Antigravity/IDE já logou, depois tente importar; se necessário use Custom DB escolher arquivo certo |
| Após importação V1 conta não disponível | refresh_token antigo inválido | Delete esta conta depois adicione novamente com OAuth/novo refresh_token (baseado em aviso de erro) |
| auto_sync muito frequente | `sync_interval` definido muito pequeno, escaneia DB frequentemente | Trate como "acompanhar estado", defina intervalo para frequência que você pode aceitar |

## Resumo da lição

- Importar/Exportar JSON é maneira mais controlável de migração: arquivo de backup só retém `email + refresh_token`
- Importar de DB adequado para "tomar conta atual logada Antigravity/IDE como referência", e definirá automaticamente como conta atual do Manager
- Importar de V1 escaneia `~/.antigravity-agent` e compatível com múltiplos formatos antigos
- auto_sync compara refresh_token; igual pula, não importará repetidamente

## Próximo aviso de lição

> Na próxima lição realmente usamos "pool de contas após migração": **[Iniciar Proxy Reverso Local e Conectar Primeiro Cliente (/healthz + Configuração SDK)](../proxy-and-first-client/)**.
>
> Você aprenderá:
> - Como iniciar/parar Proxy, e usar `/healthz` para verificação mínima
> - Como configurar Base URL em SDK/cliente

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
|--- | --- | ---|
| Exportar/Importar JSON de Accounts (`save_text_file` / `read_text_file`) | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L458-L578) | 458-578 |
| Dashboard exportar JSON de contas | [`src/pages/Dashboard.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Dashboard.tsx#L113-L148) | 113-148 |
| Página Import: botões Importar DB / Custom DB / Importar V1 | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L491-L539) | 491-539 |
| Adicionar conta: ignora email frontend, usa refresh_token para obter email real, atualiza cota automaticamente, Proxy hot reload | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
|--- | --- | ---|
| Importação de DB: extrair refresh_token de `state.vscdb` (ItemTable + base64 + protobuf) | [`src-tauri/src/modules/migration.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/migration.rs#L192-L267) | 192-267 |
|--- | --- | ---|
| Após importação de DB define automaticamente "conta atual" e atualiza cota | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L495-L511) | 495-511 |
| auto_sync: compara refresh_token, igual pula diretamente; muda então dispara importação de DB | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L532-L564) | 532-564 |
| Tarefa de background frontend: chama `syncAccountFromDb()` periodicamente por `sync_interval` | [`src/components/common/BackgroundTaskRunner.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/BackgroundTaskRunner.tsx#L43-L72) | 43-72 |

</details>
