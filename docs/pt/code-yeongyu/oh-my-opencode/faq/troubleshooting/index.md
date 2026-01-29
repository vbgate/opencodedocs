---
title: "Solução de Problemas: Comando Doctor | oh-my-opencode"
subtitle: "Usando o Comando Doctor para Diagnóstico de Configuração"
sidebarTitle: "Solução de Problemas"
description: "Aprenda os métodos de diagnóstico do comando doctor do oh-my-opencode. Execute 17+ verificações de saúde incluindo versão, plugins, autenticação e modelos para resolver problemas rapidamente."
tags:
  - "solução de problemas"
  - "diagnóstico"
  - "configuração"
prerequisite:
  - "start-installation"
order: 150
---

# Diagnóstico de Configuração e Solução de Problemas: Usando o Comando Doctor para Resolver Problemas Rapidamente

## O Que Você Vai Aprender

- Executar `oh-my-opencode doctor` para diagnosticar rapidamente 17+ verificações de saúde
- Localizar e corrigir problemas como versão desatualizada do OpenCode, plugins não registrados, problemas de configuração do Provider
- Entender o mecanismo de resolução de modelos e verificar atribuições de modelos de agentes e Categorias
- Usar o modo detalhado para obter informações completas para diagnóstico de problemas

## Seu Desafio Atual

Após instalar o oh-my-opencode, o que você faz quando encontra:

- OpenCode relata que o plugin não foi carregado, mas o arquivo de configuração parece correto
- Alguns agentes de IA sempre retornam erro com "Model not found"
- Quer verificar se todos os Providers (Claude, OpenAI, Gemini) estão configurados corretamente
- Não tem certeza se o problema está na instalação, configuração ou autenticação

Solucionar problemas um por um é demorado. Você precisa de uma **ferramenta de diagnóstico com um clique**.

## Conceitos Fundamentais

**O comando Doctor é o sistema de verificação de saúde do oh-my-opencode**, semelhante ao Utilitário de Disco do Mac ou a um scanner de diagnóstico automotivo. Ele verifica sistematicamente seu ambiente e informa o que está funcionando e o que tem problemas.

A lógica de verificação do Doctor vem inteiramente da implementação do código-fonte (`src/cli/doctor/checks/`), incluindo:
- ✅ **instalação**: versão do OpenCode, registro de plugins
- ✅ **configuração**: formato do arquivo de configuração, validação de Schema
- ✅ **autenticação**: plugins de autenticação Anthropic, OpenAI, Google
- ✅ **dependências**: dependências Bun, Node.js, Git
- ✅ **ferramentas**: status do servidor LSP e MCP
- ✅ **atualizações**: verificações de atualização de versão

## Siga Junto

### Passo 1: Executar Diagnóstico Básico

**Por que**
Execute uma verificação completa primeiro para entender o status geral de saúde.

```bash
bunx oh-my-opencode doctor
```

**Você Deve Ver**:

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**Ponto de Verificação ✅**:
- [ ] Ver resultados para 6 categorias
- [ ] Cada item tem marcador ✓ (aprovado), ⚠ (aviso), ✗ (falhou)
- [ ] Estatísticas resumidas na parte inferior

### Passo 2: Interpretar Problemas Comuns

Com base nos resultados do diagnóstico, você pode localizar rapidamente problemas. Aqui estão erros comuns e soluções:

#### ✗ "OpenCode version too old"

**Problema**: A versão do OpenCode está abaixo de 1.0.150 (requisito mínimo)

**Causa**: O oh-my-opencode depende de novos recursos do OpenCode, que versões antigas não suportam

**Solução**:

```bash
# Atualizar OpenCode
npm install -g opencode@latest
# Ou usar Bun
bun install -g opencode@latest
```

**Verificação**: Execute novamente `bunx oh-my-opencode doctor`

#### ✗ "Plugin not registered"

