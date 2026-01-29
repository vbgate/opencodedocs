---
title: "Vollständiger Leitfaden zur Slack-Kanalkonfiguration: Socket/HTTP-Modus, Sicherheitseinstellungen | Clawdbot-Tutorial"
sidebarTitle: "Slack auch mit AI"
subtitle: "Vollständiger Leitfaden zur Slack-Kanalkonfiguration | Clawdbot-Tutorial"
description: "Lernen Sie, wie Sie den Slack-Kanal in Clawdbot konfigurieren und verwenden. Dieses Tutorial deckt Socket-Modus und HTTP-Modus, Token-Erwerb, DM-Sicherheitskonfiguration, Gruppenverwaltungsstrategien und die Slack-Actions-Tools ab."
tags:
  - "Plattformen"
  - "slack"
  - "Konfiguration"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 90
---

# Vollständiger Leitfaden zur Slack-Kanalkonfiguration

## Was Sie nach Abschluss können

- ✅ Interagieren Sie mit Clawdbot in Slack und nutzen Sie den AI-Assistenten, um Aufgaben zu erledigen
- ✅ Konfigurieren Sie DM-Sicherheitsrichtlinien zum Schutz der persönlichen Privatsphäre
- ✅ Integrieren Sie Clawdbot in Gruppen für intelligente Antworten auf @-Erwähnungen und Befehle
- ✅ Nutzen Sie Slack-Actions-Tools (Nachrichten senden, Pins verwalten, Mitgliederinformationen anzeigen usw.)
- ✅ Wählen Sie zwischen Socket-Modus oder HTTP-Modus für die Verbindung

## Ihr aktuelles Problem

Slack ist ein zentrales Tool für die Teamzusammenarbeit, aber Sie könnten auf folgende Probleme stoßen:

- Teamdiskussionen sind auf mehrere Kanäle verteilt, wichtige Informationen werden verpasst
- Schnelles Abfragen von Nachrichtenverlauf, Pins oder Mitgliederinformationen ist im Slack-Interface nicht bequem genug
- Sie möchten AI-Funktionalitäten direkt in Slack nutzen, ohne zu anderen Anwendungen wechseln zu müssen
- Sie sorgen sich, dass das Aktivieren des AI-Assistenten in Gruppen zu Nachrichtenfluten oder Datenschutzlecks führen könnte

## Wann sollten Sie dies verwenden

- **Tägliche Teamkommunikation**: Slack ist Ihr Hauptkommunikationstool für das Team
- **Native Slack-Integration erforderlich**: Nutzung von Reactions, Pins, Threads und anderen Funktionen
- **Mehrere Konten erforderlich**: Verbindung mit mehreren Slack-Workspaces
- **Remote-Deployment-Szenario**: Verwendung von HTTP-Modus zur Verbindung mit einem entfernten Gateway

## 🎒 Vorbereitungen

::: warning Vorab-Prüfung
Bevor Sie beginnen, stellen Sie sicher:
- Sie haben den [Schnellstart](../../start/getting-started/) abgeschlossen
- Das Gateway läuft
- Sie haben Administratorrechte für den Slack-Workspace (zum Erstellen einer App)
:

**Benötigte Ressourcen**:
- [Slack API Konsole](https://api.slack.com/apps) - Slack App erstellen und verwalten
- Clawdbot-Konfigurationsdatei - Normalerweise unter `~/.clawdbot/clawdbot.json`

## Grundkonzept

Der Slack-Kanal von Clawdbot basiert auf dem [Bolt](https://slack.dev/bolt-js)-Framework und unterstützt zwei Verbindungsmodi:

| Modus | Anwendungsfall | Vorteile | Nachteile |
|--- | --- | --- | ---|
| **Socket-Modus** | Lokales Gateway, persönliche Nutzung | Einfache Konfiguration (nur Token erforderlich) | Erfordert ständige WebSocket-Verbindung |
| **HTTP-Modus** | Server-Deployment, Remote-Zugriff | Kann Firewalls passieren, unterstützt Lastverteilung | Erfordert öffentliche IP, komplexere Konfiguration |

**Standardmäßig wird der Socket-Modus verwendet**, geeignet für die meisten Benutzer.

**Authentifizierungsmechanismen**:
- **Bot Token** (`xoxb-...`) - Erforderlich, für API-Aufrufe
- **App Token** (`xapp-...`) - Erforderlich für Socket-Modus, für WebSocket-Verbindung
- **User Token** (`xoxp-...`) - Optional, für schreibgeschützte Operationen (Verlauf, Pins, Reactions)
- **Signing Secret** - Erforderlich für HTTP-Modus, zur Validierung von Webhook-Anfragen

## Schritt-für-Schritt-Anleitung

### Schritt 1: Slack App erstellen

**Warum**
Die Slack App ist die Brücke zwischen Clawdbot und dem Workspace und bietet Authentifizierung und Zugriffssteuerung.

1. Besuchen Sie die [Slack API Konsole](https://api.slack.com/apps)
2. Klicken Sie auf **Create New App** → Wählen Sie **From scratch**
3. Füllen Sie die App-Informationen aus:
   - **App Name**: `Clawdbot` (oder ein Name Ihrer Wahl)
   - **Pick a workspace to develop your app in**: Wählen Sie Ihren Workspace
4. Klicken Sie auf **Create App**

**Sie sollten sehen**:
Die App wurde erfolgreich erstellt und Sie befinden sich auf der Basis-Konfigurationsseite.

### Schritt 2: Socket-Modus konfigurieren (empfohlen)

::: tip Tipp
Wenn Sie ein lokales Gateway verwenden, empfehlen wir den Socket-Modus, die Konfiguration ist einfacher.
:

**Warum**
Der Socket-Modus benötigt keine öffentliche IP und verbindet sich über den WebSocket-Dienst von Slack.

1. Suchen Sie auf der App-Konfigurationsseite nach **Socket Mode** und schalten Sie es auf **On**
2. Scrollen Sie zu **App-Level Tokens** und klicken Sie auf **Generate Token and Scopes**
3. Wählen Sie im Abschnitt **Token** den scope aus:
   - Aktivieren Sie `connections:write`
4. Klicken Sie auf **Generate Token** und kopieren Sie das generierte **App Token** (beginnt mit `xapp-`)

**Sie sollten sehen**:
Der generierte Token sieht ähnlich aus wie: `xapp-1-A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P`

::: danger Sicherheitswarnung
Das App Token ist sensible Information. Bewahren Sie es sicher auf und geben Sie es nicht an öffentliche Repositories weiter.
:

### Schritt 3: Bot Token und Berechtigungen konfigurieren

1. Scrollen Sie zu **OAuth & Permissions** → **Bot Token Scopes**
2. Fügen Sie die folgenden Scopes (Berechtigungen) hinzu:

**Bot Token Scopes (erforderlich)**:

```yaml
    chat:write                    # Nachrichten senden/bearbeiten/löschen
    channels:history              # Kanalverlauf lesen
    channels:read                 # Kanalinformationen abrufen
    groups:history                # Gruppenverlauf lesen
    groups:read                   # Gruppeninformationen abrufen
    im:history                   # DM-Verlauf lesen
    im:read                      # DM-Informationen abrufen
    im:write                     # DM-Sitzung öffnen
    mpim:history                # Gruppen-DM-Verlauf lesen
    mpim:read                   # Gruppen-DM-Informationen abrufen
    users:read                   # Benutzerinformationen abfragen
    app_mentions:read            # @-Erwähnungen lesen
    reactions:read               # Reactions lesen
    reactions:write              # Reactions hinzufügen/löschen
    pins:read                    # Pin-Liste lesen
    pins:write                   # Pins hinzufügen/löschen
    emoji:read                   # Custom Emojis lesen
    commands                     # Slash-Befehle verarbeiten
    files:read                   # Dateiinformationen lesen
    files:write                  # Dateien hochladen
```

::: info Erklärung
Die oben genannten sind die **erforderlichen Berechtigungen** für den Bot Token, um sicherzustellen, dass der Bot Nachrichten lesen, Antworten senden und Reactions sowie Pins verwalten kann.
:

3. Scrollen Sie zum oberen Rand der Seite und klicken Sie auf **Install to Workspace**
4. Klicken Sie auf **Allow**, um der App Zugriff auf Ihren Workspace zu gewähren
5. Kopieren Sie den generierten **Bot User OAuth Token** (beginnt mit `xoxb-`)

**Sie sollten sehen**:
Der Token sieht ähnlich aus wie: `xoxb-YOUR-BOT-TOKEN-HERE`

::: tip Tipp
 Wenn Sie einen **User Token** benötigen (für schreibgeschützte Operationen), scrollen Sie zu **User Token Scopes** und fügen Sie die folgenden Berechtigungen hinzu:
- `channels:history`, `groups:history`, `im:history`, `mpim:history`
- `channels:read`, `groups:read`, `im:read`, `mpim:read`
- `users:read`, `reactions:read`, `pins:read`, `emoji:read`
- `search:read`

Kopieren Sie anschließend auf der Seite **Install App** den **User OAuth Token** (beginnt mit `xoxp-`).

**User Token Scopes (optional, schreibgeschützt)**:
- Nur zum Lesen von Verlauf, Reactions, Pins, Emojis und Suchergebnissen
- Schreiboperationen verwenden weiterhin den Bot Token (außer `userTokenReadOnly: false` ist gesetzt)
:

### Schritt 4: Ereignisabonnement konfigurieren

1. Suchen Sie auf der App-Konfigurationsseite nach **Event Subscriptions** und aktivieren Sie **Enable Events**
2. Fügen Sie unter **Subscribe to bot events** die folgenden Ereignisse hinzu:

```yaml
    app_mention                  # @-Erwähnung des Bot
    message.channels              # Kanalnachricht
    message.groups               # Gruppennachricht
    message.im                   # DM-Nachricht
    message.mpim                # Gruppen-DM-Nachricht
    reaction_added               # Reaction hinzugefügt
    reaction_removed             # Reaction entfernt
    member_joined_channel       # Mitglied hat Kanal beigetreten
    member_left_channel          # Mitglied hat Kanal verlassen
    channel_rename               # Kanal umbenannt
    pin_added                   # Pin hinzugefügt
    pin_removed                 # Pin entfernt
```

3. Klicken Sie auf **Save Changes**

### Schritt 5: DM-Funktion aktivieren

1. Suchen Sie auf der App-Konfigurationsseite nach **App Home**
2. Aktivieren Sie **Messages Tab** → Aktivieren Sie **Enable Messages Tab**
3. Stellen Sie sicher, dass angezeigt wird: **Messages tab read-only disabled: No**

**Sie sollten sehen**:
Der Messages Tab ist aktiviert, Benutzer können DM-Gespräche mit dem Bot führen.

### Schritt 6: Clawdbot konfigurieren

**Warum**
Konfigurieren Sie die Slack Tokens in Clawdbot, um die Verbindung herzustellen.

#### Methode 1: Umgebungsvariablen verwenden (empfohlen)

```bash
    # Umgebungsvariablen festlegen
    export SLACK_BOT_TOKEN="xoxb-IhrBotToken"
    export SLACK_APP_TOKEN="xapp-IhrAppToken"

    # Gateway neu starten
    clawdbot gateway restart
```

**Sie sollten sehen**:
Im Gateway-Startprotokoll wird `Slack: connected` angezeigt.

#### Methode 2: Konfigurationsdatei

Bearbeiten Sie `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-IhrBotToken",
      "appToken": "xapp-IhrAppToken"
    }
  }
}
```

**Wenn Sie einen User Token haben**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-IhrBotToken",
      "appToken": "xapp-IhrAppToken",
      "userToken": "xoxp-IhrUserToken",
      "userTokenReadOnly": true
    }
  }
}
```

**Sie sollten sehen**:
Nach dem Neustart des Gateway ist die Slack-Verbindung erfolgreich.

### Schritt 7: Bot in Kanal einladen

1. Öffnen Sie in Slack den Kanal, zu dem der Bot hinzugefügt werden soll
2. Geben Sie `/invite @Clawdbot` ein (ersetzen Sie dies durch Ihren Bot-Namen)
3. Klicken Sie auf **Add to channel**

**Sie sollten sehen**:
Der Bot ist erfolgreich dem Kanal beigetreten und zeigt "Clawdbot has joined the channel".

### Schritt 8: Gruppen-Sicherheitsrichtlinie konfigurieren

**Warum**
Verhindern Sie, dass der Bot in allen Kanälen automatisch antwortet, und schützen Sie die Privatsphäre.

Bearbeiten Sie `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-IhrBotToken",
      "appToken": "xapp-IhrAppToken",
      "groupPolicy": "allowlist",
      "channels": {
        "C1234567890": {
          "allow": true,
          "requireMention": true
        },
        "#general": {
          "allow": true,
          "requireMention": true
        }
      }
    }
  }
}
```

**Felderklärung**:
- `groupPolicy`: Gruppenrichtlinie
  - `"open"` - Alle Kanäle zulassen (nicht empfohlen)
  - `"allowlist"` - Nur aufgelistete Kanäle zulassen (empfohlen)
  - `"disabled"` - Alle Kanäle deaktivieren
- `channels`: Kanalkonfiguration
  - `allow`: Zulassen/Ablehnen
  - `requireMention`: Ob @-Erwähnung des Bot für Antwort erforderlich ist (Standard `true`)
  - `users`: Zusätzliche Benutzer-Whitelist
  - `skills`: Beschränken Sie die in diesem Kanal verwendeten Skills
  - `systemPrompt`: Zusätzliche System-Prompt

**Sie sollten sehen**:
Der Bot antwortet nur in konfigurierten Kanälen und erfordert @-Erwähnung.

### Schritt 9: DM-Sicherheitsrichtlinie konfigurieren

**Warum**
Verhindern Sie, dass Fremde über DM mit dem Bot interagieren, und schützen Sie die Privatsphäre.

Bearbeiten Sie `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-IhrBotToken",
      "appToken": "xapp-IhrAppToken",
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["U1234567890", "@alice", "user@example.com"]
      }
    }
  }
}
```

**Felderklärung**:
- `dm.enabled`: DM aktivieren/deaktivieren (Standard `true`)
- `dm.policy`: DM-Richtlinie
  - `"pairing"` - Fremde erhalten Pairing-Code, benötigen Genehmigung (Standard)
  - `"open"` - Allen DM zulassen
  - `"allowlist"` - Nur Whitelist-Benutzer zulassen
- `dm.allowFrom`: Whitelist-Liste
  - Unterstützt Benutzer-ID (`U1234567890`)
  - Unterstützt @-Erwähnung (`@alice`)
  - Unterstützt E-Mail (`user@example.com`)

**Pairing-Ablauf**:
1. Fremder sendet DM an den Bot
2. Bot antwortet mit Pairing-Code (Gültigkeit 1 Stunde)
3. Benutzer stellt Pairing-Code dem Administrator zur Verfügung
4. Administrator führt aus: `clawdbot pairing approve slack <Pairing-Code>`
5. Benutzer wird zur Whitelist hinzugefügt und kann normal verwenden

**Sie sollten sehen**:
Unbekannte Absender erhalten Pairing-Code, der Bot verarbeitet ihre Nachrichten nicht.

### Schritt 10: Bot testen

1. Senden Sie in einem konfigurierten Kanal eine Nachricht: `@Clawdbot Hallo`
2. Oder senden Sie eine DM an den Bot
3. Beobachten Sie die Antwort des Bot

**Sie sollten sehen**:
Der Bot antwortet normal auf Ihre Nachricht.

### Checkpoint ✅

- [ ] Slack App erfolgreich erstellt
- [ ] Socket-Modus aktiviert
- [ ] Bot Token und App Token kopiert
- [ ] Clawdbot-Konfigurationsdatei aktualisiert
- [ ] Gateway neu gestartet
- [ ] Bot in Kanal eingeladen
- [ ] Gruppen-Sicherheitsrichtlinie konfiguriert
- [ ] DM-Sicherheitsrichtlinie konfiguriert
- [ ] Testnachricht erhalten Antwort

## Häufige Fehler

### Häufiger Fehler 1: Bot reagiert nicht

**Problem**: Nach dem Senden einer Nachricht antwortet der Bot nicht.

**Mögliche Ursachen**:
1. Bot nicht im Kanal → Verwenden Sie `/invite @Clawdbot`, um einzuladen
2. `requireMention` ist auf `true` eingestellt → Senden Sie Nachrichten mit `@Clawdbot`
3. Token-Konfigurationsfehler → Überprüfen Sie, ob der Token in `clawdbot.json` korrekt ist
4. Gateway läuft nicht → Führen Sie `clawdbot gateway status` aus, um den Status zu prüfen

### Häufiger Fehler 2: Socket-Modus-Verbindung fehlgeschlagen

**Problem**: Gateway-Protokoll zeigt Verbindungsfehler.

**Lösung**:
1. Überprüfen Sie, ob der App Token korrekt ist (beginnt mit `xapp-`)
2. Überprüfen Sie, ob der Socket-Modus aktiviert ist
3. Überprüfen Sie die Netzwerkverbindung

### Häufiger Fehler 3: Unzureichende User Token-Berechtigungen

**Problem**: Einige Operationen schlagen fehl mit einem Berechtigungsfehler.

**Lösung**:
1. Stellen Sie sicher, dass der User Token die erforderlichen Berechtigungen enthält (siehe Schritt 3)
2. Überprüfen Sie die Einstellung `userTokenReadOnly` (Standard `true`, schreibgeschützt)
3. Für Schreiboperationen setzen Sie `"userTokenReadOnly": false`

### Häufiger Fehler 4: Kanal-ID-Auflösung fehlgeschlagen

**Problem**: Der konfigurierte Kanalname kann nicht in eine ID aufgelöst werden.

**Lösung**:
1. Verwenden Sie vorzugsweise die Kanal-ID (z. B. `C1234567890`) anstelle des Namens
2. Stellen Sie sicher, dass der Kanalname mit `#` beginnt (z. B. `#general`)
3. Überprüfen Sie, ob der Bot Zugriff auf den Kanal hat

