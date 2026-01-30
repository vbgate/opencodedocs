---
title: "OpenCode: Instalação do Plugin | Plannotator"
sidebarTitle: "Pronto para usar"
subtitle: "Instalando o Plugin OpenCode"
description: "Aprenda a instalar o plugin Plannotator no OpenCode. Configure o openable.json para adicionar o plugin, execute o script de instalação para obter comandos slash, configure variáveis de ambiente para modo remoto e verifique se o plugin está funcionando corretamente."
tags:
  - "instalação"
  - "configuração"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 3
---

# Instalando o Plugin OpenCode

## O que você vai aprender

- Instalar o plugin Plannotator no OpenCode
- Configurar a tool `submit_plan` e o comando `/plannotator-review`
- Definir variáveis de ambiente (modo remoto, porta, navegador, etc.)
- Verificar se a instalação foi bem-sucedida

## O problema que você enfrenta

Ao usar AI Agent no OpenCode, a revisão de planos requer ler planos em texto puro no terminal, dificultando feedbacks precisos. Você quer uma interface visual para anotar planos, adicionar comentários e enviar feedback estruturado automaticamente de volta ao Agent.

## Quando usar esta técnica

**Obrigatório antes de usar o Plannotator**: Se você desenvolve no ambiente OpenCode e deseja uma experiência interativa de revisão de planos.

## 🎒 Preparação antes de começar

