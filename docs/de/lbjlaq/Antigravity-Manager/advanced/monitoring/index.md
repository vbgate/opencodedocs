---
title: "Monitoring & Fehlerbehebung: Anfragenprotokoll-Analyse"
sidebarTitle: "Anfragenprotokoll-Fehlerbehebung"
subtitle: "Monitoring & Fehlerbehebung: Anfragenprotokoll-Analyse"
description: "Erfahren Sie mehr über Proxy Monitor von Antigravity Tools. Durch Anfragenprotokolle, Filterung und Detail-Wiederherstellung lokalisieren Sie 401/429/5xx-Fehler und Streaming-Unterbrechungen."
tags:
  - "Erweitert"
  - "Monitoring"
  - "Fehlerbehebung"
  - "Proxy"
  - "Protokolle"
prerequisite:
  - "/de/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/"
  - "/de/lbjlaq/Antigravity-Manager/start/first-run-data/"
  - "/de/lbjlaq/Antigravity-Manager/advanced/config/"
order: 6
---

# Proxy Monitor: Anfragenprotokolle, Filterung, Detail-Wiederherstellung und Export

Sie haben den lokalen Reverse-Proxy bereits am Laufen, aber sobald 401/429/500-Fehler, Streaming-Unterbrechungen oder plötzliche Konto-/Modellwechsel auftreten, wird die Fehlerbehebung schnell zu einem Rätselraten.

In dieser Lektion geht es nur um ein Thema: Mit **Proxy Monitor** jeden Aufruf in "rekonstruierbare Beweise" zu verwandeln, damit Sie wissen, woher die Anfrage kam, welchen Endpunkt sie getroffen hat, welches Konto verwendet wurde, ob das Modell zugeordnet wurde und wie groß der Token-Verbrauch ungefähr war.

## Was Sie nach dieser Lektion können können

- Öffnen/Pausieren der Aufzeichnung auf der Seite `/monitor` und Verstehen, ob dies die Token-Statistiken beeinflusst
- Schnelles Lokalisieren eines Anfragendatensatzes mit Suchfeld, Schnellfilter und Kontofilter
- Anzeigen und Kopieren von Request/Response-Nachrichten im Detail-Popup zum Nachvollziehen von Fehlern
- Kenntnis der Datenspeicherposition von Proxy Monitor (`proxy_logs.db`) und des Löschverhaltens
- Verständnis der tatsächlichen Fähigkeitsgrenzen von "Protokolle exportieren" in der aktuellen Version (GUI vs Backend-Befehle)

## Ihr aktuelles Problem

- Sie sehen nur "Aufruf fehlgeschlagen/Timeout", wissen aber nicht, ob der Fehler upstream, im Proxy oder in der Client-Konfiguration aufgetreten ist
- Sie vermuten, dass eine Modellzuordnung oder ein Kontorundlauf ausgelöst wurde, haben aber keine Beweiskette
- Sie möchten die vollständige Payload einer Anfrage nachvollziehen (insbesondere Streaming/Thinking), sehen diese aber nicht in den Protokollen

## Wann Sie diese Methode verwenden sollten

- Sie müssen untersuchen: 401-Authentifizierungsfehler, 429-Ratenbegrenzung, 5xx-Upstream-Fehler, Streaming-Unterbrechungen
- Sie möchten bestätigen, welches Konto eine bestimmte Anfrage verwendet hat (`X-Account-Email`)
- Sie arbeiten an einer Modellrouting-Strategie und möchten verifizieren "Client-Modellname → tatsächlich zugeordneter Modellname"

## 🎒 Vorbereitungen vor dem Start

::: warning Voraussetzungen
Proxy Monitor zeichnet die Anfragen auf, die vom Reverse-Proxy empfangen wurden. Sie müssen mindestens Folgendes funktionierend haben:

- Der Reverse-Proxy ist gestartet und erreichbar unter `/healthz`
- Sie kennen die Base-URL und den Port des aktuellen Reverse-Proxys

