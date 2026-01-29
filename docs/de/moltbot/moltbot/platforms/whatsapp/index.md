---
title: "Vollständiger Leitfaden zur WhatsApp-Konfiguration | Clawdbot-Tutorial"
sidebarTitle: "WhatsApp in 5 Minuten einrichten"
subtitle: "Vollständiger Leitfaden zur WhatsApp-Konfiguration"
description: "Erfahren Sie, wie Sie den WhatsApp-Kanal in Clawdbot konfigurieren und nutzen (basierend auf Baileys), einschließlich QR-Code-Anmeldung, Multi-Account-Verwaltung, DM-Zugriffskontrolle und Gruppenunterstützung."
tags:
  - "whatsapp"
  - "kanal-konfiguration"
  - "baileys"
  - "qr-login"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 70
---

# Vollständiger Leitfaden zur WhatsApp-Konfiguration

## Was Sie nach diesem Tutorial können

- WhatsApp-Konten per QR-Code mit Clawdbot verknüpfen
- Multi-Account-WhatsApp-Unterstützung konfigurieren
- DM-Zugriffskontrolle einrichten (Pairing/Whitelist/Öffentlich)
- WhatsApp-Gruppenunterstützung aktivieren und verwalten
- Automatische Nachrichtenbestätigungen und Lesebestätigungen konfigurieren

## Ihre aktuelle Herausforderung

WhatsApp ist Ihr am häufigsten genutzter Messaging-Dienst, aber Ihr KI-Assistent kann noch keine WhatsApp-Nachrichten empfangen. Sie möchten:
- Direkt mit der KI über WhatsApp chatten, ohne zwischen Apps wechseln zu müssen
- Kontrollieren, wer Ihrem KI-Assistenten Nachrichten senden darf
- Mehrere WhatsApp-Konten unterstützen (Arbeit/Privat getrennt)

## Wann Sie diese Lösung verwenden

- Sie müssen einen KI-Assistenten in WhatsApp integrieren
- Sie müssen Arbeits- und persönliche WhatsApp-Konten trennen
- Sie möchten präzise steuern, wer dem KI-Assistenten Nachrichten senden kann

::: info Was ist Baileys?

Baileys ist eine WhatsApp Web-Bibliothek, die es Programmen ermöglicht, Nachrichten über das WhatsApp Web-Protokoll zu senden und zu empfangen. Clawdbot verwendet Baileys, um sich mit WhatsApp zu verbinden, ohne die WhatsApp Business API zu nutzen. Das bietet mehr Privatsphäre und Flexibilität.

:::

## 🎒 Vorbereitungen vor dem Start

Bevor Sie den WhatsApp-Kanal konfigurieren, stellen Sie sicher:

- [ ] Clawdbot Gateway ist installiert und gestartet
- [ ] Sie haben den [Schnellstart](../../start/getting-started/) abgeschlossen
- [ ] Sie haben eine verfügbare Telefonnummer (empfohlen: eine Ersatznummer)
- [ ] Ihr WhatsApp-Handy hat Internetzugang (zum Scannen des QR-Codes)

::: warning Wichtige Hinweise

- **Empfehlung: Unabhängige Nummer verwenden**: Separate SIM-Karte oder altes Handy verwenden, um Störungen des persönlichen Gebrauchs zu vermeiden
- **Virtuelle Nummern vermeiden**: Virtuelle Nummern wie TextNow oder Google Voice werden von WhatsApp gesperrt
- **Node-Laufzeit**: WhatsApp und Telegram sind unter Bun instabil. Verwenden Sie Node ≥22

:::

## Kernkonzept

Die Kernarchitektur des WhatsApp-Kanals:

```
Ihr WhatsApp-Handy <--(QR-Code)--> Baileys <---> Clawdbot Gateway
                                                      ↓
                                                  AI Agent
                                                      ↓
                                              Antwortnachricht
```

**Schlüsselkonzepte**:

1. **Baileys-Sitzung**: Verbindung über WhatsApp Linked Devices herstellen
2. **DM-Strategie**: Steuert, wer dem KI-Assistenten private Nachrichten senden darf
3. **Multi-Account-Unterstützung**: Ein Gateway verwaltet mehrere WhatsApp-Konten
4. **Nachrichtenbestätigung**: Automatische Reaktionen/Lesebestätigungen für bessere Benutzererfahrung

## Folgen Sie mir

### Schritt 1: Grundeinstellungen konfigurieren

**Warum**
Zugriffssteuerungsrichtlinien für WhatsApp einrichten, um Ihren KI-Assistenten vor Missbrauch zu schützen.

Bearbeiten Sie `~/.clawdbot/clawdbot.json` und fügen Sie die WhatsApp-Konfiguration hinzu:

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "allowFrom": ["+15551234567"]
    }
  }
}
```

**Feldbeschreibung**:

| Feld | Typ | Standard | Beschreibung |
|--- | --- | --- | ---|
| `dmPolicy` | string | `"pairing"` | DM-Zugriffsrichtlinie: `pairing` (Pairing), `allowlist` (Whitelist), `open` (Öffentlich), `disabled` (Deaktiviert) |
| `allowFrom` | string[] | `[]` | Liste der zulässigen Absendernummern (E.164-Format, z. B. `+15551234567`) |

**Vergleich der DM-Strategien**:

| Strategie | Verhalten | Anwendungsfall |
|--- | --- | ---|
| `pairing` | Unbekannte Absender erhalten Pairing-Code, manuelle Genehmigung erforderlich | **Empfohlen**, Ausgewogenheit zwischen Sicherheit und Komfort |
| `allowlist` | Nur Nummern aus der `allowFrom`-Liste zulassen | Strikte Kontrolle, bekannte Benutzer |
| `open` | Jeder kann Nachrichten senden (erfordert `allowFrom` enthält `"*"`) | Öffentlicher Test oder Community-Service |
| `disabled` | Alle WhatsApp-Nachrichten ignorieren | Kanal vorübergehend deaktivieren |

**Sie sollten sehen**: Konfigurationsdatei erfolgreich gespeichert, keine JSON-Formatfehler.
### Schritt 2: Bei WhatsApp anmelden

**Warum**
WhatsApp-Konto per QR-Code mit Clawdbot verknüpfen, Baileys verwaltet den Sitzungsstatus.

Führen Sie im Terminal aus:

```bash
clawdbot channels login whatsapp
```

**Multi-Account-Anmeldung**:

Anmelden mit spezifischem Konto:

```bash
clawdbot channels login whatsapp --account work
```

Anmelden mit Standardkonto:

```bash
clawdbot channels login whatsapp
```

**Vorgehensweise**:

1. Terminal zeigt QR-Code an (oder in der CLI-Benutzeroberfläche)
2. Öffnen Sie die WhatsApp-App auf Ihrem Handy
3. Gehen Sie zu **Einstellungen → Verknüpfte Geräte**
4. Tippen Sie auf **Gerät verknüpfen**
5. Scannen Sie den im Terminal angezeigten QR-Code

**Sie sollten sehen**:

```
✓ WhatsApp linked successfully!
Credentials stored: ~/.clawdbot/credentials/whatsapp/default/creds.json
```

::: tip Speicherung der Anmeldedaten

WhatsApp-Anmeldedaten werden in `~/.clawdbot/credentials/whatsapp/<accountId>/creds.json` gespeichert. Nach der ersten Anmeldung wird die Sitzung bei nachfolgenden Starts automatisch wiederhergestellt, ohne dass der QR-Code erneut gescannt werden muss.

:::

### Schritt 3: Gateway starten

**Warum**
Gateway starten, damit der WhatsApp-Kanal mit dem Empfang und Senden von Nachrichten beginnen kann.

```bash
clawdbot gateway
```

Oder im Daemon-Modus:

```bash
clawdbot gateway start
```

**Sie sollten sehen**:

```
[WhatsApp] Connected to WhatsApp Web
[WhatsApp] Default account linked: +15551234567
Gateway listening on ws://127.0.0.1:18789
```

### Schritt 4: Testnachricht senden

**Warum**
Überprüfen, ob der WhatsApp-Kanal korrekt konfiguriert ist und Nachrichten normal empfangen und gesendet werden können.

Senden Sie eine Nachricht von Ihrem WhatsApp-Handy an die verknüpfte Nummer:

```
Hallo
```

**Sie sollten sehen**:
- Terminal zeigt Empfangsprotokoll für die Nachricht an
- WhatsApp erhält KI-Antwort

**Kontrollpunkt ✅**

- [ ] Gateway-Protokoll zeigt `[WhatsApp] Received message from +15551234567`
- [ ] WhatsApp erhält KI-Antwort
- [ ] Antwortinhalt ist relevant für Ihre Eingabe

### Schritt 5: Erweiterte Optionen konfigurieren (optional)

#### Automatische Nachrichtenbestätigung aktivieren

Fügen Sie Folgendes zu `clawdbot.json` hinzu:

```json
{
  "channels": {
    "whatsapp": {
      "ackReaction": {
        "emoji": "👀",
        "direct": true,
        "group": "mentions"
      }
    }
  }
}
```

**Feldbeschreibung**:

| Feld | Typ | Standard | Beschreibung |
|--- | --- | --- | ---|
| `emoji` | string | - | Bestätigungs-Emoji (z. B. `"👀"`, `"✅"`), leere Zeichenfolge deaktiviert |
| `direct` | boolean | `true` | Ob Bestätigungen in privaten Chats gesendet werden |
| `group` | string | `"mentions"` | Gruppenverhalten: `"always"` (alle Nachrichten), `"mentions"` (nur @Erwähnungen), `"never"` (niemals) |

#### Lesebestätigungen konfigurieren

Standardmäßig markiert Clawdbot Nachrichten automatisch als gelesen (blaue Haken). Um dies zu deaktivieren:

```json
{
  "channels": {
    "whatsapp": {
      "sendReadReceipts": false
    }
  }
}
```

#### Nachrichtenlimits anpassen

```json
{
  "channels": {
    "whatsapp": {
      "textChunkLimit": 4000,
      "mediaMaxMb": 50,
      "chunkMode": "length"
    }
  }
}
```

| Feld | Standard | Beschreibung |
|--- | --- | ---|
| `textChunkLimit` | 4000 | Maximale Zeichenanzahl pro Textnachricht |
| `mediaMaxMb` | 50 | Maximale Größe empfangener Mediendateien (MB) |
| `chunkMode` | `"length"` | Aufteilungsmodus: `"length"` (nach Länge), `"newline"` (nach Absätzen) |

**Sie sollten sehen**: Nach Wirksamwerden der Konfiguration werden lange Nachrichten automatisch aufgeteilt und Mediendateigrößen kontrolliert.
## Häufige Probleme

### Problem 1: QR-Code-Scan fehlgeschlagen

**Symptom**: Nach dem Scannen des QR-Codes zeigt das Terminal einen Verbindungsfehler oder Timeout an.

**Ursache**: Netzwerkverbindungsprobleme oder WhatsApp-Dienst ist instabil.

**Lösung**:

1. Überprüfen Sie die Netzwerkverbindung Ihres Handys
2. Stellen Sie sicher, dass der Gateway-Server Internetzugang hat
3. Abmelden und erneut anmelden:
   ```bash
   clawdbot channels logout whatsapp
   clawdbot channels login whatsapp
   ```

### Problem 2: Nachrichten nicht zugestellt oder verzögert

**Symptom**: Lange Wartezeit bis zum Empfang der Antwort nach dem Senden einer Nachricht.

**Ursache**: Gateway läuft nicht oder WhatsApp-Verbindung ist getrennt.

**Lösung**:

1. Gateway-Status prüfen: `clawdbot gateway status`
2. Gateway neu starten: `clawdbot gateway restart`
3. Protokolle anzeigen: `clawdbot logs --follow`

### Problem 3: Pairing-Code nicht erhalten

**Symptom**: Nachdem ein Fremder eine Nachricht gesendet hat, wurde kein Pairing-Code empfangen.

**Ursache**: `dmPolicy` ist nicht auf `pairing` eingestellt.

**Lösung**:

Überprüfen Sie die Einstellung von `dmPolicy` in `clawdbot.json`:

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing"  // ← Stellen Sie sicher, dass es "pairing" ist
    }
  }
}
```

