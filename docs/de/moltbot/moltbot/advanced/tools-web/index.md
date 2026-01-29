---
title: "Web-Suche und Scraping-Tools: Brave, Perplexity und Web-Inhaltsextraktion | Clawdbot-Tutorial"
sidebarTitle: "KI im Web suchen lassen"
subtitle: "Web-Suche und Scraping-Tools"
description: "Lernen Sie, wie Sie die Tools web_search und web_fetch von Clawdbot konfigurieren und verwenden, damit der KI-Assistent auf Echtzeit-Web-Informationen zugreifen kann. Dieses Tutorial behandelt die Konfiguration von Brave Search API und Perplexity Sonar, Web-Inhaltsextraktion, Caching-Mechanismus und Fehlerbehebung bei häufigen Problemen. Enthält API-Key-Erwerb, Parameterkonfiguration, Regional- und Spracheinstellungen sowie Firecrawl-Fallback-Konfiguration."
tags:
  - "advanced"
  - "tools"
  - "web"
  - "search"
  - "fetch"
prerequisite:
  - "start-getting-started"
order: 230
---

# Web-Suche und Scraping-Tools

## Was Sie nachher tun können

- Konfigurieren Sie das Tool **web_search**, damit der KI-Assistent Brave Search oder Perplexity Sonar für die Websuche verwenden kann
- Konfigurieren Sie das Tool **web_fetch**, damit der KI-Assistant Webinhalte scrapen und extrahieren kann
- Verstehen Sie den Unterschied zwischen den beiden Tools und deren Anwendungsfälle
- Konfigurieren Sie API-Key und erweiterte Parameter (Region, Sprache, Cache-Zeit usw.)
- Beheben Sie häufige Probleme (API-Key-Fehler, Scraping-Fehler, Cache-Probleme usw.)

## Ihr aktuelles Problem

Die Wissensdatenbank des KI-Assistenten ist statisch und kann nicht auf Echtzeit-Web-Informationen zugreifen:

- Die KI kennt die Nachrichten von heute nicht
- Die KI kann die neuesten API-Dokumente oder Technik-Blogs nicht suchen
- Die KI kann die neuesten Inhalte bestimmter Websites nicht abrufen

Sie möchten, dass der KI-Assistent "online geht", wissen aber nicht:

- Soll ich Brave oder Perplexity verwenden?
- Wo bekomme ich den API-Key her? Wie konfiguriere ich ihn?
- Was ist der Unterschied zwischen web_search und web_fetch?
- Wie gehe ich mit dynamischen Webseiten oder Websites um, die eine Anmeldung erfordern?

## Wann verwenden Sie diese Technik

- **web_search**: Wenn Sie schnell Informationen suchen, mehrere Websites durchsuchen, Echtzeit-Daten abrufen müssen (wie Nachrichten, Preise, Wetter)
- **web_fetch**: Wenn Sie den vollständigen Inhalt einer bestimmten Webseite extrahieren, Dokumentationsseiten lesen, Blog-Beiträge analysieren müssen

::: tip Tool-Auswahl-Leitfaden
| Szenario | Empfohlenes Tool | Grund |
|--- | --- | ---|
| Mehrere Quellen suchen | web_search | Gibt mehrere Ergebnisse in einer einzigen Abfrage zurück |
| Inhalt einer einzelnen Seite extrahieren | web_fetch | Ruft vollständigen Text ab, unterstützt Markdown |
| Dynamische Seiten/Anmeldung erforderlich | [browser](../tools-browser/) | Erfordert JavaScript-Ausführung |
| Einfache statische Seiten | web_fetch | Leicht und schnell |
:::

## 🎒 Vorbereitungen

::: warning Voraussetzungen
Dieses Tutorial geht davon aus, dass Sie [Schnellstart](../../start/getting-started/) abgeschlossen, Gateway installiert und gestartet haben.
:::

