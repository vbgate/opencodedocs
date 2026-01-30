---
title: "API-Spezifikation: Antigravity Gateway Interface Technische Referenz | antigravity-auth"
sidebarTitle: "API-Aufrufe debuggen"
subtitle: "Antigravity API-Spezifikation"
description: "Lernen Sie die Antigravity API-Spezifikation kennen und beherrschen Sie die Endpunktkonfiguration des einheitlichen Gateway-Interfaces, OAuth 2.0-Authentifizierung, Request-Response-Formate, Funktionsaufrufregeln und Fehlerbehandlungsmechanismen."
tags:
  - "API"
  - "Spezifikation"
  - "Antigravity"
  - "Technische Referenz"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity API-Spezifikation

> **⚠️ Wichtiger Hinweis**: Dies ist die **interne API-Spezifikation** von Antigravity, keine öffentliche Dokumentation. Dieses Tutorial basiert auf direkten API-Tests und ist für Entwickler gedacht, die tiefgehende API-Details verstehen müssen.

Wenn Sie nur das Plugin verwenden möchten, lesen Sie bitte [Schnellstart](/de/NoeFabris/opencode-antigravity-auth/start/quick-install/) und [Konfigurationsanleitung](/de/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/).

---

## Was Sie nach diesem Kurs erreichen können

- Die Funktionsweise der Antigravity Unified Gateway API verstehen
- Request/Response-Formate und JSON-Schema-Einschränkungen beherrschen
- Wissen, wie Thinking-Modelle und Funktionsaufrufe konfiguriert werden
- Die Mechanismen von Rate Limiting und Fehlerbehandlung verstehen
- API-Aufrufprobleme debuggen können

---

## Antigravity API-Übersicht

**Antigravity** ist Googles Unified Gateway API, die über ein Gemini-Style-Interface Zugriff auf mehrere KI-Modelle wie Claude und Gemini bietet und ein einheitliches Format sowie eine einheitliche Antwortstruktur bereitstellt.

::: info Unterschied zu Vertex AI
Antigravity ist **nicht** die direkte Modell-API von Vertex AI. Es ist ein internes Gateway, das Folgendes bietet:
- Einheitliches API-Format (alle Modelle im Gemini-Stil)
- Projektzugriff (über Google Cloud-Authentifizierung)
- Internes Routing zu Modell-Backends (Vertex AI für Claude, Gemini API für Gemini)
- Einheitliches Antwortformat (`candidates[]`-Struktur)
:::

**Kernfunktionen**:

| Funktion | Beschreibung |
| --- | --- |
| **Einheitliches API-Format** | Alle Modelle verwenden das Gemini-Style `contents`-Array |
| **Projektzugriff** | Benötigt eine gültige Google Cloud Project ID |
| **Internes Routing** | Automatisches Routing zum richtigen Backend (Vertex AI oder Gemini API) |
| **Einheitliche Antwort** | Alle Modelle geben eine `candidates[]`-Struktur zurück |
| **Thinking-Unterstützung** | Claude und Gemini 3 unterstützen erweitertes Reasoning |

---

## Endpunkte und Pfade

### API-Umgebungen

| Umgebung | URL | Status | Verwendung |
| --- | --- | --- | --- |
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ Aktiv | Haupt-Endpunkt (konsistent mit CLIProxy) |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ Aktiv | Gemini CLI-Modelle, loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ Nicht verfügbar | Veraltet |

