---
title: "opencode-notify Konfigurationsreferenz: Vollständige Konfigurationsoptionen & Plattformunterschiede"
sidebarTitle: "Benachrichtigungsverhalten anpassen"
subtitle: "Konfigurationsreferenz: Vollständige Konfigurationsoptionen"
description: "Lernen Sie alle Konfigurationsoptionen von opencode-notify kennen, einschließlich Unter-Sitzungs-Benachrichtigungen, benutzerdefinierte Sounds, Ruhezeiten und Terminal-Überschreibungen. Dieses Tutorial bietet detaillierte Parameterbeschreibungen, Standardwerte, Plattformunterschiede und vollständige Beispiele, um Ihr Benachrichtigungsverhalten anzupassen und Ihren Workflow zu optimieren."
tags:
  - "Konfigurationsreferenz"
  - "Erweiterte Konfiguration"
prerequisite:
  - "start-quick-start"
order: 70
---

# Konfigurationsreferenz

## Was Sie nach diesem Kurs können werden

- ✅ Alle konfigurierbaren Parameter und deren Bedeutung verstehen
- ✅ Das Benachrichtigungsverhalten nach Ihren Bedürfnissen anpassen
- ✅ Ruhezeiten konfigurieren, um zu bestimmten Zeiten nicht gestört zu werden
- ✅ Die Auswirkungen von Plattformunterschieden auf die Konfiguration verstehen

## Ihre aktuellen Herausforderungen

Die Standardkonfiguration ist ausreichend, aber Ihr Workflow könnte spezielle Anforderungen haben:
- Sie möchten wichtige Benachrichtigungen auch nachts erhalten, aber tagsüber nicht gestört werden
- Sie arbeiten mit mehreren parallelen Sitzungen und möchten alle Benachrichtigungen erhalten
- Sie arbeiten in tmux und stellen fest, dass die Fokuserkennung nicht wie erwartet funktioniert
- Sie möchten wissen, welche Auswirkungen eine bestimmte Konfigurationsoption hat

## Wann Sie diese Konfiguration verwenden sollten

- **Sie müssen das Benachrichtigungsverhalten anpassen** – Die Standardkonfiguration entspricht nicht Ihren Arbeitsgewohnheiten
- **Sie möchten Benachrichtigungen reduzieren** – Konfiguration von Ruhezeiten oder Unter-Sitzungs-Schaltern
- **Sie möchten das Plugin-Verhalten debuggen** – Verstehen, welche Auswirkungen jede Konfigurationsoption hat
- **Sie verwenden mehrere Plattformen** – Verstehen der Auswirkungen von Plattformunterschieden auf die Konfiguration

## Kernkonzept

Die Konfigurationsdatei ermöglicht es Ihnen, das Plugin-Verhalten anzupassen, ohne Code zu ändern – wie ein "Einstellungsmenü" für das Plugin. Die Konfigurationsdatei ist im JSON-Format und befindet sich unter `~/.config/opencode/kdco-notify.json`.

**Konfigurationsladeablauf**:

```
Plugin-Start
    ↓
Benutzerkonfiguration lesen
    ↓
Mit Standardkonfiguration zusammenführen (Benutzerkonfiguration hat Priorität)
    ↓
Mit zusammengeführter Konfiguration ausführen
```

::: info Konfigurationsdateipfad
`~/.config/opencode/kdco-notify.json`
:::

## 📋 Konfigurationsoptionen

