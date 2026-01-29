---
title: "Устранение проблем: Исправление сбоев | Agent Skills"
sidebarTitle: "Устранение проблем"
subtitle: "Устранение проблем: Исправление сбоев"
description: "Изучите методы диагностики и исправления сетевых ошибок, проблем активации навыков и ошибок проверки правил Agent Skills."
tags:
  - "FAQ"
  - "Устранение неполадок"
  - "Отладка"
  - "Конфигурация сети"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Устранение распространенных проблем

## Чему вы научитесь

- Быстро диагностировать и устранять сетевые ошибки при развертывании
- Исправлять проблемы неактивации навыков
- Обрабатывать ошибки проверки правил
- Определять причины неточного обнаружения фреймворков

## Проблемы развертывания

### Network Egress Error（сетевая ошибка）

**Проблема**: при развертывании в Vercel появляется сетевая ошибка, указывает невозможность доступа к внешней сети.

**Причина**: в окружении claude.ai по умолчанию ограничены права сетевого доступа. Навык `vercel-deploy-claimable` требует доступа к домену `*.vercel.com` для загрузки файлов.

**Решение**:

::: tip Настройка сетевых разрешений в claude.ai

1. Перейдите на [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. В "Allowed Domains" добавьте `*.vercel.com`
3. Сохраните настройки и повторно разверните

:::

**Метод проверки**:

```bash
# Тест сетевого соединения (без выполнения развертывания)
curl -I https://claude-skills-deploy.vercel.com/api/deploy
```

**Вы должны увидеть**:
```bash
HTTP/2 200
```

### Сбой развертывания: невозможно извлечь preview URL

**Проблема**: скрипт развертывания завершился, но указывает "Error: Could not extract preview URL from response".

**Причина**: API развертывания вернул ошибочный ответ (содержит поле `"error"`), но скрипт сначала проверяет сбой извлечения URL.

Согласно исходному коду [`deploy.sh:224-229`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L224-L229):

```bash
# Check for error in response
if echo "$RESPONSE" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Error: $ERROR_MSG" >&2
  exit 1
fi
```

**Решение**:

1. Посмотрите полный ответ ошибки:
```bash
# Выполните развертывание снова в корне проекта, обратите внимание на сообщения об ошибках
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh .
```

2. Распространенные типы ошибок:

| Сообщение об ошибке | Возможная причина | Решение |
|--- | --- | ---|
| "File too large" | Объем проекта превышает лимит | Исключите ненужные файлы (например, `*.log`, `*.test.ts`) |
| "Invalid framework" | Сбой распознавания фреймворка | Добавьте `package.json` или укажите фреймворк вручную |
| "Network timeout" | Тайм-аут сети | Проверьте сетевое подключение, повторите развертывание |

**Профилактические меры**:

Скрипт развертывания автоматически исключает `node_modules` и `.git` (см. исходный код [`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210)), но вы можете дополнительно оптимизировать:

```bash
# Измените deploy.sh, добавьте больше исключений
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='coverage' \
  --exclude='.next' \
  .
```

### Неточное распознавание фреймворка

**Проблема**: при развертывании распознанный фреймворк не соответствует фактическому, или возвращается `null`.

**Причина**: распознавание фреймворка зависит от списка зависимостей в `package.json`. Если зависимости отсутствуют или проект имеет особый тип, распознавание может не удаться.

Согласно исходному коду [`deploy.sh:12-156`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L12-L156), логика распознавания:

1. Чтение `package.json`
2. Проверка имен пакетов специфических зависимостей
3. Сопоставление в порядке приоритета (Blitz → Next.js → Gatsby → ...)

**Решение**:

| Сценарий | Метод решения |
|--- | ---|
| `package.json` существует но распознавание не удается | Проверьте, находятся ли зависимости в `dependencies` или `devDependencies` |
|--- | ---|
| Фреймворк не в списке поддерживаемых | Разверните напрямую (framework = null), Vercel автоматически определит |

**Ручная проверка распознавания фреймворка**:

```bash
# Имитация распознавания фреймворка (требуется bash)
grep -E '"(next|gatsby|vite|astro)"' package.json
```

## Проблемы активации навыков

### Навык не активируется

**Проблема**: вы используете соответствующие ключевые слова в Claude (например, "Deploy my app"), но навык не активируется.

**Причина**: активация навыка зависит от соответствия ключевых слов в подсказках. Если ключевые слова нечеткие или навык не загружен корректно, AI не может определить, какой навык следует использовать.

**Решение**:

::: warning Контрольный список

1. **Подтвердите, что навык установлен**:
    ```bash
    # Пользователи Claude Desktop
    ls ~/.claude/skills/ | grep agent-skills

    # Пользователи claude.ai
    Проверьте, что агент-skills добавлен в базу знаний проекта
    ```

2. **Используйте явные ключевые слова**:
    - ✅ Можно использовать: `Deploy my app to Vercel`
    - ✅ Можно использовать: `Review this React component for performance issues`
    - ✅ Можно использовать: `Check accessibility of my site`
    - ❌ Нельзя использовать: `帮我部署` (отсутствуют ключевые слова)

3. **Перезагрузите навык**:
    - Claude Desktop: выйдите и перезапустите
    - claude.ai: обновите страницу или повторно добавьте навык в проект

:::

**Проверка описания навыков**:

Каждый навык `SKILL.md` начинается с описания, объясняющего ключевые слова запуска. Например:

- `vercel-deploy`: ключевые слова включают "Deploy", "deploy", "production"
- `react-best-practices`: ключевые слова включают "React", "component", "performance"

### Web Design Guidelines не может извлечь правила

**Проблема**: при использовании навыка `web-design-guidelines` указывает невозможность извлечения правил из GitHub.

**Причина**: этот навык требует доступа к репозиторию GitHub для получения последних правил, но claude.ai по умолчанию ограничивает сетевой доступ.

**Решение**:

1. В [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities) добавьте:
    - `raw.githubusercontent.com`
    - `github.com`

2. Проверьте сетевой доступ:
```bash
# Проверьте, доступен ли источник правил
curl -I https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

**Запасной план**: если сеть ограничена, вручную загрузите файл правил и поместите локально, измените определение навыка на указание локального пути.

## Проблемы проверки правил

### VALIDATION_ERROR

**Проблема**: при выполнении `pnpm validate` выводится ошибка, указывающая на сбой проверки правил.

**Причина**: формат файла правил не соответствует спецификации, отсутствуют обязательные поля или примеры кода.

Согласно исходному коду [`validate.ts:21-66`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66), проверка правил включает:

1. **title не пустой**: правило должно иметь заголовок
2. **explanation не пустой**: правило должно иметь описание
3. **examples не пустые**: хотя бы один пример кода
4. **impact уровень легален**: должен быть `CRITICAL`/`HIGH`/`MEDIUM-HIGH`/`MEDIUM`/`LOW-MEDIUM`/`LOW`
5. **примеры кода полны**: хотя бы содержит пару "Incorrect/Correct"

**Решение**:

::: tip Примеры ошибок проверки и исправления

| Сообщение об ошибке | Причина | Исправление |
|--- | --- | ---|
| `Missing or empty title` | Frontmatter отсутствует поле `title` | В начало файла правила добавьте:<br>`---`<br>`title: "Заголовок правила"`<br>`---` |
| `Missing or empty explanation` | Отсутствует описание правила | В Frontmatter добавьте поле `explanation` |
| `Missing examples` | Нет примеров кода | Добавьте `**Incorrect:**` и `**Correct:**` блоки кода |
| `Invalid impact level` | Значение impact неверно | Проверьте Frontmatter `impact`, является ли оно допустимым перечислимым значением |
| `Missing bad/incorrect or good/correct examples` | Метки примеров не соответствуют | Убедитесь, что метки примеров содержат "Incorrect" или "Correct" |

:::

**Полный пример**:

```markdown
---
title: "Мое правило"
impact: "CRITICAL"
explanation: "Описание правила текст"
---

## Мое правило

**Incorrect:**
`\`\`typescript
// Неправильный пример
`\`\`

**Correct:**
`\`\`typescript
// Правильный пример
`\`\`
```

**Запуск проверки**:

```bash
cd packages/react-best-practices-build
pnpm validate
```

**Вы должны увидеть**:
```
Validating rule files...
Rules directory: ../../skills/react-best-practices/rules
✓ All 57 rules are valid
```

### Сбой парсинга файла правил

**Проблема**: при проверке указывается `Failed to parse: ...`, обычно из-за ошибки формата Markdown.

**Причина**: ошибка формата YAML frontmatter, неверный уровень заголовков или ошибка синтаксиса блока кода.

**Решение**:

1. **Проверьте frontmatter**:
   - Используйте три дефиса `---` для обертки
   - После дефисов должен быть пробел
   - Для строковых значений рекомендуется использовать двойные кавычки

2. **Проверьте уровни заголовков**:
   - Заголовок правила использует `##` (H2)
   - Метки примеров используют `**Incorrect:**` и `**Correct:``

3. **Проверьте блоки кода**:
   - Используйте три обратные кавычки ```` для обертки кода
   - Укажите тип языка (например, `typescript`)

**Распространенные ошибки**:

```markdown
# ❌ Ошибка: после frontmatter нет пробела
---
title:"my rule"
---

# ✅ Правильно
title: "my rule"
---

# ❌ Ошибка: у метки примера отсутствует двоеточие
**Incorrect**
````typescript
code
````

# ✅ Правильно: двоеточие обязательно
**Incorrect:**
````typescript
code
````

# ✅ Есть описание в скобках (рекомендуется)
**Incorrect (причина ошибки):**
````typescript
code
```
```

## Проблемы с правами доступа к файлам

### Не удается записать в ~/.claude/skills/

**Проблема**: при выполнении команды установки выводится ошибка прав доступа.

**Причина**: каталог `~/.claude/` не существует или текущий пользователь не имеет прав записи.

**Решение**:

```bash
# Создайте каталог вручную
mkdir -p ~/.claude/skills

# Скопируйте набор навыков
cp -r agent-skills/* ~/.claude/skills/

# Проверьте права
ls -la ~/.claude/skills/
```

**Вы должны увидеть**:
```
drwxr-xr-x  user group size date react-best-practices/
drwxr-xr-x  user group size date web-design-guidelines/
drwxr-xr-x  user group size date vercel-deploy-claimable/
```

### Проблемы с путями в Windows

**Проблема**: при выполнении скрипта развертывания в Windows неправильный формат пути.

**Причина**: Windows использует обратную косую черту `\` как разделитель путей, а Bash-скрипт ожидает прямую косую черту `/`.

**Решение**:

::: code-group

```bash [Git Bash / WSL]
# Преобразование формата пути
INPUT_PATH=$(pwd | sed 's/\\/\//g')
bash deploy.sh "$INPUT_PATH"
```

```powershell [PowerShell]
# Используйте PowerShell для преобразования пути
$INPUT_PATH = $PWD.Path -replace '\\', '/'
bash deploy.sh "$INPUT_PATH"
```

:::

**Лучшая практика**: в Windows используйте Git Bash или WSL для выполнения скрипта развертывания.

## Проблемы производительности

### Медленная скорость сборки

**Проблема**: при выполнении `pnpm build` скорость низкая, особенно при большом количестве правил.

**Причина**: инструмент сборки последовательно анализирует файлы правил (см. [`build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)), не использует параллельную обработку.

**Решение**:

1. **Пропускайте ненужные шаги**:
```bash
# Только сборка, без проверки
pnpm build

# Только проверка, без сборки
pnpm validate
```

2. **Очистите кэш**:
```bash
rm -rf node_modules/.cache
pnpm build
```

3. **Аппаратная оптимизация**:
   - Используйте SSD для хранения
   - Убедитесь, что версия Node.js >= 20

### Медленная загрузка при развертывании

**Проблема**: медленная загрузка tarball на Vercel.

**Причина**: большой размер проекта или недостаточная полоса пропускания сети.

**Решение**:

1. **Уменьшите размер проекта**:
```bash
# Проверьте размер tarball
ls -lh .tgz

# Если превышает 50MB, рассмотрите оптимизацию
```

2. **Оптимизируйте правила исключения**:

Измените [`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210), добавьте элементы исключения:

```bash
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.vscode' \
  --exclude='dist' \
  --exclude='build' \
  .
```

## Итоги урока

Распространенные проблемы Agent Skills в основном сосредоточены на:

1. **Сетевые права**: в claude.ai необходимо настроить разрешение на доступ к доменам
2. **Активация навыков**: используйте явные ключевые слова для запуска навыков
3. **Проверка правил**: следуйте шаблону `_template.md`, чтобы обеспечить правильность формата
4. **Обнаружение фреймворков**: убедитесь, что `package.json` содержит правильные зависимости

При возникновении проблем сначала просмотрите сообщения об ошибках и логику обработки ошибок в исходном коде (например, `validate.ts` и `deploy.sh`).

## Получение помощи

Если вышеперечисленные методы не могут решить проблему:

1. **Просмотр исходного кода**:
   - Скрипт развертывания: [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)
   - Скрипт проверки: [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
   - Определение навыков: [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md)

2. **GitHub Issues**: отправьте проблему в [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/issues)

3. **Обсуждение в сообществе**: ищите помощи на технических форумах (например, Twitter, Discord)

## Следующий урок

> В следующем уроке мы изучим **[Использование лучших практик](../best-practices/)**.
>
> Вы узнаете:
> - Выбор эффективных ключевых слов для запуска навыков
> - Техники управления контекстом
> - Сценарии сотрудничества с несколькими навыками
> - Рекомендации по оптимизации производительности

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходного кода</strong></summary>

> Обновлено: 2026-01-25

| Функция        | Путь к файлу                                                                                      | Строки   |
|--- | --- | ---|
| Обработка сетевых ошибок | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L100-L113) | 100-113   |
| Логика проверки правил | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66     |
| Логика распознавания фреймворка | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156    |
| Обработка ошибок развертывания | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 224-239   |
| Обработка статического HTML | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205    |

**Ключевые константы**:
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"`: конечная точка API развертывания

**Ключевые функции**:
- `detect_framework()`: определяет тип фреймворка из package.json
- `validateRule()`: проверяет полноту формата файла правил
- `cleanup()`: очищает временные файлы

**Коды ошибок**:
- `VALIDATION_ERROR`: сбой проверки правил
- `INPUT_INVALID`: недопустимый ввод развертывания (не каталог или .tgz)
- `API_ERROR`: API развертывания вернул ошибку

</details>