**Quellcode-Speicherort**: [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### API-Pfade

| Aktion | Pfad | Beschreibung |
| --- | --- | --- |
| Inhalt generieren | `/v1internal:generateContent` | Nicht-Streaming-Request |
| Streaming-Generierung | `/v1internal:streamGenerateContent?alt=sse` | Streaming-Request (SSE) |
| Code-Assistent laden | `/v1internal:loadCodeAssist` | Projekt-Discovery (automatische Project ID-Ermittlung) |
| Benutzer-Onboarding | `/v1internal:onboardUser` | Benutzer-Onboarding (normalerweise nicht verwendet) |

---

## Authentifizierung

### OAuth 2.0-Ablauf

```
Autorisierungs-URL: https://accounts.google.com/o/oauth2/auth
Token-URL: https://oauth2.googleapis.com/token
```

### Erforderliche Scopes

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**Quellcode-Speicherort**: [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### Erforderliche Headers

#### Antigravity-Endpunkt (Standard)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Gemini CLI-Endpunkt (Modelle ohne `:antigravity`-Suffix)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### Zusätzlicher Header für Streaming-Requests

```http
Accept: text/event-stream
```

**Quellcode-Speicherort**: [`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## Request-Format

### Grundstruktur

```json
{
  "project": "{project_id}",
  "model": "{model_id}",
  "request": {
    "contents": [...],
    "generationConfig": {...},
    "systemInstruction": {...},
    "tools": [...]
  },
  "userAgent": "antigravity",
  "requestId": "{unique_id}"
}
```

### Contents-Array (erforderlich)

::: warning Wichtige Einschränkung
Sie **müssen** das **Gemini-Style-Format** verwenden. Das Anthropic-Style `messages`-Array wird **nicht unterstützt**.
:::

**Korrektes Format**:

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Your message here" }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "Assistant response" }
      ]
    }
  ]
}
```

**Role-Werte**:
- `user` - Benutzer-/Menschliche Nachricht
- `model` - Modellantwort (**nicht** `assistant`)

### Generation Config

```json
{
  "generationConfig": {
    "maxOutputTokens": 1000,
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "stopSequences": ["STOP"],
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `maxOutputTokens` | number | Maximale Token-Anzahl der Antwort |
| `temperature` | number | Zufälligkeit (0.0 - 2.0) |
| `topP` | number | Nucleus Sampling-Schwellenwert |
| `topK` | number | Top-K Sampling |
| `stopSequences` | string[] | Trigger-Wörter zum Stoppen der Generierung |
| `thinkingConfig` | object | Erweiterte Reasoning-Konfiguration (Thinking-Modelle) |

### System Instructions

::: warning Format-Einschränkung
System Instruction **muss ein Objekt mit `parts` sein**, **nicht** ein reiner String.
:::

```json
// ✅ Korrekt
{
  "systemInstruction": {
    "parts": [
      { "text": "You are a helpful assistant." }
    ]
  }
}

// ❌ Falsch - gibt 400-Fehler zurück
{
  "systemInstruction": "You are a helpful assistant."
}
```

### Tools / Function Calling

```json
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "get_weather",
          "description": "Get weather for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "City name"
              }
            },
            "required": ["location"]
          }
        }
      ]
    }
  ]
}
```

#### Funktionsnamen-Regeln

| Regel | Beschreibung |
| --- | --- |
| Erstes Zeichen | Muss ein Buchstabe (a-z, A-Z) oder Unterstrich (_) sein |
| Erlaubte Zeichen | `a-zA-Z0-9`, Unterstrich (_), Punkt (.), Doppelpunkt (:), Bindestrich (-) |
| Maximale Länge | 64 Zeichen |
| Nicht erlaubt | Schrägstrich (/), Leerzeichen, andere Sonderzeichen |

**Beispiele**:
- ✅ `get_weather` - Gültig
- ✅ `mcp:mongodb.query` - Gültig (Doppelpunkt und Punkt erlaubt)
- ✅ `read-file` - Gültig (Bindestrich erlaubt)
- ❌ `mcp/query` - Ungültig (Schrägstrich nicht erlaubt)
- ❌ `123_tool` - Ungültig (muss mit Buchstabe oder Unterstrich beginnen)

---

## JSON-Schema-Unterstützung

### Unterstützte Funktionen

| Funktion | Status | Beschreibung |
| --- | --- | --- |
| `type` | ✅ Unterstützt | `object`, `string`, `number`, `integer`, `boolean`, `array` |
| `properties` | ✅ Unterstützt | Objekteigenschaften |
| `required` | ✅ Unterstützt | Array erforderlicher Felder |
| `description` | ✅ Unterstützt | Feldbeschreibung |
| `enum` | ✅ Unterstützt | Aufzählungswerte |
| `items` | ✅ Unterstützt | Array-Element-Schema |
| `anyOf` | ✅ Unterstützt | Intern zu `any_of` konvertiert |
| `allOf` | ✅ Unterstützt | Intern zu `all_of` konvertiert |
| `oneOf` | ✅ Unterstützt | Intern zu `one_of` konvertiert |
| `additionalProperties` | ✅ Unterstützt | Zusätzliche Eigenschaften-Schema |

### Nicht unterstützte Funktionen (führen zu 400-Fehler)

::: danger Folgende Felder verursachen 400-Fehler
- `const` - Verwenden Sie stattdessen `enum: [value]`
- `$ref` - Inline-Schema-Definitionen
- `$defs` / `definitions` - Inline-Definitionen
- `$schema` - Diese Metadaten-Felder entfernen
- `$id` - Diese Metadaten-Felder entfernen
- `default` - Diese Dokumentationsfelder entfernen
- `examples` - Diese Dokumentationsfelder entfernen
- `title` (verschachtelt) - ⚠️ Kann in verschachtelten Objekten Probleme verursachen
:::

```json
// ❌ Falsch - gibt 400-Fehler zurück
{ "type": { "const": "email" } }