**Problema**: Plugin não registrado no array `plugin` do `opencode.json`

**Causa**: Processo de instalação interrompido, ou arquivo de configuração editado manualmente

**Solução**:

```bash
# Executar instalador novamente
bunx oh-my-opencode install
```

**Base do Código-Fonte** (`src/cli/doctor/checks/plugin.ts:79-117`):
- Verifica se o plugin está no array `plugin` do `opencode.json`
- Suporta formatos: `oh-my-opencode` ou `oh-my-opencode@version` ou caminho `file://`

#### ✗ "Configuration has validation errors"

**Problema**: O arquivo de configuração não corresponde à definição do Schema

**Causa**: Erros introduzidos durante edição manual (como erros de digitação, incompatibilidade de tipos)

**Solução**:

1. Use `--verbose` para visualizar informações detalhadas de erro:

```bash
bunx oh-my-opencode doctor --verbose
```

2. Tipos comuns de erros (de `src/config/schema.ts`):

| Mensagem de Erro | Causa | Correção |
|--- | --- | ---|
| `agents.sisyphus.mode: Invalid enum value` | `mode` só pode ser `subagent`/`primary`/`all` | Altere para `primary` |
| `categories.quick.model: Expected string` | `model` deve ser uma string | Adicione aspas: `"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | Concorrência deve ser um número | Altere para número: `3` |

3. Consulte [Referência de Configuração](../../appendix/configuration-reference/) para verificar definições de campos

#### ⚠ "Auth plugin not installed"

**Problema**: O plugin de autenticação do Provider não está instalado

**Causa**: Pulou esse Provider durante a instalação, ou desinstalou o plugin manualmente

**Solução**:

```bash
# Reinstalar e selecionar Provider ausente
bunx oh-my-opencode install
```

**Base do Código-Fonte** (`src/cli/doctor/checks/auth.ts:11-15`):

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### Passo 3: Verificar Resolução de Modelos

A resolução de modelos é o mecanismo central do oh-my-opencode, verificando se as atribuições de modelos de agentes e Categorias estão corretas.

```bash
bunx oh-my-opencode doctor --category configuration
```

**Você Deve Ver**:

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══

    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15

    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh

  ═══ Configured Models ═══

  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...

  Categories:
    ○ visual-engineering: google/gemini-3-pro
    ○ ultrabrain: openai/gpt-5.2-codex
    ...

  ○ = provider fallback
```

**Ponto de Verificação ✅**:
- [ ] Ver atribuições de modelos de Agentes e Categorias
- [ ] `○` significa usando mecanismo de fallback do Provider (não substituído manualmente)
- [ ] `●` significa que o usuário substituiu o modelo padrão na configuração

**Problemas Comuns**:

| Problema | Causa | Solução |
|--- | --- | ---|
| Modelo `unknown` | A cadeia de fallback do Provider está vazia | Certifique-se de que pelo menos um Provider esteja disponível |
| Modelo não usado | Provider não conectado | Execute `opencode` para conectar o Provider |
| Quer substituir modelo | Usando modelo padrão | Defina `agents.<name>.model` em `oh-my-opencode.json` |

**Base do Código-Fonte** (`src/cli/doctor/checks/model-resolution.ts:129-148`):
- Lê modelos disponíveis de `~/.cache/opencode/models.json`
- Requisitos de modelo de agente: `AGENT_MODEL_REQUIREMENTS` (`src/shared/model-requirements.ts`)
- Requisitos de modelo de Categoria: `CATEGORY_MODEL_REQUIREMENTS`

### Passo 4: Usar Saída JSON (Scripting)

Se você deseja automatizar o diagnóstico em CI/CD, use o formato JSON:

```bash
bunx oh-my-opencode doctor --json
```

**Você Deve Ver**:

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message":": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**Casos de Uso**:

```bash
# Salvar relatório de diagnóstico em arquivo
bunx oh-my-opencode doctor --json > doctor-report.json

# Verificar status de saúde em CI/CD
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "Todas as verificações passaram"
else
  echo "Algumas verificações falharam"
  exit 1
fi
```

## Armadilhas Comuns

### Armadilha 1: Ignorar Mensagens de Aviso

**Problema**: Ver marcadores `⚠` e pensar que são "opcionais", quando podem ser dicas importantes

**Solução**:
- Por exemplo: o aviso "using default model" significa que você não configurou modelos de Categorias, o que pode não ser ideal
- Use `--verbose` para visualizar informações detalhadas e decidir se é necessária alguma ação

### Armadilha 2: Editar Manualmente opencode.json

**Problema**: Modificar diretamente o `opencode.json` do OpenCode, quebrando o registro do plugin

**Solução**:
- Use `bunx oh-my-opencode install` para registrar novamente
- Ou modifique apenas `oh-my-opencode.json`, não toque no arquivo de configuração do OpenCode

### Armadilha 3: Cache Não Atualizado

**Problema**: A resolução de modelos mostra "cache not found", mas o Provider está configurado

**Solução**:

```bash
# Iniciar OpenCode para atualizar o cache de modelos
opencode

# Ou atualizar manualmente (se o comando opencode models existir)
opencode models --refresh
```

## Resumo

O comando Doctor é o canivete suíço do oh-my-opencode, ajudando você a localizar problemas rapidamente:

| Comando | Propósito | Quando Usar |
|--- | --- | ---|
| `bunx oh-my-opencode doctor` | Diagnóstico completo | Após instalação inicial, ao encontrar problemas |
| `--verbose` | Informações detalhadas | Precisa visualizar detalhes de erro |
| `--json` | Saída JSON | CI/CD, automação de scripts |
| `--category <name>` | Verificação de categoria única | Só quer verificar aspecto específico |

**Lembre-se**: Sempre que encontrar um problema, execute `doctor` primeiro, entenda claramente o erro antes de tomar qualquer ação.

## Próximo Passo

> Na próxima lição, aprenderemos **[Perguntas Frequentes](../faq/)**.
>
> Você aprenderá:
> - Diferenças entre oh-my-opencode e outras ferramentas de IA
> - Como otimizar custos de uso de modelos
> - Melhores práticas para controle de simultaneidade de tarefas em segundo plano

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir locais do código-fonte</strong></summary>

> Atualizado: 2026-01-26

| Recurso | Caminho do Arquivo | Números de Linha |
|--- | --- | ---|
| Entrada do comando Doctor | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| Registro de todas as verificações | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| Verificação de registro de plugin | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| Verificação de validação de configuração | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| Verificação de autenticação | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| Verificação de resolução de modelos | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| Schema de Configuração | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| Definição de requisitos de modelo | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | Arquivo completo |

**Constantes Principais**:
- `MIN_OPENCODE_VERSION = "1.0.150"`: Requisito mínimo de versão do OpenCode
- `AUTH_PLUGINS`: Mapeamento de plugins de autenticação (Anthropic=built-in, OpenAI/GitHub=plugins)
- `AGENT_MODEL_REQUIREMENTS`: Requisitos de modelo de agente (cadeia de prioridade de cada agente)
- `CATEGORY_MODEL_REQUIREMENTS`: Requisitos de modelo de Categoria (visual, quick, etc.)

**Funções Principais**:
- `doctor(options)`: Executar comando de diagnóstico, retorna código de saída
- `getAllCheckDefinitions()`: Obter definições de todos os 17+ itens de verificação
- `checkPluginRegistration()`: Verificar se o plugin está registrado em opencode.json
- `validateConfig(configPath)`: Validar se o arquivo de configuração corresponde ao Schema
- `checkAuthProvider(providerId)`: Verificar status do plugin de autenticação do Provider
- `checkModelResolution()`: Verificar resolução e atribuição de modelos

</details>
