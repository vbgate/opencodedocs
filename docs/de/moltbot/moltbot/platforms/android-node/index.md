---
title: "Android-Knoten: Konfiguration lokaler Geräteaktionen | Clawdbot-Tutorial"
sidebarTitle: "Lass AI dein Handy steuern"
subtitle: "Android-Knoten: Konfiguration lokaler Geräteaktionen | Clawdbot-Tutorial"
description: "Lernen Sie, wie Sie einen Android-Knoten konfigurieren, um lokale Geräteaktionen (Kamera, Canvas, Screen) auszuführen. Dieses Tutorial erklärt den Verbindungsprozess, den Pairing-Mechanismus und die verfügbaren Befehle für Android-Knoten."
tags:
  - "Android"
  - "Knoten"
  - "Camera"
  - "Canvas"
prerequisite:
  - "/de/moltbot/moltbot/start/getting-started/"
  - "/de/moltbot/moltbot/start/gateway-startup/"
order: 180
---

# Android-Knoten: Konfiguration lokaler Geräteaktionen

## Was Sie nach diesem Tutorial können

- Verbinden Sie ein Android-Gerät mit dem Gateway als Knoten für die Ausführung lokaler Geräteaktionen
- Steuern Sie die Kamera Ihres Android-Geräts über einen AI-Assistenten (Fotos und Videos)
- Verwenden Sie die Canvas-Benutzeroberfläche, um Echtzeitinhalte auf Android anzuzeigen
- Verwalten Sie die Bildschirmaufzeichnung, Standortabfrage und SMS-Versand-Funktionen

## Ihr aktuelles Problem

Sie möchten, dass ein AI-Assistent auf Ihr Android-Gerät zugreifen kann – Fotos aufnehmen, Videos aufzeichnen, Canvas-Benutzeroberflächen anzeigen – wissen aber nicht, wie Sie das Gerät sicher mit dem Gateway verbinden können.

Das direkte Installieren der Android-App führt möglicherweise nicht dazu, dass das Gateway entdeckt wird, oder das Pairing schlägt nach der Konfiguration fehl. Sie benötigen einen klaren Verbindungsprozess.

## Wann Sie diesen Ansatz verwenden

- **Lokale Geräteaktionen erforderlich**: Sie möchten, dass ein AI-Assistent lokale Aktionen auf dem Android-Gerät ausführt (Fotos, Videos, Bildschirmaufzeichnung)
- **Zugriff über verschiedene Netzwerke**: Android-Gerät und Gateway befinden sich in verschiedenen Netzwerken und müssen über Tailscale verbunden werden
- **Canvas-Visualisierung**: Sie müssen AI-generierte Echtzeit-HTML/CSS/JS-Benutzeroberflächen auf Android anzeigen

## 🎒 Voraussetzungen

::: warning Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher:

- ✅ **Gateway installiert und läuft**: Gateway auf macOS, Linux oder Windows (WSL2) ausführen
- ✅ **Android-Gerät verfügbar**: Android 8.0+ Gerät oder Emulator
- ✅ **Netzwerkverbindung OK**: Das Android-Gerät kann auf den WebSocket-Port des Gateways zugreifen (Standard 18789)
- ✅ **CLI verfügbar**: Der Befehl `clawdbot` kann auf dem Gateway-Host verwendet werden

:::

## Kernkonzept

Der **Android-Knoten** ist eine Companion-App (Begleit-Anwendung), die über eine WebSocket-Verbindung mit dem Gateway verbunden ist und die Fähigkeiten für lokale Geräteaktionen für den AI-Assistenten bereitstellt.

### Architekturübersicht

```
Android-Gerät (Knoten-App)
        ↓
    WebSocket-Verbindung
        ↓
    Gateway (Kontrollebene)
        ↓
    AI-Assistent + Tool-Aufrufe
```

**Wichtige Punkte**:
- Android **hostet nicht** das Gateway, sondern verbindet sich nur als Knoten mit einem bereits laufenden Gateway
- Alle Befehle werden über die Methode `node.invoke` des Gateways an den Android-Knoten weitergeleitet
- Der Knoten muss gepaart (Pairing) werden, um Zugriffsberechtigungen zu erhalten

