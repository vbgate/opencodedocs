---
title: "Variáveis de Ambiente: Modo Remoto e Configuração de Porta | plannotator"
sidebarTitle: "Configure o Modo Remoto em 5 Minutos"
subtitle: "Variáveis de Ambiente: Modo Remoto e Configuração de Porta"
description: "Aprenda a configurar variáveis de ambiente do Plannotator. Configure o modo remoto, porta fixa, navegador personalizado e compartilhamento de URL, adaptando-se a ambientes SSH, Devcontainer e WSL."
tags:
  - "Variáveis de Ambiente"
  - "Modo Remoto"
  - "Configuração de Porta"
  - "Configuração de Navegador"
  - "Compartilhamento de URL"
  - "Devcontainer"
  - "WSL"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 5
---

# Configuração de Variáveis de Ambiente

## O Que Você Vai Aprender

- ✅ Configurar corretamente o Plannotator em ambientes remotos como SSH, Devcontainer e WSL
- ✅ Usar porta fixa para evitar conflitos de porta e configurações frequentes de encaminhamento de porta
- ✅ Especificar navegador personalizado para abrir a interface de revisão de planos
- ✅ Habilitar ou desabilitar a função de compartilhamento de URL
- ✅ Entender os valores padrão e o comportamento de cada variável de ambiente

## Seu Problema Atual

**Problema 1**: Ao usar o Plannotator em SSH ou Devcontainer, o navegador não abre automaticamente ou você não consegue acessar o servidor local.

**Problema 2**: Cada reinicialização do Plannotator usa uma porta aleatória, exigindo atualizações constantes na configuração de encaminhamento de porta.

**Problema 3**: O navegador padrão do sistema não corresponde aos seus hábitos de uso e você deseja visualizar planos em um navegador específico.

**Problema 4**: Por motivos de segurança, você deseja desabilitar a função de compartilhamento de URL para evitar compartilhamento acidental de planos.

**O Plannotator pode ajudá-lo**:
- Detectar automaticamente ambientes remotos através de variáveis de ambiente e desabilitar a abertura automática do navegador
- Fixar a porta para facilitar a configuração de encaminhamento de porta
- Suportar navegador personalizado
- Fornecer variáveis de ambiente para controlar o interruptor de compartilhamento de URL

## Quando Usar Esta Solução

**Cenários de uso**:
- Usar Claude Code ou OpenCode em servidor remoto SSH
- Desenvolver em contêineres Devcontainer
- Trabalhar em ambiente WSL (Windows Subsystem for Linux)
- Precisar de porta fixa para simplificar a configuração de encaminhamento de porta
- Desejar usar navegador específico (como Chrome, Firefox)
- Política de segurança empresarial exigir desabilitar a função de compartilhamento de URL

**Cenários não aplicáveis**:
- Desenvolvimento local com uso do navegador padrão (sem necessidade de variáveis de ambiente)
- Sem necessidade de encaminhamento de porta (como desenvolvimento totalmente local)

## Ideia Principal

### O Que São Variáveis de Ambiente

**Variáveis de ambiente** são um mecanismo de configuração de pares chave-valor fornecido pelo sistema operacional. O Plannotator se adapta a diferentes ambientes de execução (local ou remoto) lendo variáveis de ambiente.

::: info Por que são necessárias variáveis de ambiente?

O Plannotator assume por padrão que você está usando em ambiente de desenvolvimento local:
- Modo local: porta aleatória (evitar conflitos de porta)
- Modo local: abrir automaticamente o navegador padrão do sistema
- Modo local: habilitar função de compartilhamento de URL

Mas em ambientes remotos (SSH, Devcontainer, WSL), esses comportamentos padrão precisam ser ajustados:
- Modo remoto: usar porta fixa (facilitar encaminhamento de porta)
- Modo remoto: não abrir navegador automaticamente (precisa abrir no host)
- Modo remoto: talvez precisar desabilitar compartilhamento de URL (considerações de segurança)

As variáveis de ambiente permitem que você ajuste o comportamento do Plannotator em diferentes ambientes sem modificar o código.
:::

### Prioridade de Variáveis de Ambiente

Prioridade de leitura de variáveis de ambiente pelo Plannotator:

```
Variável de ambiente explícita > Comportamento padrão

Por exemplo:
PLANNOTATOR_PORT=3000 > porta padrão do modo remoto 19432 > porta aleatória do modo local
```

