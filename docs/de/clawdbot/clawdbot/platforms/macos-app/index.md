---
title: "Vollständiger macOS-App-Leitfaden: Menüleiste, Voice Wake, Talk Mode und Knotenmodus | Clawdbot-Tutorial"
sidebarTitle: "Mac wird zum KI-Assistenten"
subtitle: "Vollständiger macOS-App-Leitfaden: Menüleiste, Voice Wake, Talk Mode und Knotenmodus"
description: "Erfahren Sie die vollständigen Funktionen der Clawdbot-macOS-App, einschließlich Menüleistenstatusverwaltung, eingebettetes WebChat-Fenster, Voice Wake-Sprachaktivierung, Talk Mode-Kontinuierlicher Dialog, Knotenmodus-Ausführung, Exec Approvals-Sicherheitskontrolle und SSH/Tailscale-Fernzugriffskonfiguration. Beherrschen Sie den Wechsel zwischen lokalem und Fernmodus sowie bewährte Methoden für die Berechtigungsverwaltung."
tags:
  - "macOS"
  - "Menüleisten-App"
  - "Voice Wake"
  - "Talk Mode"
  - "Knotenmodus"
prerequisite:
  - "start-getting-started"
order: 160
---

# macOS-App: Menüleistensteuerung und Sprachinteraktion

## Was Sie nach Abschluss können

Nach Abschluss dieses Tutorials können Sie:

- ✅ Die Kernfunktionen der Clawdbot-macOS-App als Menüleistensteuerungsebene verstehen
- ✅ Voice Wake-Sprachaktivierung und Talk Mode-Kontinuierlicher Dialog beherrschen
- ✅ Die Fähigkeiten von `system.run`, Canvas und Kamera im Knotenmodus verstehen
- ✅ Lokal vs Fernmodus konfigurieren, um verschiedenen Bereitstellungsszenarien gerecht zu werden
- ✅ Exec Approvals-Genehmigungsmechanismen verwalten, um Befehlsausführungsberechtigungen zu steuern
- ✅ Deep Links verwenden, um den KI-Assistenten schnell auszulösen
- ✅ Über SSH/Tailscale fern zugreifen und Gateway steuern

## Ihr aktuelles Problem

Vielleicht fragen Sie sich:

- "Was macht die macOS-App eigentlich? Ist sie das Gateway selbst?"
- "Wie funktionieren Voice Wake und Talk Mode? Benötige ich zusätzliche Hardware?"
- "Was ist der Unterschied zwischen Knotenmodus und normalem Modus? Wann verwende ich welchen?"
- "Wie verwalte ich Berechtigungen und Sicherheitseinstellungen unter macOS?"
- "Kann ich das Gateway auf einem anderen Computer ausführen?"

Die gute Nachricht ist: **Die Clawdbot-macOS-App ist die grafische Steuerungsebene des Gateways**. Sie führt den Gateway-Dienst nicht aus, sondern verbindet sich, verwaltet und überwacht ihn. Gleichzeitig fungiert sie als Knoten, der macOS-spezifische Funktionen (wie `system.run`, Canvas, Kamera) für ein Remote-Gateway bereitstellt.

## Wann Sie diesen Ansatz verwenden

Wenn Sie benötigen:

- 🖥️ **macOS-Grafikverwaltung** – Menüleistenstatus und Steuerung, intuitiver als die Befehlszeile
- 🎙️ **Sprachinteraktion** – Voice Wake-Aktivierung + Talk Mode-Kontinuierlicher Dialog
- 💻 **Lokale Befehlsausführung** – Ausführen von `system.run` und anderen Befehlen auf dem macOS-Knoten
- 🎨 **Canvas-Visualisierung** – Rendering von KI-gesteuerten Visualisierungsoberflächen auf macOS
- 📷 **Gerätefunktionen** – Kamerafotos, -aufnahmen und Bildschirmaufzeichnung
- 🌐 **Fernzugriff** – Steuern eines Remote-Gateways über SSH/Tailscale

::: info Unterschied zwischen Knoten und Gateway
- **Gateway**: Führt KI-Modelle aus, verwaltet Sitzungen, verarbeitet Nachrichten (kann auf beliebigen Computern laufen)
- **Knoten (Node)**: Stellt lokale Gerätefunktionen (Canvas, Kamera, system.run) für das Gateway bereit
- **macOS-App**: Kann sowohl Gateway-Client als auch Knoten verwendet werden
:::