- Gateway-Daemon läuft
- Grundlegende Kanalkonfiguration abgeschlossen (mindestens ein verfügbarer Kommunikationskanal)
- API-Key von mindestens einem Suchanbieter vorbereitet (Brave oder Perplexity/OpenRouter)

::: info Hinweis
web_search und web_fetch sind **leichtgewichtige Tools**, die kein JavaScript ausführen. Für Websites, die eine Anmeldung erfordern oder komplexe dynamische Seiten, verwenden Sie das [Browser-Tool](../tools-browser/).
:::

## Kernkonzepte

### Unterschied zwischen den beiden Tools

**web_search**: Web-Such-Tool
- Ruft Suchmaschinen (Brave oder Perplexity) auf, um Suchergebnisse zurückzugeben
- **Brave**: Gibt strukturierte Ergebnisse (Titel, URL, Beschreibung, Veröffentlichungsdatum) zurück
- **Perplexity**: Gibt von KI synthetisierte Antworten mit Zitationslinks zurück

**web_fetch**: Web-Inhalt-Scraping-Tool
- Sendet HTTP GET-Anfragen an eine bestimmte URL
- Verwendet den Readability-Algorithmus, um den Hauptinhalt zu extrahieren (entfernt Navigation, Werbung usw.)
- Konvertiert HTML in Markdown oder Klartext
- Führt kein JavaScript aus

### Warum brauchen wir zwei Tools?

```
┌─────────────────┐     web_search      ┌──────────────────┐
│  Benutzer fragt KI│ ──────────────────→  │   Suchmaschinen-API   │
│ "Neueste Nachrichten"│                      │   (Brave/Perplexity) │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   KI erhält 5 Ergebnisse                    Gibt Suchergebnisse zurück
        ↓
┌─────────────────┐     web_fetch       ┌──────────────────┐
│  KI wählt Ergebnis│ ──────────────────→  │   Ziel-Webseite   │
│ "Link 1 öffnen" │                      │   (HTTP/HTTPS)   │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   KI erhält vollständigen Inhalt                    Extrahiert Markdown
```

**Typischer Arbeitsablauf**:
1. KI verwendet **web_search** nach relevanten Informationen zu suchen
2. KI wählt geeignete Links aus den Suchergebnissen aus
3. KI verwendet **web_fetch** um den Inhalt der bestimmten Seite zu scrapen
4. KI beantwortet die Benutzerfrage basierend auf dem Inhalt

### Caching-Mechanismus

Beide Tools enthalten integrierten Cache, um doppelte Anfragen zu reduzieren:

| Tool | Cache-Schlüssel | Standard-TTL | Konfigurationselement |
|--- | --- | --- | ---|
| web_search | `provider:query:count:country:search_lang:ui_lang:freshness` | 15 Minuten | `tools.web.search.cacheTtlMinutes` |
| web_fetch | `fetch:url:extractMode:maxChars` | 15 Minuten | `tools.web.fetch.cacheTtlMinutes` |

::: info Vorteile des Caching
- Reduziert die Anzahl externer API-Aufrufe (spart Kosten)
- Beschleunigt die Antwortzeit (gleiche Abfrage gibt Cache direkt zurück)
- Vermeidet Ratenbegrenzung durch häufige Anfragen
:::

## Folgen Sie mir

### Schritt 1: Suchanbieter auswählen

Clawdbot unterstützt zwei Suchanbieter:

| Anbieter | Vorteile | Nachteile | API-Key |
|--- | --- | --- | ---|
| **Brave** (Standard) | Schnell, strukturierte Ergebnisse, kostenlose Stufe | Traditionelle Suchergebnisse | `BRAVE_API_KEY` |
| **Perplexity** | KI-synthetisierte Antworten, Zitate, Echtzeit | Erfordert Perplexity- oder OpenRouter-Zugriff | `OPENROUTER_API_KEY` oder `PERPLEXITY_API_KEY` |

