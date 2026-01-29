---
title: "Token-Statistiken: Kostenüberwachung und Datenanalyse | Antigravity Manager"
sidebarTitle: "Auf einen Blick: Wer am teuersten ist"
subtitle: "Token-Statistiken: Kostenüberwachung und Datenanalyse"
description: "Erfahren Sie, wie Sie die Token-Stats-Funktion verwenden. Erfahren Sie, wie Sie Token-Daten aus Antworten extrahieren, den Verbrauch nach Modell und Konto analysieren, mit Top-Listen die teuersten Modelle und Konten identifizieren und fehlende Statistiken beheben."
tags:
  - "Token Stats"
  - "Kosten"
  - "Überwachung"
  - "SQLite"
  - "Verbrauchsstatistik"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-model-router"
order: 7
---
# Token-Statistiken: Kostenorientierte Statistikdefinitionen und Diagrammanalyse

Sie haben bereits Ihre Clients an Antigravity Tools angeschlossen, aber "wer verursacht die Kosten, wo ist es teurer geworden und hat plötzlich ein Modell extrem zugelegt" lässt sich schwer intuitiv beurteilen. In diesem Lektion geht es nur um eines: Die Datendefinitionen auf der Token-Stats-Seite zu erklären und Ihnen zu zeigen, wie Sie mit Diagrammen schnell Kostenprobleme lokalisieren.

## Was Sie nach diesem Lektion können

- Erklären, woher die Token-Stats-Daten stammen (wann wird aufgezeichnet, in welchen Fällen fehlen Daten)
- Zeitfenster zwischen Stunde/Tag/Woche wechseln, um Fehlentscheidungen durch "nur einen Tag" zu vermeiden
- In den beiden Ansichten "Nach Modell / Nach Konto" mit Trenddiagrammen anomale Spitzenwerte finden
- Mit Top-Listen die teuersten Modelle/Kontos identifizieren und dann im Request-Log nach Ursachen suchen

## Ihre aktuellen Herausforderungen

- Sie fühlen, dass die Aufrufe teurer geworden sind, wissen aber nicht, ob das Modell geändert wurde, das Konto gewechselt wurde oder an einem Tag plötzlich das Volumen gestiegen ist
- Sie haben `X-Mapped-Model` gesehen, sind sich aber nicht sicher, nach welchem Modellstandard die Statistik berechnet wird
- Token-Stats zeigt manchmal 0 oder "keine Daten" an, und Sie wissen nicht, ob kein Verkehr oder keine Statistik erfasst wurde

## Wann Sie diese Methode anwenden

- Sie möchten Kosten optimieren: Quantifizieren Sie zuerst "wer am teuersten ist"
- Sie untersuchen plötzliche Rate-Limits/Anomalien: Verwenden Sie Spitzenzeiten für den Abgleich mit Request-Logs
- Sie haben Änderungen am Modell-Routing oder an der Kontingentverwaltung vorgenommen und möchten überprüfen, ob die Kosten wie erwartet gesunken sind

## Was sind Token-Stats?

**Token-Stats** ist die lokale Verbrauchsstatistikseite von Antigravity Tools: Nach der Weiterleitung von Anforderungen versucht der Proxy, die Token-Anzahl aus `usage/usageMetadata` im Antwort-JSON oder Streaming-Daten zu extrahieren und jede Anforderung nach Konto und Modell in die lokale SQLite (`token_stats.db`) zu schreiben. In der UI werden die Daten dann nach Zeit/Modell/Konto aggregiert angezeigt.

::: info Ein häufiger Fehler im Voraus
Der "Modell"-Standard von Token-Stats stammt aus dem `model`-Feld Ihrer Anfrage (oder der Pfadanalyse von Gemins `/v1beta/models/<model>`), nicht gleich dem `X-Mapped-Model` nach dem Routing.
:::

## 🎒 Vorbereitung vor dem Start

- Sie haben bereits mindestens einen Proxy-Aufruf erfolgreich ausgeführt (nicht nur beim `/healthz`-Check stehen geblieben)
- Ihre Upstream-Antwort gibt Token-Verbrauchs-Felder zurück, die analysiert werden können (andernfalls fehlen die Statistiken)

::: tip Empfohlene Beglektüre
Wenn Sie Modell-Mapping verwenden, um `model` an ein anderes physikalisches Modell zu routen, lesen Sie zuerst **[Modell-Routing: Benutzerdefiniertes Mapping, Wildcard-Priorität und vordefinierte Strategien](/de/lbjlaq/Antigravity-Manager/advanced/model-router/)**. Danach wird die "Statistikdefinition" klarer.
:::

## Kernkonzept

Die Datenkette von Token-Stats lässt sich in drei Abschnitte unterteilen:

1. Proxy-Middleware versucht, Token-Verbrauch aus der Antwort zu extrahieren (kompatibel mit `usage`/`usageMetadata`, Streaming wird ebenfalls analysiert)
2. Wenn gleichzeitig `account_email + input_tokens + output_tokens` verfügbar sind, wird dies in die lokale SQLite geschrieben (`token_stats.db`)
3. UI ruft aggregierte Daten über Tauri `invoke(get_token_stats_*)` ab und zeigt sie nach Stunde/Tag/Woche an

