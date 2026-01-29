---
title: "WebChat-Oberfläche: Der KI-Assistent im Browser | Clawdbot-Tutorial"
sidebarTitle: "Testen Sie die Web-Version der KI"
subtitle: "WebChat-Oberfläche: Der KI-Assistent im Browser"
description: "Erfahren Sie, wie Sie die integrierte WebChat-Oberfläche von Clawdbot für Gespräche mit dem KI-Assistenten verwenden. Dieses Tutorial erklärt den Zugang zu WebChat, die Kernfunktionen (Sitzungsverwaltung, Dateiuploads, Markdown-Unterstützung) und die Remote-Zugriffskonfiguration (SSH-Tunnel, Tailscale), ohne zusätzliche Ports oder separate Konfiguration."
tags:
  - "WebChat"
  - "Browser-Oberfläche"
  - "Chat"
prerequisite:
  - "start-gateway-startup"
order: 150
---

# WebChat-Oberfläche: Der KI-Assistent im Browser

## Nach diesem Lernen können Sie

Nach Abschluss dieses Tutorials können Sie:

- ✅ Über den Browser auf die WebChat-Oberfläche zugreifen
- ✅ Nachrichten in WebChat senden und KI-Antworten empfangen
- ✅ Sitzungsverläufe verwalten und zwischen Sitzungen wechseln
- ✅ Anhänge hochladen (Bilder, Audio, Videos)
- ✅ Remote-Zugriff konfigurieren (Tailscale/SSH-Tunnel)
- ✅ Die Unterschiede zwischen WebChat und anderen Kanälen verstehen

## Ihre aktuelle Situation

Sie haben das Gateway möglicherweise bereits gestartet, bevorzugen aber eine intuitivere grafische Oberfläche für Gespräche mit dem KI-Assistenten statt nur der Kommandozeile.

Vielleicht möchten Sie wissen:

- "Gibt es eine Web-Oberfläche wie bei ChatGPT?"
- "Was sind die Unterschiede zwischen WebChat und WhatsApp/Telegram-Kanälen?"
- "Benötigt WebChat eine separate Konfiguration?"
- "Wie verwende ich WebChat auf einem Remote-Server?"

Die gute Nachricht: **WebChat ist die integrierte Chat-Oberfläche von Clawdbot**, keine separate Installation oder Konfiguration erforderlich – nach dem Start des Gateways können Sie sie verwenden.

## Wann sollten Sie diesen Ansatz verwenden

Wenn Sie benötigen:

- 🖥️ **Grafische Gesprächsoberfläche**: Bevorzugen Sie die Chat-Erfahrung im Browser statt der Kommandozeile
- 📊 **Sitzungsverwaltung**: Verlaufsanzeige, Wechsel zwischen verschiedenen Sitzungen
- 🌐 **Lokaler Zugriff**: Gespräche mit der KI auf demselben Gerät
- 🔄 **Remote-Zugriff**: Zugriff auf Remote-Gateway über SSH/Tailscale-Tunnel
- 💬 **Rich-Text-Interaktion**: Markdown-Formatierung und Anhänge unterstützt

---

## 🎒 Vorbereitungen

Bevor Sie WebChat verwenden, bestätigen Sie bitte:

### Erforderliche Voraussetzungen

| Voraussetzung                     | Überprüfung                                        |
|--- | ---|
| **Gateway gestartet**   | `clawdbot gateway status` oder Überprüfen, ob der Prozess läuft |
| **Port erreichbar**       | Bestätigen Sie, dass Port 18789 (oder der benutzerdefinierte Port) nicht belegt ist |
| **KI-Modell konfiguriert** | `clawdbot models list` um verfügbare Modelle anzuzeigen      |

::: warning Vorherige Kurse
Dieses Tutorial setzt voraus, dass Sie bereits abgeschlossen haben:
- [Schnellstart](../../start/getting-started/) - Installation, Konfiguration und Start von Clawdbot
- [Gateway starten](../../start/gateway-startup/) - Verstehen der verschiedenen Startmodi des Gateways

Wenn noch nicht abgeschlossen, kehren Sie bitte zu diesen Kursen zurück.
:::

### Optional: Authentifizierung konfigurieren

WebChat erfordert standardmäßig eine Authentifizierung (auch bei lokalem Zugriff), um Ihren KI-Assistenten zu schützen.

Schnelle Überprüfung:

```bash
## Aktuelle Authentifizierungskonfiguration anzeigen
clawdbot config get gateway.auth.mode
clawdbot config get gateway.auth.token
```

