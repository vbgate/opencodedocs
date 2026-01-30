---
title: "Gateway WebSocket API Protokoll Komplettleitfaden | Clawdbot Tutorial"
sidebarTitle: "Entwicklung benutzerdefinierter Clients"
subtitle: "Gateway WebSocket API Protokoll Komplettleitfaden"
description: "Lernen Sie die vollständige Spezifikation des Clawdbot Gateway WebSocket Protokolls, einschließlich Verbindungs-Handshake, Nachrichtenrahmenformat, Anfrage/Antwort-Modell, Ereignis-Push, Berechtigungssystem und alle verfügbaren Methoden. Dieses Tutorial bietet eine vollständige API-Referenz und Client-Integrationsbeispiele, um Ihnen bei der schnellen Implementierung der benutzerdefinierten Client-Integration mit Gateway zu helfen."
tags:
  - "API"
  - "WebSocket"
  - "Protokoll"
  - "Entwickler"
prerequisite:
  - "start-gateway-startup"
  - "advanced-session-management"
order: 350
---

# Gateway WebSocket API Protokoll Komplettleitfaden

## Was Sie nach diesem Lernen können

- 📡 Erfolgreiche Verbindung zum Gateway WebSocket Server herstellen
- 🔄 Anfragen senden und Antworten verarbeiten
- 📡 Server-Push-Ereignisse empfangen
- 🔐 Das Berechtigungssystem verstehen und authentifizieren
- 🛠️ Alle verfügbaren Gateway-Methoden aufrufen
- 📖 Das Nachrichtenrahmenformat und die Fehlerbehandlung verstehen

## Ihre aktuelle Situation

Möglicherweise entwickeln Sie einen benutzerdefinierten Client (wie eine mobile App, Webanwendung oder Kommandozeilen-Tool), der mit Clawdbot Gateway kommunizieren muss. Das WebSocket-Protokoll von Gateway scheint komplex zu sein, und Sie müssen:

- Verstehen, wie man eine Verbindung herstellt und authentifiziert
- Das Anfrage-/Antwort-Nachrichtenformat verstehen
- Die verfügbaren Methoden und ihre Parameter kennen
- Server-Push-Ereignisse verarbeiten
- Das Berechtigungssystem verstehen

**Gute Nachrichten**: Das Gateway WebSocket API-Protokoll ist klar strukturiert, und dieses Tutorial bietet Ihnen einen vollständigen Referenzleitfaden.

## Wann diese Methode verwenden

::: info Anwendungsszenarien
Verwenden Sie dieses Protokoll, wenn Sie:
- Einen benutzerdefinierten Client für die Gateway-Verbindung entwickeln
- WebChat oder eine mobile App implementieren
- Überwachungs- oder Verwaltungstools erstellen
- Gateway in bestehende Systeme integrieren
- Gateway-Funktionen debuggen und testen
:::

## Kernkonzept

Clawdbot Gateway verwendet das WebSocket-Protokoll für Echtzeit-Zweiwege-Kommunikation. Das Protokoll basiert auf JSON-formatierten Nachrichtenrahmen und unterteilt sich in drei Typen:

1. **Anfragerahmen (Request Frame)**: Client sendet Anfrage
2. **Antwortrahmen (Response Frame)**: Server gibt Antwort zurück
3. **Ereignisrahmen (Event Frame)**: Server pusht Ereignis aktiv

::: tip Design-Philosophie
Das Protokoll verwendet das "Anfrage-Antwort"-Modell + "Ereignis-Push"-Modus:
- Client initiiert Anfrage aktiv, Server gibt Antwort zurück
- Server kann Ereignis aktiv pushen, ohne Client-Anfrage
- Alle Operationen laufen über dieselbe WebSocket-Verbindung
:::

## Verbindungs-Handshake

### Schritt 1: WebSocket-Verbindung herstellen

Gateway lauscht standardmäßig auf `ws://127.0.0.1:18789` (kann über Konfiguration geändert werden).

::: code-group

```javascript [JavaScript]
// WebSocket-Verbindung herstellen
const ws = new WebSocket('ws://127.0.0.1:18789/v1/connect');

ws.onopen = () => {
  console.log('WebSocket verbunden');
};
```

```python [Python]
import asyncio
import websockets

async def connect():
    uri = "ws://127.0.0.1:18789/v1/connect"
    async with websockets.connect(uri) as websocket:
        print("WebSocket verbunden")
```

```bash [Bash]
# Verbindung mit wscat-Tool testen
wscat -c ws://127.0.0.1:18789/v1/connect
```

:::

### Schritt 2: Handshake-Nachricht senden

Nach Verbindungsaufbau muss der Client eine Handshake-Nachricht senden, um Authentifizierung und Versionsverhandlung abzuschließen.

```json
{
  "minProtocol": 1,
  "maxProtocol": 3,
  "client": {
    "id": "my-app-v1",
    "displayName": "Mein benutzerdefinierter Client",
    "version": "1.0.0",
    "platform": "web",
    "mode": "operator",
    "instanceId": "eindeutige-instanz-id"
  },
  "caps": [],
  "commands": [],
  "auth": {
    "token": "ihr-token-hier"
  }
}
```

