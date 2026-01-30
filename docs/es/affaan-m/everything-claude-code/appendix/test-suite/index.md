---
title: "Suite de pruebas: ejecución y personalización | everything-claude-code"
sidebarTitle: "Ejecutar todas las pruebas"
subtitle: "Suite de pruebas: ejecución y personalización"
description: "Aprende a ejecutar la suite de pruebas de everything-claude-code. Cubre 56 casos de prueba, incluyendo módulos utils, package-manager y hooks, explicando pruebas multiplataforma, uso de framework y pasos de prueba personalizados."
tags:
  - "testing"
  - "test-suite"
  - "qa"
prerequisite:
  - "start-installation"
order: 220
---

# Suite de pruebas: ejecución y personalización

Everything Claude Code incluye una suite de pruebas completa para verificar la corrección de los scripts y funciones de utilidad. Este documento presenta los métodos para ejecutar la suite de pruebas, su alcance y cómo agregar pruebas personalizadas.

## ¿Qué es una suite de pruebas?

Una **suite de pruebas** es una colección de scripts de prueba automatizados y casos de prueba utilizados para verificar la funcionalidad correcta del software. La suite de pruebas de Everything Claude Code contiene 56 casos de prueba que cubren funciones de utilidad multiplataforma, detección de gestores de paquetes y scripts de Hook, asegurando que funcionen correctamente en diferentes sistemas operativos.

::: info ¿Por qué se necesita una suite de pruebas?

La suite de pruebas garantiza que al agregar nuevas funcionalidades o modificar código existente, no se rompan accidentalmente las funcionalidades existentes. Especialmente para scripts de Node.js multiplataforma, las pruebas pueden verificar la consistencia del comportamiento en diferentes sistemas operativos.

:::

---

## Visión general de la suite de pruebas

La suite de pruebas se encuentra en el directorio `tests/` e incluye la siguiente estructura:

```
tests/
├── lib/                          # Pruebas de bibliotecas de utilidad
│   ├── utils.test.js              # Pruebas de funciones de utilidad multiplataforma (21 pruebas)
│   └── package-manager.test.js    # Pruebas de detección de gestores de paquetes (21 pruebas)
├── hooks/                        # Pruebas de scripts Hook
│   └── hooks.test.js             # Pruebas de scripts Hook (14 pruebas)
└── run-all.js                    # Ejecutor principal de pruebas
```

**Alcance de las pruebas**:

| Módulo | Número de pruebas | Contenido cubierto |
|--- | --- | ---|
| `utils.js` | 21 | Detección de plataforma, operaciones de directorio, operaciones de archivo, fecha/hora, comandos del sistema |
| `package-manager.js` | 21 | Detección de gestores de paquetes, generación de comandos, lógica de prioridad |
| Scripts Hook | 14 | Ciclo de vida de session, sugerencia de compactación, evaluación de sesión, validación de hooks.json |
| **Total** | **56** | Verificación completa de funcionalidades |

---

## Ejecutar pruebas

### Ejecutar todas las pruebas

En el directorio raíz del complemento, ejecuta:

```bash
node tests/run-all.js
```

**Deberías ver**:

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

### Ejecutar un solo archivo de prueba

Si solo deseas probar un módulo específico, puedes ejecutar el archivo de prueba individualmente:

```bash
# Probar utils.js
node tests/lib/utils.test.js

# Probar package-manager.js
node tests/lib/package-manager.test.js

# Probar scripts Hook
node tests/hooks/hooks.test.js
```

**Deberías ver** (tomando utils.test.js como ejemplo):

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

## Explicación del framework de pruebas

La suite de pruebas utiliza un framework de pruebas ligero personalizado sin dependencias externas. Cada archivo de prueba contiene los siguientes componentes:

### Funciones auxiliares de prueba

```javascript
// Función auxiliar de prueba síncrona
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

// Función auxiliar de prueba asíncrona
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

### Aserciones de prueba

Utiliza el módulo incorporado `assert` de Node.js para las aserciones:

```javascript
const assert = require('assert');

// Aserción de igualdad
assert.strictEqual(actual, expected, 'message');