Wenn nicht konfiguriert, wird empfohlen, dies zunächst einzurichten:

```bash
## Token-Authentifizierung einrichten (empfohlen)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here
```

Detaillierte Beschreibung: [Gateway-Authentifizierungskonfiguration](../../advanced/security-sandbox/).

---

## Kernkonzept

### Was ist WebChat

**WebChat** ist die integrierte Chat-Oberfläche von Clawdbot, die direkt über das Gateway WebSocket mit dem KI-Assistenten interagiert.

**Schlüsselmerkmale**:

```
┌─────────────────────────────────────────────────────┐
│              WebChat-Architektur                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Browser/Client                                     │
│      │                                              │
│      ▼                                              │
│  Gateway WebSocket (ws://127.0.0.1:18789)          │
│      │                                              │
│      ├─ chat.send → Agent → Nachricht verarbeiten   │
│      ├─ chat.history → Sitzungsverlauf zurückgeben │
│      ├─ chat.inject → Systemnotiz hinzufügen       │
│      └─ Ereignisstrom → Echtzeit-Update             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Unterschiede zu anderen Kanälen**:

| Merkmal         | WebChat                          | WhatsApp/Telegram usw.                |
|--- | --- | ---|
| **Zugangsart** | Direkter Browser-Zugriff zum Gateway           | Erfordert Drittanbieter-APP und Login         |
| **Konfigurationsbedarf** | Keine separate Konfiguration, Gateway-Port wiederverwenden   | Erfordert kanalspezifische API-Key/Token  |
| **Antwort-Routing** | Deterministisches Routing zurück zu WebChat          | Routing zum entsprechenden Kanal              |
| **Remote-Zugriff** | Über SSH/Tailscale-Tunnel       | Wird vom Kanalplattform bereitgestellt         |
| **Sitzungsmodell** | Verwendet Sitzungsverwaltung des Gateways        | Verwendet Sitzungsverwaltung des Gateways        |

### Funktionsweise von WebChat

WebChat benötigt keinen separaten HTTP-Server oder Port-Konfiguration, es verwendet direkt den WebSocket-Dienst des Gateways.

**Schlüsselpunkte**:
- **Geteilter Port**: WebChat verwendet denselben Port wie das Gateway (Standard 18789)
- **Keine zusätzliche Konfiguration**: Kein spezieller `webchat.*`-Konfigurationsblock
- **Echtzeit-Synchronisation**: Verläufe werden in Echtzeit vom Gateway abgerufen, lokal nicht zwischengespeichert
- **Schreibgeschützter Modus**: Wenn das Gateway nicht erreichbar ist, wird WebChat schreibgeschützt

::: info WebChat vs. Control-Oberfläche
WebChat konzentriert sich auf die Chat-Erfahrung, während die **Control-Oberfläche** ein vollständiges Gateway-Kontrollpanel bereitstellt (Konfiguration, Sitzungsverwaltung, Kompetenzverwaltung usw.).

- WebChat: `http://localhost:18789/chat` oder Chat-Ansicht in der macOS-App
- Control-Oberfläche: `http://localhost:18789/` vollständiges Kontrollpanel
:::

---

## Lernen Sie mit mir

### Schritt 1: Zugriff auf WebChat

**Warum**
WebChat ist die integrierte Chat-Oberfläche des Gateways, keine zusätzliche Software erforderlich.

#### Methode 1: Browser-Zugriff

Öffnen Sie den Browser und gehen Sie zu:

```bash
## Standardadresse (mit Standardport 18789)
http://localhost:18789

## Oder verwenden Sie die Loopback-Adresse (zuverlässiger)
http://127.0.0.1:18789
```

**Sie sollten sehen**:
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  [Sitzungsliste]  [Einstellungen]      │   │
│  └───────────────────────────────────┘   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  Hallo! Ich bin Ihr KI-Assistent.       │   │
│  │  Wie kann ich Ihnen helfen?        │   │
│  └───────────────────────────────────┘   │
│                                             │
│  [Nachricht eingeben...]                  [Senden]   │
└─────────────────────────────────────────────┘
```

#### Methode 2: macOS-Anwendung

Wenn Sie die Menüleisten-App von Clawdbot für macOS installiert haben:

1. Klicken Sie auf das Menüleisten-Symbol
2. Wählen Sie "Open WebChat" oder klicken Sie auf das Chat-Symbol
3. WebChat öffnet sich in einem separaten Fenster

**Vorteile**:
- Native macOS-Erfahrung
- Tastaturkürzel-Unterstützung
- Integration mit Voice Wake und Talk Mode

#### Methode 3: Kommandozeile-Shortcut

```bash
## Automatisches Öffnen des Browsers zu WebChat
clawdbot web
```

**Sie sollten sehen**: Der Standardbrowser öffnet sich automatisch und navigiert zu `http://localhost:18789`

