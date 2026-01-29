---
title: "Audio-API: Whisper-kompatible Endpunkte | Antigravity-Manager"
subtitle: "Audio-API: Whisper-kompatible Endpunkte"
sidebarTitle: "Audio zu Text in 5 Minuten"
description: "Lernen Sie die Verwendung der Audio-Transkriptions-API von Antigravity-Manager. Beherrschen Sie die Unterstützung von 6 Formaten, die 15 MB-Begrenzung und die Verarbeitung großer Pakete, um Audio schnell in Text umzuwandeln."
tags:
  - "Audio-Transkription"
  - "OpenAI"
  - "Whisper"
  - "Gemini"
  - "API-Proxy"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 5
---
# Audio-Transkription: Einschränkungen und Großpaketverarbeitung bei /v1/audio/transcriptions

Sie können mit dem **Audio-Transkriptionsendpunkt `POST /v1/audio/transcriptions`** Audiodateien in Text umwandeln. Er ähnelt der OpenAI Whisper API, führt aber im lokalen Gateway eine Formatvalidierung und Dateigrößenbegrenzung durch und sendet das Audio als `inlineData` an den Upstream `generateContent`.

## Was Sie nach diesem Tutorial können

- Rufen Sie mit curl / OpenAI SDK `POST /v1/audio/transcriptions` auf, um Audio in `{"text":"..."}` umzuwandeln
- Verstehen Sie die 6 unterstützten Audioformate und die tatsächliche Fehlerform der **15 MB-Hartbegrenzung**
- Kennen Sie die Standardwerte und Durchgabeweise von `model` / `prompt` (kein Raten über Upstream-Regeln)
- Lokalisieren Sie Audioanfragen im Proxy Monitor und verstehen Sie die Herkunft von `[Binary Request Data]`

## Ihr aktuelles Problem

Möchten Sie Meeting-Aufnahmen, Podcasts oder Kundenservice-Anrufe in Text umwandeln, stoßen aber oft auf folgende Probleme:

- Verschiedene Tools haben unterschiedliche Audioformate/Schnittstellenformen, wodurch Skripte und SDKs schwer wiederverwendbar sind
- Beim Upload scheitern sehen Sie nur "Bad Request/Gateway Error", ohne zu wissen, ob das Format falsch ist oder die Datei zu groß
- Möchten Sie die Transkription im "lokalen Gateway" von Antigravity Tools zur einheitlichen Planung und Überwachung einbinden, sind aber unsicher, wie weit die Kompatibilität reicht

## 🎒 Vorbereitung

::: warning Vorraussetzung
- Sie haben bereits [Lokalen Reverse-Proxy starten und ersten Client einbinden](/de/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/) ausgeführt und kennen den Reverse-Proxy-Port (in diesem Beispiel wird `8045` verwendet)
- Sie haben bereits [Konto hinzufügen](/de/lbjlaq/Antigravity-Manager/start/add-account/) ausgeführt und haben mindestens 1 verfügbares Konto
:::

## Was ist der Audio-Transkriptionsendpunkt (/v1/audio/transcriptions)?

Der **Audio-Transkriptionsendpunkt** ist eine von Antigravity Tools bereitgestellte OpenAI Whisper-kompatible Route. Clients laden Audiodateien mit `multipart/form-data` hoch. Der Server validiert die Erweiterung und Größe, wandelt das Audio in Base64-`inlineData` um, ruft dann den Upstream `generateContent` auf und gibt schließlich nur ein `text`-Feld zurück.

## Endpunkt und Einschränkungen im Überblick

| Projekt | Ergebnis | Code-Nachweis |
| --- | --- | --- |
| Eingangsroute | `POST /v1/audio/transcriptions` | `src-tauri/src/proxy/server.rs` registriert Route zu `handlers::audio::handle_audio_transcription` |
| Unterstützte Formate | Erkennung über Dateierweiterung: `mp3/wav/m4a/ogg/flac/aiff(aif)` | `src-tauri/src/proxy/audio/mod.rs` `detect_mime_type()` |
| Dateigröße | **15 MB-Hartbegrenzung** (bei Überschreitung wird 413 + Textfehlermeldung zurückgegeben) | `src-tauri/src/proxy/audio/mod.rs` `exceeds_size_limit()`；`src-tauri/src/proxy/handlers/audio.rs` |
| Gesamter body-Limit des Reverse-Proxys | Axum-Ebene erlaubt bis zu 100 MB | `src-tauri/src/proxy/server.rs` `DefaultBodyLimit::max(100 * 1024 * 1024)` |
| Standardparameter | `model="gemini-2.0-flash-exp"`；`prompt="Generate a transcript of the speech."` | `src-tauri/src/proxy/handlers/audio.rs` |

## Los geht's

### Schritt 1: Bestätigen Sie, dass das Gateway läuft (/healthz)

**Warum**
Schließen Sie Probleme wie falscher Port/Dienst nicht gestartet vorab aus.

