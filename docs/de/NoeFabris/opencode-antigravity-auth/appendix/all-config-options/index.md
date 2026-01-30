---
title: "Vollständige Konfigurationsoptionen: 30+ Parameter erklärt | Antigravity Auth"
sidebarTitle: "30+ Parameter anpassen"
subtitle: "Vollständiges Referenzhandbuch für Antigravity Auth Konfigurationsoptionen"
description: "Lernen Sie die 30+ Konfigurationsoptionen des Antigravity Auth Plugins kennen. Umfasst allgemeine Einstellungen, Session-Wiederherstellung, Account-Auswahlstrategien, Rate Limiting, Token-Refresh und Best Practices."
tags:
  - "Konfigurationsreferenz"
  - "Erweiterte Konfiguration"
  - "Vollständiges Handbuch"
  - "Antigravity"
  - "OpenCode"
prerequisite:
  - "quick-install"
order: 1
---

# Vollständiges Referenzhandbuch für Antigravity Auth Konfigurationsoptionen

## Was Sie lernen werden

- Alle Konfigurationsoptionen des Antigravity Auth Plugins finden und ändern
- Die Funktion und Anwendungsfälle jeder Konfigurationsoption verstehen
- Die beste Konfigurationskombination für Ihren Anwendungsfall auswählen
- Konfigurationsdatei-Einstellungen über Umgebungsvariablen überschreiben

## Kernkonzept

Das Antigravity Auth Plugin steuert nahezu alle Verhaltensweisen über Konfigurationsdateien: vom Log-Level bis zur Account-Auswahlstrategie, von der Session-Wiederherstellung bis zum Token-Refresh-Mechanismus.

::: info Speicherorte der Konfigurationsdatei (Priorität von hoch nach niedrig)
1. **Projektkonfiguration**: `.opencode/antigravity.json`
2. **Benutzerkonfiguration**:
   - Linux/Mac: `~/.config/opencode/antigravity.json`
   - Windows: `%APPDATA%\opencode\antigravity.json`
:::

::: tip Priorität von Umgebungsvariablen
Alle Konfigurationsoptionen können über Umgebungsvariablen überschrieben werden. Umgebungsvariablen haben eine **höhere Priorität** als Konfigurationsdateien.
:::

## Konfigurationsübersicht

| Kategorie | Anzahl der Optionen | Hauptanwendungsfälle |
| --- | --- | --- |
| Allgemeine Einstellungen | 3 | Logging, Debug-Modus |
| Thinking Blocks | 1 | Denkprozess beibehalten |
| Session-Wiederherstellung | 3 | Automatische Fehlerwiederherstellung |
| Signatur-Cache | 4 | Thinking Block Signatur-Persistierung |
| Leere Antwort-Wiederholung | 2 | Umgang mit leeren Antworten |
| Tool-ID-Wiederherstellung | 1 | Tool-Matching |
| Tool-Halluzinationsprävention | 1 | Parameterfehler verhindern |
| Token-Refresh | 3 | Proaktiver Refresh-Mechanismus |
| Rate Limiting | 5 | Account-Rotation und Wartezeiten |
| Health Score | 7 | Hybrid-Strategie-Bewertung |
| Token Bucket | 3 | Hybrid-Strategie-Token |
| Auto-Update | 1 | Plugin-Auto-Update |
| Web-Suche | 2 | Gemini-Suche |

---

## Allgemeine Einstellungen

### `quiet_mode`

**Typ**: `boolean`  
**Standardwert**: `false`  
**Umgebungsvariable**: `OPENCODE_ANTIGRAVITY_QUIET=1`

Unterdrückt die meisten Toast-Benachrichtigungen (Rate Limiting, Account-Wechsel usw.). Wiederherstellungsbenachrichtigungen (erfolgreiche Session-Wiederherstellung) werden immer angezeigt.

**Anwendungsfälle**:
- Multi-Account-Szenarien mit hoher Frequenz, um häufige Benachrichtigungen zu vermeiden
- Automatisierungsskripte oder Hintergrunddienste

**Beispiel**:
```json
{
  "quiet_mode": true
}
```

### `debug`

**Typ**: `boolean`  
**Standardwert**: `false`  
**Umgebungsvariable**: `OPENCODE_ANTIGRAVITY_DEBUG=1`