## Mach es mit mir

### Schritt 1: Bestätigen Sie zuerst, dass Sie "Verkehr haben"

**Warum**
Token-Stats-Statistiken stammen aus echten Anforderungen. Wenn Sie nur den Proxy gestartet haben, aber nie eine Modell-Anforderung gesendet haben, zeigt die Seite "keine Daten" an.

Vorgehensweise: Verwenden Sie die Aufrufmethode, die Sie in **[Lokalen Reverse-Proxy starten und ersten Client anschließen](/de/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** bereits erfolgreich validiert haben, und senden Sie 1-2 Anforderungen.

**Was Sie sehen sollten**: Die Token-Stats-Seite ändert sich von "wird geladen/keine Daten" zu Diagrammen oder Listen.

### Schritt 2: Wählen Sie das richtige Zeitfenster (Stunde/Tag/Woche)

**Warum**
Derselben Daten zeigen unter verschiedenen Fenstern völlig unterschiedliche "Spitzenwerte/Trends". Die drei Fenster in der UI entsprechen auch unterschiedlichen Abrufbereichen:

- Stunde: letzte 24 Stunden
- Tag: letzte 7 Tage
- Woche: letzte 4 Wochen (Trend-Ansicht aggregiert nach letzten 30 Tagen)

**Was Sie sehen sollten**: Nach dem Wechsel ändert sich die Granularität der Trend-Diagramm-X-Achse (Stunde zeigt "Uhrzeit", Tag zeigt "Monat/Tag", Woche zeigt "Jahr-W-Nummer").

### Schritt 3: Schauen Sie zuerst auf die Gesamtübersicht, um die "Kostengröße" zu bestimmen

**Warum**
Die Übersichtskarten können zuerst 3 Fragen beantworten: Ist das Gesamtvolumen groß, ist das Verhältnis Eingabe/Ausgabe anomal, und sind die beteiligten Konten/Modelle plötzlich gestiegen.

Konzentrieren Sie sich auf diese Punkte:

- Gesamt-Tokens (`total_tokens`)
- Eingabe/Ausgabe-Tokens (`total_input_tokens` / `total_output_tokens`)
- Anzahl aktiver Konten (`unique_accounts`)
- Anzahl verwendeter Modelle (UI verwendet direkt die Länge der "Nach-Modell-Statistikliste")

**Was Sie sehen sollten**: Wenn die "Anzahl aktiver Konten" plötzlich steigt, bedeutet dies meistens, dass Sie kurzzeitig mehr Konten verwendet haben (z. B. Wechsel auf eine Rotationsstrategie).

### Schritt 4: Verwenden Sie "Verwendungstrends nach Modell/Konto", um anomale Spitzenwerte zu erkennen

**Warum**
Trenddiagramme sind der beste Einstiegspunkt, um "plötzlich teurer geworden" zu erkennen. Sie müssen die Ursache vorher nicht kennen, sondern zuerst feststellen, "an welchem Tag/welcher Stunde es gespitzt hat".

Vorgehensweise:

1. Wechseln Sie im oberen rechten Bereich des Trenddiagramms zwischen "Nach Modell / Nach Konto"
2. Bewegen Sie die Maus darüber (Tooltip), um Top-Werte zu sehen, und achten Sie zuerst auf "diejenige, die plötzlich auf den ersten Platz gesprungen ist"

**Was Sie sehen sollten**:

- Nach Modell: Ein Modell steigt in einem bestimmten Zeitraum plötzlich an
- Nach Konto: Ein Konto steigt in einem bestimmten Zeitraum plötzlich an

### Schritt 5: Verwenden Sie Top-Listen, um das "teuerste Ziel" festzulegen

**Warum**
Trenddiagramme zeigen Ihnen "wann anomale Werte auftreten", Top-Listen zeigen Ihnen "wer am teuersten ist". Wenn Sie diese beiden kreuzen, können Sie schnell den Fehlerbehebungsbereich eingrenzen.

Vorgehensweise:

- In der Ansicht "Nach Modell" sehen Sie die Tabelle "Detaillierte Statistik nach Modell" mit `total_tokens / request_count / Anteil`
- In der Ansicht "Nach Konto" sehen Sie die Tabelle "Detaillierte Statistik nach Konto" mit `total_tokens / request_count`

**Was Sie sehen sollten**: Die teuersten Modelle/Kontos stehen vorne, und `request_count` hilft Ihnen zu unterscheiden, ob "einmal besonders teuer" oder "besonders viele Male".

### Schritt 6 (optional): Finden Sie `token_stats.db` und erstellen Sie eine Sicherung/Prüfung

**Warum**
Wenn Sie vermuten, dass "Statistiken fehlen" oder eine Offline-Analyse durchführen möchten, ist das direkte Verwenden der SQLite-Datei am zuverlässigsten.

Vorgehensweise: Gehen Sie in den Advanced-Bereich von Settings, klicken Sie auf "Datadir öffnen", und Sie finden im Datenverzeichnis `token_stats.db`.

**Was Sie sehen sollten**: In der Dateiliste ist `token_stats.db` enthalten (Dateiname ist vom Backend festgeschrieben).

## Checkpoint ✅

- Sie können erklären, dass Token-Stats-Statistiken "nach Extraktion aus usage/usageMetadata in Antworten in die lokale SQLite geschrieben werden", nicht Cloud-Abrechnung
- Sie können in den beiden Trendansichten "Nach Modell / Nach Konto" einen spezifischen Spitzenwert-Zeitraum angeben
- Sie können mit Top-Listen eine ausführbare Fehlerbehebungsentscheidung geben: Welches Modell oder welches Konto zuerst überprüfen

## Häufige Fehler

| Phänomen | Häufige Ursache | Was Sie tun können |
| --- | --- | --- |
| Token-Stats zeigt "keine Daten" an | Sie haben tatsächlich keine Modell-Anforderungen generiert; oder die Upstream-Antwort enthält keine analysierbaren Token-Felder | Verwenden Sie zuerst einen bereits validierten Client, um Anforderungen zu senden; prüfen Sie dann, ob die Antwort `usage/usageMetadata` enthält |
| Statistik nach "Modell" sieht falsch aus | Statistikstandard verwendet `model` in der Anfrage, nicht `X-Mapped-Model` | Betrachten Sie Modell-Routing als "Anforderungsmodell -> Mapping-Modell"; Statistik zeigt "Anforderungsmodell" |
| Konto-Dimension fehlt | Wird nur geschrieben, wenn `X-Account-Email` verfügbar ist und Token-Verbrauch analysiert wurde | Bestätigen Sie, dass Anforderungen tatsächlich zum Kontenpool gelangt sind; vergleichen Sie dann mit Request-Logs/Antwortheadern |
| Statistiken zu groß nach Aktivierung von Proxy Monitor | Wenn Proxy Monitor aktiviert ist, werden die Token jeder Anforderung zweimal aufgezeichnet | Dies ist ein bekanntes Implementierungsdetail, beeinflusst aber die relative Trendanalyse nicht; wenn Sie genaue Werte benötigen, können Sie Monitor vorübergehend deaktivieren und erneut testen |

## Zusammenfassung dieses Lektions

- Der Kernwert von Token-Stats ist "Kostenprobleme zu quantifizieren", zuerst lokalisieren, dann optimieren
- Beim Schreiben von Statistiken sind Konto und Token-Verbrauch erforderlich; wenn das Modell fehlt, wird es als `"unknown"` aufgezeichnet (verhindert nicht das Schreiben)
- Wenn Sie eine feinere Kostensteuerung wünschen, führen Sie normalerweise als nächsten Schritt zurück zu Modell-Routing oder Kontingentverwaltung

## Vorschau auf das nächste Lektion

> Im nächsten Lektion lösen wir das "implizite Stabilitätsproblem in langen Sitzungen": **[Lange Sitzungsstabilität: Kontextkompression, Signatur-Cache und Kompression von Tool-Ergebnissen](/de/lbjlaq/Antigravity-Manager/advanced/context-compression/)**.

Sie werden lernen:

- Was die drei Schichten der progressiven Kontextkompression jeweils tun
- Warum "Signatur-Cache" 400 Signaturfehler reduzieren kann
- Was bei der Tool-Ergebniskompression gelöscht und was beibehalten wird

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Token-Stats-Seitenroute `/token-stats` | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L19-L47) | 19-47 |
| Token-Stats-UI: Zeitfenster/Ansichtswechsel und Datenabruf | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L49-L166) | 49-166 |
| Token-Stats-UI: Keine-Daten-Hinweis ("keine Daten") | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L458-L507) | 458-507 |
| Token-Verbrauchsextraktion: model aus Anfrage parsen, usage/usageMetadata aus Antwort parsen | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L32-L120) | 32-120 |
| Token-Verbrauchsextraktion: Streaming und JSON-Antwort parsen usage-Felder | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L122-L336) | 122-336 |
| Token-Stats-Schreibpunkt: nach Erhalt von Konto+token in SQLite schreiben | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L79-L136) | 79-136 |
| Datenbankdateiname und Tabellenstruktur: `token_stats.db` / `token_usage` / `token_stats_hourly` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L126) | 58-126 |
| Schreiblogik: `record_usage(account_email, model, input, output)` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L128-L159) | 128-159 |
| Abfragelogik: Stunde/Tag/Woche, nach Konto/nach Modell, Trend und Übersicht | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L161-L555) | 161-555 |
| Tauri-Befehle: `get_token_stats_*` für Frontend verfügbar machen | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L791-L847) | 791-847 |
| Initialisierung der Token-Stats-Datenbank beim App-Start | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L56) | 50-56 |
| Einstellungsseite: Abrufen/Öffnen des Datenverzeichnisses (um `token_stats.db` zu finden) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L76-L143) | 76-143 |

</details>
