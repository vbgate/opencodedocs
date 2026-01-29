---
title: "iOS-Knotenkonfiguration: Verbindung mit Gateway und Kamera, Canvas, Voice Wake | Clawdbot-Tutorial"
sidebarTitle: "AI auf iPhone nutzen"
subtitle: "Leitfaden zur iOS-Knotenkonfiguration"
description: "Lernen Sie, wie Sie iOS-Knoten mit dem Gateway verbinden und lokale Geräteoperationen nutzen: Kamerafotos, Canvas-Visualisierung, Voice Wake, Talk Mode, Standortabfrage und mehr. Mit automatischer Erkennung via Bonjour und Tailscale, Paarungsauthentifizierung und Sicherheitskontrolle für Multi-Gerät-AI-Kollaboration mit Support für Vordergrund/Hintergrund und Berechtigungsverwaltung."
tags:
  - "iOS-Knoten"
  - "Geräteknoten"
  - "Canvas"
  - "Voice Wake"
prerequisite:
  - "../start-gateway-startup"
order: 170
---

# Leitfaden zur iOS-Knotenkonfiguration

## Was Sie erreichen können

Nach der Konfiguration von iOS-Knoten können Sie:

- ✅ Den Assistenten die Kamera des iOS-Geräts zum Fotografieren oder Aufnehmen von Videos nutzen lassen
- ✅ Canvas-Visualisierungsoberflächen auf iOS-Geräten rendern
- ✅ Voice Wake und Talk Mode für Sprachinteraktion nutzen
- ✅ Standortinformationen des iOS-Geräts abrufen
- ✅ Mehrere Geräteknoten über das Gateway zentral verwalten

## Ihr aktuelles Problem

Sie möchten die Fähigkeiten Ihres Assistenten auf Ihrem iOS-Gerät erweitern, damit er:

- **Kamera zum Fotografieren oder Aufnehmen von Videos nutzen kann**: Wenn Sie "Mach ein Foto" sagen, soll der Assistent automatisch das iPhone verwenden
- **Visualisierungsoberflächen anzeigen kann**: Auf dem iPhone vom Assistenten generierte Diagramme, Formulare oder Steuerfelder anzeigen
- **Sprachwache und fortlaufende Konversation**: Ohne Händebewegung direkt "Clawd" sagen, um den Assistenten zu wecken und ein Gespräch zu beginnen
- **Geräteinformationen abrufen kann**: Den Assistenten Ihren Standort, Bildschirmstatus und andere Informationen wissen lassen

## Wann Sie diese Methode verwenden

- **Mobile Szenarien**: Sie möchten, dass der Assistent die Fähigkeiten des iPhone wie Kamera und Bildschirm nutzen kann
- **Multi-Gerät-Kollaboration**: Das Gateway läuft auf einem Server, aber lokale Gerätefunktionen müssen aufgerufen werden
- **Sprachinteraktion**: Sie möchten das iPhone als tragbares Sprachassistententerminal nutzen

::: info Was ist ein iOS-Knoten?

Ein iOS-Knoten ist eine auf iPhone/iPad laufende Companion-Anwendung, die über WebSocket mit dem Clawdbot Gateway verbunden ist. Er ist nicht das Gateway selbst, sondern fungiert als "Peripheriegerät" und stellt lokale Geräteoperationsfähigkeiten bereit.

**Unterschied zum Gateway**:
- **Gateway**: Läuft auf Server/macOS, verantwortlich für Nachrichtenrouting, AI-Modellaufrufe, Werkzeugverteilung
- **iOS-Knoten**: Läuft auf iPhone, verantwortlich für Ausführung lokaler Geräteoperationen (Kamera, Canvas, Standort usw.)
:::

---

## 🎒 Vorbereitungen

::: warning Voraussetzungen

Überprüfen Sie vor dem Start:

1. **Gateway läuft**
   - Stellen Sie sicher, dass das Gateway auf einem anderen Gerät läuft (macOS, Linux oder Windows via WSL2)
   - Das Gateway ist an eine zugängliche Netzwerkadresse gebunden (LAN oder Tailscale)

2. **Netzwerkverbindung**
   - iOS-Gerät und Gateway im selben LAN (empfohlen) oder über Tailscale verbunden
   - iOS-Gerät kann IP-Adresse und Port des Gateways erreichen (Standard 18789)

