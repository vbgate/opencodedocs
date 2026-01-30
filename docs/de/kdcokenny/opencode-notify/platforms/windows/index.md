---
title: "Windows-Plattform-Leitfaden: Native Benachrichtigungen, Terminal-Erkennung und Konfiguration | opencode-notify Tutorial"
sidebarTitle: "Benachrichtigungen unter Windows"
subtitle: "Windows-Plattform-Features: Native Benachrichtigungen und Terminal-Erkennung"
description: "Lernen Sie die Funktionen und Einschränkungen von opencode-notify auf der Windows-Plattform kennen. Beherrschen Sie native Windows-Benachrichtigungen und Terminal-Erkennung, verstehen Sie die funktionalen Unterschiede zur macOS-Plattform, konfigurieren Sie die beste Benachrichtigungsstrategie für maximale Effizienz, vermeiden Sie Benachrichtigungsunterbrechungen und bleiben Sie im Fokus."
tags:
  - "Windows"
  - "Plattform-Features"
  - "Terminal-Erkennung"
prerequisite:
  - "start-quick-start"
order: 40
---

# Windows-Plattform-Features: Native Benachrichtigungen und Terminal-Erkennung

## Was Sie lernen können

- Verstehen Sie die von opencode-notify auf der Windows-Plattform unterstützten Funktionen
- Beherrschen Sie die Funktionsweise der Windows-Terminal-Erkennung
- Verstehen Sie die funktionalen Unterschiede zur macOS-Plattform
- Konfigurieren Sie die für Windows geeignete Benachrichtigungsstrategie

## Ihre aktuelle Situation

Sie verwenden OpenCode unter Windows und stellen fest, dass einige Funktionen nicht so intelligent sind wie unter macOS. Benachrichtigungen werden auch angezeigt, wenn das Terminal fokussiert ist, und das Klicken auf eine Benachrichtigung kehrt nicht zum Terminal-Fenster zurück. Ist das normal? Welche Einschränkungen hat die Windows-Plattform?

## Wann Sie diese Funktion nutzen

**Erfahren Sie die Windows-Plattform-Features in den folgenden Szenarien**:
- Sie verwenden opencode-notify auf einem Windows-System
- Sie stellen fest, dass bestimmte macOS-Funktionen unter Windows nicht verfügbar sind
- Sie möchten wissen, wie Sie die verfügbaren Windows-Plattform-Funktionen maximieren

## Kernkonzept

opencode-notify bietet auf der Windows-Plattform **grundlegende Benachrichtigungsfunktionen**, hat aber im Vergleich zu macOS einige funktionale Einschränkungen. Dies wird durch die Betriebssystemmerkmale bestimmt, nicht durch das Plugin.

::: info Warum sind macOS-Funktionen umfangreicher?

macOS bietet leistungsfähigere System-APIs:
- NSUserNotificationCenter unterstützt Klick-Fokus
- AppleScript kann die Front-App erkennen
- System-Sound-API ermöglicht benutzerdefinierte Sounds

Die System-Benachrichtigungs-APIs von Windows und Linux sind relativ grundlegend. opencode-notify ruft auf diesen Plattformen native System-Benachrichtigungen über `node-notifier` auf.
:::

## Übersicht der Windows-Plattform-Funktionen

| Funktion | Windows | Beschreibung |
|--- | --- | ---|
| **Native Benachrichtigungen** | ✅ Unterstützt | Sendet Benachrichtigungen über Windows Toast |
| **Terminal-Erkennung** | ✅ Unterstützt | Erkennt automatisch 37+ Terminal-Emulatoren |
| **Fokus-Erkennung** | ❌ Nicht unterstützt | Kann nicht erkennen, ob das Terminal das Front-Fenster ist |
| **Klick-Fokus** | ❌ Nicht unterstützt | Klicken auf Benachrichtigung wechselt nicht zum Terminal |
| **Benutzerdefinierte Sounds** | ❌ Nicht unterstützt | Verwendet den Standard-Benachrichtigungston des Systems |

### Windows-Benachrichtigungsmechanismus

