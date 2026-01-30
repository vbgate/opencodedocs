---
title: "Модели данных: Полное определение основных типов | Plannotator"
subtitle: "Модели данных: Полное определение основных типов | Plannotator"
sidebarTitle: "Освоение основных моделей данных"
description: "Изучите модели данных Plannotator, освойте полные определения и описания полей основных типов, таких как Annotation, Block, CodeAnnotation, и глубоко поймите архитектуру системы."
tags:
  - "Модели данных"
  - "Определения типов"
  - "Справочник API"
prerequisite: []
order: 2
---

# Модели данных Plannotator

Это приложение описывает все модели данных, используемые в Plannotator, включая основные структуры данных для проверки планов, проверки кода, совместного использования URL и других функций.

## Обзор основных моделей данных

Plannotator использует TypeScript для определения следующих основных моделей данных:

| Модель | Назначение | Расположение определения |
| --- | --- | --- |
| `Annotation` | Аннотации в проверке планов | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Блоки контента после парсинга Markdown | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | Аннотации в проверке кода | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | Компактный формат аннотаций для совместного использования URL | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation (Аннотация плана)

`Annotation` представляет аннотацию в проверке плана, используемую для пометки удаления, вставки, замены или комментирования плана.

### Полное определение

```typescript
export interface Annotation {
  id: string;              // Уникальный идентификатор
  blockId: string;         // Связанный Block ID (устарело, сохранено для совместимости)
  startOffset: number;     // Начальное смещение (устарело, сохранено для совместимости)
  endOffset: number;       // Конечное смещение (устарело, сохранено для совместимости)
  type: AnnotationType;     // Тип аннотации
  text?: string;           // Содержимое комментария (для INSERTION/REPLACEMENT/COMMENT)
  originalText: string;    // Исходный текст, к которому применена аннотация
  createdA: number;        // Временная метка создания
  author?: string;         // Идентификатор соавтора (для совместного использования URL)
  imagePaths?: string[];    // Пути к прикрепленным изображениям
  startMeta?: {            // Метаданные начала выделения для web-highlighter
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // Метаданные конца выделения для web-highlighter
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### Перечисление AnnotationType

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // Удалить этот контент
  INSERTION = 'INSERTION',         // Вставить этот контент
  REPLACEMENT = 'REPLACEMENT',     // Заменить этот контент
  COMMENT = 'COMMENT',             // Прокомментировать этот контент
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // Глобальный комментарий (не связан с конкретным текстом)
}
```

### Описание полей

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `id` | string | ✅ | Уникальный идентификатор, обычно автоматически генерируемый UUID |
| `blockId` | string | ✅ | Связанный `Block` ID (устарело, сохранено для совместимости) |
| `startOffset` | number | ✅ | Начальное смещение символа (устарело, сохранено для совместимости) |
| `endOffset` | number | ✅ | Конечное смещение символа (устарело, сохранено для совместимости) |
| `type` | AnnotationType | ✅ | Тип аннотации (DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT) |
| `text` | string | ❌ | Содержимое комментария (заполняется для INSERTION/REPLACEMENT/COMMENT) |
| `originalText` | string | ✅ | Исходный текст, к которому применена аннотация |
| `createdA` | number | ✅ | Временная метка создания (миллисекунды) |
| `author` | string | ❌ | Идентификатор соавтора (для различения авторов при совместном использовании URL) |
| `imagePaths` | string[] | ❌ | Массив путей к прикрепленным изображениям |
| `startMeta` | object | ❌ | Метаданные начала выделения для web-highlighter |
| `endMeta` | object | ❌ | Метаданные конца выделения для web-highlighter |

### Примеры

#### Аннотация удаления

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "这一部分不需要",
  createdA: Date.now(),
}
```

#### Аннотация замены

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "新的内容",
  originalText: "原来的内容",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### Глобальный комментарий

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "整体来说计划很清晰",
  originalText: "",
  createdA: Date.now(),
}
```