Wenn dies noch nicht funktioniert, lesen Sie zuerst **[Lokalen Reverse-Proxy starten und ersten Client integrieren](/de/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

## Was ist Proxy Monitor?

**Proxy Monitor** ist das in Antigravity Tools integrierte "Anfragenprotokoll-Dashboard". Nachdem jede Anfrage den lokalen Reverse-Proxy erreicht hat, zeichnet es Zeit, Pfad, Statuscode, Dauer, Modell und Protokoll auf und versucht, die Token-Nutzung aus der Antwort zu extrahieren. Sie können auch auf einen einzelnen Datensatz klicken, um Anfrage- und Antwortnachrichten anzuzeigen und用它来 Fehlerursachen und Routing/Konto-Auswahl-Ergebnisse nachvollzuziehen.

::: info Datenspeicherposition
Die Protokolle von Proxy Monitor werden in einer SQLite-Datenbank im Datenverzeichnis gespeichert: `proxy_logs.db`. Wie Sie das Datenverzeichnis finden und sichern, wird empfohlen, zuerst **[Erstes Starten müssen Sie verstehen: Datenverzeichnis, Protokolle, Tray und Autostart](/de/lbjlaq/Antigravity-Manager/start/first-run-data/)** zu lesen.
:::

## Kernkonzept: Die 6 Felder, die Sie im Auge behalten müssen

In einem Datensatz von Proxy Monitor (Backend-Struktur `ProxyRequestLog`) sind die folgenden Felder am nützlichsten:

| Feld | Damit beantworten Sie welche Frage |
|--- | ---|
| `status` | War diese Anfrage erfolgreich oder fehlgeschlagen (200-399 vs andere) |
| `url` / `method` | Welchen Endpunkt haben Sie tatsächlich getroffen (z.B. `/v1/messages`, `/v1/chat/completions`) |
| `protocol` | Welches Protokoll ist dies (OpenAI / Claude(Anthropic) / Gemini) |
| `account_email` | Welches Konto wurde für diese Anfrage最终 verwendet (aus dem Antwortheader `X-Account-Email`) |
| `model` / `mapped_model` | Wurde der vom Client angeforderte Modellname durch "Routing/Zuordnung" in ein anderes Modell geändert |
| `input_tokens` / `output_tokens` | Token-Verbrauch dieser Anfrage (nur wenn extrahierbar) |

::: tip Verwenden Sie zuerst "Zusammenfassung", klicken Sie bei Bedarf auf "Details"
Die Listenseite zeigt nur Zusammenfassungen (ohne request/response body). Wenn Sie auf einen Datensatz klicken, werden die vollständigen Details vom Backend geladen, um zu vermeiden, dass zu viele große Felder auf einmal abgerufen werden.
:::

## Folgen Sie mir: Führen Sie mit einem Aufruf den "Monitoring-Kreislauf" durch

### Schritt 1: Erstellen Sie zuerst eine "sichere" Anfrage

**Warum**
Proxy Monitor zeichnet nur Anfragen auf, die vom Reverse-Proxy empfangen wurden. Überprüfen Sie zuerst mit einer einfachsten Anfrage, ob "Aufzeichnung stattfindet", bevor Sie über Filterung und Details sprechen.

::: code-group

```bash [macOS/Linux]
## 1) Health-Check (definitiv vorhandener Endpunkt)
curl "http://127.0.0.1:PORT/healthz"

## 2) Fordern Sie einmal models an (wenn Sie Authentifizierung aktiviert haben, denken Sie daran, Header hinzuzufügen)
curl "http://127.0.0.1:PORT/v1/models"
```

```powershell [Windows]
## 1) Health-Check (definitiv vorhandener Endpunkt)
curl "http://127.0.0.1:PORT/healthz"

## 2) Fordern Sie einmal models an (wenn Sie Authentifizierung aktiviert haben, denken Sie daran, Header hinzuzufügen)
curl "http://127.0.0.1:PORT/v1/models"
```

:::

**Sie sollten sehen**: Das Terminal gibt `{"status":"ok"}` (oder ähnliches JSON) zurück sowie die Antwort von `/v1/models` (erfolgreich oder 401 ist in Ordnung).

### Schritt 2: Öffnen Sie die Monitor-Seite und bestätigen Sie den "Aufzeichnungsstatus"

**Warum**
Proxy Monitor hat einen "Aufzeichnen/Pausieren"-Schalter. Sie müssen zuerst den aktuellen Status bestätigen, sonst könnten Sie weiterhin Anfragen stellen, aber die Liste bleibt immer leer.

Öffnen Sie in Antigravity Tools das **API-Monitoring-Dashboard** in der Seitenleiste (Route `/monitor`).

Ganz oben auf der Seite gibt es einen Button mit einem Punkt:

```
┌───────────────────────────────────────────┐
│  ● Aufzeichnung läuft   [Suchfeld]  [Aktualisieren] [Löschen]      │
└───────────────────────────────────────────┘
```

Wenn Sie "Pausiert" sehen, klicken Sie einmal, um auf "Aufzeichnung läuft" zu wechseln.

**Sie sollten sehen**: Der Button-Status ändert sich zu "Aufzeichnung läuft"; in der Liste beginnen die Anfragendatensätze der vorherigen Anfragen zu erscheinen.

### Schritt 3: Lokalisieren Sie einen Datensatz mit "Suche + Schnellfilter"

**Warum**
Bei der tatsächlichen Fehlerbehebung erinnern Sie sich normalerweise nur an ein Fragment: Der Pfad enthält `messages`, oder der Statuscode ist `401`, oder der Modellname enthält `gemini`. Das Suchfeld ist genau für solche Erinnerungen konzipiert.

Die Suche von Proxy Monitor behandelt Ihre Eingabe als ein "unscharfes Schlüsselwort" und stimmt diese Felder im Backend mit SQL `LIKE` ab:

- `url`
- `method`
- `model`
- `status`
- `account_email`

Sie können einige typische Schlüsselwörter ausprobieren:

- `healthz`
- `models`
- `401` (wenn Sie gerade einen 401 erzeugt haben)

Sie können auch auf die "Schnellfilter"-Buttons klicken: **Nur Fehler / Chat / Gemini / Claude / Bilder**.

**Sie sollten sehen**: Die Liste enthält nur die Art von Anfragen, die Sie erwarten.

### Schritt 4: Öffnen Sie Details, stellen Sie "Anfrage-Nachricht + Antwort-Nachricht" wieder her

**Warum**
Die Liste reicht nur, um zu beantworten "was ist passiert". Um zu beantworten "warum", müssen Sie normalerweise die vollständige Anfrage/Antwort-Payload ansehen.

Klicken Sie auf einen beliebigen Datensatz, und das Detail-Fenster wird angezeigt. Sie können sich auf Folgendes konzentrieren:

- `Protokoll` (OpenAI/Claude/Gemini)
- `Verwendetes Modell` und `Zugeordnetes Modell`
- `Verwendetes Konto`
- `Token-Verbrauch (Eingabe/Ausgabe)`

Kopieren Sie dann mit den Buttons:

- `Anfrage-Nachricht (Request)`
- `Antwort-Nachricht (Response)`

**Sie sollten sehen**: Im Detail gibt es zwei JSON- (oder Text-) Vorschauen; nach dem Kopieren können Sie sie in Tickets/Notizen einfügen, um sie nachzuvollziehen.

### Schritt 5: Wenn Sie "von Grund auf neu reproduzieren" müssen, löschen Sie Protokolle

**Warum**
Bei der Fehlerbehebung haben Sie am meisten Angst vor "alten Daten, die die Beurteilung stören". Nach dem Löschen und erneuten Reproduzieren sind Erfolg/Fehler sehr klar.

Klicken Sie auf den "Löschen"-Button oben, und ein Bestätigungsdialog wird angezeigt.

::: danger Dies ist eine irreversible Operation
Das Löschen entfernt alle Datensätze aus `proxy_logs.db`.
:::

**Sie sollten sehen**: Nach Bestätigung wird die Liste geleert, die statistischen Zahlen kehren zu 0 zurück.

## Kontrollpunkt ✅

- [ ] Sie können Ihre soeben gesendeten `/healthz`- oder `/v1/models`-Datensätze auf `/monitor` sehen
- [ ] Sie können einen bestimmten Datensatz mit dem Suchfeld filtern (z.B. durch Eingabe von `healthz`)
- [ ] Sie können auf einen Datensatz klicken, um Anfrage/Antwort-Nachrichten zu sehen und sie zu kopieren
- [ ] Sie wissen, dass das Löschen von Protokollen alle historischen Datensätze direkt entfernt

## Warnung vor Fallstricken

| Szenario | Mögliches Verständnis (❌) | Tatsächliches Verhalten (✓) |
|--- | --- | ---|
| "Pausiert" = überhaupt kein Monitoring-Overhead | Glauben, dass pausierte Anfragen nicht geparst werden | Pausieren beeinflusst nur, ob in Proxy Monitor-Protokolle geschrieben wird. Aber Anfrage/Antwort-Parsen (einschließlich SSE-Parsen von Streaming-Daten) findet weiterhin statt, nur die geparsten Daten werden nicht gespeichert. Token-Statistiken werden weiterhin aufgezeichnet (unabhängig davon, ob Monitoring aktiviert ist). |
| Binäre/große Body-Protokolle sind leer | Glauben, dass Monitoring kaputt ist | Binäre Anfrage/Antwort wird als `[Binary Request Data]` / `[Binary Response Data]` angezeigt. Antwort-Body über 100 MB wird als `[Response too large (>100MB)]` gekennzeichnet; Anfrage-Body über das Limit wird nicht aufgezeichnet. |
| Wollen Monitor verwenden, um "wer die Anfrage gesendet hat" zu finden | Glauben, dass Sie den Client-Prozess zurückverfolgen können | Monitor zeichnet HTTP-Ebenen-Informationen auf (Methode/Pfad/Modell/Konto), enthält aber nicht "aufrufenden Prozessnamen". Sie müssen die Client-eigenen Protokolle oder System-Netzwerkpaketerfassung kombinieren, um die Quelle zu lokalisieren. |
| Wenn Monitoring aktiviert ist, sind Token-Statistiken-Daten anomal | Glauben, dass dies ein statistischer Fehler ist | Wenn Monitoring aktiviert ist, können Token-Statistiken zweimal aufgezeichnet werden (einmal am Anfang der Monitoring-Funktion, einmal beim asynchronen Schreiben in die Datenbank). Dies ist das Quellcode-Verhalten der aktuellen Version. |

## Export und langfristige Aufbewahrung: Klären Sie zuerst die Fähigkeitsgrenzen

### 1) Was kann die GUI aktuell tun?

In der aktuellen Version der Monitor-UI (`ProxyMonitor.tsx`) können Sie:

- Suchen/Filtern/Blättern
- Details öffnen, um Payload anzuzeigen und zu kopieren
- Alle Protokolle löschen

Aber es gibt **keinen "Export-Button"** (im Quellcode wurden keine entsprechenden UI gefunden).

### 2) Welche Exportfähigkeiten hat das Backend bereits (geeignet für sekundäre Entwicklung)

Die Tauri-Befehle des Backends bieten zwei Exportmethoden:

- `export_proxy_logs(file_path)`: Exportiert "alle Protokolle" aus der Datenbank als JSON-Datei
- `export_proxy_logs_json(file_path, json_data)`: Schreibt das von Ihnen übergebene JSON-Array formatiert in eine Datei (erfordert, dass die Eingabe ein Array-Format sein muss)

Wenn Sie die GUI sekundär entwickeln oder Ihr eigenes Aufrufskript schreiben, können Sie diese Befehle direkt wiederverwenden.

### 3) Die einfachste "Export"-Methode: Sichern Sie direkt `proxy_logs.db`

Da Proxy Monitor im Wesentlichen SQLite ist, können Sie auch `proxy_logs.db` als "Fehlerbehebungs-Evidenzpaket" zusammen sichern (z.B. zusammen mit `token_stats.db`). Die Position des Datenverzeichnisses finden Sie unter **[Erstes Starten müssen Sie verstehen](/de/lbjlaq/Antigravity-Manager/start/first-run-data/)**.

## Empfohlene Lektüre

- Um die Modellzuordnung zu verstehen: **[Modell-Routing: Benutzerdefinierte Zuordnung, Platzhalter-Priorität und vordefinierte Strategien](/de/lbjlaq/Antigravity-Manager/advanced/model-router/)**
- Um Authentifizierungsprobleme zu untersuchen: **[401/Authentifizierungsfehler: auth_mode, Header-Kompatibilität und Client-Konfigurations-Checkliste](/de/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- Um Monitor mit Kostenstatistiken zu kombinieren: Der nächste Abschnitt wird über Token-Stats sprechen (`token_stats.db`)

## Zusammenfassung dieser Lektion

- Der Wert von Proxy Monitor ist "rekonstruierbar": Aufzeichnen von Statuscode/Pfad/Protokoll/Konto/Modellzuordnung/Token-Verbrauch und Bereitstellen von Anfragedetails
- Suche und Schnellfilter sind der Einstieg zur Fehlerbehebung: Verkleinern Sie zuerst den Bereich, klicken Sie dann auf Details, um Payload anzuzeigen
- Löschen von Protokollen ist eine irreversible Operation; Export ist derzeit eher "sekundäre Entwicklungsfähigkeit" und "Sichern der Datenbankdatei"

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Token Stats: Kostenperspektive, Statistik-Maßstäbe und Diagramm-Interpretation](/de/lbjlaq/Antigravity-Manager/advanced/token-stats/)**, um "es fühlt sich teuer an" in quantifizierbare Optimierung zu verwandeln.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| UI: Konfiguration lesen und enable_logging synchronisieren | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L243) | 174-243 |
| UI: Aufzeichnung umschalten (in config schreiben + set_proxy_monitor_enabled) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L254-L267) | 254-267 |
|--- | --- | ---|
| UI: Protokolle löschen (clear_proxy_logs) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L389-L403) | 389-403 |
| UI: Einzeldetails laden (get_proxy_log_detail) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L505-L519) | 505-519 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Konstanten**:
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`: Maximaler Anfrage-Body, den die Monitoring-Middleware lesen kann (über diesen Wert schlägt das Lesen fehl)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`: Maximaler Antwort-Body, den die Monitoring-Middleware lesen kann (für große Antworten wie Bilder)

**Wichtige Funktionen/Befehle**:
- `monitor_middleware(...)`: Sammelt Anfrage und Antwort auf HTTP-Ebene und ruft `monitor.log_request(...)` auf
- `ProxyMonitor::log_request(...)`: Schreibt in Speicher + SQLite und sendet Zusammenfassung über `proxy://request`-Ereignis
- `get_proxy_logs_count_filtered(filter, errors_only)` / `get_proxy_logs_filtered(...)`: Filterung und Blättern auf Listenseite
- `get_proxy_log_detail(log_id)`: Lädt den vollständigen request/response-Body eines einzelnen Protokolls
- `export_proxy_logs(file_path)`: Exportiert alle Protokolle in eine JSON-Datei (aktuelle UI hat keinen Button)

</details>
