---
title: "Instalação: Implantação Rápida em 5 Minutos | opencode-dcp"
sidebarTitle: "Execute em 5 Minutos"
subtitle: "Instalação: Implantação Rápida em 5 Minutos"
description: "Aprenda como instalar o plugin DCP. Configure em 5 minutos, reduza drasticamente o consumo de tokens em conversas longas através da poda automática e melhore a qualidade das respostas da IA."
tags:
  - "Instalação"
  - "Início Rápido"
  - "DCP"
prerequisite:
  - "OpenCode já instalado"
order: 1
---

# Instalação e Início Rápido

## O Que Você Vai Aprender

- ✅ Completar a instalação do plugin DCP em 5 minutos
- ✅ Configurar o plugin e verificar a instalação bem-sucedida
- ✅ Ver o efeito da primeira poda automática

## Seus Desafios Atuais

Usando o OpenCode por muito tempo, as conversas ficam cada vez mais longas:
- A IA lê o mesmo arquivo várias vezes
- Mensagens de erro de chamadas de ferramentas ocupam todo o contexto
- Cada conversa consome uma grande quantidade de tokens
- **Quanto mais longa a conversa, mais lenta a resposta da IA**

Você espera limpar automaticamente o conteúdo redundante nas conversas, mas não quer fazer isso manualmente.

## Conceito Principal

**DCP (Dynamic Context Pruning)** é um plugin do OpenCode que remove automaticamente chamadas de ferramentas redundantes no histórico de conversas, reduzindo o consumo de tokens.

Como funciona:
1. **Detecção automática**: Antes de enviar cada mensagem, analisa automaticamente o histórico da conversa
2. **Limpeza inteligente**: Remove chamadas de ferramentas duplicadas, erros expirados, escritas sobrescritas
3. **Orientado por IA**: A IA pode chamar ativamente as ferramentas `discard` e `extract` para otimizar o contexto
4. **Transparente e controlável**: Use o comando `/dcp` para ver estatísticas de poda e acionar limpeza manual

::: tip Vantagens Principais
- **Custo zero**: Estratégia automática não requer chamadas LLM
- **Configuração zero**: Pronto para usar após instalação, configuração padrão já otimizada
- **Risco zero**: Modifica apenas o contexto enviado ao LLM, o histórico da conversa não é afetado
:::

## 🎒 Preparação Antes de Começar

Antes de começar a instalação, confirme:

- [ ] **OpenCode** já instalado (com suporte a plugins)
- [ ] Sabe como editar o **arquivo de configuração do OpenCode**
- [ ] Entende a sintaxe básica de **JSONC** (JSON com suporte a comentários)

::: warning Aviso Importante
O DCP modificará o conteúdo do contexto enviado ao LLM, mas não afetará seu histórico de conversas. Você pode desabilitar o plugin na configuração a qualquer momento.
:::

## Siga os Passos

### Passo 1: Editar o Arquivo de Configuração do OpenCode

**Por quê**
É necessário declarar o plugin DCP na configuração do OpenCode para que ele seja carregado automaticamente na inicialização.

Abra seu arquivo de configuração do OpenCode `opencode.jsonc` e adicione o DCP no campo `plugin`:

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

**Você deve ver**: Se já houver outros plugins no arquivo de configuração, basta adicionar o DCP no final do array.

::: info Dica
Usando a tag `@latest`, o OpenCode verificará e obterá automaticamente a versão mais recente a cada inicialização.
:::

### Passo 2: Reiniciar o OpenCode

**Por quê**
Após modificar a configuração do plugin, é necessário reiniciar para que as alterações entrem em vigor.

Feche completamente o OpenCode e reinicie.

**Você deve ver**: O OpenCode inicia normalmente, sem mensagens de erro.

### Passo 3: Verificar a Instalação do Plugin

**Por quê**
Confirmar que o plugin DCP foi carregado corretamente e visualizar a configuração padrão.

Na conversa do OpenCode, digite:

```
/dcp
```

**Você deve ver**: Informações de ajuda do comando DCP, indicando que o plugin foi instalado com sucesso.

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

### Passo 4: Visualizar a Configuração Padrão

**Por quê**
Entender a configuração padrão do DCP e confirmar se o plugin está funcionando conforme esperado.

O DCP criará automaticamente o arquivo de configuração na primeira execução:

```bash
# Visualizar o arquivo de configuração global
cat ~/.config/opencode/dcp.jsonc
```