---

## Grundkonzept

Die Clawdbot-macOS-App ist ein System mit **doppelter Rolle**:

```
┌──────────────────────────────────────────┐
│     Clawdbot.app (macOS-App)       │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Menüleistensteuerungsebene     │
│   │  • Gateway-Verbindungsverwaltung     │◄────► Gateway WebSocket
│   │  • WebChat-Eingebettetes Fenster      │      │
│   │  • Einstellungen und Konfiguration   │      │
│   │  • Voice Wake/Talk Mode    │      │
│   └────────────────────────────┘      │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Knotendienst              │      │
│   │  • system.run              │◄────► Gateway-Knotenprotokoll
│   │  • Canvas                 │      │
│   │  • Kamera/Bildschirm          │      │
│   └────────────────────────────┘      │
└──────────────────────────────────────────┘
```

**Zwei Betriebsmodi**:

| Modus | Gateway-Standort | Knotendienst | Anwendungsfall |
|--- | --- | --- | ---|
| **Lokaler Modus** (Standard) | Lokaler Computer (launchd-Dienst) | Nicht gestartet | Gateway läuft auf diesem Mac |
| **Fernmodus** | Remotecomputer (über SSH/Tailscale) | Gestartet | Gateway läuft auf einem anderen Computer |

**Kernfunktionsmodule**:

1. **Menüleistensteuerung** – Gateway-Verbindungsstatus, WebChat, Konfiguration, Sitzungsverwaltung
2. **Voice Wake** – Globale Sprachaktivierungswortüberwachung
3. **Talk Mode** – Kontinuierlicher Sprachdialogzyklus (Spracheingabe → KI-Antwort → TTS-Wiedergabe)
4. **Knotenmodus** – Exponiert macOS-spezifische Befehle (`system.run`, `canvas.*`, `camera.*`)
5. **Exec Approvals** – `system.run`-Befehlsausführungsgenehmigung und Sicherheitskontrolle
6. **Deep Links** – `clawdbot://`-Protokoll zur schnellen Funktionsauslösung

---

## Schritt für Schritt

### Schritt 1: Installation und Start der macOS-App

**Warum**
Sie müssen die Clawdbot-macOS-App installieren, um Menüleistensteuerung und Sprachfunktionen zu erhalten.

**Installationsmethoden**:

::: code-group

```bash [Installation mit Homebrew]
brew install --cask clawdbot
```

```bash [Manueller Download .dmg]
# Laden Sie die neueste Clawdbot.app.dmg von https://github.com/clawdbot/clawdbot/releases herunter
# Ziehen Sie sie in den Ordner Anwendungen
```

:::

**Erster Start**:

```bash
open /Applications/Clawdbot.app
```

**Sie sollten sehen**:
- Ein 🦞 Symbol in der oberen macOS-Menüleiste
- Ein Dropdown-Menü wird beim Klicken auf das Symbol geöffnet
- Das System zeigt ein TCC-Berechtigungsanfragedialogfeld an

::: tip Berechtigungsanfrage beim ersten Start
Die macOS-App benötigt folgende Berechtigungen (das System zeigt automatisch Hinweise an):
- **Benachrichtigungsberechtigung** – Zeigt Systembenachrichtigungen an
- **Barrierefreiheitsberechtigung** – Für Voice Wake und Systemoperationen
- **Mikrofonberechtigung** – Voice Wake und Talk Mode benötigen dies
- **Bildschirmaufzeichnungsberechtigung** – Canvas- und Bildschirmaufzeichnungsfunktionen
- **Spracherkennungsberechtigung** – Voice Wake-Spracheingabe
- **Automatisierungsberechtigung** – AppleScript-Steuerung (falls erforderlich)

Alle diese Berechtigungen werden **vollständig lokal** verwendet und nicht an einen Server hochgeladen.
:::

---

### Schritt 2: Konfiguration des Verbindungsmodus (lokal vs fern)

**Warum**
Wählen Sie je nach Ihren Bereitstellungsanforderungen den lokalen oder Fernmodus.

#### Modus A: Lokaler Modus (Standard)

Anwendungsfall: Gateway und macOS-App laufen auf demselben Computer.

**Konfigurationsschritte**:

1. Stellen Sie sicher, dass der **Lokal**-Modus in der Menüleisten-App angezeigt wird
2. Wenn das Gateway nicht läuft, startet die App automatisch den `com.clawdbot.gateway`-launchd-Dienst
3. Die App verbindet sich mit `ws://127.0.0.1:18789`