**Warum**: Die Handshake-Nachricht teilt dem Server mit:
- Welche Protokollversionsbereiche der Client unterstützt
- Grundlegende Informationen über den Client
- Authentifizierungsanmeldedaten (Token oder Passwort)

**Sie sollten sehen**: Server gibt `hello-ok` Nachricht zurück

```json
{
  "type": "hello-ok",
  "protocol": 3,
  "server": {
    "version": "v2026.1.24",
    "commit": "abc123",
    "host": "my-mac",
    "connId": "conn-123456"
  },
  "features": {
    "methods": ["agent", "send", "chat.send", ...],
    "events": ["agent.event", "chat.event", ...]
  },
  "snapshot": {
    "presence": [...],
    "health": {...},
    "stateVersion": {...},
    "uptimeMs": 12345678
  },
  "auth": {
    "deviceToken": "device-token-here",
    "role": "operator",
    "scopes": ["operator.read", "operator.write"]
  },
  "policy": {
    "maxPayload": 1048576,
    "maxBufferedBytes": 10485760,
    "tickIntervalMs": 30000
  }
}
```

::: info Hello-Ok Feld-Beschreibungen
- `protocol`: Vom Server verwendete Protokollversion
- `server.version`: Gateway-Versionsnummer
- `features.methods`: Liste aller verfügbaren Methoden
- `features.events`: Liste aller abonnierbaren Ereignisse
- `snapshot`: Aktueller Zustandsschnappschuss
- `auth.scopes`: Dem Client gewährte Berechtigungsbereiche
- `policy.maxPayload`: Maximale Größe einer einzelnen Nachricht
- `policy.tickIntervalMs`: Heartbeat-Intervall
:::

### Schritt 3: Verbindungsstatus überprüfen

Nach erfolgreichem Handshake können Sie einen Gesundheitscheck senden, um die Verbindung zu überprüfen:

```json
{
  "type": "req",
  "id": "req-1",
  "method": "health",
  "params": {}
}
```

**Sie sollten sehen**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "status": "ok",
    "uptimeMs": 12345678
  }
}
```

## Nachrichtenrahmenformat

### Anfragerahmen (Request Frame)

Alle vom Client gesendeten Anfragen folgen dem Anfragerahmenformat:

```json
{
  "type": "req",
  "id": "eindeutige-anfrage-id",
  "method": "methoden.name",
  "params": {
    // Methodenparameter
  }
}
```

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `type` | string | Ja | Fester Wert `"req"` |
| `id` | string | Ja | Eindeutige Anfrage-ID für die Antwortzuordnung |
| `method` | string | Ja | Methodenname, z.B. `"agent"`, `"send"` |
| `params` | object | Nein | Methodenparameter, Format abhängig von der Methode |

::: warning Wichtigkeit der Anfrage-ID
Jede Anfrage muss eine eindeutige `id` haben. Der Server verwendet `id`, um Antworten mit Anfragen zu verknüpfen. Wenn mehrere Anfragen dieselbe `id` verwenden, können Antworten nicht korrekt zugeordnet werden.
:::

### Antwortrahmen (Response Frame)

Der Server gibt für jede Anfrage einen Antwortrahmen zurück:

```json
{
  "type": "res",
  "id": "eindeutige-anfrage-id",
  "ok": true,
  "payload": {
    // Antwortdaten
  },
  "error": {
    // Fehlerinformationen (nur wenn ok=false)
  }
}
```

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `type` | string | Ja | Fester Wert `"res"` |
| `id` | string | Ja | Entsprechende Anfrage-ID |
| `ok` | boolean | Ja | Ob die Anfrage erfolgreich war |
| `payload` | any | Nein | Antwortdaten bei Erfolg |
| `error` | object | Nein | Fehlerinformationen bei Misserfolg |

**Erfolgreiche Antwort-Beispiel**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "agents": [
      { "id": "agent-1", "name": "Standard Agent" }
    ]
  }
}
```

**Fehlgeschlagene Antwort-Beispiel**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Fehlender erforderlicher Parameter: message",
    "retryable": false
  }
}
```

### Ereignisrahmen (Event Frame)

Der Server kann Ereignisse aktiv pushen, ohne Client-Anfrage:

```json
{
  "type": "event",
  "event": "ereignis.name",
  "payload": {
    // Ereignisdaten
  },
  "seq": 123,
  "stateVersion": {
    "presence": 456,
    "health": 789
  }
}
```

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `type` | string | Ja | Fester Wert `"event"` |
| `event` | string | Ja | Ereignisname |
| `payload` | any | Nein | Ereignisdaten |
| `seq` | number | Nein | Ereignis-Sequenznummer |
| `stateVersion` | object | Nein | Zustandsversionsnummer |

**Häufige Ereignisbeispiele**:

```json
// Heartbeat-Ereignis
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}