## Erweiterte Konfiguration

### Berechtigungserklärung

::: info Bot Token vs User Token
- **Bot Token**: Erforderlich, für die Hauptfunktionen des Bot (Nachrichten senden, Verlauf lesen, Pins/Reactions verwalten usw.)
- **User Token**: Optional, nur für schreibgeschützte Operationen (Verlauf, Reactions, Pins, Emojis, Suche)
  - Standard `userTokenReadOnly: true`, schreibgeschützt
  - Schreiboperationen (Nachrichten senden, Reactions hinzufügen usw.) verwenden weiterhin den Bot Token
:

**Möglicherweise zukünftig benötigte Berechtigungen**:

Die folgenden Berechtigungen sind in der aktuellen Version nicht erforderlich, können aber in Zukunft hinzugefügt werden:

| Berechtigung | Zweck |
|--- | ---|
| `groups:write` | Privater Kanal-Management (Erstellen, Umbenennen, Einladen, Archivieren) |
| `mpim:write` | Gruppen-DM-Sitzungs-Management |
| `chat:write.public` | Nachrichten in Kanäle veröffentlichen, in denen der Bot nicht Mitglied ist |
| `files:read` | Dateimetadaten auflisten/lesen |

Wenn Sie diese Funktionen aktivieren möchten, fügen Sie die entsprechenden Berechtigungen in den **Bot Token Scopes** der Slack App hinzu.

