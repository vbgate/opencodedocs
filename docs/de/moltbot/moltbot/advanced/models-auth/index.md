---
title: "AI-Modelle und Authentifizierungskonfiguration: Vollständiger Leitfaden | Clawdbot Tutorial"
sidebarTitle: "Konfigurieren Sie Ihre AI-Konten"
subtitle: "AI-Modelle und Authentifizierungskonfiguration"
description: "Lernen Sie, wie Sie für Clawdbot AI-Modellanbieter (Anthropic, OpenAI, OpenRouter, Ollama usw.) und drei Authentifizierungsmethoden (API Key, OAuth, Token) konfigurieren. Dieses Tutorial umfasst die Verwaltung von Authentifizierungsdateien, Kontorotation, automatische OAuth-Token-Aktualisierung, Modellaliase, Failover- und Fehlerbehebung mit praktischen Konfigurationsbeispielen und CLI-Befehlen."
tags:
  - "advanced"
  - "configuration"
  - "authentication"
  - "models"
prerequisite:
  - "start-getting-started"
order: 190
---

# AI-Modelle und Authentifizierungskonfiguration

## Was Sie nach Abschluss können

- Mehrere AI-Modellanbieter konfigurieren (Anthropic, OpenAI, OpenRouter usw.)
- Drei Authentifizierungsmethoden verwenden (API Key, OAuth, Token)
- Multi-Konto-Authentifizierung und Authentifizierungsrotation verwalten
- Modellauswahl und Ersatzmodelle konfigurieren
- Häufige Authentifizierungsprobleme beheben

## Ihre aktuelle Herausforderung

Clawdbot unterstützt Dutzende von Modellanbietern, aber die Konfiguration kann verwirrend sein:

- Soll ich API Key oder OAuth verwenden?
- Was sind die Unterschiede bei den Authentifizierungsmethoden der verschiedenen Anbieter?
- Wie konfiguriere ich mehrere Konten?
- Wie werden OAuth-Tokens automatisch aktualisiert?

## Wann Sie diesen Ansatz verwenden sollten

- Erste Konfiguration von AI-Modellen nach der Installation
- Hinzufügen neuer Modellanbieter oder Ersatzkonten
- Auftreten von Authentifizierungsfehlern oder Kontingentbeschränkungen
- Konfiguration von Modellwechsel und Failover-Mechanismus

## 🎒 Vorbereitung vor dem Start

::: warning Voraussetzungen
Dieses Tutorial geht davon aus, dass Sie bereits den [Schnellstart](../../start/getting-started/) abgeschlossen haben und Gateway installiert und gestartet haben.
:::

- Stellen Sie sicher, dass Node ≥22 installiert ist
- Gateway-Daemon läuft
- Bereiten Sie mindestens die Anmeldedaten für einen AI-Modellanbieter vor (API Key oder Abonnementkonto)

## Grundkonzepte

### Modellkonfiguration und Authentifizierung sind getrennt

In Clawdbot sind **Modellauswahl** und **Authentifizierungsanmeldedaten** zwei unabhängige Konzepte:

- **Modellkonfiguration**: Weist Clawdbot an, welches Modell verwendet werden soll (z. B. `anthropic/claude-opus-4-5`), gespeichert in `~/.clawdbot/models.json`
- **Authentifizierungskonfiguration**: Stellt die Anmeldedaten für den Modellzugriff bereit (z. B. API Key oder OAuth-Token), gespeichert in `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`

::: info Warum getrennt?
Dieses Design ermöglicht es Ihnen, flexibel zwischen verschiedenen Anbietern und Konten zu wechseln, ohne Modellparameter wiederholt konfigurieren zu müssen.
:::

### Drei Authentifizierungsmethoden

Clawdbot unterstützt drei Authentifizierungsmethoden für verschiedene Szenarien:

| Authentifizierungsmethode | Speicherformat | Typisches Szenario | Unterstützte Anbieter |
|--- | --- | --- | ---|
| **API Key** | `{ type: "api_key", key: "sk-..." }` | Schneller Start, Tests | Anthropic, OpenAI, OpenRouter, DeepSeek usw. |
| **OAuth** | `{ type: "oauth", access: "...", refresh: "..." }` | Langzeitbetrieb, automatische Aktualisierung | Anthropic (Claude Code CLI), OpenAI (Codex), Qwen Portal |
| **Token** | `{ type: "token", token: "..." }` | Statisches Bearer-Token | GitHub Copilot, einige benutzerdefinierte Proxys |

### Unterstützte Modellanbieter

Clawdbot unterstützt integriert die folgenden Modellanbieter:

::: details Liste integrierter Anbieter
| Anbieter | Authentifizierung | Empfohlene Modelle | Hinweise |
|--- | --- | --- | ---|
| **Anthropic** | API Key / OAuth (Claude Code CLI) | `anthropic/claude-opus-4-5` | Empfehlung: Claude Pro/Max + Opus 4.5 |
| **OpenAI** | API Key / OAuth (Codex) | `openai/gpt-5.2` | Unterstützt Standard-OpenAI und Codex-Versionen |
| **OpenRouter** | API Key | `openrouter/anthropic/claude-sonnet-4-5` | Aggregiert Hunderte von Modellen |
| **Ollama** | HTTP Endpoint | `ollama/<model>` | Lokale Modelle, kein API Key erforderlich |
| **DeepSeek** | API Key | `deepseek/deepseek-r1` | China-freundlich |
| **Qwen Portal** | OAuth | `qwen-portal/<model>` | Qwen OAuth |
| **Venice** | API Key | `venice/<model>` | Datenschutzpriorisiert |
| **Bedrock** | AWS SDK | `amazon-bedrock/<model>` | AWS-gehostete Modelle |
| **Antigravity** | API Key | `google-antigravity/<model>` | Modell-Proxy-Dienst |
:::

::: tip Empfohlene Kombination
Für die meisten Benutzer wird empfohlen, **Anthropic Opus 4.5** als Hauptmodell und **OpenAI GPT-5.2** als Ersatzmodell zu konfigurieren. Opus ist besser in der Langkontext-Verarbeitung und Sicherheit.
:::

## Schritt für Schritt

### Schritt 1: Anthropic konfigurieren (empfohlen)

**Warum**
Anthropic Claude ist das empfohlene Modell für Clawdbot, insbesondere Opus 4.5, das in der Langkontext-Verarbeitung und Sicherheit hervorragende Leistungen erbringt.

**Option A: Anthropic API Key verwenden (am schnellsten)**

```bash
clawdbot onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

**Sie sollten sehen**:
- Gateway lädt Konfiguration neu
- Standardmodell auf `anthropic/claude-opus-4-5` gesetzt
- Authentifizierungsdatei `~/.clawdbot/agents/default/agent/auth-profiles.json` erstellt

**Option B: OAuth verwenden (für Langzeitbetrieb empfohlen)**

OAuth ist für langfristig laufende Gateways geeignet; Tokens werden automatisch aktualisiert.

1. Setup-Token generieren (muss auf einem beliebigen Computer mit Claude Code CLI ausgeführt werden):
```bash
claude setup-token
```

2. Ausgabe des Tokens kopieren

3. Auf Gateway-Host ausführen:
```bash
clawdbot models auth paste-token --provider anthropic
# Token einfügen
```

**Sie sollten sehen**:
- Meldung "Auth profile added: anthropic:claude-cli"
- Authentifizierungstyp ist `oauth` (nicht `api_key`)

::: tip OAuth-Vorteile
OAuth-Tokens werden automatisch aktualisiert, ohne manuelle Aktualisierung. Geeignet für kontinuierlich laufende Gateway-Daemons.
:::

### Schritt 2: OpenAI als Ersatzmodell konfigurieren

**Warum**
Die Konfiguration eines Ersatzmodells ermöglicht automatisches Wechseln, wenn das Hauptmodell (z. B. Anthropic) auf Kontingentbeschränkungen oder Fehler stößt.

```bash
clawdbot onboard --openai-api-key "$OPENAI_API_KEY"
```

Oder OpenAI Codex OAuth verwenden:

```bash
clawdbot onboard --openai-codex
```

**Sie sollten sehen**:
- Neue OpenAI-Anbieterkonfiguration in `~/.clawdbot/clawdbot.json`
- Neue `openai:default` oder `openai-codex:codex-cli`-Konfiguration in Authentifizierungsdatei

### Schritt 3: Modellauswahl und Ersatzmodelle konfigurieren

**Warum**
Modellauswahlstrategien konfigurieren, um Hauptmodell, Ersatzmodelle und Aliase zu definieren.

`~/.clawdbot/clawdbot.json` bearbeiten:

```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-5"
      fallbacks:
        - "openai/gpt-5.2"
        - "openai/gpt-5-mini"
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Feldbeschreibungen**:
- `primary`: Standardmäßig verwendetes Modell
- `fallbacks`: In der Reihenfolge zu versuchende Ersatzmodelle (automatischer Wechsel bei Fehler)
- `alias`: Modellalias (z. B. `/model opus` entspricht `/model anthropic/claude-opus-4-5`)

