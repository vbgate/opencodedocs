---
title: "Canvas-Visualisierungsschnittstelle und A2UI | Clawdbot-Tutorial"
sidebarTitle: "Visuelle Schnittstellen für KI erstellen"
subtitle: "Canvas-Visualisierungsschnittstelle und A2UI"
description: "Lernen Sie die Canvas-Visualisierungsschnittstelle von Clawdbot zu verwenden, verstehen Sie den A2UI-Push-Mechanismus, die Canvas-Host-Konfiguration und Canvas-Operationen auf Knoten und erstellen Sie interaktive Benutzeroberflächen für KI-Assistenten. Dieses Tutorial deckt zwei Methoden ab: statisches HTML und dynamisches A2UI, einschließlich der vollständigen Referenz der Canvas-Tool-Befehle, Sicherheitsmechanismen, Konfigurationsoptionen und Fehlerbehebungstipps."
tags:
  - "Canvas"
  - "A2UI"
  - "Visualisierungsschnittstelle"
  - "Knoten"
prerequisite:
  - "start-getting-started"
  - "platforms-ios-node"
  - "platforms-android-node"
order: 240
---

# Canvas-Visualisierungsschnittstelle und A2UI

## Was Sie nach dieser Lektion können werden

Nach Abschluss dieser Lektion werden Sie in der Lage sein:

- Canvas Host zu konfigurieren und benutzerdefinierte HTML/CSS/JS-Schnittstellen bereitzustellen
- Das `canvas`-Tool zur Steuerung von Canvas auf Knoten zu verwenden (anzeigen, ausblenden, navigieren, JS ausführen)
- Das A2UI-Protokoll zu beherrschen, damit KI dynamische UI-Updates pusht
- Canvas-Screenshots für den KI-Kontext zu erfassen
- Die Sicherheitsmechanismen und Zugriffskontrolle von Canvas zu verstehen

## Ihre aktuelle Situation

Sie haben einen KI-Assistenten, aber er kann nur über Text mit Ihnen interagieren. Sie möchten:

- Dass die KI visuelle Schnittstellen anzeigt, wie Tabellen, Diagramme, Formulare
- Dynamische UIs sehen, die von Agenten auf mobilen Geräten generiert wurden
- Eine interaktive "App"-ähnliche Erfahrung erstellen, ohne separat entwickeln zu müssen

## Wann diese Methode verwenden

**Canvas + A2UI eignet sich für diese Szenarien**:

| Szenario | Beispiel |
|--- | ---|
| **Datenvisualisierung** | Statistische Diagramme, Fortschrittsbalken, Zeitachsen anzeigen |
| **Interaktive Formulare** | Benutzer zur Bestätigung von Aktionen auffordern, Optionen auswählen lassen |
|--- | ---|
| **Spiele und Unterhaltung** | Einfache Minispiele, interaktive Demos |

::: tip A2UI vs. statisches HTML
- **A2UI**(Agent-to-UI): KI generiert und aktualisiert UI dynamisch, geeignet für Echtzeitdaten
- **Statisches HTML**: Vordefinierte Schnittstellen, geeignet für feste Layouts und komplexe Interaktionen
:::

## 🎒 Vorbereitungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie Folgendes abgeschlossen haben:

- [ ] **Gateway gestartet**: Canvas Host startet automatisch mit Gateway standardmäßig (Port 18793)
- [ ] **Knoten gepaart**: macOS/iOS/Android-Knoten mit Gateway verbunden
- [ ] **Knoten unterstützen Canvas**: Bestätigen Sie, dass der Knoten über die `canvas`-Fähigkeit verfügt (`clawdbot nodes list`)

::: warning Voraussetzungen
Dieses Tutorial setzt voraus, dass Sie bereits Folgendes kennen:
- [Grundlegendes Knoten-Pairing](../../platforms/android-node/)
- [KI-Tool-Aufruf-Mechanismus](../tools-browser/)
:::

## Kernkonzepte

Das Canvas-System umfasst drei Hauptkomponenten:

```
┌─────────────────┐
│   Canvas Host  │ ────▶ HTTP-Server (Port 18793)
│   (Gateway)   │        └── Dient ~/clawd/canvas/ Dateien
└─────────────────┘
        │
        │ WebSocket-Kommunikation
        │
┌─────────────────┐
│    Node App   │ ────▶ WKWebView rendert Canvas
│ (iOS/Android) │        └── Empfängt Pushs via A2UI
└─────────────────┘
        │
        │ userAction-Ereignisse
        │
┌─────────────────┐
│   AI Agent    │ ────▶ canvas-Tool-Aufrufe
│  (pi-mono)   │        └── Pusht A2UI-Updates
└─────────────────┘
```

