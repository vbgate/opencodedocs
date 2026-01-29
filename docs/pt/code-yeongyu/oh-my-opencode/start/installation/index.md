---
title: "Instalação: Configuração Rápida | oh-my-opencode"
sidebarTitle: "Instalação"
subtitle: "Instalação: Configuração Rápida | oh-my-opencode"
description: "Aprenda a instalar o oh-my-opencode com agente de IA ou CLI. Configure os provedores Claude, OpenAI, Gemini em minutos com verificação automática."
tags:
  - "instalação"
  - "configuração"
  - "configuração-de-provedor"
prerequisite: []
order: 10
---

# Instalação e Configuração Rápida: Configuração de Provedor e Verificação

## O Que Você Vai Aprender

- ✅ Usar o método recomendado de agente de IA para instalar e configurar automaticamente o oh-my-opencode
- ✅ Concluir a configuração manualmente usando o instalador interativo do CLI
- ✅ Configurar múltiplos Provedores de IA incluindo Claude, OpenAI, Gemini e GitHub Copilot
- ✅ Verificar a instalação bem-sucedida e diagnosticar problemas de configuração
- ✅ Entender a prioridade do Provedor e o mecanismo de fallback

## Seus Desafios Atuais

- Você acabou de instalar o OpenCode mas enfrenta uma interface de configuração em branco sem saber por onde começar
- Você tem múltiplas assinaturas de serviços de IA (Claude, ChatGPT, Gemini) e não sabe como configurá-las uniformemente
- Você quer que a IA ajude na instalação mas não sabe como fornecer instruções de instalação precisas para a IA
- Você está preocupado que erros de configuração causem o funcionamento incorreto do plugin

## Quando Usar Isso

- **Primeira instalação do oh-my-opencode**: Este é o primeiro passo e deve ser concluído
- **Após adicionar novas assinaturas de Provedor de IA**: Por exemplo, quando você compra recentemente o Claude Max ou ChatGPT Plus
- **Ao alternar ambientes de desenvolvimento**: Reconfigurando seu ambiente de desenvolvimento em uma nova máquina
- **Ao encontrar problemas de conexão do Provedor**: Solucionar problemas de configuração através de comandos de diagnóstico

## 🎒 Pré-requisitos

::: warning Pré-requisitos
Este tutorial assume que você já:
1. Instalou o **OpenCode >= 1.0.150**
2. Tem pelo menos uma assinatura de Provedor de IA (Claude, OpenAI, Gemini, GitHub Copilot, etc.)

