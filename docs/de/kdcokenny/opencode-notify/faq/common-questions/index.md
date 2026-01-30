---
title: "opencode-notify FAQ: Leistungseinfluss, Datenschutz & Plattformkompatibilität erklärt"
sidebarTitle: "Wichtige Fragen verstehen"
subtitle: "Häufig gestellte Fragen: Leistung, Datenschutz & Kompatibilität"
description: "Erfahren Sie, wie opencode-notify den KI-Kontext und Systemressourcen beeinflusst, bestätigen Sie, dass das Plugin vollständig lokal läuft ohne Daten-Upload, verstehen Sie intelligente Benachrichtigungsfilter und Ruhezeiten-Konfiguration, lernen Sie die Kompatibilität mit anderen OpenCode-Plugins und Funktionsunterschiede zwischen macOS/Windows/Linux kennen, und erhalten Sie umfassende Antworten auf häufige Fragen zu Benachrichtigungsfrequenz, Datenschutz, Ressourcennutzung, Terminal-Erkennungsfehlern und Konfigurationsdateipfaden."
tags:
  - "FAQ"
  - "Leistung"
  - "Datenschutz"
prerequisite:
  - "start-quick-start"
order: 120
---

# Häufig gestellte Fragen: Leistung, Datenschutz & Kompatibilität

## Was Sie nach diesem Kurs können werden

- Den Leistungseinfluss und die Ressourcennutzung des Plugins verstehen
- Datenschutz- und Sicherheitsgarantien kennen
- Benachrichtigungsstrategien und Konfigurationstechniken beherrschen
- Plattformunterschiede und Kompatibilität verstehen

---

## Leistungsbezogene Fragen

### Erhöht es den KI-Kontext?

**Nein**. Das Plugin verwendet einen ereignisgesteuerten Modus und fügt dem KI-Dialog keine Tools oder Prompts hinzu.

Aus der Quellcode-Implementierung:

| Komponente | Typ | Implementierung | Einfluss auf Kontext |
| --- | --- | --- | --- |
| Event-Listener | Event | Überwacht `session.idle`, `session.error`, `permission.updated` Events | ✅ Kein Einfluss |
| Tool-Hook | Hook | Überwacht `question`-Tool über `tool.execute.before` | ✅ Kein Einfluss |
| Dialoginhalt | - | Liest, modifiziert oder injiziert keine Dialoginhalte | ✅ Kein Einfluss |

Das Plugin ist im Quellcode nur für **Überwachung und Benachrichtigung** zuständig, der KI-Dialogkontext bleibt vollständig unbeeinflusst.

### Wie viele Systemressourcen werden verbraucht?

**Sehr wenig**. Das Plugin verwendet ein "Startup-Cache + Event-Trigger"-Design:

1. **Konfigurationsladen**: Plugin liest beim Start einmal die Konfigurationsdatei (`~/.config/opencode/kdco-notify.json`), danach keine weiteren Lesevorgänge
2. **Terminal-Erkennung**: Erkennt beim Start den Terminal-Typ und cached Informationen (Name, Bundle ID, Prozessname), nachfolgende Events verwenden den Cache direkt
3. **Ereignisgesteuert**: Nur wenn die KI bestimmte Events auslöst, führt das Plugin Benachrichtigungslogik aus

Ressourcennutzungsmerkmale:

| Ressourcentyp | Nutzung | Beschreibung |
| --- | --- | --- |
| CPU | Fast 0 | Läuft nur kurz bei Event-Auslösung |
| Speicher | < 5 MB | Geht nach Start in Standby-Modus |
| Festplatte | < 100 KB | Konfigurationsdatei und Code selbst |
| Netzwerk | 0 | Keine Netzwerkanfragen |

---

## Datenschutz & Sicherheit

### Werden Daten auf Server hochgeladen?

**Nein**. Das Plugin läuft vollständig lokal und führt keine Daten-Uploads durch.

**Datenschutzgarantien**:

| Datentyp | Verarbeitung | Upload |
| --- | --- | --- |
| KI-Dialoginhalte | Nicht gelesen, nicht gespeichert | ❌ Nein |
| Sitzungsinformationen (Titel) | Nur für Benachrichtigungstext verwendet | ❌ Nein |
| Fehlerinformationen | Nur für Benachrichtigungstext (max. 100 Zeichen) | ❌ Nein |
| Terminal-Informationen | Lokal erkannt und gecached | ❌ Nein |
| Konfigurationsinformationen | Lokale Datei (`~/.config/opencode/`) | ❌ Nein |
| Benachrichtigungsinhalte | Über native System-Benachrichtigungs-API gesendet | ❌ Nein |

**Technische Implementierung**:

Das Plugin verwendet native System-Benachrichtigungen:
- macOS: Ruft `NSUserNotificationCenter` über `node-notifier` auf
- Windows: Ruft `SnoreToast` über `node-notifier` auf
- Linux: Ruft `notify-send` über `node-notifier` auf

Alle Benachrichtigungen werden lokal ausgelöst und nicht über OpenCode-Cloud-Services gesendet.

### Stiehlt das Plugin meine Sitzungsinhalte?

**Nein**. Das Plugin liest nur **notwendige Metadaten**:

| Gelesene Daten | Verwendungszweck | Einschränkung |
| --- | --- | --- |
| Sitzungstitel (title) | Benachrichtigungstext | Nur erste 50 Zeichen |
| Fehlerinformation (error) | Benachrichtigungstext | Nur erste 100 Zeichen |
| Terminal-Informationen | Fokuserkennung und Klick-Fokussierung | Liest keine Terminal-Inhalte |
| Konfigurationsdatei | Benutzerdefinierte Einstellungen | Lokale Datei |

Im Quellcode gibt es keine Logik zum Lesen von Dialognachrichten (messages) oder Benutzereingaben (user input).

---

## Benachrichtigungsstrategie

### Werde ich mit Benachrichtigungen bombardiert?

**Nein**. Das Plugin verfügt über mehrere intelligente Filtermechanismen, um Benachrichtigungsbombardement zu vermeiden.

**Standard-Benachrichtigungsstrategie**:

| Typ | Event/Tool | Benachrichtigung | Grund |
| --- | --- | --- | --- |
| Event | Eltern-Sitzung abgeschlossen (session.idle) | ✅ Ja | Hauptaufgabe abgeschlossen |
| Event | Unter-Sitzung abgeschlossen (session.idle) | ❌ Nein | Eltern-Sitzung benachrichtigt einheitlich |
| Event | Sitzungsfehler (session.error) | ✅ Ja | Erfordert sofortige Behandlung |
| Event | Berechtigungsanfrage (permission.updated) | ✅ Ja | KI wartet blockierend |
| Tool-Hook | Frage-Anfrage (tool.execute.before - question) | ✅ Ja | KI benötigt Eingabe |

**Intelligente Filtermechanismen**:

1. **Nur Eltern-Sitzungen benachrichtigen**
   - Quellcode: `notify.ts:256-259`
   - Standardkonfiguration: `notifyChildSessions: false`
   - Vermeidet viele Benachrichtigungen, wenn KI Aufgaben in Unteraufgaben aufteilt

2. **Terminal-Fokus-Unterdrückung** (macOS)
   - Quellcode: `notify.ts:265`
   - Logik: Wenn Terminal im Vordergrund ist, keine Benachrichtigung senden (eingebautes Verhalten, keine Konfiguration erforderlich)
   - Vermeidet "Benachrichtigung während man Terminal ansieht"-Wiederholungen
   - **Hinweis**: Diese Funktion ist nur auf macOS verfügbar (benötigt Terminal-Informationen zur Erkennung)

3. **Ruhezeiten**
   - Quellcode: `notify.ts:262`, `notify.ts:181-199`
   - Standardkonfiguration: `quietHours: { enabled: false, start: "22:00", end: "08:00" }`
   - Konfigurierbar, vermeidet nächtliche Störungen

4. **Berechtigungsanfragen immer benachrichtigen**
   - Quellcode: `notify.ts:319`
   - Grund: KI wartet blockierend auf Benutzerautorisierung, muss rechtzeitig benachrichtigt werden
   - Keine Eltern-Sitzungs-Prüfung

### Kann ich nur bestimmte Benachrichtigungstypen empfangen?

**Ja**. Obwohl das Plugin keine separaten Benachrichtigungsschalter hat, können Sie dies über Ruhezeiten und Terminal-Fokuserkennung erreichen:

- **Nur dringende Benachrichtigungen empfangen**: Terminal-Fokuserkennung ist eingebautes Verhalten, wenn Sie im Terminal sind, erhalten Sie keine Benachrichtigungen (macOS)
- **Nur nächtliche Benachrichtigungen empfangen**: Aktivieren Sie Ruhezeiten (z.B. 09:00-18:00), umgekehrte Nutzung

Wenn Sie feinere Kontrolle benötigen, können Sie ein Feature Request einreichen.

---

## Plugin-Kompatibilität

### Kollidiert es mit anderen OpenCode-Plugins?

**Nein**. Das Plugin integriert sich über die Standard-OpenCode-Plugin-API und modifiziert weder KI-Verhalten noch stört es andere Plugins.

**Integrationsmethode**:

| Komponente | Integrationsmethode | Kollisionsrisiko |
| --- | --- | --- |
| Event-Listener | OpenCode SDK `event`-Hook | ❌ Keine Kollision |
| Tool-Hook | OpenCode Plugin API `tool.execute.before`-Hook | ❌ Keine Kollision (überwacht nur `question`-Tool) |
| Sitzungsabfrage | OpenCode SDK `client.session.get()` | ❌ Keine Kollision (nur lesen, nicht schreiben) |
| Benachrichtigungssendung | `node-notifier` separater Prozess | ❌ Keine Kollision |

