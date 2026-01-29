---
title: "Browser-Automatisierungstools: Web-Steuerung und UI-Automatisierung | Clawdbot-Tutorial"
sidebarTitle: "Browser-Steuerung in 5 Minuten"
subtitle: "Browser-Automatisierungstools: Web-Steuerung und UI-Automatisierung | Clawdbot-Tutorial"
description: "Lernen Sie, wie Sie die Browser-Tools von Clawdbot für Web-Automatisierung, Bildschirmfotos, Formularbearbeitung und UI-Steuerung verwenden. Dieses Tutorial behandelt den Browser-Start, Seiten-Snapshots, UI-Interaktion (click/type/drag usw.), Datei-Uploads, Dialog-Handhabung und Remote-Browser-Steuerung. Meistern Sie den vollständigen Workflow, einschließlich Chrome-Erweiterungs-Relais-Modus und eigenständiger Browser-Konfiguration sowie die Ausführung von Browser-Operationen auf iOS/Android-Knoten."
tags:
  - "browser"
  - "automation"
  - "ui"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 210
---

# Browser-Automatisierungstools: Web-Steuerung und UI-Automatisierung

## Was Sie nach Abschluss können

- Starten und Steuern von Browsern, die von Clawdbot verwaltet werden
- Verwendung des Chrome-Erweiterungs-Relais zum Übernehmen Ihrer bestehenden Chrome-Tabs
- Aufnehmen von Seiten-Snapshots (AI/ARIA-Format) und Bildschirmfotos (PNG/JPEG)
- Ausführen von UI-Automatisierungsoperationen: Klick, Texteingabe, Drag & Drop, Auswahl, Formularausfüllung
- Handhaben von Datei-Uploads und Dialogen (alert/confirm/prompt)
- Betrieb verteilter Browser über den Remote-Browser-Kontrollserver
- Ausführen von Browser-Operationen auf iOS/Android-Geräten unter Verwendung des Knotenproxys

## Ihre aktuelle Situation

Sie haben bereits Gateway ausgeführt und die KI-Modelle konfiguriert, haben aber noch Fragen zur Verwendung der Browser-Tools:

- Die KI kann nicht auf Webseiteninhalte zugreifen und Sie müssen die Seitenstruktur beschreiben?
- Sie möchten, dass die KI automatisch Formulare ausfüllt und Buttons klickt, wissen aber nicht wie?
- Sie möchten Bildschirmfotos aufnehmen oder Webseiten speichern, müssen aber jedes Mal manuell vorgehen?
- Sie möchten Ihre eigenen Chrome-Tabs (mit angemeldeter Sitzung) verwenden, anstatt einen neuen Browser zu starten?
- Sie möchten Browser-Operationen auf Remote-Geräten wie iOS/Android-Knoten ausführen?

## Wann Sie dies verwenden sollten

**Verwendungsszenarien für Browser-Tools**:

| Szenario | Action | Beispiel |
|--- | --- | ---|
| Formular-Automatisierung | `act` + `fill` | Registrierungsformulare ausfüllen, Bestellungen senden |
| Web Scraping | `snapshot` | Seitenstruktur extrahieren, Daten sammeln |
| Bildschirmfotos speichern | `screenshot` | Seiten-Bildschirmfotos speichern, Beweise speichern |
| Datei-Upload | `upload` | Lebenslauf hochladen, Anhänge hochladen |
| Dialog-Handhabung | `dialog` | alert/confirm akzeptieren/ablehnen |
| Vorhandene Sitzung verwenden | `profile="chrome"` | Auf angemeldeten Chrome-Tabs arbeiten |
| Remote-Steuerung | `target="node"` | Auf iOS/Android-Knoten ausführen |

## 🎒 Vorbereitungen vor dem Start

::: warning Vorabprüfung

Bevor Sie die Browser-Tools verwenden, stellen Sie sicher:

1. ✅ Gateway ist gestartet (`clawdbot gateway start`)
2. ✅ KI-Modelle sind konfiguriert (Anthropic / OpenAI / OpenRouter usw.)
3. ✅ Browser-Tools sind aktiviert (`browser.enabled=true`)
4. ✅ Sie verstehen das Ziel, das Sie verwenden (sandbox/host/custom/node)
5. ✅ Wenn Sie das Chrome-Erweiterungs-Relais verwenden, haben Sie die Erweiterung installiert und aktiviert

:::

## Kernkonzept

