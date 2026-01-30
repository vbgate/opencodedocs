---
title: "Linux-Plattform-Leitfaden: notify-send-Benachrichtigungen & Terminal-Erkennung | opencode-notify Tutorial"
sidebarTitle: "Benachrichtigungen unter Linux"
subtitle: "Linux-Plattform-Features: notify-send-Benachrichtigungen & Terminal-Erkennung"
description: "Lernen Sie die Funktionen und Einschränkungen von opencode-notify unter Linux kennen. Meistern Sie native Linux-Benachrichtigungen und Terminal-Erkennung, verstehen Sie die Unterschiede zu macOS/Windows, konfigurieren Sie passende Benachrichtigungsstrategien für Linux, vermeiden Sie Ablenkungen durch Benachrichtigungen und lösen Sie Probleme mit notify-send-Installation, Benachrichtigungsanzeige und Konfiguration."
tags:
  - "Linux"
  - "Plattform-Features"
  - "Terminal-Erkennung"
prerequisite:
  - "start-quick-start"
order: 50
---

# Linux-Plattform-Features: notify-send-Benachrichtigungen & Terminal-Erkennung

## Was Sie nach diesem Kurs können

- Die unterstützten Funktionen von opencode-notify unter Linux verstehen
- Die Funktionsweise nativer Linux-Benachrichtigungen und Terminal-Erkennung beherrschen
- Die Unterschiede zu macOS/Windows-Funktionen verstehen
- Passende Benachrichtigungsstrategien für Linux konfigurieren

## Ihr aktuelles Problem

Sie verwenden OpenCode unter Linux und stellen fest, dass einige Funktionen nicht so intelligent wie unter macOS funktionieren. Benachrichtigungen erscheinen auch dann, wenn das Terminal fokussiert ist, und das Klicken auf eine Benachrichtigung führt nicht zurück zum Terminalfenster. Ist das normal? Welche Einschränkungen hat die Linux-Plattform?

## Wann diese Seite relevant ist

**Lesen Sie diesen Leitfaden in folgenden Szenarien**:
- Sie nutzen opencode-notify unter Linux
- Sie stellen fest, dass manche macOS-Funktionen unter Linux nicht verfügbar sind
- Sie möchten wissen, wie Sie die verfügbaren Linux-Funktionen optimal nutzen

## Kernkonzept

opencode-notify bietet unter Linux **grundlegende Benachrichtigungsfunktionen**, hat aber im Vergleich zu macOS einige Einschränkungen. Diese werden durch die Betriebssystem-Architektur bestimmt und sind kein Fehler des Plugins.

::: info Warum hat macOS mehr Funktionen?

macOS bietet leistungsstärkere System-APIs:
- NSUserNotificationCenter unterstützt Fokus beim Klicken
- AppleScript kann die aktive Anwendung erkennen
- System-Sound-API ermöglicht benutzerdefinierte Töne

Die Systembenachrichtigungs-APIs von Linux und Windows sind grundlegender. opencode-notify nutzt auf diesen Plattformen `node-notifier` für native Systembenachrichtigungen.
:::

## Funktionsübersicht Linux

| Funktion | Linux | Erklärung |
| --- | --- | --- |
| **Native Benachrichtigungen** | ✅ Unterstützt | Über notify-send gesendet |
| **Terminal-Erkennung** | ✅ Unterstützt | Automatische Erkennung von 37+ Terminal-Emulatoren |
| **Fokus-Erkennung** | ❌ Nicht unterstützt | Kann nicht erkennen, ob Terminal im Vordergrund ist |
| **Klick-Fokus** | ❌ Nicht unterstützt | Klick auf Benachrichtigung wechselt nicht zum Terminal |
| **Benutzerdefinierte Töne** | ❌ Nicht unterstützt | Verwendet System-Standardbenachrichtigungston |

### Linux-Benachrichtigungsmechanismus

opencode-notify verwendet unter Linux den **notify-send**-Befehl für Systembenachrichtigungen und nutzt dabei die Bibliothek `node-notifier` für den Zugriff auf native System-APIs.

**Zeitpunkt der Benachrichtigung**:
- Wenn eine AI-Aufgabe abgeschlossen ist (session.idle)
- Wenn ein AI-Fehler auftritt (session.error)
- Wenn eine Berechtigung benötigt wird (permission.updated)
- Wenn die AI eine Frage stellt (tool.execute.before)

::: tip Eigenschaften von notify-send-Benachrichtigungen
- Benachrichtigungen erscheinen oben rechts auf dem Bildschirm (GNOME/Ubuntu)
- Automatisches Ausblenden (ca. 5 Sekunden)
- Verwendung des System-Standardbenachrichtigungstons
- Klick öffnet das Benachrichtigungszentrum (wechselt nicht zum Terminal)
:::

## Terminal-Erkennung