::: tip Empfohlene Auswahl
- **Anfänger**: Es wird empfohlen, Brave zu verwenden (die kostenlose Stufe reicht für den täglichen Gebrauch)
- **KI-Zusammenfassung benötigt**: Wählen Sie Perplexity (gibt synthetisierte Antworten statt ursprünglicher Ergebnisse zurück)
:::

### Schritt 2: API-Key von Brave Search erhalten

**Warum Brave verwenden**: Große kostenlose Stufe, schnell, strukturierte Ergebnisse einfach zu analysieren

#### 2.1 Für Brave Search API registrieren

1. Besuchen Sie https://brave.com/search/api/
2. Erstellen Sie ein Konto und melden Sie sich an
3. Wählen Sie im Dashboard den Plan **"Data for Search"** (nicht "Data for AI")
4. Generieren Sie API-Key

#### 2.2 API-Key konfigurieren

**Methode A: CLI verwenden (empfohlen)**

```bash
# Interaktiven Konfigurationsassistenten ausführen
clawdbot configure --section web
```

CLI fordert Sie auf, den API-Key einzugeben und speichert ihn in `~/.clawdbot/clawdbot.json`.

**Methode B: Umgebungsvariablen verwenden**

Fügen Sie API-Key zu den Umgebungsvariablen des Gateway-Prozesses hinzu:

```bash
# In ~/.clawdbot/.env hinzufügen
echo "BRAVE_API_KEY=IhrAPIKey" >> ~/.clawdbot/.env

# Gateway neu starten, damit Umgebungsvariablen wirksam werden
clawdbot gateway restart
```

**Methode C: Konfigurationsdatei direkt bearbeiten**

Bearbeiten Sie `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "apiKey": "BRAVE_API_KEY_HERE",
        "provider": "brave"
      }
    }
  }
}
```

**Was Sie sehen sollten**:

- Nach dem Speichern der Konfiguration starten Sie Gateway neu
- Im konfigurierten Kanal (wie WhatsApp) senden Sie Nachricht: "Helfen Sie mir, die neuesten KI-Nachrichten zu suchen"
- Die KI sollte Suchergebnisse zurückgeben (Titel, URL, Beschreibung)

### Schritt 3: Erweiterte Parameter von web_search konfigurieren

Sie können weitere Parameter in `~/.clawdbot/clawdbot.json` konfigurieren:

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,           // Ob aktiviert (Standard true)
        "provider": "brave",       // Suchanbieter
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 5,          // Anzahl der zurückzugebenden Ergebnisse (1-10, Standard 5)
        "timeoutSeconds": 30,       // Zeitlimit (Standard 30)
        "cacheTtlMinutes": 15      // Cache-Zeit (Standard 15 Minuten)
      }
    }
  }
}
```

#### 3.1 Region und Sprache konfigurieren

Machen Sie Suchergebnisse präziser:

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 10,
        // Optional: KI kann diese Werte beim Aufruf überschreiben
        "defaultCountry": "US",   // Standardland (2-stelliger Code)
        "defaultSearchLang": "en",  // Sprache der Suchergebnisse
        "defaultUiLang": "en"      // Sprache der UI-Elemente
      }
    }
  }
}
```

**Häufige Ländercodes**: `US` (USA), `DE` (Deutschland), `FR` (Frankreich), `CN` (China), `JP` (Japan), `ALL` (Global)

**Häufige Sprachcodes**: `en` (Englisch), `zh` (Chinesisch), `fr` (Französisch), `de` (Deutsch), `es` (Spanisch)