::: code-group

```bash [macOS/Linux]
curl -s http://127.0.0.1:8045/healthz
```

```powershell [Windows]
curl http://127.0.0.1:8045/healthz
```

:::

**Sie sollten sehen**: Ein JSON ähnlich wie `{"status":"ok"}`.

### Schritt 2: Bereiten Sie eine Audiodatei vor, die 15 MB nicht überschreitet

**Warum**
Der Server führt im Prozessor eine 15 MB-Validierung durch; bei Überschreitung wird direkt 413 zurückgegeben.

::: code-group

```bash [macOS/Linux]
ls -lh audio.mp3
```

```powershell [Windows]
Get-Item audio.mp3 | Select-Object Length
```

:::

**Sie sollten sehen**: Die Dateigröße überschreitet nicht `15 MB`.

### Schritt 3: Rufen Sie /v1/audio/transcriptions mit curl auf

**Warum**
curl ist am direktesten, ermöglicht Ihnen die Überprüfung der Protokollform und Fehlermeldungen.

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3" \
  -F "model=gemini-2.0-flash-exp" \
  -F "prompt=Generate a transcript of the speech."
```

**Sie sollten sehen**: Das zurückgegebene JSON enthält nur ein `text`-Feld.

```json
{
  "text": "..."
}
```

### Schritt 4: Rufen Sie mit dem OpenAI Python SDK auf

```python
from openai import OpenAI

client = OpenAI(
  base_url="http://127.0.0.1:8045/v1",
  api_key="your-proxy-api-key"  # Wenn Authentifizierung aktiviert
)

audio_file = open("audio.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="gemini-2.0-flash-exp",
  file=audio_file
)

print(transcript.text)
```

**Sie sollten sehen**: `print(transcript.text)` gibt einen Transkriptionstext aus.

## Unterstützte Audioformate

Antigravity Tools bestimmt den MIME-Typ über die Dateierweiterung (nicht durch Sniffing des Dateiinhalts).

| Format | MIME-Typ | Erweiterung |
| --- | --- | --- |
| MP3 | `audio/mp3` | `.mp3` |
| WAV | `audio/wav` | `.wav` |
| AAC (M4A) | `audio/aac` | `.m4a` |
| OGG | `audio/ogg` | `.ogg` |
| FLAC | `audio/flac` | `.flac` |
| AIFF | `audio/aiff` | `.aiff`, `.aif` |

::: warning Nicht unterstützte Formate
Wenn die Erweiterung nicht in der Tabelle enthalten ist, wird `400` zurückgegeben, der Antwortkörper ist ein Text, z. B.: `Nicht unterstütztes Audioformat: txt`.
:::

## Kontrollpunkt ✅

- [ ] Der Antwortkörper ist `{"text":"..."}` (keine zusätzlichen Strukturen wie `segments`, `verbose_json`)
- [ ] Die Antwortheader enthalten `X-Account-Email` (markiert das tatsächlich verwendete Konto)
- [ ] Diese Anfrage kann im "Monitor"-Bereich gesehen werden

## Verarbeitung großer Pakete: Warum Sie 100 MB sehen, aber bei 15 MB hängenbleiben

Der Server hat die Anforderungs-Obergrenze auf Axum-Ebene auf 100 MB erhöht (um zu verhindern, dass einige große Anforderungen vom Framework direkt abgelehnt werden), aber der Audio-Transkriptionsprozessor führt zusätzlich eine **15 MB-Validierung** durch.

Das bedeutet:

- `15 MB < Datei <= 100 MB`: Die Anfrage gelangt in den Prozessor, aber es wird `413` + Textfehlermeldung zurückgegeben
- `Datei > 100 MB`: Die Anfrage kann direkt auf Frameworkebene fehlschlagen (keine Garantie für die genaue Fehlerform)

### Was Sie sehen, wenn 15 MB überschritten werden

Der Statuscode `413 Payload Too Large` wird zurückgegeben, der Antwortkörper ist ein Text (kein JSON), der Inhalt ähnelt:

```
Audiodatei zu groß (18.5 MB). Maximal 15 MB unterstützt (ca. 16 Minuten MP3). Empfehlung: 1) Audioqualität komprimieren 2) In Segmenten hochladen
```

### Zwei ausführbare Aufteilungsmethoden

1) Audioqualität komprimieren (WAV in kleineres MP3 konvertieren)

```bash
ffmpeg -i input.wav -b:a 64k -ac 1 output.mp3
```

2) Aufteilen (lange Audiodateien in mehrere Segmente schneiden)

```bash
ffmpeg -i long_audio.mp3 -f segment -segment_time 600 -c copy segment_%03d.mp3
```

## Hinweise zur Protokollerfassung

### Warum Sie im Monitor oft keinen echten Anforderungskörper sehen

Die Monitor-Middleware liest den **POST-Anforderungskörper** zuerst für die Protokollierung aus:

- Wenn der Anforderungskörper als UTF-8-Text analysiert werden kann, wird der Originaltext protokolliert
- Andernfalls wird er als `[Binary Request Data]` protokolliert

Die Audio-Transkription verwendet `multipart/form-data`, das binäre Audioinhalte enthält, fällt also leicht in den zweiten Fall.

### Was Sie im Monitor sehen sollten

```
URL: /v1/audio/transcriptions
Request Body: [Binary Request Data]
Response Body: {"text":"..."}
```

::: info Protokollbegrenzungen
Das Audio selbst ist im Protokoll nicht sichtbar, aber Sie können immer noch mit `status/duration/X-Account-Email` schnell beurteilen: Ist es Protokollinkompatibilität, zu große Datei oder Upstream-Fehler.
:::

## Parameterbeschreibung (keine "erfahrungsbedingte Ergänzung")

Dieser Endpunkt liest explizit nur 3 Formularfelder:

| Feld | Erforderlich | Standardwert | Verarbeitungsweise |
| --- | --- | --- | --- |
| `file` | ✅ | Keiner | Muss bereitgestellt werden; bei Fehlen wird `400` + Text `Audiodatei fehlt` zurückgegeben |
| `model` | ❌ | `gemini-2.0-flash-exp` | Wird als Zeichenkette durchgereicht und nimmt an der Token-Ermittlung teil (konkrete Upstream-Regeln richten sich nach der tatsächlichen Antwort) |
| `prompt` | ❌ | `Generate a transcript of the speech.` | Wird als erster `text` an den Upstream gesendet, um die Transkription zu leiten |

## Warnungen vor Fallstricken

### ❌ Fehler 1: Falsche curl-Parameter verwendet, wodurch es kein multipart ist

```bash
# Fehler: Direkt mit -d
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -d "file=@audio.mp3"
```

Richtige Vorgehensweise:

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3"
```