**Was sind Browser-Tools?**

Browser-Tools sind integrierte Automatisierungstools in Clawdbot, die es der KI ermöglichen, Browser über CDP (Chrome DevTools Protocol) zu steuern:

- **Kontrollserver**: `http://127.0.0.1:18791` (Standard)
- **UI-Automatisierung**: Element-Lokalisierung und -Manipulation basierend auf Playwright
- **Snapshot-Mechanismus**: AI-Format oder ARIA-Format, gibt Seitenstruktur und Elementreferenzen zurück
- **Multi-Ziel-Unterstützung**: sandbox (Standard), host (Chrome-Relais), custom (Remote), node (Geräteknoten)

**Zwei Browser-Modi**:

| Modus | Profile | Treiber | Beschreibung |
|--- | --- | --- | ---|
| **Eigenständiger Browser** | `clawd` (Standard) | clawd | Clawdbot startet eine eigenständige Chrome/Chromium-Instanz |
| **Chrome-Relais** | `chrome` | extension | Übernimmt Ihre bestehenden Chrome-Tabs (erfordert Installation der Erweiterung) |

**Workflow**:

```
1. Browser starten (start)
   ↓
2. Tab öffnen (open)
   ↓
3. Seiten-Snapshot abrufen (snapshot) → Elementreferenzen (ref) erhalten
   ↓
4. UI-Operationen ausführen (act: click/type/fill/drag)
   ↓
5. Ergebnisse überprüfen (screenshot/snapshot)
```

## Folgen Sie den Schritten

### Schritt 1: Browser starten

**Warum**

Beim ersten Verwenden der Browser-Tools müssen Sie zuerst den Browser-Kontrollserver starten.

```bash
# Im Chat die KI auffordern, den Browser zu starten
Bitte starten Sie den Browser

# Oder Browser-Tool verwenden
action: start
profile: clawd  # oder chrome (Chrome-Erweiterungs-Relais)
target: sandbox
```

**Sie sollten sehen**:

```
✓ Browser control server: http://127.0.0.1:18791
✓ Profile: clawd
✓ CDP endpoint: http://127.0.0.1:18792
✓ Headless: false
✓ Color: #FF4500
```

::: tip Kontrollpunkt

- `Browser control server` anzeigen bedeutet, dass der Start erfolgreich war
- Standardmäßig wird das Profil `clawd` verwendet (eigenständiger Browser)
- Wenn Sie das Chrome-Erweiterungs-Relais verwenden müssen, verwenden Sie `profile="chrome"`
- Das Browserfenster wird automatisch geöffnet (Nicht-Headless-Modus)

:::

### Schritt 2: Webseite öffnen

**Warum**

Öffnen Sie die Ziel-Webseite, um die Automatisierung vorzubereiten.

```bash
# Im Chat
Bitte öffnen Sie https://example.com

# Oder Browser-Tool verwenden
action: open
targetUrl: https://example.com
profile: clawd
target: sandbox
```

**Sie sollten sehen**:

```
✓ Tab opened: https://example.com
targetId: tab_abc123
url: https://example.com
```

::: tip Elementreferenz (targetId)

Jedes Mal, wenn Sie einen Tab öffnen oder fokussieren, wird ein `targetId` zurückgegeben. Diese ID wird für nachfolgende Operationen (snapshot/act/screenshot) verwendet.

:::

### Schritt 3: Seiten-Snapshot abrufen

**Warum**

Der Snapshot ermöglicht es der KI, die Seitenstruktur zu verstehen und gibt manipulierbare Elementreferenzen (ref) zurück.

```bash
# AI-Format-Snapshot abrufen (Standard)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: ai
refs: aria  # Playwright aria-ref ids verwenden (stabil zwischen Aufrufen)

# Oder ARIA-Format-Snapshot abrufen (strukturierte Ausgabe)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: aria
```

**Sie sollten sehen** (AI-Format):

```
Page snapshot:

[header]
  Logo [aria-label="Example Logo"]
  Navigation [role="navigation"]
    Home [href="/"] [ref="e1"]
    About [href="/about"] [ref="e2"]
    Contact [href="/contact"] [ref="e3"]

[main]
  Hero section
    Title: "Welcome to Example" [ref="e4"]
    Button: "Get Started" [ref="e5"] [type="primary"]

[form section]
  Login form
    Input: Email [type="email"] [ref="e6"]
    Input: Password [type="password"] [ref="e7"]
    Button: "Sign In" [ref="e8"]
```