#### 3.2 Zeitfilter konfigurieren (Brave-exklusiv)

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        // Optional: KI kann beim Aufruf überschreiben
        "defaultFreshness": "pw"  // Ergebnisse der letzten Woche filtern
      }
    }
  }
}
```

**Freshness-Werte**:
- `pd`: Letzte 24 Stunden
- `pw`: Letzte Woche
- `pm`: Letzter Monat
- `py`: Letztes Jahr
- `YYYY-MM-DDtoYYYY-MM-DD`: Benutzerdefinierter Datumsbereich (z.B. `2024-01-01to2024-12-31`)

### Schritt 4: Perplexity Sonar konfigurieren (optional)

Wenn Sie KI-synthetisierte Antworten bevorzugen, können Sie Perplexity verwenden.

#### 4.1 API-Key erhalten

**Methode A: Direkte Verbindung zu Perplexity**

1. Besuchen Sie https://www.perplexity.ai/
2. Erstellen Sie ein Konto und abonnieren Sie
3. Generieren Sie API-Key in Settings (beginnt mit `pplx-`)

**Methode B: Über OpenRouter (keine Kreditkarte erforderlich)**

1. Besuchen Sie https://openrouter.ai/
2. Erstellen Sie ein Konto und laden Sie auf (unterstützt Kryptowährung oder Vorauszahlung)
3. Generieren Sie API-Key (beginnt mit `sk-or-v1-`)

#### 4.2 Perplexity konfigurieren

Bearbeiten Sie `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "perplexity",
        "perplexity": {
          // API-Key (optional, kann auch über Umgebungsvariablen konfiguriert werden)
          "apiKey": "sk-or-v1-...",  // oder "pplx-..."
          // Base URL (optional, Clawdbot leitet automatisch nach API-Key ab)
          "baseUrl": "https://openrouter.ai/api/v1",  // oder "https://api.perplexity.ai"
          // Modell (Standard perplexity/sonar-pro)
          "model": "perplexity/sonar-pro"
        }
      }
    }
  }
}
```

::: info Automatische Base URL-Inferenz
Wenn Sie `baseUrl` weglassen, wählt Clawdbot automatisch je nach API-Key-Präfix:
- `pplx-...` → `https://api.perplexity.ai`
- `sk-or-...` → `https://openrouter.ai/api/v1`
:::

#### 4.3 Perplexity-Modell auswählen

| Modell | Beschreibung | Anwendungsfall |
|--- | --- | ---|
| `perplexity/sonar` | Schnelle Q&A + Web-Suche | Einfache Abfragen, schnelle Suche |
| `perplexity/sonar-pro` (Standard) | Multi-Schritt-Reasoning + Web-Suche | Komplexe Probleme, erfordert Reasoning |
|--- | --- | ---|

### Schritt 5: web_fetch-Tool konfigurieren

web_fetch ist standardmäßig aktiviert und kann ohne zusätzliche Konfiguration verwendet werden. Aber Sie können Parameter anpassen:

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "enabled": true,           // Ob aktiviert (Standard true)
        "maxChars": 50000,        // Maximale Zeichenanzahl (Standard 50000)
        "timeoutSeconds": 30,       // Zeitlimit (Standard 30)
        "cacheTtlMinutes": 15,     // Cache-Zeit (Standard 15 Minuten)
        "maxRedirects": 3,         // Maximale Weiterleitungen (Standard 3)
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "readability": true         // Ob Readability aktivieren (Standard true)
      }
    }
  }
}
```

#### 5.1 Firecrawl-Fallback konfigurieren (optional)

Wenn die Readability-Extraktion fehlschlägt, können Sie Firecrawl als Fallback verwenden (erfordert API-Key):

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "readability": true,
        "firecrawl": {
          "enabled": true,
          "apiKey": "FIRECRAWL_API_KEY_HERE",  // oder Umgebungsvariable FIRECRAWL_API_KEY festlegen
          "baseUrl": "https://api.firecrawl.dev",
          "onlyMainContent": true,  // Nur Hauptinhalt extrahieren
          "maxAgeMs": 86400000,    // Cache-Zeit (Millisekunden, Standard 1 Tag)
          "timeoutSeconds": 60
        }
      }
    }
  }
}
```

::: tip Vorteile von Firecrawl
- Unterstützt JavaScript-Rendering (erfordert Aktivierung)
- Stärkere Anti-Scraping-Fähigkeit
- Unterstützt komplexe Websites (SPA, Single-Page-Anwendungen)
:::

