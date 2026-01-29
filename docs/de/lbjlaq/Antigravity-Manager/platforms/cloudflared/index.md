---
title: "Cloudflared: Lokale API öffentlich exponieren | Antigravity-Manager"
sidebarTitle: "Ferngeräte auf lokale API zugreifen lassen"
subtitle: "Cloudflared Ein-Klick-Tunnel: Lokale API sicher öffentlich exponieren (nicht standardmäßig sicher)"
description: "Lerne den Cloudflared Ein-Klick-Tunnel von Antigravity Tools: Starte Quick/Auth-Modi, verstehe wann URLs angezeigt werden, wie man kopiert und testet, und verwende proxy.auth_mode + starke API-Keys für minimale Exposition. Mit Installationsort, häufigen Fehlern und Fehlersuchstrategien, damit Ferngeräte das lokale Gateway stabil aufrufen können."
tags:
  - "Cloudflared"
  - "Netzwerkdurchdringung"
  - "Öffentlicher Zugriff"
  - "Tunnel"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 7
---
# Cloudflared Ein-Klick-Tunnel: Lokale API sicher öffentlich exponieren (nicht standardmäßig sicher)

Du wirst den **Cloudflared Ein-Klick-Tunnel** verwenden, um das lokale Antigravity Tools API-Gateway öffentlich zu exponieren (nur wenn du es ausdrücklich aktivierst), damit auch Ferngeräte darauf zugreifen können. Gleichzeitig lernst du die Verhaltensunterschiede und Risikogrenzen zwischen Quick- und Auth-Modus verstehen.

## Was du nach diesem Tutorial kannst

- Cloudflared-Tunnel mit einem Klick installieren und starten
- Quick-Modus (temporäre URL) oder Auth-Modus (benannter Tunnel) wählen
- Öffentliche URL kopieren, damit Ferngeräte auf die lokale API zugreifen können
- Tunnel-Sicherheitsrisiken verstehen und eine Strategie zur minimalen Exposition anwenden

## Dein aktuelles Problem

Du hast das API-Gateway von Antigravity Tools lokal laufen, aber nur dein lokaler Computer oder dein LAN kann darauf zugreifen. Du möchtest, dass auch Fernserver, mobile Geräte oder Cloud-Dienste dieses Gateway aufrufen können, hast aber keine öffentliche IP und willst keine komplexe Server-Deployment-Lösung umsetzen.

## Wann diese Methode verwenden

- Du hast keine öffentliche IP, brauchst aber Ferngeräte-Zugriff auf die lokale API
- Du bist in der Test-/Entwicklungsphase und möchtest schnell einen Service extern exponieren
- Du willst keinen Server kaufen/deployen, sondern nur deine vorhandene Maschine nutzen

::: warning Sicherheitswarnung
Öffentliche Exposition hat Risiken! Bitte unbedingt:
1. Starke API-Keys konfigurieren (`proxy.auth_mode=strict/all_except_health`)
2. Tunnel nur wenn nötig starten und sofort nach Gebrauch stoppen
3. Regelmäßig Monitor-Logs prüfen, bei Anomalien sofort stoppen
:::

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen
- Du hast den lokalen Reverse-Proxy-Dienst gestartet (Schalter auf der Seite "API Proxy" ist eingeschaltet)
- Du hast mindestens ein aktives Konto hinzugefügt
:::

## Was ist Cloudflared?

**Cloudflared** ist der Tunnel-Client von Cloudflare, der einen verschlüsselten Kanal zwischen deiner Maschine und Cloudflare aufbaut und den lokalen HTTP-Service in eine öffentlich zugängliche URL verwandelt. Antigravity Tools hat Installation, Start, Stopp und URL-Kopierung zu UI-Operationen gemacht, damit du schnell den Verifikations-Zyklus durchlaufen kannst.

### Unterstützte Plattformen

Die im Projekt integrierte "Automatischer Download + Installation"-Logik deckt nur die folgenden OS/Architektur-Kombinationen ab (andere Plattformen zeigen `Unsupported platform` an).

