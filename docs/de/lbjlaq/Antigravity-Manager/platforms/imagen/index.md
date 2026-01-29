---
title: "Imagen 3 mit OpenAI Images: Parameter-Mapping | Antigravity"
sidebarTitle: "OpenAI-Images-Stil aufrufen"
subtitle: "Imagen 3-Bildgenerierung: Automatische Zuordnung der OpenAI Images-Parameter size/quality"
description: "Lernen Sie, Imagen 3 mit der OpenAI Images API aufzurufen. Steuern Sie das Seitenverhältnis mit size (Breite×Höhe), die Bildqualität mit quality, und unterstützen Sie b64_json- und url-Rückgabe."
tags:
  - "Imagen 3"
  - "OpenAI Images API"
  - "Bildgenerierung"
  - "Gemini"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-security"
duration: 12
order: 4
---

# Imagen 3-Bildgenerierung: Automatische Zuordnung der OpenAI Images-Parameter size/quality

Möchten Sie Imagen 3 im gewohnten Stil der OpenAI Images API aufrufen? Der lokale Reverse-Proxy von Antigravity Tools stellt `/v1/images/generations` zur Verfügung und ordnet `size` / `quality` automatisch den von Imagen 3 benötigten Seitenverhältnis- und Auflösungseinstellungen zu.

## Was Sie nach diesem Tutorial können

- Generieren Sie Imagen 3-Bilder mit `POST /v1/images/generations`, ohne die Aufrufgewohnheiten Ihrer bestehenden OpenAI-Clients/SDKs zu ändern
- Steuern Sie `aspectRatio` (16:9, 9:16 usw.) stabil mit `size: "BREITExHÖHE"`
- Steuern Sie `imageSize` (Standard/2K/4K) mit `quality: "standard" | "medium" | "hd"`
- Verstehen Sie die zurückgegebenen `b64_json` / `url(data:...)` und bestätigen Sie durch die Antwortheader das tatsächlich verwendete Konto

## Ihr aktuelles Problem

Sie sind vielleicht auf folgende Situationen gestoßen:

- Ihr Client kann nur `/v1/images/generations` von OpenAI aufrufen, aber Sie möchten Imagen 3 verwenden
- Bei gleichem Prompt erhalten Sie manchmal quadratische, manchmal horizontale Bilder – die Seitenverhältniskontrolle ist instabil
- Sie haben `size` als `16:9` geschrieben, aber das Ergebnis ist trotzdem 1:1 (und Sie wissen nicht warum)

## Wann Sie diesen Ansatz verwenden sollten

- Sie verwenden bereits den lokalen Reverse-Proxy von Antigravity Tools und möchten auch die "Bildgenerierung" über das gleiche Gateway leiten
- Sie möchten Tools, die die OpenAI Images API unterstützen (Cherry Studio, Kilo Code usw.), direkt Imagen 3-Bilder generieren lassen

## 🎒 Vorbereitung

::: warning Vorraussetzung
Dieses Tutorial geht davon aus, dass Sie den lokalen Reverse-Proxy bereits starten können und Ihre Base URL kennen (z. B. `http://127.0.0.1:<port>`). Wenn das noch nicht funktioniert, schließen Sie zuerst "Lokalen Reverse-Proxy starten und ersten Client einbinden" ab.
:::

::: info Authentifizierungshinweis
Wenn Sie `proxy.auth_mode` aktiviert haben (z. B. `strict` / `all_except_health`), benötigen Sie beim Aufruf von `/v1/images/generations` Folgendes:

- `Authorization: Bearer <proxy.api_key>`
:::

## Kernkonzept

### Was macht diese "automatische Zuordnung" eigentlich?

Die **OpenAI Images-Zuordnung für Imagen 3** bedeutet: Sie senden weiterhin `prompt/size/quality` gemäß der OpenAI Images API. Der Proxy analysiert `size` als Standardseitenverhältnis (z. B. 16:9), `quality` als Auflösungsstufe (2K/4K) und ruft dann das interne Anforderungsformat, um den Upstream `gemini-3-pro-image` aufzurufen.

