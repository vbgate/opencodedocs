---
title: "Solução de Problemas: Problemas de Formatação de Tabelas | opencode-md-table-formatter"
sidebarTitle: "O que fazer quando a tabela não é formatada"
subtitle: "Solução de Problemas: Problemas de Formatação de Tabelas | opencode-md-table-formatter"
description: "Aprenda os métodos de solução de problemas do plugin opencode-md-table-formatter. Localize rapidamente problemas comuns como tabelas não formatadas e estrutura inválida, domine a verificação de configuração e soluções."
tags:
  - "solução de problemas"
  - "perguntas frequentes"
prerequisite:
  - "start-getting-started"
order: 60
---

# Perguntas Frequentes: O que fazer quando a tabela não é formatada

## O que você será capaz de fazer após esta aula

Esta aula ajudará você a diagnosticar e resolver rapidamente problemas comuns no uso do plugin:

- Descobrir por que as tabelas não estão sendo formatadas
- Entender o significado do erro "estrutura de tabela inválida"
- Conhecer as limitações conhecidas do plugin e cenários onde não se aplica
- Verificar rapidamente se a configuração está correta

---

## Problema 1: A tabela não é formatada automaticamente

### Sintomas

A IA gerou uma tabela, mas as larguras das colunas são inconsistentes e não estão alinhadas.

### Possíveis causas e soluções

#### Causa 1: Plugin não configurado

**Etapas de verificação**:

1. Abra o arquivo `.opencode/opencode.jsonc`
2. Confirme se o plugin está no array `plugin`:

```jsonc
{
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

3. Se não estiver, adicione a configuração do plugin
4. **Reinicie o OpenCode** para que a configuração entre em vigor

::: tip Formato de configuração
Certifique-se de que o número da versão e o nome do pacote estejam corretos, usando o formato `@franlol/opencode-md-table-formatter` + `@` + número da versão.
:::

#### Causa 2: OpenCode não reiniciado

**Solução**:

Após adicionar o plugin, você deve reiniciar completamente o OpenCode (não apenas atualizar a página) para que o plugin seja carregado.

#### Causa 3: Tabela sem linha separadora

**Exemplo de sintoma**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Este tipo de tabela não será formatado.

**Solução**:

Adicione uma linha separadora (segunda linha, no formato `|---|`):

```markdown
| Name | Age |
|------|-----|
| Alice | 25 |
| Bob | 30 |
```

::: info Função da linha separadora
A linha separadora é a sintaxe padrão de tabelas Markdown, usada para distinguir o cabeçalho das linhas de conteúdo e também para especificar o método de alinhamento. O plugin **deve** detectar a linha separadora para formatar a tabela.
:::

#### Causa 4: Versão do OpenCode muito antiga

**Etapas de verificação**:

1. Abra o menu de ajuda do OpenCode
2. Verifique o número da versão atual
3. Confirme que a versão >= 1.0.137

**Solução**:

Atualize para a versão mais recente do OpenCode.

::: warning Requisitos de versão
O plugin usa o hook `experimental.text.complete`, que está disponível no OpenCode versão 1.0.137+.
:::

---

## Problema 2: Vê o comentário "invalid structure"

### Sintomas

Aparece no final da tabela:

```markdown
<!-- table not formatted: invalid structure -->
```

### O que é "estrutura de tabela inválida"

O plugin valida cada tabela Markdown, e apenas tabelas que passam na validação são formatadas. Se a estrutura da tabela não estiver em conformidade com as especificações, o plugin manterá o texto original e adicionará este comentário.

### Causas comuns

#### Causa 1: Número de linhas da tabela insuficiente

**Exemplo de erro**:

```markdown
| Name |
```

Apenas 1 linha, formato incompleto.

**Exemplo correto**:

```markdown
| Name |
|------|
```

Pelo menos 2 linhas são necessárias (incluindo a linha separadora).

#### Causa 2: Número de colunas inconsistente

**Exemplo de erro**:

```markdown
| Name | Age |
|------|-----|
| Alice |
```

Primeira linha 2 colunas, segunda linha 1 coluna, número de colunas inconsistente.

**Exemplo correto**:

```markdown
| Name | Age |
|------|-----|
| Alice | 25 |
```

Todas as linhas devem ter o mesmo número de colunas.

#### Causa 3: Falta linha separadora

**Exemplo de erro**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Não há linha separadora como `|---|---|`.

**Exemplo correto**:

```markdown
| Name | Age |
|------|-----|
| Alice | 25 |
| Bob | 30 |
```

### Como diagnosticar rapidamente

Use a seguinte lista de verificação:

- [ ] A tabela tem pelo menos 2 linhas
- [ ] Todas as linhas têm o mesmo número de colunas (conte quantos `|` há em cada linha)
- [ ] Existe uma linha separadora (a segunda linha geralmente está no formato `|---|`)

Se tudo isso for atendido mas ainda houver erro, verifique se há caracteres ocultos ou espaços extras que causam erro no cálculo do número de colunas.

---

## Problema 3: Vê o comentário "table formatting failed"

### Sintomas

Aparece no final do texto:

```markdown
<!-- table formatting failed: {错误信息} -->
```

### Causa

Esta é uma exceção não esperada lançada internamente pelo plugin.

### Solução

1. **Verifique a mensagem de erro**: A parte `{错误信息}` no comentário explicará o problema específico
2. **Verifique o conteúdo da tabela**: Confirme se há casos extremos especiais (como linhas muito longas, combinações especiais de caracteres)
3. **Mantenha o texto original**: Mesmo em caso de falha, o plugin não destruirá o texto original, seu conteúdo está seguro
4. **Relate o problema**: Se o problema ocorrer repetidamente, você pode enviar um relatório de problema em [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues)

::: tip Isolamento de erros
O plugin envolve a lógica de formatação com try-catch, então mesmo em caso de erro, não interromperá o fluxo de trabalho do OpenCode.
:::

---

## Problema 4: Certos tipos de tabelas não são suportados

### Tipos de tabelas não suportados

#### Tabelas HTML

**Não suportado**:

```html
<table>
  <tr><th>Name</th></tr>
  <tr><td>Alice</td></tr>