### Unterstützte Funktionen

Der Android-Knoten unterstützt die folgenden lokalen Geräteaktionen:

| Funktion | Befehl | Beschreibung |
|--- | --- | ---|
| **Canvas** | `canvas.*` | Echtzeit-Visualisierungsbenutzeroberfläche (A2UI) anzeigen |
| **Camera** | `camera.*` | Fotos (JPG) und Videos (MP4) aufnehmen |
| **Screen** | `screen.*` | Bildschirmaufzeichnung |
| **Location** | `location.*` | GPS-Standort abfragen |
| **SMS** | `sms.*` | SMS senden |

::: tip Vordergrund-Einschränkung

Alle lokalen Geräteaktionen (Canvas, Camera, Screen) erfordern, dass die Android-App im **Vordergrund läuft**. Hintergrundaufrufe geben den Fehler `NODE_BACKGROUND_UNAVAILABLE` zurück.

:::

## Schritt für Schritt

### Schritt 1: Gateway starten

**Warum**
Der Android-Knoten muss mit einem laufenden Gateway verbunden sein, um zu funktionieren. Das Gateway stellt die WebSocket-Kontrollebene und den Pairing-Dienst bereit.

```bash
clawdbot gateway --port 18789 --verbose
```

**Sie sollten sehen**:
```
listening on ws://0.0.0.0:18789
bonjour: advertising _clawdbot-gw._tcp on local...
```

::: tip Tailscale-Modus (empfohlen)

Wenn Gateway und Android-Gerät in verschiedenen Netzwerken, aber über Tailscale verbunden sind, binden Sie das Gateway an die tailnet-IP:

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: {
    bind: "tailnet"
  }
}
```

Nach dem Neustart des Gateways kann der Android-Knoten über Wide-Area Bonjour entdeckt werden.

:::

### Schritt 2: Erkennung überprüfen (optional)

**Warum**
Bestätigen Sie, dass der Bonjour/mDNS-Dienst des Gateways ordnungsgemäß funktioniert, damit die Android-App das Gateway einfach entdecken kann.

Führen Sie auf dem Gateway-Host aus:

```bash
dns-sd -B _clawdbot-gw._tcp local.
```

**Sie sollten sehen**:
```
Timestamp     A/R    IF  N/T   Target              Port
==========   ===   ===  ========               ====
12:34:56.123 Addr   10  _clawdbot-gw._tcp. 18789
```

Wenn Sie eine ähnliche Ausgabe sehen, wirbt das Gateway den Erkennungsdienst.

::: details Bonjour-Probleme beheben

Wenn die Erkennung fehlschlägt, mögliche Ursachen:

- **mDNS blockiert**: Einige Wi-Fi-Netzwerke deaktivieren mDNS
- **Firewall**: Blockiert UDP-Port 5353
- **Netzwerkkonflik**: Geräte befinden sich in verschiedenen VLANs oder Subnetzen

Lösung: Verwenden Sie Tailscale + Wide-Area Bonjour oder konfigurieren Sie die Gateway-Adresse manuell.

:::

### Schritt 3: Von Android aus verbinden

**Warum**
Die Android-App entdeckt das Gateway über mDNS/NSD und stellt eine WebSocket-Verbindung her.

In der Android-App:

1. Öffnen Sie **Einstellungen** (Settings)
2. Wählen Sie in **Discovered Gateways** Ihr Gateway aus
3. Tippen Sie auf **Connect**

**Wenn mDNS blockiert ist**:
- Gehen Sie zu **Advanced → Manual Gateway**
- Geben Sie den **Hostnamen und Port** des Gateways ein (z. B. `192.168.1.100:18789`)
- Tippen Sie auf **Connect (Manual)**

::: tip Automatische Neuverbindung

Nach dem ersten erfolgreichen Pairing verbindet sich die Android-App beim Start automatisch neu:
- Wenn ein manueller Endpunkt aktiviert ist, wird der manuelle Endpunkt verwendet
- Andernfalls wird das zuletzt entdeckte Gateway (beste Bemühung) verwendet

:::

**Kontrollpunkt ✅**
- Die Android-App zeigt den Status "Connected"
- Die App zeigt den Anzeigenamen des Gateways
- Die App zeigt den Pairing-Status (Pending oder Paired)

### Schritt 4: Pairing genehmigen (CLI)

**Warum**
Das Gateway muss die Pairing-Anforderung des Knotens genehmigen, um Zugriffsberechtigungen zu erteilen.

Auf dem Gateway-Host:

```bash
# Ausstehende Pairing-Anforderungen anzeigen
clawdbot nodes pending

