---
title: "Ereignistypen: Wann OpenCode-Benachrichtigungen ausgelöst werden | opencode-notify"
sidebarTitle: "Wann werden Benachrichtigungen gesendet"
subtitle: "Ereignistypen: Wann OpenCode-Benachrichtigungen ausgelöst werden"
description: "Erfahren Sie mehr über die OpenCode-Ereignistypen, die vom opencode-notify-Plug-in überwacht werden, und verstehen Sie die Auslösebedingungen und Filterregeln für session.idle, session.error, permission.updated und tool.execute.before."
tags:
  - "Anhang"
  - "Ereignistypen"
  - "OpenCode"
prerequisite: []
order: 130
---

# Ereignistypen: Wann OpenCode-Benachrichtigungen ausgelöst werden

Diese Seite listet die **OpenCode-Ereignistypen** auf, die vom `opencode-notify`-Plug-in überwacht werden, sowie deren Auslösebedingungen. Das Plug-in überwacht vier Ereignisse: session.idle, session.error, permission.updated und tool.execute.before. Das Verständnis der Auslösezeitpunkte und Filterregeln dieser Ereignisse hilft Ihnen dabei, das Benachrichtigungsverhalten besser zu konfigurieren.

## Übersicht der Ereignistypen

| Ereignistyp | Auslösezeitpunkt | Benachrichtigungstitel | Standardton | Überprüfung der übergeordneten Sitzung | Überprüfung des Terminalfokus |
|--- | --- | --- | --- | --- | ---|
| `session.idle` | AI-Sitzung geht in den Leerlauf | "Ready for review" | Glass | ✅ | ✅ |
| `session.error` | Fehler bei der Ausführung der AI-Sitzung | "Something went wrong" | Basso | ✅ | ✅ |
| `permission.updated` | AI benötigt Benutzerautorisierung | "Waiting for you" | Submarine | ❌ | ✅ |
| tool.execute.before | AI stellt eine Frage (question-Tool) | "Question for you" | Submarine* | ❌ | ❌ |

> *Hinweis: Das question-Ereignis verwendet standardmäßig den permission-Ton, kann aber über die Konfiguration angepasst werden

## Detaillierte Ereignisbeschreibungen

### session.idle

**Auslösebedingung**: AI-Sitzung geht nach Abschluss der Aufgabe in den Leerlauf

**Benachrichtigungsinhalt**:
- Titel: `Ready for review`
- Nachricht: Sitzungstitel (maximal 50 Zeichen)

**Verarbeitungslogik**:
1. Prüfung, ob es sich um eine übergeordnete Sitzung handelt (wenn `notifyChildSessions=false`)
2. Prüfung, ob die Ruhezeit aktiv ist
3. Prüfung, ob das Terminal fokussiert ist (Benachrichtigung wird unterdrückt, wenn fokussiert)
4. Senden der nativen Benachrichtigung

**Quellcodeposition**: `src/notify.ts:249-284`

---

### session.error

**Auslösebedingung**: Fehler bei der Ausführung der AI-Sitzung

**Benachrichtigungsinhalt**:
- Titel: `Something went wrong`
- Nachricht: Fehlerzusammenfassung (maximal 100 Zeichen)

**Verarbeitungslogik**:
1. Prüfung, ob es sich um eine übergeordnete Sitzung handelt (wenn `notifyChildSessions=false`)
2. Prüfung, ob die Ruhezeit aktiv ist
3. Prüfung, ob das Terminal fokussiert ist (Benachrichtigung wird unterdrückt, wenn fokussiert)
4. Senden der nativen Benachrichtigung

**Quellcodeposition**: `src/notify.ts:286-313`

---

### permission.updated

**Auslösebedingung**: AI benötigt Benutzerautorisierung zur Ausführung einer Operation

**Benachrichtigungsinhalt**:
- Titel: `Waiting for you`
- Nachricht: `OpenCode needs your input`

**Verarbeitungslogik**:
1. **Keine Prüfung der übergeordneten Sitzung** (Berechtigungsanforderungen erfordern immer manuelle Bearbeitung)
2. Prüfung, ob die Ruhezeit aktiv ist
3. Prüfung, ob das Terminal fokussiert ist (Benachrichtigung wird unterdrückt, wenn fokussiert)
4. Senden der nativen Benachrichtigung

**Quellcodeposition**: `src/notify.ts:315-334`

---

### tool.execute.before

**Auslösebedingung**: Vor der Ausführung eines Tools durch die AI, wenn der Toolname `question` ist

**Benachrichtigungsinhalt**:
- Titel: `Question for you`
- Nachricht: `OpenCode needs your input`