### Vollständige Konfigurationsstruktur

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
  "terminal": ""
}
```

### Einzelne Optionen

#### notifyChildSessions

| Konfigurationsoption | Typ | Standardwert | Beschreibung |
| --- | --- | --- | ---|
| `notifyChildSessions` | boolean | `false` | Ob Unter-Sitzungen benachrichtigt werden |

**Funktion**: Steuert, ob Benachrichtigungen für Unter-Sitzungen (Sub-Sessions) gesendet werden.

**Was sind Unter-Sitzungen**:
Wenn Sie die Multi-Session-Funktion von OpenCode verwenden, können Sitzungen in Eltern-Sitzungen und Unter-Sitzungen unterteilt werden. Unter-Sitzungen sind normalerweise von der Eltern-Sitzung gestartete Hilfsaufgaben, wie Datei-Lese-/Schreiboperationen oder Netzwerk-Anfragen.

**Standardverhalten** (`false`):
- Nur Abschluss-, Fehler- und Berechtigungsanforderungs-Ereignisse der Eltern-Sitzung werden benachrichtigt
- Keine Benachrichtigungen für Ereignisse in Unter-Sitzungen
- So wird vermieden, bei parallelen Multi-Tasks mit vielen Benachrichtigungen überflutet zu werden

**Nach Aktivierung** (`true`):
- Alle Sitzungen (Eltern- und Unter-Sitzungen) werden benachrichtigt
- Geeignet für Szenarien, in denen der Fortschritt aller Unter-Aufgaben verfolgt werden muss

::: tip Empfohlene Einstellung
Halten Sie den Standardwert `false`, es sei denn, Sie müssen wirklich den Status jeder Unter-Aufgabe verfolgen.
:::

#### Fokuserkennung (macOS)

Das Plugin erkennt automatisch, ob das Terminal im Vordergrund ist. Wenn das Terminal das aktive Fenster ist, werden Benachrichtigungen unterdrückt, um wiederholte Erinnerungen zu vermeiden.

**Funktionsweise**:
- Verwendet macOS `osascript`, um die aktuelle Vordergrund-Anwendung zu erkennen
- Vergleicht den Prozessnamen der Vordergrund-Anwendung mit dem Prozessnamen Ihres Terminals
- Sendet keine Benachrichtigung, wenn das Terminal im Vordergrund ist
- **Frage-Anfragen ausgenommen** (unterstützt tmux-Workflow)

::: info Plattformunterschiede
Die Fokuserkennungsfunktion ist nur auf macOS verfügbar. Windows und Linux unterstützen diese Funktion nicht.
:::

#### sounds

| Konfigurationsoption | Typ | Standardwert | Plattformunterstützung | Beschreibung |
| --- | --- | --- | --- | ---|
| `sounds.idle` | string | `"Glass"` | ✅ macOS | Soundeffekt für Aufgabenabschluss |
| `sounds.error` | string | `"Basso"` | ✅ macOS | Soundeffekt für Fehlerbenachrichtigungen |
| `sounds.permission` | string | `"Submarine"` | ✅ macOS | Soundeffekt für Berechtigungsanforderungen |
| `sounds.question` | string | Nicht gesetzt | ✅ macOS | Soundeffekt für Frageanfragen (optional) |

**Funktion**: Legt verschiedene System-Soundeffekte für verschiedene Benachrichtigungstypen fest (nur macOS).

**Verfügbare Soundeffekte**:

| Soundname | Höreindruck | Empfohlene Verwendung |
| --- | --- | ---|
| Glass | Leicht, klar | Aufgabenabschluss (Standard) |
| Basso | Tief, warnend | Fehlerbenachrichtigung (Standard) |
| Submarine | Erinnernd, sanft | Berechtigungsanforderung (Standard) |
| Blow | Stark | Wichtige Ereignisse |
| Bottle | Klar | Unter-Aufgabenabschluss |
| Frog | Locker | Informelle Erinnerungen |
| Funk | Rhythmus | Mehrere Aufgaben abgeschlossen |
| Hero | Großartig | Meilenstein erreicht |
| Morse | Morsesignal | Debugging-bezogen |
| Ping | Klar | Leichter Hinweis |
| Pop | Kurz | Schnelle Aufgabe |
| Purr | Sanft | Störungsfreie Erinnerung |
| Sosumi | Einzigartig | Besondere Ereignisse |
| Tink | Hell | Kleine Aufgabe abgeschlossen |

**Anmerkung zum question-Feld**:
Das Feld `sounds.question` ist optional und wird für Benachrichtigungen bei KI-Fragen verwendet. Wenn nicht gesetzt, wird der Soundeffekt von `permission` verwendet.

::: tip Sound-Konfigurationstipps
- Verwenden Sie leichte Sounds für Erfolg (idle)
- Verwenden Sie tiefe Sounds für Fehler (error)
- Verwenden Sie sanfte Sounds, wenn Ihre Aufmerksamkeit benötigt wird (permission, question)
- Verschiedene Sound-Kombinationen ermöglichen es Ihnen, die Situation ungefähr zu erkennen, ohne die Benachrichtigung anzusehen
:::

::: warning Plattformunterschiede
Die `sounds`-Konfiguration ist nur auf macOS wirksam. Windows und Linux verwenden die Systemstandard-Benachrichtigungssounds und können diese nicht anpassen.
:::

#### quietHours

| Konfigurationsoption | Typ | Standardwert | Beschreibung |
| --- | --- | --- | ---|
| `quietHours.enabled` | boolean | `false` | Ob Ruhezeiten aktiviert sind |
| `quietHours.start` | string | `"22:00"` | Ruhezeit-Startzeit (HH:MM Format) |
| `quietHours.end` | string | `"08:00"` | Ruhezeit-Endzeit (HH:MM Format) |

**Funktion**: Unterdrückt alle Benachrichtigungen innerhalb des angegebenen Zeitraums.

**Standardverhalten** (`enabled: false`):
- Ruhezeiten sind nicht aktiviert
- Benachrichtigungen können jederzeit empfangen werden

**Nach Aktivierung** (`enabled: true`):
- Zwischen `start` und `end` werden keine Benachrichtigungen gesendet
- Über-Mitternacht-Zeiträume werden unterstützt (z.B. 22:00-08:00)

**Zeitformat**:
- Verwendet das 24-Stunden-Format `HH:MM`
- Beispiel: `"22:30"` bedeutet 22:30 Uhr

**Über-Mitternacht-Zeiträume**:
- Wenn `start > end` (z.B. 22:00-08:00), bedeutet dies über Mitternacht
- Der Zeitraum von 22:00 bis 08:00 am nächsten Tag gilt als Ruhezeit

::: info Priorität von Ruhezeiten
Ruhezeiten haben die höchste Priorität. Selbst wenn alle anderen Bedingungen erfüllt sind, werden innerhalb der Ruhezeit keine Benachrichtigungen gesendet.
:::

#### terminal

| Konfigurationsoption | Typ | Standardwert | Beschreibung |
| --- | --- | --- | ---|
| `terminal` | string | Nicht gesetzt | Manuelle Angabe des Terminal-Typs (überschreibt automatische Erkennung) |

**Funktion**: Manuelle Angabe des verwendeten Terminal-Emulator-Typs, überschreibt die automatische Erkennung des Plugins.

**Standardverhalten** (nicht gesetzt):
- Das Plugin verwendet die `detect-terminal`-Bibliothek zur automatischen Erkennung Ihres Terminals
- Unterstützt 37+ Terminal-Emulatoren

**Nach dem Setzen**:
- Das Plugin verwendet den angegebenen Terminal-Typ
- Wird für Fokuserkennung und Klick-fokussieren-Funktionen verwendet (macOS)

**Häufig verwendete Terminal-Werte**:

| Terminal-Anwendung | Konfigurationswert |
| --- | ---|
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code integriertes Terminal | `"vscode"` |

::: tip Wann manuelle Einstellung erforderlich ist
- Automatische Erkennung schlägt fehl, Fokuserkennung funktioniert nicht
- Sie verwenden mehrere Terminals und müssen ein bestimmtes angeben
- Ihr Terminal-Name ist nicht in der Liste der häufig verwendeten
:::

## Plattformunterschiede-Zusammenfassung

Verschiedene Plattformen unterstützen Konfigurationsoptionen unterschiedlich:

| Konfigurationsoption | macOS | Windows | Linux |
| --- | --- | --- | ---|
| `notifyChildSessions` | ✅ | ✅ | ✅ |
| Fokuserkennung (hardcodiert) | ✅ | ❌ | ❌ |
| `sounds.*` | ✅ | ❌ | ❌ |
| `quietHours.*` | ✅ | ✅ | ✅ |
| `terminal` | ✅ | ✅ | ✅ |

::: warning Hinweis für Windows/Linux-Benutzer
Die `sounds`-Konfiguration und die Fokuserkennungsfunktion sind unter Windows und Linux nicht wirksam.
- Windows/Linux verwenden Systemstandard-Benachrichtigungssounds
- Windows/Linux unterstützen keine Fokuserkennung (kann nicht über Konfiguration gesteuert werden)
:::

## Konfigurationsbeispiele

### Basis-Konfiguration (empfohlen)

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Diese Konfiguration ist für die meisten Benutzer geeignet:
- Nur Eltern-Sitzungen werden benachrichtigt, um Störungen durch Unter-Aufgaben zu vermeiden
- Auf macOS werden Benachrichtigungen automatisch unterdrückt, wenn das Terminal im Vordergrund ist (keine Konfiguration erforderlich)
- Verwendet die Standard-Sound-Kombination
- Ruhezeiten nicht aktiviert

### Ruhezeiten aktivieren

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Geeignet für Benutzer, die nachts nicht gestört werden möchten:
- Keine Benachrichtigungen zwischen 22:00 und 08:00
- Normale Benachrichtigungen zu anderen Zeiten

### Alle Unter-Aufgaben verfolgen

```json
{
  "notifyChildSessions": true,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Ping"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Geeignet für Benutzer, die den Fortschritt aller Aufgaben verfolgen müssen:
- Alle Sitzungen (Eltern- und Unter-Sitzungen) werden benachrichtigt
- Unabhängiger Sound für Fragen-Anfragen (Ping) eingestellt

### Terminal manuell angeben

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

Geeignet für Benutzer bei automatischer Erkennungsfehler oder Verwendung mehrerer Terminals:
- Manuelle Angabe der Verwendung von Ghostty-Terminal
- Sicherstellen, dass Fokuserkennung und Klick-fokussieren-Funktionen normal funktionieren

### Windows/Linux Minimalkonfiguration

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Geeignet für Windows/Linux-Benutzer (vereinfachte Konfiguration):
- Nur plattformunterstützte Konfigurationsoptionen behalten
- `sounds`-Konfiguration und Fokuserkennungsfunktion sind unter Windows/Linux unwirksam, keine Einstellung erforderlich

## Konfigurationsdatei-Verwaltung

### Konfigurationsdatei erstellen

**macOS/Linux**:

```bash
# Konfigurationsverzeichnis erstellen (falls nicht vorhanden)
mkdir -p ~/.config/opencode

# Konfigurationsdatei erstellen
nano ~/.config/opencode/kdco-notify.json
```

**Windows (PowerShell)**:

```powershell
# Konfigurationsverzeichnis erstellen (falls nicht vorhanden)
New-Item -ItemType Directory -Path "$env:APPDATA\opencode" -Force

# Konfigurationsdatei erstellen
notepad "$env:APPDATA\opencode\kdco-notify.json"
```

### Konfigurationsdatei überprüfen

**Dateiexistenz prüfen**:

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
Get-Content "$env:APPDATA\opencode\kdco-notify.json"
```

**Konfiguration überprüfen**:

1. Konfigurationsdatei ändern
2. OpenCode neu starten (oder Konfigurations-Neuladen auslösen)
3. Beobachten, ob das Benachrichtigungsverhalten wie erwartet ist

### Konfigurationsdatei-Fehlerbehandlung

Bei Konfigurationsdatei-Formatfehlern:
- Das Plugin ignoriert die fehlerhafte Konfigurationsdatei
- Führt mit Standardkonfiguration weiter aus
- Gibt Warnungsinformationen in OpenCode-Logs aus

**Häufige JSON-Fehler**:

| Fehlertyp | Beispiel | Korrekturmethode |
| --- | --- | ---|
| Fehlendes Komma | `"key1": "value1" "key2": "value2"` | Komma hinzufügen: `"key1": "value1",` |
| Überzähliges Komma | `"key1": "value1",}` | Letztes Komma entfernen: `"key1": "value1"}` |
| Nicht geschlossene Anführungszeichen | `"key": value` | Anführungszeichen hinzufügen: `"key": "value"` |
| Einfache Anführungszeichen verwendet | `'key': 'value'` | Doppelte Anführungszeichen verwenden: `"key": "value"` |
| Kommentar-Syntaxfehler | `{"key": "value" /* comment */}` | JSON unterstützt keine Kommentare, Kommentare entfernen |

::: tip JSON-Validierungstools verwenden
Sie können Online-JSON-Validierungstools (wie jsonlint.com) verwenden, um das Konfigurationsdatei-Format zu überprüfen.
:::

## Zusammenfassung dieser Lektion

Diese Lektion bietet eine vollständige Konfigurationsreferenz für opencode-notify:

**Kernkonfigurationsoptionen**:

| Konfigurationsoption | Funktion | Standardwert | Plattformunterstützung |
| --- | --- | --- | ---|
| `notifyChildSessions` | Unter-Sitzungs-Benachrichtigungsschalter | `false` | Alle Plattformen |
| Fokuserkennung | Terminal-Fokus-Unterdrückung (hardcodiert) | Keine Konfiguration | Nur macOS |
| `sounds.*` | Benutzerdefinierte Sounds | Siehe Felder | Nur macOS |
| `quietHours.*` | Ruhezeiten-Konfiguration | Siehe Felder | Alle Plattformen |
| `terminal` | Manuelle Terminal-Angabe | Nicht gesetzt | Alle Plattformen |

**Konfigurationsprinzipien**:
- **Die meisten Benutzer**: Standardkonfiguration ist ausreichend
- **Stille benötigt**: `quietHours` aktivieren
- **Unter-Aufgaben verfolgen müssen**: `notifyChildSessions` aktivieren
- **macOS-Benutzer**: Können `sounds` anpassen und genießen automatische Fokuserkennung
- **Windows/Linux-Benutzer**: Weniger Konfigurationsoptionen, Fokus auf `notifyChildSessions` und `quietHours`

**Konfigurationsdateipfad**: `~/.config/opencode/kdco-notify.json`

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Ruhezeiten im Detail](../quiet-hours/)** kennen.
>
> Sie werden lernen:
> - Detaillierte Funktionsweise von Ruhezeiten
> - Konfigurationsmethode für über-Mitternacht-Zeiträume
> - Priorität von Ruhezeiten gegenüber anderen Konfigurationen
> - Häufige Probleme und Lösungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | ---|
| Konfigurations-Schnittstellen-Definition | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| Standardkonfiguration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Konfigurationsdatei-Laden | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L91-L114) | 91-114 |
| Unter-Sitzungs-Prüfung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Terminal-Fokus-Prüfung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Ruhezeiten-Prüfung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Sound-Konfigurations-Verwendung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L236) | 227-236 |
| README Konfigurationsbeispiel | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L68-L79) | 68-79 |

**Konfigurations-Schnittstelle** (NotifyConfig):

```typescript
interface NotifyConfig {
  /** Benachrichtigen bei Unter-Sub-Session-Ereignissen (Standard: false) */
  notifyChildSessions: boolean
  /** Sound-Konfiguration pro Ereignistyp */
  sounds: {
    idle: string
    error: string
    permission: string
    question?: string
  }
  /** Ruhezeiten-Konfiguration */
  quietHours: {
    enabled: boolean
    start: string // "HH:MM" Format
    end: string // "HH:MM" Format
  }
  /** Terminal-Erkennung überschreiben (optional) */
  terminal?: string
}
```

**Hinweis**: Das Konfigurations-Schnittstellenfeld **`suppressWhenFocused` existiert nicht**. Die Fokuserkennung ist ein hardcodiertes Verhalten der macOS-Plattform, das Benutzer nicht über die Konfigurationsdatei steuern können.

**Standardkonfiguration** (DEFAULT_CONFIG):

```typescript
const DEFAULT_CONFIG: NotifyConfig = {
  notifyChildSessions: false,
  sounds: {
    idle: "Glass",      // Soundeffekt für Aufgabenabschluss
    error: "Basso",     // Soundeffekt für Fehler
    permission: "Submarine",  // Soundeffekt für Berechtigungsanforderungen
  },
  quietHours: {
    enabled: false,     // Ruhezeiten standardmäßig nicht aktiviert
    start: "22:00",    // 22:00 Uhr
    end: "08:00",      // 08:00 Uhr
  },
}
```

**Konfigurationslade-Funktion** (loadConfig):

- Pfad: `~/.config/opencode/kdco-notify.json`
- Verwendet `fs.readFile()` zum Lesen der Konfigurationsdatei
- Mit `DEFAULT_CONFIG` zusammenführen (Benutzerkonfiguration hat Priorität)
- Verschachtelte Objekte (`sounds`, `quietHours`) werden ebenfalls zusammengeführt
- Wenn Konfigurationsdatei nicht existiert oder Formatfehler hat, Standardkonfiguration verwenden

**Unter-Sitzungs-Prüfung** (isParentSession):

- Prüft, ob `sessionID` ein `/` enthält (Unter-Sitzungs-Kennzeichnung)
- Wenn `notifyChildSessions` `false` ist, Unter-Sitzungs-Benachrichtigungen überspringen
- Berechtigungsanforderungs-Benachrichtigungen (`permission.updated`) werden immer gesendet, unabhängig von dieser Einschränkung

**Terminal-Fokus-Prüfung** (isTerminalFocused):

- Verwendet `osascript`, um den aktuellen Vordergrund-Anwendungsprozessnamen abzurufen
- Vergleicht mit dem `processName` des Terminals (nicht case-sensitiv)
- Nur auf macOS-Plattform aktiviert, **kann nicht über Konfiguration deaktiviert werden**
- Frage-Anfrage-Benachrichtigungen (`question`) haben keine Fokus-Prüfung (unterstützt tmux-Workflow)

**Ruhezeiten-Prüfung** (isQuietHours):

- Konvertiert aktuelle Zeit in Minuten (ab Mitternacht)
- Vergleicht mit konfiguriertem `start` und `end`
- Unterstützt über-Mitternacht-Zeiträume (z.B. 22:00-08:00)
- Wenn `start > end`, bedeutet dies über Mitternacht

**Sound-Konfigurations-Verwendung** (sendNotification):

- Liest Sound-Namen für entsprechendes Ereignis aus der Konfiguration
- Übergibt an die `sound`-Option von `node-notifier`
- Nur auf macOS-Plattform wirksam
- Wenn `question`-Ereignis keinen Sound konfiguriert hat, wird der Sound von `permission` verwendet

</details>
