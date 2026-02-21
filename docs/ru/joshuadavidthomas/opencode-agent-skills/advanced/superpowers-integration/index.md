---
title: "Интеграция Superpowers | opencode-agent-skills"
sidebarTitle: "Интеграция Superpowers"
subtitle: "Интеграция Superpowers"
description: "Справочник исходного кода для интеграции Superpowers в OpenCode Agent Skills."
order: 2
---

## Приложение: справочник исходного кода

<details>
<summary><strong>Нажмите, чтобы развернуть и увидеть расположение исходного кода</strong></summary>

> Время обновления: 2026-01-24

| Функция | Путь к файлу | Номер строки |
|--- | --- | ---|
| Модуль интеграции Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L1-L59) | 1-59 |
| Определение маппинга инструментов | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L12-L16) | 12-16 |
| Определение пространства имён навыков | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |
| Функция внедрения содержимого Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L31-L58) | 31-58 |
| Проверка переменной окружения | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L37) | 37 |
| Вызов внедрения при инициализации сессии | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L101) | 101 |
| Повторное внедрение после сжатия | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L148) | 148 |

**Ключевые константы**:
- `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE`: переменная окружения, установите в `'true'` для включения режима Superpowers

**Ключевые функции**:
- `maybeInjectSuperpowersBootstrap()`: проверяет переменную окружения и существование навыка, внедряет содержимое Superpowers
- `discoverAllSkills()`: обнаруживает все доступные навыки (используется для поиска `using-superpowers`)
- `injectSyntheticContent()`: внедряет содержимое в сессию в виде synthetic-сообщения

</details>
