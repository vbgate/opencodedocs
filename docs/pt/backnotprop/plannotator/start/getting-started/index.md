---
title: "Início Rápido: Domine o Plannotator em 5 Minutos"
sidebarTitle: "Começar em 5 Minutos"
subtitle: "Início Rápido: Domine o Plannotator em 5 Minutos"
description: "Aprenda a instalar e configurar o Plannotator. Complete a instalação do CLI em 5 minutos, configure o plugin para Claude Code ou OpenCode, e domine o fluxo de revisão de planos e código."
tags:
  - "Início Rápido"
  - "Introdução"
  - "Instalação"
  - "Claude Code"
  - "OpenCode"
order: 1
---

# Início Rápido: Domine o Plannotator em 5 Minutos

## O Que Você Vai Aprender

- ✅ Entender as funcionalidades principais e casos de uso do Plannotator
- ✅ Completar a instalação do Plannotator em 5 minutos
- ✅ Configurar a integração com Claude Code ou OpenCode
- ✅ Realizar sua primeira revisão de plano e revisão de código

## O Seu Dilema Atual

**Plannotator** é uma ferramenta de revisão interativa projetada para Claude Code e OpenCode, que ajuda a resolver os seguintes problemas:

**Problema 1**: Planos de implementação gerados por IA são difíceis de ler no terminal — muito texto, estrutura confusa, revisão cansativa.

**Problema 2**: Quando você quer dar feedback à IA, só pode descrever em texto "delete o parágrafo 3", "modifique esta função" — alto custo de comunicação.

**Problema 3**: Durante revisão de código, você precisa abrir múltiplos terminais ou IDEs, alternando constantemente, difícil manter o foco.

**Problema 4**: Membros da equipe querem participar da revisão, mas não sabem como compartilhar o conteúdo do plano.

**O Plannotator pode ajudar você**:
- Interface visual substitui leitura no terminal, estrutura clara
- Selecione texto para adicionar anotações (excluir, substituir, comentar), feedback preciso
- Revisão visual de Git diff, suporte a anotações por linha
- Função de compartilhamento por URL, colaboração em equipe sem necessidade de backend

## Quando Usar Esta Abordagem

**Cenários de uso**:
- Usando Claude Code ou OpenCode para desenvolvimento assistido por IA
- Precisa revisar planos de implementação gerados por IA
- Precisa revisar alterações de código
- Precisa compartilhar planos ou resultados de revisão de código com membros da equipe

**Cenários não adequados**:
- Código escrito manualmente (sem planos gerados por IA)
- Já possui fluxo completo de revisão de código (como GitHub PR)
- Não precisa de ferramenta de revisão visual

## Conceito Central

### O Que é o Plannotator

**Plannotator** é uma ferramenta de revisão interativa projetada para AI Coding Agents (Claude Code, OpenCode), oferecendo duas funcionalidades principais:

1. **Revisão de Planos**: Revisão visual de planos de implementação gerados por IA, com suporte a anotações, aprovação ou rejeição
2. **Revisão de Código**: Revisão visual de Git diff, com suporte a anotações por linha e múltiplos modos de visualização

### Como Funciona

```
┌─────────────────┐
│  AI Agent      │
│  (gera plano)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Plannotator   │  ← Servidor HTTP local
│  (UI visual)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Navegador     │
│  (revisão)     │
└─────────────────┘
```

**Fluxo principal**:
1. AI Agent completa o plano ou alterações de código
2. Plannotator inicia servidor HTTP local e abre o navegador
3. Usuário visualiza plano/código no navegador e adiciona anotações
4. Usuário aprova ou rejeita, Plannotator retorna a decisão ao AI Agent
5. AI Agent continua a implementação ou faz modificações baseado no feedback

### Segurança

**Todos os dados são processados localmente**, nada é enviado para a nuvem:
- Conteúdo do plano, diff de código e anotações são armazenados na sua máquina local
- Servidor HTTP local usa porta aleatória (ou porta fixa)
- Função de compartilhamento por URL implementada através de compressão de dados no hash da URL, sem necessidade de backend

## 🎒 Preparativos Antes de Começar

**Requisitos do sistema**:
- Sistema operacional: macOS / Linux / Windows / WSL
- Runtime: Bun (o script de instalação cuida disso automaticamente)
- Ambiente de IA: Claude Code 2.1.7+ ou OpenCode

