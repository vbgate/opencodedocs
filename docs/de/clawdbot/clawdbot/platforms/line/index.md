---
title: "LINE-Kanalkonfiguration und -nutzungsanleitung | Clawdbot-Tutorial"
sidebarTitle: "Mit KI auf LINE"
subtitle: "LINE-Kanalkonfiguration und -nutzungsanleitung"
description: "Lernen Sie, wie Sie den LINE-Kanal von Clawdbot konfigurieren und verwenden. Dieses Tutorial behandelt die LINE Messaging API-Integration, Webhook-Einrichtung, Zugriffskontrolle, Rich-Media-Nachrichten (Flex-Vorlagen, schnelle Antworten, Rich Menu) sowie Troubleshooting-Tipps für häufige Probleme."
tags:
  - "LINE"
  - "Messaging API"
  - "Kanalkonfiguration"
prerequisite:
  - "start-gateway-startup"
order: 140
---

# LINE-Kanalkonfiguration und -nutzungsanleitung

## Was Sie nach Abschluss können

Nach Abschluss dieses Tutorials können Sie:

- ✅ LINE Messaging API-Kanal erstellen und Anmeldeinformationen abrufen
- ✅ LINE-Plugin und Webhook von Clawdbot konfigurieren
- ✅ DM-Pairing, Gruppenzugriffskontrolle und Medienbegrenzungen einrichten
- ✅ Rich-Media-Nachrichten senden (Flex-Karten, schnelle Antworten, Standortinformationen)
- ✅ Häufige Probleme mit dem LINE-Kanal beheben

## Ihr aktuelles Dilemma

Sie fragen sich vielleicht:

- "Ich möchte über LINE mit einem KI-Assistenten chatten – wie integriere ich das?"
- "Wie konfiguriere ich den Webhook der LINE Messaging API?"
- "Unterstützt LINE Flex-Nachrichten und schnelle Antworten?"
- "Wie kann ich steuern, wer über LINE auf meinen KI-Assistenten zugreifen kann?"

Die gute Nachricht ist: **Clawdbot bietet ein vollständiges LINE-Plugin, das alle Kernfunktionen der Messaging API unterstützt**.

## Wann sollten Sie diesen Ansatz verwenden

Wenn Sie Folgendes benötigen:

- 📱 **Auf LINE** mit einem KI-Assistenten chatten
- 🎨 **Rich-Media-Nachrichten verwenden** (Flex-Karten, schnelle Antworten, Rich Menu)
- 🔒 **Zugriffsberechtigungen steuern** (DM-Pairing, Gruppen-Whitelist)
- 🌐 **LINE in** bestehende Arbeitsabläufe integrieren

## Kernkonzept

Der LINE-Kanal wird über die **LINE Messaging API** integriert und verwendet Webhooks zum Empfangen von Ereignissen und Senden von Nachrichten.

```
LINE-Benutzer
    │
    ▼ (Nachricht senden)
┌──────────────────┐
│  LINE-Plattform │
│  (Messaging API)│
└────────┬─────────┘
         │ (Webhook POST)
         ▼
┌──────────────────┐
│  Clawdbot       │
│  Gateway        │
│  /line/webhook   │
└────────┬─────────┘
         │ (KI aufrufen)
         ▼
    ┌────────┐
    │ Agent  │
    └───┬────┘
        │ (Antwort)
        ▼
    LINE-Benutzer
```

**Schlüsselkonzepte**:

| Konzept | Zweck |
|--- | ---|
| **Channel Access Token** | Authentifizierungstoken zum Senden von Nachrichten |
| **Channel Secret** | Schlüssel zur Verifizierung der Webhook-Signatur |
| **Webhook URL** | Endpunkt, an dem Clawdbot LINE-Ereignisse empfängt (muss HTTPS sein) |
| **DM Policy** | Zugriffsrichtlinie für unbekannte Absender (pairing/allowlist/open/disabled) |
| **Rich Menu** | LINE-Festmenü, Benutzer können durch Klicken schnell Aktionen auslösen |

## 🎒 Vorbereitungen

### Erforderliche Konten und Tools

| Element | Anforderung | Abrufmethode |
|--- | --- | ---|
| **LINE Developers-Konto** | Kostenlose Registrierung | https://developers.line.biz/console/ |
| **LINE Provider** | Provider und Messaging API-Kanal erstellen | LINE Console |
| **HTTPS-Server** | Webhook muss HTTPS sein | ngrok, Cloudflare Tunnel, Tailscale Serve/Funnel |

