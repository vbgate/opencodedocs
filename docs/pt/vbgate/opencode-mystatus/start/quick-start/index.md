---
title: "Início Rápido: Consultar Cota de IA | opencode-mystatus"
sidebarTitle: "Início Rápido"
subtitle: "Início Rápido: Consulte a Cota de Todas as Plataformas de IA com um Clique"
description: "Aprenda a instalar o opencode-mystatus e consultar a cota de todas as plataformas de IA em 5 minutos. Suporta três métodos de instalação e múltiplas plataformas."
tags:
  - "Início Rápido"
  - "Instalação"
  - "Configuração"
order: 1
---

# Início Rápido: Consulte a Cota de Todas as Plataformas de IA com um Clique

## O Que Você Será Capaz de Fazer Após Este Tutorial

- Completar a instalação do plugin opencode-mystatus em 5 minutos
- Configurar o comando de barra `/mystatus`
- Verificar a instalação bem-sucedida, consultar a cota da primeira plataforma de IA

## Seu Problema Atual

Você está desenvolvendo com múltiplas plataformas de IA (OpenAI, Zhipu AI, GitHub Copilot, Google Cloud, etc.) e precisa verificar frequentemente a cota restante de cada plataforma. Fazer login em cada plataforma separadamente é muito demorado.

## Quando Usar Este Método

- **Ao começar a usar OpenCode**: Como novato, o primeiro plugin a instalar
- **Quando precisar gerenciar cota de múltiplas plataformas**: Usando simultaneamente OpenAI, Zhipu AI, GitHub Copilot, etc.
- **Cenário de colaboração em equipe**: Membros da equipe compartilham múltiplas contas de IA, precisam visualizar a cota de forma unificada

## 🎒 Preparação Antes de Começar

Antes de começar, confirme que você já:

::: info Pré-requisitos