**Firecrawl API-Key erhalten**:
1. Besuchen Sie https://www.firecrawl.dev/
2. Erstellen Sie ein Konto und generieren Sie API-Key
3. Konfigurieren Sie in der Konfiguration oder verwenden Sie die Umgebungsvariable `FIRECRAWL_API_KEY`

### Schritt 6: Konfiguration überprüfen

**web_search überprüfen**:

Senden Sie Nachricht im konfigurierten Kanal (wie WebChat):

```
Helfen Sie mir, die neuen Funktionen von TypeScript 5.0 zu suchen
```

**Was Sie sehen sollten**:
- Die KI gibt 5 Suchergebnisse zurück (Titel, URL, Beschreibung)
- Wenn Sie Perplexity verwenden, gibt sie von KI zusammengefasste Antworten + Zitationslinks zurück

**web_fetch überprüfen**:

Senden Sie Nachricht:

```
Helfen Sie mir, den Inhalt von https://www.typescriptlang.org/docs/handbook/intro.html abzurufen
```

**Was Sie sehen sollten**:
- Die KI gibt den Inhalt im Markdown-Format dieser Seite zurück
- Der Inhalt hat bereits Navigation, Werbung und andere irrelevante Elemente entfernt

### Schritt 7: Erweiterte Funktionen testen

**Regionalfilter testen**:

```
Suchen Sie nach TypeScript-Schulungskursen in Deutschland
```

Die KI kann den Parameter `country: "DE"` für regionsspezifische Suche verwenden.

**Zeitfilter testen**:

```
Suchen Sie nach Nachrichten im KI-Bereich der letzten Woche
```

Die KI kann den Parameter `freshness: "pw"` verwenden, um Ergebnisse der letzten Woche zu filtern.

**Extraktionsmodus testen**:

```
Rufen Sie https://example.com ab und geben Sie ihn im Klartext-Format zurück
```

Die KI kann den Parameter `extractMode: "text"` verwenden, um Klartext anstelle von Markdown zu erhalten.

## Kontrollpunkt ✅

Stellen Sie sicher, dass die folgende Konfiguration korrekt ist:

- [ ] Gateway läuft
- [ ] Mindestens ein Suchanbieter konfiguriert (Brave oder Perplexity)
- [ ] API-Key korrekt gespeichert (über CLI oder Umgebungsvariablen)
- [ ] web_search-Test erfolgreich (gibt Suchergebnisse zurück)
- [ ] web_fetch-Test erfolgreich (gibt Seiteninhalt zurück)
- [ ] Cache-Konfiguration sinnvoll (übermäßige Anfragen vermeiden)

::: tip Schnelle Überprüfungsbefehle
```bash
# Gateway-Konfiguration anzeigen
clawdbot configure --show

# Gateway-Logs anzeigen
clawdbot gateway logs --tail 50
```
:::

## Fallstricke vermeiden

### Häufiger Fehler 1: API-Key nicht konfiguriert

**Fehlermeldung**:

```json
{
  "error": "missing_brave_api_key",
  "message": "web_search needs a Brave Search API key. Run `clawdbot configure --section web` to store it, or set BRAVE_API_KEY in Gateway environment."
}
```

**Lösung**:

1. Führen Sie `clawdbot configure --section web` aus
2. Geben Sie API-Key ein
3. Starten Sie Gateway neu: `clawdbot gateway restart`

### Häufiger Fehler 2: Scraping-Fehler (dynamische Webseiten)

**Problem**: web_fetch kann Inhalte, die JavaScript erfordern, nicht extrahieren.

**Lösung**:

1. Bestätigen Sie, ob die Website eine SPA (Single-Page-Anwendung) ist
2. Wenn ja, verwenden Sie das [Browser-Tool](../tools-browser/)
3. Oder konfigurieren Sie Firecrawl-Fallback (erfordert API-Key)

### Häufiger Fehler 3: Veralteter Inhalt durch Cache

**Problem**: Suchergebnisse oder extrahierte Inhalte sind alt.