opencode-notify verwendet auf Windows **Windows Toast**-Benachrichtigungen und ruft native System-APIs über die Bibliothek `node-notifier` auf.

**Benachrichtigungs-Auslöser**:
- Wenn die AI-Aufgabe abgeschlossen ist (session.idle)
- Wenn ein AI-Fehler auftritt (session.error)
- Wenn die AI eine Berechtigung benötigt (permission.updated)
- Wenn die AI eine Frage stellt (tool.execute.before)

::: tip Windows Toast-Benachrichtigungsmerkmale
- Benachrichtigungen werden in der unteren rechten Ecke des Bildschirms angezeigt
- Automatisches Verschwinden (ca. 5 Sekunden)
- Verwendet den Standard-Benachrichtigungston des Systems
- Klicken auf die Benachrichtigung öffnet das Benachrichtigungszentrum (wechselt nicht zum Terminal)
:::

## Terminal-Erkennung

### Automatische Terminal-Erkennung

opencode-notify verwendet die Bibliothek `detect-terminal`, um Ihren verwendeten Terminal-Emulator automatisch zu erkennen.

**Unter Windows unterstützte Terminals**:
- Windows Terminal (empfohlen)
- Git Bash
- ConEmu
- Cmder
- PowerShell
- VS Code integriertes Terminal

::: details Funktionsweise der Terminal-Erkennung
Beim Plugin-Start scannt `detect-terminal()` die Systemprozesse und erkennt den aktuellen Terminal-Typ.

Quellcode-Position: `src/notify.ts:145-147`

```typescript
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
	const terminalName = config.terminal || detectTerminal() || null
	
	if (!terminalName) {
		return { name: null, bundleId: null, processName: null }
	}
	
	return {
		name: terminalName,
		bundleId: null,  // Windows benötigt keine bundleId
		processName: null,  // Windows benötigt keinen Prozessnamen
	}
}
```
:::

### Manuelles Festlegen des Terminals

Wenn die automatische Erkennung fehlschlägt, können Sie den Terminal-Typ manuell in der Konfigurationsdatei angeben.

**Konfigurationsbeispiel**:

```json
{
  "terminal": "Windows Terminal"
}
```

**Verfügbare Terminal-Namen**: Siehe [`detect-terminal` unterstützte Terminal-Liste](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Plattform-Funktionsvergleich

| Funktion | macOS | Windows | Linux |
|--- | --- | --- | ---|
| **Native Benachrichtigungen** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **Benutzerdefinierte Sounds** | ✅ System-Sound-Liste | ❌ System-Standard | ❌ System-Standard |
| **Fokus-Erkennung** | ✅ AppleScript API | ❌ Nicht unterstützt | ❌ Nicht unterstützt |
| **Klick-Fokus** | ✅ activate bundleId | ❌ Nicht unterstützt | ❌ Nicht unterstützt |
| **Terminal-Erkennung** | ✅ 37+ Terminals | ✅ 37+ Terminals | ✅ 37+ Terminals |

### Warum unterstützt Windows keine Fokus-Erkennung?

Im Quellcode gibt die Funktion `isTerminalFocused()` unter Windows direkt `false` zurück:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux gibt direkt false zurück
	// ... macOS-Fokus-Erkennungslogik
}
```

**Gründe**:
- Windows bietet keine Front-App-Abfrage-API ähnlich wie macOS AppleScript
- Windows PowerShell kann das Front-Fenster abrufen, erfordert aber COM-Schnittstellenaufrufe, was komplex zu implementieren ist
- Die aktuelle Version priorisiert Stabilität, die Windows-Fokus-Erkennung wurde noch nicht implementiert

### Warum unterstützt Windows keinen Klick-Fokus?

Im Quellcode setzt die Funktion `sendNotification()` die Option `activate` nur unter macOS:

```typescript
// src/notify.ts:238-240
// macOS-spezifisch: Klicken auf Benachrichtigung fokussiert Terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Gründe**:
- Windows Toast unterstützt den Parameter `activate` nicht
- Windows-Benachrichtigungen können nur über App-IDs verknüpft werden, dynamisches Festlegen des Zielfensters ist nicht möglich
- Klicken auf die Benachrichtigung öffnet das Benachrichtigungszentrum, anstatt ein bestimmtes Fenster zu fokussieren