::: info Пояснение устаревших полей
Поля `blockId`, `startOffset`, `endOffset` использовались в старых версиях для подсветки текста на основе смещения символов. Текущая версия использует библиотеку [web-highlighter](https://github.com/alvarotrigo/web-highlighter), реализуя выделение через элементы с помощью `startMeta` и `endMeta`. Эти поля сохранены только для совместимости.
:::

## Block (Блок плана)

`Block` представляет блок контента после парсинга текста Markdown, используемый для структурированного отображения содержимого плана.

### Полное определение

```typescript
export interface Block {
  id: string;              // Уникальный идентификатор
  type: BlockType;         // Тип блока
  content: string;        // Содержимое в виде простого текста
  level?: number;         // Уровень (для заголовков или списков)
  language?: string;      // Язык кода (для блоков кода)
  checked?: boolean;      // Состояние флажка (для элементов списка)
  order: number;          // Порядок сортировки
  startLine: number;      // Номер начальной строки (начиная с 1)
}
```

### Тип BlockType

```typescript
type BlockType =
  | 'paragraph'     // Абзац
  | 'heading'       // Заголовок
  | 'blockquote'    // Блок цитаты
  | 'list-item'     // Элемент списка
  | 'code'          // Блок кода
  | 'hr'            // Горизонтальная линия
  | 'table';        // Таблица
```

### Описание полей

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `id` | string | ✅ | Уникальный идентификатор в формате `block-{число}` |
| `type` | BlockType | ✅ | Тип блока (paragraph/heading/blockquote/list-item/code/hr/table) |
| `content` | string | ✅ | Содержимое блока в виде простого текста |
| `level` | number | ❌ | Уровень: 1-6 для заголовков, уровень отступа для элементов списка |
| `language` | string | ❌ | Язык блока кода (например, 'typescript', 'rust') |
| `checked` | boolean | ❌ | Состояние флажка элемента списка (true = отмечен, false = не отмечен) |
| `order` | number | ✅ | Порядковый номер для сохранения последовательности блоков |
| `startLine` | number | ✅ | Номер начальной строки в исходном Markdown (начиная с 1) |

### Примеры

#### Блок заголовка

```typescript
{
  id: "block-0",
  type: "heading",
  content: "Implementation Plan",
  level: 1,
  order: 1,
  startLine: 1,
}
```

#### Блок абзаца

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "This is a paragraph with some text.",
  order: 2,
  startLine: 3,
}
```

#### Блок кода

```typescript
{
  id: "block-2",
  type: "code",
  content: "function hello() {\n  return 'world';\n}",
  language: "typescript",
  order: 3,
  startLine: 5,
}
```

#### Элемент списка (с флажком)

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "完成认证模块",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Парсинг Markdown
Plannotator использует упрощенный пользовательский парсер Markdown (`parseMarkdownToBlocks`), который преобразует исходный Markdown в массив `Block[]`. Парсер поддерживает общий синтаксис, такой как заголовки, списки, блоки кода, таблицы, блоки цитат и т.д.
:::

## CodeAnnotation (Аннотация кода)

`CodeAnnotation` представляет аннотацию на уровне строки в проверке кода, используемую для добавления отзывов к конкретным строкам или диапазонам в Git diff.

### Полное определение

```typescript
export interface CodeAnnotation {
  id: string;              // Уникальный идентификатор
  type: CodeAnnotationType;  // Тип аннотации
  filePath: string;         // Путь к файлу
  lineStart: number;        // Номер начальной строки
  lineEnd: number;          // Номер конечной строки
  side: 'old' | 'new';     // Сторона ('old' = удаленные строки, 'new' = добавленные строки)
  text?: string;           // Содержимое комментария
  suggestedCode?: string;    // Предлагаемый код (для типа suggestion)
  createdAt: number;        // Временная метка создания
  author?: string;         // Идентификатор соавтора
}
```

### Тип CodeAnnotationType

```typescript
export type CodeAnnotationType =
  | 'comment'      // Обычный комментарий
  | 'suggestion'  // Предложение по изменению (требуется suggestedCode)
  | 'concern';     // Точка внимания (напоминание о важном)