| Betriebssystem | Architektur | Unterstützungsstatus |
| --- | --- | --- |
| macOS | Apple Silicon (arm64) | ✅ |
| macOS | Intel (x86_64) | ✅ |
| Linux | x86_64 | ✅ |
| Linux | ARM64 | ✅ |
| Windows | x86_64 | ✅ |

### Vergleich der beiden Modi

| Merkmal | Quick-Modus | Auth-Modus |
| --- | --- | --- |
| **URL-Typ** | `https://xxx.trycloudflare.com` (temporäre URL aus den Logs extrahiert) | App kann URL nicht automatisch extrahieren (hängt von cloudflared-Logs ab); Einstiegsdomäne hängt von deiner Konfiguration auf Cloudflare-Seite ab |
| **Token erforderlich** | ❌ Nein | ✅ Ja (aus Cloudflare-Dashboard) |
| **Stabilität** | URL kann sich bei Prozessneustart ändern | Hängt davon ab, wie du auf Cloudflare-Seite konfigurierst (App startet nur den Prozess) |
| **Geeignet für** | Temporäre Tests, schnelle Verifikation | Langzeitstabiler Service, Produktionsumgebung |
| **Empfehlung** | ⭐⭐⭐ Für Tests | ⭐⭐⭐⭐⭐ Für Produktion |

::: info Eigenschaften der Quick-Modus-URL
Die URL des Quick-Modus kann sich bei jedem Start ändern und ist ein zufällig generiertes `*.trycloudflare.com`-Subdomain. Wenn du eine feste URL brauchst, musst du den Auth-Modus verwenden und im Cloudflare-Dashboard eine Domäne binden.
:::

## Folge mir

### Schritt 1: Öffne die API Proxy-Seite

**Warum**
Finde den Cloudflared-Konfigurationseingang.

1. Öffne Antigravity Tools
2. Klicke in der linken Navigation auf **"API Proxy"** (API-Reverse-Proxy)
3. Finde die Karte **"Public Access (Cloudflared)"** (unten auf der Seite, oranges Symbol)

**Du solltest sehen**: Eine ausklappbare Karte, die "Cloudflared not installed" (nicht installiert) oder "Installed: xxx" (installiert) anzeigt.

### Schritt 2: Cloudflared installieren

**Warum**
Lade die Cloudflared-Binärdatei herunter und installiere sie im Ordner `bin` des Datenverzeichnisses.

#### Falls noch nicht installiert

1. Klicke auf den Button **"Install"** (Installieren)
2. Warte, bis der Download abgeschlossen ist (je nach Netzwerkgeschwindigkeit ca. 10-30 Sekunden)

**Du solltest sehen**:
- Der Button zeigt eine Ladeanimation
- Nach Abschluss erscheint "Cloudflared installed successfully"
- Die Karte zeigt "Installed: cloudflared version 202X.X.X"

#### Falls bereits installiert

Überspring diesen Schritt und gehe direkt zu Schritt 3.

