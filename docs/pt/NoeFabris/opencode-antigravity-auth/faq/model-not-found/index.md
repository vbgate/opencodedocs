---
title: "Solução de Erros de Modelo: Resolver Problemas 400 e MCP | opencode-antigravity-auth"
sidebarTitle: "Modelo Não Encontrado"
subtitle: "Solução de Problemas de Modelo Não Encontrado e Erro 400"
description: "Aprenda a solucionar erros de modelo do Antigravity. Cobre diagnóstico e correção de erros Model not found, 400 Unknown name parameters, além de problemas de compatibilidade de servidores MCP, ajudando você a localizar problemas rapidamente."
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# Solução de Problemas de Modelo Não Encontrado e Erro 400

## O Problema que Você Enfrenta

Ao usar modelos Antigravity, você pode encontrar os seguintes erros:

| Mensagem de Erro | Sintomas Típicos |
| --- | --- |
| `Model not found` | Indica que o modelo não existe, não é possível iniciar requisição |
| `Invalid JSON payload received. Unknown name "parameters"` | Erro 400, falha na chamada de ferramenta |
| Erro de chamada do servidor MCP | Ferramentas MCP específicas não podem ser usadas |

Esses problemas geralmente estão relacionados à configuração, compatibilidade do servidor MCP ou versão do plugin.

## Diagnóstico Rápido

Antes de investigar profundamente, confirme primeiro:

**macOS/Linux**:
```bash
# Verificar versão do plugin
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# Verificar arquivo de configuração
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows**:
```powershell
# Verificar versão do plugin
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# Verificar arquivo de configuração
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## Problema 1: Model not found

**Sintomas do Erro**:

```
Model not found: antigravity-claude-sonnet-4-5
```

**Causa**: A configuração do provider Google no OpenCode está faltando o campo `npm`.

**Solução**:

No seu `~/.config/opencode/opencode.json`, adicione o campo `npm` ao provider `google`:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

**Passos de Verificação**:

1. Edite `~/.config/opencode/opencode.json`
2. Salve o arquivo
3. Tente chamar o modelo novamente no OpenCode
4. Verifique se o erro "Model not found" ainda aparece

::: tip Dica
Se não tiver certeza da localização do arquivo de configuração, execute:
```bash
opencode config path
```
:::

---

## Problema 2: Erro 400 - Unknown name 'parameters'

**Sintomas do Erro**:

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**O Que É Este Problema?**

Os modelos Gemini 3 usam **validação protobuf estrita**, e a API Antigravity requer que as definições de ferramentas usem um formato específico:

```json
// ❌ Formato incorreto (será rejeitado)
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← Este campo não é aceito
    }
  ]
}

// ✅ Formato correto
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← Dentro de functionDeclarations
        }
      ]
    }
  ]
}
```

O plugin converte automaticamente o formato, mas alguns **servidores MCP retornam Schemas com campos incompatíveis** (como `const`, `$ref`, `$defs`), causando falha na limpeza.

### Solução 1: Atualizar para a Versão Beta Mais Recente

A versão beta mais recente inclui correções de limpeza de Schema:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**macOS/Linux**:
```bash
npm install -g opencode-antigravity-auth@beta
```

**Windows**:
```powershell
npm install -g opencode-antigravity-auth@beta
```

### Solução 2: Desabilitar Servidores MCP um por um para Investigar

Alguns servidores MCP retornam Schemas em formato não compatível com os requisitos do Antigravity.

**Passos**:

1. Abra `~/.config/opencode/opencode.json`
2. Encontre a configuração `mcpServers`
3. **Desabilite todos os servidores MCP** (comente ou delete)
4. Tente chamar o modelo novamente
5. Se funcionar, **habilite os servidores MCP um por um**, testando após cada habilitação
6. Após encontrar o servidor MCP que causa o erro, desabilite-o ou reporte o problema aos mantenedores do projeto

**Exemplo de Configuração**:

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← Desabilitar temporariamente
    // "github": { ... },       ← Desabilitar temporariamente
    "brave-search": { ... }     ← Testar este primeiro
  }
}
```

### Solução 3: Adicionar npm override

Se os métodos acima não funcionarem, force o uso de `@ai-sdk/google` na configuração do provider `google`:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google"
    }
  }
}
```