### Automatische Terminal-Erkennung

opencode-notify verwendet die Bibliothek `detect-terminal` zur automatischen Erkennung Ihres Terminal-Emulators.

**Unterstützte Terminals unter Linux**:
- gnome-terminal (GNOME Desktop Standard)
- konsole (KDE Desktop)
- xterm
- lxterminal (LXDE Desktop)
- alacritty
- kitty
- terminator
- guake
- tilix
- hyper
- VS Code integriertes Terminal
- sowie über 37 weitere Terminal-Emulatoren

::: details Funktionsweise der Terminal-Erkennung

Beim Plugin-Start scannt `detect-terminal()` Systemprozesse und identifiziert den aktuellen Terminal-Typ.

Quellcode-Position: `src/notify.ts:145-164`

Die Funktion `detectTerminalInfo()`:
1. Liest das `terminal`-Feld aus der Konfiguration (falls manuell angegeben)
2. Ruft `detectTerminal()` zur automatischen Erkennung auf
3. Ermittelt den Prozessnamen (für macOS-Fokus-Erkennung)
4. Ermittelt unter macOS die Bundle-ID (für Klick-Fokus)

Unter Linux sind `bundleId` und `processName` `null`, da Linux diese Informationen nicht benötigt.
:::

### Manuelle Terminal-Angabe

Falls die automatische Erkennung fehlschlägt, können Sie den Terminal-Typ manuell in der Konfigurationsdatei angeben.

**Konfigurationsbeispiel**:

```json
{
  "terminal": "gnome-terminal"
}
```

**Verfügbare Terminal-Namen**: Siehe [Liste der unterstützten Terminals von `detect-terminal`](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Plattform-Funktionsvergleich

| Funktion | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **Native Benachrichtigungen** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **Benutzerdefinierte Töne** | ✅ System-Sound-Liste | ❌ System-Standard | ❌ System-Standard |
| **Fokus-Erkennung** | ✅ AppleScript API | ❌ Nicht unterstützt | ❌ Nicht unterstützt |
| **Klick-Fokus** | ✅ activate bundleId | ❌ Nicht unterstützt | ❌ Nicht unterstützt |
| **Terminal-Erkennung** | ✅ 37+ Terminals | ✅ 37+ Terminals | ✅ 37+ Terminals |

### Warum unterstützt Linux keine Fokus-Erkennung?

In der Quellcode-Datei gibt die Funktion `isTerminalFocused()` unter Linux direkt `false` zurück:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux geben direkt false zurück
	// ... macOS Fokus-Erkennungs-Logik
}
```

**Gründe**:
- Linux-Desktop-Umgebungen sind vielfältig (GNOME, KDE, XFCE etc.), es gibt keine einheitliche API für die Abfrage der Vordergrund-Anwendung
- Linux DBus kann das aktive Fenster ermitteln, aber die Implementierung ist komplex und abhängig von der Desktop-Umgebung
- Die aktuelle Version priorisiert Stabilität, daher ist Linux-Fokus-Erkennung noch nicht implementiert

### Warum unterstützt Linux keinen Klick-Fokus?

In der Quellcode-Datei setzt die Funktion `sendNotification()` nur unter macOS die `activate`-Option:

```typescript
// src/notify.ts:238-240
// macOS-spezifisch: Terminal-Fokus beim Klicken auf Benachrichtigung
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Gründe**:
- notify-send unterstützt keinen `activate`-Parameter
- Linux-Benachrichtigungen können nur über App-ID verknüpft werden, nicht dynamisch mit einem bestimmten Fenster
- Klicken auf eine Benachrichtigung öffnet das Benachrichtigungszentrum, fokussiert aber nicht ein bestimmtes Fenster

### Warum unterstützt Linux keine benutzerdefinierten Töne?

::: details Funktionsweise der Sound-Konfiguration

Unter macOS übergibt `sendNotification()` den `sound`-Parameter an die Systembenachrichtigung:

```typescript
// src/notify.ts:227-243
function sendNotification(options: NotificationOptions): void {
	const { title, message, sound, terminalInfo } = options
	
	const notifyOptions: Record<string, unknown> = {
		title,
		message,
		sound,  // ← macOS akzeptiert diesen Parameter
	}
	
	// macOS-spezifisch: Terminal-Fokus beim Klicken auf Benachrichtigung
	if (process.platform === "darwin" && terminalInfo.bundleId) {
		notifyOptions.activate = terminalInfo.bundleId
	}
	
	notifier.notify(notifyOptions)
}
```

Linux notify-send unterstützt keinen benutzerdefinierten Sound-Parameter, daher ist die `sounds`-Konfiguration unter Linux wirkungslos.
:::

## Best Practices für Linux

### Konfigurationsempfehlungen