// ✅ Korrekt - verwenden Sie enum stattdessen
{ "type": { "enum": ["email"] } }
```

**Plugin-Automatisierung**: Das Plugin behandelt diese Konvertierungen automatisch über die Funktion `cleanJSONSchemaForAntigravity()` in `request-helpers.ts`.

---

## Response-Format

### Nicht-Streaming-Antwort

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            { "text": "Response text here" }
          ]
        },
        "finishReason": "STOP"
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 16,
      "candidatesTokenCount": 4,
      "totalTokenCount": 20
    },
    "modelVersion": "claude-sonnet-4-5",
    "responseId": "msg_vrtx_..."
  },
  "traceId": "abc123..."
}
```

### Streaming-Antwort (SSE)

**Content-Type**: `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Hello"}]}}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " world"}]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### Response-Felder-Erklärung

| Feld | Beschreibung |
| --- | --- |
| `response.candidates` | Array von Antwort-Kandidaten |
| `response.candidates[].content.role` | Immer `"model"` |
| `response.candidates[].content.parts` | Array von Inhalts-Teilen |
| `response.candidates[].finishReason` | `STOP`, `MAX_TOKENS`, `OTHER` |
| `response.usageMetadata.promptTokenCount` | Anzahl der Eingabe-Token |
| `response.usageMetadata.candidatesTokenCount` | Anzahl der Ausgabe-Token |
| `response.usageMetadata.totalTokenCount` | Gesamtanzahl der Token |
| `response.usageMetadata.thoughtsTokenCount` | Thinking-Token-Anzahl (Gemini) |
| `response.modelVersion` | Tatsächlich verwendetes Modell |
| `response.responseId` | Request-ID (Format variiert je nach Modell) |
| `traceId` | Trace-ID für Debugging |

### Response-ID-Formate

| Modelltyp | Format | Beispiel |
| --- | --- | --- |
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Base64-Stil | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Base64-Stil | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Function Call-Antwort

Wenn das Modell eine Funktion aufrufen möchte:

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            {
              "functionCall": {
                "name": "get_weather",
                "args": {
                  "location": "Paris"
                },
                "id": "toolu_vrtx_01PDbPTJgBJ3AJ8BCnSXvUqk"
              }
            }
          ]
        },
        "finishReason": "OTHER"
      }
    ]
  }
}
```

