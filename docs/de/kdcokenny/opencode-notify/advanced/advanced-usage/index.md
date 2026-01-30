---
title: "Fortgeschrittene Nutzung: Konfigurationstipps und Best Practices | opencode-notify Tutorial"
sidebarTitle: "Benachrichtigungen in 5 Min. optimieren"
subtitle: "Fortgeschrittene Nutzung: Konfigurationstipps und Best Practices | opencode-notify Tutorial"
description: "Lernen Sie fortgeschrittene Konfigurationstechniken für opencode-notify, einschließlich Parent-Session-Filterung, Sound-Anpassung, Terminal-Override-Einstellungen und temporärer Stummschaltung."
tags:
  - "Konfiguration"
  - "Best Practices"
  - "Sounds"
prerequisite:
  - "start-quick-start"
  - "advanced-config-reference"
order: 100
---

# Fortgeschrittene Nutzung: Konfigurationstipps und Best Practices

## Was Sie lernen werden

- Verstehen, warum standardmäßig nur Parent-Sessions benachrichtigt werden, um Benachrichtigungsrauschen zu reduzieren
- macOS-Benachrichtigungstöne anpassen, um verschiedene Ereignistypen zu unterscheiden
- Terminal-Typ manuell festlegen, um Probleme bei der automatischen Erkennung zu beheben
- Temporäre Stummschaltung einrichten, um Störungen während Meetings oder Fokuszeiten zu vermeiden
- Benachrichtigungsstrategie optimieren, um Aktualität und Störungsgrad auszubalancieren

## Ihre aktuelle Herausforderung

Das Benachrichtigungs-Plugin ist zwar praktisch, aber die Standardkonfiguration passt möglicherweise nicht zu den Arbeitsgewohnheiten aller:

- Sie möchten alle KI-Unteraufgaben verfolgen, aber standardmäßig werden nur Parent-Sessions benachrichtigt
- Sie verwenden ein weniger verbreitetes Terminal, und die automatische Erkennung schlägt fehl
- Während Meetings möchten Sie vorübergehend stummschalten, ohne jedes Mal die Konfigurationsdatei zu ändern
- Verschiedene Ereignistypen verwenden denselben Sound, sodass Sie nicht unterscheiden können, ob eine Aufgabe abgeschlossen wurde oder ein Fehler aufgetreten ist

## Wann Sie diese Techniken anwenden sollten

Wenn Sie bereits mit der grundlegenden Plugin-Nutzung vertraut sind und Ihr Benachrichtigungserlebnis an Ihren persönlichen Workflow anpassen möchten.

---

## Kernkonzept

Die Standardkonfiguration des Benachrichtigungs-Plugins wurde sorgfältig entwickelt, aber Sie können das Verhalten über die Konfigurationsdatei anpassen. Das Kernprinzip lautet:

**Rauschen reduzieren, Mehrwert steigern**

- **Parent-Session-Filterung**: Nur Hauptaufgaben benachrichtigen, interne KI-Unteraufgaben ignorieren
- **Fokus-Erkennung**: Keine Benachrichtigung bei aktivem Terminal, um doppelte Erinnerungen zu vermeiden
- **Batch-Benachrichtigungen**: Benachrichtigungen zusammenfassen, wenn mehrere Aufgaben gleichzeitig abgeschlossen werden

::: info Hinweis
Alle Konfigurationsoptionen werden in der [Konfigurationsreferenz](../config-reference/) ausführlich beschrieben. Diese Lektion konzentriert sich auf praktische Nutzungstipps und Best Practices.
:::

---

## 🎒 Vorbereitung

Stellen Sie sicher, dass Sie den [Schnellstart](../../start/quick-start/) abgeschlossen und Ihre erste Benachrichtigung erfolgreich erhalten haben.

---

## Schritt-für-Schritt-Anleitung

### Schritt 1: Parent-Session-Filterung verstehen

**Warum**