**Sie sollten sehen**:
- Das Menüleistensymbol zeigt grün (verbundener Status)
- Die Gateway-Statuskarte zeigt "Lokal"
- Der Knotendienst **nicht gestartet** (Knotenmodus ist nur im Fernmodus erforderlich)

#### Modus B: Fernmodus

Anwendungsfall: Das Gateway läuft auf einem anderen Computer (z. B. Server oder Linux-VPS), und Sie möchten es über den Mac steuern.

**Konfigurationsschritte**:

1. Wechseln Sie in der Menüleisten-App in den **Fern**-Modus
2. Geben Sie die WebSocket-Adresse des Remote-Gateways ein (z. B. `ws://your-server:18789`)
3. Wählen Sie die Authentifizierungsmethode (Token oder Passwort)
4. Die App richtet automatisch einen SSH-Tunnel ein, um eine Verbindung zum Remote-Gateway herzustellen

**Sie sollten sehen**:
- Das Menüleistensymbol zeigt den Verbindungsstatus (gelb/grün/rot)
- Die Gateway-Statuskarte zeigt die Remote-Serveradresse
- Der Knotendienst **automatisch gestartet** (damit das Remote-Gateway lokale Funktionen aufrufen kann)

**Tunnelmechanismus im Fernmodus**:

```
macOS-App                     Remote-Gateway
    │                                  │
    ├── SSH-Tunnel ───────────────────► ws://remote:18789
    │                                  │
    └── Knotendienst ◄───────────────────── node.invoke
```

::: tip Vorteile des Fernmodus
- **Zentralisierte Verwaltung**: Führen Sie das Gateway auf einem leistungsstarken Computer aus, auf den mehrere Clients zugreifen können
- **Ressourcenoptimierung**: Der Mac kann leicht bleiben, während das Gateway auf einem leistungsstarken Server läuft
- **Gerätespezifische Ausführung**: Funktionen wie Canvas und Kamera werden weiterhin lokal auf dem Mac ausgeführt
:::

---

### Schritt 3: Verwenden der Menüleistensteuerungsebene

**Warum**
Die Menüleisten-App bietet eine Oberfläche für den schnellen Zugriff auf alle Kernfunktionen.

**Kernmenüpunkte**:

Nach dem Klicken auf das Menüleistensymbol sehen Sie:

1. **Statuskarte**
   - Gateway-Verbindungsstatus (verbunden/getrennt/Verbindung wird hergestellt)
   - Aktueller Modus (Lokal/Fern)
   - Liste der laufenden Kanäle (WhatsApp, Telegram usw.)

2. **Schnellaktionen**
   - **Agent** – Öffnet das KI-Dialogfenster (ruft das Gateway auf)
   - **WebChat** – Öffnet die eingebettete WebChat-Oberfläche
   - **Canvas** – Öffnet das Canvas-Visualisierungsfenster
   - **Einstellungen** – Öffnet die Konfigurationsoberfläche

3. **Funktionsschalter**
   - **Talk** – Talk Mode aktivieren/deaktivieren
   - **Voice Wake** – Voice Wake aktivieren/deaktivieren

4. **Info-Menü**
   - **Verwendung** – Anzeigen von Nutzung und Kosten
   - **Sitzungen** – Verwalten der Sitzungsliste
   - **Kanäle** – Anzeigen des Kanalstatus
   - **Skills** – Verwalten von Skill-Paketen

**Sie sollten sehen**:
- Echtzeitaktualisierte Statusindikatoren (grün = normal, rot = getrennt)
- Detaillierte Verbindungsinformationen beim Mauszeigerüberfahren
- Schnelles Öffnen der entsprechenden Funktion durch Klicken auf einen beliebigen Menüpunkt

---

### Schritt 4: Konfiguration und Verwendung von Voice Wake

**Warum**
Voice Wake ermöglicht es Ihnen, den KI-Assistenten durch ein Sprachaktivierungswort auszulösen, ohne klicken oder eingeben zu müssen.

**Funktionsweise von Voice Wake**:

```
┌──────────────────────────────────┐
│   Voice Wake-Laufzeit          │
│                              │
│   Mikrofonüberwachung ──► Aktivierungswort-Erkennung  │
│                              │
│   Aktivierungswort-Übereinstimmung?                   │
│       │                       │
│       ├─ Ja ──► Agent auslösen  │
│       │                       │
│       └─ Nein ──► Überwachung fortsetzen  │
└──────────────────────────────────┘
```