::: tip Empfohlene Expositionsmethoden
Wenn Sie lokal entwickeln, können Sie Folgendes verwenden:
- **ngrok**: `ngrok http 18789`
- **Tailscale Funnel**: `gateway.tailscale.mode = "funnel"`
- **Cloudflare Tunnel**: Kostenlos und stabil
:::

## Lassen Sie uns gemeinsam vorgehen

### Schritt 1: LINE-Plugin installieren

**Warum**
Der LINE-Kanal wird über ein Plugin implementiert und muss zuerst installiert werden.

```bash
clawdbot plugins install @clawdbot/line
```

**Sie sollten sehen**:
```
✓ Installed @clawdbot/line plugin
```

::: tip Lokale Entwicklung
Wenn Sie aus dem Quellcode ausführen, können Sie die lokale Installation verwenden:
```bash
clawdbot plugins install ./extensions/line
```
:::

### Schritt 2: LINE Messaging API-Kanal erstellen

**Warum**
Sie benötigen `Channel Access Token` und `Channel Secret` zur Konfiguration von Clawdbot.

#### 2.1 Bei LINE Developers Console anmelden

Besuchen Sie: https://developers.line.biz/console/

#### 2.2 Provider erstellen (falls noch nicht vorhanden)

1. Klicken Sie auf "Create new provider"
2. Geben Sie den Providernamen ein (z. B. `Clawdbot`)
3. Klicken Sie auf "Create"

#### 2.3 Messaging API-Kanal hinzufügen

1. Unter dem Provider klicken Sie auf "Add channel" → Wählen Sie "Messaging API"
2. Richten Sie die Kanalinformationen ein:
   - Channel name: `Clawdbot AI Assistant`
   - Channel description: `Personal AI assistant powered by Clawdbot`
   - Category: `Communication`
   - Subcategory: `Bot`
3. Aktivieren Sie "Agree" → Klicken Sie auf "Create"

#### 2.4 Webhook aktivieren

1. Auf der Kanaleinstellungsseite finden Sie den Tab "Messaging API"
2. Klicken Sie auf den Schalter "Use webhook" → Stellen Sie auf ON
3. Kopieren Sie folgende Informationen:

| Element | Speicherort | Beispiel |
|--- | --- | ---|
| **Channel Access Token** | Basic settings → Channel access token (long-lived) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Channel Secret** | Basic settings → Channel secret | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7` |

::: warning Bewahren Sie die Anmeldeinformationen sicher auf!
Channel Access Token und Channel Secret sind sensible Informationen. Bewahren Sie sie sicher auf und veröffentlichen Sie sie nicht in öffentlichen Repositories.
:::

### Schritt 3: LINE-Kanal von Clawdbot konfigurieren

**Warum**
Konfigurieren Sie den Gateway für die Verwendung der LINE Messaging API zum Senden und Empfangen von Nachrichten.

#### Methode A: Konfiguration über die Befehlszeile

```bash
clawdbot configure
```

Der Assistent fragt nach:
- Ob der LINE-Kanal aktiviert werden soll
- Channel Access Token
- Channel Secret
- DM-Richtlinie (Standard: `pairing`)

#### Methode B: Direktes Bearbeiten der Konfigurationsdatei

Bearbeiten Sie `~/.clawdbot/clawdbot.json`:

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
      channelSecret: "YOUR_CHANNEL_SECRET",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    }
  }
}
```

::: tip Verwendung von Umgebungsvariablen
Sie können auch über Umgebungsvariablen konfigurieren (nur für das Standardkonto gültig):
```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_token_here"
export LINE_CHANNEL_SECRET="your_secret_here"
```
:::

#### Methode C: Dateispeicherung für Anmeldeinformationen verwenden

Eine sicherere Methode ist das Speichern der Anmeldeinformationen in einer separaten Datei:

```json5
{
  channels: {
    line: {
      enabled: true,
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
      dmPolicy: "pairing"
    }
  }
}
```

### Schritt 4: Webhook URL einrichten

**Warum**
LINE benötigt die Webhook URL, um Clawdbot Nachrichtenereignisse zu übertragen.

#### 4.1 Sicherstellen, dass Ihr Gateway von außerhalb zugänglich ist