```

### Описание полей

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `id` | string | ✅ | Уникальный идентификатор |
| `type` | CodeAnnotationType | ✅ | Тип аннотации (comment/suggestion/concern) |
| `filePath` | string | ✅ | Относительный путь к аннотируемому файлу (например, `src/auth.ts`) |
| `lineStart` | number | ✅ | Номер начальной строки (начиная с 1) |
| `lineEnd` | number | ✅ | Номер конечной строки (начиная с 1) |
| `side` | 'old' \| 'new' | ✅ | Сторона: `'old'` = удаленные строки (старая версия), `'new'` = добавленные строки (новая версия) |
| `text` | string | ❌ | Содержимое комментария |
| `suggestedCode` | string | ❌ | Предлагаемый код (обязательно, когда type = 'suggestion') |
| `createdAt` | number | ✅ | Временная метка создания (миллисекунды) |
| `author` | string | ❌ | Идентификатор соавтора |

### Пояснение поля side

Поле `side` соответствует представлению diff в библиотеке [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs):

| Значение side | Соответствие @pierre/diffs | Описание |
| --- | --- | --- |
| `'old'` | `deletions` | Удаленные строки (контент в старой версии) |
| `'new'` | `additions` | Добавленные строки (контент в новой версии) |

### Примеры

#### Обычный комментарий (добавленная строка)

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "这里需要处理错误情况",
  createdAt: Date.now(),
}
```

#### Предложение по изменению (удаленная строка)

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "建议改用 async/await",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```

## ShareableAnnotation (Аннотация для совместного использования)

`ShareableAnnotation` — это компактный формат аннотаций для совместного использования URL, представленный в виде массива кортежей для уменьшения размера payload.

### Полное определение

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [type, original, author, images]
  | ['R', string, string, string | null, string[]?]   // Replacement: [type, original, replacement, author, images]
  | ['C', string, string, string | null, string[]?]   // Comment: [type, original, comment, author, images]
  | ['I', string, string, string | null, string[]?]   // Insertion: [type, context, new text, author, images]
  | ['G', string, string | null, string[]?];          // Global Comment: [type, comment, author, images]
```

### Описание типов

| Тип | Первый символ | Структура кортежа | Описание |
| --- | --- | --- | --- |
| DELETION | `'D'` | `['D', original, author?, images?]` | Удалить контент |
| REPLACEMENT | `'R'` | `['R', original, replacement, author?, images?]` | Заменить контент |
| COMMENT | `'C'` | `['C', original, comment, author?, images?]` | Прокомментировать контент |
| INSERTION | `'I'` | `['I', context, newText, author?, images?]` | Вставить контент |
| GLOBAL_COMMENT | `'G'` | `['G', comment, author?, images?]` | Глобальный комментарий |

### Примеры

```typescript
// Удаление
['D', '要删除的内容', null, []]

// Замена
['R', '原文', '替换为', null, ['/tmp/img.png']]

// Комментарий
['C', '这段代码', '建议优化', null, []]

// Вставка
['I', '上下文', '要插入的新内容', null, []]

// Глобальный комментарий
['G', '整体很好', null, []]
```

::: tip Зачем нужен компактный формат?
Использование массива кортежей вместо объектов уменьшает размер payload, делая URL короче после сжатия. Например:
- Формат объекта: `{"type":"DELETION","originalText":"text"}` → 38 байт
- Компактный формат: `["D","text",null,[]]` → 18 байт
:::

## SharePayload (Полезная нагрузка для совместного использования)

`SharePayload` — это полная структура данных для совместного использования URL, содержащая содержимое плана и аннотации.

### Полное определение

```typescript
export interface SharePayload {
  p: string;                  // Текст плана в формате Markdown
  a: ShareableAnnotation[];    // Массив аннотаций (компактный формат)
  g?: string[];              // Пути к глобальным вложениям (изображения)
}
```

### Описание полей

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `p` | string | ✅ | Содержимое исходного плана в формате Markdown |
| `a` | ShareableAnnotation[] | ✅ | Массив аннотаций (использует компактный формат `ShareableAnnotation`) |
| `g` | string[] | ❌ | Пути к глобальным вложениям (изображения, не связанные с конкретными аннотациями) |

### Пример