**Voice Wake konfigurieren**:

1. Öffnen Sie **Einstellungen** → **Voice Wake**
2. Geben Sie das Aktivierungswort ein (Standard: `clawd`, `claude`, `computer`)
3. Sie können mehrere Aktivierungswörter hinzufügen (durch Kommas getrennt)
4. Aktivieren Sie den Schalter **Voice Wake aktivieren**

**Regeln für Aktivierungswörter**:
- Aktivierungswörter werden im Gateway gespeichert: `~/.clawdbot/settings/voicewake.json`
- Alle Knoten verwenden dieselbe **globale Aktivierungswortliste**
- Änderungen werden an alle verbundenen Geräte (macOS, iOS, Android) gesendet

**Verwendungsablauf**:

1. Stellen Sie sicher, dass die Mikrofonberechtigung erteilt wurde
2. Aktivieren Sie Voice Wake in der Menüleiste
3. Sprechen Sie das Aktivierungswort in das Mikrofon (z. B. "Hey clawd")
4. Warten Sie auf das Signal "Ding" (zeigt erfolgreiche Aktivierung an)
5. Sprechen Sie Ihren Befehl oder Ihre Frage

**Sie sollten sehen**:
- Ein Voice Wake-Overlay in der Bildschirmmitte
- Mikrofonlautstärkewellenform-Anzeige
- Anzeigetext "Listening"-Status
- Die KI beginnt, Ihre Spracheingabe zu verarbeiten

::: tip Globale Eigenschaften von Voice Wake
Aktivierungswörter sind eine **Gateway-weite globale Konfiguration**, nicht auf ein einzelnes Gerät beschränkt. Dies bedeutet:
- Nachdem Sie Aktivierungswörter unter macOS geändert haben, werden sie auch auf iOS- und Android-Geräten synchronisiert
- Alle Geräte verwenden dieselbe Gruppe von Aktivierungswörtern
- Jedes Gerät kann Voice Wake jedoch einzeln aktivieren/deaktivieren (basierend auf Berechtigungen und Benutzervorlieben)
:::

---

### Schritt 5: Verwenden des Talk Mode für kontinuierliche Gespräche

**Warum**
Talk Mode bietet ein kontinuierliches Sprachgespräch ähnlich wie Siri/Alexa, ohne dass Sie jedes Mal aktivieren müssen.

**Talk Mode-Arbeitszyklus**:

```
Überwachen ──► KI-Verarbeitung ──► TTS-Wiedergabe ──► Überwachen
  │                                              │
  └────────────────────────────────────────┘
```

**Talk Mode aktivieren**:

1. Klicken Sie auf die Schaltfläche **Talk** in der Menüleiste
2. Oder verwenden Sie ein Tastaturkürzel (Standard: keines, kann in den Einstellungen festgelegt werden)
3. Das Talk Mode-Overlay erscheint

**Talk Mode-Oberflächenstatus**:

| Status | Anzeige | Erklärung |
|--- | --- | ---|
| **Listening** | Impulsanimation der Wolke + Mikrofonlautstärke | Warten, bis Sie sprechen |
| **Thinking** | Senkungsanimation | Die KI überlegt |
| **Speaking** | Strahlungsringanimation + Wellen | Die KI antwortet (TTS-Wiedergabe läuft) |

**Interaktionssteuerung**:

- **Sprechen stoppen**: Klicken Sie auf das Wolkensymbol, um die TTS-Wiedergabe zu stoppen
- **Talk Mode beenden**: Klicken Sie auf die X-Schaltfläche oben rechts
- **Sprachunterbrechung**: Wenn die KI spricht und Sie zu sprechen beginnen, wird die Wiedergabe automatisch gestoppt

**TTS konfigurieren**:

Talk Mode verwendet ElevenLabs für die Text-zu-Sprache-Umwandlung. Konfigurationsort: `~/.clawdbot/clawdbot.json`

```yaml
talk:
  voiceId: "elevenlabs_voice_id"  # ElevenLabs-Sprach-ID
  modelId: "eleven_v3"            # Modellversion
  apiKey: "elevenlabs_api_key"     # API-Schlüssel (oder Umgebungsvariable verwenden)
  interruptOnSpeech: true           # Unterbrechung bei Sprache
  outputFormat: "mp3_44100_128"   # Ausgabeformat
```