OpenCode-Sessions haben eine Baumstruktur: Eine Parent-Session kann mehrere Child-Sessions haben. Standardmäßig benachrichtigt das Plugin nur bei Abschluss der Parent-Session, um Benachrichtigungsrauschen durch Unteraufgaben zu vermeiden.

**Konfiguration anzeigen**

Bearbeiten Sie die Konfigurationsdatei:

```bash
# macOS/Linux
~/.config/opencode/kdco-notify.json

# Windows
%APPDATA%\opencode\kdco-notify.json
```

```json
{
  "notifyChildSessions": false  // ← Standard: false
}
```

**Was Sie sehen sollten**:
- `notifyChildSessions: false` bedeutet, dass nur Root-Sessions benachrichtigt werden
- Interne Tool-Aufrufe der KI lösen keine Benachrichtigungen aus

**Wann Child-Session-Benachrichtigungen aktivieren**

Wenn Sie jede Unteraufgabe verfolgen müssen (z.B. beim Debuggen mehrstufiger Workflows), setzen Sie den Wert auf `true`:

```json
{
  "notifyChildSessions": true  // ← Nach Aktivierung wird jede Unteraufgabe benachrichtigt
}
```

::: warning Achtung
Das Aktivieren von Child-Session-Benachrichtigungen erhöht die Benachrichtigungshäufigkeit erheblich. Verwenden Sie diese Option mit Bedacht.
:::

---

### Schritt 2: macOS-Benachrichtigungstöne anpassen

**Warum**

Verschiedene Sounds für verschiedene Ereignistypen ermöglichen es Ihnen, ohne Hinschauen zu wissen, was passiert ist.

**Verfügbare Sounds anzeigen**

macOS bietet 14 integrierte Sounds:

| Sound-Name | Anwendungsfall | Stil |
|--- | --- | ---|
| Glass | Aufgabe abgeschlossen (Standard) | Klar |
| Basso | Fehler (Standard) | Tief |
| Submarine | Berechtigungsanfrage (Standard) | Sanft |
| Bottle | Besondere Ereignisse | Leicht |
| Ping | Allgemeine Erinnerung | Schlicht |
| Pop | Lockere Ereignisse | Lebhaft |
| Purr | Erfolgsereignisse | Mild |
| Blow | Warnung | Dringend |
| Funk | Besondere Markierung | Einzigartig |
| Frog | Erinnerung | Laut |
| Hero | Wichtige Ereignisse | Großartig |
| Morse | Benachrichtigung | Rhythmisch |
| Sosumi | Systemhinweis | Klassisch |
| Tink | Abschluss | Leicht |

**Sounds anpassen**

Ändern Sie den `sounds`-Abschnitt in der Konfiguration:

```json
{
  "sounds": {
    "idle": "Ping",        // Aufgabe abgeschlossen
    "error": "Blow",       // Fehler (dringender)
    "permission": "Pop",   // Berechtigungsanfrage (leichter)
    "question": "Tink"     // Frage (optional, verwendet standardmäßig den permission-Sound)
  }
}
```

**Was Sie sehen sollten**:
- Nach der Änderung spielen verschiedene Ereignistypen entsprechende Sounds ab
- Wenn `sounds.question` nicht gesetzt ist, wird der Sound von `sounds.permission` verwendet

::: tip Tipp
Sounds funktionieren nur unter macOS. Windows und Linux verwenden die Standard-Systembenachrichtigungstöne.
:::

---

### Schritt 3: Terminal-Typ manuell festlegen

**Warum**

Die `detect-terminal`-Bibliothek unterstützt über 37 Terminals, aber weniger verbreitete Terminals oder benutzerdefinierte Builds werden möglicherweise nicht erkannt.

**Aktuell erkanntes Terminal überprüfen**

Es gibt derzeit keine direkte Möglichkeit, das Erkennungsergebnis anzuzeigen, aber Sie können es anhand der Logs beurteilen:

```bash
# Die OpenCode-UI zeigt Plugin-Startlogs an
```