::: info Modellinformationen
`gemini-3-pro-image` ist der Modellname von Google Imagen 3 für die Bildgenerierung (aus der README-Dokumentation des Projekts). Im Quellcode wird standardmäßig dieses Modell für die Bildgenerierung verwendet.
:::

### 1) size -> aspectRatio (dynamische Berechnung)

- Der Proxy analysiert `size` als `BREITExHÖHE` und ordnet es dann basierend auf dem Seitenverhältnis einem Standardverhältnis zu.
- Wenn die Analyse von `size` fehlschlägt (z. B. nicht durch `x` getrennt oder ungültige Zahlen), wird auf `1:1` zurückgefallen.

### 2) quality -> imageSize (Auflösungsstufe)

- `quality: "hd"` -> `imageSize: "4K"`
- `quality: "medium"` -> `imageSize: "2K"`
- `quality: "standard"` (oder andere Werte) -> `imageSize` nicht setzen (Standard beibehalten)

### 3) n > 1 bedeutet "n gleichzeitige Anforderungen"

Diese Implementierung verlässt sich nicht auf `candidateCount > 1` des Upstreams, sondern teilt die `n` Generierungen in mehrere gleichzeitige Anforderungen auf und fasst die Ergebnisse dann zu einem OpenAI-kompatiblen `data[]` zusammen.

## Los geht's

### Schritt 1: Bestätigen Sie, dass der Reverse-Proxy läuft (optional, aber dringend empfohlen)

**Warum**
Bestätigen Sie zuerst Ihre Base URL und Ihren Authentifizierungsmodus, um Probleme später nicht fälschlicherweise als "Bildgenerierung fehlgeschlagen" zu interpretieren.

::: code-group

```bash [macOS/Linux]
 # Gesundheitsprüfung (kann ohne Authentifizierung aufgerufen werden, wenn auth_mode=all_except_health)
curl -sS http://127.0.0.1:PORT/healthz
```

```powershell [Windows]
 # Gesundheitsprüfung (kann ohne Authentifizierung aufgerufen werden, wenn auth_mode=all_except_health)
curl.exe -sS http://127.0.0.1:PORT/healthz
```

:::

**Sie sollten sehen**: Ein JSON mit `"status": "ok"`.

### Schritt 2: Starten Sie eine minimale Bildgenerierungsanforderung

**Warum**
Verwenden Sie zuerst die wenigsten Felder, um den Pfad zum Laufen zu bringen, und fügen Sie dann die Parameter Seitenverhältnis/Bildqualität/Anzahl usw. hinzu.

::: code-group

```bash [macOS/Linux]
curl -sS http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

```powershell [Windows]
curl.exe -sS http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

:::

**Sie sollten sehen**: Die Antwort-JSON enthält ein `data`-Array, das wiederum das Feld `b64_json` enthält (der Inhalt ist lang).

### Schritt 3: Bestätigen Sie, welches Konto Sie verwenden (Antwortheader ansehen)

**Warum**
Die Bildgenerierung läuft auch über die Konto-Pool-Planung. Bei der Fehlerbehebung ist es entscheidend zu bestätigen, "welches Konto genau generiert".

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