# Pairing genehmigen
clawdbot nodes approve <requestId>
```

::: details Pairing-Ablauf

Der Workflow für Gateway-owned Pairing:

1. Der Android-Knoten verbindet sich mit dem Gateway und fordert Pairing an
2. Das Gateway speichert die **pending request** und gibt ein Ereignis `node.pair.requested` aus
3. Sie genehmigen oder lehnen die Anforderung über die CLI ab
4. Nach der Genehmigung stellt das Gateway ein neues **auth token** aus
5. Der Android-Knoten verbindet sich mit dem Token neu und wechselt in den Status "paired"

Ausstehende Anforderungen laufen nach **5 Minuten** automatisch ab.

:::

**Sie sollten sehen**:
```
✓ Node approved: android-node-abc123
Token issued: eyJhbGc...
```

Die Android-App verbindet sich automatisch neu und zeigt den Status "Paired".

### Schritt 5: Überprüfen, dass der Knoten verbunden ist

**Warum**
Bestätigen Sie, dass der Android-Knoten erfolgreich gepaart und mit dem Gateway verbunden ist.

Überprüfen Sie über die CLI:

```bash
clawdbot nodes status
```

**Sie sollten sehen**:
```
Known: 1 · Paired: 1 · Connected: 1

┌──────────────────────────────────────────────┐
│ Name: My Samsung Tab                     │
│ Device: Android                          │
│ Model: Samsung SM-X926B                 │
│ IP: 192.168.0.99                      │
│ Status: paired, connected                 │
│ Caps: camera, canvas, screen, location, sms │
└──────────────────────────────────────────────┘
```

Alternativ über die Gateway-API:

```bash
clawdbot gateway call node.list --params '{}'
```

### Schritt 6: Camera-Funktion testen

**Warum**
Überprüfen Sie, dass die Camera-Befehle des Android-Knotens ordnungsgemäß funktionieren und die Berechtigungen erteilt wurden.

Testen Sie das Aufnehmen von Fotos über die CLI:

```bash
# Foto aufnehmen (Standard Frontkamera)
clawdbot nodes camera snap --node "android-node"

# Rückkamera angeben
clawdbot nodes camera snap --node "android-node" --facing back

# Video aufzeichnen (3 Sekunden)
clawdbot nodes camera clip --node "android-node" --duration 3000
```

**Sie sollten sehen**:
```
MEDIA: /tmp/clawdbot-camera-snap-123456.jpg
```

::: tip Camera-Berechtigungen

Der Android-Knoten benötigt die folgenden Laufzeitberechtigungen:

- **CAMERA**: Für `camera.snap` und `camera.clip`
- **RECORD_AUDIO**: Für `camera.clip` (wenn `includeAudio=true`)

Beim ersten Aufruf der Camera-Befehle fordert die App zur Erteilung der Berechtigungen auf. Wenn abgelehnt, geben die Befehle den Fehler `CAMERA_PERMISSION_REQUIRED` oder `AUDIO_PERMISSION_REQUIRED` zurück.

:::

### Schritt 7: Canvas-Funktion testen

**Warum**
Überprüfen Sie, dass die Canvas-Benutzeroberfläche auf dem Android-Gerät angezeigt werden kann.

::: info Canvas Host

Canvas benötigt einen HTTP-Server, um HTML/CSS/JS-Inhalte bereitzustellen. Das Gateway führt standardmäßig den Canvas Host auf Port 18793 aus.

:::

Erstellen Sie eine Canvas-Datei auf dem Gateway-Host:

```bash
mkdir -p ~/clawd/canvas
echo '<h1>Hello from AI!</h1>' > ~/clawd/canvas/index.html
```

Navigieren Sie in der Android-App zu Canvas:

```bash
clawdbot nodes invoke --node "android-node" \
  --command canvas.navigate \
  --params '{"url":"http://<gateway-hostname>.local:18793/__clawdbot__/canvas/"}'