Wenn Sie lokal entwickeln, müssen Sie einen Tunneldienst verwenden:

```bash
# Mit ngrok
ngrok http 18789

# Die Ausgabe zeigt die HTTPS-URL, z. B.:
# Forwarding: https://abc123.ngrok.io -> http://localhost:18789
```

#### 4.2 Webhook URL in LINE Console einrichten

1. Auf der Messaging API-Einstellungsseite finden Sie "Webhook settings"
2. Geben Sie die Webhook URL ein:
   ```
   https://your-gateway-host/line/webhook
   ```
   - Standardpfad: `/line/webhook`
   - Kann über `channels.line.webhookPath` angepasst werden
3. Klicken Sie auf "Verify" → Bestätigen Sie, dass LINE Ihren Gateway erreichen kann

**Sie sollten sehen**:
```
✓ Webhook URL verification succeeded
```

#### 4.3 Erforderliche Ereignistypen aktivieren

In den Webhook settings aktivieren Sie folgende Ereignisse:

| Ereignis | Verwendung |
|--- | ---|
| **Message event** | Empfang von Benutzer gesendeten Nachrichten |
| **Follow event** | Benutzer fügt Bot als Freund hinzu |
| **Unfollow event** | Benutzer entfernt Bot |
| **Join event** | Bot tritt einer Gruppe bei |
| **Leave event** | Bot verlässt eine Gruppe |
| **Postback event** | Schnelle Antworten und Button-Klicks |

### Schritt 5: Gateway starten

**Warum**
Der Gateway muss ausgeführt werden, um LINE Webhook-Ereignisse zu empfangen.

```bash
clawdbot gateway --verbose
```

**Sie sollten sehen**:
```
✓ Gateway listening on ws://127.0.0.1:18789
✓ LINE webhook server started on /line/webhook
✓ LINE plugin initialized
```

### Schritt 6: LINE-Kanal testen

**Warum**
Überprüfen Sie, ob die Konfiguration korrekt ist und ob der KI-Assistent normal antwortet.

#### 6.1 Bot als Freund hinzufügen

1. In LINE Console → Messaging API → Channel settings
2. Kopieren Sie "Basic ID" oder "QR Code"
3. Suchen Sie in der LINE App oder scannen Sie den QR Code, um den Bot als Freund hinzuzufügen

#### 6.2 Testnachricht senden

Senden Sie eine Nachricht an den Bot in LINE:
```
Hallo, bitte fasse das heutige Wetter zusammen.
```

**Sie sollten sehen**:
- Bot zeigt "typing"-Status (wenn typing indicators konfiguriert sind)
- KI-Assistent antwortet streamend
- Nachricht wird korrekt in LINE angezeigt

### Schritt 7: DM-Pairing-Verifizierung (optional)

**Warum**
Wenn Sie die Standard-`dmPolicy="pairing"` verwenden, müssen unbekannte Absender zuerst genehmigt werden.

#### Ausstehende Pairing-Anfragen anzeigen

```bash
clawdbot pairing list line
```

**Sie sollten sehen**:
```
Pending pairing requests for LINE:
  CODE: ABC123 - User ID: U1234567890abcdef1234567890ab
```

#### Pairing-Anfrage genehmigen

```bash
clawdbot pairing approve line ABC123
```

**Sie sollten sehen**:
```
✓ Approved pairing request for LINE user U1234567890abcdef1234567890ab
```

::: info DM-Richtlinienerklärung
- `pairing` (Standard): Unbekannte Absender erhalten einen Pairing-Code, Nachrichten werden ignoriert, bis genehmigt
- `allowlist`: Nur Benutzer in der Whitelist dürfen Nachrichten senden
- `open`: Jeder kann Nachrichten senden (mit Vorsicht verwenden)
- `disabled`: Direktnachrichten deaktivieren
:::

## Checkpoint ✅

Überprüfen Sie, ob Ihre Konfiguration korrekt ist:

| Prüfitem | Verifizierungsmethode | Erwartetes Ergebnis |
|--- | --- | ---|
| **Plugin installiert** | `clawdbot plugins list` | `@clawdbot/line` angezeigt |
| **Konfiguration gültig** | `clawdbot doctor` | Keine LINE-bezogenen Fehler |
| **Webhook erreichbar** | LINE Console-Verifizierung | `✓ Verification succeeded` |
| **Bot zugreifbar** | In LINE Freund hinzufügen und Nachricht senden | KI-Assistent antwortet normal |
| **Pairing-Mechanismus** | DM mit neuem Benutzer senden | Pairing-Code erhalten (bei Verwendung der pairing-Richtlinie) |