// Agent-Ereignis
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Denkt nach..."
    }
  }
}

// Chat-Ereignis
{
  "type": "event",
  "event": "chat.event",
  "payload": {
    "runId": "run-123",
    "sessionKey": "main",
    "seq": 1,
    "state": "delta",
    "message": {
      "role": "assistant",
      "content": "Hallo!"
    }
  }
}

// Herunterfahren-Ereignis
{
  "type": "event",
  "event": "shutdown",
  "payload": {
    "reason": "Systemneustart",
    "restartExpectedMs": 5000
  }
}
```

## Authentifizierung und Berechtigungen

### Authentifizierungsmethoden

Gateway unterstützt drei Authentifizierungsmethoden:

#### 1. Token-Authentifizierung (empfohlen)

Token in der Handshake-Nachricht bereitstellen:

```json
{
  "auth": {
    "token": "your-security-token"
  }
}
```

Token wird in der Konfigurationsdatei definiert:

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secret-token-here"
    }
  }
}
```

#### 2. Passwort-Authentifizierung

```json
{
  "auth": {
    "password": "your-password"
  }
}
```

Passwort wird in der Konfigurationsdatei definiert:

```json
{
  "gateway": {
    "auth": {
      "mode": "password",
      "password": "your-password-here"
    }
  }
}
```

#### 3. Tailscale Identity (Netzwerk-Authentifizierung)

Bei Verwendung von Tailscale Serve/Funnel kann über Tailscale Identity authentifiziert werden:

```json
{
  "client": {
    "mode": "operator"
  },
  "device": {
    "id": "device-id",
    "publicKey": "public-key",
    "signature": "signature",
    "signedAt": 1706707200000
  }
}
```

### Berechtigungsbereiche (Scopes)

Der Client erhält nach dem Handshake eine Reihe von Berechtigungsbereichen, die bestimmen, welche Methoden er aufrufen kann:

| Bereich | Berechtigung | Verfügbare Methoden |
| --- | --- | --- |
| `operator.admin` | Administrator | Alle Methoden, einschließlich Konfigurationsänderung, Wizard, Updates usw. |
| `operator.write` | Schreiben | Nachrichten senden, Agent aufrufen, Sitzungen ändern usw. |
| `operator.read` | Lesen | Status, Logs, Konfiguration abfragen usw. |
| `operator.approvals` | Genehmigung | Exec-Genehmigungs-bezogene Methoden |
| `operator.pairing` | Kopplung | Knoten- und Gerätekopplungs-bezogene Methoden |

::: info Berechtigungsprüfung
Der Server prüft bei jeder Anfrage die Berechtigungen. Wenn dem Client die erforderlichen Berechtigungen fehlen, wird die Anfrage abgelehnt:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "fehlender Bereich: operator.admin"
  }
}
```
:::

### Rollensystem

Zusätzlich zu den Bereichen unterstützt das Protokoll ein Rollensystem:

| Rolle | Beschreibung | Spezielle Berechtigungen |
| --- | --- | --- |
| `operator` | Operator | Kann alle Operator-Methoden aufrufen |
| `node` | Geräteknoten | Kann nur Node-spezifische Methoden aufrufen |
| `device` | Gerät | Kann gerätebezogene Methoden aufrufen |

Die Knotenrolle wird bei der Gerätekopplung automatisch zugewiesen und dient der Kommunikation zwischen Geräteknoten und Gateway.

## Kernmethodenreferenz

### Agent-Methoden

#### `agent` - Nachricht an Agent senden

Sendet eine Nachricht an den AI-Agenten und erhält Streaming-Antwort.

```json
{
  "type": "req",
  "id": "req-1",
  "method": "agent",
  "params": {
    "message": "Hallo, bitte schreibe ein Hello World",
    "agentId": "default",
    "sessionId": "main",
    "idempotencyKey": "msg-123"
  }
}
```

**Parameterbeschreibung**:

| Parameter | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `message` | string | Ja | Benutzernachrichteninhalt |
| `agentId` | string | Nein | Agent ID, standardmäßig konfigurierter Standard-Agent |
| `sessionId` | string | Nein | Sitzungs-ID |
| `sessionKey` | string | Nein | Sitzungsschlüssel |
| `to` | string | Nein | Sende-Ziel (Kanal) |
| `channel` | string | Nein | Kanalname |
| `accountId` | string | Nein | Konto-ID |
| `thinking` | string | Nein | Denkinhalt |
| `deliver` | boolean | Nein | Ob an Kanal gesendet wird |
| `attachments` | array | Nein | Anhängeliste |
| `timeout` | number | Nein | Zeitlimit (Millisekunden) |
| `lane` | string | Nein | Dispatch-Kanal |
| `extraSystemPrompt` | string | Nein | Zusätzliche System-Prompt |
| `idempotencyKey` | string | Ja | Idempotenz-Schlüssel zur Vermeidung von Duplikaten |

**Antwort**:

Agent-Antworten werden über Ereignisrahmen gestreamt:

```json
// thinking Ereignis
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Denkt nach..."
    }
  }
}

