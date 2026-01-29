---
title: "429-Fehlerbehandlung: Konto-Rotation und Fehlerbehandlung | Antigravity-Manager"
sidebarTitle: "429-Fehler: automatische Konto-Rotation"
subtitle: "429-Fehlerbehandlung: Konto-Rotation und Fehlerbehandlung"
description: "Lerne die Methoden zur 429-Fehlerbehandlung in Antigravity Tools. Beherrsche die Erkennung und Behandlung von QUOTA_EXHAUSTED, RATE_LIMIT_EXCEEDED und verwandten Fehlern, nutze Monitor und X-Account-Email zur schnellen Problemlösung."
tags:
  - "FAQ"
  - "Fehlerbehandlung"
  - "Konto-Scheduling"
  - "429-Fehler"
prerequisite:
  - "start-getting-started"
  - "advanced-scheduling"
order: 3
---
# 429/Kapazitätsfehler: Richtige Erwartungen an Konto-Rotation und Irrtümer über Modellkapazitätsauslastung

## Was du nach dieser Lektion kannst

- Korrekt zwischen "Kontingent erschöpft" und "Upstream-Rate Limiting" unterscheiden, Fehlinterpretationen vermeiden
- Den automatischen Rotationsmechanismus von Antigravity Tools und das erwartete Verhalten verstehen
- Bei 429-Fehlern wissen, wie du das Problem schnell lokalisierst und die Konfiguration optimierst

## Deine aktuelle Situation

- Du siehst 429-Fehler und fälschlicherweise denkst du, das "Modell hat keine Kapazität mehr"
- Du hast mehrere Konten konfiguriert, triffst aber dennoch häufig auf 429, weißt nicht, ob es ein Konfigurations- oder Kontoproblem ist
- Du weißt nicht, wann das System automatisch das Konto wechselt und wann es "stecken bleibt"

## Kernkonzept

### Was ist ein 429-Fehler?

**429 Too Many Requests** ist ein HTTP-Statuscode. In Antigravity Tools steht 429 nicht nur für "zu viele Anfragen", sondern kann ein Signal für "kannst du vorübergehend nicht verwenden" sein, wie Kontingenterschöpfung, temporäre Modellüberlastung usw.

::: info Der Proxy versucht, den Grund für 429 zu identifizieren

Der Proxy versucht, `error.details[0].reason` oder `error.message` aus dem Antwortkörper zu parsen und 429 grob in mehrere Kategorien einzuteilen (tatsächlich basierend auf der Rückgabe):

| Vom Proxy identifizierter Typ | Häufiger reason / Hinweis | Typisches Merkmal |
|--- | --- | ---|
| **Kontingent erschöpft** | `QUOTA_EXHAUSTED` / Text enthält `exhausted`, `quota` | Möglicherweise muss warten, bis das Kontingent aufgefrischt wird |
| **Ratenbegrenzung** | `RATE_LIMIT_EXCEEDED` / Text enthält `per minute`, `rate limit`, `too many requests` | Meist Abkühlung auf Sekunden-Ebene |
| **Modellkapazität unzureichend** | `MODEL_CAPACITY_EXHAUSTED` / Text enthält `model_capacity` | Meist kurzfristige Überlastung, kann später wiederhergestellt werden |
| **Unbekannt** | Kann nicht geparst werden | Verwendet Standard-Abkühlungsstrategie |

:::

### Automatische Behandlung durch Antigravity Tools

Wenn eine Anfrage auf 429 (und einige 5xx/Überlastungsstatus) stößt, führt der Proxy auf der Serverseite in der Regel zwei Dinge aus:

1. **Abkühlungszeit aufzeichnen**: Schreibt diesen Fehler in `RateLimitTracker`, spätere Kontenauswahl aktiv vermeidet "immer noch abkühlende" Konten.
2. **Kontenrotation im Retry**: Die Handlers führen mehrere Versuche innerhalb einer einzelnen Anfrage durch, beim Retry wird `force_rotate=true` gesetzt, wodurch TokenManager das nächste verfügbare Konto auswählt.

::: tip Wie erkennst du, ob das Konto gewechselt wurde?
Selbst wenn dein Request-Body unverändert bleibt, enthält die Antwort normalerweise `X-Account-Email` (sowie `X-Mapped-Model`). Du kannst damit verifizieren, "welches Konto diese Anfrage tatsächlich verwendet hat".
:::