---

### Schritt 2: Senden der ersten Nachricht

**Warum**
Überprüfung der Verbindung zwischen WebChat und Gateway und ob der KI-Assistent korrekt antwortet.

1. Geben Sie Ihre erste Nachricht in das Eingabefeld ein
2. Klicken Sie auf "Senden"-Button oder drücken Sie `Enter`
3. Beobachten Sie die Antwort der Chat-Oberfläche

**Beispielnachricht**:
```
Hello! I'm testing WebChat. Can you introduce yourself?
```

**Sie sollten sehen**:
```
┌─────────────────────────────────────────────┐
│  Sie → KI: Hello! I'm testing...      │
│                                             │
│  KI → Sie: Hallo! Ich bin Clawdbot KI    │
│  Assistent. Ich kann Ihnen helfen, Fragen zu beantworten,          │
│  Code zu schreiben, Aufgaben zu verwalten, usw.              │
│  Wie kann ich Ihnen helfen?            │
│                                             │
│  [Nachricht eingeben...]                  [Senden]   │
└─────────────────────────────────────────────┘
```

::: tip Authentifizierungshinweis
Wenn das Gateway für Authentifizierung konfiguriert ist, wird beim Zugriff auf WebChat zur Eingabe eines Tokens oder Passworts aufgefordert:

```
┌─────────────────────────────────────────────┐
│          Gateway-Authentifizierung                    │
│                                             │
│  Bitte Token eingeben:                             │
│  [•••••••••••••]              │
│                                             │
│              [Abbrechen]  [Anmelden]               │
└─────────────────────────────────────────────┘
```

Geben Sie Ihr konfiguriertes `gateway.auth.token` oder `gateway.auth.password` ein.
:::

---

### Schritt 3: Verwendung der WebChat-Funktionen

**Warum**
WebChat bietet umfangreiche Interaktionsfunktionen. Das Vertrautsein mit diesen Funktionen verbessert die Benutzererfahrung.

#### Sitzungsverwaltung

WebChat unterstützt die Verwaltung mehrerer Sitzungen, damit Sie in verschiedenen Kontexten mit der KI sprechen können.

**Schritte**:

1. Klicken Sie auf die Sitzungsliste links (oder auf "Neue Sitzung"-Button)
2. Wählen Sie eine Sitzung aus oder erstellen Sie eine neue
3. Setzen Sie das Gespräch in der neuen Sitzung fort

**Sitzungsmerkmale**:
- ✅ Unabhängiger Kontext: Die Nachrichtenhistorie jeder Sitzung ist isoliert
- ✅ Automatische Speicherung: Alle Sitzungen werden vom Gateway verwaltet und persistent gespeichert
- ✅ Plattformübergreifende Synchronisation: Gleiche Sitzungsdaten werden mit CLI, macOS-App, iOS/Android-Knoten geteilt

::: info Hauptsitzung
WebChat verwendet standardmäßig den **Hauptsitzungsschlüssel** (`main`) des Gateways, was bedeutet, dass alle Clients (CLI, WebChat, macOS-App, iOS/Android-Knoten) denselben Hauptsitzungsverlauf teilen.

Wenn Sie einen isolierten Kontext benötigen, können Sie in der Konfiguration verschiedene Sitzungsschlüssel festlegen.
:::

#### Anhänge hochladen

WebChat unterstützt das Hochladen von Bildern, Audio, Videos und anderen Anhängen.

**Schritte**:

1. Klicken Sie auf das "Anhang"-Symbol neben dem Eingabefeld (normalerweise 📎 oder 📎️)
2. Wählen Sie die zu hochladende Datei aus (oder ziehen Sie die Datei in den Chat-Bereich)
3. Geben Sie die relevante Textbeschreibung ein
4. Klicken Sie auf "Senden"

**Unterstützte Formate**:
- 📷 **Bilder**: JPEG, PNG, GIF
- 🎵 **Audio**: MP3, WAV, M4A
- 🎬 **Video**: MP4, MOV
- 📄 **Dokumente**: PDF, TXT usw. (abhängig von der Gateway-Konfiguration)