**Wichtige Konzepte**:

1. **Canvas Host**(Gateway-Seite)
   - Stellt statischen Dateidienst bereit: `http://<gateway-host>:18793/__clawdbot__/canvas/`
   - Hostet A2UI-Host: `http://<gateway-host>:18793/__clawdbot__/a2ui/`
   - Unterstützt Hot-Reload: Automatische Aktualisierung nach Dateiänderung

2. **Canvas Panel**(Knoten-Seite)
   - macOS/iOS/Android-Knoten betten WKWebView ein
   - Verbinden sich mit Gateway über WebSocket (Echtzeit-Reload, A2UI-Kommunikation)
   - Unterstützen `eval` zur JS-Ausführung, `snapshot` zur Bildschirmaufnahme

3. **A2UI-Protokoll**(v0.8)
   - Agent pusht UI-Updates über WebSocket
   - Unterstützt: `beginRendering`, `surfaceUpdate`, `dataModelUpdate`, `deleteSurface`

## Folgen Sie den Schritten

### Schritt 1: Canvas-Host-Status überprüfen

**Warum**
Sicherstellen, dass Canvas Host läuft, damit Knoten Canvas-Inhalte laden können.

```bash
# Prüfen, ob Port 18793 abgehört wird
lsof -i :18793
```

**Sie sollten Folgendes sehen**:

```text
COMMAND   PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
node     12345  user   16u  IPv6  0x1234      0t0  TCP *:18793 (LISTEN)
```

::: info Konfigurationspfade
- **Canvas-Stammverzeichnis**: `~/clawd/canvas/`(änderbar über `canvasHost.root`)
- **Port**: `18793` = `gateway.port + 4`(änderbar über `canvasHost.port`)
- **Hot-Reload**: Standardmäßig aktiviert(deaktivierbar über `canvasHost.liveReload: false`)
:::

### Schritt 2: Die erste Canvas-Seite erstellen

**Warum**
Eine benutzerdefinierte HTML-Schnittstelle erstellen, um Ihren Inhalt auf dem Knoten anzuzeigen.

```bash
# Canvas-Stammverzeichnis erstellen (falls nicht vorhanden)
mkdir -p ~/clawd/canvas

# Einfache HTML-Datei erstellen
cat > ~/clawd/canvas/hello.html <<'EOF'
<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hello Canvas</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    padding: 20px;
    background: #000;
    color: #fff;
    text-align: center;
  }
  h1 { color: #24e08a; }
</style>
<h1>🎉 Hello from Canvas!</h1>
<p>Dies ist Ihre erste Canvas-Seite.</p>
<button onclick="alert('Button wurde geklickt!')">Klicken Sie hier</button>
EOF
```

**Sie sollten Folgendes sehen**:

```text
Datei erstellt: ~/clawd/canvas/hello.html
```

### Schritt 3: Canvas auf dem Knoten anzeigen

**Warum**
Den Knoten veranlassen, die soeben erstellte Seite zu laden und anzuzeigen.

Suchen Sie zuerst Ihre Knoten-ID:

```bash
clawdbot nodes list
```

**Sie sollten Folgendes sehen**:

```text
ID                                  Name          Type       Capabilities
──────────────────────────────────────────────────────────────────────────
abc123-def456-ghi789               iOS Phone     canvas, camera, screen
jkl012-mno345-pqr678               Android Tab   canvas, camera
```

Dann zeigen Sie Canvas an (mit dem iOS-Knoten als Beispiel):

```bash
# Methode 1: Über CLI-Befehl
clawdbot nodes canvas present --node abc123-def456-ghi789 --target http://127.0.0.1:18793/__clawdbot__/canvas/hello.html
```

**Sie sollten Folgendes sehen**:

- Ein randloses Panel öffnet sich auf dem iOS-Gerät und zeigt Ihren HTML-Inhalt
- Das Panel erscheint in der Nähe der Menüleiste oder der Mausposition
- Der Inhalt ist zentriert mit einem grünen Titel und einem Button

**KI-Aufruf-Beispiel**:

```
KI: Ich habe ein Canvas-Panel auf Ihrem iOS-Gerät geöffnet, das die Willkommensseite anzeigt.
```

::: tip Canvas-URL-Format
- **Lokale Datei**: `http://<gateway-host>:18793/__clawdbot__/canvas/hello.html`
- **Externe URL**: `https://example.com`(erfordert Netzwerk-Berechtigungen des Knotens)
- **Zurück zu Standard**: `/` oder leere Zeichenfolge, zeigt die integrierte Gerüstseite an
:::

### Schritt 4: A2UI zum Pushen dynamischer UI verwenden