```powershell [Windows]
curl.exe -i http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

:::

**Sie sollten sehen**: Die Antwortheader enthalten `X-Account-Email: ...`.

### Schritt 4: Steuern Sie das Seitenverhältnis mit size (empfohlen: nur BREITExHÖHE verwenden)

**Warum**
Der Upstream von Imagen 3 erwartet ein standardisiertes `aspectRatio`. Wenn Sie `size` als gängige Breite-Höhe-Kombination angeben, wird es stabil einem Standardverhältnis zugeordnet.

| Von Ihnen übergebener size | Vom Proxy berechnetes aspectRatio |
|--- | ---|
| `"1024x1024"` | `1:1` |
| `"1920x1080"` / `"1280x720"` | `16:9` |
| `"1080x1920"` / `"720x1280"` | `9:16` |
| `"800x600"` | `4:3` |
| `"600x800"` | `3:4` |
| `"2560x1080"` | `21:9` |

**Sie sollten sehen**: Das Seitenverhältnis des Bildes ändert sich mit `size`.

### Schritt 5: Steuern Sie die Auflösungsstufe mit quality (standard/medium/hd)

**Warum**
Sie müssen die internen Felder von Imagen 3 nicht auswendig lernen – mit dem `quality`-Parameter von OpenAI Images können Sie zwischen den Auflösungsstufen wechseln.

| Von Ihnen übergebener quality | Vom Proxy geschriebener imageSize |
|--- | ---|
| `"standard"` | Nicht gesetzt (Upstream-Standard) |
| `"medium"` | `"2K"` |
| `"hd"` | `"4K"` |

**Sie sollten sehen**: `hd` bietet mehr Details (ist aber langsamer und verbraucht mehr Ressourcen – das ist das Verhalten des Upstreams, die tatsächlichen Rückgaben können variieren).

### Schritt 6: Entscheiden Sie, ob Sie b64_json oder url möchten

**Warum**
In dieser Implementierung gibt `response_format: "url"` Ihnen keine öffentlich zugängliche URL, sondern einen Data URI im Format `data:<mime>;base64,...`. Viele Tools eignen sich besser für die direkte Verwendung von `b64_json`.

| response_format | Feld in data[] |
|--- | ---|
| `"b64_json"` (Standard) | `{ "b64_json": "..." }` |
| `"url"` | `{ "url": "data:image/png;base64,..." }` |

## Kontrollpunkt ✅

- Sie können mit `/v1/images/generations` mindestens ein Bild zurückgeben lassen (`data.length >= 1`)
- Sie können `X-Account-Email` in den Antwortheadern sehen und bei Bedarf Probleme mit demselben Konto reproduzieren
- Wenn Sie `size` in `1920x1080` ändern, wird das Bildseitenverhältnis horizontal (16:9)
- Wenn Sie `quality` in `hd` ändern, ordnet der Proxy es zu `imageSize: "4K"`

## Häufige Fehler

### 1) size als 16:9 geschrieben liefert kein 16:9

Die Analyse-Logik für `size` hier trennt nach `BREITExHÖHE`. Wenn `size` nicht in diesem Format vorliegt, wird direkt auf `1:1` zurückgefallen.

| Schreibweise | Ergebnis |
|--- | ---|
| ✓ `"1920x1080"` | 16:9 |
| ❌ `"16:9"` | Rückfall auf 1:1 |

### 2) Ohne Authentifizierung aber mit Authorization, führt auch nicht zum Erfolg

Authentifizierung ist eine Frage des "ob erforderlich":

- `proxy.auth_mode=off`: Mit oder ohne `Authorization` funktioniert beides
- `proxy.auth_mode=strict/all_except_health`: Ohne `Authorization` wird abgelehnt

### 3) Bei n > 1 kann ein "Teilerfolg" auftreten

Die Implementierung führt gleichzeitige Anforderungen durch und fasst die Ergebnisse zusammen: Wenn einige Anforderungen fehlschlagen, können dennoch teilweise Bilder zurückgegeben werden, und die Fehlerursachen werden im Protokoll protokolliert.

## Zusammenfassung

- Rufen Sie Imagen 3 mit `/v1/images/generations` auf – der Schlüssel ist: Verwenden Sie `size` als `BREITExHÖHE` und `quality` als `standard/medium/hd`
- `size` steuert `aspectRatio`, `quality` steuert `imageSize(2K/4K)`
- `response_format=url` gibt einen Data URI zurück, keine öffentliche URL

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen wir **[Audio-Transkription: Einschränkungen und Großpaketverarbeitung bei /v1/audio/transcriptions](../audio/)**.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Erweitern, um Quellcodepositionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Wichtige Felder (aus dem Quellcode)**:
- `size`: Analysiert als `aspectRatio` nach `BREITExHÖHE`
- `quality`: `hd -> 4K`, `medium -> 2K`, andere nicht setzen

</details>