::: tip Installationsort
Die Cloudflared-Binärdatei wird im Ordner `bin/` des "Datenverzeichnisses" installiert (der Name des Datenverzeichnisses ist `.antigravity_tools`).

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/bin/"
```

```powershell [Windows]
Get-ChildItem "$HOME\.antigravity_tools\bin\"
```

:::

Wenn du dir noch nicht sicher bist, wo das Datenverzeichnis liegt, lies zuerst **[Erster Start verstehen: Datenverzeichnis, Logs, Tray & Autostart](/de/lbjlaq/Antigravity-Manager/start/first-run-data/)**.
:::

### Schritt 3: Tunnel-Modus wählen

**Warum**
Wähle je nach deinem Anwendungsfall den passenden Modus.

1. Finde in der Karte den Moduswahlbereich (zwei große Buttons)
2. Klicke zur Auswahl:

| Modus | Beschreibung | Wann wählen |
| --- | --- | --- |
| **Quick Tunnel** | Automatisch temporäre URL generieren (`*.trycloudflare.com`) | Schneller Test, temporärer Zugriff |
| **Named Tunnel** | Cloudflare-Konto und benutzerdefinierte Domäne verwenden | Produktionsumgebung, feste Domäne erforderlich |

::: tip Empfehlung
Wenn du es zum ersten Mal verwendest, **wähle zuerst den Quick-Modus**, um schnell zu verifizieren, ob die Funktion deine Anforderungen erfüllt.
:::

### Schritt 4: Parameter konfigurieren

**Warum**
Fülle je nach Modus die notwendigen Parameter und Optionen aus.

#### Quick-Modus

1. Der Port wird automatisch dein aktueller Proxy-Port verwenden (Standard ist `8045`, gilt die tatsächliche Konfiguration)
2. Aktiviere **"Use HTTP/2"** (standardmäßig aktiviert)

#### Auth-Modus

1. Gib den **Tunnel-Token** ein (aus Cloudflare-Dashboard)
2. Der Port verwendet ebenfalls deinen aktuellen Proxy-Port (gilt die tatsächliche Konfiguration)
3. Aktiviere **"Use HTTP/2"** (standardmäßig aktiviert)

::: info Wie erhalte ich den Tunnel-Token?
1. Logge dich im [Cloudflare Zero Trust Dashboard](https://dash.cloudflare.com/sign-up-to-cloudflare-zero-trust) ein
2. Gehe zu **"Networks"** → **"Tunnels"**
3. Klicke auf **"Create a tunnel"** → **"Remote browser"** oder **"Cloudflared"**
4. Kopiere den generierten Token (ähnlich wie `eyJhIjoiNj...` langer String)
:::

#### Erläuterung zur HTTP/2-Option

`Use HTTP/2` lässt cloudflared mit `--protocol http2` starten. Der Text im Projekt beschreibt es als "mehr Kompatibilität (empfohlen für Nutzer in Festlandchina)" und ist standardmäßig aktiviert.

::: tip Empfohlen zu aktivieren
**HTTP/2-Option sollte standardmäßig aktiviert sein**, besonders im chinesischen Netzwerkumfeld.
:::

### Schritt 5: Tunnel starten

**Warum**
Baue den verschlüsselten Kanal zwischen lokalem Computer und Cloudflare auf.

1. Klicke auf den Schalter oben rechts in der Karte (oder auf den Button **"Start Tunnel"** nach dem Aufklappen)
2. Warte, bis der Tunnel gestartet ist (ca. 5-10 Sekunden)

**Du solltest sehen**:
- Rechts neben dem Kartentitel ein grüner Punkt
- Hinweis **"Tunnel Running"**
- Öffentliche URL (ähnlich wie `https://random-name.trycloudflare.com`)
- Rechts ein Kopier-Button: Der Button zeigt nur die ersten 20 Zeichen der URL, aber beim Klick wird die vollständige URL kopiert

::: warning Auth-Modus zeigt möglicherweise keine URL
Die aktuelle App extrahiert nur `*.trycloudflare.com`-URLs aus den cloudflared-Logs für die Anzeige. Auth-Modus gibt normalerweise solche Domänen nicht aus, also siehst du vielleicht nur "Running", aber keine URL. In diesem Fall hängt die Einstiegsdomäne von deiner Konfiguration auf Cloudflare-Seite ab.
:::

### Schritt 6: Öffentlichen Zugriff testen

**Warum**
Verifiziere, ob der Tunnel ordnungsgemäß funktioniert.

#### Systemgesundheitsprüfung

::: code-group

```bash [macOS/Linux]
#Ersetze durch deine tatsächliche Tunnel-URL
curl -s "https://your-url.trycloudflare.com/healthz"
```

```powershell [Windows]
Invoke-RestMethod "https://your-url.trycloudflare.com/healthz"
```

:::

**Du solltest sehen**: `{"status":"ok"}`