Se o OpenCode não estiver instalado, consulte a [documentação oficial do OpenCode](https://opencode.ai/docs) para concluir a instalação primeiro.
:::

::: tip Verificar versão do OpenCode
```bash
opencode --version
# Deve exibir 1.0.150 ou superior
```
:::

## Conceitos Principais

O design de instalação do oh-my-opencode é baseado em dois princípios principais:

**1. Agente de IA em Primeiro Lugar (Recomendado)**

Deixe agentes de IA ajudarem você a instalar e configurar em vez de operações manuais. Por quê?
- A IA não perde etapas (ela tem o guia de instalação completo)
- A IA seleciona automaticamente a melhor configuração com base na sua assinatura
- A IA pode diagnosticar e corrigir erros automaticamente quando eles ocorrem

**2. Interativo vs Não Interativo**

- **Instalação interativa**: Execute `bunx oh-my-opencode install`, configure através de perguntas e respostas
- **Instalação não interativa**: Use parâmetros de linha de comando (adequado para automação ou agentes de IA)

**3. Prioridade do Provedor**

O oh-my-opencode usa um mecanismo de resolução de modelo em três etapas:
1. **Substituição do usuário**: Se um modelo for especificado explicitamente no arquivo de configuração, use esse modelo
2. **Fallback do Provedor**: Tente pela cadeia de prioridade: `Nativo (anthropic/openai/google) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`
3. **Padrão do sistema**: Se todos os Provedores estiverem indisponíveis, use o modelo padrão do OpenCode

::: info O que é um Provedor?
Um Provedor é um provedor de serviços de modelo de IA, como:
- **Anthropic**: Fornece modelos Claude (Opus, Sonnet, Haiku)
- **OpenAI**: Fornece modelos GPT (GPT-5.2, GPT-5-nano)
- **Google**: Fornece modelos Gemini (Gemini 3 Pro, Flash)
- **GitHub Copilot**: Fornece vários modelos hospedados pelo GitHub como fallback

O oh-my-opencode pode configurar múltiplos Provedores simultaneamente, selecionando automaticamente o modelo ideal com base no tipo de tarefa e prioridade.
:::

## Siga Junto

### Etapa 1: Método Recomendado—Deixe o Agente de IA Instalar (Amigável para Humanos)

**Por quê**
Este é o método de instalação oficialmente recomendado, deixando agentes de IA completarem automaticamente a configuração para evitar erros humanos ao perder etapas.

**Como fazer**

Abra sua interface de chat de IA (Claude Code, AmpCode, Cursor, etc.) e digite o seguinte prompt:

```bash
Por favor, instale e configure o oh-my-opencode seguindo este guia:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opeta/refs/heads/master/docs/guide/installation.md
```

**O que você deve ver**
O agente de IA irá:
1. Perguntar sobre suas assinaturas (Claude, OpenAI, Gemini, GitHub Copilot, etc.)
2. Executar automaticamente comandos de instalação
3. Configurar autenticação do Provedor
4. Verificar resultados da instalação
5. Informar que a instalação está concluída

::: tip Frase de teste do agente de IA
Após concluir a instalação, o agente de IA usará "oMoMoMoMo..." como uma frase de teste para confirmar com você.
:::

### Etapa 2: Instalação Manual—Usando o Instalador Interativo do CLI

**Por quê**
Use isso se você quiser controle total sobre o processo de instalação, ou se a instalação do agente de IA falhar.

::: code-group

```bash [Usando Bun (recomendado)]
bunx oh-my-opencode install
```

```bash [Usando npm]
npx oh-my-opencode install
```

:::

> **Nota**: O CLI baixa automaticamente um binário independente adequado para sua plataforma. Não é necessário o runtime Bun/Node.js após a instalação.
>
> **Plataformas suportadas**: macOS (ARM64, x64), Linux (x64, ARM64, Alpine/musl), Windows (x64)

**O que você deve ver**
O instalador fará as seguintes perguntas:

```
oMoMoMoMo... I
nstall

[?] Você tem uma assinatura Claude Pro/Max? (S/n)
[?] Você está no max20 (modo 20x)? (S/n)
[?] Você tem uma assinatura OpenAI/ChatGPT Plus? (S/n)
[?] Você vai integrar modelos Gemini? (S/n)
[?] Você tem uma assinatura GitHub Copilot? (S/n)
[?] Você tem acesso ao OpenCode Zen (modelos opencode/)? (S/n)
[?] Você tem uma assinatura Z.ai Coding Plan? (S/n)

Resumo da Configuração
───────────────────────────────────────────────

  [OK] Claude (max20)
  [OK] OpenAI/ChatGPT (GPT-5.2 para Oracle)
  [OK] Gemini
  [OK] GitHub Copilot (fallback)
  ○ OpenCode Zen (modelos opencode/)
  ○ Z.ai Coding Plan (Librarian/Multimodal)

───────────────────────────────────────────────

Atribuição de Modelo

  [i] Modelos auto-configurados com base na prioridade do provedor
  * Prioridade: Nativo > Copilot > OpenCode Zen > Z.ai

✓ Plugin registrado em opencode.json
✓ Configuração escrita em ~/.config/opencode/oh-my-opencode.json
✓ Dicas de configuração de autenticação exibidas

[!] Por favor, configure a autenticação para seus provedores:

1. Anthropic (Claude): Execute 'opencode auth login' → Selecione Anthropic
2. Google (Gemini): Execute 'opencode auth login' → Selecione Google → Escolha OAuth com Google (Antigravity)
3. GitHub (Copilot): Execute 'opencode auth login' → Selecione GitHub

Concluído! 🎉
```
### Etapa 3: Configurar Autenticação do Provedor

#### 3.1 Autenticação Claude (Anthropic)

**Por quê**
O agente principal Sisyphus recomenda fortemente o uso do modelo Opus 4.5, então você deve autenticar primeiro.

**Como fazer**

```bash
opencode auth login
```

Em seguida, siga os prompts:
1. **Selecione o Provedor**: Escolha `Anthropic`
2. **Selecione o método de login**: Escolha `Claude Pro/Max`
3. **Conclua o fluxo OAuth**: Faça login e autorize no seu navegador
4. **Aguarde a conclusão**: O terminal exibirá a autenticação bem-sucedida

**O que você deve ver**
```
✓ Autenticação bem-sucedida
✓ Provedor Anthropic configurado
```

::: warning Restrição de acesso OAuth do Claude
> A partir de janeiro de 2026, a Anthropic restringiu o acesso OAuth de terceiros, citando violações dos Termos de Serviço.
>
> [**A Anthropic citou este projeto oh-my-opencode como motivo para bloquear o OpenCode**](https://x.com/thdxr/status/2010149530486911014)
>
> De fato, existem plugins na comunidade que forjam assinaturas de solicitação OAuth do Claude Code. Essas ferramentas podem ser tecnicamente viáveis, mas os usuários devem estar cientes das implicações dos Termos de Serviço, e pessoalmente não recomendo o uso delas.
>
> Este projeto não é responsável por quaisquer problemas causados pelo uso de ferramentas não oficiais, e **não temos implementação de sistema OAuth personalizada**.
:::

#### 3.2 Autenticação Google Gemini (OAuth Antigravity)

**Por quê**
Modelos Gemini são usados para Multimodal Looker (análise de mídia) e algumas tarefas especializadas.

**Como fazer**

**Etapa 1**: Adicionar Plugin de Autenticação Antigravity

Edite `~/.config/opencode/opencode.json`, adicione `opencode-antigravity-auth@latest` ao array `plugin`:

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Etapa 2**: Configurar Modelos Antigravity (Obrigatório)

Copie a configuração completa do modelo da [documentação do opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth), mescule-a cuidadosamente em `~/.config/opencode/oh-my-opencode.json` para evitar quebrar a configuração existente.

O plugin usa um **sistema de variantes**—modelos como `antigravity-gemini-3-pro` suportam variantes `low`/`high`, não entradas de modelo separadas `-low`/`-high`.

**Etapa 3**: Substituir Modelos de Agente do oh-my-opencode

Substitua modelos de agente em `oh-my-opencode.json` (ou `.opencode/oh-my-opencode.json`):

```json
{
  "agents": {
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Modelos Disponíveis (cota Antigravity)**:
- `google/antigravity-gemini-3-pro` — variantes: `low`, `high`
- `google/antigravity-gemini-3-flash` — variantes: `minimal`, `low`, `medium`, `high`
- `google/antigravity-claude-sonnet-4-5` — sem variantes
- `google/antigravity-claude-sonnet-4-5-thinking` — variantes: `low`, `max`
- `google/antigravity-claude-opus-4-5-thinking` — variantes: `low`, `max`

**Modelos Disponíveis (cota Gemini CLI)**:
- `google/gemini-2.5-flash`, `google/gemini-2.5-pro`
- `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

> **Nota**: Nomes tradicionais com sufixos como `google/antigravity-gemini-3-pro-high` ainda estão disponíveis, mas variantes são recomendadas. Alterne para usar `--variant=high` com o nome do modelo base.

**Etapa 4**: Executar Autenticação

```bash
opencode auth login
```

Em seguida, siga os prompts:
1. **Selecione o Provedor**: Escolha `Google`
2. **Selecione o método de login**: Escolha `OAuth com Google (Antigravity)`
3. **Conclua o login no navegador**: (detectado automaticamente) Conclua o login
4. **Opcional**: Adicione mais contas do Google para balanceamento de carga multi-conta
5. **Verifique o sucesso**: Confirme com o usuário

**O que você deve ver**
```
✓ Autenticação bem-sucedida
✓ Provedor Google configurado (Antigravity)
✓ Múltiplas contas disponíveis para balanceamento de carga
```

::: tip Balanceamento de carga multi-conta
O plugin suporta até 10 contas do Google. Quando uma conta atinge limites de taxa, ela alterna automaticamente para a próxima conta disponível.
:::

#### 3.3 Autenticação GitHub Copilot (Provedor de Fallback)

**Por quê**
O GitHub Copilot serve como um **provedor de fallback**, usado quando provedores Nativos não estão disponíveis.

**Prioridade**: `Nativo (anthropic/, openai/, google/) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`

**Como fazer**

```bash
opencode auth login
```

Em seguida, siga os prompts:
1. **Selecione o Provedor**: Escolha `GitHub`
2. **Selecione o método de autenticação**: Escolha `Autenticar via OAuth`
3. **Conclua o login no navegador**: Fluxo OAuth do GitHub

**O que você deve ver**
```
✓ Autenticação bem-sucedida
✓ GitHub Copilot configurado como fallback
```

::: info Mapeamento de modelo do GitHub Copilot
Quando o GitHub Copilot é o melhor provedor disponível, o oh-my-opencode usa a seguinte atribuição de modelo:

| Agente        | Modelo                          |
|--- | ---|
| **Sisyphus** | `github-copilot/claude-opus-4.5` |
| **Oracle**   | `github-copilot/gpt-5.2`       |
| **Explore**  | `opencode/gpt-5-nano`           |
| **Librarian** | `zai-coding-plan/glm-4.7` (se Z.ai disponível) ou fallback |

O GitHub Copilot atua como um provedor proxy, roteando solicitações para modelos subjacentes com base na sua assinatura.
:::
### Etapa 4: Instalação Não Interativa (Adequada para Agentes de IA)

**Por quê**
Agentes de IA precisam usar o modo não interativo, completando todas as configurações de uma vez através de parâmetros de linha de comando.

**Como fazer**

```bash
bunx oh-my-opencode install --no-tui \
  --claude=<yes|no|max20> \
  --openai=<yes|no> \
  --gemini=<yes|no> \
  --copilot=<yes|no> \
  [--opencode-zen=<yes|no>] \
  [--zai-coding-plan=<yes|no>]
```

**Descrição dos parâmetros**:

| Parâmetro           | Valor           | Descrição                                        |
|--- | --- | ---|
| `--no-tui`         | -               | Desabilitar interface interativa (deve especificar outros parâmetros) |
| `--claude`         | `yes/no/max20`  | Status da assinatura Claude                           |
| `--openai`         | `yes/no`        | Assinatura OpenAI/ChatGPT (GPT-5.2 para Oracle)    |
| `--gemini`         | `yes/no`        | Integração Gemini                                 |
| `--copilot`        | `yes/no`        | Assinatura GitHub Copilot                        |
| `--opencode-zen`   | `yes/no`        | Acesso ao OpenCode Zen (padrão não)                   |
| `--zai-coding-plan` | `yes/no`        | Assinatura Z.ai Coding Plan (padrão não)         |

**Exemplos**:

```bash
# Usuário tem todas as assinaturas nativas
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no

# Usuário tem apenas Claude
bunx oh-my-opencode install --no-tui \
  --claude=yes \
  --openai=no \
  --gemini=no \
  --copilot=no

# Usuário tem apenas GitHub Copilot
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=yes

# Usuário não tem assinaturas
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no
```

**O que você deve ver**
A mesma saída da instalação interativa, mas sem responder perguntas manualmente.
## Ponto de Verificação ✅

### Verificar Instalação Bem-sucedida

**Verificação 1**: Confirmar Versão do OpenCode

```bash
opencode --version
```

**Resultado esperado**: Exibe `1.0.150` ou versão superior.

::: warning Requisito de versão do OpenCode
Se você estiver na versão 1.0.132 ou anterior, bugs do OpenCode podem corromper sua configuração.
>
> Esta correção foi mesclada após 1.0.132—use uma versão mais recente.
> Curiosidade: Este PR foi descoberto e corrigido devido às configurações do Librarian, Explore e Oracle do OhMyOpenCode.
:::

**Verificação 2**: Confirmar Plugin Registrado

```bash
cat ~/.config/opencode/opencode.json
```

**Resultado esperado**: Veja `"oh-my-opencode"` no array `plugin`.

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Verificação 3**: Confirmar Arquivo de Configuração Gerado

```bash
cat ~/.config/opencode/oh-my-opencode.json
```

**Resultado esperado**: Exibir estrutura de configuração completa, incluindo campos `agents`, `categories`, `disabled_agents` e outros.

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
    "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/gpt-5.2"
    },
    ...
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1
    },
    ...
  },
  "disabled_agents": [],
  "disabled_skills": [],
  "disabled_hooks": [],
  "disabled_mcps": []
}
```
### Executar Comando de Diagnóstico

```bash
oh-my-opencode doctor --verbose
```

**O que você deve ver**:
- Verificações de resolução de modelo
- Verificação de configuração de agente
- Status de conexão MCP
- Status de autenticação do provedor

```bash
✓ Versão do OpenCode: 1.0.150 (requerido: >=1.0.150)
✓ Plugin registrado: oh-my-opencode
✓ Arquivo de configuração encontrado: ~/.config/opencode/oh-my-opencode.json
✓ Provedor Anthropic: autenticado
✓ Provedor OpenAI: autenticado
✓ Provedor Google: autenticado (Antigravity)
✓ GitHub Copilot: autenticado (fallback)
✓ Servidores MCP: 3 conectados (websearch, context7, grep_app)
✓ Agentes: 10 habilitados
✓ Hooks: 32 habilitados
```

::: danger Se o diagnóstico falhar
Se o diagnóstico mostrar quaisquer erros, resolva-os primeiro:
1. **Falha de autenticação do provedor**: Execute novamente `opencode auth login`
2. **Erro no arquivo de configuração**: Verifique a sintaxe de `oh-my-opencode.json` (JSONC suporta comentários e vírgulas à direita)
3. **Incompatibilidade de versão**: Atualize o OpenCode para a versão mais recente
4. **Plugin não registrado**: Execute novamente `bunx oh-my-opencode install`
:::
## Armadilhas Comuns

### ❌ Erro 1: Esquecer de Configurar Autenticação do Provedor

**Problema**: Modelos de IA não funcionam após uso direto após instalação.

**Causa**: Plugin está instalado, mas o Provedor não foi autenticado através do Open OpenCode.

**Solução**:
```bash
opencode auth login
# Selecione o Provedor correspondente e conclua a autenticação
```

### ❌ Erro 2: Versão do OpenCode Muito Antiga

**Problema**: Arquivo de configuração está corrompido ou não pode ser carregado.

**Causa**: A versão 1.0.132 ou anterior do OpenCode tem um bug que corrompe a configuração.

**Solução**:
```bash
# Atualizar o OpenCode
npm install -g @opencode/cli@latest

