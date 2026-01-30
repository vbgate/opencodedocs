---
title: "Claude Code: Instalação e Configuração | Plannotator"
sidebarTitle: "Instalação em 3 min"
subtitle: "Claude Code: Instalação e Configuração"
description: "Aprenda a instalar o plugin Plannotator no Claude Code. Configure em 3 minutos com suporte ao sistema de plugins e Hook manual, compatível com macOS, Linux e Windows, incluindo ambientes remotos e Devcontainer."
tags:
  - "installation"
  - "claude-code"
  - "getting-started"
prerequisite:
  - "start-getting-started"
order: 2
---

# Instalando o Plugin Claude Code

## O que você vai aprender

- Ativar a funcionalidade de revisão de planos do Plannotator no Claude Code
- Escolher o método de instalação adequado (sistema de plugins ou Hook manual)
- Verificar se a instalação foi bem-sucedida
- Configurar corretamente o Plannotator em ambientes remotos/Devcontainer

## O problema que você enfrenta

Ao usar o Claude Code, os planos gerados pela IA só podem ser lidos no terminal, dificultando revisões e feedbacks precisos. Você quer:
- Visualizar os planos da IA no navegador
- Fazer anotações precisas nos planos: excluir, substituir, inserir
- Dar instruções claras de modificação para a IA de uma só vez

## Quando usar esta técnica

Ideal para os seguintes cenários:
- Você está usando Claude Code + Plannotator pela primeira vez
- Você precisa reinstalar ou atualizar o Plannotator
- Você quer usar em ambientes remotos (SSH, Devcontainer, WSL)

## Conceito principal

A instalação do Plannotator é dividida em duas partes:
1. **Instalar o comando CLI**: Este é o runtime principal, responsável por iniciar o servidor local e o navegador
2. **Configurar o Claude Code**: Através do sistema de plugins ou Hook manual, fazer o Claude Code chamar automaticamente o Plannotator ao concluir um plano

Após a instalação, quando o Claude Code chamar `ExitPlanMode`, o Plannotator será acionado automaticamente, abrindo a interface de revisão de planos no navegador.

## 🎒 Preparação antes de começar

::: warning Verificação de pré-requisitos

- [ ] Claude Code 2.1.7 ou superior instalado (requer suporte a Permission Request Hooks)
- [ ] Permissão para executar comandos no terminal (Linux/macOS requer sudo ou instalação no diretório home)

:::

## Siga os passos

### Passo 1: Instalar o comando CLI do Plannotator

Primeiro, instale a ferramenta de linha de comando do Plannotator.

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

**Você deve ver**: O terminal mostrando o progresso da instalação, e ao final a mensagem `plannotator {versão} installed to {caminho}/plannotator`

**Checkpoint ✅**: Execute o seguinte comando para verificar a instalação:

::: code-group

```bash [macOS / Linux]
which plannotator
```

```powershell [Windows PowerShell]
Get-Command plannotator
```

```cmd [Windows CMD]
where plannotator
```

:::

Você deve ver o caminho de instalação do comando Plannotator, por exemplo `/usr/local/bin/plannotator` ou `$HOME/.local/bin/plannotator`.

### Passo 2: Instalar o plugin no Claude Code

Abra o Claude Code e execute os seguintes comandos:

```bash
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**Você deve ver**: Mensagem de confirmação de instalação bem-sucedida do plugin.

::: danger Importante: Reinicie o Claude Code

Após instalar o plugin, **é obrigatório reiniciar o Claude Code**, caso contrário os Hooks não funcionarão.

:::

### Passo 3: Verificar a instalação

Após reiniciar, execute o seguinte comando no Claude Code para testar a funcionalidade de revisão de código:

```bash
/plannotator-review
```

**Você deve ver**:
- O navegador abrindo automaticamente a interface de revisão de código do Plannotator
- O terminal exibindo "Opening code review..." e aguardando seu feedback de revisão

Se você vir essa saída, parabéns, a instalação foi bem-sucedida!

::: tip Observação
A funcionalidade de revisão de planos é acionada automaticamente quando o Claude Code chama `ExitPlanMode`, sem necessidade de executar comandos de teste manualmente. Você pode testar essa funcionalidade durante o uso real do modo de planejamento.
:::

### Passo 4: (Opcional) Instalação manual do Hook

Se você não quiser usar o sistema de plugins, ou precisar usar em ambientes CI/CD, pode configurar o Hook manualmente.

Edite o arquivo `~/.claude/settings.json` (crie-o se não existir) e adicione o seguinte conteúdo:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "plannotator",
            "timeout": 1800
          }
        ]
      }
    ]
  }
}
```