</table>
```

**Apenas suporta**: Tabelas de pipe Markdown (Pipe Table)

#### Células multilinha

**Não suportado**:

```markdown
| Name | Description |
|------|-------------|
| Alice | Line 1<br>Line 2 |
```

::: info Por que não é suportado
O plugin foi projetado para tabelas simples geradas por IA, células multilinha exigem lógica de layout mais complexa.
:::

#### Tabelas sem linha separadora

**Não suportado**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Deve ter uma linha separadora (veja acima "Causa 3").

---

## Problema 5: A tabela ainda não está alinhada após a formatação

### Possíveis causas

#### Causa 1: Modo de ocultação não ativado

O plugin é otimizado para o modo de ocultação (Concealment Mode) do OpenCode, que oculta símbolos Markdown (como `**`, `*`).

Se o seu editor não tiver o modo de ocultação ativado, a tabela pode parecer "desalinhada", porque os símbolos Markdown ocupam a largura real.

**Solução**:

Confirme que o modo de ocultação do OpenCode está ativado (ativado por padrão).

#### Causa 2: Conteúdo da célula muito longo

Se o conteúdo de uma célula for muito longo, a tabela pode ficar muito esticada.

Este é um comportamento normal, o plugin não truncará o conteúdo.

#### Causa 3: Símbolos no código em linha

Os símbolos Markdown no código em linha (`` `**code**` ``) serão calculados **pela largura literal**, não serão removidos.

**Exemplo**:

```
| 符号 | 宽度 |
|------|------|
| 普通文本 | 4 |
| `**bold**` | 8 |
```

Este é o comportamento correto, porque no modo de ocultação os símbolos dentro dos blocos de código são visíveis.

---

## Resumo da aula

Através desta aula, você aprendeu:

- **Diagnosticar tabelas não formatadas**: Verificar configuração, reinicialização, requisitos de versão, linha separadora
- **Entender erros de tabela inválida**: Validação de número de linhas, colunas, linha separadora
- **Identificar limitações conhecidas**: Tabelas HTML, células multilinha, tabelas sem linha separadora não são suportadas
- **Auto-verificação rápida**: Usar lista de verificação para validar a estrutura da tabela

---

## Ainda não resolvido?

Se você verificou todos os problemas acima mas o problema ainda persiste:

1. **Verifique o log completo**: O plugin opera silenciosamente por padrão, sem logs detalhados
2. **Envie um Issue**: Em [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues), forneça seu exemplo de tabela e informações de erro
3. **Consulte o curso avançado**: Leia [Especificações de Tabelas](../../advanced/table-spec/) e [Princípio do Modo de Ocultação](../../advanced/concealment-mode/) para obter mais detalhes técnicos

---

## Próxima aula

> Na próxima aula, aprenderemos **[Limitações Conhecidas: Onde estão os limites do plugin](../../appendix/limitations/)**.
>
> Você aprenderá:
> - Os limites de design e restrições do plugin
> - Possíveis melhorias futuras
> - Como determinar se um cenário é adequado para usar este plugin

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Função            | Caminho do arquivo                                                                                    | Número da linha    |
| --------------- | ------------------------------------------------------------------------------------------- | ------- |
| Lógica de validação de tabela    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88)     | 70-88   |
| Detecção de linha de tabela      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61)     | 58-61   |
| Detecção de linha separadora      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68)     | 63-68   |
| Tratamento de erros        | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L15-L20)     | 15-20   |
| Comentário de tabela inválida    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47)     | 44-47   |

**Regras de negócio principais**:
- `isValidTable()`: Valida que a tabela deve ter pelo menos 2 linhas, todas as linhas com o mesmo número de colunas, existe linha separadora (linhas 70-88)
- `isSeparatorRow()`: Usa regex `/^\s*:?-+:?\s*$/` para detectar linha separadora (linhas 63-68)
- Largura mínima da coluna: 3 caracteres (linha 115)

**Mecanismo de tratamento de erros**:
- try-catch envolve a função principal de processamento (linhas 15-20)
- Falha na formatação: Mantém o texto original + adiciona comentário `<!-- table formatting failed: {message} -->`
- Falha na validação: Mantém o texto original + adiciona comentário `<!-- table not formatted: invalid structure -->`

</details>