**Sie sollten sehen**:
- Nach Neustart des Gateways wird das Hauptmodell zu Opus 4.5
- Ersatzmodellkonfiguration wird wirksam

### Schritt 4: OpenRouter hinzufügen (optional)

**Warum**
OpenRouter aggregiert Hunderte von Modellen, geeignet für den Zugriff auf spezielle oder kostenlose Modelle.

```bash
clawdbot onboard --auth-choice openrouter-api-key --token "$OPENROUTER_API_KEY"
```

Dann Modell konfigurieren:

```yaml
agents:
  defaults:
    model:
      primary: "openrouter/anthropic/claude-sonnet-4-5"
```

**Sie sollten sehen**:
- Modellreferenzformat ist `openrouter/<provider>/<model>`
- Mit `clawdbot models scan` verfügbare Modelle anzeigen

### Schritt 5: Ollama konfigurieren (lokale Modelle)

**Warum**
Ollama ermöglicht Ihnen, Modelle lokal auszuführen, ohne API Key, geeignet für datenschutzsensitive Szenarien.

`~/.clawdbot/clawdbot.json` bearbeiten:

```yaml
models:
  providers:
    ollama:
      baseUrl: "http://localhost:11434"
      api: "openai-completions"
      models:
        - id: "ollama/llama3.2"
          name: "Llama 3.2"
          api: "openai-completions"
          reasoning: false
          input: ["text"]
          cost:
            input: 0
            output: 0
            cacheRead: 0
            cacheWrite: 0
          contextWindow: 128000
          maxTokens: 4096

agents:
  defaults:
    model:
      primary: "ollama/llama3.2"
```

**Sie sollten sehen**:
- Ollama-Modelle benötigen keinen API Key
- Stellen Sie sicher, dass der Ollama-Dienst auf `http://localhost:11434` läuft

### Schritt 6: Konfiguration verifizieren

**Warum**
Sicherstellen, dass Authentifizierung und Modellkonfiguration korrekt sind und Gateway AI normal aufrufen kann.

```bash
clawdbot doctor
```

**Sie sollten sehen**:
- Keine Authentifizierungsfehler
- Modellliste enthält Ihre konfigurierten Anbieter
- Status zeigt "OK"

Oder Testnachricht senden:

```bash
clawdbot message send --to +1234567890 --message "Hello from Clawdbot"
```

**Sie sollten sehen**:
- AI-Antwort normal
- Keine "No credentials found"-Fehler

## Checkpoint ✅

- [ ] Mindestens ein Modellanbieter konfiguriert (Anthropic oder OpenAI)
- [ ] Authentifizierungsdatei `auth-profiles.json` erstellt
- [ ] Modellkonfigurationsdatei `models.json` generiert
- [ ] Modellwechsel mit `/model <alias>` möglich
- [ ] Gateway-Log ohne Authentifizierungsfehler
- [ ] Testnachricht erfolgreich erhalten AI-Antwort

## Häufige Fallstricke

### Authentifizierungsmodus stimmt nicht überein

**Problem**: OAuth-Konfiguration stimmt nicht mit Authentifizierungsmodus überein