Isso significa:
- Se `PLANNOTATOR_PORT` for definido, a porta especificada será usada, independentemente de ser modo remoto
- Se `PLANNOTATOR_PORT` não for definido, o modo remoto usa 19432, o modo local usa porta aleatória

## 🎒 Preparação

Antes de configurar variáveis de ambiente, confirme:

- [ ] Instalação do Plannotator concluída ([Instalação Claude Code](../installation-claude-code/) ou [Instalação OpenCode](../installation-opencode/))
- [ ] Entenda seu ambiente de execução atual (local, SSH, Devcontainer, WSL)
- [ ] (Ambiente remoto) Encaminhamento de porta configurado (como parâmetro `-L` do SSH ou `forwardPorts` do Devcontainer)

## Siga comigo

### Etapa 1: Configurar Modo Remoto (SSH, Devcontainer, WSL)

**Por quê**
O modo remoto usa automaticamente porta fixa e desabilita a abertura automática do navegador, adequado para ambientes como SSH, Devcontainer e WSL.

**Como fazer**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
export PLANNOTATOR_REMOTE=1
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_REMOTE="1"
```

```cmd [Windows CMD]
set PLANNOTATOR_REMOTE=1
```

:::

**O que você deve ver**: Sem feedback visual, a variável de ambiente foi definida.

**Tornar permanente** (recomendado):

::: code-group

```bash [~/.bashrc ou ~/.zshrc]
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
source ~/.bashrc
```

```powershell [PowerShell Profile]
[Environment]::SetEnvironmentVariable('PLANNOTATOR_REMOTE', '1', 'User')
```

```cmd [Variáveis de ambiente do sistema]
# Adicionar através da interface "Propriedades do Sistema > Variáveis de Ambiente"
```

:::

### Etapa 2: Configurar Porta Fixa (Necessário para ambiente remoto)

**Por quê**
Ambientes remotos precisam de porta fixa para configurar encaminhamento de porta. Ambientes locais também podem configurar porta fixa se necessário.

**Regras de porta padrão**:
- Modo local (sem `PLANNOTATOR_REMOTE` definido): porta aleatória (`0`)
- Modo remoto (`PLANNOTATOR_REMOTE=1`): padrão `19432`
- Definição explícita de `PLANNOTATOR_PORT`: usar a porta especificada

**Como fazer**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# Definir como 19432 (padrão do modo remoto)
export PLANNOTATOR_PORT=19432

# Ou porta personalizada
export PLANNOTATOR_PORT=3000
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT="19432"
```

```cmd [Windows CMD]
set PLANNOTATOR_PORT=19432
```

:::

**O que você deve ver**: Sem feedback visual, a variável de ambiente foi definida.

**Ponto de verificação ✅**: Verifique se a porta está funcionando

Após reiniciar o Claude Code ou OpenCode, acione a revisão de planos e veja a URL exibida no terminal:

```bash
# Saída do modo local (porta aleatória)
http://localhost:54321

# Saída do modo remoto (porta fixa 19432)
http://localhost:19432
```

**Exemplos de configuração de encaminhamento de porta**:

Desenvolvimento remoto SSH:
```bash
ssh -L 19432:localhost:19432 user@remote-server
```

Devcontainer (`.devcontainer/devcontainer.json`):
```json
{
  "forwardPorts": [19432]
}
```

### Etapa 3: Configurar Navegador Personalizado

**Por quê**
O navegador padrão do sistema pode não ser o desejado (por exemplo, você trabalha no Chrome, mas o padrão é o Safari).

**Como fazer**

::: code-group

```bash [macOS (Bash)]
# Usar nome do aplicativo (macOS suporta)
export PLANNOTATOR_BROWSER="Google Chrome"

# Ou usar caminho completo
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

```bash [Linux (Bash)]
# Usar caminho do executável
export PLANNOTATOR_BROWSER="/usr/bin/firefox"

# Ou usar caminho relativo (se estiver no PATH)
export PLANNOTATOR_BROWSER="firefox"
```

```powershell [Windows PowerShell]
# Usar caminho do executável
$env:PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

```cmd [Windows CMD]
set PLANNOTATOR_BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe
```

:::

**O que você deve ver**: Na próxima vez que acionar a revisão de planos, o Plannotator abrirá no navegador especificado.

**Ponto de verificação ✅**: Verifique se o navegador está funcionando

