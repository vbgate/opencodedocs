---
title: "Schnellstart: opencode-notify in 5 Minuten einrichten | opencode-notify Tutorial"
sidebarTitle: "Erste Benachrichtigung in 5 Minuten"
subtitle: "Schnellstart: opencode-notify in 5 Minuten einrichten"
description: "Erfahre, wie du das opencode-notify-Plugin installierst und in 5 Minuten konfigurierst, um deine erste Desktop-Benachrichtigung zu erhalten. Dieses Tutorial behandelt sowohl die Installation über den OCX-Paketmanager als auch die manuelle Installation für macOS, Windows und Linux."
tags:
  - "Einstieg"
  - "Installation"
  - "Schnellstart"
prerequisite: []
order: 10
---

# Schnellstart: opencode-notify in 5 Minuten einrichten

## Was du lernen wirst

- Installation des opencode-notify-Plugins in unter 3 Minuten
- Auslösen deiner ersten Desktop-Benachrichtigung zur Überprüfung der Installation
- Unterschiede zwischen den Installationsmethoden und ihre Anwendungsfälle

## Das Problem

Du hast eine Aufgabe an die KI delegiert und wechselst zu einem anderen Fenster. Jetzt schaust du alle 30 Sekunden nach: Ist es fertig? Gab es einen Fehler? Wartet es auf Berechtigungen? Genau dafür wurde opencode-notify entwickelt.

Dieses ständige Hin- und Herwechseln unterbricht deinen Fokus und verschwendet Zeit.

## Wann du diese Lösung brauchst

**Aktiviere opencode-notify in folgenden Situationen**:
- Du wechselst häufig zu anderen Anwendungen, während die KI Aufgaben ausführt
- Du möchtest sofort benachrichtigt werden, wenn die KI deine Aufmerksamkeit braucht
- Du willst fokussiert bleiben, ohne wichtige Ereignisse zu verpassen

## Das Konzept

Das Funktionsprinzip von opencode-notify ist einfach: Es überwacht OpenCode-Events und sendet bei wichtigen Momenten native Desktop-Benachrichtigungen.

**Du wirst benachrichtigt bei**:
- ✅ Aufgabe abgeschlossen (Session idle)
- ✅ Fehler aufgetreten (Session error)
- ✅ Berechtigung erforderlich (Permission updated)

**Du wirst nicht benachrichtigt bei**:
- ❌ Jeder abgeschlossenen Unteraufgabe (zu störend)
- ❌ Ereignissen, wenn das Terminal im Fokus ist (du siehst es bereits)

## 🎒 Voraussetzungen