::: tip ElevenLabs-Konfiguration
Wenn kein API-Schlüssel konfiguriert ist, versucht Talk Mode Folgendes zu verwenden:
1. Die Umgebungsvariable `ELEVENLABS_API_KEY`
2. Den Schlüssel im Gateway-Shell-Profil
3. Die erste verfügbare ElevenLabs-Stimme als Standard
:::

---

### Schritt 6: Verwenden des Knotenmodus

**Warum**
Der Knotenmodus ermöglicht es der macOS-App, lokale Fähigkeiten für ein Remote-Gateway bereitzustellen und echte geräteübergreifende Zusammenarbeit zu ermöglichen.

**Verfügbare Befehle im Knotenmodus**:

| Befehlskategorie | Befehlsbeispiel | Funktionsbeschreibung |
|--- | --- | ---|
| **Canvas** | `canvas.present`、`canvas.navigate`、`canvas.eval` | Rendering von Visualisierungsoberflächen auf macOS |
| **Camera** | `camera.snap`、`camera.clip` | Foto- oder Videoaufnahme |
| **Screen** | `screen.record` | Bildschirmaufzeichnung |
| **System** | `system.run`、`system.notify` | Ausführen von Shell-Befehlen oder Senden von Benachrichtigungen |

**Knotenmodus aktivieren**:

Der Knotenmodus wird im **Fernmodus automatisch gestartet**, da das Remote-Gateway lokale Funktionen aufrufen muss.

Sie können den Knotendienst auch manuell starten:

```bash
clawdbot node run --display-name "My Mac"
```

**Knotenberechtigungsverwaltung**:

Die macOS-App meldet über ein Berechtigungssystem, welche Funktionen verfügbar sind:

```json
{
  "canvas": true,
  "camera": true,
  "screen": true,
  "system": {
    "run": true,
    "notify": true
  }
}
```

Die KI wählt automatisch verfügbare Tools basierend auf den Berechtigungen aus.

---

### Schritt 7: Konfiguration von Exec Approvals (`system.run` Sicherheitskontrolle)

**Warum**
`system.run` kann beliebige Shell-Befehle ausführen und benötigt daher einen Genehmigungsmechanismus, um Fehlbedienungen oder Missbrauch zu verhindern.

**Drei-Schichten-Sicherheitsmodell von Exec Approvals**:

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",          // Standardrichtlinie: verweigern
    "ask": "on-miss"           // Nachfragen, wenn Befehl nicht auf der Whitelist steht
  },
  "agents": {
    "main": {
      "security": "allowlist",    // Hauptsitzung: Nur Whitelist zulassen
      "ask": "on-miss",
      "allowlist": [
        { "pattern": "/usr/bin/git" },
        { "pattern": "/opt/homebrew/*/rg" }
      ]
    }
  }
}
```

**Sicherheitsrichtlinientypen**:

| Richtlinie | Verhalten | Anwendungsfall |
|--- | --- | ---|
| `deny` | Alle `system.run`-Aufrufe verweigern | Hohe Sicherheit, alle Befehle deaktivieren |
| `allowlist` | Nur Befehle auf der Whitelist zulassen | Ausgewogene Sicherheit und Bequemlichkeit |
| `ask` | Benutzer um Genehmigung bitten, wenn nicht auf der Whitelist | Flexibel, erfordert aber Bestätigung |

**Genehmigungsprozess**:

Wenn die KI versucht, einen nicht autorisierten Befehl auszuführen:

1. Die macOS-App zeigt ein Genehmigungsdialogfeld an
2. Zeigt den vollständigen Befehlspfad und die Parameter an
3. Bietet drei Optionen:
   - **Einmal zulassen** – Nur für dieses Mal zulassen
   - **Immer zulassen** – Zur Whitelist hinzufügen
   - **Verweigern** – Ausführung verweigern

**Sie sollten sehen**:
- Das Genehmigungsdialogfeld zeigt Befehlsdetails (z. B. `/usr/bin/ls -la ~`)
- Nach Auswahl von "Immer zulassen" wird beim nächsten Mal nicht mehr gefragt
- Nach Auswahl von "Verweigern" schlägt die Befehlsausführung fehl und gibt einen Fehler an die KI zurück

**Konfigurationsort**:

Exec Approvals werden lokal auf macOS gespeichert:
- Datei: `~/.clawdbot/exec-approvals.json`
- Genehmigungsverlauf: Alle genehmigten/abgelehnten Befehle in der App anzeigen

---

### Schritt 8: Verwenden von Deep Links

**Warum**
Deep Links bieten die Möglichkeit, Clawdbot-Funktionen schnell aus anderen Apps auszulösen.

**Unterstütztes Deep Link-Protokoll**: `clawdbot://`

