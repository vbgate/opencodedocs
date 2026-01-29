---
title: "Speichermodelle: Datenstrukturen | Antigravity Tools"
sidebarTitle: "Wo sind die Daten"
subtitle: "Daten und Modelle: Kontodateien, SQLite-Statistikdatenbank und Definitionen wichtiger Felder"
description: "Erfahren Sie mehr über die Speicherstruktur von Antigravity Tools. Meistern Sie den Speicherort und die Bedeutung der Felder von accounts.json, Kontodateien, token_stats.db und proxy_logs.db."
tags:
  - "Anhang"
  - "Datenmodelle"
  - "Speicherstruktur"
  - "Backup"
prerequisite:
  - "start-backup-migrate"
order: 2
---

# Daten und Modelle: Kontodateien, SQLite-Statistikdatenbank und Definitionen wichtiger Felder

## Was Sie nach dieser Lektion können

- Schnelles Auffinden der Speicherorte von Kontodaten, Statistikdatenbanken, Konfigurationsdateien und Protokollverzeichnissen
- Verstehen der JSON-Struktur von Kontodateien und die Bedeutung der Schlüsselfelder
- Direktes Abfragen von Proxy-Protokollen und Token-Verbrauch über SQLite
- Wissen, welche Dateien bei Backup, Migration oder Fehlerbehebung relevant sind

## Ihr aktuelles Problem

Wenn Sie müssen:
- **Konto auf einen neuen Computer migrieren**: Wissen nicht, welche Dateien kopiert werden müssen
- **Kontoanomalien untersuchen**: Welche Felder in der Kontodatei beurteilen den Kontostatus
- **Token-Verbrauch exportieren**: Möchten direkt aus der Datenbank abfragen, kennen aber die Tabellenstruktur nicht
- **Historische Daten bereinigen**: Sorgen, falsche Dateien zu löschen und Daten zu verlieren

Dieser Anhang hilft Ihnen, ein vollständiges Verständnis der Datenmodelle aufzubauen.

---

## Datenverzeichnisstruktur

