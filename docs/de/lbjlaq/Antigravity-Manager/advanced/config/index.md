---
title: "Konfiguration: Hot-Reload und Migration | Antigravity-Manager"
subtitle: "Konfiguration: Hot-Reload und Migration | Antigravity-Manager"
sidebarTitle: "Was tun, wenn Konfiguration nicht greift"
description: "Lerne das Persistierungssystem, den Hot-Reload und die Migrationsmechanismen. Verstehe Standardwerte und Authentifizierungsvalidierung, um häufige Fallstricke zu vermeiden."
tags:
  - "Konfiguration"
  - "gui_config.json"
  - "AppConfig"
  - "ProxyConfig"
  - "Hot-Reload"
prerequisite:
  - "start-first-run-data"
  - "start-proxy-and-first-client"
order: 1
---
# Konfigurationsübersicht: AppConfig/ProxyConfig, Persistenzort und Hot-Reload-Semantik

Du hast `auth_mode` geändert, aber der Client meldet weiterhin 401; du hast `allow_lan_access` aktiviert, aber Geräte im selben Netzwerk können sich nicht verbinden; du möchtest die Konfiguration auf einen neuen Computer übertragen, weiß aber nicht, welche Dateien kopiert werden sollen.

Diese Lektion erklärt das Konfigurationssystem von Antigravity Tools vollständig: Wo die Konfiguration gespeichert wird, was die Standardwerte sind, welche Einstellungen per Hot-Reload aktualisiert werden können und welche einen Neustart des Reverse-Proxys erfordern.

## Was sind AppConfig/ProxyConfig?

**AppConfig/ProxyConfig** sind die Konfigurationsdatenmodelle von Antigravity Tools: AppConfig verwaltet die allgemeinen Einstellungen der Desktop-Anwendung (Sprache, Thema, Aufwärmen, Kontingentschutz usw.), während ProxyConfig die Laufzeitparameter des lokalen Reverse-Proxys verwaltet (Port, Authentifizierung, Modellmapping, Upstream-Proxy usw.). Beide werden schließlich in dieselbe Datei `gui_config.json` serialisiert, und der Proxy liest beim Start den ProxyConfig daraus.

## Was du nach dieser Lektion kannst

- Die tatsächliche Speicherort der Konfigurationsdatei `gui_config.json` finden und Backups/Migrationen erstellen
- Die Kernfelder und Standardwerte von AppConfig/ProxyConfig verstehen (basierend auf dem Quellcode)
- Klar unterscheiden, welche Konfigurationen nach dem Speichern per Hot-Reload aktualisiert werden und welche einen Neustart des Reverse-Proxys erfordern
- Die Bedingungen für eine "Konfigurationsmigration" verstehen (alte Felder werden automatisch zusammengeführt/gelöscht)

## Deine aktuelle Situation

- Du hast Konfigurationen geändert, aber sie "greifen nicht" – du weißt nicht, ob nicht gespeichert, kein Hot-Reload oder ein Neustart erforderlich ist
- Du möchtest nur die "Proxy-Konfiguration" auf einen neuen Computer übertragen, hast aber Angst, Kontodaten mit zu übertragen
- Nach einem Upgrade erscheinen alte Felder, und du befürchtest, dass das Format der Konfigurationsdatei "beschädigt" ist

## Wann du dies benötigst

- Du möchtest den Proxy von "nur lokal" auf "im lokalen Netzwerk erreichbar" umstellen
- Du möchtest die Authentifizierungsrichtlinie ändern (`auth_mode`/`api_key`) und sofort die Wirksamkeit überprüfen
- Du musst Modellmappings, Upstream-Proxys oder z.ai-Konfigurationen massenweise pflegen

## 🎒 Vorbereitungen vor dem Start

- Du weißt bereits, was das Datenverzeichnis ist (siehe [Erster Start: Datenverzeichnis, Protokolle, Tray und Autostart](../../start/first-run-data/))
- Du kannst den Reverse-Proxy mindestens einmal starten (siehe [Lokalen Reverse-Proxy starten und ersten Client verbinden](../../start/proxy-and-first-client/))

::: warning Vorab eine Grenze
Diese Lektion bringt dir das Lesen/Sichern/Migrieren von `gui_config.json` bei, aber es wird nicht empfohlen, es als "langfristig manuell gewartete Konfigurationsdatei" zu behandeln. Da das Backend beim Speichern der Konfiguration gemäß der Rust-Struktur `AppConfig` neu serialisiert, werden unbekannte Felder, die manuell hinzugefügt wurden, beim nächsten Speichern wahrscheinlich automatisch verworfen.
:::

