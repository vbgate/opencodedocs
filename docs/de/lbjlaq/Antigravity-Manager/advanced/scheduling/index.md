---
title: "Konto-Scheduling: Hochverfügbarkeitsstrategien | Antigravity-Manager"
sidebarTitle: "Anfragen stabiler machen"
subtitle: "Hochverfügbares Scheduling"
description: "Lerne Antigravity Manager Konto-Scheduling und Hochverfügbarkeitsstrategien. Beherrsche Sticky Sessions, Fixed Accounts und Failure Retry, um die Systemverfügbarkeit zu erhöhen."
tags:
  - "Erweitert"
  - "Scheduling"
  - "Sticky Session"
  - "Konto-Rotation"
  - "Failure Retry"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
  - "advanced-config"
order: 3
---
# Hochverfügbares Scheduling: Rotation, Fixed Accounts, Sticky Sessions und Failure Retry

Nachdem du Antigravity Tools eine Weile als lokalen AI-Gateway verwendet hast, wirst du unweigerlich auf dasselbe Problem stoßen: Weniger Konten bedeuten häufiger 429/401/invalid_grant, mehr Konten machen es unklar, "welches Konto gerade arbeitet", und die Cache-Hit-Rate sinkt.

Diese Lektion klärt das Scheduling-Thema: Wie wählt es Konten aus, was bedeutet "Sticky Session", wann findet eine erzwungene Rotation statt und wie man mit dem "Fixed Account Mode" das Scheduling kontrollierbar macht.

## Was du nach dieser Lektion kannst

- Die 3 Scheduling-Modi von Antigravity Tools in echten Anfragen verstehen
- Wissen, wie der "Session-Fingerprint (session_id)" generiert wird und wie er Sticky-Scheduling beeinflusst
- "Fixed Account Mode" in der GUI aktivieren/deaktivieren und verstehen, welche Scheduling-Logik er überschreibt
- Bei 429/5xx/invalid_grant wissen, wie das System Rate Limiting markiert, wie es retryt und wann rotiert wird

## Deine aktuelle Situation

- Claude Code oder OpenAI SDK laufen plötzlich in 429, beim Retry wird das Konto gewechselt, Cache-Hit-Rate sinkt
- Mehrere Clients laufen Aufgaben parallel, "überschreiben" oft gegenseitig den Konto-Status
- Du möchtest Fehlerbehebung, weiß aber nicht, welches Konto die aktuelle Anfrage bedient
- Du möchtest nur ein "besonders stabiles Konto" verwenden, aber das System rotiert ständig

## Wann du dies benötigst

- Du musst zwischen "Stabilität (weniger Fehler)" und "Cache-Hit (gleiches Konto)" abwägen
- Du möchtest, dass dieselbe Konversation möglichst dasselbe Konto wiederverwendet (weniger Prompt Caching-Jitter)
- Du möchtest Canary/Fehlerbehebung durchführen und alle Anfragen an ein bestimmtes Konto binden

## 🎒 Vorbereitungen vor dem Start

1) Bereite mindestens 2 verfügbare Konten vor (je kleiner der Konten-Pool, desto kleiner der Rotationsraum)
2) Reverse-Proxy läuft (auf der Seite "API Proxy" siehst du Running-Status)
3) Du weißt, wo die Konfigurationsdatei liegt (falls du die Konfiguration manuell ändern musst)

::: tip Hole zuerst die Konfigurations-Lektion nach
Wenn du noch nicht vertraut bist mit `gui_config.json` und welche Konfigurationen per Hot-Reload aktualisiert werden können, lies zuerst **[Konfiguration: AppConfig/ProxyConfig, Speicherort und Hot-Reload-Semantik](/de/lbjlaq/Antigravity-Manager/advanced/config/)**.
:::

## Kernkonzept: Durch welche Schichten des "Scheduling" geht eine Anfrage

Scheduling ist kein "einzelner Schalter", sondern mehrere übereinanderliegende Mechanismen:

1) **SessionManager gibt der Anfrage zuerst einen Session-Fingerprint (session_id)**
2) **Handlers fordern bei jedem Retry vom TokenManager eine erzwungene Rotation** (`attempt > 0`)
3) **TokenManager wählt dann das Konto nach: Fixed Account → Sticky Session → 60s Fenster → Round-robin**
4) **Bei 429/5xx werden Rate-Limit-Informationen aufgezeichnet**, spätere Schedulings überspringen aktivierte Konten aktiv

