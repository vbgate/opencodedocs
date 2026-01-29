---
title: "Установка: Homebrew и Releases | Antigravity Tools"
sidebarTitle: "Установка за 5 минут"
subtitle: "Установка и обновление: лучшие пути установки для десктопа (brew / releases)"
description: "Изучите методы установки и обновления Antigravity Tools. Установка и обновление за 5 минут: обработка macOS quarantine и ошибок «поврежден файл», а также изучите входы обновления."
tags:
  - "установка"
  - "обновление"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 2
---

# Установка и обновление: лучшие пути установки для десктопа (brew / releases)

Если вы хотите быстро установить Antigravity Tools и пройти последующие уроки, этот урок только сделает одно: объяснит, как «установить + запустить + знать, как обновить».

## Чему вы научитесь

- Выберете правильный путь установки: приоритет Homebrew, затем GitHub Releases
- Обработаете распространенные блокировки macOS (quarantine / «поврежден файл»)
- Установите в специальных средах: Arch скрипт, Headless Xvfb, Docker
- Узнаете входы обновления для каждого метода установки и методы самопроверки

## Ваша текущая ситуация

- В документации слишком много способов установки, вы не знаете, какой выбрать
- После загрузки macOS вы не можете открыть файл, появляется сообщение «поврежден/невозможно открыть»
- Вы работаете на NAS/сервере, где нет десктопа и неудобно авторизоваться

## Когда использовать этот метод

- Это первый раз, когда вы устанавливаете Antigravity Tools
- Вы меняете компьютер/переустанавливаете систему и хотите восстановить среду
- После обновления версии вы столкнулись с системными блокировками или проблемами при запуске

## Основная идея

Рекомендуем вам выбрать в следующем порядке:

1. Десктоп (macOS/Linux): используйте Homebrew (самый быстрый и удобный для обновления)
2. Десктоп (все платформы): из GitHub Releases (подходит, если не хотите использовать brew или сеть ограничена)
3. Сервер/NAS: приоритет Docker; затем Headless Xvfb (похоже на «запуск десктопа на сервере»)

## Делайте вместе с нами

### Шаг 1: сначала выберите способ установки

**Почему**
Разные способы установки сильно различаются по «стоимости обновления/отката/устранения неполадок». Сначала выберите правильный путь, чтобы потом не наступали на грабли.

**Рекомендация**:

| Сценарий | Рекомендуемый способ установки |
|--- | ---|
| macOS / Linux десктоп | Homebrew (вариант A) |
| Windows десктоп | GitHub Releases (вариант B) |
| Arch Linux | Официальный скрипт (вариант Arch) |
| Удаленный сервер без десктопа | Docker (вариант D) или Headless Xvfb (вариант C-Headless) |

**Вы должны увидеть**: вы можете четко определить, к какой строке вы относитесь.

### Шаг 2: установите через Homebrew (macOS / Linux)

**Почему**
Homebrew — это путь «автоматическая загрузка и установка», обновление также самое удобное.

```bash
#1) Подпишитесь на репозиторий проекта
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

#2) Установите приложение
brew install --cask antigravity-tools
```

::: tip Разрешение macOS
README упоминает: если вы столкнулись с проблемами разрешения/изоляции в macOS, вы можете использовать:

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**Вы должны увидеть**: brew выводит сообщение об успешной установке, и приложение Antigravity Tools появляется в системе.

### Шаг 3: ручная установка через GitHub Releases (macOS / Windows / Linux)

**Почему**
Когда вы не используете Homebrew или хотите самостоятельно контролировать источник установки, этот путь наиболее прямой.

1. Откройте страницу Releases проекта: `https://github.com/lbjlaq/Antigravity-Manager/releases`
2. Выберите установочный пакет, соответствующий вашей системе:
   - macOS: `.dmg` (Apple Silicon / Intel)
   - Windows: `.msi` или портативная версия `.zip`
   - Linux: `.deb` или `AppImage`
3. Следуйте инструкциям установщика

**Вы должны увидеть**: после завершения установки вы можете найти приложение Antigravity Tools в списке системных приложений и запустить его.

### Шаг 4: обработка «поврежден файл, невозможно открыть» в macOS

