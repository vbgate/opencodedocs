---
title: "Тестовый набор: Запуск и настройка | everything-claude-code"
sidebarTitle: "Запуск всех тестов"
subtitle: "Тестовый набор: Запуск и настройка"
description: "Изучите методы запуска тестового набора everything-claude-code. Включает 56 тестовых случаев, охватывающих модули utils, package-manager и hooks, объясняет кроссплатформенное тестирование, использование фреймворка и настройку тестов."
tags:
  - "testing"
  - "test-suite"
  - "qa"
prerequisite:
  - "/ru/affaan-m/everything-claude-code/start/installation"
order: 220
---

# Тестовый набор: Запуск и настройка

Everything Claude Code включает полный тестовый набор для проверки правильности скриптов и служебных функций. В этой статье рассматриваются методы запуска тестового набора, его охват и способ добавления пользовательских тестов.

## Что такое тестовый набор?

**Тестовый набор** — это коллекция автоматизированных тестовых скриптов и тестовых случаев, предназначенная для проверки правильности работы программного обеспечения. Тестовый набор Everything Claude Code содержит 56 тестовых случаев, охватывающих кроссплатформенные служебные функции, определение пакетных менеджеров и Hook-скрипты, обеспечивая корректную работу на различных операционных системах.

::: info Зачем нужен тестовый набор?

Тестовый набор гарантирует, что при добавлении новых функций или изменении существующего кода не будут случайно нарушены уже имеющиеся функции. Особенно для кроссплатформенных Node.js скриптов тесты могут проверить согласованность поведения на различных операционных системах.

:::

---

## Обзор тестового набора

Тестовый набор находится в каталоге `tests/` и включает следующую структуру:

```
tests/
├── lib/                          # Тесты служебных библиотек
│   ├── utils.test.js              # Тесты кроссплатформенных функций (21 тест)
│   └── package-manager.test.js    # Тесты определения пакетных менеджеров (21 тест)
├── hooks/                        # Тесты Hook-скриптов
│   └── hooks.test.js             # Тесты Hook-скриптов (14 тестов)
└── run-all.js                    # Главный запускающий тест
```

**Охват тестирования**:

| Модуль | Количество тестов | Охват |
|--- | --- | ---|
| `utils.js` | 21 | Определение платформы, операции с каталогами, файловые операции, дата и время, системные команды |
| `package-manager.js` | 21 | Определение пакетных менеджеров, генерация команд, логика приоритетов |
| Hook-скрипты | 14 | Жизненный цикл сессии, предложения по сжатию, оценка сессии, проверка hooks.json |
| **Всего** | **56** | Полная проверка функциональности |

---

## Запуск тестов

### Запуск всех тестов

Выполните в корневом каталоге плагина:

```bash
node tests/run-all.js
```

**Вы должны увидеть**:

```
═════════════════════════════════════════════════════════
           Everything Claude Code - Test Suite            
═════════════════════════════════════════════════════════

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

═════════════════════════════════════════════════════════
                     Final Results                        
╠════════════════════════════════════════════════════════╣
║  Total Tests:   56                                      ║
║  Passed:       56  ✓                                   ║
║  Failed:        0                                       ║
═════════════════════════════════════════════════════════
```

### Запуск отдельного тестового файла

Если вы хотите протестировать только определённый модуль, можно запустить тестовый файл отдельно:

```bash
# Тестирование utils.js
node tests/lib/utils.test.js

# Тестирование package-manager.js
node tests/lib/package-manager.test.js

# Тестирование Hook-скриптов
node tests/hooks/hooks.test.js
```

**Вы должны увидеть** (на примере utils.test.js):

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

## Описание тестового фреймворка

Тестовый набор использует собственный лёгковесный тестовый фреймворк без внешних зависимостей. Каждый тестовый файл включает следующие компоненты:

### Вспомогательные тестовые функции

```javascript
// Вспомогательная функция для синхронных тестов
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

// Вспомогательная функция для асинхронных тестов
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

### Тестовые утверждения

Используйте встроенный модуль Node.js `assert` для утверждений:

```javascript
const assert = require('assert');