```typescript
{
  p: "# Implementation Plan\n\n1. Add auth\n2. Add UI",
  a: [
    ['C', 'Add auth', '需要支持 OAuth', null, []],
    ['G', '整体计划清晰', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```

## Frontmatter (Метаданные)

`Frontmatter` представляет метаданные YAML в верхней части файла Markdown, используемые для хранения дополнительной информации.

### Полное определение

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### Пример

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Implementation Plan（示例）
...
```

После парсинга:

```typescript
{
  created: "2026-01-24T14:30:00.000Z",
  source: "plannotator",
  tags: ["authentication", "typescript"],
  author: "John Doe",
}
```

::: tip Назначение метаданных
Plannotator автоматически генерирует frontmatter при сохранении плана в Obsidian, включая время создания, теги источника и другую информацию для удобства управления заметками и поиска.
:::

## Связанные вспомогательные типы

### EditorMode (Режим редактора)

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'`: Режим выделения текста
- `'comment'`: Режим комментирования
- `'redline'`: Режим красной линии (редактирование)

### DiffResult (Результат Diff)

```typescript
export interface DiffResult {
  original: string;    // Исходное содержимое
  modified: string;    // Измененное содержимое
  diffText: string;    // Текст Unified diff
}
```

### DiffAnnotationMetadata (Метаданные аннотации Diff)

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // Связанный ID аннотации
  type: CodeAnnotationType;  // Тип аннотации
  text?: string;            // Содержимое комментария
  suggestedCode?: string;   // Предлагаемый код
  author?: string;          // Автор
}
```

### SelectedLineRange (Выбранный диапазон строк)

```typescript
export interface SelectedLineRange {
  start: number;                      // Номер начальной строки
  end: number;                        // Номер конечной строки
  side: 'deletions' | 'additions';   // Сторона (соответствует представлению diff в @pierre/diffs)
  endSide?: 'deletions' | 'additions'; // Конечная сторона (для выделения через стороны)
}
```

## Отношения преобразования данных

### Annotation ↔ ShareableAnnotation

```typescript
// Полный → Компактный
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// Компактный → Полный
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info Потеря координат
В `Annotation`, сгенерированном `fromShareable`, поля `blockId`, `startOffset`, `endOffset` пусты или равны 0. Точное положение необходимо восстановить через сопоставление текста или web-highlighter.
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```

## Резюме урока

Это приложение описывает все основные модели данных Plannotator:

- **Annotation**: Аннотации в проверке планов, поддерживающие типы удаления, вставки, замены, комментирования и т.д.
- **Block**: Блоки контента после парсинга Markdown, используемые для структурированного отображения планов
- **CodeAnnotation**: Аннотации на уровне строк в проверке кода, поддерживающие комментарии и предложения
- **ShareableAnnotation**: Компактный формат для совместного использования URL, уменьшающий размер payload
- **SharePayload**: Полная структура данных для совместного использования URL

Эти модели данных широко используются в функциях проверки планов, проверки кода, совместного использования URL и т.д. Понимание их помогает глубоко настраивать и расширять Plannotator.

## Анонс следующего урока

> В следующем уроке мы изучим **[Информацию о лицензии Plannotator](../license/)**.
>
> Вы узнаете:
> - Основные условия Business Source License 1.1 (BSL)
> - Разрешенные способы использования и коммерческие ограничения
> - График перехода на Apache 2.0 в 2030 году
> - Как получить коммерческую лицензию

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы развернуть и просмотреть расположение исходного кода</strong></summary>

> Время обновления: 2026-01-24

| Функция | Путь к файлу | Строки |
| --- | --- | --- |
| Интерфейс Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| Перечисление AnnotationType | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Интерфейс Block | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| Интерфейс CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| Тип CodeAnnotationType | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| Тип ShareableAnnotation | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| Интерфейс SharePayload | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**Ключевые константы**:
- Нет

**Ключевые функции**:
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`: Преобразует полные аннотации в компактный формат
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`: Восстанавливает полные аннотации из компактного формата
- `parseMarkdownToBlocks(markdown: string): Block[]`: Парсит Markdown в массив Block
- `exportDiff(blocks: Block[], annotations: Annotation[]): string`: Экспортирует аннотации в формат Markdown

</details>
