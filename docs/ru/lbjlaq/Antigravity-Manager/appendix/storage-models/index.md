---
title: "Модель хранения: структура данных | Antigravity Tools"
sidebarTitle: "Где данные"
subtitle: "Данные и модели: файлы аккаунтов, база данных статистики SQLite и определения ключевых полей"
description: "Научитесь структуре хранения данных Antigravity Tools. Освойте расположение и значение полей accounts.json, файлов аккаунтов, token_stats.db/proxy_logs.db."
tags:
  - "Приложение"
  - "Модель данных"
  - "Структура хранения"
  - "Резервное копирование"
prerequisite:
  - "start-backup-migrate"
order: 2
---

# Данные и модели: файлы аккаунтов, база данных статистики SQLite и определения ключевых полей

## Чему вы научитесь

- Быстро найти расположение хранения данных аккаунтов, базы данных статистики, файлов конфигурации, каталогов логов
- Понять структуру JSON файлов аккаунтов и значение ключевых полей
- Непосредственно запросить логи запросов прокси и статистику потребления токенов через SQLite
- Знать, какие файлы смотреть при резервном копировании, миграции, устранении неполадок

## Ваша текущая проблема

Когда вам нужно:
- **Перенести аккаунты на новую машину**: не знаете, какие файлы скопировать
- **Устранить аномалии аккаунтов**: какие поля в файле аккаунта могут определить состояние аккаунта
- **Экспортировать потребление токенов**: хотите напрямую запросить из базы данных, не знаете структуру таблицы
- **Очистить исторические данные**: боитесь удалить неправильные файлы, что приведет к потере данных

Это приложение поможет вам создать полное понимание модели данных.

---

## Структура каталога данных

