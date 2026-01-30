---
title: "macOS-Plattformfunktionen: Fokuserkennung, Klick-zum-Fokussieren und Benutzerdefinierte Sounds | opencode-notify"
sidebarTitle: "Klick auf Benachrichtigung zum Terminal"
subtitle: "macOS-Plattformfunktionen"
description: "Lernen Sie die exklusiven Funktionen von opencode-notify auf macOS kennen: Intelligente Fokuserkennung zur Vermeidung doppelter Benachrichtigungen, automatisches Terminal-Fokussieren beim Klicken auf Benachrichtigungen und 12 integrierte Sounds zur Anpassung. Dieses Tutorial erklärt detailliert Konfigurationsmethoden, verfügbare Soundlisten und praktische Tipps, damit Sie die nativen macOS-Benachrichtigungsfunktionen optimal nutzen und Ihre Produktivität steigern können."
tags:
- "Plattformfunktionen"
- "macOS"
- "Fokuserkennung"
prerequisite:
- "start-quick-start"
order: 30
---

# macOS-Plattformfunktionen

## Was Sie nach diesem Tutorial können

- ✅ Intelligente Fokuserkennung konfigurieren, damit das Plugin weiß, wenn Sie das Terminal betrachten
- ✅ Automatisches Fokussieren des Terminal-Fensters beim Klicken auf Benachrichtigungen
- ✅ Benutzerdefinierte Sounds für verschiedene Ereignisse festlegen
- ✅ Die einzigartigen Vorteile und Einschränkungen der macOS-Plattform verstehen

## Ihre aktuelle Situation

Sie wechseln beim Verwenden von OpenCode häufig zwischen Fenstern: Die KI führt Aufgaben im Hintergrund aus, Sie wechseln zum Browser, um Informationen zu recherchieren, und müssen alle paar Sekunden zurückwechseln, um zu prüfen: Ist die Aufgabe abgeschlossen? Gab es einen Fehler? Oder wartet die KI auf Ihre Eingabe?

Eine native Desktop-Benachrichtigung wäre ideal – wie bei einer WeChat-Nachricht, die Sie benachrichtigt, wenn die KI eine Aufgabe abgeschlossen hat oder Ihre Aufmerksamkeit benötigt.

## Wann Sie diese Funktionen nutzen sollten

- **Sie verwenden OpenCode auf macOS** – Der Inhalt dieser Lektion gilt nur für macOS
- **Sie möchten Ihren Workflow optimieren** – Vermeiden Sie häufiges Wechseln zwischen Fenstern, um den KI-Status zu prüfen
- **Sie möchten ein besseres Benachrichtigungserlebnis** – Nutzen Sie die Vorteile nativer macOS-Benachrichtigungen

::: info Warum ist macOS leistungsfähiger?
Die macOS-Plattform bietet vollständige Benachrichtigungsfunktionen: Fokuserkennung, Klick-zum-Fokussieren, benutzerdefinierte Sounds. Windows und Linux unterstützen derzeit nur grundlegende native Benachrichtigungsfunktionen.
:::

## 🎒 Vorbereitung vor dem Start

Bevor Sie beginnen, stellen Sie sicher, dass Sie Folgendes abgeschlossen haben:

::: warning Voraussetzungsprüfung
- [ ] Das Tutorial [Schnellstart](../../start/quick-start/) wurde abgeschlossen
- [ ] Das Plugin ist installiert und funktioniert ordnungsgemäß
- [ ] Sie verwenden ein macOS-System
:::

## Kernkonzept

Das vollständige Benachrichtigungserlebnis auf macOS basiert auf drei Schlüsselfunktionen:

### 1. Intelligente Fokuserkennung

Das Plugin erkennt, ob Sie gerade das Terminal-Fenster betrachten. Wenn Sie die Ausgabe der KI überprüfen, werden keine Benachrichtigungen gesendet, die Sie stören könnten. Benachrichtigungen werden nur gesendet, wenn Sie zu einer anderen Anwendung wechseln.

**Implementierungsprinzip**: Durch den macOS-Systemdienst `osascript` wird der Prozessname der aktuellen Vordergrundanwendung abgefragt und mit dem Prozessnamen Ihres Terminals verglichen.

