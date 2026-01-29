---
title: "Übersicht des Mehrkanal-Systems: Vollständige Erklärung der 13+ von Clawdbot unterstützten Kommunikationskanäle | Clawdbot-Tutorial"
sidebarTitle: "Den richtigen Kanal wählen"
subtitle: "Übersicht des Mehrkanal-Systems: Alle von Clawdbot unterstützten Kommunikationskanäle"
description: "Lernen Sie die 13+ von Clawdbot unterstützten Kommunikationskanäle kennen (WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, LINE usw.). Beherrschen Sie die Authentifizierungsmethoden, Eigenschaften und Anwendungsszenarien der einzelnen Kanäle und wählen Sie den für Sie passendsten Kanal für die Konfiguration. Das Tutorial behandelt DM-Pairing-Schutz, Gruppenverarbeitung und Konfigurationsmethoden."
tags:
  - "Kanäle"
  - "Plattformen"
  - "Mehrkanal"
  - "Erste Schritte"
prerequisite:
  - "start-getting-started"
order: 60
---

# Übersicht des Mehrkanal-Systems: Alle von Clawdbot unterstützten Kommunikationskanäle

## Was Sie nach Abschluss können

Nach Abschluss dieses Tutorials können Sie:

- ✅ Die 13+ von Clawdbot unterstützten Kommunikationskanäle verstehen
- ✅ Die Authentifizierungsmethoden und Konfigurationspunkte der einzelnen Kanäle beherrschen
- ✅ Den für Ihr Anwendungsszenario passendsten Kanal auswählen
- ✅ Den Sicherheitswert des DM-Pairing-Schutzmechanismus verstehen

## Ihr aktuelles Dilemma

Sie fragen sich vielleicht:

- "Welche Plattformen unterstützt Clawdbot?"
- "Was sind die Unterschiede zwischen WhatsApp, Telegram und Slack?"
- "Welcher Kanal ist am einfachsten und schnellsten?"
- "Muss ich auf jeder Plattform einen Bot registrieren?"

Die gute Nachricht ist: **Clawdbot bietet eine umfangreiche Kanalauswahl, sodass Sie basierend auf Ihren Gewohnheiten und Anforderungen frei kombinieren können**.

## Wann sollten Sie diesen Ansatz verwenden

Wenn Sie Folgendes benötigen:

- 🌐 **Einheitliche Verwaltung mehrerer Kanäle** – Ein AI-Assistent, gleichzeitig über mehrere Kanäle verfügbar
- 🤝 **Teamzusammenarbeit** – Integration in Arbeitsplätze wie Slack, Discord, Google Chat
- 💬 **Persönlicher Chat** – Tägliche Kommunikationstools wie WhatsApp, Telegram, iMessage
- 🔧 **Flexible Erweiterung** – Unterstützung regionaler Plattformen wie LINE, Zalo

::: tip Wert mehrerer Kanäle
Vorteile der Verwendung mehrerer Kanäle:
- **Nahtloser Wechsel**: WhatsApp zu Hause, Slack im Büro, Telegram unterwegs
- **Mehrgeräte-Synchronisation**: Nachrichten und Sitzungen bleiben auf allen Kanälen konsistent
- **Abdeckung verschiedener Szenarien**: Unterschiedliche Plattformen haben unterschiedliche Vorteile, die Kombination liefert die besten Ergebnisse
:::

---

## Kernkonzept

Das Kanalsystem von Clawdbot verwendet eine **Plugin-Architektur**:

```
┌─────────────────────────────────────────────────┐
│              Gateway (Steuerungsebene)           │
│         ws://127.0.0.1:18789                  │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┼───────┬─────────┬───────┐
        │       │       │         │       │
    WhatsApp  Telegram  Slack  Discord  ... usw. 13+ Kanäle
        │       │       │         │       │
    Baileys  grammY   Bolt  discord.js ...
```

**Schlüsselkonzepte**:

| Konzept          | Zweck                                   |
|--- | ---|
| **Kanal-Plugin** | Jeder Kanal ist ein eigenständiges Plugin |
| **Einheitliche Schnittstelle** | Alle Kanäle verwenden dieselbe API |
|--- | ---|
| **Gruppenunterstützung** | Unterstützt `@mention` und Befehlsauslösung |

---

## Übersicht der unterstützten Kanäle

Clawdbot unterstützt **13+ Kommunikationskanäle**, unterteilt in zwei Kategorien:

### Kernkanäle (integriert)

| Kanal           | Authentifizierungsmethode             | Schwierigkeit | Eigenschaften                              |
|--- | --- | --- | ---|
| **Telegram**   | Bot Token                            | ⭐           | Am einfachsten und schnellsten, für Anfänger empfohlen |
| **WhatsApp**   | QR-Code / Telefonverbindung         | ⭐⭐          | Verwendung echter Nummern, separates Handy + eSIM empfohlen |
| **Slack**      | Bot Token + App Token                | ⭐⭐          | Erste Wahl für Arbeitsplätze, Socket Mode         |
| **Discord**    | Bot Token                            | ⭐⭐          | Für Community- und Spielszenarien, funktionsreich         |
| **Google Chat** | OAuth / Service Account              | ⭐⭐⭐         | Google Workspace-Unternehmensintegration        |
| **Signal**     | signal-cli                           | ⭐⭐⭐         | Höchste Sicherheit, komplexe Einrichtung              |
| **iMessage**   | imsg (macOS)                         | ⭐⭐⭐         | macOS-exklusiv, noch in Entwicklung          |

### Erweiterungskanäle (externe Plugins)

| Kanal             | Authentifizierungsmethode             | Typ          | Eigenschaften                              |
|--- | --- | --- | ---|
| **WebChat**       | Gateway WebSocket                    | Integriert   | Keine Drittanbieter-Authentifizierung erforderlich, am einfachsten |
| **LINE**          | Messaging API                        | Externes Plugin   | Häufig verwendet von asiatischen Benutzern |
| **BlueBubbles**   | Private API                          | Erweiterungs-Plugin   | iMessage-Erweiterung, unterstützt Remotegeräte |
| **Microsoft Teams** | Bot Framework                        | Erweiterungs-Plugin   | Unternehmenszusammenarbeit |
| **Matrix**        | Matrix Bot SDK                       | Erweiterungs-Plugin   | Dezentrale Kommunikation |
| **Zalo**          | Zalo OA                              | Erweiterungs-Plugin   | Häufig verwendet von vietnamesischen Benutzern |
| **Zalo Personal** | Personal Account                     | Erweiterungs-Plugin   | Zalo-Personalkonto |

::: info Wie wählt man einen Kanal?
- **Anfänger**: Beginnen Sie mit Telegram oder WebChat
- **Persönliche Nutzung**: WhatsApp (wenn bereits eine Nummer vorhanden), Telegram
- **Teamzusammenarbeit**: Slack, Google Chat, Discord
- **Privatsphäre priorisieren**: Signal
- **Apple-Ökosystem**: iMessage, BlueBubbles
:::

---

## Detaillierte Erläuterung der Kernkanäle

### 1. Telegram (für Anfänger empfohlen)

**Warum empfohlen**:
- ⚡ Einfachster Konfigurationsablauf (nur Bot Token erforderlich)
- 📱 Native Unterstützung von Markdown und Rich Media
- 🌍 Weltweit verfügbar, keine spezielle Netzwerkumgebung erforderlich

**Authentifizierungsmethode**:
1. Suchen Sie in Telegram nach `@BotFather`
2. Senden Sie den Befehl `/newbot`
3. Richten Sie den Botnamen nach Anweisung ein
4. Erhalten Sie das Bot Token (Format: `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`)

**Konfigurationsbeispiel**:
```yaml
channels:
  telegram:
    botToken: "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"  # Standardmäßiger DM-Pairing-Schutz
    allowFrom: ["*"]     # Alle Benutzer zulassen (nach Pairing)
```

**Eigenschaften**:
- ✅ Unterstützt Threads/Topics
- ✅ Unterstützt Reaction-Emojis
- ✅ Unterstützt Dateien, Bilder, Videos

---

### 2. WhatsApp (für persönliche Benutzer empfohlen)

**Warum empfohlen**:
- 📱 Verwendung echter Handynummern, Freunde müssen keinen neuen Kontakt hinzufügen
- 🌍 Weltweit beliebtestes Instant-Messaging-Tool
- 📞 Unterstützt Sprachnachrichten und Anrufe

**Authentifizierungsmethode**:
1. Führen Sie `clawdbot channels login whatsapp` aus
2. Scannen Sie den QR-Code (ähnlich wie WhatsApp Web)
3. Oder verwenden Sie die Telefonverbindung (neue Funktion)