Основные данные Antigravity Tools по умолчанию хранятся в каталоге `.antigravity_tools` в "домашнем каталоге пользователя" (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: warning Сначала проясним границы безопасности
В этом каталоге будут содержаться `refresh_token`/`access_token` и другая чувствительная информация (источник: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`). Перед резервным копированием/копированием/обменом сначала подтвердите, что ваша целевая среда доверенная.
:::

### Где мне найти этот каталог?

::: code-group

```bash [macOS/Linux]
## Войти в каталог данных
cd ~/.antigravity_tools

## Или открыть в Finder (macOS)
open ~/.antigravity_tools
```

```powershell [Windows]
## Войти в каталог данных
Set-Location "$env:USERPROFILE\.antigravity_tools"

## Или открыть в проводнике
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### Обзор дерева каталогов

```
~/.antigravity_tools/
├── accounts.json          # Индекс аккаунтов (версия 2.0)
├── accounts/              # Каталог аккаунтов
│   └── <account_id>.json  # Каждый аккаунт отдельный файл
├── gui_config.json        # Конфигурация приложения (записывается GUI)
├── token_stats.db         # База данных статистики токенов (SQLite)
├── proxy_logs.db          # База данных логов мониторинга Proxy (SQLite)
├── logs/                  # Каталог логов приложения
│   └── app.log*           # Катится по дням (имя файла меняется с датой)
├── bin/                   # Внешние инструменты (например, cloudflared)
│   └── cloudflared(.exe)
└── device_original.json   # Базовый отпечаток устройства (опционально)
```

**Правило пути к каталогу данных**: Берется `dirs::home_dir()`, добавляется `.antigravity_tools` (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: tip Рекомендация по резервному копированию
Регулярно резервируйте каталог `accounts/`, `accounts.json`, `token_stats.db` и `proxy_logs.db`, чтобы сохранить все основные данные.
:::

---

## Модель данных аккаунтов

### accounts.json (индекс аккаунтов)

Файл индекса аккаунтов записывает сводную информацию всех аккаунтов и текущий выбранный аккаунт.

**Расположение**: `~/.antigravity_tools/accounts.json`

**Схема** (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`):

```json
{
  "version": "2.0",                  // Версия индекса
  "accounts": [                       // Список сводки аккаунтов
    {
      "id": "uuid-v4",              // Уникальный ID аккаунта
      "email": "user@gmail.com",     // Почта аккаунта
      "name": "Display Name",        // Отображаемое имя (опционально)
      "created_at": 1704067200,      // Время создания (Unix timestamp)
      "last_used": 1704067200       // Последнее время использования (Unix timestamp)
    }
  ],
  "current_account_id": "uuid-v4"    // ID текущего выбранного аккаунта
}
```

### Файл аккаунта ({account_id}.json)

Полные данные каждого аккаунта хранятся отдельно в формате JSON в каталоге `accounts/`.

**Расположение**: `~/.antigravity_tools/accounts/{account_id}.json`

**Схема** (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42`; фронтенд тип: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`):

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // Данные OAuth Token
    "access_token": "ya29...",      // Текущий токен доступа
    "refresh_token": "1//...",      // Токен обновления (самый важный)
    "expires_in": 3600,            // Время истечения (секунды)
    "expiry_timestamp": 1704070800, // Timestamp истечения
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // Опционально: Google Cloud Project ID
    "session_id": "..."            // Опционально: Antigravity sessionId
  },

  "device_profile": {               // Отпечаток устройства (опционально)
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // Исторические версии отпечатка устройства
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Saved from device X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // Данные квоты (опционально)
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // Процент оставшейся квоты
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // Тип подписки: FREE/PRO/ULTRA
  },

  "disabled": false,                // Полностью ли отключен аккаунт
  "disabled_reason": null,          // Причина отключения (например, invalid_grant)
  "disabled_at": null,             // Timestamp отключения

  "proxy_disabled": false,         // Отключена ли функция прокси
  "proxy_disabled_reason": null,   // Причина отключения прокси
  "proxy_disabled_at": null,       // Timestamp отключения прокси

  "protected_models": [             // Список моделей, защищенных квотой
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### Пояснение ключевых полей

| Поле | Тип | Бизнес-значение | Условие срабатывания |
|--- | --- | --- | ---|
| `disabled` | bool | Аккаунт полностью отключен (например, refresh_token недействителен) | При `invalid_grant` автоматически устанавливается в `true` |
| `proxy_disabled` | bool | Отключена только функция прокси, не влияет на использование GUI | Ручное отключение или срабатывание защиты квоты |
| `protected_models` | string[] | Список "ограниченных моделей" защиты квоты на уровне модели | Обновляется логикой защиты квоты |
| `quota.models[].percentage` | number | Процент оставшейся квоты (0-100) | Обновляется при каждом обновлении квоты |
| `token.refresh_token` | string | Учетные данные для получения access_token | Получается при авторизации OAuth, действует долго |

**Важное правило 1: invalid_grant вызовет отключение** (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889`; запись на диск: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`):

- При сбое обновления токена и если ошибка содержит `invalid_grant`, TokenManager запишет в файл аккаунта `disabled=true` / `disabled_at` / `disabled_reason` и удалит аккаунт из пула токенов.

**Важное правило 2: семантика protected_models** (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250`; запись защиты квоты: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`):

- В `protected_models` хранятся "нормализованные ID модели", используемые для защиты квоты на уровне модели и пропуска планирования.

---

## База данных статистики токенов

База данных статистики токенов записывает потребление токенов каждого запроса прокси, используется для мониторинга затрат и анализа тенденций.

**Расположение**: `~/.antigravity_tools/token_stats.db`

**Движок базы данных**: SQLite + режим WAL (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`)

### Структура таблицы

#### token_usage (оригинальные записи использования)

| Поле | Тип | Описание |
|--- | --- | ---|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Автоинкрементный первичный ключ |
| timestamp | INTEGER | Timestamp запроса |
| account_email | TEXT | Почта аккаунта |
| model | TEXT | Название модели |
| input_tokens | INTEGER | Количество входных токенов |
| output_tokens | INTEGER | Количество выходных токенов |
| total_tokens | INTEGER | Общее количество токенов |

**Оператор создания таблицы** (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`):

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly (почасовая агрегатная таблица)

Каждый час агрегируется потребление токенов, используется для быстрого запроса данных тенденций.

**Оператор создания таблицы** (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`):

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- Временное ведро (формат: YYYY-MM-DD HH:00)
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### Индексы

Для повышения производительности запросов в базе данных созданы следующие индексы (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`):

```sql
-- Индекс по времени в убывающем порядке
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- Индекс по аккаунту
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### Примеры общих запросов

#### Запросить потребление токенов за последние 24 часа

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### Статистика потребления по моделям

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info Определение поля времени
`token_usage.timestamp` - это Unix timestamp (секунды), записанный `chrono::Utc::now().timestamp()`, `token_stats_hourly.hour_bucket` также генерируется по UTC в строковом формате (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`).
:::

---

## База данных логов мониторинга Proxy

База данных логов прокси записывает подробную информацию каждого запроса прокси, используется для устранения неполадок и аудита запросов.

**Расположение**: `~/.antigravity_tools/proxy_logs.db`

**Движок базы данных**: SQLite + режим WAL (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`)

### Структура таблицы: request_logs

| Поле | Тип | Описание |
|--- | --- | ---|
| id | TEXT PRIMARY KEY | Уникальный ID запроса (UUID) |
| timestamp | INTEGER | Timestamp запроса |
| method | TEXT | HTTP метод (GET/POST) |
| url | TEXT | URL запроса |
| status | INTEGER | Код состояния HTTP |
| duration | INTEGER | Время выполнения запроса (миллисекунды) |
| model | TEXT | Название модели, запрошенной клиентом |
| mapped_model | TEXT | Название модели, фактически использованной после маршрутизации |
| account_email | TEXT | Почта используемого аккаунта |
| error | TEXT | Сообщение об ошибке (если есть) |
| request_body | TEXT | Тело запроса (опционально, занимает много места) |
| response_body | TEXT | Тело ответа (опционально, занимает много места) |
| input_tokens | INTEGER | Количество входных токенов |
| output_tokens | INTEGER | Количество выходных токенов |
| protocol | TEXT | Тип протокола (openai/anthropic/gemini) |

**Оператор создания таблицы** (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`):

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- Совместимость: постепенно добавляйте новые поля через ALTER TABLE
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### Индексы

```sql
-- Индекс по времени в убывающем порядке
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- Индекс по коду состояния
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### Автоматическая очистка

При запуске ProxyMonitor система автоматически очистит логи старше 30 дней и сделает `VACUUM` для базы данных (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`; реализация: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`).

### Примеры общих запросов

#### Запросить последние неудачные запросы

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### Статистика успеха запросов каждого аккаунта

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## Файлы конфигурации

### gui_config.json

Хранит информацию о конфигурации приложения, включая настройки прокси, сопоставление моделей, режим аутентификации и т.д.

**Расположение**: `~/.antigravity_tools/gui_config.json` (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`)

Структура этого файла основана на `AppConfig` (источник: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`).

::: tip Когда вам нужно "только для резервного копирования/миграции"
Самый надежный способ: закрыть приложение, затем упаковать весь `~/.antigravity_tools/`. Семантика горячего обновления конфигурации/перезапуск относится к "поведению во время выполнения", см. урок продвинутого уровня **[Полная конфигурация](/ru/lbjlaq/Antigravity-Manager/advanced/config/)**.
:::

---

## Файлы логов

### Логи приложения

**Расположение**: `~/.antigravity_tools/logs/` (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`)

Логи используют файлы, катящиеся по дням, базовое имя файла - `app.log` (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`).

**Уровни логов**: INFO/WARN/ERROR

**Назначение**: Записывает ключевые события, сообщения об ошибках и отладочную информацию во время работы приложения, используется для устранения неполадок.

---

## Миграция данных и резервное копирование

### Резервное копирование основных данных

::: code-group

```bash [macOS/Linux]
## Резервное копирование всего каталога данных (самый надежный)
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## Резервное копирование всего каталога данных (самый надежный)
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### Миграция на новую машину

1. Закройте Antigravity Tools (избегайте копирования во время записи)
2. Скопируйте `.antigravity_tools` исходной машины в домашний каталог целевой машины
3. Запустите Antigravity Tools

::: tip Миграция между платформами
Если миграция с Windows на macOS/Linux (или наоборот), просто скопируйте весь каталог `.antigravity_tools`, формат данных кроссплатформенный.
:::

### Очистка исторических данных

::: info Сначала вывод
- `proxy_logs.db`: автоматически очищает старше 30 дней (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`).
- `token_stats.db`: при запуске инициализирует структуру таблицы (источник: `source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`), но в исходном коде не видно логики "автоматически очищать исторические записи по дням".
:::

::: danger Делайте только тогда, когда вы уверены, что исторические данные не нужны
Очистка статистики/логов заставит вас потерять исторические данные устранения неполадок и анализа затрат. Перед действием сначала резервируйте весь `.antigravity_tools`.
:::

Если вы просто хотите "очистить историю и начать заново", самый надежный способ закрыть приложение и напрямую удалить файлы DB (при следующем запуске структура таблицы будет восстановлена).

::: code-group

```bash [macOS/Linux]
## Очистить статистику токенов (потеряете историю)
rm -f ~/.antigravity_tools/token_stats.db

## Очистить логи мониторинга Proxy (потеряете историю)
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## Очистить статистику токенов (потеряете историю)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## Очистить логи мониторинга Proxy (потеряете историю)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## Пояснение определений общих полей

### Unix timestamp

Все поля, связанные со временем (например, `created_at`, `last_used`, `timestamp`), используют Unix timestamp (точность до секунды).

**Преобразование в читаемое время**:

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## Запрос SQLite (пример: преобразовать request_logs.timestamp в читаемое человеком время)
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### Процент квоты

`quota.models[].percentage` представляет процент оставшейся квоты (0-100) (источник: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40`; модель бэкенда: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`).

Срабатывает ли "защита квоты", зависит от `quota_protection.enabled/threshold_percentage/monitored_models` (источник: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63`; запись в `protected_models`: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`).

---

## Краткий итог урока

- Каталог данных Antigravity Tools находится в `.antigravity_tools` в домашнем каталоге пользователя
- Данные аккаунтов: `accounts.json` (индекс) + `accounts/<account_id>.json` (полные данные одного аккаунта)
- Статистические данные: `token_stats.db` (статистика токенов) + `proxy_logs.db` (логи мониторинга Proxy)
- Конфигурация и эксплуатация: `gui_config.json`, `logs/`, `bin/cloudflared*`, `device_original.json`
- Самый надежный способ резервного копирования/миграции - "упаковать весь `.antigravity_tools` после закрытия приложения"

---

## Следующий урок预告

> Следующий урок мы изучим **[Границы возможностей интеграции z.ai](../zai-boundaries/)**.
>
> Вы узнаете:
> - Список реализованных функций интеграции z.ai
> - Явно нереализованные функции и ограничения использования
> - Экспериментальная реализация Vision MCP

---

## Приложение: Справка по исходному коду

<details>
<summary><strong>Нажмите, чтобы увидеть местоположение исходного кода</strong></summary>

> Обновлено: 2026-01-23

| Функция | Путь к файлу | Строки |
|--- | --- | ---|
| Каталог данных (.antigravity_tools) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Каталог аккаунтов (accounts/) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| Структура accounts.json | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Структура Account (бэкенд) | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Структура Account (фронтенд) | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| Структура TokenData/QuotaData | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| Структура TokenData/QuotaData | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Инициализация базы данных статистики токенов (схема) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Инициализация базы данных логов прокси (схема) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Автоматическая очистка логов прокси (30 дней) | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Реализация автоматической очистки логов прокси | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| Чтение/запись gui_config.json | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| каталог logs/ и app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| Путь bin/cloudflared | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
|--- | --- | ---|

**Ключевые константы**:
- `DATA_DIR = ".antigravity_tools"`: имя каталога данных (`src-tauri/src/modules/account.rs:16-18`)
- `ACCOUNTS_INDEX = "accounts.json"`: имя файла индекса аккаунтов (`src-tauri/src/modules/account.rs:16-18`)
- `CONFIG_FILE = "gui_config.json"`: имя файла конфигурации (`src-tauri/src/modules/config.rs:7`)

**Ключевые функции**:
- `get_data_dir()`: получить путь к каталогу данных (`src-tauri/src/modules/account.rs`)
- `record_usage()`: запись в `token_usage`/`token_stats_hourly` (`src-tauri/src/modules/token_stats.rs`)
- `save_log()`: запись в `request_logs` (`src-tauri/src/modules/proxy_db.rs`)
- `cleanup_old_logs(days)`: удалить старые `request_logs` и `VACUUM` (`src-tauri/src/modules/proxy_db.rs`)

</details>