## Fallstricke

### Häufiges Problem 1: Webhook-Verifizierung fehlgeschlagen

**Symptome**:
```
Webhook URL verification failed
```

**Ursachen**:
- Webhook URL ist nicht HTTPS
- Gateway läuft nicht oder Port ist falsch
- Firewall blockiert eingehende Verbindungen

**Lösung**:
1. Stellen Sie sicher, dass Sie HTTPS verwenden: `https://your-gateway-host/line/webhook`
2. Prüfen Sie, ob der Gateway läuft: `clawdbot gateway status`
3. Verifizieren Sie den Port: `netstat -an | grep 18789`
4. Verwenden Sie einen Tunneldienst (ngrok/Tailscale/Cloudflare)

### Häufiges Problem 2: Nachrichten können nicht empfangen werden

**Symptome**:
- Webhook-Verifizierung erfolgreich
- Aber Nachrichten an den Bot werden nicht beantwortet

**Ursachen**:
- Webhook-Pfad falsch konfiguriert
- Ereignistyp nicht aktiviert
- `channelSecret` in Konfigurationsdatei stimmt nicht überein

**Lösung**:
1. Prüfen Sie, ob `channels.line.webhookPath` mit der LINE Console übereinstimmt
2. Stellen Sie sicher, dass "Message event" in LINE Console aktiviert ist
3. Verifizieren Sie, ob `channelSecret` korrekt kopiert wurde (keine überflüssigen Leerzeichen)

### Häufiges Problem 3: Medien-Download fehlgeschlagen

**Symptome**:
```
Error downloading LINE media: size limit exceeded
```

**Ursachen**:
- Mediendatei überschreitet Standardbegrenzung (10MB)

**Lösung**:
Erhöhen Sie die Begrenzung in der Konfiguration:
```json5
{
  channels: {
    line: {
      mediaMaxMb: 25  // Offizielles LINE-Limit 25MB
    }
  }
}
```

### Häufiges Problem 4: Keine Antwort auf Gruppennachrichten

**Symptome**:
- DM funktioniert normal
- Keine Antwort auf Nachrichten in Gruppen

**Ursachen**:
- Standardmäßige `groupPolicy="allowlist"`, Gruppe nicht in der Whitelist
- Bot wurde im Gruppenchat nicht @mentioned

**Lösung**:
1. Fügen Sie die Gruppen-ID zur Whitelist in der Konfiguration hinzu:
```json5
{
  channels: {
    line: {
      groupAllowFrom: ["C1234567890abcdef1234567890ab"]
    }
  }
}
```

2. Oder @mention den Bot in der Gruppe: `@Clawdbot Hilf mir bei dieser Aufgabe`

## Erweiterte Funktionen

### Rich-Media-Nachrichten (Flex-Vorlagen und schnelle Antworten)

Clawdbot unterstützt Rich-Media-Nachrichten von LINE, einschließlich Flex-Karten, schnelle Antworten, Standortinformationen usw.

#### Schnelle Antworten senden

```json5
{
  text: "Was kann ich heute für dich tun?",
  channelData: {
    line: {
      quickReplies: ["Wetter abfragen", "Erinnerung setzen", "Code generieren"]
    }
  }
}
```

#### Flex-Karten senden

```json5
{
  text: "Status-Karte",
  channelData: {
    line: {
      flexMessage: {
        altText: "Server-Status",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            contents: [
              {
                type: "text",
                text: "CPU: 45%"
              },
              {
                type: "text",
                text: "Memory: 2.1GB"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### Standortinformationen senden

```json5
{
  text: "Dies ist mein Bürostandort",
  channelData: {
    line: {
      location: {
        title: "Office",
        address: "123 Main St, San Francisco",
        latitude: 37.7749,
        longitude: -122.4194
      }
    }
  }
}
```

### Rich Menu (Festmenü)

Rich Menu ist das Festmenü von LINE, Benutzer können durch Klicken schnell Aktionen auslösen.

```bash
# Rich Menu erstellen
clawdbot line rich-menu create