3. **iOS-Anwendung erhalten**
   - Die iOS-Anwendung ist derzeit eine **interne Vorschauversion** und nicht öffentlich verfügbar
   - Muss aus dem Quellcode erstellt oder als TestFlight-Testversion erhalten werden
:::

## Kernkonzept

Der Arbeitsablauf von iOS-Knoten:

```
[Gateway] ←→ [iOS-Knoten]
     ↓            ↓
  [AI-Modell]   [Gerätefähigkeiten]
     ↓            ↓
  [Entscheidung]   [Kamera/Canvas/Sprache]
```

**Wichtige technische Aspekte**:

1. **Automatische Erkennung**: Automatische Erkennung des Gateways über Bonjour (LAN) oder Tailscale (Cross-Network)
2. **Paarungsauthentifizierung**: Die erste Verbindung erfordert manuelle Genehmigung auf dem Gateway, um eine Vertrauensbeziehung herzustellen
3. **Protokollkommunikation**: Verwendet WebSocket-Protokoll (`node.invoke`) zum Senden von Befehlen
4. **Berechtigungssteuerung**: Lokale Gerätebefehle erfordern Benutzerautorisierung (Kamera, Standort usw.)

**Architekturmerkmale**:

- **Sicherheit**: Alle Geräteoperationen erfordern ausdrückliche Autorisierung des Benutzers auf dem iOS-Gerät
- **Isolation**: Knoten führen nicht das Gateway aus, sondern führen nur lokale Operationen aus
- **Flexibilität**: Unterstützt Vordergrund, Hintergrund, Remote und andere Nutzungsszenarien

---

## Lassen Sie es uns tun

### Schritt 1: Gateway starten

Starten Sie den Dienst auf dem Gateway-Host:

```bash
clawdbot gateway --port 18789
```

**Sie sollten sehen**:

```
✅ Gateway running on ws://0.0.0.0:18789
✅ Bonjour advertisement active: _clawdbot._tcp
```

::: tip Cross-Network-Zugriff

Wenn Gateway und iOS-Gerät nicht im selben LAN sind, verwenden Sie **Tailscale Serve/Funnel**:

```bash
clawdbot gateway --port 18789 --tailscale funnel
```

Das iOS-Gerät erkennt das Gateway automatisch über Tailscale.
:::

### Schritt 2: iOS-Anwendung verbinden

In der iOS-Anwendung:

1. Öffnen Sie **Einstellungen** (Settings)
2. Finden Sie den **Gateway**-Bereich
3. Wählen Sie ein automatisch erkanntes Gateway (oder aktivieren Sie unten **Manual Host** für manuelle Eingabe von Host und Port)

**Sie sollten sehen**:

- Die Anwendung versucht, eine Verbindung zum Gateway herzustellen
- Der Status zeigt "Connected" oder "Pairing pending"

::: details Host manuell konfigurieren

Wenn die automatische Erkennung fehlschlägt, geben Sie die Gateway-Adresse manuell ein:

1. Aktivieren Sie **Manual Host**
2. Geben Sie den Gateway-Host ein (z. B. `192.168.1.100`)
3. Geben Sie den Port ein (Standard `18789`)
4. Tippen Sie auf "Connect"

:::

### Schritt 3: Paarungsanfrage genehmigen

**Auf dem Gateway-Host** genehmigen Sie die Paarungsanfrage des iOS-Knotens:

```bash
# Ausstehende Knoten auflisten
clawdbot nodes pending

# Spezifischen Knoten genehmigen (ersetzen Sie <requestId>)
clawdbot nodes approve <requestId>
```

**Sie sollten sehen**:

```
✅ Node paired successfully
Node: iPhone (iOS)
ID: node-abc123
```

::: tip Paarung ablehnen

Wenn Sie die Verbindungsanfrage eines Knotens ablehnen möchten:

```bash
clawdbot nodes reject <requestId>
```

:::

**Kontrollpunkt ✅**: Überprüfen Sie den Knotenstatus auf dem Gateway

```bash
clawdbot nodes status
```

Sie sollten Ihren iOS-Knoten im Status `paired` sehen.

### Schritt 4: Knotenverbindung testen

**Testen Sie die Knotenkommunikation vom Gateway**:

```bash
# Knotenbefehl über Gateway aufrufen
clawdbot gateway call node.list --params "{}"
```

**Sie sollten sehen**:

```json
{
  "result": [
    {
      "id": "node-abc123",
      "displayName": "iPhone (iOS)",
      "platform": "ios",
      "capabilities": ["camera", "canvas", "location", "screen", "voicewake"]
    }
  ]
}
```

---

## Knotenfunktionen verwenden

### Kamerafotos

iOS-Knoten unterstützen Kamerafotografie und Videoaufnahme:

```bash
# Foto aufnehmen (Standard Frontkamera)
clawdbot nodes camera snap --node "iPhone (iOS)"

# Foto aufnehmen (Rückkamera, benutzerdefinierte Auflösung)
clawdbot nodes camera snap --node "iPhone (iOS)" --facing back --max-width 1920

# Video aufnehmen (5 Sekunden)
clawdbot nodes camera clip --node "iPhone (iOS)" --duration 5000
```

**Sie sollten sehen**:

```
MEDIA:/tmp/clawdbot-camera-snap-abc123.jpg
```

::: warning Vordergrund-Anforderung
Kamerabefehle erfordern, dass die iOS-Anwendung im **Vordergrund** ist. Wenn die Anwendung im Hintergrund ist, wird ein `NODE_BACKGROUND_UNAVAILABLE`-Fehler zurückgegeben.

:::

**iOS-Kameraparameter**:

| Parameter | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `facing` | `front\|back` | `front` | Kameraausrichtung |
| `maxWidth` | number | `1600` | Maximale Breite (Pixel) |
| `quality` | `0..1` | `0.9` | JPEG-Qualität (0-1) |
| `durationMs` | number | `3000` | Videodauer (Millisekunden) |
| `includeAudio` | boolean | `true` | Audio einschließen |

### Canvas-Visualisierungsoberfläche

iOS-Knoten können Canvas-Visualisierungsoberflächen anzeigen:

```bash
# Zu URL navigieren
clawdbot nodes canvas navigate --node "iPhone (iOS)" --target "https://example.com"

# JavaScript ausführen
clawdbot nodes canvas eval --node "iPhone (iOS)" --js "document.title"

# Screenshot (als JPEG speichern)
clawdbot nodes canvas snapshot --node "iPhone (iOS)" --format jpeg --max-width 900
```

**Sie sollten sehen**:

```
MEDIA:/tmp/clawdbot-canvas-snap-abc123.jpg
```

::: tip A2UI automatisches Pushen
Wenn das Gateway `canvasHost` konfiguriert hat, navigiert der iOS-Knoten bei Verbindung automatisch zur A2UI-Oberfläche.
:::

### Voice Wake Sprachwache

Aktivieren Sie Voice Wake in den **Einstellungen** der iOS-Anwendung:

1. Aktivieren Sie den **Voice Wake**-Schalter
2. Stellen Sie das Wake Word ein (Standard: "clawd", "claude", "computer")
3. Stellen Sie sicher, dass iOS die Mikrofonberechtigung erteilt hat

::: info Globale Wake Words
Die Wake Words von Clawdbot sind **globale Konfigurationen**, die vom Gateway verwaltet werden. Alle Knoten (iOS, Android, macOS) verwenden dieselbe Wake Word-Liste.

Änderungen an Wake Words werden automatisch auf alle Geräte synchronisiert.
:::

### Talk Mode fortlaufende Konversation

Nach der Aktivierung von Talk Mode liest der Assistent Antworten kontinuierlich über TTS vor und überwacht kontinuierlich Spracheingaben:

1. Aktivieren Sie **Talk Mode** in den **Einstellungen** der iOS-Anwendung
2. Antworten des Assistenten werden automatisch vorgelesen
3. Sie können über Sprache kontinuierlich konversieren, ohne manuell tippen zu müssen

::: warning Hintergrundbeschränkungen
iOS kann Hintergrundaudio anhalten. Wenn die Anwendung nicht im Vordergrund ist, sind Sprachfunktionen **best-effort**.
:::

---

## Häufige Probleme

### Paarungsaufforderung erscheint nie

**Problem**: Die iOS-Anwendung zeigt "Connected" an, aber das Gateway zeigt keine Paarungsaufforderung.

**Lösung**:

```bash
# 1. Manuell ausstehende Knoten anzeigen
clawdbot nodes pending

# 2. Knoten genehmigen
clawdbot nodes approve <requestId>

# 3. Verbindung überprüfen
clawdbot nodes status
```