```yaml
# ❌ Falsch: OAuth-Anmeldedaten aber Modus ist token
anthropic:claude-cli:
  provider: "anthropic"
  mode: "token"  # sollte "oauth" sein
```

**Lösung**:

```yaml
# ✅ Richtig
anthropic:claude-cli:
  provider: "anthropic"
  mode: "oauth"
```

::: tip
Clawdbot setzt automatisch die aus Claude Code CLI importierte Konfiguration auf `mode: "oauth"`, keine manuelle Änderung erforderlich.
:::

### OAuth-Token-Aktualisierung fehlgeschlagen

**Problem**: Fehler "OAuth token refresh failed for anthropic"

**Ursachen**:
- Claude Code CLI-Anmeldedaten auf einem anderen Computer abgelaufen
- OAuth-Token abgelaufen

**Lösung**:
```bash
# Setup-Token neu generieren
claude setup-token

# Neu einfügen
clawdbot models auth paste-token --provider anthropic
```

::: warning token vs oauth
`type: "token"` ist ein statisches Bearer-Token, das nicht automatisch aktualisiert wird. `type: "oauth"` unterstützt automatische Aktualisierung.
:::

### Kontingentbeschränkungen und Failover

**Problem**: Hauptmodell stößt auf Kontingentbeschränkungen (429-Fehler)

**Erscheinung**:
```
HTTP 429: rate_limit_error
```

**Automatische Behandlung**:
- Clawdbot versucht automatisch das nächste Modell in `fallbacks`
- Wenn alle Modelle fehlschlagen, wird ein Fehler zurückgegeben

**Abklingperiode konfigurieren** (optional):

```yaml
auth:
  cooldowns:
    billingBackoffHours: 24  # Deaktiviert den Anbieter 24 Stunden nach Kontingentfehlern
    failureWindowHours: 1      # Fehler innerhalb von 1 Stunde zählen zur Abklingperiode
```

### Umgebungsvariablen-Überschreibung

**Problem**: Umgebungsvariablen in Konfigurationsdatei verwendet, aber nicht gesetzt

```yaml
models:
  providers:
    openai:
      apiKey: "${OPENAI_KEY}"  # Führt zu Fehler, wenn nicht gesetzt
```

**Lösung**:
```bash
# Umgebungsvariable setzen
export OPENAI_KEY="sk-..."

# Oder zu .zshrc/.bashrc hinzufügen
echo 'export OPENAI_KEY="sk-..."' >> ~/.zshrc
```

## Erweiterte Konfiguration

### Multi-Konto und Authentifizierungsrotation

**Warum**
Mehrere Konten für denselben Anbieter konfigurieren, um Lastverteilung und Kontingentverwaltung zu erreichen.

**Authentifizierungsdatei konfigurieren** (`~/.clawdbot/agents/default/agent/auth-profiles.json`):

```json
{
  "version": 1,
  "profiles": {
    "anthropic:me@example.com": {
      "type": "oauth",
      "provider": "anthropic",
      "email": "me@example.com"
    },
    "anthropic:work": {
      "type": "api_key",
      "provider": "anthropic",
      "key": "sk-ant-work..."
    },
    "openai:personal": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-1..."
    },
    "openai:work": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-2..."
    }
  },
  "order": {
    "anthropic": ["anthropic:me@example.com", "anthropic:work"],
    "openai": ["openai:personal", "openai:work"]
  }
}
```

**`order`-Feld**:
- Definiert Reihenfolge der Authentifizierungsrotation
- Clawdbot versucht jedes Konto in der Reihenfolge
- Fehlgeschlagene Konten werden automatisch übersprungen

**CLI-Befehle zur Reihenfolgenverwaltung**:

```bash
# Aktuelle Reihenfolge anzeigen
clawdbot models auth order get --provider anthropic

# Reihenfolge setzen
clawdbot models auth order set --provider anthropic anthropic:me@example.com anthropic:work

# Reihenfolge löschen (Standardrotation verwenden)
clawdbot models auth order clear --provider anthropic
```

### Authentifizierung für spezifische Sitzungen

**Warum**
Authentifizierungskonfiguration für bestimmte Sitzungen oder Sub-Agents sperren.

**Verwenden Sie die Syntax `/model <alias>@<profileId>`**:

```bash
# Sperren Sie die Verwendung eines spezifischen Kontos für die aktuelle Sitzung
/model opus@anthropic:work

# Authentifizierung beim Erstellen eines Sub-Agents angeben
clawdbot sessions spawn --model "opus@anthropic:work" --workspace "~/clawd-work"
```

**Sperren in Konfigurationsdatei** (`~/.clawdbot/clawdbot.json`):

```yaml
auth:
  order:
    # Anthropic-Reihenfolge für main Agent sperren
    main: ["anthropic:me@example.com", "anthropic:work"]
```

### Automatische OAuth-Token-Aktualisierung

Clawdbot unterstützt die automatische Aktualisierung für die folgenden OAuth-Anbieter:

| Anbieter | OAuth-Fluss | Aktualisierungsmechanismus |
|--- | --- | ---|
| **Anthropic** (Claude Code CLI) | Standard-Autorisierungscode | pi-mono RPC-Aktualisierung |
| **OpenAI** (Codex) | Standard-Autorisierungscode | pi-mono RPC-Aktualisierung |
| **Qwen Portal** | Benutzerdefiniertes OAuth | `refreshQwenPortalCredentials` |
| **Chutes** | Benutzerdefiniertes OAuth | `refreshChutesTokens` |

**Logik der automatischen Aktualisierung**:

1. Überprüfen Sie Token-Ablaufzeit (`expires`-Feld)
2. Wenn nicht abgelaufen, direkt verwenden
3. Wenn abgelaufen, neues `access`-Token mit `refresh`-Token anfordern
4. Gespeicherte Anmeldedaten aktualisieren

::: tip Claude Code CLI-Synchronisation
Wenn Sie Anthropic OAuth verwenden (`anthropic:claude-cli`), synchronisiert Clawdbot beim Aktualisieren des Tokens zurück in den Speicher von Claude Code CLI, um Konsistenz auf beiden Seiten zu gewährleisten.
:::

### Modellaliase und Verknüpfungen

**Warum**
Modellaliase ermöglichen Ihnen, schnell zwischen Modellen zu wechseln, ohne die vollständige ID merken zu müssen.

**Vordefinierte Aliase** (empfohlene Konfiguration):

```yaml
agents:
  defaults:
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "anthropic/claude-haiku-4-5":
        alias: "haiku"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Verwendung**:

```bash
# Schnell zu Opus wechseln
/model opus

# Gleichbedeutend mit
/model anthropic/claude-opus-4-5

# Spezifische Authentifizierung verwenden
/model opus@anthropic:work
```

::: tip Alias und Authentifizierung getrennt
Ein Alias ist nur eine Verknüpfung für die Modell-ID und beeinflusst die Authentifizierungsauswahl nicht. Um die Authentifizierung anzugeben, verwenden Sie die Syntax `@<profileId>`.
:::

### Implizite Anbieter konfigurieren

Einige Anbieter benötigen keine explizite Konfiguration, Clawdbot erkennt sie automatisch:

| Anbieter | Erkennungsmethode | Konfigurationsdatei |
|--- | --- | ---|
| **GitHub Copilot** | `~/.copilot/credentials.json` | Keine Konfiguration erforderlich |
| **AWS Bedrock** | Umgebungsvariablen oder AWS SDK-Anmeldedaten | `~/.aws/credentials` |
| **Codex CLI** | `~/.codex/auth.json` | Keine Konfiguration erforderlich |

::: tip Priorität impliziter Konfiguration
Implizite Konfigurationen werden automatisch in `models.json` zusammengeführt, aber explizite Konfigurationen können sie überschreiben.
:::

## Häufig gestellte Fragen

### OAuth vs API Key: Was ist der Unterschied?

**OAuth**:
- Geeignet für langfristig laufende Gateways
- Tokens werden automatisch aktualisiert
- Erfordert Abonnementkonto (Claude Pro/Max, OpenAI Codex)

**API Key**:
- Geeignet für schnellen Start und Tests
- Wird nicht automatisch aktualisiert
- Kann für kostenlose Kontostufen verwendet werden

::: info Empfohlene Auswahl
- Langzeitbetrieb → OAuth verwenden (Anthropic, OpenAI)
- Schnelle Tests → API Key verwenden
- Datenschutzsensibel → Lokale Modelle verwenden (Ollama)
:::

### Wie kann ich die aktuelle Authentifizierungskonfiguration anzeigen?

```bash
# Authentifizierungsdatei anzeigen
cat ~/.clawdbot/agents/default/agent/auth-profiles.json

