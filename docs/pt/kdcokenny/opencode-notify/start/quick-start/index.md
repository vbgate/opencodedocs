---
title: "Início Rápido: Domine o opencode-notify em 5 minutos | Tutorial opencode-notify"
sidebarTitle: "Notificação em 5 minutos"
subtitle: "Início Rápido: Domine o opencode-notify em 5 minutos"
description: "Aprenda a instalar o plugin opencode-notify, complete a configuração em 5 minutos e experimente sua primeira notificação de desktop. Este tutorial cobre a instalação via gerenciador de pacotes OCX e instalação manual, suportando macOS, Windows e Linux, ajudando você a receber alertas oportunos quando as tarefas de IA forem concluídas."
tags:
  - "Iniciante"
  - "Instalação"
  - "Primeiros Passos"
prerequisite: []
order: 10
---

# Início Rápido: Domine o opencode-notify em 5 minutos

## O que você poderá fazer após este tutorial

- Concluir a instalação do plugin opencode-notify em 3 minutos
- Acionar sua primeira notificação de desktop e verificar a instalação bem-sucedida
- Compreender as diferenças entre os métodos de instalação e seus cenários de aplicação

## Sua situação atual

Você delegou uma tarefa à IA e mudou para outra janela. Agora você alterna de volta a cada 30 segundos para verificar: terminou? Deu erro? Ainda está aguardando permissão? O opencode-notify foi criado especificamente para resolver esse problema.

Essa alternância constante interrompe seu fluxo de pensamento e desperdiça tempo.

## Quando usar esta solução

**Habilite o opencode-notify nos seguintes cenários**:
- Você frequentemente alterna para outros aplicativos enquanto a IA executa tarefas
- Você deseja ser notificado imediatamente quando a IA precisar de você
- Você quer não perder eventos importantes enquanto mantém o foco

## Conceito principal

O princípio de funcionamento do opencode-notify é simples: escutar os eventos do OpenCode e enviar notificações nativas de desktop nos momentos-chave.

**Ele notificará você sobre**:
- ✅ Conclusão da tarefa (Sessão ociosa)
- ✅ Erro de execução (Erro de sessão)
- ✅ Solicitação de permissão (Permissão atualizada)

