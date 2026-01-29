---
title: "Discord-Kanalkonfiguration und -nutzung | Clawdbot Tutorial"
sidebarTitle: "Verbinde deinen Discord Bot"
subtitle: "Discord-Kanalkonfiguration und -nutzung"
description: "Lerne, wie du einen Discord Bot erstellst und in Clawdbot konfigurierst. Dieses Tutorial umfasst die Erstellung eines Bots im Discord Developer Portal, die Konfiguration der Gateway Intents-Berechtigungen, die Bot Token-Konfiguration, die Generierung von OAuth2-Einladungs-URLs, den DM-Pairing-Schutzmechanismus, die Serverkanal-Whitelist-Konfiguration, die Verwaltung der AI Discord Tool-Aufrufberechtigungen sowie die Fehlerbehebung bei häufigen Problemen."
tags:
  - "Kanalkonfiguration"
  - "Discord"
  - "Bot"
prerequisite:
  - "start-getting-started"
order: 100
---

# Discord-Kanalkonfiguration und -nutzung

## Was du nach dem Lernen kannst

- Einen Discord Bot erstellen und das Bot Token erhalten
- Clawdbot mit dem Discord Bot integrieren
- Den KI-Assistenten in Discord-DMs und Serverkanälen nutzen
- Zugriffskontrolle konfigurieren (DM-Pairing, Kanal-Whitelist)
- KI Discord-Tools aufrufen lassen (Nachrichten senden, Kanäle erstellen, Rollen verwalten usw.)

## Deine aktuelle Herausforderung

Du nutzt bereits Discord, um dich mit Freunden oder Teams auszutauschen, und möchtest direkt in Discord mit dem KI-Assistenten kommunizieren, ohne zwischen Anwendungen zu wechseln. Du könntest folgende Probleme haben:

- Du weißt nicht, wie du einen Discord Bot erstellst
- Du bist unsicher, welche Berechtigungen erforderlich sind, damit der Bot ordnungsgemäß funktioniert
- Du möchtest steuern, wer mit dem Bot interagieren darf (um Missbrauch durch Fremde zu vermeiden)
- Du möchtest in verschiedenen Serverkanälen unterschiedliche Verhalten konfigurieren

Dieses Tutorial führt dich Schritt für Schritt durch die Lösung dieser Probleme.

## Wann diesen Ansatz verwenden

Der Discord-Kanal eignet sich für folgende Szenarien:

- ✅ Du bist ein intensiver Discord-Nutzer und führst die meisten Kommunikation über Discord
- ✅ Du möchtest KI-Funktionen zu deinem Discord-Server hinzufügen (z. B. intelligenter Assistent im ``#help``-Kanal)
- ✅ Du möchtest über Discord-DMs mit der KI interagieren (bequemer als das Öffnen von WebChat)
- ✅ Du benötigst KI, um Verwaltungsaufgaben in Discord auszuführen (Kanäle erstellen, Nachrichten senden usw.)

::: info Der Discord-Kanal basiert auf discord.js und unterstützt die vollständige Bot-API-Funktionalität.
:::

## 🎒 Vorbereitung

**Voraussetzungen**:
- [Schnellstart](../../start/getting-started/) abgeschlossen, Gateway kann laufen
- Node.js ≥ 22
- Discord-Konto (kann Anwendungen erstellen)

**Benötigte Informationen**:
- Discord Bot Token (wirst du später lernen, wie du es erhältst)
- Server-ID (optional, für die Konfiguration bestimmter Kanäle)
- Kanal-ID (optional, für detaillierte Steuerung)

## Kernkonzepte

### Wie der Discord-Kanal funktioniert

Der Discord-Kanal kommuniziert über die **offizielle Bot-API** mit Discord:

```
Discord-Benutzer
     ↓
   Discord-Server
     ↓
   Discord Bot Gateway
     ↓ (WebSocket)
   Clawdbot Gateway
     ↓
   KI-Agent (Claude/GPT usw.)
     ↓
   Discord Bot API (Antwort senden)
     ↓
   Discord-Server
     ↓
Discord-Benutzer (sieht Antwort)
```

**Schlüsselpunkte**:
- Der Bot empfängt Nachrichten über WebSocket (Gateway → Bot)
- Clawdbot leitet die Nachrichten an den KI-Agenten zur Verarbeitung weiter
- Die KI kann ``discord``-Tools aufrufen, um Discord-spezifische Aktionen auszuführen
- Alle Antworten werden über die Bot-API an Discord zurückgesendet

### Unterschied zwischen DM und Serverkanälen

| Typ | Sitzungsisolierung | Standardverhalten | Anwendungsszenario |
|--- | --- | --- | ---|
| **Private Nachricht (DM)** | Alle DMs gemeinsam nutzen `agent:main:main`-Sitzung | Erfordert Pairing-Schutz | Persönliche Unterhaltung, Kontextfortsetzung |
| **Serverkanal** | Jeder Kanal hat eigene Sitzung `agent:&lt;agentId&gt;:discord:channel:&lt;channelId&gt;` | Erfordert @Erwähnung für Antworten | Server-intelligenter Assistent, parallele Mehrkanalnutzung |

::: tip
Serverkanal-Sitzungen sind vollständig isoliert und stören sich nicht gegenseitig. Gespräche im ``#help``-Kanal erscheinen nicht in ``#general``.
:::

### Standard-Sicherheitsmechanismus

Der Discord-Kanal ist standardmäßig mit **DM-Pairing-Schutz** aktiviert:

```
Unbekannter Benutzer → DM senden → Clawdbot
                              ↓
                      Ablehnen, Pairing-Code zurückgeben
                              ↓
                Benutzer muss `clawdbot pairing approve discord <code>` ausführen
                              ↓
                            Pairing erfolgreich, kann chatten
```

Dies verhindert, dass unbekannte Benutzer direkt mit deinem KI-Assistenten interagieren.

---

## Folge den Schritten

### Schritt 1: Discord-Anwendung und Bot erstellen

**Warum**
Ein Discord Bot benötigt eine "Identität", um eine Verbindung zum Discord-Server herzustellen. Diese Identität ist das Bot Token.

#### 1.1 Discord-Anwendung erstellen

1. Öffne das [Discord Developer Portal](https://discord.com/developers/applications)
2. Klicke auf **New Application** (Neue Anwendung)
3. Gib den Anwendungsnamen ein (z. B. ``Clawdbot AI``)
4. Klicke auf **Create** (Erstellen)

#### 1.2 Bot-Benutzer hinzufügen

1. Klicke in der linken Navigationsleiste auf **Bot** (Bot)
2. Klicke auf **Add Bot** → **Reset Token** → **Reset Token** (Token zurücksetzen)
3. **Wichtig**: Kopiere sofort das Bot Token (es wird nur einmal angezeigt!)

```
Bot Token Format: MTAwOTk1MDk5NjQ5NTExNjUy.Gm9...
(Ändert sich bei jedem Zurücksetzen, sicher aufbewahren!)
```

#### 1.3 Erforderliche Gateway Intents aktivieren

Discord lässt Bot standardmäßig nicht den Nachrichteninhalt lesen, dies muss manuell aktiviert werden.

Aktiviere in **Bot → Privileged Gateway Intents** (Privilegierte Gateway Intents):

| Intent | Erforderlich | Beschreibung |
|--- | --- | ---|
| **Message Content Intent** | ✅ **Erforderlich** | Nachrichten-Textinhalt lesen (ohne diesen kann der Bot keine Nachrichten sehen) |
| **Server Members Intent** | ⚠️ **Empfohlen** | Für Mitgliedersuche und Benutzernamensauflösung |

::: danger Warnung
Aktiviere nicht den **Presence Intent** (Präsenz-Intent), es sei denn, du benötigst tatsächlich den Online-Status der Benutzer.
:::

**Du solltest sehen**: Beide Schalter befinden sich im grünen (ON) Status.

---

### Schritt 2: Einladungs-URL generieren und zum Server hinzufügen

**Warum**
Der Bot benötigt Berechtigungen, um Nachrichten im Server zu lesen und zu senden.

1. Klicke in der linken Navigationsleiste auf **OAuth2 → URL Generator**
2. Wähle in **Scopes** (Bereich):
   - ✅ **bot**
   - ✅ **applications.commands** (für nativale Befehle)

3. Wähle in **Bot Permissions** (Bot-Berechtigungen) mindestens:

| Berechtigung | Beschreibung |
|--- | ---|
| **View Channels** | Kanäle anzeigen |
| **Send Messages** | Nachrichten senden |
| **Read Message History** | Nachrichtenverlauf lesen |
| **Embed Links** | Links einbetten |
| **Attach Files** | Dateien hochladen |

Optionale Berechtigungen (bei Bedarf hinzufügen):
- **Add Reactions** (Reaktionen hinzufügen)
- **Use External Emojis** (Benutzerdefinierte Emojis verwenden)

::: warning Sicherheitshinweis
Vermeide das Erteilen der **Administrator**-Berechtigung, es sei denn, du debuggst und vertraust dem Bot vollständig.
:::

4. Kopiere die generierte URL
5. Öffne die URL in einem Browser
6. Wähle deinen Server aus und klicke auf **Authorize** (Autorisieren)

**Du solltest sehen**: Der Bot ist erfolgreich dem Server beigetreten und zeigt den grünen Online-Status an.

---

### Schritt 3: Erforderliche IDs abrufen (Server, Kanal, Benutzer)

**Warum**
Die Clawdbot-Konfiguration bevorzugt die Verwendung von IDs (Nummern), da IDs sich nicht ändern.

#### 3.1 Discord-Entwicklermodus aktivieren

1. Discord-Desktop/Web-Version → **User Settings** (Benutzereinstellungen)
2. **Advanced** (Erweitert) → Aktiviere **Developer Mode** (Entwicklermodus)

#### 3.2 ID kopieren

| Typ | Aktion |
|--- | ---|
| **Server-ID** | Rechtsklick auf Servername → **Copy Server ID** |
| **Kanal-ID** | Rechtsklick auf Kanal (z. B. ``#general``) → **Copy Channel ID** |
| **Benutzer-ID** | Rechtsklick auf Benutzeravatar → **Copy User ID** |

::: tip ID vs Name
Verwende bei der Konfiguration bevorzugt IDs. Namen können sich ändern, aber IDs bleiben für immer gleich.
:::

**Du solltest sehen**: Die ID wurde in die Zwischenablage kopiert (Format: ``123456789012345678``).

---

### Schritt 4: Clawdbot-Verbindung zu Discord konfigurieren

**Warum**
Clawdbot mitteilen, wie es sich mit deinem Discord Bot verbinden soll.

#### Methode 1: Über Umgebungsvariablen (empfohlen, geeignet für Server)

```bash
export DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"

clawdbot gateway --port 18789
```

#### Methode 2: Über Konfigurationsdatei

Bearbeite ``~/.clawdbot/clawdbot.json``:

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "YOUR_BOT_TOKEN"  // Token aus Schritt 1
    }
  }
}
```

::: tip Priorität von Umgebungsvariablen
Wenn Umgebungsvariablen und Konfigurationsdatei gleichzeitig festgelegt sind, hat die **Konfigurationsdatei Priorität**.
:::

**Du solltest sehen**: Nach dem Start des Gateway zeigt der Discord Bot den Online-Status an.

---

### Schritt 5: Verbindung überprüfen und testen

**Warum**
Sicherstellen, dass die Konfiguration korrekt ist und der Bot Nachrichten ordnungsgemäß empfangen und senden kann.

1. Starte das Gateway (falls noch nicht gestartet):

```bash
clawdbot gateway --port 18789 --verbose
```

2. Überprüfe den Discord-Bot-Status:
   - Der Bot sollte in der Servermitgliederliste als **grün (online)** angezeigt werden
   - Wenn er grau (offline) ist, überprüfe, ob das Token korrekt ist

3. Sende eine Testnachricht:

In Discord:
- **Private Nachricht**: Sende eine Nachricht direkt an den Bot (du erhältst einen Pairing-Code, siehe nächster Abschnitt)
- **Serverkanal**: @Erwähne den Bot, z. B. ``@ClawdbotAI hello``

**Du solltest sehen**: Der Bot antwortet mit einer Nachricht (der Inhalt hängt von deinem KI-Modell ab).

::: tip Test fehlgeschlagen?
Wenn der Bot nicht antwortet, überprüfe den Abschnitt [Fehlerbehebung](#fehlerbehebung).
:::

---

## Kontrollpunkt ✅

Bevor du fortfährst, bestätige Folgendes:

- [ ] Bot Token ist korrekt konfiguriert
- [ ] Bot ist erfolgreich dem Server beigetreten
- [ ] Message Content Intent ist aktiviert
- [ ] Gateway wird ausgeführt
- [ ] Bot wird in Discord als online angezeigt
- [ ] @Erwähnung des Bot erhält eine Antwort

---

## Erweiterte Konfiguration

### DM-Zugriffskontrolle

Die Standardstrategie ist ``pairing`` (Pairing-Modus), geeignet für die persönliche Nutzung. Du kannst sie bei Bedarf anpassen:

| Strategie | Beschreibung | Konfigurationsbeispiel |
|--- | --- | ---|
| **pairing** (Standard) | Fremde erhalten Pairing-Code, manuelle Genehmigung erforderlich | ``"dm": { "policy": "pairing" }`` |
| **allowlist** | Nur Benutzer in der Liste zulassen | ``"dm": { "policy": "allowlist", "allowFrom": ["123456", "alice"] }`` |
| **open** | Alle zulassen (erfordert ``allowFrom`` mit ``"*"``) | ``"dm": { "policy": "open", "allowFrom": ["*"] }`` |
| **disabled** | Alle DMs deaktivieren | ``"dm": { "enabled": false }`` |

#### Konfigurationsbeispiel: Bestimmte Benutzer zulassen

```json5
{
  channels: {
    discord: {
      dm: {
        enabled: true,
        policy: "allowlist",
        allowFrom: [
          "123456789012345678",  // Benutzer-ID
          "@alice",                   // Benutzername (wird in ID aufgelöst)
          "alice#1234"              // Vollständiger Benutzername
        ]
      }
    }
  }
}
```

#### Pairing-Anfragen genehmigen

Wenn ein fremder Benutzer erstmals eine DM sendet, erhält er einen Pairing-Code. Genehmigungsart:

```bash
clawdbot pairing approve discord <Pairing-Code>
```

### Serverkanal-Konfiguration

#### Grundkonfiguration: Nur bestimmte Kanäle zulassen

```json5
{
  channels: {
    discord: {
      groupPolicy: "allowlist",  // Whitelist-Modus (Standard)
      guilds: {
        "123456789012345678": {
          requireMention: true,  // @Erwähnung für Antworten erforderlich
          channels: {
            help: { allow: true },    // #help zulassen
            general: { allow: true } // #general zulassen
          }
        }
      }
    }
  }
}
```

::: tip
``requireMention: true`` ist die empfohlene Konfiguration, um zu vermeiden, dass der Bot in öffentlichen Kanälen "selbstständig" agiert.
:::

#### Erweiterte Konfiguration: Kanalspezifisches Verhalten

```json5
{
  channels: {
    discord: {
      guilds: {
        "123456789012345678": {
          slug: "my-server",              // Anzeigename (optional)
          reactionNotifications: "own",      // Nur Reaktionen auf eigene Bot-Nachrichten lösen Ereignisse aus
          channels: {
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"], // Nur bestimmte Benutzer können auslösen
              skills: ["search", "docs"],    // Verfügbare Skills einschränken
              systemPrompt: "Keep answers under 50 words."  // Zusätzlicher System-Prompt
            }
          }
        }
      }
    }
  }
}
```

### Discord-Tool-Aktionen

Der KI-Agent kann ``discord``-Tools aufrufen, um Discord-spezifische Aktionen auszuführen. Steuere die Berechtigungen über ``channels.discord.actions``:

| Aktionskategorie | Standardstatus | Beschreibung |
|--- | --- | ---|
| **reactions** | ✅ Aktiviert | Reaktionen hinzufügen/lesen |
| **messages** | ✅ Aktiviert | Nachrichten lesen/senden/bearbeiten/löschen |
| **threads** | ✅ Aktiviert | Threads erstellen/beantworten |
| **channels** | ✅ Aktiviert | Kanäle erstellen/bearbeiten/löschen |
| **pins** | ✅ Aktiviert | Nachrichten anheften/aufheben |
| **search** | ✅ Aktiviert | Nachrichten suchen |
| **memberInfo** | ✅ Aktiviert | Mitgliederinformationen abfragen |
| **roleInfo** | ✅ Aktiviert | Rollenliste abfragen |
| **roles** | ❌ **Deaktiviert** | Rollen hinzufügen/entfernen |
| **moderation** | ❌ **Deaktiviert** | Bannen/Kicken/Timeout |

#### Bestimmte Aktionen deaktivieren

```json5
{
  channels: {
    discord: {
      actions: {
        channels: false,      // Kanalverwaltung deaktivieren
        moderation: false,   // Moderationsaktionen deaktivieren
        roles: false         // Rollenverwaltung deaktivieren
      }
    }
  }
}
```

::: danger Sicherheitswarnung
Wenn du die Aktionen ``moderation`` und ``roles`` aktivierst, stelle sicher, dass die KI strenge Prompts und Zugriffskontrolle hat, um versehentliches Bannen von Benutzern zu vermeiden.
:::

### Andere Konfigurationsoptionen

| Konfigurationsoption | Beschreibung | Standardwert |
|--- | --- | ---|
| ``historyLimit`` | Anzahl der Historiennachrichten im Serverkanal-Kontext | 20 |
| ``dmHistoryLimit`` | Anzahl der Historiennachrichten in DM-Sitzungen | Unbegrenzt |
| ``textChunkLimit`` | Maximale Zeichenanzahl pro Nachricht | 2000 |
| ``maxLinesPerMessage`` | Maximale Zeilenanzahl pro Nachricht | 17 |
| ``mediaMaxMb`` | Maximale Größe hochgeladener Mediendateien (MB) | 8 |
| ``chunkMode`` | Nachrichtenaufteilungsmodus (``length``/``newline``) | ``length`` |

---

## Häufige Fehler

### ❌ Fehler "Used disallowed intents"

**Ursache**: **Message Content Intent** nicht aktiviert.

**Lösung**:
1. Gehe zurück zum Discord Developer Portal
2. Bot → Privileged Gateway Intents
3. Aktiviere **Message Content Intent**
4. Starte das Gateway neu

### ❌ Bot verbunden, aber antwortet nicht

**Mögliche Ursachen**:
1. **Message Content Intent** fehlt
2. Bot hat keine Kanalberechtigungen
3. Konfiguration erfordert @Erwähnung, du hast aber nicht erwähnt
4. Kanal nicht in der Whitelist

**Lösungsschritte**:
```bash
# Diagnosetool ausführen
clawdbot doctor