- [ ] Instalou o [OpenCode](https://opencode.ai)
- [ ] Configurou informações de autenticação de pelo menos uma plataforma de IA (OpenAI, Zhipu AI, Z.ai, GitHub Copilot ou Google Cloud)

:::

Se você ainda não configurou nenhuma plataforma de IA, recomenda-se primeiro completar o login de pelo menos uma plataforma no OpenCode antes de instalar este plugin.

## Ideia Central

O opencode-mystatus é um plugin do OpenCode, seu valor central é:

1. **Leitura automática de arquivos de autenticação**: Lê todas as informações de contas configuradas do armazenamento oficial de autenticação do OpenCode
2. **Consulta paralela de plataformas**: Chama simultaneamente as APIs oficiais do OpenAI, Zhipu AI, Z.ai, GitHub Copilot e Google Cloud
3. **Exibição visualizada**: Exibe a cota restante de forma intuitiva com barras de progresso e contadores regressivos

O processo de instalação é simples:
1. Adicione o plugin e o comando de barra no arquivo de configuração do OpenCode
2. Reinicie o OpenCode
3. Digite `/mystatus` para consultar a cota

## Siga Passo a Passo

### Passo 1: Escolha o Método de Instalação

O opencode-mystatus oferece três métodos de instalação, escolha um de acordo com sua preferência:

::: code-group

```bash [Deixar o AI Instalar (Recomendado)]
Cole o seguinte conteúdo em qualquer agente de IA (Claude Code, OpenCode, Cursor, etc.):

Install opencode-mystatus plugin by following: https://raw.githubusercontent.com/vbgate/opencode-mystatus/main/README.md
```

```bash [Instalação Manual]
Abra ~/.config/opencode/opencode.json, edite a configuração conforme o passo 2
```

```bash [Instalar a Partir de Arquivo Local]
Copie os arquivos do plugin para o diretório ~/.config/opencode/plugin/ (detalhes no passo 4)
```

:::

**Por que recomenda-se deixar o AI instalar**: O agente de AI executará automaticamente todas as etapas de configuração, você só precisa confirmar, o mais rápido e conveniente.

---

### Passo 2: Configuração de Instalação Manual (obrigatório para instalação manual)

Se você escolher a instalação manual, precisará editar o arquivo de configuração do OpenCode.

#### 2.1 Abra o Arquivo de Configuração

```bash
# macOS/Linux
code ~/.config/opencode/opencode.json

# Windows
code %APPDATA%\opencode\opencode.json
```

#### 2.2 Adicione o Plugin e o Comando de Barra

No arquivo de configuração, adicione o seguinte conteúdo (mantenha a configuração original de `plugin` e `command`, adicione os novos itens de configuração):

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

**Por que configurar assim**:

| Item de Configuração | Valor | Função |
| ------------- | --------------------------------------- | ------------------------------------ |
| Array `plugin` | `["opencode-mystatus"]` | Informa ao OpenCode para carregar este plugin |
| `description` | "Query quota usage for all AI accounts" | Descrição exibida na lista de comandos de barra |
| `template` | "Use mystatus tool..." | Indica ao OpenCode como chamar a ferramenta mystatus |

**O que você deve ver**: O arquivo de configuração contém os campos completos de `plugin` e `command`, com o formato correto (atenção às vírgulas e aspas do JSON).

---

### Passo 3: Instalar a Partir de Arquivo Local (obrigatório para instalação local)

Se você escolher instalar a partir de arquivo local, precisará copiar manualmente os arquivos do plugin.

#### 3.1 Copie os Arquivos do Plugin

```bash
# Supondo que você já clonou o código fonte do opencode-mystatus em ~/opencode-mystatus/

# Copie o plugin principal e os arquivos da biblioteca
cp -r ~/opencode-mystatus/plugin/mystatus.ts ~/.config/opencode/plugin/
cp -r ~/opencode-mystatus/plugin/lib/ ~/.config/opencode/plugin/

# Copie a configuração do comando de barra
cp ~/opencode-mystatus/command/mystatus.md ~/.config/opencode/command/
```

**Por que precisamos copiar estes arquivos**:

- `mystatus.ts`: Arquivo de entrada principal do plugin, contém a definição da ferramenta mystatus
- `lib/`: Diretório contendo a lógica de consulta do OpenAI, Zhipu AI, Z.ai, GitHub Copilot e Google Cloud
- `mystatus.md`: Descrição de configuração do comando de barra

**O que você deve ver**: O diretório `~/.config/opencode/plugin/` contém `mystatus.ts` e o subdiretório `lib/`, e o diretório `~/.config/opencode/command/` contém `mystatus.md`.

---

### Passo 4: Reinicie o OpenCode

Independente do método de instalação escolhido, a última etapa é reiniciar o OpenCode.

**Por que é necessário reiniciar**: O OpenCode só lê o arquivo de configuração na inicialização, após modificar a configuração, é necessário reiniciar para que as alterações entrem em vigor.

**O que você deve ver**: Após o OpenCode reiniciar, ele pode ser usado normalmente.

---

### Passo 5: Verifique a Instalação

Agora, verifique se a instalação foi bem-sucedida.

#### 5.1 Teste o Comando de Barra

No OpenCode, digite:

```bash
/mystatus
```

**O que você deve ver**:

Se você já configurou pelo menos uma conta de plataforma de IA, verá uma saída semelhante a esta (usando OpenAI como exemplo):

::: code-group

```markdown [Saída em Sistema Chinês]
## Cota da Conta do OpenAI

Conta:        user@example.com (team)

3-hour limit
█████████████████████████ 剩余 85%
重置: 2h 30m后
```

```markdown [Saída em Sistema Inglês]
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m
```

:::

::: tip Nota Sobre Idioma de Saída
O plugin detectará automaticamente o idioma do seu sistema (sistema chinês exibe chinês, sistema inglês exibe inglês), ambas as saídas acima estão corretas.
:::

Se você ainda não configurou nenhuma conta, verá:

::: code-group

```markdown [Saída em Sistema Chinês]
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

```markdown [Saída em Sistema Inglês]
No configured accounts found.

Supported account types:
- OpenAI (Plus/Team/Pro subscribers)
- Zhipu AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

:::

#### 5.2 Entenda o Significado da Saída

| Elemento (versão em chinês) | Elemento (versão em inglês) | Significado |
| ------------------------- | ------------------------- | ---------------------- |
| `## OpenAI 账号额度` | `## OpenAI Account Quota` | Título da plataforma |
| `user@example.com (team)` | `user@example.com (team)` | Informações da conta (e-mail ou equipe) |
| `3小时限额` | `3-hour limit` | Tipo de cota (cota de 3 horas) |
| `剩余 85%` | `85% remaining` | Porcentagem restante |
| `重置: 2h 30m后` | `Resets in: 2h 30m` | Contador regressivo de reinicialização |

**Por que a API Key não é exibida completamente**: Para proteger sua privacidade, o plugin exibirá a API Key de forma mascarada (ex: `9c89****AQVM`).

## Pontos de Verificação ✅

Confirme se você completou as seguintes etapas:

| Etapa | Método de Verificação | Resultado Esperado |
| ------------- | --------------------------------------- | --------------------------------------- |
| Instalar plugin | Verifique `~/.config/opencode/opencode.json` | O array `plugin` contém `"opencode-mystatus"` |
| Configurar comando de barra | Verifique o mesmo arquivo | O objeto `command` contém a configuração `mystatus` |
| Reiniciar OpenCode | Verifique o processo do OpenCode | Reiniciado |
| Testar comando | Digite `/mystatus` | Exibe informações de cota ou "No configured accounts found" |

## Cuidados Importantes

### Erro Comum 1: Erro de Formato JSON

**Sintoma**: O OpenCode falha ao iniciar, exibe um erro de formato JSON

**Causa**: No arquivo de configuração, há vírgulas ou aspas a mais ou a menos

**Solução**:

Use uma ferramenta de validação JSON online para verificar o formato, por exemplo:

```json
// ❌ Errado: vírgula extra no último item
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use mystatus tool..."
    }
  }  // ← não deve haver vírgula aqui
}

// ✅ Correto
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use mystatus tool..."
    }
  }
}
```

---

### Erro Comum 2: Esquecer de Reiniciar o OpenCode

**Sintoma**: Após completar a configuração, digite `/mystatus`, a mensagem "command not found" é exibida

**Causa**: O OpenCode não recarregou o arquivo de configuração

**Solução**:

1. Saia completamente do OpenCode (não apenas minimize)
2. Reinicie o OpenCode
3. Tente o comando `/mystatus` novamente

---

### Erro Comum 3: Exibe "No configured accounts found"

**Sintoma**: Após executar `/mystatus`, exibe "No configured accounts found"

**Causa**: Ainda não configurou nenhuma plataforma de IA

**Solução**:

- Configure pelo menos uma plataforma de IA (OpenAI, Zhipu AI, Z.ai, GitHub Copilot ou Google Cloud)
- Consulte as instruções de configuração no [Tutorial de Início Rápido](/pt/vbgate/opencode-mystatus/start/quick-start/)

---

### Erro Comum 4: Falha na Consulta de Cota do Google Cloud

**Sintoma**: Outras plataformas podem ser consultadas normalmente, mas o Google Cloud exibe um erro

**Causa**: O Google Cloud requer um plugin de autenticação adicional

**Solução**:

Primeiro instale o plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) para completar a autenticação da conta do Google.