**Escolha do método de instalação**:
- Se usar Claude Code: precisa instalar CLI + plugin
- Se usar OpenCode: precisa configurar o plugin
- Se apenas fizer revisão de código: só precisa instalar o CLI

## Siga Minhas Operações

### Passo 1: Instalar o Plannotator CLI

**macOS / Linux / WSL**:

```bash
curl -fsSL https://plannotator.ai/install.sh | bash
```

**Windows PowerShell**:

```powershell
irm https://plannotator.ai/install.ps1 | iex
```

**Windows CMD**:

```cmd
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**Você deve ver**: O script de instalação baixará automaticamente o Plannotator CLI e o adicionará ao PATH do sistema, exibindo o número da versão (como "plannotator v0.6.7 installed to ...").

::: tip O que o script de instalação faz?
O script de instalação irá:
1. Baixar a versão mais recente do Plannotator CLI
2. Adicionar ao PATH do sistema
3. Limpar versões antigas que possam existir
4. Instalar automaticamente o comando `/plannotator-review` (para revisão de código)
:::

### Passo 2: Configurar Claude Code (Opcional)

Se você usa Claude Code, precisa instalar o plugin.

**Execute no Claude Code**:

```
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**Importante**: Após instalar o plugin, **você deve reiniciar o Claude Code** para que o hook entre em vigor.

**Você deve ver**: Após a instalação bem-sucedida do plugin, `plannotator` aparecerá na lista de plugins do Claude Code.

::: info Método de configuração manual (Opcional)
Se você não quiser usar o sistema de plugins, pode configurar o hook manualmente. Veja a seção [Instalação do Plugin Claude Code](../installation-claude-code/).
:::

### Passo 3: Configurar OpenCode (Opcional)

Se você usa OpenCode, precisa editar o arquivo `opencode.json`.

**Edite `opencode.json`**:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**Reinicie o OpenCode**.

**Você deve ver**: Após reiniciar, o OpenCode carregará automaticamente o plugin, e a ferramenta `submit_plan` estará disponível.

### Passo 4: Primeira Revisão de Plano (Exemplo com Claude Code)

**Condição de ativação**: Faça o Claude Code gerar um plano de implementação e chamar `ExitPlanMode`.

**Exemplo de diálogo**:

```
Usuário: Ajude-me a criar um plano de implementação para um módulo de autenticação de usuários

Claude: Ok, aqui está o plano de implementação:
1. Criar modelo de usuário
2. Implementar API de registro
3. Implementar API de login
...
(chama ExitPlanMode)
```

**Você deve ver**:
1. Navegador abre automaticamente a UI do Plannotator
2. Exibe o conteúdo do plano gerado pela IA
3. Você pode selecionar texto do plano e adicionar anotações (excluir, substituir, comentar)
4. Na parte inferior há botões "Approve" e "Request Changes"

**Operações**:
1. Visualize o plano no navegador
2. Se o plano estiver ok, clique em **Approve** → IA continua a implementação
3. Se precisar de modificações, selecione o texto a modificar, clique em **Delete**, **Replace** ou **Comment** → clique em **Request Changes**

**Você deve ver**: Após clicar, o navegador fechará automaticamente, e o Claude Code receberá sua decisão e continuará a execução.

### Passo 5: Primeira Revisão de Código

**Execute no diretório do projeto**:

```bash
/plannotator-review
```

**Você deve ver**:
1. Navegador abre a página de revisão de código
2. Exibe o Git diff (por padrão, alterações não commitadas)
3. À esquerda está a árvore de arquivos, à direita o visualizador de diff
4. Clique nos números de linha para selecionar intervalo de código e adicionar anotações

**Operações**:
1. Navegue pelas alterações de código no visualizador de diff
2. Clique nos números de linha para selecionar o código a revisar
3. No painel direito, adicione anotações (comment/suggestion/concern)
4. Clique em **Send Feedback** para enviar ao agent, ou clique em **LGTM** para aprovar

**Você deve ver**: Após clicar em Send Feedback, o navegador fechará, o terminal exibirá o conteúdo do feedback formatado, e o agent processará automaticamente.

## Ponto de Verificação ✅

Após completar os passos acima, você deve ser capaz de:

- [ ] Script de instalação exibe "plannotator vX.X.X installed to ..."
- [ ] No Claude Code, acionar revisão de plano e navegador abre automaticamente a UI
- [ ] Na UI, selecionar texto do plano e adicionar anotações
- [ ] Clicar em Approve ou Request Changes e ver o navegador fechar
- [ ] Executar `/plannotator-review` e ver a interface de revisão de código
- [ ] Na revisão de código, adicionar anotações por linha e clicar em Send Feedback

