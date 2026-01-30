---
title: "Журнал изменений: История версий | Plannotator"
sidebarTitle: "Что нового"
subtitle: "Журнал изменений: История версий | Plannotator"
description: "Узнайте историю версий и новые возможности Plannotator. Просмотрите основные обновления, исправления ошибок и улучшения производительности, включая функции проверки кода, аннотации изображений и интеграцию с Obsidian."
tags:
  - "Журнал изменений"
  - "История версий"
  - "Новые возможности"
  - "Исправления ошибок"
order: 1
---

# Журнал изменений: История версий и новые возможности Plannotator

## Чему вы научитесь

- ✅ Понимать историю версий и новые возможности Plannotator
- ✅ Освоить основные обновления и улучшения каждой версии
- ✅ Узнать об исправлениях ошибок и оптимизации производительности

---

## Последняя версия

### v0.6.7 (2026-01-24)

**Новые возможности**:
- **Comment mode**: Добавлен режим Comment, позволяющий вводить комментарии непосредственно в план
- **Type-to-comment shortcut**: Добавлена поддержка горячих клавиш для прямого ввода содержимого комментария

**Улучшения**:
- Исправлена проблема блокировки sub-agent в плагине OpenCode
- Исправлена уязвимость prompt injection (CVE)
- Улучшена интеллектуальная детекция переключения агентов в OpenCode

**Исходный код**:
- Comment mode: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Type-to-comment: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**Исправления**:
- Исправлена уязвимость безопасности CVE в плагине OpenCode
- Исправлена проблема блокировки sub-agent для предотвращения prompt injection
- Улучшена логика интеллектуальной детекции переключения агентов