**Verarbeitungslogik**:
1. **Keine Prüfung der übergeordneten Sitzung**
2. **Keine Prüfung des Terminalfokus** (Unterstützung von tmux-Workflows)
3. Prüfung, ob die Ruhezeit aktiv ist
4. Senden der nativen Benachrichtigung

**Besondere Hinweise**: Dieses Ereignis führt keine Fokusprüfung durch, damit Benachrichtigungen in tmux-Multi-Fenster-Workflows ordnungsgemäß empfangen werden können.

**Quellcodeposition**: `src/notify.ts:336-351`

## Auslösebedingungen und Filterregeln

### Prüfung der übergeordneten Sitzung

Standardmäßig benachrichtigt das Plug-in nur übergeordnete Sitzungen (Stammsitzungen), um zu vermeiden, dass Unteraufgaben eine große Anzahl von Benachrichtigungen erzeugen.

**Prüfungslogik**:
- Abrufen von Sitzungsinformationen über `client.session.get()`
- Wenn die Sitzung eine `parentID` hat, wird die Benachrichtigung übersprungen

**Konfigurationsoptionen**:
- `notifyChildSessions: false` (Standard) - Nur übergeordnete Sitzungen benachrichtigen
- `notifyChildSessions: true` - Alle Sitzungen benachrichtigen

**Anwendbare Ereignisse**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ❌ (keine Prüfung)
- `tool.execute.before` ❌ (keine Prüfung)

### Prüfung der Ruhezeit

Während der konfigurierten Ruhezeit werden keine Benachrichtigungen gesendet.

**Prüfungslogik**:
- Lesen von `quietHours.enabled`, `quietHours.start`, `quietHours.end`
- Unterstützung von Zeiträumen über Mitternacht hinaus (z. B. 22:00-08:00)

**Anwendbare Ereignisse**:
- Alle Ereignisse ✅

### Prüfung des Terminalfokus

Wenn der Benutzer das Terminal betrachtet, werden Benachrichtigungen unterdrückt, um doppelte Erinnerungen zu vermeiden.

**Prüfungslogik**:
- macOS: Abrufen des Namens der Front-App über `osascript`
- Vergleich von `frontmostApp` mit dem `processName` des Terminals

**Anwendbare Ereignisse**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ✅
- `tool.execute.before` ❌ (keine Prüfung, Unterstützung von tmux)

## Plattformunterschiede

| Funktion | macOS | Windows | Linux |
|--- | --- | --- | ---|
| Native Benachrichtigungen | ✅ | ✅ | ✅ |
| Terminalfokus-Erkennung | ✅ | ❌ | ❌ |
| Klick auf Benachrichtigung fokussiert Terminal | ✅ | ❌ | ❌ |
| Benutzerdefinierte Töne | ✅ | ❌ | ❌ |

## Konfigurationsauswirkungen

Das Benachrichtigungsververhalten kann über die Konfigurationsdatei angepasst werden:

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
  }
}
```

**Verwandte Tutorials**:
- [Konfigurationsreferenz](../../advanced/config-reference/)
- [Details zu Ruhezeiten](../../advanced/quiet-hours/)

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Konfigurationsdateibeispiel](../config-file-example/)** kennen.
>
> Sie werden lernen:
> - Vollständige Konfigurationsdateivorlage
> - Detaillierte Kommentare zu allen Konfigurationsfeldern
> - Erläuterung der Standardwerte der Konfigurationsdatei

---

## Anhang: Quellcodereferenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-27

| Ereignistyp | Dateipfad | Zeilennummer | Verarbeitungs Funktion |
|--- | --- | --- | ---|
| session.idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 | `handleSessionIdle` |
| session.error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 | `handleSessionError` |
| permission.updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 | `handlePermissionUpdated` |
| tool.execute.before | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 | `handleQuestionAsked` |
| Ereignis-Listener-Setup | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L367-L402) | 367-402 | `NotifyPlugin` |

**Wichtige Konstanten**:
- `DEFAULT_CONFIG` (L56-68): Standardkonfiguration, einschließlich Toneinstellungen und Ruhezeit-Einstellungen
- `TERMINAL_PROCESS_NAMES` (L71-84): Zuordnung von Terminalnamen zu macOS-Prozessnamen

**Wichtige Funktionen**:
- `sendNotification()` (L227-243): Sendet native Benachrichtigungen, verarbeitet macOS-Fokusfunktion
- `isParentSession()` (L205-214): Prüft, ob es sich um eine übergeordnete Sitzung handelt
- `isQuietHours()` (L181-199): Prüft, ob die Ruhezeit aktiv ist
- `isTerminalFocused()` (L166-175): Prüft, ob das Terminal fokussiert ist (nur macOS)

</details>