Após reiniciar, acione a revisão de planos e observe:
- macOS: O aplicativo especificado será aberto
- Windows: O processo do navegador especificado será iniciado
- Linux: O comando do navegador especificado será executado

**Caminhos comuns de navegadores**:

| Sistema operacional | Navegador | Caminho/Comando |
|--- | --- | ---|
| macOS | Chrome | `Google Chrome` ou `/Applications/Google Chrome.app` |
| macOS | Firefox | `Firefox` ou `/Applications/Firefox.app` |
| macOS | Safari | `Safari` |
| Linux | Chrome | `google-chrome` ou `/usr/bin/google-chrome` |
| Linux | Firefox | `firefox` ou `/usr/bin/firefox` |
| Windows | Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Windows | Firefox | `C:\Program Files\Mozilla Firefox\firefox.exe` |

### Etapa 4: Configurar Interruptor de Compartilhamento de URL

**Por quê**
A função de compartilhamento de URL é habilitada por padrão, mas por motivos de segurança (como ambiente empresarial), você pode precisar desabilitar esta função.

**Comportamento padrão**:
- Sem `PLANNOTATOR_SHARE` definido: habilitar compartilhamento de URL
- Definir como `disabled`: desabilitar compartilhamento de URL

**Como fazer**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# Desabilitar compartilhamento de URL
export PLANNOTATOR_SHARE="disabled"
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_SHARE="disabled"
```

```cmd [Windows CMD]
set PLANNOTATOR_SHARE=disabled
```

:::

**O que você deve ver**: Após clicar no botão Export, a opção "Share as URL" desaparece ou fica indisponível.

**Ponto de verificação ✅**: Verifique se o compartilhamento de URL está desabilitado

1. Reinicie o Claude Code ou OpenCode
2. Abra qualquer revisão de planos
3. Clique no botão "Export" no canto superior direito
4. Observe a lista de opções

**Estado habilitado** (padrão):
- ✅ Exibe duas abas "Share" e "Raw Diff"
- ✅ A aba "Share" exibe URL compartilhável e botão de copiar

**Estado desabilitado** (`PLANNOTATOR_SHARE="disabled"`):
- ✅ Exibe diretamente o conteúdo "Raw Diff"
- ✅ Exibe botões "Copy" e "Download .diff"
- ❌ Sem aba "Share" e função de compartilhamento de URL

### Etapa 5: Verificar Todas as Variáveis de Ambiente

**Por quê**
Garantir que todas as variáveis de ambiente estejam configuradas corretamente e funcionem conforme esperado.

**Método de verificação**

```bash
# macOS/Linux/WSL
echo "PLANNOTATOR_REMOTE=$PLANNOTATOR_REMOTE"
echo "PLANNOTATOR_PORT=$PLANNOTATOR_PORT"
echo "PLANNOTATOR_BROWSER=$PLANNOTATOR_BROWSER"
echo "PLANNOTATOR_SHARE=$PLANNOTATOR_SHARE"
```

```powershell
# Windows PowerShell
Write-Host "PLANNOTATOR_REMOTE=$env:PLANNOTATOR_REMOTE"
Write-Host "PLANNOTATOR_PORT=$env:PLANNOTATOR_PORT"
Write-Host "PLANNOTATOR_BROWSER=$env:PLANNOTATOR_BROWSER"
Write-Host "PLANNOTATOR_SHARE=$env:PLANNOTATOR_SHARE"
```

**O que você deve ver**: Todas as variáveis de ambiente definidas e seus valores.

**Exemplo de saída esperado** (configuração de ambiente remoto):
```bash
PLANNOTATOR_REMOTE=1
PLANNOTATOR_PORT=19432
PLANNOTATOR_BROWSER=
PLANNOTATOR_SHARE=
```

**Exemplo de saída esperado** (configuração de ambiente local):
```bash
PLANNOTATOR_REMOTE=
PLANNOTATOR_PORT=
PLANNOTATOR_BROWSER=Google Chrome
PLANNOTATOR_SHARE=disabled
```

## Armadilhas Comuns

### Armadilha 1: Variável de ambiente não entrou em vigor

**Sintoma**: Após definir variáveis de ambiente, o comportamento do Plannotator não mudou.

**Causa**: Variáveis de ambiente só entram em vigor em novas sessões de terminal ou requerem reinicialização do aplicativo.

**Solução**:
- Confirme que as variáveis de ambiente foram gravadas permanentemente no arquivo de configuração (como `~/.bashrc`)
- Reinicie o terminal ou execute `source ~/.bashrc`
- Reinicie o Claude Code ou OpenCode

### Armadilha 2: Porta ocupada

**Sintoma**: Após definir `PLANNOTATOR_PORT`, a inicialização falha.

**Causa**: A porta especificada já está ocupada por outro processo.

**Solução**:
```bash
# Verificar ocupação de porta (macOS/Linux)
lsof -i :19432

