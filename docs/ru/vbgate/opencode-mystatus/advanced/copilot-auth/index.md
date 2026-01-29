---
title: "Copilot: OAuth и PAT | opencode-mystatus"
sidebarTitle: "Copilot Auth"
subtitle: "Copilot: OAuth и PAT"
description: "Настройте OAuth Token и Fine-grained PAT для GitHub Copilot. Решите проблему с правами OAuth, создайте Fine-grained PAT и настройте тип подписки для успешного запроса квоты."
tags:
  - "GitHub Copilot"
  - "OAuth аутентификация"
  - "Настройка PAT"
  - "Проблема с правами"
prerequisite:
  - "start-quick-start"
  - "platforms-copilot-usage"
order: 2
---

# Аутентификация Copilot: OAuth Token и Fine-grained PAT

## Что вы научитесь делать

- Понимать два метода аутентификации Copilot: OAuth Token и Fine-grained PAT
- Решать проблему с недостаточными правами OAuth Token
- Создавать Fine-grained PAT и настраивать тип подписки
- Успешно запрашивать квоту Premium Requests Copilot

## Ваша текущая проблема

При выполнении команды `/mystatus` для запроса квоты Copilot вы можете увидеть следующее сообщение об ошибке:

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

Решение:
1. Создайте fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. В 'Account permissions' установите 'Plan' на 'Read-only'
3. Создайте конфигурационный файл ~/.config/opencode/copilot-quota-token.json:
   {"token": "github_pat_xxx...", "username": "ваше_имя_пользователя"}
```

Вы не знаете:
- Что такое OAuth Token? Что такое Fine-grained PAT?
- Почему интеграция OAuth не поддерживает доступ к API квоты?
- Как создать Fine-grained PAT?
- Как выбрать тип подписки (free, pro, pro+ и т. д.)?

Эти вопросы блокируют вас, не позволяя просмотреть квоту Copilot.

## Когда использовать этот метод

Когда вы:
- Видите сообщение "OpenCode 的新 OAuth 集成不支持访问配额 API"
- Хотите использовать более стабильный метод Fine-grained PAT для запроса квоты
- Вам нужно настроить запрос квоты Copilot для командной или корпоративной учётной записи

## Основная идея

mystatus поддерживает **два метода аутентификации Copilot**:

| Метод аутентификации | Описание | Преимущества | Недостатки |
|---------|------|------|------|
| **OAuth Token** (по умолчанию) | Использует GitHub OAuth Token, полученный при входе в OpenCode | Дополнительная настройка не требуется, работает сразу | Новый OAuth Token OpenCode может не иметь прав Copilot |
| **Fine-grained PAT** (рекомендуется) | Fine-grained Personal Access Token, созданный вручную пользователем | Стабилен и надёжен, не зависит от прав OAuth | Требует однократного ручного создания |

**Правило приоритета**:
1. mystatus использует Fine-grained PAT (если настроен)
2. Если PAT не настроен, возвращается к OAuth Token

::: tip Рекомендуемый подход
Если у вашего OAuth Token есть проблемы с правами, создание Fine-grained PAT — наиболее стабильное решение.
:::

### Различия между двумя методами

**OAuth Token**:
- Место хранения: `~/.local/share/opencode/auth.json`
- Способ получения: автоматически при входе в GitHub через OpenCode
- Проблема с правами: новая версия OpenCode использует другой клиент OAuth, который может не предоставлять права Copilot

**Fine-grained PAT**:
- Место хранения: `~/.config/opencode/copilot-quota-token.json`
- Способ получения: создаётся вручную в GitHub Developer Settings
- Требования к правам: нужно выбрать право "Plan" (подписка) с правом чтения

## Следуйте за мной

### Шаг 1: Проверка, настроен ли Fine-grained PAT

Выполните следующую команду в терминале, чтобы проверить, существует ли конфигурационный файл:

::: code-group

```bash [macOS/Linux]
ls -la ~/.config/opencode/copilot-quota-token.json
```

```powershell [Windows]
Test-Path "$env:APPDATA\opencode\copilot-quota-token.json"
```

:::

**Что вы должны увидеть**:
- Если файл существует, значит, Fine-grained PAT уже настроен
- Если файл не существует или появляется ошибка, нужно создать его

### Шаг 2: Создание Fine-grained PAT (если не настроен)

Если файл не существует на предыдущем шаге, выполните следующие действия для его создания:

#### 2.1 Посетите страницу создания PAT GitHub

В браузере откройте:
```
https://github.com/settings/tokens?type=beta
```

Это страница создания Fine-grained PAT GitHub.

#### 2.2 Создайте новый Fine-grained PAT

Нажмите **Generate new token (classic)** или **Generate new token (beta)**, рекомендуется использовать Fine-grained (beta).

**Параметры настройки**:

| Поле | Значение |
|------|-----|
| **Name** | `mystatus-copilot` (или любое имя по вашему выбору) |
| **Expiration** | Выберите время истечения (например, 90 days или No expiration) |
| **Resource owner** | Не нужно выбирать (по умолчанию) |

**Настройка прав** (важно!):

В разделе **Account permissions** установите флажок:
- ✅ **Plan** → выберите **Read** (это право необходимо для запроса квоты)

::: warning Важное примечание
Установите только право чтения "Plan: Read", не отмечайте другие ненужные права для защиты учётной записи.
:::

**Что вы должны увидеть**:
- Отмечено "Plan: Read"
- Не отмечены другие права (соблюдение принципа минимальных прав)

#### 2.3 Генерация и сохранение Token

Нажмите кнопку **Generate token** в нижней части страницы.

**Что вы должны увидеть**:
- Страница отображает вновь созданный Token (похожий на `github_pat_xxxxxxxxxxxx`)
- ⚠️ **Сразу скопируйте этот Token**, после обновления страницы его больше не будет видно

### Шаг 3: Получение имени пользователя GitHub

В браузере откройте вашу главную страницу GitHub:
```
https://github.com/
```

**Что вы должны увидеть**:
- В правом или левом верхнем углу отображается ваше имя пользователя (например, `john-doe`)

Запишите это имя, оно понадобится при настройке.

### Шаг 4: Определение типа подписки Copilot

Вам нужно знать свой тип подписки Copilot, так как разные типы имеют разные ежемесячные квоты:

| Тип подписки | Ежемесячная квота | Применимые сценарии |
|---------|---------|---------|
| `free` | 50 | Copilot Free (бесплатные пользователи) |
| `pro` | 300 | Copilot Pro (личная профессиональная версия) |
| `pro+` | 1500 | Copilot Pro+ (личная расширенная версия) |
| `business` | 300 | Copilot Business (командная коммерческая версия) |
| `enterprise` | 1000 | Copilot Enterprise (корпоративная версия) |

::: tip Как определить тип подписки?
1. Посетите [страницу подписки GitHub Copilot](https://github.com/settings/copilot)
2. Посмотрите текущий отображаемый план подписки
3. Выберите соответствующий тип из таблицы выше
:::

### Шаг 5: Создание конфигурационного файла

Создайте конфигурационный файл и заполните его информацией в зависимости от вашей операционной системы.

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/copilot-quota-token.json << 'EOF'
{
  "token": "ваш_PAT_Token",
  "username": "ваше_имя_пользователя_GitHub",
  "tier": "тип_подписки"
}
EOF
```