## Wann treten 429-Fehler auf?

### Szenario 1: Einzelnes Konto zu schnell

**Erscheinung**: Selbst mit nur einem Konto werden in kurzer Zeit viele Anfragen gesendet, was 429 auslöst.

**Grund**: Jedes Konto hat seine eigene Ratenbegrenzung (RPM/TPM), überschritten wird es limitiert.

**Lösung**:
- Kontenanzahl erhöhen
- Anfragehäufigkeit reduzieren
- Fixe-Konto-Modus verwenden, um Druck zu verteilen (siehe "Fixed Account Mode")

### Szenario 2: Alle Konten gleichzeitig limitiert

**Erscheinung**: Mehrere Konten vorhanden, aber alle geben 429 zurück.

**Grund**:
- Gesamtanzahl der Konten reicht nicht aus, um deine Anfragehäufigkeit zu unterstützen
- Alle Konten lösen fast gleichzeitig Rate Limiting/Überlastung aus

**Lösung**:
- Weitere Konten hinzufügen
- Scheduling-Modus auf "PerformanceFirst" ändern (überspringt Sticky Sessions und 60s-Fenster-Wiederverwendung)
- Prüfen, ob der Kontingentschutz verfügbare Konten fälschlicherweise ausschließt

### Szenario 3: Kontingentschutz schließt Konten fälschlicherweise aus

**Erscheinung**: Ein Kontingent eines Kontos ist sehr reichlich, aber das System überspringt es immer wieder.

**Grund**:
- **Kontingentschutz** ist aktiviert, der Schwellenwert ist zu hoch
- Das Kontingent dieses Kontos für ein bestimmtes Modell liegt unter dem Schwellenwert
- Das Konto wurde manuell als `proxy_disabled` markiert

**Lösung**:
- Kontingentschutz-Einstellungen prüfen (Settings → Quota Protection), Schwellenwerte und überwachte Modelle an deine Nutzungsdauer anpassen
- In den Kontodaten `protected_models` prüfen, ob es vom Schutz ausgelöst wurde

## Mach mit

### Schritt 1: 429-Fehlerart identifizieren

**Warum**: Verschiedene Arten von 429-Fehlern benötigen unterschiedliche Behandlungsweisen.

Im Proxy Monitor den Antwortkörper von 429-Fehlern ansehen, besonders auf zwei Arten von Informationen achten:

- **Grund**: `error.details[0].reason` (z. B. `RATE_LIMIT_EXCEEDED`, `QUOTA_EXHAUSTED`) oder `error.message`
- **Wartezeit**: `RetryInfo.retryDelay` oder `details[0].metadata.quotaResetDelay` (falls vorhanden)

```json
{
  "error": {
    "details": [
      {
        "reason": "RATE_LIMIT_EXCEEDED",
        "metadata": {
          "quotaResetDelay": "42s"
        }
      }
    ]
  }
}
```

**Was du sehen solltest**:
- Wenn du eine Wartezeit im Antwortkörper findest (z. B. `RetryInfo.retryDelay` oder `quotaResetDelay`), wartet der Proxy normalerweise kurz, bevor er erneut versucht.
- Wenn keine Wartezeit vorhanden ist, gibt der Proxy diesem Konto einen "Abkühlungszeitraum" gemäß integrierter Strategie und wechselt beim Retry direkt zum nächsten Konto.

### Schritt 2: Konto-Scheduling-Konfiguration prüfen

**Warum**: Die Scheduling-Konfiguration beeinflusst direkt die Rotationshäufigkeit und Priorität der Konten.

Gehe auf die Seite **API Proxy** und sieh dir die Scheduling-Strategie an:

| Konfigurationselement | Beschreibung | Standardwert/Empfehlung |
|--- | --- | ---|
| **Scheduling Mode** | Scheduling-Modus | `Balance` (Standard) |
| **Preferred Account** | Fixe-Konto-Modus | Nicht ausgewählt (Standard) |

**Scheduling-Modus-Vergleich**:

| Modus | Konto-Wiederverwendungsstrategie | Rate-Limit-Verarbeitung | Anwendungsfall |
|--- | --- | --- | ---|
| **CacheFirst** | Sticky Sessions und 60s-Fenster-Wiederverwendung aktiviert | **Bevorzugt warten**, verbessert erheblich Prompt Caching-Trefferquote | Konversationsartig / hohe Cache-Trefferquote erforderlich |
| **Balance** | Sticky Sessions und 60s-Fenster-Wiederverwendung aktiviert | **Sofort wechseln** zu Ersatzkonto, Ausgewogenheit zwischen Erfolgsquote und Leistung | Allgemeiner Fall, Standard |
| **PerformanceFirst** | Überspringt Sticky Sessions und 60s-Fenster-Wiederverwendung, reiner Round-Robin-Modus | Sofort wechseln, Konto-Last am besten verteilt | Hohe Parallelität, zustandslose Anfragen |

::: tip Cache-First vs Balance-Modus
Wenn du Prompt Caching verwendest und die Cache-Trefferquote verbessern möchtest, wähle `CacheFirst` – bei Rate Limits wartet es bevorzugt, statt sofort das Konto zu wechseln. Wenn du die Anfrage-Erfolgsquote wichtiger als den Cache findest, wähle `Balance` – bei Rate Limits wechselt es sofort das Konto.
:::

::: tip Performance-First-Modus
Wenn deine Anfragen zustandslos sind (z. B. Bildgenerierung, unabhängige Abfragen), kannst du `PerformanceFirst` versuchen. Es überspringt Sticky Sessions und 60s-Fenster-Wiederverwendung, sodass aufeinanderfolgende Anfragen eher auf verschiedene Konten fallen.
:::

### Schritt 3: Verifizieren, ob Konto-Rotation normal funktioniert

**Warum**: Sicherstellen, dass das System automatisch Konten wechseln kann.

**Methode 1: Antwort-Header ansehen**

Verwende curl oder deinen eigenen Client, um die Antwort-Header auszugeben, und beobachte, ob sich `X-Account-Email` ändert.

**Methode 2: Logs ansehen**

Öffne die Logdatei (je nach Systemstandort), suche nach `🔄 [Token Rotation]`:

```
🔄 [Token Rotation] Accounts: [
  "account1@example.com(protected=[])",
  "account2@example.com(protected=[])",
  "account3@example.com(protected=[])"
]
```

**Methode 3: Proxy Monitor verwenden**

Auf der Seite **Monitor** die Anfragelogs ansehen, achten auf:
- Ob das Feld **Account** zwischen verschiedenen Konten wechselt
- Ob nach Anfragen mit **Status** 429 erfolgreiche Anfragen mit einem anderen Konto folgen

**Was du sehen solltest**:
- Wenn ein Konto 429 zurückgibt, wechseln nachfolgende Anfragen automatisch zu anderen Konten
- Wenn mehrere Anfragen dasselbe Konto verwenden und alle fehlschlagen, kann es ein Problem mit der Scheduling-Konfiguration sein

### Schritt 4: Konto-Priorität optimieren

**Warum**: System bevorzugt Konten mit hohem Kontingent/hohem Rang, reduziert 429-Wahrscheinlichkeit.

In TokenManager werden Konten vor der Auswahl einmal sortiert (druckt `🔄 [Token Rotation] Accounts: ...`):

1. **Abonnementrang priorisieren**: ULTRA > PRO > FREE
2. **Kontingentprozente priorisieren**: Innerhalb desselben Ranges werden Konten mit höherem Kontingent zuerst angezeigt
3. **Sortierungseingang**: Diese Sortierung erfolgt auf der Proxy-Seite, das endgültig verwendete Konto basiert auf Proxy-Seiten-Sortierung + Verfügbarkeitsbeurteilung.

::: info Prinzip der intelligenten Sortierung (Proxy-Seite)
Priorität ist `ULTRA > PRO > FREE`; innerhalb desselben Abonnementrangs absteigend nach `remaining_quota` (maximaler Restkontingentprozentsatz des Kontos).
:::

**Vorgang**:
- Konten ziehen, um die Anzeigereihenfolge anzupassen (optional)
- Kontingent aktualisieren (Accounts → Alle Kontingente aktualisieren)
- Abonnementrang und Kontingent des Kontos prüfen

## Fallstricke

### ❌ Fehler 1: 429 fälschlicherweise als "Modell hat keine Kapazität" interpretieren

**Erscheinung**: Bei 429-Fehlern glaubt man, das Modell habe keine Kapazität mehr.