**Mögliche koexistierende Plugins**:

- Offizielle OpenCode-Plugins (wie `opencode-coder`)
- Drittanbieter-Plugins (wie `opencode-db`, `opencode-browser`)
- Benutzerdefinierte Plugins

Alle Plugins laufen parallel über die Standard-Plugin-API, ohne sich gegenseitig zu stören.

### Welche Plattformen werden unterstützt? Gibt es Funktionsunterschiede?

**Unterstützt macOS, Windows, Linux drei Hauptplattformen, aber mit Funktionsunterschieden**.

| Funktion | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Native Benachrichtigungen | ✅ Unterstützt | ✅ Unterstützt | ✅ Unterstützt |
| Benutzerdefinierte Sounds | ✅ Unterstützt | ❌ Nicht unterstützt | ❌ Nicht unterstützt |
| Terminal-Fokuserkennung | ✅ Unterstützt | ❌ Nicht unterstützt | ❌ Nicht unterstützt |
| Klick-Benachrichtigung-Fokussierung | ✅ Unterstützt | ❌ Nicht unterstützt | ❌ Nicht unterstützt |
| Automatische Terminal-Erkennung | ✅ Unterstützt | ✅ Unterstützt | ✅ Unterstützt |
| Ruhezeiten | ✅ Unterstützt | ✅ Unterstützt | ✅ Unterstützt |

**Gründe für Plattformunterschiede**:

| Plattform | Unterschiedserklärung |
| --- | --- |
| macOS | System bietet umfangreiche Benachrichtigungs-APIs und Anwendungsverwaltungsschnittstellen (wie `osascript`), unterstützt Sounds, Fokuserkennung, Klick-Fokussierung |
| Windows | System-Benachrichtigungs-API hat begrenzte Funktionen, unterstützt keine Anwendungsebenen-Vordergrunderkennung und Sound-Anpassung |
| Linux | Abhängig von `notify-send`-Standard, Funktionen ähnlich wie Windows |

**Plattformübergreifende Kernfunktionen**:

Unabhängig von der verwendeten Plattform sind folgende Kernfunktionen verfügbar:
- Aufgabenabschluss-Benachrichtigungen (session.idle)
- Fehlerbenachrichtigungen (session.error)
- Berechtigungsanfrage-Benachrichtigungen (permission.updated)
- Frage-Anfrage-Benachrichtigungen (tool.execute.before)
- Ruhezeiten-Konfiguration

---

## Terminal & System

### Welche Terminals werden unterstützt? Wie wird erkannt?

**Unterstützt 37+ Terminal-Emulatoren**.