#### `clawdbot://agent`

Löst eine Gateway `agent`-Anfrage aus, entspricht dem Ausführen von `clawdbot agent` im Terminal.

**Parameter**:

| Parameter | Beschreibung | Beispiel |
|--- | --- | ---|
| `message` (erforderlich) | An die KI gesendete Nachricht | `message=Hello%20from%20deep%20link` |
| `sessionKey` (optional) | Zielsitzungsschlüssel, Standard `main` | `sessionKey=main` |
| `thinking` (optional) | Denkebene: off\|minimal\|low\|medium\|high\|xhigh | `thinking=high` |
| `deliver`/`to`/`channel` (optional) | Zustellkanal | `channel=telegram` |
| `timeoutSeconds` (optional) | Zeitüberschreitung | `timeoutSeconds=30` |
| `key` (optional) | Schlüssel ohne Bestätigung, für Automatisierung | `key=your-secret-key` |

**Beispiele**:

```bash
# Einfach: Nachricht senden
open 'clawdbot://agent?message=Hello%20from%20deep%20link'

# Fortgeschritten: An Telegram senden, hohe Denkebene, 30 Sekunden Zeitüberschreitung
open 'clawdbot://agent?message=Summarize%20my%20day&to=telegram&thinking=high&timeoutSeconds=30'

# Automatisierung: Schlüssel verwenden, um Bestätigung zu überspringen (sicher in Ihren Skripten verwenden)
open 'clawdbot://agent?message=Automated%20task&key=secure-random-string'
```

**Sie sollten sehen**:
- Die Clawdbot-macOS-App öffnet sich automatisch (falls sie nicht läuft)
- Das Agent-Fenster erscheint und zeigt die Nachricht an
- Die KI beginnt mit der Verarbeitung und gibt eine Antwort zurück

::: warning Sicherheit von Deep Links
- Ohne den Parameter `key` zeigt die App einen Bestätigungsdialog an
- Mit einem gültigen `key` wird die Anfrage stillschweigend ausgeführt (für Automatisierungsskripte)
- Verwenden Sie Deep Links niemals aus nicht vertrauenswürdigen Quellen
:::

---

## Kontrollpunkt ✅

Nach Abschluss der oben genannten Schritte überprüfen Sie Folgendes:

### Installation und Verbindung

- [ ] Die macOS-App wurde erfolgreich installiert und erscheint im Ordner Anwendungen
- [ ] Alle erforderlichen Berechtigungen wurden beim ersten Start erteilt
- [ ] Das Menüleistensymbol wird normal angezeigt
- [ ] Gateway kann im lokalen Modus (Lokal) verbunden werden
- [ ] Gateway kann im Fernmodus (Fern) verbunden werden

### Voice Wake und Talk Mode

- [ ] Voice Wake-Aktivierungswörter wurden erfolgreich konfiguriert (z. B. "clawd", "claude")
- [ ] Das Aussprechen des Aktivierungsworts löst den KI-Assistenten aus
- [ ] Das Talk Mode-Overlay kann normal geöffnet und geschlossen werden
- [ ] Die TTS-Wiedergabe ist klar (erfordert ElevenLabs-API-Schlüssel)
- [ ] Die Sprachunterbrechungsfunktion funktioniert ordnungsgemäß (stoppt die Wiedergabe beim Sprechen)

### Knotenmodus und Exec Approvals

- [ ] Der Knotendienst wird im Fernmodus automatisch gestartet
- [ ] `system.run`-Befehle können ausgeführt werden und geben Ergebnisse zurück
- [ ] Das Exec Approvals-Dialogfeld wird normal angezeigt
- [ ] "Immer zulassen" kann korrekt zur Whitelist hinzugefügt werden
- [ ] "Verweigern" kann die Befehlsausführung korrekt verweigern

### Erweiterte Funktionen

- [ ] Deep Links können vom Terminal oder anderen Apps ausgelöst werden
- [ ] Die Einstellungsoberfläche speichert Konfigurationen korrekt
- [ ] Das WebChat-Eingebettete Fenster kann normal geöffnet werden
- [ ] Das Canvas-Fenster kann KI-generierte Visualisierungsinhalte anzeigen