**Sie sollten sehen**:
```
┌─────────────────────────────────────────────┐
│  Sie → KI: Bitte analysieren Sie dieses Bild         │
│  [📎 photo.jpg]                         │
│                                             │
│  KI → Sie: Ich sehe, dass dies ein...        │
│  [Analyseergebnis...]                              │
└─────────────────────────────────────────────┘
```

::: warning Dateigrößenbeschränkung
WebChat und das Gateway haben Größenbeschränkungen für hochgeladene Dateien (normalerweise einige MB). Wenn das Hochladen fehlschlägt, überprüfen Sie die Dateigröße oder die Medienkonfiguration des Gateways.
:::

#### Markdown-Unterstützung

WebChat unterstützt Markdown-Formatierung, damit Sie Nachrichten formatieren können.

**Beispiel**:

```markdown
# Überschrift
## Unterüberschrift
- Listenelement 1
- Listenelement 2

**Fett** und *Kursiv*
`Code`
```

**Vorschau-Effekt**:
```
# Überschrift
## Unterüberschrift
- Listenelement 1
- Listenelement 2

**Fett** und *Kursiv*
`Code`
```

#### Befehls-Shortcuts

WebChat unterstützt Slash-Befehle für schnelle Ausführung bestimmter Aktionen.

**Häufige Befehle**:

| Befehl             | Funktion                         |
|--- | ---|
| `/new`          | Neue Sitzung erstellen                   |
| `/reset`        | Historie der aktuellen Sitzung zurücksetzen           |
| `/clear`        | Alle Nachrichten der aktuellen Sitzung löschen       |
| `/status`       | Gateway- und Kanalstatus anzeigen       |
| `/models`       | Verfügbare KI-Modelle auflisten         |
| `/help`         | Hilfemeldung anzeigen                 |

**Verwendungsbeispiel**:

```
/new
## Neue Sitzung erstellen

/reset
## Aktuelle Sitzung zurücksetzen
```

---

### Schritt 4 (Optional): Remote-Zugriff konfigurieren

**Warum**
Wenn Sie das Gateway auf einem Remote-Server ausführen oder von anderen Geräten auf WebChat zugreifen möchten, müssen Sie den Remote-Zugriff konfigurieren.

#### Zugriff über SSH-Tunnel

**Anwendungsszenario**: Gateway auf Remote-Server, Sie möchten von Ihrem lokalen Computer auf WebChat zugreifen.

**Schritte**:

1. Richten Sie einen SSH-Tunnel ein, der den Remote-Gateway-Port auf den lokalen Port abbildet:

```bash
## Den Remote-Port 18789 auf den lokalen Port 18789 abbilden
ssh -L 18789:localhost:18789 user@your-remote-server.com
```

2. Halten Sie die SSH-Verbindung offen (oder verwenden Sie den Parameter `-N`, um keine Remote-Befehle auszuführen)

3. Greifen Sie vom lokalen Browser auf: `http://localhost:18789`

**Sie sollten sehen**: Dieselbe WebChat-Oberfläche wie bei lokalem Zugriff

::: tip SSH-Tunnel aufrechterhalten
SSH-Tunnel werden bei Verbindungsabbruch unwirksam. Wenn Sie einen persistenten Zugriff benötigen:

- Verwenden Sie `autossh` für automatische Wiederverbindung
- Konfigurieren Sie `LocalForward` in der SSH-Konfiguration
- Verwenden Sie systemd/launchd für automatischen Start des Tunnels
:::

#### Zugriff über Tailscale

**Anwendungsszenario**: Verwenden Sie Tailscale zur Erstellung eines privaten Netzwerks, Gateway und Clients im selben Tailnet.

**Konfigurationsschritte**:

1. Aktivieren Sie Tailscale Serve oder Funnel auf dem Gateway-Rechner:

```bash
## Konfigurationsdatei bearbeiten
clawdbot config set gateway.tailscale.mode serve
## Oder
clawdbot config set gateway.tailscale.mode funnel
```

2. Starten Sie das Gateway neu

```bash
## Gateway neu starten, um die Konfiguration anzuwenden
clawdbot gateway restart
```

3. Ermitteln Sie die Tailscale-Adresse des Gateways

```bash
## Status anzeigen (zeigt Tailscale-URL an)
clawdbot gateway status
```

4. Greifen Sie vom Client-Gerät (im selben Tailnet) zu:

```
http://<gateway-tailscale-name>.tailnet-<tailnet-id>.ts.net:18789
```

