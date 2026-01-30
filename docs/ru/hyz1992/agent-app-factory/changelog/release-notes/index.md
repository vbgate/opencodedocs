---
title: "Changelog: История версий и изменения функций | Agent App Factory"
sidebarTitle: "Changelog"
subtitle: "Changelog: История версий и изменения функций | Agent App Factory"
description: "Узнайте об истории обновлений Agent App Factory, изменениях функций, исправлениях ошибок и значительных улучшениях. Эта страница содержит подробную историю изменений начиная с версии 1.0.0, включая основные функции и улучшения: 7-этапная система конвейера, планировщик Sisyphus, управление правами, оптимизация контекста и стратегии обработки ошибок."
tags:
  - "Changelog"
  - "История версий"
prerequisite: []
order: 250
---

# Changelog

Эта страница содержит историю обновлений Agent App Factory, включая новые функции, улучшения, исправления ошибок и критические изменения.

Формат следует спецификации [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/), номера версий следуют [Semantic Versioning](https://semver.org/lang/ru/).

## [1.0.0] - 2024-01-29

### Добавлено

**Основные функции**
- **7-этапная система конвейера**: Полный автоматизированный процесс от идеи до работающего приложения
  - Bootstrap - Структурирование продукта (input/idea.md)
  - PRD - Генерация документа требований продукта (artifacts/prd/prd.md)
  - UI - Проектирование структуры UI и интерактивного прототипа (artifacts/ui/)
  - Tech - Проектирование технической архитектуры и модели данных Prisma (artifacts/tech/)
  - Code - Генерация кода фронтенда и бэкенда (artifacts/backend/, artifacts/client/)
  - Validation - Проверка качества кода (artifacts/validation/report.md)
  - Preview - Генерация руководства по развертыванию (artifacts/preview/README.md)

- **Планировщик Sisyphus**: Основной компонент управления конвейером
  - Последовательное выполнение этапов, определенных в pipeline.yaml
  - Проверка входных/выходных данных и условий выхода каждого этапа
  - Поддержка состояния конвейера (.factory/state.json)
  - Выполнение проверок прав доступа, предотвращение несанкционированного доступа
  - Обработка исключений в соответствии со стратегиями
  - Пауза на каждом чекпоинте, ожидание подтверждения перед продолжением

**CLI инструменты**
- `factory init` - Инициализация Factory проекта
- `factory run [stage]` - Запуск конвейера (с текущего или указанного этапа)
- `factory continue` - Продолжение выполнения в новой сессии (экономия токенов)
- `factory status` - Просмотр текущего состояния проекта
- `factory list` - Список всех Factory проектов
- `factory reset` - Сброс состояния текущего проекта

**Права доступа и безопасность**
- **Матрица возможностей** (capability.matrix.md): Определение строгих прав доступа для каждого агента
  - Каждый агент имеет доступ только к авторизованным директориям
  - Несанкционированные записи перемещаются в artifacts/_untrusted/
  - Автоматическая пауза конвейера при неудаче, ожидание вмешательства

**Оптимизация контекста**
- **Выполнение по сессиям**: Каждый этап выполняется в новой сессии
  - Избежание накопления контекста, экономия токенов
  - Поддержка возобновления после прерывания
  - Применимо ко всем AI-ассистентам (Claude Code, OpenCode, Cursor)

**Стратегии обработки ошибок**
- Механизм автоматических повторных попыток: Разрешен один повтор на этап
- Архивирование неудач: Неудачные артефакты перемещаются в artifacts/_failed/
- Механизм отката: Откат к последнему успешному чекпоинту
- Вмешательство человека: Пауза после двух последовательных неудач

**Обеспечение качества**
- **Стандарты кода** (code-standards.md)
  - Спецификации кодирования и лучшие практики TypeScript
  - Структура файлов и соглашения об именовании
  - Требования к комментариям и документации
  - Спецификации сообщений коммитов Git (Conventional Commits)

- **Стандарты кодов ошибок** (error-codes.md)
  - Унифицированная структура кодов ошибок: [MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - Стандартные типы ошибок: VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - Сопоставление кодов ошибок фронтенда и бэкенда и пользовательские сообщения

**Управление Changelog**
- Следование формату Keep a Changelog
- Интеграция с Conventional Commits
- Поддержка инструментов автоматизации: conventional-changelog-cli, release-it

**Шаблоны конфигурации**
- Конфигурация CI/CD (GitHub Actions)
- Конфигурация Git Hooks (Husky)

**Особенности генерируемых приложений**
- Полный код фронтенда и бэкенда (Express + Prisma + React Native)
- Модульные и интеграционные тесты (Vitest + Jest)
- Документация API (Swagger/OpenAPI)
- Сид-данные базы данных
- Конфигурация развертывания Docker
- Обработка ошибок и мониторинг журналов
- Оптимизация производительности и проверки безопасности

### Улучшено

**MVP-фокус**
- Четкое перечисление невключенных целей (Non-Goals) для предотвращения разрастания проекта
- Ограничение количества страниц до 3
- Фокус на основных функциях, избегание избыточного проектирования

**Разделение ответственности**
- Каждый агент отвечает только за свою область, не выходит за рамки полномочий
- PRD не содержит технических деталей, Tech не затрагивает проектирование UI
- Code Agent строго следует UI Schema и Tech дизайну при реализации

**Верифицируемость**
- Каждый этап определяет четкие критерии выхода (exit_criteria)
- Все функции могут быть протестированы и запущены локально
- Артефакты должны быть структурированы и могут быть использованы последующими этапами

### Технологический стек

**CLI инструменты**
- Node.js >= 16.0.0
- Commander.js - фреймворк командной строки
- Chalk - цветной вывод в терминал
- Ora - индикатор прогресса
- Inquirer - интерактивная командная строка
- fs-extra - операции файловой системы
- YAML - парсер YAML

**Генерируемые приложения**
- Бэкенд: Node.js + Express + Prisma + TypeScript + Vitest
- Фронтенд: React Native + Expo + TypeScript + Jest + React Testing Library
- Развертывание: Docker + GitHub Actions

### Зависимости

- `chalk@^4.1.2` - стили терминала
- `commander@^11.0.0` - парсинг аргументов командной строки
- `fs-extra@^11.1.1` - расширения файловой системы
- `inquirer@^8.2.5` - интерактивная командная строка
- `ora@^5.4.1` - элегантный загрузчик терминала
- `yaml@^2.3.4` - парсинг и сериализация YAML

## Заметки о версиях

### Semantic Versioning

Этот проект следует формату номеров версий [Semantic Versioning](https://semver.org/lang/ru/): MAJOR.MINOR.PATCH

- **MAJOR**: Несовместимые изменения API
- **MINOR**: Обратно совместимые добавления функций
- **PATCH**: Обратно совместимые исправления ошибок

### Типы изменений

- **Добавлено** (Added): Новые функции
- **Изменено** (Changed): Изменения существующих функций
- **Устарело** (Deprecated): Функции, которые скоро будут удалены
- **Удалено** (Removed): Удаленные функции
- **Исправлено** (Fixed): Исправления ошибок
- **Безопасность** (Security): Исправления безопасности

## Связанные ресурсы

- [GitHub Releases](https://github.com/hyz1992/agent-app-factory/releases) - Официальная страница релизов
- [Репозиторий проекта](https://github.com/hyz1992/agent-app-factory) - Исходный код
- [Issue Tracker](https://github.com/hyz1992/agent-app-factory/issues) - Обратная связь и предложения
- [Руководство по участию](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - Как внести вклад

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы развернуть исходный код</strong></summary>

> Дата обновления: 2024-01-29

| Функция | Путь к файлу | Строки |
| ------- | ------------ | ------ |
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json) | 1-52 |
| CLI entry | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 1-123 |
| init command | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-427 |
| run command | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-294 |
| continue command | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-87 |
| pipeline definition | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 1-87 |
| orchestrator definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| capability matrix | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-44 |
| failure policy | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-200 |
| code standards | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-287 |
| error codes | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-134 |
| changelog policy | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md) | 1-87 |

**Ключевая информация о версиях**:
- `version = "1.0.0"`: Начальная версия релиза
- `engines.node = ">=16.0.0"`: Минимальная требуемая версия Node.js

**Версии зависимостей**:
- `chalk@^4.1.2`: Стили терминала
- `commander@^11.0.0`: Парсинг аргументов командной строки
- `fs-extra@^11.1.1`: Расширения файловой системы
- `inquirer@^8.2.5`: Интерактивная командная строка
- `ora@^5.4.1`: Элегантный загрузчик терминала
- `yaml@^2.3.4`: Парсинг и сериализация YAML

</details>