Da Linux keine Fokus-Erkennung unterstützt, empfehlen wir die Anpassung der Konfiguration zur Reduzierung von Benachrichtigungslärm.

**Empfohlene Konfiguration**:

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

**Konfigurationserklärung**:
- `notifyChildSessions: false` - Nur übergeordnete Sitzungen benachrichtigen, vermeidet Lärm durch Unteraufgaben
- `quietHours.enabled: true` - Aktiviert Stille-Zeitfenster, verhindert nächtliche Störungen

### Nicht unterstützte Konfigurationsoptionen

Folgende Konfigurationsoptionen sind unter Linux wirkungslos:

| Konfiguration | macOS-Effekt | Linux-Effekt |
| --- | --- | --- |
| `sounds.idle` | Spielt Glass-Sound ab | Verwendet System-Standardton |
| `sounds.error` | Spielt Basso-Sound ab | Verwendet System-Standardton |
| `sounds.permission` | Spielt Submarine-Sound ab | Verwendet System-Standardton |

### Nutzungstipps

**Tipp 1: Manuelles Schließen von Benachrichtigungen**

Wenn Sie das Terminal betrachten und nicht gestört werden möchten:

1. Klicken Sie auf das Benachrichtigungssymbol oben rechts auf dem Bildschirm
2. Schließen Sie die opencode-notify-Benachrichtigungen

**Tipp 2: Nutzung von Stille-Zeitfenstern**

Definieren Sie Arbeits- und Ruhezeiten, um außerhalb der Arbeitszeit nicht gestört zu werden:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**Tipp 3: Temporäre Plugin-Deaktivierung**

Falls Sie alle Benachrichtigungen vollständig deaktivieren möchten, empfehlen wir die Konfiguration eines ganztägigen Stille-Zeitfensters oder das Löschen/Umbenennen der Konfigurationsdatei zur Plugin-Deaktivierung.

**Tipp 4: Konfiguration des System-Benachrichtigungstons**

Auch wenn opencode-notify keine benutzerdefinierten Töne unterstützt, können Sie den Standard-Benachrichtigungston in den Systemeinstellungen ändern:

- **GNOME**: Einstellungen → Sound → Hinweistöne
- **KDE**: Systemeinstellungen → Benachrichtigungen → Standard-Sound
- **XFCE**: Einstellungen → Erscheinungsbild → Benachrichtigungen → Sound

## Schritt-für-Schritt-Anleitung

### Linux-Benachrichtigungen testen

**Schritt 1: Testbenachrichtigung auslösen**

Geben Sie in OpenCode eine einfache Aufgabe ein:

```
Bitte berechne das Ergebnis von 1+1.
```

**Sie sollten sehen**:
- Eine notify-send-Benachrichtigung erscheint oben rechts auf dem Bildschirm (GNOME/Ubuntu)
- Titel der Benachrichtigung: "Ready for review"
- System-Standardbenachrichtigungston wird abgespielt

**Schritt 2: Fokus-Unterdrückung testen (Verifizierung der Nicht-Unterstützung)**

Halten Sie das Terminalfenster im Vordergrund und lösen Sie eine weitere Aufgabe aus.

**Sie sollten sehen**:
- Die Benachrichtigung erscheint trotzdem (da Linux keine Fokus-Erkennung unterstützt)

**Schritt 3: Testen des Klickens auf Benachrichtigungen**

Klicken Sie auf die erscheinende Benachrichtigung.

**Sie sollten sehen**:
- Das Benachrichtigungszentrum öffnet sich, nicht das Terminalfenster

### Stille-Zeitfenster konfigurieren

**Schritt 1: Konfigurationsdatei erstellen**

Bearbeiten Sie die Konfigurationsdatei (bash):

```bash
nano ~/.config/opencode/kdco-notify.json
```

**Schritt 2: Stille-Zeitfenster-Konfiguration hinzufügen**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Schritt 3: Speichern und testen**

Warten Sie, bis die aktuelle Zeit in das Stille-Zeitfenster fällt, und lösen Sie dann eine Aufgabe aus.

**Sie sollten sehen**:
- Keine Benachrichtigung (Stille-Zeitfenster ist aktiv)

## Prüfpunkte ✅

Nach Abschluss der obigen Schritte, überprüfen Sie:

- [ ] notify-send-Benachrichtigungen werden normal angezeigt
- [ ] Benachrichtigungen zeigen den korrekten Aufgabentitel
- [ ] Stille-Zeitfenster-Konfiguration ist aktiv
- [ ] Sie verstehen die unter Linux nicht unterstützten Funktionen

## Häufige Probleme

### Problem 1: Benachrichtigungen werden nicht angezeigt

**Ursache 1**: notify-send ist nicht installiert

**Lösung**:

```bash
# Ubuntu/Debian
sudo apt install libnotify-bin

# Fedora/RHEL
sudo dnf install libnotify

# Arch Linux
sudo pacman -S libnotify
```