**Исходный код**:
- OpenCode plugin: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Agent switching: [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**Улучшения**:
- **Увеличение timeout hook**: Увеличен timeout hook со значения по умолчанию до 4 дней для поддержки длительно выполняемых AI-планов
- **Исправление функции copy**: Сохранение переносов строк в операциях копирования
- **Добавление горячей клавиши Cmd+C**: Добавлена поддержка горячей клавиши Cmd+C

**Исходный код**:
- Hook timeout: [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Copy newlines: [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**Новые возможности**:
- **Горячая клавиша Cmd+Enter**: Поддержка использования Cmd+Enter (Windows: Ctrl+Enter) для отправки одобрения или отзыва

**Улучшения**:
- Оптимизирован опыт работы с клавиатурой

**Исходный код**:
- Keyboard shortcuts: [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
  (Функция горячей клавиши Cmd+Enter реализована непосредственно в компонентах)

---

### v0.6.3 (2026-01-05)

**Исправления**:
- Исправлена проблема skip-title-generation-prompt

**Исходный код**:
- Skip title: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**Исправления**:
- Исправлена проблема отсутствия HTML-файлов в npm-пакете плагина OpenCode

**Исходный код**:
- OpenCode plugin build: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**Новые возможности**:
- **Интеграция с Bear**: Поддержка автоматического сохранения одобренных планов в приложение для заметок Bear

**Улучшения**:
- Улучшена логика генерации тегов для интеграции с Obsidian
- Оптимирован механизм обнаружения vault в Obsidian

**Исходный код**:
- Bear интеграция: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Obsidian интеграция: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## Основные релизы функций

### Функция проверки кода (2026-01)

**Новые возможности**:
- **Инструмент проверки кода**: Запуск команды `/plannotator-review` для визуальной проверки Git diff
- **Построчные комментарии**: Выбор диапазона кода по номерам строк для добавления комментариев типов comment/suggestion/concern
- **Различные представления diff**: Поддержка переключения между разными типами diff: uncommitted/staged/last-commit/branch
- **Интеграция с агентом**: Отправка структурированных отзывов AI-агенту с поддержкой автоматического ответа

**Как использовать**:
```bash
# Запустить в директории проекта
/plannotator-review
```

**Связанные учебные пособия**:
- [Основы проверки кода](../../platforms/code-review-basics/)
- [Добавление комментариев к коду](../../platforms/code-review-annotations/)
- [Переключение представлений Diff](../../platforms/code-review-diff-types/)

**Исходный код**:
- Code review server: [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Code review UI: [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Git diff утилиты: [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### Функция аннотации изображений (2026-01)

**Новые возможности**:
- **Загрузка изображений**: Загрузка вложений изображений в планы и проверки кода
- **Инструменты аннотации**: Предоставление трёх инструментов аннотации: кисть, стрелка, круг
- **Визуальная аннотация**: Прямая аннотация на изображениях для улучшения эффективности отзывов при проверке

**Связанные учебные пособия**:
- [Добавление аннотаций изображений](../../platforms/plan-review-images/)

**Исходный код**:
- Image annotator: [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- Upload API: [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Интеграция с Obsidian (2025-12)

**Новые возможности**:
- **Автоматическое обнаружение vaults**: Автоматическое обнаружение пути к файлу конфигурации vault Obsidian
- **Автоматическое сохранение планов**: Одобренные планы автоматически сохраняются в Obsidian
- **Генерация frontmatter**: Автоматическое включение frontmatter: created, source, tags и т.д.
- **Интеллектуальное извлечение тегов**: Извлечение ключевых слов из содержимого плана в качестве тегов

**Настройка**:
Дополнительная настройка не требуется, Plannotator автоматически обнаруживает путь установки Obsidian.

**Связанные учебные пособия**:
- [Интеграция с Obsidian](../../advanced/obsidian-integration/)

**Исходный код**:
- Obsidian detection: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Obsidian save: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Frontmatter generation: [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### Функция обмена по URL (2025-11)

**Новые возможности**:
- **Обмен без бэкенда**: Сжатие планов и комментариев в URL hash без необходимости бэкенд-сервера
- **Обмен в один клик**: Нажмите Export → Share as URL для создания ссылки для обмена
- **Режим только для чтения**: Соавторы могут открывать URL для просмотра, но не могут отправлять решения

**Техническая реализация**:
- Использование алгоритма сжатия Deflate
- Кодирование Base64 + замена безопасных символов URL
- Поддержка максимального payload около 7 тегов

**Связанные учебные пособия**:
- [Обмен по URL](../../advanced/url-sharing/)

**Исходный код**:
- Sharing utils: [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Share hook: [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### Режим Remote/Devcontainer (2025-10)

**Новые возможности**:
- **Поддержка удалённого режима**: Использование Plannotator в удалённых средах: SSH, devcontainer, WSL и т.д.
- **Фиксированный порт**: Установка фиксированного порта через переменные окружения
- **Перенаправление порта**: Автоматический вывод URL для ручного открытия браузера пользователем
- **Управление браузером**: Управление открытием браузера через переменную окружения `PLANNOTATOR_BROWSER`

**Переменные окружения**:
- `PLANNOTATOR_REMOTE=1`: Включить удалённый режим
- `PLANNOTATOR_PORT=3000`: Установить фиксированный порт
- `PLANNOTATOR_BROWSER=disabled`: Отключить автоматическое открытие браузера

**Связанные учебные пособия**:
- [Режим Remote/Devcontainer](../../advanced/remote-mode/)
- [Настройка переменных окружения](../../advanced/environment-variables/)

**Исходный код**:
- Remote mode: [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Browser control: [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## Совместимость версий

| Версия Plannotator | Claude Code | OpenCode | Минимальная версия Bun |
|--- | --- | --- | ---|
| v0.6.x | 2.1.7+ | 1.0+ | 1.0+ |
| v0.5.x | 2.1.0+ | 0.9+ | 0.7+ |

**Рекомендации по обновлению**:
- Поддерживайте Plannotator в актуальной версии для получения новых возможностей и исправлений безопасности
- Claude Code и OpenCode также следует поддерживать в актуальных версиях

---

## Изменения лицензии

**Текущая версия (v0.6.7+)**: Business Source License 1.1 (BSL-1.1)

**Детали лицензии**:
- Разрешено: личное использование, внутреннее коммерческое использование
- Ограничено: предоставление хостинговых услуг, SaaS-продуктов
- Подробности см. в [LICENSE](https://github.com/backnotprop/plannotator/blob/main/LICENSE)

---

## Обратная связь и поддержка

**Сообщить о проблеме**:
- GitHub Issues: https://github.com/backnotprop/plannotator/issues

**Предложить функцию**:
- Отправить feature request в GitHub Issues

**Уязвимости безопасности**:
- Пожалуйста, сообщайте об уязвимостях безопасности через закрытые каналы

---

## Следующий урок

> Вы ознакомились с историей версий и новыми возможностями Plannotator.
>
> Далее вы можете:
> - Вернуться к [Быстрому началу](../../start/getting-started/) для изучения установки и использования
> - Посмотреть [Часто задаваемые вопросы](../../faq/common-problems/) для решения проблем при использовании
> - Прочитать [Справочник по API](../../appendix/api-reference/) для ознакомления со всеми конечными точками API
