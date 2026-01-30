---
title: "Konfigurationsbeispiele: notifyChildSessions und sounds erklärt | opencode-notify Tutorial"
sidebarTitle: "Benutzerdefinierte Konfigurationsdatei"
subtitle: "Konfigurationsbeispiele: notifyChildSessions und sounds erklärt"
description: "Vollständiges Konfigurationsbeispiel für opencode-notify. Lernen Sie alle Konfigurationsfelder wie notifyChildSessions, sounds, quietHours und terminal mit detaillierten Erklärungen, Standardwerten, Minimalkonfigurationsbeispielen und der vollständigen Liste der macOS-Sounds."
tags:
  - "Konfiguration"
  - "Beispiel"
  - "Anhang"
order: 140
---

# Konfigurationsbeispiele

## Vollständiges Konfigurationsbeispiel

Speichern Sie den folgenden Inhalt in `~/.config/opencode/kdco-notify.json`:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "Ghostty"
}
```

## Felderklärung

### notifyChildSessions

- **Typ**: boolean
- **Standardwert**: `false`
- **Beschreibung**: Benachrichtigungen für Child-Sessions (Child-Tasks)

Standardmäßig benachrichtigt das Plugin nur die Parent-Session, um Benachrichtigungsflut von Child-Tasks zu vermeiden. Wenn Sie alle Child-Task-Status verfolgen möchten, setzen Sie den Wert auf `true`.

```json
{
  "notifyChildSessions": false  // Nur Parent-Session benachrichtigen (empfohlen)
}
```

### sounds

Soundkonfiguration, funktioniert nur auf macOS.

#### sounds.idle

- **Typ**: string
- **Standardwert**: `"Glass"`
- **Beschreibung**: Sound bei Aufgabenabschluss

Wird abgespielt, wenn die AI-Session in den Idle-Status wechselt (Aufgabe abgeschlossen).

#### sounds.error

- **Typ**: string
- **Standardwert**: `"Basso"`
- **Beschreibung**: Sound bei Fehlern

Wird abgespielt, wenn die AI-Session einen Fehler ausführt.

#### sounds.permission

- **Typ**: string
- **Standardwert**: `"Submarine"`
- **Beschreibung**: Sound bei Berechtigungsanfragen

Wird abgespielt, wenn die AI eine Benutzerautorisierung für eine Aktion benötigt.

#### sounds.question

- **Typ**: string (optional)
- **Standardwert**: nicht gesetzt (verwendet permission-Sound)
- **Beschreibung**: Sound bei Fragen

Wird abgespielt, wenn die AI dem Benutzer eine Frage stellt. Wenn nicht gesetzt, wird der `permission`-Sound verwendet.

### quietHours

Stummzeit-Konfiguration, um Benachrichtigungen in einem bestimmten Zeitraum zu vermeiden.

#### quietHours.enabled

- **Typ**: boolean
- **Standardwert**: `false`
- **Beschreibung**: Stummzeit aktivieren

#### quietHours.start

- **Typ**: string
- **Standardwert**: `"22:00"`
- **Beschreibung**: Startzeit der Stummzeit (24-Stunden-Format, HH:MM)

#### quietHours.end

- **Typ**: string
- **Standardwert**: `"08:00"`
- **Beschreibung**: Endzeit der Stummzeit (24-Stunden-Format, HH:MM)

Unterstützt Zeiträume über Mitternacht, z.B. `"22:00"` bis `"08:00"` bedeutet keine Benachrichtigungen von 22:00 Uhr bis 08:00 Uhr am nächsten Tag.

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### terminal

- **Typ**: string (optional)
- **Standardwert**: nicht gesetzt (automatische Erkennung)
- **Beschreibung**: Terminaltyp manuell festlegen, überschreibt die automatische Erkennung

Wenn die automatische Erkennung fehlschlägt oder Sie manuell festlegen möchten, können Sie Ihren Terminalnamen setzen.

```json
{
  "terminal": "Ghostty"  // oder "iTerm", "Kitty", "WezTerm" usw.
}
```

## macOS verfügbare Sounds

Dies sind die integrierten Benachrichtigungstöne von macOS, die für die `sounds`-Konfiguration verwendet werden können:

- Basso
- Blow
- Bottle
- Frog
- Funk
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## Minimalkonfigurationsbeispiel

Wenn Sie nur wenige Einstellungen ändern möchten, können Sie nur die gewünschten Felder einfügen, alle anderen Felder verwenden die Standardwerte:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## Plugin deaktivieren

Um das Plugin vorübergehend zu deaktivieren, löschen Sie einfach die Konfigurationsdatei. Das Plugin wird dann auf die Standardkonfiguration zurückgesetzt.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir das **[Änderungsprotokoll](../changelog/release-notes/)**.
>
> Sie werden erfahren:
> - Versionshistorie und wichtige Änderungen
> - Neue Funktionen und Verbesserungsprotokolle
