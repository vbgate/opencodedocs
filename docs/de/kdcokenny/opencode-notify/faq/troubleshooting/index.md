---
title: "Fehlerbehebung: Benachrichtigungen erscheinen nicht, Fokuserkennung funktioniert nicht & weitere häufige Probleme"
sidebarTitle: "Benachrichtigungen erscheinen nicht"
subtitle: "Fehlerbehebung: Benachrichtigungen erscheinen nicht, Fokuserkennung funktioniert nicht & weitere häufige Probleme"
description: "Lösen Sie häufige Probleme bei der Verwendung von opencode-notify, einschließlich nicht erscheinender Benachrichtigungen, fehlerhafter Fokuserkennung, Konfigurationsfehler und nicht abspielender Sounds. Lernen Sie, macOS-Benachrichtigungsberechtigungen, Ruhezeiten-Einstellungen und Terminal-Erkennung zu überprüfen, um das Plugin schnell wieder zum Laufen zu bringen."
tags:
  - "Fehlerbehebung"
  - "FAQ"
prerequisite:
  - "start-quick-start"
order: 110
---

# Fehlerbehebung: Benachrichtigungen erscheinen nicht, Fokuserkennung funktioniert nicht & weitere häufige Probleme

## Was Sie nach diesem Kurs können werden

- Schnell die Ursache für nicht erscheinende Benachrichtigungen identifizieren
- macOS-Benachrichtigungsberechtigungsprobleme lösen
- Probleme mit fehlerhafter Fokuserkennung beheben
- Konfigurationsdatei-Formatfehler korrigieren
- Plattformspezifische Funktionsunterschiede verstehen

## Ihre aktuelle Situation

Die KI hat eine Aufgabe abgeschlossen, aber Sie haben keine Benachrichtigung erhalten; oder nach dem Klicken auf die Benachrichtigung wurde das Terminal nicht in den Vordergrund gebracht. Sie wissen nicht, wo das Problem liegt und wo Sie mit der Fehlersuche beginnen sollen.

## Wann Sie diese Anleitung verwenden sollten

- Nach der ersten Installation des Plugins haben Sie keine Benachrichtigungen erhalten
- Nach einem Plugin- oder System-Update funktionieren Benachrichtigungen plötzlich nicht mehr
- Sie möchten bestimmte Benachrichtigungsverhalten deaktivieren, aber die Konfiguration scheint nicht zu wirken
- Nach dem Wechsel von macOS zu Windows/Linux stellen Sie fest, dass bestimmte Funktionen nicht verfügbar sind

## Kernkonzept

Der Arbeitsablauf von opencode-notify ist relativ einfach, umfasst aber mehrere Komponenten: OpenCode SDK → Event-Listener → Filterlogik → Betriebssystem-Benachrichtigung. Ein Problem in einer dieser Komponenten kann dazu führen, dass Benachrichtigungen nicht erscheinen.

Der Schlüssel zur Fehlerbehebung ist, **jede Komponente der Reihe nach zu überprüfen**, beginnend mit den wahrscheinlichsten Ursachen. 80% der Probleme können durch die folgenden 5 Kategorien gelöst werden:

1. **Benachrichtigungen erscheinen nicht** - Das häufigste Problem
2. **Fokuserkennung funktioniert nicht** (nur macOS)
3. **Konfiguration wirkt nicht** - JSON-Format oder Pfadfehler
4. **Sounds werden nicht abgespielt** (nur macOS)
5. **Plattformunterschiede** - Bestimmte Funktionen werden nicht unterstützt

---

## Problem 1: Benachrichtigungen erscheinen nicht

Dies ist das häufigste Problem mit 6 möglichen Ursachen. Überprüfen Sie der Reihe nach:

### 1.1 Überprüfen Sie, ob das Plugin korrekt installiert ist

**Symptom**: OpenCode läuft normal, aber Sie haben nie eine Benachrichtigung erhalten.

**Fehlerbehebungsschritte**:

```bash
# Überprüfen Sie, ob das Plugin installiert ist
ls ~/.opencode/plugin/kdco-notify

# Falls nicht vorhanden, neu installieren
ocx add kdco/notify
```

**Erwartetes Ergebnis**: Das Verzeichnis `~/.opencode/plugin/kdco-notify` existiert und enthält `package.json` und `src/notify.ts` sowie andere Dateien.

::: tip Manuelle Installationsprüfung
Wenn Sie manuell installiert haben, stellen Sie sicher:
1. Abhängigkeiten sind installiert: `npm install node-notifier detect-terminal`
2. Plugin-Dateien befinden sich am richtigen Ort: `~/.opencode/plugin/`
3. OpenCode wurde neu gestartet (Plugin-Änderungen erfordern einen Neustart)
:::

### 1.2 Überprüfen Sie die macOS-Benachrichtigungsberechtigungen

**Symptom**: Nur für macOS-Benutzer - Plugin ist installiert, aber Sie haben nie eine Benachrichtigung erhalten.

**Ursache**: macOS erfordert eine explizite Berechtigung für Terminal-Anwendungen, um Benachrichtigungen zu senden.

**Fehlerbehebungsschritte**:

```bash
# 1. Systemeinstellungen öffnen
# macOS Ventura und neuer: Systemeinstellungen → Mitteilungen & Fokus
# Ältere macOS-Versionen: Systemeinstellungen → Mitteilungen

# 2. Finden Sie Ihre Terminal-Anwendung (z.B. Ghostty, iTerm2, Terminal.app)
# 3. Stellen Sie sicher, dass "Mitteilungen erlauben" aktiviert ist
# 4. Stellen Sie sicher, dass "Auf Sperrbildschirm" und "Banner anzeigen" aktiviert sind
```

**Erwartetes Ergebnis**: Ihre Terminal-Anwendung erscheint in den Benachrichtigungseinstellungen und der Schalter "Mitteilungen erlauben" ist grün.

::: warning Häufiger Fehler
OpenCode selbst erscheint nicht in den Benachrichtigungseinstellungen. Sie müssen die **Terminal-Anwendung** (Ghostty, iTerm2, Terminal.app usw.) autorisieren, nicht OpenCode.
:::

### 1.3 Überprüfen Sie die Ruhezeiten-Einstellungen

**Symptom**: Keine Benachrichtigungen zu bestimmten Zeiten, aber zu anderen Zeiten funktioniert es.

**Ursache**: Ruhezeiten sind in der Konfigurationsdatei aktiviert.

**Fehlerbehebungsschritte**:

```bash
# Konfigurationsdatei überprüfen
cat ~/.config/opencode/kdco-notify.json
```

**Lösung**:

```json
{
  "quietHours": {
    "enabled": false,  // Auf false setzen, um Ruhezeiten zu deaktivieren
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Erwartetes Ergebnis**: `quietHours.enabled` ist `false`, oder die aktuelle Zeit liegt nicht innerhalb der Ruhezeiten.

::: tip Mitternachtsübergreifende Ruhezeiten
Ruhezeiten unterstützen mitternachtsübergreifende Zeiträume (z.B. 22:00-08:00), dies ist korrektes Verhalten. Wenn die aktuelle Zeit zwischen 22 Uhr abends und 8 Uhr morgens liegt, werden Benachrichtigungen unterdrückt.
:::

### 1.4 Überprüfen Sie den Terminal-Fensterfokus

**Symptom**: Wenn Sie das Terminal betrachten, erhalten Sie keine Benachrichtigungen.

**Ursache**: Dies ist **erwartetes Verhalten**, kein Bug. Der Fokuserkennungsmechanismus unterdrückt Benachrichtigungen, wenn Sie das Terminal betrachten, um redundante Erinnerungen zu vermeiden.

**Fehlerbehebungsschritte**:

**Überprüfen Sie, ob das Terminal fokussiert ist**:
1. Wechseln Sie zu einer anderen Anwendung (z.B. Browser, VS Code)
2. Lassen Sie die KI eine Aufgabe ausführen
3. Warten Sie auf den Abschluss der Aufgabe

**Erwartetes Ergebnis**: Wenn Sie sich in einer anderen Anwendung befinden, erscheinen Benachrichtigungen normal.

::: tip Erklärung zur Fokuserkennung
Fokuserkennung ist ein eingebautes Verhalten und kann nicht über die Konfiguration deaktiviert werden. Das Plugin unterdrückt standardmäßig Benachrichtigungen, wenn das Terminal fokussiert ist, um redundante Erinnerungen zu vermeiden. Dies ist das beabsichtigte Designverhalten.
:::

### 1.5 Überprüfen Sie die Unter-Sitzungsfilterung

**Symptom**: Die KI hat mehrere Unteraufgaben ausgeführt, aber Sie haben nicht für jede Unteraufgabe eine Benachrichtigung erhalten.

**Ursache**: Dies ist **erwartetes Verhalten**. Das Plugin benachrichtigt standardmäßig nur über Eltern-Sitzungen, nicht über Unter-Sitzungen, um Benachrichtigungsbombardement zu vermeiden.

**Fehlerbehebungsschritte**:

**Verstehen Sie Eltern-Sitzungen und Unter-Sitzungen**:
- Eltern-Sitzung: Eine Aufgabe, die Sie direkt der KI gegeben haben (z.B. "Optimiere die Codebasis")
- Unter-Sitzung: Unteraufgaben, die die KI selbst aufgeteilt hat (z.B. "Optimiere src/components", "Optimiere src/utils")

**Wenn Sie tatsächlich Unter-Sitzungsbenachrichtigungen benötigen**:

```json
{
  "notifyChildSessions": true
}
```

**Erwartetes Ergebnis**: Sie erhalten eine Benachrichtigung, wenn jede Unter-Sitzung abgeschlossen ist.

::: tip Empfohlene Vorgehensweise
Sofern Sie nicht mehrere parallele Aufgaben überwachen, behalten Sie `notifyChildSessions: false` bei und empfangen Sie nur Eltern-Sitzungsbenachrichtigungen.
:::

### 1.6 Überprüfen Sie, ob die Konfigurationsdatei gelöscht oder umbenannt wurde

**Symptom**: Früher gab es Benachrichtigungen, plötzlich erscheinen sie nicht mehr.

**Fehlerbehebungsschritte**:

```bash
# Überprüfen Sie, ob die Konfigurationsdatei existiert
ls -la ~/.config/opencode/kdco-notify.json
```

**Lösung**:

Wenn die Konfigurationsdatei gelöscht wurde oder der Pfad falsch ist, verwendet das Plugin die Standardkonfiguration:

**Konfigurationsdatei löschen, auf Standard zurücksetzen**:

```bash
# Konfigurationsdatei löschen, Standardeinstellungen verwenden
rm ~/.config/opencode/kdco-notify.json
```

**Erwartetes Ergebnis**: Das Plugin beginnt wieder, Benachrichtigungen zu senden (mit Standardkonfiguration).

---

## Problem 2: Fokuserkennung funktioniert nicht (nur macOS)

**Symptom**: Sie erhalten immer noch Benachrichtigungen, wenn Sie das Terminal betrachten, die Fokuserkennung scheint nicht zu funktionieren.

### 2.1 Überprüfen Sie, ob das Terminal korrekt erkannt wird

**Ursache**: Das Plugin verwendet die `detect-terminal`-Bibliothek zur automatischen Terminal-Erkennung. Wenn die Erkennung fehlschlägt, funktioniert die Fokuserkennung nicht.

**Fehlerbehebungsschritte**:

```bash
# Überprüfen Sie, ob die Terminal-Erkennung funktioniert
node -e "console.log(require('detect-terminal')())"
```

**Erwartetes Ergebnis**: Ausgabe Ihres Terminal-Namens (z.B. `ghostty`, `iterm2` usw.).

Wenn die Ausgabe leer ist, ist die Terminal-Erkennung fehlgeschlagen.

### 2.2 Terminal-Typ manuell angeben

**Wenn die automatische Erkennung fehlschlägt, können Sie manuell angeben**:

```json
{
  "terminal": "ghostty"  // Ersetzen Sie durch Ihren Terminal-Namen
}
```

**Unterstützte Terminal-Namen** (Kleinbuchstaben):

| Terminal | Name | Terminal | Name |
| --- | --- | --- | --- |
| Ghostty | `ghostty` | Kitty | `kitty` |
| iTerm2 | `iterm2` oder `iterm` | WezTerm | `wezterm` |
| Alacritty | `alacritty` | macOS Terminal | `terminal` oder `apple_terminal` |
| Hyper | `hyper` | Warp | `warp` |
| VS Code Terminal | `vscode` | VS Code Insiders | `vscode-insiders` |

::: tip Prozessnamenzuordnung
Das Plugin hat intern eine Zuordnungstabelle von Terminal-Namen zu macOS-Prozessnamen. Wenn Sie `terminal` manuell angeben, stellen Sie sicher, dass Sie einen Namen aus der Zuordnungstabelle verwenden (Zeilen 71-84).
:::

---

## Problem 3: Konfiguration wirkt nicht

**Symptom**: Sie haben die Konfigurationsdatei geändert, aber das Plugin-Verhalten hat sich nicht geändert.

### 3.1 Überprüfen Sie, ob das JSON-Format korrekt ist

**Häufige Fehler**:

```json
// ❌ Fehler: Fehlende Anführungszeichen
{
  notifyChildSessions: true
}