// message Ereignis
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 1,
    "stream": "message",
    "ts": 1706707200000,
    "data": {
      "role": "assistant",
      "content": "Hallo! Das ist ein Hello World..."
    }
  }
}
```

#### `agent.wait` - Warte auf Agent-Abschluss

Wartet auf den Abschluss der Agent-Aufgabe.

```json
{
  "type": "req",
  "id": "req-2",
  "method": "agent.wait",
  "params": {
    "runId": "run-123",
    "timeoutMs": 30000
  }
}
```

### Send-Methoden

#### `send` - Nachricht an Kanal senden

Sendet eine Nachricht an den angegebenen Kanal.

```json
{
  "type": "req",
  "id": "req-3",
  "method": "send",
  "params": {
    "to": "+1234567890",
    "message": "Hallo von Clawdbot!",
    "channel": "whatsapp",
    "idempotencyKey": "send-123"
  }
}
```

**Parameterbeschreibung**:

| Parameter | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `to` | string | Ja | Empfänger-Identifikation (Telefonnummer, Benutzer-ID usw.) |
| `message` | string | Ja | Nachrichteninhalt |
| `mediaUrl` | string | Nein | Medien-URL |
| `mediaUrls` | array | Nein | Medien-URL-Liste |
| `channel` | string | Nein | Kanalname |
| `accountId` | string | Nein | Konto-ID |
| `sessionKey` | string | Nein | Sitzungsschlüssel (für gespiegelte Ausgabe) |
| `idempotencyKey` | string | Ja | Idempotenz-Schlüssel |

### Poll-Methoden

#### `poll` - Abstimmung erstellen

Erstellt eine Abstimmung und sendet sie an den Kanal.

\`\`\`json
{
  "type": "req",
  "id": "req-4",
  "method": "poll",
  "params": {
    "to": "+1234567890",
    "question": "Was ist deine bevorzugte Programmiersprache?",
    "options": ["Python", "JavaScript", "Go", "Rust"],
    "maxSelections": 1,
    "durationHours": 24,
    "channel": "telegram",
    "idempotencyKey": "poll-123"
  }
}
\`\`\`

### Sessions-Methoden

#### `sessions.list` - Sitzungen auflisten

Listet alle aktiven Sitzungen auf.

\`\`\`json
{
  "type": "req",
  "id": "req-5",
  "method": "sessions.list",
  "params": {
    "limit": 50,
    "activeMinutes": 60,
    "includeDerivedTitles": true,
    "includeLastMessage": true
  }
}
\`\`\`

**Parameterbeschreibung**:

| Parameter | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `limit` | number | Nein | Maximale Anzahl der zurückgegebenen Einträge |
| `activeMinutes` | number | Nein | Filter für kürzlich aktive Sitzungen (Minuten) |
| `includeGlobal` | boolean | Nein | Globale Sitzungen einschließen |
| `includeUnknown` | boolean | Nein | Unbekannte Sitzungen einschließen |
| `includeDerivedTitles` | boolean | Nein | Titel aus erster Nachricht ableiten |
| `includeLastMessage` | boolean | Nein | Letzte Nachrichtenvorschau einschließen |
| `label` | string | Nein | Nach Label filtern |
| `agentId` | string | Nein | Nach Agent-ID filtern |
| `search` | string | Nein | Suchbegriff |


#### `sessions.patch` - Sitzungskonfiguration ändern

Ändert die Konfigurationsparameter einer Sitzung.

\`\`\`json
{
  "type": "req",
  "id": "req-6",
  "method": "sessions.patch",
  "params": {
    "key": "main",
    "label": "Hauptsitzung",
    "thinkingLevel": "minimal",
    "responseUsage": "tokens",
    "model": "claude-sonnet-4-20250514"
  }
}
\`\`\`

#### `sessions.reset` - Sitzung zurücksetzen

Leert den Sitzungsverlauf.

\`\`\`json
{
  "type": "req",
  "id": "req-7",
  "method": "sessions.reset",
  "params": {
    "key": "main"
  }
}
\`\`\`

#### `sessions.delete` - Sitzung löschen

Löscht die Sitzung und ihren Verlauf.

\`\`\`json
{
  "type": "req",
  "id": "req-8",
  "method": "sessions.delete",
  "params": {
    "key": "session-123",
    "deleteTranscript": true
  }
}
\`\`\`

#### `sessions.compact` - Sitzungsverlauf komprimieren

Komprimiert den Sitzungsverlauf, um die Kontextgröße zu reduzieren.

\`\`\`json
{
  "type": "req",
  "id": "req-9",
  "method": "sessions.compact",
  "params": {
    "key": "main",
    "maxLines": 100
  }
}
\`\`\`

### Config-Methoden

#### `config.get` - Konfiguration abrufen

Ruft die aktuelle Konfiguration ab.

\`\`\`json
{
  "type": "req",
  "id": "req-10",
  "method": "config.get",
  "params": {}
}
\`\`\`

#### `config.set` - Konfiguration setzen

Setzt eine neue Konfiguration.

\`\`\`json
{
  "type": "req",
  "id": "req-11",
  "method": "config.set",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash"
  }
}
\`\`\`

#### `config.apply` - Konfiguration anwenden und neu starten

Wendet die Konfiguration an und startet Gateway neu.

\`\`\`json
{
  "type": "req",
  "id": "req-12",
  "method": "config.apply",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash",
    "restartDelayMs": 1000
  }
}
\`\`\`

#### `config.schema` - Konfigurationsschema abrufen

Ruft die Schema-Definition der Konfiguration ab.

\`\`\`json
{
  "type": "req",
  "id": "req-13",
  "method": "config.schema",
  "params": {}
}
\`\`\`


### Channels-Methoden

#### `channels.status` - Kanalstatus abrufen

Ruft den Status aller Kanäle ab.

\`\`\`json
{
  "type": "req",
  "id": "req-14",
  "method": "channels.status",
  "params": {
    "probe": true,
    "timeoutMs": 5000
  }
}
\`\`\`

**Antwortbeispiel**:

\`\`\`json
{
  "type": "res",
  "id": "req-14",
  "ok": true,
  "payload": {
    "ts": 1706707200000,
    "channelOrder": ["whatsapp", "telegram", "slack"],
    "channelLabels": {
      "whatsapp": "WhatsApp",
      "telegram": "Telegram",
      "slack": "Slack"
    },
    "channelAccounts": {
      "whatsapp": [
        {
          "accountId": "wa-123",
          "enabled": true,
          "linked": true,
          "connected": true,
          "lastConnectedAt": 1706707200000
        }
      ]
    }
  }
}
\`\`\`

#### `channels.logout` - Aus Kanal abmelden

Meldet sich vom angegebenen Kanal ab.

\`\`\`json
{
  "type": "req",
  "id": "req-15",
  "method": "channels.logout",
  "params": {
    "channel": "whatsapp",
    "accountId": "wa-123"
  }
}
\`\`\`

### Models-Methoden

#### `models.list` - Verfügbare Modelle auflisten

Listet alle verfügbaren AI-Modelle auf.

\`\`\`json
{
  "type": "req",
  "id": "req-16",
  "method": "models.list",
  "params": {}
}
\`\`\`

**Antwortbeispiel**:

\`\`\`json
{
  "type": "res",
  "id": "req-16",
  "ok": true,
  "payload": {
    "models": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "provider": "anthropic",
        "contextWindow": 200000,
        "reasoning": true
      },
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "provider": "openai",
        "contextWindow": 128000,
        "reasoning": false
      }
    ]
  }
}
\`\`\`

### Agents-Methoden

#### `agents.list` - Alle Agents auflisten

Listet alle verfügbaren Agents auf.

\`\`\`json
{
  "type": "req",
  "id": "req-17",
  "method": "agents.list",
  "params": {}
}
\`\`\`

**Antwortbeispiel**:

\`\`\`json
{
  "type": "res",
  "id": "req-17",
  "ok": true,
  "payload": {
    "defaultId": "default",
    "mainKey": "main",
    "scope": "per-sender",
    "agents": [
      {
        "id": "default",
        "name": "Default Agent",
        "identity": {
          "name": "Clawdbot",
          "theme": "default",
          "emoji": "🤖"
        }
      }
    ]
  }
}
\`\`\`


### Cron-Methoden

#### `cron.list` - Geplante Aufgaben auflisten

Listet alle geplanten Aufgaben auf.

\`\`\`json
{
  "type": "req",
  "id": "req-18",
  "method": "cron.list",
  "params": {
    "includeDisabled": true
  }
}
\`\`\`

#### `cron.add` - Geplante Aufgabe hinzufügen

Fügt eine neue geplante Aufgabe hinzu.

\`\`\`json
{
  "type": "req",
  "id": "req-19",
  "method": "cron.add",
  "params": {
    "name": "Täglicher Bericht",
    "description": "Täglichen Bericht jeden Morgen um 8 Uhr generieren",
    "enabled": true,
    "schedule": {
      "kind": "cron",
      "expr": "0 8 * * *",
      "tz": "Europe/Berlin"
    },
    "sessionTarget": "main",
    "wakeMode": "now",
    "payload": {
      "kind": "agentTurn",
      "message": "Bitte generiere den heutigen Arbeitsbericht",
      "channel": "last"
    }
  }
}
\`\`\`

#### `cron.run` - Geplante Aufgabe manuell ausführen

Führt die angegebene geplante Aufgabe manuell aus.

\`\`\`json
{
  "type": "req",
  "id": "req-20",
  "method": "cron.run",
  "params": {
    "id": "cron-123",
    "mode": "force"
  }
}
\`\`\`

### Nodes-Methoden

#### `nodes.list` - Alle Knoten auflisten

Listet alle gekoppelten Geräteknoten auf.

\`\`\`json
{
  "type": "req",
  "id": "req-21",
  "method": "nodes.list",
  "params": {}
}
\`\`\`

#### `nodes.describe` - Knotendetails abrufen

Ruft detaillierte Informationen zum angegebenen Knoten ab.

\`\`\`json
{
  "type": "req",
  "id": "req-22",
  "method": "nodes.describe",
  "params": {
    "nodeId": "ios-node-123"
  }
}
\`\`\`

#### `nodes.invoke` - Knotenbefehl aufrufen

Führt einen Befehl auf dem Knoten aus.

\`\`\`json
{
  "type": "req",
  "id": "req-23",
  "method": "nodes.invoke",
  "params": {
    "nodeId": "ios-node-123",
    "command": "camera.snap",
    "params": {
      "quality": "high"
    },
    "timeoutMs": 10000,
    "idempotencyKey": "invoke-123"
  }
}
\`\`\`

#### `nodes.pair.list` - Ausstehende Kopplungsanfragen auflisten

Listet alle wartenden Knotenkopplungsanfragen auf.

\`\`\`json
{
  "type": "req",
  "id": "req-24",
  "method": "nodes.pair.list",
  "params": {}
}
\`\`\`

#### `nodes.pair.approve` - Knotenkopplung genehmigen

Genehmigt die Knotenkopplungsanfrage.

\`\`\`json
{
  "type": "req",
  "id": "req-25",
  "method": "nodes.pair.approve",
  "params": {
    "requestId": "pair-req-123"
  }
}
\`\`\`

#### `nodes.pair.reject` - Knotenkopplung ablehnen

Lehnt die Knotenkopplungsanfrage ab.

\`\`\`json
{
  "type": "req",
  "id": "req-26",
  "method": "nodes.pair.reject",
  "params": {
    "requestId": "pair-req-123"
  }
}
\`\`\`

#### `nodes.rename` - Knoten umbenennen

Benennt den Knoten um.

\`\`\`json
{
  "type": "req",
  "id": "req-27",
  "method": "nodes.rename",
  "params": {
    "nodeId": "ios-node-123",
    "displayName": "Mein iPhone"
  }
}
\`\`\`

### Logs-Methoden

#### `logs.tail` - Logs abrufen

Ruft Gateway-Logs ab.

\`\`\`json
{
  "type": "req",
  "id": "req-28",
  "method": "logs.tail",
  "params": {
    "cursor": 0,
    "limit": 100,
    "maxBytes": 100000
  }
}
\`\`\`

**Antwortbeispiel**:

\`\`\`json
{
  "type": "res",
  "id": "req-28",
  "ok": true,
  "payload": {
    "file": "/path/to/gateway.log",
    "cursor": 123456,
    "size": 4567890,
    "lines": [
      "[2025-01-27 10:00:00] INFO: Starting Gateway...",
      "[2025-01-27 10:00:01] INFO: Connected to WhatsApp"
    ],
    "truncated": false
  }
}
\`\`\`

### Skills-Methoden

#### `skills.status` - Skill-Status abrufen

Ruft den Status aller Skills ab.

\`\`\`json
{
  "type": "req",
  "id": "req-29",
  "method": "skills.status",
  "params": {}
}
\`\`\`

#### `skills.bins` - Skill-Bibliotheken auflisten

Listet verfügbare Skill-Bibliotheken auf.

\`\`\`json
{
  "type": "req",
  "id": "req-30",
  "method": "skills.bins",
  "params": {}
}
\`\`\`

#### `skills.install` - Skill installieren

Installiert den angegebenen Skill.

\`\`\`json
{
  "type": "req",
  "id": "req-31",
  "method": "skills.install",
  "params": {
    "name": "my-custom-skill",
    "installId": "install-123",
    "timeoutMs": 60000
  }
}
\`\`\`

### WebChat-Methoden

#### `chat.send` - Chat-Nachricht senden (WebChat)

WebChat-spezifische Chat-Methode.

\`\`\`json
{
  "type": "req",
  "id": "req-32",
  "method": "chat.send",
  "params": {
    "sessionKey": "main",
    "message": "Hallo von WebChat!",
    "thinking": "Antworte...",
    "deliver": true,
    "idempotencyKey": "chat-123"
  }
}
\`\`\`

#### `chat.history` - Chat-Verlauf abrufen

Ruft den Nachrichtenverlauf der angegebenen Sitzung ab.

\`\`\`json
{
  "type": "req",
  "id": "req-33",
  "method": "chat.history",
  "params": {
    "sessionKey": "main",
    "limit": 50
  }
}
\`\`\`

#### `chat.abort` - Chat abbrechen

Bricht den laufenden Chat ab.

\`\`\`json
{
  "type": "req",
  "id": "req-34",
  "method": "chat.abort",
  "params": {
    "sessionKey": "main",
    "runId": "run-123"
  }
}
\`\`\`

### Wizard-Methoden

#### `wizard.start` - Assistenten starten

Startet den Konfigurationsassistenten.

\`\`\`json
{
  "type": "req",
  "id": "req-35",
  "method": "wizard.start",
  "params": {}
}
\`\`\`

#### `wizard.next` - Assistenten nächster Schritt

Führt den nächsten Schritt des Assistenten aus.

\`\`\`json
{
  "type": "req",
  "id": "req-36",
  "method": "wizard.next",
  "params": {
    "stepId": "step-1",
    "response": {
      "selectedOption": "option-1"
    }
  }
}
\`\`\`

#### `wizard.cancel` - Assistenten abbrechen

Bricht den laufenden Assistenten ab.

\`\`\`json
{
  "type": "req",
  "id": "req-37",
  "method": "wizard.cancel",
  "params": {}
}
\`\`\`

### System-Methoden

#### `status` - Systemstatus abrufen

Ruft den Gateway-Systemstatus ab.

\`\`\`json
{
  "type": "req",
  "id": "req-38",
  "method": "status",
  "params": {}
}
\`\`\`

#### `last-heartbeat` - Letzte Heartbeat-Zeit abrufen

Ruft die Zeit des letzten Gateway-Heartbeats ab.

\`\`\`json
{
  "type": "req",
  "id": "req-39",
  "method": "last-heartbeat",
  "params": {}
}
\`\`\`

### Usage-Methoden

#### `usage.status` - Nutzungsstatistik abrufen

Ruft die Token-Nutzungsstatistik ab.

\`\`\`json
{
  "type": "req",
  "id": "req-40",
  "method": "usage.status",
  "params": {}
}
\`\`\`

#### `usage.cost` - Kostenstatistik abrufen

Ruft die API-Aufrufkostenstatistik ab.

\`\`\`json
{
  "type": "req",
  "id": "req-41",
  "method": "usage.cost",
  "params": {}
}
\`\`\`


## Fehlerbehandlung

### Fehlercodes

Alle Fehlerantworten enthalten Fehlercode und Beschreibung:

| Fehlercode | Beschreibung | Wiederholbar |
| --- | --- | --- |
| `NOT_LINKED` | Knoten nicht verknüpft | Ja |
| `NOT_PAIRED` | Knoten nicht gekoppelt | Nein |
| `AGENT_TIMEOUT` | Agent-Timeout | Ja |
| `INVALID_REQUEST` | Ungültige Anfrage | Nein |
| `UNAVAILABLE` | Dienst nicht verfügbar | Ja |

### Fehlerantwortformat

\`\`\`json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "AGENT_TIMEOUT",
    "message": "Agent-Antwort-Timeout",
    "retryable": true,
    "retryAfterMs": 5000
  }
}
\`\`\`

### Fehlerbehandlungsempfehlungen

1. **Prüfe das Feld `retryable`**: Wenn es `true` ist, kann nach einer Verzögerung von `retryAfterMs` wiederholt werden
2. **Protokolliere Fehlerdetails**: Protokolliere `code` und `message` zum Debuggen
3. **Validiere Parameter**: `INVALID_REQUEST` bedeutet normalerweise einen Parameter-Validierungsfehler
4. **Prüfe den Verbindungsstatus**: `NOT_LINKED` bedeutet, dass die Verbindung getrennt wurde und eine Neuverbindung erforderlich ist

## Heartbeat-Mechanismus

Gateway sendet regelmäßig Heartbeat-Ereignisse:

\`\`\`json
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}
\`\`\`

::: tip Heartbeat-Verarbeitung
Der Client sollte:
1. Auf `tick`-Ereignisse lauschen
2. Die letzte Heartbeat-Zeit aktualisieren
3. Wenn kein Heartbeat innerhalb von `3 * tickIntervalMs` empfangen wurde, eine Neuverbindung in Betracht ziehen
:::

## Vollständiges Beispiel

### JavaScript-Client-Beispiel

\`\`\`javascript
const WebSocket = require('ws');

class GatewayClient {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.on('open', () => {
        // Handshake-Nachricht senden
        this.sendHandshake();
        resolve();
      });

      this.ws.on('message', (data) => {
        this.handleMessage(JSON.parse(data));
      });

      this.ws.on('error', (error) => {
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket getrennt');
      });
    });
  }

  sendHandshake() {
    this.ws.send(JSON.stringify({
      minProtocol: 1,
      maxProtocol: 3,
      client: {
        id: 'my-client',
        displayName: 'Mein Gateway-Client',
        version: '1.0.0',
        platform: 'node',
        mode: 'operator'
      },
      auth: {
        token: this.token
      }
    }));
  }

  async request(method, params = {}) {
    const id = \`req-\${++this.requestId}\`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      this.ws.send(JSON.stringify({
        type: 'req',
        id,
        method,
        params
      }));

      // Timeout setzen
      setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('Anfrage-Timeout'));
      }, 30000);
    });
  }

  handleMessage(message) {
    if (message.type === 'res') {
      const { id, ok, payload, error } = message;
      const pending = this.pendingRequests.get(id);
      
      if (pending) {
        this.pendingRequests.delete(id);
        if (ok) {
          pending.resolve(payload);
        } else {
          pending.reject(new Error(\`\${error.code}: \${error.message}\`));
        }
      }
    } else if (message.type === 'event') {
      this.handleEvent(message);
    }
  }

  handleEvent(event) {
    console.log('Ereignis empfangen:', event.event, event.payload);
  }

  async sendAgentMessage(message) {
    return this.request('agent', {
      message,
      idempotencyKey: \`msg-\${Date.now()}\`
    });
  }

  async listSessions() {
    return this.request('sessions.list', {
      limit: 50,
      includeLastMessage: true
    });
  }

  async getChannelsStatus() {
    return this.request('channels.status', {
      probe: true
    });
  }
}

// Verwendungsbeispiel
(async () => {
  const client = new GatewayClient('ws://127.0.0.1:18789/v1/connect', 'your-token');
  await client.connect();

  // Nachricht an Agent senden
  const response = await client.sendAgentMessage('Hallo!');
  console.log('Agent-Antwort:', response);

  // Sitzungen auflisten
  const sessions = await client.listSessions();
  console.log('Sitzungsliste:', sessions);

  // Kanalstatus abrufen
  const channels = await client.getChannelsStatus();
  console.log('Kanalstatus:', channels);
})();
\`\`\`

## Lektionszusammenfassung

Dieses Tutorial hat das Clawdbot Gateway WebSocket API-Protokoll im Detail behandelt, einschließlich:

- ✅ Verbindungs-Handshake-Fluss und Authentifizierungsmechanismus
- ✅ Drei Nachrichtenrahmentypen (Anfrage, Antwort, Ereignis)
- ✅ Kernmethodenreferenz (Agent, Send, Sessions, Config usw.)
- ✅ Berechtigungssystem und Rollenverwaltung
- ✅ Fehlerbehandlung und Wiederholungsstrategien
- ✅ Heartbeat-Mechanismus und Verbindungsverwaltung
- ✅ Vollständiges JavaScript-Client-Beispiel

## Vorschau auf die nächste Lektion

\> In der nächsten Lektion lernen wir **[Vollständige Konfigurationsreferenz](../config-reference/)**.
\>
\> Du wirst lernen:
\> - Detaillierte Beschreibungen aller Konfigurationselemente
\> - Konfigurationsschema und Standardwerte
\> - Mechanismus zur Umgebungsvariablen-Ersetzung
\> - Konfigurationsvalidierung und Fehlerbehandlung

---

## Anhang: Quellcode-Referenz

\<details\>
\<summary\>\<strong\>Klicken zum Anzeigen der Quellcode-Positionen\</strong\>\</summary\>

\> Aktualisierungszeit: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Protokolleintrag und Validator | \`src/gateway/protocol/index.ts\` | 1-521 |
| Grundlegende Frame-Typ-Definitionen | \`src/gateway/protocol/schema/frames.ts\` | 1-165 |
| Protokollversionsdefinition | \`src/gateway/protocol/schema/protocol-schemas.ts\` | 231 |
| Fehlercode-Definitionen | \`src/gateway/protocol/schema/error-codes.ts\` | 3-24 |
| Agent-bezogene Schema | \`src/gateway/protocol/schema/agent.ts\` | 1-107 |
| Chat/Logs Schema | \`src/gateway/protocol/schema/logs-chat.ts\` | 1-83 |
| Sessions Schema | \`src/gateway/protocol/schema/sessions.ts\` | 1-105 |
| Config Schema | \`src/gateway/protocol/schema/config.ts\` | 1-72 |
| Nodes Schema | \`src/gateway/protocol/schema/nodes.ts\` | 1-103 |
| Cron Schema | \`src/gateway/protocol/schema/cron.ts\` | 1-246 |
| Channels Schema | \`src/gateway/protocol/schema/channels.ts\` | 1-108 |
| Models/Agents/Skills Schema | \`src/gateway/protocol/schema/agents-models-skills.ts\` | 1-86 |
| Anfrage-Handler | \`src/gateway/server-methods.ts\` | 1-200 |
| Berechtigungsvalidierungslogik | \`src/gateway/server-methods.ts\` | 91-144 |
| Zustandsschnappschuss-Definition | \`src/gateway/protocol/schema/snapshot.ts\` | 1-58 |

**Wichtige Konstanten**:
- \`PROTOCOL_VERSION = 3\`: Aktuelle Protokollversion
- \`ErrorCodes\`: Fehlercode-Enumeration (NOT_LINKED, NOT_PAIRED, AGENT_TIMEOUT, INVALID_REQUEST, UNAVAILABLE)

**Wichtige Typen**:
- \`GatewayFrame\`: Gateway-Frame-Union-Typ (RequestFrame | ResponseFrame | EventFrame)
- \`RequestFrame\`: Anfrageframe-Typ
- \`ResponseFrame\`: Antwortframe-Typ
- \`EventFrame\`: Ereignisframe-Typ
- \`HelloOk\`: Erfolgreiche Handshake-Antworttyp
- \`ErrorShape\`: Fehlerform-Typ

\</details\>