::: warning Anforderungen
- [OpenCode](https://github.com/sst/opencode) ist installiert
- Ein verfügbares Terminal (macOS Terminal, iTerm2, Windows Terminal usw.)
- macOS/Windows/Linux (alle drei werden unterstützt)
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Installationsmethode wählen

opencode-notify bietet zwei Installationsmethoden:

| Methode | Anwendungsfall | Vorteile | Nachteile |
| --- | --- | --- | --- |
| **OCX-Paketmanager** | Die meisten Benutzer | Ein-Klick-Installation, automatische Updates, vollständige Abhängigkeitsverwaltung | OCX muss zuerst installiert werden |
| **Manuelle Installation** | Spezielle Anforderungen | Volle Kontrolle, kein OCX erforderlich | Manuelle Verwaltung von Abhängigkeiten und Updates |

**Empfehlung**: Verwende bevorzugt die OCX-Installation – sie ist einfacher.

### Schritt 2: Installation über OCX (Empfohlen)

#### 2.1 OCX-Paketmanager installieren

OCX ist der offizielle Plugin-Paketmanager für OpenCode und ermöglicht die einfache Installation, Aktualisierung und Verwaltung von Plugins.

**OCX installieren**:

```bash
curl -fsSL https://ocx.kdco.dev/install.sh | sh
```

**Erwartete Ausgabe**: Das Installationsskript zeigt den Fortschritt an und meldet am Ende eine erfolgreiche Installation.

#### 2.2 KDCO Registry hinzufügen

Die KDCO Registry ist ein Plugin-Repository, das opencode-notify und weitere nützliche Plugins enthält.

**Registry hinzufügen**:

```bash
ocx registry add https://registry.kdco.dev --name kdco
```

**Erwartete Ausgabe**: Meldung „Registry added successfully" oder ähnlich.

::: tip Optional: Globale Konfiguration
Wenn du dieselbe Registry in allen Projekten verwenden möchtest, füge den Parameter `--global` hinzu:

```bash
ocx registry add https://registry.kdco.dev --name kdco --global
```
:::

#### 2.3 opencode-notify installieren

**Plugin installieren**:

```bash
ocx add kdco/notify
```

**Erwartete Ausgabe**:
```
✓ Added kdco/notify to your OpenCode workspace
```

### Schritt 3: Kompletten Workspace installieren (Optional)

Für das vollständige Erlebnis kannst du den KDCO Workspace installieren, der Folgendes enthält:

- opencode-notify (Desktop-Benachrichtigungen)
- Background Agents (Hintergrund-Agenten)
- Specialist Agents (Spezialisierte Agenten)
- Planning Tools (Planungswerkzeuge)

**Workspace installieren**:

```bash
ocx add kdco/workspace
```

**Erwartete Ausgabe**: Meldung, dass mehrere Komponenten erfolgreich hinzugefügt wurden.

### Schritt 4: Installation überprüfen

Nach der Installation müssen wir eine Benachrichtigung auslösen, um die korrekte Konfiguration zu überprüfen.

**Methode 1: Die KI eine Aufgabe erledigen lassen**

Gib in OpenCode ein:

```
Berechne die Summe von 1 bis 10, warte dann 5 Sekunden und teile mir das Ergebnis mit.
```

Wechsle für einige Sekunden zu einem anderen Fenster – du solltest eine Desktop-Benachrichtigung sehen.

**Methode 2: Konfigurationsdatei prüfen**

Überprüfe, ob die Konfigurationsdatei existiert:

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
type $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**Erwartete Ausgabe**:
- Datei existiert nicht → Standardkonfiguration wird verwendet (normal)
- Datei existiert → Zeigt deine benutzerdefinierte Konfiguration

### Schritt 5: Manuelle Installation (Alternative)

Wenn du OCX nicht verwenden möchtest, kannst du manuell installieren.

#### 5.1 Quellcode kopieren

Kopiere den opencode-notify-Quellcode in das OpenCode-Plugin-Verzeichnis:

```bash
# Quellcode in separates Verzeichnis kopieren
mkdir -p ~/.opencode/plugin/kdco-notify
cp src/notify.ts ~/.opencode/plugin/kdco-notify/
cp -r src/plugin/kdco-primitives ~/.opencode/plugin/kdco-notify/
```

#### 5.2 Abhängigkeiten installieren

Installiere die erforderlichen Abhängigkeiten manuell:

```bash
cd ~/.opencode/plugin/
npm install node-notifier detect-terminal @opencode-ai/plugin @opencode-ai/sdk
```

::: warning Hinweise
- **Abhängigkeitsverwaltung**: `node-notifier` und `detect-terminal` müssen manuell installiert und aktualisiert werden
- **Schwierige Updates**: Bei jedem Update muss der Quellcode manuell neu kopiert werden
- **Nicht empfohlen**: Sofern keine speziellen Anforderungen bestehen, wird die OCX-Installation empfohlen
:::

### Checkliste ✅

Nach Abschluss der obigen Schritte überprüfe bitte:

- [ ] OCX erfolgreich installiert (`ocx --version` gibt Versionsnummer aus)
- [ ] KDCO Registry hinzugefügt (`ocx registry list` zeigt kdco)
- [ ] opencode-notify installiert (`ocx list` zeigt kdco/notify)
- [ ] Erste Desktop-Benachrichtigung erhalten
- [ ] Benachrichtigung zeigt korrekten Aufgabentitel

**Falls ein Schritt fehlschlägt**:
- Siehe [Fehlerbehebung](../../faq/troubleshooting/) für Hilfe
- Überprüfe, ob OpenCode korrekt läuft
- Stelle sicher, dass dein System Desktop-Benachrichtigungen unterstützt

## Häufige Probleme

### Problem 1: Benachrichtigungen werden nicht angezeigt

**Ursachen**:
- macOS: Systembenachrichtigungen sind deaktiviert
- Windows: Benachrichtigungsberechtigung nicht erteilt
- Linux: notify-send nicht installiert

**Lösungen**:

| Plattform | Lösung |
| --- | --- |
| macOS | Systemeinstellungen → Mitteilungen → OpenCode → Mitteilungen erlauben |
| Windows | Einstellungen → System → Benachrichtigungen → Benachrichtigungen aktivieren |
| Linux | libnotify-bin installieren: `sudo apt install libnotify-bin` |

### Problem 2: OCX-Installation schlägt fehl

**Ursachen**: Netzwerkprobleme oder unzureichende Berechtigungen

**Lösungen**:
1. Netzwerkverbindung überprüfen
2. Mit sudo installieren (Administratorrechte erforderlich)
3. Installationsskript manuell herunterladen und ausführen

### Problem 3: Abhängigkeitsinstallation schlägt fehl

**Ursache**: Inkompatible Node.js-Version

**Lösungen**:
- Node.js 18 oder höher verwenden
- npm-Cache leeren: `npm cache clean --force`

## Zusammenfassung

In dieser Lektion haben wir Folgendes abgeschlossen:
- ✅ OCX-Paketmanager installiert
- ✅ KDCO Registry hinzugefügt
- ✅ opencode-notify-Plugin installiert
- ✅ Erste Desktop-Benachrichtigung ausgelöst
- ✅ Manuelle Installationsmethode kennengelernt

**Wichtige Erkenntnisse**:
1. opencode-notify verwendet native Desktop-Benachrichtigungen – kein ständiges Fensterwechseln mehr
2. OCX ist die empfohlene Installationsmethode mit automatischer Abhängigkeits- und Update-Verwaltung
3. Standardmäßig werden nur Parent-Sessions benachrichtigt, um Störungen durch Unteraufgaben zu vermeiden
4. Benachrichtigungen werden automatisch unterdrückt, wenn das Terminal im Fokus ist

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Funktionsweise](../how-it-works/)**.
>
> Du wirst lernen:
> - Wie das Plugin OpenCode-Events überwacht
> - Den Workflow des intelligenten Filtermechanismus
> - Die Prinzipien der Terminalerkennung und Fokuserkennung
> - Funktionsunterschiede zwischen verschiedenen Plattformen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Pfade</strong></summary>

