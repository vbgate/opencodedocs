---
title: "Guia de uso: dois métodos de consulta | opencode-mystatus"
sidebarTitle: "Guia de uso"
subtitle: "Usar mystatus: comando de barra e linguagem natural"
description: "Aprenda a usar o opencode-mystatus para consultar cotas de IA. Comando /mystatus e linguagem natural, com barras de progresso e contagem regressiva."
tags:
  - "início rápido"
  - "comando de barra"
  - "linguagem natural"
prerequisite:
  - "start-quick-start"
order: 2
---
# Usar mystatus: comando de barra e linguagem natural

## O que você poderá fazer após concluir

- Usar o comando de barra `/mystatus` para consultar todas as cota de plataformas de IA com um clique
- Fazer perguntas em linguagem natural para que o OpenCode chame automaticamente a ferramenta mystatus
- Entender a diferença entre os dois métodos de acionamento de comando de barra e linguagem natural e seus cenários de uso

## O seu problema atual

Você está usando múltiplas plataformas de IA para desenvolvimento (OpenAI, Zhipu AI, GitHub Copilot, etc.), quer saber quanto cota ainda resta em cada plataforma, mas não quer fazer login em cada plataforma separadamente para verificar - muito trabalhoso.

## Quando usar este método

- **Quando precisar visualizar rapidamente todas as cotas de plataformas**: Verifique uma vez antes de desenvolver todos os dias, aloque o uso razoavelmente
- **Quando quiser saber a cota específica de uma plataforma**: Por exemplo, quer confirmar se o OpenAI está quase esgotado
- **Quando quiser verificar se a configuração está funcionando**: Acaba de configurar uma nova conta, verifica se consegue consultar normalmente

::: info Verificação prévia

Este tutorial assume que você já completou a [instalação do plugin opencode-mystatus](/pt/vbgate/opencode-mystatus/start/quick-start/). Se ainda não instalou, complete os passos de instalação primeiro.

:::

## Ideia principal

O opencode-mystatus fornece dois métodos para acionar a ferramenta mystatus:

1. **Comando de barra `/mystatus`**: Rápido, direto, sem ambiguidade, adequado para consultas frequentes
2. **Perguntas em linguagem natural**: Mais flexível, adequado para consultas combinadas com cenários específicos

Ambos os métodos chamam a mesma ferramenta `mystatus`, que consultará paralelamente a cota de todas as plataformas de IA configuradas, retornando resultados com barras de progresso, estatísticas de uso e contagem regressiva de redefinição.

## Siga-me

### Passo 1: Usar comando de barra para consultar cota

No OpenCode, digite o seguinte comando:

```bash
/mystatus
```

**Por que**
O comando de barra é um mecanismo de comando rápido do OpenCode que pode chamar rapidamente ferramentas predefinidas. O comando `/mystatus` chama diretamente a ferramenta mystatus, sem necessidade de parâmetros extras.

**O que você deve ver**:
O OpenCode retornará informações de cota de todas as plataformas configuradas, formato da seguinte forma:

```
## OpenAI 账号额度

Account:        user@example.com (team)

3小时限额
███████████████████████████ 剩余 85%
重置: 2h 30m后

## 智谱 AI 账号额度

Account:        9c89****AQVM (Coding Plan)

5小时 token 限额
███████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4h后
```

Cada plataforma exibirá:
- Informações da conta (e-mail ou API Key mascarada)
- Barra de progresso (visualiza a cota restante)
- Contagem regressiva de tempo de redefinição
- Quantidade usada e quantidade total (algumas plataformas)

### Passo 2: Fazer perguntas em linguagem natural

Além do comando de barra, você também pode fazer perguntas em linguagem natural, o OpenCode reconhecerá automaticamente a intenção e chamará a ferramenta mystatus.

Tente estes métodos de pergunta:

```bash
Check my OpenAI quota
```

Ou

```bash
How much Codex quota do I have left?
```

Ou

```bash
Show my AI account status
```

**Por que**
Consultas em linguagem natural são mais alinhadas com os hábitos de conversação diária, adequadas para fazer perguntas em cenários de desenvolvimento específicos. O OpenCode reconhecerá através de correspondência semântica que você quer consultar a cota e chamará automaticamente a ferramenta mystatus.

**O que você deve ver**:
O mesmo resultado de saída do comando de barra, apenas um método diferente de acionamento.

### Passo 3: Entender a configuração do comando de barra