Aktiviert Debug-Logging in Dateien. Log-Dateien werden standardmäßig in `~/.config/opencode/antigravity-logs/` gespeichert.

**Anwendungsfälle**:
- Bei der Fehlersuche aktivieren
- Detaillierte Logs für Bug-Reports bereitstellen

::: danger Debug-Logs können sensible Informationen enthalten
Log-Dateien enthalten API-Antworten, Account-Indizes usw. Bitte anonymisieren Sie diese vor der Übermittlung.
:::

### `log_dir`

**Typ**: `string`  
**Standardwert**: OS-spezifisches Konfigurationsverzeichnis + `/antigravity-logs`  
**Umgebungsvariable**: `OPENCODE_ANTIGRAVITY_LOG_DIR=/path/to/logs`

Benutzerdefiniertes Verzeichnis für Debug-Logs.

**Anwendungsfälle**:
- Logs an einem bestimmten Ort speichern (z.B. Netzwerkfreigabe)
- Log-Rotation und Archivierungsskripte

---

## Thinking Block Einstellungen

### `keep_thinking`

**Typ**: `boolean`  
**Standardwert**: `false`  
**Umgebungsvariable**: `OPENCODE_ANTIGRAVITY_KEEP_THINKING=1`

::: warning Experimentelle Funktion
Behält die Thinking Blocks des Claude-Modells bei (über Signatur-Cache).

**Verhaltensweise**:
- `false` (Standard): Entfernt Thinking Blocks, vermeidet Signaturfehler, priorisiert Zuverlässigkeit
- `true`: Behält vollständigen Kontext (einschließlich Thinking Blocks), kann aber zu Signaturfehlern führen

**Anwendungsfälle**:
- Wenn Sie den vollständigen Denkprozess des Modells sehen möchten
- Häufige Verwendung von Denkinhalten in Konversationen

**Nicht empfohlen für**:
- Produktionsumgebungen (Zuverlässigkeit hat Priorität)
- Multi-Turn-Konversationen (anfällig für Signaturkonflikte)

::: tip In Kombination mit `signature_cache` verwenden
Wenn Sie `keep_thinking` aktivieren, empfiehlt es sich, gleichzeitig `signature_cache` zu konfigurieren, um die Signatur-Trefferrate zu verbessern.
:::

---

## Session-Wiederherstellung

### `session_recovery`

**Typ**: `boolean`  
**Standardwert**: `true`

Automatische Wiederherstellung von Sessions bei `tool_result_missing`-Fehlern. Wenn aktiviert, wird bei wiederherstellbaren Fehlern eine Toast-Benachrichtigung angezeigt.

**Wiederherstellbare Fehlertypen**:
- `tool_result_missing`: Tool-Ergebnis fehlt (ESC-Unterbrechung, Timeout, Absturz)
- `Expected thinking but found text`: Falsche Reihenfolge der Thinking Blocks

**Anwendungsfälle**:
- Alle Szenarien mit Tool-Verwendung (standardmäßig empfohlen)
- Lange Konversationen oder häufige Tool-Ausführungen

### `auto_resume`

**Typ**: `boolean`  
**Standardwert**: `false`

Sendet automatisch einen "continue"-Prompt zur Session-Wiederherstellung. Wirkt nur, wenn `session_recovery` aktiviert ist.

**Verhaltensweise**:
- `false`: Zeigt nur Toast-Benachrichtigung, Benutzer muss manuell "continue" senden
- `true`: Sendet automatisch "continue", um die Session fortzusetzen

**Anwendungsfälle**:
- Automatisierungsskripte oder unbeaufsichtigte Szenarien
- Vollständig automatisierter Wiederherstellungsprozess gewünscht

**Nicht empfohlen für**:
- Manuelle Bestätigung der Wiederherstellungsergebnisse erforderlich
- Statusprüfung nach Tool-Ausführungsunterbrechung vor Fortsetzung erforderlich

### `resume_text`

**Typ**: `string`  
**Standardwert**: `"continue"`

Benutzerdefinierter Text, der bei automatischer Wiederherstellung gesendet wird. Wird nur verwendet, wenn `auto_resume` aktiviert ist.