---

## Problema 3: Servidor MCP Causa Falha na Chamada de Ferramenta

**Sintomas do Erro**:

- Ferramentas específicas não podem ser usadas (como WebFetch, operações de arquivo, etc.)
- Mensagem de erro relacionada a Schema
- Outras ferramentas funcionam normalmente

**Causa**: O JSON Schema retornado pelo servidor MCP contém campos não suportados pela API Antigravity.

### Características de Schema Incompatíveis

O plugin limpa automaticamente as seguintes características incompatíveis (código fonte `src/plugin/request-helpers.ts:24-37`):

| Característica | Método de Conversão | Exemplo |
| --- | --- | --- |
| `const` | Converter para `enum` | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | Converter para description hint | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "See: Foo" }` |
| `$defs` / `definitions` | Expandir no schema | Não usar mais referências |
| `minLength` / `maxLength` / `pattern` | Mover para description | Adicionar à dica de `description` |
| `additionalProperties` | Mover para description | Adicionar à dica de `description` |

Mas se a estrutura do Schema for muito complexa (como `anyOf`/`oneOf` com múltiplos níveis de aninhamento), a limpeza pode falhar.

### Fluxo de Investigação

```bash
# Habilitar logs de debug
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# Reiniciar OpenCode

# Ver erros de conversão de Schema nos logs
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**Palavras-chave para procurar nos logs**:

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### Reportar Problema

Se confirmar que um servidor MCP específico está causando o problema, envie uma [issue no GitHub](https://github.com/NoeFabris/opencode-antigravity-auth/issues), incluindo:

1. **Nome e versão do servidor MCP**
2. **Log completo do erro** (de `~/.config/opencode/antigravity-logs/`)
3. **Exemplo da ferramenta que dispara o problema**
4. **Versão do plugin** (execute `opencode --version`)

---

## Alertas Importantes

::: warning Ordem de Desabilitação de Plugins

Se você usar `opencode-antigravity-auth` e `@tarquinen/opencode-dcp` simultaneamente, **coloque o plugin Antigravity Auth primeiro**:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← Deve vir antes do DCP
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

O DCP cria mensagens synthetic assistant sem blocos de pensamento, o que pode causar erros de verificação de assinatura.
:::

::: warning Erro no Nome da Chave de Configuração

Certifique-se de usar `plugin` (singular), não `plugins` (plural):

```json
// ❌ Incorreto
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ Correto
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```
:::

---

## Quando Buscar Ajuda

Se o problema persistir após tentar todos os métodos acima:

**Verificar arquivos de log**:
```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**Redefinir conta** (limpar todo o estado):
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**Enviar issue no GitHub**, incluindo:
- Mensagem de erro completa
- Versão do plugin (`opencode --version`)
- Configuração de `~/.config/opencode/antigravity.json` (**remova informações sensíveis como refreshToken**)
- Logs de debug (`~/.config/opencode/antigravity-logs/latest.log`)

---

## Cursos Relacionados

- [Guia de Instalação Rápida](/pt/NoeFabris/opencode-antigravity-auth/start/quick-install/) - Configuração básica
- [Compatibilidade de Plugins](/pt/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) - Solução de conflitos com outros plugins
- [Logs de Debug](/pt/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) - Habilitar logs detalhados

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Função principal de limpeza de JSON Schema | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| Converter const para enum | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| Converter $ref para hints | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| Achatar anyOf/oneOf | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Conversão de formato de ferramenta Gemini | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**Constantes Chave**:
- `UNSUPPORTED_KEYWORDS`: Palavras-chave de Schema removidas (`request-helpers.ts:33-37`)
- `UNSUPPORTED_CONSTRAINTS`: Restrições movidas para description (`request-helpers.ts:24-28`)

**Funções Chave**:
- `cleanJSONSchemaForAntigravity(schema)`: Limpa JSON Schema incompatível
- `convertConstToEnum(schema)`: Converte `const` para `enum`
- `convertRefsToHints(schema)`: Converte `$ref` para description hints
- `flattenAnyOfOneOf(schema)`: Achata estruturas `anyOf`/`oneOf`

</details>