// ❌ Fehler: Abschließendes Komma
{
  "notifyChildSessions": true,
}

// ❌ Fehler: Kommentare werden nicht unterstützt
{
  "notifyChildSessions": true  // Dies führt zu einem JSON-Parsing-Fehler
}
```

**Korrektes Format**:

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

**JSON-Format validieren**:

```bash
# JSON-Format mit jq validieren
cat ~/.config/opencode/kdco-notify.json | jq '.'

# Wenn formatiertes JSON ausgegeben wird, ist das Format korrekt
# Wenn ein Fehler gemeldet wird, gibt es ein Problem mit dem JSON
```

### 3.2 Überprüfen Sie den Konfigurationsdateipfad

**Symptom**: Sie haben eine Konfigurationsdatei erstellt, aber das Plugin scheint sie nicht zu lesen.

**Korrekter Pfad**:

```
~/.config/opencode/kdco-notify.json
```

**Fehlerbehebungsschritte**:

```bash
# Überprüfen Sie, ob die Konfigurationsdatei existiert
ls -la ~/.config/opencode/kdco-notify.json

# Falls nicht vorhanden, Verzeichnis und Datei erstellen
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/kdco-notify.json << 'EOF'
{
  "notifyChildSessions": false
}
EOF
```

### 3.3 OpenCode neu starten

**Ursache**: Das Plugin lädt die Konfiguration einmal beim Start, nach Änderungen ist ein Neustart erforderlich.

**Fehlerbehebungsschritte**:

```bash
# OpenCode vollständig neu starten
# 1. OpenCode beenden
# 2. OpenCode neu starten
```

---

## Problem 4: Sounds werden nicht abgespielt (nur macOS)

**Symptom**: Benachrichtigungen erscheinen normal, aber es werden keine Sounds abgespielt.

### 4.1 Überprüfen Sie, ob der Sound-Name korrekt ist

**Unterstützte macOS-Sounds**:

| Sound-Name | Beschreibung | Sound-Name | Beschreibung |
| --- | --- | --- | --- |
| Basso | Tiefer Ton | Blow | Blasgeräusch |
| Bottle | Flaschengeräusch | Frog | Froschgeräusch |
| Funk | Funk | Glass | Glasgeräusch (Standard für Aufgabenabschluss) |
| Hero | Held | Morse | Morsecode |
| Ping | Ping-Ton | Pop | Blasengeräusch |
| Purr | Schnurrgeräusch | Sosumi | Sosumi |
| Submarine | U-Boot (Standard für Berechtigungsanfrage) | Tink | Klingelton |

**Konfigurationsbeispiel**:

```json
{
  "sounds": {
    "idle": "Glass",      // Sound bei Aufgabenabschluss
    "error": "Basso",    // Fehler-Sound
    "permission": "Submarine",  // Sound bei Berechtigungsanfrage
    "question": "Ping"   // Sound bei Frage-Anfrage (optional)
  }
}
```

### 4.2 Überprüfen Sie die Systemlautstärke-Einstellungen

**Fehlerbehebungsschritte**:

```bash
# Systemeinstellungen öffnen → Ton → Ausgabelautstärke
# Stellen Sie sicher, dass die Lautstärke nicht stummgeschaltet ist und auf einem angemessenen Niveau liegt
```

### 4.3 Andere Plattformen unterstützen keine benutzerdefinierten Sounds

**Symptom**: Windows- oder Linux-Benutzer haben Sounds konfiguriert, aber es gibt keinen Ton.

**Ursache**: Benutzerdefinierte Sounds sind eine macOS-exklusive Funktion, Windows und Linux unterstützen dies nicht.

**Lösung**: Windows- und Linux-Benutzer erhalten Benachrichtigungen, aber die Sounds werden von den Systemstandardeinstellungen gesteuert und können nicht über das Plugin konfiguriert werden.

::: tip Windows/Linux-Sounds
Windows- und Linux-Benachrichtigungssounds werden von den Systemeinstellungen gesteuert:
- Windows: Einstellungen → System → Benachrichtigungen → Benachrichtigungston auswählen
- Linux: Desktop-Umgebungseinstellungen → Benachrichtigungen → Sounds
:::

---

## Problem 5: Klick auf Benachrichtigung fokussiert nicht (nur macOS)

**Symptom**: Nach dem Klicken auf die Benachrichtigung wird das Terminal-Fenster nicht in den Vordergrund gebracht.

### 5.1 Überprüfen Sie, ob die Bundle ID erfolgreich abgerufen wurde

**Ursache**: Die Klick-Fokussierungsfunktion erfordert das Abrufen der Bundle ID des Terminals (z.B. `com.ghostty.Ghostty`). Wenn dies fehlschlägt, funktioniert die Fokussierung nicht.

**Fehlerbehebungsschritte**:

Das Plugin erkennt beim Start automatisch das Terminal und ruft die Bundle ID ab. Wenn dies fehlschlägt, ist die Klick-Fokussierungsfunktion nicht verfügbar.

**Häufige Ursachen**:
1. Terminal ist nicht in der Zuordnungstabelle (z.B. benutzerdefiniertes Terminal)
2. `osascript`-Ausführung fehlgeschlagen (macOS-Berechtigungsproblem)

**Lösung**: Terminal-Typ manuell angeben (siehe Abschnitt 2.2).

### 5.2 Überprüfen Sie die Systemzugriffsrechte für Bedienungshilfen

**Ursache**: macOS benötigt "Bedienungshilfen"-Berechtigungen, um Fenster anderer Anwendungen zu steuern.

**Fehlerbehebungsschritte**:

```bash
# Systemeinstellungen öffnen → Datenschutz & Sicherheit → Bedienungshilfen
# Stellen Sie sicher, dass die Terminal-Anwendung Bedienungshilfen-Berechtigungen hat
```

**Erwartetes Ergebnis**: Ihre Terminal-Anwendung (Ghostty, iTerm2 usw.) erscheint in der Bedienungshilfen-Liste und der Schalter ist aktiviert.

---

## Problem 6: Plattformspezifische Funktionsunterschiede

**Symptom**: Nach dem Wechsel von macOS zu Windows/Linux stellen Sie fest, dass bestimmte Funktionen nicht verfügbar sind.

### 6.1 Funktionsvergleichstabelle

| Funktion | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Native Benachrichtigungen | ✅ | ✅ | ✅ |
| Benutzerdefinierte Sounds | ✅ | ❌ | ❌ |
| Fokuserkennung | ✅ | ❌ | ❌ |
| Klick-Benachrichtigung-Fokussierung | ✅ | ❌ | ❌ |
| Terminal-Erkennung | ✅ | ✅ | ✅ |
| Ruhezeiten | ✅ | ✅ | ✅ |
| Unter-Sitzungsbenachrichtigungen | ✅ | ✅ | ✅ |

**Erklärung**:
- **Windows/Linux**: Unterstützen nur grundlegende Benachrichtigungsfunktionen, erweiterte Funktionen (Fokuserkennung, Klick-Fokussierung, benutzerdefinierte Sounds) sind nicht verfügbar
- **macOS**: Unterstützt alle Funktionen

### 6.2 Plattformübergreifende Konfigurationsdatei-Kompatibilität

**Problem**: Sie haben `sounds` auf macOS konfiguriert, nach dem Wechsel zu Windows funktionieren die Sounds nicht.

**Ursache**: Die `sounds`-Konfiguration ist nur auf macOS wirksam.

**Lösung**: Die Konfigurationsdatei kann plattformübergreifend verwendet werden, das Plugin ignoriert automatisch nicht unterstützte Konfigurationsoptionen. Sie müssen das `sounds`-Feld nicht löschen, Windows/Linux ignorieren es stillschweigend.

::: tip Best Practice
Verwenden Sie dieselbe Konfigurationsdatei auf mehreren Plattformen, das Plugin behandelt Plattformunterschiede automatisch. Sie müssen keine separate Konfigurationsdatei für jede Plattform erstellen.
:::

---

## Zusammenfassung dieser Lektion

Die Fehlerbehebung von opencode-notify kann in die folgenden 6 Kategorien eingeteilt werden:

1. **Benachrichtigungen erscheinen nicht**: Überprüfen Sie Plugin-Installation, macOS-Benachrichtigungsberechtigungen, Ruhezeiten, Terminal-Fokus, Unter-Sitzungsfilterung, ob das Plugin deaktiviert ist
2. **Fokuserkennung funktioniert nicht** (macOS): Überprüfen Sie, ob das Terminal korrekt erkannt wird, oder geben Sie den Terminal-Typ manuell an
3. **Konfiguration wirkt nicht**: Überprüfen Sie JSON-Format, Konfigurationsdateipfad, starten Sie OpenCode neu
4. **Sounds werden nicht abgespielt** (macOS): Überprüfen Sie, ob der Sound-Name korrekt ist, bestätigen Sie, dass Sounds nur auf macOS unterstützt werden
5. **Klick auf Benachrichtigung fokussiert nicht** (macOS): Überprüfen Sie Bundle ID-Abruf und Bedienungshilfen-Berechtigungen
6. **Plattformspezifische Funktionsunterschiede**: Windows/Linux unterstützen nur grundlegende Benachrichtigungen, erweiterte Funktionen sind nur auf macOS verfügbar

**Schnelle Fehlerbehebungs-Checkliste**:

```
□ Ist das Plugin korrekt installiert?
□ Sind macOS-Benachrichtigungsberechtigungen erteilt?
□ Sind Ruhezeiten aktiviert?
□ Ist das Terminal fokussiert?
□ Ist die Unter-Sitzungsfilterung aktiviert?
□ Ist das JSON-Format der Konfigurationsdatei korrekt?
□ Ist der Konfigurationsdateipfad korrekt?
□ Wurde OpenCode neu gestartet?
□ Ist der Sound-Name in der unterstützten Liste (nur macOS)?
□ Wurde die Bundle ID erfolgreich abgerufen (nur macOS)?
□ Ist die Systemlautstärke normal?
```

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Häufig gestellte Fragen](../common-questions/)** kennen.
>
> Sie werden lernen:
> - Ob opencode-notify den KI-Dialogkontext erhöht
> - Ob Sie mit Benachrichtigungen bombardiert werden
> - Wie Sie Benachrichtigungen vorübergehend deaktivieren
> - Leistungsauswirkungen und Datenschutzfragen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisiert: 2026-01-27

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Konfigurationsladen & Fehlerbehandlung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Terminal-Erkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS osascript-Ausführung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L120-L133) | 120-133 |
| Terminal-Fokuserkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Ruhezeiten-Prüfung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Eltern-Sitzungserkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| Benachrichtigungsversand | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Standardkonfiguration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Terminal-Prozessnamenzuordnung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Aufgabenabschluss-Behandlung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 |
| Fehlerbenachrichtigungs-Behandlung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 |
| Berechtigungsanfrage-Behandlung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 |
| Frage-Anfrage-Behandlung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 |

**Wichtige Konstanten**:

- `DEFAULT_CONFIG`: Standardkonfiguration (Zeilen 56-68)
  - `notifyChildSessions: false`: Standardmäßig keine Unter-Sitzungsbenachrichtigungen
  - `sounds.idle: "Glass"`: Sound bei Aufgabenabschluss
  - `sounds.error: "Basso"`: Fehler-Sound
  - `sounds.permission: "Submarine"`: Sound bei Berechtigungsanfrage
  - `quietHours.start: "22:00"`, `quietHours.end: "08:00"`: Standard-Ruhezeiten

- `TERMINAL_PROCESS_NAMES`: Zuordnung von Terminal-Namen zu macOS-Prozessnamen (Zeilen 71-84)

**Wichtige Funktionen**:

- `loadConfig()`: Lädt und führt Konfigurationsdatei mit Standardkonfiguration zusammen, verwendet Standardwerte wenn Konfigurationsdatei nicht existiert oder ungültig ist
- `detectTerminalInfo()`: Erkennt Terminal-Informationen (Name, Bundle ID, Prozessname)
- `isTerminalFocused()`: Prüft, ob das Terminal die aktuelle Vordergrundanwendung ist (macOS)
- `isQuietHours()`: Prüft, ob die aktuelle Zeit innerhalb der Ruhezeiten liegt
- `isParentSession()`: Prüft, ob die Sitzung eine Eltern-Sitzung ist
- `sendNotification()`: Sendet native Benachrichtigung, unterstützt macOS Klick-Fokussierung
- `runOsascript()`: Führt AppleScript aus (macOS), gibt bei Fehler null zurück
- `getBundleId()`: Ruft die Bundle ID einer Anwendung ab (macOS)

**Geschäftsregeln**:

- BR-1-1: Standardmäßig nur Eltern-Sitzungen benachrichtigen, keine Unter-Sitzungen (`notify.ts:256-259`)
- BR-1-2: Benachrichtigungen unterdrücken wenn Terminal fokussiert ist (`notify.ts:265`)
- BR-1-3: Keine Benachrichtigungen während Ruhezeiten senden (`notify.ts:262`)
- BR-1-4: Berechtigungsanfragen immer benachrichtigen, keine Eltern-Sitzungs-Prüfung (`notify.ts:319`)
- BR-1-5: Frage-Anfragen ohne Fokusprüfung, unterstützt tmux-Workflow (`notify.ts:340`)
- BR-1-6: macOS unterstützt Klick-Benachrichtigung-Fokussierung des Terminals (`notify.ts:238-240`)

**Ausnahmebehandlung**:

- `loadConfig()`: Verwendet Standardkonfiguration wenn Konfigurationsdatei nicht existiert oder JSON-Parsing fehlschlägt (`notify.ts:110-113`)
- `isParentSession()`: Nimmt Eltern-Sitzung an wenn Sitzungsabfrage fehlschlägt (benachrichtigen statt übersehen) (`notify.ts:210-212`)
- `runOsascript()`: Gibt null zurück wenn osascript-Ausführung fehlschlägt (`notify.ts:120-132`)
- `handleSessionIdle()`: Verwendet Standardtitel wenn Sitzungsinformationen nicht abgerufen werden können (`notify.ts:274-276`)

</details>