**Anwendungsfälle**:
- Mehrsprachige Umgebungen (z.B. ändern zu "fortfahren", "bitte fortfahren")
- Szenarien, die zusätzliche Prompts erfordern

**Beispiel**:
```json
{
  "auto_resume": true,
  "resume_text": "Bitte setzen Sie die vorherige Aufgabe fort"
}
```

---

## Signatur-Cache

> Wirkt nur, wenn `keep_thinking` aktiviert ist

### `signature_cache.enabled`

**Typ**: `boolean`  
**Standardwert**: `true`

Aktiviert Disk-Caching für Thinking Block Signaturen.

**Funktion**: Caching von Signaturen vermeidet Fehler durch wiederholte Signaturen in Multi-Turn-Konversationen.

### `signature_cache.memory_ttl_seconds`

**Typ**: `number` (Bereich: 60-86400)  
**Standardwert**: `3600` (1 Stunde)

Ablaufzeit des Memory-Cache (Sekunden).

### `signature_cache.disk_ttl_seconds`

**Typ**: `number` (Bereich: 3600-604800)  
**Standardwert**: `172800` (48 Stunden)

Ablaufzeit des Disk-Cache (Sekunden).

### `signature_cache.write_interval_seconds`

**Typ**: `number` (Bereich: 10-600)  
**Standardwert**: `60`

Intervall für Hintergrund-Schreibvorgänge auf Disk (Sekunden).

**Beispiel**:
```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  }
}
```

---

## Leere Antwort-Wiederholung

Automatische Wiederholung, wenn Antigravity eine leere Antwort zurückgibt (keine candidates/choices).

### `empty_response_max_attempts`

**Typ**: `number` (Bereich: 1-10)  
**Standardwert**: `4`

Maximale Anzahl von Wiederholungsversuchen.

### `empty_response_retry_delay_ms`

**Typ**: `number` (Bereich: 500-10000)  
**Standardwert**: `2000` (2 Sekunden)

Verzögerung zwischen Wiederholungsversuchen (Millisekunden).

**Anwendungsfälle**:
- Instabile Netzwerkumgebungen (Anzahl der Wiederholungen erhöhen)
- Schnelles Fehlschlagen erforderlich (Anzahl der Wiederholungen und Verzögerung reduzieren)

---

## Tool-ID-Wiederherstellung

### `tool_id_recovery`

**Typ**: `boolean`  
**Standardwert**: `true`

Aktiviert Tool-ID-Isolationswiederherstellung. Wenn die ID der Tool-Antwort nicht übereinstimmt (aufgrund von Kontextkompression), wird versucht, über Funktionsnamen-Matching oder Platzhalter-Erstellung wiederherzustellen.

**Funktion**: Verbessert die Zuverlässigkeit von Tool-Aufrufen in Multi-Turn-Konversationen.

**Anwendungsfälle**:
- Lange Konversationsszenarien (empfohlen aktiviert)
- Häufige Tool-Verwendung

---

## Tool-Halluzinationsprävention

### `claude_tool_hardening`

**Typ**: `boolean`  
**Standardwert**: `true`

Aktiviert Tool-Halluzinationsprävention für Claude-Modelle. Wenn aktiviert, werden automatisch injiziert:
- Parameter-Signaturen in Tool-Beschreibungen
- Strikte Tool-Verwendungsregeln als Systemanweisungen

**Funktion**: Verhindert, dass Claude Parameternamen aus Trainingsdaten anstelle der tatsächlichen Schema-Parameternamen verwendet.

**Anwendungsfälle**:
- Verwendung von MCP-Plugins oder benutzerdefinierten Tools (empfohlen aktiviert)
- Komplexe Tool-Schemas

**Nicht empfohlen für**:
- Tool-Aufrufe entsprechen vollständig dem Schema (kann deaktiviert werden, um zusätzliche Prompts zu reduzieren)

---

## Proaktiver Token-Refresh

### `proactive_token_refresh`

**Typ**: `boolean`  
**Standardwert**: `true`

Aktiviert proaktiven Hintergrund-Token-Refresh. Wenn aktiviert, werden Token vor Ablauf automatisch aktualisiert, um sicherzustellen, dass Anfragen nicht durch Token-Refresh blockiert werden.

**Funktion**: Vermeidet Verzögerungen durch Warten auf Token-Refresh.