Como funciona o comando de barra `/mystatus`? Ele é definido no arquivo de configuração do OpenCode.

Abra `~/.config/opencode/opencode.json`, encontre a parte `command`:

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use mystatus tool to query quota usage. Return result as-is without modification."
    }
  }
}
```

**Explicação dos itens de configuração principais**:

| Item de configuração | Valor | Função |
|--- | --- | ---|
| `description` | "Query quota usage for all AI accounts" | Descrição exibida na lista de comandos |
| `template` | "Use to mystatus tool..." | Instrui o OpenCode como processar este comando |

**Por que precisa do template**
O template é uma "instrução" para o OpenCode, dizendo: quando o usuário digitar `/mystatus`, chame a ferramenta mystatus e retorne o resultado como está (sem nenhuma modificação).

## Ponto de verificação ✅

Confirme se você dominou os dois métodos de uso:

| Habilidade | Método de verificação | Resultado esperado |
|--- | --- | ---|
| Consulta com comando de barra | Digitar `/mystatus` | Exibe informações de cota de todas as plataformas |
| Consulta em linguagem natural | Digitar "Check my OpenAI quota" | Exibe informações de cota |
| Entender a configuração | Ver opencode.json | Encontrar a configuração do comando mystatus |

## Avisos sobre armadilhas

### Erro comum 1: Comando de barra sem resposta

**Fenômeno**: Após digitar `/mystatus`, não há nenhuma resposta

**Causa**: O arquivo de configuração do OpenCode não configurou corretamente o comando de barra

**Solução**:
1. Abra `~/.config/opencode/opencode.json`
2. Confirme que a parte `command` contém a configuração `mystatus` (veja o passo 3)
3. Reinicie o OpenCode

### Erro comum 2: Perguntas em linguagem natural não chamam a ferramenta mystatus

**Fenômeno**: Após digitar "Check my OpenAI quota", o OpenCode não chama a ferramenta mystatus, mas tenta responder por si mesmo

**Causa**: O OpenCode não reconheceu corretamente sua intenção

**Solução**:
1. Tente uma expressão mais clara: "Use mystatus tool to check my OpenAI quota"
2. Ou use diretamente o comando de barra `/mystatus`, mais confiável

### Erro comum 3: Exibe "未找到任何已配置的账号"

**Fenômeno**: Após executar `/mystatus`, exibe "未找到任何已配置的账号"

**Causa**: Nenhuma informação de autenticação de plataforma configurada ainda

**Solução**:
- Configure pelo menos uma plataforma de autenticação (OpenAI, Zhipu AI, Z.ai, GitHub Copilot ou Google Cloud)
- Consulte a explicação de configuração em [Tutorial de início rápido](/pt/vbgate/opencode-mystatus/start/quick-start/)

## Resumo desta seção

A ferramenta mystatus fornece dois métodos de uso:
1. **Comando de barra `/mystatus`**: Rápido e direto, adequado para consultas frequentes
2. **Perguntas em linguagem natural**: Mais flexível, adequado para cenários específicos

Ambos os métodos consultam paralelamente a cota de todas as plataformas de IA configuradas, retornando resultados com barras de progresso e contagem regressiva de redefinição. A configuração do comando de barra é definida em `~/.config/opencode/opencode.json`, indicando ao OpenCode como chamar a ferramenta mystatus através do template.

## Próxima seção

> A próxima seção aprenderemos **[Interpretar saída: barras de progresso, tempo de redefinição e múltiplas contas](/pt/vbgate/opencode-mystatus/start/understanding-output/)**.
>
> Você aprenderá:
> - Como interpretar o significado das barras de progresso
> - Como a contagem regressiva de tempo de redefinição é calculada
> - Formato de saída em cenários de múltiplas contas
> - Princípio de geração de barra de progresso

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Definição da ferramenta mystatus | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| Descrição da ferramenta | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 30-31 |
| Configuração de comando de barra | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |
| Consulta paralela de todas as plataformas | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| Coleta e resumo de resultados | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |

**Constantes principais**:
Nenhuma (esta seção apresenta principalmente o método de acionamento, não envolve constantes específicas)

**Funções principais**:
- `mystatus()`: Função principal da ferramenta mystatus, lê o arquivo de autenticação e consulta paralelamente todas as plataformas (`plugin/mystatus.ts:29-33`)
- `collectResult()`: Coleta os resultados da consulta em arrays de resultados e erros (`plugin/mystatus.ts:100-116`)

</details>