Wenn Sie etwas wie "Terminal detection failed" sehen oder die Benachrichtigung nicht fokussiert werden kann, müssen Sie möglicherweise manuell festlegen.

**Terminal manuell festlegen**

Fügen Sie das `terminal`-Feld in der Konfiguration hinzu:

```json
{
  "terminal": "wezterm"  // Verwenden Sie den Terminal-Namen in Kleinbuchstaben
}
```

**Unterstützte Terminal-Namen**

Gängige Terminal-Namen (Groß-/Kleinschreibung wird nicht unterschieden):

| Terminal | Konfigurationswert |
|--- | ---|
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm"` oder `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` oder `"apple_terminal"` |
| Hyper | `"hyper"` |
| VS Code Terminal | `"code"` oder `"code-insiders"` |

**Was Sie sehen sollten**:
- Nach manueller Festlegung funktionieren macOS-Fokus-Erkennung und Klick-zum-Fokussieren korrekt
- Bei ungültiger Angabe schlägt das Plugin stillschweigend fehl und fällt auf automatische Erkennung zurück

---

### Schritt 4: Benachrichtigungen temporär stummschalten

**Warum**

Während Meetings, Code-Reviews oder Fokuszeiten möchten Sie möglicherweise vorübergehend keine Benachrichtigungen erhalten.

**Ruhezeiten verwenden**

Wenn Sie täglich zu festen Zeiten (z.B. nachts) nicht gestört werden möchten, konfigurieren Sie Ruhezeiten:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",  // 22 Uhr abends
    "end": "08:00"     // 8 Uhr morgens am nächsten Tag
  }
}
```

**Unterstützung für Zeiträume über Mitternacht**

Ruhezeiten können über Mitternacht hinausgehen (z.B. 22:00-08:00):

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"     // 22:00 - 08:00 am nächsten Tag
  }
}
```

**Was Sie sehen sollten**:
- Während der Ruhezeiten werden keine Benachrichtigungen für alle Ereignisse gesendet
- Außerhalb der Ruhezeiten werden Benachrichtigungen normal fortgesetzt

::: tip Tipp
Das Zeitformat muss `HH:MM` (24-Stunden-Format) sein, z.B. `"22:30"`.
:::

---

### Schritt 5: Benachrichtigungsstrategie ausbalancieren

**Warum**

Die Standardkonfiguration wurde bereits optimiert, aber Sie müssen sie möglicherweise an Ihren Workflow anpassen.

**Zusammenfassung der Standardstrategie**

| Konfigurationsoption | Standardwert | Effekt |
|--- | --- | ---|
| `notifyChildSessions` | `false` | Nur Parent-Sessions benachrichtigen |
| `quietHours.enabled` | `false` | Ruhezeiten nicht aktiviert |

::: info Hinweis
Die Fokus-Erkennung (keine Benachrichtigung bei aktivem Terminal) ist fest aktiviert und kann nicht über die Konfiguration deaktiviert werden.
:::

**Empfohlene Konfigurationskombinationen**

**Szenario 1: Minimale Störung (Standard)**

```json
{
  "notifyChildSessions": false
}
```

**Szenario 2: Alle Aufgaben verfolgen**

```json
{
  "notifyChildSessions": true
}
```

::: warning Achtung
Dies erhöht die Benachrichtigungshäufigkeit erheblich und eignet sich für Szenarien, die eine feinkörnige Überwachung erfordern.
:::

**Szenario 3: Nächtliche Stummschaltung**

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Was Sie sehen sollten**:
- Je nach Szenario unterscheidet sich das Benachrichtigungsverhalten erheblich
- Passen Sie schrittweise an, um die für Sie optimale Konfiguration zu finden

---

## Checkliste ✅

Überprüfen Sie nach Abschluss der Konfiguration Folgendes:

| Prüfpunkt | Überprüfungsmethode |
|--- | ---|
| Parent-Session-Filterung | Lösen Sie eine KI-Aufgabe mit Unteraufgaben aus und erhalten Sie nur eine "Ready for review"-Benachrichtigung |
| Sound-Anpassung | Lösen Sie Aufgabenabschluss, Fehler und Berechtigungsanfrage aus und hören Sie verschiedene Sounds |
| Terminal-Override | Unter macOS: Klicken Sie auf die Benachrichtigung und das Terminal-Fenster wird korrekt in den Vordergrund gebracht |
| Ruhezeiten | Lösen Sie während der Ruhezeiten ein Ereignis aus und erhalten Sie keine Benachrichtigung |

---

## Häufige Probleme

### Konfigurationsänderungen werden nicht wirksam

**Problem**: Nach Änderung der Konfigurationsdatei ändert sich das Benachrichtigungsverhalten nicht.

**Ursache**: OpenCode muss möglicherweise das Plugin oder OpenCode selbst neu starten.

**Lösung**: Starten Sie OpenCode CLI oder OpenCode UI neu.

---

### Sound wird nicht abgespielt

**Problem**: Sie haben einen benutzerdefinierten Sound eingestellt, aber es wird immer noch der Standard-Sound abgespielt.

**Ursache**:
- Sound-Name falsch geschrieben
- Sie verwenden nicht macOS

**Lösung**:
- Überprüfen Sie, ob der Sound-Name in der unterstützten Liste enthalten ist (Groß-/Kleinschreibung beachten)
- Bestätigen Sie, dass Sie macOS verwenden

---

### Terminal-Override funktioniert nicht

**Problem**: Sie haben das `terminal`-Feld gesetzt, aber das Klicken auf die Benachrichtigung fokussiert das Terminal nicht.

**Ursache**:
- Terminal-Name falsch
- Terminal-Prozessname stimmt nicht mit dem Konfigurationswert überein

**Lösung**:
- Versuchen Sie den Namen in Kleinbuchstaben
- Siehe Liste der [unterstützten Terminals](../../platforms/terminals/)

---

## Zusammenfassung

In dieser Lektion haben Sie die fortgeschrittene Nutzung und Best Practices von opencode-notify gelernt:

- **Parent-Session-Filterung**: Standardmäßig werden nur Root-Sessions benachrichtigt, um Unteraufgaben-Rauschen zu vermeiden
- **Sound-Anpassung**: macOS bietet 14 anpassbare Sounds zur Unterscheidung von Ereignistypen
- **Terminal-Override**: Terminal-Typ manuell festlegen, um Probleme bei der automatischen Erkennung zu beheben
- **Temporäre Stummschaltung**: Ruhezeiten über `quietHours` einrichten
- **Strategie-Balance**: Konfiguration an den Workflow anpassen, um Aktualität und Störungsgrad auszubalancieren

**Kernprinzip**: Rauschen reduzieren, Mehrwert steigern. Die Standardkonfiguration wurde bereits optimiert und muss in den meisten Fällen nicht geändert werden.

---

## Vorschau der nächsten Lektion

> In der nächsten Lektion lernen wir **[Fehlerbehebung](../../faq/troubleshooting/)**.
>
> Sie werden lernen:
> - Was tun, wenn Benachrichtigungen nicht angezeigt werden
> - Wie man Probleme bei der Fokus-Erkennung diagnostiziert
> - Interpretation häufiger Fehlermeldungen
> - Plattformspezifische Problemlösungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-27

| Funktion | Dateipfad | Zeilen |
|--- | --- | ---|
| Parent-Session-Erkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| Konfigurations-Schema | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L68) | 30-68 |
| Standardkonfiguration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| macOS Sound-Liste | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
</details>
 
**Wichtige Konstanten**:
- `DEFAULT_CONFIG`: Standard-Konfigurationswerte
- `TERMINAL_PROCESS_NAMES`: Zuordnungstabelle von Terminal-Namen zu macOS-Prozessnamen

**Wichtige Funktionen**:
- `isParentSession()`: Prüft, ob eine Session eine Parent-Session ist
- `loadConfig()`: Lädt und führt Benutzerkonfiguration zusammen