---

## Häufige Fehler

### ❌ Berechtigungen verweigert oder nicht erteilt

**Problem**:
- Voice Wake kann das Mikrofon nicht überwachen
- Canvas kann Inhalte nicht anzeigen
- `system.run`-Befehle schlagen fehl

**Lösung**:
1. Öffnen Sie **Systemeinstellungen** → **Datenschutz & Sicherheit**
2. Suchen Sie nach **Clawdbot** oder **Clawdbot.app**
3. Stellen Sie sicher, dass **Mikrofon**, **Barrierefreiheit**, **Bildschirmaufzeichnung**, **Automatisierung** und andere Berechtigungen aktiviert sind
4. Starten Sie die Clawdbot-App neu

::: tip Fehlerbehebung bei TCC-Berechtigungen
Wenn die Berechtigungsschalter nicht aktiviert werden können oder sofort deaktiviert werden:
- Überprüfen Sie, ob Sicherheits-Tools (wie Little Snitch) aktiviert sind
- Versuchen Sie, die App vollständig zu deinstallieren und neu zu installieren
- Sehen Sie in den Console.app-TCC-Verweigerungsprotokollen nach
:::

### ❌ Gateway-Verbindung fehlgeschlagen

**Problem**:
- Das Menüleistensymbol zeigt rot (getrennter Status)
- Die Statuskarte zeigt "Verbindung fehlgeschlagen"
- WebChat kann nicht geöffnet werden

**Mögliche Ursachen und Lösungen**:

| Ursache | Überprüfungsmethode | Lösung |
|--- | --- | ---|
| Gateway nicht gestartet | `clawdbot gateway status` ausführen | Gateway-Dienst starten |
| Falsche Adresse | WebSocket-URL prüfen | Bestätigen Sie `ws://127.0.0.1:18789` oder Remote-Adresse korrekt |
| Port belegt | `lsof -i :18789` ausführen | Den Prozess schließen, der den Port belegt |
| Authentifizierung fehlgeschlagen | Token/Passwort prüfen | Bestätigen Sie, dass die Authentifizierungsdaten korrekt sind |

### ❌ Talk Mode kann nicht verwendet werden

**Problem**:
- Nach Aktivierung von Talk Mode passiert nichts
- TTS kann nicht wiedergegeben werden
- Mikrofon kann keine Eingabe empfangen

**Lösung**:

1. **ElevenLabs-Konfiguration prüfen**:
   - Bestätigen Sie, dass der API-Schlüssel festgelegt wurde
   - Testen Sie, ob der Schlüssel gültig ist: Besuchen Sie das ElevenLabs-Dashboard

2. **Netzwerkverbindung prüfen**:
   - TTS erfordert eine Internetverbindung
   - Überprüfen Sie, ob die Firewall API-Anfragen blockiert

3. **Audioausgabe prüfen**:
   - Bestätigen Sie, dass die Systemlautstärke aufgedreht ist
   - Überprüfen Sie, ob das Standardausgabegerät korrekt ist

### ❌ Knoten kann im Fernmodus nicht verbinden

**Problem**:
- Das Remote-Gateway kann `system.run` und andere Befehle auf dem macOS nicht aufrufen
- Fehlerprotokolle zeigen "Node not found" oder "Node offline"

**Lösung**:

1. **Bestätigen Sie, dass der Knotendienst läuft**:
   ```bash
   clawdbot nodes list
   # Sie sollten den macOS-Knoten als "paired" sehen
   ```

2. **SSH-Tunnel prüfen**:
   - Zeigen Sie den SSH-Verbindungsstatus in den macOS-App-Einstellungen an
   - Bestätigen Sie, dass Sie manuell SSH zum Remote-Gateway verwenden können

3. **Knotendienst neu starten**:
   ```bash
   # Auf dem macOS
   clawdbot node restart
   ```

---

## Zusammenfassung dieser Lektion

In dieser Lektion haben Sie gelernt:

1. ✅ **macOS-App-Architektur** – Doppelte Rolle als Gateway-Steuerungsebene und Knoten
2. ✅ **Lokal vs Fernmodus** – Konfiguration für verschiedene Bereitstellungsszenarien
3. ✅ **Menüleistenfunktionen** – Schneller Zugriff auf Statusverwaltung, WebChat, Canvas, Einstellungen usw.
4. ✅ **Voice Wake** – KI-Assistent durch Aktivierungswort auslösen
5. ✅ **Talk Mode** – Kontinuierliches Sprachgesprächserlebnis
6. ✅ **Knotenmodus** – macOS-spezifische Fähigkeiten exponieren (`system.run`, Canvas, Kamera)
7. ✅ **Exec Approvals** – Drei-Schichten-Sicherheitskontrollmechanismus für `system.run`
8. ✅ **Deep Links** – `clawdbot://`-Protokoll zur schnellen Funktionsauslösung