**Richtiges Verständnis**:
- 429 ist **Rate Limiting**, kein Kapazitätsproblem
- Weitere Konten können die 429-Wahrscheinlichkeit reduzieren
- Scheduling-Modus anpassen kann Wechselgeschwindigkeit erhöhen

### ❌ Fehler 2: Kontingentschutz-Schwellenwert zu hoch

**Erscheinung**: Kontingent reicht aus, aber System überspringt das Konto weiterhin.

**Grund**: Quota Protection fügt Modelle unter dem Schwellenwert zu `protected_models` des Kontos hinzu, Proxy überspringt beim Scheduling "geschützte Modelle". Wenn der Schwellenwert zu hoch ist, können verfügbare Konten übermäßig ausgeschlossen werden.

**Korrektur**:
- Zurück zu **Settings → Quota Protection**, überwachte Modelle und Schwellenwerte anpassen
- Wenn du genau wissen willst, welche Modelle es schützt, schau in den Kontodaten nach `protected_models`

### ❌ Fehler 3: Fixe-Konto-Modus verhindert Rotation

**Erscheinung**: `Preferred Account` ist gesetzt, aber nach Rate Limit des Kontos bleibt das System "stecken".

**Grund**: Im Fixe-Konto-Modus verwendet das System bevorzugt das angegebene Konto, fällt erst auf Round-Robin zurück, wenn das Konto nicht verfügbar ist.

**Korrektur**:
- Wenn du kein festes Konto benötigst, `Preferred Account` leeren
- Oder sicherstellen, dass das fixe Kontingent des Kontos reicht, Rate Limits vermeiden

## Prüfpunkt ✅

- [ ] Kann zwischen Kontingenterschöpfung und Upstream-Rate Limiting unterscheiden
- [ ] Weiß, wie man 429-Fehlerdetails im Proxy Monitor ansehen kann
- [ ] Versteht die Unterschiede und Anwendungsfälle der drei Scheduling-Modi
- [ ] Weiß, wie man prüft, ob Konto-Rotation normal funktioniert
- [ ] Kann Konto-Priorität optimieren und Kontingentschutz-Strategie prüfen

## Häufige Fragen

### F1: Warum treffe ich auf 429, obwohl ich mehrere Konten habe?

A: Mögliche Gründe:
1. Alle Konten lösen gleichzeitig Rate Limiting aus (Anfragehäufigkeit zu hoch)
2. Aufeinanderfolgende Anfragen unter "60s-Fenster-Wiederverwendung" verwenden wiederholt dasselbe Konto,更容易 das einzelne Konto auf Rate Limiting zu treffen
3. Kontingentschutz schließt verfügbare Konten fälschlicherweise aus
4. Gesamtanzahl der Konten reicht nicht aus, um deine Anfragehäufigkeit zu unterstützen

**Lösung**:
- Weitere Konten hinzufügen
- `PerformanceFirst`-Modus verwenden
- Prüfen, ob Quota Protection die von dir verwendeten Modelle zu `protected_models` hinzugefügt hat (falls erforderlich überwachte Modelle und Schwellenwerte anpassen)
- Anfragehäufigkeit reduzieren

### F2: Werden 429-Fehler automatisch wiederholt?

A: Innerhalb einer einzelnen Anfrage automatisch wiederholt. **Obergrenze der Wiederholungsversuche ist normalerweise 3**, genaue Berechnung ist `min(3, Konten-Poolgröße)`, mindestens 1 Versuch.

**Beispiel für Wiederholungsversuche**:
- Konten-Pool 1 Konto → 1 Versuch (kein Retry)
- Konten-Pool 2 Konten → 2 Versuche (1 Retry)
- Konten-Pool 3 oder mehr Konten → 3 Versuche (2 Retries)

**Rougher Prozess**:
1. Rate-Limit/Überlastungs-Informationen aufzeichnen (in `RateLimitTracker` eingehen)
2. Wenn eine Wartezeit geparst werden kann (z. B. `RetryInfo.retryDelay` / `quotaResetDelay`), wird kurz gewartet, bevor fortgefahren wird
3. Beim Retry Konto erzwungen rotieren (`attempt > 0` löst `force_rotate=true` aus), versucht, die Upstream-Anfrage mit dem nächsten verfügbaren Konto zu initiieren

Wenn alle Versuche fehlschlagen, gibt Proxy den Fehler an den Client zurück; du kannst gleichzeitig weiterhin aus den Antwort-Headern (wie `X-Account-Email`) oder Proxy Monitor die tatsächlich verwendeten Konten sehen.

