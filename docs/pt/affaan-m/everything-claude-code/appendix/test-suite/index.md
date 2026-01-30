---
title: "Suíte de Testes: Execução e Personalização | everything-claude-code"
sidebarTitle: "Executar Todos os Testes"
subtitle: "Suíte de Testes: Execução e Personalização"
description: "Aprenda a executar a suíte de testes do everything-claude-code. Abrange 56 casos de teste, incluindo módulos utils, package-manager e hooks, explicando testes multiplataforma, uso do framework e etapas de personalização."
tags:
  - "testing"
  - "test-suite"
  - "qa"
prerequisite:
  - "start-installation"
order: 220
---

# Suíte de Testes: Execução e Personalização

Everything Claude Code inclui uma suíte de testes completa para validar a correção dos scripts e funções utilitárias. Este artigo apresenta como executar a suíte de testes, sua cobertura e como adicionar testes personalizados.

## O que é uma Suíte de Testes?

Uma **suíte de testes** é uma coleção de scripts de teste automatizados e casos de teste usados para validar a correção funcional do software. A suíte de testes do Everything Claude Code contém 56 casos de teste, cobrindo funções utilitárias multiplataforma, detecção de gerenciadores de pacotes e scripts de Hook, garantindo funcionamento correto em diferentes sistemas operacionais.

::: info Por que precisamos de uma suíte de testes?

A suíte de testes garante que, ao adicionar novas funcionalidades ou modificar código existente, não quebremos acidentalmente funcionalidades já existentes. Especialmente para scripts Node.js multiplataforma, os testes podem verificar a consistência de comportamento em diferentes sistemas operacionais.

:::

---

## Visão Geral da Suíte de Testes

A suíte de testes está localizada no diretório `tests/` e contém a seguinte estrutura:

```
tests/
├── lib/                          # Testes da biblioteca utilitária
│   ├── utils.test.js              # Testes de funções utilitárias multiplataforma (21 testes)
│   └── package-manager.test.js    # Testes de detecção de gerenciador de pacotes (21 testes)
├── hooks/                        # Testes de scripts Hook
│   └── hooks.test.js             # Testes de scripts Hook (14 testes)
└── run-all.js                    # Executor principal de testes
```

**Cobertura de Testes**:

| Módulo | Quantidade de Testes | Conteúdo Coberto |
| --- | --- | --- |
| `utils.js` | 21 | Detecção de plataforma, operações de diretório, operações de arquivo, data/hora, comandos do sistema |
| `package-manager.js` | 21 | Detecção de gerenciador de pacotes, geração de comandos, lógica de prioridade |
| Scripts Hook | 14 | Ciclo de vida da sessão, sugestões de compactação, avaliação de sessão, validação do hooks.json |
| **Total** | **56** | Validação funcional completa |

---

## Executando os Testes

### Executar Todos os Testes

No diretório raiz do plugin, execute:

```bash
node tests/run-all.js
```

**Você deve ver**:

```
╔════════════════════════════════════════════════════════╗
║           Everything Claude Code - Test Suite            ║
╚════════════════════════════════════════════════════════╝

━━━ Running lib/utils.test.js ━━━

=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ✓ getTempDir returns valid temp directory
  ✓ ensureDir creates directory

...

=== Test Results ===
Passed: 21
Failed: 0
Total:  21

╔════════════════════════════════════════════════════════╗
║                     Final Results                        ║
╠════════════════════════════════════════════════════════╣
║  Total Tests:   56                                      ║
║  Passed:       56  ✓                                   ║
║  Failed:        0                                       ║
╚════════════════════════════════════════════════════════╝
```

### Executar um Arquivo de Teste Individual

Se quiser testar apenas um módulo específico, você pode executar o arquivo de teste individualmente:

```bash
# Testar utils.js
node tests/lib/utils.test.js

# Testar package-manager.js
node tests/lib/package-manager.test.js

# Testar scripts Hook
node tests/hooks/hooks.test.js
```

**Você deve ver** (exemplo com utils.test.js):

```
=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ...

File Operations:
  ✓ readFile returns null for non-existent file
  ✓ writeFile and readFile work together
  ✓ appendFile adds content to file
  ✓ replaceInFile replaces text
  ✓ countInFile counts occurrences
  ✓ grepFile finds matching lines

System Functions:
  ✓ commandExists finds node
  ✓ commandExists returns false for fake command
  ✓ runCommand executes simple command
  ✓ runCommand handles failed command

=== Test Results ===
Passed: 21
Failed: 0
Total:  21
```

---

## Explicação do Framework de Testes

A suíte de testes usa um framework de testes leve e personalizado, sem dependências externas. Cada arquivo de teste contém os seguintes componentes:

### Funções Auxiliares de Teste

```javascript
// Função auxiliar de teste síncrono
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

// Função auxiliar de teste assíncrono
async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}
```

### Asserções de Teste

Usa o módulo `assert` integrado do Node.js para asserções:

```javascript
const assert = require('assert');

// Asserção de igualdade
assert.strictEqual(actual, expected, 'message');

// Asserção booleana
assert.ok(condition, 'message');

// Verificação de inclusão em array/objeto
assert.ok(array.includes(item), 'message');

// Correspondência de regex
assert.ok(regex.test(string), 'message');
```

---

## Detalhamento dos Módulos de Teste

### lib/utils.test.js

Testa as funções utilitárias multiplataforma de `scripts/lib/utils.js`.

**Categorias de Teste**:

| Categoria | Quantidade de Testes | Funcionalidades Cobertas |
| --- | --- | --- |
| Detecção de Plataforma | 2 | `isWindows`, `isMacOS`, `isLinux` |
| Funções de Diretório | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| Data/Hora | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| Operações de Arquivo | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| Funções do Sistema | 5 | `commandExists`, `runCommand` |

**Exemplo de Teste Chave**:

```javascript
// Testar operações de arquivo
test('writeFile and readFile work together', () => {
  const testFile = path.join(utils.getTempDir(), `utils-test-${Date.now()}.txt`);
  const testContent = 'Hello, World!';
  try {
    utils.writeFile(testFile, testContent);
    const read = utils.readFile(testFile);
    assert.strictEqual(read, testContent);
  } finally {
    fs.unlinkSync(testFile);
  }
});
```

### lib/package-manager.test.js

Testa a lógica de detecção e seleção de gerenciadores de pacotes de `scripts/lib/package-manager.js`.

**Categorias de Teste**:

| Categoria | Quantidade de Testes | Funcionalidades Cobertas |
| --- | --- | --- |
| Constantes de Gerenciadores de Pacotes | 2 | `PACKAGE_MANAGERS`, integridade de propriedades |
| Detecção de Lock File | 5 | Identificação de lock files npm, pnpm, yarn, bun |
| Detecção de package.json | 4 | Análise do campo `packageManager` |
| Gerenciadores de Pacotes Disponíveis | 1 | Detecção de gerenciadores de pacotes do sistema |
| Seleção de Gerenciador de Pacotes | 3 | Prioridade de variável de ambiente, lock file, configuração do projeto |
| Geração de Comandos | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**Exemplo de Teste Chave**:

```javascript
// Testar prioridade de detecção
test('respects environment variable', () => {
  const originalEnv = process.env.CLAUDE_PACKAGE_MANAGER;
  try {
    process.env.CLAUDE_PACKAGE_MANAGER = 'yarn';
    const result = pm.getPackageManager();
    assert.strictEqual(result.name, 'yarn');
    assert.strictEqual(result.source, 'environment');
  } finally {
    if (originalEnv !== undefined) {
      process.env.CLAUDE_PACKAGE_MANAGER = originalEnv;
    } else {
      delete process.env.CLAUDE_PACKAGE_MANAGER;
    }
  }
});
```

### hooks/hooks.test.js

Testa a execução e validação de configuração dos scripts Hook.

**Categorias de Teste**:

| Categoria | Quantidade de Testes | Funcionalidades Cobertas |
| --- | --- | --- |
| session-start.js | 2 | Execução bem-sucedida, formato de saída |
| session-end.js | 2 | Execução bem-sucedida, criação de arquivo |
| pre-compact.js | 3 | Execução bem-sucedida, formato de saída, criação de log |
| suggest-compact.js | 3 | Execução bem-sucedida, contador, acionamento de limite |
| evaluate-session.js | 3 | Pular sessão curta, processamento de sessão longa, contagem de mensagens |
| Validação do hooks.json | 4 | Validade do JSON, tipos de evento, prefixo node, variáveis de caminho |

**Exemplo de Teste Chave**:

```javascript
// Testar configuração do hooks.json
test('all hook commands use node', () => {
  const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
  const hooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));

  const checkHooks = (hookArray) => {
    for (const entry of hookArray) {
      for (const hook of entry.hooks) {
        if (hook.type === 'command') {
          assert.ok(
            hook.command.startsWith('node'),
            `Hook command should start with 'node': ${hook.command.substring(0, 50)}...`
          );
        }
      }
    }
  };

  for (const [eventType, hookArray] of Object.entries(hooks.hooks)) {
    checkHooks(hookArray);
  }
});
```

---

## Adicionando Novos Testes

### Criar Arquivo de Teste

1. Crie um novo arquivo de teste no diretório `tests/`
2. Use funções auxiliares de teste para encapsular os casos de teste
3. Use o módulo `assert` para asserções
4. Registre o novo arquivo de teste em `run-all.js`

**Exemplo**: Criar um novo arquivo de teste `tests/lib/new-module.test.js`