::: tip Auswahl des Snapshot-Formats

| Format | Verwendung | Merkmale |
|--- | --- | ---|
| `ai` | Standard, für KI | Gute Lesbarkeit, geeignet für KI-Analyse |
| `aria` | Strukturierte Ausgabe | Geeignet für Szenarien, die präzise Struktur erfordern |
| `refs="aria"` | Stabil zwischen Aufrufen | Empfohlen für Multi-Schritt-Operationen (snapshot → act) |

:::

### Schritt 4: UI-Operationen ausführen (act)

**Warum**

Verwenden Sie die im Snapshot zurückgegebenen Elementreferenzen (ref), um Automatisierungsoperationen auszuführen.

```bash
# Button klicken
action: act
request: {
  kind: "click",
  ref: "e5",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Text eingeben
action: act
request: {
  kind: "type",
  ref: "e6",
  text: "user@example.com",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Formular ausfüllen (mehrere Felder)
action: act
request: {
  kind: "fill",
  fields: [
    { ref: "e6", value: "user@example.com" },
    { ref: "e7", value: "password123" }
  ],
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Absenden-Button klicken
action: act
request: {
  kind: "click",
  ref: "e8",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox
```

**Sie sollten sehen**:

```
✓ Clicked ref=e5
✓ Typed "user@example.com" into ref=e6
✓ Typed "password123" into ref=e7
✓ Clicked ref=e8
✓ Form submitted successfully
```

::: tip Häufige UI-Operationen

| Operation | Kind | Parameter |
|--- | --- | ---|
| Klick | `click` | `ref`, `doubleClick`, `button`, `modifiers` |
| Texteingabe | `type` | `ref`, `text`, `submit`, `slowly` |
| Tastendruck | `press` | `key`, `targetId` |
| Mouseover | `hover` | `ref`, `targetId` |
| Drag & Drop | `drag` | `startRef`, `endRef`, `targetId` |
| Auswahl | `select` | `ref`, `values` |
| Formular ausfüllen | `fill` | `fields` (Array) |
| Warten | `wait` | `timeMs`, `text`, `textGone`, `selector` |
| JS ausführen | `evaluate` | `fn`, `ref`, `targetId` |

:::

### Schritt 5: Bildschirmfoto der Webseite aufnehmen

**Warum**

Ergebnisse von Operationen überprüfen oder Bildschirmfotos von Webseiten speichern.

```bash
# Aktuellen Tab aufnehmen
action: screenshot
profile: clawd
targetId: tab_abc123
type: png

# Komplette Seite aufnehmen
action: screenshot
profile: clawd
targetId: tab_abc123
fullPage: true
type: png

# Bestimmtes Element aufnehmen
action: screenshot
profile: clawd
targetId: tab_abc123
ref: "e4"  # ref aus dem Snapshot verwenden
type: jpeg
```

**Sie sollten sehen**:

```
📸 Screenshot saved: ~/.clawdbot/media/browser-screenshot-12345.png
```

::: tip Bildschirmfoto-Formate

| Format | Verwendung |
|--- | ---|
| `png` | Standard, verlustfreie Komprimierung, geeignet für Dokumente |
| `jpeg` | verlustbehaftete Komprimierung, kleinere Dateien, geeignet für Speicherung |

:::

### Schritt 6: Datei-Upload handhaben

**Warum**

Automatisieren von Datei-Upload-Operationen in Formularen.

```bash
# Erst Dateiauswahl auslösen (Klick auf Upload-Button)
action: act
request: {
  kind: "click",
  ref: "upload_button"
}
profile: clawd
targetId: tab_abc123

# Dann Dateien hochladen
action: upload
paths:
  - "/Users/you/Documents/resume.pdf"
  - "/Users/you/Documents/photo.jpg"
ref: "upload_button"  # Optional: ref des Dateiauswahl-Werkzeugs angeben
targetId: tab_abc123
profile: clawd
```

**Sie sollten sehen**:

```
✓ Files uploaded: 2
  - /Users/you/Documents/resume.pdf
  - /Users/you/Documents/photo.jpg
```

::: warning Hinweis zu Dateipfaden

- Verwenden Sie absolute Pfade, relative Pfade werden nicht unterstützt
- Stellen Sie sicher, dass die Dateien existieren und Leserechte haben
- Mehrere Dateien werden in der Reihenfolge des Arrays hochgeladen