## Kernkonzept

Bei Konfigurationen solltest du drei Sätze im Hinterkopf behalten:

1. AppConfig ist das Root-Objekt für persistente Konfigurationen, gespeichert in `gui_config.json`.
2. ProxyConfig ist das Unterobjekt von `AppConfig.proxy` – sowohl der Start als auch der Hot-Reload des Proxys drehen sich darum.
3. Hot-Reload bedeutet "nur den Speicherstatus aktualisieren": Was per Hot-Reload aktualisiert werden kann, bedeutet nicht, dass man den Port oder die Listenadresse ändern kann.

## Mach mit

### Schritt 1: `gui_config.json` lokalisieren (die Single Source of Truth der Konfiguration)

**Warum**
Alle deine späteren "Sicherungen/Migrationen/Fehlerbehebungen" müssen sich an dieser Datei orientieren.

Das Datenverzeichnis des Backends ist `.antigravity_tools` unter deinem Home-Verzeichnis (es wird automatisch erstellt, wenn es nicht existiert), und der Name der Konfigurationsdatei ist fest auf `gui_config.json` festgelegt.

::: code-group

```bash [macOS/Linux]
CONFIG_FILE="$HOME/.antigravity_tools/gui_config.json"
echo "$CONFIG_FILE"
ls -la "$CONFIG_FILE" || true
```

```powershell [Windows]
$configFile = Join-Path $HOME ".antigravity_tools\gui_config.json"
$configFile
Get-ChildItem -Force $configFile -ErrorAction SilentlyContinue
```

:::

**Was du sehen solltest**:
- Wenn du den Proxy noch nicht gestartet hast, existiert diese Datei möglicherweise nicht (das Backend verwendet dann direkt die Standardkonfiguration).
- Beim Starten des Reverse-Proxy-Dienstes oder beim Speichern der Einstellungen wird sie automatisch erstellt und mit JSON gefüllt.

### Schritt 2: Zuerst eine Sicherung erstellen (Tippfehler vermeiden + einfaches Rollback)

**Warum**
Die Konfiguration kann sensible Felder wie `proxy.api_key`, `api_key` von z.ai usw. enthalten. Wenn du migrieren oder vergleichen möchtest, ist eine Sicherung zuverlässiger als "Gedächtnis".

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/antigravity-config-backup"
cp "$HOME/.antigravity_tools/gui_config.json" "$HOME/antigravity-config-backup/gui_config.$(date +%Y%m%d%H%M%S).json"
```

```powershell [Windows]
$backupDir = Join-Path $HOME "antigravity-config-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$ts = Get-Date -Format "yyyyMMddHHmmss"
Copy-Item (Join-Path $HOME ".antigravity_tools\gui_config.json") (Join-Path $backupDir "gui_config.$ts.json")
```

:::

**Was du sehen solltest**: Ein JSON-Datei mit Zeitstempel ist im Sicherungsverzeichnis erschienen.

### Schritt 3: Standardwerte klären (nicht raten)

**Warum**
Viele "egal wie ich konfiguriere, es klappt nicht"-Probleme liegen daran, dass deine Erwartungen an die Standardwerte nicht stimmen.

Die folgenden Standardwerte stammen aus `AppConfig::new()` und `ProxyConfig::default()` im Backend:

| Konfigurationsblock | Feld | Standardwert (Quellcode) | Wichtiger Punkt |
| --- | --- | --- | --- |
| AppConfig | `language` | `"zh"` | Standard ist Chinesisch |
| AppConfig | `theme` | `"system"` | Folgt dem System |
| AppConfig | `auto_refresh` | `true` | Kontingente werden standardmäßig automatisch aktualisiert |
| AppConfig | `refresh_interval` | `15` | Einheit: Minuten |
| ProxyConfig | `enabled` | `false` | Proxy wird standardmäßig nicht gestartet |
| ProxyConfig | `allow_lan_access` | `false` | Standardmäßig nur an localhost gebunden (Privatsphäre zuerst) |
| ProxyConfig | `auth_mode` | `"off"` | Standardmäßig keine Authentifizierung (nur für lokale Szenarien) |
| ProxyConfig | `port` | `8045` | Dies ist das Feld, das du am häufigsten änderst |
| ProxyConfig | `api_key` | `"sk-<uuid>"` | Standardmäßig wird ein zufälliger Key generiert |
| ProxyConfig | `request_timeout` | `120` | Einheit: Sekunden (Hinweis: Intern im Proxy wird es derzeit möglicherweise nicht verwendet) |
| ProxyConfig | `enable_logging` | `true` | Standardmäßig ist das Logging aktiviert, das von Monitoring/Statistik abhängt |
| StickySessionConfig | `mode` | `Balance` | Scheduling-Strategie ist standardmäßig ausgeglichen |
| StickySessionConfig | `max_wait_seconds` | `60` | Nur sinnvoll im CacheFirst-Modus |

::: tip Wie siehst du alle Felder?
Du kannst `gui_config.json` direkt öffnen und mit dem Quellcode vergleichen: `src-tauri/src/models/config.rs` (AppConfig) und `src-tauri/src/proxy/config.rs` (ProxyConfig). Am Ende dieser Lektion gibt es im Abschnitt "Quellcode-Referenz" klickbare Zeilennummern-Links.
:::

### Schritt 4: Eine "sicher per Hot-Reload aktualisierbare" Konfiguration ändern und sofort verifizieren (Authentifizierung als Beispiel)

**Warum**
Du brauchst eine geschlossene Schleife aus "ändern und sofort verifizieren", um blindes Ändern in der UI zu vermeiden.

Wenn der Proxy läuft, aktualisiert das Backend `save_config` diese Inhalte per Hot-Reload im Speicher:

- `proxy.custom_mapping`
- `proxy.upstream_proxy`
- `proxy.auth_mode` / `proxy.api_key` (Sicherheitsrichtlinie)
- `proxy.zai`
- `proxy.experimental`

Hier nehmen wir `auth_mode` als Beispiel:

1. Öffne die Seite `API Proxy` und stelle sicher, dass der Proxy-Dienst Running ist.
2. Setze `auth_mode` auf `all_except_health` und bestätige, dass du den aktuellen `api_key` kennst.
3. Verifiziere mit der folgenden Anfrage, dass "Health-Check durchgelassen wird, andere Schnittstellen abgelehnt werden".

::: code-group

```bash [macOS/Linux]
#Anfrage an /healthz ohne Key: sollte erfolgreich sein
curl -sS "http://127.0.0.1:8045/healthz" && echo