### `proactive_refresh_buffer_seconds`

**Typ**: `number` (Bereich: 60-7200)  
**Standardwert**: `1800` (30 Minuten)

Wie lange vor Token-Ablauf der proaktive Refresh ausgelöst wird (Sekunden).

### `proactive_refresh_check_interval_seconds`

**Typ**: `number` (Bereich: 30-1800)  
**Standardwert**: `300` (5 Minuten)

Intervall für proaktive Refresh-Prüfungen (Sekunden).

**Anwendungsfälle**:
- Hochfrequenz-Anfrageszenarien (empfohlen proaktiven Refresh zu aktivieren)
- Risiko von Refresh-Fehlern reduzieren (Buffer-Zeit erhöhen)

---

## Rate Limiting und Account-Auswahl

### `max_rate_limit_wait_seconds`

**Typ**: `number` (Bereich: 0-3600)  
**Standardwert**: `300` (5 Minuten)

Maximale Wartezeit, wenn alle Accounts rate-limited sind (Sekunden). Wenn die minimale Wartezeit aller Accounts diesen Schwellenwert überschreitet, schlägt das Plugin schnell fehl, anstatt zu hängen.

**Auf 0 setzen**: Deaktiviert Timeout, wartet unbegrenzt.

**Anwendungsfälle**:
- Schnelles Fehlschlagen erforderlich (Wartezeit reduzieren)
- Lange Wartezeiten akzeptabel (Wartezeit erhöhen)

### `quota_fallback`

**Typ**: `boolean`  
**Standardwert**: `false`

Aktiviert Quota-Fallback für Gemini-Modelle. Wenn der bevorzugte Quota-Pool (Gemini CLI oder Antigravity) erschöpft ist, wird der alternative Quota-Pool desselben Accounts versucht.

**Anwendungsfälle**:
- Hochfrequenz-Verwendung von Gemini-Modellen (empfohlen aktiviert)
- Maximale Quota-Nutzung pro Account gewünscht

::: tip Wirkt nur, wenn kein explizites Quota-Suffix angegeben ist
Wenn der Modellname explizit `:antigravity` oder `:gemini-cli` enthält, wird immer der angegebene Quota-Pool verwendet, kein Fallback.
:::

### `account_selection_strategy`

**Typ**: `string` (Enum: `sticky`, `round-robin`, `hybrid`)  
**Standardwert**: `"hybrid"`  
**Umgebungsvariable**: `OPENCODE_ANTIGRAVITY_ACCOUNT_SELECTION_STRATEGY`

Account-Auswahlstrategie.

| Strategie | Beschreibung | Anwendungsfälle |
| --- | --- | --- |
| `sticky` | Verwendet denselben Account bis Rate Limit, behält Prompt-Cache | Einzelne Session, cache-sensitive Szenarien |
| `round-robin` | Rotiert zu nächstem Account bei jeder Anfrage, maximiert Durchsatz | Multi-Account-Hochdurchsatz-Szenarien |
| `hybrid` | Deterministische Auswahl basierend auf Health Score + Token Bucket + LRU | Allgemein empfohlen, balanciert Performance und Zuverlässigkeit |

::: info Detaillierte Erklärung
Siehe Kapitel [Account-Auswahlstrategien](/de/NoeFabris/opencode-antigravity-auth/advanced/account-selection-strategies/).
:::

### `pid_offset_enabled`

**Typ**: `boolean`  
**Standardwert**: `false`  
**Umgebungsvariable**: `OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1`

Aktiviert PID-basierten Account-Offset. Wenn aktiviert, bevorzugen verschiedene Sessions (PIDs) unterschiedliche Start-Accounts, was bei parallelen Agents zur Lastverteilung beiträgt.

**Verhaltensweise**:
- `false` (Standard): Alle Sessions starten vom gleichen Account-Index, behält Anthropic Prompt-Cache (empfohlen für Einzelsession)
- `true`: Offset des Start-Accounts basierend auf PID, verteilt Last (empfohlen für parallele Multi-Session)

**Anwendungsfälle**:
- Mehrere parallele OpenCode-Sessions
- Verwendung von Sub-Agents oder parallelen Tasks

### `switch_on_first_rate_limit`