```javascript
/**
 * Tests for scripts/lib/new-module.js
 *
 * Run with: node tests/lib/new-module.test.js
 */

const assert = require('assert');
const newModule = require('../../scripts/lib/new-module');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing new-module.js ===\n');

  let passed = 0;
  let failed = 0;

  // Seus casos de teste
  if (test('basic functionality', () => {
    assert.strictEqual(newModule.test(), 'expected value');
  })) passed++; else failed++;

  // Resumo
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### Registrar em run-all.js

Adicione o novo arquivo de teste em `tests/run-all.js`:

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // Adicione esta linha
  'hooks/hooks.test.js'
];
```

---

## Melhores Práticas de Teste

### 1. Use try-finally para Limpar Recursos

Arquivos temporários e diretórios criados durante os testes devem ser limpos:

```javascript
✅ Correto:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // Lógica de teste
  } finally {
    fs.unlinkSync(testFile);  // Garante a limpeza
  }
});

❌ Incorreto:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // Se o teste falhar, o arquivo não será limpo
  fs.unlinkSync(testFile);
});
```

### 2. Isole o Ambiente de Teste

Cada teste deve usar nomes de arquivos temporários únicos para evitar interferência mútua:

```javascript
✅ Correto:
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ Incorreto:
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. Use Nomes de Teste Descritivos

Os nomes dos testes devem explicar claramente o que está sendo testado:

```javascript
✅ Correto:
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ Incorreto:
test('test1', () => { ... });
```

### 4. Teste Condições de Limite

Não teste apenas situações normais, mas também condições de limite e erro:

```javascript
// Testar situação normal
test('detects npm from package-lock.json', () => { ... });

// Testar diretório vazio
test('returns null when no lock file exists', () => { ... });

// Testar múltiplos lock files
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. Valide a Segurança de Entrada

Para funções que aceitam entrada, os testes devem validar a segurança:

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## Perguntas Frequentes

### O que fazer quando um teste falha?

1. Verifique a mensagem de erro específica
2. Verifique se a lógica do teste está correta
3. Verifique se a função testada tem um bug
4. Execute os testes em diferentes sistemas operacionais (compatibilidade multiplataforma)

### Por que há uma quebra de linha após a saída `Passed: X Failed: Y` do arquivo de teste?

Isso é para compatibilidade com a análise de resultados do `run-all.js`. Os arquivos de teste devem produzir um formato específico:

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### Posso usar outros frameworks de teste?

Sim, mas você precisará modificar `run-all.js` para suportar o formato de saída do novo framework. O framework leve personalizado atual é adequado para cenários de teste simples.

---

## Resumo da Lição

A suíte de testes é uma parte importante da garantia de qualidade do Everything Claude Code. Ao executar os testes, você pode garantir:

- ✅ Funções utilitárias multiplataforma funcionam corretamente em diferentes sistemas operacionais
- ✅ A lógica de detecção de gerenciadores de pacotes processa corretamente todas as prioridades
- ✅ Scripts Hook criam e atualizam arquivos corretamente
- ✅ Arquivos de configuração estão no formato correto e completos

**Características da Suíte de Testes**:
- Leve: Sem dependências externas
- Cobertura completa: 56 casos de teste
- Multiplataforma: Suporta Windows, macOS, Linux
- Fácil de estender: Adicionar novos testes requer apenas algumas linhas de código

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos o **[Guia de Contribuição](../contributing/)**.
>
> Você aprenderá:
> - Como contribuir com configurações, agents e skills para o projeto
> - Melhores práticas para contribuição de código
> - O processo de envio de Pull Requests

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Executor de testes | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| Testes de utils | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
| --- | --- | --- |
| Testes de hooks | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| Módulo utils | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| --- | --- | --- |

**Funções Chave**:

**run-all.js**:
- `execSync()`: Executa subprocesso e obtém saída (linha 8)
- Array de arquivos de teste: `testFiles` define todos os caminhos de arquivos de teste (linhas 13-17)
- Análise de resultados: Extrai contagens de `Passed` e `Failed` da saída (linhas 46-62)

**Funções auxiliares de teste**:
- `test()`: Wrapper de teste síncrono, captura exceções e produz resultados
- `asyncTest()`: Wrapper de teste assíncrono, suporta testes com Promise

**utils.js**:
- Detecção de plataforma: `isWindows`, `isMacOS`, `isLinux` (linhas 12-14)
- Funções de diretório: `getHomeDir()`, `getClaudeDir()`, `getSessionsDir()` (linhas 19-35)
- Operações de arquivo: `readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()` (linhas 200-343)
- Funções do sistema: `commandExists()`, `runCommand()` (linhas 228-269)

**package-manager.js**:
- `PACKAGE_MANAGERS`: Constantes de configuração de gerenciadores de pacotes (linhas 13-54)
- `DETECTION_PRIORITY`: Ordem de prioridade de detecção (linha 57)
- `getPackageManager()`: Seleciona gerenciador de pacotes com base na prioridade (linhas 157-236)
- `getRunCommand()`: Gera comando para executar scripts (linhas 279-294)
- `getExecCommand()`: Gera comando para executar pacotes (linhas 301-304)

</details>