#Anfrage an /v1/models ohne Key: sollte 401 zurückgeben
curl -sS -i "http://127.0.0.1:8045/v1/models"

#Anfrage an /v1/models mit Key: sollte erfolgreich sein
curl -sS -H "Authorization: Bearer <proxy.api_key>" "http://127.0.0.1:8045/v1/models"
```

```powershell [Windows]
#Anfrage an /healthz ohne Key: sollte erfolgreich sein
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/healthz" | Select-Object -ExpandProperty StatusCode

#Anfrage an /v1/models ohne Key: sollte 401 zurückgeben
try { Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" } catch { $_.Exception.Response.StatusCode.value__ }

#Anfrage an /v1/models mit Key: sollte erfolgreich sein
$headers = @{ Authorization = "Bearer <proxy.api_key>" }
(Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" -Headers $headers).StatusCode
```

:::

**Was du sehen solltest**: `/healthz` gibt 200 zurück; `/v1/models` gibt 401 zurück ohne Key und ist erfolgreich mit Key.

### Schritt 5: Eine "Proxy-Neustart erforderliche" Konfiguration ändern (Port / Listenadresse)

**Warum**
Viele Konfigurationen "greifen nach dem Speichern nicht" – die Ursache ist kein Bug, sondern sie bestimmt, wie der TCP-Listener gebunden wird.

Beim Starten des Proxys berechnet das Backend aus `allow_lan_access` die Listenadresse (`127.0.0.1` oder `0.0.0.0`) und bindet den Port mit `port`; dieser Schritt geschieht nur in `start_proxy_service`.

Vorgehensweise:

1. Ändere auf der Seite `API Proxy` den `port` auf einen neuen Wert (z.B. `8050`) und speichere.
2. Stoppe den Proxy-Dienst und starte ihn neu.
3. Verifiziere `/healthz` mit dem neuen Port.

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:8050/healthz" && echo
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8050/healthz" | Select-Object -ExpandProperty StatusCode
```

:::

**Was du sehen solltest**: Der neue Port ist erreichbar; der alte Port schlägt fehl oder gibt leer zurück.

::: warning Über `allow_lan_access`
Im Quellcode beeinflusst `allow_lan_access` zwei Dinge gleichzeitig:

1. **Listenadresse**: Bestimmt, ob an `127.0.0.1` oder `0.0.0.0` gebunden wird (erfordert Neustart des Proxys, um neu zu binden).
2. **Auto-Authentifizierungsrichtlinie**: Wenn `auth_mode=auto`, wird im LAN-Szenario automatisch zu `all_except_health` gewechselt (dieser Teil kann per Hot-Reload aktualisiert werden).
:::

### Schritt 6: Eine "Konfigurationsmigration" verstehen (alte Felder werden automatisch bereinigt)

**Warum**
Nach einem Upgrade siehst du möglicherweise alte Felder in `gui_config.json` und befürchtest, dass etwas "kaputt" ist. Tatsächlich führt das Backend beim Laden der Konfiguration eine Migration durch: Es führt `anthropic_mapping/openai_mapping` in `custom_mapping` zusammen, löscht die alten Felder und speichert dann automatisch einmal.

Du kannst diese Regel zur Selbstprüfung verwenden:

- Wenn du `proxy.anthropic_mapping` oder `proxy.openai_mapping` in der Datei siehst, werden sie beim nächsten Start/Laden der Konfiguration entfernt.
- Beim Zusammenführen werden Schlüssel, die mit `-series` enden, übersprungen (diese werden jetzt von der Preset/Builtin-Logik verarbeitet).

**Was du sehen solltest**: Nach der Migration verbleibt in `gui_config.json` nur `proxy.custom_mapping`.

## Prüfpunkt ✅

- Du kannst `$HOME/.antigravity_tools/gui_config.json` auf deinem lokalen Computer finden
- Du kannst erklären, warum Konfigurationen wie `auth_mode/api_key/custom_mapping` per Hot-Reload aktualisiert werden können
- Du kannst erklären, warum Konfigurationen wie `port/allow_lan_access` einen Neustart des Proxys erfordern

## Fallstricke

1. Der Hot-Reload von `save_config` deckt nur wenige Felder ab: Er startet den Listener nicht neu und überträgt Konfigurationen wie `scheduling` auch nicht an den TokenManager.
2. `request_timeout` wird in der aktuellen Implementierung des Proxys tatsächlich nicht wirksam: Im `start`-Parameter von AxumServer ist es `_request_timeout`, und im Status ist das Timeout fest auf `300` Sekunden eingestellt.
3. Manuelles Hinzufügen von "benutzerdefinierten Feldern" zu `gui_config.json` ist unzuverlässig: Beim Speichern serialisiert das Backend es erneut in `AppConfig`, und unbekannte Felder werden verworfen.

## Zusammenfassung dieser Lektion

- Es gibt nur einen Speicherort für Konfigurationen: `$HOME/.antigravity_tools/gui_config.json`
- "Kann per Hot-Reload aktualisiert werden" von ProxyConfig bedeutet nicht, dass man den Port oder die Listenadresse ändern kann; alles, was mit Bind zu tun hat, erfordert einen Neustart des Proxys
- Wenn du alte Mapping-Felder siehst, keine Panik: Beim Laden der Konfiguration werden sie automatisch zu `custom_mapping` migriert und alte Felder bereinigt

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Sicherheit und Privatsphäre: auth_mode, allow_lan_access und das Design "keine Kontoinformationen preisgeben"](../security/)**.
>
> Du wirst lernen:
> - Wann die Authentifizierung unbedingt aktiviert werden muss (und warum `auto` im LAN-Szenario strenger ist)
> - Die Minimalexpositionsstrategie, wenn der lokale Proxy im LAN oder öffentlich im Internet verfügbar gemacht wird
> - Welche Daten an den Upstream gesendet werden und welche nur lokal gespeichert werden

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisiert: 2026-01-24

| Thema | Dateipfad | Zeilennummern |
| --- | --- | --- |
| AppConfig-Standardwerte (`AppConfig::new()`) | [`src-tauri/src/models/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/config.rs#L4-L158) | 4-158 |
| ProxyConfig-Standardwerte (Port/Authentifizierung/Listenadresse) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L74-L292) | 74-292 |
| StickySessionConfig-Standardwerte (Scheduling) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L36) | 3-36 |
| Konfigurationsdateiname + Migrationslogik (`gui_config.json`) | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| Datenverzeichnis (`$HOME/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| `save_config`: Konfiguration speichern + welche Felder per Hot-Reload | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| AxumServer: `update_mapping/update_proxy/update_security/...` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L45-L117) | 45-117 |
| Auswahl der Listenadresse bei `allow_lan_access` | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L81-L92) | 81-92 |
| Bind-Adresse und Port beim Proxy-Start (ändert sich nur nach Neustart) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L134) | 42-134 |
| Tatsächliche Regeln bei `auth_mode=auto` | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L3-L31) | 3-31 |
| Frontend speichert Scheduling-Konfiguration (nur speichern, nicht an Backend-Runtime senden) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L476-L501) | 476-501 |
| Monitor-Seite schaltet Logging-Erfassung dynamisch ein/aus | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L263) | 174-263 |

</details>