**Typ**: `boolean`  
**Standardwert**: `true`

Wechselt sofort den Account beim ersten Rate Limit (nach 1 Sekunde Verzögerung). Wenn deaktiviert, wird zuerst derselbe Account wiederholt, erst beim zweiten Rate Limit gewechselt.

**Anwendungsfälle**:
- Schneller Account-Wechsel gewünscht (empfohlen aktiviert)
- Maximale Quota pro Account gewünscht (deaktivieren)

---

## Health Score (Hybrid-Strategie)

> Wirkt nur, wenn `account_selection_strategy` auf `hybrid` gesetzt ist

### `health_score.initial`

**Typ**: `number` (Bereich: 0-100)  
**Standardwert**: `70`

Initialer Health Score des Accounts.

### `health_score.success_reward`

**Typ**: `number` (Bereich: 0-10)  
**Standardwert**: `1`

Health Score-Erhöhung pro erfolgreicher Anfrage.

### `health_score.rate_limit_penalty`

**Typ**: `number` (Bereich: -50-0)  
**Standardwert**: `-10`

Health Score-Abzug pro Rate Limit.

### `health_score.failure_penalty`

**Typ**: `number` (Bereich: -100-0)  
**Standardwert**: `-20`

Health Score-Abzug pro Fehler.

### `health_score.recovery_rate_per_hour`

**Typ**: `number` (Bereich: 0-20)  
**Standardwert**: `2`

Health Score-Wiederherstellung pro Stunde.

### `health_score.min_usable`

**Typ**: `number` (Bereich: 0-100)  
**Standardwert**: `50`

Minimaler Health Score-Schwellenwert für Account-Verfügbarkeit.

### `health_score.max_score`

**Typ**: `number` (Bereich: 50-100)  
**Standardwert**: `100`

Maximaler Health Score.

**Anwendungsfälle**:
- Standardkonfiguration geeignet für die meisten Szenarien
- Hochfrequenz-Rate-Limit-Umgebungen können `rate_limit_penalty` reduzieren oder `recovery_rate_per_hour` erhöhen
- Schnellerer Account-Wechsel gewünscht: `min_usable` reduzieren

**Beispiel**:
```json
{
  "account_selection_strategy": "hybrid",
  "health_score": {
    "initial": 80,
    "success_reward": 2,
    "rate_limit_penalty": -5,
    "failure_penalty": -15,
    "recovery_rate_per_hour": 5,
    "min_usable": 40,
    "max_score": 100
  }
}
```

---

## Token Bucket (Hybrid-Strategie)

> Wirkt nur, wenn `account_selection_strategy` auf `hybrid` gesetzt ist

### `token_bucket.max_tokens`

**Typ**: `number` (Bereich: 1-1000)  
**Standardwert**: `50`

Maximale Kapazität des Token Buckets.

### `token_bucket.regeneration_rate_per_minute`

**Typ**: `number` (Bereich: 0.1-60)  
**Standardwert**: `6`

Anzahl der generierten Token pro Minute.

### `token_bucket.initial_tokens`

**Typ**: `number` (Bereich: 1-1000)  
**Standardwert**: `50`

Initiale Token-Anzahl des Accounts.

**Anwendungsfälle**:
- Hochfrequenz-Anfrageszenarien können `max_tokens` und `regeneration_rate_per_minute` erhöhen
- Schnellere Account-Rotation gewünscht: `initial_tokens` reduzieren

---

## Auto-Update

### `auto_update`

**Typ**: `boolean`  
**Standardwert**: `true`

Aktiviert automatische Plugin-Updates.

**Anwendungsfälle**:
- Automatisch neueste Features erhalten (empfohlen aktiviert)
- Feste Version erforderlich (deaktivieren)

---

## Web-Suche (Gemini Grounding)

### `web_search.default_mode`

**Typ**: `string` (Enum: `auto`, `off`)  
**Standardwert**: `"off"`

Standard-Modus für Web-Suche (wenn nicht über Variant angegeben).

| Modus | Beschreibung |
| --- | --- |
| `auto` | Modell entscheidet, wann gesucht wird (dynamisches Retrieval) |
| `off` | Suche standardmäßig deaktiviert |

### `web_search.grounding_threshold`