**Você deve ver**: O arquivo de configuração foi criado, inicialmente contendo apenas o campo `$schema`:

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json"
}
```

O arquivo de configuração inicialmente contém apenas o campo `$schema`, todos os outros itens de configuração usam os valores padrão do código, sem necessidade de configuração manual.

::: tip Explicação da Configuração Padrão
Os valores padrão do código DCP são os seguintes (não é necessário escrever no arquivo de configuração):

- **deduplication**: Desduplicação automática, remove chamadas de ferramentas duplicadas
- **purgeErrors**: Limpa automaticamente entradas de ferramentas com erro de 4 rodadas atrás
- **discard/extract**: Ferramentas de poda que a IA pode chamar
- **pruneNotification**: Exibe notificações detalhadas de poda

Se você precisar personalizar a configuração, pode adicionar esses campos manualmente. Para detalhes de configuração, consulte [Configuração Completa](../configuration/).
:::

### Passo 5: Experimentar o Efeito da Poda Automática

**Por quê**
Usar o DCP na prática e ver o efeito da poda automática.

No OpenCode, tenha uma conversa fazendo a IA ler o mesmo arquivo várias vezes ou executar algumas chamadas de ferramentas que falharão.

**Você deve ver**:

1. Cada vez que você envia uma mensagem, o DCP analisa automaticamente o histórico da conversa
2. Se houver chamadas de ferramentas duplicadas, o DCP as limpará automaticamente
3. Após a resposta da IA, você pode ver uma notificação de poda (dependendo da configuração `pruneNotification`)

Exemplo de notificação de poda:

```
▣ DCP | ~12.5K tokens saved total

▣ Pruning (~12.5K tokens)
→ read: src/config.ts
→ write: package.json
```

Digite `/dcp context` para ver o uso de tokens da sessão atual:

```
Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

## Ponto de Verificação ✅

Após concluir as etapas acima, você deve:

- [ ] Ter adicionado o plugin DCP em `opencode.jsonc`
- [ ] OpenCode reinicia e funciona normalmente
- [ ] O comando `/dcp` exibe informações de ajuda
- [ ] O arquivo de configuração `~/.config/opencode/dcp.jsonc` foi criado
- [ ] Ver notificações de poda na conversa ou ver estatísticas de poda através de `/dcp context`

**Se alguma etapa falhar**:
- Verifique se a sintaxe de `opencode.jsonc` está correta (formato JSONC)
- Verifique os logs do OpenCode para erros de carregamento de plugin
- Confirme se a versão do OpenCode suporta funcionalidade de plugins

## Avisos sobre Problemas Comuns

### Problema 1: Plugin Não Está Funcionando

**Sintoma**: Configuração adicionada mas não vê efeito de poda

**Causa**: OpenCode não foi reiniciado ou caminho do arquivo de configuração incorreto

**Solução**:
1. Feche completamente o OpenCode e reinicie
2. Verifique se a localização de `opencode.jsonc` está correta
3. Verifique os logs: arquivos de log no diretório `~/.config/opencode/logs/dcp/daily/`

### Problema 2: Arquivo de Configuração Não Foi Criado

**Sintoma**: `~/.config/opencode/dcp.jsonc` não existe

**Causa**: OpenCode não chamou o plugin DCP ou problema de permissão no diretório de configuração

**Solução**:
1. Confirme que o OpenCode foi reiniciado
2. Crie manualmente o diretório de configuração: `mkdir -p ~/.config/opencode`
3. Verifique se o nome do plugin em `opencode.jsonc` está correto: `@tarquinen/opencode-dcp@latest`

### Problema 3: Notificação de Poda Não Aparece

**Sintoma**: Não vê notificação de poda, mas `/dcp stats` mostra que há poda

**Causa**: Configuração `pruneNotification` está como `"off"` ou `"minimal"`

**Solução**: Modifique o arquivo de configuração:
```jsonc
"pruneNotification": "detailed"  // ou "minimal"
```

## Resumo da Lição

A instalação do plugin DCP é muito simples:
1. Adicionar o plugin em `opencode.jsonc`
2. Reiniciar o OpenCode
3. Usar o comando `/dcp` para verificar a instalação
4. A configuração padrão já pode ser usada, sem necessidade de ajustes adicionais

**Funcionalidades habilitadas por padrão no DCP**:
- ✅ Estratégia de desduplicação automática (remove chamadas de ferramentas duplicadas)
- ✅ Estratégia de limpeza de erros (limpa entradas de erro expiradas)
- ✅ Ferramentas orientadas por IA (`discard` e `extract`)
- ✅ Notificações detalhadas de poda

**Próximo passo**: Entender como personalizar a configuração e ajustar estratégias de poda para atender diferentes necessidades de cenários.

---

## Próxima Lição

> Na próxima lição aprenderemos **[Configuração Completa](../configuration/)**
>
> Você aprenderá:
> - Sistema de configuração em múltiplos níveis (global, variáveis de ambiente, nível de projeto)
> - Função e configurações recomendadas de todos os itens de configuração
> - Proteção de rodadas, ferramentas protegidas, padrões de arquivos protegidos
> - Como habilitar/desabilitar diferentes estratégias de poda

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Entrada do plugin | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts) | 12-102 |
| Gerenciamento de configuração | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 669-794 |
| Processamento de comandos | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 1-40 |
| Cálculo de tokens | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174 |

**Constantes Chave**:
- `MAX_TOOL_CACHE_SIZE = 1000`: Número máximo de entradas no cache de ferramentas

**Funções Chave**:
- `Plugin()`: Registro de plugin e configuração de hooks
- `getConfig()`: Carrega e mescla configuração em múltiplos níveis
- `handleContextCommand()`: Analisa o uso de tokens da sessão atual

</details>