**Descrição dos campos**:
- `matcher: "ExitPlanMode"` - Aciona quando o Claude Code chama ExitPlanMode
- `command: "plannotator"` - Executa o comando CLI do Plannotator instalado
- `timeout: 1800` - Tempo limite (30 minutos), dando tempo suficiente para revisar o plano

**Checkpoint ✅**: Após salvar o arquivo, reinicie o Claude Code e execute `/plannotator-review` para testar.

### Passo 5: (Opcional) Configuração para ambiente remoto/Devcontainer

Se você estiver usando o Claude Code em ambientes remotos como SSH, Devcontainer ou WSL, precisa definir variáveis de ambiente para fixar a porta e desabilitar a abertura automática do navegador.

Execute no ambiente remoto:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999  # Escolha uma porta que você acessará via port forwarding
```

**Essas variáveis irão**:
- Usar uma porta fixa (em vez de aleatória), facilitando a configuração de port forwarding
- Pular a abertura automática do navegador (já que o navegador está na sua máquina local)
- Imprimir a URL no terminal, que você pode copiar e abrir no navegador local

::: tip Port Forwarding

**VS Code Devcontainer**: As portas geralmente são encaminhadas automaticamente, verifique na aba "Ports" do VS Code.

**SSH Port Forwarding**: Edite `~/.ssh/config` e adicione:

```bash
Host your-server
    LocalForward 9999 localhost:9999
```

:::

## Armadilhas comuns

### Problema 1: Comando `/plannotator-review` não responde após instalação

**Causa**: Esqueceu de reiniciar o Claude Code, os Hooks não foram ativados.

**Solução**: Feche completamente o Claude Code e abra novamente.

### Problema 2: Script de instalação falha

**Causa**: Problemas de rede ou permissões insuficientes.

**Solução**:
- Verifique a conexão de rede, certifique-se de que consegue acessar `https://plannotator.ai`
- Se encontrar problemas de permissão, tente baixar o script de instalação manualmente e executá-lo

### Problema 3: Navegador não abre em ambiente remoto

**Causa**: O ambiente remoto não tem interface gráfica, o navegador não pode ser iniciado.

**Solução**: Defina a variável de ambiente `PLANNOTATOR_REMOTE=1` e configure o port forwarding.

### Problema 4: Porta ocupada

**Causa**: A porta fixa `9999` já está sendo usada por outro programa.

**Solução**: Escolha outra porta disponível, como `8888` ou `19432`.

## Resumo da lição

- ✅ Instalou o comando CLI do Plannotator
- ✅ Configurou o Claude Code via sistema de plugins ou Hook manual
- ✅ Verificou se a instalação foi bem-sucedida
- ✅ (Opcional) Configurou o ambiente remoto/Devcontainer

## Prévia da próxima lição

> Na próxima lição, aprenderemos **[Instalando o Plugin OpenCode](../installation-opencode/)**.
>
> Se você está usando OpenCode em vez de Claude Code, a próxima lição ensinará como fazer uma configuração similar no OpenCode.

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do arquivo | Linhas |
| --- | --- | --- |
| Entrada do script de instalação | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L35-L60) | 35-60 |
| Documentação de configuração do Hook | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L30-L39) | 30-39 |
| Exemplo de Hook manual | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L42-L62) | 42-62 |
| Configuração de variáveis de ambiente | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L73-L79) | 73-79 |
| Configuração do modo remoto | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L81-L94) | 81-94 |

**Constantes principais**:
- `PLANNOTATOR_REMOTE = "1"`: Ativa o modo remoto, usa porta fixa
- `PLANNOTATOR_PORT = 9999`: Porta fixa usada no modo remoto (padrão 19432)
- `timeout: 1800`: Tempo limite do Hook (30 minutos)

**Variáveis de ambiente principais**:
- `PLANNOTATOR_REMOTE`: Flag do modo remoto
- `PLANNOTATOR_PORT`: Número da porta fixa
- `PLANNOTATOR_BROWSER`: Caminho personalizado do navegador

</details>