**Typ**: `number` (Bereich: 0-1)  
**Standardwert**: `0.3`

Dynamischer Retrieval-Schwellenwert (0.0 bis 1.0). Je höher der Wert, desto seltener sucht das Modell (höhere Konfidenz erforderlich, um Suche auszulösen). Wirkt nur im `auto`-Modus.

**Anwendungsfälle**:
- Unnötige Suchen reduzieren (Schwellenwert erhöhen, z.B. 0.5)
- Modell zu mehr Suchen ermutigen (Schwellenwert senken, z.B. 0.2)

**Beispiel**:
```json
{
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.4
  }
}
```

---

## Konfigurationsbeispiele

### Basis-Konfiguration für Einzelaccount

```json
{
  "quiet_mode": false,
  "debug": false,
  "keep_thinking": false,
  "session_recovery": true,
  "auto_resume": false,
  "account_selection_strategy": "sticky"
}
```

### Hochleistungs-Konfiguration für Multi-Account

```json
{
  "quiet_mode": true,
  "debug": false,
  "session_recovery": true,
  "auto_resume": true,
  "account_selection_strategy": "hybrid",
  "quota_fallback": true,
  "switch_on_first_rate_limit": true,
  "max_rate_limit_wait_seconds": 120,
  "health_score": {
    "initial": 70,
    "min_usable": 40
  },
  "token_bucket": {
    "max_tokens": 100,
    "regeneration_rate_per_minute": 10
  }
}
```

### Debug- und Diagnose-Konfiguration

```json
{
  "debug": true,
  "log_dir": "/tmp/antigravity-logs",
  "quiet_mode": false,
  "session_recovery": true,
  "auto_resume": true,
  "tool_id_recovery": true
}
```

### Thinking Block Konfiguration

```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  },
  "session_recovery": true
}
```

---

## Häufig gestellte Fragen

### F: Wie kann ich eine Konfiguration temporär deaktivieren?

**A**: Verwenden Sie Umgebungsvariablen zum Überschreiben, ohne die Konfigurationsdatei zu ändern.

```bash
# Debug-Modus temporär aktivieren
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode

# Quiet-Modus temporär aktivieren
OPENCODE_ANTIGRAVITY_QUIET=1 opencode
```

### F: Muss ich OpenCode nach Änderungen an der Konfigurationsdatei neu starten?

**A**: Ja, die Konfigurationsdatei wird beim Start von OpenCode geladen. Nach Änderungen ist ein Neustart erforderlich.

### F: Wie kann ich überprüfen, ob die Konfiguration wirksam ist?

**A**: Aktivieren Sie den `debug`-Modus und überprüfen Sie die Konfigurationsladeinformationen in den Log-Dateien.

```json
{
  "debug": true
}
```

Die Logs zeigen die geladene Konfiguration:
```
[config] Loaded configuration: {...}
```

### F: Welche Konfigurationsoptionen müssen am häufigsten angepasst werden?

**A**:
- `account_selection_strategy`: Wählen Sie die passende Strategie für Multi-Account-Szenarien
- `quiet_mode`: Benachrichtigungsstörungen reduzieren
- `session_recovery` / `auto_resume`: Session-Wiederherstellungsverhalten steuern
- `debug`: Bei Fehlersuche aktivieren

### F: Gibt es eine JSON-Schema-Validierung für die Konfigurationsdatei?

**A**: Ja, durch Hinzufügen des `$schema`-Feldes in der Konfigurationsdatei können Sie IDE-Autovervollständigung und -Validierung aktivieren:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  ...
}
```

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Speicherorte anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Config Schema Definition | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 1-373 |
| JSON Schema | [`assets/antigravity.schema.json`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/assets/antigravity.schema.json) | 1-157 |
| Config Loader | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | - |

**Wichtige Konstanten**:
- `DEFAULT_CONFIG`: Standard-Konfigurationsobjekt (`schema.ts:328-372`)

**Wichtige Typen**:
- `AntigravityConfig`: Haupt-Konfigurationstyp (`schema.ts:322`)
- `SignatureCacheConfig`: Signatur-Cache-Konfigurationstyp (`schema.ts:323`)
- `AccountSelectionStrategy`: Account-Auswahlstrategie-Typ (`schema.ts:22`)

</details>