**Se algum passo falhar**, consulte:
- [Guia de Instalação Claude Code](../installation-claude-code/)
- [Guia de Instalação OpenCode](../installation-opencode/)
- [Perguntas Frequentes](../../faq/common-problems/)

## Dicas para Evitar Armadilhas

**Erro comum 1**: Após instalação, executar `plannotator` mostra "command not found"

**Causa**: Variável de ambiente PATH não atualizada, ou precisa reiniciar o terminal.

**Solução**:
- macOS/Linux: Execute `source ~/.zshrc` ou `source ~/.bashrc`, ou reinicie o terminal
- Windows: Reinicie o PowerShell ou CMD

**Erro comum 2**: Após instalar plugin no Claude Code, revisão de plano não é acionada

**Causa**: Claude Code não foi reiniciado, hook não entrou em vigor.

**Solução**: Feche completamente o Claude Code (não apenas fechar a janela), depois reabra.

**Erro comum 3**: Navegador não abre automaticamente

**Causa**: Pode ser modo remoto (como devcontainer, SSH), ou porta ocupada.

**Solução**:
- Verifique se a variável de ambiente `PLANNOTATOR_REMOTE=1` está definida
- Veja a URL exibida no terminal e abra manualmente no navegador
- Consulte [Modo Remoto/Devcontainer](../../advanced/remote-mode/)

**Erro comum 4**: Revisão de código mostra "No changes"

**Causa**: Não há alterações git não commitadas no momento.

**Solução**:
- Execute `git status` primeiro para confirmar que há alterações
- Ou execute `git add` para preparar alguns arquivos
- Ou mude para outro tipo de diff (como last commit)

## Resumo da Aula

Plannotator é uma ferramenta de revisão que roda localmente, melhorando a eficiência da revisão de planos e código através de uma UI visual:

**Funcionalidades principais**:
- **Revisão de Planos**: Revisão visual de planos gerados por IA, com suporte a anotações precisas
- **Revisão de Código**: Revisão visual de Git diff, com suporte a anotações por linha
- **Compartilhamento por URL**: Compartilhe conteúdo de revisão sem necessidade de backend
- **Integração com terceiros**: Salva automaticamente planos aprovados no Obsidian/Bear

**Vantagens principais**:
- Execução local, dados seguros
- UI visual, maior eficiência
- Feedback preciso, menor custo de comunicação
- Colaboração em equipe, sem necessidade de sistema de contas

## Próximo Passo

> Na próxima aula aprenderemos **[Instalação do Plugin Claude Code](../installation-claude-code/)**.
>
> Você aprenderá:
> - Passos detalhados de instalação do plugin Claude Code
> - Método de configuração manual do hook
> - Como verificar se a instalação foi bem-sucedida
> - Soluções para problemas comuns de instalação

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Entrada CLI (revisão de plano) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L1-L50) | 1-50 |
| Entrada CLI (revisão de código) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84) | 46-84 |
| Servidor de revisão de plano | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L1-L200) | 1-200 |
| Servidor de revisão de código | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L150) | 1-150 |
| Utilitários Git | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L100) | 1-100 |
| UI de revisão de plano | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| UI de revisão de código | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L200) | 1-200 |

**Constantes principais**:
- `MAX_RETRIES = 5`: Número de tentativas de porta (`packages/server/index.ts:80`)
- `RETRY_DELAY_MS = 500`: Atraso entre tentativas de porta (`packages/server/index.ts:80`)

**Funções principais**:
- `startPlannotatorServer()`: Inicia servidor de revisão de plano (`packages/server/index.ts`)
- `startReviewServer()`: Inicia servidor de revisão de código (`packages/server/review.ts`)
- `runGitDiff()`: Executa comando git diff (`packages/server/git.ts`)

**Variáveis de ambiente**:
- `PLANNOTATOR_REMOTE`: Flag de modo remoto (`apps/hook/server/index.ts:17`)
- `PLANNOTATOR_PORT`: Porta fixa (`apps/hook/server/index.ts:18`)
- `PLANNOTATOR_BROWSER`: Navegador personalizado (`apps/hook/README.md:79`)
- `PLANNOTATOR_SHARE`: Ativar compartilhamento por URL (`apps/hook/server/index.ts:44`)

</details>