# Ou use gerenciador de pacotes (Bun, Homebrew, etc.)
bun install -g @opencode/cli@latest
```

### ❌ Erro 3: Parâmetros Incorretos do Comando CLI

**Problema**: Erro de parâmetro ao executar instalação não interativa.

**Causa**: `--claude` é um parâmetro obrigatório e deve ser fornecido como `yes`, `no` ou `max20`.

**Solução**:
```bash
# ❌ Errado: Parâmetro --claude ausente
bunx oh-my-opencode install --no-tui --gemini=yes

# ✅ Correto: Fornecer todos os parâmetros obrigatórios
bunx oh-my-opencode install --no-tui --claude=yes --gemini=yes
```

### ❌ Erro 4: Cota Antigravity Esgotada

**Problema**: Modelos Gemini param de funcionar repentinamente.

**Causa**: A cota Antigravity é limitada, e uma única conta pode atingir limites de taxa.

**Solução**: Adicionar múltiplas contas do Google para balanceamento de carga
```bash
opencode auth login
# Selecione Google
# Adicione mais contas
```

O plugin alterna automaticamente entre contas para evitar esgotamento de conta única.

### ❌ Erro 5: Localização Incorreta do Arquivo de Configuração

**Problema**: Alterações não entram em vigor após modificar a configuração.

**Causa**: Modificou o arquivo de configuração errado (configuração do projeto vs configuração do usuário).

**Solução**: Confirmar localização do arquivo de configuração

| Tipo de Configuração | Caminho do Arquivo | Prioridade |
|--- | --- | ---|
| **Configuração do usuário** | `~/.config/opencode/oh-my-opencode.json` | Alta |
| **Configuração do projeto** | `.opencode/oh-my-opencode.json` | Baixa |

::: tip Regras de mesclagem de configuração
Se a configuração do usuário e a configuração do projeto existirem, **a configuração do usuário substitui a configuração do projeto**.
:::
## Resumo

- **Recomendado usar agente de IA para instalação**: Deixe a IA completar automaticamente a configuração para evitar erros humanos
- **O CLI suporta modos interativo e não interativo**: Interativo é adequado para humanos, não interativo para IA
- **Prioridade do Provedor**: Nativo > Copilot > OpenCode Zen > Z.ai
- **Autenticação é necessária**: Após a instalação, você deve configurar a autenticação do Provedor para usar
- **Comandos de diagnóstico são importantes**: `oh-my-opencode doctor --verbose` pode solucionar rapidamente problemas
- **Suporta formato JSONC**: Arquivos de configuração suportam comentários e vírgulas à direita

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Conheça Sisyphus: O Orquestrador Principal](../sisyphus-orchestrator/)**.
>
> Você aprenderá:
> - Funções principais e filosofia de design do agente Sisyphus
> - Como usar o Sisyphus para planejar e delegar tarefas
> - Como funcionam tarefas em paralelo em segundo plano
> - O princípio do executor de conclusão de Todo

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir locais do código fonte</strong></summary>

> Atualizado: 2026-01-26

| Recurso         | Caminho do Arquivo                                                                                              | Linha   |
|--- | --- | ---|
| Entrada de instalação CLI | [`src/cli/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/index.ts)         | 22-60  |
| Instalador interativo | [`src/cli/install.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/install.ts)     | 1-400+ |
| Gerenciador de configuração  | [`src/cli/config-manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/config-manager.ts) | 1-200+ |
| Esquema de configuração   | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts)   | 1-400+ |
| Comando de diagnóstico | [`src/cli/doctor.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/doctor.ts)        | 1-200+ |

**Constantes principais**:
- `VERSION = packageJson.version`: Número da versão atual do CLI
- `SYMBOLS`: Símbolos da UI (check, cross, arrow, bullet, info, warn, star)

**Funções principais**:
- `install(args: InstallArgs)`: Função principal de instalação, manipula instalação interativa e não interativa
- `validateNonTuiArgs(args: InstallArgs)`: Valida parâmetros para modo não interativo
- `argsToConfig(args: InstallArgs)`: Converte parâmetros CLI para objeto de configuração
- `addPluginToOpenCodeConfig()`: Registra plugin em opencode.json
- `writeOmoConfig(config)`: Escreve arquivo de configuração oh-my-opencode.json
- `isOpenCodeInstalled()`: Verifica se o OpenCode está instalado
- `getOpenCodeVersion()`: Obtém número da versão do OpenCode

**Campos do esquema de configuração**:
- `AgentOverrideConfigSchema`: Configuração de substituição de agente (modelo, variante, skills, temperatura, prompt, etc.)
- `CategoryConfigSchema`: Configuração de categoria (descrição, modelo, temperatura, thinking, etc.)
- `ClaudeCodeConfigSchema`: Configuração de compatibilidade do Claude Code (mcp, commands, skills, agents, hooks, plugins)
- `BuiltinAgentNameSchema`: Enumeração de agente integrado (sisyphus, prometheus, oracle, librarian, explore, multimodal-looker, metis, momus, atlas)
- `PermissionValue`: Enumeração de valor de permissão (ask, allow, deny)

**Plataformas suportadas pela instalação** (do README):
- macOS (ARM64, x64)
- Linux (x64, ARM64, Alpine/musl)
- Windows (x64)

**Cadeia de prioridade do provedor** (do docs/guide/installation.md):
1. Nativo (anthropic/, openai/, google/)
2. GitHub Copilot
3. OpenCode Zen
4. Z.ai Coding Plan

</details>