# Menübild hochladen
clawdbot line rich-menu upload --image /path/to/menu.png

# Als Standardmenü festlegen
clawdbot line rich-menu set-default --rich-menu-id <MENU_ID>
```

::: info Rich Menu-Begrenzungen
- Bildabmessungen: 2500x1686 oder 2500x843 Pixel
- Bildformat: PNG oder JPEG
- Maximal 10 Menüpunkte
:::

### Markdown-Konvertierung

Clawdbot konvertiert Markdown-Format automatisch in von LINE unterstützte Formate:

| Markdown | LINE-Konvertierungsergebnis |
|--- | ---|
| Codeblöcke | Flex-Karte |
| Tabellen | Flex-Karte |
| Links | Automatische Erkennung und Konvertierung in Flex-Karte |
| Fett/Kursiv | Entfernt (LINE wird nicht unterstützt) |

::: tip Format beibehalten
LINE unterstützt Markdown-Formatierung nicht. Clawdbot versucht, in Flex-Karten zu konvertieren. Wenn Sie reinen Text bevorzugen, können Sie die automatische Konvertierung in der Konfiguration deaktivieren.
:::

## Zusammenfassung der Lektion

In diesem Tutorial haben wir Folgendes behandelt:

1. ✅ LINE-Plugin installieren
2. ✅ LINE Messaging API-Kanal erstellen
3. ✅ Webhook und Anmeldeinformationen konfigurieren
4. ✅ Zugriffskontrolle einrichten (DM-Pairing, Gruppen-Whitelist)
5. ✅ Rich-Media-Nachrichten senden (Flex, schnelle Antworten, Standort)
6. ✅ Rich Menu verwenden
7. ✅ Häufige Probleme beheben

Der LINE-Kanal bietet reichhaltige Nachrichtentypen und Interaktionsmöglichkeiten und eignet sich hervorragend zum Aufbau personalisierter KI-Assistent-Erlebnisse auf LINE.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir das **[WebChat-Interface](../webchat/)**.
>
> Sie werden lernen:
> - Wie Sie über den Browser auf das WebChat-Interface zugreifen
> - Die Kernfunktionen von WebChat (Sitzungsverwaltung, Dateiuploads, Markdown-Unterstützung)
> - Konfiguration des Fernzugriffs (SSH-Tunnel, Tailscale)
> - Die Unterschiede zwischen WebChat und anderen Kanälen verstehen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| LINE Bot Kernimplementierung | [`src/line/bot.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/bot.ts) | 27-83 |
|--- | --- | ---|
|--- | --- | ---|
| Nachrichtensendefunktion | [`src/line/send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/send.ts) | - |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Markdown zu LINE | [`src/line/markdown-to-line.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/markdown-to-line.ts) | - |
| Webhook-Server | [`src/line/webhook.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/webhook.ts) | - |

**Wichtige Konfigurationsfelder**:
- `channelAccessToken`: LINE Channel Access Token (`config-schema.ts:19`)
- `channelSecret`: LINE Channel Secret (`config-schema.ts:20`)
- `dmPolicy`: DM-Zugriffsrichtlinie (`config-schema.ts:26`)
- `groupPolicy`: Gruppenzugriffsrichtlinie (`config-schema.ts:27`)
- `mediaMaxMb`: Mediengrößenbegrenzung (`config-schema.ts:28`)
- `webhookPath`: Benutzerdefinierter Webhook-Pfad (`config-schema.ts:29`)

**Wichtige Funktionen**:
- `createLineBot()`: LINE Bot-Instanz erstellen (`bot.ts:27`)
- `handleLineWebhookEvents()`: LINE Webhook-Ereignisse verarbeiten (`bot-handlers.ts:100`)
- `sendMessageLine()`: LINE-Nachrichten senden (`send.ts`)
- `createFlexMessage()`: Flex-Nachrichten erstellen (`send.ts:20`)
- `createQuickReplyItems()`: Schnelle Antworten erstellen (`send.ts:21`)

**Unterstützte DM-Richtlinien**:
- `open`: Offener Zugriff
- `allowlist`: Whitelist-Modus
- `pairing`: Pairing-Modus (Standard)
- `disabled`: Deaktiviert

**Unterstützte Gruppenrichtlinien**:
- `open`: Offener Zugriff
- `allowlist`: Whitelist-Modus (Standard)
- `disabled`: Deaktiviert

</details>