```powershell [Windows]
# Создание каталога (если не существует)
New-Item -ItemType Directory -Force -Path "$env:APPDATA\opencode" | Out-Null

# Создание конфигурационного файла
@"
{
  "token": "ваш_PAT_Token",
  "username": "ваше_имя_пользователя_GitHub",
  "tier": "тип_подписки"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\copilot-quota-token.json" -Encoding utf8
```

:::

**Пример конфигурации**:

Предположим, ваш PAT — это `github_pat_abc123`, имя пользователя — `johndoe`, тип подписки — `pro`:

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

::: danger Предупреждение о безопасности
- Не отправляйте Token в репозиторий Git и не делитесь им с другими людьми
- Token — это учётные данные для доступа к вашей учётной записи GitHub, утечка может вызвать проблемы с безопасностью
:::

### Шаг 6: Проверка конфигурации

Выполните команду `/mystatus` в OpenCode.

**Что вы должны увидеть**:
- Раздел Copilot корректно отображает информацию о квоте
- Ошибка с правами больше не появляется
- Отображается похожее содержание:

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (@johndoe)

Premium requests
███████████████████░░░░░░░ 70% (90/300)

Period: 2026-01
```

## Контрольная точка ✅

Проверьте, что вы понимаете:

| Сценарий | Что вы должны увидеть/сделать |
|------|--------------|
| Конфигурационный файл существует | `ls ~/.config/opencode/copilot-quota-token.json` отображает файл |
| PAT создан успешно | Token начинается с `github_pat_` |
| Тип подписки правильный | Значение `tier` в конфигурации — это free/pro/pro+/business/enterprise |
| Проверка успешна | После выполнения `/mystatus` видна информация о квоте Copilot |

## Предупреждения о ловушках

### ❌ Ошибочная операция: забыли установить флажок "Plan: Read"

**Ошибка**: при выполнении `/mystatus` появляется ошибка API (403 или 401)

**Причина**: при создании PAT не установлены необходимые права.

**Правильное действие**:
1. Удалите старый Token (в GitHub Settings)
2. Создайте заново, убедившись, что установлено **Plan: Read**
3. Обновите поле `token` в конфигурационном файле

### ❌ Ошибочная операция: неправильно указан тип подписки

**Ошибка**: квота отображается неправильно (например, пользователю Free показана квота 300)

**Причина**: поле `tier` заполнено неверно (например, указано `pro`, а фактически `free`).

**Правильное действие**:
1. Посетите страницу настроек GitHub Copilot для подтверждения типа подписки
2. Измените поле `tier` в конфигурационном файле

### ❌ Ошибочная операция: срок действия Token истёк

**Ошибка**: при выполнении `/mystatus` появляется ошибка 401

**Причина**: для Fine-grained PAT установлено время истечения, он стал недействительным.

**Правильное действие**:
1. Посетите GitHub Settings → Tokens
2. Найдите истёкший Token и удалите его
3. Создайте новый Token и обновите конфигурационный файл

### ❌ Ошибочная операция: ошибка в регистре имени пользователя

**Ошибка**: видна ошибка 404 или пользователь не существует

**Причина**: имена пользователей GitHub чувствительны к регистру (например, `Johndoe` и `johndoe` — разные пользователи).

**Правильное действие**:
1. Скопируйте имя пользователя, отображаемое на главной странице GitHub (полностью совпадает)
2. Не вводите вручную, чтобы избежать ошибок в регистре

::: tip Совет
Если появляется ошибка 404, скопируйте имя пользователя прямо из URL GitHub, например, посетите `https://github.com/YourName`, `YourName` в URL — это ваше имя пользователя.
:::

