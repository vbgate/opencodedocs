---
title: "Modo Remoto: Métodos de Configuração | plannotator"
subtitle: "Modo Remoto: Métodos de Configuração | plannotator"
sidebarTitle: "Acessar Plannotator em Ambiente Remoto"
description: "Aprenda a configurar o modo remoto do Plannotator. Configure portas fixas em ambientes SSH, Devcontainer e WSL, configure o encaminhamento de portas e acesse a interface de revisão remota pelo navegador local."
tags:
  - "Desenvolvimento Remoto"
  - "Devcontainer"
  - "Encaminhamento de Portas"
  - "SSH"
  - "WSL"
prerequisite:
  - "start-getting-started"
order: 4
---

# Configuração do Modo Remoto/Devcontainer

## O Que Você Vai Aprender

- Usar o Plannotator em um servidor remoto conectado via SSH
- Configurar e acessar o Plannotator em um devcontainer do VS Code
- Usar o Plannotator em ambiente WSL (Windows Subsystem for Linux)
- Configurar encaminhamento de portas para acessar o Plannotator do ambiente remoto pelo navegador local

## Seu Problema Atual

Você está usando o Claude Code ou OpenCode em um servidor remoto, devcontainer ou ambiente WSL. Quando a IA gera um plano ou precisa de revisão de código, o Plannotator tenta abrir o navegador no ambiente remoto — mas não há interface gráfica lá, ou você prefere visualizar a interface de revisão no navegador local.

## Quando Usar Esta Técnica

Cenários típicos que requerem o modo Remoto/Devcontainer:

| Cenário | Descrição |
| --- | --- |
| **Conexão SSH** | Você está conectado a um servidor de desenvolvimento remoto via SSH |
| **Devcontainer** | Você está desenvolvendo usando devcontainer no VS Code |
| **WSL** | Você está desenvolvendo Linux no Windows usando WSL |
| **Ambiente Cloud** | Seu código está rodando em um container ou máquina virtual na nuvem |

## Conceito Principal

Usar o Plannotator em um ambiente remoto requer resolver dois problemas:

1. **Porta Fixa**: Ambientes remotos não podem selecionar automaticamente portas aleatórias porque o encaminhamento de portas precisa ser configurado
2. **Acesso ao Navegador**: Ambientes remotos não têm interface gráfica, então você precisa acessar pelo navegador da máquina local

O Plannotator entra automaticamente no "modo remoto" ao detectar a variável de ambiente `PLANNOTATOR_REMOTE`:
- Usa uma porta fixa (padrão 19432) em vez de porta aleatória
- Pula a abertura automática do navegador
- Exibe a URL no terminal para você acessar manualmente no navegador local

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos

Antes de iniciar este tutorial, certifique-se de que:
- Você completou o [Início Rápido](../../start/getting-started/)
- Você instalou e configurou o [Plugin Claude Code](../../start/installation-claude-code/) ou [Plugin OpenCode](../../start/installation-opencode/)
- Você entende os conceitos básicos de configuração SSH ou devcontainer

:::

---

## Siga Comigo

### Passo 1: Entenda as Variáveis de Ambiente do Modo Remoto

O modo remoto do Plannotator depende de três variáveis de ambiente:

| Variável de Ambiente | Descrição | Valor Padrão |
| --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Ativa o modo remoto | Não definido (modo local) |
| `PLANNOTATOR_PORT` | Número da porta fixa | Aleatório (local) / 19432 (remoto) |
| `PLANNOTATOR_BROWSER` | Caminho personalizado do navegador | Navegador padrão do sistema |

**Por quê**

- `PLANNOTATOR_REMOTE` informa ao Plannotator que está em ambiente remoto e não deve tentar abrir o navegador
- `PLANNOTATOR_PORT` define uma porta fixa para facilitar a configuração do encaminhamento de portas
- `PLANNOTATOR_BROWSER` (opcional) especifica o caminho do navegador a ser usado na máquina local

---

### Passo 2: Configurar em Servidor Remoto SSH

#### Configurar Encaminhamento de Porta SSH

Edite seu arquivo de configuração SSH `~/.ssh/config`:

```bash
Host your-server
    HostName your-server.com
    User your-username
    LocalForward 9999 localhost:9999
```

**Você deve ver**:
- A linha `LocalForward 9999 localhost:9999` foi adicionada
- Isso encaminha o tráfego da porta local 9999 para a porta 9999 do servidor remoto

#### Definir Variáveis de Ambiente no Servidor Remoto

Após conectar ao servidor remoto, defina as variáveis de ambiente no terminal:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

**Por quê**
- `PLANNOTATOR_REMOTE=1` ativa o modo remoto
- `PLANNOTATOR_PORT=9999` usa a porta fixa 9999 (consistente com o número da porta na configuração SSH)

::: tip Configuração Persistente
Se definir variáveis de ambiente manualmente a cada conexão for inconveniente, você pode adicionar essas variáveis ao seu arquivo de configuração do shell (`~/.bashrc` ou `~/.zshrc`):

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Usar o Plannotator

Agora você pode usar o Claude Code ou OpenCode normalmente no servidor remoto. Quando a IA gerar um plano ou precisar de revisão de código:

```bash
# No servidor remoto, o terminal exibirá uma mensagem como:
[Plannotator] Server running at http://localhost:9999
[Plannotator] Access from your local machine: http://localhost:9999
```

**Você deve ver**:
- O terminal mostra a URL do Plannotator
- O ambiente remoto não abre o navegador (comportamento normal)

#### Acessar no Navegador Local

Abra no navegador da sua máquina local:

```
http://localhost:9999
```

**Você deve ver**:
- A interface de revisão do Plannotator é exibida normalmente
- Você pode realizar revisão de planos ou revisão de código como no ambiente local

**Checkpoint ✅**:
- [ ] Encaminhamento de porta SSH configurado
- [ ] Variáveis de ambiente definidas
- [ ] Terminal do servidor remoto exibe a URL
- [ ] Navegador local pode acessar a interface de revisão

---

### Passo 3: Configurar no VS Code Devcontainer

#### Configurar o devcontainer

Edite seu arquivo `.devcontainer/devcontainer.json`:

```json
{
  "name": "Your Devcontainer",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",

  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },

  "forwardPorts": [9999]
}
```

**Por quê**
- `containerEnv` define as variáveis de ambiente dentro do container
- `forwardPorts` instrui o VS Code a encaminhar automaticamente a porta do container para o local

#### Reconstruir e Iniciar o devcontainer

1. Abra a paleta de comandos do VS Code (`Ctrl+Shift+P` ou `Cmd+Shift+P`)
2. Digite `Dev Containers: Rebuild Container` e execute
3. Aguarde a reconstrução do container ser concluída

**Você deve ver**:
- O canto inferior direito do VS Code mostra o status do encaminhamento de porta (geralmente um pequeno ícone)
- Ao clicar, você pode ver que "Port 9999" está encaminhada

#### Usar o Plannotator

Use o Claude Code ou OpenCode normalmente no devcontainer. Quando a IA gerar um plano:

```bash
# Saída do terminal dentro do container:
[Plannotator] Server running at http://localhost:9999
```

**Você deve ver**:
- O terminal mostra a URL do Plannotator
- O container não abre o navegador (comportamento normal)

#### Acessar no Navegador Local

Abra no navegador da sua máquina local:

```
http://localhost:9999
```

**Você deve ver**:
- A interface de revisão do Plannotator é exibida normalmente

**Checkpoint ✅**:
- [ ] Configuração do devcontainer com variáveis de ambiente e encaminhamento de porta adicionados
- [ ] Container reconstruído
- [ ] VS Code mostra que a porta está encaminhada
- [ ] Navegador local pode acessar a interface de revisão

---

### Passo 4: Configurar no Ambiente WSL

A configuração do ambiente WSL é semelhante à conexão SSH, mas você não precisa configurar manualmente o encaminhamento de porta — o WSL encaminha automaticamente o tráfego localhost para o sistema Windows.

#### Definir Variáveis de Ambiente

Defina as variáveis de ambiente no terminal WSL:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