**Warum**
KI kann UI-Updates direkt an Canvas pushen, ohne Dateien zu ändern, geeignet für Echtzeitdaten und Interaktion.

**Methode A: Schneller Text-Push**

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --text "Hello from A2UI"
```

**Sie sollten Folgendes sehen**:

- Canvas zeigt blaue A2UI-Schnittstelle
- Zentrierter Text zeigt: `Hello from A2UI`

**Methode B: Vollständiger JSONL-Push**

A2UI-Definitionsdatei erstellen:

```bash
cat > /tmp/a2ui-demo.jsonl <<'EOF'
{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","status","button"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"A2UI-Demo"},"usageHint":"h1"}}},{"id":"status","component":{"Text":{"text":{"literalString":"Systemstatus: Wird ausgeführt"},"usageHint":"body"}}},{"id":"button","component":{"Button":{"label":{"literalString":"Test-Button"},"onClick":{"action":{"name":"testAction","sourceComponentId":"demo.test"}}}}}]}
{"beginRendering":{"surfaceId":"main","root":"root"}}
EOF
```

A2UI pushen:

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --jsonl /tmp/a2ui-demo.jsonl
```

**Sie sollten Folgendes sehen**:

```
┌────────────────────────────┐
│     A2UI-Demo         │
│                        │
│  Systemstatus: Wird ausgeführt  │
│                        │
│   [ Test-Button ]          │
└────────────────────────────┘
```

::: details Erklärung des A2UI-JSONL-Formats
JSONL (JSON Lines) enthält ein JSON-Objekt pro Zeile, geeignet für Streaming-Updates:

```jsonl
{"surfaceUpdate":{...}}   // Oberflächenkomponenten aktualisieren
{"beginRendering":{...}}   // Rendern starten
{"dataModelUpdate":{...}} // Datenmodell aktualisieren
{"deleteSurface":{...}}   // Oberfläche löschen
```
:::

### Schritt 5: Canvas-JavaScript ausführen

**Warum**
Benutzerdefinierten JS in Canvas ausführen, wie DOM ändern, Status lesen.

```bash
clawdbot nodes canvas eval --node abc123-def456-ghi789 --js "document.title"
```

**Sie sollten Folgendes sehen**:

```text
"Hello from Canvas"
```

::: tip JS-Ausführungsbeispiele
- Element lesen: `document.querySelector('h1').textContent`
- Stil ändern: `document.body.style.background = '#333'`
- Wert berechnen: `innerWidth + 'x' + innerHeight`
- Closure ausführen: `(() => { ... })()`
:::

### Schritt 6: Canvas-Screenshot erfassen

**Warum**
Der KI erlauben, den aktuellen Canvas-Status für Kontextverständnis zu sehen.

```bash
# Standardformat (JPEG)
clawdbot nodes canvas snapshot --node abc123-def456-ghi789

# PNG-Format + maximale Breitenbeschränkung
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format png --max-width 1200

# JPEG hoher Qualität
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format jpg --quality 0.9
```

**Sie sollten Folgendes sehen**:

```text
Canvas snapshot saved to: /var/folders/.../canvas-snapshot.jpg
```

Der Dateipfad wird vom System automatisch generiert, normalerweise im temporären Verzeichnis.

### Schritt 7: Canvas ausblenden

**Warum**
Canvas-Panel schließen, um Bildschirmplatz freizugeben.

```bash
clawdbot nodes canvas hide --node abc123-def456-ghi789
```

**Sie sollten Folgendes sehen**:

- Das Canvas-Panel auf dem iOS-Gerät verschwindet
- Der Knotenstatus wird wiederhergestellt (falls vorher belegt)

## Kontrollpunkt ✅

**Überprüfen, ob Canvas-Funktionen korrekt funktionieren**:

| Überprüfungselement | Überprüfungsmethode |
|--- | ---|
| Canvas Host läuft | `lsof -i :18793` hat Ausgabe |
| Knoten-Canvas-Fähigkeit | `clawdbot nodes list` zeigt `canvas` |
| Seite erfolgreich geladen | Knoten zeigt HTML-Inhalt |
|--- | ---|
|--- | ---|
| Screenshot generiert | Temporäres Verzeichnis hat `.jpg`- oder `.png`-Datei |

## Warnungen

::: warning Vordergrund/Hintergrund-Einschränkungen
- **iOS/Android-Knoten**: Die Befehle `canvas.*` und `camera.*` **müssen im Vordergrund ausgeführt werden**
- Hintergrundaufrufe geben zurück: `NODE_BACKGROUND_UNAVAILABLE`
- Lösung: Gerät in den Vorderground bringen
:::

::: danger Sicherheitsvorkehrungen
- **Verzeichnis-Traversal-Schutz**: Canvas-URLs verbieten `..` für den Zugriff auf übergeordnete Verzeichnisse
- **Benutzerdefiniertes Schema**: `clawdbot-canvas://` nur für interne Verwendung durch den Knoten
- **HTTPS-Einschränkungen**: Externe HTTPS-URLs erfordern Netzwerk-Berechtigungen des Knotens
- **Dateizugriff**: Canvas Host erlaubt nur Zugriff auf Dateien unter `canvasHost.root`
:::

::: tip Debugging-Tipps
- **Gateway-Logs anzeigen**: `clawdbot gateway logs`
- **Knoten-Logs anzeigen**: iOS Einstellungen → Debug Logs, Android-App-Logs
- **URL testen**: Greifen Sie direkt im Browser auf `http://<gateway-host>:18793/__clawdbot__/canvas/` zu
:::

## Zusammenfassung der Lektion

In dieser Lektion haben Sie gelernt:

1. **Canvas-Architektur**: Die Beziehung zwischen Canvas Host, Node App und dem A2UI-Protokoll verstehen
2. **Canvas Host konfigurieren**: Stammverzeichnis, Port und Hot-Reload-Einstellungen anpassen
3. **Benutzerdefinierte Seiten erstellen**: HTML/CSS/JS schreiben und auf Knoten bereitstellen
4. **A2UI verwenden**: Dynamische UI-Updates über JSONL pushen
5. **JavaScript ausführen**: Code in Canvas ausführen, Status lesen und ändern
6. **Screenshots erfassen**: Der KI erlauben, den aktuellen Canvas-Status zu sehen

**Kernpunkte**:

- Canvas Host startet automatisch mit Gateway, keine zusätzliche Konfiguration erforderlich
- A2UI eignet sich für Echtzeitdaten, statisches HTML für komplexe Interaktionen
- Knoten müssen im Vordergrund sein, um Canvas-Operationen auszuführen
- `canvas snapshot` verwenden, um UI-Status an KI zu übergeben

## Nächste Lektion

> In der nächsten Lektion lernen wir **[Sprachaufwachung und Text-zu-Sprache](../voice-tts/)**.
>
> Sie werden lernen:
> - Voice Wake Aufwachschlüsselwörter konfigurieren
> - Talk Mode für kontinuierliche Sprachgespräche verwenden
> - Mehrere TTS-Anbieter integrieren (Edge, Deepgram, ElevenLabs)

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um den Quellcode-Speicherort anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Konstanten**:
- `A2UI_PATH = "/__clawdbot__/a2ui"`: A2UI-Host-Pfad
- `CANVAS_HOST_PATH = "/__clawdbot__/canvas"`: Canvas-Dateipfad
- `CANVAS_WS_PATH = "/__clawdbot__/ws"`: WebSocket-Hot-Reload-Pfad

**Wichtige Funktionen**:
- `createCanvasHost()`: Canvas-HTTP-Server starten (Port 18793)
- `injectCanvasLiveReload()`: WebSocket-Hot-Reload-Skript in HTML einfügen
- `handleA2uiHttpRequest()`: A2UI-Ressourcenanforderungen verarbeiten
- `createCanvasTool()`: `canvas`-Tool registrieren (present/hide/navigate/eval/snapshot/a2ui_push/a2ui_reset)

**Unterstützte Canvas-Actions**:
- `present`: Canvas anzeigen (optionale URL, Position, Größe)
- `hide`: Canvas ausblenden
- `navigate`: Zur URL navigieren (lokaler Pfad/HTTP/file://)
- `eval`: JavaScript ausführen
- `snapshot`: Screenshot erfassen (PNG/JPEG, optionale maxWidth/quality)
- `a2ui_push`: A2UI-Updates pushen (JSONL oder Text)
- `a2ui_reset`: A2UI-Status zurücksetzen

**Konfigurations-Schema**:
- `canvasHost.root`: Canvas-Stammverzeichnis (Standard `~/clawd/canvas`)
- `canvasHost.port`: HTTP-Port (Standard 18793)
- `canvasHost.liveReload`: Hot-Reload aktivieren (Standard true)
- `canvasHost.enabled`: Canvas Host aktivieren (Standard true)

**Von A2UI v0.8 unterstützte Nachrichten**:
- `beginRendering`: Rendern einer bestimmten Oberfläche starten
- `surfaceUpdate`: Oberflächenkomponenten aktualisieren (Column, Text, Button, usw.)
- `dataModelUpdate`: Datenmodell aktualisieren
- `deleteSurface`: Bestimmte Oberfläche löschen

</details>
