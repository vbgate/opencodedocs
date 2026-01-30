---
title: "API-Referenz: Lokale Schnittstellendokumentation | plannotator"
sidebarTitle: "API auf einen Blick"
subtitle: "API-Referenz: Lokale Schnittstellendokumentation | plannotator"
description: "Erfahren Sie alles über die API-Endpunkte von Plannotator sowie die Request/Response-Formate. Vollständige Spezifikationen für Plan-Review, Code-Review und Bild-Upload – ideal für die Integrationsentwicklung."
tags:
  - "API"
  - "Anhang"
prerequisite:
  - "start-getting-started"
order: 1
---

# Plannotator API-Referenz

## Was Sie lernen werden

- Alle API-Endpunkte des lokalen Plannotator-Servers kennenlernen
- Request- und Response-Formate jeder API verstehen
- Die Unterschiede zwischen Plan-Review- und Code-Review-Schnittstellen nachvollziehen
- Referenzmaterial für Integration und Erweiterungsentwicklung nutzen

## Übersicht

Plannotator betreibt einen lokalen HTTP-Server (mit Bun.serve) und stellt RESTful APIs für Plan-Review und Code-Review bereit. Alle API-Antworten sind im JSON-Format, eine Authentifizierung ist nicht erforderlich (isolierte lokale Umgebung).

**Server-Startmodi**:
- Zufälliger Port (lokaler Modus)
- Fester Port 19432 (Remote-/Devcontainer-Modus, überschreibbar mit `PLANNOTATOR_PORT`)

**API-Basis-URL**: `http://localhost:<PORT>/api/`

::: tip Hinweis
Die folgenden APIs sind nach Funktionsmodulen kategorisiert. Derselbe Pfad kann sich bei Plan-Review- und Code-Review-Servern unterschiedlich verhalten.
:::

## Plan-Review-API

### GET /api/plan

Ruft den aktuellen Planinhalt und zugehörige Metainformationen ab.

**Request**: Keiner

**Response-Beispiel**:

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `plan` | string | Markdown-Inhalt des Plans |
| `origin` | string | Herkunftskennung (`"claude-code"` oder `"opencode"`) |
| `permissionMode` | string | Aktueller Berechtigungsmodus (nur Claude Code) |
| `sharingEnabled` | boolean | Ob URL-Sharing aktiviert ist |

---

### POST /api/approve

Genehmigt den aktuellen Plan mit optionaler Speicherung in einer Notiz-App.

**Request-Body**:

```json
{
  "obsidian": {
    "vaultPath": "/Users/xxx/Documents/Obsidian",
    "folder": "Plans",
    "tags": ["plannotator"],
    "plan": "Plan content..."
  },
  "bear": {
    "plan": "Plan content..."
  },
  "feedback": "Anmerkung bei Genehmigung (nur OpenCode)",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Response-Beispiel**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**Feldbeschreibungen**:

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `obsidian` | object | Nein | Obsidian-Speicherkonfiguration |
| `bear` | object | Nein | Bear-Speicherkonfiguration |
| `feedback` | string | Nein | Anmerkung bei Genehmigung (nur OpenCode) |
| `agentSwitch` | string | Nein | Name des zu wechselnden Agents (nur OpenCode) |
| `permissionMode` | string | Nein | Angeforderter Berechtigungsmodus (nur Claude Code) |
| `planSave` | object | Nein | Plan-Speicherkonfiguration |

**Obsidian-Konfigurationsfelder**:

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `vaultPath` | string | Ja | Vault-Dateipfad |
| `folder` | string | Nein | Zielordner (Standard: Stammverzeichnis) |
| `tags` | string[] | Nein | Automatisch generierte Tags |
| `plan` | string | Ja | Planinhalt |

---

### POST /api/deny

Lehnt den aktuellen Plan ab und gibt Feedback.

**Request-Body**:

```json
{
  "feedback": "Unit-Test-Abdeckung muss ergänzt werden",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Response-Beispiel**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**Feldbeschreibungen**:

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `feedback` | string | Nein | Ablehnungsgrund (Standard: "Plan rejected by user") |
| `planSave` | object | Nein | Plan-Speicherkonfiguration |

---

### GET /api/obsidian/vaults

Erkennt lokal konfigurierte Obsidian Vaults.

**Request**: Keiner

**Response-Beispiel**:

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**Konfigurationsdateipfade**:
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Windows: `%APPDATA%\obsidian\obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`

---

## Code-Review-API

### GET /api/diff

Ruft den aktuellen Git-Diff-Inhalt ab.

**Request**: Keiner

**Response-Beispiel**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "HEAD",
  "origin": "opencode",
  "diffType": "uncommitted",
  "gitContext": {
    "currentBranch": "feature/auth",
    "defaultBranch": "main",
    "diffOptions": [
      { "id": "uncommitted", "label": "Uncommitted changes" },
      { "id": "last-commit", "label": "Last commit" },
      { "id": "branch", "label": "vs main" }
    ]
  },
  "sharingEnabled": true
}
```

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `rawPatch` | string | Git-Diff im Unified-Format |
| `gitRef` | string | Verwendete Git-Referenz |
| `origin` | string | Herkunftskennung |
| `diffType` | string | Aktueller Diff-Typ |
| `gitContext` | object | Git-Kontextinformationen |
| `sharingEnabled` | boolean | Ob URL-Sharing aktiviert ist |

**gitContext-Feldbeschreibungen**:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `currentBranch` | string | Aktueller Branch-Name |
| `defaultBranch` | string | Standard-Branch-Name (main oder master) |
| `diffOptions` | object[] | Verfügbare Diff-Typ-Optionen (mit id und label) |

---

### POST /api/diff/switch

Wechselt zu einem anderen Git-Diff-Typ.

**Request-Body**:

```json
{
  "diffType": "staged"
}
```

**Unterstützte Diff-Typen**:

| Typ | Git-Befehl | Beschreibung |
| --- | --- | --- |
| `uncommitted` | `git diff HEAD` | Nicht committete Änderungen (Standard) |
| `staged` | `git diff --staged` | Gestagete Änderungen |
| `last-commit` | `git diff HEAD~1..HEAD` | Letzter Commit |
| `vs main` | `git diff main..HEAD` | Aktueller Branch vs. main |

**Response-Beispiel**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

Sendet Code-Review-Feedback an den AI-Agent.

**Request-Body**:

```json
{
  "feedback": "Fehlerbehandlungslogik sollte hinzugefügt werden",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "Hier sollte try-catch verwendet werden",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**Feldbeschreibungen**:

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `feedback` | string | Nein | Text-Feedback (LGTM oder anderes) |
| `annotations` | array | Nein | Array strukturierter Anmerkungen |
| `agentSwitch` | string | Nein | Name des zu wechselnden Agents (nur OpenCode) |

**annotation-Objektfelder**:

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `id` | string | Ja | Eindeutige Kennung |
| `type` | string | Ja | Typ: `comment`, `suggestion`, `concern` |
| `filePath` | string | Ja | Dateipfad |
| `lineStart` | number | Ja | Startzeile |
| `lineEnd` | number | Ja | Endzeile |
| `side` | string | Ja | Seite: `"old"` oder `"new"` |
| `text` | string | Nein | Kommentarinhalt |
| `suggestedCode` | string | Nein | Vorgeschlagener Code (für suggestion-Typ) |

**Response-Beispiel**:

```json
{
  "ok": true
}
```

---

## Gemeinsame APIs

### GET /api/image

Ruft ein Bild ab (lokaler Dateipfad oder hochgeladene temporäre Datei).

**Request-Parameter**:

| Parameter | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `path` | string | Ja | Bilddateipfad |

**Beispiel-Request**: `GET /api/image?path=/tmp/plannotator/abc-123.png`

**Response**: Bilddatei (PNG/JPEG/WebP)

**Fehler-Responses**:
- `400` - Fehlender path-Parameter
- `404` - Datei nicht gefunden
- `500` - Fehler beim Lesen der Datei

---

### POST /api/upload

Lädt ein Bild in ein temporäres Verzeichnis hoch und gibt den zugänglichen Pfad zurück.

**Request**: `multipart/form-data`

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `file` | File | Ja | Bilddatei |

**Unterstützte Formate**: PNG, JPEG, WebP

**Response-Beispiel**:

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**Fehler-Responses**:
- `400` - Keine Datei bereitgestellt
- `500` - Upload fehlgeschlagen

::: info Hinweis
Hochgeladene Bilder werden im Verzeichnis `/tmp/plannotator` gespeichert und nach dem Herunterfahren des Servers nicht automatisch bereinigt.
:::

---

### GET /api/agents

Ruft die Liste der verfügbaren OpenCode-Agents ab (nur OpenCode).

**Request**: Keiner

**Response-Beispiel**:

```json
{
  "agents": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable model for complex tasks"
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "description": "Fast and efficient multimodal model"
    }
  ]
}
```

**Filterregeln**:
- Gibt nur Agents mit `mode === "primary"` zurück
- Schließt Agents mit `hidden === true` aus

**Fehler-Response**:

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## Fehlerbehandlung

### HTTP-Statuscodes

| Statuscode | Beschreibung |
| --- | --- |
| `200` | Anfrage erfolgreich |
| `400` | Parametervalidierung fehlgeschlagen |
| `404` | Ressource nicht gefunden |
| `500` | Interner Serverfehler |

### Fehler-Response-Format

```json
{
  "error": "Fehlerbeschreibung"
}
```

### Häufige Fehler

| Fehler | Auslösebedingung |
| --- | --- |
| `Missing path parameter` | `/api/image` fehlt der `path`-Parameter |
| `File not found` | Die in `/api/image` angegebene Datei existiert nicht |
| `No file provided` | `/api/upload` ohne hochgeladene Datei |
| `Missing diffType` | `/api/diff/switch` fehlt das `diffType`-Feld |
| `Port ${PORT} in use` | Port bereits belegt (Server-Start fehlgeschlagen) |

---

## Server-Verhalten

### Port-Wiederholungsmechanismus

- Maximale Wiederholungsversuche: 5
- Wiederholungsverzögerung: 500 Millisekunden
- Timeout-Fehler: `Port ${PORT} in use after 5 retries`

::: warning Hinweis für Remote-Modus
Im Remote-/Devcontainer-Modus können Sie bei belegtem Port die Umgebungsvariable `PLANNOTATOR_PORT` setzen, um einen anderen Port zu verwenden.
:::

### Entscheidungswartezustand

Nach dem Serverstart wartet der Server auf eine Benutzerentscheidung:

**Plan-Review-Server**:
- Wartet auf `/api/approve`- oder `/api/deny`-Aufruf
- Nach dem Aufruf wird die Entscheidung zurückgegeben und der Server heruntergefahren

**Code-Review-Server**:
- Wartet auf `/api/feedback`-Aufruf
- Nach dem Aufruf wird das Feedback zurückgegeben und der Server heruntergefahren

### SPA-Fallback

Alle nicht übereinstimmenden Pfade geben eingebettetes HTML zurück (Single Page Application):

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

Dies stellt sicher, dass das Frontend-Routing korrekt funktioniert.

---

## Umgebungsvariablen

| Variable | Beschreibung | Standardwert |
| --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Aktiviert Remote-Modus | Nicht gesetzt |
| `PLANNOTATOR_PORT` | Feste Portnummer | Zufällig (lokal) / 19432 (remote) |
| `PLANNOTATOR_ORIGIN` | Herkunftskennung | `"claude-code"` oder `"opencode"` |
| `PLANNOTATOR_SHARE` | Deaktiviert URL-Sharing | Nicht gesetzt (aktiviert) |

::: tip Hinweis
Weitere Umgebungsvariablen-Konfigurationen finden Sie im Kapitel [Umgebungsvariablen-Konfiguration](../../advanced/environment-variables/).
:::

---

## Zusammenfassung

Plannotator bietet eine vollständige lokale HTTP-API, die zwei Kernfunktionen unterstützt: Plan-Review und Code-Review:

- **Plan-Review-API**: Plan abrufen, Genehmigungs-/Ablehnungsentscheidungen, Obsidian/Bear-Integration
- **Code-Review-API**: Diff abrufen, Diff-Typ wechseln, strukturiertes Feedback senden
- **Gemeinsame APIs**: Bild-Upload/-Download, Agent-Listen-Abfrage
- **Fehlerbehandlung**: Einheitliche HTTP-Statuscodes und Fehlerformate

Alle APIs laufen lokal, ohne Daten-Upload – sicher und zuverlässig.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Plan-Review-Server-Einstiegspunkt | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents (Plan-Review) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| Code-Review-Server-Einstiegspunkt | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents (Code-Review) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**Wichtige Konstanten**:
- `MAX_RETRIES = 5`: Maximale Wiederholungsversuche beim Serverstart (`packages/server/index.ts:79`, `packages/server/review.ts:68`)
- `RETRY_DELAY_MS = 500`: Port-Wiederholungsverzögerung (`packages/server/index.ts:80`, `packages/server/review.ts:69`)

**Wichtige Funktionen**:
- `startPlannotatorServer(options)`: Startet den Plan-Review-Server (`packages/server/index.ts:91`)
- `startReviewServer(options)`: Startet den Code-Review-Server (`packages/server/review.ts:79`)

</details>