::: tip Configuração Persistente
Adicione essas variáveis de ambiente ao seu arquivo de configuração do shell WSL (`~/.bashrc` ou `~/.zshrc`):

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Usar o Plannotator

Use o Claude Code ou OpenCode normalmente no WSL:

```bash
# Saída do terminal WSL:
[Plannotator] Server running at http://localhost:9999
```

**Você deve ver**:
- O terminal mostra a URL do Plannotator
- O WSL não abre o navegador (comportamento normal)

#### Acessar no Navegador Windows

Abra no navegador do Windows:

```
http://localhost:9999
```

**Você deve ver**:
- A interface de revisão do Plannotator é exibida normalmente

**Checkpoint ✅**:
- [ ] Variáveis de ambiente definidas
- [ ] Terminal WSL exibe a URL
- [ ] Navegador Windows pode acessar a interface de revisão

---

## Armadilhas Comuns

### Porta Já em Uso

Se você ver um erro como:

```
Error: bind: EADDRINUSE: address already in use :::9999
```

**Solução**:
1. Mude o número da porta:
   ```bash
   export PLANNOTATOR_PORT=10000  # Mude para uma porta não utilizada
   ```
2. Ou encerre o processo que está usando a porta 9999:
   ```bash
   lsof -ti:9999 | xargs kill -9
   ```

### Encaminhamento de Porta SSH Não Funciona

Se o navegador local não consegue acessar o Plannotator:

**Lista de verificação**:
- [ ] O número da porta em `LocalForward` no arquivo de configuração SSH corresponde ao `PLANNOTATOR_PORT`
- [ ] Você desconectou e reconectou via SSH
- [ ] O firewall não está bloqueando o encaminhamento de porta

### Encaminhamento de Porta do Devcontainer Não Funciona

Se o VS Code não está encaminhando automaticamente a porta:

**Solução**:
1. Verifique a configuração `forwardPorts` em `.devcontainer/devcontainer.json`
2. Encaminhe a porta manualmente:
   - Abra a paleta de comandos do VS Code
   - Execute `Forward a Port`
   - Digite o número da porta `9999`

### Não Consegue Acessar no WSL

Se o navegador Windows não consegue acessar o Plannotator no WSL:

**Solução**:
1. Verifique se as variáveis de ambiente estão definidas corretamente
2. Tente usar `0.0.0.0` em vez de `localhost` (depende da versão do WSL e configuração de rede)
3. Verifique as configurações do firewall do Windows

---

## Resumo da Lição

Pontos-chave do modo Remoto/Devcontainer:

| Ponto | Descrição |
| --- | --- |
| **Variáveis de Ambiente** | `PLANNOTATOR_REMOTE=1` ativa o modo remoto |
| **Porta Fixa** | Use `PLANNOTATOR_PORT` para definir uma porta fixa (padrão 19432) |
| **Encaminhamento de Porta** | SSH/Devcontainer requer configuração de encaminhamento de porta, WSL encaminha automaticamente |
| **Acesso Manual** | O modo remoto não abre o navegador automaticamente, você precisa acessar manualmente no navegador local |
| **Persistência** | Adicione variáveis de ambiente aos arquivos de configuração para evitar configuração repetida |

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Detalhes da Configuração de Variáveis de Ambiente](../environment-variables/)**.
>
> Você aprenderá:
> - Todas as variáveis de ambiente disponíveis do Plannotator
> - A função e o valor padrão de cada variável de ambiente
> - Como combinar variáveis de ambiente para diferentes cenários

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Detecção de sessão remota | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L16-L29) | 16-29 |
| Obtenção da porta do servidor | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L34-L49) | 34-49 |
| Lógica de inicialização do servidor | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L97) | 91-97 |
| Lógica de abertura do navegador | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Detecção de WSL | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L11-L34) | 11-34 |

**Constantes-chave**:
- `DEFAULT_REMOTE_PORT = 19432`: Número da porta padrão do modo remoto

**Funções-chave**:
- `isRemoteSession()`: Detecta se está rodando em uma sessão remota
- `getServerPort()`: Obtém a porta do servidor (porta fixa para remoto, porta aleatória para local)
- `openBrowser(url)`: Abre o navegador multiplataforma

</details>