### Funktionsergebnis bereitstellen

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "What's the weather?" }] },
    { "role": "model", "parts": [{ "functionCall": { "name": "get_weather", "args": {...}, "id": "..." } }] },
    { "role": "user", "parts": [{ "functionResponse": { "name": "get_weather", "id": "...", "response": { "temperature": "22C" } } }] }
  ]
}
```

---

## Thinking / Erweitertes Reasoning

### Thinking-Konfiguration

Für Modelle mit Thinking-Unterstützung (`*-thinking`):

```json
{
  "generationConfig": {
    "maxOutputTokens": 10000,
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

::: warning Wichtige Einschränkung
`maxOutputTokens` muss **größer** als `thinkingBudget` sein
:::

### Thinking-Antwort (Gemini)

Gemini-Modelle geben signiertes Thinking zurück:

```json
{
  "parts": [
    {
      "thoughtSignature": "ErADCq0DAXLI2nx...",
      "text": "Let me think about this..."
    },
    {
      "text": "The answer is..."
    }
  ]
}
```

### Thinking-Antwort (Claude)

Claude Thinking-Modelle können `thought: true`-Teile enthalten:

```json
{
  "parts": [
    {
      "thought": true,
      "text": "Reasoning process...",
      "thoughtSignature": "..."
    },
    {
      "text": "Final answer..."
    }
  ]
}
```

**Plugin-Behandlung**: Das Plugin cached Thinking-Signaturen automatisch, um Signaturfehler in Multi-Turn-Konversationen zu vermeiden. Siehe [advanced/session-recovery/](/de/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/).

---

## Fehlerantworten

### Fehlerstruktur

```json
{
  "error": {
    "code": 400,
    "message": "Error description",
    "status": "INVALID_ARGUMENT",
    "details": [...]
  }
}
```

### Häufige Fehlercodes

| Code | Status | Beschreibung |
| --- | --- | --- |
| 400 | `INVALID_ARGUMENT` | Ungültiges Request-Format |
| 401 | `UNAUTHENTICATED` | Ungültiges oder abgelaufenes Token |
| 403 | `PERMISSION_DENIED` | Keine Zugriffsberechtigung auf Ressource |
| 404 | `NOT_FOUND` | Modell nicht gefunden |
| 429 | `RESOURCE_EXHAUSTED` | Rate Limit überschritten |

### Rate-Limit-Antwort

```json
{
  "error": {
    "code": 429,
    "message": "You have exhausted your capacity on this model. Your quota will reset after 3s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "3.957525076s"
      }
    ]
  }
}
```

**Plugin-Behandlung**: Das Plugin erkennt 429-Fehler automatisch und wechselt das Konto oder wartet die Reset-Zeit ab. Siehe [advanced/rate-limit-handling/](/de/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/).

---

## Nicht unterstützte Funktionen

Folgende Anthropic/Vertex AI-Funktionen werden **nicht unterstützt**:

| Funktion | Fehler |
| --- | --- |
| `anthropic_version` | Unknown field |
| `messages`-Array | Unknown field (muss `contents` verwenden) |
| `max_tokens` | Unknown field (muss `maxOutputTokens` verwenden) |
| Reiner String `systemInstruction` | Invalid value (muss Objektformat verwenden) |
| `system_instruction` (Root-Level snake_case) | Unknown field |
| JSON Schema `const` | Unknown field (verwenden Sie `enum: [value]` stattdessen) |
| JSON Schema `$ref` | Nicht unterstützt (Inline-Definitionen) |
| JSON Schema `$defs` | Nicht unterstützt (Inline-Definitionen) |
| Tool-Name mit `/` | Invalid (verwenden Sie `_` oder `:` stattdessen) |
| Tool-Name beginnt mit Zahl | Invalid (muss mit Buchstabe oder Unterstrich beginnen) |

---

## Vollständiges Request-Beispiel

```json
{
  "project": "my-project-id",
  "model": "claude-sonnet-4-5",
  "request": {
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Hello, how are you?" }
        ]
      }
    ],
    "systemInstruction": {
      "parts": [
        { "text": "You are a helpful assistant." }
      ]
    },
    "generationConfig": {
      "maxOutputTokens": 1000,
      "temperature": 0.7
    }
  },
  "userAgent": "antigravity",
  "requestId": "agent-abc123"
}
```

---

## Response-Headers

| Header | Beschreibung |
| --- | --- |
| `x-cloudaicompanion-trace-id` | Trace-ID für Debugging |
| `server-timing` | Request-Dauer |

---

## Antigravity vs Vertex AI Anthropic-Vergleich

| Funktion | Antigravity | Vertex AI Anthropic |
| --- | --- | --- |
| Endpunkt | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| Request-Format | Gemini-Style `contents` | Anthropic `messages` |
| `anthropic_version` | Nicht verwendet | Erforderlich |
| Modellname | Einfach (`claude-sonnet-4-5`) | Versioniert (`claude-4-5@date`) |
| Response-Format | `candidates[]` | Anthropic `content[]` |
| Multi-Modell-Unterstützung | Ja (Claude, Gemini usw.) | Nur Anthropic |

---

## Zusammenfassung dieser Lektion

Dieses Tutorial hat die interne Spezifikation der Antigravity Unified Gateway API detailliert vorgestellt:

- **Endpunkte**: Drei Umgebungen (Daily, Production, Autopush), Daily Sandbox ist der Haupt-Endpunkt
- **Authentifizierung**: OAuth 2.0 + Bearer Token, erforderliche Scopes und Headers
- **Request-Format**: Gemini-Style `contents`-Array, unterstützt System Instruction und Tools
- **JSON Schema**: Unterstützt gängige Funktionen, aber nicht `const`, `$ref`, `$defs`
- **Response-Format**: `candidates[]`-Struktur, unterstützt Streaming-SSE
- **Thinking**: Claude und Gemini 3 unterstützen erweitertes Reasoning, benötigen `thinkingConfig`
- **Fehlerbehandlung**: Standard-Fehlerformat, 429 enthält Retry-Verzögerung

Wenn Sie API-Aufrufprobleme debuggen, können Sie den Debug-Modus des Plugins verwenden:

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## Vorschau auf die nächste Lektion

> Dies ist die letzte Lektion im Anhang. Wenn Sie mehr technische Details erfahren möchten, können Sie Folgendes lesen:
> - [Architekturübersicht](/de/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) - Erfahren Sie mehr über die Modularchitektur und Aufrufketten des Plugins
> - [Speicherformat](/de/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) - Erfahren Sie mehr über das Konto-Speicherdateiformat
> - [Konfigurationsoptionen](/de/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) - Vollständiges Referenzhandbuch aller Konfigurationsoptionen

Wenn Sie zur Einstiegsphase zurückkehren möchten, können Sie bei [Was ist Antigravity Auth](/de/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/) neu beginnen.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Speicherorte anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| API-Endpunkt-Konstanten | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Antigravity-Headers | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Gemini CLI-Headers | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| OAuth-Scopes | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| Request-Transformations-Hauptlogik | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| JSON-Schema-Bereinigung | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | Gesamte Datei |
| Thinking-Signatur-Cache | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | Gesamte Datei |

**Wichtige Konstanten**:
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Daily Sandbox-Endpunkt
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Production-Endpunkt
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - Standard-Projekt-ID
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - Sentinel-Wert zum Überspringen der Thinking-Signatur-Validierung

**Wichtige Funktionen**:
- `cleanJSONSchemaForAntigravity(schema)` - Bereinigt JSON-Schema für Antigravity API-Anforderungen
- `prepareAntigravityRequest(request)` - Bereitet Antigravity API-Request vor und sendet ihn
- `createStreamingTransformer()` - Erstellt Streaming-Response-Transformer

</details>