## Best Practices für die Windows-Plattform

### Konfigurationsempfehlungen

Da Windows keine Fokus-Erkennung unterstützt, wird empfohlen, die Konfiguration anzupassen, um Benachrichtigungsgeräusche zu reduzieren.

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

**Konfigurationsbeschreibung**:
- `notifyChildSessions: false` - Benachrichtigt nur über übergeordnete Sitzungen, vermeidet Unter-Aufgaben-Geräusche
- `quietHours.enabled: true` - Aktiviert Ruhezeiten, vermeidet nächtliche Störungen

### Nicht unterstützte Konfigurationsoptionen

Die folgenden Konfigurationsoptionen sind unter Windows unwirksam:

| Konfigurationsoption | macOS-Effekt | Windows-Effekt |
|--- | --- | ---|
| `sounds.idle` | Spielt Glass-Sound | Verwendet System-Standard-Sound |
| `sounds.error` | Spielt Basso-Sound | Verwendet System-Standard-Sound |
| `sounds.permission` | Spielt Submarine-Sound | Verwendet System-Standard-Sound |

### Nutzungstipps

**Tipp 1: Manuelles Deaktivieren von Benachrichtigungen**

Wenn Sie das Terminal betrachten und nicht gestört werden möchten:

1. Klicken Sie auf das Symbol "Action Center" in der Taskleiste (Windows + A)
2. Deaktivieren Sie die Benachrichtigungen von opencode-notify

**Tipp 2: Verwenden von Ruhezeiten**

Legen Sie Arbeits- und Ruhezeiten fest, um Störungen außerhalb der Arbeitszeit zu vermeiden:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**Tipp 3: Temporäres Deaktivieren des Plugins**

Wenn Sie Benachrichtigungen vollständig deaktivieren müssen, können Sie die Konfigurationsdatei löschen oder die Ruhezeit auf ganztägig einstellen:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "00:00",
    "end": "23:59"
  }
}
```

## Machen Sie mit

### Überprüfen der Windows-Benachrichtigungen

**Schritt 1: Auslösen einer Testbenachrichtigung**

Geben Sie in OpenCode eine einfache Aufgabe ein:

```
Bitte berechnen Sie das Ergebnis von 1+1.
```

**Was Sie sehen sollten**:
- Windows Toast-Benachrichtigung in der unteren rechten Ecke
- Benachrichtigungstitel ist "Ready for review"
- Spielt den Standard-Benachrichtigungston des Systems

**Schritt 2: Testen der Fokus-Unterdrückung (Überprüfung der Nicht-Unterstützung)**

Halten Sie das Terminal-Fenster im Vordergrund und lösen Sie die Aufgabe erneut aus.

**Was Sie sehen sollten**:
- Die Benachrichtigung wird weiterhin angezeigt (da Windows keine Fokus-Erkennung unterstützt)

**Schritt 3: Testen des Klickens auf die Benachrichtigung**

Klicken Sie auf die angezeigte Benachrichtigung.

**Was Sie sehen sollten**:
- Das Benachrichtigungszentrum wird erweitert, nicht zum Terminal-Fenster gewechselt

### Konfigurieren von Ruhezeiten

**Schritt 1: Erstellen der Konfigurationsdatei**

Bearbeiten Sie die Konfigurationsdatei (PowerShell):

```powershell
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**Schritt 2: Hinzufügen der Ruhezeiten-Konfiguration**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Schritt 3: Speichern und Testen**

Warten Sie, bis die aktuelle Zeit in die Ruhezeit fällt, und lösen Sie dann eine Aufgabe aus.

**Was Sie sehen sollten**:
- Keine Benachrichtigung wird angezeigt (Ruhezeit ist wirksam)

## Checkpoint ✅

Nach Abschluss der oben genannten Schritte bestätigen Sie bitte:

- [ ] Windows Toast-Benachrichtigungen werden korrekt angezeigt
- [ ] Benachrichtigungen zeigen den korrekten Aufgabentitel
- [ ] Ruhezeiten-Konfiguration ist wirksam
- [ ] Sie verstehen die unter Windows nicht unterstützten Funktionen

## Häufige Stolpersteine

### Häufiges Problem 1: Benachrichtigungen werden nicht angezeigt

**Ursache**: Windows-Benachrichtigungsberechtigungen wurden nicht erteilt

**Lösung**:

1. Öffnen Sie "Einstellungen" → "System" → "Benachrichtigungen"
2. Stellen Sie sicher, dass "Benachrichtigungen von Apps und anderen Sendern erhalten" aktiviert ist
3. Suchen Sie nach OpenCode und stellen Sie sicher, dass die Benachrichtigungsberechtigung aktiviert ist

### Häufiges Problem 2: Terminal-Erkennung fehlerhaft

**Ursache**: `detect-terminal` kann Ihr Terminal nicht erkennen

**Lösung**:

Geben Sie den Terminal-Typ manuell in der Konfigurationsdatei an:

```json
{
  "terminal": "Windows Terminal"
}
```

### Häufiges Problem 3: Benutzerdefinierte Sounds funktionieren nicht

**Ursache**: Die Windows-Plattform unterstützt keine benutzerdefinierten Sounds

**Hinweis**: Dies ist normal. Windows Toast-Benachrichtigungen verwenden den Standard-Sound des Systems und können nicht über die Konfigurationsdatei geändert werden.

### Häufiges Problem 4: Klicken auf Benachrichtigung fokussiert Terminal nicht

**Ursache**: Windows Toast unterstützt den Parameter `activate` nicht

**Hinweis**: Dies ist eine Einschränkung der Windows-API. Klicken auf die Benachrichtigung öffnet das Benachrichtigungszentrum, Sie müssen manuell zum Terminal-Fenster wechseln.

## Zusammenfassung

In dieser Lektion haben wir gelernt:

- ✅ Die Windows-Plattform unterstützt native Benachrichtigungen und Terminal-Erkennung
- ✅ Windows unterstützt keine Fokus-Erkennung und Klick-Fokus
- ✅ Windows unterstützt keine benutzerdefinierten Sounds
- ✅ Empfohlene Konfiguration (Ruhezeiten, nur übergeordnete Sitzungen benachrichtigen)
- ✅ Lösungen für häufige Probleme

**Wichtige Punkte**:
1. Die Windows-Plattform-Funktionen sind relativ grundlegend, aber die Kernbenachrichtigungsfunktionen sind vollständig
2. Fokus-Erkennung und Klick-Fokus sind macOS-exklusive Funktionen
3. Durch Konfigurieren von Ruhezeiten können Sie Benachrichtigungsgeräusche reduzieren
4. Die Terminal-Erkennung unterstützt manuelle Angabe, was die Kompatibilität erhöht

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Linux-Plattform-Features](../linux/)**.
>
> Sie werden lernen:
> - Linux-Plattform-Benachrichtigungsmechanismus (notify-send)
> - Linux-Terminal-Erkennungsfähigkeiten
> - Funktionsvergleich mit der Windows-Plattform
> - Kompatibilitätsprobleme bei Linux-Distributionen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Windows-Plattform-Einschränkungsprüfung (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Windows-Plattform-Einschränkungsprüfung (Fokus-Erkennung) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS-spezifisch: Klick-Fokus | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Benachrichtigung senden (plattformübergreifend) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Terminal-Erkennung (plattformübergreifend) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Konfiguration laden (plattformübergreifend) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**Wichtige Funktionen**:
- `runOsascript()`: Wird nur unter macOS ausgeführt, gibt unter Windows null zurück
- `isTerminalFocused()`: Gibt unter Windows direkt false zurück
- `sendNotification()`: Setzt den Parameter `activate` nur unter macOS
- `detectTerminalInfo()`: Plattformübergreifende Terminal-Erkennung

**Plattform-Erkennung**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

</details>