// Aserción booleana
assert.ok(condition, 'message');

// Inclusión de array/objeto
assert.ok(array.includes(item), 'message');

// Coincidencia de expresión regular
assert.ok(regex.test(string), 'message');
```

---

## Explicación detallada de los módulos de prueba

### lib/utils.test.js

Prueba las funciones de utilidad multiplataforma de `scripts/lib/utils.js`.

**Categorías de pruebas**:

| Categoría | Número de pruebas | Funcionalidades cubiertas |
|--- | --- | ---|
| Detección de plataforma | 2 | `isWindows`, `isMacOS`, `isLinux` |
| Funciones de directorio | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| Fecha/hora | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| Operaciones de archivo | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| Funciones del sistema | 5 | `commandExists`, `runCommand` |

**Ejemplo de prueba clave**:

```javascript
// Probar operaciones de archivo
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

Prueba la lógica de detección y selección de gestores de paquetes de `scripts/lib/package-manager.js`.

**Categorías de pruebas**:

| Categoría | Número de pruebas | Funcionalidades cubiertas |
|--- | --- | ---|
| Constantes de gestores de paquetes | 2 | `PACKAGE_MANAGERS`, integridad de propiedades |
| Detección de archivos lock | 5 | Reconocimiento de archivos lock de npm, pnpm, yarn, bun |
| Detección de package.json | 4 | Análisis del campo `packageManager` |
| Gestores de paquetes disponibles | 1 | Detección de gestores de paquetes del sistema |
| Selección de gestor de paquetes | 3 | Prioridad de variable de entorno, archivo lock, configuración del proyecto |
| Generación de comandos | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**Ejemplo de prueba clave**:

```javascript
// Probar prioridad de detección
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

Prueba la ejecución y validación de configuración de los scripts Hook.

**Categorías de pruebas**:

| Categoría | Número de pruebas | Funcionalidades cubiertas |
|--- | --- | ---|
| session-start.js | 2 | Ejecución exitosa, formato de salida |
| session-end.js | 2 | Ejecución exitosa, creación de archivos |
| pre-compact.js | 3 | Ejecución exitosa, formato de salida, creación de registro |
| suggest-compact.js | 3 | Ejecución exitosa, contador, activación de umbral |
| evaluate-session.js | 3 | Omisión de sesión corta, manejo de sesión larga, conteo de mensajes |
| Validación de hooks.json | 4 | Validez JSON, tipos de eventos, prefijo de nodo, variables de ruta |

**Ejemplo de prueba clave**:

```javascript
// Probar configuración de hooks.json
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

## Agregar nuevas pruebas

### Crear archivo de prueba

1. Crea un nuevo archivo de prueba en el directorio `tests/`
2. Utiliza funciones auxiliares de prueba para envolver casos de prueba
3. Utiliza el módulo `assert` para aserciones
4. Registra el nuevo archivo de prueba en `run-all.js`

**Ejemplo**: Crear un nuevo archivo de prueba `tests/lib/new-module.test.js`

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

  // Tus casos de prueba
  if (test('basic functionality', () => {
    assert.strictEqual(newModule.test(), 'expected value');
  })) passed++; else failed++;

  // Resumen
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### Registrar en run-all.js

Agrega el nuevo archivo de prueba en `tests/run-all.js`:

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // Agrega esta línea
  'hooks/hooks.test.js'
];
```

---

## Mejores prácticas de pruebas

### 1. Usar try-finally para limpiar recursos

Los archivos y directorios temporales creados en las pruebas deben limpiarse:

```javascript
✅ Correcto:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // Lógica de prueba
  } finally {
    fs.unlinkSync(testFile);  // Garantizar limpieza
  }
});

❌ Incorrecto:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // Si la prueba falla, el archivo no se limpiará
  fs.unlinkSync(testFile);
});
```

### 2. Aislar el entorno de prueba

Cada prueba debe usar un nombre de archivo temporal único para evitar interferencias:

```javascript
✅ Correcto:
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ Incorrecto:
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. Usar nombres de prueba descriptivos

Los nombres de prueba deben explicar claramente lo que prueba:

```javascript
✅ Correcto:
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ Incorrecto:
test('test1', () => { ... });
```

### 4. Probar condiciones límite

No solo probar casos normales, sino también casos límite y de error:

```javascript
// Probar caso normal
test('detects npm from package-lock.json', () => { ... });

// Probar directorio vacío
test('returns null when no lock file exists', () => { ... });

// Probar múltiples archivos lock
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. Validar la seguridad de entrada

Para funciones que aceptan entrada, las pruebas deben validar la seguridad:

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## Preguntas frecuentes

### ¿Qué hacer si una prueba falla?

1. Verifica el mensaje de error específico
2. Comprueba si la lógica de prueba es correcta
3. Verifica si la función probada tiene algún bug
4. Ejecuta las pruebas en diferentes sistemas operativos (compatibilidad multiplataforma)

### ¿Por qué el archivo de prueba tiene un salto de línea después de `Passed: X Failed: Y`?

Esto es para compatibilidad con el análisis de resultados de `run-all.js`. Los archivos de prueba deben generar un formato específico:

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### ¿Se pueden usar otros frameworks de pruebas?

Sí, pero necesitas modificar `run-all.js` para admitir el formato de salida del nuevo framework. Actualmente se usa un framework ligero personalizado, adecuado para escenarios de prueba simples.

---

## Resumen de esta lección

La suite de pruebas es una parte importante de la garantía de calidad de Everything Claude Code. Al ejecutar las pruebas, puedes asegurar:

- ✅ Las funciones de utilidad multiplataforma funcionan correctamente en diferentes sistemas operativos
- ✅ La lógica de detección de gestores de paquetes maneja correctamente todas las prioridades
- ✅ Los scripts Hook crean y actualizan archivos correctamente
- ✅ Los archivos de configuración tienen el formato correcto y están completos

**Características de la suite de pruebas**:
- Ligera: Sin dependencias externas
- Cobertura completa: 56 casos de prueba
- Multiplataforma: Compatible con Windows, macOS, Linux
- Fácil de extender: Agregar nuevas pruebas requiere solo unas pocas líneas de código

---

## Próxima lección

> En la siguiente lección aprenderemos **[Guía de contribución](../contributing/)**.
>
> Aprenderás:
> - Cómo contribuir configuraciones, agentes y habilidades al proyecto
> - Mejores prácticas para contribuciones de código
> - El proceso para enviar Pull Requests

---

## Apéndice: referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Función | Ruta de archivo | Número de línea |
|--- | --- | ---|
| Ejecutor de pruebas | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| Pruebas de utils | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
|--- | --- | ---|
| Pruebas de hooks | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| Módulo utils | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
|--- | --- | ---|

**Funciones clave**:

**run-all.js**:
- `execSync()`: Ejecuta subprocesos y obtiene la salida (línea 8)
- Array de archivos de prueba: `testFiles` define todas las rutas de archivos de prueba (líneas 13-17)
- Análisis de resultados: Extrae los conteos `Passed` y `Failed` de la salida (líneas 46-62)

**Funciones auxiliares de prueba**:
- `test()`: Contenedor de prueba síncrona, captura excepciones y genera resultados
- `asyncTest()`: Contenedor de prueba asíncrona, admite pruebas de Promise

**utils.js**:
- Detección de plataforma: `isWindows`, `isMacOS`, `isLinux` (líneas 12-14)
- Funciones de directorio: `getHomeDir()`, `getClaudeDir()`, `getSessionsDir()` (líneas 19-35)
- Operaciones de archivo: `readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()` (líneas 200-343)
- Funciones del sistema: `commandExists()`, `runCommand()` (líneas 228-269)

**package-manager.js**:
- `PACKAGE_MANAGERS`: Constantes de configuración de gestores de paquetes (líneas 13-54)
- `DETECTION_PRIORITY`: Orden de prioridad de detección (línea 57)
- `getPackageManager()`: Selecciona gestor de paquetes según prioridad (líneas 157-236)
- `getRunCommand()`: Genera comando para ejecutar scripts (líneas 279-294)
- `getExecCommand()`: Genera comando para ejecutar paquetes (líneas 301-304)

</details>