### 2. Klick auf Benachrichtigung fokussiert Terminal

Nach Erhalt einer Benachrichtigung können Sie direkt auf die Benachrichtigungskarte klicken, und das Terminal-Fenster wird automatisch in den Vordergrund gebracht. Sie können sofort mit der Arbeit fortfahren.

**Implementierungsprinzip**: Das macOS Notification Center unterstützt die Option `activate`. Wenn die Bundle-ID der Anwendung übergeben wird, wird beim Klicken auf die Benachrichtigung automatisch fokussiert.

### 3. Benutzerdefinierte Sounds

Legen Sie verschiedene Sounds für verschiedene Ereignistypen fest: Ein klarer Sound für abgeschlossene Aufgaben, ein tiefer Sound für Fehler – so können Sie die Situation auch ohne Betrachten der Benachrichtigung grob einschätzen.

**Implementierungsprinzip**: Nutzen Sie die 14 integrierten Standard-Sounds von macOS (z.B. Glass, Basso, Submarine). Geben Sie sie einfach im `sounds`-Feld der Konfigurationsdatei an.

::: tip Zusammenspiel der drei Funktionen
Fokuserkennung verhindert Störungen → Klick auf Benachrichtigung ermöglicht schnelle Rückkehr → Sounds ermöglichen schnelle Unterscheidung von Ereignistypen
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Automatische Terminal-Erkennung überprüfen

Das Plugin erkennt Ihren Terminal-Emulator beim Start automatisch. Lassen Sie uns überprüfen, ob die Erkennung korrekt ist.

**Warum**

Das Plugin muss wissen, welches Terminal Sie verwenden, um die Funktionen Fokuserkennung und Klick-zum-Fokussieren zu implementieren.

**Vorgehen**

1. Öffnen Sie Ihr OpenCode-Konfigurationsverzeichnis:
```bash
ls ~/.config/opencode/
```

2. Wenn Sie bereits eine Konfigurationsdatei `kdco-notify.json` erstellt haben, prüfen Sie, ob das Feld `terminal` vorhanden ist:
```bash
cat ~/.config/opencode/kdco-notify.json
```

3. Wenn das Feld `terminal` in der Konfigurationsdatei fehlt, verwendet das Plugin die automatische Erkennung.

**Was Sie sehen sollten**

Wenn das Feld `terminal` in der Konfigurationsdatei fehlt, erkennt das Plugin automatisch. Unterstützte Terminals umfassen:
- **Häufige Terminals**: Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- **System-Terminals**: Das mit macOS gelieferte Terminal.app
- **Andere Terminals**: Hyper, Warp, VS Code integriertes Terminal usw.

::: info Unterstützung für 37+ Terminals
Das Plugin verwendet die Bibliothek `detect-terminal`, die 37+ Terminal-Emulatoren unterstützt. Wenn Ihr Terminal nicht in der häufigen Liste enthalten ist, wird versucht, es automatisch zu erkennen.
:::

### Schritt 2: Benutzerdefinierte Sounds konfigurieren

macOS bietet 14 integrierte Sounds, die Sie verschiedenen Ereignissen zuweisen können.

**Warum**

Verschiedene Sounds ermöglichen es Ihnen, grob zu verstehen, was passiert ist, ohne die Benachrichtigung zu betrachten: Aufgabe abgeschlossen oder Fehler aufgetreten, KI wartet oder hat gerade eine Aufgabe abgeschlossen.

**Vorgehen**

1. Öffnen oder erstellen Sie die Konfigurationsdatei:
```bash
nano ~/.config/opencode/kdco-notify.json
```

2. Fügen Sie die `sounds`-Konfiguration hinzu oder ändern Sie sie:

```json
{
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

3. Speichern und beenden (Ctrl+O, Enter, Ctrl+X)

**Was Sie sehen sollten**

Das Feld `sounds` in der Konfigurationsdatei hat vier Optionen:

| Feld | Funktion | Standardwert | Empfohlene Einstellung |
| --- | --- | --- | --- |
| `idle` | Sound für abgeschlossene Aufgaben | Glass | Glass (klar) |
| `error` | Sound für Fehlerbenachrichtigungen | Basso | Basso (tief) |
| `permission` | Sound für Berechtigungsanfragen | Submarine | Submarine (Erinnerung) |
| `question` | Sound für KI-Fragen (optional) | permission | Purr (sanft) |

::: tip Empfohlene Kombination
Diese Standardkombination ist intuitiv: Ein leichter Sound für Abschluss, ein Warnsound für Fehler, ein Erinnerungssound für Berechtigungsanfragen.
:::

### Schritt 3: Verfügbare Soundliste kennenlernen

macOS verfügt über 14 integrierte Sounds, die Sie beliebig kombinieren können.

**Warum**

Das Kennen aller verfügbaren Sounds hilft Ihnen, die für Ihre Arbeitsgewohnheiten am besten geeignete Kombination zu finden.

**Verfügbare Sounds**

| Sound-Name | Klangeigenschaften | Anwendungsszenario |
| --- | --- | --- |
| Glass | Leicht, klar | Aufgabe abgeschlossen |
| Basso | Tief, warnend | Fehlerbenachrichtigung |
| Submarine | Erinnernd, sanft | Berechtigungsanfrage |
| Blow | Kraftvoll | Wichtiges Ereignis |
| Bottle | Klar | Unteraufgabe abgeschlossen |
| Frog | Locker | Informelle Erinnerung |
| Funk | Rhythmisch | Mehrere Aufgaben abgeschlossen |
| Hero | Erhaben | Meilenstein erreicht |
| Morse | Morse-Code | Debugging-bezogen |
| Ping | Klar | Leichte Erinnerung |
| Pop | Kurz | Schnelle Aufgabe |
| Purr | Sanft | Unaufdringliche Erinnerung |
| Sosumi | Einzigartig | Spezielles Ereignis |
| Tink | Hell | Kleine Aufgabe abgeschlossen |

::: tip Sound-Erkennung
Probieren Sie nach der Konfiguration verschiedene Soundkombinationen aus, um die für Ihren Workflow am besten geeignete Konfiguration zu finden.
:::

### Schritt 4: Klick-zum-Fokussieren-Funktion testen

Nach dem Klicken auf eine Benachrichtigung wird das Terminal-Fenster automatisch in den Vordergrund gebracht. Dies ist eine exklusive Funktion von macOS.

**Warum**

Wenn Sie eine Benachrichtigung erhalten, müssen Sie nicht manuell zum Terminal wechseln und das Fenster suchen. Ein Klick auf die Benachrichtigung bringt Sie direkt zurück zur Arbeit.

**Vorgehen**

1. Stellen Sie sicher, dass OpenCode läuft, und starten Sie eine KI-Aufgabe
2. Wechseln Sie zu einer anderen Anwendung (z.B. Browser)
3. Warten Sie, bis die KI-Aufgabe abgeschlossen ist. Sie erhalten die Benachrichtigung "Ready for review"
4. Klicken Sie auf die Benachrichtigungskarte

**Was Sie sehen sollten**

- Die Benachrichtigung verschwindet
- Das Terminal-Fenster wird automatisch in den Vordergrund gebracht und erhält den Fokus
- Sie können sofort die Ausgabe der KI überprüfen

::: info Fokussierungsprinzip
Das Plugin erhält dynamisch die Bundle-ID der Terminal-Anwendung über osascript und übergibt dann die Option `activate` beim Senden der Benachrichtigung. Das macOS Notification Center aktiviert beim Klicken auf die Benachrichtigung automatisch die entsprechende Anwendung.
:::

### Schritt 5: Fokuserkennungsfunktion überprüfen

Wenn Sie gerade das Terminal betrachten, erhalten Sie keine Benachrichtigungen. Dies verhindert doppelte Erinnerungen.

**Warum**

Wenn Sie bereits das Terminal betrachten, sind Benachrichtigungen überflüssig. Sie sind nur sinnvoll, wenn Sie zu einer anderen Anwendung gewechselt haben.

**Vorgehen**

1. Öffnen Sie OpenCode und starten Sie eine KI-Aufgabe
2. Halten Sie das Terminal-Fenster im Vordergrund (nicht wechseln)
3. Warten Sie, bis die Aufgabe abgeschlossen ist

**Was Sie sehen sollten**

- Sie erhalten keine "Ready for review"-Benachrichtigung
- Im Terminal wird angezeigt, dass die Aufgabe abgeschlossen ist

**Probieren Sie als Nächstes**:

1. Starten Sie eine weitere KI-Aufgabe
2. Wechseln Sie zum Browser oder einer anderen Anwendung
3. Warten Sie, bis die Aufgabe abgeschlossen ist

**Was Sie sehen sollten**

- Sie erhalten die "Ready for review"-Benachrichtigung
- Der konfigurierte Sound wird abgespielt (Standard: Glass)

::: tip Die Intelligenz der Fokuserkennung
Das Plugin weiß, wann Sie das Terminal betrachten und wann nicht. So verpassen Sie keine wichtigen Erinnerungen und werden nicht durch doppelte Benachrichtigungen gestört.
:::

## Kontrollpunkt ✅

### Konfigurationsprüfung

- [ ] Konfigurationsdatei `~/.config/opencode/kdco-notify.json` existiert
- [ ] Feld `sounds` ist konfiguriert (enthält mindestens idle, error, permission)
- [ ] Feld `terminal` ist nicht gesetzt (verwendet automatische Erkennung)

### Funktionsprüfung

- [ ] Nach Abschluss einer KI-Aufgabe wird eine Benachrichtigung empfangen
- [ ] Nach Klicken auf die Benachrichtigung wird das Terminal-Fenster in den Vordergrund gebracht
- [ ] Wenn das Terminal-Fenster im Vordergrund ist, werden keine doppelten Benachrichtigungen empfangen
- [ ] Verschiedene Ereignistypen spielen verschiedene Sounds ab

::: danger Fokuserkennung funktioniert nicht?
Wenn das Terminal nach dem Klicken auf die Benachrichtigung nicht in den Vordergrund gebracht wird, könnte dies folgende Gründe haben:
1. Die Terminal-Anwendung wurde nicht korrekt erkannt – Prüfen Sie das Feld `terminal` in der Konfigurationsdatei
2. Bundle-ID konnte nicht abgerufen werden – Überprüfen Sie die Fehlerinformationen in den OpenCode-Logs
:::

## Häufige Probleme

### Sound wird nicht abgespielt

**Problem**: Sound ist konfiguriert, aber beim Benachrichtigen ist kein Ton zu hören

**Mögliche Ursachen**:
1. Systemlautstärke ist zu niedrig oder stummgeschaltet
2. In den macOS-Systemeinstellungen sind Benachrichtigungssounds deaktiviert

**Lösung**:
1. Überprüfen Sie Systemlautstärke und Benachrichtigungseinstellungen
2. Öffnen Sie "Systemeinstellungen → Benachrichtigungen → OpenCode" und stellen Sie sicher, dass Sounds aktiviert sind

### Klicken auf Benachrichtigung fokussiert nicht

**Problem**: Nach dem Klicken auf die Benachrichtigung wird das Terminal-Fenster nicht in den Vordergrund gebracht

**Mögliche Ursachen**:
1. Die Terminal-Anwendung wurde nicht automatisch erkannt
2. Bundle-ID konnte nicht abgerufen werden

**Lösung**:
1. Geben Sie den Terminal-Typ manuell an:
```json
{
  "terminal": "ghostty" // oder anderer Terminal-Name
}
```

2. Stellen Sie sicher, dass der Terminal-Anwendungsname korrekt ist (groß-/kleinschreibungsempfindlich)

### Fokuserkennung funktioniert nicht

**Problem**: Auch wenn das Terminal im Vordergrund ist, werden Benachrichtigungen empfangen

**Mögliche Ursachen**:
1. Terminal-Prozessname konnte nicht erkannt werden
2. Terminal-Anwendung ist nicht in der automatischen Erkennungsliste

**Lösung**:
1. Geben Sie den Terminal-Typ manuell an:
```json
{
  "terminal": "ghostty" // oder anderer Terminal-Name
}
```

2. Stellen Sie sicher, dass der Terminal-Anwendungsname korrekt ist (groß-/kleinschreibungsempfindlich)
3. Überprüfen Sie die Logs, um zu bestätigen, ob das Terminal korrekt erkannt wurde

## Zusammenfassung dieser Lektion

Die macOS-Plattform bietet ein vollständiges Benachrichtigungserlebnis:

| Funktion | Funktionsweise | Plattformunterstützung |
| --- | --- | --- |
| Native Benachrichtigungen | Systemweite Benachrichtigungen anzeigen | ✅ macOS<br>✅ Windows<br>✅ Linux |
| Benutzerdefinierte Sounds | Verschiedene Sounds für verschiedene Ereignisse | ✅ macOS |
| Fokuserkennung | Vermeidung doppelter Benachrichtigungen | ✅ macOS |
| Klick-zum-Fokussieren | Schnelle Rückkehr zur Arbeit | ✅ macOS |

**Kernkonfiguration**:
```json
{
  "sounds": {
    "idle": "Glass",      // Aufgabe abgeschlossen
    "error": "Basso",     // Fehler aufgetreten
    "permission": "Submarine" // Berechtigungsanfrage
  }
}
```

**Workflow**:
1. KI schließt Aufgabe ab → Sendet Benachrichtigung → Spielt Glass-Sound ab
2. Sie arbeiten im Browser → Erhalten Benachrichtigung → Klicken
3. Terminal wird automatisch in den Vordergrund gebracht → Überprüfen der KI-Ausgabe

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Windows-Plattformfunktionen](../windows/)** kennen.
>
> Sie werden lernen:
> - Welche Funktionen die Windows-Plattform unterstützt
> - Welche Unterschiede im Vergleich zu macOS bestehen
> - Wie Sie Benachrichtigungen unter Windows konfigurieren

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Fokuserkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Klick-zum-Fokussieren | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Bundle-ID-Abruf | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| Vordergrundanwendungserkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| Terminal-Namenzuordnung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Standard-Soundkonfiguration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L59-L61) | 59-61 |
| macOS-Soundliste | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
| Plattformfunktionsvergleichstabelle | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L54-L62) | 54-62 |

**Wichtige Konstanten**:

- `TERMINAL_PROCESS_NAMES` (Zeilen 71-84): Zuordnungstabelle von Terminal-Namen zu macOS-Prozessnamen
- `ghostty` → `"Ghostty"`
- `kitty` → `"kitty"`
- `iterm` / `iterm2` → `"iTerm2"`
- `wezterm` → `"WezTerm"`
- `alacritty` → `"Alacritty"`
- `terminal` / `apple_terminal` → `"Terminal"`
- `hyper` → `"Hyper"`
- `warp` → `"Warp"`
- `vscode` → `"Code"`
- `vscode-insiders` → `"Code - Insiders"`

**Standardkonfiguration**:

- `sounds.idle = "Glass"`: Sound für abgeschlossene Aufgaben
- `sounds.error = "Basso"`: Sound für Fehlerbenachrichtigungen
- `sounds.permission = "Submarine"`: Sound für Berechtigungsanfragen

**Wichtige Funktionen**:

- `isTerminalFocused(terminalInfo)` (Zeilen 166-175): Erkennt, ob das Terminal die Vordergrundanwendung ist
  - Verwendet `osascript`, um den Prozessnamen der Vordergrundanwendung abzurufen
  - Vergleicht mit `processName` des Terminals (nicht groß-/kleinschreibungsempfindlich)
  - Nur auf macOS-Plattform aktiviert

- `getBundleId(appName)` (Zeilen 135-137): Ruft dynamisch die Bundle-ID der Anwendung ab
  - Verwendet `osascript` zur Abfrage
  - Bundle-ID wird für die Klick-zum-Fokussieren-Funktion verwendet

- `getFrontmostApp()` (Zeilen 139-143): Ruft die aktuelle Vordergrundanwendung ab
  - Verwendet `osascript` zur Abfrage von System Events
  - Gibt den Prozessnamen der Vordergrundanwendung zurück

- `sendNotification(options)` (Zeilen 227-243): Sendet eine Benachrichtigung
  - macOS-Besonderheit: Wenn die Plattform als darwin erkannt wird und `terminalInfo.bundleId` vorhanden ist, wird die Option `activate` gesetzt, um Klick-zum-Fokussieren zu ermöglichen

</details>