**Lösung**:

1. Passen Sie die Konfiguration `cacheTtlMinutes` an
2. Oder fordern Sie explizit "Cache nicht verwenden" im KI-Dialog
3. Starten Sie Gateway neu, um Speicher-Cache zu leeren

### Häufiger Fehler 4: Anfrage-Zeitlimit überschritten

**Problem**: Zeitüberschreitung beim Scraping großer Seiten oder langsamer Websites.

**Lösung**:

```json5
{
  "tools": {
    "web": {
      "search": {
        "timeoutSeconds": 60
      },
      "fetch": {
        "timeoutSeconds": 60
      }
    }
  }
}
```

### Häufiger Fehler 5: Interne Netzwerk-IP durch SSRF blockiert

**Problem**: Scraping zu internen Netzwerkadressen (wie `http://localhost:8080`) wird blockiert.

**Lösung**:

web_fetch blockiert standardmäßig interne Netzwerk-IPs, um SSRF-Angriffe zu verhindern. Wenn Sie wirklich auf das interne Netzwerk zugreifen müssen:

1. Verwenden Sie das [Browser-Tool](../tools-browser/) (flexibler)
2. Oder bearbeiten Sie die Konfiguration, um bestimmte Hosts zu erlauben (erfordert Änderung am Quellcode)

## Zusammenfassung dieser Lektion

- **web_search**: Web-Such-Tool, unterstützt Brave (strukturierte Ergebnisse) und Perplexity (KI-synthetisierte Antworten)
- **web_fetch**: Web-Inhalt-Scraping-Tool, verwendet Readability, um Hauptinhalt zu extrahieren (HTML → Markdown/text)
- Beide enthalten integrierten Cache (Standard 15 Minuten), reduzieren doppelte Anfragen
- API-Key von Brave kann über CLI, Umgebungsvariablen oder Konfigurationsdatei konfiguriert werden
- Perplexity unterstützt zwei Methoden: direkte Verbindung und OpenRouter
- Für Websites, die JavaScript erfordern, verwenden Sie das [Browser-Tool](../tools-browser/)
- Konfigurationsparameter umfassen: Anzahl der Ergebnisse, Zeitlimit, Region, Sprache, Zeitfilter usw.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Canvas visuelle Oberfläche und A2UI](../canvas/)**.
>
> Sie werden lernen:
> - Canvas A2UI-Push-Mechanismus
> - Bedienung der visuellen Oberfläche
> - Wie man den KI-Assistenten Canvas-Elemente steuern lässt

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um zu erweitern und Quellcode-Ort anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-27

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| SSRF-Schutz | [`src/infra/net/ssrf.ts`](https://github.com/moltbot/moltbot/blob/main/src/infra/net/ssrf.ts) | - |
| Konfigurationsschema | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts) | - |

**Wichtige Konstanten**:

- `DEFAULT_SEARCH_COUNT = 5`: Standardanzahl der Suchergebnisse
- `MAX_SEARCH_COUNT = 10`: Maximale Anzahl der Suchergebnisse
- `DEFAULT_CACHE_TTL_MINUTES = 15`: Standard-Cache-Zeit (Minuten)
- `DEFAULT_TIMEOUT_SECONDS = 30`: Standard-Zeitlimit (Sekunden)
- `DEFAULT_FETCH_MAX_CHARS = 50_000`: Standard-maximale Scraping-Zeichenanzahl

**Wichtige Funktionen**:

- `createWebSearchTool()`: Erstellt web_search-Tool-Instanz
- `createWebFetchTool()`: Erstellt web_fetch-Tool-Instanz
- `runWebSearch()`: Führt Suche aus und gibt Ergebnisse zurück
- `runWebFetch()`: Führt Scraping aus und extrahiert Inhalt
- `normalizeFreshness()`: Normalisiert Zeitfilter-Parameter
- `extractReadableContent()`: Extrahiert Inhalt mit Readability

</details>