- [ ] [OpenCode](https://opencode.ai/) já instalado
- [ ] Conhecimento básico de configuração `opencode.json` (sistema de plugins do OpenCode)

::: warning Pré-requisitos
Se você ainda não conhece as operações básicas do OpenCode, recomendamos ler primeiro a [documentação oficial do OpenCode](https://opencode.ai/docs).
:::

## Conceito principal

O Plannotator fornece duas funcionalidades principais para o OpenCode:

1. **Tool `submit_plan`** - Chamada quando o Agent conclui um plano, abrindo o navegador para revisão interativa
2. **Comando `/plannotator-review`** - Acionamento manual de revisão de código via Git diff

O processo de instalação tem duas etapas:
1. Adicionar configuração do plugin no `opencode.json` (habilitar tool `submit_plan`)
2. Executar script de instalação (obter comando `/plannotator-review`)

## Siga os passos

### Passo 1: Instalar plugin via opencode.json

Localize seu arquivo de configuração do OpenCode (geralmente no diretório raiz do projeto ou diretório de configuração do usuário) e adicione o Plannotator ao array `plugin`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**Por quê**
O `opencode.json` é o arquivo de configuração de plugins do OpenCode. Após adicionar o nome do plugin, o OpenCode baixará e carregará automaticamente o plugin do repositório npm.

**Você deve ver**: Ao iniciar, o OpenCode exibirá a mensagem "Loading plugin: @plannotator/opencode...".

---

### Passo 2: Reiniciar o OpenCode

**Por quê**
Alterações na configuração de plugins requerem reinicialização para entrar em vigor.

**Você deve ver**: O OpenCode recarregará todos os plugins.

---

### Passo 3: Executar script de instalação para obter comandos slash

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

:::

**Por quê**
Este script irá:
1. Baixar a ferramenta CLI `plannotator` para seu sistema
2. Instalar o comando slash `/plannotator-review` no OpenCode
3. Limpar quaisquer versões de plugin em cache

**Você deve ver**: Mensagem de sucesso na instalação, como "Plannotator installed successfully!"

---

### Passo 4: Verificar a instalação

No OpenCode, verifique se o plugin está funcionando corretamente:

**Verificar se a tool `submit_plan` está disponível**:
- Na conversa, pergunte ao Agent "Por favor, use submit_plan para enviar o plano"
- Se o plugin estiver normal, o Agent deve conseguir ver e chamar esta tool

**Verificar se o comando `/plannotator-review` está disponível**:
- Na caixa de entrada, digite `/plannotator-review`
- Se o plugin estiver normal, você deve ver a sugestão do comando

**Você deve ver**: Ambas as funcionalidades funcionando normalmente, sem mensagens de erro.

---

### Passo 5: Configurar variáveis de ambiente (opcional)

O Plannotator suporta as seguintes variáveis de ambiente, configure conforme suas necessidades:

::: details Descrição das variáveis de ambiente

| Variável de ambiente | Propósito | Valor padrão | Exemplo |
| --- | --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Habilitar modo remoto (devcontainer/SSH) | Não definido | `export PLANNOTATOR_REMOTE=1` |
| `PLANNOTATOR_PORT` | Porta fixa (obrigatória no modo remoto) | Local aleatória, remota 19432 | `export PLANNOTATOR_PORT=9999` |
| `PLANNOTATOR_BROWSER` | Caminho personalizado do navegador | Padrão do sistema | `export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"` |
| `PLANNOTATOR_SHARE` | Desabilitar compartilhamento de URL | Habilitado | `export PLANNOTATOR_SHARE=disabled` |

:::

**Exemplo de configuração para modo remoto** (devcontainer/SSH):

No `.devcontainer/devcontainer.json`:

```json
{
  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },
  "forwardPorts": [9999]
}
```

**Por quê**
- Modo remoto: Ao executar o OpenCode em container ou máquina remota, use porta fixa e abra o navegador automaticamente
- Port forwarding: Permite que a máquina host acesse serviços dentro do container

**Você deve ver**: Quando o Agent chamar `submit_plan`, o console exibirá a URL do servidor (em vez de abrir o navegador automaticamente), por exemplo:
```
Plannotator server running at http://localhost:9999
```

---

### Passo 6: Reiniciar o OpenCode (se modificou variáveis de ambiente)

Se você configurou variáveis de ambiente no Passo 5, precisa reiniciar o OpenCode novamente para que as configurações entrem em vigor.

---

## Checkpoint ✅

Após a instalação, confirme os seguintes pontos:

- [ ] `@plannotator/opencode@latest` adicionado ao `opencode.json`
- [ ] Nenhum erro de carregamento de plugin após reiniciar o OpenCode
- [ ] Ao digitar `/plannotator-review`, a sugestão do comando aparece
- [ ] (Opcional) Variáveis de ambiente configuradas corretamente

## Armadilhas comuns

### Erro comum 1: Falha ao carregar plugin

**Sintoma**: Ao iniciar o OpenCode, aparece "Failed to load plugin @plannotator/opencode"

**Possíveis causas**:
- Problemas de rede impedindo download do npm
- Cache do npm corrompido

**Solução**:
1. Verificar conexão de rede
2. Executar script de instalação (ele limpará o cache do plugin)
3. Limpar cache do npm manualmente: `npm cache clean --force`

---

### Erro comum 2: Comando slash não disponível

**Sintoma**: Ao digitar `/plannotator-review`, não há sugestão de comando

**Possível causa**: Script de instalação não foi executado com sucesso

**Solução**: Executar novamente o script de instalação (Passo 3)

---

### Erro comum 3: Navegador não abre no modo remoto

**Sintoma**: Ao chamar `submit_plan` no devcontainer, o navegador não abre

**Possíveis causas**:
- `PLANNOTATOR_REMOTE=1` não foi definido
- Port forwarding não configurado

**Solução**:
1. Confirmar que `PLANNOTATOR_REMOTE=1` está definido
2. Verificar se `forwardPorts` no `.devcontainer/devcontainer.json` inclui a porta que você definiu
3. Acessar manualmente a URL exibida: `http://localhost:9999`

---

### Erro comum 4: Porta ocupada

**Sintoma**: Falha ao iniciar servidor, exibindo "Port already in use"

**Possível causa**: Servidor anterior não foi fechado corretamente

**Solução**:
1. Modificar `PLANNOTATOR_PORT` para outra porta
2. Ou fechar manualmente o processo que está ocupando a porta (macOS/Linux: `lsof -ti:9999 | xargs kill`)

---

## Resumo da lição

Esta lição apresentou como instalar e configurar o plugin Plannotator no OpenCode:

1. **Adicionar plugin via `opencode.json`** - Habilitar tool `submit_plan`
2. **Executar script de instalação** - Obter comando slash `/plannotator-review`
3. **Configurar variáveis de ambiente** - Adaptar para modo remoto e necessidades personalizadas
4. **Verificar instalação** - Confirmar que o plugin está funcionando normalmente

Após a instalação, você pode:
- Fazer o Agent usar `submit_plan` para enviar planos para revisão interativa
- Usar `/plannotator-review` para revisar manualmente Git diff

## Prévia da próxima lição

> Na próxima lição, aprenderemos **[Fundamentos de Revisão de Planos](../../platforms/plan-review-basics/)**.
>
> Você vai aprender:
> - Como visualizar planos gerados por IA
> - Adicionar diferentes tipos de anotações (excluir, substituir, inserir, comentar)
> - Aprovar ou rejeitar planos

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do arquivo | Linhas |
| --- | --- | --- |
| Definição de entrada do plugin | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 34-280 |
| Definição da tool `submit_plan` | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 209-252 |
| --- | --- | --- |
| Injeção de configuração do plugin (opencode.json) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 55-63 |
| Leitura de variáveis de ambiente | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |
| Inicialização do servidor de revisão de planos | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts) | Todo o arquivo |
| Inicialização do servidor de revisão de código | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts) | Todo o arquivo |
| Detecção de modo remoto | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | Todo o arquivo |

**Constantes principais**:
- `PLANNOTATOR_REMOTE`: Flag de modo remoto (definir como "1" ou "true" para habilitar)
- `PLANNOTATOR_PORT`: Número da porta fixa (padrão local aleatória, remota 19432)

**Funções principais**:
- `startPlannotatorServer()`: Iniciar servidor de revisão de planos
- `startReviewServer()`: Iniciar servidor de revisão de código
- `getSharingEnabled()`: Obter status do compartilhamento de URL (da configuração do OpenCode ou variável de ambiente)

</details>