**Best Practices**:
- 🚀 Lokale Bereitstellung: Verwenden Sie den Standard-Lokal-Modus
- 🌐 Fernbereitstellung: Konfigurieren Sie SSH/Tailscale für zentralisierte Verwaltung
- 🔐 Sicherheit zuerst: Konfigurieren Sie eine angemessene Whitelist-Richtlinie für `system.run`
- 🎙️ Sprachinteraktion: Verwenden Sie ElevenLabs für die beste TTS-Erfahrung

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir den **[iOS-Knoten](../ios-node/)** kennen.
>
> Sie werden lernen:
> - Wie Sie den iOS-Knoten für die Verbindung zum Gateway konfigurieren
> - Funktionen des iOS-Knotens (Canvas, Kamera, Standort, Voice Wake)
> - Wie Sie iOS-Geräte über das Gateway koppeln
> - Berechtigungsverwaltung und Sicherheitskontrolle für iOS-Knoten
> - Bonjour-Erkennung und Tailscale-Fernverbindung

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-27

| Funktion        | Dateipfad                                                                                    | Zeile    |
|--- | --- | ---|
| App-Einstieg     | [`apps/macos/Sources/Clawdbot/ClawdbotApp.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/ClawdbotApp.swift) | Gesamte Datei   |
| Gateway-Verbindung | [`apps/macos/Sources/Clawdbot/GatewayConnection.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/GatewayConnection.swift) | 1-500   |
| Voice Wake-Laufzeit | [`apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift) | Gesamte Datei   |
| Talk Mode-Typen | [`apps/macos/Sources/Clawdbot/TalkModeTypes.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/TalkModeTypes.swift) | Gesamte Datei   |
| Voice Wake-Overlay | [`apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift) | Gesamte Datei   |
| Knotenmodus-Koordinator | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift) | Gesamte Datei   |
| Knotenlaufzeit | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift) | Gesamte Datei   |
| Berechtigungsmanager | [`apps/macos/Sources/Clawdbot/PermissionManager.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/PermissionManager.swift) | Gesamte Datei   |
| Exec Approvals | [`apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift) | Gesamte Datei   |
| Menüleiste | [`apps/macos/Sources/Clawdbot/MenuBar.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/MenuBar.swift) | Gesamte Datei   |
| Menü-Injektor | [`apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift) | Gesamte Datei   |

**Schlüsselkonstanten**:
- `GatewayConnection.shared`: Singleton-Gateway-Verbindungsmanager (`GatewayConnection.swift:48`)
- `VoiceWakeRuntime`: Voice Wake-Kernlaufzeit (Singleton)
- `MacNodeModeCoordinator`: Knotenmodus-Koordinator, verwaltet lokalen Dienststart

**Schlüsseltypen**:
- `GatewayAgentChannel`: Gateway-Agent-Kanal-Enumeration (`GatewayConnection.swift:9-30`)
- `GatewayAgentInvocation`: Gateway-Agent-Aufrufstruktur (`GatewayConnection.swift:32-41`)
- `ExecApprovalsConfig`: Exec Approvals-Konfigurationsstruktur (JSON-Schema)
- `VoiceWakeSettings`: Voice Wake-Konfigurationsstruktur

**Schlüsselfunktionen**:
- `GatewayConnection.sendAgent()`: Sendet agent-Anfrage an das Gateway
- `GatewayConnection.setVoiceWakeTriggers()`: Aktualisiert die globale Aktivierungswortliste
- `PermissionManager.checkPermission()`: Überprüft den TCC-Berechtigungsstatus
- `ExecApprovalsGatewayPrompter.prompt()`: Zeigt das Genehmigungsdialogfeld an

**Dokumentationspositionen**:
- [macOS-App-Dokumentation](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/macos.md)
- [Voice Wake-Dokumentation](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/voicewake.md)
- [Talk Mode-Dokumentation](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/talk.md)
- [Knotendokumentation](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/index.md)

</details>