### Problem 4: Bun-Laufzeitprobleme

**Symptom**: WhatsApp und Telegram verlieren häufig die Verbindung oder die Anmeldung schlägt fehl.

**Ursache**: Baileys und das Telegram-SDK sind unter Bun instabil.

**Lösung**:

Verwenden Sie Node ≥22 zum Ausführen des Gateways:

Aktuelle Laufzeit prüfen:

```bash
node --version
```

Zum Wechseln, Gateway mit Node ausführen:

```bash
clawdbot gateway --runtime node
```

::: tip Empfohlene Laufzeit

Für die Kanäle WhatsApp und Telegram wird dringend empfohlen, die Node-Laufzeit zu verwenden. Bun kann zu instabilen Verbindungen führen.

:::

## Zusammenfassung

Wichtige Punkte zur WhatsApp-Konfiguration:

1. **Grundkonfiguration**: `dmPolicy` + `allowFrom` steuern den Zugriff
2. **Anmeldeprozess**: `clawdbot channels login whatsapp` und QR-Code scannen
3. **Multi-Account**: Verwenden Sie den Parameter `--account` für mehrere WhatsApp-Konten
4. **Erweiterte Optionen**: Automatische Nachrichtenbestätigung, Lesebestätigungen, Nachrichtenlimits
5. **Fehlerbehebung**: Gateway-Status, Protokolle und Laufzeit prüfen

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Telegram-Konfiguration](../telegram/)**.
>
> Sie erfahren:
> - Bot Token für Telegram Bot konfigurieren
> - Befehle und Inline-Abfragen einrichten
> - Telegram-spezifische Sicherheitsrichtlinien verwalten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
| WhatsApp-Konfigurationstypdefinition | [`src/config/types.whatsapp.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.whatsapp.ts) | 1-160 |
|--- | --- | ---|
| WhatsApp-Onboarding-Konfiguration | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 1-341 |
| WhatsApp-Dokumentation | [`docs/channels/whatsapp.md`](https://github.com/moltbot/moltbot/blob/main/docs/channels/whatsapp.md) | 1-363 |
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Konfigurationsoptionen**:
- `dmPolicy`: DM-Zugriffsrichtlinie (`pairing`/`allowlist`/`open`/`disabled`)
- `allowFrom`: Liste zulässiger Absender (Telefonnummern im E.164-Format)
- `ackReaction`: Automatische Nachrichtenbestätigung (`{emoji, direct, group}`)
- `sendReadReceipts`: Ob Lesebestätigungen gesendet werden (Standard `true`)
- `textChunkLimit`: Textaufteilungslimit (Standard 4000 Zeichen)
- `mediaMaxMb`: Mediendateigrößenlimit (Standard 50 MB)

**Wichtige Funktionen**:
- `loginWeb()`: Führt WhatsApp QR-Code-Anmeldung aus
- `startWebLoginWithQr()`: Startet QR-Code-Generierungsprozess
- `sendReactionWhatsApp()`: Sendet WhatsApp Emoji-Reaktion
- `handleWhatsAppAction()`: Verarbeitet WhatsApp-spezifische Aktionen (z. B. Reaktionen)

**Wichtige Konstanten**:
- `DEFAULT_ACCOUNT_ID`: Standard-Konto-ID (`"default"`)
- `creds.json`: Speicherpfad für WhatsApp-Authentifizierungsdaten

</details>