**Ele não notificará**:
- ❌ Conclusão de cada subtarefa (muito barulho)
- ❌ Qualquer evento quando o terminal estiver em foco (você está olhando para o terminal, não precisa de notificação)

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
- OpenCode instalado [OpenCode](https://github.com/sst/opencode)
- Terminal disponível (Terminal do macOS, iTerm2, Windows Terminal, etc.)
- Sistema macOS/Windows/Linux (todos suportados)
:::

## Siga os passos

### Passo 1: Escolha o método de instalação

O opencode-notify oferece dois métodos de instalação:

| Método | Cenário de aplicação | Vantagens | Desvantagens |
| --- | --- | --- | --- |
| **Gerenciador de pacotes OCX** | Maioria dos usuários | Instalação com um clique, atualização automática, gerenciamento de dependências completo | Requer instalação prévia do OCX |
| **Instalação manual** | Necessidades especiais | Controle total, não requer OCX | Requer gerenciamento manual de dependências e atualizações |

**Recomendado**: Priorize a instalação via OCX, mais prática.

### Passo 2: Instalação via OCX (Recomendado)

#### 2.1 Instale o gerenciador de pacotes OCX

OCX é o gerenciador de pacotes de plugin oficial do OpenCode, que facilita a instalação, atualização e gerenciamento de plugins.

**Instale o OCX**:

```bash
curl -fsSL https://ocx.kdco.dev/install.sh | sh
```

**Você deve ver**: O script de instalação exibindo o progresso, com mensagem de sucesso ao final.

#### 2.2 Adicione o KDCO Registry

KDCO Registry é um repositório de plugins que inclui opencode-notify e vários outros plugins úteis.

**Adicione o registry**:

```bash
ocx registry add https://registry.kdco.dev --name kdco
```

**Você deve ver**: Mensagem "Registry added successfully" ou similar.

::: tip Opcional: Configuração global
Se deseja usar o mesmo registry em todos os projetos, adicione o parâmetro `--global`:

```bash
ocx registry add https://registry.kdco.dev --name kdco --global
```
:::

#### 2.3 Instale o opencode-notify

**Instale o plugin**:

```bash
ocx add kdco/notify
```

**Você deve ver**:
```
✓ Added kdco/notify to your OpenCode workspace
```

### Passo 3: Instale todo o workspace de uma vez (Opcional)

Se deseja a experiência completa, pode instalar o workspace KDCO, que inclui:

- opencode-notify (notificações de desktop)
- Agentes em segundo plano (Background Agents)
- Agentes especialistas (Specialist Agents)
- Ferramentas de planejamento (Planning Tools)

**Instale o workspace**:

```bash
ocx add kdco/workspace
```

**Você deve ver**: Mensagem indicando que vários componentes foram adicionados com sucesso.

### Passo 4: Verifique a instalação

Após a instalação, precisamos acionar uma notificação para verificar se a configuração está correta.

**Método de verificação 1: Deixe a IA completar uma tarefa**

No OpenCode, digite:

```
Calcule a soma de 1 a 10 e me diga o resultado após esperar 5 segundos.
```

Alterne para outra janela e trabalhe por alguns segundos, você deve ver a notificação de desktop aparecer.

**Método de verificação 2: Verifique o arquivo de configuração**

Verifique se o arquivo de configuração existe:

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
type $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**Você deve ver**:
- Se o arquivo não existir → usando configuração padrão (normal)
- Se o arquivo existir → exibindo sua configuração personalizada

### Passo 5: Instalação manual (Alternativa)

Se não deseja usar o OCX, pode instalar manualmente.

#### 5.1 Copie o código-fonte

Copie o código-fonte do opencode-notify para o diretório de plugins do OpenCode:

```bash
# Copie do código-fonte para diretório independente
mkdir -p ~/.opencode/plugin/kdco-notify
cp src/notify.ts ~/.opencode/plugin/kdco-notify/
cp -r src/plugin/kdco-primitives ~/.opencode/plugin/kdco-notify/
```

#### 5.2 Instale as dependências

Instale manualmente as dependências necessárias:

```bash
cd ~/.opencode/plugin/
npm install node-notifier detect-terminal @opencode-ai/plugin @opencode-ai/sdk
```

::: warning Atenção
- **Gerenciamento de dependências**: requer instalação e atualização manual de `node-notifier` e `detect-terminal`
- **Dificuldade de atualização**: cada atualização requer cópia manual do código-fonte
- **Não recomendado**: a menos que tenha necessidades especiais, recomenda-se instalação via OCX
:::

### Checkpoint ✅

Após concluir os passos acima, confirme:

- [ ] OCX instalado com sucesso (`ocx --version` exibe o número da versão)
- [ ] KDCO Registry adicionado (`ocx registry list` mostra kdco)
- [ ] opencode-notify instalado (`ocx list` mostra kdco/notify)
- [ ] Primeira notificação de desktop recebida
- [ ] Notificação exibindo o título correto da tarefa

**Se algum passo falhar**:
- Consulte [Solução de Problemas](../../faq/troubleshooting/) para obter ajuda
- Verifique se o OpenCode está funcionando corretamente
- Confirme se seu sistema suporta notificações de desktop

## Avisos Importantes

### Problema Comum 1: Notificação não aparece

**Causas**:
- macOS: notificações do sistema desativadas
- Windows: permissão de notificação não concedida
- Linux: notify-send não instalado

**Soluções**:

| Plataforma | Solução |
| --- | --- |
| macOS | Configurações do Sistema → Notificações → OpenCode → Permitir Notificações |
| Windows | Configurações → Sistema → Notificações → Ativar Notificações |
| Linux | Instale libnotify-bin: `sudo apt install libnotify-bin` |

### Problema Comum 2: Falha na instalação do OCX

**Causa**: Problemas de rede ou permissões insuficientes

**Soluções**:
1. Verifique a conexão de rede
2. Use sudo para instalação (requer permissão de administrador)
3. Baixe manualmente o script de instalação e execute

### Problema Comum 3: Falha na instalação de dependências

**Causa**: Versão do Node.js incompatível

**Soluções**:
- Use Node.js 18 ou superior
- Limpe o cache do npm: `npm cache clean --force`

## Resumo da Aula

Nesta aula completamos:
- ✅ Instalação do gerenciador de pacotes OCX
- ✅ Adição do KDCO Registry
- ✅ Instalação do plugin opencode-notify
- ✅ Acionamento da primeira notificação de desktop
- ✅ Conhecimento do método de instalação manual

**Pontos-chave**:
1. O opencode-notify usa notificações nativas de desktop, sem necessidade de alternar frequentemente entre janelas
2. OCX é o método de instalação recomendado, gerenciando automaticamente dependências e atualizações
3. Por padrão, apenas notifica a sessão pai, evitando barulho de subtarefas
4. Suprime automaticamente notificações quando o terminal está em foco

## Prévia da Próxima Aula

> Na próxima aula aprenderemos **[Como Funciona](../how-it-works/)**.
>
> Você aprenderá:
> - Como o plugin escuta eventos do OpenCode
> - O fluxo de trabalho do mecanismo de filtragem inteligente
> - O princípio da detecção de terminal e reconhecimento de foco
> - Diferenças de funcionalidade entre diferentes plataformas

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Entrada principal do plugin | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L1-L407) | 1-407 |
| Carregamento de configuração | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Envio de notificação | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L280-L308) | 280-308 |
| Detecção de terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Verificação de horário silencioso | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Configuração padrão | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |

**Constantes-chave**:
- `DEFAULT_CONFIG.sounds.idle = "Glass"`: Som padrão para conclusão de tarefa
- `DEFAULT_CONFIG.sounds.error = "Basso"`: Som padrão para erro
- `DEFAULT_CONFIG.sounds.permission = "Submarine"`: Som padrão para solicitação de permissão
- `DEFAULT_CONFIG.notifyChildSessions = false`: Por padrão, notifica apenas a sessão pai

**Funções-chave**:
- `NotifyPlugin()`: Função de entrada do plugin, retorna o processador de eventos
- `loadConfig()`: Carrega o arquivo de configuração, mesclando com valores padrão
- `sendNotification()`: Envia notificação nativa de desktop
- `detectTerminalInfo()`: Detecta o tipo de terminal e Bundle ID
- `isQuietHours()`: Verifica se o horário atual está no período silencioso
- `isParentSession()`: Determina se é uma sessão pai
- `isTerminalFocused()`: Detecta se o terminal é a janela em primeiro plano

</details>