::: info Tailscale Serve vs. Funnel
- **Serve**: Nur innerhalb des Tailnets zugänglich, sicherer
- **Funnel**: Öffentlicher Zugang zum Internet, erfordert `gateway.auth`-Schutz

Es wird empfohlen, den Serve-Modus zu verwenden, es sei denn, Sie benötigen Zugriff aus dem öffentlichen Netz.
:::

#### Remote-Zugriff-Authentifizierung

Unabhängig davon, ob Sie SSH-Tunnel oder Tailscale verwenden, müssen Sie bei konfigurierter Gateway-Authentifizierung ein Token oder Passwort bereitstellen.

**Authentifizierungskonfiguration überprüfen**:

```bash
## Authentifizierungsmodus anzeigen
clawdbot config get gateway.auth.mode

## Wenn Token-Modus, bestätigen Sie, dass das Token festgelegt ist
clawdbot config get gateway.auth.token
```

---

## Kontrollpunkt ✅

Nach Abschluss der oben genannten Schritte sollten Sie in der Lage sein:

- [ ] Auf WebChat im Browser zuzugreifen (`http://localhost:18789`)
- [ ] Nachrichten zu senden und KI-Antworten zu erhalten
- [ ] Sitzungsverwaltungsfunktionen zu verwenden (neu erstellen, wechseln, Sitzungen zurücksetzen)
- [ ] Anhänge hochzuladen und von der KI analysieren zu lassen
- [ ] (Optional) Remote-Zugriff auf WebChat über SSH-Tunnel
- [ ] (Optional) Zugriff auf WebChat über Tailscale

::: tip Verbindung überprüfen
Wenn WebChat nicht zugänglich ist oder das Senden von Nachrichten fehlschlägt, überprüfen Sie:

1. Ob das Gateway läuft: `clawdbot gateway status`
2. Ob der Port korrekt ist: Bestätigen Sie, dass Sie auf `http://127.0.0.1:18789` zugreifen (nicht `localhost:18789`)
3. Ob die Authentifizierung konfiguriert ist: `clawdbot config get gateway.auth.*`
4. Detaillierte Protokolle anzeigen: `clawdbot gateway --verbose`
:::

---

## Häufige Fehler

### ❌ Gateway nicht gestartet

**Falscher Ansatz**:
```
Direkter Zugriff auf http://localhost:18789
## Ergebnis: Verbindung fehlgeschlagen oder nicht ladbar
```

**Richtiger Ansatz**:
```bash
## Gateway zuerst starten
clawdbot gateway --port 18789

## Dann auf WebChat zugreifen
open http://localhost:18789
```

::: warning Gateway muss zuerst gestartet werden
WebChat hängt vom WebSocket-Dienst des Gateways ab. Ohne laufendes Gateway kann WebChat nicht normal funktionieren.
:::

### ❌ Falsche Port-Konfiguration

**Falscher Ansatz**:
```
Zugriff auf http://localhost:8888
## Gateway läuft tatsächlich auf Port 18789
## Ergebnis: Verbindung abgelehnt
```

**Richtiger Ansatz**:
```bash
## 1. Tatsächlichen Gateway-Port anzeigen
clawdbot config get gateway.port

## 2. Mit dem richtigen Port zugreifen
open http://localhost:<gateway.port>
```

### ❌ Authentifizierungskonfiguration vergessen

**Falscher Ansatz**:
```
Kein gateway.auth.mode oder Token festgelegt
## Ergebnis: WebChat zeigt Authentifizierungsfehler an
```

**Richtiger Ansatz**:
```bash
## Token-Authentifizierung einrichten (empfohlen)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here

## Gateway neu starten
clawdbot gateway restart

## Token beim Zugriff auf WebChat eingeben
```

### ❌ Remote-Zugriff nicht konfiguriert

**Falscher Ansatz**:
```
Direkter Zugriff auf Remote-Server-IP von lokal
http://remote-server-ip:18789
## Ergebnis: Verbindungs-Timeout (Firewall blockiert)
```

**Richtiger Ansatz**:
```bash
## SSH-Tunnel verwenden
ssh -L 18789:localhost:18789 user@remote-server.com

## Oder Tailscale Serve verwenden
clawdbot config set gateway.tailscale.mode serve
clawdbot gateway restart

## Vom lokalen Browser zugreifen
http://localhost:18789
```

---

## Lektionszusammenfassung

In dieser Lektion haben Sie gelernt:

1. ✅ **Einführung in WebChat**: Integrierte Chat-Oberfläche basierend auf Gateway WebSocket, keine separate Konfiguration erforderlich
2. ✅ **Zugriffsarten**: Browser-Zugriff, macOS-Anwendung, Kommandozeile-Shortcut
3. ✅ **Kernfunktionen**: Sitzungsverwaltung, Anhänge hochladen, Markdown-Unterstützung, Slash-Befehle
4. ✅ **Remote-Zugriff**: Zugriff auf Remote-Gateway über SSH-Tunnel oder Tailscale
5. ✅ **Authentifizierungskonfiguration**: Verständnis der Gateway-Authentifizierungsmodi (token/password/Tailscale)
6. ✅ **Fehlerbehebung**: Häufige Probleme und Lösungen

**Wiederholung der Schlüsselkonzepte**:

- WebChat verwendet denselben Port wie das Gateway, kein separater HTTP-Server erforderlich
- Verläufe werden vom Gateway verwaltet, Echtzeit-Synchronisation, lokal nicht zwischengespeichert
- Wenn das Gateway nicht erreichbar ist, wird WebChat schreibgeschützt
- Antworten werden deterministisch an WebChat geroutet, anders als bei anderen Kanälen

**Nächste Schritte**:

- Erkunden Sie die [macOS-Anwendung](../macos-app/), um Menüleistensteuerung und Voice Wake-Funktionalitäten zu verstehen
- Lernen Sie den [iOS-Knoten](../ios-node/) kennen, um lokale Operationen auf mobilen Geräten zu konfigurieren
- Verstehen Sie die [Canvas-Visualisierungsoberfläche](../../advanced/canvas/), um den KI-gesteuerten visuellen Arbeitsbereich zu erleben

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[macOS-Anwendung](../macos-app/)**.
>
> Sie werden lernen:
> - Funktionen und Layout der macOS-Menüleisten-Anwendung
> - Verwendung von Voice Wake und Talk Mode
> - Integrationsart von WebChat mit der macOS-Anwendung
> - Debugging-Tools und Remote-Gateway-Steuerung

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-27

| Funktion                  | Dateipfad                                                                                    | Zeilennummer    |
|--- | --- | ---|
| WebChat-Prinzip-Erklärung     | [`docs/web/webchat.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/web/webchat.md) | Gesamte Datei   |
| Gateway WebSocket API | [`src/gateway/protocol/`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/) | Gesamtes Verzeichnis   |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Web-UI-Eingang         | [`ui/index.html`](https://github.com/clawdbot/clawdbot/blob/main/ui/index.html) | 1-15     |
|--- | --- | ---|
| Tailscale-Integration       | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | Gesamte Datei   |
| macOS WebChat-Integration  | [`apps/macos/`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/) | Gesamtes Verzeichnis   |

**Wichtige Konstanten**:
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: Interne WebChat-Nachrichtenkanal-Bezeichner (aus `src/utils/message-channel.ts:17`)

**Wichtige Konfigurationselemente**:
- `gateway.port`: WebSocket-Port (Standard 18789)
- `gateway.auth.mode`: Authentifizierungsmodus (token/password/tailscale)
- `gateway.auth.token`: Token-Wert für Token-Authentifizierung
- `gateway.auth.password`: Passwort-Wert für Passwort-Authentifizierung
- `gateway.tailscale.mode`: Tailscale-Modus (serve/funnel/disabled)
- `gateway.remote.url`: WebSocket-Adresse des Remote-Gateways
- `gateway.remote.token`: Remote-Gateway-Authentifizierungstoken
- `gateway.remote.password`: Remote-Gateway-Authentifizierungspasswort

**Wichtige WebSocket-Methoden**:
- `chat.send(message)`: Nachricht an Agent senden (aus `src/gateway/server-methods/chat.ts`)
- `chat.history(sessionId)`: Sitzungsverlauf abrufen (aus `src/gateway/server-methods/chat.ts`)
- `chat.inject(message)`: Systemnotiz direkt in Sitzung injizieren, ohne Agent (aus `src/gateway/server-methods/chat.ts`)

**Architekturmerkmale**:
- WebChat benötigt keinen separaten HTTP-Server oder Port-Konfiguration
- Verwendet denselben Port wie das Gateway (Standard 18789)
- Verläufe werden in Echtzeit vom Gateway abgerufen, lokal nicht zwischengespeichert
- Antworten werden deterministisch an WebChat geroutet (anders als bei anderen Kanälen)

</details>