### F3: Wie kann ich sehen, wie lange ein Konto rate-limited wurde?

A: Es gibt zwei Möglichkeiten:

**Methode 1**: Logs ansehen, nach `rate-limited` suchen

```
🔒 [FIX #820] Preferred account xxx@gmail.com is rate-limited, falling back to round-robin
```

**Methode 2**: Im Log wird verbleibende Wartezeit angezeigt

```
All accounts are currently limited. Please wait 30s.
```

### F4: Sind Kontingentschutz und Rate-Limit dasselbe?

A: Nein.

| Merkmal | Kontingentschutz | Rate-Limit-Tracking |
|--- | --- | ---|
| **Auslösebedingung** | Modellkontingent unter Schwellenwert | 429-Fehler erhalten |
| **Geltungsbereich** | Spezifisches Modell | Ganzes Konto |
| **Dauer** | Bis Kontingent wiederhergestellt | Durch Upstream entschieden (normalerweise Sekunden bis Minuten) |
| **Verhalten** | Modell überspringen | Konto überspringen |

### F5: Wie erzwingt man sofortiges Kontenwechseln?

A: Kann aus dem Winkel "nächste Anfrage leichter Konto wechseln" angehen:

1. **Scheduling-Ebene**: Wechsle zu `PerformanceFirst`, überspringe Sticky Sessions und 60s-Fenster-Wiederverwendung
2. **Fixe-Konto**: Wenn `Preferred Account` aktiviert ist, leere es zuerst, andernfalls wird bevorzugt das fixe Konto verwendet (bis es rate-limited/geschützt)
3. **Konten-Pool**: Kontenanzahl erhöhen, wenn ein Konto rate-limited ist, leichter Ersatzkonto finden

Innerhalb einer einzelnen Anfrage erzwingt der Proxy beim Retry auch eine Rotation (`attempt > 0` löst `force_rotate=true` aus), aber Wiederholungsversuche sind obergrenzenkontrolliert.

## Zusammenfassung dieser Lektion

- 429 in Antigravity Tools ist ein Signal "Upstream vorübergehend nicht verfügbar", kann Rate Limiting, Kontingenterschöpfung, Modellkapazitätsauslastung usw. sein
- Proxy zeichnet Abkühlungszeit auf und versucht bei Retry Konten zu rotieren (aber Wiederholungsversuche sind begrenzt)
- Scheduling-Modus, Quota Protection, Kontenanzahl beeinflussen alle die Wahrscheinlichkeit und Wiederherstellungsgeschwindigkeit, mit der du auf 429 triffst
- Proxy Monitor, Antwort-Header `X-Account-Email` und Logs können Probleme schnell lokalisieren

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[404/Pfad-Inkompatibilität: Base URL, /v1-Präfix und "叠路径"-Clients](../404-base-url/)**.
>
> Du lernst:
> - Wie der häufigste Integrationsfehler (404) entsteht
> - Unterschiede bei der Base URL-Zusammenfügung verschiedener Clients
> - Wie man 404-Probleme schnell behebt

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcodepositionen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilennummern |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| MAX_RETRY_ATTEMPTS Konstantendefinition (OpenAI handler) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L14) | 14 |
| Wiederholungsversuche-Berechnung (max_attempts = min(MAX_RETRY_ATTEMPTS, pool_size)) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L830) | 830 |
| OpenAI handler: Rate Limiting markieren bei 429/5xx und retry/rotieren | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L349-L389) | 349-389 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Konstanten**:
- `MAX_RETRY_ATTEMPTS = 3`：Maximale Wiederholungsversuche innerhalb einer einzelnen Anfrage (OpenAI/Gemini handler)
- `60`：60 Sekunden-Fenster-Wiederverwendung (nur in Modi außer `PerformanceFirst` aktiviert)
- `5`：Token-Timeout-Zeit (Sekunden)
- `300`：Token-früh-Aktualisierungs-Schwellenwert (Sekunden, 5 Minuten)

**Wichtige Funktionen**:
- `parse_retry_delay()`：Retry-Verzögerung aus 429-Fehlerantwort extrahieren
- `get_token_internal()`：Kernlogik der Kontenauswahl und -rotation
- `mark_rate_limited()`：Konto als rate-limited markieren

</details>