### Verbindungsfehler (nach Neuinstallation)

**Problem**: Nach Neuinstallation der iOS-Anwendung kann keine Verbindung zum Gateway hergestellt werden.

**Ursache**: Das Paarungs-Token im Keychain wurde gelöscht.

**Lösung**: Führen Sie den Paarungsprozess erneut durch (Schritt 3).

### A2UI_HOST_NOT_CONFIGURED

**Problem**: Canvas-Befehl schlägt fehl mit `A2UI_HOST_NOT_CONFIGURED`.

**Ursache**: Das Gateway hat die `canvasHost`-URL nicht konfiguriert.

**Lösung**:

Legen Sie den Canvas-Host in der Gateway-Konfiguration fest:

```bash
clawdbot config set canvasHost "http://<gateway-host>:18793/__clawdbot__/canvas/"
```

### NODE_BACKGROUND_UNAVAILABLE

**Problem**: Kamera/Canvas-Befehl schlägt fehl mit `NODE_BACKGROUND_UNAVAILABLE`.

**Ursache**: Die iOS-Anwendung ist nicht im Vordergrund.

**Lösung**: Wechseln Sie die iOS-Anwendung in den Vordergrund und wiederholen Sie den Befehl.

---

## Zusammenfassung dieser Lektion

In dieser Lektion haben Sie gelernt:

✅ Konzept und Architektur von iOS-Knoten
✅ Wie man das Gateway automatisch erkennt und verbindet
✅ Paarungsauthentifizierungsprozess
✅ Verwendung von Kamera, Canvas, Voice Wake und anderen Funktionen
✅ Methoden zur Fehlerbehebung bei häufigen Problemen

**Kernpunkte**:

- iOS-Knoten sind Anbieter lokaler Geräteoperationsfähigkeiten, nicht das Gateway
- Alle Geräteoperationen erfordern Benutzerautorisierung und Vordergrundstatus
- Paarung ist ein notwendiger Sicherheitsschritt, nur genehmigte Knoten werden vertraut
- Voice Wake und Talk Mode erfordern Mikrofonberechtigungen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Android-Knotenkonfiguration](../android-node/)**.
>
> Sie werden lernen:
> - Wie man Android-Knoten mit dem Gateway verbindet
> - Verwendung der Kamera, Bildschirmaufnahme, Canvas-Funktionen von Android-Geräten
> - Umgang mit Android-spezifischen Berechtigungs- und Kompatibilitätsproblemen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie zum Erweitern, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| iOS-Anwendungseinstieg | [`apps/ios/Sources/ClawdbotApp.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/ClawdbotApp.swift) | 1-30 |
| Canvas-Rendering | [`apps/ios/Sources/RootCanvas.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/RootCanvas.swift) | 1-250 |
| Gateway-Verbindung | [`apps/ios/Sources/Gateway/`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/Gateway/) | - |
| Knotenprotokoll-Runner | [`src/node-host/runner.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/runner.ts) | 1-1100 |
| Knotenkonfiguration | [`src/node-host/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/config.ts) | 1-50 |
| iOS-Plattform-Dokumentation | [`docs/platforms/ios.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/ios.md) | 1-105 |
| Knotensystem-Dokumentation | [`docs/nodes/index.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/index.md) | 1-306 |

**Wichtige Konstanten**:
- `GATEWAY_DEFAULT_PORT = 18789`: Gateway-Standardport
- `NODE_ROLE = "node"`: Rollenidentifikator für Knotenverbindung

**Wichtige Befehle**:
- `clawdbot nodes pending`: Ausstehende Knoten auflisten
- `clawdbot nodes approve <requestId>`: Knotenpaarung genehmigen
- `clawdbot nodes invoke --node <id> --command <cmd>`: Knotenbefehl aufrufen
- `clawdbot nodes camera snap --node <id>`: Foto aufnehmen
- `clawdbot nodes canvas navigate --node <id> --target <url>`: Canvas navigieren

**Protokollmethoden**:
- `node.invoke.request`: Knotenbefehlaufrufanfrage
- `node.invoke.result`: Knotenbefehlausführungsergebnis
- `voicewake.get`: Wake Word-Liste abrufen
- `voicewake.set`: Wake Word-Liste festlegen
- `voicewake.changed`: Wake Word-Änderungsereignis

</details>