Die Kerndaten von Antigravity Tools werden standardmäßig im Verzeichnis `.antigravity_tools` im Benutzer-Homeverzeichnis gespeichert (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: warning Sicherheitsgrenzen vorab klären
Dieses Verzeichnis enthält sensible Informationen wie `refresh_token`/`access_token` (Quelle: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`). Stellen Sie vor dem Backup/Kopieren/Teilen sicher, dass Ihre Zielumgebung vertrauenswürdig ist.
:::

### Wo finde ich dieses Verzeichnis?

::: code-group

```bash [macOS/Linux]
## In das Datenverzeichnis wechseln
cd ~/.antigravity_tools

## Oder im Finder öffnen (macOS)
open ~/.antigravity_tools
```

```powershell [Windows]
## In das Datenverzeichnis wechseln
Set-Location "$env:USERPROFILE\.antigravity_tools"

## Oder im Explorer öffnen
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### Verzeichnisbaum-Übersicht

```
~/.antigravity_tools/
├── accounts.json          # Konto-Index (Version 2.0)
├── accounts/              # Konto-Verzeichnis
│   └── <account_id>.json  # Eine Datei pro Konto
├── gui_config.json        # Anwendungskonfiguration (von GUI geschrieben)
├── token_stats.db         # Token-Statistikdatenbank (SQLite)
├── proxy_logs.db          # Proxy-Monitoring-Protokolldatenbank (SQLite)
├── logs/                  # Anwendungsprotokollverzeichnis
│   └── app.log*           # Tägliches Rollen (Dateiname ändert sich mit Datum)
├── bin/                   # Externe Tools (z.B. cloudflared)
│   └── cloudflared(.exe)
└── device_original.json   # Geräte-Fingerabdruck-Baseline (optional)
```

**Pfadregel für Datenverzeichnis**: Nimmt `dirs::home_dir()` und hängt `.antigravity_tools` an (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: tip Backup-Empfehlung
Regelmäßiges Backup des Verzeichnisses `accounts/`, der Dateien `accounts.json`, `token_stats.db` und `proxy_logs.db` speichert alle Kerndaten.
:::

---

## Konto-Datenmodell

### accounts.json (Konto-Index)

Die Konto-Indexdatei speichert Zusammenfassungsinformationen aller Konten und das aktuell ausgewählte Konto.

**Speicherort**: `~/.antigravity_tools/accounts.json`

**Schema** (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`):

```json
{
  "version": "2.0",                  // Index-Version
  "accounts": [                       // Konto-Zusammenfassungsliste
    {
      "id": "uuid-v4",              // Eindeutige Konto-ID
      "email": "user@gmail.com",     // Konto-E-Mail
      "name": "Display Name",        // Anzeigename (optional)
      "created_at": 1704067200,      // Erstellungszeit (Unix-Zeitstempel)
      "last_used": 1704067200       // Letzte Verwendungszeit (Unix-Zeitstempel)
    }
  ],
  "current_account_id": "uuid-v4"    // ID des aktuell ausgewählten Kontos
}
```

### Kontodatei ({account_id}.json)

Die vollständigen Daten jedes Kontos werden im JSON-Format separat im Verzeichnis `accounts/` gespeichert.

**Speicherort**: `~/.antigravity_tools/accounts/{account_id}.json`

**Schema** (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42`; Frontend-Typ: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`):

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // OAuth-Token-Daten
    "access_token": "ya29...",      // Aktuelles Access-Token
    "refresh_token": "1//...",      // Refresh-Token (am wichtigsten)
    "expires_in": 3600,            // Ablaufzeit (Sekunden)
    "expiry_timestamp": 1704070800, // Ablauf-Zeitstempel
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // Optional: Google Cloud Projekt-ID
    "session_id": "..."            // Optional: Antigravity sessionId
  },

  "device_profile": {               // Geräte-Fingerabdruck (optional)
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // Historische Versionen des Geräte-Fingerabdrucks
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Saved from device X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // Quota-Daten (optional)
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // Verbleibende Quota-Prozent
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // Abonnement-Typ: FREE/PRO/ULTRA
  },

  "disabled": false,                // Ob das Konto dauerhaft deaktiviert ist
  "disabled_reason": null,          // Deaktivierungsgrund (z.B. invalid_grant)
  "disabled_at": null,             // Deaktivierungs-Zeitstempel

  "proxy_disabled": false,         // Ob die Proxy-Funktion deaktiviert ist
  "proxy_disabled_reason": null,   // Grund für Proxy-Deaktivierung
  "proxy_disabled_at": null,       // Zeitstempel der Proxy-Deaktivierung

  "protected_models": [             // Liste der durch Quota-Schutz geschützten Modelle
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### Erklärung der Schlüsselfelder

| Feld | Typ | Geschäftliche Bedeutung | Auslösebedingung |
| ----- | ---- | -------- | -------- |
| `disabled` | bool | Konto dauerhaft deaktiviert (z.B. refresh_token ungültig) | Automatisch auf `true` gesetzt bei `invalid_grant` |
| `proxy_disabled` | bool | Nur Proxy-Funktion deaktiviert, beeinträchtigt GUI-Nutzung nicht | Manuelles Deaktivieren oder durch Quota-Schutz ausgelöst |
| `protected_models` | string[] | "Eingeschränkte Modellliste" für modellbasierten Quota-Schutz | Wird durch Quota-Schutz-Logik aktualisiert |
| `quota.models[].percentage` | number | Verbleibende Quota-Prozent (0-100) | Wird bei jeder Quota-Aktualisierung aktualisiert |
| `token.refresh_token` | string | Token zum Abrufen von access_token | Wird bei OAuth-Autorisierung abgerufen, langfristig gültig |

**Wichtige Regel 1: invalid_grant löst Deaktivierung aus** (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889`; Schreiben: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`):

- Wenn die Token-Aktualisierung fehlschlägt und der Fehler `invalid_grant` enthält, schreibt TokenManager `disabled=true` / `disabled_at` / `disabled_reason` in die Kontodatei und entfernt das Konto aus dem Token-Pool.

**Wichtige Regel 2: Semantik von protected_models** (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250`; Quota-Schutz schreiben: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`):

- `protected_models` speichert die "normalisierten Modell-IDs", die für modellbasierten Quota-Schutz und zum Überspringen bei der Planung verwendet werden.

---

## Token-Statistikdatenbank

Die Token-Statistikdatenbank zeichnet den Token-Verbrauch bei jeder Proxy-Anforderung auf und dient der Kostenüberwachung und Trendanalyse.

**Speicherort**: `~/.antigravity_tools/token_stats.db`

**Datenbank-Engine**: SQLite + WAL-Modus (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`)

### Tabellenstruktur

#### token_usage (ursprüngliche Nutzungsaufzeichnungen)

| Feld | Typ | Beschreibung |
| ---- | ---- | ---- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Auto-Inkrement-Primärschlüssel |
| timestamp | INTEGER | Anforderungszeitstempel |
| account_email | TEXT | Konto-E-Mail |
| model | TEXT | Modellname |
| input_tokens | INTEGER | Eingabe-Token-Zahl |
| output_tokens | INTEGER | Ausgabe-Token-Zahl |
| total_tokens | INTEGER | Gesamt-Token-Zahl |

**Tabellenerstellung** (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`):

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly (stündliche Aggregationstabelle)

Aggregiert einmal pro Stunde die Token-Nutzung für schnelle Abfragen von Trenddaten.

**Tabellenerstellung** (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`):

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- Zeit-Bucket (Format: YYYY-MM-DD HH:00)
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### Indizes

Um die Abfrageleistung zu verbessern, wurden folgende Indizes erstellt (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`):

```sql
-- Index nach Zeit absteigend
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- Index nach Konto
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### Häufige Abfragebeispiele

#### Token-Verbrauch der letzten 24 Stunden abfragen

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### Verbrauch nach Modell statistisch erfassen

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info Zeitfeld-Bereich
`token_usage.timestamp` ist ein Unix-Zeitstempel (Sekunden), geschrieben mit `chrono::Utc::now().timestamp()`. `token_stats_hourly.hour_bucket` ist auch ein String, basierend auf UTC generiert (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`).
:::

---

## Proxy-Monitoring-Protokolldatenbank

Die Proxy-Protokolldatenbank zeichnet detaillierte Informationen zu jeder Proxy-Anforderung auf und dient der Fehlerbehebung und Anforderungsüberwachung.

**Speicherort**: `~/.antigravity_tools/proxy_logs.db`

**Datenbank-Engine**: SQLite + WAL-Modus (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`)

### Tabellenstruktur: request_logs

| Feld | Typ | Beschreibung |
| ---- | ---- | ---- |
| id | TEXT PRIMARY KEY | Eindeutige Anforderungs-ID (UUID) |
| timestamp | INTEGER | Anforderungszeitstempel |
| method | TEXT | HTTP-Methode (GET/POST) |
| url | TEXT | Anforderungs-URL |
| status | INTEGER | HTTP-Statuscode |
| duration | INTEGER | Anforderungsdauer (Millisekunden) |
| model | TEXT | Vom Client angeforderter Modellname |
| mapped_model | TEXT | Tatsächlich nach Routing verwendeter Modellname |
| account_email | TEXT | Verwendete Konto-E-Mail |
| error | TEXT | Fehlermeldung (falls vorhanden) |
| request_body | TEXT | Anforderungstext (optional, großer Speicherbedarf) |
| response_body | TEXT | Antworttext (optional, großer Speicherbedarf) |
| input_tokens | INTEGER | Eingabe-Token-Zahl |
| output_tokens | INTEGER | Ausgabe-Token-Zahl |
| protocol | TEXT | Protokolltyp (openai/anthropic/gemini) |

**Tabellenerstellung** (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`):

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- Kompatibilität: Neue Felder werden schrittweise durch ALTER TABLE hinzugefügt
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### Indizes

```sql
-- Index nach Zeit absteigend
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- Index nach Statuscode
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### Automatische Bereinigung

Beim Start von ProxyMonitor werden automatisch Protokolle, die älter als 30 Tage sind, bereinigt und ein `VACUUM` der Datenbank durchgeführt (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`; Implementierung: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`).

### Häufige Abfragebeispiele

#### Letzte fehlgeschlagene Anforderungen abfragen

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### Erfolgsrate der Anforderungen jedes Kontos statistisch erfassen

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## Konfigurationsdateien

### gui_config.json

Speichert Konfigurationsinformationen der Anwendung, einschließlich Proxy-Einstellungen, Modellzuordnungen, Authentifizierungsmodus usw.

**Speicherort**: `~/.antigravity_tools/gui_config.json` (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`)

Die Struktur dieser Datei folgt `AppConfig` (Quelle: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`).

::: tip Wenn Sie "nur für Backup/Migration" benötigen
Der stressfreiste Ansatz ist: Schließen Sie die Anwendung und packen Sie das gesamte Verzeichnis `~/.antigravity_tools/`. Konfigurations-Hot-Updates/Neustart-Semantik gehört zum "Laufzeitverhalten". Informationen dazu finden Sie im Fortgeschrittenenkurs **[Konfiguration vollständig erklärt](../../advanced/config/)**.
:::

---

## Protokolldateien

### Anwendungsprotokolle

**Speicherort**: `~/.antigravity_tools/logs/` (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`)

Protokolle verwenden tägliche Rollen-Dateien, der Basisdateiname ist `app.log` (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`).

**Protokollebene**: INFO/WARN/ERROR

**Zweck**: Zeichnet kritische Ereignisse, Fehlerinformationen und Debugging-Informationen während der Anwendungsausführung auf, dient der Fehlerbehebung.

---

## Datenmigration und Backup

### Kerndaten sichern

::: code-group

```bash [macOS/Linux]
## Gesamtes Datenverzeichnis sichern (am stabilsten)
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## Gesamtes Datenverzeichnis sichern (am stabilsten)
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### Auf einen neuen Computer migrieren

1. Antigravity Tools schließen (um Schreibvorgänge während des Kopierens zu vermeiden)
2. Kopieren Sie `.antigravity_tools` des Quellcomputers in das Homeverzeichnis des Zielcomputers
3. Starten Sie Antigravity Tools

::: tip plattformübergreifende Migration
Wenn Sie von Windows nach macOS/Linux migrieren (oder umgekehrt), müssen Sie nur das gesamte Verzeichnis `.antigravity_tools` kopieren. Das Datenformat ist plattformübergreifend kompatibel.
:::

### Historische Daten bereinigen

::: info Fazit vorab
- `proxy_logs.db`: Automatische Bereinigung nach 30 Tagen (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`).
- `token_stats.db`: Beim Start wird die Tabellenstruktur initialisiert (Quelle: `source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`), aber im Quellcode wurde keine Logik für "automatische Bereinigung historischer Aufzeichnungen nach Tagen" gefunden.
:::

::: danger Nur tun, wenn Sie sicher sind, dass Sie historische Daten nicht mehr benötigen
Das Leeren von Statistiken/Protokollen führt zum Verlust von historischen Daten zur Fehlerbehebung und Kostenanalyse. Sichern Sie vor dem Handeln das gesamte Verzeichnis `.antigravity_tools`.
:::

Wenn Sie einfach "historische Daten leeren und neu starten" möchten, ist der stabilste Ansatz, die Anwendung zu schließen und die DB-Dateien direkt zu löschen (beim nächsten Start wird die Tabellenstruktur neu erstellt).

::: code-group

```bash [macOS/Linux]
## Token-Statistik leeren (historische Daten gehen verloren)
rm -f ~/.antigravity_tools/token_stats.db

## Proxy-Monitoring-Protokolle leeren (historische Daten gehen verloren)
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## Token-Statistik leeren (historische Daten gehen verloren)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## Proxy-Monitoring-Protokolle leeren (historische Daten gehen verloren)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## Erklärung häufiger Feldbereiche

### Unix-Zeitstempel

Alle zeitbezogenen Felder (wie `created_at`, `last_used`, `timestamp`) verwenden Unix-Zeitstempel (Sekundärgenauigkeit).

**Konvertierung in lesbares Format**:

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## SQLite-Abfrage (Beispiel: request_logs.timestamp in lesbare Zeit umwandeln)
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### Quota-Prozent

`quota.models[].percentage` gibt den verbleibenden Quota-Prozent (0-100) an (Quelle: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40`; Backend-Modell: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`).

Ob der "Quota-Schutz" ausgelöst wird, wird durch `quota_protection.enabled/threshold_percentage/monitored_models` bestimmt (Quelle: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63`; Schreiben in `protected_models`: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`).

---

## Lektionszusammenfassung

- Das Datenverzeichnis von Antigravity Tools befindet sich in `.antigravity_tools` im Homeverzeichnis des Benutzers
- Kontodaten: `accounts.json` (Index) + `accounts/<account_id>.json` (vollständige Daten eines einzelnen Kontos)
- Statistikdaten: `token_stats.db` (Token-Statistik) + `proxy_logs.db` (Proxy-Monitoring-Protokolle)
- Konfiguration und Wartung: `gui_config.json`, `logs/`, `bin/cloudflared*`, `device_original.json`
- Der stabilste Ansatz für Backup/Migration ist "gesamtes Verzeichnis `.antigravity_tools` nach dem Schließen der Anwendung packen"

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[z.ai Integrationsfähigkeitsgrenzen](../zai-boundaries/)**.
>
> Sie werden lernen:
> - Liste der implementierten Funktionen der z.ai-Integration
> - Klare nicht implementierte Funktionen und Nutzungseinschränkungen
> - Experimentelle Implementierung von Vision MCP

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Erweitern, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Datenverzeichnis (.antigravity_tools) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Konto-Verzeichnis (accounts/) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| accounts.json Struktur | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Account-Struktur (Backend) | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Account-Struktur (Frontend) | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| TokenData/QuotaData Struktur | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| TokenData/QuotaData Struktur | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Initialisierung der Token-Statistikdatenbank (Schema) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Initialisierung der Proxy-Protokolldatenbank (Schema) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Automatische Bereinigung von Proxy-Protokollen (30 Tage) | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Implementierung der automatischen Bereinigung von Proxy-Protokollen | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| gui_config.json Lese/Schreibzugriff | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| logs/ Verzeichnis und app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| bin/cloudflared Pfad | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
| invalid_grant -> disabled schreiben | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L869-L969) | 869-969 |

**Wichtige Konstanten**:
- `DATA_DIR = ".antigravity_tools"`: Name des Datenverzeichnisses (`src-tauri/src/modules/account.rs:16-18`)
- `ACCOUNTS_INDEX = "accounts.json"`: Name der Konto-Indexdatei (`src-tauri/src/modules/account.rs:16-18`)
- `CONFIG_FILE = "gui_config.json"`: Name der Konfigurationsdatei (`src-tauri/src/modules/config.rs:7`)

**Wichtige Funktionen**:
- `get_data_dir()`: Pfad des Datenverzeichnisses abrufen (`src-tauri/src/modules/account.rs`)
- `record_usage()`: Schreiben in `token_usage`/`token_stats_hourly` (`src-tauri/src/modules/token_stats.rs`)
- `save_log()`: Schreiben in `request_logs` (`src-tauri/src/modules/proxy_db.rs`)
- `cleanup_old_logs(days)`: Alte `request_logs` löschen und `VACUUM` (`src-tauri/src/modules/proxy_db.rs`)

</details>