:::

### Schritt 7: Dialoge handhaben

**Warum**

Automatische Handhabung von alert-, confirm- und prompt-Dialogen in Webseiten.

```bash
# Dialog akzeptieren (alert/confirm)
action: dialog
accept: true
targetId: tab_abc123
profile: clawd

# Dialog ablehnen (confirm)
action: dialog
accept: false
targetId: tab_abc123
profile: clawd

# Auf prompt-Dialog antworten
action: dialog
accept: true
promptText: "Benutzereingabe"
targetId: tab_abc123
profile: clawd
```

**Sie sollten sehen**:

```
✓ Dialog handled: accepted (prompt: "Benutzereingabe")
```

## Häufige Probleme

### ❌ Fehler: Chrome-Erweiterungs-Relais nicht verbunden

**Fehlermeldung**:
```
No Chrome tabs are attached via Clawdbot Browser Relay extension. Click toolbar icon on tab you want to control (badge ON), then retry.
```

**Ursache**: Sie haben `profile="chrome"` verwendet, aber es sind keine Tabs angehängt

**Lösung**:

1. Installieren Sie die Clawdbot Browser Relay-Erweiterung (Chrome Web Store)
2. Klicken Sie auf das Erweiterungssymbol im Tab, den Sie steuern möchten (Badge ON)
3. Führen Sie `action: snapshot profile="chrome"` erneut aus

### ❌ Fehler: Elementreferenz abgelaufen (stale targetId)

**Fehlermeldung**:
```
Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.
```

**Ursache**: Der Tab wurde geschlossen oder die targetId ist abgelaufen

**Lösung**:

```bash
# Tab-Liste erneut abrufen
action: tabs
profile: chrome

# Neue targetId verwenden
action: snapshot
targetId: "neue_targetId"
profile: chrome
```

### ❌ Fehler: Browser-Kontrollserver nicht gestartet

**Fehlermeldung**:
```
Browser control server not available. Run action=start first.
```

**Ursache**: Der Browser-Kontrollserver ist nicht gestartet

**Lösung**:

```bash
# Browser starten
action: start
profile: clawd
target: sandbox
```

### ❌ Fehler: Timeout der Remote-Browser-Verbindung

**Fehlermeldung**:
```
Remote CDP handshake timeout. Check remoteCdpTimeoutMs/remoteCdpHandshakeTimeoutMs.
```

**Ursache**: Timeout der Remote-Browser-Verbindung

**Lösung**:

```bash
# Timeout in Konfigurationsdatei erhöhen
# ~/.clawdbot/clawdbot.json
{
  "browser": {
    "remoteCdpTimeoutMs": 3000,
    "remoteCdpHandshakeTimeoutMs": 5000
  }
}
```

### ❌ Fehler: Browser-Knotenproxy nicht verfügbar

**Fehlermeldung**:
```
Node browser proxy is disabled (gateway.nodes.browser.mode=off).
```

**Ursache**: Der Browser-Knotenproxy ist deaktiviert

**Lösung**:

```bash
# Browser-Knoten in Konfigurationsdatei aktivieren
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "nodes": {
      "browser": {
        "mode": "auto"  # oder "manual"
      }
    }
  }
}
```

## Zusammenfassung der Lektion

In dieser Lektion haben Sie gelernt:

✅ **Browser-Steuerung**: Starten/Stoppen/Status prüfen
✅ **Tab-Verwaltung**: Tabs öffnen/fokussieren/schließen
✅ **Seiten-Snapshots**: AI/ARIA-Format, Elementreferenzen abrufen
✅ **UI-Automatisierung**: click/type/drag/fill/wait/evaluate
✅ **Bildschirmfoto-Funktion**: PNG/JPEG-Format, komplette Seite oder Element-Bildschirmfoto
✅ **Datei-Upload**: Dateiauswahl handhaben, Multi-Datei-Unterstützung
✅ **Dialog-Handhabung**: accept/reject/alert/confirm/prompt
✅ **Chrome-Relais**: Verwenden Sie `profile="chrome"` zum Übernehmen bestehender Tabs
✅ **Knotenproxy**: Ausführung auf Geräten über `target="node"`

**Schnellreferenz für Schlüsseloperationen**:

| Operation | Action | Schlüsselparameter |
|--- | --- | ---|
| Browser starten | `start` | `profile` (clawd/chrome) |
| Webseite öffnen | `open` | `targetUrl` |
| Snapshot abrufen | `snapshot` | `targetId`, `snapshotFormat`, `refs` |
| UI-Operation | `act` | `request.kind`, `request.ref` |
| Bildschirmfoto | `screenshot` | `targetId`, `fullPage`, `ref` |
| Datei-Upload | `upload` | `paths`, `ref` |
| Dialog | `dialog` | `accept`, `promptText` |

## Vorschau auf nächste Lektion

> In der nächsten Lektion lernen wir **[Befehlsausführungstools und Genehmigung](../tools-exec/)**.
>
> Sie werden lernen:
> - Konfigurieren und Verwenden des exec-Tools
> - Verstehen des Sicherheitsgenehmigungsmechanismus
> - Konfigurieren von allowlist zur Steuerung ausführbarer Befehle
> - Verwenden von Sandbox zur Isolierung von Risikoperationen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um den Speicherort des Quellcodes zu erweitern</strong></summary>

> Aktualisierungsdatum: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
| Browser Schema | [`src/agents/tools/browser-tool.schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/browser-tool.schema.ts) | 1-115 |
|--- | --- | ---|
| Browser-Konfigurationsanalyse | [`src/browser/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/config.ts) | 140-231 |
| Browser-Konstanten | [`src/browser/constants.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/constants.ts) | 1-9 |
| CDP-Client | [`src/browser/cdp.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/cdp.ts) | 1-500 |
| Chrome-Ausführbarkeits-Erkennung | [`src/browser/chrome.executables.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/chrome.executables.ts) | 1-500 |

**Wichtige Konstanten**:
- `DEFAULT_CLAWD_BROWSER_CONTROL_URL = "http://127.0.0.1:18791"`: Standard-Kontrollserveradresse (Quelle: `src/browser/constants.ts:2`)
- `DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000`: Standard-Maximum an Zeichen für AI-Snapshots (Quelle: `src/browser/constants.ts:6`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 10000`: Maximum an Zeichen im efficient-Modus (Quelle: `src/browser/constants.ts:7`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH = 6`: Tiefe im efficient-Modus (Quelle: `src/browser/constants.ts:8`)

**Wichtige Funktionen**:
- `createBrowserTool()`: Erstellt Browser-Tool, definiert alle Aktionen und Parameterverarbeitung
- `browserSnapshot()`: Ruft Seiten-Snapshot ab, unterstützt AI/ARIA-Format
- `browserScreenshotAction()`: Führt Bildschirmfoto-Operation aus, unterstützt komplette Seite und Element-Bildschirmfoto
- `browserAct()`: Führt UI-Automatisierungsoperationen aus (click/type/drag/fill/wait/evaluate usw.)
- `browserArmFileChooser()`: Handhabt Datei-Upload, löst Dateiauswahl aus
- `browserArmDialog()`: Handhabt Dialoge (alert/confirm/prompt)
- `resolveBrowserConfig()`: Analysiert Browser-Konfiguration, gibt Kontrollserveradresse und Port zurück
- `resolveProfile()`: Analysiert Profil-Konfiguration (clawd/chrome)

**Browser Actions Kind** (Quelle: `src/agents/tools/browser-tool.schema.ts:5-17`):
- `click`: Element klicken
- `type`: Text eingeben
- `press`: Taste drücken
- `hover`: Mouseover
- `drag`: Drag & Drop
- `select`: Dropdown-Option auswählen
- `fill`: Formular ausfüllen (mehrere Felder)
- `resize`: Fenstergröße anpassen
- `wait`: Warten
- `evaluate`: JavaScript ausführen
- `close`: Tab schließen

**Browser Tool Actions** (Quelle: `src/agents/tools/browser-tool.schema.ts:19-36`):
- `status`: Browser-Status abrufen
- `start`: Browser starten
- `stop`: Browser stoppen
- `profiles`: Alle Profiles auflisten
- `tabs`: Alle Tabs auflisten
- `open`: Neuen Tab öffnen
- `focus`: Tab fokussieren
- `close`: Tab schließen
- `snapshot`: Seiten-Snapshot abrufen
- `screenshot`: Bildschirmfoto aufnehmen
- `navigate`: Zu angegebener URL navigieren
- `console`: Konsolenmeldungen abrufen
- `pdf`: Seite als PDF speichern
- `upload`: Dateien hochladen
- `dialog`: Dialoge handhaben
- `act`: UI-Operationen ausführen

</details>