**Konfigurationsbeispiel**:
```yaml
channels:
  whatsapp:
    accounts:
      my-phone:
        dmPolicy: "pairing"  # Standardmäßiger DM-Pairing-Schutz
        allowFrom: ["*"]     # Alle Benutzer zulassen (nach Pairing)
```

**Eigenschaften**:
- ✅ Unterstützt Rich Media (Bilder, Videos, Dokumente)
- ✅ Unterstützt Sprachnachrichten
- ✅ Unterstützt Reaction-Emojis
- ⚠️ **Erfordert separates Handy** (eSIM + Reservegerät empfohlen)

::: warning WhatsApp-Einschränkungen
- Melden Sie nicht gleichzeitig an mehreren Orten dieselbe Nummer an
- Vermeiden Sie häufiges Neuverbinden (kann temporär gesperrt werden)
- Empfohlen wird die Verwendung einer separaten Testnummer
:::

---

### 3. Slack (für Teamzusammenarbeit empfohlen)

**Warum empfohlen**:
- 🏢 Weit verbreitet in Unternehmen und Teams
- 🔧 Unterstützt umfangreiche Actions und Slash Commands
- 📋 Nahtlose Integration in Workflows

**Authentifizierungsmethode**:
1. Erstellen Sie eine Anwendung auf [Slack API](https://api.slack.com/apps)
2. Aktivieren Sie Bot Token Scopes
3. Aktivieren Sie App-Level Token
4. Aktivieren Sie Socket Mode
5. Erhalten Sie Bot Token und App Token

**Konfigurationsbeispiel**:
```yaml
channels:
  slack:
    botToken: "xoxb-YOUR-BOT-TOKEN-HERE"
    appToken: "xapp-YOUR-APP-TOKEN-HERE"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**Eigenschaften**:
- ✅ Unterstützt Kanäle, Direktnachrichten, Gruppen
- ✅ Unterstützt Slack Actions (Kanal erstellen, Benutzer einladen usw.)
- ✅ Unterstützt Dateiuploads, Emojis
- ⚠️ Socket Mode muss aktiviert sein (vermeidet das Offenlegen von Ports)

---

### 4. Discord (für Community-Szenarien empfohlen)

**Warum empfohlen**:
- 🎮 Erste Wahl für Spiel- und Community-Szenarien
- 🤖 Unterstützt Discord-spezifische Funktionen (Rollen, Kanalverwaltung)
- 👥 Leistungsstarke Gruppen- und Community-Funktionen

**Authentifizierungsmethode**:
1. Erstellen Sie eine Anwendung auf [Discord Developer Portal](https://discord.com/developers/applications)
2. Erstellen Sie einen Bot-Benutzer
3. Aktivieren Sie Message Content Intent
4. Erhalten Sie das Bot Token

**Konfigurationsbeispiel**:
```yaml
channels:
  discord:
    botToken: "MTIzNDU2Nzg5MDEyMzQ1Njgw.GhIJKlmNoPQRsTUVwxyZABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**Eigenschaften**:
- ✅ Unterstützt Rollen- und Berechtigungsverwaltung
- ✅ Unterstützt Kanäle, Threads, Emojis
- ✅ Unterstützt bestimmte Actions (Kanal erstellen, Rollen verwalten usw.)
- ⚠️ Intents müssen korrekt konfiguriert sein

---

### 5. Andere Kernkanäle

#### Google Chat
- **Anwendungsszenario**: Google Workspace-Unternehmensbenutzer
- **Authentifizierungsmethode**: OAuth oder Service Account
- **Eigenschaften**: Integration mit Gmail und Calendar

#### Signal
- **Anwendungsszenario**: Benutzer mit Privatsphäre-Fokus
- **Authentifizierungsmethode**: signal-cli
- **Eigenschaften**: Ende-zu-Ende-Verschlüsselung, höchste Sicherheit

#### iMessage
- **Anwendungsszenario**: macOS-Benutzer
- **Authentifizierungsmethode**: imsg (macOS-exklusiv)
- **Eigenschaften**: Apple-Ökosystem-Integration, noch in Entwicklung

---

## Einführung in Erweiterungskanäle

### WebChat (am einfachsten)

**Warum empfohlen**:
- 🚀 Kein Drittanbieter-Konto oder Token erforderlich
- 🌐 Integrierte Gateway-WebSocket-Unterstützung
- 🔧 Schnell für Entwicklung und Debugging

**Verwendungsmethode**:

Nachdem der Gateway gestartet wurde, greifen Sie wie folgt direkt darauf zu:
- **macOS/iOS-App**: Native SwiftUI-Benutzeroberfläche
- **Control UI**: Browser-Zugriff auf den Chat-Tab der Konsole

**Eigenschaften**:
- ✅ Keine Konfiguration erforderlich, einsatzbereit
- ✅ Unterstützt Tests und Debugging
- ✅ Teilt Sitzungen und Routing-Regeln mit anderen Kanälen
- ⚠️ Nur lokaler Zugriff (kann über Tailscale offengelegt werden)

---

### LINE (asiatische Benutzer)

**Anwendungsszenario**: LINE-Benutzer in Japan, Taiwan, Thailand usw.

**Authentifizierungsmethode**: Messaging API (LINE Developers Console)

**Eigenschaften**:
- ✅ Unterstützt Schaltflächen, schnelle Antworten
- ✅ Weit verbreitet auf asiatischen Märkten
- ⚠️ Erfordert Überprüfung und Geschäftskonto

---

### BlueBubbles (iMessage-Erweiterung)

**Anwendungsszenario**: Erforderlicher Remote-iMessage-Zugriff

**Authentifizierungsmethode**: Private API

**Eigenschaften**:
- ✅ Remote-Steuerung von iMessage
- ✅ Unterstützt mehrere Geräte
- ⚠️ Erfordert separaten BlueBubbles-Server

---

### Microsoft Teams (Unternehmenszusammenarbeit)

**Anwendungsszenario**: Unternehmen mit Office 365

**Authentifizierungsmethode**: Bot Framework

**Eigenschaften**:
- ✅ Tiefe Integration in Teams
- ✅ Unterstützt Adaptive Cards
- ⚠️ Komplexe Konfiguration

---

### Matrix (dezentralisiert)

**Anwendungsszenario**: Enthusiasten dezentraler Kommunikation

**Authentifizierungsmethode**: Matrix Bot SDK

**Eigenschaften**:
- ✅ Föderiertes Netzwerk
- ✅ Ende-zu-Ende-Verschlüsselung
- ⚠️ Erfordert Konfiguration eines Homeservers

---

### Zalo / Zalo Personal (vietnamesische Benutzer)

**Anwendungsszenario**: Vietnamesischer Markt

**Authentifizierungsmethode**: Zalo OA / Personal Account

**Eigenschaften**:
- ✅ Unterstützt persönliche und Unternehmenskonten
- ⚠️ Regionale Einschränkung (Vietnam)

---

## DM-Pairing-Schutzmechanismus

### Was ist der DM-Pairing-Schutz?

Clawdbot aktiviert standardmäßig den **DM-Pairing-Schutz** (`dmPolicy="pairing"`), eine Sicherheitsfunktion:

1. **Unbekannte Absender** erhalten einen Pairing-Code
2. Nachrichten werden nicht verarbeitet, bis Sie das Pairing genehmigen
3. Nach der Genehmigung wird der Absender zur lokalen Whitelist hinzugefügt

::: warning Warum ist ein Pairing-Schutz erforderlich?
Clawdbot verbindet sich mit echten Messaging-Plattformen, **eingehende DMs müssen als nicht vertrauenswürdige Eingaben behandelt werden**. Der Pairing-Schutz kann:
- Spam und Missbrauch verhindern
- Die Verarbeitung schädlicher Befehle vermeiden
- Ihre AI-Kontingente und Privatsphäre schützen
:::

### Wie genehmigt man ein Pairing?

```bash
# Ausstehende Pairing-Anfragen anzeigen
clawdbot pairing list

# Pairing genehmigen
clawdbot pairing approve <channel> <code>

# Beispiel: Genehmigen eines Telegram-Absenders
clawdbot pairing approve telegram 123456
```

### Beispiel des Pairing-Ablaufs

```
Unbekannter Absender: Hallo AI!
Clawdbot: 🔒 Bitte zuerst paaren. Pairing-Code: ABC123
Ihre Aktion: clawdbot pairing approve telegram ABC123
Clawdbot: ✅ Pairing erfolgreich! Jetzt können Sie Nachrichten senden.
```

::: tip DM-Pairing-Schutz deaktivieren (nicht empfohlen)
Wenn Sie öffentlichen Zugriff wünschen, können Sie Folgendes einstellen:
```yaml
channels:
  telegram:
    dmPolicy: "open"
    allowFrom: ["*"]  # Alle Benutzer zulassen
```

⚠️ Dies verringert die Sicherheit, verwenden Sie es mit Vorsicht!
:::

---

## Gruppenverarbeitung von Nachrichten

### @mention-Auslösung

Standardmäßig erfordern Gruppennachrichten einen **@mention** des Bots, um zu antworten:

```yaml
channels:
  slack:
    allowUnmentionedGroups: false  # Standard: @mention erforderlich
```

### Befehlsauslösung

Sie können auch Befehlspräfixe verwenden:

```bash
# In einer Gruppe senden
/ask Erkläre Quantenverschränkung
/help Verfügbare Befehle auflisten
/new Neue Sitzung starten
```

### Konfigurationsbeispiel

```yaml
channels:
  discord:
    allowUnmentionedGroups: false  # @mention erforderlich
    # oder
    allowUnmentionedGroups: true   # Auf alle Nachrichten antworten (nicht empfohlen)
```

---

## Konfiguration von Kanälen: Assistent vs. Manuell

### Methode A: Verwendung des Onboarding-Assistenten (empfohlen)

```bash
clawdbot onboard
```

Der Assistent führt Sie durch:
1. Auswahl des Kanals
2. Konfiguration der Authentifizierung (Token, API-Key usw.)
3. Einrichtung der DM-Richtlinie
4. Testen der Verbindung

### Methode B: Manuelle Konfiguration

Bearbeiten Sie die Konfigurationsdatei `~/.clawdbot/clawdbot.json`:

```yaml
channels:
  telegram:
    botToken: "your-bot-token"
    dmPolicy: "pairing"
    allowFrom: ["*"]
  whatsapp:
    accountId: "my-phone"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

Starten Sie den Gateway neu, um die Konfiguration zu übernehmen:

```bash
clawdbot gateway restart
```

---

## Checkpoint ✅

Nach Abschluss dieses Tutorials sollten Sie in der Lage sein:

- [ ] Alle von Clawdbot unterstützten Kanäle aufzulisten
- [ ] Den DM-Pairing-Schutzmechanismus zu verstehen
- [ ] Den passendsten Kanal für Ihre Anforderungen auszuwählen
- [ ] Zu wissen, wie man Kanäle konfiguriert (Assistent oder manuell)
- [ ] Die Auslösemethoden für Gruppennachrichten zu verstehen

::: tip Nächste Schritte
Wählen Sie einen Kanal und beginnen Sie mit der Konfiguration:
- [WhatsApp-Kanalkonfiguration](../whatsapp/) - Verwendung echter Nummern
- [Telegram-Kanalkonfiguration](../telegram/) - Am einfachsten und schnellsten
- [Slack-Kanalkonfiguration](../slack/) - Erste Wahl für Teamzusammenarbeit
- [Discord-Kanalkonfiguration](../discord/) - Community-Szenarien
:::

---

## Fallstricke

### ❌ DM-Pairing-Schutz vergessen zu aktivieren

**Falsche Vorgehensweise**:
```yaml
channels:
  telegram:
    dmPolicy: "open"  # Zu offen!
```

**Richtige Vorgehensweise**:
```yaml
channels:
  telegram:
    dmPolicy: "pairing"  # Sicheres Standardverhalten
```

::: danger Risiko offener DMs
Offene DMs bedeuten, dass jeder Nachrichten an Ihren AI-Assistenten senden kann, was zu Folgendem führen kann:
- Missbrauch von Kontingenten
- Datenschutzlecks
- Ausführung schädlicher Befehle
:::

### ❌ WhatsApp an mehreren Orten angemeldet

**Falsche Vorgehensweise**:
- Gleichzeitige Anmeldung derselben Nummer auf Handy und Clawdbot
- Häufiges Neuverbinden von WhatsApp

**Richtige Vorgehensweise**:
- Verwendung einer separaten Testnummer
- Häufiges Neuverbinden vermeiden
- Überwachung des Verbindungsstatus

### ❌ Slack Socket Mode nicht aktiviert

**Falsche Vorgehensweise**:
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    # Fehlendes appToken
```

**Richtige Vorgehensweise**:
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    appToken: "xapp-..."  # Erforderlich
```

### ❌ Discord Intents falsch konfiguriert

**Falsche Vorgehensweise**:
- Nur grundlegende Intents aktiviert
- Message Content Intent vergessen zu aktivieren

**Richtige Vorgehensweise**:
- Alle erforderlichen Intents im Discord Developer Portal aktivieren
- Insbesondere Message Content Intent

---

## Zusammenfassung der Lektion

In dieser Lektion haben Sie gelernt:

1. ✅ **Kanalübersicht**: Clawdbot unterstützt 13+ Kommunikationskanäle
2. ✅ **Kernkanäle**: Eigenschaften und Konfiguration von Telegram, WhatsApp, Slack, Discord
3. ✅ **Erweiterungskanäle**: Spezielle Kanäle wie LINE, BlueBubbles, Teams, Matrix
4. ✅ **DM-Schutz**: Sicherheitswert und Verwendung des Pairing-Mechanismus
5. ✅ **Gruppenverarbeitung**: @mention- und Befehlsauslösungsmechanismen
6. ✅ **Konfigurationsmethoden**: Assistent und manuelle Konfiguration

**Nächste Schritte**:

- Lernen Sie die [WhatsApp-Kanalkonfiguration](../whatsapp/), um echte Nummern einzurichten
- Lernen Sie die [Telegram-Kanalkonfiguration](../telegram/), die schnellste Methode zum Einstieg
- Verstehen Sie die [Slack-Kanalkonfiguration](../slack/), Integration in die Teamzusammenarbeit
- Meistern Sie die [Discord-Kanalkonfiguration](../discord/), Community-Szenarien

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[WhatsApp-Kanalkonfiguration](../whatsapp/)**.
>
> Sie lernen:
> - Wie Sie sich mit QR-Code oder Telefonverbindung bei WhatsApp anmelden
> - Wie Sie DM-Richtlinien und Gruppenregeln konfigurieren
> - Wie Sie mehrere WhatsApp-Konten verwalten
> - Wie Sie WhatsApp-Verbindungsprobleme beheben

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-27

| Funktion            | Dateipfad                                                                                               | Zeilen    |
|--- | --- | ---|
| Kanal-Register       | [`src/channels/registry.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.ts) | 7-100     |
| Kanal-Plugin-Verzeichnis   | [`src/channels/plugins/`](https://github.com/clawdbot/clawdbot/tree/main/src/channels/plugins/) | Vollständiges Verzeichnis  |
| Kanal-Metadatentyp   | [`src/channels/plugins/types.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/types.core.ts) | 74-93     |
| DM-Pairing-Mechanismus     | [`src/channels/plugins/pairing.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/pairing.ts) | Vollständige Datei  |
| Gruppen @mention | [`src/channels/plugins/group-mentions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/group-mentions.ts) | Vollständige Datei  |
| Whitelist-Abgleich     | [`src/channels/plugins/allowlist-match.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/allowlist-match.ts) | Vollständige Datei  |
| Kanal-Verzeichniskonfiguration   | [`src/channels/plugins/directory-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/directory-config.ts) | Vollständige Datei  |
| WhatsApp-Plugin | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | Vollständige Datei  |
| Telegram-Plugin | [`src/channels/plugins/onboarding/telegram.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/telegram.ts) | Vollständige Datei  |
| Slack-Plugin     | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/slack.ts) | Vollständige Datei  |
| Discord-Plugin   | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | Vollständige Datei  |

**Wichtige Konstanten**:
- `CHAT_CHANNEL_ORDER`: Array der Kernkanalreihenfolge (aus `src/channels/registry.ts:7-15`)
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`: Standardkanal (aus `src/channels/registry.ts:21`)
- `dmPolicy="pairing"`: Standard-DM-Pairing-Richtlinie (aus `README.md:110`)

**Wichtige Typen**:
- `ChannelMeta`: Kanal-Metadatenschnittstelle (aus `src/channels/plugins/types.core.ts:74-93`)
- `ChannelAccountSnapshot`: Kanal-Kontostatus-Snapshot (aus `src/channels/plugins/types.core.ts:95-142`)
- `ChannelSetupInput`: Kanal-Konfigurationseingabeschnittstelle (aus `src/channels/plugins/types.core.ts:19-51`)

**Wichtige Funktionen**:
- `listChatChannels()`: Listet alle Kernkanäle auf (`src/channels/registry.ts:114-116`)
- `normalizeChatChannelId()`: Normalisiert die Kanal-ID (`src/channels/registry.ts:126-133`)
- `buildChannelUiCatalog()`: Baut das UI-Katalog auf (`src/channels/plugins/catalog.ts:213-239`)

</details>