## Resumo da Lição

Nesta lição, completamos a instalação e verificação inicial do opencode-mystatus:

1. **Três métodos de instalação**: deixar o AI instalar (recomendado), instalação manual, instalação a partir de arquivo local
2. **Localização do arquivo de configuração**: `~/.config/opencode/opencode.json`
3. **Itens de configuração principais**:
   - Array `plugin`: adicione `"opencode-mystatus"`
   - Objeto `command`: configure o comando de barra `mystatus`
4. **Método de verificação**: após reiniciar o OpenCode, digite `/mystatus`
5. **Leitura automática de autenticação**: o plugin lê automaticamente as informações de contas configuradas de `~/.local/share/opencode/auth.json`

Após completar a instalação, você pode usar o comando `/mystatus` ou consultas em linguagem natural no OpenCode para verificar a cota de todas as plataformas de IA.

## Próxima Lição

> Na próxima lição, aprenderemos **[Usando mystatus: Comandos de Barra e Linguagem Natural](/pt/vbgate/opencode-mystatus/start/using-mystatus/)**.
>
> Você aprenderá:
> - Uso detalhado do comando de barra `/mystatus`
> - Como acionar a ferramenta mystatus com perguntas em linguagem natural
> - Diferença entre os dois métodos de acionamento e cenários aplicáveis
> - Princípio de configuração do comando de barra

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
| ----------------- | -------------------------------------------------------------------------------------------------- | ----- |
| Entrada do plugin | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 26-94 |
| Definição da ferramenta mystatus | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| Leitura de arquivo de autenticação | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 35-46 |
| Consulta paralela de todas as plataformas | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| Coleta e resumo de resultados | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| Configuração do comando de barra | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |

**Constantes Chave**:
- Caminho do arquivo de autenticação: `~/.local/share/opencode/auth.json` (`plugin/mystatus.ts:35`)

**Funções Chave**:
- `mystatus()`: Função principal da ferramenta mystatus, lê o arquivo de autenticação e consulta paralelamente todas as plataformas (`plugin/mystatus.ts:29-33`)
- `collectResult()`: Coleta resultados de consulta nos arrays results e errors (`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()`: Consulta a cota do OpenAI (`plugin/lib/openai.ts`)
- `queryZhipuUsage()`: Consulta a cota do Zhipu AI (`plugin/lib/zhipu.ts`)
- `queryZaiUsage()`: Consulta a cota do Z.ai (`plugin/lib/zhipu.ts`)
- `queryGoogleUsage()`: Consulta a cota do Google Cloud (`plugin/lib/google.ts`)
- `queryCopilotUsage()`: Consulta a cota do GitHub Copilot (`plugin/lib/copilot.ts`)

**Formato do Arquivo de Configuração**:
Para a configuração do plugin e do comando de barra no arquivo de configuração do OpenCode `~/.config/opencode/opencode.json`, consulte [`README.zh-CN.md`](https://github.com/vbgate/opencode-mystatus/blob/main/README.zh-CN.md#安装) linhas 33-82.

</details>