# Mudar porta
export PLANNOTATOR_PORT=19433
```

### Armadilha 3: Caminho do navegador incorreto

**Sintoma**: Após definir `PLANNOTATOR_BROWSER`, o navegador não abre.

**Causa**: Caminho incorreto ou arquivo inexistente.

**Solução**:
- macOS: Usar nome do aplicativo em vez de caminho completo (como `Google Chrome`)
- Linux/Windows: Usar comando `which` ou `where` para confirmar caminho do executável
  ```bash
  which firefox  # Linux
  where chrome   # Windows
  ```

### Armadilha 4: Navegador abre inesperadamente no modo remoto

**Sintoma**: Após definir `PLANNOTATOR_REMOTE=1`, o navegador ainda abre no servidor remoto.

**Causa**: O valor de `PLANNOTATOR_REMOTE` não é `"1"` ou `"true"`.

**Solução**:
```bash
# Valores corretos
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_REMOTE=true

# Valores incorretos (não entram em vigor)
export PLANNOTATOR_REMOTE=yes
export PLANNOTATOR_REMOTE=enabled
```

### Armadilha 5: Opção de compartilhamento de URL ainda exibida após desabilitar

**Sintoma**: Após definir `PLANNOTATOR_SHARE=disabled`, "Share as URL" ainda está visível.

**Causa**: É necessário reiniciar o aplicativo para entrar em vigor.

**Solução**: Reinicie o Claude Code ou OpenCode.

## Resumo da Lição

Nesta lição, aprendemos as 4 variáveis de ambiente principais do Plannotator:

| Variável de ambiente | Uso | Valor padrão | Cenário aplicável |
|--- | --- | --- | ---|
| `PLANNOTATOR_REMOTE` | Interruptor de modo remoto | Não definido (modo local) | SSH, Devcontainer, WSL |
| `PLANNOTATOR_PORT` | Porta fixa | 19432 no modo remoto, aleatória no modo local | Precisa de encaminhamento de porta ou evitar conflitos de porta |
| `PLANNOTATOR_BROWSER` | Navegador personalizado | Navegador padrão do sistema | Deseja usar navegador específico |
| `PLANNOTATOR_SHARE` | Interruptor de compartilhamento de URL | Não definido (habilitado) | Precisa desabilitar função de compartilhamento |

**Pontos principais**:
- O modo remoto usa automaticamente porta fixa e desabilita a abertura automática do navegador
- Variáveis de ambiente definidas explicitamente têm prioridade maior que o comportamento padrão
- É necessário reiniciar o aplicativo para que as modificações de variáveis de ambiente entrem em vigor
- Ambientes empresariais podem precisar desabilitar a função de compartilhamento de URL

## Próxima Lição

> Na próxima lição, aprenderemos **[Solução de Problemas Comuns](../../faq/common-problems/)**.
>
> Você vai aprender:
> - Como resolver problemas de porta ocupada
> - Lidar com situações onde o navegador não abre
> - Corrigir erros de planos não exibidos
> - Técnicas de depuração e métodos de visualização de logs

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir para ver locais do código fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Detecção de modo remoto | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 16-29 |
| Lógica de obtenção de porta | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 34-49 |
| Lógica de abertura de navegador | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 45-74 |
| Interruptor de compartilhamento de URL (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts) | 44 |
| Interruptor de compartilhamento de URL (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |

**Constantes principais**:
- `DEFAULT_REMOTE_PORT = 19432`: Porta padrão do modo remoto

**Funções principais**:
- `isRemoteSession()`: Detecta se está rodando em ambiente remoto (SSH, Devcontainer, WSL)
- `getServerPort()`: Obtém porta do servidor (prioriza variável de ambiente, depois padrão do modo remoto, por fim aleatória)
- `openBrowser(url)`: Abre URL no navegador especificado ou no navegador padrão do sistema

</details>