### Was ist "Session-Fingerprint (session_id)"?

Der **Session-Fingerprint** ist ein "möglichst stabiler Session-Key", um mehrere Anfragen derselben Konversation an dasselbe Konto zu binden.

Bei Claude-Anfragen ist die Priorität:

1) `metadata.user_id` (vom Client explizit übergeben, nicht leer und ohne `"session-"` Präfix)
2) SHA256-Hash der ersten "langen genug" user-Nachricht, dann abgeschnitten zu `sid-xxxxxxxxxxxxxxxx`

Entsprechende Implementierung: `src-tauri/src/proxy/session_manager.rs` (Claude/OpenAI/Gemini haben jeweils eigene Extraktionslogik).

::: info Kleines Detail: Warum nur die erste user-Nachricht?
Der Quellcode schreibt explizit "nur den Inhalt der ersten User-Nachricht hashen, Modellname oder Zeitstamp nicht mischen", damit mehrere Anfragen derselben Konversation möglichst dieselbe session_id generieren und so die Cache-Hit-Rate erhöhen.
:::

### Prioritäten bei der Kontoauswahl durch TokenManager

Der zentrale Einstiegspunkt von TokenManager ist:

- `TokenManager::get_token(quota_group, force_rotate, session_id, target_model)`

Was er tut, lässt sich nach Priorität verstehen:

1) **Fixed Account Mode (Festgelegtes Konto)**: Wenn "Fixed Account Mode" in der GUI aktiviert ist (Laufzeit-Einstellung) und dieses Konto nicht rate-limited und nicht durch Quota-Schutz aktiviert ist, wird es direkt verwendet.
2) **Sticky Session (Session-Binding)**: Wenn `session_id` vorhanden ist und der Scheduling-Modus nicht `PerformanceFirst` ist, wird bevorzugt das Konto wiederverwendet, das an diese Session gebunden ist.
3) **60s globales Fenster-Wiederverwenden**: Wenn kein `session_id` übergeben wurde (oder die Bindung noch nicht erfolgreich war), wird in Nicht-`PerformanceFirst`-Modus versucht, "das zuletzt verwendete Konto" innerhalb von 60 Sekunden wiederverwenden.
4) **Round-robin (Rotation)**: Wenn keines davon zutrifft, wird ein Konto nach einem globalen auto-inkrementierenden Index rotierend ausgewählt.

Zusätzlich gibt es zwei "unsichtbare Regeln", die das Erlebnis stark beeinflussen:

- **Konten werden zuerst sortiert**: ULTRA > PRO > FREE, innerhalb desselben Tier werden Konten mit höherem Restkontingent bevorzugt.
- **Fehlschlag oder Rate-Limit wird übersprungen**: Bereits fehlgeschlagene Konten gelangen in die `attempted`-Sammlung; als rate-limited markierte Konten werden übersprungen.

### Worin unterscheiden sich die 3 Scheduling-Modi wirklich

In der Konfiguration siehst du: `CacheFirst` / `Balance` / `PerformanceFirst`.

Entscheidend ist der "tatsächliche Backend-Zweig von TokenManager", ihr einziger Unterschied ist: **ob Sticky Sessions + 60s-Fenster-Wiederverwendung aktiviert sind**.

- `PerformanceFirst`: Überspringt Sticky Sessions und 60s-Fenster-Wiederverwendung, geht direkt zur Round-robin (und überspringt weiterhin rate-limited/quota-geschützte Konten).
- `CacheFirst` / `Balance`: Beide aktivieren Sticky Sessions und 60s-Fenster-Wiederverwendung.

::: warning Über max_wait_seconds
Im Frontend/Konfigurationsstruktur gibt es `max_wait_seconds`, und die UI erlaubt die Anpassung nur unter `CacheFirst`. Aktuell basiert die Backend-Scheduling-Logik jedoch nur auf dem `mode`-Zweig und liest `max_wait_seconds` nicht.
:::

### Wie Failure Retry und "erzwungene Rotation" zusammenarbeiten

In OpenAI/Gemini/Claude-Handlern wird Retry mit einem ähnlichen Muster behandelt:

- 1. Versuch: `force_rotate = false`
- 2. Versuch und später: `force_rotate = true` (`attempt > 0`), TokenManager überspringt Sticky-Wiederverwendung und sucht direkt das nächste verfügbare Konto

Bei 429/529/503/500 Fehlern:

- Handler rufen `token_manager.mark_rate_limited(...)` auf und zeichnen dieses Konto als "rate-limited/überlastet" auf, spätere Schedulings überspringen es aktiv.
- Der OpenAI-Kompatibilitätspfad versucht auch, `RetryInfo.retryDelay` oder `quotaResetDelay` aus dem Fehler-JSON zu parsen, wartet eine kurze Zeit und setzt dann den Retry fort.
## Mach mit: Scheduling auf "kontrollierbar" einstellen

### Schritt 1: Stelle zuerst sicher, dass du wirklich einen "Konten-Pool" hast

**Warum**
So fortschrittlich das Scheduling auch ist, wenn nur 1 Konto im Pool ist, gibt es keine Auswahl. Viele "Rotation funktioniert nicht/Sticky spürt man nicht"-Ursachen sind zu wenige Konten.

**Vorgehensweise**
Öffne die Seite "Accounts", stelle sicher, dass mindestens 2 Konten im verfügbaren Zustand sind (nicht disabled / proxy disabled).

**Was du sehen solltest**: Mindestens 2 Konten können ihr Kontingent normal aktualisieren, und nach dem Start des Reverse-Proxys ist `active_accounts` nicht 0.

### Schritt 2: Wähle den Scheduling-Modus in der GUI

**Warum**
Der Scheduling-Modus bestimmt, ob "dieselbe Konversation" möglichst dasselbe Konto wiederverwendet oder jedes Mal rotiert.

**Vorgehensweise**
Gehe auf die Seite "API Proxy", finde die Karte "Account Scheduling & Rotation" und wähle einen der Modi:

- `Balance`: Empfohlener Standardwert. In den meisten Fällen stabiler (Session-Stickiness + Rotation bei Fehlschlag).
- `PerformanceFirst`: Wähle diesen bei hoher Parallelität, kurzen Aufgaben, wenn du eher auf Durchsatz als auf Cache achtest.
- `CacheFirst`: Wenn du möchtest, dass "Konversationen möglichst dasselbe Konto haben", kannst du diesen wählen (aktuell gibt es kaum einen Unterschied im Verhalten zum Backend mit `Balance`).

Wenn du die Konfiguration manuell ändern möchtest, ist das entsprechende Fragment:

```json
{
  "proxy": {
    "scheduling": {
      "mode": "Balance",
      "max_wait_seconds": 60
    }
  }
}
```

**Was du sehen solltest**: Nach dem Moduswechsel wird sofort in `gui_config.json` geschrieben, der Reverse-Proxy-Dienst übernimmt es zur Laufzeit (kein Neustart erforderlich).

### Schritt 3: Aktiviere "Fixed Account Mode" (Rotation ausschalten)

**Warum**
Für Fehlerbehebung, Canary-Tests oder wenn du ein bestimmtes Konto "festnageln" und einem bestimmten Client zuweisen möchtest, ist der Fixed Account Mode das direkteste Mittel.

**Vorgehensweise**
Auf derselben Karte aktiviere "Fixed Account Mode" und wähle im Dropdown-Menü ein Konto aus.

Vergiss nicht: Dieser Schalter ist nur verfügbar, wenn der Reverse-Proxy Running ist.

**Was du sehen solltest**: Nachfolgende Anfragen verwenden dieses Konto bevorzugt; wenn es rate-limited oder durch Quota-Schutz aktiviert ist, wird auf Rotation zurückgefallen.

::: info Fixed Account ist eine Laufzeit-Einstellung
Der Fixed Account Mode ist ein **Laufzeit-Zustand** (dynamisch über GUI oder API eingestellt), er wird nicht in `gui_config.json` persistent. Nach dem Neustart des Reverse-Proxys wird das Fixed Account wieder leer (zurück zum Rotationsmodus).
:::
### Schritt 4: Lösche bei Bedarf "Session-Bindungen"

**Warum**
Sticky Sessions speichern `session_id -> account_id` im Speicher. Wenn du auf derselben Maschine verschiedene Experimente durchführst (z. B. Wechseln des Konten-Pools, Wechseln des Modus), können alte Bindungen deine Beobachtung stören.

**Vorgehensweise**
Klicke oben rechts in der Karte "Account Scheduling & Rotation" auf "Clear bindings".

**Was du sehen solltest**: Alte Sessions werden neu zugewiesen (die nächste Anfrage wird neu gebunden).

### Schritt 5: Verwende Antwort-Header, um zu bestätigen "welches Konto gerade bedient"