**Ursache 2**: Linux-Benachrichtigungsberechtigungen nicht erteilt

**Lösung**:

1. Öffnen Sie die Systemeinstellungen
2. Suchen Sie nach "Benachrichtigungen" oder "Datenschutz" → "Benachrichtigungen"
3. Stellen Sie sicher, dass "Apps dürfen Benachrichtigungen senden" aktiviert ist
4. Suchen Sie nach OpenCode und stellen Sie sicher, dass Benachrichtigungen aktiviert sind

### Problem 2: Terminal-Erkennung fehlgeschlagen

**Ursache**: `detect-terminal` kann Ihr Terminal nicht erkennen

**Lösung**:

Geben Sie den Terminal-Typ manuell in der Konfigurationsdatei an:

```json
{
  "terminal": "gnome-terminal"
}
```

### Problem 3: Benutzerdefinierte Töne funktionieren nicht

**Ursache**: Linux-Plattform unterstützt keine benutzerdefinierten Töne

**Erklärung**: Dies ist normal. notify-send verwendet den System-Standardton und kann nicht über die Konfiguration geändert werden.

**Lösung**: Ändern Sie den Standard-Benachrichtigungston in den Systemeinstellungen.

### Problem 4: Klicken auf Benachrichtigung fokussiert nicht das Terminal

**Ursache**: notify-send unterstützt keinen `activate`-Parameter

**Erklärung**: Dies ist eine Einschränkung der Linux-API. Das Klicken auf eine Benachrichtigung öffnet das Benachrichtigungszentrum, Sie müssen manuell zum Terminalfenster wechseln.

### Problem 5: Unterschiedliches Benachrichtigungsverhalten in verschiedenen Desktop-Umgebungen

**Phänomen**: In verschiedenen Desktop-Umgebungen (GNOME, KDE, XFCE) können Benachrichtigungen an unterschiedlichen Positionen erscheinen und sich unterschiedlich verhalten.

**Erklärung**: Dies ist normal, jede Desktop-Umgebung hat ihre eigene Benachrichtigungssystem-Implementierung.

**Lösung**: Passen Sie das Benachrichtigungsverhalten in den Systemeinstellungen Ihrer Desktop-Umgebung an.

## Lektionszusammenfassung

In dieser Lektion haben wir gelernt:

- ✅ Linux unterstützt native Benachrichtigungen und Terminal-Erkennung
- ✅ Linux unterstützt keine Fokus-Erkennung und keinen Klick-Fokus
- ✅ Linux unterstützt keine benutzerdefinierten Töne
- ✅ Empfohlene Konfigurationen (Stille-Zeitfenster, nur übergeordnete Sitzungen benachrichtigen)
- ✅ Lösungen für häufige Probleme

**Wichtige Punkte**:
1. Linux-Plattform-Funktionen sind grundlegend, aber die Kernbenachrichtigungsfunktion ist vollständig
2. Fokus-Erkennung und Klick-Fokus sind exklusive macOS-Funktionen
3. Durch Stille-Zeitfenster-Konfiguration können Sie Benachrichtigungslärm reduzieren
4. Terminal-Erkennung unterstützt manuelle Angabe für bessere Kompatibilität
5. notify-send muss vorinstalliert sein (in einigen Distributionen standardmäßig enthalten)

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie **[Unterstützte Terminals](../../terminals/)** kennen.
>
> Sie werden lernen:
> - Liste der 37+ von opencode-notify unterstützten Terminals
> - Erkennungsmechanismen für verschiedene Terminals
> - Konfigurationsmethoden für Terminal-Typ-Überschreibung
> - Tipps für die Nutzung des VS Code integrierten Terminals

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Zum Anzeigen der Quellcode-Positionen klicken</strong></summary>

> Letzte Aktualisierung: 2026-01-27

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Linux-Plattform-Einschränkungsprüfung (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Linux-Plattform-Einschränkungsprüfung (Fokus-Erkennung) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS-spezifisch: Klick-Fokus | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Benachrichtigung senden (plattformübergreifend) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Terminal-Erkennung (plattformübergreifend) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Konfiguration laden (plattformübergreifend) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**Wichtige Funktionen**:
- `runOsascript()`: Wird nur unter macOS ausgeführt, gibt unter Linux null zurück
- `isTerminalFocused()`: Gibt unter Linux direkt false zurück
- `sendNotification()`: Setzt nur unter macOS den `activate`-Parameter
- `detectTerminalInfo()`: Plattformübergreifende Terminal-Erkennung

**Plattform-Prüfung**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

**Linux-Benachrichtigungs-Abhängigkeiten**:
- Externe Abhängigkeit: `node-notifier` → `notify-send` Befehl
- System-Anforderung: libnotify-bin oder entsprechendes Paket

</details>