### HTTP-Modus (Server-Deployment)

Wenn Ihr Gateway auf einem Remote-Server bereitgestellt wird, verwenden Sie den HTTP-Modus:

1. Slack App erstellen, Socket-Modus deaktivieren
2. **Signing Secret** kopieren (Seite Basic Information)
3. Event Subscriptions konfigurieren, **Request URL** auf `https://ihre-domain/slack/events` setzen
4. Interactivity & Shortcuts konfigurieren, dieselbe **Request URL** festlegen
5. Slash Commands konfigurieren, **Request URL** festlegen

**Konfigurationsdatei**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "http",
      "botToken": "xoxb-IhrBotToken",
      "signingSecret": "IhrSigningSecret",
      "webhookPath": "/slack/events"
    }
  }
}
```

### Multi-Konto-Konfiguration

Unterstützung für die Verbindung mit mehreren Slack-Workspaces:

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "workspace1": {
          "name": "Team A",
          "enabled": true,
          "botToken": "xoxb-Workspace1Token",
          "appToken": "xapp-Workspace1Token"
        },
        "workspace2": {
          "name": "Team B",
          "enabled": true,
          "botToken": "xoxb-Workspace2Token",
          "appToken": "xapp-Workspace2Token"
        }
      }
    }
  }
}
```