**Warum**
Du möchtest verifizieren, ob das Scheduling wie erwartet funktioniert; die zuverlässigste Methode ist, den "aktuellen Konto-Bezeichner" vom Server zurückzubekommen.

**Vorgehensweise**
Sende eine nicht-streaming-Anfrage an den OpenAI-kompatiblen Endpunkt und beobachte den `X-Account-Email` in den Antwort-Headern.

```bash
# Beispiel: Minimale OpenAI Chat Completions-Anfrage
# Hinweis: model muss ein Modellname sein, der in deiner aktuellen Konfiguration verfügbar/routbar ist
curl -i "http://127.0.0.1:8045/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-REPLACE_ME" \
  -d '{
    "model": "gemini-3-pro-high",
    "stream": false,
    "messages": [{"role": "user", "content": "hello"}]
  }'
```

**Was du sehen solltest**: In den Antwort-Headern erscheint etwas Ähnliches wie Folgendes (Beispiel):

```text
X-Account-Email: example@gmail.com
X-Mapped-Model: gemini-3-pro-high
```

## Prüfpunkt ✅

- Du kannst klar erklären, welcher Mechanismus welchen bei `fixed account`, `sticky session`, `round-robin` überschreibt
- Du weißt, wie `session_id` zustande kommt (priorisiert `metadata.user_id`, andernfalls Hash der ersten user-Nachricht)
- Bei 429/5xx kannst du erwarten: Das System zeichnet zuerst das Rate-Limit auf, wechselt dann das Konto und retryt
- Du kannst mit `X-Account-Email` verifizieren, welches Konto die aktuelle Anfrage bedient
## Fallstricke

1) **Wenn der Konten-Pool nur 1 hat, erwarte nicht, dass "Rotation dich rettet"**
Rotation bedeutet nur "ein anderes Konto verwenden", wenn es kein zweites Konto im Pool gibt, werden 429/invalid_grant noch häufiger auftreten.

2) **`CacheFirst` bedeutet nicht "ewig warten, bis verfügbar"**
Die aktuelle Backend-Scheduling-Logik neigt bei Rate-Limits dazu, die Bindung aufzulösen und das Konto zu wechseln, statt langfristig zu blockieren und zu warten.

3) **Fixed Account ist nicht absolut erzwungen**
Wenn das Fixed Account als rate-limited markiert ist oder durch Quota-Schutz aktiviert wurde, fällt das System auf Rotation zurück.

## Zusammenfassung dieser Lektion

- Scheduling-Kette: Handler extrahiert `session_id` → `TokenManager::get_token` wählt Konto → bei Fehlern `attempt > 0` erzwungene Rotation
- Deine am häufigsten verwendeten zwei Schalter: Scheduling-Modus (ob Sticky/60s-Wiederverwendung aktiviert ist) + Fixed Account Mode (Konto direkt angeben)
- 429/5xx werden als "Rate-Limit-Status" aufgezeichnet, spätere Schedulings überspringen dieses Konto, bis die Sperrzeit abgelaufen ist

## Vorschau auf die nächste Lektion

> In der nächsten Lektion sehen wir **Modell-Routing**: Wenn du nach außen eine "stabile Modell-Collection" exponieren möchtest sowie Wildcard/Preset-Strategien, wie konfigurierst und fehlerbehebst du dann.
---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilennummern |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| TokenManager: Fixed Account Mode Felder und Initialisierung | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L27-L50) | 27-50 |
|--- | --- | ---|
| TokenManager: invalid_grant automatisch deaktivieren und aus Pool entfernen | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L868-L878) | 868-878 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| OpenAI handler: session_id + erzwungene Rotation bei Retry | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L160-L182) | 160-182 |
|--- | --- | ---|
| Gemini handler: session_id + erzwungene Rotation bei Retry | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L62-L88) | 62-88 |
|--- | --- | ---|
| Claude handler: session_id extrahieren und an TokenManager übergeben | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L517-L524) | 517-524 |
| 429 retry delay Parsen (RetryInfo.retryDelay / quotaResetDelay) | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L37-L66) | 37-66 |
|--- | --- | ---|

**Wichtige Strukturen**:
- `StickySessionConfig`: Scheduling-Modus und Konfigurationsstruktur (`mode`, `max_wait_seconds`)
- `TokenManager`: Konten-Pool, Session-Bindungen, Fixed Account Mode, Rate-Limit-Tracker
- `SessionManager`: Extrahiert `session_id` aus Anfragen

</details>