**Почему**
README явно дает решение для этого сценария; если вы видите такое же сообщение, просто следуйте инструкциям.

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**Вы должны увидеть**: при повторном запуске приложения сообщение «поврежден/невозможно открыть» больше не появляется.

### Шаг 5: обновление (выберите по способу установки)

::: code-group

```bash [Homebrew]
#Перед обновлением сначала обновите информацию tap
brew update

#Обновите cask
brew upgrade --cask antigravity-tools
```

```text [Releases]
Загрузите последнюю версию установочного пакета (.dmg/.msi/.deb/AppImage) и переустановите в соответствии с инструкциями системы.
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

#README указывает, что при запуске контейнера будет автоматически скачиваться последний release; самый простой способ обновления — перезапуск контейнера
docker compose restart
```

:::

**Вы должны увидеть**: после завершения обновления приложение по-прежнему может нормально запускаться; если вы используете Docker/Headless, вы также можете продолжить обращаться к точке `/healthz`.

## Другие способы установки (специальные сценарии)

### Arch Linux: официальный скрипт установки в один клик

README предоставляет вход для скрипта Arch:

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details Что делает этот скрипт?
Он получит последний release через GitHub API, загрузит актив .deb, вычислит SHA256, затем сгенерирует PKGBUILD и установит через `makepkg -si`.
:::

### Удаленный сервер: Headless Xvfb

Если вам нужно запустить приложение GUI на Linux-сервере без интерфейса, проект предоставляет развертывание Xvfb:

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

После завершения установки, документация дает часто используемые команды самопроверки:

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/сервер: Docker (с VNC-браузером)

Развертывание Docker предоставит VNC-браузер (удобен для OAuth/авторизации), а также отобразит порт прокси:

```bash
cd deploy/docker
docker compose up -d
```

Вы должны иметь доступ: `http://localhost:6080/vnc_lite.html`.

## Предостережения

- Ошибка установки brew: сначала убедитесь, что вы установили Homebrew, затем повторите `brew tap` / `brew install --cask` из README.
- Невозможно открыть в macOS: сначала попробуйте `--no-quarantine`; если уже установлено, используйте `xattr` для очистки quarantine.
- Ограничения развертывания сервера: Headless Xvfb по сути «запуск десктопа с виртуальным дисплеем», использование ресурсов будет выше, чем у чисто серверного сервиса.

## Итог урока

- Для десктопа лучше всего: Homebrew (удобная установка и обновление)
- Без brew: используйте GitHub Releases напрямую
- Для сервера/NAS: приоритет Docker; при необходимости systemd — используйте Headless Xvfb

## Следующий урок

> Следующий урок мы проясним: **[Каталог данных, журналы, трей и автозапуск](/ru/lbjlaq/Antigravity-Manager/start/first-run-data/)**.
>
> Вы узнаете:
> - Где находятся файлы данных (accounts.json, logs/)
> - Как очистить журналы и настроить трей
> - Разница между автозапуском и автозапуском прокси

---

## Приложение: ссылки на исходный код

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходного кода</strong></summary>

> Дата обновления: 2026-01-23

| Тема | Путь к файлу | Строка |
|--- | --- | ---|
| Установка через Homebrew (tap + cask) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L112-L127) | 112-127 |
| Ручная загрузка через Releases (пакеты установки для всех платформ) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
| Вход скрипта Arch | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L134-L140) | 134-140 |
| Скрипт установки Arch (GitHub API + makepkg) | [`deploy/arch/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/arch/install.sh#L1-L56) | 1-56 |
| Вход установки Headless Xvfb (curl | sudo bash) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
| Команды развертывания/обновления/самопроверки для Headless Xvfb | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L1-L99) | 1-99 |
| Скрипт установки Headless Xvfb (systemd + конфиг по умолчанию 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
| Вход развертывания Docker (noVNC 6080 / прокси 8045) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L150-L166) | 150-166 |
| Описание развертывания Docker (noVNC 6080 / прокси 8045) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L1-L35) | 1-35 |
| Конфигурация портов/томов Docker (8045 + antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L25) | 1-25 |
|--- | --- | ---|

</details>