// Утверждение равенства
assert.strictEqual(actual, expected, 'message');

// Логическое утверждение
assert.ok(condition, 'message');

// Включение в массив/объект
assert.ok(array.includes(item), 'message');

// Регулярное выражение
assert.ok(regex.test(string), 'message');
```

---

## Детальное описание тестовых модулей

### lib/utils.test.js

Тестирование кроссплатформенных служебных функций `scripts/lib/utils.js`.

**Категории тестов**:

| Категория | Количество тестов | Охватываемые функции |
|--- | --- | ---|
| Определение платформы | 2 | `isWindows`, `isMacOS`, `isLinux` |
| Функции каталогов | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| Дата/время | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| Файловые операции | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| Системные функции | 5 | `commandExists`, `runCommand` |

**Пример ключевого теста**:

```javascript
// Тестирование файловых операций
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

Тестирование логики определения и выбора пакетных менеджеров `scripts/lib/package-manager.js`.

**Категории тестов**:

| Категория | Количество тестов | Охватываемые функции |
|--- | --- | ---|
| Константы пакетных менеджеров | 2 | `PACKAGE_MANAGERS`, целостность свойств |
| Определение lock-файлов | 5 | Распознавание lock-файлов npm, pnpm, yarn, bun |
| Определение package.json | 4 | Анализ поля `packageManager` |
| Доступные пакетные менеджеры | 1 | Определение системных пакетных менеджеров |
| Выбор пакетного менеджера | 3 | Приоритеты переменных окружения, lock-файлов, конфигурации проекта |
| Генерация команд | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**Пример ключевого теста**:

```javascript
// Тестирование приоритета определения
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

Тестирование выполнения Hook-скриптов и проверки конфигурации.

**Категории тестов**:

| Категория | Количество тестов | Охватываемые функции |
|--- | --- | ---|
| session-start.js | 2 | Успешное выполнение, формат вывода |
| session-end.js | 2 | Успешное выполнение, создание файла |
| pre-compact.js | 3 | Успешное выполнение, формат вывода, создание журнала |
| suggest-compact.js | 3 | Успешное выполнение, счётчик, срабатывание порога |
| evaluate-session.js | 3 | Пропуск коротких сессий, обработка длинных сессий, подсчёт сообщений |
| Проверка hooks.json | 4 | Валидность JSON, типы событий, префикс node, переменные путей |

**Пример ключевого теста**:

```javascript
// Тестирование конфигурации hooks.json
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

## Добавление новых тестов

### Создание тестового файла

1. Создайте новый тестовый файл в каталоге `tests/`
2. Оберните тестовые случаи во вспомогательные тестовые функции
3. Используйте модуль `assert` для утверждений
4. Зарегистрируйте новый тестовый файл в `run-all.js`

**Пример**: Создание нового тестового файла `tests/lib/new-module.test.js`

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

  // Ваши тестовые случаи
  if (test('basic functionality', () => {
    assert.strictEqual(newModule.test(), 'expected value');
  })) passed++; else failed++;

  // Summary
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### Регистрация в run-all.js

Добавьте новый тестовый файл в `tests/run-all.js`:

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // Добавьте эту строку
  'hooks/hooks.test.js'
];
```

---

## Лучшие практики тестирования

### 1. Используйте try-finally для очистки ресурсов

Временные файлы и каталоги, созданные в тестах, должны быть очищены:

```javascript
✅ Правильно:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // Логика теста
  } finally {
    fs.unlinkSync(testFile);  // Гарантируем очистку
  }
});

❌ Неправильно:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // Если тест не пройдёт, файл не будет очищен
  fs.unlinkSync(testFile);
});
```

### 2. Изолируйте тестовую среду

Каждый тест должен использовать уникальное имя временного файла, чтобы избежать взаимных помех:

```javascript
✅ Правильно:
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ Неправильно:
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. Используйте описательные имена тестов

Имена тестов должны чётко указывать, что именно проверяется:

```javascript
✅ Правильно:
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ Неправильно:
test('test1', () => { ... });
```