# Modellkonfiguration anzeigen
cat ~/.clawdbot/models.json

# Hauptkonfigurationsdatei anzeigen
cat ~/.clawdbot/clawdbot.json
```

Oder CLI verwenden:

```bash
# Modelle auflisten
clawdbot models list

# Authentifizierungsreihenfolge anzeigen
clawdbot models auth order get --provider anthropic
```

### Wie kann ich eine bestimmte Authentifizierung entfernen?

```bash
# Authentifizierungsdatei bearbeiten, entsprechendes Profil löschen
nano ~/.clawdbot/agents/default/agent/auth-profiles.json

# Oder CLI verwenden (manuelle Operation)
clawdbot doctor  # Problematische Konfigurationen anzeigen
```

::: warning Vor dem Löschen bestätigen
Das Löschen einer Authentifizierungskonfiguration führt dazu, dass Modelle, die diesen Anbieter verwenden, nicht mehr funktionieren. Stellen Sie sicher, dass eine Ersatzkonfiguration vorhanden ist.
:::

### Wie kann ich mich nach Kontingentbeschränkungen erholen?

**Automatische Erholung**:
- Clawdbot versucht nach der Abklingperiode automatisch erneut
- Prüfen Sie das Protokoll für die Wiederholungszeit

**Manuelle Erholung**:
```bash
# Abklingstatus löschen
clawdbot models auth clear-cooldown --provider anthropic --profile-id anthropic:me@example.com

# Oder Gateway neu starten
clawdbot gateway restart
```

## Zusammenfassung

- Clawdbot unterstützt drei Authentifizierungsmethoden: API Key, OAuth, Token
- Modellkonfiguration und Authentifizierung sind getrennt und in verschiedenen Dateien gespeichert
- Empfehlung: Anthropic Opus 4.5 als Hauptmodell, OpenAI GPT-5.2 als Ersatzmodell konfigurieren
- OAuth unterstützt automatische Aktualisierung, geeignet für Langzeitbetrieb
- Multi-Konto und Authentifizierungsrotation können für Lastverteilung konfiguriert werden
- Modellaliase für schnellen Modellwechsel verwenden

## Nächste Lektion Vorschau

> In der nächsten Lektion lernen wir **[Sitzungsverwaltung und Multi-Agent](../session-management/)**.
>
> Sie werden lernen:
> > - Sitzungsmodelle und Sitzungsisolierung
> > - Sub-Agent-Zusammenarbeit
> > - Kontextkompression
> > - Multi-Agent-Routing-Konfiguration

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-27

| Funktion | Dateipfad | Zeilen |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Modellkonfigurations-Typen | [`src/config/types.models.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.models.ts) | 1-60 |
|--- | --- | ---|
|--- | --- | ---|

**Schlüsseltypen**:
- `AuthProfileCredential`: Union-Typ für Authentifizierungsanmeldedaten (`ApiKeyCredential | TokenCredential | OAuthCredential`)
- `ModelProviderConfig`: Struktur der Modellanbieterkonfiguration
- `ModelDefinitionConfig`: Struktur der Modelldefinition

**Schlüsselfunktionen**:
- `resolveApiKeyForProfile()`: Authentifizierungsanmeldedaten auflösen und API Key zurückgeben
- `refreshOAuthTokenWithLock()`: OAuth-Token-Aktualisierung mit Sperre
- `ensureClawdbotModelsJson()`: Modellkonfiguration generieren und zusammenführen

**Konfigurationsdatei-Positionen**:
- `~/.clawdbot/clawdbot.json`: Hauptkonfigurationsdatei
- `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`: Authentifizierungsanmeldedaten
- `~/.clawdbot/models.json`: Generierte Modellkonfiguration

</details>