```

**Sie sollten sehen**:
Die Seite "Hello from AI!" wird in der Android-App angezeigt.

::: tip Tailscale-Umgebung

Wenn Android-Gerät und Gateway beide im Tailscale-Netzwerk sind, verwenden Sie den MagicDNS-Namen oder die tailnet-IP anstelle von `.local`:

```json
{"url":"http://<gateway-magicdns>:18793/__clawdbot__/canvas/"}
```

:::

### Schritt 8: Screen- und Location-Funktionen testen

**Warum**
Überprüfen Sie, dass die Bildschirmaufzeichnung und Standortabfrage ordnungsgemäß funktionieren.

Bildschirmaufzeichnung:

```bash
# 10 Sekunden Bildschirm aufzeichnen
clawdbot nodes screen record --node "android-node" --duration 10s --fps 15
```

**Sie sollten sehen**:
```
MEDIA: /tmp/clawdbot-screen-record-123456.mp4
```

Standortabfrage:

```bash
clawdbot nodes invoke --node "android-node" --command location.get
```

**Sie sollten sehen**:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 10,
  "timestamp": 1706345678000
}
```

::: warning Berechtigungsanforderungen

Die Bildschirmaufzeichnung erfordert die Android-Berechtigung **RECORD_AUDIO** (wenn Audio aktiviert ist) und den Vordergrundzugriff. Die Standortabfrage erfordert die Berechtigung **LOCATION**.

Beim ersten Aufruf fordert die App zur Erteilung der Berechtigungen auf.

:::

## Häufige Probleme

### Problem 1: Gateway kann nicht entdeckt werden

**Symptome**: Das Gateway ist in der Android-App nicht sichtbar

**Mögliche Ursachen**:
- Gateway läuft nicht oder ist an loopback gebunden
- mDNS wird im Netzwerk blockiert
- Firewall blockiert UDP-Port 5353

**Lösungen**:
1. Überprüfen Sie, ob das Gateway läuft: `clawdbot nodes status`
2. Verwenden Sie eine manuelle Gateway-Adresse: Geben Sie die Gateway-IP und den Port in der Android-App ein
3. Konfigurieren Sie Tailscale + Wide-Area Bonjour (empfohlen)

### Problem 2: Verbindungsfehler nach dem Pairing

**Symptome**: Zeigt "Paired", kann aber nicht verbinden

**Mögliche Ursachen**:
- Token abgelaufen (das Token wird nach jedem Pairing rotiert)
- Gateway neu gestartet, aber der Knoten hat sich nicht neu verbunden
- Netzwerkänderung

**Lösungen**:
1. Tippen Sie manuell auf "Reconnect" in der Android-App
2. Überprüfen Sie die Gateway-Logs: `bonjour: client disconnected ...`
3. Pairing erneut durchführen: Löschen Sie den Knoten und genehmigen Sie ihn erneut

### Problem 3: Camera-Befehl gibt Berechtigungsfehler zurück

**Symptome**: `camera.snap` gibt `CAMERA_PERMISSION_REQUIRED` zurück

**Mögliche Ursachen**:
- Benutzer hat die Berechtigung abgelehnt
- Berechtigung durch Systemrichtlinie deaktiviert

**Lösungen**:
1. Suchen Sie nach der "Clawdbot"-App in den Android-Einstellungen
2. Gehen Sie zu "Permissions"
3. Erteilen Sie Camera- und Mikrofon-Berechtigungen
4. Wiederholen Sie den Camera-Befehl