### 4. Тестируйте граничные условия

Не тестируйте только нормальные ситуации, но и граничные и ошибочные сценарии:

```javascript
// Тестирование нормального случая
test('detects npm from package-lock.json', () => { ... });

// Тестирование пустого каталога
test('returns null when no lock file exists', () => { ... });

// Тестирование нескольких lock-файлов
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. Проверяйте безопасность входных данных

Для функций, принимающих ввод, тесты должны проверять безопасность:

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## Часто задаваемые вопросы

### Что делать, если тесты не проходят?

1. Посмотрите конкретное сообщение об ошибке
2. Проверьте, правильно ли работает логика теста
3. Проверьте, нет ли ошибки в тестируемой функции
4. Запустите тесты на разных операционных системах (кроссплатформенная совместимость)

### Почему после вывода `Passed: X Failed: Y` в тестовом файле есть перевод строки?

Это сделано для совместимости с разбором результатов в `run-all.js`. Тестовые файлы должны выводить определённый формат:

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### Можно использовать другие тестовые фреймворки?

Можно, но нужно изменить `run-all.js` для поддержки формата вывода нового фреймворка. В настоящее время используется собственный лёгковесный фреймворк, подходящий для простых тестовых сценариев.

---

## Итоги урока

Тестовый набор является важной частью гарантии качества Everything Claude Code. Запуск тестов гарантирует:

- ✅ Кроссплатформенные служебные функции работают корректно на различных операционных системах
- ✅ Логика определения пакетных менеджеров корректно обрабатывает все приоритеты
- ✅ Hook-скрипты правильно создают и обновляют файлы
- ✅ Файлы конфигурации имеют правильный и полный формат

**Особенности тестового набора**:
- Лёгковесный: без внешних зависимостей
- Полный охват: 56 тестовых случаев
- Кроссплатформенность: поддержка Windows, macOS, Linux
- Лёгкое расширение: добавление новых тестов требует всего несколько строк кода

---

## Предпросмотр следующего урока

> Следующий урок посвящён **[Руководству по вкладам](../contributing/)**.
>
> Вы узнаете:
> - Как внести в проект конфигурации, agente и skills
> - Лучшие практики вклада в код
> - Процесс отправки Pull Request

---

## Приложение: Справочник исходного кода

<details>
<summary><strong>Нажмите, чтобы показать расположение исходного кода</strong></summary>

> Время обновления: 2026-01-25

| Функция | Путь к файлу | Номер строки |
|--- | --- | ---|
| Запускающий тест | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| Тесты utils | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
|--- | --- | ---|
| Тесты hooks | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| Модуль utils | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
|--- | --- | ---|

**Ключевые функции**:

**run-all.js**:
- `execSync()`: выполняет дочерний процесс и получает вывод (строка 8)
- Массив тестовых файлов: `testFiles` определяет все пути к тестовым файлам (строки 13-17)
- Разбор результатов: извлечение количества `Passed` и `Failed` из вывода (строки 46-62)

**Вспомогательные тестовые функции**:
- `test()`: обёртка для синхронных тестов, перехватывает исключения и выводит результаты
- `asyncTest()`: обёртка для асинхронных тестов, поддерживает Promise тесты

**utils.js**:
- Определение платформы: `isWindows`, `isMacOS`, `isLinux` (строки 12-14)
- Функции каталогов: `getHomeDir()`, `getClaudeDir()`, `getSessionsDir()` (строки 19-35)
- Файловые операции: `readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()` (строки 200-343)
- Системные функции: `commandExists()`, `runCommand()` (строки 228-269)

**package-manager.js**:
- `PACKAGE_MANAGERS`: константы конфигурации пакетных менеджеров (строки 13-54)
- `DETECTION_PRIORITY`: порядок приоритета определения (строка 57)
- `getPackageManager()`: выбор пакетного менеджера по приоритету (строки 157-236)
- `getRunCommand()`: генерация команды запуска скрипта (строки 279-294)
- `getExecCommand()`: генерация команды выполнения пакета (строки 301-304)

</details>