> Aktualisiert: 2026-01-27

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Plugin-Haupteinstieg | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L1-L407) | 1-407 |
| Konfiguration laden | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| Benachrichtigung senden | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L280-L308) | 280-308 |
| Terminalerkennung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Ruhezeiten-Prüfung | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Standardkonfiguration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |

**Wichtige Konstanten**:
- `DEFAULT_CONFIG.sounds.idle = "Glass"`: Standard-Sound bei Aufgabenabschluss
- `DEFAULT_CONFIG.sounds.error = "Basso"`: Standard-Sound bei Fehlern
- `DEFAULT_CONFIG.sounds.permission = "Submarine"`: Standard-Sound bei Berechtigungsanfragen
- `DEFAULT_CONFIG.notifyChildSessions = false`: Standardmäßig nur Parent-Sessions benachrichtigen

**Wichtige Funktionen**:
- `NotifyPlugin()`: Plugin-Einstiegsfunktion, gibt Event-Handler zurück
- `loadConfig()`: Lädt Konfigurationsdatei und führt mit Standardwerten zusammen
- `sendNotification()`: Sendet native Desktop-Benachrichtigung
- `detectTerminalInfo()`: Erkennt Terminaltyp und Bundle-ID
- `isQuietHours()`: Prüft, ob aktuelle Zeit in Ruhezeit liegt
- `isParentSession()`: Bestimmt, ob es sich um eine Parent-Session handelt
- `isTerminalFocused()`: Erkennt, ob Terminal im Vordergrund ist

</details>