# Kanalstatus und Berechtigungen überprüfen
clawdbot channels status --probe
```

### ❌ DM-Pairing-Code abgelaufen

**Ursache**: Pairing-Code hat eine Gültigkeit von **1 Stunde**.

**Lösung**: Lass den Benutzer eine neue DM senden, um einen neuen Pairing-Code zu erhalten, dann genehmigen.

### ❌ Gruppen-DMs werden ignoriert

**Ursache**: Standardmäßig ``dm.groupEnabled: false``.

**Lösung**:

```json5
{
  channels: {
    discord: {
      dm: {
        groupEnabled: true,
        groupChannels: ["clawd-dm"]  // Optional: Nur bestimmte Gruppen-DMs zulassen
      }
    }
  }
}
```

---

## Fehlerbehebung

### Häufige Probleme diagnostizieren

```bash
# 1. Überprüfe, ob Gateway läuft
clawdbot gateway status

# 2. Überprüfe Kanalverbindungsstatus
clawdbot channels status

# 3. Vollständige Diagnose ausführen (empfohlen!)
clawdbot doctor
```

### Debugging mit Logs

Verwende beim Start des Gateway ``--verbose``, um detaillierte Protokolle anzuzeigen:

```bash
clawdbot gateway --port 18789 --verbose
```

**Achte auf diese Logs**:
- ``Discord channel connected: ...`` → Verbindung erfolgreich
- ``Message received from ...`` → Nachricht empfangen
- ``ERROR: ...`` → Fehlerinformation

---

## Zusammenfassung

- Der Discord-Kanal verbindet über **discord.js** und unterstützt DMs und Serverkanäle
- Die Erstellung eines Bots erfordert vier Schritte: **Anwendung, Bot-Benutzer, Gateway Intents, Einladungs-URL**
- **Message Content Intent** ist erforderlich, sonst kann der Bot keine Nachrichten lesen
- Standardmäßig ist **DM-Pairing-Schutz** aktiviert, Fremde müssen paired werden, um chatten zu können
- Serverkanäle können über ``guilds.<id>.channels`` mit Whitelist und Verhalten konfiguriert werden
- Die KI kann Discord-Tools aufrufen, um Verwaltungsaufgaben auszuführen (steuerbar über ``actions``)

---

## Nächster Lektion

> Im nächsten Lektion lernen wir **[Google Chat-Kanal](../googlechat/)**.
>
> Du wirst lernen:
> - Wie man die Google Chat OAuth-Authentifizierung konfiguriert
> - Nachrichtenrouting in Google Chat Spaces
> - Wie man die Einschränkungen der Google Chat API nutzt

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
| Discord Onboarding-Assistent | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 1-485 |
|--- | --- | ---|
| Discord Nachrichtenaktionen | [`src/agents/tools/discord-actions-messaging.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/discord-actions-messaging.ts) | - |
| Discord Serveraktionen | [`src/agents/tools/discord-actions-guild.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/discord-actions-guild.ts) | - |
| Discord Offizielle Dokumentation | [`docs/channels/discord.md`](https://github.com/moltbot/moltbot/blob/main/docs/channels/discord.md) | 1-400 |

**Wichtige Schema-Felder**:
- ``DiscordAccountSchema``: Discord-Kontokonfiguration (token, guilds, dm, actions usw.)
- ``DiscordDmSchema``: DM-Konfiguration (enabled, policy, allowFrom, groupEnabled)
- ``DiscordGuildSchema``: Serverkonfiguration (slug, requireMention, reactionNotifications, channels)
- ``DiscordGuildChannelSchema``: Kanalkonfiguration (allow, requireMention, skills, systemPrompt)

**Wichtige Funktionen**:
- ``handleDiscordAction()``: Einstiegspunkt für die Verarbeitung von Discord-Tool-Aktionen
- ``discordOnboardingAdapter.configure()``: Assistentgesteuerter Konfigurationsprozess

</details>