### Slash-Befehle konfigurieren

Aktivieren Sie den `/clawd`-Befehl:

1. Suchen Sie auf der App-Konfigurationsseite nach **Slash Commands**
2. Erstellen Sie einen Befehl:
   - **Command**: `/clawd`
   - **Request URL**: Nicht erforderlich für Socket-Modus (wird über WebSocket verarbeitet)
   - **Description**: `Send a message to Clawdbot`

**Konfigurationsdatei**:

```json
{
  "channels": {
    "slack": {
      "slashCommand": {
        "enabled": true,
        "name": "clawd",
        "ephemeral": true
      }
    }
  }
}
```

### Antwort-Thread-Konfiguration

Steuern Sie die Antwortweise des Bot in Kanälen:

```json
{
  "channels": {
    "slack": {
      "replyToMode": "off",
      "replyToModeByChatType": {
        "direct": "all",
        "group": "first"
      }
    }
  }
}
```

| Modus | Verhalten |
|--- | ---|
| `off` | Standard, antwortet im Hauptkanal |
| `first` | Erste Antwort im Thread, nachfolgende Antworten im Hauptkanal |
| `all` | Alle Antworten im Thread |

### Slack Actions-Tools aktivieren

Erlauben Sie dem Agent, Slack-spezifische Operationen aufzurufen:

```json
{
  "channels": {
    "slack": {
      "actions": {
        "reactions": true,
        "messages": true,
        "pins": true,
        "memberInfo": true,
        "emojiList": true
      }
    }
  }
}
```

**Verfügbare Operationen**:
- `sendMessage` - Nachricht senden
- `editMessage` - Nachricht bearbeiten
- `deleteMessage` - Nachricht löschen
- `readMessages` - Nachrichtenverlauf lesen
- `react` - Reaction hinzufügen
- `reactions` - Reactions auflisten
- `pinMessage` - Nachricht pinnen
- `unpinMessage` - Pin aufheben
- `listPins` - Pins auflisten
- `memberInfo` - Mitgliederinformationen abrufen
- `emojiList` - Custom Emojis auflisten

## Zusammenfassung

- Der Slack-Kanal unterstützt zwei Verbindungsarten: Socket-Modus und HTTP-Modus
- Socket-Modus ist einfach zu konfigurieren, empfohlen für lokale Nutzung
- DM-Sicherheitsrichtlinie ist standardmäßig `pairing`, Fremde benötigen Genehmigung
- Gruppen-Sicherheitsrichtlinie unterstützt Whitelist und @-Erwähnungsfilter
- Slack-Actions-Tools bieten umfangreiche Operationsmöglichkeiten
- Multi-Konto-Unterstützung für die Verbindung mit mehreren Workspaces

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Discord-Kanal](../discord/)**.
>
> Sie werden lernen:
> - Konfigurationsmethode für Discord Bot
> - Token-Erwerb und Berechtigungseinstellungen
> - Gruppen- und DM-Sicherheitsrichtlinien
> - Verwendung von Discord-spezifischen Tools

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-27

| Funktion            | Dateipfad                                                                                               | Zeilennummer       |
|--- | --- | ---|
| Slack-Konfigurationstyp | [`src/config/types.slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.slack.ts) | 1-150      |
| Slack-Onboarding-Logik | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 1-539      |
|--- | --- | ---|
| Slack-offizielle Dokumentation | [`docs/channels/slack.md`](https://github.com/moltbot/moltbot/blob/main/docs/channels/slack.md) | 1-508      |

**Wichtige Typdefinitionen**:
- `SlackConfig`: Hauptkonfigurationstyp für Slack-Kanal
- `SlackAccountConfig`: Ein-Konto-Konfiguration (unterstützt socket/http-Modus)
- `SlackChannelConfig`: Kanalkonfiguration (Whitelist, Mention-Richtlinie usw.)
- `SlackDmConfig`: DM-Konfiguration (pairing, allowlist usw.)
- `SlackActionConfig`: Actions-Tool-Zugriffssteuerung

**Wichtige Funktionen**:
- `handleSlackAction()`: Slack Actions-Tool-Aufrufe verarbeiten
- `resolveThreadTsFromContext()`: Thread-ID basierend auf replyToMode auflösen
- `buildSlackManifest()`: Slack App Manifest generieren

</details>