#### Modellliste abrufen

::: code-group

```bash [macOS/Linux]
#Wenn du Authentifizierung aktiviert hast, ersetze <proxy_api_key> durch deinen Key
curl -s \
  -H "Authorization: Bearer <proxy_api_key>" \
  "https://your-url.trycloudflare.com/v1/models"
```

```powershell [Windows]
Invoke-RestMethod \
  -Headers @{ Authorization = "Bearer <proxy_api_key>" } \
  "https://your-url.trycloudflare.com/v1/models"
```

:::

**Du solltest sehen**: Modellslisten-JSON wird zurückgegeben.

::: tip HTTPS beachten
Tunnel-URL ist HTTPS-Protokoll, keine zusätzliche Zertifikatkonfiguration erforderlich.
:::

#### Aufruf mit OpenAI SDK (Beispiel)

```python
import openai

#Verwende öffentliche URL
client = openai.OpenAI(
    api_key="your-proxy-api-key",  # Wenn Authentifizierung aktiviert
    base_url="https://your-url.trycloudflare.com/v1"
)

#modelId gilt nach der tatsächlichen Rückgabe von /v1/models

response = client.chat.completions.create(
    model="<modelId>",
    messages=[{"role": "user", "content": "Hallo"}]
)

print(response.choices[0].message.content)
```

::: warning Hinweis zur Authentifizierung
Wenn du auf der Seite "API Proxy" Authentifizierung aktiviert hast (`proxy.auth_mode=strict/all_except_health`), müssen Anfragen einen API-Key enthalten:
- Header: `Authorization: Bearer your-api-key`
- Oder: `x-api-key: your-api-key`
:::

### Schritt 7: Tunnel stoppen

**Warum**
Sofort nach Gebrauch stoppen, um Sicherheitsrisiken zu minimieren.

1. Klicke auf den Schalter oben rechts in der Karte (oder auf den Button **"Stop Tunnel"** nach dem Aufklappen)
2. Warte, bis der Stopp abgeschlossen ist (ca. 2 Sekunden)

**Du solltest sehen**:
- Der grüne Punkt verschwindet
- Hinweis **"Tunnel Stopped"**
- Öffentliche URL verschwindet

## Prüfpunkt ✅

Nach Abschluss der oben genannten Schritte solltest du in der Lage sein:

- [ ] Cloudflared-Binärdatei installieren
- [ ] Zwischen Quick- und Auth-Modus wechseln
- [ ] Tunnel starten und öffentliche URL erhalten
- [ ] Lokale API über öffentliche URL aufrufen
- [ ] Tunnel stoppen

## Häufige Probleme

### Problem 1: Installation schlägt fehl (Download-Timeout)

**Symptom**: Nach dem Klick auf "Install" reagiert es lange oder Download schlägt fehl.

**Ursache**: Netzwerkprobleme (besonders beim Zugriff von China auf GitHub Releases).

**Lösung**:
1. Netzwerkverbindung prüfen
2. VPN oder Proxy verwenden
3. Manuell herunterladen: [Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases), wähle die entsprechende Plattform-Version, manuell in den Ordner `bin` des Datenverzeichnisses legen und Ausführungsberechtigungen erteilen (macOS/Linux).

### Problem 2: Tunnel-Start schlägt fehl

**Symptom**: Nach dem Klick auf Start wird die URL nicht angezeigt oder Fehlermeldung.

**Ursache**:
- Auth-Modus: Token ungültig
- Lokaler Reverse-Proxy-Dienst nicht gestartet
- Port belegt

**Lösung**:
1. Auth-Modus: Prüfe, ob der Token korrekt und nicht abgelaufen ist
2. Prüfe, ob der Reverse-Proxy-Schalter auf der Seite "API Proxy" eingeschaltet ist
3. Prüfe, ob Port `8045` von anderen Programmen belegt ist

### Problem 3: Öffentliche URL nicht erreichbar

**Symptom**: curl oder SDK-Aufruf der öffentlichen URL timeout.