Das Plugin verwendet die [`detect-terminal`](https://github.com/jonschlinkert/detect-terminal)-Bibliothek zur automatischen Terminal-Erkennung, unterstützte Terminals umfassen:

**macOS-Terminals**:
- Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- macOS Terminal, Hyper, Warp
- VS Code integriertes Terminal (Code / Code - Insiders)

**Windows-Terminals**:
- Windows Terminal, Git Bash, ConEmu, Cmder
- PowerShell, CMD (über Standard-Erkennung)

**Linux-Terminals**:
- gnome-terminal, konsole, xterm, lxterminal
- terminator, tilix, alacritty, kitty

**Erkennungsmechanismus**:

1. **Automatische Erkennung**: Plugin ruft beim Start `detectTerminal()`-Bibliothek auf
2. **Manuelle Überschreibung**: Benutzer kann im Konfigurationsfeld `terminal` angeben, um automatische Erkennung zu überschreiben
3. **macOS-Mapping**: Terminal-Name wird auf Prozessname gemappt (z.B. `ghostty` → `Ghostty`), für Fokuserkennung verwendet

**Konfigurationsbeispiel**:

```json
{
  "terminal": "ghostty"
}
```

### Was passiert, wenn Terminal-Erkennung fehlschlägt?

**Das Plugin funktioniert weiterhin normal, nur die Fokuserkennungsfunktion ist deaktiviert**.

**Fehlerbehandlungslogik**:

| Fehlerszenario | Verhalten | Auswirkung |
| --- | --- | --- |
| `detectTerminal()` gibt `null` zurück | Terminal-Informationen sind `{ name: null, bundleId: null, processName: null }` | Keine Fokuserkennung, aber Benachrichtigungen werden normal gesendet |
| macOS `osascript`-Ausführung schlägt fehl | Bundle ID-Abruf schlägt fehl | macOS Klick-Fokussierungsfunktion deaktiviert, aber Benachrichtigungen normal |
| `terminal`-Wert in Konfigurationsdatei ungültig | Verwendet automatisches Erkennungsergebnis | Wenn automatische Erkennung auch fehlschlägt, keine Fokuserkennung |

Relevante Logik im Quellcode (`notify.ts:149-150`):

```typescript
if (!terminalName) {
  return { name: null, bundleId: null, processName: null }
}
```

**Lösungsmethode**:

Wenn Terminal-Erkennung fehlschlägt, können Sie den Terminal-Typ manuell angeben:

```json
{
  "terminal": "iterm2"
}
```

---

## Konfiguration & Fehlerbehebung

### Wo ist die Konfigurationsdatei? Wie wird sie geändert?

**Konfigurationsdateipfad**: `~/.config/opencode/kdco-notify.json`

**Vollständiges Konfigurationsbeispiel**:

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
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

**Schritte zur Konfigurationsänderung**:

1. Terminal öffnen, Konfigurationsdatei bearbeiten:
   ```bash
   # macOS/Linux
   nano ~/.config/opencode/kdco-notify.json
   
   # Windows
   notepad %USERPROFILE%\.config\opencode\kdco-notify.json
   ```

2. Konfigurationsoptionen ändern (siehe obiges Beispiel)

3. Datei speichern, Konfiguration wird automatisch wirksam (kein Neustart erforderlich)

### Was passiert, wenn die Konfigurationsdatei beschädigt ist?

**Das Plugin verwendet die Standardkonfiguration und behandelt Fehler stillschweigend**.

**Fehlerbehandlungslogik** (`notify.ts:110-113`):

```typescript
} catch {
  // Config doesn't exist or is invalid, use defaults
  return DEFAULT_CONFIG
}
```

**Lösungsmethode**:

Wenn die Konfigurationsdatei beschädigt ist (JSON-Formatfehler), fällt das Plugin auf die Standardkonfiguration zurück. Reparaturschritte:

1. Beschädigte Konfigurationsdatei löschen:
   ```bash
   rm ~/.config/opencode/kdco-notify.json
   ```

2. Plugin arbeitet mit Standardkonfiguration weiter

3. Wenn benutzerdefinierte Konfiguration benötigt wird, Konfigurationsdatei neu erstellen

---

## Zusammenfassung dieser Lektion

Diese Lektion beantwortet die häufigsten Benutzerfragen:

- **Leistungseinfluss**: Plugin erhöht nicht den KI-Kontext, Ressourcennutzung sehr gering (CPU fast 0, Speicher < 5 MB)
- **Datenschutz & Sicherheit**: Läuft vollständig lokal, lädt keine Daten hoch, liest nur notwendige Metadaten
- **Benachrichtigungsstrategie**: Intelligente Filtermechanismen (nur Eltern-Sitzungen benachrichtigen, macOS Terminal-Fokus-Unterdrückung, Ruhezeiten)
- **Plugin-Kompatibilität**: Keine Kollision mit anderen Plugins, unterstützt drei Hauptplattformen mit Funktionsunterschieden
- **Terminal-Unterstützung**: Unterstützt 37+ Terminals, funktioniert weiterhin normal bei Erkennungsfehlern

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Event-Typen-Erklärung](../../appendix/event-types/)** kennen.
>
> Sie werden lernen:
> - Die vier OpenCode-Event-Typen, die das Plugin überwacht
> - Auslösezeitpunkt und Benachrichtigungsinhalt jedes Events
> - Event-Filterregeln (Eltern-Sitzungs-Prüfung, Ruhezeiten, Terminal-Fokus)
> - Event-Verarbeitungsunterschiede zwischen verschiedenen Plattformen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisiert: 2026-01-27

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Plugin-Start & Konfigurationsladen | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L357-L364) | 357-364 |
| Event-Listener-Logik | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L372-L400) | 372-400 |
| Eltern-Sitzungs-Prüfung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Ruhezeiten-Prüfung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Terminal-Fokuserkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Konfigurationsdatei-Laden | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Terminal-Informationserkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Standardkonfigurationsdefinition | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |

**Wichtige Konstanten**:
- `DEFAULT_CONFIG`: Standardkonfiguration (nur Eltern-Sitzungen benachrichtigen, Glass/Basso/Submarine-Sounds, Ruhezeiten standardmäßig deaktiviert)

**Wichtige Funktionen**:
- `loadConfig()`: Lädt Benutzerkonfiguration und führt mit Standardwerten zusammen
- `detectTerminalInfo()`: Erkennt Terminal-Informationen und cached sie
- `isQuietHours()`: Prüft, ob aktuelle Zeit in Ruhezeit liegt
- `isTerminalFocused()`: Prüft, ob Terminal im Vordergrund ist (macOS)
- `isParentSession()`: Prüft, ob Sitzung eine Eltern-Sitzung ist

</details>