### Problem 4: Hintergrundaufrufe schlagen fehl

**Symptome**: Hintergrundaufrufe geben `NODE_BACKGROUND_UNAVAILABLE` zurück

**Grund**: Der Android-Knoten erlaubt nur Vordergrundaufrufe für lokale Gerätebefehle

**Lösungen**:
1. Stellen Sie sicher, dass die App im Vordergrund läuft (App öffnen)
2. Überprüfen Sie, ob die App vom System optimiert wird (Batterieoptimierung)
3. Deaktivieren Sie die Einschränkungen für die App im "Energiesparmodus"

## Zusammenfassung

In dieser Lerneinheit haben Sie erfahren, wie Sie einen Android-Knoten für die Ausführung lokaler Geräteaktionen konfigurieren:

- **Verbindungsprozess**: Verbinden Sie den Android-Knoten über mDNS/NSD oder manuelle Konfiguration mit dem Gateway
- **Pairing-Mechanismus**: Verwenden Sie Gateway-owned Pairing, um die Zugriffsberechtigungen des Knotens zu genehmigen
- **Verfügbare Funktionen**: Camera, Canvas, Screen, Location, SMS
- **CLI-Tools**: Verwalten Sie Knoten und rufen Sie Funktionen mit den Befehlen `clawdbot nodes` auf
- **Berechtigungsanforderungen**: Die Android-App benötigt Laufzeitberechtigungen für Camera, Audio, Location usw.

**Wichtige Punkte**:
- Der Android-Knoten ist eine Companion-App, die das Gateway nicht hostet
- Alle lokalen Geräteaktionen erfordern, dass die App im Vordergrund läuft
- Pairing-Anforderungen laufen nach 5 Minuten automatisch ab
- Unterstützung für Wide-Area Bonjour-Erkennung in Tailscale-Netzwerken

## Ausblick auf die nächste Lerneinheit

> In der nächsten Lerneinheit lernen wir **[Canvas-Visualisierung und A2UI](/de/moltbot/moltbot/advanced/canvas/)**.
>
> Sie lernen:
> - Canvas A2UI-Push-Mechanismus
> - Wie Sie Echtzeitinhalte auf Canvas anzeigen
> - Vollständige Liste der Canvas-Befehle

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um den Quellcode-Speicherort anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion        | Dateipfad                                                                                    | Zeile    |
|--- | --- | ---|
| Knotenbefehlsrichtlinie | [`src/gateway/node-command-policy.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/node-command-policy.ts) | 1-112   |
| Knotenprotokoll-Schema | [`src/gateway/protocol/schema/nodes.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/protocol/schema/nodes.ts) | 1-103   |
| Android-Dokumentation  | [`docs/platforms/android.md`](https://github.com/moltbot/moltbot/blob/main/docs/platforms/android.md) | 1-142   |
| Knoten-CLI  | [`docs/cli/nodes.md`](https://github.com/moltbot/moltbot/blob/main/docs/cli/nodes.md) | 1-69    |

**Wichtige Konstanten**:
- `PLATFORM_DEFAULTS`: Definiert die Liste der von jeder Plattform unterstützten Befehle (`node-command-policy.ts:32-58`)
- Von Android unterstützte Befehle: Canvas, Camera, Screen, Location, SMS (`node-command-policy.ts:34-40`)

**Wichtige Funktionen**:
- `resolveNodeCommandAllowlist()`: Löst die Liste der zulässigen Befehle basierend auf der Plattform auf (`node-command-policy.ts:77-91`)
- `normalizePlatformId()`: Normalisiert die Plattform-ID (`node-command-policy.ts:60-75`)

**Merkmale des Android-Knotens**:
- Client-ID: `clawdbot-android` (`gateway/protocol/client-info.ts:9`)
- Gerätefamilie-Erkennung: Erkennt Android über das Feld `deviceFamily` (`node-command-policy.ts:70`)
- Canvas- und Camera-Funktionen sind standardmäßig aktiviert (`docs/platforms/android.md`)

</details>
