---
layout: page
pageClass: project-home-page
sidebar: false
title: "Быстрый старт: использование Antigravity Tools с нуля | Antigravity-Manager"
sidebarTitle: "Запуск с нуля"
subtitle: "Быстрый старт: использование Antigravity Tools с нуля"
description: "Изучите полный процесс начала работы с Antigravity Tools. От установки и настройки до первого API вызова, быстро освойте основные методы использования локального шлюза."
order: 1
---

# Быстрый старт

В этой главе мы проведем вас через весь процесс начала работы с Antigravity Tools с нуля, выполнив полный цикл от установки до первого успешного вызова API. Вы изучите основные концепции, управление учетными записями, резервное копирование данных, а также способы подключения ваших AI клиентов к локальному шлюзу.

## Содержание главы

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Что такое Antigravity Tools</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Установите правильную ментальную модель: локальный шлюз, совместимость протоколов, основные концепции планирования пула учетных записей и границы использования.</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Установка и обновление</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Лучшие способы установки для десктопной версии (brew / releases) и обработка распространенных системных блокировок.</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Обязательная информация при первом запуске</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Каталог данных, журналы, системный трей и автозапуск, чтобы избежать случайного удаления и необратимой потери.</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Добавление учетной записи</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Двухканальный OAuth/Refresh Token и лучшие практики, создание пула учетных записей самым надежным способом.</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Резервное копирование и миграция учетных записей</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Импорт/экспорт, горячая миграция V1/DB, поддержка многократного использования на разных машинах и сценариев развертывания на серверах.</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Запуск обратного прокси и подключение первого клиента</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">От запуска сервиса до успешного вызова внешним клиентом, полное прохождение проверочного цикла.</p>
</a>

</div>

## Путь обучения

::: tip Рекомендуемый порядок
Следуйте этому порядку обучения, чтобы максимально быстро освоить Antigravity Tools:
:::

```
1. Понимание концепций    →  2. Установка ПО    →  3. Каталог данных
   getting-started              installation            first-run-data
        ↓                            ↓                            ↓
4. Добавление учетной записи    →  5. Резервное копирование    →  6. Запуск прокси
   add-account                     backup-migrate                  proxy-and-first-client
```

| Шаг | Урок | Ориентировочное время | Чему вы научитесь |
|------|------|----------|----------|
| 1 | [Понимание концепций](./getting-started/) | 5 минут | Что такое локальный шлюз, зачем нужен пул учетных записей |
| 2 | [Установка ПО](./installation/) | 3 минуты | Установка через brew или ручная загрузка, обработка системных блокировок |
| 3 | [Каталог данных](./first-run-data/) | 5 минут | Где хранятся данные, как просматривать журналы, операции с трей |
| 4 | [Добавление учетной записи](./add-account/) | 10 минут | OAuth авторизация или ручной ввод Refresh Token |
| 5 | [Резервное копирование](./backup-migrate/) | 5 минут | Экспорт учетных записей, миграция между устройствами |
| 6 | [Запуск прокси](./proxy-and-first-client/) | 10 минут | Запуск сервиса, настройка клиента, проверка вызова |

**Минимальный рабочий путь**: если у вас мало времени, вы можете выполнить только 1 → 2 → 4 → 6, это займет около 25 минут для начала использования.

## Следующие шаги

После завершения этой главы вы сможете нормально использовать Antigravity Tools. Далее вы можете углубиться в изучение:

- **[Платформы и интеграции](../platforms/)**: узнайте детали подключения для разных протоколов OpenAI, Anthropic, Gemini
- **[Расширенная конфигурация](../advanced/)**: маршрутизация моделей, управление квотами, высокодоступное планирование и другие расширенные функции
- **[Часто задаваемые вопросы](../faq/)**: руководство по устранению неполадок при ошибках 401/404/429