## Итог урока

mystatus поддерживает два метода аутентификации Copilot:

1. **OAuth Token** (по умолчанию): получается автоматически, но могут возникнуть проблемы с правами
2. **Fine-grained PAT** (рекомендуется): настраивается вручную, стабилен и надёжен

Рекомендуемые шаги для настройки Fine-grained PAT:
1. Создайте Fine-grained PAT в GitHub Settings
2. Установите право "Plan: Read"
3. Запишите имя пользователя GitHub и тип подписки
4. Создайте конфигурационный файл `~/.config/opencode/copilot-quota-token.json`
5. Проверьте успешность конфигурации

После завершения настройки mystatus будет использовать PAT для запроса квоты Copilot с приоритетом, избегая проблем с правами OAuth.

## Предварительный обзор следующего урока

> На следующем уроке мы изучим **[Многоязычная поддержка: автоматическое переключение между китайским и английским](../i18n-setup/)**.
>
> Вы узнаете:
> - Механизм определения языка (Intl API, переменные окружения)
> - Как вручную переключать язык
> - Таблица соответствия китайского и английского языков

---

## Приложение: справочник по исходному коду

<details>
<summary><strong>Нажмите для просмотра местоположения исходного кода</strong></summary>

> Время обновления: 2026-01-23

| Функция                        | Путь к файлу                                                                                   | Номер строки    |
| --------------------------- | ------------------------------------------------------------------------------------------ | ------- |
| Точка входа в стратегию аутентификации Copilot        | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L481-L524) | 481-524 |
| Чтение конфигурации Fine-grained PAT  | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L122-L151) | 122-151 |
| Вызов публичного Billing API       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| Обмен OAuth Token           | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| Вызов внутреннего API (OAuth)     | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| Форматирование вывода публичного Billing API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L410-L468) | 410-468 |
| Определение типа CopilotAuthData    | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)    | 46-51   |
| Определение типа CopilotQuotaConfig | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)    | 66-73   |
| Определение перечисления CopilotTier       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L57)        | 57      |
| Квоты типа подписки Copilot       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L397-L403) | 397-403 |

**Ключевые константы**:
- `COPILOT_QUOTA_CONFIG_PATH = "~/.config/opencode/copilot-quota-token.json"`: путь к конфигурационному файлу Fine-grained PAT
- `COPILOT_PLAN_LIMITS`: лимиты ежемесячной квоты для разных типов подписки (строки 397-403)

**Ключевые функции**:
- `queryCopilotUsage(authData)`: основная функция запроса квоты Copilot, содержащая две стратегии аутентификации
- `readQuotaConfig()`: чтение конфигурационного файла Fine-grained PAT
- `fetchPublicBillingUsage(config)`: вызов публичного Billing API GitHub (с использованием PAT)
- `fetchCopilotUsage(authData)`: вызов внутреннего API GitHub (с использованием OAuth Token)
- `exchangeForCopilotToken(oauthToken)`: обмен OAuth Token на Copilot Session Token
- `formatPublicBillingUsage(data, tier)`: форматирование ответа публичного Billing API
- `formatCopilotUsage(data)`: форматирование ответа внутреннего API

**Сравнение процессов аутентификации**:

| Стратегия | Тип Token | Конечная точка API | Приоритет |
|------|-----------|---------|--------|
| Fine-grained PAT | Fine-grained PAT | `/users/{username}/settings/billing/premium_request/usage` | 1 (приоритет) |
| OAuth Token (кэш) | Copilot Session Token | `/copilot_internal/user` | 2 |
| OAuth Token (прямой) | GitHub OAuth Token | `/copilot_internal/user` | 3 |
| OAuth Token (обмен) | Copilot Session Token (после обмена) | `/copilot_internal/v2/token` | 4 |

</details>