### ❌ Fehler 2: Dateierweiterung nicht in der Unterstützungsliste

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@document.txt"
```

Richtige Vorgehensweise: Laden Sie nur Audiodateien hoch (`.mp3`, `.wav` usw.).

### ❌ Fehler 3: 413 als "Gateway kaputt" interpretieren

`413` bedeutet hier meistens, dass die 15 MB-Validierung ausgelöst wurde. Komprimieren/Teilen ist schneller als blindes Wiederholen.

## Zusammenfassung dieser Lektion

- **Kernendpunkt**: `POST /v1/audio/transcriptions` (Whisper-kompatible Form)
- **Formatunterstützung**: mp3, wav, m4a, ogg, flac, aiff (aif)
- **Größenbegrenzung**: 15 MB (bei Überschreitung wird `413` + Textfehlermeldung zurückgegeben)
- **Protokollverhalten**: Wenn multipart binäre Inhalte enthält, zeigt der Monitor `[Binary Request Data]` an
- **Schlüsselparameter**: `file` / `model` / `prompt` (Standardwerte siehe obige Tabelle)

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen wir **[MCP-Endpunkte: Web Search/Reader/Vision als aufrufbare Tools verfügbar machen](../mcp/)**.
>
> Sie werden lernen:
> - Die Routenform und Authentifizierungsstrategie von MCP-Endpunkten
> - Ob Web Search/Web Reader/Vision "Upstream-Weiterleitung" oder "integrierte Tools" verwenden
> - Welche Fähigkeiten experimentativ sind und in der Produktion nicht versehentlich verwendet werden sollten

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Erweitern, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Routenregistrierung (/v1/audio/transcriptions + body limit) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Audio-Transkriptionsprozessor (multipart/15MB/inlineData) | [`src-tauri/src/proxy/handlers/audio.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/audio.rs#L16-L162) | 16-162 |
| Unterstützte Formate (Erweiterung -> MIME + 15MB) | [`src-tauri/src/proxy/audio/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/audio/mod.rs#L6-L35) | 6-35 |
| Monitor-Middleware (Binary Request Data) | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |

**Wichtige Konstanten**:
- `MAX_SIZE = 15 * 1024 * 1024`: Begrenzung der Audiodateigröße (15 MB)
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`: Obergrenze für das Lesen des POST-Anforderungskörpers durch Monitor (100 MB)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`: Obergrenze für das Lesen des Antwortkörpers durch Monitor (100 MB)

**Wichtige Funktionen**:
- `handle_audio_transcription()`: Analysiert multipart, validiert Erweiterung und Größe, setzt `inlineData` zusammen und ruft Upstream auf
- `AudioProcessor::detect_mime_type()`: Erweiterung -> MIME
- `AudioProcessor::exceeds_size_limit()`: 15 MB-Validierung
- `monitor_middleware()`: Lässt Anforderungs-/Antwortkörper in Proxy Monitor fallen (nur UTF-8 wird vollständig protokolliert)

</details>