**Ursache**:
- Tunnel-Prozess unerwartet beendet
- Cloudflare-Netzwerkproblem
- Lokale Firewall blockiert

**Lösung**:
1. Prüfe, ob die Karte "Tunnel Running" anzeigt
2. Prüfe, ob die Karte Fehlermeldungen (roter Text) hat
3. Lokale Firewall-Einstellungen prüfen
4. Versuche, Tunnel neu zu starten

### Problem 4: Authentifizierung schlägt fehl (401)

**Symptom**: Anfrage gibt 401-Fehler zurück.

**Ursache**: Proxy hat Authentifizierung aktiviert, aber Anfrage enthält keinen API-Key.

**Lösung**:
1. Prüfe den Authentifizierungsmodus auf der Seite "API Proxy"
2. Füge den korrekten Header zur Anfrage hinzu:
   ```bash
   curl -H "Authorization: Bearer your-api-key" \
         https://your-url.trycloudflare.com/v1/models
   ```

## Zusammenfassung

Cloudflared-Tunnel ist ein leistungsstarkes Werkzeug, um lokale Dienste schnell zu exponieren. In dieser Lektion hast du gelernt:

- **Ein-Klick-Installation**: Automatischer Download und Installation von Cloudflared in der UI
- **Zwei Modi**: Auswahl zwischen Quick (temporär) und Auth (benannt)
- **Öffentlicher Zugriff**: HTTPS-URL kopieren, Ferngeräte können direkt aufrufen
- **Sicherheitsbewusstsein**: Authentifizierung aktivieren, sofort nach Gebrauch stoppen, regelmäßig Logs prüfen

Erinnere dich: **Tunnel sind ein zweischneidiges Schwert** – richtig genutzt bequem, falsch genutzt riskant. Befolge immer das Prinzip der minimalen Exposition.

## Vorschau auf die nächste Lektion

In der nächsten Lektion lernen wir **[Konfiguration komplett gelöst: AppConfig/ProxyConfig, Speicherort und Hot-Update-Semantik](/de/lbjlaq/Antigravity-Manager/advanced/config/)**.

Du wirst lernen:
- Vollständige Felder von AppConfig und ProxyConfig
- Speicherort der Konfigurationsdatei
- Welche Konfigurationen Neustart erfordern, welche Hot-Update unterstützen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Datenverzeichnis-Name (`.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Konfigurationsstruktur und Standardwerte (`CloudflaredConfig`, `TunnelMode`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L16-L59) | 16-59 |
| Automatischer Download-URL-Regeln (unterstützte OS/Architekturen) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L70-L88) | 70-88 |
| Installationslogik (Download/Schreiben/Extrahieren/Berechtigungen) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L147-L211) | 147-211 |
| Quick/Auth-Startparameter (`tunnel --url` vs `tunnel run --token`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L233-L266) | 233-266 |
| URL-Extraktionsregeln (nur `*.trycloudflare.com` erkennen) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L390-L413) | 390-413 |
| Tauri-Kommando-Schnittstelle (check/install/start/stop/get_status) | [`src-tauri/src/commands/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/cloudflared.rs#L6-L118) | 6-118 |
| UI-Karte (Modus/Token/HTTP2/URL-Anzeige und Kopieren) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1597-L1753) | 1597-1753 |
| Vor dem Start muss Proxy Running sein (toast + return) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L256-L306) | 256-306 |

**Wichtige Konstanten**:
- `DATA_DIR = ".antigravity_tools"`: Datenverzeichnis-Name (Quellcode: `src-tauri/src/modules/account.rs`)

**Wichtige Funktionen**:
- `get_download_url()`: Download-URL für GitHub Releases zusammenstellen (Quellcode: `src-tauri/src/modules/cloudflared.rs`)
- `extract_tunnel_url()`: Quick-Modus-URL aus Logs extrahieren (Quellcode: `src-tauri/src/modules/cloudflared.rs`)

</details>
